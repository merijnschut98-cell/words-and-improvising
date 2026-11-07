// Dev tool, not shipped. Builds the standalone figure for the topic Opspanning
// en meten (module Verspanen): the lessons eng.machining.fixtures (level 1) and
// eng.machining.quality (level 2). Levels 3 and 4 have their own figure
// (eng.machining.cmm); this page opens its level 2 state for them.
//
//   node figures/eng.machining.fixture/build.mjs            build the page
//   node figures/eng.machining.fixture/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.fixture.html: one offline
// page with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL (defaults:
// prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.fixture.html");

// ---------------------------------------------------------------- the model
// The aluminium housing of the lesson "fixtures" (2 mm walls, a bore Ø40 H7
// that allows 0.025 mm) sits in a fixture (mal) on a zero-point pallet.
//
// Level 1, locating (3-2-1 principle, any fixture design handbook): every
// locator is a point contact with a normal n at a point p. Its constraint row
// on the part's twist (v, ω) about O is [n, (p − O) × n]. The rank of the rows
// is the number of degrees of freedom held; the null space holds the motions
// still free. Three rest buttons A (normal +z), two side pins B (−y), one end
// stop C (−x): rank 6. Take any one away and the part has one motion left.
//
// Level 2, clamping and measuring (lessons "fixtures" and "quality"):
//   hold force      H = 2 · μ · F, μ = 0.15 (aluminium on hardened steel, two
//                   faces: the rest buttons and the clamp); the part shifts
//                   under a finishing cut of 0.6 kN when H < 0.6 kN (assumed).
//   out-of-round after release  δ = F / k, linear spring-back, calibrated on
//                   the lesson's two cases: clamped hard (12 kN) on the 2 mm
//                   wall → 0.04 mm (reject); on the thick flange with a torque
//                   wrench (6 kN) → 0.008 mm. k wall 0.3, flange 0.75 kN/µm.
//   tolerance       Ø40 H7: 40.000 … 40.025 mm (25 µm); round while clamped.
//   bore gauge      reads 0.001 mm: ten times finer than the 25 µm tolerance
//                   (the lesson's 10 % rule for the instrument).
//   temperature     aluminium grows 0.023 mm per m per °C: the Ø40 bore
//                   measured at 30 °C reads 0.04 · 0.023 · 10 = 0.009 mm big.
//   a chip under a rest button tilts the part 0.05 mm (lesson).
// Drawing: out-of-round shown 150× and the chip's tilt 80× enlarged.
const MU = 0.15;
const CUT = 0.6; // kN
const F_LIST = [1, 2, 4, 6, 8, 10, 12];
const K_SPOT = { wall: 0.3, flange: 0.75 }; // kN per µm
const TOL = 25; // µm, Ø40 H7
const D0 = 12; // µm above 40.000 at 20 °C
const ALU = 0.023; // mm per m per °C
const STEEL = 0.0115;
const BORE = 40;
const WARM = 30;
const CHIP = 0.05; // mm
const GAUGE = 0.001; // mm
const OVAL_X = 150;
const TILT_X = 80;
const holdOf = (f) => 2 * MU * f;
const ovalOf = (f, at) => f / K_SPOT[at];
const warmOf = (dt) => (BORE / 1000) * ALU * dt * 1000; // µm
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(ovalOf(12, "wall"), 40, 1e-9, "lesson: hard on the wall 0.04 mm");
near(ovalOf(6, "flange"), 8, 1e-9, "lesson: flange with torque wrench 0.008 mm");
if (!(ovalOf(12, "wall") > TOL && ovalOf(6, "flange") < TOL)) throw new Error("lesson: reject / within");
near(warmOf(WARM - 20), 9.2, 1e-9, "bore measured warm");
near(0.5 * ALU * 10, 0.115, 1e-12, "recall: 500 mm aluminium at 30 °C");
near(0.2 * STEEL * 10, 0.023, 1e-12, "lesson: 200 mm steel at 30 °C");
near(30 * STEEL * 15 / 1000, 0.005, 0.0002, "lesson: Ø30 shaft 15 °C colder");
near((TOL / 1000) / 10, 0.0025, 1e-12, "10 % rule: needed resolution");
if (GAUGE > (TOL / 1000) / 10) throw new Error("gauge too coarse");
near(holdOf(6), 1.8, 1e-9, "hold at 6 kN");
near(((90 - 25) * 8) / 60, 8.67, 0.01, "recall: setup 90 → 25 min, 8 per week");

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the part, +y toward the operator.
// The machine table top is z = 0.
const WIDTH = 600;
const TABLE = { x: -138, y: -104, w: 276, d: 190, r: 2 };
const ZPB = { x: -124, y: -92, w: 248, d: 166, r: 3 };
const ZPB_TOP = 16;
const MOD_TOP = 22;
const PLATE = { x: -112, y: -80, w: 224, d: 144, r: 2.5 };
const PZ = 40; // fixture plate top
const PB = 54; // part bottom (on the rest buttons)
const FL = { x: -70, y: -45, w: 140, d: 90, r: 1.2 };
const FT = 66; // flange top
const BODY = { x: -38, y: -35, w: 76, d: 70, r: 1.2 };
const BT = 96; // body top, the bore face
const O = [0, 0, 75]; // twist reference point
const LOC = {
  A1: { p: [-60, 28, PB], n: [0, 0, 1] },
  A2: { p: [60, 36, PB], n: [0, 0, 1] },
  A3: { p: [60, -36, PB], n: [0, 0, 1] },
  B1: { p: [-40, 45, 60], n: [0, -1, 0] },
  B2: { p: [40, 45, 60], n: [0, -1, 0] },
  C: { p: [70, 12, 60], n: [-1, 0, 0] },
};
const LOC_KEYS = Object.keys(LOC);
const STRAPS = [
  { key: "L", y: 33, x0: -98, x1: -56, stud: -80, heel: [-100, -90] },
  { key: "R", y: -12, x0: 56, x1: 98, stud: 80, heel: [90, 100] },
];
const LIFT = 7; // strap lift when released
const BACK = 5; // push-screw retract
const GZ = { grip: [108, 128], neck: [128, 134], dial: [134, 142], r: 15 };

// ---------------------------------------------------------------- the 3-2-1 solver (shared with the page)
function dofOf(keys, LOC, O) {
  const rows = keys.map((key) => {
    const { p, n } = LOC[key];
    const r = [p[0] - O[0], p[1] - O[1], p[2] - O[2]];
    return [n[0], n[1], n[2], r[1] * n[2] - r[2] * n[1], r[2] * n[0] - r[0] * n[2], r[0] * n[1] - r[1] * n[0]];
  });
  const m = rows.map((row) => row.slice());
  const pivots = [];
  let at = 0;
  for (let c = 0; c < 6 && at < m.length; c++) {
    let best = at;
    for (let i = at + 1; i < m.length; i++) if (Math.abs(m[i][c]) > Math.abs(m[best][c])) best = i;
    if (Math.abs(m[best][c]) < 1e-9) continue;
    [m[at], m[best]] = [m[best], m[at]];
    const div = m[at][c];
    for (let j = 0; j < 6; j++) m[at][j] /= div;
    for (let i = 0; i < m.length; i++) {
      if (i === at) continue;
      const f = m[i][c];
      if (f) for (let j = 0; j < 6; j++) m[i][j] -= f * m[at][j];
    }
    pivots.push(c);
    at++;
  }
  const free = [];
  for (let c = 0; c < 6; c++) {
    if (pivots.includes(c)) continue;
    const s = [0, 0, 0, 0, 0, 0];
    s[c] = 1;
    pivots.forEach((pc, i) => (s[pc] = -m[i][c]));
    free.push(s);
  }
  return { held: pivots.length, free };
}
// a free motion in words: [kind, axis] with kind "slide", "turn" (about the
// vertical) or "tilt" (about a horizontal axis)
function kindOf(s) {
  const v = Math.hypot(s[0], s[1], s[2]);
  const w = Math.hypot(s[3], s[4], s[5]);
  const big = (a, b, c) => (Math.abs(a) >= Math.abs(b) && Math.abs(a) >= Math.abs(c) ? 0 : Math.abs(b) >= Math.abs(c) ? 1 : 2);
  if (w * 60 < 0.2 * v) return ["slide", "XYZ"[big(s[0], s[1], s[2])]];
  const axis = big(s[3], s[4], s[5]);
  return [axis === 2 ? "turn" : "tilt", "XYZ"[axis]];
}
{
  const all = dofOf(LOC_KEYS, LOC, O);
  if (all.held !== 6) throw new Error("3-2-1 must hold 6");
  const expect = { A1: "tilt", A2: "tilt", A3: "tilt", B1: "turn", B2: "turn", C: "slide" };
  for (const key of LOC_KEYS) {
    const r = dofOf(LOC_KEYS.filter((x) => x !== key), LOC, O);
    if (r.held !== 5 || r.free.length !== 1) throw new Error(`without ${key}: ${r.held}`);
    if (kindOf(r.free[0])[0] !== expect[key]) throw new Error(`without ${key}: ${kindOf(r.free[0])}`);
  }
  if (dofOf(["A1", "A2", "A3"], LOC, O).held !== 3) throw new Error("three rest buttons hold 3");
}

// ---------------------------------------------------------------- camera
const FIT = [
  ...k.boxCorners(TABLE, -22, 0),
  ...k.boxCorners({ x: -GZ.r - 1, y: -GZ.r - 1, w: 2 * GZ.r + 2, d: 2 * GZ.r + 2 }, GZ.dial[0], GZ.dial[1] + 1),
  ...k.boxCorners(BODY, FT, BT),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 58);
const ELEVATION = Number(process.env.EL ?? 30);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);

// ---------------------------------------------------------------- recorder
const MOVES = { strap: [0, 0, LIFT], padF: [0, -BACK, 0], padW: [0, -BACK, 0], padC: [-BACK, 0, 0] };
const R = A.recorder(P, { order: Object.keys(MOVES), spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVES[piece] : [0, 0, 0], attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, cut, ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
// a push screw sliding out of its threaded bush: drawn from the bush face to
// its end, shorter by the retract; the page swaps in the frame it needs
const RODS = {};
function rod(name, F, from, to, r, { owner, piece, key }) {
  const shape = R.solid(A.slide(F, from, to, r, { name, owner }));
  const frames = Array.from({ length: 7 }, (_, i) => k.solidSvg(G.disc(from, to - (BACK * i) / 6, r, F, P), { tone: "mid", crease: "none" }));
  solids++;
  RODS[key] = frames;
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), `<g data-rod="${key}">${frames[0]}</g>`, [shape], { piece });
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- the part, drawn from its pose (shared with the page)
// Two boxes (flange and body) and the bore, moved by a small twist about O:
// p' = p + v + ω × (p − O). Faces facing the viewer are shaded like the kit's
// extrude; the bore is an ellipse on the body top, out-of-round by (a, b).
function partSvg(K, P, pose, bore) {
  const { sinA, cosA, sinE, cosE } = K.cameraOf(P);
  const V = [cosA * cosE, sinA * cosE, sinE];
  const Lt = [-sinA, cosA];
  const O = pose.o, v = pose.v, w = pose.w;
  const move = (p) => {
    const r = [p[0] - O[0], p[1] - O[1], p[2] - O[2]];
    return [p[0] + v[0] + w[1] * r[2] - w[2] * r[1], p[1] + v[1] + w[2] * r[0] - w[0] * r[2], p[2] + v[2] + w[0] * r[1] - w[1] * r[0]];
  };
  const turn = (n) => [n[0] + w[1] * n[2] - w[2] * n[1], n[1] + w[2] * n[0] - w[0] * n[2], n[2] + w[0] * n[1] - w[1] * n[0]];
  const f1 = (a) => Math.round(a * 10) / 10;
  const path = (pts, close) => pts.map((p, i) => (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1])).join("") + (close ? "Z" : "");
  const hull = (pts) => {
    const s = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of s) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of s.slice().reverse()) { while (hi.length > 1 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  };
  function boxOf({ x, y, w: bw, d }, z0, z1, top) {
    const c = [];
    for (let i = 0; i < 8; i++) c.push(move([i & 1 ? x + bw : x, i & 2 ? y + d : y, i & 4 ? z1 : z0]));
    const sc = c.map((p) => K.iso(p, P));
    // faces: axis, side (0 low, 1 high), corner indices in loop order
    const faces = [
      [0, 0, [0, 2, 6, 4]], [0, 1, [1, 3, 7, 5]],
      [1, 0, [0, 1, 5, 4]], [1, 1, [2, 3, 7, 6]],
      [2, 0, [0, 1, 3, 2]], [2, 1, [4, 5, 7, 6]],
    ].map(([ax, side, idx]) => {
      const n0 = [0, 0, 0];
      n0[ax] = side ? 1 : -1;
      const n = turn(n0);
      return { ax, side, idx, n, show: n[0] * V[0] + n[1] * V[1] + n[2] * V[2] > 1e-6 };
    });
    const face = (ax, side) => faces[ax * 2 + side];
    const shades = [[], [], [], []];
    let topD = "";
    for (const f of faces) {
      if (!f.show) continue;
      const d = path(f.idx.map((i) => sc[i]), true);
      if (f.ax === 2) { topD += d; continue; }
      const lit = (f.n[0] * Lt[0] + f.n[1] * Lt[1] + 1) / 2;
      shades[Math.min(3, Math.max(0, Math.floor(lit * 4)))].push(d);
    }
    const outline = [], crease = [];
    for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) for (let sa = 0; sa < 2; sa++) for (let sb = 0; sb < 2; sb++) {
      const fa = face(a, sa), fb = face(b, sb);
      const ends = [];
      for (let i = 0; i < 8; i++) if (((i >> a) & 1) === sa && ((i >> b) & 1) === sb) ends.push(i);
      const d = path(ends.map((i) => sc[i]));
      if (fa.show !== fb.show) outline.push(d);
      else if (fa.show && (a === 2 || b === 2)) crease.push(d);
    }
    return [
      '<path class="iso-fill" d="' + path(hull(sc), true) + '"/>',
      ...shades.map((list, i) => (list.length ? '<path class="iso-shade" data-shade="' + i + '" d="' + list.join("") + '"/>' : "")),
      '<path class="iso-top" d="' + topD + '"/>',
      '<path class="iso-line iso-crease" data-tone="lo" d="' + crease.join("") + '"/>',
      top,
      '<path class="iso-line iso-edge" data-tone="hi" d="' + outline.join("") + '"/>',
    ].join("");
  }
  const ring = (cx, cy, rx, ry, z, steps) => {
    const pts = [];
    for (let i = 0; i < steps; i++) { const t = (i / steps) * Math.PI * 2; pts.push(K.iso(move([cx + rx * Math.cos(t), cy + ry * Math.sin(t), z]), P)); }
    return path(pts, true);
  };
  const seg = (a, b) => path([K.iso(move(a), P), K.iso(move(b), P)]);
  const F = pose.flange, B = pose.body;
  const holes = pose.holes.map(([x, y]) => ring(x, y, 2.4, 2.4, pose.ft, 14)).join("");
  const flangeTop = '<path class="iso-line" data-tone="lo" d="' + holes + '"/>';
  const g = 2; // wall thickness: the lid seam inset on the top
  const lid = path([[B.x + g, B.y + g], [B.x + B.w - g, B.y + g], [B.x + B.w - g, B.y + B.d - g], [B.x + g, B.y + B.d - g]].map(([x, y]) => K.iso(move([x, y, pose.bt]), P)), true);
  const boreD = ring(0, 0, bore.a, bore.b, pose.bt, 56);
  const bodyTop = '<path class="iso-line" data-tone="faint" d="' + lid + '"/>' +
    '<path class="iso-line" data-tone="faint" d="' + ring(0, 0, bore.a + 1.6, bore.b + 1.6, pose.bt, 56) + '"/>' +
    '<path class="fx-well" d="' + boreD + '"/>' +
    '<path class="iso-line" data-tone="hi" d="' + boreD + '"/>';
  return '<g class="iso-solid">' + boxOf(F, pose.pb, pose.ft, flangeTop) + "</g>" + '<g class="iso-solid">' + boxOf(B, pose.ft, pose.bt, bodyTop) + "</g>";
}
const HOLES = [[-50, 40], [50, 40], [-50, -40], [50, -40]];
const POSE0 = { o: O, v: [0, 0, 0], w: [0, 0, 0], flange: FL, body: BODY, pb: PB, ft: FT, bt: BT, holes: HOLES };
const KB = { iso: k.iso, cameraOf: k.cameraOf };

// ---------------------------------------------------------------- table, zero-point base, fixture plate
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(TABLE, -3), -22, 2, P)}"/>`];
{
  // the machine table with three T-slots along x, seen in the margin
  const slots = [-98, 80].map((y) => k.pathOf(k.roundedPlan({ x: TABLE.x + 6, y: y - 3.5, w: TABLE.w - 12, d: 7, r: 1 }, 2).map(([x, yy]) => at([x, yy, 0])), true));
  const extra = `<path class="fx-well" d="${slots.join("")}"/>` + L(slots.join(""), { tone: "lo" });
  box("stand.table", TABLE, -22, 0, { tone: "lo" }, { steps: 2, bevel: 0.6, inner: L(k.sideSeam(TABLE, -8, P, 2), { tone: "faint" }), extra });
}
{
  // the zero-point base: bolted to the table, four clamping modules on top
  const bolts = [[-116, -84], [116, -84], [-116, 66], [116, 66]];
  box("zp.base", ZPB, 0, ZPB_TOP, { tone: "mid" }, {
    steps: 3,
    bevel: 0.6,
    inner: L(k.sideSeam(ZPB, 5, P, 3), { tone: "faint" }),
    extra: L(k.planOutline(k.insetPlan(ZPB, 3), ZPB_TOP, P, 3), { tone: "faint" }) + L(bolts.map(([x, y]) => k.ring(x, y, 4.2, ZPB_TOP, P, 16)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, ZPB_TOP])), { size: 0.5, tone: "hi" }),
  });
  for (const [x, y] of [[-80, -50], [80, -50], [-80, 50], [80, 50]]) {
    post("zp.module", x, y, 13, ZPB_TOP, MOD_TOP, { tone: "mid" }, { steps: 40, bevel: 0.4, extra: L(k.sideArc(x, y, 13, ZPB_TOP + 2.4, P, 24), { tone: "faint" }) });
  }
}
{
  // the fixture plate: a grid of tapped holes, two dowel holes, corner screws
  const grid = [];
  for (let x = -100; x <= 100; x += 20) for (let y = -70; y <= 54; y += 20) grid.push(k.ring(x, y, 2.2, PZ, P, 12));
  const screws = k.corners(PLATE, 5);
  // each locator sits in a socket that shows when it is taken away
  const sockets = [...["A1", "A2", "A3"].map((key) => LOC[key].p), [-40, 50], [40, 50], [75, LOC.C.p[1]]].map(([x, y]) => k.ring(x, y, 3, PZ, P, 16));
  const extra =
    L(grid.join(""), { tone: "faint" }) +
    L(sockets.join(""), { tone: "lo" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 2.8, PZ, P, 14)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, PZ])), { size: 0.45 });
  box("plate", PLATE, MOD_TOP, PZ, { tone: "mid" }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(PLATE, MOD_TOP + 4, P, 3), { tone: "faint" }), extra });
  // the fixture's tag plate on the near corner: three engraved rules
  const tag = { x: 74, y: 46, w: 30, d: 12, r: 0.8 };
  const rules = [49.5, 52, 54.5].map((y, i) => k.lineOnTop([tag.x + 4, y], [tag.x + [22, 16, 19][i], y], PZ + 0.6, P)).join("");
  box("plate.tag", tag, PZ, PZ + 0.6, { tone: "lo", crease: "none" }, { steps: 2, extra: L(rules, { tone: "lo", free: true }) + Dt([at([tag.x + 2, tag.y + 6, PZ + 0.6]), at([tag.x + tag.w - 2, tag.y + 6, PZ + 0.6])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- locators (3-2-1)
// the chip under A1 (level 2): a curled flake on the button top, drawn with it
let CHIP_SVG = "";
{
  const [x, y] = LOC.A1.p;
  const flake = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10, a = 0.4 + t * 4.2, r = 1.2 + 3.2 * t; flake.push(at([x + 1 + r * Math.cos(a), y + 2 + r * Math.sin(a) * 0.8, PB + 0.1])); }
  CHIP_SVG = `<g data-chip="" style="opacity:0"><path class="fx-chip" d="${k.pathOf(flake)}"/></g>`;
}
for (const key of ["A1", "A2", "A3"]) {
  const [x, y] = LOC[key].p;
  const g = ` data-loc="${key}"`;
  post("loc.bush", x, y, 8, PZ, PZ + 4, { tone: "mid" }, { steps: 32, owner: key, attrs: g });
  post("loc.button", x, y, 6, PZ + 4, PB, { tone: "hi", lit: true }, { steps: 32, bevel: 0.5, owner: key, attrs: g, extra: key === "A1" ? CHIP_SVG : "" });
}
for (const key of ["B1", "B2"]) {
  const [x] = LOC[key].p;
  const yc = 50;
  const g = ` data-loc="${key}"`;
  const foot = { x: x - 8, y: 45.6, w: 16, d: 12.4, r: 1 };
  box("loc.foot", foot, PZ, PZ + 6, { tone: "mid" }, { steps: 2, bevel: 0.3, owner: key, attrs: g, extra: Dt([at([x - 5, 54.5, PZ + 6]), at([x + 5, 54.5, PZ + 6])], { size: 0.45 }) });
  post("loc.pin", x, yc, 5, PZ + 6, 64, { tone: "hi", lit: true }, { steps: 32, bevel: 0.6, owner: key, attrs: g });
}
{
  const [, yc] = LOC.C.p;
  const xc = 75;
  const g = ` data-loc="C"`;
  const foot = { x: 70.6, y: yc - 8, w: 16, d: 16, r: 1 };
  box("loc.foot", foot, PZ, PZ + 6, { tone: "mid" }, { steps: 2, bevel: 0.3, owner: "C", attrs: g, extra: Dt([at([83, yc - 5, PZ + 6]), at([83, yc + 5, PZ + 6])], { size: 0.45 }) });
  post("loc.pin", xc, yc, 5, PZ + 6, 64, { tone: "hi", lit: true }, { steps: 32, bevel: 0.6, owner: "C", attrs: g });
}

// ---------------------------------------------------------------- strap clamps (on the flange, over the rest buttons)
for (const st of STRAPS) {
  const owner = "strap" + st.key;
  const { y, stud } = st;
  const heel = { x: st.heel[0], y: y - 7, w: st.heel[1] - st.heel[0], d: 14, r: 1 };
  box("strap.heel", heel, PZ, FT, { tone: "mid" }, { steps: 2, bevel: 0.3, owner, inner: L(k.sideSeam(heel, PZ + 13, P, 2), { tone: "faint" }) });
  // the stud reaches into the strap's slot; its threaded end shows above the nut
  post("strap.stud", stud, y, 4, PZ, FT, { tone: "mid", crease: "none" }, { steps: 20, owner });
  const bar = { x: st.x0, y: y - 7, w: st.x1 - st.x0, d: 14, r: 1.6 };
  const slot = k.pathOf(k.roundedPlan({ x: stud - 6.5, y: y - 4.6, w: 13, d: 9.2, r: 4.6 }, 6).map(([x, yy]) => at([x, yy, FT + 8])), true);
  box("strap.bar", bar, FT, FT + 8, { tone: "mid" }, { steps: 3, bevel: 0.5, owner, piece: "strap", attrs: ` data-strap="${st.key}"`, extra: L(slot, { tone: "lo" }) });
  post("strap.washer", stud, y, 7, FT + 8, FT + 9.6, { tone: "mid" }, { steps: 32, owner, piece: "strap", attrs: ` data-strap="${st.key}"` });
  post("strap.nut", stud, y, 6.6, FT + 9.6, FT + 15.6, { tone: "mid" }, { steps: 6, bevel: 0.3, owner, piece: "strap", attrs: ` data-strap="${st.key}"` });
  post("strap.thread", stud, y, 4, FT + 15.6, FT + 18, { tone: "mid", crease: "none" }, { steps: 20, owner, piece: "strap", attrs: ` data-strap="${st.key}"`, extra: Dt([at([stud, y, FT + 18])], { size: 0.45, tone: "hi" }) });
}

// ---------------------------------------------------------------- push screws: end (toward C) and back (toward B)
{
  const owner = "endclamp";
  const yc = LOC.C.p[1];
  const blk = { x: -106, y: yc - 10, w: 14, d: 20, r: 1 };
  box("push.end-block", blk, PZ, 74, { tone: "mid" }, { steps: 2, bevel: 0.4, owner, inner: L(k.sideSeam(blk, PZ + 4, P, 2), { tone: "faint" }), extra: Dt([at([-99, yc - 6, 74]), at([-99, yc + 6, 74])], { size: 0.45 }) });
  const F = frameX([0, yc, 60]);
  discAt("push.end-nut", F, -92, -90, 6.4, { tone: "mid" }, { owner, steps: 6 });
  rod("push.end-rod", F, -90, -75, 3.4, { owner, piece: "padC", key: "C" });
  discAt("push.end-pad", F, -75, -70, 5.5, { tone: "mid" }, { owner, piece: "padC", attrs: ' data-pad="C"' });
}
{
  const owner = "backclamp";
  const blk = { x: -16, y: -74, w: 32, d: 14, r: 1 };
  box("push.back-block", blk, PZ, 90, { tone: "mid" }, { steps: 2, bevel: 0.4, owner, inner: L(k.sideSeam(blk, PZ + 4, P, 2), { tone: "faint" }), extra: Dt([at([-11, -67, 90]), at([11, -67, 90])], { size: 0.45 }) });
  // lower screw: on the flange; upper screw: on the 2 mm wall
  const FLo = frameY([0, 0, 60]);
  discAt("push.back-nut", FLo, -60, -58, 6.4, { tone: "mid" }, { owner, steps: 6 });
  rod("push.back-rod", FLo, -58, -50, 3.4, { owner, piece: "padF", key: "F" });
  discAt("push.back-pad", FLo, -50, -45, 5.5, { tone: "mid" }, { owner, piece: "padF", attrs: ' data-pad="F"' });
  const FUp = frameY([0, 0, 82]);
  discAt("push.wall-nut", FUp, -60, -58, 6.4, { tone: "mid" }, { owner, steps: 6 });
  rod("push.wall-rod", FUp, -58, -40, 3.4, { owner, piece: "padW", key: "W" });
  discAt("push.wall-pad", FUp, -40, -35, 5.5, { tone: "mid" }, { owner, piece: "padW", attrs: ' data-pad="W"' });
}

// ---------------------------------------------------------------- the part (drawn live)
{
  const shapes = [R.solid(A.slab(FL, PB, FT - PB, { name: "part.flange" }, 2)), R.solid(A.slab(BODY, FT, BT - FT, { name: "part.body" }, 2))];
  put("part", [0, 0, (PB + BT) / 2], `<g data-part="">${partSvg(KB, P, POSE0, { a: BORE / 2, b: BORE / 2 })}</g>`, shapes);
}

// ---------------------------------------------------------------- the bore gauge (level 2)
{
  const owner = "gauge";
  const g = ' data-gauge=""';
  post("gauge.stem", 0, 0, 3.2, BT, GZ.grip[0], { tone: "mid", crease: "none" }, { steps: 20, owner, attrs: g });
  post("gauge.grip", 0, 0, 6.4, GZ.grip[0], GZ.grip[1], { tone: "mid" }, { steps: 32, bevel: 0.6, owner, attrs: g, extra: L(k.knurl(0, 0, 6.4, GZ.grip[0], GZ.grip[1], 40, P, 0.6), { tone: "lo" }) });
  post("gauge.neck", 0, 0, 3.6, GZ.neck[0], GZ.neck[1], { tone: "mid", crease: "none" }, { steps: 20, owner, attrs: g });
  const top = GZ.dial[1];
  const r = GZ.r;
  const ticks = k.radialTicks(0, 0, r - 2.4, 100, 10, top, [1, 2.4], P);
  // tolerance markers at 0 and +25 µm (one division is 0.001 mm)
  const mark = (um) => { const a = (um / 100) * Math.PI * 2; return k.lineOnTop([Math.sin(a) * (r - 1.6), -Math.cos(a) * (r - 1.6)], [Math.sin(a) * (r - 5.4), -Math.cos(a) * (r - 5.4)], top, P); };
  const face = [
    L(k.ring(0, 0, r - 1.6, top, P, 72), { tone: "lo" }),
    L(ticks.minor, { tone: "faint" }),
    L(ticks.major, { tone: "lo" }),
    `<path class="fx-tol" d="${mark(0)}${mark(TOL)}"/>`,
    L(k.ring(0, 0, 1.4, top, P, 14), { tone: "mid" }),
    `<path class="fx-needle" data-needle="" d=""/>`,
  ].join("");
  post("gauge.dial", 0, 0, r, GZ.dial[0], top, { tone: "hi", crease: "lo" }, { steps: 64, bevel: 0.8, owner, attrs: g, extra: face + L(k.knurl(0, 0, r, top - 3, top, 72, P, 0.3), { tone: "lo" }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een mal op een nulpuntspanner op de machinetafel. Op de grondplaat van de mal ligt een aluminium behuizing met een dikke flens, wanden van 2 mm en een boring van 40 mm. Het werkstuk ligt volgens het 3-2-1-principe: drie steunpunten onder de flens, twee positioneerpennen langs de voorkant en één aanslag aan het eind. Twee spanklauwen drukken de flens op de steunpunten, drukschroeven duwen hem tegen de pennen en de aanslag. Een boringmeter met een meetklok staat in de boring.";
const LABEL_EN =
  "A fixture on a zero-point base on the machine table. On the fixture plate lies an aluminium housing with a thick flange, 2 mm walls and a 40 mm bore. The part is located by the 3-2-1 principle: three rest buttons under the flange, two locating pins along the front and one end stop. Two strap clamps press the flange onto the rest buttons, push screws push it against the pins and the stop. A dial bore gauge stands in the bore.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "part", at: [-10, 35, 84] },
  { key: "flange", at: [-20, 45, 60] },
  { key: "bore", at: [0, 0, BT] },
  { key: "A1", at: [-60, 28, PB - 4] },
  { key: "A2", at: [60, 36, PB - 4] },
  { key: "A3", at: [60, -36, PB - 4] },
  { key: "B1", at: [-40, 50, 62] },
  { key: "B2", at: [40, 50, 62] },
  { key: "C", at: [75, 12, 62] },
  { key: "strap", at: [-77, 33, FT + 12] },
  { key: "strap", at: [77, -12, FT + 12] },
  { key: "endclamp", at: [-99, 12, 70] },
  { key: "backclamp", at: [0, -62, 88] },
  { key: "plate", at: [-60, 64, 31] },
  { key: "zp", at: [-20, 74, 8] },
  { key: "table", at: [-120, 92, 0] },
];

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --fx-hair:rgba(240,233,218,.12);--fx-accent:#5C9FAE;--fx-well:#0A1E23;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fx-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --fx-hair:rgba(11,41,27,.14);--fx-accent:#276F81;--fx-well:#DDD4BF;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--fx-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:128px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--fx-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--bottom:190px}
.iso-plate-corners{inset:12px 14px 10px 14px;--rows:1;--lines:3}
html[data-level="2"] .iso-plate-corners{--rows:2;--lines:4}
.iso-plate-corner{font-family:var(--fx-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 14px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 32px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.fx-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:1.45em}
.fx-acc{color:var(--fx-accent);font-weight:600}
.fx-strong{color:var(--anatomy-strong);font-weight:600}
.fx-mute{color:var(--anatomy-muted)}
.fx-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.fx-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.fx-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.fx-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.fx-row{display:flex;gap:4px;height:44px}
.fx-row[hidden]{display:none}
.fx-grp{display:flex;gap:4px;flex:1 1 auto;min-width:0}
.fx-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--fx-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--fx-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.fx-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.fx-btn[aria-checked="true"],.fx-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--fx-accent);color:var(--fx-accent);font-weight:600}
.fx-btn[data-loc][aria-pressed="false"]{color:var(--anatomy-muted);text-decoration:line-through}
.fx-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.fx-btn:disabled{opacity:.4;cursor:default}
.fx-val{flex:0 0 52px;display:inline-flex;align-items:center;justify-content:center;font:600 12px/1 var(--anatomy-mono);color:var(--anatomy-text)}
.fx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.fx-well{fill:var(--fx-well);stroke:none}
.fx-chip{fill:none;stroke:var(--fx-accent);stroke-width:1.1px;stroke-linecap:round;stroke-linejoin:round}
.fx-tol{fill:none;stroke:var(--fx-accent);stroke-width:1px;stroke-linecap:round}
.fx-needle{fill:none;stroke:var(--anatomy-lit);stroke-width:1px;stroke-linecap:round}
.fx-mark{fill:none;stroke:var(--fx-accent);stroke-width:1.4px}
.fx-mark-dot{fill:var(--fx-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
html[data-level="1"] [data-gauge],html[data-level="1"] [data-chip]{display:none}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const LOC = ${JSON.stringify(LOC)}, LOC_KEYS = ${JSON.stringify(LOC_KEYS)}, O = ${JSON.stringify(O)};
const POSE0 = ${JSON.stringify(POSE0)};
const PARTS = ${JSON.stringify(PARTS)};
const MU = ${MU}, CUT = ${CUT}, F_LIST = ${JSON.stringify(F_LIST)}, K_SPOT = ${JSON.stringify(K_SPOT)}, TOL = ${TOL}, D0 = ${D0};
const BORE = ${BORE}, WARM = ${WARM}, CHIP = ${CHIP}, OVAL_X = ${OVAL_X}, TILT_X = ${TILT_X}, LIFT = ${LIFT}, BACK = ${BACK};
const GZ = ${JSON.stringify(GZ)}, BT = ${BT}, FT = ${FT};
const STRAPS = ${JSON.stringify(STRAPS.map(({ key, x0, y }) => ({ key, nose: [x0 < 0 ? -63 : 63, y] })))};
const ALU = ${ALU};
const RODS = ${JSON.stringify(RODS)};
const holdOf = ${holdOf.toString()};
const ovalOf = ${ovalOf.toString()};
const warmOf = ${warmOf.toString()};
${dofOf.toString()}
${kindOf.toString()}
${partSvg.toString()}
const K = { iso, cameraOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) && Number(params.get("level")) === 1 ? 1 : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", held: "degrees of freedom held", of: "of", clamped: "clamped toward the points", free: "free", slide: "slides in", turn: "turns about Z", tilt: "tilts about", line: "the line", tap: "tap a part to name it", unclamped: "clamps off: not located",
      on: { flange: "on flange", wall: "on wall" }, holds: "holds", cut: "cutting force", shifts: "shifts under the cut", tolT: "tol 25 µm", roundIn: "clamped: round in the machine", oor: "out of round", ok: "good", rej: "reject",
      gauge: "bore gauge 0.001 mm", at: "at", dWarm: "measured warm: measure at 20 °C", dChip: "chip on A1: tilts 0.05 mm", dOor: "out of round: cause is the clamping", dShift: "too little force: part shifts", dGood: "Ra 1.6 µm finish cut · accepted", dIn: "bore cut round in the clamp",
      parts: { part: ["Workpiece", "aluminium housing, walls 2 mm"], flange: ["Flange", "thick: datum A below, B front, C end"], bore: ["Bore Ø40 H7", "tolerance 0.025 mm"], A1: ["Rest button A1", "1 of 3 under the main face"], A2: ["Rest button A2", "1 of 3 under the main face"], A3: ["Rest button A3", "1 of 3 under the main face"], B1: ["Locating pin B1", "1 of 2 along the side"], B2: ["Locating pin B2", "1 of 2 along the side"], C: ["End stop C", "the 1 at the end"], strap: ["Strap clamp", "presses toward the rest buttons"], endclamp: ["Push screw", "pushes toward stop C"], backclamp: ["Push screw", "pushes toward B1 and B2"], plate: ["Fixture", "base plate made for this part"], zp: ["Zero-point system", "back within 0.005 mm"], table: ["Machine table", "with T-slots"] } }
  : { dec: ",", held: "vrijheidsgraden vast", of: "van", clamped: "gespannen naar de punten toe", free: "vrij", slide: "schuift in", turn: "draait om Z", tilt: "kantelt om", line: "de lijn", tap: "tik een onderdeel voor de naam", unclamped: "klemmen los: niet gepositioneerd",
      on: { flange: "op flens", wall: "op wand" }, holds: "houdt", cut: "snijkracht", shifts: "verschuift onder de snede", tolT: "tol 25 µm", roundIn: "gespannen: rond in de machine", oor: "onrond", ok: "goed", rej: "afkeur",
      gauge: "boringmeter 0,001 mm", at: "bij", dWarm: "warm gemeten: meet op 20 °C", dChip: "spaan op A1: kantelt 0,05 mm", dOor: "onrond: oorzaak is de opspanning", dShift: "te weinig kracht: werkstuk verschuift", dGood: "Ra 1,6 µm nabewerkt · goedgekeurd", dIn: "boring rond gemaakt in de opspanning",
      parts: { part: ["Werkstuk", "aluminium behuizing, wanden 2 mm"], flange: ["Flens", "dik: vlak A onder, B voor, C eind"], bore: ["Boring Ø40 H7", "tolerantie 0,025 mm"], A1: ["Steunpunt A1", "1 van 3 onder het hoofdvlak"], A2: ["Steunpunt A2", "1 van 3 onder het hoofdvlak"], A3: ["Steunpunt A3", "1 van 3 onder het hoofdvlak"], B1: ["Positioneerpen B1", "1 van 2 langs de zijkant"], B2: ["Positioneerpen B2", "1 van 2 langs de zijkant"], C: ["Aanslag C", "de 1 aan het eind"], strap: ["Spanklauw", "drukt naar de steunpunten toe"], endclamp: ["Drukschroef", "duwt naar aanslag C"], backclamp: ["Drukschroef", "duwt naar B1 en B2"], plate: ["Mal", "grondplaat gemaakt voor dit werkstuk"], zp: ["Nulpuntspansysteem", "komt terug binnen 0,005 mm"], table: ["Machinetafel", "met T-sleuven"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);

const stage = document.querySelector(".fx-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  part: q("[data-part]"), chip: q("[data-chip]"), needle: q("[data-needle]"), mark: q("[data-mark]"),
  gauge: [...svg.querySelectorAll("[data-gauge]")],
  strap: { L: [...svg.querySelectorAll('[data-strap="L"]')], R: [...svg.querySelectorAll('[data-strap="R"]')] },
  pad: { F: [...svg.querySelectorAll('[data-pad="F"]')], W: [...svg.querySelectorAll('[data-pad="W"]')], C: [...svg.querySelectorAll('[data-pad="C"]')] },
  rod: { F: q('[data-rod="F"]'), W: q('[data-rod="W"]'), C: q('[data-rod="C"]') },
  loc: Object.fromEntries(LOC_KEYS.map((key) => [key, [...svg.querySelectorAll('[data-loc="' + key + '"]')]])),
};
const lines = [...document.querySelectorAll("[data-readout] .fx-line")];
const announcer = document.querySelector(".fx-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state
const st = { in: Object.fromEntries(LOC_KEYS.map((key) => [key, true])), at: "flange", f: 6, clamped: true, chip: false, warm: false };
// eased values
const ez = { strap: 0, padF: 0, padW: 1, padC: 0, wob: 0, oval: 0, chip: 0, needle: D0, loc: Object.fromEntries(LOC_KEYS.map((key) => [key, 1])) };
let clock = 0, theta = 0, marked = -1;

function present() { return LOC_KEYS.filter((key) => st.in[key]); }
function located() { return present().length === 6; }
function targets() {
  const t = { strap: 0, padF: 0, padW: 0, padC: 0 };
  if (LVL === 1) {
    const on = located();
    t.strap = on ? 0 : 1; t.padF = on ? 0 : 1; t.padW = 1; t.padC = on ? 0 : 1;
  } else if (!st.clamped) { t.strap = 1; t.padF = 1; t.padW = 1; t.padC = 1; }
  else if (st.at === "flange") { t.strap = 0; t.padF = 0; t.padW = 1; t.padC = 0; }
  else { t.strap = 1; t.padF = 1; t.padW = 0; t.padC = 0; }
  return t;
}
const ovalNow = () => ovalOf(st.f, st.at); // µm after release
const shifts = () => holdOf(st.f) < CUT - 1e-9;
const readNow = () => D0 + (st.warm ? warmOf(WARM - 20) : 0);

// ------------------------------------------------ drawing
const freeNow = () => dofOf(present(), LOC, O);
function partCorners() {
  const out = [];
  for (const [b, z0, z1] of [[POSE0.flange, POSE0.pb, POSE0.ft], [POSE0.body, POSE0.ft, POSE0.bt]]) for (let i = 0; i < 8; i++) out.push([i & 1 ? b.x + b.w : b.x, i & 2 ? b.y + b.d : b.y, i & 4 ? z1 : z0]);
  return out;
}
const CORNERS = partCorners();
function scaled(s, size) {
  let m = 0;
  for (const p of CORNERS) {
    const r = [p[0] - O[0], p[1] - O[1], p[2] - O[2]];
    const d = [s[0] + s[4] * r[2] - s[5] * r[1], s[1] + s[5] * r[0] - s[3] * r[2], s[2] + s[3] * r[1] - s[4] * r[0]];
    m = Math.max(m, Math.hypot(d[0], d[1], d[2]));
  }
  return s.map((x) => (x * size) / (m || 1));
}
// the chip lifts A1 by CHIP: a tilt about the line A2–A3
function chipTwist(lift) {
  const r = dofOf(["A2", "A3", "B1", "B2", "C"], LOC, O).free[0];
  const p = LOC.A1.p, rr = [p[0] - O[0], p[1] - O[1], p[2] - O[2]];
  const dz = r[2] + r[3] * rr[1] - r[4] * rr[0];
  return r.map((x) => (x * lift) / dz);
}
function pose() {
  const v = [0, 0, 0], w = [0, 0, 0];
  const add = (s, k) => { for (let i = 0; i < 3; i++) { v[i] += s[i] * k; w[i] += s[i + 3] * k; } };
  if (LVL === 1 && ez.wob > 0.001) {
    const free = freeNow().free;
    free.forEach((s, i) => add(scaled(s, 4), ez.wob * Math.sin(clock * (2.2 + i * 0.7) + i * 1.3)));
  }
  if (LVL === 2 && ez.chip > 0.001) add(chipTwist(CHIP * TILT_X), ez.chip);
  return { ...POSE0, v, w };
}
function moved(ps, p) {
  const r = [p[0] - O[0], p[1] - O[1], p[2] - O[2]];
  return [ps.v[0] + ps.w[1] * r[2] - ps.w[2] * r[1], ps.v[1] + ps.w[2] * r[0] - ps.w[0] * r[2], ps.v[2] + ps.w[0] * r[1] - ps.w[1] * r[0]];
}
let lastPart = "";
function draw() {
  const ps = pose();
  // bore: round in the clamp, out of round (δ on the diameter) after release
  const half = (ez.oval * OVAL_X) / 1000 / 2;
  const elong = st.at === "wall" ? [-half, half] : [half, -half];
  const a = BORE / 2 + elong[0], b = BORE / 2 + elong[1];
  const key = [ps.v, ps.w].flat().map((x) => x.toFixed(4)).join(",") + "|" + a.toFixed(3) + b.toFixed(3);
  if (key !== lastPart) { lastPart = key; el.part.innerHTML = partSvg(K, P, ps, { a, b }); }
  // clamps
  STRAPS.forEach((s) => {
    const ride = moved(ps, [s.nose[0], s.nose[1], FT])[2];
    const tr = translateAlong(P, [0, 0, ez.strap * LIFT + Math.max(0, ride)]);
    el.strap[s.key].forEach((n) => n.setAttribute("transform", tr));
  });
  el.pad.F.forEach((n) => n.setAttribute("transform", translateAlong(P, [0, -BACK * ez.padF, 0])));
  el.pad.W.forEach((n) => n.setAttribute("transform", translateAlong(P, [0, -BACK * ez.padW, 0])));
  el.pad.C.forEach((n) => n.setAttribute("transform", translateAlong(P, [-BACK * ez.padC, 0, 0])));
  for (const key of ["F", "W", "C"]) {
    const i = Math.round(clamp(ez["pad" + key], 0, 1) * 6);
    if (el.rod[key].dataset.i !== String(i)) { el.rod[key].dataset.i = String(i); el.rod[key].innerHTML = RODS[key][i]; }
  }
  LOC_KEYS.forEach((key) => {
    const o = ez.loc[key];
    const tr = translateAlong(P, [0, 0, (1 - o) * 14]);
    el.loc[key].forEach((n) => { n.style.opacity = o.toFixed(3); n.setAttribute("transform", tr); n.style.display = o < 0.01 ? "none" : ""; });
  });
  if (LVL === 2) {
    el.chip.style.opacity = st.chip ? "1" : (ez.chip > 0.02 ? ez.chip.toFixed(2) : "0");
    const g = moved(ps, [0, 0, BT]);
    const tr = translateAlong(P, g);
    el.gauge.forEach((n) => n.setAttribute("transform", tr));
    const um = ez.needle;
    const ang = (um / 100) * Math.PI * 2;
    const top = GZ.dial[1] + 0.2, r = GZ.r - 3;
    const p0 = iso([-Math.sin(ang) * 3, Math.cos(ang) * 3, top], P), p1 = iso([Math.sin(ang) * r, -Math.cos(ang) * r, top], P);
    el.needle.setAttribute("d", "M" + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + "L" + p1[0].toFixed(2) + " " + p1[1].toFixed(2));
  }
  drawMark();
  readout();
}
function drawMark() {
  if (LVL !== 1 || marked < 0) { if (el.mark.innerHTML) el.mark.innerHTML = ""; return; }
  const p = PARTS[marked];
  const [x, y] = iso(p.at, P);
  const html = '<circle class="fx-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="fx-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  if (el.mark.innerHTML !== html) el.mark.innerHTML = html;
}
function motionText(s, gone) {
  const [kind, axis] = kindOf(s);
  if (kind === "slide") return T.slide + " " + axis;
  if (kind === "turn") return T.turn;
  if (gone.length === 1 && gone[0][0] === "A") return T.tilt + " " + T.line + " " + ["A1", "A2", "A3"].filter((x) => x !== gone[0]).join("–");
  return T.tilt + " " + axis;
}
function lineTexts() {
  const out = [];
  if (LVL === 1) {
    const r = freeNow();
    const gone = LOC_KEYS.filter((key) => !st.in[key]);
    out.push('3-2-1 · <span class="fx-acc">' + r.held + "</span> " + T.of + " 6 " + T.held);
    if (!gone.length) out.push(T.clamped);
    else out.push('<span class="fx-strong">' + T.free + ":</span> " + r.free.map((s) => motionText(s, gone)).join(" · "));
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="fx-acc">' + name + "</span> · " + what); }
    else out.push('<span class="fx-mute">' + (gone.length ? T.unclamped : T.tap) + "</span>");
  } else {
    const h = holdOf(st.f), d = ovalNow();
    out.push(st.f + " kN " + T.on[st.at] + " · " + T.holds + " " + fmt(h, 1) + " kN " + (shifts() ? "&lt;" : "≥") + " " + fmt(CUT, 1) + " " + T.cut);
    if (st.clamped) out.push("Ø40 H7 · " + T.tolT + " · " + T.roundIn);
    else out.push("Ø40 H7 · " + T.tolT + " · " + T.oor + ' <span class="' + (d > TOL ? "fx-strong" : "fx-acc") + '">' + Math.round(d) + " µm</span> → " + (d > TOL ? T.rej : T.ok));
    const mm = 40 + readNow() / 1000;
    out.push(T.gauge + " · " + fmt(mm, 3) + " " + T.at + " " + (st.warm ? WARM : 20) + " °C");
    let diag;
    if (shifts()) diag = '<span class="fx-strong">' + T.dShift + "</span>";
    else if (st.chip) diag = '<span class="fx-strong">' + T.dChip + "</span>";
    else if (!st.clamped && d > TOL) diag = '<span class="fx-strong">' + T.dOor + "</span>";
    else if (st.warm) diag = '<span class="fx-strong">' + T.dWarm + "</span>";
    else if (st.clamped) diag = '<span class="fx-mute">' + T.dIn + "</span>";
    else diag = '<span class="fx-acc">' + T.dGood + "</span>";
    out.push(diag);
  }
  return out;
}
function readout() {
  const out = lineTexts();
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function describe() {
  const text = lineTexts().map((h) => h.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<")).join(". ");
  stage.setAttribute("aria-valuetext", text);
  return text;
}

// ------------------------------------------------ time
function step(dt, calm) {
  const t = targets();
  const k = (tau) => (calm ? 1 : 1 - Math.exp(-dt / tau));
  ez.strap += (t.strap - ez.strap) * k(0.25);
  ez.padF += (t.padF - ez.padF) * k(0.2);
  ez.padW += (t.padW - ez.padW) * k(0.2);
  ez.padC += (t.padC - ez.padC) * k(0.2);
  const wob = LVL === 1 && !located() && !calm ? 1 : 0;
  ez.wob += (wob - ez.wob) * k(0.4);
  ez.oval += ((LVL === 2 && !st.clamped ? ovalNow() : 0) - ez.oval) * k(0.35);
  ez.chip += ((LVL === 2 && st.chip ? 1 : 0) - ez.chip) * k(0.3);
  LOC_KEYS.forEach((key) => { ez.loc[key] += ((st.in[key] ? 1 : 0) - ez.loc[key]) * k(0.18); });
  // the gauge turns slowly in the bore; the needle follows d(θ) = d0 + δ/2·cos 2θ
  if (!calm) theta += dt * 0.9;
  const goal = readNow() + (LVL === 2 && !st.clamped ? (ovalNow() / 2) * Math.cos(2 * theta) : 0);
  ez.needle += (goal - ez.needle) * k(0.12);
  clock += dt;
}

// ------------------------------------------------ the idle tour
// Level 1: take away C, then B1, then A2, each time put it back.
// Level 2: the lesson's two cases, clamped and released, then a chip, then warm.
const TOURS = {
  1: [{ out: [] }, { out: ["C"] }, { out: [] }, { out: ["B1"] }, { out: [] }, { out: ["A2"] }],
  2: [
    { at: "flange", f: 6, clamped: true }, { at: "flange", f: 6, clamped: false },
    { at: "wall", f: 12, clamped: true }, { at: "wall", f: 12, clamped: false },
    { at: "flange", f: 6, clamped: false, chip: true }, { at: "flange", f: 6, clamped: false, warm: true },
  ],
};
let touring = !still.matches, tourStep = 0, tourClock = 0, idleTimer = 0;
function applyTour() {
  const s = TOURS[LVL][tourStep];
  if (LVL === 1) LOC_KEYS.forEach((key) => (st.in[key] = !s.out.includes(key)));
  else Object.assign(st, { chip: false, warm: false }, s);
  sync();
}
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (!calm && touring) { tourClock += dt; if (tourClock > 3.2) { tourClock = 0; tourStep = (tourStep + 1) % TOURS[LVL].length; applyTour(); } }
  step(dt, calm);
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; run(); } }, 40000);
}

// ------------------------------------------------ controls
const locBtns = [...document.querySelectorAll("[data-loc-btn]")];
const atBtns = [...document.querySelectorAll("[data-at]")];
const clampBtns = [...document.querySelectorAll("[data-clamp]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const chipBtn = document.querySelector("[data-toggle=chip]");
const warmBtn = document.querySelector("[data-toggle=warm]");
const val = document.querySelector("[data-val]");
document.querySelector('[data-row="loc"]').hidden = LVL !== 1;
document.querySelector('[data-row="force"]').hidden = LVL !== 2;
document.querySelector('[data-row="state"]').hidden = LVL !== 2;
function sync() {
  locBtns.forEach((b) => b.setAttribute("aria-pressed", String(st.in[b.dataset.locBtn])));
  atBtns.forEach((b) => { const on = b.dataset.at === st.at; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  clampBtns.forEach((b) => { const on = (b.dataset.clamp === "on") === st.clamped; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  chipBtn.setAttribute("aria-pressed", String(st.chip));
  warmBtn.setAttribute("aria-pressed", String(st.warm));
  val.textContent = st.f + " kN";
  const i = F_LIST.indexOf(st.f);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= F_LIST.length - 1));
  describe();
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); sync(); announce(); kick(); }
function stepForce(dir) { const i = F_LIST.indexOf(st.f); st.f = F_LIST[clamp(i + dir, 0, F_LIST.length - 1)]; changed(); }
locBtns.forEach((b) => b.addEventListener("click", () => { st.in[b.dataset.locBtn] = !st.in[b.dataset.locBtn]; changed(); }));
atBtns.forEach((b) => b.addEventListener("click", () => { st.at = b.dataset.at; changed(); }));
clampBtns.forEach((b) => b.addEventListener("click", () => { st.clamped = b.dataset.clamp === "on"; changed(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepForce(b.dataset.step === "+" ? 1 : -1)));
chipBtn.addEventListener("click", () => { st.chip = !st.chip; changed(); });
warmBtn.addEventListener("click", () => { st.warm = !st.warm; changed(); });
function radioKeys(group, keys, current, set) {
  group.addEventListener("keydown", (event) => {
    const i = keys.indexOf(current());
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % keys.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + keys.length - 1) % keys.length;
    if (next < 0) return;
    event.preventDefault();
    set(keys[next]);
    group.querySelectorAll('[role="radio"]')[next].focus();
  });
}
radioKeys(document.querySelector("[data-grp=at]"), ["flange", "wall"], () => st.at, (v) => { st.at = v; changed(); });
radioKeys(document.querySelector("[data-grp=clamp]"), ["on", "off"], () => (st.clamped ? "on" : "off"), (v) => { st.clamped = v === "on"; changed(); });

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => { const [px, py] = iso(p.at, P); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL === 1) { marked = nearestPart(toView(event)); }
  else st.clamped = !st.clamped;
  changed();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; changed(); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; changed(); }
  else if (LVL === 1 && ["1", "2", "3", "4", "5", "6"].includes(event.key)) { const key = LOC_KEYS[Number(event.key) - 1]; st.in[key] = !st.in[key]; changed(); }
  else if (LVL === 2 && (event.key === "ArrowUp" || event.key === "+" || event.key === "=")) stepForce(1);
  else if (LVL === 2 && (event.key === "ArrowDown" || event.key === "-")) stepForce(-1);
  else if (LVL === 2 && (event.key === "f" || event.key === "F")) { st.at = "flange"; changed(); }
  else if (LVL === 2 && (event.key === "w" || event.key === "W")) { st.at = "wall"; changed(); }
  else if (LVL === 2 && (event.key === " " || event.key === "Enter")) { st.clamped = !st.clamped; changed(); }
  else if (LVL === 2 && (event.key === "c" || event.key === "C")) { st.chip = !st.chip; changed(); }
  else if (LVL === 2 && (event.key === "t" || event.key === "T")) { st.warm = !st.warm; changed(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else run(); });
if (LVL === 2 && still.matches) st.clamped = false; // the still picture: released and measured
sync();
step(0, true);
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Opspannen en meten",
    hint1: "Tik een onderdeel · haal een punt weg",
    hint2: "Flens of wand, kracht − + · vervorming 150×",
    flange: "Op flens",
    wall: "Op wand",
    on: "Gespannen",
    off: "Gelost",
    chip: "Spaan",
    warm: "30 °C",
    at: "Spannen op",
    state: "Opspanning",
    minus: "Minder kracht",
    plus: "Meer kracht",
    locs: "Positioneerpunten",
    label: LABEL_NL,
    aria: "Mal met werkstuk. Niveau 1: pijltjes kiezen een onderdeel, toetsen 1 tot 6 halen een positioneerpunt weg of zetten het terug. Niveau 2: F en W kiezen flens of wand, pijl omhoog en omlaag veranderen de spankracht, spatie spant of lost, C legt een spaan neer, T meet warm.",
  },
  en: {
    title: "Workholding and measuring",
    hint1: "Tap a part · take a point away",
    hint2: "Flange or wall, force − + · distortion 150×",
    flange: "On flange",
    wall: "On wall",
    on: "Clamped",
    off: "Released",
    chip: "Chip",
    warm: "30 °C",
    at: "Clamp on",
    state: "Clamping",
    minus: "Less force",
    plus: "More force",
    locs: "Locators",
    label: LABEL_EN,
    aria: "Fixture with a part. Level 1: arrows pick a part, keys 1 to 6 take a locator away or put it back. Level 2: F and W pick flange or wall, up and down change the clamping force, Space clamps or releases, C drops a chip, T measures warm.",
  },
};

const sN = STRINGS.nl;
const controls = [
  `<div class="fx-controls">`,
  `<div class="fx-row" data-row="loc" role="group" aria-label="${sN.locs}">${LOC_KEYS.map((key) => `<button type="button" class="fx-btn" data-loc-btn="${key}" aria-pressed="true">${key}</button>`).join("")}</div>`,
  `<div class="fx-row" data-row="force"><div class="fx-grp" role="radiogroup" data-grp="at" aria-label="${sN.at}"><button type="button" class="fx-btn" role="radio" data-at="flange" aria-checked="true">${sN.flange}</button><button type="button" class="fx-btn" role="radio" data-at="wall" aria-checked="false" tabindex="-1">${sN.wall}</button></div><button type="button" class="fx-btn" data-step="-" aria-label="${sN.minus}">−</button><span class="fx-val" data-val>6 kN</span><button type="button" class="fx-btn" data-step="+" aria-label="${sN.plus}">+</button></div>`,
  `<div class="fx-row" data-row="state"><div class="fx-grp" role="radiogroup" data-grp="clamp" aria-label="${sN.state}"><button type="button" class="fx-btn" role="radio" data-clamp="on" aria-checked="true">${sN.on}</button><button type="button" class="fx-btn" role="radio" data-clamp="off" aria-checked="false" tabindex="-1">${sN.off}</button></div><button type="button" class="fx-btn" data-toggle="chip" aria-pressed="false" style="flex:0 0 64px">${sN.chip}</button><button type="button" class="fx-btn" data-toggle="warm" aria-pressed="false" style="flex:0 0 64px">${sN.warm}</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="fx-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="fx-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="fx-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
d.setAttribute("data-level",q.get("level")==="1"?"1":"2");
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=lv==="1"?s.hint1:s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var set=function(sel,txt){var n=document.querySelector(sel);if(n)n.textContent=txt;};
set('[data-at="flange"]',s.flange);set('[data-at="wall"]',s.wall);set('[data-clamp="on"]',s.on);set('[data-clamp="off"]',s.off);set('[data-toggle="chip"]',s.chip);set('[data-toggle="warm"]',s.warm);
document.querySelector('[data-grp="at"]').setAttribute("aria-label",s.at);document.querySelector('[data-grp="clamp"]').setAttribute("aria-label",s.state);document.querySelector('[data-row="loc"]').setAttribute("aria-label",s.locs);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".fx-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: hold(6) ${holdOf(6).toFixed(2)} kN · δ wall 12 kN ${ovalOf(12, "wall")} µm · δ flange 6 kN ${ovalOf(6, "flange")} µm · warm +${warmOf(10).toFixed(1)} µm`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids (+2 live) · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: true });

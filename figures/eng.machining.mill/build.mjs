// Dev tool, not shipped. Builds the standalone figure for the topic Frezen
// (module Verspanen): the lessons eng.machining.mill (level 1), millfeeds
// (level 2) and millstrategy (level 3).
//
//   node figures/eng.machining.mill/build.mjs            build the page
//   node figures/eng.machining.mill/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.mill.html: one offline page
// with the anatomy kit, the kit's lathe module and the live script inlined. The
// page reads ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL
// (defaults: prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { finishFigure } from "../_kit/phone.mjs";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.mill.html");

// ---------------------------------------------------------------- the model
// Side milling along the front face of a block on a vertical machining centre
// (Sandvik Coromant, "Machining formulas and definitions"):
//   spindle speed     n  = Vc · 1000 / (π · D)            [rpm]
//   cutting speed     Vc = π · D · n / 1000               [m/min]
//   table feed        vf = fz · z · n                     [mm/min]
//   removal rate      Q  = ap · ae · vf / 1000            [cm³/min]
//   max chip          hex = fz · 2·√(D·ae − ae²) / D      [mm]  (chip thinning)
// Level 1 (lesson "mill"): a face mill Ø63 or an end mill Ø10 (inner corner ≥ R5).
// Level 2 (lesson "millfeeds"): end mill Ø12, z 3, n 3,980 (Vc 150), fz 0.05,
//   ap 10, ae 3 → vf 597 mm/min, Q 17.9 cm³/min.
// Level 3 (lesson "millstrategy"): end mill Ø10, z 4, n 6,000, ae 1 → hex =
//   0.6 · fz; fz 0.05 gives a 0.03 mm chip, fz 0.083 a 0.05 mm chip at 2,000 mm/min.
// Climb milling: the tooth enters thick and leaves thin; conventional the reverse.
// With the spindle turning clockwise (M03) and the material behind the cutter,
// climb means the cutter travels in +x relative to the block (the table moves −x).
const AP = 10;
const rpmOf = (vc, d) => (vc * 1000) / (Math.PI * d);
const vcOf = (n, d) => (Math.PI * d * n) / 1000;
const vfOf = (fz, z, n) => fz * z * n;
const qOf = (ap, ae, vf) => (ap * ae * vf) / 1000;
const thinOf = (d, ae) => (2 * Math.sqrt(Math.max(0, d * ae - ae * ae))) / d;
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(rpmOf(150, 12), 3980, 1.5, "lesson n");
near(vfOf(0.05, 3, 3980), 597, 0.5, "lesson vf");
near(qOf(10, 3, 597), 17.9, 0.02, "lesson Q");
near(24 / qOf(10, 3, 597), 1.3, 0.05, "lesson pocket time");
near(vfOf(0.05, 4, 4000), 800, 1e-9, "recall vf");
near(qOf(10, 2, 800), 16, 1e-9, "recall Q");
near(thinOf(10, 1), 0.6, 1e-9, "lesson thinning");
near(thinOf(20, 2), 0.6, 1e-9, "recall thinning");
near(vfOf(0.05, 4, 6000), 1200, 1e-9, "lesson L3 vf");
near(vfOf(0.05 / 0.6, 4, 6000), 2000, 1e-6, "lesson L3 corrected vf");
near(0.05 * thinOf(10, 1), 0.03, 1e-9, "lesson L3 chip");

const N_LIST = [1000, 2000, 3000, 3980, 4000, 5000, 6000, 8000];
const FZ_LIST = [0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.05 / 0.6, 0.1, 0.12, 0.15];
const Z_LIST = [2, 3, 4, 5, 6];
const AE_LIST = [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12];
const LEVELS = {
  1: { d: 10, n: 4000, fz: 0.05, z: 3, ae: 3, tool: "face" },
  2: { d: 12, n: 3980, fz: 0.05, z: 3, ae: 3, tool: "end" },
  3: { d: 10, n: 6000, fz: 0.05, z: 4, ae: 1, tool: "end" },
};
const FACE = { d: 63, z: 5 };
const TS = 4; // simulated seconds per real second

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the table, +y toward the operator.
// The block of the lesson (100 × 80 × 25) sits in the vice; the spindle axis
// stands at x = 0, y = SPY. The floor is z = −10.
const WIDTH = 600;
const FLOOR = -10;
const BLK = { x0: -50, x1: 50, y0: -40, y1: 40 };
const B0 = 82;
const TOP = 107;
const SPY = 43; // spindle axis: the Ø12 end mill at ae 3 (40 + 6 − 3)
const ZS0 = TOP - AP + 78; // spindle nose with the end mill at depth
const TOOL_S = 36; // tool face below the nose (collet nut end)
const END_LEN = 42; // end-mill stick-out: tip at s = 78
const FACE_S = 62; // face-mill tip below the nose
const XHOME = -(BLK.x1 + 6 + 3); // audit home: the Ø12 end mill clear of the block
const BASE = { x: -140, y: -175, w: 280, d: 280, r: 4 };
const BASE_TOP = 24;
const COL = { x: -70, y: -175, w: 140, d: 70, r: 3 };
const HEAD = { x: -46, y: -92, w: 92, d: 170, r: 4 };
const HB0 = ZS0 + 18;
const HT0 = HB0 + 46;
const COL_TOP = HT0 + 10;
const TABLE = { x: -100, y: -62, w: 200, d: 124, r: 2 };
const TABLE_Z = [50, 64];
const CON = { x: 150, y: -104, w: 52, d: 16, r: 2 };
const CON_Z = [120, 178];
const CON_POST = [176, -96];
const WIN = { x0: 155, x1: 197, z0: 145, z1: 173, r: 2, depth: 1 };
const MAG = { x: 78, y: -140, z: HT0 - 34, r: 42 };

const FIT = [
  ...k.boxCorners(BASE, FLOOR, BASE_TOP),
  ...k.boxCorners({ x: TABLE.x - 85, y: TABLE.y, w: TABLE.w + 170, d: TABLE.d + 33 }, TABLE_Z[0], TABLE_Z[1]),
  ...k.boxCorners(COL, BASE_TOP, COL_TOP),
  ...k.boxCorners(HEAD, HB0, HT0 + 30),
  ...k.boxCorners({ x: CON.x, y: CON.y, w: CON.w, d: CON.d }, FLOOR, CON_Z[1] + 2),
  [MAG.x + 20, MAG.y - MAG.r, MAG.z + MAG.r],
  [MAG.x + 20, MAG.y + MAG.r, MAG.z - MAG.r],
];
const PAD = 6;
const MACHINE_W = 380; // the machine fills the left of the card, the loupe the right
const AZIMUTH = Number(process.env.AZ ?? 60);
const ELEVATION = Number(process.env.EL ?? 26);
const P0 = k.fitProjection(FIT, MACHINE_W, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0] + 4, P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameDown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA, cosA } = k.cameraOf(P);
const SHADE_Y = Math.min(3, Math.max(0, Math.floor(((cosA + 1) / 2) * 4)));
const SHADE_X = Math.min(3, Math.max(0, Math.floor(((-sinA + 1) / 2) * 4)));

// ---------------------------------------------------------------- recorder
const MOVE = [-2 * XHOME, 0, 0];
const R = A.recorder(P, { order: ["x"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVE : [0, 0, 0], attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const grp = (g) => ({ piece: g === "x" ? "x" : "", attrs: ` data-g="${g}"` });
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], { ...grp(g), ...opts });
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], { ...grp(g), ...opts });
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], { ...grp(g), ...opts });
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", g = "s", steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], { ...grp(g), ...opts });
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "ml-glass") {
  const id = `ml-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flatRect(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : "")),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    `</g>`,
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

// ---------------------------------------------------------------- shared live geometry
// These draw the parts that change every frame. They take the kit and the lathe
// module as arguments, so the build and the page run the very same code.

// The block in the vice, with the step the cutter has milled so far: the band
// y ∈ [yb, BLK.y1], z ∈ [TOP − ap, TOP] is gone for x ∈ [rx0, rx1]. Drawn at the
// table's audit home (x shifted by XHOME); the table group moves it.
function lShape(a0, a1, b0, b1, n0, n1, bn) {
  n0 = Math.max(n0, a0);
  n1 = Math.min(n1, a1);
  if (n1 - n0 < 1e-6) return [[a0, b0], [a1, b0], [a1, b1], [a0, b1]];
  const out = [[a0, b0], [a1, b0]];
  if (n1 >= a1 - 1e-6) out.push([a1, bn]);
  else out.push([a1, b1], [n1, b1], [n1, bn]);
  if (n0 <= a0 + 1e-6) out.push([a0, bn]);
  else out.push([n0, bn], [n0, b1], [a0, b1]);
  return out;
}
function blockSvg(K, P, cut, shadeY, shadeX) {
  const { rx0, rx1, yb, ap } = cut;
  const ox = XHOME;
  const zc = TOP - ap;
  const W = (x, y, z) => K.iso([x + ox, y, z], P);
  const poly = (pts) => K.pathOf(pts, true);
  const cutting = rx1 - rx0 > 1e-6;
  const faces = [];
  const edges = [];
  const add = (cls, pts) => { const d = poly(pts); faces.push(`<path class="${cls}" d="${d}"/>`); edges.push(d); };
  const top = 'iso-top';
  const sy = `iso-shade" data-shade="${shadeY}`;
  const sx = `iso-shade" data-shade="${shadeX}`;
  if (cutting) {
    add("ml-cut " + top, [[rx0, yb], [rx1, yb], [rx1, BLK.y1], [rx0, BLK.y1]].map(([x, y]) => W(x, y, zc)));
    add("ml-cut " + sy, [[rx0, TOP], [rx1, TOP], [rx1, zc], [rx0, zc]].map(([x, z]) => W(x, yb, z)));
    if (rx0 > BLK.x0 + 1e-6) add("ml-cut " + sx, [[yb, TOP], [BLK.y1, TOP], [BLK.y1, zc], [yb, zc]].map(([y, z]) => W(rx0, y, z)));
  }
  add(top, lShape(BLK.x0, BLK.x1, BLK.y0, BLK.y1, rx0, rx1, yb).map(([x, y]) => W(x, y, TOP)));
  add(sy, lShape(BLK.x0, BLK.x1, B0, TOP, rx0, rx1, zc).map(([x, z]) => W(x, BLK.y1, z)));
  const rightCut = cutting && rx1 >= BLK.x1 - 1e-6;
  add(sx, (rightCut ? lShape(BLK.y0, BLK.y1, B0, TOP, yb, BLK.y1, zc) : [[BLK.y0, B0], [BLK.y1, B0], [BLK.y1, TOP], [BLK.y0, TOP]]).map(([y, z]) => W(BLK.x1, y, z)));
  return `<g class="iso-solid">${faces.join("")}<path class="iso-line" data-tone="mid" d="${edges.join("")}"/></g>`;
}

// The end mill: a solid carbide body with helical flutes that turn with the
// spindle. Drawn at the spindle's home height; the head group moves it.
function endMillSvg(K, GG, P, d, z, phase, spy) {
  const r = d / 2;
  const F = GG.frameOf([0, spy, ZS0], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
  const s0 = TOOL_S, s1 = TOOL_S + END_LEN, sf = s1 - 26;
  let out = K.solidSvg(GG.solidOf([[s0, r], [s1 - 0.6, r], [s1, r - 0.6]], F, P), { tone: "hi", crease: "lo", lit: true });
  const V = GG.viewOf(P);
  const lead = 0.55 / r; // helix: radians per mm along the axis
  const lines = [];
  for (let i = 0; i < z; i++) {
    let run = [];
    for (let j = 0; j <= 26; j++) {
      const s = sf + j;
      const t = phase + (i / z) * Math.PI * 2 - (s - sf) * lead;
      const nrm = [Math.cos(t), Math.sin(t), 0];
      const facing = nrm[0] * V[0] + nrm[1] * V[1];
      if (facing > 0.04) run.push(K.iso(GG.pointOf(F, Math.min(s, s1 - 0.6), r, t), P));
      else if (run.length) { if (run.length > 1) lines.push(K.pathOf(run)); run = []; }
    }
    if (run.length > 1) lines.push(K.pathOf(run));
  }
  out += `<path class="iso-line" data-tone="lo" d="${lines.join("")}${GG.arcOf(F, sf, r, P)}"/>`;
  return out;
}
// The face mill: a body with five carbide inserts round its lower rim.
function faceMillSvg(K, GG, P, phase, spy) {
  const R = FACE.d / 2;
  const F = GG.frameOf([0, spy, ZS0], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
  let out = K.solidSvg(GG.solidOf([[TOOL_S - 12, 14], [TOOL_S - 4, 14], [TOOL_S, 22], [TOOL_S + 4, R - 2.5], [FACE_S - 3, R - 2.5], [FACE_S - 1.5, R - 4]], F, P, { steps: 72 }), { tone: "mid", crease: "lo" });
  const V = GG.viewOf(P);
  const inserts = [];
  const pockets = [];
  for (let i = 0; i < FACE.z; i++) {
    const t = phase + (i / FACE.z) * Math.PI * 2;
    const facing = Math.cos(t + 0.12) * V[0] + Math.sin(t + 0.12) * V[1];
    if (facing < 0.08) continue;
    const q = [[FACE_S - 9, R - 2.5, t], [FACE_S - 9, R - 2.5, t + 0.24], [FACE_S, R, t + 0.24], [FACE_S, R, t]].map(([s, rr, a]) => K.iso(GG.pointOf(F, s, rr, a), P));
    inserts.push(K.pathOf(q, true));
    const g = [[FACE_S - 15, R - 2.5, t - 0.16], [FACE_S - 15, R - 2.5, t + 0.04], [FACE_S - 9, R - 2.5, t + 0.04], [FACE_S - 9, R - 2.5, t - 0.16]].map(([s, rr, a]) => K.iso(GG.pointOf(F, s, rr, a), P));
    pockets.push(K.pathOf(g, true));
  }
  out += `<path class="ml-pocket" d="${pockets.join("")}"/><path class="ml-insert" d="${inserts.join("")}"/>`;
  out += `<path class="iso-line" data-tone="lo" d="${GG.arcOf(F, TOOL_S + 4, R - 2.5, P)}"/>`;
  return out;
}

// The chip-thickness view: a top view of the cutter in the cut, magnified.
// Loupe coordinates: u to the right (+x), v down (−y), so the material lies
// below the cutter. Returns markup in the loupe's own frame (radius LR).
function loupeSvg(d, ae, z, phase, climb, fz, scale) {
  const R = 27;
  const k = R / (d / 2);
  const a = Math.min(ae, d) * k;
  const cy = -6;
  const edge = cy + R - a; // the uncut face ahead of the cutter
  const done = cy + R; // the machined face behind it
  const dir = climb ? 1 : -1; // the cutter's travel along u
  const f2 = (v) => v.toFixed(2);
  const out = [];
  // material: ahead of the cutter up to the old face, then along the cut
  // surface (the cutter's circle) down to the new face behind it
  const s = Math.sqrt(Math.max(0, 1 - ((R - a) / R) ** 2));
  const th0 = Math.atan2(R - a, dir * R * s); // where the old face meets the circle
  const th1 = Math.PI / 2; // the bottom of the circle: the new face
  const arc = [];
  for (let i = 0; i <= 18; i++) { const th = th0 + ((th1 - th0) * i) / 18; arc.push([Math.cos(th) * R, cy + Math.sin(th) * R]); }
  const back = -dir * 60;
  const mat = [[dir * 60, edge], ...arc, [back, done], [back, 60], [dir * 60, 60]];
  out.push(`<path class="ml-mat" d="M${mat.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}Z"/>`);
  const rim = (v) => Math.sqrt(Math.max(0, 46 * 46 - v * v)); // the faces run out to the lens rim
  out.push(`<path class="iso-line" data-tone="mid" d="M${f2(dir * rim(edge))} ${f2(edge)}L${arc.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}H${f2(-dir * rim(done))}"/>`);
  // the chip the next tooth takes: just outside the cut surface, thick where
  // the feed points into the material and thin where it runs along it
  const hmax = fz * thinOf(d, ae);
  const pts = [];
  const outer = [];
  for (let i = 0; i <= 18; i++) {
    const th = th0 + ((th1 - th0) * i) / 18;
    const h = Math.min(R * 0.6, fz * Math.max(0, Math.cos(th) * dir) * scale);
    pts.push([Math.cos(th) * R, cy + Math.sin(th) * R]);
    outer.push([Math.cos(th) * (R + h), cy + Math.sin(th) * (R + h)]);
  }
  const chip = hmax * scale > 0.05 ? `<path class="ml-chip" d="M${pts.concat(outer.reverse()).map(([u, v]) => f2(u) + " " + f2(v)).join("L")}Z"/>` : "";
  // the cutter and its teeth, turning clockwise seen from above
  out.push(`<circle class="ml-tool" cx="0" cy="${f2(cy)}" r="${R}"/>`);
  out.push(chip);
  const teeth = [];
  for (let i = 0; i < z; i++) {
    const t = phase + (i / z) * Math.PI * 2;
    const [cu, cv] = [Math.cos(t), Math.sin(t)];
    teeth.push(`M${f2(cu * (R - 6))} ${f2(cy + cv * (R - 6))}L${f2(cu * R)} ${f2(cy + cv * R)}`);
  }
  out.push(`<path class="iso-line" data-tone="hi" d="${teeth.join("")}"/>`);
  out.push(`<circle class="ml-hub" cx="0" cy="${f2(cy)}" r="3"/>`);
  // the travel: a short track from the centre, ending on a dot
  out.push(`<path class="ml-track" d="M0 ${f2(cy)}h${f2(dir * 14)}"/><circle class="ml-tip" cx="${f2(dir * 14)}" cy="${f2(cy)}" r="1.6"/>`);
  return out.join("");
}

// ---------------------------------------------------------------- floor, base, Y ways
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -4), FLOOR, 2, P)}"/>`, `<path class="iso-halo" d="${k.haloOf({ x: CON_POST[0] - 24, y: CON_POST[1] - 20, w: 48, d: 42, r: 4 }, FLOOR, 1, P)}" style="opacity:.6"/>`];
for (const [x, y] of k.corners(BASE, 16)) post("stand.foot", x, y, 9, FLOOR, 0, { tone: "lo" }, { steps: 6 });
{
  const bolts = k.corners(BASE, 8);
  const extra = L(k.planOutline(k.insetPlan(BASE, 4), BASE_TOP, P, 3), { tone: "faint" }) + L(bolts.map(([x, y]) => k.ring(x, y, 2.4, BASE_TOP, P, 14)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 });
  // a nameplate on the front of the casting, rule lines for its print
  const fy = BASE.y + BASE.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="ml-card" d="${flatRect(-112, 7, -64, 20, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-106 -16.6H-74M-106 -13.4H-84M-106 -10.2H-78"/></g>`,
    Dt([[-110, fy, 18.6], [-66, fy, 18.6], [-110, fy, 8.4], [-66, fy, 8.4]].map(at), { size: 0.42 }),
  ].join("");
  box("stand.base", BASE, 0, BASE_TOP, { tone: "lo" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(BASE, 5, P, 3), { tone: "faint" }), extra: extra + plate });
}
for (const x of [-94, 78]) {
  const way = { x, y: -100, w: 16, d: 200, r: 1 };
  const bolts = [-88, -56, -24, 8, 40, 72].map((y) => [x + 8, y]);
  box("yway", way, BASE_TOP, BASE_TOP + 6, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(bolts.map(([bx, by]) => at([bx, by, BASE_TOP + 6])), { size: 0.4, tone: "lo" }) });
  box("yway.stop", { x: x + 2, y: 92, w: 12, d: 8, r: 0.6 }, BASE_TOP + 6, BASE_TOP + 11, { tone: "mid" }, { bevel: 0.3 });
}

// ---------------------------------------------------------------- saddle (Y) and X ways
{
  const sad = { x: -100, y: -60, w: 200, d: 125, r: 2 };
  box("y.saddle", sad, BASE_TOP + 6, TABLE_Z[0] - 4, { tone: "mid" }, { g: "y", bevel: 0.6, inner: L(k.sideSeam(sad, BASE_TOP + 12, P, 2), { tone: "faint" }) });
  for (const x of [-104, 100]) box("y.wiper", { x, y: -58, w: 4, d: 121, r: 0.6 }, BASE_TOP + 9, TABLE_Z[0] - 6, { tone: "lo" }, { g: "y" });
  for (const y of [-50, 38]) {
    const way = { x: -96, y, w: 192, d: 12, r: 0.8 };
    box("y.xway", way, TABLE_Z[0] - 4, TABLE_Z[0], { tone: "mid", crease: "lo" }, { g: "y", bevel: 0.3 });
  }
  // the saddle's Y handwheel boss on the front
  const Fh = frameY([70, sad.y + sad.d, BASE_TOP + 14]);
  discAt("y.boss", Fh, 0, 3, 6, { tone: "mid" }, { g: "y", extra: Dt([at(G.pointOf(Fh, 3, 0, 0))], { size: 0.5, tone: "hi" }) });
}

// ---------------------------------------------------------------- table, vice, block (X)
const XG = { g: "x" };
{
  const fy = TABLE.y + TABLE.d;
  const ticks = k.sideTicks(TABLE.x + 6, TABLE.x + TABLE.w - 6, 5, 5, fy + 0.8, TABLE_Z[1] - 4, [1.6, 3.2], P);
  const slots = [-36, 0, 36].map((y) => k.planOutline({ x: TABLE.x, y: y - 5, w: TABLE.w, d: 10, r: 0 }, TABLE_Z[1], P, 1)).join("");
  const tp = { ...TABLE, x: TABLE.x + XHOME };
  box("x.table", tp, TABLE_Z[0], TABLE_Z[1], { tone: "mid" }, { ...XG, bevel: 0.6, inner: L(k.sideSeam(tp, TABLE_Z[0] + 4, P, 2), { tone: "faint" }), extra: `<g transform="${k.translateAlong(P, [XHOME, 0, 0])}">${L(slots, { tone: "faint" })}</g>` });
  const strip = { x: TABLE.x + 4 + XHOME, y: fy, w: TABLE.w - 8, d: 0.8, r: 0.2 };
  box("x.scale", strip, TABLE_Z[0] + 3, TABLE_Z[1] - 3, { tone: "lo", crease: "none" }, { ...XG, extra: `<g transform="${k.translateAlong(P, [XHOME, 0, 0])}">${L(ticks.minor, { tone: "lo" })}${L(ticks.major, { tone: "mid" })}</g>` });
}
const vx = (plan) => ({ ...plan, x: plan.x + XHOME });
{
  const base = vx({ x: -90, y: -50, w: 190, d: 100, r: 2 });
  box("x.vice-base", base, TABLE_Z[1], TABLE_Z[1] + 6, { tone: "mid" }, { ...XG, bevel: 0.4 });
  for (const [x, y] of [[-86, -46], [-86, 46], [96, -46], [96, 46]]) post("x.vice-bolt", x + XHOME, y, 3.2, TABLE_Z[1] + 6, TABLE_Z[1] + 9, { tone: "mid" }, { ...XG, steps: 6, extra: Dt([at([x + XHOME, y, TABLE_Z[1] + 9])], { size: 0.4, tone: "hi" }) });
  const bed = vx({ x: -84, y: -45, w: 178, d: 90, r: 1.5 });
  box("x.vice-bed", bed, TABLE_Z[1] + 6, B0, { tone: "mid" }, { ...XG, bevel: 0.5, inner: L(k.sideSeam(bed, B0 - 4, P, 2), { tone: "faint" }) });
  const jaw = (name, plan, plate) => {
    box(name, vx(plan), B0, TOP - 12, { tone: "mid" }, { ...XG, bevel: 0.4 });
    const pl = vx(plate);
    const screws = [-24, 24].map((y) => at([pl.x + pl.w, y, TOP - 17.5]));
    box(name + "-plate", pl, B0 + 1, TOP - 12, { tone: "hi", crease: "lo" }, { ...XG, extra: name.endsWith("move") ? Dt(screws, { size: 0.45, tone: "mid" }) : "" });
  };
  jaw("x.jaw-fixed", { x: -68, y: -45, w: 16, d: 90, r: 1 }, { x: -52, y: -43, w: 2, d: 86, r: 0.3 });
  jaw("x.jaw-move", { x: 52, y: -45, w: 16, d: 90, r: 1 }, { x: 50, y: -43, w: 2, d: 86, r: 0.3 });
  box("x.vice-nut", vx({ x: 74, y: -16, w: 20, d: 32, r: 1 }), B0, B0 + 12, { tone: "mid" }, { ...XG, bevel: 0.4 });
  const Fs = frameX([68 + XHOME, 0, B0 + 6]);
  discAt("x.vice-screw", Fs, 0, 6, 4, { tone: "hi", crease: "none" }, XG);
  const Fc = frameX([94 + XHOME, 0, B0 + 6]);
  discAt("x.crank-hub", Fc, 0, 5, 7, { tone: "mid" }, { ...XG, steps: 6 });
  box("x.crank-arm", vx({ x: 99, y: -3.5, w: 4, d: 7, r: 0.8 }), B0 + 2, B0 + 26, { tone: "mid", crease: "lo" }, XG);
  const Fk = frameX([103 + XHOME, 0, B0 + 22]);
  discAt("x.crank-knob", Fk, 0, 11, 3.2, { tone: "hi", crease: "lo" }, { ...XG, extra: Dt([at(G.pointOf(Fk, 11, 0, 0))], { size: 0.45, tone: "mid" }) });
}
// the block, rebuilt live; recorded as the finished part (the band milled off)
const START_CUT = { rx0: 0, rx1: 0, yb: BLK.y1 - 3, ap: AP };
{
  const yb = BLK.y1 - 3;
  const shapes = [
    R.solid(A.box([BLK.x0 + XHOME, BLK.y0, B0], [BLK.x1 + XHOME, BLK.y1, TOP - AP], { name: "x.block" })),
    R.solid(A.box([BLK.x0 + XHOME, BLK.y0, TOP - AP], [BLK.x1 + XHOME, yb, TOP], { name: "x.block" })),
  ];
  solids++;
  put("x.block", [XHOME, 0, (B0 + TOP) / 2], blockSvg(k, P, START_CUT, SHADE_Y, SHADE_X), shapes, { piece: "x", attrs: ' data-g="x" data-block=""' });
}

// ---------------------------------------------------------------- column, Z ways, magazine
{
  const inner = L(k.sideSeam(COL, BASE_TOP + 14, P, 2) + k.sideSeam(COL, COL_TOP - 10, P, 2), { tone: "faint" });
  box("col", COL, BASE_TOP, COL_TOP, { tone: "mid" }, { bevel: 0.8, inner });
  const cap = k.insetPlan(COL, 3);
  box("col.cap", cap, COL_TOP, COL_TOP + 4, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(k.corners(cap, 5).map(([x, y]) => at([x, y, COL_TOP + 4])), { size: 0.42 }) });
  for (const x of [-56, 44]) box("col.zway", { x, y: -105, w: 12, d: 5, r: 0.5 }, 110, COL_TOP - 4, { tone: "mid", crease: "lo" });
  // the magazine: a carousel on a bracket, tool pockets round its face
  box("mag.bracket", { x: 70, y: -156, w: 8, d: 32, r: 0.6 }, MAG.z - 16, MAG.z + 16, { tone: "mid" }, { bevel: 0.3 });
  const F = frameX([MAG.x, MAG.y, MAG.z]);
  const pockets = Array.from({ length: 16 }, (_, i) => G.frameOf(G.pointOf(F, 14, 46, (i / 16) * Math.PI * 2 + 0.1), X, Y, Zv));
  const face = [
    L(pockets.map((Fp) => G.circleOf(Fp, 0, 4.6, P, 16)).join(""), { tone: "lo" }),
    Dt(pockets.map((Fp) => at(Fp.o)), { size: 0.5, tone: "mid" }),
    L(G.circleOf(F, 14, 34, P, 64), { tone: "faint" }),
  ].join("");
  discAt("mag.disc", F, 0, 14, MAG.r, { tone: "mid" }, { extra: face, inner: L(G.arcOf(F, 7, MAG.r, P), { tone: "faint" }) });
  discAt("mag.hub", F, 14, 20, 15, { tone: "mid" }, { extra: Dt([at(G.pointOf(F, 20, 0, 0))], { size: 0.55, tone: "hi" }) });
}

// ---------------------------------------------------------------- spindle head (Z)
const ZG = { g: "z" };
{
  const inner = L(k.sideSeam(HEAD, HT0 - 10, P, 2), { tone: "faint" });
  const fy = HEAD.y + HEAD.d;
  const slots = [0, 1, 2].map((i) => flatRect(-30, HB0 + 24 + i * 6, 10, HB0 + 26.4 + i * 6, 1.2, 3)).join("");
  const extra = `<g transform="${planeOf(fy)}">${L(slots, { tone: "lo" })}</g>` + Dt([[-40, fy, HB0 + 6], [40, fy, HB0 + 6], [-40, fy, HT0 - 6], [40, fy, HT0 - 6]].map(at), { size: 0.42 });
  box("z.head", HEAD, HB0, HT0, { tone: "mid" }, { ...ZG, bevel: 0.8, inner, extra });
  box("z.slide", { x: -60, y: -100, w: 120, d: 8, r: 1 }, HB0 - 6, HT0 + 6, { tone: "mid", crease: "lo" }, { ...ZG, bevel: 0.4 });
  // motor on top: fins between two seams, a terminal box on its side
  const Fm = G.frameOf([0, 20, HT0], Zv, X, Y);
  const fins = G.ribsOf(Fm, 2, 22, 22, 24, P, { fade: [0.04, 0.42], seams: true });
  turned("z.motor", Fm, [[0, 22], [24, 22]], { tone: "mid", crease: "lo" }, { ...ZG, inner: k.fadedSvg(fins, { tone: "lo" }) });
  discAt("z.motor-cap", Fm, 24, 28, 17, { tone: "mid" }, { ...ZG, extra: Dt([at([0, 20, HT0 + 28])], { size: 0.5, tone: "hi" }) });
  box("z.tbox", { x: 22, y: 10, w: 9, d: 20, r: 1 }, HT0 + 6, HT0 + 18, { tone: "mid" }, { ...ZG, bevel: 0.3 });
  // quill, nose, tool holder (V-flange and collet nut)
  const Fz = frameDown([0, SPY, ZS0]);
  discAt("z.quill", Fz, -18, -14, 34, { tone: "mid" }, ZG);
  discAt("z.nose", Fz, -14, 0, 28, { tone: "mid" }, { ...ZG, extra: Dt(G.dotsOf(Fz, 0, 24, 8, P, { fade: [0.04, 0.4], all: false }), { size: 0.4 }) });
  discAt("z.flange", Fz, 0, 6, 23, { tone: "mid", crease: "lo" }, ZG);
  discAt("z.flange2", Fz, 9, 14, 23, { tone: "mid", crease: "lo" }, ZG);
  discAt("z.groove", Fz, 6, 9, 19, { tone: "lo", crease: "none" }, ZG);
}
// the tool: an end mill (recorded) or a face mill (level 1, drawn in its own slot)
const toolItem = put("z.endmill", [0, SPY, ZS0 - TOOL_S - END_LEN / 2], endMillSvg(k, G, P, 12, 3, 0, SPY), [R.solid(A.disc(frameDown([0, SPY, ZS0]), TOOL_S, TOOL_S + END_LEN, 6, { name: "z.endmill" }))], { attrs: ' data-g="z" data-tool="end"' });
solids++;
{
  const Fz = frameDown([0, SPY, ZS0]);
  turned("z.collet", Fz, [[14, 16], [26, 13.5], [30, 13.5]], { tone: "mid", crease: "lo" }, { ...ZG, attrs: ' data-g="z" data-collet=""' });
  discAt("z.nut", Fz, 30, TOOL_S, 15, { tone: "hi", crease: "lo" }, { ...ZG, steps: 8, attrs: ' data-g="z" data-collet=""' });
}

// ---------------------------------------------------------------- the control console
{
  const foot = { x: CON_POST[0] - 20, y: CON_POST[1] - 16, w: 40, d: 34, r: 1.5 };
  box("stand.con-foot", foot, FLOOR, FLOOR + 5, { tone: "lo" }, { bevel: 0.4, extra: Dt(k.corners(foot, 4).map(([x, y]) => at([x, y, FLOOR + 5])), { size: 0.42 }) });
  post("con.post", CON_POST[0], CON_POST[1], 7, FLOOR + 5, CON_Z[0] - 6, { tone: "mid" }, { steps: 24, inner: L(k.sideArc(CON_POST[0], CON_POST[1], 7, 40, P, 16), { tone: "faint" }) });
  post("con.collar", CON_POST[0], CON_POST[1], 10, CON_Z[0] - 6, CON_Z[0], { tone: "mid" }, { steps: 28, bevel: 0.3 });
  const fy = CON.y + CON.d;
  const screen = [
    `<g data-prog="">`,
    ...[0, 1, 2, 3, 4, 5].map((i) => `<path class="iso-line" data-tone="${i === 2 ? "hi" : "lo"}" data-free="" data-pl="${i}" d="M${WIN.x0 + 5} ${-(WIN.z1 - 5 - i * 4.4)}h${[30, 22, 34, 18, 26, 14][i]}"/>`),
    `<path class="ml-bar" data-bar="" d="M${WIN.x0 + 2.4} ${-(WIN.z1 - 5 - 2 * 4.4) - 1.4}v2.8"/>`,
    `</g>`,
  ].join("");
  const faceBits = [recess(WIN, fy, screen), Dt([[CON.x + 2, fy, CON_Z[0] + 2], [CON.x + CON.w - 2, fy, CON_Z[0] + 2], [CON.x + 2, fy, CON_Z[1] - 2], [CON.x + CON.w - 2, fy, CON_Z[1] - 2]].map(at), { size: 0.42 })].join("");
  box("con.box", CON, CON_Z[0], CON_Z[1], { tone: "mid" }, { bevel: 0.6, extra: faceBits });
  box("con.hood", { x: CON.x - 1.5, y: CON.y - 1, w: CON.w + 3, d: CON.d + 3, r: 1 }, CON_Z[1], CON_Z[1] + 2, { tone: "mid" }, { bevel: 0.3 });
  const Fe = frameY([159, fy, 130]);
  discAt("con.estop", Fe, 0, 1.6, 6, { tone: "mid" }, {});
  discAt("con.mushroom", Fe, 1.6, 4.6, 4.6, { tone: "hi", crease: "lo" }, { extra: L(G.circleOf(Fe, 4.6, 2.2, P, 20), { tone: "faint" }) });
  const Fs = frameY([171, fy, 130]);
  discAt("con.start", Fs, 0, 1.4, 3.4, { tone: "mid" }, {});
  discAt("con.start-cap", Fs, 1.4, 2.6, 2.4, { tone: "hi", crease: "lo" }, { attrs: ' data-lamp=""' });
  const Fo = frameY([182, fy, 130]);
  discAt("con.override", Fo, 0, 4, 5.2, { tone: "mid" }, { extra: L(G.ribsOf(Fo, 0.4, 3.6, 5.2, 18, P, { seams: false }), { tone: "lo" }) + Dt([at(G.pointOf(Fo, 4, 3.6, -Math.PI / 2))], { size: 0.5, tone: "hi" }) });
  const Fw = frameY([194, fy, 130]);
  discAt("con.mpg", Fw, 0, 2.4, 5.6, { tone: "mid" }, { extra: L(G.circleOf(Fw, 2.4, 3.4, P, 24), { tone: "faint" }) + Dt([at(G.pointOf(Fw, 2.4, 4.4, 0.6))], { size: 0.55, tone: "hi" }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(12) });
R.items.sort((a, b) => a.key - b.key);
const faceSlot = R.items.indexOf(toolItem);
const groups = R.items.map((item, index) => {
  const g = `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`;
  if (index === faceSlot) return g + `<g class="it" data-g="z" data-tool="face" style="display:none">${faceMillSvg(k, G, P, 0, SPY)}</g>`;
  return g;
});
solids += 1 + FACE.z;

// the chip-thickness loupe sits to the right of the machine
const LOUPE = (() => {
  const r = Math.min(98, HEIGHT / 2 - 10);
  return { cx: WIDTH - r - 12, cy: HEIGHT / 2, r };
})();
const loupe = [
  `<g class="ml-loupe" data-loupe="" transform="translate(${LOUPE.cx.toFixed(1)} ${LOUPE.cy.toFixed(1)})">`,
  `<circle class="ml-lens" r="${LOUPE.r}"/>`,
  `<clipPath id="ml-lens-clip"><circle r="${LOUPE.r - 1}"/></clipPath>`,
  `<g clip-path="url(#ml-lens-clip)"><g data-view="" transform="scale(${(LOUPE.r / 46).toFixed(3)})"></g></g>`,
  `<circle class="ml-rim" r="${LOUPE.r}"/>`,
  `</g>`,
].join("");

const body = [...halo, ...groups, `<g data-chips=""></g>`, `<g data-mark=""></g>`, loupe];

const LABEL_NL =
  "Een verticaal bewerkingscentrum: een gegoten bed op stelvoeten, een zadel dat in Y beweegt, een tafel met T-sleuven die in X beweegt, een bankschroef met daarin een blok van 100 bij 80 bij 25 mm, een kolom met een spilkop die in Z beweegt, een gereedschapsmagazijn opzij van de kolom en een bedieningskast. In de spil zit een vlakfrees of een vingerfrees. De tafel voert het blok langs de draaiende frees, die een trap uit de voorkant freest. Een vergrootglas toont het bovenaanzicht van de frees in het materiaal met de spaan.";
const LABEL_EN =
  "A vertical machining centre: a cast base on levelling feet, a saddle moving in Y, a T-slotted table moving in X, a vice holding a block of 100 by 80 by 25 mm, a column with a spindle head moving in Z, a tool magazine beside the column and a control console. The spindle holds a face mill or an end mill. The table feeds the block past the turning cutter, which mills a step off its front. A loupe shows the top view of the cutter in the material, with the chip.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "spindle", g: "z", at: [0, SPY, ZS0 - 7] },
  { key: "tool", g: "z", at: [0, SPY, TOP - 6] },
  { key: "block", g: "x", at: [0, 0, TOP] },
  { key: "vice", g: "x", at: [-60, 45, TOP - 14] },
  { key: "table", g: "x", at: [-95, 62, TABLE_Z[1]] },
  { key: "saddle", g: "y", at: [60, 65, BASE_TOP + 14] },
  { key: "head", g: "z", at: [0, 78, HB0 + 30] },
  { key: "column", g: "s", at: [70, -105, 150] },
  { key: "magazine", g: "s", at: [MAG.x + 14, MAG.y, MAG.z] },
  { key: "control", g: "s", at: [(WIN.x0 + WIN.x1) / 2, CON.y + CON.d, (WIN.z0 + WIN.z1) / 2] },
  { key: "base", g: "s", at: [-40, BASE.y + BASE.d, 12] },
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
  --ml-hair:rgba(240,233,218,.12);--ml-accent:#5C9FAE;--ml-glass:#0A1E23;--ml-cut:#1B4049;--ml-mat:#16353D;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --ml-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --ml-hair:rgba(11,41,27,.14);--ml-accent:#276F81;--ml-glass:#E2ECEA;--ml-cut:#E2ECEA;--ml-mat:#EBE4D4;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--ml-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:130px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--ml-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="3"] .iso-plate{--bottom:178px}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--ml-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 14px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 32px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.iso-plate-corners{--rows:1}
html[data-level="3"] .iso-plate-corners{--rows:2}
.ml-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ml-acc{color:var(--ml-accent);font-weight:600}
.ml-strong{color:var(--anatomy-strong);font-weight:600}
.ml-mute{color:var(--anatomy-muted)}
.ml-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.ml-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.ml-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.ml-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.ml-row{display:flex;gap:4px;height:44px}
.ml-row[hidden]{display:none}
.ml-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--ml-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--ml-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.ml-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.ml-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--ml-accent);color:var(--ml-accent);font-weight:600}
.ml-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.ml-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.ml-btn sub{font-size:9px}
.ml-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ml-glass{fill:var(--ml-glass);stroke:none}
.ml-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.ml-bar{stroke:var(--ml-accent);stroke-width:1.2px;stroke-linecap:round}
.iso .ml-cut.iso-top,.iso .ml-cut.iso-shade{fill:var(--ml-cut)}
.ml-insert{fill:var(--anatomy-lit);stroke:var(--anatomy-hi);stroke-width:.35px;stroke-linejoin:round}
.ml-pocket{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.35px;stroke-linejoin:round}
.ml-chip-fly{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.5px;stroke-linejoin:round}
.ml-lens{fill:var(--anatomy-card);stroke:none}
.ml-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.ml-mat{fill:var(--ml-mat);stroke:none}
.ml-chip{fill:var(--ml-accent);stroke:var(--ml-accent);stroke-width:.4px;stroke-linejoin:round}
.ml-tool{fill:var(--anatomy-face);fill-opacity:.55;stroke:var(--anatomy-hi);stroke-width:1px}
.ml-hub{fill:var(--anatomy-hi);stroke:none}
.ml-track{stroke:var(--anatomy-hi);stroke-width:1px;fill:none}
.ml-tip{fill:var(--anatomy-hi);stroke:none}
.ml-mark{fill:none;stroke:var(--ml-accent);stroke-width:1.4px}
.ml-mark-dot{fill:var(--ml-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--ml-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const latheSource = readFileSync(join(SKILL, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, solidOf, arcOf, dot3, add3, mul3 };})();\n`;

const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const AP = ${AP}, TS = ${TS};
const BLK = ${JSON.stringify(BLK)}, B0 = ${B0}, TOP = ${TOP}, SPY = ${SPY}, ZS0 = ${ZS0}, XHOME = ${XHOME};
const TOOL_S = ${TOOL_S}, END_LEN = ${END_LEN}, FACE_S = ${FACE_S}, FACE = ${JSON.stringify(FACE)};
const SHADE_Y = ${SHADE_Y}, SHADE_X = ${SHADE_X};
const N_LIST = ${JSON.stringify(N_LIST)}, FZ_LIST = ${JSON.stringify(FZ_LIST)}, Z_LIST = ${JSON.stringify(Z_LIST)}, AE_LIST = ${JSON.stringify(AE_LIST)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const rpmOf = ${rpmOf.toString()};
const vcOf = ${vcOf.toString()};
const vfOf = ${vfOf.toString()};
const qOf = ${qOf.toString()};
const thinOf = ${thinOf.toString()};
${lShape.toString()}
${blockSvg.toString()}
${endMillSvg.toString()}
${faceMillSvg.toString()}
${loupeSvg.toString()}
const K = { solidSvg, lineSvg, dotsSvg, iso, pathOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = Math.min(3, Math.max(1, [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2));
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { rpm: "rpm", dec: ".", grp: ",", face: "Face mill", end: "End mill", inserts: "inserts", teeth: "teeth", corner: "inner corner ≥ R", faceDo: "flattens the top in a few passes", contour: "follows a side, a contour or a pocket", climb: "climb", conv: "conventional", thin: "chip thinning", tapPart: "tap a part to name it",
      parts: { spindle: ["Spindle", "turns the tool; up and down in Z"], tool: ["Cutter", "in a holder from the magazine"], block: ["Workpiece", "a block of 100 × 80 × 25 mm"], vice: ["Vice", "clamps the block on the table"], table: ["Table", "moves left-right: X"], saddle: ["Saddle", "moves front-back: Y"], head: ["Spindle head", "slides along the column: Z"], column: ["Column", "carries the head, stiff and heavy"], magazine: ["Magazine", "the tool changer takes tools here"], control: ["CNC control", "runs the program line by line"], base: ["Base", "cast iron on levelling feet"] } }
  : { rpm: "omw/min", dec: ",", grp: ".", face: "Vlakfrees", end: "Vingerfrees", inserts: "wisselplaten", teeth: "tanden", corner: "binnenhoek ≥ R", faceDo: "maakt de bovenkant vlak in een paar banen", contour: "volgt een zijkant, contour of kamer", climb: "meelopend", conv: "tegenlopend", thin: "spaanverdunning", tapPart: "tik een onderdeel voor de naam",
      parts: { spindle: ["Spil", "draait het gereedschap; op en neer in Z"], tool: ["Frees", "zit in een houder uit het magazijn"], block: ["Werkstuk", "blok van 100 × 80 × 25 mm"], vice: ["Bankschroef", "klemt het blok op de tafel"], table: ["Tafel", "beweegt links-rechts: X"], saddle: ["Zadel", "beweegt voor-achter: Y"], head: ["Spilkop", "schuift langs de kolom: Z"], column: ["Kolom", "draagt de spilkop, stijf en zwaar"], magazine: ["Magazijn", "de wisselaar pakt hier gereedschap"], control: ["CNC-besturing", "voert het programma regel voor regel uit"], base: ["Bed", "gietijzer op stelvoeten"] } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
const fzText = (v) => (Math.abs(v - 0.05 / 0.6) < 1e-6 ? fmt(v, 3) : fmt(v, 2));
const aeText = (v) => (v % 1 ? fmt(v, 1) : String(v));

const stage = document.querySelector(".ml-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  block: q("[data-block]"), end: q('[data-tool="end"]'), face: q('[data-tool="face"]'), collets: [...svg.querySelectorAll("[data-collet]")],
  chips: q("[data-chips]"), mark: q("[data-mark]"), view: q("[data-view]"), lamp: q("[data-lamp]"), bar: q("[data-bar]"),
  gx: [...svg.querySelectorAll('[data-g="x"]')], gy: [...svg.querySelectorAll('[data-g="y"]')], gz: [...svg.querySelectorAll('[data-g="z"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .ml-line")];
const announcer = document.querySelector(".ml-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { tool: L0.tool, n: L0.n, fz: L0.fz, z: L0.z, ae: L0.ae, climb: true, sel: "n" };
const D = () => (st.tool === "face" ? FACE.d : L0.d);
const teeth = () => (st.tool === "face" ? FACE.z : st.z);
const aeNow = () => (st.tool === "face" ? 53.5 : Math.min(st.ae, D()));
const apNow = () => (st.tool === "face" ? 2 : AP);
const vfNow = () => (LVL === 1 ? 600 : vfOf(st.fz, st.z, st.n));
const nNow = () => (LVL === 1 ? (st.tool === "face" ? 1500 : 4000) : st.n);
// where the spindle sits over the block: the table and saddle carry the block so
// that the cutter takes ae off the front face
function geometry() {
  const r = D() / 2, ae = aeNow();
  const ys = BLK.y1 + r - ae;
  const tipZ = TOP - apNow();
  const zs = tipZ + (st.tool === "face" ? FACE_S : TOOL_S + END_LEN);
  const travel = BLK.x1 + r + 3;
  return { r, ae, ys, ty: SPY - ys, tz: zs - ZS0, travel, yb: BLK.y1 - ae };
}
// the pass: approach (Z down) → cut → retract → rapid back → a fresh block
const cyc = { phase: "cut", t: 0, u: 0, lift: 0, fresh: 0 };
let spin = 0, phase = 0, chipClock = 0, viewPhase = 0;
const chips = [];

function toolX(g) { // cutter position along the block (block coordinates)
  const s = -g.travel + 2 * g.travel * cyc.u;
  return st.climb ? s : -s;
}
function cutNow(g) {
  const x = toolX(g);
  if (cyc.phase === "back" || cyc.phase === "load") return { rx0: BLK.x0, rx1: BLK.x1, yb: g.yb, ap: apNow() };
  if (cyc.u <= 0) return { rx0: 0, rx1: 0, yb: g.yb, ap: apNow() };
  return st.climb ? { rx0: BLK.x0, rx1: clamp(x, BLK.x0, BLK.x1), yb: g.yb, ap: apNow() } : { rx0: clamp(x, BLK.x0, BLK.x1), rx1: BLK.x1, yb: g.yb, ap: apNow() };
}

// ------------------------------------------------ drawing
let lastBlock = "", lastTool = "", lastFresh = -1;
function place(g) {
  const tx = -toolX(g); // the table carries the block under the fixed spindle
  const ax = translateAlong(P, [tx - XHOME, g.ty, 0]);
  const ay = translateAlong(P, [0, g.ty, 0]);
  const az = translateAlong(P, [0, 0, g.tz + cyc.lift * 30]);
  el.gx.forEach((n) => n.setAttribute("transform", ax));
  el.gy.forEach((n) => n.setAttribute("transform", ay));
  el.gz.forEach((n) => n.setAttribute("transform", az));
  return { tx, ty: g.ty, tz: g.tz + cyc.lift * 30 };
}
function drawBlock(g) {
  const c = cutNow(g);
  const key = [c.rx0, c.rx1, c.yb, c.ap].map((v) => v.toFixed(2)).join("|") + "|" + cyc.fresh.toFixed(2);
  if (key === lastBlock) return;
  lastBlock = key;
  let out = blockSvg(K, P, c, SHADE_Y, SHADE_X);
  if (cyc.fresh > 0.004) out += '<g style="opacity:' + cyc.fresh.toFixed(3) + '">' + blockSvg(K, P, { rx0: 0, rx1: 0, yb: c.yb, ap: c.ap }, SHADE_Y, SHADE_X) + "</g>";
  el.block.innerHTML = out;
}
function drawTool(g) {
  const face = st.tool === "face";
  el.face.style.display = face ? "" : "none";
  el.end.style.display = face ? "none" : "";
  el.collets.forEach((n) => (n.style.display = face ? "none" : ""));
  const key = st.tool + "|" + D() + "|" + teeth() + "|" + phase.toFixed(3) + "|" + g.ys.toFixed(2);
  if (key === lastTool) return;
  lastTool = key;
  if (face) el.face.innerHTML = faceMillSvg(K, G, P, phase, SPY);
  else el.end.innerHTML = endMillSvg(K, G, P, D(), teeth(), phase, SPY);
}
function chipPath(cx, cy, size, turn) {
  const out = [], inner = [], n = 12;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = turn + t * Math.PI * 2 * 1.1, r = size * (0.4 + 0.6 * t), w = size * (0.14 + 0.2 * t);
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6]);
    inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.6]);
  }
  return "M" + out.concat(inner.reverse()).map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z";
}
function drawChips() {
  let html = "";
  for (const c of chips) {
    const [sx, sy] = iso(c.p, P);
    html += '<path class="ml-chip-fly" style="opacity:' + c.a.toFixed(2) + '" d="' + chipPath(sx, sy, c.size * KS, c.turn) + '"/>';
  }
  el.chips.innerHTML = html;
}
function drawLoupe() {
  const scale = 220; // 0.05 mm of chip → 11 loupe units
  el.view.innerHTML = loupeSvg(D(), aeNow(), teeth(), viewPhase, st.climb, LVL === 1 ? 0 : st.fz, scale);
}
let marked = -1;
function drawMark(off) {
  if (LVL !== 1 || marked < 0) { el.mark.innerHTML = ""; return; }
  const p = PARTS[marked];
  const o = p.g === "x" ? [off.tx, off.ty, 0] : p.g === "y" ? [0, off.ty, 0] : p.g === "z" ? [0, 0, off.tz] : [0, 0, 0];
  const [x, y] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2] + o[2]], P);
  el.mark.innerHTML = '<circle class="ml-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="ml-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function readout() {
  const out = [];
  if (LVL === 1) {
    const face = st.tool === "face";
    out.push(face ? T.face + " Ø" + FACE.d + " · " + FACE.z + " " + T.inserts : T.end + " Ø" + L0.d + " · " + L0.z + " " + T.teeth + " · " + T.corner + fmt(L0.d / 2, 0));
    out.push(face ? T.faceDo : T.contour);
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="ml-acc">' + name + "</span> · " + what); }
    else out.push('<span class="ml-mute">' + T.tapPart + "</span>");
  } else {
    const n = st.n, d = D(), vf = vfNow(), ae = aeNow();
    if (LVL < 3) out.push("n " + grouped(n) + " " + T.rpm + " · Ø" + d + " → Vc " + grouped(vcOf(n, d)) + " m/min");
    out.push("vf = " + fzText(st.fz) + " × " + st.z + " × " + grouped(n) + ' = <span class="ml-acc">' + grouped(vf) + "</span> mm/min");
    out.push("Q = " + AP + " × " + aeText(ae) + " × " + grouped(vf) + " / 1" + T.grp + "000 = " + '<span class="ml-acc">' + fmt(qOf(AP, ae, vf), 1) + "</span> cm³/min");
    if (LVL >= 3) {
      const f = thinOf(d, ae);
      out.push("hex = " + fmt(f, 2) + " × fz = " + '<span class="ml-acc">' + fmt(f * st.fz, 3) + "</span> mm · " + (st.climb ? T.climb : T.conv));
    }
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function draw() {
  const g = geometry();
  const off = place(g);
  drawBlock(g);
  drawTool(g);
  drawChips();
  drawLoupe();
  drawMark(off);
  readout();
  if (cyc.phase === "cut") el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
}

// ------------------------------------------------ the machining cycle
const DUR = { approach: 0.35, retract: 0.3, back: 0.8, load: 0.6 };
function stepCycle(dt) {
  const g = geometry();
  cyc.t += dt;
  if (cyc.phase === "approach") {
    cyc.lift = 1 - smooth(0, DUR.approach, cyc.t);
    if (cyc.t >= DUR.approach) { cyc.phase = "cut"; cyc.t = 0; cyc.lift = 0; }
  } else if (cyc.phase === "cut") {
    const mmPerS = (vfNow() / 60) * TS;
    cyc.u = Math.min(1, cyc.u + (dt * mmPerS) / (2 * g.travel));
    const x = toolX(g);
    if (Math.abs(x) < BLK.x1 + g.r * 0.6) { chipClock += dt * Math.min(3, nNow() / 3000); if (chipClock > 0.12) { chipClock = 0; spawnChip(g); } }
    if (cyc.u >= 1) { cyc.phase = "retract"; cyc.t = 0; }
  } else if (cyc.phase === "retract") {
    cyc.lift = smooth(0, DUR.retract, cyc.t);
    if (cyc.t >= DUR.retract) { cyc.phase = "back"; cyc.t = 0; }
  } else if (cyc.phase === "back") {
    cyc.u = 1 - smooth(0, DUR.back, cyc.t);
    if (cyc.t >= DUR.back) { cyc.phase = "load"; cyc.t = 0; cyc.u = 0; }
  } else if (cyc.phase === "load") {
    cyc.fresh = smooth(0, DUR.load, cyc.t);
    if (cyc.t >= DUR.load) { cyc.fresh = 0; cyc.phase = "approach"; cyc.t = 0; onPass(); }
  }
}
function spawnChip(g) {
  if (chips.length > 8) return;
  const ang = Math.asin(clamp(1 - g.ae / g.r, -1, 1));
  const ex = Math.cos(ang) * g.r * (st.climb ? 1 : -1);
  // world position: the spindle is at x = 0, so the contact point is fixed in the world
  const sideways = st.climb ? -1 : 1;
  chips.push({ p0: [ex, SPY - g.r + g.ae + 1, TOP - apNow() / 2], p: [ex, SPY + 2, TOP], age: 0, a: 0, size: 2 + Math.random() * 1.4, turn0: Math.random() * 6.28, turn: 0, vx: sideways * (10 + Math.random() * 10), vy: 14 + Math.random() * 8, vz: 18 + Math.random() * 10 });
}
function stepChips(dt) {
  for (const c of chips) {
    c.age += dt;
    const t = c.age;
    c.p = [c.p0[0] + c.vx * t, c.p0[1] + c.vy * t, c.p0[2] + c.vz * t - 60 * t * t];
    c.turn = c.turn0 + 5 * t;
    c.a = smooth(0, 0.06, t) * (1 - smooth(0.45, 0.8, t));
  }
  for (let i = chips.length - 1; i >= 0; i--) if (chips[i].age > 0.8) chips.splice(i, 1);
}
function stillPose() {
  chips.length = 0;
  cyc.phase = "cut"; cyc.t = 0; cyc.u = 0.5; cyc.lift = 0; cyc.fresh = 0;
}

// ------------------------------------------------ the idle tour
// Level 1: two passes with each tool. Level 2: the lesson's example, then its
// recall (z 4 at 4,000 rpm, ae 2: 800 mm/min, 16 cm³/min). Level 3: fz 0.05 at
// ae 1 (a 0.03 mm chip), then fz 0.083 (0.05 mm), then conventional.
const TOURS = {
  1: [{ tool: "face" }, { tool: "face" }, { tool: "end" }, { tool: "end" }],
  2: [{ n: 3980, fz: 0.05, z: 3, ae: 3 }, { n: 3980, fz: 0.05, z: 3, ae: 3 }, { n: 4000, fz: 0.05, z: 4, ae: 2 }, { n: 4000, fz: 0.05, z: 4, ae: 2 }],
  3: [{ fz: 0.05, climb: true }, { fz: 0.05 / 0.6, climb: true }, { fz: 0.05 / 0.6, climb: true }, { fz: 0.05 / 0.6, climb: false }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0;
function onPass() {
  if (!touring) return;
  tourStep = (tourStep + 1) % TOURS[LVL].length;
  Object.assign(st, TOURS[LVL][tourStep]);
  lastTool = ""; lastBlock = "";
  sync();
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (calm) stillPose();
  else {
    stepCycle(dt);
    stepChips(dt);
    const goal = cyc.phase === "load" || cyc.phase === "back" ? 0.2 : 1;
    spin += (goal - spin) * (1 - Math.exp(-dt / 0.3));
    // shown slowed: one turn per second at 4,000 rpm
    phase = (phase + dt * spin * (nNow() / 4000) * 2 * Math.PI) % (2 * Math.PI);
    viewPhase = (viewPhase + dt * spin * (nNow() / 4000) * 1.2) % (2 * Math.PI);
  }
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; run(); } }, 40000);
}

// ------------------------------------------------ controls
const LISTS = { n: N_LIST, fz: FZ_LIST, z: Z_LIST, ae: AE_LIST };
const pick = [...document.querySelectorAll("[data-pick]")];
const toolBtns = [...document.querySelectorAll("[data-tool-btn]")];
const modeBtns = [...document.querySelectorAll("[data-mode]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
document.querySelector('[data-row="tool"]').hidden = LVL !== 1;
document.querySelector('[data-row="vals"]').hidden = LVL === 1;
document.querySelector('[data-row="mode"]').hidden = LVL < 3;
function valueText(key) {
  if (key === "n") return grouped(st.n);
  if (key === "fz") return fzText(st.fz);
  if (key === "ae") return aeText(Math.min(st.ae, D()));
  return String(st.z);
}
function sync() {
  pick.forEach((b) => { b.setAttribute("aria-checked", String(b.dataset.pick === st.sel)); b.tabIndex = b.dataset.pick === st.sel ? 0 : -1; b.querySelector("b").textContent = valueText(b.dataset.pick); });
  toolBtns.forEach((b) => { b.setAttribute("aria-checked", String(b.dataset.toolBtn === st.tool)); b.tabIndex = b.dataset.toolBtn === st.tool ? 0 : -1; });
  modeBtns.forEach((b) => { const on = (b.dataset.mode === "climb") === st.climb; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  const list = LISTS[st.sel].filter((v) => st.sel !== "ae" || v <= D());
  const i = list.findIndex((v) => Math.abs(v - st[st.sel]) < 1e-9);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1));
  describe();
}
function describe() {
  let text;
  if (LVL === 1) text = (st.tool === "face" ? T.face : T.end) + (marked >= 0 ? ", " + T.parts[PARTS[marked].key].join(": ") : "");
  else {
    const vf = vfNow();
    text = "n " + grouped(st.n) + ", fz " + fzText(st.fz) + ", z " + st.z + ", ae " + aeText(aeNow()) + ": vf " + grouped(vf) + " mm/min, Q " + fmt(qOf(AP, aeNow(), vf), 1) + " cm³/min" + (LVL >= 3 ? ", hex " + fmt(thinOf(D(), aeNow()) * st.fz, 3) + " mm, " + (st.climb ? T.climb : T.conv) : "");
  }
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); lastTool = ""; lastBlock = ""; sync(); announce(); kick(); }
function stepValue(dir) {
  const key = st.sel;
  const list = LISTS[key].filter((v) => key !== "ae" || v <= D());
  let i = list.findIndex((v) => Math.abs(v - st[key]) < 1e-9);
  if (i < 0) i = 0;
  i = clamp(i + dir, 0, list.length - 1);
  st[key] = list[i];
  changed();
}
pick.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
toolBtns.forEach((b) => b.addEventListener("click", () => { st.tool = b.dataset.toolBtn; changed(); }));
modeBtns.forEach((b) => b.addEventListener("click", () => { st.climb = b.dataset.mode === "climb"; cyc.u = 0; cyc.phase = "approach"; cyc.t = 0; changed(); }));
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
radioKeys(document.querySelector('[data-row="vals"] [role="radiogroup"]'), ["n", "fz", "z", "ae"], () => st.sel, (v) => { st.sel = v; changed(); });
radioKeys(document.querySelector('[data-row="tool"]'), ["face", "end"], () => st.tool, (v) => { st.tool = v; changed(); });
radioKeys(document.querySelector('[data-row="mode"]'), ["climb", "conv"], () => (st.climb ? "climb" : "conv"), (v) => { st.climb = v === "climb"; changed(); });

// tap the drawing: at level 1 name the nearest part, else pause
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  const g = geometry();
  const tx = -toolX(g), tz = g.tz + cyc.lift * 30;
  let best = -1, bestD = 46;
  PARTS.forEach((p, i) => {
    const o = p.g === "x" ? [tx, g.ty, 0] : p.g === "y" ? [0, g.ty, 0] : p.g === "z" ? [0, 0, tz] : [0, 0, 0];
    const [px, py] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2] + o[2]], P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL !== 1) return;
  const i = nearestPart(toView(event));
  marked = i;
  steer();
  sync();
  announce();
  kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL > 1 && event.key === "ArrowUp") stepValue(1);
  else if (LVL > 1 && event.key === "ArrowDown") stepValue(-1);
  else if (LVL > 1 && ["1", "2", "3", "4"].includes(event.key)) { st.sel = ["n", "fz", "z", "ae"][Number(event.key) - 1]; changed(); }
  else if (LVL > 2 && (event.key === "c" || event.key === "C")) { st.climb = !st.climb; changed(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { cyc.phase = "approach"; cyc.t = 0; cyc.u = 0; run(); } });
if (still.matches) stillPose(); else { cyc.phase = "approach"; cyc.u = 0; cyc.lift = 1; }
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Frezen op een bewerkingscentrum",
    hint1: "Tik een onderdeel · kies de frees",
    hint2: "Kies n, fz, z of ae, dan − of + · 1 s = 4 s",
    hint3: "Kies een waarde, dan − of + · 1 s = 4 s",
    face: "Vlakfrees",
    end: "Vingerfrees",
    climb: "Meelopend",
    conv: "Tegenlopend",
    vals: "Snijwaarde",
    tools: "Gereedschap",
    modes: "Freesrichting",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "Bewerkingscentrum. Niveau 1: pijltjes kiezen een onderdeel. Niveau 2 en 3: toetsen 1 tot 4 kiezen n, fz, z of ae, pijl omhoog en omlaag veranderen de waarde; C wisselt meelopend en tegenlopend.",
  },
  en: {
    title: "Milling on a machining centre",
    hint1: "Tap a part · pick the cutter",
    hint2: "Pick n, fz, z or ae, then − or + · 1 s = 4 s",
    hint3: "Pick a value, then − or + · 1 s = 4 s",
    face: "Face mill",
    end: "End mill",
    climb: "Climb",
    conv: "Conventional",
    vals: "Cutting value",
    tools: "Tool",
    modes: "Milling direction",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Machining centre. Level 1: arrows pick a part. Levels 2 and 3: keys 1 to 4 pick n, fz, z or ae, up and down change the value; C switches climb and conventional.",
  },
};

const sN = STRINGS.nl;
const valBtn = (key, labelHtml) => `<button type="button" class="ml-btn" role="radio" data-pick="${key}" aria-checked="${key === "n"}" tabindex="${key === "n" ? 0 : -1}">${labelHtml}&nbsp;<b></b></button>`;
const controls = [
  `<div class="ml-controls">`,
  `<div class="ml-row" data-row="tool" role="radiogroup" aria-label="${sN.tools}"><button type="button" class="ml-btn" role="radio" data-tool-btn="face" aria-checked="true">${sN.face}</button><button type="button" class="ml-btn" role="radio" data-tool-btn="end" aria-checked="false" tabindex="-1">${sN.end}</button></div>`,
  `<div class="ml-row" data-row="vals"><div role="radiogroup" aria-label="${sN.vals}" style="display:flex;gap:4px;flex:1 1 auto">${valBtn("n", "<i>n</i>")}${valBtn("fz", "<i>f</i><sub>z</sub>")}${valBtn("z", "<i>z</i>")}${valBtn("ae", "<i>a</i><sub>e</sub>")}</div><button type="button" class="ml-btn" data-step="-" aria-label="${sN.minus}">−</button><button type="button" class="ml-btn" data-step="+" aria-label="${sN.plus}">+</button></div>`,
  `<div class="ml-row" data-row="mode" role="radiogroup" aria-label="${sN.modes}"><button type="button" class="ml-btn" role="radio" data-mode="climb" aria-checked="true">${sN.climb}</button><button type="button" class="ml-btn" role="radio" data-mode="conv" aria-checked="false" tabindex="-1">${sN.conv}</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="ml-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="ml-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="ml-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?Math.min(3,l):2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=lv==="1"?s.hint1:lv==="3"?s.hint3:s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var set=function(sel,txt){var n=document.querySelector(sel);if(n)n.textContent=txt;};
set('[data-tool-btn="face"]',s.face);set('[data-tool-btn="end"]',s.end);set('[data-mode="climb"]',s.climb);set('[data-mode="conv"]',s.conv);
document.querySelector('[data-row="tool"]').setAttribute("aria-label",s.tools);document.querySelector('[data-row="mode"]').setAttribute("aria-label",s.modes);
document.querySelector('[data-row="vals"] [role="radiogroup"]').setAttribute("aria-label",s.vals);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".ml-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + latheScript + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: n ${rpmOf(150, 12).toFixed(0)} · vf ${vfOf(0.05, 3, 3980).toFixed(0)} · Q ${qOf(10, 3, 597).toFixed(2)} · hex factor ${thinOf(10, 1)} · L3 vf ${vfOf(0.05 / 0.6, 4, 6000).toFixed(0)}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)} · loupe r ${LOUPE.r}`);

A.auditOrExit(R, P, { frames: A.uniformStates(20), apart: true });

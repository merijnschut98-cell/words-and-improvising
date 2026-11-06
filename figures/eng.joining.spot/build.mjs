// Dev tool, not shipped. Builds the standalone figure for the topic Puntlassen
// (module Lassen en verbinden): the lessons eng.joining.spot (level 1),
// spotwear (level 2), spotquality (level 3) and spotlobe (level 4).
//
//   node figures/eng.joining.spot/build.mjs            build the page
//   node figures/eng.joining.spot/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.spot.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
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
const { tubePieces, tubeSvg } = await import(pathToFileURL(join(SKILL, "kit/tube.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.spot.html");

// ---------------------------------------------------------------- the model
// Resistance spot welding of two galvanised steel sheets of 1.2 mm between
// copper caps with a tip face of Ø6 mm (lessons spot, spotwear, spotquality).
//   tip face area     A  = π/4 · Ø²                                   [mm²]
//   current density   J  = I / A                                      [A/mm²]
//   heat              ∝ I² · R · t, so a constant-heat current scales with 1/√t
//   effective density Je = J · √(t/300 ms) · (3 kN / F)^0.15 (more force, lower
//                     contact resistance, a little less heat)
//   nugget            d  = √(0.1307 · (Je − 104.5))                   [mm]
//                     calibrated on the lesson: 336 A/mm² → 5.5 mm and
//                     215 A/mm² → about 3.8 mm (the jammed dresser, Ø7.5)
//   minimum           4√t, t the thinnest sheet: 4√1.2 = 4.4 mm
//   expulsion         J · (t/300)^0.25 > 365 · √(p/p0), p = F/A, p0 = 3 kN / 28.3 mm²:
//                     too much current or too little force; a mushroomed tip
//                     also lowers the pressure, so more amps on a wide tip spit
//   tip growth        Ø(n) = 6 + 0.001·n + 4e-6·n² mm after n welds, through the
//                     lessons' two points: 250 welds → Ø6.5, 500 welds → Ø7.5
//   stepper           I = I0 · (Ø / 6)², the lesson's rule; it drops back after dressing
//   dressing          every 200 welds, back to Ø6.0; a blunt blade takes off
//                     only 30 % of the growth; 20 dressings per cap → 4,000 welds
// Level 4 (lesson spotlobe): 1.2 mm DP600 on 1.0 mm, lobe test at 300 ms:
// galvanised 7.6–9.0 kA, bare 6.9–9.1 kA. Constant heat gives the lower edge
// Imin(t) = Imin300 · √(300/t); the expulsion edge falls more slowly,
// Iexp(t) = Iexp300 · (300/t)^0.25 (schematic, the lobe widens at longer times).
// The nugget follows the same shape: d = 4 · √((I·√(t/300) − 0.415·Imin300) / (0.585·Imin300)).
const C_N = 0.1307;
const J0 = 104.5;
const JX = 365;
const T0 = 300;
const F0 = 3;
const TIP0 = 6;
const SHEET = 1.2;
const DRESS = 200;
const PER_WELD = 20; // each weld the figure makes stands for 20 on the counter
const CAP_DRESSINGS = 20;
const areaOf = (dia) => (Math.PI / 4) * dia * dia;
const minOf = (t) => 4 * Math.sqrt(t);
const effOf = (j, tw, f) => j * Math.sqrt(tw / 300) * Math.pow(3 / f, 0.15);
const nugOf = (j, tw, f) => { const x = 0.1307 * (effOf(j, tw, f) - 104.5); return x > 0 ? Math.sqrt(x) : 0; };
const spitOf = (j, tw, f, dia) => j * Math.pow(tw / 300, 0.25) > 365 * Math.sqrt((f / ((Math.PI / 4) * dia * dia)) / (3 / ((Math.PI / 4) * 36)));
const tipOf = (n) => 6 + 0.001 * n + 4e-6 * n * n;
const countOf = (dia) => (dia <= 6 ? 0 : (-0.001 + Math.sqrt(1e-6 + 16e-6 * (dia - 6))) / 8e-6);
const LOBE = { galv: { lo: 7.6, hi: 9.0 }, bare: { lo: 6.9, hi: 9.1 } };
const loOf = (s, tw) => LOBE[s].lo * Math.sqrt(300 / tw);
const hiOf = (s, tw) => LOBE[s].hi * Math.pow(300 / tw, 0.25);
const lobeNugOf = (s, i, tw) => { const lo = LOBE[s].lo, x = (i * Math.sqrt(tw / 300) - 0.415 * lo) / (0.585 * lo); return x > 0 ? 4 * Math.sqrt(x) : 0; };

const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(minOf(1.2), 4.38, 0.005, "4√1.2");
near(minOf(2.25), 6, 1e-9, "recall 4√2.25");
near(minOf(1.5), 4.9, 0.01, "L3 4√1.5");
near(minOf(0.8), 3.58, 0.005, "recall 4√0.8");
near(areaOf(6), 28.3, 0.05, "Ø6 area");
near(areaOf(7.5), 44.2, 0.05, "Ø7.5 area");
near(9500 / areaOf(6), 336, 0.5, "L1 current density");
near(9500 / areaOf(7.5), 215, 0.5, "L1 worn density");
near(nugOf(9500 / areaOf(6), 300, 3), 5.5, 0.02, "L1 nugget");
near(nugOf(9500 / areaOf(7.5), 300, 3), 3.8, 0.05, "L1 worn nugget");
near(1.1 * 1.1, 1.21, 1e-9, "10 % current → 21 % heat");
near(9000 / areaOf(6), 318, 0.5, "L2 density");
near(9 * (6.5 / 6) ** 2, 10.6, 0.05, "L2 stepper at Ø6.5");
near(9 * (7.5 / 6) ** 2, 14.1, 0.05, "L2 at Ø7.5");
near(8 * (6 / 5) ** 2, 11.52, 1e-9, "recall stepper");
near(tipOf(250), 6.5, 1e-9, "tip after 250 welds");
near(tipOf(500), 7.5, 1e-9, "tip after 500 welds");
near(countOf(tipOf(330)), 330, 1e-6, "count from tip");
near(CAP_DRESSINGS * DRESS, 4000, 0, "welds per cap");
near((5.6 + 5.2) / 2, 5.4, 1e-9, "L3 button");
near(LOBE.galv.hi - LOBE.galv.lo, 1.4, 1e-9, "L4 lobe");
near(LOBE.bare.hi - LOBE.bare.lo, 2.2, 1e-9, "L4 bare lobe");
near((2.2 - 1.4) / 2.2, 0.36, 0.005, "L4 36 % narrower");
near(lobeNugOf("galv", 7.6, 300), 4, 1e-9, "L4 nugget at the lower edge");
if (spitOf(9500 / areaOf(6), 300, 3, 6)) throw new Error("L1 must not spit");
if (!spitOf(11000 / areaOf(6), 300, 3, 6)) throw new Error("11 kA must spit");
if (!spitOf(9500 / areaOf(6), 300, 2, 6)) throw new Error("too little force must spit");
if (spitOf(10560 / areaOf(6.5), 300, 3, 6.5)) throw new Error("stepper at Ø6.5 must not spit");
if (!spitOf(14060 / areaOf(7.5), 300, 3, 7.5)) throw new Error("stepper at Ø7.5 must spit");
if (nugOf(9000 / areaOf(6.5), 300, 3) < minOf(1.2)) throw new Error("Ø6.5 without stepper still holds");

const I_LIST = [4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
const T_LIST = [200, 250, 300, 350, 400];
const F_LIST = [2, 2.5, 3, 3.5, 4];
const I4_LIST = [6.5, 6.9, 7.2, 7.6, 8, 8.4, 8.7, 9, 9.1, 9.4, 9.8];
const LEVELS = {
  1: { i: 9.5, t: 300, f: 3 },
  2: { i: 9, t: 300, f: 3 },
  3: { i: 9.5, t: 300, f: 3 },
  4: { i: 8.7, t: 300, f: 3 },
};

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the coupon, +y toward the viewer.
// A pedestal spot welder: a C-frame with the transformer in its column, a lower
// arm with the fixed electrode and an upper arm with a servo cylinder driving the
// upper electrode. The tips meet at x = 0, y = 0. A test coupon of two sheets on
// a carriage indexes along x under the tips; a tip dresser on a slide over the
// lower arm moves in along y when the coupon has run clear.
const WIDTH = 600;
const FLOOR = -12;
const BASE = { x: -150, y: -150, w: 300, d: 222, r: 3 };
const TT = 16;
const COL = { x: -45, y: -140, w: 90, d: 56, r: 2 };
const COL_TOP = 240;
const FY = COL.y + COL.d; // the column's front face, y = -84
const LZ = 96; // lower arm axis
const LR = 9;
const HOLD = { x: -14, y: -11, w: 28, d: 22, r: 1.2 };
const HOLD_Z = [84, 116];
const SB = 134; // sheet bottom = lower tip face
const ST = SB + 2 * SHEET; // top of the stack = upper tip face, closed
const STROKE = 22;
const UZ = 210; // upper arm axis
const UR = 10;
const ACT = { x: -14, y: -14, w: 28, d: 28, r: 1.5 };
const ACT_Z = [198, 250];
const GLAND = 190;
const CUT = { r: 12, z: [136, 148] }; // the dresser's cutter head
const UD = (CUT.z[1] - ST) / STROKE; // the upper electrode's share when it closes on the cutter
const DRESS_IN = 40; // the dresser's travel along y
const X_REC = -36; // the coupon carriage is recorded at its last weld
const X_CLEAR = 76;
const WELDS = [-36, -18, 0, 18, 36]; // weld positions on the coupon
const COUPON = { x: -60, y: -12, w: 120, d: 32, r: 0.4 };
const RAILS = [36, 58];

const FIT = [
  ...k.boxCorners(BASE, FLOOR, TT),
  ...k.boxCorners(COL, TT, COL_TOP + 8),
  ...k.boxCorners({ x: -10, y: -116, w: 20, d: 106 }, ACT_Z[1], ACT_Z[1] + 46),
];
const PAD = 6;
const MACHINE_W = 380;
const AZIMUTH = Number(process.env.AZ ?? 52);
const ELEVATION = Number(process.env.EL ?? 27);
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
const frameNY = (o) => G.frameOf(o, [0, -1, 0], X, Zv);
const frameNX = (o) => G.frameOf(o, [-1, 0, 0], Y, Zv);
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const frameDown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA } = k.cameraOf(P);

// ---------------------------------------------------------------- recorder
const MOVES = { x: [X_CLEAR - X_REC, 0, 0], u: [0, 0, STROKE], d: [0, DRESS_IN, 0] };
const R = A.recorder(P, { order: ["x", "u", "d"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "", ...rest } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVES[piece] : [0, 0, 0], attrs: (piece ? ` data-g="${piece}"` : "") + attrs, ...rest });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
let clips = 0;
function rod(name, F, from, to, r, stroke, style = {}, opts = {}) {
  const id = `sp-clip-${clips++}`;
  const R0 = G.rodOut(F, from, to, r, P, { stroke });
  const svg = `<clipPath id="${id}"><path data-hold="" d="${R0.clip}"/></clipPath><g clip-path="url(#${id})">${S(R0.paths, { tone: "mid", ...style })}</g>`;
  const shape = R.solid(A.slide(F, from, to, r, { name }));
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), svg, [shape], opts);
}
// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "sp-glass") {
  const id = `sp-clip-${clips++}`;
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
  return {
    id,
    svg: [
      `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
      `<g clip-path="url(#${id})">`,
      `<path class="iso-top" d="${tops.join("")}"/>`,
      ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d}"/>` : "")),
      `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
      `</g>`,
      `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
    ].join(""),
  };
}

// ---------------------------------------------------------------- shared live geometry
// These draw the parts that change every frame. They take the kit as an
// argument, so the build and the page run the very same code.

// The weld marks on the coupon's top sheet: the tip imprint of every weld made
// so far, a ring of expelled metal where a weld spat. Drawn at the carriage's
// recorded position; the carriage group moves it.
function marksSvg(K, P, marks, fade) {
  let out = "";
  const z = 134 + 2.4 + 0.05;
  for (const m of marks) {
    const ring = (r, n = 20) => { const pts = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push(K.iso([m.x + -36 + Math.cos(a) * r, Math.sin(a) * r, z], P)); } return K.pathOf(pts, true); };
    if (m.spit) out += '<path class="sp-splash" d="' + ring(m.dia / 2 + 2.2) + '"/>';
    out += '<path class="sp-mark" d="' + ring(m.dia / 2) + '"/>';
    out += '<path class="iso-line" data-tone="mid" d="' + ring(m.dia / 2) + '"/>';
  }
  return fade > 0.004 ? '<g style="opacity:' + (1 - fade).toFixed(3) + '">' + out + "</g>" : out;
}

// The current: a glow at the faying surface between the tips, `on` 0..1.
function heatSvg(K, P, on, size) {
  if (on < 0.01) return "";
  const [x, y] = K.iso([0, 0, 134 + 1.2], P);
  return '<circle class="sp-glow" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + (6 + 4 * size).toFixed(2) + '" style="opacity:' + on.toFixed(3) + '"/>' +
    '<circle class="sp-core" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + (1.2 + 0.8 * size).toFixed(2) + '" style="opacity:' + on.toFixed(3) + '"/>';
}

// The cross-section in the inset, in millimetres: u across the weld, v down,
// the faying surface at v = 0. `s` is the state: sheet t, tip Ø, nugget d now,
// its full size, the minimum, gap (closed 0, open > 0), spit, misaligned, peel.
function sectionSvg(s) {
  const f2 = (v) => v.toFixed(2);
  const t = s.t;
  const out = [];
  const dent = s.spit ? 0.25 : 0.06 * (s.d > 0 ? 1 : 0);
  const poly = (pts, cls) => '<path class="' + cls + '" d="M' + pts.map(([u, v]) => f2(u) + " " + f2(v)).join("L") + 'Z"/>';
  const line = (pts, cls) => '<path class="' + cls + '" d="M' + pts.map(([u, v]) => f2(u) + " " + f2(v)).join("L") + '"/>';
  const half = s.tip / 2;
  const mush = Math.max(0, s.tip - 6) * 0.35;
  const tipPts = (dir, shift, face) => {
    // a truncated-cone cap: the face, a flank at about 30°, then the body
    const pts = [[-9.5 + shift, face + dir * 12], [-9.5 + shift, face + dir * (4 + mush)], [-half - 0.2 + shift, face + dir * (0.5 + mush * 0.6)], [-half + shift, face], [half + shift, face], [half + 0.2 + shift, face + dir * (0.5 + mush * 0.6)], [9.5 + shift, face + dir * (4 + mush)], [9.5 + shift, face + dir * 12]];
    return pts;
  };
  if (s.peel) {
    // the coupon pulled apart: a button on the lower sheet, a hole in the
    // upper one; or (interfacial fracture) two flat halves; or nothing at all
    const lift = 2.6;
    const hole = s.mode === "button" ? s.d / 2 : 0;
    out.push(poly([[-12, 0], [12, 0], [12, t], [-12, t]], "sp-mat"));
    out.push(line([[-12, 0], [12, 0]], "sp-edge"));
    if (hole > 0) {
      out.push(poly([[-12, -t - lift], [-hole, -t - lift], [-hole, -lift], [-12, -lift]], "sp-mat"));
      out.push(poly([[hole, -t - lift - 1.2], [12, -t - lift - 3.2], [12, -lift - 3.2], [hole, -lift - 1.2]], "sp-mat"));
      out.push(poly([[-hole, 0], [-hole, -t * 0.9], [-hole * 0.6, -t], [hole * 0.6, -t], [hole, -t * 0.9], [hole, 0]], "sp-button"));
      out.push(line([[-hole, -0.6], [-hole, t + 1.8]], "sp-dim-tick") + line([[hole, -0.6], [hole, t + 1.8]], "sp-dim-tick") + line([[-hole, t + 1.4], [hole, t + 1.4]], "sp-dim"));
    } else {
      out.push(poly([[-12, -t - lift], [12, -t - lift - 2.4], [12, -lift - 2.4], [-12, -lift]], "sp-mat"));
      if (s.d > 0) {
        const h = s.d / 2;
        out.push(poly([[-h, 0], [-h * 0.7, -0.22], [h * 0.7, -0.22], [h, 0]], "sp-nugget"));
        out.push(poly([[-h, -lift - 0.2 * (1 + 1)], [h, -lift - 0.2 * (1 + 1) - 0.4], [h * 0.7, -lift - 0.2 * 2 - 0.62], [-h * 0.7, -lift - 0.2 * 2 - 0.18]], "sp-nugget"));
      }
    }
    const m = s.min / 2;
    out.push('<circle class="sp-min" cx="' + f2(-m) + '" cy="' + f2(t + 1.4) + '" r=".32"/><circle class="sp-min" cx="' + f2(m) + '" cy="' + f2(t + 1.4) + '" r=".32"/>');
    return out.join("");
  }
  const gap = s.gap;
  const shift = s.mis ? 1.1 : 0;
  // the two sheets, dented under the tips
  const topFace = -t;
  const dentPts = (v, dir) => [[-12, v], [-half - 0.6, v], [-half, v + dir * dent], [half, v + dir * dent], [half + 0.6, v], [12, v]];
  out.push(poly([...dentPts(topFace, 1), [12, 0], [-12, 0]], "sp-mat"));
  out.push(poly([[-12, 0], [12, 0], ...dentPts(t, -1).reverse()], "sp-mat2"));
  out.push(line([[-12, 0], [12, 0]], "sp-edge"));
  out.push(line(dentPts(topFace, 1), "sp-edge") + line(dentPts(t, -1), "sp-edge"));
  // the nugget, growing while the current flows
  if (s.d > 0.05) {
    const a = s.d / 2, b = Math.min(0.82 * t, 0.12 * s.d + 0.15);
    const pts = [];
    for (let i = 0; i < 36; i++) { const th = (i / 36) * Math.PI * 2; pts.push([Math.cos(th) * a + shift * 0.4, Math.sin(th) * b]); }
    out.push(poly(pts, s.hot ? "sp-nugget-hot" : "sp-nugget"));
  }
  if (s.spit && s.d > 0) {
    const a = s.d / 2;
    out.push(line([[a + 0.3, 0], [a + 3.6, -0.5]], "sp-spark") + line([[a + 0.3, 0], [a + 3.0, 0.6]], "sp-spark") + line([[-a - 0.3, 0], [-a - 3.4, 0.45]], "sp-spark"));
  }
  // the caps
  out.push(poly(tipPts(-1, shift, topFace + dent - gap), "sp-cap") + line(tipPts(-1, shift, topFace + dent - gap), "sp-cap-line"));
  out.push(poly(tipPts(1, 0, t - dent), "sp-cap") + line(tipPts(1, 0, t - dent), "sp-cap-line"));
  // the nugget diameter under the stack, and the minimum 4√t as two dots
  const dm = t + 1.6;
  if (s.d > 0.05) {
    const a = s.d / 2;
    out.push(line([[-a, dm - 0.5], [-a, dm + 0.5]], "sp-dim-tick") + line([[a, dm - 0.5], [a, dm + 0.5]], "sp-dim-tick") + line([[-a, dm], [a, dm]], "sp-dim"));
  }
  const m = s.min / 2;
  out.push('<circle class="sp-min" cx="' + f2(-m) + '" cy="' + f2(dm) + '" r=".32"/><circle class="sp-min" cx="' + f2(m) + '" cy="' + f2(dm) + '" r=".32"/>');
  return out.join("");
}

// The weld lobe (level 4): current across, weld time up, the band between the
// minimum-nugget edge and the expulsion edge, the bare-steel lobe as an outline,
// and the set point. Chart units are the inset's own (w × h).
function lobeSvg(w, h, stack, iNow, tNow, spit, dec) {
  const x0 = 34, x1 = w - 10, y0 = h - 34, y1 = 30;
  const X = (i) => x0 + ((i - 6) / 4.5) * (x1 - x0);
  const Y = (t) => y0 - ((t - 200) / 200) * (y0 - y1);
  const lo = (s, t) => ({ galv: 7.6, bare: 6.9 })[s] * Math.sqrt(300 / t);
  const hi = (s, t) => ({ galv: 9.0, bare: 9.1 })[s] * Math.pow(300 / t, 0.25);
  const edge = (s, fn) => { const p = []; for (let t = 200; t <= 400; t += 10) p.push([X(fn(s, t)), Y(t)]); return p; };
  const path = (pts, close) => "M" + pts.map(([a, b]) => a.toFixed(1) + " " + b.toFixed(1)).join("L") + (close ? "Z" : "");
  const out = [];
  out.push('<rect class="sp-plot" x="' + x0 + '" y="' + y1 + '" width="' + (x1 - x0) + '" height="' + (y0 - y1) + '"/>');
  for (let i = 6; i <= 10; i++) out.push('<path class="sp-grid" d="M' + X(i).toFixed(1) + " " + y1 + "V" + y0 + '"/>');
  for (const t of [250, 300, 350]) out.push('<path class="sp-grid" d="M' + x0 + " " + Y(t).toFixed(1) + "H" + x1 + '"/>');
  const other = stack === "galv" ? "bare" : "galv";
  const band = (s) => path([...edge(s, lo), ...edge(s, hi).reverse()], true);
  out.push('<path class="sp-lobe-other" d="' + band(other) + '"/>');
  out.push('<path class="sp-lobe" d="' + band(stack) + '"/>');
  out.push('<path class="sp-edge-lo" d="' + path(edge(stack, lo)) + '"/><path class="sp-edge-hi" d="' + path(edge(stack, hi)) + '"/>');
  out.push('<path class="sp-axis" d="M' + x0 + " " + y1 + "V" + y0 + "H" + x1 + '"/>');
  for (let i = 6; i <= 10; i++) out.push('<path class="sp-axis" d="M' + X(i).toFixed(1) + " " + y0 + "v4" + '"/><text class="sp-tick" x="' + X(i).toFixed(1) + '" y="' + (y0 + 16) + '" text-anchor="middle">' + i + "</text>");
  for (const t of [200, 300, 400]) out.push('<path class="sp-axis" d="M' + x0 + " " + Y(t).toFixed(1) + "h-4" + '"/><text class="sp-tick" x="' + (x0 - 6) + '" y="' + (Y(t) + 4).toFixed(1) + '" text-anchor="end">' + t + "</text>");
  out.push('<text class="sp-unit" x="' + x1 + '" y="' + (y0 + 30) + '" text-anchor="end">kA</text><text class="sp-unit" x="' + (x0 - 22) + '" y="' + (y1 - 14) + '" text-anchor="start">ms</text>');
  const px = X(iNow), py = Y(tNow);
  out.push('<path class="sp-cross" d="M' + px.toFixed(1) + " " + y0 + "V" + py.toFixed(1) + "M" + x0 + " " + py.toFixed(1) + "H" + px.toFixed(1) + '"/>');
  out.push('<circle class="' + (spit ? "sp-point-bad" : "sp-point") + '" cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5"/>');
  return out.join("");
}

// ---------------------------------------------------------------- base and column
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -4), FLOOR, 2, P)}"/>`];
for (const [x, y] of k.corners(BASE, 16)) post("stand.foot", x, y, 9, FLOOR, 0, { tone: "lo" }, { steps: 6 });
{
  const bolts = k.corners(BASE, 7);
  const fy = BASE.y + BASE.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="sp-card" d="${flatRect(-136, 3, -92, 13, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-131 -10.2H-100M-131 -7.4H-108M-131 -4.6H-104"/></g>`,
    Dt([[-134, fy, 11.6], [-94, fy, 11.6], [-134, fy, 4.4], [-94, fy, 4.4]].map(at), { size: 0.4 }),
  ].join("");
  const extra = L(k.planOutline(k.insetPlan(BASE, 4), TT, P, 3), { tone: "faint" }) + Dt(bolts.map(([x, y]) => at([x, y, TT])), { size: 0.5 });
  box("stand.base", BASE, 0, TT, { tone: "lo" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(BASE, 5, P, 3), { tone: "faint" }), extra: extra + plate });
}
// the column: transformer and controller in one welded frame
let DISPLAY = { x0: -41, x1: -10, z0: 134, z1: 160, r: 1.2, depth: 1 };
{
  const extra = [];
  const digits = [
    k.faceTextSvg(k.sideMatrix([DISPLAY.x0 + 1.8, FY - DISPLAY.depth], DISPLAY.z1 - 6.5, P, "left"), "9,5 kA", { size: 5, tone: "hi" }).replace("<text ", '<text data-amp="" '),
    k.faceTextSvg(k.sideMatrix([DISPLAY.x0 + 1.8, FY - DISPLAY.depth], DISPLAY.z1 - 14, P, "left"), "300 ms", { size: 5, tone: "hi" }).replace("<text ", '<text data-ms="" '),
    k.faceTextSvg(k.sideMatrix([DISPLAY.x0 + 1.8, FY - DISPLAY.depth], DISPLAY.z1 - 21.5, P, "left"), "3,0 kN", { size: 5, tone: "hi" }).replace("<text ", '<text data-kn="" '),
  ].join("");
  const r = recess(DISPLAY, FY);
  extra.push(r.svg, `<g clip-path="url(#${r.id})">${digits}</g>`);
  // vent slots on the side over the transformer
  const xs = COL.x + COL.w;
  const vents = [0, 1, 2, 3, 4, 5].map((i) => {
    const z = 40 + i * 9;
    return k.pathOf([at([xs, -128, z]), at([xs, -96, z]), at([xs, -96, z + 3]), at([xs, -128, z + 3])], true);
  }).join("");
  extra.push(L(vents, { tone: "lo" }));
  // the rating plate on the side
  extra.push(`<g transform="${k.sideMatrix([xs, -132], 0, P, "right")}"><path class="sp-card" d="${flatRect(0, 120, 30, 138, 1.2, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M4 -133H24M4 -129H18M4 -125H22"/></g>`);
  extra.push(Dt([[xs, -131, 136], [xs, -103, 136], [xs, -131, 122], [xs, -103, 122]].map(at), { size: 0.4 }));
  extra.push(Dt([[COL.x + 4, FY, 26], [COL.x + COL.w - 4, FY, 26], [COL.x + 4, FY, COL_TOP - 4], [COL.x + COL.w - 4, FY, COL_TOP - 4]].map(at), { size: 0.45 }));
  box("stand.column", COL, TT, COL_TOP, { tone: "mid" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(COL, 34, P, 3) + k.sideSeam(COL, 184, P, 3), { tone: "faint" }), extra: extra.join("") });
  box("stand.column-cap", k.insetPlan(COL, 3), COL_TOP, COL_TOP + 4, { tone: "mid", crease: "lo" }, { bevel: 0.3 });
}
// lamps on the column face: weld (current on) and expulsion
const lamp = (name, x, z, attr) => {
  const F = frameY([x, FY, z]);
  discAt(name, F, 0, 1.2, 3, { tone: "mid" });
  discAt(name + "-cap", F, 1.2, 2.6, 2.2, { tone: "hi", crease: "lo" }, { attrs: ` ${attr}=""` });
};
lamp("stand.weld-lamp", 18, 166, "data-lamp");
lamp("stand.spit-lamp", 30, 166, "data-spit");
// the main switch knob
{
  const F = frameY([24, FY, 150]);
  discAt("stand.knob", F, 0, 1.6, 5, { tone: "mid" });
  discAt("stand.knob-cap", F, 1.6, 5, 4, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(F, 2, 5, 4, 14, P, { seams: false }), { tone: "lo" }), extra: Dt([at(G.pointOf(F, 5, 2.6, -Math.PI / 2))], { size: 0.45, tone: "mid" }) });
}

// ---------------------------------------------------------------- lower arm and electrode
{
  const Fa = frameY([0, FY, LZ]);
  discAt("stand.lower-flange", Fa, 0, 4, 13, { tone: "mid" }, { extra: Dt(G.dotsOf(Fa, 4, 10, 6, P, { all: true }), { size: 0.4 }) });
  discAt("stand.lower-arm", Fa, 4, HOLD.y - FY, LR, { tone: "mid" }, { inner: L(G.arcOf(Fa, 40, LR, P), { tone: "faint" }) });
  box("stand.lower-holder", HOLD, HOLD_Z[0], HOLD_Z[1], { tone: "mid" }, { bevel: 0.4, extra: Dt([at([-8, 11, 110]), at([8, 11, 110])], { size: 0.4 }) });
  const Fu = frameUp([0, 0, HOLD_Z[1]]);
  discAt("stand.lower-shank", Fu, 0, 8, 5.5, { tone: "mid" }, { inner: L(G.arcOf(Fu, 3, 5.5, P), { tone: "faint" }) });
  turned("stand.lower-cap", frameUp([0, 0, HOLD_Z[1] + 8]), [[0, 8], [4, 8], [SB - HOLD_Z[1] - 8, 3]], { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(frameUp([0, 0, HOLD_Z[1] + 8]), 2, 8, P), { tone: "lo" }) });
}
// the tip dresser's slide rail, on two posts on the lower arm
{
  const ytop = LZ + Math.sqrt(LR * LR - 9);
  for (const y of [-70, -36]) post("stand.dress-post", 0, y, 3, LZ + LR - 0.45, 128, { tone: "mid" });
  box("stand.dress-rail", { x: -6, y: -80, w: 12, d: 60, r: 0.6 }, 128, 134, { tone: "mid", crease: "lo" }, { bevel: 0.3, extra: Dt([[0, -76, 134], [0, -24, 134]].map(at), { size: 0.38 }) });
}

// ---------------------------------------------------------------- upper arm, cylinder and electrode
{
  const Fa = frameY([0, FY, UZ]);
  discAt("stand.upper-flange", Fa, 0, 4, 16, { tone: "mid" }, { extra: Dt(G.dotsOf(Fa, 4, 13, 6, P, { all: true }), { size: 0.4 }) });
  discAt("stand.upper-arm", Fa, 4, ACT.y - FY, UR, { tone: "mid" }, { inner: L(G.arcOf(Fa, 40, UR, P), { tone: "faint" }) });
  box("stand.cylinder", ACT, ACT_Z[0], ACT_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.5, inner: L(k.sideSeam(ACT, ACT_Z[1] - 8, P, 3), { tone: "faint" }), extra: Dt(k.corners(ACT, 3.5).map(([x, y]) => at([x, y, ACT_Z[1]])), { size: 0.42 }) });
  box("stand.motor", { x: -10, y: -10, w: 20, d: 20, r: 1.2 }, ACT_Z[1], ACT_Z[1] + 22, { tone: "mid", crease: "lo" }, { bevel: 0.4, inner: L([0, 1, 2, 3].map((i) => k.sideSeam({ x: -10, y: -10, w: 20, d: 20, r: 1.2 }, ACT_Z[1] + 6 + i * 3.5, P, 2)).join(""), { tone: "faint" }) });
  discAt("stand.gland", frameUp([0, 0, GLAND]), 0, ACT_Z[0] - GLAND, 8, { tone: "mid", crease: "lo" }, { extra: L(G.circleOf(frameUp([0, 0, GLAND]), 0, 4.4, P, 32), { tone: "faint" }) });
  // the cable from the servo motor to the column
  discAt("stand.plug", frameUp([0, 0, ACT_Z[1] + 22]), 0, 5, 4, { tone: "hi", crease: "lo" });
  discAt("stand.socket", frameUp([0, -112, COL_TOP + 4]), 0, 5, 4.5, { tone: "hi", crease: "lo" });
}
{
  const route = G.fillet([[0, 0, ACT_Z[1] + 27], [0, 0, ACT_Z[1] + 42], [0, -112, ACT_Z[1] + 42], [0, -112, COL_TOP + 9]], 18, 12, { P, tube: 2.4 });
  const id = R.nameFor("cable");
  R.route(id, route, 2.4, { owner: id });
  tubePieces(route, 2.4, P, { maxLength: 14 }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone: "mid" }), [A.tube(part.points, part.radii)], { route: id, chunk: index }),
  );
}
// the cooling-water hose from the column to the back of the lower holder
{
  const HZ = 111, HX = -8;
  discAt("stand.water-out", frameNY([HX, HOLD.y, HZ]), 0, 5, 3.4, { tone: "hi", crease: "lo" });
  discAt("stand.water-in", frameY([HX, FY, HZ]), 0, 5, 3.4, { tone: "hi", crease: "lo" });
  const route = [[HX, FY + 5, HZ], [HX, HOLD.y - 5, HZ]];
  const id = R.nameFor("hose");
  R.route(id, route, 2.2, { owner: id });
  tubePieces(route, 2.2, P, { maxLength: 14 }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone: "lo" }), [A.tube(part.points, part.radii)], { route: id, chunk: index }),
  );
}
// the upper electrode (U): ram, shank and cap, recorded closed on the coupon
{
  const UG = { piece: "u" };
  const Fd = frameDown([0, 0, GLAND]);
  rod("u.ram", Fd, 0, GLAND - (ST + 28), 4, STROKE, { tone: "hi", crease: "lo" }, UG);
  box("u.clamp", { x: -7, y: -7, w: 14, d: 14, r: 1.4 }, ST + 24, ST + 28, { tone: "mid" }, { ...UG, bevel: 0.3, extra: Dt([at([0, 7, ST + 26])], { size: 0.4, tone: "hi" }) });
  const Fs = frameUp([0, 0, ST + 14]);
  discAt("u.shank", Fs, 0, 10, 5.5, { tone: "mid" }, { ...UG, inner: L(G.arcOf(Fs, 6, 5.5, P), { tone: "faint" }) });
  const Fc = frameDown([0, 0, ST + 14]);
  turned("u.cap", Fc, [[0, 8], [6, 8], [14, 3]], { tone: "hi", crease: "lo" }, { ...UG, inner: L(G.arcOf(Fc, 2, 8, P), { tone: "lo" }) });
}

// ---------------------------------------------------------------- the tip dresser (D), parked
{
  const DG = { piece: "d" };
  const CY = -40; // the cutter's centre, parked
  const car = { x: -10, y: -72, w: 20, d: 18, r: 1 };
  box("d.carriage", car, 134, 150, { tone: "mid" }, { ...DG, bevel: 0.4, extra: Dt([at([-6, -54, 146]), at([6, -54, 146])], { size: 0.4 }) });
  post("d.motor", 0, -63, 7, 150, 166, { tone: "mid", crease: "lo" }, { ...DG, inner: L(k.sideArc(0, -63, 7, 160, P, 18), { tone: "faint" }) });
  discAt("d.motor-cap", frameUp([0, -63, 166]), 0, 3, 5, { tone: "hi", crease: "lo" }, DG);
  box("d.arm", { x: -5, y: car.y + car.d, w: 10, d: CY - CUT.r + 0.3 - (car.y + car.d), r: 0.5 }, 137, 145, { tone: "mid" }, DG);
  const Fc = frameUp([0, CY, CUT.z[0]]);
  discAt("d.cutter", Fc, 0, CUT.z[1] - CUT.z[0], CUT.r, { tone: "mid", crease: "lo" }, { ...DG, inner: L(G.arcOf(Fc, 6, CUT.r, P), { tone: "faint" }), extra: `<g data-blade="">${L(G.circleOf(Fc, CUT.z[1] - CUT.z[0], 5, P, 32), { tone: "lo" })}</g>` + Dt([at([0, CY, CUT.z[1]])], { size: 0.6, tone: "hi" }) });
}

// ---------------------------------------------------------------- the coupon carriage (X), recorded at its last weld
{
  const XG = { piece: "x" };
  const vx = (plan) => ({ ...plan, x: plan.x + X_REC });
  for (const yc of RAILS) {
    const rail = { x: -112, y: yc - 4, w: 260, d: 8, r: 0.6 };
    box("stand.rail", rail, TT, TT + 8, { tone: "mid", crease: "lo" }, { bevel: 0.3, extra: Dt([-90, -40, 10, 60, 110].map((x) => at([x, yc, TT + 8])), { size: 0.34, tone: "lo" }) });
    for (const x of [-118, 148]) box("stand.rail-stop", { x: x - 0, y: yc - 5, w: 6, d: 10, r: 0.6 }, TT, TT + 12, { tone: "mid" }, { bevel: 0.3 });
  }
  {
    const strip = { x: -112, y: 66, w: 260, d: 6, r: 0.4 };
    const ticks = k.topTicks(-110, 146, 4, 5, strip.y, TT + 0.6, [2, 3.8], P, "x");
    box("stand.ruler", strip, TT, TT + 0.6, { tone: "lo", crease: "none" }, { extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) });
  }
  for (const xc of [-44, 44]) for (const yc of RAILS) box("x.block", vx({ x: xc - 10, y: yc - 6, w: 20, d: 12, r: 1 }), TT + 8, 32, { tone: "mid" }, { ...XG, bevel: 0.3 });
  const cplate = vx({ x: -66, y: 26, w: 132, d: 42, r: 2 });
  box("x.carriage", cplate, 32, 38, { tone: "mid" }, { ...XG, steps: 3, bevel: 0.5, inner: L(k.sideSeam(cplate, 34.5, P, 3), { tone: "faint" }), extra: Dt(k.corners(cplate, 5).map(([x, y]) => at([x, y, 38])), { size: 0.45 }) });
  box("x.index", vx({ x: -1.5, y: 68, w: 3, d: 4, r: 0.3 }), 33, 37, { tone: "hi", crease: "lo" }, XG);
  for (const xr of [-50, 50]) {
    post("x.post", xr + X_REC, 40, 4, 38, 128, { tone: "mid" }, { ...XG, inner: L(k.sideArc(xr + X_REC, 40, 4, 60, P, 16), { tone: "faint" }) });
    box("x.bracket", vx({ x: xr - 5, y: 14, w: 10, d: 30, r: 0.8 }), 128, SB, { tone: "mid" }, { ...XG, bevel: 0.3 });
    box("x.clamp", vx({ x: xr - 4, y: 23, w: 8, d: 8, r: 0.6 }), SB, SB + 8, { tone: "mid" }, { ...XG, bevel: 0.3 });
    box("x.clamp-arm", vx({ x: xr - 3, y: 12, w: 6, d: 11, r: 0.6 }), ST, ST + 3, { tone: "hi", crease: "lo" }, { ...XG, extra: Dt([at([xr + X_REC, 17, ST + 3])], { size: 0.42, tone: "mid" }) });
  }
  // the coupon: two 1.2 mm sheets, the upper one shifted so both edges show
  const lower = vx(COUPON);
  const upper = vx({ ...COUPON, x: COUPON.x + 2, y: COUPON.y + 1 });
  box("x.sheet-lower", lower, SB, SB + SHEET, { tone: "lo", crease: "lo" }, XG);
  box("x.sheet-upper", upper, SB + SHEET, ST, { tone: "hi", crease: "lo" }, { ...XG, extra: L(k.lineOnTop([upper.x + 6, 0], [upper.x + upper.w - 6, 0], ST, P), { tone: "faint" }) + Dt([at([upper.x + 6, 0, ST]), at([upper.x + upper.w - 6, 0, ST])], { size: 0.4, tone: "lo" }) });
}
// the weld marks, rebuilt live; recorded as a thin skin on the top sheet
put("x.marks", [X_REC, 0, ST + 0.05], marksSvg(k, P, WELDS.map((x) => ({ x, dia: 6, spit: false })), 0), [R.solid(A.box([X_REC - 40, -4, ST], [X_REC + 40, 4, ST + 0.1], { name: "x.marks", owner: "x.sheet-upper" }))], { piece: "x", attrs: " data-marks=\"\"" });
solids++;
// the heat at the faying surface, fixed between the tips
put("heat", [0, 0, SB + 1.2], heatSvg(k, P, 1, 0.5), [R.solid(A.cylinder(0, 0, 1, SB + 1, 0.4, { name: "heat", owner: "x.sheet-lower" }))], { attrs: ' data-heat=""' });
solids++;

// ---------------------------------------------------------------- settle and assemble
const WELD_SHARES = WELDS.map((x) => (-x - X_REC) / (X_CLEAR - X_REC));
const STATES = [
  ...WELD_SHARES.flatMap((x) => [0, 0.5, 1].map((u) => ({ label: `weld x${x.toFixed(2)} u${u}`, shares: { x, u, d: 0 } }))),
  ...[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((x) => ({ label: `travel ${x}`, shares: { x, u: 1, d: 0 } })),
  ...[0.2, 0.4, 0.6, 0.8, 1].map((d) => ({ label: `dresser in ${d}`, shares: { x: 1, u: 1, d } })),
  ...[UD, (UD + 1) / 2].map((u) => ({ label: `dress u${u.toFixed(2)}`, shares: { x: 1, u, d: 1 } })),
];
A.settle(R, P, { states: [0, ...STATES, 1] });
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);

// the inset to the right of the welder: cross-section (levels 1–3), lobe (level 4)
const INSET = (() => {
  const w = 196, h = Math.min(236, HEIGHT - 24);
  return { x: WIDTH - w - 6, y: Math.round((HEIGHT - h) / 2), w, h };
})();
const SEC_MM = 11; // the section shows ±11 mm
const SEC_K = (INSET.w / 2 - 4) / SEC_MM;
const SEC0 = { s: 0, t: SHEET, tip: 6, d: 5.5, full: 5.5, min: minOf(SHEET), gap: 0, spit: false, mis: false, peel: false, hot: false };
const inset = [
  `<g class="sp-inset" transform="translate(${INSET.x} ${INSET.y})">`,
  `<rect class="sp-inset-bg" width="${INSET.w}" height="${INSET.h}" rx="10"/>`,
  `<clipPath id="sp-inset-clip"><rect x="1" y="1" width="${INSET.w - 2}" height="${INSET.h - 2}" rx="9"/></clipPath>`,
  `<g clip-path="url(#sp-inset-clip)"><g data-view="" transform="translate(${INSET.w / 2} ${INSET.h / 2}) scale(${SEC_K.toFixed(3)})">${sectionSvg(SEC0)}</g><g data-lobe=""></g></g>`,
  `<rect class="sp-inset-rim" width="${INSET.w}" height="${INSET.h}" rx="10"/>`,
  `</g>`,
].join("");

const body = [...halo, ...groups, `<g data-sparks=""></g>`, `<g data-mark=""></g>`, inset];

const LABEL_NL =
  "Een puntlasmachine op een sokkel: een zware voetplaat, een kolom met de lastransformator en de lasbesturing met een display voor kiloampère, milliseconden en kilonewton, en twee armen. Aan de onderarm zit de vaste koperen elektrodekap, aan de bovenarm een servocilinder die de bovenste kap omlaag drukt. Ertussen ligt een proefstrook van twee stalen platen van 1,2 mm op een slede, vastgezet met twee klemmen; de slede schuift de strook punt voor punt onder de kappen. Achter de kappen staat de kappenfrees op een geleider. Een koelwaterslang loopt naar de onderste kap. Een inzet toont de doorsnede: de twee platen tussen de kappen en de laslens die groeit.";
const LABEL_EN =
  "A pedestal spot welder: a heavy base plate, a column holding the weld transformer and the weld controller with a display for kiloamps, milliseconds and kilonewtons, and two arms. The lower arm carries the fixed copper electrode cap, the upper arm a servo cylinder that drives the upper cap down. Between them lies a test coupon of two 1.2 mm steel sheets on a carriage, held by two clamps; the carriage moves the coupon weld by weld under the caps. Behind the caps the tip dresser waits on a slide. A cooling-water hose runs to the lower cap. An inset shows the cross-section: the two sheets between the caps and the nugget as it grows.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "upper", g: "u", at: [0, 8, ST + 8] },
  { key: "lower", g: "s", at: [0, 8, SB - 8] },
  { key: "sheets", g: "x", at: [WELDS[0] + X_REC + 30, 20, ST] },
  { key: "nugget", g: "s", at: [0, 0, SB + 1.2] },
  { key: "cylinder", g: "s", at: [0, 14, 224] },
  { key: "column", g: "s", at: [40, FY, 70] },
  { key: "display", g: "s", at: [(DISPLAY.x0 + DISPLAY.x1) / 2, FY, 147] },
  { key: "dresser", g: "d", at: [0, -40 + 12, 141] },
  { key: "hose", g: "s", at: [-8, -50, 111] },
  { key: "clamp", g: "x", at: [50 + X_REC, 20, ST + 3] },
  { key: "carriage", g: "x", at: [-30 + X_REC, 68, 35] },
  { key: "arm", g: "s", at: [0, -50, LZ] },
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
  --sp-hair:rgba(240,233,218,.12);--sp-accent:#5C9FAE;--sp-glass:#0A1E23;--sp-mat:#2B4B50;--sp-mat2:#22403F;--sp-cap:#16353D;
  --sp-nug:#3E7F8E;--sp-hot:#BFE3EA;--sp-glow:#BFE3EA;--sp-core:#F4FBFC;--sp-lobe:rgba(92,159,174,.32);--sp-mark:#24484F;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --sp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --sp-hair:rgba(11,41,27,.14);--sp-accent:#276F81;--sp-glass:#E2ECEA;--sp-mat:#DDD4BF;--sp-mat2:#CFC6AF;--sp-cap:#E6DECB;
  --sp-nug:#7FB0BB;--sp-hot:#276F81;--sp-glow:#7FB6C3;--sp-core:#FFFFFF;--sp-lobe:rgba(39,111,129,.22);--sp-mark:#C9D3CC;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--sp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:204px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:300px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--sp-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--bottom:148px}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--sp-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:110px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:128px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
html[data-level="1"] .iso-plate-corner[data-corner="hint"]{bottom:62px!important}
html[data-level="1"] .iso-plate-corner[data-corner="readout"]{bottom:80px!important}
.sp-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-acc{color:var(--sp-accent);font-weight:600}
.sp-strong{color:var(--anatomy-strong);font-weight:600}
.sp-mute{color:var(--anatomy-muted)}
.sp-warn{color:var(--sp-accent);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.sp-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.sp-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.sp-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.sp-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.sp-row{display:flex;gap:4px;height:44px}
.sp-row[hidden]{display:none}
.sp-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--sp-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--sp-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.sp-btn[hidden]{display:none}
.sp-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.sp-btn[aria-checked="true"],.sp-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--sp-accent);color:var(--sp-accent);font-weight:600}
.sp-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.sp-btn:disabled{opacity:.4;cursor:default}
.sp-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.sp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sp-glass{fill:var(--sp-glass);stroke:none}
.sp-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso .iso-face-text{font-family:var(--anatomy-mono);font-weight:600}
.sp-mark{fill:var(--sp-mark);stroke:none}
.sp-splash{fill:none;stroke:var(--sp-accent);stroke-width:.7px}
.sp-glow{fill:url(#sp-glow-grad);stroke:none;pointer-events:none}
.sp-core{fill:var(--sp-core);stroke:none}
.sp-spark-line{stroke:var(--sp-glow);stroke-width:.8px;stroke-linecap:round;fill:none}
.sp-inset-bg{fill:var(--anatomy-card);stroke:none}
.sp-inset-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.sp-mat{fill:var(--sp-mat);stroke:none}
.sp-mat2{fill:var(--sp-mat2);stroke:none}
.sp-edge{fill:none;stroke:var(--anatomy-mid);stroke-width:.08px}
.sp-cap{fill:var(--sp-cap);stroke:none}
.sp-cap-line{fill:none;stroke:var(--anatomy-mid);stroke-width:.16px}
.sp-nugget{fill:var(--sp-nug);stroke:var(--anatomy-hi);stroke-width:.08px}
.sp-nugget-hot{fill:var(--sp-hot);stroke:var(--sp-accent);stroke-width:.08px}
.sp-button{fill:var(--sp-nug);stroke:var(--anatomy-hi);stroke-width:.08px}
.sp-spark{fill:none;stroke:var(--sp-accent);stroke-width:.14px;stroke-linecap:round}
.sp-dim{fill:none;stroke:var(--sp-accent);stroke-width:.12px}
.sp-dim-tick{fill:none;stroke:var(--sp-accent);stroke-width:.12px}
.sp-min{fill:var(--anatomy-hi);stroke:none}
.sp-plot{fill:none;stroke:none}
.sp-grid{fill:none;stroke:var(--anatomy-faint);stroke-width:.8px}
.sp-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.sp-lobe{fill:var(--sp-lobe);stroke:none}
.sp-lobe-other{fill:none;stroke:var(--anatomy-lo);stroke-width:1px}
.sp-edge-lo,.sp-edge-hi{fill:none;stroke:var(--sp-accent);stroke-width:1.4px}
.sp-cross{fill:none;stroke:var(--anatomy-mid);stroke-width:.7px}
.sp-point{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.5px}
.sp-point-bad{fill:var(--sp-accent);stroke:var(--anatomy-card);stroke-width:1.5px}
.sp-tick{font:600 12px var(--anatomy-mono);fill:var(--anatomy-muted)}
.sp-unit{font:600 12px var(--anatomy-mono);fill:var(--anatomy-text)}
.sp-ring{fill:none;stroke:var(--sp-accent);stroke-width:1.4px}
.sp-ring-dot{fill:var(--sp-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-spit] .iso-top,[data-spit] .iso-shade,[data-spit] .iso-fill{transition:fill .2s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill,[data-spit][data-on] .iso-top,[data-spit][data-on] .iso-shade,[data-spit][data-on] .iso-fill{fill:var(--sp-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-spit] .iso-top,[data-spit] .iso-shade,[data-spit] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const SB = ${SB}, ST = ${ST}, STROKE = ${STROKE}, UD = ${UD}, DRESS_IN = ${DRESS_IN}, X_REC = ${X_REC}, X_CLEAR = ${X_CLEAR};
const SHEET = ${SHEET}, DRESS = ${DRESS}, PER_WELD = ${PER_WELD}, CAP_DRESSINGS = ${CAP_DRESSINGS};
const WELDS = ${JSON.stringify(WELDS)}, LOBE = ${JSON.stringify(LOBE)}, INSET = ${JSON.stringify(INSET)}, SEC_K = ${SEC_K};
const I_LIST = ${JSON.stringify(I_LIST)}, T_LIST = ${JSON.stringify(T_LIST)}, F_LIST = ${JSON.stringify(F_LIST)}, I4_LIST = ${JSON.stringify(I4_LIST)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const areaOf = ${areaOf.toString()};
const minOf = ${minOf.toString()};
const effOf = ${effOf.toString()};
const nugOf = ${nugOf.toString()};
const spitOf = ${spitOf.toString()};
const tipOf = ${tipOf.toString()};
const countOf = ${countOf.toString()};
const loOf = (s, tw) => LOBE[s].lo * Math.sqrt(300 / tw);
const hiOf = (s, tw) => LOBE[s].hi * Math.pow(300 / tw, 0.25);
const lobeNugOf = ${lobeNugOf.toString()};
${marksSvg.toString()}
${heatSvg.toString()}
${sectionSvg.toString()}
${lobeSvg.toString()}
const K = { iso, pathOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", galv: "Galvanised", stack12: "1.2 + 1.2 mm", heat: "heat", nugget: "Nugget", good: "good", small: "TOO SMALL", spit: "EXPULSION", none: "no nugget: stuck weld", tapPart: "tap a part to name it",
      counter: "Weld counter", dressing: "dressing", tip: "tip", stepper: "stepper", stepOff: "stepper off", blunt: "BLUNT DRESSER", capNew: "new cap",
      aligned: "tips aligned", misaligned: "TIPS OFFSET", peel: "Peel test: button", interfacial: "Peel test: INTERFACIAL FRACTURE, reject", reject: "reject", ut: "UT", utGood: "echoes at 2.4 mm: the whole stack, a nugget", utStick: "echoes at 1.2 mm: the top sheet only, a stuck weld",
      dp: "DP600", dpGalv: "galvanised", dpBare: "bare", on: "on", lobe: "Lobe", lobeAt: "at", above: "above the minimum", below: "below expulsion", outLow: "BELOW THE LOBE: nugget too small", outHigh: "ABOVE THE LOBE: expulsion", bareLobe: "bare", narrower: "narrower",
      parts: { upper: ["Upper electrode", "copper cap on the servo ram: squeezes the sheets"], lower: ["Lower electrode", "the fixed copper cap, Ø6 mm tip face"], sheets: ["Sheets", "two galvanised steel sheets of 1.2 mm, overlapping"], nugget: ["Nugget", "the lens of molten metal between the sheets"], cylinder: ["Servo cylinder", "sets the electrode force in kN"], column: ["Transformer", "makes 8 to 12 kA at a few volts"], display: ["Weld controller", "current, weld time and force"], dresser: ["Tip dresser", "a small cutter that reshapes the caps"], hose: ["Cooling water", "cools the caps from inside"], clamp: ["Clamp", "holds the coupon on the carriage"], carriage: ["Carriage", "moves the coupon weld by weld"], arm: ["Lower arm", "carries the current to the lower cap"] } }
  : { dec: ",", grp: ".", galv: "Verzinkt", stack12: "1,2 + 1,2 mm", heat: "warmte", nugget: "Laslens", good: "goed", small: "TE KLEIN", spit: "UITSPATTEN", none: "geen lens: plakpunt", tapPart: "tik een onderdeel voor de naam",
      counter: "Puntenteller", dressing: "freesbeurt", tip: "kap", stepper: "stepper", stepOff: "stepper uit", blunt: "FREES BOT", capNew: "nieuwe kap",
      aligned: "kappen recht", misaligned: "KAPPEN SCHEEF", peel: "Peeltest: knoop", interfacial: "Peeltest: GRENSVLAKBREUK, afkeur", reject: "afkeur", ut: "UT", utGood: "echo's op 2,4 mm: heel pakket, laslens", utStick: "echo's op 1,2 mm: alleen bovenplaat, plakpunt",
      dp: "DP600", dpGalv: "verzinkt", dpBare: "onbekleed", on: "op", lobe: "Venster", lobeAt: "bij", above: "boven minimum", below: "onder uitspatten", outLow: "ONDER HET VENSTER: lens te klein", outHigh: "BOVEN HET VENSTER: uitspatten", bareLobe: "onbekleed", narrower: "smaller",
      parts: { upper: ["Bovenelektrode", "koperen kap aan de servostang: knijpt de platen"], lower: ["Onderelektrode", "de vaste koperen kap, kapvlak Ø6 mm"], sheets: ["Platen", "twee verzinkte stalen platen van 1,2 mm, overlappend"], nugget: ["Laslens", "het lensje gesmolten metaal tussen de platen"], cylinder: ["Servocilinder", "zet de elektrodekracht in kN"], column: ["Transformator", "maakt 8 tot 12 kA bij een paar volt"], display: ["Lasbesturing", "stroom, lastijd en kracht"], dresser: ["Kappenfrees", "een kleine frees die de kappen in vorm snijdt"], hose: ["Koelwater", "koelt de kappen van binnen"], clamp: ["Klem", "houdt de proefstrook op de slede"], carriage: ["Slede", "schuift de strook punt voor punt door"], arm: ["Onderarm", "voert de stroom naar de onderste kap"] } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".sp-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  marks: q("[data-marks]"), heat: q("[data-heat]"), sparks: q("[data-sparks]"), mark: q("[data-mark]"), view: q("[data-view]"), lobe: q("[data-lobe]"),
  lamp: q("[data-lamp]"), spit: q("[data-spit]"), amp: q("[data-amp]"), ms: q("[data-ms]"), kn: q("[data-kn]"), blade: q("[data-blade]"),
  gx: [...svg.querySelectorAll('[data-g="x"]')], gu: [...svg.querySelectorAll('[data-g="u"]')], gd: [...svg.querySelectorAll('[data-g="d"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .sp-line")];
const announcer = document.querySelector(".sp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

(() => {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = '<radialGradient id="sp-glow-grad"><stop offset="0" style="stop-color:var(--sp-core);stop-opacity:.95"/><stop offset=".3" style="stop-color:var(--sp-glow);stop-opacity:.65"/><stop offset="1" style="stop-color:var(--sp-glow);stop-opacity:0"/></radialGradient>';
  svg.insertBefore(defs, svg.firstChild);
})();

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { i: L0.i, t: L0.t, f: L0.f, sel: "i", stepper: true, blunt: false, mis: false, peel: false, stack: "galv" };
const wear = { count: 0, dia: 6, dressings: 0 };
const iNow = () => (LVL === 2 && st.stepper ? st.i * (wear.dia / 6) ** 2 : st.i);
const tipNow = () => (LVL === 2 ? wear.dia : 6);
const jNow = () => (iNow() * 1000) / areaOf(tipNow());
function weldNow() {
  // the weld this setting makes: nugget d, expulsion, and (level 3) the button
  if (LVL === 4) {
    const spit = st.i * Math.pow(st.t / 300, 0.25) > LOBE[st.stack].hi + 1e-9;
    const d = lobeNugOf(st.stack, st.i, st.t) * (spit ? 0.9 : 1);
    return { d, spit, min: 4, t: 1.0 };
  }
  const spit = spitOf(jNow(), st.t, st.f, tipNow());
  let d = nugOf(jNow(), st.t, st.f) * (spit ? 0.9 : 1);
  if (LVL === 3 && st.mis) d *= 0.85;
  return { d, spit, min: minOf(SHEET), t: SHEET, mis: LVL === 3 && st.mis };
}

// the cycle: index → squeeze → weld → hold → open, five times; then clear,
// dress when the counter says so, load a fresh coupon
const cyc = { phase: "index", t: 0, k: 0, x: 0, xFrom: 0, u: 1, d: 0, on: 0, grow: 0, fade: 0, spin: 0, peel: 0 };
let marks = [];
let lastWeld = null;
let flick = 0.5, sparkClock = 0;
const sparks = [];
const offOf = (k) => -WELDS[k]; // the carriage offset that puts weld k under the tips
const weldS = () => 0.55 * st.t / 300;

let lastMarks = "";
function place() {
  const xs = cyc.x - X_REC;
  const tx = translateAlong(P, [xs, 0, 0]);
  el.gx.forEach((n) => n.setAttribute("transform", tx));
  const du = cyc.u * STROKE;
  const [ux, uy] = axisVector(P, [0, 0, du]);
  const tu = translateAlong(P, [0, 0, du]);
  el.gu.forEach((n) => { if (du) n.setAttribute("transform", tu); else n.removeAttribute("transform"); holdStill(n, [ux, uy]); });
  const td = translateAlong(P, [0, cyc.d * DRESS_IN, 0]);
  el.gd.forEach((n) => (cyc.d ? n.setAttribute("transform", td) : n.removeAttribute("transform")));
}
function drawMarks() {
  const key = marks.map((m) => m.x + ":" + m.dia.toFixed(1) + (m.spit ? "s" : "")).join("|") + "|" + cyc.fade.toFixed(2);
  if (key === lastMarks) return;
  lastMarks = key;
  el.marks.innerHTML = marksSvg(K, P, marks, cyc.fade);
}
function drawHeat() {
  el.heat.innerHTML = heatSvg(K, P, cyc.on * (0.85 + 0.15 * flick), clamp(jNow() / 400, 0.3, 1.2));
}
function drawSparks() {
  let html = "";
  for (const s of sparks) {
    const [x, y] = iso(s.p, P);
    const [x0, y0] = iso(s.q, P);
    html += '<path class="sp-spark-line" style="opacity:' + s.a.toFixed(2) + '" d="M' + x0.toFixed(1) + " " + y0.toFixed(1) + "L" + x.toFixed(1) + " " + y.toFixed(1) + '"/>';
  }
  el.sparks.innerHTML = html;
}
function peelState() {
  const w = lastWeld || weldNow();
  const mode = w.d < 2.5 ? "none" : w.d < 0.9 * w.min ? "interfacial" : "button";
  return { mode, d: w.d };
}
function drawInset() {
  if (LVL === 4) {
    el.view.innerHTML = "";
    const w = weldNow();
    el.lobe.innerHTML = lobeSvg(INSET.w, INSET.h, st.stack, st.i, st.t, w.spit);
    return;
  }
  const w = weldNow();
  const peel = LVL === 3 && (cyc.peel > 0.5 || st.peel);
  const shown = peel ? (lastWeld || w) : w;
  const ps = peel ? peelState() : null;
  const s = {
    t: SHEET, tip: tipNow(), d: peel ? shown.d : shown.d * cyc.grow, full: shown.d, min: shown.min,
    gap: cyc.u * 8, spit: shown.spit && cyc.grow > 0.9, mis: LVL === 3 && st.mis, peel, mode: ps ? ps.mode : "", hot: cyc.on > 0.3,
  };
  el.view.innerHTML = sectionSvg(s);
}
let marked = -1;
function offsetOf(g) {
  if (g === "x") return [cyc.x - X_REC, 0, 0];
  if (g === "u") return [0, 0, cyc.u * STROKE];
  if (g === "d") return [0, cyc.d * DRESS_IN, 0];
  return [0, 0, 0];
}
function drawMark() {
  if (LVL !== 1 || marked < 0) { el.mark.innerHTML = ""; return; }
  const p = PARTS[marked];
  const o = offsetOf(p.g);
  const [x, y] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2] + o[2]], P);
  el.mark.innerHTML = '<circle class="sp-ring" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="sp-ring-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function verdict(w) {
  if (w.spit) return '<span class="sp-warn">' + T.spit + "</span>";
  if (w.d < 0.05) return '<span class="sp-warn">' + T.none + "</span>";
  return w.d >= w.min - 1e-9 ? '<span class="sp-strong">' + T.good + "</span>" : '<span class="sp-warn">' + T.small + "</span>";
}
function readout() {
  const out = [];
  const w = weldNow();
  const A = areaOf(tipNow());
  const nugLine = T.nugget + " " + '<span class="sp-acc">' + fmt(w.d, 1) + "</span> mm " + (w.d >= w.min - 1e-9 ? "≥" : "<") + " 4√" + fmt(w.t, 1) + " = " + fmt(w.min, 1) + " mm · " + verdict(w);
  if (LVL === 1) {
    out.push(T.galv + " " + T.stack12 + " · " + st.t + " ms · " + fmt(st.f, 1) + " kN · " + T.tip + " Ø6");
    out.push("I " + fmt(st.i, 1) + " kA / " + fmt(A, 1) + " mm² = " + Math.round(jNow()) + " A/mm² · " + T.heat + " ×" + fmt((st.i / 9.5) ** 2, 2));
    out.push(nugLine);
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="sp-acc">' + name + "</span> · " + what); }
    else out.push('<span class="sp-mute">' + T.tapPart + "</span>");
  } else if (LVL === 2) {
    out.push(T.counter + " " + wear.count + "/" + DRESS + " · " + T.dressing + " " + wear.dressings + "/" + CAP_DRESSINGS + " · " + T.tip + " Ø" + fmt(wear.dia, 2) + (st.blunt ? ' · <span class="sp-warn">' + T.blunt + "</span>" : ""));
    out.push(st.stepper ? T.stepper + " +" + Math.round(((wear.dia / 6) ** 2 - 1) * 100) + "%: " + fmt(st.i, 1) + " × (" + fmt(wear.dia, 2) + "/6)² = " + fmt(iNow(), 1) + " kA" : T.stepOff + ": " + fmt(st.i, 1) + " kA");
    out.push("J = " + grouped(iNow() * 1000) + " / " + fmt(A, 1) + " mm² = " + '<span class="sp-acc">' + Math.round(jNow()) + "</span> A/mm² · " + st.t + " ms · " + fmt(st.f, 1) + " kN");
    out.push(nugLine);
  } else if (LVL === 3) {
    out.push("I " + fmt(st.i, 1) + " kA · " + st.t + " ms · " + fmt(st.f, 1) + " kN · " + (st.mis ? '<span class="sp-warn">' + T.misaligned + "</span>" : T.aligned));
    out.push(nugLine);
    const lw = lastWeld || w, ps = peelState();
    if (ps.mode === "button") {
      const e = lw.mis ? 0.15 : 0.04, d1 = lw.d * (1 + e), d2 = lw.d * (1 - e);
      out.push(T.peel + " " + fmt(d1, 1) + " × " + fmt(d2, 1) + " → " + '<span class="sp-acc">' + fmt((d1 + d2) / 2, 1) + "</span> mm · " + ((d1 + d2) / 2 >= lw.min - 1e-9 ? '<span class="sp-strong">' + T.good + "</span>" : '<span class="sp-warn">' + T.reject + "</span>"));
    } else out.push('<span class="sp-warn">' + T.interfacial + "</span>");
    out.push(T.ut + ": " + (lw.d >= 2.5 ? T.utGood : '<span class="sp-warn">' + T.utStick + "</span>"));
  } else {
    const lo = loOf(st.stack, st.t), hi = hiOf(st.stack, st.t);
    const other = st.stack === "galv" ? "bare" : "galv";
    const lo2 = loOf(other, st.t), hi2 = hiOf(other, st.t);
    out.push(T.dp + " 1" + T.dec + "2 " + T.on + " 1" + T.dec + "0 mm · " + (st.stack === "galv" ? T.dpGalv : T.dpBare) + " · " + st.t + " ms · " + fmt(st.f, 1) + " kN");
    out.push(T.lobe + " " + fmt(lo, 1) + "–" + fmt(hi, 1) + " kA = " + '<span class="sp-acc">' + fmt(hi - lo, 1) + "</span> kA · " + (st.stack === "galv" ? T.dpBare : T.dpGalv) + " " + fmt(hi2 - lo2, 1) + " kA" + (st.stack === "galv" && hi2 - lo2 > hi - lo ? " (" + Math.round((1 - (hi - lo) / (hi2 - lo2)) * 100) + "% " + T.narrower + ")" : ""));
    if (st.i < lo - 1e-9) out.push("I " + fmt(st.i, 1) + " kA: " + '<span class="sp-warn">' + T.outLow + "</span>");
    else if (st.i > hi + 1e-9) out.push("I " + fmt(st.i, 1) + " kA: " + '<span class="sp-warn">' + T.outHigh + "</span>");
    else out.push("I " + fmt(st.i, 1) + " kA: " + fmt(st.i - lo, 1) + " " + T.above + " · " + fmt(hi - st.i, 1) + " " + T.below);
    out.push(nugLine);
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function drawPanel() {
  const a = fmt(iNow(), 1) + " kA", m = st.t + " ms", n = fmt(st.f, 1) + " kN";
  if (el.amp.textContent !== a) el.amp.textContent = a;
  if (el.ms.textContent !== m) el.ms.textContent = m;
  if (el.kn.textContent !== n) el.kn.textContent = n;
  if (cyc.on > 0.5) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  if (weldNow().spit) el.spit.setAttribute("data-on", ""); else el.spit.removeAttribute("data-on");
  if (el.blade) el.blade.setAttribute("transform", "rotate(" + (cyc.spin * 40).toFixed(1) + " " + iso([0, -40, 147], P).map((v) => v.toFixed(1)).join(" ") + ")");
}
function draw() {
  place();
  drawMarks();
  drawHeat();
  drawSparks();
  drawInset();
  drawMark();
  drawPanel();
  readout();
}

// ------------------------------------------------ the cycle
const DUR = { index: 0.45, squeeze: 0.28, hold: 0.25, open: 0.28, clear: 0.8, din: 0.6, dclose: 0.25, spin: 0.8, dopen: 0.25, dout: 0.6, load: 0.5, back: 0.6 };
function go2(phase) { cyc.phase = phase; cyc.t = 0; }
function stepCycle(dt) {
  cyc.t += dt;
  const p = cyc.phase;
  if (p === "index") {
    cyc.x = cyc.xFrom + (offOf(cyc.k) - cyc.xFrom) * smooth(0, DUR.index, cyc.t);
    if (cyc.t >= DUR.index) { cyc.x = offOf(cyc.k); go2("squeeze"); }
  } else if (p === "squeeze") {
    cyc.u = 1 - smooth(0, DUR.squeeze, cyc.t);
    if (cyc.t >= DUR.squeeze) { cyc.u = 0; cyc.grow = 0; go2("weld"); }
  } else if (p === "weld") {
    const ws = weldS();
    cyc.on = smooth(0, 0.06, cyc.t) * (1 - smooth(ws - 0.06, ws, cyc.t));
    cyc.grow = smooth(0, ws, cyc.t);
    const w = weldNow();
    if (w.spit && cyc.t > ws * 0.6) { sparkClock += dt; if (sparkClock > 0.03) { sparkClock = 0; spawnSpark(); } }
    if (cyc.t >= ws) {
      cyc.on = 0; cyc.grow = 1;
      lastWeld = w;
      marks.push({ x: WELDS[cyc.k], dia: tipNow(), spit: w.spit });
      if (LVL === 2) { wear.count += PER_WELD; wear.dia = Math.min(8.5, tipOf(countOf(wear.dia) + PER_WELD)); }
      else wear.count += PER_WELD;
      go2("hold");
    }
  } else if (p === "hold") {
    if (cyc.t >= DUR.hold) go2("open");
  } else if (p === "open") {
    cyc.u = smooth(0, DUR.open, cyc.t);
    if (cyc.t >= DUR.open) {
      cyc.u = 1;
      if (cyc.k < WELDS.length - 1) { cyc.k++; cyc.xFrom = cyc.x; go2("index"); }
      else { cyc.xFrom = cyc.x; go2("clear"); }
    }
  } else if (p === "clear") {
    cyc.x = cyc.xFrom + (X_CLEAR - cyc.xFrom) * smooth(0, DUR.clear, cyc.t);
    if (LVL === 3) cyc.peel = 1;
    if (cyc.t >= DUR.clear) { cyc.x = X_CLEAR; go2(wear.count >= DRESS ? "din" : "load"); }
  } else if (p === "din") {
    cyc.d = smooth(0, DUR.din, cyc.t);
    if (cyc.t >= DUR.din) { cyc.d = 1; go2("dclose"); }
  } else if (p === "dclose") {
    cyc.u = 1 - (1 - UD) * smooth(0, DUR.dclose, cyc.t);
    if (cyc.t >= DUR.dclose) go2("spin");
  } else if (p === "spin") {
    cyc.spin += dt * 30;
    if (cyc.t >= DUR.spin) {
      wear.count = 0; wear.dressings++;
      if (LVL === 2) wear.dia = st.blunt ? 6 + 0.7 * (wear.dia - 6) : 6;
      if (wear.dressings >= CAP_DRESSINGS) { wear.dressings = 0; wear.dia = 6; }
      go2("dopen");
    }
  } else if (p === "dopen") {
    cyc.u = UD + (1 - UD) * smooth(0, DUR.dopen, cyc.t);
    if (cyc.t >= DUR.dopen) { cyc.u = 1; go2("dout"); }
  } else if (p === "dout") {
    cyc.d = 1 - smooth(0, DUR.dout, cyc.t);
    if (cyc.t >= DUR.dout) { cyc.d = 0; go2("load"); }
  } else if (p === "load") {
    cyc.fade = smooth(0, DUR.load, cyc.t);
    if (cyc.t >= DUR.load) { cyc.fade = 0; marks = []; lastMarks = ""; cyc.k = 0; cyc.xFrom = cyc.x; onCoupon(); go2("back"); }
  } else if (p === "back") {
    cyc.x = cyc.xFrom + (offOf(0) - cyc.xFrom) * smooth(0, DUR.back, cyc.t);
    if (cyc.t >= DUR.back) { cyc.x = offOf(0); cyc.peel = 0; go2("squeeze"); }
  }
}
function spawnSpark() {
  if (sparks.length > 14) return;
  const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 50;
  sparks.push({ p0: [0, 0, SB + 1.2], p: [0, 0, SB + 1.2], q: [0, 0, SB + 1.2], age: 0, a: 0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vz: 20 + Math.random() * 40 });
}
function stepSparks(dt) {
  for (const s of sparks) {
    s.age += dt;
    const t = s.age, t0 = Math.max(0, t - 0.03);
    const pos = (tt) => [s.p0[0] + s.vx * tt, s.p0[1] + s.vy * tt, s.p0[2] + s.vz * tt - 200 * tt * tt];
    s.p = pos(t); s.q = pos(t0);
    s.a = smooth(0, 0.03, t) * (1 - smooth(0.2, 0.4, t));
  }
  for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].age > 0.4) sparks.splice(i, 1);
}
function stillPose() {
  sparks.length = 0;
  cyc.phase = "weld"; cyc.k = 2; cyc.x = offOf(2); cyc.u = 0; cyc.d = 0; cyc.on = 1; cyc.grow = 1; cyc.fade = 0; cyc.peel = LVL === 3 ? 1 : 0;
  const w = weldNow();
  lastWeld = w;
  marks = [0, 1].map((k) => ({ x: WELDS[k], dia: tipNow(), spit: w.spit }));
  if (LVL === 3) { cyc.u = 1; cyc.on = 0; }
  flick = 0.5;
}

// ------------------------------------------------ the idle tour
// Level 1: the lesson's 9.5 kA (5.5 mm), then 11 kA (expulsion), then 6.5 kA
// (too small). Level 2: 9.0 kA with the stepper and a sharp dresser, then a blunt
// blade for three dressings (the tip grows towards Ø7.5 and the stepper spits).
// Level 3: aligned, then offset tips, then offset at 8.5 kA (a reject), then
// 6 kA (interfacial fracture). Level 4: 8.7 kA in the galvanised lobe, then 9.2
// (expulsion), then 7.4 (too small), then the bare lobe at 8.7.
const TOURS = {
  1: [{ i: 9.5 }, { i: 11 }, { i: 6.5 }],
  2: [{ blunt: false }, { blunt: false }, { blunt: false }, { blunt: false }, { blunt: true }, { blunt: true }, { blunt: true }, { blunt: true }, { blunt: true }, { blunt: true }],
  3: [{ mis: false, i: 9.5 }, { mis: true, i: 9.5 }, { mis: true, i: 8.5 }, { mis: false, i: 6 }],
  4: [{ stack: "galv", i: 8.7 }, { stack: "galv", i: 9.4 }, { stack: "galv", i: 7.2 }, { stack: "bare", i: 8.7 }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0;
function onCoupon() {
  if (!touring) return;
  tourStep = (tourStep + 1) % TOURS[LVL].length;
  Object.assign(st, TOURS[LVL][tourStep]);
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
    stepSparks(dt);
    flick += (Math.random() - flick) * Math.min(1, dt * 18);
  }
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const go = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else go(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; go(); } }, 40000);
}

// ------------------------------------------------ controls
const LISTS = { i: LVL === 4 ? I4_LIST : I_LIST, t: T_LIST, f: F_LIST };
const pick = [...document.querySelectorAll("[data-pick]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const toggles = [...document.querySelectorAll("[data-toggle]")];
const stacks = [...document.querySelectorAll("[data-stack]")];
const rowB = document.querySelector('[data-row="b"]');
const keysOf = LVL === 1 ? ["i"] : LVL === 4 ? ["i", "t"] : ["i", "t", "f"];
pick.forEach((b) => (b.hidden = !keysOf.includes(b.dataset.pick)));
rowB.hidden = LVL === 1;
toggles.forEach((b) => (b.hidden = !(b.dataset.lv || "").split(",").includes(String(LVL))));
stacks.forEach((b) => (b.hidden = LVL !== 4));
function sync() {
  pick.forEach((b) => { b.setAttribute("aria-checked", String(b.dataset.pick === st.sel)); b.tabIndex = b.dataset.pick === st.sel ? 0 : -1; b.querySelector("b").textContent = b.dataset.pick === "t" ? String(st.t) : fmt(st[b.dataset.pick], 1); });
  toggles.forEach((b) => b.setAttribute("aria-pressed", String(!!st[b.dataset.toggle])));
  stacks.forEach((b) => { const on = b.dataset.stack === st.stack; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  const list = LISTS[st.sel];
  const i = list.indexOf(st[st.sel]);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i === 0 : i === list.length - 1));
  describe();
}
function describe() {
  const w = weldNow();
  let text = "I " + fmt(iNow(), 1) + " kA, " + st.t + " ms, " + fmt(st.f, 1) + " kN: " + T.nugget + " " + fmt(w.d, 1) + " mm, 4√t " + fmt(w.min, 1) + " mm" + (w.spit ? ", " + T.spit : "");
  if (LVL === 1 && marked >= 0) text += ", " + T.parts[PARTS[marked].key].join(": ");
  if (LVL === 2) text += ", " + T.tip + " Ø" + fmt(wear.dia, 2);
  if (LVL === 4) text += ", " + T.lobe + " " + fmt(loOf(st.stack, st.t), 1) + "–" + fmt(hiOf(st.stack, st.t), 1) + " kA";
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); sync(); announce(); kick(); }
function stepValue(dir) {
  const key = st.sel;
  const list = LISTS[key];
  let i = list.indexOf(st[key]);
  if (i < 0) i = 0;
  i = clamp(i + dir, 0, list.length - 1);
  st[key] = list[i];
  changed();
}
pick.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
toggles.forEach((b) => b.addEventListener("click", () => {
  const key = b.dataset.toggle;
  st[key] = !st[key];
  changed();
}));
stacks.forEach((b) => b.addEventListener("click", () => { st.stack = b.dataset.stack; changed(); }));
document.querySelector('[data-row="a"] [role="radiogroup"]').addEventListener("keydown", (event) => {
  const i = keysOf.indexOf(st.sel);
  let next = -1;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % keysOf.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + keysOf.length - 1) % keysOf.length;
  if (next < 0) return;
  event.preventDefault();
  st.sel = keysOf[next];
  changed();
  document.querySelector('[data-pick="' + st.sel + '"]').focus();
});

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => {
    const o = offsetOf(p.g);
    const [px, py] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2] + o[2]], P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL !== 1) return;
  marked = nearestPart(toView(event));
  steer(); sync(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL > 1 && event.key === "ArrowUp") stepValue(1);
  else if (LVL > 1 && event.key === "ArrowDown") stepValue(-1);
  else if (LVL > 1 && ["1", "2", "3"].includes(event.key) && keysOf[Number(event.key) - 1]) { st.sel = keysOf[Number(event.key) - 1]; changed(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) go();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { go2("index"); cyc.k = 0; cyc.xFrom = cyc.x; marks = []; go(); } });
if (still.matches) stillPose(); else { cyc.x = X_CLEAR; cyc.xFrom = X_CLEAR; cyc.k = 0; go2("index"); }
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Puntlassen: kappen, stroom en laslens",
    hint1: "Tik een onderdeel · kies de stroom met − of +",
    hint2: "Kies I, t of F, dan − of + · elk punt telt 20",
    hint3: "Kies I, t of F, dan − of + · peeltest na elke strook",
    hint4: "Kies I of t, dan − of + · kies de zinklaag",
    vals: "Lasinstelling",
    minus: "Lager",
    plus: "Hoger",
    stepper: "Stepper",
    blunt: "Frees bot",
    mis: "Kappen scheef",
    peel: "Peeltest",
    galv: "Verzinkt",
    bare: "Onbekleed",
    stacks: "Zinklaag",
    label: LABEL_NL,
    aria: "Puntlasmachine. Niveau 1: pijltjes kiezen een onderdeel. Vanaf niveau 2: toetsen 1 tot 3 kiezen stroom I, lastijd t of kracht F, pijl omhoog en omlaag veranderen de waarde.",
  },
  en: {
    title: "Spot welding: tips, current and nugget",
    hint1: "Tap a part · set the current with − or +",
    hint2: "Pick I, t or F, then − or + · each weld counts 20",
    hint3: "Pick I, t or F, then − or + · peel test after each coupon",
    hint4: "Pick I or t, then − or + · pick the coating",
    vals: "Weld setting",
    minus: "Lower",
    plus: "Higher",
    stepper: "Stepper",
    blunt: "Blunt dresser",
    mis: "Tips offset",
    peel: "Peel test",
    galv: "Galvanised",
    bare: "Bare",
    stacks: "Coating",
    label: LABEL_EN,
    aria: "Spot welder. Level 1: arrows pick a part. From level 2: keys 1 to 3 pick current I, weld time t or force F, up and down change the value.",
  },
};

const sN = STRINGS.nl;
const valBtn = (key, labelHtml) => `<button type="button" class="sp-btn" role="radio" data-pick="${key}" aria-checked="${key === "i"}" tabindex="${key === "i" ? 0 : -1}">${labelHtml}&nbsp;<b></b></button>`;
const tog = (key, lv, label) => `<button type="button" class="sp-btn" data-toggle="${key}" data-lv="${lv}" aria-pressed="false">${label}</button>`;
const controls = [
  `<div class="sp-controls">`,
  `<div class="sp-row" data-row="b">${tog("stepper", "2", sN.stepper)}${tog("blunt", "2", sN.blunt)}${tog("mis", "3", sN.mis)}${tog("peel", "3", sN.peel)}<div role="radiogroup" aria-label="${sN.stacks}" style="display:contents"><button type="button" class="sp-btn" role="radio" data-stack="galv" aria-checked="true">${sN.galv}</button><button type="button" class="sp-btn" role="radio" data-stack="bare" aria-checked="false" tabindex="-1">${sN.bare}</button></div></div>`,
  `<div class="sp-row" data-row="a"><div role="radiogroup" aria-label="${sN.vals}" style="display:flex;gap:4px;flex:1 1 auto">${valBtn("i", "<i>I</i>")}${valBtn("t", "<i>t</i>")}${valBtn("f", "<i>F</i>")}</div><button type="button" class="sp-btn" data-step="-" aria-label="${sN.minus}">−</button><button type="button" class="sp-btn" data-step="+" aria-label="${sN.plus}">+</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="sp-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="sp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="sp-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv]||s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var set=function(sel,txt){var n=document.querySelector(sel);if(n)n.textContent=txt;};
set('[data-toggle="stepper"]',s.stepper);set('[data-toggle="blunt"]',s.blunt);set('[data-toggle="mis"]',s.mis);set('[data-toggle="peel"]',s.peel);set('[data-stack="galv"]',s.galv);set('[data-stack="bare"]',s.bare);
document.querySelector('[data-row="a"] [role="radiogroup"]').setAttribute("aria-label",s.vals);
document.querySelector('[data-row="b"] [role="radiogroup"]').setAttribute("aria-label",s.stacks);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".sp-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: J ${(9500 / areaOf(6)).toFixed(1)} d ${nugOf(9500 / areaOf(6), 300, 3).toFixed(2)} · worn J ${(9500 / areaOf(7.5)).toFixed(1)} d ${nugOf(9500 / areaOf(7.5), 300, 3).toFixed(2)} · min ${minOf(1.2).toFixed(2)} · L4 d ${lobeNugOf("galv", 8.7, 300).toFixed(2)}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)} · inset ${INSET.w}×${INSET.h}`);

A.auditOrExit(R, P, { frames: STATES, apart: false, cover: ["heat", "x.marks"] });

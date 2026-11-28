// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Bolted joints: torque and preload" (module Joining, eng.joining.bolting).
//
//   node figures/eng.joining.bolt/build.mjs            build the page
//   node figures/eng.joining.bolt/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.bolt.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults: prefers-color-scheme,
// Dutch).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, writeFileSync } from "node:fs";
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
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.bolt.html");

// ---------------------------------------------------------------- the model
// One M10 bolt, strength grade 8.8, as in the lesson. The short-form torque
// equation gives the preload from the tightening torque:
//   F = T / (K · d)         T in N·m, d = 0.010 m, F in N
// K, the nut factor, carries all the friction under the head and in the thread.
// Dry (as delivered, light oil film): K = 0.20, so 50 N·m gives 25 kN, the
// lesson's "about 25 kN from about 49 N·m". Oiled: K = 0.16, so the same torque
// gives 25 % more preload (the lesson: 25 to 30 % more or less).
// Torque tightening scatters the preload about ±25 % (the lesson's recall:
// 25 kN nominal, lowest 18.75 kN).
// The yield load of an M10 8.8 bolt: stress area 58.0 mm² × 640 MPa = 37.1 kN.
// The joint opens when the external load that pulls the flanges apart exceeds
// the preload of the bolt (the simple model: the load factor of a stiff joint
// is ignored). With scatter, the weakest bolt in the band, at the lowest
// preload, opens first; above the highest preload every bolt has opened.
const D = 0.010;
const K = { dry: 0.2, oil: 0.16 };
const SCATTER = 0.25;
const F_YIELD = 37.1; // kN
const TORQUES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
const T_START = 50;
const LOAD_MAX = 40; // kN, the top of the pulsing load
const GAUGE_MAX = 50; // kN, full scale
const preload = (T, f) => T / (K[f] * D) / 1000; // kN
if (Math.abs(preload(50, "dry") - 25) > 1e-9 || Math.abs(preload(50, "dry") * (1 - SCATTER) - 18.75) > 1e-9) throw new Error("model does not match the lesson");

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the pipe axis (fixed spool at −x,
// the pulled spool and the load cylinder at +x), +y toward the viewer. The top
// of the bench plate is z = 0. The flange joint is the plane x = 0.
const WIDTH = 600;
const ZC = 74; // axis height
const RF = 54; // flange radius
const TF = 15; // flange thickness
const BCR = 44; // bolt circle radius
const NB = 8; // bolts
const RP = 20; // pipe radius
const GAP_MAX = 14; // drawn gap at full load (exaggerated: a real joint opens by hundredths of a millimetre)
const GAP_PER_KN = 1.2;
const BENCH = { x: -132, y: -60, w: 384, d: 120, r: 3 };
const BENCH_Z = [-12, 0];
const FOOT_Z = -18;
const WRENCH_BOLT = 2; // the bolt at 112.5°: top, toward the viewer
const ANG = (i) => ((22.5 + 45 * i) * Math.PI) / 180;
const WRENCH_DIR = G.unit3([0, 0.95, 0.31]);
const WRENCH_LEN = 164;
const GRIP = WRENCH_LEN - 58; // where the grip starts
const LEFT_X = -114; // the fixed stanchion's back face
const R_PIPE = 52; // length of the pulled pipe
const BLIND_X = TF + 20 + R_PIPE; // the blind flange's inner face
const CYL_GLAND = BLIND_X + 74; // the gland face, inside the yoke window
const YOKE_X = CYL_GLAND - 18; // the yoke's inner face
const CYL_LEN = 72;
const GAUGE = { c: [CYL_GLAND + 40, 0, ZC + 66], r: 32 };

const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const boltAt = (i) => [0, BCR * Math.cos(ANG(i)), ZC + BCR * Math.sin(ANG(i))];
const WB = boltAt(WRENCH_BOLT);
const HEAD_C = [TF + 39, WB[1], WB[2]];
const wrenchTip = G.add3(HEAD_C, G.mul3(WRENCH_DIR, WRENCH_LEN + 6));

const FIT = [
  ...k.boxCorners(BENCH, FOOT_Z, 0),
  ...k.boxCorners({ x: LEFT_X, y: -42, w: 30, d: 84 }, 0, 124),
  ...k.boxCorners({ x: YOKE_X, y: -42, w: 26, d: 84 }, 0, 124),
  wrenchTip,
  G.add3(wrenchTip, [0, 0, 10]),
  [GAUGE.c[0], GAUGE.c[1], GAUGE.c[2] + GAUGE.r + 3],
];
const PAD = 10;
const AZIMUTH = Number(process.env.AZ ?? 46);
const ELEVATION = Number(process.env.EL ?? 26);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const fix = (v) => Number(v.toFixed(3));

// ---------------------------------------------------------------- recorder
// One moving piece: everything that rides on the pulled spool ("open") moves
// +x by the gap. The audit checks it closed and fully open.
const R = A.recorder(P, { order: ["open"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", piece = "", still = false } = {}) {
  const move = piece === "open" ? [GAP_MAX, 0, 0] : [0, 0, 0];
  return R.put({ name, at: ref, bias, svg, shapes, piece, move, attrs: attrs + (piece === "open" && !still ? ' data-open=""' : "") });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
function prismAt(name, F, polygon, s0, s1, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.prism(F, polygon, s0, s1, { name, owner }));
  const svg = S(G.prismOf(F, polygon, s0, s1, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
const square = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]];

// ---------------------------------------------------------------- bench
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BENCH, -3), FOOT_Z, 2, P)}"/>`];
{
  for (const [x, y] of k.corners(BENCH, 14)) {
    const foot = { x: x - 9, y: y - 9, w: 18, d: 18, r: 2 };
    box("stand.foot", foot, FOOT_Z, BENCH_Z[0], { tone: "lo" }, { steps: 3, bevel: 0.4 });
  }
  const screws = k.corners(BENCH, 7);
  // T-slots along the bench, ending on the stanchion footprints
  const slots = [-30, 30].map((y) => k.planOutline({ x: LEFT_X + 36, y: y - 3, w: YOKE_X - 24 - LEFT_X - 36, d: 6, r: 3 }, 0, P, 4)).join("");
  const label = { x0: -60, x1: -14, z0: -9.5, z1: -2.5 };
  const front = BENCH.y + BENCH.d;
  const extra =
    L(k.planOutline(k.insetPlan(BENCH, 4), 0, P, 3), { tone: "faint" }) +
    L(slots, { tone: "lo" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }) +
    `<g transform="${planeOf(front)}"><path class="bj-card" d="${flatRect(label.x0, label.z0, label.x1, label.z1, 0.8, 3)}"/>` +
    `<path class="iso-line" data-tone="lo" data-free="" d="M${label.x0 + 4} -7.2H${label.x1 - 6}M${label.x0 + 4} -4.8H${label.x0 + 24}"/></g>` +
    Dt([[label.x0 + 1.8, front, -6], [label.x1 - 1.8, front, -6]].map(at), { size: 0.4 });
  box("stand.bench", BENCH, BENCH_Z[0], BENCH_Z[1], { tone: "lo" }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(BENCH, -4, P, 3), { tone: "faint" }), extra, ground: true });
}

// ---------------------------------------------------------------- the fixed stanchion (−x) and the yoke (+x)
function foot(name, x0, w) {
  const holes = [[x0 - 4, -40], [x0 + w + 4, -40], [x0 - 4, 40], [x0 + w + 4, 40]];
  box(name, { x: x0 - 8, y: -46, w: w + 16, d: 92, r: 1.4 }, 0, 6, { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    extra: L(holes.map(([x, y]) => k.ring(x, y, 2, 6, P, 12)).join(""), { tone: "lo" }) + Dt(holes.map(([x, y]) => at([x, y, 6])), { size: 0.5 }),
  });
}
{
  const x0 = LEFT_X;
  const plate = { x: x0, y: -42, w: 26, d: 84, r: 1.2 };
  foot("stand.left.foot", x0, 26);
  box("stand.left.plate", plate, 6, 124, { tone: "mid" }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(plate, 112, P, 2), { tone: "faint" }), extra: Dt([[x0 + 13, -36], [x0 + 13, 36]].map(([x, y]) => at([x, y, 124])), { size: 0.45 }) });
  for (const y of [-30, 30]) box("stand.left.rib", { x: x0 + 26, y: y - 3, w: 18, d: 6, r: 0.6 }, 6, 44, { tone: "mid" }, { steps: 2, bevel: 0.2 });
}
{
  // the yoke: two posts and a top beam, the pull rod passes through the window
  const x0 = YOKE_X;
  foot("stand.right.foot", x0, 24);
  for (const y of [-40, 26]) {
    const post = { x: x0, y, w: 24, d: 14, r: 1 };
    box("stand.right.post", post, 6, 108, { tone: "mid" }, { steps: 2, bevel: 0.4 });
  }
  const beam = { x: x0, y: -40, w: 24, d: 80, r: 1.2 };
  box("stand.right.beam", beam, 108, 124, { tone: "mid" }, { steps: 2, bevel: 0.5, extra: Dt([[x0 + 12, -33], [x0 + 12, 33]].map(([x, y]) => at([x, y, 124])), { size: 0.45 }) });
  for (const y of [-34, 34]) box("stand.right.rib", { x: x0 - 16, y: y - 3, w: 16, d: 6, r: 0.6 }, 6, 40, { tone: "mid" }, { steps: 2, bevel: 0.2 });
}

// ---------------------------------------------------------------- the fixed spool (−x)
{
  const F = frameX([LEFT_X + 26, 0, ZC]);
  const len = -36 - (LEFT_X + 26);
  discAt("spool.l.flange-w", F, 0, 6, 34, { tone: "mid" }, { extra: Dt(G.dotsOf(F, 6, 28, 8, P, { fade: [0.05, 0.4], all: true }), { size: 0.45 }) });
  discAt("spool.l.pipe", F, 6, len, RP, { tone: "mid" }, { inner: L(G.arcOf(F, len / 2 + 3, RP, P), { tone: "faint" }) });
  turned("spool.l.hub", frameX([-36, 0, ZC]), [[0, RP], [20, 29]], { tone: "mid" }, {});
  // the fixed flange carries the bolt shanks across the joint face: drawn full
  // length right after the flange, covered by the pulled flange while closed and
  // seen in the gap when it opens. Recorded as stubs on the flange face (the
  // drawn length lies inside the pulled flange at rest).
  const order = [...Array(NB).keys()].sort((a, b) => k.depthOf(boltAt(a), P) - k.depthOf(boltAt(b), P));
  const shanks = order.map((i) => S(G.disc(0, GAP_MAX, 5, frameX([0, boltAt(i)[1], boltAt(i)[2]]), P), { tone: "hi", crease: "none", lit: true })).join("");
  const FL = frameX([-TF, 0, ZC]);
  const flange = R.solid(A.disc(FL, 0, TF, RF, { name: "joint.l.flange" }));
  const stubs = order.map((i) => R.solid(A.disc(frameX([0, boltAt(i)[1], boltAt(i)[2]]), 0, 0.05, 5, { name: "bolt.shank" })));
  put("joint.l.flange", [-TF / 2, 0, ZC], S(G.disc(0, TF, RF, FL, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(FL, TF / 2, RF, P), { tone: "faint" }) }) + `<g data-shanks="">${shanks}</g>`, [flange, ...stubs]);
}
// bolt heads and washers on the back face of the fixed flange
for (let i = 0; i < NB; i++) {
  const [, y, z] = boltAt(i);
  const F = frameX([-TF, y, z]);
  discAt("bolt.washer-b", F, -2, 0, 9.6, { tone: "mid" }, { owner: `bolt${i}` });
  discAt("bolt.head", F, -9, -2, 9.2, { tone: "mid" }, { owner: `bolt${i}`, steps: 6 });
}
// ---------------------------------------------------------------- the pulled spool (+x), it rides the gap
const O = { piece: "open" };
{
  const FF = frameX([0, 0, ZC]);
  discAt("joint.r.flange", FF, 0, TF, RF, { tone: "hi", crease: "lo" }, { ...O, owner: "joint.r", inner: L(G.arcOf(FF, TF / 2, RF, P), { tone: "faint" }) });
  turned("spool.r.hub", frameX([TF, 0, ZC]), [[0, 29], [20, RP]], { tone: "mid" }, O);
  discAt("spool.r.pipe", frameX([TF + 20, 0, ZC]), 0, R_PIPE, RP, { tone: "mid" }, { ...O, inner: L(G.arcOf(frameX([TF + 20, 0, ZC]), R_PIPE / 2, RP, P), { tone: "faint" }) });
  const FC = frameX([BLIND_X, 0, ZC]);
  discAt("spool.r.blind", FC, 0, 12, 38, { tone: "mid" }, { ...O, extra: Dt(G.dotsOf(FC, 12, 31, 8, P, { fade: [0.04, 0.4], all: true }), { size: 0.5, tone: "mid" }) });
  discAt("spool.r.boss", FC, 12, 20, 14, { tone: "mid" }, O);
  // the pull rod: a clevis rod, an in-line load cell, then the rod into the gland
  discAt("pull.rod-a", FC, 20, 32, 7, { tone: "hi", crease: "none" }, O);
  discAt("pull.cell", FC, 32, 50, 17, { tone: "mid" }, { ...O, inner: L(G.arcOf(FC, 41, 17, P), { tone: "faint" }) });
  const rodF = G.frameOf([CYL_GLAND, 0, ZC], [-1, 0, 0], Y, Zv);
  const r0 = BLIND_X + 50;
  put("pull.rod", [(CYL_GLAND + r0) / 2, 0, ZC], S(G.disc(50, CYL_GLAND - BLIND_X, 7, FC, P), { tone: "hi", crease: "none" }), [R.solid(A.slide(rodF, 0, CYL_GLAND - r0, 7, { name: "pull.rod" }))], O);
}
// nuts, washers and bolt ends on the pulled flange's front face
for (let i = 0; i < NB; i++) {
  const [, y, z] = boltAt(i);
  const F = frameX([TF, y, z]);
  discAt("bolt.washer", F, 0, 2, 9.6, { tone: "mid" }, { ...O, owner: `nut${i}` });
  if (i === WRENCH_BOLT) continue;
  discAt("bolt.nut", F, 2, 10.5, 9.2, { tone: "mid" }, { ...O, owner: `nut${i}`, steps: 6 });
  discAt("bolt.end", F, 10.5, 13, 5, { tone: "mid", crease: "none" }, { ...O, owner: `nut${i}`, extra: L(G.circleOf(F, 13, 3, P, 18), { tone: "faint" }) });
}

// ---------------------------------------------------------------- the roller support under the pulled pipe
{
  const x = TF + 20 + R_PIPE / 2;
  box("stand.roller.base", { x: x - 14, y: -26, w: 28, d: 52, r: 1 }, 0, 6, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: Dt([[x - 10, -22], [x + 10, -22], [x - 10, 22], [x + 10, 22]].map(([a, b]) => at([a, b, 6])), { size: 0.45 }) });
  box("stand.roller.post", { x: x - 7, y: -10, w: 14, d: 20, r: 0.8 }, 6, ZC - RP - 22, { tone: "mid" }, { steps: 2, bevel: 0.3 });
  for (const y of [-19, 15]) box("stand.roller.cheek", { x: x - 7, y, w: 14, d: 4, r: 0.5 }, ZC - RP - 18, ZC - RP - 1, { tone: "mid" }, { steps: 2, bevel: 0.2 });
  box("stand.roller.yoke", { x: x - 7, y: -19, w: 14, d: 38, r: 0.6 }, ZC - RP - 22, ZC - RP - 18, { tone: "mid" }, { steps: 2 });
  const FR = frameY([x, -15, ZC - RP - 8]);
  discAt("stand.roller", FR, 0, 30, 8, { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(FR, 15, 8, P), { tone: "faint" }) });
  discAt("stand.roller.pin", frameY([x, 19, ZC - RP - 8]), 0, 1.6, 3, { tone: "mid" }, { extra: Dt([at([x, 20.6, ZC - RP - 8])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- the load cylinder on the right stanchion
{
  const F = frameX([CYL_GLAND, 0, ZC]);
  const L0 = CYL_LEN;
  discAt("cyl.gland", F, 0, 6, 12, { tone: "mid" }, {});
  prismAt("cyl.head", F, square(28), 6, 16, { tone: "mid" }, {});
  discAt("cyl.barrel", F, 16, L0 - 10, 24, { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(F, 22, 24, P) + G.arcOf(F, L0 - 16, 24, P), { tone: "faint" }) });
  prismAt("cyl.cap", F, square(28), L0 - 10, L0, { tone: "mid" }, {});
  // four tie rods between the head and the cap, nuts on the cap
  for (const [u, v] of [[-22, -22], [22, -22], [-22, 22], [22, 22]]) {
    const FT = frameX([CYL_GLAND, u, ZC + v]);
    discAt("cyl.tie", FT, 16, L0 - 10, 2.4, { tone: "mid", crease: "none" }, {});
    discAt("cyl.tie-nut", FT, L0, L0 + 3, 4, { tone: "mid" }, { steps: 6, extra: Dt([at([CYL_GLAND + L0 + 3, u, ZC + v])], { size: 0.4, tone: "hi" }) });
  }
  // the hydraulic port on the cap end and the gauge on a stem on top of the barrel, its face turned to the viewer
  const [gx, , gz] = GAUGE.c;
  discAt("cyl.port", frameOf3([gx, 0, ZC + 23.5], Zv), 0, 3, 5, { tone: "mid" }, { steps: 6 });
  discAt("gauge.stem", frameOf3([gx, 0, ZC + 26.5], Zv), 0, gz - GAUGE.r - ZC - 26.5, 2.8, { tone: "mid", crease: "none" }, {});
}
function frameOf3(o, a) {
  return G.frameAlong(o, a);
}

// ---------------------------------------------------------------- the gauge: 0–50 kN, the preload band, the load needle
const [VX, VY] = k.towardViewer(P);
const GN = [VX, VY, 0];
let GE1 = [-VY, VX, 0];
if (at(G.add3(GAUGE.c, GE1))[0] < at(GAUGE.c)[0]) GE1 = G.mul3(GE1, -1);
const GE2 = Zv;
const GF = G.frameOf(GAUGE.c, GN, GE1, GE2);
const FACE_S = 4;
// a 2D matrix for the dial plane: local u right, local y down (−z)
function dialMatrix() {
  const o = G.add3(GAUGE.c, G.mul3(GN, FACE_S));
  const p0 = at(o);
  const p1 = at(G.add3(o, GE1));
  const p2 = at(G.add3(o, G.mul3(GE2, -1)));
  const m = [p1[0] - p0[0], p1[1] - p0[1], p2[0] - p0[0], p2[1] - p0[1], p0[0], p0[1]];
  return `matrix(${m.map((v) => fix(v)).join(" ")})`;
}
const SWEEP = (270 * Math.PI) / 180;
const A0 = (225 * Math.PI) / 180; // angle of 0 kN, measured from +u toward up
const angOf = (kn) => A0 - (SWEEP * kn) / GAUGE_MAX;
const dialPt = (kn, r) => [r * Math.cos(angOf(kn)), -r * Math.sin(angOf(kn))];
const RT = 17.2; // tick ring
function bandPath(f0, f1, r0, r1) {
  const a = Math.max(0, Math.min(GAUGE_MAX, f0));
  const b = Math.max(0, Math.min(GAUGE_MAX, f1));
  if (b - a < 0.01) return "";
  const n = Math.max(2, Math.ceil((b - a) / 0.8));
  const outer = [];
  const inner = [];
  for (let i = 0; i <= n; i++) {
    const kn = a + ((b - a) * i) / n;
    outer.push(dialPt(kn, r1));
    inner.push(dialPt(kn, r0));
  }
  const pts = [...outer, ...inner.reverse()];
  return "M" + pts.map(([x, y]) => x.toFixed(2) + " " + y.toFixed(2)).join("L") + "Z";
}
function needlePath(kn) {
  const [tx, ty] = dialPt(kn, RT - 1.2);
  const [bx, by] = dialPt(kn, -3.6);
  return "M" + bx.toFixed(2) + " " + by.toFixed(2) + "L" + tx.toFixed(2) + " " + ty.toFixed(2);
}
{
  const ticks = [];
  const majors = [];
  for (let kn = 0; kn <= GAUGE_MAX + 1e-9; kn += 2) {
    const major = kn % 10 === 0;
    const [ax, ay] = dialPt(kn, RT);
    const [bx, by] = dialPt(kn, RT - (major ? 3.4 : 1.8));
    (major ? majors : ticks).push(`M${ax.toFixed(2)} ${ay.toFixed(2)}L${bx.toFixed(2)} ${by.toFixed(2)}`);
  }
  // the tick ring itself: an arc over the sweep
  const ring = [];
  for (let i = 0; i <= 60; i++) ring.push(dialPt((GAUGE_MAX * i) / 60, RT));
  const ringD = "M" + ring.map(([x, y]) => x.toFixed(2) + " " + y.toFixed(2)).join("L");
  const [yx0, yy0] = dialPt(F_YIELD, RT + 0.4);
  const [yx1, yy1] = dialPt(F_YIELD - 0.9, RT + 2.6);
  const [yx2, yy2] = dialPt(F_YIELD + 0.9, RT + 2.6);
  const face = [
    `<g transform="${dialMatrix()}">`,
    `<circle class="bj-dial" cx="0" cy="0" r="${GAUGE.r - 2.6}"/>`,
    `<path class="bj-band" data-band="" d="${bandPath(preload(T_START, "dry") * (1 - SCATTER), preload(T_START, "dry") * (1 + SCATTER), RT - 5.6, RT - 0.3)}"/>`,
    `<path class="iso-line" data-tone="mid" data-nom="" d=""/>`,
    `<path class="iso-line" data-tone="lo" d="${ticks.join("")}"/>`,
    `<path class="iso-line" data-tone="hi" d="${majors.join("")}"/>`,
    `<path class="iso-line" data-tone="mid" d="${ringD}"/>`,
    `<path class="bj-yield" d="M${yx0.toFixed(2)} ${yy0.toFixed(2)}L${yx1.toFixed(2)} ${yy1.toFixed(2)}L${yx2.toFixed(2)} ${yy2.toFixed(2)}Z"/>`,
    `<text class="bj-unit" x="0" y="9.6" text-anchor="middle">kN</text>`,
    `<path class="bj-needle" data-needle="" data-free="end" d="${needlePath(0)}"/>`,
    `<circle class="bj-pivot" cx="0" cy="0" r="1.5"/>`,
    `<circle class="iso-line" data-tone="mid" cx="0" cy="0" r="${GAUGE.r - 2.6}" fill="none"/>`,
    `</g>`,
  ].join("");
  discAt("gauge.case", GF, -6, FACE_S - 1.2, GAUGE.r, { tone: "mid" }, {});
  discAt("gauge.bezel", GF, FACE_S - 1.2, FACE_S, GAUGE.r, { tone: "hi", crease: "lo" }, { extra: face });
}

// ---------------------------------------------------------------- the torque wrench on one nut (rides the gap)
{
  const [, y, z] = WB;
  const F = frameX([TF, y, z]);
  discAt("wrench.socket", F, 2, 24, 11, { tone: "mid" }, { ...O, owner: "wrench", inner: L(G.arcOf(F, 14, 11, P), { tone: "faint" }) });
  discAt("wrench.drive", F, 24, 31, 6.5, { tone: "mid" }, { ...O, owner: "wrench", steps: 4 });
  discAt("wrench.head", F, 31, 47, 14, { tone: "hi", crease: "lo" }, { ...O, owner: "wrench", extra: L(G.circleOf(F, 47, 6, P, 24), { tone: "lo" }) + Dt([at([TF + 47, y, z])], { size: 0.5, tone: "hi" }) });
  const FW = G.frameAlong(HEAD_C, WRENCH_DIR);
  turned("wrench.shaft", FW, [[14.05, 5.4], [GRIP - 4, 5.4]], { tone: "hi", crease: "lo" }, { ...O, owner: "wrench" });
  // the scale window on the shaft, its sliding index set by the torque
  discAt("wrench.collar", FW, GRIP - 4, GRIP, 7.4, { tone: "mid" }, { ...O, owner: "wrench" });
  const ribs = G.ribsOf(FW, GRIP + 4, WRENCH_LEN - 4, 9, 22, P, { fade: [0.04, 0.42], seams: true });
  turned("wrench.grip", FW, [[GRIP, 9], [WRENCH_LEN, 9]], { tone: "mid" }, { ...O, owner: "wrench", inner: k.fadedSvg(ribs, { tone: "lo" }) });
  turned("wrench.knob", FW, [[WRENCH_LEN, 8], [WRENCH_LEN + 6, 8]], { tone: "mid" }, { ...O, owner: "wrench" });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups];

const LABEL_NL =
  "Een trekbank op een werkbank met T-sleuven: links een vaste stander met een pijpstuk, in het midden een flensverbinding met acht M10-bouten, rechts een pijpstuk met een blindflens op een rolsteun, getrokken door een hydraulische cilinder op de rechter stander. Op één moer zit een momentsleutel. Op de cilinder staat een meter van 0 tot 50 kN: de gekleurde band is de spreiding van de voorspanning, de naald is de trekkracht. Komt de trekkracht boven de voorspanning, dan gaat de verbinding open en zie je de bouten in de spleet.";
const LABEL_EN =
  "A pull test on a bench with T-slots: on the left a fixed stanchion with a pipe spool, in the middle a flanged joint with eight M10 bolts, on the right a pipe spool with a blind flange on a roller support, pulled by a hydraulic cylinder on the right stanchion. A torque wrench sits on one nut. A gauge on the cylinder reads 0 to 50 kN: the coloured band is the preload scatter, the needle is the pulling load. When the load exceeds the preload, the joint opens and the bolts show in the gap.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --bj-hair:rgba(240,233,218,.12);--bj-accent:#5C9FAE;--bj-band:rgba(92,159,174,.55);--bj-dial:#0A1E23;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --bj-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --bj-hair:rgba(11,41,27,.14);--bj-accent:#276F81;--bj-band:rgba(39,111,129,.55);--bj-dial:#FBF8F1;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--bj-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 173px);min-height:240px;padding:26px 4px 143px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--bj-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--bj-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:73px!important;max-width:44%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:73px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.bj-line{display:block;white-space:nowrap}
.bj-acc{color:var(--bj-accent);font-weight:600}
.bj-strong{color:var(--anatomy-strong);font-weight:600}
.bj-mute{color:var(--anatomy-muted)}
.bj-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--bj-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bj-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:ew-resize;border-radius:8px}
.bj-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.bj-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.bj-controls{position:absolute;left:10px;right:10px;bottom:22px;height:44px;display:flex;align-items:center;gap:6px}
.bj-btn{min-width:44px;min-height:44px;height:44px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--bj-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--bj-hair);display:inline-flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}
.bj-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.bj-btn[disabled]{opacity:.4;cursor:default}
.bj-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--bj-accent);color:var(--bj-accent);font-weight:600}
.bj-btn svg{width:14px;height:14px;fill:currentColor}
.bj-torque{display:flex;gap:4px;align-items:center}
.bj-tval{min-width:46px;text-align:center;font:600 12px/1 var(--anatomy-mono);color:var(--anatomy-text)}
.bj-seg{display:flex;gap:4px;flex:1 1 auto;justify-content:flex-end}
.bj-seg .bj-btn{flex:1 1 0;max-width:76px}
.bj-play [data-icon="pause"]{display:none}
.bj-play[data-on] [data-icon="pause"]{display:block}
.bj-play[data-on] [data-icon="play"]{display:none}
.bj-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.bj-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.bj-dial{fill:var(--bj-dial);stroke:none}
.bj-band{fill:var(--bj-band);stroke:none}
.bj-yield{fill:var(--anatomy-hi);stroke:none}
.bj-unit{font-family:var(--anatomy-mono);font-size:3.6px;font-weight:600;fill:var(--anatomy-mid)}
.bj-needle{fill:none;stroke:var(--bj-accent);stroke-width:1.1px;stroke-linecap:round}
.bj-pivot{fill:var(--anatomy-hi);stroke:none}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const K = ${JSON.stringify(K)}, D = ${D}, SCATTER = ${SCATTER}, F_YIELD = ${F_YIELD};
const TORQUES = ${JSON.stringify(TORQUES)}, T_START = ${T_START}, LOAD_MAX = ${LOAD_MAX}, GAUGE_MAX = ${GAUGE_MAX};
const GAP_MAX = ${GAP_MAX}, GAP_PER_KN = ${GAP_PER_KN};
const SWEEP = ${SWEEP}, A0 = ${A0}, RT = ${RT};
const preload = ${preload.toString()};
const angOf = ${angOf.toString()};
const dialPt = ${dialPt.toString()};
${bandPath.toString()}
${needlePath.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { dry: "dry", oil: "oiled", load: "load", closed: "closed", opensLow: "weakest bolt opens", opens: "opens", yieldRisk: "may yield", dec: ".", nm: "Nm" }
  : { dry: "droog", oil: "geolied", load: "last", closed: "dicht", opensLow: "zwakste bout opent", opens: "opent", yieldRisk: "kan vloeien", dec: ",", nm: "Nm" };
const f1 = (v) => v.toFixed(1).replace(".", T.dec);
const f2 = (v) => v.toFixed(2).replace(".", T.dec);

const stage = document.querySelector(".bj-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { band: q("[data-band]"), nom: q("[data-nom]"), needle: q("[data-needle]"), open: [...svg.querySelectorAll("[data-open]")] };
const lines = [...document.querySelectorAll("[data-readout] .bj-line")];
const radios = [...document.querySelectorAll(".bj-seg .bj-btn")];
const minus = document.querySelector("[data-minus]");
const plus = document.querySelector("[data-plus]");
const tval = document.querySelector(".bj-tval");
const playBtn = document.querySelector(".bj-play");
const announcer = document.querySelector(".bj-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state
const set = { T: T_START, f: "dry", playing: !still.matches, load: 12, phase: 0.9 };
const shown = { band0: 0, band1: 0, needle: set.load, gap: 0 };
function target() {
  const nom = preload(set.T, set.f);
  return { nom, lo: nom * (1 - SCATTER), hi: nom * (1 + SCATTER) };
}
function stateOf(load, tg) {
  if (load < tg.lo) return "closed";
  if (load < tg.hi) return "low";
  return "open";
}
const gapOf = (load, lo) => clamp((load - lo) * GAP_PER_KN, 0, GAP_MAX);

function draw() {
  const tg = target();
  el.band.setAttribute("d", bandPath(shown.band0, shown.band1, RT - 5.6, RT - 0.3));
  const nomShown = (shown.band0 + shown.band1) / 2;
  const [ax, ay] = dialPt(nomShown, RT - 0.3), [bx, by] = dialPt(nomShown, RT - 5.6);
  el.nom.setAttribute("d", "M" + ax.toFixed(2) + " " + ay.toFixed(2) + "L" + bx.toFixed(2) + " " + by.toFixed(2));
  el.needle.setAttribute("d", needlePath(clamp(shown.needle, 0, GAUGE_MAX)));
  const tr = translateAlong(P, [shown.gap, 0, 0]);
  el.open.forEach((g) => g.setAttribute("transform", tr));
  readout(tg);
}
let lastState = "";
function readout(tg) {
  const st = stateOf(set.load, tg);
  const l1 = set.T + " " + T.nm + " · K " + f2(K[set.f]) + " " + (set.f === "dry" ? T.dry : T.oil);
  const l2 = "F " + f1(tg.lo) + "–" + f1(tg.hi) + " kN";
  const l3 = T.load + " " + f1(set.load) + " kN";
  let l4;
  if (st === "closed") l4 = '<span class="bj-acc">' + T.closed + "</span>" + (tg.hi > F_YIELD ? ' · <span class="bj-strong">' + T.yieldRisk + "</span>" : "");
  else if (st === "low") l4 = '<span class="bj-strong">' + T.opensLow + "</span>";
  else l4 = '<span class="bj-strong">' + T.opens + "</span>";
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  if (st !== lastState) { lastState = st; if (!set.playing) announcer.textContent = (st === "closed" ? T.closed : st === "low" ? T.opensLow : T.opens) + "."; }
}
function describe() {
  const tg = target();
  tval.textContent = set.T + " Nm";
  minus.disabled = set.T <= TORQUES[0];
  plus.disabled = set.T >= TORQUES[TORQUES.length - 1];
  radios.forEach((b) => { const on = b.dataset.f === set.f; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  if (set.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", set.playing ? playBtn.dataset.pause : playBtn.dataset.play);
  stage.setAttribute("aria-valuenow", set.load.toFixed(0));
  const st = stateOf(set.load, tg);
  stage.setAttribute("aria-valuetext", f1(set.load) + " kN, F " + f1(tg.lo) + "–" + f1(tg.hi) + " kN, " + (st === "closed" ? T.closed : st === "low" ? T.opensLow : T.opens));
}

// ------------------------------------------------ time
let frame = 0, last = 0, visible = false;
const PERIOD = 7; // s, one load cycle
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  const tg = target();
  if (set.playing && !calm) {
    set.phase = (set.phase + dt / PERIOD) % 1;
    set.load = LOAD_MAX * (0.5 - 0.5 * Math.cos(set.phase * 2 * Math.PI));
  }
  const ease = calm ? 1 : 1 - Math.exp(-dt / 0.18);
  shown.band0 += (tg.lo - shown.band0) * ease;
  shown.band1 += (tg.hi - shown.band1) * ease;
  shown.needle += (set.load - shown.needle) * (calm ? 1 : 1 - Math.exp(-dt / 0.08));
  shown.gap += (gapOf(set.load, tg.lo) - shown.gap) * (calm ? 1 : 1 - Math.exp(-dt / 0.1));
  draw();
  const settled = Math.abs(tg.lo - shown.band0) < 0.01 && Math.abs(tg.hi - shown.band1) < 0.01 && Math.abs(set.load - shown.needle) < 0.01 && Math.abs(gapOf(set.load, tg.lo) - shown.gap) < 0.005;
  frame = visible && !calm && (set.playing || !settled) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function setTorque(T) { set.T = clamp(T, TORQUES[0], TORQUES[TORQUES.length - 1]); describe(); kick(); }
function setFriction(f) { set.f = f; describe(); kick(); }
function setLoad(v) { set.playing = false; set.load = clamp(v, 0, GAUGE_MAX); describe(); kick(); }
function togglePlay() {
  if (set.playing) set.playing = false;
  else if (!still.matches) { set.playing = true; set.phase = Math.acos(clamp(1 - 2 * set.load / LOAD_MAX, -1, 1)) / (2 * Math.PI); }
  describe(); kick();
}

// ------------------------------------------------ controls
minus.addEventListener("click", () => setTorque(set.T - 5));
plus.addEventListener("click", () => setTorque(set.T + 5));
radios.forEach((b) => b.addEventListener("click", () => setFriction(b.dataset.f)));
document.querySelector(".bj-seg").addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  const next = set.f === "dry" ? "oil" : "dry";
  setFriction(next);
  radios.find((b) => b.dataset.f === next).focus();
});
playBtn.addEventListener("click", togglePlay);

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  press = { x0: toView(event)[0], start: set.load, dragging: false, id: event.pointerId };
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setLoad(press.start + dx / 8);
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") togglePlay();
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 5 : 1;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") setLoad(Math.round(set.load) + step);
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") setLoad(Math.round(set.load) - step);
  else if (event.key === "Home") setLoad(0);
  else if (event.key === "End") setLoad(LOAD_MAX);
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else if (event.key === "+" || event.key === "=") setTorque(set.T + 5);
  else if (event.key === "-") setTorque(set.T - 5);
  else if (event.key === "d") setFriction("dry");
  else if (event.key === "o") setFriction("oil");
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
{
  const tg = target();
  shown.band0 = tg.lo; shown.band1 = tg.hi; shown.needle = set.load; shown.gap = gapOf(set.load, tg.lo);
}
if (still.matches) { set.playing = false; set.load = 22; shown.needle = 22; shown.gap = gapOf(22, target().lo); }
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { set.playing = false; cancelAnimationFrame(frame); frame = 0; describe(); tick(performance.now()); }
  else { set.playing = true; describe(); run(); }
});
describe();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Boutverbinding: moment en voorspanning",
    hint: "Kies moment en wrijving",
    drag: "sleep: last · tik: pauze",
    model: "F = T / (K · d) · M10 8.8, d = 10 mm · spreiding ±25 % · vloeigrens 37 kN",
    play: "Last laten pulseren",
    pause: "Last stilzetten",
    minus: "Aanhaalmoment 5 Nm lager",
    plus: "Aanhaalmoment 5 Nm hoger",
    group: "Wrijving",
    dry: "droog",
    oil: "geolied",
    label: LABEL_NL,
    aria: "Trekkracht op de verbinding, 0 tot 50 kN. Pijltoetsen: 1 kN (Shift: 5), Home en End: 0 en 40 kN, spatie laat de last pulseren of zet hem stil, plus en min veranderen het aanhaalmoment, d en o kiezen droog of geolied.",
  },
  en: {
    title: "Bolted joint: torque and preload",
    hint: "Pick torque and friction",
    drag: "drag: load · tap: pause",
    model: "F = T / (K · d) · M10 8.8, d = 10 mm · scatter ±25 % · yield 37 kN",
    play: "Pulse the load",
    pause: "Hold the load",
    minus: "Torque 5 Nm lower",
    plus: "Torque 5 Nm higher",
    group: "Friction",
    dry: "dry",
    oil: "oiled",
    label: LABEL_EN,
    aria: "Pulling load on the joint, 0 to 50 kN. Arrow keys: 1 kN (Shift: 5), Home and End: 0 and 40 kN, Space pulses or holds the load, plus and minus change the torque, d and o choose dry or oiled.",
  },
};

const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const MINUS = `<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 6.2h9v1.6h-9z"/></svg>`;
const PLUS = `<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M6.2 2.5h1.6v3.7h3.7v1.6H7.8v3.7H6.2V7.8H2.5V6.2h3.7z"/></svg>`;
const controls = `<div class="bj-controls"><button type="button" class="bj-btn bj-play" data-on="" data-play="${STRINGS.nl.play}" data-pause="${STRINGS.nl.pause}" aria-label="${STRINGS.nl.pause}">${ICONS}</button><div class="bj-torque"><button type="button" class="bj-btn" data-minus="" aria-label="${STRINGS.nl.minus}">${MINUS}</button><span class="bj-tval" aria-hidden="true">${T_START} Nm</span><button type="button" class="bj-btn" data-plus="" aria-label="${STRINGS.nl.plus}">${PLUS}</button></div><div class="bj-seg" role="radiogroup" aria-label="${STRINGS.nl.group}"><button type="button" class="bj-btn" role="radio" data-f="dry" aria-checked="true" tabindex="0">${STRINGS.nl.dry}</button><button type="button" class="bj-btn" role="radio" data-f="oil" aria-checked="false" tabindex="-1">${STRINGS.nl.oil}</button></div></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="bj-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="0" aria-valuemax="${GAUGE_MAX}" aria-valuenow="12">${svg}</div>${controls}<div class="bj-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="bj-line"></span>'.repeat(4)}</span><span class="bj-model" data-model>${STRINGS.nl.model}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-drag>${STRINGS.nl.drag}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-drag]").textContent=s.drag;
document.querySelector("[data-model]").textContent=s.model;
var p=document.querySelector(".bj-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.pause);
document.querySelector("[data-minus]").setAttribute("aria-label",s.minus);document.querySelector("[data-plus]").setAttribute("aria-label",s.plus);
var g=document.querySelector(".bj-seg");g.setAttribute("aria-label",s.group);g.querySelector('[data-f="dry"]').textContent=s.dry;g.querySelector('[data-f="oil"]').textContent=s.oil;
var st=document.querySelector(".bj-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: 50 Nm dry ${preload(50, "dry").toFixed(2)} kN, oiled ${preload(50, "oil").toFixed(2)} kN`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: A.uniformStates(10), apart: true });

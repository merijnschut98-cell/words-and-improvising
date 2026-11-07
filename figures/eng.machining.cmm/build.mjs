// Dev tool, not shipped. Builds the standalone figure for the topic Opspanning
// en meten (module Verspanen), levels 3 and 4: the lessons eng.machining.metrology
// (level 3) and eng.machining.capable (level 4). Levels 1 and 2 of the topic
// use the fixture figure; this page still opens sensibly there.
//
//   node figures/eng.machining.cmm/build.mjs            build the page
//   node figures/eng.machining.cmm/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.cmm.html: one offline page
// with the anatomy kit, the kit's lathe module and the live script inlined. The
// page reads ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL
// (defaults: prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.cmm.html");

// ---------------------------------------------------------------- the model
// A bridge CMM probes a bore of Ø25 in a block (lessons metrology and capable).
// Resolution, the 10 % rule (lesson metrology): resolution ≤ band / 10.
// Gauge R&R (AIAG MSA): %GRR = 6 · σms / band; < 10 % good, 10–30 %
//   conditionally acceptable, > 30 % not acceptable.
//   Lesson: band 0.04, σms 0.0015 → 22.5 %; band 0.1 → 9 %; recall band 0.05,
//   σms 0.002 → 24 %.
// Capability (lesson capable): Cpk = (distance from the mean to the nearest
//   limit) / (3 · σ). Bore Ø25 ±0.015, σ 0.003: the mean on 25.000 in the
//   morning gives 1.67; heat and wear move it to 25.006 by midday: 1.00; with
//   in-machine probing the mean stays within 0.001 of nominal: 1.56. Series
//   customers ask 1.33. The figure steps the drift linearly through the day.
// The spindle probe that closes the loop needs its own gauge R&R; the figure
//   shows one at σms 0.0004 on the band 0.03 (8 %, good).
const grrOf = (sigma, band) => (6 * sigma) / band;
const cpkOf = (tol, shift, sigma) => (tol - Math.abs(shift)) / (3 * sigma);
const verdictOf = (g) => (g < 0.1 ? 0 : g <= 0.3 ? 1 : 2);
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(grrOf(0.0015, 0.04), 0.225, 1e-9, "lesson %GRR");
near(grrOf(0.0015, 0.1), 0.09, 1e-9, "lesson %GRR wide band");
near(grrOf(0.002, 0.05), 0.24, 1e-9, "recall %GRR");
near(0.04 / 10, 0.004, 1e-12, "10 % rule, band 0.04");
near(0.02 / 10, 0.002, 1e-12, "10 % rule, band 0.02");
near(cpkOf(0.015, 0, 0.003), 1.667, 0.001, "lesson Cpk morning");
near(cpkOf(0.015, 0.006, 0.003), 1.0, 1e-9, "lesson Cpk midday");
near(cpkOf(0.015, 0.001, 0.003), 1.556, 0.001, "lesson Cpk with in-machine probing");
near(cpkOf(0.02, 0, 0.004), 1.667, 0.001, "recall Cpk");
if (verdictOf(0.225) !== 1 || verdictOf(0.35) !== 2 || verdictOf(0.09) !== 0) throw new Error("MSA verdicts");

const BANDS = [0.02, 0.03, 0.04, 0.05, 0.1];
const SIGMAS = [0.0005, 0.001, 0.0015, 0.002, 0.003];
const TOOLS = [["caliper", 0.01], ["micrometer", 0.001], ["cmm", 0.0001]];
const HOURS = [7, 9, 11, 13];
const CAP = { tol: 0.015, sigma: 0.003, drift: 0.006, held: 0.001, series: 1.33, probeSigma: 0.0004, probeBand: 0.03 };
near(grrOf(CAP.probeSigma, CAP.probeBand), 0.08, 1e-9, "spindle probe %GRR");
const LEVELS = {
  1: { points: 4 },
  2: { band: 0.04, tool: 1 },
  3: { band: 0.04, sigma: 0.0015 },
  4: { hour: 13, imp: false },
};

// ---------------------------------------------------------------- the world
// World units are millimetres-ish, z up, x along the bridge, +y toward the
// operator. The granite top is z = 40; the bore axis stands at x = BX, y = BY.
const WIDTH = 600;
const FLOOR = -56;
const GT = 40;
const GRAN = { x: -160, y: -120, w: 320, d: 240, r: 3 };
const BX = 0;
const BY = 30;
const BORE_R = 12.5;
const BLK = { x: BX - 42, y: BY - 26, w: 84, d: 52, r: 1 };
const FIX_TOP = GT + 6;
const TOPB = FIX_TOP + 30;
const BALL_R = 3.2;
const BALL0 = TOPB + 30; // ruby ball centre at rest, above the bore
const DIVE = 34; // the ram's travel down: ball centre 4 below the bore's top
const ST_TOP = BALL0 + 18; // stylus top
const PB_TOP = ST_TOP + 16; // probe body top
const KN_C = PB_TOP + 5; // knuckle (probe head joint) centre
const HEAD0 = KN_C + 5;
const RAM0 = HEAD0 + 8;
const RAM1 = RAM0 + 150;
const RAM = { x: BX - 7, y: BY - 7, w: 14, d: 14, r: 0.6 };
const CAR = { x: BX - 22, y: BY - 29, w: 44, d: 22, r: 1.2 };
const CAR_Z = [190, 236];
const YB = BY - 41; // bridge beam centre line
const BEAM = { x: -164, y: YB - 12, w: 328, d: 24, r: 1.5 };
const BEAM_Z = [200, 224];
const RAIL_X = [-156, 142];
const RAIL_Z = [GT, GT + 10];
const PAD_Z = [RAIL_Z[1], RAIL_Z[1] + 4];
const LEG_Z = [PAD_Z[1], BEAM_Z[0]];
const FRAME = { x: -146, y: -106, w: 292, d: 212, r: 2 };
const FRAME_Z = [-14, -6];
const SPH = { x: -112, y: -82, r: 9 };
const JOY = { x: 82, y: 72, w: 46, d: 32, r: 2 };
const JOY_Z = [GT, GT + 12];

const FIT = [
  ...k.boxCorners(GRAN, FLOOR, GT),
  ...k.boxCorners(BEAM, BEAM_Z[0], BEAM_Z[1]),
  ...k.boxCorners({ x: 156, y: YB - 9, w: 12, d: 18 }, 150, 178),
  ...k.boxCorners(RAM, RAM1, RAM1 + 4),
];
const PAD = 6;
const MACHINE_W = 372;
const AZIMUTH = Number(process.env.AZ ?? 62);
const ELEVATION = Number(process.env.EL ?? 28);
const P0 = k.fitProjection(FIT, MACHINE_W, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0] + 2, P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA, cosA } = k.cameraOf(P);
const TOWARD = k.towardViewer(P);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P);
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: "", move: [0, 0, 0], attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const ga = (g) => (g ? ` data-g="${g}"` : "");
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", g = "", attrs = "", ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], { ...opts, attrs: ga(g) + attrs });
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", g = "", attrs = "", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], { ...opts, attrs: ga(g) + attrs });
}
function ball(name, c, r, style = {}, { extra = "", g = "", attrs = "", ...opts } = {}) {
  const shape = R.solid(A.ball(c, r, { name }));
  const svg = S(G.sphereOf(c, r, P), { tone: "mid", ...style }) + extra;
  return put(name, c, svg, [shape], { ...opts, attrs: ga(g) + attrs });
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", g = "", steps, attrs = "", ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], { ...opts, attrs: ga(g) + attrs });
}

// ---------------------------------------------------------------- stand and granite
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(FRAME, -8), FLOOR, 2, P)}"/>`;
for (const [x, y] of k.corners(FRAME, 8)) {
  post("stand.foot", x, y, 9, FLOOR, FLOOR + 6, { tone: "lo" }, { steps: 6 });
  box("leg", { x: x - 7, y: y - 7, w: 14, d: 14, r: 0.6 }, FLOOR + 6, FRAME_Z[0], { tone: "lo" }, { bevel: 0.3 });
}
box("frame", FRAME, FRAME_Z[0], FRAME_Z[1], { tone: "lo" }, { bevel: 0.4 });
for (const [x, y] of k.corners(FRAME, 30)) {
  post("mount", x, y, 8, FRAME_Z[1], 0, { tone: "mid" }, { steps: 20, inner: L(k.sideArc(x, y, 8, -3, P, 16), { tone: "faint" }) });
}
{
  // the granite plate: a ground top with threaded inserts in a grid, a
  // calibration plate on its front
  const inserts = [];
  for (let x = -120; x <= 120; x += 40) for (let y = -90; y <= 90; y += 40) {
    const inBlock = x > BLK.x - 14 && x < BLK.x + BLK.w + 14 && y > BLK.y - 16 && y < BLK.y + BLK.d + 16;
    const inJoy = x > JOY.x - 6 && x < JOY.x + JOY.w + 6 && y > JOY.y - 6 && y < JOY.y + JOY.d + 6;
    const inSph = Math.hypot(x - SPH.x, y - SPH.y) < 18;
    const underBridge = y > YB - 18 && y < YB + 18;
    if (!inBlock && !inJoy && !inSph && !underBridge) inserts.push([x, y]);
  }
  const fy = GRAN.y + GRAN.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="cm-card" d="${flatRect(-128, 12, -78, 28, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-122 -24H-90M-122 -20.5H-100M-122 -17H-94"/></g>`,
    Dt([[-126, fy, 26], [-80, fy, 26], [-126, fy, 14], [-80, fy, 14]].map(at), { size: 0.42 }),
  ].join("");
  const extra = L(inserts.map(([x, y]) => k.ring(x, y, 2.2, GT, P, 12)).join(""), { tone: "faint" }) + Dt(inserts.map(([x, y]) => at([x, y, GT])), { size: 0.4, tone: "lo" }) + plate;
  box("granite", GRAN, 0, GT, { tone: "lo" }, { steps: 3, bevel: 1, inner: L(k.sideSeam(GRAN, 4, P, 3), { tone: "faint" }), extra });
}
// Y guideways along both edges, with a scale on the right one
for (const x of RAIL_X) {
  const rail = { x, y: -116, w: 14, d: 232, r: 0.8 };
  let extra = "";
  if (x > 0) {
    const t = k.topTicks(-108, 108, 4, 5, x + 2, RAIL_Z[1], [1.6, 3.2], P, "y");
    extra = L(t.minor, { tone: "lo" }) + L(t.major, { tone: "mid" });
  }
  box("rail", rail, RAIL_Z[0], RAIL_Z[1], { tone: "mid", crease: "lo" }, { bevel: 0.4, extra });
  for (const y of [-116, 110]) box("rail.stop", { x: x + 2, y, w: 10, d: 6, r: 0.5 }, RAIL_Z[1], RAIL_Z[1] + 6, { tone: "mid" }, { bevel: 0.3, extra: Dt([at([x + 7, y + 3, RAIL_Z[1] + 6])], { size: 0.42, tone: "hi" }) });
}

// ---------------------------------------------------------------- the workpiece in its fixture
const FIX = { x: BX - 60, y: BY - 38, w: 120, d: 76, r: 1.5 };
{
  const holes = k.corners(FIX, 6);
  box("fixture", FIX, GT, FIX_TOP, { tone: "mid" }, { bevel: 0.5, extra: L(holes.map(([x, y]) => k.ring(x, y, 2, FIX_TOP, P, 12)).join(""), { tone: "lo" }) + Dt(holes.map(([x, y]) => at([x, y, FIX_TOP])), { size: 0.45, tone: "hi" }) });
  // locating pins on the back edge of the block
  for (const x of [BX - 26, BX + 26]) post("pin", x, BLK.y - 3, 3, FIX_TOP, FIX_TOP + 12, { tone: "hi", crease: "lo" }, { steps: 16 });
  // two strap clamps: riser, strap over the block's edge, nut and stud
  for (const s of [-1, 1]) {
    const rx = s < 0 ? BLK.x - 18 : BLK.x + BLK.w + 4;
    box("clamp.riser", { x: rx, y: BY - 8, w: 14, d: 16, r: 0.8 }, FIX_TOP, TOPB, { tone: "mid" }, { bevel: 0.3 });
    const sx0 = s < 0 ? BLK.x - 18 : BLK.x + BLK.w - 8;
    box("clamp.strap", { x: sx0, y: BY - 6, w: 26, d: 12, r: 1 }, TOPB, TOPB + 4, { tone: "mid", crease: "lo" }, { bevel: 0.3 });
    const nx = s < 0 ? BLK.x - 4 : BLK.x + BLK.w + 4;
    post("clamp.nut", nx, BY, 3.6, TOPB + 4, TOPB + 7.5, { tone: "mid" }, { steps: 6 });
    post("clamp.stud", nx, BY, 1.6, TOPB + 7.5, TOPB + 13, { tone: "hi", crease: "lo" }, { steps: 12, extra: Dt([at([nx, BY, TOPB + 13])], { size: 0.4, tone: "mid" }) });
  }
}
// the block with its bore, the back wall seen through the opening
function boreSvg() {
  const top = k.ring(BX, BY, BORE_R, TOPB, P, 48);
  const id = "cm-bore";
  const lower = [2.4, 7, 14].map((dz) => k.ring(BX, BY, BORE_R, TOPB - dz, P, 48)).join("");
  return [
    `<path class="cm-wall" d="${top}"/>`,
    `<clipPath id="${id}"><path d="${top}"/></clipPath>`,
    `<g clip-path="url(#${id})"><path class="cm-deep" d="${k.ring(BX, BY, BORE_R, TOPB - 22, P, 48)}"/>${L(lower, { tone: "faint" })}</g>`,
    L(top, { tone: "mid" }),
    L(k.ring(BX, BY, BORE_R + 1, TOPB, P, 48), { tone: "lo" }),
  ].join("");
}
const blockSeam = L(k.sideSeam(BLK, TOPB - 1.2, P, 2), { tone: "faint" });
const blockSvg = S(k.slabOf(BLK, FIX_TOP, TOPB - FIX_TOP, P, 2, 0.5), { tone: "hi", crease: "lo", inner: blockSeam }) + boreSvg();
const blockItem = put("block", [BX, BY, (FIX_TOP + TOPB) / 2], blockSvg, [
  // recorded as the block minus its bore: four slabs round the hole
  R.solid(A.box([BLK.x, BLK.y, FIX_TOP], [BX - BORE_R, BLK.y + BLK.d, TOPB], { name: "block" })),
  R.solid(A.box([BX + BORE_R, BLK.y, FIX_TOP], [BLK.x + BLK.w, BLK.y + BLK.d, TOPB], { name: "block" })),
  R.solid(A.box([BX - BORE_R, BLK.y, FIX_TOP], [BX + BORE_R, BY - BORE_R, TOPB], { name: "block" })),
  R.solid(A.box([BX - BORE_R, BY + BORE_R, FIX_TOP], [BX + BORE_R, BLK.y + BLK.d, TOPB], { name: "block" })),
]);

// ---------------------------------------------------------------- reference sphere, joystick, sensor
{
  post("sph.base", SPH.x, SPH.y, 10, GT, GT + 4, { tone: "mid" }, { steps: 24, bevel: 0.3 });
  post("sph.stem", SPH.x, SPH.y, 2.4, GT + 4, GT + 34, { tone: "mid", crease: "lo" }, { steps: 14 });
  ball("sph.ball", [SPH.x, SPH.y, GT + 34 + SPH.r], SPH.r, { tone: "hi" });
}
{
  box("joy.box", JOY, JOY_Z[0], JOY_Z[1], { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(JOY, JOY_Z[0] + 3, P, 2), { tone: "faint" }), extra: Dt(k.corners(JOY, 2.5).map(([x, y]) => at([x, y, JOY_Z[1]])), { size: 0.4 }) });
  const jx = JOY.x + 13, jy = JOY.y + 16;
  post("joy.boot", jx, jy, 5, JOY_Z[1], JOY_Z[1] + 2.5, { tone: "lo" }, { steps: 18 });
  post("joy.stick", jx, jy, 1.4, JOY_Z[1] + 2.5, JOY_Z[1] + 12, { tone: "mid", crease: "lo" }, { steps: 10 });
  ball("joy.knob", [jx, jy, JOY_Z[1] + 15.5], 3.5, { tone: "hi" });
  post("joy.btn", JOY.x + 30, JOY.y + 12, 2.6, JOY_Z[1], JOY_Z[1] + 1.4, { tone: "mid" }, { steps: 14 });
  post("joy.lamp", JOY.x + 38, JOY.y + 12, 2.6, JOY_Z[1], JOY_Z[1] + 1.4, { tone: "hi" }, { steps: 14, attrs: " data-lamp" });
  post("joy.btn", JOY.x + 34, JOY.y + 22, 3.4, JOY_Z[1], JOY_Z[1] + 1.6, { tone: "mid" }, { steps: 16, extra: L(k.ring(JOY.x + 34, JOY.y + 22, 1.8, JOY_Z[1] + 1.6, P, 12), { tone: "lo" }) });
}
post("sensor", -40, 84, 5, GT, GT + 4, { tone: "mid" }, { steps: 18, bevel: 0.3, extra: Dt([at([-40, 84, GT + 4])], { size: 0.55, tone: "hi" }) + L(k.ring(-40, 84, 2.6, GT + 4, P, 14), { tone: "lo" }) });

// ---------------------------------------------------------------- the bridge (Y)
{
  for (const x of RAIL_X) {
    box("y.pad", { x: x - 2, y: YB - 16, w: 18, d: 32, r: 1 }, PAD_Z[0], PAD_Z[1], { tone: "lo" }, { g: "y" });
    const leg = { x, y: YB - 13, w: 14, d: 26, r: 1 };
    box("y.leg", leg, LEG_Z[0], LEG_Z[1], { tone: "mid" }, { g: "y", bevel: 0.5, inner: L(k.sideSeam(leg, LEG_Z[0] + 10, P, 2) + k.sideSeam(leg, LEG_Z[1] - 10, P, 2), { tone: "faint" }) });
  }
  // the beam, with the X scale along its front
  const fy = BEAM.y + BEAM.d;
  const t = k.topTicks(BEAM.x + 14, BEAM.x + BEAM.w - 14, 5, 5, fy - 8, BEAM_Z[1] + 0.6, [1.6, 3.2], P, "x");
  box("y.beam", BEAM, BEAM_Z[0], BEAM_Z[1], { tone: "mid" }, { g: "y", bevel: 0.6, inner: L(k.sideSeam(BEAM, BEAM_Z[0] + 5, P, 2), { tone: "faint" }) });
  box("y.scale", { x: BEAM.x + 10, y: fy - 8, w: BEAM.w - 20, d: 6, r: 0.4 }, BEAM_Z[1], BEAM_Z[1] + 0.6, { tone: "lo", crease: "none" }, { g: "y", extra: L(t.minor, { tone: "lo" }) + L(t.major, { tone: "mid" }) });
  for (const x of [BEAM.x - 4, BEAM.x + BEAM.w]) box("y.cap", { x, y: BEAM.y + 2, w: 4, d: BEAM.d - 4, r: 0.6 }, BEAM_Z[0] + 2, BEAM_Z[1] - 2, { tone: "lo" }, { g: "y" });
  // the Y drive on the right leg
  const mot = { x: RAIL_X[1] + 14, y: YB - 9, w: 12, d: 18, r: 1.2 };
  box("y.motor", mot, 150, 176, { tone: "mid" }, { g: "y", bevel: 0.3, extra: Dt([at([mot.x + mot.w, YB - 5, 172]), at([mot.x + mot.w, YB + 5, 172]), at([mot.x + mot.w, YB - 5, 154]), at([mot.x + mot.w, YB + 5, 154])], { size: 0.4 }), inner: L(k.sideSeam(mot, 160, P, 2), { tone: "faint" }) });
}

// ---------------------------------------------------------------- the carriage (X) and the ram (Z)
{
  const fy = CAR.y + CAR.d;
  const screws = [[CAR.x + 4, CAR_Z[0] + 4], [CAR.x + CAR.w - 4, CAR_Z[0] + 4], [CAR.x + 4, CAR_Z[1] - 4], [CAR.x + CAR.w - 4, CAR_Z[1] - 4]];
  box("x.carriage", CAR, CAR_Z[0], CAR_Z[1], { tone: "mid" }, { g: "x", bevel: 0.6, inner: L(k.sideSeam(CAR, CAR_Z[1] - 8, P, 2), { tone: "faint" }), extra: Dt(screws.map(([x, z]) => at([x, fy, z])), { size: 0.42 }) });
  const cover = k.insetPlan(CAR, 3);
  box("x.cover", cover, CAR_Z[1], CAR_Z[1] + 3, { tone: "mid", crease: "lo" }, { g: "x", bevel: 0.3 });
  // gibs either side of the ram
  for (const x of [RAM.x - 4, RAM.x + RAM.w]) box("x.gib", { x, y: fy, w: 4, d: 10, r: 0.4 }, CAR_Z[0] + 4, CAR_Z[1] - 4, { tone: "lo" }, { g: "x", extra: Dt([at([x + 2, fy + 10, CAR_Z[0] + 10]), at([x + 2, fy + 10, CAR_Z[1] - 10])], { size: 0.38, tone: "mid" }) });
}
{
  const rt = L(k.sideSeam(RAM, RAM1 - 12, P, 2) + k.sideSeam(RAM, RAM0 + 10, P, 2), { tone: "faint" });
  box("z.ram", RAM, RAM0, RAM1, { tone: "mid" }, { g: "z", bevel: 0.4, inner: rt });
  box("z.ramcap", k.insetPlan(RAM, -1), RAM1, RAM1 + 4, { tone: "lo" }, { g: "z", bevel: 0.3 });
  const F = frameUp([BX, BY, 0]);
  discAt("z.head", F, HEAD0, RAM0, 7, { tone: "mid", crease: "lo" }, { g: "z", extra: L(G.arcOf(F, HEAD0 + 4, 7, P), { tone: "faint" }) });
}
ball("z.knuckle", [BX, BY, KN_C], 5, { tone: "mid" }, { g: "z" });
{
  const F = frameUp([BX, BY, 0]);
  discAt("z.probe", F, ST_TOP, PB_TOP, 3.5, { tone: "hi", crease: "lo" }, { g: "z", extra: L(G.arcOf(F, PB_TOP - 4, 3.5, P), { tone: "lo" }) });
  discAt("z.stylus", F, BALL0 + BALL_R, ST_TOP, 0.9, { tone: "mid", crease: "none" }, { g: "z", steps: 10 });
}
ball("z.ruby", [BX, BY, BALL0], BALL_R, { tone: "hi", lit: true }, { g: "z", attrs: " data-ruby" });

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
// The front half of the block's top round the bore is painted again after the
// probe: when the ball dives into the bore, the rim in front hides it, and the
// back wall shows it through the opening.
const lipClip = (() => {
  const ring = [];
  const a0 = Math.atan2(TOWARD[1], TOWARD[0]);
  for (let i = 0; i <= 24; i++) { const a = a0 - Math.PI / 2 + (Math.PI * i) / 24; ring.push(at([BX + Math.cos(a) * 24, BY + Math.sin(a) * 24, TOPB])); }
  for (let i = 24; i >= 0; i--) { const a = a0 - Math.PI / 2 + (Math.PI * i) / 24; ring.push(at([BX + Math.cos(a) * BORE_R, BY + Math.sin(a) * BORE_R, TOPB])); }
  return k.pathOf(ring, true);
})();
// The probe stack dives into the bore, so it is painted right after the block
// (it overlaps nothing else at rest, so the settled order allows it).
const PROBE = ["z.stylus", "z.ruby", "z.probe", "z.knuckle", "z.head"];
{
  const stack = PROBE.map((name) => R.items.find((item) => item.name === name));
  for (const item of stack) R.items.splice(R.items.indexOf(item), 1);
  R.items.splice(R.items.indexOf(blockItem) + 1, 0, ...stack);
  R.items.forEach((item, index) => { item.key = index; });
}
const lastZ = R.items.findIndex((item) => item.name === "z.head");
const groups = R.items.map((item, index) => {
  const g = `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`;
  if (index === lastZ) return g + `<clipPath id="cm-lip"><path d="${lipClip}"/></clipPath><g class="it" data-name="block.lip" clip-path="url(#cm-lip)">${blockSvg}</g>`;
  return g;
});

// the loupe sits to the right of the machine
const LOUPE = (() => {
  const r = Math.min(100, HEIGHT / 2 - 10);
  return { cx: WIDTH - r - 12, cy: HEIGHT / 2 - 4, r };
})();
const loupe = [
  `<g class="cm-loupe" data-loupe="" transform="translate(${LOUPE.cx.toFixed(1)} ${LOUPE.cy.toFixed(1)})">`,
  `<circle class="cm-lens" r="${LOUPE.r}"/>`,
  `<clipPath id="cm-lens-clip"><circle r="${LOUPE.r - 1}"/></clipPath>`,
  `<g clip-path="url(#cm-lens-clip)"><g data-view="" transform="scale(${(LOUPE.r / 46).toFixed(3)})"></g></g>`,
  `<circle class="cm-rim" r="${LOUPE.r}"/>`,
  `</g>`,
].join("");

const body = [halo, ...groups, `<g data-mark=""></g>`, loupe];

const LABEL_NL =
  "Een 3D-meetmachine van het brugtype: een granieten plaat op een onderstel, een brug die op luchtlagers over twee geleidingen in Y rijdt, een slede die in X over de brugbalk loopt en een pinole die in Z zakt. Onderaan de pinole zit een tastkop met een taststift met een robijnen kogel. Op de plaat staat een blok in een opspanning met een boring van Ø25 mm; de kogel duikt de boring in en tast de wand op een aantal punten af. Achter staat een referentiebol, voor een joystickkastje. Een vergrootglas toont de tolerantieband met de meetspreiding of de spreiding van het proces.";
const LABEL_EN =
  "A bridge-type coordinate measuring machine: a granite plate on a stand, a bridge riding on air bearings along two guideways in Y, a carriage running in X along the bridge beam and a ram that lowers in Z. At the bottom of the ram is a probe head with a stylus and a ruby ball. On the plate a block with a Ø25 mm bore sits in a fixture; the ball dives into the bore and touches the wall at several points. A reference sphere stands at the back, a joystick box at the front. A loupe shows the tolerance band with the measurement spread or the process spread.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "ruby", g: "z", at: [BX, BY, BALL0] },
  { key: "stylus", g: "z", at: [BX, BY, ST_TOP + 6] },
  { key: "head", g: "z", at: [BX, BY, KN_C] },
  { key: "ram", g: "z", at: [BX, BY + 7, RAM0 + 60] },
  { key: "carriage", g: "x", at: [BX, CAR.y + CAR.d, 214] },
  { key: "bridge", g: "y", at: [-90, BEAM.y + BEAM.d, 212] },
  { key: "bore", g: "", at: [BX, BY + BORE_R, TOPB] },
  { key: "fixture", g: "", at: [BX - 50, FIX.y + FIX.d, GT + 3] },
  { key: "granite", g: "", at: [60, GRAN.y + GRAN.d, 20] },
  { key: "sphere", g: "", at: [SPH.x, SPH.y, GT + 34 + SPH.r] },
  { key: "joystick", g: "", at: [JOY.x + 20, JOY.y + JOY.d, GT + 8] },
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
  --cm-hair:rgba(240,233,218,.12);--cm-accent:#5C9FAE;--cm-wall:#0A1E23;--cm-deep:#061417;--cm-mat:#16353D;--cm-band:#123039;--cm-fill:rgba(92,159,174,.28);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --cm-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --cm-hair:rgba(11,41,27,.14);--cm-accent:#276F81;--cm-wall:#DDD4BF;--cm-deep:#C9C0AA;--cm-mat:#EBE4D4;--cm-band:#FAF7EE;--cm-fill:rgba(39,111,129,.22);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--cm-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:130px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--cm-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="4"] .iso-plate{--bottom:178px}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--cm-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 14px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 32px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.iso-plate-corners{--rows:1}
html[data-level="4"] .iso-plate-corners{--rows:2}
.cm-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cm-acc{color:var(--cm-accent);font-weight:600}
.cm-strong{color:var(--anatomy-strong);font-weight:600}
.cm-mute{color:var(--anatomy-muted)}
.cm-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.cm-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.cm-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.cm-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.cm-row{display:flex;gap:4px;height:44px}
.cm-row[hidden],.cm-btn[hidden]{display:none}
.cm-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--cm-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--cm-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.cm-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.cm-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--cm-accent);color:var(--cm-accent);font-weight:600}
.cm-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.cm-btn:disabled{opacity:.4;cursor:default}
.cm-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.cm-btn sub{font-size:9px}
.cm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.cm-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.cm-wall{fill:var(--cm-wall);stroke:none}
.cm-deep{fill:var(--cm-deep);stroke:none}
.cm-lens{fill:var(--anatomy-card);stroke:none}
.cm-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.cm-mat{fill:var(--cm-mat);stroke:none}
.cm-band{fill:var(--cm-band);stroke:none}
.cm-fill{fill:var(--cm-fill);stroke:none}
.cm-ghost{fill:none;stroke:var(--anatomy-lo);stroke-width:.7px;stroke-dasharray:1.6 1.6}
.cm-curve{fill:none;stroke:var(--cm-accent);stroke-width:1.1px;stroke-linejoin:round}
.cm-ax{fill:none;stroke:var(--anatomy-mid);stroke-width:.8px}
.cm-lim{fill:none;stroke:var(--anatomy-hi);stroke-width:1px}
.cm-tk{fill:none;stroke:var(--anatomy-lo);stroke-width:.6px}
.cm-bar{fill:none;stroke:var(--cm-accent);stroke-width:3px;stroke-linecap:butt}
.cm-bar2{fill:none;stroke:var(--anatomy-mid);stroke-width:3px;stroke-linecap:butt}
.cm-dot{fill:var(--anatomy-hi);stroke:none}
.cm-adot{fill:var(--cm-accent);stroke:none}
.cm-ball{fill:var(--cm-accent);fill-opacity:.5;stroke:var(--cm-accent);stroke-width:.8px}
.cm-fit{fill:none;stroke:var(--cm-accent);stroke-width:1px}
.cm-mark{fill:none;stroke:var(--cm-accent);stroke-width:1.4px}
.cm-mark-dot{fill:var(--cm-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-ruby] .iso-top,[data-ruby] .iso-shade,[data-ruby] .iso-fill{transition:fill .15s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--cm-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const BX = ${BX}, BY = ${BY}, BORE_R = ${BORE_R}, BALL_R = ${BALL_R}, DIVE = ${DIVE};
const BANDS = ${JSON.stringify(BANDS)}, SIGMAS = ${JSON.stringify(SIGMAS)}, TOOLS = ${JSON.stringify(TOOLS)}, HOURS = ${JSON.stringify(HOURS)};
const CAP = ${JSON.stringify(CAP)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const grrOf = ${grrOf.toString()};
const cpkOf = ${cpkOf.toString()};
const verdictOf = ${verdictOf.toString()};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", points: "points", probe: "3D measuring machine · probes the bore Ø25 in", fitc: "fitted circle: diameter and position", tapPart: "tap a part to name it",
      tools: { caliper: "caliper", micrometer: "micrometer", cmm: "CMM" }, band: "band", res: "resolution", rule: "10 % rule: at most", ok: "fine enough", coarse: "too coarse",
      spread: "measurement system", verdict: ["good (< 10 %)", "conditional (10–30 %)", "not acceptable (> 30 %)"], resNeed: "resolution needed",
      mean: "mean", heat: "heat and wear", imp: "in-machine probing: mean within 0.001", series: "series ≥ 1.33", probeGrr: "spindle probe %GRR", good: "good",
      parts: { ruby: ["Ruby ball", "touches the wall; the trigger point is the measurement"], stylus: ["Stylus", "carries the ball, as stiff and light as possible"], head: ["Probe head", "the touch-trigger probe; it signals each contact"], ram: ["Ram", "moves the probe up and down: Z"], carriage: ["Carriage", "runs along the bridge: X"], bridge: ["Bridge", "rides on air bearings over the guideways: Y"], bore: ["Bore Ø25", "measured on several points: size, roundness, position"], fixture: ["Fixture", "holds the part the same way every time"], granite: ["Granite plate", "stable and flat; the base of every measurement"], sphere: ["Reference sphere", "calibrates the stylus before measuring"], joystick: ["Joystick", "moves the machine by hand to teach points"] } }
  : { dec: ",", points: "punten", probe: "3D-meetmachine · tast de boring Ø25 af in", fitc: "passende cirkel: diameter en positie", tapPart: "tik een onderdeel voor de naam",
      tools: { caliper: "schuifmaat", micrometer: "micrometer", cmm: "3D-meetmachine" }, band: "band", res: "resolutie", rule: "10 %-regel: hooguit", ok: "fijn genoeg", coarse: "te grof",
      spread: "meetsysteem", verdict: ["goed (< 10 %)", "voorwaardelijk (10–30 %)", "niet acceptabel (> 30 %)"], resNeed: "resolutie nodig",
      mean: "gemiddelde", heat: "warmte en slijtage", imp: "meten in de machine: gemiddelde binnen 0,001", series: "serie ≥ 1,33", probeGrr: "%GRR taster in de spil", good: "goed",
      parts: { ruby: ["Robijnen kogel", "raakt de wand; het schakelpunt is de meting"], stylus: ["Taststift", "draagt de kogel, zo stijf en licht mogelijk"], head: ["Tastkop", "schakelende taster; meldt elk contact"], ram: ["Pinole", "beweegt de taster op en neer: Z"], carriage: ["Slede", "loopt over de brug: X"], bridge: ["Brug", "rijdt op luchtlagers over de geleidingen: Y"], bore: ["Boring Ø25", "op meerdere punten gemeten: maat, rondheid, positie"], fixture: ["Opspanning", "houdt het stuk elke keer op dezelfde manier vast"], granite: ["Granieten plaat", "stabiel en vlak; de basis van elke meting"], sphere: ["Referentiebol", "kalibreert de taststift vóór het meten"], joystick: ["Joystick", "verplaatst de machine met de hand om punten te leren"] } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const mm = (v) => { const s = v < 0.001 ? 4 : v < 0.01 ? (Math.abs(v * 1000 - Math.round(v * 1000)) > 1e-9 ? 4 : 3) : v < 0.1 ? (Math.abs(v * 100 - Math.round(v * 100)) > 1e-9 ? 3 : 2) : 1; return fmt(v, s); };
const pct = (v) => fmt(v * 100, Math.abs(v * 100 - Math.round(v * 100)) > 0.04 ? 1 : 0) + " %";

const stage = document.querySelector(".cm-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  view: q("[data-view]"), mark: q("[data-mark]"), lamp: q("[data-lamp]"), ruby: q("[data-ruby]"),
  gx: [...svg.querySelectorAll('[data-g="x"]')], gy: [...svg.querySelectorAll('[data-g="y"]')], gz: [...svg.querySelectorAll('[data-g="z"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .cm-line")];
const announcer = document.querySelector(".cm-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { points: 4, band: 0.04, tool: 1, sigma: 0.0015, hour: 13, imp: false, sel: "band", ...L0 };
const pointsNow = () => (LVL === 1 ? st.points : 4);
const angleOf = (i) => Math.PI / 4 + (i / pointsNow()) * Math.PI * 2;
const shiftNow = () => { const raw = (CAP.drift * (st.hour - HOURS[0])) / (HOURS[HOURS.length - 1] - HOURS[0]); return st.imp ? Math.min(raw, CAP.held) : raw; };

// ------------------------------------------------ the probing cycle
// down → for each point: out to the wall, touch, back to the centre → up → wait
const DUR = { down: 0.7, out: 0.45, touch: 0.25, back: 0.35, up: 0.6, wait: 0.8 };
const cyc = { phase: "down", t: 0, i: 0, done: 0 };
let flash = 0;
function probePos() {
  const reach = BORE_R - BALL_R;
  let dz = 0, r = 0, a = angleOf(cyc.i);
  if (cyc.phase === "down") dz = -DIVE * smooth(0, DUR.down, cyc.t);
  else if (cyc.phase === "out") { dz = -DIVE; r = reach * smooth(0, DUR.out, cyc.t); }
  else if (cyc.phase === "touch") { dz = -DIVE; r = reach; }
  else if (cyc.phase === "back") { dz = -DIVE; r = reach * (1 - smooth(0, DUR.back, cyc.t)); }
  else if (cyc.phase === "up") dz = -DIVE * (1 - smooth(0, DUR.up, cyc.t));
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r, dz };
}
function stepCycle(dt) {
  cyc.t += dt;
  const end = DUR[cyc.phase];
  if (cyc.t < end) return;
  cyc.t = 0;
  if (cyc.phase === "down") cyc.phase = "out";
  else if (cyc.phase === "out") { cyc.phase = "touch"; cyc.done = cyc.i + 1; flash = 1; }
  else if (cyc.phase === "touch") cyc.phase = "back";
  else if (cyc.phase === "back") { cyc.i++; cyc.phase = cyc.i < pointsNow() ? "out" : "up"; }
  else if (cyc.phase === "up") cyc.phase = "wait";
  else { cyc.phase = "down"; cyc.i = 0; cyc.done = 0; onCycle(); }
}
function stillPose() { cyc.phase = "touch"; cyc.t = 0; cyc.i = 0; cyc.done = pointsNow(); flash = 0; }

// ------------------------------------------------ the loupe
const f2 = (v) => v.toFixed(2);
const PT = (pts) => "M" + pts.map(([u, v]) => f2(u) + " " + f2(v)).join("L");
const dot = (u, v, r, cls) => '<circle class="' + cls + '" cx="' + f2(u) + '" cy="' + f2(v) + '" r="' + r + '"/>';
const bell = (mu, s, h, base, lo, hi) => { const pts = []; for (let i = 0; i <= 64; i++) { const u = lo + ((hi - lo) * i) / 64; pts.push([u, base - h * Math.exp(-0.5 * ((u - mu) / s) ** 2)]); } return pts; };
function limits(base) {
  // tolerance limits LSL and USL at u = ±30, a nominal tick, and the baseline between the lens edges
  const rim = (v) => Math.sqrt(Math.max(0, 46 * 46 - v * v));
  return '<path class="cm-band" d="M-30 -24H30V' + base + 'H-30Z"/>' +
    '<path class="cm-ax" d="M' + f2(-rim(base)) + " " + base + "H" + f2(rim(base)) + '"/>' +
    '<path class="cm-lim" d="M-30 -24V' + base + "M30 -24V" + base + '"/>' + dot(-30, -24, 1.1, "cm-dot") + dot(30, -24, 1.1, "cm-dot") +
    '<path class="cm-tk" d="M0 ' + base + "v-3" + '"/>' + dot(0, base - 3, 0.6, "cm-dot");
}
function loupeSvg(pos) {
  const out = [];
  if (LVL === 1) {
    // top view of the bore: the block's top, the bore, the ball and the touch points
    const R = 30, k = R / BORE_R;
    out.push('<path class="cm-mat" d="M-60 -60H60V60H-60ZM' + R + ' 0A' + R + " " + R + " 0 1 0 " + -R + " 0A" + R + " " + R + " 0 1 0 " + R + ' 0Z" fill-rule="evenodd"/>');
    out.push('<circle class="cm-ax" r="' + R + '"/>');
    const lit = cyc.phase === "out" || cyc.phase === "touch" || cyc.phase === "back" || cyc.phase === "down";
    if (lit) out.push(dot(pos.dx * k, -pos.dy * k, f2(BALL_R * k), "cm-ball"));
    for (let i = 0; i < cyc.done; i++) { const a = angleOf(i); out.push(dot(Math.cos(a) * R, -Math.sin(a) * R, 1.6, "cm-adot")); }
    if (cyc.done >= pointsNow()) out.push('<circle class="cm-fit" r="' + (R - 0.01) + '"/>' + dot(0, 0, 1.2, "cm-adot"));
  } else if (LVL === 2) {
    // the band as a ruler: one tick per resolution step, the instrument's step
    // (accent) against the 10 % limit (grey) below
    const base = 16;
    out.push(limits(base));
    const res = TOOLS[st.tool][1], steps = st.band / res, gap = 60 / steps;
    if (gap >= 1.2) { const d = []; for (let i = 1; i < steps - 1e-6; i++) d.push("M" + f2(-30 + i * gap) + " " + base + "v-" + (i % 5 ? 6 : 10)); out.push('<path class="cm-tk" d="' + d.join("") + '"/>'); }
    else out.push('<path class="cm-fill" d="M-30 ' + (base - 8) + "H30V" + base + 'H-30Z"/>');
    const w10 = 6, wr = Math.min(60, gap);
    out.push('<path class="cm-ax" d="M-30 26H' + f2(-30 + Math.max(w10, wr) + 4) + '"/>');
    out.push('<path class="cm-bar2" d="M-30 30H' + f2(-30 + w10) + '"/>' + dot(-30 + w10, 30, 1.2, "cm-dot"));
    out.push('<path class="cm-bar" d="M-30 22H' + f2(-30 + Math.max(0.6, wr)) + '"/>' + dot(-30 + Math.max(0.6, wr), 22, 1.2, "cm-adot"));
    out.push('<path class="cm-lim" d="M-30 18V34"/>');
  } else if (LVL === 3) {
    // the measurement system's own spread inside the band; below, 6σ against the 10 % and 30 % marks
    const base = 14, s = (st.sigma / st.band) * 60;
    out.push(limits(base));
    const pts = bell(0, s, 30, base, -46, 46);
    out.push('<path class="cm-fill" d="' + PT(pts) + 'Z"/>', '<path class="cm-curve" d="' + PT(pts) + '"/>');
    const g = grrOf(st.sigma, st.band), w = Math.min(60, g * 60);
    out.push('<path class="cm-ax" d="M-30 26H30"/>' + dot(30, 26, 1.1, "cm-dot"));
    out.push('<path class="cm-tk" d="M-24 26v6M-12 26v6"/>' + dot(-24, 32, 0.8, "cm-dot") + dot(-12, 32, 0.8, "cm-dot"));
    out.push('<path class="cm-lim" d="M-30 20V34"/>');
    out.push('<path class="' + (verdictOf(g) === 2 ? "cm-bar2" : "cm-bar") + '" d="M-30 22.6H' + f2(-30 + w) + '"/>' + dot(-30 + w, 22.6, 1.2, verdictOf(g) === 2 ? "cm-dot" : "cm-adot"));
  } else {
    // the process spread in the band ±0.015 (1 µm = 2 units), morning ghost and now
    const base = 14, s = (CAP.sigma / CAP.tol) * 30, mu = (shiftNow() / CAP.tol) * 30;
    out.push(limits(base));
    out.push('<path class="cm-ghost" d="' + PT(bell(0, s, 28, base, -24, 24)) + '"/>');
    const pts = bell(mu, s, 28, base, -46, 46);
    out.push('<path class="cm-fill" d="' + PT(pts) + 'Z"/>', '<path class="cm-curve" d="' + PT(pts) + '"/>');
    out.push('<path class="cm-tk" d="M' + f2(mu) + " " + base + "V" + (base - 28) + '"/>' + dot(mu, base - 28, 1.1, "cm-adot"));
    // the Cpk distance: from the mean to the nearest limit, against 3σ
    out.push('<path class="cm-bar" d="M' + f2(mu) + " 24H30" + '"/>' + dot(mu, 24, 1.2, "cm-adot") + '<path class="cm-lim" d="M30 ' + base + 'V30"/>');
    out.push('<path class="cm-bar2" d="M' + f2(30 - 3 * s) + ' 29H30"/>' + dot(30 - 3 * s, 29, 1.2, "cm-dot"));
  }
  return out.join("");
}

// ------------------------------------------------ drawing
let marked = -1;
function place(pos) {
  const ay = translateAlong(P, [0, pos.dy, 0]);
  const ax = translateAlong(P, [pos.dx, pos.dy, 0]);
  const az = translateAlong(P, [pos.dx, pos.dy, pos.dz]);
  el.gy.forEach((n) => n.setAttribute("transform", ay));
  el.gx.forEach((n) => n.setAttribute("transform", ax));
  el.gz.forEach((n) => n.setAttribute("transform", az));
}
function drawMark(pos) {
  if (LVL !== 1 || marked < 0) { if (el.mark.innerHTML) el.mark.innerHTML = ""; return; }
  const p = PARTS[marked];
  const o = p.g === "y" ? [0, pos.dy, 0] : p.g === "x" ? [pos.dx, pos.dy, 0] : p.g === "z" ? [pos.dx, pos.dy, pos.dz] : [0, 0, 0];
  const [x, y] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2] + o[2]], P);
  el.mark.innerHTML = '<circle class="cm-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="cm-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function readout() {
  const out = [];
  if (LVL === 1) {
    out.push(T.probe + " " + pointsNow() + " " + T.points);
    out.push(T.fitc);
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="cm-acc">' + name + "</span> · " + what); }
    else out.push('<span class="cm-mute">' + T.tapPart + "</span>");
  } else if (LVL === 2) {
    const [key, res] = TOOLS[st.tool];
    out.push(T.band + " " + mm(st.band) + " mm · " + T.tools[key] + " " + mm(res) + " mm");
    out.push(T.res + " / " + T.band + " = " + mm(res) + " / " + mm(st.band) + ' = <span class="cm-acc">' + pct(res / st.band) + "</span>");
    out.push(T.rule + " " + mm(st.band / 10) + " mm → " + (res <= st.band / 10 + 1e-12 ? '<span class="cm-acc">' + T.ok + "</span>" : '<span class="cm-strong">' + T.coarse + "</span>"));
  } else if (LVL === 3) {
    const g = grrOf(st.sigma, st.band), v = verdictOf(g);
    out.push(T.band + " " + mm(st.band) + " mm · σ " + T.spread + " " + mm(st.sigma) + " mm");
    out.push("6 × " + mm(st.sigma) + " = " + mm(6 * st.sigma) + " mm");
    out.push("%GRR = " + mm(6 * st.sigma) + " / " + mm(st.band) + ' = <span class="cm-acc">' + pct(g) + "</span> · " + (v === 2 ? '<span class="cm-strong">' + T.verdict[v] + "</span>" : T.verdict[v]));
    out.push('<span class="cm-mute">' + T.resNeed + " ≤ " + mm(st.band / 10) + " mm (10 %)</span>");
  } else {
    const sh = shiftNow(), c = cpkOf(CAP.tol, sh, CAP.sigma), hh = String(st.hour).padStart(2, "0") + ":00";
    out.push("Ø25 ±" + mm(CAP.tol) + " · σ " + mm(CAP.sigma) + " · " + hh + " · " + T.mean + " " + fmt(25 + sh, 3));
    out.push("Cpk = " + mm(CAP.tol - sh) + " / (3 × " + mm(CAP.sigma) + ') = <span class="' + (c >= CAP.series ? "cm-acc" : "cm-strong") + '">' + fmt(c, 2) + "</span> · " + T.series);
    out.push(st.imp ? T.imp : T.heat + ": +" + mm(sh || 0.0001).replace(/^0[.,]0001$/, "0") + " mm");
    out.push('<span class="cm-mute">' + T.probeGrr + ": 6 × " + mm(CAP.probeSigma) + " / " + mm(CAP.probeBand) + " = " + pct(grrOf(CAP.probeSigma, CAP.probeBand)) + " · " + T.good + "</span>");
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
let lastView = "";
function draw() {
  const pos = probePos();
  place(pos);
  const view = loupeSvg(pos);
  if (view !== lastView) { el.view.innerHTML = view; lastView = view; }
  drawMark(pos);
  readout();
  if (flash > 0.02) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
}

// ------------------------------------------------ the idle tour
// Level 3: the lesson's micrometer (22.5 %), the recall (24 %), the same
// micrometer on a band of 0.1 (9 %), then σ 0.003 on 0.04 (45 %).
// Level 4: the day from 07:00 to 13:00, then with in-machine probing.
const TOURS = {
  1: [{ points: 4 }, { points: 8 }],
  2: [{ band: 0.04, tool: 1 }, { band: 0.04, tool: 0 }, { band: 0.1, tool: 0 }, { band: 0.02, tool: 2 }],
  3: [{ band: 0.04, sigma: 0.0015 }, { band: 0.05, sigma: 0.002 }, { band: 0.1, sigma: 0.0015 }, { band: 0.04, sigma: 0.003 }],
  4: [{ hour: 7, imp: false }, { hour: 9, imp: false }, { hour: 11, imp: false }, { hour: 13, imp: false }, { hour: 13, imp: true }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0;
function onCycle() {
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
  else { stepCycle(dt); flash *= Math.exp(-dt / 0.18); }
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else { draw(); run(); } };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; run(); } }, 40000);
}

// ------------------------------------------------ controls
const LISTS = { band: BANDS, sigma: SIGMAS, tool: [0, 1, 2] };
const pickRow = document.querySelector('[data-row="vals"]');
const pick = [...document.querySelectorAll("[data-pick]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const ptBtns = [...document.querySelectorAll("[data-pts]")];
const hourBtns = [...document.querySelectorAll("[data-hour]")];
const impBtns = [...document.querySelectorAll("[data-imp]")];
document.querySelector('[data-row="pts"]').hidden = LVL !== 1;
pickRow.hidden = LVL !== 2 && LVL !== 3;
document.querySelector('[data-row="hour"]').hidden = LVL !== 4;
document.querySelector('[data-row="imp"]').hidden = LVL !== 4;
const keys = LVL === 2 ? ["band", "tool"] : ["band", "sigma"];
pick.forEach((b) => { b.hidden = !keys.includes(b.dataset.pick); });
function valueText(key) {
  if (key === "band") return mm(st.band);
  if (key === "sigma") return mm(st.sigma);
  return T.tools[TOOLS[st.tool][0]];
}
function sync() {
  if (!keys.includes(st.sel)) st.sel = keys[0];
  pick.forEach((b) => { const on = b.dataset.pick === st.sel; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; b.querySelector("b").textContent = valueText(b.dataset.pick); });
  ptBtns.forEach((b) => { const on = Number(b.dataset.pts) === st.points; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  hourBtns.forEach((b) => { const on = Number(b.dataset.hour) === st.hour; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  impBtns.forEach((b) => { const on = (b.dataset.imp === "on") === st.imp; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  const list = LISTS[st.sel];
  const i = list.findIndex((v) => Math.abs(v - st[st.sel]) < 1e-9);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1));
  describe();
}
function describe() {
  let text;
  if (LVL === 1) text = pointsNow() + " " + T.points + (marked >= 0 ? ", " + T.parts[PARTS[marked].key].join(": ") : "");
  else if (LVL === 2) { const [key, res] = TOOLS[st.tool]; text = T.band + " " + mm(st.band) + " mm, " + T.tools[key] + " " + mm(res) + " mm: " + pct(res / st.band) + ", " + (res <= st.band / 10 + 1e-12 ? T.ok : T.coarse); }
  else if (LVL === 3) { const g = grrOf(st.sigma, st.band); text = T.band + " " + mm(st.band) + " mm, σ " + mm(st.sigma) + " mm: %GRR " + pct(g) + ", " + T.verdict[verdictOf(g)]; }
  else { const sh = shiftNow(); text = st.hour + ":00, " + T.mean + " " + fmt(25 + sh, 3) + ", Cpk " + fmt(cpkOf(CAP.tol, sh, CAP.sigma), 2) + (st.imp ? ", " + T.imp : ""); }
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); sync(); announce(); kick(); }
function stepValue(dir) {
  const key = st.sel, list = LISTS[key];
  let i = list.findIndex((v) => Math.abs(v - st[key]) < 1e-9);
  if (i < 0) i = 0;
  st[key] = list[clamp(i + dir, 0, list.length - 1)];
  changed();
}
pick.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
ptBtns.forEach((b) => b.addEventListener("click", () => { st.points = Number(b.dataset.pts); cyc.phase = "down"; cyc.t = 0; cyc.i = 0; cyc.done = 0; changed(); }));
hourBtns.forEach((b) => b.addEventListener("click", () => { st.hour = Number(b.dataset.hour); changed(); }));
impBtns.forEach((b) => b.addEventListener("click", () => { st.imp = b.dataset.imp === "on"; changed(); }));
function radioKeys(group, values, current, set) {
  group.addEventListener("keydown", (event) => {
    const i = values.indexOf(current());
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % values.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + values.length - 1) % values.length;
    if (next < 0) return;
    event.preventDefault();
    set(values[next]);
    const radios = [...group.querySelectorAll('[role="radio"]')].filter((b) => !b.hidden);
    if (radios[next]) radios[next].focus();
  });
}
radioKeys(pickRow.querySelector('[role="radiogroup"]'), keys, () => st.sel, (v) => { st.sel = v; changed(); });
radioKeys(document.querySelector('[data-row="pts"]'), [4, 8], () => st.points, (v) => { st.points = v; changed(); });
radioKeys(document.querySelector('[data-row="hour"]'), HOURS, () => st.hour, (v) => { st.hour = v; changed(); });
radioKeys(document.querySelector('[data-row="imp"]'), [false, true], () => st.imp, (v) => { st.imp = v; changed(); });

// tap the drawing: at level 1 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  const pos = probePos();
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => {
    const o = p.g === "y" ? [0, pos.dy, 0] : p.g === "x" ? [pos.dx, pos.dy, 0] : p.g === "z" ? [pos.dx, pos.dy, pos.dz] : [0, 0, 0];
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
  else if ((LVL === 2 || LVL === 3) && event.key === "ArrowUp") stepValue(1);
  else if ((LVL === 2 || LVL === 3) && event.key === "ArrowDown") stepValue(-1);
  else if ((LVL === 2 || LVL === 3) && (event.key === "1" || event.key === "2")) { st.sel = keys[Number(event.key) - 1]; changed(); }
  else if (LVL === 4 && (event.key === "ArrowRight" || event.key === "ArrowUp")) { st.hour = HOURS[Math.min(HOURS.length - 1, HOURS.indexOf(st.hour) + 1)]; changed(); }
  else if (LVL === 4 && (event.key === "ArrowLeft" || event.key === "ArrowDown")) { st.hour = HOURS[Math.max(0, HOURS.indexOf(st.hour) - 1)]; changed(); }
  else if (LVL === 4 && (event.key === "m" || event.key === "M")) { st.imp = !st.imp; changed(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { cyc.phase = "down"; cyc.t = 0; cyc.i = 0; cyc.done = 0; run(); } });
if (still.matches) stillPose();
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Meten op een 3D-meetmachine",
    hint1: "Tik een onderdeel · kies het aantal punten",
    hint2: "Kies band of meetmiddel, dan − of +",
    hint3: "Kies band of σ, dan − of +",
    hint4: "Kies het tijdstip · zet meten in de machine aan",
    pts4: "4 punten",
    pts8: "8 punten",
    pts: "Meetpunten",
    band: "Band",
    tool: "Meetmiddel",
    vals: "Waarde",
    hours: "Tijdstip",
    imps: "Meten in de machine",
    off: "Zonder taster",
    on: "Meten in de machine",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "3D-meetmachine. Niveau 1: pijltjes kiezen een onderdeel. Niveau 2 en 3: toetsen 1 en 2 kiezen de waarde, pijl omhoog en omlaag veranderen hem. Niveau 4: pijltjes kiezen het tijdstip, M zet meten in de machine aan of uit.",
  },
  en: {
    title: "Measuring on a CMM",
    hint1: "Tap a part · pick the number of points",
    hint2: "Pick band or instrument, then − or +",
    hint3: "Pick band or σ, then − or +",
    hint4: "Pick the time of day · switch in-machine probing on",
    pts4: "4 points",
    pts8: "8 points",
    pts: "Probing points",
    band: "Band",
    tool: "Instrument",
    vals: "Value",
    hours: "Time of day",
    imps: "In-machine probing",
    off: "No probe",
    on: "In-machine probing",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Coordinate measuring machine. Level 1: arrows pick a part. Levels 2 and 3: keys 1 and 2 pick the value, up and down change it. Level 4: arrows pick the time of day, M switches in-machine probing.",
  },
};

const sN = STRINGS.nl;
const valBtn = (key, labelHtml) => `<button type="button" class="cm-btn" role="radio" data-pick="${key}" aria-checked="${key === "band"}" tabindex="${key === "band" ? 0 : -1}"><span data-l="${key}">${labelHtml}</span>&nbsp;<b></b></button>`;
const radio = (attr, value, label, on) => `<button type="button" class="cm-btn" role="radio" ${attr}="${value}" aria-checked="${on}" tabindex="${on ? 0 : -1}">${label}</button>`;
const controls = [
  `<div class="cm-controls">`,
  `<div class="cm-row" data-row="pts" role="radiogroup" aria-label="${sN.pts}">${radio("data-pts", 4, sN.pts4, true)}${radio("data-pts", 8, sN.pts8, false)}</div>`,
  `<div class="cm-row" data-row="vals"><div role="radiogroup" aria-label="${sN.vals}" style="display:flex;gap:4px;flex:1 1 auto;min-width:0">${valBtn("band", sN.band)}${valBtn("tool", sN.tool)}${valBtn("sigma", "<i>σ</i>")}</div><button type="button" class="cm-btn" data-step="-" aria-label="${sN.minus}">−</button><button type="button" class="cm-btn" data-step="+" aria-label="${sN.plus}">+</button></div>`,
  `<div class="cm-row" data-row="hour" role="radiogroup" aria-label="${sN.hours}">${HOURS.map((h) => radio("data-hour", h, String(h).padStart(2, "0") + ":00", h === 13)).join("")}</div>`,
  `<div class="cm-row" data-row="imp" role="radiogroup" aria-label="${sN.imps}">${radio("data-imp", "off", sN.off, true)}${radio("data-imp", "on", sN.on, false)}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="cm-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="cm-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="cm-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);
if (!plate.includes('<span class="cm-line">') || !plate.includes("data-hint")) throw new Error("plate markup changed");

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
set('[data-pts="4"]',s.pts4);set('[data-pts="8"]',s.pts8);set('[data-l="band"]',s.band);set('[data-l="tool"]',s.tool);set('[data-imp="off"]',s.off);set('[data-imp="on"]',s.on);
document.querySelector('[data-row="pts"]').setAttribute("aria-label",s.pts);document.querySelector('[data-row="hour"]').setAttribute("aria-label",s.hours);document.querySelector('[data-row="imp"]').setAttribute("aria-label",s.imps);
document.querySelector('[data-row="vals"] [role="radiogroup"]').setAttribute("aria-label",s.vals);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".cm-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: %GRR ${grrOf(0.0015, 0.04)} · ${grrOf(0.002, 0.05)} · Cpk ${cpkOf(0.015, 0, 0.003).toFixed(2)} → ${cpkOf(0.015, 0.006, 0.003).toFixed(2)} · held ${cpkOf(0.015, 0.001, 0.003).toFixed(2)}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)} · loupe r ${LOUPE.r}`);

A.auditOrExit(R, P);

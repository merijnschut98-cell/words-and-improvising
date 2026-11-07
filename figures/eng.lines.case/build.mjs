// Dev tool, not shipped. Builds the standalone figure for the topic "Businesscase"
// (module Lijnen en automatisering): the lessons eng.lines.autobasics (level 1),
// payback (level 2), business (level 3) and risk (level 4).
//
//   node figures/eng.lines.case/build.mjs            build the page
//   node figures/eng.lines.case/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.case.html: one offline page with
// the anatomy kit and the live script inlined. The page reads ?theme=light|dark,
// ?lang=nl|en and ?level=1..4 from its URL (defaults: prefers-color-scheme,
// Dutch, level 2).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.case.html");

// ---------------------------------------------------------------- the model
// An operator station (left) next to a robot station (right) on one conveyor.
// In front stands a low cart with coin stacks: every coin is € 25,000. Two
// columns hold a crossbar at the height of the investment (capex); a stack that
// reaches the bar has paid the cell back. A stack light on the left column shows
// how many shifts run.
//   Level 1 (autobasics)  labour = shifts × 1 operator × € 55,000; one stack per
//                         operator replaced. Volume = 400 boxes × shifts × 220
//                         days (the lesson's palletising example: 2 shifts →
//                         € 110,000 and 176,000 boxes a year).
//   Level 2 (payback)     net saving = shifts × wage − running costs (€ 12,000);
//                         payback = capex / net saving. Stacks are the cumulative
//                         saving per year. Lesson example € 280,000: 1 shift
//                         6.5 years, 2 shifts 2.9, 3 shifts 1.8.
//   Level 3 (business)    the faded example: € 300,000, 2 shifts, € 10,000 a year
//                         → € 100,000 a year, payback 3 years, against a product
//                         programme of 2 years. The robot itself is about a
//                         quarter to a third of the cell (30 % shown). A ramp-up
//                         of m months saves nothing while the operators are still
//                         needed: year 1 = S × (12 − m) / 12, payback + m / 12.
//                         Years beyond the programme are drawn as ghosts: they
//                         only count if the cell is reused.
//   Level 4 (risk)        NPV = Σ CF_n / (1 + r)^n − capex, with the ramp-up in
//                         year 1 (6 months = half the saving, as in the lesson).
//                         Lesson: € 300,000, € 100,000 a year, year 1 € 50,000,
//                         4 years, 8 % → NPV ≈ −€ 15,084; reuse for 2 more years
//                         → about +€ 116,000. Stacks are discounted.
// Sources: the four lessons (eng.lines.autobasics, payback, business, risk).
const COIN = 25000; // € per coin
const COIN_H = 2.5; // world units per coin
const PER_UNIT = COIN / COIN_H; // € per unit of stack height
const DAYS = 220, BOXES = 400;
const SHIFTS = [1, 2, 3];
const CAPEX = [200000, 240000, 280000, 300000, 360000, 400000, 450000];
const WAGES = [45000, 50000, 55000, 60000, 65000];
const RAMPS = [0, 3, 6];
const LIVES = [1, 2, 3, 4, 5, 6];
const RATES = [0.06, 0.08, 0.1, 0.12];
const YEARS = 6;
const LEVEL = {
  1: { capex: 0, wage: 55000, run: 0, shifts: 2 },
  2: { capex: 280000, wage: 55000, run: 12000, shifts: 2 },
  3: { capex: 300000, wage: 55000, run: 10000, shifts: 2, ramp: 0, life: 2 },
  4: { capex: 300000, wage: 55000, run: 10000, shifts: 2, ramp: 6, life: 4, rate: 0.08 },
};
const ROBOT_SHARE = 0.3;
const savingOf = (shifts, wage, run) => shifts * wage - run;
const flowsOf = (S, ramp, years) => Array.from({ length: years }, (_, i) => (i === 0 ? (S * (12 - ramp)) / 12 : S));
const npvOf = (flows, rate, capex) => flows.reduce((sum, cf, i) => sum + cf / (1 + rate) ** (i + 1), 0) - capex;
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(savingOf(2, 55000, 0), 110000, 0, "autobasics example: labour 2 shifts");
  near(BOXES * 2 * DAYS, 176000, 0, "autobasics example: 176,000 boxes");
  near(savingOf(3, 55000, 0), 165000, 0, "autobasics recall: 3 shifts");
  near(500 * 2 * DAYS, 220000, 0, "autobasics recall: volume");
  near(200000 / 50000, 4, 1e-9, "payback pre: 4 years");
  near(280000 / savingOf(2, 55000, 12000), 2.857, 0.001, "payback example: 2 shifts 2.9 years");
  near(280000 / savingOf(3, 55000, 12000), 1.83, 0.01, "payback example: 3 shifts 1.8 years");
  near(280000 / savingOf(1, 55000, 12000), 6.51, 0.01, "payback example: 1 shift 6.5 years");
  near(360000 / savingOf(2, 55000, 20000), 4, 1e-9, "payback recall: 4 years");
  near(360000 / savingOf(3, 55000, 20000), 2.48, 0.005, "payback recall: 2.48 years");
  near(300000 / savingOf(2, 55000, 10000), 3, 1e-9, "business faded example: 3 years");
  near(240000 / 80000, 3, 1e-9, "business recall: 3 years");
  near(300000 / 100000 + 6 / 12, 3.5, 1e-9, "risk example: payback 3.5 years with the ramp-up");
  near(npvOf(flowsOf(100000, 6, 4), 0.08, 300000), -15084, 2, "risk example: NPV 4 years");
  near(npvOf(flowsOf(100000, 6, 6), 0.08, 300000), 116000, 1500, "risk example: NPV with reuse");
  near(110000 / 1.1, 100000, 1e-6, "risk recall: discounted year 1");
  near(110000 / 1.1 + 121000 / 1.21 - 180000, 20000, 1e-6, "risk recall: NPV 20,000");
  if (!CAPEX.includes(280000) || !CAPEX.includes(360000) || !CAPEX.includes(300000)) throw new Error("capex steps miss a lesson value");
}

// ---------------------------------------------------------------- the world
// World units are 10 mm, z up, +y toward the viewer (the aisle).
const WIDTH = 600;
const FLOOR = { x: -205, y: -50, w: 410, d: 98, r: 3 };
const CONV = { x0: -198, x1: 198, y0: -44, y1: -26, z: 80 }; // belt top at z
const BENCH = { x: -192, y: -21, w: 88, d: 24, r: 1 };
const BENCH_Z = 90;
const MAT = { x: -176, y: 6, w: 58, d: 30, r: 1.5 };
const OP = { x: -147, y: 21 }; // operator stands here, facing -y
const TABLE = { x: 108, y: -22, w: 42, d: 34, r: 1 };
const TABLE_Z = 70;
const ROB = [129, -5];
const CAB = { x: 162, y: -20, w: 30, d: 28, r: 1 };
const CAB_H = 112;
const CART = { x: -80, y: 0, w: 148, d: 40, r: 1.5 };
const CART_Z = 29; // top of the cart = foot of every stack
const COLS = [-72, 60]; // columns of the capex bar
const COL_Y = 4;
const COL_H = 118;
const STACK_R = 7.5;
const STACK_Y = 21;
const STACK_X = Array.from({ length: YEARS }, (_, i) => -54 + i * 19);

const FIT = [
  ...k.boxCorners(FLOOR, -3, 0),
  [ROB[0], ROB[1], 150], [ROB[0], -34, 150], [OP.x, OP.y, 176], [OP.x - 10, OP.y, 176], [COLS[0], COL_Y, COL_H + 20],
  [CAB.x, CAB.y, CAB_H + 4], [CAB.x + CAB.w, CAB.y + CAB.d, CAB_H + 4],
];
const PAD = 6;
const AZIMUTH = Number(process.env.AZ ?? 70);
const ELEVATION = Number(process.env.EL ?? 28);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);
const VIEW = k.towardViewer(P);
if (!(VIEW[1] > 0 && VIEW[0] > 0)) throw new Error("the camera must look from +x, +y");

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", layer = "front" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: "", move: [0, 0, 0], attrs, layer });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, p, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(p, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [p.x + p.w / 2, p.y + p.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
function rod(name, from, to, r, style = {}, opts = {}) {
  const a = G.sub3(to, from);
  const F = G.frameAlong(from, a);
  return discAt(name, F, 0, G.len3(a), r, style, opts);
}
function ball(name, c, r, style = {}, { owner, extra = "", ...opts } = {}) {
  const shape = R.solid(A.ball(c, r, { name, owner }));
  const svg = S(G.sphereOf(c, r, P), { tone: "mid", ...style }) + extra;
  return put(name, c, svg, [shape], opts);
}
const along = (from, to, d) => G.add3(from, G.mul3(G.unit3(G.sub3(to, from)), d));
const card = (pts, cls = "bc-card") => `<path class="${cls}" d="${k.pathOf(pts.map(at), true)}"/>`;

// ---------------------------------------------------------------- the floor
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(FLOOR, -2), -3, 2, P)}"/>`;
{
  const anchors = k.corners(FLOOR, 7);
  const extra =
    L(k.planOutline(k.insetPlan(FLOOR, 3.5), 0, P, 3), { tone: "faint" }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 2, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("floor.plate", FLOOR, -3, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(FLOOR, -1.4, P, 3), { tone: "faint" }), extra, layer: "floor", ground: true });
}
// the aisle line in front of both stations
box("floor.aisle", { x: -196, y: 41, w: 392, d: 2.4, r: 0.4 }, 0, 0.4, { tone: "mid", crease: "none" }, { steps: 2, flat: true, layer: "floor" });
// a dividing line between the two stations, behind the cart
box("floor.split", { x: 82, y: -22, w: 2.4, d: 60, r: 0.4 }, 0, 0.4, { tone: "lo", crease: "none" }, { steps: 2, flat: true, layer: "floor" });

// ---------------------------------------------------------------- conveyor (back)
{
  const { x0, x1, y0, y1, z } = CONV;
  for (const x of [x0 + 8, -60, 60, x1 - 8]) for (const y of [y0 + 3, y1 - 3]) {
    post("conv.foot", x, y, 2.6, 0, 1, { tone: "lo" }, { steps: 16, layer: "back", ground: true });
    post("conv.leg", x, y, 1.5, 1, z - 8, { tone: "mid", crease: "none" }, { steps: 12, layer: "back" });
  }
  const frame = { x: x0 + 4, y: y0, w: x1 - x0 - 8, d: y1 - y0, r: 0.6 };
  box("conv.frame", frame, z - 8, z - 1.2, { tone: "mid" }, { steps: 2, inner: L(k.sideSeam(frame, z - 4.6, P, 2), { tone: "faint" }), layer: "back" });
  const belt = { x: x0 + 4, y: y0 + 1.6, w: x1 - x0 - 8, d: y1 - y0 - 3.2, r: 0.3 };
  const cleats = [];
  for (let x = belt.x + 6; x < belt.x + belt.w - 2; x += 12) cleats.push(k.lineOnTop([x, belt.y], [x, belt.y + belt.d], z, P));
  box("conv.belt", belt, z - 1.2, z, { tone: "lo", crease: "none" }, { steps: 2, extra: L(cleats.join(""), { tone: "faint" }), layer: "back" });
  for (const x of [x0 + 2, x1 - 2]) discAt("conv.roller", frameY([x, 0, z - 3.4]), y0 + 0.6, y1 - 0.6, 2.2, { tone: "hi", crease: "lo" }, { steps: 24, layer: "back" });
  box("conv.rail-back", { x: x0 + 2, y: y0, w: x1 - x0 - 4, d: 1.4, r: 0.3 }, z - 1.2, z + 3, { tone: "mid" }, { steps: 1, layer: "back" });
  // the motor under the right end, hung from the frame
  box("conv.motor", { x: x1 - 26, y: y0 + 4, w: 14, d: 10, r: 1 }, z - 18, z - 8, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.3, extra: Dt([at([x1 - 19, y0 + 14, z - 13])], { size: 0.45 }), layer: "back" });
}
// the front rail is drawn over the boxes on the belt
box("conv.rail-front", { x: CONV.x0 + 2, y: CONV.y1 - 1.4, w: CONV.x1 - CONV.x0 - 4, d: 1.4, r: 0.3 }, CONV.z - 1.2, CONV.z + 3, { tone: "mid" }, {
  steps: 1,
  layer: "rail",
  extra: Dt([-150, -60, 0, 60, 150].map((x) => at([x, CONV.y1, CONV.z + 1])), { size: 0.35 }),
});

// ---------------------------------------------------------------- operator station (left)
{
  const b = BENCH;
  for (const [x, y] of k.corners(b, 2.5)) {
    box("bench.leg", plan(x, y, 3, 3, 0.3), 0, BENCH_Z - 4, { tone: "mid" }, { steps: 1, ground: true });
  }
  box("bench.shelf", k.insetPlan(b, 3.6), 20, 22, { tone: "lo" }, { steps: 1 });
  const top = { ...b };
  box("bench.top", top, BENCH_Z - 4, BENCH_Z, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(top, BENCH_Z - 2, P, 2), { tone: "faint" }), extra: L(k.planOutline(k.insetPlan(top, 2.5), BENCH_Z, P, 2), { tone: "faint" }) });
  // three part bins along the back of the bench
  for (const x of [-186, -170, -154]) {
    const bin = { x, y: b.y + 2, w: 13, d: 8, r: 0.6 };
    box("bench.bin", bin, BENCH_Z, BENCH_Z + 6, { tone: "mid" }, { steps: 2, extra: L(k.planOutline(k.insetPlan(bin, 1), BENCH_Z + 6, P, 2), { tone: "lo" }) });
  }
  // the fixture with a part in it, at the front of the bench
  const fx = { x: -152, y: b.y + 13, w: 18, d: 9, r: 0.6 };
  box("bench.fixture", fx, BENCH_Z, BENCH_Z + 3, { tone: "lo" }, { steps: 2, extra: Dt(k.corners(fx, 1.4).map(([x, y]) => at([x, y, BENCH_Z + 3])), { size: 0.35 }) });
  box("bench.part", { x: fx.x + 3, y: fx.y + 1.5, w: 12, d: 6, r: 0.4 }, BENCH_Z + 3, BENCH_Z + 8, { tone: "hi", crease: "lo" }, { steps: 2 });
  // an instruction card on a stand, right of the fixture
  box("bench.card-foot", { x: -122, y: b.y + 4, w: 10, d: 4, r: 0.4 }, BENCH_Z, BENCH_Z + 1.4, { tone: "lo" }, { steps: 1 });
  box("bench.card", { x: -121, y: b.y + 5.4, w: 8, d: 1.2, r: 0 }, BENCH_Z + 1.4, BENCH_Z + 12, { tone: "mid" }, {
    steps: 1,
    extra: L([9.5, 7.5, 5.5].map((z) => k.segment([-120, b.y + 6.6, BENCH_Z + z], [-114, b.y + 6.6, BENCH_Z + z], P)).join(""), { tone: "lo", free: true }),
  });
}
// the anti-fatigue mat and the operator on it
box("op.mat", MAT, 0, 1.2, { tone: "lo" }, { steps: 3, flat: false, extra: L([10, 20].map((dy) => k.lineOnTop([MAT.x, MAT.y + dy], [MAT.x + MAT.w, MAT.y + dy], 1.2, P)).join(""), { tone: "faint" }) });
{
  const { x, y } = OP;
  const o = { owner: "op" };
  for (const dx of [-6, 6]) {
    box("op.shoe", { x: x + dx - 3.5, y: y - 7, w: 7, d: 12, r: 2 }, 1.2, 4.4, { tone: "lo" }, { steps: 3, ...o });
    post("op.leg", x + dx, y, 4.6, 4.4, 86, { tone: "mid", crease: "none" }, { steps: 20, ...o });
  }
  box("op.hips", { x: x - 12, y: y - 6, w: 24, d: 12, r: 4 }, 84, 96, { tone: "mid" }, { steps: 4, ...o });
  const torso = { x: x - 13, y: y - 7, w: 26, d: 14, r: 5 };
  box("op.torso", torso, 96, 142, { tone: "hi", crease: "lo" }, { steps: 5, inner: L(k.sideSeam(torso, 120, P, 5), { tone: "faint" }), ...o });
  // the arms reach forward to the fixture on the bench
  for (const dx of [-17.4, 17.4]) {
    const sh = [x + dx, y, 136];
    const el = [x + dx, y - 10, 114];
    const hand = [x + dx - Math.sign(dx) * 6, y - 20, 102];
    ball("op.shoulder", sh, 4.4, { tone: "hi", crease: "lo" }, o);
    rod("op.upper-arm", along(sh, el, 4.4), el, 3.6, { tone: "hi", crease: "lo" }, o);
    rod("op.forearm", el, along(hand, el, 3.4), 3.2, { tone: "hi", crease: "lo" }, o);
    ball("op.hand", hand, 3.4, { tone: "mid" }, o);
  }
  post("op.neck", x, y, 3.6, 142, 146, { tone: "mid" }, { steps: 16, ...o });
  ball("op.head", [x, y, 155], 9.5, { tone: "hi", crease: "lo" }, o);
}

// ---------------------------------------------------------------- robot station (right)
{
  const t = TABLE;
  box("robot.table", t, 0, TABLE_Z, { tone: "mid" }, {
    steps: 2,
    bevel: 0.5,
    ground: true,
    inner: L(k.sideSeam(t, TABLE_Z - 6, P, 2), { tone: "faint" }),
    extra: L(k.planOutline(k.insetPlan(t, 2.5), TABLE_Z, P, 2), { tone: "faint" }) + Dt(k.corners(t, 2.5).map(([x, y]) => at([x, y, TABLE_Z])), { size: 0.4 }),
  });
  const [px, py] = ROB;
  const o = { owner: "robot" };
  const bolts = Array.from({ length: 6 }, (_, q) => [px + 11 * Math.cos((q / 6) * Math.PI * 2 + 0.3), py + 11 * Math.sin((q / 6) * Math.PI * 2 + 0.3)]);
  post("robot.plate", px, py, 13, TABLE_Z, TABLE_Z + 2, { tone: "lo" }, { steps: 44, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, TABLE_Z + 2])), { size: 0.4 }), ...o });
  post("robot.base", px, py, 10, TABLE_Z + 2, TABLE_Z + 11, { tone: "hi", crease: "lo" }, { steps: 40, inner: L(k.sideArc(px, py, 10, TABLE_Z + 6.5, P, 28), { tone: "faint" }), ...o });
  post("robot.turret", px, py, 8.5, TABLE_Z + 11, TABLE_Z + 22, { tone: "hi", crease: "lo" }, { steps: 36, ...o });
  const SH = [px, py, TABLE_Z + 28];
  const EL = [px, py + 6, TABLE_Z + 70];
  const WR = [px, -35, TABLE_Z + 58];
  discAt("robot.shoulder", frameX(SH), -9, 9, 8, { tone: "hi", crease: "lo" }, { steps: 36, ...o });
  rod("robot.upper-arm", along(SH, EL, 8), along(EL, SH, 6.6), 6, { tone: "hi", crease: "lo" }, { ...o });
  discAt("robot.elbow", frameX(EL), -7.5, 7.5, 6.6, { tone: "hi", crease: "lo" }, { steps: 32, ...o });
  rod("robot.forearm", along(EL, WR, 6.6), along(WR, EL, 4.8), 4.6, { tone: "hi", crease: "lo" }, { ...o });
  discAt("robot.wrist", frameX(WR), -5, 5, 4.8, { tone: "mid" }, { steps: 28, ...o });
  post("robot.flange", WR[0], WR[1], 3.6, WR[2] - 10, WR[2] - 4.8, { tone: "mid" }, { steps: 24, ...o });
  box("robot.gripper", plan(WR[0], WR[1], 12, 6, 0.6), WR[2] - 15, WR[2] - 10, { tone: "lo" }, { steps: 2, ...o });
  for (const dx of [-4.6, 4.6]) box("robot.finger", plan(WR[0] + dx, WR[1], 1.8, 4, 0.2), WR[2] - 24, WR[2] - 15, { tone: "mid" }, { steps: 1, ...o });
  // the controller cabinet beside the table, with a cable duct to the robot
  const c = CAB;
  const fy = c.y + c.d;
  box("robot.cabinet", c, 0, CAB_H, { tone: "mid" }, {
    steps: 2,
    bevel: 0.6,
    ground: true,
    extra:
      card([[c.x + 4, fy, 82], [c.x + 26, fy, 82], [c.x + 26, fy, 100], [c.x + 4, fy, 100]], "bc-window") +
      L(k.segment([c.x + 15, fy, 0], [c.x + 15, fy, 82], P), { tone: "lo" }) +
      Dt([at([c.x + 13, fy, 46]), at([c.x + 17, fy, 46])], { size: 0.45 }) +
      Dt([at([c.x + 8, fy, 91]), at([c.x + 12, fy, 91])], { size: 0.6, tone: "hi" }),
  });
  box("robot.duct", { x: t.x + t.w, y: -8, w: c.x - (t.x + t.w), d: 5, r: 0.6 }, 0, 1.4, { tone: "lo" }, { steps: 1, layer: "floor" });
}

// ---------------------------------------------------------------- the cart with coin stacks
{
  const c = CART;
  for (const [x, y] of k.corners(c, 4)) {
    post("cart.caster", x, y, 2.4, 0, 4, { tone: "lo" }, { steps: 16, ground: true });
    post("cart.leg", x, y, 1.5, 4, CART_Z - 3, { tone: "mid", crease: "none" }, { steps: 12 });
  }
  box("cart.shelf", { ...k.insetPlan(c, 5), r: 0 }, 10, 11.4, { tone: "lo" }, { steps: 2 });
  box("cart.top", c, CART_Z - 3, CART_Z, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(c, CART_Z - 1.5, P, 2), { tone: "faint" }) });
  // a ruler strip along the front edge: one tick under each year's stack
  const strip = { x: c.x + 6, y: c.y + c.d - 6, w: c.w - 12, d: 4, r: 0.4 };
  const ticks = STACK_X.map((x) => k.lineOnTop([x, strip.y], [x, strip.y + 2.6], CART_Z + 0.4, P));
  box("cart.ruler", strip, CART_Z, CART_Z + 0.4, { tone: "lo", crease: "none" }, { steps: 2, extra: L(ticks.join(""), { tone: "hi" }) });
  // the two columns of the capex bar, with a scale on the front: a tick every
  // € 100,000, a long one every € 500,000
  for (const cx of COLS) {
    const col = plan(cx, COL_Y, 6, 4, 0.4);
    box("bar.foot", plan(cx, COL_Y, 10, 8, 0.6), CART_Z, CART_Z + 1.6, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(plan(cx, COL_Y, 10, 8, 0), 1.5).map(([x, y]) => at([x, y, CART_Z + 1.6])), { size: 0.3 }) });
    const fy = COL_Y + 2;
    const ticks = [];
    for (let e = 0; e <= 1200000; e += 100000) {
      const z = CART_Z + e / PER_UNIT;
      if (z > CART_Z + COL_H - 4) break;
      const long = e % 500000 === 0;
      ticks.push(k.segment([cx - 3, fy, z], [cx - 3 + (long ? 4 : 2.2), fy, z], P));
    }
    box("bar.column", col, CART_Z + 1.6, CART_Z + COL_H, { tone: "hi", crease: "lo" }, { steps: 1, extra: L(ticks.join(""), { tone: "mid" }) });
  }
  // the stack light on the left column: one lamp per shift, lit from the bottom
  const [lx] = COLS;
  const lz = CART_Z + COL_H;
  post("bar.lamp-base", lx, COL_Y, 2.6, lz, lz + 1.4, { tone: "lo" }, { steps: 18 });
  for (let i = 0; i < 3; i++) {
    const z0 = lz + 1.4 + i * 5.2;
    post("bar.lamp", lx, COL_Y, 2.2, z0, z0 + 5.2, { tone: "mid", crease: "lo" }, { steps: 18, attrs: ` data-lamp="${i + 1}"`, inner: L(k.sideArc(lx, COL_Y, 2.2, z0 + 2.6, P, 16), { tone: "faint" }) });
  }
  post("bar.lamp-cap", lx, COL_Y, 1.6, lz + 17, lz + 18.4, { tone: "lo" }, { steps: 14 });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
if (process.env.ORDER) console.log(R.items.slice().sort((a, b) => a.key - b.key).map((i, n) => n + " " + i.layer + " " + i.name).join("\n"));
const body = [
  halo,
  ...layerOf("floor"),
  ...layerOf("back"),
  `<g data-belt=""></g>`,
  ...layerOf("rail"),
  ...layerOf("front"),
  `<g data-bar=""></g>`,
  `<g data-coins=""></g>`,
  `<g data-mark=""></g>`,
];

const LABEL_NL =
  "Een operatorstation naast een robotstation, schuin van boven gezien. Achter loopt een transportband met dozen. Links staat een werkbank met bakken, een mal en een operator op een mat; rechts een robot op een tafel met een grijper boven de band en een besturingskast. Vooraan staat een karretje met stapels munten, elke munt € 25.000, tussen twee zuilen met een schaalverdeling. Een lat tussen de zuilen hangt op de hoogte van de investering; een stapel die de lat haalt, heeft de cel terugverdiend. Op de linkerzuil laat een signaallamp zien hoeveel ploegen er draaien.";
const LABEL_EN =
  "An operator station next to a robot station, seen at an angle from above. A conveyor with boxes runs along the back. On the left stands a workbench with bins, a fixture and an operator on a mat; on the right a robot on a table with a gripper over the belt and a controller cabinet. In front stands a cart with stacks of coins, each coin € 25,000, between two columns with a scale. A bar between the columns hangs at the height of the investment; a stack that reaches the bar has paid the cell back. On the left column a stack light shows how many shifts run.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "op", at: [OP.x, OP.y, 120] },
  { key: "bench", at: [-150, BENCH.y + 17, BENCH_Z + 4] },
  { key: "bins", at: [-170, BENCH.y + 6, BENCH_Z + 6] },
  { key: "mat", at: [MAT.x + 8, MAT.y + MAT.d - 4, 1] },
  { key: "conv", at: [-40, CONV.y1, CONV.z] },
  { key: "robot", at: [ROB[0], ROB[1] + 3, TABLE_Z + 50] },
  { key: "gripper", at: [ROB[0], -35, TABLE_Z + 40] },
  { key: "cab", at: [CAB.x + 15, CAB.y + CAB.d, 90] },
  { key: "lamp", at: [COLS[0], COL_Y, CART_Z + COL_H + 9] },
  { key: "coins", stack: true },
  { key: "bar", bar: true },
];

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#2C6774;--anatomy-lit-shade:#205560;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --bc-hair:rgba(240,233,218,.12);--bc-accent:#5C9FAE;--bc-glass:#0A2228;--bc-lamp:#5C9FAE;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --bc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --bc-hair:rgba(11,41,27,.14);--bc-accent:#276F81;--bc-glass:#DCE7E4;--bc-lamp:#276F81;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--bc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:2;--lines:4;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 36px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--bc-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--rows:1;--lines:3}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--bc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.bc-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bc-acc{color:var(--bc-accent);font-weight:600}
.bc-strong{color:var(--anatomy-strong);font-weight:600}
.bc-mute{color:var(--anatomy-muted)}
.bc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.bc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.bc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.bc-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.bc-row{display:flex;gap:4px;height:44px;align-items:center}
.bc-row[hidden]{display:none}
.bc-pair{flex:1 1 0;min-width:0;display:flex;gap:2px;align-items:center}
.bc-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--bc-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--bc-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.bc-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.bc-btn:disabled{opacity:.4;cursor:default}
.bc-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--bc-accent);color:var(--bc-accent);font-weight:600}
.bc-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.bc-val{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font:400 10px/1 var(--bc-sans);color:var(--anatomy-muted);white-space:nowrap;overflow:hidden}
.bc-val b{font:600 12px/1 var(--anatomy-mono);color:var(--bc-accent)}
.bc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.bc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.bc-window{fill:var(--bc-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .3s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--bc-lamp)}
.bc-ghost{opacity:.32}
.bc-mark{fill:none;stroke:var(--bc-accent);stroke-width:1.4px}
.bc-mark-dot{fill:var(--bc-accent);stroke:none}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const PER_UNIT = ${PER_UNIT}, COIN_H = ${COIN_H}, COIN = ${COIN}, DAYS = ${DAYS}, BOXES = ${BOXES};
const SHIFTS = ${JSON.stringify(SHIFTS)}, CAPEX = ${JSON.stringify(CAPEX)}, WAGES = ${JSON.stringify(WAGES)}, RAMPS = ${JSON.stringify(RAMPS)}, LIVES = ${JSON.stringify(LIVES)}, RATES = ${JSON.stringify(RATES)};
const YEARS = ${YEARS}, LEVEL = ${JSON.stringify(LEVEL)}, ROBOT_SHARE = ${ROBOT_SHARE};
const CONV = ${JSON.stringify(CONV)}, CART_Z = ${CART_Z}, COLS = ${JSON.stringify(COLS)}, COL_Y = ${COL_Y}, COL_H = ${COL_H};
const STACK_R = ${STACK_R}, STACK_Y = ${STACK_Y}, STACK_X = ${JSON.stringify(STACK_X)};
const PARTS = ${JSON.stringify(PARTS)};
const savingOf = ${savingOf.toString()};
const flowsOf = ${flowsOf.toString()};
const npvOf = ${npvOf.toString()};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", yr: "/yr", years: "years", year: "year", mo: "mo",
      labour: "labour", shift: "shift", shifts: "shifts", op: "operator", volume: "volume", boxes: "boxes/yr",
      saving: "net saving", payback: "payback", within: "inside the 2–3 years many plants want", over: "longer than the 2–3 years many plants want",
      capex: "capex", robot: "robot ≈", rest: "rest: cell and integration",
      ramp: "ramp-up", life: "product runs", reuse: "→ the cell must be reusable", fine: "→ the saving runs long enough",
      y1: "year 1: ramp-up", then: "then", rate: "discount rate", npvBad: "NPV < 0 → the case falls over", npvOk: "NPV > 0 → earns more than required",
      reuseOn: "reused: 6 years", tapPart: "tap a part to name it",
      parts: { op: ["Operator", "one person per shift, € 55,000 a year"], bench: ["Workbench and fixture", "the part sits in a fixed place"], bins: ["Part bins", "parts at hand for the operator"], mat: ["Mat", "the operator stands here all shift"], conv: ["Conveyor", "the same boxes past both stations"], robot: ["Robot", "makes the same move every time"], gripper: ["Gripper", "part of the cell cost, like guarding and belts"], cab: ["Controller", "the integrator programs the cell"], lamp: ["Shift light", "one lamp per shift that runs"], coins: ["Coin stacks", "one coin = € 25,000"], bar: ["Capex bar", "at the height of the investment"] } }
  : { dec: ",", grp: ".", yr: "/jaar", years: "jaar", year: "jaar", mo: "mnd",
      labour: "arbeid", shift: "ploeg", shifts: "ploegen", op: "operator", volume: "volume", boxes: "dozen/jaar",
      saving: "netto besparing", payback: "terugverdientijd", within: "binnen de 2 tot 3 jaar die veel fabrikanten willen", over: "langer dan de 2 tot 3 jaar die veel fabrikanten willen",
      capex: "capex", robot: "robot ≈", rest: "rest: cel en integratie",
      ramp: "opstart", life: "product loopt", reuse: "→ de cel moet herbruikbaar zijn", fine: "→ de besparing loopt lang genoeg door",
      y1: "jaar 1: opstart", then: "daarna", rate: "disconteringsvoet", npvBad: "NPV < 0 → de case valt om", npvOk: "NPV > 0 → verdient meer dan geëist",
      reuseOn: "hergebruikt: 6 jaar", tapPart: "tik een onderdeel voor de naam",
      parts: { op: ["Operator", "één persoon per ploeg, € 55.000 per jaar"], bench: ["Werkbank en mal", "het product ligt op een vaste plek"], bins: ["Bakken", "onderdelen binnen handbereik"], mat: ["Mat", "hier staat de operator de hele dienst"], conv: ["Transportband", "dezelfde dozen langs beide stations"], robot: ["Robot", "maakt elke keer dezelfde beweging"], gripper: ["Grijper", "hoort bij de capex, net als afscherming en banden"], cab: ["Besturing", "de integrator programmeert de cel"], lamp: ["Ploegenlamp", "één lamp per ploeg die draait"], coins: ["Muntstapels", "één munt = € 25.000"], bar: ["Capex-lat", "op de hoogte van de investering"] } };
const grouped = (v) => String(Math.round(Math.abs(v))).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
const eur = (v) => (v < 0 ? "−" : "") + "€ " + grouped(v);
const kEur = (v) => "€ " + Math.round(v / 1000) + "k";
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const acc = (s) => '<span class="bc-acc">' + s + "</span>";
const strong = (s) => '<span class="bc-strong">' + s + "</span>";
const mute = (s) => '<span class="bc-mute">' + s + "</span>";

const stage = document.querySelector(".bc-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { belt: q("[data-belt]"), bar: q("[data-bar]"), coins: q("[data-coins]"), mark: q("[data-mark]"), lamps: [...svg.querySelectorAll("[data-lamp]")] };
const lines = [...document.querySelectorAll("[data-readout] .bc-line")];
const announcer = document.querySelector(".bc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const at = (p) => iso(p, P);

// ------------------------------------------------ state and model
const st = { ...LEVEL[LVL], reuse: false };
function model() {
  if (LVL === 1) {
    const heights = SHIFTS.map((s) => (s <= st.shifts ? st.wage : 0));
    return { heights: heights.concat([0, 0, 0]), ghost: [], lit: -1, bar: null };
  }
  const S = savingOf(st.shifts, st.wage, st.run);
  const ramp = LVL >= 3 ? st.ramp : 0;
  const flows = flowsOf(S, ramp, YEARS);
  const rate = LVL === 4 ? st.rate : 0;
  const life = LVL === 3 ? st.life : LVL === 4 ? (st.reuse ? 6 : st.life) : YEARS;
  let cum = 0, lit = -1;
  const heights = flows.map((cf, i) => {
    cum += cf / (1 + rate) ** (i + 1);
    if (lit < 0 && cum >= st.capex - 1e-6 && (LVL !== 4 || i < life)) lit = i;
    return cum;
  });
  const ghost = heights.map((_, i) => i >= life);
  if (LVL === 4) heights.forEach((_, i) => { if (i >= life) heights[i] = 0; });
  const pay = st.capex / S + ramp / 12;
  const npv = LVL === 4 ? npvOf(flows.slice(0, life), rate, st.capex) : 0;
  return { S, flows, heights, ghost, lit, bar: st.capex, pay, life, npv, ramp };
}
let M = model();
const shown = { h: M.heights.slice(), bar: M.bar ?? 0 };

// ------------------------------------------------ drawing
function stackSvg(i, h) {
  if (h < 0.05) return "";
  const x = STACK_X[i], z0 = CART_Z;
  const top = z0 + h / PER_UNIT;
  let seams = "";
  for (let z = z0 + COIN_H; z < top - 0.4; z += COIN_H) seams += sideArc(x, STACK_Y, STACK_R, z, P, 20);
  const lit = i === M.lit;
  const body = solidSvg(cylinder(x, STACK_Y, STACK_R, z0, top - z0, P, 30, 0.3), { tone: lit ? "hi" : "mid", lit, crease: "lo", inner: lineSvg(seams, { tone: "lo" }) });
  return M.ghost[i] ? '<g class="bc-ghost">' + body + "</g>" : body;
}
function barSvg(value) {
  if (M.bar === null) return "";
  const z = CART_Z + value / PER_UNIT;
  const plan = { x: COLS[0] + 3, y: COL_Y - 0.8, w: COLS[1] - COLS[0] - 6, d: 1.6, r: 0 };
  return solidSvg(slabOf(plan, z - 0.8, 1.6, P, 1, 0), { tone: "hi", lit: true, crease: "none" });
}
// boxes on the belt: they fade in and out at the belt ends
const BOX = { w: 12, d: 10, h: 8 };
const SPACING = 66, SPEED = 16;
function beltSvg(t) {
  const span = CONV.x1 - CONV.x0 - 16;
  const n = Math.ceil(span / SPACING) + 1;
  const order = [];
  for (let i = 0; i < n; i++) {
    const s = (((t * SPEED + i * SPACING) % (n * SPACING)) + n * SPACING) % (n * SPACING);
    if (s > span) continue;
    const x = CONV.x0 + 8 + s - BOX.w / 2;
    const a = clamp(Math.min(s, span - s) / 18, 0, 1);
    order.push({ x, a });
  }
  order.sort((p, q2) => p.x - q2.x); // farther first: the camera looks from +x
  return order.map(({ x, a }) => {
    const plan = { x, y: (CONV.y0 + CONV.y1) / 2 - BOX.d / 2, w: BOX.w, d: BOX.d, r: 0.5 };
    const paths = slabOf(plan, CONV.z, BOX.h, P, 2, 0.3);
    const tape = lineSvg(pathOf([at([x + BOX.w / 2, plan.y, CONV.z + BOX.h]), at([x + BOX.w / 2, plan.y + BOX.d, CONV.z + BOX.h])]), { tone: "lo" });
    return '<g opacity="' + a.toFixed(2) + '">' + solidSvg(paths, { tone: "mid", crease: "lo", inner: "" }) + tape + "</g>";
  }).join("");
}
let marked = -1;
function partPoint(p) {
  if (p.stack) { const i = Math.max(0, M.lit >= 0 ? M.lit : 1); return [STACK_X[i], STACK_Y, CART_Z + Math.max(4, shown.h[i] / PER_UNIT / 2)]; }
  if (p.bar) return [(COLS[0] + COLS[1]) / 2, COL_Y, CART_Z + (M.bar === null ? 60 : shown.bar / PER_UNIT)];
  return p.at;
}
let clock = 0;
function draw() {
  el.belt.innerHTML = beltSvg(clock);
  // stacks: far (small x) first
  el.coins.innerHTML = shown.h.map((h, i) => stackSvg(i, h)).join("");
  el.bar.innerHTML = barSvg(shown.bar);
  el.lamps.forEach((n) => (Number(n.dataset.lamp) <= st.shifts ? n.setAttribute("data-on", "") : n.removeAttribute("data-on")));
  if (marked >= 0 && (LVL > 2 || (PARTS[marked].bar && M.bar === null))) marked = -1;
  if (marked >= 0) {
    const [x, y] = at(partPoint(PARTS[marked]));
    el.mark.innerHTML = '<circle class="bc-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="bc-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
}

// ------------------------------------------------ readout
function readout() {
  const out = [];
  if (LVL === 1) {
    out.push(T.labour + ": " + st.shifts + " " + (st.shifts === 1 ? T.shift : T.shifts) + " × " + eur(st.wage) + " = " + acc(eur(st.shifts * st.wage) + T.yr));
    out.push(T.volume + ": " + BOXES + " × " + st.shifts + " × " + DAYS + " = " + strong(grouped(BOXES * st.shifts * DAYS)) + " " + T.boxes);
  } else if (LVL === 2) {
    out.push(T.saving + ": " + st.shifts + " × " + eur(st.wage) + " − " + eur(st.run) + " = " + strong(eur(M.S) + T.yr));
    out.push(T.payback + " = " + eur(st.capex) + " / " + eur(M.S) + " = " + acc(fmt(M.pay, 1) + " " + T.years));
    out.push(M.pay <= 3 + 1e-9 ? T.within : mute(T.over));
  } else if (LVL === 3) {
    out.push(T.capex + " " + eur(st.capex) + ": " + T.robot + " " + eur(st.capex * ROBOT_SHARE) + " (30%), " + mute(T.rest));
    out.push(T.saving + ": " + st.shifts + " × " + eur(st.wage) + " − " + eur(st.run) + " = " + strong(eur(M.S) + T.yr));
    out.push(T.payback + " " + (st.ramp ? fmt(st.capex / M.S, 1) + " + " + T.ramp + " " + st.ramp + " " + T.mo : eur(st.capex) + " / " + eur(M.S)) + " = " + acc(fmt(M.pay, 1) + " " + T.years));
    out.push(T.life + " " + st.life + " " + T.years + (st.life < M.pay ? " < " + fmt(M.pay, 1) + " " + acc(T.reuse) : " ≥ " + fmt(M.pay, 1) + " " + T.fine));
  } else {
    out.push(T.y1 + " " + st.ramp + " " + T.mo + " → " + eur(M.flows[0]) + " · " + T.then + " " + eur(M.S) + T.yr);
    out.push(T.rate + " " + Math.round(st.rate * 100) + "% · 1 / " + fmt(1 + st.rate, 2) + "ⁿ · " + (st.reuse ? T.reuseOn : T.life + " " + st.life + " " + T.years));
    out.push("NPV = " + eur(M.npv + st.capex) + " − " + eur(st.capex) + " = " + (M.npv < 0 ? acc(eur(M.npv)) : strong(eur(M.npv))));
    out.push(T.payback + " " + fmt(M.pay, 1) + " " + T.years + ", " + (M.npv < 0 ? acc(T.npvBad) : T.npvOk));
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function settleShown(dt) {
  const k2 = dt === Infinity ? 1 : 1 - Math.exp(-dt * 5);
  let moving = false;
  M.heights.forEach((h, i) => { shown.h[i] += (h - shown.h[i]) * k2; if (Math.abs(h - shown.h[i]) > 50) moving = true; else shown.h[i] = h; });
  const b = M.bar ?? 0;
  shown.bar += (b - shown.bar) * k2;
  if (Math.abs(b - shown.bar) > 50) moving = true; else shown.bar = b;
  return moving;
}
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  clock += dt;
  settleShown(dt);
  draw();
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { lastT = 0; frame = requestAnimationFrame(tick); } };
function restill() { clock = 2.1; settleShown(Infinity); draw(); }

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".bc-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const vals = [...document.querySelectorAll("[data-val]")];
const LISTS = { capex: CAPEX, wage: WAGES, ramp: RAMPS, life: LIVES, rate: RATES };
const show = { capex: kEur, wage: kEur, ramp: (v) => v + " " + T.mo, life: (v) => v + " " + T.years, rate: (v) => Math.round(v * 100) + "%" };
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  vals.forEach((v) => { const key = v.dataset.val; v.querySelector("b").textContent = show[key](st[key]); });
  stepBtns.forEach((b) => { const list = LISTS[b.dataset.key], i = list.indexOf(st[b.dataset.key]); b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1; });
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed() {
  M = model();
  sync(); readout(); announce();
  if (still.matches) restill(); else { draw(); run(); }
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  st[key] = key === "reuse" ? val === "true" : Number(val);
  changed();
}));
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  group.addEventListener("keydown", (event) => {
    const items = [...group.querySelectorAll('[role="radio"]')].filter((b) => !b.disabled);
    const i = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + items.length - 1) % items.length;
    if (next < 0) return;
    event.preventDefault(); event.stopPropagation();
    items[next].click(); items[next].focus();
  });
});
function stepValue(key, dir) {
  const list = LISTS[key];
  const v = list[clamp(list.indexOf(st[key]) + dir, 0, list.length - 1)];
  if (v === st[key]) return;
  st[key] = v;
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.key, b.dataset.step === "+" ? 1 : -1)));

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 70;
  PARTS.forEach((p, i) => { if (p.bar && M.bar === null) return; const [px, py] = at(partPoint(p)); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  marked = nearestPart(toView(event));
  draw(); readout(); announce();
});
const KEYSTEP = { 2: "capex", 3: "life", 4: "rate" };
stage.addEventListener("keydown", (event) => {
  let handled = true;
  const n = PARTS.length;
  const usable = (i) => !(PARTS[i].bar && M.bar === null);
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { do marked = (marked + 1) % n; while (!usable(marked)); }
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { do marked = (marked + n - 1) % n; while (!usable(marked)); }
  else if (KEYSTEP[LVL] && (event.key === "+" || event.key === "-")) { stepValue(KEYSTEP[LVL], event.key === "+" ? 1 : -1); return event.preventDefault(); }
  else handled = false;
  if (handled) { event.preventDefault(); draw(); readout(); announce(); }
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) restill(); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; restill(); } else run(); });
sync();
readout();
if (still.matches) restill(); else { shown.h = M.heights.map(() => 0); shown.bar = M.bar ?? 0; draw(); }
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Businesscase",
    hint1: "Tik een onderdeel · kies het aantal ploegen",
    hint2: "Tik een onderdeel · kies ploegen, capex en loon",
    hint3: "Kies ploegen, opstartfase en productleven",
    hint4: "Kies disconteringsvoet, opstartfase en hergebruik",
    shifts: "Ploegen", s1: "1 ploeg", s2: "2 ploegen", s3: "3 ploegen",
    capex: "Capex", wage: "Loon", ramp: "Opstart", life: "Product", rate: "Disconto",
    reuse: "Productleven", r0: "4 jaar", r1: "4 + 2 hergebruik",
    minus: "Lager", plus: "Hoger",
    label: LABEL_NL,
    aria: "Operatorstation naast een robotstation, met muntstapels voor de businesscase. Niveau 1 en 2: pijltjes kiezen een onderdeel. Plus en min veranderen de waarde.",
  },
  en: {
    title: "Business case",
    hint1: "Tap a part · pick the number of shifts",
    hint2: "Tap a part · pick shifts, capex and wage",
    hint3: "Pick shifts, ramp-up and product life",
    hint4: "Pick discount rate, ramp-up and reuse",
    shifts: "Shifts", s1: "1 shift", s2: "2 shifts", s3: "3 shifts",
    capex: "Capex", wage: "Wage", ramp: "Ramp-up", life: "Product", rate: "Discount",
    reuse: "Product life", r0: "4 years", r1: "4 + 2 reused",
    minus: "Lower", plus: "Higher",
    label: LABEL_EN,
    aria: "Operator station next to a robot station, with coin stacks for the business case. Levels 1 and 2: arrows pick a part. Plus and minus change the value.",
  },
};

const sN = STRINGS.nl;
const radio = (set, key) => `<button type="button" class="bc-btn" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key] ?? key}</button>`;
const stepper = (key) =>
  `<div class="bc-pair"><button type="button" class="bc-btn" data-step="-" data-key="${key}" aria-label="${sN.minus} ${sN[key]}" data-t-label="minus">−</button>` +
  `<div class="bc-val" data-val="${key}"><span data-t="${key}">${sN[key]}</span><b></b></div>` +
  `<button type="button" class="bc-btn" data-step="+" data-key="${key}" aria-label="${sN.plus} ${sN[key]}" data-t-label="plus">+</button></div>`;
const controls = [
  `<div class="bc-controls">`,
  `<div class="bc-row" data-levels="1,2,3" role="radiogroup" aria-label="${sN.shifts}" data-t-label="shifts">${radio("shifts:1", "s1")}${radio("shifts:2", "s2")}${radio("shifts:3", "s3")}</div>`,
  `<div class="bc-row" data-levels="2">${stepper("capex")}${stepper("wage")}</div>`,
  `<div class="bc-row" data-levels="3">${stepper("ramp")}${stepper("life")}</div>`,
  `<div class="bc-row" data-levels="4">${stepper("rate")}${stepper("ramp")}</div>`,
  `<div class="bc-row" data-levels="4" role="radiogroup" aria-label="${sN.reuse}" data-t-label="reuse">${radio("reuse:false", "r0")}${radio("reuse:true", "r1")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="bc-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="bc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="bc-line"></span>'.repeat(4)}</span>`)
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
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")];});
document.querySelectorAll("[data-t-label]").forEach(function(n){var k=n.getAttribute("data-t-label"),key=n.getAttribute("data-key");n.setAttribute("aria-label",s[k]+(key?" "+s[key]:""));});
var st=document.querySelector(".bc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: L2 payback ${(280000 / savingOf(2, 55000, 12000)).toFixed(2)} y · L3 ${(300000 / savingOf(2, 55000, 10000)).toFixed(2)} y · L4 NPV ${Math.round(npvOf(flowsOf(100000, 6, 4), 0.08, 300000))} / reuse ${Math.round(npvOf(flowsOf(100000, 6, 6), 0.08, 300000))}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false });

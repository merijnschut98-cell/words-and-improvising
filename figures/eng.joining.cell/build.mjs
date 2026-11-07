// Dev tool, not shipped. Builds the standalone figure for the topic "Lassen in
// productie" (module Lassen en verbinden): the lessons eng.joining.weldcell
// (level 1), fixturing (level 2), arcon (level 3) and weldsystem (level 4).
//
//   node figures/eng.joining.cell/build.mjs            build the page
//   node figures/eng.joining.cell/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.cell.html: one offline page
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
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.cell.html");

// ---------------------------------------------------------------- the model
// A robot weld cell with a two-station turntable positioner: a dividing screen
// across the table, a welding fixture on each half. The robot welds the frame
// on its side while the operator unloads and loads the other side; then the
// table turns 180°.
//   Level 1 (weldcell)  the lesson's worked example, a frame for a bed base:
//                       weld W = 6 min, load L = 4 min, table turn T = 0.3 min.
//                       One station:  cycle = W + L           = 10 min → 6 /h.
//                       Two stations: cycle = max(W, L) + T   = 6.3 min → 9.5 /h,
//                       +59 % output with the same robot. If L > W the robot
//                       waits for the operator and a second station no longer
//                       helps. Arc on = W / cycle (the robot's weld time is taken
//                       as arc time; air moves between seams are neglected).
//                       Lesson recall: W 5, L 3, T 0.5 → 5.5 min; one station
//                       5 + 3 = 8 min → 7.5 /h.
//   Level 2 (fixturing) the same cell with weld time and load time as controls,
//                       so it shows who waits for whom.
//   Level 3 (arcon)     the cost of a metre of weld (the lesson's faded example):
//                       an a5 fillet, 196 g/m, 5 kg/h → 2.4 min arc per metre.
//                       Paid minutes per metre = 2.4 / operating factor.
//                       Hand 30 % at €60/h = €1.00/min → €8.00/m.
//                       Robot cell at €90/h = €1.50/min: 70 % → €5.14/m,
//                       40 % → €9.00/m; break-even 2.4 × 1.50 / 8.00 = 45 %.
//                       Wire 0.196 / 0.95 = 0.206 kg × €2.50 = €0.52/m for both.
//                       The cell's cycle is stretched to W / operating factor,
//                       so the arc burns that share of the time on screen too.
//   Level 4 (weldsystem) EN 1090-2: EXC1 → ISO 3834-4, EXC2 → 3834-3,
//                       EXC3/EXC4 → 3834-2; weld quality level (ISO 5817) per
//                       EN 1090-2: EXC1 D, EXC2 C, EXC3 B, EXC4 B+. Welder
//                       certificates (ISO 9606-1) confirmed every 6 months:
//                       14 welders × 2 = 28 per year (recall 22 → 44).
const W0 = 6, L0 = 4, TURN = 0.3; // min
const ARC_M = 2.4; // min of arc per metre, a5 fillet
const HAND = { bf: 0.3, rate: 60 }, ROBOT = { rate: 90 };
const WIRE = { kg: 0.196, eff: 0.95, price: 2.5 };
const WELDERS = 14;
const BFS = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
const WELDS = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];
const LOADS = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];
const EXC = { 1: { part: 4, q: "D" }, 2: { part: 3, q: "C" }, 3: { part: 2, q: "B" }, 4: { part: 2, q: "B+" } };
const cycleOf = (w, l, t, stations) => (stations === 2 ? Math.max(w, l) + t : w + l);
const perMetre = (bf, rate) => (ARC_M / bf) * (rate / 60);
const wireCost = () => (WIRE.kg / WIRE.eff) * WIRE.price;
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(cycleOf(W0, L0, TURN, 1), 10, 1e-9, "weldcell example: one station 10 min");
  near(60 / cycleOf(W0, L0, TURN, 1), 6, 1e-9, "weldcell example: 6 frames per hour");
  near(cycleOf(W0, L0, TURN, 2), 6.3, 1e-9, "weldcell example: two stations 6.3 min");
  near(Math.round((60 / 6.3) * 10) / 10, 9.5, 1e-9, "weldcell example: 9.5 frames per hour");
  near(Math.round((60 / 6.3 / 6 - 1) * 100), 59, 1e-9, "weldcell example: 59 % more output");
  near(cycleOf(5, 3, 0.5, 2), 5.5, 1e-9, "weldcell recall: 5.5 min");
  near(60 / cycleOf(5, 3, 0.5, 1), 7.5, 1e-9, "weldcell recall: 7.5 per hour");
  near(cycleOf(4, 6, 0.3, 2), 6.3, 1e-9, "loading longer than welding: the robot waits");
  near(0.196 / 5 * 60, 2.352, 1e-9, "arcon: 196 g at 5 kg/h");
  near(perMetre(HAND.bf, HAND.rate), 8, 1e-9, "arcon: hand €8.00");
  near(Math.round(perMetre(0.7, ROBOT.rate) * 100) / 100, 5.14, 1e-9, "arcon: robot €5.14");
  near(perMetre(0.4, ROBOT.rate), 9, 1e-9, "arcon: robot at 40 % €9.00");
  near(ARC_M * (ROBOT.rate / 60) / perMetre(HAND.bf, HAND.rate), 0.45, 1e-9, "arcon: break-even 45 %");
  near(Math.round(wireCost() * 100) / 100, 0.52, 1e-9, "arcon: wire €0.52");
  near(Math.round((WIRE.kg / WIRE.eff) * 1000) / 1000, 0.206, 1e-9, "arcon: 0.206 kg wire");
  near(3 / 0.25, 12, 1e-9, "arcon recall: 12 min");
  near((0.3 / 0.9) * 3, 1, 1e-9, "arcon recall: €1.00");
  near(WELDERS * 2, 28, 1e-9, "weldsystem example: 28 confirmations");
  near(22 * 2, 44, 1e-9, "weldsystem recall: 44 confirmations");
  if (EXC[2].part !== 3 || EXC[3].part !== 2 || EXC[1].part !== 4) throw new Error("EXC → ISO 3834 mapping");
  if (!BFS.includes(70) || !BFS.includes(45) || !WELDS.includes(W0) || !LOADS.includes(L0)) throw new Error("control lists miss the lesson values");
}

// ---------------------------------------------------------------- the world
// World units are 10 mm, z up, +y toward the operator side (the front).
const WIDTH = 600;
const FLOOR = { x: -134, y: -92, w: 230, d: 184, r: 3 };
const FX = 88, FB = -84, FS = -35, FH = 124; // fence sides, back, side post, height
const TC = [0, 22]; // turntable centre; the front fence line runs through it
const TR = 48; // table radius
const TZ = 64; // table top
const PED = [0, -58];
const SH_Z = 58;
const LINK = [56, 52];
const TOOL = 18;
const HOME = [0, -30, 112];
const CUR_Y = TC[1] + TR + 10;
const LC = [-TR - 16, TR + 16];
const CAB = { x: -124, y: -62, w: 24, d: 30, r: 1 };
const CAB_H = 92;
const PS = { x: -80, y: -78, w: 22, d: 30, r: 1 };
const PS_H = 64;
const DRUM = [-40, -70];
const CLEAN = [42, -72];
const CART = { x: -116, y: 64, w: 38, d: 22, r: 1 };
// the welding fixture and the frame, in the station frame (u across, v < 0 away from the screen)
const FIXT = { u: [-30, 30], v: [-36, -4], h: 2 };
const BARS = [
  [-27, 27, -33, -29], [-27, 27, -11, -7], [-27, -23, -29, -11], [23, 27, -29, -11], [-2, 2, -29, -11],
];
const BAR_H = 4;
const JOINTS = [
  [[-27, -29], [-23, -29]], [[-2, -29], [2, -29]], [[23, -29], [27, -29]],
  [[23, -11], [27, -11]], [[-2, -11], [2, -11]], [[-27, -11], [-23, -11]],
];
const CLAMPS = [[-15, -36], [15, -36], [-15, -4], [15, -4]];
{
  for (const [u, v] of [[FIXT.u[0], FIXT.v[0]], [FIXT.u[1], FIXT.v[0]]]) if (Math.hypot(u, v) > TR - 1) throw new Error("fixture overhangs the table");
}

const FIT = [
  ...k.boxCorners(FLOOR, -3, 0),
  [-FX, FB, FH], [FX, FB, FH], [-FX, TC[1], FH], [FX, TC[1], FH],
  [CAB.x, CAB.y, CAB_H + 14],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 64);
const ELEVATION = Number(process.env.EL ?? 34);
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
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", layer = "back" } = {}) {
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
const card = (pts) => `<path class="wc-card" d="${k.pathOf(pts.map(at), true)}"/>`;
const slots = (pts) => `<path class="wc-slot" d="${pts.map((q) => k.pathOf(q.map(at), true)).join("")}"/>`;

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
// the operator's walkway in front of the loading side, taped on the floor
{
  const tape = { x: LC[0] + 4, y: CUR_Y + 5, w: LC[1] - LC[0] - 8, d: 2.4, r: 0.4 };
  const hatch = [];
  for (let x = tape.x + 3; x < tape.x + tape.w - 2; x += 6) hatch.push(k.lineOnTop([x, tape.y], [x + 2.2, tape.y + tape.d], 0.4, P));
  box("floor.walkway", tape, 0, 0.4, { tone: "mid", crease: "none" }, { steps: 2, flat: true, extra: L(hatch.join(""), { tone: "lo" }), layer: "floor" });
}
// cable ducts: controller → robot base, power source → robot base
box("floor.duct", { x: CAB.x + CAB.w, y: -47, w: PED[0] - 12.5 - (CAB.x + CAB.w), d: 6, r: 0.8 }, 0, 1.4, { tone: "mid" }, { steps: 2, inner: L(k.lineOnTop([CAB.x + CAB.w, -44], [PED[0] - 12.5, -44], 1.4, P), { tone: "faint" }), layer: "floor" });
box("floor.duct-ps", { x: PS.x + PS.w + 2, y: -58, w: PED[0] - 16.5 - (PS.x + PS.w + 2), d: 5, r: 0.8 }, 0, 1.2, { tone: "mid" }, { steps: 2, inner: L(k.lineOnTop([PS.x + PS.w + 2, -55.5], [PED[0] - 16.5, -55.5], 1.2, P), { tone: "faint" }), layer: "floor" });

// ---------------------------------------------------------------- the fence
const postsAt = [];
for (const x of [-FX, 0, FX]) postsAt.push([x, FB]);
for (const y of [FS, TC[1]]) for (const x of [-FX, FX]) postsAt.push([x, y]);
for (const [x, y] of postsAt) {
  const front = x === FX;
  const layer = front ? "front" : "back";
  const foot = plan(x, y, 9, 9, 0.6);
  box("fence.foot", foot, 0, 1, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(foot, 1.6).map(([px, py]) => at([px, py, 1])), { size: 0.35 }), layer });
  box("fence.post", plan(x, y, 4, 4, 0.4), 1, FH, { tone: "mid" }, { steps: 1, extra: Dt([at([x, y, FH])], { size: 0.4 }), layer });
}
function meshPanel(axis, fixed, u0, u1, z0, z1) {
  const point = (u, z) => (axis === "y" ? [u, fixed, z] : [fixed, u, z]);
  const frame = k.pathOf([point(u0, z0), point(u1, z0), point(u1, z1), point(u0, z1)].map(at), true);
  const inner = [];
  const n = Math.round((u1 - u0) / 9);
  for (let q = 1; q < n; q++) { const u = u0 + ((u1 - u0) * q) / n; inner.push(k.pathOf([at(point(u, z0)), at(point(u, z1))])); }
  const rows = Math.round((z1 - z0) / 9);
  for (let q = 1; q < rows; q++) { const z = z0 + ((z1 - z0) * q) / rows; inner.push(k.pathOf([at(point(u0, z)), at(point(u1, z))])); }
  return `<path class="wc-mesh" d="${frame}"/>` + L(inner.join(""), { tone: "faint" }) + L(frame, { tone: "lo" });
}
const MZ = [8, FH - 4];
const meshFar =
  meshPanel("y", FB, -FX + 2, -2, ...MZ) + meshPanel("y", FB, 2, FX - 2, ...MZ) +
  meshPanel("x", -FX, FB + 2, FS - 2, ...MZ) + meshPanel("x", -FX, FS + 2, TC[1] - 2, ...MZ);
const meshNear = meshPanel("x", FX, FB + 2, FS - 2, ...MZ) + meshPanel("x", FX, FS + 2, TC[1] - 2, ...MZ);
// short front returns from the side fences to the turntable: welding-curtain panels
function curtainPanel(x0, x1) {
  const y = TC[1];
  const frame = k.pathOf([[x0, y, MZ[0]], [x1, y, MZ[0]], [x1, y, 100], [x0, y, 100]].map(at), true);
  const pleats = [];
  for (let x = x0 + 4; x < x1 - 1; x += 4) pleats.push(k.pathOf([at([x, y, MZ[0]]), at([x, y, 100])]));
  return `<path class="wc-curtain" d="${frame}"/>` + L(pleats.join(""), { tone: "faint" }) + L(frame, { tone: "lo" });
}

// ---------------------------------------------------------------- the light curtain at the loading side
for (const x of LC) {
  const base = plan(x, CUR_Y, 8, 8, 0.6);
  box("curtain.base", base, 0, 2, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(base, 1.6).map(([px, py]) => at([px, py, 2])), { size: 0.35 }), layer: "front" });
  const face = x < 0 ? x + 2 : x - 2;
  const lenses = [];
  for (let z = 10; z <= 94; z += 4) lenses.push(at([face, CUR_Y, z]));
  box("curtain.column", plan(x, CUR_Y, 4, 4, 0.5), 2, 100, { tone: "hi", crease: "lo" }, {
    steps: 1,
    extra: Dt(lenses, { size: 0.28, tone: "lo" }) + Dt([at([x, CUR_Y, 100])], { size: 0.4 }),
    layer: "front",
  });
  post("curtain.cap", x, CUR_Y, 1.6, 100, 102, { tone: "mid" }, { steps: 14, layer: "front", extra: Dt([at([x, CUR_Y, 102])], { size: 0.35, tone: "hi" }) });
}
const beams = [];
for (let z = 12; z <= 92; z += 8) beams.push(k.segment([LC[0] + 2, CUR_Y, z], [LC[1] - 2, CUR_Y, z], P));
const beamSvg = `<g data-beams=""><path class="wc-beam" d="${beams.join("")}"/></g>`;

// ---------------------------------------------------------------- robot pedestal and base
{
  const [px, py] = PED;
  const bolts = Array.from({ length: 8 }, (_, q) => [px + 13.4 * Math.cos((q / 8) * Math.PI * 2 + 0.2), py + 13.4 * Math.sin((q / 8) * Math.PI * 2 + 0.2)]);
  post("robot.anchor-plate", px, py, 16, 0, 2, { tone: "lo" }, { steps: 48, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, 2])), { size: 0.45 }) });
  post("robot.pedestal", px, py, 10, 2, 26, { tone: "mid", crease: "none" }, { steps: 40, inner: L(k.sideArc(px, py, 10, 14, P, 28), { tone: "faint" }) });
  const top = Array.from({ length: 6 }, (_, q) => [px + 12 * Math.cos((q / 6) * Math.PI * 2), py + 12 * Math.sin((q / 6) * Math.PI * 2)]);
  post("robot.top-plate", px, py, 14, 26, 29, { tone: "mid" }, { steps: 48, bevel: 0.4, extra: Dt(top.map(([x, y]) => at([x, y, 29])), { size: 0.4 }) });
  post("robot.base", px, py, 12, 29, 38, { tone: "hi", crease: "lo" }, { steps: 44, inner: L(k.sideArc(px, py, 12, 33.5, P, 32), { tone: "faint" }) });
  post("robot.turret", px, py, 10, 38, 46, { tone: "hi", crease: "lo" }, { steps: 40 });
  box("robot.connector", { x: px - 15.5, y: py - 4, w: 4, d: 8, r: 0.6 }, 30, 36, { tone: "mid" }, { steps: 2, extra: Dt([at([px - 15.5, py, 33])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- the turntable positioner (static part)
{
  const [cx, cy] = TC;
  const base = plan(cx, cy, 40, 40, 1.2);
  box("pos.base", base, 0, 2.4, { tone: "lo" }, { steps: 2, bevel: 0.4, extra: Dt(k.corners(base, 3).map(([x, y]) => at([x, y, 2.4])), { size: 0.45 }) + L(k.corners(base, 3).map(([x, y]) => k.ring(x, y, 1.3, 2.4, P, 12)).join(""), { tone: "lo" }) });
  post("pos.column", cx, cy, 15, 2.4, 50, { tone: "mid", crease: "none" }, { steps: 48, inner: L(k.sideArc(cx, cy, 15, 10, P, 36) + k.sideArc(cx, cy, 15, 44, P, 36), { tone: "faint" }) });
  // the drive: a gear motor standing on the base, beside the column
  const mx = cx + 14, my = cy + 14;
  post("pos.motor", mx, my, 4.2, 2.4, 18, { tone: "mid", crease: "none" }, { steps: 28, inner: L(k.sideArc(mx, my, 4.2, 6, P, 20) + k.sideArc(mx, my, 4.2, 9, P, 20) + k.sideArc(mx, my, 4.2, 12, P, 20), { tone: "faint" }) });
  post("pos.motor-cap", mx, my, 3.4, 18, 19.4, { tone: "lo" }, { steps: 24 });
  box("pos.terminal", plan(mx, my, 4, 4, 0.4), 19.4, 22.4, { tone: "lo" }, { steps: 1, extra: Dt([at([mx, my, 22.4])], { size: 0.35 }) });
  // slewing bearing and the table
  const bolts = Array.from({ length: 16 }, (_, q) => [cx + 19 * Math.cos((q / 16) * Math.PI * 2), cy + 19 * Math.sin((q / 16) * Math.PI * 2)]);
  post("pos.bearing", cx, cy, 21, 50, 55, { tone: "lo" }, { steps: 56, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, 55])), { size: 0.35 }) });
  post("pos.table", cx, cy, TR, 55, TZ, { tone: "mid" }, {
    steps: 96,
    bevel: 0.5,
    inner: L(k.sideArc(cx, cy, TR, 58, P, 80), { tone: "faint" }),
    extra: L(k.ring(cx, cy, TR - 3.5, TZ, P, 90), { tone: "faint" }) + L(k.ring(cx, cy, 6, TZ, P, 30), { tone: "lo" }) + Dt([at([cx, cy, TZ])], { size: 0.5 }),
  });
}

// ---------------------------------------------------------------- power source and wire drum (back left, inside)
{
  const fy = PS.y + PS.d;
  const fx = PS.x + PS.w;
  box("ps.trolley", k.insetPlan(PS, -1.5), 3, 6, { tone: "lo" }, { steps: 2 });
  for (const [x, y] of k.corners(k.insetPlan(PS, 1), 0)) post("ps.wheel", x, y, 1.6, 0, 3, { tone: "lo" }, { steps: 14 });
  const grille = [];
  for (let z = 14; z <= 30; z += 3) grille.push([[PS.x + 4, fy, z], [PS.x + 18, fy, z], [PS.x + 18, fy, z + 1.2], [PS.x + 4, fy, z + 1.2]]);
  const display = [[PS.x + 4, fy, 52], [PS.x + 14, fy, 52], [PS.x + 14, fy, 58], [PS.x + 4, fy, 58]];
  box("ps.body", PS, 6, PS_H, { tone: "mid" }, {
    steps: 2,
    bevel: 0.6,
    inner: L(k.sideSeam(PS, PS_H - 6, P, 2), { tone: "faint" }),
    extra: slots(grille) + card(display) + Dt([[PS.x + 17, fy, 55], [PS.x + 17, fy, 46], [PS.x + 12, fy, 46], [PS.x + 7, fy, 46]].map(at), { size: 0.5 }) +
      Dt([[fx, PS.y + 8, 40], [fx, PS.y + 14, 40]].map(at), { size: 0.55 }),
  });
  box("ps.handle", { x: PS.x + 3, y: PS.y + 3, w: 2, d: PS.d - 6, r: 0.4 }, PS_H, PS_H + 4, { tone: "hi", crease: "lo" }, { steps: 1 });
  box("ps.handle-far", { x: PS.x + PS.w - 5, y: PS.y + 3, w: 2, d: PS.d - 6, r: 0.4 }, PS_H, PS_H + 4, { tone: "hi", crease: "lo" }, { steps: 1 });
}
{
  const [dx, dy] = DRUM;
  post("drum.pallet", dx, dy, 11.5, 0, 3, { tone: "lo" }, { steps: 40 });
  post("drum.body", dx, dy, 10, 3, 62, { tone: "mid", crease: "none" }, { steps: 48, inner: L(k.sideArc(dx, dy, 10, 20, P, 36) + k.sideArc(dx, dy, 10, 46, P, 36), { tone: "faint" }) });
  post("drum.lid", dx, dy, 10.6, 62, 64, { tone: "lo" }, { steps: 48, bevel: 0.3 });
  post("drum.cone", dx, dy, 3.6, 64, 71, { tone: "hi", crease: "lo" }, { steps: 24, extra: Dt([at([dx, dy, 71])], { size: 0.5 }) });
}

// ---------------------------------------------------------------- torch cleaning station (right of the robot)
{
  const [cx, cy] = CLEAN;
  const base = plan(cx, cy, 14, 14, 0.8);
  box("clean.base", base, 0, 1.6, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(base, 2).map(([x, y]) => at([x, y, 1.6])), { size: 0.4 }) });
  post("clean.column", cx, cy, 3.4, 1.6, 58, { tone: "mid", crease: "none" }, { steps: 24 });
  const head = plan(cx, cy, 16, 11, 0.8);
  const fy = head.y + head.d;
  box("clean.head", head, 58, 72, { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    inner: L(k.sideSeam(head, 64, P, 2), { tone: "faint" }),
    extra: card([[head.x + 2, fy, 66], [head.x + 8, fy, 66], [head.x + 8, fy, 70], [head.x + 2, fy, 70]]) + Dt([[head.x + 12, fy, 68], [head.x + 14, fy, 68]].map(at), { size: 0.45 }),
  });
  // reamer (spatter removal) with its clamp ring, the spray nozzle, the wire cutter
  post("clean.reamer", cx - 3, cy, 2.6, 72, 75, { tone: "hi", crease: "lo" }, { steps: 24, extra: L(k.ring(cx - 3, cy, 1.2, 75, P, 16), { tone: "lo" }) });
  post("clean.spray", cx + 4, cy - 2, 1.2, 72, 74, { tone: "lo" }, { steps: 14, extra: Dt([at([cx + 4, cy - 2, 74])], { size: 0.4 }) });
  box("clean.cutter", { x: cx + 2.5, y: cy + 1.4, w: 4, d: 2.6, r: 0.3 }, 72, 74.4, { tone: "lo" }, { steps: 1 });
}

// ---------------------------------------------------------------- fume extraction (back right)
{
  const dx = 70, dy = -78;
  post("fume.duct", dx, dy, 5, 0, 108, { tone: "mid", crease: "none" }, { steps: 32, inner: L(k.sideArc(dx, dy, 5, 40, P, 24) + k.sideArc(dx, dy, 5, 90, P, 24), { tone: "faint" }) });
  const hood = { x: dx - 16, y: dy - 4, w: 32, d: 26, r: 1.4 };
  const vanes = [];
  for (let x = hood.x + 5; x < hood.x + hood.w - 4; x += 4) vanes.push(k.lineOnTop([x, hood.y + 2.5], [x, hood.y + hood.d - 2.5], 118, P));
  vanes.push(k.planOutline({ x: hood.x + 2.5, y: hood.y + 2.5, w: hood.w - 5, d: hood.d - 5, r: 0 }, 118, P, 1));
  box("fume.hood", hood, 108, 118, { tone: "mid" }, { steps: 2, bevel: 0.5, inner: L(vanes.join(""), { tone: "faint" }) + L(k.sideSeam(hood, 112, P, 2), { tone: "faint" }) });
}

// ---------------------------------------------------------------- the controller outside the fence (left)
{
  const fy = CAB.y + CAB.d;
  const vents = [];
  for (const z of [8, 11, 14]) vents.push([[CAB.x + 6, fy, z], [CAB.x + 18, fy, z], [CAB.x + 18, fy, z + 1.2], [CAB.x + 6, fy, z + 1.2]]);
  const door = k.pathOf([[CAB.x + 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, CAB_H - 2], [CAB.x + 1.6, fy, CAB_H - 2]].map(at), true);
  const label = [[CAB.x + 4, fy, 72], [CAB.x + 14, fy, 72], [CAB.x + 14, fy, 78], [CAB.x + 4, fy, 78]];
  box("ctrl.body", CAB, 0, CAB_H, { tone: "mid" }, {
    steps: 2,
    bevel: 0.5,
    inner: L(door, { tone: "lo" }) + L(k.sideSeam(CAB, CAB_H - 8, P, 2), { tone: "faint" }),
    extra: slots(vents) + card(label) + L([76, 74].map((z, i) => k.segment([CAB.x + 5, fy, z], [CAB.x + [12, 10][i], fy, z], P)).join(""), { tone: "lo", free: true }) + Dt([[CAB.x + 3, fy, 5], [CAB.x + 3, fy, CAB_H - 4]].map(at), { size: 0.4 }),
  });
  discAt("ctrl.switch", frameY([CAB.x + CAB.w - 5, fy, 56]), 0, 1.2, 3, { tone: "lo" }, { steps: 24 });
  discAt("ctrl.knob", frameY([CAB.x + CAB.w - 5, fy, 56]), 1.2, 3, 1.6, { tone: "hi", crease: "none" }, { steps: 20 });
  // the certificate plate (level 4): EXC class and ISO 3834 part
  box("ctrl.cert", { x: CAB.x + 3, y: fy, w: 12, d: 0.6, r: 0.2 }, 36, 46, { tone: "lo" }, { steps: 1, attrs: ' data-cert=""', extra: L([43, 40.5].map((z, i) => k.segment([CAB.x + 5, fy + 0.6, z], [CAB.x + [13, 11][i], fy + 0.6, z], P)).join(""), { tone: "lo", free: true }) });
  // the teach pendant on a hook on the right side
  const sx = CAB.x + CAB.w;
  box("ctrl.hook", { x: sx, y: CAB.y + 12, w: 1.6, d: 6, r: 0.3 }, 62, 64, { tone: "lo" }, { steps: 1 });
  box("pendant.body", { x: sx + 1.6, y: CAB.y + 9, w: 2.4, d: 12, r: 0.8 }, 44, 62, { tone: "hi", crease: "lo" }, {
    steps: 2,
    extra:
      card([[sx + 4, CAB.y + 11, 59], [sx + 4, CAB.y + 19, 59], [sx + 4, CAB.y + 19, 52], [sx + 4, CAB.y + 11, 52]]) +
      Dt([[sx + 4, CAB.y + 12, 48], [sx + 4, CAB.y + 15, 48], [sx + 4, CAB.y + 18, 48]].map(at), { size: 0.45 }),
  });
  post("pendant.estop", sx + 2.8, CAB.y + 18, 1.1, 62, 63.6, { tone: "lo" }, { steps: 16, extra: Dt([at([sx + 2.8, CAB.y + 18, 63.6])], { size: 0.45, tone: "hi" }) });
  // stack light on top: the upper lamp is lit while the arc burns
  const tx = CAB.x + 6, ty = CAB.y + 6;
  post("ctrl.stack-base", tx, ty, 2.6, CAB_H, CAB_H + 2, { tone: "mid" }, { steps: 18 });
  ["ready", "arc"].forEach((name, q) => post(`ctrl.stack-${name}`, tx, ty, 2.1, CAB_H + 2 + q * 4.4, CAB_H + 6 + q * 4.4, { tone: "mid", crease: "lo" }, { steps: 18, attrs: ` data-stack="${name}"` }));
  post("ctrl.stack-ring", tx, ty, 2.3, CAB_H + 6, CAB_H + 6.4, { tone: "lo", crease: "none" }, { steps: 18 });
  post("ctrl.stack-cap", tx, ty, 2.3, CAB_H + 10.4, CAB_H + 11.6, { tone: "mid" }, { steps: 18, extra: Dt([at([tx, ty, CAB_H + 11.6])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- the parts cart at the loading side (front left)
{
  for (const [x, y] of k.corners(k.insetPlan(CART, 2.5), 0)) post("cart.wheel", x, y, 1.8, 0, 3.6, { tone: "lo" }, { steps: 14 });
  box("cart.deck", CART, 3.6, 6, { tone: "mid" }, { steps: 2, bevel: 0.3 });
  for (const x of [CART.x + 1, CART.x + CART.w - 3]) box("cart.upright", { x, y: CART.y + 1, w: 2, d: CART.d - 2, r: 0.3 }, 6, 22, { tone: "mid" }, { steps: 1 });
  box("cart.handle", { x: CART.x - 4, y: CART.y + 4, w: 4, d: 2, r: 0.3 }, 6, 30, { tone: "hi", crease: "lo" }, { steps: 1 });
  // a stack of cut tubes waiting to be loaded: square ends toward the viewer
  for (let row = 0; row < 3; row++) {
    for (let q = 0; q < 4 - row; q++) {
      const y0 = CART.y + 3 + q * 4.2 + row * 2.1;
      const z0 = 6 + row * 4;
      box("cart.tube", { x: CART.x + 3.5, y: y0, w: CART.w - 7, d: 4, r: 0.3 }, z0, z0 + 4, { tone: "mid", crease: "lo" }, { steps: 1, extra: L(k.segment([CART.x + CART.w - 3.5, y0 + 1, z0 + 1], [CART.x + CART.w - 3.5, y0 + 3, z0 + 1], P) + k.segment([CART.x + CART.w - 3.5, y0 + 3, z0 + 1], [CART.x + CART.w - 3.5, y0 + 3, z0 + 3], P) + k.segment([CART.x + CART.w - 3.5, y0 + 3, z0 + 3], [CART.x + CART.w - 3.5, y0 + 1, z0 + 3], P) + k.segment([CART.x + CART.w - 3.5, y0 + 1, z0 + 3], [CART.x + CART.w - 3.5, y0 + 1, z0 + 1], P), { tone: "lo" }), layer: "front" });
    }
  }
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
if (process.env.ORDER) console.log(R.items.slice().sort((a, b) => a.key - b.key).map((i, n) => n + " " + i.layer + " " + i.name).join("\n"));
const body = [
  halo,
  ...layerOf("floor"),
  `<g data-name="fence.mesh-far">${meshFar}</g>`,
  `<g data-name="fence.front-left">${curtainPanel(-FX + 2, -TR - 2)}</g>`,
  ...layerOf("back"),
  `<g data-live-far=""></g>`,
  `<g data-arm=""></g>`,
  `<g data-live-screen=""></g>`,
  `<g data-live-near=""></g>`,
  `<g data-arc=""></g>`,
  `<g data-name="fence.front-right">${curtainPanel(TR + 2, FX - 2)}</g>`,
  `<g data-name="fence.mesh-near">${meshNear}</g>`,
  ...layerOf("front"),
  beamSvg,
  `<g data-mark=""></g>`,
];

const LABEL_NL =
  "Een lasrobotcel schuin van boven gezien. Achterin staat een zesassige lasrobot op een sokkel, met een MAG-toorts op de pols en een draadaanvoerapparaat op de arm. Ervoor staat een draaitafel met twee stations: een lasscherm deelt de tafel in tweeën, op elke helft ligt een lasmal met een frame van buizen. De robot last het frame aan zijn kant terwijl de operator aan de voorkant het andere station leegmaakt en laadt; daarna draait de tafel een halve slag. Een lichtscherm bewaakt de laadkant. Verder in de cel: de stroombron, een draadvat, een toortsreiniging en een afzuigkap. Buiten het hek staan de robotbesturing met een teach pendant en een kar met buizen.";
const LABEL_EN =
  "A robot welding cell seen at an angle from above. At the back a six-axis welding robot stands on a pedestal, with a MAG torch on its wrist and a wire feeder on its arm. In front of it is a two-station turntable: a welding screen divides the table in two, and each half holds a welding fixture with a frame of tubes. The robot welds the frame on its side while the operator at the front unloads and loads the other station; then the table turns half a turn. A light curtain guards the loading side. Also in the cell: the power source, a wire drum, a torch cleaning station and a fume hood. Outside the fence stand the robot controller with a teach pendant and a cart of tubes.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "robot", live: "elbow" },
  { key: "torch", live: "tcp" },
  { key: "feeder", live: "feeder" },
  { key: "pedestal", at: [PED[0], PED[1] + 10, 16] },
  { key: "table", at: [TC[0] + TR, TC[1], 60] },
  { key: "fixture", live: "fixture" },
  { key: "screen", live: "screen" },
  { key: "clean", at: [CLEAN[0], CLEAN[1], 70] },
  { key: "fume", at: [70, -66, 116] },
  { key: "ps", at: [PS.x + PS.w / 2, PS.y + PS.d, 40] },
  { key: "drum", at: [DRUM[0], DRUM[1] + 10, 40] },
  { key: "curtain", at: [LC[0], CUR_Y, 70] },
  { key: "fence", at: [-FX, -60, 90] },
  { key: "ctrl", at: [CAB.x + CAB.w / 2, CAB.y + CAB.d, 30] },
  { key: "pendant", at: [CAB.x + CAB.w + 4, CAB.y + 15, 55] },
  { key: "cart", at: [CART.x + CART.w / 2, CART.y + CART.d, 14] },
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
  --wc-hair:rgba(240,233,218,.12);--wc-accent:#5C9FAE;--wc-hole:#071A1E;--wc-mesh:rgba(92,159,174,.05);--wc-curtain:rgba(92,159,174,.10);
  --wc-arm:#173339;--wc-arm-top:#1F4048;--wc-arm-dark:#0F262B;
  --wc-bead:#9FB3A6;--wc-hot:#BFE3EA;--wc-core:#F4FBFC;--wc-glow:#5C9FAE;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --wc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --wc-hair:rgba(11,41,27,.14);--wc-accent:#276F81;--wc-hole:#D5CCB6;--wc-mesh:rgba(39,111,129,.04);--wc-curtain:rgba(39,111,129,.08);
  --wc-arm:#FDFBF6;--wc-arm-top:#FFFFFF;--wc-arm-dark:#E6DFCD;
  --wc-bead:#5A6B60;--wc-hot:#276F81;--wc-core:#FFFFFF;--wc-glow:#276F81;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--wc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:4;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--wc-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--rows:2}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--wc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.wc-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wc-acc{color:var(--wc-accent);font-weight:600}
.wc-strong{color:var(--anatomy-strong);font-weight:600}
.wc-mute{color:var(--anatomy-muted)}
.wc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.wc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.wc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.wc-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.wc-row{display:flex;gap:4px;height:44px;align-items:center}
.wc-row[hidden]{display:none}
.wc-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--wc-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--wc-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.wc-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.wc-btn:disabled{opacity:.4;cursor:default}
.wc-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--wc-accent);color:var(--wc-accent);font-weight:600}
.wc-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.wc-val{flex:1 1 auto;min-width:0;display:flex;align-items:center;justify-content:center;gap:6px;font:400 12px/1 var(--wc-sans);color:var(--anatomy-muted);white-space:nowrap;overflow:hidden}
.wc-val b{font:600 13px/1 var(--anatomy-mono);color:var(--wc-accent)}
.wc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.wc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wc-slot{fill:var(--wc-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wc-mesh{fill:var(--wc-mesh);stroke:none}
.wc-curtain{fill:var(--wc-curtain);stroke:none}
.wc-beam{fill:none;stroke:var(--anatomy-faint);stroke-width:var(--anatomy-weight)}
[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill,[data-cert] .iso-top,[data-cert] .iso-shade,[data-cert] .iso-fill{transition:fill .2s}
[data-stack][data-on] .iso-top,[data-stack][data-on] .iso-shade,[data-stack][data-on] .iso-fill{fill:var(--wc-accent)}
html[data-level="4"] [data-cert] .iso-top,html[data-level="4"] [data-cert] .iso-shade,html[data-level="4"] [data-cert] .iso-fill{fill:var(--anatomy-lit-top)}
.iso-svg path.wc-cap{vector-effect:none;fill:none;stroke-linecap:round;stroke-linejoin:round}
.iso-svg path.wc-cyl{vector-effect:none;fill:none;stroke-linecap:butt}
.wc-cap[data-k="o"],.wc-cyl[data-k="o"]{stroke:var(--anatomy-hi)}
.wc-cap[data-k="f"],.wc-cyl[data-k="f"]{stroke:var(--wc-arm)}
.wc-cap[data-k="t"]{stroke:var(--wc-arm-top)}
.wc-cap[data-k="m"]{stroke:var(--anatomy-face)}
.wc-cap[data-k="hose"]{stroke:var(--wc-arm-dark)}
.wc-end{fill:var(--wc-arm-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wc-end-in{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-svg path.wc-wire{fill:none;stroke:var(--anatomy-hi);stroke-width:.8px;stroke-linecap:round;vector-effect:none}
.iso-svg path.wc-bead{fill:none;stroke-linecap:round;vector-effect:none}
.wc-bead[data-k="cold"]{stroke:var(--wc-bead)}
.wc-bead[data-k="hot"]{stroke:var(--wc-hot)}
.wc-glow-stop0{stop-color:var(--wc-glow);stop-opacity:.55}
.wc-glow-stop1{stop-color:var(--wc-glow);stop-opacity:0}
.iso-svg circle.wc-core{fill:var(--wc-core);stroke:var(--wc-glow);stroke-width:.6px}
.iso-svg circle.wc-spark{fill:var(--wc-hot);stroke:none}
.wc-mark{fill:none;stroke:var(--wc-accent);stroke-width:1.4px}
.wc-mark-dot{fill:var(--wc-accent);stroke:none}
@media (prefers-reduced-motion:reduce){[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill,[data-cert] .iso-top,[data-cert] .iso-shade,[data-cert] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const TC = ${JSON.stringify(TC)}, TR = ${TR}, TZ = ${TZ};
const PED = ${JSON.stringify(PED)}, SH_Z = ${SH_Z}, LINK = ${JSON.stringify(LINK)}, TOOL = ${TOOL}, HOME = ${JSON.stringify(HOME)};
const FIXT = ${JSON.stringify(FIXT)}, BARS = ${JSON.stringify(BARS)}, BAR_H = ${BAR_H}, JOINTS = ${JSON.stringify(JOINTS)}, CLAMPS = ${JSON.stringify(CLAMPS)};
const W0 = ${W0}, L0 = ${L0}, TURN = ${TURN}, ARC_M = ${ARC_M};
const HAND = ${JSON.stringify(HAND)}, ROBOT = ${JSON.stringify(ROBOT)}, WIRE = ${JSON.stringify(WIRE)}, WELDERS = ${WELDERS};
const BFS = ${JSON.stringify(BFS)}, WELDS = ${JSON.stringify(WELDS)}, LOADS = ${JSON.stringify(LOADS)}, EXC = ${JSON.stringify(EXC)};
const PARTS = ${JSON.stringify(PARTS)};
const cycleOf = ${cycleOf.toString()};
const perMetre = ${perMetre.toString()};
const wireCost = ${wireCost.toString()};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", st1: "1 station", st2: "2 stations", weld: "weld", load: "load", turn: "turn", min: "min", perFrame: "per frame", perH: "frames/h", ph: "/h",
      arcOn: "arc on", ofCycle: "of the cycle", more: "more output with the same robot", loadsWhile: "operator loads 4 min while it welds", robotWaits: "robot waits", forLoad: "min for the loading", onOp: "min for the operator",
      cycle: "cycle", sep: ", ", opDone: "operator done after", opWaits: "waits", same: "loading and welding take as long", one: "1 station",
      arcTime: "arc time 2.4 min/m · a5 fillet, 196 g/m at 5 kg/h", hand: "hand", robot: "robot", wire: "wire", both: "for both", even: "break-even 45 %", cheaper: "robot cheaper", dearer: "robot dearer", equal: "as dear", perM: "/m",
      part: { 2: "comprehensive", 3: "standard", 4: "elementary" }, qual: "quality level", ndtMore: "more NDT", coordHi: "thick or strong steel: IWE-level coordinator", coordLo: "coordinator level by steel grade and thickness",
      confirm: "welders × 2 =", confirmTail: "confirmations/year", tapPart: "tap a part to name it",
      parts: { robot: ["Six-axis robot", "follows a program of points, with settings per weld"], torch: ["MAG torch", "on the wrist; wire and gas come out of the nozzle"], feeder: ["Wire feeder", "pushes the wire from the drum to the torch"], pedestal: ["Pedestal", "bolted to the floor"], table: ["Positioner · turntable", "turns half a turn in 0.3 min"], fixture: ["Welding fixture", "stops and clamps hold every tube in place"], screen: ["Welding screen", "divides the stations; keeps the arc light in"], clean: ["Torch cleaning station", "clears spatter, sprays anti-spatter, cuts the wire"], fume: ["Fume extraction", "takes the welding fumes away"], ps: ["Power source", "delivers the welding current"], drum: ["Wire drum", "hundreds of kilos of wire"], curtain: ["Light curtain", "breaks a beam → motion on that side stops"], fence: ["Fence", "door open is robot still"], ctrl: ["Controller", "computer and drives of the robot"], pendant: ["Teach pendant", "teach points and weld settings"], cart: ["Parts cart", "cut tubes ready to load"] } }
  : { dec: ",", st1: "1 station", st2: "2 stations", weld: "lassen", load: "laden", turn: "draaien", min: "min", perFrame: "per frame", perH: "frames/uur", ph: "/uur",
      arcOn: "boog aan", ofCycle: "van de cyclus", more: "output met dezelfde robot", loadsWhile: "operator laadt 4 min tijdens het lassen", robotWaits: "robot wacht", forLoad: "min op het laden", onOp: "min op de operator",
      cycle: "cyclus", sep: "; ", opDone: "operator klaar na", opWaits: "wacht", same: "laden en lassen duren even lang", one: "1 station",
      arcTime: "boogtijd 2,4 min/m · a5-hoeklas, 196 g/m bij 5 kg/u", hand: "hand", robot: "robot", wire: "draad", both: "voor beide", even: "omslag 45 %", cheaper: "robot goedkoper", dearer: "robot duurder", equal: "even duur", perM: "/m",
      part: { 2: "uitgebreid", 3: "standaard", 4: "elementair" }, qual: "kwaliteitsniveau", ndtMore: "meer NDO", coordHi: "dik of sterk staal: coördinator op IWE-niveau", coordLo: "niveau coördinator naar staalsoort en dikte",
      confirm: "lassers × 2 =", confirmTail: "bevestigingen/jaar", tapPart: "tik een onderdeel voor de naam",
      parts: { robot: ["Zesassige robot", "volgt een programma van punten, met instellingen per las"], torch: ["MAG-toorts", "op de pols; draad en gas komen uit het mondstuk"], feeder: ["Draadaanvoerapparaat", "duwt de draad van het vat naar de toorts"], pedestal: ["Sokkel", "vastgeschroefd aan de vloer"], table: ["Positioner · draaitafel", "draait een halve slag in 0,3 min"], fixture: ["Lasmal", "aanslagen en klemmen houden elke buis op zijn plek"], screen: ["Lasscherm", "scheidt de stations; houdt het booglicht binnen"], clean: ["Toortsreiniging", "spatten ruimen, anti-spat spuiten, draad knippen"], fume: ["Afzuiging", "haalt de lasrook weg"], ps: ["Stroombron", "levert de lasstroom"], drum: ["Draadvat", "honderden kilo’s draad"], curtain: ["Lichtscherm", "straal onderbroken → beweging aan die kant stopt"], fence: ["Hek", "deur open is robot stil"], ctrl: ["Besturing", "computer en aandrijvingen van de robot"], pendant: ["Teach pendant", "punten en lasinstellingen inleren"], cart: ["Kar met buizen", "gezaagde buizen klaar om te laden"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const eur = (v) => "€ " + fmt(v, 2);

const stage = document.querySelector(".wc-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { arm: q("[data-arm]"), far: q("[data-live-far]"), near: q("[data-live-near]"), screen: q("[data-live-screen]"), arc: q("[data-arc]"), mark: q("[data-mark]"), stack: { ready: q('[data-stack="ready"]'), arc: q('[data-stack="arc"]') } };
const lines = [...document.querySelectorAll("[data-readout] .wc-line")];
const announcer = document.querySelector(".wc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => t * t * (3 - 2 * t);
const NS = "http://www.w3.org/2000/svg";
const VIEW = towardViewer(P);
const at = (p) => iso(p, P);
const f2 = (v) => v.toFixed(2);
const pathPts = (pts, close) => "M" + pts.map((p) => f2(p[0]) + " " + f2(p[1])).join("L") + (close ? "Z" : "");
const SEC = 1.3; // seconds on screen per minute in the cell

// ------------------------------------------------ state and the cycle
const st = { stations: 2, W: W0, L: L0, bf: 70, exc: 2 };
const nowW = () => (LVL === 2 ? st.W : W0);
const nowL = () => (LVL === 2 ? st.L : L0);
const nowStations = () => (LVL === 1 ? st.stations : 2);
function phases() {
  const W = nowW(), L = nowL();
  if (nowStations() === 1) return [["weld", W], ["load", L]];
  const out = [["weld", W]];
  if (L > W) out.push(["wait", L - W]);
  out.push(["turn", TURN]);
  if (LVL === 3) { const extra = W / (st.bf / 100) - (Math.max(W, L) + TURN); if (extra > 1e-9) out.push(["idle", extra]); }
  return out;
}
let PH = phases();
let clock = 0; // minutes

// ------------------------------------------------ the arm: inverse kinematics (as in the robot cell figure)
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const nrm = (a) => mul(a, 1 / (len(a) || 1));
const SHOULDER = [PED[0], PED[1], SH_Z];
function poseOf(tcp) {
  const wrist = add(tcp, [0, 0, TOOL]);
  const yaw = Math.atan2(wrist[1] - PED[1], wrist[0] - PED[0]);
  const u = [Math.cos(yaw), Math.sin(yaw), 0];
  const s = add(SHOULDER, mul(u, 6));
  const d = sub(wrist, s);
  let D = len(d);
  const maxD = LINK[0] + LINK[1] - 0.1;
  if (D > maxD) D = maxD;
  const a = (LINK[0] * LINK[0] - LINK[1] * LINK[1] + D * D) / (2 * D);
  const h = Math.sqrt(Math.max(0, LINK[0] * LINK[0] - a * a));
  const dn = nrm(d);
  const up = nrm(sub([0, 0, 1], mul(dn, dn[2])));
  const elbow = add(add(s, mul(dn, a)), mul(up, h));
  return { yaw, u, n: [-Math.sin(yaw), Math.cos(yaw), 0], s, elbow, wrist, tcp };
}
const cylOf = (p) => ({ th: Math.atan2(p[1] - PED[1], p[0] - PED[0]), r: Math.hypot(p[0] - PED[0], p[1] - PED[1]), z: p[2] });
const fromCyl = (c) => [PED[0] + c.r * Math.cos(c.th), PED[1] + c.r * Math.sin(c.th), c.z];
function lerpCyl(a, b, t) { const A = cylOf(a), B = cylOf(b); let dth = B.th - A.th; if (dth > Math.PI) dth -= 2 * Math.PI; if (dth < -Math.PI) dth += 2 * Math.PI; return fromCyl({ th: A.th + dth * t, r: A.r + (B.r - A.r) * t, z: A.z + (B.z - A.z) * t }); }
const lerp = (a, b, t) => add(a, mul(sub(b, a), t));

// station frame → world: u across, v < 0 away from the screen, the station turned by phi
const ZTOP = TZ + FIXT.h + BAR_H;
const toWorld = (u, v, z, phi) => [TC[0] + u * Math.cos(phi) - v * Math.sin(phi), TC[1] + u * Math.sin(phi) + v * Math.cos(phi), z];
const jointPts = (j, phi) => [toWorld(JOINTS[j][0][0], JOINTS[j][0][1], ZTOP + 0.4, phi), toWorld(JOINTS[j][1][0], JOINTS[j][1][1], ZTOP + 0.4, phi)];

// the whole cell at time t (minutes)
function sample(t) {
  const C = PH.reduce((s, p) => s + p[1], 0);
  const n = Math.floor(t / C), tc = t - n * C;
  const two = nowStations() === 2;
  const W = nowW(), L = nowL();
  let acc = 0, ph = PH[PH.length - 1][0], pf = 1;
  for (const [kind, dur] of PH) { if (tc < acc + dur) { ph = kind; pf = dur > 0 ? (tc - acc) / dur : 1; break; } acc += dur; }
  const robotSide = two ? n % 2 : 0;
  const theta = two ? n * Math.PI + (ph === "turn" ? ease(pf) * Math.PI : 0) : 0;
  const phiR = theta + robotSide * Math.PI;
  // robot: six seams, a short air move to each and the arc along it
  const wp = ph === "weld" ? pf : 1;
  let tcp = HOME, arc = false, seam = -1;
  const SL = 6;
  if (ph === "weld") {
    const kk = Math.min(SL - 1, Math.floor(wp * SL)), f = wp * SL - kk;
    const [a, b] = jointPts(kk, phiR);
    const prev = kk === 0 ? HOME : jointPts(kk - 1, phiR)[1];
    if (f < 0.2) { const g = ease(f / 0.2); tcp = lerpCyl(prev, a, g); tcp = add(tcp, [0, 0, Math.sin(g * Math.PI) * (kk === 0 ? 0 : 6)]); }
    else { tcp = lerp(a, b, (f - 0.2) / 0.8); arc = true; seam = kk; }
  } else {
    const ret = Math.min(0.5, C - W), te = tc - W;
    tcp = lerpCyl(jointPts(SL - 1, phiR)[1], HOME, ease(clamp(te / ret, 0, 1)));
  }
  // stations
  const welded = () => JOINTS.map(() => ({ p: 1, heat: 0 }));
  function loading(lp) {
    if (lp < 0.15) return { bars: 5, clamps: false, beads: welded() };
    if (lp < 0.2) return { bars: 0, clamps: false, beads: [] };
    if (lp < 0.8) return { bars: Math.min(5, Math.ceil(((lp - 0.2) / 0.6) * 5)), clamps: false, beads: [] };
    return { bars: 5, clamps: lp >= 0.9, beads: [] };
  }
  function welding() {
    const tw = wp * W;
    const beads = JOINTS.map((_, j) => {
      const p = clamp((wp * SL - j - 0.2) / 0.8, 0, 1);
      const tDone = (W * (j + 1)) / SL;
      const heat = p <= 0 ? 0 : tw < tDone ? 1 : Math.exp(-(tc - tDone) / 0.9);
      return { p, heat };
    });
    return { bars: 5, clamps: true, beads };
  }
  const stations = [0, 1].map((s) => {
    const phi = theta + s * Math.PI;
    let state;
    if (two) state = s === robotSide ? welding() : loading(clamp(tc / L, 0, 1));
    else if (s === 0) state = tc < W ? welding() : loading(clamp((tc - W) / L, 0, 1));
    else state = { bars: 0, clamps: false, beads: [], idle: true };
    return { ...state, phi };
  });
  return { C, n, tc, ph, pf, theta, tcp, arc, seam, stations, robotSide };
}

// ------------------------------------------------ live solids on the turntable
function liveBox(u0, u1, v0, v1, z0, z1, phi, tone) {
  const pts = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => toWorld(u, v, 0, phi).slice(0, 2));
  return solidSvg(extrude(pts, z0, z1 - z0, P), { tone });
}
const hdepth = (u, v, phi) => { const w = toWorld(u, v, 0, phi); return w[0] * VIEW[0] + w[1] * VIEW[1]; };
function stationSvg(s) {
  const { phi } = s;
  const z0 = TZ, z1 = TZ + FIXT.h;
  let out = liveBox(FIXT.u[0], FIXT.u[1], FIXT.v[0], FIXT.v[1], z0, z1, phi, "lo");
  out += liveBox(-30, -28, -32, -30, z1, z1 + 3, phi, "mid") + liveBox(-30, -28, -10, -8, z1, z1 + 3, phi, "mid");
  const items = [];
  for (let b = 0; b < s.bars; b++) {
    const [u0, u1, v0, v1] = BARS[b];
    items.push({ d: hdepth((u0 + u1) / 2, (v0 + v1) / 2, phi), svg: liveBox(u0, u1, v0, v1, z1, z1 + BAR_H, phi, "hi") });
  }
  items.sort((a, b) => a.d - b.d);
  out += items.map((i) => i.svg).join("");
  const cl = CLAMPS.map(([cu, cv]) => {
    const dir = cv < -20 ? 1 : -1;
    const v0 = cv, v1 = cv + dir * 2;
    let g = liveBox(cu - 1.5, cu + 1.5, Math.min(v0, v1), Math.max(v0, v1), z1, z1 + 6, phi, "mid");
    if (s.clamps) {
      const a0 = cv + dir * 1, a1 = cv + dir * 6.5;
      const tip = cv + dir * 5.6;
      g += liveBox(cu - 0.7, cu + 0.7, tip - 0.7, tip + 0.7, z1 + BAR_H, z1 + 6, phi, "lo");
      g += liveBox(cu - 1, cu + 1, Math.min(a0, a1), Math.max(a0, a1), z1 + 6, z1 + 7.4, phi, "mid");
    } else {
      const a0 = cv + dir * 0.3, a1 = cv + dir * 1.7;
      g += liveBox(cu - 1, cu + 1, Math.min(a0, a1), Math.max(a0, a1), z1 + 6, z1 + 12, phi, "mid");
    }
    return { d: hdepth(cu, cv, phi), svg: g };
  });
  cl.sort((a, b) => a.d - b.d);
  out += cl.map((i) => i.svg).join("");
  // weld beads on the joints
  s.beads.forEach((bd, j) => {
    if (bd.p <= 0) return;
    const [a, b] = jointPts(j, phi);
    const e = lerp(a, b, bd.p);
    const d = pathPts([at(a), at(e)]);
    out += '<path class="wc-bead" data-k="cold" stroke-width="' + f2(1.5 * KS) + '" d="' + d + '"/>';
    if (bd.heat > 0.02) out += '<path class="wc-bead" data-k="hot" stroke-opacity="' + f2(bd.heat) + '" stroke-width="' + f2(1.5 * KS) + '" d="' + d + '"/>';
  });
  return out;
}
function screenSvg(theta) {
  const zt = TZ + 54;
  const posts = [-1, 1].map((sg) => ({ d: hdepth(sg * (TR - 3), 0, theta), svg: liveBox(sg * (TR - 3) - 1, sg * (TR - 3) + 1, -1, 1, TZ, zt, theta, "mid") }));
  posts.sort((a, b) => a.d - b.d);
  const cu = TR - 4;
  const C = (u, z) => at(toWorld(u, 0, z, theta));
  const panel = pathPts([C(-cu, TZ), C(cu, TZ), C(cu, zt - 2), C(-cu, zt - 2)], true);
  const pleats = [];
  for (let u = -cu + 5; u < cu - 1; u += 5) pleats.push(pathPts([C(u, TZ), C(u, zt - 2)]));
  return posts[0].svg + '<path class="wc-curtain" d="' + panel + '"/><path class="iso-line" data-tone="faint" d="' + pleats.join("") + '"/><path class="iso-line" data-tone="lo" d="' + panel + '"/>' +
    posts[1].svg + liveBox(-(TR - 2), TR - 2, -1.2, 1.2, zt - 2, zt + 1, theta, "mid");
}

// ------------------------------------------------ the arm
function mk(tag, cls, kind) { const nd = document.createElementNS(NS, tag); nd.setAttribute("class", cls); if (kind) nd.dataset.k = kind; el.arm.appendChild(nd); return nd; }
const SEG = (a, b) => { const p = at(a), q2 = at(b); return "M" + f2(p[0]) + " " + f2(p[1]) + "L" + f2(q2[0]) + " " + f2(q2[1]); };
function ringPts(c, axis, r, nPts) {
  let e1 = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const dd = e1[0] * axis[0] + e1[1] * axis[1] + e1[2] * axis[2];
  e1 = nrm(sub(e1, mul(axis, dd)));
  const e2 = [axis[1] * e1[2] - axis[2] * e1[1], axis[2] * e1[0] - axis[0] * e1[2], axis[0] * e1[1] - axis[1] * e1[0]];
  const out = [];
  for (let i = 0; i < nPts; i++) { const t = (i / nPts) * Math.PI * 2; out.push(at(add(c, add(mul(e1, r * Math.cos(t)), mul(e2, r * Math.sin(t)))))); }
  return out;
}
function Cyl() { return { back: mk("path", "wc-end"), o: mk("path", "wc-cyl", "o"), f: mk("path", "wc-cyl", "f"), front: mk("path", "wc-end"), hub: mk("path", "wc-end-in") }; }
function drawCyl(c, a, b, axis, r, hubR) {
  const facing = axis[0] * VIEW[0] + axis[1] * VIEW[1] + axis[2] * 0.6;
  const nearEnd = facing >= 0 ? b : a, farEnd = facing >= 0 ? a : b;
  const w = 2 * r * KS;
  c.back.setAttribute("d", pathPts(ringPts(farEnd, axis, r, 28), true));
  c.o.setAttribute("d", SEG(a, b)); c.o.setAttribute("stroke-width", f2(w + 1.1));
  c.f.setAttribute("d", SEG(a, b)); c.f.setAttribute("stroke-width", f2(w));
  c.front.setAttribute("d", pathPts(ringPts(nearEnd, axis, r, 28), true));
  c.hub.setAttribute("d", hubR ? pathPts(ringPts(nearEnd, axis, hubR, 20), true) : "M0 0");
}
function Cap(withTop, fillKind) { return { o: mk("path", "wc-cap", "o"), f: mk("path", "wc-cap", fillKind || "f"), t: withTop ? mk("path", "wc-cap", "t") : null }; }
function drawCap(c, a, b, r) {
  const d = SEG(a, b), w = 2 * r * KS;
  c.o.setAttribute("d", d); c.o.setAttribute("stroke-width", f2(w + 1.1));
  c.f.setAttribute("d", d); c.f.setAttribute("stroke-width", f2(w));
  if (c.t) { c.t.setAttribute("d", SEG(add(a, [0, 0, r * 0.45]), add(b, [0, 0, r * 0.45]))); c.t.setAttribute("stroke-width", f2(w * 0.32)); }
}
const J2 = Cyl();
const UA = Cap(true);
const J3 = Cyl();
const FA = Cap(true);
const FEED = Cap(false, "m");
const WR = Cyl();
const FL = Cyl();
const HOSE = Cap(false, "hose");
const TB = Cap(true);
const NZ = Cap(false, "m");
const wire = mk("path", "wc-wire");
let pose = poseOf(HOME), sNow = null, feedEnd = HOME;
function drawArm(s) {
  pose = poseOf(s.tcp);
  const { u, n, elbow, wrist, tcp } = pose;
  const side = n[0] * VIEW[0] + n[1] * VIEW[1] >= 0 ? 1 : -1;
  const ns = mul(n, side);
  const so = add(SHOULDER, mul(u, 6));
  drawCyl(J2, add(so, mul(ns, -9)), add(so, mul(ns, 9)), ns, 10.5, 4.6);
  drawCap(UA, add(so, mul(ns, 5)), add(elbow, mul(ns, 5)), 6.4);
  drawCyl(J3, add(elbow, mul(ns, -1)), add(elbow, mul(ns, 11)), ns, 7.4, 3);
  drawCap(FA, add(elbow, mul(ns, 5)), wrist, 4.8);
  // the wire feeder rides on the forearm
  const fa = nrm(sub(wrist, elbow));
  const up = nrm(sub([0, 0, 1], mul(fa, fa[2])));
  const f0 = add(add(elbow, mul(fa, 6)), add(mul(up, 7.6), mul(ns, 4)));
  const f1 = add(add(elbow, mul(fa, 22)), add(mul(up, 7.6), mul(ns, 4)));
  drawCap(FEED, f0, f1, 3.6);
  feedEnd = f1;
  drawCyl(WR, add(wrist, mul(ns, -4.6)), add(wrist, mul(ns, 4.6)), ns, 4, 1.6);
  const fl0 = add(wrist, [0, 0, -3.6]), fl1 = add(wrist, [0, 0, -5.6]);
  drawCyl(FL, fl0, fl1, [0, 0, -1], 4.2, 0);
  // the torch hose package from the feeder down to the torch neck
  const tb0 = fl1, tb1 = add(wrist, [0, 0, -12]);
  const end = add(tb0, mul(ns, 2.6));
  const mid = add(lerp(f1, end, 0.5), add(mul(up, 6), mul(ns, 3)));
  const hp = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; hp.push(add(add(mul(f1, (1 - t) * (1 - t)), mul(mid, 2 * t * (1 - t))), mul(end, t * t))); }
  const hd = pathPts(hp.map(at));
  HOSE.o.setAttribute("d", hd); HOSE.o.setAttribute("stroke-width", f2(2.4 * KS + 1.1));
  HOSE.f.setAttribute("d", hd); HOSE.f.setAttribute("stroke-width", f2(2.4 * KS));
  drawCap(TB, tb0, tb1, 2.3);
  drawCap(NZ, tb1, add(tcp, [0, 0, 1.6]), 1.5);
  wire.setAttribute("d", SEG(add(tcp, [0, 0, 1.6]), tcp));
}
function livePoint(key) {
  if (key === "elbow") return pose.elbow;
  if (key === "feeder") return feedEnd;
  if (key === "tcp") return add(pose.tcp, [0, 0, 6]);
  if (key === "fixture") { const s = sNow.stations[1 - sNow.robotSide]; return toWorld(0, -34, TZ + 2, s.phi); }
  if (key === "screen") return toWorld(TR * 0.5, 0, TZ + 40, sNow.theta);
  return pose.tcp;
}

// ------------------------------------------------ arc light
let flick = 1;
function drawArc(s) {
  if (!s.arc) { if (el.arc.innerHTML) el.arc.innerHTML = ""; return; }
  const [x, y] = at(s.tcp);
  if (!still.matches) flick = 0.8 + 0.2 * Math.random();
  let out = '<defs><radialGradient id="wc-glow"><stop offset="0" class="wc-glow-stop0"/><stop offset="1" class="wc-glow-stop1"/></radialGradient></defs>';
  out += '<circle cx="' + f2(x) + '" cy="' + f2(y) + '" r="' + f2(12 * KS * flick) + '" fill="url(#wc-glow)"/>';
  out += '<circle class="wc-core" cx="' + f2(x) + '" cy="' + f2(y) + '" r="' + f2(1.1 * KS * (0.8 + 0.4 * flick)) + '"/>';
  if (!still.matches) for (let i = 0; i < 3; i++) { const a = Math.random() * Math.PI * 2, r = (2 + Math.random() * 4) * KS; out += '<circle class="wc-spark" cx="' + f2(x + r * Math.cos(a)) + '" cy="' + f2(y + r * Math.sin(a) * 0.6) + '" r="' + f2(0.35 * KS) + '"/>'; }
  el.arc.innerHTML = out;
}

// ------------------------------------------------ readout
let marked = -1;
const accS = (s) => '<span class="wc-acc">' + s + "</span>";
const strong = (s) => '<span class="wc-strong">' + s + "</span>";
const mute = (s) => '<span class="wc-mute">' + s + "</span>";
function readout() {
  const out = [];
  const W = nowW(), L = nowL();
  if (LVL === 1) {
    if (st.stations === 2) {
      const C = cycleOf(W, L, TURN, 2);
      out.push(strong(T.st2) + " · " + T.weld + " " + fmt(W, 0) + " + " + T.turn + " " + fmt(TURN, 1) + " = " + strong(fmt(C, 1) + " " + T.min) + " " + T.perFrame);
      out.push("→ " + strong(fmt(60 / C, 1) + " " + T.perH) + " · " + T.arcOn + " " + strong(Math.round((W / C) * 100) + " %") + " " + T.ofCycle);
      out.push(accS("+" + Math.round((60 / C / (60 / cycleOf(W, L, TURN, 1)) - 1) * 100) + " % " + T.more));
    } else {
      const C = cycleOf(W, L, TURN, 1);
      out.push(strong(T.st1) + " · " + T.weld + " " + fmt(W, 0) + " + " + T.load + " " + fmt(L, 0) + " = " + strong(fmt(C, 0) + " " + T.min) + " " + T.perFrame);
      out.push("→ " + strong(fmt(60 / C, 1) + " " + T.perH) + " · " + T.arcOn + " " + strong(Math.round((W / C) * 100) + " %") + " " + T.ofCycle);
      out.push(accS(T.robotWaits + " " + fmt(L, 0) + " " + T.forLoad));
    }
    out.push(marked >= 0 ? accS(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  } else if (LVL === 2) {
    const C = cycleOf(W, L, TURN, 2), C1 = cycleOf(W, L, TURN, 1);
    out.push(T.weld + " " + fmt(W, 1) + " · " + T.load + " " + fmt(L, 1) + " · " + T.turn + " " + fmt(TURN, 1) + " " + T.min);
    out.push(T.cycle + " max(" + fmt(W, 1) + T.sep + fmt(L, 1) + ") + " + fmt(TURN, 1) + " = " + strong(fmt(C, 1) + " " + T.min) + " · " + strong(fmt(60 / C, 1) + T.ph));
    if (L < W) out.push(mute(T.opDone + " " + fmt(L, 1) + " " + T.min + ", " + T.opWaits + " " + fmt(W - L, 1) + " " + T.min));
    else if (L > W) out.push(accS(T.robotWaits + " " + fmt(L - W, 1) + " " + T.onOp));
    else out.push(mute(T.same));
    out.push(T.arcOn + " " + strong(Math.round((W / C) * 100) + " %") + " · " + T.one + ": " + fmt(C1, 1) + " " + T.min + ", " + fmt(60 / C1, 1) + T.ph);
  } else if (LVL === 3) {
    const bf = st.bf / 100;
    const hand = perMetre(HAND.bf, HAND.rate), rob = perMetre(bf, ROBOT.rate), wc = wireCost();
    out.push(mute(T.arcTime));
    out.push(T.hand + " " + Math.round(HAND.bf * 100) + " %: " + fmt(ARC_M, 1) + " / " + fmt(HAND.bf, 2) + " = " + fmt(ARC_M / HAND.bf, 1) + " " + T.min + " × " + eur(HAND.rate / 60) + " = " + strong(eur(hand) + T.perM));
    const robTxt = eur(rob) + T.perM;
    out.push(T.robot + " " + st.bf + " %: " + fmt(ARC_M, 1) + " / " + fmt(bf, 2) + " = " + fmt(ARC_M / bf, 1) + " " + T.min + " × " + eur(ROBOT.rate / 60) + " = " + (rob > hand + 1e-9 ? accS(robTxt) : strong(robTxt)));
    const verdict = Math.abs(rob - hand) < 1e-9 ? strong(T.equal) : rob < hand ? strong(T.cheaper) : accS(T.dearer);
    out.push(T.wire + " " + eur(wc) + T.perM + " " + T.both + " · " + T.even + " → " + verdict);
  } else {
    const e = EXC[st.exc];
    out.push("EXC" + st.exc + " → " + strong("ISO 3834-" + e.part) + " " + T.part[e.part]);
    out.push(T.qual + " " + strong(e.q) + " (ISO 5817, EN 1090-2)" + (st.exc >= 3 ? " · " + accS(T.ndtMore) : ""));
    out.push(st.exc >= 3 ? accS(T.coordHi) : mute(T.coordLo));
    out.push(WELDERS + " " + T.confirm + " " + strong(String(WELDERS * 2)) + " " + T.confirmTail);
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

function draw() {
  const s = sNow;
  const order = s.stations.map((x) => ({ x, d: hdepth(0, -20, x.phi) })).sort((a, b) => a.d - b.d);
  el.far.innerHTML = stationSvg(order[0].x);
  el.near.innerHTML = stationSvg(order[1].x);
  el.screen.innerHTML = screenSvg(s.theta);
  drawArm(s);
  drawArc(s);
  if (el.stack.arc) { if (s.arc) el.stack.arc.setAttribute("data-on", ""); else el.stack.arc.removeAttribute("data-on"); }
  if (el.stack.ready) { if (!s.arc) el.stack.ready.setAttribute("data-on", ""); else el.stack.ready.removeAttribute("data-on"); }
  if (marked >= 0) {
    const pt = PARTS[marked].live ? livePoint(PARTS[marked].live) : PARTS[marked].at;
    const [x, y] = at(pt);
    el.mark.innerHTML = '<circle class="wc-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="wc-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
}

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  if (!still.matches) clock += dt / SEC;
  sNow = sample(clock);
  draw();
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { lastT = 0; frame = requestAnimationFrame(tick); } };
function restill() { // reduced motion: one telling still pose, the robot on the third seam, the other station being loaded
  clock = (nowW() * 2.6) / 6; sNow = sample(clock); draw();
}

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".wc-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const vals = [...document.querySelectorAll("[data-val]")];
const LISTS = { W: WELDS, L: LOADS, bf: BFS };
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  vals.forEach((v) => { const key = v.dataset.val; v.querySelector("b").textContent = key === "bf" ? st.bf + " %" : fmt(st[key], 1) + " min"; });
  stepBtns.forEach((b) => { const list = LISTS[b.dataset.key], i = list.indexOf(st[b.dataset.key]); b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1; });
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed() {
  const prevC = PH.reduce((s, p) => s + p[1], 0);
  const frac = (clock % prevC) / prevC;
  const cycles = Math.floor(clock / prevC);
  PH = phases();
  const C = PH.reduce((s, p) => s + p[1], 0);
  clock = cycles * C + frac * C;
  sync(); readout(); announce();
  if (still.matches) restill(); else { sNow = sample(clock); draw(); run(); }
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  st[key] = Number(val);
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
  const i = list.indexOf(st[key]);
  const v = list[clamp(i + dir, 0, list.length - 1)];
  if (v === st[key]) return;
  st[key] = v;
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.key, b.dataset.step === "+" ? 1 : -1)));

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 70;
  PARTS.forEach((p, i) => { const [px, py] = at(p.live ? livePoint(p.live) : p.at); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL !== 1) return;
  marked = nearestPart(toView(event));
  draw(); readout(); announce();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) marked = (marked + 1) % PARTS.length;
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) marked = (marked + PARTS.length - 1) % PARTS.length;
  else if (LVL === 2 && (event.key === "+" || event.key === "-")) { stepValue("W", event.key === "+" ? 1 : -1); return event.preventDefault(); }
  else if (LVL === 3 && (event.key === "+" || event.key === "-")) { stepValue("bf", event.key === "+" ? 1 : -1); return event.preventDefault(); }
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
if (still.matches) restill(); else { clock = 0.9; sNow = sample(clock); draw(); }
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Lasrobotcel",
    hint1: "Tik een onderdeel · kies 1 of 2 stations",
    hint2: "Kies de lastijd en de laadtijd",
    hint3: "Kies de bedrijfsfactor van de robot",
    hint4: "Kies de uitvoeringsklasse",
    stations: "Stations", st1: "1 station", st2: "2 stations",
    weldT: "Lassen", loadT: "Laden", bf: "Bedrijfsfactor robot", exc: "Uitvoeringsklasse",
    minus: "Lager", plus: "Hoger",
    label: LABEL_NL,
    aria: "Lasrobotcel met een draaitafel met twee stations. Niveau 1: pijltjes kiezen een onderdeel. Plus en min veranderen de waarde.",
  },
  en: {
    title: "Robot weld cell",
    hint1: "Tap a part · pick 1 or 2 stations",
    hint2: "Pick the weld time and the load time",
    hint3: "Pick the robot’s operating factor",
    hint4: "Pick the execution class",
    stations: "Stations", st1: "1 station", st2: "2 stations",
    weldT: "Weld", loadT: "Load", bf: "Robot operating factor", exc: "Execution class",
    minus: "Lower", plus: "Higher",
    label: LABEL_EN,
    aria: "Robot weld cell with a two-station turntable. Level 1: arrows pick a part. Plus and minus change the value.",
  },
};

const sN = STRINGS.nl;
const radio = (set, key) => `<button type="button" class="wc-btn" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key] ?? key}</button>`;
const radioRaw = (set, text) => `<button type="button" class="wc-btn" role="radio" data-set="${set}" aria-checked="false" tabindex="-1">${text}</button>`;
const stepper = (key, labelKey) =>
  `<button type="button" class="wc-btn" data-step="-" data-key="${key}" aria-label="${sN.minus}" data-t-label="minus">−</button>` +
  `<div class="wc-val" data-val="${key}"><span data-t="${labelKey}">${sN[labelKey]}</span><b></b></div>` +
  `<button type="button" class="wc-btn" data-step="+" data-key="${key}" aria-label="${sN.plus}" data-t-label="plus">+</button>`;
const controls = [
  `<div class="wc-controls">`,
  `<div class="wc-row" data-levels="1" role="radiogroup" aria-label="${sN.stations}" data-t-label="stations">${radio("stations:1", "st1")}${radio("stations:2", "st2")}</div>`,
  `<div class="wc-row" data-levels="2">${stepper("W", "weldT")}</div>`,
  `<div class="wc-row" data-levels="2">${stepper("L", "loadT")}</div>`,
  `<div class="wc-row" data-levels="3">${stepper("bf", "bf")}</div>`,
  `<div class="wc-row" data-levels="4" role="radiogroup" aria-label="${sN.exc}" data-t-label="exc">${[1, 2, 3, 4].map((n) => radioRaw(`exc:${n}`, `EXC${n}`)).join("")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="wc-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="wc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="wc-line"></span>'.repeat(4)}</span>`)
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
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
var st=document.querySelector(".wc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: 1 station ${cycleOf(W0, L0, TURN, 1)} min · 2 stations ${cycleOf(W0, L0, TURN, 2).toFixed(1)} min (${(60 / cycleOf(W0, L0, TURN, 2)).toFixed(1)}/h) · hand €${perMetre(HAND.bf, HAND.rate).toFixed(2)}/m · robot 70 % €${perMetre(0.7, ROBOT.rate).toFixed(2)}/m · wire €${wireCost().toFixed(2)}/m`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false });

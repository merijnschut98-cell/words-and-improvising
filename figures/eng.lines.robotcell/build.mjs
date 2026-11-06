// Dev tool, not shipped. Builds the standalone figure for the topic "Robots"
// (module Lijnen en automatisering): the lessons eng.lines.robotbasics
// (level 1), robots (level 2), robotcell (level 3) and vision (level 4).
//
//   node figures/eng.lines.robotcell/build.mjs            build the page
//   node figures/eng.lines.robotcell/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.robotcell.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.robotcell.html");

// ---------------------------------------------------------------- the model
// A six-axis robot on a pedestal in a fenced cell. It picks a part off an
// infeed belt (left) and puts it on the loading table of a machine (right).
// The open front is guarded by a light curtain.
//   Level 1 (robotbasics)  hand mode vs automatic. In hand mode (reduced speed)
//                          the TCP moves at most 250 mm/s (ISO 10218-1), so a
//                          move of L mm takes at least L / 250 s; the lesson's
//                          example: 1,500 mm → 6 s, recall 2,000 mm → 8 s.
//   Level 2 (robots)       the real cycle: move time / speed + waiting for the
//                          machine (1.6 s) + two gripper actions (2 × 0.3 s) and
//                          four slow approaches (4 × 0.35 s). An industrial robot
//                          (20 kg class) moves in 4 s at 100 %, so 4 + 1.6 + 2.0 =
//                          7.6 s, inside the lesson's "often 7 to 9 s"; a cobot
//                          (10 kg) in 6 s (illustrative). Payload use: gripper
//                          4 kg + part 6 kg = 10 kg, 50 % of 20 kg or 100 % of
//                          10 kg (the lesson's worked example).
//   Level 3 (robotcell)    safety distance of the light curtain, ISO 13855:
//                          S = K·T + C with K = 2,000 mm/s, C = 8·(d − 14) mm for a
//                          resolution d of 14–40 mm. If S > 500 mm, recalculate with
//                          K = 1,600 mm/s, but S is never below 500 mm then.
//                          (Checked against ReeR and Keyence application notes on
//                          ISO 13855.) The curtain in the drawing stands 550 mm in
//                          front of the hazard line (the reach limit).
//                          Lesson recall: d 30 mm, T 0.15 s → 300 + 128 = 428 mm.
//   Level 4 (vision)       the lesson's faded example: takt 14 s, cobot move 6 s at
//                          full speed, the rest 4 s. Power and force limiting at
//                          half speed: 12 + 4 = 16 s, misses the takt. Speed and
//                          separation monitoring (a scanner): full speed 10 s while
//                          nobody is near, half speed (16 s) while someone is.
const MAN_V = 250; // mm/s, TCP in hand mode
const GRIP = 0.3, APPROACH = 0.35; // s each
const FIXED = 2 * GRIP + 4 * APPROACH; // 2.0 s
const ROBOTS = {
  ind: { move: 4, wait: 1.6, payload: 20 },
  cobot: { move: 6, wait: 1.6, payload: 10 },
  l4: { move: 6, wait: 2.0, payload: 10 },
};
const LOAD = { gripper: 4, part: 6 };
const TAKT = 14;
const SPEEDS = [25, 50, 75, 100];
const cycleOf = (r, speed) => r.move / (speed / 100) + r.wait + FIXED;
const CURTAIN = 550; // mm from the hazard line
const STOPS = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
const RES = [14, 30, 40];
function safety(T, d) {
  const C = 8 * (d - 14);
  const s1 = 2000 * T + C;
  if (s1 <= 500) return { C, K: 2000, raw: s1, S: Math.max(100, s1), rerun: false };
  const s2 = 1600 * T + C;
  return { C, K: 1600, raw: s2, S: Math.max(500, s2), rerun: true, first: s1 };
}
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(1500 / MAN_V, 6, 1e-9, "robotbasics example: 1,500 mm in hand mode");
  near(2000 / MAN_V, 8, 1e-9, "robotbasics recall: 2,000 mm in hand mode");
  near(FIXED, 2.0, 1e-9, "grips and approaches");
  near(cycleOf(ROBOTS.ind, 100), 7.6, 1e-9, "robots: industrial cycle");
  if (!(cycleOf(ROBOTS.ind, 100) >= 7 && cycleOf(ROBOTS.ind, 100) <= 9)) throw new Error("industrial cycle outside the lesson's 7–9 s");
  near((LOAD.gripper + LOAD.part) / ROBOTS.cobot.payload, 1, 1e-9, "robots example: 100 % of 10 kg");
  near((7 + 5) / 0.8, 15, 1e-9, "robots recall: payload 15 kg");
  const r = safety(0.15, 30);
  near(r.C, 128, 1e-9, "robotcell: C at 30 mm");
  near(r.S, 428, 1e-9, "robotcell recall: S = 428 mm");
  near(safety(0.15, 14).C, 0, 1e-9, "robotcell: C at 14 mm");
  near(safety(0.3, 30).S, 608, 1e-9, "robotcell: rerun with K = 1,600");
  near(safety(0.2, 30).S, 500, 1e-9, "robotcell: never under 500 after rerun");
  near(3600 / (50 + 10), 60, 1e-9, "robotcell recall: 60 per hour");
  near(cycleOf(ROBOTS.l4, 50), 16, 1e-9, "vision example: PFL at half speed");
  near(cycleOf(ROBOTS.l4, 100), 10, 1e-9, "vision example: scanner, full speed");
  near(2 * 5 + 3, 13, 1e-9, "vision recall: 13 s");
}

// ---------------------------------------------------------------- the world
// World units are 10 mm, z up, +y toward the open front (the operator side).
const WIDTH = 600;
const FLOOR = { x: -160, y: -90, w: 280, d: 222, r: 3 };
const FX = 110, FB = -80, FF = 85, FH = 150; // fence sides, back, front, height
const HAZ = 30; // hazard line (reach limit) y
const CUR_Y = HAZ + CURTAIN / 10; // = FF
const PED = [0, -25];
const SH_Z = 64;
const LINK = [56, 52];
const TOOL = 16;
const BELT_Z = 78;
const PART = { w: 14, h: 10 };
const PICK = [-62, -1];
const PLACE = [63, -6];
const TABLE_Z = 80;
const CAB = { x: -152, y: -72, w: 24, d: 30, r: 1 };
const CAB_H = 92;
const MACH = { x: 30, y: -76, w: 76, d: 46, r: 2 };
const MACH_H = 128;
const RULER_X = 92;
if (CUR_Y !== FF) throw new Error("the curtain must stand in the front opening");

const FIT = [
  ...k.boxCorners(FLOOR, -3, 0),
  [-FX, FB, FH], [FX, FB, FH], [-FX, FF, FH], [FX, FF, FH],
  [CAB.x, CAB.y, CAB_H + 14],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 68);
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
const card = (pts) => `<path class="rc-card" d="${k.pathOf(pts.map(at), true)}"/>`;

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
// the hazard line: the reach limit of the robot toward the front, taped on the floor
{
  const tape = { x: -FX + 4, y: HAZ - 1.2, w: 2 * FX - 8, d: 2.4, r: 0.4 };
  const hatch = [];
  for (let x = tape.x + 3; x < tape.x + tape.w - 2; x += 6) hatch.push(k.lineOnTop([x, tape.y], [x + 2.2, tape.y + tape.d], 0.4, P));
  box("floor.hazard", tape, 0, 0.4, { tone: "mid", crease: "none" }, { steps: 2, flat: true, extra: L(hatch.join(""), { tone: "lo" }), layer: "floor" });
}
// a floor ruler from the hazard line to past the curtain, ticks every 50 mm
{
  const strip = { x: RULER_X, y: HAZ + 1.2, w: 7, d: 94, r: 0.4 };
  const ticks = [];
  for (let i = 0; i <= 18; i++) {
    const y = HAZ + 1.2 + 2 + i * 5;
    if (y > strip.y + strip.d - 1) break;
    ticks.push(k.lineOnTop([RULER_X, y], [RULER_X + (i % 2 === 0 ? 3.6 : 2), y], 0.4, P));
  }
  box("floor.ruler", strip, 0, 0.4, { tone: "lo", crease: "none" }, { steps: 2, extra: L(ticks.join(""), { tone: "mid" }), layer: "floor" });
}
// the cable duct from the controller to the robot base
box("floor.duct", { x: CAB.x + CAB.w, y: -31, w: -14 - (CAB.x + CAB.w) - 2.6, d: 6, r: 0.8 }, 0, 1.4, { tone: "mid" }, { steps: 2, inner: L(k.lineOnTop([CAB.x + CAB.w, -28], [-16.6, -28], 1.4, P), { tone: "faint" }), layer: "floor" });

// ---------------------------------------------------------------- the fence
const postsAt = [];
for (const x of [-FX, 0, FX]) postsAt.push([x, FB]);
for (const y of [0, FF]) for (const x of [-FX, FX]) postsAt.push([x, y]);
for (const [x, y] of postsAt) {
  const front = x === FX || y === FF;
  const layer = front ? "front" : "back";
  const foot = plan(x, y, 9, 9, 0.6);
  box("fence.foot", foot, 0, 1, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(foot, 1.6).map(([px, py]) => at([px, py, 1])), { size: 0.35 }), layer, attrs: ' data-guard=""' });
  box("fence.post", plan(x, y, 4, 4, 0.4), 1, FH, { tone: "mid" }, { steps: 1, extra: Dt([at([x, y, FH])], { size: 0.4 }), layer, attrs: ' data-guard=""' });
}
function meshPanel(axis, fixed, u0, u1, z0, z1) {
  const point = (u, z) => (axis === "y" ? [u, fixed, z] : [fixed, u, z]);
  const frame = k.pathOf([point(u0, z0), point(u1, z0), point(u1, z1), point(u0, z1)].map(at), true);
  const inner = [];
  const n = Math.round((u1 - u0) / 9);
  for (let q = 1; q < n; q++) { const u = u0 + ((u1 - u0) * q) / n; inner.push(k.pathOf([at(point(u, z0)), at(point(u, z1))])); }
  const rows = Math.round((z1 - z0) / 9);
  for (let q = 1; q < rows; q++) { const z = z0 + ((z1 - z0) * q) / rows; inner.push(k.pathOf([at(point(u0, z)), at(point(u1, z))])); }
  return `<path class="rc-mesh" d="${frame}"/>` + L(inner.join(""), { tone: "faint" }) + L(frame, { tone: "lo" });
}
const MZ = [8, FH - 4];
const meshFar =
  meshPanel("y", FB, -FX + 2, -2, ...MZ) + meshPanel("y", FB, 2, FX - 2, ...MZ) +
  meshPanel("x", -FX, FB + 2, -2, ...MZ) + meshPanel("x", -FX, 2, FF - 2, ...MZ);
const meshNear = meshPanel("x", FX, FB + 2, -2, ...MZ) + meshPanel("x", FX, 2, FF - 2, ...MZ);

// ---------------------------------------------------------------- the light curtain
const LC = [-FX + 10, FX - 10];
for (const x of LC) {
  const base = plan(x, CUR_Y, 8, 8, 0.6);
  box("curtain.base", base, 0, 2, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(base, 1.6).map(([px, py]) => at([px, py, 2])), { size: 0.35 }), layer: "front", attrs: ' data-guard=""' });
  const face = x < 0 ? x + 2 : x - 2;
  const lenses = [];
  for (let z = 10; z <= 134; z += 4) lenses.push(at([face, CUR_Y, z]));
  box("curtain.column", plan(x, CUR_Y, 4, 4, 0.5), 2, 140, { tone: "hi", crease: "lo" }, {
    steps: 1,
    extra: Dt(lenses, { size: 0.28, tone: "lo" }) + Dt([at([x, CUR_Y, 140])], { size: 0.4 }),
    layer: "front",
    attrs: ' data-guard=""',
  });
  post("curtain.cap", x, CUR_Y, 1.6, 140, 142, { tone: "mid" }, { steps: 14, layer: "front", attrs: ' data-guard=""', extra: Dt([at([x, CUR_Y, 142])], { size: 0.35, tone: "hi" }) });
}
const beams = [];
for (let z = 12; z <= 132; z += 8) beams.push(k.segment([LC[0] + 2, CUR_Y, z], [LC[1] - 2, CUR_Y, z], P));
const beamSvg = `<g data-guard="" data-beams=""><path class="rc-beam" d="${beams.join("")}"/></g>`;

// ---------------------------------------------------------------- robot pedestal and base
{
  const [px, py] = PED;
  const bolts = Array.from({ length: 8 }, (_, q) => [px + 13.4 * Math.cos((q / 8) * Math.PI * 2 + 0.2), py + 13.4 * Math.sin((q / 8) * Math.PI * 2 + 0.2)]);
  post("robot.anchor-plate", px, py, 16, 0, 2, { tone: "lo" }, { steps: 48, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, 2])), { size: 0.45 }) });
  post("robot.pedestal", px, py, 10, 2, 30, { tone: "mid", crease: "none" }, { steps: 40, inner: L(k.sideArc(px, py, 10, 16, P, 28), { tone: "faint" }) });
  const top = Array.from({ length: 6 }, (_, q) => [px + 12 * Math.cos((q / 6) * Math.PI * 2), py + 12 * Math.sin((q / 6) * Math.PI * 2)]);
  post("robot.top-plate", px, py, 14, 30, 33, { tone: "mid" }, { steps: 48, bevel: 0.4, extra: Dt(top.map(([x, y]) => at([x, y, 33])), { size: 0.4 }) });
  post("robot.base", px, py, 12, 33, 42, { tone: "hi", crease: "lo" }, { steps: 44, inner: L(k.sideArc(px, py, 12, 37.5, P, 32), { tone: "faint" }) });
  post("robot.turret", px, py, 10, 42, 50, { tone: "hi", crease: "lo" }, { steps: 40 });
  // the type plate and the cable connector at the back-left of the base
  box("robot.connector", { x: px - 15.5, y: py - 4, w: 4, d: 8, r: 0.6 }, 34, 40, { tone: "mid" }, { steps: 2, extra: Dt([at([px - 15.5, py, 37])], { size: 0.4 }) });
}
// a scanner at the pedestal for level 4 (speed and separation monitoring)
{
  const sp = { x: -5, y: -7, w: 10, d: 6, r: 1 };
  box("scanner.body", sp, 0, 8, { tone: "mid" }, { steps: 3, bevel: 0.3, attrs: ' data-l4=""', extra: card([[-3.6, -1, 2], [3.6, -1, 2], [3.6, -1, 5], [-3.6, -1, 5]]) });
  post("scanner.head", 0, -4, 2.8, 8, 11, { tone: "hi", crease: "lo" }, { steps: 24, attrs: ' data-l4=""' });
}

// ---------------------------------------------------------------- infeed belt (left)
const BELT = { x: -100, y: -9, w: 72, d: 18, r: 1 };
for (const x of [-94, -36]) for (const y of [-7, 7]) {
  post("feed.foot", x, y, 2.6, 0, 1, { tone: "lo" }, { steps: 16 });
  post("feed.leg", x, y, 1.5, 1, BELT_Z - 6, { tone: "mid", crease: "none" }, { steps: 12 });
}
box("feed.bed", BELT, BELT_Z - 6, BELT_Z - 2, { tone: "mid" }, { steps: 3, bevel: 0.3, inner: L(k.sideSeam(BELT, BELT_Z - 4, P, 3), { tone: "faint" }) });
{
  const belt = k.insetPlan(BELT, 1.4);
  const slats = [];
  for (let x = belt.x + 3; x <= belt.x + belt.w - 2; x += 4) slats.push(k.lineOnTop([x, belt.y], [x, belt.y + belt.d], BELT_Z, P));
  box("feed.belt", belt, BELT_Z - 2, BELT_Z, { tone: "lo", crease: "none" }, { steps: 3, inner: L(slats.join(""), { tone: "faint" }) });
}
for (const x of [BELT.x - 2.6, BELT.x + BELT.w + 2.6]) discAt("feed.drum", frameY([x, BELT.y + 1, BELT_Z - 3]), 0, BELT.d - 2, 2.6, { tone: "mid" }, { owner: "feed" });
// the stopper the part runs up against, on the far guide
box("feed.stopper-post", { x: PICK[0] + PART.w / 2 + 1, y: BELT.y - 4.8, w: 2.4, d: 2.4, r: 0.3 }, 0, BELT_Z + 3, { tone: "mid" }, { steps: 1 });
box("feed.stopper", { x: PICK[0] + PART.w / 2 + 1, y: BELT.y - 4.8, w: 2.4, d: 16.8, r: 0.3 }, BELT_Z + 3, BELT_Z + 7, { tone: "hi", crease: "lo" }, { steps: 1 });
// guides on both sides
for (const y0 of [BELT.y - 2.2, BELT.y + BELT.d]) {
  const g = { x: BELT.x + 2, y: y0, w: BELT.w - 4, d: 2.2, r: 0.3 };
  box("feed.guide", g, BELT_Z - 2, BELT_Z + 3, { tone: "mid" }, { steps: 1, extra: Dt([at([g.x + 2, y0 + 1.1, BELT_Z + 3]), at([g.x + g.w - 2, y0 + 1.1, BELT_Z + 3])], { size: 0.35 }) });
}
// the next part, queued on the belt
{
  const p = plan(-86, PICK[1], PART.w, PART.w, 1);
  box("feed.next-part", p, BELT_Z, BELT_Z + PART.h, { tone: "mid", crease: "lo" }, { steps: 2, bevel: 0.4, inner: L(k.planOutline(k.insetPlan(p, 3), BELT_Z + PART.h, P, 2), { tone: "faint" }) });
}
// the drive motor under the infeed end
{
  const FM = frameX([BELT.x + 8, BELT.y + BELT.d - 3.4, BELT_Z - 9.2]);
  const fins = G.ribsOf(FM, 0.6, 11.4, 3.2, 14, P, { fade: [0.05, 0.45], seams: true });
  discAt("feed.motor", FM, 0, 12, 3.2, { tone: "mid" }, { owner: "feed", inner: k.fadedSvg(fins, { tone: "lo" }) });
}

// ---------------------------------------------------------------- the machine and its loading table (right)
{
  const fy = MACH.y + MACH.d;
  const door = [[MACH.x + 6, fy, 30], [MACH.x + 52, fy, 30], [MACH.x + 52, fy, 112], [MACH.x + 6, fy, 112]];
  const win = [[MACH.x + 14, fy, 62], [MACH.x + 44, fy, 62], [MACH.x + 44, fy, 102], [MACH.x + 14, fy, 102]];
  const vents = [];
  for (const z of [10, 14, 18]) vents.push(k.pathOf([[MACH.x + 58, fy, z], [MACH.x + 70, fy, z], [MACH.x + 70, fy, z + 1.6], [MACH.x + 58, fy, z + 1.6]].map(at), true));
  const top = k.planOutline(k.insetPlan(MACH, 4), MACH_H, P, 2);
  box("machine.body", MACH, 0, MACH_H, { tone: "mid" }, {
    steps: 3,
    bevel: 0.8,
    inner: L(k.pathOf(door.map(at), true), { tone: "lo" }) + L(top, { tone: "faint" }) + L(k.sideSeam(MACH, 6, P, 3), { tone: "faint" }),
    extra: `<path class="rc-window" d="${k.pathOf(win.map(at), true)}"/>` + `<path class="rc-slot" d="${vents.join("")}"/>` + Dt([[MACH.x + 4, fy, 4], [MACH.x + MACH.w - 4, fy, 4]].map(at), { size: 0.4 }),
  });
  // door handle and the control panel at the right
  box("machine.handle", { x: MACH.x + 48, y: fy, w: 2, d: 2.4, r: 0.4 }, 60, 84, { tone: "hi", crease: "lo" }, { steps: 1 });
  const panel = { x: MACH.x + 58, y: fy, w: 14, d: 3, r: 0.6 };
  box("machine.panel", panel, 72, 108, { tone: "lo" }, { steps: 1, extra: card([[panel.x + 2, fy + 3, 104], [panel.x + 12, fy + 3, 104], [panel.x + 12, fy + 3, 94], [panel.x + 2, fy + 3, 94]]) + Dt([[panel.x + 4, fy + 3, 88], [panel.x + 7, fy + 3, 88], [panel.x + 10, fy + 3, 88], [panel.x + 4, fy + 3, 84], [panel.x + 7, fy + 3, 84], [panel.x + 10, fy + 3, 84]].map(at), { size: 0.5 }) });
  // the ready lamp on top
  const lx = MACH.x + MACH.w - 10, ly = MACH.y + 10;
  post("machine.lamp-base", lx, ly, 3, MACH_H, MACH_H + 2, { tone: "mid" }, { steps: 20 });
  post("machine.lamp", lx, ly, 2.4, MACH_H + 2, MACH_H + 8, { tone: "mid", crease: "lo" }, { steps: 20, attrs: ' data-ready=""', extra: Dt([at([lx, ly, MACH_H + 8])], { size: 0.4, tone: "hi" }) });
}
const TAB = { x: 44, y: -22, w: 40, d: 30, r: 1 };
for (const [x, y] of k.corners(k.insetPlan(TAB, 3), 0)) {
  post("table.foot", x, y, 2.4, 0, 1, { tone: "lo" }, { steps: 14 });
  box("table.leg", plan(x, y, 2.6, 2.6, 0.3), 1, TABLE_Z - 4, { tone: "mid" }, { steps: 1 });
}
box("table.top", TAB, TABLE_Z - 4, TABLE_Z, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.planOutline(k.insetPlan(TAB, 3), TABLE_Z, P, 2), { tone: "faint" }) });
// the fixture: a nest plate and two locating pins
{
  const nest = plan(PLACE[0], PLACE[1], 20, 20, 0.6);
  box("table.nest", nest, TABLE_Z, TABLE_Z + 1.2, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(nest, 1.6).map(([x, y]) => at([x, y, TABLE_Z + 1.2])), { size: 0.35 }) });
  for (const [x, y] of [[PLACE[0] - 8.4, PLACE[1] - 8.4], [PLACE[0] + 8.4, PLACE[1] + 8.4]]) post("table.pin", x, y, 0.9, TABLE_Z + 1.2, TABLE_Z + 4, { tone: "hi", crease: "none" }, { steps: 12 });
}

// ---------------------------------------------------------------- the controller outside the fence (left)
{
  const fy = CAB.y + CAB.d;
  const vents = [];
  for (const z of [8, 11, 14]) vents.push(k.pathOf([[CAB.x + 6, fy, z], [CAB.x + 18, fy, z], [CAB.x + 18, fy, z + 1.2], [CAB.x + 6, fy, z + 1.2]].map(at), true));
  const door = k.pathOf([[CAB.x + 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, CAB_H - 2], [CAB.x + 1.6, fy, CAB_H - 2]].map(at), true);
  const label = [[CAB.x + 4, fy, 72], [CAB.x + 14, fy, 72], [CAB.x + 14, fy, 78], [CAB.x + 4, fy, 78]];
  box("ctrl.body", CAB, 0, CAB_H, { tone: "mid" }, {
    steps: 2,
    bevel: 0.5,
    inner: L(door, { tone: "lo" }) + L(k.sideSeam(CAB, CAB_H - 8, P, 2), { tone: "faint" }),
    extra: `<path class="rc-slot" d="${vents.join("")}"/>` + card(label) + L([76, 74].map((z, i) => k.segment([CAB.x + 5, fy, z], [CAB.x + [12, 10][i], fy, z], P)).join(""), { tone: "lo", free: true }) + Dt([[CAB.x + 3, fy, 5], [CAB.x + 3, fy, CAB_H - 4]].map(at), { size: 0.4 }),
  });
  discAt("ctrl.switch", frameY([CAB.x + CAB.w - 5, fy, 56]), 0, 1.2, 3, { tone: "lo" }, { steps: 24 });
  discAt("ctrl.knob", frameY([CAB.x + CAB.w - 5, fy, 56]), 1.2, 3, 1.6, { tone: "hi", crease: "none" }, { steps: 20 });
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
  // stack light on top
  const tx = CAB.x + 6, ty = CAB.y + 6;
  post("ctrl.stack-base", tx, ty, 2.6, CAB_H, CAB_H + 2, { tone: "mid" }, { steps: 18 });
  ["auto", "hand"].forEach((name, q) => post(`ctrl.stack-${name}`, tx, ty, 2.1, CAB_H + 2 + q * 4.4, CAB_H + 6 + q * 4.4, { tone: "mid", crease: "lo" }, { steps: 18, attrs: ` data-stack="${name}"` }));
  post("ctrl.stack-ring", tx, ty, 2.3, CAB_H + 6, CAB_H + 6.4, { tone: "lo", crease: "none" }, { steps: 18 });
  post("ctrl.stack-cap", tx, ty, 2.3, CAB_H + 10.4, CAB_H + 11.6, { tone: "mid" }, { steps: 18, extra: Dt([at([tx, ty, CAB_H + 11.6])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
if (process.env.ORDER) console.log(R.items.slice().sort((a, b) => a.key - b.key).map((i, n) => n + " " + i.layer + " " + i.name).join("\n"));
const body = [
  halo,
  ...layerOf("floor"),
  `<g data-floor-live=""></g>`,
  `<g data-guard="" data-name="fence.mesh-far">${meshFar}</g>`,
  ...layerOf("back"),
  `<g data-arm=""></g>`,
  `<g data-guard="" data-name="fence.mesh-near">${meshNear}</g>`,
  ...layerOf("front"),
  beamSvg,
  `<g data-mark=""></g>`,
];

const LABEL_NL =
  "Een robotcel van bovenaf schuin gezien. Midden in de cel staat een zesassige industriële robot op een sokkel. Links voert een band onderdelen aan tot tegen een aanslag; de robot pakt ze met een grijper en zet ze op de laadtafel van een machine rechts. De cel heeft aan drie kanten een hek van gaas; de open voorkant is beveiligd met een lichtscherm van twee zuilen. Op de vloer markeert een tape de grens van het gevarenzone en een liniaal meet de afstand tot het lichtscherm. Buiten het hek staat de robotbesturing met een teach pendant aan een haak.";
const LABEL_EN =
  "A robot cell seen at an angle from above. A six-axis industrial robot stands on a pedestal in the middle of the cell. On the left a belt feeds parts up to a stop; the robot picks them with a gripper and puts them on the loading table of a machine on the right. The cell has mesh fencing on three sides; the open front is guarded by a light curtain of two columns. On the floor a tape marks the edge of the hazard zone and a ruler measures the distance to the light curtain. Outside the fence stands the robot controller with a teach pendant on a hook.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "j1", at: [PED[0], PED[1], 46] },
  { key: "j2", live: "shoulder" },
  { key: "j3", live: "elbow" },
  { key: "wrist", live: "wrist" },
  { key: "flange", live: "flange" },
  { key: "gripper", live: "gripper" },
  { key: "tcp", live: "tcp" },
  { key: "pedestal", at: [PED[0], PED[1] + 10, 16] },
  { key: "ctrl", at: [CAB.x + CAB.w / 2, CAB.y + CAB.d, 30] },
  { key: "pendant", at: [CAB.x + CAB.w + 4, CAB.y + 15, 55] },
  { key: "curtain", at: [LC[0], CUR_Y, 70] },
  { key: "fence", at: [-FX, 40, 110] },
  { key: "feed", at: [-86, PICK[1], BELT_Z + PART.h] },
  { key: "machine", at: [MACH.x + 30, MACH.y + MACH.d, 80] },
  { key: "hazard", at: [-40, HAZ, 0] },
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
  --rc-hair:rgba(240,233,218,.12);--rc-accent:#5C9FAE;--rc-hole:#071A1E;--rc-mesh:rgba(92,159,174,.05);--rc-glass:#0A2228;
  --rc-arm:#173339;--rc-arm-top:#1F4048;--rc-arm-dark:#0F262B;--rc-part:#2A4A50;--rc-part-top:#35585E;
  --rc-zone:rgba(92,159,174,.17);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --rc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --rc-hair:rgba(11,41,27,.14);--rc-accent:#276F81;--rc-hole:#D5CCB6;--rc-mesh:rgba(39,111,129,.04);--rc-glass:#DCE7E4;
  --rc-arm:#FDFBF6;--rc-arm-top:#FFFFFF;--rc-arm-dark:#E6DFCD;--rc-part:#E9E2D1;--rc-part-top:#F6F1E6;
  --rc-zone:rgba(39,111,129,.08);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--rc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:4;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--rc-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate,html[data-level="3"] .iso-plate,html[data-level="4"] .iso-plate{--rows:2}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--rc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.rc-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rc-acc{color:var(--rc-accent);font-weight:600}
.rc-strong{color:var(--anatomy-strong);font-weight:600}
.rc-mute{color:var(--anatomy-muted)}
.rc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.rc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.rc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.rc-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.rc-row{display:flex;gap:4px;height:44px;align-items:center}
.rc-row[hidden]{display:none}
.rc-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--rc-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--rc-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.rc-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.rc-btn:disabled{opacity:.4;cursor:default}
.rc-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--rc-accent);color:var(--rc-accent);font-weight:600}
.rc-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.rc-val{flex:1 1 auto;min-width:0;display:flex;align-items:center;justify-content:center;gap:6px;font:400 12px/1 var(--rc-sans);color:var(--anatomy-muted);white-space:nowrap;overflow:hidden}
.rc-val b{font:600 13px/1 var(--anatomy-mono);color:var(--rc-accent)}
.rc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rc-slot{fill:var(--rc-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rc-window{fill:var(--rc-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rc-mesh{fill:var(--rc-mesh);stroke:none}
.rc-beam{fill:none;stroke:var(--anatomy-faint);stroke-width:var(--anatomy-weight)}
html[data-level="3"] .rc-beam{stroke:var(--rc-accent);stroke-opacity:.45}
[data-beams][data-cut] .rc-beam{stroke:var(--rc-accent);stroke-opacity:.9}
[data-guard]{transition:opacity .4s}
html[data-cobot] [data-guard]{opacity:.14}
[data-l4]{display:none}
html[data-level="4"] [data-l4]{display:inline}
[data-ready] .iso-top,[data-ready] .iso-shade,[data-ready] .iso-fill,[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill{transition:fill .2s}
[data-ready][data-on] .iso-top,[data-ready][data-on] .iso-shade,[data-ready][data-on] .iso-fill,
[data-stack][data-on] .iso-top,[data-stack][data-on] .iso-shade,[data-stack][data-on] .iso-fill{fill:var(--rc-accent)}
.iso-svg path.rc-cap{vector-effect:none;fill:none;stroke-linecap:round;stroke-linejoin:round}
.iso-svg path.rc-cyl{vector-effect:none;fill:none;stroke-linecap:butt}
.rc-cap[data-k="o"],.rc-cyl[data-k="o"]{stroke:var(--anatomy-hi)}
.rc-cap[data-k="f"],.rc-cyl[data-k="f"]{stroke:var(--rc-arm)}
.rc-cap[data-k="t"]{stroke:var(--rc-arm-top)}
.rc-cap[data-k="fd"]{stroke:var(--rc-arm-dark)}
.rc-cap[data-k="fing"]{stroke:var(--anatomy-mid)}
.rc-end{fill:var(--rc-arm-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rc-end-in{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.rc-pt{stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rc-pt[data-f="top"]{fill:var(--rc-part-top)}.rc-pt[data-f="a"]{fill:var(--rc-part)}.rc-pt[data-f="b"]{fill:var(--rc-arm-dark)}
.rc-pt-in{fill:none;stroke:var(--anatomy-faint);stroke-width:var(--anatomy-weight)}
.iso-svg circle.rc-tcp{fill:var(--rc-accent);stroke:var(--anatomy-card);stroke-width:.6px}
.rc-s{fill:none;stroke:var(--rc-accent);stroke-width:1.3px;stroke-linecap:round}
.rc-s-dot{fill:var(--rc-accent);stroke:none}
.rc-s-gap{fill:var(--rc-zone);stroke:none}
.rc-zone{fill:var(--rc-zone);stroke:var(--rc-accent);stroke-width:.7px;stroke-dasharray:3 2.4}
.rc-zone-in{fill:var(--rc-zone);stroke:var(--rc-accent);stroke-width:.9px}
.rc-mark{fill:none;stroke:var(--rc-accent);stroke-width:1.4px}
.rc-mark-dot{fill:var(--rc-accent);stroke:none}
@media (prefers-reduced-motion:reduce){[data-guard],[data-ready] .iso-top,[data-ready] .iso-shade,[data-ready] .iso-fill,[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const MAN_V = ${MAN_V}, GRIP = ${GRIP}, APPROACH = ${APPROACH}, FIXED = ${FIXED};
const ROBOTS = ${JSON.stringify(ROBOTS)}, LOAD = ${JSON.stringify(LOAD)}, TAKT = ${TAKT}, SPEEDS = ${JSON.stringify(SPEEDS)};
const CURTAIN = ${CURTAIN}, STOPS = ${JSON.stringify(STOPS)}, RES = ${JSON.stringify(RES)};
const PED = ${JSON.stringify(PED)}, SH_Z = ${SH_Z}, LINK = ${JSON.stringify(LINK)}, TOOL = ${TOOL};
const PICK = ${JSON.stringify(PICK)}, PLACE = ${JSON.stringify(PLACE)}, BELT_Z = ${BELT_Z}, TABLE_Z = ${TABLE_Z}, PART = ${JSON.stringify(PART)};
const HAZ = ${HAZ}, CUR_Y = ${CUR_Y}, FX = ${FX}, RULER_X = ${RULER_X};
const PARTS = ${JSON.stringify(PARTS)};
const cycleOf = ${cycleOf.toString()};
${safety.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", hand: "hand mode", auto: "automatic", ind: "Industrial robot", cobot: "Cobot", per: "/h", cycle: "cycle", wait: "wait", grips: "grips + approaches", speed: "speed",
      tcpMax: "TCP at most 250 mm/s (ISO 10218-1)", tcpFull: "full speed, nobody inside the cell", path: "pick → place", atLeast: "at least", move: "move", payload: "payload: gripper 4 + part 6 = 10 kg =", of: "of", edge: "on the edge of the payload curve", ok: "room to spare",
      sEq: "S = K × T + C", cEq: "C = 8 × (d − 14)", keep: "≤ 500 mm: K = 2,000 stays", rerun: "> 500 mm → recalculate with K = 1,600", min500: "never under 500 mm", min100: "never under 100 mm", curtainAt: "curtain at 550 mm →", fine: "far enough", close: "too close:", short: "short", stopT: "stop time T", resd: "resolution d",
      takt: "takt", makes: "makes the takt", misses: "misses the takt", pfl: "power and force limiting: half speed", ssmFree: "scanner: full speed while nobody is near", ssmNear: "scanner: someone near → half speed", tapPart: "tap a part to name it", waitMach: "waiting for the machine",
      parts: { j1: ["Axis 1 · base turns", "the whole arm swings round"], j2: ["Axis 2 · shoulder", "lifts the upper arm"], j3: ["Axis 3 · elbow", "lifts the forearm"], wrist: ["Axes 4–6 · wrist", "turn and tilt the hand"], flange: ["Flange", "the gripper bolts on here"], gripper: ["Gripper", "fingers close round the part, on air"], tcp: ["TCP · tool centre point", "every taught position is a TCP position"], pedestal: ["Pedestal", "bolted to the floor"], ctrl: ["Controller", "computer and drives of the arm"], pendant: ["Teach pendant", "move the robot, teach positions; enabling switch"], curtain: ["Light curtain", "breaks a beam → the robot stops"], fence: ["Fence", "door open is robot still"], feed: ["Infeed belt and stop", "the part waits in a known place"], machine: ["Machine", "the robot waits for its door"], hazard: ["Hazard line", "how far the arm can reach"] } }
  : { dec: ",", grp: ".", hand: "handbediening", auto: "automatisch", ind: "Industriële robot", cobot: "Cobot", per: "/u", cycle: "cyclus", wait: "wachten", grips: "grijpen + naderen", speed: "snelheid",
      tcpMax: "TCP hooguit 250 mm/s (ISO 10218-1)", tcpFull: "volle snelheid, niemand in de cel", path: "pakken → neerzetten", atLeast: "minstens", move: "beweging", payload: "payload: grijper 4 + product 6 = 10 kg =", of: "van", edge: "op de rand van de payloadcurve", ok: "ruimte over",
      sEq: "S = K × T + C", cEq: "C = 8 × (d − 14)", keep: "≤ 500 mm: K = 2.000 blijft", rerun: "> 500 mm → opnieuw met K = 1.600", min500: "nooit onder 500 mm", min100: "nooit onder 100 mm", curtainAt: "lichtscherm op 550 mm →", fine: "ver genoeg", close: "te dichtbij:", short: "tekort", stopT: "stoptijd T", resd: "resolutie d",
      takt: "takt", makes: "haalt de takt", misses: "haalt de takt niet", pfl: "kracht- en vermogensbegrenzing: halve snelheid", ssmFree: "scanner: volle snelheid zolang niemand dichtbij is", ssmNear: "scanner: iemand dichtbij → halve snelheid", tapPart: "tik een onderdeel voor de naam", waitMach: "wacht op de machine",
      parts: { j1: ["As 1 · voet draait", "de hele arm zwaait rond"], j2: ["As 2 · schouder", "tilt de bovenarm"], j3: ["As 3 · elleboog", "tilt de onderarm"], wrist: ["As 4–6 · pols", "draaien en kantelen de hand"], flange: ["Flens", "hier zit de grijper op vastgeschroefd"], gripper: ["Grijper", "vingers sluiten om het product, op perslucht"], tcp: ["TCP · tool centre point", "elke ingeleerde positie is een TCP-positie"], pedestal: ["Sokkel", "vastgeschroefd aan de vloer"], ctrl: ["Besturing", "computer en aandrijvingen van de arm"], pendant: ["Teach pendant", "robot bewegen, posities inleren; vrijgaveknop"], curtain: ["Lichtscherm", "straal onderbroken → robot stopt"], fence: ["Hek", "deur open is robot stil"], feed: ["Aanvoerband met aanslag", "het product wacht op een bekende plek"], machine: ["Machine", "de robot wacht op de deur"], hazard: ["Gevarengrens", "zo ver reikt de arm"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grouped = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".rc-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { arm: q("[data-arm]"), floor: q("[data-floor-live]"), mark: q("[data-mark]"), ready: q("[data-ready]"), beams: q("[data-beams]"), stack: { auto: q('[data-stack="auto"]'), hand: q('[data-stack="hand"]') } };
const lines = [...document.querySelectorAll("[data-readout] .rc-line")];
const announcer = document.querySelector(".rc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => t * t * (3 - 2 * t);
const NS = "http://www.w3.org/2000/svg";
const VIEW = towardViewer(P);
const at = (p) => iso(p, P);
const f2 = (v) => v.toFixed(2);
const pathPts = (pts, close) => "M" + pts.map((p) => f2(p[0]) + " " + f2(p[1])).join("L") + (close ? "Z" : "");

// ------------------------------------------------ state
const st = { mode: LVL === 1 ? "hand" : "auto", type: "ind", speed: 100, T: 0.15, d: 30, l4: "pfl", near: false };
function robotNow() {
  if (LVL === 4) return { r: ROBOTS.l4, speed: st.l4 === "pfl" || st.near ? 50 : 100, cobot: true };
  if (LVL === 2) return { r: ROBOTS[st.type], speed: st.speed, cobot: st.type === "cobot" };
  return { r: ROBOTS.ind, speed: 100, cobot: false };
}
function syncRoot() { const c = robotNow().cobot; if (c) document.documentElement.setAttribute("data-cobot", ""); else document.documentElement.removeAttribute("data-cobot"); }

// ------------------------------------------------ the arm: inverse kinematics
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const SHOULDER = [PED[0], PED[1], SH_Z];
function poseOf(tcp) {
  const wrist = add(tcp, [0, 0, TOOL]);
  const yaw = Math.atan2(wrist[1] - PED[1], wrist[0] - PED[0]);
  const u = [Math.cos(yaw), Math.sin(yaw), 0];
  const s = add(SHOULDER, mul(u, 6));
  let d = sub(wrist, s), D = len(d);
  const maxD = LINK[0] + LINK[1] - 0.1;
  if (D > maxD) D = maxD;
  const a = (LINK[0] * LINK[0] - LINK[1] * LINK[1] + D * D) / (2 * D);
  const h = Math.sqrt(Math.max(0, LINK[0] * LINK[0] - a * a));
  const dn = mul(d, 1 / len(d));
  // the elbow bends up, in the vertical plane of the arm
  let up = sub([0, 0, 1], mul(dn, dn[2])); up = mul(up, 1 / (len(up) || 1));
  const elbow = add(add(s, mul(dn, a)), mul(up, h));
  return { yaw, u, n: [-Math.sin(yaw), Math.cos(yaw), 0], s, elbow, wrist, tcp };
}
// a point in cylindrical coordinates round the base axis
const cylOf = (p) => ({ th: Math.atan2(p[1] - PED[1], p[0] - PED[0]), r: Math.hypot(p[0] - PED[0], p[1] - PED[1]), z: p[2] });
const fromCyl = (c) => [PED[0] + c.r * Math.cos(c.th), PED[1] + c.r * Math.sin(c.th), c.z];
function lerpCyl(a, b, t) { const A = cylOf(a), B = cylOf(b); let dth = B.th - A.th; if (dth > Math.PI) dth -= 2 * Math.PI; if (dth < -Math.PI) dth += 2 * Math.PI; return fromCyl({ th: A.th + dth * t, r: A.r + (B.r - A.r) * t, z: A.z + (B.z - A.z) * t }); }
function arcLen(a, b) { let s = 0, p = a; for (let i = 1; i <= 40; i++) { const q2 = lerpCyl(a, b, i / 40); s += len(sub(q2, p)); p = q2; } return s; }
const LIFT = 14;
const PICK_DN = [PICK[0], PICK[1], BELT_Z + PART.h], PICK_UP = add(PICK_DN, [0, 0, LIFT]);
const PLACE_DN = [PLACE[0], PLACE[1], TABLE_Z + 1.2 + PART.h], PLACE_UP = add(PLACE_DN, [0, 0, LIFT]);
const PATH_MM = Math.round(arcLen(PICK_UP, PLACE_UP) * 10 / 10) * 10;
// one cycle as segments: [from, to, seconds, what]
function plan() {
  const { r, speed } = robotNow();
  const hand = LVL === 1 && st.mode === "hand";
  const mv = (a, b, auto) => (hand ? (arcLen(a, b) * 10) / MAN_V : auto);
  const half = r.move / (speed / 100) / 2;
  const segs = [
    [PICK_UP, PLACE_UP, mv(PICK_UP, PLACE_UP, half), "move"],
    [PLACE_UP, PLACE_UP, hand ? 0.2 : r.wait, "wait"],
    [PLACE_UP, PLACE_DN, mv(PLACE_UP, PLACE_DN, APPROACH), "down"],
    [PLACE_DN, PLACE_DN, GRIP, "release"],
    [PLACE_DN, PLACE_UP, mv(PLACE_DN, PLACE_UP, APPROACH), "up"],
    [PLACE_UP, PICK_UP, mv(PLACE_UP, PICK_UP, half), "back"],
    [PICK_UP, PICK_DN, mv(PICK_UP, PICK_DN, APPROACH), "down"],
    [PICK_DN, PICK_DN, GRIP, "grip"],
    [PICK_DN, PICK_UP, mv(PICK_DN, PICK_UP, APPROACH), "up"],
  ];
  return segs;
}
let segs = plan();
let clock = 0; // seconds into the cycle
function sample(t) {
  const total = segs.reduce((s, g) => s + g[2], 0);
  let tt = ((t % total) + total) % total, i = 0;
  while (i < segs.length - 1 && tt > segs[i][2]) { tt -= segs[i][2]; i++; }
  const [a, b, dur, what] = segs[i];
  const f = dur > 0 ? clamp(tt / dur, 0, 1) : 1;
  const hand = LVL === 1 && st.mode === "hand";
  const tcp = lerpCyl(a, b, hand ? f : ease(f));
  // gripper: closed (holding) from the grip to the release
  let open = 1, holding = false, onTable = false;
  if (i <= 2) { open = 0; holding = true; }
  else if (i === 3) { open = ease(f); holding = f < 0.5; onTable = f >= 0.5; }
  else if (i <= 6) { open = 1; onTable = true; }
  else if (i === 7) { open = 1 - ease(f); holding = f > 0.5; }
  else { open = 0; holding = true; }
  return { tcp, open, holding, onTable, seg: i, what, f, total };
}

// ------------------------------------------------ drawing helpers
function mk(tag, cls, kind) { const n = document.createElementNS(NS, tag); n.setAttribute("class", cls); if (kind) n.dataset.k = kind; el.arm.appendChild(n); return n; }
const SEG = (a, b) => { const p = at(a), q2 = at(b); return "M" + f2(p[0]) + " " + f2(p[1]) + "L" + f2(q2[0]) + " " + f2(q2[1]); };
function ringPts(c, axis, r, n) {
  // a circle of radius r round centre c in the plane normal to axis
  const a = axis; let e1 = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const dd = e1[0] * a[0] + e1[1] * a[1] + e1[2] * a[2];
  e1 = sub(e1, mul(a, dd)); e1 = mul(e1, 1 / len(e1));
  const e2 = [a[1] * e1[2] - a[2] * e1[1], a[2] * e1[0] - a[0] * e1[2], a[0] * e1[1] - a[1] * e1[0]];
  const out = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(at(add(c, add(mul(e1, r * Math.cos(t)), mul(e2, r * Math.sin(t)))))); }
  return out;
}
// a cylinder: far end disc, body (butt stroke), near end disc
function Cyl() { return { back: mk("path", "rc-end"), o: mk("path", "rc-cyl", "o"), f: mk("path", "rc-cyl", "f"), front: mk("path", "rc-end"), hub: mk("path", "rc-end-in") }; }
function drawCyl(c, a, b, axis, r, hubR) {
  // a, b: end centres; axis: unit axis from a to b
  const facing = axis[0] * VIEW[0] + axis[1] * VIEW[1] + axis[2] * VIEW[2] * 0;
  const nearEnd = facing >= 0 ? b : a, farEnd = facing >= 0 ? a : b;
  const w = 2 * r * KS;
  c.back.setAttribute("d", pathPts(ringPts(farEnd, axis, r, 28), true));
  c.o.setAttribute("d", SEG(a, b)); c.o.setAttribute("stroke-width", f2(w + 1.1));
  c.f.setAttribute("d", SEG(a, b)); c.f.setAttribute("stroke-width", f2(w));
  c.front.setAttribute("d", pathPts(ringPts(nearEnd, axis, r, 28), true));
  c.hub.setAttribute("d", hubR ? pathPts(ringPts(nearEnd, axis, hubR, 20), true) : "M0 0");
}
function Cap(withTop) { return { o: mk("path", "rc-cap", "o"), f: mk("path", "rc-cap", "f"), t: withTop ? mk("path", "rc-cap", "t") : null }; }
function drawCap(c, a, b, r) {
  const d = SEG(a, b), w = 2 * r * KS;
  c.o.setAttribute("d", d); c.o.setAttribute("stroke-width", f2(w + 1.1));
  c.f.setAttribute("d", d); c.f.setAttribute("stroke-width", f2(w));
  if (c.t) { c.t.setAttribute("d", SEG(add(a, [0, 0, r * 0.45]), add(b, [0, 0, r * 0.45]))); c.t.setAttribute("stroke-width", f2(w * 0.32)); }
}
// the live part: a box with its top and the two faces toward the viewer
function partSvg(cx, cy, z0) {
  const w = PART.w / 2, z1 = z0 + PART.h;
  const C = (x, y, z) => at([cx + x, cy + y, z]);
  const faceX = VIEW[0] > 0 ? w : -w, faceY = VIEW[1] > 0 ? w : -w;
  const fx = [C(faceX, -w, z0), C(faceX, w, z0), C(faceX, w, z1), C(faceX, -w, z1)];
  const fy = [C(-w, faceY, z0), C(w, faceY, z0), C(w, faceY, z1), C(-w, faceY, z1)];
  const top = [C(-w, -w, z1), C(w, -w, z1), C(w, w, z1), C(-w, w, z1)];
  const inner = [C(-w + 3, -w + 3, z1), C(w - 3, -w + 3, z1), C(w - 3, w - 3, z1), C(-w + 3, w - 3, z1)];
  return '<path class="rc-pt" data-f="a" d="' + pathPts(fx, true) + '"/><path class="rc-pt" data-f="b" d="' + pathPts(fy, true) + '"/><path class="rc-pt" data-f="top" d="' + pathPts(top, true) + '"/><path class="rc-pt-in" d="' + pathPts(inner, true) + '"/>';
}

// build the arm's elements in painting order
const partFar = mk("g", "rc-part-g");
const J2 = Cyl();
const UA = Cap(true);
const J3 = Cyl();
const FA = Cap(true);
const WR = Cyl();
const FL = Cyl();
const GB = Cyl();
const fingers = [mk("path", "rc-cap", "o"), mk("path", "rc-cap", "fing"), mk("path", "rc-cap", "o"), mk("path", "rc-cap", "fing")];
const partHeld = mk("g", "rc-part-g");
const tcpDot = mk("circle", "rc-tcp");
let pose = poseOf(PICK_UP), sNow = sample(0);
function drawArm(s) {
  const { cobot } = robotNow();
  const k = cobot ? 0.78 : 1;
  pose = poseOf(s.tcp);
  const { u, n, elbow, wrist, tcp } = pose;
  const sh = SHOULDER;
  // shoulder housing: a drum on axis 2 above the turret, set off toward the near side
  const side = n[0] * VIEW[0] + n[1] * VIEW[1] >= 0 ? 1 : -1;
  const ns = mul(n, side);
  const so = add(sh, mul(u, 6));
  drawCyl(J2, add(so, mul(ns, -9 * k)), add(so, mul(ns, 9 * k)), ns, 10.5 * k, 4.6 * k);
  drawCap(UA, add(so, mul(ns, 5 * k)), add(elbow, mul(ns, 5 * k)), 6.4 * k);
  drawCyl(J3, add(elbow, mul(ns, -1 * k)), add(elbow, mul(ns, 11 * k)), ns, 7.4 * k, 3 * k);
  drawCap(FA, add(elbow, mul(ns, 5 * k)), wrist, 4.8 * k);
  drawCyl(WR, add(wrist, mul(ns, -4.6 * k)), add(wrist, mul(ns, 4.6 * k)), ns, 4 * k, 1.6 * k);
  const fl0 = add(wrist, [0, 0, -3.6 * k]), fl1 = add(wrist, [0, 0, -5.6]);
  drawCyl(FL, fl0, fl1, [0, 0, -1], 4.4 * k, 0);
  const g0 = fl1, g1 = add(wrist, [0, 0, -9.4]);
  drawCyl(GB, g0, g1, [0, 0, -1], 5.6, 0);
  // two fingers, across the arm, closing on the part
  const spread = 7.8 + 3.4 * s.open;
  const ac = n;
  [-1, 1].forEach((sg, i) => {
    const root = add(g1, mul(ac, sg * spread)), tip = add(add(tcp, [0, 0, -PART.h * 0.55]), mul(ac, sg * spread));
    const d = SEG(root, tip);
    fingers[i * 2].setAttribute("d", d); fingers[i * 2].setAttribute("stroke-width", f2(2.2 * KS + 1.1));
    fingers[i * 2 + 1].setAttribute("d", d); fingers[i * 2 + 1].setAttribute("stroke-width", f2(2.2 * KS));
  });
  // the part
  let held = "", far = "";
  if (s.holding) held = partSvg(tcp[0], tcp[1], tcp[2] - PART.h);
  if (!s.holding && !s.onTable) far = partSvg(PICK[0], PICK[1], BELT_Z);
  if (s.onTable) {
    far = partSvg(PLACE[0], PLACE[1], TABLE_Z + 1.2);
    // the next part arrives at the stop as the robot goes back
    if (s.seg >= 5) far = partSvg(PICK[0], PICK[1], BELT_Z) + far;
  }
  partFar.innerHTML = far;
  partHeld.innerHTML = held;
  const p = at(tcp);
  tcpDot.setAttribute("cx", f2(p[0])); tcpDot.setAttribute("cy", f2(p[1])); tcpDot.setAttribute("r", f2(1.2 * KS));
}
function livePoint(key) {
  if (key === "shoulder") return add(SHOULDER, mul(pose.u, 6));
  if (key === "elbow") return pose.elbow;
  if (key === "wrist") return pose.wrist;
  if (key === "flange") return add(pose.wrist, [0, 0, -4.6]);
  if (key === "gripper") return add(pose.wrist, [0, 0, -9]);
  return pose.tcp;
}

// ------------------------------------------------ floor overlays: S marker (level 3), scanner zones (level 4)
function drawFloor() {
  let out = "";
  if (LVL === 3) {
    const r = safety(st.T, st.d);
    const y = HAZ + r.S / 10;
    const gap = [[-FX + 6, HAZ + 1.2, 0.5], [RULER_X, HAZ + 1.2, 0.5], [RULER_X, y, 0.5], [-FX + 6, y, 0.5]].map(at);
    out += '<path class="rc-s-gap" d="' + pathPts(gap, true) + '"/>';
    out += '<path class="rc-s" d="' + SEG([-FX + 6, y, 0.5], [RULER_X, y, 0.5]) + '"/>';
    const dp = at([RULER_X, y, 0.5]);
    out += '<circle class="rc-s-dot" cx="' + f2(dp[0]) + '" cy="' + f2(dp[1]) + '" r="2"/>';
    const lp = at([-FX + 6, y, 0.5]);
    out += '<circle class="rc-s-dot" cx="' + f2(lp[0]) + '" cy="' + f2(lp[1]) + '" r="1.4"/>';
  }
  if (LVL === 4 && st.l4 === "ssm") {
    const ring = (r) => { const pts = []; for (let i = 0; i < 72; i++) { const t = (i / 72) * Math.PI * 2; pts.push(at([PED[0] + r * Math.cos(t), PED[1] + r * Math.sin(t), 0.4])); } return pathPts(pts, true); };
    out += '<path class="rc-zone" d="' + ring(100) + '"/><path class="rc-zone-in" d="' + ring(64) + '"/>';
  }
  if (el.floor.innerHTML !== out) el.floor.innerHTML = out;
}

// ------------------------------------------------ readout
let marked = -1;
const acc = (s) => '<span class="rc-acc">' + s + "</span>";
const strong = (s) => '<span class="rc-strong">' + s + "</span>";
const mute = (s) => '<span class="rc-mute">' + s + "</span>";
function readout() {
  const out = [];
  const { r, speed, cobot } = robotNow();
  if (LVL === 1) {
    if (st.mode === "hand") {
      out.push(strong(T.hand) + " · " + T.tcpMax);
      out.push(T.path + " " + grouped(PATH_MM) + " mm → " + T.atLeast + " " + strong(fmt(PATH_MM / MAN_V, 1) + " s"));
      out.push(mute("1.500 mm / 250 = 6 s".replace("1.500", grouped(1500)).replace(/\\./g, T.grp === "," ? "," : ".")));
    } else {
      out.push(strong(T.auto) + " · " + T.tcpFull);
      out.push(T.path + " " + grouped(PATH_MM) + " mm → " + strong(fmt(r.move / 2, 1) + " s"));
      out.push(mute(T.hand + ": " + T.atLeast + " " + fmt(PATH_MM / MAN_V, 1) + " s"));
    }
  } else if (LVL === 2) {
    const c = cycleOf(r, speed);
    out.push(strong(cobot ? T.cobot + " · 10 kg" : T.ind + " · 20 kg") + " · " + T.speed + " " + speed + " %");
    out.push(T.cycle + " " + fmt(r.move / (speed / 100), 1) + " + " + fmt(r.wait, 1) + " " + T.wait + " + " + fmt(FIXED, 1) + " = " + strong(fmt(c, 1) + " s") + " · " + grouped(3600 / c) + T.per);
    const use = (LOAD.gripper + LOAD.part) / r.payload;
    out.push(T.payload + " " + (use >= 1 ? acc(Math.round(use * 100) + " %") : strong(Math.round(use * 100) + " %")) + " " + T.of + " " + r.payload + " kg");
    out.push(use >= 1 ? acc(T.edge) : mute(T.ok));
  } else if (LVL === 3) {
    const s = safety(st.T, st.d);
    out.push(T.sEq + " = " + grouped(s.K) + " × " + fmt(st.T, 2) + " + " + s.C + " = " + strong(grouped(s.S) + " mm") + (s.raw < s.S ? " (" + (s.rerun ? T.min500 : T.min100) + ")" : ""));
    out.push(T.cEq + " = 8 × (" + st.d + " − 14) = " + s.C + " mm");
    out.push(s.rerun ? T.rerun + ": " + grouped(s.first) + " → " + grouped(s.raw) + " mm" : T.keep);
    out.push(T.curtainAt + " " + (s.S <= CURTAIN ? strong(T.fine) : acc(T.close + " " + grouped(s.S - CURTAIN) + " mm " + T.short)));
  } else {
    const c = cycleOf(r, speed);
    out.push(strong(T.cobot) + " · " + T.speed + " " + speed + " % · " + T.move + " " + fmt(r.move / (speed / 100), 0) + " + " + fmt(r.wait + FIXED, 0) + " = " + strong(fmt(c, 0) + " s"));
    out.push(T.takt + " " + TAKT + " s → " + (c <= TAKT ? strong(T.makes) : acc(T.misses + " (+" + fmt(c - TAKT, 0) + " s)")) + " · " + grouped(3600 / c) + T.per);
    out.push(st.l4 === "pfl" ? T.pfl : st.near ? T.ssmNear : T.ssmFree);
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

function draw() {
  drawArm(sNow);
  drawFloor();
  const waiting = sNow.what === "wait";
  if (el.ready) { if (!waiting || sNow.f > 0.92 || (LVL === 1 && st.mode === "hand")) el.ready.setAttribute("data-on", ""); else el.ready.removeAttribute("data-on"); }
  const hand = LVL === 1 && st.mode === "hand";
  el.stack.auto && (hand ? el.stack.auto.removeAttribute("data-on") : el.stack.auto.setAttribute("data-on", ""));
  el.stack.hand && (hand ? el.stack.hand.setAttribute("data-on", "") : el.stack.hand.removeAttribute("data-on"));
  if (marked >= 0) {
    const pt = PARTS[marked].live ? livePoint(PARTS[marked].live) : PARTS[marked].at;
    const [x, y] = at(pt);
    el.mark.innerHTML = '<circle class="rc-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="rc-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
}

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  if (!still.matches) clock += dt;
  sNow = sample(clock);
  draw();
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { lastT = 0; frame = requestAnimationFrame(tick); } };
function restill() { // reduced motion: one telling still pose, the part carried halfway
  clock = segs[0][2] * 0.5; sNow = sample(clock); draw();
}

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".rc-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const vals = [...document.querySelectorAll("[data-val]")];
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  vals.forEach((v) => { const key = v.dataset.val; v.querySelector("b").textContent = key === "speed" ? st.speed + " %" : fmt(st.T, 2) + " s"; });
  stepBtns.forEach((b) => {
    const key = b.dataset.key, list = key === "speed" ? SPEEDS : STOPS, i = list.indexOf(st[key]);
    b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1;
  });
  radios.filter((b) => b.dataset.set.startsWith("near:")).forEach((b) => { b.disabled = st.l4 !== "ssm"; });
  syncRoot();
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed(replan) {
  if (replan) { const prev = sNow.total || 1, frac = (clock % prev) / prev; segs = plan(); const tot = segs.reduce((s, g) => s + g[2], 0); clock = frac * tot; }
  sync(); readout(); announce();
  if (still.matches) restill(); else { sNow = sample(clock); draw(); run(); }
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  st[key] = key === "d" ? Number(val) : key === "near" ? val === "true" : val;
  changed(true);
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
  const list = key === "speed" ? SPEEDS : STOPS;
  const i = list.indexOf(st[key]);
  const v = list[clamp(i + dir, 0, list.length - 1)];
  if (v === st[key]) return;
  st[key] = v;
  changed(key === "speed");
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
  PARTS.forEach((p, i) => { const [px, py] = at(p.live ? livePoint(p.live) : p.at); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  marked = nearestPart(toView(event));
  draw(); readout(); announce();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) marked = (marked + 1) % PARTS.length;
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) marked = (marked + PARTS.length - 1) % PARTS.length;
  else if (LVL === 2 && (event.key === "+" || event.key === "-")) { stepValue("speed", event.key === "+" ? 1 : -1); return event.preventDefault(); }
  else if (LVL === 3 && (event.key === "+" || event.key === "-")) { stepValue("T", event.key === "+" ? 1 : -1); return event.preventDefault(); }
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
if (still.matches) restill(); else { sNow = sample(clock); draw(); }
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Robotcel",
    hint1: "Tik een onderdeel · kies hand of automatisch",
    hint2: "Tik een onderdeel · kies het type en de snelheid",
    hint3: "Kies de resolutie en de stoptijd T",
    hint4: "Kies de collaboratieve modus",
    mode: "Bedrijfsstand", hand: "Handbediening", auto: "Automatisch",
    type: "Type robot", ind: "Industrieel", cobot: "Cobot",
    speed: "Snelheid", stop: "Stoptijd", res: "Resolutie",
    cmode: "Modus", pfl: "Krachtbegrenzing", ssm: "Scanner",
    who: "Mensen", nobody: "Niemand dichtbij", near: "Iemand dichtbij",
    minus: "Lager", plus: "Hoger",
    label: LABEL_NL,
    aria: "Robotcel met een zesassige robot, een hek en een lichtscherm. Niveau 1 en 2: pijltjes kiezen een onderdeel. Plus en min veranderen de waarde.",
  },
  en: {
    title: "Robot cell",
    hint1: "Tap a part · pick hand or automatic",
    hint2: "Tap a part · pick the type and the speed",
    hint3: "Pick the resolution and the stop time T",
    hint4: "Pick the collaborative mode",
    mode: "Operating mode", hand: "Hand mode", auto: "Automatic",
    type: "Robot type", ind: "Industrial", cobot: "Cobot",
    speed: "Speed", stop: "Stop time", res: "Resolution",
    cmode: "Mode", pfl: "Force limiting", ssm: "Scanner",
    who: "People", nobody: "Nobody near", near: "Someone near",
    minus: "Lower", plus: "Higher",
    label: LABEL_EN,
    aria: "Robot cell with a six-axis robot, a fence and a light curtain. Levels 1 and 2: arrows pick a part. Plus and minus change the value.",
  },
};

const sN = STRINGS.nl;
const radio = (set, key) => `<button type="button" class="rc-btn" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key] ?? key}</button>`;
const radioRaw = (set, text) => `<button type="button" class="rc-btn" role="radio" data-set="${set}" aria-checked="false" tabindex="-1">${text}</button>`;
const stepper = (key, labelKey) =>
  `<button type="button" class="rc-btn" data-step="-" data-key="${key}" aria-label="${sN.minus}" data-t-label="minus">−</button>` +
  `<div class="rc-val" data-val="${key}"><span data-t="${labelKey}">${sN[labelKey]}</span><b></b></div>` +
  `<button type="button" class="rc-btn" data-step="+" data-key="${key}" aria-label="${sN.plus}" data-t-label="plus">+</button>`;
const controls = [
  `<div class="rc-controls">`,
  `<div class="rc-row" data-levels="1" role="radiogroup" aria-label="${sN.mode}" data-t-label="mode">${radio("mode:hand", "hand")}${radio("mode:auto", "auto")}</div>`,
  `<div class="rc-row" data-levels="2" role="radiogroup" aria-label="${sN.type}" data-t-label="type">${radio("type:ind", "ind")}${radio("type:cobot", "cobot")}</div>`,
  `<div class="rc-row" data-levels="2">${stepper("speed", "speed")}</div>`,
  `<div class="rc-row" data-levels="3" role="radiogroup" aria-label="${sN.res}" data-t-label="res">${RES.map((d) => radioRaw(`d:${d}`, `d ${d} mm`)).join("")}</div>`,
  `<div class="rc-row" data-levels="3">${stepper("T", "stop")}</div>`,
  `<div class="rc-row" data-levels="4" role="radiogroup" aria-label="${sN.cmode}" data-t-label="cmode">${radio("l4:pfl", "pfl")}${radio("l4:ssm", "ssm")}</div>`,
  `<div class="rc-row" data-levels="4" role="radiogroup" aria-label="${sN.who}" data-t-label="who">${radio("near:false", "nobody")}${radio("near:true", "near")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="rc-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="rc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="rc-line"></span>'.repeat(4)}</span>`)
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
var st=document.querySelector(".rc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: industrial cycle ${cycleOf(ROBOTS.ind, 100).toFixed(1)} s · cobot ${cycleOf(ROBOTS.cobot, 100).toFixed(1)} s · S(0.15 s, 30 mm) ${safety(0.15, 30).S} mm · S(0.30 s, 30 mm) ${safety(0.3, 30).S} mm · L4 PFL ${cycleOf(ROBOTS.l4, 50)} s / SSM ${cycleOf(ROBOTS.l4, 100)} s`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false });

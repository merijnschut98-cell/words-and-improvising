// Dev tool, not shipped. Builds the standalone figure for the lesson
// "OEE on automated lines" (eng.lines.oee_auto, module Lines and automation).
//
//   node figures/eng.lines.auto/build.mjs            build the page
//   node figures/eng.lines.auto/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.auto.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults:
// prefers-color-scheme, Dutch).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.auto.html");

// ---------------------------------------------------------------- the model
// A four-station assembly line: an operator loads parts (station 1), a robot
// cell welds them (2), two operators fit and check them (3, 4). A buffer of
// four places sits in front of stations 2, 3 and 4.
//   people: 45 s per part, steady (80 per hour)
//   robot:  36 s per part on paper (100 per hour), but
//     breakdowns: availability A = up / (up + down), repairs average 4 min
//     micro-stops: m per hour, 30 s each, eat into the time it is up:
//       performance P = 1 − m·30/3600
//   robot net rate = 100 · A · P.  At A = 90 % and 20 stops/h: 100·0.9·0.833 = 75/h,
//   less than one person's 80/h although its cycle is 9 s shorter.
// Line output is what a long run of the same discrete simulation the page
// animates delivers (the buffers absorb part of each stop, not all of it).
// Line OEE is that output against the line's ideal rate on paper: the slowest
// station's ideal cycle, a person's 45 s (80/h); quality is taken as 100 %.
const CYC = [45, 36, 45, 45];
const ROBOT = 1;
const CAP = [4, 4, 4];
const MICRO = 30; // s per micro-stop
const MTTR = 240; // s, mean repair time of a breakdown
const AVAIL = [80, 85, 90, 95, 99];
const STOPS = [0, 10, 20, 30, 40];
const START = { a: 90, m: 20 };
const TIME_SCALE = 40; // simulated seconds per real second
const IDEAL_LINE = 3600 / Math.max(...CYC.filter((_, i) => i !== ROBOT)); // 80/h, the paper bottleneck
const perfOf = (m) => 1 - (m * MICRO) / 3600;
const robotNet = (a, m) => (3600 / CYC[ROBOT]) * (a / 100) * perfOf(m);

// One step of the line; shared by the build (long runs) and the page (animation).
function lineSim(cfg, seed) {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const L = {
    t: 0, out: 0, next: 1, cfg, outs: [],
    st: CYC.map(() => ({ part: 0, left: 0, carry: 0, done: false, fault: 0, micro: 0, state: "starved", phase: 0 })),
    buf: CAP.map(() => []),
  };
  L.hazards = () => {
    const a = L.cfg.a / 100, m = L.cfg.m;
    const mu = m / (3600 - MICRO * m); // per producing second
    const lam = ((1 + mu * MICRO) * (1 - a)) / (a * MTTR);
    return { mu, lam };
  };
  L.breakdown = () => { const r = L.st[ROBOT]; if (r.fault <= 0) { r.fault = MTTR * (0.6 + 0.8 * rnd()); r.micro = 0; } };
  L.step = (dt) => {
    const { mu, lam } = L.hazards();
    L.t += dt;
    for (let i = CYC.length - 1; i >= 0; i--) {
      const st = L.st[i];
      if (st.part && !st.done) {
        if (i === ROBOT && st.fault > 0) { st.fault -= dt; st.state = "fault"; if (st.fault <= 0) st.fault = 0; }
        else if (i === ROBOT && st.micro > 0) { st.micro -= dt; st.state = "micro"; if (st.micro <= 0) st.micro = 0; }
        else {
          st.state = "run";
          st.left -= dt;
          if (i === ROBOT) {
            const r = rnd();
            if (r < lam * dt) L.breakdown();
            else if (r < (lam + mu) * dt) st.micro = MICRO;
          }
          if (st.left <= 0) { st.done = true; st.carry = -st.left; }
        }
      }
      if (st.part && st.done) {
        if (i === CYC.length - 1) { L.out++; L.outs.push(st.part); st.part = 0; }
        else if (L.buf[i].length < CAP[i]) { L.buf[i].push(st.part); st.part = 0; }
        else { st.state = "blocked"; st.carry = 0; }
      }
      if (!st.part) {
        let id = 0;
        if (i === 0) id = L.next++;
        else if (L.buf[i - 1].length) id = L.buf[i - 1].shift();
        if (id) { st.part = id; st.done = false; st.left = CYC[i] - Math.min(st.carry, CYC[i] * 0.5); st.carry = 0; st.state = "run"; }
        else { st.state = "starved"; st.carry = 0; }
      }
      st.phase = st.part && !st.done ? 1 - st.left / CYC[i] : st.phase;
    }
  };
  return L;
}

// ---------------------------------------------------------------- long runs
const DT = 0.5;
const HOURS = 120;
const TABLE = {};
for (const a of AVAIL) {
  for (const m of STOPS) {
    let total = 0;
    const seeds = [11, 23, 37];
    for (const seed of seeds) {
      const L = lineSim({ a, m }, seed * 7919 + a * 31 + m);
      for (let t = 0; t < 3600; t += DT) L.step(DT);
      const from = L.out;
      for (let t = 0; t < HOURS * 3600; t += DT) L.step(DT);
      total += (L.out - from) / HOURS;
    }
    TABLE[`${a}/${m}`] = Math.round((total / seeds.length) * 10) / 10;
  }
}

// ---------------------------------------------------------------- the lesson's numbers, checked
{
  const fail = (msg) => { throw new Error(`model check: ${msg}`); };
  // rigid line, four machines at 90 %: about 66 %; five at 95 %: about 77 %
  if (Math.round(0.9 ** 4 * 100) !== 66) fail("0.9^4");
  if (Math.round(0.95 ** 5 * 100) !== 77) fail("0.95^5");
  // micro-stops often cost 10 to 20 % of output: 20 per hour of 30 s is 16.7 %
  const share = (20 * MICRO) / 3600;
  if (share < 0.1 || share > 0.2) fail("micro-stop share");
  // the robot is faster on paper ...
  if (!(3600 / CYC[ROBOT] > IDEAL_LINE)) fail("robot not faster on paper");
  // ... but at 90 % availability with 20 stops an hour it delivers less than a person
  const net = robotNet(90, 20);
  if (Math.abs(net - 75) > 1e-9 || !(net < 3600 / 45)) fail(`robot net ${net}`);
  // nearly perfect robot: the people set the pace
  if (TABLE["99/0"] < 79 || TABLE["99/0"] > 80.01) fail(`99/0 gives ${TABLE["99/0"]}`);
  // the line never beats its slowest station, and the default line is held by the robot
  for (const a of AVAIL) for (const m of STOPS) {
    const cap = Math.min(robotNet(a, m), IDEAL_LINE);
    if (TABLE[`${a}/${m}`] > cap + 0.6) fail(`${a}/${m}: ${TABLE[`${a}/${m}`]} > ${cap}`);
  }
  if (TABLE["90/20"] > 75.6 || TABLE["90/20"] < 70) fail(`90/20 gives ${TABLE["90/20"]}`);
  // a fast robot that rarely stops still loses a little to its long breakdowns
  if (!(TABLE["95/0"] < 80)) fail("buffers absorb every breakdown");
}

// ---------------------------------------------------------------- the world
// World units of about 2.5 cm, z up, x along the line (flow to +x), +y toward
// the viewer. The floor is z = 0.
const WIDTH = 600;
const ST = [-96, -32, 32, 96];
const SLOT0 = 15;
const PITCH = 10;
const slotX = (j, k) => ST[j + 1] - SLOT0 - PITCH * k;
const BT = 28; // belt top
const PART = 7;
const PART_H = 6;
const PLATE = { x: -135, y: -64, w: 281, d: 82, r: 4 };
const BED = { x: -126, y: -9, w: 248, d: 18, r: 1.2 };
const BELT = { x: -124, y: -7.4, w: 244, d: 14.8, r: 1 };
const RAIL_Z = [22, 31];
const CELL = { x0: -68, x1: -8, y0: -46, y1: -12, h: 56 };
const PED = [-57, -20];
const SHOULDER = [-57, -20, 35];
const LINK = [20, 20];
const TOOL = 8;
const OP_Y = -21;
const TOTE = { x: 126, y: -10, w: 16, d: 20, r: 1.5 };
const TOTE_H = 15;
const CAB = { x: -86, y: -58, w: 16, d: 11, r: 0.8 };
const CAB_H = 44;

const FIT = [
  ...k.boxCorners(PLATE, -5, 0),
  [CELL.x0, CELL.y0, CELL.h + 2],
  [CELL.x1, CELL.y0, CELL.h + 2],
  [CAB.x, CAB.y, CAB_H + 14],
  [ST[3], -48, 62],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 60);
const ELEVATION = Number(process.env.EL ?? 32);
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
const R = A.recorder(P, {});
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", layer = "back" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, attrs, layer });
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
function ball(name, c, r, style = {}, { extra = "", owner, ...opts } = {}) {
  const shape = R.solid(A.ball(c, r, { name, owner }));
  const svg = S(G.sphereOf(c, r, P), { tone: "mid", crease: "none", ...style }) + extra;
  return put(name, c, svg, [shape], opts);
}

// ---------------------------------------------------------------- floor plate
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLATE, -2), -5, 2, P)}"/>`;
{
  const anchors = k.corners(PLATE, 6);
  const extra =
    L(k.planOutline(k.insetPlan(PLATE, 3.5), 0, P, 3), { tone: "faint" }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.8, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.floor", PLATE, -5, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLATE, -2.2, P, 3), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- conveyor
for (const x of [-118, -70, -16, 62, 112]) {
  for (const y of [-6, 6]) {
    post("conv.foot", x, y, 2.4, 0, 1, { tone: "lo" }, { steps: 18, layer: y > 0 ? "front" : "back" });
    post("conv.leg", x, y, 1.3, 1, RAIL_Z[0], { tone: "mid", crease: "none" }, { steps: 14, layer: y > 0 ? "front" : "back" });
  }
}
box("conv.bed", BED, RAIL_Z[0], BT - 2, { tone: "mid" }, { steps: 3, bevel: 0.3, inner: L(k.sideSeam(BED, RAIL_Z[0] + 1.5, P, 3), { tone: "faint" }) });
{
  const slats = [];
  for (let x = BELT.x + 3; x <= BELT.x + BELT.w - 2; x += 5) slats.push(k.lineOnTop([x, BELT.y], [x, BELT.y + BELT.d], BT, P));
  box("conv.belt", BELT, BT - 2, BT, { tone: "lo", crease: "none" }, { steps: 3, inner: L(slats.join(""), { tone: "faint" }) });
}
// the side guides, each on brackets: the back one behind the parts, the front one before them
for (const [y0, layer] of [[-9.6, "back"], [8.2, "front"]]) {
  const rail = { x: BED.x + 2, y: y0, w: BED.w - 4, d: 1.4, r: 0.4 };
  const marks = [];
  if (layer === "front") {
    // buffer places marked on the guide: one tick per place
    CAP.forEach((n, j) => { for (let q = 0; q < n; q++) marks.push(k.lineOnTop([slotX(j, q), y0 + 0.2], [slotX(j, q), y0 + 1.2], BT + 3, P)); });
  }
  box("conv.guide", rail, BT + 0.8, BT + 3, { tone: "mid" }, { steps: 2, layer, extra: marks.length ? L(marks.join(""), { tone: "lo" }) : "" });
  for (const x of [-116, -74, -4, 50, 108]) {
    box("conv.bracket", { x: x - 1, y: y0 > 0 ? 8.2 : -9.6, w: 2, d: 1.4, r: 0.2 }, BT - 2, BT + 0.8, { tone: "lo" }, { steps: 1, layer });
  }
}
// head and tail drums
for (const x of [BED.x - 3.2, BED.x + BED.w + 3.2]) {
  discAt("conv.drum", frameY([x, -8, BT - 3.2]), 0, 16, 3.2, { tone: "mid" }, { owner: "conv" });
}
// drive at the tail, on the near side: gearbox and motor
{
  const gx = BED.x + BED.w - 3;
  box("conv.gearbox", { x: gx - 4, y: 9, w: 8, d: 5, r: 0.6 }, BT - 9, BT - 1, { tone: "mid" }, { steps: 2, bevel: 0.3, layer: "front", extra: Dt([[gx - 2.6, 14, BT - 2.2], [gx + 2.6, 14, BT - 2.2]].map(at), { size: 0.4 }) });
  const FM = frameX([gx - 4, 12.6, BT - 5]);
  const fins = G.ribsOf(FM, -13.4, -0.6, 3.4, 14, P, { fade: [0.05, 0.45], seams: true });
  discAt("conv.motor", FM, -14, 0, 3.4, { tone: "hi", crease: "lo" }, { owner: "conv", layer: "front", inner: k.fadedSvg(fins, { tone: "lo" }) });
  discAt("conv.motor-cap", FM, -16, -14, 2.8, { tone: "mid" }, { owner: "conv", layer: "front" });
}

// ---------------------------------------------------------------- out tote
{
  const mouth = k.insetPlan(TOTE, 1.2);
  const extra = `<path class="iso-shade la-void" data-shade="0" d="${k.planOutline(mouth, TOTE_H, P, 3)}"/>` + L(k.planOutline(mouth, TOTE_H, P, 3), { tone: "lo" });
  box("tote", TOTE, 0, TOTE_H, { tone: "mid" }, { steps: 3, bevel: 0.4, layer: "front", inner: L(k.sideSeam(TOTE, TOTE_H - 2.4, P, 3), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- the robot cell
// guard posts with feet, mesh panels behind the belt, a light curtain at the front
const CORNERS = [[CELL.x0, CELL.y0], [CELL.x1, CELL.y0], [CELL.x0, CELL.y1], [CELL.x1, CELL.y1]];
for (const [x, y] of CORNERS) {
  box("cell.foot", plan(x, y, 4.6, 4.6, 0.4), 0, 0.8, { tone: "lo" }, { steps: 1, extra: Dt(k.corners(plan(x, y, 4.6, 4.6, 0.4), 0.8).map(([px, py]) => at([px, py, 0.8])), { size: 0.35 }) });
  box("cell.post", plan(x, y, 2, 2, 0.2), 0.8, CELL.h, { tone: "mid" }, { steps: 1, extra: Dt([at([x, y, CELL.h])], { size: 0.4 }) });
}
// mesh panels: a frame and a woven grid, drawn in their own plane
function meshPanel(axis, fixed, u0, u1, z0, z1) {
  const point = (u, z) => (axis === "y" ? [u, fixed, z] : [fixed, u, z]);
  const frame = k.pathOf([point(u0, z0), point(u1, z0), point(u1, z1), point(u0, z1)].map(at), true);
  const inner = [];
  const n = Math.round((u1 - u0) / 3.2);
  for (let q = 1; q < n; q++) { const u = u0 + ((u1 - u0) * q) / n; inner.push(k.pathOf([at(point(u, z0)), at(point(u, z1))])); }
  const rows = Math.round((z1 - z0) / 3.2);
  for (let q = 1; q < rows; q++) { const z = z0 + ((z1 - z0) * q) / rows; inner.push(k.pathOf([at(point(u0, z)), at(point(u1, z))])); }
  return `<path class="la-mesh" d="${frame}"/>` + L(inner.join(""), { tone: "faint" }) + L(frame, { tone: "lo" });
}
const meshBack = meshPanel("y", CELL.y0, CELL.x0 + 1, CELL.x1 - 1, 3, CELL.h - 2);
const meshLeft = meshPanel("x", CELL.x0, CELL.y0 + 1, CELL.y1 - 1, 3, CELL.h - 2);
const meshRight = meshPanel("x", CELL.x1, CELL.y0 + 1, CELL.y1 - 1, 3, CELL.h - 2);
// light curtain at the open front: emitter and receiver columns
for (const x of [CELL.x0 - 3, CELL.x1 + 3]) {
  const y = 13;
  box("cell.lc-base", plan(x, y, 5, 5, 0.5), 0, 1, { tone: "lo" }, { steps: 1, layer: "front" });
  const face = x < -48 ? x + 1.3 : x - 1.3;
  const lenses = [];
  for (let z = 6; z <= 44; z += 2.4) lenses.push(at([face, y, z]));
  box("cell.lc", plan(x, y, 2.6, 2.6, 0.3), 1, 47, { tone: "mid" }, { steps: 1, layer: "front", extra: Dt(lenses, { size: 0.3, tone: "lo" }) + Dt([at([x, y, 47])], { size: 0.4, tone: "hi" }) });
}
// robot pedestal
{
  const bolts = Array.from({ length: 6 }, (_, q) => [PED[0] + 6.6 * Math.cos((q / 6) * Math.PI * 2 + 0.3), PED[1] + 6.6 * Math.sin((q / 6) * Math.PI * 2 + 0.3)]);
  post("robot.flange", PED[0], PED[1], 8, 0, 1.4, { tone: "lo" }, { steps: 40, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, 1.4])), { size: 0.4 }) });
  post("robot.column", PED[0], PED[1], 5, 1.4, 19, { tone: "mid", crease: "none" }, { steps: 32, inner: L(k.sideArc(PED[0], PED[1], 5, 10, P, 24), { tone: "faint" }) });
  const top = Array.from({ length: 8 }, (_, q) => [PED[0] + 5.9 * Math.cos((q / 8) * Math.PI * 2), PED[1] + 5.9 * Math.sin((q / 8) * Math.PI * 2)]);
  post("robot.plate", PED[0], PED[1], 7, 19, 21, { tone: "mid" }, { steps: 40, bevel: 0.3, extra: Dt(top.map(([x, y]) => at([x, y, 21])), { size: 0.35 }) });
  post("robot.base", PED[0], PED[1], 5.8, 21, 26, { tone: "hi", crease: "lo" }, { steps: 36, inner: L(k.sideArc(PED[0], PED[1], 5.8, 23.5, P, 28), { tone: "faint" }) });
  post("robot.turret", PED[0], PED[1], 4.8, 26, 30, { tone: "hi", crease: "lo" }, { steps: 32 });
}
// robot controller beside the cell, its stack light on top
{
  const fy = CAB.y + CAB.d;
  const vents = [];
  for (const z of [6, 8, 10]) vents.push(k.pathOf(k.roundedPlan({ x: CAB.x + 4, y: z, w: 8, d: 0.9, r: 0.45 }, 3).map(([u, w]) => at([u, fy, w])), true));
  const door = k.pathOf([[CAB.x + 1.2, fy, 2.4], [CAB.x + CAB.w - 1.2, fy, 2.4], [CAB.x + CAB.w - 1.2, fy, CAB_H - 1.4], [CAB.x + 1.2, fy, CAB_H - 1.4]].map(at), true);
  const label = k.pathOf([[CAB.x + 3, fy, 34], [CAB.x + 10, fy, 34], [CAB.x + 10, fy, 38], [CAB.x + 3, fy, 38]].map(at), true);
  const rules = [35.2, 36.4].map((z) => k.segment([CAB.x + 4, fy, z], [CAB.x + 8.6, fy, z], P)).join("");
  box("cab.body", CAB, 0, CAB_H, { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    inner: L(door, { tone: "lo" }) + L(vents.join(""), { tone: "lo" }) + `<path class="la-card" d="${label}"/>` + L(rules, { tone: "lo", free: true }),
    extra: Dt([[CAB.x + 2.2, fy, 3.4], [CAB.x + 2.2, fy, CAB_H - 2.4]].map(at), { size: 0.4 }),
  });
  discAt("cab.switch", frameY([CAB.x + CAB.w - 4, fy, 26]), 0, 1, 2.2, { tone: "mid" }, {});
  discAt("cab.knob", frameY([CAB.x + CAB.w - 4, fy, 26]), 1, 2.4, 1.1, { tone: "hi", crease: "none" }, { extra: L(k.segment([CAB.x + CAB.w - 4, fy + 2.4, 24.9], [CAB.x + CAB.w - 4, fy + 2.4, 27.1], P), { tone: "lo" }) });
  // teach pendant hanging on the side
  box("cab.pendant", { x: CAB.x + CAB.w, y: CAB.y + 2.5, w: 1.6, d: 6, r: 0.5 }, 18, 27, { tone: "hi", crease: "lo" }, { steps: 2, extra: Dt([at([CAB.x + CAB.w + 1.6, CAB.y + 5.5, 25])], { size: 0.45, tone: "mid" }) });
  // stack light: base, three lenses, cap
  const sx = CAB.x + 4, sy = CAB.y + 4;
  post("cab.stack-base", sx, sy, 2, CAB_H, CAB_H + 2, { tone: "mid" }, { steps: 20 });
  ["run", "stop", "fault"].forEach((name, q) => {
    post(`cab.stack-${name}`, sx, sy, 1.7, CAB_H + 2 + q * 3.2, CAB_H + 5 + q * 3.2, { tone: "mid", crease: "lo" }, { steps: 20, attrs: ` data-stack="${name}"` });
    if (q < 2) post("cab.stack-ring", sx, sy, 1.85, CAB_H + 5 + q * 3.2, CAB_H + 5.2 + q * 3.2, { tone: "lo", crease: "none" }, { steps: 20 });
  });
  post("cab.stack-cap", sx, sy, 1.85, CAB_H + 11.4, CAB_H + 12.6, { tone: "mid" }, { steps: 20, extra: Dt([at([sx, sy, CAB_H + 12.6])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- manual stations
function operator(index, x) {
  const y = OP_Y;
  const mat = plan(x, y + 1, 22, 18, 1.2);
  const ribs = [];
  for (let u = mat.x + 2; u <= mat.x + mat.w - 2; u += 2) ribs.push(k.lineOnTop([u, mat.y + 1.2], [u, mat.y + mat.d - 1.2], 0.8, P));
  box(`op${index}.mat`, mat, 0, 0.8, { tone: "lo", crease: "none" }, { steps: 2, inner: "", extra: L(ribs.join(""), { tone: "faint" }) + L(k.planOutline(k.insetPlan(mat, 1.2), 0.8, P, 2), { tone: "lo" }) });
  for (const side of [-1, 1]) {
    box(`op${index}.shoe`, { x: x + side * 3.2 - 2.2, y: y - 2.6, w: 4.4, d: 7.4, r: 1.4 }, 0.8, 3, { tone: "lo" }, { steps: 3, owner: `op${index}` });
    post(`op${index}.leg`, x + side * 3.2, y, 2.3, 3, 28, { tone: "mid", crease: "none" }, { steps: 20, owner: `op${index}` });
  }
  box(`op${index}.hips`, plan(x, y, 12.4, 6.2, 2.2), 28, 31, { tone: "mid" }, { steps: 4, owner: `op${index}` });
  const torso = plan(x, y, 14, 7, 3);
  box(`op${index}.torso`, torso, 31, 49, { tone: "mid" }, { steps: 5, owner: `op${index}`, inner: L(k.sideSeam(torso, 36, P, 5), { tone: "faint" }) });
  post(`op${index}.neck`, x, y, 1.8, 49, 51.4, { tone: "mid", crease: "none" }, { steps: 14, owner: `op${index}` });
  ball(`op${index}.head`, [x, y, 55.6], 4.4, { tone: "mid" }, { owner: `op${index}` });
}
function rack(index, x) {
  const y0 = -56, d = 10;
  for (const side of [-1, 1]) {
    const fx = x + side * 10;
    box(`rack${index}.side`, { x: fx - 0.8, y: y0, w: 1.6, d, r: 0.3 }, 0, 36, { tone: "mid" }, { steps: 1, extra: Dt([at([fx, y0 + d / 2, 36])], { size: 0.35 }) });
  }
  for (const z of [12, 26]) {
    box(`rack${index}.shelf`, { x: x - 9.2, y: y0 + 0.4, w: 18.4, d: d - 0.8, r: 0.3 }, z, z + 1.2, { tone: "lo" }, { steps: 1 });
    for (const bx of [x - 4.4, x + 4.4]) {
      const bin = plan(bx, y0 + d / 2, 8, 8.4, 0.8);
      const mouth = k.insetPlan(bin, 0.8);
      box(`rack${index}.bin`, bin, z + 1.2, z + 6.2, { tone: "hi", crease: "lo" }, {
        steps: 2,
        extra: `<path class="iso-shade la-void" data-shade="0" d="${k.planOutline(mouth, z + 6.2, P, 2)}"/>` + L(k.planOutline(mouth, z + 6.2, P, 2), { tone: "lo" }),
      });
    }
  }
  // the station lamp on the right-hand upright: lit while the station works
  const lx = x + 10;
  post(`rack${index}.lamp-base`, lx, y0 + d / 2, 1.6, 36, 37.4, { tone: "mid" }, { steps: 16 });
  post(`rack${index}.lamp`, lx, y0 + d / 2, 1.3, 37.4, 40.4, { tone: "mid", crease: "lo" }, { steps: 16, attrs: ` data-lamp="${index}"`, extra: Dt([at([lx, y0 + d / 2, 40.4])], { size: 0.35 }) });
}
// raw parts on a pallet behind station 1
{
  const pal = { x: ST[0] - 12, y: -58, w: 22, d: 14, r: 0.5 };
  for (const dx of [1, 9.5, 18]) box("pallet.runner", { x: pal.x + dx, y: pal.y, w: 3, d: pal.d, r: 0.2 }, 0, 2.4, { tone: "lo" }, { steps: 1 });
  const deck = [];
  for (let u = pal.x + 2.5; u < pal.x + pal.w - 1; u += 4) deck.push(k.lineOnTop([u, pal.y + 0.3], [u, pal.y + pal.d - 0.3], 3.6, P));
  box("pallet.deck", pal, 2.4, 3.6, { tone: "mid" }, { steps: 1, extra: L(deck.join(""), { tone: "lo" }) });
  for (const level of [0, 1]) {
    for (const dx of [-8, 0]) {
      for (const dy of [3.5]) {
        const blk = plan(ST[0] + dx + 2, pal.y + dy + 3.5, PART, PART, 0.6);
        box("pallet.block", blk, 3.6 + level * PART_H, 3.6 + (level + 1) * PART_H, { tone: "mid", crease: "lo" }, { steps: 2, bevel: 0.3 });
      }
    }
  }
}
[0, 2, 3].forEach((i) => operator(i, ST[i]));
rack(2, ST[2]);
rack(3, ST[3]);
// station 1 gets a small lamp post next to its pallet
{
  const lx = ST[0] + 14, ly = -40;
  box("st0.post-foot", plan(lx, ly, 4, 4, 0.4), 0, 0.8, { tone: "lo" }, { steps: 1 });
  post("st0.post", lx, ly, 0.9, 0.8, 36, { tone: "mid", crease: "none" }, { steps: 12 });
  post("rack0.lamp-base", lx, ly, 1.6, 36, 37.4, { tone: "mid" }, { steps: 16 });
  post("rack0.lamp", lx, ly, 1.3, 37.4, 40.4, { tone: "mid", crease: "lo" }, { steps: 16, attrs: ' data-lamp="0"', extra: Dt([at([lx, ly, 40.4])], { size: 0.35 }) });
}

// ---------------------------------------------------------------- moving parts (live)
// A pool of parts built at x = 0 and moved along x. Features appear as the
// part passes the stations: weld spots (robot), a cover plate (3), a check label (4).
const POOL = 26;
function partSvg(slot) {
  const p = plan(0, 0, PART, PART, 0.6);
  const top = BT + PART_H;
  const block = k.solidSvg(k.slabOf(p, BT, PART_H, P, 2, 0.3), { tone: "hi", crease: "lo", inner: L(k.sideSeam(p, BT + 2, P, 2), { tone: "faint" }) });
  const welds = `<g class="la-op" data-op="2">${Dt([[2, -2], [2, 0], [2, 2]].map(([x, y]) => at([x, y, top])), { size: 0.55, tone: "hi" })}</g>`;
  const cover = k.solidSvg(k.slabOf(plan(-1, 0, 3.6, 4.6, 0.4), top, 1, P, 1), { tone: "mid", crease: "none" });
  const coverG = `<g class="la-op" data-op="3">${cover}</g>`;
  const fy = PART / 2;
  const tag = k.pathOf([[-2.2, fy, BT + 2.2], [1.2, fy, BT + 2.2], [1.2, fy, BT + 4.4], [-2.2, fy, BT + 4.4]].map(at), true);
  const tagG = `<g class="la-op" data-op="4"><path class="la-tag" d="${tag}"/></g>`;
  return `<g class="la-part" data-slot="${slot}" data-ops="0" style="display:none">${block}${welds}${coverG}${tagG}</g>`;
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
// mesh panels are see-through: the back and the far side before the robot, the
// near side (x = CELL.x1, nearer the viewer at this azimuth) after it.
const body = [
  halo,
  ...layerOf("back"),
  `<g data-layer="parts">${Array.from({ length: POOL }, (_, slot) => partSvg(slot)).join("")}</g>`,
  `<g data-layer="arms"></g>`,
  ...layerOf("front"),
];
// put the mesh panels into the back layer in their places: back and left right after the floor, right after the robot
{
  const i0 = body.findIndex((s) => s.includes('data-name="cell.post"'));
  body.splice(i0, 0, `<g data-name="cell.mesh-back">${meshBack}${meshLeft}</g>`);
  const i1 = body.findIndex((s) => s.includes('data-name="robot.turret"'));
  body.splice(i1 + 1, 0, `<g data-name="cell.mesh-right">${meshRight}</g>`);
}

const LABEL_NL =
  "Een assemblagelijn met vier stations langs een transportband. Station 1: een operator legt ruwe blokjes van een pallet op de band. Station 2: een lasrobot op een sokkel in een robotcel met hekwerk en een lichtscherm aan de voorkant; de robotbesturing met een signaalzuil staat naast de cel. Stations 3 en 4: operators op een antivermoeidheidsmat met een stelling met bakken en een stationslamp. Voor stations 2, 3 en 4 is plaats voor vier delen op de band. Aan het eind vallen de delen in een bak.";
const LABEL_EN =
  "An assembly line with four stations along a belt conveyor. Station 1: an operator loads raw blocks from a pallet onto the belt. Station 2: a welding robot on a pedestal inside a guarded cell with mesh panels and a light curtain at the front; the robot controller with a stack light stands beside the cell. Stations 3 and 4: operators on anti-fatigue mats with a rack of bins and a station lamp. In front of stations 2, 3 and 4 the belt holds up to four parts. At the end the parts drop into a tote.";

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
  --la-hair:rgba(240,233,218,.12);--la-accent:#5C9FAE;--la-void:#081A1E;--la-mesh:rgba(92,159,174,.05);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --la-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --la-hair:rgba(11,41,27,.14);--la-accent:#276F81;--la-void:#C9C0AA;--la-mesh:rgba(39,111,129,.04);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--la-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 170px);min-height:300px;padding:26px 4px 142px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--la-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--la-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:66px!important;max-width:40%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:66px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.la-line{display:block;white-space:nowrap}
.la-acc{color:var(--la-accent);font-weight:600}
.la-strong{color:var(--anatomy-strong);font-weight:600}
.la-mute{color:var(--anatomy-muted)}
.la-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.la-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.la-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.la-controls{position:absolute;left:10px;right:10px;bottom:8px;display:flex;gap:10px;justify-content:space-between}
.la-group{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:2px}
.la-group-label{font:400 10px/1.2 var(--la-sans);color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:2px}
.la-step{display:flex;align-items:center;gap:4px}
.la-btn{flex:0 0 44px;width:44px;height:44px;padding:0;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 18px/1 var(--la-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--la-hair);display:inline-flex;align-items:center;justify-content:center}
.la-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.la-btn:disabled{opacity:.35;cursor:default}
.la-val{flex:1 1 auto;min-width:0;text-align:center;font:600 13px/1 var(--anatomy-mono);color:var(--la-accent);white-space:nowrap}
.la-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.la-mesh{fill:var(--la-mesh);stroke:none}
.la-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.iso-shade[data-shade="0"].la-void{fill:var(--la-void)}
.la-part .la-op{display:none}
.la-part[data-ops="2"] .la-op[data-op="2"],.la-part[data-ops="3"] .la-op[data-op="2"],.la-part[data-ops="4"] .la-op[data-op="2"],
.la-part[data-ops="3"] .la-op[data-op="3"],.la-part[data-ops="4"] .la-op[data-op="3"],.la-part[data-ops="4"] .la-op[data-op="4"]{display:inline}
.la-tag{fill:var(--la-accent);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight)}
.iso-svg path.la-cap{vector-effect:none;fill:none;stroke-linecap:round;stroke-linejoin:round}
.la-cap[data-k="o"]{stroke:var(--anatomy-hi)}
.la-cap[data-k="f"]{stroke:var(--anatomy-face)}
.la-cap[data-k="t"]{stroke:var(--anatomy-top)}
.la-cap[data-k="po"]{stroke:var(--anatomy-mid)}
.la-cap[data-k="pf"]{stroke:var(--anatomy-shade-3)}
.iso-svg circle.la-tip{fill:var(--anatomy-mid);stroke:none}
.iso-svg circle.la-tip[data-on]{fill:var(--la-accent)}
.iso-svg circle.la-spark{fill:var(--la-accent);stroke:none}
[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill,[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .25s}
[data-stack="run"][data-on] .iso-top,[data-stack="run"][data-on] .iso-shade,[data-stack="run"][data-on] .iso-fill,
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--la-accent)}
[data-stack="stop"][data-on] .iso-top,[data-stack="stop"][data-on] .iso-shade,[data-stack="stop"][data-on] .iso-fill,
[data-stack="fault"][data-on] .iso-top,[data-stack="fault"][data-on] .iso-shade,[data-stack="fault"][data-on] .iso-fill{fill:var(--anatomy-hi)}
@media (prefers-reduced-motion:reduce){[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill,[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const CYC = ${JSON.stringify(CYC)}, CAP = ${JSON.stringify(CAP)}, ROBOT = ${ROBOT}, MICRO = ${MICRO}, MTTR = ${MTTR};
const AVAIL = ${JSON.stringify(AVAIL)}, STOPS = ${JSON.stringify(STOPS)}, START = ${JSON.stringify(START)};
const TABLE = ${JSON.stringify(TABLE)};
const IDEAL_LINE = ${IDEAL_LINE}, TS = ${TIME_SCALE};
const ST = ${JSON.stringify(ST)}, SLOT0 = ${SLOT0}, PITCH = ${PITCH}, BT = ${BT}, PART_H = ${PART_H};
const SHOULDER = ${JSON.stringify(SHOULDER)}, LINK = ${JSON.stringify(LINK)}, TOOL = ${TOOL}, OP_Y = ${OP_Y};
const BELT_END = ${BED.x + BED.w}, TOTE_X = ${TOTE.x + TOTE.w / 2}, TOTE_H = ${TOTE_H};
const slotX = (j, k) => ST[j + 1] - SLOT0 - PITCH * k;
const perfOf = ${perfOf.toString()};
const robotNet = (a, m) => (3600 / CYC[ROBOT]) * (a / 100) * perfOf(m);
${lineSim.toString()}
const at = (point) => iso(point, P);

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { cyc: "cycle", net: "net", robot: "robot", person: "person", line: "line", per: "/h", oee: "line OEE", vs: "vs 45 s", bn: "bottleneck", people: "people", fault: "Robot breakdown", back: "Robot running again", dec: "." }
  : { cyc: "cyclus", net: "netto", robot: "robot", person: "mens", line: "lijn", per: "/u", oee: "lijn-OEE", vs: "tegen 45 s", bn: "knelpunt", people: "mensen", fault: "Storing aan de robot", back: "Robot draait weer", dec: "," };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);

const stage = document.querySelector(".la-stage");
const svg = stage.querySelector("svg");
const partsLayer = svg.querySelector('[data-layer="parts"]');
const armsLayer = svg.querySelector('[data-layer="arms"]');
const pool = [...partsLayer.querySelectorAll(".la-part")];
const lamps = [0, 2, 3].map((i) => [i, svg.querySelector('[data-lamp="' + i + '"]')]);
const stack = Object.fromEntries(["run", "stop", "fault"].map((n) => [n, svg.querySelector('[data-stack="' + n + '"]')]));
const lines = [...document.querySelectorAll("[data-readout] .la-line")];
const announcer = document.querySelector(".la-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const NS = "http://www.w3.org/2000/svg";

// ------------------------------------------------ arms: capsules drawn as round-capped strokes
function cap(kind, width) {
  const el = document.createElementNS(NS, "path");
  el.setAttribute("class", "la-cap"); el.dataset.k = kind; el.setAttribute("stroke-width", width.toFixed(2));
  armsLayer.appendChild(el); return el;
}
const W = (w) => w * KS;
const SEG = (a, b) => { const p = at(a), q = at(b); return "M" + p[0].toFixed(2) + " " + p[1].toFixed(2) + "L" + q[0].toFixed(2) + " " + q[1].toFixed(2); };
const people = [0, 2, 3].map((i) => {
  const arms = [-1, 1].map(() => ({ o: cap("po", W(3.6) + 1.2), f: cap("pf", W(3.6)) }));
  return { i, arms };
});
const robot = {
  shO: cap("o", W(9) + 1.2), shF: cap("f", W(9)),
  uaO: cap("o", W(5.4) + 1.2), uaF: cap("f", W(5.4)), uaT: cap("t", W(2)),
  faO: cap("o", W(4.4) + 1.2), faF: cap("f", W(4.4)), faT: cap("t", W(1.6)),
  toO: cap("o", W(2.6) + 1.2), toF: cap("f", W(2.6)),
};
const tip = document.createElementNS(NS, "circle"); tip.setAttribute("class", "la-tip"); tip.setAttribute("r", (KS * 1.1).toFixed(2)); armsLayer.appendChild(tip);
const spark = document.createElementNS(NS, "circle"); spark.setAttribute("class", "la-spark"); spark.setAttribute("r", "0"); armsLayer.appendChild(spark);

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function elbow(s, h, l1, l2, pole) {
  let d = sub(h, s); let D = len(d);
  const maxD = l1 + l2 - 0.05;
  if (D > maxD) { h = add(s, mul(d, maxD / D)); d = sub(h, s); D = maxD; }
  const u = mul(d, 1 / D);
  const a = (l1 * l1 - l2 * l2 + D * D) / (2 * D);
  const r = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  let n = sub(pole, mul(u, dot(pole, u))); const nl = len(n) || 1; n = mul(n, 1 / nl);
  return [add(add(s, mul(u, a)), mul(n, r)), h];
}
// The robot's path through one cycle: home, three weld spots on the part's top, home.
const RX = ST[ROBOT];
const HOME = [RX - 3, -9, BT + PART_H + 15];
const SPOTS = [[RX + 2, -2], [RX + 2, 0], [RX + 2, 2]].map(([x, y]) => [x, y, BT + PART_H + 0.3]);
function robotTip(phase) {
  // 0..0.18 approach, three dwells, 0.82..1 back home
  if (phase <= 0 || phase >= 1) return { p: HOME, weld: false };
  const ease = (t) => t * t * (3 - 2 * t);
  if (phase < 0.18) { const t = ease(phase / 0.18); return { p: add(mul(HOME, 1 - t), mul(add(SPOTS[0], [0, 0, 1.5]), t)), weld: false }; }
  if (phase > 0.82) { const t = ease((phase - 0.82) / 0.18); return { p: add(mul(add(SPOTS[2], [0, 0, 1.5]), 1 - t), mul(HOME, t)), weld: false }; }
  const u = (phase - 0.18) / 0.64 * 3; const q = Math.min(2, Math.floor(u)); const f = u - q;
  const lift = f < 0.25 ? 1.5 * (1 - f / 0.25) : f > 0.75 ? 1.5 * ((f - 0.75) / 0.25) : 0;
  let p = add(SPOTS[q], [0, 0, lift]);
  if (f > 0.75 && q < 2) { const t = (f - 0.75) / 0.25; p = add(mul(add(SPOTS[q], [0, 0, 1.5]), 1 - t), mul(add(SPOTS[q + 1], [0, 0, 1.5]), t)); }
  return { p, weld: f > 0.25 && f < 0.75 };
}
let tipNow = HOME.slice();
function drawRobot(target, weld, t) {
  tipNow = target;
  const wrist = add(target, [0, 0, TOOL]);
  const s = SHOULDER;
  const yaw = [wrist[0] - s[0], wrist[1] - s[1], 0]; const yl = len(yaw) || 1;
  const pole = [-yaw[0] / yl * 0.3, -yaw[1] / yl * 0.3, 1];
  const [e, w] = elbow(s, wrist, LINK[0], LINK[1], pole);
  const base = [s[0], s[1], 29];
  robot.shO.setAttribute("d", SEG(base, s)); robot.shF.setAttribute("d", SEG(base, s));
  const ua = SEG(s, e), fa = SEG(e, w), to = SEG(w, target);
  robot.uaO.setAttribute("d", ua); robot.uaF.setAttribute("d", ua);
  robot.uaT.setAttribute("d", SEG(add(s, [0, 0, 1.4]), add(e, [0, 0, 1.4])));
  robot.faO.setAttribute("d", fa); robot.faF.setAttribute("d", fa);
  robot.faT.setAttribute("d", SEG(add(e, [0, 0, 1.1]), add(w, [0, 0, 1.1])));
  robot.toO.setAttribute("d", to); robot.toF.setAttribute("d", to);
  const p = at(target);
  tip.setAttribute("cx", p[0].toFixed(2)); tip.setAttribute("cy", p[1].toFixed(2));
  if (weld) tip.setAttribute("data-on", ""); else tip.removeAttribute("data-on");
  const sr = weld ? KS * (1.6 + 0.8 * Math.abs(Math.sin(t * 40))) : 0;
  spark.setAttribute("cx", p[0].toFixed(2)); spark.setAttribute("cy", p[1].toFixed(2)); spark.setAttribute("r", sr.toFixed(2));
  spark.style.opacity = weld ? "0.35" : "0";
}
function drawPerson(pp, st, t) {
  const x = ST[pp.i];
  const working = st.state === "run" && st.part;
  const holding = st.part && st.state === "blocked";
  pp.arms.forEach((arm, q) => {
    const side = q === 0 ? -1 : 1;
    const s = [x + side * 6, OP_Y + 0.6, 47.4];
    let h;
    if (working) {
      const wob = Math.sin(t * 9 + q * 1.7) * 1.1;
      h = [x + side * 3.6 + wob * 0.4, -4.2 + wob * 0.3, BT + PART_H + 1.6 + Math.max(0, wob)];
    } else if (holding) h = [x + side * 3.8, -4.4, BT + PART_H - 1.5];
    else h = [x + side * 8.6, OP_Y + 2.4, 31];
    const [e, w] = elbow(s, h, 10.5, 10.5, [side * 0.8, 0.1, -1]);
    const d = SEG(s, e) + SEG(e, w);
    arm.o.setAttribute("d", d); arm.f.setAttribute("d", d);
  });
}

// ------------------------------------------------ parts on the belt
const views = new Map();
const free = pool.slice();
function targetOf(L, id) {
  for (let i = 0; i < ST.length; i++) {
    const st = L.st[i];
    if (st.part === id) return { x: ST[i], ops: i + (st.done ? 1 : 0) + (i === ROBOT && !st.done && st.phase > 0.5 ? 0 : 0) };
    if (i < CAP.length) { const j = L.buf[i].indexOf(id); if (j >= 0) return { x: slotX(i, j), ops: i + 1 }; }
  }
  return { x: TOTE_X, ops: 4, out: true };
}
let L, cfg = { a: START.a, m: START.m };
function syncParts(dt, calm) {
  const ids = new Set();
  L.st.forEach((st) => st.part && ids.add(st.part));
  L.buf.forEach((b) => b.forEach((id) => ids.add(id)));
  while (L.outs.length > 4) L.outs.shift();
  L.outs.forEach((id) => ids.add(id));
  const follow = calm ? 1 : 1 - Math.exp(-dt / 0.14);
  for (const id of ids) {
    const want = targetOf(L, id);
    let v = views.get(id);
    if (!v) {
      const el = free.pop(); if (!el) continue;
      el.style.display = "";
      v = { el, x: want.x, z: 0, a: calm ? 1 : 0, ops: -1, born: true };
      views.set(id, v);
    }
    v.x += (want.x - v.x) * follow; if (Math.abs(want.x - v.x) < 0.02) v.x = want.x;
    if (v.born) { v.a = Math.min(1, v.a + (calm ? 1 : dt / 0.25)); if (v.a >= 1) v.born = false; }
    const fall = smooth(BELT_END - 2, TOTE_X, v.x);
    v.z = -(BT - TOTE_H + PART_H + 2) * fall * fall;
    if (want.out) v.a = 1 - smooth(0.55, 1, fall);
    // the robot's weld spots show from the first spot on
    let ops = want.ops;
    const r = L.st[ROBOT];
    if (r.part === id && !r.done && r.phase > 0.3) ops = 2;
    if (v.ops !== ops) { v.ops = ops; v.el.dataset.ops = String(ops); }
  }
  for (const [id, v] of views) {
    if (!ids.has(id) || (v.a <= 0.01 && !v.born)) {
      v.el.style.display = "none"; v.el.removeAttribute("transform"); free.push(v.el); views.delete(id);
      const k = L.outs.indexOf(id); if (k >= 0) L.outs.splice(k, 1);
    }
  }
  const order = [...views.values()].sort((a, b) => a.x - b.x);
  order.forEach((v) => {
    v.el.setAttribute("transform", translateAlong(P, [v.x, 0, v.z]));
    v.el.style.opacity = v.a < 1 ? v.a.toFixed(3) : "";
  });
  const frag = document.createDocumentFragment(); order.forEach((v) => frag.appendChild(v.el)); partsLayer.appendChild(frag);
}

// ------------------------------------------------ readout
function readout() {
  const net = robotNet(cfg.a, cfg.m), person = 3600 / 45;
  const line = TABLE[cfg.a + "/" + cfg.m];
  const robotLimits = net < person;
  const l1 = T.cyc + " " + T.robot + " " + CYC[ROBOT] + " s · " + T.person + " 45 s";
  const l2 = T.net + " " + T.robot + " <span class='" + (robotLimits ? "la-strong" : "la-mute") + "'>" + Math.round(net) + T.per + "</span> · " + T.person + " " + Math.round(person) + T.per;
  const l3 = T.line + " <span class='la-acc'>" + fmt(line, 0) + T.per + "</span> · " + T.bn + " " + (robotLimits ? T.robot : T.people);
  const l4 = T.oee + " <span class='la-acc'>" + Math.round((line / IDEAL_LINE) * 100) + " %</span> · " + T.vs;
  [l1, l2, l3, l4].forEach((h, i) => { if (lines[i].innerHTML !== h) lines[i].innerHTML = h; });
  document.querySelectorAll("[data-ctl]").forEach((group) => {
    const key = group.dataset.ctl, list = key === "a" ? AVAIL : STOPS, v = cfg[key];
    group.querySelector(".la-val").textContent = key === "a" ? v + " %" : v + T.per;
    const i = list.indexOf(v);
    group.querySelector('[data-d="-1"]').disabled = i <= 0;
    group.querySelector('[data-d="1"]').disabled = i >= list.length - 1;
  });
  stage.setAttribute("aria-valuetext", T.line + " " + fmt(line, 0) + T.per + ", " + T.oee + " " + Math.round((line / IDEAL_LINE) * 100) + " %");
}

// ------------------------------------------------ frame
let wasFault = false;
function draw(dt, calm) {
  const r = L.st[ROBOT];
  syncParts(dt, calm);
  const t = L.t / TS;
  // the robot keeps its pose while stopped
  const moving = r.state === "run" && r.part && !r.done;
  if (moving) { const g = robotTip(r.phase); drawRobot(g.p, g.weld, t); }
  else if (r.state === "starved" || (r.state === "blocked")) {
    const target = calm ? HOME : add(tipNow, mul(sub(HOME, tipNow), 1 - Math.exp(-dt / 0.15)));
    drawRobot(target, false, t);
  } else drawRobot(tipNow, false, t);
  people.forEach((pp) => drawPerson(pp, L.st[pp.i], t));
  lamps.forEach(([i, el]) => { if (L.st[i].state === "run") el.setAttribute("data-on", ""); else el.removeAttribute("data-on"); });
  const blink = calm || Math.sin(performance.now() / 160) > -0.2;
  const set = (el, on) => { if (on) el.setAttribute("data-on", ""); else el.removeAttribute("data-on"); };
  set(stack.run, r.state === "run");
  set(stack.stop, r.state === "micro");
  set(stack.fault, r.state === "fault" && blink);
  const fault = r.state === "fault";
  if (fault !== wasFault) { wasFault = fault; announcer.textContent = fault ? T.fault + "." : T.back + "."; }
}

// ------------------------------------------------ time
let frame = 0, last = 0, visible = false;
function fresh(seed) {
  L = lineSim(cfg, seed);
  // warm up a few minutes so the buffers are in their working state
  for (let t = 0; t < 600; t += 0.5) L.step(0.5);
  L.outs.length = 0;
  L.st[ROBOT].fault = 0; L.st[ROBOT].micro = 0;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (!calm) {
    let left = dt * TS;
    while (left > 1e-9) { const h = Math.min(0.5, left); L.step(h); left -= h; }
  }
  draw(dt, calm);
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function setValue(key, dir) {
  const list = key === "a" ? AVAIL : STOPS;
  const i = clamp(list.indexOf(cfg[key]) + dir, 0, list.length - 1);
  cfg[key] = list[i];
  L.cfg = cfg;
  readout();
  kick();
}
function breakdown() {
  if (still.matches) return;
  L.breakdown();
  kick();
}
document.querySelectorAll("[data-ctl]").forEach((group) => {
  group.querySelectorAll(".la-btn").forEach((b) => b.addEventListener("click", () => setValue(group.dataset.ctl, Number(b.dataset.d))));
});
stage.addEventListener("click", breakdown);
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (event.key === " " || event.key === "Enter") breakdown();
  else if (event.key === "ArrowUp") setValue("a", 1);
  else if (event.key === "ArrowDown") setValue("a", -1);
  else if (event.key === "ArrowRight") setValue("m", 1);
  else if (event.key === "ArrowLeft") setValue("m", -1);
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
fresh(20261103);
// the first breakdown comes early, so a reader sees the buffers work
if (!still.matches) setTimeout(() => { if (L.st[ROBOT].fault <= 0) { L.breakdown(); L.st[ROBOT].fault = 150; } }, 2600);
readout();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) kick();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { cancelAnimationFrame(frame); frame = 0; kick(); });
draw(1, true);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Robot of mens",
    hint: "Stel de robot in",
    hint2: "Tik de lijn: storing",
    time: "1 s = 40 s",
    avail: "beschikbaarheid robot",
    stops: "microstops per uur",
    less: "minder",
    more: "meer",
    label: LABEL_NL,
    aria: "Assemblagelijn met een robotcel. Spatie of Enter geeft een storing aan de robot. Pijl omhoog en omlaag veranderen de beschikbaarheid, pijl links en rechts het aantal microstops per uur.",
  },
  en: {
    title: "Robot or person",
    hint: "Set up the robot",
    hint2: "Tap the line: breakdown",
    time: "1 s = 40 s",
    avail: "robot availability",
    stops: "micro-stops per hour",
    less: "less",
    more: "more",
    label: LABEL_EN,
    aria: "Assembly line with a robot cell. Space or Enter breaks the robot down. Up and down arrows change the availability, left and right arrows the micro-stops per hour.",
  },
};
const group = (key, label) =>
  `<div class="la-group" data-ctl="${key}"><span class="la-group-label" data-l="${key}">${label}</span><div class="la-step"><button type="button" class="la-btn" data-d="-1" aria-label="${label} ${STRINGS.nl.less}">&#8722;</button><span class="la-val" aria-live="polite"></span><button type="button" class="la-btn" data-d="1" aria-label="${label} ${STRINGS.nl.more}">+</button></div></div>`;
const controls = `<div class="la-controls">${group("a", STRINGS.nl.avail)}${group("m", STRINGS.nl.stops)}</div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="la-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="la-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="la-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-hint2>${STRINGS.nl.hint2}</span><br><span data-time>${STRINGS.nl.time}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-hint2]").textContent=s.hint2;h.querySelector("[data-time]").textContent=s.time;
[["a",s.avail],["m",s.stops]].forEach(function(p){var g=document.querySelector('[data-ctl="'+p[0]+'"]');g.querySelector(".la-group-label").textContent=p[1];
g.querySelector('[data-d="-1"]').setAttribute("aria-label",p[1]+" "+s.less);g.querySelector('[data-d="1"]').setAttribute("aria-label",p[1]+" "+s.more);});
var st=document.querySelector(".la-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`line output /h: ${AVAIL.map((a) => `${a}%: ` + STOPS.map((m) => TABLE[`${a}/${m}`]).join(" ")).join(" | ")}`);
console.log(`robot net at 90 %, 20 stops/h: ${robotNet(90, 20).toFixed(1)}/h vs a person 80/h; line ${TABLE["90/20"]}/h, OEE ${Math.round((TABLE["90/20"] / IDEAL_LINE) * 100)} %`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P);

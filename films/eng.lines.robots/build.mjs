// Dev tool, not shipped. Builds the explainer film "Een robot leren kennen /
// Getting to know a robot" for the topic Robots of Lijnen en automatisering
// (robotbasics L1, robots L2, robotcell L3, vision L4).
//
//   node films/eng.lines.robots/build.mjs            build the page
//   node films/eng.lines.robots/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.lines.robots.html: one offline page with
// the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.4.
//
// The world is the cell of the figure eng.lines.robotcell (same layout, same
// numbers): a six-axis robot on a pedestal picks parts off an infeed belt and
// puts them on the loading table of a machine; a mesh fence on three sides, a
// light curtain across the open front, the controller with its teach pendant
// outside. The film adds a vibratory bowl feeder, a bin of loose parts under a
// 3D camera, an area scanner at the pedestal, a setter with a pendant inside
// the cell and an operator outside it. The arm, its gripper (single or
// double), the parts and the floor marks are drawn per frame by stage.js; the
// pendant, the payload, the robot types, the cycle, the safety distance, the
// offline model and the cobot's takt are cards in stage space over it.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const A = await import(pathToFileURL(join(SKILL, 'kit/audit.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The {n:...} numbers in captions and narration are then checked
// against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// robotbasics: hand mode at reduced speed, the TCP at most 250 mm/s (ISO 10218-1)
const HAND = { v: 250, move: 1500 };
HAND.t = HAND.move / HAND.v;
assert(HAND.t === 6, '1.500 / 250 = 6 s');
assert(2000 / HAND.v === 8, 'recall: 2.000 / 250 = 8 s');
// robots: a 4 kg gripper and a 6 kg casting on a 10 kg robot, 150 mm off the flange
const LOAD = { gripper: 4, part: 6, robot: 10, off: 150 };
LOAD.sum = LOAD.gripper + LOAD.part;
LOAD.pct = Math.round((100 * LOAD.sum) / LOAD.robot);
assert(LOAD.sum === 10 && LOAD.pct === 100, '4 + 6 = 10 kg, 100 % of the payload');
assert(near((7 + 5) / 0.8, 15), 'recall: 12 / 0,8 = 15 kg');
// The payload diagram (illustrative, the shape of a 10 kg robot's chart): the
// rated load holds near the flange and falls with the distance of the load's
// centre of gravity. At 150 mm, 10 kg sits above the line.
const CHART = { full: 100, at: (mm) => (mm <= 100 ? 10 : 10 * (100 / mm) ** 1.2) };
assert(CHART.at(LOAD.off) < LOAD.sum, 'at 150 mm the robot carries less than 10 kg');
// robotcell: machine cycle 40 s; single gripper the machine stands 20 s, double 8 s
const CELL = { machine: 40, single: 20, double: 8 };
CELL.one = CELL.machine + CELL.single;
CELL.two = CELL.machine + CELL.double;
CELL.perOne = 3600 / CELL.one;
CELL.perTwo = 3600 / CELL.two;
assert(CELL.one === 60 && CELL.perOne === 60, '40 + 20 = 60 s, 60 an hour');
assert(CELL.two === 48 && CELL.perTwo === 75, '40 + 8 = 48 s, 75 an hour');
assert(Math.round((CELL.perTwo / CELL.perOne - 1) * 100) === 25, '25 % more');
// robotcell: ISO 13855, S = K × T + C, C = 8 × (d − 14); recall d 30 mm, T 0,15 s
const SAFE = { K: 2000, K2: 1600, T: 0.15, d: 30, floor: 500 };
SAFE.C = 8 * (SAFE.d - 14);
SAFE.KT = SAFE.K * SAFE.T;
SAFE.S = SAFE.KT + SAFE.C;
assert(SAFE.C === 128 && near(SAFE.KT, 300) && near(SAFE.S, 428), 'S = 300 + 128 = 428 mm');
assert(SAFE.S <= SAFE.floor, 'under 500 mm, so K = 2.000 stands');
assert(8 * (14 - 14) === 0, 'a 14 mm curtain adds nothing');
// vision: takt 14 s, the move 6 s at full speed, the rest 4 s
const COBOT = { takt: 14, move: 6, rest: 4 };
COBOT.pfl = COBOT.move * 2 + COBOT.rest;
COBOT.ssm = COBOT.move + COBOT.rest;
assert(COBOT.pfl === 16 && COBOT.pfl > COBOT.takt, 'half speed: 12 + 4 = 16 s, misses the takt');
assert(COBOT.ssm === 10 && COBOT.ssm < COBOT.takt, 'full speed: 6 + 4 = 10 s');
assert(2 * 5 + 3 === 13, 'recall: 13 s');

// ---------------------------------------------------------------- the world (units of 10 mm, z up, +y toward the open front)
const W = 640;
const H = 400;
const FLOOR = { x: -160, y: -90, w: 280, d: 226, r: 3 };
const FX = 110; const FB = -80; const FF = 85; const FH = 150; // fence sides, back, front, height
const HAZ = 30; // the hazard line: the arm's reach toward the front
const CUR_Y = FF; // the light curtain stands in the front opening
assert(CUR_Y - HAZ === 55, 'the curtain stands 550 mm in front of the hazard line');
assert(SAFE.S / 10 < CUR_Y - HAZ, 'the 428 mm safety distance fits in front of the hazard line');
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
const BOWL = [-74, -52]; // vibratory bowl feeder, back left
const BOWL_Z = 50;
const BIN = { x: 32, y: 10, w: 26, d: 18, r: 1 }; // loose parts for bin picking, in a box on a pallet (front right, behind the hazard line)
const BIN_Z = 4;
const CAM = [45, 19, 74]; // the 3D camera over the bin
const SET = [-8, 52]; // the setter inside the cell
const OPR = [-34, 106]; // the operator outside the curtain
const SCAN = [0, -4];
const LC = [-FX + 10, FX - 10];
assert(BIN.y + BIN.d < HAZ, 'the bin the robot picks from lies inside its reach, behind the hazard line');

const FIT = [...k.boxCorners(FLOOR, -3, 0), [-FX, FB, FH], [FX, FB, FH], [-FX, FF, FH], [FX, FF, FH], [CAB.x, CAB.y, CAB_H + 14]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 68, elevation: 30 });
const KS = G.scaleOf(P);
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- recorder: true depth order for the static parts
const R = A.recorder(P, { order: [], spring: {} });
function put(name, ref, svg, shapes, { bias = 0, attrs = '', layer = 'back' } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: '', move: [0, 0, 0], attrs, layer });
}
const S = (paths, style) => k.solidSvg(paths, style);
function box(name, p, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(p, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [p.x + p.w / 2, p.y + p.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
// Page weight: a round part gets no more sides than its size needs (about 1.6 per unit of radius, at least 8).
function post(name, cx, cy, r, z0, z1, style = {}, { steps: asked = 24, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const steps = Math.min(asked, Math.max(r < 2 ? 6 : 8, Math.round(r * 1.6)));
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
const card = (pts) => `<path class="rb-card" d="${k.pathOf(pts.map(at), true)}"/>`;
const slots = (pts) => `<path class="rb-slot" d="${pts.map((q) => k.pathOf(q.map(at), true)).join('')}"/>`;
const cue = (c) => ` data-cue="${c}"`;

// ---------------------------------------------------------------- the floor
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(FLOOR, -2), -3, 2, P)}"/>`;
{
  const anchors = k.corners(FLOOR, 7);
  const extra = L(k.planOutline(k.insetPlan(FLOOR, 3.5), 0, P, 3), { tone: 'faint' })
    + L(anchors.map(([x, y]) => k.ring(x, y, 2, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box('floor.plate', FLOOR, -3, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(FLOOR, -1.4, P, 3), { tone: 'faint' }), extra, layer: 'floor', ground: true });
}
// the hazard line: how far the arm reaches toward the front, taped on the floor
{
  const tape = { x: -FX + 4, y: HAZ - 1.2, w: 2 * FX - 8, d: 2.4, r: 0.4 };
  const hatch = [];
  for (let x = tape.x + 3; x < tape.x + tape.w - 2; x += 9) hatch.push(k.lineOnTop([x, tape.y], [x + 2.2, tape.y + tape.d], 0.4, P));
  box('floor.hazard', tape, 0, 0.4, { tone: 'mid', crease: 'none' }, { steps: 2, flat: true, extra: L(hatch.join(''), { tone: 'lo' }), layer: 'floor' });
}
box('floor.duct', { x: CAB.x + CAB.w, y: -31, w: -14 - (CAB.x + CAB.w) - 2.6, d: 6, r: 0.8 }, 0, 1.4, { tone: 'mid' }, { steps: 2, inner: L(k.lineOnTop([CAB.x + CAB.w, -28], [-16.6, -28], 1.4, P), { tone: 'faint' }), layer: 'floor' });

// ---------------------------------------------------------------- the fence
const postsAt = [];
for (const x of [-FX, 0, FX]) postsAt.push([x, FB]);
for (const y of [0, FF]) for (const x of [-FX, FX]) postsAt.push([x, y]);
for (const [x, y] of postsAt) {
  const layer = x === FX || y === FF ? 'front' : 'back';
  const foot = plan(x, y, 9, 9, 0.6);
  box('fence.foot', foot, 0, 1, { tone: 'lo' }, { steps: 1, layer });
  box('fence.post', plan(x, y, 4, 4, 0.4), 1, FH, { tone: 'mid' }, { steps: 1, extra: Dt([at([x, y, FH])], { size: 0.4 }), layer, attrs: cue('fence') });
}
function meshPanel(axis, fixed, u0, u1, z0, z1) {
  const point = (u, z) => (axis === 'y' ? [u, fixed, z] : [fixed, u, z]);
  const frame = k.pathOf([point(u0, z0), point(u1, z0), point(u1, z1), point(u0, z1)].map(at), true);
  const inner = [];
  const n = Math.round((u1 - u0) / 12);
  for (let q = 1; q < n; q++) { const u = u0 + ((u1 - u0) * q) / n; inner.push(k.pathOf([at(point(u, z0)), at(point(u, z1))])); }
  const rows = Math.round((z1 - z0) / 12);
  for (let q = 1; q < rows; q++) { const z = z0 + ((z1 - z0) * q) / rows; inner.push(k.pathOf([at(point(u0, z)), at(point(u1, z))])); }
  return `<path class="rb-mesh" d="${frame}"/>` + L(inner.join(''), { tone: 'faint' }) + L(frame, { tone: 'lo' });
}
const MZ = [8, FH - 4];
const meshFar = meshPanel('y', FB, -FX + 2, -2, ...MZ) + meshPanel('y', FB, 2, FX - 2, ...MZ)
  + meshPanel('x', -FX, FB + 2, -2, ...MZ) + meshPanel('x', -FX, 2, FF - 2, ...MZ);
const meshNear = meshPanel('x', FX, FB + 2, -2, ...MZ) + meshPanel('x', FX, 2, FF - 2, ...MZ);

// ---------------------------------------------------------------- the light curtain across the open front
for (const x of LC) {
  const base = plan(x, CUR_Y, 8, 8, 0.6);
  box('curtain.base', base, 0, 2, { tone: 'lo' }, { steps: 1, extra: Dt(k.corners(base, 1.6).map(([px, py]) => at([px, py, 2])), { size: 0.35 }), layer: 'front', attrs: cue('curtain') });
  const face = x < 0 ? x + 2 : x - 2;
  const lenses = [];
  for (let z = 10; z <= 134; z += 4) lenses.push(at([face, CUR_Y, z]));
  box('curtain.column', plan(x, CUR_Y, 4, 4, 0.5), 2, 140, { tone: 'hi', crease: 'lo' }, { steps: 1, extra: Dt(lenses, { size: 0.28, tone: 'lo' }) + Dt([at([x, CUR_Y, 140])], { size: 0.4 }), layer: 'front', attrs: cue('curtain') });
}
const beams = [];
for (let z = 12; z <= 132; z += 8) beams.push(k.segment([LC[0] + 2, CUR_Y, z], [LC[1] - 2, CUR_Y, z], P));
const beamSvg = `<g data-cue="curtain"><path class="rb-beam" data-k="beams" d="${beams.join('')}"/></g>`;

// ---------------------------------------------------------------- robot pedestal and base (axis 1 turns the turret)
{
  const [px, py] = PED;
  const rb = cue('robot');
  const bolts = Array.from({ length: 8 }, (_, q) => [px + 13.4 * Math.cos((q / 8) * Math.PI * 2 + 0.2), py + 13.4 * Math.sin((q / 8) * Math.PI * 2 + 0.2)]);
  post('robot.anchor-plate', px, py, 16, 0, 2, { tone: 'lo' }, { steps: 36, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, 2])), { size: 0.45 }) });
  post('robot.pedestal', px, py, 10, 2, 30, { tone: 'mid', crease: 'none' }, { steps: 30, inner: L(k.sideArc(px, py, 10, 16, P, 28), { tone: 'faint' }) });
  const top = Array.from({ length: 6 }, (_, q) => [px + 12 * Math.cos((q / 6) * Math.PI * 2), py + 12 * Math.sin((q / 6) * Math.PI * 2)]);
  post('robot.top-plate', px, py, 14, 30, 33, { tone: 'mid' }, { steps: 36, bevel: 0.4, extra: Dt(top.map(([x, y]) => at([x, y, 33])), { size: 0.4 }) });
  post('robot.base', px, py, 12, 33, 42, { tone: 'hi', crease: 'lo' }, { steps: 32, inner: L(k.sideArc(px, py, 12, 37.5, P, 32), { tone: 'faint' }), attrs: rb });
  post('robot.turret', px, py, 10, 42, 50, { tone: 'hi', crease: 'lo' }, { steps: 30, attrs: rb });
  box('robot.connector', { x: px - 15.5, y: py - 4, w: 4, d: 8, r: 0.6 }, 34, 40, { tone: 'mid' }, { steps: 2, extra: Dt([at([px - 15.5, py, 37])], { size: 0.4 }) });
}
// the area scanner at the pedestal's foot, looking over the floor toward the front
{
  const sp = plan(SCAN[0], SCAN[1], 10, 6, 1);
  box('scanner.body', sp, 0, 8, { tone: 'mid' }, { steps: 3, bevel: 0.3, attrs: cue('scanner'), extra: card([[-3.6, SCAN[1] + 3, 2], [3.6, SCAN[1] + 3, 2], [3.6, SCAN[1] + 3, 5], [-3.6, SCAN[1] + 3, 5]]) });
  post('scanner.head', SCAN[0], SCAN[1], 2.8, 8, 11, { tone: 'hi', crease: 'lo' }, { steps: 20, attrs: cue('scanner'), extra: Dt([at([SCAN[0], SCAN[1], 11])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- infeed belt (left)
const BELT = { x: -100, y: -9, w: 72, d: 18, r: 1 };
for (const x of [-94, -36]) for (const y of [-7, 7]) {
  post('feed.foot', x, y, 2.6, 0, 1, { tone: 'lo' }, { steps: 12 });
  post('feed.leg', x, y, 1.5, 1, BELT_Z - 6, { tone: 'mid', crease: 'none' }, { steps: 10 });
}
box('feed.bed', BELT, BELT_Z - 6, BELT_Z - 2, { tone: 'mid' }, { steps: 3, bevel: 0.3, inner: L(k.sideSeam(BELT, BELT_Z - 4, P, 3), { tone: 'faint' }), attrs: cue('belt') });
{
  const belt = k.insetPlan(BELT, 1.4);
  const slats = [];
  for (let x = belt.x + 3; x <= belt.x + belt.w - 2; x += 4) slats.push(k.lineOnTop([x, belt.y], [x, belt.y + belt.d], BELT_Z, P));
  box('feed.belt', belt, BELT_Z - 2, BELT_Z, { tone: 'lo', crease: 'none' }, { steps: 3, inner: L(slats.join(''), { tone: 'faint' }), attrs: cue('belt') });
}
for (const x of [BELT.x - 2.6, BELT.x + BELT.w + 2.6]) discAt('feed.drum', frameY([x, BELT.y + 1, BELT_Z - 3]), 0, BELT.d - 2, 2.6, { tone: 'mid' }, { owner: 'feed', steps: 16 });
box('feed.stopper-post', { x: PICK[0] + PART.w / 2 + 1, y: BELT.y - 4.8, w: 2.4, d: 2.4, r: 0.3 }, 0, BELT_Z + 3, { tone: 'mid' }, { steps: 1 });
box('feed.stopper', { x: PICK[0] + PART.w / 2 + 1, y: BELT.y - 4.8, w: 2.4, d: 16.8, r: 0.3 }, BELT_Z + 3, BELT_Z + 7, { tone: 'hi', crease: 'lo' }, { steps: 1 });
for (const y0 of [BELT.y - 2.2, BELT.y + BELT.d]) {
  const gd = { x: BELT.x + 2, y: y0, w: BELT.w - 4, d: 2.2, r: 0.3 };
  box('feed.guide', gd, BELT_Z - 2, BELT_Z + 3, { tone: 'mid' }, { steps: 1, extra: Dt([at([gd.x + 2, y0 + 1.1, BELT_Z + 3]), at([gd.x + gd.w - 2, y0 + 1.1, BELT_Z + 3])], { size: 0.35 }) });
}
{
  const p = plan(-86, PICK[1], PART.w, PART.w, 1);
  box('feed.next-part', p, BELT_Z, BELT_Z + PART.h, { tone: 'mid', crease: 'lo' }, { steps: 2, bevel: 0.4, inner: L(k.planOutline(k.insetPlan(p, 3), BELT_Z + PART.h, P, 2), { tone: 'faint' }) });
}
{
  const FM = frameX([BELT.x + 8, BELT.y + BELT.d - 3.4, BELT_Z - 9.2]);
  const fins = G.ribsOf(FM, 0.6, 11.4, 3.2, 14, P, { fade: [0.05, 0.45], seams: true });
  discAt('feed.motor', FM, 0, 12, 3.2, { tone: 'mid' }, { owner: 'feed', inner: k.fadedSvg(fins, { tone: 'lo' }), steps: 16 });
}

// ---------------------------------------------------------------- the vibratory bowl feeder (back left): bowl, spiral track, outfeed rail
{
  const [bx, by] = BOWL;
  const bc = cue('bowl');
  const base = plan(bx, by, 22, 22, 1);
  box('bowl.base', base, 0, 3, { tone: 'lo' }, { steps: 2, bevel: 0.4, extra: Dt(k.corners(base, 2.4).map(([x, y]) => at([x, y, 3])), { size: 0.4 }) });
  post('bowl.stand', bx, by, 6, 3, BOWL_Z - 12, { tone: 'mid', crease: 'none' }, { steps: 20, inner: L(k.sideArc(bx, by, 6, 20, P, 20), { tone: 'faint' }) });
  post('bowl.drive', bx, by, 9, BOWL_Z - 12, BOWL_Z - 2, { tone: 'mid', crease: 'lo' }, { steps: 28, inner: L(k.sideArc(bx, by, 9, BOWL_Z - 7, P, 28), { tone: 'faint' }), attrs: bc });
  // the bowl: a wide shallow drum, its spiral track drawn as rings climbing the inside wall
  const spiral = [];
  for (let i = 0; i < 3; i++) spiral.push(k.ring(bx, by, 11.5 - i * 2.4, BOWL_Z + 8, P, 36));
  post('bowl.bowl', bx, by, 13, BOWL_Z - 2, BOWL_Z + 8, { tone: 'hi', crease: 'lo' }, { steps: 40, bevel: 0.4, attrs: bc, inner: L(k.sideArc(bx, by, 13, BOWL_Z + 3, P, 40), { tone: 'faint' }), extra: L(spiral.join(''), { tone: 'lo' }) + Dt([at([bx, by, BOWL_Z + 8])], { size: 0.5 }) });
  // the outfeed rail toward the robot, the parts in a row on it, on a post
  const rail = { x: bx + 10, y: by - 2, w: 26, d: 4, r: 0.4 };
  box('bowl.rail', rail, BOWL_Z + 4, BOWL_Z + 6, { tone: 'mid' }, { steps: 1, attrs: bc, extra: Dt([3, 7, 11, 15, 19, 23].map((x) => at([rail.x + x, by, BOWL_Z + 6])), { size: 0.5, tone: 'hi' }) });
  post('bowl.rail-post', rail.x + rail.w - 3, by, 1.4, 0, BOWL_Z + 4, { tone: 'mid', crease: 'none' }, { steps: 10 });
}

// ---------------------------------------------------------------- the bin of loose parts and the 3D camera over it (front right)
{
  const vc = cue('bin');
  const pal = k.insetPlan(BIN, -1.5);
  box('bin.pallet', pal, 0, BIN_Z, { tone: 'lo' }, { steps: 1, inner: L(k.sideSeam(pal, BIN_Z / 2, P, 1), { tone: 'faint' }) });
  // the box itself: walls round a dark floor, loose parts lying every way
  const inner = k.insetPlan(BIN, 1.6);
  const heap = [];
  [[4, 5, 0.3], [10, 4, 1.1], [16, 7, 0.7], [7, 11, 1.9], [14, 13, 0.2], [20, 12, 1.4], [5, 15, 2.6], [11, 8, 2.2]].forEach(([dx, dy, a]) => {
    const c = [inner.x + dx, inner.y + dy];
    const ux = Math.cos(a) * 3.2; const uy = Math.sin(a) * 3.2;
    const vx = -Math.sin(a) * 1.8; const vy = Math.cos(a) * 1.8;
    heap.push(k.pathOf([[c[0] - ux - vx, c[1] - uy - vy, BIN_Z + 4], [c[0] + ux - vx, c[1] + uy - vy, BIN_Z + 4], [c[0] + ux + vx, c[1] + uy + vy, BIN_Z + 4], [c[0] - ux + vx, c[1] - uy + vy, BIN_Z + 4]].map(at), true));
  });
  box('bin.box', BIN, BIN_Z, BIN_Z + 10, { tone: 'mid' }, {
    steps: 2, bevel: 0.4, attrs: vc,
    extra: `<path class="rb-slot" d="${k.pathOf([[inner.x, inner.y, BIN_Z + 10], [inner.x + inner.w, inner.y, BIN_Z + 10], [inner.x + inner.w, inner.y + inner.d, BIN_Z + 10], [inner.x, inner.y + inner.d, BIN_Z + 10]].map(at), true)}"/>`
      + `<path class="rb-loose" d="${heap.join('')}"/>`,
  });
  // the camera: a post at the bin's far left, an arm over the bin, the camera head looking down
  const cc = cue('camera');
  const PX = BIN.x + BIN.w + 9;
  post('cam.foot', PX, CAM[1], 4, 0, 1.6, { tone: 'lo' }, { steps: 16, layer: 'front', extra: Dt([at([PX + 2.6, CAM[1], 1.6]), at([PX - 2.6, CAM[1], 1.6])], { size: 0.35 }) });
  post('cam.post', PX, CAM[1], 1.8, 1.6, CAM[2] + 8.4, { tone: 'mid', crease: 'none' }, { steps: 12, layer: 'front' });
  box('cam.arm', { x: CAM[0] - 4, y: CAM[1] - 1.4, w: PX - CAM[0] + 6, d: 2.8, r: 0.3 }, CAM[2] + 6, CAM[2] + 8.4, { tone: 'mid' }, { steps: 1, layer: 'front' });
  const head = plan(CAM[0], CAM[1], 12, 6, 1);
  box('cam.head', head, CAM[2], CAM[2] + 6, { tone: 'hi', crease: 'lo' }, { steps: 2, bevel: 0.3, attrs: cc, layer: 'front', extra: Dt([at([CAM[0] - 3, CAM[1] + 3, CAM[2] + 3]), at([CAM[0] + 3, CAM[1] + 3, CAM[2] + 3])], { size: 0.5, tone: 'lo' }) });
}

// ---------------------------------------------------------------- the machine and its loading table (right)
{
  const fy = MACH.y + MACH.d;
  const mc = cue('machine');
  const door = [[MACH.x + 6, fy, 30], [MACH.x + 52, fy, 30], [MACH.x + 52, fy, 112], [MACH.x + 6, fy, 112]];
  const win = [[MACH.x + 14, fy, 62], [MACH.x + 44, fy, 62], [MACH.x + 44, fy, 102], [MACH.x + 14, fy, 102]];
  const vents = [];
  for (const z of [10, 14, 18]) vents.push([[MACH.x + 58, fy, z], [MACH.x + 70, fy, z], [MACH.x + 70, fy, z + 1.6], [MACH.x + 58, fy, z + 1.6]]);
  const top = k.planOutline(k.insetPlan(MACH, 4), MACH_H, P, 2);
  box('machine.body', MACH, 0, MACH_H, { tone: 'mid' }, {
    steps: 3, bevel: 0.8, attrs: mc,
    inner: L(k.pathOf(door.map(at), true), { tone: 'lo' }) + L(top, { tone: 'faint' }) + L(k.sideSeam(MACH, 6, P, 3), { tone: 'faint' }),
    extra: `<path class="rb-window" d="${k.pathOf(win.map(at), true)}"/>` + slots(vents) + Dt([[MACH.x + 4, fy, 4], [MACH.x + MACH.w - 4, fy, 4]].map(at), { size: 0.4 }),
  });
  box('machine.handle', { x: MACH.x + 48, y: fy, w: 2, d: 2.4, r: 0.4 }, 60, 84, { tone: 'hi', crease: 'lo' }, { steps: 1 });
  const panel = { x: MACH.x + 58, y: fy, w: 14, d: 3, r: 0.6 };
  box('machine.panel', panel, 72, 108, { tone: 'lo' }, { steps: 1, extra: card([[panel.x + 2, fy + 3, 104], [panel.x + 12, fy + 3, 104], [panel.x + 12, fy + 3, 94], [panel.x + 2, fy + 3, 94]]) + Dt([[panel.x + 4, fy + 3, 88], [panel.x + 7, fy + 3, 88], [panel.x + 10, fy + 3, 88], [panel.x + 4, fy + 3, 84], [panel.x + 7, fy + 3, 84], [panel.x + 10, fy + 3, 84]].map(at), { size: 0.5 }) });
  const lx = MACH.x + MACH.w - 10; const ly = MACH.y + 10;
  post('machine.lamp-base', lx, ly, 3, MACH_H, MACH_H + 2, { tone: 'mid' }, { steps: 16 });
  post('machine.lamp', lx, ly, 2.4, MACH_H + 2, MACH_H + 8, { tone: 'mid', crease: 'lo' }, { steps: 16, attrs: ' data-k="ready"', extra: Dt([at([lx, ly, MACH_H + 8])], { size: 0.4, tone: 'hi' }) });
}
const TAB = { x: 44, y: -22, w: 40, d: 30, r: 1 };
for (const [x, y] of k.corners(k.insetPlan(TAB, 3), 0)) {
  post('table.foot', x, y, 2.4, 0, 1, { tone: 'lo' }, { steps: 10 });
  box('table.leg', plan(x, y, 2.6, 2.6, 0.3), 1, TABLE_Z - 4, { tone: 'mid' }, { steps: 1 });
}
box('table.top', TAB, TABLE_Z - 4, TABLE_Z, { tone: 'mid' }, { steps: 2, bevel: 0.4, inner: L(k.planOutline(k.insetPlan(TAB, 3), TABLE_Z, P, 2), { tone: 'faint' }), attrs: cue('machine') });
{
  const nest = plan(PLACE[0], PLACE[1], 20, 20, 0.6);
  box('table.nest', nest, TABLE_Z, TABLE_Z + 1.2, { tone: 'lo' }, { steps: 1, extra: Dt(k.corners(nest, 1.6).map(([x, y]) => at([x, y, TABLE_Z + 1.2])), { size: 0.35 }) });
  for (const [x, y] of [[PLACE[0] - 8.4, PLACE[1] - 8.4], [PLACE[0] + 8.4, PLACE[1] + 8.4]]) post('table.pin', x, y, 0.9, TABLE_Z + 1.2, TABLE_Z + 4, { tone: 'hi', crease: 'none' }, { steps: 10 });
}

// ---------------------------------------------------------------- the controller outside the fence (left), the pendant on its hook
{
  const fy = CAB.y + CAB.d;
  const vents = [];
  for (const z of [8, 11, 14]) vents.push([[CAB.x + 6, fy, z], [CAB.x + 18, fy, z], [CAB.x + 18, fy, z + 1.2], [CAB.x + 6, fy, z + 1.2]]);
  const door = k.pathOf([[CAB.x + 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, CAB_H - 2], [CAB.x + 1.6, fy, CAB_H - 2]].map(at), true);
  const label = [[CAB.x + 4, fy, 72], [CAB.x + 14, fy, 72], [CAB.x + 14, fy, 78], [CAB.x + 4, fy, 78]];
  box('ctrl.body', CAB, 0, CAB_H, { tone: 'mid' }, {
    steps: 2, bevel: 0.5, attrs: cue('ctrl'),
    inner: L(door, { tone: 'lo' }) + L(k.sideSeam(CAB, CAB_H - 8, P, 2), { tone: 'faint' }),
    extra: slots(vents) + card(label) + L([76, 74].map((z, i) => k.segment([CAB.x + 5, fy, z], [CAB.x + [12, 10][i], fy, z], P)).join(''), { tone: 'lo', free: true }) + Dt([[CAB.x + 3, fy, 5], [CAB.x + 3, fy, CAB_H - 4]].map(at), { size: 0.4 }),
  });
  discAt('ctrl.switch', frameY([CAB.x + CAB.w - 5, fy, 56]), 0, 1.2, 3, { tone: 'lo' }, { steps: 18 });
  discAt('ctrl.knob', frameY([CAB.x + CAB.w - 5, fy, 56]), 1.2, 3, 1.6, { tone: 'hi', crease: 'none' }, { steps: 16 });
  const sx = CAB.x + CAB.w;
  box('ctrl.hook', { x: sx, y: CAB.y + 12, w: 1.6, d: 6, r: 0.3 }, 62, 64, { tone: 'lo' }, { steps: 1 });
  box('pendant.body', { x: sx + 1.6, y: CAB.y + 9, w: 2.4, d: 12, r: 0.8 }, 44, 62, { tone: 'hi', crease: 'lo' }, {
    steps: 2, attrs: ' data-k="hookPendant"',
    extra: card([[sx + 4, CAB.y + 11, 59], [sx + 4, CAB.y + 19, 59], [sx + 4, CAB.y + 19, 52], [sx + 4, CAB.y + 11, 52]]) + Dt([[sx + 4, CAB.y + 12, 48], [sx + 4, CAB.y + 15, 48], [sx + 4, CAB.y + 18, 48]].map(at), { size: 0.45 }),
  });
  const tx = CAB.x + 6; const ty = CAB.y + 6;
  post('ctrl.stack-base', tx, ty, 2.6, CAB_H, CAB_H + 2, { tone: 'mid' }, { steps: 14 });
  post('ctrl.stack-auto', tx, ty, 2.1, CAB_H + 2, CAB_H + 6, { tone: 'mid', crease: 'lo' }, { steps: 14, attrs: ' data-k="stackAuto"' });
  post('ctrl.stack-ring', tx, ty, 2.3, CAB_H + 6, CAB_H + 6.4, { tone: 'lo', crease: 'none' }, { steps: 14 });
  post('ctrl.stack-hand', tx, ty, 2.1, CAB_H + 6.4, CAB_H + 10.4, { tone: 'mid', crease: 'lo' }, { steps: 14, attrs: ' data-k="stackHand"' });
  post('ctrl.stack-cap', tx, ty, 2.3, CAB_H + 10.4, CAB_H + 11.6, { tone: 'mid' }, { steps: 14, extra: Dt([at([tx, ty, CAB_H + 11.6])], { size: 0.4, tone: 'hi' }) });
}

// ---------------------------------------------------------------- the setter inside the cell, with the pendant in both hands
// (simple solids: shoes, legs, coat, arms, head, cap; shown in the teaching scene)
{
  const [ox, oy] = SET;
  const sc = ' data-setter=""';
  for (const dx of [-2.6, 2.6]) {
    box('set.shoe', { x: ox + dx - 1.8, y: oy - 3.4, w: 3.6, d: 6, r: 1.2 }, 0, 1.6, { tone: 'lo' }, { steps: 2, layer: 'front', attrs: sc });
    post('set.leg', ox + dx, oy, 1.9, 1.6, 40, { tone: 'mid', crease: 'none' }, { steps: 12, layer: 'front', attrs: sc });
  }
  box('set.coat', plan(ox, oy, 12, 7, 2.6), 38, 66, { tone: 'hi', crease: 'lo' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(plan(ox, oy, 12, 7, 2.6), 52, P, 3), { tone: 'faint' }), layer: 'front', attrs: sc });
  for (const dx of [-7.4, 7.4]) post('set.arm', ox + dx, oy, 1.7, 48, 64, { tone: 'hi', crease: 'lo' }, { steps: 10, layer: 'front', attrs: sc });
  // forearms forward to the pendant, held at the chest, toward the robot (−y)
  for (const dx of [-6, 6]) box('set.forearm', { x: ox + dx - 1.5, y: oy - 9, w: 3, d: 8, r: 1.2 }, 46, 49, { tone: 'hi', crease: 'lo' }, { steps: 2, layer: 'front', attrs: sc });
  post('set.neck', ox, oy, 1.8, 66, 69, { tone: 'mid' }, { steps: 10, layer: 'front', attrs: sc });
  post('set.head', ox, oy, 3.6, 69, 77, { tone: 'mid', crease: 'none' }, { steps: 16, bevel: 1.2, layer: 'front', attrs: sc });
  post('set.cap', ox, oy, 3.9, 76, 79, { tone: 'lo' }, { steps: 16, bevel: 1, layer: 'front', attrs: sc });
  const pd = { x: ox - 7, y: oy - 12, w: 14, d: 4, r: 1 };
  box('set.pendant', pd, 47, 51, { tone: 'hi', crease: 'lo' }, { steps: 2, bevel: 0.3, layer: 'front', attrs: sc + cue('pendant'), extra: card([[pd.x + 2, pd.y + 0.6, 51], [pd.x + 9, pd.y + 0.6, 51], [pd.x + 9, pd.y + 3.4, 51], [pd.x + 2, pd.y + 3.4, 51]]) + Dt([at([pd.x + 11.5, pd.y + 2, 51])], { size: 0.45 }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((it) => it.layer === name).sort((a, b) => a.key - b.key).map((it) => `<g data-name="${it.name}"${it.attrs ?? ''}>${it.svg}</g>`).join('');
const g = (key, body = '', extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;

// the operator outside the curtain: drawn last (always nearest), moved as a whole
const operator = (() => {
  const [ox, oy] = OPR;
  const sv = [];
  const bx = (p, z0, z1, style, bevel = 0, steps = 2) => sv.push(S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style }));
  const cy = (cx, cyy, r, z0, z1, style, steps = 8, bevel = 0) => sv.push(S(k.cylinder(cx, cyy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style }));
  for (const dx of [-2.6, 2.6]) { bx({ x: ox + dx - 1.8, y: oy - 3.4, w: 3.6, d: 6, r: 1.2 }, 0, 1.6, { tone: 'lo' }); cy(ox + dx, oy, 1.9, 1.6, 40, { tone: 'mid', crease: 'none' }); }
  bx(plan(ox, oy, 12, 7, 2.6), 38, 66, { tone: 'hi', crease: 'lo', inner: L(k.sideSeam(plan(ox, oy, 12, 7, 2.6), 52, P, 3), { tone: 'faint' }) }, 0.6, 3);
  cy(ox - 7.4, oy, 1.7, 42, 64, { tone: 'hi', crease: 'lo' });
  cy(ox, oy, 1.8, 66, 69, { tone: 'mid' });
  cy(ox, oy, 3.6, 69, 77, { tone: 'mid', crease: 'none' }, 10, 1.2);
  cy(ox, oy, 3.9, 76, 79, { tone: 'lo' }, 10, 1);
  return sv.join('');
})();

const world = [
  halo,
  layerOf('floor'),
  g('floorLive'),
  `<g data-cue="fence">${meshFar}</g>`,
  layerOf('back'),
  g('far'),
  `<g data-cue="robot">${g('arm')}<g data-cue="flange">${g('flange')}</g><g data-cue="eoat"><g data-cue="gripper"><g data-cue="double">${g('grip')}</g></g></g></g>`,
  g('held'),
  `<g data-cue="tcp">${g('tcp')}</g>`,
  `<g data-cue="fence">${meshNear}</g>`,
  layerOf('front'),
  beamSvg,
  g('cone'),
  `<g data-cue="stop">${g('opr', operator)}</g>`,
  g('reach'),
  g('marks'),
  `<g data-cue="axis">${g('axisMark')}</g>`,
].join('');
const cueSlot = (c, key) => `<g data-cue="${c}">${g(key)}</g>`;
const hud = [
  g('pendC', [g('pendBase'), cueSlot('enable', 'pendSw'), cueSlot('speed', 'pendSpeed')].join('')),
  g('loadC', [g('loadBase'), cueSlot('payload', 'loadBody')].join('')),
  g('typeC', [cueSlot('scara', 'typeScara'), cueSlot('cobot', 'typeCobot')].join('')),
  g('cycC', [g('cycBase'), cueSlot('one', 'cycOne'), cueSlot('two', 'cycTwo')].join('')),
  g('safeC', [g('safeBase'), cueSlot('stop', 'safeStop'), cueSlot('dist', 'safeDist')].join('')),
  g('offC', cueSlot('offline', 'offBody')),
  g('taktC', [g('taktBase'), cueSlot('pfl', 'taktPfl'), cueSlot('ssm', 'taktSsm')].join('')),
].join('');
// Page weight: drop a line point within 0.5 units of the last one kept, only in plain M/L/Z paths.
const slim = (s) => s.replace(/ d="([^"]*)"/g, (m, d) => {
  if (!/^[MLZ0-9 .-]+$/.test(d)) return m;
  const out = [];
  let last = null;
  for (const tok of d.match(/[MLZ][^MLZ]*/g) ?? []) {
    if (tok[0] === 'Z') { out.push('Z'); last = null; continue; }
    const xy = tok.slice(1).trim();
    const [x, y] = xy.split(/\s+/).map(Number);
    if (tok[0] === 'L' && last && Math.hypot(x - last[0], y - last[1]) < 0.5) continue;
    out.push(tok[0] + xy);
    last = [x, y];
  }
  return ` d="${out.join('')}"`;
});
// Static paths (as in eng.machining.workholding and measuring) written with relative line-tos: the same points (to 0,1), about a
// third fewer bytes. Only M, L and Z paths at one decimal are rewritten.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && out && !/[MlZ]$/.test(out) && s[0] !== '-') out += ' ';
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put('M', p); cur = p; start = p; cmd = 'L'; } else { put('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
  }
  return out;
}
// read a path back to absolute points in tenths, to prove the rewrite exact
function pointsOf(d) {
  const tok = d.match(/[MLZlz]|-?\d*\.?\d+/g);
  const out = [];
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  for (let i = 0; i < tok.length;) {
    if (/[MLZlz]/.test(tok[i])) { cmd = tok[i++]; if (/[Zz]/.test(cmd)) { out.push('Z'); cur = start; } continue; }
    const v = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    cur = cmd === 'l' ? [cur[0] + v[0], cur[1] + v[1]] : v;
    if (cmd === 'M') { start = cur; cmd = 'L'; out.push('M'); }
    out.push(cur.join());
  }
  return out.join(' ');
}
const compact = (html) => html.replace(/ d="([MLZ\d.\s-]+)"/g, (m, d) => {
  if (/\.\d\d/.test(d)) return m;
  const c = compactPath(d);
  if (pointsOf(c) !== pointsOf(d)) throw new Error(`compactPath changed a path: ${d.slice(0, 60)}`);
  return ` d="${c}"`;
});
const svg = compact(slim(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`));

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WIDE = cam([-14, 4, 46], 580);
const ROBOTV = cam([0, -20, 80], 400);
const FEEDV = cam([-50, -20, 70], 420);
const CTRLV = cam([-110, -40, 60], 420);
const ARMV = cam([0, -20, 82], 330);
const GRIPV = cam([-58, -1, 92], 200);
const PATHV = cam([2, -12, 96], 330);
const CRASHV = cam([PLACE[0], PLACE[1], TABLE_Z + 14], 210);
const LEFT = cam([0, 0, 60], 470, [200, 210]); // the cell on the left, a card on the right
const SETV = cam([0, 12, 56], 330, [190, 215]);
const WRISTV = cam([-58, -1, 96], 190, [190, 200]);
const REACHV = cam([0, -10, 30], 560);
const FLOORV = cam([0, 20, 20], 600);
const MACHV = cam([30, -20, 70], 480, [200, 210]);
const BOWLV = cam([-64, -48, 56], 300);
const CURV = cam([-14, 64, 52], 400, [190, 220]);
const BINV = cam([40, 14, 50], 320);
const C = { W, H, KS, PED, SH_Z, LINK, TOOL, BELT_Z, PART, PICK, PLACE, TABLE_Z, HAZ, CUR_Y, FX, LC, BOWL, BOWL_Z, BIN, BIN_Z, CAM, SCAN, OPR, HAND, LOAD, CELL, SAFE, COBOT };
C.KEYS = [
  [WIDE, ROBOTV, FEEDV, CTRLV, WIDE], // s1 how a robot cell works
  [ARMV, GRIPV, PATHV, CRASHV], // s2 six axes and the TCP
  [SETV, SETV, SETV, WIDE], // s3 teaching with the pendant
  [WRISTV, WRISTV, LEFT, LEFT], // s4 payload, flange and tooling
  [REACHV, LEFT, LEFT, FLOORV], // s5 robot types and guarding
  [MACHV, MACHV, MACHV, BOWLV], // s6 the cell round its cycle
  [CURV, CURV, CURV, CURV], // s7 light curtain and safety distance
  [BINV, BINV, LEFT], // s8 vision and offline programming
  [LEFT, LEFT, LEFT, LEFT], // s9 when a cobot fits
];

// ---------------------------------------------------------------- the film
const RB = 'eng.lines.robotbasics';
const RO = 'eng.lines.robots';
const RC = 'eng.lines.robotcell';
const VI = 'eng.lines.vision';
const spec = {
  id: 'eng.lines.robots',
  title: { nl: 'Een robot leren kennen', en: 'Getting to know a robot' },
  lessons: [RB, RO, RC, VI],
  scenes: [
    {
      // v14b: the Basis "how it works" tour of the cell
      id: 's1', lesson: RB, level: 1, still: 0.5, title: { nl: 'Hoe een robotcel werkt', en: 'How a robot cell works' },
      beats: [
        { nl: 'Een robotcel: een robotarm op een vaste voet, met een hek eromheen.', en: 'A robot cell: a robot arm on a fixed base, with a fence around it.', cues: ['fence', 'robot'] },
        { nl: 'Hier pakt hij onderdelen van een band.', en: 'Here it picks parts off a belt.', cues: ['belt'] },
        { nl: 'Hij zet ze op de laadtafel van een machine.', en: 'It puts them on the loading table of a machine.', cues: ['machine'] },
        { nl: 'Buiten het hek: de besturing, de computer met de aandrijvingen van de arm.', en: 'Outside the fence: the controller, the computer with the arm’s drives.', cues: ['ctrl'] },
        { nl: 'Elke cyclus hetzelfde: pakken, verplaatsen, neerzetten, terug.', en: 'Every cycle the same: pick, move, place, back.', cues: ['robot'] },
      ],
    },
    {
      id: 's2', lesson: RB, level: 1, still: 0.5, title: { nl: 'Zes assen en het TCP', en: 'Six axes and the tool centre point' },
      beats: [
        { nl: 'Zes draaiende gewrichten, elk een {t:As|as}: voet, schouder, elleboog en drie in de pols.', en: 'Six turning joints, each an {t:Axis|axis}: base, shoulder, elbow and three in the wrist.', cue: { As: 'axis' } },
        { nl: 'Op de pols een {t:Grijper|grijper}: vingers op perslucht die het product pakken.', en: 'On the wrist a {t:Gripper|gripper}: fingers on compressed air that grip the part.', cue: { Grijper: 'gripper' } },
        { nl: 'De {t:TCP} is de werkende punt van het gereedschap; het programma is een lijst TCP-posities.', en: 'The {t:Tool centre point|tool centre point} is the tool’s working tip; the program is a list of its positions.', cue: { TCP: 'tcp' } },
        { nl: 'Na een botsing kan het gereedschap verbogen zijn: dan zit elk punt ernaast.', en: 'After a crash the tool may be bent: then every point is off.', cues: ['tcp'] },
      ],
    },
    {
      id: 's3', lesson: RB, level: 1, still: 0.5, title: { nl: 'Inleren met de pendant', en: 'Teaching with the pendant' },
      beats: [
        { nl: 'Posities leer je in met de {t:Teach pendant|teach pendant}: een tablet aan een kabel.', en: 'You teach positions with the {t:Teach pendant|teach pendant}: a tablet on a cable.', cue: { 'Teach pendant': 'pendant' } },
        { nl: 'De robot beweegt alleen met de {t:Vrijgaveknop|vrijgaveknop} in de middelste stand.', en: 'The robot only moves with the {t:Enabling switch|enabling switch} held in the middle.', cue: { Vrijgaveknop: 'enable' } },
        { nl: 'In handbediening hooguit {n:250} mm/s: {n:1.5} meter duurt minstens {n:6} s.', en: 'In manual mode at most {n:250} mm/s: {n:1.5} metres takes at least {n:6} s.', cues: ['speed'], read: { nl: '{n:1500} / {n:250} = {n:6} s', en: '{n:1500} / {n:250} = {n:6} s' } },
        { nl: 'In automatisch bedrijf, met niemand in de cel, draait hij op volle snelheid.', en: 'In automatic mode, with nobody in the cell, it runs at full speed.', cues: ['robot'] },
      ],
    },
    {
      id: 's4', lesson: RO, level: 2, still: 0.5, title: { nl: 'Flens, grijper en payload', en: 'Flange, gripper and payload' },
      beats: [
        { nl: 'De {t:Flens|flens}: de ronde montageplaat aan het eind van de pols.', en: 'The {t:Flange|flange}: the round mounting plate at the end of the wrist.', cue: { Flens: 'flange' } },
        { nl: 'Wat erop zit heet {t:End-of-arm tooling|end-of-arm tooling}: hier een grijper.', en: 'What is bolted on is the {t:End-of-arm tooling|end-of-arm tooling}: here a gripper.', cue: { 'End-of-arm tooling': 'eoat' } },
        { nl: '{t:Payload|Payload} is alles aan de flens: {n:4} kg grijper + {n:6} kg product = {n:10} kg.', en: '{t:Payload|Payload} is all that hangs on the flange: a {n:4} kg gripper + a {n:6} kg part = {n:10} kg.', cue: { Payload: 'payload' } },
        { nl: 'Op een robot van {n:10} kg is dat {n:100}%, en het gewicht zit {n:150} mm uit de flens: te veel.', en: 'On a {n:10} kg robot that is {n:100}%, and the weight sits {n:150} mm off the flange: too much.', cues: ['payload'] },
      ],
    },
    {
      id: 's5', lesson: RO, level: 2, still: 0.5, title: { nl: 'Robottypes en afscherming', en: 'Robot types and guarding' },
      beats: [
        { nl: 'Een knikarmrobot met zes assen reikt meestal {n:0.7} tot {n:3} meter ver.', en: 'A six-axis articulated robot usually reaches {n:0.7} to {n:3} metres.', cues: ['robot'] },
        { nl: 'Een {t:SCARA-robot|SCARA-robot} heeft vier assen en is heel snel in een horizontaal vlak.', en: 'A {t:SCARA robot|SCARA robot} has four axes and is very fast in a horizontal plane.', cue: { 'SCARA-robot': 'scara' } },
        { nl: 'Een {t:Cobot|cobot} is gemaakt voor werk naast mensen: hij begrenst kracht en snelheid.', en: 'A {t:Cobot|cobot} is built to work next to people: it limits force and speed.', cue: { Cobot: 'cobot' } },
        { nl: 'Afscherming: een hek, een lichtscherm of een {t:Laserscanner|laserscanner} die afremt als iemand nadert.', en: 'Guarding: a fence, a light curtain or an {t:Area scanner|area scanner} that slows it when someone comes near.', cue: { Laserscanner: 'scanner' }, cues: ['fence'] },
      ],
    },
    {
      id: 's6', lesson: RC, level: 3, still: 0.5, title: { nl: 'De cel rond zijn cyclus', en: 'The cell round its cycle' },
      beats: [
        { nl: 'Meestal bepaalt de machine het tempo: de robot wacht op de deur.', en: 'Usually the machine sets the pace: the robot waits for the door.', cues: ['machine'] },
        { nl: 'Enkele grijper: {n:40} s draaien + {n:20} s stil = {n:60} s, dus {n:60} per uur.', en: 'Single gripper: {n:40} s machining + {n:20} s stopped = {n:60} s, so {n:60} an hour.', cues: ['one'] },
        { nl: 'Een {t:Dubbele grijper|dubbele grijper} wisselt in één bezoek: {n:48} s, {n:75} per uur.', en: 'A {t:Double gripper|double gripper} swaps in one visit: {n:48} s, {n:75} an hour.', cue: { 'Dubbele grijper': 'double' }, cues: ['two'] },
        { nl: 'Een {t:Trilpot|trilpot} schudt kleine onderdelen in één stand, op een bekende plek.', en: 'A {t:Vibratory bowl feeder|vibratory bowl feeder} shakes small parts into one orientation, in a known place.', cue: { Trilpot: 'bowl' } },
      ],
    },
    {
      id: 's7', lesson: RC, level: 3, still: 0.5, title: { nl: 'Lichtscherm en veiligheidsafstand', en: 'Light curtain and safety distance' },
      beats: [
        { nl: 'Een {t:Lichtscherm|lichtscherm}: reik door de stralen en de robot stopt.', en: 'A {t:Light curtain|light curtain}: reach through the beams and the robot stops.', cue: { Lichtscherm: 'curtain' } },
        { nl: 'Remmen kost tijd: de {t:Stoptijd|stoptijd}, van straal onderbroken tot robot stil.', en: 'Braking takes time: the {t:Stopping time|stopping time}, from beam broken to robot still.', cue: { Stoptijd: 'stop' } },
        { nl: 'Daarom een {t:Veiligheidsafstand|veiligheidsafstand}: S = K × T + C, met K = {n:2000} mm/s.', en: 'Hence a {t:Safety distance|safety distance}: S = K × T + C, with K = {n:2000} mm/s.', cue: { Veiligheidsafstand: 'dist' } },
        { nl: 'Resolutie {n:30} mm, T = {n:0.15} s: S = {n:300} + {n:128} = {n:428} mm.', en: 'Resolution {n:30} mm, T = {n:0.15} s: S = {n:300} + {n:128} = {n:428} mm.', cues: ['dist'] },
      ],
    },
    {
      id: 's8', lesson: VI, level: 4, still: 0.5, title: { nl: 'Vision en offline programmeren', en: 'Vision and offline programming' },
      beats: [
        { nl: 'Met {t:Vision|vision} vindt een camera onderdelen die niet op een vaste plek liggen.', en: 'With {t:Vision|vision}, a camera finds parts that are not in a fixed place.', cue: { Vision: 'camera' } },
        { nl: '{t:Bin picking|Bin picking}: 3D-vision kijkt in de bak en de robot pakt er één uit.', en: '{t:Bin picking|Bin picking}: 3D vision looks into the box and the robot picks one out.', cue: { 'Bin picking': 'bin' } },
        { nl: '{t:Offline programmeren|Offline programmeren}: het programma testen in een 3D-model op een pc.', en: '{t:Offline programming|Offline programming}: testing the program in a 3D model on a PC.', cue: { 'Offline programmeren': 'offline' } },
      ],
    },
    {
      id: 's9', lesson: VI, level: 4, still: 0.5, title: { nl: 'Wanneer een cobot past', en: 'When a cobot fits' },
      beats: [
        { nl: '{t:Kracht- en vermogensbegrenzing|Kracht- en vermogensbegrenzing}: contact mag, maar onder grenzen per lichaamsdeel.', en: '{t:Power and force limiting|Power and force limiting}: contact is allowed, but below limits per body region.', cue: { 'Kracht- en vermogensbegrenzing': 'pfl' } },
        { nl: 'Cobot, takt {n:14} s: op halve snelheid {n:12} + {n:4} = {n:16} s, te traag.', en: 'A cobot, takt {n:14} s: at half speed {n:12} + {n:4} = {n:16} s, too slow.', cues: ['pfl'] },
        { nl: '{t:Snelheids- en afstandsbewaking|Snelheids- en afstandsbewaking}: een scanner remt af als iemand nadert.', en: '{t:Speed and separation monitoring|Speed and separation monitoring}: a scanner slows it only when someone comes near.', cue: { 'Snelheids- en afstandsbewaking': 'ssm' }, cues: ['scanner'] },
        { nl: 'Zolang er niemand is: volle snelheid, {n:6} + {n:4} = {n:10} s.', en: 'While nobody is near: full speed, {n:6} + {n:4} = {n:10} s.', cues: ['ssm'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units the voice would read badly
// (mm/s, 2.000) are written out. English never uses the word "as" (the Dutch
// term As) nor "TCP" (the Dutch form of the term): it says "tool centre point".
const SAY = [
  [ // s1 how a robot cell works
    { nl: 'Dit is een robotcel: een industriële robot, vastgeschroefd aan de vloer, met een hek eromheen.',
      en: 'This is a robot cell: an industrial robot, bolted to the floor, with a fence around it.' },
    { nl: 'Links voert een band onderdelen aan tot tegen een aanslag, zodat elk onderdeel op een bekende plek ligt.',
      en: 'On the left a belt brings parts up to a stop, so each part lies in a known place.' },
    { nl: 'De robot zet ze op de laadtafel van de machine rechts.',
      en: 'The robot puts them on the loading table of the machine on the right.' },
    { nl: 'Buiten het hek staat de besturing, met de aandrijvingen. Elk gewricht heeft een servomotor die naar een exacte positie rijdt.',
      en: 'Outside the fence stands the controller, with the drives. Each joint has a servo motor that drives to an exact position.' },
    { nl: 'Zo herhaalt hij dezelfde cyclus, dag in, dag uit.',
      en: 'So it repeats the same cycle, day in, day out.' },
  ],
  [ // s2 six axes and the TCP
    { nl: 'Elk draaiend gewricht is een {t:As|as}. De voet draait de arm rond, schouder en elleboog tillen, en drie assen in de pols draaien en kantelen de hand.',
      en: 'Each turning joint is an {t:Axis|axis}. The base turns the arm round, shoulder and elbow lift, and three axes in the wrist turn and tilt the hand.' },
    { nl: 'Op de pols zit een {t:Grijper|grijper}: twee vingers die op perslucht om het product sluiten. Het gereedschap bepaalt de klus.',
      en: 'On the wrist sits a {t:Gripper|gripper}: two fingers that close round the part on compressed air. The tool decides the job.' },
    { nl: 'Het programma is een lijst posities van één punt: de {t:TCP}. Dat is de werkende punt van het gereedschap, hier tussen de vingers.',
      en: 'The program is a list of positions of one point: the {t:Tool centre point|tool centre point}, the working tip of the tool, here between the fingers.' },
    { nl: 'Raakt het gereedschap verbogen bij een botsing, dan zit elke positie evenveel naast. Na een crash controleert de insteller de TCP.',
      en: 'If the tool gets bent in a crash, every position is off by the same amount. After a crash, the setter checks the tool centre point.' },
  ],
  [ // s3 teaching with the pendant
    { nl: 'Posities leer je in met de {t:Teach pendant|teach pendant}: een zware tablet aan een kabel, met een joystick en een noodstop.',
      en: 'You teach positions with the {t:Teach pendant|teach pendant}: a heavy tablet on a cable, with a joystick and an emergency stop.' },
    { nl: 'Achterop zit de {t:Vrijgaveknop|vrijgaveknop}, met drie standen. Alleen in het midden beweegt de robot. Laat je los, of knijp je hard van schrik, dan stopt hij.',
      en: 'On the back sits the {t:Enabling switch|enabling switch}, with three positions. The robot only moves in the middle one. Let go, or squeeze hard in a fright, and it stops.' },
    { nl: 'In handbediening beweegt het gereedschap hooguit {n:250} millimeter per seconde. Een punt {n:1.5} meter verderop kost dus minstens {n:6} seconden.',
      en: 'In manual mode the tool moves at most {n:250} millimetres a second. A point {n:1.5} metres away takes at least {n:6} seconds.' },
    { nl: 'Met de cel leeg draait hij in automatisch op volle snelheid. Inleren kan uren kosten; een cyclus daarna seconden.',
      en: 'With the cell empty, it runs in automatic at full speed. Teaching can take hours; a cycle then takes seconds.' },
  ],
  [ // s4 flange, gripper and payload
    { nl: 'Aan het eind van de pols zit de {t:Flens|flens}: een ronde montageplaat.',
      en: 'At the end of the wrist sits the {t:Flange|flange}: a round mounting plate.' },
    { nl: 'Wat erop zit, heet {t:End-of-arm tooling|end-of-arm tooling}: hier een grijper.',
      en: 'What is bolted on is called {t:End-of-arm tooling|end-of-arm tooling}: here a gripper.' },
    { nl: 'De {t:Payload|payload} is wat de robot aan zijn flens mag dragen, inclusief de grijper. {n:4} kilo grijper plus een gietstuk van {n:6} is {n:10} kilo.',
      en: 'The {t:Payload|payload} is what the robot may carry at its flange, including the gripper. A {n:4} kilo gripper plus a {n:6} kilo casting is {n:10} kilos.' },
    { nl: 'Op een robot van {n:10} kilo is dat {n:100} procent, en het gewicht zit {n:150} millimeter uit de flens. Volgens het payloaddiagram mag er dan minder aan.',
      en: 'On a {n:10} kilo robot that is {n:100} percent, and the weight sits {n:150} millimetres off the flange. The payload diagram then allows less.' },
  ],
  [ // s5 robot types and guarding
    { nl: 'Deze knikarmrobot, met zes assen als een mensenarm, reikt meestal {n:0.7} tot {n:3} meter.',
      en: 'This articulated robot has six axes, like a human arm, and usually reaches {n:0.7} to {n:3} metres.' },
    { nl: 'Een {t:SCARA-robot|SCARA-robot} heeft vier assen en zwaait heel snel in een horizontaal vlak: kleine onderdelen oppakken en neerzetten, of schroeven.',
      en: 'A {t:SCARA robot|SCARA robot} has four axes and swings very fast in a horizontal plane: picking and placing small parts, or driving screws.' },
    { nl: 'Een {t:Cobot|cobot} is gemaakt om naast mensen te werken: hij begrenst kracht en snelheid. Maar een cobot met een mes is niet veilig: het gaat om de toepassing.',
      en: 'A {t:Cobot|cobot} is built to work next to people: it limits force and speed. But a cobot with a knife is not safe: it is the application that counts.' },
    { nl: 'Industriële robots werken achter een hek, een lichtscherm, of een {t:Laserscanner|laserscanner} die afremt als iemand een zone in loopt. Elke cel krijgt een risicobeoordeling.',
      en: 'Industrial robots work behind a fence, a light curtain, or an {t:Area scanner|area scanner} that slows the robot when someone walks into a zone. Every cell gets a risk assessment.' },
  ],
  [ // s6 the cell round its cycle
    { nl: 'Meestal bepaalt de machine het tempo: de robot wacht op de deur. De vraag is hoe lang de machine stilstaat terwijl de robot wisselt.',
      en: 'Usually the machine sets the pace: the robot waits for the door. The question is how long the machine stands still while the robot swaps parts.' },
    { nl: 'De draaibank draait {n:40} seconden. Met een enkele grijper staat hij {n:20} seconden stil: samen {n:60} seconden, {n:60} stuks per uur.',
      en: 'The lathe runs for {n:40} seconds. With a single gripper it stands still for {n:20} seconds: {n:60} seconds in all, {n:60} parts an hour.' },
    { nl: 'Een {t:Dubbele grijper|dubbele grijper} komt aan met het ruwe stuk al in de hand en wisselt in één bezoek: {n:8} seconden stil, {n:75} per uur. Check wel de payload.',
      en: 'A {t:Double gripper|double gripper} arrives with the raw part already in hand and swaps in one visit: {n:8} seconds stopped, {n:75} an hour. Do check the payload.' },
    { nl: 'De aanvoer is vaak lastiger dan de robot. Een {t:Trilpot|trilpot} schudt kleine onderdelen langs een spiraalbaan, zodat ze er in één stand uitkomen.',
      en: 'Feeding is often harder than the robot. A {t:Vibratory bowl feeder|vibratory bowl feeder} shakes small parts up a spiral track, so they come out in one orientation.' },
  ],
  [ // s7 light curtain and safety distance
    { nl: 'De open voorkant heeft een {t:Lichtscherm|lichtscherm}: een rij lichtstralen. Onderbreekt een hand een straal, dan stopt de robot.',
      en: 'The open front has a {t:Light curtain|light curtain}: a row of light beams. When a hand breaks a beam, the robot stops.' },
    { nl: 'Maar niet meteen: de {t:Stoptijd|stoptijd} loopt van straal onderbroken tot robot stil. Meet hem op de echte robot, met de echte grijper.',
      en: 'But not at once: the {t:Stopping time|stopping time} runs from beam broken to robot still. Measure it on the real robot, with the real gripper.' },
    { nl: 'Intussen beweegt de hand door. Daarom hangt het scherm op een {t:Veiligheidsafstand|veiligheidsafstand}: S is K maal T plus C, met K tweeduizend millimeter per seconde.',
      en: 'Meanwhile the hand moves on. So the curtain hangs at a {t:Safety distance|safety distance}: S equals K times T plus C, with K two thousand millimetres a second.' },
    { nl: 'Een scherm met een resolutie van {n:30} millimeter geeft een C van {n:128}. Bij {n:0.15} seconde wordt S {n:300} plus {n:128}: {n:428} millimeter. Kom je boven de {n:500} uit, dan reken je opnieuw met een lagere K.',
      en: 'A curtain with a {n:30} millimetre resolution gives a C of {n:128}. At {n:0.15} seconds, S is {n:300} plus {n:128}: {n:428} millimetres. Above {n:500}, you recalculate with a lower K.' },
  ],
  [ // s8 vision and offline programming
    { nl: 'Met {t:Vision|vision} vindt een camera onderdelen die niet op een vaste plek liggen, en vertelt de robot waar hij moet pakken.',
      en: 'With {t:Vision|vision}, a camera finds parts that are not in a fixed place, and tells the robot where to pick.' },
    { nl: 'Bij {t:Bin picking|bin picking} kijkt een 3D-camera in een bak losse onderdelen. Vraag het pakpercentage op je eigen onderdelen, ook de laatste.',
      en: 'In {t:Bin picking|bin picking}, a 3D camera looks into a box of loose parts. Ask for the pick rate on your own parts, the last ones too.' },
    { nl: 'Bij {t:Offline programmeren|offline programmeren} test je het programma in een 3D-model op een pc, terwijl de cel doorproduceert. Ter plekke corrigeer je nog een paar punten.',
      en: 'In {t:Offline programming|offline programming}, you test the program in a 3D model on a PC while the cell keeps producing. On site you touch up a few points.' },
  ],
  [ // s9 when a cobot fits
    { nl: 'Een cobot zonder hek werkt vaak met {t:Kracht- en vermogensbegrenzing|kracht- en vermogensbegrenzing}: contact mag, onder grenzen per lichaamsdeel. Dat betekent meestal langzaam.',
      en: 'A cobot without a fence often works with {t:Power and force limiting|power and force limiting}: contact is allowed, below limits per body region. That usually means slow.' },
    { nl: 'Stel: takt {n:14} seconden, en de risicobeoordeling staat alleen halve snelheid toe. De beweging van {n:6} seconden wordt {n:12}, plus {n:4} voor de rest: {n:16} seconden. Te traag.',
      en: 'Say the takt is {n:14} seconds, and the risk assessment allows only half speed. The {n:6} second move becomes {n:12}, plus {n:4} for the rest: {n:16} seconds. Too slow.' },
    { nl: '{t:Snelheids- en afstandsbewaking|Snelheids- en afstandsbewaking} werkt ook bij een industriële robot zoals deze: komt iemand dichterbij, dan remt een scanner hem af.',
      en: '{t:Speed and separation monitoring|Speed and separation monitoring} also works on an industrial robot like this one: when someone comes closer, a scanner slows it down.' },
    { nl: 'Is er niemand, dan draait hij op volle snelheid: {n:10} seconden, binnen de takt. Vraag dus hoe vaak er echt iemand de zone in loopt.',
      en: 'With nobody near, it runs at full speed: {n:10} seconds, inside the takt. So ask how often someone really walks into the zone.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 1.8 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = ['nl', 'en'].map((lang) => beatStarts(s, lang).map((t) => t / s.dur));
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = Math.max(st[0][bi], st[1][bi]);
      const e = bi + 1 < st[0].length ? Math.min(st[0][bi + 1], st[1][bi + 1]) : 1;
      b.still = Math.round((a + 0.8 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n`;
// The stage script ships without its comment lines and indentation (no
// template literal in stage.js spans lines, so nothing visible changes).
const lean = (src) => src.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).join('\n');
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'));

const css = `
:root{--rb-arm:#173339;--rb-arm-top:#1F4048;--rb-arm-dark:#0F262B;--rb-part:#2A4A50;--rb-part-top:#35585E;--rb-mesh:rgba(92,159,174,.05);--rb-hole:#071A1E;--rb-glass:#0A2228;--rb-zone:rgba(92,159,174,.16)}
.iso[data-theme="light"]{--rb-arm:#FDFBF6;--rb-arm-top:#FFFFFF;--rb-arm-dark:#E6DFCD;--rb-part:#E9E2D1;--rb-part-top:#F6F1E6;--rb-mesh:rgba(39,111,129,.04);--rb-hole:#D5CCB6;--rb-glass:#DCE7E4;--rb-zone:rgba(39,111,129,.12)}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-svg .fp-tx{fill:var(--anatomy-text)}
.fp-svg .fp-acc{fill:var(--fp-accent-text)}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.rb-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rb-slot{fill:var(--rb-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rb-loose{fill:var(--rb-part-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rb-window{fill:var(--rb-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rb-mesh{fill:var(--rb-mesh);stroke:none}
.rb-beam{fill:none;stroke:var(--anatomy-faint);stroke-width:1;vector-effect:non-scaling-stroke}
[data-cue][data-on] .rb-beam,.rb-beam[data-cut]{stroke:var(--fp-accent);stroke-width:1.4}
.rb-cap{fill:none;stroke-linecap:round;stroke-linejoin:round}
.rb-cyl{fill:none;stroke-linecap:butt}
.rb-o{stroke:var(--anatomy-hi)}
.rb-f{stroke:var(--rb-arm)}
.rb-t{stroke:var(--rb-arm-top)}
.rb-g{stroke:var(--anatomy-mid)}
.rb-cable{stroke:var(--rb-arm-dark)}
.rb-endc{fill:var(--rb-arm-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rb-hub{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.rb-lit .rb-o,[data-cue][data-on] .rb-o{stroke:var(--fp-accent)}
.rb-lit .rb-f,.rb-lit .rb-t,[data-cue][data-on] .rb-f,[data-cue][data-on] .rb-t{stroke:var(--anatomy-lit-top)}
.rb-lit .rb-endc,[data-cue][data-on] .rb-endc{stroke:var(--fp-accent);fill:var(--anatomy-lit-top)}
.rb-lit .rb-hub,[data-cue][data-on] .rb-hub{stroke:var(--fp-accent)}
.rb-pt{stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.rb-pt[data-f="top"]{fill:var(--rb-part-top)}.rb-pt[data-f="a"]{fill:var(--rb-part)}.rb-pt[data-f="b"]{fill:var(--rb-arm-dark)}
.rb-tcp{fill:var(--fp-accent);stroke:var(--anatomy-card);stroke-width:.6px}
.rb-ghost{fill:none;stroke:var(--fp-accent);stroke-width:1.2;stroke-dasharray:2.5 2;vector-effect:non-scaling-stroke}
.rb-zone{fill:var(--rb-zone);stroke:var(--fp-accent);stroke-width:1;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.rb-zone-in{fill:var(--rb-zone);stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
.rb-s{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-linecap:round;vector-effect:non-scaling-stroke}
.rb-cone{fill:var(--fp-accent);fill-opacity:.12;stroke:var(--fp-accent);stroke-width:1;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}
.rb-skin{stroke:var(--anatomy-shade-3)}
.rb-lamp .iso-top,.rb-lamp .iso-shade,.rb-lamp .iso-fill{fill:var(--fp-accent)}
.rb-shape{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.rb-plain{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.rb-shape2{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.rb-line{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.rb-thick{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.rb-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.rb-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.rb-band{fill:var(--anatomy-mid);opacity:.22}
.rb-on{fill:var(--fp-accent)}
.rb-onl{stroke:var(--fp-accent)!important}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .rb-shape,[data-cue][data-on] .rb-shape2{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .rb-shape{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .rb-line,[data-cue][data-on] .rb-dash,[data-cue][data-on] .rb-arrow,[data-cue][data-on] .rb-thick{stroke:var(--fp-accent)}
[data-cue][data-on] .rb-band{fill:var(--fp-accent);opacity:.3}
`;

const label = {
  nl: 'Een robotcel schuin van boven: in het midden een zesassige industriële robot op een sokkel met een grijper, links een aanvoerband met aanslag, een trilpot en een bak met losse onderdelen onder een 3D-camera, rechts een machine met laadtafel. Een hek van gaas aan drie kanten, een lichtscherm over de open voorkant, een laserscanner bij de sokkel, buiten het hek de besturing met de teach pendant. Een insteller met een pendant in de cel en een operator voor het lichtscherm. Daarover kaarten met de pendant en de vrijgaveknop, de payload, een SCARA-robot en een cobot, de cyclus met een enkele en een dubbele grijper, de veiligheidsafstand, een 3D-model op een pc en de takt van een cobot.',
  en: 'A robot cell seen at an angle from above: in the middle a six-axis industrial robot on a pedestal with a gripper, on the left an infeed belt with a stop, a vibratory bowl feeder and a box of loose parts under a 3D camera, on the right a machine with a loading table. Mesh fencing on three sides, a light curtain across the open front, an area scanner at the pedestal, and outside the fence the controller with the teach pendant. A setter with a pendant inside the cell and an operator in front of the light curtain. Over it cards with the pendant and its enabling switch, the payload, a SCARA robot and a cobot, the cycle with a single and a double gripper, the safety distance, a 3D model on a PC and a cobot’s takt.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

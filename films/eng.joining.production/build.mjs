// Dev tool, not shipped. Builds the explainer film "De lasrobotcel / The
// welding robot cell" for the topic Lassen in productie of Lassen en verbinden
// (weldcell L1, fixturing L2, arcon L3, weldsystem L4).
//
//   node films/eng.joining.production/build.mjs            build the page
//   node films/eng.joining.production/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.production.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section
// 3. The world is the cell of the figure eng.joining.cell (same layout, same
// numbers): a six-axis robot on a pedestal, a two-station turntable positioner
// with a welding screen and a fixture on each half, the power source and wire
// drum, a torch cleaning station, a fume hood, the fence with a light curtain
// at the loading side, the controller with its teach pendant outside, and the
// operator at the loading side. The robot arm, the stations, the screen, the
// arc and the fumes are drawn per frame by stage.js; the charts (the cycle
// timeline, seam finding, the beam and its shrinkage, a day of arc time, the
// cost of a metre, the paper chain) are cards in stage space over it.
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
// weldcell (example): weld 6 min, load 4 min, table turn 0,3 min
const CELL = { weld: 6, load: 4, turn: 0.3 };
CELL.one = CELL.weld + CELL.load;
CELL.two = Math.max(CELL.weld, CELL.load) + CELL.turn;
CELL.perOne = 60 / CELL.one;
CELL.perTwo = Math.round((60 / CELL.two) * 10) / 10;
CELL.gain = Math.round((60 / CELL.two / CELL.perOne - 1) * 100);
assert(CELL.one === 10 && near(CELL.perOne, 6), 'one station: 6 + 4 = 10 min, 6 per hour');
assert(near(CELL.two, 6.3) && near(CELL.perTwo, 9.5), 'two stations: 6 + 0,3 = 6,3 min, 9,5 per hour');
assert(CELL.gain === 59, 'about 59 % more output');
assert(near(Math.max(4, 6) + CELL.turn, 6.3), 'loading longer than welding: the robot waits for the operator');
// fixturing: the seam within half the wire diameter; the beam
const SEAM = { wire: 1.2 };
SEAM.tol = SEAM.wire / 2;
assert(near(SEAM.tol, 0.6), '1,2 mm wire: ±0,6 mm');
const BEAM = { len: 2, welds: 6, short: 3, after: 1 };
BEAM.perWeld = BEAM.short / BEAM.welds;
assert(near(BEAM.perWeld, 0.5), '3 mm / 6 welds = 0,5 mm per weld');
// arcon: a5 fillet 196 g/m at 5 kg/h → 2,4 min arc per metre; hand and robot cost
const COST = { g: 196, rate: 5, hand: { bf: 0.3, eur: 60 }, robot: { bf: 0.7, eur: 90 }, low: 0.4, wire: { price: 2.5, eff: 0.95 } };
COST.arc = Math.round(((COST.g / 1000) / COST.rate) * 60 * 10) / 10;
COST.handM = (COST.arc / COST.hand.bf) * (COST.hand.eur / 60);
COST.robotM = (COST.arc / COST.robot.bf) * (COST.robot.eur / 60);
COST.lowM = (COST.arc / COST.low) * (COST.robot.eur / 60);
COST.wireM = ((COST.g / 1000) / COST.wire.eff) * COST.wire.price;
COST.even = (COST.arc * (COST.robot.eur / 60)) / COST.handM;
assert(near(COST.arc, 2.4), '196 g at 5 kg/h ≈ 2,4 min');
assert(near(COST.handM, 8) && near(Math.round(COST.robotM * 100) / 100, 5.14), 'hand € 8,00, robot € 5,14');
assert(near(COST.lowM, 9) && near(COST.even, 0.45) && near(Math.round(COST.wireM * 100) / 100, 0.52), 'robot at 40 % € 9,00; break-even 45 %; wire € 0,52');
// arcon (recall): 60 % duty cycle at 300 A is 6 of every 10 minutes
const DUTY = { pct: 60, amp: 300 };
assert(near((DUTY.pct / 100) * 10, 6), '60 % of 10 min = 6 min');
// weldsystem (example): 14 welders, each certificate confirmed every 6 months → 28 a year
const SYS = { welders: 14, months: 6 };
SYS.year = SYS.welders * (12 / SYS.months);
assert(SYS.year === 28, '14 × 2 = 28');
const EXC = { 1: 4, 2: 3, 3: 2, 4: 2 }; // EN 1090-2: execution class → ISO 3834 part

// ---------------------------------------------------------------- the world (units of 10 mm, z up, +y toward the loading side)
const W = 640;
const H = 400;
const FLOOR = { x: -134, y: -92, w: 230, d: 184, r: 3 };
const FX = 88; const FB = -84; const FS = -35; const FH = 124; // fence sides, back, side post, height
const TC = [0, 22]; // turntable centre; the front fence line runs through it
const TR = 48;
const TZ = 64;
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
const OP = [-24, CUR_Y + 9];
const FUME = [70, -78];
const FIXT = { u: [-30, 30], v: [-36, -4], h: 2 };
const BARS = [[-27, 27, -33, -29], [-27, 27, -11, -7], [-27, -23, -29, -11], [23, 27, -29, -11], [-2, 2, -29, -11]];
const BAR_H = 4;
const JOINTS = [[[-27, -29], [-23, -29]], [[-2, -29], [2, -29]], [[23, -29], [27, -29]], [[23, -11], [27, -11]], [[-2, -11], [2, -11]], [[-27, -11], [-23, -11]]];
const CLAMPS = [[-15, -36], [15, -36], [-15, -4], [15, -4]];

const FIT = [...k.boxCorners(FLOOR, -3, 0), [-FX, FB, FH], [FX, FB, FH], [-FX, TC[1], FH], [FX, TC[1], FH], [CAB.x, CAB.y, CAB_H + 14]];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 64, elevation: 34 });
const KS = G.scaleOf(P);
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const Y = [0, 1, 0];
const X = [1, 0, 0];
const Zv = [0, 0, 1];
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
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
const card = (pts) => `<path class="wf-card" d="${k.pathOf(pts.map(at), true)}"/>`;
const slots = (pts) => `<path class="wf-slot" d="${pts.map((q) => k.pathOf(q.map(at), true)).join('')}"/>`;
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
{
  const tape = { x: LC[0] + 4, y: CUR_Y + 5, w: LC[1] - LC[0] - 8, d: 2.4, r: 0.4 };
  const hatch = [];
  for (let x = tape.x + 3; x < tape.x + tape.w - 2; x += 6) hatch.push(k.lineOnTop([x, tape.y], [x + 2.2, tape.y + tape.d], 0.4, P));
  box('floor.walkway', tape, 0, 0.4, { tone: 'mid', crease: 'none' }, { steps: 2, flat: true, extra: L(hatch.join(''), { tone: 'lo' }), layer: 'floor' });
}
box('floor.duct', { x: CAB.x + CAB.w, y: -47, w: PED[0] - 12.5 - (CAB.x + CAB.w), d: 6, r: 0.8 }, 0, 1.4, { tone: 'mid' }, { steps: 2, inner: L(k.lineOnTop([CAB.x + CAB.w, -44], [PED[0] - 12.5, -44], 1.4, P), { tone: 'faint' }), layer: 'floor' });
box('floor.duct-ps', { x: PS.x + PS.w + 2, y: -58, w: PED[0] - 16.5 - (PS.x + PS.w + 2), d: 5, r: 0.8 }, 0, 1.2, { tone: 'mid' }, { steps: 2, inner: L(k.lineOnTop([PS.x + PS.w + 2, -55.5], [PED[0] - 16.5, -55.5], 1.2, P), { tone: 'faint' }), layer: 'floor' });

// ---------------------------------------------------------------- the fence (the posts carry the curtain cue too: fence and light curtain guard together)
const postsAt = [];
for (const x of [-FX, 0, FX]) postsAt.push([x, FB]);
for (const y of [FS, TC[1]]) for (const x of [-FX, FX]) postsAt.push([x, y]);
for (const [x, y] of postsAt) {
  const layer = x === FX ? 'front' : 'back';
  const foot = plan(x, y, 9, 9, 0.6);
  box('fence.foot', foot, 0, 1, { tone: 'lo' }, { steps: 1, extra: Dt(k.corners(foot, 1.6).map(([px, py]) => at([px, py, 1])), { size: 0.35 }), layer });
  box('fence.post', plan(x, y, 4, 4, 0.4), 1, FH, { tone: 'mid' }, { steps: 1, extra: Dt([at([x, y, FH])], { size: 0.4 }), layer, attrs: cue('fence') });
}
function meshPanel(axis, fixed, u0, u1, z0, z1) {
  const point = (u, z) => (axis === 'y' ? [u, fixed, z] : [fixed, u, z]);
  const frame = k.pathOf([point(u0, z0), point(u1, z0), point(u1, z1), point(u0, z1)].map(at), true);
  const inner = [];
  const n = Math.round((u1 - u0) / 9);
  for (let q = 1; q < n; q++) { const u = u0 + ((u1 - u0) * q) / n; inner.push(k.pathOf([at(point(u, z0)), at(point(u, z1))])); }
  const rows = Math.round((z1 - z0) / 9);
  for (let q = 1; q < rows; q++) { const z = z0 + ((z1 - z0) * q) / rows; inner.push(k.pathOf([at(point(u0, z)), at(point(u1, z))])); }
  return `<path class="wf-mesh" d="${frame}"/>` + L(inner.join(''), { tone: 'faint' }) + L(frame, { tone: 'lo' });
}
const MZ = [8, FH - 4];
const meshFar = meshPanel('y', FB, -FX + 2, -2, ...MZ) + meshPanel('y', FB, 2, FX - 2, ...MZ) + meshPanel('x', -FX, FB + 2, FS - 2, ...MZ) + meshPanel('x', -FX, FS + 2, TC[1] - 2, ...MZ);
const meshNear = meshPanel('x', FX, FB + 2, FS - 2, ...MZ) + meshPanel('x', FX, FS + 2, TC[1] - 2, ...MZ);
function curtainPanel(x0, x1) {
  const y = TC[1];
  const frame = k.pathOf([[x0, y, MZ[0]], [x1, y, MZ[0]], [x1, y, 100], [x0, y, 100]].map(at), true);
  const pleats = [];
  for (let x = x0 + 4; x < x1 - 1; x += 4) pleats.push(k.pathOf([at([x, y, MZ[0]]), at([x, y, 100])]));
  return `<path class="wf-curtain" d="${frame}"/>` + L(pleats.join(''), { tone: 'faint' }) + L(frame, { tone: 'lo' });
}

// ---------------------------------------------------------------- the light curtain at the loading side
for (const x of LC) {
  const base = plan(x, CUR_Y, 8, 8, 0.6);
  box('curtain.base', base, 0, 2, { tone: 'lo' }, { steps: 1, extra: Dt(k.corners(base, 1.6).map(([px, py]) => at([px, py, 2])), { size: 0.35 }), layer: 'front', attrs: cue('curtain') });
  const face = x < 0 ? x + 2 : x - 2;
  const lenses = [];
  for (let z = 10; z <= 94; z += 4) lenses.push(at([face, CUR_Y, z]));
  box('curtain.column', plan(x, CUR_Y, 4, 4, 0.5), 2, 100, { tone: 'hi', crease: 'lo' }, { steps: 1, extra: Dt(lenses, { size: 0.28, tone: 'lo' }) + Dt([at([x, CUR_Y, 100])], { size: 0.4 }), layer: 'front', attrs: cue('curtain') });
  post('curtain.cap', x, CUR_Y, 1.6, 100, 102, { tone: 'mid' }, { steps: 14, layer: 'front', extra: Dt([at([x, CUR_Y, 102])], { size: 0.35, tone: 'hi' }) });
}
const beams = [];
for (let z = 12; z <= 92; z += 8) beams.push(k.segment([LC[0] + 2, CUR_Y, z], [LC[1] - 2, CUR_Y, z], P));
const beamSvg = `<g data-cue="curtain"><path class="wf-beam" data-k="beams" d="${beams.join('')}"/></g>`;

// ---------------------------------------------------------------- robot pedestal and base
{
  const [px, py] = PED;
  const rb = cue('robot');
  const bolts = Array.from({ length: 8 }, (_, q) => [px + 13.4 * Math.cos((q / 8) * Math.PI * 2 + 0.2), py + 13.4 * Math.sin((q / 8) * Math.PI * 2 + 0.2)]);
  post('robot.anchor-plate', px, py, 16, 0, 2, { tone: 'lo' }, { steps: 48, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, 2])), { size: 0.45 }) });
  post('robot.pedestal', px, py, 10, 2, 26, { tone: 'mid', crease: 'none' }, { steps: 40, inner: L(k.sideArc(px, py, 10, 14, P, 28), { tone: 'faint' }) });
  const top = Array.from({ length: 6 }, (_, q) => [px + 12 * Math.cos((q / 6) * Math.PI * 2), py + 12 * Math.sin((q / 6) * Math.PI * 2)]);
  post('robot.top-plate', px, py, 14, 26, 29, { tone: 'mid' }, { steps: 48, bevel: 0.4, extra: Dt(top.map(([x, y]) => at([x, y, 29])), { size: 0.4 }) });
  post('robot.base', px, py, 12, 29, 38, { tone: 'hi', crease: 'lo' }, { steps: 44, inner: L(k.sideArc(px, py, 12, 33.5, P, 32), { tone: 'faint' }), attrs: rb });
  post('robot.turret', px, py, 10, 38, 46, { tone: 'hi', crease: 'lo' }, { steps: 40, attrs: rb });
  box('robot.connector', { x: px - 15.5, y: py - 4, w: 4, d: 8, r: 0.6 }, 30, 36, { tone: 'mid' }, { steps: 2, extra: Dt([at([px - 15.5, py, 33])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- the turntable positioner (static part)
{
  const [cx, cy] = TC;
  const pc = cue('positioner');
  const base = plan(cx, cy, 40, 40, 1.2);
  box('pos.base', base, 0, 2.4, { tone: 'lo' }, { steps: 2, bevel: 0.4, extra: Dt(k.corners(base, 3).map(([x, y]) => at([x, y, 2.4])), { size: 0.45 }) + L(k.corners(base, 3).map(([x, y]) => k.ring(x, y, 1.3, 2.4, P, 12)).join(''), { tone: 'lo' }) });
  post('pos.column', cx, cy, 15, 2.4, 50, { tone: 'mid', crease: 'none' }, { steps: 48, inner: L(k.sideArc(cx, cy, 15, 10, P, 36) + k.sideArc(cx, cy, 15, 44, P, 36), { tone: 'faint' }), attrs: pc });
  const mx = cx + 14; const my = cy + 14;
  post('pos.motor', mx, my, 4.2, 2.4, 18, { tone: 'mid', crease: 'none' }, { steps: 28, inner: L(k.sideArc(mx, my, 4.2, 6, P, 20) + k.sideArc(mx, my, 4.2, 9, P, 20) + k.sideArc(mx, my, 4.2, 12, P, 20), { tone: 'faint' }), attrs: pc });
  post('pos.motor-cap', mx, my, 3.4, 18, 19.4, { tone: 'lo' }, { steps: 24 });
  box('pos.terminal', plan(mx, my, 4, 4, 0.4), 19.4, 22.4, { tone: 'lo' }, { steps: 1, extra: Dt([at([mx, my, 22.4])], { size: 0.35 }) });
  const bolts = Array.from({ length: 16 }, (_, q) => [cx + 19 * Math.cos((q / 16) * Math.PI * 2), cy + 19 * Math.sin((q / 16) * Math.PI * 2)]);
  post('pos.bearing', cx, cy, 21, 50, 55, { tone: 'lo' }, { steps: 56, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, 55])), { size: 0.35 }) });
  post('pos.table', cx, cy, TR, 55, TZ, { tone: 'mid' }, {
    steps: 96, bevel: 0.5, attrs: pc,
    inner: L(k.sideArc(cx, cy, TR, 58, P, 80), { tone: 'faint' }),
    extra: L(k.ring(cx, cy, TR - 3.5, TZ, P, 90), { tone: 'faint' }) + L(k.ring(cx, cy, 6, TZ, P, 30), { tone: 'lo' }) + Dt([at([cx, cy, TZ])], { size: 0.5 }),
  });
}

// ---------------------------------------------------------------- power source and wire drum (back left, inside)
{
  const fc = cue('feed');
  const fy = PS.y + PS.d;
  const fx = PS.x + PS.w;
  box('ps.trolley', k.insetPlan(PS, -1.5), 3, 6, { tone: 'lo' }, { steps: 2 });
  for (const [x, y] of k.corners(k.insetPlan(PS, 1), 0)) post('ps.wheel', x, y, 1.6, 0, 3, { tone: 'lo' }, { steps: 14 });
  const grille = [];
  for (let z = 14; z <= 30; z += 3) grille.push([[PS.x + 4, fy, z], [PS.x + 18, fy, z], [PS.x + 18, fy, z + 1.2], [PS.x + 4, fy, z + 1.2]]);
  const display = [[PS.x + 4, fy, 52], [PS.x + 14, fy, 52], [PS.x + 14, fy, 58], [PS.x + 4, fy, 58]];
  box('ps.body', PS, 6, PS_H, { tone: 'mid' }, {
    steps: 2, bevel: 0.6, attrs: fc,
    inner: L(k.sideSeam(PS, PS_H - 6, P, 2), { tone: 'faint' }),
    extra: slots(grille) + card(display) + Dt([[PS.x + 17, fy, 55], [PS.x + 17, fy, 46], [PS.x + 12, fy, 46], [PS.x + 7, fy, 46]].map(at), { size: 0.5 }) + Dt([[fx, PS.y + 8, 40], [fx, PS.y + 14, 40]].map(at), { size: 0.55 }),
  });
  box('ps.handle', { x: PS.x + 3, y: PS.y + 3, w: 2, d: PS.d - 6, r: 0.4 }, PS_H, PS_H + 4, { tone: 'hi', crease: 'lo' }, { steps: 1 });
  box('ps.handle-far', { x: PS.x + PS.w - 5, y: PS.y + 3, w: 2, d: PS.d - 6, r: 0.4 }, PS_H, PS_H + 4, { tone: 'hi', crease: 'lo' }, { steps: 1 });
  const [dx, dy] = DRUM;
  post('drum.pallet', dx, dy, 11.5, 0, 3, { tone: 'lo' }, { steps: 40 });
  post('drum.body', dx, dy, 10, 3, 62, { tone: 'mid', crease: 'none' }, { steps: 48, inner: L(k.sideArc(dx, dy, 10, 20, P, 36) + k.sideArc(dx, dy, 10, 46, P, 36), { tone: 'faint' }), attrs: fc });
  post('drum.lid', dx, dy, 10.6, 62, 64, { tone: 'lo' }, { steps: 48, bevel: 0.3 });
  post('drum.cone', dx, dy, 3.6, 64, 71, { tone: 'hi', crease: 'lo' }, { steps: 24, extra: Dt([at([dx, dy, 71])], { size: 0.5 }), attrs: fc });
}

// ---------------------------------------------------------------- torch cleaning station (right of the robot)
{
  const [cx, cy] = CLEAN;
  const cc = cue('clean');
  const base = plan(cx, cy, 14, 14, 0.8);
  box('clean.base', base, 0, 1.6, { tone: 'lo' }, { steps: 1, extra: Dt(k.corners(base, 2).map(([x, y]) => at([x, y, 1.6])), { size: 0.4 }) });
  post('clean.column', cx, cy, 3.4, 1.6, 58, { tone: 'mid', crease: 'none' }, { steps: 24, attrs: cc });
  const head = plan(cx, cy, 16, 11, 0.8);
  const fy = head.y + head.d;
  box('clean.head', head, 58, 72, { tone: 'mid' }, {
    steps: 2, bevel: 0.4, attrs: cc,
    inner: L(k.sideSeam(head, 64, P, 2), { tone: 'faint' }),
    extra: card([[head.x + 2, fy, 66], [head.x + 8, fy, 66], [head.x + 8, fy, 70], [head.x + 2, fy, 70]]) + Dt([[head.x + 12, fy, 68], [head.x + 14, fy, 68]].map(at), { size: 0.45 }),
  });
  post('clean.reamer', cx - 3, cy, 2.6, 72, 75, { tone: 'hi', crease: 'lo' }, { steps: 24, extra: L(k.ring(cx - 3, cy, 1.2, 75, P, 16), { tone: 'lo' }), attrs: cc });
  post('clean.spray', cx + 4, cy - 2, 1.2, 72, 74, { tone: 'lo' }, { steps: 14, extra: Dt([at([cx + 4, cy - 2, 74])], { size: 0.4 }) });
  box('clean.cutter', { x: cx + 2.5, y: cy + 1.4, w: 4, d: 2.6, r: 0.3 }, 72, 74.4, { tone: 'lo' }, { steps: 1 });
}

// ---------------------------------------------------------------- fume extraction (back right)
{
  const [dx, dy] = FUME;
  const fc = cue('fume');
  post('fume.duct', dx, dy, 5, 0, 108, { tone: 'mid', crease: 'none' }, { steps: 32, inner: L(k.sideArc(dx, dy, 5, 40, P, 24) + k.sideArc(dx, dy, 5, 90, P, 24), { tone: 'faint' }), attrs: fc });
  const hood = { x: dx - 16, y: dy - 4, w: 32, d: 26, r: 1.4 };
  const vanes = [];
  for (let x = hood.x + 5; x < hood.x + hood.w - 4; x += 4) vanes.push(k.lineOnTop([x, hood.y + 2.5], [x, hood.y + hood.d - 2.5], 118, P));
  vanes.push(k.planOutline({ x: hood.x + 2.5, y: hood.y + 2.5, w: hood.w - 5, d: hood.d - 5, r: 0 }, 118, P, 1));
  box('fume.hood', hood, 108, 118, { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(vanes.join(''), { tone: 'faint' }) + L(k.sideSeam(hood, 112, P, 2), { tone: 'faint' }), attrs: fc });
}

// ---------------------------------------------------------------- the controller outside the fence (left), with the teach pendant
{
  const pc = cue('pendant');
  const fy = CAB.y + CAB.d;
  const vents = [];
  for (const z of [8, 11, 14]) vents.push([[CAB.x + 6, fy, z], [CAB.x + 18, fy, z], [CAB.x + 18, fy, z + 1.2], [CAB.x + 6, fy, z + 1.2]]);
  const door = k.pathOf([[CAB.x + 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, 3], [CAB.x + CAB.w - 1.6, fy, CAB_H - 2], [CAB.x + 1.6, fy, CAB_H - 2]].map(at), true);
  const label = [[CAB.x + 4, fy, 72], [CAB.x + 14, fy, 72], [CAB.x + 14, fy, 78], [CAB.x + 4, fy, 78]];
  box('ctrl.body', CAB, 0, CAB_H, { tone: 'mid' }, {
    steps: 2, bevel: 0.5, attrs: pc,
    inner: L(door, { tone: 'lo' }) + L(k.sideSeam(CAB, CAB_H - 8, P, 2), { tone: 'faint' }),
    extra: slots(vents) + card(label) + L([76, 74].map((z, i) => k.segment([CAB.x + 5, fy, z], [CAB.x + [12, 10][i], fy, z], P)).join(''), { tone: 'lo', free: true }) + Dt([[CAB.x + 3, fy, 5], [CAB.x + 3, fy, CAB_H - 4]].map(at), { size: 0.4 }),
  });
  discAt('ctrl.switch', frameY([CAB.x + CAB.w - 5, fy, 56]), 0, 1.2, 3, { tone: 'lo' }, { steps: 24 });
  discAt('ctrl.knob', frameY([CAB.x + CAB.w - 5, fy, 56]), 1.2, 3, 1.6, { tone: 'hi', crease: 'none' }, { steps: 20 });
  const sx = CAB.x + CAB.w;
  box('ctrl.hook', { x: sx, y: CAB.y + 12, w: 1.6, d: 6, r: 0.3 }, 62, 64, { tone: 'lo' }, { steps: 1 });
  box('pendant.body', { x: sx + 1.6, y: CAB.y + 9, w: 2.4, d: 12, r: 0.8 }, 44, 62, { tone: 'hi', crease: 'lo' }, {
    steps: 2, attrs: pc,
    extra: card([[sx + 4, CAB.y + 11, 59], [sx + 4, CAB.y + 19, 59], [sx + 4, CAB.y + 19, 52], [sx + 4, CAB.y + 11, 52]]) + Dt([[sx + 4, CAB.y + 12, 48], [sx + 4, CAB.y + 15, 48], [sx + 4, CAB.y + 18, 48]].map(at), { size: 0.45 }),
  });
  post('pendant.estop', sx + 2.8, CAB.y + 18, 1.1, 62, 63.6, { tone: 'lo' }, { steps: 16, extra: Dt([at([sx + 2.8, CAB.y + 18, 63.6])], { size: 0.45, tone: 'hi' }) });
  const tx = CAB.x + 6; const ty = CAB.y + 6;
  post('ctrl.stack-base', tx, ty, 2.6, CAB_H, CAB_H + 2, { tone: 'mid' }, { steps: 18 });
  post('ctrl.stack-ready', tx, ty, 2.1, CAB_H + 2, CAB_H + 6, { tone: 'mid', crease: 'lo' }, { steps: 18 });
  post('ctrl.stack-ring', tx, ty, 2.3, CAB_H + 6, CAB_H + 6.4, { tone: 'lo', crease: 'none' }, { steps: 18 });
  post('ctrl.stack-arc', tx, ty, 2.1, CAB_H + 6.4, CAB_H + 10.4, { tone: 'mid', crease: 'lo' }, { steps: 18, attrs: ' data-k="stackArc"' });
  post('ctrl.stack-cap', tx, ty, 2.3, CAB_H + 10.4, CAB_H + 11.6, { tone: 'mid' }, { steps: 18, extra: Dt([at([tx, ty, CAB_H + 11.6])], { size: 0.4, tone: 'hi' }) });
}

// ---------------------------------------------------------------- the parts cart at the loading side (front left)
{
  for (const [x, y] of k.corners(k.insetPlan(CART, 2.5), 0)) post('cart.wheel', x, y, 1.8, 0, 3.6, { tone: 'lo' }, { steps: 14 });
  box('cart.deck', CART, 3.6, 6, { tone: 'mid' }, { steps: 2, bevel: 0.3 });
  for (const x of [CART.x + 1, CART.x + CART.w - 3]) box('cart.upright', { x, y: CART.y + 1, w: 2, d: CART.d - 2, r: 0.3 }, 6, 22, { tone: 'mid' }, { steps: 1 });
  box('cart.handle', { x: CART.x - 4, y: CART.y + 4, w: 4, d: 2, r: 0.3 }, 6, 30, { tone: 'hi', crease: 'lo' }, { steps: 1 });
  for (let row = 0; row < 3; row++) {
    for (let q = 0; q < 4 - row; q++) {
      const y0 = CART.y + 3 + q * 4.2 + row * 2.1;
      const z0 = 6 + row * 4;
      const ex = CART.x + CART.w - 3.5;
      const sq = [[ex, y0 + 1, z0 + 1], [ex, y0 + 3, z0 + 1], [ex, y0 + 3, z0 + 3], [ex, y0 + 1, z0 + 3]];
      box('cart.tube', { x: CART.x + 3.5, y: y0, w: CART.w - 7, d: 4, r: 0.3 }, z0, z0 + 4, { tone: 'mid', crease: 'lo' }, { steps: 1, extra: L(k.pathOf(sq.map(at), true), { tone: 'lo' }), layer: 'front' });
    }
  }
}

// ---------------------------------------------------------------- the operator at the loading side (simple solids: shoes, legs, coat, arms, head, cap)
{
  const [ox, oy] = OP;
  const oc = cue('operator');
  for (const dx of [-2.6, 2.6]) {
    box('op.shoe', { x: ox + dx - 1.8, y: oy - 3.4, w: 3.6, d: 6, r: 1.2 }, 0, 1.6, { tone: 'lo' }, { steps: 2, layer: 'front' });
    post('op.leg', ox + dx, oy, 1.9, 1.6, 40, { tone: 'mid', crease: 'none' }, { steps: 20, layer: 'front', attrs: oc });
  }
  box('op.coat', plan(ox, oy, 12, 7, 2.6), 38, 66, { tone: 'hi', crease: 'lo' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(plan(ox, oy, 12, 7, 2.6), 52, P, 3), { tone: 'faint' }), layer: 'front', attrs: oc });
  for (const dx of [-7.4, 7.4]) post('op.arm', ox + dx, oy, 1.7, 42, 64, { tone: 'hi', crease: 'lo' }, { steps: 18, layer: 'front', attrs: oc });
  post('op.neck', ox, oy, 1.8, 66, 69, { tone: 'mid' }, { steps: 16, layer: 'front' });
  post('op.head', ox, oy, 3.6, 69, 77, { tone: 'mid', crease: 'none' }, { steps: 28, bevel: 1.2, layer: 'front', attrs: oc });
  post('op.cap', ox, oy, 3.9, 76, 79, { tone: 'lo' }, { steps: 28, bevel: 1, layer: 'front' });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((it) => it.layer === name).sort((a, b) => a.key - b.key).map((it) => `<g data-name="${it.name}"${it.attrs ?? ''}>${it.svg}</g>`).join('');
const g = (key, body = '', extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const world = [
  halo,
  layerOf('floor'),
  `<g data-cue="fence">${meshFar}</g>`,
  curtainPanel(-FX + 2, -TR - 2),
  layerOf('back'),
  `<g data-cue="fixture">${g('far')}</g>`,
  g('fumes'),
  `<g data-cue="robot">${g('arm')}</g>`,
  `<g data-cue="feed">${g('feeder')}</g>`,
  `<g data-cue="torch">${g('torch')}</g>`,
  `<g data-cue="positioner">${g('screen')}</g>`,
  `<g data-cue="fixture">${g('near')}</g>`,
  g('arc'),
  curtainPanel(TR + 2, FX - 2),
  `<g data-cue="fence">${meshNear}</g>`,
  layerOf('front'),
  beamSvg,
].join('');
const cueSlot = (c, key) => `<g data-cue="${c}">${g(key)}</g>`;
const hud = [
  g('scrim', `<rect class="wf-scrim" x="0" y="0" width="${W}" height="${H}"/>`),
  g('progC', cueSlot('prog', 'progBody')),
  g('cycleC', [g('cycleBase'), cueSlot('one', 'cycleOne'), cueSlot('two', 'cycleTwo'), g('cycleText')].join('')),
  g('seamC', [g('seamBase'), cueSlot('tol', 'seamTol'), cueSlot('touch', 'seamTouch'), cueSlot('track', 'seamTrack')].join('')),
  g('beamC', [g('beamBase'), cueSlot('tack', 'beamTack'), cueSlot('seq', 'beamSeq'), cueSlot('shrink', 'beamShrink'), cueSlot('preset', 'beamPreset')].join('')),
  g('dayC', [g('dayBase'), cueSlot('arcon', 'dayArc'), cueSlot('bf', 'dayBf')].join('')),
  g('dutyC', cueSlot('duty', 'dutyBody')),
  g('dataC', cueSlot('wdata', 'dataBody')),
  g('costC', [g('costBase'), cueSlot('cost', 'costBars'), cueSlot('eff', 'costWire'), cueSlot('even', 'costEven')].join('')),
  g('sysC', [g('sysBase'), cueSlot('iso', 'sysIso'), cueSlot('ce', 'sysCe'), cueSlot('nb', 'sysNb'), cueSlot('fpc', 'sysFpc'), cueSlot('iwe', 'sysIwe')].join('')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WIDE = cam([-14, -4, 50], 640);
const ROBOTV = cam([0, -30, 80], 420);
const FEEDV = cam([-50, -60, 50], 380);
const PENDV = cam([-92, -40, 56], 380);
const STATV = cam([0, 10, 66], 360);
const TABLEV = cam([0, 22, 50], 420);
const CLEANV = cam([30, -60, 80], 320);
const FUMEV = cam([40, -50, 90], 420);
const CURTV = cam([-10, 60, 50], 440);
const TORCHV = cam([0, 0, 70], 240);
const C = { W, H, KS, TC, TR, TZ, PED, SH_Z, LINK, TOOL, HOME, CLEAN, FUME, FIXT, BARS, BAR_H, JOINTS, CLAMPS, CELL, SEAM, BEAM, COST, DUTY, SYS, EXC };
C.KEYS = [
  [WIDE, ROBOTV, FEEDV, PENDV], // s1 what is in the cell
  [STATV, TABLEV, WIDE, WIDE, WIDE], // s2 two stations
  [CLEANV, FUMEV, CURTV], // s3 clean, extracted, safe
  [TORCHV, WIDE, WIDE], // s4 finding the seam
  [WIDE, WIDE, WIDE, WIDE], // s5 taming shrinkage
  [WIDE, WIDE, WIDE, WIDE], // s6 arc-on time
  [WIDE, WIDE, WIDE, WIDE], // s7 a metre of weld
  [WIDE, WIDE, WIDE, WIDE], // s8 the system
];

// ---------------------------------------------------------------- the film
const WC = 'eng.joining.weldcell';
const FI = 'eng.joining.fixturing';
const AO = 'eng.joining.arcon';
const WS = 'eng.joining.weldsystem';
const spec = {
  id: 'eng.joining.production',
  title: { nl: 'De lasrobotcel', en: 'The welding robot cell' },
  lessons: [WC, FI, AO, WS],
  scenes: [
    {
      // v14b: the Basis "how it works" opening, scenes 1–3
      id: 's1', lesson: WC, level: 1, still: 0.5, title: { nl: 'Wat er in de cel staat', en: 'What is in the cell' },
      beats: [
        { nl: 'Een lasrobotcel: een afgeschermde ruimte waarin een robot last.', en: 'A robot welding cell: a guarded space in which a robot welds.', cues: ['fence'] },
        { nl: 'Het hart: een robotarm met zes assen, met een MAG-toorts op de pols.', en: 'At its heart: a six-axis robot arm, with a MAG torch on its wrist.', cues: ['robot', 'torch'] },
        { nl: 'De stroombron levert de stroom; de draadaanvoer duwt draad van het vat naar de toorts.', en: 'The power source delivers the current; the wire feeder pushes wire from the drum to the torch.', cues: ['feed'] },
        { nl: 'De robot volgt een programma: punten, met per las de draadsnelheid en lassnelheid.', en: 'The robot follows a program: points, with the wire feed speed and travel speed per weld.', cues: ['pendant', 'prog'] },
      ],
    },
    {
      id: 's2', lesson: WC, level: 1, still: 0.5, title: { nl: 'Twee stations', en: 'Two stations' },
      beats: [
        { nl: 'Het werkstuk zit in een {t:Lasmal|lasmal}: aanslagen en klemmen houden elk deel op zijn plek.', en: 'The workpiece sits in a {t:Welding fixture|welding fixture}: stops and clamps hold every part in place.', cue: { Lasmal: 'fixture' } },
        { nl: 'De mal staat op een {t:Positioner|positioner}, een draaitafel met twee stations.', en: 'The fixture stands on a {t:Positioner|positioner}, a turntable with two stations.', cue: { Positioner: 'positioner' } },
        { nl: 'Eén station: de robot wacht tijdens het laden. {n:6} + {n:4} = {n:10} minuten, {n:6} frames per uur.', en: 'One station: the robot waits while loading. {n:6} + {n:4} = {n:10} minutes, {n:6} frames an hour.', cues: ['one'] },
        { nl: 'Twee stations: laden tijdens het lassen. {n:6} + {n:0.3} = {n:6.3} minuten, {n:9.5} per uur.', en: 'Two stations: loading while welding. {n:6} + {n:0.3} = {n:6.3} minutes, {n:9.5} an hour.', cues: ['two'] },
        { nl: 'Zo’n {n:59}% meer met dezelfde robot. Duurt laden langer dan lassen, dan helpt het niet.', en: 'About {n:59}% more from the same robot. If loading takes longer than welding, it no longer helps.', cues: ['two'] },
      ],
    },
    {
      id: 's3', lesson: WC, level: 1, still: 0.5, title: { nl: 'Schoon, afgezogen, veilig', en: 'Clean, extracted, safe' },
      beats: [
        { nl: 'De {t:Toortsreiniging|toortsreiniging} ruimt spatten uit het mondstuk, spuit anti-spat en knipt de draad.', en: 'The {t:Torch cleaning station|torch cleaning station} clears spatter, sprays anti-spatter and cuts the wire.', cue: { Toortsreiniging: 'clean' } },
        { nl: '{t:Afzuiging|Afzuiging} boven de cel haalt de lasrook weg; schermen houden het uv-licht binnen.', en: '{t:Fume extraction|Fume extraction} above the cell removes the fumes; screens keep the UV light in.', cue: { Afzuiging: 'fume' } },
        { nl: 'Een hek, en bij het laden een {t:Lichtscherm|lichtscherm}: straal onderbroken, dan stopt de beweging.', en: 'A fence, and at loading a {t:Light curtain|light curtain}: break a beam and motion stops.', cue: { Lichtscherm: 'curtain' }, cues: ['fence'] },
      ],
    },
    {
      id: 's4', lesson: FI, level: 2, still: 0.5, title: { nl: 'De naad vinden', en: 'Finding the seam' },
      beats: [
        { nl: 'Een robot last blind. Vuistregel: de naad binnen ±{n:0.6} mm bij draad van {n:1.2} mm.', en: 'A robot welds blind. Rule of thumb: the seam within ±{n:0.6} mm with {n:1.2} mm wire.', cues: ['torch', 'tol'] },
        { nl: '{t:Naadzoeken|Naadzoeken}: vóór het lassen tikt de draad het werkstuk aan, en het programma schuift mee.', en: '{t:Seam finding|Seam finding}: before welding the wire touches the part, and the program shifts.', cue: { Naadzoeken: 'touch' } },
        { nl: '{t:Naadvolgen|Naadvolgen}: de robot pendelt en leest aan de stroom waar de wanden zitten.', en: '{t:Seam tracking|Seam tracking}: the robot weaves and reads from the current where the walls are.', cue: { Naadvolgen: 'track' } },
      ],
    },
    {
      id: 's5', lesson: FI, level: 2, still: 0.5, title: { nl: 'Krimp temmen', en: 'Taming shrinkage' },
      beats: [
        { nl: '{t:Hechten|Hechten}: korte lasjes zetten de delen vast en houden de spleet gelijk.', en: '{t:Tack welding|Tack welding}: short welds fix the parts and keep the gap even.', cue: { Hechten: 'tack' } },
        { nl: 'De {t:Lasvolgorde|lasvolgorde}: symmetrisch, van het midden naar de uiteinden.', en: 'The {t:Welding sequence|welding sequence}: symmetrical, from the centre to the ends.', cue: { Lasvolgorde: 'seq' } },
        { nl: 'Een ligger van {n:2} meter, {n:6} lassen, {n:3} mm te kort: {n:0.5} mm krimp per las.', en: 'A {n:2}-metre beam, {n:6} welds, {n:3} mm short: {n:0.5} mm shrinkage per weld.', cues: ['shrink'] },
        { nl: '{t:Voorzetten|Voorzetten}: vooraf langer of scheef, zodat de krimp het recht trekt. Nu ±{n:1} mm.', en: '{t:Presetting|Presetting}: longer or angled beforehand, so shrinkage pulls it true. Now ±{n:1} mm.', cue: { Voorzetten: 'preset' } },
      ],
    },
    {
      id: 's6', lesson: AO, level: 3, still: 0.5, title: { nl: 'Boogbrandtijd', en: 'Arc-on time' },
      beats: [
        { nl: 'De {t:Boogbrandtijd|boogbrandtijd}: hoeveel van de dag de boog echt brandt.', en: 'The {t:Arc-on time|arc-on time}: how much of the day the arc really burns.', cue: { Boogbrandtijd: 'arcon' } },
        { nl: '{t:Bedrijfsfactor|Bedrijfsfactor}: met de hand {n:10} tot {n:30}%, een robotcel tot zo’n {n:90}%.', en: '{t:Operating factor|Operating factor}: by hand {n:10} to {n:30}%, a robot cell up to about {n:90}%.', cue: { Bedrijfsfactor: 'bf' } },
        { nl: 'Niet de {t:Inschakelduur|inschakelduur}: {n:60}% bij {n:300} A is {n:6} van elke {n:10} minuten lassen.', en: 'Not the {t:Duty cycle|duty cycle}: {n:60}% at {n:300} A is welding {n:6} of every {n:10} minutes.', cue: { Inschakelduur: 'duty' } },
        { nl: 'Een {t:Lasdatasysteem|lasdatasysteem} telt de boogtijd op per lasser, cel of ploeg.', en: '{t:Weld data monitoring|Weld data monitoring} adds up the arc time per welder, cell or shift.', cue: { Lasdatasysteem: 'wdata' } },
      ],
    },
    {
      id: 's7', lesson: AO, level: 3, still: 0.5, title: { nl: 'Wat een meter las kost', en: 'What a metre of weld costs' },
      beats: [
        { nl: 'Een a5-hoeklas: {n:196} gram per meter. Bij {n:5} kg per uur is dat {n:2.4} minuten boog.', en: 'An a5 fillet weld: {n:196} grams per metre. At {n:5} kg an hour that is {n:2.4} minutes of arc.', cues: ['cost'] },
        { nl: 'Hand: {n:30}% bij € {n:60} per uur = € {n:8.00}. Robot: {n:70}% bij € {n:90} = € {n:5.14} per meter.', en: 'Hand: {n:30}% at €{n:60} an hour = €{n:8.00}. Robot: {n:70}% at €{n:90} = €{n:5.14} per metre.', cues: ['cost'] },
        { nl: 'Draad: {n:196} gram, bij {n:95}% {t:Neersmeltrendement|neersmeltrendement}: € {n:0.52}, voor beide.', en: 'Wire: {n:196} grams, at {n:95}% {t:Deposition efficiency|deposition efficiency}: €{n:0.52}, for both.', cue: { Neersmeltrendement: 'eff' } },
        { nl: 'Onder {n:45}% is de robot duurder: bij {n:40}% kost hij € {n:9.00} per meter.', en: 'Below {n:45}% the robot costs more: at {n:40}% it is €{n:9.00} per metre.', cues: ['even'] },
      ],
    },
    {
      id: 's8', lesson: WS, level: 4, still: 0.5, title: { nl: 'Laskwaliteit als systeem', en: 'Weld quality as a system' },
      beats: [
        { nl: '{t:ISO 3834|ISO 3834} eist een beheerst lasproces, in drie niveaus: deel 2, 3 en 4.', en: '{t:ISO 3834|ISO 3834} demands a controlled welding process, in three levels: parts 2, 3 and 4.', cue: { 'ISO 3834': 'iso' } },
        { nl: 'EXC1 vraagt deel 4, EXC2 deel 3, EXC3 en EXC4 deel 2. Dan mag de {t:CE-markering|CE-markering} erop.', en: 'EXC1 asks for part 4, EXC2 part 3, EXC3 and EXC4 part 2. Then the {t:CE marking|CE marking} may go on.', cue: { 'CE-markering': 'ce' } },
        { nl: 'Een {t:Aangewezen instantie|aangewezen instantie} keurt de {t:Fabrieksproductiecontrole|fabrieksproductiecontrole}.', en: 'A {t:Notified body|notified body} certifies the {t:Factory production control|factory production control}.', cue: { 'Aangewezen instantie': 'nb', Fabrieksproductiecontrole: 'fpc' } },
        { nl: 'Een {t:IWE|IWE} coördineert. {n:14} lassers, elke {n:6} maanden bevestigd: {n:28} per jaar.', en: 'An {t:IWE|IWE} coordinates. {n:14} welders, confirmed every {n:6} months: {n:28} a year.', cue: { IWE: 'iwe' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said, money
// in words ("acht euro"); the captions assert those numbers.
const SAY = [
  [ // s1 what is in the cell
    { nl: 'Dit is een lasrobotcel: een afgeschermde ruimte waarin een robot last.',
      en: 'This is a robot welding cell: a guarded space in which a robot welds.' },
    { nl: 'Het hart is een robotarm met zes assen, met een MAG-toorts op de pols.',
      en: 'At its heart is a robot arm with six axes, with a MAG torch on its wrist.' },
    { nl: 'De stroombron levert de lasstroom. Het draadaanvoerapparaat trekt de draad uit een vat van honderden kilo’s en duwt hem naar de toorts.',
      en: 'The power source delivers the welding current. The wire feeder pulls wire from a drum of hundreds of kilos and pushes it to the torch.' },
    { nl: 'De robot volgt een programma: punten, met per las de draadsnelheid en lassnelheid. Je leert ze in met de handbediening, of je maakt het programma op de computer vanuit het 3D-model: offline programmeren, terwijl de robot doorlast.',
      en: 'The robot follows a program: points, with the wire feed speed and travel speed for each weld. You teach them with the pendant, or build the program on a computer from the 3D model: offline programming, while the robot keeps welding.' },
  ],
  [ // s2 two stations
    { nl: 'Het werkstuk zit in een {t:Lasmal|lasmal}: aanslagen en klemmen houden elk deel op de juiste plek.',
      en: 'The workpiece sits in a {t:Welding fixture|welding fixture}: stops and clamps hold every part in the right place.' },
    { nl: 'De mal staat op een {t:Positioner|positioner}: een tafel die het werkstuk draait, zodat de robot zoveel mogelijk vlak last. Hier een draaitafel met twee stations.',
      en: 'The fixture stands on a {t:Positioner|positioner}: a table that turns the work, so the robot welds flat where it can. Here, a turntable with two stations.' },
    { nl: 'Waarom twee? De robot last een frame in {n:6} minuten, en laden kost {n:4}. Met één station wacht de robot tijdens het laden: {n:10} minuten per frame, {n:6} per uur.',
      en: 'Why two? The robot welds a frame in {n:6} minutes, and loading takes {n:4}. With one station the robot waits during loading: {n:10} minutes per frame, {n:6} an hour.' },
    { nl: 'Met twee laadt de operator terwijl de robot last, en draait de tafel in {n:0.3} minuut een halve slag. Een frame duurt {n:6.3} minuten: {n:9.5} per uur.',
      en: 'With two, the operator loads while the robot welds, and the table turns half a turn in {n:0.3} minutes. A frame takes {n:6.3} minutes: {n:9.5} an hour.' },
    { nl: 'Zo’n {n:59} procent meer, met dezelfde robot. Maar duurt laden langer dan lassen, dan helpt een tweede station niet.',
      en: 'About {n:59} percent more, with the same robot. But if loading takes longer than welding, a second station does not help.' },
  ],
  [ // s3 clean, extracted, safe
    { nl: 'Om de paar stukken gaat de robot naar de {t:Toortsreiniging|toortsreiniging}: die ruimt spatten uit het gasmondstuk, spuit anti-spat en knipt de draad. Anders raakt de gasstroom verstoord, en krijg je gasbelletjes in de las.',
      en: 'Every few parts the robot visits the {t:Torch cleaning station|torch cleaning station}: it clears spatter from the nozzle, sprays anti-spatter and cuts the wire. Otherwise the gas flow suffers, and the weld gets gas bubbles.' },
    { nl: 'Lassen geeft rook en fel uv-licht. {t:Afzuiging|Afzuiging} haalt de rook weg; schermen houden het licht binnen.',
      en: 'Welding gives off fumes and bright UV light. {t:Fume extraction|Fume extraction} removes the fumes; screens keep the light in.' },
    { nl: 'Om de cel staat een hek, en bij het laadstation een {t:Lichtscherm|lichtscherm}: onzichtbare stralen. Breekt iemand een straal, dan stopt de beweging aan die kant. De veiligheidsregels staan in de modules Veilig werken en Lijnen.',
      en: 'A fence surrounds the cell, and at the loading station stands a {t:Light curtain|light curtain}: invisible beams. Break a beam, and motion on that side stops. For the safety rules, see the safety and lines modules.' },
  ],
  [ // s4 finding the seam
    { nl: 'Een robot last blind. Ligt de naad naast zijn punten, dan mist de boog. Vuistregel: binnen een halve draaddiameter, bij draad van {n:1.2} millimeter dus plus of min {n:0.6}.',
      en: 'A robot welds blind. If the seam is off its points, the arc misses. Rule of thumb: within half a wire diameter, so with {n:1.2} millimetre wire, plus or minus {n:0.6}.' },
    { nl: 'Bij {t:Naadzoeken|naadzoeken} tikt de draad, onder spanning, vóór het lassen het werkstuk aan. Zo meet de robot waar de wanden zitten, en schuift het programma mee.',
      en: 'In {t:Seam finding|seam finding} the live wire touches the workpiece before welding. So the robot measures where the walls are, and shifts the program to match.' },
    { nl: 'Bij {t:Naadvolgen|naadvolgen} pendelt de robot tijdens het lassen, en leest aan de stroom of hij te dicht bij een wand komt. Beide kosten tijd op elk stuk; een goede mal is bijna altijd goedkoper.',
      en: 'In {t:Seam tracking|seam tracking} the robot weaves while welding, and reads from the current when it nears a wall. Both cost time on every part; a good fixture is almost always cheaper.' },
  ],
  [ // s5 taming shrinkage
    { nl: 'Lasmetaal krimpt bij afkoelen en trekt de delen mee. {t:Hechten|Hechten} zet ze vooraf vast met korte lasjes, die de spleet gelijk houden.',
      en: 'Weld metal shrinks as it cools and pulls the parts with it. {t:Tack welding|Tack welding} fixes them beforehand with short welds, which keep the gap even.' },
    { nl: 'Dan de {t:Lasvolgorde|lasvolgorde}: symmetrisch, van het midden naar de uiteinden, zodat de krimpkrachten elkaar opheffen.',
      en: 'Then the {t:Welding sequence|welding sequence}: symmetrical, from the centre to the ends, so the shrinkage forces cancel out.' },
    { nl: 'Een ligger van {n:2} meter met {n:6} lassen komt {n:3} millimeter te kort uit de mal: een halve millimeter per las.',
      en: 'A {n:2} metre beam with {n:6} welds comes out of the fixture {n:3} millimetres short: half a millimetre per weld.' },
    { nl: 'Dus {t:Voorzetten|voorzetten}: de ligger vooraf {n:3} millimeter langer, of delen scheef, zodat de krimp ze goed trekt. Met een vaste volgorde zitten vijf liggers dan binnen plus of min {n:1} millimeter.',
      en: 'So {t:Presetting|presetting}: the beam {n:3} millimetres longer beforehand, or parts at an angle, so shrinkage pulls them right. With a fixed sequence, five beams then fall within plus or minus {n:1} millimetre.' },
  ],
  [ // s6 arc-on time
    { nl: 'De {t:Boogbrandtijd|boogbrandtijd} is de tijd dat de boog echt brandt. De rest gaat naar pakken, hechten, slijpen, wachten en lopen.',
      en: '{t:Arc-on time|Arc-on time} is the time the arc is really burning. The rest goes to fetching, tacking, grinding, waiting and walking.' },
    { nl: 'Gedeeld door de betaalde tijd is dat de {t:Bedrijfsfactor|bedrijfsfactor}. Met de hand vaak {n:10} tot {n:30} procent; voor een robotcel in serie noemen leveranciers tot zo’n {n:90}.',
      en: 'Divided by paid time, that is the {t:Operating factor|operating factor}. By hand often {n:10} to {n:30} percent; for a robot cell in series, suppliers quote up to about {n:90}.' },
    { nl: 'Verwar het niet met de {t:Inschakelduur|inschakelduur} van de stroombron: {n:60} procent bij {n:300} ampère is {n:6} van elke {n:10} minuten lassen, en dan afkoelen.',
      en: 'Do not confuse it with the {t:Duty cycle|duty cycle} of the power source: {n:60} percent at {n:300} amps is welding {n:6} of every {n:10} minutes, then cooling down.' },
    { nl: 'Een {t:Lasdatasysteem|lasdatasysteem} haalt de boogtijd uit de stroombronnen en telt die op per lasser, cel of ploeg: om te verbeteren, niet om af te rekenen.',
      en: '{t:Weld data monitoring|Weld data monitoring} collects the arc time from the power sources and adds it up per welder, cell or shift: to improve, not to judge.' },
  ],
  [ // s7 a metre of weld
    { nl: 'Een a5-hoeklas vraagt zo’n {n:196} gram lasmetaal per meter. Bij {n:5} kilo per uur is dat {n:2.4} minuten boog, met de hand en met de robot.',
      en: 'An a5 fillet weld needs about {n:196} grams of weld metal per metre. At {n:5} kilos an hour that is {n:2.4} minutes of arc, by hand and by robot.' },
    { nl: 'Met de hand, bij {n:30} procent en zestig euro per uur: acht euro per meter. De robotcel, bij {n:70} procent en negentig euro: vijf euro veertien. Hij wint door zijn bedrijfsfactor, niet door snelheid.',
      en: 'By hand, at {n:30} percent and sixty euros an hour: eight euros per metre. The robot cell, at {n:70} percent and ninety euros: five euros fourteen. It wins on operating factor, not speed.' },
    { nl: 'Bij een {t:Neersmeltrendement|neersmeltrendement} van {n:95} procent kost de draad tweeënvijftig cent per meter. Arbeid is de grote post.',
      en: 'At a {t:Deposition efficiency|deposition efficiency} of {n:95} percent the wire costs fifty-two cents per metre. Labour is the big item.' },
    { nl: 'Haalt de robot maar {n:40} procent, door kleine series en mallen wisselen, dan kost hij negen euro. Onder {n:45} procent is hij duurder dan de hand.',
      en: 'If the robot only reaches {n:40} percent, through small batches and fixture changes, it costs nine euros. Below {n:45} percent it costs more than by hand.' },
  ],
  [ // s8 the system
    { nl: 'Een las kun je achteraf maar deels controleren. Daarom eist {t:ISO 3834|ISO 3834} een beheerst lasproces, in drie niveaus: deel 2, 3 en 4.',
      en: 'A weld can only partly be checked afterwards. So {t:ISO 3834|ISO 3834} demands a controlled welding process, in three levels: parts 2, 3 and 4.' },
    { nl: 'In de staalbouw volgt het niveau de uitvoeringsklasse: EXC1 vraagt deel 4, EXC2 deel 3, EXC3 en EXC4 deel 2. EN 1090-1 regelt de {t:CE-markering|CE-markering}.',
      en: 'In steel construction the level follows the execution class: EXC1 asks for part 4, EXC2 part 3, EXC3 and EXC4 part 2. EN 1090-1 governs the {t:CE marking|CE marking}.' },
    { nl: 'Een {t:Aangewezen instantie|aangewezen instantie} certificeert de {t:Fabrieksproductiecontrole|fabrieksproductiecontrole} van de staalbouwer. Zonder certificaat geen CE-markering.',
      en: 'A {t:Notified body|notified body} certifies the fabricator’s {t:Factory production control|factory production control}. No certificate, no CE marking.' },
    { nl: 'De spil is de lascoördinator, op het hoogste niveau een {t:IWE|IWE}. {n:14} lassers, elk certificaat elke {n:6} maanden bevestigd: {n:28} handtekeningen per jaar.',
      en: 'The key person is the welding coordinator, at the top level an {t:IWE|IWE}. {n:14} welders, each certificate confirmed every {n:6} months: {n:28} signatures a year.' },
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
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2 * s.beats.length);
  });
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
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
:root{--wf-arm:#173339;--wf-arm-top:#1F4048;--wf-arm-dark:#0F262B;--wf-bead:#9FB3A6;--wf-hot:#BFE3EA;--wf-core:#F4FBFC;--wf-mesh:rgba(92,159,174,.05);--wf-curtain:rgba(92,159,174,.10);--wf-hole:#071A1E}
.iso[data-theme="light"]{--wf-arm:#FDFBF6;--wf-arm-top:#FFFFFF;--wf-arm-dark:#E6DFCD;--wf-bead:#5A6B60;--wf-hot:#276F81;--wf-core:#FFFFFF;--wf-mesh:rgba(39,111,129,.04);--wf-curtain:rgba(39,111,129,.08);--wf-hole:#D5CCB6}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.wf-scrim{fill:var(--anatomy-card);opacity:.9}
.wf-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wf-slot{fill:var(--wf-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wf-mesh{fill:var(--wf-mesh);stroke:none}
.wf-curtain{fill:var(--wf-curtain);stroke:none}
.wf-beam{fill:none;stroke:var(--anatomy-faint);stroke-width:1;vector-effect:non-scaling-stroke}
[data-cue][data-on] .wf-beam{stroke:var(--fp-accent);stroke-width:1.4}
.wf-cap{fill:none;stroke-linecap:round;stroke-linejoin:round}
.wf-cyl{fill:none;stroke-linecap:butt}
.wf-o{stroke:var(--anatomy-hi)}
.wf-f{stroke:var(--wf-arm)}
.wf-t{stroke:var(--wf-arm-top)}
.wf-m{stroke:var(--anatomy-face)}
.wf-hose{stroke:var(--wf-arm-dark)}
.wf-endc{fill:var(--wf-arm-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wf-hub{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
[data-cue][data-on] .wf-o{stroke:var(--fp-accent)}
[data-cue][data-on] .wf-f,[data-cue][data-on] .wf-m{stroke:var(--anatomy-lit-top)}
[data-cue][data-on] .wf-endc{stroke:var(--fp-accent);fill:var(--anatomy-lit-top)}
.wf-wire{fill:none;stroke:var(--anatomy-hi);stroke-width:.8px;stroke-linecap:round}
.wf-bead{fill:none;stroke-linecap:round}
.wf-cold{stroke:var(--wf-bead)}
.wf-hotb{stroke:var(--wf-hot)}
.wf-glow0{stop-color:var(--fp-glow);stop-opacity:.6}
.wf-glow1{stop-color:var(--fp-glow);stop-opacity:0}
.wf-core{fill:var(--wf-core);stroke:var(--fp-glow);stroke-width:.6px}
.wf-spark{fill:var(--wf-hot);stroke:none}
.wf-smoke{fill:var(--anatomy-mid);stroke:none}
.wf-lamp .iso-top,.wf-lamp .iso-shade,.wf-lamp .iso-fill{fill:var(--fp-accent)}
.wf-bx{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.wf-fill{fill:var(--anatomy-mid);opacity:.55}
.wf-on{fill:var(--anatomy-mid);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
.wf-idle{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.wf-st{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1.1;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.wf-weld{fill:var(--wf-bead);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
.wf-sig{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.wf-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:6 5;vector-effect:non-scaling-stroke}
.wf-band{fill:var(--anatomy-mid);opacity:.2}
[data-cue][data-on] .wf-bx,[data-cue][data-on] .wf-on,[data-cue][data-on] .wf-st{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .wf-fill,[data-cue][data-on] .wf-on,[data-cue][data-on] .wf-band{fill:var(--fp-accent);opacity:.6}
[data-cue][data-on] .wf-weld{fill:var(--fp-accent)}
[data-cue][data-on] .wf-sig,[data-cue][data-on] .wf-dash{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een lasrobotcel schuin van boven: een zesassige lasrobot op een sokkel met een MAG-toorts, een draaitafel met twee stations en een lasmal op elke helft, de stroombron en het draadvat, een toortsreiniging, een afzuigkap, het hek met een lichtscherm bij het laadstation, de besturing met handbediening en een operator; daarover kaarten met de cyclus met één en twee stations, naadzoeken en naadvolgen, een ligger met hechtlassen en lasvolgorde, een dag boogbrandtijd, de kosten van een meter las en de keten van ISO 3834 en EN 1090.',
  en: 'A robot welding cell seen from above at an angle: a six-axis welding robot on a pedestal with a MAG torch, a two-station turntable with a welding fixture on each half, the power source and wire drum, a torch cleaning station, a fume hood, the fence with a light curtain at the loading station, the controller with its teach pendant and an operator; over it cards with the cycle for one and two stations, seam finding and seam tracking, a beam with tack welds and a welding sequence, a day of arc-on time, the cost of a metre of weld and the chain of ISO 3834 and EN 1090.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

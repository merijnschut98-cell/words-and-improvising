// Dev tool, not shipped. Builds the explainer film "Een avondpiek in de straat /
// An evening peak in the street" for the topic Vermogen, belasting en spanning
// of Het elektriciteitsnet: its level 1 lesson eng.gridbasics.basics and its
// level 2 lesson eng.gridbasics.load.
//
//   node films/eng.gridbasics.load/build.mjs            build the page
//   node films/eng.gridbasics.load/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.gridbasics.load.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (grid track). The plan row lists the lessons "basics" and "load"; both ids
// still exist after the topics x levels rebuild (eng.gridbasics.basics, level 1,
// and eng.gridbasics.load, level 2, of the topic power), so no mapping was
// needed. Neither lesson had a film before.
//
// The drawing is a street on a diorama board: a row of three terraced houses
// with solar panels on the front roof, a meter box beside each front door, a
// heat pump in a front garden, an inverter on the end gable, a car on the
// driveway with its charge point, a street lamp, and at the end of the street
// a compact netstation with its doors open: the 400 kVA transformer (its tank,
// fins and bushings after the figure eng.transformers.load) and the LV rack
// with its fuse ways. The street cable leaves the rack and runs along the
// pavement, with a joint and a branch into every meter box (the netstation,
// houses and LV cable of the figure eng.gridbasics.levels, at street scale).
// Cards in stage space carry the water analogy, the kettle's power and energy,
// the three phases with a section of the four-core cable, one home's day, the
// 150 homes of the netstation, the power-factor triangle, the winter-evening
// stack, the voltage along the cable at noon, and the charging of the cars;
// example cards are labelled "voorbeeld" (or "schema").
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const A = await import(pathToFileURL(join(SKILL, 'kit/audit.mjs')).href);
const T = await import(pathToFileURL(join(SKILL, 'kit/tube.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the lessons' text and worked examples (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Facts checked against:
// - Dutch low voltage 230 V phase to neutral, 400 V phase to phase (NEN-EN
//   50160 and the Netcode elektriciteit); 50 Hz.
// - A common house connection of 3 × 25 A (Netbeheer Nederland connection
//   sizes; older homes 1 × 35 A), at most 3 × 230 × 25 = 17,25 kVA.
// - Average household use "zo'n 2.700 kWh" (CBS and Milieu Centraal give
//   roughly 2.500 to 2.900 kWh for recent years, so hedged as in the lesson).
// - EV home charging at up to 11 kW three-phase (3 × 16 A).
// - Traditional LV planning with about 1 to 1,5 kVA per home at the winter
//   evening peak (after-diversity demand; Netbeheer Nederland and grid
//   operators' planning notes), and heat pumps with a simultaneity close to 1 on
//   a cold evening: the lesson's own hedged figures.
// - Inverters disconnect on overvoltage around 253 V, 230 V + 10 % (the
//   EN 50160 band; the 10-minute setting of NEN-EN 50549-1): "zo'n 253 V".
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// basics: a 2.000 W kettle on 230 V draws about 8,7 A; 3 minutes = 0,1 kWh
const KETTLE = 2000;
const U = 230;
const ULL = 400;
assert(near(KETTLE / U, 8.7, 0.05), '2.000 / 230 ≈ 8,7 A');
assert(near(2 * 0.05, 0.1, 1e-9) && near(3 / 60, 0.05, 1e-9), '2 kW × 0,05 h = 0,1 kWh');
assert(near(U * Math.sqrt(3), ULL, 2), '230 × √3 ≈ 400 V');
// basics: 2.700 kWh a year / 8.760 h ≈ 0,31 kW; 3 + 2 + 2 = 7 kW at 18:00; + 11 kW = 18 kW > 17 kVA
const YEAR_KWH = 2700;
const YEAR_H = 8760;
const AVG = YEAR_KWH / YEAR_H;
assert(near(AVG, 0.31, 0.005), '2.700 / 8.760 ≈ 0,31 kW');
const PEAK_HOME = 3 + 2 + 2;
assert(PEAK_HOME === 7, 'oven 3 + kettle 2 + dishwasher 2 = 7 kW');
const EV = 11;
assert(PEAK_HOME + EV === 18, '7 + 11 = 18 kW');
const CONN = (3 * U * 25) / 1000;
assert(near(CONN, 17.25, 1e-9) && Math.round(CONN) === 17, '3 × 230 × 25 ≈ 17 kVA');
// load: 400 kVA, 150 homes × 1,5 kVA = 225 kVA (56 %); + 50 × 3 × 0,8 = 120; + 40 × 11 × 0,3 = 132; 477 kVA, 119 %
const S_TR = 400;
const HOMES = 150;
const PER_HOME = 1.5;
const OLD = HOMES * PER_HOME;
assert(OLD === 225 && Math.round((OLD / S_TR) * 100) === 56, '150 × 1,5 = 225 kVA, 56 %');
const HP = 50 * 3 * 0.8;
const CARS = 40 * 11 * 0.3;
assert(near(HP, 120, 1e-9) && near(CARS, 132, 1e-9), '120 and 132 kVA');
const NEW = OLD + HP + CARS;
assert(near(NEW, 477, 1e-9) && Math.round((NEW / S_TR) * 100) === 119, '477 kVA, 119 %');
// load: cos φ 0,9 to 1, so 400 kVA delivers about 360 to 400 kW
assert(S_TR * 0.9 === 360, '400 × 0,9 = 360 kW');
// load: the inverter's limit, 230 V + 10 % = 253 V
const UMAX = U * 1.1;
assert(near(UMAX, 253, 1e-9), '230 + 10 % = 253 V');

// ---------------------------------------------------------------- the world
// World units are decimetres, z up, x along the street, +y toward the viewer.
// The top of the board (the pavement) is z = 0.
const W = 640;
const H = 400;
const BOARD = { x: -112, y: -106, w: 352, d: 182, r: 3 };
const BOARD_Z = -5;
const HOUSE = { x: 0, y: -90, w: 165, d: 90, r: 0.6 };
const HW = 55; // one house
const WALL = 56; // eaves height
const RIDGE = 84;
const EAVE = 3; // overhang
const KIOSK = { x: -84, y: -34, w: 38, d: 24, r: 0.8 };
const KIOSK_Z = 26;
const TANK = { x: -79, y: -27, w: 15, d: 11, r: 0.8 };
const TANK_Z = [3.4, 16];
const RACK = { x: -61, y: -26, w: 11, d: 5, r: 0.4 };
const RACK_Z = [3.4, 21];
const CABLE_R = 1.1;
const CABLE_Y = 25;
const CABLE_Z = 1.9;
const CAR = { x: 176, y: -26, w: 18, d: 44, r: 3.2 };
const POLE = [203, 6];
const LAMP = [118, 34];
const HP_PLAN = { x: 84, y: 2, w: 12, d: 5, r: 0.5 };
const METER_X = (i) => HOUSE.x + HW * i + 15;
const BRANCH_X = (i) => METER_X(i) + 2.4;
const INV = { y0: -40, y1: -32, z0: 22, z1: 32 };

const FIT = [
  ...k.boxCorners(BOARD, BOARD_Z, 0),
  [HOUSE.x, HOUSE.y + HOUSE.d / 2, RIDGE], [HOUSE.x + HOUSE.w, HOUSE.y + HOUSE.d / 2, RIDGE],
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 66, elevation: 27 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const poly = (pts) => k.pathOf(pts.map(at), true);

// ---------------------------------------------------------------- recorder
// Each part carries the cue of its assembly, so a term can light the houses, a
// meter box, the netstation, its transformer, the street cable, the heat pump,
// the car, the solar panels or the inverter.
const cueOf = (name) => (/^house\.meter/.test(name) ? 'meter'
  : /^(house|roof)\./.test(name) ? 'houses'
    : /^tr\./.test(name) ? 'trafo'
      : /^kiosk\./.test(name) ? 'station'
        : /^(cable|joint|branch)/.test(name) ? 'cable'
          : /^hp\./.test(name) ? 'hp'
            : /^(car|pole|lead)/.test(name) ? 'ev'
              : /^inv\./.test(name) ? 'inv' : '');
const R = A.recorder(P, {});
function put(name, ref, svg, shapes, { bias = 0, attrs = '' } = {}) {
  const c = cueOf(name);
  return R.put({ name, at: ref, bias, svg, shapes, attrs: (c ? ` data-cue="${c}"` : '') + attrs });
}
const S = (paths, style) => k.solidSvg(paths, style);
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 20, bevel = 0, extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
function prism(name, F, polygon, s0, s1, style = {}, { extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.prism(F, polygon, s0, s1, { name, owner }));
  const svg = S(G.prismOf(F, polygon, s0, s1, P), { tone: 'mid', ...style, inner }) + extra;
  const c = polygon.reduce((a, [u, v]) => [a[0] + u / polygon.length, a[1] + v / polygon.length], [0, 0]);
  const ref = G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.add3(G.mul3(F.u, c[0]), G.mul3(F.v, c[1])));
  return put(name, ref, svg, [shape], opts);
}

// ---------------------------------------------------------------- the board: pavement, kerb, road, gardens
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BOARD, -2.5), BOARD_Z, 2, P)}"/>`];
{
  const top = 0;
  const road0 = 40;
  // the road: darker inlay with a dashed centre line; the pavement: tile joints; the gardens: path tiles
  const road = `<path class="ws-road" d="${poly([[BOARD.x + 1.2, road0 + 2, top], [BOARD.x + BOARD.w - 1.2, road0 + 2, top], [BOARD.x + BOARD.w - 1.2, BOARD.y + BOARD.d - 1.2, top], [BOARD.x + 1.2, BOARD.y + BOARD.d - 1.2, top]])}"/>`;
  const dashes = [];
  for (let x = BOARD.x + 8; x < BOARD.x + BOARD.w - 12; x += 22) dashes.push(k.segment([x, 59, top], [x + 11, 59, top], P));
  const joints = [];
  for (let x = BOARD.x + 10; x < BOARD.x + BOARD.w - 2; x += 10) joints.push(k.segment([x, 13, top], [x, road0, top], P));
  joints.push(k.segment([BOARD.x + 1.2, 13, top], [BOARD.x + BOARD.w - 1.2, 13, top], P));
  joints.push(k.segment([BOARD.x + 1.2, 26.5, top], [BOARD.x + BOARD.w - 1.2, 26.5, top], P));
  const extra = road + L(dashes.join(''), { tone: 'faint', free: true }) + L(joints.join(''), { tone: 'faint' })
    + L(k.planOutline(k.insetPlan(BOARD, 1.2), top, P, 3), { tone: 'faint' })
    + Dt(k.corners(BOARD, 4).map(([x, y]) => at([x, y, top])), { size: 0.5 });
  box('stand.board', BOARD, BOARD_Z, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(BOARD, -2.4, P, 3), { tone: 'faint' }), extra });
  // the kerb between pavement and road
  box('stand.kerb', { x: BOARD.x + 0.6, y: road0, w: BOARD.w - 1.2, d: 2, r: 0.3 }, 0, 0.9, { tone: 'mid' }, { steps: 2 });
}
// front gardens: a low hedge between them and a tiled path to each door
for (let i = 0; i <= 3; i++) {
  const x = HOUSE.x + HW * i;
  if (i > 0 && i < 3) box('house.hedge', { x: x - 1, y: 0.2, w: 2, d: 12, r: 0.8 }, 0, 4, { tone: 'lo' }, { steps: 3 });
}
for (let i = 0; i < 3; i++) {
  const x0 = HOUSE.x + HW * i + 6;
  const tiles = [];
  for (let y = 3; y < 13; y += 3) tiles.push(k.segment([x0, y, 0.01], [x0 + 8, y, 0.01], P));
  box('house.path', { x: x0, y: 0, w: 8, d: 13, r: 0.2 }, 0, 0.3, { tone: 'mid' }, { steps: 2, extra: L(tiles.join(''), { tone: 'faint' }) });
}

// ---------------------------------------------------------------- the houses
{
  const fy = HOUSE.y + HOUSE.d;
  const wins = [];
  const lines = [];
  const glaze = [];
  for (let i = 0; i < 3; i++) {
    const x0 = HOUSE.x + HW * i;
    if (i > 0) lines.push(k.segment([x0, fy, 0], [x0, fy, WALL], P));
    // door with its frame and step, ground-floor window, two upstairs windows
    const door = [[x0 + 7, fy, 0.3], [x0 + 13, fy, 0.3], [x0 + 13, fy, 21], [x0 + 7, fy, 21]];
    lines.push(poly(door));
    lines.push(k.segment([x0 + 7, fy, 15], [x0 + 13, fy, 15], P));
    for (const [wx0, wx1, z0, z1] of [[x0 + 22, x0 + 49, 6, 22], [x0 + 6, x0 + 23, 31, 46], [x0 + 30, x0 + 49, 31, 46]]) {
      const q = [[wx0, fy, z0], [wx1, fy, z0], [wx1, fy, z1], [wx0, fy, z1]];
      glaze.push(poly(q));
      wins.push(poly(q));
      lines.push(k.segment([(wx0 + wx1) / 2, fy, z0], [(wx0 + wx1) / 2, fy, z1], P));
      lines.push(k.segment([wx0, fy, z1 - 4], [wx1, fy, z1 - 4], P));
    }
    // the sill under the ground-floor window
    lines.push(k.segment([x0 + 21, fy, 5.4], [x0 + 50, fy, 5.4], P));
  }
  // a window on the gable end (+x face)
  const gx = HOUSE.x + HOUSE.w;
  const gw = [[gx, -62, 31], [gx, -50, 31], [gx, -50, 44], [gx, -62, 44]];
  glaze.push(poly(gw));
  wins.push(poly(gw));
  lines.push(k.segment([gx, -56, 31], [gx, -56, 44], P));
  const inner = `<path class="ws-glass" d="${glaze.join('')}"/>` + L(wins.join('') + lines.join(''), { tone: 'lo' })
    + L(k.sideSeam(HOUSE, 3, P, 2), { tone: 'faint' }) + L(k.sideSeam(HOUSE, 28, P, 2), { tone: 'faint' });
  const hs = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(HOUSE, -3), 0, 3, P)}" style="opacity:.6"/>`;
  box('house.walls', HOUSE, 0, WALL, { tone: 'hi', crease: 'lo' }, { steps: 2, inner, extra: hs });
}
// the roof: a triangular prism along the street; tiles as rule lines, party walls, solar panels on the front slope
{
  const F = frameX([0, 0, 0]);
  const y0 = HOUSE.y - EAVE;
  const y1 = HOUSE.y + HOUSE.d + EAVE;
  const ym = HOUSE.y + HOUSE.d / 2;
  const tri = [[y0, WALL], [y1, WALL], [ym, RIDGE]];
  const s0 = HOUSE.x - 2;
  const s1 = HOUSE.x + HOUSE.w + 2;
  // a point on the front slope: x along the street, t from the eave (0) to the ridge (1), lifted off the tiles by h
  const nrm = G.unit3([0, RIDGE - WALL, y1 - ym]);
  const onRoof = (x, t, h = 0) => [x, y1 + (ym - y1) * t + nrm[1] * h, WALL + (RIDGE - WALL) * t + nrm[2] * h];
  const tiles = [0.2, 0.4, 0.6, 0.8].map((t) => k.segment(onRoof(s0, t), onRoof(s1, t), P)).join('');
  const party = [1, 2].map((i) => k.segment(onRoof(HW * i, 0), onRoof(HW * i, 1), P)).join('');
  // two rows of three panels per house, each with an aluminium frame and cell lines
  const pv = [];
  const cells = [];
  for (let i = 0; i < 3; i++) {
    for (const [ta, tb] of [[0.12, 0.44], [0.5, 0.82]]) {
      for (let c = 0; c < 3; c++) {
        const xa = HW * i + 8 + c * 13.4;
        const xb = xa + 12.6;
        pv.push(k.pathOf([onRoof(xa, ta, 0.5), onRoof(xb, ta, 0.5), onRoof(xb, tb, 0.5), onRoof(xa, tb, 0.5)].map(at), true));
        for (const f of [1 / 3, 2 / 3]) cells.push(k.segment(onRoof(xa + (xb - xa) * f, ta, 0.5), onRoof(xa + (xb - xa) * f, tb, 0.5), P));
        cells.push(k.segment(onRoof(xa, (ta + tb) / 2, 0.5), onRoof(xb, (ta + tb) / 2, 0.5), P));
      }
    }
  }
  const panels = `<g data-cue="pv"><path class="ws-pv" d="${pv.join('')}"/>${L(cells.join(''), { tone: 'faint' })}<path class="iso-line" data-tone="mid" d="${pv.join('')}"/></g>`;
  prism('roof.body', F, tri, s0, s1, { tone: 'mid', crease: 'lo' }, { inner: L(tiles, { tone: 'faint' }) + L(party, { tone: 'lo' }), extra: panels });
}
// meter boxes beside each front door, where the branch cables land
for (let i = 0; i < 3; i++) {
  const mx = METER_X(i);
  const fy = HOUSE.y + HOUSE.d;
  const plan = { x: mx, y: fy, w: 5, d: 1.6, r: 0.3 };
  const face = fy + 1.6;
  const extra = L(poly([[mx + 1, face, 9.2], [mx + 4, face, 9.2], [mx + 4, face, 11], [mx + 1, face, 11]]), { tone: 'lo' })
    + Dt([at([mx + 2.5, face, 7])], { size: 0.5, tone: 'hi' });
  box('house.meter', plan, 4, 12.5, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra });
}
// the heat pump's outdoor unit in the middle garden: casing, fan grille, feet
{
  for (const x of [HP_PLAN.x + 1, HP_PLAN.x + HP_PLAN.w - 3]) box('hp.foot', { x, y: HP_PLAN.y + 0.5, w: 2, d: 4, r: 0.3 }, 0, 1.2, { tone: 'lo' }, { steps: 2 });
  const fy = HP_PLAN.y + HP_PLAN.d;
  const c = [HP_PLAN.x + 4.6, fy, 6.2];
  const grille = `<path class="ws-well" d="${k.sideRing(c, 3.4, 'y', P)}"/>` + L(k.sideRing(c, 3.4, 'y', P) + k.sideRing(c, 2.2, 'y', P) + k.sideRing(c, 1, 'y', P), { tone: 'lo' })
    + Dt([at(c)], { size: 0.45, tone: 'hi' });
  const slots = [8.6, 7.4, 6.2, 5, 3.8].map((z) => k.segment([HP_PLAN.x + 9, fy, z], [HP_PLAN.x + 11, fy, z], P)).join('');
  box('hp.case', HP_PLAN, 1.2, 10.4, { tone: 'hi' }, { steps: 2, bevel: 0.3, extra: grille + L(slots, { tone: 'lo' }) });
}
// the inverter on the end gable, with a conduit up to the eaves
{
  const gx = HOUSE.x + HOUSE.w;
  const plan = { x: gx, y: INV.y0, w: 2, d: INV.y1 - INV.y0, r: 0.3 };
  const fx = gx + 2;
  const extra = L(poly([[fx, INV.y0 + 1.6, INV.z1 - 4], [fx, INV.y1 - 1.6, INV.z1 - 4], [fx, INV.y1 - 1.6, INV.z1 - 1.6], [fx, INV.y0 + 1.6, INV.z1 - 1.6]]), { tone: 'lo' })
    + Dt([at([fx, INV.y0 + 2, INV.z0 + 2])], { size: 0.5, tone: 'hi' });
  box('inv.box', plan, INV.z0, INV.z1, { tone: 'hi' }, { steps: 2, bevel: 0.2, extra });
  box('inv.conduit', { x: gx, y: -36.6, w: 0.8, d: 1.2, r: 0.2 }, INV.z1, WALL, { tone: 'mid' }, { steps: 1 });
}

// ---------------------------------------------------------------- the netstation (kiosk) with its doors open
{
  const ks = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(KIOSK, -2), 0, 2, P)}" style="opacity:.7"/>`;
  halo.push(ks);
  box('kiosk.floor', KIOSK, 0, 2.2, { tone: 'lo' }, { steps: 2, bevel: 0.3 });
  const { x, y, w, d } = KIOSK;
  box('kiosk.back', { x, y, w, d: 1.2, r: 0.2 }, 2.2, KIOSK_Z, { tone: 'mid' }, { steps: 1 });
  box('kiosk.left', { x, y: y + 1.2, w: 1.2, d: d - 1.2, r: 0.2 }, 2.2, KIOSK_Z, { tone: 'mid' }, { steps: 1 });
  // the +x wall with two louvre vents
  const fx = x + w;
  const vents = [];
  for (const [ya, yb] of [[y + 4, y + 11], [y + 13, y + 20]]) {
    for (const z of [6, 8, 10, 12, 14]) vents.push(k.pathOf([[fx, ya, z], [fx, yb, z], [fx, yb, z + 0.9], [fx, ya, z + 0.9]].map(at), true));
  }
  box('kiosk.right', { x: fx - 1.2, y: y + 1.2, w: 1.2, d: d - 1.2, r: 0.2 }, 2.2, KIOSK_Z, { tone: 'mid' }, { steps: 1, extra: L(vents.join(''), { tone: 'lo' }) });
  // the front piers between the two door openings
  box('kiosk.pier', { x: x + 18.4, y: y + d - 1.2, w: 1.2, d: 1.2, r: 0.2 }, 2.2, KIOSK_Z - 3, { tone: 'mid' }, { steps: 1 });
  const lintel = { x: x + 1.2, y: y + d - 1.2, w: w - 2.4, d: 1.2, r: 0.2 };
  box('kiosk.lintel', lintel, KIOSK_Z - 3, KIOSK_Z, { tone: 'mid' }, { steps: 1 });
  const roof = k.insetPlan(KIOSK, -1.4);
  box('kiosk.roof', roof, KIOSK_Z, KIOSK_Z + 1.8, { tone: 'mid' }, {
    steps: 2, bevel: 0.4,
  });
  // the doors, swung open toward the viewer: louvred leaves on hinges at the jambs
  for (const lx0 of [x, x + w - 0.8]) {
    const leaf = { x: lx0, y: y + d, w: 0.8, d: 16.6, r: 0.2 };
    const lx = leaf.x + leaf.w;
    const louv = [];
    for (const z of [5, 7, 9, 11, 13, 15]) louv.push(k.pathOf([[lx, y + d + 4, z], [lx, y + d + 13, z], [lx, y + d + 13, z + 0.9], [lx, y + d + 4, z + 0.9]].map(at), true));
    box('kiosk.door', leaf, 2.4, KIOSK_Z - 3.4, { tone: 'hi' }, { steps: 1, extra: L(louv.join(''), { tone: 'lo' }) });
  }
}
// the transformer: a tank on rails with corrugated fins on its front, LV bushings on the cover
{
  for (const yy of [TANK.y + 2, TANK.y + TANK.d - 4]) box('tr.rail', { x: TANK.x - 0.6, y: yy, w: TANK.w + 1.2, d: 2, r: 0.2 }, 2.2, TANK_Z[0], { tone: 'lo' }, { steps: 1 });
  const fy = TANK.y + TANK.d;
  box('tr.tank', TANK, TANK_Z[0], TANK_Z[1], { tone: 'hi', crease: 'lo' }, { steps: 2, inner: L(k.sideSeam(TANK, TANK_Z[1] - 1.6, P, 2), { tone: 'faint' }) });
  for (let i = 0; i < 6; i++) {
    const fx = TANK.x + 1.6 + i * 2.35;
    box('tr.fin', { x: fx, y: fy, w: 0.7, d: 2.4, r: 0.2 }, TANK_Z[0] + 1.4, TANK_Z[1] - 2.4, { tone: 'mid' }, { steps: 1 });
  }
  const cover = k.insetPlan(TANK, -0.6);
  box('tr.cover', cover, TANK_Z[1], TANK_Z[1] + 1, { tone: 'mid' }, { steps: 2, extra: Dt(k.corners(cover, 0.8).map(([xx, yy]) => at([xx, yy, TANK_Z[1] + 1])), { size: 0.4 }) });
  // MV bushings at the back, LV bushings at the front
  for (const bx of [TANK.x + 4, TANK.x + 7.5, TANK.x + 11]) {
    post('tr.hv', bx, TANK.y + 3, 0.9, TANK_Z[1] + 1, TANK_Z[1] + 5.4, { tone: 'hi' }, { steps: 14 });
  }
  for (const bx of [TANK.x + 3, TANK.x + 6, TANK.x + 9, TANK.x + 12]) {
    post('tr.lv', bx, TANK.y + 8, 0.7, TANK_Z[1] + 1, TANK_Z[1] + 3.6, { tone: 'hi' }, { steps: 12 });
  }
}
// the LV rack: a frame with four fuse ways, each a vertical strip of three fuse bases
{
  box('kiosk.rack', RACK, 2.2, RACK_Z[1], { tone: 'mid' }, { steps: 1 });
  const fy = RACK.y + RACK.d;
  for (let i = 0; i < 4; i++) {
    const sx = RACK.x + 1 + i * 2.5;
    const dots = [8, 11.5, 15].map((z) => at([sx + 0.9, fy + 1, z]));
    box('kiosk.fuseway', { x: sx, y: fy, w: 1.8, d: 1, r: 0.2 }, 6, 17.5, { tone: i === 0 ? 'hi' : 'lo' }, { steps: 1, extra: Dt(dots, { size: 0.42, tone: 'hi' }) });
  }
}

// ---------------------------------------------------------------- the street cable, its joints and branches
const FUSE0 = [RACK.x + 1.9, RACK.y + RACK.d, 4.4];
const CABLE_END_X = BRANCH_X(2) + 8;
{
  const JR = CABLE_R * 1.7;
  // the joints (moffen) on the main, where the branches leave, and the end cap
  for (let i = 0; i < 3; i++) discAt('joint', frameX([BRANCH_X(i), CABLE_Y, CABLE_Z]), -2.2, 2.2, JR, { tone: 'mid' }, { steps: 16 });
  discAt('joint.end', frameX([CABLE_END_X, CABLE_Y, CABLE_Z]), 0, 1.6, CABLE_Z, { tone: 'mid' }, { steps: 16 });
  const pieces = [];
  // the main: out of the first fuse way, down to the kiosk floor, under the doorway and along the pavement, cut at each joint
  pieces.push({ name: 'cable.feed', route: G.fillet([FUSE0, [FUSE0[0], FUSE0[1] + 4, FUSE0[2]], [FUSE0[0], FUSE0[1] + 7, CABLE_Z + 2.2],
    [FUSE0[0], CABLE_Y, CABLE_Z], [BRANCH_X(0) - 2.2, CABLE_Y, CABLE_Z]], 1.8, 7, { P, tube: CABLE_R }) });
  for (let i = 0; i < 3; i++) {
    const x1 = i < 2 ? BRANCH_X(i + 1) - 2.2 : CABLE_END_X;
    pieces.push({ name: `cable.main${i}`, route: [[BRANCH_X(i) + 2.2, CABLE_Y, CABLE_Z], [x1, CABLE_Y, CABLE_Z]] });
  }
  // the branches: from the side of each joint toward the house, then up the front wall into the meter box
  const BR = 0.75;
  for (let i = 0; i < 3; i++) {
    const bx = BRANCH_X(i);
    const ry = HOUSE.y + HOUSE.d + 0.8;
    pieces.push({ name: `branch${i}`, r: BR, route: G.fillet([[bx, CABLE_Y - JR, CABLE_Z], [bx, ry, CABLE_Z], [bx, ry, 4]], 1.2, 7, { P, tube: BR }) });
  }
  pieces.forEach(({ name, route, r = CABLE_R }) => {
    R.route(name, route, r, { limp: true });
    T.tubePieces(route, r, P, { maxLength: 30, spacing: 1 }).forEach((piece, i) => {
      put(`${name}:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'mid' }), [A.tube(piece.points, piece.radii, { name, limp: true })], { bias: 0.05 });
    });
  });
}

// ---------------------------------------------------------------- the car and its charge point
{
  const { x, y, w, d } = CAR;
  const z0 = 3.6;
  const z1 = 8.6;
  box('car.body', CAR, z0, z1, { tone: 'hi', crease: 'lo' }, { steps: 4, bevel: 0.4, inner: L(k.sideSeam(CAR, z0 + 2, P, 4), { tone: 'faint' }) });
  // the cabin: a prism across the car, glass lines on its sides
  const F = frameX([0, 0, 0]);
  const cab = [[y + 12, z1], [y + 34, z1], [y + 29, z1 + 6], [y + 15, z1 + 6]];
  const fx = x + w - 1;
  const glass = `<path class="ws-glass" d="${poly([[fx, y + 14.2, z1 + 0.8], [fx, y + 31.6, z1 + 0.8], [fx, y + 28.4, z1 + 5.2], [fx, y + 16, z1 + 5.2]])}"/>`
    + L(k.segment([fx, y + 22.5, z1 + 0.8], [fx, y + 22.5, z1 + 5.2], P), { tone: 'lo' });
  prism('car.cabin', F, cab, x + 1, x + w - 1, { tone: 'mid', crease: 'lo' }, { extra: glass });
  // wheels on the +x and −x sides
  for (const wy of [y + 8, y + d - 8]) {
    for (const [s0, s1] of [[x - 1.8, x], [x + w, x + w + 1.8]]) {
      const F2 = frameX([0, wy, 3.4]);
      discAt('car.wheel', F2, s0, s1, 3.4, { tone: 'lo' }, { steps: 22, extra: s0 > x ? Dt([at([s1, wy, 3.4])], { size: 0.6, tone: 'mid' }) : '' });
    }
  }
  // lights: two small marks on the front (+y) face
  const fy = y + d;
  box('car.light', { x: x + 2, y: fy - 0.2, w: 3.4, d: 0.4, r: 0.1 }, 6.4, 7.6, { tone: 'hi' }, { steps: 1 });
  box('car.light', { x: x + w - 5.4, y: fy - 0.2, w: 3.4, d: 0.4, r: 0.1 }, 6.4, 7.6, { tone: 'hi' }, { steps: 1 });
  // the charge point: a slim post with a screen and a holster, its lead plugged into the car's flap
  const [px, py] = POLE;
  box('pole.foot', { x: px - 2.4, y: py - 2, w: 4.8, d: 4, r: 0.4 }, 0, 0.8, { tone: 'lo' }, { steps: 2 });
  const pole = { x: px - 1.6, y: py - 1.2, w: 3.2, d: 2.4, r: 0.4 };
  const pf = py + 1.2;
  const screen = `<path class="ws-glass" d="${poly([[px - 1, pf, 11.6], [px + 1, pf, 11.6], [px + 1, pf, 13.8], [px - 1, pf, 13.8]])}"/>`
    + L(poly([[px - 1, pf, 11.6], [px + 1, pf, 11.6], [px + 1, pf, 13.8], [px - 1, pf, 13.8]]), { tone: 'lo' })
    + Dt([at([px, pf, 10])], { size: 0.5, tone: 'hi' });
  box('pole.body', pole, 0.8, 16, { tone: 'hi' }, { steps: 2, bevel: 0.2, extra: screen });
  box('pole.cap', k.insetPlan(pole, -0.4), 16, 16.8, { tone: 'mid' }, { steps: 2 });
  // the lead: out of the post's side, down in a sag and up into the flap on the car's +x side
  const flap = [x + w, y + d - 14, 7];
  box('car.flap', { x: x + w, y: flap[1] - 1, w: 0.5, d: 2, r: 0.2 }, 6, 8, { tone: 'mid' }, { steps: 1 });
  const lead = G.fillet([[px - 1.6, py, 8], [px - 4, py, 8], [px - 4.2, py, 3], [flap[0] + 3, flap[1], 3], [flap[0] + 3, flap[1], flap[2]], [flap[0] + 0.5, flap[1], flap[2]]], 1.4, 6, { P, tube: 0.5 });
  R.route('lead', lead, 0.5, { limp: true });
  T.tubePieces(lead, 0.5, P, { maxLength: 20, spacing: 1 }).forEach((piece, i) => {
    put(`lead:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'mid' }), [A.tube(piece.points, piece.radii, { name: 'lead', limp: true })], { bias: 0.05 });
  });
}

// ---------------------------------------------------------------- the street lamp
{
  const [lx, ly] = LAMP;
  post('lamp.foot', lx, ly, 1.6, 0, 1.4, { tone: 'lo' }, { steps: 16 });
  post('lamp.mast', lx, ly, 0.7, 1.4, 44, { tone: 'mid' }, { steps: 14 });
  const F = frameY([lx, ly, 43]);
  discAt('lamp.arm', F, -5, -0.7, 0.5, { tone: 'mid' }, { steps: 10 });
  box('lamp.head', { x: lx - 2.2, y: ly - 10, w: 4.4, d: 5, r: 1 }, 42, 44.2, { tone: 'hi' }, { steps: 3 });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
// the flow of current along the main, drawn over the cable (stage.js runs its dashes)
const FLOW = [[FUSE0[0], CABLE_Y, CABLE_Z + 1.2], [CABLE_END_X, CABLE_Y, CABLE_Z + 1.2]];
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  `<g data-cue="cable"><path class="ws-flow" data-k="flow" d="${k.pathOf(FLOW.map(at))}"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('pipe', g('pbBase', '') + cue('volt', g('pbVolt', '')) + cue('amp', g('pbAmp', '')) + cue('watt', g('pbWatt', '')) + g('pbFlow', '')),
  g('meter', g('mtBase', '') + g('mtKw', '') + cue('kwh', g('mtKwh', '')) + g('mtYear', '')),
  g('waves', g('wvBase', '') + cue('wave', g('wvOne', '')) + cue('phases', g('wvThree', '')) + g('wvTxt', '')),
  g('day', g('dyBase', '') + cue('conn', g('dyConn', '')) + g('dyCurve', '')),
  g('grid', g('gdBase', '') + cue('sim', g('gdHomes', '')) + cue('peak', g('gdPeak', '')) + g('gdSum', '')),
  g('pf', g('pfBase', '') + cue('pfC', g('pfIn', '')) + g('pfSum', '')),
  g('stack', g('skBase', '') + g('skBars', '') + g('skSum', '')),
  g('volt', g('vlBase', '') + g('vlLines', '') + g('vlTxt', '')),
  g('smart', g('smBase', '') + g('smCurves', '') + g('smTxt', '')),
].join('');

// Static paths written with relative line-tos (the helper from the measuring
// film): the same points, about a third fewer bytes. Only M, L and Z paths at
// one decimal are rewritten, and each rewrite is read back to prove it exact.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put2 = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && out && !/[MlZ]$/.test(out) && s[0] !== '-') out += ' ';
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put2('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put2('M', p); cur = p; start = p; cmd = 'L'; } else { put2('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
  }
  return out;
}
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round(y * 10) / 10, w]; };
const MID = [64, -20, 20];
const SIDE = (p, w0, w1) => ({ from: cam(p, w0, 104), to: cam(p, w1, 104) });
const HOUSE_A = [30, 5, 18];
const KIOSK_C = [-64, -20, 12];
const CAM = [
  { from: cam(MID, 660), to: cam(HOUSE_A, 300, 104), a: 0.3, b: 0.42 },
  SIDE(HOUSE_A, 300, 280),
  SIDE(KIOSK_C, 250, 230),
  SIDE([150, 0, 14], 330, 300),
  SIDE([-30, -10, 16], 560, 520),
  SIDE(KIOSK_C, 230, 214),
  { from: cam([96, 5, 8], 250, 135), to: cam([180, 0, 8], 240, 135), a: 0.27, b: 0.4 }, // closer: the stack card is narrower here
  SIDE([150, -30, 40], 330, 300),
  SIDE([186, 0, 10], 230, 210),
];

// ---------------------------------------------------------------- the film
const BAS = 'eng.gridbasics.basics';
const LOAD = 'eng.gridbasics.load';
const DUR = [34, 32, 34, 40, 34, 26, 34, 34, 28];
const C = {
  U, ULL, KETTLE, AVG, PEAK_HOME, EV, CONN, S_TR, HOMES, PER_HOME, OLD, HP, CARS, NEW, UMAX, dur: DUR,
  FLOW_LEN: 0,
};
const spec = {
  id: 'eng.gridbasics.load',
  title: { nl: 'Een avondpiek in de straat', en: 'An evening peak in the street' },
  lessons: [BAS, LOAD],
  scenes: [
    {
      id: 's1', lesson: BAS, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Spanning en stroom', en: 'Voltage and current' },
      beats: [
        { nl: 'Een straat, een netstation en een kabel onder de stoep naar elk huis.', en: 'A street, a distribution substation and a cable under the pavement to every home.', cues: ['houses', 'station', 'cable'] },
        { nl: '{t:Spanning}: de elektrische druk, in volt. In huis {n:230} V.', en: '{t:Voltage}: the electrical push, in volts. At home {n:230} V.', cue: { Spanning: 'volt' } },
        { nl: '{t:Stroomsterkte}, kortweg stroom: hoeveel er doorstroomt, in ampère.', en: '{t:Current}: how much flows, in amperes.', cue: { Stroomsterkte: 'amp' }, cues: ['cable'] },
        { nl: 'Vermogen = spanning × stroom, in watt. Duizend watt is één {t:kW}.', en: 'Power = voltage × current, in watts. A thousand watts is one {t:kW}.', cue: { kW: 'watt' } },
        { nl: 'Een waterkoker van {n:2000} W op {n:230} V trekt zo’n {n:8.7} A.', en: 'A {n:2000} W kettle on {n:230} V draws about {n:8.7} A.', cues: ['watt'] },
      ],
    },
    {
      id: 's2', lesson: BAS, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Vermogen en energie', en: 'Power and energy' },
      beats: [
        { nl: '{t:kWh}: energie, vermogen maal tijd.', en: '{t:kWh}: energy, power times time.', cue: { kWh: 'kwh' }, cues: ['meter'] },
        { nl: 'De waterkoker: {n:2} kW, {n:3} minuten: {n:2} × {n:0.05} uur = {n:0.1} kWh.', en: 'The kettle: {n:2} kW for {n:3} minutes: {n:2} × {n:0.05} h = {n:0.1} kWh.', cues: ['kwh'] },
        { nl: 'Een gezin verbruikt zo’n {n:2700} kWh per jaar: gemiddeld {n:0.31} kW.', en: 'A family uses about {n:2700} kWh a year: on average {n:0.31} kW.', cues: ['meter'] },
        { nl: 'Je betaalt per kWh, maar het net wordt gebouwd voor het hoogste vermogen.', en: 'You pay per kWh, but the grid is built for the highest power.', cues: ['cable'] },
      ],
    },
    {
      id: 's3', lesson: BAS, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Wisselstroom, drie fasen', en: 'AC, three phases' },
      beats: [
        { nl: '{t:Wisselstroom}: de spanning gaat {n:50} keer per seconde heen en weer.', en: '{t:Alternating current}: the voltage swings back and forth {n:50} times a second.', cue: { Wisselstroom: 'wave' } },
        { nl: 'Een transformator zet wisselspanning omhoog en omlaag, zoals in dit netstation.', en: 'A transformer steps AC voltage up and down, as in this distribution substation.', cues: ['trafo'] },
        { nl: '{t:Driefasig}: drie fasen, elk een derde periode verschoven, plus de nul.', en: '{t:Three-phase}: three phases, each a third of a cycle apart, plus neutral.', cue: { Driefasig: 'cable' }, cues: ['phases'] },
        { nl: '{n:230} V tussen fase en nul, {n:400} V tussen twee fasen.', en: '{n:230} V phase to neutral, {n:400} V between two phases.', cues: ['phases'] },
      ],
    },
    {
      id: 's4', lesson: BAS, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Eén huis, één dag', en: 'One home, one day' },
      beats: [
        { nl: 'De aansluiting: {n:3} × {n:25} A, maximaal zo’n {n:17} {t:kVA}.', en: 'The connection: {n:3} × {n:25} A, at most about {n:17} {t:kVA}.', cue: { kVA: 'conn' }, cues: ['meter'] },
        { nl: 'Een dag in één huis: meestal weinig. Over het jaar gemiddeld {n:0.31} kW.', en: 'A day in one home: mostly little. Over the year {n:0.31} kW on average.', cues: [] },
        { nl: 'Om 18:00 uur: oven {n:3}, waterkoker {n:2}, vaatwasser {n:2}: samen {n:7} kW.', en: 'At 18:00: oven {n:3}, kettle {n:2}, dishwasher {n:2}: together {n:7} kW.', cues: [] },
        { nl: 'Een auto erbij die laadt op {n:11} kW: {n:18} kW, meer dan {n:17} kVA.', en: 'Add a car charging at {n:11} kW: {n:18} kW, above {n:17} kVA.', cues: ['ev'] },
      ],
    },
    {
      id: 's5', lesson: LOAD, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Niet iedereen tegelijk', en: 'Not everyone at once' },
      beats: [
        { nl: 'Eén netstation van {n:400} kVA voedt {n:150} woningen.', en: 'One {n:400} kVA distribution substation feeds {n:150} homes.', cues: ['station', 'houses'] },
        { nl: '{t:Gelijktijdigheid}: welk deel van ieders maximum tegelijk optreedt.', en: '{t:Simultaneity}: how much of everyone’s maximum happens at once.', cue: { Gelijktijdigheid: 'sim' } },
        { nl: '{t:Piekbelasting}: de hoogste belasting van het jaar, meestal op een winteravond.', en: '{t:Peak load}: the highest load of the year, usually on a winter evening.', cue: { Piekbelasting: 'peak' } },
        { nl: '{n:150} × {n:1.5} kVA = {n:225} kVA: {n:56}% van de transformator.', en: '{n:150} × {n:1.5} kVA = {n:225} kVA: {n:56}% of the transformer.', cues: ['trafo'] },
      ],
    },
    {
      id: 's6', lesson: LOAD, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'kVA en kW', en: 'kVA and kW' },
      beats: [
        { nl: '{t:kVA}: schijnbaar vermogen, alles wat kabel en transformator dragen.', en: '{t:kVA}: apparent power, all that cable and transformer carry.', cue: { kVA: 'trafo' }, cues: ['pfC'] },
        { nl: '{t:Arbeidsfactor}, cos φ: het nuttige deel. Woningen: {n:0.9} tot {n:1}.', en: '{t:Power factor}, cos φ: the useful share. Homes: {n:0.9} to {n:1}.', cue: { Arbeidsfactor: 'pfC' } },
        { nl: 'Een transformator van {n:400} kVA levert zo’n {n:360} tot {n:400} kW.', en: 'A {n:400} kVA transformer delivers about {n:360} to {n:400} kW.', cues: ['trafo'] },
      ],
    },
    {
      id: 's7', lesson: LOAD, level: 2, dur: DUR[6], still: 0.9, title: { nl: 'Een koude avond', en: 'A cold evening' },
      beats: [
        { nl: '{n:50} warmtepompen van {n:3} kW, allemaal op zo’n {n:80}%: + {n:120} kVA.', en: '{n:50} heat pumps of {n:3} kW, all at about {n:80}%: + {n:120} kVA.', cues: ['hp'] },
        { nl: '{n:40} auto’s laden op {n:11} kW, zo’n {n:30}% tegelijk: + {n:132} kVA.', en: '{n:40} cars charge at {n:11} kW, about {n:30}% at once: + {n:132} kVA.', cues: ['ev'] },
        { nl: 'Nieuwe piek: {n:225} + {n:120} + {n:132} = {n:477} kVA, {n:119}% van de transformator.', en: 'New peak: {n:225} + {n:120} + {n:132} = {n:477} kVA, {n:119}% of the transformer.', cues: ['trafo'] },
        { nl: 'Het jaarverbruik groeit veel minder: de piek wordt meer dan twee keer zo hoog.', en: 'The yearly energy grows far less: the peak more than doubles.', cues: [] },
      ],
    },
    {
      id: 's8', lesson: LOAD, level: 2, dur: DUR[7], still: 0.9, title: { nl: 'Een zonnige middag', en: 'A sunny midday' },
      beats: [
        { nl: '’s Middags een piek de andere kant op: elk dak levert tegelijk terug.', en: 'At midday a peak the other way: every roof feeds back at once.', cues: ['pv'] },
        { nl: 'De {t:Omvormer|omvormer} zet de gelijkstroom van de panelen om naar wisselstroom.', en: 'The {t:Inverter|inverter} turns the panels’ DC into AC for the grid.', cue: { Omvormer: 'inv' } },
        { nl: 'Veel teruglevering: de spanning aan het eind van de kabel stijgt.', en: 'Lots of feed-in: the voltage at the end of the cable rises.', cues: ['cable'] },
        { nl: 'Boven zo’n {n:253} V ({n:230} V plus {n:10}%) schakelt de omvormer af.', en: 'Above about {n:253} V ({n:230} V plus {n:10}%) the inverter switches off.', cues: ['inv'] },
      ],
    },
    {
      id: 's9', lesson: LOAD, level: 2, dur: DUR[8], still: 0.9, title: { nl: 'De scherpe vraag', en: 'The sharp question' },
      beats: [
        { nl: 'Met welke gelijktijdigheid reken je voor warmtepompen en laadpalen?', en: 'Which simultaneity do you assume for heat pumps and chargers?', cues: ['hp', 'ev'] },
        { nl: 'Te laag: overbelast in de eerste koude week. Te hoog: straten jaren te vroeg open.', en: 'Too low: overloaded in the first cold week. Too high: streets dug up years early.', cues: [] },
        { nl: 'Slim laden (smart charging) spreidt het laden over de nacht en kan de piek verlagen.', en: 'Smart charging spreads charging over the night and can cut the peak.', cues: ['ev'] },
        { nl: 'Vraag dus: op welke gelijktijdigheid is dit plan gebaseerd?', en: 'So ask: which simultaneity is this plan based on?', cues: [] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&" or "·" in the spoken text; kW, kWh and
// kVA are written out (kilowatt, kilowattuur, kilovoltampère) as in the motor
// film, because espeak-ng spells them as letters; cos φ is said as "cos phi".
// Dutch words checked with espeak-ng phonemes (Piper's own bridge): wisselstroom,
// gelijkstroom, netstation and laadpalen (stress on the second part) get Dutch
// spoken forms in films/_kit/timeline.mjs (SAY); doorstroomt and hetzelfde
// (stress on the wrong part) are kept out of the Dutch narration.
const SAY = [
  [ // s1 voltage and current
    { nl: 'Een gewone straat. Aan het eind staat een netstation; onder de stoep loopt een kabel naar elk huis.',
      en: 'An ordinary street. At the end stands a distribution substation; under the pavement a cable runs to every home.' },
    { nl: 'Elektriciteit in die kabel lijkt op water in een leiding. De {t:Spanning|spanning} is de druk, in volt: in een Nederlands huis {n:230} volt.',
      en: 'Electricity in that cable is like water in a pipe. The {t:Voltage|voltage} is the push, in volts: {n:230} volts in a Dutch home.' },
    { nl: 'De {t:Stroomsterkte|stroomsterkte}, kortweg stroom, is hoeveel er stroomt, in ampère. Stroom maakt kabels warm en laat zekeringen doorslaan.',
      en: 'The {t:Current|current} is how much flows, in amperes. Current heats cables and blows fuses.' },
    { nl: 'Vermogen is hoe snel er energie wordt gebruikt: spanning maal stroom, in watt. Duizend watt is één kilowatt.',
      en: 'Power is how fast energy is used: voltage times current, in watts. A thousand watts is one kilowatt.' },
    { nl: 'Een waterkoker van {n:2000} watt trekt op {n:230} volt dus zo’n {n:8.7} ampère.',
      en: 'So a {n:2000} watt kettle on {n:230} volts draws about {n:8.7} amps.' },
  ],
  [ // s2 power and energy
    { nl: 'Vermogen is de stand van nu. Energie is vermogen maal tijd, opgeteld, in kilowattuur.',
      en: 'Power is the reading of the moment. Energy is power times time, added up, in kilowatt hours.' },
    { nl: 'Staat die waterkoker {n:3} minuten aan, dan is dat {n:2} kilowatt maal {n:0.05} uur: {n:0.1} kilowattuur.',
      en: 'If the kettle runs for {n:3} minutes, that is {n:2} kilowatts times {n:0.05} hours: {n:0.1} kilowatt hours.' },
    { nl: 'Een gemiddeld gezin verbruikt zo’n {n:2700} kilowattuur per jaar. Over de {n:8760} uur van een jaar is dat gemiddeld maar {n:0.31} kilowatt.',
      en: 'An average family uses about {n:2700} kilowatt hours a year. Spread over the {n:8760} hours of a year, that is on average only {n:0.31} kilowatts.' },
    { nl: 'Je betaalt per kilowattuur, maar kabels en transformatoren moeten het hoogste vermogen op één moment dragen: het net wordt gebouwd voor kilowatt.',
      en: 'You pay per kilowatt hour, but cables and transformers must carry the highest power at any one moment: the grid is built for kilowatts.' },
  ],
  [ // s3 AC and three phases
    { nl: 'Het net werkt met {t:Wisselstroom|wisselstroom}: de spanning gaat {n:50} keer per seconde heen en weer, {n:50} hertz. Zonnepanelen en batterijen geven gelijkstroom, die één kant op loopt.',
      en: 'The grid runs on {t:Alternating current|alternating current}: the voltage swings back and forth {n:50} times a second, {n:50} hertz. Solar panels and batteries give direct current, which flows one way only.' },
    { nl: 'Wisselstroom won omdat een transformator de spanning makkelijk omhoog en omlaag zet. In dit netstation maakt hij van middenspanning laagspanning voor de straat.',
      en: 'AC won because a transformer can easily step its voltage up and down. In this distribution substation it turns medium voltage into low voltage for the street.' },
    { nl: 'De kabel in de straat is {t:Driefasig|driefasig}: drie fasen, elk een derde periode verschoven, plus een nul als terugleider.',
      en: 'The street cable is {t:Three-phase|three-phase}: three phases, each a third of a cycle apart, plus a neutral as the return wire.' },
    { nl: 'Tussen fase en nul staat {n:230} volt, tussen twee fasen {n:400}. Warmtepompen en laadpalen gebruiken vaak alle drie.',
      en: 'Between a phase and neutral there are {n:230} volts, between two phases {n:400}. Heat pumps and car chargers often use all three.' },
  ],
  [ // s4 one home, one day
    { nl: 'Een gangbare huisaansluiting is {n:3} keer {n:25} ampère: maximaal zo’n {n:17} kilovoltampère, de maat voor wat een kabel of zekering moet dragen.',
      en: 'A common house connection is {n:3} times {n:25} amps: at most about {n:17} kilovolt amperes, the unit for what a cable or fuse must carry.' },
    { nl: 'Een dag in één huis: meestal vraagt het weinig, vaak minder dan het jaargemiddelde.',
      en: 'A day in one home: mostly it asks little, often less than the yearly average.' },
    { nl: 'Maar om zes uur staan oven, waterkoker en vaatwasser tegelijk aan: {n:3} plus {n:2} plus {n:2} is {n:7} kilowatt.',
      en: 'But at six in the evening the oven, the kettle and the dishwasher run together: {n:3} plus {n:2} plus {n:2} is {n:7} kilowatts.' },
    { nl: 'Laadt er ook een elektrische auto op {n:11} kilowatt, dan trekt het huis {n:18} kilowatt: meer dan de aansluiting toelaat. De hoofdzekering kan eruit vliegen.',
      en: 'If an electric car also charges at {n:11} kilowatts, the house draws {n:18} kilowatts: more than the connection allows. The main fuse may blow.' },
  ],
  [ // s5 not everyone at once
    { nl: 'Nu de hele wijk. Dit netstation heeft een transformator van {n:400} kilovoltampère en voedt {n:150} woningen.',
      en: 'Now the whole district. This distribution substation has a {n:400} kilovolt ampere transformer and feeds {n:150} homes.' },
    { nl: 'Ze pieken niet allemaal tegelijk: de een kookt om zes uur, de ander om half acht. Dat heet {t:Gelijktijdigheid|gelijktijdigheid}: welk deel van ieders maximum tegelijk optreedt.',
      en: 'Those homes do not all peak at once: one cooks at six, another at half past seven. That is {t:Simultaneity|simultaneity}: how much of everyone’s maximum happens at the same moment.' },
    { nl: 'De {t:Piekbelasting|piekbelasting} is de hoogste belasting van het jaar, meestal op een koude winteravond. Traditioneel rekenden planners met {n:1} tot {n:1.5} kilovoltampère per woning, ver onder de {n:17} van de aansluiting.',
      en: 'The {t:Peak load|peak load} is the highest load of the year, usually on a cold winter evening. Traditionally planners counted {n:1} to {n:1.5} kilovolt amperes per home, far below the {n:17} of the connection.' },
    { nl: '{n:150} maal {n:1.5} is {n:225} kilovoltampère: op zijn drukste moment is de transformator voor {n:56} procent belast.',
      en: '{n:150} times {n:1.5} is {n:225} kilovolt amperes: at its busiest moment the transformer is {n:56} percent loaded.' },
  ],
  [ // s6 kVA and kW
    { nl: 'Waarom kilovoltampère en niet kilowatt? Een kabel of transformator draagt alle stroom, ook een deel dat door motoren en elektronica alleen heen en weer stroomt. Dat totaal heet schijnbaar vermogen.',
      en: 'Why kilovolt amperes and not kilowatts? A cable or transformer carries all the current, also a part that motors and electronics only push back and forth. That total is the apparent power.' },
    { nl: 'Het nuttige deel is het vermogen in kilowatt. De verhouding tussen de twee is de {t:Arbeidsfactor|arbeidsfactor}, of cos phi. Voor woningen meestal {n:0.9} tot {n:1}.',
      en: 'The useful part is the power in kilowatts. The ratio of the two is the {t:Power factor|power factor}, or cos phi. For homes usually {n:0.9} to {n:1}.' },
    { nl: 'Een transformator van {n:400} kilovoltampère levert dus zo’n {n:360} tot {n:400} kilowatt.',
      en: 'So a {n:400} kilovolt ampere transformer delivers about {n:360} to {n:400} kilowatts.' },
  ],
  [ // s7 a cold evening
    { nl: 'Nu krijgen {n:50} woningen een warmtepomp van {n:3} kilowatt. Op een koude avond draaien ze allemaal tegelijk: een gelijktijdigheid van bijna één. Elk draait op zo’n {n:80} procent: samen {n:120} kilovoltampère erbij.',
      en: 'Now {n:50} homes get a {n:3} kilowatt heat pump. On a cold evening they all run at once: a simultaneity close to one. Each runs at about {n:80} percent: together {n:120} kilovolt amperes more.' },
    { nl: 'En {n:40} woningen laden na het werk een auto op {n:11} kilowatt, zo’n {n:30} procent tegelijk. Nog eens {n:132} kilovoltampère.',
      en: 'And {n:40} homes charge a car at {n:11} kilowatts after work, about {n:30} percent at the same moment. Another {n:132} kilovolt amperes.' },
    { nl: 'De nieuwe piek: {n:225} plus {n:120} plus {n:132} is {n:477} kilovoltampère. Dat is {n:119} procent van de transformator.',
      en: 'The new peak: {n:225} plus {n:120} plus {n:132} is {n:477} kilovolt amperes. That is {n:119} percent of the transformer.' },
    { nl: 'Het jaarverbruik groeit veel minder hard, maar de piek wordt meer dan twee keer zo hoog.',
      en: 'The yearly energy grows far less, but the peak more than doubles.' },
  ],
  [ // s8 a sunny noon
    { nl: 'Op een zonnige middag komt er een piek de andere kant op: alle daken leveren tegelijk terug.',
      en: 'At midday on a sunny day a peak comes the other way: every roof feeds power back at the same time.' },
    { nl: 'De {t:Omvormer|omvormer} zet de gelijkstroom van de panelen om naar wisselstroom. Vaak hangt dat kastje op zolder of in de garage; hier buiten aan de zijgevel.',
      en: 'The {t:Inverter|inverter} turns the panels’ direct current into alternating current. That box often hangs in the attic or garage; here outside on the end wall.' },
    { nl: 'Al die teruglevering duwt de spanning omhoog, het meest aan het eind van een lange kabel.',
      en: 'All that feed-in pushes the voltage up, most at the end of a long cable.' },
    { nl: 'Boven zo’n {n:253} volt, de Europese bovengrens van {n:230} volt plus {n:10} procent, schakelt de omvormer af. Panelen die steeds uitvallen zijn dus vaak een spanningsprobleem, geen kapotte omvormer.',
      en: 'Above about {n:253} volts, the European upper limit of {n:230} volts plus {n:10} percent, the inverter switches off. Panels that keep dropping out are often a voltage problem, not a broken inverter.' },
  ],
  [ // s9 the sharp question
    { nl: 'Waar experts over discussiëren: de gelijktijdigheid van warmtepompen en laadpalen.',
      en: 'What experts argue about: the simultaneity of heat pumps and chargers.' },
    { nl: 'Reken je te laag, dan raakt het net overbelast in de eerste koude week. Reken je te hoog, dan gaan straten jaren te vroeg open.',
      en: 'Assume too low, and the grid overloads in the first cold week. Too high, and streets are dug up years too early.' },
    { nl: 'Slim laden spreidt het laden van auto’s over de nacht en kan de piek flink verlagen, maar alleen als mensen het toestaan.',
      en: 'Smart charging, which spreads car charging over the night, can cut the peak a lot. But only if people allow it.' },
    { nl: 'Vraag dus altijd: op welke gelijktijdigheid is dit plan gebaseerd, en waar komt dat getal vandaan?',
      en: 'So always ask: which simultaneity is this plan based on, and where does that number come from?' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
{
  const resolved = resolveFilm(spec, await allLessons());
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
  });
}
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.ws-road{fill:var(--anatomy-shade-1);stroke:none}
.ws-glass{fill:var(--anatomy-shade-0);stroke:none}
.ws-well{fill:var(--anatomy-shade-0);stroke:none}
.ws-pv{fill:var(--anatomy-shade-2);stroke:none}
[data-cue][data-on] .ws-pv{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-shade-2))}
.ws-flow{fill:none;stroke:var(--fp-accent);stroke-width:1.3px;stroke-dasharray:3 6;stroke-linecap:round;opacity:0;vector-effect:non-scaling-stroke}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.mf-l2{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-dasharray:9 5;stroke-linecap:round}
.mf-l3{fill:none;stroke:var(--anatomy-lo);stroke-width:2.2;stroke-dasharray:2 5;stroke-linecap:round}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-hollow{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.mf-water{fill:color-mix(in srgb,var(--anatomy-mid) 22%,transparent);stroke:none}
.mf-home{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-homeOn{fill:var(--fp-accent);stroke:none}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.fp-meter[data-alt]{fill:var(--anatomy-lo)}
[data-cue][data-on] .mf-line,[data-cue][data-on] .mf-l2,[data-cue][data-on] .mf-l3{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .mf-tile{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .mf-water{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent)}
`;

const label = {
  nl: 'Een straat op een maquette: drie rijtjeshuizen met zonnepanelen, meterkasten, een warmtepomp, een omvormer, een auto aan een laadpaal en een lantaarnpaal, en aan het eind een netstation met open deuren, de transformator en het laagspanningsrek. De straatkabel loopt langs de stoep met een aftakking naar elk huis. Kaarten tonen de waterleiding als vergelijking, vermogen en energie van een waterkoker, drie fasen, de dag van één huis, de 150 woningen van het netstation, de arbeidsfactor, de winteravond met warmtepompen en auto’s, de spanning langs de kabel op een zonnige middag en slim laden.',
  en: 'A street on a model board: three terraced houses with solar panels, meter boxes, a heat pump, an inverter, a car at a charge point and a street lamp, and at the end a distribution substation with open doors, its transformer and LV rack. The street cable runs along the pavement with a branch to each house. Cards show the water-pipe analogy, a kettle’s power and energy, three phases, one home’s day, the 150 homes on the distribution substation, the power factor, the winter evening with heat pumps and cars, the voltage along the cable at midday on a sunny day, and smart charging.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

// Dev tool, not shipped. Builds the explainer film "Een storing in de meldkamer /
// An outage in the control room" for the grid module Netbedrijf en
// assetmanagement: the level 1 lesson of its topic Storingen en assetrisico,
// eng.gridops.outage ("Een storing afhandelen").
//
//   node films/eng.gridops.outage/build.mjs            build the page
//   node films/eng.gridops.outage/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.gridops.outage.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.gridops.outage). The plan row lists the lesson "outage"; the id
// eng.gridops.outage still exists after the topics x levels rebuild (level 1
// of the topic outage), so no mapping was needed. The level 2 lesson
// eng.gridops.control (dispatch, triage, compensation) is not served.
//
// Lessons with a film no longer show their worked example (v16), so the film
// carries every point of the lesson's teach text AND its worked example
// (07:40, 12 stations, 1.800 customers, indicators 1 to 5, not 6, technician
// at 08:15, open point in station 12, the two switches either side of the
// faulty cable, the feeder back in, the check on the neighbouring ring, the
// open point closed, 1.800 × 50 = 90.000 customer minutes, nobody waits for
// the repair).
//
// Two drawings, each with its own camera, both reused from earlier grid films:
// - the street of films/eng.gridbasics.load (three terraced houses with meter
//   boxes, a heat pump and solar panels, the netstation with its doors open, its
//   transformer and LV rack, the street cable with its joints and branches, a
//   street lamp), here with a remote sensor on the LV rack and the customers'
//   calls rising over the front doors;
// - the secondary substation of films/eng.switchgear.devices (the RMU with its
//   three panels, mimic blades, sockets, gauge and padlock, the transformer and
//   the cable), here with a fault indicator (kortsluitverklikker) on each ring
//   panel's fascia that turns petrol when fault current has passed.
// Cards in stage space: the control room's SCADA view of the ring (12
// stations, the feeder breaker, the open point to the neighbouring ring, the
// indicators, the fault and the switching; a "voorbeeld"), the LV notes, the
// restoration times and customer minutes, the repair, and SAIFI × CAIDI =
// SAIDI with the Dutch 2025 figures.
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
// Asserted against the lesson's text and worked example (the build fails if a
// value drifts); {n:...} numbers are then checked against the Dutch lesson text
// by defineFilm. Facts checked against:
// - Dutch MV distribution: 10 and 20 kV cable rings out of HV/MV substations,
//   run open at a normally open point, each half radial (Netbeheer Nederland;
//   Liander, Stedin and Enexis network descriptions; the grid modules'
//   lessons say the same).
// - Fault passage indicators: they flag (and in newer stations report
//   remotely) that fault current passed; with a radially fed ring the fault lies
//   between the last flagged and the first unflagged station. Not every
//   indicator sees every earth fault, so "kleine indicatoren" and the lesson's
//   own wording are used, with no claim that they never miss.
// - Without indicators, sectioning: open the ring halfway, try to re-energise
//   (proefinschakelen), halve again; slower and each try switches onto the
//   fault again. Said hedged, as "dat kost meer tijd".
// - Switching programme: the control room gives the switching instructions
//   step by step and the technician confirms each step (the schakelbevoegdheid
//   of NEN 3140 / NEN-EN 50110 and BEI-BLS); said as "meestal".
// - Restoration: manual switching typically 1 to 2 hours, remotely switched
//   stations minutes; repair often a day (the lesson's figures, hedged with
//   "meestal", "kan" and "vaak").
// - SAIDI 2025, unplanned: 23,4 min = 0,316 interruptions × 73,9 min
//   (Netbeheer Nederland, Betrouwbaarheid van elektriciteitsnetten in Nederland,
//   Resultaten 2025, 1 April 2026), planned work 27,2 min on top; the lesson's
//   figures since v175, as in films/eng.gridbasics.congestion (2024 was 23,9
//   and 23,3).
// - The five safety rules word for word as in eng.gridops and the switchgear
//   film (NEN-EN 50110-1): vrijschakelen, beveiligen tegen herinschakelen,
//   spanningsloosheid vaststellen, aarden en kortsluiten, naastgelegen delen
//   onder spanning afschermen.
const OUT = 'eng.gridops.outage';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const l = lessons.nl.get(OUT);
  const t = l.teach.join('\n');
  assert(t.includes('10 of 20 kV') && t.includes('binnen seconden in SCADA'), 'MV 10 or 20 kV, SCADA within seconds');
  assert(t.includes('400/230 V') && t.includes('nauwelijks gemeten') && t.includes('landelijke storingsnummer'), 'LV barely measured, outage number');
  assert(t.includes('Elke minuut voordat je het weet') && t.includes('goedkoop voor één station, duur voor tienduizenden'), 'every minute, sensors');
  assert(t.includes('als ring gebouwd maar worden open bedreven') && t.includes('reserveroute'), 'ring run open');
  assert(t.includes('tussen het laatste station dat aansprak en het eerste dat niet aansprak'), 'the fault between last lit and first unlit');
  assert(t.includes('binnen één tot twee uur') && t.includes('dat minuten') && t.includes('één of twee moffen') && t.includes('vaak een dag') && t.includes('geen reserve'), 'restore and repair');
  assert(t.includes('SAIDI = SAIFI × CAIDI') && t.includes('In 2025') && t.includes('23,4 minuten: 0,316 onderbrekingen van gemiddeld 73,9 minuten') && t.includes('met 27,2 minuten bovenop'), 'SAIDI 2025');
  assert(t.includes('één lange streng op het platteland'), 'the rural feeder');
  const x = l.example.text;
  assert(x.includes('Om 07:40') && x.includes('12 MS-stations') && x.includes('1.800 klanten') && x.includes('station 1 tot en met 5, niet in station 6'), 'the example: trip, ring, indicators');
  assert(x.includes('Station 12 heeft een normaal openpunt') && x.includes('om 08:15 ter plaatse'), 'the example: open point, technician');
  assert(x.includes('in station 5 de schakelaar richting 6, en in station 6 die richting 5') && x.includes('ochtendbelasting'), 'the example: switching');
  assert(x.includes('gemiddeld 50 minuten') && x.includes('90.000 klantminuten') && x.includes('Niemand wacht op de reparatie'), 'the example: customer minutes');
  const nop = l.terms.find((d) => d.term === 'Normaal openpunt');
  assert(nop && nop.def === 'De schakelaar in een MS-ring die openstaat; je sluit hem om een deel van de andere kant te voeden.', 'the open point as defined in the grid modules');
}
const STATIONS = 12;
const CUST = 1800;
const AVG = 50;
const CMIN = CUST * AVG;
assert(CMIN === 90000, '1.800 × 50 = 90.000');
const LIT = 5; // indicators lit in 1..5, not in 6
const NOP = 12;
const SAIFI = 0.316;
const CAIDI = 73.9;
const SAIDI = 23.4;
const PLANNED = 27.2;
assert(Math.round(SAIFI * CAIDI * 10) / 10 === SAIDI, '0,316 × 73,9 = 23,4 (23,35, to one decimal)');
assert(near(CUST / STATIONS, 150, 1e-9), '150 customers per station (the card shows customers off supply per station)');

const W = 640;
const H = 400;

// ---------------------------------------------------------------- drawing 1: the street (after films/eng.gridbasics.load)
// World units are decimetres, z up, x along the street, +y toward the viewer.
function worldA() {
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
    post('tr.hv', bx, TANK.y + 3, 0.9, TANK_Z[1] + 1, TANK_Z[1] + 5.4, { tone: 'hi' }, { steps: 10 });
  }
  for (const bx of [TANK.x + 3, TANK.x + 6, TANK.x + 9, TANK.x + 12]) {
    post('tr.lv', bx, TANK.y + 8, 0.7, TANK_Z[1] + 1, TANK_Z[1] + 3.6, { tone: 'hi' }, { steps: 8 });
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

// a remote sensor in the netstation: a small box on the LV rack with a status light (cue: station)
{
  const fy = RACK.y + RACK.d;
  box('kiosk.sensor', { x: RACK.x + 1.5, y: fy, w: 8, d: 1.2, r: 0.2 }, 18.2, 20.6, { tone: 'hi' }, { steps: 1, extra: Dt([at([RACK.x + 3, fy + 1.2, 19.4])], { size: 0.45, tone: 'mid' }) });
}
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
// where the calls come from: above each front door
const calls = [0, 1, 2].map((i) => at([HOUSE.x + HW * i + 10, HOUSE.y + HOUSE.d + 2, 36]));
return { P, R, halo, at, calls };
}

// ---------------------------------------------------------------- drawing 2: the secondary substation (after films/eng.switchgear.devices)
// World units are centimetres, z up, x along the front (RMU at −x, transformer at
// +x), +y toward the viewer. The top of the station floor is z = 0.
function worldB() {
const FLOOR = -6;
const SLAB = { x: -74, y: -46, w: 226, d: 96, r: 2 };
const BASE = { x: -58, y: -33, w: 110, d: 64, r: 0.8 };
const BASE_TOP = 9;
const TANK = { x: -56, y: -31, w: 106, d: 60, r: 1 };
const TANK_TOP = 118;
const FY = TANK.y + TANK.d; // the RMU's front face
const PW = TANK.w / 3;
const PX = [0, 1, 2].map((i) => TANK.x + i * PW);
const PC = PX.map((x) => x + PW / 2);
const FASCIA = [56, 112];
const COVER = [14, 50];
const FF = FY + 0.6; // the fascia's face
const TR = { x: 74, y: -24, w: 58, d: 40, r: 1 };
const TR_Z = [5, 84];
const TRY = TR.y + TR.d;
const MIMIC = { bus: 104, top: 97, piv: 87, tee: 80, ep: 73, low: 62 };

const FIT = [
  ...k.boxCorners(SLAB, FLOOR, 0),
  ...k.boxCorners({ x: TANK.x, y: TANK.y, w: TANK.w, d: TANK.d }, 0, TANK_TOP + 4),
  ...k.boxCorners({ x: TR.x, y: TR.y, w: TR.w + 8, d: TR.d }, 0, 98),
];
const P = k.fitProjection(FIT, W, H, { pad: 16, azimuth: 66, elevation: 24 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameZ = (o) => G.frameOf(o, Zv, Y, X);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const seg2 = (pts) => 'M' + pts.map(([x, z]) => `${f1(x)} ${f1(-z)}`).join('L');

// ---------------------------------------------------------------- recorder
// Each part carries the cues of its assembly (outermost first), so a term can
// light the RMU, one panel, the ring panels' fascias, the fuse compartment, the
// gauge, the padlock, the earthing socket, the transformer or the cable.
const cuesOf = (name) => {
  if (/^rmu\.fascia0/.test(name)) return ['rmu', 'panel', 'ring'];
  if (/^rmu\.fascia1/.test(name)) return ['rmu', 'ring'];
  if (/^rmu\.cover0/.test(name)) return ['rmu', 'panel'];
  if (/^rmu\.cover2/.test(name)) return ['rmu', 'fuse'];
  if (/^rmu\.gauge/.test(name)) return ['rmu', 'gauge'];
  if (/^rmu\.lock/.test(name)) return ['rmu', 'lock'];
  if (/^rmu\.esock0/.test(name)) return ['rmu', 'earth'];
  if (/^rmu\./.test(name)) return ['rmu'];
  if (/^trafo\./.test(name)) return ['trafo'];
  if (/^cable/.test(name)) return ['cable'];
  return [];
};
const R = A.recorder(P, {});
function put(name, ref, svg, shapes, { bias = 0, attrs = '' } = {}) {
  const c = cuesOf(name);
  const body = c.slice(1).reduceRight((s, cue) => `<g data-cue="${cue}">${s}</g>`, svg);
  return R.put({ name, at: ref, bias, svg: body, shapes, attrs: (c.length ? ` data-cue="${c[0]}"` : '') + attrs });
}
const S = (paths, style) => k.solidSvg(paths, style);
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- the station floor
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(SLAB, -2), FLOOR, 2, P)}"/>`,
];
{
  const anchors = k.corners(SLAB, 5);
  const extra = L(k.planOutline(k.insetPlan(SLAB, 3), 0, P, 3), { tone: 'faint' })
    + L(anchors.map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 })
    // the cable trench cover in front of the RMU: a plate with its seam and lifting holes
    + L(k.planOutline({ x: -54, y: 34, w: 102, d: 9, r: 0.6 }, 0, P, 2), { tone: 'lo' })
    + L([-30, -6, 18].map((x) => k.segment([x, 34, 0], [x, 43, 0], P)).join(''), { tone: 'faint' })
    + Dt([-42, -18, 6, 30].map((x) => at([x, 38.5, 0])), { size: 0.4 });
  box('floor.slab', SLAB, FLOOR, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, ground: true, inner: L(k.sideSeam(SLAB, -2.5, P, 3), { tone: 'faint' }), extra });
}

// ---------------------------------------------------------------- the RMU
{
  const bolts = [-52, -4, 46].flatMap((x) => [[x, BASE.y + 2.6], [x, BASE.y + BASE.d - 2.6]]);
  box('rmu.base', BASE, 0, BASE_TOP, { tone: 'lo' }, {
    steps: 2, bevel: 0.4,
    inner: L(k.sideSeam(BASE, 1.6, P, 2), { tone: 'faint' }),
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 1.1, BASE_TOP, P, 12)).join(''), { tone: 'lo' }) + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.45 }),
  });
}
{
  // the tank: panel seams down its front, a weld seam round its top, lifting eyes on the lid
  const seams = PX.slice(1).map((x) => k.segment([x, FY, BASE_TOP + 1], [x, FY, TANK_TOP - 1], P)).join('');
  box('rmu.tank', TANK, BASE_TOP, TANK_TOP, { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(seams, { tone: 'lo' }) + L(k.sideSeam(TANK, TANK_TOP - 3, P, 2), { tone: 'faint' }) });
  const lid = { x: TANK.x - 1, y: TANK.y - 1, w: TANK.w + 2, d: TANK.d + 2, r: 1 };
  box('rmu.lid', lid, TANK_TOP, TANK_TOP + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: L(k.planOutline(k.insetPlan(lid, 3), TANK_TOP + 3, P, 2), { tone: 'faint' }) + Dt(k.corners(lid, 2).map(([x, y]) => at([x, y, TANK_TOP + 3])), { size: 0.45 }) });
  for (const x of [TANK.x + 10, TANK.x + TANK.w - 10]) {
    box('rmu.eye', { x: x - 2, y: -2, w: 4, d: 4, r: 0.4 }, TANK_TOP + 3, TANK_TOP + 6, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra: L(k.ring(x, 0, 1, TANK_TOP + 6, P, 12), { tone: 'lo' }) });
  }
}
// per panel: the lower cover (cable compartment; the fuse compartment in the
// transformer panel), the fascia with its part of the mimic, and the sockets
const blades = [];
for (let i = 0; i < 3; i++) {
  const x0 = PX[i] + 2.2;
  const x1 = PX[i] + PW - 2.2;
  const cx = PC[i];
  {
    const plan = { x: x0, y: FY, w: x1 - x0, d: 1.2, r: 0.5 };
    const fy = FY + 1.2;
    const pts = [[x0 + 1.3, COVER[0] + 1.3], [x1 - 1.3, COVER[0] + 1.3], [x0 + 1.3, COVER[1] - 1.3], [x1 - 1.3, COVER[1] - 1.3]].map(([x, z]) => at([x, fy, z]));
    let face = '';
    if (i === 2) {
      // three inspection windows, one per fuse
      face += [-7, 0, 7].map((dx) => `<path class="mf-glass" d="${flatRect(cx + dx - 1.6, 30, cx + dx + 1.6, 42, 0.8, 3)}"/><path class="iso-line" data-tone="lo" d="${flatRect(cx + dx - 1.6, 30, cx + dx + 1.6, 42, 0.8, 3)}"/>`).join('');
    } else {
      // the cable-test sockets cover and its label
      face += `<path class="mf-card" d="${flatRect(cx - 7, 36, cx + 7, 42, 0.5, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(cx - 5.5)} ${-40.2}H${f1(cx + 4)}M${f1(cx - 5.5)} ${-38.2}H${f1(cx + 1)}"/>`;
    }
    // the warning triangle
    face += `<path class="mf-card" d="M${f1(cx)} ${-27}L${f1(cx + 3.4)} ${-21.2}L${f1(cx - 3.4)} ${-21.2}Z"/><path class="iso-line" data-tone="mid" d="M${f1(cx + 0.4)} ${-25.6}L${f1(cx - 0.6)} ${-23.8}L${f1(cx + 0.6)} ${-23.6}L${f1(cx - 0.4)} ${-22}"/>`;
    box(`rmu.cover${i}`, plan, COVER[0], COVER[1], { tone: 'hi' }, {
      steps: 2, bevel: 0.25,
      extra: `<g transform="${planeOf(fy)}">${face}</g>` + Dt(pts, { size: 0.42, tone: 'mid' }),
    });
  }
  {
    const plan = { x: x0, y: FY, w: x1 - x0, d: 0.6, r: 0.4 };
    const m = MIMIC;
    const ex = cx + 6.5;
    let mim = `M${f1(x0 + 0.8)} ${-m.bus}H${f1(x1 - 0.8)}M${f1(cx)} ${-m.bus}V${-m.top}M${f1(cx)} ${-m.piv}V${-m.ep + 0.5}`;
    mim += `M${f1(cx)} ${-m.tee}H${f1(ex)}M${f1(ex)} ${-(m.ep - 3)}V${-(m.ep - 4.5)}M${f1(ex - 2.4)} ${-(m.ep - 4.5)}H${f1(ex + 2.4)}M${f1(ex - 1.5)} ${-(m.ep - 5.5)}H${f1(ex + 1.5)}M${f1(ex - 0.6)} ${-(m.ep - 6.5)}H${f1(ex + 0.6)}`;
    if (i === 2) mim += `M${f1(cx)} ${-(m.ep - 0.5)}V${-(m.ep - 2)}M${f1(cx)} ${-(m.ep - 8)}V${-(m.low + 2)}`;
    else mim += `M${f1(cx)} ${-(m.ep - 0.5)}V${-(m.low + 1)}M${f1(cx - 2)} ${-(m.low + 3)}L${f1(cx)} ${-(m.low + 0.6)}L${f1(cx + 2)} ${-(m.low + 3)}`;
    let face = `<path class="iso-line" data-tone="mid" d="${mim}"/>`;
    face += [cx, ex].map((x, j) => `<circle class="mf-pivot" cx="${f1(x)}" cy="${f1(-(j ? m.ep - 3 : m.piv))}" r="0.7"/>`).join('');
    if (i === 2) face += `<path class="mf-card" d="${flatRect(cx - 1.4, m.ep - 8, cx + 1.4, m.ep - 2, 0.3, 2)}"/><path class="iso-line" data-tone="mid" d="${flatRect(cx - 1.4, m.ep - 8, cx + 1.4, m.ep - 2, 0.3, 2)}"/>`
      + `<circle class="iso-line" data-tone="mid" fill="none" cx="${f1(cx)}" cy="${-(m.low + 0.4)}" r="1.6"/><circle class="iso-line" data-tone="mid" fill="none" cx="${f1(cx)}" cy="${-(m.low - 1.8)}" r="1.6"/>`;
    face += `<path class="mf-blade" data-k="sw${i}" d=""/><path class="mf-blade" data-k="ea${i}" d=""/>`;
    // the fault indicator (kortsluitverklikker) of each ring panel: a bezel, a window and a flag that turns
    // petrol when fault current has passed; a test button under it
    if (i < 2) {
      const fx = cx - 10;
      face += `<g data-cue="fpi"><circle class="mf-dial" cx="${f1(fx)}" cy="-97" r="2.6"/><circle class="mf-fpi" data-k="fpi${i}" cx="${f1(fx)}" cy="-97" r="1.6"/><circle class="mf-pivot" cx="${f1(fx)}" cy="-92.6" r="0.6"/></g>`;
    }
    // the panel's name plate at the top of the fascia
    face += `<path class="mf-card" d="${flatRect(x0 + 2, 107.4, x1 - 2, 110.6, 0.4, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(x0 + 3.4)} -109H${f1(x1 - 9)}"/>`;
    blades.push({ cx, ex });
    box(`rmu.fascia${i}`, plan, FASCIA[0], FASCIA[1], { tone: 'mid' }, {
      steps: 2, bevel: 0.2,
      extra: `<g transform="${planeOf(FF)}">${face}</g>` + Dt([[x0 + 1, FF, FASCIA[0] + 1], [x1 - 1, FF, FASCIA[0] + 1], [x0 + 1, FF, FASCIA[1] - 1], [x1 - 1, FF, FASCIA[1] - 1]].map(at), { size: 0.38, tone: 'mid' }),
    });
  }
  // the operating sockets: the switch (left) and the earthing switch (right), each a collar with a dark hole
  for (const [kind, dx] of [['sock', -6], ['esock', 6]]) {
    const F = frameY([cx + dx, FF, 64.5]);
    discAt(`rmu.${kind}${i}`, F, 0, 1.4, 2.3, { tone: 'mid' }, { steps: 14, extra: `<path class="mf-well" d="${G.circleOf(F, 1.4, 1.1, P, 12)}"/>` + Dt([at([cx + dx, FF + 1.4, 64.5 + 1.7])], { size: 0.3, tone: 'hi' }) });
  }
}
// the padlock on panel 1's switch socket (the padlock: a body and its shackle)
{
  const cx = PC[0] - 6;
  box('rmu.lock', { x: cx - 1.6, y: FF, w: 3.2, d: 3, r: 0.4 }, 58.6, 61.6, { tone: 'hi' }, {
    steps: 2, bevel: 0.15,
    extra: L(k.segment([cx - 1, FF + 2.2, 61.6], [cx - 1, FF + 2.2, 62.6], P) + k.segment([cx + 1, FF + 2.2, 61.6], [cx + 1, FF + 2.2, 62.6], P) + k.segment([cx - 1, FF + 2.2, 62.6], [cx + 1, FF + 2.2, 62.6], P), { tone: 'mid' })
      + Dt([at([cx, FF + 3, 60])], { size: 0.32, tone: 'lo' }),
  });
}
// the pressure gauge on panel 2's fascia: a bezel, its dial with a green band and the needle
{
  const cx = PC[1];
  const F = frameY([cx, FF, 100]);
  const dial = [];
  for (let j = 0; j <= 8; j++) {
    const a = -2.2 + (4.4 * j) / 8;
    dial.push(`M${f1(cx + 2.5 * Math.sin(a))} ${f1(-(100 + 2.5 * Math.cos(a)))}L${f1(cx + 2.9 * Math.sin(a))} ${f1(-(100 + 2.9 * Math.cos(a)))}`);
  }
  const band = [];
  for (let a = 0.3; a <= 2.2; a += 0.19) band.push([cx + 2.75 * Math.sin(a), -(100 + 2.75 * Math.cos(a))]);
  discAt('rmu.gauge', F, 0, 1.2, 3.4, { tone: 'mid' }, {
    steps: 28,
    extra: `<g transform="${planeOf(FF + 1.25)}"><circle class="mf-dial" cx="${f1(cx)}" cy="-100" r="3.05"/><path class="iso-line" data-tone="lo" d="${dial.join('')}"/><path class="mf-band2" d="M${band.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}"/><path class="mf-needle" data-k="needle" d="M${f1(cx)} -100L${f1(cx + 2.3 * Math.sin(1.1))} ${f1(-(100 + 2.3 * Math.cos(1.1)))}"/><circle class="mf-pivot" cx="${f1(cx)}" cy="-100" r="0.5"/></g>`,
  });
}
// the RMU's rating plate on the lid's front edge area
{
  const x0 = PC[2] - 9;
  box('rmu.plate', { x: x0, y: FY, w: 18, d: 0.4, r: 0.2 }, 113, 116.4, { tone: 'hi' }, {
    steps: 2,
    extra: L([115.4, 114.2].map((z, j) => k.segment([x0 + 1.2, FY + 0.4, z], [x0 + 18 - [2, 6][j], FY + 0.4, z], P)).join(''), { tone: 'lo', free: true }),
  });
}
// the cable gland on the RMU's side
const GL = [TANK.x + TANK.w, -6, 30];
discAt('rmu.gland', frameX(GL), 0, 2.4, 2.4, { tone: 'mid' }, { steps: 6 });

// ---------------------------------------------------------------- the transformer
for (const y of [TR.y - 2, TR.y + TR.d - 3]) {
  box('trafo.skid', { x: TR.x - 2, y, w: TR.w + 4, d: 5, r: 0.4 }, 0, TR_Z[0], { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt([at([TR.x + 2, y + 2.5, TR_Z[0]]), at([TR.x + TR.w - 2, y + 2.5, TR_Z[0]])], { size: 0.45 }) });
}
box('trafo.tank', TR, TR_Z[0], TR_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(TR, TR_Z[1] - 3, P, 2) + k.sideSeam(TR, TR_Z[0] + 4, P, 2), { tone: 'faint' }) });
{
  const lid = { x: TR.x - 1, y: TR.y - 1, w: TR.w + 2, d: TR.d + 2, r: 1 };
  const bolts = [];
  for (let j = 0; j < 7; j++) bolts.push([lid.x + 3 + (j * (lid.w - 6)) / 6, lid.y + lid.d - 1.4]);
  box('trafo.lid', lid, TR_Z[1], TR_Z[1] + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, TR_Z[1] + 3])), { size: 0.4 }) });
}
// cooling fins on the front and on the +x side
for (let j = 0; j < 7; j++) box('trafo.fin', { x: TR.x + 4 + j * 8.1, y: TRY, w: 1.4, d: 8, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
for (let j = 0; j < 4; j++) box('trafo.fin', { x: TR.x + TR.w, y: TR.y + 4 + j * 10.4, w: 8, d: 1.4, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
// three LV bushings and the neutral on the lid
for (const [j, x] of [92, 102, 112, 122].entries()) {
  const y = 4;
  const z0 = TR_Z[1] + 3;
  // the porcelain body (plain here, to keep the page small; the switchgear film turns its sheds) and the stud
  post('trafo.bush', x, y, 1.9, z0, z0 + 7, { tone: 'hi' }, { steps: 14, extra: Dt([at([x, y, z0 + 7])], { size: 0.5, tone: 'mid' }) });
  if (j === 3) box('trafo.n', { x: x + 2.6, y: y - 1.2, w: 2.4, d: 2.4, r: 0.3 }, z0, z0 + 0.6, { tone: 'lo' }, { steps: 1 });
}
// the oil filling plug, the tap changer knob and the rating plate on the lid
post('trafo.plug', 82, -14, 2.2, TR_Z[1] + 3, TR_Z[1] + 5, { tone: 'mid' }, { steps: 6, extra: Dt([at([82, -14, TR_Z[1] + 5])], { size: 0.4, tone: 'hi' }) });
post('trafo.tap', 82, 6, 3, TR_Z[1] + 3, TR_Z[1] + 4.6, { tone: 'mid' }, { steps: 22, extra: L(k.segment([79.6, 6, TR_Z[1] + 4.6], [84.4, 6, TR_Z[1] + 4.6], P), { tone: 'lo' }) });
// the MV plug-in bushing on the transformer's −x side, where the cable lands
const TB = [TR.x, -6, 56];
discAt('trafo.mvplug', frameX(TB), -3, 0, 2.6, { tone: 'mid' }, { steps: 20 });

// ---------------------------------------------------------------- the MV cable from the RMU to the transformer
{
  const r = 1.3;
  const start = [GL[0] + 2.4, GL[1], GL[2]];
  const end = [TB[0] - 3, TB[1], TB[2]];
  const mid = 64;
  const route = G.fillet([start, [mid, GL[1], GL[2]], [mid, GL[1], TB[2]], end], 5, 9, { P, tube: r });
  R.route('cable', route, r, {});
  T.tubePieces(route, r, P, { maxLength: 30, spacing: 1 }).forEach((piece, i) => {
    put(`cable:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'lo' }), [A.tube(piece.points, piece.radii, { name: 'cable' })], { bias: 0.05 });
  });
}
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
return { P, R, halo, at, blades, MIMIC, FF, PC, PW, FY };
}


// ---------------------------------------------------------------- assemble the two drawings
const wa = worldA();
const wb = worldB();
const itemsOf = (w) => [...w.halo, ...w.R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`)].join('');
// the customers' calls over the front doors: a speech bubble with a handset, in the street's own space
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const bubble = ([x, y], i) => `<g data-k="call${i}"><path class="mf-bub" d="M${f1(x - 7)} ${f1(y - 12)}h14a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-6l-4 4v-4h-4a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z"/>`
  + `<path class="mf-hand" d="M${f1(x - 4.2)} ${f1(y - 9.6)}q-1 4 3.2 7.6q2.6 1.6 4.6 0.6l-1.6 -2.2q-1.2 0.6 -2.4 -0.4q-1.8 -1.6 -2 -3.4q0 -1 1 -1.4l-0.8 -2.4q-1.2 0 -2 1.6z"/></g>`;
const worldAsvg = itemsOf(wa) + `<g data-cue="calls">${wa.calls.map(bubble).join('')}</g>`;
const worldBsvg = itemsOf(wb);

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('ls', g('lsIn', '')),
  g('tag', g('tgIn', '')),
  g('ring', g('rgBase', '') + cue('bvc', g('rgHead', '')) + g('rgNet', '') + cue('cb', g('rgCb', '')) + cue('nop', g('rgNop', '')) + cue('fpi', g('rgFpi', '')) + g('rgTxt', '')),
  g('tm', g('tmBase', '') + g('tmIn', '')),
  g('sd', g('sdBase', '') + cue('saifi', g('sdF', '')) + cue('caidi', g('sdC', '')) + cue('saidi', g('sdD', '')) + g('sdTxt', '')),
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

const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('worldA', worldAsvg)}${g('worldB', worldBsvg, ' style="display:none"')}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(w, p, v, sx): in drawing w, world point p lands at stage x sx (default the centre) in a view v wide
const camOf = (wd, p, v, sx = W / 2) => { const [x, y] = wd.at(p); return [Math.round((x + (W / 2 - sx) * (v / W)) * 10) / 10, Math.round(y * 10) / 10, v]; };
const MID = [64, -20, 20];
const STREET = [62, -24, 26];
const RMU_C = [wb.PC[1], wb.FY, 62];
const FPI_C = [wb.PC[0] + wb.PW / 2, wb.FY, 86];
const CAM = [
  { w: 'A', from: camOf(wa, MID, 660), to: camOf(wa, MID, 600), a: 0, b: 0.3 },
  { w: 'A', from: camOf(wa, STREET, 470, 200), to: camOf(wa, STREET, 430, 200) },
  { w: 'A', from: camOf(wa, MID, 600), to: camOf(wa, MID, 600) },
  { w: 'B', from: camOf(wb, RMU_C, 700), to: camOf(wb, FPI_C, 214), a: 0.12, b: 0.3 },
  { w: 'B', from: camOf(wb, FPI_C, 214), to: camOf(wb, FPI_C, 204) },
  { w: 'A', from: camOf(wa, MID, 600), to: camOf(wa, MID, 600) },
  { w: 'A', from: camOf(wa, MID, 600), to: camOf(wa, MID, 600) },
];

// ---------------------------------------------------------------- the film
const DUR = [38, 40, 30, 44, 50, 50, 44];
const C = { STATIONS, CUST, AVG, CMIN, LIT, NOP, SAIFI, CAIDI, SAIDI, PLANNED, MIMIC: wb.MIMIC, blades: wb.blades, dur: DUR };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: OUT,
  title: { nl: 'Een storing in de meldkamer', en: 'An outage in the control room' },
  lessons: [OUT],
  scenes: [
    {
      id: 's1', lesson: OUT, level: 1, dur: DUR[0], still: 0.92, title: { nl: 'Een veld valt uit', en: 'A feeder trips' },
      beats: [
        B('Onder de straat: MS-kabels van {n:10} of {n:20} kV, langs een rij netstations.', 'Under the street: MV cables of {n:10} or {n:20} kV, past a row of secondary substations.', { cues: ['station'] }),
        B('07:40: een fout. De vermogensschakelaar van het veld in het onderstation valt eruit.', '07:40: a fault. The feeder breaker in the substation opens.', { cues: ['cb'] }),
        B('Het {t:Bedrijfsvoeringscentrum|bedrijfsvoeringscentrum} ziet het binnen seconden in SCADA.', 'The {t:Control room|control room} sees it within seconds in SCADA.', { cue: { Bedrijfsvoeringscentrum: 'bvc' } }),
        B('Achter dat veld: {n:12} netstations en {n:1800} klanten, allemaal zonder stroom.', 'Behind that feeder: {n:12} secondary substations and {n:1800} customers, all off supply.', { cues: [] }),
      ],
    },
    {
      id: 's2', lesson: OUT, level: 1, dur: DUR[1], still: 0.92, title: { nl: 'Laagspanning', en: 'Low voltage' },
      beats: [
        B('Het laagspanningsnet in de straat, {n:400}/{n:230} V, wordt nauwelijks gemeten.', 'The low-voltage grid in the street, {n:400}/{n:230} V, is barely measured.', { cues: ['cable'] }),
        B('Een LS-storing merk je vaak pas als klanten bellen, of via slimme meters en sensoren.', 'You often hear of an LV fault only when customers call, or from smart meters and sensors.', { cues: ['calls', 'meter', 'station'] }),
        B('Elke minuut voordat je het weet, telt mee in de storingsduur.', 'Every minute before you know counts in the outage time.', { cues: [] }),
        B('Vraag: hoe horen we nu van een LS-storing, en hoe lang duurt dat?', 'Ask: how do we find out about an LV fault today, and how long does that take?', { cues: [] }),
      ],
    },
    {
      id: 's3', lesson: OUT, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Een ring, open bedreven', en: 'A ring, run open' },
      beats: [
        B('MS-netten zijn als ring gebouwd, maar worden open bedreven.', 'MV grids are built as rings, but run open.', { cues: [] }),
        B('Het {t:Normaal openpunt|normaal openpunt}: de schakelaar die openstaat, hier in station {n:12}.', 'The {t:Normally open point|normally open point}: the switch kept open, here in station {n:12}.', { cue: { 'Normaal openpunt': 'nop' } }),
        B('Zo blijven kortsluitstromen en beveiliging eenvoudig, met een reserveroute achter de hand.', 'That keeps fault currents and protection simple, with a backup route in hand.', { cues: ['nop'] }),
      ],
    },
    {
      id: 's4', lesson: OUT, level: 1, dur: DUR[3], still: 0.92, title: { nl: 'Waar zit de fout?', en: 'Where is the fault?' },
      beats: [
        B('08:15: de storingsmonteur is ter plaatse en zoekt samen met het centrum de fout.', '08:15: the fault technician is on site and looks for the fault with the control room.', { cues: ['rmu'] }),
        B('Elk station heeft {t:Kortsluitverklikker|kortsluitverklikkers}: ze tonen of er kortsluitstroom langs kwam.', 'Each station has {t:Fault indicator|fault indicators}: they show whether fault current passed.', { cue: { Kortsluitverklikker: 'fpi' } }),
        B('Aangesproken in station {n:1} tot en met {n:5}, niet in station {n:6}.', 'Triggered in stations {n:1} to {n:5}, not in station {n:6}.', { cues: ['fpi'] }),
        B('De fout zit tussen het laatste station dat aansprak en het eerste dat niet aansprak.', 'The fault lies between the last station that flagged and the first that did not.', { cues: [] }),
      ],
    },
    {
      id: 's5', lesson: OUT, level: 1, dur: DUR[4], still: 0.92, title: { nl: 'Om de fout heen', en: 'Around the fault' },
      beats: [
        B('In station {n:5} de lastscheider richting {n:6} open, en in {n:6} die richting {n:5}.', 'In station {n:5} the load-break switch towards {n:6} opens, and in {n:6} the one towards {n:5}.', { cues: ['ring'] }),
        B('Het veld gaat weer in: station {n:1} tot en met {n:5} zijn terug.', 'The feeder breaker recloses: stations {n:1} to {n:5} are back.', { cues: ['cb'] }),
        B('Eerst controleren dat de naburige ring de ochtendbelasting aankan.', 'First check that the neighbouring ring can carry the morning load.', { cues: [] }),
        B('Dan het normaal openpunt in station {n:12} dicht: ook {n:6} tot en met {n:12} zijn terug.', 'Then the normally open point in station {n:12} closes: stations {n:6} to {n:12} are back too.', { cues: ['nop'] }),
      ],
    },
    {
      id: 's6', lesson: OUT, level: 1, dur: DUR[5], still: 0.92, title: { nl: 'Herstellen en repareren', en: 'Restoring and repairing' },
      beats: [
        B('Zo zijn de meeste klanten binnen één tot twee uur terug; op afstand bediend in minuten.', 'Most customers are back within one to two hours; with remote control, in minutes.', { cues: [] }),
        B('{n:1800} klanten, gemiddeld {n:50} minuten zonder stroom: {n:90000} klantminuten.', '{n:1800} customers, an average of {n:50} minutes off supply: {n:90000} customer minutes.', { cues: [] }),
        B('Wie binnen het vrijgeschakelde deel zit, wacht op de reparatie: zoeken, graven, moffen, testen.', 'Customers inside the isolated section wait for the repair: locate, dig, joint, test.', { cues: [] }),
        B('Dat kost vaak een dag. Zolang heeft de ring geen reserve.', 'That often takes a day. Meanwhile the ring has no backup.', { cues: [] }),
      ],
    },
    {
      id: 's7', lesson: OUT, level: 1, dur: DUR[6], still: 0.92, title: { nl: 'De cijfers per jaar', en: 'The yearly numbers' },
      beats: [
        B('{t:SAIFI|SAIFI}: het aantal onderbrekingen per klant per jaar.', '{t:SAIFI|SAIFI}: the number of interruptions per customer per year.', { cue: { SAIFI: 'saifi' } }),
        B('{t:CAIDI|CAIDI}: hoe lang één onderbreking gemiddeld duurt voor wie hem meemaakt.', '{t:CAIDI|CAIDI}: how long one interruption lasts on average for those affected.', { cue: { CAIDI: 'caidi' } }),
        B('{t:SAIDI|SAIDI} = SAIFI × CAIDI. In 2025: {n:0.316} × {n:73.9} = {n:23.4} minuten.', '{t:SAIDI|SAIDI} = SAIFI × CAIDI. In 2025: {n:0.316} × {n:73.9} = {n:23.4} minutes.', { cue: { SAIDI: 'saidi' } }),
        B('Valkuil: één lange streng op het platteland kan de SAIDI van een hele regio bepalen.', 'Pitfall: one long rural feeder can drive a whole region’s SAIDI.', { cues: ['saidi'] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and, since v16, its worked example, so this explains fully. No "/", "×",
// "=", "%" or units as symbols in the spoken text: kV and V are written out,
// times as words ("zeven uur veertig"). Terms as in the grid modules: netstation,
// onderstation, veld, vermogensschakelaar and lastscheider (the switchgear
// film), normaal openpunt with its definition word for word, kortsluitverklikker,
// bedrijfsvoeringscentrum, the five safety rules word for word as eng.gridops,
// SAIDI as "de jaarlijkse uitvalduur" (gridbasics.roles and the congestion film).
// Dutch words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/voice-ab/phon.py with nl_NL-alex-medium). Dutch-only SAY rules
// added in films/_kit/timeline.mjs: naburige (espeak-ng drops "-burige" and
// says "naa-e"; said na-burige) and vrijgeschakeld(e) (stressed "-GE-" with the
// e of "bed"; said vrij-geschakeld). Kept out of the Dutch narration:
// kortsluitstromen and foutstroom (stressed on "stroom"), storingsduur
// (stressed on "duur"), reserveroute (read "reserve-ier-oete"), HS/MS ("slash").
// Read right: bedrijfsvoeringscentrum, kortsluitverklikker(s), SCADA, SAIFI,
// CAIDI, SAIDI, openpunt, normaal openpunt, storingsmonteur, klantminuten,
// uitvalminuten, uitvalduur, meetwagen, moffen, LS-storing, ochtendbelasting,
// onderbrekingen, schakelopdrachten, netstation (existing rule), lastscheider,
// vermogensschakelaar (existing rule), vrijschakelen (existing rule).
const SAY = [
  [ // s1 a feeder trips
    B('Onder deze straat ligt het middenspanningsnet: kabels van {n:10} of {n:20} kilovolt, die vanuit een onderstation langs een rij netstations lopen. Elk netstation zet de middenspanning om naar laagspanning voor de huizen.',
      'Under this street lies the medium-voltage grid: cables of {n:10} or {n:20} kilovolts, running from a substation past a row of secondary substations. Each one steps the medium voltage down to low voltage for the homes.'),
    B('Om zeven uur veertig gaat het mis. Een kabelfout laat de beveiliging aanspreken in het onderstation, waar hoogspanning naar middenspanning gaat. De vermogensschakelaar van het veld, de grote schakelaar aan het begin van één uitgaande kabelroute, valt eruit.',
      'At seven forty it goes wrong. A cable fault trips the protection in the substation, where high voltage is stepped down to medium voltage. The feeder breaker, the big switch at the start of one outgoing cable route, opens.'),
    B('Het {t:Bedrijfsvoeringscentrum|bedrijfsvoeringscentrum} bewaakt en schakelt het net, dag en nacht. Het ziet de uitschakeling binnen seconden in SCADA, het systeem voor bewaken en bedienen op afstand.',
      'The {t:Control room|control room} watches and switches the grid around the clock. It sees the trip within seconds in SCADA, its remote monitoring and control system.'),
    B('Achter dit veld hangt een streng van {n:12} netstations, met samen {n:1800} klanten. Die zitten nu allemaal zonder stroom.',
      'Behind this feeder hang {n:12} secondary substations, with {n:1800} customers between them. They are all off supply now.'),
  ],
  [ // s2 low voltage
    B('Op laagspanning gaat het anders. Het net in de straat, {n:400} en {n:230} volt, wordt nauwelijks gemeten.',
      'Low voltage is different. The grid in the street, {n:400} and {n:230} volts, is barely measured.'),
    B('Een storing hier merk je vaak pas als klanten het landelijke storingsnummer bellen. Steeds vaker melden ook slimme meters en sensoren in de netstations dat een straat zonder spanning zit.',
      'You often notice a fault here only when customers call the national outage number. More and more, smart meters and sensors in the stations also report that a street has lost its voltage.'),
    B('En elke minuut voordat je het weet, telt mee in hoe lang de storing duurt. Hoe ver je met sensoren moet gaan, is een discussie: voor één station zijn ze goedkoop, voor tienduizenden duur.',
      'And every minute before you know counts in the outage time. How far to go with sensors is a debate: cheap for one station, expensive across tens of thousands.'),
    B('Vraag dus: hoe horen we nu van een LS-storing, en hoe lang duurt dat?',
      'So ask: how do we find out about an LV fault today, and how long does that take?'),
  ],
  [ // s3 a ring, run open
    B('Terug naar de middenspanning. MS-netten zijn als ring gebouwd, maar worden open bedreven.',
      'Back to medium voltage. MV grids are built as rings, but run open.'),
    B('Eén schakelaar staat open: het {t:Normaal openpunt|normaal openpunt}. Dat is de schakelaar in een MS-ring die openstaat; je sluit hem om een deel van de andere kant te voeden. Hier zit hij in station {n:12}, naar een naburige ring.',
      'One switch stays open: the {t:Normally open point|normally open point}. That is the switch in an MV ring that is kept open; you close it to feed a section from the other side. Here it sits in station {n:12}, towards a neighbouring ring.'),
    B('Zo wordt elke streng van één kant gevoed. Dat houdt de stromen bij een kortsluiting, en de beveiliging, eenvoudig. En je houdt een andere route achter de hand.',
      'So each feeder is fed from one side. That keeps fault currents and protection simple, while leaving a backup route.'),
  ],
  [ // s4 where is the fault
    B('Om kwart over acht is de storingsmonteur ter plaatse. Samen met het bedrijfsvoeringscentrum zoekt hij eerst waar de fout zit.',
      'At a quarter past eight the fault technician is on site. With the control room, he first finds where the fault is.'),
    B('Daarvoor hebben de netstations {t:Kortsluitverklikker|kortsluitverklikkers}: kleine indicatoren die laten zien of er kortsluitstroom langs kwam.',
      'For that, the stations have {t:Fault indicator|fault indicators}: small devices that flag whether fault current passed through.'),
    B('De verklikkers in station {n:1} tot en met {n:5} zijn aangesproken, die in station {n:6} niet. De fout trok dus stroom langs station 5, maar niet langs 6.',
      'The indicators in stations {n:1} to {n:5} have triggered, the one in station {n:6} has not. So the fault drew current past station 5, but not past 6.'),
    B('De fout zit tussen het laatste station dat aansprak en het eerste dat niet aansprak: hier in de kabel tussen 5 en 6. Zonder verklikkers moet je zoeken door stukken af te schakelen en proef in te schakelen. Dat kost meer tijd.',
      'The fault lies between the last station that flagged and the first that did not: here in the cable between 5 and 6. Without indicators you search by switching sections off and trying to re-energise them. That takes longer.'),
  ],
  [ // s5 around the fault
    B('Meestal geeft het bedrijfsvoeringscentrum de schakelopdrachten, stap voor stap, en meldt de monteur elke stap terug. Hij opent in station {n:5} de lastscheider richting {n:6}, en in station {n:6} die richting {n:5}. Het kapotte kabelstuk is nu aan beide kanten vrijgeschakeld.',
      'Usually the control room gives the switching instructions, step by step, and the technician confirms each step. He opens the load-break switch in station {n:5} towards {n:6}, and in station {n:6} the one towards {n:5}. The damaged cable section is now isolated on both sides.'),
    B('Dan gaat de vermogensschakelaar van het veld weer in. Station {n:1} tot en met {n:5} hebben weer stroom.',
      'Then the feeder breaker recloses. Stations {n:1} to {n:5} have power again.'),
    B('Voor de rest moet het normaal openpunt dicht. Eerst controleert het bedrijfsvoeringscentrum of de naburige ring de extra ochtendbelasting aankan.',
      'For the rest, the normally open point must close. First the control room checks that the neighbouring ring can carry the extra morning load.'),
    B('Dat kan, dus het openpunt in station {n:12} gaat dicht. Nu worden station {n:6} tot en met {n:12} van de andere kant gevoed. Iedereen is terug, en niemand wacht op de reparatie, want de fout zit in een kabel tussen twee stations.',
      'It can, so the open point in station {n:12} closes. Now stations {n:6} to {n:12} are fed from the other side. Everyone is back, and nobody waits for the repair, because the fault is in a cable between two stations.'),
  ],
  [ // s6 restoring and repairing
    B('Met de hand, met een monteur die naar de stations rijdt, zijn de meeste klanten zo binnen één tot twee uur terug. Met op afstand bedienbare stations kan dat in minuten.',
      'By hand, with a technician driving to the stations, most customers are back within one to two hours this way. With remote-controlled stations it can take minutes.'),
    B('In dit voorbeeld zaten {n:1800} klanten gemiddeld {n:50} minuten zonder stroom. Dat is samen {n:90000} klantminuten.',
      'In this example, {n:1800} customers were off supply for an average of {n:50} minutes. That makes {n:90000} customer minutes.'),
    B('Is een klant aangesloten binnen het vrijgeschakelde deel, dan wacht die op de reparatie. Een meetwagen zoekt de precieze plek van de fout, de ploeg graaft, maakt één of twee moffen en test de kabel. Voor ze aan de kabel beginnen, gelden de vijf veiligheidsregels: vrijschakelen, beveiligen tegen herinschakelen, spanningsloosheid vaststellen, aarden en kortsluiten, en naastgelegen delen onder spanning afschermen.',
      'A customer connected inside the isolated section waits for the repair. A measurement van pinpoints the fault, the crew digs, makes one or two joints and tests the cable. Before they touch the cable, the five safety rules apply: disconnect, secure against reconnection, verify absence of voltage, earth and short-circuit, and protect against adjacent live parts.'),
    B('Dat kost vaak een dag, en zolang heeft de ring geen reserve.',
      'That often takes a day, and meanwhile the ring has no backup.'),
  ],
  [ // s7 the yearly numbers
    B('Netbeheerders tellen alle storingen van een jaar op in drie cijfers. {t:SAIFI|SAIFI} is het aantal onderbrekingen per klant per jaar.',
      'Grid operators add up a year of outages in three numbers. {t:SAIFI|SAIFI} is the number of interruptions per customer per year.'),
    B('{t:CAIDI|CAIDI} is de gemiddelde duur van één onderbreking, voor de klanten die hem meemaakten.',
      '{t:CAIDI|CAIDI} is the average duration of one interruption, for the customers affected.'),
    B('Vermenigvuldig ze, en je krijgt {t:SAIDI|SAIDI}: de gemiddelde uitvalminuten per klant per jaar, de jaarlijkse uitvalduur. In 2025 was dat in Nederland {n:0.316} onderbrekingen van gemiddeld {n:73.9} minuten: {n:23.4} minuten door onvoorziene storingen. Gepland werk kwam daar met {n:27.2} minuten bovenop.',
      'Multiply them, and you get {t:SAIDI|SAIDI}: the average outage minutes per customer per year. In 2025 in the Netherlands that was {n:0.316} interruptions of {n:73.9} minutes on average: {n:23.4} minutes from unplanned outages. Planned work added {n:27.2} minutes on top.'),
    B('Een valkuil: één lange streng op het platteland kan de SAIDI van een hele regio bepalen.',
      'A pitfall: one long rural feeder can drive a whole region’s SAIDI.'),
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
{
  const resolved = resolveFilm(spec, lessons);
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
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.ws-glass,.ws-well,.mf-glass,.mf-well{fill:var(--anatomy-shade-0);stroke:none}
.ws-road,.mf-fpi{fill:var(--anatomy-shade-1);stroke:none}
.ws-pv{fill:var(--anatomy-shade-2);stroke:none}
.mf-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mf-dial{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.mf-band2{fill:none;stroke:var(--anatomy-mid);stroke-width:.5px}
.mf-needle{fill:none;stroke:var(--anatomy-strong);stroke-width:.35px;stroke-linecap:round}
.mf-pivot{fill:var(--anatomy-hi)}
.mf-blade{fill:none;stroke:var(--anatomy-strong);stroke-width:.55px;stroke-linecap:round}
.mf-fpi[data-lit]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-blade{stroke:var(--fp-accent)}
.mf-bub{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.8px;stroke-linejoin:round}
.mf-hand{fill:var(--anatomy-mid);stroke:none}
[data-cue][data-on] .mf-bub{stroke:var(--fp-accent);stroke-width:1.2px}
[data-cue][data-on] .mf-hand{fill:var(--fp-accent)}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-off{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.8;stroke-dasharray:3 3}
.mf-iron{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-dead{fill:none;stroke:var(--anatomy-lo);stroke-width:1.8;stroke-dasharray:5 5;stroke-linecap:round;stroke-linejoin:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-ring{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:1.4}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 22%,transparent);stroke:var(--anatomy-mid);stroke-width:1}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line{stroke:var(--fp-accent)}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono,[data-cue][data-on] .mf-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-ring{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent);stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een straat met huizen, meterkasten en een open netstation; boven de deuren bellen klanten. Een RMU met kortsluitverklikkers op de ringvelden. Kaarten: het SCADA-beeld van de ring met twaalf stations, de fout en het schakelen, hersteltijden, klantminuten, de reparatie, en SAIFI maal CAIDI is SAIDI.',
  en: 'A street with homes, meter boxes and an open secondary substation; customers call over the doors. An RMU with fault indicators on its ring panels. Cards: the SCADA view of the ring with twelve stations, the fault and the switching, restoration times, customer minutes, the repair, and SAIFI times CAIDI equals SAIDI.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB (street ${(worldAsvg.length / 1024).toFixed(1)}, station ${(worldBsvg.length / 1024).toFixed(1)}), no NaN in any path`);
  console.log('--- the street');
  A.auditOrExit(wa.R, wa.P);
  console.log('--- the station');
  A.auditOrExit(wb.R, wb.P);
}

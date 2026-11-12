// Dev tool, not shipped. Builds the explainer film "Loadflow en N-1 / Load flow
// and N-1" for Netplanning en de energietransitie: level 2 of the topic
// Belasting en prognose (eng.gridplanning.loadflow) and level 3 of the topic
// Netontwerp en redundantie (eng.gridplanning.redundancy).
//
//   node films/eng.gridplanning.loadflow/build.mjs            build the page
//   node films/eng.gridplanning.loadflow/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.gridplanning.loadflow.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.gridplanning.loadflow). The plan row lists the lessons "loadflow" and
// "redundancy"; both ids still exist after the topics x levels rebuild
// (loadflow is level 2 of Belasting en prognose, redundancy level 3 of
// Netontwerp en redundantie), so no mapping was needed. Neither had a film
// before. Storyboard drift: the plan's scene 4 terms "Vaste capaciteit,
// Non-firm, Vluchtstrook" are covered (s7, s8); its "46 MVA on 40" is the
// redundancy example (s9). Nine scenes (the kit's maximum): the voltage and
// the two worst moments share s4, N-1 and the rules per voltage level s6.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of both lessons' teach text and worked example. Checklist (scene):
//   loadflow teach 1, one question: all demand and generation at one moment,
//     current in every cable and transformer, voltage at every point; tools
//     Vision or PowerFactory (on the card, not said); per asset the
//     loading (% of what it may carry) and the voltage (% of nominal); red is
//     above 100 % or outside the band (s1)
//   teach 2, rating: carried continuously without overheating; cross-section,
//     soil type, soil temperature, cables nearby; rule of thumb aluminium MV
//     cable 10 or 20 kV roughly 250 to 300 A, at 10 kV about 4 to 5 MVA; MVA
//     close to MW for most equipment; I = S / (√3 × U), 2,5 MVA at 10 kV
//     about 144 A (s2)
//   teach 3, voltage drop through the cable's resistance; long heavily loaded
//     feeders low on a winter evening; solar streets high on a sunny afternoon
//     (s4); LV 230 V ±10 %, 10-minute averages, EN 50160, 207 to 253 V, the
//     voltage band; too high and inverters switch off; the band split between
//     MV and LV (s4)
//   teach 4, the feeder: one outgoing MV route with its MV stations; the
//     station transformer carries the sum, feeders don't peak together; one at
//     100 % while the rest sit at 40 %; green on the station-level capacity map
//     is not room at your address; station, feeder, voltage at the end (s3)
//   teach 5, two worst moments: winter evening peak (heat pumps, chargers,
//     little sun) for offtake; sunny spring afternoon with low demand for
//     feed-in; offtake and feed-in congestion; the question "afname of
//     invoeding?" (s4, beats 5-6). Left out: the pointer to the time-series
//     lesson (a cross-reference, not a point of this lesson)
//   example: 10 kV feeder rated 300 A, 210 A winter evening peak; station 80
//     MVA, peak 45 MVA; a food factory at the end asks 2,5 MVA, mostly in the
//     evening; sales: "barely half full"; 144 A, 210 + 144 = 354 A, 118 %: the
//     feeder limits, not the station; then the voltage at the end; options:
//     move the normally open point (the neighbouring feeder takes part), a
//     dedicated cable, or non-firm or outside the evening peak until the
//     reinforcement (s5); the open point is named with its job ("de open
//     schakelaar naar de buurstreng") and non-firm glossed ("terugregelbaar"),
//     so the L2 lesson needs nothing from the L3 scenes
//   redundancy teach 1, N-1: keeps supplying when any single component fails:
//     transformer, cable, line, busbar (definition); N all in service, minus
//     one the worst single outage; not two faults, nor a fault during
//     maintenance; planned work often without reserve, so maintenance at low
//     load (s6)
//   teach 2, two 40 MVA: firm capacity about 40, not 80, with the largest
//     component out; half idle as reserve most of the year; a pair of cables
//     the same; "half empty" and "full" both true; short overload in cold
//     weather, planners sometimes count a bit above 40 (s7)
//   teach 3, per voltage level: since 1 January 2026 the Energiewet requires
//     the reserve on 110 kV and up, with the transformers to the regional grid;
//     only a short interruption, the old Netcode 10 minutes and 100 MW, up to 6
//     hours; MV rings: switching over within hours; LV: wait for the repair (s6)
//   teach 4, non-firm: use the reserve in normal operation, curtailed or
//     disconnected at a fault or maintenance; TenneT's emergency lane; security
//     traded for capacity now; the contract says who carries the risk; the
//     control room acts within minutes (s8)
//   teach 5, the debate (strict N-1 everywhere, or a rare interruption rather
//     than years of waiting; the risk-based design lesson); the pitfall
//     (non-firm sold, curtailment never tested); two sharp questions (s8)
//   example: two 40 MVA, peak 46 MVA, +2 MVA a year, new station in 6 years;
//     requests: a 3 MVA cold store and a 4 MVA battery; firm 40, 6 over N-1;
//     a trip at peak: 46 MVA, 115 %, a few cold hours only if load can shift,
//     so ask how much can be switched to neighbouring stations over MV; new
//     firm requests no; 80 − 46 = 34 idle, offer both non-firm; in 3 years
//     52 MVA (s9)
//
// The drawing is the street of the grid films (eng.gridbasics.load and
// eng.gridbasics.congestion: the houses with solar panels, meter boxes, heat
// pump and inverter, the netstation with its transformer and LV rack, the
// street cable with joints, and the cold store, here the food factory at the
// end of the feeder), with an HV/MV substation added at its left in the
// manner of the figure eng.gridplanning.n1: two power transformers T1 and T2
// in oil bunds with a fire wall, cable trenches to the MV switchgear and the
// MV rail on insulators, and the MV feeder (streng) running from the
// switchgear along the pavement to the netstation and on to the factory. T2's
// parts are plain translations of T1's, so they ship once (as in
// films/eng.moulding.materials). Cards in stage space carry the load-flow
// schema, the cable rating, the station against its feeders, the voltage
// profile and band, the two worst moments, the factory example, N-1 on a
// one-line diagram, firm capacity, the rules per voltage level, the emergency
// lane and the redundancy example; illustrative cards say "schema" or
// "voorbeeld".
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
// text by defineFilm. Facts checked against (2026-11-11):
// - Load flow (power flow): the steady-state calculation of the currents and
//   node voltages for one given load and generation situation; Dutch DSOs
//   use Vision (Phase to Phase) and PowerFactory (DIgSILENT).
// - Rating: the continuous current a cable carries without exceeding its
//   conductor temperature (90 °C for XLPE), set by cross-section, soil
//   thermal resistivity, soil temperature and grouping (IEC 60287); a common
//   10 kV aluminium cable carries roughly 250 to 300 A in the ground ("grofweg",
//   as the lesson): √3 × 10 kV × 250-300 A = 4,3-5,2 MVA.
// - Voltage band: EN 50160 (and the Dutch Netcode) asks 230 V ±10 % for the
//   10-minute mean r.m.s. values during 95 % of each week (and -15 %/+10 %
//   always); said "vrijwel altijd". Inverters trip on overvoltage (the
//   10-minute mean above 253 V under EN 50549-1 / NEN-EN 50549-1).
// - N-1: the single-contingency criterion. The Energiewet (in force 1 January
//   2026) puts the enkelvoudige storingsreserve on the transmission grid in
//   the law itself (art. 5.4 replaces Elektriciteitswet 1998 art. 51; ACM);
//   the old Netcode allowed an interruption of at most 10 minutes with at
//   most 100 MW, and a deviation if it stays within 6 hours and 100 MW (ACM
//   draft decision on TenneT Noord-Nederland, 2020): said "stond tot 10
//   minuten en 100 megawatt toe, soms tot 6 uur", the card "oude Netcode".
//   MV rings are run open at the normaal openpunt and restored by switching
//   (eng.gridbasics.path, eng.gridops.outage).
// - Non-firm and the emergency lane: TenneT's term "de vluchtstrook" for using
//   the N-1 reserve (TenneT, 2021 onward), now in the ACM's non-firm ATO
//   contracts; said as the lesson says it, "TenneT noemde dat".
// - Terms as in the grid modules and films: N-1 as in the figure
//   eng.gridplanning.n1 (T1 and T2, the rail, "vaste capaciteit"), streng,
//   normaal openpunt, piekbelasting, megavoltampère and kilovoltampère, the
//   Energiewet since 1 January 2026, bedrijfsvoeringscentrum.
const LF = 'eng.gridplanning.loadflow';
const RED = 'eng.gridplanning.redundancy';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const l = lessons.nl.get(LF);
  const t = l.teach.join('\n');
  assert(t.includes('Vision of PowerFactory') && t.includes('Rood is boven de 100% of buiten de spanningsband'), 'tools, red');
  assert(t.includes('doorsnede, grondsoort, grondtemperatuur en kabels ernaast'), 'rating factors');
  assert(t.includes('grofweg 250 tot 300 A, op 10 kV zo’n 4 tot 5 MVA') && t.includes('2,5 MVA op 10 kV is zo’n 144 A'), 'rule of thumb, 144 A');
  assert(t.includes('230 V ±10%') && t.includes('EN 50160') && t.includes('207 tot 253 V') && t.includes('omvormers'), 'voltage band');
  assert(t.includes('verdeelt de band over het MS- en het LS-deel'), 'band split');
  assert(t.includes('op 100% terwijl de rest op 40% zit') && t.includes('capaciteitskaart op stationsniveau'), 'feeders, map');
  assert(t.includes('winteravondpiek') && t.includes('zonnige voorjaarsmiddag') && t.includes('afnamecongestie en invoedingscongestie'), 'two moments');
  const x = l.example.text;
  assert(x.includes('300 A') && x.includes('210 A') && x.includes('80 MVA') && x.includes('45 MVA') && x.includes('2,5 MVA extra'), 'factory example');
  assert(x.includes('≈ 144 A') && x.includes('210 + 144 = 354 A, 118%') && x.includes('normaal openpunt verleggen'), 'factory answer');
  const r = lessons.nl.get(RED);
  const u = r.teach.join('\n');
  assert(u.includes('vaste capaciteit van zo’n 40 MVA, geen 80'), 'firm 40');
  assert(u.includes('1 januari 2026') && u.includes('110 kV en hoger') && u.includes('10 minuten en 100 MW') && u.includes('tot 6 uur'), 'rules');
  assert(u.includes('vluchtstrook') && u.includes('binnen minuten'), 'emergency lane');
  const e = `${r.example.text}\n${r.example.reveal}`;
  assert(e.includes('twee trafo’s van 40 MVA') && e.includes('46 MVA') && e.includes('2 MVA per jaar') && e.includes('6 jaar'), 'redundancy example');
  assert(e.includes('koelhuis van 3 MVA') && e.includes('batterij van 4 MVA'), 'requests');
  assert(e.includes('6 MVA boven N-1') && e.includes('46 MVA, 115%') && e.includes('80 − 46 = 34 MVA') && e.includes('piek 52 MVA'), 'redundancy answer');
}
// loadflow: I = S / (√3 × U); 2,5 MVA at 10 kV ≈ 144 A; 210 + 144 = 354 A = 118 % of 300 A
const RATE = 300;
const PEAK_A = 210;
const ADD = 2.5;
const KV = 10;
const ADD_A = Math.round((ADD * 1000) / (Math.sqrt(3) * KV));
assert(ADD_A === 144, '2,5 MVA at 10 kV ≈ 144 A');
assert(PEAK_A + ADD_A === 354, '210 + 144 = 354');
assert(Math.round(((PEAK_A + ADD_A) / RATE) * 100) === 118, '354 / 300 = 118 %');
const ST = 80;
const ST_PEAK = 45;
assert(ST_PEAK / ST < 0.6, 'the station is barely half full');
// rule of thumb: 250-300 A at 10 kV is about 4-5 MVA
assert(near((Math.sqrt(3) * 10 * 250) / 1000, 4.3, 0.1) && near((Math.sqrt(3) * 10 * 300) / 1000, 5.2, 0.1), '250-300 A ≈ 4-5 MVA');
// the voltage band: 230 V ± 10 % = 207 to 253 V
assert(230 * 0.9 === 207 && Math.round(230 * 1.1) === 253, '207 to 253 V');
// redundancy: two 40 MVA, firm 40; peak 46 → 6 over, 115 % on one; 80 − 46 = 34; +2 a year → 52 in 3 years
const UNIT = 40;
const PEAK = 46;
const GROW = 2;
assert(PEAK - UNIT === 6, '6 MVA over N-1');
assert(Math.round((PEAK / UNIT) * 100) === 115, '46 on 40 = 115 %');
assert(2 * UNIT - PEAK === 34, '80 − 46 = 34');
assert(PEAK + 3 * GROW === 52, '52 MVA in 3 years');

// ---------------------------------------------------------------- the world
// World units are decimetres, z up, x along the street, +y toward the viewer.
// The top of the board (the pavement) is z = 0. The street (x ≥ −112) is the
// grid films' street; the substation yard sits at its left.
const W = 640;
const H = 400;
const BOARD = { x: -262, y: -112, w: 500, d: 188, r: 3 };
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
// the MV feeder (streng): along the pavement in front of the LV cable
const MV_Y = 33;
const MV_R = 1.3;
const MV_Z = 2.6; // its axis: clear of the yard's gravel and the board
const TAP_X = -72; // its tap into the netstation
const END_X = 176; // its tap into the factory's MV cabinet
// the food factory at the end of the street (the grid films' cold store)
const STORE = { x: 174, y: -84, w: 58, d: 64, r: 0.6 };
const STORE_Z = 38;
const CAB = { x: 171, y: -16, w: 10, d: 5, r: 0.4 };
const HP_PLAN = { x: 84, y: 2, w: 12, d: 5, r: 0.5 };
const METER_X = (i) => HOUSE.x + HW * i + 15;
const BRANCH_X = (i) => METER_X(i) + 2.4;
const INV = { y0: -40, y1: -32, z0: 22, z1: 32 };
// the HV/MV substation: a gravel yard, two power transformers in bunds, the MV switchgear
const YARD = { x: -252, y: -106, w: 134, d: 98, r: 1.5 };
const YARD_Z = 0.6;
const TX = [-223, -169];
const TY = -82;
const TK = { w: 28, d: 16 };
const TK_Z = [4, 25];
const COVER_Z = [25, 26.4];
const SW = { x: -246, y: -48, w: 118, d: 14, r: 0.4 };
const SW_Z = [2.2, 21];
const HOOD_Z = [21, 22.4];
const RAIL_Z = [25, 26.4];
const FEED_X = -150; // the feeder's cubicle

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
// Each part carries the cue of its assembly, so a term can light a power
// transformer, the rail, the feeder, the netstation, the houses, the solar
// panels, the inverter, the heat pump or the factory.
const cueOf = (name) => (/^house\.meter/.test(name) ? 'meter'
  : /^(house|roof)\./.test(name) ? 'houses'
    : /^t1\./.test(name) ? 't1'
      : /^t2\./.test(name) ? 't2'
        : /^sw\.rail/.test(name) ? 'rail'
          : /^sw\./.test(name) ? 'swg'
            : /^tr\./.test(name) ? 'trafo'
              : /^kiosk\./.test(name) ? 'station'
                : /^(mv|cab)/.test(name) ? 'feeder'
                  : /^joint/.test(name) ? 'joint'
                    : /^(cable|branch)/.test(name) ? 'cable'
                      : /^hp\./.test(name) ? 'hp'
                        : /^store\./.test(name) ? 'factory'
                          : /^inv\./.test(name) ? 'inv' : '');
const R = A.recorder(P, {});
function put(name, ref, svg, shapes, { bias = 0, attrs = '' } = {}) {
  const c = cueOf(name);
  return R.put({ name, at: ref, origin: ref, bias, svg, shapes, attrs: (c ? ` data-cue="${c}"` : '') + attrs });
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
  box('stand.kerb', { x: BOARD.x + 0.6, y: road0, w: BOARD.w - 1.2, d: 2, r: 0.3 }, 0, 0.9, { tone: 'mid' }, { steps: 2 });
}
for (let i = 1; i < 3; i++) box('house.hedge', { x: HOUSE.x + HW * i - 1, y: 0.2, w: 2, d: 12, r: 0.8 }, 0, 4, { tone: 'lo' }, { steps: 3 });
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
    lines.push(k.segment([x0 + 21, fy, 5.4], [x0 + 50, fy, 5.4], P));
  }
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
// the roof with solar panels on the front slope
{
  const F = frameX([0, 0, 0]);
  const y0 = HOUSE.y - EAVE;
  const y1 = HOUSE.y + HOUSE.d + EAVE;
  const ym = HOUSE.y + HOUSE.d / 2;
  const tri = [[y0, WALL], [y1, WALL], [ym, RIDGE]];
  const s0 = HOUSE.x - 2;
  const s1 = HOUSE.x + HOUSE.w + 2;
  const nrm = G.unit3([0, RIDGE - WALL, y1 - ym]);
  const onRoof = (x, t, h = 0) => [x, y1 + (ym - y1) * t + nrm[1] * h, WALL + (RIDGE - WALL) * t + nrm[2] * h];
  const tiles = [0.2, 0.4, 0.6, 0.8].map((t) => k.segment(onRoof(s0, t), onRoof(s1, t), P)).join('');
  const party = [1, 2].map((i) => k.segment(onRoof(HW * i, 0), onRoof(HW * i, 1), P)).join('');
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
for (let i = 0; i < 3; i++) {
  const mx = METER_X(i);
  const fy = HOUSE.y + HOUSE.d;
  const plan = { x: mx, y: fy, w: 5, d: 1.6, r: 0.3 };
  const face = fy + 1.6;
  const extra = L(poly([[mx + 1, face, 9.2], [mx + 4, face, 9.2], [mx + 4, face, 11], [mx + 1, face, 11]]), { tone: 'lo' })
    + Dt([at([mx + 2.5, face, 7])], { size: 0.5, tone: 'hi' });
  box('house.meter', plan, 4, 12.5, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra });
}
{
  for (const x of [HP_PLAN.x + 1, HP_PLAN.x + HP_PLAN.w - 3]) box('hp.foot', { x, y: HP_PLAN.y + 0.5, w: 2, d: 4, r: 0.3 }, 0, 1.2, { tone: 'lo' }, { steps: 2 });
  const fy = HP_PLAN.y + HP_PLAN.d;
  const c = [HP_PLAN.x + 4.6, fy, 6.2];
  const grille = `<path class="ws-well" d="${k.sideRing(c, 3.4, 'y', P)}"/>` + L(k.sideRing(c, 3.4, 'y', P) + k.sideRing(c, 2.2, 'y', P) + k.sideRing(c, 1, 'y', P), { tone: 'lo' })
    + Dt([at(c)], { size: 0.45, tone: 'hi' });
  const slots = [8.6, 7.4, 6.2, 5, 3.8].map((z) => k.segment([HP_PLAN.x + 9, fy, z], [HP_PLAN.x + 11, fy, z], P)).join('');
  box('hp.case', HP_PLAN, 1.2, 10.4, { tone: 'hi' }, { steps: 2, bevel: 0.3, extra: grille + L(slots, { tone: 'lo' }) });
}
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
  halo.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(KIOSK, -2), 0, 2, P)}" style="opacity:.7"/>`);
  box('kiosk.floor', KIOSK, 0, 2.2, { tone: 'lo' }, { steps: 2, bevel: 0.3 });
  const { x, y, w, d } = KIOSK;
  box('kiosk.back', { x, y, w, d: 1.2, r: 0.2 }, 2.2, KIOSK_Z, { tone: 'mid' }, { steps: 1 });
  box('kiosk.left', { x, y: y + 1.2, w: 1.2, d: d - 1.2, r: 0.2 }, 2.2, KIOSK_Z, { tone: 'mid' }, { steps: 1 });
  const fx = x + w;
  const vents = [];
  for (const [ya, yb] of [[y + 4, y + 11], [y + 13, y + 20]]) {
    for (const z of [6, 8, 10, 12, 14]) vents.push(k.pathOf([[fx, ya, z], [fx, yb, z], [fx, yb, z + 0.9], [fx, ya, z + 0.9]].map(at), true));
  }
  box('kiosk.right', { x: fx - 1.2, y: y + 1.2, w: 1.2, d: d - 1.2, r: 0.2 }, 2.2, KIOSK_Z, { tone: 'mid' }, { steps: 1, extra: L(vents.join(''), { tone: 'lo' }) });
  box('kiosk.pier', { x: x + 18.4, y: y + d - 1.2, w: 1.2, d: 1.2, r: 0.2 }, 2.2, KIOSK_Z - 3, { tone: 'mid' }, { steps: 1 });
  box('kiosk.lintel', { x: x + 1.2, y: y + d - 1.2, w: w - 2.4, d: 1.2, r: 0.2 }, KIOSK_Z - 3, KIOSK_Z, { tone: 'mid' }, { steps: 1 });
  box('kiosk.roof', k.insetPlan(KIOSK, -1.4), KIOSK_Z, KIOSK_Z + 1.8, { tone: 'mid' }, { steps: 2, bevel: 0.4 });
  for (const lx0 of [x, x + w - 0.8]) {
    const leaf = { x: lx0, y: y + d, w: 0.8, d: 16.6, r: 0.2 };
    const lx = leaf.x + leaf.w;
    const louv = [];
    for (const z of [5, 7, 9, 11, 13, 15]) louv.push(k.pathOf([[lx, y + d + 4, z], [lx, y + d + 13, z], [lx, y + d + 13, z + 0.9], [lx, y + d + 4, z + 0.9]].map(at), true));
    box('kiosk.door', leaf, 2.4, KIOSK_Z - 3.4, { tone: 'hi' }, { steps: 1, extra: L(louv.join(''), { tone: 'lo' }) });
  }
}
{
  for (const yy of [TANK.y + 2, TANK.y + TANK.d - 4]) box('tr.rail', { x: TANK.x - 0.6, y: yy, w: TANK.w + 1.2, d: 2, r: 0.2 }, 2.2, TANK_Z[0], { tone: 'lo' }, { steps: 1 });
  const fy = TANK.y + TANK.d;
  box('tr.tank', TANK, TANK_Z[0], TANK_Z[1], { tone: 'hi', crease: 'lo' }, { steps: 2, inner: L(k.sideSeam(TANK, TANK_Z[1] - 1.6, P, 2), { tone: 'faint' }) });
  for (let i = 0; i < 6; i++) box('tr.fin', { x: TANK.x + 1.6 + i * 2.35, y: fy, w: 0.7, d: 2.4, r: 0.2 }, TANK_Z[0] + 1.4, TANK_Z[1] - 2.4, { tone: 'mid' }, { steps: 1 });
  const cover = k.insetPlan(TANK, -0.6);
  box('tr.cover', cover, TANK_Z[1], TANK_Z[1] + 1, { tone: 'mid' }, { steps: 2, extra: Dt(k.corners(cover, 0.8).map(([xx, yy]) => at([xx, yy, TANK_Z[1] + 1])), { size: 0.4 }) });
  for (const bx of [TANK.x + 4, TANK.x + 7.5, TANK.x + 11]) post('tr.hv', bx, TANK.y + 3, 0.9, TANK_Z[1] + 1, TANK_Z[1] + 5.4, { tone: 'hi' }, { steps: 14 });
  for (const bx of [TANK.x + 3, TANK.x + 6, TANK.x + 9, TANK.x + 12]) post('tr.lv', bx, TANK.y + 8, 0.7, TANK_Z[1] + 1, TANK_Z[1] + 3.6, { tone: 'hi' }, { steps: 12 });
}
{
  box('kiosk.rack', RACK, 2.2, RACK_Z[1], { tone: 'mid' }, { steps: 1 });
  const fy = RACK.y + RACK.d;
  for (let i = 0; i < 4; i++) {
    const sx = RACK.x + 1 + i * 2.5;
    const dots = [8, 11.5, 15].map((z) => at([sx + 0.9, fy + 1, z]));
    box('kiosk.fuseway', { x: sx, y: fy, w: 1.8, d: 1, r: 0.2 }, 6, 17.5, { tone: i === 0 ? 'hi' : 'lo' }, { steps: 1, extra: Dt(dots, { size: 0.42, tone: 'hi' }) });
  }
}

// ---------------------------------------------------------------- the HV/MV substation (after the figure eng.gridplanning.n1)
{
  halo.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(YARD, -1.5), 0, 1.5, P)}" style="opacity:.6"/>`);
  const extra = L(k.planOutline(k.insetPlan(YARD, 3), YARD_Z, P, 3), { tone: 'faint' })
    + Dt(k.corners(YARD, 4).map(([x, y]) => at([x, y, YARD_Z])), { size: 0.45 });
  box('yard.gravel', YARD, 0, YARD_Z, { tone: 'lo' }, { steps: 2, bevel: 0.2, extra });
}
function transformer(index) {
  const cx = TX[index];
  const tag = `t${index + 1}`;
  const bund = { x: cx - 20, y: TY - 14, w: 40, d: 30, r: 1 };
  box(`${tag}.bund`, bund, YARD_Z, YARD_Z + 2, { tone: 'lo' }, {
    steps: 2, bevel: 0.3,
    extra: L(k.planOutline(k.insetPlan(bund, 1.6), YARD_Z + 2, P, 2), { tone: 'faint' }) + Dt(k.corners(bund, 1).map(([x, y]) => at([x, y, YARD_Z + 2])), { size: 0.4 }),
  });
  for (const dy of [-5, 5]) box(`${tag}.skid`, { x: cx - 13, y: TY + dy - 1.6, w: 26, d: 3.2, r: 0.3 }, YARD_Z + 2, TK_Z[0], { tone: 'mid' }, { steps: 2 });
  const tank = { x: cx - TK.w / 2, y: TY - TK.d / 2, w: TK.w, d: TK.d, r: 1.2 };
  const fy = tank.y + tank.d;
  // the nameplate on the front face: a plate with three rule lines
  const plate = L(poly([[cx - 12, fy, 15], [cx - 5, fy, 15], [cx - 5, fy, 19.5], [cx - 12, fy, 19.5]]), { tone: 'lo' })
    + L([18.4, 17.3, 16.2].map((z) => k.segment([cx - 11, fy, z], [cx - 6.4, fy, z], P)).join(''), { tone: 'lo', free: true });
  box(`${tag}.tank`, tank, TK_Z[0], TK_Z[1], { tone: 'hi', crease: 'lo' }, { steps: 3, bevel: 0.4, inner: L(k.sideSeam(tank, 7, P, 3) + k.sideSeam(tank, TK_Z[1] - 2.4, P, 3), { tone: 'faint' }), extra: plate });
  for (const dx of [0, 4, 8, 12]) box(`${tag}.fin`, { x: cx + dx - 0.5, y: fy, w: 1, d: 5.4, r: 0.3 }, 8, 22, { tone: 'hi', crease: 'lo' }, { steps: 2 });
  const cover = k.insetPlan(tank, -0.8);
  const bolts = [];
  for (let x = cover.x + 2.5; x <= cover.x + cover.w - 2; x += 5) bolts.push([x, cover.y + 0.8], [x, cover.y + cover.d - 0.8]);
  box(`${tag}.cover`, cover, COVER_Z[0], COVER_Z[1], { tone: 'hi' }, {
    steps: 3, bevel: 0.3,
    extra: L(k.planOutline(k.insetPlan(cover, 2), COVER_Z[1], P, 3), { tone: 'faint' }) + Dt(bolts.map(([x, y]) => at([x, y, COVER_Z[1]])), { size: 0.36, tone: 'mid' }),
  });
  // HV bushings at the back of the cover: porcelain with sheds and a terminal cap
  for (const dx of [-7, 0, 7]) {
    const x = cx + dx;
    const y = TY - 3.5;
    const z0 = COVER_Z[1];
    const sheds = [3, 5.5, 8, 10.5].map((h) => k.sideArc(x, y, 1.7, z0 + h, P, 12)).join('');
    post(`${tag}.hv`, x, y, 1.7, z0, z0 + 12.5, { tone: 'hi', crease: 'none' }, { owner: tag, steps: 16, inner: L(sheds, { tone: 'lo' }) });
    post(`${tag}.hvcap`, x, y, 0.8, z0 + 12.5, z0 + 14.4, { tone: 'mid' }, { owner: tag, steps: 12, extra: Dt([at([x, y, z0 + 14.4])], { size: 0.45, tone: 'hi' }) });
  }
  // MV bushings at the front
  for (const dx of [-5, 0, 5]) post(`${tag}.mv`, cx + dx, TY + 4.5, 1.1, COVER_Z[1], COVER_Z[1] + 4.6, { tone: 'hi', crease: 'none' }, { owner: tag, steps: 12, extra: Dt([at([cx + dx, TY + 4.5, COVER_Z[1] + 4.6])], { size: 0.4, tone: 'hi' }) });
  // the conservator on two stands at the back corner
  for (const dx of [-12, -7.4]) post(`${tag}.stand`, cx + dx, TY - 6.4, 0.6, COVER_Z[1], COVER_Z[1] + 3.2, { tone: 'mid' }, { owner: tag, steps: 10 });
  const FC = frameX([cx - 13.4, TY - 6.4, COVER_Z[1] + 5.6]);
  discAt(`${tag}.conservator`, FC, 0, 7.4, 2.4, { tone: 'hi', crease: 'lo' }, { owner: tag, inner: L(G.arcOf(FC, 0.9, 2.4, P) + G.arcOf(FC, 6.5, 2.4, P), { tone: 'faint' }) });
}
transformer(0);
transformer(1);
{
  // the fire wall between the bunds
  const wall = { x: (TX[0] + TX[1]) / 2 - 2, y: TY - 14, w: 4, d: 26, r: 0.4 };
  const seams = [10, 20, 30].map((z) => k.sideSeam(wall, z, P, 2)).join('');
  box('wall', wall, YARD_Z, 38, { tone: 'mid' }, { steps: 2, bevel: 0.4, inner: L(seams, { tone: 'faint' }) });
}
// cable trenches from each transformer to its incomer, with the flow line on top (stage.js runs its dashes)
const TRENCH = TX.map((cx) => ({ x: cx - 2.5, y: TY + 16.4, w: 5, d: SW.y - 1 - (TY + 16.4), r: 0.2 }));
TRENCH.forEach((plan, i) => {
  const joints = [];
  for (let y = plan.y + 5; y < plan.y + plan.d - 1; y += 5) joints.push(k.lineOnTop([plan.x, y], [plan.x + plan.w, y], YARD_Z + 1, P));
  const a = [plan.x + plan.w / 2, plan.y];
  const b = [plan.x + plan.w / 2, plan.y + plan.d];
  box(`trench.t${i + 1}`, plan, YARD_Z, YARD_Z + 1, { tone: 'lo' }, {
    steps: 2, extra: L(joints.join(''), { tone: 'faint' }) + `<g data-cue="t${i + 1}"><path class="ws-flow" data-k="flowT${i + 1}" d="${k.lineOnTop(a, b, YARD_Z + 1, P)}"/></g>`,
  });
});
// the MV switchgear: a row of eight cubicles on a plinth, the hood, the rail on insulators
const FACE = SW.y + SW.d;
{
  box('sw.plinth', { x: SW.x - 1, y: SW.y - 1, w: SW.w + 2, d: SW.d + 2, r: 0.4 }, YARD_Z, SW_Z[0], { tone: 'lo' }, { steps: 2 });
  const cw = SW.w / 8;
  const doors = [];
  const glass = [];
  const dots = [];
  for (let i = 0; i < 8; i++) {
    const x0 = SW.x + i * cw;
    if (i > 0) doors.push(k.segment([x0, FACE, SW_Z[0]], [x0, FACE, SW_Z[1]], P));
    doors.push(poly([[x0 + 1, FACE, 3.6], [x0 + cw - 1, FACE, 3.6], [x0 + cw - 1, FACE, 19.8], [x0 + 1, FACE, 19.8]]));
    const win = [[x0 + 4, FACE, 13.4], [x0 + cw - 4, FACE, 13.4], [x0 + cw - 4, FACE, 18], [x0 + 4, FACE, 18]];
    glass.push(poly(win));
    doors.push(poly(win));
    // the one-line mimic under the window: busbar stub, breaker, cable stub
    doors.push(k.segment([x0 + cw / 2, FACE, 12], [x0 + cw / 2, FACE, 9.4], P), k.segment([x0 + cw / 2, FACE, 7.6], [x0 + cw / 2, FACE, 5.6], P));
    dots.push(at([x0 + cw - 2.2, FACE, 11]), at([x0 + cw / 2, FACE, 12]), at([x0 + cw / 2, FACE, 5.6]));
  }
  const inner = `<path class="ws-glass" d="${glass.join('')}"/>` + L(doors.join(''), { tone: 'lo' });
  box('sw.cubicles', SW, SW_Z[0], SW_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.3, inner, extra: Dt(dots, { size: 0.42, tone: 'hi' }) });
  const hood = { x: SW.x - 1, y: SW.y - 1, w: SW.w + 2, d: SW.d + 2.4, r: 0.5 };
  box('sw.hood', hood, HOOD_Z[0], HOOD_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(hood, HOOD_Z[0] + 0.7, P, 2), { tone: 'faint' }) });
  const railY = SW.y + 6;
  for (const x of [SW.x + 10, SW.x + 40, SW.x + 70, SW.x + 100]) post('sw.insulator', x, railY + 0.8, 0.8, HOOD_Z[1], RAIL_Z[0], { tone: 'hi', crease: 'none' }, { steps: 12 });
  box('sw.rail', { x: SW.x + 4, y: railY, w: SW.w - 8, d: 1.6, r: 0.3 }, RAIL_Z[0], RAIL_Z[1], { tone: 'hi' }, { steps: 2 });
}

// ---------------------------------------------------------------- the factory's MV cabinet
{
  const fy = CAB.y + CAB.d;
  const extra = L(poly([[CAB.x + 1, fy, 1.4], [CAB.x + CAB.w - 1, fy, 1.4], [CAB.x + CAB.w - 1, fy, 12.6], [CAB.x + 1, fy, 12.6]])
    + k.segment([CAB.x + CAB.w / 2, fy, 1.4], [CAB.x + CAB.w / 2, fy, 12.6], P), { tone: 'lo' })
    + Dt([at([CAB.x + CAB.w / 2 - 1.2, fy, 7]), at([CAB.x + CAB.w / 2 + 1.2, fy, 7])], { size: 0.45, tone: 'hi' });
  box('cab.box', CAB, 0, 14, { tone: 'mid' }, { steps: 2, bevel: 0.3, extra });
  box('cab.roof', k.insetPlan(CAB, -0.5), 14, 14.8, { tone: 'mid' }, { steps: 2 });
}

// ---------------------------------------------------------------- the street cable, its joints and branches; the MV feeder
const FUSE0 = [RACK.x + 1.9, RACK.y + RACK.d, 4.4];
const CABLE_END_X = BRANCH_X(2) + 8;
const MV0 = [FEED_X, FACE, 4.2];
const MV_END = END_X + 5;
{
  const JR = CABLE_R * 1.7;
  const MJ = MV_Z; // the joints' sleeves rest on the board
  for (let i = 0; i < 3; i++) discAt('joint', frameX([BRANCH_X(i), CABLE_Y, CABLE_Z]), -2.2, 2.2, JR, { tone: 'mid' }, { steps: 16 });
  discAt('joint.end', frameX([CABLE_END_X, CABLE_Y, CABLE_Z]), 0, 1.6, CABLE_Z, { tone: 'mid' }, { steps: 16 });
  const MZ = MV_Z;
  for (const x of [TAP_X, END_X]) discAt('mv.joint', frameX([x, MV_Y, MZ]), -2.6, 2.6, MJ, { tone: 'mid' }, { steps: 18 });
  discAt('mv.end', frameX([MV_END, MV_Y, MZ]), 0, 1.6, MZ, { tone: 'mid' }, { steps: 16 });
  const pieces = [];
  pieces.push({ name: 'cable.feed', route: G.fillet([FUSE0, [FUSE0[0], FUSE0[1] + 4, FUSE0[2]], [FUSE0[0], FUSE0[1] + 7, CABLE_Z + 2.2],
    [FUSE0[0], CABLE_Y, CABLE_Z], [BRANCH_X(0) - 2.2, CABLE_Y, CABLE_Z]], 1.8, 7, { P, tube: CABLE_R }) });
  for (let i = 0; i < 3; i++) {
    const x1 = i < 2 ? BRANCH_X(i + 1) - 2.2 : CABLE_END_X;
    pieces.push({ name: `cable.main${i}`, route: [[BRANCH_X(i) + 2.2, CABLE_Y, CABLE_Z], [x1, CABLE_Y, CABLE_Z]] });
  }
  const BR = 0.75;
  for (let i = 0; i < 3; i++) {
    const bx = BRANCH_X(i);
    const ry = HOUSE.y + HOUSE.d + 0.8;
    pieces.push({ name: `branch${i}`, r: BR, route: G.fillet([[bx, CABLE_Y - JR, CABLE_Z], [bx, ry, CABLE_Z], [bx, ry, 4]], 1.2, 7, { P, tube: BR }) });
  }
  // the feeder: out of its cubicle, down to the pavement and along it; a tap into the netstation's floor
  // and one into the factory's cabinet
  pieces.push({ name: 'mv.out', r: MV_R, route: G.fillet([MV0, [MV0[0], FACE + 4, MV0[2]], [MV0[0], FACE + 8, MZ],
    [MV0[0], MV_Y, MZ], [TAP_X - 2.6, MV_Y, MZ]], 2.4, 7, { P, tube: MV_R }) });
  pieces.push({ name: 'mv.run', r: MV_R, route: [[TAP_X + 2.6, MV_Y, MZ], [END_X - 2.6, MV_Y, MZ]] });
  pieces.push({ name: 'mv.last', r: MV_R, route: [[END_X + 2.6, MV_Y, MZ], [MV_END, MV_Y, MZ]] });
  // the taps leave the joints' rims at the netstation floor's height
  const TR = 0.8;
  const TZ = 1.4;
  const tap = (x, y1) => G.fillet([[x, MV_Y - MJ, MZ], [x, MV_Y - MJ - 3, MZ], [x, MV_Y - MJ - 6, TZ], [x, y1, TZ]], 1.6, 7, { P, tube: TR });
  pieces.push({ name: 'mv.tap', r: TR, route: tap(TAP_X, KIOSK.y + KIOSK.d) });
  pieces.push({ name: 'mv.cab', r: TR, route: tap(END_X, CAB.y + CAB.d) });
  pieces.forEach(({ name, route, r = CABLE_R }) => {
    R.route(name, route, r, { limp: true });
    T.tubePieces(route, r, P, { maxLength: name === 'mv.run' ? 90 : 30, spacing: 1 }).forEach((piece, i) => {
      put(`${name}:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'mid' }), [A.tube(piece.points, piece.radii, { name, limp: true })], { bias: 0.05 });
    });
  });
}

// ---------------------------------------------------------------- the food factory at the end of the street
{
  const { x, y, w, d } = STORE;
  const fy = y + d;
  const fx = x + w;
  const z0 = 1.5;
  const ss = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(STORE, -3), 0, 3, P)}" style="opacity:.6"/>`;
  box('store.plinth', k.insetPlan(STORE, -1), 0, z0, { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: ss });
  const seams = [];
  for (let sx = x + 6.4; sx < fx - 1; sx += 6.4) if (sx < 184 || sx > 206) seams.push(k.segment([sx, fy, z0], [sx, fy, STORE_Z], P));
  for (let sy = y + 6.4; sy < fy - 1; sy += 6.4) seams.push(k.segment([fx, sy, z0], [fx, sy, STORE_Z], P));
  const slats = [];
  for (let z = 6.6; z < 24; z += 1.7) slats.push(k.segment([186, fy, z], [204, fy, z], P));
  const door = poly([[186, fy, 5], [204, fy, 5], [204, fy, 24], [186, fy, 24]]);
  const side = poly([[218, fy, z0], [223, fy, z0], [223, fy, 15], [218, fy, 15]]);
  const inner = `<path class="ws-glass" d="${door}"/>` + L(slats.join(''), { tone: 'faint' }) + L(door + side, { tone: 'lo' })
    + L(seams.join(''), { tone: 'faint' }) + L(k.sideSeam(STORE, STORE_Z - 3, P, 2), { tone: 'faint' })
    + Dt([at([222, fy, 8])], { size: 0.45, tone: 'hi' });
  box('store.walls', STORE, z0, STORE_Z, { tone: 'hi', crease: 'lo' }, { steps: 2, inner });
  box('store.coping', k.insetPlan(STORE, -0.8), STORE_Z, STORE_Z + 1.4, { tone: 'mid' }, { steps: 2, bevel: 0.3 });
  box('store.housing', { x: 185, y: fy, w: 20, d: 1.8, r: 0.4 }, 24, 26.6, { tone: 'mid' }, { steps: 2 });
  for (const bx of [182.6, 205.4]) box('store.buffer', { x: bx, y: fy, w: 2, d: 1.4, r: 0.3 }, 6, 10, { tone: 'lo' }, { steps: 2 });
  const tiles = [];
  for (let tx = 184; tx < 208; tx += 4) tiles.push(k.segment([tx, fy + 1, 5], [tx, fy + 7, 5], P));
  box('store.dock', { x: 181, y: fy + 1, w: 28, d: 6, r: 0.3 }, 0, 5, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra: L(tiles.join(''), { tone: 'faint' }) });
  for (const ux of [180, 204]) {
    const u = { x: ux, y: y + 8, w: 20, d: 12, r: 0.5 };
    const top = STORE_Z + 6.4;
    const fans = [];
    const hubs = [];
    for (const cx of [ux + 5.2, ux + 14.8]) {
      const cy = u.y + 6;
      fans.push(k.ring(cx, cy, 4, top, P, 24), k.ring(cx, cy, 2.6, top, P, 20));
      hubs.push(at([cx, cy, top]));
    }
    const grille = [];
    for (let gx = ux + 2; gx < ux + 19; gx += 2.2) grille.push(k.segment([gx, u.y + u.d, STORE_Z + 2.4], [gx, u.y + u.d, top - 1.2], P));
    for (const fx2 of [ux + 1.6, ux + u.w - 3.6]) box('store.foot', { x: fx2, y: u.y + 1, w: 2, d: u.d - 2, r: 0.3 }, STORE_Z + 1.4, STORE_Z + 2.2, { tone: 'lo' }, { steps: 1 });
    box('store.unit', u, STORE_Z + 2.2, top, { tone: 'hi' }, {
      steps: 2, bevel: 0.3,
      extra: `<path class="ws-well" d="${fans.join('')}"/>` + L(fans.join(''), { tone: 'lo' }) + Dt(hubs, { size: 0.45, tone: 'hi' }) + L(grille.join(''), { tone: 'faint' }),
    });
  }
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
// Page weight: a part drawn more than once (T2's parts, a copy of T1's; the
// fins, bushings, feet, fuse ways, meter boxes, joints, garden paths) is a
// plain translation of its first copy in this parallel projection, so each
// later copy ships as an empty <g data-r> moved by a translate, and stage.js
// fills it from its template <g data-t> at load (the method of
// films/eng.moulding.materials). A copy only shares when every point matches
// its template within a tenth and nothing else differs.
const shapeOf = (s) => {
  const nums = [];
  const shell = s.replace(/ d="([^"]*)"| c([xy])="(-?[\d.]+)"/g, (m, d, axis, v) => {
    if (axis) { nums.push(axis === 'x' ? [Math.round(v * 100), null] : [null, Math.round(v * 100)]); return ` c${axis}="#"`; }
    const tok = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
    let cmd = '';
    let pen = [0, 0];
    let start = pen;
    let out = '';
    for (let i = 0; i < tok.length;) {
      if (/[A-Za-z]/.test(tok[i])) { cmd = tok[i++]; out += cmd; if (cmd === 'Z') pen = start; continue; }
      if (!/^[MLZ]$/.test(cmd)) return ` d="${d}"`; // only line paths share
      const v = [Math.round(tok[i] * 100), Math.round(tok[i + 1] * 100)];
      i += 2;
      pen = v;
      if (cmd === 'M') start = pen;
      nums.push(pen);
      out += '#';
    }
    return ` d="${out}"`;
  });
  return { shell, nums };
};
const tplOf = new Map();
let tpls = 0;
const dedupe = ({ svg, origin }) => {
  if (!origin || / id=|data-k=|<text/.test(svg)) return svg;
  const { shell, nums } = shapeOf(svg);
  for (const t of tplOf.get(shell) ?? []) {
    const [dx, dy] = [0, 1].map((i) => Math.round((at(origin)[i] - at(t.origin)[i]) * 100));
    if (nums.length !== t.nums.length) continue;
    const ok = nums.every(([x, y], i) => (x === null || Math.abs(x - t.nums[i][0] - dx) <= 10) && (y === null || Math.abs(y - t.nums[i][1] - dy) <= 10));
    if (!ok) continue;
    if (t.id === null) { t.id = tpls++; t.cell.svg = `<g data-t="${t.id}">${t.cell.svg}</g>`; }
    return `<g data-r="${t.id}" transform="translate(${dx / 100} ${dy / 100})"/>`;
  }
  const cell = { svg };
  tplOf.set(shell, [...(tplOf.get(shell) ?? []), { id: null, nums, origin, cell }]);
  return cell;
};
const parts = R.items.map((item) => ({ item, body: dedupe(item) }));
// the flow of current along the feeder and the street cable (stage.js runs their dashes)
const FLOW_MV = [[FEED_X, FACE + 8, MV_Z + MV_R + 0.4], [FEED_X, MV_Y, MV_Z + MV_R + 0.4], [MV_END, MV_Y, MV_Z + MV_R + 0.4]];
const FLOW = [[FUSE0[0], CABLE_Y, CABLE_Z + 1.2], [CABLE_END_X, CABLE_Y, CABLE_Z + 1.2]];
const world = [
  ...halo,
  // only T1's parts keep their name: stage.js dims them when T1 trips
  ...parts.map(({ item, body }) => `<g${/^t1\./.test(item.name) ? ` data-n="${item.name}"` : ''}${item.attrs ?? ''}>${typeof body === 'string' ? body : body.svg}</g>`),
  `<g data-cue="feeder"><path class="ws-flow" data-k="flowF" d="${k.pathOf(FLOW_MV.map(at))}"/></g>`,
  `<g data-cue="cable"><path class="ws-flow" data-k="flow" d="${k.pathOf(FLOW.map(at))}"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('lf', g('lfBase', '') + cue('lf', g('lfNet', '')) + cue('bars', g('lfBars', '')) + g('lfTxt', '')),
  g('rate', g('raBase', '') + cue('rate', g('raCable', '')) + g('raTxt', '')),
  g('feed', g('feBase', '') + cue('feeds', g('feBars', '')) + cue('map', g('feMap', ''))),
  g('volt', g('voBase', '') + cue('band', g('voBand', '')) + g('voCurve', '') + g('voTxt', '')),
  g('two', g('twBase', '') + g('twTiles', '') + g('twAsk', '')),
  g('ex1', g('e1Base', '') + g('e1Bars', '') + g('e1Opt', '')),
  g('n1', g('n1Base', '') + cue('n1', g('n1Net', '')) + cue('rail', g('n1Rail', '')) + g('n1Txt', '')),
  g('firm', g('fiBase', '') + cue('firm', g('fiBars', '')) + g('fiTxt', '')),
  g('rules', g('ruBase', '') + g('ruRows', '')),
  g('lane', g('laBase', '') + cue('lane', g('laRoad', '')) + g('laTxt', '')),
  g('ex2', g('e2Base', '') + g('e2Bars', '') + g('e2Txt', '')),
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
const MID = [-10, -20, 18];
const SIDE = (p, w0, w1) => ({ from: cam(p, w0, 104), to: cam(p, w1, 104) });
const SUB_C = [-190, -60, 16];
const KIOSK_C = [-64, -16, 10];
const STREET_C = [60, -20, 26];
const STORE_C = [196, -40, 18];
const CAM = [
  { from: cam(MID, 650), to: cam([-160, -30, 14], 240, 104), a: 0.3, b: 0.46 },
  SIDE([-120, 10, 6], 220, 200),
  SIDE([-150, -40, 12], 250, 230),
  SIDE(STREET_C, 260, 236),
  SIDE(STORE_C, 240, 220),
  SIDE(SUB_C, 230, 200),
  SIDE(SUB_C, 200, 186),
  SIDE(SUB_C, 230, 210),
  SIDE(SUB_C, 210, 196),
];

// ---------------------------------------------------------------- the film
const DUR = [28, 28, 26, 44, 36, 42, 24, 32, 34];
const C = { dur: DUR, RATE, PEAK_A, ADD_A, ST, ST_PEAK, UNIT, PEAK };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.gridplanning.loadflow',
  title: { nl: 'Loadflow en N-1', en: 'Load flow and N-1' },
  lessons: [LF, RED],
  scenes: [
    {
      id: 's1', lesson: LF, level: 2, dur: DUR[0], still: 0.9, title: { nl: 'Wat een loadflow rekent', en: 'What a load flow computes' },
      beats: [
        B('Een onderstation, een streng met een netstation, huizen en een fabriek.', 'A substation, a feeder with a distribution substation, homes and a factory.', { cues: ['t1', 't2', 'feeder', 'station', 'factory'] }),
        B('Een {t:Loadflow|loadflow} rekent de stroom in elke kabel en de spanning op elk punt.', 'A {t:Load flow|load flow} computes the current in every cable and the voltage at every point.', { cue: { Loadflow: 'lf' } }),
        B('Per kabel en trafo: de {t:Belasting|belasting} en de spanning. Rood is boven {n:100}% of buiten de band.', 'Per cable and transformer: the {t:Loading|loading} and the voltage. Red is above {n:100}% or outside the band.', { cue: { Belasting: 'bars' } }),
      ],
    },
    {
      id: 's2', lesson: LF, level: 2, dur: DUR[1], still: 0.9, title: { nl: 'Belastbaarheid', en: 'Rating' },
      beats: [
        B('{t:Belastbaarheid}: de stroom die een kabel continu draagt zonder te warm te worden.', '{t:Rating}: the current a cable carries continuously without overheating.', { cue: { Belastbaarheid: 'rate' } }),
        B('Vuistregel: een aluminium MS-kabel draagt grofweg {n:250} tot {n:300} A, zo’n {n:4} tot {n:5} MVA.', 'Rule of thumb: an aluminium MV cable carries roughly {n:250} to {n:300} A, about {n:4} to {n:5} MVA.', { cues: ['feeder'] }),
        B('Stroom = vermogen / (√3 × spanning): {n:2.5} MVA op {n:10} kV is zo’n {n:144} A.', 'Current = power / (√3 × voltage): {n:2.5} MVA at {n:10} kV is about {n:144} A.', { cues: ['rate'] }),
      ],
    },
    {
      id: 's3', lesson: LF, level: 2, dur: DUR[2], still: 0.9, title: { nl: 'Station en streng', en: 'Station and feeder' },
      beats: [
        B('Een {t:Streng|streng}: één uitgaande MS-kabelroute uit het onderstation, met de netstations erop.', 'A {t:Feeder|feeder}: one outgoing MV cable route from the substation, with its MV stations.', { cue: { Streng: 'feeder' } }),
        B('De stationstrafo draagt de som. Eén streng zit op {n:100}%, de rest op {n:40}%.', 'The station transformer carries the sum. One feeder sits at {n:100}%, the rest at {n:40}%.', { cues: ['t1', 't2'] }),
        B('Groen op de capaciteitskaart is nog geen ruimte op jouw adres.', 'Green on the capacity map is not yet room at your address.', { cues: ['map'] }),
      ],
    },
    {
      id: 's4', lesson: LF, level: 2, dur: DUR[3], still: 0.9, title: { nl: 'Spanning en de slechtste momenten', en: 'Voltage and the worst moments' },
      beats: [
        B('Stroom door de weerstand van de kabel kost spanning: aan het eind een winteravond laag.', 'Current through the cable’s resistance costs voltage: low at the end on a winter evening.', { cues: ['feeder'] }),
        B('{t:Invoeding}: zonnepanelen duwen de spanning op een zonnige middag omhoog.', '{t:Feed-in}: solar panels push the voltage up on a sunny afternoon.', { cue: { Invoeding: 'pv' } }),
        B('{t:Spanningsband|Spanningsband}: bij de klant {n:230} V ±{n:10}%, dus {n:207} tot {n:253} V.', '{t:Voltage band|Voltage band}: at the customer {n:230} V ±{n:10}%, so {n:207} to {n:253} V.', { cue: { Spanningsband: 'band' } }),
        B('Te hoog: omvormers schakelen zich af. De band wordt verdeeld over MS en LS.', 'Too high: inverters switch off. The band is split between MV and LV.', { cues: ['inv'] }),
        B('Afname: de winteravondpiek. Invoeding: een zonnige voorjaarsmiddag met weinig verbruik.', 'Offtake: the winter evening peak. Feed-in: a sunny spring afternoon with low demand.', { cues: ['hp', 'pv'] }),
        B('Vraag altijd: wat is hier maatgevend, afname of invoeding?', 'Always ask: what is decisive here, offtake or feed-in?', { cues: [] }),
      ],
    },
    {
      id: 's5', lesson: LF, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Voorbeeld: de fabriek', en: 'Example: the factory' },
      beats: [
        B('Voorbeeld: streng {n:300} A, piek {n:210} A. Station {n:80} MVA, piek {n:45} MVA.', 'Example: feeder {n:300} A, peak {n:210} A. Station {n:80} MVA, peak {n:45} MVA.', { cues: ['feeder', 't1', 't2'] }),
        B('De fabriek vraagt {n:2.5} MVA extra. Sales: het station is amper half vol.', 'The factory asks for {n:2.5} MVA more. Sales: the station is barely half full.', { cues: ['factory'] }),
        B('{n:210} + {n:144} = {n:354} A: {n:118}%. De streng is de beperking, niet het station.', '{n:210} + {n:144} = {n:354} A: {n:118}%. The feeder is the limit, not the station.', { cues: ['feeder'] }),
        B('Opties: normaal openpunt verleggen, een eigen kabel, of non-firm tot de verzwaring.', 'Options: move the normally open point, a dedicated cable, or non-firm until reinforced.', { cues: ['feeder'] }),
      ],
    },
    {
      id: 's6', lesson: RED, level: 3, dur: DUR[5], still: 0.9, title: { nl: 'N-1', en: 'N-1' },
      beats: [
        B('{t:N-1}: het net blijft leveren als één willekeurig component uitvalt.', '{t:N-1}: the grid keeps supplying when any single component fails.', { cue: { 'N-1': 'n1' }, cues: ['t1'] }),
        B('Een trafo, een kabel, een lijn of de {t:Rail|rail}.', 'A transformer, a cable, a line or the {t:Busbar|busbar}.', { cue: { Rail: 'rail' } }),
        B('Niet gedekt: twee storingen tegelijk, of een storing tijdens onderhoud.', 'Not covered: two faults at once, or a fault during maintenance.', { cues: ['t2'] }),
        B('Sinds {n:1} januari 2026 eist de Energiewet N-1 op {n:110} kV en hoger: hooguit kort uit.', 'Since {n:1} January 2026 the Energy Act requires N-1 at {n:110} kV and above: a short break at most.', { cues: [] }),
        B('Een MS-ring schakelt om binnen uren. In LS wachten klanten op de reparatie.', 'An MV ring switches over within hours. In LV customers wait for the repair.', { cues: ['feeder'] }),
      ],
    },
    {
      id: 's7', lesson: RED, level: 3, dur: DUR[6], still: 0.9, title: { nl: 'Vaste capaciteit', en: 'Firm capacity' },
      beats: [
        B('Twee trafo’s van {n:40} MVA: {t:Vaste capaciteit|vaste capaciteit} zo’n {n:40} MVA, geen {n:80}.', 'Two {n:40} MVA transformers: {t:Firm capacity|firm capacity} about {n:40} MVA, not {n:80}.', { cue: { 'Vaste capaciteit': 'firm' }, cues: ['t1', 't2'] }),
        B('De helft staat het grootste deel van het jaar stil als reserve.', 'For most of the year, half of it sits idle as reserve.', { cues: ['firm'] }),
        B('Bij kou kan een trafo een paar uur boven zijn grens.', 'In cold weather a transformer can run above its rating for a few hours.', { cues: ['t2'] }),
      ],
    },
    {
      id: 's8', lesson: RED, level: 3, dur: DUR[7], still: 0.9, title: { nl: 'De vluchtstrook', en: 'The emergency lane' },
      beats: [
        B('{t:Non-firm}: de klant gebruikt de reserve, en wordt teruggeregeld bij uitval of onderhoud.', '{t:Non-firm}: the customer uses the reserve, and is curtailed at a fault or in maintenance.', { cue: { 'Non-firm': 'lane' } }),
        B('TenneT noemde dat de {t:Vluchtstrook|vluchtstrook} gebruiken.', 'TenneT called this using the {t:Emergency lane|emergency lane}.', { cue: { Vluchtstrook: 'lane' } }),
        B('In het contract: wie draagt het risico? Het bedrijfsvoeringscentrum stuurt binnen minuten.', 'In the contract: who carries the risk? The control room acts within minutes.', { cues: [] }),
        B('Vraag: is deze grens thermisch, of de N-1-reserve? En als de andere trafo in onderhoud is?', 'Ask: is this limit thermal, or the N-1 reserve? And if the other transformer is in maintenance?', { cues: ['t2'] }),
      ],
    },
    {
      id: 's9', lesson: RED, level: 3, dur: DUR[8], still: 0.9, title: { nl: 'Voorbeeld: 46 MVA op 40', en: 'Example: 46 MVA on 40' },
      beats: [
        B('Voorbeeld: twee trafo’s van {n:40} MVA, piek {n:46} MVA, groei {n:2} MVA per jaar.', 'Example: two {n:40} MVA transformers, peak {n:46} MVA, growing {n:2} MVA a year.', { cues: ['t1', 't2'] }),
        B('Al {n:6} MVA boven N-1. Valt T1 uit, dan draagt T2 {n:46} MVA: {n:115}%.', 'Already {n:6} MVA over N-1. If T1 fails, T2 carries {n:46} MVA: {n:115}%.', { cues: ['t2'] }),
        B('Vast: nee. Maar {n:80} − {n:46} = {n:34} MVA staat normaal stil: non-firm aanbieden.', 'Firm: no. But {n:80} − {n:46} = {n:34} MVA sits idle normally: offer it non-firm.', { cues: ['factory'] }),
        B('Let op de groei: over {n:3} jaar is de piek {n:52} MVA.', 'Watch the growth: in {n:3} years the peak is {n:52} MVA.', { cues: [] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this carries every point of both (checklist at
// the top). No "/", "×", "=", "%", "±", "−" or units as symbols in the spoken
// text: MVA, kV, A and MW are written out (megavoltampère, kilovolt, ampère,
// megawatt), MS and LS as middenspanning and laagspanning, as in the grid
// films. N-1 is a caption term but plain text in the narration (the English
// voice says "N minus one", which the term check would not accept as the
// term's shown form). Dutch words checked with espeak-ng phonemes (Piper's own
// bridge, films/_kit/voice-ab/phon.py with nl_NL-alex-medium). Dutch SAY rules
// in films/_kit/timeline.mjs for this film: loadflow as the floor says it,
// "loodflo" (espeak-ng reads "lo-ad-flow"), N-1 as "N min één" (espeak-ng
// drops the minus: "N één"), vluchtstrook and Netcode split at the head
// (espeak-ng stresses vluchtSTROOK and netCOde), and EN 50160 as "E N vijftig
// honderdzestig" (not "vijftigduizend ..."). English needs no new rule: its
// narration says "N minus one" and "the European standard", so the English
// kit is unchanged. Read right: belastbaarheid, spanningsband, invoeding,
// streng, buurstreng, stationstrafo, grondtemperatuur, omvormers, normaal
// openpunt, megavoltampère, ampère, trafo, rail, onderstation,
// bedrijfsvoeringscentrum, terugregelen, maatgevend, winteravondpiek,
// voorjaarsmiddag, terugregelbaar. non-firm is said "non-furm" (SAY rule;
// espeak-ng gave the Dutch short i). "80 min 46" is written "80 minus 46":
// the Dutch rule for "<number> min" says "minuten". Known and left: espeak-ng
// stresses aluminium on its first syllable, but the word is in other films'
// narration too, so no rule here.
// Kept out of the narration: the tool names Vision and PowerFactory (espeak-ng
// reads "poower faktorie"; both on the s1 card), voedingsmiddelenfabriek
// (stressed on "-briek"; said "fabriek van voedingsmiddelen"), tijdreeksen
// (stressed on "-reek"; said "later"), and HS/MS.
const SAY = [
  [ // s1 what a load flow computes
    B('Een stuk net, van onderstation tot fabriek.',
      'A piece of grid, from substation to factory.'),
    B('Een {t:Loadflow|loadflow} rekent, voor al het verbruik en alle opwek op één moment, de stroom door elke kabel en trafo en de spanning op elk punt.',
      'A {t:Load flow|load flow} computes, for all demand and generation at one moment, the current through every cable and transformer and the voltage at every point.'),
    B('Per stuk: de {t:Belasting|belasting}, de stroom in procent van wat het mag dragen, en de spanning in procent van nominaal. Rood is boven {n:100} procent of buiten de band.',
      'Per asset two numbers: the {t:Loading|loading}, current as a percentage of what it may carry, and the voltage as a percentage of nominal. Red is above {n:100} percent or outside the band.'),
  ],
  [ // s2 rating
    B('{t:Belastbaarheid|Belastbaarheid}: de stroom die een kabel of trafo continu draagt zonder te warm te worden, bij een kabel afhankelijk van doorsnede, grondsoort, grondtemperatuur en kabels ernaast.',
      '{t:Rating|Rating}: the current a cable or transformer carries continuously without overheating. For a cable it depends on cross-section, soil type, soil temperature and nearby cables.'),
    B('Vuistregel: een gangbare aluminium middenspanningskabel draagt grofweg {n:250} tot {n:300} ampère; op {n:10} kilovolt zo’n {n:4} tot {n:5} megavoltampère, ongeveer evenveel megawatt.',
      'Rule of thumb: a common aluminium medium-voltage cable carries roughly {n:250} to {n:300} amps; at {n:10} kilovolts, {n:4} to {n:5} megavolt amperes, about as many megawatts.'),
    B('Stroom is vermogen gedeeld door wortel drie maal de spanning: {n:2.5} megavoltampère op {n:10} kilovolt is zo’n {n:144} ampère.',
      'Current is power divided by root three times the voltage: {n:2.5} megavolt amperes at {n:10} kilovolts is about {n:144} amps.'),
  ],
  [ // s3 station and feeder
    B('Deze kabel is een {t:Streng|streng}: één uitgaande route uit het onderstation, met netstations erop.',
      'This cable is a {t:Feeder|feeder}: one outgoing route from the substation, with stations on it.'),
    B('De stationstrafo draagt de som van strengen die niet tegelijk pieken: één met een bedrijventerrein of drie zonneparken zit op {n:100} procent, de rest op {n:40}.',
      'The station transformer carries the sum of feeders that don’t peak together: one with a business park or three solar farms at {n:100} percent, the rest at {n:40}.'),
    B('Groen op de capaciteitskaart van het station is dus geen ruimte op jouw adres: kijk ook naar de streng en de spanning aan het eind.',
      'So green on the station’s capacity map is not room at your address: check the feeder and the voltage at the end too.'),
  ],
  [ // s4 voltage along the feeder, and the two worst moments
    B('Stroom door de weerstand van de kabel kost spanning: een lange, zwaarbelaste streng eindigt op een winteravond laag.',
      'Current through the cable’s resistance costs voltage: a long, heavily loaded feeder ends low on a winter evening.'),
    B('Bij {t:Invoeding|invoeding}, stroom op het net zetten, loopt een straat vol zonnepanelen op een zonnige middag op.',
      'With {t:Feed-in|feed-in}, putting power onto the grid, a solar street rises on a sunny afternoon.'),
    B('Bij de klant moet het gemiddelde over tien minuten vrijwel altijd binnen {n:230} volt plus of min {n:10} procent blijven, volgens EN 50160: {n:207} tot {n:253} volt, de {t:Spanningsband|spanningsband}.',
      'At the customer the ten-minute average must nearly always stay within {n:230} volts plus or minus {n:10} percent, a European standard: {n:207} to {n:253} volts, the {t:Voltage band|voltage band}.'),
    B('Te hoog, en omvormers schakelen zich af. De planner verdeelt de band over middenspanning en laagspanning.',
      'Too high, and inverters switch off. The planner splits the band between medium and low voltage.'),
    B('Twee slechtste momenten: voor afname de winteravondpiek, met warmtepompen, laadpalen en weinig zon; voor invoeding een zonnige voorjaarsmiddag met weinig verbruik.',
      'Two worst moments: offtake peaks on a winter evening, with heat pumps, chargers and little sun; feed-in on a sunny spring afternoon with low demand.'),
    B('Afnamecongestie en invoedingscongestie. Vraag dus steeds: wat is maatgevend, afname of invoeding?',
      'Offtake or feed-in congestion: always ask which one is decisive here.'),
  ],
  [ // s5 example: the factory
    B('Een voorbeeld: een streng van {n:10} kilovolt mag {n:300} ampère dragen en piekt op een winteravond op {n:210}; het onderstation heeft {n:80} megavoltampère en piekt op {n:45}.',
      'An example: a {n:10} kilovolt feeder rated {n:300} amps peaks at {n:210} on a winter evening; its substation has {n:80} megavolt amperes and peaks at {n:45}.'),
    B('Een fabriek van voedingsmiddelen aan het eind vraagt er {n:2.5} megavoltampère bij, vooral ’s avonds. Sales: het station is amper half vol.',
      'A food factory at the end wants {n:2.5} megavolt amperes more, mostly evenings. Sales: the station is barely half full.'),
    B('Dat is {n:144} ampère: {n:210} plus {n:144} is {n:354}, {n:118} procent. De streng beperkt, niet het station. Check daarna de spanning aan het eind.',
      'That is {n:144} amps: {n:210} plus {n:144} is {n:354}, {n:118} percent. The feeder limits, not the station. Then check the voltage at the end.'),
    B('Opties: het normaal openpunt verleggen, de open schakelaar naar de buurstreng, zodat die een deel overneemt; een eigen kabel vanaf het station; of tot de verzwaring non-firm, dus terugregelbaar, of buiten de avondpiek.',
      'Options: move the normally open point, the open switch to the next feeder, so it takes some load; a dedicated cable from the station; or, until the reinforcement, non-firm, which can be curtailed, or off-peak.'),
  ],
  [ // s6 N-1, and the rules per voltage level
    B('N-1: het net blijft leveren als één willekeurig component uitvalt. N is alles in bedrijf, min één de zwaarste enkele uitval.',
      'N minus one: the grid keeps supplying when any single component fails. N is everything in service, minus one the worst single outage.'),
    B('Een trafo, een kabel, een lijn, of de {t:Rail|rail}: de dikke geleider waar alle in- en uitgaande circuits op aansluiten.',
      'A transformer, a cable, a line, or the {t:Busbar|busbar}: the thick conductor all incoming and outgoing circuits connect to.'),
    B('Het dekt geen twee storingen tegelijk, en geen storing tijdens onderhoud, als er vaak geen reserve is: onderhoud dus bij lage belasting.',
      'It does not cover two faults at once, or a fault during maintenance, when there is often no reserve: so maintain at low load.'),
    B('Sinds {n:1} januari 2026 eist de Energiewet die reserve vanaf {n:110} kilovolt, met de trafo’s naar het regionale net: hooguit een korte onderbreking. De oude Netcode stond tot {n:10} minuten en {n:100} megawatt toe, soms tot {n:6} uur.',
      'Since {n:1} January 2026 the Energy Act requires it from {n:110} kilovolts up, with the transformers to the regional grid: a short break at most. The old Grid Code allowed up to {n:10} minutes and {n:100} megawatts, sometimes {n:6} hours.'),
    B('In een middenspanningsring is de reserve omschakelen, binnen uren. In de laagspanning wacht je op de reparatie.',
      'A medium-voltage ring’s reserve is switching over, within hours; in low voltage you wait for the repair.'),
  ],
  [ // s7 firm capacity
    B('Twee trafo’s van {n:40} megavoltampère geven een {t:Vaste capaciteit|vaste capaciteit} van zo’n {n:40}, geen {n:80}: wat er overblijft als het grootste component eruit ligt.',
      'Two {n:40} megavolt ampere transformers give a {t:Firm capacity|firm capacity} of about {n:40}, not {n:80}: what is left with the largest component out.'),
    B('Meestal staat de helft stil als reserve, bij een paar kabels net zo: half leeg en vol zijn allebei waar.',
      'Most of the year half sits idle as reserve; a pair of cables likewise: half empty and full are both true.'),
    B('Bij kou kan een trafo een paar uur over zijn grens, dus planners rekenen soms iets boven de {n:40}.',
      'A transformer can run over its rating for a few cold hours, so planners sometimes count a bit above {n:40}.'),
  ],
  [ // s8 the emergency lane
    B('Met congestie overal verkopen netbeheerders die reserve als {t:Non-firm|non-firm}: normaal bruikbaar, bij uitval of onderhoud teruggeregeld of afgeschakeld.',
      'With congestion everywhere, operators sell that reserve {t:Non-firm|non-firm}: usable normally, curtailed or disconnected at a fault or in maintenance.'),
    B('TenneT noemde dat de {t:Vluchtstrook|vluchtstrook} gebruiken. Je ruilt leveringszekerheid in voor capaciteit nu.',
      'TenneT called this using the {t:Emergency lane|emergency lane}: trading security of supply for capacity now.'),
    B('Het contract zegt wie dat risico draagt, en het bedrijfsvoeringscentrum moet binnen minuten terugregelen. Valkuil: verkocht, maar nooit getest.',
      'The contract says who carries that risk; the control room must curtail within minutes. Pitfall: sold, but never tested.'),
    B('Experts twisten of strikte N-1 betaalbaar blijft, of dat klanten liever een zeldzame onderbreking nemen dan jaren wachten. Vraag: thermische grens, of N-1-reserve? En als de andere trafo in onderhoud is?',
      'Experts argue whether strict N minus one is affordable, or whether customers prefer a rare break to years of waiting. Ask: a thermal limit, or the reserve? And if the other transformer is in maintenance?'),
  ],
  [ // s9 example: 46 MVA on 40
    B('Een voorbeeld: twee trafo’s van {n:40} megavoltampère, piek {n:46}, groei {n:2} per jaar, een nieuw station over {n:6} jaar. Er wachten een koelhuis van {n:3} en een batterij van {n:4}.',
      'An example: two {n:40} megavolt ampere transformers, peak {n:46}, growing {n:2} a year, a new station in {n:6} years. Waiting: a cold store of {n:3} and a battery of {n:4}.'),
    B('Al {n:6} boven N-1: valt in de piek een trafo uit, dan draagt de andere {n:46}, {n:115} procent. Een paar koude uren kan dat, als je belasting naar buurstations kunt omschakelen.',
      'Already {n:6} over N minus one: if a transformer fails at peak, the other carries {n:46}, {n:115} percent. That lasts a few cold hours, if you can switch load to neighbouring stations.'),
    B('Vast: nee. Maar {n:80} minus {n:46} is {n:34}, en die staat normaal stil: bied beide non-firm aan, teruggeregeld als een trafo eruit ligt.',
      'Firm: no. But {n:80} minus {n:46} is {n:34}, idle in normal operation: offer both non-firm, curtailed when a transformer is out.'),
    B('En let op de groei: over {n:3} jaar is de piek {n:52}.',
      'And watch the growth: in {n:3} years the peak is {n:52}.'),
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
.ws-off{transition:opacity .6s}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-wire{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mf-thick{fill:none;stroke:var(--anatomy-hi);stroke-width:6;stroke-linecap:round}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.mf-l2{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-dasharray:9 5;stroke-linecap:round}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.mf-home{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-hatch{fill:none;stroke:var(--anatomy-shade-0);stroke-width:2;stroke-linecap:round}
.mf-inv{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.fp-meter[data-alt]{fill:var(--anatomy-lo)}
[data-cue][data-on] .mf-line,[data-cue][data-on] .mf-wire,[data-cue][data-on] .mf-thick{stroke:var(--fp-accent)}
[data-cue][data-on] .mf-tile{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 22%,transparent)}
`;

const label = {
  nl: 'Een maquette van een stuk net: links een onderstation van hoog- naar middenspanning met twee vermogenstransformatoren, T1 en T2, in olieopvangbakken met een brandmuur ertussen, kabelgoten naar de middenspanningsinstallatie en de rail op isolatoren. Vanuit de installatie loopt een middenspanningsstreng langs de stoep naar een netstation met open deuren en verder naar een fabriek met koelunits aan het eind van de straat; vanuit het netstation voedt een laagspanningskabel drie rijtjeshuizen met zonnepanelen, een warmtepomp en een omvormer. Kaarten tonen de loadflow van de streng, de belastbaarheid van een kabel, het station tegenover zijn strengen, het spanningsverloop met de spanningsband, de twee slechtste momenten, het rekenvoorbeeld van de fabriek, N-1 in een eenlijnsschema, de vaste capaciteit, de regels per spanningsniveau, de vluchtstrook en het rekenvoorbeeld van 46 MVA op 40.',
  en: 'A model of a piece of grid: on the left a substation from high to medium voltage with two power transformers, T1 and T2, in oil bunds with a fire wall between them, cable trenches to the medium-voltage switchgear and the busbar on insulators. From the switchgear a medium-voltage feeder runs along the pavement to a distribution substation with open doors and on to a factory with cooling units at the end of the street; from the distribution substation a low-voltage cable feeds three terraced houses with solar panels, a heat pump and an inverter. Cards show the feeder’s load flow, a cable’s rating, the station against its feeders, the voltage profile with the voltage band, the two worst moments, the factory example, N-1 on a one-line diagram, firm capacity, the rules per voltage level, the emergency lane and the example of 46 MVA on 40.',
};
const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path, ${tpls} shared parts`);
  A.auditOrExit(R, P);
}

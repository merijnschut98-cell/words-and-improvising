// Dev tool, not shipped. Builds the explainer film "Van onderstation tot
// stopcontact / From substation to socket" for the topic Het net van hoog naar
// laag of Het elektriciteitsnet: its level 1 lesson eng.gridbasics.levels and
// its level 2 lesson eng.gridbasics.path.
//
//   node films/eng.gridbasics.path/build.mjs            build the page
//   node films/eng.gridbasics.path/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.gridbasics.path.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.gridbasics.path). The plan row lists the lessons "levels" and "path";
// both ids still exist after the topics x levels rebuild (eng.gridbasics.levels,
// level 1, and eng.gridbasics.path, level 2, of the topic grid), so no mapping
// was needed. Neither had a film before (levels keeps its figure
// eng.gridbasics.levels, the voltage slider). Storyboard drift: the plan's five
// scenes become nine, because the film now carries both lessons' whole text:
// the why of high voltage, the levels, who runs what and the boundary in the
// station come first (level 1), then the plan's journey (level 2).
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of both lessons' teach text and worked example. Checklist (scene):
//   levels teach 1: power = voltage x current; cable loss grows with the
//     square of the current; 10 x the voltage, 10 x less current, 100 x less
//     loss; so long distances at very high voltage, stepped down only near the
//     user (s1)
//   teach 2: EHS 380 and 220 kV, HS 150 and 110 kV, both TenneT, the national
//     grid operator (TSO), owned by the State; below that the regional grid
//     operators; in some regions a TS of about 50 or 25 kV (s2)
//   teach 3: MV mostly 10 to 20 kV, from the substations through towns to the
//     netstations in the streets, and straight to large customers (factories,
//     greenhouses); LV 400/230 V, the street cables and the house connection;
//     nearly every home and small business on LV (s3)
//   teach 4: the DSOs Enexis, Liander and Stedin, plus smaller ones such as
//     Westland Infra, Coteq and Rendo; a monopoly in their own area, with the
//     regions per DSO; they own and run the MV and LV grid (s4)
//   teach 5: TenneT and the DSO meet in the substation: TenneT the HV side,
//     the DSO the MV side and the outgoing cables, the transformer's owner
//     differs per station; the useful question (s5)
//   example: 100 MW wind farm: at 10 kV 100.000.000 / (1,73 x 10.000) about
//     5.800 A, far too much for a normal cable; at 150 kV about 385 A, 15 x
//     less current, about 225 x less loss in the same cable (s1); so the wind
//     farm connects to a TenneT 150 kV station, a single turbine or a small
//     solar park to the DSO's MV grid (s3)
//   path teach 1: power comes in from TenneT into a substation: a fenced yard,
//     big transformers step 150 or 110 kV down to 10 or 20 kV; from the MV rail
//     (busbar), a thick copper bar every cable connects to, MV cables leave in
//     all directions; national and regional grid meet there, and often the
//     capacity of a whole city or region is fixed there (s5)
//   teach 2: MV cables lie in rings, out from the substation past a series of
//     netstations and back; run open at one point, the normaal openpunt, so
//     each half is fed from one side; a closed ring needs far more complex
//     protection to find faults; after a cable fault the operators switch the
//     broken section out and close the open point, most customers have power
//     back while the cable is repaired (s6)
//   teach 3: the netstation, also wijktrafo or trafohuisje, the small brick
//     building or green cabinet in your street; inside an MV installation
//     (switchgear) for the ring, a 10 kV to 400 V transformer of mostly 400 or
//     630 kVA (older 250, some new 1.000), and an LV rack with a fuse for each
//     outgoing street cable; in office buildings and at large customers the MV
//     equipment is often in a separate MS-ruimte (s7)
//   teach 4: LV cables run down the streets, each for tens of homes; to each
//     home a connection cable ending at the main fuse, which protects the whole
//     connection, and the meter in the meter cupboard; up to and including the
//     meter it is the grid operator's, after it the owner's (s8)
//   teach 5: in many places the open point is still switched by hand, so a
//     fitter drives to the station first; newer stations get remote control and
//     fault passage indicators, boxes that show along which section the fault
//     current went; hence 30 minutes in one area and 2 hours in another; the
//     sharp question: where is the open point, and can we switch it remotely?
//     (s9)
//   example: a house in Tilburg: TenneT delivers 150 kV to the substation,
//     two 150/10 kV transformers feed a 10 kV rail (s5); a 10 kV cable leaves
//     in a ring past 12 netstations (s6); netstation 7 has a 400 kVA
//     transformer and six LV cables (s7); one runs down the street and feeds 35
//     homes; the house's connection cable ends at a 3 x 25 A main fuse (s8); if
//     the ring cable between netstation 6 and 7 fails, the operators open the
//     switches at both ends of that section and close the normaal openpunt:
//     netstation 7 has power again from the other side (s6)
//
// The drawing is the street of the grid films (eng.gridbasics.load and
// eng.gridplanning.loadflow: the houses with solar panels, meter boxes, heat
// pump and inverter, the netstation with its transformer and LV rack, the
// street cable with joints, the MV feeder along the pavement) and the HV/MV
// substation of eng.gridplanning.loadflow (two power transformers in oil bunds
// with a fire wall, cable trenches, the MV switchgear and the rail), here with
// a fence round the yard, a lattice tower and a gantry bringing in TenneT's
// 150 kV line (the tower, gantry and insulators of the figure
// eng.gridbasics.levels), and in the netstation a small RMU (the three-panel
// ring main unit of eng.switchgear.devices) where the ring loops in and out.
// Cards in stage space carry the current and the loss, the ladder of voltage
// levels, MV and LV with who hangs on them, the regional grid operators, the
// boundary in the substation, the ring with its open point and a fault, the
// inside of the netstation and an MV room, the house connection, and the field
// question; illustrative cards say "schema" or "voorbeeld".
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
// text by defineFilm. Facts checked against (2026-11-12):
// - Three-phase current I = P / (√3 × U) and the conductor loss 3 × I² × R:
//   10 x the voltage gives a tenth of the current and a hundredth of the loss.
// - Dutch voltage levels: TenneT runs 110 kV and higher (380 and 220 kV EHS,
//   150 and 110 kV HS) and is wholly owned by the State (Ministerie van
//   Financiën); intermediate 50 and 25 kV TS in some DSO areas; MV mostly 10
//   or 20 kV; LV 400/230 V (NEN-EN 50160 and the Netcode elektriciteit).
// - The DSOs Enexis, Liander, Stedin, Westland Infra, Coteq and Rendo (Netbeheer
//   Nederland), each the only grid operator in its area; the areas as the
//   lesson gives them ("grote delen van", "vooral").
// - MV rings run open at the normaal openpunt (the term as defined in all four
//   grid modules, said word for word); netstation transformers mostly 400 or
//   630 kVA; a house connection of 3 × 25 A ends at the main fuse, and the
//   connection and meter belong to the grid operator.
// - Fault passage indicators (kortsluitverklikkers) and remote control shorten
//   restoration; the lesson's 30 minutes against 2 hours, hedged as it is.
// - Terms as in the grid modules and films: netstation (English "distribution
//   substation", the gridbasics term), onderstation, MS-rail, normaal openpunt,
//   regionale netbeheerder, HS, MS and LS said as hoogspanning, middenspanning
//   and laagspanning.
const LEV = 'eng.gridbasics.levels';
const PATH = 'eng.gridbasics.path';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const l = lessons.nl.get(LEV);
  const t = l.teach.join('\n');
  assert(t.includes('met het kwadraat van de stroom') && t.includes('de verliezen 100 keer zo klein'), 'why high voltage');
  assert(t.includes('380 en 220 kV') && t.includes('150 en 110 kV') && t.includes('eigendom van de Staat') && t.includes('50 of 25 kV'), 'levels');
  assert(t.includes('10 tot 20 kV') && t.includes('fabrieken en kassen') && t.includes('400/230 V'), 'MV and LV');
  assert(t.includes('Westland Infra, Coteq en Rendo') && t.includes('Gelderland, Noord-Holland, Flevoland en Friesland') && t.includes('Zuid-Holland, Utrecht en Zeeland'), 'DSOs');
  assert(t.includes('wie eigenaar is van de transformator daartussen verschilt per station'), 'boundary');
  const x = l.example.text;
  assert(x.includes('100 MW') && x.includes('100.000.000 / (1,73 × 10.000) ≈ 5.800 A') && x.includes('385 A') && x.includes('15 keer') && x.includes('225 keer'), 'wind farm');
  assert(x.includes('losse windturbine of een klein zonnepark'), 'small producers on MV');
  const p = lessons.nl.get(PATH);
  const u = p.teach.join('\n');
  assert(u.includes('omheind terrein') && u.includes('150 of 110 kV') && u.includes('10 of 20 kV') && u.includes('MS-rail (busbar)'), 'substation');
  assert(u.includes('het normaal openpunt') && u.includes('veel ingewikkelder beveiliging'), 'ring');
  assert(u.includes('wijktrafo of trafohuisje') && u.includes('400 of 630 kVA (oudere 250, sommige nieuwe 1.000)'), 'netstation');
  assert(u.includes('Tot en met de meter is alles van de netbeheerder'), 'ownership');
  assert(u.includes('kortsluitverklikkers') && u.includes('30 minuten') && u.includes('2 uur'), 'field');
  const e = p.example.text;
  assert(e.includes('Tilburg') && e.includes('twee 150/10 kV-transformatoren') && e.includes('langs 12 netstations'), 'Tilburg');
  assert(e.includes('400 kVA en zes LS-kabels') && e.includes('35 woningen') && e.includes('3 × 25 A'), 'station 7');
  assert(e.includes('tussen netstation 6 en 7') && e.includes('sluiten ze het normaal openpunt'), 'the fault');
  const nop = p.terms.find((x2) => x2.term === 'Normaal openpunt');
  assert(nop && nop.def === 'De schakelaar in een MS-ring die openstaat; je sluit hem om een deel van de andere kant te voeden.', 'the open point as defined in the grid modules');
}
// levels example: 100 MW at 10 kV ≈ 5.800 A, at 150 kV ≈ 385 A; 15 x less current, 225 x less loss
const PW = 100e6;
const I10 = PW / (1.73 * 10000);
const I150 = PW / (1.73 * 150000);
assert(Math.round(I10 / 100) * 100 === 5800, '100 MW at 10 kV ≈ 5.800 A');
assert(Math.round(I150) === 385, '100 MW at 150 kV ≈ 385 A');
assert(Math.round(I10 / I150) === 15 && Math.round((I10 / I150) ** 2) === 225, '15 x less current, 225 x less loss');
// levels teach 1: 10 x the voltage: a tenth of the current, a hundredth of the loss
assert(near((1 / 10) ** 2, 1 / 100, 1e-12), '100 x less loss');
// path example: a ring of 12 netstations, station 7 with 400 kVA and six LV cables, 35 homes, 3 x 25 A
const RING = 12;
const ST7 = 7;
const LV_OUT = 6;
const HOMES = 35;
assert(ST7 < RING && LV_OUT === 6 && HOMES === 35, 'Tilburg numbers');
// ---------------------------------------------------------------- the world
// World units are decimetres, z up, x along the street, +y toward the viewer.
// The top of the board (the pavement) is z = 0. The street (x ≥ −112) is the
// grid films' street; the substation yard sits at its left, and TenneT's line
// comes in from a lattice tower at the board's left end.
const W = 640;
const H = 400;
const BOARD = { x: -328, y: -112, w: 566, d: 188, r: 3 };
const BOARD_Z = -5;
const HOUSE = { x: 0, y: -90, w: 165, d: 90, r: 0.6 };
const HW = 55; // one house
const WALL = 56; // eaves height
const RIDGE = 84;
const EAVE = 3; // overhang
// the netstation: wider than in the street films, so it holds the RMU where the ring loops in and out
const KIOSK = { x: -104, y: -34, w: 58, d: 24, r: 0.8 };
const KIOSK_Z = 26;
const RMU = { x: -100, y: -31, w: 12, d: 7, r: 0.4 };
const RMU_Z = [3.2, 16];
const TANK = { x: -82, y: -27, w: 15, d: 11, r: 0.8 };
const TANK_Z = [3.4, 16];
const RACK = { x: -60, y: -26, w: 11, d: 5, r: 0.4 };
const RACK_Z = [3.4, 21];
const CABLE_R = 1.1;
const CABLE_Y = 25;
const CABLE_Z = 1.9;
// the MV ring cable (the feeder) along the pavement in front of the LV cable: in from the
// substation to the RMU, and out of the RMU on to the next netstation (off the board's right end)
const MV_Y = 33;
const MV_R = 1.3;
const MV_Z = 2.6; // its axis: clear of the yard's gravel and the board
const IN_X = -97; // the cable from the substation turns up into the netstation here
const OUT_X = -91; // the cable to the next netstation leaves it here
const HP_PLAN = { x: 84, y: 2, w: 12, d: 5, r: 0.5 };
const METER_X = (i) => HOUSE.x + HW * i + 15;
const BRANCH_X = (i) => METER_X(i) + 2.4;
const INV = { y0: -40, y1: -32, z0: 22, z1: 32 };
// the HV/MV substation: a fenced gravel yard, two power transformers in bunds, the MV switchgear
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
const FEED_X = -150; // the ring cable's cubicle
// TenneT's 150 kV line: a lattice tower at the left end, a gantry where it lands in the yard,
// a strung bus to a second gantry over both transformers, droppers to their HV bushings
const LINE_Y = TY;
const TOWER_X = -306;
const ARM_Z = 104; // the crossarm's underside
const PH = 14; // outer phases at LINE_Y ± PH
const TOP_Z = 128; // the middle phase on the tower's peak
const GANTRY = [-246, -140];
const GPOST = 20; // gantry posts at LINE_Y ± GPOST
const BEAM_Z = 66; // the gantry beam's underside
const HANG = 7; // a hanging insulator string's length
const GTOP_Z = BEAM_Z + 3 + 8; // the middle phase on a post insulator on the beam
const BUSHING_CAP = COVER_Z[1] + 14.4;

const FIT = [
  ...k.boxCorners(BOARD, BOARD_Z, 0),
  [HOUSE.x, HOUSE.y + HOUSE.d / 2, RIDGE], [HOUSE.x + HOUSE.w, HOUSE.y + HOUSE.d / 2, RIDGE],
  [TOWER_X, LINE_Y, TOP_Z + 2],
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
const { sinA, cosA, sinE, cosE } = k.cameraOf(P);
const VIEW = [cosA * cosE, sinA * cosE, sinE];

// ---------------------------------------------------------------- recorder
// Each part carries the cue of its assembly, so a term can light TenneT's
// tower and gantries, the yard and its fence, a power transformer, the rail,
// the MV switchgear, the ring cable, the netstation, its RMU, transformer and
// LV rack, the street cable, the houses or a meter box.
const cueOf = (name) => (/^house\.meter/.test(name) ? 'meter'
  : /^(house|roof)\./.test(name) ? 'houses'
    : /^(tower|gantry)/.test(name) ? 'tower'
      : /^(yard|fence)/.test(name) ? 'yard'
        : /^t1\./.test(name) ? 't1'
          : /^t2\./.test(name) ? 't2'
            : /^sw\.rail/.test(name) ? 'rail'
              : /^sw\./.test(name) ? 'swg'
                : /^tr\./.test(name) ? 'trafo'
                  : /^rmu\./.test(name) ? 'rmu'
                    : /^kiosk\.(rack|fuseway)/.test(name) ? 'rack'
                      : /^kiosk\./.test(name) ? 'station'
                        : /^mv/.test(name) ? 'feeder'
                          : /^(cable|branch|joint)/.test(name) ? 'cable'
                            : /^hp\./.test(name) ? 'hp'
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
  for (const px of [x + 17.4, x + 40.2]) box('kiosk.pier', { x: px, y: y + d - 1.2, w: 1.2, d: 1.2, r: 0.2 }, 2.2, KIOSK_Z - 3, { tone: 'mid' }, { steps: 1 });
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
// the RMU (after the ring main unit of eng.switchgear.devices): a base frame, a steel tank with
// three panels (ring in, ring out, transformer), each with a fascia, its mimic, two operating
// sockets and a lower cover; a pressure gauge on the middle fascia
{
  box('rmu.base', { x: RMU.x - 0.4, y: RMU.y - 0.4, w: RMU.w + 0.8, d: RMU.d + 0.8, r: 0.3 }, 2.2, RMU_Z[0], { tone: 'lo' }, { steps: 2 });
  const fy = RMU.y + RMU.d;
  const pw = RMU.w / 3;
  const seams = [1, 2].map((i) => k.segment([RMU.x + i * pw, fy, RMU_Z[0] + 0.3], [RMU.x + i * pw, fy, RMU_Z[1] - 0.3], P)).join('');
  box('rmu.tank', RMU, RMU_Z[0], RMU_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.2, inner: L(seams, { tone: 'lo' }) + L(k.sideSeam(RMU, RMU_Z[1] - 0.8, P, 2), { tone: 'faint' }) });
  box('rmu.lid', k.insetPlan(RMU, -0.3), RMU_Z[1], RMU_Z[1] + 0.6, { tone: 'mid' }, { steps: 2 });
  for (let i = 0; i < 3; i++) {
    const x0 = RMU.x + i * pw + 0.5;
    const x1 = x0 + pw - 1;
    const cx = (x0 + x1) / 2;
    const ff = fy + 0.3;
    // the fascia: the busbar along its top, the switch blade and the cable (or the fuse) below
    const mim = k.segment([x0 + 0.3, ff, 13.6], [x1 - 0.3, ff, 13.6], P) + k.segment([cx, ff, 13.6], [cx, ff, 12.6], P)
      + k.segment([cx, ff, 12.6], [cx + 0.9, ff, 11.6], P) + k.segment([cx, ff, 11.2], [cx, ff, 9.9], P);
    box('rmu.fascia', { x: x0, y: fy, w: x1 - x0, d: 0.3, r: 0.1 }, 9.4, 14.6, { tone: 'mid' }, { steps: 1, extra: L(mim, { tone: 'hi', free: true }) + Dt([at([cx - 1, ff, 10.6]), at([cx + 1, ff, 10.6])], { size: 0.38, tone: 'hi' }) });
    const lower = i === 2 ? [-1, 0, 1].map((j) => poly([[cx + j * 1.1 - 0.35, fy + 0.3, 5], [cx + j * 1.1 + 0.35, fy + 0.3, 5], [cx + j * 1.1 + 0.35, fy + 0.3, 7.6], [cx + j * 1.1 - 0.35, fy + 0.3, 7.6]])).join('')
      : k.segment([x0 + 0.8, fy + 0.3, 7.6], [x1 - 0.8, fy + 0.3, 7.6], P);
    box('rmu.cover', { x: x0, y: fy, w: x1 - x0, d: 0.3, r: 0.1 }, 4, 8.6, { tone: 'hi' }, { steps: 1, extra: L(lower, { tone: 'lo', free: true }) });
  }
  const gc = [RMU.x + RMU.w / 2, fy + 0.6, 15.1];
  box('rmu.gauge', { x: gc[0] - 0.6, y: fy + 0.3, w: 1.2, d: 0.3, r: 0.3 }, 14.6, 15.6, { tone: 'hi' }, { steps: 2, extra: Dt([at(gc)], { size: 0.3, tone: 'lo' }) });
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
// ---------------------------------------------------------------- the fence, TenneT's tower and the gantries (after the figure eng.gridbasics.levels)
// Convex solids from faces (the figure's hull and polySolid): each visible face
// shaded by facing like the kit's extrude, the outline the hull of the
// projected vertices, creases the edges shared by two visible faces.
function hull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of [...pts].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function polySolid(faces) {
  const verts = faces.flat();
  const c = [0, 1, 2].map((i) => verts.reduce((s, v) => s + v[i], 0) / verts.length);
  const shades = [[], [], [], []];
  const tops = [];
  const visible = [];
  for (const f of faces) {
    let n = [0, 0, 0];
    for (let i = 0; i < f.length; i++) {
      const a = f[i];
      const b = f[(i + 1) % f.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]);
      n[1] += (a[2] - b[2]) * (a[0] + b[0]);
      n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const len = Math.hypot(...n) || 1;
    n = n.map((v) => v / len);
    const fc = [0, 1, 2].map((i) => f.reduce((s, v) => s + v[i], 0) / f.length);
    if ((fc[0] - c[0]) * n[0] + (fc[1] - c[1]) * n[1] + (fc[2] - c[2]) * n[2] < 0) n = n.map((v) => -v);
    if (n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2] <= 1e-6) continue;
    visible.push(f);
    const d = poly(f);
    if (n[2] > 0.55) tops.push(d);
    else {
      const h = Math.hypot(n[0], n[1]) || 1;
      const lit = ((n[0] / h) * -sinA + (n[1] / h) * cosA + 1) / 2;
      shades[Math.min(3, Math.max(0, Math.floor(lit * 4)))].push(d);
    }
  }
  const key = (p) => p.map((v) => v.toFixed(3)).join(',');
  const edges = new Map();
  for (const f of visible) {
    for (let i = 0; i < f.length; i++) {
      const a = f[i];
      const b = f[(i + 1) % f.length];
      const id = [key(a), key(b)].sort().join('|');
      edges.set(id, { a, b, n: (edges.get(id)?.n ?? 0) + 1 });
    }
  }
  const crease = [...edges.values()].filter((e) => e.n > 1).map((e) => k.pathOf([at(e.a), at(e.b)])).join('');
  const outline = k.pathOf(hull(verts.map(at)), true);
  return { fill: outline, outline, crease, top: tops.join(''), shades: shades.map((s) => s.join('')) };
}
// a square frustum (a lattice body), half-widths r0 at z0 and r1 at z1, with X bracing on its two visible faces
function frustum(name, cx, cy, r0, r1, z0, z1, panels, style = {}) {
  const sq = (r, z) => [[cx - r, cy - r, z], [cx + r, cy - r, z], [cx + r, cy + r, z], [cx - r, cy + r, z]];
  const b = sq(r0, z0);
  const t = sq(r1, z1);
  const sides = [0, 1, 2, 3].map((i) => [b[i], b[(i + 1) % 4], t[(i + 1) % 4], t[i]]);
  const rAt = (z) => r0 + ((r1 - r0) * (z - z0)) / (z1 - z0);
  const br = [];
  for (let i = 0; i < panels; i++) {
    const za = z0 + ((z1 - z0) * i) / panels;
    const zb = z0 + ((z1 - z0) * (i + 1)) / panels;
    const ra = rAt(za);
    const rb = rAt(zb);
    br.push(k.segment([cx + ra, cy - ra, za], [cx + rb, cy + rb, zb], P), k.segment([cx + ra, cy + ra, za], [cx + rb, cy - rb, zb], P));
    br.push(k.segment([cx - ra, cy + ra, za], [cx + rb, cy + rb, zb], P), k.segment([cx + ra, cy + ra, za], [cx - rb, cy + rb, zb], P));
    if (i > 0) br.push(k.pathOf([at([cx + ra, cy - ra, za]), at([cx + ra, cy + ra, za]), at([cx - ra, cy + ra, za])]));
  }
  const rm = (r0 + r1) / 2;
  const shape = R.solid(A.box([cx - rm, cy - rm, z0], [cx + rm, cy + rm, z1], { name }));
  const svg = S(polySolid([b, t, ...sides]), { tone: 'mid', crease: 'lo', ...style, inner: panels ? L(br.join(''), { tone: 'lo' }) : '' });
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape]);
}
// insulators: a hanging string of discs under an arm, and a post insulator with sheds
function insHang(name, x, y, z1) {
  const z0 = z1 - HANG;
  const discs = [0.25, 0.45, 0.65, 0.85].map((f) => k.sideArc(x, y, 1.5, z0 + HANG * f, P, 12)).join('');
  post(name, x, y, 0.6, z0, z1, { tone: 'hi', crease: 'none' }, { steps: 10, extra: L(discs, { tone: 'mid' }) + Dt([at([x, y, z0])], { size: 0.5, tone: 'hi' }) });
}
function insPost(name, x, y, z0, z1) {
  const sheds = [0.3, 0.55, 0.8].map((f) => k.sideArc(x, y, 1.4, z0 + (z1 - z0) * f, P, 12)).join('');
  post(name, x, y, 0.9, z0, z1, { tone: 'hi', crease: 'none' }, { steps: 12, inner: L(sheds, { tone: 'lo' }), extra: Dt([at([x, y, z1])], { size: 0.5, tone: 'hi' }) });
}
// the tower: footings, the braced body, the crossarm with two strings, the peak with the post insulator
{
  const R0 = 9;
  const R1 = 3;
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box('tower.footing', { x: TOWER_X + dx * R0 - 1.6, y: LINE_Y + dy * R0 - 1.6, w: 3.2, d: 3.2, r: 0.3 }, 0, 1.4, { tone: 'lo' }, { steps: 2 });
  frustum('tower.body', TOWER_X, LINE_Y, R0, R1, 0, ARM_Z, 6);
  box('tower.arm', { x: TOWER_X - 1.6, y: LINE_Y - PH - 3, w: 3.2, d: 2 * PH + 6, r: 0.3 }, ARM_Z, ARM_Z + 3, { tone: 'mid' }, { steps: 2, extra: Dt([at([TOWER_X, LINE_Y - PH - 1.8, ARM_Z + 3]), at([TOWER_X, LINE_Y + PH + 1.8, ARM_Z + 3])], { size: 0.45 }) });
  for (const s of [-1, 1]) insHang('tower.string', TOWER_X, LINE_Y + s * PH, ARM_Z);
  frustum('tower.peak', TOWER_X, LINE_Y, 2.2, 1.2, ARM_Z + 3, TOP_Z - 8, 2);
  insPost('tower.post', TOWER_X, LINE_Y, TOP_Z - 8, TOP_Z);
}
// the gantries: two braced posts, the beam, two strings and a post insulator each
for (const gx of GANTRY) {
  for (const s of [-1, 1]) {
    box('gantry.footing', { x: gx - 2.6, y: LINE_Y + s * GPOST - 2.6, w: 5.2, d: 5.2, r: 0.3 }, YARD_Z, YARD_Z + 1.2, { tone: 'lo' }, { steps: 2 });
    frustum('gantry.post', gx, LINE_Y + s * GPOST, 2.2, 1.4, YARD_Z + 1.2, BEAM_Z, 4);
  }
  box('gantry.beam', { x: gx - 1.6, y: LINE_Y - GPOST - 2, w: 3.2, d: 2 * GPOST + 4, r: 0.3 }, BEAM_Z, BEAM_Z + 3, { tone: 'mid' }, { steps: 2, extra: Dt([at([gx, LINE_Y - GPOST, BEAM_Z + 3]), at([gx, LINE_Y + GPOST, BEAM_Z + 3])], { size: 0.45 }) });
  for (const s of [-1, 1]) insHang('gantry.string', gx, LINE_Y + s * PH, BEAM_Z);
  insPost('gantry.post', gx, LINE_Y, BEAM_Z + 3, GTOP_Z);
}
// the fence round the yard (back and both sides; the front is the gate): posts with two wires
{
  const runs = [
    [[YARD.x + 1, YARD.y + 1], [YARD.x + YARD.w - 1, YARD.y + 1]],
    [[YARD.x + 1, YARD.y + 1], [YARD.x + 1, YARD.y + YARD.d - 2]],
    [[YARD.x + YARD.w - 1, YARD.y + 1], [YARD.x + YARD.w - 1, YARD.y + YARD.d - 2]],
  ];
  const FZ = 16;
  runs.forEach(([a, b], ri) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.round(len / 12);
    for (let i = 0; i <= n; i++) {
      if (ri > 0 && i === 0) continue; // the corner post is the back run's
      const p = [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n];
      box('fence.post', { x: p[0] - 0.4, y: p[1] - 0.4, w: 0.8, d: 0.8, r: 0.15 }, YARD_Z, FZ, { tone: 'mid' }, { steps: 1 });
      if (i < n) {
        // the three wires to the next post, recorded as the thin panel they span
        const q = [a[0] + ((b[0] - a[0]) * (i + 1)) / n, a[1] + ((b[1] - a[1]) * (i + 1)) / n];
        const ux = Math.sign(q[0] - p[0]) * 0.4;
        const uy = Math.sign(q[1] - p[1]) * 0.4;
        const pa = [p[0] + ux, p[1] + uy];
        const qa = [q[0] - ux, q[1] - uy];
        const wires = L([6, 11, FZ - 0.4].map((z) => k.segment([pa[0], pa[1], z], [qa[0], qa[1], z], P)).join(''), { tone: 'lo' });
        const lo = [Math.min(pa[0], qa[0]) - 0.1, Math.min(pa[1], qa[1]) - 0.1, 5.9];
        const hi = [Math.max(pa[0], qa[0]) + 0.1, Math.max(pa[1], qa[1]) + 0.1, FZ - 0.3];
        const shape = R.solid(A.box(lo, hi, { name: 'fence.wire', ground: true }));
        put('fence.wire', [(pa[0] + qa[0]) / 2, (pa[1] + qa[1]) / 2, 11], wires, [shape]);
      }
    }
  });
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

// ---------------------------------------------------------------- the street cable, its joints and branches; the MV feeder
const FUSE0 = [RACK.x + 1.9, RACK.y + RACK.d, 4.4];
const CABLE_END_X = BRANCH_X(2) + 8;
const MV0 = [FEED_X, FACE, 4.2];
const MV_END = BOARD.x + BOARD.w - 3;
{
  const JR = CABLE_R * 1.7;
  const MJ = MV_Z; // the joints' sleeves rest on the board
  for (let i = 0; i < 3; i++) discAt('joint', frameX([BRANCH_X(i), CABLE_Y, CABLE_Z]), -2.2, 2.2, JR, { tone: 'mid' }, { steps: 16 });
  discAt('joint.end', frameX([CABLE_END_X, CABLE_Y, CABLE_Z]), 0, 1.6, CABLE_Z, { tone: 'mid' }, { steps: 16 });
  const MZ = MV_Z;
  for (const x of [IN_X, OUT_X]) discAt('mv.joint', frameX([x, MV_Y, MZ]), -2.6, 2.6, MJ, { tone: 'mid' }, { steps: 18 });
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
  // the ring cable: out of its cubicle, down to the pavement and along it to a joint in front of the
  // netstation, whose tap loops it into the RMU; the RMU's second ring panel sends it on through the
  // next joint and tap, along the pavement to the next netstation (off the board)
  pieces.push({ name: 'mv.in', r: MV_R, route: G.fillet([MV0, [MV0[0], FACE + 4, MV0[2]], [MV0[0], FACE + 8, MZ],
    [MV0[0], MV_Y, MZ], [IN_X - 2.6, MV_Y, MZ]], 2.4, 7, { P, tube: MV_R }) });
  pieces.push({ name: 'mv.run', r: MV_R, route: [[OUT_X + 2.6, MV_Y, MZ], [MV_END, MV_Y, MZ]] });
  // the taps leave the joints' rims at the netstation floor's height
  const TR = 0.8;
  const TZ = 1.4;
  const tap = (x, y1) => G.fillet([[x, MV_Y - MJ, MZ], [x, MV_Y - MJ - 3, MZ], [x, MV_Y - MJ - 6, TZ], [x, y1, TZ]], 1.6, 7, { P, tube: TR });
  pieces.push({ name: 'mv.tapin', r: TR, route: tap(IN_X, KIOSK.y + KIOSK.d) });
  pieces.push({ name: 'mv.tapout', r: TR, route: tap(OUT_X, KIOSK.y + KIOSK.d) });
  pieces.forEach(({ name, route, r = CABLE_R }) => {
    R.route(name, route, r, { limp: true });
    T.tubePieces(route, r, P, { maxLength: name === 'mv.run' ? 90 : 30, spacing: 1 }).forEach((piece, i) => {
      put(`${name}:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'mid' }), [A.tube(piece.points, piece.radii, { name, limp: true })], { bias: 0.05 });
    });
  });
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
// the flow of current along the ring cable and the street cable (stage.js runs their dashes)
const FLOW_MV = [[FEED_X, FACE + 8, MV_Z + MV_R + 0.4], [FEED_X, MV_Y, MV_Z + MV_R + 0.4], [MV_END, MV_Y, MV_Z + MV_R + 0.4]];
const FLOW = [[FUSE0[0], CABLE_Y, CABLE_Z + 1.2], [CABLE_END_X, CABLE_Y, CABLE_Z + 1.2]];
// TenneT's line: three phases from the tower to the first gantry, the strung bus to the second
// gantry, and a dropper from the bus to each HV bushing of T1 and T2 (drawn over the yard: the
// conductors are the highest things in it)
const sagged = (a, b, sag, n = 18) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t - sag * 4 * t * (1 - t)]);
  }
  return pts;
};
const HV = (() => {
  const towerZ = (s) => (s ? ARM_Z - HANG : TOP_Z);
  const gantryZ = (s) => (s ? BEAM_Z - HANG : GTOP_Z);
  const spans = [];
  const clamps = [];
  const BUS_SAG = 2;
  for (const s of [-1, 0, 1]) {
    const y = LINE_Y + s * PH;
    spans.push(sagged([TOWER_X, y, towerZ(s)], [GANTRY[0], y, gantryZ(s)], 5));
    spans.push(sagged([GANTRY[0], y, gantryZ(s)], [GANTRY[1], y, gantryZ(s)], BUS_SAG));
    clamps.push([TOWER_X, y, towerZ(s)], [GANTRY[0], y, gantryZ(s)], [GANTRY[1], y, gantryZ(s)]);
    for (const cx of TX) {
      const bx = cx + s * 7;
      const t = (bx - GANTRY[0]) / (GANTRY[1] - GANTRY[0]);
      const top = [bx, y, gantryZ(s) - BUS_SAG * 4 * t * (1 - t)];
      spans.push(sagged(top, [bx, TY - 3.5, BUSHING_CAP], 1.5, 8));
      clamps.push(top);
    }
  }
  const d = spans.map((pts) => k.pathOf(pts.map(at))).join('');
  // the flow runs along the middle phase, from the tower to T1's middle bushing
  const t1 = (TX[0] - GANTRY[0]) / (GANTRY[1] - GANTRY[0]);
  const bus = sagged([GANTRY[0], LINE_Y, GTOP_Z], [GANTRY[1], LINE_Y, GTOP_Z], BUS_SAG, 40).filter((p) => p[0] < TX[0]);
  const top = [TX[0], LINE_Y, GTOP_Z - BUS_SAG * 4 * t1 * (1 - t1)];
  const flow = [...sagged([TOWER_X, LINE_Y, TOP_Z], [GANTRY[0], LINE_Y, GTOP_Z], 5), ...bus.slice(1), top, ...sagged(top, [TX[0], TY - 3.5, BUSHING_CAP], 1.5, 8).slice(1)];
  return `<g data-cue="tower">${L(d, { tone: 'mid' })}${Dt(clamps.map(at), { size: 0.5, tone: 'hi' })}<path class="ws-flow" data-k="flowH" d="${k.pathOf(flow.map(at))}"/></g>`;
})();
const world = [
  ...halo,
  ...parts.map(({ item, body }) => `<g${item.attrs ?? ''}>${typeof body === 'string' ? body : body.svg}</g>`),
  HV,
  `<g data-cue="feeder"><path class="ws-flow" data-k="flowF" d="${k.pathOf(FLOW_MV.map(at))}"/></g>`,
  `<g data-cue="cable"><path class="ws-flow" data-k="flow" d="${k.pathOf(FLOW.map(at))}"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('loss', g('lsBase', '') + cue('loss', g('lsRule', '')) + g('lsBars', '')),
  g('ladder', g('laBase', '') + g('laRows', '') + g('laOwn', '')),
  g('mvlv', g('mvBase', '') + g('mvRows', '') + cue('conn', g('mvConn', ''))),
  g('dso', g('dsBase', '') + g('dsTiles', '')),
  g('bound', g('boBase', '') + g('boNet', '') + g('boAsk', '')),
  g('ring', g('riBase', '') + g('riNet', '') + g('riTxt', '')),
  g('kiosk', g('ksBase', '') + g('ksParts', '')),
  g('room', g('ksRoom', '')),
  g('house', g('hoBase', '') + g('hoStreet', '') + g('hoBox', '')),
  g('field', g('fiBase', '') + g('fiTiles', '') + g('fiAsk', '')),
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
const MID = [-45, -20, 30];
const SIDE = (p, w0, w1) => ({ from: cam(p, w0, 104), to: cam(p, w1, 104) });
const TOWER_C = [-290, -82, 60];
const SUB_C = [-200, -60, 24];
const KIOSK_C = [-80, -16, 10];
const CAM = [
  { from: cam(MID, 660), to: cam(TOWER_C, 250, 104), a: 0.32, b: 0.5 },
  SIDE([-280, -82, 70], 250, 230),
  SIDE([-150, 0, 14], 300, 270),
  SIDE([-110, -10, 12], 260, 240),
  { from: cam(SUB_C, 400), to: cam(SUB_C, 230, 104), a: 0.1, b: 0.3 },
  SIDE([-100, 10, 6], 220, 200),
  SIDE(KIOSK_C, 140, 124),
  SIDE([40, -10, 12], 230, 210),
  SIDE(KIOSK_C, 200, 186),
];

// ---------------------------------------------------------------- the film
const DUR = [34, 28, 32, 28, 38, 40, 36, 28, 26];
const C = { dur: DUR, I10, I150 };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.gridbasics.path',
  title: { nl: 'Van onderstation tot stopcontact', en: 'From substation to socket' },
  lessons: [LEV, PATH],
  scenes: [
    {
      id: 's1', lesson: LEV, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Waarom hoogspanning', en: 'Why high voltage' },
      beats: [
        B('Een lijn op masten brengt de stroom van ver naar het onderstation.', 'A line on towers brings power from far away to the substation.', { cues: ['tower', 'yard'] }),
        B('Vermogen = spanning × stroom. Het verlies in de kabel groeit met het kwadraat van de stroom.', 'Power = voltage × current. The loss in a cable grows with the square of the current.', { cues: ['loss'] }),
        B('{n:10} keer de spanning: {n:10} keer minder stroom, {n:100} keer minder verlies.', '{n:10} times the voltage: {n:10} times less current, {n:100} times less loss.', { cues: ['loss'] }),
        B('Voorbeeld: een windpark van {n:100} MW. Op {n:10} kV is dat zo’n {n:5800} A, op {n:150} kV zo’n {n:385} A.', 'Example: a {n:100} MW wind farm. At {n:10} kV that is about {n:5800} A, at {n:150} kV about {n:385} A.', { cues: [] }),
        B('{n:15} keer minder stroom, zo’n {n:225} keer minder verlies. Ver weg hoog, dichtbij omlaag.', '{n:15} times less current, about {n:225} times less loss. High over distance, down near the user.', { cues: ['tower'] }),
      ],
    },
    {
      id: 's2', lesson: LEV, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'De spanningsniveaus', en: 'The voltage levels' },
      beats: [
        B('Bovenaan extra hoogspanning: {n:380} en {n:220} kV.', 'At the top extra-high voltage: {n:380} and {n:220} kV.', { cues: ['ehs'] }),
        B('{t:Hoogspanning}: {n:150} en {n:110} kV, zoals deze lijn.', '{t:High voltage}: {n:150} and {n:110} kV, like this line.', { cue: { Hoogspanning: 'hs' }, cues: ['tower'] }),
        B('{t:TenneT}, eigendom van de Staat, beheert alles van {n:110} kV en hoger.', '{t:TenneT}, owned by the State, runs everything from {n:110} kV up.', { cue: { TenneT: 'tso' }, cues: ['tower'] }),
        B('Daaronder de regionale netbeheerders. Soms eerst tussenspanning: zo’n {n:50} of {n:25} kV.', 'Below that the regional operators. Sometimes an intermediate voltage first: about {n:50} or {n:25} kV.', { cues: ['ts'] }),
      ],
    },
    {
      id: 's3', lesson: LEV, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Midden- en laagspanning', en: 'Medium and low voltage' },
      beats: [
        B('{t:Middenspanning}: meestal {n:10} tot {n:20} kV, van het onderstation naar de netstations.', '{t:Medium voltage}: mostly {n:10} to {n:20} kV, from the substation to the distribution substations.', { cue: { Middenspanning: 'feeder' }, cues: ['ms'] }),
        B('Grote klanten, zoals fabrieken en kassen, hangen direct aan middenspanning.', 'Large customers, such as factories and greenhouses, connect straight to medium voltage.', { cues: ['feeder'] }),
        B('{t:Laagspanning}: {n:400}/{n:230} V, de straatkabels en de huisaansluiting.', '{t:Low voltage}: {n:400}/{n:230} V, the street cables and the house connection.', { cue: { Laagspanning: 'cable' }, cues: ['houses'] }),
        B('Het windpark: op een {n:150} kV-station van TenneT. Een losse windturbine: op middenspanning.', 'The wind farm: on a TenneT {n:150} kV station. A single wind turbine: on medium voltage.', { cues: ['conn'] }),
      ],
    },
    {
      id: 's4', lesson: LEV, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Wie beheert wat', en: 'Who runs what' },
      beats: [
        B('De {t:Regionale netbeheerder|regionale netbeheerder}: Enexis, Liander, Stedin en een paar kleinere.', 'The regional operator, the {t:DSO}: Enexis, Liander, Stedin and a few smaller ones.', { cue: { 'Regionale netbeheerder': 'dso' }, cues: ['feeder', 'station'] }),
        B('Elk heeft een monopolie in zijn eigen gebied.', 'Each has a monopoly in its own area.', { cues: ['dso'] }),
        B('Zij bezitten en beheren het MS- en het LS-net.', 'They own and run the MV and the LV grid.', { cues: ['feeder', 'station', 'cable'] }),
      ],
    },
    {
      id: 's5', lesson: PATH, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Het onderstation', en: 'The substation' },
      beats: [
        B('Het {t:Onderstation|onderstation}: een omheind terrein met grote transformatoren.', 'The {t:Substation|substation}: a fenced yard with big transformers.', { cue: { Onderstation: 'yard' }, cues: ['t1', 't2'] }),
        B('Hier twee van {n:150} naar {n:10} kV. Elders komt ook {n:110} kV binnen, of gaat {n:20} kV uit.', 'Here two from {n:150} to {n:10} kV. Elsewhere {n:110} kV comes in, or {n:20} kV goes out.', { cues: ['t1', 't2'] }),
        B('De MS-rail (busbar): een dikke koperen staaf. Alle MS-kabels vertrekken daarvandaan.', 'The MV busbar: a thick copper bar. Every MV cable leaves from it.', { cues: ['rail', 'swg'] }),
        B('De grens: TenneT de HS-kant, de regionale netbeheerder de MS-kant en de kabels.', 'The boundary: TenneT the HV side, the DSO the MV side and the cables.', { cues: ['t1', 't2', 'tower'] }),
        B('Hier ligt vaak de capaciteit voor een hele stad vast. Vraag: zit de grens aan de HS- of de MS-kant?', 'The capacity for a whole city is often fixed here. Ask: is the limit on the HV or the MV side?', { cues: [] }),
      ],
    },
    {
      id: 's6', lesson: PATH, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'De ring en het openpunt', en: 'The ring and its open point' },
      beats: [
        B('Een {n:10} kV-kabel vertrekt in een ring langs {n:12} netstations, en komt terug.', 'A {n:10} kV cable leaves in a ring past {n:12} distribution substations, and comes back.', { cues: ['ring', 'feeder'] }),
        B('Eén schakelaar staat open: het {t:Normaal openpunt|normaal openpunt}. Elke helft krijgt van één kant stroom.', 'One switch stays open: the {t:Normally open point|normally open point}. Each half is fed from one side.', { cue: { 'Normaal openpunt': 'nop' } }),
        B('Een gesloten ring vraagt een veel ingewikkelder beveiliging (protection) om fouten te vinden.', 'A closed ring needs far more complex protection to find faults.', { cues: ['ring'] }),
        B('Fout tussen netstation {n:6} en {n:7}: de schakelaars aan beide kanten gaan open.', 'A fault between station {n:6} and {n:7}: the switches at both ends are opened.', { cues: [] }),
        B('Dan het normaal openpunt dicht: netstation {n:7} krijgt weer stroom van de andere kant.', 'Then the normally open point is closed: station {n:7} is fed again from the other side.', { cues: ['nop'] }),
      ],
    },
    {
      id: 's7', lesson: PATH, level: 2, dur: DUR[6], still: 0.9, title: { nl: 'In het netstation', en: 'Inside the distribution substation' },
      beats: [
        B('Het {t:Netstation|netstation}, of wijktrafo: het stenen huisje of de groene kast in je straat.', 'The {t:Distribution substation|distribution substation}: the small brick building or green cabinet in your street.', { cue: { Netstation: 'station' } }),
        B('De MS-installatie (switchgear): de schakelaars voor de ring.', 'The MV switchgear: the switches for the ring.', { cues: ['rmu'] }),
        B('De transformator: {n:10} kV naar {n:400} V, hier {n:400} kVA. Meestal {n:400} of {n:630} kVA.', 'The transformer: {n:10} kV to {n:400} V, here {n:400} kVA. Mostly {n:400} or {n:630} kVA.', { cues: ['trafo'] }),
        B('Het LS-rek: een zekering per uitgaande straatkabel. Hier zes.', 'The LV rack: a fuse for each outgoing street cable. Here six.', { cues: ['rack'] }),
        B('In kantoren en bij grote klanten staat de MS-apparatuur vaak in een aparte {t:MS-ruimte|MS-ruimte}.', 'In offices and at large customers the MV equipment is often in a separate {t:MV room|MV room}.', { cue: { 'MS-ruimte': 'msr' } }),
      ],
    },
    {
      id: 's8', lesson: PATH, level: 2, dur: DUR[7], still: 0.9, title: { nl: 'Tot en met de meter', en: 'Up to the meter' },
      beats: [
        B('LS-kabels lopen door de straten, elk voor tientallen woningen. Deze voedt er {n:35}.', 'LV cables run down the streets, each for dozens of homes. This one feeds {n:35}.', { cues: ['cable', 'houses'] }),
        B('Elk huis heeft een aansluitkabel tot de {t:Hoofdzekering|hoofdzekering}: hier {n:3} × {n:25} A.', 'Each home has a connection cable up to the {t:Main fuse|main fuse}: here {n:3} × {n:25} A.', { cue: { Hoofdzekering: 'meter' }, cues: ['fuse'] }),
        B('Daarna de meter. Tot en met de meter is alles van de netbeheerder, daarna van de eigenaar.', 'Then the meter. Up to and including the meter it is the grid operator’s, after it the owner’s.', { cues: ['meter'] }),
      ],
    },
    {
      id: 's9', lesson: PATH, level: 2, dur: DUR[8], still: 0.9, title: { nl: 'Wat je in het veld ziet', en: 'What you see in the field' },
      beats: [
        B('Vaak wordt het openpunt nog met de hand geschakeld: eerst rijdt een monteur naar het station.', 'The open point is often still switched by hand: a fitter drives to the station first.', { cues: ['station'] }),
        B('Nieuwere stations: afstandsbediening en kortsluitverklikkers (fault passage indicators).', 'Newer stations: remote control and fault passage indicators.', { cues: ['rmu'] }),
        B('Daarom duurt herstel in het ene gebied {n:30} minuten en in het andere {n:2} uur.', 'That is why restoring takes {n:30} minutes in one area and {n:2} hours in another.', { cues: [] }),
        B('Vraag dus: waar zit het openpunt, en kunnen we het op afstand schakelen?', 'So ask: where is the open point, and can we switch it remotely?', { cues: [] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this carries every point of both (checklist at
// the top). No "/", "×", "=", "%" or units as symbols in the spoken text: MW,
// kV, kVA, V and A are written out (megawatt, kilovolt, kilovoltampère, volt,
// ampère), HS, MS and LS as hoogspanning, middenspanning and laagspanning, as
// in the grid films; the normaal openpunt is defined word for word as in the
// grid modules (with its "MS-ring"). No spoken parenthesis. Dutch words checked
// with espeak-ng phonemes (Piper's own bridge, films/_kit/voice-ab/phon.py with
// nl_NL-alex-medium). Dutch-only SAY rules in films/_kit/timeline.mjs for this
// film: Enexis, Liander and Stedin (stressed on the first syllable; Stedin only
// after "en" or at a sentence start), Westland and wijktrafo (stressed on the
// head), and hoofdzekering after "aan de" (stressed on "-ke-"); no other film's
// spoken text changes. Reworded instead: straatkabel(s), hoogspanningskant,
// middenspanningskant, middenspanningskabels, laagspanningskabels and
// middenspanningsinstallatie (stressed on the head), and rail (read as the
// English "rail"). Read right: hoogspanningsmast, middenspanning,
// laagspanning, tussenspanning, onderstation, omheind terrein, netstation,
// netbeheerder, normaal openpunt, MS-ring, MS-ruimte, trafohuisje,
// schakelinstallatie, laagspanningsrek, middenspanningsapparatuur,
// aansluitkabel, huisaansluiting, meterkast, bedrijfsvoerders, afstandsbediening,
// kortsluitverklikkers, foutstroom, kilovoltampère, megawatt.
const SAY = [
  [ // s1 why high voltage
    B('De weg van de stroom, van de hoogspanningsmast tot het stopcontact. Maar eerst: waarom komt de stroom van ver binnen op zo’n hoge spanning?',
      'The path of electricity, from the pylon to the socket. But first: why does power arrive from far away at such a high voltage?'),
    B('Vermogen is spanning maal stroom. En de warmte die in een kabel verloren gaat, groeit met het kwadraat van de stroom.',
      'Power is voltage times current. And the heat lost in a cable grows with the square of the current.'),
    B('Maak je de spanning {n:10} keer zo hoog, dan is er voor even veel vermogen {n:10} keer minder stroom nodig, en {n:100} keer minder verlies.',
      'Make the voltage {n:10} times higher, and the same power needs {n:10} times less current, with {n:100} times less loss.'),
    B('Een windpark levert {n:100} megawatt. Op {n:10} kilovolt is dat zo’n {n:5800} ampère, veel te veel voor een normale kabel. Op {n:150} kilovolt zo’n {n:385}.',
      'A wind farm delivers {n:100} megawatts. At {n:10} kilovolts that is about {n:5800} amps, far too much for any normal cable. At {n:150} kilovolts about {n:385}.'),
    B('Dat is {n:15} keer minder stroom, en zo’n {n:225} keer minder verlies in dezelfde kabel. Daarom gaat vermogen ver weg op heel hoge spanning, en pas dicht bij de gebruiker omlaag.',
      'That is {n:15} times less current and about {n:225} times less loss in the same cable. So power travels far at very high voltage, stepped down only near the user.'),
  ],
  [ // s2 the levels
    B('Dan de spanningsniveaus, van boven naar beneden. Bovenaan extra hoogspanning: {n:380} en {n:220} kilovolt.',
      'Then the voltage levels, from the top down. At the top extra-high voltage: {n:380} and {n:220} kilovolts.'),
    B('Daaronder {t:Hoogspanning|hoogspanning}: {n:150} en {n:110} kilovolt, zoals deze lijn.',
      'Below it {t:High voltage|high voltage}: {n:150} and {n:110} kilovolts, like this line.'),
    B('Beide niveaus beheert {t:TenneT}, de landelijke netbeheerder, eigendom van de Staat.',
      'Both are run by {t:TenneT}, the national transmission operator, owned by the state.'),
    B('Daaronder nemen de regionale netbeheerders het over, soms eerst met een tussenspanning van zo’n {n:50} of {n:25} kilovolt.',
      'Below that the regional grid operators take over, in some regions first with an intermediate voltage of about {n:50} or {n:25} kilovolts.'),
  ],
  [ // s3 MV and LV
    B('Dan {t:Middenspanning|middenspanning}, meestal {n:10} tot {n:20} kilovolt: van het onderstation door steden en dorpen naar de netstations in de straten.',
      'Then {t:Medium voltage|medium voltage}, mostly {n:10} to {n:20} kilovolts: from the substation through towns and villages to the distribution substations in the streets.'),
    B('Grote klanten, zoals fabrieken en kassen, sluiten rechtstreeks aan op middenspanning.',
      'Large customers, such as factories and greenhouses, connect straight to medium voltage.'),
    B('De {t:Laagspanning|laagspanning} is {n:400} volt tussen de fasen en {n:230} volt naar de nul: de kabels in de straat en de huisaansluiting. Bijna elke woning en elk klein bedrijf hangt daaraan.',
      '{t:Low voltage|Low voltage} is {n:400} volts between phases and {n:230} volts to neutral: the street cables and the house connection. Nearly every home and small business hangs on it.'),
    B('Het windpark van {n:100} megawatt komt dus op een station van {n:150} kilovolt van TenneT; een losse windturbine of een klein zonnepark op het middenspanningsnet.',
      'So the {n:100} megawatt wind farm connects to a TenneT {n:150} kilovolt station; a single turbine or small solar park to the regional medium-voltage grid.'),
  ],
  [ // s4 who runs what
    B('Middenspanning en laagspanning beheert de {t:Regionale netbeheerder|regionale netbeheerder}: Enexis, Liander en Stedin, plus een paar kleinere, zoals Westland Infra, Coteq en Rendo.',
      'Medium and low voltage belong to the regional operator, the {t:DSO}: Enexis, Liander, Stedin, and smaller ones such as Westland Infra, Coteq and Rendo.'),
    B('Elk heeft een monopolie in zijn eigen gebied. Enexis in grote delen van het noorden, oosten en zuiden. Liander vooral in Gelderland, Noord-Holland, Flevoland en Friesland. Stedin vooral in Zuid-Holland, Utrecht en Zeeland.',
      'Each has a monopoly in its own area. Enexis in large parts of the north, east and south. Liander mainly in Gelderland, North Holland, Flevoland and Friesland. Stedin mainly in South Holland, Utrecht and Zeeland.'),
    B('Zij bezitten en beheren het middenspanningsnet en het laagspanningsnet.',
      'They own and run the medium-voltage and the low-voltage grid.'),
  ],
  [ // s5 the substation
    B('Nu de reis naar een huis in Tilburg. TenneT levert {n:150} kilovolt aan het {t:Onderstation|onderstation}: een omheind terrein waar grote transformatoren de spanning omlaag zetten.',
      'Now the journey to a house in Tilburg. TenneT delivers {n:150} kilovolts to the {t:Substation|substation}: a fenced yard where big transformers step the voltage down.'),
    B('Hier staan er twee, van {n:150} naar {n:10} kilovolt. Elders komt er ook {n:110} kilovolt binnen, of gaat er {n:20} kilovolt uit.',
      'Here there are two, from {n:150} to {n:10} kilovolts. Elsewhere {n:110} kilovolts may come in, or {n:20} kilovolts go out.'),
    B('Ze voeden een dikke koperen staaf op {n:10} kilovolt, waar alle kabels op aansluiten, en vanwaar ze alle kanten op vertrekken.',
      'They feed a busbar at {n:10} kilovolts: a thick copper bar that every cable connects to, and leaves from in all directions.'),
    B('Hier komen het landelijke en het regionale net samen. TenneT beheert de kant van de hoogspanning, de regionale netbeheerder de kant van de middenspanning en de kabels. Wie de transformator daartussen bezit, verschilt per station.',
      'Here the national and the regional grid meet. TenneT runs the high-voltage side, the regional operator the medium-voltage side and the cables. Who owns the transformer in between differs per station.'),
    B('Hier ligt vaak de capaciteit voor een hele stad of regio vast. Loopt een project vast, vraag dan: zit de grens bij TenneT of bij ons, en wie moet in actie komen?',
      'The capacity of a whole city or region is often fixed here. When a project stalls, ask: is the limit on TenneT’s side or ours, and who must act?'),
  ],
  [ // s6 the ring
    B('Kabels op middenspanning liggen in ringen. Deze kabel van {n:10} kilovolt gaat langs {n:12} netstations en komt terug in het onderstation.',
      'Medium-voltage cables lie in rings. This {n:10} kilovolt cable runs past {n:12} distribution substations and comes back to the substation.'),
    B('De ring wordt op één punt open bedreven: het {t:Normaal openpunt|normaal openpunt}. Dat is de schakelaar in een MS-ring die openstaat; je sluit hem om een deel van de andere kant te voeden. Zo krijgt elke helft van één kant stroom.',
      'The ring is run open at one point: the {t:Normally open point|normally open point}. That is the switch in an MV ring that is kept open; you close it to feed a section from the other side. So each half is fed from one side.'),
    B('Een gesloten ring zou een veel ingewikkelder beveiliging vragen om een fout te vinden.',
      'A closed ring would need far more complex protection to find a fault.'),
    B('Valt de kabel uit tussen netstation {n:6} en {n:7}, dan zit die helft zonder stroom. De bedrijfsvoerders openen de schakelaars aan beide kanten van het kapotte stuk.',
      'If the cable fails between station {n:6} and {n:7}, that half is without power. The operators open the switches at both ends of the broken section.'),
    B('Dan sluiten ze het normaal openpunt, en krijgt netstation {n:7} weer stroom van de andere kant. Zo hebben de meeste klanten weer stroom terwijl de kabel gerepareerd wordt.',
      'Then they close the normally open point, and station {n:7} is fed again from the other side. So most customers have power back while the cable is repaired.'),
  ],
  [ // s7 inside the netstation
    B('Netstation {n:7}. Een {t:Netstation|netstation}, ook wel wijktrafo of trafohuisje, is het stenen gebouwtje of de groene kast in je straat.',
      'Station {n:7}. A {t:Distribution substation|distribution substation} is the small brick building or the green cabinet in your street.'),
    B('Binnen eerst de schakelinstallatie: de schakelaars voor de ring, die hier binnenkomt en doorgaat naar het volgende station.',
      'Inside, first the medium-voltage switchgear: the switches for the ring, which comes in here and goes on to the next station.'),
    B('Dan de transformator, van {n:10} kilovolt naar {n:400} volt, hier {n:400} kilovoltampère. Meestal zijn ze {n:400} of {n:630}, oudere {n:250}, sommige nieuwe {n:1000}.',
      'Then the transformer, from {n:10} kilovolts to {n:400} volts, here {n:400} kilovolt amperes. Most are {n:400} or {n:630}, older ones {n:250}, some new ones {n:1000}.'),
    B('Dan het laagspanningsrek, met een zekering per kabel die de straat in gaat. Hier zijn het er zes.',
      'Then the low-voltage rack, with a fuse for each outgoing street cable. Here there are six.'),
    B('Bij kantoren en grote klanten staat de middenspanningsapparatuur vaak in een aparte {t:MS-ruimte|MS-ruimte}.',
      'In offices and at large customers the medium-voltage equipment is often in a separate {t:MV room|MV room}.'),
  ],
  [ // s8 up to the meter
    B('Kabels op laagspanning lopen door de straten, elk voor tientallen woningen. Deze voedt er {n:35}.',
      'Low-voltage cables run down the streets, each for dozens of homes. This one feeds {n:35}.'),
    B('Naar elk huis loopt een aansluitkabel, tot aan de {t:Hoofdzekering|hoofdzekering}: de zekering die de hele aansluiting beveiligt. Hier {n:3} keer {n:25} ampère.',
      'A connection cable runs to each home, up to the {t:Main fuse|main fuse}: the fuse that protects the whole connection. Here {n:3} times {n:25} amps.'),
    B('Daarna de meter in de meterkast. Tot en met de meter is alles van de netbeheerder, daarna van de eigenaar.',
      'Then the meter in the meter cupboard. Up to and including the meter it is the grid operator’s; after it, the owner’s.'),
  ],
  [ // s9 the field
    B('In het veld wordt het openpunt vaak nog met de hand geschakeld: een monteur rijdt eerst naar het station.',
      'In the field the open point is often still switched by hand: a fitter first drives to the station.'),
    B('Nieuwere stations krijgen afstandsbediening en kortsluitverklikkers: kastjes die laten zien langs welk stuk de foutstroom ging.',
      'Newer stations get remote control and fault passage indicators: boxes that show which section the fault current passed.'),
    B('Daarom duurt herstel in het ene gebied {n:30} minuten en in het andere {n:2} uur.',
      'That is why restoring power takes {n:30} minutes in one area and {n:2} hours in another.'),
    B('De scherpe vraag: waar zit het openpunt, en kunnen we het op afstand schakelen?',
      'The sharp question: where is the open point, and can we switch it remotely?'),
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
.mf-wire{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mf-thick{fill:none;stroke:var(--anatomy-hi);stroke-width:6;stroke-linecap:round}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.mf-l2{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-dasharray:9 5;stroke-linecap:round}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-hollow{fill:var(--anatomy-shade-0);stroke:var(--fp-accent);stroke-width:2}
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
  nl: 'Een maquette van het net van mast tot meterkast: links een vakwerkmast met een hoogspanningslijn van TenneT naar een portaal in een omheind onderstation, een gespannen rail naar een tweede portaal en afgaande draden naar de doorvoeren van twee vermogenstransformatoren in olieopvangbakken met een brandmuur ertussen, kabelgoten naar de middenspanningsinstallatie en de rail op isolatoren. Vanuit de installatie loopt een middenspanningsringkabel langs de stoep naar een netstation met open deuren, met een ringkabelinstallatie, een transformator en een laagspanningsrek, en verder naar het volgende station; vanuit het netstation voedt een laagspanningskabel drie rijtjeshuizen met zonnepanelen en meterkasten. Kaarten tonen stroom en verlies op 10 en 150 kV, de spanningsniveaus en wie ze beheert, midden- en laagspanning, de regionale netbeheerders, de grens in het onderstation, de ring met het normaal openpunt en een kabelfout, het netstation van binnen en een MS-ruimte, de huisaansluiting met de hoofdzekering en de meter, en herstel met de hand of op afstand.',
  en: 'A model of the grid from tower to meter cupboard: on the left a lattice tower with a TenneT high-voltage line to a gantry in a fenced substation, a strung bus to a second gantry and droppers to the bushings of two power transformers in oil bunds with a fire wall between them, cable trenches to the medium-voltage switchgear and the busbar on insulators. From the switchgear a medium-voltage ring cable runs along the pavement to a distribution substation with open doors, holding a ring main unit, a transformer and a low-voltage rack, and on to the next station; from the distribution substation a low-voltage cable feeds three terraced houses with solar panels and meter boxes. Cards show current and loss at 10 and 150 kV, the voltage levels and who runs them, medium and low voltage, the regional grid operators, the boundary in the substation, the ring with its normally open point and a cable fault, the inside of the distribution substation and an MV room, the house connection with the main fuse and the meter, and restoring by hand or remotely.',
};
const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path, ${tpls} shared parts`);
  A.auditOrExit(R, P);
}

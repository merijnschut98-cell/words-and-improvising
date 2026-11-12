// Dev tool, not shipped. Builds the explainer film "Een vol net / A full grid"
// for Het elektriciteitsnet: the level 1 lessons of its topics Netcongestie en
// de energietransitie (eng.gridbasics.congestion) and Rollen, regels en geld
// (eng.gridbasics.roles).
//
//   node films/eng.gridbasics.congestion/build.mjs            build the page
//   node films/eng.gridbasics.congestion/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.gridbasics.congestion.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.gridbasics.congestion). The plan row lists the lessons "congestion" and
// "roles"; both ids still exist after the topics x levels rebuild, as level 1
// of their topics, so no mapping was needed. Neither had a film before. The
// higher levels (scarcity, options, transition; law, contract, regulation) are
// not served; their terms (transportschaarste, CSC, GTV, Energiewet, cost-based
// regulation) are named only where these two lessons name them, in the same
// words as those lessons.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of both lessons' teach text and worked example. Checklist (scene):
//   congestion teach 1, definition; consumption or feed-in side; much of the
//     Netherlands full (s1)
//   teach 2, large consumers above 3 x 80 A, about 55 kVA, on a waiting list,
//     thousands waiting; small connections under the same priority rules since
//     July 2026; the public capacity map (s2)
//   teach 3, a new substation 5 to 10 years, MV months to years, scarce
//     technicians, transformers and space; building alone will not do (s3)
//   teach 4, congestion management, GOPACS, the flexible contract, a few
//     hundred hours so a little flex frees a lot (s4, s5)
//   teach 5, priority for social value since 2024 in the order congestion relief,
//     safety, basic needs; the first framework annulled in March 2025, the new one
//     keeps the order (small connections since July 2026: s2); others wait
//     longer; the sharp question (s6)
//   example: 30 MVA, peak 29 MVA, 6 MVA asked, about 7 years (s3); above 24 MVA
//     only 180 h, about 2 % (s4); a cold store shifts 4 MVA for a fee, one firm
//     takes a contract without peak capacity, two of three connect within a
//     year (s5)
//   roles teach 1, five core tasks, the investment plan every two years, the
//     supplier sells energy and you choose it (s7)
//   teach 2, most outages in MV and LV (digger, joint, fuse); 2025 about 23
//     minutes unplanned (23,4), planned about 27 more (27,2); annual outage
//     duration (s8)
//   teach 3, regulated monopoly, the ACM (income, codes, quality), the Energy
//     Act since 1 January 2026 replacing the 1998 act (s9)
//   teach 4, public owners, state capital (Stedin), TenneT owned by the state,
//     political attention (s9)
//   teach 5, more work, scarce technicians, standard work, bigger packages; the
//     sharp question (s9)
//   example: 2,8 million customers, 70 million customer minutes, mostly MV
//     cables, 25 minutes; 3.000 customers x 90 minutes = 270.000; restore by
//     switching before the repair (s8)
//
// The drawing is the street of the film eng.gridbasics.load (its houses,
// netstation with transformer and LV rack, street cable with joints, heat
// pump, inverter and street lamp), with the car and charge point at the end of
// the street replaced by a cold store: insulated panel walls, a loading dock
// with a roller door and buffers, and two condenser units with fans on the
// roof. Cards in stage space carry the day curve against the grid's limit, the
// waiting list and a capacity map, the build times and the full substation, the
// load-duration curve with its 180 hours, GOPACS and the cold store's shift,
// the priority order, the five tasks and the supplier, the outage minutes and
// the worked example, and the regulator; example cards are labelled
// "voorbeeld" (or "schema").
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
// - Large consumer: a connection above 3 x 80 A (Netbeheer Nederland's
//   kleinverbruik limit), 3 x 230 V x 80 A = 55,2 kVA: "zo'n 55 kVA".
// - Waiting list and priority: since 2024 the ACM lets operators put projects
//   with social value first (congestion relief first, then safety such as
//   hospitals and emergency services, then basic needs such as housing and
//   education, as eng.gridplanning words it); the CBb annulled the 2024
//   framework on 11 March 2025 (ECLI:NL:CBB:2025:145; the old one stayed in force
//   until 1 January 2026), and the ACM set a new one on 12 December 2025 with the
//   same three categories in the same order (ACM, "Voorrang maatschappelijke
//   projecten blijft mogelijk met nieuw prioriteringskader"); since 1 July 2026
//   the reservation for small connections has ended and there is one waiting
//   list for small and large (ACM; VNG "Nieuwe ACM-regels: einde voorrang
//   kleinverbruik op stroomnet"). Said as the lesson says it: "mogen voorrang
//   geven", "de rechter vernietigde dat eerste kader". About 15.500 requests waited mid-2026 (the
//   scarcity lesson; not served, so not said here).
// - Capacity map: the public capaciteitskaart of Netbeheer Nederland, per
//   area, for offtake and feed-in.
// - GOPACS: the joint platform of the Dutch grid operators (TenneT and the
//   regional operators) where operators post congestion requests and market
//   parties offer to shift ("vaak via GOPACS", as the lesson).
// - Build times: a new substation often 5 to 10 years (permits, land, cable
//   routes), MV reinforcement months to years: the lesson's hedged range.
// - Outage minutes: Netbeheer Nederland, "Betrouwbaarheid van
//   elektriciteitsnetten in Nederland, Resultaten 2025" (1 April 2026): 23,4
//   minutes from unplanned interruptions (0,316 x 73,9 min), planned work 27,2
//   more (2024: 23,9 and 23,3); said "zo'n 23" and "zo'n 27".
// - Ownership: provinces and municipalities own the regional operators and the
//   law bars private owners; the state put capital into Stedin; TenneT is
//   state-owned. The Energiewet replaced the Elektriciteitswet 1998 on
//   1 January 2026.
const CONG = 'eng.gridbasics.congestion';
const ROLES = 'eng.gridbasics.roles';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const c = lessons.nl.get(CONG);
  const t = c.teach.join('\n');
  assert(t.includes('afnamekant') && t.includes('invoedingskant'), 'two sides');
  assert(t.includes('3 × 80 A, zo’n 55 kVA') && t.includes('Duizenden bedrijven wachten'), 'large consumers and the queue');
  assert(t.includes('sinds juli 2026') && t.includes('capaciteitskaart'), 'small connections and the map');
  assert(t.includes('5 tot 10 jaar') && t.includes('maanden tot jaren'), 'build times');
  assert(t.includes('GOPACS') && t.includes('lager tarief') && t.includes('paar honderd uur'), 'congestion management and flex');
  assert(t.includes('Sinds 2024') && t.includes('eerst projecten die congestie verlichten, dan veiligheid (zoals ziekenhuizen), dan basisbehoeften') && t.includes('vernietigde dat eerste kader in maart 2025'), 'priority');
  const x = c.example.text;
  assert(x.includes('30 MVA') && x.includes('29 MVA') && x.includes('6 MVA extra') && x.includes('zo’n 7 jaar'), 'the full substation');
  assert(x.includes('180 uur per jaar boven de 24 MVA') && x.includes('zo’n 2%'), '180 hours');
  assert(x.includes('4 MVA koeling') && x.includes('Twee van de drie kunnen binnen een jaar aansluiten'), 'the shift');
  const r = lessons.nl.get(ROLES);
  const u = r.teach.join('\n');
  assert(u.includes('vijf kerntaken') && u.includes('Elke twee jaar publiceert hij een investeringsplan'), 'tasks, plan');
  assert(u.includes('Eneco of Vattenfall'), 'suppliers');
  assert(u.includes('in 2025') && u.includes('(23,4, Netbeheer Nederland)') && u.includes('zo’n 27 minuten bovenop (27,2)'), 'outage minutes 2025');
  assert(u.includes('1 januari 2026') && u.includes('Elektriciteitswet 1998'), 'Energiewet');
  assert(u.includes('Stedin') && u.includes('duizenden monteurs'), 'owners, technicians');
  const e = r.example.text;
  assert(e.includes('2,8 miljoen klanten') && e.includes('70 miljoen klantminuten') && e.includes('= 25 minuten'), 'outage example');
  assert(e.includes('3.000 × 90 = 270.000'), 'one big fault');
}
// congestion: 3 × 230 V × 80 A ≈ 55 kVA
assert(near((3 * 230 * 80) / 1000, 55, 0.5), '3 × 80 A ≈ 55 kVA');
// the full substation: 30 MVA, peak 29 MVA, 6 MVA asked; 180 h above 24 MVA ≈ 2 %
const S_SUB = 30;
const PEAK = 29;
const ASK = 6;
const YEARS = 7;
const LIM = 24;
const HRS = 180;
const YEAR_H = 8760;
assert(PEAK + ASK > S_SUB, '29 + 6 does not fit in 30');
assert(Math.round((HRS / YEAR_H) * 100) === 2, '180 / 8.760 ≈ 2 %');
// the cold store shifts 4 MVA out of those hours: the peak falls from 29 to 25 MVA
const SHIFT = 4;
assert(PEAK - SHIFT <= S_SUB - 4, 'the shift frees room under the limit');
// roles: 70 million / 2,8 million = 25 minutes; 3.000 × 90 = 270.000
const CUST = 2.8e6;
const CMIN = 70e6;
assert(CMIN / CUST === 25, '70 million / 2,8 million = 25');
assert(3000 * 90 === 270000, '3.000 × 90 = 270.000');

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
// the cold store at the end of the street, set back behind the pavement
const STORE = { x: 174, y: -84, w: 58, d: 64, r: 0.6 };
const STORE_Z = 38;
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
// meter box, the netstation, its transformer, the street cable or its joints,
// the cold store, the heat pump, the solar panels or the inverter.
const cueOf = (name) => (/^house\.meter/.test(name) ? 'meter'
  : /^(house|roof)\./.test(name) ? 'houses'
    : /^tr\./.test(name) ? 'trafo'
      : /^kiosk\./.test(name) ? 'station'
        : /^joint/.test(name) ? 'joint'
          : /^(cable|branch)/.test(name) ? 'cable'
            : /^hp\./.test(name) ? 'hp'
              : /^store\./.test(name) ? 'cold'
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

// ---------------------------------------------------------------- the cold store: a large consumer at the end of the street
{
  const { x, y, w, d } = STORE;
  const fy = y + d;
  const fx = x + w;
  const z0 = 1.5;
  const ss = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(STORE, -3), 0, 3, P)}" style="opacity:.6"/>`;
  box('store.plinth', k.insetPlan(STORE, -1), 0, z0, { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: ss });
  // insulated sandwich panels: vertical seams on the front and the side, a rail under the coping
  const seams = [];
  for (let sx = x + 6.4; sx < fx - 1; sx += 6.4) if (sx < 184 || sx > 206) seams.push(k.segment([sx, fy, z0], [sx, fy, STORE_Z], P));
  for (let sy = y + 6.4; sy < fy - 1; sy += 6.4) seams.push(k.segment([fx, sy, z0], [fx, sy, STORE_Z], P));
  // the roller door: slats between its guides, and the side door with its handle
  const slats = [];
  for (let z = 6.6; z < 24; z += 1.7) slats.push(k.segment([186, fy, z], [204, fy, z], P));
  const door = poly([[186, fy, 5], [204, fy, 5], [204, fy, 24], [186, fy, 24]]);
  const side = poly([[218, fy, z0], [223, fy, z0], [223, fy, 15], [218, fy, 15]]);
  const inner = `<path class="ws-glass" d="${door}"/>` + L(slats.join(''), { tone: 'faint' }) + L(door + side, { tone: 'lo' })
    + L(seams.join(''), { tone: 'faint' }) + L(k.sideSeam(STORE, STORE_Z - 3, P, 2), { tone: 'faint' })
    + Dt([at([222, fy, 8])], { size: 0.45, tone: 'hi' });
  box('store.walls', STORE, z0, STORE_Z, { tone: 'hi', crease: 'lo' }, { steps: 2, inner });
  box('store.coping', k.insetPlan(STORE, -0.8), STORE_Z, STORE_Z + 1.4, { tone: 'mid' }, { steps: 2, bevel: 0.3 });
  // the door's coil housing, the dock buffers and the loading dock
  box('store.housing', { x: 185, y: fy, w: 20, d: 1.8, r: 0.4 }, 24, 26.6, { tone: 'mid' }, { steps: 2 });
  for (const bx of [182.6, 205.4]) box('store.buffer', { x: bx, y: fy, w: 2, d: 1.4, r: 0.3 }, 6, 10, { tone: 'lo' }, { steps: 2 });
  const tiles = [];
  for (let tx = 184; tx < 208; tx += 4) tiles.push(k.segment([tx, fy + 1, 5], [tx, fy + 7, 5], P));
  box('store.dock', { x: 181, y: fy + 1, w: 28, d: 6, r: 0.3 }, 0, 5, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra: L(tiles.join(''), { tone: 'faint' }) });
  // two condenser units on the roof, each with two fans on top
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
  g('cong', g('cgBase', '') + cue('cong', g('cgCurve', '')) + g('cgTxt', '')),
  g('queue', g('quBase', '') + cue('queue', g('quLine', '')) + cue('map', g('quMap', '')) + g('quTxt', '')),
  g('years', g('yrBase', '') + cue('years', g('yrBars', '')) + cue('sub', g('yrSub', ''))),
  g('ldc', g('ldBase', '') + cue('ldc', g('ldCurve', '')) + g('ldTxt', '')),
  g('flex', g('fxBase', '') + cue('gopacs', g('fxGo', '')) + cue('shift', g('fxShift', '')) + cue('flex', g('fxFlex', ''))),
  g('prio', g('prBase', '') + cue('prio', g('prRows', '')) + g('prTxt', '')),
  g('tasks', g('tkBase', '') + cue('tasks', g('tkRows', '')) + cue('plan', g('tkPlan', '')) + cue('supplier', g('tkSup', ''))),
  g('saidi', g('saBase', '') + cue('saidi', g('saBars', '')) + g('saCalc', '')),
  g('acm', g('acBase', '') + cue('area', g('acArea', '')) + cue('acm', g('acBox', '')) + g('acTxt', '')),
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
const KIOSK_C = [-64, -20, 12];
const STORE_C = [203, -52, 20];
const CAM = [
  { from: cam(MID, 660), to: cam(KIOSK_C, 270, 104), a: 0.3, b: 0.46 },
  SIDE(STORE_C, 300, 270),
  SIDE(KIOSK_C, 250, 228),
  SIDE([-20, -20, 18], 560, 520),
  SIDE(STORE_C, 290, 260),
  SIDE([60, -20, 20], 600, 560),
  SIDE([30, -20, 20], 520, 480),
  SIDE([-30, 18, 4], 230, 210),
  SIDE([60, -20, 20], 640, 600),
];

// ---------------------------------------------------------------- the film
const DUR = [30, 34, 34, 24, 44, 30, 28, 40, 34];
const C = { S_SUB, PEAK, ASK, YEARS, LIM, HRS, YEAR_H, SHIFT, dur: DUR };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.gridbasics.congestion',
  title: { nl: 'Een vol net', en: 'A full grid' },
  lessons: [CONG, ROLES],
  scenes: [
    {
      id: 's1', lesson: CONG, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Een vol net', en: 'A full grid' },
      beats: [
        B('Een straat, een netstation en een koelhuis: allemaal aan hetzelfde net.', 'A street, a distribution substation and a cold store: all on the same grid.', { cues: ['houses', 'station', 'cold'] }),
        B('{t:Netcongestie}: op piekmomenten meer vraag naar transport dan het net veilig draagt.', '{t:Grid congestion}: at peak moments, more demand for transport than the grid can safely carry.', { cue: { Netcongestie: 'cong' } }),
        B('Het knelpunt kan een kabel zijn, een transformator of een heel onderstation.', 'The bottleneck can be a cable, a transformer or a whole substation.', { cues: ['cable', 'trafo'] }),
        B('Aan de afnamekant, zoals een bedrijventerrein, of aan de invoedingskant, zoals zonneparken.', 'On the consumption side, like an industrial area, or on the feed-in side, like solar parks.', { cues: ['cong'] }),
      ],
    },
    {
      id: 's2', lesson: CONG, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'De wachtrij', en: 'The waiting list' },
      beats: [
        B('Een {t:Grootverbruiker|grootverbruiker}: een aansluiting boven {n:3} × {n:80} A, zo’n {n:55} kVA.', 'A {t:Large consumer|large consumer}: a connection above {n:3} × {n:80} A, about {n:55} kVA.', { cue: { Grootverbruiker: 'cold' } }),
        B('In een congestiegebied komen nieuwe en zwaardere aanvragen op een wachtrij.', 'In a congested area, new and bigger requests go on a waiting list.', { cues: ['queue'] }),
        B('Sinds juli 2026 gelden dezelfde voorrangsregels ook voor kleine aansluitingen.', 'Since July 2026 the same priority rules also cover small connections.', { cues: ['houses'] }),
        B('De openbare {t:Capaciteitskaart|capaciteitskaart} laat zien waar nog ruimte is.', 'The public {t:Capacity map|capacity map} shows where there is still room.', { cue: { Capaciteitskaart: 'map' } }),
      ],
    },
    {
      id: 's3', lesson: CONG, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Bouwen duurt jaren', en: 'Building takes years' },
      beats: [
        B('Een nieuw onderstation duurt vaak {n:5} tot {n:10} jaar; MS-verzwaring maanden tot jaren.', 'A new substation often takes {n:5} to {n:10} years; MV reinforcement months to years.', { cues: ['years'] }),
        B('Monteurs, transformatoren en ruimte in de grond zijn allemaal schaars.', 'Technicians, transformers and space underground are all scarce.', { cues: ['trafo', 'cable'] }),
        B('Voorbeeld: een onderstation van {n:30} MVA, piek {n:29} MVA, en {n:6} MVA extra gevraagd.', 'Example: a {n:30} MVA substation, peak {n:29} MVA, and {n:6} MVA more requested.', { cues: ['sub'] }),
        B('Het eerste antwoord: wachten tot het nieuwe onderstation er staat, over zo’n {n:7} jaar.', 'The first answer: wait until the new substation is built, in about {n:7} years.', { cues: ['sub'] }),
      ],
    },
    {
      id: 's4', lesson: CONG, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Maar 180 uur', en: 'Only 180 hours' },
      beats: [
        B('Kijk beter: alle {n:8760} uur van het jaar, van hoog naar laag.', 'Look closer: all {n:8760} hours of the year, from high to low.', { cues: ['ldc'] }),
        B('Boven {n:24} MVA komt het maar {n:180} uur per jaar: zo’n {n:2}% van de tijd.', 'Above {n:24} MVA for only {n:180} hours a year: about {n:2}% of the time.', { cues: ['ldc'] }),
        B('Vol is vaak maar tientallen tot een paar honderd uur per jaar.', 'Full is often only tens to a few hundred hours a year.', { cues: ['ldc'] }),
      ],
    },
    {
      id: 's5', lesson: CONG, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Betaald schuiven', en: 'Paid to shift' },
      beats: [
        B('{t:Congestiemanagement}: klanten betaald om in de piek minder af te nemen of in te voeden.', '{t:Congestion management}: customers paid to use or feed in less at the peak.', { cue: { Congestiemanagement: 'shift' } }),
        B('Netbeheerders kopen die flexibiliteit vaak in via {t:GOPACS}.', 'Grid operators often buy that flexibility through {t:GOPACS}.', { cue: { GOPACS: 'gopacs' } }),
        B('Het koelhuis schuift tegen een vergoeding {n:4} MVA koeling weg uit die uren.', 'For a fee, the cold store shifts {n:4} MVA of cooling out of those hours.', { cues: ['cold', 'shift'] }),
        B('Een {t:Flexibel contract|flexibel contract}: capaciteit behalve op de piekuren, voor een lager tarief.', 'A {t:Flexible contract|flexible contract}: capacity except at peak hours, for a lower tariff.', { cue: { 'Flexibel contract': 'flex' } }),
        B('Eén bedrijf tekent zo’n contract: twee van de drie sluiten binnen een jaar aan.', 'One company signs such a contract: two of the three connect within a year.', { cues: ['flex'] }),
      ],
    },
    {
      id: 's6', lesson: CONG, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'Wie gaat voor?', en: 'Who goes first?' },
      beats: [
        B('Wie krijgt de schaarse capaciteit het eerst? Standaard: wie het eerst komt.', 'Who gets scarce capacity first? By default: first come, first served.', { cues: ['prio'] }),
        B('Sinds 2024 mag voorrang: eerst wat congestie verlicht, dan veiligheid, dan basisbehoeften.', 'Since 2024 priority is allowed: congestion relief first, then safety, then basic needs.', { cues: ['prio'] }),
        B('Bedrijven verderop in de rij wachten daardoor langer.', 'Companies further down the queue wait longer as a result.', { cues: ['prio'] }),
        B('Vraag: hoeveel uur zit dit station echt boven zijn grens, en hoeveel erboven?', 'Ask: for how many hours is this station really over its limit, and by how much?', { cues: ['station'] }),
      ],
    },
    {
      id: 's7', lesson: ROLES, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'De netbeheerder', en: 'The grid operator' },
      beats: [
        B('De regionale netbeheerder sluit aan, transporteert, onderhoudt, herstelt en bouwt.', 'The regional grid operator connects, transports, maintains, restores and builds.', { cues: ['tasks'] }),
        B('Elke twee jaar publiceert hij een {t:Investeringsplan|investeringsplan}.', 'Every two years it publishes an {t:Investment plan|investment plan}.', { cue: { Investeringsplan: 'plan' } }),
        B('Energie verkopen doet een {t:Energieleverancier|energieleverancier}, en die kies je zelf.', 'An {t:Energy supplier|energy supplier} sells the energy, and you choose your own.', { cue: { Energieleverancier: 'supplier' } }),
      ],
    },
    {
      id: 's8', lesson: ROLES, level: 1, dur: DUR[7], still: 0.9, title: { nl: 'Storingen', en: 'Outages' },
      beats: [
        B('De meeste storingen zitten in het MS- en LS-net: een kabel, een mof, een zekering.', 'Most outages are in the MV and LV grid: a cable, a joint, a fuse.', { cues: ['cable', 'joint'] }),
        B('{t:Jaarlijkse uitvalduur}: in 2025 zo’n {n:23} minuten door onvoorziene storingen.', '{t:Outage minutes}: in 2025 about {n:23} minutes from unplanned outages.', { cue: { 'Jaarlijkse uitvalduur': 'saidi' } }),
        B('Voorbeeld: {n:70} miljoen klantminuten / {n:2.8} miljoen klanten = {n:25} minuten.', 'Example: {n:70} million customer minutes / {n:2.8} million customers = {n:25} minutes.', { cues: ['saidi'] }),
        B('Eén MS-storing: {n:3000} klanten × {n:90} minuten = {n:270000} klantminuten.', 'One MV fault: {n:3000} customers × {n:90} minutes = {n:270000} customer minutes.', { cues: ['saidi'] }),
        B('Dus eerst snel terugschakelen, nog voordat de kabel gerepareerd is.', 'So switch customers back quickly, even before the cable is repaired.', { cues: ['cable'] }),
      ],
    },
    {
      id: 's9', lesson: ROLES, level: 1, dur: DUR[8], still: 0.9, title: { nl: 'Gereguleerd', en: 'Regulated' },
      beats: [
        B('Een {t:Gereguleerd monopolie|gereguleerd monopolie}: een eigen gebied, en geen keuze.', 'A {t:Regulated monopoly|regulated monopoly}: its own area, and no choice.', { cue: { 'Gereguleerd monopolie': 'area' } }),
        B('De {t:ACM}: inkomsten, regels in de codes, toezicht op kwaliteit.', 'The {t:ACM}: income, rules in the codes, checks on quality.', { cue: { ACM: 'acm' } }),
        B('Sinds {n:1} januari 2026 geldt de Energiewet. Eigenaar: provincies en gemeenten.', 'Since {n:1} January 2026 the Energy Act applies. Owners: provinces and municipalities.', { cues: ['acm'] }),
        B('Meer werk, te weinig monteurs: waar gaat de dag van een monteur naartoe?', 'More work, too few technicians: where does a technician’s day go?', { cues: [] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this carries every point of both (checklist at
// the top). No "/", "&", "×", "=", "%" or units as symbols in the spoken text:
// MVA and kVA are written out (megavoltampère, kilovoltampère, as the grid-load
// film writes kilovoltampère), MS and LS as middenspanning and laagspanning.
// Terms as in the grid modules and the grid-load film: netcongestie, wachtrij,
// capaciteitskaart, congestiemanagement, GOPACS, flexibel contract, piekbelasting,
// normaal openpunt (eng.gridbasics.path), the priority order with hospitals
// under safety (eng.gridplanning), the Energiewet since 1 January 2026, the ACM
// as "de toezichthouder". Dutch words checked with espeak-ng phonemes (Piper's
// own bridge, films/_kit/voice-ab/phon.py with nl_NL-alex-medium); Dutch SAY
// rules in films/_kit/timeline.mjs for this film: ACM as letters (espeak-ng
// reads the word "akm"; in English too, "ackem"), TenneT as "Tennet" (both
// languages read "Tenne T"), and energiewet, capaciteitskaart,
// energieleverancier, piekuren and "de/een wachtrij" split at the head
// (espeak-ng stresses ener-GIE-wet on "E-", KA-paciteitskaart, energieleveranCIER,
// pie-KUUR-en and wacht-RIJ; "wachtrijen" in the lines film is left as it is).
// congestiemanagement is split the same way (espeak-ng stresses "KON-"). Not
// fixed, for a listen: espeak-ng drops the g of congestie ("kɔŋˈɛsti", in
// netcongestie and congestiegebied too) and stresses IN-vesteringsplan; a
// hyphen makes both worse, and the lexicon takes only words that were listened
// to, so they are left as espeak-ng reads them. Kept out of the narration:
// graafmachine (stressed on "-chine"; said "bij graafwerk"), standaardiseren
// (stressed on "STAN-"), Elektriciteitswet (stressed on "E-"; said "de oude wet
// uit 1998"), capaciteitssturingscontract, voorrangsregels ("-re-GELS"),
// middenspanningskabels ("-KA-bels"), doorgeslagen, decennium and apart
// (stressed on the first syllable), and wonen (read with a short o; said
// woningbouw). Read right: grootverbruiker,
// GOPACS, uitvalduur, klantminuten, koelhuis, onderstation, gereguleerd
// monopolie, prioriteren, normaal openpunt, flexibel contract, Eneco,
// Vattenfall, Stedin, netbeheerder.
const SAY = [
  [ // s1 a full grid
    B('Een straat met een netstation, een kabel naar elk huis, en aan het eind een koelhuis: allemaal aan hetzelfde net.',
      'A street with a distribution substation, a cable to every home, and a cold store at the end: all on the same grid.'),
    B('{t:Netcongestie|Netcongestie} betekent dat op piekmomenten de vraag naar transport groter is dan wat een deel van het net veilig kan dragen.',
      '{t:Grid congestion|Grid congestion} means that at peak moments, the demand for transport is higher than what part of the grid can safely carry.'),
    B('Dat deel kan een kabel zijn, een transformator of een heel onderstation.',
      'That part can be a cable, a transformer or a whole substation.'),
    B('Het kan aan de afnamekant zitten, zoals een bedrijventerrein, of aan de invoedingskant, zoals zonneparken. Grote delen van Nederland zitten vol voor een van beide, of allebei.',
      'It can be on the consumption side, like an industrial area, or on the feed-in side, like solar parks. Large parts of the Netherlands are full for one or both.'),
  ],
  [ // s2 the waiting list
    B('Dit koelhuis is een {t:Grootverbruiker|grootverbruiker}: een aansluiting boven {n:3} maal {n:80} ampère, zo’n {n:55} kilovoltampère, net als een supermarkt, een fabriek of een laadplein.',
      'This cold store is a {t:Large consumer|large consumer}: a connection above {n:3} times {n:80} amps, about {n:55} kilovolt amperes. So is a supermarket, a factory or a charging hub.'),
    B('In een congestiegebied komen nieuwe grootverbruikers, en bestaande die meer willen, op een wachtrij. Duizenden bedrijven wachten.',
      'In a congested area, new large consumers, and existing ones that want more, go on a waiting list. Thousands of companies are waiting.'),
    B('Woningen en winkels hadden aparte capaciteit. Sinds juli 2026 gelden voor hen dezelfde regels voor voorrang, dus soms wachten ook zij.',
      'Homes and small shops had capacity set aside. Since July 2026 they follow the same priority rules, so sometimes they wait too.'),
    B('Waar nog ruimte is, toont de openbare {t:Capaciteitskaart|capaciteitskaart}, voor afname en voor invoeding.',
      'The public {t:Capacity map|capacity map} shows where there is still room, for consumption and for feed-in.'),
  ],
  [ // s3 building takes years
    B('Waarom niet bijbouwen? Een nieuw onderstation duurt vaak {n:5} tot {n:10} jaar: vergunningen, grond, ruimte voor kabels. Middenspanning verzwaren duurt maanden tot jaren.',
      'Why not build more? A new substation often takes {n:5} to {n:10} years: permits, land, space for cables. Reinforcing medium voltage takes months to years.'),
    B('Monteurs, transformatoren en ruimte in de grond zijn schaars. Bouwen alleen lost het voorlopig niet op: het bestaande net moet beter benut worden.',
      'Technicians, transformers and space underground are scarce. Building alone will not solve it for now: the existing grid has to be used better.'),
    B('Een voorbeeld: een onderstation van {n:30} megavoltampère, met een piek van {n:29}. Drie bedrijven willen samen {n:6} megavoltampère erbij.',
      'An example: a {n:30} megavolt ampere substation, with a peak of {n:29}. Three companies together want {n:6} megavolt amperes more.'),
    B('Dat past niet. Het eerste antwoord: een wachtrij, tot er over zo’n {n:7} jaar een nieuw onderstation staat.',
      'That does not fit. The first answer: a waiting list, until a new substation is ready in about {n:7} years.'),
  ],
  [ // s4 only 180 hours
    B('Maar de netbeheerder kijkt beter: alle {n:8760} uur van het jaar op een rij, van hoog naar laag.',
      'But the grid operator looks closer: all {n:8760} hours of the year in a row, from high to low.'),
    B('Boven de {n:24} megavoltampère komt de belasting maar {n:180} uur per jaar. Dat is zo’n {n:2} procent van de tijd.',
      'The load is above {n:24} megavolt amperes for only {n:180} hours a year. That is about {n:2} percent of the time.'),
    B('Zo gaat het vaak: een vol station is meestal maar tientallen tot honderden uren per jaar echt overbelast.',
      'That is typical: a full station is usually only overloaded for tens to a few hundred hours a year.'),
  ],
  [ // s5 paid to shift
    B('{t:Congestiemanagement|Congestiemanagement}: klanten worden betaald of gecontracteerd om op piekmomenten minder af te nemen of in te voeden.',
      '{t:Congestion management|Congestion management} means paying or contracting customers to use less, or feed in less, at peak moments.'),
    B('Netbeheerders kopen die flexibiliteit vaak in via {t:GOPACS|GOPACS}, hun gezamenlijke platform, waar bedrijven aanbieden om te schuiven.',
      'Grid operators often buy that flexibility through {t:GOPACS|GOPACS}, their joint platform, where companies offer to shift.'),
    B('Hier schuift het koelhuis tegen een vergoeding {n:4} megavoltampère koeling weg uit die uren, bijvoorbeeld door eerder te koelen.',
      'Here the cold store shifts {n:4} megavolt amperes of cooling out of those hours for a fee, for example by cooling earlier.'),
    B('Een {t:Flexibel contract|flexibel contract} geeft capaciteit, behalve op de piekuren of voor een vast deel van het jaar, meestal tegen een lager tarief.',
      'A {t:Flexible contract|flexible contract} gives capacity except at peak hours, or for a set share of the year, usually at a lower tariff.'),
    B('Eén bedrijf neemt zo’n contract. Zo sluiten twee van de drie binnen een jaar aan: een beetje flexibiliteit levert veel ruimte op.',
      'One company takes such a contract. So two of the three connect within a year: a little flexibility frees a lot of room.'),
  ],
  [ // s6 who goes first
    B('Wie krijgt de schaarse capaciteit het eerst? Standaard: wie het eerst komt.',
      'Who gets scarce capacity first? By default: whoever comes first.'),
    B('Sinds 2024 mogen netbeheerders van de toezichthouder projecten met maatschappelijke waarde voorrang geven: eerst wat congestie verlicht, dan veiligheid, zoals ziekenhuizen, dan basisbehoeften, zoals woningbouw en scholen. De rechter vernietigde dat eerste kader in 2025; het nieuwe houdt dezelfde volgorde.',
      'Since 2024 the regulator has let grid operators put projects with social value first: congestion relief first, then safety, such as hospitals, then basic needs, such as new housing and schools. A court annulled that first framework in 2025; the new one keeps the same order.'),
    B('Bedrijven verderop in de rij wachten daardoor langer.',
      'Companies further down the queue wait longer as a result.'),
    B('Een scherpe vraag: hoeveel uur zit dit station echt boven zijn grens, en hoeveel erboven?',
      'A sharp question: for how many hours is this station really over its limit, and by how much?'),
  ],
  [ // s7 the grid operator
    B('Wie regelt dit? De regionale netbeheerder: hij sluit klanten aan, transporteert stroom en vaak gas, houdt het net veilig, verhelpt storingen, dag en nacht, en bouwt het net van de toekomst.',
      'Who runs this? The regional grid operator: it connects customers, transports electricity and often gas, keeps the grid safe, restores outages, day and night, and builds the grid of the future.'),
    B('Elke twee jaar publiceert hij een {t:Investeringsplan|investeringsplan}: zijn knelpunten, en wat hij gaat bouwen.',
      'Every two years it publishes an {t:Investment plan|investment plan}: its bottlenecks, and what it will build.'),
    B('Energie verkoopt hij niet. Dat doet een {t:Energieleverancier|energieleverancier}, zoals Eneco of Vattenfall, en die kies je zelf.',
      'It does not sell energy. An {t:Energy supplier|energy supplier} does, such as Eneco or Vattenfall, and you choose your own.'),
  ],
  [ // s8 outages
    B('De meeste storingen zitten in het middenspanningsnet en het laagspanningsnet: een kabel geraakt bij graafwerk, een oude mof, een zekering die doorslaat.',
      'Most outages are in the medium and low voltage grid: a cable hit by digging, an old joint, a blown fuse.'),
    B('Netbeheerders sturen op de {t:Jaarlijkse uitvalduur|jaarlijkse uitvalduur} per klant. In 2025: zo’n {n:23} minuten door onvoorziene storingen, plus zo’n {n:27} door gepland werk. Een van de betrouwbaarste netten van Europa.',
      'Operators track the {t:Outage minutes|outage minutes} per customer per year. In 2025 that was about {n:23} minutes from unplanned outages, plus about {n:27} minutes of planned work. One of the most reliable grids in Europe.'),
    B('Voorbeeld: {n:2.8} miljoen klanten en {n:70} miljoen klantminuten in een jaar, vooral door kapotte kabels in de middenspanning: gemiddeld {n:25} minuten per klant.',
      'Example: {n:2.8} million customers and {n:70} million customer minutes in a year, mostly from medium-voltage cable faults. That is {n:25} minutes per customer.'),
    B('Eén storing waarbij {n:3000} klanten {n:90} minuten zonder stroom zitten, is al {n:270000} klantminuten.',
      'One fault that cuts {n:3000} customers for {n:90} minutes is already {n:270000} customer minutes.'),
    B('Dus eerst de meeste klanten terugschakelen, bijvoorbeeld via het normaal openpunt in de ring, en dan pas de kabel repareren.',
      'So switch most customers back first, for example through the normally open point in the ring, and repair the cable after.'),
  ],
  [ // s9 regulated
    B('Een netbeheerder is een {t:Gereguleerd monopolie|gereguleerd monopolie}. Elk heeft een eigen gebied. Klanten kunnen niet kiezen.',
      'A grid operator is a {t:Regulated monopoly|regulated monopoly}: each has its own area, and customers cannot choose.'),
    B('Daarom bepaalt de {t:ACM|ACM}, de toezichthouder, zijn inkomsten via de tarieven, de regels in de codes, en controleert ze de kwaliteit.',
      'So the {t:ACM|ACM}, the regulator, sets its income through the tariffs, fixes the rules in the codes, and checks quality.'),
    B('Sinds {n:1} januari 2026 geldt de Energiewet, die de wet uit 1998 verving. Eigenaar zijn provincies en gemeenten; verkopen mag niet. De Staat brengt kapitaal in, zoals bij Stedin, en bezit TenneT. Tarieven en de wachtrij zijn landelijk nieuws.',
      'Since {n:1} January 2026 the Energy Act sets the framework, replacing the act of 1998. Provinces and municipalities own the operators, and selling them is not allowed. The state puts in capital, as in Stedin, and owns TenneT. Tariffs and waiting lists are national news.'),
    B('Intussen groeit het werk, en komt de sector duizenden monteurs tekort. Dus werken netbeheerders standaard, in grotere pakketten. De scherpe vraag: waar gaat de dag van een monteur echt naartoe?',
      'Meanwhile the work grows, and the sector is short of thousands of technicians, so operators standardise and plan bigger packages. The sharp question: where does a technician’s day actually go?'),
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
  nl: 'Een straat op een maquette: drie rijtjeshuizen met zonnepanelen en meterkasten, een netstation met open deuren, de transformator en het laagspanningsrek, de straatkabel met moffen en aftakkingen, en aan het eind een koelhuis met een laaddeur en koelunits op het dak. Kaarten tonen de belasting tegen de grens van het net, de wachtrij en een capaciteitskaart, de bouwtijden en het volle onderstation, de belastingduurkromme met 180 uur boven 24 MVA, GOPACS en het schuiven van het koelhuis, de volgorde van voorrang, de vijf taken van een netbeheerder en de energieleverancier, de uitvalminuten met het rekenvoorbeeld, en de ACM.',
  en: 'A street on a model board: three terraced houses with solar panels and meter boxes, a distribution substation with open doors, its transformer and LV rack, the street cable with joints and branches, and at the end a cold store with a loading door and cooling units on the roof. Cards show the load against the grid limit, the waiting list and a capacity map, the build times and the full substation, the load-duration curve with 180 hours above 24 MVA, GOPACS and the cold store shifting, the priority order, the five tasks of a grid operator and the energy supplier, the outage minutes with the worked example, and the ACM.',
};
const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

// Dev tool, not shipped. Builds the explainer film "Flex en batterijen op een
// winteravond / Flex and batteries on a winter evening" for Netplanning en de
// energietransitie: level 2 (eng.gridplanning.flex) and level 3
// (eng.gridplanning.storage) of the topic Flexibiliteit en alternatieven voor
// verzwaren.
//
//   node films/eng.gridplanning.flex/build.mjs            build the page
//   node films/eng.gridplanning.flex/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.gridplanning.flex.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.gridplanning.flex). The plan row lists the lessons "flex" and
// "storage"; both ids still exist after the topics x levels rebuild (flex is
// level 2 and storage level 3 of Flexibiliteit en alternatieven voor
// verzwaren), so no mapping was needed. Neither had a film before; the
// neighbouring levels (alternatives, deferral) are not served. Storyboard
// drift: the plan's five scenes became nine (the kit's maximum), because the
// film now carries both lessons' teach text and worked examples: the profile
// (s1), congestion management (s2), GOPACS and curtailment (s3), the
// contracts (s4), the cold store example (s5), the limits of flex (s6), the
// battery as tap and tank with where it helps (s7), grid or market with the
// time-duration transport right (s8), and the village battery example (s9),
// whose last beat is the plan's scene 5 ("Flex koopt tijd; verzwaren komt
// alsnog"). The plan's "10 MW / 20 MWh = 2 h" is s7.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of both lessons' teach text and worked example. Checklist (scene):
//   flex teach 1, congestion: at some moments more transport than the grid
//     can safely handle; few: a few hundred of the 8.760 hours; flex: a few
//     customers using or feeding in less in those hours lets more customers on
//     the same grid; limiting the top few percent of hours frees a much larger
//     share (s1)
//   teach 2, congestion management with contracts or paid flexibility; the
//     Systeemcode: study before saying no; forecast a day ahead, call the
//     flexible customers, check with metering data (s2); GOPACS, the joint
//     platform, mainly redispatch: one party inside down, one outside up, the
//     national balance holds (s3)
//   teach 3, curtailment; clipping solar farms (the previous lesson, 70 % in
//     its recall) a fixed form; wind and solar farms curtail for a fee; a
//     congestion service provider required for redispatch, placing customers'
//     bids on GOPACS, response within hours (s3)
//   teach 4, contract types with the hedge "names and terms change, check the
//     current rules"; the time-dependent contract (capacity only outside
//     certain hours, such as the evening peak; said as a kind of the
//     congestion film's "flexibel contract"); paid to adjust on request: the
//     CBC, only limiting; since May 2026 largely replaced by the CSC; existing
//     group contracts continue (s4)
//   teach 5, limits: only if the party really responds; forecasting and
//     metering; harder as peaks lengthen, heat pumps; buys time, rarely
//     replaces reinforcement; the debate on who flex payments reward; the
//     question "how many hours a year over its limit, and is that growing?"
//     (s6). Left out: the pointer to the deferral lesson (a cross-reference)
//   flex example: feeder 6 MW, peak 5,8 MW on winter weekdays 17:00-20:00,
//     never above 4,2 outside; a 1,5 MW cold store that pre-cools in the
//     afternoon and stops its compressors for three hours (s1, s5); firm
//     5,8 + 1,5 = 7,3 over 6; time-dependent without 17-20: nothing in the
//     peak, at most 4,2 + 1,5 = 5,7 outside; then check three hours on
//     temperature, agree how to measure, a window that may stretch to
//     16:00-21:00 with heat pumps (s5)
//   storage teach 1, shifts energy in time; MW power (how fast), MWh energy
//     (how much); 10 MW / 20 MWh delivers 10 MW for 2 hours; most grid
//     batteries 1 to 4 hours; a 4-hour peak needs MWh, not only MW (s7)
//   teach 2, behind the bottleneck and steered on the local problem; a solar
//     area: charge at midday, empty in the evening; peak shaving; behind the
//     meter, a factory with a smaller connection; a small battery at a busy
//     LV station delays a transformer swap a few years (s7)
//   teach 3, the day-ahead market (today the price for each hour or quarter
//     of tomorrow) follows national prices, not your feeder; wind lowers
//     prices, maybe in your local evening peak, so it charges at the worst
//     moment; it needs offtake and feed-in capacity; many batteries on one
//     price make new peaks (s8)
//   teach 4, non-firm or time-bound contracts for batteries; the
//     time-duration transport right: at least 85 % of the hours, from
//     TenneT's ATR85 proposal, a standard product on TenneT's grid since April
//     2025; in the other 15 %, up to about 1.300 hours, limited with a day's
//     notice; sharing a connection with a solar farm (s8)
//   teach 5, who steers: the EU Electricity Directive (2019/944, on the card)
//     bars grid operators from owning or operating batteries with a few
//     narrow exceptions, so contracts and prices; the pitfall (wrong hours, a
//     shifted peak); the question "the grid or the market?" (s8)
//   storage example: village LV station 400 kVA, peak 460 kVA 17:00-20:00 on
//     winter weekdays; a cooperative's 150 kW / 300 kWh battery that wants to
//     trade day-ahead; growth 20 kVA a year, the window stays 3 hours; kVA
//     about kW; 60 kW for 3 hours = 180 kWh, it fits only if full at 17:00 on
//     a winter day with little sun; charge at night or early afternoon, no
//     trading 17-20 in the agreement; in 2 years 100 kW x 3 h = 300 kWh, in 3
//     years 120 kW, 360 kWh; it buys about 2 years, then 630 kVA (s9)
//
// The drawing is the grid world of films/eng.gridplanning.loadflow (itself
// the street of eng.gridbasics.load and eng.gridbasics.congestion): the HV/MV
// substation with T1 and T2, the MV switchgear and rail, the MV feeder along
// the pavement to the netstation and on to the cold store at the end of the
// street, the LV cable to three houses with solar panels, a heat pump and an
// inverter. Added beside the netstation: a neighbourhood battery, a
// container with corrugated walls, double doors, a climate unit with its fan,
// a row of charge lamps on the front (stage.js fills them with the charge),
// a power-conversion cabinet with vents in front of it, and the duct
// between them. Cards in stage space carry the winter day profile, the steps
// of congestion management, GOPACS with redispatch and curtailment, the
// contracts, the cold store example, the limits of flex, the tap and tank,
// where a battery helps, grid or market with the 85 % year, and the village
// battery example; illustrative cards say "schema" or "voorbeeld".
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
// text by defineFilm. Facts checked against (2026-11-12), and hedged where the
// lesson hedges:
// - Congestion management and the congestion study: the Netcode (since the
//   Energiewet the Systeemcode) makes a DSO study market-based congestion
//   management before refusing transport; it then works day-ahead with
//   forecasts, calls and settlement on metering data (as the lesson).
// - GOPACS: the joint platform of TenneT and the regional operators (2019);
//   a redispatch order pairs a buy order outside the congested area with a
//   sell order inside it, so the national balance stays (gopacs.eu). Bids go
//   through a congestion service provider (CSP), as the lesson says.
// - CBC and CSC: the capaciteitsbeperkingscontract (limit only) and the
//   capaciteitssturingscontract (limit or raise, the alternatives lesson);
//   the lesson's dates and its own hedge ("namen en voorwaarden veranderen,
//   check de actuele regels") are said as written.
// - Time-duration transport right: TenneT's ATR85 proposal (85 % of the
//   hours), made a standard product by the ACM (code decision 2024, in force
//   April 2025); 15 % of 8.760 h = 1.314 h, "zo'n 1.300 uur", limits
//   announced day-ahead. Time-of-use network tariffs are not in the lessons,
//   so the film says nothing about tariffs.
// - Batteries: most grid-scale lithium batteries in NL are 1-2 h, a few 4 h
//   ("1 tot 4 uur", as the lesson). Directive (EU) 2019/944 art. 36: DSOs
//   shall not own, develop, manage or operate storage, except fully
//   integrated network components or after a failed tender with the
//   regulator's approval; batteries at substations are therefore market or
//   customer batteries (the village battery here is the cooperative's).
// - The day-ahead market (single day-ahead coupling) moved to 15-minute
//   products on 1 October 2025: "elk uur of kwartier", as the lesson.
// - Terms as in the grid films: vaste capaciteit, non-firm (said "non-furm"
//   by the kit), flexibel contract, congestiemanagement, GOPACS, streng,
//   netstation, koelhuis, warmtepomp, verzwaren.
const FLEX = 'eng.gridplanning.flex';
const STO = 'eng.gridplanning.storage';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
{
  const l = lessons.nl.get(FLEX);
  const t = l.teach.join('\n');
  assert(t.includes('een paar honderd van de 8.760 uur') && t.includes('De bovenste paar procent van de uren'), 'few hours');
  assert(t.includes('Systeemcode') && t.includes('een dag vooruit') && t.includes('meetdata'), 'congestion management steps');
  assert(t.includes('GOPACS') && t.includes('één partij binnen het gebied omlaag, één erbuiten omhoog'), 'redispatch');
  assert(t.includes('Aftoppen van zonneparken') && t.includes('congestiedienstverlener') && t.includes('binnen uren'), 'curtailment, CSP');
  assert(t.includes('namen en voorwaarden veranderen') && t.includes('zoals de avondpiek'), 'contract hedge');
  assert(t.includes('capaciteitsbeperkingscontract (CBC)') && t.includes('Sinds mei 2026') && t.includes('capaciteitssturingscontract (CSC)') && t.includes('groepscontracten lopen door'), 'CBC, CSC');
  assert(t.includes('warmtepompen maken van korte pieken lange winteravonden') && t.includes('Het koopt tijd'), 'limits');
  const x = l.example.text;
  assert(x.includes('6 MW') && x.includes('5,8 MW') && x.includes('van 17:00 tot 20:00') && x.includes('4,2 MW') && x.includes('1,5 MW'), 'cold store data');
  assert(x.includes('drie uur uitzetten') && x.includes('5,8 + 1,5 = 7,3 MW') && x.includes('4,2 + 1,5 = 5,7 MW') && x.includes('16:00 tot 21:00'), 'cold store answer');
  assert(l.recall.some((r) => r.q.includes('70%')), 'clipping at 70 %');
  const s = lessons.nl.get(STO);
  const u = s.teach.join('\n');
  assert(u.includes('10 MW / 20 MWh levert 2 uur lang 10 MW') && u.includes('1 tot 4 uur') && u.includes('avondpiek van 4 uur'), 'tap and tank');
  assert(u.includes('achter het knelpunt') && u.includes('achter de meter') && u.includes('trafowissel een paar jaar uitstellen'), 'where it helps');
  assert(u.includes('day-aheadmarkt') && u.includes('elk uur of kwartier') && u.includes('nieuwe pieken'), 'market');
  assert(u.includes('minstens 85% van de uren') && u.includes('ATR85') && u.includes('sinds april 2025') && u.includes('15%, tot zo’n 1.300 uur') && u.includes('een dag van tevoren'), 'time-duration right');
  assert(u.includes('2019/944') && u.includes('het net of de markt'), 'who steers');
  const e = `${s.example.text}\n${s.example.reveal}`;
  assert(e.includes('400 kVA') && e.includes('460 kVA') && e.includes('van 17:00 tot 20:00') && e.includes('150 kW / 300 kWh') && e.includes('20 kVA per jaar'), 'village data');
  assert(e.includes('60 kW gedurende 3 uur: 180 kWh') && e.includes('100 kW × 3 uur = 300 kWh') && e.includes('120 kW, 360 kWh') && e.includes('630 kVA') && e.includes('zo’n 2 jaar'), 'village answer');
}
// flex: feeder 6 MW, peak 5,8, ≤ 4,2 outside 17-20; cold store 1,5
const LIMIT = 6;
const PEAK = 5.8;
const OFF = 4.2;
const STORE_MW = 1.5;
const r1 = (v) => Math.round(v * 10) / 10;
assert(PEAK < LIMIT && r1(PEAK + STORE_MW) === 7.3 && PEAK + STORE_MW > LIMIT, 'firm: 5,8 + 1,5 = 7,3 > 6');
assert(r1(OFF + STORE_MW) === 5.7 && OFF + STORE_MW <= LIMIT, 'time-dependent: 4,2 + 1,5 = 5,7 ≤ 6');
assert(Math.round(10 * 0.7) === 7, '70 % of 10 MWp');
// storage: 10 MW / 20 MWh = 2 h; 85 % of 8.760 h leaves about 1.300 h
assert(20 / 10 === 2, '20 MWh / 10 MW = 2 h');
assert(Math.abs(8760 * 0.15 - 1300) < 20, '15 % of a year ≈ 1.300 h');
// the village: 400 kVA, peak 460 → 60 kW for 3 h = 180 kWh; battery 150 kW / 300 kWh; +20 a year
const TRAFO = 400;
const VPEAK = 460;
const BAT_KW = 150;
const BAT_KWH = 300;
const GROW = 20;
const HOURS = 3;
const over = (y) => VPEAK - TRAFO + GROW * y;
assert(over(0) === 60 && over(0) * HOURS === 180 && over(0) <= BAT_KW && over(0) * HOURS <= BAT_KWH, '60 kW × 3 h = 180 kWh fits');
assert(over(2) === 100 && over(2) * HOURS === 300 && over(2) * HOURS <= BAT_KWH, 'in 2 years 300 kWh');
assert(over(3) === 120 && over(3) * HOURS === 360 && over(3) * HOURS > BAT_KWH, 'in 3 years 360 kWh, over');

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
const cueOf = (name) => (/^(bess|pcs)\./.test(name) ? 'bess' : /^house\.meter/.test(name) ? 'meter'
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

// ---------------------------------------------------------------- the neighbourhood battery beside the netstation
// A battery container on two concrete sleepers: corrugated walls, double
// doors with lock bars on its street end, a climate unit with its fan on the
// front, corner castings, and a row of five charge lamps (stage.js lights one
// per fifth of its energy). A power-conversion cabinet with vents stands
// in front of it, beside the netstation; a covered duct joins the two (stage.js
// runs the battery's current along it).
const BESS = { x: -42, y: -46, w: 20, d: 14, r: 0.4 };
const BESS_Z = [2, 24];
const PCS = { x: -42, y: -26, w: 8, d: 6, r: 0.4 };
const PCS_Z = 15;
const DUCT = { x: -40.6, y: BESS.y + BESS.d, w: 2.4, d: PCS.y - (BESS.y + BESS.d), r: 0.2 };
{
  halo.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BESS, -2), 0, 2, P)}" style="opacity:.6"/>`);
  for (const sx of [BESS.x + 6, BESS.x + BESS.w - 8]) box('bess.sleeper', { x: sx, y: BESS.y - 1, w: 4, d: BESS.d + 2, r: 0.3 }, 0, BESS_Z[0], { tone: 'lo' }, { steps: 2, bevel: 0.2 });
  const fy = BESS.y + BESS.d;
  const fx = BESS.x + BESS.w;
  const [z0, z1] = BESS_Z;
  // corrugation on the long front face, rails top and bottom; the end face carries the doors
  const ribs = [];
  for (let x = BESS.x + 2.4; x < fx - 1.5; x += 2.4) ribs.push(k.segment([x, fy, z0 + 1.6], [x, fy, z1 - 1.6], P));
  const rails = k.segment([BESS.x, fy, z0 + 1.6], [fx, fy, z0 + 1.6], P) + k.segment([BESS.x, fy, z1 - 1.6], [fx, fy, z1 - 1.6], P);
  const ym = BESS.y + BESS.d / 2;
  const doors = k.segment([fx, ym, z0 + 1], [fx, ym, z1 - 1], P)
    + k.pathOf([[fx, BESS.y + 1, z0 + 1], [fx, fy - 1, z0 + 1], [fx, fy - 1, z1 - 1], [fx, BESS.y + 1, z1 - 1]].map(at), true);
  const bars = [BESS.y + 3.4, ym - 2.4, ym + 2.4, fy - 3.4].map((y) => k.segment([fx, y, z0 + 1.6], [fx, y, z1 - 1.6], P)).join('');
  const handles = Dt([ym - 2.4, ym + 2.4].map((y) => at([fx, y, 10])), { size: 0.5, tone: 'hi' });
  // the charge lamps: five small windows on the front, right of the climate unit
  const lamps = [0, 1, 2, 3, 4].map((i) => {
    const x = BESS.x + 11 + i * 1.8;
    return `<path class="ws-lamp" data-k="lamp${i}" d="${k.pathOf([[x, fy, 17], [x + 1.3, fy, 17], [x + 1.3, fy, 19.4], [x, fy, 19.4]].map(at), true)}"/>`;
  }).join('');
  const inner = L(ribs.join(''), { tone: 'faint' }) + L(rails, { tone: 'lo' }) + L(doors + bars, { tone: 'lo' });
  box('bess.box', BESS, z0, z1, { tone: 'hi', crease: 'lo' }, { steps: 2, bevel: 0.3, inner, extra: handles + `<g data-cue="bess">${lamps}</g>` });
  const top = k.insetPlan(BESS, 1.2);
  const casts = k.corners(BESS, 1).map(([x, y]) => at([x, y, z1]));
  box('bess.roof', BESS, z1, z1 + 0.6, { tone: 'mid' }, { steps: 2, extra: L(k.planOutline(top, z1 + 0.6, P, 2), { tone: 'faint' }) + Dt(casts, { size: 0.5 }) });
  // the climate unit on the front face, with its fan
  const hv = { x: BESS.x + 1.6, y: fy, w: 8, d: 2.6, r: 0.4 };
  const c = [hv.x + 4, fy + 2.6, 13.4];
  const fan = `<path class="ws-well" d="${k.sideRing(c, 3, 'y', P)}"/>` + L(k.sideRing(c, 3, 'y', P) + k.sideRing(c, 1.8, 'y', P), { tone: 'lo' }) + Dt([at(c)], { size: 0.45, tone: 'hi' });
  const slots = [8.6, 7.6].map((z) => k.segment([hv.x + 1.4, fy + 2.6, z], [hv.x + 6.6, fy + 2.6, z], P)).join('');
  box('bess.hvac', hv, 6.4, 18, { tone: 'mid' }, { steps: 2, bevel: 0.3, extra: fan + L(slots, { tone: 'lo' }) });
}
{
  // the duct between container and cabinet, its cover in sections
  const joints = [];
  for (let y = DUCT.y + 3.5; y < DUCT.y + DUCT.d - 1; y += 3.5) joints.push(k.lineOnTop([DUCT.x, y], [DUCT.x + DUCT.w, y], 1, P));
  box('bess.duct', DUCT, 0, 1, { tone: 'lo' }, { steps: 2, extra: L(joints.join(''), { tone: 'faint' }) });
  // the power-conversion cabinet: vents and a door on the front, a cap on top
  const fy = PCS.y + PCS.d;
  const vents = [];
  for (const z of [4, 5.6, 7.2]) vents.push(k.pathOf([[PCS.x + 1.2, fy, z], [PCS.x + 6.8, fy, z], [PCS.x + 6.8, fy, z + 0.7], [PCS.x + 1.2, fy, z + 0.7]].map(at), true));
  const door = k.pathOf([[PCS.x + 0.8, fy, 1], [PCS.x + 7.2, fy, 1], [PCS.x + 7.2, fy, 13.6], [PCS.x + 0.8, fy, 13.6]].map(at), true);
  box('pcs.box', PCS, 0, PCS_Z, { tone: 'hi' }, { steps: 2, bevel: 0.3, extra: L(vents.join('') + door, { tone: 'lo' }) + Dt([at([PCS.x + 6, fy, 10.4])], { size: 0.45, tone: 'hi' }) });
  box('pcs.cap', k.insetPlan(PCS, -0.5), PCS_Z, PCS_Z + 0.8, { tone: 'mid' }, { steps: 2 });
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
// the flow of current along the feeder, the street cable and the battery's duct (stage.js runs their dashes)
const FLOW_MV = [[FEED_X, FACE + 8, MV_Z + MV_R + 0.4], [FEED_X, MV_Y, MV_Z + MV_R + 0.4], [MV_END, MV_Y, MV_Z + MV_R + 0.4]];
const FLOW = [[FUSE0[0], CABLE_Y, CABLE_Z + 1.2], [CABLE_END_X, CABLE_Y, CABLE_Z + 1.2]];
const world = [
  ...halo,
  ...parts.map(({ item, body }) => `<g${item.attrs ?? ''}>${typeof body === 'string' ? body : body.svg}</g>`),
  `<g data-cue="feeder"><path class="ws-flow" data-k="flowF" d="${k.pathOf(FLOW_MV.map(at))}"/></g>`,
  `<g data-cue="cable"><path class="ws-flow" data-k="flow" d="${k.pathOf(FLOW.map(at))}"/></g>`,
  `<g data-cue="bess"><path class="ws-flow" data-k="flowB" d="${k.lineOnTop([DUCT.x + DUCT.w / 2, DUCT.y], [DUCT.x + DUCT.w / 2, DUCT.y + DUCT.d], 1.2, P)}"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('prof', g('prBase', '') + g('prCurve', '') + g('prTop', '') + g('prFoot', '')),
  g('cm', g('cmBase', '') + cue('cm', g('cmRows', ''))),
  g('gop', g('goBase', '') + cue('gop', g('goTop', '')) + cue('redis', g('goRedis', '')) + cue('curt', g('goCurt', '')) + g('goCsp', '')),
  g('con', g('coBase', '') + cue('tw', g('coTime', '')) + cue('cbc', g('coCbc', ''))),
  g('lim', g('liBase', '') + g('liRows', '')),
  g('bat', g('baBase', '') + g('baIntro', '') + cue('tank', g('baTank', '')) + cue('tap', g('baTap', '')) + g('baNums', '') + g('baSun', '') + cue('shave', g('baShave', '')) + cue('btm', g('baMeter', ''))),
  g('mkt', g('mkBase', '') + cue('price', g('mkA', '')) + cue('atr', g('mkYear', '')) + g('mkB', '')),
  g('vil', g('viBase', '') + g('viA', '') + g('viB', '')),
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
const STREET_C = [40, -10, 22];
const STORE_C = [196, -40, 18];
const ROOF_C = [80, -40, 50];
const HP_C = [90, -10, 14];
const BESS_C = [-30, -32, 12];
const CAM = [
  { from: cam(MID, 650), to: cam(STREET_C, 250, 104), a: 0.04, b: 0.3 },
  SIDE(SUB_C, 230, 206),
  SIDE(ROOF_C, 240, 216),
  SIDE(STORE_C, 240, 220),
  SIDE(STORE_C, 224, 200),
  SIDE(HP_C, 220, 200),
  SIDE(BESS_C, 210, 170),
  SIDE(BESS_C, 200, 186),
  SIDE([-56, -30, 10], 216, 196),
];

// ---------------------------------------------------------------- the film
const DUR = [30, 22, 30, 26, 36, 26, 40, 46, 40];
const C = { dur: DUR, STORE: STORE_MW, TRAFO, VPEAK, BAT_KW, BAT_KWH, GROW, HOURS };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.gridplanning.flex',
  title: { nl: 'Flex en batterijen op een winteravond', en: 'Flex and batteries on a winter evening' },
  lessons: [FLEX, STO],
  scenes: [
    {
      id: 's1', lesson: FLEX, level: 2, dur: DUR[0], still: 0.9, title: { nl: 'Een piek van drie uur', en: 'A three-hour peak' },
      beats: [
        B('Een streng van {n:6} MW piekt op een winterse werkdag op {n:5.8} MW, van {n:17}:00 tot {n:20}:00.', 'A {n:6} MW feeder peaks at {n:5.8} MW on a winter weekday, from {n:17}:00 to {n:20}:00.', { cues: ['feeder', 'houses', 'hp'] }),
        B('Congestie zit vaak maar een paar honderd van de {n:8760} uur boven de grens.', 'Congestion is often over the limit for only a few hundred of the {n:8760} hours.', { cues: ['feeder'] }),
        B('Beperk een paar klanten in die uren, en er passen veel meer op hetzelfde net.', 'Limit a few customers in those hours, and many more fit on the same grid.', { cues: ['houses', 'factory'] }),
      ],
    },
    {
      id: 's2', lesson: FLEX, level: 2, dur: DUR[1], still: 0.9, title: { nl: 'Congestiemanagement', en: 'Congestion management' },
      beats: [
        B('{t:Congestiemanagement}: de piek sturen met contracten of betaalde flex.', '{t:Congestion management}: steering the peak with contracts or paid flex.', { cue: { Congestiemanagement: 'cm' }, cues: ['swg'] }),
        B('Eerst onderzoeken, dan pas nee: zo eist de Systeemcode.', 'Study first, only then say no: the System Code requires it.', { cues: ['cm'] }),
        B('Een dag vooruit voorspellen, flexibele klanten oproepen, met meetdata controleren.', 'Forecast a day ahead, call the flexible customers, check with metering data.', { cues: ['cm'] }),
      ],
    },
    {
      id: 's3', lesson: FLEX, level: 2, dur: DUR[2], still: 0.9, title: { nl: 'GOPACS en terugregelen', en: 'GOPACS and curtailment' },
      beats: [
        B('Via {t:GOPACS} vooral {t:Redispatch|redispatch}: binnen het gebied omlaag, erbuiten omhoog.', 'Through {t:GOPACS} mainly {t:Redispatch|redispatch}: down inside the area, up outside it.', { cue: { GOPACS: 'gop', Redispatch: 'redis' } }),
        B('{t:Terugregelen}: invoeding of afname beperken als het net vol zit. Aftoppen is een vaste vorm.', '{t:Curtailment}: limiting feed-in or offtake when the grid is full. Clipping is a fixed form.', { cue: { Terugregelen: 'curt' }, cues: ['pv', 'inv'] }),
        B('Voor redispatch is een congestiedienstverlener verplicht: reageren binnen uren.', 'Redispatch requires a congestion service provider: a response within hours.', { cues: [] }),
      ],
    },
    {
      id: 's4', lesson: FLEX, level: 2, dur: DUR[3], still: 0.9, title: { nl: 'Contracten', en: 'Contracts' },
      beats: [
        B('Een {t:Tijdsafhankelijk contract|tijdsafhankelijk contract}: capaciteit, behalve in de avondpiek.', 'A {t:Time-dependent contract|time-dependent contract}: capacity, except in the evening peak.', { cue: { 'Tijdsafhankelijk contract': 'tw' }, cues: ['factory'] }),
        B('Het {t:Capaciteitsbeperkingscontract|capaciteitsbeperkingscontract}, CBC, maakte grotendeels plaats voor het CSC.', 'The {t:Capacity-limiting contract|capacity-limiting contract}, CBC, largely gave way to the CSC.', { cue: { Capaciteitsbeperkingscontract: 'cbc' } }),
      ],
    },
    {
      id: 's5', lesson: FLEX, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Voorbeeld: het koelhuis', en: 'Example: the cold store' },
      beats: [
        B('Voorbeeld: een koelhuis vraagt {n:1.5} MW. Het kan voorkoelen en drie uur uit.', 'Example: a cold store asks for {n:1.5} MW. It can pre-cool and stop for three hours.', { cues: ['factory'] }),
        B('Vast past het niet: {n:5.8} + {n:1.5} = {n:7.3} MW, ruim boven de {n:6}.', 'Firm, it does not fit: {n:5.8} + {n:1.5} = {n:7.3} MW, well above {n:6}.', { cues: ['feeder'] }),
        B('Zonder {n:17}:00 tot {n:20}:00 wel: daarbuiten hooguit {n:4.2} + {n:1.5} = {n:5.7} MW.', 'Without {n:17}:00 to {n:20}:00 it does: outside, at most {n:4.2} + {n:1.5} = {n:5.7} MW.', { cues: ['factory'] }),
        B('Blijft het drie uur koud? Hoe meet je? Rekt het venster op naar {n:16}:00 tot {n:21}:00?', 'Does it stay cold for three hours? How do you meter? Will the window grow to {n:16}:00–{n:21}:00?', { cues: ['factory', 'hp'] }),
      ],
    },
    {
      id: 's6', lesson: FLEX, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'De grenzen van flex', en: 'The limits of flex' },
      beats: [
        B('Flex werkt alleen als de klant echt reageert: voorspellen en meten.', 'Flex only works if the customer really responds: forecasting and metering.', { cues: ['factory'] }),
        B('Warmtepompen maken van korte pieken lange winteravonden.', 'Heat pumps turn short peaks into long winter evenings.', { cues: ['hp'] }),
        B('Flex koopt tijd, maar vervangt zelden verzwaren.', 'Flex buys time, but rarely replaces reinforcement.', { cues: ['feeder'] }),
        B('Vraag: hoeveel uur zit deze streng boven zijn grens, en groeit dat?', 'Ask: how many hours is this feeder over its limit, and is that growing?', { cues: [] }),
      ],
    },
    {
      id: 's7', lesson: STO, level: 3, dur: DUR[6], still: 0.9, title: { nl: 'Een batterij: kraan en tank', en: 'A battery: tap and tank' },
      beats: [
        B('Een batterij naast het netstation: nu laden, later ontladen.', 'A battery beside the substation: charge now, discharge later.', { cues: ['bess', 'station'] }),
        B('{t:MW}: het vermogen, de kraan. {t:MWh}: de energie, de tank.', '{t:MW}: the power, the tap. {t:MWh}: the energy, the tank.', { cue: { MW: 'tap', MWh: 'tank' } }),
        B('{n:10} MW / {n:20} MWh levert {n:10} MW, {n:2} uur lang. De meeste houden {n:1} tot {n:4} uur.', '{n:10} MW / {n:20} MWh delivers {n:10} MW for {n:2} hours. Most last {n:1} to {n:4} hours.', { cues: ['bess'] }),
        B('Achter het knelpunt en lokaal gestuurd helpt hij: ’s middags zon laden, ’s avonds leeg.', 'Behind the bottleneck and steered locally it helps: charge on midday sun, empty at night.', { cues: ['pv', 'bess'] }),
        B('{t:Peak shaving}: pieken aftoppen, {t:Achter de meter|achter de meter} bij een fabriek.', '{t:Peak shaving}: cutting peaks, {t:Behind the meter|behind the meter} at a factory.', { cue: { 'Peak shaving': 'shave', 'Achter de meter': 'btm' }, cues: ['factory'] }),
      ],
    },
    {
      id: 's8', lesson: STO, level: 3, dur: DUR[7], still: 0.9, title: { nl: 'Het net of de markt', en: 'The grid or the market' },
      beats: [
        B('Op de {t:Day-aheadmarkt|day-aheadmarkt} volgt een batterij landelijke prijzen, niet jouw streng.', 'On the {t:Day-ahead market|day-ahead market} a battery follows national prices, not your feeder.', { cue: { 'Day-aheadmarkt': 'price' }, cues: ['bess'] }),
        B('Veel wind maakt stroom goedkoop, ook in jouw piek: dan laadt hij op het slechtste moment.', 'Lots of wind makes power cheap, also in your peak: then it charges at the worst moment.', { cues: ['bess', 'feeder'] }),
        B('{t:Tijdsduurgebonden transportrecht}: transport in minstens {n:85}% van de uren.', '{t:Time-duration transport right}: transport in at least {n:85}% of the hours.', { cue: { 'Tijdsduurgebonden transportrecht': 'atr' }, cues: ['bess'] }),
        B('In de overige {n:15}%, tot zo’n {n:1300} uur, mag het net beperken, een dag vooraf gemeld.', 'In the other {n:15}%, up to about {n:1300} hours, the grid may limit it, announced a day ahead.', { cues: ['bess'] }),
        B('Netbeheerders mogen zelf geen batterijen bezitten of bedrijven: ze sturen via contracten.', 'Grid operators may not own or operate batteries themselves: they steer through contracts.', { cues: ['station'] }),
        B('Wie bepaalt in het piekuur wat de batterij doet: het net of de markt?', 'Who decides what the battery does in the peak hour: the grid or the market?', { cues: ['bess'] }),
      ],
    },
    {
      id: 's9', lesson: STO, level: 3, dur: DUR[8], still: 0.9, title: { nl: 'Voorbeeld: de buurtbatterij', en: 'Example: the local battery' },
      beats: [
        B('Voorbeeld: een trafo van {n:400} kVA in een dorp piekt op {n:460} kVA, van {n:17}:00 tot {n:20}:00.', 'Example: a {n:400} kVA village transformer peaks at {n:460} kVA, from {n:17}:00 to {n:20}:00.', { cues: ['station', 'houses'] }),
        B('Een coöperatie wil een buurtbatterij van {n:150} kW / {n:300} kWh die op de markt handelt.', 'A cooperative wants a {n:150} kW / {n:300} kWh local battery that trades on the market.', { cues: ['bess'] }),
        B('{n:60} kW × {n:3} uur = {n:180} kWh: het past, als hij om {n:17}:00 vol is.', '{n:60} kW × {n:3} hours = {n:180} kWh: it fits, if it is full at {n:17}:00.', { cues: ['bess'] }),
        B('’s Nachts of vroeg in de middag laden, en van {n:17}:00 tot {n:20}:00 niet handelen.', 'Charge at night or early afternoon, and no trading from {n:17}:00 to {n:20}:00.', { cues: ['bess'] }),
        B('De piek groeit {n:20} kVA per jaar: na {n:2} jaar {n:300} kWh, na {n:3} jaar {n:360} kWh.', 'The peak grows {n:20} kVA a year: after {n:2} years {n:300} kWh, after {n:3} years {n:360} kWh.', { cues: ['houses', 'hp'] }),
        B('Zo koopt flex {n:2} jaar tijd. Daarna gaat de trafo alsnog naar {n:630} kVA.', 'So flex buys {n:2} years. Then the transformer still goes to {n:630} kVA.', { cues: ['station'] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this carries every point of both (checklist at
// the top). No "/", "×", "=", "%" or units as symbols in the spoken text: MW,
// MWh, kW, kWh and kVA are written out (megawatt, megawattuur, kilowatt,
// kilowattuur, kilovoltampère), as in the grid films. Clock times are said as
// people say them ("tussen vijf en acht", "five to eight in the evening"), so
// they carry no number markers; the captions show 17:00 and 20:00. The
// abbreviations CBC and CSC are spoken as letters by espeak-ng without help.
// Dutch words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/voice-ab/phon.py with nl_NL-alex-medium). Dutch SAY rules in
// films/_kit/timeline.mjs for this film (no other film says these words):
// redispatch as "riedispetsj" (espeak-ng reads "reedisp-atch" with the ch of
// "lachen"), peak shaving as "piek sjeeving" (it read "pe-ak sjaaving"),
// day-aheadmarkt as "dee-ahed-markt" (it read "daaj-aahe-admarkt"),
// Systeemcode split like Netcode (stressed systeemCOde), the CBC's and CSC's
// long names split after capaciteits- (espeak-ng stresses KA-paciteits... with
// a secondary stress on every part), tijdsduurgebonden split at the head (it
// read "-ɣeebonden" with a long e), trafowissel split (stressed trafoWISsel),
// and piekuur split like piekuren (stressed piek-UUR). Read right:
// congestiemanagement (kit rule), GOPACS, terugregelen, tijdsafhankelijk,
// congestiedienstverlener (the dropped g of congestie is known, as in the
// congestion film), compressoren, voorkoelen, energiecoöperatie, buurtbatterij,
// netbatterijen, flexibel contract, non-firm (kit rule), tijdsgebonden,
// netstation (kit rule), TenneT (kit rule), ACM (kit rule), ATR85 (letters,
// then the number). Kept out of the narration: avondpiek (espeak-ng stresses
// avond-PIEK; a SAY rule would change two other films, so the narration says
// "de piek in de avond" or "jouw piek"), Elektriciteitsrichtlijn and
// richtlijn (stressed on "-lijn"; said "Europese regels", the directive's
// number is on the s8 card), laagspanningsstation (stressed on "-sjon"; said
// netstation, as the grid films call an LS station), meetdata (read
// "meet-aata"; said meetgegevens, the caption keeps meetdata).
const SAY = [
  [ // s1 a three-hour peak
    B('Deze streng mag {n:6} megawatt dragen. Op winterse werkdagen piekt hij van vijf tot acht ’s avonds op {n:5.8}; daarbuiten nooit boven {n:4.2}.',
      'This feeder may carry {n:6} megawatts. On winter weekdays it peaks at {n:5.8} from five to eight in the evening; otherwise never above {n:4.2}.'),
    B('Congestie: soms wordt meer transport gevraagd dan het net veilig aankan, vaak maar een paar honderd van de {n:8760} uur per jaar.',
      'Congestion: at times more transport is requested than the grid can safely handle, often only a few hundred of the {n:8760} hours a year.'),
    B('Nemen een paar klanten in die uren minder af of voeden ze minder in, dan passen er veel meer op hetzelfde net.',
      'If a few customers use or feed in less in those hours, many more fit on the same grid.'),
  ],
  [ // s2 congestion management
    B('{t:Congestiemanagement|Congestiemanagement} is afname of invoeding op piekmomenten sturen, met contracten of betaalde flexibiliteit.',
      '{t:Congestion management|Congestion management} is steering offtake or feed-in at peak moments, with contracts or paid flexibility.'),
    B('Voordat hij nee zegt, onderzoekt de netbeheerder volgens de Systeemcode of dat ruimte maakt.',
      'Before saying no, the operator must study, under the System Code, whether that makes room.'),
    B('Zo ja: de piek een dag vooruit voorspellen, flexibele klanten oproepen en met meetgegevens controleren of ze leverden.',
      'If so: forecast the peak a day ahead, call the flexible customers, check with metering data that they delivered.'),
  ],
  [ // s3 GOPACS, redispatch, curtailment
    B('Via {t:GOPACS|GOPACS}, het gezamenlijke platform van de netbeheerders, koopt hij vooral {t:Redispatch|redispatch}: één partij binnen het gebied omlaag, één erbuiten omhoog, zodat de landelijke balans klopt.',
      'Through {t:GOPACS|GOPACS}, the grid operators’ joint platform, it mainly buys {t:Redispatch|redispatch}: one party inside the area down, one outside up, so the national balance holds.'),
    B('{t:Terugregelen|Terugregelen} is invoeding of afname beperken als het net vol zit. Aftoppen op {n:70} procent is een vaste vorm; wind- en zonneparken doen het ook, tegen vergoeding.',
      '{t:Curtailment|Curtailment} is limiting feed-in or offtake when the grid is full. Clipping at {n:70} percent is a fixed form; wind and solar farms also do it, for a fee.'),
    B('Voor redispatch is een congestiedienstverlener verplicht: die zet biedingen op GOPACS, want reageren moet binnen uren.',
      'Redispatch requires a congestion service provider, who bids on GOPACS: responses must come within hours.'),
  ],
  [ // s4 contracts
    B('Namen en voorwaarden veranderen; check de actuele regels. Een {t:Tijdsafhankelijk contract|tijdsafhankelijk contract}, een soort flexibel contract, garandeert capaciteit alleen buiten bepaalde uren, zoals ’s avonds.',
      'Names and terms change; check the current rules. A {t:Time-dependent contract|time-dependent contract}, a kind of flexible contract, guarantees capacity only outside certain hours, such as evenings.'),
    B('Bij het {t:Capaciteitsbeperkingscontract|capaciteitsbeperkingscontract}, CBC, kreeg een klant betaald om op verzoek te beperken. Sinds mei 2026 vervangt het capaciteitssturingscontract, CSC, het grotendeels; bestaande groepscontracten lopen door.',
      'Under the {t:Capacity-limiting contract|capacity-limiting contract}, CBC, a customer was paid to limit on request. Since May 2026 the capacity steering contract, CSC, has largely replaced it; existing group contracts continue.'),
  ],
  [ // s5 example: the cold store
    B('Voorbeeld: een koelhuis vraagt {n:1.5} megawatt aan; het kan ’s middags voorkoelen en de compressoren drie uur uitzetten.',
      'Example: a cold store asks for {n:1.5} megawatts; it can pre-cool and stop its compressors for three hours.'),
    B('Met vaste capaciteit past het niet: {n:5.8} plus {n:1.5} is {n:7.3}, ruim boven {n:6}.',
      'With firm capacity it does not fit: {n:5.8} plus {n:1.5} is {n:7.3}, well above {n:6}.'),
    B('Met een tijdsafhankelijk contract zonder vijf tot acht wel: daarbuiten hooguit {n:4.2} plus {n:1.5}, dus {n:5.7}.',
      'With a time-dependent contract without five to eight it does: outside that, at most {n:4.2} plus {n:1.5}, so {n:5.7}.'),
    B('Check: blijft het echt drie uur koud, hoe meet je, en rekken warmtepompen het venster op naar vier tot negen?',
      'Check: does it stay cold for three hours, how do you meter, will heat pumps stretch the window to four until nine?'),
  ],
  [ // s6 the limits of flex
    B('Flex werkt alleen als de klant echt reageert, met voorspellen en meten.',
      'Flex only works if the customer really responds, with forecasting and metering.'),
    B('Het wordt lastiger als warmtepompen van korte pieken lange winteravonden maken.',
      'It gets harder as heat pumps turn short peaks into long winter evenings.'),
    B('Flex koopt tijd, maar vervangt zelden verzwaren. Experts twisten of vergoedingen de juiste klanten belonen, of wie toevallig in een congestiegebied zit.',
      'Flex buys time, but rarely replaces reinforcement. Experts argue whether payments reward the right customers, or whoever happens to be in a congestion area.'),
    B('Vraag: hoeveel uur per jaar zit deze streng boven zijn grens, en groeit dat?',
      'Ask: how many hours a year is this feeder over its limit, and is that growing?'),
  ],
  [ // s7 the battery: tap and tank, where it helps
    B('Een batterij verschuift energie in de tijd: nu laden, later ontladen.',
      'A battery shifts energy in time: charge now, discharge later.'),
    B('Megawatt is het vermogen, de kraan: hoe snel hij laadt of ontlaadt. Megawattuur is de energie, de tank: hoeveel erin past.',
      'Megawatts are the power, the tap: how fast it charges or discharges. Megawatt hours are the energy, the tank: how much it holds.'),
    B('{n:10} megawatt met {n:20} megawattuur: {n:2} uur vol vermogen. De meeste houden {n:1} tot {n:4} uur; een piek van {n:4} uur vraagt genoeg megawattuur.',
      '{n:10} megawatts with {n:20} megawatt hours: {n:2} hours at full power. Most last {n:1} to {n:4} hours; a {n:4} hour peak needs enough energy.'),
    B('Hij helpt achter het knelpunt, gestuurd op het lokale probleem: in een zongebied ’s middags laden, ’s avonds leeg.',
      'It helps behind the bottleneck, steered on the local problem: in a solar area, charge at midday, empty by evening.'),
    B('{t:Peak shaving|Peak shaving} is pieken aftoppen: met een batterij {t:Achter de meter|achter de meter}, bij de klant, kan een fabriek met een kleinere aansluiting toe. Bij een druk netstation stelt een kleine batterij een trafowissel jaren uit.',
      '{t:Peak shaving|Peak shaving} is cutting peaks: with a battery {t:Behind the meter|behind the meter}, on the customer’s side, a factory manages with a smaller connection. At a busy substation a small battery delays a transformer swap by years.'),
  ],
  [ // s8 the grid or the market
    B('Op de {t:Day-aheadmarkt|day-aheadmarkt}, waar vandaag de prijs per uur of kwartier van morgen ontstaat, volgt hij landelijke prijzen, niet jouw streng.',
      'On the {t:Day-ahead market|day-ahead market}, where today sets the price for each hour or quarter of tomorrow, it follows national prices, not your feeder.'),
    B('Veel wind maakt stroom goedkoop, misschien net in jouw piek: dan laadt hij op het slechtste moment. Hij vraagt ruimte voor laden én ontladen; veel batterijen op één prijs maken nieuwe pieken.',
      'Wind makes power cheap, maybe right in your peak: then it charges at the worst moment. It needs room to charge and discharge; many batteries on one price make new peaks.'),
    B('Daarom krijgen batterijen vaak non-firm of tijdsgebonden contracten. Een {t:Tijdsduurgebonden transportrecht|tijdsduurgebonden transportrecht}, uit het ATR85-voorstel van TenneT, garandeert transport in minstens {n:85} procent van de uren; sinds april 2025 standaard op dat net.',
      'So batteries often get non-firm or time-bound contracts. A {t:Time-duration transport right|time-duration transport right}, from TenneT’s A T R 85 proposal, guarantees transport in at least {n:85} percent of the hours; standard on that grid since April 2025.'),
    B('In de overige {n:15} procent, tot zo’n {n:1300} uur, mag de netbeheerder beperken, een dag vooraf gemeld. Delen met een zonnepark werkt goed: hij vult het gat van het park.',
      'In the other {n:15} percent, up to about {n:1300} hours, the operator may limit it, with a day’s notice. Sharing with a solar farm works well: it fills the farm’s gap.'),
    B('Europese regels verbieden netbeheerders, op smalle uitzonderingen na, batterijen te bezitten of te bedrijven; ze sturen via contracten en prijzen.',
      'European rules bar grid operators, with narrow exceptions, from owning or operating batteries; they steer through contracts and prices.'),
    B('Valkuil: beperken in de verkeerde uren, omdat de piek verschoof. Wie bepaalt in het piekuur wat hij doet: het net of de markt?',
      'Pitfall: limiting in the wrong hours, because the peak moved. Who decides what it does in the peak hour: the grid or the market?'),
  ],
  [ // s9 example: the village battery
    B('Voorbeeld: het netstation van een dorp heeft {n:400} kilovoltampère en piekt op winterse werkdagen op {n:460}, van vijf tot acht.',
      'Example: a village substation has {n:400} kilovolt amperes and peaks at {n:460} on winter weekdays, from five to eight.'),
    B('Een energiecoöperatie wil een buurtbatterij van {n:150} kilowatt en {n:300} kilowattuur, die op de day-aheadmarkt handelt.',
      'An energy cooperative wants a local battery of {n:150} kilowatts and {n:300} kilowatt hours that trades day-ahead.'),
    B('Reken kilovoltampère hier als kilowatt: te veel is {n:60} kilowatt, {n:3} uur lang, {n:180} kilowattuur. Dat past, als hij om vijf uur vol is, op een winterdag met weinig zon.',
      'Take kilovolt amperes as kilowatts: the excess is {n:60} kilowatts for {n:3} hours, {n:180} kilowatt hours. It fits, if it is full at five on a winter day with little sun.'),
    B('Dus ’s nachts of vroeg in de middag laden, en van vijf tot acht niet handelen: zet dat in de afspraak.',
      'So charge at night or early afternoon, and no trading from five to eight: put that in the agreement.'),
    B('De piek groeit zo’n {n:20} per jaar: over {n:2} jaar {n:100} kilowatt maal {n:3} uur, {n:300} kilowattuur, de hele batterij; over {n:3} jaar {n:120} kilowatt, {n:360}: te veel.',
      'The peak grows about {n:20} a year: in {n:2} years {n:100} kilowatts for {n:3} hours, {n:300} kilowatt hours, the whole battery; in {n:3} years {n:120} kilowatts, {n:360}: too much.'),
    B('Hij koopt zo’n {n:2} jaar; dan gaat de trafo alsnog naar {n:630} kilovoltampère. Flex koopt tijd.',
      'It buys about {n:2} years; then the transformer still goes to {n:630} kilovolt amperes. Flex buys time.'),
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
.ws-lamp{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6px;vector-effect:non-scaling-stroke}
.ws-lamp[data-lit]{fill:var(--fp-accent)}
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
.mf-thick{fill:none;stroke:var(--anatomy-hi);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.mf-l2{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-dasharray:9 5;stroke-linecap:round}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dashr{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-dasharray:5 4}
.mf-dot{fill:var(--anatomy-hi)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.mf-shave{fill:color-mix(in srgb,var(--fp-accent) 35%,transparent);stroke:none}
.mf-topband{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:none}
.mf-home{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-hatchl{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-inv{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.fp-meter[data-alt]{fill:var(--anatomy-lo)}
[data-cue][data-on] .mf-line,[data-cue][data-on] .mf-wire,[data-cue][data-on] .mf-thick{stroke:var(--fp-accent)}
[data-cue][data-on] .mf-tile{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono,[data-cue][data-on] .mf-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 22%,transparent)}
`;

const label = {
  nl: 'Een maquette van een stuk net: links een onderstation met twee vermogenstransformatoren en de middenspanningsinstallatie. Een middenspanningsstreng loopt langs de stoep naar een netstation en verder naar een koelhuis met koelunits op het dak aan het eind van de straat. Naast het netstation staat een buurtbatterij: een container met ribbels, dubbele deuren, een klimaatunit en vijf laadlampjes, met een omvormerkast ervoor. Vanuit het netstation voedt een laagspanningskabel drie rijtjeshuizen met zonnepanelen, een warmtepomp en een omvormer. Kaarten tonen het dagprofiel van de streng op een winterse werkdag, de stappen van congestiemanagement, GOPACS met redispatch en terugregelen, de contracten, het rekenvoorbeeld van het koelhuis, de grenzen van flex, de batterij als kraan en tank, waar een batterij helpt, het net of de markt met het jaar van 85 procent, en het rekenvoorbeeld van de buurtbatterij.',
  en: 'A model of a piece of grid: on the left a substation with two power transformers and the medium-voltage switchgear. A medium-voltage feeder runs along the pavement to a distribution substation and on to a cold store with cooling units on its roof at the end of the street. Beside the distribution substation stands a local battery: a corrugated container with double doors, a climate unit and five charge lamps, with a power-conversion cabinet in front of it. From the substation a low-voltage cable feeds three terraced houses with solar panels, a heat pump and an inverter. Cards show the feeder’s profile on a winter weekday, the steps of congestion management, GOPACS with redispatch and curtailment, the contracts, the cold store example, the limits of flex, the battery as tap and tank, where a battery helps, grid or market with the 85 percent year, and the local battery example.',
};
const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path, ${tpls} shared parts`);
  A.auditOrExit(R, P);
}

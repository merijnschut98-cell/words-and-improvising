// Dev tool, not shipped. Builds the explainer film "Van kortsluiting tot
// uitschakeling / From short circuit to trip" for the grid module
// Schakelinstallaties en beveiliging: level 1 (eng.switchgear.protection) and
// level 2 (eng.switchgear.selectivity) of the topic Beveiliging en kortsluiting.
//
//   node films/eng.switchgear.protection/build.mjs            build the page
//   node films/eng.switchgear.protection/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.switchgear.protection.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.switchgear.protection). The plan row lists the lessons "protection" and
// "selectivity"; both ids still exist after the topics x levels rebuild, as
// levels 1 and 2 of the topic Beveiliging en kortsluiting, so no mapping was
// needed. Levels 3 and 4 (shortcircuit, studies) are not served. Storyboard
// drift: the plan's six scenes are nine here, because the film now carries the
// whole lesson text (see below): measuring (s2) and the relay (s3) are split,
// the worked example gets its own scene (s5), and the settings and their owner
// (protection teach 4-5) get s7.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of both lessons' teach text and worked example. Checklist (scene):
//   protection teach 1: three parts; measuring transformers scale to safe,
//     standard values; CT 400/1 A, 400 A becomes 1 A (1 or 5 A, the pre
//     question and the term); VT 10 kV to about 100 V (s2); the relay compares
//     with its settings, decides, trip signal, the breaker opens (s1, s3)
//   teach 2: overcurrent trips when the current stays above a set value for a
//     set time; two stages: a lower one with a delay (overload, distant
//     faults), a high one almost instant (heavy short circuit close by); the
//     lower above the highest normal load and below the lowest fault current,
//     the current of a fault at the far end of the streng, the outgoing MV
//     cable (s4)
//   teach 3: earth fault: current leaking to earth, measured as the sum of the
//     three phase currents, zero when all is well; the size depends on how the
//     star point is earthed, the common point of the three windings at the
//     transformer; Dutch MV grids differ: resistor, coil or not at all; coil or
//     none: small current, sensitive relays, often directional (which way) (s6)
//   teach 4: digital relays record events and fault currents, which helps after
//     a trip (s3); settings are an engineering product with an owner and a
//     version, like a drawing; a wrong setting: unwanted trips or, worse, none;
//     network changes: check the settings; inverters of a solar or wind park
//     feed fault current that can hide part of a fault from a relay upstream (s7)
//   teach 5: relays with small screens and lamps in the panel doors, test
//     sockets where technicians inject current, many operators test every few
//     years, experts disagree how often self-checking digital relays need it
//     (s3); typical failure: a setting changed on site and never recorded; the
//     sharp question, word for word (s7)
//   example: 10 kV feeder, max load 300 A, smallest fault at the end 2.000 A,
//     CT 400/1 A; stage 1 at 450 A, 1,5 times the max load, 0,5 s delay,
//     450 / 400 = 1,125 A on the relay side; stage 2 at 4.000 A, no delay; a
//     fault at the end (2.000 A) trips on stage 1 after 0,5 s, near the
//     substation (12.000 A) at once on stage 2 (s5)
//   selectivity teach 1: only the protection closest to the fault trips, as few
//     customers off as possible, everything upstream (closer to the source)
//     stays on; an LV street-cable fault blows that cable's fuse in the
//     netstation, not the transformer's MV fuse, and certainly not the feeder
//     breaker in the substation (s8)
//   teach 2: time grading the most used method for relays; closest fastest,
//     each upstream waits a little longer; graded relays sit in substations,
//     switching stations and large customer stations, ordinary netstations
//     have none; the grading margin 0,3 to 0,4 s covers the breaker's opening
//     time, the relay's small run-on (naijlen) and measuring tolerances (s8)
//   teach 3: backup: the nearest breaker fails, the next one up clears the
//     fault later with more customers off; the price is speed (the relay
//     nearest the source waits longest while faults there carry the highest
//     current); experts argue how far; relays that talk over a link trip faster
//     without losing selectivity (s8)
//   teach 4: fuses graded by size and by their time-current curve, a graph of
//     how fast a fuse or relay trips at each current (the definition in s4);
//     rule of thumb for general LV fuses of one type: upstream at least about
//     1,6 times the downstream; between the netstation's MV fuse and the LV
//     fuses engineers compare the curves so the LV fuse goes first (s9)
//   teach 5: without selectivity a small fault becomes a big outage, one bad
//     street cable takes out a ring of 2.000 customers; selectivity breaks when
//     the network changes: a new feed point, a cable section moved to another
//     ring, larger fuses "because they kept blowing"; the sharp question, word
//     for word (s9)
//   example: a netstation feeds six LV cables with 250 A fuses each; one that
//     keeps blowing swapped for 400 A; months later a fault on that cable: the
//     400 A fuse too slow, the transformer's MV fuse first; all six cables,
//     180 homes, instead of 30; the fix: back to 250 A, and find out why it
//     kept blowing, probably an overloaded cable to split or reinforce (s9)
//
// The drawing reuses the worlds of eng.switchgear.devices (the netstation: an
// RMU with three panels, its mimic and sockets, a cable to a 400 kVA
// transformer) and eng.gridplanning.loadflow (the substation's MV switchgear
// and the feeder from it to the netstation): one floor with, at the left, one
// metal-clad feeder panel of the substation (the breaker compartment door with
// its window on the vacuum breaker, the relay with screen, lamps and keys and
// the test block in the door above, the cable compartment open below with
// three cable terminations, a current transformer ring on each and the
// voltage transformer behind); the feeder in its trench to the RMU; at the
// right the LV rack with six fuse ways, one cable each. The feeder of the
// figure eng.switchgear.selectivity (three graded relays along a radial
// feeder, 0,9 / 0,5 / 0,1 s, a 0,4 s step) is the selectivity card. Cards
// carry the measuring transformers, the relay and its milliseconds, the
// time-current curve with the worked example, the earth-fault sum and star
// point earthing, the settings sheet, the selectivity chain and the fuse
// curves; illustrative cards say "schema" or "voorbeeld".
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
// value drifts); {n:...} numbers are then checked against the Dutch lesson text
// by defineFilm. Facts checked against (2026-11-12):
// - Instrument transformers: IEC 61869-2 (CTs, rated secondary 1 A or 5 A) and
//   -3 (VTs, rated secondary 100 V or 110 V in Europe; said "zo'n 100 volt").
// - Overcurrent protection: definite-time stages I> (delayed) and I>>
//   (instantaneous), IEC 60255-151 (ANSI 51/50); the low stage between the
//   highest load and the minimum fault current (ABB, Siemens and Schneider
//   protection application guides). Numerical relays pick up within a few
//   tens of milliseconds; an MV vacuum breaker opens and clears in roughly
//   40-80 ms (about three cycles). Said "enkele tientallen milliseconden",
//   never as one figure; the card has no millisecond values.
// - Earth fault: the residual current, the sum of the three phase currents
//   (Holmgreen connection or a core-balance CT); Dutch MV grids are earthed
//   through a resistor, compensated by a Petersen coil, or isolated (as the
//   lesson); small earth-fault currents need sensitive, often directional
//   earth-fault relays (ANSI 67N).
// - Time grading: a grading margin of 0,3-0,4 s for numerical relays and vacuum
//   breakers covers the breaker's interrupting time, the relay's overshoot and
//   tolerances (IEC 60255 guides; the lesson). Communication-based schemes
//   (blocking, logic selectivity) trip faster without losing selectivity.
// - Fuses: IEC 60269 gG fuses are selective at a rated-current ratio of 1:1,6
//   (said "vuistregel", "minstens zo'n"); MV fuse against LV fuses checked on
//   the curves referred to one voltage. The fuse card is a schema, not
//   manufacturer curves.
const PRO = 'eng.switchgear.protection';
const SEL = 'eng.switchgear.selectivity';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const p = lessons.nl.get(PRO);
  const t = p.teach.join('\n');
  assert(t.includes('400/1 A maakt van 400 A in de kabel 1 A') && t.includes('van 10 kV zo’n 100 V'), 'CT and VT');
  assert(t.includes('vergelijkt die waarden met zijn instellingen') && t.includes('uitschakelsignaal'), 'relay, trip');
  assert(t.includes('een ingestelde tijd boven een ingestelde waarde') && t.includes('twee trappen'), 'overcurrent, two stages');
  assert(t.includes('boven de hoogste normale belasting liggen en onder de laagste foutstroom'), 'low stage window');
  assert(t.includes('de som van de drie fasestromen') && t.includes('via een weerstand, andere via een spoel, of helemaal niet'), 'earth fault, earthing');
  assert(t.includes('richtingsgevoelig') && t.includes('omvormers'), 'directional, inverters');
  assert(t.includes('eigenaar en een versie, net als een tekening'), 'settings like a drawing');
  assert(t.includes('testaansluitingen') && t.includes('om de paar jaar'), 'test sockets');
  assert(t.includes('Wie is eigenaar van deze instellingen, en wanneer zijn ze voor het laatst tegen het net gecontroleerd?'), 'the sharp question');
  assert(p.pre[0].why.includes('veilige, standaard waarden') && p.terms[0].def.includes('1 of 5 A'), '1 or 5 A');
  const x = p.example.text;
  assert(x.includes('300 A') && x.includes('2.000 A') && x.includes('400/1 A') && x.includes('450 A, 1,5 keer') && x.includes('0,5 s vertraging') && x.includes('450 / 400 = 1,125 A'), 'example stage 1');
  assert(x.includes('4.000 A, zonder vertraging') && x.includes('(12.000 A) schakelt direct af op trap twee'), 'example stage 2');
  const s = lessons.nl.get(SEL);
  const u = s.teach.join('\n');
  assert(u.includes('niet de MS-zekering van de transformator') && u.includes('vermogensschakelaar van het veld in het onderstation'), 'selectivity chain');
  assert(u.includes('onderstations, schakelstations en grote klantstations') && u.includes('gewone netstations hebben er geen'), 'where relays sit');
  assert(u.includes('meestal 0,3 tot 0,4 s') && u.includes('naijlen'), 'grading margin');
  assert(u.includes('1,6 keer') && u.includes('2.000 klanten'), '1,6 and 2.000');
  assert(u.includes('Welk apparaat had deze fout moeten afschakelen, en waarom deed het dat niet?'), 'the selectivity question');
  const e = s.example.text;
  assert(e.includes('zes LS-kabels') && e.includes('250 A') && e.includes('400 A') && e.includes('180 woningen') && e.includes('in plaats van 30') && e.includes('gesplitst of verzwaard'), 'fuse example');
}
// the worked example
const CT = [400, 1];
const LOAD = 300;
const FMIN = 2000;
const S1 = 450;
const T1 = 0.5;
const S2 = 4000;
const FNEAR = 12000;
const RELAY_A = S1 / CT[0];
assert(S1 === 1.5 * LOAD && near(RELAY_A, 1.125, 1e-12), 'stage 1 = 1,5 × 300 = 450 A, 1,125 A secondary');
assert(S1 > LOAD && S1 < FMIN, 'stage 1 between the load and the smallest fault');
assert(FMIN < S2 && FNEAR > S2, 'the end fault stays on stage 1, the near fault reaches stage 2');
// the selectivity card (after the figure eng.switchgear.selectivity): 0,1 / 0,5 / 0,9 s, a 0,4 s step
const GRADE = [0.9, 0.5, 0.1];
const STEP = 0.4;
assert(GRADE.every((g, i) => i === 0 || near(GRADE[i - 1] - g, STEP, 1e-9)) && STEP >= 0.3 && STEP <= 0.4, 'grading within 0,3 to 0,4 s');
// the fuse example
const FUSE = [250, 400];
const HOMES = [30, 180];
assert(HOMES[1] === 6 * HOMES[0], 'six cables of 30 homes each');

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the front, +y toward the viewer.
// The top of the floor is z = 0. The substation's feeder panel stands at the
// left (x < -230), the netstation (the devices film's) in the middle, its LV
// rack at the right.
const W = 640;
const H = 400;
const FLOOR = -6;
const SLAB = { x: -336, y: -56, w: 540, d: 120, r: 2 };
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
// the feeder panel: a metal-clad cubicle, its cable compartment open
const CU = { x: -300, y: -40, w: 64, d: 72, r: 1 };
const CFY = CU.y + CU.d;
const CCX = CU.x + CU.w / 2;
const CU_Z = { base: 8, low: 80, top: 200 };
// the LV rack beside the transformer
const RK = { x: 150, y: -28, w: 40, d: 16, r: 0.6 };
const RKY = RK.y + RK.d;
const RK_Z = 100;
const WAYS = 6;
const WAY_X = (i) => RK.x + 3.4 + i * 5.8;

const FIT = [
  ...k.boxCorners(SLAB, FLOOR, 0),
  ...k.boxCorners({ x: CU.x, y: CU.y, w: CU.w, d: CU.d }, 0, CU_Z.top + 3),
  ...k.boxCorners({ x: TANK.x, y: TANK.y, w: TANK.w, d: TANK.d }, 0, TANK_TOP + 4),
  ...k.boxCorners(RK, 0, RK_Z + 2),
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

// ---------------------------------------------------------------- recorder
// Each part carries the cues of its assembly (outermost first), so a term can
// light the feeder panel's CT rings, its VT, the relay, the test block, the
// breaker door, the cable, the RMU's fuse compartment or the LV fuse ways.
const cuesOf = (name) => {
  if (/^cu\.ct/.test(name)) return ['cu', 'ct'];
  if (/^cu\.vt/.test(name)) return ['cu', 'vt'];
  if (/^cu\.relay/.test(name)) return ['cu', 'relay'];
  if (/^cu\.test/.test(name)) return ['cu', 'test'];
  if (/^cu\.door/.test(name)) return ['cu', 'cb'];
  if (/^cu\.(cable|term|bar)/.test(name)) return ['cu', 'feeder'];
  if (/^cu\./.test(name)) return ['cu'];
  if (/^rmu\.cover2/.test(name)) return ['rmu', 'mvfuse'];
  if (/^rmu\./.test(name)) return ['rmu'];
  if (/^trafo\./.test(name)) return ['trafo'];
  if (/^cable/.test(name)) return ['cable'];
  if (/^rack\.way3/.test(name)) return ['rack', 'lv', 'lv400'];
  if (/^rack\.(way|lv)/.test(name)) return ['rack', 'lv'];
  if (/^rack\./.test(name)) return ['rack'];
  if (/^floor\.trench/.test(name)) return ['feeder'];
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

// ---------------------------------------------------------------- the floor
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(SLAB, -2), FLOOR, 2, P)}"/>`,
];
const TRENCH = { x: CU.x + CU.w + 6, y: 36, w: -54 - (CU.x + CU.w + 6), d: 9, r: 0.6 };
{
  const anchors = k.corners(SLAB, 5);
  const seams = [];
  for (let x = TRENCH.x + 24; x < TRENCH.x + TRENCH.w - 4; x += 24) seams.push(k.segment([x, TRENCH.y, 0], [x, TRENCH.y + TRENCH.d, 0], P));
  const extra = L(k.planOutline(k.insetPlan(SLAB, 3), 0, P, 3), { tone: 'faint' })
    + L(anchors.map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 })
    // the line between the substation's floor and the netstation's
    + L(k.segment([-236 + 14, SLAB.y + 3, 0], [-236 + 14, TRENCH.y - 2, 0], P), { tone: 'faint' })
    // the cable trench covers from the feeder panel to the RMU: plates with their seams and lifting holes
    + L(k.planOutline(TRENCH, 0, P, 2), { tone: 'lo' }) + L(seams.join(''), { tone: 'faint' })
    + Dt(seams.map((s, i) => at([TRENCH.x + 12 + i * 24, TRENCH.y + TRENCH.d / 2, 0])), { size: 0.4 })
    // the feeder's route on the covers (lit with the feeder)
    + `<g data-cue="feeder"><path class="mf-feed" d="${k.segment([TRENCH.x + 1, TRENCH.y + TRENCH.d / 2, 0], [TRENCH.x + TRENCH.w - 1, TRENCH.y + TRENCH.d / 2, 0], P)}"/></g>`;
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
    discAt(`rmu.${kind}${i}`, F, 0, 1.4, 2.3, { tone: 'mid' }, { steps: 20, extra: `<path class="mf-well" d="${G.circleOf(F, 1.4, 1.1, P, 18)}"/>` + Dt([at([cx + dx, FF + 1.4, 64.5 + 1.7])], { size: 0.3, tone: 'hi' }) });
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
for (let j = 0; j < 9; j++) box('trafo.fin', { x: TR.x + 3 + j * 6.2, y: TRY, w: 1.4, d: 8, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
for (let j = 0; j < 6; j++) box('trafo.fin', { x: TR.x + TR.w, y: TR.y + 3 + j * 6.4, w: 8, d: 1.4, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
// three LV bushings and the neutral on the lid
for (const [j, x] of [92, 102, 112, 122].entries()) {
  const y = 4;
  const z0 = TR_Z[1] + 3;
  // the porcelain body with two sheds, one turned solid
  // the porcelain body, its sheds drawn as rings round it (lighter than turned sheds)
  post('trafo.bush', x, y, 1.9, z0, z0 + 7, { tone: 'hi', crease: 'none' }, { steps: 14, inner: L([2.6, 5].map((h) => k.sideArc(x, y, 1.9, z0 + h, P, 10)).join(''), { tone: 'lo' }) });
  post('trafo.stud', x, y, 0.8, z0 + 7, z0 + 9.5, { tone: 'mid', crease: 'none' }, { steps: 12, extra: Dt([at([x, y, z0 + 9.5])], { size: 0.35, tone: 'hi' }) });
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

// ---------------------------------------------------------------- the feeder panel in the substation
// A metal-clad cubicle: base frame, the cable compartment open at the front
// (back wall, two side walls, its door swung open to the left), the upper body
// with the breaker compartment door (a window on the three vacuum bottles,
// the mimic, close and open buttons and the position flag) and the relay door
// above (the relay with its screen, lamps and keys, the test block under it).
{
  const base = { x: CU.x - 1, y: CU.y - 1, w: CU.w + 2, d: CU.d + 2, r: 0.6 };
  box('cu.base', base, 0, CU_Z.base, { tone: 'lo' }, {
    steps: 2, bevel: 0.3, inner: L(k.sideSeam(base, 2.5, P, 2), { tone: 'faint' }),
    extra: Dt(k.corners(base, 2).map(([x, y]) => at([x, y, CU_Z.base])), { size: 0.42 }),
  });
  const z0 = CU_Z.base;
  const z1 = CU_Z.low;
  box('cu.back', { x: CU.x, y: CU.y, w: CU.w, d: 2, r: 0.2 }, z0, z1, { tone: 'mid' }, { steps: 1 });
  box('cu.left', { x: CU.x, y: CU.y + 2, w: 2, d: CU.d - 2, r: 0.2 }, z0, z1, { tone: 'mid' }, { steps: 1 });
  const vents = [];
  for (const z of [22, 26, 30, 34]) vents.push(k.pathOf([[CU.x + CU.w, CU.y + 18, z], [CU.x + CU.w, CU.y + 46, z], [CU.x + CU.w, CU.y + 46, z + 1.4], [CU.x + CU.w, CU.y + 18, z + 1.4]].map(at), true));
  box('cu.right', { x: CU.x + CU.w - 2, y: CU.y + 2, w: 2, d: CU.d - 2, r: 0.2 }, z0, z1, { tone: 'mid' }, { steps: 1, extra: L(vents.join(''), { tone: 'lo' }) });
  // the door of the cable compartment, open to the left, with its louvres
  const leaf = { x: CU.x - 2.4, y: CFY, w: 1.2, d: 30, r: 0.2 };
  const louv = [];
  for (const z of [24, 30, 36, 42]) louv.push(k.pathOf([[CU.x - 1.2, CFY + 8, z], [CU.x - 1.2, CFY + 22, z], [CU.x - 1.2, CFY + 22, z + 1.6], [CU.x - 1.2, CFY + 8, z + 1.6]].map(at), true));
  box('cu.leaf', leaf, 0, z1 - 2, { tone: 'hi' }, { steps: 1, extra: L(louv.join(''), { tone: 'lo' }) });
  // the upper body: a weld seam round it and the panel's name plate on its side
  const up = { x: CU.x, y: CU.y, w: CU.w, d: CU.d, r: 1 };
  box('cu.upper', up, z1, CU_Z.top, { tone: 'mid' }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(up, z1 + 72, P, 2) + k.sideSeam(up, CU_Z.top - 4, P, 2), { tone: 'faint' }) });
  const roof = { x: CU.x - 1, y: CU.y - 1, w: CU.w + 2, d: CU.d + 2, r: 1 };
  box('cu.roof', roof, CU_Z.top, CU_Z.top + 3, { tone: 'mid' }, { steps: 2, bevel: 0.3, extra: L(k.planOutline(k.insetPlan(roof, 4), CU_Z.top + 3, P, 2), { tone: 'faint' }) + Dt(k.corners(roof, 2).map(([x, y]) => at([x, y, CU_Z.top + 3])), { size: 0.42 }) });
}
// the three cables up from the floor: a cable, the CT ring round it, the cable on, a termination and a bar to the bushing plate
const CABLES = [CCX - 18, CCX - 4, CCX + 10];
const CY = CU.y + 30;
for (const [i, x] of CABLES.entries()) {
  post(`cu.cable${i}`, x, CY, 2.2, CU_Z.base, 34, { tone: 'lo' }, { steps: 12 });
  post(`cu.ct${i}`, x, CY, 5, 34, 42, { tone: 'hi' }, { steps: 22, bevel: 0.3, extra: L(k.ring(x, CY, 2.6, 42, P, 18), { tone: 'mid' }) + Dt([at([x + 3.8, CY + 2, 38])], { size: 0.35, tone: 'mid' }) });
  post(`cu.cable${i}b`, x, CY, 2.2, 42, 56, { tone: 'lo' }, { steps: 12 });
  post(`cu.term${i}`, x, CY, 3, 56, 66, { tone: 'hi', crease: 'none' }, { steps: 14, inner: L([59, 62.5].map((z) => k.sideArc(x, CY, 3, z, P, 10)).join(''), { tone: 'lo' }) });
  post(`cu.termcap${i}`, x, CY, 1.6, 66, 68, { tone: 'mid' }, { steps: 10 });
  post(`cu.bar${i}`, x, CY, 1, 68, CU_Z.low, { tone: 'mid' }, { steps: 12 });
}
// the voltage transformer at the back right of the compartment, two small bushings on top
{
  const vt = { x: CCX + 18, y: CU.y + 4, w: 10, d: 13, r: 0.6 };
  box('cu.vt', vt, CU_Z.base, 30, { tone: 'hi' }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(vt, 26, P, 2), { tone: 'faint' }) });
  for (const dy of [3.5, 9.5]) post('cu.vtbush', vt.x + 5, vt.y + dy, 1.1, 30, 34, { tone: 'hi', crease: 'none' }, { steps: 12, extra: Dt([at([vt.x + 5, vt.y + dy, 34])], { size: 0.35, tone: 'hi' }) });
}
// the breaker compartment door: the window on the three vacuum bottles, the mimic, two buttons, the position flag
{
  const fy = CFY + 0.8;
  const x0 = CU.x + 3;
  const x1 = CU.x + CU.w - 3;
  const fr = (a, b, c, d, r = 0.6) => `<path class="mf-glass" d="${flatRect(a, b, c, d, r, 3)}"/><path class="iso-line" data-tone="lo" d="${flatRect(a, b, c, d, r, 3)}"/>`;
  let face = fr(x0 + 6, 116, x1 - 6, 146, 1);
  // the three bottles behind the glass, each with its stem
  face += [CCX - 16, CCX, CCX + 16].map((x) => `<path class="iso-line" data-tone="mid" d="${flatRect(x - 4, 122, x + 4, 140, 1.6, 3)}"/><path class="iso-line" data-tone="mid" d="M${f1(x)} -140V-143M${f1(x)} -122V-119"/>`).join('');
  // the mimic: busbar, breaker square, cable down
  face += `<path class="iso-line" data-tone="mid" d="M${f1(x0 + 6)} -108H${f1(x0 + 22)}M${f1(x0 + 14)} -108V-104M${f1(x0 + 14)} -97V-92"/><path class="mf-card" d="${flatRect(x0 + 11, 97, x0 + 17, 104, 0.4, 2)}"/><path class="iso-line" data-tone="mid" d="${flatRect(x0 + 11, 97, x0 + 17, 104, 0.4, 2)}"/>`;
  face += `<circle class="mf-btn" cx="${f1(CCX + 2)}" cy="-100" r="2.4"/><circle class="mf-btn2" cx="${f1(CCX + 10)}" cy="-100" r="2.4"/>`;
  face += `<path class="mf-card" d="${flatRect(x1 - 14, 96, x1 - 6, 104, 0.4, 2)}"/><path class="iso-line" data-tone="mid" d="M${f1(x1 - 12)} -100H${f1(x1 - 8)}"/>`;
  box('cu.door', { x: x0, y: CFY, w: x1 - x0, d: 0.8, r: 0.3 }, 88, 152, { tone: 'hi' }, {
    steps: 2, bevel: 0.15, extra: `<g transform="${planeOf(fy)}">${face}</g>` + Dt([[x0 + 1.4, fy, 89.4], [x1 - 1.4, fy, 89.4], [x0 + 1.4, fy, 150.6], [x1 - 1.4, fy, 150.6]].map(at), { size: 0.38, tone: 'mid' }),
  });
  box('cu.handle', { x: x1 - 4, y: CFY + 0.8, w: 2, d: 2.4, r: 0.3 }, 118, 134, { tone: 'mid' }, { steps: 1 });
  // the relay door above
  box('cu.rdoor', { x: x0, y: CFY, w: x1 - x0, d: 0.8, r: 0.3 }, 156, 196, { tone: 'hi' }, {
    steps: 2, bevel: 0.15, extra: Dt([[x0 + 1.4, fy, 157.4], [x1 - 1.4, fy, 157.4], [x0 + 1.4, fy, 194.6], [x1 - 1.4, fy, 194.6]].map(at), { size: 0.38, tone: 'mid' }),
  });
  // the relay: a case with its screen, a column of lamps and a row of keys
  const rx0 = CCX - 18;
  const rx1 = CCX + 12;
  const ry = CFY + 0.8;
  const rf = ry + 3;
  let rface = fr(rx0 + 2.4, 178, rx0 + 18, 189, 0.5);
  rface += `<path class="iso-line" data-tone="lo" data-free="" d="M${f1(rx0 + 4)} -186.5H${f1(rx0 + 14)}M${f1(rx0 + 4)} -184H${f1(rx0 + 11)}M${f1(rx0 + 4)} -181.5H${f1(rx0 + 15)}"/>`;
  rface += [0, 1, 2, 3, 4].map((j) => `<circle class="${j === 0 ? 'mf-led' : 'mf-led0'}" ${j === 0 ? 'data-k="led"' : ''} cx="${f1(rx1 - 4)}" cy="${f1(-(188 - j * 2.6))}" r="0.8"/>`).join('');
  rface += [0, 1, 2, 3].map((j) => `<path class="mf-card" d="${flatRect(rx0 + 3 + j * 4, 172, rx0 + 6 + j * 4, 175, 0.3, 2)}"/>`).join('');
  box('cu.relay', { x: rx0, y: ry, w: rx1 - rx0, d: 3, r: 0.4 }, 169, 192, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra: `<g transform="${planeOf(rf)}">${rface}</g>` });
  // the test block under it: a strip of sockets
  const tx0 = CCX - 18;
  const socks = [];
  for (let j = 0; j < 8; j++) socks.push(at([tx0 + 2.4 + j * 3.6, ry + 2, 162.5]));
  box('cu.test', { x: tx0, y: ry, w: 30, d: 2, r: 0.3 }, 160, 165, { tone: 'lo' }, { steps: 2, extra: Dt(socks, { size: 0.42, tone: 'hi' }) });
}

// ---------------------------------------------------------------- the LV rack: six fuse ways, one cable down from each
{
  box('rack.frame', RK, 0, RK_Z, { tone: 'mid' }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(RK, RK_Z - 4, P, 2) + k.sideSeam(RK, 6, P, 2), { tone: 'faint' }) });
  // the LV busbars across the top of the front, three phases and the neutral
  [92, 88, 84, 80].forEach((z, j) => box(`rack.lvbar${j}`, { x: RK.x + 1.5, y: RKY, w: RK.w - 3, d: 1, r: 0.2 }, z, z + 1.6, { tone: j === 3 ? 'lo' : 'hi' }, { steps: 1 }));
  for (let i = 0; i < WAYS; i++) {
    const x = WAY_X(i);
    const dots = [70, 58, 46].map((z) => at([x + 2, RKY + 3, z]));
    box(`rack.way${i}`, { x, y: RKY, w: 4, d: 3, r: 0.3 }, 38, 76, { tone: 'hi' }, { steps: 1, extra: Dt(dots, { size: 0.45, tone: 'mid' }) + L(k.segment([x + 0.6, RKY + 3, 74], [x + 3.4, RKY + 3, 74], P), { tone: 'lo' }) });
    post(`rack.lv${i}`, x + 2, RKY + 1.6, 1.2, 0, 38, { tone: 'lo' }, { steps: 8 });
  }
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const FLASH = at([TRENCH.x + TRENCH.w * 0.55, TRENCH.y + TRENCH.d / 2, 0]);
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  // the fault on the feeder: a burst that stage.js draws
  `<g data-k="flash"></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('mt', g('mtBase', '') + cue('ct', g('mtCt', '')) + cue('vt', g('mtVt', ''))),
  g('rl', g('rlBase', '') + cue('relay', g('rlRelay', '')) + cue('cb', g('rlCb', '')) + g('rlIn', '')),
  g('ex', cue('ex', g('exIn', ''))),
  g('tc', g('tcBase', '') + cue('tcc', g('tcAx', '')) + cue('oc', g('tcCurve', '')) + g('tcIn', '')),
  g('ef', g('efBase', '') + cue('ef', g('efSum', '')) + cue('star', g('efStar', ''))),
  g('st', g('stBase', '') + cue('set', g('stDoc', '')) + g('stIn', '')),
  g('sl', g('slBase', '') + cue('sel', g('slSel', '')) + cue('tg', g('slTg', '')) + cue('step', g('slStep', '')) + cue('backup', g('slBack', ''))),
  g('fz', g('fzBase', '') + cue('fz', g('fzIn', ''))),
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
const MIDW = [-70, 0, 60];
const MID1 = [-110, 0, 150];
const CUBE = [CCX, CFY, 110];
const LOW = [CCX - 4, CFY, 44];
const RELAY = [CCX - 3, CFY, 176];
const NET = [110, FY, 60];
const CAM = [
  { from: cam(MID1, 760), to: cam(MID1, 720), a: 0.1, b: 0.95 },
  { from: cam(CUBE, 400, 104), to: cam(LOW, 240, 104), a: 0.0, b: 0.3 },
  { from: cam(RELAY, 200, 104), to: cam(RELAY, 170, 104) },
  { from: cam(CUBE, 420, 104), to: cam(CUBE, 400, 104) },
  { from: cam(CUBE, 400, 104), to: cam(CUBE, 390, 104) },
  { from: cam(LOW, 300, 104), to: cam(LOW, 280, 104) },
  { from: cam(RELAY, 260, 104), to: cam(RELAY, 230, 104) },
  { from: cam(MIDW, 1500, 104), to: cam(MIDW, 1400, 104) },
  { from: cam(NET, 520, 104), to: cam([170, RKY, 56], 300, 104), a: 0.0, b: 0.4 },
];

// ---------------------------------------------------------------- the film
const DUR = [20, 20, 30, 28, 30, 28, 28, 56, 50];
const C = {
  MIMIC, blades, FLASH, dur: DUR,
  CT, LOAD, FMIN, S1, T1, S2, FNEAR, RELAY_A, GRADE, STEP, FUSE, HOMES,
};
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.switchgear.protection',
  title: { nl: 'Van kortsluiting tot uitschakeling', en: 'From short circuit to trip' },
  lessons: [PRO, SEL],
  // v16 reference film: every beat names the part it explains (films/_kit/build-film.mjs)
  strictFocus: true,
  scenes: [
    {
      id: 's1', lesson: PRO, level: 1, dur: DUR[0], still: 0.92, title: { nl: 'Een fout op de streng', en: 'A fault on the feeder' },
      beats: [
        B('Een onderstation voedt een streng: een uitgaande MS-kabel van {n:10} kV langs netstations.', 'A substation feeds a feeder: an outgoing MV cable of {n:10} kV past secondary substations.', { focus: 'feeder' }),
        B('Een graafmachine raakt de kabel: kortsluiting. De stroom springt naar duizenden ampère.', 'A digger hits the cable: a short circuit. The current jumps to thousands of amps.', { focus: 'feeder' }),
        B('De beveiliging: meettransformatoren, een relais en de vermogensschakelaar.', 'The protection: measuring transformers, a relay and the circuit breaker.', { focus: ['ct', 'relay', 'cb'] }),
      ],
    },
    {
      id: 's2', lesson: PRO, level: 1, dur: DUR[1], still: 0.92, title: { nl: 'Meten', en: 'Measuring' },
      beats: [
        B('Een {t:Stroomtransformator|stroomtransformator} van {n:400}/{n:1} A maakt van {n:400} A in de kabel {n:1} A.', 'A {t:Current transformer|current transformer} of {n:400}/{n:1} A turns {n:400} A in the cable into {n:1} A.', { cue: { Stroomtransformator: 'ct' }, focus: 'ct' }),
        B('Een {t:Spanningstransformator|spanningstransformator} maakt van {n:10} kV zo’n {n:100} V.', 'A {t:Voltage transformer|voltage transformer} turns {n:10} kV into about {n:100} V.', { cue: { Spanningstransformator: 'vt' }, focus: 'vt' }),
        B('Veilige, standaard waarden voor het relais: {n:1} of {n:5} A, en {n:100} V.', 'Safe, standard values for the relay: {n:1} or {n:5} A, and {n:100} V.', { focus: ['ct', 'vt'] }),
      ],
    },
    {
      id: 's3', lesson: PRO, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Het relais besluit', en: 'The relay decides' },
      beats: [
        B('Het {t:Beveiligingsrelais|beveiligingsrelais} vergelijkt stroom en spanning met zijn instellingen.', 'The {t:Protection relay|protection relay} compares current and voltage with its settings.', { cue: { Beveiligingsrelais: 'relay' }, focus: 'relay' }),
        B('Een fout? Dan een uitschakelsignaal, en de vermogensschakelaar opent in tientallen milliseconden.', 'A fault? Then a trip signal, and the circuit breaker opens within tens of milliseconds.', { focus: 'cb' }),
        B('Digitale relais leggen gebeurtenissen en foutstromen vast; via testaansluitingen test je ze.', 'Digital relays record events and fault currents; test sockets let you test them.', { focus: 'test' }),
      ],
    },
    {
      id: 's4', lesson: PRO, level: 1, dur: DUR[3], still: 0.92, title: { nl: 'Overstroom in twee trappen', en: 'Overcurrent in two stages' },
      beats: [
        B('{t:Overstroombeveiliging|Overstroombeveiliging}: een ingestelde tijd boven een ingestelde stroom? Afschakelen.', '{t:Overcurrent protection|Overcurrent protection}: above a set current for a set time? Trip.', { cue: { Overstroombeveiliging: 'oc' }, focus: 'oc' }),
        B('De {t:Tijd-stroomkarakteristiek|tijd-stroomkarakteristiek}: een lage trap met vertraging, een hoge trap direct.', 'The {t:Time-current curve|time-current curve}: a low stage with a delay, a high stage at once.', { cue: { 'Tijd-stroomkarakteristiek': 'tcc' }, focus: 'tcc' }),
        B('De lage trap: boven de hoogste belasting, onder de laagste foutstroom aan het eind van de streng.', 'The low stage: above the highest load, below the lowest fault current at the far end of the feeder.', { focus: 'oc' }),
      ],
    },
    {
      id: 's5', lesson: PRO, level: 1, dur: DUR[4], still: 0.92, title: { nl: 'Voorbeeld: de instellingen', en: 'Example: the settings' },
      beats: [
        B('Voorbeeld: maximaal {n:300} A belasting, kleinste fout {n:2000} A, stroomtransformator {n:400}/{n:1} A.', 'Example: {n:300} A maximum load, smallest fault {n:2000} A, CT {n:400}/{n:1} A.', { focus: 'ex' }),
        B('Trap 1: {n:450} A, {n:1.5} keer de belasting, na {n:0.5} s. Aan de relaiskant {n:1.125} A.', 'Stage 1: {n:450} A, {n:1.5} times the load, after {n:0.5} s. On the relay side {n:1.125} A.', { focus: 'ex' }),
        B('Trap 2: {n:4000} A, zonder vertraging.', 'Stage 2: {n:4000} A, no delay.', { focus: 'oc' }),
        B('Fout aan het eind, {n:2000} A: trap 1 na {n:0.5} s. Dichtbij, {n:12000} A: direct, trap 2.', 'Fault at the far end, {n:2000} A: stage 1 after {n:0.5} s. Close by, {n:12000} A: at once, stage 2.', { focus: 'oc' }),
      ],
    },
    {
      id: 's6', lesson: PRO, level: 1, dur: DUR[5], still: 0.92, title: { nl: 'Aardfout', en: 'Earth fault' },
      beats: [
        B('{t:Aardfoutbeveiliging|Aardfoutbeveiliging} meet de som van de drie fasestromen: gezond is die nul.', '{t:Earth-fault protection|Earth-fault protection} measures the sum of the three phase currents: healthy, it is zero.', { cue: { Aardfoutbeveiliging: 'ef' }, focus: 'ef' }),
        B('Hoe groot de aardfoutstroom wordt, hangt af van hoe het {t:Sterpunt|sterpunt} geaard is.', 'How large the earth-fault current gets depends on how the {t:Star point|star point} is earthed.', { cue: { Sterpunt: 'star' }, focus: 'star' }),
        B('Weerstand, spoel of geen aarding. Spoel of geen: kleine stroom, dus gevoelige relais.', 'A resistor, a coil or no earthing. Coil or none: a small current, so sensitive relays.', { focus: 'star' }),
      ],
    },
    {
      id: 's7', lesson: PRO, level: 1, dur: DUR[6], still: 0.92, title: { nl: 'Wie is eigenaar?', en: 'Who owns the settings?' },
      beats: [
        B('Instellingen zijn een engineeringproduct, met een eigenaar en een versie, zoals een tekening.', 'Settings are an engineering product, with an owner and a version, like a drawing.', { focus: 'set' }),
        B('Verandert het net, komt er een zonnepark bij? Controleer de instellingen: omvormers leveren foutstroom.', 'Network changed, a solar park added? Check the settings: inverters feed fault current.', { focus: 'set' }),
        B('Typische fout: ter plaatse aangepast, nooit vastgelegd. Wie is eigenaar, en wanneer gecontroleerd?', 'Typical failure: changed on site, never recorded. Who owns it, and when was it checked?', { focus: 'set' }),
      ],
    },
    {
      id: 's8', lesson: SEL, level: 2, dur: DUR[7], still: 0.92, title: { nl: 'Selectiviteit', en: 'Selectivity' },
      beats: [
        B('{t:Selectiviteit|Selectiviteit}: alleen de beveiliging het dichtst bij de fout schakelt af.', '{t:Selectivity|Selectivity}: only the protection closest to the fault trips.', { cue: { Selectiviteit: 'sel' }, focus: 'sel' }),
        B('{t:Tijdselectiviteit|Tijdselectiviteit}: het relais het dichtst bij de fout is het snelst, de rest wacht langer.', '{t:Time grading|Time grading}: the relay closest to the fault is fastest; the rest wait longer.', { cue: { Tijdselectiviteit: 'tg' }, focus: 'tg' }),
        B('De {t:Tijdtrap|tijdtrap}, meestal {n:0.3} tot {n:0.4} s: openingstijd, naijlen van het relais, meetfouten.', 'The {t:Grading margin|grading margin}, typically {n:0.3} to {n:0.4} s: opening time, relay run-on, measuring errors.', { cue: { Tijdtrap: 'step' }, focus: 'step' }),
        B('{t:Reservebeveiliging|Reservebeveiliging}: faalt de dichtstbijzijnde, dan schakelt de volgende later af.', '{t:Backup protection|Backup protection}: if the closest fails, the next one up trips later.', { cue: { Reservebeveiliging: 'backup' }, focus: 'backup' }),
      ],
    },
    {
      id: 's9', lesson: SEL, level: 2, dur: DUR[8], still: 0.92, title: { nl: 'Eén verkeerde zekering', en: 'One wrong fuse' },
      beats: [
        B('Zekeringen: die erboven minstens zo’n {n:1.6} keer zo groot. Leg de karakteristieken naast elkaar.', 'Fuses: the upstream one at least about {n:1.6} times larger. Compare the curves side by side.', { focus: 'fz' }),
        B('Voorbeeld: zes LS-kabels met {n:250} A. Op één kabel zet een monteur {n:400} A.', 'Example: six LV cables with {n:250} A. On one cable a technician fits {n:400} A.', { focus: 'lv400' }),
        B('Fout op die kabel: de MS-zekering gaat eerst. {n:180} woningen zonder stroom, niet {n:30}.', 'A fault on that cable: the MV fuse goes first. {n:180} homes off, not {n:30}.', { focus: 'mvfuse' }),
        B('Terug naar {n:250} A, en zoek uit waarom hij steeds doorsloeg. Welk apparaat had moeten afschakelen?', 'Back to {n:250} A, and find out why it kept blowing. Which device should have cleared it?', { focus: 'lv400' }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully, every point of the checklist at the top. No "/",
// "=", "×", "%", parentheses or units as symbols in the spoken text: ampère,
// kilovolt and seconde are written out, "400/1 A" is said "400 op 1 ampère"
// and "450 / 400" "450 gedeeld door 400". Terms as in the devices, automation
// and outage films: beveiligingsrelais, vermogensschakelaar, streng,
// netstation, onderstation, selectiviteit, overstroom, aardfout.
const SAY = [
  [ // s1 a fault on the feeder
    B('Hier, in een onderstation, begint een streng: een uitgaande middenspanningskabel van {n:10} kilovolt.',
      'Here, in a substation, a feeder starts: an outgoing medium-voltage cable of {n:10} kilovolts.'),
    B('Een graafmachine raakt de kabel: kortsluiting. De stroom springt naar duizenden ampère.',
      'A digger hits the cable: a short circuit. The current jumps to thousands of amps.'),
    B('Drie delen schakelen de fout af: meettransformatoren, een beveiligingsrelais en de vermogensschakelaar.',
      'Three parts clear the fault: measuring transformers, a protection relay and the circuit breaker.'),
  ],
  [ // s2 measuring
    B('Om elke kabel zit een {t:Stroomtransformator|stroomtransformator}. Bij {n:400} op {n:1} ampère wordt {n:400} ampère in de kabel {n:1} ampère.',
      'Around each cable sits a {t:Current transformer|current transformer}. At {n:400} to {n:1} amp, {n:400} amps in the cable becomes {n:1} amp.'),
    B('Een {t:Spanningstransformator|spanningstransformator} maakt van {n:10} kilovolt zo’n {n:100} volt.',
      'A {t:Voltage transformer|voltage transformer} turns {n:10} kilovolts into about {n:100} volts.'),
    B('Zo krijgt het relais veilige standaardwaarden: {n:1} of {n:5} ampère.',
      'So the relay gets safe, standard values: {n:1} or {n:5} amps.'),
  ],
  [ // s3 the relay decides
    B('Het {t:Beveiligingsrelais|beveiligingsrelais} in de deur, met schermpje en lampjes, vergelijkt stroom en spanning met zijn instellingen.',
      'The {t:Protection relay|protection relay} in the door, with screen and lamps, compares current and voltage with its settings.'),
    B('Ziet het een fout, dan geeft het een uitschakelsignaal. Het relais beslist in enkele tientallen milliseconden, plus de ingestelde vertraging; de vermogensschakelaar opent in nog eens enkele tientallen.',
      'Seeing a fault, it sends a trip signal. The relay decides within a few tens of milliseconds plus the set delay; the circuit breaker opens in a few tens more.'),
    B('Digitale relais leggen gebeurtenissen en foutstromen vast, handig na een uitschakeling. Via testaansluitingen injecteren monteurs teststroom, vaak om de paar jaar. Hoe vaak dat nog moet bij relais die zichzelf controleren, daarover verschillen experts.',
      'Digital relays record events and fault currents, useful after a trip. Through test sockets technicians inject test current, often every few years; experts disagree how often self-checking relays still need it.'),
  ],
  [ // s4 overcurrent in two stages
    B('{t:Overstroombeveiliging|Overstroombeveiliging} schakelt af als de stroom een ingestelde tijd boven een ingestelde waarde blijft.',
      '{t:Overcurrent protection|Overcurrent protection} trips when the current stays above a set value for a set time.'),
    B('Een {t:Tijd-stroomkarakteristiek|tijd-stroomkarakteristiek}, een grafiek van hoe snel een beveiliging afschakelt bij elke stroom, toont meestal twee trappen: een lage met vertraging, voor overbelasting en fouten ver weg, en een hoge, direct, voor zware kortsluiting dichtbij.',
      'A {t:Time-current curve|time-current curve}, a graph of how fast a protection trips at each current, usually shows two stages: a low one with a delay, for overload and distant faults, and a high one, at once, for heavy faults close by.'),
    B('De lage trap ligt boven de hoogste normale belasting, onder de laagste foutstroom: die van een fout aan het eind van de streng.',
      'The low stage sits above the highest normal load, below the lowest fault current: that of a fault at the end of the feeder.'),
  ],
  [ // s5 the worked example
    B('Voorbeeld: maximaal {n:300} ampère belasting, kleinste foutstroom aan het eind {n:2000} ampère, stroomtransformator {n:400} op {n:1}.',
      'Example: maximum load {n:300} amps, smallest fault current at the end {n:2000} amps, current transformer {n:400} to {n:1}.'),
    B('Trap één: {n:450} ampère, {n:1.5} keer de maximale belasting, met {n:0.5} seconde vertraging. Voor het relais is dat {n:450} gedeeld door {n:400}: {n:1.125} ampère.',
      'Stage one: {n:450} amps, {n:1.5} times the maximum load, with a {n:0.5} second delay. For the relay that is {n:450} divided by {n:400}: {n:1.125} amps.'),
    B('Trap twee: {n:4000} ampère, zonder vertraging.',
      'Stage two: {n:4000} amps, no delay.'),
    B('Een fout aan het eind, {n:2000} ampère: trap één, na {n:0.5} seconde. Vlak bij het onderstation, {n:12000} ampère: direct, trap twee.',
      'A fault at the end, {n:2000} amps: stage one, after {n:0.5} seconds. Right by the substation, {n:12000} amps: at once, stage two.'),
  ],
  [ // s6 earth fault
    B('{t:Aardfoutbeveiliging|Aardfoutbeveiliging} kijkt naar stroom die naar aarde weglekt: de som van de drie fasestromen. Gezond is die nul.',
      '{t:Earth-fault protection|Earth-fault protection} looks at current leaking to earth: the sum of the three phase currents, zero when all is well.'),
    B('Hoe groot die lekstroom wordt, hangt af van hoe het {t:Sterpunt|sterpunt} geaard is: het gemeenschappelijke punt van de drie wikkelingen in de transformator.',
      'How large that current gets depends on how the {t:Star point|star point} is earthed: the common point of the three windings at the transformer.'),
    B('Nederlandse middenspanningsnetten verschillen: geaard via een weerstand, een spoel, of niet. Met spoel of zonder aarding is de stroom klein, dus moeten relais gevoelig zijn, vaak richtingsgevoelig: ze zien welke kant hij op gaat.',
      'Dutch medium-voltage networks differ: earthed through a resistor, a coil, or not at all. With a coil or none the current is small, so relays must be sensitive, often directional: they see which way it flows.'),
  ],
  [ // s7 who owns the settings
    B('Instellingen zijn een technisch product, met een eigenaar en een versie, als een tekening.',
      'Settings are an engineering product, with an owner and a version, like a drawing.'),
    B('Een verkeerde instelling geeft onterechte uitschakelingen, of erger, geen. Verandert het net, controleer de instellingen: omvormers van een zon- of windpark leveren zelf foutstroom, en verbergen soms een deel van een fout voor een relais richting onderstation.',
      'A wrong setting causes unwanted trips or, worse, none. When the network changes, check the settings: inverters of a solar or wind park feed fault current that can hide part of a fault from a relay upstream.'),
    B('Een typische fout: ter plaatse aangepast, nooit vastgelegd. Vraag dus: wie is eigenaar van deze instellingen, en wanneer zijn ze voor het laatst tegen het net gecontroleerd?',
      'A typical failure: changed on site, never recorded. So ask: who owns these settings, and when were they last checked against the network?'),
  ],
  [ // s8 selectivity
    B('{t:Selectiviteit|Selectiviteit}: alleen de beveiliging het dichtst bij de fout schakelt af; alles dichter bij de bron blijft aan, dus zo min mogelijk klanten zonder stroom. Een fout in een laagspanningskabel laat zijn zekering in het netstation doorslaan, niet de middenspanningszekering van de transformator, laat staan de vermogensschakelaar in het onderstation.',
      '{t:Selectivity|Selectivity}: only the protection closest to the fault trips; everything closer to the source stays on, so the fewest customers lose power. A low-voltage street cable fault blows its fuse in the secondary substation, not the transformer’s medium-voltage fuse, let alone the substation breaker.'),
    B('Bij relais is {t:Tijdselectiviteit|tijdselectiviteit} het meest gebruikt: het dichtstbijzijnde relais is het snelst, elk erboven wacht net wat langer. Ze staan in onderstations, schakelstations en grote klantstations, niet in gewone netstations.',
      'For relays, {t:Time grading|time grading} is most common: the closest relay is fastest, each upstream one waits a little longer. They sit in substations, switching stations and large customer stations, not ordinary secondary ones.'),
    B('De extra vertraging per stap, de {t:Tijdtrap|tijdtrap}, is meestal {n:0.3} tot {n:0.4} seconde: voor de openingstijd van de schakelaar, het naijlen van het relais na de fout, en meetonnauwkeurigheden.',
      'The extra delay per step, the {t:Grading margin|grading margin}, is typically {n:0.3} to {n:0.4} seconds: for the breaker’s opening time, the relay’s run-on after the fault, and measuring tolerances.'),
    B('Dat geeft ook {t:Reservebeveiliging|reservebeveiliging}: opent de dichtstbijzijnde schakelaar niet, dan schakelt de volgende erboven later af, met meer klanten zonder stroom. De prijs is snelheid: bij de bron, waar de foutstroom het hoogst is, wacht het relais het langst. Communicerende relais zijn sneller en blijven selectief; hoe ver je het oprekt, is omstreden.',
      'It also gives {t:Backup protection|backup protection}: if the closest breaker fails, the next one up trips later, with more customers off. The price is speed: near the source, where fault current is highest, the relay waits longest. Communicating relays are faster and stay selective; how far to push it is disputed.'),
  ],
  [ // s9 one wrong fuse
    B('Zekeringen stem je af op grootte en karakteristiek. Bij laagspanningszekeringen van één type is die erboven als vuistregel minstens zo’n {n:1.6} keer zo groot. De middenspanningszekering leg je met haar karakteristiek naast de laagspanningszekeringen, zodat laagspanning eerst gaat.',
      'Fuses are graded by size and curve. Rule of thumb for low-voltage fuses of one type: the upstream one at least about {n:1.6} times larger. Lay the medium-voltage fuse’s curve beside the low-voltage curves, so low voltage goes first.'),
    B('Voorbeeld: zes laagspanningskabels van elk {n:250} ampère. Op één kabel slaat de zekering steeds door; een monteur zet er {n:400} ampère in.',
      'Example: six low-voltage cables of {n:250} amps each. On one the fuse keeps blowing, so a technician fits {n:400} amps.'),
    B('Maanden later, bij een fout op die kabel, is die {n:400} ampère te traag: de middenspanningszekering van de transformator gaat eerst. Alle zes kabels, {n:180} woningen zonder stroom, niet {n:30}.',
      'Months later, in a fault on that cable, the {n:400} amp fuse is too slow: the transformer’s medium-voltage fuse goes first. All six cables, {n:180} homes, off instead of {n:30}.'),
    B('De oplossing: terug naar {n:250} ampère, en uitzoeken waarom hij doorsloeg: waarschijnlijk een overbelaste kabel om te splitsen of te verzwaren. Ook een nieuw voedingspunt of een kabelstuk naar een andere ring breekt soms de selectiviteit; dan legt één straatkabel een hele ring met {n:2000} klanten plat. Vraag dus: welk apparaat had deze fout moeten afschakelen, en waarom deed het dat niet?',
      'The fix: back to {n:250} amps, and find out why it kept blowing: probably an overloaded cable to split or reinforce. A new feed point or a cable section moved to another ring can also break selectivity; then one street cable takes out a ring of {n:2000} customers. So ask: which device should have cleared this fault, and why didn’t it?'),
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
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.mf-glass{fill:var(--anatomy-shade-0);stroke:none}
.mf-well{fill:var(--anatomy-shade-0);stroke:none}
.mf-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mf-dial{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.mf-band2{fill:none;stroke:var(--anatomy-mid);stroke-width:.5px}
.mf-needle{fill:none;stroke:var(--anatomy-strong);stroke-width:.35px;stroke-linecap:round}
.mf-pivot{fill:var(--anatomy-hi)}
.mf-blade{fill:none;stroke:var(--anatomy-strong);stroke-width:.55px;stroke-linecap:round}
.mf-btn{fill:var(--anatomy-mid);stroke:var(--anatomy-lo);stroke-width:.3px}
.mf-btn2{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:.3px}
.mf-led0{fill:var(--anatomy-lo)}
.mf-led{fill:var(--anatomy-mid)}
.mf-led[data-hot]{fill:var(--fp-accent)}
.mf-feed{fill:none;stroke:var(--anatomy-lo);stroke-width:1.2px;stroke-linecap:round;stroke-dasharray:3 2}
[data-cue][data-on] .mf-feed{stroke:var(--fp-accent);stroke-width:1.8px}
[data-cue][data-on] .mf-blade,[data-cue][data-on] .mf-needle,[data-cue][data-on] .mf-band2{stroke:var(--fp-accent)}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-iron{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mf-ghost{fill:none;stroke:var(--anatomy-lo);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.7}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-gdash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent)}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een veld in een onderstation met de deur van de kabelruimte open: drie kabels met elk een stroomtransformator, een spanningstransformator, de deur van de vermogensschakelaar met een venster, en het beveiligingsrelais met schermpje, lampjes en testaansluitingen. Een streng loopt in een kabelgoot naar een netstation met een RMU, een transformator en een laagspanningsrek met zes zekeringen. Kaarten tonen de meettransformatoren, het relais, de tijd-stroomkarakteristiek met het voorbeeld, de aardfout en het sterpunt, de instellingen, de selectiviteit langs een streng en de zekeringkarakteristieken.',
  en: 'A substation feeder panel with its cable compartment door open: three cables each with a current transformer, a voltage transformer, the circuit breaker door with a window, and the protection relay with screen, lamps and test sockets. A feeder runs in a cable trench to a secondary substation with an RMU, a transformer and an LV rack with six fuses. Cards show the measuring transformers, the relay, the time-current curve with the worked example, the earth fault and the star point, the settings, selectivity along a feeder and the fuse curves.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

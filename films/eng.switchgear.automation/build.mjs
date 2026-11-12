// Dev tool, not shipped. Builds the explainer film "Een ring die zichzelf
// herstelt / A self-healing ring" for the grid module Schakelinstallaties en
// beveiliging: level 2 of the topic MS-installaties en stations
// (eng.switchgear.automation).
//
//   node films/eng.switchgear.automation/build.mjs            build the page
//   node films/eng.switchgear.automation/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.switchgear.automation.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.switchgear.automation). The plan row serves "automation"; that id still
// exists after the topics x levels rebuild (level 2 of "stations"), so no
// mapping was needed. Lessons with a film no longer show their worked example,
// so the film carries every point of the lesson's teach text and of its worked
// example (the checklist is in the model below, asserted against the text).
//
// The world is the secondary substation of films/eng.switchgear.devices (the
// same RMU with three panels, its mimic, sockets and gauge, the cable and the
// 400 kVA transformer on the station floor), made a key station: both ring
// panels carry a motor drive over the switch socket and a fault indicator with
// its lamp, and a small cabinet on a stand beside the RMU holds the modem, the
// battery and the control unit, with an antenna on top and a control cable to
// the RMU. Cards in stage space: the MV ring as a schema (the substation with
// its breaker, seven stations, the normally open point to the neighbouring
// ring, the van, fault indicators, the fault and the customer-minutes counter,
// all labelled "schema, voorbeeld"), the control room's SCADA screen, the
// cabinet opened (a schema), the business case, the Dutch outage minutes and
// what goes wrong.
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
// Asserted against the lesson's teach text and worked example (the build fails
// if a point drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm. Facts checked 2026-11-11, hedged in the narration:
// - Remote control: Dutch DSOs fit motor drives to the load-break switches of
//   chosen RMUs (vendors sell "motorised" or "remote-controlled" RMUs), run from
//   a battery-backed DC supply in a small cabinet with a remote terminal unit
//   and a modem; the link is usually a private or mobile radio network (in the
//   Netherlands partly the 450 MHz network of the grid operators). The control
//   room operates them through SCADA, as in eng.gridops and eng.ot.isa95. Said
//   only as "via een communicatieverbinding".
// - Protection first: the feeder's protection relay in the substation trips the
//   circuit breaker on the fault (eng.switchgear.protection); restoration
//   switching, by hand, by remote control or by self-healing logic, comes
//   after. A load-break switch never breaks the fault current itself.
// - Fault indicators (fault passage indicators) sense fault current with
//   sensors round the cable and show a lamp, often reporting remotely; they
//   cannot see the fault beyond themselves because fault current flows from the
//   source to the fault only (radially fed ring, open point open).
// - Self-healing: known internationally as FLISR (fault location, isolation and
//   service restoration); run centrally (in the SCADA/ADMS) or decentrally
//   between stations, typically within about a minute; Dutch DSOs pilot and
//   roll it out step by step. Said as the lesson says: "vaak binnen een
//   minuut", "stap voor stap".
// - IEC 61850 is the communication standard inside (mostly HV/MV) substations;
//   telecontrol to secondary substations often uses other protocols (IEC
//   60870-5-104, DNP3). Not named in the film: the lesson does not.
// - Cyber security: each remote link is a way in. The 2015 attack on Ukrainian
//   distribution operators opened breakers remotely through their SCADA.
//   Said without a year, with the cyber module's wording "zones en conduits"
//   (IEC 62443), hedged: "behandel die verbinding als OT".
// - Outage minutes, unplanned: about 20 to 25 a year (Netbeheer Nederland,
//   Betrouwbaarheid van elektriciteitsnetten in Nederland: 21,8 in 2023 with a
//   five-year average of 21,9; 23,9 in 2024; 23,4 in 2025, Resultaten 2025,
//   1 April 2026), as eng.gridbasics, eng.gridops and the outage and
//   congestion films; the lesson says "zo'n 23" for 2025. Planned work (27,2
//   in 2025) is left to those lessons. The regulator's quality incentive
//   (ACM's q-factor) as the lesson words it.
const AUT = 'eng.switchgear.automation';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
{
  const l = lessons.nl.get(AUT);
  const t = l.teach.join('\n');
  // teach, point by point (each one is told in the scene named)
  const POINTS = [
    ['rijdt een monteur van station naar station, leest de verklikkers af en schakelt met de hand', 's1'],
    ['één à twee uur zonder stroom voor de meeste klanten', 's1'],
    ['bediening op afstand en bewaking van het MS-net', 's2'],
    ['een lastscheider met motoraandrijving die het bedrijfsvoeringscentrum (control room) via een communicatieverbinding open en dicht kan zetten', 's2'],
    ['De bedrijfsvoerder ziet waar de fout zit en schakelt in minuten', 's2'],
    ['gaat branden of geeft een signaal als er foutstroom langs is gekomen', 's3'],
    ['de fout zit tussen de laatste verklikker die hem zag en de eerste die niks zag', 's3'],
    ['besparen de rit om ze af te lezen', 's3'],
    ['Ook zonder schakelen op afstand scheelt dat alleen al veel minuten', 's3'],
    ['Netbedrijf en assetmanagement', 's3'],
    ['vindt de fout, opent de schakelaars eromheen en sluit het openpunt, helemaal zelf, vaak binnen een minuut', 's5'],
    ['betrouwbare communicatie, kloppende netdata en goed geteste logica', 's5'],
    ['stap voor stap', 's5'],
    ['een bedrijfsvoerder elke stap bevestigt', 's5'],
    ['andere laten de logica zijn gang gaan', 's5'],
    ['Elk netstation automatiseren is te duur', 's6'],
    ['vaak twee of drie', 's6'],
    ['de ring in stukken verdeelt', 's6'],
    ['kosten per station tegenover minder klantminuten', 's6'],
    ['het aantal klanten zonder stroom maal de minuten dat ze zonder zitten, en minder rijden', 's6'],
    ['zo’n 20 tot 25 minuten per jaar zonder stroom door onvoorziene storingen (in 2025 zo’n 23: 23,4, Netbeheer Nederland)', 's6'],
    ['de toezichthouder koppelt een deel van de inkomsten van netbeheerders aan kwaliteit', 's6'],
    ['een kastje met een modem, een accu en de motoraandrijving op de schakelaar', 's2'],
    ['accu’s die leeg zijn als het erop aankomt', 's7'],
    ['communicatie die wegvalt tijdens een storm', 's7'],
    ['netdata die niet kloppen met de werkelijkheid', 's7'],
    ['Welke ringen veroorzaken de meeste klantminuten, en waar helpt één afstandsbediende schakelaar het meest?', 's7'],
  ];
  for (const [s] of POINTS) assert(t.includes(s), `teach: "${s}"`);
  // the worked example, point by point
  const x = l.example.text;
  for (const s of ['Een ring voedt 1.200 klanten', 'allemaal 90 minuten', '1.200 × 90 = 108.000 klantminuten', 'afstandsbediende schakelaars in twee sleutelstations',
    'in 3 minuten vrij', '1.000 klanten zijn na 3 minuten terug en 200 blijven 90 minuten zonder', '1.000 × 3 + 200 × 90 = 3.000 + 18.000 = 21.000 klantminuten',
    'zo’n 80% minder', 'twee aangepaste netstations']) assert(x.includes(s), `example: "${s}"`);
}
// the worked example
const EX = { all: 1200, tOut: 90, back: 1000, tRemote: 3, wait: 200 };
const KM0 = EX.all * EX.tOut;
const KM1 = EX.back * EX.tRemote + EX.wait * EX.tOut;
assert(KM0 === 108000, '1.200 × 90 = 108.000');
assert(EX.back * EX.tRemote === 3000 && EX.wait * EX.tOut === 18000 && KM1 === 21000, '1.000 × 3 + 200 × 90 = 3.000 + 18.000 = 21.000');
assert(EX.back + EX.wait === EX.all, '1.000 + 200 = 1.200');
assert(Math.abs((1 - KM1 / KM0) * 100 - 80) < 1, 'about 80% less (80,6%)');
// the schema's ring (illustrative, labelled "voorbeeld"): seven stations, key
// stations 4 and 7 (7 holds the normally open point to the neighbouring ring),
// the fault in the cable between 5 and 6
const RING = { cust: [200, 200, 200, 200, 100, 100, 200], keys: [3, 6], fault: 4 };
assert(RING.cust.reduce((a, b) => a + b, 0) === EX.all, 'the ring feeds 1.200');
assert(RING.cust[4] + RING.cust[5] === EX.wait, 'stations 5 and 6 between the key switches: 200');
// the Dutch outage minutes, unplanned (lesson: 20 to 25 a year, 23,4 in 2025;
// the card adds 2024's 23,9 from eng.gridops)
const NLMIN = { years: [[2024, 23.9], [2025, 23.4]], lo: 20, hi: 25 };
assert(NLMIN.years.every(([, m]) => m >= NLMIN.lo && m <= NLMIN.hi), 'the years inside the 20 to 25 band');

// ---------------------------------------------------------------- the world: a key secondary substation
// World units are centimetres, z up, x along the front (cabinet at −x, RMU,
// transformer at +x), +y toward the viewer. The top of the station floor is z = 0.
// The RMU and transformer are those of films/eng.switchgear.devices.
const W = 640;
const H = 400;
const FLOOR = -6;
const SLAB = { x: -116, y: -46, w: 268, d: 96, r: 2 };
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
// the cabinet with modem, battery and control unit, on a stand left of the RMU
const CAB = { x: -108, y: -24, w: 36, d: 22, r: 0.8 };
const CAB_Z = [34, 98];
const CFY = CAB.y + CAB.d; // the cabinet's front face
const ANT = [CAB.x + CAB.w - 7, CAB.y + 6];
const ANT_Z = [CAB_Z[1] + 3, CAB_Z[1] + 34];

const FIT = [
  ...k.boxCorners(SLAB, FLOOR, 0),
  ...k.boxCorners({ x: TANK.x, y: TANK.y, w: TANK.w, d: TANK.d }, 0, TANK_TOP + 4),
  ...k.boxCorners({ x: TR.x, y: TR.y, w: TR.w + 8, d: TR.d }, 0, 98),
  ...k.boxCorners({ x: CAB.x, y: CAB.y, w: CAB.w, d: CAB.d }, 0, ANT_Z[1]),
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
// light the RMU, the motor drives, the fault indicators, the cabinet or its
// antenna.
const cuesOf = (name) => {
  if (/^rmu\.motor/.test(name)) return ['rmu', 'motor'];
  if (/^rmu\.fpi/.test(name)) return ['rmu', 'fpi'];
  if (/^rmu\./.test(name)) return ['rmu'];
  if (/^cab\.ant/.test(name)) return ['cab', 'ant'];
  if (/^cab/.test(name)) return ['cab'];
  if (/^trafo\./.test(name)) return ['trafo'];
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

// ---------------------------------------------------------------- the RMU (as in eng.switchgear.devices)
{
  const bolts = [-52, -4, 46].flatMap((x) => [[x, BASE.y + 2.6], [x, BASE.y + BASE.d - 2.6]]);
  box('rmu.base', BASE, 0, BASE_TOP, { tone: 'lo' }, {
    steps: 2, bevel: 0.4,
    inner: L(k.sideSeam(BASE, 1.6, P, 2), { tone: 'faint' }),
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 1.1, BASE_TOP, P, 12)).join(''), { tone: 'lo' }) + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.45 }),
  });
}
{
  const seams = PX.slice(1).map((x) => k.segment([x, FY, BASE_TOP + 1], [x, FY, TANK_TOP - 1], P)).join('');
  box('rmu.tank', TANK, BASE_TOP, TANK_TOP, { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(seams, { tone: 'lo' }) + L(k.sideSeam(TANK, TANK_TOP - 3, P, 2), { tone: 'faint' }) });
  const lid = { x: TANK.x - 1, y: TANK.y - 1, w: TANK.w + 2, d: TANK.d + 2, r: 1 };
  box('rmu.lid', lid, TANK_TOP, TANK_TOP + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: L(k.planOutline(k.insetPlan(lid, 3), TANK_TOP + 3, P, 2), { tone: 'faint' }) + Dt(k.corners(lid, 2).map(([x, y]) => at([x, y, TANK_TOP + 3])), { size: 0.45 }) });
  for (const x of [TANK.x + 10, TANK.x + TANK.w - 10]) {
    box('rmu.eye', { x: x - 2, y: -2, w: 4, d: 4, r: 0.4 }, TANK_TOP + 3, TANK_TOP + 6, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra: L(k.ring(x, 0, 1, TANK_TOP + 6, P, 12), { tone: 'lo' }) });
  }
}
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
      face += [-7, 0, 7].map((dx) => `<path class="mf-glass" d="${flatRect(cx + dx - 1.6, 30, cx + dx + 1.6, 42, 0.8, 3)}"/><path class="iso-line" data-tone="lo" d="${flatRect(cx + dx - 1.6, 30, cx + dx + 1.6, 42, 0.8, 3)}"/>`).join('');
    } else {
      face += `<path class="mf-card" d="${flatRect(cx - 7, 36, cx + 7, 42, 0.5, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(cx - 5.5)} ${-40.2}H${f1(cx + 4)}M${f1(cx - 5.5)} ${-38.2}H${f1(cx + 1)}"/>`;
    }
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
    face += `<path class="mf-card" d="${flatRect(x0 + 2, 107.4, x1 - 2, 110.6, 0.4, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(x0 + 3.4)} -109H${f1(x1 - 9)}"/>`;
    blades.push({ cx, ex });
    box(`rmu.fascia${i}`, plan, FASCIA[0], FASCIA[1], { tone: 'mid' }, {
      steps: 2, bevel: 0.2,
      extra: `<g transform="${planeOf(FF)}">${face}</g>` + Dt([[x0 + 1, FF, FASCIA[0] + 1], [x1 - 1, FF, FASCIA[0] + 1], [x0 + 1, FF, FASCIA[1] - 1], [x1 - 1, FF, FASCIA[1] - 1]].map(at), { size: 0.38, tone: 'mid' }),
    });
  }
  // the operating sockets: the earthing switch (right) on every panel; the switch (left) only on the
  // transformer panel, since the ring panels' switch sockets sit under their motor drives
  for (const [kind, dx] of [['sock', -6], ['esock', 6]]) {
    if (kind === 'sock' && i < 2) continue;
    const F = frameY([cx + dx, FF, 64.5]);
    discAt(`rmu.${kind}${i}`, F, 0, 1.4, 2.3, { tone: 'mid' }, { steps: 20, extra: `<path class="mf-well" d="${G.circleOf(F, 1.4, 1.1, P, 18)}"/>` + Dt([at([cx + dx, FF + 1.4, 64.5 + 1.7])], { size: 0.3, tone: 'hi' }) });
  }
  if (i < 2) {
    // the motor drive over the ring switch's socket: a gearbox housing with its cover screws and a
    // vent slot, the motor standing on it, and the hand-crank cover (manual operation stays possible)
    const mx = cx - 6;
    const plan = { x: mx - 5.2, y: FF, w: 10.4, d: 5, r: 0.6 };
    const fz = FF + 5;
    box(`rmu.motor${i}`, plan, 57, 71, { tone: 'mid' }, {
      steps: 2, bevel: 0.3,
      extra: Dt([[mx - 4, fz, 58.2], [mx + 4, fz, 58.2], [mx - 4, fz, 69.8], [mx + 4, fz, 69.8]].map(at), { size: 0.32, tone: 'hi' })
        + L(k.segment([mx - 3, fz, 60.5], [mx + 3, fz, 60.5], P) + k.segment([mx - 3, fz, 61.7], [mx + 3, fz, 61.7], P), { tone: 'lo' }),
    });
    discAt(`rmu.motorcrank${i}`, frameY([mx, fz, 66]), 0, 0.8, 1.9, { tone: 'hi' }, { steps: 16, extra: `<path class="mf-well" d="${G.circleOf(frameY([mx, fz, 66]), 0.8, 0.8, P, 14)}"/>` });
    post(`rmu.motorcan${i}`, mx, FF + 2.5, 2.1, 71, 77.5, { tone: 'hi' }, { steps: 20, extra: L(k.ring(mx, FF + 2.5, 1.2, 77.5, P, 14), { tone: 'lo' }) });
    // the fault indicator: a small box with its lamp, top left of the fascia
    const fx0 = cx - 14.6;
    box(`rmu.fpi${i}`, { x: fx0, y: FF, w: 7.4, d: 2, r: 0.4 }, 84, 96, { tone: 'hi' }, {
      steps: 2, bevel: 0.15,
      extra: `<g transform="${planeOf(FF + 2)}"><circle class="mf-lamp" data-k="lamp${i}" cx="${f1(fx0 + 3.7)}" cy="-92.6" r="1.6"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(fx0 + 1.4)} -88.4H${f1(fx0 + 6)}M${f1(fx0 + 1.4)} -86.8H${f1(fx0 + 4.6)}"/></g>`,
    });
  }
}
// the pressure gauge on panel 2's fascia
{
  const cx = PC[1];
  const F = frameY([cx, FF, 100]);
  const dial = [];
  for (let j = 0; j <= 8; j++) {
    const a = -2.2 + (4.4 * j) / 8;
    dial.push(`M${f1(cx + 2.5 * Math.sin(a))} ${f1(-(100 + 2.5 * Math.cos(a)))}L${f1(cx + 2.9 * Math.sin(a))} ${f1(-(100 + 2.9 * Math.cos(a)))}`);
  }
  discAt('rmu.gauge', F, 0, 1.2, 3.4, { tone: 'mid' }, {
    steps: 28,
    extra: `<g transform="${planeOf(FF + 1.25)}"><circle class="mf-dial" cx="${f1(cx)}" cy="-100" r="3.05"/><path class="iso-line" data-tone="lo" d="${dial.join('')}"/><path class="mf-needle" d="M${f1(cx)} -100L${f1(cx + 2.3 * Math.sin(1.1))} ${f1(-(100 + 2.3 * Math.cos(1.1)))}"/><circle class="mf-pivot" cx="${f1(cx)}" cy="-100" r="0.5"/></g>`,
  });
}
{
  const x0 = PC[2] - 9;
  box('rmu.plate', { x: x0, y: FY, w: 18, d: 0.4, r: 0.2 }, 113, 116.4, { tone: 'hi' }, {
    steps: 2,
    extra: L([115.4, 114.2].map((z, j) => k.segment([x0 + 1.2, FY + 0.4, z], [x0 + 18 - [2, 6][j], FY + 0.4, z], P)).join(''), { tone: 'lo', free: true }),
  });
}
const GL = [TANK.x + TANK.w, -6, 30];
discAt('rmu.gland', frameX(GL), 0, 2.4, 2.4, { tone: 'mid' }, { steps: 6 });
// the control cable's gland on the RMU's −x side
const GL2 = [TANK.x, -12, 44];
discAt('rmu.gland2', frameX(GL2), -2, 0, 1.8, { tone: 'mid' }, { steps: 6 });

// ---------------------------------------------------------------- the transformer (as in eng.switchgear.devices)
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
for (let j = 0; j < 9; j++) box('trafo.fin', { x: TR.x + 3 + j * 6.2, y: TRY, w: 1.4, d: 8, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
for (let j = 0; j < 6; j++) box('trafo.fin', { x: TR.x + TR.w, y: TR.y + 3 + j * 6.4, w: 8, d: 1.4, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
for (const [j, x] of [92, 102, 112, 122].entries()) {
  const y = 4;
  const z0 = TR_Z[1] + 3;
  turned('trafo.bush', frameZ([x, y, z0]), [[0, 1.7], [2.2, 1.7], [2.2, 2.5], [3, 2.5], [3, 1.7], [4.6, 1.7], [4.6, 2.5], [5.4, 2.5], [5.4, 1.7], [7, 1.7]], { tone: 'hi' });
  post('trafo.stud', x, y, 0.8, z0 + 7, z0 + 9.5, { tone: 'mid', crease: 'none' }, { steps: 12, extra: Dt([at([x, y, z0 + 9.5])], { size: 0.35, tone: 'hi' }) });
  if (j === 3) box('trafo.n', { x: x + 2.6, y: y - 1.2, w: 2.4, d: 2.4, r: 0.3 }, z0, z0 + 0.6, { tone: 'lo' }, { steps: 1 });
}
post('trafo.plug', 82, -14, 2.2, TR_Z[1] + 3, TR_Z[1] + 5, { tone: 'mid' }, { steps: 6, extra: Dt([at([82, -14, TR_Z[1] + 5])], { size: 0.4, tone: 'hi' }) });
post('trafo.tap', 82, 6, 3, TR_Z[1] + 3, TR_Z[1] + 4.6, { tone: 'mid' }, { steps: 22, extra: L(k.segment([79.6, 6, TR_Z[1] + 4.6], [84.4, 6, TR_Z[1] + 4.6], P), { tone: 'lo' }) });
const TB = [TR.x, -6, 56];
discAt('trafo.mvplug', frameX(TB), -3, 0, 2.6, { tone: 'mid' }, { steps: 20 });

// ---------------------------------------------------------------- the cabinet: modem, battery and control unit
{
  // the stand: two legs on foot plates, a cross bar
  for (const x of [CAB.x + 4, CAB.x + CAB.w - 8]) {
    box('cab.foot', { x: x - 2, y: CAB.y + 1, w: 8, d: CAB.d - 2, r: 0.5 }, 0, 1.2, { tone: 'lo' }, { steps: 2, extra: Dt([at([x - 0.4, CAB.y + 3, 1.2]), at([x - 0.4, CAB.y + CAB.d - 3, 1.2])], { size: 0.35 }) });
    box('cab.leg', { x, y: CAB.y + 8, w: 4, d: 4, r: 0.4 }, 1.2, CAB_Z[0], { tone: 'lo' }, { steps: 2, bevel: 0.2 });
  }
  box('cab.bar', { x: CAB.x + 8, y: CAB.y + 8.6, w: CAB.w - 16, d: 2.8, r: 0.3 }, 18, 21, { tone: 'lo' }, { steps: 1 });
  // the body: door seam, hinges, handle, vent slots, two status LEDs and a label plate on the door
  const fy = CFY;
  const door = `<path class="iso-line" data-tone="lo" d="${flatRect(CAB.x + 2.4, CAB_Z[0] + 2.4, CAB.x + CAB.w - 2.4, CAB_Z[1] - 2.4, 0.8, 3)}"/>`;
  const vents = [0, 1, 2, 3, 4].map((j) => `<path class="mf-glass" d="${flatRect(CAB.x + 9 + j * 3.8, CAB_Z[0] + 6, CAB.x + 10.6 + j * 3.8, CAB_Z[0] + 15, 0.7, 2)}"/>`).join('');
  const leds = [0, 1].map((j) => `<circle class="mf-led" data-k="led${j}" cx="${f1(CAB.x + 9 + j * 5)}" cy="${-(CAB_Z[1] - 9)}" r="1.1"/>`).join('');
  const plate = `<path class="mf-card" d="${flatRect(CAB.x + 8, CAB_Z[1] - 22, CAB.x + 26, CAB_Z[1] - 15, 0.5, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(CAB.x + 9.6)} ${-(CAB_Z[1] - 19.4)}H${f1(CAB.x + 24)}M${f1(CAB.x + 9.6)} ${-(CAB_Z[1] - 17.4)}H${f1(CAB.x + 19)}"/>`;
  box('cab.body', CAB, CAB_Z[0], CAB_Z[1], { tone: 'mid' }, {
    steps: 2, bevel: 0.4,
    extra: `<g transform="${planeOf(fy)}">${door}${vents}${leds}${plate}</g>`
      + Dt([[CAB.x + 1.2, fy, CAB_Z[0] + 8], [CAB.x + 1.2, fy, CAB_Z[1] - 8]].map(at), { size: 0.45, tone: 'hi' }),
  });
  box('cab.handle', { x: CAB.x + CAB.w - 6, y: fy, w: 2, d: 1.6, r: 0.3 }, CAB_Z[0] + 24, CAB_Z[0] + 34, { tone: 'hi' }, { steps: 1 });
  const roof = { x: CAB.x - 1.5, y: CAB.y - 1.5, w: CAB.w + 3, d: CAB.d + 3, r: 0.8 };
  box('cab.roof', roof, CAB_Z[1], CAB_Z[1] + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: L(k.planOutline(k.insetPlan(roof, 2.5), CAB_Z[1] + 3, P, 2), { tone: 'faint' }) });
  // the antenna: a foot, the whip and its cap
  post('cab.antfoot', ANT[0], ANT[1], 2.2, ANT_Z[0], ANT_Z[0] + 2.4, { tone: 'mid' }, { steps: 18, extra: Dt([at([ANT[0] - 1.4, ANT[1] + 1.4, ANT_Z[0] + 2.4])], { size: 0.3 }) });
  post('cab.ant', ANT[0], ANT[1], 0.75, ANT_Z[0] + 2.4, ANT_Z[1] - 1.2, { tone: 'hi', crease: 'none' }, { steps: 10 });
  post('cab.antcap', ANT[0], ANT[1], 1.1, ANT_Z[1] - 1.2, ANT_Z[1], { tone: 'mid' }, { steps: 12 });
  // the control cable's gland on the cabinet's +x side
  discAt('cab.gland', frameX([CAB.x + CAB.w, -12, 44]), 0, 2, 1.8, { tone: 'mid' }, { steps: 6 });
}

// ---------------------------------------------------------------- cables
function cable(name, pts, r, radius, steps) {
  const route = G.fillet(pts, radius, steps, { P, tube: r });
  R.route(name, route, r, {});
  T.tubePieces(route, r, P, { maxLength: 30, spacing: 1 }).forEach((piece, i) => {
    put(`${name}:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'lo' }), [A.tube(piece.points, piece.radii, { name })], { bias: 0.05 });
  });
}
// the MV cable from the RMU to the transformer
cable('cable', [[GL[0] + 2.4, GL[1], GL[2]], [64, GL[1], GL[2]], [64, GL[1], TB[2]], [TB[0] - 3, TB[1], TB[2]]], 1.3, 5, 9);
// the control cable from the cabinet to the RMU's motor drives: a straight run between the glands
cable('cab.wire', [[CAB.x + CAB.w + 2, -12, 44], [-63, -12, 44], [GL2[0] - 2, -12, 44]], 0.7, 2, 5);

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
// radio waves from the antenna (the link), stage.js grows them; at the antenna tip
const AT = at([ANT[0], ANT[1], ANT_Z[1] + 2]);
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  `<g data-cue="link"><path class="mf-wave" data-k="waves" d="" transform="translate(${AT[0].toFixed(1)} ${AT[1].toFixed(1)})"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  // the ring schema: base, live lines, stations, indicators, switches, van, centre text, counter
  g('rg', g('rgBase', '') + cue('heal', g('rgRing', '')) + g('rgLive', '') + g('rgSt', '') + g('rgVan', '') + g('rgMid', '') + cue('count', g('rgCount', ''))),
  g('sc', g('scBase', '') + g('scIn', '')),
  g('cb', g('cbBase', '') + g('cbIn', '')),
  g('bc', g('bcBase', '') + g('bcIn', '')),
  g('mf', g('mfBase', '') + g('mfIn', '')),
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
const MIDW = [18, 0, 56];
const KEY = [-66, 0, 84];
const CAM = [
  { from: cam(MIDW, 700), to: cam(MIDW, 680) },
  { from: cam(MIDW, 680), to: cam(KEY, 440, 190), a: 0.02, b: 0.3 },
  { from: cam([PC[0] - 9, FY, 82], 230, 200), to: cam([PC[0] - 9, FY, 82], 200, 200) },
  { from: cam(MIDW, 680), to: cam(MIDW, 680) },
  { from: cam(MIDW, 680), to: cam(MIDW, 680) },
  { from: cam(MIDW, 680), to: cam(MIDW, 680) },
  { from: cam(MIDW, 1900, 104), to: cam(MIDW, 1800, 104) },
];

// ---------------------------------------------------------------- the film
const DUR = [44, 46, 44, 44, 44, 38, 40];
const C = { MIMIC, blades, FF, EX, KM0, KM1, RING, NLMIN, dur: DUR };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.switchgear.automation',
  title: { nl: 'Een ring die zichzelf herstelt', en: 'A self-healing ring' },
  lessons: [AUT],
  scenes: [
    {
      id: 's1', lesson: AUT, level: 2, dur: DUR[0], still: 0.92, title: { nl: 'Zonder automatisering', en: 'Without automation' },
      beats: [
        B('Een MS-ring voedt {n:1200} klanten, via zeven netstations.', 'An MV ring feeds {n:1200} customers through seven secondary substations.', { cues: [] }),
        B('Een kabelfout: de vermogensschakelaar in het onderstation gaat uit. Iedereen zit zonder stroom.', 'A cable fault: the breaker in the substation trips. Everyone is off.', { cues: [] }),
        B('Een monteur rijdt van station naar station, leest de verklikkers af en schakelt met de hand.', 'A technician drives from station to station, reads the indicators and switches by hand.', { cues: [] }),
        B('{n:1200} × {n:90} min = {n:108000} {t:Klantminuten|klantminuten}.', '{n:1200} × {n:90} min = {n:108000} {t:Customer minutes|customer minutes}.', { cue: { Klantminuten: 'count' } }),
      ],
    },
    {
      id: 's2', lesson: AUT, level: 2, dur: DUR[1], still: 0.92, title: { nl: 'Schakelen op afstand', en: 'Switching remotely' },
      beats: [
        B('{t:Distributieautomatisering|Distributieautomatisering}: het MS-net op afstand bedienen en bewaken.', '{t:Distribution automation|Distribution automation}: remote control and monitoring of the MV grid.', { cue: { Distributieautomatisering: 'link' } }),
        B('Een {t:Afstandsbediende schakelaar|afstandsbediende schakelaar}: een lastscheider met motoraandrijving.', 'A {t:Remote-controlled switch|remote-controlled switch}: a load-break switch with a motor drive.', { cue: { 'Afstandsbediende schakelaar': 'motor' } }),
        B('In het station: een kastje met een modem, een accu en de besturing.', 'In the station: a small cabinet with a modem, a battery and the controls.', { cues: ['cab'] }),
        B('Het bedrijfsvoeringscentrum ziet de fout in SCADA en schakelt in minuten.', 'The control room sees the fault in SCADA and switches in minutes.', { cues: ['link'] }),
      ],
    },
    {
      id: 's3', lesson: AUT, level: 2, dur: DUR[2], still: 0.92, title: { nl: 'Kortsluitverklikkers', en: 'Fault indicators' },
      beats: [
        B('Een {t:Kortsluitverklikker|kortsluitverklikker} gaat branden als er foutstroom langs is gekomen.', 'A {t:Fault indicator|fault indicator} lights up when fault current has passed it.', { cue: { Kortsluitverklikker: 'fpi' } }),
        B('Foutstroom loopt van de bron naar de fout, en niet verder.', 'Fault current flows from the source to the fault, and no further.', { cues: [] }),
        B('De fout zit tussen de laatste verklikker die hem zag en de eerste die niks zag.', 'The fault lies between the last indicator that saw it and the first that did not.', { cues: [] }),
        B('Melden ze zich bij het bedrijfsvoeringscentrum, dan scheelt dat de rit om ze af te lezen.', 'If they report to the control room, that saves the drive to read them.', { cues: [] }),
      ],
    },
    {
      id: 's4', lesson: AUT, level: 2, dur: DUR[3], still: 0.92, title: { nl: 'Twee sleutelstations', en: 'Two key stations' },
      beats: [
        B('Nu met afstandsbediende schakelaars in twee sleutelstations: 4 en 7.', 'Now with remote-controlled switches in two key stations: 4 and 7.', { cues: [] }),
        B('Het centrum schakelt het defecte stuk in {n:3} minuten vrij: {n:1000} klanten zijn terug.', 'The control room isolates the faulty section in {n:3} minutes: {n:1000} customers are back.', { cues: [] }),
        B('De {n:200} klanten in het stuk ertussen blijven {n:90} minuten zonder.', 'The {n:200} customers in the section between stay off for {n:90} minutes.', { cues: [] }),
        B('{n:1000} × {n:3} + {n:200} × {n:90} = {n:21000} klantminuten: zo’n {n:80}% minder.', '{n:1000} × {n:3} + {n:200} × {n:90} = {n:21000} customer minutes: about {n:80}% less.', { cues: ['count'] }),
      ],
    },
    {
      id: 's5', lesson: AUT, level: 2, dur: DUR[4], still: 0.92, title: { nl: 'Zelfherstellend', en: 'Self-healing' },
      beats: [
        B('De beveiliging schakelt de fout eerst af, in het onderstation.', 'The protection clears the fault first, in the substation.', { cues: [] }),
        B('Een {t:Zelfherstellende ring|zelfherstellende ring} vindt, scheidt en herstelt zelf, vaak binnen een minuut.', 'A {t:Self-healing ring|self-healing ring} locates, isolates and restores by itself, often within a minute.', { cue: { 'Zelfherstellende ring': 'heal' } }),
        B('Dat vraagt betrouwbare communicatie, kloppende netdata en goed geteste logica.', 'It needs reliable communication, accurate network data and well-tested logic.', { cues: [] }),
        B('Elke stap laten bevestigen, of de logica zijn gang laten gaan? Daarover verschillen experts.', 'Confirm every step, or let the logic run? Experts differ on that.', { cues: [] }),
      ],
    },
    {
      id: 's6', lesson: AUT, level: 2, dur: DUR[5], still: 0.92, title: { nl: 'Welke stations?', en: 'Which stations?' },
      beats: [
        B('Elk netstation automatiseren is te duur: per ring een paar sleutelstations, vaak twee of drie.', 'Automating every station is too expensive: a few key stations per ring, often two or three.', { cues: [] }),
        B('De afweging: kosten per station tegenover minder klantminuten en minder rijden.', 'The trade-off: cost per station against fewer customer minutes and less driving.', { cues: [] }),
        B('Nederland: zo’n {n:20} tot {n:25} minuten per klant per jaar, {n:23.4} in 2025.', 'The Netherlands: about {n:20} to {n:25} minutes per customer a year, {n:23.4} in 2025.', { cues: [] }),
      ],
    },
    {
      id: 's7', lesson: AUT, level: 2, dur: DUR[6], still: 0.92, title: { nl: 'Wat er misgaat', en: 'What goes wrong' },
      beats: [
        B('Typische fouten: een lege accu als het erop aankomt.', 'Typical failures: a flat battery just when it is needed.', { cues: ['cab'] }),
        B('Communicatie die wegvalt in een storm, en netdata die niet kloppen.', 'Communication that drops in a storm, and network data that are wrong.', { cues: ['ant'] }),
        B('Elke verbinding is ook een ingang: beveilig hem als OT, met zones en conduits.', 'Every link is also a way in: secure it as OT, with zones and conduits.', { cues: ['link'] }),
        B('Vraag: welke ringen geven de meeste klantminuten, en waar helpt één schakelaar het meest?', 'Ask: which rings cause the most customer minutes, and where would one switch help most?', { cues: [] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this tells every point of both (checklist in the
// model above). No "/", "×", "=", "%" or units as symbols in the spoken text:
// "min" and "%" are said by the kit's SAY rules, "×" and "=" as "maal" and
// "is". Terms as in eng.switchgear.devices (vermogensschakelaar, lastscheider,
// RMU), the grid modules (kortsluitverklikker, normaal openpunt with its
// definition word for word as in eng.gridops and the outage film,
// bedrijfsvoeringscentrum, klantminuten), eng.ot.isa95 (SCADA) and the cyber
// module (zones en conduits). Dutch words checked with espeak-ng phonemes
// (Piper's own bridge, films/_kit/voice-ab/phon.py with nl_NL-alex-medium):
// read right: distributieautomatisering, afstandsbediende, kortsluitverklikker,
// zelfherstellende, klantminuten, bedrijfsvoeringscentrum, bedrijfsvoerder,
// motoraandrijving, openpunt, modem, accu, SCADA, lastscheider, netstation
// (kit rule), toezichthouder (kit rule), conduits (kit rule). New Dutch-only SAY
// rules in films/_kit/timeline.mjs: sleutelstation (espeak-ng reads "-tɛl-"
// with the e of "bed" and stresses "-sjon"; said SLEUtel-staSJON) and
// foutstroom (stressed on "stroom"; said FOUT-STROOM). Kept out of the Dutch
// narration: businesscase (read "byzinɛskaːsə"), netdata (read "nɛtˈaːtaː";
// said "gegevens van het net"), communicatieverbinding (stressed "KOM-";
// "verbinding" alone), schakelstappen, "à" (read "a grave"; said "tot"), relais
// alone (read "REElajs"; beveiligingsrelais is right) and cybermodule (read "sieber").
const SAY = [
  [ // s1 without automation
    B('Een middenspanningsring loopt van het onderstation langs zeven netstations, met samen {n:1200} klanten. In station 7 zit het normaal openpunt naar een buurring: de schakelaar in een MS-ring die openstaat; je sluit hem om een deel van de andere kant te voeden.',
      'A medium-voltage ring runs from the substation past seven secondary substations, with {n:1200} customers between them. Station 7 holds the normally open point to a neighbouring ring: the switch in an MV ring that is kept open; you close it to feed a section from the other side.'),
    B('Dan raakt een graafmachine de kabel tussen station 5 en 6. Het beveiligingsrelais ziet de kortsluiting, en de vermogensschakelaar in het onderstation gaat uit. Iedereen zit zonder stroom.',
      'Then a digger hits the cable between stations 5 and 6. The protection relay sees the short circuit, and the circuit breaker in the substation trips. Everyone is off.'),
    B('Zonder automatisering rijdt een monteur van station naar station. Hij leest de verklikkers af, opent de lastscheiders rond het kapotte stuk met de hand, en sluit het openpunt. Dat kost één tot twee uur zonder stroom voor de meeste klanten.',
      'Without automation, a technician drives from station to station. He reads the indicators, opens the load-break switches around the damaged section by hand, and closes the open point. That means one to two hours without power for most customers.'),
    B('Zeg dat alle klanten {n:90} minuten zonder zitten. Dat telt de netbeheerder in {t:Klantminuten|klantminuten}: het aantal klanten zonder stroom maal de minuten zonder stroom. {n:1200} maal {n:90} is {n:108000} klantminuten.',
      'Say all of them are off for {n:90} minutes. The grid operator counts that in {t:Customer minutes|customer minutes}: the number of customers off times the minutes without power. {n:1200} times {n:90} is {n:108000} customer minutes.'),
  ],
  [ // s2 switching remotely
    B('{t:Distributieautomatisering|Distributieautomatisering} betekent: het middenspanningsnet op afstand bedienen en bewaken.',
      '{t:Distribution automation|Distribution automation} means remote control and monitoring of the medium-voltage grid.'),
    B('Een aantal netstations krijgt een {t:Afstandsbediende schakelaar|afstandsbediende schakelaar}. Dat is een lastscheider met motoraandrijving, die het bedrijfsvoeringscentrum via een verbinding open en dicht kan zetten.',
      'Some stations get a {t:Remote-controlled switch|remote-controlled switch}: a motor-driven load-break switch that the control room can open and close over a communication link.'),
    B('In het station zie je een kastje met een modem, een accu en de besturing, en de motoraandrijving op de schakelaar. De accu houdt alles werkend als de spanning in het station weg is, precies tijdens een storing.',
      'In the station you see a small cabinet with a modem, a battery and the controls, and the motor drive on the switch. The battery keeps everything working when the station has lost its supply, which is exactly during an outage.'),
    B('In het bedrijfsvoeringscentrum ziet de bedrijfsvoerder in SCADA waar de fout zit. Hij schakelt in minuten, zonder te wachten tot er een monteur ter plaatse is.',
      'In the control room, the operator sees in SCADA where the fault is, and switches in minutes, without waiting for a technician to arrive.'),
  ],
  [ // s3 fault indicators
    B('Elk ringveld heeft een {t:Kortsluitverklikker|kortsluitverklikker}: een sensor rond de kabel en een lampje. Hij gaat branden, of geeft een signaal, als er foutstroom langs is gekomen.',
      'Each ring panel has a {t:Fault indicator|fault indicator}: a sensor round the cable and a lamp. It lights up, or sends a signal, when fault current has passed it.'),
    B('Foutstroom loopt van de bron naar de fout, en niet verder. Hier gaan de verklikkers in station 1 tot en met 5 branden. In station 6 en 7 blijven ze uit.',
      'Fault current flows from the source to the fault, and no further. Here the indicators in stations 1 to 5 light up; in 6 and 7 they stay dark.'),
    B('De fout zit dus tussen de laatste verklikker die hem zag en de eerste die niks zag: tussen station 5 en 6.',
      'So the fault lies between the last indicator that saw it and the first that did not: between stations 5 and 6.'),
    B('Verklikkers die zich bij het bedrijfsvoeringscentrum melden, besparen de rit om ze af te lezen. Ook zonder schakelen op afstand scheelt dat alleen al veel minuten. Hoe het centrum de hele storing afhandelt, zie je in Netbedrijf en assetmanagement.',
      'Indicators that report to the control room save the drive to read them. Even without remote switching, that alone can save many minutes. How the control room handles the whole outage is in Grid operations and assets.'),
  ],
  [ // s4 two key stations: the worked example
    B('Nu dezelfde fout, met afstandsbediende schakelaars in twee sleutelstations: station 4, en station 7 met het openpunt.',
      'Now the same fault, with remote-controlled switches in two key stations: station 4, and station 7 with the open point.'),
    B('Het bedrijfsvoeringscentrum opent in station 4 de schakelaar richting 5, en in station 7 die richting 6. De vermogensschakelaar gaat weer in, en het openpunt gaat dicht. Zo is het defecte stuk in {n:3} minuten vrijgeschakeld, en zijn {n:1000} klanten terug.',
      'The control room opens the switch towards 5 in station 4, and the one towards 6 in station 7. The breaker goes back in and the open point closes. The faulty section is isolated in {n:3} minutes, and {n:1000} customers are back.'),
    B('De {n:200} klanten van station 5 en 6 zitten in het stuk ertussen. Zij blijven {n:90} minuten zonder, tot de monteur daar met de hand heeft geschakeld.',
      'The {n:200} customers of stations 5 and 6 are in the section between. They stay off for {n:90} minutes, until the technician has switched there by hand.'),
    B('{n:1000} maal {n:3} plus {n:200} maal {n:90} is {n:3000} plus {n:18000}, samen {n:21000} klantminuten. Dat is zo’n {n:80}% minder dan {n:108000}, met maar twee aangepaste netstations.',
      '{n:1000} times {n:3} plus {n:200} times {n:90} is {n:3000} plus {n:18000}: {n:21000} customer minutes. That is about {n:80}% less than {n:108000}, from just two upgraded stations.'),
  ],
  [ // s5 self-healing
    B('Eerst doet de beveiliging haar werk: de vermogensschakelaar in het onderstation schakelt de kortsluiting af. Een lastscheider onderbreekt nooit zelf een kortsluiting.',
      'First, protection does its job: the circuit breaker in the substation clears the short circuit. A load-break switch never breaks a short circuit itself.'),
    B('Een {t:Zelfherstellende ring|zelfherstellende ring} gaat een stap verder dan schakelen op afstand. Het systeem vindt de fout uit de verklikkers, opent de schakelaars eromheen en sluit het openpunt, helemaal zelf, vaak binnen een minuut.',
      'A {t:Self-healing ring|self-healing ring} goes one step further than remote switching. The system locates the fault from the indicators, opens the switches around it and closes the open point by itself, often within a minute.'),
    B('Dat vraagt betrouwbare communicatie, kloppende gegevens van het net, en goed geteste logica. Daarom voeren netbeheerders het stap voor stap in.',
      'It needs reliable communication, accurate network data and well-tested logic, so operators introduce it step by step.'),
    B('Experts discussiëren over vertrouwen. Sommige bedrijfsvoeringscentra willen dat een bedrijfsvoerder elke stap bevestigt. Andere laten de logica zijn gang gaan.',
      'Experts argue about trust. Some control rooms want an operator to confirm each step; others let the logic run.'),
  ],
  [ // s6 which stations
    B('Elk netstation automatiseren is te duur. Netbeheerders kiezen per ring een paar sleutelstations, vaak twee of drie, waar een afstandsbediende schakelaar de ring in stukken verdeelt.',
      'Automating every station is too expensive. Operators choose a few key stations per ring, often two or three, where a remote-controlled switch splits the ring into sections.'),
    B('Dat is een zakelijke afweging: de kosten per station tegenover minder klantminuten, en minder rijden.',
      'That is a business case: the cost per station against fewer customer minutes, and less driving.'),
    B('Door onvoorziene storingen zit een Nederlandse klant gemiddeld zo’n {n:20} tot {n:25} minuten per jaar zonder stroom, in 2025 zo’n {n:23}. En de toezichthouder koppelt een deel van de inkomsten van netbeheerders aan die kwaliteit.',
      'Unplanned outages leave Dutch customers without power for around {n:20} to {n:25} minutes a year on average, about {n:23} in 2025. And the regulator links part of the operators’ income to that quality.'),
  ],
  [ // s7 what goes wrong
    B('Wat gaat er mis? Accu’s die leeg zijn als het erop aankomt: dan geen motor en geen modem.',
      'What goes wrong? Batteries that are flat when needed: then no motor and no modem.'),
    B('Communicatie die wegvalt tijdens een storm. En gegevens van het net die niet kloppen met de werkelijkheid, zodat het systeem de verkeerde schakelaar kiest.',
      'Communication that drops during a storm. And network data that do not match reality, so the system picks the wrong switch.'),
    B('En elke verbinding naar een station is ook een mogelijke ingang voor aanvallers. Behandel hem daarom als OT, met zones en conduits, net als in een fabriek.',
      'And every link to a station is also a possible way in for attackers. So treat it as OT, with zones and conduits, just as in a plant.'),
    B('Een scherpe vraag: welke ringen veroorzaken de meeste klantminuten, en waar helpt één afstandsbediende schakelaar het meest?',
      'A sharp question: which rings cause the most customer minutes, and where would one remote switch help most?'),
  ],
];
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
.mf-needle{fill:none;stroke:var(--anatomy-strong);stroke-width:.35px;stroke-linecap:round}
.mf-pivot{fill:var(--anatomy-hi)}
.mf-blade{fill:none;stroke:var(--anatomy-strong);stroke-width:.55px;stroke-linecap:round}
.mf-lamp,.mf-led{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.25px}
.mf-lamp[data-lit],.mf-led[data-lit]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.mf-wave{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-linecap:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .mf-blade{stroke:var(--fp-accent)}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-off{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.8;stroke-dasharray:3 3}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-monon{fill:var(--fp-accent-text);font-family:var(--anatomy-mono);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mf-ghost{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:6 5}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:3;stroke-dasharray:8 8;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-ring{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:2}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line{stroke:var(--fp-accent);stroke-width:3}
[data-cue][data-on] .mf-tile{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een netstation als sleutelstation: een RMU met drie velden, twee met een motoraandrijving op de schakelaar en een kortsluitverklikker met lampje, een kastje met antenne voor modem, accu en besturing, en een kabel naar de transformator. Kaarten tonen de MS-ring als schema met onderstation, zeven netstations, het openpunt, de verklikkers, de fout en de teller van klantminuten, het SCADA-scherm, het kastje van binnen, de afweging per station, de storingsminuten in Nederland en wat er misgaat.',
  en: 'A secondary substation as a key station: an RMU with three panels, two with a motor drive on the switch and a fault indicator with its lamp, a cabinet with an antenna for the modem, battery and controls, and a cable to the transformer. Cards show the MV ring as a diagram with the substation, seven stations, the open point, the indicators, the fault and the customer-minutes counter, the SCADA screen, the cabinet inside, the trade-off per station, the Dutch outage minutes and what goes wrong.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

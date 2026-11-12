// Dev tool, not shipped. Builds the explainer film "De vijf veiligheidsregels /
// The five safety rules" for three lessons in three grid and safety modules:
// - eng.switchgear.safety (level 1 of the topic Veilig schakelen, Schakelinstallaties en beveiliging),
// - eng.gridops.switching (level 2 of the topic Werk in het veld, Netbedrijf en assetmanagement),
// - eng.safety.nen3140 (level 2 of the topic Scheiden, elektrisch werk en vergunningen, Veilig werken).
//
//   node films/eng.switchgear.fiverules/build.mjs            build the page
//   node films/eng.switchgear.fiverules/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.switchgear.fiverules.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.switchgear.fiverules). The plan row lists switchgear.safety,
// gridops.switching and safety.nen3140; all three ids still exist after the
// topics x levels rebuild, none had a film, so no mapping was needed.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of the three lessons' teach text AND worked examples: the MV
// cable between netstations 8 and 9 (plan by the control room and the IV, both
// stations switched, locked and tagged, the tester proved on a live source,
// three cores tested in both stations, earthing switches at both ends, live
// parts screened, the WV releases the cable, the jointing crew finds the cable
// and proves it dead again by spiking); the switching capacity sum (6 x 2 x 4 x
// 12 = 576 slots against 700 x 2 = 1.400, 2,4 times; switching as the
// constraint, bundling saves 2 slots a pair, choosing openly what moves); and
// the consultant who times a cable repair (asks the planner for the WV the day
// before and calls him, stays outside the barrier in the helmet and arc-rated
// clothing she is given, touches nothing, asks in the breaks).
//
// The world is the secondary substation of films/eng.switchgear.devices (the
// RMU with its three panels, mimic blades, operating sockets, gauge and
// padlock, the cable and the 400 kVA transformer), here netstation 8, with a
// tag under the padlock, an insulating screen on two feet before the panels
// that stay live, the technician (as the outage film's storingsmonteur, here
// the schakelmonteur of a planned job) and, behind a barrier tape, the
// consultant. The people are the standing figure of the LOTO and permit films.
// Cards in stage space: the five rules, the standards and the roles with the
// written appointment, a switching plan, the two stations with the cable
// (switches, locks, back-feed, earths, screens, the trench), the tester, the
// site and its typical faults, the report log and the switching capacity, and
// the layperson's rules. Example cards are labelled "voorbeeld" (or "schema").
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
// by defineFilm. Facts checked against:
// - The five safety rules: NEN-EN 50110-1, 6.2 (dead working: disconnect
//   completely, secure against re-connection, verify that the installation is
//   dead, carry out earthing and short-circuiting, provide protection against
//   adjacent live parts), always in this order. For low voltage EN 50110 lets
//   earthing and short-circuiting be left out where there is no risk of the
//   part becoming live again; the lessons do not go into that and neither does
//   the film (an open point for the reviewer, not said).
// - NEN 3140 (low voltage: up to 1.000 V AC or 1.500 V DC) and NEN 3840 (above
//   that), both on NEN-EN 50110; the legal duty in the Arbobesluit (chapter 3,
//   electrical work), the standards as the accepted way to meet it; the grid
//   operators' sector rules BEI-BLS and BEI-BHS.
// - Roles and the written appointment (aanwijzing): IV (installatie-
//   verantwoordelijke, EN 50110 "person in control of the installation"), WV
//   (werkverantwoordelijke), VP, VOP and leek (EN 50110 "ordinary person").
// - Restoring after the work: NEN-EN 50110-1, 6.3, roughly the steps in
//   reverse (people clear, earths and screens off, locks off, then switching
//   in, by the plan); said "in omgekeerde volgorde" as a rule of thumb.
// - A voltage detector is proved on a known live source (or a proving unit)
//   just before and, by good practice, also after the test; the film says
//   "vlak ervoor", as the lesson does.
// - Spiking (aanschieten): a remote tool drives a spike through the cable to
//   prove it dead before it is cut; "bijvoorbeeld", as the lesson says.
// The five rules are said word for word as in eng.gridops and in the films
// that quote them (eng.switchgear.devices, eng.gridops.outage, and the rules
// card of eng.safety.loto); the build reads those files and fails if they
// drift apart.
const SG = 'eng.switchgear.safety';
const GS = 'eng.gridops.switching';
const NN = 'eng.safety.nen3140';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const RULES = {
  nl: ['vrijschakelen', 'beveiligen tegen herinschakelen', 'spanningsloosheid vaststellen', 'aarden en kortsluiten', 'naastgelegen delen onder spanning afschermen'],
  en: ['disconnect', 'secure against reconnection', 'verify absence of voltage', 'earth and short-circuit', 'protect against adjacent live parts'],
};
const listOf = (r) => `${r.slice(0, 4).join(', ')}, en ${r[4]}`;
const LIST = { nl: listOf(RULES.nl), en: listOf(RULES.en).replace(', en ', ', and ') };
{
  const read = (f) => readFileSync(join(HERE, '..', f), 'utf8');
  for (const f of ['eng.switchgear.devices/build.mjs', 'eng.gridops.outage/build.mjs']) {
    const src = read(f);
    assert(src.includes(LIST.nl) && src.includes(LIST.en), `the five rules as in ${f}`);
  }
  const loto = read('eng.safety.loto/stage.js');
  assert(loto.includes(RULES.nl.map((r) => `'${r}'`).join(', ')) && loto.includes(RULES.en.map((r) => `'${r}'`).join(', ')), 'the five rules as on the LOTO card');
  const g = lessons.nl.get(GS);
  const gt = g.teach.join('\n');
  assert(gt.includes('vrijschakelen; beveiligen tegen herinschakelen met een slot en een label; spanningsloosheid vaststellen met een geteste spanningzoeker; aarden en kortsluiten; naastgelegen delen onder spanning afschermen'), 'the five rules in eng.gridops.switching (nl)');
  assert(lessons.en.get(GS).teach.join('\n').includes('disconnect; secure against reconnection with a lock and a tag; verify absence of voltage with a tested voltage detector; earth and short-circuit; protect against adjacent live parts'), 'the five rules in eng.gridops.switching (en)');
  assert(gt.includes('welke schakelaar, in welk station, open of dicht, door wie, in welke volgorde, en wat je daarna controleert'), 'the switching plan step');
  assert(gt.includes('Een lastscheider mag normale belastingstroom onderbreken; een scheider mag alleen open als er geen stroom loopt'), 'load-break switch and disconnector');
  assert(gt.includes('een tweede bevoegde persoon controleert het') && gt.includes('schakelagenda') && gt.includes('krijgen vooraf bericht'), 'the approval chain');
  assert(gt.includes('Een stap gedaan maar niet gemeld is een klassiek bijna-ongeval') && gt.includes('geen schakelmoment tot week 14'), 'report each step; week 14');
  assert(gt.includes('klussen bundelen in één onderbreking') && gt.includes('standaardplannen') && gt.includes('meer schakelpersoneel opleiden'), 'remedies');
  const gx = g.example.text;
  assert(gx.includes('6 schakelmonteurs') && gx.includes('2 schakelklussen per dag, 4 dagen per week') && gx.includes('(12 weken)') && gx.includes('700 klussen'), 'the capacity example');
  assert(gx.includes('6 × 2 × 4 × 12 = 576') && gx.includes('700 × 2 = 1.400, 2,4 keer de capaciteit') && gx.includes('scheelt 2 momenten'), 'the capacity sums');
  const s = lessons.nl.get(SG);
  const st = s.teach.join('\n');
  assert(st.includes('tot 1.000 V wisselspanning of 1.500 V gelijkspanning, en NEN 3840 op hogere spanningen'), 'NEN 3140 and NEN 3840');
  assert(st.includes('aggregaat, zonnepanelen of een andere ring') && st.includes('geïnduceerde of achtergebleven spanning'), 'the failures');
  assert(st.includes('een deel aarden dat nog onder spanning staat geeft kortsluiting en een vlamboog bij de monteur'), 'earthing only after testing');
  assert(st.includes('aardgarnituren') && st.includes('een spanningzoeker die niet gecontroleerd is'), 'site and faults');
  const sx = s.example.text;
  assert(sx.includes('netstation 8 en 9') && sx.includes('in beide stations (regel 1)') && sx.includes('alle drie de aders') && sx.includes('aan beide kanten (regel 4)'), 'the cable example');
  assert(sx.includes('Pas dan geeft de WV de kabel vrij voor de moffenploeg') && sx.includes('(spiking)'), 'the release and spiking');
  const n = lessons.nl.get(NN);
  assert(n.teach.join('\n').includes('Arbobesluit') && n.teach.join('\n').includes('een explosie van gloeiend hete lucht'), 'Arbobesluit, arc flash');
  assert(n.example.text.includes('Een dag van tevoren vraagt ze de planner wie de WV van de klus is') && n.example.text.includes('in de pauzes'), 'the consultant example');
}
// the switching capacity: 6 technicians × 2 a day × 4 days × 12 weeks, against 700 jobs × 2 slots
const TECHS = 6;
const PER_DAY = 2;
const DAYS = 4;
const WEEKS = 12;
const JOBS = 700;
const CAP = TECHS * PER_DAY * DAYS * WEEKS;
const NEED = JOBS * 2;
assert(CAP === 576 && NEED === 1400 && Math.round((NEED / CAP) * 10) / 10 === 2.4, '576 against 1.400, 2,4 times');
// ---------------------------------------------------------------- the world: a secondary substation
// World units are centimetres, z up, x along the front (RMU at −x, transformer at
// +x), +y toward the viewer. The top of the station floor is z = 0.
const W = 640;
const H = 400;
const FLOOR = -6;
const SLAB = { x: -172, y: -46, w: 324, d: 108, r: 2 };
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
  // the technician and, behind the barrier, the consultant (drawn by stage.js)
  ...k.boxCorners({ x: -164, y: 22, w: 94, d: 34 }, 0, 166),
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
  if (/^rmu\.tag/.test(name)) return ['rmu', 'tag'];
  if (/^shield/.test(name)) return ['shield'];
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
    steps: 2, bevel: 0.15, attrs: ' data-k="lockW"',
    extra: L(k.segment([cx - 1, FF + 2.2, 61.6], [cx - 1, FF + 2.2, 62.6], P) + k.segment([cx + 1, FF + 2.2, 61.6], [cx + 1, FF + 2.2, 62.6], P) + k.segment([cx - 1, FF + 2.2, 62.6], [cx + 1, FF + 2.2, 62.6], P), { tone: 'mid' })
      + Dt([at([cx, FF + 3, 60])], { size: 0.32, tone: 'lo' }),
  });
  // the tag hung under the padlock: a card with its eyelet and two printed rule lines
  box('rmu.tag', { x: cx - 2.2, y: FY, w: 4.4, d: 0.8, r: 0.2 }, 51.8, 58.6, { tone: 'hi' }, {
    steps: 1, attrs: ' data-k="tagW"',
    extra: L(k.segment([cx - 1.4, FY + 0.8, 56], [cx + 1.2, FY + 0.8, 56], P) + k.segment([cx - 1.4, FY + 0.8, 54.4], [cx + 0.4, FY + 0.8, 54.4], P), { tone: 'lo', free: true })
      + Dt([at([cx, FY + 0.8, 57.6])], { size: 0.3, tone: 'mid' }),
  });
}
// the insulating screen (rule 5) standing in front of the two panels that stay live: a board on two feet
{
  const x0 = PX[1] + 1.5;
  const x1 = PX[2] + PW - 1.5;
  const y = FY + 7;
  for (const x of [x0 + 4, x1 - 10]) box('shield.foot', { x, y: y - 4, w: 6, d: 9, r: 0.6 }, 0, 2.2, { tone: 'lo' }, { steps: 2, bevel: 0.2, attrs: ' data-k="shieldF"' });
  const plan = { x: x0, y, w: x1 - x0, d: 1.2, r: 0.4 };
  const fy = y + 1.2;
  const rules = [16, 24].map((z) => k.segment([x0, fy, z], [x1, fy, z], P)).join('');
  box('shield.board', plan, 2.2, 56, { tone: 'hi' }, {
    steps: 2, bevel: 0.25, attrs: ' data-k="shieldB"',
    extra: L(rules, { tone: 'lo' }) + Dt([[x0 + 2, fy, 52], [x1 - 2, fy, 52], [x0 + 2, fy, 6], [x1 - 2, fy, 6]].map(at), { size: 0.4, tone: 'mid' }),
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
  turned('trafo.bush', frameZ([x, y, z0]), [[0, 1.7], [2.2, 1.7], [2.2, 2.5], [3, 2.5], [3, 1.7], [4.6, 1.7], [4.6, 2.5], [5.4, 2.5], [5.4, 1.7], [7, 1.7]], { tone: 'hi' });
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

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const RMU_AT = at([PC[1], FY, 70]);
// The people stand in front of the station, nearer the viewer than every
// recorded part, so they are drawn after the settled items: the technician
// beside the RMU, and further left, behind a barrier tape on two posts, the
// consultant. stage.js draws the figures once at load (person), as the LOTO and
// permit films do, which keeps the page small.
const TECH = [-84, 44];
const LAY = [-152, 30];
const BAR = { x: -114, y0: 16, y1: 56, z: 92 };
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  `<g data-k="barW"><g data-cue="barrier"><g data-k="barBack"></g></g><g data-cue="leek"><g data-k="layBody"></g></g><g data-cue="barrier"><g data-k="barBody"></g></g></g>`,
  `<g data-cue="tech"><g data-k="techBody"></g></g>`,
  `<g data-cue="rmu"><circle class="mf-mark" data-k="mk-rmu" cx="${RMU_AT[0].toFixed(1)}" cy="${RMU_AT[1].toFixed(1)}" r="0"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('ru', g('ruBase', '') + cue('rules', g('ruIn', ''))),
  g('nm', g('nmBase', '') + cue('n3140', g('nmL', '')) + cue('norm', g('nmIn', ''))),
  g('rl', g('rlBase', '') + ['iv', 'wv', 'vp', 'vop', 'lay'].map((c, i) => cue(c, g(`rl${i}`, ''))).join('') + cue('appt', g('rlAp', ''))),
  g('pl', g('plBase', '') + cue('plan', g('plIn', '')) + g('plTxt', '')),
  g('rg', g('rgBase', '') + g('rgIn', '') + cue('feed', g('rgFeed', '')) + cue('lock', g('rgLock', '')) + cue('earth', g('rgEarth', '')) + cue('shield', g('rgShield', '')) + cue('flash', g('rgFlash', '')) + cue('wvok', g('rgOk', '')) + cue('trench', g('rgTr', ''))),
  g('ts', g('tsBase', '') + cue('tester', g('tsT', '')) + cue('cores', g('tsC', '')) + g('tsTxt', '')),
  g('si', g('siBase', '') + cue('site', g('siA', '')) + cue('faults', g('siB', ''))),
  g('cp', g('cpBase', '') + cue('log', g('cpLog', '')) + cue('slot', g('cpSlot', '')) + cue('cap', g('cpIn', '')) + g('cpFix', '')),
  g('lk', g('lkBase', '') + g('lkIn', '')),
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

// ---------------------------------------------------------------- the film
const DUR = [30, 46, 34, 26, 24, 30, 32, 44, 32];
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.switchgear.fiverules',
  title: { nl: 'De vijf veiligheidsregels', en: 'The five safety rules' },
  lessons: [SG, GS, NN],
  scenes: [
    {
      id: 's1', lesson: SG, level: 1, dur: DUR[0], still: 0.92, title: { nl: 'Spanningsloos werken', en: 'Working dead' },
      beats: [
        B('Netstation {n:8}: de MS-kabel naar netstation {n:9} wordt vervangen, spanningsloos.', 'Secondary substation {n:8}: the MV cable to substation {n:9} is replaced, dead.', { cues: ['rmu'] }),
        B('Je ziet, hoort en ruikt niet of een geleider onder spanning staat.', 'You cannot see, hear or smell whether a conductor is live.', { cues: ['tech'] }),
        B('Daarom de {t:Vijf veiligheidsregels|vijf veiligheidsregels} van NEN-EN 50110, altijd in deze volgorde.', 'Hence the {t:Five safety rules|five safety rules} of NEN-EN 50110, always in this order.', { cue: { 'Vijf veiligheidsregels': 'rules' } }),
        B('Elke regel dekt een echte fout. Een stap overslaan is hoe ernstige ongevallen gebeuren.', 'Each rule covers a real failure. Skipping a step is how serious accidents happen.', { cues: ['rules'] }),
      ],
    },
    {
      id: 's2', lesson: SG, level: 1, dur: DUR[1], still: 0.92, title: { nl: 'Normen en rollen', en: 'Standards and roles' },
      beats: [
        B('{t:NEN 3140|NEN 3140}: laagspanning, tot {n:1000} V wissel- of {n:1500} V gelijkspanning. Daarboven NEN 3840.', '{t:NEN 3140|NEN 3140}: low voltage, up to {n:1000} V AC or {n:1500} V DC. Above that, NEN 3840.', { cue: { 'NEN 3140': 'n3140' } }),
        B('Beide bouwen op NEN-EN 50110; de plicht komt uit het Arbobesluit. Netbeheerders voegen de BEI toe.', 'Both build on NEN-EN 50110; the duty comes from the Working Conditions Decree. Grid operators add the BEI.', { cues: ['norm'] }),
        B('De {t:IV|IV} is verantwoordelijk en geeft toestemming; de {t:WV|WV} leidt de klus ter plaatse.', 'The {t:IV|IV} is responsible and gives permission; the {t:WV|WV} leads the job on site.', { cue: { IV: 'iv', WV: 'wv' } }),
        B('Een {t:VP|VP} beoordeelt de risico’s, een {t:VOP|VOP} doet afgebakende taken, ieder ander is {t:Leek|leek}.', 'A {t:VP|VP} judges the risks, a {t:VOP|VOP} does defined tasks, everyone else is a {t:Layperson|layperson}.', { cue: { VP: 'vp', VOP: 'vop', Leek: 'lay' } }),
        B('Kunde alleen is niet genoeg: de schriftelijke {t:Aanwijzing|aanwijzing} telt.', 'Skill alone is not enough: the {t:Written appointment|written appointment} counts.', { cue: { Aanwijzing: 'appt' } }),
      ],
    },
    {
      id: 's3', lesson: GS, level: 2, dur: DUR[2], still: 0.92, title: { nl: 'Het schakelplan', en: 'The switching plan' },
      beats: [
        B('Een {t:Schakelplan|schakelplan}: uit bedrijf nemen, veilig maken en terugbrengen, stap voor stap.', 'A {t:Switching plan|switching plan}: take it out of service, make it safe, bring it back, step by step.', { cue: { Schakelplan: 'plan' } }),
        B('Per stap: welke schakelaar, welk station, open of dicht, door wie, wanneer, en wat je controleert.', 'Each step: which switch, which station, open or close, by whom, in what order, and what to check.', { cues: [] }),
        B('De volgorde telt: een scheider mag alleen open als er geen stroom loopt.', 'Order matters: a disconnector may only open when no current flows.', { cues: [] }),
        B('Geschreven, gecontroleerd door een tweede, vrijgegeven; klanten krijgen vooraf bericht.', 'Written, checked by a second person, released; customers are told in advance.', { cues: [] }),
      ],
    },
    {
      id: 's4', lesson: SG, level: 1, dur: DUR[3], still: 0.92, title: { nl: 'Regel 1 en 2', en: 'Rules 1 and 2' },
      beats: [
        B('Regel 1, vrijschakelen: de schakelaar naar de kabel open, in station {n:8} en in station {n:9}.', 'Rule 1, disconnect: the switch to the cable opens, in station {n:8} and in station {n:9}.', { cues: ['rmu'] }),
        B('Aan alle kanten: {t:Terugvoeding|terugvoeding} komt uit een aggregaat, zonnepanelen of een andere ring.', 'On all sides: a {t:Back-feed|back-feed} comes from a generator, solar panels or another ring.', { cue: { Terugvoeding: 'feed' } }),
        B('Regel 2, beveiligen tegen herinschakelen: een hangslot en een label op elke schakelaar.', 'Rule 2, secure against reconnection: a padlock and a tag on every switch.', { cues: ['lock', 'tag'] }),
      ],
    },
    {
      id: 's5', lesson: SG, level: 1, dur: DUR[4], still: 0.92, title: { nl: 'Regel 3', en: 'Rule 3' },
      beats: [
        B('Regel 3, spanningsloosheid vaststellen: uitgeschakeld is nog niet bewezen spanningsloos.', 'Rule 3, verify absence of voltage: switched off is not yet proven dead.', { cues: [] }),
        B('Eerst de spanningzoeker testen op een bekende bron onder spanning.', 'First prove the voltage detector on a known live source.', { cues: ['tester'] }),
        B('Dan in beide stations meten: alle drie de aders spanningsloos.', 'Then test in both stations: all three cores dead.', { cues: ['cores'] }),
        B('Dat vangt een verkeerd veld, terugvoeding en achtergebleven spanning. Meet altijd zelf.', 'It catches a wrong panel, a back-feed and leftover voltage. Always test yourself.', { cues: [] }),
      ],
    },
    {
      id: 's6', lesson: SG, level: 1, dur: DUR[5], still: 0.92, title: { nl: 'Regel 4 en 5', en: 'Rules 4 and 5' },
      beats: [
        B('Regel 4, {t:Aarden|aarden} en kortsluiten: de aardingsschakelaars dicht, aan beide kanten.', 'Rule 4, {t:Earthing|earth} and short-circuit: the earthing switches close, at both ends.', { cue: { Aarden: 'earth' } }),
        B('Komt er toch spanning op, dan schakelt de beveiliging af in plaats van de ploeg te raken.', 'If voltage comes back, the protection trips instead of hurting the crew.', { cues: ['earth'] }),
        B('Pas na het meten: een deel onder spanning aarden geeft een vlamboog bij de monteur.', 'Only after testing: earthing a live part causes an arc at the technician.', { cues: ['flash'] }),
        B('Regel 5, naastgelegen delen onder spanning afschermen: een scherm voor wat nog spanning heeft.', 'Rule 5, protect against adjacent live parts: a screen in front of what is still live.', { cues: ['shield'] }),
      ],
    },
    {
      id: 's7', lesson: SG, level: 1, dur: DUR[6], still: 0.92, title: { nl: 'Vrijgave', en: 'Release' },
      beats: [
        B('Pas dan geeft de WV de kabel vrij voor de moffenploeg.', 'Only then does the WV release the cable to the jointing crew.', { cues: ['wvok'] }),
        B('In de sleuf: de juiste kabel opzoeken en nog eens aantonen dat hij spanningsloos is.', 'In the trench: find the right cable and prove it dead once more.', { cues: ['trench'] }),
        B('Op locatie: borden, sloten en labels, aardgarnituren, matten en vlamboogwerende kleding.', 'On site: signs, locks and tags, earthing sets, mats and arc-rated clothing.', { cues: ['site'] }),
        B('Typische fouten: een verlopen aanwijzing, een stap uit het hoofd, een ongeteste zoeker.', 'Typical failures: an expired appointment, a step from memory, an unchecked tester.', { cues: ['faults'] }),
      ],
    },
    {
      id: 's8', lesson: GS, level: 2, dur: DUR[7], still: 0.92, title: { nl: 'Schakelmomenten', en: 'Switching slots' },
      beats: [
        B('Elke stap melden aan het bedrijfsvoeringscentrum; terug gaat in omgekeerde volgorde.', 'Every step is reported to the control room; coming back goes in reverse order.', { cues: ['log'] }),
        B('Elke klus vraagt twee {t:Schakelmoment|schakelmomenten}: uit en weer in. Die zijn schaars.', 'Every job needs two {t:Switching slot|switching slots}: off and back on. They are scarce.', { cue: { Schakelmoment: 'slot' } }),
        B('Voorbeeld: {n:6} monteurs × {n:2} per dag × {n:4} dagen × {n:12} weken = {n:576} momenten.', 'Example: {n:6} technicians × {n:2} a day × {n:4} days × {n:12} weeks = {n:576} slots.', { cues: ['cap'] }),
        B('Nodig: {n:700} klussen × {n:2} = {n:1400}, {n:2.4} keer de capaciteit.', 'Needed: {n:700} jobs × {n:2} = {n:1400}, {n:2.4} times the capacity.', { cues: ['cap'] }),
        B('Dus: ploegen op schakelmomenten plannen, en klussen bundelen in één onderbreking.', 'So: plan crews to switching slots, and bundle jobs into one outage.', { cues: [] }),
      ],
    },
    {
      id: 's9', lesson: NN, level: 2, dur: DUR[8], still: 0.92, title: { nl: 'Als leek', en: 'As a layperson' },
      beats: [
        B('Als consultant ben je leek: vraag vooraf wie de WV is, en wat je nodig hebt.', 'As a consultant you are a layperson: ask beforehand who the WV is, and what you need.', { cues: ['leek'] }),
        B('Je blijft buiten het afgezette gebied, met helm en vlamboogwerende kleding.', 'You stay outside the marked area, in a helmet and arc-rated clothing.', { cues: ['barrier'] }),
        B('Je komt nergens aan: geen deur, schakelaar of kap, en geen automaat terugzetten.', 'You touch nothing: no door, switch or cover, and no resetting a breaker.', { cues: [] }),
        B('Je waarde zit in je vragen, niet in je handen. Hier gelden de eigen procedures.', 'Your value is in your questions, not your hands. The site’s own procedures apply.', { cues: ['leek'] }),
      ],
    },
  ],
  skip: [
    { lesson: GS, term: 'Vijf veiligheidsregels', reason: 'Same term and definition as Vijf veiligheidsregels of eng.switchgear.safety, which scene 1 names with its cue (the rules card) and scenes 4 to 6 show rule by rule; the build resolves a shared term name to the first served lesson.' },
    { lesson: GS, term: 'IV', reason: 'Same term and definition as IV of eng.switchgear.safety, which scene 2 names with its cue (the IV badge); scene 3 shows the IV making the switching plan with the control room.' },
    { lesson: GS, term: 'WV', reason: 'Same term and definition as WV of eng.switchgear.safety, which scene 2 names with its cue (the WV badge); scene 7 shows the WV releasing the cable.' },
    { lesson: NN, term: 'IV', reason: 'Same term and definition as IV of eng.switchgear.safety, named with its cue in scene 2 (the IV badge).' },
    { lesson: NN, term: 'WV', reason: 'Same term and definition as WV of eng.switchgear.safety, named with its cue in scene 2 (the WV badge); scene 9 shows the consultant asking for the WV.' },
    { lesson: NN, term: 'Aanwijzing', reason: 'Same term and definition as Aanwijzing of eng.switchgear.safety, named with its cue in scene 2 (the written appointment on the roles card).' },
  ],
};

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round(y * 10) / 10, w]; };
const MIDW = [-10, 0, 60];
const SIDE = (w0, w1) => ({ from: cam(MIDW, w0, 104), to: cam(MIDW, w1, 104) });
const RULE = (w0, w1) => ({ from: cam([PC[0] - 34, FY, 82], w0, 104), to: cam([PC[0] - 30, FY, 80], w1, 104) });
const CAM = [
  { from: cam(MIDW, 700), to: cam(MIDW, 1500, 104), a: 0.5, b: 0.6 },
  SIDE(1500, 1440),
  SIDE(1460, 1400),
  RULE(760, 700),
  SIDE(1440, 1380),
  RULE(780, 720),
  SIDE(1440, 1400),
  SIDE(1420, 1380),
  { from: cam([-100, 30, 80], 640, 104), to: cam([-104, 34, 84], 580, 104) },
];

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the three
// lessons' text and worked examples, so this carries every point of them. No
// "/", "×", "=", "%", brackets, quotes or units as symbols in the spoken text:
// volt is written out and the rule numbers are words. The five safety rules
// are said word for word as in eng.gridops and the films that quote them
// (LIST, asserted above). Terms as in the grid modules and the LOTO and permit
// films: vrijschakelen, hangslot en label, spanningzoeker, aardingsschakelaars,
// bedrijfsvoeringscentrum, schakelmonteur, moffenploeg, IV, WV, VP, VOP, leek,
// aanwijzing. Dutch words checked with espeak-ng phonemes through Piper's own
// bridge (films/_kit/voice-ab/phon.py with nl_NL-alex-medium); the results and
// the Dutch-only SAY rules added for this film are listed in timeline.mjs.
const SAY = [
  [ // s1 working dead
    B('Netstation {n:8}. Tussen hier en netstation {n:9} vervangt een ploeg een stuk middenspanningskabel.',
      'Secondary substation {n:8}. Between here and substation {n:9}, a crew is replacing a length of medium-voltage cable.'),
    B('Het meeste werk aan het net gebeurt spanningsloos, want je ziet, hoort en ruikt niet of een geleider onder spanning staat.',
      'Most work on the grid is done dead, because you cannot see, hear or smell whether a conductor is live.'),
    B(`Daarvoor geeft de Europese norm NEN-EN 50110 de {t:Vijf veiligheidsregels|vijf veiligheidsregels}, altijd in deze volgorde: ${LIST.nl}.`,
      `The European standard NEN-EN 50110 sets the {t:Five safety rules|five safety rules}, always in this order: ${LIST.en}.`),
    B('Elke regel dekt een echte fout, en een stap overslaan is hoe ernstige ongevallen gebeuren.',
      'Each rule covers a real failure, and skipping a step is how serious accidents happen.'),
  ],
  [ // s2 standards and roles
    B('In Nederland past {t:NEN 3140|NEN 3140} de regels toe op laagspanning: tot {n:1000} volt wisselspanning of {n:1500} volt gelijkspanning. Daarboven geldt NEN 3840.',
      'In the Netherlands, {t:NEN 3140|NEN 3140} applies the rules to low voltage: up to {n:1000} volts AC or {n:1500} volts DC. Above that, NEN 3840 applies.'),
    B('Beide bouwen op NEN-EN 50110; ze volgen is de erkende weg om aan het Arbobesluit te voldoen. Netbeheerders voegen de BEI toe.',
      'Both build on NEN-EN 50110; following them is the accepted way to meet the Working Conditions Decree. Grid operators add the BEI.'),
    B('De {t:IV|IV}, de installatieverantwoordelijke, geeft toestemming voor werk. De {t:WV|WV}, de werkverantwoordelijke, leidt de klus ter plaatse, en de veiligheid van de ploeg.',
      'The {t:IV|IV}, in control of the installation, gives permission for work. The {t:WV|WV}, in control of the work, leads the job on site, and the crew’s safety.'),
    B('Een vakbekwaam persoon, {t:VP|VP}, kan de risico’s beoordelen. Een voldoende onderricht persoon, {t:VOP|VOP}, doet afgebakende taken. Ieder ander is {t:Leek|leek}.',
      'A skilled person, a {t:VP|VP}, can judge the risks. An instructed person, a {t:VOP|VOP}, does defined tasks. Everyone else is a {t:Layperson|layperson}.'),
    B('Kunde alleen geeft geen recht. Dat doet de schriftelijke {t:Aanwijzing|aanwijzing} van de werkgever, na een check van de bekwaamheid: voor een rol, bepaald werk en bepaalde installaties.',
      'Skill alone gives no right. The employer’s {t:Written appointment|written appointment} does, after a check of competence: for a role, specific work and specific installations.'),
  ],
  [ // s3 the switching plan
    B('Het bedrijfsvoeringscentrum en de IV maken een {t:Schakelplan|schakelplan}: het script om dit deel uit bedrijf te nemen, veilig te maken en terug te brengen.',
      'The control room and the IV prepare a {t:Switching plan|switching plan}: the script to take this section out of service, make it safe and bring it back.'),
    B('Per stap: welke schakelaar, in welk station, open of dicht, door wie, in welke volgorde, en wat je daarna controleert.',
      'For each step: which switch, in which station, open or close, by whom, in what order, and what to check after.'),
    B('De volgorde telt: anders vallen klanten uit, of onderbreekt een schakelaar meer dan hij kan. Een lastscheider mag belasting onderbreken, een scheider alleen open zonder stroom.',
      'Order matters: otherwise customers drop out, or a switch breaks more than it can. A load-break switch may break load, a disconnector only opens with no current.'),
    B('Een werkvoorbereider schrijft het plan, een tweede bevoegde controleert het, het bedrijfsvoeringscentrum plant het in, en klanten krijgen vooraf bericht.',
      'A work preparer writes the plan, a second qualified person checks it, the control room schedules it, and customers are told in advance.'),
  ],
  [ // s4 rules 1 and 2
    B('Regel één, vrijschakelen: de schakelmonteur opent de schakelaar naar de kabel, hier en in netstation {n:9}.',
      'Rule one, disconnect: the switching technician opens the switch to the cable, here and in substation {n:9}.'),
    B('Aan alle kanten, want {t:Terugvoeding|terugvoeding} brengt spanning van de andere kant, uit een aggregaat, zonnepanelen of een andere ring.',
      'On all sides, because a {t:Back-feed|back-feed} brings power from the other side, from a generator, solar panels or another ring.'),
    B('Regel twee, beveiligen tegen herinschakelen: een hangslot en een label op elke schakelaar, zodat niemand hem weer inschakelt.',
      'Rule two, secure against reconnection: a padlock and a tag on every switch, so nobody switches it back on.'),
  ],
  [ // s5 rule 3
    B('Regel drie, spanningsloosheid vaststellen. Want uitgeschakeld is nog niet bewezen spanningsloos.',
      'Rule three, verify absence of voltage. Because switched off is not yet proven dead.'),
    B('Eerst test hij zijn spanningzoeker, vlak ervoor, op een bekende bron onder spanning.',
      'First he proves his voltage detector, just before, on a known live source.'),
    B('Dan meet hij in beide stations dat alle drie de aders spanningsloos zijn.',
      'Then he tests in both stations that all three cores are dead.'),
    B('Dat vangt een verkeerd veld, terugvoeding en geïnduceerde of achtergebleven spanning. Meet ook zelf als het centrum zegt dat hij uit is.',
      'That catches a wrong panel, a back-feed, and induced or leftover voltage. Even if the control room says it is off: test it yourself.'),
  ],
  [ // s6 rules 4 and 5
    B('Regel vier, aarden en kortsluiten: de aardingsschakelaars dicht, aan beide kanten. {t:Aarden|Aarden} verbindt de geleiders met aarde en met elkaar.',
      'Rule four, earth and short-circuit: he closes the earthing switches at both ends. {t:Earthing|Earthing} connects the conductors to earth and to each other.'),
    B('Komt er toch spanning op, dan spreekt de beveiliging aan, en wordt de ploeg niet geraakt.',
      'If voltage comes back, the protection trips, and the crew is not hurt.'),
    B('Maar pas na het meten: een deel aarden dat nog onder spanning staat, geeft kortsluiting en een vlamboog bij de monteur.',
      'But only after testing: earthing a part that is still live causes a short circuit and an arc at the technician.'),
    B('Regel vijf, naastgelegen delen onder spanning afschermen: een scherm voor de velden binnen handbereik die nog onder spanning staan.',
      'Rule five, protect against adjacent live parts: a screen before the panels within reach that are still live.'),
  ],
  [ // s7 release, the trench, the site
    B('Pas dan geeft de WV de kabel vrij voor de moffenploeg.',
      'Only then does the WV release the cable to the jointing crew.'),
    B('In de sleuf zoekt de ploeg de juiste kabel op, en toont vóór het doorzagen nog eens aan dat hij spanningsloos is, bijvoorbeeld door aanschieten op afstand.',
      'In the trench the crew finds the right cable, and before cutting proves it dead once more, for example with a remote spiking tool.'),
    B('Op locatie: borden met de naam van de IV, sloten en labels, aardgarnituren, isolerende matten en vlamboogwerende kleding.',
      'On site: signs with the IV’s name, locks and tags, earthing sets, insulating mats and arc-rated clothing.'),
    B('Typische fouten: een verlopen of ontbrekende aanwijzing, een stap uit het hoofd, een ongeteste zoeker, of een VOP die storingen zoekt waar een VP nodig is.',
      'Typical failures: an expired or missing appointment, a step from memory, an unchecked detector, or a VOP fault-finding where a VP is needed.'),
  ],
  [ // s8 reporting and switching slots
    B('Elke stap meldt de monteur aan het bedrijfsvoeringscentrum, zodat het beeld van het net klopt; niet melden is een klassiek bijna-ongeval. Terug gaat grofweg in omgekeerde volgorde.',
      'Every step is reported to the control room, so its picture stays right; not reporting is a classic near miss. Coming back goes roughly in reverse order.'),
    B('Zo vraagt elke klus twee {t:Schakelmoment|schakelmomenten}, uit en weer in. En die zijn schaars, want weinig monteurs mogen schakelen.',
      'So every job needs two {t:Switching slot|switching slots}, off and back on. And they are scarce, because few technicians may switch.'),
    B('Een voorbeeld: {n:6} schakelmonteurs, elk {n:2} klussen per dag, {n:4} dagen per week, want de vijfde is storingsdienst. In {n:12} weken zijn dat {n:576} momenten.',
      'An example: {n:6} switching technicians, {n:2} jobs a day each, {n:4} days a week, as the fifth is fault duty. In {n:12} weeks, that is {n:576} slots.'),
    B('Gepland staan {n:700} klussen, dus {n:1400} momenten: {n:2.4} keer de capaciteit. Dat lukt nooit, wat de ploegen ook doen.',
      'The plan holds {n:700} jobs, so {n:1400} slots: {n:2.4} times the capacity. That plan cannot happen, whatever the crews do.'),
    B('Plan dus ploegen op schakelmomenten, en bundel klussen: elk paar in één onderbreking scheelt {n:2} momenten. Kies openlijk wat naar het volgende kwartaal gaat, en vraag een planner wanneer het schakelplan is goedgekeurd.',
      'So plan crews to switching slots, and bundle jobs: each pair in one outage saves {n:2} slots. Decide openly what moves to next quarter, and ask a planner when the switching plan is approved.'),
  ],
  [ // s9 as a layperson
    B('Als consultant ben je leek. Vraag de dag ervoor wie de WV is, en bel hem: mag je meekijken, en wat heb je nodig?',
      'As a consultant you are a layperson. The day before, ask who the WV is and call him: may you watch, and what do you need?'),
    B('Je gaat alleen mee met een aangewezen persoon, en blijft buiten het afgezette gebied, in de helm en de vlamboogwerende kleding die je krijgt.',
      'You go in only with an appointed person, and stay outside the marked area, in the helmet and arc-rated clothing you are given.'),
    B('Je komt nergens aan, en zet nooit een afgeslagen automaat terug. Zo voorkom je elektrocutie en vlambogen, explosies van gloeiend hete lucht.',
      'You touch nothing, and never reset a tripped breaker. That is how you avoid electrocution and arc flash, an explosion of burning-hot air.'),
    B('Je noteert tijden en vraagt in de pauzes, niet tijdens het schakelen. Je waarde zit in je vragen: wie is hier de IV, en wie is aangewezen? En overal gelden de eigen procedures.',
      'You note times and ask in the breaks, not while they switch. Your value is in your questions: who is the IV here, and who is appointed? And every site’s own procedures apply.'),
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
  // the first scene's camera pulls back to the card side as the rules card opens (beat 3)
  const st0 = beatStarts(resolved.scenes[0], 'nl');
  CAM[0].a = Math.max(0, st0[2] / resolved.scenes[0].dur - 0.06);
  CAM[0].b = st0[2] / resolved.scenes[0].dur + 0.04;
}
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const C = { MIMIC, blades, FF, TECH, LAY, BAR, RULES, TECHS, PER_DAY, DAYS, WEEKS, JOBS, CAP, NEED, dur: DUR };
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
[data-cue][data-on] .mf-blade{stroke:var(--fp-accent)}
.mf-mark{fill:none;stroke:var(--fp-accent);stroke-width:2px;opacity:0}
[data-cue][data-on] .mf-mark{opacity:1}
.mf-tape{fill:none;stroke:var(--fp-accent);stroke-width:1.1px;stroke-dasharray:3 2.4;stroke-linecap:round}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1}
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
.mf-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono,[data-cue][data-on] .mf-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Netstation 8: een RMU met drie velden, elk met een lijntekening van het circuit en bedieningsgaten, een hangslot met een label, een isolerend scherm op twee voeten, een kabel naar een transformator, een monteur met helm en, achter een afzetlint, een consultant. Kaarten tonen de vijf veiligheidsregels, de normen en de rollen met de aanwijzing, een schakelplan, de twee stations met de kabel, de spanningzoeker, de werkplek en typische fouten, de meldingen en de schakelmomenten, en wat een leek doet.',
  en: 'Secondary substation 8: an RMU with three panels, each with a line drawing of its circuit and operating sockets, a padlock with a tag, an insulating screen on two feet, a cable to a transformer, a technician in a helmet and, behind a barrier tape, a consultant. Cards show the five safety rules, the standards and the roles with the written appointment, a switching plan, the two stations with the cable, the voltage detector, the site and typical failures, the reports and the switching slots, and what a layperson does.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

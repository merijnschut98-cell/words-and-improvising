// Dev tool, not shipped. Builds the explainer film "Hoe een transformator werkt /
// How a transformer works" for the topic De transformator of Transformatoren en
// kabels: its level 1 lesson eng.transformers.principle.
//
//   node films/eng.transformers.principle/build.mjs            build the page
//   node films/eng.transformers.principle/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.transformers.principle.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.transformers.principle). The plan row lists the lesson "principle"; the
// id still exists after the topics x levels rebuild (eng.transformers.principle,
// level 1 of the topic transformer), so no mapping was needed. It had no film
// before (it keeps its figure eng.transformers.load). Storyboard drift: the
// plan's six scenes become nine, because the film carries the whole lesson:
// kVA and the currents get their own scene, the nameplate (Dyn5) its own, and
// the worked example (the solar street) its own. The plan's numbers "about 0,5
// kW no-load and 5 kW full-load" are now the lesson's 0,54 and 4,6 kW.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of the lesson's teach text and worked example. Checklist (scene):
//   teach 1: one AC voltage into another (s1); two coils of wire, the windings,
//     copper or aluminium, round an iron core (s2); AC in the first winding
//     makes a changing magnetic field in the core, which induces a voltage in
//     the second (s2); the turns ratio, turns of one winding over the other,
//     sets the voltage ratio (s3); power stays almost the same, so on 10 kV/400 V
//     voltage 25 x down, current 25 x up (s3)
//   teach 2: rating in kVA, voltage x current (s4); a netstation, the small
//     station that steps the MV grid (10 kV) down to 400 V LV for a few streets,
//     mostly 250, 400 or 630 kVA (s4); a substation transformer 150 kV to 10 or
//     20 kV mostly tens of MVA (s4); three-phase current = power / (1,73 x
//     voltage): 400 kVA at 400 V about 577 A, at 10 kV about 23 A (s4)
//   teach 3: losses small but never stop (s5); no-load losses in the iron core
//     as soon as it is energised, day and night, also when nobody uses power
//     (s5); load losses in the windings, with the load squared: half load a
//     quarter (s5); a new 630 kVA may lose at most 0,54 kW at no load and 4,6
//     kW at full load, an efficiency of about 99% (s5); across thousands of
//     stations it adds up, so European ecodesign rules cap the losses (s5)
//   teach 4: mineral oil insulates and carries heat away (s6); ONAN, oil
//     natural, air natural: warm oil rises, cools in the fins and sinks, no
//     pumps or fans (s6); a 100 Hz hum, twice the grid frequency (s6); Dyn5 on
//     the nameplate: 10 kV coils in delta (each between two phases), 400 V coils
//     in star (each from a phase to a shared neutral, so 230 V); the turns ratio
//     per coil 10.000 / 230 about 43, not 25 (s7)
//   teach 5: a tap changer switches between taps, extra connection points on
//     the winding, to change the ratio in steps of usually 2,5%, often over five
//     positions; on a netstation transformer only when switched off (s8);
//     substation transformers have an on-load tap changer that regulates the MV
//     voltage automatically, under load (s8); typical failures: a tap in the
//     wrong position for years, overheating from overload, moisture in the oil
//     (s8); the sharp question: which position, and when was that last checked?
//     (s9, after the example that shows why it matters)
//   example: a 400 kVA netstation in a street full of solar panels; on sunny
//     days the end of the LV cables reaches 252 V, close to the limit of 253 V
//     (230 V + 10%), and inverters (the boxes that turn the panels' DC into AC)
//     drop out; the tap changer is in the middle position (s9); one step lower,
//     2,5%: the LV voltage drops about 6 V (2,5% of 230 V), to around 246 V at
//     the end of the cables (s9); the transformer must be switched off for a few
//     minutes, so all customers on the station get a planned short outage and a
//     letter beforehand (s9)
//
// The drawing is a netstation floor with the transformer of the grid films (the
// tank on skids with corrugated fins on its front and side, the bolted lid, the
// MV bushings at the back, the LV bushings at the front, the tap changer knob
// and the oil filling plug after eng.switchgear.devices and the figure
// eng.transformers.load) and, beside it, its active part lifted out of the tank
// onto two skids: a three-leg core (the lower and upper yokes with their
// mitred joints and clamp beams, lifting lugs), on each leg the LV winding
// inside and the MV winding round it with its turns, spacer blocks under the
// upper yoke, the LV copper bars rising to their terminals, the taps on the
// middle MV winding and the off-circuit tap changer on the upper yoke. The
// magnetic field runs through the core as a petrol dashed loop. Cards in stage
// space carry the chain from current to voltage, the turns ratio, kVA and the
// two currents, the losses against the load, the ONAN oil loop and the hum,
// the nameplate with delta and star, the tap changer's positions, and the
// solar street; illustrative cards say "schema" or "voorbeeld".
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
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the lesson's text and worked example (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Facts checked against (2026-11-12):
// - The ideal transformer: U1 / U2 = N1 / N2 and I1 / I2 = N2 / N1, the same
//   volts per turn on both windings; power in about equals power out (IEC
//   60076-1; any electrical engineering text). Said as "bijna".
// - No-load (iron) losses: hysteresis and eddy currents in the core, set by the
//   voltage, there whenever energised; load (copper) losses I²R in the
//   windings, so with the load squared (IEC 60076-1 definitions).
// - EU ecodesign (Regulation 548/2014, amended by 2019/1783), Tier 2 for a
//   630 kVA liquid-immersed distribution transformer: no-load loss at most
//   540 W, load loss at most 4.600 W; at full load and cos φ 1 an efficiency
//   of (630 − 5,14) / 630 ≈ 99,2%: "zo'n 99%".
// - ONAN = oil natural, air natural (IEC 60076-2): natural convection of the
//   oil through the windings and the radiators or corrugated fins.
// - The hum at 100 Hz: magnetostriction of the core steel, twice per cycle
//   of the 50 Hz grid.
// - Dyn5 (IEC 60076-1 clock notation): HV delta, LV star with the neutral
//   brought out, 150° phase shift; a delta coil sees the line voltage, a star
//   coil the phase voltage 400 / 1,73 = 230 V.
// - Off-circuit tap changers on distribution transformers: usually five
//   positions, ± 2 × 2,5%, mostly on the MV winding (where the current is
//   small), operated de-energised; on-load tap changers with an automatic
//   voltage regulator on the HV/MV substation transformers.
// - The LV limit 230 V + 10% = 253 V (NEN-EN 50160) and inverters tripping on
//   overvoltage, as in eng.gridbasics.load.
// - Terms as in the grid films: netstation (English here "secondary
//   substation", the term of this lesson and of eng.switchgear.devices),
//   onderstation, kVA, belasting, middenspanning and laagspanning; and as in
//   the motor film: draaiveld, rendement.
const PR = 'eng.transformers.principle';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const l = lessons.nl.get(PR);
  const t = l.teach.join('\n');
  assert(t.includes('twee spoelen van draad, de wikkelingen (windings), van koper of aluminium, om een ijzeren kern'), 'windings and core');
  assert(t.includes('maakt een wisselend magnetisch veld in de kern, dat een spanning opwekt in de tweede wikkeling'), 'induction');
  assert(t.includes('bepaalt de spanningsverhouding') && t.includes('25 keer omlaag en de stroom 25 keer omhoog'), 'ratio');
  assert(t.includes('spanning maal stroom') && t.includes('250, 400 of 630 kVA') && t.includes('tientallen MVA'), 'kVA');
  assert(t.includes('stroom = vermogen / (1,73 × spanning)') && t.includes('zo’n 577 A; op 10 kV zo’n 23 A'), 'currents');
  assert(t.includes('dag en nacht, ook als niemand stroom gebruikt') && t.includes('bij halve last een kwart'), 'losses');
  assert(t.includes('0,54 kW verliezen bij nullast en 4,6 kW bij vollast') && t.includes('zo’n 99%') && t.includes('ecodesign'), 'loss numbers');
  assert(t.includes('minerale olie, die isoleert en warmte afvoert') && t.includes('zonder pompen of ventilatoren'), 'oil');
  assert(t.includes('brom van 100 Hz, twee keer de netfrequentie'), 'hum');
  assert(t.includes('Dyn5') && t.includes('10.000 / 230 ≈ 43, niet 25'), 'Dyn5');
  assert(t.includes('stappen van meestal 2,5%, vaak over vijf standen') && t.includes('alleen spanningsloos'), 'tap changer');
  assert(t.includes('onder belasting') && t.includes('vocht in de olie') && t.includes('wanneer is dat voor het laatst gecontroleerd'), 'OLTC and faults');
  const x = l.example.text;
  assert(x.includes('400 kVA') && x.includes('252 V') && x.includes('253 V (230 V + 10%)') && x.includes('middenstand'), 'example start');
  assert(x.includes('één stap, 2,5%, lager') && x.includes('zo’n 6 V (2,5% van 230 V)') && x.includes('246 V'), 'example step');
  assert(x.includes('een paar minuten spanningsloos') && x.includes('vooraf een brief'), 'example outage');
}
// teach 1: 10 kV / 400 V = 25
const U_MV = 10000;
const U_LV = 400;
const RATIO = U_MV / U_LV;
assert(RATIO === 25, '10.000 / 400 = 25');
// teach 2: I = S / (1,73 × U): 400 kVA → 577 A at 400 V, 23 A at 10 kV
const S = 400e3;
const I_LV = S / (1.73 * U_LV);
const I_MV = S / (1.73 * U_MV);
assert(Math.round(I_LV) === 578 || Math.round(I_LV) === 577, '≈ 577 A');
assert(near(S / (Math.sqrt(3) * U_LV), 577, 0.5), '400 kVA at 400 V = 577 A');
assert(Math.round(I_MV) === 23, '≈ 23 A');
// teach 3: 630 kVA, 0,54 kW and 4,6 kW: about 99%; half load a quarter
const P0 = 0.54;
const PK = 4.6;
const EFF = (630 - P0 - PK) / 630;
assert(EFF > 0.99 && EFF < 0.995, 'about 99%');
assert(near(0.5 ** 2, 0.25, 1e-12), 'half load, a quarter');
// teach 4: Dyn5: 400 / 1,73 = 230 V; 10.000 / 230 ≈ 43
assert(Math.round(U_LV / Math.sqrt(3)) === 231 && Math.round(U_LV / 1.73) === 231, '400 / √3 ≈ 230 V');
assert(Math.round(U_MV / 230) === 43, '10.000 / 230 ≈ 43');
// example: 252 V; one step of 2,5% ≈ 6 V (2,5% of 230); about 246 V; limit 230 + 10% = 253 V
const STEP = 0.025;
assert(near(230 * STEP, 5.75, 1e-9) && Math.round(230 * STEP) === 6, '2,5% of 230 ≈ 6 V');
assert(252 - 6 === 246 && Math.round(252 * (1 - STEP)) === 246, '252 → about 246 V');
assert(near(230 * 1.1, 253, 1e-9), '230 + 10% = 253 V');

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the station floor (the active part
// at −x, the tank at +x), +y toward the viewer. The top of the floor is z = 0.
const W = 640;
const H = 400;
const FLOOR = -6;
const SLAB = { x: -198, y: -46, w: 344, d: 96, r: 2 };
// the active part: a three-leg core with two windings on each leg
const LEGS = [-150, -118, -86];
const YOKE = { x: -168, y: -8, w: 100, d: 16, r: 0.6 };
const YZ = { lo: [6, 20], hi: [82, 96] };
const HV_R = 14;
const HV_Z = [20, 77];
const LV_R = 10.5;
const LV_Z = [77, 80];
// the tank
const TR = { x: -6, y: -24, w: 96, d: 44, r: 1 };
const TR_Z = [6, 84];
const TRY = TR.y + TR.d;
const PLATE = { x: 34, z: [40, 56], w: 16 };

const FIT = [
  ...k.boxCorners(SLAB, FLOOR, 0),
  ...k.boxCorners({ x: YOKE.x, y: -16, w: YOKE.w, d: 32 }, 0, 108),
  ...k.boxCorners({ x: TR.x, y: TR.y, w: TR.w + 8, d: TR.d + 8 }, 0, 112),
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 64, elevation: 24 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameZ = (o) => G.frameOf(o, Zv, Y, X);

// ---------------------------------------------------------------- recorder
// Each part carries the cues of its assembly (outermost first), so a term can
// light the core, the windings (both, or the MV or LV one), the tap changer,
// the tank, its fins, bushings or nameplate.
const cuesOf = (name) => {
  if (/^core\./.test(name)) return ['core'];
  if (/^hv\./.test(name)) return ['coils', 'hv'];
  if (/^lv\./.test(name)) return ['coils', 'lv'];
  if (/^tap\./.test(name)) return ['tap'];
  if (/^tank\.fin/.test(name)) return ['tank', 'fins'];
  if (/^tank\.hvb/.test(name)) return ['tank', 'hvb'];
  if (/^tank\.lvb/.test(name)) return ['tank', 'lvb'];
  if (/^tank\.plate/.test(name)) return ['tank', 'plate'];
  if (/^tank\.tap/.test(name)) return ['tank', 'tap'];
  if (/^tank\./.test(name)) return ['tank'];
  return [];
};
const R = A.recorder(P, {});
function put(name, ref, svg, shapes, { bias = 0, attrs = '' } = {}) {
  const c = cuesOf(name);
  const body = c.slice(1).reduceRight((s, cue) => `<g data-cue="${cue}">${s}</g>`, svg);
  return R.put({ name, at: ref, bias, svg: body, shapes, attrs: (c.length ? ` data-cue="${c[0]}"` : '') + attrs });
}
const Sv = (paths, style) => k.solidSvg(paths, style);
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = Sv(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = Sv(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = Sv(G.solidOf(profile, F, P), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}

// ---------------------------------------------------------------- the station floor
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(SLAB, -2), FLOOR, 2, P)}"/>`];
{
  const anchors = k.corners(SLAB, 5);
  const extra = L(k.planOutline(k.insetPlan(SLAB, 3), 0, P, 3), { tone: 'faint' })
    + L(anchors.map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 })
    // the rim of the oil catch pit under the tank
    + L(k.planOutline({ x: TR.x - 6, y: TR.y - 6, w: TR.w + 20, d: TR.d + 18, r: 0.6 }, 0, P, 2), { tone: 'lo' })
    // a floor seam between the two halves of the room
    + L(k.segment([-52, SLAB.y + 3, 0], [-52, SLAB.y + SLAB.d - 3, 0], P), { tone: 'faint' });
  box('floor.slab', SLAB, FLOOR, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, ground: true, inner: L(k.sideSeam(SLAB, -2.5, P, 3), { tone: 'faint' }), extra });
}

// ---------------------------------------------------------------- the active part: skids, core, windings
for (const y of [-12, 6]) {
  box('core.skid', { x: YOKE.x - 4, y, w: YOKE.w + 8, d: 6, r: 0.3 }, 0, YZ.lo[0], { tone: 'lo' }, {
    steps: 1, bevel: 0.3, extra: Dt([at([YOKE.x - 1.5, y + 3, YZ.lo[0]]), at([YOKE.x + YOKE.w + 1.5, y + 3, YZ.lo[0]])], { size: 0.45 }),
  });
}
// a yoke's front face: the stacked sheets meet in mitred joints at each leg
function mitres(z0, z1, top) {
  const fy = YOKE.y + YOKE.d;
  const h = z1 - z0;
  const lines = [];
  // the outer corners: one diagonal each; the middle leg: a V (the T joint)
  const zIn = top ? z0 : z1;
  const zOut = top ? z1 : z0;
  lines.push(k.segment([YOKE.x + 1, fy, zOut], [YOKE.x + 1 + h * 0.9, fy, zIn], P));
  lines.push(k.segment([YOKE.x + YOKE.w - 1, fy, zOut], [YOKE.x + YOKE.w - 1 - h * 0.9, fy, zIn], P));
  lines.push(k.segment([LEGS[1] - 6, fy, zIn], [LEGS[1], fy, zOut], P) + k.segment([LEGS[1], fy, zOut], [LEGS[1] + 6, fy, zIn], P));
  // the sheet step-lap: faint lines along the yoke
  for (const f of [0.33, 0.66]) lines.push(k.segment([YOKE.x + 1 + h * 0.9 * (top ? 1 - f : f), fy, z0 + h * f], [YOKE.x + YOKE.w - 1 - h * 0.9 * (top ? 1 - f : f), fy, z0 + h * f], P));
  return L(lines.slice(0, 3).join(''), { tone: 'lo' }) + L(lines.slice(3).join(''), { tone: 'faint' });
}
box('core.yoke', YOKE, YZ.lo[0], YZ.lo[1], { tone: 'mid' }, { steps: 2, bevel: 0.3, inner: mitres(YZ.lo[0], YZ.lo[1], false) });
// the clamp beam behind the lower yoke, bolted through
box('core.clamp', { x: YOKE.x + 2, y: YOKE.y - 3, w: YOKE.w - 4, d: 3, r: 0.2 }, YZ.lo[0] + 1, YZ.lo[1] - 1, { tone: 'lo' }, { steps: 1 });

// the windings: on each leg the MV winding (outer, many turns) with the LV
// winding (inner) standing out above it
for (const [i, x] of LEGS.entries()) {
  const turns = [];
  for (let z = HV_Z[0] + 3; z < HV_Z[1] - 1; z += 2.6) turns.push(k.sideArc(x, 0, HV_R, z, P, 20));
  const bands = [HV_Z[0] + 2, HV_Z[1] - 2].map((z) => k.sideArc(x, 0, HV_R, z, P, 24)).join('');
  // the taps of the middle MV winding: five studs down its front, half way up
  let taps = '';
  if (i === 1) {
    const [vx, vy] = k.towardViewer(P);
    const a = Math.atan2(vy, vx);
    const pts = [0, 1, 2, 3, 4].map((j) => [x + HV_R * Math.cos(a), HV_R * Math.sin(a), 41 + j * 3.2]);
    taps = `<g data-cue="tap">${Dt(pts.map(at), { size: 0.9, tone: 'hi' })}</g>`;
  }
  post(`hv.coil${i}`, x, 0, HV_R, HV_Z[0], HV_Z[1], { tone: 'hi' }, {
    steps: 40, inner: L(turns.join(''), { tone: 'faint' }) + L(bands, { tone: 'lo' }), extra: taps,
  });
  post(`lv.coil${i}`, x, 0, LV_R, LV_Z[0], LV_Z[1], { tone: 'mid' }, { steps: 36, inner: L(k.sideArc(x, 0, LV_R, LV_Z[0] + 1.5, P, 20), { tone: 'faint' }) });
  // spacer blocks of pressboard between the LV winding and the upper yoke
  for (const dx of [-5, 3]) box('core.spacer', { x: x + dx, y: -4, w: 2, d: 8, r: 0.2 }, LV_Z[1], YZ.hi[0], { tone: 'lo' }, { steps: 1 });
}
// the upper yoke, its clamp beam and lifting lugs
box('core.yoke', YOKE, YZ.hi[0], YZ.hi[1], { tone: 'mid' }, { steps: 2, bevel: 0.3, inner: mitres(YZ.hi[0], YZ.hi[1], true) });
box('core.clamp', { x: YOKE.x + 2, y: YOKE.y - 3, w: YOKE.w - 4, d: 3, r: 0.2 }, YZ.hi[0] + 1, YZ.hi[1] - 1, { tone: 'lo' }, {
  steps: 1, extra: Dt([-158, -134, -102, -78].map((x) => at([x, YOKE.y - 3, YZ.hi[1] - 3])), { size: 0.45 }),
});
for (const x of [YOKE.x + 6, YOKE.x + YOKE.w - 10]) {
  box('core.lug', { x, y: YOKE.y - 3, w: 4, d: 3, r: 0.2 }, YZ.hi[1] - 1, YZ.hi[1] + 7, { tone: 'lo' }, {
    steps: 1, extra: L(k.ring(x + 2, YOKE.y - 1.5, 1, YZ.hi[1] + 7, P, 10), { tone: 'lo' }),
  });
}
// the LV copper bars from each LV winding up past the yoke to their terminals
for (const [i, x] of LEGS.entries()) {
  box(`lv.bar${i}`, { x: x - 2, y: 8.4, w: 4, d: 1.6, r: 0.1 }, LV_Z[1], 106, { tone: 'hi' }, {
    steps: 1, extra: Dt([at([x, 10, 103])], { size: 0.5, tone: 'lo' }),
  });
}
// the off-circuit tap changer on the upper yoke: a drum with its position ring and knob
post('tap.drum', LEGS[1], 0, 4.6, YZ.hi[1], YZ.hi[1] + 6, { tone: 'mid' }, {
  steps: 24, extra: L(k.ring(LEGS[1], 0, 3.6, YZ.hi[1] + 6, P, 20), { tone: 'faint' })
    + Dt([0, 1, 2, 3, 4].map((j) => { const a = Math.PI * (0.7 + j * 0.15); return at([LEGS[1] + 3.6 * Math.cos(a), 3.6 * Math.sin(a), YZ.hi[1] + 6]); }), { size: 0.35, tone: 'hi' }),
});
post('tap.knob', LEGS[1], 0, 1.6, YZ.hi[1] + 6, YZ.hi[1] + 10, { tone: 'hi' }, {
  steps: 14, extra: L(k.segment([LEGS[1], 0, YZ.hi[1] + 10], [LEGS[1] - 1.6, 1.2, YZ.hi[1] + 10], P), { tone: 'lo' }),
});

// ---------------------------------------------------------------- the tank
for (const y of [TR.y - 2, TR.y + TR.d - 3]) {
  box('tank.skid', { x: TR.x - 2, y, w: TR.w + 4, d: 5, r: 0.4 }, 0, TR_Z[0], { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt([at([TR.x + 2, y + 2.5, TR_Z[0]]), at([TR.x + TR.w - 2, y + 2.5, TR_Z[0]])], { size: 0.45 }) });
}
box('tank.body', TR, TR_Z[0], TR_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(TR, TR_Z[1] - 3, P, 2) + k.sideSeam(TR, TR_Z[0] + 4, P, 2), { tone: 'faint' }) });
{
  const lid = { x: TR.x - 1, y: TR.y - 1, w: TR.w + 2, d: TR.d + 2, r: 1 };
  const bolts = [];
  for (let j = 0; j < 8; j++) bolts.push([lid.x + 3 + (j * (lid.w - 6)) / 7, lid.y + lid.d - 1.4]);
  for (let j = 1; j < 5; j++) bolts.push([lid.x + lid.w - 1.4, lid.y + 3 + (j * (lid.d - 6)) / 5]);
  box('tank.lid', lid, TR_Z[1], TR_Z[1] + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, TR_Z[1] + 3])), { size: 0.4 }) });
}
// corrugated cooling fins on the front, left and right of the nameplate, and on the +x side
for (let j = 0; j < 12; j++) {
  const x = TR.x + 4 + j * 7.4;
  if (x > PLATE.x - 4 && x < PLATE.x + PLATE.w + 2) continue;
  box('tank.fin', { x, y: TRY, w: 1.4, d: 8, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
}
for (let j = 0; j < 6; j++) box('tank.fin', { x: TR.x + TR.w, y: TR.y + 3 + j * 7, w: 8, d: 1.4, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
// the nameplate between the fins: four engraved lines and four rivets
box('tank.plate', { x: PLATE.x, y: TRY, w: PLATE.w, d: 0.5, r: 0.2 }, PLATE.z[0], PLATE.z[1], { tone: 'hi' }, {
  steps: 1,
  extra: L([53, 49.5, 46, 42.5].map((z, j) => k.segment([PLATE.x + 2, TRY + 0.5, z], [PLATE.x + PLATE.w - [3, 6, 4, 8][j], TRY + 0.5, z], P)).join(''), { tone: 'lo', free: true })
    + Dt([[PLATE.x + 1, PLATE.z[1] - 1], [PLATE.x + PLATE.w - 1, PLATE.z[1] - 1], [PLATE.x + 1, PLATE.z[0] + 1], [PLATE.x + PLATE.w - 1, PLATE.z[0] + 1]].map(([x, z]) => at([x, TRY + 0.5, z])), { size: 0.35 }),
});
// the earth stud low on the front
box('tank.earth', { x: TR.x + 2, y: TRY, w: 3, d: 1.2, r: 0.3 }, 10, 13, { tone: 'lo' }, { steps: 1 });
// three MV bushings at the back of the lid: porcelain with four sheds
const LID = TR_Z[1] + 3;
for (const x of [14, 42, 70]) {
  turned('tank.hvb', frameZ([x, -12, LID]), [[0, 2.6], [2.5, 2.6], [2.5, 4.2], [3.4, 4.2], [3.4, 2.4], [6.4, 2.4], [6.4, 4], [7.3, 4], [7.3, 2.3], [10.3, 2.3], [10.3, 3.8], [11.2, 3.8], [11.2, 2.2], [14.2, 2.2], [14.2, 3.6], [15.1, 3.6], [15.1, 2], [18, 2]], { tone: 'hi' });
  post('tank.hvb', x, -12, 0.9, LID + 18, LID + 21, { tone: 'mid', crease: 'none' }, { steps: 12, extra: Dt([at([x, -12, LID + 21])], { size: 0.35, tone: 'hi' }) });
}
// four LV bushings at the front: three phases and the neutral
for (const [j, x] of [16, 30, 44, 58].entries()) {
  turned('tank.lvb', frameZ([x, 9, LID]), [[0, 2.4], [2.2, 2.4], [2.2, 3.2], [3, 3.2], [3, 2.4], [4.6, 2.4], [4.6, 3.2], [5.4, 3.2], [5.4, 2.4], [7, 2.4]], { tone: 'hi' });
  post('tank.lvb', x, 9, 1.2, LID + 7, LID + 10, { tone: 'mid', crease: 'none' }, { steps: 12, extra: Dt([at([x, 9, LID + 10])], { size: 0.4, tone: 'hi' }) });
  if (j === 3) box('tank.n', { x: x + 3.2, y: 7.6, w: 2.4, d: 2.4, r: 0.3 }, LID, LID + 0.6, { tone: 'lo' }, { steps: 1 });
}
// the tap changer knob, the oil filling plug and the thermometer pocket on the lid
post('tank.tap', 80, 4, 3.4, LID, LID + 2, { tone: 'mid' }, {
  steps: 24, extra: Dt([0, 1, 2, 3, 4].map((j) => { const a = Math.PI * (0.6 + j * 0.2); return at([80 + 2.6 * Math.cos(a), 4 + 2.6 * Math.sin(a), LID + 2]); }), { size: 0.3, tone: 'hi' }),
});
post('tank.tapk', 80, 4, 1.2, LID + 2, LID + 4.6, { tone: 'hi' }, { steps: 12, extra: L(k.segment([80, 4, LID + 4.6], [81.6, 5, LID + 4.6], P), { tone: 'lo' }) });
post('tank.plug', 82, -14, 2.2, LID, LID + 2, { tone: 'mid' }, { steps: 6, extra: Dt([at([82, -14, LID + 2])], { size: 0.4, tone: 'hi' }) });
post('tank.pocket', 4, -4, 1.6, LID, LID + 3.4, { tone: 'lo' }, { steps: 12 });
for (const x of [TR.x + 3, TR.x + TR.w - 7]) {
  box('tank.lug', { x, y: TR.y - 1, w: 4, d: 3, r: 0.2 }, LID, LID + 5, { tone: 'lo' }, { steps: 1, extra: L(k.ring(x + 2, TR.y + 0.5, 0.9, LID + 5, P, 10), { tone: 'lo' }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
// the magnetic field: two loops through the core's middle plane, one round each window
const ZB = (YZ.lo[0] + YZ.lo[1]) / 2;
const ZT = (YZ.hi[0] + YZ.hi[1]) / 2;
const loop = (x0, x1) => k.pathOf([[x0, 0, ZB], [x0, 0, ZT], [x1, 0, ZT], [x1, 0, ZB]].map(at), true);
const f1s = (v) => (Math.round(v * 10) / 10).toString();
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  `<g data-cue="flux"><path class="tf-flux" data-k="fluxA" d="${loop(LEGS[0], LEGS[1])}"/><path class="tf-flux" data-k="fluxB" d="${loop(LEGS[1], LEGS[2])}"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('io', g('ioIn', '')),
  g('chain', g('chBase', '') + g('chIn', '')),
  g('ratio', g('raBase', '') + g('raCoils', '') + cue('ratio', g('raEq', '')) + g('raTxt', '')),
  g('kva', g('kvBase', '') + g('kvSizes', '') + g('kvCur', '')),
  g('loss', g('lsBase', '') + cue('core', g('lsP0', '')) + cue('coils', g('lsPk', '')) + g('lsTxt', '')),
  g('onan', g('onBase', '') + cue('fins', g('onFlow', '')) + g('onHum', '')),
  g('plate', g('plBase', '') + g('plRows', '') + g('plDy', '')),
  g('tapc', g('tcBase', '') + cue('tap', g('tcSel', '')) + cue('oltc', g('tcOltc', '')) + g('tcFaults', '')),
  g('ex', g('exBase', '') + g('exLines', '') + g('exTxt', '')),
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
// A camera frames a set of world points into a stage rectangle [x0, x1, y0, y1]:
// [cx, cy, w], the world point at the stage centre and the view's width.
function frame(points, [x0, x1, y0, y1]) {
  const pp = points.map(at);
  const xs = pp.map((p) => p[0]);
  const ys = pp.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs)];
  const by = [Math.min(...ys), Math.max(...ys)];
  const s = Math.min((x1 - x0) / (bx[1] - bx[0]), (y1 - y0) / (by[1] - by[0]));
  const cx = (bx[0] + bx[1]) / 2 - ((x0 + x1) / 2 - W / 2) / s;
  const cy = (by[0] + by[1]) / 2 - ((y0 + y1) / 2 - H / 2) / s;
  return [Math.round(cx * 10) / 10, Math.round(cy * 10) / 10, Math.round((W / s) * 10) / 10];
}
const ALL = FIT;
const CORE = k.boxCorners({ x: YOKE.x - 4, y: -15, w: YOKE.w + 8, d: 30 }, 0, 108);
const TANK = k.boxCorners({ x: TR.x - 2, y: TR.y - 2, w: TR.w + 10, d: TR.d + 10 }, 0, LID + 21);
const LEFT = [12, 200, 30, 380];
const zoomed = (pts, rect, by) => { const c = frame(pts, rect); return [c[0], c[1], Math.round(c[2] * by * 10) / 10]; };
const CAM = [
  { from: frame(ALL, [20, 620, 20, 384]), to: frame(TANK, [150, 560, 40, 370]), a: 0.62, b: 0.95 },
  { from: frame(CORE, [20, 410, 24, 384]), to: zoomed(CORE, [20, 410, 24, 384], 0.94) },
  { from: frame(CORE, LEFT), to: zoomed(CORE, LEFT, 0.95) },
  { from: frame(TANK, LEFT), to: zoomed(TANK, LEFT, 0.95) },
  { from: frame(CORE, LEFT), to: zoomed(CORE, LEFT, 0.95) },
  { from: frame(TANK, LEFT), to: zoomed(TANK, LEFT, 0.95) },
  { from: frame(TANK, LEFT), to: zoomed(TANK, LEFT, 0.95) },
  { from: frame(TANK, LEFT), to: zoomed(TANK, LEFT, 0.95) },
  { from: frame(TANK, LEFT), to: zoomed(TANK, LEFT, 0.95) },
];

// ---------------------------------------------------------------- the film
const DUR = [28, 36, 30, 34, 36, 34, 28, 38, 36];
const C = { RATIO, I_LV: S / (Math.sqrt(3) * U_LV), I_MV: S / (Math.sqrt(3) * U_MV), P0, PK, EFF, dur: DUR };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.transformers.principle',
  title: { nl: 'Hoe een transformator werkt', en: 'How a transformer works' },
  lessons: [PR],
  scenes: [
    {
      id: 's1', lesson: PR, level: 1, dur: DUR[0], still: 0.5, title: { nl: 'In het netstation', en: 'In the secondary substation' },
      beats: [
        B('De transformator van een netstation: hij zet {n:10} kV om naar {n:400} V.', 'The transformer of a secondary substation: it steps {n:10} kV down to {n:400} V.', { cues: ['tank'] }),
        B('Achter komt middenspanning binnen; voor gaat laagspanning naar een paar straten.', 'MV comes in at the back; LV leaves at the front for a few streets.', { cues: ['hvb', 'lvb'] }),
        B('Hij zet de ene wisselspanning om in een andere. Er draait niets.', 'It changes one AC voltage into another. Nothing turns.', { cues: ['tank'] }),
      ],
    },
    {
      id: 's2', lesson: PR, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Kern en wikkelingen', en: 'Core and windings' },
      beats: [
        B('Binnenin: een ijzeren kern, met om elk been twee wikkelingen van koper of aluminium.', 'Inside: an iron core, and round each leg two windings of copper or aluminium.', { cues: ['core', 'coils'] }),
        B('Wisselstroom in de eerste wikkeling maakt een wisselend magnetisch veld in de kern.', 'AC in the first winding makes a changing magnetic field in the core.', { cues: ['hv', 'flux'] }),
        B('Dat veld wekt een spanning op in de tweede wikkeling.', 'That field induces a voltage in the second winding.', { cues: ['lv', 'flux'] }),
      ],
    },
    {
      id: 's3', lesson: PR, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'De wikkelverhouding', en: 'The turns ratio' },
      beats: [
        B('De {t:Wikkelverhouding|wikkelverhouding}: de windingen van de ene wikkeling gedeeld door die van de andere.', 'The {t:Turns ratio|turns ratio}: the turns on one winding divided by those on the other.', { cue: { Wikkelverhouding: 'ratio' }, cues: ['coils'] }),
        B('Die bepaalt de spanningsverhouding: {n:10} kV naar {n:400} V is {n:25} keer omlaag.', 'It sets the voltage ratio: {n:10} kV to {n:400} V is {n:25} times down.', { cues: ['ratio'] }),
        B('Het vermogen blijft bijna gelijk, dus de stroom gaat {n:25} keer omhoog.', 'Power stays almost the same, so the current goes {n:25} times up.', { cues: ['lv'] }),
      ],
    },
    {
      id: 's4', lesson: PR, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'kVA en stroom', en: 'kVA and current' },
      beats: [
        B('Het vermogen staat in kVA, kilovoltampère: spanning maal stroom.', 'The rating is in kVA, kilovolt-ampere: voltage times current.', { cues: ['plate'] }),
        B('Een netstation: meestal {n:250}, {n:400} of {n:630} kVA. Een onderstation: tientallen MVA.', 'A secondary substation: mostly {n:250}, {n:400} or {n:630} kVA. A substation: tens of MVA.', { cues: [] }),
        B('Driefasig: stroom = vermogen / ({n:1.73} × spanning).', 'Three-phase: current = power / ({n:1.73} × voltage).', { cues: [] }),
        B('{n:400} kVA is zo’n {n:577} A op {n:400} V, maar zo’n {n:23} A op {n:10} kV.', '{n:400} kVA is about {n:577} A at {n:400} V, but about {n:23} A at {n:10} kV.', { cues: ['lvb', 'hvb'] }),
      ],
    },
    {
      id: 's5', lesson: PR, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Verliezen', en: 'Losses' },
      beats: [
        B('{t:Nullastverliezen}: in de kern, zodra hij onder spanning staat. Dag en nacht.', '{t:No-load losses}: in the core, as soon as it is energised. Day and night.', { cue: { Nullastverliezen: 'core' } }),
        B('{t:Belastingverliezen}: in de wikkelingen, met het kwadraat van de belasting.', '{t:Load losses}: in the windings, with the load squared.', { cue: { Belastingverliezen: 'coils' } }),
        B('Bij halve last een kwart. {n:630} kVA: hoogstens {n:0.54} kW nullast, {n:4.6} kW vollast.', 'At half load a quarter. {n:630} kVA: at most {n:0.54} kW no-load, {n:4.6} kW full load.', { cues: ['coils'] }),
        B('Een rendement van zo’n {n:99}%. Europese ecodesign-regels begrenzen de verliezen.', 'About {n:99}% efficient. EU ecodesign rules cap the losses.', { cues: [] }),
      ],
    },
    {
      id: 's6', lesson: PR, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'Olie en koeling', en: 'Oil and cooling' },
      beats: [
        B('Minerale olie in de tank isoleert en voert de warmte af.', 'Mineral oil in the tank insulates and carries the heat away.', { cues: ['tank'] }),
        B('{t:ONAN}: warme olie stijgt op, koelt af in de koelribben (fins) en zakt weer.', '{t:ONAN}: warm oil rises, cools in the fins and sinks again.', { cue: { ONAN: 'fins' } }),
        B('Oil natural, air natural: geen pompen, geen ventilatoren.', 'Oil natural, air natural: no pumps, no fans.', { cues: ['fins'] }),
        B('Ter plaatse hoor je een brom van {n:100} Hz: twee keer de netfrequentie.', 'On site you hear a {n:100} Hz hum: twice the grid frequency.', { cues: ['tank'] }),
      ],
    },
    {
      id: 's7', lesson: PR, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'Het typeplaatje', en: 'The nameplate' },
      beats: [
        B('Op het typeplaatje: {n:400} kVA, {n:10} kV naar {n:400} V, ONAN en de code Dyn5.', 'On the nameplate: {n:400} kVA, {n:10} kV to {n:400} V, ONAN and the code Dyn5.', { cues: ['plate'] }),
        B('D: de {n:10} kV-spoelen in driehoek, elk tussen twee fasen.', 'D: the {n:10} kV coils in delta, each between two phases.', { cues: ['plate'] }),
        B('yn: de {n:400} V-spoelen in ster, elk van een fase naar de nul: {n:230} V.', 'yn: the {n:400} V coils in star, each from a phase to neutral: {n:230} V.', { cues: ['plate'] }),
        B('Per spoel is de verhouding dus {n:10000} / {n:230} ≈ {n:43}, niet {n:25}.', 'So the ratio per coil is {n:10000} / {n:230} ≈ {n:43}, not {n:25}.', { cues: ['plate'] }),
      ],
    },
    {
      id: 's8', lesson: PR, level: 1, dur: DUR[7], still: 0.9, title: { nl: 'De aftakschakelaar', en: 'The tap changer' },
      beats: [
        B('Een {t:Aftakschakelaar|aftakschakelaar} kiest een aftakking: een extra aansluitpunt op de wikkeling.', 'A {t:Tap changer|tap changer} picks a tap: an extra connection point on the winding.', { cue: { Aftakschakelaar: 'tap' } }),
        B('Stappen van meestal {n:2.5}%, vaak vijf standen. In een netstation alleen spanningsloos.', 'Steps of usually {n:2.5}%, often five positions. In a secondary substation only switched off.', { cues: ['tap'] }),
        B('Een {t:Regelschakelaar|regelschakelaar} in een onderstation regelt de MS-spanning onder belasting.', 'An {t:On-load tap changer|on-load tap changer} in a substation regulates the MV voltage under load.', { cue: { Regelschakelaar: 'oltc' } }),
        B('Typische fouten: een verkeerde stand, overbelasting, vocht in de olie.', 'Typical failures: a wrong tap, overload, moisture in the oil.', { cues: [] }),
      ],
    },
    {
      id: 's9', lesson: PR, level: 1, dur: DUR[8], still: 0.9, title: { nl: 'Zon in de straat', en: 'Sun in the street' },
      beats: [
        B('Voorbeeld: {n:400} kVA in een straat vol zonnepanelen. Eind van de kabel: {n:252} V.', 'Example: {n:400} kVA in a street full of solar panels. End of the cable: {n:252} V.', { cues: ['tank'] }),
        B('Grens {n:253} V ({n:230} V + {n:10}%): omvormers vallen uit. De stand: midden.', 'Limit {n:253} V ({n:230} V + {n:10}%): inverters drop out. The tap: middle.', { cues: ['tap'] }),
        B('Eén stap lager, {n:2.5}%: zo’n {n:6} V minder, rond {n:246} V.', 'One step lower, {n:2.5}%: about {n:6} V less, around {n:246} V.', { cues: ['tap'] }),
        B('Daarvoor een paar minuten spanningsloos: een geplande onderbreking, vooraf een brief.', 'For that, a few minutes switched off: a planned outage, a letter beforehand.', { cues: ['tank'] }),
        B('Vraag dus: op welke stand staat hij, en wanneer is dat het laatst gecontroleerd?', 'So ask: what tap is it on, and when was that last checked?', { cues: ['tap'] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "≈" or brackets in the spoken text;
// kV, V, A, kVA, MVA, kW and Hz are written out (kilovolt, volt, ampère,
// kilovoltampère, megavoltampère, kilowatt, hertz), as in the grid films,
// because espeak-ng spells some of them as letters. Words checked with
// espeak-ng phonemes (Piper's own bridge, 2026-11-12): nullastverliezen and
// regelschakelaar (stress on the head), ONAN (read as a word, "onan") and Dyn5
// ("din vijf") and "in driehoek" (stressed "drie-HOEK") get Dutch-only spoken
// forms in films/_kit/timeline.mjs (SAY). The English words oil natural, air
// natural (read "oo-il naa-TUU-ral") and ecodesign ("ee-koo-dee-zign") are kept
// out of the Dutch narration (they stay in the captions), and so are
// laagspanningskabels, -kant and -wikkeling and middenspanningskant (stressed
// on the head or misread): said as "de kabels in de straat", "de kant van de
// laagspanning" and so on. In the English narration Dyn5 is said letter by
// letter in the text itself ("a capital D, then y, n and 5"), since the SAY
// rules added for this film are Dutch only.
const SAY = [
  [ // s1 the transformer in the secondary substation
    { nl: 'Dit is de transformator van een netstation, het hart van het station.',
      en: 'This is the transformer of a secondary substation, the heart of the station.' },
    { nl: 'Achter komt de middenspanning binnen, {n:10} kilovolt. Voor gaat laagspanning eruit, {n:400} volt, naar de kabels van een paar straten.',
      en: 'Medium voltage comes in at the back, {n:10} kilovolts. Low voltage leaves at the front, {n:400} volts, into the cables for a few streets.' },
    { nl: 'Hij zet de ene wisselspanning om in een andere. Anders dan een motor heeft hij geen draaiveld: er draait niets. Hoe werkt dat? We tillen hem uit zijn tank.',
      en: 'It changes one AC voltage into another. Unlike a motor it has no rotating field: nothing turns. So how does it work? We lift it out of its tank.' },
  ],
  [ // s2 core and windings
    { nl: 'In het midden een ijzeren kern van dunne plaatjes staal, met drie benen, één per fase. Om elk been zitten twee spoelen van draad, de wikkelingen, van koper of aluminium. Meestal zit de wikkeling voor laagspanning binnen en die voor middenspanning eromheen.',
      en: 'In the middle an iron core of thin steel sheets, with three legs, one per phase. Round each leg sit two coils of wire, the windings, of copper or aluminium. Usually the low-voltage winding sits inside, with the medium-voltage winding round it.' },
    { nl: 'Wisselstroom in de eerste wikkeling maakt een magnetisch veld in de kern. De stroom wisselt steeds van richting, dus het veld ook.',
      en: 'Alternating current in the first winding makes a magnetic field in the core. The current keeps changing direction, and so does the field.' },
    { nl: 'Een wisselend veld wekt een spanning op in elke spoel om de kern, dus ook in de tweede wikkeling. Zo gaat het vermogen over, zonder dat de wikkelingen elkaar raken.',
      en: 'A changing field induces a voltage in every coil round the core, so also in the second winding. That is how power passes across, without the windings touching.' },
  ],
  [ // s3 the turns ratio
    { nl: 'Elke winding krijgt van het veld evenveel spanning. Veel windingen geven dus veel spanning, weinig windingen weinig. Het aantal windingen van de ene wikkeling gedeeld door dat van de andere heet de {t:Wikkelverhouding|wikkelverhouding}.',
      en: 'Every turn gets the same voltage from the field. So many turns give a lot of voltage, few turns a little. The number of turns on one winding divided by the number on the other is the {t:Turns ratio|turns ratio}.' },
    { nl: 'Die bepaalt de spanningsverhouding. Van {n:10} kilovolt naar {n:400} volt is {n:25} keer omlaag.',
      en: 'It sets the voltage ratio. From {n:10} kilovolts to {n:400} volts is {n:25} times down.' },
    { nl: 'Het vermogen blijft bijna gelijk. Gaat de spanning {n:25} keer omlaag, dan gaat de stroom {n:25} keer omhoog. Daarom heeft de laagspanning dikke koperen staven, en de middenspanning dunne draad.',
      en: 'Power stays almost the same. If the voltage goes down {n:25} times, the current goes up {n:25} times. That is why the low-voltage side has thick copper bars, and the medium-voltage side thin wire.' },
  ],
  [ // s4 kVA and current
    { nl: 'Het vermogen staat in kilovoltampère: spanning maal stroom.',
      en: 'The rating is in kilovolt-amperes: voltage times current.' },
    { nl: 'Een netstation heeft meestal {n:250}, {n:400} of {n:630} kilovoltampère. Een transformator in een onderstation, van {n:150} kilovolt naar {n:10} of {n:20}, is meestal tientallen megavoltampère.',
      en: 'A secondary substation typically has {n:250}, {n:400} or {n:630} kilovolt-amperes. A substation transformer, from {n:150} kilovolts to {n:10} or {n:20}, is usually several tens of megavolt-amperes.' },
    { nl: 'Bij driefasige stroom is de stroom het vermogen gedeeld door {n:1.73} maal de spanning.',
      en: 'For three-phase power, the current is the power divided by {n:1.73} times the voltage.' },
    { nl: 'Deze {n:400} kilovoltampère is aan de laagspanning dus zo’n {n:577} ampère, en aan de middenspanning maar zo’n {n:23}.',
      en: 'So these {n:400} kilovolt-amperes are about {n:577} amps on the low-voltage side, and only about {n:23} on the medium-voltage side.' },
  ],
  [ // s5 losses
    { nl: 'De verliezen zijn klein, maar stoppen nooit. {t:Nullastverliezen|Nullastverliezen} gaan verloren in de kern, zodra de transformator onder spanning staat: dag en nacht, ook als niemand stroom gebruikt.',
      en: 'The losses are small, but never stop. {t:No-load losses|No-load losses} are lost in the core as soon as the transformer is energised: day and night, even when nobody uses power.' },
    { nl: '{t:Belastingverliezen|Belastingverliezen} gaan verloren in de wikkelingen en groeien met het kwadraat van de belasting.',
      en: '{t:Load losses|Load losses} are lost in the windings and grow with the load squared.' },
    { nl: 'Bij halve last is het dus een kwart. Een nieuwe van {n:630} kilovoltampère mag hoogstens {n:0.54} kilowatt verliezen bij nullast, en {n:4.6} bij vollast.',
      en: 'So at half load it is a quarter. A new {n:630} kilovolt-ampere unit may lose at most {n:0.54} kilowatts at no load, and {n:4.6} at full load.' },
    { nl: 'Een rendement van zo’n {n:99} procent. Maar over duizenden stations telt het op, dus Europese regels begrenzen die verliezen.',
      en: 'About {n:99} percent efficient. But across thousands of stations it adds up, so EU ecodesign rules cap these losses.' },
  ],
  [ // s6 oil and cooling
    { nl: 'In de tank staan kern en wikkelingen onder minerale olie. Die isoleert, en voert de warmte af.',
      en: 'In the tank, the core and windings sit in mineral oil. It insulates, and carries the heat away.' },
    { nl: 'Warme olie stijgt op, koelt af in de koelribben en zakt weer. Die koelklasse heet {t:ONAN|ONAN}.',
      en: 'Warm oil rises, cools in the fins and sinks again. That cooling class is called {t:ONAN|ONAN}.' },
    { nl: 'Olie en lucht stromen vanzelf: geen pompen, geen ventilatoren.',
      en: 'Oil natural, air natural: the oil and the air flow by themselves, with no pumps or fans.' },
    { nl: 'Ter plaatse hoor je een brom van {n:100} hertz, twee keer de netfrequentie: de kern verandert elke halve periode heel licht van vorm.',
      en: 'On site you hear a {n:100} hertz hum, twice the grid frequency: the core changes shape very slightly every half cycle.' },
  ],
  [ // s7 the nameplate
    { nl: 'Op het typeplaatje staan het vermogen, de spanningen, de koelklasse en een code, hier Dyn5.',
      en: 'The nameplate gives the rating, the voltages, the cooling class and a code: here a capital D, then y, n and 5.' },
    { nl: 'D betekent: de spoelen van {n:10} kilovolt staan in driehoek, elk tussen twee fasen.',
      en: 'D means: the {n:10} kilovolt coils are in delta, each between two phases.' },
    { nl: 'y en n betekenen: de spoelen van {n:400} volt staan in ster, elk van een fase naar een gezamenlijke nul. Over elke spoel staat dan {n:230} volt.',
      en: 'y and n mean: the {n:400} volt coils are in star, each from a phase to a shared neutral. Each coil then sees {n:230} volts.' },
    { nl: 'Per spoel is de wikkelverhouding dus {n:10000} gedeeld door {n:230}, zo’n {n:43}, en niet {n:25}.',
      en: 'So the turns ratio per coil is {n:10000} divided by {n:230}, about {n:43}, not {n:25}.' },
  ],
  [ // s8 the tap changer
    { nl: 'Op het deksel zit de knop van de {t:Aftakschakelaar|aftakschakelaar}. Die kiest een aftakking, een extra aansluitpunt op de wikkeling, en verandert zo de verhouding een klein beetje.',
      en: 'On the lid sits the knob of the {t:Tap changer|tap changer}. It picks a tap, an extra connection point on the winding, and so changes the ratio a little.' },
    { nl: 'De stappen zijn meestal {n:2.5} procent, vaak over vijf standen. In een netstation mag dat alleen als de transformator spanningsloos is.',
      en: 'The steps are usually {n:2.5} percent, often over five positions. In a secondary substation that is only allowed with the transformer switched off.' },
    { nl: 'Een onderstation heeft een {t:Regelschakelaar|regelschakelaar}. Die regelt de middenspanning automatisch, onder belasting.',
      en: 'A substation has an {t:On-load tap changer|on-load tap changer}. It regulates the medium voltage automatically, under load.' },
    { nl: 'Typische fouten: een aftakking die jaren verkeerd staat, oververhitting door overbelasting, en vocht in de olie.',
      en: 'Typical failures: a tap left in the wrong position for years, overheating from overload, and moisture in the oil.' },
  ],
  [ // s9 the worked example: sun in the street
    { nl: 'Een voorbeeld. Een netstation van {n:400} kilovoltampère, in een straat vol zonnepanelen. Op zonnige dagen is de spanning aan het eind van de kabels {n:252} volt.',
      en: 'An example. A {n:400} kilovolt-ampere secondary substation, in a street full of solar panels. On sunny days the voltage at the end of the cables is {n:252} volts.' },
    { nl: 'Dat is vlak bij de grens van {n:253} volt, {n:230} plus {n:10} procent. Omvormers, die de gelijkstroom van de panelen omzetten in wisselstroom, vallen uit. De aftakschakelaar staat in de middenstand.',
      en: 'That is close to the limit of {n:253} volts, {n:230} plus {n:10} percent. Inverters, which turn the panels’ direct current into alternating current, drop out. The tap changer is in the middle position.' },
    { nl: 'De netbeheerder zet hem één stap lager, {n:2.5} procent: zo’n {n:6} volt minder, naar rond de {n:246} volt.',
      en: 'The engineer moves it one step lower, {n:2.5} percent: about {n:6} volts less, to around {n:246} volts.' },
    { nl: 'Daarvoor moet de transformator een paar minuten spanningsloos. Alle klanten krijgen een geplande korte onderbreking, en vooraf een brief.',
      en: 'For that, the transformer must be switched off for a few minutes. All customers get a planned short outage, and a letter in advance.' },
    { nl: 'Vraag daarom altijd: op welke stand staat hij, en wanneer is dat voor het laatst gecontroleerd?',
      en: 'So always ask: what tap position is it on, and when was that last checked?' },
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
.tf-flux{fill:none;stroke:var(--fp-accent);stroke-width:2.2px;stroke-dasharray:4 5;stroke-linecap:round;stroke-linejoin:round;opacity:0;vector-effect:non-scaling-stroke}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-iron{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.4}
.mf-oil{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:var(--anatomy-lo);stroke-width:1.2}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mf-l2{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-dasharray:9 5;stroke-linecap:round}
.mf-coil{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .mf-line,[data-cue][data-on] .mf-coil{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono,[data-cue][data-on] .mf-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een netstation: links het actieve deel van een transformator, uit de tank getild, met een ijzeren kern met drie benen, op elk been een wikkeling voor laagspanning met de wikkeling voor middenspanning eromheen, de koperen staven en de aftakschakelaar; rechts de gesloten tank met koelribben, doorvoeren, het typeplaatje en de knop van de aftakschakelaar. Kaarten tonen het veld in de kern, de wikkelverhouding, kVA en de twee stromen, de verliezen tegen de belasting, de oliestroom bij ONAN, het typeplaatje met driehoek en ster, de standen van de aftakschakelaar en de straat vol zonnepanelen.',
  en: 'A secondary substation: on the left the active part of a transformer, lifted out of its tank, with a three-leg iron core, on each leg a low-voltage winding inside a medium-voltage winding, the copper bars and the tap changer; on the right the closed tank with fins, bushings, the nameplate and the tap changer knob. Cards show the field in the core, the turns ratio, kVA and the two currents, the losses against the load, the oil flow under ONAN, the nameplate with delta and star, the tap positions and the street full of solar panels.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

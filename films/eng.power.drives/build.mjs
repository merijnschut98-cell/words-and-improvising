// Dev tool, not shipped. Builds the explainer film "Een motor aanlopen /
// Starting a motor" for the topic Aanlopen en aandrijvingen of Motoren,
// aandrijvingen en perslucht: its level 1 lesson eng.power.drives.
//
//   node films/eng.power.drives/build.mjs            build the page
//   node films/eng.power.drives/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.power.drives.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.power). The plan row lists the lesson "drives"; its id still exists after
// the topics x levels rebuild (eng.power.drives, level 1 of the topic drives),
// so no mapping was needed. The higher levels of the topic (vfd, harmonics,
// drivesystem) are not served: harmonics and bearing currents are named here
// only as far as the drives lesson names them.
//
// The drawing is the pump set of the film eng.power.motor (the same parts and
// camera, so the motor is the same motor): pump, coupling guard, motor with
// fins, terminal box, fan cowl and nameplate, the supply cable into a floor
// duct, and the cabinet on its pedestal, here the starter whose screen draws the
// motor current as a trace. The fan behind the cowl turns at the motor's speed,
// so the run-up of each starter can be seen, and the motor jolts on a direct
// start. Cards in stage space: the contactor (a schema), the current and torque
// traces of the four ways to start, a section through the motor at standstill
// (the motor film's), the crusher's currents, the affinity laws, the side
// effects of a drive (pulsed current, a pitted bearing) and the servo with the
// choice table; example cards are labelled "voorbeeld" (or "schema").
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
// - Direct on line: a squirrel-cage motor draws about 5 to 8 times its rated
//   current at locked rotor (IEC 60034-12 code letters; ABB and Siemens motor
//   guides), so "6 tot 8" as in the lesson; the rotor at standstill has slip 1,
//   and the motor then acts like a transformer with a short-circuited secondary.
// - Star-delta: in star each winding gets U / √3, so its current and torque
//   (∝ U²) drop to a third of a delta (direct) start, line current also a third;
//   an open-transition change-over gives a short current surge (Schneider and
//   ABB starter guides), said as "meestal".
// - Soft starter: thyristors lower the voltage; torque goes roughly with the
//   square of the voltage, so half the voltage gives about a quarter of the
//   torque; a current limit of about 3 to 4 times rated is typical (2 to 5 in
//   manufacturers' guides), as in the lesson; it does not change the running
//   speed (most are bypassed once up to speed).
// - VFD: a rectifier makes a DC link, an inverter switches it (PWM, typically
//   a few to about 16 kHz, so "duizenden keren per seconde") into a new
//   three-phase supply; with the voltage raised in step with the frequency
//   (V/f) the motor gives rated torque from low speed at about rated current.
//   The synchronous speed is 120 f / p, so half the frequency is half the speed.
// - Affinity laws for a centrifugal pump or fan: flow ∝ n, head ∝ n², power ∝
//   n³; 0,8³ = 0,51, so "zo'n half vermogen"; with static head, and the drive's
//   own few percent of losses, the real saving is lower (hedged, as in the lesson).
// - Harmonics: a six-pulse rectifier draws current in pulses, mainly 5th and
//   7th harmonics (multiples of 50 Hz); said only as "stromen op veelvouden van
//   50 hertz die de golf vervormen".
// - Bearing currents: the inverter's common-mode voltage builds a shaft voltage
//   that discharges through the bearing grease (EDM): pits and, over time, a
//   washboard pattern (fluting) in the raceway. Remedies: symmetrical shielded
//   cable, good high-frequency earthing, filters, shaft earthing rings or an
//   insulated bearing (e.g. ABB technical guide 5, "Bearing currents in modern
//   AC drive systems"); the film names the lesson's three.
// - Servo: an encoder on the shaft feeds back the position; the drive closes the
//   position and speed loops.
const DRV = 'eng.power.drives';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const nl = lessons.nl.get(DRV);
  const teach = nl.teach.join('\n');
  assert(teach.includes('6 tot 8 keer de nominale stroom'), 'DOL 6 to 8 times rated');
  assert(teach.includes('een derde van de stroom en het koppel'), 'star-delta a third');
  assert(teach.includes('minder aanloopkoppel') && teach.includes('blijven hangen'), 'soft starter less torque');
  assert(teach.includes('derde macht van het toerental') && teach.includes('op 80% toerental zo’n half vermogen'), 'affinity laws');
  assert(teach.includes('harmonischen') && teach.includes('motorlagers') && teach.includes('Afgeschermde kabels, filters en goede aarding'), 'side effects');
  assert(teach.includes('op 50 Hz, vol toeren'), 'the drive left at 50 Hz');
  assert(teach.includes('encoder') && teach.includes('tiende millimeter'), 'servo');
  assert(nl.example.text.includes('3 à 4 keer nominaal') && nl.example.text.includes('vallen uit op onderspanning'), 'the crusher');
}
// DOL: 6 to 8 times rated
const DOL_LO = 6;
const DOL_HI = 8;
const DOL_DRAWN = 7; // the drawn trace
assert(DOL_DRAWN >= DOL_LO && DOL_DRAWN <= DOL_HI, 'drawn DOL surge within 6 to 8');
assert(DOL_DRAWN * 50 === 350, 'recall: 7 × 50 A = 350 A');
// star-delta: winding voltage U / √3, current and torque (∝ U²) a third
const YD = (1 / Math.sqrt(3)) ** 2;
assert(near(YD, 1 / 3, 1e-12), 'star: (1 / √3)² = 1 / 3');
// soft starter: 3 to 4 times rated; half the voltage, a quarter of the torque
const SOFT_LO = 3;
const SOFT_HI = 4;
const SOFT_DRAWN = 3.5;
assert(SOFT_DRAWN >= SOFT_LO && SOFT_DRAWN <= SOFT_HI, 'drawn soft-start limit');
assert(0.5 ** 2 === 0.25, 'half the voltage, a quarter of the torque');
// the crusher: 90 kW at 400 V, about 160 A; 1.000 to 1.300 A at a direct start
const P_CR = 90;
const U = 400;
const I_CR = 160;
const I_CALC = (P_CR * 1000) / (Math.sqrt(3) * U * 0.87 * 0.95); // cos φ 0,87 and efficiency 95 %, typical for 90 kW
assert(near(I_CALC, I_CR, 6), '90 kW at 400 V is about 160 A');
const I_ST = [1000, 1300];
assert(I_ST[0] / I_CR >= DOL_LO && I_ST[1] / I_CR <= DOL_HI + 0.2, '1.000 to 1.300 A is about 6 to 8 times 160 A');
// the affinity laws: 80 % speed, power 0,8³ ≈ half
const N80 = 0.8;
const P80 = N80 ** 3;
assert(near(P80, 0.512, 0.001) && near(P80, 0.5, 0.02), '0,8³ ≈ half');
const HZ = 50;
assert((120 * HZ) / 4 / 2 === (120 * (HZ / 2)) / 4, 'half the frequency, half the synchronous speed');

// ---------------------------------------------------------------- the world (the pump set of eng.power.motor)
// World units are centimetres, z up, x along the shaft (pump at −x, motor at
// +x), +y toward the viewer. The top of the concrete plinth is z = 0.
const W = 640;
const H = 400;
const ZC = 23;
const FLOOR = -7;
const PLINTH = { x: -78, y: -26, w: 148, d: 52, r: 1.5 };
const BASE = { x: -72, y: -20, w: 136, d: 40, r: 1.2 };
const BASE_TOP = 5;
const POST = [0, -42];
const BOX = { x: -26, y: -46, w: 52, d: 8, r: 0.8 };
const BOX_Z = [32, 63];
const FACE_Y = BOX.y + BOX.d;
const WIN = { x0: -22, x1: 22, z0: 38.4, z1: 59.4, r: 1.4, depth: 0.8 };
const PLOT = { x0: WIN.x0, x1: WIN.x1, z0: WIN.z0 + 0.6, z1: WIN.z1 - 0.6, vmax: 12.5 };
const COWL_X = 58;
// the supply cable: from the terminal box gland (+y) out over the plinth edge and down into a floor duct
const GLAND_Y = 7.7;
const GLAND_Z = 39.6;
const CABLE_R = 0.95;
const DUCT = { x: 17, y: 30, w: 14, d: 9, r: 0.8 };
const DUCT_TOP = FLOOR + 2.4;
const CABLE_Y = DUCT.y + DUCT.d / 2;
// the nameplate on the motor's side, tangent to the fins at y = 13
const PLATE = { x0: 30.5, x1: 39.5, z0: 18.5, z1: 27.5, y: 13.6 };

const FIT = [
  ...k.boxCorners(PLINTH, FLOOR, 0),
  ...k.boxCorners({ x: -28, y: -47, w: 56, d: 10 }, FLOOR, BOX_Z[1] + 2),
  ...k.boxCorners(DUCT, FLOOR, DUCT_TOP),
  [-48, 0, 49],
];
const P = k.fitProjection(FIT, W, H, { pad: 16, azimuth: 74, elevation: 26 });
const KS = G.scaleOf(P);
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- recorder
// Each part carries the cue of its assembly, so a term can light the motor,
// the supply cable (gland, cable and duct), the nameplate, the pump or the meter.
const cueOf = (name) => (/^motor\.plate/.test(name) ? 'plate'
  : /^(motor\.(gland|plug)|cable|duct)/.test(name) ? 'cable'
    : /^motor\./.test(name) ? 'motor'
      : /^pump\./.test(name) ? 'pump'
        : /^panel\./.test(name) ? 'panel'
          : /^guard\./.test(name) ? 'guard' : '');
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

// A recess in the face y = const (the panel's screen): inner walls shaded by
// facing, a back plane holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = '', backClass = 'mf-glass') {
  const id = `mf-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flatRect(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join('')}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join('')}"/>` : '')),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    '</g>',
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join('');
}

// ---------------------------------------------------------------- floor, plinth and baseplate
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -2), FLOOR, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf({ x: -10, y: -51, w: 20, d: 18, r: 3 }, FLOOR, 1, P)}" style="opacity:.6"/>`,
];
{
  const anchors = k.corners(PLINTH, 6);
  const extra = L(k.planOutline(k.insetPlan(PLINTH, 3), 0, P, 3), { tone: 'faint' })
    + L(anchors.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box('stand.plinth', PLINTH, FLOOR, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLINTH, -2, P, 3), { tone: 'faint' }), extra });
}
{
  const bolts = [-64, -36, 22, 56].flatMap((x) => [[x, BASE.y + 3.4], [x, BASE.y + BASE.d - 3.4]]);
  const extra = L(k.planOutline(k.insetPlan(BASE, 1.8), BASE_TOP, P, 3), { tone: 'faint' })
    + L(bolts.map(([x, y]) => k.ring(x, y, 1.4, BASE_TOP, P, 14)).join(''), { tone: 'lo' })
    + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 });
  box('base.plate', BASE, 0, BASE_TOP, { tone: 'mid' }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(BASE, 1.4, P, 3), { tone: 'faint' }), extra });
  discAt('base.drain', frameY([-14, BASE.y + BASE.d, 2.6]), 0, 1.6, 1.4, { tone: 'mid' }, { extra: Dt([at([-14, BASE.y + BASE.d + 1.6, 2.6])], { size: 0.45, tone: 'hi' }) });
}

// ---------------------------------------------------------------- the motor (+x)
const FM = frameX([6, 0, ZC]);
let bodyItem = null;
for (const x0 of [8, 30]) {
  box('base.pad', { x: x0, y: -16, w: 10, d: 32, r: 0.6 }, BASE_TOP, BASE_TOP + 2, { tone: 'lo' }, { steps: 2, bevel: 0.3 });
  const foot = { x: x0 + 1, y: -15, w: 8, d: 30, r: 0.6 };
  const holes = [[x0 + 5, -12.4], [x0 + 5, 12.4]];
  box('motor.foot', foot, BASE_TOP + 2, BASE_TOP + 6.4, { tone: 'mid' }, {
    owner: 'motor', steps: 2, bevel: 0.3,
    extra: L(holes.map(([x, y]) => k.ring(x, y, 1.2, BASE_TOP + 6.4, P, 12)).join(''), { tone: 'lo' }) + Dt(holes.map(([x, y]) => at([x, y, BASE_TOP + 6.4])), { size: 0.5, tone: 'hi' }),
  });
}
for (const [xb, dir] of [[6, 1], [42, -1]]) {
  for (const yc of [-12, 12]) {
    box('base.jack', { x: xb - 1.2, y: yc - 2, w: 2.4, d: 4, r: 0.4 }, BASE_TOP, BASE_TOP + 5.6, { tone: 'mid' }, { steps: 2, bevel: 0.2 });
    const FJ = frameX([xb, yc, BASE_TOP + 3.8]);
    const s0 = dir > 0 ? 1.2 : -3;
    discAt('base.jack-bolt', FJ, s0, s0 + 1.8, 0.75, { tone: 'mid', crease: 'none' }, {});
    const h0 = dir > 0 ? -2.6 : 1.2;
    discAt('base.jack-head', FJ, h0, h0 + 1.4, 1.35, { tone: 'mid' }, { steps: 6 });
  }
}
post('base.earth', 52, 15.6, 1.4, BASE_TOP, BASE_TOP + 1, { tone: 'mid' }, { steps: 6 });
post('base.earth-stud', 52, 15.6, 0.7, BASE_TOP + 1, BASE_TOP + 3, { tone: 'hi', crease: 'none' }, { steps: 14, extra: Dt([at([52, 15.6, BASE_TOP + 3])], { size: 0.4, tone: 'hi' }) });
{
  const fins = G.ribsOf(FM, 0.6, 35.4, 13, 30, P, { fade: [0.02, 0.4], seams: true });
  bodyItem = turned('motor.body', FM, [[0, 13], [36, 13]], { tone: 'hi', crease: 'lo' }, { owner: 'motor', inner: k.fadedSvg(fins, { tone: 'lo' }) });
}
discAt('motor.de', FM, -4, 0, 12, { tone: 'mid' }, { owner: 'motor', inner: L(G.arcOf(FM, -2, 12, P), { tone: 'faint' }) });
discAt('motor.boss', FM, -7, -4, 6, { tone: 'mid' }, { owner: 'motor' });
discAt('motor.shaft', FM, -9, -7, 2.4, { tone: 'hi', crease: 'none' }, { owner: 'motor' });
discAt('motor.nde', FM, 36, 39, 12, { tone: 'mid' }, { owner: 'motor', inner: L(G.arcOf(FM, 37.5, 12, P), { tone: 'faint' }) });
{
  // fan cowl: its grille end facing +x, the fan behind it (turned by the stage)
  const FC = frameX([45, 0, ZC]);
  const cowl = [[0, 13.4], [11.6, 13.4], [13, 12.4]];
  const face = [
    `<path class="mf-well" d="${G.circleOf(FC, 13, 11, P, 72)}"/>`,
    '<path class="iso-line" data-tone="mid" data-k="fan" d=""/>',
    L(G.circleOf(FC, 13, 2.6, P, 28), { tone: 'lo' }),
    L(G.circleOf(FC, 13, 6.2, P, 48) + G.circleOf(FC, 13, 8.8, P, 56), { tone: 'faint' }),
    L(G.circleOf(FC, 13, 11, P, 72), { tone: 'lo' }),
    Dt([at([COWL_X, 0, ZC])], { size: 0.6, tone: 'hi' }),
  ].join('');
  const ribs = G.ribsOf(FC, 1.2, 11.6, 13.4, 24, P, { fade: [0.04, 0.42], seams: true });
  turned('motor.cowl', FC, cowl, { tone: 'mid' }, { owner: 'motor', inner: k.fadedSvg(ribs, { tone: 'faint' }), extra: face });
}
{
  const FN = G.frameOf([24, 0, ZC], Zv, Y, X);
  const low = G.saddleStart(13, 4, 0);
  put('motor.neck', [24, 0, ZC + 13.2], S(G.saddleOf(FN, 4, 13, 13.8, P), { tone: 'mid' }), [R.solid(A.disc(FN, low - 0.05, 13.8, 4, { name: 'motor.neck', owner: 'motor', seated: true, cut: bodyItem.shapes }))]);
  const tb = { x: 18, y: -4.5, w: 12, d: 9, r: 0.8 };
  box('motor.tbox', tb, ZC + 13.8, 43, { tone: 'mid' }, { owner: 'motor', steps: 2, bevel: 0.3 });
  const lid = k.insetPlan(tb, -0.6);
  box('motor.lid', lid, 43, 44.4, { tone: 'mid' }, { owner: 'motor', steps: 2, bevel: 0.3, extra: Dt(k.corners(lid, 1.4).map(([x, y]) => at([x, y, 44.4])), { size: 0.42 }) });
  const FG = frameY([24, 4.5, 39.6]);
  discAt('motor.gland', FG, 0, 2.2, 1.7, { tone: 'mid' }, { owner: 'motor', steps: 6 });
  discAt('motor.plug', FG, 2.2, 3.2, 1.15, { tone: 'mid' }, { owner: 'motor' });
}
{
  // the nameplate: a thin plate on the fins with four rivets and its engraved rows
  const { x0, x1, z0, z1, y } = PLATE;
  const fy = y;
  const rows = [26, 24.6, 23.2, 21.8, 20.4].map((z, i) => k.segment([x0 + 1.2, fy, z], [x1 - [1.2, 2.6, 1.6, 3.4, 4.2][i], fy, z], P)).join('');
  box('motor.plate', { x: x0, y: y - 0.6, w: x1 - x0, d: 0.6, r: 0.3 }, z0, z1, { tone: 'hi' }, {
    owner: 'motor', steps: 2, bevel: 0.15,
    extra: L(rows, { tone: 'lo', free: true }) + Dt([[x0 + 0.6, fy, z0 + 0.6], [x1 - 0.6, fy, z0 + 0.6], [x0 + 0.6, fy, z1 - 0.6], [x1 - 0.6, fy, z1 - 0.6]].map(at), { size: 0.4, tone: 'mid' }),
  });
}

// ---------------------------------------------------------------- the supply cable and its floor duct
{
  const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(DUCT, -1.5), FLOOR, 1, P)}"/>`;
  const seam = L(k.planOutline(k.insetPlan(DUCT, 1.4), DUCT_TOP, P, 3), { tone: 'faint' });
  const screws = k.corners(DUCT, 1.2);
  box('duct.box', DUCT, FLOOR, DUCT_TOP, { tone: 'lo' }, {
    steps: 2, bevel: 0.4, ground: true,
    extra: halo + seam + L(screws.map(([x, y]) => k.ring(x, y, 0.7, DUCT_TOP, P, 12)).join(''), { tone: 'lo' }) + Dt(screws.map(([x, y]) => at([x, y, DUCT_TOP])), { size: 0.4 }),
  });
  post('duct.gland', 24, CABLE_Y, 1.9, DUCT_TOP, DUCT_TOP + 1.6, { tone: 'mid' }, { steps: 6, bevel: 0.2 });
  const route = G.fillet([[24, GLAND_Y, GLAND_Z], [24, CABLE_Y, GLAND_Z], [24, CABLE_Y, DUCT_TOP + 1.6]], 7, 10, { P, tube: CABLE_R });
  R.route('cable', route, CABLE_R, { limp: true });
  T.tubePieces(route, CABLE_R, P, { maxLength: 40, spacing: 1 }).forEach((piece, i) => {
    put(`cable:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'mid' }), [A.tube(piece.points, piece.radii, { name: 'cable', limp: true })], { bias: 0.05 });
  });
}

// ---------------------------------------------------------------- coupling guard
{
  const guard = { x: -24, y: -8, w: 21, d: 16, r: 2.4 };
  const fy = guard.y + guard.d;
  const slots = [];
  for (const z of [15, 19, 23, 27]) slots.push(k.pathOf(k.roundedPlan({ x: -20, y: z, w: 13, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
  box('guard.cover', guard, 10, 32, { tone: 'mid' }, {
    owner: 'guard', steps: 3, bevel: 0.6,
    inner: L(slots.join(''), { tone: 'lo' }),
    extra: Dt([[-16.5, fy, 22.8], [-22, fy, 30], [-5, fy, 30]].map(at), { size: 0.42, tone: 'mid' }),
  });
  for (const x0 of [-22, -9]) box('guard.foot', { x: x0, y: -10.5, w: 4, d: 21, r: 0.5 }, BASE_TOP, 10, { tone: 'lo' }, { owner: 'guard', steps: 2, extra: Dt([at([x0 + 2, 9.4, BASE_TOP + 0.01])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- the pump (−x)
const FB = frameX([-38, 0, ZC]);
discAt('pump.frame', FB, 0, 14, 7, { tone: 'mid' }, { owner: 'pump', inner: L(G.arcOf(FB, 4, 7, P) + G.arcOf(FB, 10, 7, P), { tone: 'faint' }) });
box('pump.frame-foot', { x: -34, y: -8, w: 6, d: 16, r: 0.6 }, BASE_TOP, 16.4, { tone: 'mid' }, { owner: 'pump', steps: 2, bevel: 0.3 });
discAt('pump.cover', frameX([-42, 0, ZC]), 0, 4, 11, { tone: 'mid' }, { owner: 'pump' });
{
  const FV = frameX([-54, 0, ZC]);
  const volute = [[0, 12], [1.2, 15.8, 1], [6, 16.4, 1], [10.8, 15.8, 1], [12, 12]];
  const bolts = G.dotsOf(FV, 12, 13.6, 12, P, { fade: [0.0, 0.3], all: true });
  turned('pump.casing', FV, volute, { tone: 'hi', crease: 'lo' }, { owner: 'pump', extra: Dt(bolts, { size: 0.5, tone: 'mid' }) });
  box('pump.foot', { x: -52, y: -8, w: 8, d: 16, r: 0.6 }, BASE_TOP, 7.4, { tone: 'mid' }, { owner: 'pump', steps: 2 });
  const FN = frameX([-64, 0, ZC]);
  discAt('pump.suction', FN, 0, 10, 6, { tone: 'mid' }, { owner: 'pump' });
  discAt('pump.suction-flange', FN, -3, 0, 9.5, { tone: 'mid' }, { owner: 'pump', extra: Dt(G.dotsOf(FN, -1.5, 9.5, 8, P, { fade: [0.05, 0.35] }), { size: 0.45 }) });
  post('pump.discharge', -48, 0, 4.4, ZC + 16.1, 46, { tone: 'mid' }, { owner: 'pump', steps: 32 });
  const flangeTop = 48.4;
  const holes = Array.from({ length: 8 }, (_, i) => [-48 + 6.1 * Math.cos((i + 0.5) * Math.PI / 4), 6.1 * Math.sin((i + 0.5) * Math.PI / 4)]);
  post('pump.flange', -48, 0, 7.6, 46, flangeTop, { tone: 'mid' }, {
    owner: 'pump', steps: 40, bevel: 0.3,
    extra: `<path class="mf-well" d="${k.ring(-48, 0, 4, flangeTop, P, 36)}"/>` + L(k.ring(-48, 0, 4, flangeTop, P, 36), { tone: 'lo' }) + Dt(holes.map(([x, y]) => at([x, y, flangeTop])), { size: 0.5, tone: 'mid' }),
  });
}

// ---------------------------------------------------------------- the energy meter on its pedestal
{
  const foot = { x: -8, y: -49, w: 16, d: 14, r: 1 };
  box('stand.foot', foot, FLOOR, FLOOR + 1.4, { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 2.2).map(([x, y]) => at([x, y, FLOOR + 1.4])), { size: 0.45 }) });
  post('panel.post', POST[0], POST[1], 2.2, FLOOR + 1.4, BOX_Z[0] - 5, { tone: 'mid' }, { steps: 24, inner: L(k.sideArc(POST[0], POST[1], 2.2, 8, P, 16), { tone: 'faint' }) });
  post('panel.collar', POST[0], POST[1], 3.4, BOX_Z[0] - 5, BOX_Z[0], { tone: 'mid' }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  // the screen: a time axis with hour ticks, then the power line and the energy under it, drawn live
  const ticks = Array.from({ length: 9 }, (_, i) => PLOT.x0 + ((PLOT.x1 - PLOT.x0) * i) / 8)
    .map((x) => `M${x.toFixed(1)} ${(-PLOT.z0).toFixed(1)}V${(-PLOT.z0 - 0.9).toFixed(1)}`).join('');
  const screen = [
    `<path class="iso-line" data-tone="lo" d="M${PLOT.x0} ${-PLOT.z0}H${PLOT.x1}${ticks}"/>`,
    '<g data-k="scr"></g>',
  ].join('');
  const label = { x0: -15, x1: 3, z0: 33.8, z1: 37 };
  const faceBits = [
    recess(WIN, fy, screen),
    `<g transform="${planeOf(fy)}">`,
    `<path class="mf-card" d="${flatRect(label.x0, label.z0, label.x1, label.z1, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-13.4 ${-35.9}H0.6M-13.4 ${-34.9}H-3.4"/>`,
    '</g>',
    Dt([[BOX.x + 1.4, fy, BOX_Z[0] + 1.4], [BOX.x + BOX.w - 1.4, fy, BOX_Z[0] + 1.4], [BOX.x + 1.4, fy, BOX_Z[1] - 1.4], [BOX.x + BOX.w - 1.4, fy, BOX_Z[1] - 1.4]].map(at), { size: 0.42 }),
  ].join('');
  box('panel.box', BOX, BOX_Z[0], BOX_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.6, extra: faceBits });
  const FL = frameY([-19.5, fy, 35.4]);
  discAt('panel.lamp-ring', FL, 0, 0.6, 1.7, { tone: 'mid' }, {});
  discAt('panel.lamp', FL, 0.6, 1.3, 1.15, { tone: 'hi', crease: 'none' }, { attrs: ' data-k="lamp"' });
  discAt('panel.key', frameY([21, fy, 35.4]), 0, 1.4, 1.6, { tone: 'mid' }, { extra: L(k.segment([21, fy + 1.4, 34.4], [21, fy + 1.4, 36.4], P), { tone: 'lo' }) });
  box('panel.hood', { x: BOX.x - 1, y: BOX.y - 0.6, w: BOX.w + 2, d: BOX.d + 2.2, r: 0.8 }, BOX_Z[1], BOX_Z[1] + 1.4, { tone: 'mid' }, { steps: 2, bevel: 0.3 });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const MOTOR_AT = at([22, 0, ZC]);
const PANEL_AT = at([0, FACE_Y, (BOX_Z[0] + BOX_Z[1]) / 2]);
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  // markers for the motor and the starter cabinet: at the chart scenes' camera the pump set is about
  // 60 px wide at 390 px, so a lit part alone is a dot; stage.js keeps the rings a fixed size on screen
  `<g data-cue="motor"><circle class="mf-mark" data-k="mk-motor" cx="${MOTOR_AT[0].toFixed(1)}" cy="${MOTOR_AT[1].toFixed(1)}" r="0"/></g>`,
  `<g data-cue="panel"><circle class="mf-mark" data-k="mk-panel" cx="${PANEL_AT[0].toFixed(1)}" cy="${PANEL_AT[1].toFixed(1)}" r="0"/></g>`,
].join('');


// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('ctc', g('ctBase', '') + cue('contactor', g('ctIn', ''))),
  g('tr', g('trBase', '') + cue('dol', g('trDol', '')) + cue('stardelta', g('trYd', '')) + cue('soft', g('trSoft', '')) + cue('vfd', g('trVfd', '')) + g('trTxt', '')),
  g('sect', g('scBase', '') + cue('stator', g('scStator', '')) + cue('rotorC', g('scRotor', '')) + cue('field', g('scField', '')) + cue('slipC', g('scSlip', '')) + g('scSide', '')),
  g('cr', g('crBase', '') + cue('crush', g('crIn', '')) + g('crTxt', '')),
  g('af', g('afBase', '') + cue('aff', g('afIn', '')) + g('afTxt', '')),
  g('hm', g('hmBase', '') + cue('harm', g('hmWave', '')) + cue('bearing', g('hmBrg', '')) + cue('fix', g('hmFix', ''))),
  g('sv', g('svBase', '') + cue('servo', g('svIn', '')) + cue('choice', g('svTab', ''))),
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
const SIDE = (w0, w1) => ({ from: cam([-4, -6, 24], w0, 104), to: cam([-4, -6, 24], w1, 104) });
const CAM = [
  { from: cam([-4, -6, 26], 660), to: cam([-4, -6, 24], 1900, 104), a: 0.06, b: 0.2 },
  SIDE(1950, 1850),
  SIDE(1900, 1820),
  SIDE(1880, 1820),
  SIDE(1950, 1820),
  SIDE(1880, 1820),
  SIDE(1880, 1820),
  SIDE(1950, 1800),
  SIDE(1880, 1820),
];

// ---------------------------------------------------------------- the film
const DUR = [34, 32, 32, 32, 34, 34, 34, 34, 32];
const C = { ZC, COWL_X, PLOT, KS, P_CR, DOL: DOL_DRAWN, SOFT: SOFT_DRAWN, YD, I_CR, I_ST, P80, dur: DUR };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.power.drives',
  title: { nl: 'Een motor aanlopen', en: 'Starting a motor' },
  lessons: [DRV],
  scenes: [
    {
      id: 's1', lesson: DRV, level: 1, dur: DUR[0], still: 0.92, title: { nl: 'Direct inschakelen', en: 'Direct on line' },
      beats: [
        B('Dezelfde pompset. Om te starten moet de motor op het net, via de kast.', 'The same pump set. To start, the motor must go onto the grid, through the cabinet.', { cues: ['motor', 'panel'] }),
        B('De {t:Magneetschakelaar|magneetschakelaar}: een spoel trekt drie zware contacten tegelijk dicht.', 'The {t:Contactor|contactor}: a coil pulls three heavy contacts shut at once.', { cue: { Magneetschakelaar: 'contactor' } }),
        B('{t:Direct inschakelen (DOL)|Direct inschakelen}: meteen vol net, {n:6} tot {n:8} keer de nominale stroom.', '{t:Direct on line (DOL)|Direct on line}: full grid at once, {n:6} to {n:8} times the rated current.', { cue: { 'Direct inschakelen (DOL)': 'dol' }, cues: ['panel'] }),
        B('Ook het volle koppel klapt er in één keer op: een ruk op koppeling en pomp.', 'The full torque hits at once too: a jolt on coupling and pump.', { cues: ['dol', 'motor'] }),
      ],
    },
    {
      id: 's2', lesson: DRV, level: 1, dur: DUR[1], still: 0.5, title: { nl: 'Waarom zo’n piek?', en: 'Why such a surge?' },
      beats: [
        B('Bij de start staat de rotor stil, maar het draaiveld draait meteen op volle snelheid.', 'At the start the rotor stands still, but the rotating field turns at full speed at once.', { cues: ['field'] }),
        B('De slip is maximaal: grote stromen in de staven, dus ook in de stator.', 'The slip is at its maximum: big currents in the bars, so in the stator too.', { cues: ['rotorC', 'stator'] }),
        B('Komt de rotor op toeren, dan zakt de slip naar een paar procent, en de stroom mee.', 'As the rotor speeds up, the slip drops to a few percent, and the current with it.', { cues: ['slipC'] }),
        B('Een paar seconden bij lichte last; bij zware last blijft de stroom langer hoog.', 'A few seconds with a light load; with a heavy load the current stays high longer.', { cues: ['slipC'] }),
      ],
    },
    {
      id: 's3', lesson: DRV, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Ster-driehoek', en: 'Star-delta' },
      beats: [
        B('De {t:Ster-driehoekschakeling|ster-driehoekschakeling} start de wikkelingen eerst in ster.', 'The {t:Star-delta starter|star-delta starter} first starts the windings in star.', { cue: { 'Ster-driehoekschakeling': 'stardelta' } }),
        B('Minder spanning per wikkeling: zo’n een derde van de stroom en het koppel.', 'Less voltage per winding: about a third of the current and the torque.', { cues: ['stardelta'] }),
        B('Bijna op toeren schakelt hij om naar driehoek, meestal met een korte stroomstoot.', 'Near full speed it switches to delta, usually with a short surge.', { cues: ['stardelta'] }),
        B('Oud en goedkoop: voor motoren die zonder veel last starten.', 'Old and cheap: for motors that start without much load.', { cues: ['stardelta'] }),
      ],
    },
    {
      id: 's4', lesson: DRV, level: 1, dur: DUR[3], still: 0.92, title: { nl: 'De softstarter', en: 'The soft starter' },
      beats: [
        B('Een {t:Softstarter|softstarter} laat de spanning in een paar seconden oplopen.', 'A {t:Soft starter|soft starter} ramps up the voltage over a few seconds.', { cue: { Softstarter: 'soft' } }),
        B('De piek zakt naar zo’n {n:3} à {n:4} keer nominaal, en de ruk wordt zacht.', 'The surge drops to about {n:3} to {n:4} times rated, and the jolt turns gentle.', { cues: ['soft'] }),
        B('Op toeren draait de motor gewoon vol: het toerental verandert niet.', 'Up to speed, the motor simply runs at full speed: the speed does not change.', { cues: ['soft', 'motor'] }),
        B('Maar minder spanning geeft veel minder koppel: zwaar belast kan hij blijven hangen.', 'But less voltage gives much less torque: under heavy load it may stall.', { cues: ['soft'] }),
      ],
    },
    {
      id: 's5', lesson: DRV, level: 1, dur: DUR[4], still: 0.92, title: { nl: 'De frequentieregelaar', en: 'The VFD' },
      beats: [
        B('Een {t:Frequentieregelaar|frequentieregelaar} maakt een nieuwe draaistroom, met een frequentie naar keuze.', 'A {t:VFD|VFD} makes a new three-phase supply, at a frequency of your choice.', { cue: { Frequentieregelaar: 'vfd' }, cues: ['panel'] }),
        B('Lagere frequentie, trager draaiveld: het toerental volgt, traploos.', 'Lower frequency, slower rotating field: the speed follows, smoothly.', { cues: ['vfd', 'motor'] }),
        B('Bij het aanlopen loopt de frequentie op tot {n:50} Hz; de stroom blijft rond nominaal.', 'When starting, the frequency rises to {n:50} Hz; the current stays near rated.', { cues: ['vfd'] }),
        B('En toch vol koppel, al vanaf een laag toerental: geen piek, geen ruk.', 'And still full torque, from low speed on: no surge, no jolt.', { cues: ['vfd'] }),
      ],
    },
    {
      id: 's6', lesson: DRV, level: 1, dur: DUR[5], still: 0.92, title: { nl: 'De breker', en: 'The crusher' },
      beats: [
        B('Een breker met een motor van {n:90} kW: nominaal zo’n {n:160} A bij {n:400} V.', 'A crusher with a {n:90} kW motor: rated about {n:160} A at {n:400} V.', { cues: ['crush'] }),
        B('Direct ingeschakeld trekt hij een paar seconden {n:1000} tot {n:1300} A.', 'Started direct on line, it draws {n:1000} to {n:1300} A for a few seconds.', { cues: ['crush'] }),
        B('Elke start laat de spanning dippen: lampen knipperen, twee regelaars vallen uit.', 'Each start dips the voltage: lights flicker, two drives trip.', { cues: ['panel'] }),
        B('Met een softstarter kan een volle breker blijven hangen; een frequentieregelaar past hier.', 'With a soft starter a full crusher may stall; a VFD is the one that fits.', { cues: ['crush'] }),
      ],
    },
    {
      id: 's7', lesson: DRV, level: 1, dur: DUR[6], still: 0.92, title: { nl: 'De pomp langzamer', en: 'The pump slower' },
      beats: [
        B('Hoeft de pomp minder te leveren, dan laat je hem langzamer draaien.', 'If the pump has to deliver less, you run it slower.', { cues: ['pump'] }),
        B('Affiniteitswetten: debiet met het toerental, druk met het kwadraat, vermogen met de derde macht.', 'Affinity laws: flow with speed, pressure with its square, power with its cube.', { cues: ['aff'] }),
        B('Op {n:80}% toerental zo’n half vermogen; de echte besparing valt lager uit.', 'At {n:80}% speed about half the power; the real saving is smaller.', { cues: ['aff'] }),
        B('Fout: een regelaar die het hele jaar op {n:50} Hz staat, voegt alleen verlies toe.', 'Mistake: a drive left at {n:50} Hz all year only adds losses.', { cues: [] }),
      ],
    },
    {
      id: 's8', lesson: DRV, level: 1, dur: DUR[7], still: 0.92, title: { nl: 'Bijwerkingen', en: 'Side effects' },
      beats: [
        B('De regelaar trekt stroom in pulsen: harmonischen vervormen de golf op het net.', 'The drive draws current in pulses: harmonics distort the wave on the supply.', { cues: ['harm'] }),
        B('Het snelle schakelen geeft storing, en kan stroom door de motorlagers jagen.', 'The fast switching causes noise and can push current through the motor bearings.', { cues: ['bearing'] }),
        B('Kleine vonkjes slaan putjes in de loopbaan; het lager gaat eerder stuk.', 'Tiny sparks pit the raceway; the bearing fails early.', { cues: ['bearing'] }),
        B('Afgeschermde kabel, filters en goede aarding: in het ontwerp, niet achteraf.', 'Shielded cable, filters and good earthing: in the design, not afterwards.', { cues: ['fix', 'cable'] }),
      ],
    },
    {
      id: 's9', lesson: DRV, level: 1, dur: DUR[8], still: 0.92, title: { nl: 'Servo, en de keuze', en: 'Servo, and the choice' },
      beats: [
        B('Een {t:Servoregelaar|servoregelaar} weet via een encoder op de as precies waar de motor staat.', 'A {t:Servo drive|servo drive} knows exactly where the motor is, through an encoder on its shaft.', { cue: { Servoregelaar: 'servo' } }),
        B('Robots, op lengte knippen, verpakken: het gaat om precisie, niet om energie.', 'Robots, cut-to-length, packaging: it is about precision, not energy.', { cues: ['servo'] }),
        B('Alleen aanlopen: direct of softstarter. Wisselend toerental: frequentieregelaar.', 'Just starting: direct on line or soft starter. Variable speed: VFD.', { cues: ['choice'] }),
        B('Tot op een tiende millimeter positioneren: een servo.', 'Positioning to a tenth of a millimetre: a servo.', { cues: ['choice'] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "·", "×", "=", "∝", "³" or units as
// symbols in the spoken text: units are written out, and the affinity laws are
// said in words ("met het kwadraat", "met de derde macht"); "3 à 4" is said
// "3 tot 4". Terms as in the film eng.power.motor (draaiveld, synchroon
// toerental, slip, typeplaatje) and the lesson (magneetschakelaar, omvormer).
// Dutch words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/voice-ab/phon.py with nl_NL-alex-medium). Dutch-only SAY rules in
// films/_kit/timeline.mjs: magneetschakelaar (singular), frequentieregelaar(s)
// and servoregelaar (stressed on "-ke-"/"-ge-" with the e of "bed"), "direct
// inschakelen" and "direct ingeschakeld" (DIrect; said "d'rect"; the other
// films' "direct na elkaar" stays) and harmonischen (said "harmonische"); no
// other film's spoken text changes. Kept out of the Dutch narration:
// affiniteitswetten (stressed on "af"; the caption names the laws),
// omschakelen (stressed on "-ke-"), stroomstoot (stressed on "stoot"), and as
// in the motor film elektromotor, centrifugaalpomp, inductiemotor. Read right:
// softstarter, encoder, ster-driehoekschakeling, aanloopstroom (not
// inschakelstroom: espeak-ng reads "-schakEl-" with the e of "bed"),
// gelijkspanning, omvormer, onderspanning, transformator, tandwielkasten.
const SAY = [
  [ // s1 direct on line
    B('Weer onze pompset. Om te starten moet de motor op het net, en dat gebeurt in de kast.',
      'Our pump set again. To start, the motor has to go onto the grid, and that happens in the cabinet.'),
    B('Daar zit een {t:Magneetschakelaar|magneetschakelaar}, een zware schakelaar die je elektrisch bedient: stroom door de spoel trekt drie contacten tegelijk dicht, één per fase.',
      'In it sits a {t:Contactor|contactor}, a heavy switch you operate electrically: current through its coil pulls three contacts shut at once, one per phase.'),
    B('Zo zet je de motor meteen op het volle net: {t:Direct inschakelen (DOL)|direct inschakelen}. Simpel en goedkoop, maar bij de start trekt hij {n:6} tot {n:8} keer zijn nominale stroom.',
      'That puts the motor straight onto the full grid: {t:Direct on line (DOL)|direct on line}. Simple and cheap, but at the start it draws {n:6} to {n:8} times its rated current.'),
    B('En het volle koppel geeft een ruk op koppeling en pomp. Bij een grote motor dipt de spanning, en slijten snaren, koppelingen en tandwielkasten.',
      'And the full torque gives a jolt on coupling and pump. With a big motor the voltage dips, and belts, couplings and gearboxes wear.'),
  ],
  [ // s2 why such a surge
    B('Waarom die piek? Bij de start staat de rotor stil, maar het draaiveld draait meteen op het synchrone toerental.',
      'Why that surge? At the start the rotor stands still, but the rotating field turns at synchronous speed straight away.'),
    B('De slip is maximaal: het veld snijdt op volle snelheid door de staven en wekt er grote stromen in op, die via de stator uit het net komen. Bijna een kortgesloten transformator.',
      'The slip is at its maximum: the field cuts through the bars at full speed and induces big currents in them, which come from the grid through the stator. Almost a short-circuited transformer.'),
    B('Komt de rotor op toeren, dan zakt de slip naar een paar procent, en de stroom mee naar nominaal.',
      'As the rotor speeds up, the slip drops to a few percent, and the current with it to rated.'),
    B('Bij een zware last duurt dat langer, en al die tijd blijft de stroom hoog.',
      'With a heavy load that takes longer, and all that time the current stays high.'),
  ],
  [ // s3 star-delta
    B('Ouder en goedkoper is de {t:Ster-driehoekschakeling|ster-driehoekschakeling}. De motor start met zijn wikkelingen in ster.',
      'Older and cheaper is the {t:Star-delta starter|star-delta starter}. The motor starts with its windings in star.'),
    B('Zo krijgt elke wikkeling minder spanning: zo’n een derde van de stroom van direct inschakelen, maar ook een derde van het koppel.',
      'That gives each winding less voltage: about a third of the direct-on-line current, but also a third of the torque.'),
    B('Bijna op toeren schakelt hij om naar driehoek, met de volle spanning. Bij het wisselen komt er meestal nog een korte piek.',
      'Near full speed it switches to delta, with the full voltage. The switch-over usually gives one more short surge.'),
    B('Goed voor motoren die licht starten, zoals een ventilator. Zwaar belast is een derde van het koppel te weinig.',
      'Good for motors that start light, like a fan. Under heavy load, a third of the torque is too little.'),
  ],
  [ // s4 soft starter
    B('Een {t:Softstarter|softstarter} laat met elektronica de spanning in een paar seconden oplopen.',
      'A {t:Soft starter|soft starter} uses electronics to ramp up the voltage over a few seconds.'),
    B('Zo blijft de aanloopstroom beperkt, meestal tot {n:3} tot {n:4} keer nominaal, en wordt de ruk een zachte aanloop.',
      'That keeps the inrush current down, usually to {n:3} to {n:4} times rated, and the jolt becomes a gentle start.'),
    B('Op toeren draait de motor gewoon zijn vaste toerental: een softstarter helpt bij het aanlopen, niet bij het regelen.',
      'Up to speed, the motor simply runs at its fixed speed: a soft starter helps with starting, not with speed control.'),
    B('En minder spanning geeft veel minder koppel: halve spanning, ruwweg een kwart van het koppel. Een machine die zwaar belast start, kan blijven hangen.',
      'And less voltage gives much less torque: half the voltage, roughly a quarter of the torque. A machine that starts under heavy load may stall.'),
  ],
  [ // s5 the VFD
    B('De {t:Frequentieregelaar|frequentieregelaar}, ook omvormer, maakt van het net eerst gelijkspanning, en daarvan met snelle schakelaars een nieuwe draaistroom, met een frequentie naar keuze.',
      'The variable frequency drive, the {t:VFD|VFD} or inverter, first turns the grid into DC, then uses fast switches to make a new three-phase supply, at a frequency of your choice.'),
    B('Het draaiveld volgt die frequentie: halve frequentie, half het synchrone toerental. Zo regel je het toerental traploos.',
      'The rotating field follows that frequency: half the frequency, half the synchronous speed. That is how you control speed smoothly.'),
    B('Bij het aanlopen voert hij de frequentie rustig op tot {n:50} hertz. De motor loopt met weinig slip, en de stroom blijft rond nominaal.',
      'When starting, it raises the frequency calmly to {n:50} hertz. The motor runs with little slip, and the current stays near rated.'),
    B('Omdat de spanning meegaat met de frequentie, geeft de motor toch vol koppel vanaf een laag toerental.',
      'Because the voltage rises with the frequency, the motor still gives full torque from low speed.'),
  ],
  [ // s6 the crusher
    B('Een voorbeeld: een breker voor steen of schroot. Zijn motor van {n:90} kilowatt trekt nominaal zo’n {n:160} ampère, bij {n:400} volt.',
      'An example: a crusher for stone or scrap. Its {n:90} kilowatt motor draws about {n:160} amps rated, at {n:400} volts.'),
    B('Direct ingeschakeld trekt hij bij elke start een paar seconden ruwweg {n:1000} tot {n:1300} ampère.',
      'Started direct on line, it draws roughly {n:1000} to {n:1300} amps for a few seconds at every start.'),
    B('De spanning in de fabriek dipt: lampen knipperen, en twee frequentieregelaars elders vallen uit op onderspanning.',
      'The plant voltage dips: lights flicker, and two drives elsewhere trip on undervoltage.'),
    B('Een softstarter haalt de piek naar {n:3} tot {n:4} keer nominaal, maar met dat lagere koppel kan een volle breker blijven hangen. De regelaar geeft vol koppel bij nominale stroom: hier past het duurdere apparaat.',
      'A soft starter cuts the surge to {n:3} to {n:4} times rated, but with that lower torque a full crusher may stall. The drive gives full torque at rated current: here the more expensive device fits.'),
  ],
  [ // s7 the pump slower
    B('De winst zit bij pompen en ventilatoren: hoeft de pomp minder te leveren, dan laat je hem langzamer draaien.',
      'The gain is in pumps and fans: if the pump has to deliver less, you run it slower.'),
    B('Dan gaat het debiet mee met het toerental, de druk met het kwadraat, en het vermogen ruwweg met de derde macht.',
      'By the affinity laws, flow goes with speed, pressure with its square, and power roughly with its cube.'),
    B('Op {n:80} procent toerental is dat zo’n half vermogen. In de praktijk valt de besparing lager uit.',
      'At {n:80} percent speed that is about half the power. In practice the saving is smaller.'),
    B('Een veelgemaakte fout: een regelaar die het hele jaar op {n:50} hertz staat. Die bespaart niets en voegt alleen een paar procent verlies toe.',
      'A common mistake: a drive left at {n:50} hertz all year. It saves nothing and only adds a few percent of losses.'),
  ],
  [ // s8 side effects
    B('Een regelaar heeft ook bijwerkingen. Hij trekt stroom in pulsen, en dat geeft harmonischen: stromen op veelvouden van {n:50} hertz, die de golf op het net vervormen.',
      'A drive also has side effects. It draws current in pulses, and that gives harmonics: currents at multiples of {n:50} hertz that distort the wave on the supply.'),
    B('Het snelle schakelen geeft storing, en kan een spanning op de motoras zetten die zich via de lagers ontlaadt.',
      'The fast switching causes noise, and can build up a voltage on the motor shaft that discharges through the bearings.'),
    B('Elk vonkje door het vet slaat een putje in de loopbaan, en het lager gaat veel eerder stuk.',
      'Each tiny spark through the grease pits the raceway, and the bearing fails much earlier.'),
    B('Afgeschermde kabels, filters en goede aarding vangen dat op, als ze in het ontwerp zitten.',
      'Shielded cables, filters and good earthing handle this, if they are designed in.'),
  ],
  [ // s9 servo, and the choice
    B('De {t:Servoregelaar|servoregelaar} heeft een encoder op de motoras: een sensor die vele keren per seconde meldt waar de as staat. Zo regelt hij positie en snelheid precies.',
      'The {t:Servo drive|servo drive} has an encoder on the motor shaft: a sensor that reports many times a second where the shaft is. That way it controls position and speed precisely.'),
    B('Denk aan robots, op lengte knippen en verpakken: het gaat om precisie, niet om energie.',
      'Think of robots, cut-to-length and packaging: it is about precision, not energy.'),
    B('Kiezen begint dus met de vraag wat de aandrijving moet doen. Alleen aanlopen: direct inschakelen, of een softstarter. Wisselend toerental: een frequentieregelaar.',
      'So choosing starts with what the drive must do. Just starting: direct on line, or a soft starter. Varying speed: a variable frequency drive.'),
    B('En positioneren tot op een tiende millimeter: een servo.',
      'And positioning to a tenth of a millimetre: a servo.'),
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
.mf-mark{fill:none;stroke:var(--fp-accent);stroke-width:2px;opacity:0}
[data-cue][data-on] .mf-mark{opacity:1}
.mf-scr{fill:none;stroke:var(--fp-accent);stroke-width:.7px;stroke-linejoin:round;stroke-linecap:round}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
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
.mf-l2{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-dasharray:9 5;stroke-linecap:round}
.mf-l3{fill:none;stroke:var(--anatomy-lo);stroke-width:2.2;stroke-dasharray:2 5;stroke-linecap:round}
.mf-ghost{fill:none;stroke:var(--anatomy-lo);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.7}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-hollow{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.mf-cu{fill:var(--fp-accent)}
.mf-cuN{fill:var(--anatomy-mid)}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line,[data-cue][data-on] .mf-l2,[data-cue][data-on] .mf-l3{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent)}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een pompset met motor, voedingskabel en een kast met een scherm dat de motorstroom tekent; de ventilator achter de kap draait op het toerental van de motor. Kaarten tonen de magneetschakelaar, de stroom en het koppel bij direct inschakelen, ster-driehoek, softstarter en frequentieregelaar, een doorsnede van de motor bij stilstand, de stromen van een breker, de affiniteitswetten, de bijwerkingen van een regelaar en een servo met een keuzetabel.',
  en: 'A pump set with a motor, its supply cable and a cabinet whose screen draws the motor current; the fan behind the cowl turns at the motor\'s speed. Cards show the contactor, the current and torque of a direct-on-line start, star-delta, soft starter and VFD, a section through the motor at standstill, the currents of a crusher, the affinity laws, the side effects of a drive and a servo with a choice table.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

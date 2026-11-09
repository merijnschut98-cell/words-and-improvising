// Dev tool, not shipped. Builds the explainer film "Het draaiveld / The
// rotating field" for two Basis lessons of Motoren, aandrijvingen en perslucht:
// eng.power.basics (topic Elektriciteit en energie in de fabriek, level 1) and
// eng.power.motors (topic Elektromotoren, level 1).
//
//   node films/eng.power.motor/build.mjs            build the page
//   node films/eng.power.motor/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.power.motor.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.power). The plan row lists the lessons "basics" and "motors"; both ids
// still exist after the topics x levels rebuild (eng.power.basics,
// eng.power.motors), so no mapping was needed.
//
// The drawing is the pump set of the film eng.maintenance.failure (the same
// parts and camera, so the motor is the same motor): a centrifugal pump with
// its volute, discharge flange and bearing frame (its oil sight glass left out), a coupling guard, and an
// electric motor with fins, terminal box, fan cowl and now a nameplate. Its
// supply cable leaves the terminal box gland and drops into a floor duct. The
// condition panel of that film is here the energy meter on its pedestal: its
// screen draws the power (kW) as a line and fills the energy (kWh) under it.
// Cards in stage space carry the meter's two readings, the efficiency chain of
// the cooling-water pump, the three phase voltages, the power-factor triangle,
// a section through the motor (stator slots with the three phase currents, the
// field arrow, the cage rotor slipping behind it), the speed sums, the
// nameplate and the IE comparison; the example cards are labelled "voorbeeld".
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
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Facts checked against: IEC 60034-30-1 (IE1 to IE5; for a
// 4-pole 30 kW motor at 50 Hz the IE3 minimum is 93,6 % and IE1 about 90,7 %,
// so "zo'n 90 %" as in the lesson); Commission Regulation (EU) 2019/1781 (IE3
// for most new 0,75–1.000 kW motors from 1 July 2021, IE4 for most 75–200 kW
// motors from 1 July 2023); synchronous speed n = 120 f / p with p the number
// of poles; slip s = (ns − n) / ns, typically 1 to 5 %; insulation class F =
// 155 °C (IEC 60085), and the 10 °C halving of insulation life as a rule of
// thumb (Montsinger), hedged as such in the lesson and the film.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// basics: 15 kW for 8 h = 120 kWh
const KW = 15;
const HRS = 8;
assert(KW * HRS === 120, '15 × 8 = 120 kWh');
// basics: the cooling-water pump, 11 kW hydraulic, pump 70 %, motor 92 %, 6.000 h, €0,15
const HYD = 11;
const ETA_P = 0.70;
const ETA_M = 0.92;
const YEAR_H = 6000;
const P_IN = HYD / (ETA_P * ETA_M);
const P_SHAFT = HYD / ETA_P;
assert(near(P_IN, 17.1, 0.05), '11 / (0,70 × 0,92) = 17,1 kW');
const E_YEAR = Math.round(Math.round(P_IN * 10) * YEAR_H / 10);
assert(E_YEAR === 102600, '17,1 × 6.000 = 102.600 kWh');
assert(near(E_YEAR * 0.15, 15400, 50), 'about €15.400 a year');
// basics: three-phase, √3 × 400 × 30 × 0,85 = 17,7 kW
const U_LL = 400;
const U_LN = 230;
const AMPS = 30;
const PF = 0.85;
assert(near(Math.sqrt(3) * U_LL * AMPS * PF / 1000, 17.7, 0.05), '√3 × 400 × 30 × 0,85 = 17,7 kW');
assert(near(U_LL / Math.sqrt(3), U_LN, 1), '400 / √3 ≈ 230 V');
// motors: ns = 120 f / p; 4 poles at 50 Hz = 1.500; 2 → 3.000, 6 → 1.000
const HZ = 50;
const ns = (poles) => (120 * HZ) / poles;
assert(ns(4) === 1500 && ns(2) === 3000 && ns(6) === 1000, '120 × 50 / p');
// motors: the fan motor, 30 kW at 1.470 rpm: slip 2 %, torque 195 Nm
const P_FAN = 30;
const N_FAN = 1470;
const SLIP = (ns(4) - N_FAN) / ns(4);
assert(near(SLIP, 0.02, 1e-9), 'slip (1.500 − 1.470) / 1.500 = 2 %');
const TORQUE = P_FAN * 9550 / N_FAN;
assert(Math.round(TORQUE) === 195, '30 × 9.550 / 1.470 = 195 Nm');
// motors: IE1 about 90 % → IE3 about 93,6 % at 25 kW shaft, 6.000 h, €0,15
const SHAFT = 25;
const IN1 = SHAFT / 0.90;
const IN3 = SHAFT / 0.936;
assert(near(IN1, 27.8, 0.05) && near(IN3, 26.7, 0.05), '27,8 and 26,7 kW');
const SAVE = IN1 - IN3;
assert(near(SAVE, 1.1, 0.05), 'saving 1,1 kW');
assert(near(SAVE * YEAR_H, 6400, 50) && near(Math.round(SAVE * YEAR_H / 100) * 100 * 0.15, 960, 0.5), 'about 6.400 kWh, €960');
// the drawn power-factor triangle: active and reactive parts of the 30 A
const Q_SHARE = Math.sqrt(1 - PF * PF);
assert(near(Q_SHARE, 0.527, 0.001), 'sin φ at cos φ 0,85');

// ---------------------------------------------------------------- the world (as the figure)
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
const PLATE_AT = at([(PLATE.x0 + PLATE.x1) / 2, PLATE.y, (PLATE.z0 + PLATE.z1) / 2]);
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  // a marker for the nameplate: at the chart scenes' camera the pump set is about 60 px wide at 390 px,
  // so a lit plate alone is a dot; stage.js keeps the ring a fixed size on screen
  `<g data-cue="plate"><circle class="mf-mark" data-k="mk-plate" cx="${PLATE_AT[0].toFixed(1)}" cy="${PLATE_AT[1].toFixed(1)}" r="0"/></g>`,
].join('');


// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('meter', g('mtBase', '') + cue('kw', g('mtKw', '')) + cue('kwh', g('mtKwh', '')) + g('mtSum', '')),
  g('chain', g('chBase', '') + cue('chain', g('chIn', '')) + g('chYear', '')),
  g('waves', g('wvBase', '') + cue('waves', g('wvIn', '')) + g('wvTxt', '')),
  g('pf', g('pfBase', '') + cue('pfC', g('pfIn', '')) + g('pfSum', '')),
  g('sect', g('scBase', '') + cue('stator', g('scStator', '')) + cue('rotorC', g('scRotor', '')) + cue('field', g('scField', ''))
    + cue('slipC', g('scSlip', '')) + cue('syncC', g('scSync', '')) + g('scSide', '')),
  g('plateK', g('plBase', '') + cue('plateC', g('plIn', '')) + cue('isol', g('plIsol', ''))),
  g('ie', g('ieBase', '') + cue('ieC', g('ieLadder', '')) + g('ieIn', '')),
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
  { from: cam([-4, -6, 26], 660), to: cam([-4, -6, 24], 1900, 104), a: 0.4, b: 0.55 },
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
const BAS = 'eng.power.basics';
const MOT = 'eng.power.motors';
const DUR = [34, 30, 30, 30, 32, 30, 32, 36, 32];
const C = {
  ZC, COWL_X, PLOT, KW, HRS, HYD, ETA_P, ETA_M, P_IN, P_SHAFT, YEAR_H, U_LL, U_LN, AMPS, PF, Q_SHARE,
  P_FAN, N_FAN, SLIP, TORQUE, IN1, IN3, SAVE, KS, dur: DUR,
};
const spec = {
  id: 'eng.power.motor',
  title: { nl: 'Het draaiveld', en: 'The rotating field' },
  lessons: [BAS, MOT],
  scenes: [
    {
      id: 's1', lesson: BAS, level: 1, dur: DUR[0], still: 0.92, title: { nl: 'Een motor aan het werk', en: 'A motor at work' },
      beats: [
        { nl: 'Een pompset: de elektromotor draait de pomp. De stroom komt binnen via de kabel.', en: 'A pump set: the electric motor turns the pump. The power comes in through the cable.', cues: ['motor', 'cable'] },
        { nl: 'Een meter in de kast telt mee. Hij laat twee verschillende dingen zien.', en: 'A meter in the cabinet keeps count. It shows two different things.', cues: ['panel'] },
        { nl: '{t:kW|kW}: vermogen, hoe snel de motor op dit moment energie gebruikt.', en: '{t:kW|kW}: power, how fast the motor uses energy at this moment.', cue: { kW: 'kw' }, cues: ['panel'] },
        { nl: '{t:kWh|kWh}: energie, vermogen maal tijd. {n:15} kW, {n:8} uur: {n:120} kWh.', en: '{t:kWh|kWh}: energy, power times time. {n:15} kW for {n:8} hours: {n:120} kWh.', cue: { kWh: 'kwh' }, cues: ['panel'] },
      ],
    },
    {
      id: 's2', lesson: BAS, level: 1, dur: DUR[1], still: 0.92, title: { nl: 'Van stopcontact tot water', en: 'From socket to water' },
      beats: [
        { nl: 'Een koelwaterpomp moet {n:11} kW in het water stoppen, {n:6000} uur per jaar.', en: 'A cooling-water pump must put {n:11} kW into the water, {n:6000} hours a year.', cues: ['pump'] },
        { nl: '{t:Rendement|Rendement}: nuttig eruit gedeeld door erin. Pomp {n:70}%, motor {n:92}%.', en: '{t:Efficiency|Efficiency}: useful output divided by input. Pump {n:70}%, motor {n:92}%.', cue: { Rendement: 'chain' } },
        { nl: 'Verliezen vermenigvuldigen zich: {n:11} / ({n:0.70} × {n:0.92}) = {n:17.1} kW uit het net.', en: 'Losses multiply: {n:11} / ({n:0.70} × {n:0.92}) = {n:17.1} kW from the grid.', cues: ['chain', 'motor'] },
        { nl: 'Per jaar {n:102600} kWh, zo’n €{n:15400}: waarschijnlijk meer dan de pomp kostte.', en: '{n:102600} kWh a year, about €{n:15400}: probably more than the pump cost.', cues: [] },
      ],
    },
    {
      id: 's3', lesson: BAS, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Drie fasen', en: 'Three phases' },
      beats: [
        { nl: '{t:Draaistroom|Draaistroom}: drie draden, elk met een wisselspanning van {n:50} Hz.', en: '{t:Three-phase|Three-phase}: three wires, each with an alternating voltage at {n:50} Hz.', cue: { Draaistroom: 'cable' }, cues: ['waves'] },
        { nl: 'Elke fase komt een derde periode na de vorige.', en: 'Each phase comes a third of a cycle after the one before.', cues: ['waves'] },
        { nl: '{n:400} V tussen twee fasen, {n:230} V tussen een fase en de nul.', en: '{n:400} V between two phases, {n:230} V between a phase and neutral.', cues: ['waves'] },
        { nl: 'In de motor maken de drie stromen samen een veld dat ronddraait.', en: 'In the motor, the three currents together make a field that turns.', cues: ['motor'] },
      ],
    },
    {
      id: 's4', lesson: BAS, level: 1, dur: DUR[3], still: 0.92, title: { nl: 'Nuttige stroom', en: 'Useful current' },
      beats: [
        { nl: 'Niet alle stroom doet werk: een deel bouwt alleen het magnetisch veld op.', en: 'Not all the current does work: part of it only builds the magnetic field.', cues: ['motor'] },
        { nl: '{t:Arbeidsfactor|Arbeidsfactor}, cos φ: het nuttige deel. Vol belast zo’n {n:0.8} à {n:0.9}.', en: '{t:Power factor|Power factor}, cos φ: the useful share. Fully loaded about {n:0.8} to {n:0.9}.', cue: { Arbeidsfactor: 'pfC' } },
        { nl: '√3 × {n:400} V × {n:30} A × {n:0.85} = {n:17.7} kW opgenomen vermogen.', en: '√3 × {n:400} V × {n:30} A × {n:0.85} = {n:17.7} kW drawn.', cues: ['pfC'] },
        { nl: 'Licht belast zakt de cos φ ver: meer stroom voor hetzelfde werk.', en: 'Lightly loaded, cos φ drops far: more current for the same work.', cues: ['pfC'] },
      ],
    },
    {
      id: 's5', lesson: MOT, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Het draaiveld', en: 'The rotating field' },
      beats: [
        { nl: 'De {t:Asynchrone motor|asynchrone motor}: de standaardmotor voor pompen, ventilatoren en banden.', en: 'The {t:Induction motor|induction motor}: the standard motor for pumps, fans and conveyors.', cue: { 'Asynchrone motor': 'motor' } },
        { nl: 'Binnenin de stator: het vaste buitendeel, met koperen wikkelingen in groeven.', en: 'Inside, the stator: the fixed outer part, with copper windings in slots.', cues: ['stator'] },
        { nl: 'De drie fasestromen pieken om de beurt, en het veld draait rond.', en: 'The three phase currents peak in turn, and the field turns round.', cues: ['field'] },
        { nl: 'Hoe snel? Dat hangt af van de netfrequentie en het aantal polen: {n:2}, {n:4}, {n:6} of meer.', en: 'How fast? That depends on the grid frequency and the number of poles: {n:2}, {n:4}, {n:6} or more.', cues: ['field'] },
      ],
    },
    {
      id: 's6', lesson: MOT, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'De rotor blijft achter', en: 'The rotor lags behind' },
      beats: [
        { nl: 'De {t:Rotor|rotor}: het draaiende deel op de as, met staven als een kooi.', en: 'The {t:Rotor|rotor}: the turning part on the shaft, with bars like a cage.', cue: { Rotor: 'rotorC' } },
        { nl: 'Het veld snijdt door de staven, wekt er stroom in op en sleept de rotor mee.', en: 'The field cuts through the bars, induces a current and drags the rotor along.', cues: ['field', 'rotorC'] },
        { nl: 'De rotor draait altijd iets langzamer: de {t:Slip|slip}, meestal {n:1} tot {n:5}%.', en: 'The rotor always turns a little slower: the {t:Slip|slip}, typically {n:1} to {n:5}%.', cue: { Slip: 'slipC' } },
        { nl: 'Zonder slip geen stroom in de staven en geen koppel. Meer last, meer slip.', en: 'Without slip, no current in the bars and no torque. More load, more slip.', cues: ['slipC'] },
      ],
    },
    {
      id: 's7', lesson: MOT, level: 1, dur: DUR[6], still: 0.92, title: { nl: '1.500 tegen 1.470', en: '1,500 against 1,470' },
      beats: [
        { nl: '{t:Synchroon toerental|Synchroon toerental}: {n:120} × {n:50} / {n:4} = {n:1500} toeren per minuut.', en: '{t:Synchronous speed|Synchronous speed}: {n:120} × {n:50} / {n:4} = {n:1500} rpm.', cue: { 'Synchroon toerental': 'syncC' } },
        { nl: 'Met {n:2} polen {n:3000} toeren, met {n:6} polen {n:1000}.', en: 'With {n:2} poles {n:3000} rpm, with {n:6} poles {n:1000}.', cues: ['syncC'] },
        { nl: 'Het plaatje zegt {n:1470}: slip ({n:1500} − {n:1470}) / {n:1500} = {n:2}%.', en: 'The plate says {n:1470}: slip ({n:1500} − {n:1470}) / {n:1500} = {n:2}%.', cues: ['slipC'] },
        { nl: 'Koppel {n:30} × {n:9550} / {n:1470} = {n:195} Nm. Duidelijk langzamer: waarschijnlijk overbelast.', en: 'Torque {n:30} × {n:9550} / {n:1470} = {n:195} Nm. Clearly slower: probably overloaded.', cues: ['motor'] },
      ],
    },
    {
      id: 's8', lesson: BAS, level: 1, dur: DUR[7], still: 0.92, title: { nl: 'Het typeplaatje', en: 'The nameplate' },
      beats: [
        { nl: 'Het {t:Typeplaatje|typeplaatje}: het metalen plaatje op de motor. Het vertelt bijna alles.', en: 'The {t:Nameplate|nameplate}: the metal plate on the motor. It tells you almost everything.', cue: { Typeplaatje: 'plate' }, cues: ['plateC'] },
        { nl: '{n:30} kW is het nominaal vermogen aan de as, niet wat hij uit het net trekt.', en: '{n:30} kW is the rated power at the shaft, not what it draws from the grid.', cues: ['plateC'] },
        { nl: 'Verder spanning, stroom, toerental, cos φ en de klasse van het rendement.', en: 'Then voltage, current, speed, cos φ and the efficiency class.', cues: ['plateC'] },
        { nl: '{t:Isolatieklasse|Isolatieklasse} F: de wikkeling is gemaakt voor {n:155} °C.', en: '{t:Insulation class|Insulation class} F: the winding is made for {n:155} °C.', cue: { Isolatieklasse: 'isol' } },
        { nl: 'Vuistregel: elke {n:10} °C te warm halveert ruwweg de levensduur.', en: 'Rule of thumb: every {n:10} °C too hot roughly halves its life.', cues: ['isol', 'motor'] },
      ],
    },
    {
      id: 's9', lesson: MOT, level: 1, dur: DUR[8], still: 0.92, title: { nl: 'De IE-klasse', en: 'The IE class' },
      beats: [
        { nl: 'De {t:IE-klasse|IE-klasse}: het rendement in klassen, van IE1 tot IE5 (IEC 60034-30-1).', en: 'The {t:IE class|IE class}: efficiency in classes, from IE1 to IE5 (IEC 60034-30-1).', cue: { 'IE-klasse': 'ieC' } },
        { nl: 'EU: minstens IE3 voor de meeste nieuwe motoren van {n:0.75} tot {n:1000} kW, sinds 2021.', en: 'EU: at least IE3 for most new motors from {n:0.75} to {n:1000} kW, since 2021.', cues: ['ieC'] },
        { nl: '{n:25} kW aan de as: IE1, zo’n {n:90}%, neemt {n:27.8} kW op; IE3, {n:93.6}%, {n:26.7} kW.', en: '{n:25} kW at the shaft: IE1, about {n:90}%, draws {n:27.8} kW; IE3, {n:93.6}%, {n:26.7} kW.', cues: [] },
        { nl: '{n:1.1} kW × {n:6000} uur ≈ {n:6400} kWh, €{n:960} per jaar: de moeite als hij stukgaat.', en: '{n:1.1} kW × {n:6000} hours ≈ {n:6400} kWh, €{n:960} a year: worth it when it fails.', cues: ['motor'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&" or "·" in the spoken text; kW and kWh
// are written out (kilowatt, kilowattuur) because espeak-ng spells them as
// letters in both languages; √3 is said as "wortel drie", cos φ as "cos phi".
// Dutch words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/speak.py): IE1 to IE5 (read as the vowel "ie"), typeplaatje,
// isolatieklasse and draaistroom (stress on the wrong part) get Dutch spoken
// forms in films/_kit/timeline.mjs (SAY); rendementsklasse, energierekening,
// centrifugaalpomp, inductiemotor, achterna, industrie, elektromotor,
// momentopname, fasestromen, binnenin, ventilatormotor, vuistregel, levensduur,
// kapotgaat and hetzelfde (stress on the wrong syllable) are kept out of the
// Dutch narration.
const SAY = [
  [ // s1 a motor at work
    { nl: 'Een pompset, zoals in elke fabriek: een elektrische motor draait via een koppeling een pomp. De energie komt binnen via een kabel.',
      en: 'A pump set, as in every plant: an electric motor turns a pump through a coupling. The energy comes in through a cable.' },
    { nl: 'De meter in de kast laat twee dingen zien, en die worden vaak door elkaar gehaald.',
      en: 'The meter in the cabinet shows two things, and they are often mixed up.' },
    { nl: 'Het eerste is het vermogen, in kilowatt: hoe snel de motor nu energie gebruikt. Het is de stand van nu, zoals een snelheidsmeter.',
      en: 'The first is power, in kilowatts: how fast the motor uses energy right now. A snapshot, like a speedometer.' },
    { nl: 'Het tweede is de energie, in kilowattuur: vermogen maal tijd, opgeteld. {n:8} uur lang {n:15} kilowatt is {n:120} kilowattuur. De rekening telt kilowattuur; de aansluiting en de piek gaan over kilowatt.',
      en: 'The second is energy, in kilowatt hours: power times time, added up. {n:8} hours at {n:15} kilowatts is {n:120} kilowatt hours. The bill counts kilowatt hours; the connection and the peak are about kilowatts.' },
  ],
  [ // s2 from socket to water
    { nl: 'Deze koelwaterpomp moet {n:11} kilowatt in het water stoppen, {n:6000} uur per jaar.',
      en: 'This cooling-water pump must put {n:11} kilowatts into the water, {n:6000} hours a year.' },
    { nl: '{t:Rendement|Rendement} is wat er nuttig uitkomt, gedeeld door wat erin gaat; de rest wordt warmte. De pomp haalt {n:70} procent, de motor {n:92}.',
      en: '{t:Efficiency|Efficiency} is the useful output divided by the input; the rest becomes heat. The pump reaches {n:70} percent, the motor {n:92}.' },
    { nl: 'In een keten vermenigvuldigen de verliezen zich: {n:11} gedeeld door {n:0.70}, en nog eens door {n:0.92}, geeft {n:17.1} kilowatt uit het net.',
      en: 'Along a chain the losses multiply: {n:11} divided by {n:0.70}, and again by {n:0.92}, gives {n:17.1} kilowatts from the grid.' },
    { nl: 'Dat is {n:102600} kilowattuur per jaar, zo’n {n:15400} euro: waarschijnlijk meer dan de pomp kostte.',
      en: 'That is {n:102600} kilowatt hours a year, about {n:15400} euros: probably more than the pump cost.' },
  ],
  [ // s3 three phases
    { nl: 'De fabriek draait op {t:Draaistroom|draaistroom}: drie draden, elk met een spanning die {n:50} keer per seconde heen en weer gaat: {n:50} hertz.',
      en: 'Industry runs on {t:Three-phase|three-phase} power: three wires, each with a voltage that swings back and forth {n:50} times a second: {n:50} hertz.' },
    { nl: 'Elke fase komt een derde periode na de vorige.',
      en: 'Each phase comes a third of a cycle after the one before.' },
    { nl: 'Tussen twee fasen staat {n:400} volt, tussen een fase en de nul {n:230}. Een motor gebruikt alle drie de fasen.',
      en: 'Between two phases there are {n:400} volts, between a phase and neutral {n:230}. A motor uses all three phases.' },
    { nl: 'In de wikkelingen maken die drie verschoven stromen samen een magnetisch veld dat ronddraait.',
      en: 'In the windings, those three shifted currents together make a magnetic field that turns.' },
  ],
  [ // s4 useful current
    { nl: 'Niet alle stroom doet werk: een deel bouwt alleen het magnetisch veld op.',
      en: 'Not all the current does work: part of it only builds up the magnetic field.' },
    { nl: 'De {t:Arbeidsfactor|arbeidsfactor}, of cos phi, is het nuttige deel: vol belast zo’n {n:0.8} tot {n:0.9}.',
      en: 'The {t:Power factor|power factor}, or cos phi, is the useful share: fully loaded about {n:0.8} to {n:0.9}.' },
    { nl: 'Het vermogen is wortel drie maal spanning, stroom en arbeidsfactor. Bij {n:400} volt, {n:30} ampère en {n:0.85} is dat zo’n {n:17.7} kilowatt.',
      en: 'The power is root three times voltage, current and power factor. At {n:400} volts, {n:30} amps and {n:0.85}, that is about {n:17.7} kilowatts.' },
    { nl: 'Licht belast zakt de arbeidsfactor ver: meer stroom voor even veel werk, dus dikkere kabels.',
      en: 'Lightly loaded, the power factor drops far: more current for the same work, so thicker cables.' },
  ],
  [ // s5 the rotating field
    { nl: 'Bijna elke pomp, ventilator en transportband draait op een {t:Asynchrone motor|asynchrone motor}, of kooiankermotor: robuust, goedkoop en weinig onderhoud.',
      en: 'Almost every pump, fan and conveyor runs on an {t:Induction motor|induction motor}, or squirrel-cage motor: robust, cheap and low on maintenance.' },
    { nl: 'In doorsnede: het vaste buitendeel is de stator, met koperen wikkelingen in de groeven, een set per fase.',
      en: 'In cross-section: the fixed outer part is the stator, with copper windings in its slots, one set per phase.' },
    { nl: 'De stromen in de drie fasen pieken om de beurt, dus het magnetisch veld schuift steeds op en draait rond. Er beweegt niets, en toch draait het veld.',
      en: 'The three phase currents peak in turn, so the magnetic field keeps shifting and turns round. Nothing moves, and yet the field turns.' },
    { nl: 'Hoe snel, hangt af van de netfrequentie en het aantal polen: {n:2}, {n:4}, {n:6} of meer.',
      en: 'How fast depends on the grid frequency and the number of poles: {n:2}, {n:4}, {n:6} or more.' },
  ],
  [ // s6 the rotor lags behind
    { nl: 'In de stator draait de {t:Rotor|rotor} op de as: stalen plaatjes met staven erdoor, aan de uiteinden verbonden door ringen: een kooi.',
      en: 'Inside, the {t:Rotor|rotor} turns on the shaft: steel sheets with bars through them, joined at the ends by rings: a cage.' },
    { nl: 'Het draaiveld snijdt door de staven en wekt er stroom in op. Die stroom maakt een eigen veld, en zo sleept het veld de rotor mee.',
      en: 'The rotating field cuts through the bars and induces a current in them. That current makes a field of its own, and so the rotor is dragged along.' },
    { nl: 'Maar hij haalt het veld nooit in. Het verschil heet de {t:Slip|slip}, meestal {n:1} tot {n:5} procent. Daarom heet de motor asynchroon.',
      en: 'But it never catches the field. The difference is called the {t:Slip|slip}, typically {n:1} to {n:5} percent. That is why the motor is called asynchronous.' },
    { nl: 'Zonder slip geen stroom in de staven, en geen koppel. Hoe zwaarder de last, hoe meer slip.',
      en: 'Without slip, no current in the bars and no torque. The heavier the load, the more slip.' },
  ],
  [ // s7 1.500 against 1.470
    { nl: 'Het veld draait met het {t:Synchroon toerental|synchrone toerental}: {n:120} maal de frequentie, gedeeld door het aantal polen. Bij {n:50} hertz en {n:4} polen: {n:1500} toeren per minuut.',
      en: 'The field turns at the {t:Synchronous speed|synchronous speed}: {n:120} times the frequency, divided by the number of poles. At {n:50} hertz and {n:4} poles: {n:1500} revolutions per minute.' },
    { nl: 'Twee polen geven {n:3000} toeren, zes polen {n:1000}.',
      en: 'Two poles give {n:3000} rpm, six poles {n:1000}.' },
    { nl: 'Op het plaatje van deze motor staat {n:1470}. Het verschil, gedeeld door {n:1500}, is een slip van {n:2} procent.',
      en: 'The plate of this fan motor says {n:1470}. The difference, divided by {n:1500}, is a slip of {n:2} percent.' },
    { nl: 'Het koppel: {n:30} kilowatt maal {n:9550}, gedeeld door {n:1470}, is {n:195} newtonmeter. Draait een motor duidelijk langzamer dan zijn plaatje, dan is hij waarschijnlijk overbelast.',
      en: 'The torque: {n:30} kilowatts times {n:9550}, divided by {n:1470}, is {n:195} newton metres. If a motor runs clearly slower than its plate, it is probably overloaded.' },
  ],
  [ // s8 the nameplate
    { nl: 'Het {t:Typeplaatje|typeplaatje} op de behuizing vertelt bijna alles over de motor.',
      en: 'The {t:Nameplate|nameplate} on the housing tells you almost everything about the motor.' },
    { nl: 'Eerst het nominaal vermogen, {n:30} kilowatt: het vermogen aan de as, niet wat hij uit het net trekt.',
      en: 'First the rated power, {n:30} kilowatts: the power at the shaft, not what it draws from the grid.' },
    { nl: 'Dan spanning, stroom, toerental, arbeidsfactor en rendement. Een stroomtang om één kabel geeft de echte stroom.',
      en: 'Then voltage, current, speed, power factor and efficiency. A clamp meter round one cable gives the real current.' },
    { nl: 'Onderaan de {t:Isolatieklasse|isolatieklasse}: de hoogste temperatuur voor de isolatie van de wikkeling. Klasse F staat voor {n:155} graden.',
      en: 'At the bottom, the {t:Insulation class|insulation class}: the highest temperature for the winding insulation. Class F stands for {n:155} degrees.' },
    { nl: 'Een gangbare regel: elke {n:10} graden te warm, en de wikkeling gaat ruwweg half zo lang mee.',
      en: 'As a rule of thumb, every {n:10} degrees too hot roughly halves the life of the winding.' },
  ],
  [ // s9 the IE class
    { nl: 'Op het plaatje staat ook de {t:IE-klasse|IE-klasse}: het rendement in klassen, van IE1 tot IE5.',
      en: 'The plate also shows the {t:IE class|IE class}: efficiency in classes, from IE1 to IE5.' },
    { nl: 'In de EU moeten de meeste nieuwe motoren van {n:0.75} tot {n:1000} kilowatt sinds 2021 minstens IE3 zijn; van {n:75} tot {n:200} kilowatt meestal IE4.',
      en: 'In the EU, most new motors from {n:0.75} to {n:1000} kilowatts must be at least IE3 since 2021; from {n:75} to {n:200} kilowatts mostly IE4.' },
    { nl: 'Een oude IE1 met zo’n {n:90} procent neemt voor {n:25} kilowatt aan de as {n:27.8} kilowatt op. Een IE3 met {n:93.6} procent neemt {n:26.7}.',
      en: 'An old IE1 at about {n:90} percent, delivering {n:25} kilowatts at the shaft, draws {n:27.8} kilowatts. An IE3 at {n:93.6} percent draws {n:26.7}.' },
    { nl: 'Dat scheelt {n:1.1} kilowatt, over {n:6000} uur zo’n {n:6400} kilowattuur: {n:960} euro per jaar. De moeite waard als de oude het begeeft, zelden om een gezonde te vervangen.',
      en: 'That saves {n:1.1} kilowatts, over {n:6000} hours about {n:6400} kilowatt hours: {n:960} euros a year. Worth it when the old one fails, rarely to replace a healthy one.' },
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
.mf-glass{fill:var(--anatomy-shade-0);stroke:none}
.mf-well{fill:var(--anatomy-shade-0);stroke:none}
.mf-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mf-mark{fill:none;stroke:var(--fp-accent);stroke-width:2px;opacity:0}
[data-cue][data-on] .mf-mark{opacity:1}
.mf-scr{fill:none;stroke:var(--fp-accent);stroke-width:.7px;stroke-linejoin:round;stroke-linecap:round}
.mf-area{fill:color-mix(in srgb,var(--fp-accent) 32%,transparent);stroke:none}
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
.mf-cu{fill:var(--fp-accent)}
.mf-cuN{fill:var(--anatomy-mid)}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line,[data-cue][data-on] .mf-l2,[data-cue][data-on] .mf-l3{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent)}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een pompset met elektromotor, voedingskabel en een energiemeter die vermogen en energie tekent. Kaarten tonen de meterwaarden, de rendementsketen, de drie fasen, de arbeidsfactor, een doorsnede van de motor met draaiveld en kooirotor, de toerentallen, het typeplaatje en twee IE-klassen.',
  en: 'A pump set with an electric motor, its supply cable and an energy meter that draws power and energy. Cards show the meter readings, the efficiency chain, the three phases, the power factor, a section through the motor with the rotating field and cage rotor, the speeds, the nameplate and two IE classes.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

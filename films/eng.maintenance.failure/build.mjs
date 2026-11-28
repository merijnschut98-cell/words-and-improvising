// Dev tool, not shipped. Builds the explainer film "Hoe machines falen / How
// machines fail" for the topic Onderhoudsstrategieën of Onderhoud: strategies
// (level 1), failure (level 2) and condition (level 3).
//
//   node films/eng.maintenance.failure/build.mjs            build the page
//   node films/eng.maintenance.failure/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.maintenance.failure.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// The drawing is the world of the figure eng.maintenance.pf (same parts, same
// camera): a pump set on a grouted plinth (a centrifugal pump with its volute,
// discharge flange and bearing frame with an oil sight glass, a coupling guard,
// an electric motor with fins, terminal box and fan cowl, a measuring stud on
// the drive-end bearing) and a condition panel on a pedestal whose screen
// draws the bearing's vibration curve from new to failure. The film follows
// that one bearing: it breaks down (run to failure), is swapped on a calendar,
// is measured against a limit, and its trend is forecast into a planned stop.
// Cards in stage space carry the four strategies as four timelines of the same
// bearing, the two assets of the stamping plant, the bathtub curve, the servo
// bearings' year, the Weibull shapes, the P-F curve with the five methods and
// the pump's monthly trend; every card is labelled "voorbeeld".
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
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Sources as in the lessons: Nowlan and Heap, Reliability-
// Centered Maintenance (United Airlines, 1978) for the age patterns; the
// Weibull shape factor as the reliability module uses it (below 1 falling,
// about 1 constant, above 1 rising failure rate); ISO 10816-3 / 20816-3 for
// 2,8 and 4,5 mm/s RMS (group 2, rigid base); the P-F interval and the
// half-interval rule of thumb as in Moubray, RCM II.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// strategies: the bottleneck gearbox €60.000 and 10 weeks; conveyor motors €400, 15 min; 85 % planned
const GEARBOX = 60000;
const LEAD_WK = 10;
const CONVEYOR = 400;
const SWAP_MIN = 15;
const PLANNED = 85;
assert(GEARBOX / CONVEYOR === 150 && LEAD_WK * 7 * 24 * 60 > 1000 * SWAP_MIN, 'the two assets sit far apart in cost and downtime');
// failure: 11 % wear with age, 89 % not, 68 % early
const WEAR = 11;
const EARLY = 68;
assert(WEAR + 89 === 100 && EARLY < 89, 'Nowlan and Heap: 11 + 89, 68 early');
// failure: 24 servo axes × €750 = €18.000 a year; 6 failures before, 9 after, 5 of those within two weeks
const AXES = 24;
const BEARING = 750;
const PER_YEAR = AXES * BEARING;
const BEFORE = 6;
const AFTER = 9;
const SOON = 5;
const NEXT = 3;
assert(PER_YEAR === 18000, '24 × 750 = 18.000');
assert(AFTER > BEFORE && SOON <= AFTER && SOON / AFTER > 0.5, 'more failures, most soon after a swap');
assert(NEXT < BEFORE, 'next year fewer than before');
// condition: P-F 8 weeks → inspect every 4; vibration sees 10 weeks, a route every 12 → 83 %
const PF_RULE = 8;
assert(PF_RULE / 2 === 4, 'half the P-F interval');
const TECH = [['us', 12], ['vib', 10], ['oil', 6], ['ir', 4], ['hand', 1]];
assert(TECH.every(([, w], i) => i === 0 || w < TECH[i - 1][1]), 'the methods in the order they see the defect');
assert(Math.round((10 / 12) * 100) === 83, '10 / 12 = 83 %');
// condition: monthly trend 1,8 1,9 2,6 3,4 mm/s; about 0,8 a month; (4,5 − 3,4) / 0,8 = 1,4 months ≈ six weeks
const TREND = [1.8, 1.9, 2.6, 3.4];
const WARN = 2.8;
const ACT = 4.5;
const RATE = 0.8;
assert(near((TREND[3] - TREND[1]) / 2, RATE, 0.051), 'about 0,8 a month (1,5 in two months)');
const MONTHS = (ACT - TREND[3]) / RATE;
assert(near(MONTHS, 1.4, 0.03) && near(MONTHS * 4.35, 6, 0.1), '1,4 months, about six weeks');
// the figure's bearing curve: defect from week 15, measurable (P) at 25, functional failure (F) at 35
const WEEKS = 40;
const F_WK = 35;
const PF = 10;
const P_WK = F_WK - PF;
const T0 = 15;
const V0 = 1.2;
const DRIFT = 0.01;
const V_F = 11;
const base = (t) => V0 + DRIFT * t;
const ratio = (V_F - base(F_WK)) / (ACT - base(P_WK));
const TAU = PF / Math.log(ratio - 1);
const AMP = (ACT - base(P_WK)) / (Math.exp((P_WK - T0) / TAU) - 1);
const level = (t) => base(t) + (t > T0 ? AMP * (Math.exp((t - T0) / TAU) - 1) : 0);
assert(near(level(P_WK), ACT, 1e-9) && near(level(F_WK), V_F, 1e-9), 'the curve meets P and F');
assert(TECH[1][1] === PF, 'the curve\'s P is the vibration P');

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
const STUD = [4, 0, ZC + 12];

const FIT = [
  ...k.boxCorners(PLINTH, FLOOR, 0),
  ...k.boxCorners({ x: -28, y: -47, w: 56, d: 10 }, FLOOR, BOX_Z[1] + 2),
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
// the measuring stud, the oil sight glass or the panel.
const cueOf = (name) => (/^motor\.stud/.test(name) ? 'stud'
  : /^motor\.(tbox|lid|neck|gland|plug)/.test(name) ? 'tbox'
    : /^motor\./.test(name) ? 'motor'
      : /^pump\.sight/.test(name) ? 'sight'
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
  discAt('motor.plug', FG, 2.2, 3.2, 1.15, { tone: 'mid' }, { owner: 'motor', extra: Dt([at([24, 7.7, 39.6])], { size: 0.45, tone: 'hi' }) });
}
{
  // the measuring stud on top of the drive-end bearing: hex base, stud, cap and its ping ring
  const [x, y, z] = STUD;
  post('motor.stud-hex', x, y, 1.8, z - 0.2, z + 1.2, { tone: 'hi', crease: 'lo' }, { owner: 'motor', steps: 6 });
  post('motor.stud', x, y, 1.15, z + 1.2, z + 3.6, { tone: 'hi' }, {
    owner: 'motor', steps: 20,
    extra: Dt([at([x, y, z + 3.6])], { size: 0.5, tone: 'hi' }),
  });
}

// ---------------------------------------------------------------- coupling guard, with the work-order tag
{
  const guard = { x: -24, y: -8, w: 21, d: 16, r: 2.4 };
  const fy = guard.y + guard.d;
  const slots = [];
  for (const z of [15, 19, 23, 27]) slots.push(k.pathOf(k.roundedPlan({ x: -20, y: z, w: 13, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
  const tag = [[-19.4, fy, 24.6], [-13.6, fy, 24.6], [-13.6, fy, 13.4], [-19.4, fy, 13.4]];
  const tagSvg = [
    '<g class="mf-tag" data-k="tag" style="display:none">',
    `<path class="mf-card" d="${k.pathOf(tag.map(at), true)}"/>`,
    L(k.sideRing([-16.5, fy, 22.8], 0.7, 'y', P, 14), { tone: 'lo' }),
    L([21, 19.6, 18.2, 16.8].map((z, i) => k.segment([-18.4, fy, z], [-18.4 + [4.6, 3.6, 4.2, 2.8][i], fy, z], P)).join(''), { tone: 'lo', free: true }),
    '</g>',
  ].join('');
  box('guard.cover', guard, 10, 32, { tone: 'mid' }, {
    owner: 'guard', steps: 3, bevel: 0.6,
    inner: L(slots.join(''), { tone: 'lo' }),
    extra: Dt([[-16.5, fy, 22.8], [-22, fy, 30], [-5, fy, 30]].map(at), { size: 0.42, tone: 'mid' }) + tagSvg,
  });
  for (const x0 of [-22, -9]) box('guard.foot', { x: x0, y: -10.5, w: 4, d: 21, r: 0.5 }, BASE_TOP, 10, { tone: 'lo' }, { owner: 'guard', steps: 2, extra: Dt([at([x0 + 2, 9.4, BASE_TOP + 0.01])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- the pump (−x)
const FB = frameX([-38, 0, ZC]);
discAt('pump.frame', FB, 0, 14, 7, { tone: 'mid' }, { owner: 'pump', inner: L(G.arcOf(FB, 4, 7, P) + G.arcOf(FB, 10, 7, P), { tone: 'faint' }) });
box('pump.frame-foot', { x: -34, y: -8, w: 6, d: 16, r: 0.6 }, BASE_TOP, 16.4, { tone: 'mid' }, { owner: 'pump', steps: 2, bevel: 0.3 });
{
  // the oil sight glass on the bearing frame: the oil-analysis sample point
  const FS = frameY([-31, 6.85, ZC]);
  discAt('pump.sight', FS, 0, 1.8, 1.9, { tone: 'mid' }, { owner: 'pump', extra: `<path class="mf-oil" d="${G.circleOf(FS, 1.8, 1.25, P, 24)}"/>` + L(G.circleOf(FS, 1.8, 1.25, P, 24), { tone: 'lo' }) });
}
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

// ---------------------------------------------------------------- the condition panel on its pedestal
const plotX = (week) => PLOT.x0 + ((PLOT.x1 - PLOT.x0) * week) / WEEKS;
const plotZ = (v) => PLOT.z0 + ((PLOT.z1 - PLOT.z0) * Math.min(v, PLOT.vmax)) / PLOT.vmax;
{
  const foot = { x: -8, y: -49, w: 16, d: 14, r: 1 };
  box('stand.foot', foot, FLOOR, FLOOR + 1.4, { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 2.2).map(([x, y]) => at([x, y, FLOOR + 1.4])), { size: 0.45 }) });
  post('panel.post', POST[0], POST[1], 2.2, FLOOR + 1.4, BOX_Z[0] - 5, { tone: 'mid' }, { steps: 24, inner: L(k.sideArc(POST[0], POST[1], 2.2, 8, P, 16), { tone: 'faint' }) });
  post('panel.collar', POST[0], POST[1], 3.4, BOX_Z[0] - 5, BOX_Z[0], { tone: 'mid' }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  // the screen: the alarm line, then the bearing's curve drawn live up to now
  const screen = [
    `<path class="iso-line" data-tone="lo" d="M${WIN.x0} ${-plotZ(ACT)}H${WIN.x1}"/>`,
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
const STUD_TOP = at([STUD[0], STUD[1], STUD[2] + 3.6]);
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  `<path class="mf-ping" data-k="ping" d="${k.ring(STUD[0], STUD[1], 3.4, STUD[2] + 3.6, P, 32)}"/>`,
  // markers for the two small cued parts: at the chart scenes' camera the pump set is about 60 px wide at
  // 390 px, so a lit stud or sight glass alone is a dot; stage.js keeps each ring a fixed size on screen
  ...[['stud', STUD_TOP], ['sight', at([-31, 8.65, ZC])]].map(([c, [x, y]]) => `<g data-cue="${c}"><circle class="mf-mark" data-k="mk-${c}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0"/></g>`),
  `<g data-k="wisps">${[0, 1, 2, 3].map(() => `<circle class="mf-wisp" cx="${STUD_TOP[0].toFixed(1)}" cy="${STUD_TOP[1].toFixed(1)}" r="0" style="opacity:0"/>`).join('')}</g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('strat', g('stBase', '') + ['rRun', 'rPrev', 'rCbm', 'rPdm'].map((c) => cue(c, g(c, ''))).join('')),
  g('choice', cue('choice', g('chIn', '')) + g('chBar', '')),
  g('tub', g('tbBase', '') + ['zInf', 'zRnd', 'zWear'].map((c) => cue(c, g(c, ''))).join('') + cue('tubC', g('tbCurve', '')) + g('tbBar', '')),
  g('mif', g('mfBase', '') + cue('mifC', g('mfSoon', ''))),
  g('weib', g('wbBase', '') + cue('weibC', g('wbIn', '')) + g('wbBars', '')),
  g('pf', g('pfBase', '') + g('pfIn', '') + cue('pfBr', g('pfBrIn', '')) + ['mUs', 'mVib', 'mOil', 'mIr', 'mHand'].map((c) => cue(c, g(c, ''))).join('')),
  g('trend', g('trIn', '')),
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
const SIDE = (w0, w1) => ({ from: cam([-4, -10, 26], w0, 104), to: cam([-4, -10, 26], w1, 104) });
const CAM = [
  { from: cam([-4, -12, 28], 640), to: cam([-4, -10, 26], 1900, 104), a: 0.27, b: 0.4 },
  SIDE(1950, 1850),
  SIDE(1950, 1880),
  SIDE(1880, 1820),
  SIDE(1880, 1820),
  SIDE(1950, 1850),
  SIDE(1850, 1700),
  SIDE(1900, 1820),
];

// ---------------------------------------------------------------- the film
const STR = 'eng.maintenance.strategies';
const FAIL = 'eng.maintenance.failure';
const COND = 'eng.maintenance.condition';
const DUR = [34, 30, 30, 30, 30, 30, 30, 30];
const C = {
  ZC, STUD, COWL_X, PLOT, WIN, FACE_Y, WEEKS, F_WK, P_WK, PF, T0, V0, DRIFT, V_F, TAU, AMP, ACT, WARN, RATE, TREND, TECH,
  BEFORE, AFTER, SOON, NEXT, EARLY, WEAR, PLANNED, MONTHS, KS, dur: DUR,
};
const spec = {
  id: 'eng.maintenance.failure',
  title: { nl: 'Hoe machines falen', en: 'How machines fail' },
  lessons: [STR, FAIL, COND],
  scenes: [
    {
      id: 's1', lesson: STR, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Eén lager, vier strategieën', en: 'One bearing, four strategies' },
      beats: [
        { nl: 'Een pompset: pomp, koppeling, motor. In de motor draait de as op lagers, en elk lager gaat ooit stuk.', en: 'A pump set: pump, coupling, motor. In the motor the shaft runs on bearings, and every bearing fails one day.', cues: ['motor'] },
        { nl: '{t:Correctief onderhoud|Correctief onderhoud}: laten draaien tot hij stuk gaat, dan repareren.', en: '{t:Reactive maintenance|Reactive maintenance}: run it until it breaks, then repair.', cue: { 'Correctief onderhoud': 'rRun' }, cues: ['motor'] },
        { nl: '{t:Preventief onderhoud|Preventief onderhoud}: vervangen met een vast interval, hoe goed het lager ook is.', en: '{t:Preventive maintenance|Preventive maintenance}: replace at a fixed interval, however good the bearing still is.', cue: { 'Preventief onderhoud': 'rPrev' } },
        { nl: '{t:Toestandsafhankelijk onderhoud|Toestandsafhankelijk onderhoud}: meten, en ingrijpen boven een grens.', en: '{t:Condition-based maintenance|Condition-based maintenance}: measure, and act above a limit.', cue: { 'Toestandsafhankelijk onderhoud': 'rCbm' }, cues: ['stud'] },
        { nl: '{t:Predictief onderhoud|Predictief onderhoud}: uit de trend voorspellen wanneer, en in een stop plannen.', en: '{t:Predictive maintenance|Predictive maintenance}: forecast when from the trend, and plan it into a stop.', cue: { 'Predictief onderhoud': 'rPdm' }, cues: ['panel'] },
      ],
    },
    {
      id: 's2', lesson: STR, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Kies per machine', en: 'Choose per machine' },
      beats: [
        { nl: 'De tandwielkast van de bottleneckpers: €{n:60000} nieuw, {n:10} weken levertijd.', en: 'The bottleneck press gearbox: €{n:60000} new, {n:10} weeks delivery.', cues: ['choice'] },
        { nl: 'Stukdraaien legt de fabriek wekenlang stil. Een trillingsronde ziet lagerschade maanden vooraf.', en: 'Running it to failure stops the plant for weeks. A vibration route spots bearing damage months early.', cues: ['choice', 'stud'] },
        { nl: 'Een bandmotor van €{n:400}, reserve op de plank, {n:15} minuten wisselen: laat hem draaien.', en: 'A conveyor motor at €{n:400}, a spare on the shelf, {n:15} minutes to swap: let it run.', cues: ['choice'] },
        { nl: '{t:RCM|RCM}: per asset en faalwijze kiezen op wat de storing kost. Goede fabrieken plannen {n:85}% of meer van de uren.', en: '{t:RCM|RCM}: choose per asset and failure mode by what the failure costs. Good plants plan {n:85}% or more of the hours.', cue: { RCM: 'choice' } },
      ],
    },
    {
      id: 's3', lesson: FAIL, level: 2, dur: DUR[2], still: 0.92, title: { nl: 'De badkuipkromme', en: 'The bathtub curve' },
      beats: [
        { nl: 'Het schoolboekbeeld: de {t:Badkuipkromme|badkuipkromme}, de faalkans tegen de leeftijd.', en: 'The textbook picture: the {t:Bathtub curve|bathtub curve}, failure rate against age.', cue: { Badkuipkromme: 'tubC' } },
        { nl: '{t:Vroege uitval|Vroege uitval}: veel storingen kort na montage, door montagefouten of slechte delen.', en: '{t:Infant mortality|Infant mortality}: many failures soon after fitting, from fitting errors or bad parts.', cue: { 'Vroege uitval': 'zInf' } },
        { nl: 'Dan lang {t:Willekeurig falen|willekeurig falen}, en aan het eind {t:Slijtage|slijtage}.', en: 'Then a long stretch of {t:Random failure|random failure}, and at the end {t:Wear-out|wear-out}.', cue: { 'Willekeurig falen': 'zRnd', Slijtage: 'zWear' } },
        { nl: 'Maar slechts {n:11}% sleet met de leeftijd; {n:68}% faalde juist vroeg (Nowlan en Heap, 1978).', en: 'Yet only {n:11}% wore out with age; {n:68}% failed early (Nowlan and Heap, 1978).', cues: [] },
      ],
    },
    {
      id: 's4', lesson: FAIL, level: 2, dur: DUR[3], still: 0.9, title: { nl: 'Onderhoud dat storingen maakt', en: 'Maintenance that makes failures' },
      beats: [
        { nl: 'Elke {n:12} maanden nieuwe lagers in alle {n:24} servo-assen.', en: 'Every {n:12} months, new bearings in all {n:24} servo axes.', cues: ['motor'], read: { nl: '{n:24} × €{n:750} = €{n:18000}', en: '{n:24} × €{n:750} = €{n:18000}' } },
        { nl: 'Vóór dat programma {n:6} lagerstoringen per jaar. Erna {n:9}.', en: 'Before the programme, {n:6} bearing failures a year. After it, {n:9}.', cues: [] },
        { nl: '{n:5} daarvan binnen twee weken na een wissel: {t:Storing door onderhoud|storing door onderhoud}.', en: '{n:5} of them within two weeks after a swap: {t:Maintenance-induced failure|maintenance-induced failure}.', cue: { 'Storing door onderhoud': 'mifC' } },
        { nl: 'Elke ingreep geeft kans op een fout: vuil, een slechte afdichting, een koppeling uit lijn.', en: 'Every intervention risks a fault: dirt, a bad seal, a misaligned coupling.', cues: ['guard'] },
      ],
    },
    {
      id: 's5', lesson: FAIL, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Wat de bèta zegt', en: 'What beta says' },
      beats: [
        { nl: '{t:Weibull β|Weibull β}: de vormfactor uit een fit op de leeftijden waarop onderdelen faalden.', en: '{t:Weibull β|Weibull β}: the shape factor from a fit on the ages at which parts failed.', cue: { 'Weibull β': 'weibC' } },
        { nl: 'β onder {n:1}: vroege uitval. Rond {n:1}: willekeurig. Boven {n:1}, zeker boven {n:3}: slijtage.', en: 'β below {n:1}: early failure. Around {n:1}: random. Above {n:1}, especially above {n:3}: wear-out.', cues: ['weibC'] },
        { nl: 'De servolagers: β = {n:1.0}. Willekeurig falen, dus vast vervangen helpt niet.', en: 'The servo bearings: β = {n:1.0}. Random failure, so fixed replacement does not help.', cues: ['weibC'] },
        { nl: 'Stoppen met wisselen, {n:6} assen op trillingsmeting, monteurs trainen: volgend jaar {n:3} storingen.', en: 'Stop the swaps, put {n:6} axes on vibration checks, train the fitters: next year {n:3} failures.', cues: ['stud'] },
      ],
    },
    {
      id: 's6', lesson: COND, level: 3, dur: DUR[5], still: 0.9, title: { nl: 'Het venster tussen P en F', en: 'The window between P and F' },
      beats: [
        { nl: 'Een lagerdefect begint klein. Bij P wordt het meetbaar, bij F faalt de pomp.', en: 'A bearing defect starts small. At P it becomes measurable, at F the pump fails.', cues: ['panel'] },
        { nl: 'Het {t:P-F-interval|P-F-interval}: de tijd tussen P en F, je venster om in te grijpen.', en: 'The {t:P-F interval|P-F interval}: the time between P and F, your window to act.', cue: { 'P-F-interval': 'pfBr' } },
        { nl: 'Meet vaker dan dat venster, als vuistregel op de helft: bij {n:8} weken elke {n:4} weken.', en: 'Measure more often than that window, as a rule of thumb at half: at {n:8} weeks, every {n:4} weeks.', cues: ['pfBr'] },
        { nl: 'Een ronde om de {n:12} weken bij een venster van {n:10}: {n:83}% op tijd, één lager op de zes valt uit.', en: 'A route every {n:12} weeks with a window of {n:10}: {n:83}% in time, one bearing in six breaks down.', cues: ['pfBr'] },
      ],
    },
    {
      id: 's7', lesson: COND, level: 3, dur: DUR[6], still: 0.92, title: { nl: 'Vijf manieren om te kijken', en: 'Five ways to look' },
      beats: [
        { nl: '{t:Ultrasoon|Ultrasoon} hoort een slecht gesmeerd of beschadigd lager het eerst: {n:12} weken voor F.', en: '{t:Ultrasound|Ultrasound} hears a dry or damaged bearing first: {n:12} weeks before F.', cue: { Ultrasoon: 'mUs' }, cues: ['stud'] },
        { nl: '{t:Trillingsanalyse|Trillingsanalyse} op het lagerhuis ziet het {n:10} weken vooraf.', en: '{t:Vibration analysis|Vibration analysis} on the bearing housing sees it {n:10} weeks ahead.', cue: { Trillingsanalyse: 'stud' }, cues: ['mVib'] },
        { nl: '{t:Olieanalyse|Olieanalyse}: slijtagemetalen in een oliemonster, {n:6} weken voor F.', en: '{t:Oil analysis|Oil analysis}: wear metals in an oil sample, {n:6} weeks before F.', cue: { Olieanalyse: 'sight' }, cues: ['mOil'] },
        { nl: '{t:Thermografie|Thermografie} ziet de warmte pas {n:4} weken vooraf; een hand op het lagerhuis {n:1} week.', en: '{t:Thermography|Thermography} sees the heat only {n:4} weeks ahead; a hand on the housing {n:1} week.', cue: { Thermografie: 'mIr' }, cues: ['motor', 'mHand'] },
      ],
    },
    {
      id: 's8', lesson: COND, level: 3, dur: DUR[7], still: 0.92, title: { nl: 'Plan het nu', en: 'Plan it now' },
      beats: [
        { nl: 'Maandelijkse trillingsronde: {n:1.8}, {n:1.9}, {n:2.6}, {n:3.4} mm/s, en een lagerfrequentie in het spectrum.', en: 'Monthly vibration route: {n:1.8}, {n:1.9}, {n:2.6}, {n:3.4} mm/s, and a bearing frequency in the spectrum.', cues: ['stud'] },
        { nl: 'Zo’n {n:0.8} per maand erbij. De actiegrens ligt op {n:4.5}.', en: 'About {n:0.8} more each month. The action level is {n:4.5}.', cues: [], read: { nl: '({n:4.5} − {n:3.4}) / {n:0.8} = {n:1.4} maand', en: '({n:4.5} − {n:3.4}) / {n:0.8} = {n:1.4} months' } },
        { nl: 'Over zo’n zes weken door de grens. Een lager kost €{n:350}; de geplande stop is half mei.', en: 'Through the limit in about six weeks. A bearing costs €{n:350}; the planned stop is mid-May.', cues: [] },
        { nl: 'Bestel het nu en plan vier uur in de stop. Geen pomp die op vrijdagnacht stilvalt.', en: 'Order it now and book four hours in the stop. No pump seizing on a Friday night.', cues: ['guard'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/" or "&" in the spoken text: mm/s is said as
// "millimeter per seconde", β as "bèta", the euro amounts as "... euro".
// English loanwords in the Dutch voice were checked with espeak-ng phonemes
// (Piper's own bridge): "bèta" is said through a Dutch spoken form in
// films/_kit/timeline.mjs (SAY); "bottleneckpers" (read as bot-le-nek) and
// "vastloopt" (stressed on loopt) are kept out of the Dutch narration.
const SAY = [
  [ // s1 one bearing, four strategies
    { nl: 'Een pompset: pomp, koppeling en elektromotor. In de motor draait de as op lagers, en elk lager gaat ooit stuk. Wanneer grijp je in? Er zijn vier strategieën.',
      en: 'A pump set: pump, coupling and electric motor. Inside the motor the shaft runs on bearings, and every bearing fails one day. When do you step in? There are four strategies.' },
    { nl: 'Bij {t:Correctief onderhoud|correctief onderhoud} draait hij tot hij stuk gaat, en dan repareer je. Prima als dat goedkoop en veilig is. Als standaard is het duur: volgens de vuistregel kost een ongeplande reparatie drie tot vijf keer een geplande.',
      en: 'With {t:Reactive maintenance|reactive maintenance} you run it until it breaks, and then you repair it. Fine when that is cheap and safe. As a default it is expensive: by the rule of thumb, an unplanned repair costs three to five times a planned one.' },
    { nl: 'Bij {t:Preventief onderhoud|preventief onderhoud} vervang je met een vast interval, hoe goed het onderdeel ook is. Dat werkt voor onderdelen die duidelijk slijten.',
      en: 'With {t:Preventive maintenance|preventive maintenance} you replace at a fixed interval, however good the part still is. That works for parts that clearly wear out.' },
    { nl: 'Bij {t:Toestandsafhankelijk onderhoud|toestandsafhankelijk onderhoud} meet je de conditie, zoals de trilling op het lagerhuis, en grijp je in boven een afgesproken grens.',
      en: 'With {t:Condition-based maintenance|condition-based maintenance} you measure the condition, such as the vibration on the bearing housing, and act above an agreed limit.' },
    { nl: '{t:Predictief onderhoud|Predictief onderhoud} gaat verder: uit de trend voorspel je wanneer de grens bereikt wordt, en plan je de reparatie in een stop waarin de lijn toch stilstaat.',
      en: '{t:Predictive maintenance|Predictive maintenance} goes further: from the trend you forecast when the limit will be reached, and you plan the repair into a stop when the line is down anyway.' },
  ],
  [ // s2 choose per machine
    { nl: 'Welke strategie past, hangt af van wat de storing kost. Neem de tandwielkast van de pers die het tempo van een stansbedrijf bepaalt: {n:60000} euro nieuw, {n:10} weken levertijd.',
      en: 'Which strategy fits depends on what the failure costs. Take the gearbox of the bottleneck press in a stamping plant: {n:60000} euros new, and {n:10} weeks delivery.' },
    { nl: 'Stukdraaien legt de fabriek wekenlang stil; een maandelijkse trillingsronde ziet lagerschade maanden vooraf. Dus: toestandsafhankelijk.',
      en: 'Running it to failure would stop the plant for weeks. A monthly vibration route spots bearing damage months ahead. So: condition-based.' },
    { nl: 'De bandmotoren op de inpaklijn kosten {n:400} euro, liggen op voorraad en zijn in {n:15} minuten gewisseld. Die laat je stukdraaien.',
      en: 'The conveyor motors on the packing line cost {n:400} euros, are in stock and are swapped in {n:15} minutes. Those you run to failure.' },
    { nl: 'Zo kiezen, per asset en faalwijze, op de gevolgen, heet {t:RCM|RCM}. Goede fabrieken plannen {n:85} procent of meer van hun onderhoudsuren.',
      en: 'Choosing like this, per asset and per failure mode, by the consequences, is called {t:RCM|RCM}. Good plants do {n:85} percent or more of their maintenance hours as planned work.' },
  ],
  [ // s3 the bathtub curve
    { nl: 'Hoe falen onderdelen eigenlijk? Het schoolboek toont de {t:Badkuipkromme|badkuipkromme}: de faalkans tegen de leeftijd.',
      en: 'How do parts actually fail? The textbook shows the {t:Bathtub curve|bathtub curve}: the failure rate plotted against age.' },
    { nl: 'Eerst {t:Vroege uitval|vroege uitval}, ook wel kindersterfte: storingen kort na montage, door montagefouten of slechte onderdelen.',
      en: 'First {t:Infant mortality|infant mortality}: failures soon after fitting, from fitting errors or bad parts.' },
    { nl: 'Dan een lange vlakke periode met {t:Willekeurig falen|willekeurig falen}, een gelijke kans op elke leeftijd. En aan het eind {t:Slijtage|slijtage}.',
      en: 'Then a long flat period of {t:Random failure|random failure}, the same chance at any age. And at the end {t:Wear-out|wear-out}.' },
    { nl: 'Maar in een bekende luchtvaartstudie sleet maar {n:11} procent van de onderdelen met de leeftijd; {n:68} procent faalde juist vroeg. Slijten doet vooral wat schuurt, snijdt of last draagt.',
      en: 'But in a well-known airline study only {n:11} percent of the parts wore out with age; {n:68} percent failed early. What wears is mostly what rubs, cuts or carries load.' },
  ],
  [ // s4 maintenance that makes failures
    { nl: 'Een verpakkingsbedrijf vervangt elke {n:12} maanden de lagers in alle {n:24} servo-assen. Dat kost {n:18000} euro per jaar.',
      en: 'Every {n:12} months, a packaging plant replaces the bearings in all {n:24} servo axes. That costs {n:18000} euros a year.' },
    { nl: 'Vóór dat programma waren er {n:6} lagerstoringen per jaar. Erna niet minder maar meer: {n:9}.',
      en: 'Before the programme there were {n:6} bearing failures a year, after it not fewer but more: {n:9}.' },
    { nl: 'En {n:5} daarvan kwamen binnen twee weken na een wissel: {t:Storing door onderhoud|storing door onderhoud}. Het werk zelf veroorzaakt de storing.',
      en: 'And {n:5} of those came within two weeks after a swap: {t:Maintenance-induced failure|maintenance-induced failure}. The work itself causes the failure.' },
    { nl: 'Wie een machine openmaakt, kan vuil binnenlaten of een afdichting slecht monteren. Je ziet dan een cluster storingen vlak na het onderhoud.',
      en: 'Opening a machine can let dirt in or leave a seal badly fitted. You then see a cluster of failures just after the maintenance.' },
  ],
  [ // s5 what beta says
    { nl: 'Het patroon toets je met een Weibull-analyse van de faalleeftijden. De uitkomst is de {t:Weibull β|Weibull-bèta}, de vormfactor.',
      en: 'You test the pattern with a Weibull analysis of the failure ages. The output is the {t:Weibull β|Weibull beta}, the shape factor.' },
    { nl: 'Bèta onder {n:1}: vroege uitval, pak de montage aan. Rond {n:1}: willekeurig. Boven {n:1}, en zeker boven {n:3}: slijtage; dan heeft vervangen op tijd zin.',
      en: 'Beta below {n:1}: early failure, fix the fitting. Around {n:1}: random. Above {n:1}, and especially above {n:3}: wear-out, and then replacing on time makes sense.' },
    { nl: 'Voor de servolagers geeft de fit bèta {n:1.0}: willekeurig falen, geen slijtage. Jaarlijks wisselen kon dus nooit helpen.',
      en: 'For the servo bearings the fit gives beta {n:1.0}: random failure, not wear-out. So the yearly swap could never help.' },
    { nl: 'Het bedrijf stopt de wissel, meet de {n:6} kritische assen maandelijks op trilling en traint de monteurs. Volgend jaar: {n:3} storingen.',
      en: 'The plant stops the swap, checks the {n:6} critical axes for vibration every month and trains the fitters. Next year: {n:3} failures.' },
  ],
  [ // s6 the window between P and F
    { nl: 'Een lagerdefect begint als een putje in de loopbaan. Bij punt P wordt het meetbaar; bij punt F doet de pomp zijn werk niet meer.',
      en: 'A bearing defect starts as a pit in the raceway. At point P it becomes measurable; at point F the pump no longer does its job.' },
    { nl: 'De tijd daartussen is het {t:P-F-interval|P-F-interval}: je venster om het defect te zien en de reparatie te plannen.',
      en: 'The time in between is the {t:P-F interval|P-F interval}: your window to see the defect and plan the repair.' },
    { nl: 'Meet daarom als vuistregel op de helft van het venster: bij {n:8} weken minstens elke {n:4} weken.',
      en: 'So, as a rule of thumb, measure at half the window: at {n:8} weeks, at least every {n:4} weeks.' },
    { nl: 'Met een venster van {n:10} weken en een ronde om de {n:12} weken ben je maar {n:83} procent van de keren op tijd.',
      en: 'With a window of {n:10} weeks and a route every {n:12} weeks, you are in time only {n:83} percent of the time.' },
  ],
  [ // s7 five ways to look
    { nl: 'Elke methode ziet het defect op een eigen moment. {t:Ultrasoon|Ultrasoon} luistert boven ons gehoor en hoort een droog lager het eerst: zo’n {n:12} weken voor F.',
      en: 'Each method sees the defect at its own moment. {t:Ultrasound|Ultrasound} listens far above our hearing and hears a dry bearing first: about {n:12} weeks before F.' },
    { nl: '{t:Trillingsanalyse|Trillingsanalyse} op het lagerhuis ziet het zo’n {n:10} weken vooraf; elke fout heeft een eigen frequentie.',
      en: '{t:Vibration analysis|Vibration analysis} on the bearing housing sees it about {n:10} weeks ahead; each fault has its own frequency.' },
    { nl: 'Bij {t:Olieanalyse|olieanalyse} zoekt een lab slijtagemetalen in een oliemonster: zo’n {n:6} weken voor F.',
      en: 'In {t:Oil analysis|oil analysis} a lab looks for wear metals in an oil sample: about {n:6} weeks before F.' },
    { nl: '{t:Thermografie|Thermografie} ziet het pas als het lager warm wordt, zo’n {n:4} weken vooraf; een hand op het lagerhuis {n:1} week. Het P-F-interval hangt dus af van de methode.',
      en: '{t:Thermography|Thermography} only sees it once the bearing runs warm, about {n:4} weeks ahead; a hand on the housing {n:1} week. So the P-F interval depends on the method.' },
  ],
  [ // s8 plan it now
    { nl: 'De maandelijkse ronde op een koelwaterpomp meet {n:1.8} millimeter per seconde, dan {n:1.9}, {n:2.6} en in april {n:3.4}. In het spectrum verschijnt een lagerfrequentie.',
      en: 'The monthly route on a cooling-water pump measures {n:1.8} millimetres per second, then {n:1.9}, {n:2.6} and in April {n:3.4}. A bearing frequency shows in the spectrum.' },
    { nl: 'Dat is zo’n {n:0.8} per maand erbij. De actiegrens ligt op {n:4.5}.',
      en: 'That is about {n:0.8} more each month. The action level is {n:4.5}.' },
    { nl: 'Het verschil met de grens, gedeeld door {n:0.8}, is {n:1.4} maand: zo’n zes weken. Een nieuw lager kost {n:350} euro; de volgende geplande stop is half mei.',
      en: 'The gap to the limit, divided by {n:0.8}, is {n:1.4} months: about six weeks. A new bearing costs {n:350} euros; the next planned stop is in mid-May.' },
    { nl: 'Dus bestelt de planner het lager nu en reserveert vier uur in die stop. Geen pomp die op vrijdagnacht stilvalt.',
      en: 'So the planner orders the bearing now and books four hours in that stop. No pump seizing on a Friday night.' },
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
.mf-oil{fill:var(--anatomy-lo);stroke:none}
.mf-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mf-tag .mf-card{fill:var(--fp-accent);stroke:var(--anatomy-hi)}
.mf-ping{fill:none;stroke:var(--fp-accent);stroke-width:1.2px;opacity:0}
.mf-wisp{fill:var(--anatomy-muted);filter:blur(2.2px)}
.mf-mark{fill:none;stroke:var(--fp-accent);stroke-width:2px;opacity:0}
[data-cue][data-on] .mf-mark{opacity:1}
.mf-scr{fill:none;stroke:var(--fp-accent);stroke-width:.7px;stroke-linejoin:round;stroke-linecap:round}
.mf-now{fill:var(--anatomy-hi)}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-hollow{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent)}
[data-cue][data-on] .mf-tile{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .mf-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een pompset op een gegoten fundatie: een centrifugaalpomp met slakkenhuis, persflens en lagerbok met oliepeilglas, een koppelingskap en een elektromotor met koelribben, klemmenkast en ventilatorkap, met een meetnippel op het lager aan de aandrijfzijde. Daarachter een conditiepaneel op een voet; het scherm tekent de trilling van het lager van nieuw tot storing. Kaarten, elk gemarkeerd als voorbeeld, tonen de vier strategieën als vier tijdlijnen van hetzelfde lager, de tandwielkast en de bandmotor van een stansbedrijf, de badkuipkromme, een jaar met de servolagers, drie Weibull-vormen, de P-F-kromme met vijf meetmethoden en de maandtrend van een koelwaterpomp.',
  en: 'A pump set on a grouted plinth: a centrifugal pump with its volute, discharge flange and bearing frame with an oil sight glass, a coupling guard and an electric motor with cooling fins, terminal box and fan cowl, with a measuring stud on the drive-end bearing. Behind it a condition panel on a pedestal; its screen draws the bearing\'s vibration from new to failure. Cards, each marked as an example, show the four strategies as four timelines of the same bearing, the gearbox and the conveyor motor of a stamping plant, the bathtub curve, a year of the servo bearings, three Weibull shapes, the P-F curve with five measuring methods and the monthly trend of a cooling-water pump.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

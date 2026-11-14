// Dev tool, not shipped. Builds the explainer film "TPM: de eerste schoonmaak /
// TPM: the first clean" for the topic TPM en autonoom onderhoud of Onderhoud:
// the lesson tpm (level 1), as the plan row lists.
//
//   node films/eng.maintenance.tpm/build.mjs            build the page
//   node films/eng.maintenance.tpm/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.maintenance.tpm.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// The drawing reuses the pump set of the film eng.maintenance.failure (same
// parts, same camera), now as the hydraulic power unit of the lesson's
// injection moulding machine: the pump, coupling guard and motor stand on an oil
// tank with a level glass (min and max marks), a pressure gauge with a zone, a
// breather cap, a drain plug and a name plate. Behind it the condition panel
// is now the OEE board. The film follows the lesson's pilot: the first big
// clean (grime wiped off, an oil leak, a loose foot bolt and a cracked guard
// come to light), the tags, the 37 tags and who closes them, the daily CILT
// round with its visual controls, the results, and OEE as the measure. Cards
// in stage space carry the three zeros, the eight pillars, the tag count, the
// tag board, the CILT strip with a close-up inset, the results (with the people
// side: operators fear extra work, technicians fear for their role) and OEE; the
// cards that show invented values are labelled "voorbeeld".
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
// Asserted against the worked example and the recall of the lesson tpm (the
// build fails if a value drifts); the {n:...} numbers are then checked against
// the Dutch lesson text by defineFilm. Sources as in the lesson: Nakajima,
// Introduction to TPM (JIPM, 1988) for the goal of zero breakdowns, defects and
// accidents, the eight pillars and the seven steps of autonomous maintenance;
// OEE as availability × performance × quality, 85 % as the usual world-class
// figure (a rule of thumb, as the lesson hedges it).
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
// example: 37 tags in one shift = 12 oil leaks + 9 loose bolts + 6 missing guards + 10 other
const TAGS = [12, 9, 6, 10];
const TAG_SUM = 37;
assert(TAGS.reduce((a, b) => a + b, 0) === TAG_SUM, '12 + 9 + 6 + 10 = 37');
// example: operators fix 21 in the first week, 16 go to maintenance, closed within 4 weeks
const OWN = 21;
const MAINT = 16;
const WEEKS = 4;
assert(OWN + MAINT === TAG_SUM, '21 + 16 = 37');
// example: a CILT checklist of 8 points takes 7 minutes; teach: 5 to 10 minutes of checks per shift
const POINTS = 8;
const CHECK_MIN = 7;
assert(CHECK_MIN >= 5 && CHECK_MIN <= 10, 'the 7-minute round sits in the usual 5 to 10 minutes');
// example: breakdowns 9 → 4 a month; recall: 2,5 h each → 12,5 h a month saved
const BD = [9, 4];
const BD_H = 2.5;
const SAVED = (BD[0] - BD[1]) * BD_H;
assert(SAVED === 12.5, '(9 − 4) × 2,5 = 12,5');
// example: hydraulic oil top-ups 60 → 15 litres a month
const OIL = [60, 15];
assert(OIL[1] / OIL[0] === 0.25, 'a quarter of the oil');
// teach: OEE = availability × performance × quality; 85 % world class. The card's
// bars are an example (labelled so): before 82 × 80 × 97, after 90 × 86 × 97.
const WORLD = 85;
const OEE_A = [0.82, 0.90];
const OEE_P = [0.80, 0.86];
const OEE_Q = 0.97;
const oee = (i) => OEE_A[i] * OEE_P[i] * OEE_Q;
assert(oee(0) < oee(1) && oee(1) < WORLD / 100, 'the example rises, still below world class');

// ---------------------------------------------------------------- the world (as the failure film)
// World units are centimetres, z up, x along the shaft (pump at −x, motor at
// +x), +y toward the viewer. The top of the oil tank is z = 0.
const W = 640;
const H = 400;
const ZC = 23;
const FLOOR = -24;
const TANK = { x: -84, y: -30, w: 160, d: 60, r: 1.5 };
const FRONT = TANK.y + TANK.d;
const BASE = { x: -72, y: -20, w: 136, d: 40, r: 1.2 };
const BASE_TOP = 5;
const POST = [0, -42];
const BOX = { x: -26, y: -46, w: 52, d: 8, r: 0.8 };
const BOX_Z = [32, 63];
const FACE_Y = BOX.y + BOX.d;
const WIN = { x0: -22, x1: 22, z0: 38.4, z1: 59.4, r: 1.4, depth: 0.8 };
const COWL_X = 58;
const STUD = [4, 0, ZC + 12];
const BOLT = [13, 12.4, BASE_TOP + 6.4];
const LEVEL = { x0: -68, x1: -60, z0: -20, z1: -5, r: 1, depth: 0.6, oil: -10, min: -16, max: -8 };
const GAUGE = [-44, FRONT, -12];
const GAUGE_R = 5;

const FIT = [
  ...k.boxCorners(TANK, FLOOR, 0),
  ...k.boxCorners({ x: -28, y: -47, w: 56, d: 10 }, FLOOR, BOX_Z[1] + 2),
  [-48, 0, 49],
];
const P = k.fitProjection(FIT, W, H, { pad: 16, azimuth: 74, elevation: 26 });
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
const cueOf = (name) => (/^motor\.stud/.test(name) ? 'stud'
  : /^motor\./.test(name) ? 'motor'
    : /^pump\./.test(name) ? 'pump'
      : /^panel\./.test(name) ? 'panel'
        : /^tank\.gauge/.test(name) ? 'gauge'
          : /^tank\./.test(name) ? 'tank'
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

// A recess in the face y = const (the panel's screen, the level glass): inner
// walls shaded by facing, a back plane holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = '', backClass = 'mt-glass') {
  const id = `mt-clip-${clips++}`;
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

// ---------------------------------------------------------------- the oil tank
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(TANK, -2), FLOOR, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf({ x: -10, y: -51, w: 20, d: 18, r: 3 }, FLOOR, 1, P)}" style="opacity:.6"/>`,
];
{
  // the cover's bolt circle, the level glass with min and max, the name plate
  const coverBolts = [...k.corners(TANK, 4), [-4, TANK.y + 4], [-4, FRONT - 4]];
  const lv = LEVEL;
  const glassBack = [
    `<path class="mt-oil" d="${flatRect(lv.x0, lv.z0, lv.x1, lv.oil, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M${lv.x0} ${-lv.oil}H${lv.x1}"/>`,
  ].join('');
  const marks = [
    `<g data-cue="level"><g transform="${planeOf(FRONT)}">`,
    `<path class="iso-line fp-mark" data-tone="mid" d="M${lv.x0 - 2.4} ${-lv.min}H${lv.x0}M${lv.x1} ${-lv.min}H${lv.x1 + 2.4}M${lv.x0 - 2.4} ${-lv.max}H${lv.x0}M${lv.x1} ${-lv.max}H${lv.x1 + 2.4}"/>`,
    '</g></g>',
  ].join('');
  const plate = { x0: 22, x1: 44, z0: -9, z1: -3 };
  const faceBits = [
    recess(lv, FRONT, glassBack),
    marks,
    `<g transform="${planeOf(FRONT)}">`,
    `<path class="mt-card" d="${flatRect(plate.x0, plate.z0, plate.x1, plate.z1, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M24 4.6H40M24 6.2H36M24 7.8H38"/>`,
    '</g>',
    Dt([[plate.x0 + 1, FRONT, plate.z1 - 1], [plate.x1 - 1, FRONT, plate.z1 - 1], [plate.x0 + 1, FRONT, plate.z0 + 1], [plate.x1 - 1, FRONT, plate.z0 + 1]].map(at), { size: 0.4 }),
  ].join('');
  const extra = L(k.planOutline(k.insetPlan(TANK, 2.4), 0, P, 3), { tone: 'faint' })
    + Dt(coverBolts.map(([x, y]) => at([x, y, 0])), { size: 0.45 })
    + faceBits;
  box('tank.body', TANK, FLOOR, 0, { tone: 'mid' }, { ground: true, steps: 3, bevel: 0.6, inner: L(k.sideSeam(TANK, -3, P, 3) + k.sideSeam(TANK, FLOOR + 3, P, 3), { tone: 'faint' }), extra });
}
{
  // the pressure gauge on the tank front: bezel, dial with a zone, needle
  const FGa = frameY(GAUGE);
  const [gx, , gz] = GAUGE;
  const yf = FRONT + 1.8;
  const arc = (r, a0, a1) => {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const a = a0 + ((a1 - a0) * i) / 16; pts.push([gx + r * Math.cos(a), -(gz + r * Math.sin(a))]); }
    return pts;
  };
  const zone = [...arc(3.9, 0.15, 1.1), ...arc(2.9, 1.1, 0.15)];
  const ticks = Array.from({ length: 9 }, (_, i) => { const a = -0.8 + (i / 8) * 4.74; return `M${(gx + 3.3 * Math.cos(a)).toFixed(2)} ${(-(gz + 3.3 * Math.sin(a))).toFixed(2)}L${(gx + 4.1 * Math.cos(a)).toFixed(2)} ${(-(gz + 4.1 * Math.sin(a))).toFixed(2)}`; }).join('');
  const dial = [
    `<g transform="${planeOf(yf)}">`,
    `<path class="mt-dial" d="${k.pathOf(arc(4.4, 0, Math.PI * 2), true)}"/>`,
    `<path class="mt-zone" d="${k.pathOf(zone, true)}"/>`,
    `<path class="iso-line" data-tone="lo" d="${ticks}"/>`,
    `<path class="mt-needle" d="M${gx} ${-gz}L${(gx + 3.6 * Math.cos(0.6)).toFixed(2)} ${(-(gz + 3.6 * Math.sin(0.6))).toFixed(2)}"/>`,
    '</g>',
    Dt([at([gx, yf, gz])], { size: 0.5, tone: 'hi' }),
  ].join('');
  discAt('tank.gauge', FGa, 0, 1.8, GAUGE_R, { tone: 'mid' }, { extra: dial });
}
discAt('tank.drain', frameY([58, FRONT, -20]), 0, 1.4, 1.6, { tone: 'mid' }, { steps: 6, extra: Dt([at([58, FRONT + 1.4, -20])], { size: 0.45, tone: 'hi' }) });
post('tank.breather', 66, 22, 2.2, 0, 2.4, { tone: 'mid' }, { steps: 20 });
post('tank.cap', 66, 22, 3.6, 2.4, 5.4, { tone: 'hi', crease: 'lo' }, { steps: 28, bevel: 0.4, extra: L(k.ring(66, 22, 2.2, 5.4, P, 24), { tone: 'lo' }) + Dt([at([66, 22, 5.4])], { size: 0.45, tone: 'hi' }) });

// ---------------------------------------------------------------- baseplate
{
  const bolts = [-64, -36, 22, 56].flatMap((x) => [[x, BASE.y + 3.4], [x, BASE.y + BASE.d - 3.4]]);
  const extra = L(k.planOutline(k.insetPlan(BASE, 1.8), BASE_TOP, P, 3), { tone: 'faint' })
    + L(bolts.map(([x, y]) => k.ring(x, y, 1.4, BASE_TOP, P, 14)).join(''), { tone: 'lo' })
    + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 });
  box('base.plate', BASE, 0, BASE_TOP, { tone: 'mid' }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(BASE, 1.4, P, 3), { tone: 'faint' }), extra });
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
  const FC = frameX([45, 0, ZC]);
  const cowl = [[0, 13.4], [11.6, 13.4], [13, 12.4]];
  const face = [
    `<path class="mt-well" d="${G.circleOf(FC, 13, 11, P, 72)}"/>`,
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
  // the grease nipple on top of the drive-end bearing: hex base, nipple, ball head
  const [x, y, z] = STUD;
  post('motor.stud-hex', x, y, 1.8, z - 0.2, z + 1.2, { tone: 'hi', crease: 'lo' }, { owner: 'motor', steps: 6 });
  post('motor.stud', x, y, 1.15, z + 1.2, z + 3.6, { tone: 'hi' }, { owner: 'motor', steps: 20, extra: Dt([at([x, y, z + 3.6])], { size: 0.5, tone: 'hi' }) });
}

// ---------------------------------------------------------------- coupling guard, with its crack
{
  const guard = { x: -24, y: -8, w: 21, d: 16, r: 2.4 };
  const fy = guard.y + guard.d;
  const slots = [];
  for (const z of [15, 19, 23, 27]) slots.push(k.pathOf(k.roundedPlan({ x: -20, y: z, w: 13, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
  const crack = `<g data-k="crack" style="display:none"><g transform="${planeOf(fy)}"><path class="mt-crack" d="M-6.2 -30.2L-7.4 -28.6L-6.4 -27.4L-8 -25.8L-7.1 -24.4L-8.6 -22.6"/></g></g>`;
  box('guard.cover', guard, 10, 32, { tone: 'mid' }, {
    owner: 'guard', steps: 3, bevel: 0.6,
    inner: L(slots.join(''), { tone: 'lo' }),
    extra: Dt([[-16.5, fy, 22.8], [-22, fy, 30], [-5, fy, 30]].map(at), { size: 0.42, tone: 'mid' }) + crack,
  });
  for (const x0 of [-22, -9]) box('guard.foot', { x: x0, y: -10.5, w: 4, d: 21, r: 0.5 }, BASE_TOP, 10, { tone: 'lo' }, { owner: 'guard', steps: 2, extra: Dt([at([x0 + 2, 9.4, BASE_TOP + 0.01])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- the pump (−x)
const FB = frameX([-38, 0, ZC]);
discAt('pump.frame', FB, 0, 14, 7, { tone: 'mid' }, { owner: 'pump', inner: L(G.arcOf(FB, 4, 7, P) + G.arcOf(FB, 10, 7, P), { tone: 'faint' }) });
box('pump.frame-foot', { x: -34, y: -8, w: 6, d: 16, r: 0.6 }, BASE_TOP, 16.4, { tone: 'mid' }, { owner: 'pump', steps: 2, bevel: 0.3 });
{
  const FS = frameY([-31, 6.85, ZC]);
  discAt('pump.sight', FS, 0, 1.8, 1.9, { tone: 'mid' }, { owner: 'pump', extra: `<path class="mt-oil" d="${G.circleOf(FS, 1.8, 1.25, P, 24)}"/>` + L(G.circleOf(FS, 1.8, 1.25, P, 24), { tone: 'lo' }) });
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
    extra: `<path class="mt-well" d="${k.ring(-48, 0, 4, flangeTop, P, 36)}"/>` + L(k.ring(-48, 0, 4, flangeTop, P, 36), { tone: 'lo' }) + Dt(holes.map(([x, y]) => at([x, y, flangeTop])), { size: 0.5, tone: 'mid' }),
  });
}

// ---------------------------------------------------------------- the OEE board on its pedestal
{
  const foot = { x: -8, y: -49, w: 16, d: 14, r: 1 };
  box('stand.foot', foot, FLOOR, FLOOR + 1.4, { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 2.2).map(([x, y]) => at([x, y, FLOOR + 1.4])), { size: 0.45 }) });
  post('panel.post', POST[0], POST[1], 2.2, FLOOR + 1.4, BOX_Z[0] - 5, { tone: 'mid' }, { steps: 24, inner: L(k.sideArc(POST[0], POST[1], 2.2, 8, P, 16), { tone: 'faint' }) });
  post('panel.collar', POST[0], POST[1], 3.4, BOX_Z[0] - 5, BOX_Z[0], { tone: 'mid' }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  // the screen: the 85 % line and the OEE trend drawn live
  const sz = (v) => -(WIN.z0 + 1 + (WIN.z1 - WIN.z0 - 2) * v);
  const screen = [
    `<path class="iso-line" data-tone="lo" d="M${WIN.x0} ${sz(0.85).toFixed(2)}H${WIN.x1}"/>`,
    '<g data-k="scr"></g>',
  ].join('');
  const label = { x0: -15, x1: 3, z0: 33.8, z1: 37 };
  const faceBits = [
    recess(WIN, fy, screen),
    `<g transform="${planeOf(fy)}">`,
    `<path class="mt-card" d="${flatRect(label.x0, label.z0, label.x1, label.z1, 0.4, 3)}"/>`,
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

// Grime on the faces the camera sees: flat patches on the tank and baseplate
// tops, round ones on the front faces; the first clean wipes them off.
const GRIME_TOP = [[-62, 23, 0, 4.2], [-30, 25, 0, 3.4], [2, 24, 0, 4.6], [34, 24, 0, 3.2], [-76, 6, 0, 3], [-56, 15, BASE_TOP, 2.6], [-6, 14, BASE_TOP, 2.8], [44, 15, BASE_TOP, 2.4]];
const GRIME_SIDE = [[-56, 15.6, 27, 2.2], [-52, 15.4, 18, 1.8], [12, 13.1, 26, 2.4], [30, 13.1, 20, 2], [-17, 8.1, 16, 2], [-34, 7.1, 19, 1.4], [-20, FRONT, -6, 3], [10, FRONT, -14, 3.4]];
const grime = [
  ...GRIME_TOP.map(([x, y, z, r]) => `<path class="mt-grime" d="${k.ring(x, y, r, z + 0.05, P, 16)}"/><path class="mt-grime" d="${k.ring(x + r * 0.5, y - r * 0.3, r * 0.45, z + 0.05, P, 10)}"/>`),
  ...GRIME_SIDE.map(([x, y, z, r]) => `<path class="mt-grime" d="${k.sideRing([x, y, z], r, 'y', P, 16)}"/>`),
].join('');

// Tags: a petrol card on a string in the plane of the face it hangs on.
const TAG_AT = [[-40, 11.2, 31], [13, 16.2, 13], [-12, 8.2, 31], [20, 5.2, 42.6]];
const tagSvg = TAG_AT.map(([x, y, z], i) => [
  `<g data-cue="tag"><g data-k="tg${i}" style="display:none"><g transform="${planeOf(y)}">`,
  `<path class="mt-string" d="M${x} ${-z}L${x - 0.6} ${-(z - 1.6)}"/>`,
  `<path class="mt-tagc" d="${flatRect(x - 3.1, z - 8.6, x + 1.9, z - 1.6, 0.5, 3)}"/>`,
  `<path class="mt-tagl" d="M${x - 2.2} ${-(z - 3.8)}H${x + 0.9}M${x - 2.2} ${-(z - 5.2)}H${x + 0.3}M${x - 2.2} ${-(z - 6.6)}H${x + 0.6}"/>`,
  `<circle class="mt-hole" cx="${x - 0.6}" cy="${-(z - 2.4)}" r="0.5"/>`,
  '</g></g></g>',
].join('')).join('');

const STUD_TOP = at([STUD[0], STUD[1], STUD[2] + 3.6]);
const MARK_AT = [['stud', STUD_TOP], ['bolt', at(BOLT)], ['level', at([(LEVEL.x0 + LEVEL.x1) / 2, FRONT, (LEVEL.z0 + LEVEL.z1) / 2])], ['gauge', at([GAUGE[0], FRONT + 1.8, GAUGE[2]])]];
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  `<g data-k="grime">${grime}</g>`,
  `<path class="mt-oil" data-k="puddle" d="${k.ring(-41, 11, 2.6, BASE_TOP + 0.05, P, 20)}" style="opacity:0"/>`,
  '<circle class="mt-oil" data-k="drop" cx="0" cy="0" r="0" />',
  tagSvg,
  // markers for the small cued parts: stage.js keeps each ring a fixed size on screen
  ...MARK_AT.map(([c, [x, y]]) => `<g data-cue="${c}"><circle class="mt-mark" data-k="mk-${c}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0"/></g>`),
  '<g data-k="tool"></g>',
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('zeros', cue('zeros', g('zrIn', ''))),
  g('house', g('hsBase', '') + cue('pAm', g('hsAm', '')) + cue('pPm', g('hsPm', '')) + g('hsSplit', '')),
  g('count', cue('count', g('ctIn', ''))),
  g('board', g('bdIn', '')),
  g('cilt', cue('cilt', g('clIn', '')) + g('clInset', '')),
  g('res', g('rsIn', '')),
  g('oee', cue('oeeC', g('oeIn', ''))),
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
const TPM = 'eng.maintenance.tpm';
const DUR = [31, 37, 30, 20, 30, 39, 40, 29];
const spec = {
  id: 'eng.maintenance.tpm',
  title: { nl: 'TPM: de eerste schoonmaak', en: 'TPM: the first clean' },
  lessons: [TPM],
  scenes: [
    {
      id: 's1', lesson: TPM, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Wie zorgt voor de machine?', en: 'Who looks after the machine?' },
      beats: [
        { nl: 'Het hydraulische aggregaat van een spuitgietmachine: olietank, pomp, koppeling en motor.', en: 'The hydraulic power unit of an injection moulding machine: oil tank, pump, coupling and motor.', cues: ['tank', 'pump', 'motor'] },
        { nl: '{t:TPM|TPM}: nul storingen, nul defecten, nul ongevallen.', en: '{t:TPM|TPM}: zero breakdowns, zero defects, zero accidents.', cue: { TPM: 'zeros' } },
        { nl: 'Daarvoor is de zorg voor de machine van iedereen, niet alleen van de onderhoudsdienst.', en: 'For that, equipment care is everyone’s job, not only the maintenance department’s.', cues: ['zeros'] },
      ],
    },
    {
      id: 's2', lesson: TPM, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Acht pijlers', en: 'Eight pillars' },
      beats: [
        { nl: 'TPM rust in de meeste fabrieken op acht pijlers, zoals gepland onderhoud en training.', en: 'In most plants TPM rests on eight pillars, such as planned maintenance and training.', cues: [] },
        { nl: '{t:Autonoom onderhoud|Autonoom onderhoud}: operators zijn eigenaar van de basiszorg.', en: '{t:Autonomous maintenance|Autonomous maintenance}: operators own basic care.', cue: { 'Autonoom onderhoud': 'pAm' } },
        { nl: 'Gepland onderhoud is de andere helft: monteurs krijgen tijd voor vakwerk.', en: 'Planned maintenance is the other half: technicians get time for skilled work.', cues: ['pPm'] },
        { nl: 'Een gangbare verdeling: operators doen {n:5} tot {n:10} minuten controles per ploeg.', en: 'A typical split: operators do {n:5} to {n:10} minutes of checks per shift.', cues: ['pAm'] },
      ],
    },
    {
      id: 's3', lesson: TPM, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'De eerste schoonmaak', en: 'The initial clean' },
      beats: [
        { nl: 'Het begint met een eerste grote schoonmaak, van boven tot onder.', en: 'It starts with an initial clean, top to bottom.', cues: [] },
        { nl: 'Schoonmaken is inspecteren: onder het vuil lekt de pomp olie.', en: 'Cleaning is inspection: under the dirt the pump is leaking oil.', cues: ['pump'] },
        { nl: 'Een losse bout aan de motorvoet, een scheur in de koppelingskap.', en: 'A loose bolt on the motor foot, a crack in the coupling guard.', cues: ['bolt', 'guard'] },
      ],
    },
    {
      id: 's4', lesson: TPM, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Elke afwijking een label', en: 'A tag on every abnormality' },
      beats: [
        { nl: 'Elke afwijking krijgt een {t:Label|label}: wat er mis is en wie het oplost.', en: 'Every abnormality gets a {t:Tag|tag}: what is wrong and who fixes it.', cue: { Label: 'tag' } },
        { nl: 'Na één ploeg hangen er {n:37} labels aan deze ene machine.', en: 'After one shift, {n:37} tags hang on this one machine.', cues: ['tag', 'count'] },
        { nl: '{n:12} olielekken, {n:9} losse bouten, {n:6} ontbrekende afschermingen, {n:10} overig.', en: '{n:12} oil leaks, {n:9} loose bolts, {n:6} missing guards, {n:10} other.', cues: ['count'] },
      ],
    },
    {
      id: 's5', lesson: TPM, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Labels sluiten', en: 'Closing the tags' },
      beats: [
        { nl: 'Operators lossen er in de eerste week {n:21} zelf op.', en: 'Operators fix {n:21} themselves in the first week.', cues: [] },
        { nl: '{n:16} gaan naar onderhoud, met de afspraak: binnen {n:4} weken gesloten.', en: '{n:16} go to maintenance, with a promise: closed within {n:4} weeks.', cues: [] },
        { nl: 'Blijven labels maanden hangen, dan stoppen operators met melden.', en: 'When tags hang for months, operators stop reporting.', cues: [] },
        { nl: 'De scherpe vraag: hoeveel labels zijn er gehangen, en welk deel is gesloten?', en: 'The sharp question: how many tags were hung, and what share is closed?', cues: [] },
      ],
    },
    {
      id: 's6', lesson: TPM, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'CILT, elke ploeg', en: 'CILT, every shift' },
      beats: [
        { nl: '{t:CILT|CILT}: schoonmaken, inspecteren, smeren, aandraaien.', en: '{t:CILT|CILT}: clean, inspect, lubricate, tighten.', cue: { CILT: 'cilt' } },
        { nl: 'Smeren op het lager. Aandraaien: een merkstreep over bout en moer toont of hij losdraait.', en: 'Lubricate the bearing. Tighten: a match mark across bolt and nut shows if it works loose.', cues: ['stud', 'bolt'] },
        { nl: 'Visueel: min en max op het oliepeilglas, een gekleurde zone op de meter.', en: 'Visual: min and max on the oil glass, a coloured zone on the gauge.', cues: ['level', 'gauge'] },
        { nl: 'Hier een checklist van {n:8} punten: {n:7} minuten bij de start van de ploeg.', en: 'Here a checklist of {n:8} points: {n:7} minutes at shift start.', cues: [] },
      ],
    },
    {
      id: 's7', lesson: TPM, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'Wat het oplevert', en: 'What it brings' },
      beats: [
        { nl: 'Na drie maanden: storingen van {n:9} naar {n:4} per maand.', en: 'After three months: breakdowns down from {n:9} to {n:4} a month.', cues: [] },
        { nl: 'Hydraulische olie bijvullen: van {n:60} naar {n:15} liter per maand.', en: 'Hydraulic oil top-ups: down from {n:60} to {n:15} litres a month.', cues: ['tank'] },
        { nl: 'De mensenkant beslist: operators zien extra werk, monteurs vrezen voor hun rol.', en: 'The people side decides: operators see extra work, technicians fear for their role.', cues: [] },
        { nl: 'Monteurs trainen de operators en bepalen welke controles op de lijst staan.', en: 'Technicians train the operators and decide which checks go on the list.', cues: [] },
      ],
    },
    {
      id: 's8', lesson: TPM, level: 1, dur: DUR[7], still: 0.9, title: { nl: 'Meten met OEE', en: 'Measuring with OEE' },
      beats: [
        { nl: 'De voortgang meet je met {t:OEE|OEE}: beschikbaarheid × prestatie (performance) × kwaliteit.', en: 'Progress is measured with {t:OEE|OEE}: availability × performance × quality.', cue: { OEE: 'oeeC' } },
        { nl: 'Minder storingen: hogere beschikbaarheid. Minder microstops: hogere prestatie.', en: 'Fewer breakdowns: higher availability. Fewer micro-stops: higher performance.', cues: ['oeeC'] },
        { nl: '{n:85}% is een veelgenoemde norm voor wereldklasse; eerlijk gemeten zit je vaak veel lager.', en: '{n:85}% is a widely quoted world-class benchmark; honest measurement often lands far lower.', cues: ['oeeC'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/" or "&" in the spoken text. English loanwords
// in the Dutch voice were checked with espeak-ng phonemes (Piper's own bridge):
// TPM is spelled right (tee-pee-em), OEE is said as letters by the kit's SAY
// rule, CILT as letters by a Dutch and an English SAY rule added for this film
// (espeak-ng reads it as the word "silt" in both). Kept out of the Dutch narration because
// espeak-ng mangles them: "autonomous maintenance", "Total Productive
// Maintenance", "performance" (said as prestatie), "reset", "checklist"
// (stressed on -list; said as controlelijst), "pilot", "smeernippel".
const SAY = [
  [ // s1 who looks after the machine
    { nl: 'Dit is het hydraulische aggregaat van een spuitgietmachine, een machine die gesmolten kunststof in een matrijs spuit. Wie zorgt er elke dag voor deze machine?',
      en: 'This is the hydraulic power unit of an injection moulding machine, a machine that shoots molten plastic into a mould. Who looks after this machine every day?' },
    { nl: '{t:TPM|TPM} geeft daar een eigen antwoord op. Het komt uit Japan, uit de jaren zeventig. Het doel is nul storingen, nul defecten en nul ongevallen.',
      en: '{t:TPM|TPM}, total productive maintenance, has its own answer to that. It came from Japan in the nineteen seventies. The goal is zero breakdowns, zero defects and zero accidents.' },
    { nl: 'Dat lukt alleen als de zorg voor de machines van iedereen is, en niet alleen van de onderhoudsdienst. Dus ook van de mensen die de machine elke dag bedienen: de operators.',
      en: 'That only works when equipment care is everyone’s job, not only the maintenance department’s. So also the job of the people who run the machine every day: the operators.' },
  ],
  [ // s2 eight pillars
    { nl: 'De meeste fabrieken bouwen TPM op acht pijlers. Daaronder vallen gepland onderhoud, gericht verbeteren, kwaliteitsonderhoud en training.',
      en: 'Most plants build TPM on eight pillars. They include planned maintenance, focused improvement, quality maintenance and training.' },
    { nl: 'De bekendste pijler is {t:Autonoom onderhoud|autonoom onderhoud}. De operators zijn eigenaar van de basiszorg van hun machine. Zij maken schoon, kijken, smeren en draaien aan, en ze melden wat afwijkt.',
      en: 'The best-known pillar is {t:Autonomous maintenance|autonomous maintenance}. The operators own the basic care of their machine. They clean, inspect, lubricate and tighten, and they report what looks wrong.' },
    { nl: 'Gepland onderhoud is de andere helft. Nu het routinewerk bij de operators ligt, houden monteurs tijd over voor vakwerk: trillingen en temperaturen meten, en de oorzaak zoeken van storingen die steeds terugkomen.',
      en: 'Planned maintenance is the other half. With the routine work moved to the operators, technicians have time for skilled work: condition monitoring, and finding the root cause of failures that keep coming back.' },
    { nl: 'Een gangbare verdeling: operators doen {n:5} tot {n:10} minuten controles per ploeg, en monteurs lossen op wat zij vinden.',
      en: 'A typical split: operators do {n:5} to {n:10} minutes of checks per shift, and technicians fix what they find.' },
  ],
  [ // s3 the initial clean
    { nl: 'Autonoom onderhoud wordt meestal in zeven stappen ingevoerd, en de eerste is een grote schoonmaak. Met de machine veilig uit maakt het team hem van boven tot onder schoon, ook op de plekken waar al jaren niemand kwam. Bij deze proef kost dat één ploeg.',
      en: 'Autonomous maintenance is usually rolled out in seven steps, and the first is an initial clean. With the machine safely off, the team cleans it from top to bottom, including the places nobody has reached for years. In this pilot it takes one shift.' },
    { nl: 'Schoonmaken is inspecteren. Wie met aandacht schoonmaakt, ziet wat het vuil verborg. Hier lekt de pomp olie, druppel voor druppel.',
      en: 'Cleaning is inspection. Clean with attention, and you see what the dirt was hiding. Here the pump is leaking oil, drop by drop.' },
    { nl: 'Bij de motorvoet zit een bout los. In de koppelingskap zit een scheur.',
      en: 'On the motor foot a bolt is loose. The coupling guard has a crack.' },
  ],
  [ // s4 a tag on every abnormality
    { nl: 'Elke afwijking die het team vindt, krijgt een {t:Label|label}: een gekleurd kaartje aan de machine. Daarop staat wat er mis is en wie het oplost.',
      en: 'Every abnormality the team finds gets a {t:Tag|tag}: a coloured card on the machine. It says what is wrong and who fixes it.' },
    { nl: 'Na één ploeg hangen er {n:37} labels aan deze ene machine.',
      en: 'After one shift, {n:37} tags hang on this one machine.' },
    { nl: 'Het zijn {n:12} olielekken, {n:9} losse bouten, {n:6} ontbrekende afschermingen en {n:10} overige gebreken.',
      en: 'They are {n:12} oil leaks, {n:9} loose bolts, {n:6} missing guards and {n:10} other faults.' },
  ],
  [ // s5 closing the tags
    { nl: 'Operators lossen er in de eerste week {n:21} zelf op: een bout aandraaien, een klem vastzetten, een vuilnest opruimen.',
      en: 'Operators fix {n:21} themselves in the first week: tightening a bolt, securing a clamp, clearing a dirt trap.' },
    { nl: 'De andere {n:16} gaan naar onderhoud, met een duidelijke afspraak: binnen {n:4} weken gesloten.',
      en: 'The other {n:16} go to maintenance, with a clear promise: closed within {n:4} weeks.' },
    { nl: 'Daar staat of valt het mee. Als labels maanden blijven hangen, stoppen operators met melden, want er gebeurt toch niets mee. Dan sterft autonoom onderhoud.',
      en: 'This is what makes or breaks it. When tags hang for months, operators stop reporting, because nothing happens anyway. Then autonomous maintenance dies.' },
    { nl: 'Daarom een scherpe vraag voor elke fabriek. Hoeveel labels zijn er vorig kwartaal gehangen, en welk deel daarvan is gesloten?',
      en: 'So here is a sharp question for any plant: how many tags were hung last quarter, and what share of them is closed?' },
  ],
  [ // s6 CILT, every shift
    { nl: 'Na de schoonmaak volgt de dagelijkse routine: {t:CILT|CILT}. Die letters staan voor de Engelse woorden voor schoonmaken, inspecteren, smeren en aandraaien.',
      en: 'After the clean comes the daily routine: {t:CILT|CILT}. The letters stand for clean, inspect, lubricate and tighten.' },
    { nl: 'Smeren: vet op het lager, op de juiste plek en in de juiste hoeveelheid. Aandraaien: een merkstreep over bout en moer laat in één oogopslag zien of een bout is losgedraaid.',
      en: 'Lubricate: grease on the bearing, in the right place and the right amount. Tighten: a match mark painted across bolt and nut shows at a glance whether a bolt has worked loose.' },
    { nl: 'Goede controles zijn visueel: een min- en een maxstreep op het oliepeilglas, een gekleurde zone, vaak groen, op de manometer. Dan ziet iedereen meteen of het goed is.',
      en: 'Good checks are visual: min and max marks on the oil glass, a coloured zone, often green, on the pressure gauge. Then anyone sees at once whether it is right.' },
    { nl: 'Bij deze machine is dat een controlelijst van {n:8} punten. Die kost {n:7} minuten bij de start van elke ploeg.',
      en: 'On this machine it is a checklist of {n:8} points. It takes {n:7} minutes at the start of every shift.' },
  ],
  [ // s7 what it brings
    { nl: 'Na drie maanden zakken de storingen van {n:9} naar {n:4} per maand.',
      en: 'After three months, breakdowns drop from {n:9} to {n:4} a month.' },
    { nl: 'En het bijvullen van hydraulische olie zakt van {n:60} naar {n:15} liter per maand. De lekken zijn dicht, dus de olie blijft in de machine. Veel fabrieken blijven juist daar hangen, bij stap twee of drie, als de bronnen van vuil en lekken echt opgelost moeten worden.',
      en: 'And hydraulic oil top-ups fall from {n:60} to {n:15} litres a month. The leaks are fixed, so the oil stays in the machine. Many plants stall exactly there, at step two or three, when the sources of dirt and leaks must actually be fixed.' },
    { nl: 'De mensenkant beslist. Operators horen: extra werk, niet mijn taak. Monteurs zijn bang hun rol te verliezen, of vertrouwen operators niet met hun machine.',
      en: 'The people side decides. Operators hear: extra work, not my job. Technicians fear losing their role, or do not trust operators with their machine.' },
    { nl: 'Het werkt als monteurs de operators trainen en bepalen welke controles op de lijst staan, en als labels snel gesloten worden.',
      en: 'It works when technicians train the operators and decide which checks go on the list, and when tags are closed fast.' },
  ],
  [ // s8 measuring with OEE
    { nl: 'De voortgang van TPM meet je met {t:OEE|OEE}: beschikbaarheid maal prestatie maal kwaliteit.',
      en: 'You measure the progress of TPM with {t:OEE|OEE}, overall equipment effectiveness: availability times performance times quality.' },
    { nl: 'Minder storingen geven een hogere beschikbaarheid. Minder microstops, korte stops van seconden tot minuten, geven een hogere prestatie. Zo zie je de schoonmaak terug in de cijfers.',
      en: 'Fewer breakdowns give higher availability. Fewer micro-stops, short stops of seconds to minutes, give higher performance. That is how the clean shows up in the numbers.' },
    { nl: '{n:85} procent wordt vaak genoemd als norm voor wereldklasse, een vuistregel. Eerlijk gemeten komen veel fabrieken veel lager uit; de module Capaciteit en flow ontleedt dat getal in de zes grote verliezen.',
      en: '{n:85} percent is often quoted as the world-class benchmark, a rule of thumb. Measured honestly, many plants land far lower; the module Capacity and flow breaks that figure down into the six big losses.' },
  ],
];

// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
const resolved = resolveFilm(spec, await allLessons());
const FR = resolved.scenes.map((rs) => beatStarts(rs, 'nl').map((x) => Math.round((x / rs.dur) * 1000) / 1000));
resolved.scenes.forEach((rs, si) => {
  spec.scenes[si].beats.forEach((b, bi) => {
    const a0 = FR[si][bi];
    const a1 = bi + 1 < FR[si].length ? FR[si][bi + 1] : 1;
    b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
  });
});
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx, sy): world point p lands at stage (sx, sy) in a view w wide
const cam = (p, w, sx = W / 2, sy = H / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round((y + (H / 2 - sy) * (w / W)) * 10) / 10, w]; };
const MID = [-6, -6, 16];
const SIDE = (w) => cam([-4, -10, 18], w, 104);
const CLEAN = [-14, 8, 22];
const CAM = [
  { from: cam(MID, 660), to: cam(MID, 700, W / 2, 238), a: FR[0][1] - 0.06, b: FR[0][1] + 0.04 },
  { from: SIDE(1950), to: SIDE(1850) },
  { from: cam(CLEAN, 400), to: cam(CLEAN, 330) },
  { from: cam([-10, 6, 22], 440), to: SIDE(1900), a: FR[3][1] - 0.02, b: FR[3][1] + 0.1 },
  { from: SIDE(1950), to: SIDE(1850) },
  { from: cam(MID, 800, 222, 240), to: cam(MID, 770, 222, 240) },
  { from: SIDE(1950), to: SIDE(1850) },
  { from: SIDE(1950), to: SIDE(1800) },
];
const C = {
  ZC, STUD, BOLT, COWL_X, WIN, FACE_Y, TAGS, TAG_SUM, OWN, MAINT, WEEKS, POINTS, CHECK_MIN, BD, BD_H, SAVED, OIL, WORLD,
  OEE_A, OEE_P, OEE_Q, BASE_TOP, TAG_AT, LEVEL, dur: DUR, FR,
};

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.mt-glass{fill:var(--anatomy-shade-0);stroke:none}
.mt-well{fill:var(--anatomy-shade-0);stroke:none}
.mt-oil{fill:var(--anatomy-lo);stroke:none}
.mt-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mt-dial{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.mt-zone{fill:var(--anatomy-mid);stroke:none}
[data-cue][data-on] .mt-zone{fill:var(--fp-accent)}
.mt-needle{fill:none;stroke:var(--anatomy-hi);stroke-width:1.2px;stroke-linecap:round}
.mt-crack{fill:none;stroke:var(--fp-accent);stroke-width:1.6px;stroke-linejoin:round;stroke-linecap:round}
.mt-grime{fill:var(--anatomy-lo);opacity:.55;stroke:none}
.mt-string{fill:none;stroke:var(--anatomy-hi);stroke-width:.8px}
.mt-tagc{fill:var(--fp-accent);stroke:var(--anatomy-hi);stroke-width:.6px}
.mt-tagl{fill:none;stroke:var(--fp-on-accent);stroke-width:.7px;opacity:.8}
.mt-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:.4px}
.mt-mark{fill:none;stroke:var(--fp-accent);stroke-width:2px;opacity:0}
[data-cue][data-on] .mt-mark{opacity:1}
.mt-scr{fill:none;stroke:var(--fp-accent);stroke-width:.7px;stroke-linejoin:round;stroke-linecap:round}
.mt-now{fill:var(--anatomy-hi)}
.mt-rag{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linejoin:round}
.mt-tool{fill:var(--anatomy-shade-1);stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.mt-toolf{fill:none;stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linecap:round}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
.mt-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mt-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mt-col{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mt-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mt-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mt-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mt-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mt-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mt-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mt-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.mt-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.mt-dot{fill:var(--anatomy-hi)}
.mt-hollow{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.mt-chip{fill:var(--fp-accent);stroke:none}
.mt-acc{fill:var(--fp-accent);stroke:none}
.mt-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mt-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mt-band{fill:color-mix(in srgb,var(--anatomy-mid) 22%,transparent);stroke:none}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mt-tile,[data-cue][data-on] .mt-col{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .mt-col{fill:color-mix(in srgb,var(--fp-accent) 22%,transparent)}
[data-cue][data-on] .mt-txt{fill:var(--fp-accent-text)}
`;

const label = {
  nl: 'Het hydraulische aggregaat van een spuitgietmachine: op een olietank met een oliepeilglas met min- en maxstreep, een manometer met een zone, een ontluchtingsdop, een aftapplug en een typeplaat staan een pomp met slakkenhuis en persflens, een koppelingskap en een elektromotor met koelribben, klemmenkast, ventilatorkap en een smeernippel op het lager. Daarachter een OEE-bord op een voet. Eerst zit de machine onder het vuil; een doek veegt het weg en er komen een olielek, een losse bout en een scheur in de kap tevoorschijn, die elk een gekleurd label krijgen. Kaarten tonen de drie nullen van TPM, de acht pijlers, de 37 labels, het labelbord, CILT met close-ups van de merkstreep, het peilglas en de manometer, de resultaten en OEE; de kaarten met verzonnen waarden zijn gemarkeerd als voorbeeld.',
  en: 'The hydraulic power unit of an injection moulding machine: on an oil tank with an oil level glass with min and max marks, a pressure gauge with a zone, a breather cap, a drain plug and a name plate stand a pump with its volute and discharge flange, a coupling guard and an electric motor with cooling fins, terminal box, fan cowl and a grease nipple on its bearing. Behind it an OEE board on a pedestal. At first the machine is covered in dirt; a cloth wipes it off and an oil leak, a loose bolt and a crack in the guard come to light, each of which gets a coloured tag. Cards show the three zeros of TPM, the eight pillars, the 37 tags, the tag board, CILT with close-ups of the match mark, the level glass and the gauge, the results and OEE; the cards with invented values are marked as an example.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}

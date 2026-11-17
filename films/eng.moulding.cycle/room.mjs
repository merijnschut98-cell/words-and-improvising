// Dev tool, not shipped. The room of the four moulding cycle films (Task 17, pilot B: the old film "Eén cyclus van
// 30 seconden", which served moulding.cycle, .cooling, .cavities and .partcost, split into one complete film per
// lesson): the injection moulding press, the section of a mould with cooling channels and a temperature control
// unit, the mould plates, and the coins of a part's cost, with the HUD groups of their scenes. The films
// eng.moulding.cycle, .cooling, .cavities and .partcost import it; each composes its own world, HUD and stage.
//
// The model is asserted against the worked examples of the four lessons (the import fails if a value drifts). The
// kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it lives somewhere else.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { shake } from '../_kit/shake.mjs';

export const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
export const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
export const A = await import(pathToFileURL(join(SKILL, 'kit/audit.mjs')).href);
const T = await import(pathToFileURL(join(SKILL, 'kit/tube.mjs')).href);
export const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
export const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const perHour = (cycle, cavities) => (3600 / cycle) * cavities;
// cycle: the typical 30 s cycle of the first teach block
const PHASES = [['close', 2], ['inject', 1.5], ['hold', 6], ['cool', 15], ['open', 2], ['eject', 3.5]];
const CYCLE = PHASES.reduce((a, [, d]) => a + d, 0);
assert(CYCLE === 30, `phases add up to ${CYCLE} s`);
assert(PHASES[3][1] / CYCLE === 0.5, 'cooling is half the cycle');
// cycle example: a 2-cavity cap mould at 20 s, cooling 12 s at a 3 mm wall
assert(perHour(20, 2) === 360, '360 caps per hour');
const coolOf = (s) => 12 * (s / 3) ** 2;
assert(near((2.4 / 3) ** 2, 0.64, 1e-9), '(2,4 / 3)² = 0,64');
assert(near(coolOf(2.4), 7.7, 0.05), 'cooling 7,7 s at 2,4 mm');
assert(near(20 - 12 + coolOf(2.4), 15.7, 0.05), 'cycle 15,7 s');
assert(Math.round(perHour(15.7, 2)) === 459, '459 caps per hour');
assert((6 / 3) ** 2 === 4, 'twice as thick, four times the cooling');
// cooling: PA6 mould temperature 80 °C (datasheet example in the teach text)
// cavities: option A 4-cavity at 20 s, option B 8-cavity at 24 s
assert(perHour(20, 4) === 720, 'A makes 720 per hour');
assert(perHour(24, 8) === 1200, 'B makes 1.200 per hour');
// partcost: 40 g PP at € 2,00/kg + 3 % scrap; € 60 per hour; 85 %; € 80.000 over 1 million
const MAT = 0.040 * 2.0 * 1.03;
assert(near(MAT, 0.082, 0.0005), `material € ${MAT}`);
const GOOD = (3600 / 30) * 4 * 0.85;
assert(near(GOOD, 408, 1e-9), '408 good parts per hour');
const MACH = 60 / GOOD;
assert(near(MACH, 0.147, 0.0005), `machine € ${MACH}`);
const MOULD = 80000 / 1e6;
assert(near(MOULD, 0.08, 1e-12), 'mould € 0,080');
assert(near(MAT + MACH + MOULD, 0.31, 0.005), 'total € 0,31');
const CENTS = [Math.round(MAT * 100), Math.round(MACH * 100), Math.round(MOULD * 100)];
assert(CENTS.join() === '8,15,8' && CENTS[0] + CENTS[1] + CENTS[2] === 31, `coins ${CENTS}`);

// ---------------------------------------------------------------- the world
// One projection for all four sets: the press of figures/eng.moulding.cycle,
// fitted to the 640 × 400 stage. x along the machine (the clamp at −x), y toward
// the operator, z up. The other sets are drawn around the world origin and the
// camera frames each one.
const W = 640;
const H = 400;
const FLOOR = -5;
const BED = { x: -146, y: -22, w: 260, d: 44, r: 1.4 };
const BED_TOP = 34;
const ZC = 57;
const RAIL_TOP = 35.6;
const PL_Y = 21;
const PL_TOP = 80;
const BAR_R = 2.6;
const BARS = [[-16, 40], [16, 40], [-16, 74], [16, 74]];
const REAR = [-118, -106];
const MOVING = [-52, -42];
const MOULD_M = [-42, -30];
const MOULD_F = [-30, -18];
const FIXED_PL = [-18, -6];
const MOULD_P = { y: 12, z0: 44, z1: 70 };
const OPEN = 26;
const STROKE = 8;
const CAPS = [-6, 6];
const CAP_R = 4;
const CAP_H = 3;
const WELL = { x: -58, y: -11.5, w: 26, d: 23, r: 1 };
const PANEL = { x: -6, y: -50, w: 66, d: 8, r: 0.8 };
const PANEL_Z = [83, 122];
const FACE_Y = PANEL.y + PANEL.d;
const WIN = { x0: PANEL.x + 3.2, x1: PANEL.x + PANEL.w - 3.2, z0: 89.5, z1: 119, r: 1.2, depth: 0.8 };
const PANEL_POST = [27, -46];
const FIT = [
  ...k.boxCorners(BED, FLOOR, BED_TOP),
  ...k.boxCorners({ x: -140, y: -21, w: 250, d: 42 }, BED_TOP, PL_TOP),
  ...k.boxCorners({ x: PANEL.x - 1, y: PANEL.y - 1, w: PANEL.w + 2, d: PANEL.d + 3 }, PANEL_Z[0], PANEL_Z[1] + 1.4),
];
const P = k.fitProjection(FIT, W, H, { pad: 16, azimuth: 56, elevation: 27 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const NX = [-1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
// Round parts at 18 steps round (the kit's default grows with size): the page stays small.
const SOL = (profile, F, PP, o = {}) => G.solidOf(profile, F, PP, { steps: 18, ...o });
const DISC = (s0, s1, r, F, PP, o = {}) => G.disc(s0, s1, r, F, PP, { steps: 18, ...o });
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameNX = (o) => G.frameOf(o, NX, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const slab = (plan, z0, z1, style = {}, bevel = 0.4, steps = 3) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const f2 = (v) => (Math.round(v * 100) / 100).toString();

// ================================================================= set 1: the press
// Reused from figures/eng.moulding.cycle (same parts, same proved order). Two
// pieces move: the moving platen with its mould half and the screw drive.
const MOVES = { platen: [-OPEN, 0, 0], screw: [-STROKE, 0, 0] };
const R = A.recorder(P, { order: ['platen', 'screw'], spring: {} });
const STATES = [];
for (const a of [0, 0.25, 0.5, 0.75, 1]) for (const b of [0, 0.5, 1]) STATES.push({ label: `platen ${a} screw ${b}`, shares: [a, b] });
function put(name, ref, svg, shapes, { piece = '', bias = 0, attrs = '' } = {}) {
  const tag = piece ? ` data-pc="${piece}"` : '';
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVES[piece] : [0, 0, 0], attrs: tag + attrs });
}
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { ...style, inner }) + extra, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  return put(name, [cx, cy, (z0 + z1) / 2], S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { ...style, inner }) + extra, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), S(SOL(profile, F, P), { ...style, inner }) + extra, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), S(DISC(s0, s1, r, F, P, steps ? { steps } : {}), { ...style, inner }) + extra, [shape], opts);
}
let clips = 0;
function rod(name, F, from, to, r, stroke, style = {}, opts = {}) {
  const id = `fp-clip-${clips++}`;
  const R0 = G.rodOut(F, from, to, r, P, { stroke });
  const svg = `<clipPath id="${id}"><path data-hold="" d="${R0.clip}"/></clipPath><g clip-path="url(#${id})">${S(R0.paths, style)}</g>`;
  const shape = R.solid(A.slide(F, from, to, r, { name }));
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), svg, [shape], opts);
}
function recess({ x0, x1, z0, z1, r, depth }, y, back = '', backClass = 'mc-glass') {
  const id = `fp-clip-${clips++}`;
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

const pressHalo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -2), FLOOR, 2, P)}"/>`, `<path class="iso-halo" d="${k.haloOf({ x: 16, y: -54, w: 22, d: 16, r: 3 }, FLOOR, 1, P)}" style="opacity:.6"/>`];
for (const x of [-138, -66, 14, 104]) for (const y of [-16, 16]) {
  post('stand.foot', x, y, 2.8, FLOOR, 0, { tone: 'lo' }, { steps: 6 }); // a hex levelling foot
}
{
  const fy = BED.y + BED.d;
  const seams = [-62, 18].map((x) => k.segment([x, fy, 0], [x, fy, BED_TOP], P)).join('');
  const slots = [];
  for (const [x0, x1] of [[-130, -78], [-50, 6], [30, 98]]) for (const z of [8, 11, 14]) slots.push(k.pathOf(k.roundedPlan({ x: x0, y: z, w: x1 - x0 - 30, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u + 15, fy, w])), true));
  const screws = [-140, -68, -56, 12, 24, 108].flatMap((x) => [[x, fy, 3], [x, fy, BED_TOP - 3]]);
  const label = [[-36, fy, 27], [-14, fy, 27], [-14, fy, 20], [-36, fy, 20]];
  const extra = `<path class="mc-card" d="${k.pathOf(label.map(at), true)}"/>`
    + L([25.4, 23.6, 21.8].map((z, i) => k.segment([-34.4, fy, z], [-34.4 + [17, 11, 14][i], fy, z], P)).join(''), { tone: 'lo', free: true })
    + Dt(screws.map(at), { size: 0.42 });
  box('bed.frame', BED, 0, BED_TOP, { tone: 'mid' }, {
    steps: 3,
    bevel: 0.7,
    inner: L(seams + slots.join('') + k.sideSeam(BED, 4.5, P, 3), { tone: 'lo' }),
    extra: extra + `<path class="mc-well" d="${k.planOutline(WELL, BED_TOP, P, 3)}"/>` + L(k.planOutline(WELL, BED_TOP, P, 3), { tone: 'lo' }) + L(k.planOutline({ x: 4, y: -18, w: 106, d: 36, r: 1 }, BED_TOP, P, 3), { tone: 'faint' }),
  });
}
for (const y0 of [-15.5, 12.5]) box('clamp.rail', { x: REAR[1], y: y0, w: FIXED_PL[0] - REAR[1], d: 3, r: 0.3 }, BED_TOP, RAIL_TOP, { tone: 'mid', crease: 'lo' }, { steps: 2 });
{
  const plan = { x: REAR[0], y: -PL_Y, w: REAR[1] - REAR[0], d: 2 * PL_Y, r: 0.8 };
  box('clamp.rear', plan, BED_TOP, PL_TOP, { tone: 'mid' }, { steps: 2, bevel: 0.6, extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }) });
  turned('clamp.cylinder', frameNX([REAR[0], 0, ZC]), [[0, 14], [9, 14], [9, 14.6], [11, 14.6], [11, 14], [18, 14], [18, 15], [22, 15], [23, 13.4]], { tone: 'mid' });
}
{
  const plan = { x: FIXED_PL[0], y: -PL_Y, w: FIXED_PL[1] - FIXED_PL[0], d: 2 * PL_Y, r: 0.8 };
  box('clamp.fixed', plan, BED_TOP, PL_TOP, { tone: 'mid' }, { steps: 2, bevel: 0.6, extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }) });
  for (const [y, z] of BARS) discAt('clamp.nut', frameX([FIXED_PL[1], y, z]), 0, 3, 4.2, { tone: 'mid' }, { steps: 6, extra: Dt([at([FIXED_PL[1] + 3, y, z])], { size: 0.45, tone: 'hi' }) });
  discAt('clamp.ring', frameX([FIXED_PL[1], 0, ZC]), 0, 1, 7, { tone: 'mid' }, { inner: L(G.circleOf(frameX([FIXED_PL[1], 0, ZC]), 1, 3.2, P, 36), { tone: 'lo' }) });
}
{
  const plan = { x: MOVING[0], y: -PL_Y, w: MOVING[1] - MOVING[0], d: 2 * PL_Y, r: 0.8 };
  box('platen.moving', plan, RAIL_TOP, PL_TOP, { tone: 'mid' }, {
    piece: 'platen', steps: 2, bevel: 0.6,
    inner: L(k.sideSeam(plan, RAIL_TOP + 4, P, 2), { tone: 'faint' }),
    extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }),
  });
  // the moving mould half: the two cavities' cores on its parting face (the cue for "Holte")
  const mplan = { x: MOULD_M[0], y: -MOULD_P.y, w: MOULD_M[1] - MOULD_M[0], d: 2 * MOULD_P.y, r: 0.5 };
  const FF = (y) => frameX([MOULD_M[1], y, ZC]);
  const cores = `<g data-cue="cavity">${CAPS.map((y) => `<path class="mc-well" d="${G.circleOf(FF(y), 0, CAP_R, P, 40)}"/>`).join('')}`
    + L(CAPS.map((y) => G.circleOf(FF(y), 0, CAP_R, P, 40) + G.circleOf(FF(y), 0, CAP_R - 1.6, P, 32)).join(''), { tone: 'lo' }) + '</g>'
    + L(k.segment([MOULD_M[1], CAPS[0] + CAP_R, ZC], [MOULD_M[1], CAPS[1] - CAP_R, ZC], P), { tone: 'lo' })
    + Dt([[MOULD_M[1], -9.5, 47], [MOULD_M[1], 9.5, 47], [MOULD_M[1], -9.5, 67], [MOULD_M[1], 9.5, 67]].map(at), { size: 0.5, tone: 'hi' });
  box('platen.mould', mplan, MOULD_P.z0, MOULD_P.z1, { tone: 'mid' }, { piece: 'platen', steps: 2, bevel: 0.4, inner: L(k.sideSeam(mplan, 52, P, 2), { tone: 'faint' }), extra: cores });
  for (const y of [-6, 6]) post('platen.coupling', -36, y, 1.3, MOULD_P.z1, MOULD_P.z1 + 2.6, { tone: 'mid' }, { piece: 'platen', steps: 6, extra: Dt([at([-36, y, MOULD_P.z1 + 2.6])], { size: 0.4, tone: 'hi' }) });
}
{
  const plan = { x: MOULD_F[0], y: -MOULD_P.y, w: MOULD_F[1] - MOULD_F[0], d: 2 * MOULD_P.y, r: 0.5 };
  box('mould.fixed', plan, MOULD_P.z0, MOULD_P.z1, { tone: 'mid' }, {
    steps: 2, bevel: 0.4, inner: L(k.sideSeam(plan, 62, P, 2), { tone: 'faint' }),
    extra: Dt([[-26, MOULD_P.y, 66], [-22, MOULD_P.y, 66], [-26, MOULD_P.y, 48], [-22, MOULD_P.y, 48]].map(at), { size: 0.42 }),
  });
  for (const y of [-6, 6]) post('mould.coupling', -24, y, 1.3, MOULD_P.z1, MOULD_P.z1 + 2.6, { tone: 'mid' }, { steps: 6, extra: Dt([at([-24, y, MOULD_P.z1 + 2.6])], { size: 0.4, tone: 'hi' }) });
}
for (const [y, z] of BARS) {
  rod('clamp.bar-rear', frameX([REAR[1], y, z]), 0, MOVING[0] - REAR[1], BAR_R, OPEN, { tone: 'mid' }, { piece: 'platen' });
  rod(y > 0 ? 'clamp.bar-near' : 'clamp.bar-far', frameNX([FIXED_PL[0], y, z]), 0, FIXED_PL[0] - MOVING[1], BAR_R, OPEN, { tone: 'mid' }, { piece: 'platen' });
}
rod('clamp.ram', frameX([REAR[1], 0, ZC]), 1.6, MOVING[0] - REAR[1], 6, OPEN, { tone: 'hi', crease: 'lo' }, { piece: 'platen' });
discAt('clamp.gland', frameX([REAR[1], 0, ZC]), 0, 1.6, 8.2, { tone: 'mid' }, {});
const BASE = { x: 2, y: -14, w: 110, d: 28, r: 0.8 };
const BASE_TOP = 42;
box('inj.base', BASE, BED_TOP, BASE_TOP, { tone: 'mid' }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(BASE, 38, P, 2), { tone: 'faint' }) });
{
  const FB = frameX([FIXED_PL[1] + 1, 0, ZC]);
  turned('inj.nozzle', FB, [[0, 1.6], [2.5, 2.6], [7, 3.6], [8.6, 4.6], [10, 4.6]], { tone: 'mid' });
  const prof = [[10, 6.2]];
  let s = 10;
  for (let band = 0; band < 4; band++) { prof.push([s + 4, 6.2], [s + 4, 7.6], [s + 11, 7.6], [s + 11, 6.2]); s += 13; }
  prof.push([62 - FB.o[0], 6.2]);
  turned('inj.barrel', FB, prof, { tone: 'hi', crease: 'lo' }, {});
  for (let band = 0; band < 4; band++) {
    const x = FB.o[0] + 10 + 13 * band + 7.5;
    box('inj.heater-box', { x: x - 1.6, y: -1.4, w: 3.2, d: 2.8, r: 0.3 }, ZC + 7.4, ZC + 9.6, { tone: 'mid' }, { steps: 2, extra: Dt([at([x, 0, ZC + 9.6])], { size: 0.4, tone: 'hi' }) });
  }
  box('inj.saddle', { x: 43, y: -1.2, w: 4.4, d: 2.4, r: 0.3 }, BASE_TOP, ZC - 6.2, { tone: 'mid' }, { steps: 2 });
}
{
  const throat = { x: 62, y: -9, w: 12, d: 18, r: 0.6 };
  box('inj.throat', throat, BASE_TOP, 68, { tone: 'mid' }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(throat, 64, P, 2), { tone: 'faint' }), extra: Dt(k.corners(throat, 1.6).map(([x, y]) => at([x, y, 68])), { size: 0.42 }) });
  post('inj.hopper-neck', 68, 0, 3.4, 68, 72, { tone: 'mid' }, { steps: 24 });
  const FH = frameZ([68, 0, 72]);
  turned('inj.hopper', FH, [[0, 3.4], [9, 11.2], [22, 11.2]], { tone: 'mid' }, { inner: k.fadedSvg(G.ribsOf(FH, 9.6, 21.4, 11.2, 18, P, { fade: [0.04, 0.4], seams: true }), { tone: 'faint' }) });
  discAt('inj.hopper-lid', FH, 22, 23.6, 11.8, { tone: 'mid' }, { extra: Dt([at([68, 0, 72 + 23.6])], { size: 0.5, tone: 'hi' }) });
}
for (const y0 of [-10.5, 7.5]) box('inj.rail', { x: 76, y: y0, w: 34, d: 3, r: 0.3 }, BASE_TOP, BASE_TOP + 1.6, { tone: 'mid', crease: 'lo' }, { steps: 2 });
const DRIVE = { x: 83, y: -12, w: 20, d: 24, r: 0.8 };
rod('screw.shank', frameX([74, 0, ZC]), 0.8, DRIVE.x - 74, 2.6, STROKE, { tone: 'hi', crease: 'lo' }, { piece: 'screw' });
discAt('inj.seal', frameX([74, 0, ZC]), 0, 0.8, 4, { tone: 'mid' }, {});
{
  box('screw.drive', DRIVE, BASE_TOP + 1.6, 70, { tone: 'mid' }, { piece: 'screw', steps: 2, bevel: 0.6, inner: L(k.sideSeam(DRIVE, 50, P, 2), { tone: 'faint' }), extra: Dt(k.corners(DRIVE, 1.8).map(([x, y]) => at([x, y, 70])), { size: 0.42 }) });
  const FM = frameZ([96, 0, 70]);
  turned('screw.motor', FM, [[0, 6.6], [15, 6.6]], { tone: 'mid' }, { piece: 'screw', inner: k.fadedSvg(G.ribsOf(FM, 0.6, 14.4, 6.6, 20, P, { fade: [0.04, 0.42], seams: true }), { tone: 'lo' }) });
  discAt('screw.motor-cap', FM, 15, 17, 5.2, { tone: 'mid' }, { piece: 'screw', extra: Dt([at([96, 0, 87])], { size: 0.45, tone: 'hi' }) });
  box('screw.pointer-arm', { x: 83.6, y: 12, w: 1.6, d: 3.6, r: 0.2 }, BASE_TOP + 0.3, BASE_TOP + 1.6, { tone: 'mid', crease: 'lo' }, { piece: 'screw', steps: 1 });
  box('screw.pointer', { x: 83.6, y: 14.8, w: 1.6, d: 0.8, r: 0.1 }, 40.4, BASE_TOP + 0.3, { tone: 'hi', crease: 'lo' }, { piece: 'screw', steps: 1 });
}
{
  const ticks = [];
  for (let i = 0; i <= 20; i++) ticks.push(k.segment([73 + i, 14.6, 40], [73 + i, 14.6, 40 - (i % 5 === 0 ? 2.2 : 1.2)], P));
  box('inj.ruler', { x: 72, y: 14, w: 22, d: 0.6, r: 0.1 }, 36, 40, { tone: 'mid' }, { steps: 1, inner: L(ticks.join(''), { tone: 'lo' }) });
}
{
  // the controller: its screen shows the 30 s cycle as a static phase bar
  const foot = { x: 19, y: -53, w: 16, d: 14, r: 1 };
  box('stand.panel-foot', foot, FLOOR, FLOOR + 1.4, { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 2.2).map(([x, y]) => at([x, y, FLOOR + 1.4])), { size: 0.45 }) });
  post('panel.post', PANEL_POST[0], PANEL_POST[1], 2.4, FLOOR + 1.4, PANEL_Z[0] - 5, { tone: 'mid' }, { steps: 24 });
  post('panel.collar', PANEL_POST[0], PANEL_POST[1], 3.6, PANEL_Z[0] - 5, PANEL_Z[0], { tone: 'mid' }, { steps: 28, bevel: 0.3 });
  const t0 = WIN.x0 + 4;
  const t1 = WIN.x1 - 4;
  const tx = (t) => t0 + ((t1 - t0) * t) / CYCLE;
  let acc = 0;
  let bars = '';
  let seps = '';
  for (const [name, d] of PHASES) {
    bars += `<path class="mc-seg"${name === 'cool' ? ' data-cool=""' : ''} d="M${f2(tx(acc))} ${-(WIN.z0 + 6)}H${f2(tx(acc + d))}V${-(WIN.z0 + 3.4)}H${f2(tx(acc))}Z"/>`;
    if (acc > 0) seps += `M${f2(tx(acc))} ${-(WIN.z0 + 6)}V${-(WIN.z0 + 3.4)}`;
    acc += d;
  }
  const trace = [];
  for (let i = 0; i <= 60; i++) {
    const t = (CYCLE * i) / 60;
    const open = t < 2 ? 1 - t / 2 : t < 24.5 ? 0 : t < 26.5 ? (t - 24.5) / 2 : 1;
    trace.push(`${f2(tx(t))} ${f2(-(WIN.z0 + 9 + 14 * open))}`);
  }
  const screen = `${bars}<path class="mc-sep" d="${seps}"/><path class="iso-line" data-tone="lo" d="M${f2(t0)} ${-(WIN.z0 + 2.4)}H${f2(t1)}"/><path class="mc-trace" d="M${trace.join('L')}"/>`;
  const fy = FACE_Y;
  box('panel.box', PANEL, PANEL_Z[0], PANEL_Z[1], { tone: 'mid' }, {
    steps: 2, bevel: 0.6,
    extra: recess(WIN, fy, screen) + Dt([[PANEL.x + 1.4, fy, PANEL_Z[0] + 1.4], [PANEL.x + PANEL.w - 1.4, fy, PANEL_Z[0] + 1.4], [PANEL.x + 1.4, fy, PANEL_Z[1] - 1.4], [PANEL.x + PANEL.w - 1.4, fy, PANEL_Z[1] - 1.4]].map(at), { size: 0.42 }),
  });
  const FL = (x) => frameY([x, fy, 86.2]);
  discAt('panel.lamp', FL(PANEL.x + 5), 0, 1.2, 1.6, { tone: 'hi', crease: 'lo' }, {});
  for (const x of [PANEL.x + 11]) box('panel.key', { x: x - 1.6, y: fy, w: 3.2, d: 1, r: 0.3 }, 84.8, 87.6, { tone: 'mid' }, { steps: 1 });
  box('panel.hood', { x: PANEL.x - 1, y: PANEL.y - 0.6, w: PANEL.w + 2, d: PANEL.d + 2.2, r: 0.8 }, PANEL_Z[1], PANEL_Z[1] + 1.4, { tone: 'mid' }, { steps: 2, bevel: 0.3 });
}
A.settle(R, P, { states: STATES });
R.items.sort((a, b) => a.key - b.key);
// The shot (two caps on a runner) is live: it sits on the moving half's face,
// the ejectors push it off and it drops into the well. It goes in after the last
// item behind it, as in the figure.
const FRONT = /^(mould\.|clamp\.fixed|clamp\.nut|clamp\.ring|clamp\.bar-near|inj\.|screw\.)/;
const BACK = /^(platen\.|clamp\.bar-rear|clamp\.bar-far|clamp\.rear|clamp\.cylinder|clamp\.ram|clamp\.gland|clamp\.rail|bed\.|stand\.(foot|jack))/;
let lastBack = -1;
R.items.forEach((item, index) => { if (BACK.test(item.name)) lastBack = index; });
{
  const top = R.items[lastBack].key;
  let bump = 0;
  R.items.slice(0, lastBack).forEach((item) => { if (item.name.startsWith('clamp.bar-near')) item.key = top + 0.001 * ++bump; });
  R.items.sort((a, b) => a.key - b.key);
  lastBack = -1;
  R.items.forEach((item, index) => { if (BACK.test(item.name)) lastBack = index; });
}
const early = R.items.slice(0, lastBack + 1).filter((item) => FRONT.test(item.name)).map((i) => i.name);
const capSvg = (y) => {
  const F = frameX([MOULD_M[1], y, ZC]);
  return S(DISC(0, CAP_H, CAP_R, F, P), { tone: 'hi', crease: 'lo' }) + L(G.circleOf(F, CAP_H, CAP_R - 1.2, P, 36), { tone: 'lo' });
};
const SHOT = (() => {
  const Fs = frameX([MOULD_M[1], 0, ZC]);
  const Fr = G.frameOf([MOULD_M[1] + 1.2, CAPS[0] + CAP_R - 0.2, ZC], Y, X, Zv);
  return [S(DISC(0, CAPS[1] - CAPS[0] - 2 * CAP_R + 0.4, 0.9, Fr, P), { tone: 'hi', crease: 'lo' }), S(DISC(1.2, CAP_H + 1.6, 1.2, Fs, P), { tone: 'hi', crease: 'lo' }), capSvg(CAPS[0]), capSvg(CAPS[1])].join('');
})();
const wellClip = (() => {
  const pts = [];
  for (const [x, y] of k.corners(WELL, 0)) pts.push(at([x, y, BED_TOP]), at([x, y, 140]));
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  const upper = [];
  for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return k.pathOf([...lower.slice(0, -1), ...upper.slice(0, -1)], true);
})();
// v14b: the intro lights up the machine's units, so each item carries the cue of its unit
const UNIT = [[/^(clamp\.|platen\.moving)/, 'clampunit'], [/^(mould\.|platen\.(mould|coupling))/, 'mould'], [/^(inj\.|screw\.)/, 'injunit']];
const unitOf = (name) => (UNIT.find(([re]) => re.test(name)) || [])[1];
const pressItems = R.items.map((item) => {
  const body = item.attrs ? `<g${item.attrs}>${item.svg}</g>` : item.svg;
  const unit = unitOf(item.name);
  return unit ? `<g data-cue="${unit}">${body}</g>` : body;
});
pressItems.splice(lastBack + 1, 0, `<clipPath id="fp-well-clip"><path d="${wellClip}"/></clipPath><g clip-path="url(#fp-well-clip)"><g data-k="shot">${SHOT}</g></g>`);
const pressSet = g('press', pressHalo.join('') + pressItems.join(''));

// ================================================================= sets 2–4
// Drawn in the page at load by sets.js (kit only); the build runs the same code
// for its checks. Their constants:
// the section: 1 mm = MM world units; the cut face is the plane y = 0, the
// block runs back to y = −BD. The part: a 3 mm wall with a boss twice as thick;
// cooling channels run through the steel perpendicular to the cut.
const MM = 8;
const BX = 14 * MM;
const BZ = 7 * MM;
const BD = 6 * MM;
const SWALL = 3 * MM;
const WALL_X = [-11 * MM, 11 * MM];
const BOSS = [3 * MM, 9 * MM]; // x range; 6 mm = twice the wall
const CHAN_R = 0.9 * MM;
const CHAN = [[-8, 5.2], [-2.7, 5.2], [2.7, 5.2], [8, 5.2], [-8, -2.2], [-2.7, -2.2], [6, -5.7]].map(([x, z]) => [x * MM, z * MM]);
const TCU = { x: BX + 34, y: -BD - 6, w: 46, d: 44, r: 1.4 };
const TCU_Z = [-BZ + 2, 18];
// the plates: the moving half's parting face, with an H runner whose flow paths are all the same length
const PZ = 0;
const CAV4 = [[-28, -30], [28, -30], [-28, 30], [28, 30]];
const CAV8 = [-84, -28, 28, 84].flatMap((x) => [[x, -30], [x, 30]]);
// each runner ends at its cavity's edge, where the gate is
const gateAt = (pts) => { const [a, b] = pts.slice(-2); const d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [...pts.slice(0, -1), [b[0] + ((a[0] - b[0]) * 15) / d, b[1] + ((a[1] - b[1]) * 15) / d]]; };
const RUN4 = CAV4.map(([x, y]) => gateAt([[0, 0], [0, y], [x, y]]));
const RUN8 = CAV8.map(([x, y]) => gateAt([[0, 0], [Math.sign(x) * 56, 0], [Math.sign(x) * 56, y], [x, y]]));
{
  const len = (pts) => pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  assert(new Set(RUN8.map(len)).size === 1, 'the H runner gives every cavity the same flow path');
}
const PLATE4 = { x: -66, y: -62, w: 132, d: 124, r: 2 };
const PLATE8 = { x: -122, y: -62, w: 244, d: 124, r: 2 };
const FAM = { lid: { x: -100, y: -40, w: 76, d: 80, r: 6 }, base: { x: 18, y: -40, w: 84, d: 80, r: 6 } };
const POCKET_R = 15;
// the coins: one part's cost in cents, material 8, machine 15, mould 8
const COIN_R = 13;
const COIN_H = 3.4;
const STACKS = [[-30, 0], [10, 0], [50, 0]];
const COINS_BASE = { x: -96, y: -36, w: 176, d: 72, r: 3 };
const SETC = { MM, BX, BZ, BD, CHAN, CHAN_R, TCU, TCU_Z, PZ, CAV4, CAV8, RUN4, RUN8, PLATE4, PLATE8, FAM, POCKET_R, COINS_BASE };
const setsSource = readFileSync(join(HERE, 'sets.js'), 'utf8');
const SETS = new Function('K', 'C', 'P', `${setsSource}\nreturn buildSets(K, C, P);`)(k, SETC, P);

// the hoses (tubes from the kit's tube module, drawn here): supply from the
// upper coupling, return to the lower one; each lands on a nipple on top of the unit
const HOSE_R = 2.2;
const hose = (pts) => T.tubePieces(G.fillet(pts, 9, 8), HOSE_R, P, { maxLength: 60, spacing: 7 }).map((piece) => T.tubeSvg(piece, { tone: 'mid' })).join('');
const NIP = TCU_Z[1] + 3;
const hoses = [
  hose([[BX + 6.6, -BD + 14, 4.5 * MM], [BX + 20, -BD + 14, 4.5 * MM], [BX + 26, TCU.y + 12, 34], [TCU.x + 18, TCU.y + 12, 34], [TCU.x + 18, TCU.y + 12, NIP]]),
  hose([[BX + 6.6, -BD + 14, -4.5 * MM], [BX + 20, -BD + 14, -4.5 * MM], [BX + 24, TCU.y + 30, 0], [BX + 24, TCU.y + 30, 44], [TCU.x + 18, TCU.y + 30, 44], [TCU.x + 18, TCU.y + 30, NIP]]),
];

// cooling: the step-down example, 4 cavities, 24 s with 14 s of cooling, 11 s good, 10 s out of tolerance, 11,5 s set
assert(perHour(24, 4) === 600, 'cooling: 600 per hour at 24 s');
assert(near(24 - (14 - 11.5), 21.5, 1e-9), 'cooling: cycle 21,5 s');
assert(Math.round(perHour(21.5, 4)) === 670, 'cooling: 670 per hour');
assert(near(perHour(21.5, 4) / 600, 1.12, 0.005), 'cooling: about 12 % more');
// cavities: 2 million caps a year; A 4 cavities at 20 s on 60 per hour with a 80.000 mould, B 8 cavities at 24 s on 75 with 140.000
const hoursA = 2000000 / perHour(20, 4);
const hoursB = 2000000 / perHour(24, 8);
assert(Math.round(hoursA) === 2778 && Math.round(hoursA * 60 / 100) * 100 === 166700, 'cavities: A is 2.778 hours, about € 166.700');
assert(Math.round(hoursB) === 1667 && Math.round(hoursB * 75) === 125000, 'cavities: B is 1.667 hours, € 125.000');
assert(Math.round((hoursA * 60 - hoursB * 75) / 100) * 100 === 41700, 'cavities: B saves about € 41.700 a year');
assert(near(60000 / 41700, 1.44, 0.01) && Math.round((60000 / 41700) * 12) === 17, 'cavities: payback 1,4 years, 17 months');
assert(near(60000 / ((hoursA * 60 - hoursB * 75) / 4), 5.76, 0.05), 'cavities: a quarter of the volume, nearly six years');
assert(perHour(30, 4 - 1) / perHour(30, 4) === 0.75 && 7 / 8 === 0.875, 'cavities: a closed cavity costs 25 % of 4, one eighth of 8');

// ---------------------------------------------------------------- HUD (stage space)
const BAR = { x0: 46, x1: W - 46, y: H - 36, h: 14 };
const hudKeys = [
  g('phasebar', '', ' data-cue="cycle"'),
  g('coolseg', '', ' data-cue="cool"'),
  g('phasetext', ''),
  g('mag', '', ' data-cue="turb"'),
  g('therm', ''),
  g('thmark', '', ' data-cue="eject"'),
  g('labels', '', ' data-cue="labels"'),
  g('card', '', ' data-cue="card"'),
];
// Coordinates to 0.1 px: the press scene zooms at most 2.6×, so a step is under 0.3 px on screen.
const tight = (html) => html.replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d{2,}/g, (v) => String(Math.round(Number(v) * 10) / 10))}"`);
// The drawing of one film: only the sets its scenes use (sets: 'press', 'section', 'plates', 'coinset'), so a page does
// not carry the press of a film that never shows it.
export const worldOf = (sets) => [
  sets.includes('press') ? g('press', pressSet) : '',
  sets.includes('section') ? g('section', `${g('secbody', '')}${g('tcu', '')}${g('hoses', hoses.join(''), ' data-cue="channels"')}`) : '',
  sets.includes('plates') ? g('plates', '') : '',
  sets.includes('coinset') ? g('coinset', '') : '',
].join('');
export const svgOf = (sets) => tight(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', worldOf(sets))}${g('hud', hudKeys.join(''))}</svg>`);

// ---------------------------------------------------------------- cameras
export const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
// a camera that fits world points into a rectangle of the stage [x0, y0, x1, y1]
export const fitCam = (points, [x0, y0, x1, y1], zoom = 1) => {
  const xy = points.map(at);
  const xs = xy.map((p) => p[0]);
  const ys = xy.map((p) => p[1]);
  const [l, r, t, b] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = Math.min((x1 - x0) / (r - l), (y1 - y0) / (b - t)) * zoom;
  const cx = (l + r) / 2 - ((x0 + x1) / 2 - W / 2) / s;
  const cy = (t + b) / 2 - ((y0 + y1) / 2 - H / 2) / s;
  return [Math.round(cx * 10) / 10, Math.round(cy * 10) / 10, Math.round((W / s) * 10) / 10];
};
export const blockPts = [...k.boxCorners({ x: -BX, y: -BD, w: 2 * BX, d: BD }, -BZ - 4, BZ + 14), [BX + 7, -BD + 14, 0]];
// a camera that puts the world point p at stage position (W/2 + sx, H/2 + sy), width w: room for a card beside it
export const camAt = (p, w, sx = 0, sy = 0) => { const [x, y] = at(p); return [Math.round((x - (sx * w) / W) * 10) / 10, Math.round((y - (sy * w) / W) * 10) / 10, w]; };
export const unitPts = [...blockPts, ...k.boxCorners(TCU, TCU_Z[0] - 6, 46)];

// ---------------------------------------------------------------- constants the stage reads (JSON into the page)
export const C = {
  PHASES, CYCLE, OPEN, STROKE, CAP_H, MOULD_M, ZC, BAR,
  MM, BX, BZ, BD, SWALL, WALL_X, BOSS, CHAN, CHAN_R,
  CAV4, CAV8, RUN4, RUN8, POCKET_R, FAM, PLATE8, PZ,
  COIN_R, COIN_H, STACKS, CENTS, COST: [MAT, MACH, MOULD],
  SETC,
  HOT: [9.5 * MM, 1.5 * MM], // a hot spot the water does not reach (the section)
};

export { P, W, H, at, g, near, assert, perHour, FIT, SETC, PLATE4, PLATE8, COINS_BASE, FAM, TCU, TCU_Z, BX, BZ, BD, MM, SETS };

// ---------------------------------------------------------------- page script (shared by the four films)
// Leading indentation goes (and whole-line comments): about 15 KB less.
const lean = (src, dropComments) => src.split('\n').map((line) => line.trim()).filter((line) => line && !(dropComments && line.startsWith('//'))).join('\n');
// The page script of a film: the anatomy kit (tree-shaken: only what the scripts name), the preamble (what the stage
// reads), sets.js (buildSets, which draws the section, the plates and the coins at load), the stage library of this
// folder and the film's own stage (its scenes and the closing of the function), then the beat warp.
// sets: the sets of sets.js this film draws ('section', 'tcu', 'plates', 'coins'); only their code goes into the page.
// parts: the parts of stage-lib.js this film uses ('press', 'section', 'gauges', 'plates', 'coins'; marked //@part).
export function stageScriptOf(ownStage, { cams, sets: want, parts = [], extra = '' }) {
  const LIB = lean(readFileSync(join(HERE, 'stage-lib.js'), 'utf8').replace(/\/\/@part (\w+)\n([\s\S]*?)\/\/@endpart\n/g, (m, name, body) => (parts.includes(name) ? body : '')), true);
  const OWN = lean(readFileSync(ownStage, 'utf8'), true);
  const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(cams)};\nconst W = ${W}, H = ${H};\nconst WANT = ${JSON.stringify(want)};\n${extra}`;
  const names = { section: 'setSection', tcu: 'setTcu', plates: 'setPlates', coins: 'setCoins' };
  const setParts = setsSource.split(/\n(?=function )/);
  const sets = lean(setParts.filter((p) => { const m = /^function (\w+)/.exec(p); return !m || ['setHelpers', 'buildSets'].includes(m[1]) || want.some((w) => names[w] === m[1]); }).join('\n'), true);
  const RUN = ['timeline.mjs', 'player-runtime.js', 'beatwarp.js'].map((f) => readFileSync(join(HERE, '../_kit', f), 'utf8')).join('\n');
  const kit = shake(kitScript(), `${sets}\n${LIB}\n${OWN}\n${RUN}`);
  return `${kit.prelude}${kit.body}\n${preamble}${sets}\n${LIB}\n${OWN}\n;\n${readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8')}`;
}
// the beat starts of every scene (fractions of the scene, by the Dutch words), as the stage times its moves
export function beatTimes(scenes, plainWords, beatStarts) {
  C.B = scenes.map((s) => {
    const fake = { dur: 1, beats: s.beats.map((b) => ({ text: { nl: 'x '.repeat(plainWords(b.nl)).trim() } })) };
    return beatStarts(fake, 'nl').concat(1);
  });
  C.dur = scenes.map((s) => s.dur);
}

export const css = `
.iso{--mc-glass:#081A1E;--mc-well:#06161A;--mc-seg:#2A4A4A;--mc-segc:#45615D;--fp-steel:#16353D;--fp-water:#0A1E23;--fp-solid:#45615D;--fp-melt:#E4DDCC}
.iso[data-theme="light"]{--mc-glass:#E4DCC9;--mc-well:#C9C0AA;--mc-seg:#C2C3B2;--mc-segc:#7D877A;--fp-steel:#FBF8F1;--fp-water:#DDD4BF;--fp-solid:#A9AE9E;--fp-melt:#FFFBEF}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-dim{fill:var(--anatomy-muted)}
.fp-panel{fill:var(--anatomy-card);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.fp-cur{fill:color-mix(in srgb,var(--fp-accent) 16%,transparent);stroke:none}
.mc-glass{fill:var(--mc-glass);stroke:none}
.mc-well{fill:var(--mc-well);stroke:none}
.mc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1px;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.mc-seg{fill:var(--mc-seg);stroke:none}
.mc-seg[data-cool]{fill:var(--mc-segc)}
.mc-sep{fill:none;stroke:var(--mc-glass);stroke-width:.35px}
.mc-trace{fill:none;stroke:var(--anatomy-mid);stroke-width:.55px;stroke-linejoin:round;stroke-linecap:round}
.fp-steel{fill:var(--fp-steel);stroke:none}
.fp-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:.8px;vector-effect:non-scaling-stroke}
.fp-water{fill:var(--fp-water);stroke:none}
.fp-solid{fill:var(--fp-solid);stroke:none}
.fp-melt{fill:var(--fp-melt);stroke:none;opacity:.9}
.fp-eye{fill:none;stroke:var(--anatomy-mid);stroke-width:2.4px;vector-effect:non-scaling-stroke}
.fp-heat{fill:var(--anatomy-mid);stroke:none}
.fp-swirl{fill:none;stroke:var(--anatomy-mid);stroke-width:1px;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-runline{opacity:0}
.fp-meltline{fill:none;stroke:var(--fp-melt);stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.fp-pool{fill:var(--fp-melt);stroke:none;opacity:.8}
.fp-meter-bg{fill:var(--anatomy-shade-1);stroke:none}
.fp-meter-fill{fill:var(--anatomy-mid);stroke:none;opacity:.55}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
.fp-coin-face{fill:var(--anatomy-face)}
.fp-scale{fill:var(--anatomy-lo);stroke:none;opacity:.8}
.fp-bad{fill:none;stroke:var(--fp-accent);stroke-width:2.4px;stroke-linecap:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-hatch{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-water{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-swirl{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-meltline,[data-cue][data-on] .fp-pool{fill:var(--fp-accent);stroke:var(--fp-accent);opacity:.45}
[data-cue][data-on] .fp-meltline{fill:none}
[data-cue][data-on] .fp-runline{opacity:1}
[data-cue][data-on] .fp-meter-fill{fill:var(--fp-accent);opacity:.75}
[data-cue][data-on] .mc-well{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .iso-face-text{fill:var(--fp-accent)}
.tb-body{fill:var(--anatomy-shade-2)}
[data-cue][data-on] .tb-body{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .tb-edge{stroke:var(--fp-accent)}
`;

// ---------------------------------------------------------------- audit (--audit): the press, proved as the figure proves it
export function auditPress(extraSvg = '') {
  const pressAudit = A.audit(R, P, { frames: STATES, apart: true });
  console.log(A.report(pressAudit));
  const fails = A.failures(pressAudit);
  if (fails) throw new Error(`press audit: ${fails} problem(s)`);
  console.log('press audit passed');
  const all = extraSvg + SETS.section + SETS.tcu + SETS.plates + SETS.coins;
  const bad = [...all.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined: ${bad.map((b) => b[1].slice(0, 120)).join(' | ')}`);
  console.log(`press shot layer after item ${lastBack}; front items before it: ${early.join(', ') || 'none'}`);
}

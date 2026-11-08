// Dev tool, not shipped. Builds the explainer film "Eén cyclus van 30 seconden /
// One 30-second cycle" for the cycle topic of Spuitgieten (cycle L1, cooling L2,
// cavities L3, partcost L4).
//
//   node films/eng.moulding.cycle/build.mjs            build the page
//   node films/eng.moulding.cycle/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.cycle.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.3.
//
// Four sets share one projection and are shown one at a time:
//   the press   (scenes 1–2) the press of figures/eng.moulding.cycle, reused
//   the section (scenes 3–5) a mould block cut open through the part, with its
//                            cooling channels, hoses and a temperature control unit
//   the plates  (scene 6)    moving mould plates: 4-cavity, 8-cavity with an H
//                            runner, a hot-runner manifold with valve gates, a family mould
//   the coins   (scene 7)    what one part costs, in coin stacks, next to a scale
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';

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
if (process.env.SIZES) { const m = {}; for (const it of R.items) { const n = it.name.split('.')[0] + '.' + it.name.split('.')[1]; m[n] = (m[n] || 0) + it.svg.length; } console.log(Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 25)); }
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

// ---------------------------------------------------------------- HUD (stage space)
const BAR = { x0: 46, x1: W - 46, y: H - 36, h: 14 };
const hudSvg = [
  g('phasebar', '', ' data-cue="cycle"'),
  g('coolseg', '', ' data-cue="cool"'),
  g('phasetext', ''),
  g('mag', '', ' data-cue="turb"'),
  g('therm', ''),
  g('thmark', '', ' data-cue="eject"'),
  g('labels', ''),
].join('');

const world = [
  g('press', pressSet),
  g('section', `${g('secbody', '')}${g('tcu', '')}${g('hoses', hoses.join(''), ' data-cue="channels"')}`),
  g('plates', ''),
  g('coinset', ''),
].join('');
// Coordinates to 0.1 px: the press scene zooms at most 2.6×, so a step is under 0.3 px on screen.
const tight = (html) => html.replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d{2,}/g, (v) => String(Math.round(Number(v) * 10) / 10))}"`);
const svg = tight(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hudSvg)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
// a camera that fits world points into a rectangle of the stage [x0, y0, x1, y1]
const fitCam = (points, [x0, y0, x1, y1], zoom = 1) => {
  const xy = points.map(at);
  const xs = xy.map((p) => p[0]);
  const ys = xy.map((p) => p[1]);
  const [l, r, t, b] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = Math.min((x1 - x0) / (r - l), (y1 - y0) / (b - t)) * zoom;
  const cx = (l + r) / 2 - ((x0 + x1) / 2 - W / 2) / s;
  const cy = (t + b) / 2 - ((y0 + y1) / 2 - H / 2) / s;
  return [Math.round(cx * 10) / 10, Math.round(cy * 10) / 10, Math.round((W / s) * 10) / 10];
};
const blockPts = [...k.boxCorners({ x: -BX, y: -BD, w: 2 * BX, d: BD }, -BZ - 4, BZ + 14), [BX + 7, -BD + 14, 0]];
const unitPts = [...blockPts, ...k.boxCorners(TCU, TCU_Z[0] - 6, 46)];
const CAM = [
  { from: fitCam(FIT, [24, 54, 616, 318]), to: fitCam(FIT, [24, 54, 616, 318], 1.05) },
  { from: cam([-24, 2, 52], 560), to: cam([-36, 4, 54], 240), a: 0.02, b: 0.3 },
  { from: fitCam(blockPts, [40, 30, 600, 330], 1.2), to: fitCam(blockPts, [40, 30, 600, 330], 1.27) },
  { from: fitCam(blockPts, [40, 36, 600, 330], 1.04), to: fitCam(blockPts, [40, 36, 600, 330]) },
  { from: fitCam(blockPts, [60, 150, 600, 380]), to: fitCam(unitPts, [180, 150, 600, 392]), a: 0.02, b: 0.3 },
  { from: fitCam(k.boxCorners(PLATE4, -40, 18), [40, 40, 600, 380]), to: fitCam(k.boxCorners(PLATE8, -40, 18), [20, 60, 620, 390]), a: 0.12, b: 0.3 },
  { from: fitCam(k.boxCorners(COINS_BASE, -8, 56), [24, 50, 616, 392], 0.95), to: fitCam(k.boxCorners(COINS_BASE, -8, 56), [24, 50, 616, 392]) },
];
const DUR = [20, 15, 18, 18, 22, 27, 26];

// ---------------------------------------------------------------- the film
const spec = {
  id: 'eng.moulding.cycle',
  title: { nl: 'Eén cyclus van 30 seconden', en: 'One 30-second cycle' },
  lessons: ['eng.moulding.cycle', 'eng.moulding.cooling', 'eng.moulding.cavities', 'eng.moulding.partcost'],
  scenes: [
    {
      // v14b: the Basis "how it works" tour of the machine, before the terms
      id: 's0', lesson: 'eng.moulding.cycle', level: 1, dur: 30, still: 0.5, title: { nl: 'Hoe spuitgieten werkt', en: 'How injection moulding works' },
      beats: [
        { nl: 'Een spuitgietmachine maakt doppen in een vast rondje, steeds opnieuw.', en: 'An injection moulding machine makes caps in a fixed round, again and again.', still: 0.08 },
        { nl: 'De sluiteenheid drukt de twee helften van de matrijs stevig dicht.', en: 'The clamp unit presses the two halves of the mould firmly shut.', cues: ['clampunit'], still: 0.3 },
        { nl: 'De spuiteenheid smelt de korrels en spuit de smelt in de matrijs.', en: 'The injection unit melts the pellets and injects the melt into the mould.', cues: ['injunit'], still: 0.5 },
        { nl: 'In de matrijs koelt de kunststof af tot een stijve dop.', en: 'In the mould the plastic cools into a stiff cap.', cues: ['mould'], still: 0.7 },
        { nl: 'Dan gaat de matrijs open en vallen de doppen eruit.', en: 'Then the mould opens and the caps drop out.', cues: ['mould'], still: 0.9 },
      ],
    },
    {
      id: 's1', lesson: 'eng.moulding.cycle', level: 1, dur: DUR[0], still: 0.55, title: { nl: 'De cyclus', en: 'The cycle' },
      beats: [
        { nl: 'Sluiten, inspuiten, nadruk, koelen, openen, uitwerpen: samen de {t:Cyclustijd|cyclustijd}, hier {n:30} seconden.', en: 'Close, inject, hold, cool, open, eject: together the {t:Cycle time|cycle time}, here {n:30} seconds.', cue: { Cyclustijd: 'cycle' }, read: { nl: '{n:2} + {n:1.5} + {n:6} + {n:15} + {n:2} + {n:3.5} = {n:30} s', en: '{n:2} + {n:1.5} + {n:6} + {n:15} + {n:2} + {n:3.5} = {n:30} s' } },
        { nl: 'Inspuiten duurt {n:1.5} seconde. De {t:Koeltijd|koeltijd} is {n:15} seconden: de helft van de cyclus.', en: 'Injection takes {n:1.5} seconds. The {t:Cooling time|cooling time} is {n:15} seconds: half the cycle.', cue: { Koeltijd: 'cool' } },
      ],
    },
    {
      id: 's2', lesson: 'eng.moulding.cycle', level: 1, dur: DUR[1], still: 0.5, title: { nl: 'Holtes', en: 'Cavities' },
      beats: [
        { nl: 'Elke {t:Holte|holte} in de matrijs vormt één dop per cyclus; deze matrijs heeft er {n:2}.', en: 'Each {t:Cavity|cavity} in the mould forms one cap per shot; this mould has {n:2}.', cue: { Holte: 'cavity' } },
        { nl: 'Deze dopmatrijs loopt op {n:20} seconden: {n:3600} / {n:20} × {n:2} = {n:360} doppen per uur.', en: 'This cap mould runs at {n:20} seconds: {n:3600} / {n:20} × {n:2} = {n:360} caps per hour.', cues: ['cavity'], read: { nl: 'stuks per uur = {n:3600} / cyclustijd × holtes', en: 'parts per hour = {n:3600} / cycle time × cavities' } },
      ],
    },
    {
      id: 's3', lesson: 'eng.moulding.cycle', level: 1, dur: DUR[2], still: 0.5, title: { nl: 'Koelen door de wand', en: 'Cooling through the wall' },
      beats: [
        { nl: 'Water in de {t:Koelkanalen|koelkanalen} voert de warmte af. De kunststof stolt van buiten naar binnen.', en: 'Water in the {t:Cooling channels|cooling channels} carries the heat away. The plastic sets from the outside in.', cue: { Koelkanalen: 'channels' } },
        { nl: 'Twee keer zo dik is ruwweg vier keer zo lang koelen: de dikke {t:Bus|bus} bepaalt de cyclus.', en: 'Twice as thick means roughly four times the cooling: the thick {t:Boss|boss} sets the cycle.', cue: { Bus: 'boss' } },
      ],
    },
    {
      id: 's4', lesson: 'eng.moulding.cycle', level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Een dunnere wand', en: 'A thinner wall' },
      beats: [
        { nl: 'Een dop koelt {n:12} van zijn {n:20} seconden. De dikste wand gaat van {n:3} naar {n:2.4} mm.', en: 'A cap cools for {n:12} of its {n:20} seconds. The thickest wall goes from {n:3} to {n:2.4} mm.', read: { nl: 'wand {n:3} → {n:2.4} mm', en: 'wall {n:3} → {n:2.4} mm' } },
        { nl: 'Koelen zakt naar zo’n {n:7.7} seconden, de output van {n:360} naar {n:459} doppen per uur.', en: 'Cooling drops to about {n:7.7} seconds, output from {n:360} to {n:459} caps per hour.', read: { nl: '({n:2.4} / {n:3})² = {n:0.64} · {n:12} → {n:7.7} s · cyclus {n:15.7} s', en: '({n:2.4} / {n:3})² = {n:0.64} · {n:12} → {n:7.7} s · cycle {n:15.7} s' } },
      ],
    },
    {
      id: 's5', lesson: 'eng.moulding.cooling', level: 2, dur: DUR[4], still: 0.9, title: { nl: 'De matrijstemperatuur', en: 'Mould temperature' },
      beats: [
        { nl: 'Een {t:Temperatuurregelaar|temperatuurregelaar} pompt water door de kanalen.', en: 'A {t:Temperature control unit|temperature control unit} pumps water through the channels.', cue: { Temperatuurregelaar: 'tcu' } },
        { nl: 'Hij houdt de {t:Matrijstemperatuur|matrijstemperatuur} vast, voor PA6 {n:80} °C.', en: 'It holds the {t:Mould temperature|mould temperature}: {n:80} °C for PA6.', cue: { Matrijstemperatuur: 'mouldtemp' } },
        { nl: 'Bij {t:Turbulente stroming|turbulente stroming} wervelt het water: zo gaat er veel meer warmte mee.', en: 'In {t:Turbulent flow|turbulent flow} the water swirls and carries far more heat away.', cue: { 'Turbulente stroming': 'turb' } },
        { nl: 'Op de {t:Uitwerptemperatuur|uitwerptemperatuur} is het product stijf genoeg om eruit te duwen.', en: 'At the {t:Ejection temperature|ejection temperature} the part is stiff enough to push out.', cue: { Uitwerptemperatuur: 'eject' } },
      ],
    },
    {
      id: 's6', lesson: 'eng.moulding.cavities', level: 3, dur: DUR[5], still: 0.4, title: { nl: 'Meer holtes', en: 'More cavities' },
      beats: [
        { nl: 'Een 4-voudige matrijs op {n:20} s maakt {n:720} doppen per uur, een 8-voudige op {n:24} s er {n:1200}.', en: 'A 4-cavity mould at {n:20} s makes {n:720} caps per hour, an 8-cavity one at {n:24} s makes {n:1200}.', read: { nl: '{n:3600} / {n:24} × 8 = {n:1200} per uur', en: '{n:3600} / {n:24} × 8 = {n:1200} per hour' } },
        { nl: 'Elke holte moet tegelijk vollopen: {t:Vulbalans|vulbalans}, met gelijke vloeiwegen in een H-patroon.', en: 'Every cavity must fill at once: {t:Fill balance|fill balance}, with equal flow paths in an H-pattern.', cue: { Vulbalans: 'balance' }, still: 0.5 },
        { nl: 'Een {t:Naaldsluiting|naaldsluiting} opent en sluit elk aanspuitpunt op commando.', en: 'A {t:Valve gate|valve gate} opens and closes each gate on command.', cue: { Naaldsluiting: 'valve' }, still: 0.68 },
        { nl: 'Een {t:Familiematrijs|familiematrijs} maakt deksel en bak in één cyclus, maar ze vullen zelden gelijk.', en: 'A {t:Family mould|family mould} makes a lid and its base in one shot, but they rarely fill alike.', cue: { Familiematrijs: 'family' }, still: 0.86 },
      ],
    },
    {
      id: 's7', lesson: 'eng.moulding.partcost', level: 4, dur: DUR[6], still: 0.95, title: { nl: 'Wat een product kost', en: 'What a part costs' },
      beats: [
        { nl: 'Materiaal: {n:40} g PP à € {n:2.00} per kg, met een {t:Afkeurpercentage|afkeurpercentage} van {n:3}%: €\u00a0{n:0.082}.', en: 'Material: {n:40} g of PP at €{n:2.00} per kg, with a {t:Scrap rate|scrap rate} of {n:3}%: €{n:0.082}.', cue: { Afkeurpercentage: 'scrap' } },
        { nl: 'Machine: het {t:Machine-uurtarief|machine-uurtarief} van € {n:60} gedeeld door {n:408} goede stuks per uur: €\u00a0{n:0.147}.', en: 'Machine: the {t:Machine hour rate|machine hour rate} of €{n:60} divided by {n:408} good parts per hour: €{n:0.147}.', cue: { 'Machine-uurtarief': 'rate' }, read: { nl: '{n:3600} / {n:30} × 4 × {n:0.85} = {n:408} goed per uur', en: '{n:3600} / {n:30} × 4 × {n:0.85} = {n:408} good per hour' } },
        { nl: 'Matrijs: de {t:Matrijsafschrijving|matrijsafschrijving}, € {n:80000} over {n:1} miljoen stuks: €\u00a0{n:0.080}.', en: 'Mould: the {t:Mould amortisation|mould amortisation}, €{n:80000} over {n:1} million parts: €{n:0.080}.', cue: { Matrijsafschrijving: 'amort' } },
        { nl: 'Samen zo’n € {n:0.31}: de machinetijd is hier de grootste post.', en: 'Together about €{n:0.31}: machine time is the biggest line here.', cues: ['rate'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption on screen, so the film replaces the lesson text. Same markers
// ({t:Term|shown}, {n:number}); the build checks its terms and numbers against
// the lessons like the captions'. A term is named while its cue is lit.
// films/_kit/narrate.mjs turns each line into speech with Piper.
const SAY = [
  [ // s0 how injection moulding works
    { nl: 'Hoe werkt spuitgieten? Deze machine maakt flessendoppen van kunststof. Ze doet steeds hetzelfde rondje.',
      en: 'How does injection moulding work? This machine makes plastic bottle caps. It runs the same round again and again.' },
    { nl: 'Links zit de sluiteenheid. Die schuift de beweegbare helft van de matrijs tegen de vaste helft, en houdt ze met grote kracht dicht.',
      en: 'On the left is the clamp unit. It slides the moving half of the mould against the fixed half, and holds them shut with great force.' },
    { nl: 'Rechts zit de spuiteenheid. Korrels uit de trechter smelten in een verwarmde cilinder, en een schroef spuit de hete smelt in de gesloten matrijs.',
      en: 'On the right is the injection unit. Pellets from the hopper melt in a heated barrel, and a screw injects the hot melt into the closed mould.' },
    { nl: 'In de matrijs zitten holle vormen van de dop. De smelt vult ze en koelt af, tot de dop stijf is.',
      en: 'Inside the mould are hollow shapes of the cap. The melt fills them and cools, until the cap is stiff.' },
    { nl: 'Dan gaat de matrijs open, duwen pennen de doppen eruit, en vallen ze in de bak. De matrijs sluit, en het rondje begint opnieuw.',
      en: 'Then the mould opens, pins push the caps out, and they drop into the bin. The mould closes, and the round starts again.' },
  ],
  [ // s1 the cycle
    { nl: 'Dat rondje heeft zes stappen: sluiten, inspuiten, nadruk, koelen, openen en uitwerpen. Samen is dat de {t:Cyclustijd|cyclustijd}, hier {n:30} seconden.',
      en: 'That round has six steps: close, inject, hold, cool, open and eject. Together they make the {t:Cycle time|cycle time}, here {n:30} seconds.' },
    { nl: 'Het inspuiten zelf duurt maar {n:1.5} seconde. De {t:Koeltijd|koeltijd} is {n:15} seconden: de helft van de cyclus, en vaak is het nog meer.',
      en: 'The injection itself takes only {n:1.5} seconds. The {t:Cooling time|cooling time} is {n:15} seconds: half the cycle, and often it is even more.' },
  ],
  [ // s2 cavities
    { nl: 'Elke {t:Holte|holte} in de matrijs is een ruimte in de vorm van het product, en maakt één dop per cyclus. Deze matrijs heeft er {n:2}.',
      en: 'Each {t:Cavity|cavity} in the mould is a space in the shape of the part, and makes one cap per cycle. This mould has {n:2}.' },
    { nl: 'Hij loopt op {n:20} seconden. Een uur heeft {n:3600} seconden. Gedeeld door {n:20}, maal {n:2} holtes, is dat {n:360} doppen per uur.',
      en: 'It runs at {n:20} seconds. An hour has {n:3600} seconds. Divided by {n:20}, times {n:2} cavities, that is {n:360} caps per hour.' },
  ],
  [ // s3 cooling through the wall
    { nl: 'Hoe koelt een product af? Water stroomt door de {t:Koelkanalen|koelkanalen}, gaten in het staal, en voert de warmte af. De kunststof stolt van buiten naar binnen.',
      en: 'How does a part cool? Water flows through the {t:Cooling channels|cooling channels}, holes in the steel, and carries the heat away. The plastic sets from the outside in.' },
    { nl: 'Kunststof geleidt warmte slecht. Twee keer zo dik is daarom ruwweg vier keer zo lang koelen. Zo bepaalt één dikke {t:Bus|bus}, een massief nokje voor een schroef, de cyclus van het hele product.',
      en: 'Plastic conducts heat poorly. So twice as thick means roughly four times the cooling. That is how one thick {t:Boss|boss}, a solid stud for a screw, sets the cycle of the whole part.' },
  ],
  [ // s4 a thinner wall
    { nl: 'Een voorbeeld. Deze dop koelt {n:12} van zijn {n:20} seconden. De dikste wand is {n:3} millimeter, en de ontwerper brengt die naar {n:2.4}.',
      en: 'An example. This cap cools for {n:12} of its {n:20} seconds. The thickest wall is {n:3} millimetres, and the designer brings it down to {n:2.4}.' },
    { nl: 'De koeltijd gaat met het kwadraat van de dikte: maal {n:0.64}. Hij zakt naar zo’n {n:7.7} seconden, de cyclus naar {n:15.7}, en de productie stijgt van {n:360} naar {n:459} doppen per uur. Op dezelfde machine.',
      en: 'Cooling time goes with the square of the thickness: times {n:0.64}. It drops to about {n:7.7} seconds, the cycle to {n:15.7}, and output rises from {n:360} to {n:459} caps per hour. On the same machine.' },
  ],
  [ // s5 mould temperature
    { nl: 'Een {t:Temperatuurregelaar|temperatuurregelaar}, een kast naast de pers, verwarmt of koelt het water en pompt het door de kanalen.',
      en: 'A {t:Temperature control unit|temperature control unit}, a cabinet beside the press, heats or cools the water and pumps it through the channels.' },
    { nl: 'Zo houdt hij de {t:Matrijstemperatuur|matrijstemperatuur} vast. Het datablad noemt voor PA6 bijvoorbeeld {n:80} graden. Te koud geeft een dof oppervlak.',
      en: 'That is how it holds the {t:Mould temperature|mould temperature}. For PA6 the datasheet gives {n:80} degrees, for example. Too cold gives a dull surface.' },
    { nl: 'Het water moet hard genoeg stromen voor {t:Turbulente stroming|turbulente stroming}: wervelend in plaats van in laagjes. Wervelend water voert veel meer warmte af.',
      en: 'The water must flow hard enough for {t:Turbulent flow|turbulent flow}: swirling instead of sliding in layers. Swirling water carries far more heat away.' },
    { nl: 'Het product mag eruit op de {t:Uitwerptemperatuur|uitwerptemperatuur}: dan is het dikste deel stijf genoeg om eruit geduwd te worden zonder te vervormen.',
      en: 'The part may come out at the {t:Ejection temperature|ejection temperature}: then its thickest section is stiff enough to be pushed out without bending.' },
  ],
  [ // s6 more cavities
    { nl: 'Meer stuks per uur kan ook met meer holtes. Een 4-voudige matrijs op {n:20} seconden maakt {n:720} doppen per uur. Een 8-voudige loopt trager, op {n:24} seconden, maar maakt er {n:1200}.',
      en: 'More parts per hour can also come from more cavities. A 4-cavity mould at {n:20} seconds makes {n:720} caps per hour. An 8-cavity one runs slower, at {n:24} seconds, but makes {n:1200}.' },
    { nl: 'Elke holte moet tegelijk en met dezelfde druk vollopen: {t:Vulbalans|vulbalans}. Een H-patroon geeft elke holte een even lange vloeiweg.',
      en: 'Every cavity must fill at the same time and pressure: {t:Fill balance|fill balance}. An H-pattern gives each cavity an equal flow path.' },
    { nl: 'In een heetkanaal blijft de kunststof vloeibaar tot aan de holtes. Een {t:Naaldsluiting|naaldsluiting} gaat verder: een naald in elke spuitmond opent en sluit het aanspuitpunt op commando.',
      en: 'In a hot runner the plastic stays molten right up to the cavities. A {t:Valve gate|valve gate} goes further: a needle in each nozzle opens and closes the gate on command.' },
    { nl: 'Een {t:Familiematrijs|familiematrijs} maakt verschillende producten in één cyclus, zoals een deksel en een bak. Handig, maar ze vullen zelden gelijk.',
      en: 'A {t:Family mould|family mould} makes different parts in one shot, such as a lid and a base. Handy, but they rarely fill alike.' },
  ],
  [ // s7 what a part costs
    { nl: 'Wat kost één product? Neem {n:40} gram PP, uit een 4-voudige matrijs op {n:30} seconden. Bij twee euro per kilo en een {t:Afkeurpercentage|afkeurpercentage} van {n:3} procent kost het materiaal ruim acht cent.',
      en: 'What does one part cost? Take {n:40} grams of PP, from a 4-cavity mould at {n:30} seconds. At two euros a kilo and a {t:Scrap rate|scrap rate} of {n:3} percent, the material costs just over eight cents.' },
    { nl: 'Dan de machine. Het {t:Machine-uurtarief|machine-uurtarief} is {n:60} euro: wat een uur perstijd kost. Bij {n:85} procent rendement maakt de pers {n:408} goede stuks per uur: bijna vijftien cent per stuk.',
      en: 'Then the machine. The {t:Machine hour rate|machine hour rate} is {n:60} euros: what an hour of press time costs. At {n:85} percent efficiency the press makes {n:408} good parts an hour: almost fifteen cents each.' },
    { nl: 'Dan de matrijs. De {t:Matrijsafschrijving|matrijsafschrijving} verdeelt de {n:80000} euro die hij kost over een miljoen stuks: acht cent per stuk.',
      en: 'Then the mould. The {t:Mould amortisation|mould amortisation} spreads the {n:80000} euros it costs over a million parts: eight cents each.' },
    { nl: 'Samen zo’n eenendertig cent. De machinetijd is hier de grootste post, dus elke seconde cyclus zie je terug in de prijs.',
      en: 'Together about thirty-one cents. Machine time is the biggest line here, so every second of cycle shows up in the price.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const C = {
  dur: DUR, PHASES, CYCLE, OPEN, STROKE, CAP_H, MOULD_M, ZC, BAR,
  MM, BX, BZ, BD, SWALL, WALL_X, BOSS, CHAN, CHAN_R,
  CAV4, CAV8, RUN4, RUN8, POCKET_R, FAM, PLATE8, PZ,
  COIN_R, COIN_H, STACKS, CENTS, COST: [MAT, MACH, MOULD],
  SETC,
};
// v14b: the intro's framings, one per beat: the whole machine, the clamp unit,
// the injection unit, the mould, the mould opening (as scene 3 frames it)
C.INTRO = [
  fitCam(FIT, [24, 40, 616, 360], 1.2),
  fitCam(k.boxCorners({ x: -120, y: -22, w: 104, d: 44 }, 34, 82), [90, 40, 550, 330]),
  cam([56, 0, 62], 400),
  cam([-30, 0, 57], 210),
  cam([-36, 4, 54], 240),
];
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
// Leading indentation goes (and, in this film's own two scripts, whole-line comments): about 15 KB less.
const lean = (src, dropComments) => src.split('\n').map((line) => line.trim()).filter((line) => line && !(dropComments && line.startsWith('//'))).join('\n');
const stageScript = lean(kitScript(), false) + '\n' + preamble + lean(setsSource, true) + '\n' + lean(readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8'), true) + '\n' + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'), true);

const css = `
.iso{--mc-glass:#081A1E;--mc-well:#06161A;--mc-seg:#2A4A4A;--mc-segc:#45615D;--fp-steel:#16353D;--fp-water:#0A1E23;--fp-solid:#45615D;--fp-melt:#E4DDCC}
.iso[data-theme="light"]{--mc-glass:#E4DCC9;--mc-well:#C9C0AA;--mc-seg:#C2C3B2;--mc-segc:#7D877A;--fp-steel:#FBF8F1;--fp-water:#DDD4BF;--fp-solid:#A9AE9E;--fp-melt:#FFFBEF}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
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
.fp-bar-bg{fill:var(--anatomy-shade-1);stroke:none}
.fp-bar-fill{fill:var(--anatomy-mid);stroke:none;opacity:.55}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
.fp-coin-face{fill:var(--anatomy-face)}
[data-cue][data-on] .fp-hatch{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-water{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-swirl{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-meltline,[data-cue][data-on] .fp-pool{fill:var(--fp-accent);stroke:var(--fp-accent);opacity:.45}
[data-cue][data-on] .fp-meltline{fill:none}
[data-cue][data-on] .fp-runline{opacity:1}
[data-cue][data-on] .fp-bar-fill{fill:var(--fp-accent);opacity:.75}
[data-cue][data-on] .mc-well{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .iso-face-text{fill:var(--fp-accent)}
.tb-body{fill:var(--anatomy-shade-2)}
[data-cue][data-on] .tb-body{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .tb-edge{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een spuitgietmachine die één cyclus draait; een doorsnede door een matrijs met koelkanalen en een temperatuurregelaar; matrijsplaten met vier en acht holtes; munten die de kostprijs van een dop tonen.',
  en: 'An injection moulding machine running one cycle; a section through a mould with cooling channels and a temperature control unit; mould plates with four and eight cavities; coins showing what a cap costs.',
};

if (process.env.SIZES) console.log('sizes', { press: pressSet.length, sets: Object.fromEntries(Object.entries(SETS).map(([key, v]) => [key, JSON.stringify(v).length])), hoses: hoses.join('').length, script: stageScript.length, kit: kitScript().length });
const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log(`press shot layer after item ${lastBack}; front items before it: ${early.join(', ') || 'none'}`);
  // the trimmed press, proved again as the figure proves it (painter's order, supports, clearances)
  const pressAudit = A.audit(R, P, { frames: STATES, apart: true });
  console.log(A.report(pressAudit));
  const pressFails = A.failures(pressAudit);
  if (pressFails) throw new Error(`press audit: ${pressFails} problem(s)`);
  console.log('press audit passed');
  const all = svg + SETS.section + SETS.tcu + SETS.plates + SETS.coins;
  const bad = [...all.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined: ${bad.map((b) => b[1].slice(0, 120)).join(" | ")}`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

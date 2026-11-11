// Dev tool, not shipped. Builds the explainer film "Hydrauliek / Hydraulics"
// for the topic Perslucht en hydrauliek of Motoren, aandrijvingen en perslucht:
// its level 2 lesson eng.power.hydraulics.
//
//   node films/eng.power.hydraulics/build.mjs            build the page
//   node films/eng.power.hydraulics/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.power.hydraulics.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.power). The plan row lists the lesson "hydraulics"; its id still exists
// after the topics x levels rebuild (eng.power.hydraulics, level 2 of the
// topic fluid), so no mapping was needed. The film eng.safety.loto shows the
// same press but is deliberately not wired here (integrator ruling 2026-11-09).
//
// The drawing reuses the hydraulic press and power unit of eng.safety.loto (bed,
// uprights, crown, main cylinder, ram with the upper die, lower die on guide
// pillars, the safety block; tank, motor, pump and the accumulator with its
// bleed valve and gauge), without that film's lockbox, cabinet, console, air
// panel and people. Added on the tank: a valve manifold with a solenoid
// directional valve (two coils with plug and lamp), a pressure relief valve
// cartridge with its adjuster, a return filter with a clogging indicator, a
// breather, a level glass and a thermometer; the A and B hoses up to the
// cylinder, a hose fitting that can leak a pinhole jet, and a piece of
// cardboard. Oil flow is drawn as moving petrol dashes over the hoses. Cards in
// stage space: a section through the cylinder (force from pressure), the
// directional valve's spool, the gauge, the worked example (speed and heat), the
// ISO 4406 particle count, two checklists and the step badges; example cards
// are labelled "voorbeeld".
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
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the lesson's text and worked example (the build fails if a
// value drifts); {n:...} numbers are then checked against the Dutch lesson text
// by defineFilm. Facts checked against:
// - Pascal's law: pressure in a confined liquid at rest acts equally in all
//   directions, so it pushes on the whole piston face; F = p × A with
//   1 bar = 10^5 Pa = 0,1 N/mm².
// - Cylinder speed v = Q / A (flow rate over the effective piston area);
//   the pump makes flow, pressure rises only as far as the load resists, up to
//   the relief valve setting.
// - ISO 4406:2021: three scale numbers for particles ≥ 4, ≥ 6 and ≥ 14 µm(c)
//   per millilitre; each scale step doubles the count, so one step lower
//   roughly halves it.
// - High-pressure injection injury: oil or grease forced through the skin by a
//   pinhole jet, reported from about 7 bar (100 psi) up; it looks harmless at
//   first, needs urgent surgical care, and delay raises the risk of losing the
//   finger or hand (e.g. UK HSE guidance on hydraulic hoses; BFPA). Said as
//   "always a medical emergency, go to A&E at once and say it is a
//   high-pressure injection", hedged on the pressure ("ook bij bescheiden druk").
// - Oil above about 60 °C ages fast; oil life roughly halves per 10 °C (an
//   Arrhenius rule of thumb), hedged as in the lesson.
// - Accumulators are usually precharged with nitrogen.
const HYD = 'eng.power.hydraulics';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const nl = lessons.nl.get(HYD);
  const teach = nl.teach.join('\n');
  assert(teach.includes('Kracht = druk × zuigeroppervlak') && teach.includes('Cilindersnelheid = debiet / zuigeroppervlak'), 'the two rules');
  assert(teach.includes('blijft onder druk als de pomp stilstaat') && teach.includes('manometer op nul'), 'the accumulator stays under pressure');
  assert(teach.includes('per milliliter groter dan 4, 6 en 14 micrometer') && teach.includes('halveert'), 'ISO 4406');
  assert(teach.includes('medisch spoedgeval') && teach.includes('karton'), 'injection injury and cardboard');
  assert(nl.example.text.includes('versleten pomp') && nl.example.text.includes('te vroeg opent'), 'the two causes');
}
const BAR = 200;
const NMM2 = BAR * 0.1; // 1 bar = 0,1 N/mm²
assert(NMM2 === 20, '200 bar = 20 N/mm²');
const A100 = Math.round((Math.PI / 4) * 100 * 100);
assert(A100 === 7854, 'Ø100: 7.854 mm²');
const F = NMM2 * A100;
assert(F === 157080 && Math.round(F / 1000) === 157, '20 × 7.854 = 157.080 N ≈ 157 kN');
assert(Math.round(F / 9.81 / 1000) === 16, 'about the weight of 16 tonnes');
// the worked example: Ø125, 60 L/min, measured 60 mm/s at 70 °C
const A125 = Math.round((Math.PI / 4) * 125 * 125);
assert(A125 === 12272, 'Ø125: 12.272 mm²');
const Q = 60 / 1000 / 60; // m³/s
assert(near(Q, 0.001, 1e-12), '60 L/min = 0,001 m³/s');
const V_EXP = (Q * 1e9) / A125; // mm/s
assert(Math.round(V_EXP) === 81, 'expected 81 mm/s');
const V_MEAS = 60;
const LOST = 1 - V_MEAS / V_EXP;
assert(near(LOST, 0.25, 0.02), 'about a quarter of the flow lost');
// the recall questions, as a check on the same rules
assert(150 * 0.1 * 2000 === 30000, '150 bar on 2.000 mm² = 30 kN');
assert(near((0.0005 / 0.01) * 1000, 50, 1e-9), '0,0005 / 0,01 = 50 mm/s');
// ISO 4406: the code 18/16/13 for > 4, 6 and 14 µm; each step doubles
const CODE = [18, 16, 13];
const SIZES = [4, 6, 14];
assert(CODE.every((c, i) => i === 0 || c < CODE[i - 1]), 'fewer large particles than small');
assert(2 ** (CODE[0] - CODE[1]) === 4, 'two steps lower is about a quarter');

// ---------------------------------------------------------------- the world (the press of eng.safety.loto)
// x to the right along the floor, y toward the viewer, z up; the floor is z = 0.
// Units of about 1 cm: the press stands about 3 m tall.
const W = 640;
const H = 400;
const BED_Z = 44;
const BOL_Z = 50;
const UP_Z = 214;
const CROWN_Z = 250;
const RAM0 = 160; // the ram's underside, parked at the top
const RAM_H = 34;
const DIE_H = 16;
const LDIE_Z = BOL_Z + DIE_H;
const STROKE = RAM0 - DIE_H - LDIE_Z;
const BLOCK = { x: -46, y: -6, w: 10, d: 12, r: 0.6 };
const BLOCK_TOP = RAM0 - 3;
const BLOCK_PARK = [-58, 52, -BOL_Z];
const ACC = [215, -65];
const GAUGE = [221, -58, 20];
const THERM = { x0: 133, x1: 136, z0: 14, z1: 36, y: -46 };
const FIT_AT = [194, -55, 150]; // the hose fitting that leaks
const CARD = { y: -70, x0: 184, x1: 206, z0: 137, z1: 161 }; // the cardboard, held behind the fitting
const C = {
  BED_Z, BOL_Z, UP_Z, RAM0, RAM_H, STROKE, BLOCK, BLOCK_TOP, BLOCK_PARK, ACC, GAUGE, THERM, FIT_AT, CARD, V_EXP, V_MEAS, LOST, CODE, SIZES, A100, A125,
};
assert(STROKE === 78 && RAM0 - BLOCK_TOP === 3, 'stroke and the gap over the block');

const FIT = [[-80, -40, 0], [228, -92, 0], [228, -40, 0], [-80, 40, 0], [0, 0, 316], [200, -55, 316], [80, 40, 0]];
const P = k.fitProjection(FIT, W, H, { pad: 8, azimuth: 52, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const alongY = (x, z, y0, y1, r, style = {}, steps) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'hy-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const led = (key, p, r = 0.8) => { const [x, y] = at(p); return `<circle class="hy-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };
const ringY = (c, r, n = 28) => k.pathOf(Array.from({ length: n }, (_, i) => at([c[0] + r * Math.cos((i / n) * 2 * Math.PI), c[1], c[2] + r * Math.sin((i / n) * 2 * Math.PI)])), true);

// ---------------------------------------------------------------- the press
const PBED = { x: -72, y: -38, w: 144, d: 76, r: 1.2 };
const press = {};
press.back = [
  halo(k.insetPlan(PBED, -4), 0, 2),
  ...k.corners(PBED, 7).map(([x, y]) => box({ x: x - 4, y: y - 4, w: 8, d: 8, r: 0.6 }, 0, 4, { tone: 'lo' }, 0.2, 1)),
  box(PBED, 4, BED_Z, { tone: 'lo', inner: seam(PBED, BED_Z - 6, 3) + seam(PBED, 10, 3) }, 0.8, 3),
  card(PBED.y + PBED.d, -20, 20, 22, 34) + rules(-17, PBED.y + PBED.d, 31, [24, 16, 20], 2.4),
  box({ x: -58, y: -32, w: 116, d: 64, r: 0.8 }, BED_Z, BOL_Z, {}, 0.4),
  L([-14, 0, 14].map((yy) => k.lineOnTop([-56, yy], [56, yy], BOL_Z, P)).join(''), { tone: 'faint' }),
  box({ x: -72, y: -32, w: 20, d: 64, r: 0.8 }, BED_Z, UP_Z, { inner: seam({ x: -72, y: -32, w: 20, d: 64 }, UP_Z - 8, 2) }, 0.6, 2),
  box({ x: -52, y: -8, w: 3, d: 16, r: 0.2 }, 60, UP_Z, { tone: 'lo' }, 0, 1),
].join('');
press.ldie = [
  box({ x: -32, y: -21, w: 64, d: 42, r: 0.6 }, BOL_Z, LDIE_Z, { inner: seam({ x: -32, y: -21, w: 64, d: 42 }, BOL_Z + 4, 2) }, 0.5),
  box({ x: -12, y: -8, w: 24, d: 16, r: 0.6 }, LDIE_Z, LDIE_Z + 3, { tone: 'hi', crease: 'lo' }, 0.3),
  ...[[-26, -15], [26, -15], [-26, 15], [26, 15]].map(([x, y]) => post(x, y, 2.4, LDIE_Z, LDIE_Z + 30, { tone: 'hi', crease: 'lo' }, 14, 0.4)),
].join('');
press.ram = [
  post(0, 0, 8, RAM0 + RAM_H, UP_Z + 4, { tone: 'hi', crease: 'lo' }, 22),
  box({ x: -32, y: -21, w: 64, d: 42, r: 0.6 }, RAM0 - DIE_H, RAM0, { inner: seam({ x: -32, y: -21, w: 64, d: 42 }, RAM0 - 4, 2) }, 0.5),
  ...[[-26, -15], [26, -15], [-26, 15], [26, 15]].map(([x, y]) => post(x, y, 3.6, RAM0 - DIE_H - 10, RAM0 - DIE_H, {}, 14)),
  box({ x: -49, y: -27, w: 98, d: 54, r: 0.8 }, RAM0, RAM0 + RAM_H, { tone: 'hi', crease: 'lo', inner: seam({ x: -49, y: -27, w: 98, d: 54 }, RAM0 + 6, 2) }, 0.6, 2),
  Dt([[-40, 27, RAM0 + 26], [40, 27, RAM0 + 26], [-40, 27, RAM0 + 12], [40, 27, RAM0 + 12]].map(at), { size: 0.5 }),
].join('');
press.block = box(BLOCK, BOL_Z, BLOCK_TOP, { tone: 'hi', crease: 'lo', inner: seam(BLOCK, BOL_Z + 8, 1) + seam(BLOCK, BLOCK_TOP - 8, 1) }, 0.4, 1)
  + L([0, 1, 2, 3, 4].map((i) => k.segment([BLOCK.x, BLOCK.y + BLOCK.d, BOL_Z + 20 + i * 16], [BLOCK.x + BLOCK.w, BLOCK.y + BLOCK.d, BOL_Z + 28 + i * 16], P)).join(''), { tone: 'lo' });
press.front = [
  box({ x: 52, y: -32, w: 20, d: 64, r: 0.8 }, BED_Z, UP_Z, { inner: seam({ x: 52, y: -32, w: 20, d: 64 }, UP_Z - 8, 2) }, 0.6, 2),
  box({ x: -76, y: -38, w: 152, d: 76, r: 1.2 }, UP_Z, CROWN_Z, { inner: seam({ x: -76, y: -38, w: 152, d: 76 }, UP_Z + 6, 3) + seam({ x: -76, y: -38, w: 152, d: 76 }, CROWN_Z - 6, 3) }, 0.8, 3),
  screws({ x: -76, y: -38, w: 152, d: 76 }, CROWN_Z, 6),
  Dt([[-62, 38, UP_Z + 18], [62, 38, UP_Z + 18]].map(at), { size: 0.7 }),
  // the main cylinder on the crown: mounting flange, barrel, cap and the A port block on top
  cue('cyl', [
    post(0, 0, 27, CROWN_Z, CROWN_Z + 8, {}, 26, 0.6),
    Dt(Array.from({ length: 8 }, (_, i) => at([24 * Math.cos((i / 8) * 2 * Math.PI), 24 * Math.sin((i / 8) * 2 * Math.PI), CROWN_Z + 8])), { size: 0.5 }),
    post(0, 0, 21, CROWN_Z + 8, CROWN_Z + 52, { inner: L(k.sideArc(0, 0, 21, CROWN_Z + 30, P, 22), { tone: 'faint' }) }, 26),
    post(0, 0, 23, CROWN_Z + 52, CROWN_Z + 58, {}, 26, 0.6),
    box({ x: 12, y: -6, w: 14, d: 12, r: 0.6 }, CROWN_Z + 58, CROWN_Z + 62, { tone: 'lo' }, 0.3),
  ].join('')),
  // the B port on the crown's right face (drilled through to the cylinder's rod end)
  alongX(-20, 232, 76, 79, 2.6, { tone: 'lo' }, 6),
].join('');

// ---------------------------------------------------------------- the hydraulic power unit
const TANK = { x: 116, y: -92, w: 84, d: 46, r: 1 };
const MAN = { x: 140, y: -58, w: 38, d: 10, r: 0.6 }; // the valve manifold on the tank top
const VB = { x: 147, y: -57, w: 24, d: 8, r: 0.5 }; // the directional valve's body
const hpu = (() => {
  let out = halo(k.insetPlan(TANK, -3), 0, 2);
  out += k.corners(TANK, 5).map(([x, y]) => box({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.4 }, 0, 4, { tone: 'lo' }, 0.2, 1)).join('');
  out += box(TANK, 4, 46, { tone: 'lo', inner: seam(TANK, 42, 2) + seam(TANK, 9, 2) }, 0.6, 2) + screws(TANK, 46, 3);
  // level glass and thermometer on the tank's front; the mercury is drawn by the stage
  out += card(TANK.y + TANK.d, 124, 128, 14, 36, 'hy-glass') + `<path class="hy-level" d="${faceY(TANK.y + TANK.d, 124.6, 127.4, 14.6, 28)}"/>`;
  out += cue('temp', card(THERM.y, THERM.x0, THERM.x1, THERM.z0, THERM.z1, 'hy-glass') + rules(THERM.x1 + 0.4, THERM.y, 34, [1.4, 0.8, 1.4, 0.8, 1.4, 0.8, 1.4], 3) + g('therm', ''));
  // the breather on the tank top
  out += cue('breather', post(122, -72, 2, 46, 50, {}, 12) + S(k.cylinder(122, -72, 4.4, 50, 6, P, 18, 2), { tone: 'hi', crease: 'lo', inner: L(k.sideArc(122, -72, 4.4, 52.5, P, 16), { tone: 'faint' }) }));
  // the motor with its cooling fins, the bell housing and the pump
  out += cue('motor', box({ x: 138, y: -80, w: 26, d: 20, r: 0.6 }, 46, 50, { tone: 'lo' }, 0.2)
    + alongX(-70, 62, 134, 164, 11, {}, 16)
    + L([140, 145, 150, 155, 160].map((xx) => k.pathOf(Array.from({ length: 13 }, (_, i) => { const a = -0.2 + (i / 12) * 3.4; return at([xx, -70 + 11.2 * Math.cos(a), 62 + 11.2 * Math.sin(a)]); }))).join(''), { tone: 'faint' })
    + alongX(-70, 62, 130, 134, 9, { tone: 'lo' }, 16)
    + box({ x: 142, y: -77, w: 12, d: 10, r: 0.5 }, 72, 78, {}, 0.3)) + led('motor', [148, -67, 76], 0.7);
  out += cue('pump', alongX(-70, 62, 164, 174, 8, {}, 16) + alongX(-70, 62, 174, 186, 6, { tone: 'hi', crease: 'lo' }, 14) + post(180, -70, 2, 66, 72, {}, 12));
  // the return filter: canister and head, a clogging indicator on top
  out += cue('filter', post(122, -56, 4.4, 46, 60, { inner: L(k.sideArc(122, -56, 4.4, 50, P, 16), { tone: 'faint' }) }, 18)
    + box({ x: 117, y: -61, w: 10, d: 10, r: 1 }, 60, 64, { tone: 'hi', crease: 'lo' }, 0.3) + post(122, -56, 1.3, 64, 66.4, { tone: 'lo' }, 10)
    + Dt([at([122, -56, 66.4])], { size: 0.45, tone: 'hi' }));
  // the manifold, the directional valve with its two coils, the relief valve cartridge
  out += box(MAN, 46, 52, { inner: seam(MAN, 48.5, 1) }, 0.4, 1) + screws(MAN, 52, 1.4);
  out += cue('valve', box(VB, 52, 60, { tone: 'hi', crease: 'lo' }, 0.3, 1)
    + card(VB.y + VB.d, 151, 167, 53.6, 58.4) + rules(152.4, VB.y + VB.d, 57.4, [11, 7, 9], 1.4)
    + Dt([[148.4, VB.y + VB.d, 53.2], [169.6, VB.y + VB.d, 53.2], [148.4, VB.y + VB.d, 58.8], [169.6, VB.y + VB.d, 58.8]].map(at), { size: 0.35 })
    + alongX(-53, 56, 140, 147, 3.4, {}, 14) + alongX(-53, 56, 171, 178, 3.4, {}, 14)
    + box({ x: 141.5, y: -55.5, w: 4, d: 5, r: 0.4 }, 59.4, 63, { tone: 'lo' }, 0.2) + box({ x: 172.5, y: -55.5, w: 4, d: 5, r: 0.4 }, 59.4, 63, { tone: 'lo' }, 0.2))
    + led('solL', [143.5, -50.4, 61.2], 0.55) + led('solR', [174.5, -50.4, 61.2], 0.55);
  out += cue('relief', alongY(174, 49, -48, -44, 2.2, {}, 12) + alongY(174, 49, -44, -42.4, 2.9, { tone: 'lo' }, 6) + alongY(174, 49, -42.4, -38.4, 1.6, { tone: 'hi', crease: 'lo' }, 12)
    + Dt([at([174, -38.4, 49])], { size: 0.35 }));
  // the accumulator: a safety block with the bleed valve and gauge, the bottle on top
  const AB = { x: 204, y: -72, w: 22, d: 14, r: 0.6 };
  out += halo(k.insetPlan(AB, -2), 0, 2);
  out += box(AB, 0, 30, { inner: seam(AB, 26, 1.4) }, 0.4, 1) + screws(AB, 30, 1.6);
  out += cue('accumulator', post(ACC[0], ACC[1], 9, 30, 80, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(ACC[0], ACC[1], 9, 62, P, 16), { tone: 'faint' }) }, 16)
    + S(k.cylinder(ACC[0], ACC[1], 9, 80, 8, P, 16, 6), { tone: 'hi', crease: 'lo' })
    + post(ACC[0], ACC[1], 1.8, 88, 93, {}, 12) + post(ACC[0], ACC[1], 2.6, 93, 95, { tone: 'lo' }, 12, 0.3)
    + box({ x: ACC[0] - 10, y: ACC[1] + 8, w: 20, d: 2, r: 0.3 }, 58, 64, { tone: 'lo' }, 0, 1));
  out += cue('bleed', alongY(208, 10, AB.y + AB.d, AB.y + AB.d + 2, 3.4, { tone: 'lo' }, 14) + alongY(186, 10, AB.y + AB.d + 2, AB.y + AB.d + 4.6, 2.6, { tone: 'hi', crease: 'lo' }, 14));
  out += cue('gauge', alongY(GAUGE[0], GAUGE[2], AB.y + AB.d, AB.y + AB.d + 1.6, 6.4, {}, 16)
    + `<path class="hy-dial" d="${ringY([GAUGE[0], AB.y + AB.d + 1.62, GAUGE[2]], 5.4)}"/>`
    + L(Array.from({ length: 11 }, (_, i) => { const a = (-135 + i * 27) * Math.PI / 180; const yy = AB.y + AB.d + 1.64; return k.segment([GAUGE[0] - 5 * Math.sin(-a), yy, GAUGE[2] + 5 * Math.cos(a)], [GAUGE[0] - (i % 5 ? 4.2 : 3.6) * Math.sin(-a), yy, GAUGE[2] + (i % 5 ? 4.2 : 3.6) * Math.cos(a)], P); }).join(''), { tone: 'mid' })
    + g('needle', ''));
  return out;
})();

// ---------------------------------------------------------------- hoses and the oil flowing in them
// Each hose is a line between two ports with terminal dots; the same route
// carries a dashed petrol overlay that the stage moves while oil flows.
const ROUTES = {
  P: [[180, -70, 72], [180, -64, 70], [178, -60, 54], [176, -58, 50]], // pump outlet to the manifold's P port
  A: [[178, -55, 50], [194, -55, 50], [194, -55, 310], [60, -10, 310], [26, 0, 310]], // to the cap end, on top
  B: [[178, -51, 52], [190, -51, 52], [190, -51, 232], [100, -30, 232], [79, -20, 232]], // to the rod end, through the crown
  T: [[140, -53, 49], [134, -53, 49], [129, -56, 62], [127, -56, 62]], // return to the filter head
};
const hose = (pts, tone = 'mid', size = 1.2) => k.wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via: pts.slice(1, -1).map(at), tone, size, ends: 'both' });
const hoses = `<g class="hy-hose">${Object.values(ROUTES).map((r) => hose(r)).join('')}</g>`;
const flows = Object.keys(ROUTES).map((key) => `<path class="hy-flow" data-k="f${key}" d="${k.pathOf(ROUTES[key].map(at))}" style="opacity:0"/>`).join('');
// the fitting on the A hose that leaks, and the jet (drawn by the stage)
const fitting = cue('jet', post(FIT_AT[0], FIT_AT[1], 1.9, FIT_AT[2] - 2, FIT_AT[2] + 2, { tone: 'hi', crease: 'lo' }, 6) + g('jetLine', ''));
// the cardboard, held in the jet's path behind the fitting (its lit face toward the viewer); it slides in from the right
const cardboard = g('cardboard', `<path class="hy-board" d="${faceY(CARD.y, CARD.x0, CARD.x1, CARD.z0, CARD.z1)}"/>`
  + L(k.segment([CARD.x0 + 2, CARD.y, CARD.z1 - 3], [CARD.x1 - 2, CARD.y, CARD.z1 - 3], P) + k.segment([CARD.x0 + 2, CARD.y, CARD.z0 + 3], [CARD.x1 - 2, CARD.y, CARD.z0 + 3], P), { tone: 'faint' })
  + g('stain', ''), ' style="display:none"');

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('force', '', ' data-cue="force"'),
  g('spool', '', ' data-cue="spool"'),
  g('speed', '', ' data-cue="speed"'),
  g('gaugeBig', '', ' data-cue="gaugeBig"'),
  g('badges', ''),
  g('calc', ''),
  g('iso', '', ' data-cue="iso"'),
  g('care', ''),
  g('jetc', ''),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('hpu', hpu),
  g('press', [press.back, press.ldie, cue('block', g('block', press.block)), cue('ram', g('ram', press.ram)), press.front].join('')),
  cardboard,
  hoses,
  `<g class="hy-flows">${flows}</g>`,
  fitting,
  cue('block', g('blockOut', press.block)),
].join('');

// Static paths written with relative line-tos (the helper from the measuring
// film): the same points (to 0,1), about a third fewer bytes. Only M, L and Z
// paths at one decimal are rewritten, and each rewrite is read back to prove it exact.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && out && !/[MlZ]$/.test(out) && s[0] !== '-') out += ' ';
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put('M', p); cur = p; start = p; cmd = 'L'; } else { put('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
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
if (process.argv.includes('--sizes')) for (const [n, v] of Object.entries({ pb: press.back, pl: press.ldie, pr: press.ram, pk: press.block, pf: press.front, hpu, hoses, flows, fitting, cardboard })) console.log(n, (compact(v).length / 1024).toFixed(1));
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2, sy = H / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round((y + (H / 2 - sy) * (w / W)) * 10) / 10, w]; };
const CAM = [
  { from: cam([66, -26, 150], 640), to: cam([0, 0, 262], 300, 470, 190), a: 0.25, b: 0.42 },
  { from: cam([156, -60, 70], 330, 450), to: cam([156, -60, 66], 300, 460) },
  { from: cam([70, -30, 120], 600, 410), to: cam([170, -56, 56], 200, 430), a: 0.47, b: 0.6 },
  { from: cam([190, -62, 60], 260, 430), to: cam([90, -30, 100], 560, 400), a: 0.5, b: 0.62 },
  { from: cam([76, -40, 140], 720, 168), to: cam([76, -40, 140], 700, 168) },
  { from: cam([140, -64, 56], 210, 470), to: cam([140, -64, 56], 190, 470) },
  { from: cam([194, -48, 150], 170, 450, 160), to: cam([194, -48, 150], 150, 450, 160) },
];

// ---------------------------------------------------------------- the film
const DUR = [40, 42, 38, 42, 46, 40, 40];
C.dur = DUR;
const spec = {
  id: 'eng.power.hydraulics',
  title: { nl: 'Hydrauliek', en: 'Hydraulics' },
  lessons: [HYD],
  scenes: [
    {
      id: 's1', lesson: HYD, level: 2, dur: DUR[0], still: 0.9, title: { nl: 'Kracht uit druk', en: 'Force from pressure' },
      beats: [
        { nl: 'Een hydraulische pers: olie onder hoge druk, meestal {n:100} tot {n:350} bar, maakt grote kracht.', en: 'A hydraulic press: oil under high pressure, typically {n:100} to {n:350} bar, makes a large force.', cues: ['ram', 'cyl'] },
        { nl: 'De druk is overal in de olie even groot (wet van Pascal), ook op de hele zuiger.', en: 'The pressure is the same everywhere in the oil (Pascal’s law), on the whole piston too.', cues: ['cyl', 'force'] },
        { nl: 'Kracht = druk × oppervlak: {n:200} bar is {n:20} N/mm², op {n:7854} mm².', en: 'Force = pressure × area: {n:200} bar is {n:20} N/mm², on {n:7854} mm².', cues: ['force'] },
        { nl: 'Dat is zo’n {n:157} kN, het gewicht van {n:16} ton, uit een boring van {n:100} mm.', en: 'That is about {n:157} kN, the weight of {n:16} tonnes, from a {n:100} mm bore.', cues: ['force', 'ram'] },
      ],
    },
    {
      id: 's2', lesson: HYD, level: 2, dur: DUR[1], still: 0.9, title: { nl: 'Pomp, ventiel, cilinder', en: 'Pump, valve, cylinder' },
      beats: [
        { nl: 'Het aggregaat: een motor drijft de pomp aan. De pomp maakt het debiet, de liters per minuut.', en: 'The power unit: a motor drives the pump. The pump makes the flow, the litres per minute.', cues: ['motor', 'pump'] },
        { nl: 'Het {t:Stuurventiel|stuurventiel} kiest waar de olie heen gaat: boven of onder de zuiger.', en: 'The {t:Directional valve|directional valve} chooses where the oil goes: above or below the piston.', cue: { Stuurventiel: 'valve' }, cues: ['spool'] },
        { nl: 'De olie van de andere kant loopt via het filter terug naar de tank.', en: 'The oil from the other side runs back to the tank through the filter.', cues: ['filter'] },
        { nl: '{t:Cilindersnelheid|Cilindersnelheid} = debiet / zuigeroppervlak. Minder debiet: een tragere stoter.', en: '{t:Cylinder speed|Cylinder speed} = flow / piston area. Less flow: a slower ram.', cue: { Cilindersnelheid: 'speed' }, cues: ['ram'] },
      ],
    },
    {
      id: 's3', lesson: HYD, level: 2, dur: DUR[2], still: 0.9, title: { nl: 'De last maakt de druk', en: 'The load makes the pressure' },
      beats: [
        { nl: 'De pomp maakt debiet, geen druk. Zakt de stoter vrij, dan blijft de druk laag.', en: 'The pump makes flow, not pressure. While the ram moves freely, the pressure stays low.', cues: ['ram', 'gaugeBig'] },
        { nl: 'Raakt de matrijs het werkstuk, dan loopt de druk op.', en: 'When the die meets the workpiece, the pressure rises.', cues: ['gaugeBig'] },
        { nl: 'Het {t:Drukbegrenzingsventiel|drukbegrenzingsventiel} opent boven de ingestelde druk naar de tank.', en: 'The {t:Pressure relief valve|pressure relief valve} opens to the tank above its set pressure.', cue: { Drukbegrenzingsventiel: 'relief' } },
        { nl: 'Het debiet stroomt dan over het ventiel weg. Elk drukverlies wordt warmte.', en: 'The flow then pours away over the valve. Every pressure drop turns into heat.', cues: ['relief', 'filter'] },
      ],
    },
    {
      id: 's4', lesson: HYD, level: 2, dur: DUR[3], still: 0.9, title: { nl: 'Druk die blijft', en: 'Pressure that stays' },
      beats: [
        { nl: 'De {t:Accumulator|accumulator}: een vat met gas dat olie onder druk opslaat.', en: 'The {t:Accumulator|accumulator}: a vessel with gas that stores oil under pressure.', cue: { Accumulator: 'accumulator' } },
        { nl: 'Pomp uit: de manometer blijft staan. De accumulator blijft onder druk.', en: 'Pump off: the gauge does not drop. The accumulator stays pressurised.', cues: ['gauge', 'gaugeBig'] },
        { nl: 'Voor onderhoud: eerst een blok onder de opgeheven stoter, dan de accumulator leeg.', en: 'For maintenance: first a block under the raised ram, then bleed the accumulator.', cues: ['block', 'bleed'] },
        { nl: 'Pas als de manometer op nul staat, draai je iets open.', en: 'Only when the gauge reads zero do you open anything.', cues: ['gauge', 'gaugeBig'] },
      ],
    },
    {
      id: 's5', lesson: HYD, level: 2, dur: DUR[4], still: 0.92, title: { nl: 'Verloren debiet wordt warmte', en: 'Lost flow turns into heat' },
      beats: [
        { nl: 'Voorbeeld: een perscilinder met een boring van {n:125} mm, een pomp van {n:60} liter per minuut.', en: 'Example: a press cylinder of {n:125} mm bore, a pump of {n:60} litres per minute.', cues: ['cyl', 'pump'] },
        { nl: 'Oppervlak {n:12272} mm², debiet {n:0.001} m³/s: verwacht zo’n {n:81} mm/s.', en: 'Area {n:12272} mm², flow {n:0.001} m³/s: expected about {n:81} mm/s.', cues: ['ram'] },
        { nl: 'Gemeten: {n:60} mm/s, en de olie is {n:70} °C. Een kwart van het debiet komt niet aan.', en: 'Measured: {n:60} mm/s, and the oil is at {n:70} °C. A quarter of the flow never arrives.', cues: ['temp'] },
        { nl: 'Een versleten pomp of een ventiel dat te vroeg opent: verloren debiet wordt warmte.', en: 'A worn pump or a valve that opens too early: lost flow turns into heat.', cues: ['pump', 'relief'] },
        { nl: 'Boven zo’n {n:60} °C veroudert olie snel; ruwweg halve levensduur per {n:10} °C warmer.', en: 'Above about {n:60} °C oil ages fast; roughly half the life for each {n:10} °C hotter.', cues: ['temp'] },
      ],
    },
    {
      id: 's6', lesson: HYD, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'Vuil, vijand één', en: 'Dirt, enemy number one' },
      beats: [
        { nl: 'De meeste storingen komen door vuil, water of lucht in de olie.', en: 'Most failures come from dirt, water or air in the oil.', cues: ['filter'] },
        { nl: '{t:ISO 4406|ISO 4406} telt deeltjes per ml boven {n:4}, {n:6} en {n:14} µm, als code {n:18}/{n:16}/{n:13}.', en: '{t:ISO 4406|ISO 4406} counts particles per ml above {n:4}, {n:6} and {n:14} µm, as a code {n:18}/{n:16}/{n:13}.', cue: { 'ISO 4406': 'iso' } },
        { nl: 'Eén stap lager is ruwweg half zoveel deeltjes: lager is schoner.', en: 'One step lower is roughly half as many particles: lower is cleaner.', cues: ['iso'] },
        { nl: 'Filters op een streefcode, afgesloten ontluchters, olieanalyse, nooit bijvullen uit een open vat.', en: 'Filters for a target code, sealed breathers, oil analysis, never topping up from an open drum.', cues: ['filter', 'breather'] },
      ],
    },
    {
      id: 's7', lesson: HYD, level: 2, dur: DUR[6], still: 0.9, title: { nl: 'Een speldenprik', en: 'A pinprick' },
      beats: [
        { nl: 'Een lekkende slangkoppeling: een straal olie, zo fijn als een speld.', en: 'A leaking hose fitting: a jet of oil as fine as a pin.', cues: ['jet'] },
        { nl: 'Voel nooit met je hand. Houd er een stuk karton voor.', en: 'Never feel with your hand. Hold up a piece of cardboard.', cues: ['jet'] },
        { nl: 'Een {t:Injectieletsel|injectieletsel}: olie onder de huid, ook bij bescheiden druk. Het lijkt een prikje.', en: 'An {t:Injection injury|injection injury}: oil under the skin, even at modest pressure. It looks like a prick.', cue: { Injectieletsel: 'jet' } },
        { nl: 'Altijd een medisch spoedgeval: meteen naar de spoedeisende hulp.', en: 'Always a medical emergency: straight to the emergency department.', cues: [] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "·", "×", "=" or units as symbols in the
// spoken text: units are written out. Terms as in the films eng.safety.loto
// (accumulator, stoter, manometer, opgeslagen energie) and eng.power.motor.
// Dutch words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/voice-ab/phon.py with nl_NL-alex-medium): stuurventiel,
// smoorventiel and drukbegrenzingsventiel (stress on -tiel), cilindersnelheid
// (stress on snel), zuigeroppervlak (read "zuigiir-") and injectieletsel (stress on in-, -tie read with a t) get
// Dutch spoken forms in films/_kit/timeline.mjs (SAY), and ISO 4406 is said
// "ISO 44 06" as ISO 2768 is. Kept out of the Dutch narration: Pascal (read
// PAS-kal; the name stays in the caption), olieanalyse (read "aanaaliise"),
// streefcode (stress on code), retourfilter (stress on re-), "Eén" (read
// "ee-een") and elektromotor (as in the motor film).
// Shared words that espeak-ng stresses wrongly (olie as o-LIE, cilinder as
// CI-linder, manometer as MA-nometer, kilonewton as kilonew-TON) are left as
// the other films say them: a SAY rule would change their spoken text too.
const SAY = [
  [ // s1 force from pressure
    { nl: 'Persen, spuitgietmachines en graafmachines werken met hydrauliek. Olie onder hoge druk, meestal {n:100} tot {n:350} bar, maakt een grote kracht in een kleine ruimte.',
      en: 'Presses, injection moulding machines and excavators work with hydraulics. Oil under high pressure, typically {n:100} to {n:350} bar, makes a large force in a small space.' },
    { nl: 'In een afgesloten ruimte is de druk in de olie overal even groot. Hij duwt dus op de hele zuiger, in de cilinder op de kop van de pers.',
      en: 'In a closed space, the pressure in the oil is the same everywhere. So it pushes on the whole piston, in the cylinder on top of the press.' },
    { nl: 'De kracht is de druk maal het zuigeroppervlak. Een druk van 1 bar is {n:0.1} newton per vierkante millimeter, dus {n:200} bar is {n:20}. Een boring van {n:100} millimeter, de binnendiameter van de cilinder, geeft {n:7854} vierkante millimeter.',
      en: 'The force is the pressure times the piston area. A pressure of 1 bar is {n:0.1} newtons per square millimetre, so {n:200} bar is {n:20}. A bore of {n:100} millimetres, the inside diameter of the cylinder, gives {n:7854} square millimetres.' },
    { nl: 'Twintig maal {n:7854} is zo’n {n:157} kilonewton: het gewicht van {n:16} ton, uit één cilinder.',
      en: 'Twenty times {n:7854} is about {n:157} kilonewtons: the weight of {n:16} tonnes, from one cylinder.' },
  ],
  [ // s2 pump, valve, cylinder
    { nl: 'Die olie komt uit het hydraulisch aggregaat: tank, motor en pomp. Een tandwielpomp, schoepenpomp of zuigerpomp maakt het debiet: de liters per minuut.',
      en: 'That oil comes from the hydraulic power unit: tank, motor and pump. A gear, vane or piston pump makes the flow: the litres per minute.' },
    { nl: 'Het {t:Stuurventiel|stuurventiel} op de tank kiest waar de olie heen gaat. In de ene stand gaat ze boven op de zuiger, en schuift de stoter omlaag. In de andere stand gaat ze eronder, en komt de stoter terug.',
      en: 'The {t:Directional valve|directional valve} on the tank chooses where the oil goes. In one position it goes on top of the piston, and the ram moves down. In the other it goes underneath, and the ram comes back.' },
    { nl: 'De olie aan de andere kant van de zuiger loopt terug, door het filter, naar de tank.',
      en: 'The oil on the other side of the piston runs back, through the filter, to the tank.' },
    { nl: 'Hoe snel de stoter gaat, hangt af van het debiet. De {t:Cilindersnelheid|cilindersnelheid} is het debiet gedeeld door het zuigeroppervlak. Een smoorventiel knijpt het debiet en regelt zo de snelheid.',
      en: 'How fast the ram moves depends on the flow. The {t:Cylinder speed|cylinder speed} is the flow divided by the piston area. A flow control valve throttles the flow and so sets the speed.' },
  ],
  [ // s3 the load makes the pressure
    { nl: 'Een pomp maakt debiet, geen druk. De druk loopt maar zo ver op als de belasting tegenhoudt. Zolang de stoter vrij zakt, blijft de druk laag.',
      en: 'A pump makes flow, not pressure. The pressure only rises as far as the load resists. While the ram comes down freely, the pressure stays low.' },
    { nl: 'Dan raakt de bovenste matrijs het werkstuk. De olie kan nergens meer heen, en de druk loopt snel op.',
      en: 'Then the upper die meets the workpiece. The oil has nowhere left to go, and the pressure climbs fast.' },
    { nl: 'Daarom zit er altijd een {t:Drukbegrenzingsventiel|drukbegrenzingsventiel} in. Boven een ingestelde waarde gaat het open naar de tank. Zo begrenst het de druk, en beschermt het pomp, slangen en pers.',
      en: 'That is why there is always a {t:Pressure relief valve|pressure relief valve}. Above a set value it opens to the tank. That caps the pressure, and protects pump, hoses and press.' },
    { nl: 'Staat de stoter vast en draait de pomp door, dan stroomt het hele debiet over dat ventiel weg. Elk drukverlies over een ventiel wordt warmte, in de olie.',
      en: 'If the ram is held and the pump keeps running, all of the flow pours away over that valve. Every pressure drop across a valve turns into heat, in the oil.' },
  ],
  [ // s4 pressure that stays
    { nl: 'Naast de pomp staat een {t:Accumulator|accumulator}: een vat met een blaas of zuiger en gas erin, meestal stikstof. Het houdt olie onder druk, voor snelle bewegingen of bij een stroomstoring.',
      en: 'Next to the pump stands an {t:Accumulator|accumulator}: a vessel with a bladder or piston and gas inside, usually nitrogen. It keeps oil under pressure, for fast movements or during a power cut.' },
    { nl: 'Zet de pomp uit, en kijk naar de manometer: de naald blijft staan. De accumulator blijft onder druk, ook als de pomp stilstaat.',
      en: 'Switch the pump off and watch the gauge: the needle stays where it is. The accumulator stays pressurised, even with the pump stopped.' },
    { nl: 'Veilig stellen voor onderhoud is dus meer dan de motor uitzetten en vergrendelen. Eerst een blok onder de opgeheven stoter, of laat hem zakken. Pas daarna laat je de accumulator leeglopen.',
      en: 'So making it safe for maintenance is more than switching off the motor and locking it out. First a block under the raised ram, or lower it. Only then bleed off the accumulator.' },
    { nl: 'Kijk dan of de manometer echt op nul staat, voordat je iets opendraait. Het is opgeslagen energie, net als bij vergrendelen en labelen.',
      en: 'Then check that the gauge really reads zero before you open anything. It is stored energy, just as in lockout-tagout.' },
  ],
  [ // s5 lost flow turns into heat
    { nl: 'Een voorbeeld. Deze perscilinder heeft een boring van {n:125} millimeter, en de pomp levert {n:60} liter per minuut.',
      en: 'An example. This press cylinder has a bore of {n:125} millimetres, and the pump delivers {n:60} litres per minute.' },
    { nl: 'Het zuigeroppervlak is {n:12272} vierkante millimeter. Zestig liter per minuut is één liter per seconde. Gedeeld door het oppervlak geeft dat zo’n {n:81} millimeter per seconde.',
      en: 'The piston area is {n:12272} square millimetres. Sixty litres per minute is one litre per second. Divided by the area, that gives about {n:81} millimetres per second.' },
    { nl: 'Gemeten: maar {n:60} millimeter per seconde, en de olie is {n:70} graden. Een kwart van het debiet komt dus niet bij de cilinder aan.',
      en: 'Measured: only {n:60} millimetres per second, and the oil is at {n:70} degrees. So about a quarter of the flow never reaches the cylinder.' },
    { nl: 'Waarschijnlijk lekt een versleten pomp inwendig, of opent een drukbegrenzingsventiel te vroeg. Allebei maken ze van het verloren debiet warmte: vandaar de hete olie.',
      en: 'Most likely a worn pump leaks internally, or a pressure relief valve opens too early. Both turn the lost flow into heat: hence the hot oil.' },
    { nl: 'Olie die steeds boven zo’n {n:60} graden draait, veroudert snel, en afdichtingen worden hard. Een gangbare regel: per {n:10} graden warmer gaat de olie ruwweg half zo lang mee.',
      en: 'Oil that keeps running above about {n:60} degrees ages fast, and seals harden. A common rule of thumb: for every {n:10} degrees hotter, the oil lasts roughly half as long.' },
  ],
  [ // s6 dirt, enemy number one
    { nl: 'De grootste vijand is vuil. De meeste hydraulische storingen zijn terug te voeren op vuil, water of lucht in de olie.',
      en: 'The main enemy is dirt. Most hydraulic failures trace back to dirt, water or air in the oil.' },
    { nl: 'Hoe schoon de olie is, zeg je met de code van {t:ISO 4406|ISO 4406}. Die telt de deeltjes per milliliter groter dan {n:4}, {n:6} en {n:14} micrometer, als drie codegetallen, zoals {n:18}, {n:16}, {n:13}.',
      en: 'How clean the oil is, you say with the {t:ISO 4406|ISO 4406} code. It counts the particles per millilitre larger than {n:4}, {n:6} and {n:14} micrometres, as three code numbers, such as {n:18}, {n:16}, {n:13}.' },
    { nl: 'Elke stap lager in de code betekent ruwweg de helft van het aantal deeltjes. Lager is dus schoner.',
      en: 'Each step lower in the code means roughly half the number of particles. So lower is cleaner.' },
    { nl: 'Goede praktijk: filters gekozen op de code die je wilt halen, afgesloten ontluchters op de tank, oliemonsters laten onderzoeken, en nooit bijvullen uit een open vat.',
      en: 'Good practice: filters chosen for the code you want to reach, sealed breathers on the tank, regular oil analysis, and never topping up from an open drum.' },
  ],
  [ // s7 a pinprick
    { nl: 'En dan een lek. Deze slangkoppeling spuit een fijne straal olie, zo dun als een speld.',
      en: 'And then a leak. This hose fitting sprays a fine jet of oil, as thin as a pin.' },
    { nl: 'Voel nooit met je hand naar een lek. Houd er een stuk karton voor: op het karton zie je de straal.',
      en: 'Never feel for a leak with your hand. Hold a piece of cardboard in front of it: the cardboard shows the jet.' },
    { nl: 'Zo’n straal kan olie door de huid heen spuiten, ook bij bescheiden druk. Dat is een {t:Injectieletsel|injectieletsel}. Het lijkt een prikje, maar het kan een vinger of een hand kosten.',
      en: 'A jet like that can force oil through the skin, even at modest pressure. That is an {t:Injection injury|injection injury}. It looks like a small prick, but it can cost a finger or a hand.' },
    { nl: 'Het is altijd een medisch spoedgeval: meteen naar de spoedeisende hulp, en zeg dat het om olie onder hoge druk gaat. Wacht niet tot het pijn doet.',
      en: 'It is always a medical emergency: go straight to the emergency department, and say it is oil under high pressure. Do not wait until it hurts.' },
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
.hy-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.hy-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.hy-glass{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6}
.hy-level{fill:var(--anatomy-lo);stroke:none}
.hy-merc{fill:var(--fp-accent);stroke:none}
.hy-dial{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.4}
.hy-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.hy-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.hy-needle{fill:none;stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linecap:round}
.hy-hose .iso-line{stroke-width:2.2px}
.hy-flow{fill:none;stroke:var(--fp-accent);stroke-width:1.5px;stroke-dasharray:2.2 3.4;stroke-linecap:round}
.hy-jet{fill:none;stroke:var(--fp-accent);stroke-width:.7px;stroke-linecap:round}
.hy-board{fill:color-mix(in srgb,#B8925E 70%,var(--anatomy-face));stroke:#7A5C34;stroke-width:.5}
.hy-stain{fill:#5E4524;stroke:none}
.hy-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.hy-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.hy-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.hy-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.hy-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.hy-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.hy-wall{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1.4}
.hy-steel{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.4}
.hy-oil{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:none}
.hy-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hy-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hy-acc{fill:var(--fp-accent);stroke:none}
.hy-dot{fill:var(--anatomy-mid);stroke:none}
.hy-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.hy-row{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-shade-0));stroke:var(--fp-accent);stroke-width:1.4}
.hy-badge{fill:var(--fp-accent);stroke:none}
.hy-badgeT{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .hy-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .hy-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .hy-needle{stroke:var(--fp-accent)}
[data-cue][data-on] .hy-steel{stroke:var(--fp-accent)}
[data-cue][data-on] .hy-merc{fill:var(--fp-accent-text)}
`;

const label = {
  nl: 'Een hydraulische pers met een bed, twee staanders, een kop met de hoofdcilinder en een stoter met de bovenste matrijs boven de onderste matrijs, een veiligheidsblok, en rechts een hydraulisch aggregaat: een tank met peilglas, thermometer, ontluchter en retourfilter, een motor met pomp, een ventielblok met een stuurventiel met twee spoelen en een drukbegrenzingsventiel, en een accumulator met aftapventiel en manometer. Slangen lopen van het ventielblok naar de cilinder; een koppeling kan lekken, met een stuk karton ervoor. Kaarten tonen een doorsnede van de cilinder met de kracht, de schuif van het stuurventiel, de manometer, het rekenvoorbeeld met snelheid en warmte, de reinheidscode volgens ISO 4406 en twee lijstjes.',
  en: 'A hydraulic press with a bed, two uprights, a crown with the main cylinder and a ram with the upper die above the lower die, a safety block, and on the right a hydraulic power unit: a tank with a level glass, thermometer, breather and return filter, a motor with a pump, a valve manifold with a two-coil directional valve and a pressure relief valve, and an accumulator with a bleed valve and gauge. Hoses run from the manifold to the cylinder; one fitting can leak, with a piece of cardboard held in front. Cards show a section through the cylinder with the force, the directional valve spool, the gauge, the worked example with speed and heat, the ISO 4406 cleanliness code and two checklists.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

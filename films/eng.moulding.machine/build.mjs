// Dev tool, not shipped. Builds the explainer film "De spuitgietmachine / The
// moulding machine" for the topic De machine of Spuitgieten (machine L1,
// screw L2, clamp L3, electric L4).
//
//   node films/eng.moulding.machine/build.mjs            build the page
//   node films/eng.moulding.machine/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.machine.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.3.
//
// The drawing: the whole press of the figure eng.moulding.screw, cut open
// along the screw axis (the plane y = 0) like the press of the film
// eng.moulding.setting: on the left the injection unit (hydraulic injection
// cylinder, hopper, barrel with heater bands, the screw), in the middle the
// mould between the fixed and the moving platen on the tie bars, on the right
// the rear platen and the hydraulic clamp cylinder. The moving platen, the
// moving mould half, the ejector pins and the clamp piston move as one when the
// mould opens. Cards in stage space carry the sums and comparisons.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' and the narration's {n:...} numbers are then
// checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// machine: a housing 15 × 20 cm in ABS at 0,4 t/cm²; 2 cavities; 10–20 % margin
const HOUSING = { w: 15, d: 20, p: 0.4, cav: 2 };
const AREA = HOUSING.w * HOUSING.d;
assert(AREA === 300, '15 × 20 = 300 cm²');
assert(near(AREA * HOUSING.p, 120), '300 × 0,4 = 120 t');
assert(near(AREA * HOUSING.cav * HOUSING.p, 240), '2 cavities: 600 cm² → 240 t');
assert(240 * 1.1 <= 280 && 240 * 1.2 <= 300 && 240 * 1.2 > 280, '240 t + 10–20 % → a 280 or 300 t press');
// screw: 600 g fits in the barrel; 150 g shot at 30 s; a 60 g part
const SCREW = { barrel: 600, shot: 150, cycle: 30, small: 60, limitMin: 4 };
const shots = (g) => SCREW.barrel / g;
assert(shots(SCREW.shot) === 4 && shots(SCREW.shot) * SCREW.cycle === 120, '600 / 150 = 4 shots → 120 s');
assert(shots(SCREW.small) === 10 && shots(SCREW.small) * SCREW.cycle === 300, '600 / 60 = 10 shots → 300 s = 5 min');
assert(300 > SCREW.limitMin * 60, '300 s is over the 4 min of the example data sheet');
const LD = 20; // "ongeveer 20 keer zo lang als hij dik is"
// clamp: PP lid, 380 cm² at 0,45 t/cm²; shot 100 cm³ on press A (120 cm³) or B (250 cm³)
const CLAMP = { area: 380, p: 0.45, margin: 0.15, shot: 100, A: { t: 200, vmax: 120 }, B: { t: 250, vmax: 250 } };
assert(near(CLAMP.area * CLAMP.p, 171), '380 × 0,45 = 171 t');
assert(Math.round(CLAMP.area * CLAMP.p * (1 + CLAMP.margin)) === 197, '+15 % ≈ 197 t');
const UTIL = { A: Math.round((100 * CLAMP.shot) / CLAMP.A.vmax), B: Math.round((100 * CLAMP.shot) / CLAMP.B.vmax) };
assert(UTIL.A === 83 && UTIL.B === 40, '100 / 120 = 83 %, 100 / 250 = 40 %');
assert(UTIL.A > 80 && UTIL.B >= 40 && UTIL.B <= 60, 'A over the 80 % rule, B in the 40–60 % sweet spot');
// electric: 30 kg/h × 6.000 h = 180.000 kg; 0,6 → 0,3 kWh/kg at € 0,20; € 40.000 extra
const EL = { kgh: 30, hours: 6000, hyd: 0.6, ele: 0.3, price: 0.2, extra: 40000 };
const KG = EL.kgh * EL.hours;
const SAVE = (EL.hyd - EL.ele) * KG * EL.price;
assert(KG === 180000, '30 × 6.000 = 180.000 kg');
assert(near((EL.hyd - EL.ele) * KG, 54000, 1e-6), '0,3 × 180.000 = 54.000 kWh');
assert(near(SAVE, 10800, 1e-6), '54.000 × 0,20 = € 10.800');
assert(near(Math.round((EL.extra / SAVE) * 10) / 10, 3.7), '40.000 / 10.800 ≈ 3,7 years');

// ---------------------------------------------------------------- the world
// x along the screw toward the mould and on to the clamp, y toward the viewer,
// z up; the screw axis is z = 0. Everything is cut open at y = 0, so the parts
// are drawn from y < 0 and their cut faces lie in the plane y = 0.
const W = 640;
const H = 400;
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const TIP0 = -64; // the screw tip at full stroke forward
const STROKE = 60; // drawn dosing stroke (world units = mm of stroke)
const BORE = { x0: -280, x1: -60, r: 16 };
const BARREL_R = 34;
const CYL = { x0: -398, x1: -300, r: 40, bore: 34 };
const NOZ = { x0: -60, x1: -14, r: 3.5 };
const SPRUE = { x0: -14, x1: 45, r0: 3, r1: 4.6 };
const GATEN = { x0: 45, x1: 51, r: 1.8 };
const CAV = { x0: 51, x1: 63, h: 60, skirt: 22, t: 10 }; // a lid: top wall in the fixed half, skirt in the moving half
const PL = 63; // parting plane
const OPEN = 80; // opening stroke drawn
const MPL = [185, 215]; // moving platen
const RPL = [360, 392]; // rear platen
const CCYL = { x0: 392, x1: 500, r: 64, bore: 56 }; // clamp cylinder
const PISTON = [398, 410]; // the clamp piston, mould closed
const RAM_R = 20;
// screw zones as distances back from the tip. The drawn screw is shortened
// (its bore is about 7 diameters long, a real screw about 20: the card of scene
// 4 shows the true proportion, feed about half the flighted length,
// compression and metering about a quarter each).
const ZONES = { flight0: 36, meter: 82, comp: 132, end: 330 };

const FIT = [
  ...k.boxCorners({ x: -490, y: -180, w: 1000, d: 180 }, -270, 196),
  [-300, -60, 150], [-440, 0, 60],
];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 60, elevation: 28 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0.8, ...plan }, z0, z1 - z0, P, 4, bevel), style);
const cut = (x0, x1, d, z0, z1, style = {}, bevel = 0.6) => box({ x: x0, y: -d, w: x1 - x0, d }, z0, z1, style, bevel);
const semi = (r, n = 28) => Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI / 2 + (Math.PI * i) / n; return [r * Math.cos(a), r * Math.sin(a)]; });
const hcyl = (x0, x1, r, style = {}, z = 0) => S(G.prismOf(G.frameOf([0, 0, z], X, Y, Z), semi(r), x0, x1, P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const sp = ([x, z]) => at([x, 0, z]);
const secPath = (pts) => k.pathOf(pts.map(sp), true);
const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const sec = (pts, cls = 'fp-sec') => `<path class="${cls}" d="${secPath(pts)}"/>`;
function hatch(x0, x1, z0, z1, step = 11) {
  const segs = [];
  for (let c = Math.ceil((x0 - z1) / step) * step; c <= x1 - z0; c += step) {
    const za = Math.max(z0, x0 - c);
    const zb = Math.min(z1, x1 - c);
    if (zb - za > 0.5) segs.push(k.pathOf([sp([za + c, za]), sp([zb + c, zb])]));
  }
  return `<path class="fp-hatch" d="${segs.join('')}"/>`;
}
const steelSec = (x0, x1, z0, z1, step) => sec(rect(x0, x1, z0, z1)) + hatch(x0, x1, z0, z1, step) + `<path class="fp-cutline" d="${secPath(rect(x0, x1, z0, z1))}"/>`;
const dots = (pts, size = 0.6, tone = 'mid') => k.dotsSvg(pts.map(at), { size, tone });
const ring = (cx, cz, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cz + r * Math.sin((i / n) * Math.PI * 2)]);

// ---------------------------------------------------------------- the bed and the floor parts
const BED = { x: -490, y: -180, w: 1000, d: 180, r: 0.8 };
const bed = [
  cut(-490, 510, 180, -270, -200, { tone: 'lo' }),
  L(k.sideSeam(BED, -212, P, 4), { tone: 'faint' }),
  L(k.sideSeam(BED, -258, P, 4), { tone: 'faint' }),
  // the rail of the injection carriage and the clamp's platen rail, with screws
  cut(-480, -280, 150, -200, -194, { tone: 'lo', crease: 'lo' }, 0.3),
  dots([-470, -440, -410, -380, -350, -320, -290].map((x) => [x, -75, -194]), 0.5, 'lo'),
  cut(150, 400, 150, -200, -194, { tone: 'lo', crease: 'lo' }, 0.3),
  dots([160, 190, 220, 250, 280, 310, 340, 370].map((x) => [x, -75, -194]), 0.5, 'lo'),
  // a ventilation grille and a label plate on the bed's front edge (cut face)
  `<path class="fp-cutline" d="${secPath(rect(-200, -120, -246, -224))}"/>`,
  ...[0, 1, 2].map((i) => `<path class="fp-faintline" d="${k.pathOf([sp([-194, -231 - i * 5]), sp([-140 + i * 8, -231 - i * 5])])}"/>`),
  dots([[-196, 0, -228], [-124, 0, -228], [-196, 0, -242], [-124, 0, -242]], 0.5, 'mid'),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path class="fp-cutline" d="${secPath(rect(60 + i * 16, 70 + i * 16, -250, -222))}"/>`),
].join('');

// the four tie bars: the rear pair is seen behind the section, from the fixed platen to the rear platen
const tieBars = [165, -165].map((z) => [
  S(G.solidOf([[0, 12], [452, 12]], G.frameOf([-40, -135, z], X, Y, Z), P), { tone: 'mid', crease: 'lo' }),
  S(G.solidOf([[0, 20], [14, 20]], G.frameOf([RPL[1], -135, z], X, Y, Z), P), { tone: 'mid', crease: 'lo' }),
].join('')).join('');

const carriage = [
  cut(-480, -290, 120, -194, -62, { tone: 'lo' }),
  L(k.sideSeam({ x: -480, y: -120, w: 190, d: 120, r: 0.8 }, -70, P, 4), { tone: 'faint' }),
  cut(-380, -330, 70, -62, -38),
  cut(-275, -255, 60, -194, -30),
  L(k.sideSeam({ x: -275, y: -60, w: 20, d: 60, r: 0.8 }, -40, P, 4), { tone: 'faint' }),
  // the carriage cylinder that pushes the nozzle against the mould
  hcyl(-250, -120, 9, { crease: 'lo' }, -150),
  hcyl(-120, -40, 4, { tone: 'hi', crease: 'lo' }, -150),
].join('');

// the inline injection unit: hydraulic motor at the back, the injection cylinder
// whose piston carries the screw, then the barrel with heater bands
const motor = [
  hcyl(-446, -404, 24),
  hcyl(-404, -398, 30, { crease: 'lo' }),
  cut(-440, -412, 40, 24, 40, { crease: 'lo' }),
  dots([[-436, -10, 40], [-416, -10, 40]], 0.6),
].join('');
const cylinder = [
  hcyl(CYL.x0, CYL.x1, CYL.r),
  hcyl(CYL.x0 - 4, CYL.x0 + 6, CYL.r + 4, { crease: 'lo' }),
  hcyl(CYL.x1 - 6, CYL.x1 + 4, CYL.r + 4, { crease: 'lo' }),
  S(G.solidOf([[0, 3], [CYL.x1 - CYL.x0 + 8, 3]], G.frameOf([CYL.x0 - 4, -14, CYL.r + 4], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
  cut(-332, -318, 18, CYL.r - 2, CYL.r + 10, { crease: 'lo' }, 0.3),
].join('');
const cylSec = [
  steelSec(CYL.x0 - 4, CYL.x1 + 4, CYL.bore, CYL.r + 4, 9),
  steelSec(CYL.x0 - 4, CYL.x1 + 4, -CYL.r - 4, -CYL.bore, 9),
  sec(rect(CYL.x0 + 6, CYL.x1 - 6, -CYL.bore, CYL.bore), 'fp-oil'),
  steelSec(CYL.x0 - 4, CYL.x0 + 6, -CYL.bore, CYL.bore, 9),
  steelSec(CYL.x1 - 6, CYL.x1 + 4, -CYL.bore, CYL.bore, 9),
  sec(rect(CYL.x1 - 6, CYL.x1 + 4, -9, 9), 'fp-bore'),
  sec(rect(-404, -398, -9, 9), 'fp-steel'),
].join('');
const shank = hcyl(CYL.x1 + 4, BORE.x0, 9, { tone: 'hi', crease: 'lo' });

const HEAT = [[-232, -204], [-190, -162], [-148, -120], [-106, -78]];
const barrel = [
  hcyl(BORE.x0, BORE.x1, BARREL_R),
  hcyl(BORE.x1, BORE.x1 + 8, 24, { crease: 'lo' }),
  hcyl(BORE.x1 + 8, -32, 14),
  hcyl(-32, NOZ.x1, 9, { tone: 'hi' }),
].join('');
const heaters = HEAT.map(([a, b]) => [
  hcyl(a, b, BARREL_R + 4, { crease: 'lo' }),
  L(G.arcOf(G.frameOf([0, 0, 0], X, Y, Z), (a + b) / 2, BARREL_R + 4, P, { from: Math.PI / 2, to: Math.PI * 1.5 }), { tone: 'faint' }),
  cut((a + b) / 2 - 6, (a + b) / 2 + 6, 12, BARREL_R + 3, BARREL_R + 11, { crease: 'lo' }, 0.3),
  dots([[(a + b) / 2 - 3, -6, BARREL_R + 11], [(a + b) / 2 + 3, -6, BARREL_R + 11]], 0.55, 'hi'),
].join('')).join('');
const heatSec = HEAT.map(([a, b]) => sec(rect(a, b, BARREL_R, BARREL_R + 4), 'fp-band') + sec(rect(a, b, -BARREL_R - 4, -BARREL_R), 'fp-band')).join('');
const hopperPoly = [[-292, 52], [-250, 52], [-226, 140], [-316, 140]];
const hopper = [
  cut(-296, -246, 40, 30, 52),
  S(G.prismOf(G.frameOf([0, 0, 0], Y, X, Z), hopperPoly, -56, 0, P), { tone: 'mid' }),
  // the lid on the hopper
  cut(-322, -220, 60, 140, 146, { crease: 'lo' }, 0.4),
].join('');
const pellets = (() => {
  const pts = [];
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 120; i++) {
    const z = 56 + r() * 70;
    const half = 21 + ((z - 52) / 88) * 24;
    pts.push([-271 + (r() * 2 - 1) * (half - 5), z]);
  }
  for (let i = 0; i < 26; i++) pts.push([-282 + r() * 24, 18 + r() * 34]);
  return k.dotsSvg(pts.map(sp), { size: 1.25, tone: 'mid' });
})();
const hopperSec = [
  sec(hopperPoly, 'fp-bore'),
  sec([[-292, 52], [-288, 52], [-312, 140], [-316, 140]], 'fp-steel'),
  sec([[-254, 52], [-250, 52], [-226, 140], [-230, 140]], 'fp-steel'),
  steelSec(-296, -284, 18, 52, 8),
  steelSec(-258, -246, 18, 52, 8),
  sec(rect(-284, -258, 18, 52), 'fp-bore'),
  pellets,
].join('');
const barrelSec = [
  steelSec(BORE.x0, BORE.x1, BORE.r, BARREL_R, 9),
  steelSec(BORE.x0, BORE.x1, -BARREL_R, -BORE.r, 9),
  sec(rect(BORE.x0, BORE.x1, -BORE.r, BORE.r), 'fp-bore'),
  steelSec(BORE.x1, BORE.x1 + 8, -24, 24, 8),
  steelSec(BORE.x1 + 8, -32, -14, 14, 8),
  steelSec(-32, NOZ.x1, -9, 9, 7),
  sec([[BORE.x1, -BORE.r], [BORE.x1 + 8, -NOZ.r], [BORE.x1 + 8, NOZ.r], [BORE.x1, BORE.r]], 'fp-melt'),
  sec(rect(BORE.x1 + 8, NOZ.x1, -NOZ.r, NOZ.r), 'fp-melt'),
  sec(rect(BORE.x1 + 2, BORE.x1 + 5, 16, 24), 'fp-bore'),
].join('');

// ---------------------------------------------------------------- the clamp side: platens, mould, rear platen, clamp cylinder
const fixedPlaten = [cut(-40, -14, 170, -200, 196), L(k.sideSeam({ x: -40, y: -170, w: 26, d: 170, r: 0.8 }, 186, P, 4), { tone: 'faint' })].join('');
const fixedPlatenSec = [steelSec(-40, -14, 18, 196, 17), steelSec(-40, -14, -200, -18, 17), sec(rect(-40, -14, -18, 18), 'fp-bore')].join('');
const nozzleInPlaten = [steelSec(-40, NOZ.x1, -9, 9, 7), sec(rect(-40, NOZ.x1, -NOZ.r, NOZ.r), 'fp-melt')].join('');
const fixedHalf = [
  cut(-14, 4, 112, -150, 150),
  cut(4, PL, 100, -130, 130),
  S(G.solidOf([[0, 6], [6, 6]], G.frameOf([34, -50, 130], Z, X, Y), P), { tone: 'mid', crease: 'lo' }),
  L(G.circleOf(G.frameOf([34, -50, 142], Y, X, Z), 0, 7, P), { tone: 'mid' }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([20, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([48, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  k.dotsSvg([[-9, -10], [-9, -102], [0, -10], [0, -102]].map(([x, y]) => at([x, y, 150])), { size: 0.55 }),
  k.dotsSvg([[10, -8], [57, -8], [10, -92], [57, -92]].map(([x, y]) => at([x, y, 130])), { size: 0.55 }),
].join('');
const cavTop = rect(CAV.x0, CAV.x1, -CAV.h, CAV.h);
const skirtUp = rect(PL, PL + CAV.skirt, CAV.h - CAV.t, CAV.h);
const skirtDn = rect(PL, PL + CAV.skirt, -CAV.h, -CAV.h + CAV.t);
const spruePoly = [[SPRUE.x0, -SPRUE.r0], [SPRUE.x1, -SPRUE.r1], [SPRUE.x1, SPRUE.r1], [SPRUE.x0, SPRUE.r0]];
const gatePoly = [[SPRUE.x1, -SPRUE.r1], [GATEN.x0 + 2, -GATEN.r], [GATEN.x1, -GATEN.r], [GATEN.x1, GATEN.r], [GATEN.x0 + 2, GATEN.r], [SPRUE.x1, SPRUE.r1]];
const fixedSec = [
  steelSec(-14, 4, -150, 150, 15),
  steelSec(4, PL, -130, 130, 15),
  sec(rect(-14, 30, -11, 11), 'fp-steel'),
  `<path class="fp-cutline" d="${secPath(rect(-14, 30, -11, 11))}"/>`,
  sec(spruePoly, 'fp-bore'),
  sec(gatePoly, 'fp-bore'),
  sec(cavTop, 'fp-bore'),
].join('');
const COOL_F = [[30, 40], [30, -40], [30, 100], [30, -100]];
const COOL_M = [[96, 40], [96, -40], [96, 100], [96, -100]];
const coolSec = (list) => list.map(([x, z]) => `<path class="fp-water" d="${secPath(ring(x, z, 5.5))}"/><path class="fp-cutline" d="${secPath(ring(x, z, 5.5))}"/>`).join('');
const gateMark = `<path class="fp-mark" d="${secPath([[GATEN.x0 - 2, -6], [GATEN.x1 + 2, -6], [GATEN.x1 + 2, 6], [GATEN.x0 - 2, 6]])}"/>`;
const movingHalf = [
  cut(PL, 125, 100, -130, 130),
  cut(125, 165, 100, 95, 130),
  cut(125, 165, 100, -130, -95),
  cut(165, 185, 112, -150, 150),
  k.dotsSvg([[70, -8], [118, -8], [70, -92], [118, -92]].map(([x, y]) => at([x, y, 130])), { size: 0.55 }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([84, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([108, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
].join('');
const PINS = [-40, -14, 14, 40];
const movingSec = [
  steelSec(PL, 125, -130, 130, 15),
  steelSec(125, 165, 95, 130, 15),
  steelSec(125, 165, -130, -95, 15),
  sec(rect(125, 165, -95, 95), 'fp-bore'),
  steelSec(165, 185, -150, 150, 15),
  sec(skirtUp, 'fp-bore'),
  sec(skirtDn, 'fp-bore'),
  // the bores of the ejector pins through the core
  ...PINS.map((z) => sec(rect(PL, 125, z - 2.6, z + 2.6), 'fp-bore')),
].join('');
// the ejector plate and pins (they move on their own when the part is pushed off)
// (in section only: the plate sits in the moving half's open box, seen through the cut)
const ejector = [
  steelSec(135, 150, -90, 90, 8),
  ...PINS.map((z) => sec(rect(PL, 135, z - 2.2, z + 2.2), 'fp-steel') + `<path class="fp-cutline" d="${k.pathOf([sp([PL, z - 2.2]), sp([135, z - 2.2])])}${k.pathOf([sp([PL, z + 2.2]), sp([135, z + 2.2])])}"/>`),
  // the ejector rod back through the platen
  sec(rect(150, 215, -6, 6), 'fp-steel'),
].join('');
const movingPlaten = [cut(MPL[0], MPL[1], 170, -200, 196), L(k.sideSeam({ x: MPL[0], y: -170, w: MPL[1] - MPL[0], d: 170, r: 0.8 }, 186, P, 4), { tone: 'faint' }),
  // the platen's shoe on the rail
  cut(MPL[0] + 2, MPL[1] - 2, 150, -214, -200, { tone: 'lo' }, 0.3)].join('');
const movingPlatenSec = [steelSec(MPL[0], MPL[1], 6, 196, 17), steelSec(MPL[0], MPL[1], -200, -6, 17)].join('');
// the clamp ram, from the moving platen back into the clamp cylinder
const ram = [hcyl(MPL[1], PISTON[1], RAM_R, { tone: 'hi', crease: 'lo' }), sec(rect(MPL[1], PISTON[0], -RAM_R, RAM_R), 'fp-ram')].join('');
const rearPlaten = [cut(RPL[0], RPL[1], 170, -200, 196), L(k.sideSeam({ x: RPL[0], y: -170, w: RPL[1] - RPL[0], d: 170, r: 0.8 }, 186, P, 4), { tone: 'faint' })].join('');
const rearPlatenSec = [steelSec(RPL[0], RPL[1], RAM_R + 2, 196, 17), steelSec(RPL[0], RPL[1], -200, -RAM_R - 2, 17), sec(rect(RPL[0], RPL[1], -RAM_R - 2, RAM_R + 2), 'fp-bore')].join('');
const clampCyl = [
  hcyl(CCYL.x0, CCYL.x1, CCYL.r),
  hcyl(CCYL.x0, CCYL.x0 + 10, CCYL.r + 5, { crease: 'lo' }),
  hcyl(CCYL.x1 - 10, CCYL.x1, CCYL.r + 5, { crease: 'lo' }),
  // tie rods along its top, and the two oil ports
  S(G.solidOf([[0, 3], [CCYL.x1 - CCYL.x0, 3]], G.frameOf([CCYL.x0, -20, CCYL.r + 5], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
  cut(CCYL.x0 + 18, CCYL.x0 + 32, 18, CCYL.r - 2, CCYL.r + 12, { crease: 'lo' }, 0.3),
  cut(CCYL.x1 - 32, CCYL.x1 - 18, 18, CCYL.r - 2, CCYL.r + 12, { crease: 'lo' }, 0.3),
].join('');
const clampCylSec = [
  steelSec(CCYL.x0, CCYL.x1, CCYL.bore, CCYL.r + 5, 14),
  steelSec(CCYL.x0, CCYL.x1, -CCYL.r - 5, -CCYL.bore, 14),
  steelSec(CCYL.x1 - 10, CCYL.x1, -CCYL.bore, CCYL.bore, 14),
  steelSec(CCYL.x0, CCYL.x0 + 4, -CCYL.bore, -RAM_R - 1, 6),
  steelSec(CCYL.x0, CCYL.x0 + 4, RAM_R + 1, CCYL.bore, 6),
  sec(rect(CCYL.x0 + 4, CCYL.x1 - 10, -CCYL.bore, CCYL.bore), 'fp-oil'),
].join('');
const piston = [steelSec(PISTON[0], PISTON[1], -CCYL.bore, CCYL.bore, 6), sec(rect(PISTON[0] - 30, PISTON[0], -RAM_R, RAM_R), 'fp-ram'), `<path class="fp-cutline" d="${secPath(rect(PISTON[0] - 30, PISTON[0], -RAM_R, RAM_R))}"/>`].join('');
// the parting line: where the mould halves meet, a line across the section
const partingLine = `<path class="fp-mark fp-thick" d="${k.pathOf([sp([PL, -130]), sp([PL, 130])])}"/>`;

// ---------------------------------------------------------------- clip paths in the section
const defs = `<defs>
<clipPath id="fm-bore"><path d="${secPath(rect(BORE.x0, BORE.x1 + 0.2, -BORE.r, BORE.r))}"/></clipPath>
<clipPath id="fm-ccyl"><path d="${secPath(rect(CCYL.x0 + 4, CCYL.x1 - 10, -CCYL.bore, CCYL.bore))}"/></clipPath>
</defs>`;

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('bed', bed),
  g('ties', tieBars, ' data-cue="ties"'),
  g('carriage', carriage),
  g('motor', motor),
  g('cyl', cylinder),
  `<g data-cue="hyd">${g('cylSec', cylSec)}</g>`,
  g('shank', shank),
  g('barrel', barrel),
  // the heater bands' solids first: their flat faces lie in the section plane,
  // so the barrel's section is drawn over them, then the bands' cut faces
  g('heat', heaters, ' data-cue="heat"'),
  g('barrelSec', barrelSec),
  g('heatSec', heatSec, ' data-cue="heat"'),
  g('hopper', hopper + hopperSec, ' data-cue="hopper"'),
  `<g clip-path="url(#fm-bore)" data-cue="screw">${g('screw', '')}</g>`,
  `<g clip-path="url(#fm-bore)">${['feed', 'comp', 'meter'].map((z) => g(`z-${z}`, '', ` data-cue="${z}"`)).join('')}</g>`,
  g('shotv', '', ' data-cue="shotv"'),
  g('ring', ''),
  g('fplaten', fixedPlaten + fixedPlatenSec + nozzleInPlaten),
  g('fixed', fixedHalf + fixedSec),
  g('coolF', coolSec(COOL_F), ' data-cue="cool"'),
  g('mov', [
    movingHalf, movingSec,
    `<g data-cue="cool">${coolSec(COOL_M)}</g>`,
  ].join('')),
  g('pins', ejector, ' data-cue="pins"'),
  g('part', ''),
  g('pack', '', ' data-cue="pack"'),
  g('press', '', ' data-cue="press"'),
  g('gate', gateMark, ' data-cue="gate"'),
  g('parting', partingLine, ' data-cue="parting"'),
  g('movP', movingPlaten + movingPlatenSec + ram),
  g('rear', rearPlaten + rearPlatenSec),
  g('ccyl', clampCyl),
  `<g data-cue="hyd">${g('ccylSec', clampCylSec)}<g clip-path="url(#fm-ccyl)">${g('piston', piston)}</g></g>`,
  g('force', '', ' data-cue="force"'),
  g('stroke', '', ' data-cue="stroke"'),
  g('mh', '', ' data-cue="mh"'),
  g('os', '', ' data-cue="os"'),
].join('');

// ---------------------------------------------------------------- cards (stage space, not under the camera)
const slot = (cue, key) => `<g data-cue="${cue}">${g(key, '')}</g>`;
const hud = [
  g('ldC', [g('ldBase', ''), ...['feed', 'comp', 'meter'].map((z) => slot(z, `ld-${z}`))].join('')),
  g('shadowC', slot('shadow', 'shadowBody')),
  g('rulerC', slot('stroke', 'rulerBody')),
  g('resC', slot('res', 'resBody')),
  g('checkC', [g('checkBase', ''), slot('press', 'ckForce'), slot('shotv', 'ckShot'), slot('util', 'ckUtil'), slot('mh', 'ckFit'), slot('os', 'ckOpen')].join('')),
  g('driveC', [g('driveBase', ''), slot('hyd', 'dvHyd'), slot('elec', 'dvElec'), slot('servo', 'dvServo'), slot('hybrid', 'dvHyb')].join('')),
  g('secC', slot('sec', 'secBody')),
  g('specC', [slot('twok', 'spTwo'), slot('insert', 'spIns')].join('')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${defs}${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
// cam(p, w, s): world point p at stage point s, w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WHOLE = (() => {
  const pts = k.boxCorners({ x: -490, y: -180, w: 1000, d: 180 }, -270, 196).map(at);
  const xs = pts.map(([x]) => x);
  const ys = pts.map(([, y]) => y);
  return [Math.round(((Math.min(...xs) + Math.max(...xs)) / 2) * 10) / 10, Math.round(((Math.min(...ys) + Math.max(...ys)) / 2) * 10) / 10, 650];
})();
const INJ = cam([-250, 0, 20], 400);
const CLAMPV = cam([180, -60, 0], 470);
const MOULD = cam([60, 0, 0], 300);
const MOULD_L = cam([70, 0, 0], 330, [190, 200]);
const SCREWV = cam([-190, 0, 0], 270, [320, 262]);
const SCREW_L = cam([-180, 0, 0], 300, [210, 230]);
const PRESS_L = cam([60, -40, 0], 640, [210, 210]);
const MID_L = cam([-60, -40, 0], 620, [230, 220]);
const FULL_L = cam([60, -40, -30], 820, [220, 215]);
const KEYS = [
  [WHOLE, INJ, CLAMPV, MOULD], // s1 how it works
  [WHOLE, MOULD, SCREWV, CLAMPV], // s2 one shot
  [MOULD_L, MOULD_L, MOULD_L, MOULD], // s3 clamp force
  [SCREWV, SCREWV, SCREWV, SCREWV], // s4 the screw
  [SCREW_L, SCREW_L, SCREW_L], // s5 dosing and residence
  [PRESS_L, MID_L, MID_L, PRESS_L], // s6 choosing a press
  [FULL_L, FULL_L, FULL_L, FULL_L], // s7 drives and energy
  [FULL_L, FULL_L], // s8 special presses
];

// ---------------------------------------------------------------- the film
const MA = 'eng.moulding.machine';
const SC = 'eng.moulding.screw';
const CL = 'eng.moulding.clamp';
const EL_ = 'eng.moulding.electric';
const spec = {
  id: 'eng.moulding.machine',
  title: { nl: 'De spuitgietmachine', en: 'The moulding machine' },
  lessons: [MA, SC, CL, EL_],
  scenes: [
    {
      // v14b: the Basis "how it works" tour, from hopper to mould
      id: 's1', lesson: MA, level: 1, still: 0.5, title: { nl: 'Hoe de pers werkt', en: 'How the press works' },
      beats: [
        { nl: 'Een spuitgietmachine, “de pers”: links de spuitunit, rechts de sluitunit met de matrijs.', en: 'An injection moulding machine, “the press”: the injection unit on the left, the clamp unit on the right.', cues: ['hopper', 'screw', 'heat'] },
        { nl: 'Korrels vallen uit de trechter in de verwarmde cilinder; de schroef smelt ze en duwt ze naar voren.', en: 'Pellets drop from the hopper into the heated barrel; the screw melts them and pushes them forward.', cues: ['hopper', 'screw', 'heat'] },
        { nl: 'De bewegende plaat schuift over vier {t:Geleidekolommen|geleidekolommen} naar de vaste plaat.', en: 'The moving platen slides along four {t:Tie bars|tie bars} towards the fixed platen.', cue: { Geleidekolommen: 'ties' } },
        { nl: 'De smelt stroomt door het {t:Aanspuitpunt|aanspuitpunt} de holte in; de helften sluiten op de {t:Deellijn|deellijn}.', en: 'The melt flows through the {t:Gate|gate} into the cavity; the halves meet at the {t:Parting line|parting line}.', cue: { Aanspuitpunt: 'gate', Deellijn: 'parting' } },
      ],
    },
    {
      id: 's2', lesson: MA, level: 1, still: 0.5, title: { nl: 'Eén shot', en: 'One shot' },
      beats: [
        { nl: 'De matrijs sluit en de schroef schuift als een zuiger naar voren: inspuiten.', en: 'The mould closes and the screw slides forward like a piston: injection.', cues: ['screw', 'gate'] },
        { nl: 'De {t:Nadruk|nadruk} perst kunststof na terwijl het product krimpt, tot het aanspuitpunt bevriest.', en: '{t:Holding pressure|Holding pressure} packs in more plastic while the part shrinks, until the gate freezes.', cue: { Nadruk: 'pack' } },
        { nl: 'Het product koelt; intussen draait de schroef terug en doseert het volgende shot.', en: 'The part cools; meanwhile the screw turns back and doses the next shot.', cues: ['cool', 'screw'] },
        { nl: 'De matrijs gaat open en uitwerppennen duwen het product eruit. En opnieuw.', en: 'The mould opens and ejector pins push the part out. And again.', cues: ['pins'] },
      ],
    },
    {
      id: 's3', lesson: MA, level: 1, still: 0.5, title: { nl: 'Sluitkracht', en: 'Clamp force' },
      beats: [
        { nl: 'De smelt drukt de helften met honderden bar uit elkaar; de {t:Sluitkracht|sluitkracht} houdt ze dicht.', en: 'The melt pushes the halves apart at hundreds of bar; the {t:Clamp force|clamp force} holds them shut.', cue: { Sluitkracht: 'force' }, cues: ['press'] },
        { nl: 'Het {t:Geprojecteerd oppervlak|geprojecteerd oppervlak} is de schaduw van het product: {n:15} × {n:20} cm = {n:300} cm².', en: 'The {t:Projected area|projected area} is the part’s shadow: {n:15} × {n:20} cm = {n:300} cm².', cue: { 'Geprojecteerd oppervlak': 'shadow' } },
        { nl: '{n:300} cm² × {n:0.4} t/cm² = {n:120} t; met {n:2} holtes {n:600} cm², dus {n:240} t.', en: '{n:300} cm² × {n:0.4} t/cm² = {n:120} t; with {n:2} cavities {n:600} cm², so {n:240} t.', cues: ['shadow', 'force'], read: { nl: '{n:240} t + {n:10}–{n:20}% → pers van {n:280} of {n:300} t', en: '{n:240} t + {n:10}–{n:20}% → a {n:280} or {n:300} t press' } },
        { nl: 'Te weinig kracht: de matrijs wijkt op de deellijn en kunststof lekt eruit als braam.', en: 'Too little force: the mould parts at the parting line and plastic leaks out as flash.', cues: ['parting'] },
      ],
    },
    {
      id: 's4', lesson: SC, level: 2, still: 0.5, title: { nl: 'De schroef', en: 'The screw' },
      beats: [
        { nl: 'De schroef is zo’n {n:20} keer zo lang als dik. Achterin de {t:Intrekzone|intrekzone}, met diepe gangen.', en: 'The screw is about {n:20} times as long as it is thick. At the back the {t:Feed zone|feed zone}, with deep flights.', cue: { Intrekzone: 'feed' } },
        { nl: 'In de {t:Compressiezone|compressiezone} wordt het kanaal ondieper: de kunststof wordt geperst en smelt.', en: 'In the {t:Compression zone|compression zone} the channel gets shallower: the plastic is squeezed and melts.', cue: { Compressiezone: 'comp' } },
        { nl: 'De {t:Doseerzone|doseerzone} voorin maakt de smelt gelijk van temperatuur en menging.', en: 'The {t:Metering zone|metering zone} at the front makes the melt even in temperature and mix.', cue: { Doseerzone: 'meter' } },
        { nl: 'De meeste warmte komt van wrijving; de verwarmingsbanden houden de cilinder op temperatuur.', en: 'Most of the heat comes from friction; the heater bands keep the barrel at temperature.', cues: ['heat', 'screw'] },
      ],
    },
    {
      id: 's5', lesson: SC, level: 2, still: 0.5, title: { nl: 'Doseren en verblijftijd', en: 'Dosing and residence time' },
      beats: [
        { nl: 'Smelt vóór de punt duwt de schroef terug: de {t:Doseerslag|doseerslag} is precies één shot.', en: 'Melt in front of the tip pushes the screw back: the {t:Dosing stroke|dosing stroke} is exactly one shot.', cue: { Doseerslag: 'stroke' }, cues: ['shotv'] },
        { nl: '{t:Verblijftijd|Verblijftijd}: {n:600} g ÷ {n:150} g = {n:4} shots; × {n:30} s = {n:120} s heet.', en: '{t:Residence time|Residence time}: {n:600} g ÷ {n:150} g = {n:4} shots; × {n:30} s = {n:120} s hot.', cue: { Verblijftijd: 'res' } },
        { nl: 'Een product van {n:60} g: {n:10} shots, {n:300} s heet. Dat hoort op een kleinere pers.', en: 'A {n:60} g part: {n:10} shots, {n:300} s hot. That belongs on a smaller press.', cues: ['res'] },
      ],
    },
    {
      id: 's6', lesson: CL, level: 3, still: 0.5, title: { nl: 'De juiste pers kiezen', en: 'Choosing the right press' },
      beats: [
        { nl: 'Oppervlak × {t:Holtedruk|holtedruk}, vaak {n:300}–{n:600} bar: {n:380} cm² × {n:0.45} t/cm² = {n:171} t.', en: 'Area × {t:Cavity pressure|cavity pressure}, often {n:300}–{n:600} bar: {n:380} cm² × {n:0.45} t/cm² = {n:171} t.', cue: { Holtedruk: 'press' }, read: { nl: '{n:171} t + {n:15}% ≈ {n:197} t', en: '{n:171} t + {n:15}% ≈ {n:197} t' } },
        { nl: 'Het {t:Shotvolume|shotvolume}: alle producten plus de aanspuiting, hier {n:100} cm³.', en: 'The {t:Shot volume|shot volume}: all parts plus the runner, here {n:100} cm³.', cue: { Shotvolume: 'shotv' } },
        { nl: '{t:Cilinderbenutting|Cilinderbenutting}: {n:100} van {n:120} cm³ = {n:83}%, te veel; van {n:250} cm³ {n:40}%.', en: '{t:Barrel utilisation|Barrel utilisation}: {n:100} of {n:120} cm³ = {n:83}%, too much; of {n:250} cm³ {n:40}%.', cue: { Cilinderbenutting: 'util' }, read: { nl: 'mik op {n:20}–{n:80}%, liefst {n:40}–{n:60}%', en: 'aim for {n:20}–{n:80}%, ideally {n:40}–{n:60}%' } },
        { nl: 'Past de {t:Inbouwhoogte|inbouwhoogte} op de pers, en opent de {t:Openingsslag|openingsslag} ver genoeg?', en: 'Does the {t:Mould height|mould height} fit the press, and does the {t:Opening stroke|opening stroke} open far enough?', cue: { Inbouwhoogte: 'mh', Openingsslag: 'os' } },
      ],
    },
    {
      id: 's7', lesson: EL_, level: 4, still: 0.5, title: { nl: 'Hydraulisch of elektrisch', en: 'Hydraulic or electric' },
      beats: [
        { nl: 'Deze pers is hydraulisch: een pomp duwt olie naar de cilinders. Robuust, en grote kracht is goedkoop.', en: 'This press is hydraulic: a pump drives oil to the cylinders. Robust, and large forces come cheap.', cues: ['hyd'] },
        { nl: 'Een {t:Volelektrische pers|volelektrische pers} heeft per as een {t:Servomotor|servomotor}.', en: 'An {t:All-electric press|all-electric press} has a {t:Servo motor|servo motor} for each axis.', cue: { 'Volelektrische pers': 'elec', Servomotor: 'servo' } },
        { nl: 'Een {t:Hybride machine|hybride machine} combineert beide: elektrische schroef, hydraulische sluiting.', en: 'A {t:Hybrid machine|hybrid machine} combines both: an electric screw, a hydraulic clamp.', cue: { 'Hybride machine': 'hybrid' } },
        { nl: '{t:Specifiek energieverbruik|Specifiek energieverbruik}, in kWh per kg: hier {n:0.6} tegen {n:0.3}.', en: '{t:Specific energy consumption|Specific energy consumption}, in kWh per kg: here {n:0.6} against {n:0.3}.', cue: { 'Specifiek energieverbruik': 'sec' }, read: { nl: '{n:0.3} × {n:180000} kg × € {n:0.20} = € {n:10800} per jaar · {n:40000} / {n:10800} ≈ {n:3.7} jaar', en: '{n:0.3} × {n:180000} kg × € {n:0.20} = € {n:10800} a year · {n:40000} / {n:10800} ≈ {n:3.7} years' } },
      ],
    },
    {
      id: 's8', lesson: EL_, level: 4, still: 0.5, title: { nl: 'Speciale persen', en: 'Special presses' },
      beats: [
        { nl: '{t:Tweecomponenten-spuitgieten|Tweecomponenten-spuitgieten}: hard en zacht in één product.', en: '{t:Two-component moulding|Two-component moulding}: hard and soft in one part.', cue: { 'Tweecomponenten-spuitgieten': 'twok' } },
        { nl: '{t:Omspuiten|Omspuiten}: kunststof om een metalen deel in de matrijs.', en: '{t:Insert moulding|Insert moulding}: plastic around a metal part in the mould.', cue: { Omspuiten: 'insert' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said
// (vierkante centimeter, kubieke centimeter, kilowattuur); numbers the voice
// would read badly (180.000, € 10.800, € 0,20) are written as words. A term is
// named while its cue is lit.
const SAY = [
  [ // s1 how the press works
    { nl: 'Dit is een spuitgietmachine, op de vloer gewoon de pers. Links de spuitunit, die de kunststof smelt. Rechts de sluitunit, die de matrijs dichthoudt.',
      en: 'This is an injection moulding machine, on the shop floor simply the press. On the left the injection unit, which melts the plastic. On the right the clamp unit, which holds the mould shut.' },
    { nl: 'Korrels vallen uit de trechter in de cilinder, een stalen buis met verwarmingsbanden. Daarin draait de schroef: hij smelt de kunststof, mengt hem en duwt hem naar voren.',
      en: 'Pellets drop from the hopper into the barrel, a steel tube with heater bands. Inside it the screw turns: it melts the plastic, mixes it and pushes it forward.' },
    { nl: 'De matrijs heeft twee helften: één op de vaste plaat, en één op de bewegende plaat. Die schuift over vier dikke stalen {t:Geleidekolommen|geleidekolommen}.',
      en: 'The mould has two halves: one on the fixed platen, and one on the moving platen. That platen slides along four thick steel {t:Tie bars|tie bars} at the corners.' },
    { nl: 'In de matrijs zit de holte: de vorm van het product. De smelt stroomt erin door een kleine opening, het {t:Aanspuitpunt|aanspuitpunt}. Waar de twee helften op elkaar sluiten, ligt de {t:Deellijn|deellijn}.',
      en: 'Inside the mould is the cavity, the shape of the part. The melt flows in through a small opening, the {t:Gate|gate}. Where the halves meet lies the {t:Parting line|parting line}.' },
  ],
  [ // s2 one shot
    { nl: 'Eén cyclus heet een shot. De matrijs sluit, en de schroef schuift als een zuiger naar voren. Zo spuit hij de smelt in de holte.',
      en: 'One cycle is called a shot. The mould closes, and the screw slides forward like a piston. That injects the melt into the cavity.' },
    { nl: 'Daarna blijft hij drukken: de {t:Nadruk|nadruk}. Het product krimpt als het afkoelt, dus de schroef perst smelt na, tot het aanspuitpunt bevriest. Dan kan er niets meer bij.',
      en: 'Then it keeps pushing: the {t:Holding pressure|holding pressure}. The part shrinks as it cools, so the screw packs in more melt until the gate freezes. Then nothing more gets in.' },
    { nl: 'Water in het staal koelt het product. Intussen draait de schroef terug en meet het volgende shot af: doseren. Dat kost meestal geen extra tijd.',
      en: 'Water in the steel cools the part. Meanwhile the screw turns back and measures out the next shot: dosing. That usually costs no extra time.' },
    { nl: 'Dan gaat de matrijs open, en uitwerppennen duwen het product eruit. En opnieuw.',
      en: 'Then the mould opens, and ejector pins push the part out. And again.' },
  ],
  [ // s3 clamp force
    { nl: 'Persen worden ingedeeld op {t:Sluitkracht|sluitkracht}, in ton: de kracht die de helften dichthoudt. De smelt drukt ze met honderden bar uit elkaar, en één bar is ongeveer één kilo per vierkante centimeter.',
      en: 'Presses are rated by {t:Clamp force|clamp force}, in tonnes: the force that holds the halves shut. The melt pushes them apart at hundreds of bar, and one bar is about one kilo per square centimetre.' },
    { nl: 'Hoeveel kracht nodig is, hangt af van het {t:Geprojecteerd oppervlak|geprojecteerd oppervlak}: de schaduw van het product vanuit de persrichting. Deze behuizing is {n:15} bij {n:20} centimeter: {n:300} vierkante centimeter.',
      en: 'The force needed depends on the {t:Projected area|projected area}: the part’s shadow, seen from the press. This housing is {n:15} by {n:20} centimetres: {n:300} square centimetres.' },
    { nl: 'Vuistregel: {n:0.3} tot {n:0.6} ton per vierkante centimeter, afhankelijk van de kunststof; voor deze behuizing {n:0.4}. Dat is {n:120} ton. Met {n:2} holtes {n:240} ton, plus {n:10} tot {n:20} procent marge: een pers van {n:280} of {n:300} ton.',
      en: 'Rule of thumb: {n:0.3} to {n:0.6} tonnes per square centimetre, depending on the plastic; for this housing {n:0.4}. That is {n:120} tonnes. With {n:2} cavities {n:240}, plus {n:10} to {n:20} percent margin: a {n:280} or {n:300} tonne press.' },
    { nl: 'Te weinig kracht, en de matrijs gaat een haarbreed open op de deellijn. De kunststof lekt eruit als braam: een dun vliesje.',
      en: 'Too little force, and the mould opens a hair’s breadth at the parting line. Plastic leaks out as flash: a thin film.' },
  ],
  [ // s4 the screw
    { nl: 'Nu de schroef. Hij is ongeveer {n:20} keer zo lang als hij dik is, en heeft drie zones. Achterin ligt de {t:Intrekzone|intrekzone}: diepe gangen trekken de koude korrels naar binnen.',
      en: 'Now the screw. It is about {n:20} times as long as it is thick, with three zones. At the back, the {t:Feed zone|feed zone}: deep flights draw the cold pellets in.' },
    { nl: 'Dan de {t:Compressiezone|compressiezone}. Het kanaal wordt ondieper, dus de kunststof wordt samengeperst en gekneed tot hij smelt.',
      en: 'Then the {t:Compression zone|compression zone}. The channel gets shallower, so the plastic is squeezed and kneaded until it melts.' },
    { nl: 'Voorin zit de {t:Doseerzone|doseerzone}: die maakt de smelt overal even warm en goed gemengd. Op de punt zit een terugslagring, die bij het inspuiten dichtgaat.',
      en: 'At the front, the {t:Metering zone|metering zone} makes the melt evenly hot and well mixed. On the tip sits a check ring, which closes during injection.' },
    { nl: 'De meeste warmte komt van wrijving: de schroef kneedt de kunststof terwijl hij draait. De verwarmingsbanden houden vooral de cilinder op temperatuur.',
      en: 'Most of the heat comes from friction: the screw kneads the plastic as it turns. The heater bands mainly keep the barrel at temperature.' },
  ],
  [ // s5 dosing and residence time
    { nl: 'Bij het doseren duwt de smelt vóór de punt de schroef terug, tot de ingestelde {t:Doseerslag|doseerslag}: precies één shot. Duurt doseren langer dan koelen, dan wacht de pers op de schroef.',
      en: 'While dosing, the melt in front of the tip pushes the screw back, up to the set {t:Dosing stroke|dosing stroke}: exactly one shot. If dosing outlasts cooling, the press waits for the screw.' },
    { nl: 'Hoe lang zit de kunststof heet? Die {t:Verblijftijd|verblijftijd} is grofweg de shots in de cilinder keer de cyclustijd. Hier past {n:600} gram in de cilinder, en een shot is {n:150} gram: {n:4} shots. Bij {n:30} seconden per cyclus is dat {n:120} seconden.',
      en: 'How long does the plastic stay hot? That {t:Residence time|residence time} is roughly the shots in the barrel times the cycle time. Here {n:600} grams fit in the barrel, and a shot is {n:150} grams: {n:4} shots. At {n:30} seconds a cycle, that is {n:120} seconds.' },
    { nl: 'Een product van {n:60} gram op dezelfde pers: {n:10} shots, dus {n:300} seconden heet. Warmtegevoelige kunststof krijgt dan zwarte puntjes. Zo’n product hoort op een kleinere pers.',
      en: 'A {n:60} gram part on the same press: {n:10} shots, so {n:300} seconds hot. Heat-sensitive plastic then gets black specks. That part belongs on a smaller press.' },
  ],
  [ // s6 choosing the right press
    { nl: 'Voor een matrijs op een pers gaat, volgen vier checks. Eén, de sluitkracht: oppervlak keer {t:Holtedruk|holtedruk}, de gemiddelde druk in de holte, meestal {n:300} tot {n:600} bar. Een deksel van {n:380} vierkante centimeter bij {n:0.45} ton vraagt {n:171} ton.',
      en: 'Before a mould goes on a press, four checks. One, clamp force: area times {t:Cavity pressure|cavity pressure}, the average pressure in the cavity, usually {n:300} to {n:600} bar. A lid of {n:380} square centimetres at {n:0.45} tonnes needs {n:171} tonnes.' },
    { nl: 'Twee, het {t:Shotvolume|shotvolume}: alle producten plus de aanspuiting. Hier {n:100} kubieke centimeter.',
      en: 'Two, the {t:Shot volume|shot volume}: all the parts plus the runner. Here {n:100} cubic centimetres.' },
    { nl: 'Deel dat door wat de cilinder maximaal kan: de {t:Cilinderbenutting|cilinderbenutting}. Op een cilinder van {n:120} is dat {n:83} procent, te veel. Op {n:250} is het {n:40} procent, precies goed. Mik op {n:20} tot {n:80} procent.',
      en: 'Divide by the most the barrel can hold: the {t:Barrel utilisation|barrel utilisation}. On a barrel of {n:120} that is {n:83} percent, too much. On {n:250} it is {n:40} percent, just right. Aim for {n:20} to {n:80} percent.' },
    { nl: 'Drie en vier: de matrijs moet passen. Zijn {t:Inbouwhoogte|inbouwhoogte}, de dikte van de gesloten matrijs, moet binnen het bereik van de pers vallen, en de {t:Openingsslag|openingsslag} moet het product eruit laten.',
      en: 'Three and four: the mould must fit. Its {t:Mould height|mould height}, the closed mould’s thickness, must lie within the press’s range, and the {t:Opening stroke|opening stroke} must let the part out.' },
  ],
  [ // s7 hydraulic or electric
    { nl: 'Deze pers is hydraulisch: een pomp perst olie naar de cilinders. Robuust, en grote kracht is goedkoop. Elektrische persen sluiten meestal met een kniehevel, die gestrekt vergrendelt.',
      en: 'This press is hydraulic: a pump drives oil to the cylinders. Robust, and large forces come cheap. Electric presses usually close with a toggle, which locks when stretched out.' },
    { nl: 'Een {t:Volelektrische pers|volelektrische pers} heeft per as een {t:Servomotor|servomotor}. Hij gebruikt alleen stroom als hij beweegt, herhaalt preciezer en lekt geen olie.',
      en: 'An {t:All-electric press|all-electric press} has a {t:Servo motor|servo motor} for each axis. It only uses power when it moves, repeats more precisely and leaks no oil.' },
    { nl: 'Een {t:Hybride machine|hybride machine} combineert beide, meestal een elektrische schroef met een hydraulische sluiting.',
      en: 'A {t:Hybrid machine|hybrid machine} combines both, usually an electric screw with a hydraulic clamp.' },
    { nl: 'Vergelijk energie als {t:Specifiek energieverbruik|specifiek energieverbruik}: kilowattuur per kilo. Studies lopen uiteen; meet het zelf. Stel {n:0.6} tegen {n:0.3}: op honderdtachtigduizend kilo per jaar, bij twintig cent, is dat tienduizend achthonderd euro. Veertigduizend euro meerprijs is dan in {n:3.7} jaar terug.',
      en: 'Compare energy as {t:Specific energy consumption|specific energy consumption}: kilowatt-hours per kilo. Studies differ; measure it. Say {n:0.6} against {n:0.3}: on a hundred and eighty thousand kilos a year, at twenty cents, that saves ten thousand eight hundred euros. Forty thousand euros extra pays back in {n:3.7} years.' },
  ],
  [ // s8 special presses
    { nl: '{t:Tweecomponenten-spuitgieten|Tweecomponenten-spuitgieten} spuit met twee spuitunits een harde en een zachte kunststof tot één product.',
      en: '{t:Two-component moulding|Two-component moulding} uses two injection units to mould a hard and a soft plastic into one part.' },
    { nl: 'Bij {t:Omspuiten|omspuiten} gaat er een metalen deel in de matrijs, en komt de kunststof eromheen.',
      en: 'In {t:Insert moulding|insert moulding} a metal part goes into the mould, and the plastic is moulded around it.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
const C = {
  W, H, TIP0, STROKE, BORE, CYL, NOZ, SPRUE, GATEN, CAV, PL, OPEN, MPL, RPL, CCYL, PISTON, PINS, ZONES, LD,
  AREA, HOUSING, SCREW, CLAMP, UTIL, EL, KEYS,
};
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2.5 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = beatStarts(s, 'nl').map((t) => t / s.dur);
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = st[bi];
      const e = bi + 1 < st.length ? st[bi + 1] : 1;
      b.still = Math.round((a + 0.8 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-svg .fp-tx{fill:var(--anatomy-text)}
.fp-sec{fill:var(--anatomy-top);stroke:none}
.fp-hatch{fill:none;stroke:var(--anatomy-faint);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-cutline{fill:none;stroke:var(--anatomy-mid);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-bore{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-oil{fill:var(--anatomy-shade-1);stroke:none}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-ram{fill:var(--anatomy-face);stroke:none}
.fp-screw{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-band{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-water{fill:var(--anatomy-shade-1)}
.fp-melt{fill:color-mix(in srgb,var(--anatomy-hi) 46%,var(--anatomy-card));stroke:none}
.fp-solid{fill:color-mix(in srgb,var(--anatomy-hi) 80%,var(--anatomy-card));stroke:none}
.fp-pellet{fill:var(--anatomy-mid)}
.fp-zone{fill:none;stroke:none}
.fp-thick{stroke-width:2}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-hatchc{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-shape{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-shape2{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.fp-band2{fill:var(--anatomy-mid);opacity:.22}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.fp-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-zone{fill:var(--fp-accent);fill-opacity:.32;stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-screw,[data-cue][data-on] .fp-steel,[data-cue][data-on] .fp-band{stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .fp-band{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-water,[data-cue][data-on] .fp-oil{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-cutline{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-melt{fill:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-card))}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .fp-shape,[data-cue][data-on] .fp-shape2,[data-cue][data-on] .fp-frame{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-shape{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-hatchc,[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-arrow{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-band2{fill:var(--fp-accent);opacity:.3}
`;

const label = {
  nl: 'Een spuitgietpers in doorsnede: links de spuitunit met de hydraulische inspuitcilinder, de trechter met korrels en de schroef in de verwarmde cilinder; in het midden de matrijs tussen de vaste en de bewegende plaat op de geleidekolommen, met aanspuitpunt, holte, koelkanalen en uitwerppennen; rechts de achterplaat en de hydraulische sluitcilinder. Daarover kaarten met het geprojecteerd oppervlak, de doseerslag, de verblijftijd, de vier checks voor een pers, de aandrijvingen, het energieverbruik en twee speciale persen.',
  en: 'An injection moulding press cut open: on the left the injection unit with the hydraulic injection cylinder, the hopper with pellets and the screw in the heated barrel; in the middle the mould between the fixed and the moving platen on the tie bars, with gate, cavity, cooling channels and ejector pins; on the right the rear platen and the hydraulic clamp cylinder. Over it cards with the projected area, the dosing stroke, the residence time, the four checks for a press, the drives, the energy use and two special presses.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

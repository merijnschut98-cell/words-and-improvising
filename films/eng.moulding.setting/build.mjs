// Dev tool, not shipped. Builds the explainer film "Binnen in de matrijs /
// Inside the mould" for the topic Procesinstelling of Spuitgieten (setup L1,
// process L2, scientific L3, validation L4).
//
//   node films/eng.moulding.setting/build.mjs            build the page
//   node films/eng.moulding.setting/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.setting.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.3.
//
// The drawing: an inline injection unit and a closed two-plate mould between
// the platens, all cut open along the screw axis (the plane y = 0), so the
// screw, the check ring, the melt in front of the screw and the melt inside the
// cavity are seen in section. The settings console of the figure
// eng.moulding.window becomes the screen panels (HUD) beside the press.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, allLessons, resolveFilm } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// setup: the setting sheet of a PP lid
const CARD = { Tm: 230, Tw: 40, v: 80, stroke: 60, sw: 12, ph: 400, th: 4, tc: 10, open: 4 };
const fillTime = (CARD.stroke - CARD.sw) / CARD.v;
assert(CARD.stroke - CARD.sw === 48, '60 − 12 = 48 mm on speed');
assert(near(fillTime, 0.6), 'fill 48 / 80 = 0,6 s');
assert(near(fillTime + CARD.th + CARD.tc + CARD.open, 18.6), 'cycle 0,6 + 4 + 10 + 4 = 18,6 s');
assert(near((50 - 10) / 40, 1), 'setup recall: 1,0 s');
// process: switch over at 95–98 % full; a leaking check ring lets the cushion wander 2–8 mm
const FULL_AT_SWITCH = 0.97;
assert(FULL_AT_SWITCH >= 0.95 && FULL_AT_SWITCH <= 0.98, 'switchover at 95–98 % full');
const CUSHION = { nominal: 5, leak: [2, 8, 4] };
assert(CUSHION.leak.every((c) => c >= 2 && c <= 8), 'cushion stays in 2–8 mm');
// scientific: relative viscosity = peak hydraulic pressure × ratio × fill time
const RATIO = 10;
const VISC = [[40, 80, 1.6], [80, 110, 0.8], [120, 150, 0.55]].map(([v, p, t]) => [v, Math.round(p * RATIO * t)]);
assert(VISC.map(([, e]) => e).join() === '1280,880,825', `viscosity ${VISC}`);
assert(Math.round(((1280 - 880) / 1280) * 100) === 31 && Math.round(((880 - 825) / 880) * 100) === 6, 'drops 31 % then 6 %');
const PRESS = { plastic: 150 * RATIO, max: 2000, rule: 0.8 };
assert(PRESS.plastic === 1500 && near(PRESS.plastic / PRESS.max, 0.75) && PRESS.plastic / PRESS.max < PRESS.rule, '1.500 of 2.000 bar = 75 % < 80 %');
// the pressure drop by section: nozzle, sprue, gate, part. The lesson gives only
// the total (1.500 bar); this split is an example, so the chart says so. The gate
// and the thin-walled part take most of it, the nozzle and the short sprue little.
const DROP = [150, 250, 400, 700];
assert(DROP.reduce((a, b) => a + b, 0) === PRESS.plastic, 'the sections add up to 1.500 bar');
// gate freeze study: the lesson's recall weights at 1–5 s hold time
const GATE = [[1, 20.1], [2, 20.35], [3, 20.48], [4, 20.49], [5, 20.49]];
// validation: PQ on part weight
const SPC = { n: 125, mean: 4.82, sd: 0.006, oqLo: 4.78, oqHi: 4.86 };
assert(near(SPC.mean - 3 * SPC.sd, 4.802) && near(SPC.mean + 3 * SPC.sd, 4.838), 'control limits 4,802–4,838 g');
assert(near(Math.round(((SPC.oqHi - SPC.mean) / (3 * SPC.sd)) * 10) / 10, 2.2), 'Cpk 2,2');
// shots on the control chart: a fixed seeded sequence inside ± 2.5 σ
const NOISE = (() => {
  let s = 20261107;
  const r = () => ((s = (s * 1103515245 + 12345) % 2147483648) + 0.5) / 2147483648;
  const out = [];
  while (out.length < 40) {
    const z = Math.sqrt(-2 * Math.log(r())) * Math.cos(2 * Math.PI * r());
    if (Math.abs(z) < 2.5) out.push(Math.round(z * 100) / 100);
  }
  return out;
})();

// ---------------------------------------------------------------- the world
// x along the screw toward the mould, y toward the viewer, z up; the screw axis
// is z = 0. Everything is cut open at y = 0, so the parts are drawn from y < 0
// and their cut faces lie in the plane y = 0 (the section).
const W = 640;
const H = 400;
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
// screw: at position s (mm of stroke left), its tip point sits at TIP0 − s
const TIP0 = -64;
const BORE = { x0: -280, x1: -60, r: 16 };
const BARREL_R = 34;
const CYL = { x0: -398, x1: -300, r: 40, bore: 34 };
const NOZ = { x0: -60, x1: -14, r: 3.5 };
const SPRUE = { x0: -14, x1: 45, r0: 3, r1: 4.6 };
const GATEN = { x0: 45, x1: 51, r: 1.8 };
const CAV = { x0: 51, x1: 63, h: 60, skirt: 22, t: 10 }; // lid top wall x0..x1, skirt into the core side
const PL = 63; // parting plane
const DUR = [15, 19, 14, 19, 22.8, 17, 26.8, 16.4];

const FIT = [
  ...k.boxCorners({ x: -490, y: -180, w: 790, d: 180 }, -270, 196),
  [-300, -60, 150], [-440, 0, 60],
];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 60, elevation: 28 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0.8, ...plan }, z0, z1 - z0, P, 4, bevel), style);
const cut = (x0, x1, d, z0, z1, style = {}, bevel = 0.6) => box({ x: x0, y: -d, w: x1 - x0, d }, z0, z1, style, bevel);
const FR = G.frameOf([0, 0, 0], X, Y, Z);
const semi = (r, n = 28) => Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI / 2 + (Math.PI * i) / n; return [r * Math.cos(a), r * Math.sin(a)]; });
const hcyl = (x0, x1, r, style = {}, z = 0) => S(G.prismOf(G.frameOf([0, 0, z], X, Y, Z), semi(r), x0, x1, P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
// the section plane
const sp = ([x, z]) => at([x, 0, z]);
const secPath = (pts) => k.pathOf(pts.map(sp), true);
const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const sec = (pts, cls = 'fp-sec') => `<path class="${cls}" d="${secPath(pts)}"/>`;
const secLine = (pts, cls = 'fp-cutline') => `<path class="${cls}" d="${k.pathOf(pts.map(sp))}"/>`;
// 45° hatch over a rectangle of the section, clipped analytically
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

// ---------------------------------------------------------------- static parts, back to front
const bed = [
  cut(-490, 300, 180, -270, -200, { tone: 'lo' }),
  L(k.sideSeam({ x: -490, y: -180, w: 790, d: 180, r: 0.8 }, -212, P, 4), { tone: 'faint' }),
  // rails for the injection carriage and the clamp, with screws
  cut(-480, -280, 150, -200, -194, { tone: 'lo', crease: 'lo' }, 0.3),
  dots([-470, -440, -410, -380, -350, -320, -290].map((x) => [x, -75, -194]), 0.5, 'lo'),
].join('');

const tieBars = [165, -165].map((z) => [
  S(G.solidOf([[0, 12], [320, 12]], G.frameOf([-40, -135, z], X, Y, Z), P), { tone: 'mid', crease: 'lo' }),
  S(G.solidOf([[0, 20], [12, 20]], G.frameOf([280, -135, z], X, Y, Z), P), { tone: 'mid', crease: 'lo' }),
].join('')).join('');

// a bench scale on the bed between the platens, for the last scene
const scale = (() => {
  const base = { x: 34, y: -92, w: 84, d: 74, r: 3 };
  return [
    box(base, -200, -188, { tone: 'mid' }, 0.8),
    L(k.sideSeam(base, -192, P, 4), { tone: 'faint' }),
    box({ x: 40, y: -86, w: 72, d: 62, r: 2 }, -188, -184, { crease: 'lo' }, 0.4),
    k.dotsSvg(k.corners({ x: 40, y: -86, w: 72, d: 62 }, 3).map(([x, y]) => at([x, y, -184])), { size: 0.5 }),
  ].join('');
})();
const lid = [
  S(G.solidOf([[0, 0], [0, 26], [6, 26], [6, 0]], G.frameOf([76, -55, -184], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  L(G.arcOf(G.frameOf([76, -55, -184], Z, X, Y), 6, 22, P), { tone: 'lo' }),
].join('');

const carriage = [
  cut(-480, -290, 120, -194, -62, { tone: 'lo' }),
  L(k.sideSeam({ x: -480, y: -120, w: 190, d: 120, r: 0.8 }, -70, P, 4), { tone: 'faint' }),
  // saddles under the cylinder and the barrel
  cut(-380, -330, 70, -62, -38),
  cut(-275, -255, 60, -194, -30),
  L(k.sideSeam({ x: -275, y: -60, w: 20, d: 60, r: 0.8 }, -40, P, 4), { tone: 'faint' }),
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
  // tie rods of the cylinder on its top, with nuts
  S(G.solidOf([[0, 3], [CYL.x1 - CYL.x0 + 8, 3]], G.frameOf([CYL.x0 - 4, -14, CYL.r + 4], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
  // the oil port on top
  cut(-332, -318, 18, CYL.r - 2, CYL.r + 10, { crease: 'lo' }, 0.3),
].join('');
const cylSec = [
  // section of the cylinder: walls, caps, the bore with oil
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
  // barrel head and nozzle
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
// the feed throat and the hopper, cut too, with pellets
const hopperPoly = [[-292, 52], [-250, 52], [-226, 140], [-316, 140]];
const hopper = [
  cut(-296, -246, 40, 30, 52),
  S(G.prismOf(G.frameOf([0, 0, 0], Y, X, Z), hopperPoly, -56, 0, P), { tone: 'mid' }),
].join('');
const pellets = (() => {
  const pts = [];
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 160; i++) {
    const z = 56 + r() * 70;
    const half = 21 + ((z - 52) / 88) * 24;
    const cx = -271 + ((z - 52) / 88) * 0;
    pts.push([cx + (r() * 2 - 1) * (half - 5), z]);
  }
  for (let i = 0; i < 26; i++) pts.push([-282 + r() * 24, 18 + r() * 34]);
  return k.dotsSvg(pts.map(sp), { size: 1.25, tone: 'mid' });
})();
const hopperSec = [
  sec([[-292, 52], [-250, 52], [-226, 140], [-316, 140]], 'fp-bore'),
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
  // barrel head and nozzle in section, with the melt channel
  steelSec(BORE.x1, BORE.x1 + 8, -24, 24, 8),
  steelSec(BORE.x1 + 8, -32, -14, 14, 8),
  steelSec(-32, NOZ.x1, -9, 9, 7),
  sec([[BORE.x1, -BORE.r], [BORE.x1 + 8, -NOZ.r], [BORE.x1 + 8, NOZ.r], [BORE.x1, BORE.r]], 'fp-melt'),
  sec(rect(BORE.x1 + 8, NOZ.x1, -NOZ.r, NOZ.r), 'fp-melt'),
  // a thermocouple well in the barrel head
  sec(rect(BORE.x1 + 2, BORE.x1 + 5, 16, 24), 'fp-bore'),
].join('');

// the clamp: platens and the mould between them
const fixedPlaten = [cut(-40, -14, 170, -200, 196), L(k.sideSeam({ x: -40, y: -170, w: 26, d: 170, r: 0.8 }, 186, P, 4), { tone: 'faint' })].join('');
const fixedPlatenSec = [steelSec(-40, -14, 18, 196, 12), steelSec(-40, -14, -200, -18, 12), sec(rect(-40, -14, -18, 18), 'fp-bore')].join('');
const nozzleInPlaten = [steelSec(-40, NOZ.x1, -9, 9, 7), sec(rect(-40, NOZ.x1, -NOZ.r, NOZ.r), 'fp-melt')].join('');
const mouldTop = (x0, x1, d) => dots([[x0 + 5, -8, 0], [x1 - 5, -8, 0], [x0 + 5, -d + 8, 0], [x1 - 5, -d + 8, 0]].map(([x, y]) => [x, y, 0]), 0.55);
const fixedHalf = [
  cut(-14, 4, 112, -150, 150),
  cut(4, PL, 100, -130, 130),
  // the eye bolt, the water nipples and the plate screws on top
  S(G.solidOf([[0, 6], [6, 6]], G.frameOf([34, -50, 130], Z, X, Y), P), { tone: 'mid', crease: 'lo' }),
  L(G.circleOf(G.frameOf([34, -50, 142], Y, X, Z), 0, 7, P), { tone: 'mid' }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([20, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([48, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  k.dotsSvg([[-9, -10], [-9, -102], [0, -10], [0, -102]].map(([x, y]) => at([x, y, 150])), { size: 0.55 }),
  k.dotsSvg([[10, -8], [57, -8], [10, -92], [57, -92]].map(([x, y]) => at([x, y, 130])), { size: 0.55 }),
].join('');
void mouldTop;
const COOL = [[30, 40], [30, -40], [30, 100], [30, -100], [96, 40], [96, -40], [96, 100], [96, -100]];
const ring = (cx, cz, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cz + r * Math.sin((i / n) * Math.PI * 2)]);
// the cavity of a lid: the top wall in the fixed half, the skirt in the moving half
const cavTop = rect(CAV.x0, CAV.x1, -CAV.h, CAV.h);
const skirtUp = rect(PL, PL + CAV.skirt, CAV.h - CAV.t, CAV.h);
const skirtDn = rect(PL, PL + CAV.skirt, -CAV.h, -CAV.h + CAV.t);
const sprueAt = (x) => SPRUE.r0 + ((x - SPRUE.x0) / (SPRUE.x1 - SPRUE.x0)) * (SPRUE.r1 - SPRUE.r0);
const spruePoly = [[SPRUE.x0, -SPRUE.r0], [SPRUE.x1, -SPRUE.r1], [SPRUE.x1, SPRUE.r1], [SPRUE.x0, SPRUE.r0]];
const gatePoly = [[SPRUE.x1, -SPRUE.r1], [GATEN.x0 + 2, -GATEN.r], [GATEN.x1, -GATEN.r], [GATEN.x1, GATEN.r], [GATEN.x0 + 2, GATEN.r], [SPRUE.x1, SPRUE.r1]];
const fixedSec = [
  steelSec(-14, 4, -150, 150, 12),
  steelSec(4, PL, -130, 130, 12),
  // the sprue bush
  sec(rect(-14, 30, -11, 11), 'fp-steel'),
  `<path class="fp-cutline" d="${secPath(rect(-14, 30, -11, 11))}"/>`,
  sec(spruePoly, 'fp-bore'),
  sec(gatePoly, 'fp-bore'),
  sec(cavTop, 'fp-bore'),
].join('');
const movingHalf = [
  cut(PL, 125, 100, -130, 130),
  cut(125, 165, 100, 95, 130),
  cut(125, 165, 100, -130, -95),
  cut(135, 150, 90, -90, 90, { tone: 'hi' }),
  cut(165, 185, 112, -150, 150),
  k.dotsSvg([[70, -8], [118, -8], [70, -92], [118, -92]].map(([x, y]) => at([x, y, 130])), { size: 0.55 }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([84, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  S(G.solidOf([[0, 3], [12, 3], [12, 4.2], [16, 4.2]], G.frameOf([108, -70, 130], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
].join('');
const PINS = [-40, -14, 14, 40];
const movingSec = [
  steelSec(PL, 125, -130, 130, 12),
  steelSec(125, 165, 95, 130, 12),
  steelSec(125, 165, -130, -95, 12),
  sec(rect(125, 165, -95, 95), 'fp-bore'),
  steelSec(135, 150, -90, 90, 8),
  steelSec(165, 185, -150, 150, 12),
  sec(skirtUp, 'fp-bore'),
  sec(skirtDn, 'fp-bore'),
  // ejector pins from the ejector plate to the core face
  ...PINS.map((z) => sec(rect(PL, 135, z - 2.2, z + 2.2), 'fp-steel') + `<path class="fp-cutline" d="${k.pathOf([sp([PL, z - 2.2]), sp([135, z - 2.2])])}${k.pathOf([sp([PL, z + 2.2]), sp([135, z + 2.2])])}"/>`),
].join('');
const coolSec = COOL.map(([x, z]) => `<path class="fp-water" d="${secPath(ring(x, z, 5.5))}"/><path class="fp-cutline" d="${secPath(ring(x, z, 5.5))}"/>`).join('');
const gateMark = `<path class="fp-mark" d="${secPath([[GATEN.x0 - 2, -6], [GATEN.x1 + 2, -6], [GATEN.x1 + 2, 6], [GATEN.x0 - 2, 6]])}"/>`;
const movingPlaten = [cut(185, 215, 170, -200, 196), L(k.sideSeam({ x: 185, y: -170, w: 30, d: 170, r: 0.8 }, 186, P, 4), { tone: 'faint' })].join('');
const movingPlatenSec = steelSec(185, 215, -200, 196, 12);

// ---------------------------------------------------------------- clip paths in the section
const defs = `<defs>
<clipPath id="fm-bore"><path d="${secPath(rect(BORE.x0, BORE.x1 + 0.2, -BORE.r, BORE.r))}"/></clipPath>
<clipPath id="fm-lens"><circle data-k="lensClip" cx="0" cy="0" r="1"/></clipPath>
<clipPath id="fm-cyl"><path d="${secPath(rect(CYL.x0 + 6, CYL.x1 + 4, -CYL.bore, CYL.bore))}"/></clipPath>
</defs>`;

// ---------------------------------------------------------------- the drawing
const world = [
  g('bed', bed),
  g('ties', tieBars),
  g('scale', scale, ' data-cue="weight"'),
  g('lid', lid),
  g('carriage', carriage),
  g('motor', motor),
  g('cyl', cylinder),
  g('cylSec', cylSec),
  `<g clip-path="url(#fm-cyl)">${g('piston', '')}</g>`,
  g('ratioMark', '', ' data-cue="ratio"'),
  g('shank', shank),
  g('barrel', barrel),
  g('barrelSec', barrelSec),
  g('heat', heaters + heatSec, ' data-cue="heat"'),
  g('hopper', hopper + hopperSec),
  `<g clip-path="url(#fm-bore)">${g('screw', '')}</g>`,
  g('ring', '', ' data-cue="ring"'),
  g('cushion', '', ' data-cue="cushion"'),
  g('fplaten', fixedPlaten + fixedPlatenSec + nozzleInPlaten),
  g('fixed', fixedHalf + fixedSec),
  g('moving', movingHalf + movingSec),
  g('cool', coolSec, ' data-cue="cool"'),
  g('fill', ''),
  g('front', '', ' data-cue="front"'),
  g('gate', gateMark, ' data-cue="gate"'),
  g('mplaten', movingPlaten + movingPlatenSec),
  g('drop', '', ' data-cue="drop"'),
  g('speed', '', ' data-cue="speed"'),
  g('back', '', ' data-cue="back"'),
].join('');

// ---------------------------------------------------------------- HUD (stage space, not under the camera)
const hud = [
  g('sheet', '', ' data-cue="sheet"'),
  g('ruler', `${g('rulerBody', '')}<g data-cue="switch">${g('rulerSw', '')}</g>${g('rulerMk', '')}`),
  g('clock', ''),
  g('win', '', ' data-cue="window"'),
  g('dec', '', ' data-cue="decouple"'),
  g('ratioHud', '', ' data-cue="ratio"'),
  g('visc', '', ' data-cue="visc"'),
  g('bars', `${g('barsBody', '')}<g data-cue="limit">${g('barsLimit', '')}</g>`, ' data-cue="drop"'),
  g('gfs', '', ' data-cue="gfs"'),
  g('cards', `${g('cardsBody', '')}<g data-cue="iq">${g('cardsIq', '')}</g>`, ' data-cue="cards"'),
  g('spc', '', ' data-cue="weight"'),
  g('reval', '', ' data-cue="reval"'),
].join('');
// the lens: a round close-up of a small part (gate, check ring) at the moment it
// is named; it shows the same world again through <use>, so cues light up in it too
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${defs}${g('world', `<g id="fm-w">${world}</g>`)}${g('hud', hud)}${g('lens', '')}</svg>`;

// ---------------------------------------------------------------- the film
const spec = {
  id: 'eng.moulding.setting',
  title: { nl: 'Binnen in de matrijs', en: 'Inside the mould' },
  lessons: ['eng.moulding.setup', 'eng.moulding.process', 'eng.moulding.scientific', 'eng.moulding.validation'],
  scenes: [
    {
      id: 's1', lesson: 'eng.moulding.setup', level: 1, dur: DUR[0], still: 0.6, title: { nl: 'De instelkaart', en: 'The setting sheet' },
      beats: [
        { nl: 'De {t:Instelkaart|instelkaart} legt de goedgekeurde instellingen vast voor één matrijs op één pers.', en: 'The {t:Setting sheet|setting sheet} holds the approved settings for one mould on one press.', cue: { Instelkaart: 'sheet' } },
        { nl: 'Verwarmingszones op de cilinder houden de {t:Smelttemperatuur|smelttemperatuur} op {n:230} °C; de matrijs is {n:40} °C.', en: 'Heater zones on the barrel hold the {t:Melt temperature|melt temperature} at {n:230} °C; the mould is at {n:40} °C.', cue: { Smelttemperatuur: 'heat' } },
      ],
    },
    {
      id: 's2', lesson: 'eng.moulding.setup', level: 1, dur: DUR[1], still: 0.62, title: { nl: 'Inspuiten', en: 'Injection' },
      beats: [
        { nl: 'De schroef schiet naar voren met de {t:Inspuitsnelheid|inspuitsnelheid}: hier {n:80} mm/s.', en: 'The screw shoots forward at the {t:Injection speed|injection speed}: here {n:80} mm/s.', cue: { Inspuitsnelheid: 'speed' } },
        { nl: 'Het vloeifront loopt vanaf het aanspuitpunt door de holte; tegen het koelere staal stolt een huidje.', en: 'The flow front runs from the gate through the cavity; against the cooler steel a skin freezes.', cues: ['front'] },
        { nl: 'Van {n:60} naar {n:12} mm: {n:48} mm op snelheid, {n:0.6} s vullen.', en: 'From {n:60} to {n:12} mm: {n:48} mm on speed, {n:0.6} s of filling.', cues: ['speed'], read: { nl: '({n:60} − {n:12}) / {n:80} = {n:0.6} s', en: '({n:60} − {n:12}) / {n:80} = {n:0.6} s' } },
      ],
    },
    {
      id: 's3', lesson: 'eng.moulding.setup', level: 1, dur: DUR[2], still: 0.5, title: { nl: 'Omschakelen', en: 'Switchover' },
      beats: [
        { nl: 'Op {n:12} mm ligt het {t:Omschakelpunt|omschakelpunt}: de machine gaat van snelheid over op druk.', en: 'At {n:12} mm lies the {t:Switchover point|switchover point}: the machine changes from speed to pressure.', cue: { Omschakelpunt: 'switch' } },
        { nl: 'De holte is dan zo’n {n:95} tot {n:98}% vol; te laat omschakelen geeft braam.', en: 'The cavity is then about {n:95} to {n:98}% full; switching too late gives flash.', cues: ['front'] },
      ],
    },
    {
      id: 's4', lesson: 'eng.moulding.setup', level: 1, dur: DUR[3], still: 0.5, title: { nl: 'Nadruk en koelen', en: 'Holding and cooling' },
      beats: [
        { nl: 'Nu perst de nadruk er kunststof bij, terwijl het product krimpt.', en: 'Now the holding pressure packs in more plastic while the part shrinks.', cues: ['front'], read: { nl: 'nadruk {n:400} bar · {n:4} s', en: 'holding {n:400} bar · {n:4} s' } },
        { nl: 'De {t:Nadruktijd|nadruktijd} loopt tot het aanspuitpunt bevriest: daarna kan er niets meer bij.', en: 'The {t:Holding time|holding time} lasts until the gate freezes: after that nothing more can get in.', cue: { Nadruktijd: 'gate' } },
        { nl: 'Dan {n:10} s koelen, en openen en uitwerpen: een cyclus van {n:18.6} s.', en: 'Then {n:10} s of cooling, then opening and ejecting: a cycle of {n:18.6} s.', cues: ['cool'], read: { nl: '{n:0.6} + {n:4} + {n:10} + {n:4} = {n:18.6} s', en: '{n:0.6} + {n:4} + {n:10} + {n:4} = {n:18.6} s' } },
      ],
    },
    {
      id: 's5', lesson: 'eng.moulding.process', level: 2, dur: DUR[4], still: 0.25, title: { nl: 'Doseren en het restkussen', en: 'Dosing and the cushion' },
      beats: [
        { nl: 'Tijdens het koelen draait de schroef en schuift terug, tegen de {t:Stuwdruk|stuwdruk} in: dat mengt de smelt.', en: 'During cooling the screw turns and moves back against the {t:Back pressure|back pressure}: that mixes the melt.', cue: { Stuwdruk: 'back' } },
        { nl: 'Op de schroefpunt zit de {t:Terugslagring|terugslagring}, een ventielringetje: bij het inspuiten sluit hij.', en: 'On the screw tip sits the {t:Check ring|check ring}, a valve ring: during injection it closes.', cue: { Terugslagring: 'ring' } },
        { nl: 'Vóór de schroef blijft een {t:Restkussen|restkussen}. Lekt de ring, dan schommelt dat van {n:2} tot {n:8} mm.', en: 'In front of the screw a {t:Cushion|cushion} remains. If the ring leaks, it wanders from {n:2} to {n:8} mm.', cue: { Restkussen: 'cushion' } },
      ],
    },
    {
      id: 's6', lesson: 'eng.moulding.process', level: 2, dur: DUR[5], still: 0.8, title: { nl: 'Het procesvenster', en: 'The process window' },
      beats: [
        { nl: 'Het {t:Procesvenster|procesvenster} is het gebied waarin elk product goed is. Zit in het midden, niet op de rand.', en: 'The {t:Process window|process window} is the area where every part is good. Sit in the middle, not on the edge.', cue: { Procesvenster: 'window' } },
        { nl: '{t:Scientific moulding|Scientific moulding} vult zo’n {n:95} tot {n:98}% op snelheid en perst de rest na op druk.', en: '{t:Scientific moulding|Scientific moulding} fills about {n:95} to {n:98}% on speed and packs the rest on pressure.', cue: { 'Scientific moulding': 'decouple' } },
      ],
    },
    {
      id: 's7', lesson: 'eng.moulding.scientific', level: 3, dur: DUR[6], still: 0.93, title: { nl: 'Drie studies', en: 'Three studies' },
      beats: [
        { nl: 'De {t:Viscositeitscurve|viscositeitscurve} daalt steil en loopt dan vlak: kies daar de snelheid.', en: 'The {t:Viscosity curve|viscosity curve} falls steeply, then runs flat: choose the speed there.', cue: { Viscositeitscurve: 'visc' }, read: { nl: '{n:1280} · {n:880} · {n:825} bar·s', en: '{n:1280} · {n:880} · {n:825} bar·s' } },
        { nl: 'De {t:Drukverhouding|drukverhouding} rekent oliedruk om naar kunststofdruk: vaak zo’n {n:10}.', en: 'The {t:Intensification ratio|intensification ratio} converts oil pressure to plastic pressure: often about {n:10}.', cue: { Drukverhouding: 'ratio' } },
        { nl: 'Een {t:Drukvalstudie|drukvalstudie} meet de druk per deel. {n:75}% is onder de {n:80}%-regel: niet {t:Drukbegrensd|drukbegrensd}.', en: 'A {t:Pressure drop study|pressure drop study} measures the pressure per section. {n:75}% is under the {n:80}% rule: not {t:Pressure-limited|pressure-limited}.', cue: { Drukvalstudie: 'drop', Drukbegrensd: 'limit' }, read: { nl: '{n:1500} / {n:2000} bar = {n:75}%', en: '{n:1500} / {n:2000} bar = {n:75}%' } },
        { nl: 'De {t:Gate-freeze-studie|gate-freeze-studie} weegt bij langere nadruktijd; loopt het gewicht vlak, dan is het aanspuitpunt dicht.', en: 'The {t:Gate freeze study|gate freeze study} weighs at longer holding times; once the weight levels off, the gate is shut.', cue: { 'Gate-freeze-studie': 'gfs' } },
      ],
    },
    {
      id: 's8', lesson: 'eng.moulding.validation', level: 4, dur: DUR[7], still: 0.9, title: { nl: 'Valideren en bewaken', en: 'Validating and monitoring' },
      beats: [
        { nl: '{t:Validatie|Validatie} bewijst het venster in drie stappen, {t:IQ/OQ/PQ|IQ/OQ/PQ}: installatie, randen, productie.', en: '{t:Validation|Validation} proves the window in three steps, {t:IQ/OQ/PQ|IQ/OQ/PQ}: installation, edges, production.', cue: { Validatie: 'cards', 'IQ/OQ/PQ': 'iq' } },
        { nl: 'Daarna bewaakt het {t:Productgewicht|productgewicht} het proces, binnen {n:4.802} tot {n:4.838} g.', en: 'After that the {t:Part weight|part weight} watches the process, within {n:4.802} to {n:4.838} g.', cue: { Productgewicht: 'weight' }, read: { nl: '{n:125} shots · {n:4.820} g · σ {n:0.006}', en: '{n:125} shots · {n:4.820} g · σ {n:0.006}' } },
        { nl: 'Verhuist de matrijs naar een andere pers, dan volgt {t:Hervalidatie|hervalidatie}.', en: 'If the mould moves to another press, {t:Revalidation|revalidation} follows.', cue: { Hervalidatie: 'reval' } },
      ],
    },
  ],
  skip: [],
};

// beat starts as fractions of each scene (Dutch word shares), so the stage can
// time its moves to the caption that names them
const lessons = await allLessons();
const pre = resolveFilm(spec, lessons);
const BEATS = pre.scenes.map((s) => beatStarts(s, 'nl').map((t) => Math.round((t / s.dur) * 1000) / 1000));

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
// the camera that puts world point p at stage point (sx, sy), w wide
const camAt = (p, w, sx, sy) => { const [x, y] = at(p); const r = (v) => Math.round(v * 10) / 10; return [r(x + ((W / 2 - sx) * w) / W), r(y + ((H / 2 - sy) * w) / W), w]; };
const CAM = [
  // the whole press left of the setting sheet, then in on the heater bands as the melt temperature is named
  { from: camAt([40, 0, -30], 780, 260, 200), to: camAt([-150, 0, 20], 250, 205, 215), a: BEATS[0][1] - 0.03, b: BEATS[0][1] + 0.05 },
  { from: cam([-90, 0, 0], 300), to: cam([30, 0, 0], 210), a: 0.08, b: 0.5 },
  { from: cam([30, 0, 6], 200), to: cam([36, 0, 0], 190) },
  { from: cam([40, 0, 0], 180), to: cam([30, 0, 0], 240), a: 0.6, b: 0.8 },
  // dosing seen whole, then in close on the screw tip as the check ring is named
  { from: cam([-100, 0, 2], 160), to: camAt([-104, 0, 0], 110, 290, 195), a: BEATS[4][1] - 0.03, b: BEATS[4][1] + 0.03 },
  { from: cam([110, 0, -20], 540), to: cam([100, 0, -20], 520) },
  { from: cam([-150, 0, -20], 560), to: cam([90, 0, 0], 300), a: BEATS[6][2] - 0.04, b: BEATS[6][2] + 0.06 },
  { from: cam([110, 0, -60], 480), to: cam([100, 0, -60], 460) },
];

// ---------------------------------------------------------------- page script and styles
const C = {
  dur: DUR, TIP0, BORE, BARREL_R, CYL, NOZ, SPRUE, GATEN, CAV, PL, CARD, FULL: FULL_AT_SWITCH, CUSHION,
  VISC, PRESS, DROP, GATE, SPC, NOISE, BEATS, PINS,
};
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.fp-lens-ring{fill:none;stroke:var(--fp-accent);stroke-width:2;vector-effect:non-scaling-stroke}
.fp-lens-bg{fill:var(--anatomy-card)}
.fp-lens-lead{fill:none;stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-num{font-family:var(--anatomy-mono);font-weight:600}
.fp-sec{fill:var(--anatomy-top);stroke:none}
.fp-hatch{fill:none;stroke:var(--anatomy-faint);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-cutline{fill:none;stroke:var(--anatomy-mid);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-bore{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-oil{fill:var(--anatomy-shade-1);stroke:none}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-screw{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-band{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-water{fill:var(--anatomy-shade-1)}
.fp-melt{fill:color-mix(in srgb,var(--anatomy-hi) 46%,var(--anatomy-card));stroke:none}
/* frozen plastic is darker than the melt, in both themes */
.fp-solid{fill:color-mix(in srgb,var(--anatomy-hi) 80%,var(--anatomy-card));stroke:none}
.fp-skin{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;vector-effect:non-scaling-stroke}
.fp-pellet{fill:var(--anatomy-mid)}
.fp-hud-bg{fill:var(--anatomy-card);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.fp-good{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-good{fill:var(--anatomy-lit-shade);stroke:var(--fp-accent)}
.fp-bar{fill:var(--anatomy-mid)}
.fp-bar2{fill:var(--anatomy-lo)}
[data-cue][data-on] .fp-bar{fill:var(--fp-accent)}
[data-cue][data-on] .fp-screw,[data-cue][data-on] .fp-steel,[data-cue][data-on] .fp-band{stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .fp-band{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-water{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-cutline{stroke:var(--fp-accent)}
.fp-dot{fill:var(--anatomy-hi)}
[data-cue][data-on] .fp-dot{fill:var(--fp-accent)}
.fp-faintline{fill:none;stroke:var(--anatomy-lo);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-dash{stroke-dasharray:5 4}
`;

const label = {
  nl: 'Een spuitgietpers in doorsnede: de hydraulische cilinder, de schroef in de verwarmde cilinder met terugslagring, de spuitmond, en een gesloten matrijs tussen de platen met aanspuitpunt, holte, koelkanalen en uitwerppennen. Ernaast een scherm met de instelkaart en de grafieken van de studies, en een weegschaal onder de matrijs.',
  en: 'An injection moulding press cut open: the hydraulic cylinder, the screw in the heated barrel with its check ring, the nozzle, and a closed mould between the platens with gate, cavity, cooling channels and ejector pins. Beside it a screen with the setting sheet and the charts of the studies, and a scale under the mould.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

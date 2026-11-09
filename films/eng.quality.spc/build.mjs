// Dev tool, not shipped. Builds the explainer film "Een regelkaart slaat alarm /
// A control chart raises the alarm" for the SPC lesson of Kwaliteit: de basis
// (eng.quality.spc, level 2 of the topic SPC en regelkaarten) and two lessons
// of Meten en SPC verdiept: eng.spc.tampering and eng.spc.charts (both level 2).
//
//   node films/eng.quality.spc/build.mjs            build the page
//   node films/eng.quality.spc/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.quality.spc.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// Four places on one floor, left to right. A CNC lathe that turns shafts Ø20:
// a base cabinet with a chip drawer, an enclosure with a window (the chuck,
// the shaft, the turret with its insert inside), a control panel and a signal
// tower. A measuring bench: a micrometer on its stand, a tray for the five
// shafts of the hourly subgroup, a box of inserts, and a red-tagged quarantine
// crate on the floor for the suspect parts. An SPC board on legs with its
// chart and a pinned reaction plan. A table with the funnel experiment: a
// funnel on a stand over a paper target, and the marbles. Charts (the X-bar
// and R chart, the rules, the chart of single parts, the wear sawtooth, the
// four count charts, the four-cavity subgroups) sit in stage space over the
// drawing; every chart is labelled "voorbeeld".
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
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Sources as in the lessons: Shewhart's X-bar and R chart
// with the table constant A2 = 0,577 for n = 5 (and D4 = 2,114 for the R chart,
// ASTM / AIAG SPC tables), the Western Electric style run rules as the lesson
// words them, the funnel experiment (Deming, Out of the Crisis, 1986: rule 2
// doubles the variance) and the p chart limits p̄ ± 3·√(p̄(1 − p̄)/n).
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// spc: Ø20 ±0,05, n = 5, grand mean 20,000, R̄ 0,020, A2 0,577 → 19,9885–20,0115
const NOM = 20;
const TOL = 0.05;
const A2 = 0.577;
const D4 = 2.114;
const RBAR = 0.02;
const UCL = NOM + A2 * RBAR;
const LCL = NOM - A2 * RBAR;
assert(near(UCL, 20.0115, 0.00005) && near(LCL, 19.9885, 0.00005), 'limits 19,9885 to 20,0115');
assert(UCL < NOM + TOL && LCL > NOM - TOL, 'the control limits sit far inside the spec limits');
// the means from 10:00 to 16:00: seven rising in a row, all inside the limits
const MEANS = [20.002, 20.004, 20.005, 20.006, 20.008, 20.009, 20.011];
assert(MEANS.length === 7 && MEANS.every((m, i) => i === 0 || m > MEANS[i - 1]), 'seven rising in a row');
assert(MEANS.every((m) => m < UCL && m > LCL), 'all inside the control limits');
assert(MEANS.every((m) => m > NOM), 'and all on one side of the centre line');
// four earlier, quiet hours (06:00 to 09:00), then the seven; ranges around R̄
const EARLY = [19.999, 20.002, 19.998, 20.001];
const RANGES = [0.019, 0.023, 0.017, 0.021, 0.02, 0.018, 0.024, 0.019, 0.022, 0.02, 0.021];
assert(RANGES.length === EARLY.length + MEANS.length && RANGES.every((r) => r < D4 * RBAR), 'ranges inside the R chart');
// tampering: σ × √2 → +41 %; variance × 2; take it away → 1 − 1/√2 = 29 %, roughly 30 %
assert(Math.round((Math.SQRT2 - 1) * 100) === 41, '+41 %');
assert(Math.round((1 - 1 / Math.SQRT2) * 100) === 29, '−29 %');
// a seeded normal series, the same for every build
function series(seed, n) {
  let s = seed >>> 0;
  const u = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
  const out = [];
  while (out.length < n) {
    const a = u();
    const b = u();
    const r = Math.sqrt(-2 * Math.log(a));
    out.push(r * Math.cos(2 * Math.PI * b), r * Math.sin(2 * Math.PI * b));
  }
  return out.slice(0, n);
}
const sd = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1)); };
// rule 1 (leave it) against rule 2 (move by the last miss), in two dimensions;
// a seed whose sample shows the theory well: the spread grows by 35–48 %
function funnelRun(seed, n) {
  const nx = series(seed, n);
  const ny = series(seed + 7, n);
  const still = nx.map((x, i) => [x, ny[i]]);
  const pos = [[0, 0]];
  const moved = [];
  for (let i = 0; i < n; i++) {
    const [px, py] = pos[i];
    const land = [px + nx[i], py + ny[i]];
    moved.push(land);
    pos.push([px - land[0], py - land[1]]);
  }
  return { still, moved, pos: pos.slice(0, n) };
}
const FUN_N = 36;
let FUNSEED = 1;
let FUN;
for (; FUNSEED < 400; FUNSEED++) {
  FUN = funnelRun(FUNSEED, FUN_N);
  const r = sd(FUN.moved.flat()) / sd(FUN.still.flat());
  const m = Math.hypot(...[0, 1].map((c) => FUN.still.reduce((a, p) => a + p[c], 0) / FUN_N));
  if (r > 1.35 && r < 1.48 && m < 0.2) break;
}
assert(FUNSEED < 400, 'a funnel seed that shows about +41 %');
// the chart of single parts: stable (left) and the same noise with an
// adjustment by the full deviation after every part (right)
const ZIG_N = 24;
let ZIGSEED = 1;
let ZIG;
for (; ZIGSEED < 400; ZIGSEED++) {
  const e = series(ZIGSEED + 1000, ZIG_N * 2);
  const stable = e.slice(0, ZIG_N);
  const noise = e.slice(ZIG_N);
  let off = 0;
  const tamp = noise.map((x) => { const y = off + x; off -= y; return y; });
  const r = sd(tamp) / sd(stable);
  if (r > 1.35 && r < 1.5 && Math.max(...stable.map(Math.abs)) < 2.2) { ZIG = { stable, tamp }; break; }
}
assert(ZIG, 'a single-parts series that shows tampering');
// charts: p chart at 1 % and n = 50 → LCL 0, UCL ≈ 5,2 %; two bad parts = 4 % stay inside
const pUcl = 0.01 + 3 * Math.sqrt((0.01 * 0.99) / 50);
assert(near(pUcl, 0.052, 0.0005) && 0.01 - 3 * Math.sqrt((0.01 * 0.99) / 50) < 0 && 2 / 50 < pUcl, 'p chart: 0 to 5,2 %, 4 % inside');
// four cavities, one part each per hour; cavity 3 drifts thin
const CAV = 4;
const THIN = 2; // index of cavity 3
assert(THIN + 1 === 3, 'cavity 3');

// ---------------------------------------------------------------- the world
// x to the right along the floor (lathe at -x, funnel table at +x), y toward
// the viewer, z up; the floor is z = 0. Units of about 5 mm.
const W = 640;
const H = 400;
const LZ = 72; // spindle centre height inside the lathe
const LY = -10;
const CHUCK = { x0: -302, x1: -293, r: 9 };
const SHAFT = { x0: -293, x1: -262, r: 2.4 };
const BT = 36; // bench top
const TRAY = { x: -132, y: -14, w: 38, d: 26, r: 0.6 };
const SHY = [-9.5, -4.8, 0, 4.8, 9.5].map((d) => TRAY.y + TRAY.d / 2 + d);
const SHX = [TRAY.x + 4, TRAY.x + TRAY.w - 4];
const CRATE = { x: -112, y: 24, w: 36, d: 22, r: 0.8 };
const CRATE_H = 18;
const BOARD = { x0: -22, x1: 98, y: -22, z0: 34, z1: 112 };
const FT = 34; // funnel table top
const TGT = [192, 4]; // target centre on the paper
const FUN_Z = 74; // funnel spout height
const C = {
  LZ, LY, CHUCK, SHAFT, BT, TRAY, SHY, SHX, CRATE, CRATE_H, BOARD, FT, TGT, FUN_Z,
  NOM, UCL, LCL, RBAR, D4, TOL, MEANS, EARLY, RANGES,
  FUN: { still: FUN.still.map((p) => p.map((v) => Math.round(v * 100) / 100)), moved: FUN.moved.map((p) => p.map((v) => Math.round(v * 100) / 100)), pos: FUN.pos.map((p) => p.map((v) => Math.round(v * 100) / 100)) },
  ZIG: { stable: ZIG.stable.map((v) => Math.round(v * 100) / 100), tamp: ZIG.tamp.map((v) => Math.round(v * 100) / 100) },
  PUCL: Math.round(pUcl * 1000) / 1000, CAV, THIN,
};

const FIT = [[-336, -44, 0], [236, 40, 0], [-336, -44, 120], [236, -40, 100], [-336, 48, 0], [236, 48, 0]];
const P = k.fitProjection(FIT, W, H, { pad: 12, azimuth: 52, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'sp-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const feet = (plan, z = 3, r = 2.4) => k.corners(plan, 3).map(([x, y]) => post(x, y, r, 0, z, { tone: 'lo' }, 14)).join('');

// ---------------------------------------------------------------- the lathe
const BASE = { x: -334, y: -38, w: 124, d: 54, r: 1.2 };
const ENC = { x: -330, y: -36, w: 116, d: 48, r: 1 };
const ENC_F = ENC.y + ENC.d; // the enclosure's front face, y = 12
const WIN = { x0: -318, x1: -252, z0: 50, z1: 94 };
const latheBack = [
  halo(k.insetPlan(BASE, -3), 0, 2),
  feet(BASE),
  box(BASE, 3, 42, { tone: 'lo', inner: seam(BASE, 38, 3) + seam(BASE, 8, 3) }, 0.6, 2),
  // the chip drawer, its handle and the coolant tank's gauge
  card(BASE.y + BASE.d, -326, -262, 12, 32),
  box({ x: -302, y: BASE.y + BASE.d, w: 16, d: 1.6, r: 0.4 }, 26, 28.4, { tone: 'hi', crease: 'lo' }, 0, 1),
  card(BASE.y + BASE.d, -252, -232, 16, 30, 'sp-glass'),
  rules(-250, BASE.y + BASE.d, 26, [8, 12, 6], 3),
  // the enclosure: drawn whole, its window shows the inside drawn over it
  box(ENC, 42, 102, { inner: seam(ENC, 98, 3) + seam(ENC, 46, 3) }, 0.6, 2),
  screws(ENC, 102, 3),
  `<path class="sp-cave" d="${faceY(ENC_F, WIN.x0, WIN.x1, WIN.z0, WIN.z1)}"/>`,
].join('');
// inside, seen through the window: the headstock, the chuck with its jaws, the
// shaft, the turret with the insert, the coolant nozzle and the chip pan
const IN_Y = ENC_F - 0.4;
const latheInside = [
  box({ x: -318, y: -26, w: 14, d: 30, r: 0.6 }, 50, 92, { tone: 'lo' }, 0.4, 1),
  alongX(LY, LZ, -304, CHUCK.x0, 11.4, { tone: 'lo' }, 28),
  g('chuck', alongX(LY, LZ, CHUCK.x0, CHUCK.x1, CHUCK.r, { tone: 'mid', crease: 'lo' }, 28)
    + [0, 1, 2].map((i) => {
      const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
      const cy = LY + Math.cos(a) * 5.6;
      const cz = LZ + Math.sin(a) * 5.6;
      return box({ x: CHUCK.x1, y: cy - 1.4, w: 3, d: 2.8, r: 0.3 }, cz - 1.6, cz + 1.6, { tone: 'hi', crease: 'lo' }, 0, 1);
    }).join('')),
  g('shaftIn', alongX(LY, LZ, CHUCK.x1 + 3, SHAFT.x1, SHAFT.r, { tone: 'hi', crease: 'lo' }, 20)
    + L(G.arcOf(G.frameOf([0, LY, LZ], X, Y, Z), SHAFT.x1 - 9, SHAFT.r, P), { tone: 'lo' })),
  // the turret on its slide
  box({ x: -278, y: -30, w: 22, d: 10, r: 0.6 }, 54, 60, { tone: 'lo' }, 0.3, 1),
  box({ x: -276, y: -28, w: 18, d: 12, r: 1 }, 60, 70, {}, 0.4, 1),
  box({ x: -270, y: -16, w: 6, d: 4, r: 0.3 }, 63, 69, { tone: 'lo' }, 0, 1),
  cue('insert', g('insert', box({ x: -268.5, y: -12.6, w: 3, d: 2.4, r: 0.2 }, 66, 69, { tone: 'hi', crease: 'lo' }, 0, 1))),
  k.wireSvg(at([-284, -28, 92]), at([-266, -12, 74]), { via: [at([-284, -20, 88])], tone: 'mid', size: 0.8, ends: 'both' }),
  g('chips', ''),
].join('');
// the window frame and glass, the door handle, the panel and the tower
const latheFront = [
  `<path class="sp-glass" d="${faceY(IN_Y, WIN.x0, WIN.x1, WIN.z0, WIN.z1)}"/>`,
  L(k.pathOf([[WIN.x0, ENC_F, WIN.z0], [WIN.x1, ENC_F, WIN.z0], [WIN.x1, ENC_F, WIN.z1], [WIN.x0, ENC_F, WIN.z1]].map(at), true), { tone: 'mid' }),
  L(k.pathOf([[WIN.x0 - 3, ENC_F, WIN.z0 - 3], [WIN.x1 + 3, ENC_F, WIN.z0 - 3], [WIN.x1 + 3, ENC_F, WIN.z1 + 3], [WIN.x0 - 3, ENC_F, WIN.z1 + 3]].map(at), true), { tone: 'faint' }),
  Dt([[WIN.x0 - 1.5, ENC_F, WIN.z0 - 1.5], [WIN.x1 + 1.5, ENC_F, WIN.z0 - 1.5], [WIN.x0 - 1.5, ENC_F, WIN.z1 + 1.5], [WIN.x1 + 1.5, ENC_F, WIN.z1 + 1.5]].map(at), { size: 0.45 }),
  box({ x: -246, y: ENC_F, w: 3, d: 3, r: 0.6 }, 58, 86, { tone: 'hi', crease: 'lo' }, 0, 1),
  // a label plate under the window
  card(ENC_F, -300, -270, 44.5, 48.5),
  rules(-298, ENC_F, 47.6, [16, 22], 1.6),
].join('');
const PANEL = { x: -230, y: 4, w: 16, d: 12, r: 0.8 };
const latheSide = cue('panel', [
  box({ x: -224, y: 6, w: 4, d: 4, r: 0.4 }, 102, 106, { tone: 'lo' }, 0, 1),
  box(PANEL, 52, 96, { inner: seam(PANEL, 92, 2) }, 0.4, 1),
  card(PANEL.y + PANEL.d, PANEL.x + 2, PANEL.x + PANEL.w - 2, 74, 92, 'sp-screen'),
  g('panelTxt', ''),
  ...[0, 1, 2].map((r) => [0, 1, 2].map((c) => card(PANEL.y + PANEL.d, PANEL.x + 2.4 + c * 4, PANEL.x + 5.4 + c * 4, 66 - r * 4, 68.6 - r * 4)).join('')),
  post(PANEL.x + PANEL.w - 4, PANEL.y + PANEL.d - 3, 1.8, 96, 97.6, { tone: 'hi', crease: 'lo' }, 14),
].join(''));
const TOWER = [-322, -14];
const tower = post(TOWER[0], TOWER[1], 2.6, 102, 106, { tone: 'lo' }, 16)
  + [0, 1, 2].map((i) => g('lamp' + i, post(TOWER[0], TOWER[1], 2.2, 106 + i * 4, 110 + i * 4, { crease: 'lo' }, 16))).join('')
  + post(TOWER[0], TOWER[1], 2.4, 118, 119, {}, 16);

// ---------------------------------------------------------------- the bench
const BENCH = { x: -184, y: -32, w: 128, d: 54, r: 1.5 };
const bench = [
  halo(k.insetPlan(BENCH, -3), 0, 2),
  ...k.corners(BENCH, 5).map(([x, y]) => box({ x: x - 2, y: y - 2, w: 4, d: 4, r: 0.4 }, 0, BT - 5, { tone: 'lo' }, 0.2, 1)),
  box({ x: BENCH.x + 4, y: BENCH.y + 4, w: BENCH.w - 8, d: BENCH.d - 8, r: 0.6 }, 8, 10, { tone: 'lo', crease: 'none' }, 0, 1),
  box(BENCH, BT - 5, BT, { inner: seam(BENCH, BT - 2.5, 3) }, 0.5, 3),
  L(k.planOutline(k.insetPlan(BENCH, 3), BT, P, 3), { tone: 'faint' }),
  screws(BENCH, BT, 3),
].join('');
// the micrometer on its stand: a C-frame in the xz plane, anvil left, spindle,
// sleeve with its scale and the knurled thimble right
const MIC = { x: -172, y: -14, z: BT + 6 };
const micro = (() => {
  const st = { x: MIC.x - 4, y: MIC.y - 6, w: 30, d: 12, r: 1 };
  let out = box(st, BT, BT + 4, { tone: 'lo' }, 0.4, 2) + screws(st, BT + 4, 1.6);
  out += box({ x: MIC.x + 10, y: MIC.y - 3, w: 8, d: 6, r: 0.5 }, BT + 4, MIC.z + 6, {}, 0.3, 1);
  const fr = (x0, x1, z0, z1) => box({ x: x0, y: MIC.y - 1.6, w: x1 - x0, d: 3.2, r: 0.4 }, z0, z1, { tone: 'hi', crease: 'lo' }, 0.2, 1);
  out += fr(MIC.x, MIC.x + 4, MIC.z + 6, MIC.z + 24) + fr(MIC.x, MIC.x + 30, MIC.z + 6, MIC.z + 10) + fr(MIC.x + 26, MIC.x + 30, MIC.z + 6, MIC.z + 24);
  // the anvil and the spindle along x at the top
  out += alongX(MIC.y, MIC.z + 20, MIC.x + 4, MIC.x + 7, 1.4, { tone: 'hi', crease: 'lo' }, 14);
  out += g('spindle', alongX(MIC.y, MIC.z + 20, MIC.x + 15, MIC.x + 26, 1.4, { tone: 'hi', crease: 'lo' }, 14));
  const sl = G.frameOf([0, MIC.y, MIC.z + 20], X, Y, Z);
  out += alongX(MIC.y, MIC.z + 20, MIC.x + 30, MIC.x + 40, 2.6, {}, 18) + L(k.segment([MIC.x + 30.5, MIC.y + 2.6, MIC.z + 20.8], [MIC.x + 39.5, MIC.y + 2.6, MIC.z + 20.8], P), { tone: 'lo' });
  out += alongX(MIC.y, MIC.z + 20, MIC.x + 40, MIC.x + 50, 3.4, { tone: 'hi', crease: 'lo' }, 22);
  out += L([0, 1, 2, 3, 4, 5].map((i) => G.arcOf(sl, MIC.x + 44 + i * 1.1, 3.42, P)).join(''), { tone: 'faint' });
  out += alongX(MIC.y, MIC.z + 20, MIC.x + 50, MIC.x + 54, 2, {}, 16);
  return out;
})();
const tray = box(TRAY, BT, BT + 2, { tone: 'lo' }, 0.3, 2)
  + L(k.planOutline(k.insetPlan(TRAY, 1.6), BT + 2, P, 2), { tone: 'faint' })
  + [0, 1, 2, 3, 4].map((i) => g('sh' + i, alongX(SHY[i], BT + 4.4, SHX[0], SHX[1], 2.2, { tone: 'hi', crease: 'lo' }, 18))).join('');
const inserts = (() => {
  const b = { x: -84, y: -26, w: 16, d: 12, r: 0.6 };
  return box(b, BT, BT + 4, { tone: 'lo' }, 0.3, 1) + box(k.insetPlan(b, 1), BT + 4, BT + 5, { tone: 'hi', crease: 'lo' }, 0.2, 1)
    + L([0, 1, 2].map((i) => k.lineOnTop([b.x + 3, b.y + 3 + i * 3], [b.x + 3 + [9, 6, 8][i], b.y + 3 + i * 3], BT + 5, P)).join(''), { tone: 'lo', free: true });
})();
// the quarantine crate on the floor, its slats, its red tag and the suspect shafts
const crate = (() => {
  const c = CRATE;
  let out = halo(k.insetPlan(c, -2), 0, 2) + box(c, 0, CRATE_H, { tone: 'lo', inner: seam(c, 6, 2) + seam(c, 12, 2) }, 0.4, 2);
  out += L(k.planOutline(k.insetPlan(c, 1.4), CRATE_H, P, 2), { tone: 'mid' });
  out += `<path class="sp-cave" d="${k.pathOf(k.roundedPlan(k.insetPlan(c, 1.6), 2).map(([x, y]) => at([x, y, CRATE_H])), true)}"/>`;
  out += g('crateIn', '');
  out += g('tag', `<path class="sp-tag" d="${faceY(c.y + c.d + 0.2, c.x + 22, c.x + 32, 5, 13)}"/>` + rules(c.x + 23.5, c.y + c.d + 0.3, 10.4, [6, 4], 2));
  return out;
})();

// ---------------------------------------------------------------- the SPC board
const B = BOARD;
const BF = B.y + 3; // the board's face
const board = [
  ...[B.x0 + 4, B.x1 - 4].map((x) => halo({ x: x - 4, y: B.y - 10, w: 8, d: 24, r: 2 }, 0, 1.5)
    + box({ x: x - 3, y: B.y - 10, w: 6, d: 24, r: 1 }, 0, 3, { tone: 'lo' }, 0.4, 1)
    + box({ x: x - 1.6, y: B.y - 0.6, w: 3.2, d: 3.2, r: 0.4 }, 3, B.z1, {}, 0.2, 1)).join(''),
  box({ x: B.x0, y: B.y, w: B.x1 - B.x0, d: 3, r: 0.6 }, B.z0, B.z1, { tone: 'lo' }, 0.4, 1),
  card(BF + 0.05, B.x0 + 2.4, B.x1 - 2.4, B.z0 + 2.4, B.z1 - 2.4, 'sp-white'),
  // the chart drawn on the board: two frames, the limits and its points (drawn live)
  L(k.pathOf([[B.x0 + 8, BF + 0.1, 104], [B.x0 + 8, BF + 0.1, 66], [B.x0 + 76, BF + 0.1, 66]].map(at)) + k.pathOf([[B.x0 + 8, BF + 0.1, 60], [B.x0 + 8, BF + 0.1, 42], [B.x0 + 76, BF + 0.1, 42]].map(at)), { tone: 'mid', free: true }),
  L([96, 85, 74].map((z) => k.segment([B.x0 + 9, BF + 0.1, z], [B.x0 + 76, BF + 0.1, z], P)).join('') + k.segment([B.x0 + 9, BF + 0.1, 52], [B.x0 + 76, BF + 0.1, 52], P), { tone: 'faint', free: true }),
  g('boardPts', ''),
  // the reaction plan pinned at the right
  cue('plan', card(BF + 0.15, B.x1 - 32, B.x1 - 8, 52, 100, 'sp-paper') + rules(B.x1 - 29, BF + 0.2, 95, [14, 18, 10, 16, 12, 17, 9, 15, 11], 4.4)
    + Dt([at([B.x1 - 20, BF + 0.3, 98.4])], { size: 0.6, tone: 'hi' })),
  // the pen tray
  box({ x: B.x0 + 10, y: B.y + 3, w: 60, d: 4, r: 0.4 }, B.z0 - 1, B.z0 + 1.4, {}, 0.2, 1),
  alongX(B.y + 5, B.z0 + 2.4, B.x0 + 20, B.x0 + 34, 1, { tone: 'hi', crease: 'lo' }, 10),
].join('');

// ---------------------------------------------------------------- the funnel table
const TBL = { x: 134, y: -30, w: 100, d: 66, r: 1.5 };
const SHEET = { x: TGT[0] - 30, y: TGT[1] - 22, w: 60, d: 44, r: 0.4 };
const table = [
  halo(k.insetPlan(TBL, -3), 0, 2),
  ...k.corners(TBL, 5).map(([x, y]) => box({ x: x - 2, y: y - 2, w: 4, d: 4, r: 0.4 }, 0, FT - 4, { tone: 'lo' }, 0.2, 1)),
  box(TBL, FT - 4, FT, { inner: seam(TBL, FT - 2, 3) }, 0.5, 3),
  screws(TBL, FT, 3),
  box(SHEET, FT, FT + 0.4, { tone: 'hi', crease: 'none' }, 0, 1),
  L(k.lineOnTop([SHEET.x + 3, TGT[1]], [SHEET.x + SHEET.w - 3, TGT[1]], FT + 0.4, P) + k.lineOnTop([TGT[0], SHEET.y + 3], [TGT[0], SHEET.y + SHEET.d - 3], FT + 0.4, P), { tone: 'faint' }),
  L([6, 12, 18].map((r) => k.ring(TGT[0], TGT[1], r, FT + 0.4, P, 40)).join(''), { tone: 'faint' }),
  Dt([at([TGT[0], TGT[1], FT + 0.4])], { size: 0.7, tone: 'hi' }),
  g('marbles', ''),
  // the stand: base, post, the arm the funnel slides on
  box({ x: 144, y: -26, w: 16, d: 14, r: 1 }, FT, FT + 3, { tone: 'lo' }, 0.3, 1),
  post(152, -19, 1.8, FT + 3, FUN_Z + 24, { crease: 'none' }, 14),
  box({ x: 150, y: -21, w: 4, d: 4, r: 0.4 }, FUN_Z + 18, FUN_Z + 22, { tone: 'hi', crease: 'lo' }, 0, 1),
  box({ x: 154, y: -20, w: 56, d: 2, r: 0.3 }, FUN_Z + 19, FUN_Z + 21, {}, 0, 1),
  // the marble cup at the stand's foot
  post(166, -22, 4, FT, FT + 4, { tone: 'lo' }, 18) + L(k.ring(166, -22, 3, FT + 4, P, 18), { tone: 'mid' }),
].join('');
// the funnel hangs from a clamp on the arm; it moves (translate) in x and y
const FUNF = G.frameOf([TGT[0], TGT[1], FUN_Z], Z, X, Y);
const funnel = cue('funnel', g('funnel', [
  box({ x: TGT[0] - 2, y: -21, w: 4, d: 4, r: 0.4 }, FUN_Z + 17, FUN_Z + 23, { tone: 'lo' }, 0, 1),
  box({ x: TGT[0] - 0.8, y: -19, w: 1.6, d: 19 + TGT[1], r: 0.2 }, FUN_Z + 18, FUN_Z + 19.4, { tone: 'lo' }, 0, 1),
  S(G.solidOf([[0, 1.1], [6, 1.1], [7, 1.6], [16, 9]], FUNF, P), { tone: 'hi', crease: 'lo' }),
  `<path class="sp-cave" d="${k.pathOf(k.circleRing(TGT[0], TGT[1], 8.2, 32).map(([x, y]) => at([x, y, FUN_Z + 16])), true)}"/>`,
].join('')));

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('xr', g('xrIn', '') + cue('limits', g('xrLim', '')), ' data-cue="chart"'),
  g('xbar', '', ' data-cue="xbar"'),
  g('rules', ''),
  g('zig', '', ' data-cue="zig"'),
  g('saw', '', ' data-cue="saw"'),
  g('meter', ''),
  g('counts', g('cP', '', ' data-cue="pchart"') + g('cNP', '', ' data-cue="npchart"') + g('cC', '', ' data-cue="cchart"') + g('cU', '', ' data-cue="uchart"')),
  g('pdet', ''),
  g('cav', g('cavIn', '') + cue('rsub', g('cavR', ''))),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('lathe', latheBack + cue('lathe', latheInside) + latheFront + latheSide + tower),
  g('bench', bench + cue('mic', micro) + cue('sample', tray) + inserts),
  cue('crate', crate),
  cue('board', board),
  g('funTable', table + funnel),
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([-60, 0, 50], 660), to: cam([-100, 0, 55], 480), a: 0.3, b: 0.6 },
  { from: cam([20, -20, 72], 330, 110), to: cam([30, -20, 72], 300, 105) },
  { from: cam([30, -20, 72], 300, 105), to: cam([30, -20, 72], 290, 105) },
  { from: cam([-95, 0, 62], 570), to: cam([-175, 10, 50], 330), a: 0.5, b: 0.72 },
  { from: cam([-250, 0, 74], 260, 110), to: cam([-245, 0, 74], 240, 110) },
  { from: cam([190, 0, 52], 300), to: cam([192, 0, 50], 240), a: 0.1, b: 0.9 },
  { from: cam([-255, 0, 72], 240, 110), to: cam([-255, 0, 72], 230, 110) },
  { from: cam([-95, 30, 14], 220, 100), to: cam([-95, 30, 14], 200, 100) },
  { from: cam([38, -20, 72], 300, 105), to: cam([38, -20, 72], 280, 105) },
];

// ---------------------------------------------------------------- the film
const SPC = 'eng.quality.spc';
const TAMP = 'eng.spc.tampering';
const CH = 'eng.spc.charts';
const DUR = [30, 30, 30, 30, 28, 28, 32, 32, 30];
C.dur = DUR;
const spec = {
  id: 'eng.quality.spc',
  title: { nl: 'Een regelkaart slaat alarm', en: 'A control chart raises the alarm' },
  lessons: [SPC, TAMP, CH],
  scenes: [
    {
      id: 's1', lesson: SPC, level: 1, dur: DUR[0], still: 0.85, title: { nl: 'Elk uur vijf assen', en: 'Five shafts every hour' },
      beats: [
        { nl: '{t:SPC|SPC}: een lopend proces bewaken met eenvoudige statistiek, zodat je een verandering op tijd ziet.', en: '{t:SPC|SPC}: watching a running process with simple statistics, so you see a change in time.', cue: { SPC: 'board' }, still: 0.12 },
        { nl: 'Deze draaibank maakt assen Ø{n:20} ±{n:0.05}.', en: 'This lathe makes shafts Ø{n:20} ±{n:0.05}.', cues: ['lathe'], still: 0.36 },
        { nl: 'Elk uur een {t:Steekproef|steekproef}: {n:5} assen direct na elkaar, alle vijf gemeten.', en: 'Every hour a {t:Subgroup|subgroup}: {n:5} shafts made one after another, all five measured.', cue: { Steekproef: 'sample' }, still: 0.66 },
        { nl: 'Op het bord de {t:Regelkaart|regelkaart}: een meting in de tijd, met een middellijn en twee grenzen.', en: 'On the board the {t:Control chart|control chart}: a measurement over time, with a centre line and two limits.', cue: { Regelkaart: 'board' }, still: 0.95 },
      ],
    },
    {
      id: 's2', lesson: SPC, level: 2, dur: DUR[1], still: 0.7, title: { nl: 'Gemiddelde en range', en: 'Average and range' },
      beats: [
        { nl: 'De {t:X-bar/R-kaart|X-bar/R-kaart}: boven het gemiddelde van de vijf, onder hun range.', en: 'The {t:X-bar/R chart|X-bar/R chart}: the average of the five on top, their range below.', cue: { 'X-bar/R-kaart': 'xbar' }, still: 0.2 },
        { nl: 'X-bar laat zien of het midden verschuift, R of de spreiding verandert.', en: 'X-bar shows whether the centre moves, R whether the spread changes.', cues: ['chart'], still: 0.42 },
        { nl: '{t:Regelgrenzen|Regelgrenzen} uit de eigen data: {n:20.000} ± {n:0.577} × {n:0.020}.', en: '{t:Control limits|Control limits} from the process’s own data: {n:20.000} ± {n:0.577} × {n:0.020}.', cue: { Regelgrenzen: 'limits' }, read: { nl: '{n:19.9885} tot {n:20.0115}', en: '{n:19.9885} to {n:20.0115}' }, still: 0.68 },
        { nl: 'Spec is wat de klant vraagt, regelgrenzen wat het proces doet. Spec hoort niet op deze kaart.', en: 'Spec is what the customer needs, control limits what the process does. Spec stays off this chart.', cues: ['limits'], still: 0.92 },
      ],
    },
    {
      id: 's3', lesson: SPC, level: 2, dur: DUR[2], still: 0.75, title: { nl: 'Zeven keer omhoog', en: 'Seven up in a row' },
      beats: [
        { nl: 'Om 10:00 {n:20.002}, dan {n:20.004}, {n:20.005}, {n:20.006}: allemaal binnen de grenzen.', en: 'At 10:00 {n:20.002}, then {n:20.004}, {n:20.005}, {n:20.006}: all inside the limits.', cues: ['chart'], still: 0.22 },
        { nl: 'Dan {n:20.008}, {n:20.009} en om 16:00 {n:20.011}. Ver binnen spec.', en: 'Then {n:20.008}, {n:20.009} and at 16:00 {n:20.011}. Far inside spec.', cues: ['chart'], still: 0.45 },
        { nl: 'Maar zeven keer op rij omhoog: een trend. De regel gaat af.', en: 'But seven rising in a row: a trend. The rule fires.', cues: ['chart'], still: 0.7 },
        { nl: 'Ook een signaal: een punt buiten een grens, zeven aan één kant, twee van drie voorbij 2σ.', en: 'Also a signal: a point outside a limit, seven on one side, two of three beyond 2σ.', cues: [], still: 0.93 },
      ],
    },
    {
      id: 's4', lesson: SPC, level: 2, dur: DUR[3], still: 0.8, title: { nl: 'Stoppen en kijken', en: 'Stop and look' },
      beats: [
        { nl: 'Het {t:Reactieplan|reactieplan}: wat doet de operator als een regel afgaat, en wie belt hij?', en: 'The {t:Reaction plan|reaction plan}: what does the operator do when a rule fires, and who does he call?', cue: { Reactieplan: 'plan' }, still: 0.15 },
        { nl: 'Hij stopt en kijkt naar de wisselplaat: versleten. Om 16:10 zit er een nieuwe in.', en: 'He stops and checks the insert: worn. At 16:10 a new one is in.', cues: ['insert'], still: 0.4 },
        { nl: '{t:Verdachte delen|Verdachte delen}: alles sinds de laatste goede meting, apart gezet en gecontroleerd.', en: '{t:Suspect parts|Suspect parts}: everything since the last good check, held and checked.', cue: { 'Verdachte delen': 'crate' }, still: 0.68 },
        { nl: 'Geen enkele as buiten spec. Een kaart zonder reactieplan is behang.', en: 'Not one shaft out of spec. A chart without a reaction plan is wallpaper.', cues: ['crate'], still: 0.93 },
      ],
    },
    {
      id: 's5', lesson: TAMP, level: 2, dur: DUR[4], still: 0.7, title: { nl: 'Bijsturen op ruis', en: 'Chasing noise' },
      beats: [
        { nl: 'Een stabiel proces. De operator meet elk stuk en verzet de correctie met de afwijking.', en: 'A stable process. The operator measures every part and moves the offset by its deviation.', cues: ['panel'], still: 0.15 },
        { nl: '{t:Overbijsturen|Overbijsturen}: bijstellen op toevallige variatie. Er komt een tweede ruis bovenop.', en: '{t:Tampering|Tampering}: adjusting on random variation. It adds a second noise on top.', cue: { Overbijsturen: 'zig' }, still: 0.45 },
        { nl: 'Op de kaart: een zigzag van stuk tot stuk, en meer spreiding dan de meetstudie verklaart.', en: 'On the chart: a zig-zag from part to part, and more spread than the gauge study explains.', cues: ['zig'], still: 0.7 },
        { nl: 'Met de beste bedoelingen: “Ik hou hem op nominaal.”', en: 'With the best intentions: “I keep it on nominal.”', cues: ['panel'], still: 0.93 },
      ],
    },
    {
      id: 's6', lesson: TAMP, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'De trechter', en: 'The funnel' },
      beats: [
        { nl: 'Het {t:Trechterexperiment|trechterexperiment}: knikkers vallen door een trechter op een doel.', en: 'The {t:Funnel experiment|funnel experiment}: marbles drop through a funnel onto a target.', cue: { Trechterexperiment: 'funnel' }, still: 0.15 },
        { nl: 'Trechter stil: een nette wolk rond het doel.', en: 'Funnel left alone: a tidy cloud around the target.', cues: ['funnel'], still: 0.42 },
        { nl: 'Verzet hem na elke worp om de misser te corrigeren: de wolk wordt {n:41}% breder.', en: 'Move it after every drop to correct the miss: the cloud gets {n:41}% wider.', cues: ['funnel'], read: { nl: 'σ × √{n:2} = +{n:41}%', en: 'σ × √{n:2} = +{n:41}%' }, still: 0.72 },
        { nl: 'De variantie verdubbelt. Zo werkt ook een operator die na elk stuk bijstelt.', en: 'The variance doubles. So does an operator who adjusts after every part.', cues: ['funnel'], still: 0.95 },
      ],
    },
    {
      id: 's7', lesson: TAMP, level: 2, dur: DUR[6], still: 0.55, title: { nl: 'Alleen op een signaal', en: 'Only on a signal' },
      beats: [
        { nl: 'De regel: alleen bijstellen op een signaal. Tussen signalen laat je de machine met rust.', en: 'The rule: adjust only on a signal. Between signals, leave the machine alone.', cues: ['zig'], still: 0.15 },
        { nl: '{t:Slijtagecompensatie|Slijtagecompensatie}: voor bekende slijtage een vaste correctie na een vast aantal stuks.', en: '{t:Wear compensation|Wear compensation}: for known wear, a fixed offset after a set number of parts.', cue: { Slijtagecompensatie: 'saw' }, still: 0.42 },
        { nl: 'Na twee weken zakt de standaardafwijking met ruwweg {n:30}%, als overbijsturen de oorzaak was.', en: 'After two weeks the standard deviation drops by roughly {n:30}%, if tampering was the cause.', cues: ['zig'], read: { nl: '1 − 1/√2 = {n:29}%', en: '1 − 1/√2 = {n:29}%' }, still: 0.68 },
        { nl: 'Een meting in de machine die de correctie stuurt: op het gemiddelde, nooit op één stuk.', en: 'An in-machine gauge that sets the offset: on the average, never on one part.', cues: ['panel'], still: 0.93 },
      ],
    },
    {
      id: 's8', lesson: CH, level: 2, dur: DUR[7], still: 0.92, title: { nl: 'Tellen in plaats van meten', en: 'Counting instead of measuring' },
      beats: [
        { nl: 'De {t:p-kaart|p-kaart}: de fractie afkeur, ook als de steekproef steeds anders groot is.', en: 'The {t:p chart|p chart}: the fraction defective, even when the sample size varies.', cue: { 'p-kaart': 'pchart' }, still: 0.14 },
        { nl: 'De {t:np-kaart|np-kaart}: het aantal afgekeurde stuks bij een vaste steekproef.', en: 'The {t:np chart|np chart}: the number defective in a sample of fixed size.', cue: { 'np-kaart': 'npchart' }, still: 0.36 },
        { nl: '{t:c-kaart|c-kaart}: defecten per eenheid, alle even groot. {t:u-kaart|u-kaart}: als de grootte wisselt.', en: '{t:c chart|c chart}: defects per unit, all the same size. {t:u chart|u chart}: when the size varies.', cue: { 'c-kaart': 'cchart', 'u-kaart': 'uchart' }, still: 0.6 },
        { nl: 'Bij {n:1}% afkeur en {n:50} stuks ligt de bovengrens op {n:5.2}%: telkaarten reageren laat.', en: 'At {n:1}% defective and {n:50} parts the upper limit is {n:5.2}%: count charts react late.', cues: [], read: { nl: '{n:2} van {n:50} = {n:4}%: nog binnen', en: '{n:2} of {n:50} = {n:4}%: still inside' }, still: 0.92 },
      ],
    },
    {
      id: 's9', lesson: CH, level: 2, dur: DUR[8], still: 0.68, title: { nl: 'Wat zit er in één subgroep?', en: 'What is in one subgroup?' },
      beats: [
        { nl: 'Een matrijs met {n:4} holtes. Elk uur één stuk uit elke holte, samen op één kaart.', en: 'A mould with {n:4} cavities. Every hour one part from each cavity, together on one chart.', cues: ['chart'], still: 0.15 },
        { nl: 'De R-kaart is breed, X-bar geeft nooit een signaal, maar holte {n:3} maakt dunne wanden.', en: 'The R chart is wide, X-bar never signals, yet cavity {n:3} makes thin walls.', cues: ['chart'], still: 0.4 },
        { nl: '{t:Rationele subgroep|Rationele subgroep}: stuks vlak na elkaar uit één holte. Per holte een kaart.', en: '{t:Rational subgroup|Rational subgroup}: parts made close together from one cavity. A chart per cavity.', cue: { 'Rationele subgroep': 'rsub' }, still: 0.68 },
        { nl: 'Grenzen uit {n:20} tot {n:25} subgroepen in een stabiele periode, en dan vastzetten.', en: 'Limits from {n:20} to {n:25} subgroups in a stable period, then frozen.', cues: ['rsub'], still: 0.93 },
      ],
    },
  ],
  skip: [
    { lesson: TAMP, term: 'Reactieplan', reason: 'Same term and meaning as Reactieplan of eng.quality.spc, which scene 4 names with its cue (the pinned plan on the board); the build resolves a shared term name to the first served lesson, and scene 4 also shows what the tampering lesson adds (the suspect parts set apart).' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/" or "&" in the spoken text: the X-bar/R chart
// is said as "X-bar- en R-kaart"; σ, ± and 16:00 are written out as words. The
// Dutch voice says "range" and "slijtagecompensatie" through the Dutch spoken
// forms in films/_kit/timeline.mjs (SAY).
const SAY = [
  [ // s1 five shafts every hour
    { nl: 'Een draaibank maakt de hele dag dezelfde as. Met {t:SPC|SPC}, statistische procesbeheersing, bewaak je dat proces terwijl het draait, zodat je een verandering ziet voordat er slechte delen van komen.',
      en: 'A lathe makes the same shaft all day. With {t:SPC|SPC}, statistical process control, you watch that process while it runs, so you see a change before it makes bad parts.' },
    { nl: 'Deze assen moeten {n:20} millimeter dik zijn, plus-min vijf honderdste.',
      en: 'These shafts must be {n:20} millimetres in diameter, plus or minus five hundredths.' },
    { nl: 'Elk uur neemt de operator een {t:Steekproef|steekproef}: {n:5} assen die direct na elkaar gemaakt zijn. Hij meet ze alle vijf.',
      en: 'Every hour the operator takes a {t:Subgroup|subgroup}: {n:5} shafts made one after another. He measures all five.' },
    { nl: 'De uitkomst gaat op de {t:Regelkaart|regelkaart} naast de machine: een meting uitgezet in de tijd, met een middellijn en twee regelgrenzen.',
      en: 'The result goes on the {t:Control chart|control chart} next to the machine: a measurement plotted over time, with a centre line and two control limits.' },
  ],
  [ // s2 average and range
    { nl: 'De klassieker is de {t:X-bar/R-kaart|X-bar- en R-kaart}. Bovenaan het gemiddelde van de vijf, de X-bar. Onderaan de range: de grootste min de kleinste.',
      en: 'The classic is the {t:X-bar/R chart|X-bar and R chart}. At the top the average of the five, the X-bar. At the bottom the range: the largest minus the smallest.' },
    { nl: 'X-bar laat zien of het midden verschuift; de range of de spreiding verandert.',
      en: 'X-bar shows whether the centre moves; the range whether the spread changes.' },
    { nl: 'De {t:Regelgrenzen|regelgrenzen} komen uit het proces zelf: drie sigma van de gemiddelden. Uit {n:20.000}, een gemiddelde range van {n:0.020} en de tabelconstante {n:0.577} volgt {n:19.9885} tot {n:20.0115}.',
      en: 'The {t:Control limits|control limits} come from the process itself: three sigma of the averages. From {n:20.000}, an average range of {n:0.020} and the table constant {n:0.577} follows {n:19.9885} to {n:20.0115}.' },
    { nl: 'Specgrenzen zijn wat de klant nodig heeft, regelgrenzen wat het proces normaal doet. Spec hoort niet op deze kaart: gemiddelden spreiden minder dan losse assen.',
      en: 'Spec limits are what the customer needs, control limits what the process normally does. Spec stays off this chart: averages spread less than single shafts.' },
  ],
  [ // s3 seven up in a row
    { nl: 'Uur na uur vult de kaart zich. Om tien uur {n:20.002}, dan {n:20.004}, {n:20.005} en {n:20.006}.',
      en: 'Hour by hour the chart fills. At ten o’clock {n:20.002}, then {n:20.004}, {n:20.005} and {n:20.006}.' },
    { nl: 'Daarna {n:20.008}, {n:20.009}, en om vier uur {n:20.011}. Alles binnen de grenzen, en ver binnen spec.',
      en: 'Then {n:20.008}, {n:20.009}, and at four o’clock {n:20.011}. All inside the limits, and far inside spec.' },
    { nl: 'Maar zeven keer op rij omhoog gebeurt bijna nooit bij toeval. Het is een trend, en de regel gaat af.',
      en: 'But seven rising in a row hardly ever happens by chance. It is a trend, and the rule fires.' },
    { nl: 'Andere regels: één punt buiten een grens, zeven op rij aan één kant, of twee van drie voorbij twee sigma. Meer regels vangen meer, maar geven ook meer loos alarm.',
      en: 'Other rules: one point outside a limit, seven in a row on one side, or two of three beyond two sigma. More rules catch more, but also give more false alarms.' },
  ],
  [ // s4 stop and look
    { nl: 'Elke kaart hoort een {t:Reactieplan|reactieplan} te hebben: wat doet de operator als een regel afgaat, en wie belt hij?',
      en: 'Every chart needs a {t:Reaction plan|reaction plan}: what does the operator do when a rule fires, and who does he call?' },
    { nl: 'Hij stopt en kijkt naar de wisselplaat, het snijpuntje. Versleten. Om tien over vier zit er een nieuwe in.',
      en: 'He stops and checks the insert, the cutting tip. Worn. At ten past four a new one is in.' },
    { nl: 'Dan de {t:Verdachte delen|verdachte delen}: alles sinds de laatste goede meting. Die gaan apart en worden gecontroleerd.',
      en: 'Then the {t:Suspect parts|suspect parts}: everything since the last good check. They are held and checked.' },
    { nl: 'Geen enkele as buiten spec. Een kaart waar niemand op reageert, is behang.',
      en: 'Not one shaft out of spec. A chart nobody reacts to is wallpaper.' },
  ],
  [ // s5 chasing noise
    { nl: 'Nu een stabiel proces. De operator meet elke as en verzet na elk stuk de correctie met de afwijking van dat stuk.',
      en: 'Now a stable process. The operator measures every shaft and after every part moves the offset by that part’s deviation.' },
    { nl: 'Dat is {t:Overbijsturen|overbijsturen}. Elke afwijking is vooral ruis, dus wie daarop corrigeert, zet er een tweede ruis bovenop.',
      en: 'That is {t:Tampering|tampering}. Each deviation is mostly noise, so correcting for it adds a second noise on top.' },
    { nl: 'Op de kaart: een zigzag van stuk tot stuk, en meer spreiding dan de meetstudie verklaart.',
      en: 'On the chart: a zig-zag from part to part, and more spread than the gauge study explains.' },
    { nl: 'Hij bedoelt het goed. Ik hou hem op nominaal, zegt hij.',
      en: 'He means well. I keep it on nominal, he says.' },
  ],
  [ // s6 the funnel
    { nl: 'Het {t:Trechterexperiment|trechterexperiment} van Deming laat zien waarom. Knikkers vallen door een trechter op een doel.',
      en: 'Deming’s {t:Funnel experiment|funnel experiment} shows why. Marbles drop through a funnel onto a target.' },
    { nl: 'Blijft de trechter stil, dan landen ze in een wolk rond het doel: de gewone spreiding.',
      en: 'If the funnel stays still, they land in a cloud around the target: the ordinary spread.' },
    { nl: 'Verzet je hem na elke worp om de misser te corrigeren, dan stijgt de standaardafwijking met zo’n {n:41} procent.',
      en: 'Move it after every drop to correct the miss, and the standard deviation rises by about {n:41} percent.' },
    { nl: 'De variantie verdubbelt. Dat doet ook de operator die na elk stuk bijstelt. Leg het zo uit, niet als verwijt.',
      en: 'The variance doubles. So does the operator who adjusts after every part. Explain it this way, not as blame.' },
  ],
  [ // s7 only on a signal
    { nl: 'De regel: alleen bijstellen op een signaal van de kaart. Daartussen laat je de machine met rust.',
      en: 'The rule: adjust only on a signal from the chart. In between, leave the machine alone.' },
    { nl: 'Bekende slijtage vang je op met {t:Slijtagecompensatie|slijtagecompensatie}: een geplande, vaste correctie na een vast aantal stuks.',
      en: 'Known wear is handled by {t:Wear compensation|wear compensation}: a planned, fixed offset after a set number of parts.' },
    { nl: 'Was overbijsturen de grootste bron, dan zakt de standaardafwijking na twee weken met ruwweg {n:30} procent; precies {n:29}.',
      en: 'If tampering was the main source, the standard deviation drops by roughly {n:30} percent after two weeks; exactly {n:29}.' },
    { nl: 'Een meting in de machine die de correctie stuurt, moet bijstellen op het gemiddelde van meerdere stuks, nooit op één meting.',
      en: 'An in-machine gauge that sets the offset must adjust on the average of several parts, never on one reading.' },
  ],
  [ // s8 counting instead of measuring
    { nl: 'Kun je alleen tellen, dan zijn er vier kaarten. De {t:p-kaart|p-kaart} zet de fractie afkeur uit, ook als de steekproef steeds anders groot is.',
      en: 'If you can only count, there are four charts. The {t:p chart|p chart} plots the fraction defective, even when the sample size varies.' },
    { nl: 'De {t:np-kaart|np-kaart} telt de afgekeurde stuks in een steekproef van vaste grootte.',
      en: 'The {t:np chart|np chart} counts the defective parts in a sample of fixed size.' },
    { nl: 'Tel je defecten, zoals krassen per paneel, dan een {t:c-kaart|c-kaart} bij even grote eenheden, en een {t:u-kaart|u-kaart} als de grootte wisselt.',
      en: 'If you count defects, such as scratches per panel, use a {t:c chart|c chart} for units of the same size, and a {t:u chart|u chart} when the size varies.' },
    { nl: 'Telkaarten reageren laat. Bij {n:1} procent afkeur en steekproeven van {n:50} ligt de bovengrens op zo’n {n:5.2} procent: twee foute stuks blijven binnen. Meet dus als het kan.',
      en: 'Count charts react late. At {n:1} percent defective and samples of {n:50}, the upper limit is about {n:5.2} percent: two bad parts stay inside. So measure if you can.' },
  ],
  [ // s9 what is in one subgroup
    { nl: 'Tot slot: wat stop je in één steekproef? Een matrijs met {n:4} holtes. Elk uur gaat één stuk uit elke holte samen op de kaart.',
      en: 'Finally: what goes into one subgroup? A mould with {n:4} cavities. Every hour one part from each cavity goes on the chart together.' },
    { nl: 'De R-kaart is breed en geeft nooit een signaal, maar holte {n:3} maakt dunne wanden. De range meet hier het verschil tussen de holtes.',
      en: 'The R chart is wide and never signals, yet cavity {n:3} makes thin walls. The range here measures the difference between the cavities.' },
    { nl: 'Een {t:Rationele subgroep|rationele subgroep} is gemaakt van stuks vlak na elkaar, uit één holte. Dus een eigen kaart per holte.',
      en: 'A {t:Rational subgroup|rational subgroup} is made of parts made close together, from one cavity. So a chart for each cavity.' },
    { nl: 'Bereken de grenzen uit {n:20} tot {n:25} subgroepen in een stabiele periode, en zet ze vast.',
      en: 'Work out the limits from {n:20} to {n:25} subgroups in a stable period, then freeze them.' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move: the shares come from the
// resolved captions (beatStarts), as the player and the stage read them.
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
const latheSource = lean(readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, ''));
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, prismOf, disc, sphereOf, arcOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.sp-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.sp-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.sp-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.sp-glass{fill:var(--anatomy-shade-1);fill-opacity:.28;stroke:var(--anatomy-lo);stroke-width:.6}
.sp-cave{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
.sp-white{fill:var(--anatomy-top);stroke:var(--anatomy-lo);stroke-width:.6}
.sp-paper{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:.6}
.sp-tag{fill:var(--fp-accent);stroke:none}
.sp-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.sp-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.sp-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.sp-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:500}
.sp-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.sp-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.sp-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.sp-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sp-dot{fill:var(--anatomy-hi)}
.sp-hollow{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.sp-acc{fill:var(--fp-accent);stroke:none}
.sp-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.sp-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.sp-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.sp-marble{fill:var(--anatomy-hi);stroke:var(--anatomy-shade-0);stroke-width:.5}
.sp-marble[data-new]{fill:var(--fp-accent)}
.sp-ink{stroke:var(--anatomy-hi);stroke-width:.9;fill:none;stroke-linecap:round}
.sp-inkdot{fill:var(--anatomy-hi)}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.sp-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .sp-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .sp-lim{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .sp-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .sp-paper{stroke:var(--fp-accent);stroke-width:1.2}
[data-cue][data-on] .sp-white{stroke:var(--fp-accent);stroke-width:1.2}
`;

const label = {
  nl: 'Vier plekken naast elkaar. Een CNC-draaibank die assen draait: een onderkast met een spaanlade, een behuizing met een venster waarachter de klauwplaat, de as en de revolver met de wisselplaat, een bedieningspaneel en een signaalzuil. Een meettafel met een micrometer op een standaard, een bakje voor de vijf assen van de steekproef, een doosje wisselplaten en op de vloer een quarantainekrat met een label. Een SPC-bord op poten met een regelkaart en een opgeprikt reactieplan. Een tafel met het trechterexperiment: een trechter aan een standaard boven een papieren doel, en knikkers. Grafieken, elk gemarkeerd als voorbeeld, tonen de X-bar- en R-kaart, de regels, een kaart van losse stuks, de slijtagecompensatie, de vier telkaarten en een matrijs met vier holtes.',
  en: 'Four places side by side. A CNC lathe turning shafts: a base cabinet with a chip drawer, an enclosure with a window showing the chuck, the shaft and the turret with its insert, a control panel and a signal tower. A measuring bench with a micrometer on a stand, a tray for the five shafts of the subgroup, a box of inserts and, on the floor, a tagged quarantine crate. An SPC board on legs with a control chart and a pinned reaction plan. A table with the funnel experiment: a funnel on a stand over a paper target, and marbles. Charts, each marked as an example, show the X-bar and R chart, the rules, a chart of single parts, wear compensation, the four count charts and a mould with four cavities.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

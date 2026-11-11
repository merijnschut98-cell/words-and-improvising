// Dev tool, not shipped. Builds the explainer film "Van maat tot spreiding /
// From dimension to spread" for three lessons of Kwaliteit: de basis:
// eng.quality.tolerance (level 1 of Toleranties en meten), eng.quality.variation
// (level 1 of Spreiding en procesgeschiktheid) and eng.quality.capability
// (level 2 of the same topic).
//
//   node films/eng.quality.tolerance/build.mjs            build the page
//   node films/eng.quality.tolerance/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.quality.tolerance.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// Three places on one floor, left to right. A CNC lathe that turns shafts: a
// base cabinet with a chip drawer, an enclosure with a window (the chuck, the
// shaft, the turret with its insert inside), a control panel with the offset
// knob and a signal tower. A measuring bench: a micrometer on its stand, a tray
// of finished shafts, a box of inserts, and a red-tagged quarantine crate on
// the floor for the nonconforming parts. A spread rack on a table: a back
// panel with nineteen lanes behind a glass front, a ruler along its ledge, and
// two gates standing in front of the glass at the spec limits. Every measured
// part drops into the lane of its size, so the stacks grow into the bell curve.
// The drawing, the spec line, the histogram, the run chart, the spread meter
// and the capability charts sit in stage space over the drawing; every chart
// is labelled "voorbeeld".
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
// text by defineFilm. Sources as in the lessons: ISO 2768-1 class m (±0,2 mm
// for over 6 up to 30 mm), the 68–95–99,7 rule of the normal distribution,
// Cp = (USL − LSL) / 6σ and Cpk = min(USL − μ, μ − LSL) / 3σ (AIAG SPC manual),
// and the ppm outside a centred normal process at ±3σ, ±4σ, ±5σ.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const r3 = (v) => Math.round(v * 1000) / 1000;
// tolerance: Ø20 ±0,05 → 19,95–20,05, a field of 0,10; Ø12 +0,018/0 → 12,000–12,018
assert(near(20 - 0.05, 19.95, 1e-9) && near(20 + 0.05, 20.05, 1e-9) && near(2 * 0.05, 0.1, 1e-9), 'Ø20 ±0,05');
assert(near(12 + 0.018, 12.018, 1e-9), 'Ø12 +0,018/0');
// 15 of 500 at 12,021: 3 µm over, 3 %; 15 × €4,50 = €67,50; sorting 500 × €0,80 = €400, plus €250
assert(r3(12.021 - 12.018) === 0.003 && 15 / 500 === 0.03, '15 of 500 = 3 %');
assert(near(15 * 4.5, 67.5, 1e-9) && near(500 * 0.8, 400, 1e-9), '€67,50 and €400');
assert((400 + 250) / 67.5 > 9 && (400 + 250) / 67.5 < 11, 'about ten times the cost at the customer');
// variation: mean 20,003, σ 0,008 → 3σ 0,024 → 19,979–20,027, inside 19,95–20,05
const V = { mean: 20.003, sd: 0.008 };
assert(near(3 * V.sd, 0.024, 1e-9) && near(V.mean - 3 * V.sd, 19.979, 1e-9) && near(V.mean + 3 * V.sd, 20.027, 1e-9), '19,979–20,027');
assert(V.mean - 3 * V.sd > 19.95 && V.mean + 3 * V.sd < 20.05, 'well inside spec');
// the normal distribution: Φ(1) − Φ(−1) ≈ 68 %, 2σ ≈ 95 %, 3σ ≈ 99,7 %
const erf = (x) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
assert(Math.round((Phi(1) - Phi(-1)) * 100) === 68 && Math.round((Phi(2) - Phi(-2)) * 100) === 95 && Math.round((Phi(3) - Phi(-3)) * 1000) === 997, '68 / 95 / 99,7');
// tampering: adjusting by the full last deviation adds a second noise: σ × √2, about +40 %
assert(Math.round((Math.SQRT2 - 1) * 10) * 10 === 40, 'about +40 %');
// capability: Ø30 +0,04/0, mean 30,026, σ 0,004 → Cp 1,67, Cpk 1,17; offset −0,006 → Cpk 1,67
const CAP = { lsl: 30, usl: 30.04, mean: 30.026, sd: 0.004 };
const cp = (CAP.usl - CAP.lsl) / (6 * CAP.sd);
const cpk = (m) => Math.min(CAP.usl - m, m - CAP.lsl) / (3 * CAP.sd);
assert(near(cp, 1.67, 0.005) && near(cpk(CAP.mean), 1.17, 0.005), 'Cp 1,67, Cpk 1,17');
assert(near(r3(CAP.mean - 0.006), 30.02, 1e-9) && near(cpk(30.02), 1.67, 0.005), 'offset −0,006 → Cpk 1,67');
// ppm outside a centred process: Cpk 1,33 (±4σ) ≈ 63, 1,0 (±3σ) ≈ 2.700, 1,67 (±5σ) < 1
assert(Math.round(2 * (1 - Phi(4)) * 1e6) === 63 && Math.round(2 * (1 - Phi(3)) * 1e6 / 100) * 100 === 2700 && 2 * (1 - Phi(5)) * 1e6 < 1, 'ppm 63 / 2.700 / < 1');

// The parts in the rack: a sample whose values are the normal quantiles (so it
// shows the bell without luck), each dropped into the lane of its size; the
// order of arrival is a seeded shuffle, the same for every build.
const invPhi = (p) => { let lo = -8; let hi = 8; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
const LANES = 19;
const MID = 9;
function stack(n, mean, sd, centre, bin, seed) {
  const vals = Array.from({ length: n }, (_, i) => mean + sd * invPhi((i + 0.5) / n));
  let s = seed >>> 0;
  const u = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = vals.length - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [vals[i], vals[j]] = [vals[j], vals[i]]; }
  const lanes = vals.map((v) => MID + Math.round((v - centre) / bin));
  const counts = Array(LANES).fill(0);
  lanes.forEach((l) => { assert(l >= 0 && l < LANES, 'a part outside the rack'); counts[l]++; });
  assert(Math.max(...counts) <= 14, 'a stack fits the rack');
  return lanes;
}
// variation: 25 shafts, lanes 0,006 wide around 20,000; the gates at ±0,05 = ±8,33 lanes
const BIN4 = 0.006;
const S4 = stack(25, V.mean, V.sd, 20, BIN4, 7);
const TAMP = stack(25, 20, V.sd * Math.SQRT2, 20, BIN4, 11);
// capability: 50 bores, lanes 0,0028 wide around 30,020; the gates at ±0,020 = ±7,14 lanes
const BIN7 = 0.0028;
const S7 = stack(50, CAP.mean, CAP.sd, 30.02, BIN7, 5);

// ---------------------------------------------------------------- the world
// x to the right along the floor (lathe at -x, the rack at +x), y toward the
// viewer, z up; the floor is z = 0. Units of about 5 mm.
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
const FT = 34; // rack table top
const LW = 8; // lane width
const LX = (i) => 40 + (i - MID) * LW;
const PR = 3.5; // part radius (lanes 8 wide, a gap of 1 between stacks)
const PITCH = 7.2;
const PZ0 = FT + 4 + PR; // centre of the bottom part
const PY = [-20.6, -12.6]; // a part's length along y
const KNOB = { x: -222, z: 50, y: 16, r: 3 };
const C = {
  LZ, LY, CHUCK, SHAFT, BT, TRAY, SHY, SHX, CRATE, CRATE_H, FT, LW, MID, LANES, PZ0, PITCH, KNOB,
  S4, TAMP, S7, BIN4, BIN7, V, CAP,
  GATE4: 0.05 / BIN4, GATE7: 0.02 / BIN7,
};

const FIT = [[-336, -44, 0], [134, 40, 0], [-336, -44, 120], [134, -30, 140], [-336, 48, 0], [134, 48, 0]];
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
const alongY = (x, z, y0, y1, r, style = {}, steps) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, Z, X), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'tl-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
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
  card(BASE.y + BASE.d, -252, -232, 16, 30, 'tl-glass'),
  rules(-250, BASE.y + BASE.d, 26, [8, 12, 6], 3),
  // the enclosure: drawn whole, its window shows the inside drawn over it
  box(ENC, 42, 102, { inner: seam(ENC, 98, 3) + seam(ENC, 46, 3) }, 0.6, 2),
  screws(ENC, 102, 3),
  `<path class="tl-cave" d="${faceY(ENC_F, WIN.x0, WIN.x1, WIN.z0, WIN.z1)}"/>`,
].join('');
// inside, seen through the window: the headstock, the chuck with its jaws, the
// shaft, the turret with the insert, the coolant nozzle and the chip pan
const IN_Y = ENC_F - 0.4;
const latheInside = [
  box({ x: -318, y: -26, w: 14, d: 30, r: 0.6 }, 50, 92, { tone: 'lo' }, 0.4, 1),
  alongX(LY, LZ, -304, CHUCK.x0, 11.4, { tone: 'lo' }, 28),
  alongX(LY, LZ, CHUCK.x0, CHUCK.x1, CHUCK.r, { tone: 'mid', crease: 'lo' }, 28)
    + [0, 1, 2].map((i) => {
      const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
      const cy = LY + Math.cos(a) * 5.6;
      const cz = LZ + Math.sin(a) * 5.6;
      return box({ x: CHUCK.x1, y: cy - 1.4, w: 3, d: 2.8, r: 0.3 }, cz - 1.6, cz + 1.6, { tone: 'hi', crease: 'lo' }, 0, 1);
    }).join(''),
  alongX(LY, LZ, CHUCK.x1 + 3, SHAFT.x1, SHAFT.r, { tone: 'hi', crease: 'lo' }, 20)
    + L(G.arcOf(G.frameOf([0, LY, LZ], X, Y, Z), SHAFT.x1 - 9, SHAFT.r, P), { tone: 'lo' }),
  // the turret on its slide
  box({ x: -278, y: -30, w: 22, d: 10, r: 0.6 }, 54, 60, { tone: 'lo' }, 0.3, 1),
  box({ x: -276, y: -28, w: 18, d: 12, r: 1 }, 60, 70, {}, 0.4, 1),
  box({ x: -270, y: -16, w: 6, d: 4, r: 0.3 }, 63, 69, { tone: 'lo' }, 0, 1),
  box({ x: -268.5, y: -12.6, w: 3, d: 2.4, r: 0.2 }, 66, 69, { tone: 'hi', crease: 'lo' }, 0, 1),
  k.wireSvg(at([-284, -28, 92]), at([-266, -12, 74]), { via: [at([-284, -20, 88])], tone: 'mid', size: 0.8, ends: 'both' }),
  g('chips', ''),
].join('');
// the window frame and glass, the door handle and a label plate
const latheFront = [
  `<path class="tl-glass" d="${faceY(IN_Y, WIN.x0, WIN.x1, WIN.z0, WIN.z1)}"/>`,
  L(k.pathOf([[WIN.x0, ENC_F, WIN.z0], [WIN.x1, ENC_F, WIN.z0], [WIN.x1, ENC_F, WIN.z1], [WIN.x0, ENC_F, WIN.z1]].map(at), true), { tone: 'mid' }),
  L(k.pathOf([[WIN.x0 - 3, ENC_F, WIN.z0 - 3], [WIN.x1 + 3, ENC_F, WIN.z0 - 3], [WIN.x1 + 3, ENC_F, WIN.z1 + 3], [WIN.x0 - 3, ENC_F, WIN.z1 + 3]].map(at), true), { tone: 'faint' }),
  Dt([[WIN.x0 - 1.5, ENC_F, WIN.z0 - 1.5], [WIN.x1 + 1.5, ENC_F, WIN.z0 - 1.5], [WIN.x0 - 1.5, ENC_F, WIN.z1 + 1.5], [WIN.x1 + 1.5, ENC_F, WIN.z1 + 1.5]].map(at), { size: 0.45 }),
  box({ x: -246, y: ENC_F, w: 3, d: 3, r: 0.6 }, 58, 86, { tone: 'hi', crease: 'lo' }, 0, 1),
  card(ENC_F, -300, -270, 44.5, 48.5),
  rules(-298, ENC_F, 47.6, [16, 22], 1.6),
].join('');
// the control panel: screen, keys and, low on its face, the offset knob with
// its scale (the knob's index mark is drawn live)
const PANEL = { x: -230, y: 4, w: 16, d: 12, r: 0.8 };
const PF = PANEL.y + PANEL.d;
const knob = (() => {
  const { x, z, r } = KNOB;
  let out = alongY(x, z, PF, PF + 1.2, r + 1.2, { tone: 'lo' }, 22);
  out += alongY(x, z, PF + 1.2, PF + 3.6, r, { tone: 'hi', crease: 'lo' }, 22);
  // the knurl as short lines on the rim, and the scale on the panel around it
  out += L(Array.from({ length: 9 }, (_, i) => {
    const a = -Math.PI * 0.75 + (i * Math.PI * 1.5) / 8;
    const r0 = r + 2;
    const r1 = r + (i % 4 === 0 ? 3.2 : 2.6);
    return k.segment([x + Math.sin(a) * r0, PF + 0.05, z + Math.cos(a) * r0], [x + Math.sin(a) * r1, PF + 0.05, z + Math.cos(a) * r1], P);
  }).join(''), { tone: 'mid', free: true });
  return out + g('knobMark', '');
})();
const latheSide = [
  box({ x: -224, y: 6, w: 4, d: 4, r: 0.4 }, 102, 106, { tone: 'lo' }, 0, 1),
  box(PANEL, 42, 96, { inner: seam(PANEL, 92, 2) + seam(PANEL, 46, 2) }, 0.4, 1),
  card(PF, PANEL.x + 2, PANEL.x + PANEL.w - 2, 74, 92, 'tl-screen'),
  rules(PANEL.x + 4, PF + 0.1, 88, [8, 6, 9, 5], 3.4),
  ...[0, 1, 2].map((r) => [0, 1, 2].map((c) => card(PF, PANEL.x + 2.4 + c * 4, PANEL.x + 5.4 + c * 4, 66 - r * 4, 68.6 - r * 4)).join('')),
  post(PANEL.x + PANEL.w - 4, PANEL.y + PANEL.d - 3, 1.8, 96, 97.6, { tone: 'hi', crease: 'lo' }, 14),
  cue('knob', knob),
].join('');
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
  + [0, 1, 2, 3, 4].map((i) => alongX(SHY[i], BT + 4.4, SHX[0], SHX[1], 2.2, { tone: 'hi', crease: 'lo' }, 18)).join('');
const inserts = (() => {
  const b = { x: -84, y: -26, w: 16, d: 12, r: 0.6 };
  return box(b, BT, BT + 4, { tone: 'lo' }, 0.3, 1) + box(k.insetPlan(b, 1), BT + 4, BT + 5, { tone: 'hi', crease: 'lo' }, 0.2, 1)
    + L([0, 1, 2].map((i) => k.lineOnTop([b.x + 3, b.y + 3 + i * 3], [b.x + 3 + [9, 6, 8][i], b.y + 3 + i * 3], BT + 5, P)).join(''), { tone: 'lo', free: true });
})();
// the quarantine crate on the floor, its slats, its tag and the bushes put in it
const crate = (() => {
  const c = CRATE;
  let out = halo(k.insetPlan(c, -2), 0, 2) + box(c, 0, CRATE_H, { tone: 'lo', inner: seam(c, 6, 2) + seam(c, 12, 2) }, 0.4, 2);
  out += L(k.planOutline(k.insetPlan(c, 1.4), CRATE_H, P, 2), { tone: 'mid' });
  out += `<path class="tl-cave" d="${k.pathOf(k.roundedPlan(k.insetPlan(c, 1.6), 2).map(([x, y]) => at([x, y, CRATE_H])), true)}"/>`;
  out += g('crateIn', '');
  out += `<path class="tl-tag" d="${faceY(c.y + c.d + 0.2, c.x + 22, c.x + 32, 5, 13)}"/>` + rules(c.x + 23.5, c.y + c.d + 0.3, 10.4, [6, 4], 2);
  return out;
})();

// ---------------------------------------------------------------- the spread rack
const TBL = { x: -54, y: -32, w: 184, d: 52, r: 1.5 };
const RX0 = LX(0) - LW / 2 - 2; // the panel's inner edges
const RX1 = LX(LANES - 1) + LW / 2 + 2;
const RTOP = PZ0 - PR + 14 * PITCH + 3; // room for fourteen parts
const GY = -7; // the gates' posts, in front of the glass
const rackBack = [
  halo(k.insetPlan(TBL, -3), 0, 2),
  ...k.corners(TBL, 5).map(([x, y]) => box({ x: x - 2, y: y - 2, w: 4, d: 4, r: 0.4 }, 0, FT - 4, { tone: 'lo' }, 0.2, 1)),
  box({ x: TBL.x + 4, y: TBL.y + 4, w: TBL.w - 8, d: TBL.d - 8, r: 0.6 }, 8, 10, { tone: 'lo', crease: 'none' }, 0, 1),
  box(TBL, FT - 4, FT, { inner: seam(TBL, FT - 2, 3) }, 0.5, 3),
  screws(TBL, FT, 3),
  // the base tray the stacks stand in, and the back panel with its lane lines
  box({ x: RX0 - 4, y: -26, w: RX1 - RX0 + 8, d: 16, r: 0.8 }, FT, FT + 4, { tone: 'lo' }, 0.3, 1),
  box({ x: RX0 - 4, y: -26, w: RX1 - RX0 + 8, d: 4, r: 0.4 }, FT + 4, RTOP, { inner: seam({ x: RX0 - 4, y: -26, w: RX1 - RX0 + 8, d: 4 }, RTOP - 4, 2) }, 0.4, 1),
  L(Array.from({ length: LANES + 1 }, (_, i) => k.segment([LX(i) - LW / 2, -21.9, FT + 4.5], [LX(i) - LW / 2, -21.9, RTOP - 6], P)).join(''), { tone: 'faint' }),
  L(k.segment([RX0, -21.9, RTOP - 6], [RX1, -21.9, RTOP - 6], P), { tone: 'faint' }),
  // the left frame post stands behind the stacks
  box({ x: RX0 - 4, y: -24, w: 3, d: 16, r: 0.4 }, FT + 4, RTOP + 2, { tone: 'mid', crease: 'lo' }, 0.2, 1),
].join('');
const rackFront = [
  // the glass and its frame: the right post, the top bar and the ledge with its ruler
  `<path class="tl-glass" d="${faceY(-9.4, RX0 - 1, RX1 + 1, FT + 4, RTOP + 1)}"/>`,
  L(Array.from({ length: LANES + 1 }, (_, i) => k.segment([LX(i) - LW / 2, -9.3, FT + 5], [LX(i) - LW / 2, -9.3, FT + 9], P)).join(''), { tone: 'lo' }),
  box({ x: RX1 + 1, y: -24, w: 3, d: 16, r: 0.4 }, FT + 4, RTOP + 2, { tone: 'mid', crease: 'lo' }, 0.2, 1),
  box({ x: RX0 - 4, y: -24, w: RX1 - RX0 + 8, d: 16, r: 0.6 }, RTOP + 2, RTOP + 5, { tone: 'mid', crease: 'lo' }, 0.3, 1),
  screws({ x: RX0 - 4, y: -24, w: RX1 - RX0 + 8, d: 16 }, RTOP + 5, 1.6),
  box({ x: RX0 - 4, y: -10, w: RX1 - RX0 + 8, d: 9, r: 0.6 }, FT, FT + 5, { tone: 'lo', crease: 'lo' }, 0.3, 1),
  L(Array.from({ length: LANES }, (_, i) => k.lineOnTop([LX(i), -8.6], [LX(i), i === MID ? -4.2 : i % 3 === 0 ? -5.6 : -6.8], FT + 5, P)).join(''), { tone: 'mid' }),
  // a label plate on the ledge's front
  card(-0.9, RX1 - 22, RX1 - 4, FT + 1, FT + 4),
  rules(RX1 - 20, -0.8, FT + 3.2, [10, 13], 1.4),
].join('');
// a gate: a post on the ledge, a cap and a flag; drawn at the middle lane and
// moved along x to its spec limit
const gate = (side) => {
  const x = LX(MID);
  const fx = side < 0 ? [x - 13, x - 1.2] : [x + 1.2, x + 13];
  return halo({ x: x - 2.4, y: GY - 2.4, w: 4.8, d: 4.8, r: 1 }, FT + 5, 1)
    + box({ x: x - 2, y: GY - 2, w: 4, d: 4, r: 0.6 }, FT + 5, FT + 7, { tone: 'lo' }, 0.2, 1)
    + box({ x: x - 1.1, y: GY - 1.1, w: 2.2, d: 2.2, r: 0.3 }, FT + 7, RTOP + 14, { tone: 'hi', crease: 'lo' }, 0, 1)
    + post(x, GY, 1.6, RTOP + 14, RTOP + 16, { tone: 'hi', crease: 'lo' }, 12)
    + card(GY, fx[0], fx[1], RTOP + 6, RTOP + 13, 'tl-flag')
    + rules(fx[0] + 2, GY + 0.1, RTOP + 10.8, [7, 5], 2.2);
};
const rack = rackBack + g('parts', '') + g('drop', '') + rackFront
  + cue('spec', g('gateL', gate(-1)) + g('gateR', gate(1)));

// One part, a short turned shaft lying along y, at the world origin; the stage
// places copies of it in the lanes.
const PART = alongY(0, 0, PY[0], PY[1], PR, { tone: 'hi', crease: 'lo' }, 18)
  + L(G.arcOf(G.frameOf([0, 0, 0], Y, Z, X), PY[1] - 1.4, PR, P), { tone: 'lo' });

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('dwg', g('dwgIn', '') + cue('nom', g('dNom', '')) + cue('tol', g('dTol', '')) + cue('spec', g('dSpec', '')) + cue('stamp', g('dStamp', '')) + g('dCost', '')),
  g('out', g('oLine', '') + cue('nc', g('oOut', '')) + cue('form', g('oForm', '')) + g('oCost', '')),
  g('hist', g('hBase', '') + cue('curve', g('hCurve', '')) + cue('mean', g('hMean', '')) + cue('sigma', g('hSig', '')) + cue('cp', g('hCp', '')) + cue('cpk', g('hCpk', '')) + cue('ppm', g('hPpm', ''))),
  g('run', g('rBase', '') + cue('common', g('rCom', '')) + cue('jump', g('rJump', ''))),
  g('tamp', ''),
  g('ppk', g('pBase', '') + cue('ppk', g('pTot', ''))),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('lathe', latheBack + cue('lathe', latheInside) + latheFront + latheSide + tower),
  g('bench', bench + micro + tray + inserts),
  cue('nc', crate),
  cue('rack', rack),
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
C.PART = compact(PART);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round(y * 10) / 10, w]; };
// The rack beside a chart panel (stage x 312 on) or beside the wide drawing
// panel (stage x 232 on), and on its own beside the small spread meter.
const RACK = [40, -14, 80];
const CAM = [
  { from: cam([-100, 0, 60], 640), to: cam(RACK, 530, 114), a: 0.08, b: 0.3 },
  { from: cam(RACK, 530, 114), to: cam(RACK, 500, 114) },
  { from: cam([-105, 14, 28], 290, 110), to: cam([-100, 20, 22], 250, 110) },
  { from: cam([-120, 0, 66], 560), to: cam(RACK, 440, 154), a: 0.2, b: 0.45 },
  { from: cam([-262, 4, 82], 250, 150), to: cam([-258, 4, 84], 230, 150) },
  { from: cam([-226, 10, 62], 200, 200), to: cam([40, -14, 88], 380, 210), a: 0.57, b: 0.67 },
  { from: cam(RACK, 440, 154), to: cam(RACK, 420, 154) },
  { from: cam(RACK, 420, 154), to: cam(RACK, 410, 154) },
  { from: cam([-100, 0, 60], 640, 150), to: cam([-100, 0, 60], 610, 150) },
];

// ---------------------------------------------------------------- the film
const TOL = 'eng.quality.tolerance';
const VAR = 'eng.quality.variation';
const CPB = 'eng.quality.capability';
const DUR = [30, 28, 30, 32, 30, 28, 30, 32, 28];
C.dur = DUR;
const spec = {
  id: 'eng.quality.tolerance',
  title: { nl: 'Van maat tot spreiding', en: 'From dimension to spread' },
  lessons: [TOL, VAR, CPB],
  scenes: [
    {
      id: 's1', lesson: TOL, level: 1, dur: DUR[0], still: 0.8, title: { nl: 'Maat en grenzen', en: 'Size and limits' },
      beats: [
        { nl: '{t:Nominale maat|Nominale maat}: de doelwaarde op de tekening. Ø{n:20} is rond, {n:20} mm doorsnee.', en: '{t:Nominal|Nominal}: the target value on the drawing. Ø{n:20} is round, {n:20} mm across.', cue: { 'Nominale maat': 'nom' } },
        { nl: '{t:Tolerantie|Tolerantie}: hoeveel het mag afwijken. Ø20 ±{n:0.05} geeft een veld van {n:0.10} mm.', en: '{t:Tolerance|Tolerance}: how far it may deviate. Ø20 ±{n:0.05} gives a band of {n:0.10} mm.', cue: { Tolerantie: 'tol' } },
        { nl: 'De twee {t:Specgrenzen|specgrenzen}: ondergrens {n:19.95}, bovengrens {n:20.05}. Daartussen is goed.', en: 'The two {t:Spec limits|spec limits}: lower {n:19.95}, upper {n:20.05}. Anything between is good.', cue: { Specgrenzen: 'spec' } },
        { nl: 'Ongelijk kan ook: Ø{n:12} +{n:0.018}/0 loopt van {n:12.000} tot {n:12.018}.', en: 'It can be uneven: Ø{n:12} +{n:0.018}/0 runs from {n:12.000} to {n:12.018}.', cues: ['spec', 'tol'] },
      ],
    },
    {
      id: 's2', lesson: TOL, level: 1, dur: DUR[1], still: 0.5, title: { nl: 'De stempel', en: 'The title block' },
      beats: [
        { nl: 'Geen eigen tolerantie? Dan geldt de {t:Algemene tolerantie|algemene tolerantie} in de stempel.', en: 'No tolerance of its own? Then the {t:General tolerance|general tolerance} in the title block applies.', cue: { 'Algemene tolerantie': 'stamp' } },
        { nl: 'Vaak ISO 2768-m: ±{n:0.2} mm voor maten boven {n:6} tot en met {n:30} mm.', en: 'Often ISO 2768-m: ±{n:0.2} mm for sizes over {n:6} up to {n:30} mm.', cues: ['stamp'] },
        { nl: 'Nauwer kost geld. Een lagerzitting ±{n:0.01}, een gat in een afdekplaat ±0,2.', en: 'Tighter costs money. A bearing seat ±{n:0.01}, a hole in a cover plate ±0.2.', cues: [] },
        { nl: 'De tolerantie volgt de functie. Een decimaal “voor de zekerheid” betaalt de productie.', en: 'The tolerance follows the function. A decimal “to be safe” is paid for by production.', cues: [] },
      ],
    },
    {
      id: 's3', lesson: TOL, level: 1, dur: DUR[2], still: 0.6, title: { nl: 'Buiten spec', en: 'Out of spec' },
      beats: [
        { nl: '{n:500} bussen: {n:15} boringen meten {n:12.021}. Dat is {n:3}% buiten spec.', en: '{n:500} bushes: {n:15} bores measure {n:12.021}. That is {n:3}% out of spec.', cues: [] },
        { nl: '{t:Afwijkend|Afwijkend}: buiten de grenzen. Afkeuren, nabewerken, of zo gebruiken met akkoord.', en: '{t:Nonconforming|Nonconforming}: outside the limits. Scrap, rework, or use as is with approval.', cue: { Afwijkend: 'nc' } },
        { nl: 'Een {t:Deviatie|deviatie}: schriftelijk akkoord van de klant om ze toch te gebruiken.', en: 'A {t:Deviation|deviation}: the customer’s written approval to use them anyway.', cue: { Deviatie: 'form' } },
        { nl: 'Bij de machine {n:15} × €{n:4.50} = €{n:67.50}. Bij de klant zo’n tien keer zoveel.', en: 'At the machine {n:15} × €{n:4.50} = €{n:67.50}. At the customer about ten times as much.', cues: [], read: { nl: 'klant: €{n:400} + €{n:250} + 8D', en: 'customer: €{n:400} + €{n:250} + 8D' } },
      ],
    },
    {
      id: 's4', lesson: VAR, level: 1, dur: DUR[3], still: 0.85, title: { nl: 'Spreiding', en: 'Variation' },
      beats: [
        { nl: 'Geen twee assen zijn gelijk. Elke gemeten as gaat in het vak van zijn maat.', en: 'No two shafts are the same. Each measured shaft goes into the lane of its size.', cues: ['rack'] },
        { nl: 'Het {t:Gemiddelde|gemiddelde}: waar het proces zit. Van deze {n:25} assen {n:20.003}.', en: 'The {t:Mean|mean}: where the process sits. For these {n:25} shafts {n:20.003}.', cue: { Gemiddelde: 'mean' } },
        { nl: 'De {t:Standaardafwijking|standaardafwijking} σ: hoe breed het spreidt. Hier {n:0.008} mm.', en: 'The {t:Standard deviation|standard deviation} σ: how wide it spreads. Here {n:0.008} mm.', cue: { Standaardafwijking: 'sigma' } },
        { nl: 'De {t:Normale verdeling|normale verdeling}: {n:68}% binnen 1σ, {n:95}% binnen 2σ, {n:99.7}% binnen 3σ.', en: 'The {t:Normal distribution|normal distribution}: {n:68}% within 1σ, {n:95}% within 2σ, {n:99.7}% within 3σ.', cue: { 'Normale verdeling': 'curve' }, read: { nl: '±3σ: {n:19.979} tot {n:20.027}', en: '±3σ: {n:19.979} to {n:20.027}' } },
      ],
    },
    {
      id: 's5', lesson: VAR, level: 1, dur: DUR[4], still: 0.8, title: { nl: 'Gewoon of speciaal', en: 'Common or special' },
      beats: [
        { nl: '{t:Gewone oorzaak|Gewone oorzaak}: vele kleine bronnen die er altijd zijn. Materiaal, warmte, speling.', en: '{t:Common cause|Common cause}: many small sources that are always there. Material, heat, play.', cue: { 'Gewone oorzaak': 'common' } },
        { nl: 'Kleiner maken kan alleen door het systeem te veranderen: machine, opspanning, methode.', en: 'Only changing the system makes it smaller: machine, fixture, method.', cues: ['common'] },
        { nl: '{t:Speciale oorzaak|Speciale oorzaak}: maandag 06:00 gemiddeld {n:20.025}, om 07:00 weer {n:20.005}.', en: '{t:Special cause|Special cause}: Monday 06:00 a mean of {n:20.025}, at 07:00 back to {n:20.005}.', cue: { 'Speciale oorzaak': 'jump' } },
        { nl: 'Een koude machine. De oplossing: {n:20} minuten opwarmen, niet aan de offsets draaien.', en: 'A cold machine. The fix: a {n:20}-minute warm-up, not turning the offsets.', cues: ['jump'] },
      ],
    },
    {
      id: 's6', lesson: VAR, level: 1, dur: DUR[5], still: 0.8, title: { nl: 'Bijsturen op ruis', en: 'Chasing noise' },
      beats: [
        { nl: 'Een stabiel proces. De operator draait na elke as de offset bij met de laatste afwijking.', en: 'A stable process. After every shaft the operator turns the offset by the last deviation.', cues: ['knob'] },
        { nl: '{t:Tampering|Tampering} (overbijsturen): bijsturen op ruis. Er komt een tweede ruis bovenop.', en: '{t:Tampering|Tampering}: chasing noise. A second noise lands on top of the first.', cue: { Tampering: 'knob' } },
        { nl: 'De stapels worden breder: zo’n {n:40}% meer spreiding.', en: 'The stacks get wider: about {n:40}% more spread.', cues: ['rack'] },
        { nl: 'Eerst vragen: is er iets veranderd, of is dit gewoon hoe breed het proces is?', en: 'Ask first: did something change, or is this just how wide the process is?', cues: [] },
      ],
    },
    {
      id: 's7', lesson: CPB, level: 2, dur: DUR[6], still: 0.75, title: { nl: 'Past het?', en: 'Does it fit?' },
      beats: [
        { nl: '{t:Procesgeschiktheid|Procesgeschiktheid}: past de spreiding van het proces in de tolerantie?', en: '{t:Capability|Capability}: does the spread of the process fit the tolerance?', cue: { Procesgeschiktheid: 'rack' } },
        { nl: 'Boring Ø{n:30} +{n:0.04}/0. {n:50} delen: gemiddeld {n:30.026}, σ {n:0.004}.', en: 'Bore Ø{n:30} +{n:0.04}/0. {n:50} parts: a mean of {n:30.026}, σ {n:0.004}.', cues: ['spec'], read: { nl: 'grenzen {n:30.000} en {n:30.040}', en: 'limits {n:30.000} and {n:30.040}' } },
        { nl: '{t:Cp|Cp} = tolerantie gedeeld door 6σ: {n:0.040} / {n:0.024} = {n:1.67}.', en: '{t:Cp|Cp} = tolerance divided by 6σ: {n:0.040} / {n:0.024} = {n:1.67}.', cue: { Cp: 'cp' } },
        { nl: 'Cp kijkt alleen naar de breedte, alsof het proces precies in het midden zit.', en: 'Cp looks only at the width, as if the process sat exactly in the middle.', cues: ['cp'] },
      ],
    },
    {
      id: 's8', lesson: CPB, level: 2, dur: DUR[7], still: 0.6, title: { nl: 'Waar het nu zit', en: 'Where it sits now' },
      beats: [
        { nl: '{t:Cpk|Cpk}: van het gemiddelde tot de dichtstbijzijnde grens, gedeeld door 3σ.', en: '{t:Cpk|Cpk}: from the mean to the nearest limit, divided by 3σ.', cue: { Cpk: 'cpk' } },
        { nl: '({n:30.040} − {n:30.026}) / {n:0.012} = {n:1.17}. Te dicht tegen de bovengrens.', en: '({n:30.040} − {n:30.026}) / {n:0.012} = {n:1.17}. Too close to the upper limit.', cues: ['cpk'] },
        { nl: 'Eén offset van −{n:0.006}: gemiddeld {n:30.020}, Cpk 1,67. Geen investering.', en: 'One offset of −{n:0.006}: a mean of {n:30.020}, Cpk 1.67. No investment.', cues: ['cpk', 'rack'] },
        { nl: 'Doel {n:1.33}: gecentreerd zo’n {n:63} {t:ppm|ppm} buiten spec. Cpk {n:1.0}: zo’n {n:2700} ppm.', en: 'Target {n:1.33}: centred, about {n:63} {t:ppm|ppm} out of spec. Cpk {n:1.0}: about {n:2700} ppm.', cue: { ppm: 'ppm' } },
      ],
    },
    {
      id: 's9', lesson: CPB, level: 2, dur: DUR[8], still: 0.6, title: { nl: 'Over dagen', en: 'Over days' },
      beats: [
        { nl: 'Cp en Cpk gebruiken de korte termijn: kleine groepjes delen direct na elkaar.', en: 'Cp and Cpk use the short term: small groups of parts made one after another.', cues: [] },
        { nl: '{t:Ppk|Ppk} gebruikt de totale spreiding van alle delen, ook het verloop over dagen.', en: '{t:Ppk|Ppk} uses the overall spread of all parts, including the drift over days.', cue: { Ppk: 'ppk' } },
        { nl: 'Bij een opstartstudie vragen klanten vaak een Ppk van minstens 1,67.', en: 'For a launch study customers often ask for a Ppk of at least 1.67.', cues: ['ppk'] },
        { nl: 'Liefst {n:100} delen of meer, in {n:25} steekproeven. Vraag: hoeveel stuks, over hoeveel dagen?', en: 'Ideally {n:100} parts or more, in {n:25} subgroups. Ask: how many parts, over how many days?', cues: [] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&" or "±" in the spoken text: tolerances are
// said as the floor says them ("plus-min vijf honderdste"), σ as "sigma". The
// Dutch voice says "ISO 2768" through the spoken form in films/_kit/timeline.mjs
// (SAY). The Dutch voice says "overbijsturen" for tampering, as the SPC film
// and eng.spc.tampering do; the caption keeps this lesson's term "Tampering"
// with "overbijsturen" beside it. Terms as in the drawings module (stempel),
// the measuring film and the SPC film (standaardafwijking, Cpk).
const SAY = [
  [ // s1 size and limits
    { nl: 'Op de tekening staat de {t:Nominale maat|nominale maat}: de doelwaarde van een maat. Ø{n:20} betekent iets ronds van {n:20} millimeter doorsnee.',
      en: 'The drawing gives the {t:Nominal|nominal} size: the target value of a dimension. Ø{n:20} means something round, {n:20} millimetres across.' },
    { nl: 'De {t:Tolerantie|tolerantie} zegt hoeveel het onderdeel mag afwijken en nog werkt: hier plus-min vijf honderdste, een veld van een tiende millimeter.',
      en: 'The {t:Tolerance|tolerance} says how far the part may deviate and still work: here plus or minus five hundredths, a band of one tenth of a millimetre.' },
    { nl: 'Dat geeft twee {t:Specgrenzen|specgrenzen}: ondergrens {n:19.95}, bovengrens {n:20.05}. Alles daartussen accepteert de klant.',
      en: 'That gives the two {t:Spec limits|spec limits}: the lower limit {n:19.95} and the upper limit {n:20.05}. The customer accepts anything in between.' },
    { nl: 'Een tolerantie kan ook ongelijk zijn. Een boring van {n:12}, nul tot plus achttien micron, loopt van precies twaalf tot {n:12.018}: groter mag, kleiner nooit.',
      en: 'A tolerance can also be uneven. A bore of {n:12}, zero to plus eighteen microns, runs from exactly twelve to {n:12.018}: bigger is allowed, smaller never.' },
  ],
  [ // s2 the title block
    { nl: 'Maten zonder eigen tolerantie vallen onder de {t:Algemene tolerantie|algemene tolerantie} in de stempel, het kader rechtsonder op de tekening.',
      en: 'Dimensions without a tolerance of their own fall under the {t:General tolerance|general tolerance} in the title block, the box at the bottom right of the drawing.' },
    { nl: 'Vaak is dat ISO 2768, klasse m: plus-min {n:0.2} millimeter voor maten boven {n:6} tot en met {n:30} millimeter.',
      en: 'Often that is ISO 2768, class m: plus or minus {n:0.2} millimetres for sizes over {n:6} up to {n:30} millimetres.' },
    { nl: 'Nauwer kost geld: een betere machine, langzamer verspanen, meer meten. Een lagerzitting vraagt misschien plus-min {n:0.01}, een gat in een afdekplaat kan met twee tiende.',
      en: 'Tighter costs money: a better machine, slower cutting, more measuring. A bearing seat may need plus or minus {n:0.01}, a hole in a cover plate is fine with two tenths.' },
    { nl: 'Vraag dus wat de functie nodig heeft. Een extra decimaal voor de zekerheid betaalt de productie.',
      en: 'So ask what the function needs. An extra decimal to be safe is paid for by production.' },
  ],
  [ // s3 out of spec
    { nl: 'Een serie van {n:500} bussen. Bij {n:15} meet de boring {n:12.021}: drie micron te groot. Dat is {n:3} procent buiten spec.',
      en: 'A batch of {n:500} bushes. In {n:15} of them the bore measures {n:12.021}: three microns too big. That is {n:3} percent out of spec.' },
    { nl: 'Zo’n onderdeel is {t:Afwijkend|afwijkend}: afkeuren, nabewerken, of zo gebruiken, maar alleen met toestemming.',
      en: 'Such a part is {t:Nonconforming|nonconforming}: scrap it, rework it, or use it as it is, but only with permission.' },
    { nl: 'Die toestemming heet een {t:Deviatie|deviatie}, ook wel concessie: een schriftelijk akkoord van de klant.',
      en: 'That permission is called a {t:Deviation|deviation}, or a concession: the customer’s written approval.' },
    { nl: 'Gevonden bij de machine: {n:15} keer 4 euro 50 is 67 euro 50. Bij de klant: €{n:400} om alles te sorteren, €{n:250} klachtkosten en een 8D. Zo’n tien keer zoveel.',
      en: 'Found at the machine: {n:15} times 4 euros 50, so 67 euros 50. At the customer: €{n:400} to sort everything, €{n:250} in complaint costs and an 8D. Ten times as much.' },
  ],
  [ // s4 variation
    { nl: 'Geen twee assen zijn gelijk. Elke gemeten as valt in het vak van zijn maat, en er groeit een stapel.',
      en: 'No two shafts are the same. Each measured shaft drops into the lane of its size, and a pile grows.' },
    { nl: 'Twee getallen beschrijven die spreiding. Het {t:Gemiddelde|gemiddelde} zegt waar het proces zit: bij deze {n:25} assen {n:20.003}.',
      en: 'Two numbers describe that spread. The {t:Mean|mean} says where the process sits: for these {n:25} shafts {n:20.003}.' },
    { nl: 'De {t:Standaardafwijking|standaardafwijking}, sigma, is de typische afstand van een as tot het gemiddelde: hier {n:0.008} millimeter.',
      en: 'The {t:Standard deviation|standard deviation}, sigma, is the typical distance of a shaft from the mean: here {n:0.008} millimetres.' },
    { nl: 'Veel metingen volgen een {t:Normale verdeling|normale verdeling}, de klokvorm: {n:68} procent binnen één sigma, {n:95} binnen twee, {n:99.7} binnen drie. Bijna alles ligt dus tussen {n:19.979} en {n:20.027}.',
      en: 'Many measurements follow a {t:Normal distribution|normal distribution}, the bell curve: {n:68} percent within one sigma, {n:95} within two, {n:99.7} within three. So nearly everything lies between {n:19.979} and {n:20.027}.' },
  ],
  [ // s5 common or special
    { nl: 'Spreiding met een {t:Gewone oorzaak|gewone oorzaak} komt uit vele kleine bronnen die er altijd zijn: materiaal, temperatuur, speling.',
      en: 'Spread with a {t:Common cause|common cause} comes from many small sources that are always there: material, temperature, play.' },
    { nl: 'Die spreiding is stabiel en voorspelbaar. Omlaag krijg je haar alleen door het systeem te veranderen: machine, opspanning of methode.',
      en: 'That spread is stable and predictable. You only bring it down by changing the system: machine, fixture or method.' },
    { nl: 'Een {t:Speciale oorzaak|speciale oorzaak} is een concrete gebeurtenis. Maandag om zes uur zitten de eerste assen gemiddeld op {n:20.025}, om zeven uur weer op {n:20.005}.',
      en: 'A {t:Special cause|special cause} is a specific event. On Monday at six the first shafts average {n:20.025}, at seven they are back at {n:20.005}.' },
    { nl: 'De machine was koud na het weekend. De oplossing: {n:20} minuten opwarmen, niet aan de offsets draaien.',
      en: 'The machine was cold after the weekend. The fix: a {n:20}-minute warm-up, not turning the offsets.' },
  ],
  [ // s6 chasing noise
    { nl: 'Een operator die het goed bedoelt, draait na elke as de offset bij met de afwijking van die as.',
      en: 'An operator who means well turns the offset after every shaft by that shaft’s deviation.' },
    { nl: 'Dat is overbijsturen: bijsturen op ruis. Elke afwijking is vooral toeval, dus wie daarop corrigeert, zet er een tweede ruis bovenop.',
      en: 'That is called tampering, chasing noise. Each deviation is mostly chance, so correcting for it adds a second noise on top.' },
    { nl: 'De stapels worden breder: zo’n {n:40} procent meer spreiding. Het omgekeerde van wat hij wilde.',
      en: 'The stacks get wider: about {n:40} percent more spread. The opposite of what he wanted.' },
    { nl: 'De eerste vraag is dus altijd: is er iets veranderd, of is dit gewoon hoe breed het proces is?',
      en: 'So the first question is always: did something change, or is this just how wide the process is?' },
  ],
  [ // s7 does it fit
    { nl: 'Past het proces in de tolerantie? Dat is {t:Procesgeschiktheid|procesgeschiktheid}: je legt de spreiding naast de tolerantiebreedte.',
      en: 'Does the process fit the tolerance? That is {t:Capability|capability}: the spread set beside the tolerance width.' },
    { nl: 'Een boring van {n:30}, nul tot plus vier honderdste: grenzen {n:30.000} en {n:30.040}. Vijftig delen geven gemiddeld {n:30.026}, sigma {n:0.004}.',
      en: 'A bore of {n:30}, zero to plus four hundredths: limits {n:30.000} and {n:30.040}. Fifty parts give a mean of {n:30.026}, sigma {n:0.004}.' },
    { nl: '{t:Cp|Cp} is de tolerantiebreedte gedeeld door zes sigma, want zes sigma bevat bijna alle delen. {n:0.040} gedeeld door {n:0.024} is {n:1.67}.',
      en: '{t:Cp|Cp} is the tolerance width divided by six sigma, because six sigma holds nearly all the parts. {n:0.040} divided by {n:0.024} is {n:1.67}.' },
    { nl: 'Cp kijkt alleen naar de breedte, alsof het proces precies in het midden zit.',
      en: 'Cp looks only at the width, as if the process sat exactly in the middle.' },
  ],
  [ // s8 where it sits now
    { nl: '{t:Cpk|Cpk} telt het midden mee: de afstand van het gemiddelde tot de dichtstbijzijnde grens, gedeeld door drie sigma. Past hij waar hij nu zit?',
      en: '{t:Cpk|Cpk} counts the centre too: the distance from the mean to the nearest limit, divided by three sigma. Does it fit where it sits now?' },
    { nl: 'Van {n:30.026} tot de bovengrens is veertien duizendste, gedeeld door {n:0.012}: Cpk {n:1.17}. Te dicht tegen de bovengrens.',
      en: 'From {n:30.026} to the upper limit is fourteen thousandths, divided by {n:0.012}: Cpk {n:1.17}. Too close to the upper limit.' },
    { nl: 'Eén offset van min {n:0.006} zet het gemiddelde op {n:30.020}: Cpk ook {n:1.67}. Geen investering, alleen centreren.',
      en: 'One offset of minus {n:0.006} puts the mean at {n:30.020}: Cpk {n:1.67} too. No investment, just centring.' },
    { nl: 'Het gangbare minimum is {n:1.33}: gecentreerd zo’n {n:63} {t:ppm|ppm}, delen per miljoen, buiten spec. Bij {n:1.0} zo’n {n:2700}.',
      en: 'The usual minimum is {n:1.33}: centred, about {n:63} {t:ppm|ppm}, parts per million, out of spec. At {n:1.0} about {n:2700}.' },
  ],
  [ // s9 over days
    { nl: 'Let op: Cp en Cpk gebruiken de korte termijn: de spreiding binnen kleine groepjes delen, direct na elkaar gemaakt.',
      en: 'Note: Cp and Cpk use the short term, the spread within small groups of parts made one after another.' },
    { nl: '{t:Ppk|Ppk} gebruikt de totale spreiding van alle delen, ook het verloop over uren en dagen. Veel lager dan de Cpk? Dan zwerft het proces.',
      en: '{t:Ppk|Ppk} uses the overall spread of all parts, including drift over hours and days. Much lower than the Cpk? Then the process wanders.' },
    { nl: 'Bij een opstartstudie vragen klanten vaak een Ppk van minstens {n:1.67}, en alleen van een stabiel proces.',
      en: 'For a launch study customers often ask for a Ppk of at least {n:1.67}, and only from a stable process.' },
    { nl: 'Een Cpk uit dertig delen zegt weinig. Neem liever {n:100} delen of meer, in {n:25} steekproeven. Vraag: hoeveel stuks, over hoeveel dagen?',
      en: 'A Cpk from thirty parts says little. Better take {n:100} parts or more, in {n:25} subgroups. So ask: how many parts, over how many days?' },
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
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.tl-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.tl-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.tl-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.tl-glass{fill:var(--anatomy-shade-1);fill-opacity:.28;stroke:var(--anatomy-lo);stroke-width:.6}
.tl-cave{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
.tl-flag{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:.6}
.tl-sheet{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:1.2}
.tl-paper{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1}
.tl-tag{fill:var(--fp-accent);stroke:none}
.tl-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.tl-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.tl-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.tl-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:500}
.tl-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.tl-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.tl-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:10 3 2 3}
.tl-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:6 4}
.tl-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.tl-bar{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1}
.tl-dot{fill:var(--anatomy-hi)}
.tl-hollow{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.tl-acc{fill:var(--fp-accent);stroke:none}
.tl-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.tl-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.tl-band{fill:color-mix(in srgb,var(--anatomy-mid) 18%,transparent);stroke:none}
.tl-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .tl-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .tl-lim{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .tl-axis{stroke:var(--fp-accent)}
[data-cue][data-on] .tl-big,[data-cue][data-on] .tl-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .tl-paper,[data-cue][data-on] .tl-sheet,[data-cue][data-on] .tl-flag{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .tl-bar{stroke:var(--fp-accent)}
[data-cue][data-on] .tl-band{fill:color-mix(in srgb,var(--fp-accent) 22%,transparent)}
[data-cue][data-on] .tl-hollow{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Drie plekken naast elkaar. Een CNC-draaibank die assen draait: een onderkast met een spaanlade, een behuizing met een venster waarachter de klauwplaat, de as en de revolver met de wisselplaat, een bedieningspaneel met de offsetknop en een signaalzuil. Een meettafel met een micrometer op een standaard, een bakje assen, een doosje wisselplaten en op de vloer een quarantainekrat met een label. Een spreidingsrek op een tafel: negentien vakken achter glas, een liniaal langs de rand en twee poortjes op de specgrenzen; elke gemeten as valt in het vak van zijn maat, zodat de stapels een klokvorm vormen. Een tekening met maat, tolerantie en stempel, en grafieken, elk gemarkeerd als voorbeeld: de specgrens met de afwijkende boringen, het histogram met gemiddelde en standaardafwijking, een verloopkaart, de spreiding bij bijsturen, Cp en Cpk, en Ppk over dagen.',
  en: 'Three places side by side. A CNC lathe turning shafts: a base cabinet with a chip drawer, an enclosure with a window showing the chuck, the shaft and the turret with its insert, a control panel with the offset knob and a signal tower. A measuring bench with a micrometer on a stand, a tray of shafts, a box of inserts and, on the floor, a tagged quarantine crate. A spread rack on a table: nineteen lanes behind glass, a ruler along its ledge and two gates at the spec limits; each measured shaft drops into the lane of its size, so the stacks form a bell curve. A drawing with size, tolerance and title block, and charts, each marked as an example: the spec limit with the nonconforming bores, the histogram with mean and standard deviation, a run chart, the spread under tampering, Cp and Cpk, and Ppk over days.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

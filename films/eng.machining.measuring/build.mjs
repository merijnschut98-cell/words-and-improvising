// Dev tool, not shipped. Builds the explainer film "Meten en een capabel
// proces / Measuring and a capable process" for the levels 2–4 of the topic
// Opspanning en meten of Verspanen (quality L2, metrology L3, capable L4). The
// Basis level of the topic (fixtures) has its own film, eng.machining.workholding.
//
//   node films/eng.machining.measuring/build.mjs            build the page
//   node films/eng.machining.measuring/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.measuring.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.1.
//
// Three places on one floor, left to right. The machining centre: a column
// with a head that moves in Z, a spindle that carries a cutter or a touch
// probe, and a block with a bore in a vice on the table. The bench: a turned
// steel shaft Ø30 on two V-blocks, a micrometer on it, a portable roughness
// tester riding on the shaft with its display unit, and a ring with a bore and
// a go/no-go plug gauge. The measuring room: a bridge CMM on a granite plate
// with a block, its probe and its joystick. Charts (roughness profile,
// thermometer and tolerance band, resolution, gauge R&R, the bore's mean over
// a day, the warm-up cycle) sit in stage space over the drawing.
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
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Sources as in the lessons: ISO 286 (h6), ISO 1 (20 °C
// reference temperature), the expansion of steel about 11,5 µm/(m·K), the AIAG
// MSA manual (%GRR 10 / 30 %, ndc ≥ 5), and Cpk = (distance from the mean to
// the nearest limit) / 3σ as in eng.quality.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// quality: Ø30 h6 = 29,987–30,000; 29,990 at 35 °C → 29,985 at 20 °C
const ALPHA = 0.0115; // mm per m per °C, steel
const H6 = [29.987, 30.0];
const WARM = 29.99;
const SHRINK = (30 * ALPHA * (35 - 20)) / 1000;
assert(near(SHRINK, 0.005, 0.0003), '30 × 0,0115 × 15 / 1.000 ≈ 0,005 mm');
const COLD = Math.round((WARM - 0.005) * 1000) / 1000;
assert(COLD === 29.985 && COLD < H6[0] && WARM >= H6[0] && WARM <= H6[1], 'warm 29,990 in tolerance, cold 29,985 out');
assert(near(H6[1] - H6[0], 0.013, 1e-9), 'h6 on Ø30 is 13 µm wide');
assert(near(0.2 * ALPHA * 10, 0.023, 1e-9), '200 mm at 30 °C: 0,023 mm');
// metrology: Ø20 ±0,02 → band 0,04; 10 % rule → 0,004; GRR σ 0,0015 → 6σ 0,009 → 22,5 %; band 0,1 → 9 %
const BAND = 0.04;
const SMS = 0.0015;
assert(near(BAND / 10, 0.004, 1e-12), 'resolution ≤ 0,004');
assert(near(6 * SMS, 0.009, 1e-12) && near((6 * SMS) / BAND, 0.225, 1e-12), '%GRR 22,5');
assert(near((6 * SMS) / 0.1, 0.09, 1e-12), 'band 0,1 → 9 %');
const verdict = (g) => (g < 0.1 ? 0 : g <= 0.3 ? 1 : 2);
assert(verdict(0.225) === 1, '22,5 % is conditionally acceptable');
// capable: Ø25 ±0,015, σ 0,003: mean 25,000 → Cpk 1,67; 25,006 → 1,0; held within 0,001 → 1,56
const TOL = 0.015;
const SIG = 0.003;
const cpk = (shift) => (TOL - Math.abs(shift)) / (3 * SIG);
assert(near(cpk(0), 1.67, 0.005) && near(cpk(0.006), 1.0, 1e-9) && near(cpk(0.001), 1.56, 0.005), 'Cpk 1,67 / 1,0 / 1,56');
assert(near(25.015 - 25.006, 0.009, 1e-9), '9 µm to the limit at noon');
assert(cpk(0) > 1.33 && cpk(0.006) < 1.33 && cpk(0.001) > 1.33, 'against the 1,33 a series customer asks');

// ---------------------------------------------------------------- the world (mm)
// x to the right along the floor (machine at -x, measuring room at +x), y
// toward the viewer, z up; the floor is z = 0.
const W = 640;
const H = 400;
// the machine
const MX = -330; // spindle and bore axis x (y = 0)
const M_TOP = 82; // the top of the block in the vice
const M_BORE = 8;
// the bench
const SZ = 100; // shaft axis height (y = 0)
const SR = 15; // Ø30
const SX = [-160, 0]; // shaft ends
const MIC_X = -100;
const RING = [24, 40]; // ring with a bore
const RING_Z = [70, 84];
const RING_R = [18, 10];
// the CMM
const CX = 230; // bore axis x (y = 0)
const C_TOP = 104;
const C_BORE = 12;
const BALL = 125; // ruby ball centre at rest
const DUR = [22, 30, 32, 28, 38, 32, 38, 38, 38];
const C = {
  MX, M_TOP, M_BORE, SZ, SR, SX, MIC_X, RING, RING_Z, RING_R, CX, C_TOP, C_BORE, BALL, dur: DUR,
  H6, WARM, COLD, TOL, SIG, BAND, SMS,
};

const FIT = [[-415, -115, 0], [325, 95, 0], [-415, -115, 290], [325, 95, 300], [-415, 95, 0], [325, -115, 0]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 52, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6, steps = 4) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 24) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const alongY = (x, z, y0, y1, r, style = {}) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P), style);
const alongZ = (x, y, z0, z1, r, style = {}) => S(G.disc(z0, z1, r, G.frameOf([x, y, 0], Z, X, Y), P), style);
// a block in the y–z plane (a piece of the micrometer frame), x0..x1 thick
const yz = (x0, x1, [y0, z0, y1, z1], style = {}) => S(G.prismOf(G.frameOf([x0, 0, 0], X, Y, Z), [[y0, z0], [y1, z0], [y1, z1], [y0, z1]], 0, x1 - x0, P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 3) => L(k.sideSeam(plan, z, P, inset), { tone: 'faint' });
const screws = (plan, z, inset = 4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.5 }) + L(k.corners(plan, inset).map(([x, y]) => k.ring(x, y, 1.8, z, P, 12)).join(''), { tone: 'lo' });
const halo = (plan, z) => `<path class="iso-halo" d="${k.haloOf(plan, z, 0.5, P)}"/>`;
// a dark bore seen from above: the hole, its far wall, and the rim
const bore = (x, y, r, z, depth) => {
  const ringPts = k.circleRing(x, y, r, 48);
  const far = ringPts.filter(([px, py]) => k.depthOf([px, py, z], P) < k.depthOf([x, y, z], P));
  return `<path class="ms-hole" d="${k.onTop(ringPts, z, P, true)}"/>`
    + `<path class="ms-wall" d="${k.pathOf(far.map(([px, py]) => at([px, py, z])))}"/>`
    + L(k.ring(x, y, r, z, P, 48) + k.ring(x, y, r + 1.4, z, P, 48), { tone: 'mid' })
    + L(k.ring(x, y, r, z - Math.min(depth, 6), P, 48), { tone: 'faint' });
};

// ---------------------------------------------------------------- the machining centre
const MBASE = { x: -412, y: -72, w: 164, d: 144, r: 3 };
const MTABLE = { x: -396, y: -46, w: 132, d: 92, r: 1.5 };
const COLUMN = { x: -382, y: -114, w: 104, d: 46, r: 2 };
const machineBack = [
  halo(k.insetPlan(MBASE, -6), 0),
  box(MBASE, 0, 36, { tone: 'lo', inner: seam(MBASE, 28, 4) }, 0.8),
  box(COLUMN, 0, 262, { inner: seam(COLUMN, 240, 4) + seam(COLUMN, 40, 4) }, 0.8),
  // the column's Z ways and its cable chain plate
  L(k.segment([-366, -68, 60], [-366, -68, 255], P) + k.segment([-294, -68, 60], [-294, -68, 255], P), { tone: 'lo' }),
  box({ x: -360, y: -70, w: 6, d: 2, r: 0.3 }, 60, 255, { tone: 'lo', crease: 'none' }, 0, 2),
  box({ x: -306, y: -70, w: 6, d: 2, r: 0.3 }, 60, 255, { tone: 'lo', crease: 'none' }, 0, 2),
  box(MTABLE, 36, 48, { crease: 'lo', inner: seam(MTABLE, 42, 3) }),
  L([-24, 0, 24].map((y) => k.lineOnTop([-392, y], [-268, y], 48, P)).join(''), { tone: 'faint' }),
  L(k.sideTicks(-390, -270, 4, 5, 46, 47, [1.6, 3], P).minor, { tone: 'lo' }),
  L(k.sideTicks(-390, -270, 4, 5, 46, 47, [1.6, 3], P).major, { tone: 'mid' }),
  // the vice: base and fixed jaw behind the part
  box({ x: -364, y: -26, w: 68, d: 52, r: 1 }, 48, 60, { crease: 'lo' }),
  box({ x: -364, y: -26, w: 68, d: 10, r: 0.6 }, 60, 80, { crease: 'lo' }),
].join('');
const MBLOCK = { x: -354, y: -15, w: 48, d: 30, r: 0.8 };
const machinePart = box(MBLOCK, 60, M_TOP, { tone: 'hi', crease: 'lo', inner: seam(MBLOCK, M_TOP - 2, 2) }, 0.4)
  + bore(MX, 0, M_BORE, M_TOP, 16);
const machineFront = [
  box({ x: -364, y: 16, w: 68, d: 10, r: 0.6 }, 60, 80, { crease: 'lo' }),
  alongY(-330, 70, 26, 44, 3.2, { tone: 'hi', crease: 'lo' }),
  alongY(-330, 70, 44, 48, 6, { crease: 'lo' }),
  // the control panel on its arm, at the front right of the base
  box({ x: -268, y: 50, w: 16, d: 16, r: 1 }, 36, 120, { tone: 'lo' }),
  box({ x: -282, y: 58, w: 44, d: 10, r: 1 }, 120, 168, { inner: seam({ x: -282, y: 58, w: 44, d: 10, r: 1 }, 162, 2) }),
].join('');
// the head moves in Z (thermal growth exaggerated, the probe cycle); drawn at rest
const HEAD = { x: -358, y: -68, w: 56, d: 82, r: 2 };
const head = [
  box(HEAD, 150, 206, { inner: seam(HEAD, 198, 4) + seam(HEAD, 158, 4) }, 0.8),
  post(-330, -36, 16, 206, 236, { crease: 'lo' }, 32),
  L(k.ring(-330, -36, 16, 228, P, 32) + k.ring(-330, -36, 16, 214, P, 32), { tone: 'faint' }),
  post(-330, -36, 6, 236, 242, { tone: 'lo' }, 16),
  post(MX, 0, 15, 136, 150, { crease: 'lo' }, 32),
  post(MX, 0, 11, 128, 136, { tone: 'lo' }, 24),
].join('');
const cutter = post(MX, 0, 8, 120, 128, { tone: 'hi', crease: 'lo' }, 20) + post(MX, 0, 5, 96, 120, { tone: 'hi', crease: 'lo' }, 16)
  + L([0, 1, 2, 3].map((i) => k.segment([MX + 5 * Math.cos(i * 1.57 + 0.4), 5 * Math.sin(i * 1.57 + 0.4), 98], [MX + 5 * Math.cos(i * 1.57 + 1.0), 5 * Math.sin(i * 1.57 + 1.0), 118], P)).join(''), { tone: 'lo' });
const mprobe = post(MX, 0, 8, 120, 128, { tone: 'hi', crease: 'lo' }, 20) + post(MX, 0, 6.5, 104, 120, { crease: 'lo' }, 20)
  + L(k.ring(MX, 0, 6.5, 114, P, 20), { tone: 'faint' }) + post(MX, 0, 1.3, 88, 104, { tone: 'hi' }, 10)
  + S(G.sphereOf([MX, 0, 87], 3, P), { tone: 'hi', crease: 'none' });

// ---------------------------------------------------------------- the bench
const BENCH = { x: -184, y: -72, w: 246, d: 144, r: 2 };
const legs = (yy) => [[-176, yy], [52, yy]].map(([x, y]) => box({ x, y, w: 8, d: 8, r: 0.6 }, 0, 60, { tone: 'lo' }, 0.4, 2)).join('');
const benchBack = [
  halo(k.insetPlan(BENCH, -2), 0),
  legs(-68),
  box({ x: -176, y: -64, w: 236, d: 6, r: 0.4 }, 14, 20, { tone: 'lo' }, 0.3, 2),
  legs(60),
  box({ x: -150, y: 50, w: 90, d: 20, r: 0.6 }, 40, 60, { tone: 'lo', inner: seam({ x: -150, y: 50, w: 90, d: 20, r: 0.6 }, 50, 2) }, 0.4),
  box(BENCH, 60, 70, { crease: 'lo', inner: seam(BENCH, 64, 3) }, 0.6),
  L(k.planOutline(k.insetPlan(BENCH, 6), 70, P, 4), { tone: 'faint' }),
  // the display unit of the roughness tester, behind the shaft
  box({ x: -2, y: -60, w: 44, d: 30, r: 1.5 }, 70, 86, { inner: seam({ x: -2, y: -60, w: 44, d: 30, r: 1.5 }, 74, 2) }),
  `<path class="ms-screen" d="${k.onTop([[2, -56], [38, -56], [38, -40], [2, -40]], 86.05, P, true)}"/>`,
  // the V-blocks
  ...[-142, -62].map((x) => box({ x, y: -16, w: 22, d: 32, r: 0.6 }, 70, 88, { crease: 'lo', inner: seam({ x, y: -16, w: 22, d: 32, r: 0.6 }, 84, 2) }, 0.4)
    + L(k.pathOf([[x, 16, 88], [x, 0, 85], [x, -16, 88]].map((p) => at([p[0], p[1], p[2]]))) + k.pathOf([[x + 22, 16, 88], [x + 22, 0, 85], [x + 22, -16, 88]].map(at)), { tone: 'lo' })),
  // the micrometer's back leg and anvil, behind the shaft
  yz(MIC_X - 4, MIC_X + 4, [-31, 92, -21, 136], { crease: 'lo' }),
  alongY(MIC_X, SZ, -21, -15, 3.2, { tone: 'hi', crease: 'lo' }),
].join('');
const SHAFT_F = G.frameOf([SX[0], 0, SZ], X, Y, Z);
const shaft = S(G.solidOf([[0, SR - 1], [1, SR], [SX[1] - SX[0] - 1, SR], [SX[1] - SX[0], SR - 1]], SHAFT_F, P), { tone: 'hi', crease: 'lo' })
  + L(G.arcOf(SHAFT_F, 40, SR, P) + G.arcOf(SHAFT_F, 120, SR, P), { tone: 'faint' });
// the roughness tester riding on the shaft (stylus at its -x end), cable to the display
const RT = { x: -34, y: -7, w: 28, d: 14, r: 1.5 };
const tester = [
  box({ x: -30, y: -6, w: 3, d: 12, r: 0.3 }, SZ + SR - 0.5, SZ + SR + 2, { tone: 'lo' }, 0, 2),
  box({ x: -13, y: -6, w: 3, d: 12, r: 0.3 }, SZ + SR - 0.5, SZ + SR + 2, { tone: 'lo' }, 0, 2),
  box(RT, SZ + SR + 2, SZ + SR + 13, { inner: seam(RT, SZ + SR + 10, 2) }, 0.5),
  box({ x: -46, y: -1.5, w: 12, d: 3, r: 0.3 }, SZ + SR + 4, SZ + SR + 7, { tone: 'hi', crease: 'lo' }, 0, 2),
].join('');
const testerCable = k.wireSvg(at([-6, 0, SZ + SR + 8]), at([20, -45, 86]), { via: [at([6, -10, SZ + SR + 16]), at([18, -36, 96])], tone: 'lo' });
const micFront = [
  yz(MIC_X - 4, MIC_X + 4, [-31, 128, 31, 136], { crease: 'lo' }),
  yz(MIC_X - 4, MIC_X + 4, [21, 92, 31, 136], { crease: 'lo' }),
  // heat-insulating grip plate on the frame
  yz(MIC_X + 4, MIC_X + 5, [-24, 130, 24, 134], { tone: 'lo', crease: 'none' }),
  alongY(MIC_X, SZ, 15, 21, 3, { tone: 'hi', crease: 'lo' }),
  alongY(MIC_X, SZ, 31, 56, 5, { crease: 'lo' }),
  L(k.pathOf([[MIC_X, 36, SZ + 5], [MIC_X, 54, SZ + 5]].map(at)), { tone: 'lo' }),
  alongY(MIC_X, SZ, 50, 70, 7.5, { tone: 'hi', crease: 'lo' }),
  L(G.ribsOf(G.frameOf([MIC_X, 0, SZ], Y, X, Z), 52, 58, 7.5, 18, P, { seams: true }), { tone: 'lo' }),
  alongY(MIC_X, SZ, 70, 78, 4.5, { crease: 'lo' }),
].join('');
const ring = [
  halo({ x: RING[0] - 20, y: RING[1] - 20, w: 40, d: 40, r: 20 }, 70),
  alongZ(RING[0], RING[1], RING_Z[0], RING_Z[1], RING_R[0], { crease: 'lo' }),
  bore(RING[0], RING[1], RING_R[1], RING_Z[1], 14),
].join('');

// ---------------------------------------------------------------- the CMM
const STAND = { x: 150, y: -82, w: 160, d: 152, r: 2 };
const GRAN = { x: 138, y: -96, w: 184, d: 184, r: 2 };
const CBLOCK = { x: 200, y: -24, w: 60, d: 48, r: 0.8 };
const cmmBack = [
  halo(k.insetPlan(STAND, -6), 0),
  box(STAND, 0, 44, { tone: 'lo', inner: seam(STAND, 36, 4) }, 0.8),
  box(GRAN, 44, 76, { inner: seam(GRAN, 50, 4) }, 1.2),
  // the guide way along the back of the granite, and the legs' air bearings
  box({ x: 142, y: -94, w: 176, d: 8, r: 0.6 }, 76, 82, { tone: 'lo' }, 0.3),
  box({ x: 146, y: -76, w: 16, d: 28, r: 1 }, 76, 252, { crease: 'lo', inner: seam({ x: 146, y: -76, w: 16, d: 28, r: 1 }, 92, 2) }),
  box({ x: 298, y: -76, w: 16, d: 28, r: 1 }, 76, 252, { crease: 'lo', inner: seam({ x: 298, y: -76, w: 16, d: 28, r: 1 }, 92, 2) }),
  box({ x: 140, y: -78, w: 180, d: 32, r: 1.5 }, 252, 274, { inner: seam({ x: 140, y: -78, w: 180, d: 32, r: 1.5 }, 268, 3) }),
  L(k.sideTicks(150, 310, 4, 5, -46, 270, [1.6, 3], P).minor, { tone: 'lo' }),
  L(k.sideTicks(150, 310, 4, 5, -46, 270, [1.6, 3], P).major, { tone: 'mid' }),
  // the block with its bore on three rests
  ...[[206, -18], [254, -18], [230, 18]].map(([x, y]) => post(x, y, 3.5, 76, 80, { tone: 'lo' }, 12)).join(''),
].join('');
const cblock = box(CBLOCK, 80, C_TOP, { tone: 'hi', crease: 'lo', inner: seam(CBLOCK, C_TOP - 3, 2) }, 0.4) + bore(CX, 0, C_BORE, C_TOP, 18);
// the carriage on the beam (moves in x) and the ram with the probe (moves in x, y, z)
const ram = [
  box({ x: CX - 7, y: -7, w: 14, d: 14, r: 0.5 }, 168, 300, { inner: seam({ x: CX - 7, y: -7, w: 14, d: 14, r: 0.5 }, 176, 2) }),
  post(CX, 0, 6.5, 160, 168, { tone: 'lo' }, 20),
  post(CX, 0, 4.5, 142, 160, { crease: 'lo' }, 16),
  post(CX, 0, 1.1, 127, 142, { tone: 'hi' }, 8),
  S(G.sphereOf([CX, 0, BALL], 2.6, P), { tone: 'hi', crease: 'none' }),
].join('');
const carriage = box({ x: CX - 20, y: -48, w: 40, d: 54, r: 1.2 }, 246, 280, { inner: seam({ x: CX - 20, y: -48, w: 40, d: 54, r: 1.2 }, 252, 3) }) + screws({ x: CX - 20, y: -48, w: 40, d: 54 }, 280, 4);
const joystick = box({ x: 282, y: 48, w: 30, d: 22, r: 2 }, 76, 86, { inner: seam({ x: 282, y: 48, w: 30, d: 22, r: 2 }, 80, 2) })
  + post(297, 59, 1.6, 86, 98, { tone: 'hi' }, 10) + S(G.sphereOf([297, 59, 99], 3, P), { tone: 'hi', crease: 'none' });

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('loupe', `<clipPath id="ms-lclip"><circle cx="520" cy="148" r="104"/></clipPath><circle class="ms-panel" cx="520" cy="148" r="104"/><g clip-path="url(#ms-lclip)">${g('loupeIn', '')}</g><circle class="fp-mark" cx="520" cy="148" r="104"/>`),
  g('therm', '', ' data-cue="room"'),
  g('band', '', ' data-cue="band"'),
  g('unc', g('uncBase', '') + cue('res', g('uncRes', '')) + cue('unc', g('uncRd', ''))),
  g('grr', cue('grr', g('grrBase', '')) + cue('rep', g('grrRep', '')) + cue('repro', g('grrRepro', '')) + cue('verdict', g('grrVer', ''))),
  g('run', '<g data-cue="cpk"><g data-cue="cpk2">' + g('runIn', '') + '</g></g>'),
  g('warmc', '', ' data-cue="warm"'),
  g('lcd', '', ' data-cue="mic"'),
  g('exag', ''),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('mach', [
    machineBack,
    cue('mpart', machinePart),
    g('head', cue('grow', head + g('mHeat', '')) + cue('probe', g('mTool', mprobe)) + g('mCut', cutter)),
    g('mChips', ''),
    machineFront,
  ].join('')),
  g('bench', [
    benchBack,
    cue('heat', shaft + g('sHeat', '')),
    cue('chatter', g('chatter', '')),
    cue('burr', g('burr', '')),
    cue('ra', tester + testerCable),
    cue('mic', micFront),
    cue('plug', ring + g('gauge', '')),
  ].join('')),
  g('cmm', [
    cmmBack,
    cue('datum', cblock),
    g('touch', ''),
    cue('cmm', g('ram', ram) + g('car', carriage)),
    joystick,
  ].join('')),
].join('');
// Static paths (as in eng.machining.workholding) written with relative line-tos: the same points (to 0,1), about a
// third fewer bytes. Only M, L and Z paths at one decimal are rewritten.
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
// read a path back to absolute points in tenths, to prove the rewrite exact
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
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([-330, 0, 110], 300), to: cam([230, 0, 140], 300), a: 0.05, b: 0.95 },
  { from: cam([-20, 0, 105], 250), to: cam([-10, 0, 105], 230), a: 0.1, b: 0.6 },
  { from: cam([-90, 0, 105], 250), to: cam([-10, 20, 95], 240), a: 0.45, b: 0.8 },
  // close on the bore while the probe touches, then out to the room (20 °C)
  { from: cam([230, 0, 120], 200), to: cam([250, 0, 165], 370), a: 0.42, b: 0.8 },
  { from: cam([-40, 0, 100], 290), to: cam([-30, 0, 100], 290) },
  { from: cam([-40, 0, 100], 300), to: cam([-30, 0, 100], 300) },
  { from: cam([-40, 0, 100], 340), to: cam([-30, 0, 100], 340) },
  { from: cam([-215, 0, 150], 330), to: cam([-205, 0, 150], 330) },
  { from: cam([-215, 0, 140], 320), to: cam([-225, 0, 125], 290) },
];

// ---------------------------------------------------------------- the film
const QUAL = 'eng.machining.quality';
const METR = 'eng.machining.metrology';
const CAP = 'eng.machining.capable';
const spec = {
  id: 'eng.machining.measuring',
  title: { nl: 'Meten en een capabel proces', en: 'Measuring and a capable process' },
  lessons: [QUAL, METR, CAP],
  scenes: [
    {
      id: 's1', lesson: QUAL, level: 2, dur: DUR[0], still: 0.5, title: { nl: 'Van de machine naar de meetkamer', en: 'From the machine to the measuring room' },
      beats: [
        { nl: 'Een stuk komt van de machine. Is het goed? Dat hangt af van hoe je meet.', en: 'A part comes off the machine. Is it good? That depends on how you measure.', cues: ['mpart'], still: 0.1 },
        { nl: 'Eerst het oppervlak, de meetmiddelen en de temperatuur.', en: 'First the surface, the gauges and the temperature.', cues: ['mic'], still: 0.5 },
        { nl: 'Dan: hoe goed is het meten zelf, en blijft het proces de hele dag goed?', en: 'Then: how good is the measuring itself, and does the process stay good all day?', cues: ['cmm'], still: 0.95 },
      ],
    },
    {
      id: 's2', lesson: QUAL, level: 2, dur: DUR[1], still: 0.3, title: { nl: 'Het oppervlak', en: 'The surface' },
      beats: [
        { nl: '{t:Ra|Ra} is de gemiddelde ruwheid in µm: hoe lager, hoe gladder.', en: '{t:Ra|Ra} is the average roughness in µm: the lower, the smoother.', cue: { Ra: 'ra' }, read: { nl: 'Ra {n:3.2}–{n:6.3} · {n:0.8}–{n:1.6} · {n:0.2}–{n:0.8} µm', en: 'Ra {n:3.2}–{n:6.3} · {n:0.8}–{n:1.6} · {n:0.2}–{n:0.8} µm' }, still: 0.25 },
        { nl: '{t:Chatter|Chatter}: trilling laat een golfpatroon achter.', en: '{t:Chatter|Chatter}: vibration leaves a wavy pattern.', cue: { Chatter: 'chatter' }, still: 0.6 },
        { nl: '{t:Bramen|Bramen}: scherpe randjes waar het gereedschap eruit loopt.', en: '{t:Burrs|Burrs}: sharp ridges where the tool runs out.', cue: { Bramen: 'burr' }, still: 0.92 },
      ],
    },
    {
      id: 's3', lesson: QUAL, level: 2, dur: DUR[2], still: 0.3, title: { nl: 'Micrometer en kaliber', en: 'Micrometer and gauge' },
      beats: [
        { nl: 'Een {t:Micrometer|micrometer} leest {n:0.001} mm af: goed voor ±{n:0.01} mm.', en: 'A {t:Micrometer|micrometer} reads {n:0.001} mm: fine for ±{n:0.01} mm.', cue: { Micrometer: 'mic' }, still: 0.15 },
        { nl: 'Vuistregel: lees zo’n tien keer fijner af dan de tolerantie.', en: 'Rule of thumb: read about ten times finer than the tolerance.', cues: ['mic'], still: 0.38 },
        { nl: '{t:Gaat/gaat-niet|Gaat/gaat-niet}: de ene kant past, de andere niet. Geen getal.', en: '{t:Go/no-go|Go/no-go}: one end fits, the other does not. No number.', cue: { 'Gaat/gaat-niet': 'plug' }, still: 0.95 },
      ],
    },
    {
      id: 's4', lesson: QUAL, level: 2, dur: DUR[3], still: 0.55, title: { nl: 'De 3D-meetmachine', en: 'The CMM' },
      beats: [
        { nl: 'Een {t:CMM|CMM} tast punten af met een taster, een meetpennetje.', en: 'A {t:CMM|CMM} touches points with a probe, a small measuring pin.', cue: { CMM: 'cmm' }, still: 0.37 },
        { nl: 'Hij rekent maat, vorm en positie uit, vanaf de referentievlakken.', en: 'It works out size, form and position, from the datums.', cues: ['datum'], still: 0.6 },
        { nl: 'De meetkamer staat op {n:20} °C.', en: 'The measuring room is kept at {n:20} °C.', cues: ['room'], still: 0.9 },
      ],
    },
    {
      id: 's5', lesson: QUAL, level: 2, dur: DUR[4], still: 0.6, title: { nl: 'Warm gemeten, koud afgekeurd', en: 'Measured warm, rejected cold' },
      beats: [
        { nl: 'Staal groeit zo’n {n:0.0115} mm per meter per °C.', en: 'Steel grows about {n:0.0115} mm per metre per °C.', cues: ['heat'], still: 0.1 },
        { nl: 'Ø30 h6: {n:29.987} tot {n:30.000} mm. Warm, op {n:35} °C: {n:29.990}. Goed.', en: 'Ø30 h6: {n:29.987} to {n:30.000} mm. Warm, at {n:35} °C: {n:29.990}. Good.', cues: ['band'], still: 0.42 },
        { nl: 'Op {n:20} °C is hij {n:0.005} mm kleiner: {n:29.985}. Afgekeurd.', en: 'At {n:20} °C it is {n:0.005} mm smaller: {n:29.985}. Rejected.', cues: ['band'], read: { nl: '{n:30} × {n:0.0115} × {n:15} / 1.000 = {n:0.005} mm', en: '{n:30} × {n:0.0115} × {n:15} / 1,000 = {n:0.005} mm' }, still: 0.68 },
        { nl: 'Laat hem {n:15} minuten afkoelen, of stel af met een meesterstuk.', en: 'Let it cool for {n:15} minutes, or set the gauge with a master part.', cues: ['mic'], still: 0.95 },
      ],
    },
    {
      id: 's6', lesson: METR, level: 3, dur: DUR[5], still: 0.5, title: { nl: 'Onzekerheid en resolutie', en: 'Uncertainty and resolution' },
      beats: [
        { nl: '{t:Meetonzekerheid|Meetonzekerheid}: het bereik rond de aflezing waarin de echte waarde ligt.', en: '{t:Measurement uncertainty|Measurement uncertainty}: the range around the reading where the true value lies.', cue: { Meetonzekerheid: 'unc' }, still: 0.2 },
        { nl: '{t:Resolutie|Resolutie}: de kleinste stap die het meetmiddel toont.', en: '{t:Resolution|Resolution}: the smallest step the instrument shows.', cue: { Resolutie: 'res' }, still: 0.42 },
        { nl: '{n:10}%-regel: bij een band van {n:0.04} mm is de stap hooguit {n:0.004} mm.', en: '{n:10}% rule: for a band of {n:0.04} mm the step is at most {n:0.004} mm.', cues: ['res'], read: { nl: '±{n:0.02} → band {n:0.04} → stap ≤ {n:0.004} mm', en: '±{n:0.02} → band {n:0.04} → step ≤ {n:0.004} mm' }, still: 0.7 },
        { nl: 'Maar fijn aflezen is nog geen betrouwbaar meten.', en: 'But reading finely is not yet measuring reliably.', cues: ['unc'], still: 0.95 },
      ],
    },
    {
      id: 's7', lesson: METR, level: 3, dur: DUR[6], still: 0.92, title: { nl: 'Gauge R&R', en: 'Gauge R&R' },
      beats: [
        { nl: '{t:Gauge R&R|Gauge R&R}: {n:10} stuks, {n:3} operators, elk stuk {n:3} keer gemeten.', en: '{t:Gauge R&R|Gauge R&R}: {n:10} parts, {n:3} operators, each part measured {n:3} times.', cue: { 'Gauge R&R': 'grr' }, still: 0.29 },
        { nl: '{t:Herhaalbaarheid|Herhaalbaarheid}: één persoon meet steeds hetzelfde stuk.', en: '{t:Repeatability|Repeatability}: one person measures the same part again and again.', cue: { Herhaalbaarheid: 'rep' }, still: 0.42 },
        { nl: '{t:Reproduceerbaarheid|Reproduceerbaarheid}: het verschil tussen mensen.', en: '{t:Reproducibility|Reproducibility}: the difference between people.', cue: { Reproduceerbaarheid: 'repro' }, still: 0.63 },
        { nl: '6σ = {n:0.009} mm: {n:22.5}% van de band. Voorwaardelijk acceptabel.', en: '6σ = {n:0.009} mm: {n:22.5}% of the band. Conditionally acceptable.', cues: ['verdict'], read: { nl: '6 × {n:0.0015} = {n:0.009} · {n:0.009} / {n:0.04} = {n:22.5}%', en: '6 × {n:0.0015} = {n:0.009} · {n:0.009} / {n:0.04} = {n:22.5}%' }, still: 0.92 },
      ],
    },
    {
      id: 's8', lesson: CAP, level: 4, dur: DUR[7], still: 0.9, title: { nl: 'Het gemiddelde wandelt', en: 'The average walks' },
      beats: [
        { nl: '{t:Thermische groei|Thermische groei}: spil en frame warmen op en zetten uit.', en: '{t:Thermal growth|Thermal growth}: spindle and frame warm up and expand.', cue: { 'Thermische groei': 'grow' }, still: 0.24 },
        { nl: '{t:Cpk|Cpk}: afstand van het gemiddelde tot de dichtstbijzijnde grens, gedeeld door 3σ.', en: '{t:Cpk|Cpk}: distance from the mean to the nearest limit, divided by 3σ.', cue: { Cpk: 'cpk' }, still: 0.45 },
        { nl: 'Boring Ø{n:25} ±{n:0.015}, σ {n:0.003}: ’s ochtends Cpk {n:1.67}.', en: 'Bore Ø{n:25} ±{n:0.015}, σ {n:0.003}: in the morning Cpk {n:1.67}.', cues: ['cpk'], read: { nl: '{n:0.015} / (3 × {n:0.003}) = {n:1.67}', en: '{n:0.015} / (3 × {n:0.003}) = {n:1.67}' }, still: 0.68 },
        { nl: '’s Middags staat het gemiddelde op {n:25.006}: Cpk {n:1.0}.', en: 'By the afternoon the average is at {n:25.006}: Cpk {n:1.0}.', cues: ['cpk'], read: { nl: '({n:25.015} − {n:25.006}) / {n:0.009} = {n:1.0}', en: '({n:25.015} − {n:25.006}) / {n:0.009} = {n:1.0}' }, still: 0.95 },
      ],
    },
    {
      id: 's9', lesson: CAP, level: 4, dur: DUR[8], still: 0.75, title: { nl: 'Opwarmen en meten in de machine', en: 'Warm-up and in-machine probing' },
      beats: [
        { nl: 'Een {t:Opwarmprogramma|opwarmprogramma} laat spil en assen eerst in stappen draaien.', en: 'A {t:Warm-up cycle|warm-up cycle} runs spindle and axes at stepped speeds first.', cue: { Opwarmprogramma: 'warm' }, still: 0.22 },
        { nl: '{t:Meten in de machine|Meten in de machine}: een taster in de spil meet de boring.', en: '{t:In-machine probing|In-machine probing}: a touch probe in the spindle measures the bore.', cue: { 'Meten in de machine': 'probe' }, still: 0.43 },
        { nl: 'De besturing past de slijtagecorrectie aan: Cpk {n:1.56}, de hele dag.', en: 'The control corrects the wear offset: Cpk {n:1.56}, all day.', cues: ['cpk2'], read: { nl: '({n:0.015} − {n:0.001}) / {n:0.009} = {n:1.56}', en: '({n:0.015} − {n:0.001}) / {n:0.009} = {n:1.56}' }, still: 0.74 },
        { nl: 'Eerst het meten op orde, dan pas het proces beoordelen.', en: 'Fix the measuring first, then judge the process.', cues: ['probe'], still: 0.95 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. The topic's Basis (fixtures) has its own film, so the
// film opens with a short orientation. Small dimensions are said as a
// machinist says them (vijf micron, twee honderdste); the exact values stand
// in the captions and readouts, asserted above.
const SAY = [
  [ // s1 orientation
    { nl: 'Een stuk komt van de machine. Of het goed is, weet je pas als je het meet, en op dat meten kunt bouwen.',
      en: 'A part comes off the machine. Whether it is good, you only know when you measure it and can trust that measuring.' },
    { nl: 'Eerst het oppervlak, de meetmiddelen en wat warmte met een maat doet.',
      en: 'First the surface, the gauges, and what heat does to a size.' },
    { nl: 'Dan: hoeveel tolerantie kost het meten zelf? En hoe blijft het proces de hele dag capabel?',
      en: 'Then: how much tolerance does the measuring itself use up? And how does the process stay capable all day?' },
  ],
  [ // s2 the surface
    { nl: 'Een ruwheidsmeter trekt een naaldje over het oppervlak en tekent de pieken en dalen. {t:Ra|Ra} is hun gemiddelde hoogte, in micron: hoe lager, hoe gladder. Voordraaien geeft zo’n {n:3.2} tot {n:6.3}, nadraaien {n:0.8} tot {n:1.6}.',
      en: 'A roughness tester draws a fine stylus across the surface and traces its tiny peaks and valleys. {t:Ra|Ra} is their average height, in microns: the lower, the smoother. Rough turning gives about {n:3.2} to {n:6.3}, fine turning {n:0.8} to {n:1.6}.' },
    { nl: 'Een regelmatig golfpatroon is {t:Chatter|chatter}: trilling, omdat het gereedschap te ver uitsteekt, de wand dun is of het toerental niet klopt.',
      en: 'A regular wavy pattern is {t:Chatter|chatter}: vibration, because the tool sticks out too far, the wall is thin or the speed is wrong.' },
    { nl: 'Waar het gereedschap eruit loopt, blijven {t:Bramen|bramen} achter: scherpe randjes, vaak van versleten gereedschap.',
      en: 'Where the tool runs out, {t:Burrs|burrs} are left: sharp ridges, often from worn tools.' },
  ],
  [ // s3 micrometer and go/no-go
    { nl: 'Een schuifmaat is in de praktijk goed tot zo’n twee à drie honderdste. Een {t:Micrometer|micrometer}, een meetklem met een fijne schroef, leest één micron af: genoeg voor plus-min een honderdste.',
      en: 'In practice a caliper is good to about two or three hundredths of a millimetre. A {t:Micrometer|micrometer}, a measuring clamp with a fine screw, reads one micron: enough for plus or minus one hundredth.' },
    { nl: 'De vuistregel: lees zo’n tien keer fijner af dan de tolerantie. En kalibreer volgens schema, tegen een bekende referentie.',
      en: 'The rule of thumb: read about ten times finer than the tolerance. And calibrate on a schedule, against a known reference.' },
    { nl: 'Voor gaten is er een vast kaliber: {t:Gaat/gaat-niet|gaat/gaat-niet}. De ene kant moet erin passen, de andere niet. Geen getal aflezen, dus snel en moeilijk fout te doen.',
      en: 'For holes there is the {t:Go/no-go|go/no-go} plug gauge: one end must fit, the other must not. No number to read, so it is quick and hard to get wrong.' },
  ],
  [ // s4 the CMM
    { nl: 'Vorm en positie meet je in de meetkamer. Een {t:CMM|CMM}, een 3D-meetmachine, tast met een taster, een meetpennetje met een kogeltje, punten af in de boring.',
      en: 'For form and position you go to the measuring room. A {t:CMM|CMM}, a coordinate measuring machine, touches points in the bore with a probe, a small pin with a ball on its tip.' },
    { nl: 'Daaruit rekent hij diameter, rondheid en positie, vanaf de referentievlakken op de tekening.',
      en: 'From them it works out diameter, roundness and position, from the datums on the drawing.' },
    { nl: 'De meetkamer staat op {n:20} graden: de referentietemperatuur voor maten, uit ISO 1.',
      en: 'The room is kept at {n:20} degrees: the reference temperature for sizes, from ISO 1.' },
  ],
  [ // s5 warm part, cold part
    { nl: 'Staal zet uit als het warm wordt, zo’n elf en een halve micron per meter per graad. Aluminium twee keer zoveel.',
      en: 'Steel expands as it warms up, about eleven and a half microns per metre per degree. Aluminium twice that.' },
    { nl: 'Een as van dertig, h6, moet tussen {n:29.987} en dertig liggen. De operator meet hem warm uit de machine, op {n:35} graden: {n:29.990}. Goed.',
      en: 'A shaft of thirty, h6, must measure between {n:29.987} and thirty. The operator measures it warm from the machine, at {n:35} degrees: {n:29.990}. Good.' },
    { nl: 'Maar de klant meet op twintig graden. Daar is de as vijf micron gekrompen, naar {n:29.985}: buiten de tolerantie. De partij wordt afgekeurd.',
      en: 'But the customer measures at twenty degrees. There the shaft has shrunk by five microns, to {n:29.985}: out of tolerance. The batch is rejected.' },
    { nl: 'Dus: laat het stuk een kwartier afkoelen op een vaste plek, of stel het meetmiddel af met een meesterstuk op dezelfde temperatuur.',
      en: 'So: let the part cool for a quarter of an hour in a set place, or set the gauge with a master part at the same temperature.' },
  ],
  [ // s6 uncertainty and resolution
    { nl: 'Elke meting heeft een {t:Meetonzekerheid|meetonzekerheid}: een bereik rond de aflezing waarin de echte waarde ligt. Door het meetmiddel, de persoon, het werkstuk, de temperatuur en de methode.',
      en: 'Every measurement has a {t:Measurement uncertainty|measurement uncertainty}: a range around the reading in which the true value lies. From the instrument, the person, the part, the temperature and the method.' },
    { nl: 'De regel van tien keer fijner gaat over de {t:Resolutie|resolutie}: de kleinste stap die het meetmiddel toont.',
      en: 'The rule of ten times finer is about {t:Resolution|resolution}: the smallest step the instrument shows.' },
    { nl: 'Bij plus-min twee honderdste is de band vier honderdste, dus die stap hooguit vier micron.',
      en: 'At plus or minus two hundredths the band is four hundredths, so that step is four microns at most.' },
    { nl: 'Maar een meter kan één micron tonen en toch vijf micron spreiden.',
      en: 'But a gauge can show one micron and still scatter by five.' },
  ],
  [ // s7 gauge R&R
    { nl: 'Daarom test je het hele meetsysteem met een {t:Gauge R&R|gauge R&R}: herhaalbaarheid en reproduceerbaarheid samen, de toevallige spreiding van het meetsysteem. Bijvoorbeeld tien stuks, drie operators, elk stuk drie keer, blind en door elkaar.',
      en: 'So you test the whole measuring system with a {t:Gauge R&R|gauge R&R}: repeatability and reproducibility together, the random spread of the measuring system. For example ten parts, three operators, each part three times, blind and in random order.' },
    { nl: '{t:Herhaalbaarheid|Herhaalbaarheid} is de spreiding als één persoon hetzelfde stuk steeds opnieuw meet: vooral het meetmiddel.',
      en: '{t:Repeatability|Repeatability} is the spread when one person measures the same part again and again: mostly the instrument.' },
    { nl: '{t:Reproduceerbaarheid|Reproduceerbaarheid} is het verschil tussen mensen: methode en hantering.',
      en: '{t:Reproducibility|Reproducibility} is the difference between people: method and handling.' },
    { nl: 'Bij plus-min twee honderdste is de standaardafwijking van het meten anderhalve micron. Zes keer dat is negen micron: {n:22.5} procent van de band. Volgens het AIAG-handboek is onder tien procent goed, tot dertig voorwaardelijk acceptabel, daarboven niet. De module SPC gaat dieper.',
      en: 'On a shaft of plus or minus two hundredths, the standard deviation of the measuring is one and a half microns. Six times that is nine microns: {n:22.5} percent of the band. By the AIAG manual, under ten percent is good, up to thirty conditionally acceptable, above that not. The SPC module goes deeper.' },
  ],
  [ // s8 thermal growth and Cpk
    { nl: 'Ook de machine groeit: {t:Thermische groei|thermische groei}. Spil, kogelomloopspindels en frame zetten uit, en posities schuiven honderdsten op, vooral tijdens het opwarmen.',
      en: 'The machine grows too: {t:Thermal growth|thermal growth}. Spindle, ball screws and frame expand, and positions shift by hundredths, mostly while warming up.' },
    { nl: '{t:Cpk|Cpk} is de afstand van het gemiddelde tot de dichtstbijzijnde grens, gedeeld door drie sigma: past hij waar hij nu zit? De kwaliteitsmodule legt het uit.',
      en: '{t:Cpk|Cpk} is the distance from the mean to the nearest limit, divided by three sigma: does it fit where it is? The quality module explains it.' },
    { nl: 'Een boring van {n:25}, plus-min vijftien micron, standaardafwijking drie micron. ’s Ochtends ligt het gemiddelde op de maat: Cpk {n:1.67}. Veel klanten vragen {n:1.33} in serie.',
      en: 'A bore of {n:25}, plus or minus fifteen microns, a standard deviation of three microns. In the morning the average sits on size: Cpk {n:1.67}. Many customers ask {n:1.33} in series.' },
    { nl: '’s Middags hebben warmte en slijtage het gemiddelde naar {n:25.006} geschoven: nog negen micron tot de grens, Cpk {n:1.0}. Dezelfde spreiding; alleen het gemiddelde wandelde.',
      en: 'By the afternoon heat and wear have moved the average to {n:25.006}: nine microns left to the limit, Cpk {n:1.0}. The same spread; only the average walked.' },
  ],
  [ // s9 warm-up and in-machine probing
    { nl: 'De oplossing is dus niet meteen een nieuwe machine. Een {t:Opwarmprogramma|opwarmprogramma} laat spil en assen eerst in stappen draaien, bij sommige machines zo’n twintig minuten.',
      en: 'So the fix is not straight away a new machine. A {t:Warm-up cycle|warm-up cycle} runs the spindle and axes at stepped speeds first, about twenty minutes on some machines.' },
    { nl: 'En {t:Meten in de machine|meten in de machine} sluit de lus: een taster in de spil meet de boring.',
      en: 'And {t:In-machine probing|in-machine probing} closes the loop: a touch probe in the spindle measures the bore.' },
    { nl: 'De besturing past de slijtagecorrectie aan, en het gemiddelde blijft binnen één micron van de maat: Cpk {n:1.56}, de hele dag. Mits de taster zelf gekalibreerd is.',
      en: 'The control corrects the wear offset, and the average stays within one micron of size: Cpk {n:1.56}, all day. Provided the probe itself is calibrated.' },
    { nl: 'Dus: eerst het meten op orde, dan het proces beoordelen.',
      en: 'So: get the measuring right first, then judge the process.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, prismOf, disc, sphereOf, arcOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8')
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.iso{--ms-heat:#E39A4C}
.iso[data-theme="light"]{--ms-heat:#C9711F}
.ms-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.ms-hole{fill:var(--anatomy-shade-0);stroke:none}
.ms-wall{fill:none;stroke:var(--anatomy-shade-3);stroke-width:2}
.ms-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.ms-heat{fill:var(--ms-heat);stroke:none}
.ms-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.ms-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.ms-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.ms-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.ms-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.ms-lim{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:6 4}
.ms-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ms-zone{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1}
.ms-zone[data-z="0"]{fill:var(--anatomy-lit-shade)}
.ms-dot{fill:var(--anatomy-hi);stroke:none}
.ms-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6}
.ms-tube{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.4}
.ms-wave{fill:none;stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.ms-burr{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-chip{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .ms-wave{stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .ms-burr{fill:var(--fp-accent);stroke:var(--fp-accent)}
[data-cue][data-on] .ms-curve,[data-hi] .ms-curve,.ms-curve[data-c="acc"]{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .ms-dot,[data-hi] .ms-dot{fill:var(--fp-accent)}
[data-cue][data-on] .ms-ring,[data-hi] .ms-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .ms-tube{stroke:var(--fp-accent)}
[data-cue][data-on] .ms-big,[data-hi] .ms-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .ms-zone[data-z="1"],[data-hi].ms-zone{fill:color-mix(in srgb,var(--fp-accent) 30%,var(--anatomy-shade-3));stroke:var(--fp-accent)}
.ms-acc{fill:var(--fp-accent);stroke:none}
.ms-pt{stroke:var(--anatomy-shade-0);stroke-width:1.2;vector-effect:non-scaling-stroke}
.ms-fit{stroke-width:2;vector-effect:non-scaling-stroke}
.ms-halo{paint-order:stroke;stroke:var(--anatomy-shade-0);stroke-width:5px;stroke-linejoin:round}
.ms-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-linecap:round}
[data-hi] .iso-edge,[data-hi] .iso-crease,[data-hi] .iso-line{stroke:var(--fp-accent)!important}
[data-hi] .iso-top{fill:var(--anatomy-lit-top)}
[data-hi] .iso-shade{fill:var(--anatomy-lit-shade)}
`;

const label = {
  nl: 'Drie plekken naast elkaar. Een bewerkingscentrum met een kolom, een kop met spil en een taster, en een blok met een boring in een bankschroef. Een werkbank met een gedraaide stalen as van 30 mm op twee V-blokken, een micrometer, een ruwheidsmeter en een ring met een gaat/gaat-niet-kaliber. Een meetkamer met een 3D-meetmachine op een granieten plaat. Grafieken tonen het ruwheidsprofiel, de temperatuur en de tolerantie, de resolutie, een gauge R&R en het gemiddelde van de boring over een dag.',
  en: 'Three places side by side. A machining centre with a column, a head with a spindle and a touch probe, and a block with a bore in a vice. A bench with a turned 30 mm steel shaft on two V-blocks, a micrometer, a roughness tester and a ring with a go/no-go plug gauge. A measuring room with a CMM on a granite plate. Charts show the roughness profile, the temperature and the tolerance, the resolution, a gauge R&R and the mean of the bore over a day.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

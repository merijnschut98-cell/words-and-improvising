// Dev tool, not shipped. Builds the explainer film "Omstellen en varianten /
// Changeovers and variants" for the topic Varianten en omstellen of Lijnen en
// automatisering (variants L1, linechange L2, mixed L3, sequencing L4).
//
//   node films/eng.lines.variants/build.mjs            build the page
//   node films/eng.lines.variants/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.lines.variants.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.4.
//
// The drawing is the line of the figure eng.lines.mixed: a paced assembly line
// with five stations over a roller conveyor. Carriers bring products in three
// variants, small, medium and large (S, M, L; at level 4 they stand in for the
// A, B and C of the lesson's e-bike welding station, and the caption, the voice
// and the card say that the numbers are that example's); every station
// has grip fingers, the change parts, that fit the variant. Round it: the
// operator panel with the recipe, a cart with change parts on locating pins,
// a rack of kits in build order behind stations 4 and 5, a pre-assembly table,
// the floater, the andon lamp and the lag ruler of station 5, and a heijunka
// box. Cards in stage space carry the sums: the shift bar (L1), the filmed
// changeover split into internal and external work (L2), the work content of
// station 5 and the operator's lag (L3), the levelled pattern and the frozen
// sequence (L4). Terms follow eng.flow: SMED, intern werk, extern werk.
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
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Same model as the figure eng.lines.mixed.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// variants: 420 min, one product a minute, 4 changeovers of 20 min → 340 (−19 %); 2 → 380
const SHIFT = 420;
const CO = 20;
const out = (n) => SHIFT - n * CO;
assert(out(4) === 340 && out(2) === 380, '420 − 4 × 20 = 340; 420 − 2 × 20 = 380');
assert(near((4 * CO) / SHIFT, 0.19, 0.005), '80 / 420 = 19 %');
// linechange: 15 searching + 20 swapping 6 change parts + 15 adjusting = 50; step 1 → 35; step 2 → 10 + 5 = 15; 2 × 35 = 70
const SMED = [[15, 20, 15], [0, 20, 15], [0, 10, 5]];
const sum = (a) => a.reduce((s, v) => s + v, 0);
assert(sum(SMED[0]) === 50 && sum(SMED[1]) === 35 && sum(SMED[2]) === 15, 'SMED 50 → 35 → 15 min');
assert(2 * (sum(SMED[0]) - sum(SMED[2])) === 70, '2 × 35 = 70 min a shift');
// mixed: takt 120; station 5: S 100, M 120, L 160; mix 50/30/20 → 118; two L in a row → 80 s behind; one S gives back 20
const TAKT = 120;
const WORK = { S: 100, M: 120, L: 160 };
const MIX = { S: 0.5, M: 0.3, L: 0.2 };
const lagsOf = (seq, work, takt) => { let lag = 0; return seq.map((v) => (lag = Math.max(0, lag + work[v] - takt))); };
assert(near(sum(Object.keys(WORK).map((v) => WORK[v] * MIX[v])), 118), 'weighted mean 118 s');
const GROUPS = ['S', 'S', 'M', 'L', 'L', 'S', 'M', 'S', 'S', 'M'];
const RULE = ['L', 'S', 'S', 'M', 'S', 'M', 'L', 'S', 'S', 'M'];
assert(Math.max(...lagsOf(GROUPS, WORK, TAKT)) === 80, 'L L → 80 s behind');
assert(Math.max(...lagsOf([...RULE, ...RULE], WORK, TAKT)) === 40, 'after every L two S: at most 40 s');
for (const seq of [GROUPS, RULE]) assert(seq.filter((v) => v === 'S').length === 5 && seq.filter((v) => v === 'L').length === 2, 'both sequences carry the 50/30/20 mix');
assert(WORK.L - TAKT === 40 && TAKT - WORK.S === 20, 'L 40 over, S 20 under');
// sequencing: 25.200 / 360 = 70 s; A 60, B 70, C 100; 180 : 120 : 60 = 3 : 2 : 1 → A B A C A B; a block of 60 C → 1.800 s = 30 min
const HJ = { demand: { A: 180, B: 120, C: 60 }, work: { A: 60, B: 70, C: 100 }, pattern: ['A', 'B', 'A', 'C', 'A', 'B'] };
const TAKT4 = 25200 / 360;
assert(TAKT4 === 70, 'takt 70 s');
assert(sum(HJ.pattern.map((v) => HJ.work[v])) === 6 * 70, 'one round 420 s = 6 × 70');
const day = (mode) => (mode === 'pattern' ? Array.from({ length: 60 }, () => HJ.pattern).flat() : ['A', 'B', 'C'].flatMap((v) => Array(HJ.demand[v]).fill(v)));
const LAG_BLOCKS = lagsOf(day('blocks'), HJ.work, TAKT4);
const LAG_PATTERN = lagsOf(day('pattern'), HJ.work, TAKT4);
assert(Math.max(...LAG_BLOCKS) === 1800 && Math.max(...LAG_PATTERN) === 30, 'blocks 1.800 s, pattern within one C');

// ---------------------------------------------------------------- the world (cm, as the figure)
// x downstream, y toward the front (the viewer), z up; the floor plate's top is z = 0.
const W = 640;
const H = 400;
const BASE = { x: -134, y: -48, w: 268, d: 100, r: 2 };
const BED = { x0: -112, x1: 112, y: 9, z0: 15, z1: 18 };
const RAIL_H = 3;
const STN = [-72, -36, 0, 36, 72];
const PITCH = 36;
const X_IN = -108; // a carrier's x when it enters (k = 0); station k at X_IN + 36 k
const POST_Y = -22;
const ARM_Z = [46, 50];
const SLIDE_Z = 39.4;
const PAL = { h: 2, half: 6.5, z0: 18 };
const PROD = { S: { w: 9, h: 7 }, M: { w: 11, h: 11 }, L: { w: 13, h: 15 } };
const FING = { len: 6, t: 1.2, half: 3 };
const HMI = { x: -122, y: 16, w: 16, d: 3, z0: 20, z1: 32 };
const CART = { from: -104, to: -70, y: 33, w: 22, d: 10, z0: 6, z1: 8 };
const RACK = { x: 46, y: -46, w: 40, d: 8 };
const RULER = { x0: 64, x1: 112, y: 16, d: 5, max: 120 };
const SUB = { x: 14, y: 24, w: 26, d: 14, z: 14 };
const FLOAT = { x: 84, y: 34, from: 130 };
const HBOX = { x: -46, y: 30, w: 24, d: 3, z0: 2, z1: 15 };
const C = {
  W, H, BED, STN, PITCH, X_IN, POST_Y, ARM_Z, SLIDE_Z, PAL, PROD, FING, CART, RULER, FLOAT, HBOX,
  SHIFT, CO, SMED, TAKT, WORK, MIX, GROUPS, RULE, HJ,
};

const FIT = [...k.boxCorners(BASE, -6, 0), [STN[0], POST_Y, 58], [STN[4], POST_Y, 58], [RACK.x, RACK.y, 32], [RACK.x + RACK.w, RACK.y, 32]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 62, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.3, steps = 2) => S(k.slabOf({ r: 0.4, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 16) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const alongY = (x, z, y0, y1, r, style = {}, steps = 16) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P, { steps }), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.4, ...plan }, z, P, inset), { tone: 'faint' });
const screws = (plan, z, inset = 2) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.4 });

// ---------------------------------------------------------------- floor plate, ruler, feet
const floor = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -2), -6, 2, P)}"/>`,
  ...k.corners(BASE, 8).map(([x, y]) => post(x, y, 4, -6, -3.5, { tone: 'lo' }, 16)),
  box(BASE, -3.5, 0, { tone: 'lo', inner: seam(BASE, -1.8, 3) }, 0.6, 3),
  L(k.planOutline(k.insetPlan(BASE, 2.6), 0, P, 3), { tone: 'faint' }),
  L(k.corners(BASE, 4).map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(''), { tone: 'lo' }),
  Dt(k.corners(BASE, 4).map(([x, y]) => at([x, y, 0])), { size: 0.45 }),
].join('');
// the label plate at the front left, three engraved rules
const LP = { x: -96, y: 40, w: 22, d: 8, r: 0.5 };
const labelPlate = box(LP, 0, 0.4, { tone: 'lo', crease: 'none' }, 0, 2)
  + L([0, 1, 2].map((i) => k.lineOnTop([LP.x + 2.4, LP.y + 2 + i * 2], [LP.x + 2.4 + [14, 10, 12][i], LP.y + 2 + i * 2], 0.4, P)).join(''), { tone: 'lo', free: true })
  + Dt(k.corners(LP, 1).map(([x, y]) => at([x, y, 0.4])), { size: 0.3 });
// the lag ruler in front of station 5: 0..120 s, a tick every 10 s, a major every 30 s, the call mark at 60 s
const SPAN = (RULER.x1 - RULER.x0) / RULER.max;
const ruler = (() => {
  const rs = { x: RULER.x0 - 1.5, y: RULER.y, w: RULER.x1 - RULER.x0 + 3, d: RULER.d, r: 0.3 };
  const minor = [];
  const major = [];
  for (let s = 0; s <= RULER.max; s += 10) {
    const x = RULER.x0 + s * SPAN;
    (s % 30 === 0 ? major : minor).push(k.lineOnTop([x, rs.y], [x, rs.y + (s % 30 === 0 ? 3.4 : 1.8)], 0.4, P));
  }
  const cx = RULER.x0 + 60 * SPAN;
  return box(rs, 0, 0.4, { tone: 'lo', crease: 'none' }, 0, 2) + L(minor.join(''), { tone: 'mid' }) + L(major.join(''), { tone: 'hi' })
    + `<path class="vr-call" d="${k.pathOf([[cx, rs.y, 0.45], [cx, rs.y + rs.d, 0.45]].map(at))}"/>`;
})();

// ---------------------------------------------------------------- the rack of kits in build order (behind stations 4 and 5)
const rack = (() => {
  const { x, y, w, d } = RACK;
  let s = '';
  for (const py of [y + 1, y + d - 1]) for (const px of [x + 1, x + w - 1]) s += post(px, py, 0.9, 0, 30, { crease: 'none' }, 10);
  for (const z of [10, 22]) {
    s += box({ x: x + 1.9, y, w: w - 3.8, d }, z, z + 1.2, {}, 0.2, 1);
    for (let n = 0; n < 5; n++) {
      const kb = { x: x + 2.4 + n * 7.1, y: y + 1.2, w: 6, d: d - 2.4 };
      s += box(kb, z + 1.2, z + 5, { tone: n === 0 ? 'hi' : 'lo', crease: 'lo' }, 0.2, 1);
      // the kit's card: the product it is for, as 1–3 dots
      const dots = [1, 1, 2, 1, 3][n] + (z > 15 ? 0 : 0);
      s += Dt(Array.from({ length: dots }, (_, i) => at([kb.x + 1.6 + i * 1.4, kb.y + kb.d, z + 3.2])), { size: 0.32, tone: 'hi' });
    }
  }
  return s;
})();

// ---------------------------------------------------------------- the stations (posts behind the line)
const stationBack = STN.map((sx, i) => [
  post(sx, POST_Y, 4, 0, 1.4, { tone: 'lo' }, 20),
  Dt([at([sx - 3, POST_Y, 1.4]), at([sx + 3, POST_Y, 1.4])], { size: 0.4 }),
  post(sx, POST_Y, 2, 1.4, ARM_Z[0], { crease: 'none' }, 16),
  L(k.sideArc(sx, POST_Y, 2, 12, P, 14), { tone: 'faint' }),
  box({ x: sx - 2.5, y: POST_Y + 2, w: 5, d: 0.6 }, 26, 32, { tone: 'lo' }, 0, 1),
  Dt(Array.from({ length: i + 1 }, (_, n) => at([sx - 1.6 + n * 0.8, POST_Y + 2.6, 29])), { size: 0.3, tone: 'hi' }),
].join('')).join('');
const stationFront = STN.map((sx, i) => {
  const arm = { x: sx - 2.5, y: POST_Y - 2.5, w: 5, d: -POST_Y + 5 };
  return box(arm, ARM_Z[0], ARM_Z[1], { tone: i === 4 ? 'hi' : 'mid', crease: 'lo' }, 0.3)
    + Dt([at([sx, POST_Y, ARM_Z[1]]), at([sx, 0, ARM_Z[1]])], { size: 0.4 })
    + post(sx, 0, 3.2, 40.5, ARM_Z[0], { tone: 'hi', crease: 'lo' }, 20)
    + L(k.sideArc(sx, 0, 3.2, ARM_Z[0] - 1.6, P, 16), { tone: 'faint' });
}).join('');
// station 5's andon lamp on its post
const lamp = post(STN[4], POST_Y, 2.4, ARM_Z[1], ARM_Z[1] + 1.4, {}, 16)
  + g('lamp', post(STN[4], POST_Y, 1.9, ARM_Z[1] + 1.4, ARM_Z[1] + 6.4, { crease: 'lo' }, 16))
  + post(STN[4], POST_Y, 2.1, ARM_Z[1] + 6.4, ARM_Z[1] + 7.2, {}, 16) + Dt([at([STN[4], POST_Y, ARM_Z[1] + 7.2])], { size: 0.4, tone: 'hi' });

// ---------------------------------------------------------------- the conveyor
const LEGS = [-104, -54, -18, 18, 54, 104];
const convBack = (() => {
  let s = '';
  for (const x of LEGS) for (const y of [-6, 6]) s += post(x, y, 1.4, 0, BED.z0, { crease: 'none' }, 10);
  for (const x of LEGS) s += box({ x: x - 1, y: -4.6, w: 2, d: 9.2 }, 6, 8, { tone: 'lo' }, 0, 1);
  const bed = { x: BED.x0, y: -BED.y, w: BED.x1 - BED.x0, d: 2 * BED.y, r: 0.6 };
  const rollers = [];
  for (let x = BED.x0 + 4; x < BED.x1 - 2; x += 4) rollers.push(k.lineOnTop([x, -BED.y + 2], [x, BED.y - 2], BED.z1, P));
  s += box(bed, BED.z0, BED.z1, { inner: seam(bed, BED.z0 + 1.5) + L(rollers.join(''), { tone: 'faint' }) }, 0.3);
  s += alongY(BED.x0 - 2.2, BED.z0 + 1.5, -BED.y + 0.6, BED.y - 0.6, 2.2, { crease: 'none' }, 16);
  s += box({ x: BED.x0, y: -BED.y, w: BED.x1 - BED.x0, d: 1.6, r: 0.2 }, BED.z1, BED.z1 + RAIL_H, { tone: 'hi', crease: 'lo' }, 0, 1);
  return s;
})();
const convFront = (() => {
  const fr = { x: BED.x0, y: BED.y - 1.6, w: BED.x1 - BED.x0, d: 1.6, r: 0.2 };
  const bolts = [];
  for (let x = BED.x0 + 6; x < BED.x1; x += 20) bolts.push(at([x, BED.y, BED.z1 + RAIL_H / 2]));
  return box(fr, BED.z1, BED.z1 + RAIL_H, { tone: 'hi', crease: 'lo' }, 0, 1) + Dt(bolts, { size: 0.35 })
    + alongY(BED.x1 + 2.2, BED.z0 + 1.5, -BED.y + 0.6, BED.y - 0.6, 2.2, { crease: 'none' }, 16)
    + box({ x: BED.x1 - 9, y: BED.y, w: 7, d: 4 }, BED.z0 - 6, BED.z1, {}, 0.3)
    + Dt([at([BED.x1 - 7.5, BED.y + 4, BED.z1 - 1.5]), at([BED.x1 - 3.5, BED.y + 4, BED.z1 - 1.5])], { size: 0.35 })
    + alongY(BED.x1 - 5.5, BED.z0 - 2.5, BED.y + 4, BED.y + 12, 2.6, { tone: 'hi', crease: 'lo' }, 16)
    + Dt([at([BED.x1 - 5.5, BED.y + 12, BED.z0 - 2.5])], { size: 0.4, tone: 'hi' });
})();

// ---------------------------------------------------------------- the operator panel with the recipe
const hmi = (() => {
  const cx = HMI.x + HMI.w / 2;
  const fy = HMI.y + HMI.d;
  const face = (x0, x1, z0, z1) => k.pathOf([[x0, fy, z1], [x1, fy, z1], [x1, fy, z0], [x0, fy, z0]].map(at), true);
  let s = post(cx, HMI.y + 1.5, 4, 0, 1.2, { tone: 'lo' }, 20) + post(cx, HMI.y + 1.5, 1.4, 1.2, HMI.z0, { crease: 'none' }, 12);
  s += box({ x: HMI.x, y: HMI.y, w: HMI.w, d: HMI.d, r: 0.5 }, HMI.z0, HMI.z1, {}, 0.4);
  s += `<path class="vr-screen" d="${face(HMI.x + 1.6, HMI.x + HMI.w - 1.6, HMI.z0 + 3, HMI.z1 - 1.6)}"/>`;
  s += L([0, 1].map((i) => k.segment([HMI.x + 3, fy, HMI.z1 - 3 - i * 1.6], [HMI.x + 3 + [7, 5][i], fy, HMI.z1 - 3 - i * 1.6], P)).join(''), { tone: 'lo', free: true });
  s += [0, 1, 2].map((n) => `<path class="vr-cell" d="${face(HMI.x + 3 + n * 3.6, HMI.x + 5.8 + n * 3.6, HMI.z0 + 4.4, HMI.z0 + 7)}"/>`).join('');
  s += Dt([[HMI.x + HMI.w - 3, fy, HMI.z0 + 1.5], [HMI.x + HMI.w - 5, fy, HMI.z0 + 1.5]].map(at), { size: 0.4 });
  // the order scanner on a short cable at the panel's side
  s += box({ x: HMI.x + HMI.w + 1, y: HMI.y, w: 2.4, d: 3, r: 0.4 }, HMI.z0 + 1, HMI.z0 + 6, { tone: 'hi', crease: 'lo' }, 0.2, 1);
  s += k.wireSvg(at([HMI.x + HMI.w + 2.2, HMI.y + 1.5, HMI.z0 + 1]), at([HMI.x + HMI.w, HMI.y + 1.5, HMI.z0 + 0.5]), { via: [at([HMI.x + HMI.w + 2.6, HMI.y + 1.5, HMI.z0 - 2])], size: 0.5 });
  return s;
})();

// ---------------------------------------------------------------- the change-part cart (moves in: data-k cartg)
const cart = (() => {
  const cx = CART.from;
  const cy = CART.y;
  const p = { x: cx - CART.w / 2, y: cy - CART.d / 2, w: CART.w, d: CART.d, r: 0.5 };
  let s = '';
  for (const [x, y] of k.corners(p, 2)) s += post(x, y, 1.6, 0, 1.6, { tone: 'lo' }, 12);
  for (const [x, y] of k.corners(p, 2)) s += post(x, y, 0.6, 1.6, CART.z0, { crease: 'none' }, 8);
  s += box(p, CART.z0, CART.z1, { inner: seam(p, CART.z0 + 1) }, 0.3);
  s += box({ x: p.x - 1.2, y: cy - 4, w: 1.2, d: 8, r: 0.2 }, CART.z1, CART.z1 + 10, {}, 0, 1);
  s += post(p.x - 0.6, cy, 0.7, CART.z1 + 10, CART.z1 + 11, { tone: 'hi' }, 8);
  // three finger sets, one per variant, each on two locating pins
  [9, 11, 13].forEach((gap, n) => {
    const fx = p.x + 4 + n * 6.6;
    s += post(fx + 1, cy - 2.5, 0.5, CART.z1, CART.z1 + 1.4, { tone: 'lo' }, 8) + post(fx + 1, cy + 2.5, 0.5, CART.z1, CART.z1 + 1.4, { tone: 'lo' }, 8);
    s += box({ x: fx, y: cy - 3 - n * 0.3, w: 2.2, d: 6 + n * 0.6, r: 0.3 }, CART.z1, CART.z1 + 1.2 + n * 0.4, { tone: 'hi', crease: 'lo' }, 0.2, 1);
    s += Dt([at([fx + 1.1, cy, CART.z1 + 1.2 + n * 0.4])], { size: 0.32, tone: 'hi' });
  });
  return s;
})();

// ---------------------------------------------------------------- the pre-assembly table (front, by station 4)
const sub = (() => {
  const t = { x: SUB.x, y: SUB.y, w: SUB.w, d: SUB.d, r: 0.6 };
  let s = '';
  for (const [x, y] of k.corners(t, 2)) s += post(x, y, 0.9, 0, SUB.z - 1, { crease: 'none' }, 10);
  s += box({ x: t.x + 1.4, y: t.y + 1.4, w: t.w - 2.8, d: 1, r: 0.2 }, 4, 5, { tone: 'lo' }, 0, 1);
  s += box(t, SUB.z - 1, SUB.z, { inner: seam(t, SUB.z - 0.5, 2) }, 0.3) + screws(t, SUB.z, 1.6);
  // a fixture and the module being built on it
  s += box({ x: t.x + 8, y: t.y + 3.5, w: 10, d: 7 }, SUB.z, SUB.z + 1.4, { tone: 'lo' }, 0.2, 1);
  s += box({ x: t.x + 9.5, y: t.y + 4.5, w: 7, d: 5, r: 0.6 }, SUB.z + 1.4, SUB.z + 5, { tone: 'hi', crease: 'lo', inner: seam({ x: t.x + 9.5, y: t.y + 4.5, w: 7, d: 5 }, SUB.z + 4, 1.5) }, 0.3);
  s += Dt([at([t.x + 11, t.y + 9.5, SUB.z + 3]), at([t.x + 13, t.y + 9.5, SUB.z + 3]), at([t.x + 15, t.y + 9.5, SUB.z + 3])], { size: 0.35 });
  // a parts tray at the side
  s += box({ x: t.x + 20, y: t.y + 3, w: 4.5, d: 8, r: 0.3 }, SUB.z, SUB.z + 1.6, { tone: 'lo', crease: 'lo' }, 0.2, 1);
  return s;
})();

// ---------------------------------------------------------------- the floater (a person, flat-iso; moves in: data-k floater)
const person = (() => {
  const x = FLOAT.x;
  const y = FLOAT.y;
  const parts = [
    { p: [x - 2.2, y, 1], s: box({ x: x - 3.6, y: y - 2.4, w: 2.8, d: 4.4, r: 0.8 }, 0, 1.5, { tone: 'lo' }, 0.2, 2) },
    { p: [x + 2.2, y, 1], s: box({ x: x + 0.8, y: y - 2.4, w: 2.8, d: 4.4, r: 0.8 }, 0, 1.5, { tone: 'lo' }, 0.2, 2) },
    { p: [x - 2.2, y, 8], s: post(x - 2.2, y, 1.5, 1.5, 15, { tone: 'lo' }, 12) },
    { p: [x + 2.2, y, 8], s: post(x + 2.2, y, 1.5, 1.5, 15, { tone: 'lo' }, 12) },
    { p: [x, y, 21], s: box({ x: x - 4, y: y - 2.5, w: 8, d: 5, r: 1.8 }, 15, 28, { inner: seam({ x: x - 4, y: y - 2.5, w: 8, d: 5, r: 1.8 }, 23, 3) + seam({ x: x - 4, y: y - 2.5, w: 8, d: 5, r: 1.8 }, 21.5, 3) }, 0.4, 3) },
    { p: [x - 5.2, y, 22], s: post(x - 5.2, y - 0.5, 1.2, 17, 27.5, {}, 10) },
    { p: [x + 5.2, y, 22], s: post(x + 5.2, y - 0.5, 1.2, 17, 27.5, {}, 10) },
    { p: [x, y, 29], s: post(x, y, 1.2, 28, 29.6, { tone: 'lo' }, 10) },
    { p: [x, y, 32.5], s: S(G.sphereOf([x, y, 32.6], 3.2, P), { tone: 'hi', crease: 'none' }) },
  ];
  return parts.sort((a, b) => k.depthOf(a.p, P) - k.depthOf(b.p, P)).map((q) => q.s).join('');
})();

// ---------------------------------------------------------------- the heijunka box (front left); cards are live
const hbox = (() => {
  const fy = HBOX.y + HBOX.d;
  let s = box({ x: HBOX.x + 1, y: HBOX.y - 2, w: HBOX.w - 2, d: HBOX.d + 4 }, 0, HBOX.z0, { tone: 'lo' }, 0.2, 1);
  s += box({ x: HBOX.x, y: HBOX.y, w: HBOX.w, d: HBOX.d, r: 0.3 }, HBOX.z0, HBOX.z1, { inner: seam({ x: HBOX.x, y: HBOX.y, w: HBOX.w, d: HBOX.d }, HBOX.z1 - 1.2, 1) }, 0.2);
  const slots = [];
  for (let n = 0; n < 6; n++) slots.push(k.pathOf([[HBOX.x + 1.4 + n * 3.6, fy, HBOX.z1 - 2.4], [HBOX.x + 4.2 + n * 3.6, fy, HBOX.z1 - 2.4], [HBOX.x + 4.2 + n * 3.6, fy, HBOX.z0 + 2], [HBOX.x + 1.4 + n * 3.6, fy, HBOX.z0 + 2]].map(at), true));
  s += `<path class="vr-slot" d="${slots.join('')}"/>`;
  return s;
})();

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('shift', g('shiftBg', '') + cue('co', g('shiftCo', '')) + cue('batch', g('shiftRun', '')) + g('shiftTx', '')),
  g('recipe', '', ' data-cue="hmi"'),
  g('smedc', cue('smed', g('smedBase', '') + cue('ext', g('smedExt', '')) + cue('int', g('smedInt', '')))),
  g('workc', '', ' data-cue="work"'),
  g('lagc', cue('lag', g('lagIn', '')) + cue('rule', g('ruleIn', ''))),
  g('dayc', cue('pattern', g('dayIn', ''))),
  g('queue', cue('frozen', g('queueIn', ''))),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  floor,
  labelPlate,
  cue('lag', ruler + g('lagm', '')),
  cue('rack', rack),
  cue('stations', stationBack),
  convBack,
  g('carB', ''),
  cue('servo', cue('fingers', g('fingB', ''))),
  cue('carriers', g('car', '')),
  cue('variant', g('carHi', '')),
  convFront,
  cue('servo', cue('fingers', g('fingF', ''))),
  cue('stations', stationFront),
  lamp,
  cue('hmi', hmi),
  cue('hbox', hbox + g('cards', '')),
  cue('sub', sub),
  g('cartg', cue('cart', cart)),
  g('floater', cue('floater', person)),
].join('');

// Static paths written with relative line-tos (as in eng.machining.measuring):
// the same points to 0,1, about a third fewer bytes. Only M, L and Z paths at
// one decimal are rewritten, and each rewrite is read back and compared.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let res = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && res && !/[MlZ]$/.test(res) && s[0] !== '-') res += ' ';
    res += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put('M', p); cur = p; start = p; cmd = 'L'; } else { put('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
  }
  return res;
}
function pointsOf(d) {
  const tok = d.match(/[MLZlz]|-?\d*\.?\d+/g);
  const res = [];
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  for (let i = 0; i < tok.length;) {
    if (/[MLZlz]/.test(tok[i])) { cmd = tok[i++]; if (/[Zz]/.test(cmd)) { res.push('Z'); cur = start; } continue; }
    const v = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    cur = cmd === 'l' ? [cur[0] + v[0], cur[1] + v[1]] : v;
    if (cmd === 'M') { start = cur; cmd = 'L'; res.push('M'); }
    res.push(cur.join());
  }
  return res.join(' ');
}
const compact = (html) => html.replace(/ d="([MLZ\d.\s-]+)"/g, (m, d) => {
  if (/\.\d\d/.test(d)) return m;
  const c = compactPath(d);
  if (pointsOf(c) !== pointsOf(d)) throw new Error(`compactPath changed a path: ${d.slice(0, 60)}`);
  return ` d="${c}"`;
});
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// frame(points, rect): the camera [cx, cy, w] that fits the points' screen box into rect (stage units).
function frame(points, [x0, y0, x1, y1]) {
  const sp = points.map(at);
  const xs = sp.map((p) => p[0]);
  const ys = sp.map((p) => p[1]);
  const bw = Math.max(...xs) - Math.min(...xs);
  const bh = Math.max(...ys) - Math.min(...ys);
  const s = Math.min((x1 - x0) / bw, (y1 - y0) / bh);
  const bx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const by = (Math.max(...ys) + Math.min(...ys)) / 2;
  const r = (v) => Math.round(v * 10) / 10;
  return [r(bx - ((x0 + x1) / 2 - W / 2) / s), r(by - ((y0 + y1) / 2 - H / 2) / s), r(W / s)];
}
const boxPts = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
const ALL = frame(FIT, [6, 6, 634, 394]);
const TOPV = frame(FIT, [6, 4, 634, 244]);
const LINE = frame(boxPts(-118, 118, -24, 12, 0, 52), [6, 4, 634, 244]);
const LEFT = frame(boxPts(-126, -24, -24, 40, 0, 52), [6, 10, 360, 390]);
const LEFTB = frame(boxPts(-126, 10, -24, 40, 0, 52), [6, 4, 634, 244]);
const RIGHT = frame(boxPts(20, 120, -48, 40, 0, 58), [6, 4, 634, 244]);
const RIGHTF = frame(boxPts(-24, 120, -48, 44, 0, 58), [6, 6, 634, 394]);
const LINEF = frame(boxPts(-118, 118, -24, 14, 0, 52), [6, 6, 634, 394]);
const HJV = frame(boxPts(-60, 118, -24, 36, 0, 52), [6, 4, 634, 244]);
const CAM = [
  { from: ALL, to: frame(boxPts(-110, 110, -30, 40, 0, 56), [6, 6, 634, 394]), a: 0.05, b: 0.95 },
  { from: TOPV, to: LINE, a: 0.1, b: 0.5 },
  { from: LEFTB, to: LEFT, a: 0.05, b: 0.3 },
  { from: LEFTB, to: LINE, a: 0.5, b: 0.8 },
  { from: LINE, to: RIGHT, a: 0.05, b: 0.35 },
  { from: RIGHT, to: RIGHTF, a: 0.35, b: 0.6 },
  { from: TOPV, to: HJV, a: 0.3, b: 0.6 },
  { from: HJV, to: LINEF, a: 0.5, b: 0.75 },
];
C.CAM = CAM;

// ---------------------------------------------------------------- the film
const VAR = 'eng.lines.variants';
const LCH = 'eng.lines.linechange';
const MXD = 'eng.lines.mixed';
const SEQ = 'eng.lines.sequencing';
const spec = {
  id: 'eng.lines.variants',
  title: { nl: 'Omstellen en varianten', en: 'Changeovers and variants' },
  lessons: [VAR, LCH, MXD, SEQ],
  scenes: [
    {
      // the Basis "how it works": one paced line, products in variants
      id: 's1', lesson: VAR, level: 1, still: 0.5, title: { nl: 'Eén lijn, meerdere varianten', en: 'One line, several variants' },
      beats: [
        { nl: 'Een getakte lijn: vijf stations, en elke takt schuift elk product één station door.', en: 'A paced line: five stations, and every takt each product moves on one station.', cues: ['stations'] },
        { nl: 'Een {t:Variant|variant} is een versie van hetzelfde product: hier klein, middel en groot.', en: 'A {t:Variant|variant} is a version of the same product: here small, medium and large.', cue: { Variant: 'variant' } },
        { nl: 'Een {t:Mixed-model lijn|mixed-model lijn} bouwt ze door elkaar, product voor product.', en: 'A {t:Mixed-model line|mixed-model line} builds them mixed, product by product.', cue: { 'Mixed-model lijn': 'carriers' } },
        { nl: 'Eén lijn voor alle varianten scheelt vloerruimte en investering.', en: 'One line for all variants saves floor space and investment.', cues: ['stations', 'carriers'] },
      ],
    },
    {
      id: 's2', lesson: VAR, level: 1, still: 0.5, title: { nl: 'Omstellen kost output', en: 'A changeover costs output' },
      beats: [
        { nl: '{t:Omstellen|Omstellen}: van het laatste goede product tot het eerste goede van de volgende variant.', en: '{t:Changeover|Changeover}: from the last good product to the first good one of the next variant.', cue: { Omstellen: 'co' }, cues: ['fingers'] },
        { nl: 'Een dienst van {n:420} minuten, {n:4} keer {n:20} minuten omstellen: {n:80} minuten zonder output.', en: 'A shift of {n:420} minutes, {n:4} changeovers of {n:20} minutes: {n:80} minutes without output.', cues: ['co'], read: { nl: '{n:420} − {n:80} = {n:340} stuks · −{n:19}%', en: '{n:420} − {n:80} = {n:340} products · −{n:19}%' } },
        { nl: '{t:Seriegrootte|Seriegrootte}: hoeveel producten van één variant tussen twee keer omstellen.', en: '{t:Batch size|Batch size}: how many products of one variant between two changeovers.', cue: { Seriegrootte: 'batch' }, cues: ['carriers'] },
        { nl: 'Twee keer omstellen: {n:380} stuks. Maar meer voorraad, en een klant wacht langer.', en: 'Two changeovers: {n:380} products. But more stock, and a customer waits longer.', cues: ['batch'] },
      ],
    },
    {
      id: 's3', lesson: LCH, level: 2, still: 0.5, title: { nl: 'Recept en formaatdelen', en: 'Recipe and change parts' },
      beats: [
        { nl: 'De softwarehelft van omstellen: het {t:Recept|recept}, de instellingen per variant in de PLC.', en: 'The software half of a changeover: the {t:Recipe|recipe}, the settings per variant in the PLC.', cue: { Recept: 'hmi' } },
        { nl: 'De operator scant de order, en de machine laadt het juiste recept.', en: 'The operator scans the order, and the machine loads the right recipe.', cues: ['hmi'] },
        { nl: 'De hardwarehelft: het {t:Formaatdeel|formaatdeel}, een deel dat per variant verschilt, zoals een grijpervinger.', en: 'The hardware half: {t:Change part|change parts}, such as grip fingers that differ per variant.', cue: { Formaatdeel: 'fingers' } },
        { nl: 'Goede formaatdelen zitten op paspennen, met snelspanners, en staan klaar op een kar.', en: 'Good change parts sit on locating pins, with quick clamps, ready on a cart.', cues: ['cart'] },
      ],
    },
    {
      id: 's4', lesson: LCH, level: 2, still: 0.5, title: { nl: 'SMED: de omstelling gefilmd', en: 'SMED: the changeover filmed' },
      beats: [
        { nl: 'Gefilmd: {n:15} min zoeken, {n:20} min {n:6} delen wisselen, {n:15} min bijstellen. Samen {n:50}.', en: 'Filmed: {n:15} min searching, {n:20} min swapping {n:6} parts, {n:15} min adjusting. {n:50} in all.', cues: ['smed'] },
        { nl: '{t:SMED}: splits {t:Intern werk|intern werk}, alleen bij stilstand, van {t:Extern werk|extern werk}.', en: '{t:SMED}: split {t:Internal work|internal work}, only with the line stopped, from {t:External work|external work}.', cue: { SMED: 'smed', 'Intern werk': 'int', 'Extern werk': 'ext' } },
        { nl: 'Zoeken is extern werk: zet de delen vóór de stop klaar. Dan nog {n:35} minuten.', en: 'Searching is external work: set the parts out before the stop. Then {n:35} minutes are left.', cues: ['ext', 'cart'] },
        { nl: 'Paspennen en snelspanners: wisselen {n:10} minuten, bijstellen {n:5}. Samen {n:15}.', en: 'Locating pins and quick clamps: swapping {n:10} minutes, adjusting {n:5}. {n:15} in all.', cues: ['int'], read: { nl: '{n:2} × {n:35} = {n:70} min per dienst', en: '{n:2} × {n:35} = {n:70} min a shift' } },
      ],
    },
    {
      id: 's5', lesson: MXD, level: 3, still: 0.5, title: { nl: 'Station 5 en de mix', en: 'Station 5 and the mix' },
      beats: [
        { nl: '{t:Werkinhoud|Werkinhoud}: de seconden werk per product. Station {n:5}: S {n:100}, M {n:120}, L {n:160}.', en: '{t:Work content|Work content}: the seconds of work per product. Station {n:5}: S {n:100}, M {n:120}, L {n:160}.', cue: { Werkinhoud: 'work' } },
        { nl: 'Takt {n:120} s, mix {n:50}% S, {n:30}% M, {n:20}% L: gemiddeld {n:118} s. Op papier past het.', en: 'Takt {n:120} s, mix {n:50}% S, {n:30}% M, {n:20}% L: {n:118} s on average. On paper it fits.', cues: ['work'], read: { nl: '{n:0.5} × {n:100} + {n:0.3} × {n:120} + {n:0.2} × {n:160} = {n:118}', en: '{n:0.5} × {n:100} + {n:0.3} × {n:120} + {n:0.2} × {n:160} = {n:118}' } },
        { nl: 'Maar L zit {n:40} s boven de takt. Twee L achter elkaar: {n:80} s achter.', en: 'But L is {n:40} s over takt. Two L in a row: {n:80} s behind.', cues: ['lag'] },
        { nl: 'Eén S geeft maar {n:20} s terug. De operator schuift het volgende station in.', en: 'One S gives back only {n:20} s. The operator drifts into the next station.', cues: ['lag'] },
      ],
    },
    {
      id: 's6', lesson: MXD, level: 3, still: 0.5, title: { nl: 'Zware varianten spreiden', en: 'Spreading heavy variants' },
      beats: [
        { nl: 'Een {t:Volgorderegel|volgorderegel}: na elke L minstens twee S. Dan blijft het bij {n:40} s.', en: 'A {t:Sequencing rule|sequencing rule}: after every L at least two S. Then it stays at {n:40} s.', cue: { Volgorderegel: 'rule' }, cues: ['lag'] },
        { nl: 'Een {t:Vliegende kracht|vliegende kracht} springt bij waar een zware cyclus uitloopt.', en: 'A {t:Floater|floater} helps out where a heavy cycle runs over.', cue: { 'Vliegende kracht': 'floater' } },
        { nl: 'Een {t:Voormontage|voormontage} bouwt een deel van het L-werk ernaast, als één module.', en: 'A {t:Sub-assembly|sub-assembly} builds part of the L work beside the line, as one module.', cue: { Voormontage: 'sub' } },
        { nl: 'Weinig plek voor veel varianten: {t:Aanvoer in volgorde|aanvoer in volgorde}, onderdelen in bouwvolgorde.', en: 'Little room for many variants: {t:Sequenced supply|sequenced supply}, parts in build order.', cue: { 'Aanvoer in volgorde': 'rack' } },
      ],
    },
    {
      id: 's7', lesson: SEQ, level: 4, still: 0.5, title: { nl: 'Heijunka', en: 'Heijunka' },
      beats: [
        { nl: '{t:Heijunka}: mix en volume egaal over de dag, in een klein patroon dat zich herhaalt.', en: '{t:Heijunka}: mix and volume even over the day, in a small pattern that repeats.', cue: { Heijunka: 'pattern' } },
        { nl: 'Het lesvoorbeeld, een lasstation: per dag {n:180} A, {n:120} B, {n:60} C. Takt {n:70} s, {n:3} : {n:2} : {n:1}.', en: 'The lesson’s welding station: a day of {n:180} A, {n:120} B, {n:60} C. Takt {n:70} s, {n:3} : {n:2} : {n:1}.', cues: ['pattern'], read: { nl: '{n:25200} / {n:360} = {n:70} s', en: '{n:25200} / {n:360} = {n:70} s' } },
        { nl: 'Patroon A B A C A B, {n:60} keer per dag. De {t:Heijunka box|heijunka box} geeft het vrij.', en: 'Pattern A B A C A B, {n:60} times a day. The {t:Heijunka box|heijunka box} releases it.', cue: { 'Heijunka box': 'hbox' } },
        { nl: 'Alle C aan het eind: de lasser {n:30} minuten achter. Met het patroon hooguit {n:30} seconden.', en: 'All C at the end: the welder {n:30} minutes behind. With the pattern {n:30} seconds at most.', cues: ['pattern'], read: { nl: '{n:60} × {n:30} s = {n:1800} s', en: '{n:60} × {n:30} s = {n:1800} s' } },
      ],
    },
    {
      id: 's8', lesson: SEQ, level: 4, still: 0.5, title: { nl: 'Volgorde vast, lijn flexibel', en: 'A fixed order, a flexible line' },
      beats: [
        { nl: '{t:Bevroren volgorde|Bevroren volgorde}: het laatste stuk vóór de lijn verandert niet meer.', en: '{t:Frozen sequence|Frozen sequence}: the last stretch before the line no longer changes.', cue: { 'Bevroren volgorde': 'frozen' } },
        { nl: 'Leveranciers leveren in die volgorde. Een spoedorder ertussen geeft ontbrekende onderdelen.', en: 'Suppliers deliver in that order. A rush order pushed in gives missing parts.', cues: ['frozen', 'rack'] },
        { nl: '{t:Flexibele automatisering|Flexibele automatisering}: servo-assen volgen het recept, zonder omstellen.', en: '{t:Flexible automation|Flexible automation}: servo axes follow the recipe, without a changeover.', cue: { 'Flexibele automatisering': 'servo' } },
        { nl: 'Elke variant in elke volgorde. Pas dan kost heijunka geen omsteltijd.', en: 'Every variant in any order. Only then does heijunka cost no changeover time.', cues: ['servo', 'carriers'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. No slash or ampersand in the
// spoken text; numbers the voice would read badly (25.200, 1.800) are words.
// S, M and L are said as small, medium and large where it reads better.
const SAY = [
  [ // s1 how a paced line works
    { nl: 'Dit is een getakte montagelijn: vijf stations boven een rollenbaan. Elke takt schuiven alle dragers tegelijk één station door, en elk station doet zijn deel van het werk.',
      en: 'This is a paced assembly line: five stations over a roller conveyor. Every takt, all carriers move on one station together, and each station does its share of the work.' },
    { nl: 'Klanten willen keuze: een andere kleur, een grotere motor. Een {t:Variant|variant} is een versie van hetzelfde product die in een paar onderdelen of stappen verschilt. Hier: klein, middel en groot.',
      en: 'Customers want choice: another colour, a bigger motor. A {t:Variant|variant} is a version of the same product that differs in a few parts or steps. Here: small, medium and large.' },
    { nl: 'Een {t:Mixed-model lijn|mixed-model lijn} bouwt ze in een gemengde volgorde, product voor product. Dat kan alleen als de stations per variant geen andere onderdelen of instellingen nodig hebben.',
      en: 'A {t:Mixed-model line|mixed-model line} builds them in a mixed order, product by product. That only works if the stations need no other parts or settings per variant.' },
    { nl: 'Eén lijn voor alle varianten scheelt vloerruimte en investering. Maar varianten kosten ook iets.',
      en: 'One line for all variants saves floor space and investment. But variants cost something too.' },
  ],
  [ // s2 a changeover costs output
    { nl: 'Moeten de stations wel wisselen, dan bouw je in series, en daartussen moet je {t:Omstellen|omstellen}: van het laatste goede product van de ene variant tot het eerste goede van de volgende. Ondertussen maakt de lijn niets.',
      en: 'If the stations do have to change, you build in batches, with a {t:Changeover|changeover} in between: from the last good product of one variant to the first good one of the next. Meanwhile the line makes nothing.' },
    { nl: 'Een dienst heeft {n:420} minuten, en de lijn maakt één product per minuut. {n:4} keer omstellen van {n:20} minuten kost {n:80} minuten: {n:340} producten in plaats van {n:420}, {n:19} procent minder.',
      en: 'A shift has {n:420} minutes, and the line makes one product a minute. {n:4} changeovers of {n:20} minutes cost {n:80} minutes: {n:340} products instead of {n:420}, {n:19} percent fewer.' },
    { nl: 'De {t:Seriegrootte|seriegrootte} is het aantal producten van één variant tussen twee keer omstellen.',
      en: 'The {t:Batch size|batch size} is the number of products of one variant between two changeovers.' },
    { nl: 'Grotere series, {n:2} keer omstellen, geven {n:380} producten. De prijs: meer voorraad, en een klant die een andere variant wil, wacht langer.',
      en: 'Bigger batches, {n:2} changeovers, give {n:380} products. The price: more stock, and a customer who wants another variant waits longer.' },
  ],
  [ // s3 recipe and change parts
    { nl: 'Op een geautomatiseerde lijn heeft omstellen twee helften. De softwarehelft is het {t:Recept|recept}: een opgeslagen set instellingen per variant in de PLC, zoals snelheden, posities en robotprogramma’s.',
      en: 'On an automated line a changeover has two halves. The software half is the {t:Recipe|recipe}: a stored set of settings per variant in the PLC, such as speeds, positions and robot programs.' },
    { nl: 'Een verkeerd recept is een klassieke fout. Dus scant de operator de order, en laadt de machine het juiste.',
      en: 'A wrong recipe is a classic mistake. So the operator scans the order, and the machine loads the right one.' },
    { nl: 'De hardwarehelft is het {t:Formaatdeel|formaatdeel}: een onderdeel dat per variant verschilt, zoals deze grijpervingers.',
      en: 'The hardware half is the {t:Change part|change parts}: parts that differ per variant, such as these grip fingers.' },
    { nl: 'Goede formaatdelen zijn gemerkt, zitten op paspennen zodat ze zonder bijstellen goed zitten, gebruiken snelspanners in plaats van bouten, en staan klaar op een kar.',
      en: 'Good change parts are marked, sit on locating pins so they fit without adjusting, use quick clamps instead of bolts, and wait on a cart.' },
  ],
  [ // s4 SMED
    { nl: 'Film een omstelling van {n:50} minuten: {n:15} minuten zoeken, {n:20} minuten {n:6} formaatdelen wisselen, en {n:15} minuten bijstellen en proefdraaien.',
      en: 'Film a changeover of {n:50} minutes: {n:15} minutes searching, {n:20} minutes swapping {n:6} change parts, and {n:15} minutes adjusting and running trials.' },
    { nl: 'Met {t:SMED}, de methode van Shingo, splits je {t:Intern werk|intern werk}, dat alleen kan als de lijn stilstaat, van {t:Extern werk|extern werk}, dat kan terwijl hij nog draait.',
      en: 'With {t:SMED}, Shingo’s method, you split {t:Internal work|internal work}, which needs the line stopped, from {t:External work|external work}, which can happen while it still runs.' },
    { nl: 'Zoeken is extern werk. Zet de delen vóór de stop klaar op de kar: nog {n:35} minuten.',
      en: 'Searching is external work. Set the parts out on the cart before the stop: {n:35} minutes left.' },
    { nl: 'Paspennen en snelspanners brengen wisselen naar {n:10} minuten, en bijstellen naar {n:5}. Samen {n:15}. Bij twee omstellingen per dienst wint de lijn {n:70} minuten.',
      en: 'Locating pins and quick clamps bring swapping down to {n:10} minutes, and adjusting to {n:5}. {n:15} in all. With two changeovers a shift, the line gains {n:70} minutes.' },
  ],
  [ // s5 station 5 and the mix
    { nl: 'Op een gemengde lijn heeft elke variant per station een andere {t:Werkinhoud|werkinhoud}: de seconden werk aan dat product. Op station {n:5}: klein {n:100}, middel {n:120}, groot {n:160} seconden.',
      en: 'On a mixed line each variant has its own {t:Work content|work content} at each station: the seconds of work on that product. At station {n:5}: small {n:100}, medium {n:120}, large {n:160} seconds.' },
    { nl: 'De takt is {n:120} seconden, de mix {n:50} procent klein, {n:30} middel en {n:20} groot. Gewogen gemiddeld {n:118} seconden: op papier past het.',
      en: 'The takt is {n:120} seconds, the mix {n:50} percent small, {n:30} medium and {n:20} large. A weighted average of {n:118} seconds: on paper it fits.' },
    { nl: 'Maar de operator werkt elke cyclus zoals hij komt. Een grote zit {n:40} seconden boven de takt; twee achter elkaar zetten hem {n:80} seconden achter.',
      en: 'But the operator handles each cycle as it comes. A large one is {n:40} seconds over takt; two in a row put him {n:80} seconds behind.' },
    { nl: 'Een kleine geeft maar {n:20} terug. Hij schuift het volgende station in, en roept om hulp.',
      en: 'A small one gives back only {n:20}. He drifts into the next station, and calls for help.' },
  ],
  [ // s6 spreading heavy variants
    { nl: 'De volgorde telt dus net zo zwaar als de mix. Een {t:Volgorderegel|volgorderegel}: na elke grote minstens twee kleine. Dan blijft het bij {n:40} seconden.',
      en: 'So the order matters as much as the mix. A {t:Sequencing rule|sequencing rule}: after every large one, at least two small ones. Then it stays at {n:40} seconds.' },
    { nl: 'Een {t:Vliegende kracht|vliegende kracht}, een extra operator, springt bij waar een zware cyclus uitloopt.',
      en: 'A {t:Floater|floater}, an extra operator, helps wherever a heavy cycle runs over.' },
    { nl: 'Op termijn gaat variantwerk naar een {t:Voormontage|voormontage}: een zijstation dat een module bouwt, die in één keer op de lijn gaat.',
      en: 'In time, variant work moves to a {t:Sub-assembly|sub-assembly}: a side station that builds a module, which goes onto the line in one go.' },
    { nl: 'En voor alle varianten is geen plek aan de lijn. Dus kits, of {t:Aanvoer in volgorde|aanvoer in volgorde}: onderdelen in dezelfde volgorde als de producten.',
      en: 'And there is no room at the line for every variant. So kits, or {t:Sequenced supply|sequenced supply}: parts in the same order as the products.' },
  ],
  [ // s7 heijunka
    { nl: '{t:Heijunka} is egaliseren: mix en volume gelijkmatig over de dag bouwen, in een klein patroon dat zich herhaalt, in plaats van grote blokken.',
      en: '{t:Heijunka} is levelling: building the mix and volume evenly over the day, in a small repeating pattern, instead of big blocks.' },
    { nl: 'Het voorbeeld uit de les is een lasstation voor elektrische fietsen. De dagvraag is {n:180} A, {n:120} B en {n:60} C, met een takt van {n:70} seconden: een verhouding van {n:3} staat tot {n:2} staat tot {n:1}. Op de lijn hier staan ze voor klein, middel en groot.',
      en: 'The lesson’s example is a welding station for e-bike frames. Day demand is {n:180} A, {n:120} B and {n:60} C, with a takt of {n:70} seconds: a ratio of {n:3} to {n:2} to {n:1}. On the line here they stand for small, medium and large.' },
    { nl: 'Dus: A, B, A, C, A, B, {n:60} keer per dag. Een {t:Heijunka box|heijunka box} legt het patroon vast met kanbankaarten, een vakje per tijdsblok.',
      en: 'So: A, B, A, C, A, B, {n:60} times a day. A {t:Heijunka box|heijunka box} fixes the pattern with kanban cards, a slot per time interval.' },
    { nl: 'Komen alle zware C aan het eind van de dag, dan raakt de lasser {n:30} minuten achter: de dagelijkse overuren. Met het patroon loopt hij na één C hooguit {n:30} seconden uit, en de drie A’s daarna winnen dat terug. Maar alleen als wisselen geen omsteltijd kost.',
      en: 'If all the heavy C come at the end of the day, the welder falls {n:30} minutes behind: the daily overtime. With the pattern he runs at most {n:30} seconds over after one C, and the three A-frames after it win that back. But only if switching costs no changeover time.' },
  ],
  [ // s8 frozen sequence, flexible automation
    { nl: 'Ligt de volgorde vast, dan leveren leveranciers erin. Dat vraagt een {t:Bevroren volgorde|bevroren volgorde}: het laatste stuk vóór de lijn, vaak een aantal uren, dat niet meer verandert.',
      en: 'Once the order is fixed, suppliers deliver in it. That needs a {t:Frozen sequence|frozen sequence}: the last stretch before the line, often several hours, that no longer changes.' },
    { nl: 'Een spoedorder die je erin duwt, breekt de aanvoer, en geeft ontbrekende onderdelen.',
      en: 'A rush order pushed in breaks the supply, and gives missing parts.' },
    { nl: '{t:Flexibele automatisering|Flexibele automatisering} kan elke variant aan zonder om te stellen: servo-assen die het recept volgen, grijpers die op alles passen.',
      en: '{t:Flexible automation|Flexible automation} handles every variant without a changeover: servo axes that follow the recipe, grippers that fit everything.' },
    { nl: 'Het kost vooraf meer, maar dan bouwt elk station elke variant in elke volgorde. Vraag dus eerst: wat kost wisselen hier?',
      en: 'It costs more up front, but then every station builds every variant in any order. So ask first: what does switching cost here?' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air); then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2.6 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = beatStarts(s, 'nl').map((t) => t / s.dur);
    C.beats = C.beats || [];
    C.beats[si] = st;
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = st[bi];
      const e = bi + 1 < st.length ? st[bi + 1] : 1;
      b.still = Math.round((a + 0.82 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8')
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.vr-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.vr-cell{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.4}
.vr-slot{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
.vr-call{fill:none;stroke:var(--anatomy-hi);stroke-width:1.4}
.vr-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.vr-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.vr-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.vr-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.vr-inv{fill:var(--anatomy-card);font-family:var(--fp-sans);font-weight:600}
.vr-halo{paint-order:stroke;stroke:var(--anatomy-shade-0);stroke-width:5px;stroke-linejoin:round}
.vr-tag{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500;font-style:italic}
.vr-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.vr-lim{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:6 4}
.vr-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.vr-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.vr-tile[data-h]{fill:var(--anatomy-lit-shade);stroke:var(--fp-accent);stroke-width:1.6}
.vr-x{fill:none;stroke:var(--anatomy-hi);stroke-width:2.6;stroke-linecap:round}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.fp-meter3{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:4 3}
.vr-gap{fill:var(--anatomy-shade-3);stroke:var(--anatomy-hi);stroke-width:1.2}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .vr-gap,[data-cue][data-on] .fp-meter3{fill:color-mix(in srgb,var(--fp-accent) 35%,var(--anatomy-shade-3));stroke:var(--fp-accent)}
[data-cue][data-on] .vr-curve{stroke:var(--fp-accent)}
[data-cue][data-on] .vr-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .vr-tile{stroke:var(--fp-accent)}
[data-cue][data-on] .vr-call{stroke:var(--fp-accent)}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een getakte montagelijn met vijf stations boven een rollenbaan. Dragers met producten in drie varianten, klein, middel en groot, schuiven per takt een station verder. Elk station heeft grijpervingers die bij de variant passen: de formaatdelen. Links het bedieningsscherm met het recept, een kar met formaatdelen op paspennen en een heijunka box; achter station 4 en 5 een rek met kits in bouwvolgorde; vooraan een voormontagetafel, een vliegende kracht, en bij station 5 een andonlamp en een liniaal met de achterstand in seconden. Kaarten tonen de dienst met omstellingen, de gefilmde omstelling, de werkinhoud op station 5, de achterstand, het heijunka-patroon en de bevroren volgorde.',
  en: 'A paced assembly line with five stations over a roller conveyor. Carriers with products in three variants, small, medium and large, move one station on every takt. Each station has grip fingers that fit the variant: the change parts. On the left the operator panel with the recipe, a cart with change parts on locating pins and a heijunka box; behind stations 4 and 5 a rack of kits in build order; at the front a sub-assembly table, a floater, and at station 5 an andon lamp and a ruler with the lag in seconds. Cards show the shift with its changeovers, the filmed changeover, the work content at station 5, the lag, the heijunka pattern and the frozen sequence.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

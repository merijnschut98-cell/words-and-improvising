// Dev tool, not shipped. Builds the explainer film "De wisselplaat en zijn
// slijtage / The insert and its wear" for the tooling topic of Verspanen
// (toolbasics L1, tools L2, toollife L3, toolcost L4).
//
//   node films/eng.machining.tooling/build.mjs            build the page
//   node films/eng.machining.tooling/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.tooling.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.1.
//
// Two places on one stage. The lathe (as in the figure eng.machining.insert and
// the turning film): a headstock and chuck, a steel bar, and a tool block on
// the carriage with two holders, the working insert and its sister tool, and a
// coolant nozzle. And the bench: an insert magnified six times, an HSS tool
// bit, the box with its ISO code and a row of boxes in the ISO material-group
// colours. Charts (Taylor, cost per part), a loupe on the flank and a spindle
// load trace sit in stage space over the drawing.
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
// value drifts); the captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm. Sources as in the lessons: ISO 1832 (insert
// code), ISO 513 (material groups), ISO 3685 (tool-life test, VB 0,3 mm),
// Taylor (1907) V·Tⁿ = C, and the textbook economic tool life
// Te = (1/n − 1)·(tch + Ce/M).
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// toolbasics: CNMG 120408 → 80° rhombus, edge 12,9 mm (code 12) on a 12,7 mm inscribed circle, 4,76 mm thick, r 0,8
const IC = 12.7;
const THICK = 4.76;
const RE = 0.8;
const SIDE = IC / Math.sin((80 * Math.PI) / 180);
assert(near(SIDE, 12.9, 0.05), 'side of a 12,7 mm IC 80° rhombus');
assert(Math.floor(SIDE) === 12, '12 is the cutting edge length in whole mm (ISO 1832); for a C insert it goes with IC 12,7');
assert(Number('08') / 10 === RE, '08 is the nose radius in tenths of a mm');
assert(near(THICK / 25.4, 3 / 16, 1e-3), '04 is 4,76 mm (3/16 inch)');
const EDGES = 2 * 2; // two 80° corners per face, two faces (0° clearance)
assert(EDGES === 4, '4 edges');
assert(near(14 / EDGES, 3.5, 1e-9) && near(14 / EDGES / 70, 0.05, 1e-9), '€14 / 4 = €3,50; / 70 = €0,05');
// tools: €12 / 4 = €3 per edge, 80 parts → €0,0375
assert(near(12 / 4, 3, 1e-9) && near(12 / 4 / 80, 0.0375, 1e-9), '€0,0375 per part');
// toollife: V·Tⁿ = C with n 0,25; 200 m/min → 15 min; 0,5 min per part → 30 parts
const N_T = 0.25;
const V1 = 200;
const T1 = 15;
const lifeOf = (v) => T1 * (V1 / v) ** (1 / N_T);
assert(near(T1 / 0.5, 30, 1e-9), '30 parts per edge');
assert(near(lifeOf(250) / T1, 0.41, 0.005), '25 % faster leaves 0,41 of the life');
assert(near(lifeOf(220), 10.2, 0.05), '220 m/min → 10,2 min');
assert(near(lifeOf(220) / (0.5 * 200 / 220), 22.5, 0.05), 'about 22 parts at 220');
// toolcost: C = 394, change 2 min, €4 per edge, €1,50 per min → Te 14, Ve 204; 0,3 min → 8,9, 228
const C_T = Math.round(V1 * T1 ** N_T);
assert(C_T === 394, 'C = 394');
const M = 1.5;
const CE = 4;
const teOf = (tch) => (1 / N_T - 1) * (tch + CE / M);
assert(near(CE / M, 2.67, 0.005) && near(2 + CE / M, 4.67, 0.005), '2,67 and 4,67 machine minutes');
assert(near(teOf(2), 14, 1e-9) && Math.round(C_T / teOf(2) ** N_T) === 204, 'Te 14 min, Ve 204 m/min');
assert(near(teOf(0.3), 8.9, 0.02) && Math.round(C_T / teOf(0.3) ** N_T) === 228, 'with a sister tool: 8,9 min, 228 m/min');
// cost per part at speed v (tc 0,5 min at 200 m/min), its minimum sits at Ve
const costOf = (v, tch) => { const tc = (0.5 * V1) / v; const T = lifeOf(v); return { machine: M * tc, edge: ((tch * M + CE) * tc) / T }; };
for (const tch of [2, 0.3]) {
  let best = Infinity;
  let bestV = 0;
  for (let v = 150; v <= 300; v += 0.5) { const c = costOf(v, tch); if (c.machine + c.edge < best) { best = c.machine + c.edge; bestV = v; } }
  assert(near(bestV, C_T / teOf(tch) ** N_T, 1), `the cost curve's minimum at Ve for tch ${tch}`);
}

// ---------------------------------------------------------------- the world (mm)
// The lathe: x along the spindle (headstock at -x), y toward the operator, z up;
// the spindle axis is z = 0 and the insert's rake face is the plane z = 0, at the
// front of the bar (+y). The bench (the same coordinates, shown in other
// scenes): its top is z = -100.
const W = 640;
const H = 400;
const CF = -94; // the chuck face
const BAR_L = 150; // bar out of the chuck: to x = 56
const R0 = 20; // Ø40 stock
const RC = 17; // after a 3 mm cut
// the insert in plan, from its tip (an 80° rhombus, side 12,9; the major edge
// runs from the tip toward +y, as for a tool feeding toward the chuck)
const INS = (() => {
  const a = (95 * Math.PI) / 180; // κr 95°: the major edge
  const b = a - (80 * Math.PI) / 180;
  const s = SIDE;
  const p1 = [s * Math.cos(b), s * Math.sin(b)];
  const p3 = [s * Math.cos(a), s * Math.sin(a)];
  return [[0, 0], p1, [p1[0] + p3[0], p1[1] + p3[1]], p3].map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
})();
const SIS = [-36, 8]; // the sister holder: one station toward the chuck, 8 mm further back
const BENCH_Z = -100;
const BIG = 6; // the bench insert is drawn six times its size
const DUR = [24, 30, 36, 28, 32, 34, 44, 40, 20];
const C = {
  CF, BAR_L, R0, RC, INS, SIS, BENCH_Z, BIG, IC, THICK, RE, dur: DUR, nT: N_T, V1, T1, C: C_T, M, CE,
  MAG: [W - 128, 156], MAG_R: 104,
};

const FIT = [...k.boxCorners({ x: -235, y: -70, w: 420, d: 170 }, -130, 58), [60, 100, -40]];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 58, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6, steps = 4) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const prism = (ring, z0, z1, style = {}, bevel = 0) => S(k.extrude(ring, z0, z1 - z0, P, { convex: true, bevel }), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 24) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const discX = (x0, x1, r, o = [0, 0], style = {}) => S(G.disc(0, x1 - x0, r, G.frameOf([x0, o[0], o[1]], X, Y, Z), P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const seam = (plan, z, inset = 3) => L(k.sideSeam(plan, z, P, inset), { tone: 'faint' });
const hexHead = (cx, cy, z, r = 2.2) => L(k.ring(cx, cy, r, z, P, 6), { tone: 'lo' }) + Dt([at([cx, cy, z])], { size: 0.4, tone: 'hi' });

// a polygon with rounded corners (the insert's nose radius)
function roundPoly(verts, r, steps = 6) {
  const out = [];
  const n = verts.length;
  const norm = ([x, y]) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  for (let i = 0; i < n; i++) {
    const V = verts[i];
    const d1 = norm([verts[(i + n - 1) % n][0] - V[0], verts[(i + n - 1) % n][1] - V[1]]);
    const d2 = norm([verts[(i + 1) % n][0] - V[0], verts[(i + 1) % n][1] - V[1]]);
    const half = Math.acos(d1[0] * d2[0] + d1[1] * d2[1]) / 2;
    const bis = norm([d1[0] + d2[0], d1[1] + d2[1]]);
    const c = [V[0] + (bis[0] * r) / Math.sin(half), V[1] + (bis[1] * r) / Math.sin(half)];
    const t1 = [V[0] + (d1[0] * r) / Math.tan(half), V[1] + (d1[1] * r) / Math.tan(half)];
    const t2 = [V[0] + (d2[0] * r) / Math.tan(half), V[1] + (d2[1] * r) / Math.tan(half)];
    const a1 = Math.atan2(t1[1] - c[1], t1[0] - c[0]);
    let da = Math.atan2(t2[1] - c[1], t2[0] - c[0]) - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    for (let j = 0; j <= steps; j++) out.push([c[0] + r * Math.cos(a1 + (da * j) / steps), c[1] + r * Math.sin(a1 + (da * j) / steps)]);
  }
  return out;
}
const scaleRing = (ring, c, f) => ring.map(([x, y]) => [c[0] + (x - c[0]) * f, c[1] + (y - c[1]) * f]);
const centreOf = (ring) => [ring.reduce((a, p) => a + p[0], 0) / ring.length, ring.reduce((a, p) => a + p[1], 0) / ring.length];

// ---------------------------------------------------------------- the lathe: static parts
const bed = [
  box({ x: -235, y: -70, w: 420, d: 170, r: 4 }, -130, -100, { tone: 'lo' }, 0.8),
  seam({ x: -235, y: -70, w: 420, d: 170, r: 4 }, -108, 4),
  box({ x: -125, y: -52, w: 305, d: 14 }, -100, -94, { crease: 'lo' }),
  box({ x: -125, y: 22, w: 305, d: 14 }, -100, -94, { crease: 'lo' }),
  L(k.sideTicks(-120, 176, 4, 5, 36, -95, [1.6, 3], P).minor, { tone: 'lo' }),
  L(k.sideTicks(-120, 176, 4, 5, 36, -95, [1.6, 3], P).major, { tone: 'mid' }),
].join('');

const head = (() => {
  const HB = { x: -225, y: -60, w: 92, d: 110, r: 3 };
  const lid = k.insetPlan(HB, 2.5);
  const yf = HB.y + HB.d;
  const vents = [44, 48, 52].map((z) => k.pathOf([[-215, yf, z], [-185, yf, z]].map(at))).join('');
  const plate = { x: -176, y: yf, w: 30, d: 0.8, r: 0.2 };
  const rules = [[10, 18], [6, 12], [2, 15]].map(([z, len]) => k.segment([plate.x + 3, yf + 0.8, z], [plate.x + 3 + len, yf + 0.8, z], P)).join('');
  return [
    box(HB, -100, 58, { inner: seam(HB, 50, 4) }, 0.8),
    L(vents, { tone: 'lo' }),
    box(plate, -2, 14, { tone: 'lo', crease: 'none' }, 0, 2) + L(rules, { tone: 'lo', free: true }),
    box(lid, 58, 61, { crease: 'lo' }, 0.4),
    Dt(k.corners(lid, 4).map(([x, y]) => at([x, y, 61])), { size: 0.5 }),
    discX(-133, -127, 46),
    S(G.solidOf([[0, 56], [29, 56], [33, 52]], G.frameOf([-127, 0, 0], X, Y, Z), P), { crease: 'lo', inner: L(G.arcOf(G.frameOf([-127, 0, 0], X, Y, Z), 10, 56, P), { tone: 'faint' }) }),
    Dt(G.dotsOf(G.frameOf([-94, 0, 0], X, Y, Z), 0, 46, 6, P, { least: -1 }), { size: 0.55 }),
  ].join('');
})();

// the carriage on the bed ways (moves along x with the tool, drawn behind the bar)
const carriage = [
  box({ x: -40, y: -66, w: 96, d: 160, r: 2 }, -94, -70, { inner: seam({ x: -40, y: -66, w: 96, d: 160, r: 2 }, -76, 4) }),
  box({ x: -34, y: 6, w: 84, d: 86, r: 1.5 }, -70, -58, { crease: 'lo' }),
  L(k.topTicks(-30, 46, 4, 5, 92, -58, [1.6, 3], P).minor, { tone: 'lo' }),
  L(k.topTicks(-30, 46, 4, 5, 92, -58, [1.6, 3], P).major, { tone: 'mid' }),
].join('');

// the tool block on the cross slide, with the sister holder and the working
// holder (moves along x and y), tip of the working insert at [0, RC, 0]
function holder(ox, oy, tag) {
  const tip = [ox, RC + oy];
  const ring = roundPoly(INS.map(([x, y]) => [tip[0] + x, tip[1] + y]), RE, 4);
  const c = centreOf(INS.map(([x, y]) => [tip[0] + x, tip[1] + y]));
  const headRing = [[tip[0] - 1.5, tip[1] + 2.5], [tip[0] + 15, tip[1] + 1.2], [tip[0] + 20, tip[1] + 12], [tip[0] + 19.5, tip[1] + 24], [tip[0] - 0.5, tip[1] + 24], [tip[0] - 2.5, tip[1] + 12]];
  const shank = { x: tip[0] - 0.5, y: tip[1] + 22, w: 20, d: 60, r: 1 };
  const hole = L(k.ring(c[0], c[1], 2.6, 0, P, 24), { tone: 'mid' });
  const breaker = L(k.onTop(scaleRing(ring, c, 0.66), 0, P, true), { tone: 'lo' });
  return {
    body: [
      box(shank, -26, -8, { inner: seam(shank, -12, 2) }, 0.5),
      prism(headRing, -26, -7.8, { inner: L(k.ringSeam(headRing, -12, P), { tone: 'faint' }) }, 0.4),
      prism(scaleRing(ring, c, 0.97), -7.8, -4.8, { tone: 'lo' }),
    ].join(''),
    insert: prism(ring, -4.8, 0, { tone: 'hi', crease: 'lo', inner: breaker + hole }),
    // a lever clamp from below holds the insert by its hole: only the screw shows, sunk in the hole
    clamp: L(k.ring(c[0], c[1], 1.7, -0.6, P, 6), { tone: 'lo' }) + Dt([at([c[0], c[1], -0.6])], { size: 0.4, tone: 'hi' }),
    tag,
  };
}
const MAIN = holder(0, 0, 'main');
const SISTER = holder(SIS[0], SIS[1], 'sister');
const BLOCK = { x: -42, y: 32, w: 66, d: 62, r: 1.5 };
const block = [
  box(BLOCK, -58, -26, { inner: seam(BLOCK, -32, 3) }, 0.6),
  ...[[-30, 46], [-30, 80], [10, 46], [10, 80]].map(([x, y]) => post(x, y, 3, -26, -23, { tone: 'hi', crease: 'lo' }, 16) + hexHead(x, y, -23, 1.8)),
].join('');
// the coolant nozzle: a block on the tool block, a short pipe and a tip aimed at the cut
const NOZ = { base: [-9, 46], tip: [-2.5, 22, 2.5] };
const nozzle = (() => {
  const b = { x: NOZ.base[0] - 5, y: NOZ.base[1] - 5, w: 10, d: 10, r: 1 };
  const from = [NOZ.base[0], NOZ.base[1], 2];
  const dir = G.sub3(NOZ.tip, from);
  const len = Math.hypot(...dir);
  const a = G.mul3(dir, 1 / len);
  const side = [-a[1], a[0], 0];
  const sl = Math.hypot(...side) || 1;
  const s = G.mul3(side, 1 / sl);
  const up = [a[1] * s[2] - a[2] * s[1], a[2] * s[0] - a[0] * s[2], a[0] * s[1] - a[1] * s[0]];
  const F = G.frameOf(from, a, s, up);
  return box(b, -26, 2, { crease: 'lo' }, 0.4) + S(G.solidOf([[0, 2.2], [len - 3, 2.2], [len - 2.6, 1.8], [len, 1.3]], F, P), { tone: 'hi', crease: 'lo' });
})();

// ---------------------------------------------------------------- the bench: static parts
const TABLE = { x: -205, y: -95, w: 400, d: 190, r: 4 };
const table = [
  box(TABLE, -126, BENCH_Z, { tone: 'lo', inner: seam(TABLE, -112, 5) }, 0.8),
  L(k.planOutline(k.insetPlan(TABLE, 6), BENCH_Z, P, 4), { tone: 'faint' }),
  Dt(k.corners(TABLE, 10).map(([x, y]) => at([x, y, BENCH_Z])), { size: 0.5 }),
  L(k.corners(TABLE, 10).map(([x, y]) => k.ring(x, y, 2.2, BENCH_Z, P, 14)).join(''), { tone: 'lo' }),
].join('');
// the insert at six times its size, on the bench: its long diagonal runs across
// the screen (world direction -32°), so the 80° rhombus reads as a diamond
const BIG_C = [-20, 0];
const BIG_U = [Math.cos((-32 * Math.PI) / 180), Math.sin((-32 * Math.PI) / 180)];
const BIG_V = [Math.cos((58 * Math.PI) / 180), Math.sin((58 * Math.PI) / 180)];
const BIG_DL = SIDE * BIG * Math.cos((40 * Math.PI) / 180);
const BIG_DS = SIDE * BIG * Math.sin((40 * Math.PI) / 180);
const bigAt = (a, b) => [BIG_C[0] + a * BIG_U[0] + b * BIG_V[0], BIG_C[1] + a * BIG_U[1] + b * BIG_V[1]];
const bigRing = roundPoly([bigAt(BIG_DL, 0), bigAt(0, BIG_DS), bigAt(-BIG_DL, 0), bigAt(0, -BIG_DS)], RE * BIG, 8);
const BIG_T = THICK * BIG;
const BIG_TOP = BENCH_Z + BIG_T;
const BIG_HOLE = 2.58 * BIG;
const big = {
  halo: `<path class="iso-halo" d="${k.extrude(bigRing, BENCH_Z, 0.5, P).fill}"/>`,
  body: prism(bigRing, BENCH_Z, BIG_TOP, { tone: 'hi', crease: 'lo' }),
  breaker: `<path class="tl-groove" d="${k.onTop(scaleRing(bigRing, BIG_C, 0.8), BIG_TOP, P, true)}"/>`
    + L(k.onTop(scaleRing(bigRing, BIG_C, 0.86), BIG_TOP, P, true) + k.onTop(scaleRing(bigRing, BIG_C, 0.72), BIG_TOP, P, true), { tone: 'lo' }),
  hole: `<path class="tl-hole" d="${k.ring(BIG_C[0], BIG_C[1], BIG_HOLE, BIG_TOP, P, 40)}"/>`
    + L(k.ring(BIG_C[0], BIG_C[1], BIG_HOLE, BIG_TOP, P, 40) + k.ring(BIG_C[0], BIG_C[1], BIG_HOLE + 3, BIG_TOP, P, 40), { tone: 'mid' }),
  ic: `<path class="fp-mark" stroke-dasharray="5 4" d="${k.ring(BIG_C[0], BIG_C[1], (IC * BIG) / 2, BIG_TOP + 0.2, P, 72)}"/>`,
};
// the HSS tool bit: a square bar with a ground tip, at the front of the bench
const hss = (() => {
  const y0 = 66;
  const w = 14;
  const x0 = -190;
  const x1 = -112;
  const bar = box({ x: x0, y: y0, w: x1 - x0, d: w, r: 0.3 }, BENCH_Z, BENCH_Z + w, { inner: seam({ x: x0, y: y0, w: x1 - x0, d: w, r: 0.3 }, BENCH_Z + 3, 2) }, 0.4, 2);
  const tipRing = [[x1, y0], [x1 + 16, y0 + 3], [x1 + 18, y0 + 5], [x1 + 5, y0 + w], [x1, y0 + w]];
  const tip = prism(tipRing, BENCH_Z, BENCH_Z + w, { tone: 'hi', crease: 'lo' }, 0.3);
  const marks = L(k.segment([x0 + 8, y0 + w, BENCH_Z + 9], [x0 + 30, y0 + w, BENCH_Z + 9], P) + k.segment([x0 + 8, y0 + w, BENCH_Z + 5.5], [x0 + 22, y0 + w, BENCH_Z + 5.5], P), { tone: 'lo', free: true });
  return bar + marks + tip;
})();
// the box of inserts, its label on the front face
const BOX = { x: 70, y: -40, w: 84, d: 54, r: 3 };
const insertBox = (() => {
  const yf = BOX.y + BOX.d;
  const tf = (x, z) => k.sideMatrix([x, yf + 0.1], z, P, 'left');
  return [
    `<path class="iso-halo" d="${k.haloOf(BOX, BENCH_Z, 0.5, P)}"/>`,
    box(BOX, BENCH_Z, BENCH_Z + 16, { inner: seam(BOX, BENCH_Z + 12, 3) }, 0.6),
    box(k.insetPlan(BOX, 1), BENCH_Z + 16, BENCH_Z + 22, { tone: 'hi', crease: 'lo' }, 0.5),
    `<path class="tl-stripe" data-g="P" d="${k.pathOf([[BOX.x + 4, yf + 0.1, BENCH_Z + 3], [BOX.x + 14, yf + 0.1, BENCH_Z + 3], [BOX.x + 14, yf + 0.1, BENCH_Z + 13], [BOX.x + 4, yf + 0.1, BENCH_Z + 13]].map(at), true)}"/>`,
    k.faceTextSvg(tf(BOX.x + 9, BENCH_Z + 5.5), 'P', { size: 6, tone: 'hi', anchor: 'middle' }),
    k.faceTextSvg(tf(BOX.x + 18, BENCH_Z + 6), 'CNMG 120408', { size: 6.6, tone: 'hi' }),
    k.faceTextSvg(tf(BOX.x + 18, BENCH_Z + 11.5), 'ISO 1832 · 10 ×', { size: 4, tone: 'mid' }),
  ].join('');
})();

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const [mx, my] = C.MAG;
const hud = [
  g('mag', `<clipPath id="tl-magclip"><circle cx="${mx}" cy="${my}" r="${C.MAG_R}"/></clipPath><circle class="fp-hud-bg" cx="${mx}" cy="${my}" r="${C.MAG_R}"/>`
    + `<g clip-path="url(#tl-magclip)"><g data-cue="grains">${g('magGrains', '')}</g><g data-cue="coat">${g('magCoat', '')}</g><g data-cue="wear">${g('magWear', '')}</g><g data-cue="bue">${g('magBue', '')}</g><g data-cue="crit">${g('magCrit', '')}</g>${g('magText', '')}</g>`
    + `<circle class="fp-mark" cx="${mx}" cy="${my}" r="${C.MAG_R}"/>`),
  g('code', '', ' data-cue="code"'),
  g('load', '', ' data-cue="load"'),
  g('chart', g('chBase', '') + `<g data-cue="curve">${g('chCurve', '')}</g><g data-cue="curves">${g('chCurves', '')}</g><g data-cue="min">${g('chMin', '')}</g><g data-cue="min2">${g('chMin2', '')}</g>`),
  g('preset', '', ' data-cue="preset"'),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('lathe', [
    g('bed', bed),
    g('head', head),
    g('car', carriage),
    g('jawsB', ''),
    g('shaft', ''),
    g('jawsF', ''),
    g('tools', [
      g('block', block),
      `<g data-cue="sister">${g('sisBody', SISTER.body)}${g('sisIns', SISTER.insert)}${g('sisWear', '')}${g('sisClamp', SISTER.clamp)}</g>`,
      `<g data-cue="coolant">${g('nozzle', nozzle)}</g>`,
      `<g data-cue="holder">${g('mainBody', MAIN.body)}</g>`,
      `<g data-cue="insert">${g('mainIns', MAIN.insert)}</g>`,
      `<g data-cue="wear">${g('mainWear', '')}</g>`,
      `<g data-cue="bue">${g('mainBue', '')}</g>`,
      `<g data-cue="holder">${g('mainClamp', MAIN.clamp)}</g>`,
    ].join('')),
    `<g data-cue="edge">${g('heat', '')}</g>`,
    `<g data-cue="coolant">${g('drops', '')}</g>`,
    g('chips', ''),
  ].join('')),
  g('bench', [
    g('table', table),
    `<g data-cue="shape">${g('big', big.halo + big.body)}</g>`,
    `<g data-cue="breaker">${g('bigBreaker', big.breaker)}</g>`,
    `<g data-cue="hole">${g('bigHole', big.hole)}</g>`,
    `<g data-cue="ic">${g('bigIc', big.ic)}</g>`,
    g('bigMarks', ''),
    `<g data-cue="hss">${g('hss', hss)}</g>`,
    `<g data-cue="box">${g('box', insertBox)}</g>`,
    `<g data-cue="groups">${g('groups', '')}</g>`,
    `<g data-cue="shelf">${g('shelf', '')}</g>`,
  ].join('')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([-40, 20, -20], 560), to: cam([6, 26, -2], 120), a: 0.05, b: 0.6 },
  { from: cam([-80, 20, -92], 300), to: cam([-60, 20, -92], 280) },
  { from: cam([30, -10, -112], 300), to: cam([24, -10, -112], 260), a: 0.1, b: 0.9 },
  { from: cam([0, 10, -104], 380), to: cam([10, 10, -104], 360) },
  { from: cam([57, 13, -6], 210), to: cam([-3, 13, -6], 210) },
  { from: cam([66, 20, -10], 260), to: cam([20, 20, -10], 280), a: 0.1, b: 0.9 },
  { from: cam([84, -10, -14], 380), to: cam([30, -10, -14], 400) },
  { from: cam([84, -10, -14], 400), to: cam([30, -10, -14], 400) },
  { from: cam([-40, -36, -100], 340), to: cam([-40, -10, -100], 300), a: 0.2, b: 0.8 },
];

// ---------------------------------------------------------------- the film
const BASICS = 'eng.machining.toolbasics';
const TOOLS = 'eng.machining.tools';
const LIFE = 'eng.machining.toollife';
const COST = 'eng.machining.toolcost';
const spec = {
  id: 'eng.machining.tooling',
  title: { nl: 'De wisselplaat en zijn slijtage', en: 'The insert and its wear' },
  lessons: [BASICS, TOOLS, LIFE, COST],
  scenes: [
    {
      id: 's1', lesson: BASICS, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Een snijkant schilt een spaan', en: 'An edge peels a chip' },
      beats: [
        { nl: 'De as draait, en een harde snijkant schilt er een spaan af.', en: 'The bar turns, and a hard cutting edge peels a chip off it.', cues: ['insert'] },
        { nl: 'De {t:Gereedschapshouder|gereedschapshouder} klemt de wisselplaat vast en past in de machine.', en: 'The {t:Tool holder|tool holder} clamps the insert and fits into the machine.', cue: { Gereedschapshouder: 'holder' } },
        { nl: 'De snijkant wordt heet. Versleten? Draai de plaat naar de volgende kant.', en: 'The edge gets hot. Worn? Turn the insert to the next edge.', cues: ['edge'] },
      ],
    },
    {
      id: 's2', lesson: BASICS, level: 1, dur: DUR[1], still: 0.85, title: { nl: 'HSS of hardmetaal', en: 'HSS or carbide' },
      beats: [
        { nl: '{t:HSS|HSS} is taai en goedkoop: voor kleine boren, tappen en speciaal gereedschap.', en: '{t:HSS|HSS} is tough and cheap: for small drills, taps and special tools.', cue: { HSS: 'hss' } },
        { nl: '{t:Hardmetaal|Hardmetaal} blijft hard als het heet is en snijdt zo’n drie tot vier keer sneller.', en: '{t:Cemented carbide|Cemented carbide} stays hard when hot and cuts about three to four times faster.', cue: { Hardmetaal: 'grains' }, cues: ['shape'] },
        { nl: 'Een {t:Coating|coating} van een paar duizendste millimeter kan tegen hitte en slijtage.', en: 'A {t:Coating|coating} a few thousandths of a millimetre thick resists heat and wear.', cue: { Coating: 'coat' } },
      ],
    },
    {
      id: 's3', lesson: BASICS, level: 1, dur: DUR[2], still: 0.97, title: { nl: 'De ISO-code op de doos', en: 'The ISO code on the box' },
      beats: [
        { nl: 'Op de doos staat de {t:ISO-code|ISO-code}: CNMG 120408. Lees hem van links naar rechts.', en: 'The box carries the {t:ISO insert code|ISO insert code}: CNMG 120408. Read it left to right.', cue: { 'ISO-code': 'code' }, cues: ['box'], still: 0.12 },
        { nl: 'C: een ruit van {n:80}°. N: geen vrijloophoek. M: de tolerantie. G: een gat en spaanbrekers.', en: 'C: an {n:80}° diamond. N: no clearance angle. M: the tolerance. G: a hole and chip breakers.', cues: ['code'], still: 0.45 },
        { nl: 'Dan de maten: {n:12.7} mm groot, {n:4.76} mm dik, en een hoekradius van {n:0.8} mm.', en: 'Then the sizes: {n:12.7} mm across, {n:4.76} mm thick, and a nose radius of {n:0.8} mm.', cues: ['code'], still: 0.72 },
        { nl: '{n:4} snijkanten: bij €{n:14} per plaat €{n:3.50} per kant; bij {n:70} stuks €{n:0.05} per stuk.', en: '{n:4} edges: at €{n:14} an insert, €{n:3.50} an edge; at {n:70} parts, €{n:0.05} a part.', cues: ['shape'], read: { nl: '€{n:14} / {n:4} = €{n:3.50} · / {n:70} = €{n:0.05} per stuk', en: '€{n:14} / {n:4} = €{n:3.50} · / {n:70} = €{n:0.05} per part' } },
      ],
    },
    {
      id: 's4', lesson: BASICS, level: 1, dur: DUR[3], still: 0.7, title: { nl: 'De soort en de materiaalgroep', en: 'The grade and the material group' },
      beats: [
        { nl: 'Op de doos staat ook de soort, gekozen voor een {t:Materiaalgroep|materiaalgroep}.', en: 'The box also names the grade, chosen for a {t:Material group|material group}.', cue: { Materiaalgroep: 'groups' } },
        { nl: 'P blauw: staal. M geel: rvs. K rood: gietijzer. N groen: aluminium. S bruin: titaan. H grijs: gehard.', en: 'P blue: steel. M yellow: stainless. K red: cast iron. N green: aluminium. S brown: titanium. H grey: hardened.', still: 0.5 },
        { nl: 'Een P-soort in rvs werkt wel, maar slecht. Klopt de soort bij deze order?', en: 'A P grade in stainless works, but badly. Does the grade match this job?', cues: ['box'] },
      ],
    },
    {
      id: 's5', lesson: TOOLS, level: 2, dur: DUR[4], still: 0.5, title: { nl: 'Hoe een snijkant slijt', en: 'How an edge wears' },
      beats: [
        { nl: '{t:Vrijloopslijtage|Vrijloopslijtage}: langs de snijkant groeit een dof randje.', en: '{t:Flank wear|Flank wear}: a dull band grows along the cutting edge.', cue: { Vrijloopslijtage: 'wear' } },
        { nl: 'Bij aluminium last materiaal zich vast op de kant: een {t:Opbouwsnede|opbouwsnede}.', en: 'On aluminium, material welds onto the edge: a {t:Built-up edge|built-up edge}.', cue: { Opbouwsnede: 'bue' } },
        { nl: 'Een botte kant vraagt meer kracht: de {t:Spilbelasting|spilbelasting} stijgt.', en: 'A blunt edge needs more force: the {t:Spindle load|spindle load} rises.', cue: { Spilbelasting: 'load' } },
      ],
    },
    {
      id: 's6', lesson: TOOLS, level: 2, dur: DUR[5], still: 0.3, title: { nl: 'Koeling, voorinstellen en de zuster', en: 'Coolant, presetting and the sister' },
      beats: [
        { nl: '{t:Emulsie|Emulsie} koelt, smeert en spoelt: olie in water, meestal {n:5} tot {n:8}% olie.', en: '{t:Emulsion|Emulsion} cools, lubricates and flushes: oil in water, usually {n:5} to {n:8}% oil.', cue: { Emulsie: 'coolant' }, still: 0.15 },
        { nl: 'Bij {t:Voorinstellen|voorinstellen} meet je lengte en radius buiten de machine.', en: 'With {t:Presetting|presetting} you measure length and radius outside the machine.', cue: { Voorinstellen: 'preset' }, still: 0.45 },
        { nl: 'Op de grens neemt het {t:Zustergereedschap|zustergereedschap} het over.', en: 'At the limit the {t:Sister tool|sister tool} takes over.', cue: { Zustergereedschap: 'sister' }, read: { nl: '€{n:12} / {n:4} = €{n:3} per kant · / {n:80} = €{n:0.0375} per stuk', en: '€{n:12} / {n:4} = €{n:3} per edge · / {n:80} = €{n:0.0375} per part' }, still: 0.92 },
      ],
    },
    {
      id: 's7', lesson: LIFE, level: 3, dur: DUR[6], still: 0.55, title: { nl: 'De Taylorvergelijking', en: 'The Taylor equation' },
      beats: [
        { nl: 'De {t:Taylorvergelijking|Taylorvergelijking}: V × Tⁿ = C. Sneller snijden kost standtijd.', en: 'The {t:Taylor equation|Taylor equation}: V × Tⁿ = C. Cutting faster costs tool life.', cue: { Taylorvergelijking: 'curve' } },
        { nl: 'Met een {t:Taylor-exponent|Taylor-exponent} van {n:0.25}: {n:25}% sneller laat {n:0.41} van de standtijd over.', en: 'With a {t:Taylor exponent|Taylor exponent} of {n:0.25}: {n:25}% faster leaves {n:0.41} of the tool life.', cue: { 'Taylor-exponent': 'curve' }, read: { nl: '({n:200} / {n:250})⁴ = {n:0.41}', en: '({n:200} / {n:250})⁴ = {n:0.41}' } },
        { nl: '{n:200} m/min: {n:15} minuten, {n:30} stuks. {n:220} m/min: {n:10.2} minuten, zo’n {n:22} stuks.', en: '{n:200} m/min: {n:15} minutes, {n:30} parts. {n:220} m/min: {n:10.2} minutes, about {n:22} parts.', cues: ['curve'], read: { nl: 'T = {n:15} × ({n:200} / {n:220})⁴ = {n:10.2} min', en: 'T = {n:15} × ({n:200} / {n:220})⁴ = {n:10.2} min' } },
        { nl: 'Het {t:Slijtagecriterium|slijtagecriterium}: gemiddeld {n:0.3} mm vrijloopslijtage.', en: 'The {t:Wear criterion|wear criterion}: {n:0.3} mm of flank wear on average.', cue: { Slijtagecriterium: 'crit' }, read: { nl: 'VB = {n:0.3} mm (ISO 3685)', en: 'VB = {n:0.3} mm (ISO 3685)' } },
        { nl: '{t:Gereedschapsbewaking|Gereedschapsbewaking} volgt de spilbelasting en stopt de machine bij een breuk.', en: '{t:Tool monitoring|Tool monitoring} watches the spindle load and stops the machine if a tool breaks.', cue: { Gereedschapsbewaking: 'load' } },
      ],
    },
    {
      id: 's8', lesson: COST, level: 4, dur: DUR[7], still: 0.75, title: { nl: 'De goedkoopste snelheid', en: 'The cheapest speed' },
      beats: [
        { nl: 'Per stuk: machinetijd, wissels en gereedschap. Sneller snijden verschuift de kosten.', en: 'Per part: machine time, changes and tools. Cutting faster shifts the costs.', cues: ['curves'] },
        { nl: 'De {t:Wisseltijd|wisseltijd} is {n:2} minuten, een kant kost €{n:4}, de machine €{n:1.50} per minuut.', en: 'The {t:Change time|change time} is {n:2} minutes, an edge costs €{n:4}, the machine €{n:1.50} a minute.', cue: { Wisseltijd: 'curves' }, read: { nl: '{n:2} + €{n:4} / €{n:1.50} = {n:2} + {n:2.67} = {n:4.67} min', en: '{n:2} + €{n:4} / €{n:1.50} = {n:2} + {n:2.67} = {n:4.67} min' } },
        { nl: 'De {t:Economische standtijd|economische standtijd}: {n:3} × {n:4.67} = {n:14} minuten.', en: 'The {t:Economic tool life|economic tool life}: {n:3} × {n:4.67} = {n:14} minutes.', cue: { 'Economische standtijd': 'min' } },
        { nl: 'De {t:Economische snijsnelheid|economische snijsnelheid}: zo’n {n:204} m/min, waar het totaal het laagst is.', en: 'The {t:Economic cutting speed|economic cutting speed}: about {n:204} m/min, where the total is lowest.', cue: { 'Economische snijsnelheid': 'min' }, read: { nl: 'V = {n:394} / {n:14}^{n:0.25} ≈ {n:204} m/min', en: 'V = {n:394} / {n:14}^{n:0.25} ≈ {n:204} m/min' } },
        { nl: 'Met een zustergereedschap: {n:0.3} minuut stop, {n:8.9} minuten standtijd, {n:228} m/min.', en: 'With a sister tool: a {n:0.3} minute stop, {n:8.9} minutes of tool life, {n:228} m/min.', cues: ['min2'] },
      ],
    },
    {
      id: 's9', lesson: COST, level: 4, dur: DUR[8], still: 0.9, title: { nl: 'Minder soorten', en: 'Fewer kinds' },
      beats: [
        { nl: '{t:Gereedschapsstandaardisatie|Gereedschapsstandaardisatie}: minder soorten, hetzelfde op elke machine.', en: '{t:Tool standardisation|Tool standardisation}: fewer kinds, the same on every machine.', cue: { Gereedschapsstandaardisatie: 'shelf' } },
        { nl: 'Jaag niet op de goedkoopste wisselplaat, maar op het goedkoopste stuk.', en: 'Don’t chase the cheapest insert; chase the cheapest part.', cues: ['shelf'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption on screen, so the learner needs nothing else. Same markers; the build
// checks the terms and numbers against the lessons. films/_kit/narrate.mjs
// records each phrase with Piper.
const SAY = [
  [ // s1 how it works (Basis)
    { nl: 'De as draait, en de snijkant van een klein, hard plaatje schilt er een spaan staal af. Dat plaatje heet een wisselplaat.',
      en: 'The bar turns, and the cutting edge of a small, hard plate peels a chip of steel off it. That plate is called an insert.' },
    { nl: 'Het zit in een {t:Gereedschapshouder|gereedschapshouder}: een stalen lichaam met een klem, dat in de revolver past.',
      en: 'It sits in a {t:Tool holder|tool holder}: a steel body with a clamp, which fits into the turret.' },
    { nl: 'De snijkant wordt heet, dus het gereedschap moet hard blijven als het heet is. Versleten? Dan draai je de plaat naar de volgende kant.',
      en: 'The edge gets hot, so the tool must stay hard when it is hot. Worn? Then you turn the insert to the next edge.' },
  ],
  [ // s2 HSS or carbide
    { nl: '{t:HSS|HSS} is snelstaal. Het is taai, goedkoop en makkelijk te slijpen, voor kleine boren en tappen.',
      en: '{t:HSS|HSS} is high-speed steel: tough, cheap and easy to grind, for small drills and taps.' },
    { nl: '{t:Hardmetaal|Hardmetaal} bestaat uit korrels wolfraamcarbide, gebonden met kobalt. Het blijft hard als het heet wordt, en snijdt zo’n drie tot vier keer sneller. Maar het is bros.',
      en: '{t:Cemented carbide|Cemented carbide} is made of grains of tungsten carbide, bound with cobalt. It stays hard when it gets hot, and cuts about three to four times faster. But it is brittle.' },
    { nl: 'Bijna elk hardmetalen gereedschap heeft een {t:Coating|coating}: een laagje van een paar duizendste millimeter, tegen hitte en slijtage.',
      en: 'Almost every carbide tool has a {t:Coating|coating}: a layer a few thousandths of a millimetre thick, against heat and wear.' },
  ],
  [ // s3 the ISO code
    { nl: 'Op de doos staat een {t:ISO-code|ISO-code}: CNMG 12 04 08.',
      en: 'The box carries an {t:ISO insert code|ISO insert code}: CNMG 12 04 08.' },
    { nl: 'C is de vorm: een ruit met hoeken van {n:80} graden. N: geen vrijloophoek, dus beide kanten zijn bruikbaar. M is de tolerantieklasse, en G: een gat om te klemmen, en spaanbrekers.',
      en: 'C is the shape: a diamond with {n:80} degree corners. N: no clearance angle, so both faces can be used. M is the tolerance class, and G: a hole for clamping, and chip breakers.' },
    { nl: '12 is de lengte van de snijkant in hele millimeters: bij deze ruit een ingeschreven cirkel van {n:12.7} millimeter. 04 is de dikte: {n:4.76} millimeter. En 08 is de hoekradius: {n:0.8} millimeter.',
      en: '12 is the cutting edge length in whole millimetres: for this diamond, an inscribed circle of {n:12.7} millimetres. 04 is the thickness: {n:4.76} millimetres. And 08 is the nose radius: {n:0.8} millimetres.' },
    { nl: 'Twee hoeken per kant, twee kanten: {n:4} snijkanten. Bij €{n:14} per plaat is dat 3 euro 50 per kant, en bij {n:70} stuks per kant 5 cent per stuk.',
      en: 'Two corners per face, two faces: {n:4} edges. At €{n:14} an insert, that is 3 euros 50 an edge, and at {n:70} parts an edge, 5 cents a part.' },
  ],
  [ // s4 the grade and the material group
    { nl: 'Op de doos staat ook de soort: het hardmetaal en de coating, gekozen voor een {t:Materiaalgroep|materiaalgroep}.',
      en: 'The box also names the grade: the carbide and the coating, chosen for a {t:Material group|material group}.' },
    { nl: 'P blauw is staal, M geel roestvast staal, K rood gietijzer, N groen aluminium, S bruin titaan en hittebestendige legeringen, en H grijs gehard staal.',
      en: 'P blue is steel, M yellow stainless steel, K red cast iron, N green aluminium, S brown titanium and heat-resistant alloys, and H grey hardened steel.' },
    { nl: 'Een P-soort in roestvast staal werkt, maar slecht. Klopt de soort op de doos bij deze order?',
      en: 'A P grade in stainless steel works, but badly. Does the grade on the box match this job?' },
  ],
  [ // s5 how an edge wears
    { nl: 'Bij {t:Vrijloopslijtage|vrijloopslijtage} groeit langs de snijkant een dof randje: eerst langzaam, dan steeds sneller. Bij kolkslijtage slijt er bovenop een kuiltje, waar de hete spaan overheen schuurt.',
      en: 'With {t:Flank wear|flank wear}, a dull band grows along the cutting edge: slowly at first, then faster and faster. With crater wear, a hollow wears into the top, where the hot chip slides over it.' },
    { nl: 'Bij aluminium en zacht staal last materiaal zich vast op de kant: een {t:Opbouwsnede|opbouwsnede}. Dat verpest de maat en het oppervlak.',
      en: 'On aluminium and soft steel, material welds onto the edge: a {t:Built-up edge|built-up edge}. That spoils the size and the surface.' },
    { nl: 'Slijtage zie je aan verlopende maten en bramen. En de {t:Spilbelasting|spilbelasting} stijgt: de motor moet harder werken.',
      en: 'You see wear in drifting sizes and burrs. And the {t:Spindle load|spindle load} rises: the motor has to work harder.' },
  ],
  [ // s6 coolant, presetting and the sister tool
    { nl: '{t:Emulsie|Emulsie} koelt, smeert en spoelt de spanen weg: olie in water, meestal {n:5} tot {n:8} procent olie.',
      en: '{t:Emulsion|Emulsion} cools, lubricates and flushes the chips away: oil in water, usually {n:5} to {n:8} percent oil.' },
    { nl: 'Bij {t:Voorinstellen|voorinstellen} meet je de lengte en de radius van een gereedschap buiten de machine, zodat die blijft verspanen.',
      en: 'With {t:Presetting|presetting} you measure the length and radius of a tool outside the machine, so the machine keeps cutting.' },
    { nl: 'Is de standtijd op, dan neemt een {t:Zustergereedschap|zustergereedschap} het over. Dat is een identiek reservegereedschap. Een plaat van €{n:12} met {n:4} kanten is €{n:3} per kant: bij {n:80} stuks drie en driekwart cent per stuk.',
      en: 'When the tool life is up, a {t:Sister tool|sister tool} takes over: an identical spare tool. A €{n:12} insert with {n:4} edges is €{n:3} an edge: at {n:80} parts, 3.75 cents a part.' },
  ],
  [ // s7 the Taylor equation
    { nl: 'De {t:Taylorvergelijking|Taylorvergelijking} koppelt de standtijd aan de snelheid: V maal T tot de macht n is gelijk aan een constante C.',
      en: 'The {t:Taylor equation|Taylor equation} links tool life to speed: V times T to the power n equals a constant C.' },
    { nl: 'De {t:Taylor-exponent|Taylor-exponent} n is voor hardmetaal vaak zo’n {n:0.25}. Ga je dan {n:25} procent sneller, van {n:200} naar {n:250}, dan blijft er maar {n:0.41} van de standtijd over.',
      en: 'The {t:Taylor exponent|Taylor exponent} n is often about {n:0.25} for carbide. Then {n:25} percent faster, from {n:200} to {n:250}, leaves only {n:0.41} of the tool life.' },
    { nl: 'Bij {n:200} meter per minuut gaat een kant {n:15} minuten mee: {n:30} stuks. Bij {n:220} wordt dat {n:10.2} minuten, en zo’n {n:22} stuks.',
      en: 'At {n:200} metres a minute an edge lasts {n:15} minutes: {n:30} parts. At {n:220} that becomes {n:10.2} minutes, and about {n:22} parts.' },
    { nl: 'In een standtijdtest is het {t:Slijtagecriterium|slijtagecriterium} meestal een slijtagerand van gemiddeld {n:0.3} millimeter.',
      en: 'In a tool-life test, the {t:Wear criterion|wear criterion} is usually a wear land of {n:0.3} millimetres on average.' },
    { nl: 'En {t:Gereedschapsbewaking|gereedschapsbewaking} volgt de spilbelasting, en stopt de machine als een gereedschap breekt.',
      en: 'And {t:Tool monitoring|tool monitoring} watches the spindle load, and stops the machine when a tool breaks.' },
  ],
  [ // s8 the cheapest speed
    { nl: 'Een stuk kost machinetijd, wissels en gereedschap. Sneller snijden verkleint de machinetijd, maar vergroot de rest.',
      en: 'A part costs machine time, tool changes and tools. Cutting faster shrinks the machine time, but grows the rest.' },
    { nl: 'De {t:Wisseltijd|wisseltijd} is {n:2} minuten. Een kant van €{n:4} is bij 1 euro 50 per minuut {n:2.67} machineminuten. Samen {n:4.67} minuten.',
      en: 'The {t:Change time|change time} is {n:2} minutes. An edge of €{n:4}, at 1 euro 50 a minute, is {n:2.67} machine minutes. Together, {n:4.67} minutes.' },
    { nl: 'De {t:Economische standtijd|economische standtijd} is 1 gedeeld door n, min 1, keer die {n:4.67} minuten. Met n is {n:0.25} is dat {n:3} keer {n:4.67}: {n:14} minuten.',
      en: 'The {t:Economic tool life|economic tool life} is 1 over n, minus 1, times those {n:4.67} minutes. With n at {n:0.25}, that is {n:3} times {n:4.67}: {n:14} minutes.' },
    { nl: 'Met Taylor volgt de {t:Economische snijsnelheid|economische snijsnelheid}: C gedeeld door de vierdemachtswortel van {n:14}, zo’n {n:204} meter per minuut: daar zijn de kosten het laagst.',
      en: 'Taylor then gives the {t:Economic cutting speed|economic cutting speed}: C divided by the fourth root of {n:14}, about {n:204} metres a minute: where the cost is lowest.' },
    { nl: 'Met een zustergereedschap zakt de stop naar {n:0.3} minuut: {n:8.9} minuten, bij {n:228} meter per minuut. Sneller loont pas als wisselen goedkoop is.',
      en: 'With a sister tool, the stop drops to {n:0.3} minutes: {n:8.9} minutes, at {n:228} metres a minute. Faster only pays when changing is cheap.' },
  ],
  [ // s9 fewer kinds
    { nl: 'Het grotere geld zit vaak in {t:Gereedschapsstandaardisatie|gereedschapsstandaardisatie}: minder soorten, hetzelfde op elke machine, en snijgegevens die iedereen kent.',
      en: 'The bigger money is often in {t:Tool standardisation|tool standardisation}: fewer kinds, the same on every machine, and cutting data everyone knows.' },
    { nl: 'Jaag dus niet op de goedkoopste wisselplaat. Jaag op het goedkoopste stuk.',
      en: 'So don’t chase the cheapest insert. Chase the cheapest part.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, tangentOf, solidOf, prismOf, lathe, disc, dotsOf, arcOf, circleOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify({ ...C, BIG_C, BIG_TOP, BIG_U, BIG_V, BIG_DL, BIG_DS, bigRing: bigRing.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]), BOX, NOZ })};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8')
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// ISO 513 colours (the subject of scene 4), toned to the palette
const css = `
.iso{--tl-P:#4C7FC0;--tl-M:#D2B13A;--tl-K:#C0544A;--tl-N:#4F9A62;--tl-S:#9A6B45;--tl-H:#8E9696;--tl-grain:#1B3E47;--tl-co:#0A1B1F;--tl-heat:#E39A4C}
.iso[data-theme="light"]{--tl-P:#2F63A8;--tl-M:#C49A12;--tl-K:#AE3E33;--tl-N:#3A8150;--tl-S:#87582F;--tl-H:#7B8484;--tl-grain:#DCE3DD;--tl-co:#A9AE9E;--tl-heat:#C9711F}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .tl-mono{font-family:var(--anatomy-mono);font-weight:700}
.fp-chip{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
.fp-box{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.tl-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.tl-hole{fill:var(--anatomy-shade-0);stroke:none}
.tl-groove{fill:var(--anatomy-shade-2);stroke:none}
.tl-stripe{stroke:none}
.tl-stripe[data-g="P"]{fill:var(--tl-P)}.tl-stripe[data-g="M"]{fill:var(--tl-M)}.tl-stripe[data-g="K"]{fill:var(--tl-K)}
.tl-stripe[data-g="N"]{fill:var(--tl-N)}.tl-stripe[data-g="S"]{fill:var(--tl-S)}.tl-stripe[data-g="H"]{fill:var(--tl-H)}
.tl-wear{fill:color-mix(in srgb,var(--anatomy-hi) 55%,var(--anatomy-face));stroke:var(--anatomy-hi);stroke-width:.5;vector-effect:non-scaling-stroke}
[data-cue][data-on] .tl-wear{fill:var(--fp-accent);stroke:var(--fp-accent)}
.tl-bue{fill:var(--anatomy-mid);stroke:var(--anatomy-hi);stroke-width:.6;vector-effect:non-scaling-stroke}
[data-cue][data-on] .tl-bue{fill:var(--fp-accent)}
.tl-heat{fill:var(--tl-heat);stroke:none}
.tl-drop{fill:var(--fp-accent);stroke:none}
.tl-grain{fill:var(--tl-grain);stroke:var(--anatomy-mid);stroke-width:.7}
.tl-co{fill:var(--tl-co)}
[data-cue][data-on] .tl-grain{stroke:var(--fp-accent);fill:var(--anatomy-lit-shade)}
.tl-layer{stroke:var(--anatomy-mid);stroke-width:.7}
.tl-layer[data-l="0"]{fill:var(--anatomy-shade-3)}.tl-layer[data-l="1"]{fill:var(--anatomy-face)}.tl-layer[data-l="2"]{fill:var(--anatomy-top)}
[data-cue][data-on] .tl-layer{stroke:var(--fp-accent);fill:var(--anatomy-lit-top)}
.tl-land{fill:color-mix(in srgb,var(--anatomy-hi) 40%,var(--anatomy-shade-3));stroke:var(--anatomy-hi);stroke-width:.8}
[data-cue][data-on] .tl-land{fill:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-shade-3));stroke:var(--fp-accent)}
.tl-flank{fill:var(--anatomy-shade-2);stroke:none}
.tl-crit{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
[data-cue][data-on] .tl-crit{stroke:var(--fp-accent);stroke-width:2}
.tl-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.tl-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.tl-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.tl-curve[data-c="lo"]{stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.tl-curve[data-c="acc"],[data-hi] .tl-curve{stroke:var(--fp-accent);stroke-width:2.8}
.tl-dot{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.5}
[data-hi] .tl-dot,.tl-dot[data-c="acc"]{fill:var(--fp-accent)}
.tl-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.tl-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.tl-code{fill:var(--anatomy-muted)}
.tl-code[data-hi]{fill:var(--fp-accent-text)}
[data-hi] .iso-edge,[data-hi] .iso-crease,[data-hi] .iso-line{stroke:var(--fp-accent)!important}
[data-hi] .iso-top{fill:var(--anatomy-lit-top)}
[data-hi] .iso-shade{fill:var(--anatomy-lit-shade)}
[data-hi] .fp-mark{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een draaibank van dichtbij: een klauwplaat met een stalen as, en een gereedschapsblok met twee houders, de werkende wisselplaat en een zustergereedschap, en een koelmiddelsproeier. Daarna een werkbank met een wisselplaat op zes keer ware grootte, een HSS-beitel, een doos met de ISO-code en dozen in de kleuren van de materiaalgroepen. Grafieken tonen de slijtage, de spilbelasting, de Taylorcurve en de kosten per stuk.',
  en: 'A lathe up close: a chuck with a steel bar, and a tool block with two holders, the working insert and a sister tool, and a coolant nozzle. Then a bench with an insert at six times its size, an HSS tool bit, a box with the ISO code and boxes in the material-group colours. Charts show the wear, the spindle load, the Taylor curve and the cost per part.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

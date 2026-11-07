// Dev tool, not shipped. Builds the explainer film "Frezen / Milling" for the
// milling lessons of Verspanen (mill L1, millfeeds L2, millstrategy L3,
// fiveaxis L4).
//
//   node films/eng.machining.milling/build.mjs            build the page
//   node films/eng.machining.milling/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.milling.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.1.
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
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// mill: the cover from an aluminium block 100 × 80 × 25; T1 face mill, T2 Ø10
// roughs a pocket 60 × 40 × 8, T3 Ø8 finishes it; the corners get r 4.
const BLOCK = { w: 100, d: 80, h: 25 };
const POCKET = { w: 60, d: 40, depth: 8 };
const FACE_D = 63; // a common face-mill size; two passes cover the 80 mm width
assert(POCKET.w < BLOCK.w && POCKET.d < BLOCK.d && POCKET.depth < BLOCK.h, 'pocket fits the block');
assert(2 * FACE_D - 2 * 20 + 2 * 20 >= BLOCK.d && FACE_D / 2 + 20 >= BLOCK.d / 2, 'two face-mill passes at ±20 cover the block');
assert(8 / 2 === 4, 'a Ø8 end mill leaves inside corners of r 4');
// millfeeds: Ø12, 3 teeth, Vc 150, fz 0,05 → n 3.980, vf 597; ap 10, ae 3 → Q 17,9
const rpmOf = (vc, d) => (vc * 1000) / (Math.PI * d);
const N12 = Math.round(rpmOf(150, 12) / 10) * 10;
assert(N12 === 3980, `n = ${rpmOf(150, 12)}`);
const VF = 0.05 * 3 * N12;
assert(Math.round(VF) === 597, `vf = ${VF}`);
assert(near((10 * 3 * 597) / 1000, 17.9, 0.02), 'Q 17,9 cm³/min');
// millstrategy: Ø10, ae 1 → hex = 0,6 × fz; fz 0,05 → 0,083; 4 teeth, 6.000 rpm: 1.200 → 2.000 mm/min
const thinOf = (d, ae) => (2 * Math.sqrt(d * ae - ae * ae)) / d;
assert(near(thinOf(10, 1), 0.6, 1e-9), 'chip thinning 0,6 at ae 1 of Ø10');
assert(near(0.05 / 0.6, 0.083, 0.0005), 'fz 0,083');
assert(0.05 * 4 * 6000 === 1200, 'vf 1.200');
assert(Math.round((0.05 / 0.6) * 4 * 6000) === 2000, 'vf 2.000');
// fiveaxis: 4 set-ups against 1, 30 min each per batch → 90 min
assert((4 - 1) * 30 === 90, '3 × 30 = 90 min per batch');

// ---------------------------------------------------------------- the world (mm)
// x to the right of the machine, y toward the operator, z up. The spindle axis
// stands at x = 0, y = 0; the table moves the block under it (X and Y), the head
// moves the tool up and down (Z).
const W = 640;
const H = 400;
const DUR = [18, 15, 22, 29, 18, 23, 25];
const TOP = 107; // block top at rest
const B0 = TOP - BLOCK.h; // vice bed
const ZN0 = 185; // spindle nose at the home pose of the head group
const C = {
  dur: DUR, TOP, B0, ZN0, BX: BLOCK.w / 2, BY: BLOCK.d / 2,
  PW: POCKET.w / 2, PD: POCKET.d / 2, PDEPTH: POCKET.depth, FACE_R: FACE_D / 2,
  TOOL_S: 36, END_L: 42, FACE_S: 62, MAG: [76, -120, 250], MAG_R: 42,
  ZA: 128, // trunnion A axis height
  L1: [W - 88, H - 88], L2: [88, H - 88], LR: 78,
};
const BASE = { x: -140, y: -150, w: 280, d: 260, r: 4 };
const BASE_TOP = 24;
const FLOOR = -10;
const COL = { x: -70, y: -150, w: 140, d: 55, r: 3 };
const HEAD = { x: -46, y: -86, w: 92, d: 112, r: 4 };
const HB0 = ZN0 + 18;
const HT0 = HB0 + 46;
const COL_TOP = HT0 + 66;
const SAD = { x: -100, y: -62, w: 200, d: 124, r: 2 };
const SAD_Z = [BASE_TOP + 6, 46];
const TABLE = { x: -100, y: -62, w: 200, d: 124, r: 2 };
const TABLE_Z = [50, 64];
const CON = [182, -40];

const FIT = [
  ...k.boxCorners(BASE, FLOOR, FLOOR),
  ...k.boxCorners(COL, COL_TOP + 4, COL_TOP + 4),
  [CON[0] + 30, CON[1] + 20, 190], [CON[0] + 30, CON[1] - 20, FLOOR],
  [-190, 60, 50], [0, 130, FLOOR],
];
const P = k.fitProjection(FIT, W, H, { pad: 18, azimuth: 56, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6, steps = 3) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 24) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps), style);
const fx = (o) => G.frameOf(o, X, Y, Z);
const fy = (o) => G.frameOf(o, Y, Z, X);
const fdown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const disc = (F, s0, s1, r, style = {}) => S(G.disc(s0, s1, r, F, P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const face = (y) => k.sideMatrix([0, y], 0, P, 'left');
const rect = (x0, z0, x1, z1, r = 1) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 3).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- floor, base, Y ways
const ground = (() => {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -6), FLOOR, 2, P)}"/>`,
    `<path class="iso-halo" d="${k.haloOf({ x: CON[0] - 22, y: CON[1] - 18, w: 44, d: 36, r: 4 }, FLOOR, 1, P)}" style="opacity:.6"/>`];
  for (const [x, y] of k.corners(BASE, 16)) out.push(post(x, y, 9, FLOOR, 0, { tone: 'lo' }, 6));
  const bolts = k.corners(BASE, 8);
  const fyB = BASE.y + BASE.d;
  const extra = L(k.planOutline(k.insetPlan(BASE, 4), BASE_TOP, P, 3), { tone: 'faint' })
    + L(bolts.map(([x, y]) => k.ring(x, y, 2.4, BASE_TOP, P, 14)).join(''), { tone: 'lo' })
    + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 })
    + `<g transform="${face(fyB)}"><path class="fm-plate" d="${rect(-112, 7, -60, 19, 1.2)}"/><path class="iso-line" data-tone="lo" data-free="" d="M-106 -15.6H-72M-106 -12.6H-84M-106 -9.6H-78"/></g>`
    + Dt([[-110, fyB, 17.6], [-62, fyB, 17.6], [-110, fyB, 8.4], [-62, fyB, 8.4]].map(at), { size: 0.42 });
  out.push(S(k.slabOf(BASE, 0, BASE_TOP, P, 3, 0.8), { tone: 'lo', inner: L(k.sideSeam(BASE, 5, P, 3), { tone: 'faint' }) }) + extra);
  for (const x of [-94, 78]) {
    out.push(box({ x, y: -96, w: 16, d: 196 }, BASE_TOP, BASE_TOP + 6, { crease: 'lo' }, 0.4)
      + Dt([-80, -48, -16, 16, 48, 80].map((y) => at([x + 8, y, BASE_TOP + 6])), { size: 0.4, tone: 'lo' }));
    out.push(box({ x: x + 2, y: 92, w: 12, d: 8 }, BASE_TOP + 6, BASE_TOP + 11, {}, 0.3));
  }
  return out.join('');
})();

// ---------------------------------------------------------------- column, Z ways, magazine
const column = (() => {
  const out = [];
  out.push(S(k.slabOf(COL, BASE_TOP, COL_TOP, P, 3, 0.8), { inner: L(k.sideSeam(COL, BASE_TOP + 14, P, 3) + k.sideSeam(COL, COL_TOP - 10, P, 3), { tone: 'faint' }) }));
  const cap = k.insetPlan(COL, 3);
  out.push(box(cap, COL_TOP, COL_TOP + 4, { crease: 'lo' }, 0.4) + Dt(k.corners(cap, 5).map(([x, y]) => at([x, y, COL_TOP + 4])), { size: 0.42 }));
  // Z ways on the column face, with a ruler strip between them
  for (const x of [-58, 46]) out.push(box({ x, y: -95, w: 12, d: 5, r: 0.5 }, 96, COL_TOP - 4, { crease: 'lo' }, 0.3));
  // a Z scale strip between the ways: ticks hang from its edge
  out.push(box({ x: -30, y: -95, w: 3, d: 1, r: 0.2 }, 110, COL_TOP - 14, { tone: 'lo', crease: 'none' }, 0));
  const tk = [[], []];
  for (let z = 112, i = 0; z <= COL_TOP - 16; z += 5, i++) tk[i % 5 === 0 ? 1 : 0].push(k.segment([-27, -94, z], [i % 5 === 0 ? -21 : -24, -94, z], P));
  out.push(L(tk[0].join(''), { tone: 'lo' }) + L(tk[1].join(''), { tone: 'mid' }));
  // the magazine: a carousel on a bracket at the side of the column
  const [mx, my, mz] = C.MAG;
  out.push(box({ x: 70, y: my - 16, w: 6, d: 32, r: 0.6 }, mz - 16, mz + 16, {}, 0.3));
  return out.join('');
})();
const magazine = (() => {
  const [mx, my, mz] = C.MAG;
  const F = fx([mx, my, mz]);
  return disc(F, 0, 14, C.MAG_R, { inner: L(G.arcOf(F, 7, C.MAG_R, P), { tone: 'faint' }) })
    + g('magFace', '')
    + disc(F, 14, 20, 15) + Dt([at(G.pointOf(F, 20, 0, 0))], { size: 0.55, tone: 'hi' });
})();

// ---------------------------------------------------------------- saddle (Y) and table (X, Y)
const saddle = (() => {
  const out = [box(SAD, SAD_Z[0], SAD_Z[1], {}, 0.6) + L(k.sideSeam(SAD, SAD_Z[0] + 6, P, 3), { tone: 'faint' })];
  for (const y of [-50, 38]) out.push(box({ x: -96, y, w: 192, d: 12, r: 0.8 }, SAD_Z[1], TABLE_Z[0], { crease: 'lo' }, 0.3));
  const Fh = fy([70, SAD.y + SAD.d, SAD_Z[0] + 8]);
  out.push(disc(Fh, 0, 3, 5) + Dt([at(G.pointOf(Fh, 3, 0, 0))], { size: 0.5, tone: 'hi' }));
  return out.join('');
})();
const table = (() => {
  const fyT = TABLE.y + TABLE.d;
  const ticks = k.sideTicks(TABLE.x + 6, TABLE.x + TABLE.w - 6, 5, 5, fyT + 0.8, TABLE_Z[1] - 4, [1.6, 3.2], P);
  const slots = [-36, 0, 36].map((y) => k.planOutline({ x: TABLE.x, y: y - 5, w: TABLE.w, d: 10, r: 0 }, TABLE_Z[1], P, 1)).join('');
  return box(TABLE, TABLE_Z[0], TABLE_Z[1], {}, 0.6) + L(k.sideSeam(TABLE, TABLE_Z[0] + 4, P, 3), { tone: 'faint' }) + L(slots, { tone: 'faint' })
    + box({ x: TABLE.x + 4, y: fyT, w: TABLE.w - 8, d: 0.8, r: 0.2 }, TABLE_Z[0] + 3, TABLE_Z[1] - 3, { tone: 'lo', crease: 'none' }, 0)
    + L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' });
})();
const VZ = TABLE_Z[1];
const viceBack = (() => {
  const out = [box({ x: -90, y: -50, w: 190, d: 100, r: 2 }, VZ, VZ + 6, {}, 0.4)];
  for (const [x, y] of [[-86, -46], [-86, 46], [96, -46], [96, 46]]) out.push(post(x, y, 3.2, VZ + 6, VZ + 9, {}, 6) + Dt([at([x, y, VZ + 9])], { size: 0.4, tone: 'hi' }));
  const bed = { x: -84, y: -45, w: 178, d: 90, r: 1.5 };
  out.push(box(bed, VZ + 6, B0, {}, 0.5) + L(k.sideSeam(bed, B0 - 4, P, 3), { tone: 'faint' }));
  out.push(box({ x: -68, y: -45, w: 16, d: 90 }, B0, TOP - 12, {}, 0.4));
  out.push(box({ x: -52, y: -43, w: 2, d: 86, r: 0.3 }, B0 + 1, TOP - 12, { tone: 'hi', crease: 'lo' }, 0));
  return out.join('');
})();
const viceFront = (() => {
  const out = [];
  out.push(box({ x: 50, y: -43, w: 2, d: 86, r: 0.3 }, B0 + 1, TOP - 12, { tone: 'hi', crease: 'lo' }, 0) + Dt([-24, 24].map((y) => at([52, y, TOP - 17.5])), { size: 0.45 }));
  out.push(box({ x: 52, y: -45, w: 16, d: 90 }, B0, TOP - 12, {}, 0.4));
  out.push(box({ x: 74, y: -16, w: 20, d: 32 }, B0, B0 + 12, {}, 0.4));
  out.push(disc(fx([68, 0, B0 + 6]), 0, 6, 4, { tone: 'hi', crease: 'none' }));
  out.push(disc(fx([94, 0, B0 + 6]), 0, 5, 7));
  out.push(box({ x: 99, y: -3.5, w: 4, d: 7, r: 0.8 }, B0 + 2, B0 + 26, { crease: 'lo' }, 0));
  const Fk = fx([103, 0, B0 + 22]);
  out.push(disc(Fk, 0, 11, 3.2, { tone: 'hi', crease: 'lo' }) + Dt([at(G.pointOf(Fk, 11, 0, 0))], { size: 0.45 }));
  return out.join('');
})();

// ---------------------------------------------------------------- spindle head (Z), drawn at ZN0
const head = (() => {
  const out = [];
  out.push(box({ x: -60, y: -94, w: 120, d: 8, r: 1 }, HB0 - 6, HT0 + 6, { crease: 'lo' }, 0.4));
  const fyH = HEAD.y + HEAD.d;
  const vents = [0, 1, 2].map((i) => rect(-30, HB0 + 24 + i * 6, 10, HB0 + 26.4 + i * 6, 1.2)).join('');
  out.push(S(k.slabOf(HEAD, HB0, HT0, P, 3, 0.8), { inner: L(k.sideSeam(HEAD, HT0 - 10, P, 3), { tone: 'faint' }) })
    + `<g transform="${face(fyH)}">${L(vents, { tone: 'lo' })}</g>`
    + Dt([[-40, fyH, HB0 + 6], [40, fyH, HB0 + 6], [-40, fyH, HT0 - 6], [40, fyH, HT0 - 6]].map(at), { size: 0.42 }));
  const Fm = G.frameOf([0, -30, HT0], Z, X, Y);
  const fins = G.ribsOf(Fm, 2, 22, 22, 24, P, { fade: [0.04, 0.42], seams: true });
  out.push(S(G.solidOf([[0, 22], [24, 22]], Fm, P), { crease: 'lo', inner: k.fadedSvg(fins, { tone: 'lo' }) }));
  out.push(disc(Fm, 24, 28, 17) + Dt([at([0, -30, HT0 + 28])], { size: 0.5, tone: 'hi' }));
  out.push(box({ x: 22, y: -40, w: 9, d: 20, r: 1 }, HT0 + 6, HT0 + 18, {}, 0.3));
  const Fz = fdown([0, 0, ZN0]);
  out.push(disc(Fz, -18, -14, 34));
  out.push(disc(Fz, -14, 0, 28) + Dt(G.dotsOf(Fz, 0, 24, 8, P, { fade: [0.04, 0.4] }), { size: 0.4 }));
  return out.join('');
})();

// ---------------------------------------------------------------- the console (static, right of the machine)
const consoleArt = (() => {
  const [cx, cy] = CON;
  const out = [];
  const foot = { x: cx - 18, y: cy - 15, w: 36, d: 30, r: 1.5 };
  out.push(box(foot, FLOOR, FLOOR + 5, { tone: 'lo' }, 0.4) + Dt(k.corners(foot, 4).map(([x, y]) => at([x, y, FLOOR + 5])), { size: 0.42 }));
  out.push(post(cx, cy, 6, FLOOR + 5, 124, {}, 20) + L(k.sideArc(cx, cy, 6, 40, P, 16), { tone: 'faint' }));
  out.push(post(cx, cy, 9, 124, 130, {}, 24));
  const BOX = { x: cx - 26, y: cy - 8, w: 52, d: 16, r: 2 };
  const fyC = BOX.y + BOX.d;
  const lines = [0, 1, 2, 3, 4].map((i) => `M${cx - 20} ${-(176 - i * 5)}h${[30, 22, 34, 18, 26][i]}`).join('');
  out.push(box(BOX, 130, 188, {}, 0.6)
    + `<g transform="${face(fyC)}"><path class="fm-glass" d="${rect(cx - 23, 150, cx + 23, 182, 2)}"/><path class="iso-line" data-tone="lo" data-free="" d="${lines}"/><path class="iso-line" data-tone="faint" d="${rect(cx - 23, 150, cx + 23, 182, 2)}"/></g>`
    + Dt([[BOX.x + 2, fyC, 132], [BOX.x + BOX.w - 2, fyC, 132], [BOX.x + 2, fyC, 186], [BOX.x + BOX.w - 2, fyC, 186]].map(at), { size: 0.42 }));
  const Fe = fy([cx - 16, fyC, 140]);
  out.push(disc(Fe, 0, 1.6, 5.6) + disc(Fe, 1.6, 4.4, 4.2, { tone: 'hi', crease: 'lo' }));
  const Fo = fy([cx + 2, fyC, 140]);
  out.push(disc(Fo, 0, 3.6, 5) + L(G.ribsOf(Fo, 0.4, 3.2, 5, 16, P, { seams: false }), { tone: 'lo' }));
  const Fw = fy([cx + 17, fyC, 140]);
  out.push(disc(Fw, 0, 2.4, 5.4) + Dt([at(G.pointOf(Fw, 2.4, 3.8, 0.6))], { size: 0.55, tone: 'hi' }));
  return out.join('');
})();

// ---------------------------------------------------------------- HUD (stage space): two loupes
const loupe = (key, [cx, cy], cue) => {
  const r = C.LR;
  return `<g data-cue="${cue}">${g(key, `<circle class="fp-hud-bg" cx="${cx}" cy="${cy}" r="${r + 3}"/><clipPath id="fm-clip-${key}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#fm-clip-${key})">${g(key + 'In', '')}</g><circle class="fp-mark fm-ring" cx="${cx}" cy="${cy}" r="${r}"/>${g(key + 'Lab', '')}`)}</g>`;
};
const hud = [
  `<g data-cue="fz"><g data-cue="thin">${loupe('lp1', C.L1, 'climb')}</g></g>`,
  loupe('lp2', C.L2, 'conv'),
].join('');

// ---------------------------------------------------------------- the drawing (back to front)
const world = [
  g('ground', ground),
  `<g data-cue="vmc">${g('column', column)}${g('mag', magazine)}</g>`,
  g('saddle', saddle),
  g('table', table),
  g('viceB', viceBack),
  `<g data-cue="trunnion">${g('trunB', '')}</g>`,
  g('block', ''),
  `<g data-cue="pocket">${g('pocket', '')}</g>`,
  g('viceF', viceFront),
  `<g data-cue="trunnion">${g('trunF', '')}</g>`,
  g('con', consoleArt),
  `<g data-cue="vmc">${g('head', head)}</g>`,
  `<g data-cue="facemill"><g data-cue="endmill">${g('tool', '')}</g></g>`,
  g('chips', ''),
  `<g data-cue="contour">${g('contour', '')}</g>`,
  `<g data-cue="troch">${g('troch', '')}</g>`,
  `<g data-cue="ae">${g('ae', '')}</g>`,
  `<g data-cue="q">${g('q', '')}</g>`,
  `<g data-cue="vf">${g('vf', '')}</g>`,
  `<g data-cue="lock">${g('lock', '')}</g>`,
  `<g data-cue="simul">${g('simul', '')}</g>`,
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([0, -40, 205], 800), to: cam([0, -30, 192], 690), a: 0.05, b: 0.9 },
  { from: cam([0, 0, 125], 330), to: cam([0, 10, 112], 280) },
  { from: cam([0, 0, 112], 250), to: cam([0, 0, 108], 210) },
  { from: cam([0, 22, 106], 300), to: cam([0, 22, 104], 262) },
  { from: cam([0, 22, 104], 300), to: cam([0, 22, 104], 270) },
  { from: cam([0, 14, 104], 280), to: cam([0, 0, 100], 190), a: 0.6, b: 0.8 },
  { from: cam([0, 0, 134], 320), to: cam([0, 0, 138], 250) },
];

// ---------------------------------------------------------------- the film
const spec = {
  id: 'eng.machining.milling',
  title: { nl: 'Frezen', en: 'Milling' },
  lessons: ['eng.machining.mill', 'eng.machining.millfeeds', 'eng.machining.millstrategy', 'eng.machining.fiveaxis'],
  scenes: [
    {
      id: 's1', lesson: 'eng.machining.mill', level: 1, dur: DUR[0], still: 0.85, title: { nl: 'Het bewerkingscentrum', en: 'The machining centre' },
      beats: [
        { nl: 'Een {t:Bewerkingscentrum|bewerkingscentrum} is een CNC-freesmachine die zelf gereedschap pakt uit een magazijn.', en: 'A {t:Machining centre|machining centre} is a CNC milling machine that changes its own tools from a magazine.', cue: { Bewerkingscentrum: 'vmc' } },
        { nl: 'Op de tafel zit een blok aluminium van {n:100} × {n:80} × {n:25} mm in een bankschroef. De spil hangt erboven.', en: 'On the table, an aluminium block of {n:100} × {n:80} × {n:25} mm sits in a vice. The spindle hangs above it.', read: { nl: 'blok {n:100} × {n:80} × {n:25} mm', en: 'block {n:100} × {n:80} × {n:25} mm' } },
      ],
    },
    {
      id: 's2', lesson: 'eng.machining.mill', level: 1, dur: DUR[1], still: 0.62, title: { nl: 'De vlakfrees', en: 'The face mill' },
      beats: [
        { nl: 'Eerst T1, de {t:Vlakfrees|vlakfrees}: een brede schijf met wisselplaten rondom.', en: 'First T1, the {t:Face mill|face mill}: a wide disc with inserts all around.', cue: { Vlakfrees: 'facemill' } },
        { nl: 'In twee banen maakt hij de bovenkant vlak, in {n:1} minuut.', en: 'In two passes it makes the top flat, in {n:1} minute.', cues: ['facemill'], read: { nl: 'T1 vlakfrees · {n:1} min', en: 'T1 face mill · {n:1} min' } },
      ],
    },
    {
      id: 's3', lesson: 'eng.machining.mill', level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Kamer en contour', en: 'Pocket and contour' },
      beats: [
        { nl: 'Dan T2, een {t:Vingerfrees|vingerfrees} van Ø{n:10}: hij snijdt met zijkant en punt.', en: 'Then T2, a Ø{n:10} {t:End mill|end mill}: it cuts with side and tip.', cue: { Vingerfrees: 'endmill' } },
        { nl: 'Hij freest een {t:Kamer|kamer} van {n:60} × {n:40} mm, {n:8} mm diep: een uitsparing met een bodem.', en: 'It mills a {t:Pocket|pocket} of {n:60} × {n:40} mm, {n:8} mm deep: a recess with a floor.', cue: { Kamer: 'pocket' }, read: { nl: 'T2 Ø{n:10} · kamer {n:60} × {n:40} × {n:8}', en: 'T2 Ø{n:10} · pocket {n:60} × {n:40} × {n:8}' } },
        { nl: 'T3 volgt met zijn zijkant de vorm: de {t:Contour|contour}. De hoeken worden zo rond als de frees.', en: 'T3 follows the shape with its side: the {t:Contour|contour}. The corners get as round as the cutter.', cue: { Contour: 'contour' }, read: { nl: 'T3 Ø{n:8} · hoekradius {n:4} mm', en: 'T3 Ø{n:8} · corner radius {n:4} mm' } },
      ],
    },
    {
      id: 's4', lesson: 'eng.machining.millfeeds', level: 2, dur: DUR[3], still: 0.7, title: { nl: 'Snijwaarden', en: 'Cutting data' },
      beats: [
        { nl: 'Nu een stalen blok, vingerfrees Ø{n:12}, {n:3} tanden, Vc {n:150} m/min: {n:3980} omw/min.', en: 'Now a steel block, a Ø{n:12} end mill, {n:3} teeth, Vc {n:150} m/min: {n:3980} rpm.', read: { nl: 'n = {n:150000} / (π × {n:12}) = {n:3980} omw/min', en: 'n = {n:150000} / (π × {n:12}) = {n:3980} rpm' } },
        { nl: 'Elke tand neemt per omwenteling een hapje: de {t:Voeding per tand|voeding per tand}, fz {n:0.05} mm.', en: 'Each tooth takes one bite per revolution: the {t:Feed per tooth|feed per tooth}, fz {n:0.05} mm.', cue: { 'Voeding per tand': 'fz' } },
        { nl: 'fz × tanden × toeren is de {t:Tafelvoeding|tafelvoeding}: {n:597} mm/min.', en: 'fz × teeth × speed is the {t:Table feed|table feed}: {n:597} mm/min.', cue: { Tafelvoeding: 'vf' }, read: { nl: 'vf = {n:0.05} × {n:3} × {n:3980} = {n:597} mm/min', en: 'vf = {n:0.05} × {n:3} × {n:3980} = {n:597} mm/min' } },
        { nl: 'Hij zit {n:3} mm opzij in het blok: de {t:Snedebreedte|snedebreedte}.', en: 'It sits {n:3} mm sideways in the block: the {t:Width of cut|width of cut}.', cue: { Snedebreedte: 'ae' } },
        { nl: 'Er gaat {n:17.9} cm³ per minuut af: het {t:Verspaningsvolume|verspaningsvolume}.', en: 'It removes {n:17.9} cm³ a minute: the {t:Metal removal rate|metal removal rate}.', cue: { Verspaningsvolume: 'q' }, read: { nl: 'Q = {n:10} × {n:3} × {n:597} / {n:1000} = {n:17.9} cm³/min', en: 'Q = {n:10} × {n:3} × {n:597} / {n:1000} = {n:17.9} cm³/min' } },
      ],
    },
    {
      id: 's5', lesson: 'eng.machining.millstrategy', level: 3, dur: DUR[4], still: 0.5, title: { nl: 'Meelopend of tegenlopend', en: 'Climb or conventional' },
      beats: [
        { nl: 'Bij {t:Meelopend frezen|meelopend frezen} gaat de tand dik het materiaal in en komt hij er dun uit.', en: 'In {t:Climb milling|climb milling} the tooth enters the material thick and leaves thin.', cue: { 'Meelopend frezen': 'climb' } },
        { nl: 'Bij {t:Tegenlopend frezen|tegenlopend frezen} begint hij op nul en schuurt hij. Op CNC is meelopend standaard.', en: 'In {t:Conventional milling|conventional milling} it starts at zero and rubs first. On CNC, climb is standard.', cue: { 'Tegenlopend frezen': 'conv' } },
      ],
    },
    {
      id: 's6', lesson: 'eng.machining.millstrategy', level: 3, dur: DUR[5], still: 0.85, title: { nl: 'Spaanverdunning en trochoïdaal', en: 'Chip thinning and trochoidal' },
      beats: [
        { nl: 'Zit een Ø{n:10} maar {n:1} mm opzij, dan is de spaan {n:0.6} × fz: {t:Spaanverdunning|spaanverdunning}.', en: 'If a Ø{n:10} sits only {n:1} mm sideways, the chip is {n:0.6} × fz: {t:Chip thinning|chip thinning}.', cue: { Spaanverdunning: 'thin' } },
        { nl: 'Dus fz omhoog van {n:0.05} naar {n:0.083}: de voeding gaat van {n:1200} naar {n:2000} mm/min.', en: 'So raise fz from {n:0.05} to {n:0.083}: the feed goes from {n:1200} to {n:2000} mm/min.', cues: ['thin'], read: { nl: 'fz {n:0.05} / {n:0.6} = {n:0.083} · {n:1200} → {n:2000} mm/min', en: 'fz {n:0.05} / {n:0.6} = {n:0.083} · {n:1200} → {n:2000} mm/min' } },
        { nl: '{t:Trochoïdaal frezen|Trochoïdaal frezen}: kleine rondjes, smal opzij, over bijna de hele snijlengte.', en: '{t:Trochoidal milling|Trochoidal milling}: small loops, narrow sideways, along almost the whole cutting length.', cue: { 'Trochoïdaal frezen': 'troch' } },
      ],
    },
    {
      id: 's7', lesson: 'eng.machining.fiveaxis', level: 4, dur: DUR[6], still: 0.9, title: { nl: 'Vijfassig', en: 'Five-axis' },
      beats: [
        { nl: 'Een {t:Draai-kanteltafel|draai-kanteltafel} kantelt en draait het werkstuk: de frees bereikt vijf kanten.', en: 'A {t:Trunnion table|trunnion table} tilts and turns the part: the cutter reaches five sides.', cue: { 'Draai-kanteltafel': 'trunnion' } },
        { nl: '{t:3+2-bewerking|3+2-bewerking}: kantelen, vastzetten, dan frezen met X, Y en Z.', en: '{t:3+2 machining|3+2 machining}: tilt, lock, then mill with X, Y and Z.', cue: { '3+2-bewerking': 'lock' } },
        { nl: 'Van {n:4} naar {n:1} opspanning: per serie {n:3} × {n:30} = {n:90} minuten minder ombouwen.', en: 'From {n:4} setups to {n:1}: per batch {n:3} × {n:30} = {n:90} minutes less changeover.', read: { nl: '{n:4} → {n:1} opspanning · {n:3} × {n:30} = {n:90} min', en: '{n:4} → {n:1} setup · {n:3} × {n:30} = {n:90} min' } },
        { nl: '{t:Simultaan vijfassig|Simultaan vijfassig}: de assen bewegen tegelijk, de frees blijft haaks op het bolle vlak.', en: '{t:Simultaneous 5-axis|Simultaneous 5-axis}: the axes move at once, the cutter stays square to the domed face.', cue: { 'Simultaan vijfassig': 'simul' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, prismOf, disc, dotsOf, arcOf, circleOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.iso{--fm-cut:#22525D;--fm-mat:#1A3C44}
.iso[data-theme="light"]{--fm-cut:#E2ECEA;--fm-mat:#EBE4D4}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.iso .fm-cut.iso-top,.iso .fm-cut.iso-shade,.fm-cut{fill:var(--fm-cut)}
.fm-plate{fill:var(--anatomy-shade-1);stroke:none}
.fm-glass{fill:var(--anatomy-shade-0);stroke:none}
.fm-hole{fill:var(--anatomy-shade-0);stroke:none}
.fm-insert{fill:var(--anatomy-lit);stroke:var(--anatomy-hi);stroke-width:.35px;stroke-linejoin:round}
.fm-chip{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fm-mat{fill:var(--fm-mat);stroke:none}
.fm-tool{fill:var(--anatomy-face);fill-opacity:.6;stroke:var(--anatomy-hi);stroke-width:1px;vector-effect:non-scaling-stroke}
.fm-bite{fill:var(--fp-accent);fill-opacity:.85;stroke:var(--fp-accent);stroke-width:.6;vector-effect:non-scaling-stroke}
.fm-dot{fill:var(--anatomy-hi);stroke:none}
.fm-path{fill:none;stroke:var(--anatomy-mid);stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fm-ring{stroke-width:1.6}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
[data-cue][data-on] .fm-path{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fm-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .fm-bite{fill-opacity:1}
`;

const label = {
  nl: 'Een verticaal bewerkingscentrum: een kolom met gereedschapsmagazijn, een spilkop met frees, en een tafel met een bankschroef en een aluminium blok. Later een draai-kanteltafel die een werkstuk met een bolle bovenkant kantelt en draait.',
  en: 'A vertical machining centre: a column with a tool magazine, a spindle head with a cutter, and a table with a vice and an aluminium block. Later a trunnion table that tilts and turns a part with a domed top.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

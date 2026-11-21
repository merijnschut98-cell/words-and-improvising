// Dev tool, not shipped. Builds the explainer film "Opspannen: 3-2-1 en
// nulpuntsystemen / Workholding" for the workholding topic of Verspanen. It
// serves the Basis lesson eng.machining.fixtures (level 1, "how it works"). The
// topic's levels 2–4 (quality, metrology, capable) are measuring lessons with
// their own planned film, eng.machining.measuring (plan, section 3.1).
//
//   node films/eng.machining.workholding/build.mjs            build the page
//   node films/eng.machining.workholding/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.workholding.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.1.
//
// One machine table, two places on it. Left: a machine vice with stepped jaws,
// parallels and the aluminium housing of the lesson, and a spindle that comes
// down with an end mill or a boring tool. Right: a zero-point base with four
// clamping modules, and on it a pallet carrying the fixture of the figure
// eng.machining.fixture: three rest buttons, two side pins and an end stop
// (3-2-1), two strap clamps on the flange and two push screws. A gizmo with
// six arrows shows the degrees of freedom; panels in stage space show the
// count, the roundness against the tolerance and the setup timeline.
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
// Asserted against the lesson eng.machining.fixtures (the build fails if a value
// drifts); the captions' {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm. Facts as in the lesson and common fixture-design
// texts: a free body has six degrees of freedom; 3 + 2 + 1 point contacts on
// three faces fix all six; clamps push toward the locators. Zero-point clamping
// systems: makers quote repeatability of a few µm (the lesson: within
// 0,005 mm), hedged in the narration.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const WALL = 2; // mm
const BORE_D = 40; // Ø40 H7
const H7 = 0.025; // the tolerance of Ø40 H7
const OVAL_HARD = 0.04; // out of round after release, clamped hard on the wall
const OVAL_FLANGE = 0.008; // clamped on the flange with a torque wrench
const CHIP_TILT = 0.05;
const ZP_REPEAT = 0.005;
const SETUP = [90, 25];
const PER_WEEK = 8;
assert(OVAL_HARD > H7 && OVAL_FLANGE < H7, 'hard clamping is scrap, the flange is within the tolerance');
assert(near(((SETUP[0] - SETUP[1]) * PER_WEEK) / 60, 8.67, 0.005), '(90 − 25) × 8 = 520 min = 8,67 h');
assert((SETUP[0] - SETUP[1]) === 65 && 65 * PER_WEEK === 520, '65 min × 8 = 520 min');
assert(ZP_REPEAT < H7 / 4, 'a zero-point pallet repeats well inside the tolerance');

// The six locators of the fixture (as in the figure eng.machining.fixture),
// each a point contact with normal n at p. Constraint rows [n, (p − O) × n]:
// the rank is the number of degrees of freedom held. 3 rest buttons hold 3,
// with the 2 side pins 5, with the end stop all 6.
const PB = 54; // part bottom on the rest buttons
const O = [0, 0, 75];
const LOC = {
  A1: { p: [-60, 28, PB], n: [0, 0, 1] },
  A2: { p: [60, 36, PB], n: [0, 0, 1] },
  A3: { p: [60, -36, PB], n: [0, 0, 1] },
  B1: { p: [-40, 45, 60], n: [0, -1, 0] },
  B2: { p: [40, 45, 60], n: [0, -1, 0] },
  C: { p: [70, 12, 60], n: [-1, 0, 0] },
};
function rankOf(keys) {
  const m = keys.map((key) => {
    const { p, n } = LOC[key];
    const r = [p[0] - O[0], p[1] - O[1], p[2] - O[2]];
    return [n[0], n[1], n[2], r[1] * n[2] - r[2] * n[1], r[2] * n[0] - r[0] * n[2], r[0] * n[1] - r[1] * n[0]];
  });
  let rank = 0;
  for (let c = 0; c < 6 && rank < m.length; c++) {
    let best = rank;
    for (let i = rank + 1; i < m.length; i++) if (Math.abs(m[i][c]) > Math.abs(m[best][c])) best = i;
    if (Math.abs(m[best][c]) < 1e-9) continue;
    [m[rank], m[best]] = [m[best], m[rank]];
    for (let i = 0; i < m.length; i++) {
      if (i === rank) continue;
      const f = m[i][c] / m[rank][c];
      for (let j = 0; j < 6; j++) m[i][j] -= f * m[rank][j];
    }
    rank++;
  }
  return rank;
}
assert(rankOf(['A1', 'A2', 'A3']) === 3, 'three rest buttons hold 3');
assert(rankOf(['A1', 'A2', 'A3', 'B1', 'B2']) === 5, 'with two side pins 5');
assert(rankOf(Object.keys(LOC)) === 6, '3-2-1 holds all 6');
for (const key of Object.keys(LOC)) assert(rankOf(Object.keys(LOC).filter((x) => x !== key)) === 5, `without ${key} one motion is free`);

// ---------------------------------------------------------------- the world (mm)
// x along the table, y toward the operator, z up; the table top is z = 0.
const W = 640;
const H = 400;
const TABLE = { x: -420, y: -104, w: 572, d: 190, r: 2 };
const ZPB = { x: -124, y: -92, w: 248, d: 166, r: 3 };
const ZPB_TOP = 16;
const MOD_TOP = 22;
const MODS = [[-80, -50], [80, -50], [-80, 50], [80, 50]];
const PLATE = { x: -112, y: -80, w: 224, d: 144, r: 2.5 };
const PZ = 40; // pallet top
const FL = { x: -70, y: -45, w: 140, d: 90, r: 1.2 };
const BODY = { x: -38, y: -35, w: 76, d: 70, r: 1.2 };
const FT = PB + 12; // flange top
const BT = PB + 42; // body top, the bore face
const BORE_R = 22; // drawn bore radius (larger than to scale, so the oval of scene 5 reads at 390 px)
const HOLES = [[-50, 40], [50, 40], [-50, -40], [50, -40]];
const STRAPS = [
  { key: 'L', y: 33, x0: -98, x1: -56, stud: -80, heel: [-100, -90] },
  { key: 'R', y: -30, x0: 56, x1: 98, stud: 80, heel: [90, 100] }, // over rest button A3
];
const PUSH = { back: { x: 0, y: -45 }, end: { x: -70, y: -14 } };
// the vice, centred at VX, clamping along y
const VX = -290;
const VB = 14; // vice bed top
const VPB = 34; // part bottom on the parallels
const VFT = VPB + 12;
const VBT = VPB + 42;
const JAW_TOP = VBT - 10;
const LIP = [VFT + 2, JAW_TOP];
const OPEN = 16; // the moving jaw's opening
const SQUEEZE = 8; // drawn squeeze of the wall when clamped hard (exaggerated)
assert(OVAL_HARD / WALL < 0.05 && (SQUEEZE / 2) / OVAL_HARD === 100, 'the real squeeze is tiny: the drawing exaggerates it 100 times (0,04 mm drawn as 4)');
const DUR = [32, 30, 30, 34, 36, 32, 34, 40];

const FIT = [...k.boxCorners(TABLE, -22, 0), [VX, 0, 200], [0, 0, 160]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 58, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.5, steps = 3) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 24, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const seam = (plan, z, inset = 3) => L(k.sideSeam({ r: 1, ...plan }, z, P, inset), { tone: 'faint' });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hexHead = (cx, cy, z, r = 2.4) => L(k.ring(cx, cy, r, z, P, 6), { tone: 'lo' }) + Dt([at([cx, cy, z])], { size: 0.4, tone: 'hi' });

// ---------------------------------------------------------------- the table
const table = (() => {
  const slots = [-92, -10, 72].map((y) => k.pathOf(k.roundedPlan({ x: TABLE.x + 6, y: y - 3.5, w: TABLE.w - 12, d: 7, r: 1 }, 2).map(([x, yy]) => at([x, yy, 0])), true));
  return [
    `<path class="iso-halo" d="${k.haloOf(k.insetPlan(TABLE, -3), -22, 2, P)}"/>`,
    box(TABLE, -22, 0, { tone: 'lo', inner: seam(TABLE, -8, 2) }, 0.6, 2),
    `<path class="wh-well" d="${slots.join('')}"/>`,
    L(slots.join(''), { tone: 'lo' }),
    L(k.sideTicks(TABLE.x + 20, TABLE.x + TABLE.w - 20, 5, 5, TABLE.y + TABLE.d, -1, [1.8, 3.4], P).minor, { tone: 'lo' }),
    L(k.sideTicks(TABLE.x + 20, TABLE.x + TABLE.w - 20, 5, 5, TABLE.y + TABLE.d, -1, [1.8, 3.4], P).major, { tone: 'mid' }),
  ].join('');
})();

// ---------------------------------------------------------------- the zero-point base and modules
const zpBase = (() => {
  const bolts = [[-116, -84], [116, -84], [-116, 66], [116, 66]];
  return box(ZPB, 0, ZPB_TOP, { inner: seam(ZPB, 5, 3) }, 0.6, 3)
    + L(k.planOutline(k.insetPlan(ZPB, 3), ZPB_TOP, P, 3), { tone: 'faint' })
    + L(bolts.map(([x, y]) => k.ring(x, y, 4.2, ZPB_TOP, P, 16)).join(''), { tone: 'lo' })
    + Dt(bolts.map(([x, y]) => at([x, y, ZPB_TOP])), { size: 0.5, tone: 'hi' })
    // the air line to the modules: a fitting on the near face
    + post(60, ZPB.y + ZPB.d + 3, 3.2, 5, 11, { tone: 'lo' }, 14);
})();
const modules = MODS.map(([x, y]) => post(x, y, 13, ZPB_TOP, MOD_TOP, { inner: L(k.sideArc(x, y, 13, ZPB_TOP + 2.4, P, 24), { tone: 'faint' }) }, 40, 0.4)
  + `<path class="wh-well" d="${k.ring(x, y, 5.5, MOD_TOP, P, 24)}"/>` + L(k.ring(x, y, 5.5, MOD_TOP, P, 24) + k.ring(x, y, 9.5, MOD_TOP, P, 32), { tone: 'lo' })
  + Dt([0, 1, 2, 3].map((i) => at([x + 11 * Math.cos(i * Math.PI / 2 + 0.6), y + 11 * Math.sin(i * Math.PI / 2 + 0.6), MOD_TOP])), { size: 0.4 })).join('');

// ---------------------------------------------------------------- the pallet with the fixture
const plate = (() => {
  const grid = [];
  for (let x = -100; x <= 100; x += 20) for (let y = -70; y <= 54; y += 20) {
    if (x > -78 && x < 78 && y > -52 && y < 50) continue; // under the part
    grid.push(k.ring(x, y, 2.2, PZ, P, 12));
  }
  const screws = k.corners(PLATE, 5);
  const tag = { x: 74, y: 46, w: 30, d: 12, r: 0.8 };
  const rules = [49.5, 52, 54.5].map((y, i) => k.lineOnTop([tag.x + 4, y], [tag.x + [22, 16, 19][i], y], PZ + 0.6, P)).join('');
  return box(PLATE, MOD_TOP, PZ, { inner: seam(PLATE, MOD_TOP + 4, 3) }, 0.7, 3)
    + L(grid.join(''), { tone: 'faint' })
    + L(screws.map(([x, y]) => k.ring(x, y, 2.8, PZ, P, 14)).join(''), { tone: 'lo' })
    + Dt(screws.map(([x, y]) => at([x, y, PZ])), { size: 0.45 })
    + box(tag, PZ, PZ + 0.6, { tone: 'lo', crease: 'none' }, 0, 2) + L(rules, { tone: 'lo', free: true })
    + Dt([at([tag.x + 2, tag.y + 6, PZ + 0.6]), at([tag.x + tag.w - 2, tag.y + 6, PZ + 0.6])], { size: 0.4 });
})();
const restButtons = ['A1', 'A2', 'A3'].map((key) => {
  const [x, y] = LOC[key].p;
  return cue('locA', post(x, y, 8, PZ, PZ + 4, {}, 32) + post(x, y, 6, PZ + 4, PB, { tone: 'hi' }, 32, 0.5));
}).join('');
const sidePins = ['B1', 'B2'].map((key) => {
  const [x] = LOC[key].p;
  const foot = { x: x - 8, y: 45.6, w: 16, d: 12.4, r: 1 };
  return cue('locB', box(foot, PZ, PZ + 6, {}, 0.3, 2) + Dt([at([x - 5, 54.5, PZ + 6]), at([x + 5, 54.5, PZ + 6])], { size: 0.45 })
    + post(x, 50, 5, PZ + 6, 64, { tone: 'hi' }, 32, 0.6));
}).join('');
const endStop = (() => {
  const yc = LOC.C.p[1];
  const foot = { x: 70.6, y: yc - 8, w: 16, d: 16, r: 1 };
  return cue('locC', box(foot, PZ, PZ + 6, {}, 0.3, 2) + Dt([at([83, yc - 5, PZ + 6]), at([83, yc + 5, PZ + 6])], { size: 0.45 })
    + post(75, yc, 5, PZ + 6, 64, { tone: 'hi' }, 32, 0.6));
})();
// push screws: a block bolted to the pallet, a threaded bush; the screw itself
// is drawn by the page (it retracts)
const pushBlocks = (() => {
  const b = { x: PUSH.back.x - 9, y: -70, w: 18, d: 12, r: 1 };
  const e = { x: -96, y: PUSH.end.y - 9, w: 12, d: 18, r: 1 };
  return box(b, PZ, PZ + 22, { inner: seam(b, PZ + 4, 2) }, 0.4, 2) + Dt([at([b.x + 3, b.y + 6, PZ + 22]), at([b.x + 15, b.y + 6, PZ + 22])], { size: 0.45 })
    + box(e, PZ, PZ + 22, { inner: seam(e, PZ + 4, 2) }, 0.4, 2) + Dt([at([e.x + 6, e.y + 3, PZ + 22]), at([e.x + 6, e.y + 15, PZ + 22])], { size: 0.45 })
    + S(G.disc(0, 4, 5, G.frameOf([PUSH.back.x, -58, PZ + 14], Y, X, Z), P))
    + S(G.disc(0, 4, 5, G.frameOf([-84, PUSH.end.y, PZ + 14], X, Y, Z), P));
})();
// strap clamps: heel and stud stay; bar, washer, nut and thread lift when released
function strapParts(st) {
  const { y, stud } = st;
  const heel = { x: st.heel[0], y: y - 7, w: st.heel[1] - st.heel[0], d: 14, r: 1 };
  const bar = { x: st.x0, y: y - 7, w: st.x1 - st.x0, d: 14, r: 1.6 };
  const slot = k.pathOf(k.roundedPlan({ x: stud - 6.5, y: y - 4.6, w: 13, d: 9.2, r: 4.6 }, 6).map(([x, yy]) => at([x, yy, FT + 8])), true);
  return {
    fixed: box(heel, PZ, FT, { inner: seam(heel, PZ + 13, 2) }, 0.3, 2) + post(stud, y, 4, PZ, FT, { crease: 'none' }, 20),
    moving: box(bar, FT, FT + 8, {}, 0.5, 3) + L(slot, { tone: 'lo' })
      + post(stud, y, 7, FT + 8, FT + 9.6, {}, 32)
      + cue('nut' + st.key, post(stud, y, 6.6, FT + 9.6, FT + 15.6, {}, 6, 0.3))
      + post(stud, y, 4, FT + 15.6, FT + 18, { crease: 'none' }, 20) + Dt([at([stud, y, FT + 18])], { size: 0.45, tone: 'hi' }),
  };
}
const SL = strapParts(STRAPS[0]);
const SR = strapParts(STRAPS[1]);

// ---------------------------------------------------------------- the vice
const vice = (() => {
  const base = { x: VX - 58, y: -96, w: 116, d: 200, r: 2 };
  const bed = { x: VX - 44, y: -60, w: 88, d: 140, r: 1 };
  const bolts = [[VX - 50, -88], [VX + 50, -88], [VX - 50, 96], [VX + 50, 96]];
  const backBlock = { x: VX - 56, y: -86, w: 112, d: 39, r: 1.5 };
  const backLip = { x: VX - 56, y: -47, w: 112, d: 12, r: 0.6 };
  const par = [{ x: VX - 75, y: -32, w: 150, d: 7, r: 0.4 }, { x: VX - 75, y: 25, w: 150, d: 7, r: 0.4 }];
  const frontLip = { x: VX - 56, y: 35, w: 112, d: 12, r: 0.6 };
  const frontBlock = { x: VX - 56, y: 47, w: 112, d: 34, r: 1.5 };
  const lipScrews = (plan, yy) => [VX - 36, VX + 36].map((x) => hexHead(x, yy, LIP[1], 2.2)).join('');
  const screwF = G.frameOf([VX, 81, 30], Y, X, Z);
  const handleF = G.frameOf([VX - 46, 136, 30], X, Y, Z);
  return {
    base: `<path class="iso-halo" d="${k.haloOf(base, 0, 1, P)}"/>`
      + box(base, 0, 8, { tone: 'lo', inner: seam(base, 3, 2) }, 0.5, 3)
      + L(bolts.map(([x, y]) => k.ring(x, y, 4, 8, P, 6)).join(''), { tone: 'lo' }) + Dt(bolts.map(([x, y]) => at([x, y, 8])), { size: 0.5, tone: 'hi' })
      + box(bed, 8, VB, {}, 0.4, 2)
      + L(k.lineOnTop([VX - 30, -50], [VX - 30, 74], VB, P) + k.lineOnTop([VX + 30, -50], [VX + 30, 74], VB, P), { tone: 'faint' })
      + L(k.topTicks(-44, 74, 4, 5, VX + 40, VB, [1.6, 3], P, 'y').minor, { tone: 'lo' })
      + L(k.topTicks(-44, 74, 4, 5, VX + 40, VB, [1.6, 3], P, 'y').major, { tone: 'mid' }),
    back: box(backBlock, 8, JAW_TOP, { inner: seam(backBlock, 20, 3) }, 0.6, 3)
      + Dt([at([VX - 48, -66, JAW_TOP]), at([VX + 48, -66, JAW_TOP])], { size: 0.5 }),
    backLip: box(backLip, LIP[0], LIP[1], { tone: 'hi' }, 0.4, 2) + lipScrews(backLip, -41),
    parallels: par.map((p) => box(p, VB, VPB, {}, 0.3, 2)).join(''),
    frontLip: box(frontLip, LIP[0], LIP[1], { tone: 'hi' }, 0.4, 2) + lipScrews(frontLip, 41),
    front: box(frontBlock, VB, JAW_TOP, { inner: seam(frontBlock, VB + 8, 3) }, 0.6, 3)
      + S(G.disc(0, 50, 7, screwF, P), { crease: 'lo' })
      + S(G.disc(48, 55, 9, screwF, P), { inner: '' })
      + S(G.disc(0, 92, 3.5, handleF, P), { crease: 'none' })
      + S(G.disc(0, 18, 6, handleF, P), { tone: 'hi' }) + S(G.disc(74, 92, 6, handleF, P), { tone: 'hi' }),
  };
})();

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('table', table),
  g('viceWorld', [
    g('viceBase', vice.base),
    g('viceBack', vice.back),
    g('vicePar', vice.parallels),
    g('vFlange', ''),
    `<g data-cue="vice">${g('viceBackLip', vice.backLip)}</g>`,
    g('vBody', ''),
    cue('bore', g('boreMark', '')),
    `<g data-cue="vice">${g('viceFront', vice.frontLip + vice.front)}</g>`,
    g('vTool', ''),
  ].join('')),
  g('zpWorld', [
    `<g data-cue="zp">${g('zpBase', zpBase)}${g('modules', modules)}</g>`,
    g('pins', ''),
    g('pallet', [
      `<g data-cue="fixture">${g('plate', plate)}</g>`,
      `<g data-cue="fixture"><g data-cue="loc">${g('rest', restButtons)}</g>${g('push', pushBlocks)}${cue('clamps', g('screwsBack', ''))}${g('strapLFix', SL.fixed)}</g>`,
      cue('chip', g('chip', '')),
      g('part', ''),
      cue('datum', g('marks', '')),
      `<g data-cue="fixture"><g data-cue="loc">${g('pinsB', sidePins)}${g('stopC', endStop)}</g>${g('strapRFix', SR.fixed)}${cue('clamps', g('strapL', SL.moving) + g('strapR', SR.moving))}</g>`,
      cue('wrench', g('wrench', '')),
      cue('air', g('air', '')),
    ].join('')),
  ].join('')),
  cue('dof', g('dof', '')),
].join('');
const hud = [g('count', ''), cue('round', g('round', '')), cue('setup', g('setup', ''))].join('');
// Static paths written with relative line-tos: the same points (to 0,1), about a
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

// ---------------------------------------------------------------- cameras (eased key frames per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const FX = [0, 0, 60]; // the fixture
const VV = [VX, 10, 50]; // the vice
const CAM = [
  [[0, cam([VX, 0, 80], 420)], [0.42, cam([VX, 0, 80], 400)], [0.66, cam([VX, 0, 80], 400)], [0.86, cam([10, 0, 70], 360)]],
  [[0, cam([10, -10, 100], 350)], [1, cam([10, -10, 100], 330)]],
  [[0, cam([10, -10, 90], 340)], [1, cam([10, -10, 80], 320)]],
  [[0, cam([35, 0, 60], 340)], [1, cam([35, 0, 60], 370)]],
  [[0, cam([VX, 0, 70], 360)], [0.4, cam([VX, 0, 80], 330)], [1, cam([VX, 0, 80], 340)]],
  [[0, cam([10, -5, 70], 330)], [0.5, cam([30, -10, 70], 300)], [1, cam([10, -5, 70], 330)]],
  [[0, cam([-35, 15, 66], 250)], [0.7, cam([-35, 15, 66], 240)], [1, cam([-15, 5, 70], 330)]],
  [[0, cam([0, 0, 125], 440)], [0.4, cam([0, 0, 150], 470)], [1, cam([0, 0, 125], 440)]],
];

// ---------------------------------------------------------------- the film
const FIX = 'eng.machining.fixtures';
const spec = {
  id: 'eng.machining.workholding',
  title: { nl: 'Opspannen: 3-2-1 en nulpuntsystemen', en: 'Workholding' },
  lessons: [FIX],
  scenes: [
    {
      id: 's1', lesson: FIX, level: 1, dur: DUR[0], still: 0.55, title: { nl: 'Wat opspannen doet', en: 'What workholding does' },
      beats: [
        { nl: 'Opspannen is het werkstuk vasthouden. Hier een bankschroef: twee bekken klemmen de behuizing.', en: 'Workholding is how the part is held. Here a vice: two jaws clamp the housing.', cues: ['vice'], q: 0.9 },
        { nl: 'De frees duwt hard. Het werkstuk moet blijven liggen, op precies dezelfde plek, zonder te vervormen.', en: 'The cutter pushes hard. The part must stay put, in exactly the same place, without bending.', q: 0.6 },
        { nl: 'Voor één bepaald werkstuk maak je een {t:Mal|mal}: een houder die alleen daarbij past.', en: 'For one particular part you make a {t:Fixture|fixture}: a holder that fits only that part.', cue: { Mal: 'fixture' }, q: 0.95 },
      ],
    },
    {
      id: 's2', lesson: FIX, level: 1, dur: DUR[1], still: 0.85, title: { nl: 'Zes manieren om te bewegen', en: 'Six ways to move' },
      beats: [
        { nl: 'Een los werkstuk kan schuiven: links-rechts, voor-achter, op-neer.', en: 'A loose part can slide: left-right, front-back, up-down.', cues: ['dof'], q: 0.3 },
        { nl: 'En het kan draaien om drie assen: kantelen, kantelen, ronddraaien.', en: 'And it can turn about three axes: tilt, tilt, spin.', cues: ['dof'], q: 0.3 },
        { nl: 'Samen zijn dat de zes {t:Vrijheidsgraden|vrijheidsgraden}.', en: 'Together these are the six {t:Degrees of freedom|degrees of freedom}.', cue: { Vrijheidsgraden: 'dof' }, q: 0.9 },
      ],
    },
    {
      id: 's3', lesson: FIX, level: 1, dur: DUR[2], still: 0.95, title: { nl: 'Het 3-2-1-principe', en: 'The 3-2-1 principle' },
      beats: [
        { nl: 'Het {t:3-2-1-principe|3-2-1-principe}: eerst drie steunpunten onder het hoofdvlak.', en: 'The {t:3-2-1 principle|3-2-1 principle}: first three support points under the main face.', cue: { '3-2-1-principe': 'loc' }, cues: ['locA'], q: 0.9 },
        { nl: 'Dan twee punten langs een zijkant.', en: 'Then two points along a side.', cues: ['locB'], q: 0.9 },
        { nl: 'En één aan het eind. {n:3} + {n:2} + {n:1} = {n:6}: alles vast.', en: 'And one at the end. {n:3} + {n:2} + {n:1} = {n:6}: all fixed.', cues: ['locC'], q: 0.9 },
      ],
    },
    {
      id: 's4', lesson: FIX, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Vlakken A, B en C', en: 'Faces A, B and C' },
      beats: [
        { nl: 'De steunpunten liggen tegen de {t:Referentievlakken|referentievlakken}: A, B en C op de tekening.', en: 'The locators touch the {t:Datums|datums}: A, B and C on the drawing.', cue: { Referentievlakken: 'datum' }, q: 0.5 },
        { nl: 'De klemmen duwen het werkstuk naar die punten toe, nooit de lucht in.', en: 'The clamps push the part towards those points, never into empty space.', cues: ['clamps'], q: 0.9 },
        { nl: 'Plaat, punten en klemmen samen: de {t:Mal|mal}. Elk stuk ligt waar het vorige lag.', en: 'Plate, points and clamps together: the {t:Fixture|fixture}. Each part lies where the last one lay.', cue: { Mal: 'fixture' }, q: 0.9 },
      ],
    },
    {
      id: 's5', lesson: FIX, level: 1, dur: DUR[4], still: 0.95, title: { nl: 'Te hard gespannen', en: 'Clamped too hard' },
      beats: [
        { nl: 'Wanden van {n:2} mm, een boring van Ø{n:40} H7: tot {n:0.025} mm te groot, nooit te klein.', en: 'Walls of {n:2} mm, a bore of Ø{n:40} H7: up to {n:0.025} mm oversize, never undersize.', cues: ['bore'], q: 0.5 },
        { nl: 'Hard in de bankschroef buigen de wanden in (overdreven getekend). De boring wordt rond bewerkt.', en: 'Clamped hard in the vice, the walls bend in (drawn exaggerated). The bore is machined round.', cues: ['vice'], q: 0.62 },
        { nl: 'Na het lossen veren de wanden terug: {n:0.04} mm onrond. Afkeur.', en: 'Once released, the walls spring back: {n:0.04} mm out of round. Scrap.', cues: ['round'], q: 0.95 },
      ],
    },
    {
      id: 's6', lesson: FIX, level: 1, dur: DUR[5], still: 0.95, title: { nl: 'Span waar het stijf is', en: 'Clamp where it is stiff' },
      beats: [
        { nl: 'Span waar het werkstuk stijf is: op de dikke flens, boven de steunpunten.', en: 'Clamp where the part is stiff: on the thick flange, above the support points.', cues: ['clamps'], q: 0.8 },
        { nl: 'Een momentsleutel slaat af bij een vaste draaikracht: iedereen spant even hard.', en: 'A torque wrench clicks off at a set torque: everyone clamps equally hard.', cues: ['wrench'], q: 0.6 },
        { nl: 'Nu blijft de boring binnen {n:0.008} mm rond: ruim binnen de tolerantie.', en: 'Now the bore stays round within {n:0.008} mm: well inside the tolerance.', cues: ['round'], q: 0.9 },
      ],
    },
    {
      id: 's7', lesson: FIX, level: 1, dur: DUR[6], still: 0.95, title: { nl: 'Een spaan eronder', en: 'A chip underneath' },
      beats: [
        { nl: 'Een spaan op een steunpunt: het werkstuk kantelt {n:0.05} mm (overdreven getekend).', en: 'A chip on a support point: the part tilts {n:0.05} mm (drawn exaggerated).', cues: ['chip'], q: 0.9 },
        { nl: 'Eén keer afblazen vóór het laden, en hij ligt weer vlak.', en: 'One air blast before loading, and it lies flat again.', cues: ['air'], q: 0.35 },
        { nl: 'Volgt de afkeur de malpositie, de operator of het tijdstip van de dag?', en: 'Does the scrap follow the fixture position, the operator or the time of day?', cues: ['locA'], q: 0.9 },
      ],
    },
    {
      id: 's8', lesson: FIX, level: 1, dur: DUR[7], still: 0.97, title: { nl: 'Snel omstellen', en: 'Fast setups' },
      beats: [
        { nl: '{t:Omsteltijd|Omsteltijd}: van het laatste goede stuk tot het eerste goede van de volgende order.', en: '{t:Setup time|Setup time}: from the last good part to the first good part of the next job.', cue: { Omsteltijd: 'setup' }, q: 0.6 },
        { nl: 'Een {t:Nulpuntspansysteem|nulpuntspansysteem} pakt de pallet vast, binnen {n:0.005} mm op dezelfde plek.', en: 'A {t:Zero-point clamping|zero-point clamping system} grips the pallet, back in place within {n:0.005} mm.', cue: { Nulpuntspansysteem: 'zp' }, q: 0.9 },
        { nl: 'Van {n:90} naar {n:25} minuten: bij {n:8} omstellingen per week {n:8.67} uur terug.', en: 'From {n:90} to {n:25} minutes: at {n:8} setups a week, {n:8.67} hours back.', cues: ['setup'], q: 0.9 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the learner needs nothing else. Small measures are said the way a
// machinist says them ("vier honderdste millimeter"); the captions and
// readouts carry the asserted numbers.
const SAY = [
  [ // s1 how it works
    { nl: 'Voordat een machine kan verspanen, moet het werkstuk vastzitten: opspannen. Hier zit een aluminium behuizing in een bankschroef: een klem met twee bekken, waarvan er één naar de andere schuift. Op een draaibank doet een klauwplaat hetzelfde, met drie bekken rondom, en een dunne staaf knijp je vast in een spantang.',
      en: 'Before a machine can cut, the part has to be held: workholding. Here an aluminium housing sits in a vice: a clamp with two jaws, one of which slides towards the other. On a lathe, a chuck does the same with three jaws around the part, and a thin bar is squeezed in a collet.' },
    { nl: 'Elke opspanning heeft drie taken. Het werkstuk elke keer op precies dezelfde plek leggen. Het stevig vasthouden tegen de snijkrachten van de frees. En dat zonder het werkstuk te vervormen.',
      en: 'Every kind of workholding has three jobs. Put the part in exactly the same place every time. Hold it firmly against the cutter’s forces. And all that without bending the part.' },
    { nl: 'Voor één bepaald werkstuk maak je vaak een {t:Mal|mal}: een houder die alleen bij dat werkstuk past.',
      en: 'For one particular part you often make a {t:Fixture|fixture}: a holder that fits only that part.' },
  ],
  [ // s2 six degrees of freedom
    { nl: 'Houd de behuizing los boven de mal. Hij kan schuiven in drie richtingen. Links en rechts, voor en achter, op en neer.',
      en: 'Hold the housing loose above the fixture. It can slide in three directions. Left and right, forwards and back, up and down.' },
    { nl: 'En hij kan draaien om drie assen: kantelen naar voren, kantelen opzij, en ronddraaien zoals een draaitafel.',
      en: 'And it can turn about three axes: tilt forwards, tilt sideways, and spin like a turntable.' },
    { nl: 'Drie keer schuiven en drie keer draaien: dat zijn de zes {t:Vrijheidsgraden|vrijheidsgraden}. Een opspanning legt ze alle zes vast.',
      en: 'Three slides and three turns: those are the six {t:Degrees of freedom|degrees of freedom}. Workholding fixes all six.' },
  ],
  [ // s3 the 3-2-1 principle
    { nl: 'Het {t:3-2-1-principe|3-2-1-principe} doet dat met zes punten. Eerst drie steunpunten onder het hoofdvlak. Drie punten bepalen een vlak: nu kan hij niet meer zakken, en niet meer kantelen.',
      en: 'The {t:3-2-1 principle|3-2-1 principle} does it with six points. First three support points under the main face. Three points define a plane: now it can no longer drop, and no longer tilt.' },
    { nl: 'Dan twee punten langs een zijkant. Schuif hem ertegenaan, en hij kan niet meer naar voren, en ook niet meer ronddraaien.',
      en: 'Then two points along a side. Push it against them, and it can no longer move forwards, nor spin.' },
    { nl: 'Tot slot één aanslag aan het eind. Nu kan hij ook niet meer opzij. Drie plus twee plus één: zes punten, en alle zes vrijheidsgraden liggen vast.',
      en: 'Finally one stop at the end. Now it can no longer move sideways either. Three plus two plus one: six points, and all six degrees of freedom are fixed.' },
  ],
  [ // s4 datums and clamps
    { nl: 'Op de tekening heten ze A, B en C: de {t:Referentievlakken|referentievlakken}. De maten worden ervandaan gemeten. Leg je het werkstuk erop, dan werkt de machine vanaf dezelfde plek als de controleur.',
      en: 'On the drawing they are called A, B and C: the {t:Datums|datums}. The sizes are measured from them. Put the part on them, and the machine works from the same place as the inspector.' },
    { nl: 'Pas daarna komen de klemmen. Ze duwen het werkstuk naar de punten toe: de spanklauwen recht boven de steunpunten, de drukschroeven tegen de zijkant en het eind. Nooit de lucht in, want dan buig je het werkstuk.',
      en: 'Only then come the clamps. They push the part towards the points: the strap clamps right above the support points, the push screws against the side and the end. Never into empty space, because then you bend the part.' },
    { nl: 'Plaat, steunpunten en klemmen samen vormen de {t:Mal|mal}. Zo ligt elk volgend werkstuk precies waar het vorige lag.',
      en: 'Plate, support points and clamps together make the {t:Fixture|fixture}. That way every next part lies exactly where the last one lay.' },
  ],
  [ // s5 clamped too hard
    { nl: 'Dan de spankracht. Te weinig, en het werkstuk verschuift onder de snede. Te veel, en het vervormt. Deze behuizing heeft wanden van maar {n:2} millimeter, en een boring van {n:40} millimeter in klasse H7. Die mag tot vijfentwintig duizendste millimeter groter zijn dan veertig, maar niet kleiner.',
      en: 'Then the clamping force. Too little, and the part shifts under the cut. Too much, and it bends. This housing has walls of only {n:2} millimetres, and a bore of {n:40} millimetres in class H7. It may be up to twenty-five thousandths of a millimetre over forty, but never under.' },
    { nl: 'Hij zit hard vast in de bankschroef. De dunne wanden buigen naar binnen, hier sterk overdreven getekend. De boring wordt rond bewerkt, en in de machine meet hij perfect.',
      en: 'It is clamped hard in the vice. The thin walls bend inwards, drawn here greatly exaggerated. In the machine the bore is machined round, and there it measures perfect.' },
    { nl: 'Dan los je de bankschroef. De wanden veren terug en nemen de boring mee. Op de meetmachine is hij nu vier honderdste millimeter onrond. Dat is meer dan de hele tolerantie: afkeur.',
      en: 'Then you open the vice. The walls spring back and take the bore with them. On the measuring machine it is now four hundredths of a millimetre out of round. That is more than the whole tolerance: scrap.' },
  ],
  [ // s6 clamp where it is stiff
    { nl: 'De oplossing: span waar het werkstuk stijf is. Hier op de dikke flens, met de spanklauwen recht boven de steunpunten.',
      en: 'The fix: clamp where the part is stiff. Here on the thick flange, with the strap clamps right above the support points.' },
    { nl: 'Draai de moeren aan met een momentsleutel: een sleutel die afslaat bij een vaste draaikracht. Zo spant iedereen even hard. Een andere oplossing zijn zachte bekken: aluminium bekken, gefreesd in de vorm van het werkstuk, die over een groot oppervlak grijpen.',
      en: 'Tighten the nuts with a torque wrench: a wrench that clicks off at a set torque. That way everyone clamps equally hard. Another fix is soft jaws: aluminium jaws, machined to the shape of the part, which grip over a large area.' },
    { nl: 'Nu blijft de boring binnen acht duizendste millimeter rond. Ruim binnen de tolerantie.',
      en: 'Now the bore stays round within eight thousandths of a millimetre. Well inside the tolerance.' },
  ],
  [ // s7 a chip underneath
    { nl: 'Opspanfouten zijn een grote bron van afkeur. Ligt er een spaan op een steunpunt, dan kantelt het werkstuk: hier vijf honderdste millimeter, weer overdreven getekend.',
      en: 'Workholding errors are a big source of scrap. If a chip lies on a support point, the part tilts: here five hundredths of a millimetre, again exaggerated.' },
    { nl: 'Daarom komt een keer afblazen vóór het laden in de werkinstructie. Andere bekende fouten: te veel spankracht, een werkstuk dat niet helemaal tegen de aanslagen ligt, en versleten bekken.',
      en: 'That is why an air blast before loading goes into the work instruction. Other well-known errors: too much clamping force, a part not pushed fully against its stops, and worn jaws.' },
    { nl: 'Je herkent ze aan een maat die verschilt tussen opspanningen, maar niet binnen één. Vraag dus: volgt de afkeur de malpositie, de operator, of het tijdstip van de dag?',
      en: 'You spot them by a size that varies between clampings, but not within one. So ask: does the scrap follow the fixture position, the operator, or the time of day?' },
  ],
  [ // s8 setup time and the zero-point system
    { nl: '{t:Omsteltijd|Omsteltijd} is alles van het laatste goede stuk van de ene order tot het eerste goede stuk van de volgende: oude mal eraf, nieuwe erop, gereedschap laden, offsets zetten, eerste-stukcontrole. Meestal kost dat {n:30} minuten tot {n:3} uur. Hier {n:90} minuten.',
      en: '{t:Setup time|Setup time} is everything from the last good part of one job to the first good part of the next: old fixture off, new one on, loading tools, setting offsets, first-off inspection. It usually takes {n:30} minutes to {n:3} hours. Here, {n:90} minutes.' },
    { nl: 'Daarom span je het werkstuk vaak al buiten de machine op een pallet, terwijl de vorige order nog draait. Op de tafel zit een {t:Nulpuntspansysteem|nulpuntspansysteem}: een snelsluiting die de pallet aan zijn pennen vastpakt. De pallet zakt erin, wordt vastgetrokken, en ligt weer op dezelfde plek: meestal binnen vijf duizendste millimeter, afhankelijk van het systeem.',
      en: 'That is why the part is often clamped on a pallet outside the machine, while the previous job is still running. On the table sits a {t:Zero-point clamping|zero-point clamping system}: a quick-lock base that grips the pallet by its pins. The pallet drops in, is pulled down, and is back in the same place: usually within five thousandths of a millimetre, depending on the system.' },
    { nl: 'Zo gaat deze omstelling van {n:90} naar {n:25} minuten. Bij {n:8} omstellingen per week is dat {n:8.67} uur extra machinetijd. Hoe je omstellen verder verkort, met SMED, leer je in de module Capaciteit en flow.',
      en: 'That takes this setup from {n:90} to {n:25} minutes. At {n:8} setups a week, that is {n:8.67} hours of extra machine time. How to shorten setups further, with SMED, is in the module Capacity and flow.' },
  ],
];
// a beat's still is given as a fraction of its own span (q): the stage draws
// that beat's state at that moment, so a reduced-motion viewer sees what the
// caption names
{
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((sc, si) => {
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = fr[bi];
      const a1 = bi + 1 < fr.length ? fr[bi + 1] : 1;
      b.still = Math.round((a0 + b.q * (a1 - a0)) * 1000) / 1000;
      delete b.q;
    });
    const last = spec.scenes[si].beats[spec.scenes[si].beats.length - 1];
    spec.scenes[si].still = last.still;
  });
}
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, disc, dot3, add3, sub3, mul3 };})();\n`;
const C = { PB, FT, BT, O, FL, BODY, HOLES, BORE_R, LOC, STRAPS, PUSH, MODS, MOD_TOP, PZ, VX, VB, VPB, VFT, VBT, OPEN, SQUEEZE, dur: DUR };
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8')
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.fp-svg .wh-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.fp-svg .wh-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.fp-svg .wh-acc{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.wh-well{fill:var(--anatomy-shade-2);stroke:none}
.wh-bore{fill:var(--anatomy-shade-1);stroke:none}
.wh-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.96}
.wh-arrow{fill:none;stroke:var(--anatomy-mid);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.wh-head{fill:var(--anatomy-mid);stroke:none}
.wh-arrow[data-on]{stroke:var(--fp-accent);stroke-width:2.6}
.wh-head[data-on]{fill:var(--fp-accent)}
.wh-force{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;vector-effect:non-scaling-stroke}
.wh-forcehead{fill:var(--fp-accent);stroke:none}
.wh-tag{fill:var(--anatomy-card);stroke:var(--fp-accent);stroke-width:1.4;vector-effect:non-scaling-stroke}
.wh-face{fill:color-mix(in srgb,var(--fp-accent) 22%,transparent);stroke:var(--fp-accent);stroke-width:1.6;vector-effect:non-scaling-stroke}
.wh-chip{fill:none;stroke:var(--anatomy-text);stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.wh-chipi{fill:none;stroke:var(--anatomy-lit-top);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .wh-chip{stroke:var(--fp-accent)}
.wh-air{fill:none;stroke:var(--fp-accent);stroke-width:1.4;stroke-linecap:round;stroke-dasharray:5 6;vector-effect:non-scaling-stroke}
.wh-bar{stroke:none;fill:var(--anatomy-shade-2)}
.wh-bar[data-c="acc"]{fill:var(--fp-accent)}
.wh-bar[data-c="lo"]{fill:var(--anatomy-shade-3)}
.wh-bar[data-c="mute"]{fill:var(--anatomy-muted);opacity:.55}
.wh-tol{fill:none;stroke:var(--anatomy-text);stroke-width:1.5;stroke-dasharray:4 3}
.wh-rule{fill:none;stroke:var(--anatomy-mid);stroke-width:1}
.wh-ref{fill:none;stroke:var(--anatomy-text);stroke-width:1.4;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.wh-oval{fill:none;stroke:var(--fp-accent);stroke-width:2;vector-effect:non-scaling-stroke}
.wh-lead{fill:none;stroke:var(--fp-accent);stroke-width:1.4;vector-effect:non-scaling-stroke}
[data-hi] .iso-edge,[data-hi] .iso-crease,[data-hi] .iso-line{stroke:var(--fp-accent)!important}
[data-hi] .iso-top{fill:var(--anatomy-lit-top)}
[data-hi] .iso-shade{fill:var(--anatomy-lit-shade)}
`;

const label = {
  nl: 'Een machinetafel met links een bankschroef met een aluminium behuizing en een spil met frees, en rechts een nulpuntspansysteem met een pallet. Op de pallet een mal: drie steunpunten, twee zijpennen en een eindaanslag, twee spanklauwen op de flens en twee drukschroeven. Pijlen tonen de zes vrijheidsgraden; panelen tonen de rondheid tegen de tolerantie en de omsteltijd.',
  en: 'A machine table with, on the left, a vice holding an aluminium housing and a spindle with a cutter, and on the right a zero-point clamping system with a pallet. On the pallet a fixture: three rest buttons, two side pins and an end stop, two strap clamps on the flange and two push screws. Arrows show the six degrees of freedom; panels show the roundness against the tolerance and the setup time.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

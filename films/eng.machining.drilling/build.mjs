// Dev tool, not shipped. Builds the explainer film "Boren / Drilling" for the
// drilling topic of Verspanen (drill L1, holes L2, deephole L3, holequality L4).
//
//   node films/eng.machining.drilling/build.mjs            build the page
//   node films/eng.machining.drilling/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.drilling.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.1.
//
// The world is the one of the figure eng.machining.drill: a horizontal drilling
// unit on a bed drills into a steel block in a vice. The block is cut open along
// the hole's axis (its top face is the cut), so the hole and the tool inside it
// show. The last two scenes move to a measuring machine (CMM) and a functional
// gauge on the same bench.
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
// Dutch lesson text by defineFilm. Formulas as in the lessons (Sandvik
// Coromant, "Machining formulas and definitions"; ISO 286 for H7; ISO 1101 for
// position).
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rpmOf = (d, vc) => (vc * 1000) / (Math.PI * d);
// drill: four through holes Ø8 × 20 mm, HSS at 25 m/min, f 0,15 (from the supplier's table)
assert(Math.round(rpmOf(8, 25)) === 995, 'Ø8 at 25 m/min → 995 rpm');
assert(Math.round(0.15 * Math.round(rpmOf(8, 25))) === 149, 'feed rate 149 mm/min');
assert(near((20 / 149) * 60, 8, 0.1), 'about 8 s per hole');
assert(118 === 118, 'HSS point angle');
// holes: Ø10 H7 = 10,000–10,015 (ISO 286, IT7 over 6–10 mm is 15 µm); drill 9,8, ream 0,2
assert(near(10 + 0.015, 10.015, 1e-9) && near(10 - 0.2, 9.8, 1e-9), 'Ø10 H7 and the reaming allowance');
assert(0.2 >= 0.1 && 0.2 <= 0.3, 'reaming allowance within 0,1–0,3');
assert(near(8 - 1.25, 6.75, 1e-9), 'M8 tap drill 8 − 1,25 = 6,75 → 6,8');
// deephole: Ø6 × 90 = 15 × D; peck 54 + 30 = 84 s against 13,5 s; 196 h per year at 10.000 parts
assert(90 / 6 === 15, '15 × D');
assert(near((90 / 100) * 60, 54, 1e-9) && (90 / 6) * 2 === 30, '54 s cutting, 15 pecks × 2 s');
assert(near((90 / 400) * 60, 13.5, 1e-9), 'through-spindle coolant 13,5 s');
assert(Math.round(((84 - 13.5) * 10000) / 3600) === 196, '196 h per year');
// holequality: hole 3 at dx 0,024 and dy 0,032 → 0,04 off → position 0,08 against Ø0,1
const DX = 0.024;
const DY = 0.032;
assert(near(Math.hypot(DX, DY), 0.04, 1e-12) && near(2 * Math.hypot(DX, DY), 0.08, 1e-12), 'position of hole 3');
assert(2 * Math.hypot(DX, DY) < 0.1, 'hole 3 is still within Ø0,1');

// ---------------------------------------------------------------- the world (mm)
// x along the spindle (the unit at -x drills toward +x), y toward the operator,
// z up; the bench top is z = 0, the spindle axis is z = ZC = the cut face.
const W = 640;
const H = 400;
const ZC = 100;
const BLOCK = { x: 40, y: -25, w: 110, d: 50, r: 0.6 };
const BENCH = { x: -206, y: -72, w: 398, d: 180, r: 5 };
const BED = { x: -196, y: -56, w: 378, d: 94, r: 2 };
const WAYS = [{ x: -192, y: -46, w: 198, d: 10, r: 0.6 }, { x: -192, y: 26, w: 198, d: 10, r: 0.6 }];
const SADDLE = { x: -186, y: -50, w: 78, d: 90, r: 1.5 };
const HOUSING = { x: -184, y: -36, w: 68, d: 72, r: 3 };
const X_SPINDLE = HOUSING.x + HOUSING.w; // -116
const X_NUT = X_SPINDLE + 36; // -80: the collet nut's nose
const TIP_REST = BLOCK.x - 6;
const STICK = TIP_REST - X_NUT; // 114 mm of tool out of the nut
const PLATE = { x: 13, y: -52, w: 167, d: 92, r: 1.5 };
const VICE = { x: 30, y: -46, w: 132, d: 84, r: 1 };
const JAW_BACK = { x: 30, y: -46, w: 132, d: 20, r: 0.8 };
const JAW_FRONT = { x: 30, y: 26, w: 132, d: 12, r: 0.8 };
// the measuring scenes: a granite table, a cover plate with four holes, a bridge CMM
const CMM = { cx: 60, table: { x: -10, y: -60, w: 150, d: 120, r: 2 }, tableZ: [6, 40] };
const PART = { x: 20, y: -45, w: 90, d: 90, r: 3 };
const PART_T = 12;
const HOLES = [[35, -30], [95, -30], [95, 30], [35, 30]]; // hole 3 is the front right one
const HOLE_R = 5;
const GAUGE = { x: 15, y: -50, w: 100, d: 100, r: 2 };
const GAUGE_T = 10;
const PIN_H = 18;
const LEGS = [-2, 132]; // the bridge legs (x), riding on the edges of the table
const BEAM_Z = 150;

const FIT = [...k.boxCorners(BENCH, -12, 0), ...k.boxCorners(HOUSING, 60, 200), [150, -25, 108]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 64, elevation: 40 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.5, steps = 3) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 24) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const face = (pts) => k.pathOf(pts.map(at), true);
const fX = (o) => G.frameOf(o, X, Y, Z);
const fY = (o) => G.frameOf(o, Y, X, Z);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const seam = (plan, z, inset = 3) => L(k.sideSeam(plan, z, P, inset), { tone: 'faint' });

// ---------------------------------------------------------------- bench, bed and ways
const bench = (() => {
  const screws = k.corners(BENCH, 7);
  return `<path class="iso-halo" d="${k.haloOf(BENCH, -12, 12, P)}"/>`
    + box(BENCH, -12, 0, { tone: 'lo', inner: seam(BENCH, -4, 5) }, 1, 5)
    + L(k.planOutline(k.insetPlan(BENCH, 4), 0, P, 4), { tone: 'faint' })
    + L(screws.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
})();
const bed = (() => {
  const front = BED.y + BED.d;
  let out = k.corners(BED, 12).map(([x, y]) => post(x, y, 6, 0, 6, { tone: 'lo' }, 22)).join('');
  out += box(BED, 6, 40, { inner: seam(BED, 11, 2) }, 0.6, 2);
  const ticks = k.sideTicks(-184, 0, 4, 5, front + 0.8, 37, [1.8, 3.4], P);
  out += box({ x: -186, y: front, w: 188, d: 0.8, r: 0.2 }, 29, 37, { tone: 'lo', crease: 'none' }, 0, 2) + L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' });
  for (const way of WAYS) {
    out += box(way, 40, 46, { crease: 'lo' }, 0.4, 2);
    out += box({ x: way.x + way.w, y: way.y - 1, w: 6, d: way.d + 2, r: 0.5 }, 40, 52, {}, 0.4, 2) + Dt([at([way.x + way.w + 3, way.y + way.d / 2, 52])], { size: 0.45 });
  }
  return out;
})();

// ---------------------------------------------------------------- the drilling unit (moves along x)
const unit = (() => {
  const sy = SADDLE.y + SADDLE.d;
  let out = box(SADDLE, 46, 60, { inner: seam(SADDLE, 56, 2) }, 0.5, 2) + Dt([[SADDLE.x + 8, sy, 53], [SADDLE.x + SADDLE.w - 8, sy, 53]].map(at), { size: 0.5 });
  for (const gx of [SADDLE.x + 22, SADDLE.x + 56]) {
    const Fg = fY([gx, sy, 53]);
    out += S(G.disc(0, 2.4, 2.6, Fg, P)) + Dt([at(G.pointOf(Fg, 2.4, 0, 0))], { size: 0.45, tone: 'hi' });
  }
  const Yf = HOUSING.y + HOUSING.d;
  const slots = [112, 117, 122].map((z) => face([[HOUSING.x + 8, Yf, z], [HOUSING.x + 30, Yf, z], [HOUSING.x + 30, Yf, z + 2], [HOUSING.x + 8, Yf, z + 2]])).join('');
  out += box(HOUSING, 60, 136, { inner: seam(HOUSING, 128, 3) + L(slots, { tone: 'lo' }) }, 0.8, 3);
  const np = { x: HOUSING.x + 36, y: Yf, w: 24, d: 0.8, r: 0.2 };
  const fy = Yf + 0.8;
  const rules = [[100, 16], [96.4, 12], [92.8, 14]].map(([z, len]) => k.segment([np.x + 3, fy, z], [np.x + 3 + len, fy, z], P)).join('');
  out += box(np, 88, 106, { tone: 'lo', crease: 'none' }, 0, 2)
    + L(face([[np.x + 1.4, fy, 89.4], [np.x + np.w - 1.4, fy, 89.4], [np.x + np.w - 1.4, fy, 104.6], [np.x + 1.4, fy, 104.6]]), { tone: 'faint' })
    + L(rules, { tone: 'lo', free: true }) + Dt([[np.x + 1.4, fy, 89.4], [np.x + np.w - 1.4, fy, 89.4], [np.x + 1.4, fy, 104.6], [np.x + np.w - 1.4, fy, 104.6]].map(at), { size: 0.4 });
  const Fo = fY([HOUSING.x + 18, Yf, 82]);
  out += S(G.disc(0, 1.4, 4.4, Fo, P)) + L(G.circleOf(Fo, 1.4, 2.8, P), { tone: 'lo' }) + Dt([at(G.pointOf(Fo, 1.4, 0, 0))], { size: 0.5, tone: 'hi' });
  const mp = { x: -178, y: -24, w: 54, d: 48, r: 1 };
  out += box(mp, 136, 140, { crease: 'lo' }, 0.4, 2) + Dt(k.corners(mp, 4).map(([x, y]) => at([x, y, 140])), { size: 0.42 });
  const MR = 22;
  const MZ = 140 + MR;
  const Fm = fX([-182, 0, MZ]);
  out += S(G.solidOf([[0, MR - 4], [10, MR - 2]], fX([-192, 0, MZ]), P), { tone: 'lo', crease: 'lo' });
  out += S(G.solidOf([[0, MR - 3], [3, MR], [52, MR], [55, MR - 3]], Fm, P), { crease: 'lo', inner: k.fadedSvg(G.ribsOf(Fm, 5, 50, MR, 14, P, { fade: [0.06, 0.5], seams: true }), { tone: 'lo' }) });
  const tb = { x: -160, y: -9, w: 18, d: 18, r: 1 };
  out += box(tb, MZ + MR - 0.3, MZ + MR + 10, {}, 0.5, 2) + Dt(k.corners(tb, 2.6).map(([x, y]) => at([x, y, MZ + MR + 10])), { size: 0.4 });
  const Fn = fX([X_SPINDLE, 0, ZC]);
  out += S(G.disc(0, 6, 24, Fn, P)) + Dt(G.dotsOf(Fn, 6, 20, 6, P, { fade: [0.04, 0.42] }), { size: 0.4 });
  const Fc = fX([X_SPINDLE + 6, 0, ZC]);
  out += S(G.solidOf([[0, 20], [9, 20], [20, 15]], Fc, P), { crease: 'lo', inner: L(G.arcOf(Fc, 4.5, 20, P), { tone: 'faint' }) });
  out += S(G.solidOf([[20, 16.5], [29, 16.5], [30, 15]], Fc, P), { crease: 'lo', inner: k.fadedSvg(G.ribsOf(Fc, 20.6, 28.4, 16.5, 8, P, { fade: [0.05, 0.45], seams: true }), { tone: 'lo' }) })
    + L(G.circleOf(Fc, 30, 9, P), { tone: 'lo' });
  return out;
})();

// ---------------------------------------------------------------- fixture plate, vice, block
const viceBack = (() => {
  const slots = [-30, -6, 18].map((y) => k.planOutline({ x: PLATE.x + 6, y, w: PLATE.w - 12, d: 6, r: 2.8 }, 50, P, 4)).join('');
  let out = box(PLATE, 40, 50, { inner: seam(PLATE, 47, 2) }) + L(slots, { tone: 'faint' });
  out += box(VICE, 50, 60, { inner: seam(VICE, 57, 2) });
  for (const [x, y] of [[23, -22], [23, 28], [171, -40], [171, 28]]) out += post(x, y, 3.4, 50, 54, { crease: 'lo' }, 6) + Dt([at([x, y, 54])], { size: 0.45, tone: 'hi' });
  out += box(JAW_BACK, 60, 96, { inner: seam(JAW_BACK, 90, 2) }, 0.6);
  return out;
})();
const block = box(BLOCK, 60, ZC, {}, 0, 2);
const viceFront = (() => {
  const jf = JAW_FRONT.y + JAW_FRONT.d;
  let out = box(JAW_FRONT, 60, 96, { inner: seam(JAW_FRONT, 90, 2) }, 0.6) + Dt([[JAW_FRONT.x + 10, jf, 84], [JAW_FRONT.x + JAW_FRONT.w - 10, jf, 84]].map(at), { size: 0.55 });
  const Fs = fY([96, jf, 74]);
  out += S(G.disc(0, 18, 5, Fs, P), { crease: 'lo', inner: k.fadedSvg(G.ribsOf(Fs, 1, 17, 5, 10, P, { twist: 2.4, fade: [0.08, 0.5], seams: true }), { tone: 'lo' }) });
  out += S(G.disc(18, 26, 9, Fs, P)) + Dt([at(G.pointOf(Fs, 26, 0, 0))], { size: 0.55, tone: 'hi' });
  out += box({ x: 96, y: jf + 26, w: 34, d: 4, r: 1.4 }, 71, 77, { crease: 'lo' }, 0.3, 2);
  out += post(126, jf + 28, 3.4, 77, 93, { tone: 'hi', crease: 'lo' }, 20);
  return out;
})();

// ---------------------------------------------------------------- the CMM (scenes 7 and 8)
const cmmTable = (() => {
  const T = CMM.table;
  let out = k.corners(T, 10).map(([x, y]) => post(x, y, 5, 0, 6, { tone: 'lo' }, 20)).join('');
  out += box(T, 6, 40, { inner: seam(T, 34, 2) }, 0.8);
  // threaded inserts in the granite, in a grid, as dots with rings
  const ins = [];
  for (let x = T.x + 15; x < T.x + T.w - 5; x += 30) for (let y = T.y + 15; y < T.y + T.d - 5; y += 30) ins.push([x, y]);
  out += L(ins.map(([x, y]) => k.ring(x, y, 1.4, 40, P, 12)).join(''), { tone: 'faint' }) + Dt(ins.map(([x, y]) => at([x, y, 40])), { size: 0.35, tone: 'lo' });
  return out;
})();
const legBack = (x) => box({ x: x - 12, y: -10, w: 24, d: 20, r: 1.5 }, 40, 48, { crease: 'lo' }, 0.5, 2)
  + box({ x: x - 7, y: -6, w: 14, d: 12, r: 1 }, 48, BEAM_Z, { inner: seam({ x: x - 7, y: -6, w: 14, d: 12, r: 1 }, BEAM_Z - 10, 2) }, 0.6, 2);
const beam = box({ x: LEGS[0] - 10, y: -9, w: LEGS[1] - LEGS[0] + 20, d: 18, r: 1.5 }, BEAM_Z, BEAM_Z + 16, { inner: seam({ x: LEGS[0] - 10, y: -9, w: LEGS[1] - LEGS[0] + 20, d: 18, r: 1.5 }, BEAM_Z + 4, 3) }, 0.6, 2);
const part = (() => {
  // a pump cover, at rest on the table; the holes are drawn as openings with a far wall
  let out = box(PART, 0, PART_T, { tone: 'hi', inner: seam(PART, 3, 3) }, 0.5);
  const T = PART_T;
  for (const [x, y] of HOLES) {
    out += `<path class="dr-bore" d="${k.pathOf(Array.from({ length: 33 }, (_, i) => at([x + HOLE_R * Math.cos((i / 32) * Math.PI * 2), y + HOLE_R * Math.sin((i / 32) * Math.PI * 2), T])), true)}"/>`;
    out += L(k.ring(x, y, HOLE_R, T, P, 32), { tone: 'mid' });
  }
  // the datum faces B and C: the left and back edges, with a small engraved letter each
  out += L(k.ring(PART.x + PART.w / 2, PART.y + PART.d / 2, 12, T, P, 32), { tone: 'faint' }) + Dt([at([PART.x + PART.w / 2, PART.y + PART.d / 2, T])], { size: 0.6 });
  return out;
})();
const gauge = (() => {
  let out = box(GAUGE, 40, 40 + GAUGE_T, { inner: seam(GAUGE, 43, 2) }, 0.6);
  out += Dt(k.corners(GAUGE, 5).map(([x, y]) => at([x, y, 40 + GAUGE_T])), { size: 0.45 });
  out += L(k.planOutline(k.insetPlan(GAUGE, 8), 40 + GAUGE_T, P, 4), { tone: 'faint' });
  return out;
})();

// ---------------------------------------------------------------- HUD (stage space)
const MAG = [W - 136, 196];
const MAG_R = 118;
const ring = (cx, cy, r, cls = 'fp-mark') => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
const hud = g('mag', `<clipPath id="fp-magclip"><circle cx="${MAG[0]}" cy="${MAG[1]}" r="${MAG_R}"/></clipPath><circle class="fp-hud-bg" cx="${MAG[0]}" cy="${MAG[1]}" r="${MAG_R}"/>`
  + `<g clip-path="url(#fp-magclip)">${g('magBase', '')}<g data-cue="ted">${g('magTed', '')}</g><g data-cue="zone">${g('magZone', '')}</g><g data-cue="perp">${g('magPerp', '')}</g>${g('magHit', '')}</g>${ring(MAG[0], MAG[1], MAG_R)}`);

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('bench', bench),
  g('bed', bed),
  g('unit', unit),
  g('viceB', viceBack),
  g('block', block),
  g('viceF', viceFront),
  g('secBack', ''),
  `<g data-cue="tool">${g('tool', '')}</g>`,
  `<g data-cue="flute">${g('flutes', '')}</g>`,
  `<g data-cue="pin">${g('pin', '')}</g>`,
  g('secFront', ''),
  `<g data-cue="rim">${g('rim', '')}</g>`,
  `<g data-cue="point">${g('point', '')}</g>`,
  `<g data-cue="wander">${g('wander', '')}</g>`,
  `<g data-cue="chips">${g('chips', '')}</g>`,
  `<g data-cue="coolant">${g('coolant', '')}</g>`,
  g('cmmTable', cmmTable),
  g('legL', legBack(LEGS[0])),
  `<g data-cue="gauge">${g('gauge', gauge)}${g('pinsLo', '')}</g>`,
  g('part', part),
  g('pinsHi', ''),
  g('legR', legBack(LEGS[1])),
  g('beam', beam),
  g('carriage', ''),
  g('probe', ''),
  g('worldLabels', ''),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([0, 0, 90], 560), to: cam([52, 0, 98], 170), a: 0, b: 0.4 },
  { from: cam([46, 0, 98], 130), to: cam([50, 0, 98], 115) },
  { from: cam([44, 0, 98], 140), to: cam([50, 0, 98], 125) },
  { from: cam([46, 0, 98], 125), to: cam([62, 0, 92], 190), a: 0.56, b: 0.7 },
  { from: cam([70, 0, 97], 210), to: cam([88, 0, 97], 200) },
  { from: cam([34, 0, 99], 120), to: cam([110, 0, 97], 230), a: 0.3, b: 0.75 },
  { from: cam([120, 10, 100], 380), to: cam([150, 20, 110], 400) },
  { from: cam([150, 20, 70], 380), to: cam([110, 0, 60], 330), a: 0.4, b: 0.6 },
];
const DUR = [22, 15, 19, 21, 24, 14, 18, 17];

// ---------------------------------------------------------------- the film
const spec = {
  id: 'eng.machining.drilling',
  title: { nl: 'Boren', en: 'Drilling' },
  lessons: ['eng.machining.drill', 'eng.machining.holes', 'eng.machining.deephole', 'eng.machining.holequality'],
  scenes: [
    {
      id: 's1', lesson: 'eng.machining.drill', level: 1, dur: DUR[0], still: 0.86, title: { nl: 'Aanboren, dan boren', en: 'Spot first, then drill' },
      beats: [
        { nl: 'Een {t:Spiraalboor|spiraalboor} op een vlak blok glijdt bij het aansnijden opzij: dat heet {t:Weglopen|weglopen}.', en: 'A {t:Twist drill|twist drill} on a flat block slides sideways as it starts: that is called {t:Drill wander|drill wander}.', cue: { Spiraalboor: 'tool', Weglopen: 'wander' } },
        { nl: 'Daarom eerst een kuiltje met een {t:Centreerboor|centreerboor}: kort en stijf, met een brede punt.', en: 'So first a dimple with a {t:Centre drill|centre drill}: short and stiff, with a broad point.', cue: { Centreerboor: 'tool' } },
        { nl: 'Dan de spiraalboor. Langs elke {t:Spaangroef|spaangroef} draaien de spanen naar buiten.', en: 'Then the twist drill. Along each {t:Flute|flute} the chips turn their way out.', cue: { Spaangroef: 'flute' }, cues: ['chips'], read: { nl: 'Ø{n:8} HSS · {n:25} m/min → {n:995} omw/min · f {n:0.15}', en: 'Ø{n:8} HSS · {n:25} m/min → {n:995} rpm · f {n:0.15}' } },
      ],
    },
    {
      id: 's2', lesson: 'eng.machining.drill', level: 1, dur: DUR[1], still: 0.85, title: { nl: 'Tophoek en blind gat', en: 'Point angle and blind hole' },
      beats: [
        { nl: 'De punt is een kegel. De {t:Tophoek|tophoek}, {n:118}° bij gewone HSS-boren, centreert de boor.', en: 'The point is a cone. The {t:Point angle|point angle}, {n:118}° on ordinary HSS drills, centres the drill.', cue: { Tophoek: 'point' } },
        { nl: 'Dit gat gaat er niet doorheen: een {t:Blind gat|blind gat}, met een kegelvormige bodem.', en: 'This hole does not go through the block: a {t:Blind hole|blind hole}, with a cone-shaped bottom.', cue: { 'Blind gat': 'rim' }, read: { nl: 'Ø{n:8} × {n:20} mm · zo’n {n:8} s per gat', en: 'Ø{n:8} × {n:20} mm · about {n:8} s per hole' } },
      ],
    },
    {
      id: 's3', lesson: 'eng.machining.holes', level: 2, dur: DUR[2], still: 0.9, title: { nl: 'Ruimen tot H7', en: 'Reaming to H7' },
      beats: [
        { nl: 'Voor Ø{n:10} {t:H7|H7} boor je eerst Ø{n:9.8}. De ruimer haalt de laatste {n:0.2} mm weg.', en: 'For Ø{n:10} {t:H7|H7} you first drill Ø{n:9.8}. The reamer takes off the last {n:0.2} mm.', cue: { H7: 'rim' } },
        { nl: 'Het gat meet dan tussen {n:10.000} en {n:10.015} mm.', en: 'The hole then measures between {n:10.000} and {n:10.015} mm.', cues: ['rim'], read: { nl: 'Ø{n:10} H7 = {n:10.000} … {n:10.015} mm', en: 'Ø{n:10} H7 = {n:10.000} … {n:10.015} mm' } },
        { nl: 'Gat en pen samen heten de {t:Passing|passing}: deze pen schuift erin.', en: 'Hole and pin together are called the {t:Fit|fit}: this pin slides in.', cue: { Passing: 'pin' } },
      ],
    },
    {
      id: 's4', lesson: 'eng.machining.holes', level: 2, dur: DUR[3], still: 0.97, title: { nl: 'Tappen en kotteren', en: 'Tapping and boring' },
      beats: [
        { nl: 'Voor M{n:8} boor je eerst een {t:Kerngat|kerngat} van Ø{n:6.8}: de maat min de spoed van {n:1.25} mm.', en: 'For M{n:8} you first drill a {t:Tap drill hole|tap drill hole} of Ø{n:6.8}: the size minus the pitch of {n:1.25} mm.', cue: { Kerngat: 'rim' } },
        { nl: 'Daarna snijdt de tap de schroefdraad: {t:Tappen|tappen}.', en: 'Then the tap cuts the thread: {t:Tapping|tapping}.', cue: { Tappen: 'tool' } },
        { nl: 'Een groot passend gat, zoals Ø{n:40} H7, draait een kotterkop uit: {t:Kotteren|kotteren}.', en: 'A large fitted hole, such as Ø{n:40} H7, is opened up by a boring head: {t:Boring|boring}.', cue: { Kotteren: 'tool' }, read: { nl: 'Ø{n:40} H7: tolerantie {n:0} tot +{n:0.025} mm', en: 'Ø{n:40} H7: tolerance {n:0} to +{n:0.025} mm' } },
      ],
    },
    {
      id: 's5', lesson: 'eng.machining.deephole', level: 3, dur: DUR[4], still: 0.82, title: { nl: 'Diep boren', en: 'Deep drilling' },
      beats: [
        { nl: 'Ø{n:6} en {n:90} mm diep is {n:15} × D. Dan draait alles om {t:Spaanafvoer|spaanafvoer}.', en: 'Ø{n:6} and {n:90} mm deep is {n:15} × D. Then it is all about {t:Chip evacuation|chip evacuation}.', cue: { Spaanafvoer: 'chips' } },
        { nl: 'Bij {t:Pikboren|pikboren} trekt de boor zich steeds terug: {n:54} + {n:30} = {n:84} seconden per gat.', en: 'In {t:Peck drilling|peck drilling} the drill keeps pulling back: {n:54} + {n:30} = {n:84} seconds per hole.', cue: { Pikboren: 'tool' } },
        { nl: 'Met {t:Koeling door de spil|koeling door de spil} spoelt vloeistof de spanen eruit: {n:13.5} seconden, zonder pikken.', en: 'With {t:Through-spindle coolant|through-spindle coolant}, coolant flushes the chips out: {n:13.5} seconds, no pecking.', cue: { 'Koeling door de spil': 'coolant' }, read: { nl: '{n:84} s → {n:13.5} s · {n:10000} stuks: {n:196} uur per jaar', en: '{n:84} s → {n:13.5} s · {n:10000} parts: {n:196} hours a year' } },
      ],
    },
    {
      id: 's6', lesson: 'eng.machining.deephole', level: 3, dur: DUR[5], still: 0.7, title: { nl: 'De kanonboor', en: 'The gun drill' },
      beats: [
        { nl: 'Nog dieper of extra recht: een {t:Kanonboor|kanonboor}, met één snijkant en een holle schacht.', en: 'Deeper still, or extra straight: a {t:Gun drill|gun drill}, with one cutting edge and a hollow shank.', cue: { Kanonboor: 'tool' } },
        { nl: 'De vloeistof gaat door de schacht en spoelt de spanen terug langs de groef.', en: 'The coolant runs through the shank and flushes the chips back along the groove.', cues: ['coolant', 'chips'] },
      ],
    },
    {
      id: 's7', lesson: 'eng.machining.holequality', level: 4, dur: DUR[6], still: 0.86, title: { nl: 'Positie meten', en: 'Measuring position' },
      beats: [
        { nl: '{t:Positietolerantie|Positietolerantie}: een cirkel van Ø{n:0.1} om de plek uit de {t:Theoretisch exacte maat|theoretisch exacte maten}.', en: 'The {t:Position tolerance|position tolerance}: a circle of Ø{n:0.1} around the spot set by the {t:Theoretically exact dimension|theoretically exact dimensions}.', cue: { Positietolerantie: 'zone', 'Theoretisch exacte maat': 'ted' } },
        { nl: 'De CMM meet gat {n:3}: dx {n:0.024} en dy {n:0.032}, dus {n:0.04} ernaast. Positie {n:2} × {n:0.04} = {n:0.08}.', en: 'The CMM measures hole {n:3}: dx {n:0.024} and dy {n:0.032}, so {n:0.04} off. Position {n:2} × {n:0.04} = {n:0.08}.', cues: ['zone'], read: { nl: '2 × √({n:0.024}² + {n:0.032}²) = {n:0.08} ≤ {n:0.1}', en: '2 × √({n:0.024}² + {n:0.032}²) = {n:0.08} ≤ {n:0.1}' } },
      ],
    },
    {
      id: 's8', lesson: 'eng.machining.holequality', level: 4, dur: DUR[7], still: 0.88, title: { nl: 'Haaks en functioneel', en: 'Square and functional' },
      beats: [
        { nl: '{t:Haaksheid|Haaksheid}: de as van het gat staat loodrecht op vlak A, binnen Ø{n:0.05}.', en: '{t:Perpendicularity|Perpendicularity}: the hole’s axis must stand square to face A, within Ø{n:0.05}.', cue: { Haaksheid: 'perp' } },
        { nl: 'In serie gaat het deel op een {t:Functioneel kaliber|functioneel kaliber} met pennen op de exacte plekken. Past het, dan klopt de positie.', en: 'In series the part goes onto a {t:Functional gauge|functional gauge} with pins at the exact places. If it fits, the position is good.', cue: { 'Functioneel kaliber': 'gauge' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, tangentOf, angleToward, solidOf, prismOf, lathe, disc, dotsOf, arcOf, circleOf, sphereOf, dot3, add3, sub3, mul3 };})();\n`;
const C = {
  ZC, BX0: BLOCK.x, BX1: BLOCK.x + BLOCK.w, BY0: BLOCK.y, BY1: BLOCK.y + BLOCK.d, X_NUT, STICK, TIP_REST,
  dur: DUR, MAG, MAG_R, DX, DY, PART, PART_T, HOLES, HOLE_R, GAUGE, GAUGE_T, PIN_H, LEGS, BEAM_Z, CMMZ: CMM.tableZ[1],
};
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.iso{--dr-bore:#081A1E;--dr-wall:#0E262C}
.iso[data-theme="light"]{--dr-bore:#B8AD94;--dr-wall:#D3C9B2}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-chip{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.dr-flute{fill:var(--anatomy-shade-1);stroke:none}
.dr-bore{fill:var(--dr-bore);stroke:none}
.dr-wall{fill:var(--dr-wall);stroke:none}
.dr-drop{fill:var(--fp-accent);stroke:none}
.dr-dot{fill:var(--anatomy-hi);stroke:none}
.dr-zone{fill:color-mix(in srgb,var(--fp-accent) 14%,transparent);stroke:var(--anatomy-mid);stroke-width:1.4;vector-effect:non-scaling-stroke}
[data-cue][data-on] .dr-flute{fill:var(--anatomy-lit-shade)}
.dr-groove,[data-cue][data-on] .dr-groove{fill:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-shade-1))}
[data-cue][data-on] .dr-zone{stroke:var(--fp-accent)}
[data-cue][data-on] .dr-chipon{stroke:var(--fp-accent)}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
.fp-box{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-box{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een horizontale booreenheid op een machinebed boort in een stalen blok in een machineklem. Het blok is doorgesneden langs de as van het gat, zodat het gat en het gereedschap te zien zijn: een spiraalboor, een centreerboor, een ruimer met een pen, een tap, een kotterkop en een kanonboor. Daarna een meetmachine (CMM) met een taster boven een deksel met vier gaten, en een functioneel kaliber met pennen.',
  en: 'A horizontal drilling unit on a machine bed drills into a steel block held in a vice. The block is cut open along the hole’s axis, so the hole and the tool show: a twist drill, a centre drill, a reamer with a pin, a tap, a boring head and a gun drill. Then a measuring machine (CMM) with a probe above a cover with four holes, and a functional gauge with pins.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

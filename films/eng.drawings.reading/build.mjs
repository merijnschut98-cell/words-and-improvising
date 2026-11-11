// Dev tool, not shipped. Builds the explainer film "Een tekening lezen /
// Reading a drawing" for two lessons of Tekeningen en regeling:
// eng.drawings.views (level 1 of Een technische tekening lezen) and
// eng.drawings.gdt (level 2 of Toleranties en GD&T).
//
//   node films/eng.drawings.reading/build.mjs            build the page
//   node films/eng.drawings.reading/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.drawings.reading.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.drawings). The plan's lesson ids both still exist; no mapping needed.
//
// Two places on one floor, left to right. A drawing desk: a bent sheet-steel
// bracket (the part of the views lesson, drawing 4711-203), a screen on a stand
// that shows the released drawing from the PDM system, an old print in a
// plastic sleeve, and on the floor a tagged crate of rejected brackets. A
// bridge CMM (the one from the measuring film, eng.machining.measuring): a
// granite plate on a stand, two legs, the beam with its carriage, the ram with
// the probe, and on the granite a fixture with three rests (datum A), two pins
// along the long edge (B) and one pin at the short edge (C) holding the plate
// with four holes of the GD&T lesson. The drawing sheet, the tolerance frame
// and the loupe on the position zone sit in stage space over the drawing;
// every sheet and chart is labelled "voorbeeld".
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';
import { lessonTextOf } from '../_kit/assert.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Sources as in the lessons: ISO 2768-1 class m (±0,3 mm
// for over 30 up to 120 mm), ISO 5456-2 (first- and third-angle projection),
// ISO 1101 / ASME Y14.5 (position, datums, MMC bonus).
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const r2 = (v) => Math.round(v * 100) / 100;
// views: scale 1:5, 40 mm on paper → 200 mm; ISO 2768-m on 50 mm: ±0,3 → 49,7–50,3
assert(40 * 5 === 200, '1:5, 40 mm → 200 mm');
const M2768 = (n) => (n > 6 && n <= 30 ? 0.2 : n > 30 && n <= 120 ? 0.3 : NaN);
assert(near(50 - M2768(50), 49.7) && near(50 + M2768(50), 50.3), '50 → 49,7–50,3');
// gdt: hole Ø10,2 +0,1/0, measured 0,12 and 0,09 off → 0,15 → Ø0,30, on the Ø0,3 limit
const off = Math.hypot(0.12, 0.09);
assert(near(off, 0.15) && near(2 * off, 0.3), '√(0,12² + 0,09²) = 0,15, Ø0,30');
// MMC: the hole measures Ø10,25, 0,05 over its smallest size → bonus 0,05 → Ø0,35 allowed
assert(near(r2(10.25 - 10.2), 0.05) && near(r2(0.3 + 10.25 - 10.2), 0.35), 'bonus 0,05 → 0,35');
// round zone round a ±0,1 square: Ø0,28, 57 % more area
const dZ = 2 * Math.hypot(0.1, 0.1);
assert(r2(dZ) === 0.28 && Math.round((Math.PI * (dZ / 2) ** 2 / 0.04 - 1) * 100) === 57, 'Ø0,28, +57 %');
// the plate: basic 25 from B and 40 from C (the holes also at 55 and 80, drawn only)
const HOLE = { fromB: 25, fromC: 40, d: 10.2 };

// Literal strings the film shows that are no plain numbers (a drawing number,
// a material, a scale, a standard, revision letters): each must still stand in
// the Dutch and the English lesson text.
const LITERALS = {
  'eng.drawings.views': ['4711-203', 'S235', '1:1', '1:2', '2:1', '1:5', 'ISO 2768-m', 'R2', 'R3', 'Ø8', 'Ø9', 'A-A'],
  'eng.drawings.gdt': ['Ø10', 'M10', 'Ø0', 'Ⓜ', 'A B C', 'ASME Y14.5', 'ISO GPS'],
};
{
  const L = await allLessons();
  for (const [id, list] of Object.entries(LITERALS)) {
    for (const lang of ['nl', 'en']) {
      const text = lessonTextOf(L[lang].get(id));
      for (const s of list) assert(text.includes(s), `"${s}" no longer in ${id} (${lang})`);
    }
  }
}

// ---------------------------------------------------------------- the world
// x to the right along the floor (the desk at -x, the CMM at +x), y toward
// the viewer, z up; the floor is z = 0. About a millimetre per unit for the
// parts (the bracket 120 × 50 × 60, the plate 120 × 80), not for the furniture.
const W = 640;
const H = 400;
const DT = 76; // desk top
const BR = { x: -318, y: -34, w: 120, d: 50, h: 60, t: 4 }; // the bracket, upright at the back
const GT = 76; // granite top
const PL = { x: 170, y: -40, w: 120, d: 80, z0: 84, z1: 94 }; // the plate: C edge at x 170, B edge at y -40
const HOLES = [[40, 25], [80, 25], [40, 55], [80, 55]].map(([c, b]) => [PL.x + c, PL.y + b]);
assert(HOLES[0][0] - PL.x === HOLE.fromC && HOLES[0][1] - PL.y === HOLE.fromB, 'hole 1 at 40 from C, 25 from B');
const CX = 230; // the ram's axis at rest
const BALL = 125; // ruby ball centre at rest
const C = { DT, BR, PL, HOLES, CX, BALL, HR: HOLE.d / 2 };

const FIT = [[-345, -60, 0], [330, 70, 0], [-345, -60, 290], [330, 70, 300], [-345, 70, 0], [330, -110, 0]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 52, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.5, steps = 2) => S(k.slabOf({ r: 0.8, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 3) => L(k.sideSeam({ r: 0.8, ...plan }, z, P, inset), { tone: 'faint' });
const screws = (plan, z, inset = 3) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.5 });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'tl-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const flat = (x0, y0, x1, y1, z, cls) => `<path class="${cls}" d="${k.pathOf([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]].map(at), true)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const flatRules = (x0, y0, z, lens, step = 3) => L(lens.map((len, i) => k.segment([x0, y0 + i * step, z], [x0 + len, y0 + i * step, z], P)).join(''), { tone: 'lo', free: true });
// a dark hole seen from above: the hole, its far wall and the rim
const bore = (x, y, r, z, depth) => {
  const ringPts = k.circleRing(x, y, r, 40);
  const far = ringPts.filter(([px, py]) => k.depthOf([px, py, z], P) < k.depthOf([x, y, z], P));
  return `<path class="dr-hole" d="${k.onTop(ringPts, z, P, true)}"/>`
    + `<path class="dr-wall" d="${k.pathOf(far.map(([px, py]) => at([px, py, z])))}"/>`
    + L(k.ring(x, y, r, z, P, 40), { tone: 'mid' })
    + L(k.ring(x, y, r, z - Math.min(depth, 4), P, 40), { tone: 'faint' });
};
// a hole through a face that looks along +y (the bracket's upright)
const holeY = (x, y, z, r) => {
  const pts = Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * 2 * Math.PI; return at([x + Math.cos(a) * r, y, z + Math.sin(a) * r]); });
  return `<path class="dr-hole" d="${k.pathOf(pts, true)}"/>` + L(k.pathOf(pts, true), { tone: 'mid' });
};
const feet = (plan, z = 3, r = 2.4) => k.corners(plan, 4).map(([x, y]) => post(x, y, r, 0, z, { tone: 'lo' }, 14)).join('');

// ---------------------------------------------------------------- the desk
const DESK = { x: -336, y: -52, w: 214, d: 96, r: 1.5 };
const desk = [
  halo(k.insetPlan(DESK, -3), 0, 2),
  ...k.corners(DESK, 5).map(([x, y]) => box({ x: x - 2.5, y: y - 2.5, w: 5, d: 5, r: 0.5 }, 0, DT - 5, { tone: 'lo' }, 0.2, 1)),
  feet(DESK, 2, 3.2),
  // the shelf low between the legs, and a drawer block under the right end
  box({ x: DESK.x + 6, y: DESK.y + 6, w: DESK.w - 12, d: DESK.d - 12, r: 0.6 }, 14, 17, { tone: 'lo', crease: 'none' }, 0, 1),
  box({ x: -196, y: -46, w: 64, d: 84, r: 0.8 }, 40, DT - 5, { tone: 'lo', inner: seam({ x: -196, y: -46, w: 64, d: 84 }, 56, 2) }, 0.3, 1),
  card(38.2, -188, -140, 44, 54), card(38.2, -188, -140, 58, 68),
  box({ x: -170, y: 38, w: 12, d: 1.6, r: 0.4 }, 50, 51.6, { tone: 'hi', crease: 'lo' }, 0, 1),
  box({ x: -170, y: 38, w: 12, d: 1.6, r: 0.4 }, 64, 65.6, { tone: 'hi', crease: 'lo' }, 0, 1),
  box(DESK, DT - 5, DT, { inner: seam(DESK, DT - 2.5, 3) }, 0.6, 3),
  L(k.planOutline(k.insetPlan(DESK, 3), DT, P, 3), { tone: 'faint' }),
  screws(DESK, DT, 3),
].join('');
// the screen on its stand (the PDM drawing), at the back right of the desk
const MON = { x: -186, y: -44, w: 58, d: 5, r: 0.6 };
const monitor = [
  box({ x: -166, y: -38, w: 18, d: 14, r: 1 }, DT, DT + 2, { tone: 'lo' }, 0.3, 1),
  box({ x: -159, y: -42, w: 4, d: 4, r: 0.4 }, DT + 2, 112, { tone: 'lo' }, 0.2, 1),
  box(MON, 104, 146, { inner: seam(MON, 108, 2) }, 0.4, 1),
  card(MON.y + MON.d + 0.1, MON.x + 3, MON.x + MON.w - 3, 108, 143, 'tl-screen'),
  // the drawing on the screen: three views and the title block as hairlines
  L([k.pathOf([[-180, -38.8, 136], [-168, -38.8, 136], [-168, -38.8, 128], [-180, -38.8, 128]].map(at), true),
    k.pathOf([[-180, -38.8, 124], [-168, -38.8, 124], [-168, -38.8, 116], [-180, -38.8, 116]].map(at), true),
    k.pathOf([[-164, -38.8, 136], [-158, -38.8, 136], [-158, -38.8, 128], [-164, -38.8, 128]].map(at), true),
    k.pathOf([[-152, -38.8, 118], [-134, -38.8, 118], [-134, -38.8, 111], [-152, -38.8, 111]].map(at), true)].join(''), { tone: 'mid' }),
  rules(-150, -38.7, 116.6, [10, 14], 2.6),
  post(-134, -38.6, 0.9, 140, 140.6, { tone: 'hi' }, 8),
].join('');
// the old print in its plastic sleeve, lying at the front right of the desk
const sleeve = [
  flat(-198, 4, -146, 36, DT + 0.2, 'tl-glass'),
  flat(-196, 6, -150, 34, DT + 0.4, 'tl-paper'),
  L([k.pathOf([[-193, 9, DT + 0.5], [-181, 9, DT + 0.5], [-181, 17, DT + 0.5], [-193, 17, DT + 0.5]].map(at), true),
    k.pathOf([[-193, 20, DT + 0.5], [-181, 20, DT + 0.5], [-181, 26, DT + 0.5], [-193, 26, DT + 0.5]].map(at), true),
    k.pathOf([[-170, 25, DT + 0.5], [-153, 25, DT + 0.5], [-153, 32, DT + 0.5], [-170, 32, DT + 0.5]].map(at), true)].join(''), { tone: 'mid' }),
  flatRules(-168, 27, DT + 0.5, [12, 9], 2.4),
].join('');

// The bracket: the base flange, then the upright at the back (drawn after the
// base: its front face stands on the base's top), the hole Ø9 in the upright
// and two fixing holes in the base.
function bracketAt(b, style = {}) {
  const base = box({ x: b.x, y: b.y, w: b.w, d: b.d, r: 0.6 }, b.z, b.z + b.t, { tone: 'hi', crease: 'lo', ...style }, 0.3, 1);
  const up = box({ x: b.x, y: b.y, w: b.w, d: b.t, r: 0.4 }, b.z + b.t, b.z + b.h, { tone: 'hi', crease: 'lo', ...style }, 0.3, 1);
  return base + (b.holes ? [b.x + 25, b.x + b.w - 25].map((x) => bore(x, b.y + 30, 3.3, b.z + b.t, b.t)).join('') : '')
    + up + (b.holes ? holeY(b.x + b.w / 2, b.y + b.t + 0.1, b.z + 35, 4.5) : '');
}
const bracket = halo({ x: BR.x - 2, y: BR.y - 2, w: BR.w + 4, d: BR.d + 4, r: 2 }, DT, 1.5)
  + bracketAt({ ...BR, z: DT, holes: true });

// the crate of rejected brackets on the floor, with its tag
const CRATE = { x: -112, y: 6, w: 52, d: 40, r: 0.8 };
const CH = 26;
const crate = (() => {
  const c = CRATE;
  let out = halo(k.insetPlan(c, -2), 0, 2) + box(c, 0, CH, { tone: 'lo', inner: seam(c, 9, 2) + seam(c, 18, 2) }, 0.4, 2);
  out += L(k.planOutline(k.insetPlan(c, 1.4), CH, P, 2), { tone: 'mid' });
  out += `<path class="tl-cave" d="${k.pathOf(k.roundedPlan(k.insetPlan(c, 1.6), 2).map(([x, y]) => at([x, y, CH])), true)}"/>`;
  // small brackets lying in the crate, back rows first
  for (const [x, y] of [[-106, 10], [-90, 10], [-74, 10], [-106, 24], [-90, 24], [-74, 24]]) out += bracketAt({ x, y, w: 13, d: 9, h: 9, t: 1.2, z: CH - 4 });
  out += `<path class="tl-tag" d="${faceY(c.y + c.d + 0.2, c.x + 34, c.x + 46, 6, 15)}"/>` + rules(c.x + 35.5, c.y + c.d + 0.3, 12.4, [8, 5], 2.2);
  return out;
})();

// ---------------------------------------------------------------- the CMM (as in the measuring film)
const STAND = { x: 150, y: -82, w: 160, d: 152, r: 2 };
const GRAN = { x: 138, y: -96, w: 184, d: 184, r: 2 };
const legBox = (x) => ({ x, y: -76, w: 16, d: 28, r: 1 });
const cmmBack = [
  halo(k.insetPlan(STAND, -6), 0),
  box(STAND, 0, 44, { tone: 'lo', inner: seam(STAND, 36, 4) }, 0.8),
  box(GRAN, 44, GT, { inner: seam(GRAN, 50, 4) }, 1.2),
  screws(GRAN, GT, 6),
  box({ x: 142, y: -94, w: 176, d: 8, r: 0.6 }, GT, 82, { tone: 'lo' }, 0.3),
  box(legBox(146), GT, 252, { crease: 'lo', inner: seam(legBox(146), 92, 2) }),
  box(legBox(298), GT, 252, { crease: 'lo', inner: seam(legBox(298), 92, 2) }),
  box({ x: 140, y: -78, w: 180, d: 32, r: 1.5 }, 252, 274, { inner: seam({ x: 140, y: -78, w: 180, d: 32, r: 1.5 }, 268, 3) }),
  L(k.sideTicks(150, 310, 4, 5, -46, 270, [1.6, 3], P).minor, { tone: 'lo' }),
  L(k.sideTicks(150, 310, 4, 5, -46, 270, [1.6, 3], P).major, { tone: 'mid' }),
  // the fixture's base plate on the granite, with its four screws
  box({ x: 160, y: -56, w: 140, d: 104, r: 1 }, GT, GT + 2, { tone: 'lo' }, 0.3, 1),
  screws({ x: 160, y: -56, w: 140, d: 104 }, GT + 2, 4),
].join('');
// Datum A: three rests under the plate; B: two pins along the long (back)
// edge; C: one pin at the short (left) edge. Each pin touches its edge.
const PIN_R = 3.5;
const restA = [[176, -34], [284, -34], [230, 36]];
const pinB = [[198, PL.y - PIN_R], [262, PL.y - PIN_R]];
const pinC = [[PL.x - PIN_R, 0]];
const rest = (x, y) => post(x, y, PIN_R + 1, GT + 2, GT + 4, { tone: 'lo' }, 14) + post(x, y, PIN_R, GT + 4, PL.z0, { tone: 'hi', crease: 'lo' }, 16);
const pin = (x, y) => post(x, y, PIN_R + 1.2, GT + 2, GT + 5, { tone: 'lo' }, 14) + post(x, y, PIN_R, GT + 5, PL.z1 + 6, { tone: 'hi', crease: 'lo' }, 16)
  + post(x, y, PIN_R - 0.8, PL.z1 + 6, PL.z1 + 7, { tone: 'hi', crease: 'lo' }, 14);
const depth = (x, y) => k.depthOf([x, y, PL.z0], P);
const plateD = depth(PL.x + PL.w / 2, PL.y + PL.d / 2);
const pinsBehind = [...pinB.map((p) => ['datB', p]), ...pinC.map((p) => ['datC', p])].filter(([, p]) => depth(...p) < plateD);
const pinsFront = [...pinB.map((p) => ['datB', p]), ...pinC.map((p) => ['datC', p])].filter(([, p]) => depth(...p) >= plateD);
const pinsSvg = (list) => list.map(([c, p]) => cue(c, pin(...p))).join('');
// the plate with its four holes, drawn at rest and moved as a group
const plate = box({ x: PL.x, y: PL.y, w: PL.w, d: PL.d, r: 0.6 }, PL.z0, PL.z1, { tone: 'hi', crease: 'lo', inner: seam({ x: PL.x, y: PL.y, w: PL.w, d: PL.d }, PL.z1 - 2.5, 2) }, 0.4, 1)
  + cue('holes', HOLES.map(([x, y]) => bore(x, y, C.HR, PL.z1, 10)).join(''))
  + L(k.planOutline(k.insetPlan({ x: PL.x, y: PL.y, w: PL.w, d: PL.d, r: 0.6 }, 1.2), PL.z1, P, 2), { tone: 'faint' });
// the carriage on the beam (moves in x) and the ram with the probe (x, y, z)
const ram = [
  box({ x: CX - 7, y: -7, w: 14, d: 14, r: 0.5 }, 168, 300, { inner: seam({ x: CX - 7, y: -7, w: 14, d: 14, r: 0.5 }, 176, 2) }),
  post(CX, 0, 6.5, 160, 168, { tone: 'lo' }, 20),
  post(CX, 0, 4.5, 142, 160, { crease: 'lo' }, 16),
  post(CX, 0, 1.1, 127, 142, { tone: 'hi' }, 8),
  S(G.sphereOf([CX, 0, BALL], 2.6, P), { tone: 'hi', crease: 'none' }),
].join('');
const carriage = box({ x: CX - 20, y: -48, w: 40, d: 54, r: 1.2 }, 246, 280, { inner: seam({ x: CX - 20, y: -48, w: 40, d: 54, r: 1.2 }, 252, 3) }) + screws({ x: CX - 20, y: -48, w: 40, d: 54 }, 280, 4);
const joystick = box({ x: 282, y: 48, w: 30, d: 22, r: 2 }, GT, 86, { inner: seam({ x: 282, y: 48, w: 30, d: 22, r: 2 }, 80, 2) })
  + post(297, 59, 1.6, 86, 98, { tone: 'hi' }, 10) + S(G.sphereOf([297, 59, 99], 3, P), { tone: 'hi', crease: 'none' });

// ---------------------------------------------------------------- the small isometric view on the sheet
// The same bracket in its own little camera, for the corner of the drawing.
const PM = k.fitProjection([[0, 0, 0], [120, 50, 0], [0, 0, 60], [120, 0, 60], [0, 50, 0], [120, 50, 4]], 92, 66, { pad: 2, azimuth: 52, elevation: 30 });
const isoMini = (() => {
  const S2 = (paths, style) => k.solidSvg(paths, { tone: 'hi', crease: 'lo', ...style });
  const base = S2(k.slabOf({ x: 0, y: 0, w: 120, d: 50, r: 0.5 }, 0, 4, PM, 1, 0));
  const up = S2(k.slabOf({ x: 0, y: 0, w: 120, d: 4, r: 0.4 }, 4, 56, PM, 1, 0));
  const hp = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * 2 * Math.PI; return k.iso([60 + Math.cos(a) * 4.5, 4.1, 35 + Math.sin(a) * 4.5], PM); });
  return base + up + `<path class="dr-hole" d="${k.pathOf(hp, true)}"/>`;
})();

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const HATCH = '<defs><pattern id="dr-h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="dr-hl" d="M0 0L0 5"/></pattern></defs>';
const hud = [
  HATCH,
  g('sheet', [
    g('shBase', ''),
    g('views', [
      cue('views', g('fv', '')),
      cue('proj', g('tv', '')),
      cue('proj', cue('cut', g('lv', ''))),
      cue('cut', g('cutL', '')),
      cue('dim', g('dims', '')),
    ].join('')),
    cue('iso', g('isoM', `<g transform="translate(240 262)">${isoMini}</g>`)),
    cue('scale', g('scl', '')),
    g('ruler', ''),
    cue('stamp', g('tb', '') + cue('sym', g('tbSym', '')) + cue('gen', g('tbGen', ''))),
    cue('rev', g('rt', '')),
    cue('detail', g('det', '')),
    g('note', ''),
  ].join('')),
  g('gd', [
    g('gdBase', ''),
    cue('holes', g('pd', '')),
    cue('size', g('pdSize', '')),
    cue('basic', g('pdBasic', '')),
    cue('frame', g('fr', '')),
    g('frHi', ''),
    g('gps', ''),
    g('dl', cue('datA', g('dlA', '')) + cue('datB', g('dlB', '')) + cue('datC', g('dlC', ''))),
    cue('zone', g('lp', '')),
    cue('sq', g('lpSq', '')),
    cue('pt', g('lpPt', '')),
    cue('mmc', g('lpMmc', '')),
    g('lpTxt', ''),
  ].join('')),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('desk', [
    desk,
    cue('screen', monitor),
    cue('part', bracket),
    cue('sleeve', sleeve),
  ].join('')),
  cue('crate', crate),
  g('cmm', [
    cmmBack,
    cue('datA', restA.map((p) => rest(...p)).join('')),
    cue('fix', pinsSvg(pinsBehind)),
    // the plate lights with datum A: its bottom face is the datum
    g('plate', cue('datA', plate)),
    cue('fix', pinsSvg(pinsFront)),
    g('touch', ''),
    cue('cmm', g('ram', ram) + g('car', carriage)),
    joystick,
  ].join('')),
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
// The desk beside the drawing sheet (stage x 220 on); the CMM beside the GD&T
// panel (stage x 312 on).
const DESKP = [-250, 0, 100];
const CMMP = [230, 0, 150];
const CAM = [
  { from: cam([0, 0, 110], 640), to: cam(DESKP, 470, 112), a: 0.04, b: 0.24 },
  { from: cam(DESKP, 470, 112), to: cam(DESKP, 450, 112) },
  { from: cam(DESKP, 450, 112), to: cam(DESKP, 440, 112) },
  { from: cam(DESKP, 440, 112), to: cam([-170, 10, 60], 470, 112), a: 0.45, b: 0.62 },
  { from: cam([-60, 0, 100], 640), to: cam(CMMP, 420, 156), a: 0.04, b: 0.3 },
  { from: cam([230, 0, 110], 330, 156), to: cam([230, 0, 104], 310, 156) },
  { from: cam(CMMP, 420, 156), to: cam(CMMP, 400, 156) },
  { from: cam([230, 0, 140], 400, 156), to: cam([224, -6, 128], 360, 156), a: 0.05, b: 0.25 },
];

// ---------------------------------------------------------------- the film
const VW = 'eng.drawings.views';
const GD = 'eng.drawings.gdt';
const DUR = [34, 36, 34, 36, 34, 32, 34, 36];
C.dur = DUR;
const spec = {
  id: 'eng.drawings.reading',
  title: { nl: 'Een tekening lezen', en: 'Reading a drawing' },
  lessons: [VW, GD],
  scenes: [
    {
      id: 's1', lesson: VW, level: 1, dur: DUR[0], still: 0.8, title: { nl: 'Aanzichten', en: 'Views' },
      beats: [
        { nl: 'Een onderdeel staat getekend in aanzichten: recht van voren, van boven en van opzij, zonder perspectief.', en: 'A part is drawn in views: straight from the front, the top and the side, without perspective.', cues: ['part', 'views'] },
        { nl: '{t:Europese projectie|Europese projectie}: het bovenaanzicht staat ónder het vooraanzicht.', en: '{t:First-angle projection|First-angle projection}: the top view sits below the front view.', cue: { 'Europese projectie': 'proj' } },
        { nl: 'In de Amerikaanse projectie is het omgekeerd: daar staat het bovenaanzicht erboven.', en: 'Third-angle projection is the other way round: there the top view sits above.', cues: ['proj'] },
        { nl: 'Een klein kegelsymbool zegt welke. Haal je ze door elkaar, dan spiegel je het onderdeel.', en: 'A small cone symbol tells you which. Mix them up and you mirror the part.', cues: ['sym'] },
      ],
    },
    {
      id: 's2', lesson: VW, level: 1, dur: DUR[1], still: 0.5, title: { nl: 'Doorsnede en schaal', en: 'Section and scale' },
      beats: [
        { nl: 'Een {t:Doorsnede|doorsnede}: een denkbeeldige snede langs A-A. Arcering toont het materiaal.', en: 'A {t:Section view|section view}: an imaginary cut along A-A. Hatching shows the material.', cue: { Doorsnede: 'cut' } },
        { nl: 'Het 3D-plaatje in de hoek is alleen voor de oriëntatie. Daar haal je nooit maten uit.', en: 'The 3D picture in the corner is for orientation only. Never take dimensions from it.', cues: ['iso'] },
        { nl: 'De {t:Schaal|schaal}: 1:1 is ware grootte, 1:2 half zo groot, 2:1 dubbel zo groot.', en: '{t:Scale|Scale}: 1:1 is true size, 1:2 half size, 2:1 double size.', cue: { Schaal: 'scale' } },
        { nl: 'Meet nooit op een print: papier rekt. Lees de maat die erbij staat.', en: 'Never measure off a print: paper stretches. Read the dimension written on it.', cues: ['dim'], read: { nl: '1:5 · {n:40} mm → {n:200} mm', en: '1:5 · {n:40} mm → {n:200} mm' } },
      ],
    },
    {
      id: 's3', lesson: VW, level: 1, dur: DUR[2], still: 0.5, title: { nl: 'Het stempel', en: 'The title block' },
      beats: [
        { nl: 'Begin bij het {t:Stempel|stempel} rechtsonder: nummer, benaming, materiaal, schaal en revisie.', en: 'Start at the {t:Title block|title block}, bottom right: number, name, material, scale and revision.', cue: { Stempel: 'stamp' } },
        { nl: 'Tekening 4711-203: een beugel van staal S235, schaal 1:1, revisie C.', en: 'Drawing 4711-203: a bracket in S235 steel, scale 1:1, revision C.', cues: ['stamp'] },
        { nl: 'De {t:Algemene tolerantie|algemene tolerantie} geldt voor elke maat zonder eigen tolerantie. Hier ISO 2768-m.', en: 'The {t:General tolerance|general tolerance} covers every dimension without its own. Here ISO 2768-m.', cue: { 'Algemene tolerantie': 'gen' } },
        { nl: 'Volgens ISO 2768-m mag een maat van {n:50} mm tussen {n:49.7} en {n:50.3} mm liggen.', en: 'Under ISO 2768-m, a {n:50} mm dimension may be {n:49.7} to {n:50.3} mm.', cues: ['gen', 'dim'] },
      ],
    },
    {
      id: 's4', lesson: VW, level: 1, dur: DUR[3], still: 0.5, title: { nl: 'Welke revisie?', en: 'Which revision?' },
      beats: [
        { nl: 'Elke {t:Revisie|revisie} krijgt een nieuwe letter en een regel in de revisietabel.', en: 'Each {t:Revision|revision} gets a new letter and a line in the revision table.', cue: { Revisie: 'rev' } },
        { nl: 'Rev B: gat Ø{n:8.5} werd Ø{n:9}. Rev C: buigradius R{n:2} werd R{n:3}.', en: 'Rev B: hole Ø{n:8.5} became Ø{n:9}. Rev C: bend radius R{n:2} became R{n:3}.', cues: ['rev', 'detail'] },
        { nl: 'Bij de kantbank lag een geprinte rev B. Resultaat: {n:400} beugels met R2, afgekeurd.', en: 'At the press brake lay a printed rev B. Result: {n:400} brackets with R2, rejected.', cues: ['sleeve', 'crate'] },
        { nl: 'De oplossing: tekeningen op een scherm, uit het PDM-systeem. Alleen de actuele revisie bestaat.', en: 'The fix: drawings on a screen, from the PDM system. Only the current revision exists.', cues: ['screen'] },
      ],
    },
    {
      id: 's5', lesson: GD, level: 2, dur: DUR[4], still: 0.6, title: { nl: 'Wat ± niet zegt', en: 'What ± does not say' },
      beats: [
        { nl: 'Een ±-tolerantie regelt de maat. Niet de vorm, en niet waar het gat ten opzichte van de rest zit.', en: 'A ± tolerance controls size. Not form, and not where the hole sits relative to the rest.', cues: ['size'] },
        { nl: 'Dat doen vorm- en plaatstoleranties (GD&T), in een {t:Tolerantiekader|tolerantiekader} met referenties.', en: 'GD&T does that, in a {t:Feature control frame|feature control frame}: symbol, tolerance and datums.', cue: { Tolerantiekader: 'frame' } },
        { nl: 'Dit kader: positie, binnen Ø{n:0.3}, met Ⓜ, gemeten vanaf A, dan B, dan C.', en: 'This frame: position, within Ø{n:0.3}, with Ⓜ, measured from A, then B, then C.', cues: ['frame'] },
        { nl: 'ISO GPS in Europa, ASME Y14.5 in de VS. Vraag eerst: naar welke norm verwijst de tekening?', en: 'ISO GPS in Europe, ASME Y14.5 in the US. Ask first: which standard does the drawing invoke?', cues: [] },
      ],
    },
    {
      id: 's6', lesson: GD, level: 2, dur: DUR[5], still: 0.85, title: { nl: 'Referentievlakken', en: 'Datums' },
      beats: [
        { nl: 'Een {t:Referentievlak|referentievlak} is een vlak waar je vanaf meet, met een letter in een driehoekje.', en: 'A {t:Datum|datum} is a surface you measure from, marked with a letter and a triangle.', cue: { Referentievlak: 'fix' } },
        { nl: 'Primair A: de plaat ligt erop, op drie punten. Hier het ondervlak.', en: 'Primary A: the plate rests on it, on three points. Here the bottom face.', cues: ['datA'] },
        { nl: 'Secundair B: de lange zijkant, tegen twee punten. Tertiair C: de korte zijkant, één punt.', en: 'Secondary B: the long edge, against two points. Tertiary C: the short edge, one point.', cues: ['datB', 'datC'] },
        { nl: 'De volgorde telt: zo ligt het deel in de opspanning, en zo lijnt de meetmachine het uit.', en: 'The order matters: that is how the part sits in the fixture, and how the CMM aligns it.', cues: ['fix', 'datA'] },
      ],
    },
    {
      id: 's7', lesson: GD, level: 2, dur: DUR[6], still: 0.6, title: { nl: 'Positie', en: 'Position' },
      beats: [
        { nl: 'Vier gaten Ø{n:10.2} +{n:0.1}/0 voor M10-bouten. Waar moeten ze zitten?', en: 'Four holes Ø{n:10.2} +{n:0.1}/0 for M10 bolts. Where must they sit?', cues: ['holes'] },
        { nl: 'Een {t:Theoretisch exacte maat|theoretisch exacte maat} staat in een kadertje: {n:25} van B, {n:40} van C, zonder ±.', en: 'A {t:Basic dimension|basic dimension} sits in a box: {n:25} from B, {n:40} from C, with no ±.', cue: { 'Theoretisch exacte maat': 'basic' } },
        { nl: 'De {t:Positietolerantie|positietolerantie}: het hart ligt in een ronde zone van Ø{n:0.3} rond die plek.', en: 'The {t:Position tolerance|position tolerance}: the centre lies in a round zone of Ø{n:0.3} around that spot.', cue: { Positietolerantie: 'zone' } },
        { nl: 'Rond, niet vierkant: Ø{n:0.28} om een vierkant van ±0,1 heeft {n:57}% meer oppervlak.', en: 'Round, not square: Ø{n:0.28} around a ±0.1 square has {n:57}% more area.', cues: ['sq'] },
      ],
    },
    {
      id: 's8', lesson: GD, level: 2, dur: DUR[7], still: 0.6, title: { nl: 'Op de meetmachine', en: 'On the CMM' },
      beats: [
        { nl: 'Een {t:CMM|CMM}, een 3D-meetmachine, tast het gat af en rekent het hart uit vanaf A, B en C.', en: 'A {t:CMM|CMM}, a coordinate measuring machine, probes the hole and computes its centre from A, B and C.', cue: { CMM: 'cmm' } },
        { nl: 'Het hart zit {n:0.12} naast in X en {n:0.09} in Y: afstand {n:0.15}, als diameter {n:0.30}. Op de grens.', en: 'The centre is {n:0.12} off in X and {n:0.09} in Y: {n:0.15} away, as a diameter {n:0.30}. On the limit.', cues: ['pt', 'zone'] },
        { nl: 'Ⓜ betekent {t:MMC|MMC}: de maat met het meeste materiaal, hier het kleinste gat.', en: 'Ⓜ means {t:MMC|MMC}: the size with the most material, here the smallest hole.', cue: { MMC: 'mmc' } },
        { nl: 'Het gat meet Ø{n:10.25}: {n:0.05} bonus, dus Ø{n:0.35} toegestaan. Het deel is goed.', en: 'The hole measures Ø{n:10.25}: {n:0.05} bonus, so Ø{n:0.35} allowed. The part is good.', cues: ['mmc', 'pt'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "±" or "Ø" in the spoken text:
// tolerances as the floor says them ("nul tot plus een tiende"), a zone as
// "doorsnee", "Ⓜ" as "de omcirkelde M", scales as "één op twee". The drawing
// number is shown, not spoken (espeak-ng reads it as thousands). "ISO 2768"
// is spoken through SAY in films/_kit/timeline.mjs, as in the tolerances film
// ("ISO 2768, klasse m", "algemene tolerantie", "stempel"); CMM, 3D-meetmachine,
// taster and referentievlakken as in the measuring film. Checked with
// espeak-ng phonemes (Piper's bridge): no English loanword left in the Dutch
// narration, so no new SAY rule.
const SAY = [
  [ // s1 views
    { nl: 'Een tekening toont een onderdeel in aanzichten: recht van voren, van boven en van opzij, zonder perspectief. Hier een gebogen beugel.',
      en: 'A drawing shows a part in views: straight from the front, the top and the side, without perspective. Here, a bent bracket.' },
    { nl: 'Europa gebruikt de {t:Europese projectie|Europese projectie}: wat je van boven ziet, komt ónder het vooraanzicht, wat je van links ziet, rechts.',
      en: 'Europe uses {t:First-angle projection|first-angle projection}: what you see from the top goes below the front view, what you see from the left goes on the right.' },
    { nl: 'De Verenigde Staten gebruiken de Amerikaanse projectie: het bovenaanzicht staat erboven, en rechts staat wat je van rechts ziet.',
      en: 'The United States uses third-angle projection: the top view sits above, and on the right goes what you see from the right.' },
    { nl: 'Een klein kegelsymbool in het stempel zegt welke. Verwar je ze, dan maak je het onderdeel in spiegelbeeld.',
      en: 'A small cone symbol in the title block tells you which. Mix them up and you make the part as a mirror image.' },
  ],
  [ // s2 section and scale
    { nl: 'Een {t:Doorsnede|doorsnede} toont de binnenkant: je snijdt het onderdeel in gedachten door langs de lijn A-A. Arcering, dunne schuine lijntjes, markeert het doorgesneden materiaal.',
      en: 'A {t:Section view|section view} shows the inside: you cut the part in your mind along the line A-A. Hatching, thin diagonal lines, marks the material that was cut.' },
    { nl: 'Het 3D-plaatje in de hoek is alleen voor de oriëntatie: maten haal je er nooit uit.',
      en: 'The 3D picture in the corner is for orientation only: you never take dimensions from it.' },
    { nl: 'De {t:Schaal|schaal} zegt hoe groot er getekend is: één op één is ware grootte, één op twee half zo groot, twee op één dubbel.',
      en: 'The {t:Scale|scale} says how big it is drawn: one to one is true size, one to two half size, two to one double.' },
    { nl: 'Meet nooit op een print: papier rekt. Bij schaal één op vijf is {n:40} millimeter op papier in het echt {n:200}, maar lees gewoon de maat die erbij staat.',
      en: 'Never measure off a print: paper stretches. At a scale of one to five, {n:40} millimetres on paper is {n:200} in real life, but just read the dimension written beside it.' },
  ],
  [ // s3 title block
    { nl: 'Je begint bij het {t:Stempel|stempel}, rechtsonder: tekeningnummer, benaming, materiaal, schaal, projectiesymbool, wie tekende en vrijgaf, en de revisieletter.',
      en: 'You start at the {t:Title block|title block}, the box at the bottom right: part number, name, material, scale, projection symbol, who drew and approved it, and the revision letter.' },
    { nl: 'Dit is een beugel van S235, een gangbaar constructiestaal, op schaal één op één, revisie C.',
      en: 'This is a bracket in S235, a common structural steel, at one to one, revision C.' },
    { nl: 'Ook de {t:Algemene tolerantie|algemene tolerantie} staat hier: die geldt voor elke maat zonder eigen tolerantie. Hier ISO 2768, klasse m.',
      en: 'The {t:General tolerance|general tolerance} is here too: it covers every dimension without its own tolerance. Here ISO 2768, class m.' },
    { nl: 'Een maat van {n:50} millimeter, zoals de diepte van deze beugel, mag dan tussen {n:49.7} en {n:50.3} liggen. Moet het nauwer, dan krijgt de maat een eigen tolerantie.',
      en: 'A dimension of {n:50} millimetres, like the depth of this bracket, may then be {n:49.7} to {n:50.3}. If it must be tighter, the dimension gets a tolerance of its own.' },
  ],
  [ // s4 which revision
    { nl: 'Elke wijziging krijgt een nieuwe {t:Revisie|revisie}, met een nieuwe letter. De revisietabel zegt wat er veranderde en wanneer.',
      en: 'Every change gets a new {t:Revision|revision}, with a new letter. The revision table says what changed and when.' },
    { nl: 'Revisie B maakte het gat {n:9} millimeter in plaats van {n:8.5}. Revisie C, in januari 2025, maakte de buigradius {n:3} in plaats van {n:2}.',
      en: 'Revision B made the hole {n:9} millimetres instead of {n:8.5}. Revision C, in January 2025, made the bend radius {n:3} instead of {n:2}.' },
    { nl: 'Maar bij de kantbank werkte de insteller met een geprinte revisie B in een plastic hoesje: {n:400} beugels met de oude radius, afgekeurd bij de klant.',
      en: 'But at the press brake the setter worked from a printed revision B in a plastic sleeve: {n:400} brackets with the old radius, rejected at the customer.' },
    { nl: 'De oplossing is niet beter opletten, maar een scherm bij de machine, rechtstreeks uit het PDM-systeem. Dan bestaat op de vloer alleen de actuele revisie.',
      en: 'The fix is not being more careful, but a screen at the machine, straight from the PDM system. Then only the current revision exists on the floor.' },
  ],
  [ // s5 what ± does not say
    { nl: 'Een plus-min-tolerantie regelt alleen de maat: dit gat van {n:10.2}, nul tot plus een tiende. Waar het zit en welke vorm het heeft, zegt plus-min niet.',
      en: 'A plus-or-minus tolerance controls only size: this {n:10.2} hole, zero to plus one tenth. Where it sits and what form it has, plus or minus does not say.' },
    { nl: 'Daarvoor zijn vorm- en plaatstoleranties, in een {t:Tolerantiekader|tolerantiekader}: een rijtje vakjes met een symbool, een tolerantie en de referenties.',
      en: 'That is what geometric tolerances are for, in a {t:Feature control frame|feature control frame}: a row of boxes with a symbol, a tolerance and the datums.' },
    { nl: 'Lees het van links naar rechts: positie, binnen een ronde zone van {n:0.3} doorsnee, de omcirkelde M, en de referenties A, B en C.',
      en: 'Read it from left to right: position, within a round zone {n:0.3} across, the circled M, and the datums A, B and C.' },
    { nl: 'Europa en de Verenigde Staten lezen sommige tekeningen verschillend: vraag eerst naar welke norm de tekening verwijst.',
      en: 'Europe and the United States read some drawings differently: ask first which standard the drawing invokes.' },
  ],
  [ // s6 datums
    { nl: 'Je meet vanaf een {t:Referentievlak|referentievlak}: het vlak waarop het onderdeel gepositioneerd wordt, getekend als driehoekje met een letter. Denk aan de hoek van een kamer.',
      en: 'You measure from a {t:Datum|datum}: the surface the part is located on, drawn as a small triangle with a letter. Think of the corner of a room.' },
    { nl: 'Primair is A, hier het ondervlak. De plaat ligt op drie steunpunten, want drie punten bepalen een vlak.',
      en: 'Primary is A, here the bottom face. The plate rests on three points, because three points define a plane.' },
    { nl: 'Secundair is B, de lange zijkant, tegen twee pennen. Tertiair is C, de korte zijkant, tegen één pen.',
      en: 'Secondary is B, the long edge, against two pins. Tertiary is C, the short edge, against one pin.' },
    { nl: 'De volgorde telt: zo ligt het deel in de opspanning, en zo lijnt de meetmachine het uit. Meet je vanaf een andere kant, dan krijg je een ander getal.',
      en: 'The order matters: that is how the part sits in the fixture, and how the measuring machine aligns it. Measure from another edge and you get another number.' },
  ],
  [ // s7 position
    { nl: 'De plaat heeft vier gaten van {n:10.2} millimeter voor M10-bouten. Waar moeten ze zitten?',
      en: 'The plate has four holes of {n:10.2} millimetres for M10 bolts. Where must they sit?' },
    { nl: 'Dat zegt een {t:Theoretisch exacte maat|theoretisch exacte maat}, in een kadertje zonder plus-min: dit gat zit precies {n:25} van B en {n:40} van C.',
      en: 'A {t:Basic dimension|basic dimension} says that, in a box without plus or minus: this hole sits exactly {n:25} from B and {n:40} from C.' },
    { nl: 'De tolerantie staat in het kader: de {t:Positietolerantie|positietolerantie}. Het hart van het gat moet binnen een ronde zone van {n:0.3} doorsnee rond die plek liggen.',
      en: 'The tolerance is in the frame: the {t:Position tolerance|position tolerance}. The centre of the hole must lie within a round zone {n:0.3} across, around that spot.' },
    { nl: 'Waarom rond? Een bout kan alle kanten op evenveel schuiven. Een cirkel van {n:0.28} om een vierkant van plus-min een tiende heeft {n:57} procent meer oppervlak: meer goede delen worden goedgekeurd.',
      en: 'Why round? A bolt can shift the same amount every way. A circle of {n:0.28} around a square of plus or minus one tenth has {n:57} percent more area: more good parts get accepted.' },
  ],
  [ // s8 on the CMM
    { nl: 'Positie meet je niet met een schuifmaat. Een {t:CMM|CMM}, een 3D-meetmachine, lijnt uit op A, B en C, tast het gat af met een taster en berekent het hart.',
      en: 'You do not check position with a caliper. A {t:CMM|CMM}, a coordinate measuring machine, aligns on A, B and C, probes the hole and computes the centre.' },
    { nl: 'Het hart zit {n:0.12} naast in X en {n:0.09} in Y: samen {n:0.15} millimeter. Als diameter is dat {n:0.30}, precies op de grens.',
      en: 'The centre is {n:0.12} off in X and {n:0.09} in Y: {n:0.15} millimetres together. As a diameter that is {n:0.30}, right on the limit.' },
    { nl: 'Maar de omcirkelde M betekent {t:MMC|MMC}, de maximum-materiaalvoorwaarde: de maat met het meeste materiaal, bij een gat het kleinste gat.',
      en: 'But the circled M means {t:MMC|MMC}, maximum material condition: the size with the most material, for a hole the smallest hole.' },
    { nl: 'Dit gat meet {n:10.25}: {n:0.05} groter, en dat krijgt het als bonus. De zone groeit naar {n:0.35}, en het deel is goed.',
      en: 'This hole measures {n:10.25}: {n:0.05} bigger, and it gets that as a bonus. The zone grows to {n:0.35}, and the part is good.' },
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
// the spoken text never carries a sign the voice would read aloud
for (const sc of SAY) for (const b of sc) for (const lang of ['nl', 'en']) if (/[/&±Ø]/.test(b[lang].replace(/\{[tn]:[^}]*\}/g, ''))) throw new Error(`narration: a sign in "${b[lang].slice(0, 50)}"`);

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
.tl-paper{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1}
.tl-sheetbg{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:1.2}
.tl-tag{fill:var(--fp-accent);stroke:none}
.tl-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.tl-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.tl-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.tl-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:500}
.tl-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.tl-ink{fill:none;stroke:var(--anatomy-strong);stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round}
.tl-thin{fill:none;stroke:var(--anatomy-mid);stroke-width:1}
.tl-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.tl-chain{fill:none;stroke:var(--anatomy-mid);stroke-width:1.1;stroke-dasharray:9 3 2 3}
.tl-hid{fill:none;stroke:var(--anatomy-mid);stroke-width:1.1;stroke-dasharray:4 3}
.tl-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-strong);stroke-width:1.4}
.tl-fill{fill:var(--anatomy-shade-2);stroke:var(--anatomy-strong);stroke-width:1.6;stroke-linejoin:round}
.tl-hatch{fill:url(#dr-h);stroke:var(--anatomy-strong);stroke-width:1.6;stroke-linejoin:round}
.dr-hl{stroke:var(--anatomy-mid);stroke-width:1}
.tl-band{fill:color-mix(in srgb,var(--anatomy-mid) 18%,transparent);stroke:none}
.tl-acc{fill:var(--fp-accent);stroke:none}
.tl-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.tl-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.dr-hole{fill:var(--anatomy-shade-0);stroke:none}
.dr-wall{fill:none;stroke:var(--anatomy-shade-3);stroke-width:1.4}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .tl-ink,[data-cue][data-on] .tl-fill,[data-cue][data-on] .tl-hatch,[data-cue][data-on] .tl-hole{stroke:var(--fp-accent)}
[data-cue][data-on] .tl-thin,[data-cue][data-on] .tl-chain{stroke:var(--fp-accent)}
[data-cue][data-on] .tl-big,[data-cue][data-on] .tl-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .tl-paper{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .dr-hl{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Twee plekken naast elkaar. Een tekentafel met een gebogen beugel van plaatstaal, een scherm op een voet dat de vrijgegeven tekening uit het PDM-systeem toont, een oude print in een plastic hoesje en op de vloer een krat afgekeurde beugels met een label. Een 3D-meetmachine met een granieten plaat, twee poten, een brug met een slede en een pinole met een taster; op het graniet een opspanning met drie steunpunten (referentie A), twee pennen langs de lange zijkant (B) en één pen aan de korte zijkant (C), met daarin een plaat met vier gaten. Een tekening van de beugel, gemarkeerd als voorbeeld, met vooraanzicht, bovenaanzicht, zijaanzicht en doorsnede A-A, een isometrisch aanzicht, de schaal, het stempel, de revisietabel en een detail van de buigradius. Een tekening van de plaat met maat, theoretisch exacte maten en een tolerantiekader, en een vergroting van de positiezone met het gemeten hart.',
  en: 'Two places side by side. A drawing desk with a bent sheet-steel bracket, a screen on a stand showing the released drawing from the PDM system, an old print in a plastic sleeve and, on the floor, a tagged crate of rejected brackets. A coordinate measuring machine with a granite plate, two legs, a bridge with a carriage and a ram with a probe; on the granite a fixture with three rests (datum A), two pins along the long edge (B) and one pin at the short edge (C), holding a plate with four holes. A drawing of the bracket, marked as an example, with front, top and side views and section A-A, an isometric view, the scale, the title block, the revision table and a detail of the bend radius. A drawing of the plate with its size, basic dimensions and a feature control frame, and an enlarged view of the position zone with the measured centre.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

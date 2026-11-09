// Dev tool, not shipped. Builds the explainer film "Een puntlas in 300 ms / A
// spot weld in 300 ms" for the topic Puntlassen of Lassen en verbinden (spot
// L1, spotwear L2, spotquality L3, spotlobe L4).
//
//   node films/eng.joining.spot/build.mjs            build the page
//   node films/eng.joining.spot/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.spot.html: one offline page with
// the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.2. The
// figure eng.joining.spot (figures/eng.joining.spot/build.mjs) is the visual
// starting point: the same C-gun with a servo cylinder over a lower arm, the
// same model numbers; here the gun hangs from a robot and walks a lap joint.
//
// One film for all four levels (Merijn, 2026-11-07: always the full film): it
// opens with the Basis "how it works" tour and the level-1 scenes, then goes
// deeper for levels 2–4.
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
// value drifts). The {n:...} numbers of captions and narration are then checked
// against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const areaOf = (dia) => (Math.PI / 4) * dia * dia;
// spot: 9,5 kA on a Ø6 tip face; after 500 welds with a jammed dresser Ø7,5
const A6 = areaOf(6);
const A75 = areaOf(7.5);
assert(near(A6, 28.3, 0.05) && near(A75, 44.2, 0.05), 'tip face areas 28,3 and 44,2 mm²');
assert(near(9500 / A6, 336, 0.5), 'J = 336 A/mm²');
assert(near(9500 / A75, 215, 0.5), 'J = 215 A/mm² after 500 welds');
assert(near(1 - 215 / 336, 0.36, 0.005), '36 % less');
assert(near(4 * Math.sqrt(1.2), 4.4, 0.05) && 3.8 < 4 * Math.sqrt(1.2), 'a 3,8 mm nugget is under 4√1,2 = 4,4');
assert(near(1.1 ** 2, 1.21, 1e-9), '10 % more current, 21 % more heat');
// 1 kN is roughly the weight of 100 kg: 2–4 kN ≈ 200–400 kg
assert(near(2000 / 9.81, 200, 5) && near(4000 / 9.81, 400, 10), '2–4 kN as 200–400 kg');
// spotwear: 9,0 kA at Ø6,0 = 318 A/mm²; after 250 welds Ø6,5 needs 10,6 kA (+17 %)
assert(near(9000 / A6, 318, 0.5), 'J = 318 A/mm²');
assert(near(9 * (6.5 / 6) ** 2, 10.6, 0.05) && near((6.5 / 6) ** 2 - 1, 0.17, 0.005), 'stepper 10,6 kA, 17 % more');
assert(near(20 * 200, 4000, 0), '20 dressings of 200 welds: 4.000 welds a cap');
// spotquality: 4√1,5 = 4,9 mm; a button of 5,6 and 5,2 averages 5,4
assert(near(4 * Math.sqrt(1.5), 4.9, 0.01), '4√1,5 = 4,9');
assert(near((5.6 + 5.2) / 2, 5.4, 1e-9) && (5.6 + 5.2) / 2 > 4.9, 'button 5,4 passes');
// spotlobe: galvanised DP600 7,6–9,0 kA; bare 6,9–9,1; set at 8,7
const LOBE = { galv: [7.6, 9.0], bare: [6.9, 9.1], set: 8.7 };
assert(near(LOBE.galv[1] - LOBE.galv[0], 1.4, 1e-9) && near(LOBE.bare[1] - LOBE.bare[0], 2.2, 1e-9), 'lobes 1,4 and 2,2 kA');
assert(near((2.2 - 1.4) / 2.2, 0.36, 0.005), 'the zinc lobe is 36 % narrower');
assert(near(LOBE.galv[1] - LOBE.set, 0.3, 1e-9) && near(LOBE.set - LOBE.galv[0], 1.1, 1e-9), '8,7: 0,3 under expulsion, 1,1 above the minimum');
// the nugget in the loupe (same calibration as the figure): d = √(0,1307 (J − 104,5))
const nugOf = (j) => Math.sqrt(Math.max(0, 0.1307 * (j - 104.5)));
assert(near(nugOf(9500 / A6), 5.5, 0.02) && near(nugOf(9500 / A75), 3.8, 0.05), 'nugget 5,5 → 3,8 mm');

// ---------------------------------------------------------------- the world
// Drawn units, about a millimetre but the sheets drawn thick enough to see.
// x along the joint, y toward the viewer, z up. Two sheets overlap in a lap
// joint along y = 0; the gun's tips meet at (gx, 0) on the joint. The gun hangs
// from a robot wrist behind it (−y) and moves along x from weld to weld; the
// tip dresser stands past the end of the sheets.
const W = 640;
const H = 400;
const T = 4; // sheet thickness (drawn)
const SB = 70; // bottom of the stack = the lower tip face
const ST = SB + 2 * T; // top of the stack = the upper tip face, closed
const STROKE = 22;
const DRESS_X = 200;
const WELDS = [-110, -80, -50, -20, 10, 40, 70, 100];
const DUR = [32, 18, 22, 18, 26, 36, 30, 30];
const C = {
  W, H, T, SB, ST, STROKE, DRESS_X, WELDS, dur: DUR, LOBE,
  A6, A75, NUG: [nugOf(9500 / A6), nugOf(9500 / A75)],
};

const FIT = [
  ...k.boxCorners({ x: -185, y: -150, w: 420, d: 225 }, -18, 0),
  [-30, -200, 230], [0, 0, 220], [DRESS_X, 0, 220],
];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 56, elevation: 28 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0, ...plan }, z0, z1 - z0, P, plan.r ? 3 : 2, plan.w > 40 ? bevel : 0), style);
const cyl = (cx, cy, r, z0, z1, style = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, r > 8 ? 28 : 16, 0), style);
const LO = { steps: 20 };
const solidOf = (pr, F, o = {}) => G.solidOf(pr, F, P, { ...LO, ...o });
const discOf = (a, b, r, F, o = {}) => G.disc(a, b, r, F, P, { ...LO, ...o });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const up = (o) => G.frameOf(o, Z, X, Y);
const down = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const onX = (x, pts) => k.pathOf(pts.map(([y, z]) => at([x, y, z])), true);
const onY = (y, pts) => k.pathOf(pts.map(([x, z]) => at([x, y, z])), true);

// ---------------------------------------------------------------- the table and the fixture
const TB = { x: -185, y: -150, w: 420, d: 225, r: 3 };
const table = (() => {
  const holes = [];
  for (let x = -170; x <= 220; x += 30) for (let y = -135; y <= 60; y += 30) holes.push(at([x, y, 0]));
  const feet = [[-170, -135], [220, -135], [-170, 60], [220, 60]].map(([x, y]) => cyl(x, y, 6, -30, -18, { tone: 'lo' })).join('');
  return [
    feet,
    box({ x: TB.x + 12, y: TB.y + 12, w: TB.w - 24, d: TB.d - 24, r: 2 }, -30, -16, { tone: 'lo' }),
    box(TB, -16, 0, {}, 0.8),
    L(k.sideSeam(TB, -5, P, 4), { tone: 'faint' }),
    k.dotsSvg(holes, { size: 1.1, tone: 'lo' }),
  ].join('');
})();
// two locating blocks carry the sheets at the ends; a toggle clamp holds each sheet
function support(x) {
  return [
    box({ x: x - 12, y: -58, w: 24, d: 116, r: 1.5 }, 0, 6, { tone: 'lo' }, 0.4),
    box({ x: x - 8, y: -50, w: 16, d: 100, r: 1 }, 6, SB, {}, 0.4),
    k.dotsSvg([at([x - 8, -46, 6]), at([x + 8, 46, 6]), at([x - 8, 46, 6])], { size: 0.55 }),
    L(k.sideSeam({ x: x - 8, y: -50, w: 16, d: 100, r: 1 }, SB - 8, P, 2), { tone: 'faint' }),
  ].join('');
}
function clampOn(x, y, z) {
  return [
    box({ x: x - 5, y: y - 5, w: 10, d: 10, r: 1 }, z, z + 4, { tone: 'lo' }, 0.3),
    cyl(x, y, 2.4, z + 4, z + 16, { tone: 'mid' }),
    box({ x: x - 3, y: y - 3, w: 26, d: 6, r: 1 }, z + 16, z + 20, { tone: 'hi', crease: 'lo' }, 0.3),
    S(discOf(0, 3, 3.4, up([x + 22, y, z + 20])), { tone: 'hi', crease: 'lo' }),
  ].join('');
}
// the two sheets: A underneath (toward the robot), B on top (toward the viewer)
const SHA = { x: -165, y: -64, w: 330, d: 74 };
const SHB = { x: -165, y: -10, w: 330, d: 74 };
const sheets = {
  a: S(k.slabOf({ ...SHA, r: 0 }, SB, T, P, 2, 0), { tone: 'mid', crease: 'lo' }),
  b: S(k.slabOf({ ...SHB, r: 0 }, SB + T, T, P, 2, 0), { tone: 'hi', crease: 'lo' })
    + L(k.pathOf([at([SHB.x, -10, SB + T]), at([SHB.x + SHB.w, -10, SB + T])]), { tone: 'mid' }),
};

// ---------------------------------------------------------------- the gun (local: the tips meet at x = 0, y = 0)
// Built at x = 0 and moved along x as one group. The lower electrode is fixed
// to the lower arm; the upper one rides the servo ram (its own group).
const CAPR = 7.5; // cap body radius
const TIPR = 3.5; // tip face radius (drawn)
const gunBack = (() => {
  // robot forearm and wrist behind the transformer
  const arm = G.frameAlong([0, -196, 96], [0, -0.55, 1]);
  const forearm = S(solidOf([[0, 15], [8, 17], [96, 17], [104, 14]], arm), { tone: 'lo', crease: 'lo', inner: L(G.arcOf(arm, 60, 17, P), { tone: 'faint' }) });
  const wrist = S(discOf(-6, 0, 22, G.frameOf([0, -190, 96], [0, -1, 0], X, Z)), { tone: 'mid', crease: 'lo' })
    + k.dotsSvg([0, 1, 2, 3, 4, 5].map((i) => at(G.pointOf(G.frameOf([0, -190, 96], [0, -1, 0], X, Z), 0, 17, (i / 6) * Math.PI * 2))), { size: 0.5 });
  // the transformer (medium-frequency, water-cooled), bolted to the column
  const TR = { x: -22, y: -186, w: 44, d: 54, r: 2 };
  const trBody = box(TR, 40, 142, {}, 0.8);
  const vents = [62, 70, 78, 86, 94, 102].map((z) => k.pathOf([at([TR.x + TR.w, TR.y + 8, z]), at([TR.x + TR.w, TR.y + 28, z])])).join('');
  const plate = `<path class="fp-panel" d="${onX(TR.x + TR.w + 0.1, [[TR.y + 7, 112], [TR.y + 29, 112], [TR.y + 29, 132], [TR.y + 7, 132]])}"/>`;
  const plateRules = [118, 122, 126].map((z) => k.pathOf([at([TR.x + TR.w + 0.2, TR.y + 10, z]), at([TR.x + TR.w + 0.2, TR.y + 26, z])])).join('');
  const screws = [[TR.y + 4, 46], [TR.y + 50, 46], [TR.y + 4, 136], [TR.y + 50, 136]].map(([y, z]) => at([TR.x + TR.w, y, z]));
  // water manifold on the transformer's side: four nipples for the hoses
  const mani = box({ x: 22, y: -150, w: 6, d: 10, r: 1 }, 52, 132, { tone: 'lo', crease: 'lo' }, 0.3);
  const nip = [[-145, 58], [-145, 66], [-145, 118], [-145, 126]].map(([y, z]) => S(discOf(0, 4, 2.2, G.frameOf([28, y, z], X, Y, Z)), { tone: 'hi', crease: 'lo' })).join('');
  // the C-frame: column, lower arm (to the fixed electrode)
  const COL = { x: -12, y: -132, w: 24, d: 20, r: 2 };
  const col = box(COL, 6, 172, {}, 0.6) + L(k.sideSeam(COL, 88, P, 3), { tone: 'faint' });
  const LA = { x: -10, y: -124, w: 20, d: 134, r: 3 };
  const lowArm = box(LA, 12, 30, {}, 0.6)
    + k.dotsSvg([[-112, 21], [-96, 21]].map(([y, z]) => at([10, y, z])), { size: 0.55 });
  return { forearm, wrist, trBody, vents, plate, plateRules, screws, mani, nip, col, lowArm, TR };
})();
// the lower electrode: holder block, shank, cap (tip up at z = SB)
const lowerEl = [
  box({ x: -10, y: -10, w: 20, d: 20, r: 2 }, 30, 42, {}, 0.4),
  S(discOf(0, 3, 9, up([0, 0, 42])), { tone: 'mid', crease: 'lo' }),
  cyl(0, 0, 6, 45, SB - 10, { tone: 'mid' }),
  `<g data-cue="caps">${S(solidOf([[0, CAPR], [4, CAPR], [9.4, TIPR + 0.6], [10, TIPR]], up([0, 0, SB - 10])), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(up([0, 0, SB - 10]), 4, CAPR, P), { tone: 'faint' }) })}</g>`,
].join('');
// the upper electrode, closed (tip at z = ST): ram, holder, shank, cap
const RAM_TOP = 150;
const upperEl = [
  cyl(0, 0, 5, ST + 48, RAM_TOP, { tone: 'hi' }),
  box({ x: -10, y: -10, w: 20, d: 20, r: 2 }, ST + 38, ST + 50, {}, 0.4),
  cyl(0, 0, 6, ST + 10, ST + 38, { tone: 'mid' }),
  S(discOf(0, 3, 9, down([0, 0, ST + 38])), { tone: 'mid', crease: 'lo' }),
].join('');
const upperCap = S(solidOf([[0, TIPR], [0.6, TIPR + 0.6], [6, CAPR], [10, CAPR]], up([0, 0, ST])), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(up([0, 0, ST]), 6, CAPR, P), { tone: 'faint' }) });
// the upper arm, the ram's gland and the servo cylinder with its motor
const gunTop = (() => {
  const UA = { x: -10, y: -124, w: 20, d: 134, r: 3 };
  const arm = box(UA, 140, 158, {}, 0.6) + k.dotsSvg([[-112, 149], [-96, 149]].map(([y, z]) => at([10, y, z])), { size: 0.55 });
  const gland = S(solidOf([[0, 9], [10, 9], [12, 10]], down([0, 0, 140])), { tone: 'mid', crease: 'lo' });
  const cylBody = S(solidOf([[0, 14], [3, 14], [4, 13], [36, 13], [37, 14], [40, 14]], up([0, 0, 158])), { tone: 'mid', crease: 'lo', inner: L(G.ribsOf(up([0, 0, 158]), 8, 33, 13, 10, P, { least: 0.15 }), { tone: 'lo' }) });
  const MOT = { x: -11, y: -11, w: 22, d: 22, r: 2 };
  const motor = box(MOT, 198, 222, {}, 0.5)
    + L([204, 208, 212, 216].map((z) => k.pathOf([at([11, -8, z]), at([11, 8, z])])).join(''), { tone: 'lo' })
    + box({ x: -5, y: -5, w: 10, d: 10, r: 1 }, 222, 226, { tone: 'hi', crease: 'lo' }, 0.3);
  return arm + gland + cylBody + motor;
})();
// cooling-water hoses: supply and return to each electrode holder, along the
// arms' +x side (local coordinates; the stage draws the flow along them)
const HOSES = [
  [[32, -145, 58], [20, -136, 30], [13, -120, 19], [13, -18, 19], [10, -6, 34]],
  [[32, -145, 66], [21, -134, 34], [14, -116, 24], [14, -14, 24], [10, 2, 36]],
  [[32, -145, 118], [20, -136, 142], [13, -120, 145], [13, -14, 145], [10, -6, 136]],
  [[32, -145, 126], [21, -134, 148], [14, -116, 152], [14, -10, 152], [10, 2, 138]],
];
C.HOSES = HOSES;
const hosePath = (pts) => k.pathOf(pts.map(at));
const hoseSvg = (h, i) => `<path class="fp-hose" style="stroke-width:${i % 2 ? 2.6 : 2.8}" d="${hosePath(h)}"/><path class="fp-hose-hi" style="stroke-width:1" d="${hosePath(h)}"/>`;
const hosesLow = HOSES.slice(0, 2).map(hoseSvg).join('');
const hosesUp = HOSES.slice(2).map((h, i) => hoseSvg(h, i)).join('');
// the power cable from the robot to the transformer
const cable = `<path class="fp-hose" style="stroke-width:5" d="${k.pathOf([[-8, -222, 150], [-14, -206, 146], [-18, -190, 138]].map(at))}"/>`;

// ---------------------------------------------------------------- the tip dresser (past the end of the sheets)
const dresser = (() => {
  const X0 = DRESS_X;
  const post = box({ x: X0 - 8, y: 30, w: 16, d: 16, r: 1.5 }, 0, 40, { tone: 'lo' }, 0.4);
  const foot = box({ x: X0 - 14, y: 24, w: 28, d: 28, r: 1.5 }, 0, 4, { tone: 'lo' }, 0.3) + k.dotsSvg([at([X0 - 11, 27, 4]), at([X0 + 11, 49, 4])], { size: 0.55 });
  const motor = box({ x: X0 - 16, y: 18, w: 32, d: 38, r: 3 }, 40, SB - 2, {}, 0.6)
    + L([46, 52, 58].map((z) => k.pathOf([at([X0 + 16, 24, z]), at([X0 + 16, 50, z])])).join(''), { tone: 'lo' });
  // the housing: a flat plate as thick as the stack, the cutter in its nose
  const HP = { x: X0 - 18, y: -18, w: 36, d: 74, r: 6 };
  const plate = box(HP, SB, ST, { tone: 'mid', crease: 'lo' }, 0.4)
    + k.dotsSvg([at([X0 - 13, 46, ST]), at([X0 + 13, 46, ST]), at([X0 - 13, 30, ST]), at([X0 + 13, 30, ST])], { size: 0.5 });
  return { post: foot + post + motor, plate };
})();

// ---------------------------------------------------------------- the drawing
const B = gunBack;
const world = [
  g('table', table),
  g('supportL', support(-145) + clampOn(-145, -36, SB + T)),
  g('dressPost', dresser.post),
  g('gunBack', [B.forearm, B.wrist, cable, `<g data-cue="transformer">${B.trBody}${L(B.vents, { tone: 'lo' })}${B.plate}${L(B.plateRules, { tone: 'lo', free: true })}${k.dotsSvg(B.screws, { size: 0.55 })}</g>`, B.mani, B.nip, `<g data-cue="gun">${B.col}${B.lowArm}</g>`].join('')),
  g('hosesLow', `<g data-cue="water">${hosesLow}</g>`),
  g('flowLow', '', ' data-cue="water"'),
  g('lowerEl', lowerEl),
  g('sheetA', sheets.a, ' data-cue="sheets"'),
  g('dents', ''),
  g('sheetB', sheets.b, ' data-cue="sheets"'),
  g('dentsB', ''),
  g('supportR', support(145) + clampOn(145, 40, SB + 2 * T)),
  g('dressPlate', `<g data-cue="dresser">${dresser.plate}</g>`),
  g('cutter', '', ' data-cue="dresser"'),
  g('upperEl', upperEl),
  g('capU', `<g data-cue="cap">${upperCap}</g>`),
  g('gunTop', `<g data-cue="gun">${gunTop}</g>`),
  g('hoses', `<g data-cue="water">${hosesUp}</g>`),
  g('flow', '', ' data-cue="water"'),
  g('glow', ''),
  g('current', '', ' data-cue="caps"'),
  g('sparks', '', ' data-cue="spatter"'),
].join('');

// ---------------------------------------------------------------- HUD (stage space, not under the camera)
const hud = [
  g('scrim', `<rect class="fp-scrim" x="0" y="0" width="${W}" height="${H}"/>`),
  g('lead', ''),
  g('loupe', `<clipPath id="fp-lclip"><circle data-k="lclipc" cx="470" cy="150" r="112"/></clipPath><circle class="fp-hud-bg" data-k="lbg" cx="470" cy="150" r="112"/><g clip-path="url(#fp-lclip)">${g('lBody', '')}<g data-cue="nugget">${g('lNug', '')}</g><g data-cue="face">${g('lFace', '')}</g><g data-cue="spatter">${g('lSpat', '')}</g><g data-cue="align">${g('lAlign', '')}</g></g>${g('lRing', '')}`),
  g('biw', '', ' data-cue="biw"'),
  g('timeline', '', ' data-cue="timeline"'),
  g('heat', '', ' data-cue="heat"'),
  g('stepper', '', ' data-cue="stepper"'),
  g('counter', '', ' data-cue="counter"'),
  g('imprint', '', ' data-cue="imprint"'),
  g('bench', `${g('peel', '', ' data-cue="peel"')}${g('button', '', ' data-cue="button"')}${g('ifrac', '', ' data-cue="ifrac"')}${g('chisel', '', ' data-cue="chisel"')}${g('adapt', '', ' data-cue="adapt"')}`),
  g('lobe', `${g('lobeChart', '', ' data-cue="lobe"')}${g('stack', '', ' data-cue="stack"')}${g('ahss', '', ' data-cue="ahss"')}${g('pulse', '', ' data-cue="pulse"')}`),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label=""><defs><radialGradient id="fp-glow"><stop offset="0" class="fp-glow0"/><stop offset="0.35" class="fp-glow1"/><stop offset="1" class="fp-glow2"/></radialGradient></defs>${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, [sx, sy]): world point p lands at stage point (sx, sy) (default the centre) with a view w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const CAM = [
  null, // s0: the intro framings, one per beat (C.INTRO)
  { from: cam([-20, -40, 80], 470, [170, 230]), to: cam([10, -40, 80], 440, [170, 230]) },
  { from: cam([WELDS[3], 0, SB], 300, [190, 230]), to: cam([WELDS[3], 0, SB], 240, [180, 220]) },
  { from: cam([WELDS[4], 0, SB], 260, [180, 220]), to: cam([WELDS[4], 0, SB], 240, [180, 220]) },
  { from: cam([WELDS[5], 0, SB + 20], 360, [190, 220]), to: cam([DRESS_X - 20, 0, SB + 20], 360, [190, 220]), a: 0.22, b: 0.36 },
  { from: cam([WELDS[7], -40, 90], 420, [180, 220]), to: cam([WELDS[7], -40, 90], 400, [180, 220]) },
  { from: cam([0, -40, 80], 640), to: cam([0, -40, 80], 620) },
  { from: cam([0, -40, 80], 640), to: cam([0, -40, 80], 620) },
];
// the intro, beat by beat: the sheets, the gun on its robot, the transformer, the tips, the hoses
C.INTRO = [cam([0, 0, SB], 500), cam([WELDS[0] + 10, -70, 110], 470), cam([WELDS[0], -150, 96], 270), cam([WELDS[0], 0, SB + 4], 200), cam([WELDS[0] + 6, -64, 100], 340)];

// ---------------------------------------------------------------- the film
const SP = 'eng.joining.spot';
const WR = 'eng.joining.spotwear';
const QU = 'eng.joining.spotquality';
const LB = 'eng.joining.spotlobe';
const spec = {
  id: 'eng.joining.spot',
  title: { nl: 'Een puntlas in 300 ms', en: 'A spot weld in 300 ms' },
  lessons: [SP, WR, QU, LB],
  scenes: [
    {
      // v14b: the Basis "how it works" tour, before the terms
      id: 's0', lesson: SP, level: 1, dur: DUR[0], still: 0.66, title: { nl: 'Hoe puntlassen werkt', en: 'How spot welding works' },
      beats: [
        { nl: 'Puntlassen verbindt overlappende stalen platen op losse punten, zoals steken.', en: 'Spot welding joins overlapping steel sheets at single points, like stitches.', cues: ['sheets'], still: 0.1 },
        { nl: 'Een lastang aan een robot knijpt de platen tussen twee koperen elektroden.', en: 'A weld gun on a robot squeezes the sheets between two copper electrodes.', cues: ['gun'], still: 0.3 },
        { nl: 'De transformator maakt een enorme stroom: {n:8} tot {n:12} kA, bij een lage spanning.', en: 'The transformer makes a huge current: {n:8} to {n:12} kA, at a low voltage.', cues: ['transformer'], still: 0.5 },
        { nl: 'De stroom loopt van kap naar kap; waar de platen elkaar raken, smelt het staal.', en: 'The current runs from tip to tip; where the sheets touch, the steel melts.', cues: ['caps'], still: 0.72 },
        { nl: 'Water koelt de kappen van binnen, zodat het koper zelf niet smelt.', en: 'Water cools the tips from inside, so the copper itself does not melt.', cues: ['water'], still: 0.92 },
      ],
    },
    {
      id: 's1', lesson: SP, level: 1, dur: DUR[1], still: 0.8, title: { nl: 'Duizenden punten', en: 'Thousands of welds' },
      beats: [
        { nl: 'Een {t:Body-in-white|body-in-white} heeft {n:4000} tot {n:5000} laspunten.', en: 'A {t:Body-in-white|body-in-white} has {n:4000} to {n:5000} spot welds.', cue: { 'Body-in-white': 'biw' }, still: 0.4 },
        { nl: 'Snel en goedkoop, maar alleen op overlappende plaat van {n:0.6} tot {n:3} mm.', en: 'Fast and cheap, but only on overlapping sheet of {n:0.6} to {n:3} mm.', cues: ['sheets'], still: 0.85 },
      ],
    },
    {
      id: 's2', lesson: SP, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Knijpen, stroom, vasthouden', en: 'Squeeze, weld, hold' },
      beats: [
        { nl: 'Knijpen, dan {n:300} ms stroom, dan nog even vasthouden.', en: 'Squeeze, then {n:300} ms of current, then hold for a moment.', cues: ['timeline'], still: 0.25 },
        { nl: 'Tussen de platen groeit een {t:Laslens|laslens}: gesmolten staal, {n:4} tot {n:7} mm breed.', en: 'Between the sheets a {t:Nugget|nugget} grows: molten steel, {n:4} to {n:7} mm across.', cue: { Laslens: 'nugget' }, still: 0.55 },
        { nl: '{t:Stroomdichtheid|Stroomdichtheid}: {n:9500} A over {n:28.3} mm² is {n:336} A per mm².', en: '{t:Current density|Current density}: {n:9500} A over {n:28.3} mm² is {n:336} A per mm².', cue: { Stroomdichtheid: 'face' }, still: 0.9, read: { nl: '{n:9500} A / {n:28.3} mm² = {n:336} A/mm²', en: '{n:9500} A / {n:28.3} mm² = {n:336} A/mm²' } },
      ],
    },
    {
      id: 's3', lesson: SP, level: 1, dur: DUR[3], still: 0.6, title: { nl: 'Te veel, te weinig', en: 'Too much, too little' },
      beats: [
        { nl: 'Warmte groeit met de stroom in het kwadraat: {n:10}% meer stroom, {n:21}% meer warmte.', en: 'Heat grows with the current squared: {n:10}% more current, {n:21}% more heat.', cues: ['heat'], still: 0.2, read: { nl: '1,1² = 1,21', en: '1.1² = 1.21' } },
        { nl: 'Te veel warmte: {t:Uitspatten|uitspatten}. Gesmolten staal spat als vonken weg.', en: 'Too much heat: {t:Expulsion|expulsion}. Molten steel sprays out as sparks.', cue: { Uitspatten: 'spatter' }, still: 0.6 },
        { nl: 'Te weinig: een plakpunt, dat er goed uitziet maar niets houdt.', en: 'Too little: a stick weld that looks fine but holds nothing.', cues: ['nugget'], still: 0.92 },
      ],
    },
    {
      id: 's4', lesson: SP, level: 1, dur: DUR[4], still: 0.5, title: { nl: 'Kappen slijten', en: 'Tips wear' },
      beats: [
        { nl: 'Na {n:500} punten is het kapvlak Ø{n:7.5} mm: {n:215} A per mm², {n:36}% minder.', en: 'After {n:500} welds the tip face is Ø{n:7.5} mm: {n:215} A per mm², {n:36}% less.', cues: ['face'], still: 0.18, read: { nl: '{n:9500} A / {n:44.2} mm² = {n:215} A/mm²', en: '{n:9500} A / {n:44.2} mm² = {n:215} A/mm²' } },
        { nl: '{t:Kappenfrezen|Kappenfrezen}: een kleine frees snijdt de kappen weer op maat.', en: '{t:Tip dressing|Tip dressing}: a small cutter reshapes the tips.', cue: { Kappenfrezen: 'dresser' }, still: 0.5 },
        { nl: 'De {t:Stepper|stepper} verhoogt de stroom stap voor stap tot het volgende frezen.', en: 'The {t:Stepper|stepper} raises the current step by step until the next dressing.', cue: { Stepper: 'stepper' }, still: 0.78 },
        { nl: 'Punten te klein? Check eerst de frees, pas dan de stroom.', en: 'Welds too small? Check the dresser first, the current after.', cues: ['dresser'], still: 0.95 },
      ],
    },
    {
      id: 's5', lesson: WR, level: 2, dur: DUR[5], still: 0.1, title: { nl: 'De kappen in de praktijk', en: 'Tips in practice' },
      beats: [
        { nl: 'De {t:Puntenteller|puntenteller} telt de punten sinds het laatste frezen.', en: 'The {t:Weld counter|weld counter} counts the welds since the last dressing.', cue: { Puntenteller: 'counter' }, still: 0.08 },
        { nl: 'Ø{n:6.0} wordt Ø{n:6.5}: van {n:9.0} naar {n:10.6} kA voor dezelfde {n:318} A per mm².', en: 'Ø{n:6.0} becomes Ø{n:6.5}: from {n:9.0} to {n:10.6} kA for the same {n:318} A per mm².', cues: ['stepper'], still: 0.22, read: { nl: '{n:9.0} × ({n:6.5} / {n:6.0})² = {n:10.6} kA', en: '{n:9.0} × ({n:6.5} / {n:6.0})² = {n:10.6} kA' } },
        { nl: 'Is de kap te kort gefreesd, dan volgt een {t:Kappenwissel|kappenwissel}.', en: 'When the cap is dressed too short, a {t:Cap change|cap change} follows.', cue: { Kappenwissel: 'cap' }, still: 0.4 },
        { nl: 'Een {t:Kapafdruk|kapafdruk} op papier toont of het kapvlak rond en op maat is.', en: 'A {t:Tip imprint|tip imprint} on paper shows if the tip face is round and the right size.', cue: { Kapafdruk: 'imprint' }, still: 0.55 },
        { nl: 'Zonder {t:Koelwater|koelwater} worden de kappen heet en zacht.', en: 'Without {t:Cooling water|cooling water} the tips get hot and soft.', cue: { Koelwater: 'water' }, still: 0.7 },
        { nl: 'Slechte {t:Uitlijning|uitlijning}: de kappen staan scheef en de lens wordt ovaal.', en: 'Poor {t:Alignment|alignment}: the tips are skewed and the nugget turns oval.', cue: { Uitlijning: 'align' }, still: 0.9 },
      ],
    },
    {
      id: 's6', lesson: QU, level: 3, dur: DUR[6], still: 0.3, title: { nl: 'Is het punt goed?', en: 'Is the weld good?' },
      beats: [
        { nl: 'Bij de {t:Peeltest|peeltest} trekt een goed punt een {t:Knoop|knoop} uit de plaat.', en: 'In a {t:Peel test|peel test} a good weld pulls a {t:Button|button} out of the sheet.', cue: { Peeltest: 'peel', Knoop: 'button' }, still: 0.12 },
        { nl: '{n:5.6} en {n:5.2} mm geeft {n:5.4} mm: boven de eis van {n:4.9} mm.', en: '{n:5.6} and {n:5.2} mm give {n:5.4} mm: above the {n:4.9} mm required.', cues: ['button'], still: 0.3, read: { nl: '4 × √{n:1.5} = {n:4.9} mm', en: '4 × √{n:1.5} = {n:4.9} mm' } },
        { nl: 'Breekt het punt door het lasvlak: {t:Grensvlakbreuk|grensvlakbreuk}, afkeur.', en: 'If the weld breaks through the weld plane: {t:Interfacial fracture|interfacial fracture}, a reject.', cue: { Grensvlakbreuk: 'ifrac' }, still: 0.5 },
        { nl: 'De {t:Beiteltest|beiteltest} drijft een wig tussen de platen, vaak zonder te slopen.', en: 'The {t:Chisel test|chisel test} drives a wedge between the sheets, often without destroying the part.', cue: { Beiteltest: 'chisel' }, still: 0.68 },
        { nl: 'Een {t:Adaptieve regeling|adaptieve regeling} meet elk punt tijdens het lassen en stuurt bij.', en: '{t:Adaptive control|Adaptive control} measures every weld while it is made and corrects it.', cue: { 'Adaptieve regeling': 'adapt' }, still: 0.9 },
      ],
    },
    {
      id: 's7', lesson: LB, level: 4, dur: DUR[7], still: 0.6, title: { nl: 'Het lasvenster', en: 'The weld lobe' },
      beats: [
        { nl: 'Het {t:Lasvenster|lasvenster}: tussen een te kleine lens en uitspatten. De breedte is je marge.', en: 'The {t:Weld lobe|weld lobe}: between too small a nugget and expulsion. Its width is your margin.', cue: { Lasvenster: 'lobe' }, still: 0.12 },
        { nl: 'Elke {t:Plaatcombinatie|plaatcombinatie} heeft een eigen venster: hier {n:1.2} op {n:1.0} mm.', en: 'Each {t:Stack-up|stack-up} has its own lobe: here {n:1.2} on {n:1.0} mm.', cue: { Plaatcombinatie: 'stack' }, still: 0.3 },
        { nl: 'Verzinkt {t:AHSS|AHSS}: {n:7.6} tot {n:9.0} kA, {n:36}% smaller dan zonder zink ({n:6.9} tot {n:9.1}).', en: 'Galvanised {t:AHSS|AHSS}: {n:7.6} to {n:9.0} kA, {n:36}% narrower than without zinc ({n:6.9} to {n:9.1}).', cue: { AHSS: 'ahss' }, still: 0.5, read: { nl: '({n:2.2} − {n:1.4}) / {n:2.2} = {n:36}%', en: '({n:2.2} − {n:1.4}) / {n:2.2} = {n:36}%' } },
        { nl: 'Zet de stroom hoog in het venster: {n:8.7} kA, {n:0.3} kA onder uitspatten.', en: 'Set the current high in the lobe: {n:8.7} kA, {n:0.3} kA below expulsion.', cues: ['lobe'], still: 0.68 },
        { nl: 'Voor AHSS vaak een {t:Meerpulsprogramma|meerpulsprogramma}: meerdere stroompulsen na elkaar.', en: 'For AHSS often a {t:Multi-pulse schedule|multi-pulse schedule}: several current pulses in a row.', cue: { Meerpulsprogramma: 'pulse' }, still: 0.92 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers ({t:Term|shown},
// {n:number}); the build checks its terms and numbers against the lessons like
// the captions'. A term is named while its cue is lit. Units are written as
// words (kiloampère), so subtitles and speech are the same words.
const SAY = [
  [ // s0 how spot welding works
    { nl: 'Twee stalen platen liggen over elkaar. Puntlassen verbindt ze op losse punten, als steken, zonder draad of gas.',
      en: 'Two steel sheets overlap. Spot welding joins them at single points, like stitches, with no wire or gas.' },
    { nl: 'Een lastang aan een robot knijpt de platen tussen twee koperen elektroden, de kappen. Zo hard als {n:200} tot {n:400} kilo: {n:2} tot {n:4} kilonewton.',
      en: 'A weld gun on a robot squeezes the sheets between two copper electrodes, the tips. As hard as {n:200} to {n:400} kilos: {n:2} to {n:4} kilonewtons.' },
    { nl: 'De transformator op de tang maakt een enorme stroom: {n:8} tot {n:12} kiloampère, bij maar een paar volt.',
      en: 'The transformer on the gun makes a huge current: {n:8} to {n:12} kiloamps, at only a few volts.' },
    { nl: 'De stroom loopt van kap naar kap, door beide platen. Waar ze elkaar raken, is de weerstand het grootst: daar smelt het staal.',
      en: 'The current runs from tip to tip, through both sheets. Where they touch, the resistance is highest: that is where the steel melts.' },
    { nl: 'Water koelt de kappen van binnen, zodat het koper zelf niet smelt.',
      en: 'Water cools the tips from inside, so the copper itself does not melt.' },
  ],
  [ // s1 thousands of welds
    { nl: 'Een {t:Body-in-white|body-in-white}, de kale carrosserie voor het lakken, heeft {n:4000} tot {n:5000} laspunten.',
      en: 'A {t:Body-in-white|body-in-white}, the bare car body before painting, has {n:4000} to {n:5000} spot welds.' },
    { nl: 'Puntlassen is snel en goedkoop, maar alleen voor overlappende plaat van {n:0.6} tot {n:3} millimeter. Van buiten zie je niet of een punt goed is.',
      en: 'Spot welding is fast and cheap, but only for overlapping sheet of {n:0.6} to {n:3} millimetres. From outside you cannot see if a weld is good.' },
  ],
  [ // s2 squeeze, weld, hold
    { nl: 'Nu vertraagd: de tang knijpt, dan loopt {n:9.5} kiloampère, {n:300} milliseconden lang, en daarna houdt hij nog even vast.',
      en: 'Now slowed down: the gun squeezes, then {n:9.5} kiloamps flow for {n:300} milliseconds, and then it holds on a moment.' },
    { nl: 'Tussen de platen groeit een lensje gesmolten staal, dat stolt tot de las: de {t:Laslens|laslens}, {n:4} tot {n:7} millimeter breed.',
      en: 'Between the sheets a lens of molten steel grows, which freezes into the weld: the {t:Nugget|nugget}, {n:4} to {n:7} millimetres across.' },
    { nl: 'De stroom per vierkante millimeter kapvlak is de {t:Stroomdichtheid|stroomdichtheid}. {n:9500} ampère door {n:28.3} vierkante millimeter geeft {n:336}.',
      en: 'The current per square millimetre of tip face is the {t:Current density|current density}. {n:9500} amps through {n:28.3} square millimetres gives {n:336}.' },
  ],
  [ // s3 too much, too little
    { nl: 'Warmte is stroom in het kwadraat, maal weerstand, maal tijd. {n:10} procent meer stroom geeft zo’n {n:21} procent meer warmte.',
      en: 'Heat is current squared, times resistance, times the time. {n:10} percent more current gives about {n:21} percent more heat.' },
    { nl: 'Te veel stroom, of te weinig kracht, en het gesmolten staal spuit eruit als vonken: {t:Uitspatten|uitspatten}. Dat geeft deuken en een zwakker punt.',
      en: 'Too much current, or too little force, and the molten steel sprays out as sparks: {t:Expulsion|expulsion}. That gives dents and a weaker weld.' },
    { nl: 'Te weinig warmte geeft een plakpunt: het ziet er goed uit, maar het houdt niets.',
      en: 'Too little heat gives a stick weld: it looks fine, but holds nothing.' },
  ],
  [ // s4 tips wear
    { nl: 'De kappen slijten: ze worden platter en breder. Na {n:500} punten zonder frezen is het kapvlak {n:7.5} millimeter: {n:36} procent minder stroomdichtheid. De lens wordt te klein.',
      en: 'The tips wear: they get flatter and wider. After {n:500} welds without dressing the tip face is {n:7.5} millimetres: {n:36} percent less current density. The nugget gets too small.' },
    { nl: 'Daarom gaat de tang geregeld naar de kappenfrees, die de kappen weer op maat snijdt: {t:Kappenfrezen|kappenfrezen}.',
      en: 'So the gun regularly goes to the tip dresser, which cuts the tips back to size: {t:Tip dressing|tip dressing}.' },
    { nl: 'Tussendoor verhoogt de {t:Stepper|stepper} de stroom, stap voor stap, zodat de stroomdichtheid gelijk blijft. Na het frezen springt hij terug naar de basisstroom.',
      en: 'In between, the {t:Stepper|stepper} raises the current, step by step, so the current density stays the same. After dressing it drops back to the base current.' },
    { nl: 'Punten te klein? Kijk dan eerst of de frees echt snijdt, pas daarna naar de stroom.',
      en: 'Welds too small? First check that the dresser really cuts, and only then the current.' },
  ],
  [ // s5 tips in practice
    { nl: 'De {t:Puntenteller|puntenteller} telt de punten sinds het laatste frezen. Op verzinkt staal is dat vaak {n:100} tot {n:300} punten.',
      en: 'The {t:Weld counter|weld counter} counts the welds since the last dressing. On galvanised steel that is often {n:100} to {n:300} welds.' },
    { nl: 'Op {n:9.0} kiloampère en {n:6.0} millimeter kapvlak is dat {n:318} ampère per vierkante millimeter. Bij {n:6.5} millimeter is {n:10.6} kiloampère nodig.',
      en: 'At {n:9.0} kiloamps and a {n:6.0} millimetre tip face that is {n:318} amps per square millimetre. At {n:6.5} millimetres it takes {n:10.6} kiloamps.' },
    { nl: 'Is de kap te kort gefreesd, dan volgt een {t:Kappenwissel|kappenwissel}: oude kap eraf, nieuwe erop.',
      en: 'When the cap is dressed too short, a {t:Cap change|cap change} follows: old cap off, new one on.' },
    { nl: 'Een {t:Kapafdruk|kapafdruk} op carbonpapier laat zien of het kapvlak rond, gecentreerd en op maat is.',
      en: 'A {t:Tip imprint|tip imprint} on carbon paper shows whether the tip face is round, centred and the right size.' },
    { nl: 'Valt het {t:Koelwater|koelwater} weg, dan worden de kappen heet en zacht.',
      en: 'If the {t:Cooling water|cooling water} drops, the tips get hot and soft.' },
    { nl: 'En de {t:Uitlijning|uitlijning}: staan de kappen scheef, dan wordt de lens ovaal en te klein.',
      en: 'And the {t:Alignment|alignment}: if the tips are skewed, the nugget turns oval and too small.' },
  ],
  [ // s6 is the weld good?
    { nl: 'Bij de {t:Peeltest|peeltest} trek je twee gelaste stroken uit elkaar, en een goed punt scheurt eruit als een rond propje: de {t:Knoop|knoop}.',
      en: 'In a {t:Peel test|peel test} you pull two welded strips apart, and a good weld tears out as a round plug: the {t:Button|button}.' },
    { nl: 'Meet de grootste en de kleinste diameter: {n:5.6} en {n:5.2}, gemiddeld {n:5.4}. De eis is vaak vier keer de wortel uit de dunste plaat, soms vijf keer: bij {n:1.5} millimeter {n:4.9}. Dit punt is goed.',
      en: 'Measure the largest and the smallest diameter: {n:5.6} and {n:5.2}, an average of {n:5.4}. The requirement is often four times the square root of the thinnest sheet, sometimes five: at {n:1.5} millimetres, {n:4.9}. This weld passes.' },
    { nl: 'Breekt het punt door het lasvlak, zonder knoop, dan is dat {t:Grensvlakbreuk|grensvlakbreuk}. In zacht staal: afkeur.',
      en: 'If the weld breaks through the weld plane, without a button, that is {t:Interfacial fracture|interfacial fracture}. In mild steel: a reject.' },
    { nl: 'De {t:Beiteltest|beiteltest} drijft een wig tussen de platen, vaak maar tot een vaste spleet, zodat het deel heel blijft. De meeste punten meet je ultrasoon: bij een plakpunt kaatst het geluid terug na de bovenste plaat.',
      en: 'The {t:Chisel test|chisel test} drives a wedge between the sheets, often only to a set gap, so the part stays usable. Most welds are checked by ultrasound: on a stick weld the sound bounces back after the top sheet.' },
    { nl: 'Een {t:Adaptieve regeling|adaptieve regeling} meet tijdens het lassen de weerstand, of hoe ver de kappen uit elkaar gaan, en stuurt stroom of tijd bij.',
      en: '{t:Adaptive control|Adaptive control} measures the resistance while welding, or how far the tips move apart, and corrects current or time.' },
  ],
  [ // s7 the weld lobe
    { nl: 'Het {t:Lasvenster|lasvenster}: stroom tegen lastijd. Links is de lens te klein, rechts spat het. De breedte is je marge.',
      en: 'The {t:Weld lobe|weld lobe}: current against weld time. On the left the nugget is too small, on the right it spatters. The width is your margin.' },
    { nl: 'Elke {t:Plaatcombinatie|plaatcombinatie} heeft een eigen venster. Hier {n:1.2} millimeter op {n:1.0}, bij {n:300} milliseconden.',
      en: 'Each {t:Stack-up|stack-up} has its own lobe. Here {n:1.2} millimetres on {n:1.0}, at {n:300} milliseconds.' },
    { nl: 'De bovenste plaat is verzinkt DP600, een {t:AHSS|AHSS}. Venster: {n:7.6} tot {n:9.0} kiloampère. Zonder zink {n:6.9} tot {n:9.1}: het zink maakt het {n:36} procent smaller. Zink smelt vroeg en verlaagt de weerstand tussen de platen.',
      en: 'The top sheet is galvanised DP600, an {t:AHSS|AHSS}. Lobe: {n:7.6} to {n:9.0} kiloamps. Without zinc {n:6.9} to {n:9.1}: the zinc makes it {n:36} percent narrower. Zinc melts early and lowers the resistance between the sheets.' },
    { nl: 'Zet de stroom hoog, op {n:8.7}: {n:0.3} onder het uitspatten. De rest is marge voor slijtage.',
      en: 'Set the current high, at {n:8.7}: {n:0.3} below expulsion. The rest is margin for wear.' },
    { nl: 'AHSS vraagt vaak een {t:Meerpulsprogramma|meerpulsprogramma}: een voorpuls, een laspuls en een nawarmpuls.',
      en: 'AHSS often needs a {t:Multi-pulse schedule|multi-pulse schedule}: a pre-pulse, a weld pulse and a post-heat pulse.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, frameAlong, pointOf, solidOf, lathe, disc, arcOf, circleOf, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8').replace(/^[ \t]*\/\/.*\n/gm, '')
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
:root{--fp-hot:#FFF4DC}
.iso[data-theme="light"]{--fp-hot:#FFFFFF}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-mono{font-family:var(--anatomy-mono);font-weight:600}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-scrim{fill:var(--anatomy-card);opacity:.9}
.fp-card{fill:var(--anatomy-paper);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-panel{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-disp{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-hose{fill:none;stroke:var(--anatomy-shade-0);stroke-linecap:round;stroke-linejoin:round}
.fp-hose-hi{fill:none;stroke:var(--anatomy-lo);stroke-linecap:round;stroke-linejoin:round}
.fp-flow{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:3 5;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-steel2{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-cu{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-nug{fill:var(--fp-hot);stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-nugc{fill:var(--anatomy-lo);stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-dent{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-spark{fill:none;stroke:var(--fp-hot);stroke-width:1.3;stroke-linecap:round;vector-effect:non-scaling-stroke}
.iso[data-theme="light"] .fp-spark{stroke:var(--anatomy-hi)}
.fp-cur{fill:none;stroke:var(--anatomy-hi);stroke-width:1.4;stroke-dasharray:4 4;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-trace{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-trace2{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-grid{fill:none;stroke:var(--fp-hair);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-zone{fill:var(--anatomy-lo);opacity:.45}
.fp-zone2{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.fp-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-fill{fill:var(--anatomy-mid);opacity:.6}
.fp-paper{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-print{fill:var(--anatomy-hi);opacity:.82}
.fp-glow0{stop-color:var(--fp-hot);stop-opacity:1}
.fp-glow1{stop-color:var(--fp-hot);stop-opacity:.55}
.fp-glow2{stop-color:var(--fp-hot);stop-opacity:0}
.iso[data-theme="light"] .fp-glow1{stop-color:var(--anatomy-lo);stop-opacity:.35}
.iso[data-theme="light"] .fp-glow2{stop-color:var(--anatomy-lo);stop-opacity:0}
[data-cue][data-on] .fp-card,[data-cue][data-on] .fp-bar,[data-cue][data-on] .fp-paper,[data-cue][data-on] .fp-disp,[data-cue][data-on] .fp-panel{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-nug,[data-cue][data-on] .fp-nugc,[data-cue][data-on] .fp-cu,[data-cue][data-on] .fp-steel,[data-cue][data-on] .fp-steel2{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .fp-trace,[data-cue][data-on] .fp-cur,[data-cue][data-on] .fp-flow,[data-cue][data-on] .fp-spark,[data-cue][data-on] .fp-zone2,[data-cue][data-on] .fp-hatch{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-zone,[data-cue][data-on] .fp-fill,[data-cue][data-on] .fp-print{fill:var(--fp-accent)}
[data-cue][data-on] .fp-hose{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een robot met een puntlastang boven twee overlappende stalen platen op een opspantafel: de transformator, de koperen elektrodekappen, de koelwaterslangen en een kappenfrees; later een doorsnede van het laspunt met de groeiende laslens, grafieken van stroom en stepper, een peeltest en het lasvenster.',
  en: 'A robot with a spot-weld gun over two overlapping steel sheets on a fixture table: the transformer, the copper electrode tips, the cooling-water hoses and a tip dresser; later a section of the weld with the growing nugget, charts of current and stepper, a peel test and the weld lobe.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

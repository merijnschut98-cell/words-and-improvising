// Dev tool, not shipped. Builds the explainer film "De trekproef / The tensile
// test" for the topic Materiaalsterkte en beproeving of Materialen en sterkte:
// level 1, eng.mechanics.strength (Vloeigrens, treksterkte en veiligheidsfactor).
//
//   node films/eng.mechanics.tensile/build.mjs            build the page
//   node films/eng.mechanics.tensile/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.mechanics.tensile.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// The drawing is a two-column universal testing machine on its base: levelling
// feet, a base with a name plate and vents, two columns, a fixed top beam with
// column nuts, a moving crosshead with guide collars, a load cell, wedge grips
// above and below with jaw windows and handles, a clip-on extensometer with two
// knife edges, and a control pendant with an emergency stop. Between the grips a
// round test bar is pulled: it stretches, thins evenly, necks and breaks; later a
// grey cast-iron bar breaks short and flat. Cards in stage space carry the
// stress-strain curve (drawn live from the same state that stretches the bar),
// the bolt class 8.8, the pendulum impact test and the console with its safety
// factor; every card is labelled "voorbeeld".
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
// Asserted against the lesson (the build fails if a value drifts); the {n:...}
// numbers are then checked against the Dutch lesson text by defineFilm.
// Sources as in the lesson: EN 10025-2 (S235, S355: minimum yield in the name,
// for thickness up to 16 mm), ISO 898-1 (property class 8.8), EN ISO 148-1
// (impact test). Steel's modulus of elasticity about 210.000 MPa, as in
// eng.mechanics.stress, so S235 yields at a strain of about 0,11 %: the card's
// straight part is drawn stretched and says so.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const S235 = 235;
const S355 = 355;
const PLATE = 16;
const E_STEEL = 210000;
assert(near((S235 / E_STEEL) * 100, 0.11, 0.005), 'S235 yields at about a tenth of a percent strain');
// bolts: class a.b → tensile a × 100 MPa, yield (b × 10) % of that
const boltOf = (cls) => { const [a, b] = cls.split('.').map(Number); return { rm: a * 100, pct: b * 10, re: a * 100 * b / 10 }; };
const B88 = boltOf('8.8');
assert(B88.rm === 800 && B88.pct === 80 && B88.re === 640, '8.8: 800 MPa, 80 %, 640 MPa');
assert(boltOf('10.9').re === 900, '10.9 yields at 900 MPa (the lesson\'s recall)');
// impact test: at least 27 J at −20 °C
const KV = 27;
const KV_T = -20;
// safety factors: about 1,5 static, 3 or more uncertain, 4 to 7 lifting gear against breaking
const SF_STATIC = 1.5;
const SF_UNSURE = 3;
const SF_LIFT = [4, 7];
assert(SF_STATIC < SF_UNSURE && SF_UNSURE < SF_LIFT[0], 'the safety factors rise with the unknowns');
// the console: S235 at 120 MPa; the load doubles; S355; a thicker console in S235
const WORK = 120;
const DOUBLE = 2 * WORK;
const SF1 = S235 / WORK;
const SF2 = S355 / DOUBLE;
assert(near(SF1, 1.96, 0.005) && DOUBLE === 240 && DOUBLE > S235 && near(SF2, 1.48, 0.005), '235 / 120 = 1,96; 240 > 235; 355 / 240 = 1,48');
// the card's curve (illustrative S235): straight to yield at a schematic strain
// of 0,02, a short yield step, hardening to the peak at 0,20, necking to the
// break at 0,27. The bar in the machine follows the same state: its plastic
// strain (strain minus stress over the card's slope) is its permanent stretch.
const CURVE = { eY: 0.02, eS: 0.035, eU: 0.2, eF: 0.27, sY: S235, sS: 238, sU: 364, sF: 294 };
const sigma = (e) => (e <= CURVE.eY ? (CURVE.sY / CURVE.eY) * e
  : e <= CURVE.eS ? CURVE.sY + (CURVE.sS - CURVE.sY) * (e - CURVE.eY) / (CURVE.eS - CURVE.eY)
    : e <= CURVE.eU ? CURVE.sU - (CURVE.sU - CURVE.sS) * ((CURVE.eU - e) / (CURVE.eU - CURVE.eS)) ** 2
      : CURVE.sU - (CURVE.sU - CURVE.sF) * ((e - CURVE.eU) / (CURVE.eF - CURVE.eU)) ** 2);
assert(near(sigma(CURVE.eY), S235, 1e-9) && near(sigma(CURVE.eS), CURVE.sS, 1e-9) && near(sigma(CURVE.eU), CURVE.sU, 1e-9), 'the curve is continuous');
for (let e = 0.001; e < CURVE.eU; e += 0.001) assert(sigma(e + 0.001) >= sigma(e), 'rising up to the peak');
for (let e = CURVE.eU; e < CURVE.eF - 0.001; e += 0.001) assert(sigma(e + 0.001) < sigma(e), 'falling after the peak (necking)');
// the unloading in scene 2: from 0,06 back parallel to the straight part
const E_UN = 0.06;
const SET = E_UN - sigma(E_UN) / (CURVE.sY / CURVE.eY);
assert(SET > 0.03 && SET < E_UN, 'a permanent set is left');

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x across the machine's front, +y toward
// the viewer. The floor is z = 0.
const W = 640;
const H = 400;
const BASE = { x: -44, y: -24, w: 88, d: 48, r: 2 };
const BASE_Z = 24;
const COLX = 30;
const COLR = 3.4;
const TOP_Z = 170;
const BEAM = { x: -43, y: -10, w: 86, d: 20, r: 1.5 };
const BEAM_H = 14;
const XH = { x: -41, y: -8, w: 82, d: 16, r: 1.2 };
const C0 = 99; // crosshead underside at rest
const XH_H = 12;
const COLLAR = [C0 + XH_H, C0 + XH_H + 3];
const GRIP = { x: -8, y: -6, w: 16, d: 12, r: 1 };
const LG_Z = [30, 46];
const UG_Z = [C0 - 25, C0 - 8];
const CELL_Z = [C0 - 8, C0];
// the bar: heads in the jaws, shoulders, the gauge length between the knife edges
const SPEC = { z0: LG_Z[1], f0: 50, g0: 52, g1: 68, f1: 70, z1: UG_Z[0], rHead: 2.4, rGauge: 1.4 };
const EXT = { x0: SPEC.rGauge, x1: 6, zLo: 54, zHi: 66, body: [55, 62.5] };
const PEND = { x: 33, y: 9, w: 10, d: 8, r: 1 };
const PEND_Z = [BASE_Z, 36];

const FIT = [
  ...k.boxCorners(BASE, -5, BASE_Z),
  ...k.boxCorners(BEAM, TOP_Z, TOP_Z + BEAM_H + 4),
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 66, elevation: 22 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const S = (paths, style) => k.solidSvg(paths, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 4) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const box = (plan, z0, z1, style = {}, { steps = 3, bevel = 0, inner = '', extra = '' } = {}) => S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const post = (cx, cy, r, z0, z1, style = {}, { steps = 28, bevel = 0, inner = '', extra = '' } = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const disc = (F, s0, s1, r, style = {}, { steps, extra = '' } = {}) => S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style }) + extra;
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
// a face plate on the face y = fy: a card with three printed rule lines and four screws
const plate = (fy, x0, z0, x1, z1) => [
  `<g transform="${planeOf(fy)}">`,
  `<path class="mt-card" d="${flatRect(x0, z0, x1, z1, 0.5)}"/>`,
  `<path class="iso-line" data-tone="lo" data-free="" d="${[0.3, 0.5, 0.7].map((f, i) => `M${(x0 + 1.4).toFixed(1)} ${(-(z1 - (z1 - z0) * f)).toFixed(1)}H${(x1 - 1.4 - i * (x1 - x0) * 0.18).toFixed(1)}`).join('')}"/>`,
  '</g>',
  Dt([[x0 + 0.8, fy, z0 + 0.8], [x1 - 0.8, fy, z0 + 0.8], [x0 + 0.8, fy, z1 - 0.8], [x1 - 0.8, fy, z1 - 0.8]].map(at), { size: 0.4 }),
].join('');

// ---------------------------------------------------------------- floor, feet and base
const parts = [];
parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -3), 0, 2, P)}"/>`);
for (const [x, y] of [[-37, -17], [37, -17], [-37, 17], [37, 17]]) {
  parts.push(post(x, y, 3.4, -5, -3.4, { tone: 'lo' }, { steps: 28 }));
  parts.push(post(x, y, 1.3, -3.4, 0, { tone: 'mid', crease: 'none' }, { steps: 16 }));
  parts.push(post(x, y, 2.4, -2.2, -0.8, { tone: 'mid' }, { steps: 6 }));
}
{
  const fy = BASE.y + BASE.d;
  const slots = [8, 11, 14, 17].map((z) => flatRect(14, z, 36, z + 1.2, 0.6, 3)).join('');
  const face = [
    plate(fy, -38, 7, -18, 18),
    `<g transform="${planeOf(fy)}"><path class="mt-well" d="${slots}"/><path class="iso-line" data-tone="lo" d="${slots}"/></g>`,
    Dt([[12, fy, 6], [38, fy, 6], [12, fy, 20], [38, fy, 20]].map(at), { size: 0.42 }),
  ].join('');
  const top = L(k.planOutline(k.insetPlan(BASE, 3.5), BASE_Z, P, 4), { tone: 'faint' })
    + Dt(k.corners(BASE, 5).map(([x, y]) => at([x, y, BASE_Z])), { size: 0.5 });
  parts.push(box(BASE, 0, BASE_Z, { tone: 'lo' }, { steps: 4, bevel: 0.8, inner: L(k.sideSeam(BASE, 3, P, 4), { tone: 'faint' }), extra: top + face }));
}
// ---------------------------------------------------------------- columns (static, full height)
for (const x of [-COLX, COLX]) {
  parts.push(post(x, 0, 5.2, BASE_Z, BASE_Z + 3, { tone: 'mid' }, { steps: 32, bevel: 0.3, extra: Dt([0, 1, 2, 3].map((i) => at([x + 4.2 * Math.cos(i * Math.PI / 2 + 0.4), 4.2 * Math.sin(i * Math.PI / 2 + 0.4), BASE_Z + 3])), { size: 0.38 }) }));
  parts.push(post(x, 0, COLR, BASE_Z + 3, TOP_Z, { tone: 'mid', crease: 'none' }, { steps: 32 }));
}
// ---------------------------------------------------------------- the lower grip on its adapter
const gripFace = (fy, z0, z1) => {
  // the jaw window: two wedge jaws with serrated faces either side of the bar's head
  const m = (z0 + z1) / 2;
  const win = flatRect(-5.4, z0 + 2.4, 5.4, z1 - 2.4, 0.8);
  const jawL = k.pathOf([[-5, -(z0 + 2.8)], [-2.6, -(z0 + 2.8)], [-2.6, -(z1 - 2.8)], [-4.2, -(z1 - 2.8)]], true);
  const jawR = k.pathOf([[5, -(z0 + 2.8)], [2.6, -(z0 + 2.8)], [2.6, -(z1 - 2.8)], [4.2, -(z1 - 2.8)]], true);
  const teeth = [];
  for (let z = z0 + 3.6; z < z1 - 3.2; z += 1.1) teeth.push(`M-3.4 ${(-z).toFixed(1)}H-2.6M2.6 ${(-z).toFixed(1)}H3.4`);
  return [
    `<g transform="${planeOf(fy)}">`,
    `<path class="mt-well" d="${win}"/>`,
    `<path class="mt-jaw" d="${jawL}${jawR}"/>`,
    `<path class="iso-line" data-tone="lo" d="${jawL}${jawR}"/>`,
    `<path class="iso-line" data-tone="faint" d="${teeth.join('')}"/>`,
    `<path class="iso-line" data-tone="lo" d="${win}"/>`,
    `<path class="mt-head" d="${flatRect(-1.9, m - 3, 1.9, m + 3, 0.6)}"/>`,
    '</g>',
    Dt([[-6.6, fy, z0 + 1.2], [6.6, fy, z0 + 1.2], [-6.6, fy, z1 - 1.2], [6.6, fy, z1 - 1.2]].map(at), { size: 0.4 }),
  ].join('');
};
const handle = (z) => disc(frameX([GRIP.x + GRIP.w, 0, z]), 0, 5.4, 0.7, { tone: 'mid', crease: 'none' })
  + disc(frameX([GRIP.x + GRIP.w, 0, z]), 5.4, 7.6, 1.5, { tone: 'hi' })
  + disc(frameX([GRIP.x + GRIP.w, 0, z]), 0, 0.8, 1.6, { tone: 'mid' }, { steps: 6 });
parts.push(post(0, 0, 5.6, BASE_Z, LG_Z[0], { tone: 'mid' }, { steps: 32, bevel: 0.3, inner: L(k.sideArc(0, 0, 5.6, 27, P, 24), { tone: 'faint' }) }));
parts.push(disc(frameY([0, 5.6, 27]), 0, 1.2, 1.4, { tone: 'hi' }, { extra: Dt([at([0, 6.8, 27])], { size: 0.4, tone: 'hi' }) }));
parts.push(cueG('grip', box(GRIP, LG_Z[0], LG_Z[1], { tone: 'mid' }, { steps: 3, bevel: 0.5, inner: L(k.sideSeam(GRIP, LG_Z[1] - 3, P, 3), { tone: 'faint' }), extra: gripFace(GRIP.y + GRIP.d, LG_Z[0], LG_Z[1]) + L(k.planOutline(k.insetPlan(GRIP, 1.2), LG_Z[1], P, 3), { tone: 'faint' }) })));
parts.push(handle(40));

// ---------------------------------------------------------------- live: the bar, the extensometer's upper knife
parts.push(cueG('spec', g('spec', '')));
{
  // the moving knife: an arm on a rod that slides into the body (drawn before the body)
  const arm = post(4.3, 0, 0.42, EXT.body[0] + 1.5, EXT.zHi, { tone: 'hi', crease: 'none' }, { steps: 14 })
    + box({ x: EXT.x0, y: -0.7, w: EXT.x1 - EXT.x0 - 0.4, d: 1.4, r: 0.3 }, EXT.zHi, EXT.zHi + 1.2, { tone: 'hi' }, { steps: 2 })
    + Dt([at([EXT.x0, 0, EXT.zHi + 0.6])], { size: 0.4, tone: 'hi' });
  parts.push(cueG('ext', g('extUp', arm)));
  const body = box({ x: 2.6, y: -1.6, w: 3.6, d: 3.2, r: 0.5 }, EXT.body[0], EXT.body[1], { tone: 'mid' }, { steps: 2, bevel: 0.2,
    extra: `<g transform="${planeOf(1.6)}"><path class="iso-line" data-tone="lo" d="M3.2 ${-(EXT.body[0] + 1.6)}H5.6M3.2 ${-(EXT.body[0] + 2.6)}H5"/></g>`
      + Dt([at([4.4, 1.6, EXT.body[1] - 1.2])], { size: 0.38 }) })
    + box({ x: EXT.x0, y: -0.7, w: 1.4, d: 1.4, r: 0.3 }, EXT.zLo - 0.6, EXT.zLo + 0.6, { tone: 'hi' }, { steps: 2 })
    + box({ x: 2.6, y: -0.7, w: 1.2, d: 1.4, r: 0.2 }, EXT.zLo - 0.6, EXT.body[0], { tone: 'mid' }, { steps: 2 })
    + Dt([at([EXT.x0, 0, EXT.zLo])], { size: 0.4, tone: 'hi' });
  parts.push(cueG('ext', body));
}
// ---------------------------------------------------------------- the moving crosshead with the load cell and upper grip
{
  const mv = [];
  mv.push(cueG('grip', box(GRIP, UG_Z[0], UG_Z[1], { tone: 'mid' }, { steps: 3, bevel: 0.5, inner: L(k.sideSeam(GRIP, UG_Z[0] + 3, P, 3), { tone: 'faint' }), extra: gripFace(GRIP.y + GRIP.d, UG_Z[0], UG_Z[1]) })));
  mv.push(handle(UG_Z[0] + 6));
  mv.push(post(0, 0, 3, CELL_Z[0] - 0.01, CELL_Z[0] + 1.6, { tone: 'mid' }, { steps: 24 }));
  mv.push(cueG('cell', post(0, 0, 5.6, CELL_Z[0] + 1.6, CELL_Z[1], { tone: 'hi', crease: 'lo' }, { steps: 36, bevel: 0.3,
    inner: L(k.sideArc(0, 0, 5.6, CELL_Z[0] + 4.4, P, 28), { tone: 'faint' }) })
    + disc(frameY([0, 5.6, CELL_Z[0] + 4.4]), 0, 1.4, 1.2, { tone: 'mid' }, { steps: 6 })
    + disc(frameY([0, 5.6, CELL_Z[0] + 4.4]), 1.4, 2.4, 0.8, { tone: 'mid' }, { extra: Dt([at([0, 8, CELL_Z[0] + 4.4])], { size: 0.38, tone: 'hi' }) })));
  const fy = XH.y + XH.d;
  mv.push(cueG('xh', box(XH, C0, C0 + XH_H, { tone: 'mid' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(XH, C0 + 2, P, 3), { tone: 'faint' }),
    extra: plate(fy, -10, C0 + 3, 10, C0 + 9) + Dt([-36, -24, 24, 36].map((x) => at([x, fy, C0 + 6])), { size: 0.5, tone: 'mid' })
      + L(k.planOutline(k.insetPlan(XH, 1.6), C0 + XH_H, P, 3), { tone: 'faint' }) })));
  for (const x of [-COLX, COLX]) mv.push(post(x, 0, 5, COLLAR[0], COLLAR[1], { tone: 'mid' }, { steps: 32, bevel: 0.3, extra: Dt([0, 1, 2, 3].map((i) => at([x + 4.1 * Math.cos(i * Math.PI / 2 + 0.8), 4.1 * Math.sin(i * Math.PI / 2 + 0.8), COLLAR[1]])), { size: 0.36 }) }));
  parts.push(g('xh', mv.join('')));
}
// the columns above the crosshead's collars, redrawn as the crosshead moves
parts.push(g('colU', ''));
// ---------------------------------------------------------------- the top beam
{
  const fy = BEAM.y + BEAM.d;
  parts.push(box(BEAM, TOP_Z, TOP_Z + BEAM_H, { tone: 'mid' }, { steps: 4, bevel: 0.7, inner: L(k.sideSeam(BEAM, TOP_Z + 2.2, P, 4), { tone: 'faint' }),
    extra: plate(fy, -14, TOP_Z + 3.5, 14, TOP_Z + 10.5) + Dt([-38, -22, 22, 38].map((x) => at([x, fy, TOP_Z + 7])), { size: 0.5 })
      + L(k.planOutline(k.insetPlan(BEAM, 2.4), TOP_Z + BEAM_H, P, 4), { tone: 'faint' }) }));
  for (const x of [-COLX, COLX]) {
    parts.push(post(x, 0, 5.4, TOP_Z + BEAM_H, TOP_Z + BEAM_H + 2.6, { tone: 'mid' }, { steps: 6, bevel: 0.2 }));
    parts.push(post(x, 0, 2.6, TOP_Z + BEAM_H + 2.6, TOP_Z + BEAM_H + 4, { tone: 'hi', crease: 'none' }, { steps: 20, extra: Dt([at([x, 0, TOP_Z + BEAM_H + 4])], { size: 0.45, tone: 'hi' }) }));
  }
}
// ---------------------------------------------------------------- the control pendant on the base
{
  const fy = PEND.y + PEND.d;
  const face = [
    `<g transform="${planeOf(fy)}">`,
    `<path class="mt-well" d="${flatRect(34.4, 26, 41.6, 29.4, 0.5)}"/>`,
    `<path class="iso-line" data-tone="mid" d="M35.6 ${-27}l1 -1.2l1 1.2ZM39.4 ${-28.4}l1 1.2l1 -1.2Z"/>`,
    '</g>',
  ].join('');
  parts.push(box(PEND, PEND_Z[0], PEND_Z[1], { tone: 'mid' }, { steps: 3, bevel: 0.4, extra: face + Dt(k.corners(PEND, 1).map(([x, y]) => at([x, y, PEND_Z[1]])), { size: 0.38 }) }));
  const FE = frameY([38, fy, 32.4]);
  parts.push(disc(FE, 0, 0.6, 2.4, { tone: 'mid' }, {}));
  parts.push(disc(FE, 0.6, 1.4, 1.2, { tone: 'mid' }, {}));
  parts.push(disc(FE, 1.4, 2.4, 2.1, { tone: 'hi' }, { extra: Dt([at([38, fy + 2.4, 32.4])], { size: 0.45, tone: 'hi' }) }));
}
const world = parts.join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const hud = [
  g('curve', g('cvBase', '') + cueG('ductC', g('cvSteel', '')) + cueG('britC', g('cvIron', '')) + cueG('yieldPt', g('cvYield', '')) + cueG('utsPt', g('cvUts', '')) + g('cvTiles', '')),
  g('bolt', g('btIn', '')),
  g('charpy', g('chIn', '')),
  g('cons', g('csIn', '') + cueG('sfC', g('csSf', '')) + g('csChips', '')),
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
  const put2 = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && out && !/[MlZ]$/.test(out) && s[0] !== '-') out += ' ';
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put2('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put2('M', p); cur = p; start = p; cmd = 'L'; } else { put2('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
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
const BAR = [2, 0, 61];
const SIDE = (w0, w1) => ({ from: cam(BAR, w0, 104), to: cam(BAR, w1, 104) });
// s1 opens on the whole machine (framed as tight as its height allows at 390 px)
// and settles on a frame that still holds the load cell and the extensometer,
// both named in s1; s2 closes in on the bar for the yield.
const CELLVIEW = cam([2, 0, 74], 230, 104);
const CAM = [
  { from: cam([0, 0, 88], 615), to: CELLVIEW, a: 0.2, b: 0.42 },
  { from: CELLVIEW, to: cam(BAR, 140, 104), a: 0, b: 0.3 },
  SIDE(140, 132),
  SIDE(160, 150),
  SIDE(150, 140),
  SIDE(150, 158),
];

// ---------------------------------------------------------------- the film
const STR = 'eng.mechanics.strength';
const DUR = [32, 30, 30, 28, 32, 32];
const C = {
  SPEC, EXT, COLX, COLR, TOP_Z, C0, COLLAR, CURVE, E_UN, SET, S235, S355, B88, KV, KV_T, WORK, DOUBLE, SF1, SF2, SF_STATIC, SF_UNSURE, SF_LIFT,
  dur: DUR,
};
const spec = {
  id: 'eng.mechanics.tensile',
  title: { nl: 'De trekproef', en: 'The tensile test' },
  lessons: [STR],
  scenes: [
    {
      id: 's1', lesson: STR, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Trekken tot hij breekt', en: 'Pulling until it breaks' },
      beats: [
        { nl: 'Een trekbank: onderin een vaste klem, bovenin een dwarsbalk die omhoog loopt.', en: 'A testing machine: a fixed grip at the bottom, a crosshead at the top that moves up.', cues: ['grip', 'xh'] },
        { nl: 'De {t:Trekproef|trekproef}: een staaf uittrekken tot hij breekt, en spanning tegen rek uitzetten.', en: 'The {t:Tensile test|tensile test}: pull a bar until it breaks, and plot stress against strain.', cue: { Trekproef: 'spec' }, cues: ['cell', 'ext'] },
        { nl: 'Spanning is kracht gedeeld door doorsnede, in MPa. Rek is verlenging gedeeld door lengte.', en: 'Stress is force divided by cross-section, in MPa. Strain is extension divided by length.', cues: ['spec', 'cell', 'ext'] },
        { nl: 'Eerst loopt de lijn recht: elastisch. Laat je los, dan veert de staaf terug.', en: 'At first the line is straight: elastic. Let go and the bar springs back.', cues: ['spec'] },
      ],
    },
    {
      id: 's2', lesson: STR, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'De vloeigrens', en: 'The yield strength' },
      beats: [
        { nl: 'Bij de {t:Vloeigrens|vloeigrens} buigt de lijn af: de staaf vervormt blijvend.', en: 'At the {t:Yield strength|yield strength} the line bends over: the bar deforms permanently.', cue: { Vloeigrens: 'yieldPt' }, cues: ['spec'] },
        { nl: 'Ontlast je nu, dan zakt de lijn evenwijdig terug en blijft de staaf langer.', en: 'Unload now and the line drops back parallel, and the bar stays longer.', cues: ['spec', 'ext'] },
        { nl: 'S235 vloeit bij {n:235} MPa of meer, S355 bij {n:355} MPa: de vloeigrens staat in de naam.', en: 'S235 yields at {n:235} MPa or more, S355 at {n:355} MPa: the yield strength is in the name.', cues: ['yieldPt'] },
        { nl: 'Dat geldt voor plaat tot {n:16} mm dik; dikkere plaat zit iets lager.', en: 'That holds for plate up to {n:16} mm thick; thicker plate is slightly lower.', cues: ['yieldPt'] },
      ],
    },
    {
      id: 's3', lesson: STR, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Treksterkte, insnoeren, breken', en: 'Tensile strength, necking, fracture' },
      beats: [
        { nl: 'Trek je door, dan stijgt de spanning nog: de staaf wordt overal gelijk dunner en langer.', en: 'Pull on and the stress still rises: the bar gets evenly thinner and longer.', cues: ['spec'] },
        { nl: 'Het hoogste punt is de {t:Treksterkte|treksterkte}: de grootste spanning die dit staal haalt.', en: 'The highest point is the {t:Tensile strength|tensile strength}: the greatest stress this steel reaches.', cue: { Treksterkte: 'utsPt' } },
        { nl: 'Daarna snoert de staaf in: op één plek wordt hij zichtbaar dunner.', en: 'Then the bar necks: in one spot it gets visibly thinner.', cues: ['spec'] },
        { nl: 'In de hals breekt hij. Voor een ontwerp telt de vloeigrens, niet de breuk.', en: 'It breaks in the neck. For a design the yield strength counts, not the break.', cues: ['spec', 'yieldPt'] },
      ],
    },
    {
      id: 's4', lesson: STR, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'De klasse op een bout', en: 'The class on a bolt' },
      beats: [
        { nl: 'Op de kop van een bout staat zijn sterkteklasse, bijvoorbeeld 8.8 (ISO 898-1).', en: 'A bolt\'s head shows its property class, for example 8.8 (ISO 898-1).', cues: [] },
        { nl: 'Het eerste getal maal 100 is de treksterkte: {n:800} MPa.', en: 'The first number times 100 is the tensile strength: {n:800} MPa.', cues: [] },
        { nl: 'Het tweede getal maal 10 geeft de vloeigrens als percentage daarvan: {n:80}%, dus {n:640} MPa.', en: 'The second number times 10 gives the yield as a percentage of it: {n:80}%, so {n:640} MPa.', cues: [] },
        { nl: 'Nominale waarden om mee te rekenen. Een bout uit de la kan een lagere klasse hebben.', en: 'Nominal values to calculate with. A bolt from the drawer may be a lower class.', cues: [] },
      ],
    },
    {
      id: 's5', lesson: STR, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Taai of bros', en: 'Ductile or brittle' },
      beats: [
        { nl: '{t:Taai|Taai} staal rekt flink uit voor het breekt, en dat waarschuwt: het buigt en snoert in.', en: '{t:Ductile|Ductile} steel stretches a lot before it breaks, and that warns you: it bends and necks.', cue: { Taai: 'ductC' }, cues: ['spec'] },
        { nl: '{t:Bros|Bros} gietijzer breekt bijna zonder rek en zonder waarschuwing, met een vlak breukvlak.', en: '{t:Brittle|Brittle} cast iron breaks with almost no strain and no warning, with a flat fracture.', cue: { Bros: 'britC' }, cues: ['spec'] },
        { nl: 'Kou maakt sommige staalsoorten bros. Dat meet de kerfslagproef, met een slingerhamer.', en: 'Cold makes some steels brittle. The impact test measures that, with a swinging hammer.', cues: [] },
        { nl: 'Bijvoorbeeld kwaliteit J2: minstens {n:27} J bij −{n:20} °C.', en: 'For example grade J2: at least {n:27} J at −{n:20} °C.', cues: [] },
      ],
    },
    {
      id: 's6', lesson: STR, level: 1, dur: DUR[5], still: 0.92, title: { nl: 'Veiligheidsfactor tegen wat?', en: 'Safety factor against what?' },
      beats: [
        { nl: '{t:Veiligheidsfactor|Veiligheidsfactor}: vloeigrens gedeeld door werkspanning. {n:235} / {n:120} = {n:1.96}.', en: '{t:Safety factor|Safety factor}: yield divided by working stress. {n:235} / {n:120} = {n:1.96}.', cue: { Veiligheidsfactor: 'sfC' } },
        { nl: 'De belasting verdubbelt: {n:240} MPa, boven de vloeigrens. De console verbuigt blijvend.', en: 'The load doubles: {n:240} MPa, above the yield strength. The bracket bends for good.', cues: ['sfC'] },
        { nl: 'S355 geeft {n:355} / {n:240} = {n:1.48}: krap als het trilt. Een dikkere console herstelt de marge.', en: 'S355 gives {n:355} / {n:240} = {n:1.48}: thin if it vibrates. A thicker bracket restores the margin.', cues: ['sfC'] },
        { nl: 'Gangbaar: zo’n {n:1.5} bij rustige lasten, {n:3} of meer bij onzekere, {n:4} à {n:7} voor hijsmiddelen, tegen breuk.', en: 'Typical: about {n:1.5} for steady loads, {n:3} or more for uncertain ones, {n:4} to {n:7} for lifting gear, against breaking.', cues: ['sfC'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", σ or ε in the spoken text: MPa is said
// as "megapascal", "235 / 120" as "235 gedeeld door 120", J and °C as "joule"
// and "graden". The bolt class is spoken as "acht punt acht" (Dutch) and
// "eight point eight"; "UTS" is said only in English. The Dutch words were
// checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex):
// "traverse" (stressed TRAAverse), "hijsmiddelen" (hijsmidDEElen) and
// "proefstaaf" (proefSTAAF) are kept out of the Dutch narration; S235 and S355
// ("s" as a bare hiss), "kerfslagproef", "trekproef" and "elasticiteitsmodulus"
// (stress at the end) get Dutch spoken forms in films/_kit/timeline.mjs (SAY).
// "J2" and "drie punt één" (the 3.1 certificate) are written as said.
const SAY = [
  [ // s1 pulling until it breaks
    { nl: 'Dit is een trekbank. Onderin zit een vaste klem, bovenin een dwarsbalk die langzaam omhoog loopt. Daartussen klemmen we een ronde staaf van staal.',
      en: 'This is a tensile testing machine. At the bottom is a fixed grip, at the top a crosshead that slowly moves up. Between them we clamp a round steel test bar.' },
    { nl: 'Bij een {t:Trekproef|trekproef} trek je de staaf uit tot hij breekt. Een krachtopnemer meet de kracht, een rekopnemer op de staaf meet hoeveel langer hij wordt. De computer tekent daaruit de lijn van spanning tegen rek.',
      en: 'In a {t:Tensile test|tensile test} you pull the bar until it breaks. A load cell measures the force, and an extensometer on the bar measures how much longer it gets. From that the computer draws the line of stress against strain.' },
    { nl: 'Spanning is de kracht gedeeld door de doorsnede van de staaf, in megapascal. Rek is hoeveel de staaf langer wordt, gedeeld door zijn oorspronkelijke lengte. Zo vergelijk je dikke en dunne staven eerlijk.',
      en: 'Stress is the force divided by the bar\'s cross-section, in megapascals. Strain is how much longer the bar gets, divided by its original length. That way thick and thin bars compare fairly.' },
    { nl: 'In het begin loopt de lijn recht omhoog: het elastische gebied. De staaf gedraagt zich als een veer. Haal je de kracht weg, dan veert hij terug naar zijn oude lengte. Hoe steil die lijn loopt, is de elasticiteitsmodulus. Op de kaart is dit stuk uitgerekt: echt staal rekt hier maar één à twee tiende procent.',
      en: 'At first the line runs straight up: the elastic range. The bar behaves like a spring. Take the force away and it springs back to its old length. How steep that line runs is the modulus of elasticity. The card stretches this part: real steel strains only one or two tenths of a percent here.' },
  ],
  [ // s2 the yield strength
    { nl: 'Dan buigt de lijn af. Dat punt is de {t:Vloeigrens|vloeigrens}: daar begint het staal blijvend te vervormen. Het metaal gaat als het ware vloeien.',
      en: 'Then the line bends over. That point is the {t:Yield strength|yield strength}: there the steel starts to deform permanently. The metal starts to flow, as it were.' },
    { nl: 'Haal je de kracht nu weg, dan zakt de lijn evenwijdig aan het rechte stuk terug, en blijft er rek over. De staaf is langer gebleven.',
      en: 'Take the force away now, and the line drops back parallel to the straight part, leaving some strain behind. The bar has stayed longer.' },
    { nl: 'Europese constructiestaalsoorten dragen hun minimale vloeigrens in de naam. S235 vloeit bij {n:235} megapascal of meer, S355 bij {n:355}.',
      en: 'European structural steels carry their minimum yield strength in their name. S235 yields at {n:235} megapascals or more, S355 at {n:355}.' },
    { nl: 'Dat geldt voor plaat tot {n:16} mm dik; dikkere plaat zit iets lager. Ontwerpers houden de spanning onder de vloeigrens, met marge: een onderdeel dat blijvend verbuigt, is meestal al kapot.',
      en: 'That holds for plate up to {n:16} mm thick; thicker plate is slightly lower. Designers keep the stress below the yield strength, with a margin: a part that bends permanently has usually already failed.' },
  ],
  [ // s3 tensile strength, necking, fracture
    { nl: 'Trek je door, dan stijgt de spanning nog verder. Over de hele meetlengte wordt de staaf gelijkmatig dunner en langer, en het staal wordt daarbij zelfs iets sterker.',
      en: 'Pull on and the stress rises further still. Over the whole gauge length the bar gets evenly thinner and longer, and the steel even gets a little stronger as it does.' },
    { nl: 'Het hoogste punt van de lijn is de {t:Treksterkte|treksterkte}: de grootste spanning die het materiaal haalt. Je rekent die uit met de grootste kracht en de oorspronkelijke doorsnede.',
      en: 'The highest point of the line is the {t:Tensile strength|tensile strength}, or UTS: the greatest stress the material reaches. You work it out from the highest force and the original cross-section.' },
    { nl: 'Daarna snoert de staaf in. Op één plek wordt hij zichtbaar dunner, alle verdere rek gaat naar die hals, en de kracht die nodig is om door te trekken zakt.',
      en: 'Then the bar necks. In one spot it gets visibly thinner, all further stretching goes into that neck, and the force needed to keep pulling drops.' },
    { nl: 'Tot slot breekt hij in de hals. Maar voor een ontwerp is de vloeigrens de grens, niet de breuk.',
      en: 'Finally it breaks in the neck. But for a design the limit is the yield strength, not the break.' },
  ],
  [ // s4 the class on a bolt
    { nl: 'Bouten hebben een sterkteklasse. Op de kop staat bijvoorbeeld acht punt acht.',
      en: 'Bolts carry a property class. The head shows, for example, eight point eight.' },
    { nl: 'Het eerste getal maal honderd is de treksterkte in megapascal. Acht maal honderd: {n:800} megapascal.',
      en: 'The first number times one hundred is the tensile strength in megapascals. Eight times one hundred: {n:800} megapascals.' },
    { nl: 'Het tweede getal maal tien is de vloeigrens, als percentage van de treksterkte. {n:80} procent van {n:800} is {n:640} megapascal.',
      en: 'The second number times ten is the yield strength, as a percentage of the tensile strength. {n:80} percent of {n:800} is {n:640} megapascals.' },
    { nl: 'Dat zijn de nominale waarden waarmee je rekent. Vervang een gebroken bout dus nooit door wat er toevallig in de la ligt: een lagere klasse vloeit eerder.',
      en: 'Those are the nominal values you calculate with. So never replace a broken bolt with whatever happens to be in the drawer: a lower class yields sooner.' },
  ],
  [ // s5 ductile or brittle
    { nl: 'Het staal dat we net trokken, is {t:Taai|taai}: het rekt flink uit voordat het breekt. Dat geeft een waarschuwing, want een onderdeel buigt, snoert in of zakt door. De meeste staalsoorten, aluminium en koper zijn taai.',
      en: 'The steel we just pulled is {t:Ductile|ductile}: it stretches a lot before it breaks. That gives a warning, because a part bends, necks or sags first. Most steels, aluminium and copper are ductile.' },
    { nl: 'Nu een staaf grijs gietijzer. Die is {t:Bros|bros}: de lijn stopt bijna meteen, en hij breekt zonder in te snoeren. Glas, keramiek en heel hard staal breken net zo, zonder waarschuwing.',
      en: 'Now a bar of grey cast iron. It is {t:Brittle|brittle}: the line stops almost at once, and it breaks without necking. Glass, ceramics and very hard steel break the same way, without warning.' },
    { nl: 'Kou maakt sommige staalsoorten bros. Dat meet de kerfslagproef: een staafje met een kerf wordt met een slingerhamer stukgeslagen. Hoe minder hoog de hamer daarna doorzwaait, hoe meer energie het staafje opnam.',
      en: 'Cold makes some steels brittle. The impact test measures that: a notched bar is broken by a swinging hammer. The less high the hammer swings on afterwards, the more energy the bar absorbed.' },
    { nl: 'Een gangbare eis, bijvoorbeeld voor kwaliteit J2, is minstens {n:27} joule bij min {n:20} graden. Veel energie in de kou betekent: dit staal blijft ook in de winter taai. Die waarde staat op het materiaalcertificaat van de partij, vaak een certificaat drie punt één, naast de gemeten vloeigrens, treksterkte en rek bij breuk. Vraag erom bij veiligheidskritische onderdelen.',
      en: 'A common requirement, for example for grade J2, is at least {n:27} joules at minus {n:20} degrees. Plenty of energy in the cold means this steel stays ductile in winter too. That value is on the batch\'s material certificate, often a three point one certificate, next to the measured yield, tensile strength and elongation at break. Ask for it on safety-critical parts.' },
  ],
  [ // s6 safety factor against what?
    { nl: 'Hoeveel marge heb je? De {t:Veiligheidsfactor|veiligheidsfactor} is de vloeigrens gedeeld door de werkspanning, de spanning bij normaal gebruik. Een console van S235 heeft een werkspanning van {n:120} megapascal: {n:235} gedeeld door {n:120} is {n:1.96}. Prima bij een rustige belasting.',
      en: 'How much margin do you have? The {t:Safety factor|safety factor} is the yield strength divided by the working stress, the stress in normal use. A bracket of S235 sees a working stress of {n:120} megapascals: {n:235} divided by {n:120} is {n:1.96}. Fine for a steady load.' },
    { nl: 'Na een proceswijziging verdubbelt de belasting: {n:240} megapascal. Dat is boven de vloeigrens, dus de console gaat blijvend verbuigen.',
      en: 'After a process change the load doubles: {n:240} megapascals. That is above the yield strength, so the bracket will bend permanently.' },
    { nl: 'Overstappen op S355 geeft {n:355} gedeeld door {n:240}, is {n:1.48}. Hij houdt het, maar de marge is krap als de last trilt, en dan wordt vermoeiing misschien het volgende probleem. Een dikkere console in S235 brengt de spanning terug naar {n:120}, en herstelt de oude marge.',
      en: 'Switching to S355 gives {n:355} divided by {n:240}, that is {n:1.48}. It holds, but the margin is thin if the load vibrates, and then fatigue may be the next problem. A thicker bracket in S235 brings the stress back to {n:120}, and restores the old margin.' },
    { nl: 'Gangbaar is zo\'n {n:1.5} bij goed bekende, rustige lasten, en {n:3} of meer bij onzekere of wisselende. Voor hijsen geldt {n:4} tot {n:7} tegen breuk, afhankelijk van het type. De factor dekt het onbekende af; het is geen ruimte voor extra last. Een factor twee tegen breuk is geen twee tegen vloeien, en een factor op het stilstaande gewicht zegt weinig over een last die trilt. Vraag dus altijd: veiligheidsfactor tegen wat, en op welke belasting?',
      en: 'Typical is about {n:1.5} for well-known, steady loads, and {n:3} or more for uncertain or dynamic ones. Lifting gear uses {n:4} to {n:7} against breaking, depending on the type. The factor covers the unknowns; it is not room for extra load. A factor of two against breaking is not two against yield, and a factor on the static weight says little about a load that vibrates. So always ask: safety factor against what, and on which load?' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
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
// no symbol the voice would read aloud in the spoken script
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  if (/[/&σε°]|MPa|\bJ\b/.test(line[lang])) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.mt-well{fill:var(--anatomy-shade-0);stroke:none}
.mt-jaw{fill:var(--anatomy-shade-2);stroke:none}
.mt-head{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.mt-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mt-cap{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight)}
.mt-cup{fill:var(--anatomy-shade-0);stroke:none}
[data-cue][data-on] .mt-cap{fill:var(--anatomy-lit-top)}
.mt-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mt-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mt-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mt-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mt-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.mt-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mt-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mt-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mt-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.mt-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.mt-ghost{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2 4}
.mt-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mt-dot{fill:var(--anatomy-hi)}
.mt-acc{fill:var(--fp-accent);stroke:none}
.mt-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mt-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mt-solid{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linejoin:round}
.mt-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mt-line{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .mt-dot{fill:var(--fp-accent)}
[data-cue][data-on] .mt-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .mt-tile{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .mt-solid{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een trekbank met twee kolommen op een voet met stelpoten: een vaste bovenbalk, een traverse die omhoog loopt met een krachtopnemer, wigklemmen boven en onder met een klemvenster en een hendel, een rekopnemer met twee meskanten op de staaf en een bedieningskastje met noodstop. Tussen de klemmen wordt een ronde proefstaaf uitgetrokken: hij rekt, wordt dunner, snoert in en breekt; later breekt een staaf gietijzer kort en vlak. Kaarten, elk gemarkeerd als voorbeeld, tonen de lijn van spanning tegen rek, de boutklasse 8.8, de kerfslagproef met een slingerhamer en een console met zijn veiligheidsfactor.',
  en: 'A two-column testing machine on a base with levelling feet: a fixed top beam, a crosshead that moves up carrying a load cell, wedge grips above and below with a jaw window and a handle, an extensometer with two knife edges on the bar and a control pendant with an emergency stop. Between the grips a round test bar is pulled: it stretches, thins, necks and breaks; later a cast-iron bar breaks short and flat. Cards, each marked as an example, show the stress-strain line, the bolt class 8.8, the impact test with a swinging hammer and a bracket with its safety factor.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

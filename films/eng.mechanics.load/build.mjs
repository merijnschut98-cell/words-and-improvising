// Dev tool, not shipped. Builds the explainer film "Kracht, moment en spanning /
// Force, moment and stress" for the topic Krachten, momenten en spanning of
// Materialen en sterkte: level 1, eng.mechanics.forces (Kracht, gewicht en
// moment) and level 2, eng.mechanics.stress (Spanning, rek en stijfheid).
//
//   node films/eng.mechanics.load/build.mjs            build the page
//   node films/eng.mechanics.load/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.mechanics.load.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// Two sets on one projection, one shown at a time:
// - the wall bracket of the forces lesson's worked example: a concrete pillar
//   with formwork joints and anchor holes, a base plate with four anchor bolts
//   (washer, nut, stud), a square hollow arm with an end cap, a diagonal strut
//   with its foot and gusset, and on the arm the motor on a slide plate (feet,
//   a finned body, fan cowl, end shield, shaft and key, terminal box with a
//   gland), the motor parts of eng.mechanics.fatigue laid on their side. The
//   motor slides from 0,4 to 0,8 m.
// - a hall portal for equilibrium and stress: two I-section columns on base
//   plates with anchor nuts, a top girder with stiffeners, two hanger rods of
//   2 m on lugs, clevises, pins and a turnbuckle, a runway beam with end stops,
//   a trolley (side plates, four wheels, a cross bar) carrying a chain hoist
//   with a hand-chain wheel, its WLL plate, the load chain, a hook block and
//   hook, a two-leg sling and a crate. The rods stretch (drawn exaggerated) and
//   one is sawn through to show its cross-section.
// Cards in stage space, in the style of eng.mechanics.tensile, carry the sums;
// each is labelled "voorbeeld" or "schema".
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
// Asserted against the lessons (the build fails if a value drifts); the {n:...}
// numbers are then checked against the Dutch lesson text by defineFilm.
// Facts, as in the lessons and in standard texts (Hibbeler, Statics and
// Mechanics of Materials; Gere): weight W = m·g with g = 9,81 m/s²; a moment is
// force times its perpendicular arm, in Nm; a body at rest has zero net force
// and zero net moment (the free-body diagram); for a beam on two supports, or
// hung from two rods, a load at distance a from the left support puts
// F·(L − a)/L on the left and F·a/L on the right; normal stress σ = F/A, in
// N/mm² = MPa; strain ε = ΔL/L; Hooke σ = E·ε in the elastic range; E about
// 210 GPa for steel and 70 GPa for aluminium; a rectangle's bending stiffness
// grows with b·h³/12. The dynamic factor (1,1 to 2), the breaking load of
// lifting gear (4 to 7 × WLL, EN 13414 / EN 13889 style) and the sling angle
// (each leg of a two-leg sling at 120° carries the full load: 1/(2·cos 60°) = 1)
// are hedged as rules of thumb in the narration.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const g9 = 9.81;
const MASS = 50;
const WEIGHT = Math.floor(MASS * g9);
assert(WEIGHT === 490 && near(MASS * g9, 490.5, 1e-9), '50 kg × 9,81 = 490 N (the lesson rounds 490,5 down)');
assert(Math.round(100 * g9) === 981, '100 kg pulls with about 981 N, about 1 kN');
const ARM0 = 0.4;
const ARM1 = 0.8;
const M0 = WEIGHT * ARM0;
const M1 = WEIGHT * ARM1;
assert(near(M0, 196, 1e-9) && near(M1, 392, 1e-9) && near(M1, 2 * M0, 1e-9), '490 × 0,4 = 196 Nm; × 0,8 = 392 Nm, double');
assert(near(200 * 0.25, 50, 1e-9) && near(50 / 0.5, 100, 1e-9), 'wrench: 200 N × 0,25 m = 50 Nm; double the arm, half the force');
// equilibrium: a beam hung from two rods SPAN apart, a load F at a from the left rod
const SPAN = 2;
const LOAD = 6;
const split = (a) => [LOAD * (SPAN - a) / SPAN, LOAD * a / SPAN];
assert(split(1)[0] === 3 && split(1)[1] === 3, '6 kN in the middle: 3 kN per support');
assert(near(split(1.8)[0] + split(1.8)[1], LOAD, 1e-9) && split(1.8)[1] > 5, 'near one support it takes nearly all; the total stays');
// dynamic factor and lifting gear
const DYN = [1.1, 2];
const BREAK = [4, 7];
const SLING = 120;
assert(near(1 / (2 * Math.cos((SLING / 2) * Math.PI / 180)), 1, 1e-9), 'two legs at 120°: each leg carries the full load');
// the tie rod
const D = 20;
const AREA = Math.round(Math.PI * (D / 2) ** 2);
const F_ROD = 31.4;
const SIG = (F_ROD * 1000) / AREA;
assert(AREA === 314 && near(SIG, 100, 1e-9), 'Ø20 → 314 mm²; 31.400 / 314 = 100 MPa');
assert(near(10000 / 100, 100, 1e-9), '10 kN on 100 mm² is 100 MPa too');
const E_ST = 210000;
const E_AL = 70000;
const LEN = 2000;
const EPS = SIG / E_ST;
const DL_ST = EPS * LEN;
const DL_AL = (SIG / E_AL) * LEN;
assert(near(EPS, 0.000476, 5e-7) && near(DL_ST, 0.95, 0.005) && near(DL_AL, 2.86, 0.005) && near(DL_AL / DL_ST, 3, 1e-9), 'strain 0,000476; 0,95 mm; aluminium 2,86 mm, three times');
assert(near(0.5 / 1000, 0.0005, 1e-12), '0,5 mm on 1.000 mm is a strain of 0,0005');
assert(2 ** 3 === 8, 'twice as tall, eight times as stiff');

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x to the right, +y toward the viewer.
const W = 640;
const H = 400;
const AZ = 50;
// set A: the wall bracket (the wall face at x = 0, the arm along +x)
const PIL = { x: -34, y: -30, w: 34, d: 60, r: 1 };
const PIL_Z = 250;
const BP = { x: 0, y: -12, w: 2, d: 24, r: 0.3 };
const BP_Z = [118, 184];
const BOLTS = [[-8, 124], [8, 124], [-8, 178], [8, 178]];
const ARM = { x: 2, y: -5, w: 90, d: 10, r: 0.6 };
const ARM_Z = [160, 170];
const STRUT = { from: [2, 0, 131], to: [64, 0, 160] };
const MOT = { z0: 170, r: 8, cz: 183.5, y0: -10, y1: 10 };
const MX = [40, 80]; // the motor's centre of gravity from the wall, cm
assert(MX[0] / 100 === ARM0 && MX[1] / 100 === ARM1, 'the drawing puts the motor at 0,4 and 0,8 m');
// set B: the portal (the hanger rods at x = ±100, 2 m apart, 2 m long)
const COLX = 150;
const GIR_Z = [336, 352];
const ROD = { x: 100, r: 1.6, z0: 124, z1: 324, tb: [216, 232] };
assert((ROD.z1 - ROD.z0) === LEN / 10 && 2 * ROD.x === SPAN * 100, 'the rods are 2 m long and 2 m apart');
const RB_Z = [96, 112];
const RB_X = 125;

const FIT = [
  ...k.boxCorners({ x: -COLX - 12, y: -12, w: 2 * COLX + 24, d: 24 }, 0, GIR_Z[1]),
  ...k.boxCorners(PIL, 0, PIL_Z), [95, 0, 170],
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: AZ, elevation: 22 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const S = (paths, style) => k.solidSvg(paths, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, Zv, X);
const planeY = (y) => k.sideMatrix([0, y], 0, P, 'left');
const planeX = (x) => k.sideMatrix([x, 0], 0, P, 'right');
const flatRect = (x0, z0, x1, z1, r, steps = 4) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const box = (plan, z0, z1, style = {}, { steps = 3, bevel = 0, inner = '', extra = '' } = {}) => S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const post = (cx, cy, r, z0, z1, style = {}, { steps = 28, bevel = 0, inner = '', extra = '' } = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const disc = (F, s0, s1, r, style = {}, { steps, extra = '' } = {}) => S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style }) + extra;
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
// a face plate on the face y = fy: a card with three printed rule lines and four screws
const plate = (fy, x0, z0, x1, z1) => [
  `<g transform="${planeY(fy)}">`,
  `<path class="ml-card" d="${flatRect(x0, z0, x1, z1, 0.5)}"/>`,
  `<path class="iso-line" data-tone="lo" data-free="" d="${[0.3, 0.5, 0.7].map((f, i) => `M${(x0 + 1.2).toFixed(1)} ${(-(z1 - (z1 - z0) * f)).toFixed(1)}H${(x1 - 1.2 - i * (x1 - x0) * 0.18).toFixed(1)}`).join('')}"/>`,
  '</g>',
  Dt([[x0 + 0.7, fy, z0 + 0.7], [x1 - 0.7, fy, z0 + 0.7], [x0 + 0.7, fy, z1 - 0.7], [x1 - 0.7, fy, z1 - 0.7]].map(at), { size: 0.36 }),
].join('');
// an I-section along x: bottom flange, web, top flange (painted in that order)
const ibeam = (x0, x1, z0, z1, half, tf, style = { tone: 'mid' }, between = '', front = '') => {
  const pl = { x: x0, y: -half, w: x1 - x0, d: 2 * half, r: 0.3 };
  return box(pl, z0, z0 + tf, style, { steps: 2 })
    + between
    + box({ x: x0, y: -0.7, w: x1 - x0, d: 1.4, r: 0.2 }, z0 + tf, z1 - tf, style, { steps: 2 })
    + front
    + box(pl, z1 - tf, z1, style, { steps: 2, extra: L(k.planOutline(k.insetPlan(pl, 1.4), z1, P, 2), { tone: 'faint' }) });
};

// ---------------------------------------------------------------- set A: the wall bracket
const A = [];
A.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PIL, -4), 0, 2, P)}"/>`);
{
  const seams = [62, 124, 186].map((z) => L(k.sideSeam(PIL, z, P, 3), { tone: 'faint' })).join('');
  const holes = Dt([[0, -22, 40], [0, 22, 40], [0, -22, 102], [0, 22, 102], [0, -22, 226], [0, 22, 226], [-10, 30, 40], [-24, 30, 40], [-10, 30, 102], [-24, 30, 102], [-10, 30, 226], [-24, 30, 226]].map(at), { size: 0.55, tone: 'lo' });
  A.push(box(PIL, 0, PIL_Z, { tone: 'lo' }, { steps: 3, bevel: 0.6, inner: seams, extra: holes + L(k.planOutline(k.insetPlan(PIL, 3), PIL_Z, P, 3), { tone: 'faint' }) }));
  // a plinth strip at the foot
  A.push(box({ x: PIL.x - 3, y: PIL.y - 3, w: PIL.w + 3, d: PIL.d + 6, r: 0.8 }, 0, 3, { tone: 'lo' }, { steps: 3 }));
}
// the base plate with a weld seam where the arm meets it, and the anchor bolts
A.push(box(BP, BP_Z[0], BP_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.3 }));
const bolt = ([y, z]) => {
  const F = frameX([BP.x + BP.w, y, z]);
  return disc(F, 0, 0.35, 2.4, { tone: 'mid' }) + disc(F, 0.35, 1.9, 1.9, { tone: 'mid' }, { steps: 6 }) + disc(F, 1.9, 2.9, 1.0, { tone: 'hi', crease: 'none' }, { extra: Dt([at([BP.x + BP.w + 2.9, y, z])], { size: 0.3, tone: 'hi' }) });
};
A.push(BOLTS.filter(([, z]) => z < 150).map(bolt).join(''));
A.push(cueG('bolts', BOLTS.filter(([, z]) => z > 150).map(bolt).join('')));
// the strut: a square bar from a foot plate on the base plate up to a gusset under the arm
{
  const a = G.unit3(G.sub3(STRUT.to, STRUT.from));
  const v = G.unit3(G.cross3(a, Y));
  const F = G.frameOf(STRUT.from, a, Y, v);
  const len = G.len3(G.sub3(STRUT.to, STRUT.from));
  A.push(box({ x: 2, y: -4, w: 1.2, d: 8, r: 0.3 }, 126, 137, { tone: 'mid' }, { steps: 2 }));
  A.push(cueG('strut', S(G.prismOf(F, [[-2.6, -2.6], [2.6, -2.6], [2.6, 2.6], [-2.6, 2.6]], 0, len, P), { tone: 'mid' })));
  A.push(box({ x: 54, y: -0.6, w: 14, d: 1.2, r: 0.2 }, 154, 160, { tone: 'mid' }, { steps: 2 }));
}
// the arm with its end cap, weld seam and the scale of the slide (a tick every 10 cm)
{
  const ticks = [];
  for (let x = 10; x <= 90; x += 10) ticks.push(`M${at([x, ARM.y + ARM.d, ARM_Z[1] - 1.6]).join(' ')}L${at([x, ARM.y + ARM.d, ARM_Z[1] - (x % 50 ? 3.4 : 5.2)]).join(' ')}`);
  A.push(cueG('arm', box(ARM, ARM_Z[0], ARM_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.4, inner: `<path class="iso-line" data-tone="lo" d="${ticks.join('')}"/>`,
    extra: L(k.planOutline({ x: 2.6, y: -5.4, w: 1.4, d: 10.8, r: 0.2 }, ARM_Z[1], P, 2), { tone: 'faint' }) })));
  A.push(box({ x: 92, y: -5.4, w: 1, d: 10.8, r: 0.3 }, ARM_Z[0] - 0.4, ARM_Z[1] + 0.4, { tone: 'mid' }, { steps: 2 }));
}
// the motor (live: it slides along the arm), drawn at x = 0 and moved
{
  const m = [];
  const SP = { x: -13, y: -9, w: 26, d: 18, r: 0.6 };
  m.push(box(SP, MOT.z0, MOT.z0 + 1.4, { tone: 'lo' }, { steps: 2, extra: Dt(k.corners(SP, 1.6).map(([x, y]) => at([x, y, MOT.z0 + 1.4])), { size: 0.4 }) }));
  for (const x of [-8, 8]) m.push(box({ x: x - 2.5, y: -7.5, w: 5, d: 15, r: 0.4 }, MOT.z0 + 1.4, MOT.z0 + 4.2, { tone: 'mid' }, { steps: 2, extra: Dt([[x, -5.6, MOT.z0 + 4.2], [x, 5.6, MOT.z0 + 4.2]].map(at), { size: 0.42, tone: 'hi' }) }));
  const FB = frameY([0, MOT.y0, MOT.cz]);
  m.push(disc(FB, -6, 0, MOT.r + 0.5, { tone: 'mid' }));
  m.push(S(G.disc(0, MOT.y1 - MOT.y0, MOT.r, FB, P), { tone: 'hi', inner: L(G.ribsOf(FB, 1.2, MOT.y1 - MOT.y0 - 1.2, MOT.r, 26, P, { least: 0.2 }), { tone: 'faint' }) }));
  const FE = frameY([0, MOT.y1, MOT.cz]);
  m.push(disc(FE, 0, 1.4, MOT.r - 0.6, { tone: 'mid' }));
  m.push(disc(FE, 1.4, 2.4, 2.6, { tone: 'mid' }));
  m.push(disc(FE, 2.4, 6.4, 1.3, { tone: 'hi', crease: 'none' }, { extra: Dt([at([0, MOT.y1 + 6.4, MOT.cz])], { size: 0.3, tone: 'hi' }) }));
  const TB = { x: -3.5, y: -4, w: 7, d: 8, r: 0.5 };
  m.push(box(TB, MOT.cz + MOT.r - 0.8, MOT.cz + MOT.r + 4.6, { tone: 'mid' }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(TB, MOT.cz + MOT.r + 3.4, P, 2), { tone: 'faint' }),
    extra: Dt(k.corners(TB, 0.8).map(([x, y]) => at([x, y, MOT.cz + MOT.r + 4.6])), { size: 0.34 }) }));
  m.push(disc(frameX([TB.x + TB.w, 0, MOT.cz + MOT.r + 1.8]), 0, 1.4, 1.1, { tone: 'mid' }, { steps: 6 }));
  A.push(cueG('motor', g('motor', m.join(''))));
}
const setA = A.join('');

// ---------------------------------------------------------------- set B: the portal
const B = [];
B.push(`<path class="iso-halo" d="${k.haloOf({ x: -COLX - 14, y: -14, w: 2 * COLX + 28, d: 28, r: 6 }, 0, 2, P)}"/>`);
// the column at x = cx: base plate, anchor nuts, flanges and web, cap plate
const column = (cx) => {
  const out = [];
  const bp = { x: cx - 13, y: -13, w: 26, d: 26, r: 0.8 };
  out.push(box(bp, 0, 2, { tone: 'lo' }, { steps: 2 }));
  for (const [x, y] of k.corners(bp, 3.4)) out.push(post(x, y, 1.6, 2, 3.4, { tone: 'mid' }, { steps: 6 }) + post(x, y, 0.8, 3.4, 4.6, { tone: 'hi', crease: 'none' }, { steps: 12 }));
  out.push(box({ x: cx - 8, y: -8, w: 1.4, d: 16, r: 0.2 }, 2, GIR_Z[0] - 1.4, { tone: 'mid' }, { steps: 2 }));
  out.push(box({ x: cx - 6.6, y: -0.6, w: 13.2, d: 1.2, r: 0.1 }, 2, GIR_Z[0] - 1.4, { tone: 'mid' }, { steps: 2 }));
  out.push(box({ x: cx + 6.6, y: -8, w: 1.4, d: 16, r: 0.2 }, 2, GIR_Z[0] - 1.4, { tone: 'mid' }, { steps: 2 }));
  out.push(box({ x: cx - 10, y: -9, w: 20, d: 18, r: 0.4 }, GIR_Z[0] - 1.4, GIR_Z[0], { tone: 'mid' }, { steps: 2 }));
  return out.join('');
};
B.push(column(-COLX), column(COLX));
// the hangers' upper half: a lug under the girder, a clevis with its pin
const clevis = (x, zLug0, zLug1, zFork0, zFork1, pinZ, up) => {
  const out = [];
  out.push(box({ x: x - 2.6, y: -2.4, w: 5.2, d: 0.8, r: 0.2 }, zFork0, zFork1, { tone: 'mid' }, { steps: 2 }));
  out.push(box({ x: x - 3.2, y: -0.6, w: 6.4, d: 1.2, r: 0.3 }, zLug0, zLug1, { tone: 'mid' }, { steps: 2 }));
  out.push(box({ x: x - 2.6, y: 1.6, w: 5.2, d: 0.8, r: 0.2 }, zFork0, zFork1, { tone: 'mid' }, { steps: 2 }));
  out.push(disc(frameY([x, 2.4, pinZ]), 0, 0.7, 1.1, { tone: 'hi' }, { extra: Dt([at([x, 3.1, pinZ])], { size: 0.3, tone: 'hi' }) }));
  const zb = up ? zFork0 - 3.2 : zFork1;
  out.push(box({ x: x - 2.6, y: -2.4, w: 5.2, d: 4.8, r: 0.4 }, zb, zb + 3.2, { tone: 'mid' }, { steps: 2 }));
  return out.join('');
};
B.push(cueG('hang', clevis(-ROD.x, GIR_Z[0] - 8, GIR_Z[0], ROD.z1 + 3.2, ROD.z1 + 10, ROD.z1 + 6.6, true) + clevis(ROD.x, GIR_Z[0] - 8, GIR_Z[0], ROD.z1 + 3.2, ROD.z1 + 10, ROD.z1 + 6.6, true)));
// the rods (live: they stretch, one is sawn through)
B.push(cueG('rod', g('rods', '')) + cueG('secC', g('cut', '')));
// the girder with a stiffener pair over each column and a name plate
{
  const stiff = [-COLX, COLX].map((x) => box({ x: x - 0.6, y: 0.7, w: 1.2, d: 6, r: 0.1 }, GIR_Z[0] + 1.6, GIR_Z[1] - 1.6, { tone: 'mid' }, { steps: 2 })).join('');
  B.push(ibeam(-COLX - 12, COLX + 12, GIR_Z[0], GIR_Z[1], 8, 1.6, { tone: 'mid' }, '', stiff + plate(0.71, -10, GIR_Z[0] + 4, 10, GIR_Z[1] - 4)));
}
// the runway group (live: it drops by the rods' stretch): the beam, the lower
// lugs, the trolley with the hoist, the sling and the crate
// The trolley is drawn once at x = 0 and moved along the beam by the page.
const WZ = RB_Z[0] + 1.6 + 2.4; // the wheels' axle height: they run on the bottom flange
const trolB = box({ x: -9, y: -10.4, w: 18, d: 1.2, r: 0.3 }, 88, 106, { tone: 'mid' }, { steps: 2 });
const wheel = (x, y0) => disc(frameY([x, y0, WZ]), 0, 2, 2.4, { tone: 'mid' }, { extra: Dt([at([x, y0 + 2, WZ])], { size: 0.3, tone: 'hi' }) });
const wheelsB = wheel(-5, -5.2) + wheel(5, -5.2);
const wheelsF = wheel(-5, 2.6) + wheel(5, 2.6);
const HOOK = [0, 0, 36];
const LIFT = [[-15, 0, 22], [15, 0, 22]];
const trolF = (() => {
  const out = [];
  out.push(box({ x: -9, y: -10.4, w: 18, d: 21.6, r: 0.4 }, 85, 88, { tone: 'mid' }, { steps: 2 }));
  out.push(box({ x: -9, y: 9.2, w: 18, d: 1.2, r: 0.3 }, 85, 106, { tone: 'mid' }, { steps: 2, extra: Dt([[-5, 10.4, WZ], [5, 10.4, WZ], [-7, 10.4, 87], [7, 10.4, 87]].map(at), { size: 0.4, tone: 'hi' }) }));
  out.push(box({ x: -2, y: -1.5, w: 4, d: 3, r: 0.3 }, 82, 85, { tone: 'mid' }, { steps: 2 }));
  const HB = { x: -7.5, y: -6.5, w: 15, d: 13, r: 2.5 };
  out.push(box(HB, 58, 82, { tone: 'hi' }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(HB, 78, P, 3), { tone: 'faint' }) + L(k.sideSeam(HB, 62, P, 3), { tone: 'faint' }),
    extra: L(k.planOutline(k.insetPlan(HB, 1.6), 82, P, 3), { tone: 'faint' }) }));
  out.push(cueG('wll', plate(HB.y + HB.d, -5, 65, 5, 74)));
  const FW = frameX([HB.x + HB.w, 0, 72]);
  out.push(disc(FW, 0, 1.2, 6.2, { tone: 'mid' }) + disc(FW, 1.2, 2.2, 1.6, { tone: 'hi' }, { extra: Dt([at([HB.x + HB.w + 2.2, 0, 72])], { size: 0.3, tone: 'hi' }) }));
  // the hand chain hangs from the wheel's rim in a loop
  out.push(`<path class="ml-chain" d="M${at([9.4, -2, 66]).join(' ')}L${at([9.4, -2, 30]).join(' ')}L${at([9.4, 2, 30]).join(' ')}L${at([9.4, 2, 66]).join(' ')}"/>`);
  // the bobbing set: load chain, hook block, hook, sling and crate
  const hs = [];
  hs.push(`<path class="ml-chain" d="M${at([0, 0, 58]).join(' ')}L${at([0, 0, 46]).join(' ')}"/>`);
  hs.push(box({ x: -3, y: -2.4, w: 6, d: 4.8, r: 0.8 }, 40, 46, { tone: 'mid' }, { steps: 2, extra: Dt([at([0, 2.4, 43])], { size: 0.4, tone: 'hi' }) }));
  const hk = [[0, 0, 40], [0, 0, 38], [1.6, 0, 36.6], [1.4, 0, 34.4], [0, 0, 33.6], [-1.4, 0, 34.4], [-1.6, 0, 35.6]].map(at);
  hs.push(`<path class="ml-hook" d="M${hk.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}"/>`);
  const crate = { x: -20, y: -14, w: 40, d: 28, r: 0.6 };
  hs.push(cueG('crate', box(crate, 4, 22, { tone: 'hi' }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(crate, 10, P, 2), { tone: 'faint' }) + L(k.sideSeam(crate, 16, P, 2), { tone: 'faint' }),
    extra: L(k.planOutline(k.insetPlan(crate, 2.4), 22, P, 2), { tone: 'faint' }) + Dt(k.corners(crate, 1.4).map(([x, y]) => at([x, y, 22])), { size: 0.45 })
      + LIFT.map((p) => disc(frameY([p[0], -1, p[2] + 1.2]), 0, 2, 1.2, { tone: 'mid' })).join('') })));
  hs.push(`<path class="ml-sling" d="M${at(LIFT[0]).map((v) => v.toFixed(1)).join(' ')}L${at([0, 0, 34]).map((v) => v.toFixed(1)).join(' ')}L${at(LIFT[1]).map((v) => v.toFixed(1)).join(' ')}"/>`);
  out.push(g('hookset', hs.join('')));
  return out.join('');
})();
{
  const back = [];
  const front = [];
  back.push(g('trolB', trolB));
  const lugs = clevis(-ROD.x, RB_Z[1], RB_Z[1] + 8, RB_Z[1] + 2, RB_Z[1] + 8.8, RB_Z[1] + 5.4, false)
    + clevis(ROD.x, RB_Z[1], RB_Z[1] + 8, RB_Z[1] + 2, RB_Z[1] + 8.8, RB_Z[1] + 5.4, false);
  const stops = [-RB_X + 2, RB_X - 4].map((x) => box({ x, y: -6.5, w: 2, d: 13, r: 0.2 }, RB_Z[0] + 1.6, RB_Z[0] + 5, { tone: 'mid' }, { steps: 2 })).join('');
  const beam = ibeam(-RB_X, RB_X, RB_Z[0], RB_Z[1], 7, 1.6, { tone: 'mid' }, g('wheelsB', wheelsB) + stops, g('wheelsF', wheelsF));
  front.push(cueG('beam', beam));
  front.push(cueG('hang', lugs));
  front.push(g('trolF', trolF));
  B.push(g('runway', back.join('') + front.join('')));
}
// the force arrows of set A and set B, drawn in world space over the parts
const setB = B.join('');
const world = g('setA', setA) + g('setB', setB) + cueG('wArrow', g('arrW', '')) + cueG('arm', g('arrM', '')) + g('arrB', '');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const hud = [
  g('cW', g('cWIn', '')),
  g('cM', g('cMIn', '')),
  g('cF', cueG('fbd', g('cFIn', ''))),
  g('cD', cueG('dynC', g('cDIn', '')) + g('cDWll', '')),
  g('cS', cueG('secC', g('cSIn', ''))),
  g('cE', g('cEIn', '') + cueG('strain', g('cEStr', '')) + cueG('eLines', g('cELines', ''))),
  g('cK', g('cKIn', '') + cueG('stiffC', g('cKStiff', '')) + cueG('strC', g('cKStr', ''))),
].join('');

// Static paths written with relative line-tos (the helper from the measuring
// film, as in eng.mechanics.tensile): the same points, about a third fewer
// bytes. Each rewrite is read back to prove it exact.
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
const AWHOLE = cam([10, 0, 140], 330);
const ASIDE = cam([42, 0, 166], 200, 168);
const BWHOLE = cam([0, 0, 176], 640, 168);
const BROD = cam([ROD.x, 0, 250], 300, 168);
const CAM = [
  { from: AWHOLE, to: ASIDE, a: 0.3, b: 0.55 },
  { from: ASIDE, to: cam([48, 0, 166], 210, 168), a: 0, b: 0.4 },
  { from: cam([0, 0, 176], 700, 168), to: BWHOLE, a: 0.1, b: 0.4 },
  { from: cam([0, 0, 120], 400, 168), to: cam([0, 0, 58], 170, 168), a: 0.05, b: 0.25 },
  { from: BROD, to: cam([ROD.x, 0, 276], 150, 168), a: 0.12, b: 0.3 },
  { from: BROD, to: cam([ROD.x, 0, 210], 520, 168), a: 0.05, b: 0.4 },
  { from: cam([20, 0, 190], 600, 168), to: cam([0, 0, 120], 500, 168), a: 0.5, b: 0.75 },
];

// ---------------------------------------------------------------- the film
const FOR = 'eng.mechanics.forces';
const STR = 'eng.mechanics.stress';
const DUR = [30, 46, 36, 50, 40, 46, 46];
const C = {
  BP, BP_Z, BOLTS, ARM, ARM_Z, MOT, MX, ROD, RB_Z, RB_X, GIR_Z, COLX,
  WEIGHT, MASS, M0, M1, SPAN, LOAD, DYN, BREAK, SLING, AREA, F_ROD, SIG, E_ST, E_AL, LEN, EPS, DL_ST, DL_AL,
  dur: DUR,
};
const spec = {
  id: 'eng.mechanics.load',
  title: { nl: 'Kracht, moment en spanning', en: 'Force, moment and stress' },
  lessons: [FOR, STR],
  scenes: [
    {
      id: 's1', lesson: FOR, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Kracht en gewicht', en: 'Force and weight' },
      beats: [
        { nl: 'Een motor van {n:50} kg op een wandconsole. Wat doet hij met de muur?', en: 'A {n:50} kg motor on a wall bracket. What does it do to the wall?', cues: ['motor'] },
        { nl: 'Kracht meet je in {t:Newton|newton}, N. Gewicht = massa × {n:9.81}: {n:50} × {n:9.81} = {n:490} N.', en: 'Force is measured in {t:Newton|newtons}, N. Weight = mass × {n:9.81}: {n:50} × {n:9.81} = {n:490} N.', cue: { Newton: 'wArrow' } },
        { nl: 'Vuistregel: {n:100} kg weegt zo’n {n:1} kN, oftewel {n:1000} N.', en: 'Rule of thumb: {n:100} kg weighs about {n:1} kN, or {n:1000} N.', cues: ['wArrow'] },
      ],
    },
    {
      id: 's2', lesson: FOR, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Het moment', en: 'The moment' },
      beats: [
        { nl: 'Een {t:Moment|moment} is een draaiende kracht: kracht × arm. Bij motoren heet het koppel.', en: 'A turning force is called {t:Torque|torque}: force × lever arm, in Nm.', cue: { Moment: 'arm' } },
        { nl: '{n:490} N op {n:0.4} m van de muur: {n:196} Nm. De bovenste bouten vangen dat op als trek.', en: '{n:490} N at {n:0.4} m from the wall: {n:196} Nm. The top bolts take that as tension.', cues: ['bolts'] },
        { nl: 'Schuif de motor naar {n:0.8} m: het moment verdubbelt naar {n:392} Nm. Zelfde gewicht.', en: 'Move the motor out to {n:0.8} m: the torque doubles to {n:392} Nm. Same weight.', cues: ['arm', 'bolts'] },
        { nl: 'Dubbele arm, halve kracht: {n:200} N aan een sleutel van {n:0.25} m geeft {n:50} Nm.', en: 'Double the arm, half the force: {n:200} N on a {n:0.25} m wrench gives {n:50} Nm.', cues: [] },
      ],
    },
    {
      id: 's3', lesson: FOR, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Evenwicht', en: 'Equilibrium' },
      beats: [
        { nl: 'Wat stilhangt is in {t:Evenwicht|evenwicht}: alle krachten en momenten heffen elkaar op.', en: 'What hangs still is in {t:Equilibrium|equilibrium}: all forces and torques balance out.', cue: { Evenwicht: 'fbd' }, cues: ['hang'] },
        { nl: 'Last in het midden: elke steun draagt de helft. {n:6} kN geeft {n:3} kN per stang.', en: 'Load in the middle: each support carries half. {n:6} kN gives {n:3} kN per rod.', cues: ['fbd', 'hang'] },
        { nl: 'Schuif de last naar één steun en die draagt bijna alles. Het totaal blijft gelijk.', en: 'Move the load close to one support and it carries nearly all. The total stays the same.', cues: ['fbd'] },
      ],
    },
    {
      id: 's4', lesson: FOR, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Hoe wordt het belast?', en: 'How is it loaded?' },
      beats: [
        { nl: 'Een {t:Statische belasting|statische belasting} is constant: de kist hangt stil.', en: 'A {t:Static load|static load} is constant: the crate hangs still.', cue: { 'Statische belasting': 'crate' } },
        { nl: 'Een {t:Dynamische belasting|dynamische belasting} verandert in de tijd: een last die afremt, een motor die trilt.', en: 'A {t:Dynamic load|dynamic load} changes over time: a load that stops, a motor that vibrates.', cue: { 'Dynamische belasting': 'dynC' }, cues: ['crate'] },
        { nl: 'Een stoot is een klap. Ontwerpers rekenen met een dynamische factor, vaak {n:1.1} tot {n:2}.', en: 'An impact is a sudden blow. Designers use a dynamic factor, often {n:1.1} to {n:2}.', cues: ['dynC'] },
        { nl: 'De {t:Werklast (WLL)|werklast} staat op het hijsmiddel. Breuklast: {n:4} à {n:7} keer hoger, niet jouw marge.', en: 'The {t:Working load limit (WLL)|working load limit} is on the gear. Breaking load is {n:4} to {n:7} times higher: not your margin.', cue: { 'Werklast (WLL)': 'wll' } },
        { nl: 'Twee stroppen {n:120}° uit elkaar: elke poot draagt de volle last.', en: 'Two sling legs {n:120}° apart: each leg carries the full load.', cues: [] },
      ],
    },
    {
      id: 's5', lesson: STR, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Spanning', en: 'Stress' },
      beats: [
        { nl: 'Hoe zwaar heeft de stang het? {t:Spanning|Spanning} is kracht per oppervlak: F / A.', en: 'How hard is the rod working? {t:Stress|Stress} is force per area: F / A.', cue: { Spanning: 'rod' } },
        { nl: 'Dat oppervlak is de {t:Doorsnede|doorsnede}: zaag recht door. Ø{n:20} mm geeft {n:314} mm².', en: 'That area is the {t:Cross-section|cross-section}: saw straight through. Ø{n:20} mm gives {n:314} mm².', cue: { Doorsnede: 'secC' } },
        { nl: '{n:31.4} kN op {n:314} mm²: {n:31400} / {n:314} = {n:100} MPa. Eén N/mm² is één MPa.', en: '{n:31.4} kN on {n:314} mm²: {n:31400} / {n:314} = {n:100} MPa. One N/mm² is one MPa.', cues: ['secC'] },
        { nl: 'Spanning beslist, niet kracht: dezelfde kracht is onschuldig voor een dikke staaf, fataal voor een dunne.', en: 'Stress decides, not force: the same force is harmless on a thick bar and fatal on a thin one.', cues: ['secC'] },
      ],
    },
    {
      id: 's6', lesson: STR, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'Rek en stijfheid van het materiaal', en: 'Strain and the material’s stiffness' },
      beats: [
        { nl: '{t:Rek|Rek}: uitrekken ten opzichte van de lengte, ΔL / L. {n:0.5} mm op {n:1000} mm is {n:0.0005}.', en: '{t:Strain|Strain}: stretch relative to length, ΔL / L. {n:0.5} mm on {n:1000} mm is {n:0.0005}.', cue: { Rek: 'strain' }, cues: ['rod'] },
        { nl: 'Tot een grens veert metaal terug, als een veer: het elastische gebied.', en: 'Up to a limit, metal springs back like a spring: the elastic range.', cues: ['rod'] },
        { nl: 'Daar geldt spanning = E × rek. De {t:Elasticiteitsmodulus|elasticiteitsmodulus} E is de stijfheid van het materiaal.', en: 'There, stress = E × strain. {t:Young’s modulus|Young’s modulus} E is the stiffness of the material.', cue: { Elasticiteitsmodulus: 'eLines' } },
        { nl: 'Staal, E = {n:210000} MPa: {n:100} / {n:210000} = {n:0.000476}. Over {n:2000} mm is dat {n:0.95} mm.', en: 'Steel, E = {n:210000} MPa: {n:100} / {n:210000} = {n:0.000476}. Over {n:2000} mm that is {n:0.95} mm.', cues: ['strain', 'eLines'] },
        { nl: 'Aluminium, E = {n:70000}: {n:2.86} mm, drie keer zoveel. Kunststof rekt zo’n honderd keer zoveel.', en: 'Aluminium, E = {n:70000}: {n:2.86} mm, three times as much. Plastic stretches about a hundred times as much.', cues: ['strain', 'eLines'] },
      ],
    },
    {
      id: 's7', lesson: STR, level: 2, dur: DUR[6], still: 0.9, title: { nl: 'Stijf of sterk?', en: 'Stiff or strong?' },
      beats: [
        { nl: 'Allebei ruim onder hun vloeigrens: sterk genoeg. Maar aluminium beweegt drie keer zoveel.', en: 'Both well below their yield strength: strong enough. But aluminium moves three times as much.', cues: [] },
        { nl: '{t:Stijfheid|Stijfheid}: hoe weinig het doorbuigt of rekt. {t:Sterkte|Sterkte}: hoeveel last tot het bezwijkt.', en: '{t:Stiffness|Stiffness}: how little it bends or stretches. {t:Strength|Strength}: how much load before it fails.', cue: { Stijfheid: 'stiffC', Sterkte: 'strC' } },
        { nl: 'Hogesterktestaal is veel sterker, maar precies even stijf: dezelfde E.', en: 'High-strength steel is much stronger, but just as stiff: the same E.', cues: ['stiffC', 'strC'] },
        { nl: 'Vorm telt: twee keer zo hoog is acht keer zo stijf. Daarom zijn liggers I-vormig.', en: 'Shape counts: twice as tall is eight times as stiff. That is why beams are I-shaped.', cues: ['beam'] },
        { nl: 'Vraag dus altijd: gaat dit over breken, of over bewegen?', en: 'So always ask: is this about breaking, or about moving?', cues: [] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces both lessons'
// text and their worked examples, so every point of the teach blocks and the
// two examples is said here (checked item by item; see the report in the
// commit). No "/", "×", "=", σ, ε or Δ in the spoken text: units are words
// (newton, newtonmeter, kilonewton, megapascal, vierkante millimeter), "490 ×
// 0,4" is "490 maal 0,4". The Dutch words were checked with espeak-ng phonemes
// through Piper's own bridge (nl_NL-alex): "à" (read as "a grave"),
// "hijsmiddelen" (hijsmidDEElen), "kettingtakel" (kettingtaKEL) and
// "hogesterktestaal" (stress on -staal, schwas as e) are kept out of the Dutch
// narration; "doorsnede" (espeak-ng stresses door-SNE-de; the noun is DOOR-snede)
// has an entry in films/_kit/lexicon.nl.json (2026-11-12 review, heard right by
// films/_kit/voice-ab/wordtest.py), as do newton, newtonmeter and kilonewton.
// Series terms as in eng.mechanics.tensile and eng.mechanics.fatigue: kracht,
// moment, spanning, vloeigrens.
const SAY = [
  [ // s1 force and weight
    { nl: 'Een motor van {n:50} kilo op een console aan de muur. Hoe hard trekt hij aan die muur?',
      en: 'A {n:50} kilo motor on a bracket on the wall. How hard does it pull on that wall?' },
    { nl: 'Kracht, duwen of trekken, meet je in {t:Newton|newton}. Massa is hoeveel materiaal er is, in kilo. Gewicht is de kracht van de zwaartekracht op die massa: massa maal {n:9.81}, voor de motor zo\'n {n:490} newton.',
      en: 'Force, a push or a pull, is measured in {t:Newton|newtons}. Mass is how much material there is, in kilograms. Weight is the force gravity puts on that mass: mass times {n:9.81}, for the motor about {n:490} newtons.' },
    { nl: 'Een kist van {n:100} kilo trekt met zo\'n {n:981} newton: ongeveer {n:1} kilonewton, {n:1000} newton. Belastingen, de krachten die een onderdeel draagt, staan in newton of kilonewton.',
      en: 'A {n:100} kilo crate pulls with about {n:981} newtons: roughly {n:1} kilonewton, {n:1000} newtons. Loads, the forces a part carries, are given in newtons or kilonewtons.' },
  ],
  [ // s2 the moment
    { nl: 'Een last ver van de muur wil de console omlaag draaien. Die draaiende kracht is een {t:Moment|moment}: kracht maal arm, de afstand tot het draaipunt. Bij motoren heet het koppel.',
      en: 'A load far from the wall wants to turn the bracket downwards. That turning force is {t:Torque|torque}: force times lever arm, the distance to the turning point.' },
    { nl: 'Het zwaartepunt zit {n:0.4} meter van de muur: {n:490} maal {n:0.4} is {n:196} newtonmeter. De bovenste bouten vangen dat op als trek, onderin drukt de plaat.',
      en: 'The centre of gravity sits {n:0.4} metres from the wall: {n:490} times {n:0.4} is {n:196} newton-metres. The top bolts take that as tension, a pull; the plate presses at the bottom.' },
    { nl: 'Schuif de motor naar {n:0.8} meter: zelfde gewicht, maar het moment verdubbelt naar {n:392} newtonmeter.',
      en: 'Move the motor out to {n:0.8} metres: same weight, but the torque doubles to {n:392} newton-metres.' },
    { nl: 'Op een sleutel van {n:0.25} meter geeft {n:200} newton {n:50} newtonmeter. Dubbele arm, halve kracht. Bouten haal je aan op een voorgeschreven moment; een tandwielkast ruilt toerental in voor koppel: langzamer eruit, meer koppel.',
      en: 'On a wrench {n:0.25} metres long, {n:200} newtons gives {n:50} newton-metres. Double the arm, half the force. Bolts are tightened to a set torque; a gearbox trades speed for torque: slower out, more torque.' },
  ],
  [ // s3 equilibrium
    { nl: 'Een loopbalk met een takel hangt stil aan twee stangen: {t:Evenwicht|evenwicht}. Alle krachten en momenten heffen elkaar op; zo reken je uit wat elke steun, bout of lager draagt.',
      en: 'A runway beam with a hoist hangs still from two rods: {t:Equilibrium|equilibrium}. All forces and torques balance out; that is how you work out what each support, bolt or bearing carries.' },
    { nl: '{n:6} kilonewton in het midden: elke stang draagt de helft, {n:3} kilonewton, net als een balk op twee steunpunten.',
      en: '{n:6} kilonewtons in the middle: each rod carries half, {n:3} kilonewtons, just like a beam on two supports.' },
    { nl: 'Rij de takel naar rechts: die stang draagt nu bijna alles. Het totaal blijft {n:6} kilonewton; de verdeling verandert.',
      en: 'Run the hoist to the right: that rod now carries nearly all of it. The total stays {n:6} kilonewtons; the split changes.' },
  ],
  [ // s4 how is it loaded?
    { nl: 'Een {t:Statische belasting|statische belasting} is constant, zoals een tank op zijn poten, of deze stilhangende kist.',
      en: 'A {t:Static load|static load} is constant, like a tank on its legs, or this crate hanging still.' },
    { nl: 'Een {t:Dynamische belasting|dynamische belasting} verandert in de tijd: de kist veert na, een pers slaat, een motor trilt. Dan trekt de last harder dan zijn gewicht.',
      en: 'A {t:Dynamic load|dynamic load} changes over time: the crate bounces, a press strikes, a motor vibrates. Then the load pulls harder than its weight.' },
    { nl: 'Een stootbelasting, een plotselinge klap als een vallende last of noodstop, kan een veelvoud van het gewicht zijn. Daarom rekenen ontwerpers met een dynamische factor, vaak {n:1.1} tot {n:2}, naar hoe hard de last stopt of slingert; ook voor onze trillende motor. Weegt iets maar tweehonderd kilo? Vraag hoe het belast wordt.',
      en: 'An impact load, a sudden blow like a dropped load or an emergency stop, can be several times the weight. So designers use a dynamic factor, often {n:1.1} to {n:2}, by how hard the load stops or swings; also for our vibrating motor. Only two hundred kilos? Ask how it is loaded.' },
    { nl: 'Stroppen, sluitingen en takels hebben een {t:Werklast (WLL)|werklast}: de grootste last bij normaal gebruik, op een label of ingeslagen. De breuklast ligt meestal {n:4} tot {n:7} keer hoger; die marge is niet voor jou.',
      en: 'Slings, shackles and hoists carry a {t:Working load limit (WLL)|working load limit}: the most they may lift in normal use, on a tag or stamped on. The breaking load is usually {n:4} to {n:7} times higher; that margin is not yours.' },
    { nl: 'Let ook op de hoek: twee stroppen {n:120} graden uit elkaar dragen elk de volle last. Wie checkte het label en de hoek?',
      en: 'Watch the angle too: two sling legs {n:120} degrees apart each carry the full load. Who checked the tag and the angle?' },
  ],
  [ // s5 stress
    { nl: 'Hoe zwaar heeft een stang het? Dat zegt de {t:Spanning|spanning}: kracht gedeeld door oppervlak. Mechanische spanning, geen elektrische.',
      en: 'How hard is a rod working? The {t:Stress|stress} tells you: force divided by area.' },
    { nl: 'Dat oppervlak is de {t:Doorsnede|doorsnede}: het vlak dat je ziet als je recht doorzaagt. Deze trekstang, alleen op trek belast, is {n:20} millimeter dik: {n:314} vierkante millimeter.',
      en: 'That area is the {t:Cross-section|cross-section}: the surface you see if you saw straight through. This tie rod, which only carries a pull, is {n:20} millimetres thick: {n:314} square millimetres.' },
    { nl: 'Hij draagt {n:31.4} kilonewton: {n:31400} newton gedeeld door {n:314} is {n:100} newton per vierkante millimeter, oftewel {n:100} megapascal.',
      en: 'It carries {n:31.4} kilonewtons: {n:31400} newtons divided by {n:314} is {n:100} newtons per square millimetre, or {n:100} megapascals.' },
    { nl: 'Spanning, niet kracht, beslist of iets bezwijkt: dezelfde kracht is onschuldig voor een dikke staaf en fataal voor een dunne. Ook {n:10} kilonewton op {n:100} vierkante millimeter is {n:100} megapascal.',
      en: 'Stress, not force, decides whether a part fails: the same force is harmless on a thick bar and fatal on a thin one. And {n:10} kilonewtons on {n:100} square millimetres is also {n:100} megapascals.' },
  ],
  [ // s6 strain and E
    { nl: 'De stang wordt ook iets langer. {t:Rek|Rek} is die lengteverandering gedeeld door de lengte: {n:0.5} millimeter op {n:1000} is een rek van {n:0.0005}. In beeld sterk overdreven.',
      en: 'The rod also gets a little longer. {t:Strain|Strain} is that change in length divided by the length: {n:0.5} millimetres on {n:1000} is a strain of {n:0.0005}. On screen, greatly exaggerated.' },
    { nl: 'Tot een grens gedraagt metaal zich als een veer: laat los en het veert terug, het elastische gebied.',
      en: 'Up to a limit, metal behaves like a spring: let go and it springs back, the elastic range.' },
    { nl: 'Daar is spanning E maal rek. E, de {t:Elasticiteitsmodulus|elasticiteitsmodulus}, is de stijfheid van het materiaal: staal zo\'n {n:210000} megapascal, aluminium {n:70000}, veel kunststoffen {n:2000} tot {n:3000}.',
      en: 'There, stress is E times strain. E, {t:Young’s modulus|Young\'s modulus}, is the stiffness of the material: steel about {n:210000} megapascals, aluminium {n:70000}, many plastics {n:2000} to {n:3000}.' },
    { nl: 'Onze stalen stang: {n:100} gedeeld door {n:210000} is een rek van {n:0.000476}; over {n:2000} millimeter {n:0.95} millimeter.',
      en: 'Our steel rod: {n:100} divided by {n:210000} is a strain of {n:0.000476}; over {n:2000} millimetres, {n:0.95} millimetres.' },
    { nl: 'Aluminium rekt {n:2.86} millimeter, drie keer zoveel; kunststof zo\'n honderd keer. Tussen staalsoorten verandert E nauwelijks.',
      en: 'Aluminium stretches {n:2.86} millimetres, three times as much; plastic about a hundred times. Between steel grades, E barely changes.' },
  ],
  [ // s7 stiff or strong
    { nl: 'Bij gewoon staal en gangbaar aluminium blijven beide ruim onder hun vloeigrens, waar blijvend vervormen begint: sterk genoeg. Maar houdt de stang een machine uitgelijnd, dan beweegt aluminium drie keer zoveel.',
      en: 'For mild steel and a common aluminium alloy, both stay well below their yield strength, where permanent bending starts: strong enough. But if the rod holds a machine in line, aluminium moves three times as much.' },
    { nl: '{t:Stijfheid|Stijfheid}: hoe weinig iets doorbuigt of rekt. {t:Sterkte|Sterkte}: hoeveel belasting het aankan voor het blijvend vervormt of breekt.',
      en: '{t:Stiffness|Stiffness}: how little a part bends or stretches. {t:Strength|Strength}: how much load it takes before it bends for good or breaks.' },
    { nl: 'Staal met een hoge sterkte is veel sterker, maar even stijf: dezelfde E. Buigt een frame te ver door, dan helpt dat niet; meer materiaal of een betere vorm wel.',
      en: 'High-strength steel is much stronger, but just as stiff: the same E. If a frame flexes too much, that does not help; more material or a better shape does.' },
    { nl: 'Vorm telt ook: buigstijfheid groeit met de hoogte tot de derde macht: twee keer zo hoog is acht keer zo stijf. Daarom I-liggers, en wint een buis het van een even zware massieve staaf.',
      en: 'Shape counts too: bending stiffness rises with height cubed, so twice as tall is eight times as stiff. Hence I-beams, and a tube beats a solid rod of the same weight.' },
    { nl: 'Een frame dat schudt, een meetklok die uitslaat als iemand op de tafel leunt: te weinig stijfheid. Vraag dus: gaat dit over breken, of over bewegen?',
      en: 'A frame that shakes, a dial gauge that moves when someone leans on the table: too little stiffness. So ask: is this about breaking, or about moving?' },
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
// no symbol the voice would read aloud, and no spoken parenthesis, in the script
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  if (/[/&σεΔ×=°()²à]|MPa|\bN\b|\bNm\b|\bkN\b|\bmm\b/.test(line[lang].replace(/\{[tn]:[^}]*\}/g, ''))) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// card classes as in eng.mechanics.tensile (mt-*), here with the ml- prefix
const css = `
.ml-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.ml-cap{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight)}
[data-cue][data-on] .ml-cap{fill:var(--fp-accent)}
[data-cue][data-on] .ml-card{stroke:var(--fp-accent);fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face))}
.ml-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.ml-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.ml-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.ml-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.ml-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.ml-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.ml-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.ml-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.ml-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ml-ghost{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2 4}
.ml-dot{fill:var(--anatomy-hi)}
.ml-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.ml-acc{fill:var(--fp-accent);stroke:none}
.ml-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.ml-solid{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linejoin:round}
.ml-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.ml-sling{fill:none;stroke:var(--anatomy-hi);stroke-width:.9;stroke-linecap:round}
.ml-hook{fill:none;stroke:var(--anatomy-hi);stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round}
.ml-arrow{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.ml-chain{fill:none;stroke:var(--anatomy-mid);stroke-width:.7;stroke-dasharray:1 .6}
.ml-meter{fill:var(--anatomy-mid)}
.ml-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .ml-line{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .ml-dot{fill:var(--fp-accent)}
[data-cue][data-on] .ml-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .ml-tile{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .ml-solid{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Twee opstellingen. Een betonnen kolom met een wandconsole: een voetplaat met vier ankerbouten, een kokerprofiel als arm met een schaalverdeling, een schoor eronder, en op de arm een motor die van 0,4 naar 0,8 meter van de muur schuift; een pijl toont zijn gewicht, een lijn de arm. Een hal met twee stalen kolommen en een dakligger, met daaronder aan twee trekstangen van 2 meter een loopbalk met een loopkat, een kettingtakel met een werklastplaatje, een haak, twee stroppen en een kist. De stangen rekken overdreven uit, en één wordt doorgezaagd om de doorsnede te tonen. Kaarten, gemarkeerd als voorbeeld of schema, tonen de sommen.',
  en: 'Two set-ups. A concrete pillar with a wall bracket: a base plate with four anchor bolts, a hollow-section arm with a scale, a strut beneath, and on the arm a motor that slides from 0.4 to 0.8 metres from the wall; an arrow shows its weight, a line the lever arm. A hall with two steel columns and a roof girder, and under it, on two tie rods of 2 metres, a runway beam with a trolley, a chain hoist with a load-limit plate, a hook, a two-leg sling and a crate. The rods stretch, exaggerated, and one is sawn through to show its cross-section. Cards, marked as example or schematic, show the sums.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

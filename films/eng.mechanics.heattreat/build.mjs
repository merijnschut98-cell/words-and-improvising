// Dev tool, not shipped. Builds the explainer film "Harden, ontlaten,
// inzetharden / Hardening, tempering, case hardening" for the topic
// Warmtebehandeling en materiaalkeuze of Materialen en sterkte: its level 2
// lesson eng.mechanics.heattreat (Hardheid en warmtebehandeling).
//
//   node films/eng.mechanics.heattreat/build.mjs            build the page
//   node films/eng.mechanics.heattreat/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.mechanics.heattreat.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.mechanics). The plan row serves "heattreat"; that id still exists after
// the topics x levels rebuild (eng.mechanics.heattreat, level 2 of the topic
// choice), so no mapping was needed. The topic's other levels are not served:
// materials (level 1) has its own planned film, designation and selection
// (levels 3 and 4) have none in the plan.
//
// The drawing is a small hardening shop under a crane rail: a pit furnace with
// its lid, its control cabinet and terminal box; an oil quench tank on skids
// with an agitator, a level gauge, a drain valve and a thermometer; a smaller
// tempering furnace with its own controller; and a bench with a Rockwell
// hardness tester (anvil on an elevating screw with a handwheel, indenter under
// the head, a display and a load lever) and a stack of gears. An electric chain
// hoist runs on an I-beam between two posts and carries a stepped shaft: into
// the furnace, out and into the oil, up out of the oil, into the tempering
// furnace. Cards in stage space carry the three indenters and their scales, the
// temperature-time path with the steel's structure beside it (drawn live from
// the same state the shop shows), the quench's side effects, a welded part that
// warps after machining, a gear tooth with its case, and the hardness profile of
// the worked example; every card is labelled "voorbeeld".
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the lesson (the build fails if a value drifts); the {n:...}
// numbers are then checked against the Dutch lesson text by defineFilm.
// Facts checked against:
// - Hardening: steel is heated into the austenite range (for medium-carbon
//   steels about Ac3 + 30 to 50 °C, so roughly 800 to 900 °C), held until it is
//   through, then quenched so fast that the carbon cannot leave the lattice:
//   martensite, hard and brittle (ASM Handbook vol. 4, Heat Treating; Bhadeshia
//   and Honeycombe, Steels). Hardenable from roughly 0,3 % carbon, as the lesson.
// - Quench media: water is the most severe, oil the mildest, a polymer solution
//   in between depending on its concentration (ASM vol. 4A, quenchants); quench
//   cracks start at sharp corners, grooves and sudden section changes; long
//   slender parts are best dipped vertically to limit distortion. Said with
//   "meestal" and "kan".
// - Tempering: usually 150 to 650 °C, soon after the quench; low tempering keeps
//   tools hard, high tempering makes shafts and bolts tough (quench and temper,
//   "veredelen"). An untempered quenched part can crack later (delayed cracking).
// - Annealing: heat and cool slowly (often in the furnace), soft. Stress
//   relieving of steel usually 550 to 650 °C, below the temperature where the
//   structure changes (Ac1, about 720 °C), so it removes stresses only.
// - Case hardening: carburising about 900 °C (900 to 950 in practice) in a
//   carbon-rich gas, then quench and a low temper; nitriding about 500 °C, no
//   quench, little distortion; induction hardening: a coil with alternating
//   current heats only the skin in seconds, then a spray quench.
// - Hardness: Brinell presses a hard ball (now tungsten carbide, HBW) and
//   measures the dent's diameter; Vickers a square diamond pyramid, measuring
//   the diagonals; Rockwell C a 120° diamond cone, measuring depth (ISO 6506,
//   6507, 6508). Conversions between the scales are tables (ISO 18265) and
//   approximate. The worked example: 58–62 HRC and 0,8–1,2 mm case required,
//   48 HRC measured.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const HB_MILD = 120;
const HRC_TOOL = 60;
const C_MIN = 0.3;
const HARDEN = [800, 900];
const TEMPER = [150, 650];
const RELIEF = [550, 650];
const CARB = 900;
const NITR = 500;
const SPEC = { hrc: [58, 62], case: [0.8, 1.2] };
const MEAS = 48;
assert(HARDEN[0] < HARDEN[1] && TEMPER[1] < HARDEN[0], 'tempering stays below the hardening range');
assert(RELIEF[0] >= TEMPER[0] && RELIEF[1] < HARDEN[0], 'stress relieving sits below the structure change');
assert(NITR < CARB && CARB <= HARDEN[1], 'nitriding is cooler than carburising');
assert(MEAS < SPEC.hrc[0], '48 HRC misses the 58–62 HRC requirement');
assert(SPEC.case[0] < SPEC.case[1], 'a case depth range');
// the temperature-time path (illustrative): times in 0..1 of the card's width
const PATH = {
  harden: [[0, 20], [0.05, 60], [0.22, 850], [0.42, 850], [0.445, 160], [0.47, 40], [0.52, 30]],
  temper: [[0.52, 30], [0.6, 600], [0.82, 600], [1, 40]],
  anneal: [[0, 20], [0.2, 850], [0.36, 850], [1, 120]],
  relief: [[0, 20], [0.18, 600], [0.42, 600], [0.9, 80]],
};
assert(PATH.harden[2][1] >= HARDEN[0] && PATH.harden[2][1] <= HARDEN[1], 'the card holds inside 800–900 °C');
assert(PATH.temper[1][1] >= TEMPER[0] && PATH.temper[1][1] <= TEMPER[1], 'the card tempers inside 150–650 °C');
assert(PATH.relief[1][1] >= RELIEF[0] && PATH.relief[1][1] <= RELIEF[1], 'the card relieves inside 550–650 °C');

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the crane rail, +y toward the
// viewer. The floor is z = 0.
const W = 640;
const H = 400;
const HF = { x: -118, y: 0, R: 26, top: 62, open: 14, lid: 17 };
const TF = { x: 14, y: 0, R: 20, top: 51, open: 11, lid: 14 };
const QT = { plan: { x: -72, y: -24, w: 52, d: 48, r: 2 }, z0: 4, top: 50, rim: 52, oil: 47, cx: -46 };
const BEAM_Z = 140;
const POSTS = [-169, 55];
const HOIST_Z = 124; // the hoist body's underside: the chain leaves here
const WORK = { len: 40, segs: [[0, 22, 3], [22, 32, 4.4], [32, 37, 2.4]], eye: 1.6 };
const BENCH = { x: 64, y: -20, w: 66, d: 36, r: 1, top: 75 };
const AXIS = [83, 6]; // the tester's indenter axis
const IND = { z0: 107, z1: 118 }; // the indenter at rest, under the head
const ANVIL_Z = 92;
const GEAR = { x: 114, y: 2, R: 8, teeth: 16 };

const FIT = [
  ...k.boxCorners({ x: -176, y: -24, w: 306, d: 58 }, 0, 0),
  ...k.boxCorners({ x: -172, y: -3, w: 230, d: 6 }, BEAM_Z + 6, BEAM_Z + 6),
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
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const planeX = (x) => k.sideMatrix([x, 0], 0, P, 'right');
const flatRect = (x0, z0, x1, z1, r, steps = 4) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const box = (plan, z0, z1, style = {}, { steps = 3, bevel = 0, inner = '', extra = '' } = {}) => S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const post = (cx, cy, r, z0, z1, style = {}, { steps = 28, bevel = 0, inner = '', extra = '' } = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const disc = (F, s0, s1, r, style = {}, { steps, extra = '' } = {}) => S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style }) + extra;
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const ell = (cx, cy, r, z, steps = 36) => k.pathOf(k.circleRing(cx, cy, r, steps).map(([x, y]) => at([x, y, z])), true);
// a face plate on the face y = fy: a card with three printed rule lines and four screws
const plate = (fy, x0, z0, x1, z1) => [
  `<g transform="${planeOf(fy)}">`,
  `<path class="mt-card" d="${flatRect(x0, z0, x1, z1, 0.5)}"/>`,
  `<path class="iso-line" data-tone="lo" data-free="" d="${[0.3, 0.5, 0.7].map((f, i) => `M${(x0 + 1.2).toFixed(1)} ${(-(z1 - (z1 - z0) * f)).toFixed(1)}H${(x1 - 1.2 - i * (x1 - x0) * 0.18).toFixed(1)}`).join('')}"/>`,
  '</g>',
  Dt([[x0 + 0.7, fy, z0 + 0.7], [x1 - 0.7, fy, z0 + 0.7], [x0 + 0.7, fy, z1 - 0.7], [x1 - 0.7, fy, z1 - 0.7]].map(at), { size: 0.38 }),
].join('');
// a round furnace: plinth, shell with hoop bands, top flange with bolts, the dark opening
function furnace(F, { plinth, flange }) {
  const out = [];
  out.push(`<path class="iso-halo" d="${ell(F.x, F.y, F.R + 6, 0, 40)}"/>`);
  out.push(post(F.x, F.y, F.R + 3, 0, 4, { tone: 'lo' }, { steps: 32, bevel: 0.4, extra: Dt(Array.from({ length: 8 }, (_, i) => i * Math.PI / 4 + 0.2).filter((a) => Math.cos(a) * 0.41 + Math.sin(a) * 0.91 > 0.2).map((a) => at([F.x + (F.R + 1.6) * Math.cos(a), F.y + (F.R + 1.6) * Math.sin(a), 4])), { size: 0.45 }) }));
  const bands = [plinth, (plinth + flange) / 2].map((z) => L(k.sideArc(F.x, F.y, F.R, z + 6, P, 28), { tone: 'faint' })).join('');
  out.push(post(F.x, F.y, F.R, 4, flange, { tone: 'mid' }, { steps: 32, inner: bands }));
  // hoop bands as thin proud rings
  for (const z of [14, flange - 12]) out.push(post(F.x, F.y, F.R + 0.7, z, z + 2, { tone: 'mid' }, { steps: 32 }));
  out.push(post(F.x, F.y, F.R + 2, flange, F.top, { tone: 'mid' }, { steps: 32, bevel: 0.4 }));
  const bolts = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2 + 0.13).map((a) => at([F.x + (F.R + 0.4) * Math.cos(a), F.y + (F.R + 0.4) * Math.sin(a), F.top]));
  out.push(Dt(bolts, { size: 0.42 }));
  // the opening: refractory ring, then the dark well
  out.push(`<path class="mt-brick" d="${ell(F.x, F.y, F.open + 4, F.top, 40)}"/>`);
  out.push(L(ell(F.x, F.y, F.open + 4, F.top, 40), { tone: 'faint' }));
  out.push(`<path class="mt-well" d="${ell(F.x, F.y, F.open, F.top, 40)}"/>`);
  out.push(L(ell(F.x, F.y, F.open, F.top, 40), { tone: 'lo' }));
  return out.join('');
}
// a lid at rest on its furnace: plate, raised boss, lifting eye
function lid(F) {
  const z = F.top;
  return post(F.x, F.y, F.lid, z, z + 3.2, { tone: 'mid' }, { steps: 32, bevel: 0.5, extra: Dt(Array.from({ length: 6 }, (_, i) => i * Math.PI / 3 + 0.5).map((a) => at([F.x + (F.lid - 1.6) * Math.cos(a), F.y + (F.lid - 1.6) * Math.sin(a), z + 3.2])), { size: 0.38 }) })
    + post(F.x, F.y, F.lid * 0.45, z + 3.2, z + 4.6, { tone: 'mid' }, { steps: 28, bevel: 0.3 })
    + disc(frameX([F.x - 1.2, F.y, z + 6.4]), 0, 2.4, 1.6, { tone: 'hi' }, { steps: 20 })
    + post(F.x, F.y, 0.6, z + 4.6, z + 5, { tone: 'hi', crease: 'none' }, { steps: 12 });
}

// ---------------------------------------------------------------- parts, back to front
const parts = [];
// the left post of the crane rail (its beam is drawn last, above everything)
const railPost = (x) => box({ x: x - 4, y: -6, w: 8, d: 12, r: 0.6 }, 0, 1.4, { tone: 'lo' }, { steps: 2, extra: Dt(k.corners({ x: x - 4, y: -6, w: 8, d: 12 }, 1.2).map(([px, py]) => at([px, py, 1.4])), { size: 0.42 }) })
  + box({ x: x - 2.6, y: -2.6, w: 5.2, d: 5.2, r: 0.4 }, 1.4, BEAM_Z, { tone: 'mid' }, { steps: 2, inner: L(k.sideSeam({ x: x - 2.6, y: -2.6, w: 5.2, d: 5.2, r: 0.4 }, BEAM_Z - 10, P, 2), { tone: 'faint' }) });
parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan({ x: POSTS[0] - 4, y: -6, w: 8, d: 12, r: 0.6 }, -2), 0, 2, P)}"/>`);
parts.push(railPost(POSTS[0]));

// ---------------------------------------------------------------- the hardening furnace
parts.push(cueG('furnace', furnace(HF, { plinth: 4, flange: 58 })));
{
  // the heater terminal box on the front, with a conduit gland
  const tb = { x: -125, y: 24.2, w: 14, d: 4.6, r: 0.6 };
  parts.push(box(tb, 26, 38, { tone: 'mid' }, { steps: 2, bevel: 0.3, extra: plate(tb.y + tb.d, -123.6, 28.6, -112.4, 35.6) }));
  parts.push(disc(frameZ([-114, 26.5, 26]), -2.2, 0, 1.1, { tone: 'mid' }, { steps: 16 }));
  // the thermocouple: a sheathed rod through the flange with its head
  parts.push(post(-103, -12, 0.7, HF.top, HF.top + 8, { tone: 'hi', crease: 'none' }, { steps: 12 }));
  parts.push(box({ x: -104.6, y: -13.6, w: 3.2, d: 3.2, r: 0.8 }, HF.top + 8, HF.top + 11, { tone: 'mid' }, { steps: 3, extra: Dt([at([-103, -12, HF.top + 11])], { size: 0.4, tone: 'hi' }) }));
}
parts.push(cueG('furnace', g('lidH', lid(HF))));

// ---------------------------------------------------------------- the control cabinet
{
  const cb = { x: -162, y: 16, w: 16, d: 14, r: 0.8 };
  const fy = cb.y + cb.d;
  const face = [
    `<g transform="${planeOf(fy)}">`,
    `<path class="mt-well" d="${flatRect(-159.4, 50, -148.6, 57, 0.5)}"/>`,
    `<path class="iso-line" data-tone="lo" d="${flatRect(-159.4, 50, -148.6, 57, 0.5)}"/>`,
    `<path class="mt-screen" d="${flatRect(-158.6, 51, -149.4, 56, 0.3)}"/>`,
    `<path class="iso-line" data-tone="faint" d="M-160.4 47H-147.6M-160.4 8H-147.6"/>`,
    '</g>',
    Dt([[-157, fy, 43], [-154, fy, 43], [-151, fy, 43]].map(at), { size: 0.75, tone: 'hi' }),
    plate(fy, -159.4, 22, -148.6, 30),
  ].join('');
  parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(cb, -2), 0, 2, P)}"/>`);
  parts.push(box(cb, 0, 64, { tone: 'mid' }, { steps: 3, bevel: 0.5, inner: L(k.sideSeam(cb, 60, P, 3), { tone: 'faint' }), extra: face }));
  // the door handle and a mains switch on the side face
  parts.push(disc(frameY([-147.6, fy, 36]), 0, 1.4, 0.9, { tone: 'mid' }, { steps: 14 }));
  parts.push(box({ x: -148.4, y: fy, w: 1.2, d: 1.6, r: 0.3 }, 31, 41, { tone: 'hi' }, { steps: 2 }));
  // the cable to the terminal box, on a hanger
  parts.push(k.wireSvg(at([-146, 26, 58]), at([-114, 27.8, 26]), { via: [at([-140, 30, 70]), at([-122, 31, 50])], tone: 'lo', size: 1.1 }));
}

// ---------------------------------------------------------------- the quench tank
{
  const p = QT.plan;
  parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(p, -4), 0, 2, P)}"/>`);
  for (const y of [p.y + 3, p.y + p.d - 9]) parts.push(box({ x: p.x - 3, y, w: p.w + 6, d: 6, r: 0.5 }, 0, QT.z0, { tone: 'lo' }, { steps: 2 }));
  const fy = p.y + p.d;
  const fx = p.x + p.w;
  const face = [
    // the level gauge: a glass slot with the oil line
    `<g transform="${planeOf(fy)}">`,
    `<path class="mt-well" d="${flatRect(-66, 14, -62, 44, 1.2)}"/>`,
    `<path class="mt-oilside" d="${flatRect(-65.4, 14.6, -62.6, QT.oil - 4, 0.9)}"/>`,
    `<path class="iso-line" data-tone="lo" d="${flatRect(-66, 14, -62, 44, 1.2)}"/>`,
    `<path class="iso-line" data-tone="mid" d="M-67.4 ${-(QT.oil - 4)}H-60.6"/>`,
    '</g>',
    Dt([[-64, fy, 12.4], [-64, fy, 45.6]].map(at), { size: 0.45 }),
    plate(fy, -54, 30, -38, 40),
  ].join('');
  const side = [
    `<g transform="${planeX(fx)}">`,
    `<circle class="mt-card" cx="0" cy="${-34}" r="4.2"/>`,
    `<path class="iso-line" data-tone="hi" d="M0 -34L2.6 -36.2"/>`,
    `<path class="iso-line" data-tone="lo" d="M-3 -34H-2.2M0 -37H0 -37.8M3 -34H2.2"/>`,
    '</g>',
    Dt([at([fx, 0, 34])], { size: 0.5, tone: 'hi' }),
  ].join('');
  parts.push(cueG('tank', box(p, QT.z0, QT.top, { tone: 'mid' }, { steps: 4, bevel: 0.6, inner: L(k.sideSeam(p, 12, P, 4), { tone: 'faint' }) + L(k.sideSeam(p, 30, P, 4), { tone: 'faint' }), extra: face + side })));
  // the rim flange and the oil seen through the opening
  const rim = k.insetPlan(p, -1.5);
  const inner = k.insetPlan(p, 2.2);
  const openD = k.planOutline(inner, QT.rim, P, 4);
  const oilD = k.planOutline(inner, QT.oil, P, 4);
  parts.push(cueG('tank', box(rim, QT.top, QT.rim, { tone: 'mid' }, { steps: 4, bevel: 0.4 })
    + `<clipPath id="htOil"><path d="${openD}"/></clipPath>`
    + `<path class="mt-well" d="${openD}"/>`
    + `<path class="mt-oil" clip-path="url(#htOil)" d="${oilD}"/>`
    + L(openD, { tone: 'lo' })
    + Dt(k.corners(rim, 2.4).map(([x, y]) => at([x, y, QT.rim])), { size: 0.42 })));
  // the drain valve: a stub, the body and a handwheel facing the viewer
  parts.push(disc(frameY([-30, fy, 9]), 0, 2.6, 1.6, { tone: 'mid' }, { steps: 18 }));
  parts.push(box({ x: -32.4, y: fy + 2.6, w: 4.8, d: 3.4, r: 0.8 }, 6.6, 11.4, { tone: 'mid' }, { steps: 3 }));
  parts.push(post(-30, fy + 4.3, 0.5, 11.4, 14, { tone: 'hi', crease: 'none' }, { steps: 10 }));
  parts.push(post(-30, fy + 4.3, 3, 14, 14.8, { tone: 'hi' }, { steps: 28, extra: L(k.ring(-30, fy + 4.3, 1.8, 14.8, P, 24), { tone: 'faint' }) + Dt([at([-30, fy + 4.3, 14.8])], { size: 0.45, tone: 'hi' }) }));
  // the agitator: a bracket on the rim, its motor with fins and a terminal box
  const br = { x: -36, y: -23, w: 14, d: 10, r: 0.6 };
  parts.push(box(br, QT.rim, QT.rim + 1.6, { tone: 'lo' }, { steps: 2, extra: Dt(k.corners(br, 1.4).map(([x, y]) => at([x, y, QT.rim + 1.6])), { size: 0.4 }) }));
  const ribs = [0, 1, 2, 3].map((i) => L(k.sideArc(-29, -18, 4.6, QT.rim + 5 + i * 2.2, P, 20), { tone: 'faint' })).join('');
  parts.push(post(-29, -18, 4.6, QT.rim + 1.6, QT.rim + 14, { tone: 'mid' }, { steps: 32, inner: ribs }));
  parts.push(post(-29, -18, 3.4, QT.rim + 14, QT.rim + 16, { tone: 'mid' }, { steps: 28, bevel: 0.3, extra: Dt([at([-29, -18, QT.rim + 16])], { size: 0.4, tone: 'hi' }) }));
  parts.push(box({ x: -26.4, y: -15.4, w: 4, d: 4.4, r: 0.5 }, QT.rim + 6, QT.rim + 10, { tone: 'mid' }, { steps: 2 }));
}

// ---------------------------------------------------------------- the tempering furnace
parts.push(cueG('temper', furnace(TF, { plinth: 4, flange: 48 })));
{
  const cb = { x: 7, y: 19.2, w: 14, d: 4.6, r: 0.6 };
  const fy = cb.y + cb.d;
  parts.push(cueG('temper', box(cb, 26, 40, { tone: 'mid' }, { steps: 2, bevel: 0.3, extra: [
    `<g transform="${planeOf(fy)}">`,
    `<path class="mt-well" d="${flatRect(8.8, 33, 19.2, 38.4, 0.4)}"/>`,
    `<path class="mt-screen" d="${flatRect(9.6, 33.8, 18.4, 37.6, 0.3)}"/>`,
    `<path class="iso-line" data-tone="lo" d="${flatRect(8.8, 33, 19.2, 38.4, 0.4)}"/>`,
    '</g>',
    Dt([[10.6, fy, 29.4], [14, fy, 29.4], [17.4, fy, 29.4]].map(at), { size: 0.6, tone: 'hi' }),
  ].join('') })));
  parts.push(post(26, -9, 0.6, TF.top, TF.top + 7, { tone: 'hi', crease: 'none' }, { steps: 12 }));
  parts.push(box({ x: 24.6, y: -10.4, w: 2.8, d: 2.8, r: 0.7 }, TF.top + 7, TF.top + 9.6, { tone: 'mid' }, { steps: 3 }));
}
parts.push(cueG('temper', g('lidT', lid(TF))));
parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan({ x: POSTS[1] - 4, y: -6, w: 8, d: 12, r: 0.6 }, -2), 0, 2, P)}"/>`);
parts.push(railPost(POSTS[1]));

// ---------------------------------------------------------------- the bench with the hardness tester and the gears
{
  const B = BENCH;
  parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(B, -3), 0, 2, P)}"/>`);
  const legs = k.corners(B, 2.4);
  for (const [x, y] of legs.slice(0, 2)) parts.push(box({ x: x - 1.6, y: y - 1.6, w: 3.2, d: 3.2, r: 0.3 }, 0, B.top - 4, { tone: 'lo' }, { steps: 2 }));
  parts.push(box(k.insetPlan(B, 1.4), 20, 22, { tone: 'lo' }, { steps: 2, extra: L(k.planOutline(k.insetPlan(B, 4), 22, P, 2), { tone: 'faint' }) }));
  for (const [x, y] of legs.slice(2)) parts.push(box({ x: x - 1.6, y: y - 1.6, w: 3.2, d: 3.2, r: 0.3 }, 0, B.top - 4, { tone: 'lo' }, { steps: 2 }));
  parts.push(box(k.insetPlan(B, 1), B.top - 6, B.top - 4, { tone: 'lo' }, { steps: 2 }));
  parts.push(box(B, B.top - 4, B.top, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: L(k.planOutline(k.insetPlan(B, 3), B.top, P, 2), { tone: 'faint' }) }));
  // the tester: base, rear column, handwheel and elevating screw, anvil, sample, indenter, head
  const bz = B.top;
  const base = { x: 70, y: -12, w: 26, d: 22, r: 1.5 };
  parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(base, -1.5), bz, 1, P)}"/>`);
  parts.push(box(base, bz, bz + 8, { tone: 'mid' }, { steps: 3, bevel: 0.5, extra: plate(base.y + base.d, 72.6, bz + 2, 79.4, bz + 6) + L(k.planOutline(k.insetPlan(base, 1.6), bz + 8, P, 3), { tone: 'faint' }) }));
  const col = { x: 72, y: -12, w: 22, d: 9, r: 1 };
  parts.push(box(col, bz + 8, bz + 43, { tone: 'mid' }, { steps: 3, bevel: 0.4, inner: L(k.sideSeam(col, bz + 30, P, 3), { tone: 'faint' }) }));
  const [ax, ay] = AXIS;
  parts.push(post(ax, ay, 4.2, bz + 8, bz + 9.4, { tone: 'mid' }, { steps: 28 }));
  parts.push(post(ax, ay, 7.6, bz + 9.4, bz + 10.6, { tone: 'hi' }, { steps: 40, extra: L(k.ring(ax, ay, 5.8, bz + 10.6, P, 32), { tone: 'faint' }) + Dt([0, 1, 2, 3, 4, 5].map((i) => at([ax + 6.8 * Math.cos(i * Math.PI / 3), ay + 6.8 * Math.sin(i * Math.PI / 3), bz + 10.6])), { size: 0.4 }) }));
  parts.push(post(ax, ay, 2, bz + 10.6, ANVIL_Z, { tone: 'mid', crease: 'none' }, { steps: 20, inner: [0, 1, 2, 3].map((i) => L(k.sideArc(ax, ay, 2, bz + 11.6 + i * 1.3, P, 12), { tone: 'faint' })).join('') }));
  parts.push(post(ax, ay, 5, ANVIL_Z, ANVIL_Z + 2, { tone: 'mid' }, { steps: 32, bevel: 0.3 }));
  // the test block (scene 1) or a gear slice (scene 7) on the anvil
  parts.push(g('blk', cueG('sample', post(ax, ay, 4, ANVIL_Z + 2, ANVIL_Z + 4.6, { tone: 'hi' }, { steps: 32, bevel: 0.3, extra: Dt([at([ax + 2, ay + 1.2, ANVIL_Z + 4.6]), at([ax - 1.6, ay + 1.8, ANVIL_Z + 4.6])], { size: 0.35, tone: 'lo' }) }))));
  parts.push(g('smp', cueG('sample', g('smpS', '')), ' style="display:none"'));
  parts.push(cueG('indenter', g('ind', post(ax, ay, 2.4, IND.z0 + 4, IND.z1, { tone: 'mid' }, { steps: 24, bevel: 0.2 })
    + post(ax, ay, 1.3, IND.z0 + 1.2, IND.z0 + 4, { tone: 'hi' }, { steps: 20 })
    + post(ax, ay, 0.5, IND.z0, IND.z0 + 1.2, { tone: 'hi', crease: 'none' }, { steps: 12 }))));
  const head = { x: 71, y: -12, w: 24, d: 24, r: 2 };
  const hy = head.y + head.d;
  parts.push(box(head, bz + 43, bz + 55, { tone: 'mid' }, { steps: 4, bevel: 0.6, inner: L(k.sideSeam(head, bz + 46, P, 4), { tone: 'faint' }), extra: [
    `<g transform="${planeOf(hy)}">`,
    `<path class="mt-well" d="${flatRect(73.4, bz + 48, 86.6, bz + 53.4, 0.5)}"/>`,
    `<path class="mt-screen" d="${flatRect(74.2, bz + 48.8, 85.8, bz + 52.6, 0.3)}"/>`,
    `<path class="iso-line" data-tone="lo" d="${flatRect(73.4, bz + 48, 86.6, bz + 53.4, 0.5)}"/>`,
    '</g>',
    Dt([[89.4, hy, bz + 51.8], [92.2, hy, bz + 51.8]].map(at), { size: 0.6, tone: 'hi' }),
    L(k.planOutline(k.insetPlan(head, 2), bz + 55, P, 4), { tone: 'faint' }),
  ].join('') }));
  // the load lever on the right side of the head, with its ball knob
  parts.push(disc(frameX([95, -2, bz + 49]), 0, 1.4, 1.6, { tone: 'mid' }, { steps: 18 }));
  parts.push(disc(frameX([96.4, -2, bz + 49]), 0, 9, 0.6, { tone: 'hi', crease: 'none' }, { steps: 12 }));
  parts.push(post(105.4, -2, 1.5, bz + 47.6, bz + 50.4, { tone: 'hi' }, { steps: 20, bevel: 0.6 }));
  // a stack of two carburised gears on the bench
  parts.push(`<path class="iso-halo" d="${ell(GEAR.x, GEAR.y, GEAR.R + 1.5, bz, 30)}"/>`);
  parts.push(cueG('gear', g('gearS', '')));
}

// ---------------------------------------------------------------- the I-beam, the hoist and the work
{
  const x0 = POSTS[0] - 3;
  const w = POSTS[1] - POSTS[0] + 6;
  parts.push(box({ x: POSTS[0] - 3.4, y: -3.4, w: 6.8, d: 6.8, r: 0.4 }, BEAM_Z - 3, BEAM_Z, { tone: 'mid' }, { steps: 2 }));
  parts.push(box({ x: POSTS[1] - 3.4, y: -3.4, w: 6.8, d: 6.8, r: 0.4 }, BEAM_Z - 3, BEAM_Z, { tone: 'mid' }, { steps: 2 }));
  parts.push(box({ x: x0, y: -3, w, d: 6, r: 0.2 }, BEAM_Z, BEAM_Z + 1.2, { tone: 'mid' }, { steps: 1 }));
  parts.push(box({ x: x0, y: -0.6, w, d: 1.2, r: 0 }, BEAM_Z + 1.2, BEAM_Z + 4.8, { tone: 'mid', crease: 'none' }, { steps: 1 }));
  parts.push(box({ x: x0, y: -3, w, d: 6, r: 0.2 }, BEAM_Z + 4.8, BEAM_Z + 6, { tone: 'mid' }, { steps: 1, extra: Dt([-140, -90, -40, 10].map((x) => at([x, 2.2, BEAM_Z + 6])), { size: 0.4 }) }));
  for (const x of [x0 + 2, x0 + w - 4]) parts.push(box({ x, y: -3, w: 2, d: 6, r: 0.2 }, BEAM_Z - 2.4, BEAM_Z, { tone: 'lo' }, { steps: 1 }));
  // the hoist, built at x = 0 and moved along the rail: trolley plates with
  // wheels, the hoist body with its motor and gear cover, a chain bag
  const hv = [];
  hv.push(box({ x: -6, y: -4.6, w: 12, d: 1.2, r: 0.2 }, BEAM_Z - 6, BEAM_Z + 3.4, { tone: 'mid' }, { steps: 1 }));
  hv.push(box({ x: -5, y: -3, w: 10, d: 6, r: 1 }, BEAM_Z - 8, BEAM_Z - 6, { tone: 'mid' }, { steps: 2 }));
  hv.push(box({ x: -5.6, y: -4, w: 11.2, d: 8, r: 1.6 }, HOIST_Z, BEAM_Z - 8, { tone: 'mid' }, { steps: 3, bevel: 0.4, extra: plate(4, -3.4, HOIST_Z + 3, 3.4, HOIST_Z + 9) }));
  hv.push(disc(frameX([5.6, 0, HOIST_Z + 6]), 0, 1, 3.6, { tone: 'mid' }, { steps: 28 }));
  hv.push(disc(frameX([6.6, 0, HOIST_Z + 6]), 0, 6, 3, { tone: 'mid' }, { steps: 28, extra: '' }));
  hv.push(disc(frameX([12.6, 0, HOIST_Z + 6]), 0, 0.8, 2.4, { tone: 'hi' }, { steps: 24 }));
  hv.push(disc(frameX([-5.6, 0, HOIST_Z + 6]), -2.4, 0, 3.4, { tone: 'mid' }, { steps: 28 }));
  for (const x of [-3.4, 3.4]) hv.push(disc(frameY([x, 3.4, BEAM_Z + 2.4]), 0, 1, 1.8, { tone: 'hi' }, { steps: 18 }));
  hv.push(box({ x: -6, y: 3.4, w: 12, d: 1.2, r: 0.2 }, BEAM_Z - 6, BEAM_Z + 3.4, { tone: 'mid' }, { steps: 1, extra: Dt([[-4, 4.6, BEAM_Z - 3], [4, 4.6, BEAM_Z - 3], [-4, 4.6, BEAM_Z + 1.6], [4, 4.6, BEAM_Z + 1.6]].map(at), { size: 0.4 }) }));
  // the pendant cable with its control box hangs beside the body
  hv.push(k.wireSvg(at([-5.6, 2, HOIST_Z + 2]), at([-9, 3, HOIST_Z - 30]), { tone: 'lo', size: 0.9 }));
  hv.push(box({ x: -11, y: 1.6, w: 4, d: 3, r: 0.8 }, HOIST_Z - 38, HOIST_Z - 30, { tone: 'mid' }, { steps: 3, extra: Dt([[-9, 4.6, HOIST_Z - 33], [-9, 4.6, HOIST_Z - 35.4]].map(at), { size: 0.5, tone: 'hi' }) }));
  parts.push(g('hoist', hv.join('')));
  parts.push(cueG('work', g('work', '')));
  parts.push(g('fx', ''));
}
const world = parts.join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const hud = [
  g('scales', g('scIn', '') + cueG('ballC', g('scBall', '')) + cueG('pyrC', g('scPyr', '')) + cueG('coneC', g('scCone', '')) + g('scChips', '')),
  g('path', g('ptBase', '') + g('ptBands', '') + cueG('annealC', g('ptLine', '')) + cueG('stressC', g('ptLine2', '')) + g('ptGrain', '') + g('ptMeter', '')),
  g('warp', g('wpIn', '')),
  g('frame', cueG('stressC', g('frIn', ''))),
  g('case', cueG('caseC', g('csTooth', '')) + g('csTiles', '')),
  g('prof', g('pfIn', '')),
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
const TESTER = [AXIS[0], AXIS[1], 100];
const LEFT = 108;
const CAM = [
  { from: cam([-40, 0, 70], 640), to: cam(TESTER, 210, LEFT), a: 0.04, b: 0.3 },
  { from: cam([-118, 0, 66], 270, LEFT), to: cam([-46, 0, 64], 270, LEFT), a: 0.6, b: 0.7 },
  { from: cam([-46, 0, 74], 240, LEFT), to: cam([-46, 0, 72], 220, LEFT), a: 0, b: 1 },
  { from: cam([-46, 0, 72], 260, LEFT), to: cam([14, 0, 64], 250, LEFT), a: 0, b: 0.1 },
  { from: cam([14, 0, 64], 250, LEFT), to: cam([-118, 0, 66], 260, LEFT), a: 0, b: 0.3 },
  { from: cam([-118, 0, 66], 260, LEFT), to: cam([GEAR.x - 4, GEAR.y, 86], 200, LEFT), a: 0, b: 0.25 },
  { from: cam([GEAR.x - 4, GEAR.y, 86], 200, LEFT), to: cam(TESTER, 190, LEFT), a: 0, b: 0.3 },
];

// ---------------------------------------------------------------- the film
const HT = 'eng.mechanics.heattreat';
const spec = {
  id: 'eng.mechanics.heattreat',
  title: { nl: 'Harden, ontlaten, inzetharden', en: 'Hardening, tempering, case hardening' },
  lessons: [HT],
  scenes: [
    {
      id: 's1', lesson: HT, level: 2, title: { nl: 'Hoe hard is het?', en: 'How hard is it?' },
      beats: [
        { nl: '{t:Hardheid|Hardheid}: hoe goed een materiaal weerstand biedt tegen indrukken.', en: '{t:Hardness|Hardness}: how well a material resists being dented.', cue: { Hardheid: 'indenter' }, cues: ['sample'] },
        { nl: 'Brinell (HB) drukt een kogel in, Vickers (HV) een diamanten piramide, Rockwell C (HRC) een kegel.', en: 'Brinell (HB) presses in a ball, Vickers (HV) a diamond pyramid, Rockwell C (HRC) a cone.', cues: ['ballC', 'pyrC', 'coneC'] },
        { nl: 'Gewoon constructiestaal zit rond {n:120} HB; gehard gereedschapsstaal op {n:60} HRC of meer.', en: 'Mild steel is about {n:120} HB; a hardened tool steel {n:60} HRC or more.', cues: [], read: { nl: '{n:120} HB · {n:60} HRC', en: '{n:120} HB · {n:60} HRC' } },
        { nl: 'Harder is meestal sterker en slijtvaster. De meting is snel en goedkoop: een vaste ingangscontrole.', en: 'Harder is usually stronger and more wear resistant. The test is quick and cheap: a standard incoming check.', cues: ['indenter'] },
      ],
    },
    {
      id: 's2', lesson: HT, level: 2, title: { nl: 'Harden: verhitten en afschrikken', en: 'Hardening: heat, then quench' },
      beats: [
        { nl: 'Staal met genoeg koolstof, ruwweg {n:0.3}% of meer, kun je harden. De as gaat de oven in.', en: 'Steel with enough carbon, roughly {n:0.3}% or more, can be hardened. The shaft goes into the furnace.', cues: ['work', 'furnace'] },
        { nl: 'Bij {n:800} à {n:900} °C verandert de structuur binnenin: het staal wordt austeniet.', en: 'At {n:800} to {n:900} °C the structure inside changes: the steel turns to austenite.', cues: ['furnace'], read: { nl: '{n:800}–{n:900} °C', en: '{n:800}–{n:900} °C' } },
        { nl: '{t:Afschrikken|Afschrikken}: heel snel afkoelen, in water, olie of een polymeeroplossing.', en: '{t:Quenching|Quenching}: cooling very fast, in water, oil or a polymer solution.', cue: { Afschrikken: 'tank' }, cues: ['work'], read: { nl: 'oven → oliebad', en: 'furnace → oil' } },
        { nl: 'Afgeschrikt staal is heel hard, maar ook bros: het breekt eerder dan dat het buigt.', en: 'Quenched steel is very hard, but also brittle: it breaks rather than bends.', cues: ['work'] },
      ],
    },
    {
      id: 's3', lesson: HT, level: 2, title: { nl: 'Vervorming en hardingsscheuren', en: 'Distortion and quench cracks' },
      beats: [
        { nl: 'Afschrikken geeft ook vervorming (distortion): een lange as kan krom trekken.', en: 'Quenching also causes distortion: a long shaft can bend.', cues: ['work'] },
        { nl: 'Bij een scherpe hoek of een plotselinge diktesprong kan een hardingsscheur ontstaan.', en: 'At a sharp corner or a sudden change in thickness a quench crack can start.', cues: ['work'] },
        { nl: 'Water koelt het snelst en geeft de meeste kans op scheuren; olie is milder.', en: 'Water cools fastest and gives the most risk of cracks; oil is milder.', cues: ['tank'] },
        { nl: 'Een ronde overgang in plaats van een scherpe hoek scheelt veel. Dat regel je op de tekening.', en: 'A rounded transition instead of a sharp corner helps a lot. You settle that on the drawing.', cues: [] },
      ],
    },
    {
      id: 's4', lesson: HT, level: 2, title: { nl: 'Ontlaten', en: 'Tempering' },
      beats: [
        { nl: '{t:Ontlaten|Ontlaten}: opnieuw verwarmen, meestal tot {n:150} à {n:650} °C.', en: '{t:Tempering|Tempering}: reheating, typically to {n:150} to {n:650} °C.', cue: { Ontlaten: 'temper' }, cues: ['work'], read: { nl: '{n:150}–{n:650} °C', en: '{n:150}–{n:650} °C' } },
        { nl: 'Je levert wat hardheid in en wint taaiheid (toughness): een klap opvangen zonder te scheuren.', en: 'You give up some hardness and gain toughness: taking a blow without cracking.', cues: [] },
        { nl: 'Laag ontlaten houdt het hard, voor gereedschap; hoog ontlaten maakt het taai, voor assen.', en: 'Low tempering keeps it hard, for tools; high tempering makes it tough, for shafts.', cues: [] },
        { nl: 'Harden plus ontlaten heet veredelen. Nooit ontlaten? Dan kan het onderdeel vanzelf scheuren.', en: 'Quench and temper together set the properties. Never tempered? Then the part can crack by itself.', cues: ['temper'] },
      ],
    },
    {
      id: 's5', lesson: HT, level: 2, title: { nl: 'Gloeien en spanningsarmgloeien', en: 'Annealing and stress relieving' },
      beats: [
        { nl: '{t:Gloeien|Gloeien} doet het omgekeerde: verhitten en heel langzaam afkoelen maakt staal zacht.', en: '{t:Annealing|Annealing} does the opposite: heating and cooling very slowly makes steel soft.', cue: { Gloeien: 'annealC' }, cues: ['furnace'] },
        { nl: '{t:Spanningsarmgloeien|Spanningsarmgloeien}: milder, voor staal meestal rond {n:550} à {n:650} °C.', en: '{t:Stress relieving|Stress relieving}: gentler, for steel typically around {n:550} to {n:650} °C.', cue: { Spanningsarmgloeien: 'stressC' }, read: { nl: '{n:550}–{n:650} °C', en: '{n:550}–{n:650} °C' } },
        { nl: 'Een gelast deel dat na het verspanen krom trekt: de lasspanningen kwamen vrij.', en: 'A welded part that warps after machining: the welding stresses were released.', cues: ['stressC'] },
        { nl: 'Eerst spanningsarmgloeien, dan verspanen: dan blijft het recht.', en: 'Stress relieve first, then machine: then it stays straight.', cues: ['stressC'] },
      ],
    },
    {
      id: 's6', lesson: HT, level: 2, title: { nl: 'Een harde huid, een taaie kern', en: 'A hard skin, a tough core' },
      beats: [
        { nl: '{t:Oppervlakteharden|Oppervlakteharden}: alleen de buitenlaag hard, op een taaie kern.', en: '{t:Case hardening|Case hardening}: only the outer layer hard, on a tough core.', cue: { Oppervlakteharden: 'caseC' }, cues: ['gear'] },
        { nl: 'Inzetharden: koolstof in het oppervlak bij zo’n {n:900} °C, dan afschrikken.', en: 'Carburising: carbon into the surface at about {n:900} °C, then quenching.', cues: ['caseC'], read: { nl: '≈ {n:900} °C', en: '≈ {n:900} °C' } },
        { nl: 'Nitreren: stikstof in het oppervlak bij zo’n {n:500} °C, met weinig vervorming.', en: 'Nitriding: nitrogen into the surface at about {n:500} °C, with little distortion.', cues: ['caseC'], read: { nl: '≈ {n:500} °C', en: '≈ {n:500} °C' } },
        { nl: 'Inductieharden: een spoel verhit alleen het oppervlak, daarna direct afschrikken.', en: 'Induction hardening: a coil heats only the surface, then a quench straight away.', cues: ['caseC'], read: { nl: 'spoel · seconden', en: 'coil · seconds' } },
      ],
    },
    {
      id: 's7', lesson: HT, level: 2, title: { nl: 'De eis op de tekening', en: 'The spec on the drawing' },
      beats: [
        { nl: 'Op tekening: ingezet en gehard, {n:58}–{n:62} HRC, hardingsdiepte {n:0.8}–{n:1.2} mm.', en: 'On the drawing: carburised and hardened, {n:58}–{n:62} HRC, case depth {n:0.8}–{n:1.2} mm.', cues: ['gear'] },
        { nl: 'Tandwielen van een nieuwe leverancier slijten binnen weken. De ingangscontrole meet {n:48} HRC.', en: 'Gears from a new supplier wear out within weeks. The incoming check measures {n:48} HRC.', cues: ['indenter', 'sample'], read: { nl: '{n:48} HRC', en: '{n:48} HRC' } },
        { nl: 'Zaag er één door en meet de hardheid in HV, van de rand naar binnen: de echte hardingsdiepte.', en: 'Cut one and measure the hardness in HV from the surface inward: the real case depth.', cues: ['sample'] },
        { nl: 'Vraag de leverancier om het hardheidsverloop en de ovenregistratie van die partij.', en: 'Ask the supplier for the hardness profile and furnace record of that batch.', cues: [] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "°", "%" or "à" in the spoken text:
// "graden", "procent" and "tot" are written out, and ranges are said as
// "58 tot 62". The Dutch words were checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex). Kept out of the Dutch narration because
// espeak-ng stresses or voices them wrong: gereedschapsstaal (gereedschaps-
// STAAL), hardingsoven (hardings-OOven), ovenregistratie (oVEN), hardheids-
// verloop (-verLOOP), wisselstroom (-STROOM), "frame" (said "fraame"),
// ontlaatoven (-OOven), royale (roo-ie-aale), hardingsscheur (-SCHEUR), the
// singular tandwiel (tandWIEL) and "olie" on its own (oLIE; "oliebad" is
// right, and no kit-wide rule for olie, as agreed).
// Brinell, piramide, inzetharden, inductieharden, warmtebehandeling,
// tandwielen, polymeeroplossing and diktesprong get Dutch-only spoken forms in
// films/_kit/timeline.mjs (SAY); no other film says any of them.
const SAY = [
  [ // s1 how hard is it?
    { nl: 'Dit is een hardheidsmeter. {t:Hardheid|Hardheid} is de weerstand van een materiaal tegen indrukken. De meter drukt met een vaste kracht een harde punt in het oppervlak, en meet de indruk. Hoe kleiner de indruk, hoe harder het materiaal.',
      en: 'This is a hardness tester. {t:Hardness|Hardness} is a material\'s resistance to being dented. The tester presses a hard tip into the surface with a set force, and measures the dent. The smaller the dent, the harder the material.' },
    { nl: 'Drie schalen zijn gangbaar. Brinell drukt een kogel in en meet de breedte van de indruk: voor zachter staal en gietwerk. Vickers meet de diagonalen van een diamanten piramide: voor elk materiaal, ook dunne lagen. Rockwell C meet hoe diep een diamanten kegel zakt: de schaal voor gehard staal.',
      en: 'Three scales are common. Brinell presses in a ball and measures the width of the dent: for softer steels and castings. Vickers measures the diagonals of a diamond pyramid: for any material, thin layers too. Rockwell C measures how deep a diamond cone sinks: the scale for hardened steel.' },
    { nl: 'Gewoon constructiestaal zit rond {n:120} HB. Gehard staal voor gereedschap haalt {n:60} HRC of meer. Omrekenen tussen de schalen gaat met tabellen, en blijft een schatting.',
      en: 'Mild steel is about {n:120} HB. A hardened tool steel reaches {n:60} HRC or more. Converting between the scales goes by tables, and stays an estimate.' },
    { nl: 'Harder staal is meestal sterker en slijtvaster. De meting is snel en goedkoop, dus een vaste ingangscontrole. Maar hoe maak je staal hard? Met warmte.',
      en: 'Harder steel is usually stronger and more wear resistant. The test is quick and cheap, so it is a standard incoming check. But how do you make steel hard? With heat.' },
  ],
  [ // s2 hardening: heat, then quench
    { nl: 'Staal met genoeg koolstof, ruwweg {n:0.3} procent of meer, kun je harden. De takel laat deze as in de oven zakken, en het deksel gaat dicht.',
      en: 'Steel with enough carbon, roughly {n:0.3} percent or more, can be hardened. The hoist lowers this shaft into the furnace, and the lid goes shut.' },
    { nl: 'De as warmt op tot tussen de {n:800} en {n:900} graden. Dan verandert de structuur binnenin: de koolstof lost op in het ijzer, en het staal wordt austeniet.',
      en: 'The shaft heats up to between {n:800} and {n:900} degrees. Then the structure inside changes: the carbon dissolves in the iron, and the steel turns to austenite.' },
    { nl: 'Dan {t:Afschrikken|afschrikken}: in een paar seconden van de oven in het oliebad. Heel snel afkoelen kan in water, in een oliebad of in een polymeeroplossing. De koolstof kan nergens heen, en zit gevangen in een gespannen structuur: martensiet.',
      en: 'Then {t:Quenching|quenching}: in a few seconds from the furnace into the oil. Cooling very fast can be done in water, oil or a polymer solution. The carbon has nowhere to go, and is trapped in a strained structure: martensite.' },
    { nl: 'Het staal is nu heel hard, maar ook bros: het breekt zonder te waarschuwen. In de WBZ van een las gebeurt hetzelfde als die te snel afkoelt; daarom wordt er voorgewarmd.',
      en: 'The steel is now very hard, but also brittle: it breaks without warning. The same happens in the HAZ of a weld that cools too fast; that is why it is preheated.' },
  ],
  [ // s3 distortion and quench cracks
    { nl: 'Afschrikken heeft een prijs. De buitenkant koelt eerder af dan de kern, en dat geeft grote spanningen. Een lange as kan krom trekken: vervorming.',
      en: 'Quenching comes at a price. The outside cools before the core, and that builds up large stresses. A long shaft can bend: distortion.' },
    { nl: 'Waar de spanning zich ophoopt, kan het staal scheuren. Zo\'n scheur begint meestal bij een scherpe hoek of een plotselinge diktesprong, zoals hier bij de kraag.',
      en: 'Where the stress piles up, the steel can crack. A quench crack usually starts at a sharp corner or a sudden change in thickness, like here at the collar.' },
    { nl: 'Hoe sneller het afkoelt, hoe groter het risico. Water is het felst, een oliebad het mildst, en een polymeeroplossing zit meestal ertussenin.',
      en: 'The faster it cools, the bigger the risk. Water is the harshest, oil the mildest, and a polymer solution usually sits in between.' },
    { nl: 'Wat helpt: een ruime afronding in plaats van een scherpe hoek, en lange assen hangend afschrikken. Dat regel je al op de tekening.',
      en: 'What helps: a generous radius instead of a sharp corner, and quenching long shafts hanging. You settle that on the drawing.' },
  ],
  [ // s4 tempering
    { nl: 'Daarom volgt meteen {t:Ontlaten|ontlaten}: de as gaat opnieuw een oven in, nu meestal tussen de {n:150} en {n:650} graden.',
      en: 'So {t:Tempering|tempering} follows straight away: the shaft goes into a furnace again, now typically between {n:150} and {n:650} degrees.' },
    { nl: 'De martensiet ontspant een beetje. Je levert wat hardheid in, en wint taaiheid: een klap opvangen zonder te scheuren.',
      en: 'The martensite relaxes a little. You give up some hardness, and gain toughness: taking a blow without cracking.' },
    { nl: 'Laag ontlaten houdt het staal hard, voor gereedschap zoals een beitel. Hoog ontlaten maakt het taai, voor assen en bouten die stoten opvangen.',
      en: 'Low tempering keeps the steel hard, for tools such as a chisel. High tempering makes it tough, for shafts and bolts that take shocks.' },
    { nl: 'Harden en ontlaten samen heet veredelen. Een afgeschrikt onderdeel dat nooit ontlaten wordt, kan vanzelf scheuren, soms pas dagen later. Dus zo snel mogelijk weer de oven in.',
      en: 'Quench and temper together set the properties of shafts, gears and tools. A quenched part that is never tempered can crack by itself, sometimes days later. So into the tempering furnace as soon as possible.' },
  ],
  [ // s5 annealing and stress relieving
    { nl: '{t:Gloeien|Gloeien} doet het omgekeerde: verhitten en heel langzaam afkoelen, vaak in de oven zelf. Het staal wordt zacht, en makkelijk te verspanen of te vervormen.',
      en: '{t:Annealing|Annealing} does the opposite: heating and cooling very slowly, often in the furnace itself. The steel becomes soft, and easy to machine or form.' },
    { nl: '{t:Spanningsarmgloeien|Spanningsarmgloeien} is milder: voor staal meestal rond {n:550} tot {n:650} graden, onder de temperatuur waarbij de structuur verandert. Het haalt inwendige spanningen weg.',
      en: '{t:Stress relieving|Stress relieving} is gentler: for steel typically around {n:550} to {n:650} degrees, below the temperature where the structure changes. It removes internal stresses.' },
    { nl: 'Neem een gelaste constructie. Het lassen zet spanningen in het staal. Verspaan je een vlak, dan komt die spanning vrij, en het hele stuk trekt krom.',
      en: 'Take a welded part. Welding locks stresses into the steel. Machine a face, and that stress is released, and the whole part warps.' },
    { nl: 'Eerst spanningsarm gloeien, dan verspanen: dan blijft hij recht. Die stap hoort in het werkplan, tussen lassen en verspanen.',
      en: 'Stress relieve first, then machine: then it stays straight. That step belongs in the routing, between welding and machining.' },
  ],
  [ // s6 a hard skin, a tough core
    { nl: 'Soms wil je een hard oppervlak tegen slijtage, op een taaie kern die klappen opvangt. Dat is {t:Oppervlakteharden|oppervlakteharden}: alleen de buitenlaag wordt hard. Zo worden tandwielen en lagerzittingen behandeld.',
      en: 'Sometimes you want a hard surface against wear, on a tough core that takes the blows. That is {t:Case hardening|case hardening}: only the outer layer becomes hard. Gears and bearing seats are treated this way.' },
    { nl: 'Bij inzetharden dringt bij zo\'n {n:900} graden koolstof een stukje het oppervlak in. Na het afschrikken wordt alleen die huid echt hard.',
      en: 'In carburising, carbon soaks a little way into the surface at about {n:900} degrees. After the quench, only that skin becomes really hard.' },
    { nl: 'Nitreren brengt stikstof in het oppervlak, bij zo\'n {n:500} graden. Er wordt niet afgeschrikt, dus het onderdeel vervormt weinig.',
      en: 'Nitriding brings nitrogen into the surface, at about {n:500} degrees. There is no quench, so the part distorts very little.' },
    { nl: 'Bij inductieharden verhit een spoel in een paar seconden alleen de buitenlaag, en meteen daarna volgt de koeling. De kern blijft koel, en dus taai.',
      en: 'In induction hardening a coil heats only the outer layer in a few seconds, and the quench follows straight after. The core stays cool, and so stays tough.' },
  ],
  [ // s7 the spec on the drawing
    { nl: 'Op de tekening staat dan bijvoorbeeld: ingezet en gehard, {n:58} tot {n:62} HRC, hardingsdiepte {n:0.8} tot {n:1.2} millimeter. Een eis om te controleren, geen versiering.',
      en: 'The drawing then says, for example: carburised and hardened, {n:58} to {n:62} HRC, case depth {n:0.8} to {n:1.2} millimetres. A spec to check, not decoration.' },
    { nl: 'Tandwielen van een nieuwe leverancier slijten binnen een paar weken. De ingangscontrole meet {n:48} HRC aan het oppervlak: veel te zacht.',
      en: 'Gears from a new supplier wear out within a few weeks. The incoming check measures {n:48} HRC at the surface: far too soft.' },
    { nl: 'Was het inzetten te kort, verloor het oppervlak koolstof, of ging het afschrikken te langzaam? Blokkeer de voorraad, zaag er één door, en meet met Vickers van de rand naar binnen. Dan zie je de echte hardingsdiepte.',
      en: 'Was the carburising too short, did the surface lose carbon, or was the quench too slow? Quarantine the stock, cut one gear through, and measure with Vickers from the surface inward. Then you see the real case depth.' },
    { nl: 'En vraag de leverancier om de registratie van de oven en het certificaat van de warmtebehandeling van die partij.',
      en: 'And ask the supplier for the furnace records and the heat-treatment certificate of that batch.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
  // the scene's length follows its Dutch narration (Piper's alex at about 2,9 words a second, plus pauses)
  const words = SAY[si].reduce((n, b) => n + wordsOf(b.nl.replace(/\{[tn]:([^}|]*)(\|[^}]*)?\}/g, '$1')), 0);
  s.dur = Math.round(words / 3.1 + 3);
});
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
{
  const resolved = resolveFilm(spec, await allLessons());
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].still = 0.92;
    const within = (bi, p) => (st[bi] + p * ((bi + 1 < st.length ? st[bi + 1] : rs.dur) - st[bi])) / rs.dur;
    if (si === 1) { CAM[1].a = within(2, 0.38); CAM[1].b = within(2, 0.58); }
    if (si === 3) { CAM[3].a = 0; CAM[3].b = within(0, 0.3); }
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
  });
}
// no symbol the voice would read aloud in the spoken script
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  if (/[/&°%à–]/.test(line[lang])) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const C = { GEAR, BENCH_TOP: BENCH.top, HF, TF, QT, WORK, HOIST_Z, AXIS, IND, ANVIL_Z, PATH, HARDEN, TEMPER, RELIEF, CARB, NITR, SPEC, MEAS, HB_MILD, HRC_TOOL };
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.mt-well{fill:var(--anatomy-shade-0);stroke:none}
.mt-brick{fill:var(--anatomy-shade-1);stroke:none}
.mt-oil{fill:var(--anatomy-shade-1);stroke:none}
.mt-oilside{fill:var(--anatomy-shade-2);stroke:none}
.mt-screen{fill:var(--anatomy-shade-1);stroke:none}
.mt-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mt-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mt-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mt-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mt-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mt-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.mt-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mt-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mt-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.mt-band{fill:var(--anatomy-shade-2);stroke:none;opacity:.7}
.mt-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mt-thin{fill:none;stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linecap:round}
.mt-ghost{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:3 4}
.mt-dot{fill:var(--anatomy-hi)}
.mt-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mt-accf{fill:color-mix(in srgb,var(--fp-accent) 22%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mt-solid{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linejoin:round}
.mt-grain{fill:var(--anatomy-shade-1);stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linejoin:round}
.mt-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.mt-heat{fill:none;stroke:var(--anatomy-mid);stroke-width:.5;stroke-linecap:round}
.mt-eye{fill:none;stroke:var(--anatomy-hi);stroke-width:.9}
.mt-chain{fill:none;stroke:var(--anatomy-mid);stroke-width:.45}
.mt-hook{fill:none;stroke:var(--anatomy-hi);stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round}
.mt-bub{fill:none;stroke:var(--anatomy-mid);stroke-width:.4}
.mt-acc{fill:var(--fp-accent)}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mt-line{stroke:var(--fp-accent);stroke-width:3}
[data-cue][data-on] .mt-dot{fill:var(--fp-accent)}
[data-cue][data-on] .mt-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .mt-tile{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .mt-solid{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een kleine harderij onder een kraanbaan: een putoven met deksel, schakelkast en aansluitkast; een oliebak op sleden met roerwerk, peilglas, aftapkraan en thermometer; een kleinere ontlaatoven met regelaar; en een werkbank met een Rockwell-hardheidsmeter en een stapel tandwielen. Een elektrische kettingtakel rijdt over een I-balk en brengt een getrapte as de oven in, de olie in en de ontlaatoven in. Kaarten, elk gemarkeerd als voorbeeld, tonen de drie indrukkers met hun schalen, het verloop van temperatuur tegen tijd met de structuur van het staal ernaast, vervorming en een hardingsscheur, een gelast deel dat na het verspanen krom trekt, een tand met harde huid en taaie kern, en het hardheidsverloop van een te zacht tandwiel.',
  en: 'A small hardening shop under a crane rail: a pit furnace with its lid, control cabinet and terminal box; an oil quench tank on skids with an agitator, level gauge, drain valve and thermometer; a smaller tempering furnace with its controller; and a bench with a Rockwell hardness tester and a stack of gears. An electric chain hoist runs on an I-beam and carries a stepped shaft into the furnace, into the oil and into the tempering furnace. Cards, each marked as an example, show the three indenters with their scales, the temperature-time path with the steel\'s structure beside it, distortion and a quench crack, a welded part that warps after machining, a gear tooth with a hard case and a tough core, and the hardness profile of a gear that is too soft.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const nl = data.scenes.reduce((n, s) => n + s.beats.reduce((m, b) => m + wordsOf(b.voice.nl), 0), 0);
  const en = data.scenes.reduce((n, s) => n + s.beats.reduce((m, b) => m + wordsOf(b.voice.en), 0), 0);
  console.log(`narration words: nl ${nl}, en ${en}`);
}

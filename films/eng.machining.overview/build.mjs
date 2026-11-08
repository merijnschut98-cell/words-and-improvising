// Dev tool, not shipped. Builds the explainer film "Van staaf tot as / From bar
// to shaft" for the Basis level of the turning topic of Verspanen (lesson
// eng.machining.processes): one gearbox output shaft follows its routing across
// the floor, saw → CNC lathe → machining centre (milling, drilling, reaming) →
// hardening → cylindrical grinder.
//
//   node films/eng.machining.overview/build.mjs            build the page
//   node films/eng.machining.overview/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.overview.html. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.1.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, allLessons, resolveFilm } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The worked example of eng.machining.processes: the routing of one gearbox
// output shaft. The captions' {n:...} numbers are checked against the Dutch
// lesson text by defineFilm; these asserts keep the drawing and the story true.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const ROUTE = { saw: 1, turn: 6, mill: 3, grind: 4 }; // minutes per step (lesson example)
const BAR = 55; // Ø of the sawn bar
const COLLAR = 50; // Ø after turning
const SEAT = 35; // Ø of the bearing seat
const ALLOW = 0.2; // mm left on the seat for grinding
const KEY = 10; // keyway width, mm
assert(ROUTE.saw + ROUTE.turn + ROUTE.mill + ROUTE.grind === 14, 'cutting time 14 min');
assert(COLLAR < BAR && SEAT < COLLAR, 'diameters step down from the bar');
assert(ALLOW >= 0.1 && ALLOW <= 0.3, 'grinding allowance 0,2 mm');
// grinding holds ±0,005 against ±0,02 for turning: four times tighter
assert(0.02 / 0.005 === 4, 'tolerances');
// k6 on Ø35 allows 16 µm (ISO 286: +0,002 … +0,018)
assert(Math.round((0.018 - 0.002) * 1000) === 16, 'Ø35 k6 = 16 µm');
// the reamer takes 0,1–0,3 mm: a Ø8 cross hole is drilled Ø7,8 and reamed
const HOLE = 8;
assert(HOLE - 7.8 >= 0.1 && HOLE - 7.8 <= 0.3, 'reaming allowance');

// ---------------------------------------------------------------- the world (mm)
// x along the floor (saw at the left, grinder at the right), y toward the
// viewer, z up; the floor is z = -450. The shaft always lies along x with its
// bearing seat at +x: a point s from the seat end is [X0 - s, y0, z0].
const W = 640;
const H = 400;
const FLOOR = -450;
const PROF = [[0, 16.5], [1, 17.5], [50, 17.5], [50, 22], [70, 22], [70, 25], [95, 25], [95, 20], [239, 20], [240, 19]];
const STOCK = [[0, BAR / 2], [240, BAR / 2]];
const KEYS = [140, 210]; // keyway from s 140 to s 210, on top
const HOLE_S = 226; // cross hole at s 226
const ST = {
  saw: { X0: 270, y: 0, z: 0, blade: 24 },
  lathe: { X0: 1260, y: 0, z: 0, CF: 1020 },
  mill: { X0: 2320, y: 0, z: 0, SX: 2200 }, // the spindle stands at x = SX; the table moves the part
  furnace: { x: 3060 },
  grind: { X0: 3945, y: 0, z: 0, WX: 3920, WR: 150 },
  cart: { y: 380, z: -300 },
};
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const FIT = k.boxCorners({ x: -820, y: -420, w: 5200, d: 900 }, FLOOR, 320);
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 58, elevation: 30 });
const DOT = 1 / 3; // dot sizes are in projected units, and the camera zooms in about 3×
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0, ...plan }, z0, z1 - z0, P, 2, bevel), style);
// a half disc (a guard), as points in its plane, from angle a0 to a1
const halfDisc = (r, a0, a1) => Array.from({ length: 25 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 24; return [Math.cos(a) * r, Math.sin(a) * r]; });
const stepsOf = (r) => (r > 60 ? 48 : r > 20 ? 28 : 18);
const discX = (x0, x1, r, o = [0, 0], style = {}) => S(G.disc(0, x1 - x0, r, G.frameOf([x0, o[0], o[1]], X, Y, Z), P, { steps: stepsOf(r) }), style);
const discY = (y0, y1, r, o = [0, 0], style = {}) => S(G.disc(0, y1 - y0, r, G.frameOf([o[0], y0, o[1]], Y, Z, X), P, { steps: stepsOf(r) }), style);
const discZ = (z0, z1, r, o = [0, 0], style = {}) => S(G.disc(0, z1 - z0, r, G.frameOf([o[0], o[1], z0], Z, X, Y), P, { steps: stepsOf(r) }), style);
const seam = (plan, z) => L(k.sideSeam({ r: 0, ...plan }, z, P, 2), { tone: 'faint' });
const screws = (plan, z, inset = 6, size = 0.3) => k.dotsSvg(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const halo = (plan) => `<path class="iso-halo" d="${k.haloOf({ r: 6, ...plan }, FLOOR, 0, P)}"/>`;
// a cabinet: a body on a plinth, a seam, a door panel and its handle on the front (+y) face
function cabinet(plan, z1, { door = true, vents = true } = {}) {
  const yf = plan.y + plan.d;
  const out = [halo({ x: plan.x - 10, y: plan.y - 10, w: plan.w + 20, d: plan.d + 20 })];
  out.push(box({ x: plan.x + 8, y: plan.y + 8, w: plan.w - 16, d: plan.d - 16 }, FLOOR, FLOOR + 30, { tone: 'lo' }));
  out.push(box(plan, FLOOR + 30, z1, {}, 1.2));
  out.push(seam(plan, z1 - 22));
  if (door) {
    const x0 = plan.x + 30;
    const x1 = plan.x + plan.w * 0.48;
    const z0 = FLOOR + 60;
    const z2 = z1 - 50;
    out.push(L(k.pathOf([[x0, yf, z0], [x1, yf, z0], [x1, yf, z2], [x0, yf, z2]].map(at), true), { tone: 'lo' }));
    out.push(L(k.pathOf([[x1 - 18, yf, z2 - 40], [x1 - 18, yf, z2 - 90]].map(at)), { tone: 'mid' }));
    out.push(k.dotsSvg([at([x1 - 18, yf, z2 - 40]), at([x1 - 18, yf, z2 - 90])], { size: 1.1 * DOT }));
  }
  if (vents) {
    const xv = plan.x + plan.w * 0.62;
    const lines = [];
    for (let i = 0; i < 5; i++) lines.push(k.pathOf([[xv, yf, FLOOR + 80 + i * 16], [xv + plan.w * 0.25, yf, FLOOR + 80 + i * 16]].map(at)));
    out.push(L(lines.join(''), { tone: 'lo' }));
  }
  // the right (+x) side shows a label plate with three rule lines
  const xs = plan.x + plan.w;
  const yc = plan.y + plan.d * 0.5;
  const plate = [[xs, yc - 40, z1 - 70], [xs, yc + 40, z1 - 70], [xs, yc + 40, z1 - 120], [xs, yc - 40, z1 - 120]];
  out.push(L(k.pathOf(plate.map(at), true), { tone: 'lo' }));
  out.push(L([0, 1, 2].map((i) => k.pathOf([[xs, yc - 30, z1 - 84 - i * 13], [xs, yc + 30 - i * 12, z1 - 84 - i * 13]].map(at))).join(''), { tone: 'faint', free: true }));
  return out.join('');
}
// a control panel on a post: a screen and a row of buttons on its sloping front
function panel(x, y, z0) {
  const post = { x: x - 10, y: y - 10, w: 20, d: 20, r: 3 };
  const body = { x: x - 60, y: y - 14, w: 120, d: 28, r: 3 };
  const yf = y + 14;
  const scr = [[x - 48, yf, z0 + 150], [x + 20, yf, z0 + 150], [x + 20, yf, z0 + 100], [x - 48, yf, z0 + 100]];
  return [
    box(post, z0, z0 + 60),
    box(body, z0 + 60, z0 + 170, {}, 0.8),
    `<path class="fp-screen" d="${k.pathOf(scr.map(at), true)}"/>`,
    L(k.pathOf([[x - 42, yf, z0 + 138], [x + 6, yf, z0 + 138]].map(at)) + k.pathOf([[x - 42, yf, z0 + 126], [x - 4, yf, z0 + 126]].map(at)), { tone: 'mid', free: true }),
    k.dotsSvg([0, 1, 2].flatMap((i) => [at([x + 34, yf, z0 + 145 - i * 18]), at([x + 48, yf, z0 + 145 - i * 18])]), { size: 1.4 * DOT }),
    k.dotsSvg([at([x - 40, yf, z0 + 80]), at([x - 24, yf, z0 + 80]), at([x - 8, yf, z0 + 80])], { size: 1.2 * DOT, tone: 'lo' }),
  ].join('');
}

// ---------------------------------------------------------------- the saw (a cold circular saw)
const saw = (() => {
  const B = ST.saw.blade;
  const base = { x: -250, y: -190, w: 520, d: 290 };
  const top = { x: -260, y: -200, w: 540, d: 310, r: 3 };
  const rollers = [];
  for (let x = -700; x <= -300; x += 80) rollers.push(discY(-40, 40, 9, [x, -36.5], { tone: 'hi', crease: 'lo' }));
  const conveyor = [
    box({ x: -720, y: -56, w: 440, d: 10 }, -70, -46),
    ...[-700, -340].flatMap((x) => [box({ x: x - 6, y: -50, w: 12, d: 10 }, FLOOR, -70, { tone: 'lo' }), box({ x: x - 6, y: 40, w: 12, d: 10 }, FLOOR, -70, { tone: 'lo' })]),
    box({ x: -720, y: 46, w: 440, d: 10 }, -70, -46),
  ];
  // the bar's rack behind: two arms with bars waiting
  const back = [
    ...conveyor.slice(0, 3),
    ...rollers,
    // the column and its slide, behind the blade
    box({ x: B - 40, y: -190, w: 80, d: 50, r: 3 }, -60, 300, {}, 1),
    seam({ x: B - 40, y: -190, w: 80, d: 50 }, 280),
    box({ x: B - 26, y: -140, w: 52, d: 10 }, -40, 280, { tone: 'lo', crease: 'lo' }),
  ];
  return {
    base: cabinet(base, -60) + box(top, -60, -27.5, {}, 1) + screws(top, -27.5, 10),
    back: back.join(''),
    front: conveyor.slice(3).join(''),
    // the vice: a fixed jaw behind the bar, a moving jaw and its handwheel in front
    viseB: box({ x: -110, y: -60, w: 90, d: 30 }, -27.5, 30, {}, 0.8) + screws({ x: -110, y: -60, w: 90, d: 30 }, 30, 8),
    viseF: box({ x: -110, y: 28, w: 90, d: 30 }, -27.5, 30, {}, 0.8) + box({ x: -76, y: 58, w: 22, d: 60 }, -10, 12, { tone: 'lo' })
      + discY(118, 126, 26, [-65, 1], { crease: 'lo' }) + k.dotsSvg(G.dotsOf(G.frameOf([-65, 126, 1], Y, Z, X), 0, 20, 5, P, { all: true }), { size: 1.1 * DOT }),
  };
})();

// the saw head (moves down): motor and gearbox on the slide, the guard over the blade
const sawHead = (() => {
  const B = ST.saw.blade;
  const cz = 210; // blade centre at rest
  return [
    box({ x: B - 50, y: -140, w: 100, d: 60, r: 3 }, cz - 50, cz + 60, {}, 1),
    seam({ x: B - 50, y: -140, w: 100, d: 60 }, cz + 40),
    discY(-80, -20, 40, [B, cz]),
    discY(-20, -8, 22, [B, cz], { tone: 'hi', crease: 'lo' }),
    g('blade', '', ' data-cue="blade"'),
    // the guard: a half ring over the top of the blade, with a lip
    S(G.prismOf(G.frameOf([B, 0, cz], Y, X, Z), halfDisc(150, 0, Math.PI), -10, 14, P), { tone: 'mid' }),
    L(k.pathOf(halfDisc(140, 0.12, Math.PI - 0.12).map(([x, z]) => at([B + x, 14, cz + z]))), { tone: 'faint' }),
    discY(8, 14, 20, [B, cz], { tone: 'hi', crease: 'lo' }),
    k.dotsSvg([at([B, 14, cz])], { size: 1.3 * DOT }),
    // the handle and its grip
    box({ x: B + 40, y: 4, w: 120, d: 14, r: 4 }, cz + 20, cz + 34, {}, 0.5),
    discX(B + 160, B + 200, 12, [11, cz + 27], { tone: 'hi', crease: 'lo' }),
  ].join('');
})();

// ---------------------------------------------------------------- the CNC lathe
const lathe = (() => {
  const { CF } = ST.lathe;
  const bedPlan = { x: 760, y: -150, w: 700, d: 250 };
  const HB = { x: 820, y: -100, w: 180, d: 150, r: 3 };
  const yf = HB.y + HB.d;
  return {
    base: cabinet(bedPlan, -140) + box({ x: 770, y: -110, w: 680, d: 170, r: 3 }, -140, -100, { crease: 'lo' })
      + box({ x: 880, y: -80, w: 560, d: 16 }, -100, -92, { crease: 'lo' }) + box({ x: 880, y: 30, w: 560, d: 16 }, -100, -92, { crease: 'lo' })
      + L(k.planOutline({ x: 1040, y: -60, w: 380, d: 86, r: 4 }, -100, P, 4), { tone: 'faint' }),
    head: [
      box(HB, -100, 80, {}, 1),
      seam(HB, 66),
      L([44, 52, 60].map((z) => k.pathOf([[840, yf, z], [900, yf, z]].map(at))).join(''), { tone: 'lo' }),
      box(k.insetPlan(HB, 3), 80, 84, { crease: 'lo' }, 0.4),
      screws(k.insetPlan(HB, 3), 84, 5),
      discX(CF - 22, CF - 14, 62),
      S(G.solidOf([[0, 70], [12, 70], [14, 66]], G.frameOf([CF - 14, 0, 0], X, Y, Z), P), { crease: 'lo', inner: L(G.arcOf(G.frameOf([CF - 14, 0, 0], X, Y, Z), 13.9, 50, P), { tone: 'faint' }) }),
      k.dotsSvg(G.dotsOf(G.frameOf([CF - 14, 0, 0], X, Y, Z), 13.9, 60, 6, P, { least: -1 }), { size: 0.9 * DOT }),
    ].join(''),
    panel: panel(1520, 60, FLOOR + 300),
  };
})();
// the carriage and the tool slide, at rest with the tool tip at TT
const TT = [ST.lathe.X0 + 14, 40, 0];
const latheTool = (() => {
  const [tx, ty] = TT;
  return {
    car: box({ x: tx - 30, y: -86, w: 80, d: 186, r: 2 }, -92, -60) + seam({ x: tx - 30, y: -86, w: 80, d: 186 }, -66)
      + box({ x: tx - 16, y: ty + 8, w: 52, d: 80 }, -60, -46, { crease: 'lo' }),
    slide: [
      box({ x: tx - 6, y: ty + 46, w: 38, d: 40, r: 1.5 }, -46, -9, {}, 0.6),
      k.dotsSvg([[tx + 2, ty + 54], [tx + 24, ty + 54], [tx + 2, ty + 80], [tx + 24, ty + 80]].map(([x, y]) => at([x, y, -9])), { size: 0.9 * DOT }),
      box({ x: tx + 1, y: ty + 8, w: 18, d: 80 }, -9, -3, { crease: 'lo' }, 0.3),
      S(k.extrude([[tx, ty], [tx + 14, ty + 3], [tx + 16, ty + 16], [tx + 2, ty + 13]], -3, 5, P), { tone: 'hi', crease: 'lo' }),
      box({ x: tx + 7, y: ty + 9, w: 10, d: 9 }, 2, 5, { crease: 'lo' }, 0.3),
    ].join(''),
  };
})();

// ---------------------------------------------------------------- the machining centre
const mill = (() => {
  const { SX } = ST.mill;
  const basePlan = { x: 1950, y: -320, w: 520, d: 420 };
  const col = { x: SX - 90, y: -320, w: 180, d: 110, r: 4 };
  const slots = [-80, -40, 0, 40, 80].map((y) => k.pathOf([[1990, y, -112], [2410, y, -112]].map(at))).join('');
  return {
    base: cabinet(basePlan, -170, { vents: false }) + box({ x: 2000, y: -140, w: 420, d: 30 }, -170, -158, { crease: 'lo' }) + box({ x: 2000, y: 80, w: 420, d: 16 }, -170, -158, { crease: 'lo' }),
    col: [
      box(col, -170, 420, {}, 1.2),
      seam(col, 400),
      seam(col, 120),
      box({ x: SX - 60, y: -212, w: 22, d: 6 }, -100, 400, { tone: 'lo', crease: 'lo' }),
      box({ x: SX + 38, y: -212, w: 22, d: 6 }, -100, 400, { tone: 'lo', crease: 'lo' }),
      // the umbrella tool magazine on the right side of the column
      discX(SX + 90, SX + 104, 30, [-250, 300]),
      discX(SX + 104, SX + 124, 120, [-250, 300], { crease: 'lo' }),
      k.dotsSvg(G.dotsOf(G.frameOf([SX + 124, -250, 300], X, Y, Z), 0, 98, 16, P, { all: true }), { size: 2.2 * DOT, tone: 'lo' }),
      k.dotsSvg(G.dotsOf(G.frameOf([SX + 124, -250, 300], X, Y, Z), 0, 98, 16, P, { all: true }), { size: 0.9 * DOT, tone: 'hi' }),
    ].join(''),
    table: [
      box({ x: 1980, y: -110, w: 440, d: 220, r: 2 }, -150, -112, {}, 0.8),
      L(slots, { tone: 'faint' }),
      // the vice: body, fixed jaw (behind), moving jaw (in front), screw and crank;
      // the jaws are shorter than the shaft, so both its ends show
      box({ x: 2100, y: -70, w: 200, d: 140, r: 2 }, -112, -60, {}, 0.8),
      box({ x: 2110, y: -24, w: 180, d: 48 }, -60, -20, { tone: 'lo', crease: 'lo' }, 0.4),
      box({ x: 2110, y: -62, w: 180, d: 30 }, -60, 6, {}, 0.6),
      screws({ x: 2110, y: -62, w: 180, d: 30 }, 6, 10),
    ].join(''),
    tableF: [
      box({ x: 2110, y: 28, w: 180, d: 30 }, -60, 6, {}, 0.6),
      screws({ x: 2110, y: 28, w: 180, d: 30 }, 6, 10),
      box({ x: 2190, y: 70, w: 20, d: 40 }, -96, -76, { tone: 'lo' }),
      discY(110, 118, 16, [2200, -86], { crease: 'lo' }),
    ].join(''),
    head: [
      box({ x: SX - 80, y: -214, w: 160, d: 150, r: 4 }, 160, 330, {}, 1.2),
      seam({ x: SX - 80, y: -214, w: 160, d: 150 }, 310),
      box({ x: SX - 60, y: -70, w: 120, d: 100, r: 30 }, 180, 300, {}, 1),
      seam({ x: SX - 60, y: -70, w: 120, d: 100, r: 30 }, 284),
      discZ(140, 180, 40, [SX, 0]),
      discZ(126, 140, 30, [SX, 0], { tone: 'hi', crease: 'lo' }),
      // the coolant nozzle on a jointed hose
      discZ(150, 170, 6, [SX + 40, 34], { tone: 'lo' }),
    ].join(''),
    panel: panel(2560, 40, FLOOR + 300),
  };
})();

// ---------------------------------------------------------------- the furnace (the outside hardener)
const furnace = (() => {
  const { x } = ST.furnace;
  const body = { x: x - 150, y: -200, w: 300, d: 300, r: 4 };
  const yf = body.y + body.d;
  const mouth = [[x - 90, yf, -330], [x + 90, yf, -330], [x + 90, yf, -150], [x - 90, yf, -150]];
  return {
    body: [
      halo({ x: x - 160, y: -210, w: 320, d: 320 }),
      box({ x: x - 140, y: -190, w: 280, d: 280 }, FLOOR, FLOOR + 40, { tone: 'lo' }),
      box(body, FLOOR + 40, -60, {}, 1.2),
      seam(body, -84),
      `<path class="fp-mouth" d="${k.pathOf(mouth.map(at), true)}"/>`,
      L(k.pathOf([[x - 80, yf - 0.5, -320], [x + 80, yf - 0.5, -320]].map(at)), { tone: 'lo' }),
      discZ(-60, 120, 24, [x + 80, -120]),
      discZ(120, 130, 30, [x + 80, -120], { crease: 'lo' }),
      // the controller on the side: a dial
      box({ x: x + 150, y: -120, w: 16, d: 100 }, -280, -170, {}, 0.5),
      S(G.disc(0, 3, 26, G.frameOf([x + 166, -70, -225], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
    ].join(''),
    // the door slides up in its guides
    door: box({ x: x - 100, y: yf, w: 200, d: 16 }, -340, -140, {}, 1) + screws({ x: x - 100, y: yf, w: 200, d: 16 }, -140, 12)
      + discY(yf + 16, yf + 30, 8, [x, -250], { tone: 'hi', crease: 'lo' }),
    guides: box({ x: x - 116, y: yf, w: 12, d: 22 }, -350, 40, { tone: 'lo' }) + box({ x: x + 104, y: yf, w: 12, d: 22 }, -350, 40, { tone: 'lo' }),
  };
})();

// ---------------------------------------------------------------- the cylindrical grinder
const grinder = (() => {
  const { X0, WX, WR } = ST.grind;
  const base = { x: 3600, y: -420, w: 600, d: 520 };
  const wy = -(WR + SEAT / 2); // wheel centre y
  return {
    base: cabinet(base, -150) + box({ x: 3620, y: -90, w: 560, d: 20 }, -150, -138, { crease: 'lo' }) + box({ x: 3620, y: 70, w: 560, d: 20 }, -150, -138, { crease: 'lo' }),
    // the wheelhead behind the part: slide, body, motor and the wheel guard
    wheelhead: [
      box({ x: WX - 110, y: -400, w: 220, d: 140, r: 3 }, -150, -110, {}, 0.8),
      box({ x: WX - 90, y: -390, w: 180, d: 150, r: 4 }, -110, 60, {}, 1),
      seam({ x: WX - 90, y: -390, w: 180, d: 150 }, 40),
      discX(WX - 150, WX - 90, 50, [-320, 20]),
      L(G.arcOf(G.frameOf([WX - 150, -320, 20], X, Y, Z), 20, 50, P), { tone: 'faint' }),
      discX(WX - 34, WX - 22, 40, [wy, 0], { tone: 'mid' }),
      g('wheel', '', ' data-cue="grind"'),
      S(G.prismOf(G.frameOf([WX, wy, 0], X, Y, Z), halfDisc(WR + 12, 0.05, Math.PI), -32, 32, P), { tone: 'mid' }),
      L(k.pathOf(halfDisc(WR + 4, 0.15, Math.PI - 0.1).map(([y, z]) => at([WX + 32, wy + y, z]))), { tone: 'faint' }),
    ].join(''),
    table: [
      box({ x: 3580, y: -60, w: 520, d: 150, r: 2 }, -138, -110, {}, 0.8),
      L(k.pathOf([[3600, 60, -110], [4080, 60, -110]].map(at)), { tone: 'faint' }),
      // headstock (left) with its centre and drive dog, tailstock (right)
      box({ x: 3570 - 20, y: -50, w: 110, d: 100, r: 3 }, -110, 50, {}, 1),
      seam({ x: 3550, y: -50, w: 110, d: 100 }, 34),
      discX(3660, 3672, 34, [0, 0], { crease: 'lo' }),
      S(G.solidOf([[0, 12], [12, 2]], G.frameOf([3672, 0, 0], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
    ].join(''),
    tail: [
      box({ x: X0 + 24, y: -40, w: 90, d: 80, r: 3 }, -110, 30, {}, 1),
      seam({ x: X0 + 24, y: -40, w: 90, d: 80 }, 16),
      discX(X0 + 10, X0 + 24, 12, [0, 0], { tone: 'hi', crease: 'lo' }),
      S(G.solidOf([[0, 1], [10, 9]], G.frameOf([X0, 0, 0], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
      discX(X0 + 114, X0 + 120, 22, [0, 0], { crease: 'lo' }),
    ].join(''),
    panel: panel(4300, 40, FLOOR + 300),
  };
})();

// ---------------------------------------------------------------- the cart (moves along the front of the floor)
const cart = (() => {
  const { y, z } = ST.cart;
  const plan = { x: -100, y: y - 60, w: 200, d: 120, r: 4 };
  const casters = k.corners(plan, 14).map(([cx, cy]) => discY(cy - 5, cy + 5, 12, [cx, FLOOR + 12], { tone: 'lo' })).join('');
  return [
    `<path class="iso-halo" d="${k.haloOf({ x: -110, y: y - 70, w: 220, d: 140, r: 8 }, FLOOR, 0, P)}"/>`,
    casters,
    box({ ...plan, x: plan.x + 6, y: plan.y + 6, w: plan.w - 12, d: plan.d - 12 }, FLOOR + 24, FLOOR + 40, { tone: 'lo' }),
    ...k.corners(plan, 8).map(([cx, cy]) => box({ x: cx - 4, y: cy - 4, w: 8, d: 8 }, FLOOR + 40, z - 16, { tone: 'lo' })),
    box(plan, z - 16, z, {}, 0.8),
    box({ x: -60, y: y - 30, w: 120, d: 14 }, z, z + 8, { tone: 'lo' }),
    box({ x: -60, y: y + 16, w: 120, d: 14 }, z, z + 8, { tone: 'lo' }),
    // the push handle
    box({ x: -104, y: y - 50, w: 8, d: 8 }, z, z + 120, { tone: 'lo' }),
    box({ x: -104, y: y + 42, w: 8, d: 8 }, z, z + 120, { tone: 'lo' }),
    discY(y - 54, y + 54, 6, [-100, z + 124], { tone: 'mid' }),
  ].join('');
})();

// ---------------------------------------------------------------- HUD: the routing as five steps
const NODES = [0, 1, 2, 3, 4].map((i) => [W - 186 + i * 42, 32]);
const hud = g('route', [
  `<path class="fp-mark" d="M${NODES[0][0]} 32L${NODES[4][0]} 32"/>`,
  g('routeDone', ''),
  g('clock', ''),
  ...NODES.map(([x, y], i) => `<g data-k="node${i}"><circle class="fp-node" cx="${x}" cy="${y}" r="15"/><text class="fp-label fp-node-t" x="${x}" y="${y + 7}" font-size="20" text-anchor="middle">${i + 1}</text></g>`),
].join(''));

// ---------------------------------------------------------------- the drawing (back to front: left to right, then the cart)
const world = [
  `<path class="fp-floor" d="${k.pathOf([[-820, -420, FLOOR], [4380, -420, FLOOR], [4380, 480, FLOOR], [-820, 480, FLOOR]].map(at), true)}"/>`,
  L([-820, -170, 80, 330].map((y) => k.pathOf([[-820, y, FLOOR], [4380, y, FLOOR]].map(at))).join('') + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => k.pathOf([[-820 + i * 400, -420, FLOOR], [-820 + i * 400, 480, FLOOR]].map(at))).join(''), { tone: 'faint' }),
  // the saw
  g('sawBase', saw.base),
  g('sawBack', saw.back),
  g('sawViseB', saw.viseB),
  g('sawHead', sawHead),
  g('bar', '', ' data-cue="bar"'),
  g('sawViseF', saw.viseF),
  g('sawFront', saw.front),
  g('sawChips', ''),
  // the lathe
  g('latheBase', lathe.base),
  g('latheHead', lathe.head),
  g('lJawsB', ''),
  g('lShaft', '', ' data-cue="turn"'),
  g('lJawsF', ''),
  g('lCar', latheTool.car),
  g('lSlide', latheTool.slide, ' data-cue="turn"'),
  g('lChips', ''),
  g('lDim', '', ' data-cue="tol"'),
  g('lPanel', lathe.panel),
  // the machining centre
  g('millBase', mill.base),
  g('millCol', mill.col),
  g('millTable', [mill.table, g('mShaft', ''), g('mKey', '', ' data-cue="key"'), g('mHole', ''), g('mSpie', '', ' data-cue="key"'), mill.tableF].join('')),
  g('mChips', ''),
  g('millHead', mill.head + g('mTool', '', ' data-cue="mill"') + g('mReamer', '', ' data-cue="reamer"'), ' data-cue="mill"'),
  g('millPanel', mill.panel),
  // the furnace
  g('furnace', furnace.body),
  g('fPart', ''),
  g('fDoor', furnace.door),
  g('fGuides', furnace.guides),
  // the grinder
  g('grBase', grinder.base),
  g('grHead', grinder.wheelhead),
  g('grTable', grinder.table + g('gShaft', '') + grinder.tail),
  g('sparks', ''),
  g('grPanel', grinder.panel),
  // the cart and the finished shaft
  g('cart', cart + g('cShaft', '') + g('cTurn', '', ' data-cue="f-turn"') + g('cKey', '', ' data-cue="f-key"') + g('cHole', '', ' data-cue="f-hole"') + g('cSeat', '', ' data-cue="f-seat"')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${hud}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const VIEW = {
  floor: cam([1800, 0, -120], W),
  saw: cam([40, 30, -40], 253),
  lathe: cam([1170, 20, -40], 213),
  collar: cam([1178, 20, 4], 105),
  mill: cam([2200, 0, 0], 233),
  hole: cam([2215, 0, 40], 160),
  furnace: cam([3060, 160, -200], 300),
  grind: cam([3880, -40, -20], 213),
  done: cam([4350, ST.cart.y, ST.cart.z + 15], 105),
};
const CAM = [
  { from: VIEW.floor, to: VIEW.saw, a: 0.02, b: 0.3 },
  { from: VIEW.saw, to: VIEW.lathe, a: 0, b: 0.16 },
  { from: VIEW.lathe, to: VIEW.collar, a: 0, b: 0.3 },
  { from: VIEW.collar, to: VIEW.mill, a: 0, b: 0.2 },
  { from: VIEW.mill, to: VIEW.hole, a: 0, b: 0.2 },
  { from: VIEW.hole, to: VIEW.furnace, a: 0, b: 0.25 },
  { from: VIEW.furnace, to: VIEW.grind, a: 0, b: 0.2 },
  { from: VIEW.grind, to: VIEW.done, a: 0, b: 0.25 },
];

// ---------------------------------------------------------------- the film
const L1 = 'eng.machining.processes';
const scene = (n, still, title, beats) => ({ id: `s${n}`, lesson: L1, level: 1, dur: 0, still, title, beats });
const spec = {
  id: 'eng.machining.overview',
  title: { nl: 'Van staaf tot as: de vier bewerkingen', en: 'From bar to shaft: the four processes' },
  lessons: [L1],
  scenes: [
    scene(1, 0.9, { nl: 'Verspanen begint bij de zaag', en: 'Machining starts at the saw' }, [
      { nl: 'Verspanen: je snijdt materiaal weg in krulletjes, spanen, tot de vorm van de tekening overblijft.', en: 'Machining: you cut material away in small curls, chips, until the drawing’s shape is left.', cues: ['bar'] },
      { nl: 'Deze as begint als stalen staaf van Ø{n:55} mm. De routing noemt zijn machines, op volgorde.', en: 'This shaft starts as a Ø{n:55} mm steel bar. The route lists its machines, in order.', cues: ['bar'] },
      { nl: 'Stap 1: zagen. Het draaiende zaagblad zakt door de geklemde staaf.', en: 'Step 1: sawing. The spinning blade comes down through the clamped bar.', cues: ['blade'], read: { nl: '1 zagen · {n:1} min', en: '1 saw · {n:1} min' } },
    ]),
    scene(2, 0.8, { nl: 'Draaien', en: 'Turning' }, [
      { nl: 'Stap 2: de CNC-draaibank. De klauwplaat klemt de as.', en: 'Step 2: the CNC lathe. The chuck grips the shaft.', cues: ['turn'] },
      { nl: 'Bij {t:Draaien|draaien} draait het werkstuk en schuift een stilstaande beitel erlangs.', en: 'In {t:Turning|turning} the part spins and a fixed tool moves along it.', cue: { Draaien: 'turn' } },
      { nl: 'Zo ontstaan ronde vormen: Ø{n:50}, met kragen waar de diameter verspringt.', en: 'That makes round shapes: Ø{n:50}, with shoulders where the diameter steps.', cues: ['turn'], read: { nl: '2 draaien · {n:6} min', en: '2 turn · {n:6} min' } },
      { nl: 'De lagerzitting van Ø{n:35} houdt {n:0.2} mm extra, voor het slijpen later.', en: 'The Ø{n:35} bearing seat keeps {n:0.2} mm extra, for grinding later.', cues: ['turn'] },
    ]),
    scene(3, 0.8, { nl: 'Tolerantie', en: 'Tolerance' }, [
      { nl: 'De {t:Tolerantie|tolerantie} zegt hoeveel een maat van de tekening mag afwijken.', en: 'The {t:Tolerance|tolerance} says how far a size may deviate from the drawing.', cue: { Tolerantie: 'tol' }, read: { nl: 'Ø{n:50} ±{n:0.02} mm', en: 'Ø{n:50} ±{n:0.02} mm' } },
      { nl: 'Draaien haalt zo’n ±{n:0.02} mm: deze kraag mag 49,98 tot 50,02 mm worden.', en: 'Turning holds about ±{n:0.02} mm: this shoulder may be 49.98 to 50.02 mm.', cues: ['tol'] },
    ]),
    scene(4, 0.75, { nl: 'Frezen', en: 'Milling' }, [
      { nl: 'Stap 3: het bewerkingscentrum, voor wat niet rond is. Bij {t:Frezen|frezen} draait de frees.', en: 'Step 3: the machining centre, for what is not round. In {t:Milling|milling} the cutter spins.', cue: { Frezen: 'mill' } },
      { nl: 'De tafel schuift de vastgeklemde as onder de frees door.', en: 'The table moves the clamped shaft under the cutter.', cues: ['mill'] },
      { nl: 'Zo ontstaat een {t:Spiebaan|spiebaan}: een sleuf van {n:10} mm breed.', en: 'That cuts a {t:Keyway|keyway}: a slot {n:10} mm wide.', cue: { Spiebaan: 'key' }, read: { nl: '3 frezen · {n:3} min', en: '3 mill · {n:3} min' } },
      { nl: 'Daarin valt een spie, zodat een tandwiel met de as meedraait.', en: 'A key sits in it, so a gear turns with the shaft.', cues: ['key'] },
    ]),
    scene(5, 0.8, { nl: 'Boren en ruimen', en: 'Drilling and reaming' }, [
      { nl: 'Boren gebeurt meestal op dezelfde machine, met een draaiende boor. Een geboord gat wordt wat te groot.', en: 'Drilling is mostly done on the same machine, with a spinning drill. A drilled hole comes out a bit big.', cues: ['mill'] },
      { nl: 'Dus boor je iets te klein. Dan haalt een {t:Ruimer|ruimer} de laatste {n:0.1} tot {n:0.3} mm weg.', en: 'So you drill slightly small. Then a {t:Reamer|reamer} takes off the last {n:0.1} to {n:0.3} mm.', cue: { Ruimer: 'reamer' } },
    ]),
    scene(6, 0.55, { nl: 'Harden', en: 'Hardening' }, [
      { nl: 'Stap 4: {n:3} dagen naar een harderij. Die verhit het staal en koelt het snel af.', en: 'Step 4: {n:3} days at an outside heat treater. It heats the steel and cools it fast.', read: { nl: '4 harden (extern) · {n:3} dagen', en: '4 hardening (outside) · {n:3} days' } },
      { nl: 'Hard staal slijt minder, maar trekt bij harden iets krom. Daarom komt de eindmaat pas daarna.', en: 'Hard steel wears less, but hardening warps it slightly. So the final size comes after.' },
    ]),
    scene(7, 0.7, { nl: 'Slijpen', en: 'Grinding' }, [
      { nl: 'Stap 5: de rondslijpmachine. De as draait tussen centers, tegen een snelle slijpschijf.', en: 'Step 5: the cylindrical grinder. The shaft turns between centres, against a fast wheel.', cues: ['grind'] },
      { nl: 'Bij {t:Slijpen|slijpen} halen harde korrels piepkleine beetjes weg, als schuurpapier.', en: 'In {t:Grinding|grinding} hard grains take off tiny amounts, like fine sandpaper.', cue: { Slijpen: 'grind' }, read: { nl: '5 slijpen · {n:4} min', en: '5 grind · {n:4} min' } },
      { nl: 'Zo gaat de laatste {n:0.2} mm eraf, tot ±{n:0.005} mm of beter.', en: 'So the last {n:0.2} mm comes off, to ±{n:0.005} mm or better.', cues: ['grind'] },
      { nl: 'De lagerzitting (k6) staat maar {n:16} µm toe: te krap voor draaien op hard staal.', en: 'The seat (k6) allows only {n:16} µm: too tight for turning hard steel.', cues: ['grind'], read: { nl: 'Ø{n:35} k6 · {n:16} µm', en: 'Ø{n:35} k6 · {n:16} µm' } },
    ]),
    scene(8, 0.6, { nl: 'Elke vorm zijn machine', en: 'Each shape its machine' }, [
      { nl: 'Elke vorm heeft zijn machine: rond van de draaibank,', en: 'Each shape has its machine: round from the lathe,', cues: ['f-turn'] },
      { nl: 'de spiebaan van de frees, het gat van boor en ruimer,', en: 'the keyway from the cutter, the hole from drill and reamer,', cues: ['f-key', 'f-hole'] },
      { nl: 'de lagerzitting van de slijpmachine.', en: 'the seat from the grinder.', cues: ['f-seat'] },
      { nl: 'Bewerkingstijd {n:14} minuten. Doorlooptijd, van start tot klaar: zo’n {n:6} dagen, vooral harden en wachten.', en: 'Cutting time {n:14} minutes. Lead time, start to finish: about {n:6} days, mostly hardening and waiting.' },
    ]),
  ],
  skip: [],
};

// Each scene lasts what its captions need (the kit's reading pace) plus a breath.
const lessons = await allLessons();
for (const [i, s] of resolveFilm(spec, lessons).scenes.entries()) {
  const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
  spec.scenes[i].dur = Math.ceil(minSceneDur(words) + 0.3);
}
const DUR = spec.scenes.map((s) => s.dur);

// beat starts as a share of each scene (Dutch word shares), so the stage moves with the captions
const resolved = resolveFilm(spec, lessons);
const BEATS = resolved.scenes.map((s) => beatStarts(s, 'nl').map((t) => Math.round((t / s.dur) * 1000) / 1000));

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, tangentOf, solidOf, prismOf, lathe, disc, ringBand, dotsOf, arcOf, circleOf, dot3, add3, sub3, mul3 };})();\n`;
const C = { ST, PROF, STOCK, KEYS, HOLE_S, KEY, HOLE, NODES, dur: DUR, FLOOR };
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst BEATS = ${JSON.stringify(BEATS)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-floor{fill:var(--anatomy-shade-1);stroke:none}
.fp-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-mouth{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-chip{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-spark{fill:none;stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-groove{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-node{fill:var(--anatomy-card);stroke:var(--anatomy-mid);stroke-width:1.4}
.fp-node-t{fill:var(--anatomy-muted)}
[data-state="done"] .fp-node{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi)}
[data-state="done"] .fp-node-t{fill:var(--anatomy-strong)}
[data-state="now"] .fp-node{fill:var(--fp-accent);stroke:var(--fp-accent)}
[data-state="now"] .fp-node-t{fill:var(--fp-on-accent)}
[data-cue][data-on] .fp-groove{fill:var(--fp-accent);stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een werkvloer met vijf stations op een rij: een cirkelzaag, een CNC-draaibank, een bewerkingscentrum, een hardingsoven en een rondslijpmachine. Een stalen as gaat er op een karretje langs en krijgt bij elke machine een vorm erbij.',
  en: 'A shop floor with five stations in a row: a circular saw, a CNC lathe, a machining centre, a hardening furnace and a cylindrical grinder. A steel shaft travels past them on a cart and gains a shape at each machine.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

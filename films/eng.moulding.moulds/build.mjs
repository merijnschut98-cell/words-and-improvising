// Dev tool, not shipped. Builds the explainer film "De matrijs als
// gereedschap / The mould as a tool" for the topic Matrijzen of Spuitgieten (tooling L1,
// mouldparts L2, mouldcare L3, newmould L4).
//
//   node films/eng.moulding.moulds/build.mjs            build the page
//   node films/eng.moulding.moulds/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.moulds.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.3.
//
// Scope, next to the film eng.moulding.setting ("Binnen in de matrijs", the
// melt and the process window): this film is about the mould as a TOOL. The
// melt's route (sprue, runner, gate, cavity), cold versus hot runner, cooling,
// venting, ejection, draft, the slide, the shot counter and maintenance, the
// mould change, and the road of a new mould from DFM to T0, T1 and PPAP. It
// never sets a speed, a switchover or a hold pressure.
//
// The drawing: the two-cavity housing mould of the figure eng.moulding.mould
// (2 × 18 g parts, a 6 g cold runner, a side clip per cavity, so a slide per
// cavity), laid on its side as it hangs in a horizontal press and cut open
// through the sprue (the plane y = 0). On the left the barrel's nozzle and the
// fixed half (locating ring, clamp plate, sprue bushing, the cavity plate with
// angle pins), on the right the moving half (core plate
// with the cores and the slides, support plate, spacer rails, the ejector
// plates with their pins, the clamp plate and the ejector rod). A hot-runner
// manifold can replace the sprue and the runner. Cards in stage space carry
// the sums and the plans.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' and the narration's {n:...} numbers are then
// checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// tooling: 40 changes a week, 90 → 30 min, € 60 an hour; lead time 10–16 weeks; PM 50.000–100.000 shots; change 1–2 h → SMED 15–30 min
const SMED = { changes: 40, before: 90, after: 30, rate: 60 };
const SMED_H = (SMED.changes * (SMED.before - SMED.after)) / 60;
assert(SMED_H === 40, '40 × (90 − 30) min = 40 h a week');
assert(SMED.changes * SMED.before / 60 === 60, '40 × 90 min = 60 h of press time');
assert(SMED_H * SMED.rate === 2400, '40 h × € 60 = € 2.400 a week');
const LEAD = [10, 16];
const PM_RANGE = [50000, 100000];
const COST = { simple: 20000, big: [100000, 300000] };
// mouldparts: 2 × 18 g + 6 g runner = 42 g; runner 6 / 42 = 14 %; regrind limit 15 % fits, 10 % does not
const SHOT = { cav: 2, part: 18, runner: 6 };
const SHOT_G = SHOT.cav * SHOT.part + SHOT.runner;
assert(SHOT_G === 42, '2 × 18 + 6 = 42 g');
const RUNNER_PCT = Math.round((100 * SHOT.runner) / SHOT_G);
assert(RUNNER_PCT === 14, '6 / 42 = 14 %');
assert((100 * SHOT.runner) / SHOT_G < 15 && (100 * SHOT.runner) / SHOT_G > 10, '14 % under the 15 % limit, over the 10 %');
const DRAFT = 1; // ° per side, "vaak zo’n 1°"
// mouldcare: 8 cavities, 12 s, 120 h a week → 36.000 shots; PM every 100.000 → 2,8 weeks; the slide every 30.000
const CARE = { cav: 8, cycle: 12, hours: 120, pm: 100000, slide: 30000 };
const WEEK = (CARE.hours * 3600) / CARE.cycle;
assert(WEEK === 36000, '120 × 3.600 / 12 = 36.000 shots a week');
assert(near(Math.round((CARE.pm / WEEK) * 10) / 10, 2.8), '100.000 / 36.000 = 2,8 weeks');
// newmould: 1,5 million parts, 2 cavities = 750.000 shots; A class 103 € 45.000 under 500.000 → 2 moulds; B class 101 € 75.000
const NEW = { parts: 1500000, cav: 2, A: { cls: 103, price: 45000, life: 500000 }, B: { cls: 101, price: 75000, life: 1000000 }, ppap: 300 };
const NEW_SHOTS = NEW.parts / NEW.cav;
assert(NEW_SHOTS === 750000, '1,5 million / 2 = 750.000 shots');
const MOULDS_A = Math.ceil(NEW_SHOTS / NEW.A.life);
assert(MOULDS_A === 2, 'class 103, under 500.000 cycles → 2 moulds');
assert(near((MOULDS_A * NEW.A.price) / NEW.parts, 0.06), '2 × 45.000 / 1.500.000 = € 0,060');
assert(near(NEW.B.price / NEW.parts, 0.05), '75.000 / 1.500.000 = € 0,050');
assert(NEW_SHOTS <= NEW.B.life, 'class 101 covers 750.000 shots');
assert(NEW_SHOTS > NEW.A.life, 'class 103 does not cover 750.000 shots');
assert(MOULDS_A * NEW.A.price - NEW.B.price === 15000, 'B saves € 15.000 over the life');
// SPI/PLASTICS AR-106 mould classes, cycle life (the SPI card): 101 ≥ 1 million,
// 102 ≤ 1 million, 103 < 500.000, 104 < 100.000, 105 prototype, about 500
const SPI = [['101', 1000000, '≥'], ['102', 1000000, '≤'], ['103', 500000, '<'], ['104', 100000, '<'], ['105', 500, '~']];
assert(SPI[0][1] === NEW.B.life && SPI[2][1] === NEW.A.life, 'the quotes use the SPI class lives');
// vents 0,01–0,05 mm deep, material dependent: the same range as the film eng.moulding.defects
const VENT = [0.01, 0.05];
assert(VENT[0] < VENT[1] && VENT[1] <= 0.05, 'vent depth range');

// ---------------------------------------------------------------- the world
// x across the mould from the nozzle (left) to the moving clamp plate (right),
// y toward the viewer, z up. The parting plane is x = 0. Everything is cut open
// at y = 0: the parts are drawn from y < 0 and their cut faces lie in y = 0.
const W = 640;
const H = 400;
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const PL = 0;
const DEPTH = 150; // the mould behind the section
const ZT = 162; // plate half height
const BAR = { x0: -196, x1: -100, r: 24, bore: 9 };
const NOZ = { x0: -100, x1: -66, r0: 11, r1: 7 };
const LOC = { x0: -76, x1: -66, r: 34 };
const FCP = [-66, -44]; // fixed clamp plate
const APL = [-44, PL]; // cavity plate (A)
const BPL = [PL, 46]; // core plate (B)
const SUP = [46, 60]; // support plate
const RAIL = [60, 110]; // spacer rails, z ±(RAIL_Z..ZT)
const RAIL_Z = 118;
const MCP = [110, 132]; // moving clamp plate
const EJR = [82, 92]; // ejector retainer plate (back)
const EJP = [92, 104]; // ejector plate
const EJ_Z = 110;
const EJ_STROKE = 20;
const ROD = { x1: 168, r: 7 };
const SPRUE = { x0: -66, r0: 2.6, r1: 4.6 };
const BUSH = { r: 11, head: 17, hx: -58 };
const RUN = { z: 46, h: 3 }; // runner along the parting plane, to z = ±46
// the housing, top cavity; the bottom one is mirrored (z → −z)
const CAV = { x0: -22, z0: 50, z1: 124, t: 4 }; // pocket in the A plate, from x0 to PL
const CORE = { x0: CAV.x0 + CAV.t, z0: CAV.z0 + CAV.t, z1: CAV.z1 - CAV.t };
const HOLE = { x0: -11, x1: -6 }; // the side hole for the clip: the undercut
const GATE = { a: [2, RUN.z - 3], b: [-6, CAV.z0 + 0.6], ra: 2.6, rb: 0.9 }; // tunnel gate, below the parting line
const SLIDE = { x0: -12, x1: 26, z0: CAV.z1, z1: 154, lift: 8.6 };
const PIN_A = { a: [-32, 128], b: [14, 143] }; // angle pin, fixed in the A plate
const PIN_TAN = (PIN_A.b[1] - PIN_A.a[1]) / (PIN_A.b[0] - PIN_A.a[0]);
const PINS = [CORE.z0 + 16, CORE.z1 - 16]; // ejector pins under the core, per cavity
const OPEN = 70; // opening stroke drawn
const COOL_A = [[-34, 28], [-34, 92], [-34, 152]];
const COOL_B = [[34, 28], [37, 148]];
const BAFFLE = { z: (CORE.z0 + CORE.z1) / 2, r: 4, x0: CORE.x0 + 4, x1: SUP[1] };
const HOT = { x0: -42, x1: -30, z: 100, ch: 1.6, drop: [-30, CAV.x0], dz: (CAV.z0 + CAV.z1) / 2 };
assert(Math.abs((Math.atan(PIN_TAN) * 180) / Math.PI - 18) < 1, 'angle pin at about 18°');
assert(Math.abs(PIN_TAN * (PIN_A.b[0] - SLIDE.x0) - SLIDE.lift) < 0.2, 'the slide lifts tan(18°) × its travel on the pin');
assert(SLIDE.lift > CAV.t, 'the slide lifts clear of the clip hole');

const FIT = [
  ...k.boxCorners({ x: BAR.x0, y: -DEPTH, w: ROD.x1 - BAR.x0, d: DEPTH }, -ZT - 10, ZT + 20),
];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 62, elevation: 26 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0.8, ...plan }, z0, z1 - z0, P, 4, bevel), style);
const cut = (x0, x1, d, z0, z1, style = {}, bevel = 0.6) => box({ x: x0, y: -d, w: x1 - x0, d }, z0, z1, style, bevel);
const semi = (r, n = 28) => Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI / 2 + (Math.PI * i) / n; return [r * Math.cos(a), r * Math.sin(a)]; });
const hcyl = (x0, x1, r, style = {}, z = 0) => S(G.prismOf(G.frameOf([0, 0, z], X, Y, Z), semi(r), x0, x1, P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const sp = ([x, z]) => at([x, 0, z]);
const secPath = (pts) => k.pathOf(pts.map(sp), true);
const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const flip = (pts) => pts.map(([x, z]) => [x, -z]).reverse();
const sec = (pts, cls = 'fp-sec') => `<path class="${cls}" d="${secPath(pts)}"/>`;
const both = (pts, cls) => sec(pts, cls) + sec(flip(pts), cls);
function hatch(x0, x1, z0, z1, step = 11) {
  const segs = [];
  for (let c = Math.ceil((x0 - z1) / step) * step; c <= x1 - z0; c += step) {
    const za = Math.max(z0, x0 - c);
    const zb = Math.min(z1, x1 - c);
    if (zb - za > 0.5) segs.push(k.pathOf([sp([za + c, za]), sp([zb + c, zb])]));
  }
  return `<path class="fp-hatch" d="${segs.join('')}"/>`;
}
const outline = (pts) => `<path class="fp-cutline" d="${secPath(pts)}"/>`;
const steelSec = (x0, x1, z0, z1, step = 13) => sec(rect(x0, x1, z0, z1)) + hatch(x0, x1, z0, z1, step) + outline(rect(x0, x1, z0, z1));
const ring = (cx, cz, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cz + r * Math.sin((i / n) * Math.PI * 2)]);
const dots = (pts, size = 0.55, tone = 'mid') => k.dotsSvg(pts.map(at), { size, tone });
const water = (cx, cz, r = 4.5) => `<path class="fp-water" d="${secPath(ring(cx, cz, r))}"/><path class="fp-cutline" d="${secPath(ring(cx, cz, r))}"/>`;
const cool = (list) => list.map(([x, z]) => water(x, z) + water(x, -z)).join('');
// a stem of round bar on top of a plate (a water nipple, an eye bolt's shank)
const stem = (x, y, z, r, h, style = {}) => S(G.solidOf([[0, r], [h, r]], G.frameOf([x, y, z], Z, X, Y), P), { tone: 'hi', crease: 'lo', ...style });

// ---------------------------------------------------------------- the barrel's nose (only the end of the machine)
const barrel = [
  hcyl(BAR.x0, BAR.x1, BAR.r),
  ...[[-184, -164], [-152, -132], [-120, -104]].map(([a, b]) => hcyl(a, b, BAR.r + 4, { crease: 'lo' })),
  S(G.prismOf(G.frameOf([0, 0, 0], X, Y, Z), semi(NOZ.r0), NOZ.x0, NOZ.x0 + 14, P), { tone: 'mid' }),
  hcyl(NOZ.x0 + 14, NOZ.x1, NOZ.r1, { tone: 'hi' }),
].join('');
const barrelSec = [
  steelSec(BAR.x0, BAR.x1, BAR.bore, BAR.r, 9), steelSec(BAR.x0, BAR.x1, -BAR.r, -BAR.bore, 9),
  sec(rect(BAR.x0, BAR.x1, -BAR.bore, BAR.bore), 'fp-melt'),
  ...[[-184, -164], [-152, -132], [-120, -104]].map(([a, b]) => sec(rect(a, b, BAR.r, BAR.r + 4), 'fp-band') + sec(rect(a, b, -BAR.r - 4, -BAR.r), 'fp-band')),
  steelSec(NOZ.x0, NOZ.x0 + 14, -NOZ.r0, NOZ.r0, 8), steelSec(NOZ.x0 + 14, NOZ.x1, -NOZ.r1, NOZ.r1, 7),
  sec([[BAR.x1, -BAR.bore], [NOZ.x0 + 14, -2.6], [NOZ.x1, -2.6], [NOZ.x1, 2.6], [NOZ.x0 + 14, 2.6], [BAR.x1, BAR.bore]], 'fp-melt'),
].join('');

// ---------------------------------------------------------------- the fixed half
const fixedSolid = [
  // locating ring, clamp plate with its overhang for the press's clamps, cavity plate
  hcyl(LOC.x0, LOC.x1, LOC.r, { crease: 'lo' }),
  cut(FCP[0], FCP[1], DEPTH, -ZT - 10, ZT + 10),
  L(k.sideSeam({ x: FCP[0], y: -DEPTH, w: FCP[1] - FCP[0], d: DEPTH, r: 0.8 }, ZT, P, 4), { tone: 'faint' }),
  cut(APL[0], APL[1], DEPTH, -ZT, ZT),
  L(k.sideSeam({ x: APL[0], y: -DEPTH, w: APL[1] - APL[0], d: DEPTH, r: 0.8 }, ZT - 10, P, 4), { tone: 'faint' }),
  // socket-head screws on the clamp plate's top, a lifting eye, two water nipples on the A plate
  dots([[-60, -14, ZT + 10], [-50, -14, ZT + 10], [-60, -136, ZT + 10], [-50, -136, ZT + 10]], 0.55),
  stem(-22, -110, ZT, 3.2, 12), stem(-30, -40, ZT, 2.6, 9), stem(-14, -40, ZT, 2.6, 9),
  S(G.solidOf([[0, 6], [2, 6], [2, 3]], G.frameOf([-22, -110, ZT + 12], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  // a type plate on the clamp plate's top
  `<path class="fp-plate" d="${k.pathOf([[-63, -96, ZT + 10], [-47, -96, ZT + 10], [-47, -56, ZT + 10], [-63, -56, ZT + 10]].map(at), true)}"/>`,
].join('');
const pocket = [[CAV.x0, CAV.z0], [PL, CAV.z0], [PL, CAV.z1], [CAV.x0, CAV.z1]];
const fixedSec = [
  steelSec(LOC.x0, LOC.x1, 12, LOC.r, 7), steelSec(LOC.x0, LOC.x1, -LOC.r, -12, 7),
  steelSec(FCP[0], FCP[1], 12, ZT + 10, 13), steelSec(FCP[0], FCP[1], -ZT - 10, -12, 13),
  steelSec(APL[0], APL[1], -ZT, ZT, 13),
  // the slide's pocket in the A plate (the slide's nose shuts off here)
  both(rect(SLIDE.x0, PL, SLIDE.z0, SLIDE.z1), 'fp-bore'),
  both(pocket, 'fp-bore'),
  cool(COOL_A),
].join('');
// the sprue bushing: a hardened insert with the cone through it
const spruePoly = [[SPRUE.x0, -SPRUE.r0], [PL, -SPRUE.r1], [PL, SPRUE.r1], [SPRUE.x0, SPRUE.r0]];
const bushSec = [
  sec([[SPRUE.x0, -BUSH.head], [BUSH.hx, -BUSH.head], [BUSH.hx, -BUSH.r], [PL, -BUSH.r], [PL, BUSH.r], [BUSH.hx, BUSH.r], [BUSH.hx, BUSH.head], [SPRUE.x0, BUSH.head]], 'fp-steel'),
  sec(spruePoly, 'fp-bore'),
].join('');
// the runner and the tunnel gates: channels in the parting plane and under it
const runnerPoly = rect(-RUN.h, RUN.h, -RUN.z, RUN.z);
const gatePoly = (() => {
  const [ax, az] = GATE.a;
  const [bx, bz] = GATE.b;
  const dx = bx - ax;
  const dz = bz - az;
  const d = Math.hypot(dx, dz);
  const nx = -dz / d;
  const nz = dx / d;
  return [[ax + nx * GATE.ra, az + nz * GATE.ra], [bx + nx * GATE.rb, bz + nz * GATE.rb], [bx - nx * GATE.rb, bz - nz * GATE.rb], [ax - nx * GATE.ra, az - nz * GATE.ra]];
})();
const channelSec = [sec(runnerPoly, 'fp-bore'), both(gatePoly, 'fp-bore')].join('');
// angle pins, fixed in the A plate and reaching into the slides (the guide
// pillars sit at the mould's corners, out of this section)
const anglePin = (() => {
  const [ax, az] = PIN_A.a;
  const [bx, bz] = PIN_A.b;
  const d = Math.hypot(bx - ax, bz - az);
  const nx = -(bz - az) / d * 3;
  const nz = (bx - ax) / d * 3;
  const pts = [[ax + nx, az + nz], [bx + nx, bz + nz], [bx - nx * 0.4 + (bx - ax) / d * 2, bz - nz * 0.4 + (bz - az) / d * 2], [bx - nx, bz - nz], [ax - nx, az - nz]];
  return both(pts, 'fp-steel');
})();
// the heel blocks lock the slides when the mould is shut
const heel = both([[-12, SLIDE.z1], [PL, SLIDE.z1], [PL, SLIDE.z1 + 10], [-26, SLIDE.z1 + 10]], 'fp-steel');
const partingLine = `<path class="fp-mark fp-thick" d="${k.pathOf([sp([PL, -ZT]), sp([PL, ZT])])}"/>`;

// ---------------------------------------------------------------- the hot runner (replaces sprue and runner)
const hotSec = [
  // the air gap round the manifold, the manifold with its melt channel, two drops into the cavities
  sec(rect(HOT.x0 - 1.5, HOT.x1 + 1.5, -HOT.z - 8, HOT.z + 8), 'fp-bore'),
  sec(rect(HOT.x0, HOT.x1, -HOT.z - 6, HOT.z + 6), 'fp-steel'),
  sec(rect(HOT.x0 + 5, HOT.x0 + 5 + 2 * HOT.ch, -HOT.dz, HOT.dz), 'fp-melt'),
  sec(rect(SPRUE.x0, HOT.x0 + 5 + 2 * HOT.ch, -2.4, 2.4), 'fp-melt'),
  ...[1, -1].map((s) => [
    sec(rect(HOT.drop[0], HOT.drop[1], s * HOT.dz - 7, s * HOT.dz + 7), 'fp-steel'),
    sec(rect(HOT.x0 + 5, HOT.drop[1], s * HOT.dz - 1.6, s * HOT.dz + 1.6), 'fp-melt'),
    // heater bands on the drop, heater zones in the manifold
    sec(rect(HOT.drop[0] + 1, HOT.drop[1] - 1, s * HOT.dz + 7, s * HOT.dz + 9), 'fp-band'),
    sec(rect(HOT.drop[0] + 1, HOT.drop[1] - 1, s * HOT.dz - 9, s * HOT.dz - 7), 'fp-band'),
  ].join('')),
  ...[-70, -24, 24, 70].map((z) => `<circle class="fp-heat" cx="${sp([HOT.x1 - 3, z])[0].toFixed(2)}" cy="${sp([HOT.x1 - 3, z])[1].toFixed(2)}" r="1.6"/>`),
  outline(rect(HOT.x0, HOT.x1, -HOT.z - 6, HOT.z + 6)),
].join('');
// the hot runner's junction box and cable on the mould's top
const hotTop = [
  cut(-40, -8, 34, ZT, ZT + 16, { tone: 'mid' }, 0.4),
  dots([[-37, -2, ZT + 16], [-11, -2, ZT + 16]], 0.45, 'hi'),
  stem(-24, -18, ZT + 16, 4, 8),
].join('');

// ---------------------------------------------------------------- the moving half
const movingSolid = [
  cut(BPL[0], BPL[1], DEPTH, -ZT, ZT),
  L(k.sideSeam({ x: BPL[0], y: -DEPTH, w: BPL[1] - BPL[0], d: DEPTH, r: 0.8 }, ZT - 10, P, 4), { tone: 'faint' }),
  cut(SUP[0], SUP[1], DEPTH, -ZT, ZT),
  cut(RAIL[0], RAIL[1], DEPTH, RAIL_Z, ZT),
  cut(RAIL[0], RAIL[1], DEPTH, -ZT, -RAIL_Z),
  cut(MCP[0], MCP[1], DEPTH, -ZT - 10, ZT + 10),
  L(k.sideSeam({ x: MCP[0], y: -DEPTH, w: MCP[1] - MCP[0], d: DEPTH, r: 0.8 }, ZT, P, 4), { tone: 'faint' }),
  dots([[116, -14, ZT + 10], [126, -14, ZT + 10], [116, -136, ZT + 10], [126, -136, ZT + 10]], 0.55),
  dots([[66, -10, ZT], [104, -10, ZT], [66, -140, ZT], [104, -140, ZT]], 0.5),
  stem(30, -40, ZT, 2.6, 9), stem(16, -40, ZT, 2.6, 9),
].join('');
const corePoly = [[PL, CORE.z0], [CORE.x0, CORE.z0], [CORE.x0, CORE.z1], [PL, CORE.z1]];
const movingSec = [
  steelSec(BPL[0], BPL[1], -ZT, ZT, 13),
  // the cores stand proud of the parting face into the cavities
  both(corePoly, 'fp-sec'),
  `<g>${hatch(CORE.x0, PL, CORE.z0, CORE.z1, 13)}${hatch(CORE.x0, PL, -CORE.z1, -CORE.z0, 13)}</g>`,
  outline(corePoly), outline(flip(corePoly)),
  // the slides' pockets in the core plate, the cold-slug well with the sprue puller
  both(rect(PL, SLIDE.x1 + 1, SLIDE.z0, SLIDE.z1 + 13), 'fp-bore'),
  sec(rect(PL, 10, -4, 4), 'fp-bore'),
  steelSec(SUP[0], SUP[1], -ZT, ZT, 9),
  steelSec(RAIL[0], RAIL[1], RAIL_Z, ZT, 13), steelSec(RAIL[0], RAIL[1], -ZT, -RAIL_Z, 13),
  sec(rect(RAIL[0], RAIL[1], -RAIL_Z, RAIL_Z), 'fp-bore'),
  steelSec(MCP[0], MCP[1], ROD.r + 3, ZT + 10, 13), steelSec(MCP[0], MCP[1], -ZT - 10, -ROD.r - 3, 13),
  sec(rect(MCP[0], MCP[1], -ROD.r - 3, ROD.r + 3), 'fp-bore'),
  // bores of the ejector pins through core plate and support plate
  ...[...PINS, ...PINS.map((z) => -z), 0].map((z) => sec(rect(z === 0 ? 10 : CORE.x0, SUP[1], z - 2.6, z + 2.6), 'fp-bore')),
].join('');
const coolB = cool(COOL_B);
// the water up and down through the core: a bore with a baffle down its middle
const baffleSec = [1, -1].map((s) => [
  sec(rect(BAFFLE.x0, BAFFLE.x1, s * BAFFLE.z - BAFFLE.r, s * BAFFLE.z + BAFFLE.r), 'fp-water'),
  outline(rect(BAFFLE.x0, BAFFLE.x1, s * BAFFLE.z - BAFFLE.r, s * BAFFLE.z + BAFFLE.r)),
  sec(rect(BAFFLE.x0 + 3, BAFFLE.x1, s * BAFFLE.z - 0.6, s * BAFFLE.z + 0.6), 'fp-steel'),
].join('')).join('');
// the shot counter on the core plate's top: a housing with a window of digits
const counterSolid = [
  box({ x: 6, y: -78, w: 34, d: 44 }, ZT, ZT + 16, { tone: 'mid' }, 0.5),
  `<path class="fp-plate" d="${k.pathOf([[10, -34, ZT + 4], [36, -34, ZT + 4], [36, -34, ZT + 12], [10, -34, ZT + 12]].map(at), true)}"/>`,
  L([14, 19, 24, 29].map((x) => k.segment([x, -34, ZT + 5.5], [x, -34, ZT + 10.5], P)).join(''), { tone: 'lo', free: true }),
  dots([[8, -36, ZT + 16], [38, -36, ZT + 16], [8, -76, ZT + 16], [38, -76, ZT + 16]], 0.4, 'hi'),
].join('');
// the slide: a steel block with the clip's core pin on its nose, a wear plate on top
const slideSec = (s) => [
  sec(s > 0 ? rect(SLIDE.x0, SLIDE.x1, SLIDE.z0, SLIDE.z1) : flip(rect(SLIDE.x0, SLIDE.x1, SLIDE.z0, SLIDE.z1)), 'fp-sec'),
  `<g>${s > 0 ? hatch(SLIDE.x0, SLIDE.x1, SLIDE.z0, SLIDE.z1, 9) : hatch(SLIDE.x0, SLIDE.x1, -SLIDE.z1, -SLIDE.z0, 9)}</g>`,
  outline(s > 0 ? rect(SLIDE.x0, SLIDE.x1, SLIDE.z0, SLIDE.z1) : flip(rect(SLIDE.x0, SLIDE.x1, SLIDE.z0, SLIDE.z1))),
  sec(s > 0 ? rect(HOLE.x0, HOLE.x1, CORE.z1, SLIDE.z0) : flip(rect(HOLE.x0, HOLE.x1, CORE.z1, SLIDE.z0)), 'fp-steel'),
  // the angle pin's hole through the slide
  ((pts) => sec(s > 0 ? pts : flip(pts), 'fp-bore'))((() => {
    const [ax, az] = PIN_A.a;
    const [bx, bz] = PIN_A.b;
    const d = Math.hypot(bx - ax, bz - az);
    const nx = -(bz - az) / d * 3.6;
    const nz = (bx - ax) / d * 3.6;
    const t0 = (SLIDE.x0 - ax) / (bx - ax);
    const x0 = ax + (bx - ax) * t0;
    const z0 = az + (bz - az) * t0;
    const x1 = SLIDE.x1;
    const z1 = az + (bz - az) * ((x1 - ax) / (bx - ax));
    return [[x0 + nx, z0 + nz], [x1 + nx, z1 + nz], [x1 - nx, z1 - nz], [x0 - nx, z0 - nz]];
  })()),
].join('');
const wearPlate = (s) => sec(s > 0 ? rect(PL + 2, SLIDE.x1, SLIDE.z1, SLIDE.z1 + 3) : flip(rect(PL + 2, SLIDE.x1, SLIDE.z1, SLIDE.z1 + 3)), 'fp-steel');
// the ejector set: retainer and ejector plate, pins, the sprue puller, the rod
const ejectSec = [
  steelSec(EJR[0], EJR[1], -EJ_Z, EJ_Z, 8),
  steelSec(EJP[0], EJP[1], -EJ_Z, EJ_Z, 8),
  ...[...PINS, ...PINS.map((z) => -z)].map((z) => sec(rect(CORE.x0, EJR[0] + 4, z - 2, z + 2), 'fp-steel') + sec(rect(EJR[0] + 1, EJR[1], z - 3.4, z + 3.4), 'fp-steel')),
  // the sprue puller: a pin with an undercut head that holds the cold slug
  sec([[10, -2.4], [EJR[0] + 4, -2.4], [EJR[0] + 4, 2.4], [10, 2.4], [6, 2.4], [6, -1], [3, -1], [3, 2.4]].map(([x, z]) => [x, z]), 'fp-steel'),
  sec(rect(EJP[1], ROD.x1, -ROD.r, ROD.r), 'fp-steel'),
  outline(rect(EJP[1], ROD.x1, -ROD.r, ROD.r)),
].join('');

// ---------------------------------------------------------------- clip paths
const defs = `<defs>
<clipPath id="fm-run"><path d="${secPath(runnerPoly)}"/></clipPath>
</defs>`;

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('barrel', barrel + barrelSec, ' data-cue="nozzle"'),
  g('fixed', fixedSolid + fixedSec),
  g('coolA', '', ' data-cue="cool"'),
  g('bush', bushSec + channelSec, ' data-cue="sprue"'),
  g('hot', hotSec, ' data-cue="hot"'),
  g('hotTop', hotTop, ' data-cue="hot"'),
  g('heel', heel),
  g('mov', [movingSolid, movingSec, `<g data-cue="cool">${coolB}</g>`, `<g data-cue="core">${baffleSec}</g>`, `<g data-cue="counter">${counterSolid}</g>`].join('')),
  `<g data-cue="wear">${g('pins', ejectSec, ' data-cue="pins"')}</g>`,
  g('meltAll', [
    g('runFall', `<g data-cue="sprue">${g('sprM', '')}</g><g data-cue="runner">${g('runM', '')}</g><g data-cue="gate"><g data-cue="tunnel">${g('gateM', '')}</g></g>`),
    g('partFall', `<g data-cue="cavity">${g('partM', '')}</g>${g('undercut', '', ' data-cue="undercut"')}${g('fillC', '', ' data-cue="sim"')}`),
  ].join('')),
  g('slideT', `<g data-cue="wear">${wearPlate(1)}</g>${slideSec(1)}`, ' data-cue="slide"'),
  g('slideB', `<g data-cue="wear">${wearPlate(-1)}</g>${slideSec(-1)}`, ' data-cue="slide"'),
  g('apin', anglePin),
  g('draft', '', ' data-cue="draft"'),
  g('vent', '', ' data-cue="vent"'),
  g('edge', ''),
  g('parting', partingLine, ' data-cue="parting"'),
  g('flow', ''),
].join('');

// ---------------------------------------------------------------- cards (stage space, not under the camera)
const slot = (cue, key) => `<g data-cue="${cue}">${g(key, '')}</g>`;
const hud = [
  g('chC', [slot('cold', 'chCold'), slot('hot', 'chHot')].join('')),
  g('tlC', slot('t1', 'tlBody')),
  g('pmC', slot('pm', 'pmBody')),
  g('cntC', slot('counter', 'cntBody')),
  g('smC', slot('smed', 'smBody')),
  g('shC', slot('shot', 'shBody')),
  g('planC', slot('plan', 'planBody')),
  g('wearC', slot('wear', 'wearBody')),
  g('logC', slot('log', 'logBody')),
  g('lastC', slot('last', 'lastBody')),
  g('setC', [g('setBase', ''), slot('internal', 'setInt'), slot('external', 'setExt')].join('')),
  g('roadC', [g('roadBase', ''), slot('dfm', 'rdDfm'), slot('sim', 'rdSim'), slot('spi', 'rdSpi'), slot('t0', 'rdT0'), slot('ppap', 'rdPpap')].join('')),
  g('spiC', slot('spi', 'spiBody')),
].join('');
// Page weight: drop a line point within 0.2 units of the last one kept, only in plain M/L/Z paths.
const slim = (s) => s.replace(/ d="([^"]*)"/g, (m, d) => {
  if (!/^[MLZ0-9 .-]+$/.test(d)) return m;
  const out = [];
  let last = null;
  for (const tok of d.match(/[MLZ][^MLZ]*/g) ?? []) {
    if (tok[0] === 'Z') { out.push('Z'); last = null; continue; }
    const xy = tok.slice(1).trim();
    const [x, y] = xy.split(/\s+/).map(Number);
    if (tok[0] === 'L' && last && Math.hypot(x - last[0], y - last[1]) < 0.2) continue;
    out.push(tok[0] + xy);
    last = [x, y];
  }
  return ` d="${out.join('')}"`;
});
const svg = slim(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${defs}${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
// cam(p, w, s): world point p at stage point s, w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WHOLE = cam([-10, -60, 0], 580);
const SPRV = cam([-56, 0, 0], 340);
const RUNV = cam([-12, 0, 12], 300);
const CAVV = cam([-4, 0, 70], 300);
const OPENV = cam([30, -40, 0], 560);
const LEFT_M = cam([10, -40, 0], 560, [200, 205]); // mould on the left, card on the right
const LEFT_O = cam([40, -40, 0], 620, [205, 205]);
const GATEV = cam([-2, 0, 47], 100, [320, 200]);
const GATEO = cam([40, 0, 40], 330, [200, 200]);
const DRAFTV = cam([OPEN - 9, 0, 112], 200, [200, 200]);
const HOLEV = cam([-12, 0, 122], 100, [320, 200]);
const SIMV = cam([-10, 0, 88], 180, [170, 200]);
const TOPV = cam([10, -75, ZT - 20], 420, [320, 84]);
const SLIDEW = cam([24, 0, 110], 330, [210, 210]);
const FAR = cam([20, -40, 0], 760, [200, 215]);
const KEYS = [
  [WHOLE, SPRV, RUNV, CAVV, OPENV], // s1 how a mould works
  [LEFT_O, LEFT_M, LEFT_M], // s2 cold or hot runner
  [LEFT_M, LEFT_M, LEFT_M, FAR, FAR], // s3 a new mould, maintenance, changes
  [GATEV, GATEO, LEFT_M, LEFT_M], // s4 gates and cooling
  [LEFT_O, DRAFTV, HOLEV, SLIDEW], // s5 release
  [FAR, FAR, FAR, FAR], // s6 planning maintenance
  [TOPV, TOPV, TOPV], // s7 faster changes
  [FAR, SIMV, FAR, FAR, FAR], // s8 from design to release
];

// ---------------------------------------------------------------- the film
const TO = 'eng.moulding.tooling';
const MP = 'eng.moulding.mouldparts';
const MC = 'eng.moulding.mouldcare';
const NM = 'eng.moulding.newmould';
const spec = {
  id: 'eng.moulding.moulds',
  title: { nl: 'De matrijs als gereedschap', en: 'The mould as a tool' },
  lessons: [TO, MP, MC, NM],
  scenes: [
    {
      // v14b: the Basis "how it works" tour, the melt's route through the mould
      id: 's1', lesson: TO, level: 1, still: 0.5, title: { nl: 'Hoe een matrijs werkt', en: 'How a mould works' },
      beats: [
        { nl: 'Een matrijs: twee stalen helften, vast en bewegend, die op de deellijn sluiten.', en: 'A mould: two steel halves, fixed and moving, that meet at the parting line.', cues: ['parting'] },
        { nl: 'De smelt komt de matrijs in door de {t:Aanspuitkegel|aanspuitkegel}, een kegelvormig kanaal.', en: 'The melt enters the mould through the {t:Sprue|sprue}, a cone-shaped channel.', cue: { Aanspuitkegel: 'sprue' } },
        { nl: 'Verdeelkanalen brengen hem naar de holtes; het smalle aanspuitpunt laat hem binnen.', en: 'Runners carry it to the cavities; the narrow gate lets it in.', cues: ['runner', 'gate'] },
        { nl: 'Koelwater haalt de warmte weg; heel ondiepe ontluchting laat de lucht eruit.', en: 'Cooling water takes the heat away; very shallow vents let the air out.', cues: ['cool', 'vent'], read: { nl: 'ontluchting 0,01–0,05 mm diep', en: 'vents 0.01–0.05 mm deep' } },
        { nl: 'De matrijs gaat open; een {t:Uitwerppen|uitwerppen} duwt het product van de kern.', en: 'The mould opens; an {t:Ejector pin|ejector pin} pushes the part off the core.', cue: { Uitwerppen: 'pins' } },
      ],
    },
    {
      id: 's2', lesson: TO, level: 1, still: 0.5, title: { nl: 'Koud of heet kanaal', en: 'Cold or hot runner' },
      beats: [
        { nl: 'Een {t:Koudkanaal|koudkanaal} stolt mee en wordt met de producten uitgeworpen.', en: 'A {t:Cold runner|cold runner} sets with the parts and is ejected with them.', cue: { Koudkanaal: 'cold' }, cues: ['runner'] },
        { nl: 'Een {t:Heetkanaal|heetkanaal} houdt de smelt vloeibaar in een verwarmd verdeelblok.', en: 'A {t:Hot runner|hot runner} keeps the melt molten in a heated manifold.', cue: { Heetkanaal: 'hot' } },
        { nl: 'Geen aanspuitafval en vaak een kortere cyclus, maar een duurdere matrijs.', en: 'No runner waste and often a shorter cycle, but a dearer mould.', cues: ['hot', 'cold'] },
      ],
    },
    {
      id: 's3', lesson: TO, level: 1, still: 0.5, title: { nl: 'Kopen, onderhouden, wisselen', en: 'Buying, servicing, changing' },
      beats: [
        { nl: 'Een nieuwe matrijs: meestal {n:10} tot {n:16} weken, dan {t:T1}, de eerste proef.', en: 'A new mould: typically {n:10} to {n:16} weeks, then {t:T1}, the first trial.', cue: { T1: 't1' } },
        { nl: 'De {t:Shotteller|shotteller} telt elke cyclus: zo weet je wanneer hij aan de beurt is.', en: 'The {t:Shot counter|shot counter} counts every cycle, so you know when it is due.', cue: { Shotteller: 'counter' } },
        { nl: '{t:Preventief onderhoud|Preventief onderhoud}: meestal elke {n:50000} tot {n:100000} shots.', en: '{t:Preventive maintenance|Preventive maintenance}: typically every {n:50000} to {n:100000} shots.', cue: { 'Preventief onderhoud': 'pm' }, cues: ['vent', 'pins'] },
        { nl: 'Een wissel duurt {n:1} tot {n:2} uur; met {t:SMED} vaak {n:15} tot {n:30} minuten.', en: 'A change takes {n:1} to {n:2} hours; with {t:SMED} often {n:15} to {n:30} minutes.', cue: { SMED: 'smed' } },
        { nl: '{n:40} wissels van {n:90} naar {n:30} minuten: {n:40} uur per week vrij.', en: '{n:40} changes from {n:90} to {n:30} minutes: {n:40} hours a week freed.', cues: ['smed'], read: { nl: '{n:40} uur × € {n:60} = € {n:2400} per week', en: '{n:40} h × € {n:60} = € {n:2400} a week' } },
      ],
    },
    {
      id: 's4', lesson: MP, level: 2, still: 0.5, title: { nl: 'Aanspuiting en koeling', en: 'Gates and cooling' },
      beats: [
        { nl: 'Een randaanspuiting zit op de deellijn; een {t:Tunnelaanspuiting|tunnelaanspuiting} er schuin onder.', en: 'An edge gate sits on the parting line; a {t:Tunnel gate|tunnel gate} at an angle below it.', cue: { Tunnelaanspuiting: 'tunnel' } },
        { nl: 'Bij openen en uitwerpen breekt het aanspuitpunt vanzelf af: geen nabewerking.', en: 'As the mould opens and ejects, the gate shears off by itself: no trimming.', cues: ['tunnel'] },
        { nl: 'Eén shot: {n:2} × {n:18} g + {n:6} g = {n:42} g, en {n:14} % daarvan is kanaal.', en: 'One shot: {n:2} × {n:18} g + {n:6} g = {n:42} g, and {n:14} % of it is runner.', cues: ['shot', 'runner'] },
        { nl: 'Koelkanalen lopen door de platen; in een hoge kern gaat het water op en neer.', en: 'Cooling channels run through the plates; in a tall core the water goes up and down.', cues: ['cool', 'core'] },
      ],
    },
    {
      id: 's5', lesson: MP, level: 2, still: 0.5, title: { nl: 'Lossen', en: 'Releasing the part' },
      beats: [
        { nl: 'Het product blijft op de kern; uitwerppennen laten een klein rond merkje achter.', en: 'The part stays on the core; ejector pins leave a small round mark.', cues: ['pins'] },
        { nl: 'Wanden in de openingsrichting krijgen een {t:Lossingshoek|lossingshoek}, vaak zo’n {n:1}° per kant.', en: 'Walls in the opening direction get a {t:Draft angle|draft angle}, often about {n:1}° per side.', cue: { Lossingshoek: 'draft' } },
        { nl: 'Dit zijgat voor een clip is een {t:Ondersnijding|ondersnijding}: het blokkeert het rechte lossen.', en: 'This side hole for a clip is an {t:Undercut|undercut}: it blocks straight release.', cue: { Ondersnijding: 'undercut' } },
        { nl: 'Een schuine pen trekt de {t:Schuif|schuif} opzij; pas daarna duwen de uitwerppennen.', en: 'An angled pin pulls the {t:Slide|slide} aside; only then do the ejector pins push.', cue: { Schuif: 'slide' }, cues: ['pins'] },
      ],
    },
    {
      id: 's6', lesson: MC, level: 3, still: 0.5, title: { nl: 'Onderhoud plannen', en: 'Planning maintenance' },
      beats: [
        { nl: '{n:8} holtes, {n:12} s, {n:120} uur: {n:36000} shots per week; onderhoud elke {n:100000}.', en: '{n:8} cavities, {n:12} s, {n:120} hours: {n:36000} shots a week; service every {n:100000}.', cues: ['plan', 'counter'] },
        { nl: '{t:Slijtdelen|Slijtdelen}: pennen, slijtplaten, afdichtingen, verwarmingen. Kritische op voorraad.', en: '{t:Wear parts|Wear parts}: pins, wear plates, seals, heaters. Critical ones in stock.', cue: { Slijtdelen: 'wear' } },
        { nl: 'Het {t:Matrijslogboek|matrijslogboek}: dezelfde schuif elke {n:30000} shots? Dan is het ontwerp het probleem.', en: 'The {t:Mould logbook|mould logbook}: the same slide every {n:30000} shots? Then the design is the problem.', cue: { Matrijslogboek: 'log' } },
        { nl: 'Het {t:Laatste shot|laatste shot} gaat mee naar de gereedschapmakerij: repareer op de werkbank.', en: 'The {t:Last-shot sample|last-shot sample} goes to the toolroom: repair on the bench.', cue: { 'Laatste shot': 'last' } },
      ],
    },
    {
      id: 's7', lesson: MC, level: 3, still: 0.5, title: { nl: 'Sneller wisselen', en: 'Faster changes' },
      beats: [
        { nl: '{t:Intern omstellen|Intern omstellen} kan alleen als de pers stilstaat, zoals de matrijs losnemen.', en: '{t:Internal setup|Internal setup} can only happen with the press stopped, such as unclamping.', cue: { 'Intern omstellen': 'internal' } },
        { nl: '{t:Extern omstellen|Extern omstellen} gebeurt terwijl de vorige order loopt: voorwarmen, slangen, drogen.', en: '{t:External setup|External setup} is done while the last order runs: pre-heating, hoses, drying.', cue: { 'Extern omstellen': 'external' } },
        { nl: 'Schuif intern naar extern en meet van laatste tot eerste goede product.', en: 'Move internal to external, and measure last good part to first good part.', cues: ['internal', 'external'] },
      ],
    },
    {
      id: 's8', lesson: NM, level: 4, still: 0.5, title: { nl: 'Van ontwerp tot vrijgave', en: 'From design to release' },
      beats: [
        { nl: '{t:DFM}: het product doorlopen met matrijzenmaker en spuitgieter, vóór er staal bewerkt wordt.', en: '{t:DFM}: review the part with toolmaker and moulder before steel is cut.', cue: { DFM: 'dfm' } },
        { nl: 'Een {t:Vulsimulatie|vulsimulatie} voorspelt stroming, bindnaden, druk en kromtrekken.', en: 'A {t:Fill simulation|fill simulation} predicts flow, weld lines, pressure and warpage.', cue: { Vulsimulatie: 'sim' } },
        { nl: '{t:SPI-klasse|SPI-klasse}: {n:101} voor een miljoen cycli of meer, {n:103} onder de {n:500000}.', en: '{t:SPI class|SPI class}: {n:101} for a million cycles or more, {n:103} under {n:500000}.', cue: { 'SPI-klasse': 'spi' } },
        { nl: '{t:T0} bij de matrijzenmaker: werkt hij? Dan T1, met producten die gemeten worden.', en: '{t:T0} at the toolmaker: does it work? Then T1, with parts that get measured.', cue: { T0: 't0' } },
        { nl: '{t:PPAP}: standaard minstens {n:300} opeenvolgende producten, met productiegereedschap op tempo.', en: '{t:PPAP}: by default at least {n:300} consecutive parts, with production tooling at rate.', cue: { PPAP: 'ppap' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Numbers the voice would read badly
// (20.000, 2.400, 36.000, € 0,060) are written as words. A term is named while
// its cue is lit. Dutch about 700 words (cap 360 s at about 3 words a second with pauses).
const SAY = [
  [ // s1 how a mould works
    { nl: 'Dit is een matrijs, opengezaagd. Links de vaste helft, tegen de spuitmond; rechts de bewegende helft, die opengaat. Ze sluiten op de deellijn.',
      en: 'This is a mould, cut open. On the left the fixed half, against the nozzle; on the right the moving half, which opens. They meet at the parting line.' },
    { nl: 'De spuitmond drukt de smelt in de {t:Aanspuitkegel|aanspuitkegel}: een kanaal dat naar binnen wijder wordt, zodat het gestolde stuk eruit kan.',
      en: 'The nozzle pushes the melt into the {t:Sprue|sprue}: a channel that widens inwards, so the set piece can come out.' },
    { nl: 'Verdeelkanalen op de deellijn verdelen hem over de twee holtes. Het aanspuitpunt is expres smal: het stolt als eerste en laat maar een klein merkje achter.',
      en: 'Runners along the parting line share it between the two cavities. The gate is narrow on purpose: it freezes first and leaves only a small mark.' },
    { nl: 'De lucht ontsnapt door de ontluchting: sleufjes van een tot vijf honderdste millimeter diep, afhankelijk van de kunststof, te ondiep voor de smelt. Koelwater haalt de warmte uit het staal.',
      en: 'The air escapes through the vents: slots one to five hundredths of a millimetre deep, depending on the plastic, too shallow for the melt. Cooling water draws the heat out of the steel.' },
    { nl: 'Daarna gaat de matrijs open en duwt een {t:Uitwerppen|uitwerppen} het product van de kern. Een eenvoudige matrijs kost vanaf zo’n twintigduizend euro.',
      en: 'Then the mould opens, and an {t:Ejector pin|ejector pin} pushes the part off the core. A simple mould costs from about twenty thousand euros.' },
  ],
  [ // s2 cold or hot runner
    { nl: 'Wat in de aanspuitkegel en de kanalen zit, stolt mee: een {t:Koudkanaal|koudkanaal}. Bij elk shot komt het mee, als afval of maalgoed.',
      en: 'What sits in the sprue and the runners sets too: a {t:Cold runner|cold runner}. It comes out with every shot, as waste or regrind.' },
    { nl: 'Bij een {t:Heetkanaal|heetkanaal} zit in de vaste helft een verwarmd verdeelblok. Daarin blijft de smelt vloeibaar tot vlak bij de holte.',
      en: 'With a {t:Hot runner|hot runner}, the fixed half holds a heated manifold. In it the melt stays molten up to the cavity.' },
    { nl: 'Dus geen aanspuitafval, en vaak een kortere cyclus. Maar de matrijs is duurder, en een verwarmingszone kan doorbranden of het blok lekken.',
      en: 'So no runner waste, and often a shorter cycle. But the mould costs more, and a heater zone can burn out or the manifold leak.' },
  ],
  [ // s3 buying, servicing, changing
    { nl: 'Een nieuwe matrijs bouwen kost meestal {n:10} tot {n:16} weken. Dan volgt {t:T1}, de eerste proef, en na correcties T2, T3, tot de klant vrijgeeft.',
      en: 'Building a new mould typically takes {n:10} to {n:16} weeks. Then comes {t:T1}, the first trial, and after corrections T2, T3, until the customer approves.' },
    { nl: 'Op de matrijs zit een {t:Shotteller|shotteller}, die bij elke cyclus één bijtelt.',
      en: 'On the mould sits a {t:Shot counter|shot counter}, which adds one for every cycle.' },
    { nl: '{t:Preventief onderhoud|Preventief onderhoud} plan je op die stand, meestal elke vijftig- tot honderdduizend shots: ontluchting schoon, pennen nakijken, koelkanalen ontkalken. Wie het overslaat, krijgt braam.',
      en: 'You plan {t:Preventive maintenance|preventive maintenance} on that count, typically every fifty to a hundred thousand shots: clean the vents, check the pins, descale the channels. Skip it, and you get flash.' },
    { nl: 'Een matrijswissel duurt meestal {n:1} tot {n:2} uur. Met {t:SMED} vaak {n:15} tot {n:30} minuten: voorwarmen, vaste opspanplaten, snelkoppelingen.',
      en: 'A mould change typically takes {n:1} to {n:2} hours. With {t:SMED}, often {n:15} to {n:30} minutes: pre-heating, standard clamp plates, quick couplings.' },
    { nl: 'Stel: {n:40} wissels per week, van {n:90} naar {n:30} minuten: {n:40} uur vrij, bij {n:60} euro per uur tweeduizend vierhonderd euro per week.',
      en: 'Say {n:40} changes a week, from {n:90} to {n:30} minutes: {n:40} hours freed, at {n:60} euros an hour two thousand four hundred euros a week.' },
  ],
  [ // s4 gates and cooling
    { nl: 'Een randaanspuiting zit op de deellijn; die moet je eraf knippen. Deze matrijs heeft een {t:Tunnelaanspuiting|tunnelaanspuiting}, schuin onder de deellijn geboord.',
      en: 'An edge gate sits on the parting line; it has to be cut off. This mould has a {t:Tunnel gate|tunnel gate}, drilled at an angle below the parting line.' },
    { nl: 'Bij openen en uitwerpen knipt het staal het aanspuitpunt vanzelf af.',
      en: 'As the mould opens and ejects, the steel shears the gate off by itself.' },
    { nl: 'Twee producten van {n:18} gram en een kanaal van {n:6}: een shot is {n:42} gram, en {n:14} procent is kanaal. Mag er {n:15} procent maalgoed terug, dan past het net.',
      en: 'Two parts of {n:18} grams and a runner of {n:6}: a shot is {n:42} grams, and {n:14} percent is runner. If {n:15} percent regrind may go back, it just fits.' },
    { nl: 'Koelkanalen zijn door de platen geboord; in een hoge kern leidt een plaatje in de boring het water op en neer.',
      en: 'Cooling channels are drilled through the plates; in a tall core, a baffle in the bore leads the water up and down.' },
  ],
  [ // s5 releasing the part
    { nl: 'Bij het openen blijft het product op de kern. De uitwerppennen duwen op de binnenkant, waar hun ronde merkjes niet opvallen.',
      en: 'When the mould opens, the part stays on the core. The pins push on the inside, where their round marks don’t show.' },
    { nl: 'Elke wand in de openingsrichting krijgt een {t:Lossingshoek|lossingshoek}, vaak zo’n {n:1} graad per kant, zodat het zonder schrapen loskomt. Een structuuroppervlak vraagt meer.',
      en: 'Every wall in the opening direction gets a {t:Draft angle|draft angle}, often about {n:1} degree per side, so the part releases without scraping. A textured surface needs more.' },
    { nl: 'Maar dit zijgat voor een clip is een {t:Ondersnijding|ondersnijding}: het blokkeert het rechte lossen, net als een snaphaak.',
      en: 'But this side hole for a clip is an {t:Undercut|undercut}: it blocks straight release, like a snap hook.' },
    { nl: 'Dus vormt een {t:Schuif|schuif} het gat: een stalen blok dat een schuine pen opzij trekt terwijl de matrijs opengaat. Pas daarna duwen de pennen. Elke schuif kost geld en slijt.',
      en: 'So a {t:Slide|slide} forms the hole: a steel block that an angled pin pulls aside as the mould opens. Only then do the pins push. Every slide costs money and wears.' },
  ],
  [ // s6 planning maintenance
    { nl: 'Van de shotteller maak je een kalender. Een doppenmatrijs: {n:8} holtes, {n:12} seconden per shot, {n:120} uur per week: zesendertigduizend shots. Onderhoud elke honderdduizend is elke {n:2.8} weken, liefst bij een orderwissel.',
      en: 'Turn the shot counter into a calendar. A cap mould: {n:8} cavities, {n:12} seconds a shot, {n:120} hours a week: thirty-six thousand shots. Service every hundred thousand is every {n:2.8} weeks, ideally at an order change.' },
    { nl: '{t:Slijtdelen|Slijtdelen} slijten voorspelbaar: uitwerppennen, slijtplaten, afdichtingen, heetkanaalverwarmingen. Leg de kritische op voorraad.',
      en: '{t:Wear parts|Wear parts} wear out predictably: ejector pins, wear plates, seals, hot-runner heaters. Keep the critical ones in stock.' },
    { nl: 'Het {t:Matrijslogboek|matrijslogboek} legt elke reparatie vast, met de shotstand. Dezelfde schuif elke dertigduizend shots? Dan zit het probleem in het ontwerp.',
      en: 'The {t:Mould logbook|mould logbook} records each repair with the shot count. The same slide every thirty thousand shots? Then the problem is the design.' },
    { nl: 'Komt de matrijs van de pers, dan gaan de laatste producten mee: het {t:Laatste shot|laatste shot}. Zo repareer je braam op de werkbank, niet bij het opstarten.',
      en: 'When the mould comes off, the last parts go with it: the {t:Last-shot sample|last-shot sample}. So flash is repaired on the bench, not during start-up.' },
  ],
  [ // s7 faster changes
    { nl: '{t:Intern omstellen|Intern omstellen} kan alleen als de pers stilstaat: water los, matrijs los, eruit takelen.',
      en: '{t:Internal setup|Internal setup} can only happen with the press stopped: water off, unclamp, crane the mould out.' },
    { nl: '{t:Extern omstellen|Extern omstellen} kan terwijl de vorige order loopt: voorwarmen, slangen klaarleggen, materiaal drogen.',
      en: '{t:External setup|External setup} can happen while the previous order runs: pre-heating, laying out hoses, drying the material.' },
    { nl: 'Film een wissel, klok elke stap en schuif intern werk naar extern. De maatstaf: van laatste tot eerste goede product. Meer in de module Capaciteit en flow.',
      en: 'Film a change, time each step and move internal work to external. The measure: last good part to first good part. More on this in the Capacity and flow module.' },
  ],
  [ // s8 from design to release
    { nl: 'Bij {t:DFM} lopen matrijzenmaker en spuitgieter het product door: gelijke wanden, ribben van {n:40} tot {n:60} procent van de wand, genoeg lossing.',
      en: 'In {t:DFM}, toolmaker and moulder review the part: even walls, ribs of {n:40} to {n:60} percent of the wall, enough draft.' },
    { nl: 'Een {t:Vulsimulatie|vulsimulatie} rekent het vullen door voordat het staal er is.',
      en: 'A {t:Fill simulation|fill simulation} computes the filling before the steel exists.' },
    { nl: 'De {t:SPI-klasse|SPI-klasse} legt de levensduur vast: klasse {n:101} haalt een miljoen cycli of meer, klasse {n:103} minder dan vijfhonderdduizend. Voor {n:1.5} miljoen producten uit {n:2} holtes bouw je {n:103} twee keer: zes cent per product, tegen vijf voor {n:101}.',
      en: 'The {t:SPI class|SPI class} sets the mould’s life: class {n:101} lasts a million cycles or more, class {n:103} under five hundred thousand. For {n:1.5} million parts from {n:2} cavities, you build {n:103} twice: six cents a part, against five for {n:101}.' },
    { nl: '{t:T0} is het eerste shot bij de matrijzenmaker: werkt hij? T1 is de eerste proef met gemeten producten.',
      en: '{t:T0} is the first shot at the toolmaker: does it work? T1 is the first trial with measured parts.' },
    { nl: 'In de auto-industrie volgt {t:PPAP}: minstens {n:300} opeenvolgende producten op productietempo, tenzij de klant anders afspreekt, met de documenten erbij.',
      en: 'In automotive, {t:PPAP} follows: at least {n:300} consecutive parts at production rate, unless the customer agrees otherwise, with the documents.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
const C = {
  W, H, PL, ZT, CAV, CORE, HOLE, GATE, RUN, SPRUE, SLIDE, PIN_A, PIN_TAN, PINS, OPEN, EJ_STROKE, BAFFLE, HOT, COOL_A, COOL_B,
  SMED, SMED_H, LEAD, PM_RANGE, COST, SHOT, SHOT_G, RUNNER_PCT, DRAFT, CARE, WEEK, NEW, KEYS,
};
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2.2 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = beatStarts(s, 'nl').map((t) => t / s.dur);
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = st[bi];
      const e = bi + 1 < st.length ? st[bi + 1] : 1;
      b.still = Math.round((a + 0.8 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-svg .fp-tx{fill:var(--anatomy-text)}
.fp-sec{fill:var(--anatomy-top);stroke:none}
.fp-hatch{fill:none;stroke:var(--anatomy-faint);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-cutline{fill:none;stroke:var(--anatomy-mid);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-bore{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-band{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-heat{fill:var(--anatomy-mid)}
.fp-plate{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-water{fill:var(--anatomy-shade-1)}
.fp-melt{fill:color-mix(in srgb,var(--anatomy-hi) 46%,var(--anatomy-card));stroke:none}
.fp-solid{fill:color-mix(in srgb,var(--anatomy-hi) 80%,var(--anatomy-card));stroke:none}
.fp-zone{fill:none;stroke:none}
.fp-thick{stroke-width:2}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-hatchc{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-shape{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-shape2{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.fp-band2{fill:var(--anatomy-mid);opacity:.22}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.fp-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-flow{fill:none;stroke:var(--anatomy-shade-0);stroke-width:1.8;vector-effect:non-scaling-stroke}
.fp-glow{fill:var(--fp-accent);fill-opacity:.32;stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-zone{fill:var(--fp-accent);fill-opacity:.32;stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-steel,[data-cue][data-on] .fp-band{stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .fp-band,[data-cue][data-on] .fp-water,[data-cue][data-on] .fp-plate{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-heat{fill:var(--fp-accent)}
[data-cue][data-on] .fp-cutline{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-bore{stroke:var(--fp-accent);stroke-width:1}
[data-cue][data-on] .fp-melt{fill:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-card))}
[data-cue][data-on] .fp-solid{fill:color-mix(in srgb,var(--fp-accent) 85%,var(--anatomy-card))}
.fp-svg [data-cue][data-on] .fp-inv{fill:var(--fp-on-accent)}
.fp-svg .fp-acc{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .fp-shape,[data-cue][data-on] .fp-shape2,[data-cue][data-on] .fp-frame{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-shape{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-hatchc,[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-arrow{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-band2{fill:var(--fp-accent);opacity:.3}
`;

const label = {
  nl: 'Een matrijs met twee holtes in doorsnede, zoals hij in een liggende pers hangt: links de spuitmond van de machine en de vaste helft met centreerring, opspanplaat, aanspuitbus met de aanspuitkegel, de holteplaat met schuine pennen; rechts de bewegende helft met de kernen, de schuiven, steunplaat, afstandsbalken, uitwerpplaten met uitwerppennen en de opspanplaat. Koelkanalen in de platen, een schot in elke kern, verdeelkanalen en tunnelaanspuitingen op de deellijn, en een heetkanaalblok dat ze kan vervangen. Daarover kaarten met de levertijd, het onderhoud, de matrijswissel, het shotgewicht, de onderhoudskalender, het logboek, het laatste shot, het omstellen en de weg naar vrijgave.',
  en: 'A two-cavity mould in section, as it hangs in a horizontal press: on the left the machine’s nozzle and the fixed half with locating ring, clamp plate, sprue bushing with the sprue, the cavity plate with angle pins; on the right the moving half with the cores, the slides, support plate, spacer rails, ejector plates with ejector pins and the clamp plate. Cooling channels in the plates, a baffle in each core, runners and tunnel gates on the parting line, and a hot-runner manifold that can replace them. Over it cards with the lead time, the maintenance, the mould change, the shot weight, the service calendar, the logbook, the last-shot sample, the setup and the road to release.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

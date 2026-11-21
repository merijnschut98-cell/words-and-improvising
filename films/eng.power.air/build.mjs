// Dev tool, not shipped. Builds the explainer film "Perslucht: de dure utility /
// Compressed air: the expensive utility" for the topic Perslucht en hydrauliek
// of Motoren, aandrijvingen en perslucht: its level 1 lesson eng.power.air.
//
//   node films/eng.power.air/build.mjs            build the page
//   node films/eng.power.air/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.power.air.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.power). The plan row lists the lesson "air"; its id still exists after
// the topics x levels rebuild (eng.power.air, level 1 of the topic fluid), so
// no mapping was needed. Level 1 is Basis, so the film opens with a broad "how
// it works" tour (compressor, receiver, network, machine) before the losses.
//
// Since lessons with a film no longer show their worked example, the film
// carries every point of the five teach blocks and the whole worked example
// (the weekend test, the year's kWh and euros, the leak round, 1 bar lower);
// the list is checked item by item in the asserts below.
//
// The drawing is one compressed-air system, from compressor room to machine,
// and reuses the power series' parts so the films read as one set: the motor
// of eng.power.hydraulics (finned body, fan cowl, terminal box, the same LED),
// its gauge (dial, ticks and needle on the vessel, the large gauge card), its
// flowing petrol dashes and its checklist cards, and the kWh tile of
// eng.power.motor. On a skid: the motor, a coupling guard, the screw airend,
// the aftercooler with its fan, a plate heat exchanger for heat recovery piped
// to a hot-water boiler, and a control panel with a "loaded" lamp. Then the
// air receiver (gauge, safety valve, drain), the refrigeration dryer, a line
// filter, the riser and the header along the back, the drop to the machine with
// its FRL unit (filter bowl, regulator with gauge and knob, lubricator), a
// solenoid valve and a cylinder pushing a block, and a blow gun on its hose.
// Leaks hiss at a header coupling, the FRL inlet and the blow-gun coupling.
// Cards in stage space: where the energy goes (a schema), the
// FRL in section, the pressure ladder, the weekend load strip and the leak sum,
// the year's kWh and euros, checklists; example cards are labelled "voorbeeld",
// schematic ones "schema".
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
// Asserted against the lesson's text and worked example (the build fails if a
// value drifts); {n:...} numbers are then checked against the Dutch lesson text
// by defineFilm. Facts checked against:
// - Overall efficiency of compressed air: of the electrical input only about
//   10 % (often quoted 10–15 %, some sources 8–10 %) reaches the point of use
//   as useful work (US DOE / Compressed Air Challenge "Improving Compressed Air
//   System Performance" sourcebook; Carbon Trust CTV050). Said "zo'n 10
//   procent", as in the lesson, with "schattingen tot zo'n 15".
// - Heat: about 80–93 % of a compressor's electrical input becomes heat; a
//   well-designed heat recovery unit can recover roughly 50–90 % of it when
//   there is a use for low-grade heat (US DOE fact sheet "Heat recovery with
//   compressed air systems"). Said hedged: "vaak de helft of meer, als er
//   vraag naar warmte is".
// - Leaks: 20–30 % of output in plants without a leak programme (DOE
//   sourcebook), found with ultrasonic detectors; weekend load test as in the
//   lesson.
// - Pressure: about 7 % more energy per extra bar (estimates 6–8 %; DOE's
//   "1 % per 2 psi" is about 7 % per bar), and leak flow grows with pressure.
//   Pressure drop over undersized pipes and clogged filters makes the
//   compressors run higher (DOE sourcebook; the lesson's situation).
// - Air quality: ISO 8573-1:2010 gives purity classes for solid particles,
//   water (pressure dew point) and oil, written [particles:water:oil]; a lower
//   class number is cleaner (class 0 is stricter, set by the user).
// - Stored energy: a receiver holds compressed air; maintenance is done
//   locked out, vented, the gauge at zero (as eng.safety.loto and
//   eng.power.hydraulics say it).
const AIR = 'eng.power.air';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// The lesson, point by point: each line here is said by the film (scene in brackets).
{
  const nl = lessons.nl.get(AIR);
  const teach = nl.teach.join('\n');
  const has = (s, what) => assert(teach.includes(s), `teach: ${what}`);
  has('cilinders, blaaspistolen, gereedschap, ventielen', 'where air is used (s1)');
  has('de duurste manier om energie in een fabriek rond te brengen', 'the most expensive way (s1)');
  has('zo’n 7 bar boven de atmosferische druk', '7 bar above atmospheric (s1)');
  has('maar zo’n 10% doet nuttig werk bij de gebruiker', 'about 10 % useful (s2)');
  has('Warmteterugwinning, die warmte gebruiken voor warm water of ruimteverwarming', 'heat recovery (s2)');
  has('Blaas nooit perslucht op je huid of kleding', 'never at skin or clothes (s8)');
  has('20 tot 30%', 'leaks 20 to 30 % (s6)');
  has('koppelingen, slangen en ventielen', 'where leaks are (s6)');
  has('hoeveel van de tijd de compressor nog in last draait', 'the leak test (s6)');
  has('Dat deel van zijn levering is vooral lekkage', 'that share is mostly leakage (s6)');
  has('Ultrasone detectoren', 'ultrasonic detectors (s7)');
  has('lekken labelen en repareren is een klassieke snelle winst', 'tag and fix, quick win (s7)');
  has('De netdruk is de druk die de compressoren in de leidingen houden', 'network pressure (s5)');
  has('ruwweg 7% meer compressorenergie (schattingen lopen van zo’n 6 tot 8%)', '7 % per bar, 6 to 8 % (s5)');
  has('elk lek wordt er groter door', 'leaks grow with pressure (s5)');
  has('7 of 8 bar omdat één machine dat nodig heeft', 'one machine sets the pressure (s5)');
  has('een booster, een kleine extra compressor voor die machine; een dikkere aanvoerleiding; een lokaal buffervat', 'solve it locally (s5)');
  has('water en olie beschadigen ventielen en cilinders', 'water and oil damage (s3)');
  has('Een droger na de compressor haalt het water eruit, anders verzamelt condenswater zich in de leidingen', 'the dryer (s3)');
  has('filters halen olie en stof eruit', 'filters (s3)');
  has('filter, regelaar, olienevelaar', 'the FRL unit (s4)');
  has('Veel moderne componenten draaien zonder olienevelaar', 'no lubricator needed (s4)');
  has('open blaaspijpjes, koelen met lucht, vacuüm maken met perslucht', 'inappropriate use (s8)');
  has('een elektrische ventilator, blower of vacuümpomp', 'the alternatives (s8)');
  has('zuinigere compressoren met toerenregeling, of minder vraag. De vraag verlagen is meestal goedkoper', 'demand first (s8)');
  has('Waarvoor is deze lucht, en wat kan dat zonder perslucht?', 'the sharp question (s8)');
  const ex = nl.example.text;
  for (const s of ['75 kW', '10 m³ lucht per minuut', '40% van de tijd in last', '40% × 10 = 4 m³ per minuut', '8.760 uur', '263.000 kWh', '€39.000 per jaar bij €0,15 per kWh',
    'het vermogen in nullast', 'een paar duizend euro', '1 bar lager en bespaar nog eens ruwweg 7%']) assert(ex.includes(s), `example: ${s}`);
}
// the worked example
const KW = 75;
const Q_LOAD = 10; // m³/min delivered when loaded
const LOADED = 0.4; // share of the weekend the compressor runs loaded
const LEAK = LOADED * Q_LOAD;
assert(near(LEAK, 4, 1e-9), '40 % × 10 = 4 m³/min');
const HOURS = 8760;
const KWH = KW * LOADED * HOURS;
assert(KWH === 262800 && Math.round(KWH / 1000) === 263, '75 × 40 % × 8.760 = 262.800 ≈ 263.000 kWh');
const EUR = KWH * 0.15;
assert(near(EUR, 39420, 1e-6) && Math.round(EUR / 1000) === 39, '× €0,15 = €39.420 ≈ €39.000');
// the recall questions, as a check on the same rules
assert(0.25 * 12 === 3, '25 % × 12 = 3 m³/min');
assert(2 * 7 === 14, '8 → 6 bar: 2 × 7 % = 14 %');
const PER_BAR = 0.07;
const USEFUL = 0.1;
const NET = 8; // the network before (bar), the machine's need and the rest
const NEED = 7.5;
const REST = 6;
assert(NET - REST === 2 && NEED > REST, 'one machine at 7,5 bar, the rest at 6');

// ---------------------------------------------------------------- the world
// x to the right along the floor, y toward the viewer, z up; the floor is z = 0.
// Units of about 1 cm: the receiver stands about 1 m tall.
const W = 640;
const H = 400;
const HDR = { y: -34, z: 116 }; // the header along the back
const RCV = { x: -30, y: 0, r: 16, z0: 10, z1: 88 };
const GAUGE = [-26, 17, 70]; // the receiver's gauge, in the plane y = 17
const MOTOR = { y: 12, z: 21 };
const FRL = { y: -26, z: 76, x: [176, 184, 192, 200] }; // bodies from x[0] to x[3]
const CYL = { y: 10, z: 62, x0: 170, x1: 200, stroke: 14 };
const LEAKS = [[104, HDR.y, HDR.z], [172, FRL.y, FRL.z], [158, -32, 64]];
const GUN = [150, 26, 56];
const C = { RCV, GAUGE, FRL, CYL, LEAKS, GUN, HDR, LOADED, LEAK, KWH, EUR, USEFUL, PER_BAR, NET, NEED, REST, Q_LOAD, KW };

const FIT = [[-176, -64, 0], [-176, 34, 0], [230, -36, 0], [230, 40, 0], [-60, -64, 96], [60, HDR.y, HDR.z + 6], [-120, 30, 70], [230, -36, 100]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 52, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const alongY = (x, z, y0, y1, r, style = {}, steps) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const faceX = (x, y0, y1, z0, z1) => k.pathOf([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'pa-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const led = (key, p, r = 0.8) => { const [x, y] = at(p); return `<circle class="pa-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };
const ringY = (c, r, n = 28) => k.pathOf(Array.from({ length: n }, (_, i) => at([c[0] + r * Math.cos((i / n) * 2 * Math.PI), c[1], c[2] + r * Math.sin((i / n) * 2 * Math.PI)])), true);
// a small gauge in the plane y = c[1]: case, dial, ticks; the needle is drawn by the stage (data-k)
const gaugeY = (c, r, key) => alongY(c[0], c[2], c[1] - 1.6, c[1], r + 0.8, {}, 16)
  + `<path class="pa-dial" d="${ringY([c[0], c[1] + 0.02, c[2]], r)}"/>`
  + L(Array.from({ length: 9 }, (_, i) => { const a = (-135 + i * 33.75) * Math.PI / 180; const yy = c[1] + 0.04; return k.segment([c[0] + r * 0.92 * Math.sin(a), yy, c[2] + r * 0.92 * Math.cos(a)], [c[0] + r * (i % 4 ? 0.78 : 0.66) * Math.sin(a), yy, c[2] + r * (i % 4 ? 0.78 : 0.66) * Math.cos(a)], P); }).join(''), { tone: 'mid' })
  + g(key, '');

// ---------------------------------------------------------------- the compressor skid
const SKID = { x: -172, y: -30, w: 84, d: 58, r: 1 };
const RAD = { x: -168, y: -27, w: 72, d: 17, r: 0.8 }; // the aftercooler
const HX = { x: -92, y: -25, w: 9, d: 14, r: 0.5 }; // the plate heat exchanger
const BOIL = { x: -54, y: -60, r: 11 };
const skid = {};
skid.base = [
  halo(k.insetPlan(SKID, -3), 0, 2),
  ...k.corners(SKID, 5).map(([x, y]) => box({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.4 }, 0, 2, { tone: 'lo' }, 0.2)),
  box(SKID, 2, 7, { tone: 'lo', inner: seam(SKID, 4.5, 2) }, 0.5, 2),
  screws(SKID, 7, 3),
].join('');
// the hot-water boiler behind the skid, with its two pipes from the heat exchanger
const boiler = cue('boiler', [
  halo({ x: BOIL.x - 12, y: BOIL.y - 12, w: 24, d: 24, r: 12 }, 0, 2),
  ...[[-6, -6], [6, -6], [0, 7]].map(([dx, dy]) => post(BOIL.x + dx, BOIL.y + dy, 1.2, 0, 8, { tone: 'lo' }, 8)),
  S(G.solidOf([[0, 6], [2, 10, 1], [5, BOIL.r, 1], [60, BOIL.r], [63, 10, 1], [66, 5]], G.frameOf([BOIL.x, BOIL.y, 6], Z, X, Y), P), { tone: 'hi', crease: 'lo', inner: L(k.sideArc(BOIL.x, BOIL.y, BOIL.r, 40, P, 18) + k.sideArc(BOIL.x, BOIL.y, BOIL.r, 20, P, 18), { tone: 'faint' }) }),
  post(BOIL.x, BOIL.y, 1.6, 72, 76, {}, 10),
].join(''));
skid.rad = [
  // the aftercooler: a finned block, the fan on top under its guard
  box(RAD, 7, 62, { inner: seam(RAD, 58, 2) + seam(RAD, 12, 2) }, 0.5, 2),
  L(Array.from({ length: 22 }, (_, i) => k.segment([RAD.x + 4 + i * 3, RAD.y + RAD.d, 15], [RAD.x + 4 + i * 3, RAD.y + RAD.d, 55], P)).join(''), { tone: 'faint' }),
  L(k.segment([RAD.x + 2, RAD.y + RAD.d, 15], [RAD.x + RAD.w - 2, RAD.y + RAD.d, 15], P) + k.segment([RAD.x + 2, RAD.y + RAD.d, 55], [RAD.x + RAD.w - 2, RAD.y + RAD.d, 55], P), { tone: 'lo' }),
  screws(RAD, 62, 2),
  `<path class="pa-well" d="${k.ring(-132, -18.5, 7.6, 62.1, P, 36)}"/>`,
  `<path class="iso-line" data-tone="mid" data-k="fan" d=""/>`,
  L(k.ring(-132, -18.5, 7.6, 62.2, P, 36) + k.ring(-132, -18.5, 4.6, 62.2, P, 28), { tone: 'lo' }),
  Dt([at([-132, -18.5, 62.2])], { size: 0.6, tone: 'hi' }),
].join('');
skid.hx = cue('hrec', [
  box(HX, 9, 44, { tone: 'hi', crease: 'lo' }, 0.3),
  L(Array.from({ length: 6 }, (_, i) => k.segment([HX.x + 1.4 + i * 1.3, HX.y + HX.d, 11], [HX.x + 1.4 + i * 1.3, HX.y + HX.d, 42], P)).join(''), { tone: 'faint' }),
  box({ x: HX.x - 1, y: HX.y - 1, w: HX.w + 2, d: HX.d + 2, r: 0.5 }, 44, 46.4, {}, 0.3),
  box({ x: HX.x - 1, y: HX.y - 1, w: HX.w + 2, d: HX.d + 2, r: 0.5 }, 7, 9, {}, 0.3),
  post(HX.x + 3, HX.y + 4, 1.4, 46.4, 50, {}, 10), post(HX.x + 6, HX.y + 10, 1.4, 46.4, 50, {}, 10),
].join(''));
const WATER = {
  hot: [[HX.x + 3, HX.y + 4, 50], [HX.x + 3, HX.y + 4, 92], [HX.x + 3, BOIL.y, 92], [BOIL.x + 11, BOIL.y, 92], [BOIL.x + 11, BOIL.y, 62]],
  cold: [[HX.x + 6, HX.y + 10, 50], [HX.x + 6, HX.y + 10, 84], [HX.x + 6, BOIL.y + 6, 84], [BOIL.x + 9, BOIL.y + 6, 84], [BOIL.x + 9, BOIL.y + 6, 30]],
};
skid.motor = [
  // the motor of eng.power.hydraulics: feet, finned body, fan cowl, terminal box with its LED
  box({ x: -166, y: 4, w: 28, d: 16, r: 0.6 }, 7, 11, { tone: 'lo' }, 0.2),
  cue('motor', alongX(MOTOR.y, MOTOR.z, -164, -138, 10, {}, 16)
    + L([-160, -155, -150, -145, -141].map((xx) => k.pathOf(Array.from({ length: 13 }, (_, i) => { const a = -0.2 + (i / 12) * 3.4; return at([xx, MOTOR.y + 10.2 * Math.cos(a), MOTOR.z + 10.2 * Math.sin(a)]); }))).join(''), { tone: 'faint' })
    + alongX(MOTOR.y, MOTOR.z, -168, -164, 8.4, { tone: 'lo' }, 16)
    + box({ x: -156, y: 8, w: 11, d: 9, r: 0.5 }, 30.5, 36, {}, 0.3)),
  led('motor', [-150.5, 17.2, 34], 0.7),
  // the coupling guard and the screw airend with its outlet
  box({ x: -138, y: 6, w: 9, d: 12, r: 1.4 }, 11, 30, { tone: 'lo' }, 0.4),
  cue('airend', box({ x: -129, y: 2, w: 22, d: 20, r: 1 }, 7, 34, { tone: 'hi', crease: 'lo', inner: seam({ x: -129, y: 2, w: 22, d: 20 }, 30, 1.4) + seam({ x: -129, y: 2, w: 22, d: 20 }, 11, 1.4) }, 0.5)
    + alongX(12, 22, -107, -103, 8, {}, 16) + Dt(Array.from({ length: 6 }, (_, i) => at([-103, 12 + 6.4 * Math.cos(i * 1.047), 22 + 6.4 * Math.sin(i * 1.047)])), { size: 0.4 })
    + post(-118, 12, 2.4, 34, 41, {}, 12) + post(-118, 12, 3.4, 37, 38.4, { tone: 'lo' }, 12)),
].join('');
// the control panel at the front corner: a screen and the "loaded" lamp
const PNL = { x: -172, y: 30, w: 16, d: 6, r: 0.6 };
skid.panel = [
  post(-164, 33, 1.4, 0, 22, { tone: 'lo' }, 10),
  box(PNL, 22, 46, { inner: seam(PNL, 24, 1) }, 0.4),
  card(PNL.y + PNL.d, -169, -159, 34, 43, 'pa-glass'),
  g('scr', ''),
  rules(-169, PNL.y + PNL.d, 31, [8, 5], 1.6),
  led('load', [-157.5, PNL.y + PNL.d, 31.6], 0.9),
  screws(PNL, 46, 1.4),
].join('');

// ---------------------------------------------------------------- receiver, dryer and filter
const rcv = cue('rcv', [
  halo({ x: RCV.x - 18, y: RCV.y - 18, w: 36, d: 36, r: 18 }, 0, 2),
  ...[0, 2.09, 4.19].map((a) => box({ x: RCV.x + 11 * Math.cos(a) - 2, y: RCV.y + 11 * Math.sin(a) - 2, w: 4, d: 4, r: 0.4 }, 0, 14, { tone: 'lo' }, 0.2)),
  S(G.solidOf([[0, 5], [2.4, 11, 1], [6, 15, 1], [9, RCV.r, 1], [RCV.z1 - RCV.z0 - 9, RCV.r], [RCV.z1 - RCV.z0 - 6, 15, 1], [RCV.z1 - RCV.z0 - 2.4, 11, 1], [RCV.z1 - RCV.z0, 5]], G.frameOf([RCV.x, RCV.y, RCV.z0], Z, X, Y), P),
    { tone: 'hi', crease: 'lo', inner: L(k.sideArc(RCV.x, RCV.y, RCV.r, 30, P, 20) + k.sideArc(RCV.x, RCV.y, RCV.r, 66, P, 20), { tone: 'faint' }) }),
  // the name plate on the shell
  card(RCV.r * 0.62, RCV.x - 4, RCV.x + 4, 40, 50) + rules(RCV.x - 3, RCV.r * 0.62 + 0.02, 48, [6, 4, 5], 2.2),
  // safety valve on top, the drain at the bottom
  post(RCV.x, RCV.y, 1.6, RCV.z1, RCV.z1 + 5, {}, 10) + post(RCV.x, RCV.y, 2.8, RCV.z1 + 5, RCV.z1 + 9, { tone: 'lo' }, 12, 0.4) + post(RCV.x, RCV.y, 0.9, RCV.z1 + 9, RCV.z1 + 12, { tone: 'hi' }, 8),
  alongY(RCV.x + 6, 12, 10, 16, 1.4, {}, 8) + box({ x: RCV.x + 4, y: 16, w: 4, d: 3, r: 0.4 }, 10, 14, { tone: 'lo' }, 0.2),
  // the gauge on its stub
  alongY(GAUGE[0], GAUGE[2], 12, GAUGE[1] - 1.6, 1, {}, 8),
].join(''));
const rcvGauge = cue('gauge', gaugeY(GAUGE, 4.6, 'needle'));
const DRY = { x: 0, y: -14, w: 30, d: 28, r: 1 };
const dryer = cue('dryer', [
  halo(k.insetPlan(DRY, -2), 0, 2),
  box(DRY, 0, 48, { inner: seam(DRY, 44, 2) + seam(DRY, 4, 2) }, 0.6, 2),
  // louvres on the front, a display and the lamp, the label plate
  L(Array.from({ length: 7 }, (_, i) => k.segment([DRY.x + 4, DRY.y + DRY.d, 8 + i * 3.4], [DRY.x + 18, DRY.y + DRY.d, 8 + i * 3.4], P)).join(''), { tone: 'lo' }),
  card(DRY.y + DRY.d, 21, 27, 34, 40, 'pa-glass') + rules(21.6, DRY.y + DRY.d + 0.02, 38.8, [4.4, 3], 1.6),
  led('dry', [24, DRY.y + DRY.d, 30], 0.8),
  card(DRY.y + DRY.d, 4, 16, 34, 40) + rules(5, DRY.y + DRY.d + 0.02, 38.6, [9, 6, 8], 1.4),
  // a louvre grille on the right side too
  L(Array.from({ length: 6 }, (_, i) => k.segment([DRY.x + DRY.w, DRY.y + 6, 10 + i * 4], [DRY.x + DRY.w, DRY.y + 22, 10 + i * 4], P)).join(''), { tone: 'faint' }),
  screws(DRY, 48, 2),
  // the condensate drain at the bottom front, with its little hose to a floor drain
  box({ x: 22, y: 14, w: 5, d: 3, r: 0.4 }, 2, 6, { tone: 'lo' }, 0.2),
].join(''));
const FLT = [44, 0];
const filter = cue('filter', [
  post(FLT[0], FLT[1], 0.9, 24, 30, {}, 8),
  post(FLT[0], FLT[1], 3.6, 30, 48, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(FLT[0], FLT[1], 3.6, 40, P, 14), { tone: 'faint' }) }, 16),
  post(FLT[0], FLT[1], 4.4, 47, 50, { tone: 'lo' }, 16, 0.3),
  box({ x: FLT[0] - 5, y: FLT[1] - 4, w: 10, d: 8, r: 0.6 }, 50, 56, {}, 0.3),
  Dt([at([FLT[0], FLT[1] + 4, 53])], { size: 0.5, tone: 'hi' }),
].join(''));

// ---------------------------------------------------------------- the machine
const TAB = { x: 148, y: -24, w: 74, d: 52, r: 1 };
const BACK = { x: 150, y: -38, w: 66, d: 4, r: 0.4 };
const machine = {};
machine.back = [
  halo(k.insetPlan(BACK, -2), 0, 2),
  box({ x: 152, y: -37, w: 4, d: 3, r: 0.3 }, 0, 54, { tone: 'lo' }, 0.2) + box({ x: 210, y: -37, w: 4, d: 3, r: 0.3 }, 0, 54, { tone: 'lo' }, 0.2),
  box(BACK, 54, 100, { inner: seam(BACK, 96, 1) }, 0.3),
  screws(BACK, 100, 1.2),
].join('');
machine.frl = [
  // the FRL unit on its bracket: filter bowl, regulator with knob and gauge, lubricator bowl
  box({ x: FRL.x[0] - 2, y: FRL.y - 8, w: 30, d: 4, r: 0.3 }, FRL.z + 4, FRL.z + 7, { tone: 'lo' }, 0.2),
  cue('frlF', box({ x: FRL.x[0], y: FRL.y - 4, w: 8, d: 8, r: 0.6 }, FRL.z - 4, FRL.z + 4, {}, 0.3)
    + post(FRL.x[0] + 4, FRL.y, 3.2, FRL.z - 16, FRL.z - 4, { tone: 'hi', crease: 'lo' }, 16) + post(FRL.x[0] + 4, FRL.y, 0.8, FRL.z - 19, FRL.z - 16, {}, 8)
    + g('bowlF', '')),
  cue('frlR', box({ x: FRL.x[1], y: FRL.y - 4, w: 8, d: 8, r: 0.6 }, FRL.z - 6, FRL.z + 4, { tone: 'hi', crease: 'lo' }, 0.3)
    + post(FRL.x[1] + 4, FRL.y, 2.8, FRL.z + 4, FRL.z + 9, {}, 14, 0.4) + L(k.knurl(FRL.x[1] + 4, FRL.y, 2.8, FRL.z + 4.6, FRL.z + 8.4, 14, P), { tone: 'lo' })
    + alongY(FRL.x[1] + 4, FRL.z - 1, FRL.y + 4, FRL.y + 5.4, 1, {}, 8)),
  cue('frlL', box({ x: FRL.x[2], y: FRL.y - 4, w: 8, d: 8, r: 0.6 }, FRL.z - 4, FRL.z + 4, {}, 0.3)
    + post(FRL.x[2] + 4, FRL.y, 3.2, FRL.z - 16, FRL.z - 4, { tone: 'hi', crease: 'lo' }, 16) + post(FRL.x[2] + 4, FRL.y, 1.2, FRL.z + 4, FRL.z + 6.4, { tone: 'lo' }, 10)
    + g('bowlL', '')),
].join('');
machine.frlGauge = cue('frlR', gaugeY([FRL.x[1] + 4, FRL.y + 7, FRL.z - 1], 3.4, 'needle2'));
machine.table = [
  halo(k.insetPlan(TAB, -2), 0, 2),
  ...k.corners(TAB, 3).map(([x, y]) => box({ x: x - 2, y: y - 2, w: 4, d: 4, r: 0.3 }, 0, 50, { tone: 'lo' }, 0.2)),
  box({ x: TAB.x + 1, y: TAB.y + 1, w: TAB.w - 2, d: TAB.d - 2, r: 0.6 }, 10, 13, { tone: 'lo' }, 0.2),
  box(TAB, 50, 55, { inner: seam(TAB, 52.5, 1.4) }, 0.4, 2),
  screws(TAB, 55, 2.4),
  // the solenoid valve with its coil and lamp
  box({ x: 196, y: -16, w: 12, d: 7, r: 0.5 }, 55, 60, {}, 0.3) + box({ x: 207, y: -15, w: 5, d: 5, r: 0.5 }, 56, 63, { tone: 'lo' }, 0.3),
].join('');
machine.led = led('valve', [209.5, -10, 61], 0.6);
// the cylinder: mounts, barrel, caps; the rod and its block are moved by the stage
machine.cyl = cue('cyl', [
  box({ x: CYL.x0 - 1, y: CYL.y - 5, w: 4, d: 10, r: 0.4 }, 55, CYL.z + 2, { tone: 'lo' }, 0.2),
  box({ x: CYL.x1 - 3, y: CYL.y - 5, w: 4, d: 10, r: 0.4 }, 55, CYL.z + 2, { tone: 'lo' }, 0.2),
  alongX(CYL.y, CYL.z, CYL.x0, CYL.x0 + 3, 5.6, {}, 16),
  alongX(CYL.y, CYL.z, CYL.x0 + 3, CYL.x1 - 3, 4.6, { tone: 'hi', crease: 'lo' }, 18),
  alongX(CYL.y, CYL.z, CYL.x1 - 3, CYL.x1, 5.6, {}, 16),
  Dt([[CYL.x0 + 1.5, CYL.y + 5.6, CYL.z], [CYL.x1 - 1.5, CYL.y + 5.6, CYL.z]].map(at), { size: 0.45 }),
].join(''));
machine.rod = g('rod', alongX(CYL.y, CYL.z, CYL.x1, CYL.x1 + 8, 1.4, { tone: 'hi', crease: 'none' }, 10)
  + box({ x: CYL.x1 + 8, y: CYL.y - 6, w: 8, d: 12, r: 0.6 }, 55, CYL.z + 6, { tone: 'hi', crease: 'lo' }, 0.3));
// the blow gun lying on the table at the front, its hose to a coupling on the back panel
machine.gun = cue('gun', [
  box({ x: GUN[0] + 2, y: GUN[1] - 2, w: 10, d: 4, r: 1 }, 55, 58, { tone: 'hi', crease: 'lo' }, 0.3),
  alongX(GUN[1], GUN[2] + 1.6, GUN[0] - 6, GUN[0] + 2, 0.8, {}, 8),
  box({ x: GUN[0] + 6, y: GUN[1] - 1.4, w: 3, d: 2.8, r: 0.4 }, 52.6, 55, { tone: 'lo' }, 0.2),
  g('blast', ''),
].join(''));

// ---------------------------------------------------------------- pipes, and the air and water flowing in them
// Each pipe is a line between two ports with terminal dots; the same route
// carries a dashed petrol overlay that the stage moves while air flows.
const ROUTES = {
  dis: [[-118, 12, 41], [-118, 12, 50], [-40.6, 12, 50]], // airend to the receiver
  rcv: [[-14, 0, 78], [-8, 0, 78], [-8, 0, 36], [DRY.x, 0, 36]], // receiver to the dryer
  dry: [[24, 0, 48], [24, 0, 53], [FLT[0] - 5, 0, 53]], // dryer to the filter
  rise: [[FLT[0] + 5, 0, 53], [56, 0, 53], [56, 0, HDR.z], [56, HDR.y, HDR.z]], // the riser
  hdr: [[56, HDR.y, HDR.z], [166, HDR.y, HDR.z], [166, HDR.y, FRL.z], [FRL.x[0], FRL.y, FRL.z]], // header and drop to the FRL
  out: [[FRL.x[3], FRL.y, FRL.z], [205, FRL.y, FRL.z], [205, -16, 60], [205, -12, 60]], // FRL to the valve
  cyl: [[198, -10, 59], [CYL.x1 - 1.5, CYL.y - 3, CYL.z + 4]], // valve to the cylinder
  gun: [[158, -34, 64], [150, -10, 57], [GUN[0] - 6, GUN[1], GUN[2] + 1.6]], // blow-gun hose
};
const NET_KEYS = ['rise', 'hdr'];
const pipe = (pts, tone = 'mid', size = 1.6) => k.wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via: pts.slice(1, -1).map(at), tone, size, ends: 'both' });
const pipeG = (key) => `<g class="pa-pipe">${pipe(ROUTES[key])}</g>`;
const flowOf = (key, pts, cls = 'pa-flow') => `<path class="${cls}" data-k="f${key}" d="${k.pathOf(pts.map(at))}" style="opacity:0"/>`;
const water = Object.entries(WATER).map(([key, pts]) => `<g class="pa-pipe">${pipe(pts, 'lo', 1.4)}</g>`).join('');
const waterFlows = Object.entries(WATER).map(([key, pts]) => flowOf(key, pts, 'pa-wflow')).join('');
// couplings on the header and the gun hose that leak (the hiss is drawn by the stage)
const couplings = cue('leaks', [
  alongX(HDR.y, HDR.z, LEAKS[0][0] - 2.4, LEAKS[0][0] + 2.4, 2.2, { tone: 'hi', crease: 'lo' }, 10),
  alongY(LEAKS[2][0], LEAKS[2][2], -34, -31, 1.8, { tone: 'hi', crease: 'lo' }, 10),
  alongX(FRL.y, FRL.z, FRL.x[0] - 4, FRL.x[0], 1.8, { tone: 'hi', crease: 'lo' }, 10),
  g('hiss', ''),
].join(''));
// the ball valve on the drop
const ballValve = box({ x: 163, y: HDR.y - 3, w: 6, d: 6, r: 0.6 }, 94, 100, {}, 0.3) + box({ x: 163, y: HDR.y + 3, w: 2, d: 6, r: 0.3 }, 98, 99.4, { tone: 'lo' }, 0.1);

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = ['energy', 'frlC', 'press', 'load', 'calc', 'kwh', 'list', 'cmp', 'warn', 'ask', 'tag'].map((key) => g(key, '', ` data-cue="${key}"`)).join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('boiler', boiler),
  water,
  g('skid', [skid.base, skid.rad, skid.hx, skid.motor].join('')),
  `<g class="pa-flows">${waterFlows}</g>`,
  pipeG('dis'),
  g('rcvW', rcv + rcvGauge),
  g('panel', skid.panel),
  cue('net', NET_KEYS.map(pipeG).join('') + ballValve),
  g('machineBack', machine.back + machine.frl + machine.frlGauge),
  g('dryW', dryer),
  pipeG('rcv'), pipeG('dry'),
  g('filter', filter),
  g('table', machine.table + machine.led),
  pipeG('out'), pipeG('cyl'),
  machine.cyl, machine.rod,
  pipeG('gun'),
  machine.gun,
  couplings,
  `<g class="pa-flows">${Object.keys(ROUTES).map((key) => flowOf(key, ROUTES[key])).join('')}</g>`,
].join('');

// Static paths written with relative line-tos (the helper of eng.power.hydraulics):
// the same points (to 0,1), about a third fewer bytes; each rewrite is read back to prove it exact.
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
// cam(p, w, sx, sy): world point p lands at stage (sx, sy) in a view w wide
const cam = (p, w, sx = W / 2, sy = H / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round((y + (H / 2 - sy) * (w / W)) * 10) / 10, w]; };
const WIDE = cam([26, -10, 50], 640);
const CAM = [
  { from: WIDE, to: cam([-60, 0, 46], 420, 300), a: 0.2, b: 0.4 },
  { from: cam([-100, -24, 44], 360, 470), to: cam([-84, -36, 48], 320, 470) },
  { from: cam([-30, 0, 50], 360, 450), to: cam([20, 0, 40], 300, 450), a: 0.2, b: 0.5 },
  { from: cam([150, -20, 70], 320, 200), to: cam([186, -24, 72], 170, 170) },
  { from: cam([100, -20, 80], 560, 400), to: cam([110, -20, 80], 520, 400) },
  { from: WIDE, to: cam([-146, 16, 34], 300, 450), a: 0.2, b: 0.34 },
  { from: cam([120, -24, 80], 380, 420), to: cam([150, -26, 80], 300, 430) },
  { from: cam([150, 18, 60], 250, 470, 210), to: cam([150, 20, 60], 220, 470, 210) },
];

// ---------------------------------------------------------------- the film
const DUR = [20, 16, 22, 28, 33, 40, 39, 37];
C.dur = DUR;
const spec = {
  id: 'eng.power.air',
  title: { nl: 'Perslucht: de dure utility', en: 'Compressed air: the expensive utility' },
  lessons: [AIR],
  scenes: [
    {
      id: 's1', lesson: AIR, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Van compressor tot cilinder', en: 'From compressor to cylinder' },
      beats: [
        { nl: 'Perslucht zit overal: cilinders, ventielen, gereedschap. Het is de duurste energie in de fabriek.', en: 'Compressed air is everywhere: cylinders, valves, tools. It is the most expensive energy in the plant.', cues: ['cyl', 'gun'] },
        { nl: 'Een motor drijft de compressor aan. Die perst buitenlucht tot zo’n {n:7} bar boven de atmosfeer.', en: 'A motor drives the compressor. It squeezes outside air to about {n:7} bar above atmospheric.', cues: ['motor', 'airend'] },
      ],
    },
    {
      id: 's2', lesson: AIR, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Waar de stroom blijft', en: 'Where the power goes' },
      beats: [
        { nl: 'Het meeste van de stroom wordt warmte. Maar zo’n {n:10}% doet nuttig werk bij de gebruiker.', en: 'Most of the electricity becomes heat. Only about {n:10}% does useful work at the point of use.', cues: ['energy'] },
        { nl: '{t:Warmteterugwinning|Warmteterugwinning}: de compressorwarmte maakt warm water of verwarmt de hal.', en: '{t:Heat recovery|Heat recovery}: the compressor’s heat makes hot water or heats the hall.', cue: { Warmteterugwinning: 'hrec' }, cues: ['boiler'] },
      ],
    },
    {
      id: 's3', lesson: AIR, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Schoon en droog', en: 'Clean and dry' },
      beats: [
        { nl: 'Samengeperste lucht bevat water. Water en olie beschadigen ventielen en cilinders.', en: 'Compressed air holds water. Water and oil damage valves and cylinders.', cues: ['rcv'] },
        { nl: 'De {t:Droger|droger} na de compressor haalt het water eruit. Anders komt er condenswater in de leidingen.', en: 'The {t:Dryer|dryer} after the compressor takes the water out. Otherwise condensate collects in the pipes.', cue: { Droger: 'dryer' } },
        { nl: 'Filters halen olie en stof eruit; een aftap loost het opgevangen water.', en: 'Filters take out oil and dust; a drain lets out the water they catch.', cues: ['filter'] },
      ],
    },
    {
      id: 's4', lesson: AIR, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Bij de machine', en: 'At the machine' },
      beats: [
        { nl: 'Vóór elke machine: de {t:Verzorgingseenheid|verzorgingseenheid}. Filter, regelaar, olienevelaar.', en: 'Before each machine: the {t:FRL unit|FRL unit}. Filter, regulator, lubricator.', cue: { Verzorgingseenheid: 'frlC' }, cues: ['frlF', 'frlR', 'frlL'] },
        { nl: 'Het filter vangt nog een keer vuil en water op.', en: 'The filter catches dirt and water once more.', cues: ['frlF', 'frlC'] },
        { nl: 'De regelaar zet de druk die de machine nodig heeft, hier {n:6} bar. De manometer toont hem.', en: 'The regulator sets the pressure the machine needs, here {n:6} bar. The gauge shows it.', cues: ['frlR', 'frlC'] },
        { nl: 'De olienevelaar geeft een olienevel waar dat nodig is. Veel moderne componenten kunnen zonder.', en: 'The lubricator adds an oil mist where it is needed. Many modern components do without.', cues: ['frlL', 'frlC'] },
      ],
    },
    {
      id: 's5', lesson: AIR, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Druk kost energie', en: 'Pressure costs energy' },
      beats: [
        { nl: '{t:Netdruk|Netdruk}: de druk in de leidingen. Elke bar extra kost ruwweg {n:7}% meer energie.', en: '{t:Network pressure|Network pressure}: the pressure in the pipes. Each extra bar costs roughly {n:7}% more energy.', cue: { Netdruk: 'net' }, cues: ['press'] },
        { nl: 'Hogere druk maakt elk lek groter.', en: 'Higher pressure makes every leak bigger.', cues: ['leaks', 'press'] },
        { nl: 'Vaak staat het hele net op {n:7} of {n:8} bar, omdat één machine dat vraagt.', en: 'Often the whole network runs at {n:7} or {n:8} bar, because one machine asks for it.', cues: ['net', 'press'] },
        { nl: 'Los die machine lokaal op, met een booster of een dikkere leiding. Dan kan het net omlaag.', en: 'Solve that machine locally, with a booster or a bigger pipe. Then the network can come down.', cues: ['press'] },
      ],
    },
    {
      id: 's6', lesson: AIR, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'De lektest', en: 'The leak test' },
      beats: [
        { nl: 'Lekken zijn het grote verlies: vaak {n:20} tot {n:30}% van de lucht, via koppelingen en slangen.', en: 'Leaks are the big loss: often {n:20} to {n:30}% of the air, through couplings and hoses.', cues: ['leaks'] },
        { nl: 'De {t:Lektest|lektest}: in het weekend ligt alles stil. Hoe vaak draait de compressor nog in last?', en: 'The {t:Leak test|leak test}: at the weekend everything is stopped. How often does the compressor still run loaded?', cue: { Lektest: 'load' } },
        { nl: 'Voorbeeld: een compressor van {n:75} kW, {n:10} m³ per minuut in last, draait {n:40}% van de tijd in last.', en: 'Example: a {n:75} kW compressor, {n:10} m³ a minute when loaded, runs loaded {n:40}% of the time.', cues: ['load', 'airend'] },
        { nl: 'Lekkage: {n:40}% × {n:10} = {n:4} m³ per minuut, dag en nacht.', en: 'Leakage: {n:40}% × {n:10} = {n:4} m³ a minute, day and night.', cues: ['calc', 'leaks'] },
      ],
    },
    {
      id: 's7', lesson: AIR, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'De lekrekening', en: 'The leak bill' },
      beats: [
        { nl: '{n:75} kW × {n:40}% × {n:8760} uur ≈ {n:263000} kWh per jaar.', en: '{n:75} kW × {n:40}% × {n:8760} hours ≈ {n:263000} kWh a year.', cues: ['kwh'] },
        { nl: 'Bij €{n:0.15} per kWh: ruwweg €{n:39000} per jaar. Nullast telt nog niet eens mee.', en: 'At €{n:0.15} per kWh: roughly €{n:39000} a year. Running unloaded is not even counted.', cues: ['kwh'] },
        { nl: 'Een ultrasone detector hoort het sissen. Elk lek krijgt een label en wordt gerepareerd.', en: 'An ultrasonic detector hears the hiss. Each leak gets a tag and is repaired.', cues: ['leaks', 'tag'] },
        { nl: 'Een lekronde kost een paar duizend euro. Daarna {n:1} bar lager: nog eens ruwweg {n:7}% minder.', en: 'A leak round costs a few thousand euros. Then {n:1} bar lower: roughly another {n:7}% less.', cues: ['list'] },
      ],
    },
    {
      id: 's8', lesson: AIR, level: 1, dur: DUR[7], still: 0.9, title: { nl: 'Waarvoor is deze lucht?', en: 'What is this air for?' },
      beats: [
        { nl: '{t:Oneigenlijk gebruik|Oneigenlijk gebruik}: open blaaspijpjes, koelen met lucht, vacuüm maken met perslucht.', en: '{t:Inappropriate use|Inappropriate use}: open blow-offs, cooling with air, making vacuum with compressed air.', cue: { 'Oneigenlijk gebruik': 'gun' } },
        { nl: 'Een ventilator, blower of vacuümpomp doet het voor een fractie van de energie.', en: 'A fan, blower or vacuum pump does it for a fraction of the energy.', cues: ['cmp'] },
        { nl: 'Blaas nooit perslucht op je huid of je kleding.', en: 'Never blow compressed air at your skin or your clothes.', cues: ['warn'] },
        { nl: 'Minder vraag is meestal goedkoper dan een zuiniger compressor. Waarvoor is deze lucht?', en: 'Less demand is usually cheaper than a more efficient compressor. What is this air for?', cues: ['ask'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this explains fully. No "/", "&", "·", "×", "="
// or units as symbols in the spoken text: kilowatt, kilowattuur and kubieke
// meter are written out (espeak-ng spells kW and m³ badly), as in
// eng.power.motor. Terms as in the power films: rendement and vermogen,
// manometer (its stress fixed by the kit lexicon). Dutch words checked with espeak-ng phonemes (Piper's
// own bridge, nl_NL-alex-medium, films/_kit/voice-ab/phon.py); see the SAY
// notes in films/_kit/timeline.mjs for the words given a Dutch spoken form.
const SAY = [
  [ // s1 from compressor to cylinder
    { nl: 'Perslucht is schoon en handig, en daarom zit het overal: in cilinders, ventielen, gereedschap en blaaspistolen. Het is ook de duurste manier om energie rond te brengen.',
      en: 'Compressed air is clean and handy, which is why it is everywhere: in cylinders, valves, tools and blow guns. It is also the most expensive way to deliver energy.' },
    { nl: 'Een motor drijft de compressor aan, en die perst buitenlucht samen tot zo’n {n:7} bar boven de atmosferische druk.',
      en: 'A motor drives the compressor, and it squeezes outside air to around {n:7} bar above atmospheric pressure.' },
  ],
  [ // s2 where the power goes
    { nl: 'Van de stroom die de compressor opneemt, wordt het meeste warmte. Maar zo’n {n:10} procent doet nuttig werk bij de gebruiker.',
      en: 'Of the electricity the compressor takes in, most becomes heat. Only around {n:10} percent does useful work at the point of use.' },
    { nl: '{t:Warmteterugwinning|Warmteterugwinning} haalt via een warmtewisselaar een deel terug, voor warm water of ruimteverwarming.',
      en: '{t:Heat recovery|Heat recovery} wins part of it back through a heat exchanger, for hot water or space heating.' },
  ],
  [ // s3 clean and dry
    { nl: 'Buitenlucht bevat waterdamp, en na het samenpersen condenseert dat water. Water en olie beschadigen ventielen en cilinders.',
      en: 'Outside air holds water vapour, and after compression that water condenses. Water and oil damage valves and cylinders.' },
    { nl: 'Daarom staat er na de compressor een {t:Droger|droger} die het water eruit haalt. Zonder droger verzamelt condenswater zich in de leidingen.',
      en: 'That is why a {t:Dryer|dryer} stands after the compressor, to take the water out of the air. Without a dryer, condensate collects in the pipes.' },
    { nl: 'Filters halen olie en stof eruit, en een aftap loost het opgevangen water.',
      en: 'Filters take out oil and dust, and a drain lets out the water they catch.' },
  ],
  [ // s4 at the machine
    { nl: 'Vóór elke machine zit een {t:Verzorgingseenheid|verzorgingseenheid}: filter, regelaar en olienevelaar op een rij.',
      en: 'Before each machine sits an {t:FRL unit|FRL unit}: filter, regulator and lubricator in a row.' },
    { nl: 'Het filter vangt nog een keer vuil en water op, vlak voor de machine.',
      en: 'The filter catches dirt and water once more, just before the machine.' },
    { nl: 'De regelaar zet de druk die deze machine nodig heeft, hier {n:6} bar, ook als het net hoger staat. De manometer toont die druk.',
      en: 'The regulator sets the pressure this machine needs, here {n:6} bar, even when the network is higher. The gauge shows that pressure.' },
    { nl: 'De olienevelaar voegt een olienevel toe waar componenten erom vragen. Veel moderne cilinders en ventielen kunnen zonder.',
      en: 'The lubricator adds an oil mist where components ask for it. Many modern cylinders and valves do without.' },
  ],
  [ // s5 pressure costs energy
    { nl: 'De {t:Netdruk|netdruk} is de druk die de compressoren in de leidingen houden. Elke bar extra kost ruwweg {n:7} procent meer energie; schattingen lopen van {n:6} tot {n:8} procent.',
      en: 'The {t:Network pressure|network pressure} is the pressure the compressors keep in the pipes. Each extra bar costs roughly {n:7} percent more energy; estimates run from {n:6} to {n:8} percent.' },
    { nl: 'Hoe hoger de druk, hoe harder elk lek blaast.',
      en: 'The higher the pressure, the harder every leak blows.' },
    { nl: 'Veel fabrieken draaien op {n:7} of {n:8} bar, omdat één machine dat nodig heeft. Dan betaalt de hele fabriek mee.',
      en: 'Many plants run at {n:7} or {n:8} bar, because one machine needs it. Then the whole plant pays for it.' },
    { nl: 'Los die machine lokaal op: met een booster of kleine extra compressor, een dikkere aanvoerleiding of een eigen buffervat. Dan kan het hele net omlaag.',
      en: 'Solve that machine locally: with a booster or a small extra compressor, a bigger supply line or a tank of its own. Then the whole network can come down.' },
  ],
  [ // s6 the leak test
    { nl: 'Lekken zijn het grote verlies. Zonder lekprogramma ontsnapt vaak {n:20} tot {n:30} procent van de lucht, via koppelingen, slangen en ventielen.',
      en: 'Leaks are the big loss. Without a leak programme, often {n:20} to {n:30} percent of the air escapes, through couplings, hoses and valves.' },
    { nl: 'De {t:Lektest|lektest} laat het zien: kijk in het weekend, met de productie stil, hoeveel van de tijd de compressor nog in last draait, dus echt lucht samenperst. Dat deel is vooral lekkage.',
      en: 'The {t:Leak test|leak test} shows it: at the weekend, with production stopped, check how much of the time the compressor still runs loaded, actually compressing. That share is mostly leaks.' },
    { nl: 'Een voorbeeld: deze compressor van {n:75} kilowatt levert in last {n:10} kubieke meter per minuut. Niets zou nu lucht gebruiken, maar hij draait {n:40} procent van de tijd in last.',
      en: 'An example: this {n:75} kilowatt compressor delivers {n:10} cubic metres a minute when loaded. Nothing should use air now, but it runs loaded {n:40} percent of the time.' },
    { nl: 'Dan lekt er zo’n {n:40} procent van {n:10}, dus {n:4} kubieke meter per minuut weg. Dag en nacht.',
      en: 'Then about {n:40} percent of {n:10}, so {n:4} cubic metres a minute, leaks away. Day and night.' },
  ],
  [ // s7 the leak bill
    { nl: 'Lekken lopen het hele jaar door. Neem {n:75} kilowatt in last, maal {n:40} procent, maal {n:8760} uur: zo’n {n:263000} kilowattuur.',
      en: 'Leaks run all year. Take {n:75} kilowatts when loaded, times {n:40} percent, times {n:8760} hours: about {n:263000} kilowatt hours.' },
    { nl: 'Bij vijftien cent per kilowattuur is dat ruwweg {n:39000} euro per jaar, en dan telt het vermogen in nullast, draaien zonder samen te persen, nog niet mee.',
      en: 'At fifteen cents per kilowatt hour, that is roughly {n:39000} euros a year, ignoring the power it draws running unloaded, idling without compressing.' },
    { nl: 'Lekken vind je met een ultrasone lekzoeker, die het sissen hoort dat jij niet hoort. Elk lek krijgt een label en wordt gerepareerd.',
      en: 'You find leaks with an ultrasonic detector, which hears the hiss you can’t. Each leak gets a tag and is repaired.' },
    { nl: 'Zo’n ronde kost meestal een paar duizend euro: een klassieke snelle winst. Zet daarna de netdruk {n:1} bar lager, en bespaar nog eens ruwweg {n:7} procent.',
      en: 'A round like that typically costs a few thousand euros: a classic quick win. Then lower the network pressure by {n:1} bar, and save roughly another {n:7} percent.' },
  ],
  [ // s8 what is this air for?
    { nl: 'Het derde verlies is {t:Oneigenlijk gebruik|oneigenlijk gebruik}: een open blaaspijpje dat de hele dag blaast, koelen met lucht, of vacuüm maken met perslucht.',
      en: 'The third loss is {t:Inappropriate use|inappropriate use}: an open blow-off that blows all day, cooling with air, or making vacuum with compressed air.' },
    { nl: 'Een ventilator, blower of vacuümpomp doet dat werk voor een fractie van de energie.',
      en: 'A fan, blower or vacuum pump does that job for a fraction of the energy.' },
    { nl: 'En blaas nooit perslucht op je huid of kleding: lucht kan via een wondje onder de huid komen, en vuil in je ogen.',
      en: 'And never blow compressed air at your skin or clothes: air can get under the skin through a small cut, and dirt into your eyes.' },
    { nl: 'Wat eerst: zuinigere compressoren met toerenregeling, of minder vraag? Experts discussiëren erover, maar minder vraag is meestal goedkoper. Vraag dus bij elke rondgang: waarvoor is deze lucht, en wat kan dat zonder perslucht?',
      en: 'What first: more efficient compressors with variable speed, or less demand? Experts argue about it, but cutting demand is usually cheaper. So ask on every walk: what is this air used for, and what could do it without compressed air?' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
{
  const resolved = resolveFilm(spec, lessons);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.pa-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pa-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.pa-glass{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6}
.pa-well{fill:var(--anatomy-shade-0);stroke:none}
.pa-dial{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.4}
.pa-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.pa-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.pa-needle{fill:none;stroke:var(--anatomy-hi);stroke-width:1;stroke-linecap:round}
.pa-pipe .iso-line{stroke-width:2.2px}
.pa-flow{fill:none;stroke:var(--fp-accent);stroke-width:1.4px;stroke-dasharray:2 3.6;stroke-linecap:round}
.pa-wflow{fill:none;stroke:var(--fp-accent);stroke-width:1.4px;stroke-dasharray:4 3;stroke-linecap:round}
.pa-hiss{fill:none;stroke:var(--fp-accent);stroke-width:.8px;stroke-linecap:round}
.pa-air{fill:none;stroke:var(--fp-accent);stroke-width:.7px;stroke-dasharray:1.6 2.2;stroke-linecap:round}
.pa-drop{fill:var(--fp-accent);stroke:none}
.pa-tagw{fill:var(--fp-accent);stroke:var(--fp-accent);stroke-width:.4}
.pa-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pa-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pa-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.pa-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pa-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.pa-wall{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1.4}
.pa-steel{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.4}
.pa-fill{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:none}
.pa-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pa-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pa-acc{fill:var(--fp-accent);stroke:none}
.pa-dot{fill:var(--anatomy-mid);stroke:none}
.pa-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.pa-bar{fill:var(--anatomy-mid);stroke:none}
.pa-badge{fill:var(--fp-accent);stroke:none}
.pa-badgeT{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
[data-cue][data-on] .pa-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .pa-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .pa-needle{stroke:var(--fp-accent)}
[data-cue][data-on] .pa-steel{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een persluchtinstallatie van compressorruimte tot machine: op een frame een motor met koppelingskap en een schroefcompressor, een nakoeler met ventilator, een platenwarmtewisselaar met leidingen naar een boiler, en een bedieningskast met een lamp voor in last. Daarnaast een buffervat met manometer, veiligheidsklep en aftap, een koeldroger en een leidingfilter. Een stijgleiding en een hoofdleiding langs de achterkant lopen naar een machine met een verzorgingseenheid (filter, regelaar met manometer, olienevelaar), een ventiel en een cilinder die een blok duwt, en een blaaspistool aan een slang. Koppelingen lekken. Kaarten tonen waar de energie blijft, de verzorgingseenheid in doorsnede, de druk en de energie, de lektest in het weekend, de lekrekening per jaar en lijstjes.',
  en: 'A compressed air system from compressor room to machine: on a skid a motor with a coupling guard and a screw compressor, an aftercooler with a fan, a plate heat exchanger piped to a boiler, and a control panel with a loaded lamp. Next to it a receiver with a gauge, safety valve and drain, a refrigeration dryer and a line filter. A riser and a header along the back run to a machine with an FRL unit (filter, regulator with gauge, lubricator), a valve and a cylinder pushing a block, and a blow gun on a hose. Couplings leak. Cards show where the energy goes, the FRL unit in section, pressure and energy, the weekend leak test, the yearly leak bill and checklists.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

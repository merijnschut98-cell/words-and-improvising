// Dev tool, not shipped. Builds the explainer film "Draaien / Turning" for the
// turning topic of Verspanen (cutting L2, turnfinish L3, turncell L4).
//
//   node films/eng.machining.turning/build.mjs            build the page
//   node films/eng.machining.turning/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.turning.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.1.
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
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// cutting: Ø60 at 220 m/min, f 0,3, a 200 mm pass; f 0,4 for the heavier feed
const VC = 220;
const D = 60;
const nOf = (vc, d) => (vc * 1000) / (Math.PI * d);
const N = nOf(VC, D);
assert(Math.round(N) === 1167, `n = ${N}`);
assert(Math.round(nOf(200, 50)) === 1273, 'teach: Ø50 at 200 m/min → 1.273');
assert(Math.round(0.3 * Math.round(N)) === 350, 'feed rate 350 mm/min');
assert(Math.round((200 / (0.3 * Math.round(N))) * 60) === 34, '34 s per pass');
assert(Math.round(0.4 * Math.round(N)) === 467, 'feed rate at f 0,4');
assert(Math.round((200 / (0.4 * Math.round(N))) * 60) === 26, '26 s per pass at f 0,4');
// turnfinish: Ra ≈ f² / (32 r) × 1000
const ra = (f, r) => ((f * f) / (32 * r)) * 1000;
assert(near(ra(0.25, 0.8), 2.4, 0.05), 'Ra 2,4 µm at f 0,25, r 0,8');
assert(near(ra(0.14, 0.8), 0.77, 0.005), 'Ra 0,77 µm at f 0,14');
assert(near(ra(0.125, 0.8) / ra(0.25, 0.8), 0.25, 1e-9), 'half the feed, a quarter of Ra');
assert(160 / 20 === 8, 'slenderness 160 / 20 = 8 × D');
// turncell: two machines €8,67 against 6,0 min complete
assert(near((4.0 / 60) * 70 + (3.0 / 60) * 80, 8.67, 0.005), 'two machines €8,67 per part');

// ---------------------------------------------------------------- the world (mm)
// x along the spindle (headstock at -x), y toward the operator, z up; the
// spindle axis is z = 0. The insert cuts at the front of the shaft (+y).
const W = 640;
const H = 400;
const TIP = [100, 30];
const INS = [[0, 0], [12.8, 2.2], [14.8, 13.4], [2, 11.2]]; // 80° rhombus, plan, from the tip
const DUR = [14, 15, 19, 15, 19, 15, 23, 25];
const C = {
  CF: -94, TIP, INS, dur: DUR, vc: VC, nMax: 3000,
  RX: -14, HOLE_X: 0, PART_FROM: -20, BAR_END: 26, T: [0, 0, 92], TR: 38, DRILL_L: 24,
  DIAL: [W - 66, 66], CLOCK: [W - 60, 60], MAG: [W - 146, 214], MAG_R: 116,
};
const end6 = C.CF + 160;

const FIT = [
  ...k.boxCorners({ x: -445, y: -70, w: 690, d: 132 }, -130, 58),
  [0, 140, -40], [0, 92, 44],
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 58, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, 4, bevel), style);
const discX = (x0, x1, r, o = [0, 0], style = {}) => S(G.disc(0, x1 - x0, r, G.frameOf([x0, o[0], o[1]], X, Y, Z), P), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;

// ---------------------------------------------------------------- static parts
const bed = [
  box({ x: -235, y: -70, w: 480, d: 132, r: 4 }, -130, -100),
  L(k.sideSeam({ x: -235, y: -70, w: 480, d: 132, r: 4 }, -108, P, 4), { tone: 'faint' }),
  box({ x: -125, y: -52, w: 365, d: 14 }, -100, -94, { crease: 'lo' }),
  box({ x: -125, y: 22, w: 365, d: 14 }, -100, -94, { crease: 'lo' }),
].join('');

const feeder = [
  box({ x: -430, y: -18, w: 12, d: 36 }, -130, -64),
  box({ x: -282, y: -18, w: 12, d: 36 }, -130, -64),
  box({ x: -445, y: -24, w: 200, d: 48, r: 2 }, -64, -18, {}, 0.8),
  L(k.sideSeam({ x: -445, y: -24, w: 200, d: 48, r: 2 }, -26, P, 4), { tone: 'faint' }),
  discX(-445, -226, 15, [0, 0], { tone: 'hi', crease: 'lo' }),
].join('') + g('pusher', box({ x: -440, y: -7, w: 22, d: 14 }, 15, 27, { tone: 'hi', crease: 'lo' }));

const head = (() => {
  const HB = { x: -225, y: -60, w: 92, d: 110, r: 3 };
  const lid = k.insetPlan(HB, 2.5);
  const yf = HB.y + HB.d;
  const vents = [44, 48, 52].map((z) => k.pathOf([[-215, yf, z], [-185, yf, z]].map(at))).join('');
  return [
    box(HB, -100, 58, {}, 0.8),
    L(k.sideSeam(HB, 50, P, 4), { tone: 'faint' }),
    L(vents, { tone: 'lo' }),
    box(lid, 58, 61, { crease: 'lo' }, 0.4),
    k.dotsSvg(k.corners(lid, 4).map(([x, y]) => at([x, y, 61])), { size: 0.5 }),
    discX(-133, -127, 46),
    S(G.solidOf([[0, 56], [29, 56], [33, 52]], G.frameOf([-127, 0, 0], X, Y, Z), P), { crease: 'lo', inner: L(G.arcOf(G.frameOf([-127, 0, 0], X, Y, Z), 10, 56, P), { tone: 'faint' }) }),
  ].join('');
})();

const carriage = [
  box({ x: TIP[0] - 24, y: -66, w: 62, d: 148, r: 2 }, -94, -64),
  L(k.sideSeam({ x: TIP[0] - 24, y: -66, w: 62, d: 148, r: 2 }, -70, P, 4), { tone: 'faint' }),
  box({ x: TIP[0] - 12, y: TIP[1] + 6, w: 42, d: 84 }, -64, -52, { crease: 'lo' }),
].join('');

const breakerPoly = (() => {
  const e = INS[1];
  const len = Math.hypot(e[0], e[1]);
  const ux = e[0] / len;
  const uy = e[1] / len;
  const nx = -uy;
  const ny = ux; // inward
  const p = (a, b) => [TIP[0] + ux * a + nx * b, TIP[1] + uy * a + ny * b];
  return [p(1.5, 1.4), p(10.5, 1.4), p(10.5, 3.2), p(1.5, 3.2)];
})();
const slide = [
  box({ x: TIP[0] - 4, y: TIP[1] + 50, w: 30, d: 32, r: 1.5 }, -52, -17, {}, 0.6),
  k.dotsSvg([[TIP[0] + 2, TIP[1] + 56], [TIP[0] + 20, TIP[1] + 56], [TIP[0] + 2, TIP[1] + 76], [TIP[0] + 20, TIP[1] + 76]].map(([x, y]) => at([x, y, -17])), { size: 0.6 }),
  box({ x: TIP[0] + 1.5, y: TIP[1] + 9, w: 15, d: 76 }, -17, -5, { crease: 'lo' }, 0.3),
  `<g data-cue="insert">${g('insert', '')}</g>`,
  `<g data-cue="wear">${g('wear', '')}</g>`,
  box({ x: TIP[0] + 7, y: TIP[1] + 8, w: 9, d: 8 }, 0, 3, { crease: 'lo' }, 0.3),
  g('breaker', `<path class="fp-mark fp-groove" d="${k.onTop(breakerPoly, 0.05, P, true)}"/>`, ' data-cue="breaker"'),
].join('');

const R7 = 10;
const restBack = [
  box({ x: C.RX - 7, y: -34, w: 14, d: 68 }, -94, -26),
  box({ x: C.RX - 6, y: -30, w: 12, d: 8 }, -26, 22),
  discX(C.RX - 4, C.RX + 4, 5, [-(R7 + 5) * Math.cos(Math.PI / 6), -(R7 + 5) * 0.5], { tone: 'hi', crease: 'lo' }),
].join('');
const restFront = [
  box({ x: C.RX - 6, y: 22, w: 12, d: 8 }, -26, 22),
  box({ x: C.RX - 6, y: -30, w: 12, d: 60 }, 22, 30),
  discX(C.RX - 4, C.RX + 4, 5, [0, R7 + 5], { tone: 'hi', crease: 'lo' }),
  discX(C.RX - 4, C.RX + 4, 5, [(R7 + 5) * Math.cos(Math.PI / 6), -(R7 + 5) * 0.5], { tone: 'hi', crease: 'lo' }),
].join('');

const tail = (() => {
  const tipX = end6 - 3;
  return [
    box({ x: tipX + 21, y: -40, w: 60, d: 80, r: 1.5 }, -94, -82),
    box({ x: tipX + 27, y: -22, w: 46, d: 44, r: 3 }, -82, 24, {}, 0.7),
    L(k.sideSeam({ x: tipX + 27, y: -22, w: 46, d: 44, r: 3 }, 18, P, 4), { tone: 'faint' }),
    discX(tipX + 73, tipX + 77, 5),
    discX(tipX + 77, tipX + 81, 16, [0, 0], { crease: 'lo' }),
    discX(tipX + 9, tipX + 33, 10, [0, 0], { tone: 'hi', crease: 'lo' }),
    S(G.solidOf([[0, 0.8], [6, 6], [9, 6]], G.frameOf([tipX, 0, 0], X, Y, Z), P), { tone: 'mid', crease: 'lo' }),
  ].join('');
})();

const catcher = (() => {
  const plan = { x: C.PART_FROM - 12, y: 8, w: 76, d: 54, r: 2 };
  return box(plan, -100, -86) + L(k.planOutline(k.insetPlan(plan, 4), -86, P, 4), { tone: 'lo' });
})();

// the turret's column stands behind the bar, so it is drawn before it
const turretColumn = [
  box({ x: C.T[0] - 20, y: -78, w: 40, d: 26, r: 2 }, -100, C.T[2] + 14),
  box({ x: C.T[0] - 16, y: -52, w: 32, d: 40, r: 1.5 }, C.T[2] - 10, C.T[2] + 10),
].join('');

const turretStatic = (() => {
  const Ft = G.frameOf(C.T, X, Y, Z);
  return [
    g('turretBack', ''),
    S(G.disc(-8, 8, C.TR - 5, Ft, P), { crease: 'lo' }),
    S(G.disc(8, 13, 14, Ft, P), { tone: 'mid' }),
    k.dotsSvg(G.dotsOf(Ft, 13, 9, 6, P, { least: -1 }), { size: 0.5 }),
    g('turretSpin', ''),
    g('live', '', ' data-cue="live"'),
  ].join('');
})();

// ---------------------------------------------------------------- HUD (stage space, not under the camera)
const ring = (cx, cy, r) => `<circle class="fp-mark" cx="${cx}" cy="${cy}" r="${r}"/>`;
const ticks = (cx, cy, r0, r1, n, from = -2.35, to = 2.35) => Array.from({ length: n }, (_, i) => {
  const a = from + ((to - from) * i) / (n - 1);
  return `M${(cx + Math.sin(a) * r0).toFixed(1)} ${(cy - Math.cos(a) * r0).toFixed(1)}L${(cx + Math.sin(a) * r1).toFixed(1)} ${(cy - Math.cos(a) * r1).toFixed(1)}`;
}).join('');
const hudText = (x, y, t, size = 22, anchor = 'middle') => `<text class="fp-ink fp-label" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
const [dx, dy] = C.DIAL;
const [cx2, cy2] = C.CLOCK;
const [mx, my] = C.MAG;
const hud = [
  g('dial', `<circle class="fp-hud-bg" cx="${dx}" cy="${dy}" r="56"/>${ring(dx, dy, 52)}<path class="fp-mark" d="${ticks(dx, dy, 44, 50, 9)}"/>${g('needle', '')}<circle class="fp-ink" cx="${dx}" cy="${dy}" r="3.5"/>${hudText(dx, dy + 34, 'n')}`, ' data-cue="rpm"'),
  g('clock', `<circle class="fp-hud-bg" cx="${cx2}" cy="${cy2}" r="46"/>${ring(cx2, cy2, 42)}<path class="fp-mark" d="${ticks(cx2, cy2, 35, 40, 12, 0, Math.PI * 2 * 11 / 12)}"/>${g('hand', '')}<circle class="fp-ink" cx="${cx2}" cy="${cy2}" r="3"/>`, ' data-cue="wear"'),
  g('mag', `${g('magLead', '')}<clipPath id="fp-magclip"><circle cx="${mx}" cy="${my}" r="${C.MAG_R}"/></clipPath><circle class="fp-hud-bg" cx="${mx}" cy="${my}" r="${C.MAG_R}"/><g clip-path="url(#fp-magclip)">${g('magProfile', '')}${g('magMid', '')}<g data-cue="nose">${g('magNose', '')}</g></g>${ring(mx, my, C.MAG_R)}`),
  g('ld', `${hudText(W - 18, H - 18, 'L / D', 26, 'end')}`, ' data-cue="ld"'),
].join('');

// ---------------------------------------------------------------- the drawing
const world = [
  g('bed', bed),
  g('catcher', catcher),
  g('feeder', feeder, ' data-cue="barfeed"'),
  g('head', head, ' data-cue="millturn"'),
  g('car', carriage),
  g('tcol', turretColumn, ' data-cue="millturn"'),
  g('restB', restBack, ' data-cue="steady"'),
  g('jawsB', ''),
  g('shaft', ''),
  g('step', '', ' data-cue="ap"'),
  g('face', ''),
  g('marks', ''),
  g('part', '', ' data-cue="complete"'),
  g('holes', ''),
  g('jawsF', ''),
  g('feedmark', '', ' data-cue="feed"'),
  g('restF', restFront, ' data-cue="steady"'),
  g('tail', tail, ' data-cue="tail"'),
  g('turret', turretStatic, ' data-cue="millturn"'),
  g('slide', slide),
  g('vc', '', ' data-cue="vc"'),
  g('chips', ''),
  g('dimL', '', ' data-cue="overhang"'),
  g('dimD', ''),
  g('carc', '', ' data-cue="caxis"'),
  g('yarr', '', ' data-cue="yaxis"'),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([40, 10, -10], 420), to: cam([88, 30, 0], 220), a: 0, b: 0.6 },
  { from: cam([70, 0, -6], 340), to: cam([80, 6, -2], 320) },
  { from: cam([70, 20, -10], 380), to: cam([-30, 20, -10], 380), a: 0.05, b: 0.95 },
  { from: cam([100, 30, -2], 170), to: cam([62, 30, -2], 170) },
  { from: cam([110, 30, 0], 300), to: cam([96, 30, 0], 300) },
  { from: cam([70, 30, 0], 200), to: cam([44, 30, 0], 140), a: 0, b: 0.45 },
  { from: cam([-24, 0, -6], 400), to: cam([-4, 0, -6], 380) },
  { from: cam([-10, 10, 20], 330), to: cam([-160, 10, -30], 640), a: 0.68, b: 0.82 },
];

// ---------------------------------------------------------------- the film
const spec = {
  id: 'eng.machining.turning',
  title: { nl: 'Draaien', en: 'Turning' },
  lessons: ['eng.machining.cutting', 'eng.machining.turnfinish', 'eng.machining.turncell'],
  scenes: [
    {
      id: 's1', lesson: 'eng.machining.cutting', level: 2, dur: DUR[0], still: 0.8, title: { nl: 'De snede', en: 'The cut' },
      beats: [
        { nl: 'Een hardmetalen {t:Wisselplaat|wisselplaat} snijdt de draaiende as.', en: 'A {t:Carbide insert|carbide insert} cuts the spinning shaft.', cue: { Wisselplaat: 'insert' } },
        { nl: 'De {t:Snijsnelheid|snijsnelheid} is hoe snel het materiaal langs de snijkant gaat, in meter per minuut.', en: 'The {t:Cutting speed|cutting speed} is how fast the material passes the cutting edge, in metres per minute.', cue: { Snijsnelheid: 'vc' } },
      ],
    },
    {
      id: 's2', lesson: 'eng.machining.cutting', level: 2, dur: DUR[1], still: 0.75, title: { nl: 'Het toerental', en: 'Spindle speed' },
      beats: [
        { nl: 'Het {t:Toerental|toerental} volgt uit de diameter: bij Ø{n:60} en {n:220} m/min draait de spil {n:1167} omw/min.', en: 'The {t:Spindle speed|spindle speed} follows from the diameter: at Ø{n:60} and {n:220} m/min the spindle turns at {n:1167} rpm.', cue: { Toerental: 'rpm' }, read: { nl: 'n = {n:220000} / (π × {n:60}) = {n:1167} omw/min', en: 'n = {n:220000} / (π × {n:60}) = {n:1167} rpm' } },
        { nl: 'Hoe dunner, hoe meer toeren: de besturing houdt de snijsnelheid gelijk.', en: 'The thinner it gets, the faster it spins: the control holds the cutting speed.', cues: ['rpm'] },
      ],
    },
    {
      id: 's3', lesson: 'eng.machining.cutting', level: 2, dur: DUR[2], still: 0.55, title: { nl: 'Voeding en snedediepte', en: 'Feed and depth of cut' },
      beats: [
        { nl: 'De {t:Voeding|voeding} is hoe ver de beitel per omwenteling opschuift: hier {n:0.3} mm.', en: 'The {t:Feed|feed} is how far the tool moves on per revolution: here {n:0.3} mm.', cue: { Voeding: 'feed' } },
        { nl: 'De {t:Snedediepte|snedediepte} is hoe diep hij erin gaat: de stap in de as.', en: 'The {t:Depth of cut|depth of cut} is how deep it goes in: the step in the shaft.', cue: { Snedediepte: 'ap' } },
        { nl: '{n:0.3} × {n:1167} = {n:350} mm/min, dus {n:200} mm duurt {n:34} seconden.', en: '{n:0.3} × {n:1167} = {n:350} mm/min, so {n:200} mm takes {n:34} seconds.', read: { nl: 'f {n:0.3} · {n:350} mm/min · {n:200} mm = {n:34} s', en: 'f {n:0.3} · {n:350} mm/min · {n:200} mm = {n:34} s' } },
      ],
    },
    {
      id: 's4', lesson: 'eng.machining.cutting', level: 2, dur: DUR[3], still: 0.5, title: { nl: 'Standtijd', en: 'Tool life' },
      beats: [
        { nl: 'Sneller snijden geeft kortere cycli, maar een kortere {t:Standtijd|standtijd}: de snijkant slijt.', en: 'Cutting faster gives shorter cycles, but a shorter {t:Tool life|tool life}: the edge wears.', cue: { Standtijd: 'wear' } },
        { nl: 'Bij voordraaien daarom eerst meer voeding: f {n:0.4} geeft {n:467} mm/min en {n:26} seconden per snede.', en: 'So when roughing, raise the feed first: f {n:0.4} gives {n:467} mm/min and {n:26} seconds per cut.', read: { nl: 'f {n:0.4} · {n:467} mm/min · {n:26} s', en: 'f {n:0.4} · {n:467} mm/min · {n:26} s' } },
      ],
    },
    {
      id: 's5', lesson: 'eng.machining.turnfinish', level: 3, dur: DUR[4], still: 0.3, title: { nl: 'Hoekradius en ruwheid', en: 'Nose radius and roughness' },
      beats: [
        { nl: 'De ronde punt van de plaat is de {t:Hoekradius|hoekradius}: hij laat fijne groefjes na.', en: 'The rounded tip of the insert is the {t:Nose radius|nose radius}: it leaves fine grooves.', cue: { Hoekradius: 'nose' }, read: { nl: 'f {n:0.25} · r {n:0.8} → Ra {n:2.4} µm', en: 'f {n:0.25} · r {n:0.8} → Ra {n:2.4} µm' } },
        { nl: 'Een grotere radius maakt ze ondieper; halveer de voeding en Ra wordt een kwart.', en: 'A larger radius makes them shallower; halve the feed and Ra drops to a quarter.', cues: ['nose'], read: { nl: 'Ra ≈ f² / ({n:32} × r) × {n:1000} µm', en: 'Ra ≈ f² / ({n:32} × r) × {n:1000} µm' } },
        { nl: 'Bij f {n:0.14} wordt Ra theoretisch {n:0.77} µm in plaats van {n:2.4}.', en: 'At f {n:0.14}, the theoretical Ra is {n:0.77} µm instead of {n:2.4}.', read: { nl: 'f {n:0.14} · r {n:0.8} → Ra {n:0.77} µm', en: 'f {n:0.14} · r {n:0.8} → Ra {n:0.77} µm' } },
      ],
    },
    {
      id: 's6', lesson: 'eng.machining.turnfinish', level: 3, dur: DUR[5], still: 0.3, title: { nl: 'De spaan breken', en: 'Breaking the chip' },
      beats: [
        { nl: 'De {t:Spaanbreker|spaanbreker} op de plaat krult de spaan tot een korte {n:6} of {n:9} en breekt hem.', en: 'The {t:Chip breaker|chip breaker} on the insert curls the chip into a short {n:6} or {n:9} and breaks it.', cue: { Spaanbreker: 'breaker' } },
        { nl: 'Te weinig voeding of snedediepte? Dan krijg je lange slierten om het werkstuk.', en: 'Too little feed or depth of cut? Long, stringy chips wrap round the part.' },
      ],
    },
    {
      id: 's7', lesson: 'eng.machining.turnfinish', level: 3, dur: DUR[6], still: 0.92, title: { nl: 'Slanke assen', en: 'Slender shafts' },
      beats: [
        { nl: '{t:Slankheid|Slankheid} is de {t:Uitsteeklengte|uitsteeklengte} gedeeld door de diameter: {n:160} / {n:20} = {n:8} × D.', en: '{t:Slenderness|Slenderness} is the {t:Overhang|overhang} divided by the diameter: {n:160} / {n:20} = {n:8} × D.', cue: { Slankheid: 'ld', Uitsteeklengte: 'overhang' }, read: { nl: 'L / D = {n:160} / {n:20} = {n:8} × D', en: 'L / D = {n:160} / {n:20} = {n:8} × D' } },
        { nl: 'Zo’n as buigt weg en trilt. Boven zo’n {n:3} × D steunt de {t:Losse kop|losse kop} het eind.', en: 'Such a shaft bends away and chatters. Above about {n:3} × D the {t:Tailstock|tailstock} supports the end.', cue: { 'Losse kop': 'tail' } },
        { nl: 'Boven zo’n {n:6} × D komt er een {t:Bril|bril} bij: een steun met rollen halverwege.', en: 'Above about {n:6} × D a {t:Steady rest|steady rest} is added: a support with rollers halfway.', cue: { Bril: 'steady' } },
      ],
    },
    {
      id: 's8', lesson: 'eng.machining.turncell', level: 4, dur: DUR[7], still: 0.5, title: { nl: 'Het draaifreescentrum', en: 'The turn-mill centre' },
      beats: [
        { nl: 'Een {t:Draaifreescentrum|draaifreescentrum} freest ook, met {t:Aangedreven gereedschap|aangedreven gereedschap}.', en: 'A {t:Turn-mill centre|turn-mill centre} turns and mills: the turret carries {t:Driven tools|driven tools}.', cue: { Draaifreescentrum: 'millturn', 'Aangedreven gereedschap': 'live' } },
        { nl: 'De {t:C-as|C-as} zet de spil op een hoek: zes gaten op {n:60}°. De {t:Y-as|Y-as} schuift de frees uit het hart.', en: 'The {t:C-axis|C-axis} holds the spindle at an angle: six holes at {n:60}°. The {t:Y-axis|Y-axis} moves the cutter off centre.', cue: { 'C-as': 'caxis', 'Y-as': 'yaxis' } },
        { nl: 'Het deel valt er klaar af: {t:Compleetbewerking|compleetbewerking}.', en: 'The part drops off finished: {t:Complete machining|complete machining}.', cue: { Compleetbewerking: 'complete' }, read: { nl: 'compleet {n:6.0} min · eerst {n:4.0} + {n:3.0}', en: 'complete {n:6.0} min · was {n:4.0} + {n:3.0}' } },
        { nl: 'Een {t:Staafaanvoer|staafaanvoer} duwt de staaf steeds een stuk verder.', en: 'A {t:Bar feeder|bar feeder} keeps pushing the bar further in.', cue: { Staafaanvoer: 'barfeed' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption on screen. Same markers ({t:Term|shown}, {n:number}); the build
// checks its terms and numbers against the lessons like the captions'.
// films/_kit/narrate.mjs turns each line into speech with Piper.
const SAY = [
  [ // s1 the cut
    { nl: 'Dit is een CNC-draaibank van dichtbij. De klauwplaat laat een stalen as ronddraaien, en de beitel staat stil. Hij snijdt met een kleine {t:Wisselplaat|wisselplaat} van heel hard hardmetaal.',
      en: 'This is a CNC lathe up close. The chuck spins a steel shaft, and the tool stands still. It cuts with a small {t:Carbide insert|carbide insert}, made of very hard carbide.' },
    { nl: 'De {t:Snijsnelheid|snijsnelheid} is hoe snel het materiaal langs de snijkant schuift, in meter per minuut. Hardmetaal in staal draait zo’n {n:150} tot {n:300} meter per minuut.',
      en: 'The {t:Cutting speed|cutting speed} is how fast the material slides past the cutting edge, in metres per minute. Carbide in steel runs at about {n:150} to {n:300} metres per minute.' },
  ],
  [ // s2 spindle speed
    { nl: 'Maar de spil draait in omwentelingen per minuut. Dat {t:Toerental|toerental} volgt uit de diameter. Bij een as van {n:60} millimeter en {n:220} meter per minuut is één omtrek zo’n {n:188.5} millimeter, dus draait de spil {n:1167} toeren.',
      en: 'But the spindle turns in revolutions per minute. That {t:Spindle speed|spindle speed} follows from the diameter. For a shaft of {n:60} millimetres at {n:220} metres per minute, one circumference is about {n:188.5} millimetres, so the spindle turns at {n:1167} revolutions a minute.' },
    { nl: 'Wordt de as dunner, dan moet de spil sneller draaien voor dezelfde snijsnelheid. Daarom hoor je een draaibank optoeren als de beitel naar het midden gaat.',
      en: 'As the shaft gets thinner, the spindle must turn faster for the same cutting speed. That is why you hear a lathe speed up as the tool moves towards the centre.' },
  ],
  [ // s3 feed and depth of cut
    { nl: 'Terwijl de as draait, schuift de beitel erlangs. De {t:Voeding|voeding} is hoe ver hij per omwenteling opschuift: hier {n:0.3} millimeter.',
      en: 'As the shaft turns, the tool slides along it. The {t:Feed|feed} is how far it moves on per revolution: here {n:0.3} millimetres.' },
    { nl: 'De {t:Snedediepte|snedediepte} is hoe diep de beitel erin gaat: je ziet hem als de stap in de as.',
      en: 'The {t:Depth of cut|depth of cut} is how deep the tool goes in: you see it as the step in the shaft.' },
    { nl: 'Voeding maal toerental geeft de voedingssnelheid: {n:0.3} maal {n:1167} is {n:350} millimeter per minuut. Een snede van {n:200} millimeter duurt dan {n:34} seconden.',
      en: 'Feed times spindle speed gives the feed rate: {n:0.3} times {n:1167} is {n:350} millimetres per minute. A cut of {n:200} millimetres then takes {n:34} seconds.' },
  ],
  [ // s4 tool life
    { nl: 'Waarom niet gewoon sneller snijden? Dan wordt de snijkant heter en slijt hij sneller. Hoe lang hij meegaat heet de {t:Standtijd|standtijd}. Vuistregel bij hardmetaal: {n:20} procent sneller halveert hem ruwweg.',
      en: 'Why not simply cut faster? Then the edge runs hotter and wears faster. How long it lasts is its {t:Tool life|tool life}. Rule of thumb for carbide: {n:20} percent faster roughly halves it.' },
    { nl: 'Daarom geven engineers bij het voordraaien eerst meer voeding. Met {n:0.4} wordt het {n:467} millimeter per minuut, en duurt de snede {n:26} seconden.',
      en: 'So when roughing, engineers raise the feed first. At {n:0.4} it becomes {n:467} millimetres per minute, and the cut takes {n:26} seconds.' },
  ],
  [ // s5 nose radius and roughness
    { nl: 'Kijk nu van heel dichtbij. De punt van de wisselplaat is afgerond: dat is de {t:Hoekradius|hoekradius}, meestal {n:0.4}, {n:0.8} of {n:1.2} millimeter. Hij laat een fijne schroeflijn achter.',
      en: 'Now look very closely. The tip of the insert is rounded: that is the {t:Nose radius|nose radius}, usually {n:0.4}, {n:0.8} or {n:1.2} millimetres. It leaves a fine helix behind.' },
    { nl: 'De afstand tussen de groefjes is de voeding. Een grotere radius maakt ze ondieper. En de voeding telt in het kwadraat: halveer je hem, dan wordt de ruwheid Ra een kwart.',
      en: 'The distance between the grooves is the feed. A larger radius makes them shallower. And the feed counts squared: halve it, and the roughness Ra drops to a quarter.' },
    { nl: 'Met voeding {n:0.25} en radius {n:0.8} wordt Ra theoretisch {n:2.4} micrometer. Bij voeding {n:0.14} zakt Ra naar {n:0.77}.',
      en: 'With feed {n:0.25} and radius {n:0.8}, the theoretical Ra is {n:2.4} micrometres. At feed {n:0.14}, Ra drops to {n:0.77}.' },
  ],
  [ // s6 breaking the chip
    { nl: 'Het metaal dat eraf komt is de spaan. De {t:Spaanbreker|spaanbreker}, een vormpje op de wisselplaat, krult hem om tot hij breekt: korte krulletjes, als een {n:6} of een {n:9}.',
      en: 'The metal that comes off is the chip. The {t:Chip breaker|chip breaker}, a small shape on the insert, curls it until it breaks: short curls, like a {n:6} or a {n:9}.' },
    { nl: 'Met te weinig voeding of snedediepte werkt hij niet: dan krijg je lange slierten die om het werkstuk draaien.',
      en: 'With too little feed or depth of cut it does not work: then you get long, stringy chips that wrap round the part.' },
  ],
  [ // s7 slender shafts
    { nl: 'Een lange, dunne as buigt weg onder de beitel. Wat telt is de {t:Slankheid|slankheid}: de {t:Uitsteeklengte|uitsteeklengte} gedeeld door de diameter. Hier {n:160} gedeeld door {n:20}: {n:8} keer de diameter.',
      en: 'A long, thin shaft bends away under the tool. What counts is its {t:Slenderness|slenderness}: the {t:Overhang|overhang} divided by the diameter. Here {n:160} divided by {n:20}: {n:8} times the diameter.' },
    { nl: 'Zo’n as gaat trillen. Boven zo’n {n:3} keer de diameter steunt de {t:Losse kop|losse kop} het vrije eind met een center.',
      en: 'Such a shaft starts to chatter. Above about {n:3} times the diameter, the {t:Tailstock|tailstock} supports the free end with a centre.' },
    { nl: 'Boven zo’n {n:6} keer de diameter komt er een {t:Bril|bril} bij: een steun met rollen halverwege. Deze as heeft ze dus allebei nodig.',
      en: 'Above about {n:6} times the diameter, a {t:Steady rest|steady rest} is added: a support with rollers halfway. So this shaft needs both.' },
  ],
  [ // s8 the turn-mill centre
    { nl: 'Tot slot het {t:Draaifreescentrum|draaifreescentrum}: een draaibank die ook freest en boort. De revolver draagt {t:Aangedreven gereedschap|aangedreven gereedschap}: frezen en boren met een eigen motortje.',
      en: 'Finally, the {t:Turn-mill centre|turn-mill centre}: a lathe that also mills and drills. Its turret carries {t:Driven tools|driven tools}: cutters and drills with their own small motor.' },
    { nl: 'De {t:C-as|C-as} zet de spil op een gestuurde hoek stil: zo boor je zes gaten op {n:60} graden. De {t:Y-as|Y-as} schuift het gereedschap uit het hart, voor een recht vlak.',
      en: 'The {t:C-axis|C-axis} stops the spindle at a controlled angle: that is how you drill six holes {n:60} degrees apart. The {t:Y-axis|Y-axis} moves the tool off centre, for a straight flat.' },
    { nl: 'Het deel valt er klaar af: {t:Compleetbewerking|compleetbewerking}, in één opspanning. Een flens die eerst {n:4.0} plus {n:3.0} minuten op twee machines kostte, is hier in {n:6.0} minuten klaar.',
      en: 'The part drops off finished: {t:Complete machining|complete machining}, in one set-up. A flange that took {n:4.0} plus {n:3.0} minutes on two machines is done here in {n:6.0} minutes.' },
    { nl: 'En een {t:Staafaanvoer|staafaanvoer} duwt een staaf van zo’n {n:3} meter steeds een stukje verder. Zo draait hij na de laatste ploeg onbemand door.',
      en: 'And a {t:Bar feeder|bar feeder} keeps pushing a bar of about {n:3} metres a little further in. So it runs on unmanned after the last shift.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, tangentOf, solidOf, prismOf, lathe, disc, dotsOf, arcOf, circleOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-chip{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-ribbon{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-wear{fill:var(--fp-accent);stroke:var(--fp-accent);stroke-width:.5;vector-effect:non-scaling-stroke}
.fp-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-metal{fill:var(--anatomy-face);stroke:none}
.fp-edge{stroke:var(--anatomy-hi);stroke-width:1.6}
.fp-groove{fill:var(--anatomy-shade-0)}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
[data-k="face"] .iso-line{stroke-width:1px}
`;

const label = {
  nl: 'Een CNC-draaibank van dichtbij: een spilkast met klauwplaat, een stalen as, een slede met een wisselplaat, later een losse kop en een bril, en tot slot een draaifreescentrum met revolver, aangedreven boor en staafaanvoer.',
  en: 'A CNC lathe up close: a headstock with a chuck, a steel shaft, a slide with a carbide insert, later a tailstock and a steady rest, and finally a turn-mill centre with a turret, a driven drill and a bar feeder.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

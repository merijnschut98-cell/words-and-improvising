// Dev tool, not shipped. Builds the explainer film "Lijmen, klinken, clinchen /
// Bonding, riveting, clinching" for the topic Lijmen en mechanisch verbinden of
// Lassen en verbinden (bonding L1, adhesives L2, rivets L3, choosejoint L4).
//
//   node films/eng.joining.bonding/build.mjs            build the page
//   node films/eng.joining.bonding/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.bonding.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3. The
// world is the corner of the lesson's battery tray on a bench: an aluminium
// extrusion with a flange, bonded and riveted onto a steel crossmember, with a
// dispensing head and a riveting head that come and go. The cutaways and charts
// (the rivet piercing and flaring, the clinch button, the force-stroke curve,
// the galvanic cell) are cards in stage space over it.
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
// Asserted against the worked examples and recall of the lessons (the build
// fails if a value drifts). The {n:...} numbers in captions and narration are
// then checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// bonding: aluminium melts near 660 °C, steel near 1.500 °C (pre question)
const MELT = { al: 660, steel: 1500 };
assert(MELT.steel > 2 * MELT.al, 'steel melts far above aluminium');
// bonding (recall): a 25 × 20 mm overlap at 20 MPa carries 10 kN in shear
const LAP = { w: 25, ov: 20, tau: 20 };
LAP.area = LAP.w * LAP.ov;
LAP.kN = (LAP.area * LAP.tau) / 1000;
assert(LAP.area === 500 && near(LAP.kN, 10, 1e-9), '25 × 20 = 500 mm², × 20 MPa = 10 kN');
// the narration: 10 kN is the weight of about a tonne (10.000 N / 9,81 m/s² = 1.019 kg)
assert(near((LAP.kN * 1000) / 9.81, 1000, 25), '10 kN ≈ the weight of 1.000 kg');
// bonding (example): the battery tray, 96 self-piercing rivets every 30 mm plus 14 m of epoxy
const TRAY = { rivets: 96, pitch: 30, bead: 14 };
assert(TRAY.rivets * TRAY.pitch < TRAY.bead * 1000, '96 rivets at 30 mm span about 2,9 m, a part of the 14 m bead line');
// adhesives (example): a Ø4 bead, 3,2 m per door, density 1,3 g/cm³ → 52 g; test bead 44 g → 85 %
const BEAD = { d: 4, len: 3200, rho: 1.3, test: 44 };
BEAD.area = Math.PI * (BEAD.d / 2) ** 2;
BEAD.cm3 = (BEAD.area * BEAD.len) / 1000;
BEAD.g = BEAD.cm3 * BEAD.rho;
assert(near(BEAD.area, 12.6, 0.05) && near(BEAD.cm3, 40.2, 0.05) && near(BEAD.g, 52, 0.5), 'π × 2² = 12,6 mm² → 40,2 cm³ → 52 g');
assert(near(BEAD.test / 52, 0.85, 0.005), '44 / 52 = 85 %');
// adhesives (recall): open time 20 min, line stopped 40 min
const OPEN = { open: 20, stop: 40 };
assert(OPEN.stop > OPEN.open, 'the stop outlasts the open time');
// rivets (example): window 36–44 kN, mean 42,8 kN, +0,4 kN per 1.000 rivets, 3.000 per shift
const WIN = { lo: 36, hi: 44, mean: 42.8, drift: 0.4, shift: 3000 };
WIN.toLimit = Math.round(((WIN.hi - WIN.mean) / WIN.drift) * 1000 * 1e6) / 1e6;
assert(near(WIN.toLimit, 3000, 1e-6) && WIN.toLimit <= WIN.shift, '(44 − 42,8) / 0,4 × 1.000 = 3.000 rivets: one shift');
// choosejoint (example): 400 points, 60.000 floors, SPR € 0,06, flow-drill screw € 0,15
const COST = { pts: 400, floors: 60000, spr: 0.06, fds: 0.15 };
COST.a = COST.pts * COST.spr * COST.floors;
COST.b = COST.pts * COST.fds * COST.floors;
assert(near(COST.a, 1440000, 1e-6) && near(COST.b, 3600000, 1e-6) && near(COST.b - COST.a, 2160000, 1e-6), '€ 1.440.000 and € 3.600.000, € 2,16 M apart');

// ---------------------------------------------------------------- the world (mm)
// x along the crossmember, y toward the viewer, z up; the bench top is z = 0.
// A steel crossmember (a box beam) lies along x. An aluminium extrusion (a
// hollow box) rests on it, its flange toward the viewer bonded to the beam's
// top with a glue line and set with a row of self-piercing rivets.
const W = 640;
const H = 400;
const ST = { x: -160, y: -76, w: 320, d: 104, z0: 0, z1: 26 }; // steel crossmember
const GL = 1.6; // glue line
const AL = { x: -150, x1: 150, yb: -70, yf: -26, zb: ST.z1 + GL, top: ST.z1 + GL + 32, wall: 3.2 }; // the hollow body
const FL = { y0: -26, y1: 12, z0: ST.z1 + GL, z1: ST.z1 + GL + 3.5 }; // its flange, toward the viewer
const RIV = { y: -7, r: 4.6, h: 1.1, xs: [] };
for (let x = -126; x <= 126; x += 28) RIV.xs.push(x);
const SETX = RIV.xs[6]; // the riveting head works above this rivet
const BEADY = RIV.y - 6; // the bead runs beside the rivet row
const DISP = { x0: -138, x1: 138, z: ST.z1 + 2.6 }; // nozzle tip path over the bare beam
const TB = { x: -186, y: -120, w: 372, d: 214, r: 3 };
const UP = { setter: 64, disp: 70 };
const C = { W, H, ST, AL, FL, RIV, SETX, BEADY, DISP, UP, GL, LAP, BEAD, WIN, COST, OPEN, MELT };

const FIT = [...k.boxCorners({ x: TB.x, y: TB.y, w: TB.w, d: TB.d }, -30, 0), [SETX, RIV.y, AL.top + 110], [0, 0, AL.top + 40]];
const P = k.fitProjection(FIT, W, H, { pad: 12, azimuth: 40, elevation: 28 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0, ...plan }, z0, z1 - z0, P, plan.w > 60 ? 4 : 2, plan.w > 60 ? bevel : 0), style);
const LO = { steps: 28 };
const vert = (x, y, z) => G.frameOf([x, y, z], Z, X, Y);
const solidOf = (pr, F, o = {}) => G.solidOf(pr, F, P, { ...LO, ...o });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const view = k.towardViewer(P);
const endX = view[0] > 0 ? AL.x1 : AL.x; // the extrusion's end the viewer sees

// ---------------------------------------------------------------- the bench
const table = (() => {
  const holes = [];
  for (let x = -168; x <= 168; x += 28) for (let y = -104; y <= 80; y += 28) if (y > 36 || y < -84 || x < -170) holes.push(at([x, y, 0]));
  return [
    box({ x: TB.x + 14, y: TB.y + 14, w: TB.w - 28, d: TB.d - 28, r: 2 }, -30, -14, { tone: 'lo' }),
    box(TB, -14, 0, {}, 0.8),
    L(k.sideSeam(TB, -5, P, 4), { tone: 'faint' }),
    k.dotsSvg(holes, { size: 1.1, tone: 'lo' }),
  ].join('');
})();
// a tag plate and a parts tray on the bench, so the bench reads as a workplace
const tag = (() => {
  const T = { x: 112, y: 52, w: 52, d: 26, r: 1 };
  const rules = [58, 64, 70].map((y, i) => k.pathOf([[T.x + 6, y, 0.8], [T.x + [40, 30, 36][i], y, 0.8]].map(at))).join('');
  return box(T, 0, 0.8, { tone: 'lo', crease: 'none' }) + L(rules, { tone: 'lo', free: true }) + k.dotsSvg([at([T.x + 3, T.y + 13, 0.8]), at([T.x + T.w - 3, T.y + 13, 0.8])], { size: 0.5 });
})();
const tray = (() => {
  const T = { x: -170, y: 44, w: 70, d: 40, r: 2 };
  let s = box(T, 0, 7, { tone: 'mid' }, 0.4) + box({ x: T.x + 3, y: T.y + 3, w: T.w - 6, d: T.d - 6, r: 1 }, 6.2, 7, { tone: 'lo', crease: 'none' });
  // spare rivets lying in the tray
  for (let i = 0; i < 7; i++) s += S(k.cylinder(T.x + 12 + (i % 4) * 14, T.y + 12 + Math.floor(i / 4) * 14, 3.4, 7, 1.2, P, 16, 0), { tone: 'hi', crease: 'lo' });
  return s;
})();

// ---------------------------------------------------------------- the steel crossmember (box beam with its bolt row and a seam)
const steel = (() => {
  const plan = { x: ST.x, y: ST.y, w: ST.w, d: ST.d, r: 0 };
  const seam = L(k.sideSeam(plan, 8, P, 4), { tone: 'faint' });
  const holes = [];
  for (let x = -140; x <= 140; x += 40) holes.push([x, ST.y + ST.d, 15]);
  const rings = L(holes.map((p) => k.sideRing(p, 2.4, 'y', P, 16)).join(''), { tone: 'lo' });
  // a web stamped on the end face: the beam is a box section
  const ex = view[0] > 0 ? ST.x + ST.w : ST.x;
  const inner = [[ex, ST.y + 5, 5], [ex, ST.y + ST.d - 5, 5], [ex, ST.y + ST.d - 5, ST.z1 - 5], [ex, ST.y + 5, ST.z1 - 5]].map(at);
  return box(plan, ST.z0, ST.z1, { tone: 'mid', inner: seam }, 0.6) + rings + L(k.pathOf(inner, true), { tone: 'lo' });
})();

// ---------------------------------------------------------------- the aluminium extrusion: hollow body and flange
const alBody = (() => {
  const plan = { x: AL.x, y: AL.yb, w: AL.x1 - AL.x, d: AL.yf - AL.yb, r: 0 };
  const w = AL.wall;
  const ring = [[endX, AL.yb + w, AL.zb + w], [endX, AL.yf - w, AL.zb + w], [endX, AL.yf - w, AL.top - w], [endX, AL.yb + w, AL.top - w]].map(at);
  const mid = [[endX, (AL.yb + AL.yf) / 2, AL.zb + w], [endX, (AL.yb + AL.yf) / 2, AL.top - w]].map(at);
  // extrusion lines along the top: two fine grooves
  const grooves = [AL.yb + 9, AL.yf - 9].map((y) => k.pathOf([[AL.x + 1, y, AL.top], [AL.x1 - 1, y, AL.top]].map(at))).join('');
  return box(plan, AL.zb, AL.top, { tone: 'hi', crease: 'lo' }, 0.8) + `<path class="fp-hole" d="${k.pathOf(ring, true)}"/>` + L(k.pathOf(mid), { tone: 'lo' }) + L(grooves, { tone: 'faint' });
})();
const alFlange = box({ x: AL.x, y: FL.y0, w: AL.x1 - AL.x, d: FL.y1 - FL.y0, r: 0 }, FL.z0, FL.z1, { tone: 'hi', crease: 'lo' }, 0.4);
// the glue squeezed out along the flange's front edge
const squeeze = `<g class="fp-gluew">${S(k.slabOf({ x: AL.x + 2, y: FL.y1, w: AL.x1 - AL.x - 4, d: 2.4, r: 0 }, ST.z1, FL.z0 + 0.6 - ST.z1, P, 2, 0), { tone: 'hi', crease: 'none' })}</g>`;
const rivets = RIV.xs.map((x) => S(k.cylinder(x, RIV.y, RIV.r, FL.z1, RIV.h, P, 24, 0.3), { tone: 'hi', crease: 'lo', inner: L(k.ring(x, RIV.y, 1.8, FL.z1 + RIV.h, P, 14), { tone: 'lo' }) })).join('');

// ---------------------------------------------------------------- the riveting head (built at its working spot, moved up at rest)
const setter = (() => {
  const F = vert(SETX, RIV.y, FL.z1 + RIV.h);
  const nose = S(solidOf([[0, 6], [10, 6], [12, 8], [24, 8]], F), { tone: 'mid', crease: 'lo', inner: L(G.arcOf(F, 4, 6, P), { tone: 'faint' }) });
  const ring = S(solidOf([[24, 11], [30, 11]], F), { tone: 'lo', crease: 'lo' });
  const body = S(solidOf([[30, 15], [78, 15], [82, 13]], F), { tone: 'hi', crease: 'lo', inner: k.fadedSvg(G.ribsOf(F, 40, 72, 15, 14, P, { fade: [0.05, 0.42], seams: true }), { tone: 'lo' }) });
  const cap = S(solidOf([[82, 11], [92, 11], [95, 6], [104, 5]], F), { tone: 'mid', crease: 'lo' });
  const feed = box({ x: SETX + 12, y: RIV.y - 4, w: 34, d: 8, r: 1 }, FL.z1 + 64, FL.z1 + 72, { tone: 'mid', crease: 'lo' }, 0.3);
  const lamp = k.dotsSvg([at([SETX, RIV.y + 15.5, FL.z1 + 70])], { size: 1.4, tone: 'hi' });
  return `${feed}${nose}${ring}${body}${cap}${lamp}`;
})();

// ---------------------------------------------------------------- the dispensing head (nozzle tip at x = 0 of its path; moved along x)
const disp = (() => {
  const F = vert(0, BEADY, DISP.z);
  const tip = S(solidOf([[0, 0.9], [7, 2.2], [10, 3.2]], F), { tone: 'mid', crease: 'lo' });
  const mixer = S(solidOf([[10, 4.2], [52, 4.2], [54, 5.4]], F), { tone: 'hi', crease: 'lo', inner: k.fadedSvg(G.ribsOf(F, 14, 50, 4.2, 10, P, { fade: [0.05, 0.42], seams: true }), { tone: 'lo' }) });
  const nut = S(solidOf([[54, 7], [60, 7]], F), { tone: 'lo', crease: 'lo' });
  const head = box({ x: -12, y: BEADY - 9, w: 24, d: 18, r: 1.5 }, DISP.z + 60, DISP.z + 74, { tone: 'mid', crease: 'lo' }, 0.4);
  const carts = [-5.5, 5.5].map((dx) => S(k.cylinder(dx, BEADY, 4.6, DISP.z + 74, 34, P, 20, 0.3), { tone: dx < 0 ? 'hi' : 'mid', crease: 'lo' })).join('');
  const arm = box({ x: -6, y: BEADY - 6, w: 12, d: 12, r: 1 }, DISP.z + 108, DISP.z + 128, { tone: 'lo', crease: 'lo' }, 0.3);
  return `${tip}${mixer}${nut}${head}${carts}${arm}`;
})();

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('table', table + tag + tray),
  g('steel', steel, ' data-cue="steel"'),
  g('pbead', '', ' data-cue="rups"'), // the bead on the bare beam, drawn per frame
  g('alu', [g('alBody', alBody), g('alFlange', alFlange), g('squeeze', squeeze, ' data-cue="bead"'), g('rivs', rivets, ' data-cue="rivets"')].join(''), ' data-cue="alu"'),
  g('disp', disp, ' data-cue="mixer"'),
  g('setter', setter, ' data-cue="spr"'),
].join('');
const cueSlot = (cue, key) => `<g data-cue="${cue}">${g(key, '')}</g>`;
const hud = [
  g('scrim', `<rect class="fp-scrim" x="0" y="0" width="${W}" height="${H}"/>`),
  g('meltC', g('meltBody', '')),
  g('famC', g('famBody', '')),
  g('lapC', [g('lapBase', ''), cueSlot('shear', 'lapShear'), cueSlot('peel', 'lapPeel'), g('lapText', '')].join('')),
  g('sprC', cueSlot('spr', 'sprBody')),
  g('clinchC', [cueSlot('clinch', 'clinchBody'), cueSlot('bottom', 'clinchDim')].join('')),
  g('chooseC', cueSlot('choose', 'chooseBody')),
  g('prepC', cueSlot('prep', 'prepBody')),
  g('mixC', cueSlot('mixer', 'mixBody')),
  g('openC', cueSlot('open', 'openBody')),
  g('weighC', cueSlot('weigh', 'weighBody')),
  g('coupC', cueSlot('cohesive', 'coupBody')),
  g('blindC', cueSlot('blind', 'blindBody')),
  g('sectC', [g('sectBody', ''), cueSlot('head', 'sectHead'), cueSlot('interlock', 'sectLock')].join('')),
  g('curveC', cueSlot('curve', 'curveBody')),
  g('driftC', cueSlot('drift', 'driftBody')),
  g('galvC', [g('galvBase', ''), cueSlot('multi', 'galvMulti'), cueSlot('galv', 'galvCell'), cueSlot('series', 'galvSeries')].join('')),
  g('fdsC', [cueSlot('fds', 'fdsBody'), cueSlot('demont', 'fdsOut')].join('')),
  g('costC', cueSlot('cost', 'costBody')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat key
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WIDE = cam([0, -20, 40], 620);
const TRAYV = cam([-10, -24, 30], 470);
const LEFTV = cam([-10, -24, 30], 470, [190, 200]);
const JOINT = cam([SETX - 30, RIV.y, 40], 300);
const BEADV = cam([0, BEADY, 30], 520);
C.KEYS = [
  [WIDE, LEFTV, JOINT], // s1: the tray corner, the melting points, the bead and the rivets
  [WIDE, WIDE, WIDE, WIDE], // s2: cards
  [JOINT, WIDE, TRAYV, WIDE], // s3
  [WIDE, WIDE, WIDE], // s4
  [BEADV, WIDE, WIDE], // s5: the robot lays the bead
  [WIDE, WIDE], // s6
  [WIDE, WIDE, WIDE, WIDE], // s7
  [WIDE, WIDE, WIDE, WIDE], // s8
];

// ---------------------------------------------------------------- the film
const BO = 'eng.joining.bonding';
const AD = 'eng.joining.adhesives';
const RI = 'eng.joining.rivets';
const CJ = 'eng.joining.choosejoint';
const spec = {
  id: 'eng.joining.bonding',
  title: { nl: 'Lijmen, klinken, clinchen', en: 'Bonding, riveting, clinching' },
  lessons: [BO, AD, RI, CJ],
  scenes: [
    {
      // v14b: the Basis "how it works" opening, scenes 1–3
      id: 's1', lesson: BO, level: 1, still: 0.5, title: { nl: 'Waarom niet lassen', en: 'Why not weld' },
      beats: [
        { nl: 'Een batterijbak: aluminium profielen op stalen dwarsliggers. Lassen kan hier niet.', en: 'A battery tray: aluminium extrusions on steel crossmembers. Welding is out here.', cues: ['alu', 'steel'] },
        { nl: 'Aluminium smelt rond {n:660} °C, staal rond {n:1500} °C, en waar ze mengen worden ze bros.', en: 'Aluminium melts near {n:660} °C, steel near {n:1500} °C, and where they mix they turn brittle.', cues: ['melt'] },
        { nl: '{n:14} meter {t:Constructielijm|constructielijm} plus {n:96} klinknagels, om de {n:30} mm.', en: '{n:14} metres of {t:Structural adhesive|structural adhesive} plus {n:96} rivets, every {n:30} mm.', cue: { Constructielijm: 'bead' }, cues: ['rivets', 'spr'] },
      ],
    },
    {
      id: 's2', lesson: BO, level: 1, still: 0.5, title: { nl: 'Afschuiven of afpellen', en: 'Shear or peel' },
      beats: [
        { nl: 'Epoxy, PU en acrylaat dragen; secondelijm en MS-polymeer meestal niet.', en: 'Epoxy, PU and acrylic carry loads; superglue and MS polymer usually do not.', cues: ['fam'] },
        { nl: 'Bij {t:Afschuiving|afschuiving} schuiven de delen langs elkaar: het hele lijmvlak draagt.', en: 'In {t:Shear|shear} the parts slide along each other: the whole bond area carries.', cue: { Afschuiving: 'shear' } },
        { nl: '{n:25} × {n:20} mm = {n:500} mm²; bij {n:20} MPa draagt dat {n:10} kN.', en: '{n:25} × {n:20} mm = {n:500} mm²; at {n:20} MPa that carries {n:10} kN.', cues: ['shear'] },
        { nl: 'Bij {t:Afpellen|afpellen} trek je één rand open, als een sticker: een dun lijntje draagt alles.', en: 'In {t:Peel|peel} you pull one edge open, like a sticker: a thin line carries it all.', cue: { Afpellen: 'peel' } },
      ],
    },
    {
      id: 's3', lesson: BO, level: 1, still: 0.5, title: { nl: 'Klinken en clinchen', en: 'Riveting and clinching' },
      beats: [
        { nl: '{t:Zelfponsende klinknagels|Zelfponsende klinknagels} snijden door de bovenplaat en spreiden in de onderste.', en: '{t:Self-piercing rivets|Self-piercing rivets} cut through the top sheet and flare in the bottom one.', cue: { 'Zelfponsende klinknagels': 'spr' } },
        { nl: '{t:Clinchen|Clinchen}: een stempel drukt beide platen in een matrijs, tot een knoop die haakt.', en: '{t:Clinching|Clinching}: a punch presses both sheets into a die, into a button that interlocks.', cue: { Clinchen: 'clinch' } },
        { nl: 'Lijm plus nagels: de lijm draagt, de nagels vangen het afpellen aan de uiteinden.', en: 'Adhesive plus rivets: the adhesive carries, the rivets catch the peel at the ends.', cues: ['bead', 'rivets'] },
        { nl: 'Zelfde staal: lassen. Gemengd: lijm plus nagels. Moet het los voor service: bouten.', en: 'Same steel: weld. Mixed: adhesive plus rivets. Must it come apart for service: bolts.', cues: ['choose'] },
      ],
    },
    {
      id: 's4', lesson: AD, level: 2, still: 0.5, title: { nl: 'Voorbehandelen en mengen', en: 'Preparing and mixing' },
      beats: [
        { nl: '{t:Voorbehandeling|Voorbehandeling}: ontvetten, soms opruwen of een primer. Dan vloeit de lijm uit.', en: '{t:Surface preparation|Surface preparation}: degrease, sometimes roughen or prime. Then the adhesive wets out.', cue: { Voorbehandeling: 'prep' } },
        { nl: 'Een {t:Statische menger|statische menger} mengt hars en harder vlak voor het opbrengen.', en: 'A {t:Static mixer|static mixer} mixes resin and hardener just before application.', cue: { 'Statische menger': 'mixer' } },
        { nl: 'Binnen de {t:Open tijd|open tijd} moeten de delen op elkaar; volledig uitharden duurt veel langer.', en: 'Within the {t:Open time|open time} the parts must be joined; full curing takes much longer.', cue: { 'Open tijd': 'open' } },
      ],
    },
    {
      id: 's5', lesson: AD, level: 2, still: 0.5, title: { nl: 'De rups en de breuk', en: 'The bead and the break' },
      beats: [
        { nl: 'Een robot legt een {t:Rups|rups} van Ø{n:4} mm, {n:3.2} meter per deur: {n:52} gram.', en: 'A robot lays a {t:Bead|bead} of Ø{n:4} mm, {n:3.2} metres per door: {n:52} grams.', cue: { Rups: 'rups' }, cues: ['mixer'] },
        { nl: 'De proefrups weegt {n:44} gram: {n:85}%. Het vat stond koud; doseer op volume.', en: 'The test bead weighs {n:44} grams: {n:85}%. The drum stood cold; dose by volume.', cues: ['weigh'] },
        { nl: 'Lijm op beide delen: {t:Cohesieve breuk|cohesieve breuk}, de hechting hield. Eén kale kant: hechting faalde.', en: 'Adhesive on both parts: {t:Cohesive failure|cohesive failure}, the bond held. One bare side: adhesion failed.', cue: { 'Cohesieve breuk': 'cohesive' } },
      ],
    },
    {
      id: 's6', lesson: RI, level: 3, still: 0.5, title: { nl: 'Blindklinken en de doorsnede', en: 'Blind rivets and the cross-section' },
      beats: [
        { nl: 'Een {t:Blindklinknagel|blindklinknagel} zet je vanaf één kant: de doorn stuikt de kraag op en breekt af.', en: 'A {t:Blind rivet|blind rivet} is set from one side: the mandrel upsets the tail and snaps off.', cue: { Blindklinknagel: 'blind' } },
        { nl: 'In de macroslijp meet je de {t:Kophoogte|kophoogte} en de {t:Insluiting|insluiting} van de poot.', en: 'In the cross-section you measure the {t:Head height|head height} and the {t:Interlock|interlock} of the leg.', cue: { Kophoogte: 'head', Insluiting: 'interlock' } },
      ],
    },
    {
      id: 's7', lesson: RI, level: 3, still: 0.5, title: { nl: 'Elke nagel een curve', en: 'A curve for every rivet' },
      beats: [
        { nl: 'Bij elke nagel legt het gereedschap de {t:Kracht-wegcurve|kracht-wegcurve} vast, in een venster.', en: 'For every rivet the tool records the {t:Force-displacement curve|force-displacement curve}, in a window.', cue: { 'Kracht-wegcurve': 'curve' } },
        { nl: 'Venster {n:36} tot {n:44} kN; het gemiddelde staat op {n:42.8} en stijgt {n:0.4} kN per {n:1000}.', en: 'Window {n:36} to {n:44} kN; the mean stands at {n:42.8} and climbs {n:0.4} kN per {n:1000}.', cues: ['drift'] },
        { nl: 'Over {n:3000} nagels raakt het de grens: binnen één ploeg. Grijp nu in.', en: 'In {n:3000} rivets it hits the limit: within one shift. Act now.', cues: ['drift'] },
        { nl: 'Bij clinchen meet je ook de {t:Bodemdikte|bodemdikte}: hoe dun de knoop onderin is.', en: 'With clinching you also measure the {t:Bottom thickness|bottom thickness}: how thin the button is at the bottom.', cue: { Bodemdikte: 'bottom' } },
      ],
    },
    {
      id: 's8', lesson: CJ, level: 4, still: 0.5, title: { nl: 'Een verbinding kiezen', en: 'Choosing a joint' },
      beats: [
        { nl: 'In een {t:Multimateriaalontwerp|multimateriaalontwerp} geeft water {t:Galvanische corrosie|galvanische corrosie}.', en: 'In {t:Multi-material design|multi-material design}, water brings {t:Galvanic corrosion|galvanic corrosion}.', cue: { Multimateriaalontwerp: 'multi', 'Galvanische corrosie': 'galv' } },
        { nl: 'De {t:Spanningsreeks|spanningsreeks}: aluminium staat onder staal en lost op. Isoleer met lijm.', en: 'The {t:Galvanic series|galvanic series}: aluminium sits below steel and dissolves. Insulate with adhesive.', cue: { Spanningsreeks: 'series' }, cues: ['galv'] },
        { nl: '{t:Demontage|Demontage}: een {t:Vloeiboorschroef|vloeiboorschroef} kan eruit, een lijmnaad niet.', en: '{t:Disassembly|Disassembly}: a {t:Flow drill screw|flow drill screw} can come out, a bond line cannot.', cue: { Demontage: 'demont', Vloeiboorschroef: 'fds' } },
        { nl: '{n:400} punten, {n:60000} vloeren per jaar: nagels €\u00a0{n:0.06}, schroeven €\u00a0{n:0.15} per stuk.', en: '{n:400} points, {n:60000} floors a year: rivets €{n:0.06}, screws €{n:0.15} each.', cues: ['cost'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said
// (millimeter, kilonewton, megapascal), money and large numbers in words
// ("zes cent", "drieduizend"); the captions assert those numbers.
const SAY = [
  [ // s1 why not weld
    { nl: 'Een hoek van een batterijbak: aluminium profielen op stalen dwarsliggers. Lassen kan hier niet.',
      en: 'A corner of a battery tray: aluminium extrusions on steel crossmembers. Welding is out here.' },
    { nl: 'Aluminium smelt rond {n:660} graden, staal pas rond {n:1500}, en waar ze mengen ontstaan brosse kristallen. Daarom verbinden we ze koud: lijmen, klinken of clinchen.',
      en: 'Aluminium melts at about {n:660} degrees, steel only at about {n:1500}, and where they mix, brittle crystals form. So we join them cold: bonding, riveting or clinching.' },
    { nl: 'Deze bak heeft {n:14} meter dragende {t:Constructielijm|constructielijm} en {n:96} klinknagels om de {n:30} millimeter. De lijm draagt over het hele vlak, dempt trillingen en dicht af. De nagels houden alles vast terwijl hij in de oven uithardt.',
      en: 'This tray has {n:14} metres of {t:Structural adhesive|structural adhesive} and {n:96} rivets every {n:30} millimetres. The adhesive carries the load over the whole surface, damps vibration and seals. The rivets hold everything while it cures in the oven.' },
  ],
  [ // s2 shear or peel
    { nl: 'Er zijn drie hoofdfamilies: epoxy is stijf en sterk, polyurethaan taaier, en acrylaat hardt snel uit. Secondelijm en MS-polymeer zijn meestal niet dragend.',
      en: 'There are three main families: epoxy is stiff and strong, polyurethane tougher, and acrylic cures fast. Superglue and MS polymer are usually not structural.' },
    { nl: 'Lijm is sterk op {t:Afschuiving|afschuiving}: de delen schuiven langs elkaar, en het hele lijmvlak draagt mee.',
      en: 'Adhesive is strong in {t:Shear|shear}: the parts slide along each other, and the whole bond area carries the load.' },
    { nl: 'Een overlap van {n:25} bij {n:20} millimeter is {n:500} vierkante millimeter. Bij {n:20} megapascal draagt die zo’n {n:10} kilonewton. Dat is het gewicht van duizend kilo op een postzegel lijm.',
      en: 'An overlap of {n:25} by {n:20} millimetres is {n:500} square millimetres. At {n:20} megapascals it carries about {n:10} kilonewtons: the weight of a tonne, on a postage stamp of glue.' },
    { nl: 'Maar lijm is zwak op {t:Afpellen|afpellen}: trek je één rand open, zoals een sticker, dan draagt een dun lijntje alle kracht.',
      en: 'But adhesive is weak in {t:Peel|peel}: pull one edge open, like a sticker, and a thin line carries all the force.' },
  ],
  [ // s3 riveting and clinching
    { nl: '{t:Zelfponsende klinknagels|Zelfponsende klinknagels} worden door de bovenste plaat geperst, en een matrijs laat hun holle poot uitspreiden in de onderste, zonder die te doorboren. Geen voorgeboord gat, geen warmte.',
      en: '{t:Self-piercing rivets|Self-piercing rivets} are pressed through the top sheet, and a die makes their hollow leg flare out in the bottom one, without piercing it. No pre-drilled hole, no heat.' },
    { nl: '{t:Clinchen|Clinchen} kan zelfs zonder nagel: een stempel drukt beide platen in een matrijs, tot een knoop die in elkaar haakt. Meestal zwakker dan een laspunt, maar snel, goedkoop en prima met gelakte plaat.',
      en: '{t:Clinching|Clinching} needs no rivet at all: a punch presses both sheets into a die, into a button that interlocks. Usually weaker than a spot weld, but quick, cheap and fine with painted sheet.' },
    { nl: 'Lijm plus nagels: de lijm draagt de afschuiving, en een nagel aan elk eind van de rups houdt het afpellen tegen, bijvoorbeeld bij een botsing.',
      en: 'Adhesive plus rivets: the adhesive carries the shear, and a rivet at each end of the bead stops the peel, in a crash for example.' },
    { nl: 'Zelfde staal, hoge sterkte: meestal lassen. Gemengde materialen en afdichten: lijm plus nagels. Moet het uit elkaar voor service: bouten.',
      en: 'Same steel, high strength: usually welding. Mixed materials and sealing: adhesive plus rivets. Must it come apart for service: bolts.' },
  ],
  [ // s4 preparing and mixing
    { nl: 'Lijm hecht alleen op een schoon vlak. Daarom begint het met {t:Voorbehandeling|voorbehandeling}: ontvetten, soms opruwen, een primer of plasma. Op olie of een vingerafdruk parelt lijm; op een schoon vlak vloeit hij uit.',
      en: 'Adhesive only sticks to a clean surface. So it starts with {t:Surface preparation|surface preparation}: degreasing, sometimes roughening, a primer or plasma. On oil or a fingerprint, adhesive beads up; on a clean surface it spreads out.' },
    { nl: 'Tweecomponentenlijm is hars plus harder. Een {t:Statische menger|statische menger}, een buisje met schroefvormige elementen, mengt ze vlak voor het opbrengen.',
      en: 'Two-part adhesive is resin plus hardener. A {t:Static mixer|static mixer}, a small tube with spiral elements, mixes them just before application.' },
    { nl: 'Binnen de {t:Open tijd|open tijd}, hier {n:20} minuten, moeten de delen op elkaar. Staat de lijn {n:40} minuten stil, dan hardt de lijm in de menger uit: eerst uitspuiten. Hanteerbaar is hij na een paar uur, op volle sterkte vaak pas na een dag, en in de kou later.',
      en: 'Within the {t:Open time|open time}, here {n:20} minutes, the parts must be joined. If the line stops for {n:40} minutes, the adhesive cures inside the mixer: purge it first. It can be handled after a few hours, often reaches full strength only after a day, and later in the cold.' },
  ],
  [ // s5 the bead and the break
    { nl: 'Een robot legt de lijm als {t:Rups|rups}: een streng van {n:4} millimeter, {n:3.2} meter per deur. Doorsnede maal lengte maal dichtheid: {n:52} gram.',
      en: 'A robot lays the adhesive as a {t:Bead|bead}: a line {n:4} millimetres thick, {n:3.2} metres per door. Cross-section times length times density: {n:52} grams.' },
    { nl: 'Een camera zoekt onderbrekingen, en elke ploeg weegt iemand een proefrups: {n:44} gram, {n:85} procent. Het vat stond koud, de lijm werd stroperig en de pomp doseerde op druk. Dus: vat op temperatuur, doseren op volume.',
      en: 'A camera looks for gaps, and every shift someone weighs a test bead: {n:44} grams, {n:85} percent. The drum stood cold, the adhesive got thick and the pump dosed by pressure. So: keep the drum warm, dose by volume.' },
    { nl: 'Kijk na een trekproef naar het breukvlak. Lijm op beide delen is een {t:Cohesieve breuk|cohesieve breuk}: de lijm zelf brak, de hechting was goed. Eén kale kant is een adhesieve breuk: bijna altijd vuil of slechte voorbehandeling.',
      en: 'After a pull test, look at the fracture. Adhesive on both parts is {t:Cohesive failure|cohesive failure}: the adhesive itself broke, the bond was good. One bare side is adhesive failure: nearly always dirt or poor preparation.' },
  ],
  [ // s6 blind rivets and the cross-section
    { nl: 'Kun je maar bij één kant, dan neem je een {t:Blindklinknagel|blindklinknagel}. Dat is een holle nagel met een doorn. Het gereedschap trekt de doorn terug, de achterkant stuikt op tot een kraag, en bij een vaste kracht breekt de doorn af.',
      en: 'If you can only reach one side, you use a {t:Blind rivet|blind rivet}: a hollow rivet with a mandrel. The tool pulls the mandrel back, the far end bulges into a collar, and at a set force the mandrel snaps.' },
    { nl: 'In een doorgezaagde zelfponsende nagel meet je de {t:Kophoogte|kophoogte}, hoe ver de kop boven of onder de plaat staat, en de {t:Insluiting|insluiting}, hoe ver de poot in de onderste plaat haakt: die bepaalt vooral de sterkte.',
      en: 'In a self-piercing rivet sawn open you measure the {t:Head height|head height}, how far the head sits above or below the sheet, and the {t:Interlock|interlock}, how far the leg hooks into the bottom sheet: that mainly decides the strength.' },
  ],
  [ // s7 a curve for every rivet
    { nl: 'Zagen kan niet bij elke nagel. Daarom legt het gereedschap de {t:Kracht-wegcurve|kracht-wegcurve} vast: perskracht tegen stempelweg. Valt die buiten het venster, dan stopt de cel.',
      en: 'You cannot saw every rivet. So the tool records the {t:Force-displacement curve|force-displacement curve}: press force against punch travel. If it falls outside the window, the cell stops.' },
    { nl: 'Het venster voor de eindkracht is {n:36} tot {n:44} kilonewton. Na een matrijswissel kruipt het gemiddelde omhoog, {n:0.4} kilonewton per duizend nagels, en staat nu op {n:42.8}.',
      en: 'The window for the final force is {n:36} to {n:44} kilonewtons. After a die change the mean creeps up, {n:0.4} kilonewtons per thousand rivets, and now stands at {n:42.8}.' },
    { nl: 'Nog drieduizend nagels en het raakt de grens: binnen één ploeg. Kijk dus nu naar matrijs, stempel en plaatpartij.',
      en: 'Three thousand more rivets and it hits the limit: within one shift. So check the die, the punch and the sheet batch now.' },
    { nl: 'Bij clinchen meet je ook de {t:Bodemdikte|bodemdikte}: hoe dun de knoop onderin is geperst.',
      en: 'With clinching you also measure the {t:Bottom thickness|bottom thickness}: how thin the button is pressed at the bottom.' },
  ],
  [ // s8 choosing a joint
    { nl: 'Bij een {t:Multimateriaalontwerp|multimateriaalontwerp} vraag je eerst: raken twee metalen elkaar en komt er water bij? Dan vormen ze een batterij, en het minst edele metaal lost op: {t:Galvanische corrosie|galvanische corrosie}.',
      en: 'In {t:Multi-material design|multi-material design} you first ask: do two metals touch, and does water get in? Then they form a battery, and the less noble metal dissolves: {t:Galvanic corrosion|galvanic corrosion}.' },
    { nl: 'In de {t:Spanningsreeks|spanningsreeks} staat aluminium onder staal, dus het aluminium lost op, het snelst als weinig aluminium tegen veel staal zit. Een isolerende lijmlaag, gecoate nagels en een droog ontwerp helpen.',
      en: 'In the {t:Galvanic series|galvanic series} aluminium sits below steel, so the aluminium dissolves, fastest when a little aluminium touches a lot of steel. An insulating adhesive layer, coated rivets and a dry design help.' },
    { nl: 'Denk ook aan {t:Demontage|demontage}, voor reparatie en recycling. Een {t:Vloeiboorschroef|vloeiboorschroef} vormt vanaf één kant zijn eigen gat en draad, en kan er weer uit. Een lijmnaad niet.',
      en: 'Think of {t:Disassembly|disassembly} too, for repair and recycling. A {t:Flow drill screw|flow drill screw} forms its own hole and thread from one side, and can come out again. A bond line cannot.' },
    { nl: 'En de kosten: vierhonderd punten per vloer, zestigduizend vloeren per jaar. Nagels van zes cent: ruim één komma vier miljoen euro. Schroeven van vijftien cent: drie komma zes miljoen. Dus meestal nagels, en schroeven alleen waar het moet.',
      en: 'And the cost: four hundred points per floor, sixty thousand floors a year. Rivets at six cents: over one point four million euros. Screws at fifteen cents: three point six million. So mostly rivets, and screws only where you must.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    // inside the beat in both languages (their beat starts differ by word share)
    const st = ['nl', 'en'].map((lang) => beatStarts(s, lang).map((t) => t / s.dur));
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = Math.max(st[0][bi], st[1][bi]);
      const e = bi + 1 < st[0].length ? Math.min(st[0][bi + 1], st[1][bi + 1]) : 1;
      b.still = Math.round((a + 0.8 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
:root{--fp-glue:#C9A24A;--fp-steelc:#5E6E72}
.iso[data-theme="light"]{--fp-glue:#A8842E;--fp-steelc:#8C9598}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-scrim{fill:var(--anatomy-card);opacity:.9}
.fp-card{fill:var(--anatomy-paper);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-al{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:1.1;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-st{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1.1;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-tool{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.1;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-rv{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-bx{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-fill{fill:var(--anatomy-mid);opacity:.55}
.fp-band{fill:var(--anatomy-mid);opacity:.22}
.fp-win{fill:var(--anatomy-mid);opacity:.16}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:6 5;vector-effect:non-scaling-stroke}
.fp-sig{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-sig2{fill:none;stroke:var(--anatomy-mid);stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-glue{fill:var(--fp-glue);stroke:none;opacity:.9}
.fp-gluel{fill:none;stroke:var(--fp-glue);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-water{fill:var(--anatomy-lit);opacity:.28;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-meter{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-cell-on{fill:var(--anatomy-mid);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-gluew .iso-top,.fp-gluew .iso-fill,.fp-gluew .iso-shade{fill:var(--fp-glue)}
[data-cue][data-on] .fp-card,[data-cue][data-on] .fp-bx,[data-cue][data-on] .fp-rv,[data-cue][data-on] .fp-meter,[data-cue][data-on] .fp-cell-on,[data-cue][data-on] .fp-tool{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-fill,[data-cue][data-on] .fp-cell-on,[data-cue][data-on] .fp-band{fill:var(--fp-accent);opacity:.6}
[data-cue][data-on] .fp-sig,[data-cue][data-on] .fp-sig2,[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-hatch{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-glue{fill:var(--fp-accent)}
[data-cue][data-on] .fp-gluel{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-gluew .iso-top,[data-cue][data-on] .fp-gluew .iso-fill,[data-cue][data-on] .fp-gluew .iso-shade{fill:var(--fp-accent)}
`;

const label = {
  nl: 'De hoek van een batterijbak op een werkbank: een aluminium profiel met een flens, gelijmd en met een rij zelfponsende klinknagels gezet op een stalen dwarsligger, met een lijmrobot en een klinkkop erboven; daarover kaarten met lijmfamilies, afschuiving en afpellen, een zelfponsende klinknagel en een clinchpunt in doorsnede, voorbehandeling, een statische menger, de open tijd, een breukvlak, een blindklinknagel, een kracht-wegcurve, een galvanische cel en de kosten van klinknagels en vloeiboorschroeven.',
  en: 'The corner of a battery tray on a workbench: an aluminium extrusion with a flange, bonded and set with a row of self-piercing rivets onto a steel crossmember, with a dispensing robot and a riveting head above; over it cards with adhesive families, shear and peel, a self-piercing rivet and a clinch joint in section, surface preparation, a static mixer, the open time, a fracture surface, a blind rivet, a force-displacement curve, a galvanic cell and the cost of rivets and flow drill screws.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

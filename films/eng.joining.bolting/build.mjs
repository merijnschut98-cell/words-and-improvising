// Dev tool, not shipped. Builds the explainer film "Een bout aandraaien /
// Tightening a bolt" for the topic Boutverbindingen of Lassen en verbinden
// (bolts L1, bolting L2, tightening L3, jointdesign L4).
//
//   node films/eng.joining.bolting/build.mjs            build the page
//   node films/eng.joining.bolting/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.bolting.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3. The
// figure eng.joining.bolt (a flange joint on a test bench) is the visual
// starting point: the same hex bolt, washer and nut, here as a cutaway of one
// joint through two plates, so the bolt can be seen inside them.
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
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// bolts: ISO 898-1 property class a.b → tensile a × 100 MPa, yield 0.b × that
const CLASS = { '8.8': { rm: 800, re: 640 }, '10.9': { rm: 1000, re: 900 } };
for (const [c, v] of Object.entries(CLASS)) {
  const [a, b] = c.split('.').map(Number);
  assert(a * 100 === v.rm && near((b / 10) * v.rm, v.re, 1e-9), `class ${c} reads ${v.rm} / ${v.re}`);
}
const AS = { M10: 58, M12: 84.3 }; // stress areas, mm² (lesson table values)
const yield12 = (c) => (CLASS[c].re * AS.M12) / 1000; // kN
assert(near(yield12('8.8'), 54, 0.5) && near(yield12('10.9'), 76, 0.5), 'M12 yields at 54 and 76 kN');
assert(near(54 / 76, 0.71, 0.005), '54 / 76 = 71 %');
assert(near((CLASS['8.8'].re * AS.M10) / 1000, 37, 0.5), 'M10 8.8 yields near 37 kN');
// pitch: M10 × 1,5, a quarter turn moves the nut 0,375 mm
const PITCH = 1.5;
assert(near(PITCH / 4, 0.375, 1e-9), 'quarter turn = 0,375 mm');
// bolting: torque = force × arm; the short-form torque equation T = K · F · d
assert(near(200 * 0.25, 50, 1e-9), '200 N × 0,25 m = 50 Nm');
const K = 49 / (25000 * 0.010); // the nut factor the lesson's 49 Nm → 25 kN implies
assert(K > 0.18 && K < 0.22, `nut factor near 0,2 for steel, as delivered: ${K}`);
const SHARE = { head: 50, thread: 40, stretch: 10 };
assert(SHARE.head + SHARE.thread + SHARE.stretch === 100, 'the torque shares add up');
const AUDIT = { set: 50, tol: 0.1, read: [53, 52, 31, 54, 52] };
const outOf = AUDIT.read.filter((v) => v < AUDIT.set * (1 - AUDIT.tol) || v > AUDIT.set * (1 + AUDIT.tol) + 3);
assert(outOf.length === 1 && outOf[0] === 31, 'only 31 Nm falls out (breakaway reads at or a little above the set torque)');
// tightening: the flange, minimum 30 kN, at most 50 kN
const FL = { min: 30, max: 50, est: 1.8, meas: 1.4 };
assert(near(FL.est * FL.min, 54, 1e-9) && FL.est * FL.min > FL.max, '1,8 × 30 = 54 kN, over 50');
assert(near(FL.meas * FL.min, 42, 1e-9) && FL.meas * FL.min < FL.max, '1,4 × 30 = 42 kN, under 50');
assert(near((FL.meas - 1) / (FL.meas + 1), 0.17, 0.005), 'αA 1,4 is ±17 %');
// jointdesign: the engine mount, M10 8.8
const JD = { fv: 25, scatter: 0.25, fa: 10, phi: 0.2, as: AS.M10, allow: 50 };
JD.fmin = JD.fv * (1 - JD.scatter);
JD.extra = JD.phi * JD.fa;
JD.loss = (1 - JD.phi) * JD.fa;
JD.resid = JD.fmin - JD.loss;
JD.ampKN = JD.extra / 2;
JD.ampMPa = (JD.ampKN * 1000) / JD.as;
assert(near(JD.fmin, 18.75, 1e-9), '25 kN − 25 % = 18,75 kN');
assert(near(JD.extra, 2, 1e-9) && near(JD.loss, 8, 1e-9), '2 kN into the bolt, 8 kN off the clamp');
assert(near(JD.resid, 10.75, 1e-9), 'residual clamp load 10,75 kN');
assert(near(JD.ampKN, 1, 1e-9) && near(JD.ampMPa, 17, 0.5) && JD.ampMPa < JD.allow, '1 kN / 58 mm² = 17 MPa < 50');

// ---------------------------------------------------------------- the world (mm)
// x along the plates, y toward the viewer, z up; the bench top is z = 0. One
// M12 bolt through two 20 mm plates that rest on two risers; the front halves
// of the plates are cut away at y = 0 (the section face, hatched), so the bolt
// stands in its hole in plain view. Head on top, the nut under the plates.
const W = 640;
const H = 400;
const B = {
  r: 6, rHole: 6.6, head: 10.4, hH: 7.5, wash: 12, wT: 2.5, nut: 10.4, nH: 10.8,
  zP0: 46, zP1: 66, zP2: 86, // the plates: lower 46–66, upper 66–86
};
B.zW1 = B.zP2 + B.wT; // head washer top
B.zHead = B.zW1 + B.hH; // head top
B.zW0 = B.zP0 - B.wT; // nut washer bottom
B.zNut0 = B.zW0 - B.nH; // nut bottom
B.zEnd = B.zNut0 - 6.5; // the bolt's end
B.zThread = 60; // thread from the end up to here
B.grip = B.zW1 - B.zW0; // clamp length: plates plus washers, head face to nut face, 45
assert(near(B.grip, 45, 1e-9), 'clamp length 45 mm');
const PL = { x0: -120, x1: 120, y0: -34 };
const RISERS = [{ x: -118, y: -34, w: 40, d: 34 }, { x: 78, y: -34, w: 40, d: 34 }]; // cut at y = 0 with the plates
const TB = { x: -160, y: -96, w: 320, d: 196, r: 3 };
const BOTTLE = [-128, -66];
const WRENCH = { y: 64, x0: 4, x1: 146, z: 0 };
const RUN = { up: 70 }; // the nutrunner hangs this far above its working spot
const C = { W, H, B, PL, RUN, AUDIT, SHARE, FL, JD, CLASS, AS, K };

const FIT = [...k.boxCorners({ x: TB.x, y: TB.y, w: TB.w, d: TB.d }, -30, 0), [0, 0, B.zHead + 70], [0, 0, 150]];
const P = k.fitProjection(FIT, W, H, { pad: 12, azimuth: 52, elevation: 28 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0, ...plan }, z0, z1 - z0, P, plan.w > 60 ? 4 : 2, plan.w > 60 ? bevel : 0), style);
const cyl = (cx, cy, r, z0, z1, style = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, r > 8 ? 36 : 18, 0), style);
const LO = { steps: 28 };
const vert = (x, y, z) => G.frameOf([x, y, z], Z, X, Y);
const solidOf = (pr, F, o = {}) => G.solidOf(pr, F, P, { ...LO, ...o });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;

// ---------------------------------------------------------------- the bench and the risers
const table = (() => {
  const holes = [];
  for (let x = -140; x <= 140; x += 28) for (let y = -80; y <= 84; y += 28) holes.push(at([x, y, 0]));
  return [
    box({ x: TB.x + 14, y: TB.y + 14, w: TB.w - 28, d: TB.d - 28, r: 2 }, -30, -14, { tone: 'lo' }),
    box(TB, -14, 0, {}, 0.8),
    L(k.sideSeam(TB, -5, P, 4), { tone: 'faint' }),
    k.dotsSvg(holes, { size: 1.1, tone: 'lo' }),
  ].join('');
})();
// the hatch of a cut face in the plane y = 0, over x0..x1 and z0..z1
function hatchY0(x0, x1, z0, z1, skip = null) {
  const out = [];
  for (let c = x0 - (z1 - z0); c < x1; c += 7) {
    const seg = (xa, xb) => {
      const a = Math.max(xa, c);
      const b = Math.min(xb, c + (z1 - z0));
      if (b - a > 0.5) out.push(k.pathOf([[a, 0, z0 + (a - c)], [b, 0, z0 + (b - c)]].map(at)));
    };
    if (skip) { seg(x0 + 0.6, skip[0]); seg(skip[1], x1 - 0.6); } else seg(x0 + 0.6, x1 - 0.6);
  }
  return L(out.join(''), { tone: 'faint' });
}
const risers = RISERS.map((R) => {
  const screws = k.corners({ ...R, d: R.d * 2 }, 6).filter(([, y]) => y < 0).map(([x, y]) => at([x, y, B.zP0]));
  return [
    box({ ...R, x: R.x - 4, y: R.y - 4, w: R.w + 8, d: R.d + 4, r: 0 }, 0, 4, { tone: 'lo' }, 0.3),
    box({ ...R, r: 0 }, 4, B.zP0, {}, 0.5),
    hatchY0(R.x, R.x + R.w, 4, B.zP0),
    k.dotsSvg(screws, { size: 0.5 }),
  ].join('');
}).join('');

// ---------------------------------------------------------------- the plates: back halves, a half hole at x = 0, the cut face hatched
function plate(z0, z1) {
  const hole = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI - (i * Math.PI) / 12; hole.push([B.rHole * Math.cos(a), -B.rHole * Math.sin(a)]); }
  // x1,0 → along the hole from +r to −r (through −y) → x0,0
  const ringOk = [[PL.x0, PL.y0], [PL.x1, PL.y0], [PL.x1, 0], ...hole.slice().reverse(), [PL.x0, 0]];
  const body = S(k.extrude(ringOk, z0, z1 - z0, P, { convex: false }), {});
  // the cut face y = 0: hatch at 45° in (x, z), clipped to the face, skipping the hole
  return body + hatchY0(PL.x0, PL.x1, z0, z1, [-B.rHole - 0.4, B.rHole + 0.4]);
}

// ---------------------------------------------------------------- the bolt, washers and nut
// in two pieces: below the plates (drawn before the nut, which hides it) and
// through and above them (drawn after the plates, before the head)
const threadArcsIn = (z0, z1) => {
  const F = vert(0, 0, 0);
  const out = [];
  for (let z = B.zEnd + 2; z < B.zThread; z += 1.75) if (z > z0 + 0.6 && z < z1 - 0.6) out.push(G.arcOf(F, z, B.r, P));
  return out.join('');
};
const boltLo = S(solidOf([[0, B.r - 1.2], [1.2, B.r], [B.zP0 - B.zEnd, B.r]], vert(0, 0, B.zEnd)), { tone: 'hi', crease: 'lo', inner: L(threadArcsIn(B.zEnd, B.zP0), { tone: 'lo' }) });
const boltHi = S(solidOf([[0, B.r], [B.zW1 - B.zP0, B.r]], vert(0, 0, B.zP0)), { tone: 'hi', crease: 'lo', inner: L(threadArcsIn(B.zP0, B.zW1), { tone: 'lo' }) });
const washer = (z0) => S(G.ringBand(z0, z0 + B.wT, B.rHole, B.wash, vert(0, 0, 0), P, LO), { tone: 'mid', crease: 'lo' });

// ---------------------------------------------------------------- the nutrunner (built at its working spot: socket over the head; moved up RUN.up at rest)
const runner = (() => {
  const F = vert(0, 0, B.zW1 - 1);
  const socket = S(solidOf([[0, 13], [16, 13], [17, 12], [20, 8], [30, 8]], F), { tone: 'mid', crease: 'lo', inner: L(G.arcOf(F, 6, 13, P), { tone: 'faint' }) });
  const ext = S(solidOf([[30, 6], [44, 6]], F), { tone: 'hi', crease: 'lo' });
  const nose = S(solidOf([[44, 12], [52, 15], [58, 17]], F), { tone: 'mid', crease: 'lo' });
  const body = S(solidOf([[58, 18], [120, 18], [124, 16]], F), { tone: 'hi', crease: 'lo', inner: k.fadedSvg(G.ribsOf(F, 70, 110, 18, 14, P, { fade: [0.05, 0.42], seams: true }), { tone: 'lo' }) });
  const cap = S(solidOf([[124, 14], [134, 14], [136, 9], [150, 6]], F), { tone: 'mid', crease: 'lo' });
  const ring = L(G.arcOf(F, 64, 18, P) + G.arcOf(F, 116, 18, P), { tone: 'lo' });
  // a reaction arm out to the side, and a status lamp
  const arm = box({ x: 14, y: -6, w: 46, d: 12, r: 2 }, B.zW1 + 66, B.zW1 + 76, { tone: 'mid', crease: 'lo' }, 0.4);
  const lamp = k.dotsSvg([at([0, 18.5, B.zW1 + 100])], { size: 1.6, tone: 'hi' });
  return `<g data-cue="runner">${arm}${socket}${ext}${nose}${body}${ring}${cap}${lamp}</g>`;
})();

// ---------------------------------------------------------------- the threadlocker bottle, and a click torque wrench on the bench
const bottle = (() => {
  const F = vert(BOTTLE[0], BOTTLE[1], 0);
  return `<g data-cue="lockb">${S(solidOf([[0, 9], [26, 9], [28, 7], [32, 4], [34, 4]], F), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(F, 6, 9, P) + G.arcOf(F, 20, 9, P), { tone: 'faint' }) })}${S(solidOf([[34, 3.4], [44, 3.4], [50, 1.2]], F), { tone: 'mid', crease: 'lo' })}</g>`;
})();
const wrench = (() => {
  const { y, x0, x1 } = WRENCH;
  const F = G.frameOf([x0, y, 5], X, Y, Z);
  const tube = S(solidOf([[12, 4.5], [x1 - x0 - 40, 4.5]], F), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(F, 60, 4.5, P), { tone: 'lo' }) });
  const grip = S(solidOf([[x1 - x0 - 40, 6], [x1 - x0 - 2, 6], [x1 - x0, 4.5]], F), { tone: 'lo', crease: 'lo', inner: k.fadedSvg(G.ribsOf(F, x1 - x0 - 36, x1 - x0 - 6, 6, 18, P, { fade: [0.05, 0.42], seams: true }), { tone: 'faint' }) });
  const headW = S(G.disc(0, 9, 10, vert(x0, y, 0.5), P, LO), { tone: 'mid', crease: 'lo' });
  const sq = box({ x: x0 - 3, y: y - 3, w: 6, d: 6 }, 9.5, 14, { tone: 'hi', crease: 'lo' }, 0.2);
  const scale = [];
  for (let s = 0; s < 6; s++) scale.push(k.pathOf([[x0 + 50 + s * 6, y + 4.4, 7.6], [x0 + 50 + s * 6, y + 4.4, 9.4]].map(at)));
  return `<g data-cue="wrench">${headW}${sq}${tube}${L(scale.join(''), { tone: 'lo' })}${grip}</g>`;
})();

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('table', table),
  g('bottle', bottle),
  g('risers', risers),
  g('boltLo', boltLo, ' data-cue="bolt"'),
  g('nutW', washer(B.zW0), ' data-cue="washer"'),
  g('nut', '', ' data-cue="nut"'), // drawn per frame: it turns
  g('paint', '', ' data-cue="paint"'),
  g('platesL', plate(B.zP0, B.zP1), ' data-cue="plates"'),
  g('platesU', plate(B.zP1, B.zP2), ' data-cue="plates"'),
  g('boltHi', boltHi, ' data-cue="bolt"'),
  g('headW', washer(B.zP2), ' data-cue="washer"'),
  g('head', '', ' data-cue="head"'), // drawn per frame: it turns under the nutrunner
  g('wrench', wrench),
  g('runner', runner),
].join('');
const cueSlot = (cue, key) => `<g data-cue="${cue}">${g(key, '')}</g>`;
const hud = [
  g('scrim', `<rect class="fp-scrim" x="0" y="0" width="${W}" height="${H}"/>`),
  g('sect', [g('sBase', ''), cueSlot('mplates', 'sPlates'), cueSlot('mbolt', 'sBolt'), cueSlot('stress', 'sStress'), cueSlot('lock', 'sLock'), cueSlot('clamp', 'sClamp'), cueSlot('settle', 'sSettle'), cueSlot('elong', 'sElong'), cueSlot('grip', 'sGrip'), g('sText', '')].join('')),
  g('headC', [cueSlot('klasse', 'hcHead'), cueSlot('yield', 'hcBars'), g('hcText', '')].join('')),
  g('pitchC', cueSlot('pitch', 'pitchBody')),
  g('capC', cueSlot('cap', 'capBody')),
  g('torqueC', cueSlot('torque', 'torqueBody')),
  g('pieC', cueSlot('pie', 'pieBody')),
  g('scatterC', cueSlot('scatter', 'scatterBody')),
  g('angleC', [g('angleBase', ''), cueSlot('angle', 'angleCurve'), cueSlot('yieldc', 'angleYield')].join('')),
  g('auditC', cueSlot('audit', 'auditBody')),
  g('vdiC', cueSlot('vdi', 'vdiBody')),
  g('factorC', [cueSlot('factor', 'factorBody'), cueSlot('mu', 'muBody')].join('')),
  g('bandC', cueSlot('band', 'bandBody')),
  g('diagC', [g('diagBase', ''), cueSlot('diagram', 'diagLines'), cueSlot('phi', 'diagPhi'), cueSlot('resid', 'diagResid'), cueSlot('amp', 'diagAmp')].join('')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat key
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WIDE = cam([0, -10, 40], 600);
const JOINT = cam([0, 0, 58], 330);
const NUT = cam([0, 0, B.zNut0 + 6], 190);
const RUNC = cam([0, 0, B.zHead + 30], 380);
const HEADL = cam([0, 0, B.zHead], 220, [165, 210]);
const JOINTL = cam([0, 0, 58], 330, [165, 210]);
const NUTL = cam([0, 0, B.zNut0 + 6], 200, [150, 210]);
const WRENCHR = cam([75, WRENCH.y, 6], 300, [480, 220]);
C.KEYS = [
  [JOINT, WIDE, WIDE], // s1: the joint, then the section card
  [WIDE, HEADL, HEADL, HEADL], // s2: the head on the left, its card on the right
  [WIDE, WIDE, NUT], // s3
  [RUNC, RUNC, JOINTL], // s4
  [WIDE, WIDE], // s5
  [NUTL, WRENCHR, NUT, WIDE], // s6
  [WIDE, WIDE, WIDE, WIDE], // s7
  [WIDE, WIDE, WIDE], // s8
  [WIDE, WIDE, WIDE, WIDE, WIDE], // s9
];

// ---------------------------------------------------------------- the film
const BO = 'eng.joining.bolts';
const BG = 'eng.joining.bolting';
const TI = 'eng.joining.tightening';
const JDL = 'eng.joining.jointdesign';
const spec = {
  id: 'eng.joining.bolting',
  title: { nl: 'Een bout aandraaien', en: 'Tightening a bolt' },
  lessons: [BO, BG, TI, JDL],
  scenes: [
    {
      // v14b: the Basis "how it works" opening
      id: 's1', lesson: BO, level: 1, still: 0.5, title: { nl: 'Hoe een bout klemt', en: 'How a bolt clamps' },
      beats: [
        { nl: 'Een boutverbinding: een bout met kop en draad, twee sluitringen, twee platen en een moer.', en: 'A bolted joint: a bolt with head and thread, two washers, two plates and a nut.', cues: ['bolt', 'washer', 'plates', 'nut'] },
        { nl: 'Draai je de moer aan, dan rekt de bout een fractie van een millimeter, als een stijve veer.', en: 'Tighten the nut and the bolt stretches a fraction of a millimetre, like a stiff spring.', cues: ['mbolt'] },
        { nl: 'Die klemkracht is de {t:Voorspanning|voorspanning}. Zij houdt de verbinding dicht, niet het moment.', en: 'That clamping force is the {t:Preload|preload}. It holds the joint shut, not the torque.', cue: { Voorspanning: 'clamp' }, cues: ['mplates'] },
      ],
    },
    {
      id: 's2', lesson: BO, level: 1, still: 0.5, title: { nl: 'Wat er op de bout staat', en: 'What the bolt tells you' },
      beats: [
        { nl: 'M10 × {n:1.5}: draad van {n:10} mm, met een {t:Spoed|spoed} van {n:1.5} mm tussen twee draadtoppen.', en: 'M10 × {n:1.5}: a {n:10} mm thread, with a {t:Pitch|pitch} of {n:1.5} mm between two crests.', cue: { Spoed: 'pitch' } },
        { nl: 'Op de kop staat de {t:Sterkteklasse|sterkteklasse}: 8.8 is {n:800} MPa treksterkte, daar breekt hij.', en: 'The head shows the {t:Property class|property class}: 8.8 means {n:800} MPa tensile strength, where it breaks.', cue: { Sterkteklasse: 'klasse' }, cues: ['head'] },
        { nl: 'De {t:Vloeigrens|vloeigrens} is {n:0.8} × {n:800} = {n:640} MPa: daarboven rekt hij blijvend.', en: 'The {t:Yield strength|yield strength} is {n:0.8} × {n:800} = {n:640} MPa: above it, it stretches for good.', cue: { Vloeigrens: 'yield' } },
        { nl: 'Bij 10.9 is dat {n:1000} en {n:900} MPa. Ook de moer heeft een klasse, die moet passen.', en: 'For 10.9 it is {n:1000} and {n:900} MPa. The nut has a class too, which must match.', cues: ['klasse', 'yield'] },
      ],
    },
    {
      id: 's3', lesson: BO, level: 1, still: 0.5, title: { nl: 'Waar hij breekt, en borgen', en: 'Where it fails, and locking' },
      beats: [
        { nl: 'Een bout breekt in de draad; daar telt de {t:Spanningsdoorsnede|spanningsdoorsnede}: M12 heeft {n:84.3} mm².', en: 'A bolt fails in the thread, so the {t:Stress area|stress area} counts: M12 has {n:84.3} mm².', cue: { Spanningsdoorsnede: 'stress' } },
        { nl: 'Een M12 in 8.8 vloeit bij zo’n {n:54} kN, in 10.9 pas bij {n:76} kN: 8.8 haalt {n:71}%.', en: 'An M12 in 8.8 yields at about {n:54} kN, in 10.9 only at {n:76} kN: 8.8 reaches {n:71}%.', cues: ['cap'], read: { nl: '{n:640} × {n:84.3} ≈ {n:54} kN · {n:900} × {n:84.3} ≈ {n:76} kN', en: '{n:640} × {n:84.3} ≈ {n:54} kN · {n:900} × {n:84.3} ≈ {n:76} kN' } },
        { nl: 'Tegen loslopen: genoeg voorspanning, en {t:Schroefdraadborging|schroefdraadborging}, lijm die in de draad uithardt.', en: 'Against working loose: enough preload, and {t:Thread locking|thread locking}, an adhesive that cures in the thread.', cue: { Schroefdraadborging: 'lock' }, cues: ['lockb'] },
      ],
    },
    {
      id: 's4', lesson: BG, level: 2, still: 0.5, title: { nl: 'Aandraaien', en: 'Tightening' },
      beats: [
        { nl: 'Een {t:Schroefspindel|schroefspindel} draait de bout aan, en regelt en logt moment en hoek per bout.', en: 'A {t:Nutrunner|nutrunner} tightens the bolt, and controls and logs torque and angle per bolt.', cue: { Schroefspindel: 'runner' } },
        { nl: 'Het {t:Aanhaalmoment|aanhaalmoment} is kracht × arm: {n:200} N op {n:25} cm is {n:50} Nm.', en: '{t:Torque|Torque} is force × arm: {n:200} N on {n:25} cm is {n:50} Nm.', cue: { Aanhaalmoment: 'torque' } },
        { nl: 'Zo’n {n:49} Nm geeft een M10 in 8.8 ongeveer {n:25} kN voorspanning; rond {n:37} kN vloeit hij.', en: 'About {n:49} Nm gives an M10 in 8.8 roughly {n:25} kN of preload; it yields near {n:37} kN.', cues: ['mbolt', 'clamp'] },
      ],
    },
    {
      id: 's5', lesson: BG, level: 2, still: 0.5, title: { nl: 'Waar het moment heen gaat', en: 'Where the torque goes' },
      beats: [
        { nl: 'Van het moment gaat zo’n {n:50}% naar wrijving onder de kop, {n:40}% in de draad, en {n:10}% rekt de bout.', en: 'Of the torque, about {n:50}% goes into friction under the head, {n:40}% in the thread, {n:10}% stretches the bolt.', cues: ['pie'] },
        { nl: 'Olie, coating, vuil of roest: hetzelfde moment geeft {n:25} tot {n:30}% meer of minder voorspanning.', en: 'Oil, coating, dirt or rust: the same torque gives {n:25} to {n:30}% more or less preload.', cues: ['scatter'] },
      ],
    },
    {
      id: 's6', lesson: BG, level: 2, still: 0.5, title: { nl: 'Hoek, audit en zetting', en: 'Angle, audit and settling' },
      beats: [
        { nl: '{t:Moment-hoek|Moment-hoek}: eerst een laag moment dat de delen tegen elkaar trekt, dan een vaste hoek verder.', en: '{t:Torque-angle|Torque-angle}: first a low torque that pulls the parts together, then a fixed extra angle.', cue: { 'Moment-hoek': 'angle' }, cues: ['nut'] },
        { nl: 'Het {t:Losbreekmoment|losbreekmoment} bij de audit: {n:53}, {n:52}, {n:31}, {n:54} en {n:52} Nm, op {n:50} Nm ±{n:10}%.', en: '{t:Breakaway torque|Breakaway torque} at the audit: {n:53}, {n:52}, {n:31}, {n:54} and {n:52} Nm, on {n:50} Nm ±{n:10}%.', cue: { Losbreekmoment: 'audit' }, cues: ['wrench'] },
        { nl: 'Een bout twee keer gedraaid, de vierde op gevoel. Een verfstreep laat zien of een bout nog draaide.', en: 'One bolt run twice, the fourth done by feel. A paint mark shows whether a bolt has turned.', cues: ['paint'] },
        { nl: '{t:Zetting|Zetting}: ruwe vlakken of verf onder de kop worden platgedrukt, en voorspanning verdwijnt.', en: '{t:Settling|Settling}: rough surfaces or paint under the head flatten, and preload is lost.', cue: { Zetting: 'settle' } },
      ],
    },
    {
      id: 's7', lesson: TI, level: 3, still: 0.5, title: { nl: 'Spreiding en aanhaalfactor', en: 'Scatter and tightening factor' },
      beats: [
        { nl: '{t:VDI 2230|VDI 2230} is de Duitse richtlijn om een boutverbinding stap voor stap te berekenen.', en: '{t:VDI 2230|VDI 2230} is the German guideline for calculating a bolted joint step by step.', cue: { 'VDI 2230': 'vdi' } },
        { nl: '{t:Aanhaalfactor|Aanhaalfactor}: hoogste gedeeld door laagste voorspanning; op moment {n:1.4} tot {n:1.6}.', en: '{t:Tightening factor|Tightening factor}: highest divided by lowest preload; on torque {n:1.4} to {n:1.6}.', cue: { Aanhaalfactor: 'factor' } },
        { nl: 'De {t:Wrijvingscoëfficiënt|wrijvingscoëfficiënt} µ telt het meest. Alleen geschat: {n:1.6} tot {n:2.0}.', en: 'The {t:Coefficient of friction|coefficient of friction} µ matters most. Only estimated: {n:1.6} to {n:2.0}.', cue: { Wrijvingscoëfficiënt: 'mu' }, cues: ['factor'] },
        { nl: 'Flens, minstens {n:30} kN: × {n:1.8} = {n:54} kN, boven de {n:50}. Met gemeten µ: × {n:1.4} = {n:42} kN.', en: 'A flange, at least {n:30} kN: × {n:1.8} = {n:54} kN, over {n:50}. With measured µ: × {n:1.4} = {n:42} kN.', cues: ['band'] },
      ],
    },
    {
      id: 's8', lesson: TI, level: 3, still: 0.5, title: { nl: 'Nauwkeuriger aandraaien', en: 'Tightening more precisely' },
      beats: [
        { nl: 'Moment-hoek tot voorbij de vloeigrens: {n:1.2} tot {n:1.4}, maar die bout gebruik je meestal niet opnieuw.', en: 'Torque-angle past the yield point: {n:1.2} to {n:1.4}, but that bolt is usually not reused.', cues: ['angle'] },
        { nl: '{t:Vloeigrensgestuurd aandraaien|Vloeigrensgestuurd aandraaien}: de spindel stopt zodra de curve afbuigt.', en: '{t:Yield-controlled tightening|Yield-controlled tightening}: the nutrunner stops as soon as the curve bends over.', cue: { 'Vloeigrensgestuurd aandraaien': 'yieldc' } },
        { nl: 'De {t:Boutrek|boutrek} ultrasoon meten is het nauwkeurigst, maar duur en traag.', en: 'Measuring {t:Bolt elongation|bolt elongation} with ultrasound is the most accurate, but costly and slow.', cue: { Boutrek: 'elong' } },
      ],
    },
    {
      id: 's9', lesson: JDL, level: 4, still: 0.5, title: { nl: 'Twee veren', en: 'Two springs' },
      beats: [
        { nl: 'De {t:Verspanningsdriehoek|verspanningsdriehoek}: de bout rekt als een slappe veer, de platen veren stijf.', en: 'The {t:Joint diagram|joint diagram}: the bolt stretches like a soft spring, the plates push back stiffly.', cue: { Verspanningsdriehoek: 'diagram' } },
        { nl: '{t:Krachtfactor|Krachtfactor} Φ = {n:0.2}: van {n:10} kN trekkracht komt maar {n:2} kN extra in de bout.', en: '{t:Load factor|Load factor} Φ = {n:0.2}: of a {n:10} kN pull, only {n:2} kN goes into the bolt.', cue: { Krachtfactor: 'phi' } },
        { nl: 'De andere {n:8} kN haalt klemkracht weg: {n:18.75} − {n:8} = {n:10.75} kN {t:Restklemkracht|restklemkracht}.', en: 'The other {n:8} kN takes clamp load away: {n:18.75} − {n:8} = {n:10.75} kN {t:Residual clamp load|residual clamp load}.', cue: { Restklemkracht: 'resid' } },
        { nl: '{t:Spanningsamplitude|Spanningsamplitude}: {n:1} kN / {n:58} mm² = {n:17} MPa, ruim onder de {n:50} MPa.', en: '{t:Stress amplitude|Stress amplitude}: {n:1} kN / {n:58} mm² = {n:17} MPa, well below {n:50} MPa.', cue: { Spanningsamplitude: 'amp' } },
        { nl: 'Een grote {t:Klemlengte|klemlengte} maakt de bout slank: lagere Φ, minder amplitude, minder zetting.', en: 'A long {t:Clamp length|clamp length} makes the bolt slim: lower Φ, less amplitude, less settling.', cue: { Klemlengte: 'grip' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said
// (newtonmeter, kilonewton, megapascal); a property class as said ("acht punt
// acht"); a number the voice would misread ("1.000") in words.
const SAY = [
  [ // s1 how a bolt clamps
    { nl: 'Dit is een boutverbinding, opengezaagd. De bout gaat door twee stalen platen. Sluitringen onder de kop en de moer spreiden de druk en sparen het vlak.',
      en: 'This is a bolted joint, cut open. The bolt passes through two steel plates. Washers under the head and the nut spread the pressure and protect the surface.' },
    { nl: 'Draai je de moer aan, dan rekt de bout een fractie van een millimeter. Als een stijve veer wil hij terug: zo knijpt hij de platen op elkaar.',
      en: 'Tighten the nut, and the bolt stretches by a fraction of a millimetre. Like a stiff spring it wants its length back, and so it squeezes the plates together.' },
    { nl: 'Die klemkracht heet de {t:Voorspanning|voorspanning}. Zij houdt de verbinding bij elkaar, niet het moment op de sleutel. Is ze groot genoeg, dan schuift er niets en blijft de moer zitten.',
      en: 'That clamping force is the {t:Preload|preload}. It holds the joint together, not the torque on the wrench. When it is high enough, nothing slips and the nut does not work loose.' },
  ],
  [ // s2 what the bolt tells you
    { nl: 'M10 maal {n:1.5} is een draad van {n:10} millimeter dik, met een {t:Spoed|spoed} van {n:1.5} millimeter. Zoveel schuift de moer op per omwenteling.',
      en: 'M10 by {n:1.5} is a thread {n:10} millimetres across, with a {t:Pitch|pitch} of {n:1.5} millimetres. That is how far the nut moves in one turn.' },
    { nl: 'Op de kop staat de {t:Sterkteklasse|sterkteklasse}, volgens ISO 898, deel 1. Bij acht punt acht is acht maal honderd de treksterkte: {n:800} megapascal. Daar breekt hij.',
      en: 'The head shows the {t:Property class|property class}, to ISO 898, part 1. For eight point eight, eight times a hundred is the tensile strength: {n:800} megapascals. That is where it breaks.' },
    { nl: 'Punt acht geeft de {t:Vloeigrens|vloeigrens}: tachtig procent, {n:640} megapascal. Daarboven rekt de bout blijvend uit.',
      en: 'Point eight gives the {t:Yield strength|yield strength}: eighty percent of that, {n:640} megapascals. Above it the bolt stretches for good.' },
    { nl: 'Bij tien punt negen is dat duizend en {n:900}. Tien punt negen mag dus veel strakker. Ook de moer heeft een klasse.',
      en: 'For ten point nine it is a thousand and {n:900}. So ten point nine can be tightened much harder. The nut has a class too.' },
  ],
  [ // s3 where it fails, and locking
    { nl: 'Een bout breekt in de draad, waar minder staal zit. Daarom telt de {t:Spanningsdoorsnede|spanningsdoorsnede}: voor M12 {n:84.3} vierkante millimeter.',
      en: 'A bolt fails in the thread, where there is less steel. So engineers use the {t:Stress area|stress area}: for M12, {n:84.3} square millimetres.' },
    { nl: 'Kracht is spanning maal doorsnede. Een M12 in acht punt acht vloeit bij zo’n {n:54} kilonewton, in tien punt negen bij {n:76}. Verwissel ze, en de acht punt acht haalt maar {n:71} procent.',
      en: 'Force is stress times area. An M12 in eight point eight yields at about {n:54} kilonewtons, in ten point nine at {n:76}. Mix them up, and the eight point eight reaches only {n:71} percent.' },
    { nl: 'Tegen loslopen helpt vooral voorspanning, en daarbij {t:Schroefdraadborging|schroefdraadborging}: lijm die in de draad uithardt. Een veerring helpt niet. In een gat met draad moet hij in staal grofweg zijn eigen dikte diep grijpen.',
      en: 'Against working loose, preload helps most, and with it {t:Thread locking|thread locking}: an adhesive that cures in the thread. A spring washer does not help. And in a threaded hole the bolt must engage deeply: in steel, roughly its own diameter.' },
  ],
  [ // s4 tightening
    { nl: 'In de fabriek draait een {t:Schroefspindel|schroefspindel} de bout aan. Hij regelt het moment en de hoek, en legt ze per bout vast.',
      en: 'In the factory a {t:Nutrunner|nutrunner} tightens the bolt. It controls the torque and the angle, and records them for every bolt.' },
    { nl: 'Het {t:Aanhaalmoment|aanhaalmoment} is kracht maal arm. {n:200} newton op een sleutel van {n:25} centimeter is {n:50} newtonmeter.',
      en: '{t:Torque|Torque} is force times arm. {n:200} newtons on a wrench {n:25} centimetres long is {n:50} newton-metres.' },
    { nl: 'Zo’n {n:49} newtonmeter rekt een M10 in acht punt acht tot ongeveer {n:25} kilonewton voorspanning: {n:2.5} ton. Rond {n:37} kilonewton gaat hij vloeien.',
      en: 'About {n:49} newton-metres stretches an M10 in eight point eight to roughly {n:25} kilonewtons of preload: {n:2.5} tonnes. Near {n:37} kilonewtons it starts to yield.' },
  ],
  [ // s5 where the torque goes
    { nl: 'Maar het moment is een indirecte maat. De helft gaat op aan wrijving onder de kop, {n:40} procent in de draad, en maar {n:10} procent rekt de bout.',
      en: 'But torque is an indirect measure. Half goes into friction under the head, {n:40} percent into the thread, and only {n:10} percent stretches the bolt.' },
    { nl: 'Olie, coating, vuil of roest veranderen de wrijving: hetzelfde moment geeft {n:25} tot {n:30} procent meer of minder voorspanning. Een geoliede bout op een droog moment kan zelfs gaan vloeien.',
      en: 'Oil, coating, dirt or rust change the friction: the same torque then gives {n:25} to {n:30} percent more or less preload. An oiled bolt on a dry torque can even yield.' },
  ],
  [ // s6 angle, audit and settling
    { nl: 'Nauwkeuriger is {t:Moment-hoek|moment-hoek}: een laag moment trekt de delen tegen elkaar, dan draait de moer een vaste hoek verder. Die hoek is een maat voor de rek.',
      en: 'More accurate is {t:Torque-angle|torque-angle}: a low torque pulls the parts together, then the nut turns a fixed angle further. That angle is a measure of the stretch.' },
    { nl: 'Een audit meet het {t:Losbreekmoment|losbreekmoment}: waar een vaste bout verder draait. Ingesteld op {n:50} newtonmeter, plus of min {n:10} procent; gemeten {n:53}, {n:52}, {n:31}, {n:54} en {n:52}. Die {n:31} is fout.',
      en: 'An audit measures the {t:Breakaway torque|breakaway torque}: where a tightened bolt turns further. Set to {n:50} newton-metres, plus or minus {n:10} percent; measured {n:53}, {n:52}, {n:31}, {n:54} and {n:52}. That {n:31} is wrong.' },
    { nl: 'Eén bout was twee keer gedraaid, de vierde op gevoel. Positiebewaking laat elke bout één keer tellen. Een verfstreep toont of een bout nog draaide.',
      en: 'One bolt had been run twice, the fourth done by feel. Position control makes each bolt count once. A paint mark shows whether a bolt has turned.' },
    { nl: 'En {t:Zetting|zetting}: ruwe vlakken of verf onder de kop worden platgedrukt, en voorspanning verdwijnt. Een langere bout verliest dan minder.',
      en: 'And {t:Settling|settling}: rough surfaces or paint under the head flatten, and preload is lost. A longer bolt loses less.' },
  ],
  [ // s7 scatter and tightening factor
    { nl: '{t:VDI 2230|VDI 2230}, de Duitse richtlijn, rekent een boutverbinding stap voor stap door.',
      en: '{t:VDI 2230|VDI 2230}, the German guideline, works through a bolted joint step by step.' },
    { nl: 'Zij vangt de spreiding in de {t:Aanhaalfactor|aanhaalfactor}: hoogste gedeeld door laagste voorspanning. Op moment, met gemeten wrijving: {n:1.4} tot {n:1.6}.',
      en: 'It captures the scatter in the {t:Tightening factor|tightening factor}: highest divided by lowest preload. On torque, with measured friction: {n:1.4} to {n:1.6}.' },
    { nl: 'Want de {t:Wrijvingscoëfficiënt|wrijvingscoëfficiënt}, mu, telt het meest. Alleen geschat wordt het {n:1.6} tot {n:2.0}. Meet hem op de echte bouten, volgens ISO 16047.',
      en: 'Because the {t:Coefficient of friction|coefficient of friction}, mu, matters most. Only estimated, it becomes {n:1.6} to {n:2.0}. So measure it on the real bolts, to ISO 16047.' },
    { nl: 'Een flens vraagt minstens {n:30} kilonewton, en de bout mag hoogstens {n:50}. Geschat, maal {n:1.8}, wordt de hoogste {n:54}: te veel. Gemeten, maal {n:1.4}, is het {n:42}.',
      en: 'A flange needs at least {n:30} kilonewtons, and the bolt may take at most {n:50}. Estimated, times {n:1.8}, the highest becomes {n:54}: too much. Measured, times {n:1.4}, it is {n:42}.' },
  ],
  [ // s8 tightening more precisely
    { nl: 'Moment-hoek haalt {n:1.2} tot {n:1.4}, vaak tot voorbij de vloeigrens. Zo’n bout, zoals een cilinderkopbout, gebruik je meestal niet opnieuw.',
      en: 'Torque-angle reaches {n:1.2} to {n:1.4}, often past the yield point. Such a bolt, like a cylinder head bolt, is usually not reused.' },
    { nl: 'Bij {t:Vloeigrensgestuurd aandraaien|vloeigrensgestuurd aandraaien} meet de spindel moment en hoek, en stopt zodra de curve afbuigt.',
      en: 'In {t:Yield-controlled tightening|yield-controlled tightening} the nutrunner measures torque and angle, and stops as soon as the curve bends over.' },
    { nl: 'Het nauwkeurigst is de {t:Boutrek|boutrek} meten: ultrasoon geluid meet hoeveel langer de bout wordt. Duur en traag, dus voor kritische verbindingen.',
      en: 'The most accurate is to measure {t:Bolt elongation|bolt elongation}: ultrasound measures how much longer the bolt gets. Costly and slow, so for critical joints.' },
  ],
  [ // s9 two springs
    { nl: 'De {t:Verspanningsdriehoek|verspanningsdriehoek} tekent bout en platen als twee veren: steil voor de stijve platen, vlakker voor de bout.',
      en: 'The {t:Joint diagram|joint diagram} draws bolt and plates as two springs: steep for the stiff plates, flatter for the bolt.' },
    { nl: 'Trekt er van buiten {n:10} kilonewton aan, dan krijgt de bout maar een deel: de {t:Krachtfactor|krachtfactor}. Bij {n:0.2} is dat {n:2} kilonewton.',
      en: 'When {n:10} kilonewtons pull from outside, the bolt takes only a share: the {t:Load factor|load factor}. At {n:0.2} that is {n:2} kilonewtons.' },
    { nl: 'De andere {n:8} haalt klemkracht weg. Van {n:18.75} kilonewton blijft {n:10.75} over: de {t:Restklemkracht|restklemkracht}. Die moet boven nul blijven, anders krijgt de bout de volle wisselende kracht.',
      en: 'The other {n:8} take clamp load away. Of {n:18.75} kilonewtons, {n:10.75} remain: the {t:Residual clamp load|residual clamp load}. It must stay above zero, or the bolt takes the full alternating force.' },
    { nl: 'Bouten breken door vermoeiing, in de eerste draadgang onder de moer. Daar telt de {t:Spanningsamplitude|spanningsamplitude}: {n:1} kilonewton op {n:58} vierkante millimeter is {n:17} megapascal, onder de zo’n {n:50} die de draad verdraagt.',
      en: 'Bolts break by fatigue, in the first thread under the nut. What counts there is the {t:Stress amplitude|stress amplitude}: {n:1} kilonewton on {n:58} square millimetres is {n:17} megapascals, below the {n:50} or so the thread can take.' },
    { nl: 'Een sterkere klasse helpt daar nauwelijks. Een slanke bout met een grote {t:Klemlengte|klemlengte} wel: hij krijgt minder wisselende kracht, en verliest minder door zetting.',
      en: 'A stronger class hardly helps there. A slim bolt with a long {t:Clamp length|clamp length} does: it takes less of the alternating force, and loses less to settling.' },
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
:root{--fp-oil:#C9A24A}
.iso[data-theme="light"]{--fp-oil:#8A6A1E}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-cut{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-boltf{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-scrim{fill:var(--anatomy-card);opacity:.9}
.fp-card{fill:var(--anatomy-paper);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-rule{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-linecap:round}
.fp-bx{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-fill{fill:var(--anatomy-mid);opacity:.55}
.fp-band{fill:var(--anatomy-mid);opacity:.22}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:6 5;vector-effect:non-scaling-stroke}
.fp-grid{fill:none;stroke:var(--anatomy-faint);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-sig{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-sig2{fill:none;stroke:var(--anatomy-mid);stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-paintl{fill:none;stroke:var(--fp-oil);stroke-width:2.2;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-glue{fill:var(--fp-oil);stroke:none;opacity:.85}
.fp-cell-on{fill:var(--anatomy-mid);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-card,[data-cue][data-on] .fp-bx,[data-cue][data-on] .fp-boltf,[data-cue][data-on] .fp-cut,[data-cue][data-on] .fp-cell-on{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-fill,[data-cue][data-on] .fp-cell-on,[data-cue][data-on] .fp-band{fill:var(--fp-accent);opacity:.6}
[data-cue][data-on] .fp-sig,[data-cue][data-on] .fp-sig2,[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-rule,[data-cue][data-on] .fp-hatch{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-glue{fill:var(--fp-accent)}
[data-cue][data-on] .fp-paintl{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een boutverbinding in doorsnede op een werkbank: een zeskantbout door twee stalen platen op twee steunblokken, met sluitringen en een moer, een schroefspindel erboven, een momentsleutel en een flesje borgmiddel; daarover kaarten met de sterkteklasse, de spoed, het aanhaalmoment, waar het moment heen gaat, de spreiding in voorspanning, een audit van losbreekmomenten, de aanhaalfactor en de verspanningsdriehoek.',
  en: 'A bolted joint in section on a workbench: a hex bolt through two steel plates on two support blocks, with washers and a nut, a nutrunner above, a torque wrench and a bottle of threadlocker; over it cards with the property class, the pitch, the torque, where the torque goes, the scatter in preload, an audit of breakaway torques, the tightening factor and the joint diagram.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

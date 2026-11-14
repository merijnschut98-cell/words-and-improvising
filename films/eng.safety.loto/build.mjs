// Dev tool, not shipped. Builds the explainer film "Vergrendelen en labelen /
// Lockout-tagout" for the topic Scheiden, elektrisch werk en vergunningen of
// Veilig werken: its level 1 lesson eng.safety.loto.
//
//   node films/eng.safety.loto/build.mjs            build the page
//   node films/eng.safety.loto/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.safety.loto.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.safety). The plan row also names power.hydraulics; this film is not
// wired there (a film replaces a lesson's text, and this one does not teach
// force, flow or oil cleanliness), it only shows the accumulator of the loto
// example.
//
// One floor, left to right: a group lockbox on a stand, the control cabinet
// with its lockable main switch, an operator console (emergency stop, start,
// stop), an H-frame hydraulic press (bed, bolster, two uprights, crown, main
// cylinder, ram with the upper die, the lower die on guide pillars, a hinged
// mesh guard at the front), a safety block waiting on the floor, the air panel
// with a lockable ball valve and a filter-regulator, and the hydraulic power
// unit (tank, motor, pump, accumulator with its bleed valve and gauge). Three
// people: the fitter and two operators. Charts (the energy sources, the LOTO
// procedure sheet, the gauge, the proof, the restart and the five safety rules)
// sit in stage space over the drawing.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, allLessons } from '../_kit/build-film.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The lesson's order and worked example, asserted against its current text (the
// build fails if the lesson drifts); {n:...} numbers are then checked against
// the Dutch lesson text by defineFilm. Sources, as in the lesson: NEN-EN-ISO
// 14118 (prevention of unexpected start-up, all energy sources including stored
// energy); an emergency stop (EN ISO 13850) stops but does not isolate; hydraulic
// presses (ISO 16092-3) call for a mechanical restraint under a raised ram, since
// oil pressure alone can be lost through a leaking valve or seal (the clause text
// of ISO 16092-3 and ISO 14118 was not checked word for word, so the film stays
// with the lesson's wording); NEN 3140 and NEN-EN 50110 add the five safety
// rules for electrical work, worded as in eng.gridops.
// Restart (lesson: tools out, guards back, everyone clear, then the locks): the
// safety block counts as a tool, so it comes out before the guard closes. It
// stands under the ram with a small gap and carries nothing while the cylinder's
// valves hold the ram, so it can be pulled by hand; if the ram has come to rest on
// it, the press's own LOTO procedure says how it comes off (said, hedged, in s7).
// The start attempt is made with the guard closed: an open interlocked guard
// would block the start on its own, and the attempt would prove nothing.
const LOTO = 'eng.safety.loto';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const inOrder = (text, words) => words.every((w, i) => { const at = text.indexOf(w); return at >= 0 && (i === 0 || at > text.indexOf(words[i - 1])); });
{
  const nl = lessons.nl.get(LOTO);
  const en = lessons.en.get(LOTO);
  const teach = nl.teach.join('\n');
  // the strict order of the lesson: tell, stop normally, isolate, lock, release, verify
  assert(inOrder(nl.teach[2], ['laat de betrokkenen weten', 'stop de machine normaal', 'scheid elke bron', 'vergrendel', 'groepsslotkast', 'Ontlaad of blokkeer', 'Controleer daarna of alles energieloos is', 'Pas dan begin je']), 'the order of teach block 3');
  assert(inOrder(nl.teach[3], ['Alleen wie een slot heeft gehangen', 'gereedschap eruit, afschermingen terug, iedereen vrij', 'Nooit zomaar doorknippen', 'vijf veiligheidsregels']), 'restart and the five rules');
  // the press has four kinds of energy among the lesson's list
  for (const w of ['elektrisch', 'pneumatisch', 'hydraulisch', 'mechanisch']) assert(nl.teach[1].includes(w), `energy kind ${w}`);
  assert(teach.includes('NEN-EN-ISO 14118') && en.teach.join('\n').includes('EN ISO 14118'), 'the standard NEN-EN-ISO 14118');
  // the worked example: ram at the top, switch and air valve locked, block first, then the accumulator to 0 bar, start attempt, back to off
  const ex = nl.example.text;
  assert(inOrder(ex, ['matrijswissel op een hydraulische pers', 'laat het de operators weten', 'stoter', 'bovenin', 'hoofdschakelaar uit', 'persluchtkraan dicht', 'eigen slot en label', 'veiligheidsblok onder de opgeheven stoter', 'pas daarna', 'accumulator', '0 bar', 'startknop', 'gebeurt niks', 'terug op uit', 'gereedschap eruit, afschermingen dicht, iedereen vrij', 'eigen sloten eraf']), 'the worked example, in order');
  assert(inOrder(en.example.text, ['safety block', 'only then bleeds', 'accumulator', '0 bar', 'start button']), 'the English example, in order');
}
const POINTS = ['switch', 'valve']; // the two isolation points of the example
const STORED = ['accumulator', 'ram']; // the two stored energies of the example
assert(POINTS.length === 2 && STORED.length === 2, 'two isolation points, two stored energies');

// ---------------------------------------------------------------- the world
// x to the right along the floor, y toward the viewer, z up; the floor is z = 0.
// Units of about 1 cm: the press stands about 3 m tall.
const W = 640;
const H = 400;
const BED_Z = 44;
const BOL_Z = 50;
const UP_Z = 214;
const CROWN_Z = 250;
const RAM0 = 160; // the ram's underside, parked at the top
const RAM_H = 34;
const DIE_H = 16;
const LDIE_Z = BOL_Z + DIE_H; // top of the lower die
const STROKE = RAM0 - DIE_H - LDIE_Z; // the upper die down onto the lower die
const BLOCK = { x: -46, y: -6, w: 10, d: 12, r: 0.6 };
const BLOCK_TOP = RAM0 - 3; // a 3 cm gap under the ram: the block catches it, it does not carry it
const BLOCK_PARK = [-58, 52, -BOL_Z]; // waiting on the floor, front left of the press
const GATE = { hx: 52, y: 33, z0: 58, z1: 150 }; // hinged at the right upright
const CAB = { x: -206, y: -44, w: 58, d: 28, r: 0.8 };
const CAB_F = CAB.y + CAB.d; // the cabinet's front face
const SW = [-162, CAB_F, 112]; // the main switch's hub
const VALVE = [95, -2, 122]; // the ball valve's hub (front of its stem)
const ACC = [190, -27]; // the accumulator bottle
const GAUGE = [196, -20, 20]; // the accumulator's gauge
const BOX_F = -16; // the lockbox's front face
const HASP = [-266, -261, -256, -251]; // the lockbox's hasp holes, x
const CON = { x: -126, y: 54, w: 36, d: 16, r: 1 };
const CON_Z = 104;
const ESTOP = [-117, 62];
const START = [-105, 62];
const FIT0 = [-30, 96]; // the fitter's home
const OPS = [[64, 86], [96, 74]]; // the operators' places
const C = {
  BED_Z, BOL_Z, UP_Z, RAM0, RAM_H, STROKE, BLOCK, BLOCK_TOP, BLOCK_PARK, GATE, SW, VALVE, ACC, GAUGE, BOX_F, HASP, CON_Z, ESTOP, START, FIT0, OPS,
};
assert(STROKE === 78 && RAM0 - BLOCK_TOP === 3, 'stroke and the gap over the block');

const FIT = [[-280, -50, 0], [215, 104, 0], [-280, -50, 160], [215, -90, 110], [0, -36, 312], [-280, 104, 0], [0, 104, 175]];
const P = k.fitProjection(FIT, W, H, { pad: 8, azimuth: 52, elevation: 30 });
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
// a flat rectangle on a face of constant y (the front of a part), or of constant x (its right side)
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const faceX = (x, y0, y1, z0, z1) => k.pathOf([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'lt-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const led = (key, p, r = 0.8) => { const [x, y] = at(p); return `<circle class="lt-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };
// a circle on a face of constant y
const ringY = (c, r, n = 28) => k.pathOf(Array.from({ length: n }, (_, i) => at([c[0] + r * Math.cos((i / n) * 2 * Math.PI), c[1], c[2] + r * Math.sin((i / n) * 2 * Math.PI)])), true);

// ---------------------------------------------------------------- padlocks and tags
// A padlock hanging from a hole at p on a face of constant y: a shackle, a body
// and the tag with its name stripe hanging under it. Shown or hidden by the stage.
function padlock(p, key, tag = true) {
  const [x, y, z] = p;
  const yb = y + 0.6;
  const shackle = k.pathOf([[x - 1.5, yb + 1, z - 2.4], [x - 1.5, yb + 1, z + 0.6], [x - 0.9, yb + 1, z + 1.6], [x, yb + 1, z + 2], [x + 0.9, yb + 1, z + 1.6], [x + 1.5, yb + 1, z + 0.6], [x + 1.5, yb + 1, z - 2.4]].map(at));
  let out = `<path class="lt-shackle" d="${shackle}"/>`;
  out += box({ x: x - 2.6, y: yb, w: 5.2, d: 2.2, r: 0.5 }, z - 8.4, z - 2.4, { tone: 'hi', crease: 'lo' }, 0.3, 1);
  out += Dt([at([x, yb + 2.2, z - 6])], { size: 0.35 });
  if (tag) {
    const ty = yb + 2.4;
    const tz = z - 8.4;
    out += L(k.segment([x, ty, tz + 0.4], [x + 0.6, ty, tz - 2.4], P), { tone: 'mid' });
    out += `<path class="lt-tag" d="${faceY(ty, x - 2.8, x + 3.6, tz - 13, tz - 2.4)}"/>`;
    out += `<path class="fp-ink lt-stripe" d="${faceY(ty, x - 2.8, x + 3.6, tz - 5.6, tz - 4)}"/>`;
    out += rules(x - 1.8, ty, tz - 7.6, [4.2, 3, 3.6], 1.6) + Dt([at([x + 0.4, ty, tz - 3.4])], { size: 0.32 });
  }
  return g(key, out, ' style="display:none"');
}
// a key: bow, shaft and bit, flat on a face of constant y
const keySvg = (x, y, z) => `<path class="lt-key" d="${k.pathOf([[x, y, z], [x + 2.6, y, z], [x + 2.6, y, z + 2.6], [x, y, z + 2.6]].map(at), true)}${k.pathOf([[x + 2.6, y, z + 1], [x + 8, y, z + 1], [x + 8, y, z + 1.6], [x + 2.6, y, z + 1.6]].map(at), true)}${k.pathOf([[x + 6, y, z + 1], [x + 6, y, z - 0.4], [x + 7.2, y, z - 0.4], [x + 7.2, y, z + 1]].map(at), true)}"/>`;

// ---------------------------------------------------------------- the group lockbox on its stand
const lockbox = (() => {
  const BOARD = { x: -278, y: -28, w: 36, d: 2.4, r: 0.3 };
  const BOX = { x: -272, y: -24, w: 26, d: 8, r: 0.6 };
  let out = halo({ x: -268, y: -34, w: 16, d: 14, r: 2 }, 0, 2);
  out += box({ x: -269, y: -33, w: 14, d: 12, r: 1 }, 0, 2, { tone: 'lo' }, 0.3) + screws({ x: -269, y: -33, w: 14, d: 12 }, 2, 1.6);
  out += box({ x: -264, y: -30, w: 4, d: 4, r: 0.3 }, 2, 80, {}, 0.2, 1);
  out += box(BOARD, 80, 156, { tone: 'lo', inner: seam(BOARD, 84, 1) }, 0.3, 1);
  // peg holes on the board's face, with three spare locks on their pegs
  const pegs = [];
  for (let zz = 132; zz <= 150; zz += 6) for (let xx = -275; xx <= -246; xx += 4) pegs.push(at([xx, BOARD.y + BOARD.d, zz]));
  out += Dt(pegs, { size: 0.3, tone: 'lo' });
  out += box(BOX, 100, 124, { inner: seam(BOX, 104, 1) }, 0.4, 2) + screws(BOX, 124, 1.4);
  out += card(BOX.y + BOX.d, -268, -250, 108, 121, 'lt-glass');
  out += L(k.lineOnTop([-266, -20], [-252, -20], 124, P), { tone: 'lo' }); // the key slot
  out += g('boxKeys', keySvg(-266, BOX.y + BOX.d - 0.2, 116) + keySvg(-262, BOX.y + BOX.d - 0.2, 111), ' style="display:none"');
  out += box({ x: -271, y: BOX_F, w: 24, d: 1.4, r: 0.2 }, 91, 100, { tone: 'hi', crease: 'lo' }, 0, 1);
  out += Dt(HASP.map((xx) => at([xx, BOX_F + 1.4, 97.4])), { size: 0.5, tone: 'lo' });
  out += box({ x: -276, y: BOARD.y + BOARD.d, w: 12, d: 1, r: 0.2 }, 86, 94, { tone: 'lo' }, 0, 1) + rules(-275, BOARD.y + BOARD.d + 1, 92, [9, 6, 8], 2);
  return out;
})();
const spareLocks = [-272, -263, -254].map((xx, i) => padlock([xx, -25.6 + 0.01, 147], 'spare' + i, false).replace(' style="display:none"', '')).join('');
const boxLocks = HASP.map((xx, i) => padlock([xx, BOX_F + 1.4, 97.4], 'boxLock' + i, false)).join('');

// ---------------------------------------------------------------- the control cabinet with the main switch
const cabinet = (() => {
  let out = halo(k.insetPlan(CAB, -3), 0, 2);
  out += box(CAB, 0, 8, { tone: 'lo' }, 0.3, 1);
  out += box(k.insetPlan(CAB, 0.4), 8, 150, { inner: seam(CAB, 146, 2) + seam(CAB, 12, 2) }, 0.5, 2);
  out += box(k.insetPlan(CAB, -0.6), 150, 153, {}, 0.4);
  // the door: its seam, hinges, handle, vents, a type plate and the power lamp
  out += `<path class="lt-seam" d="${faceY(CAB_F, CAB.x + 3, CAB.x + CAB.w - 3, 14, 144)}"/>`;
  out += Dt([[CAB.x + 4.6, CAB_F, 36], [CAB.x + 4.6, CAB_F, 124]].map(at), { size: 0.55 });
  out += box({ x: CAB.x + CAB.w - 8, y: CAB_F, w: 3, d: 1.6, r: 0.3 }, 66, 80, { tone: 'hi', crease: 'lo' }, 0, 1);
  out += `<path class="lt-hole" d="${[0, 1, 2, 3].map((i) => faceY(CAB_F, CAB.x + 12, CAB.x + 30, 20 + i * 3.4, 21.6 + i * 3.4)).join('')}"/>`;
  out += card(CAB_F, CAB.x + 10, CAB.x + 30, 128, 138) + rules(CAB.x + 12, CAB_F, 135.4, [14, 10, 12], 2);
  out += led('power', [CAB.x + 40, CAB_F, 132], 1.6);
  // the main switch: a square plate; the handle is drawn by the stage (it turns)
  out += cue('points', cue('switch', box({ x: SW[0] - 8, y: CAB_F, w: 16, d: 1, r: 0.6 }, SW[2] - 8, SW[2] + 8, { tone: 'hi', crease: 'lo' }, 0.2, 1)
    + L(k.pathOf([at([SW[0] - 6, CAB_F + 1, SW[2] + 6]), at([SW[0] - 3, CAB_F + 1, SW[2] + 6])]) + k.pathOf([at([SW[0] + 6, CAB_F + 1, SW[2] - 6]), at([SW[0] + 6, CAB_F + 1, SW[2] - 3])]), { tone: 'lo', free: true })
    + g('swHandle', '')));
  // the cable gland on the right side and the side vents
  out += `<path class="lt-hole" d="${[0, 1, 2].map((i) => faceX(CAB.x + CAB.w, CAB.y + 8, CAB.y + 20, 40 + i * 4, 41.6 + i * 4)).join('')}"/>`;
  return out;
})();

// ---------------------------------------------------------------- the console: emergency stop, start, stop and a small screen
const consoleSvg = (() => {
  let out = halo({ x: -114, y: 56, w: 12, d: 12, r: 2 }, 0, 2);
  out += post(-108, 62, 5, 0, 2, { tone: 'lo' }, 12);
  out += box({ x: -111, y: 59, w: 6, d: 6, r: 0.6 }, 2, CON_Z - 8, {}, 0.3, 1);
  out += box(CON, CON_Z - 8, CON_Z, { inner: seam(CON, CON_Z - 4) }, 0.4) + screws(CON, CON_Z, 1.4);
  out += box({ x: -124, y: CON.y + 1, w: 14, d: 3, r: 0.4 }, CON_Z, CON_Z + 12, {}, 0.3);
  out += card(CON.y + 4, -122, -112, CON_Z + 2, CON_Z + 10, 'lt-screen') + g('screen', '');
  out += post(START[0], START[1], 2.6, CON_Z, CON_Z + 0.8, { tone: 'lo' }, 10) + cue('start', g('btnStart', post(START[0], START[1], 2, CON_Z + 0.8, CON_Z + 2, { tone: 'hi', crease: 'lo' }, 10)));
  out += post(START[0] + 8, START[1], 2.6, CON_Z, CON_Z + 0.8, { tone: 'lo' }, 10) + g('btnStop', post(START[0] + 8, START[1], 2, CON_Z + 0.8, CON_Z + 1.6, { tone: 'mid', crease: 'lo' }, 10));
  out += post(ESTOP[0], ESTOP[1], 4.4, CON_Z, CON_Z + 1, { tone: 'lo' }, 14);
  out += cue('estop', g('estopHead', post(ESTOP[0], ESTOP[1], 1.6, CON_Z + 1, CON_Z + 3, {}, 12) + S(k.cylinder(ESTOP[0], ESTOP[1], 3.6, CON_Z + 3, 2.4, P, 14, 0.7), { tone: 'hi', crease: 'lo', lit: true })));
  return out;
})();

// ---------------------------------------------------------------- the press
const PBED = { x: -72, y: -38, w: 144, d: 76, r: 1.2 };
const press = {};
press.back = [
  halo(k.insetPlan(PBED, -4), 0, 2),
  ...k.corners(PBED, 7).map(([x, y]) => box({ x: x - 4, y: y - 4, w: 8, d: 8, r: 0.6 }, 0, 4, { tone: 'lo' }, 0.2, 1)),
  box(PBED, 4, BED_Z, { tone: 'lo', inner: seam(PBED, BED_Z - 6, 3) + seam(PBED, 10, 3) }, 0.8, 3),
  card(PBED.y + PBED.d, -20, 20, 22, 34) + rules(-17, PBED.y + PBED.d, 31, [24, 16, 20], 2.4),
  box({ x: -58, y: -32, w: 116, d: 64, r: 0.8 }, BED_Z, BOL_Z, {}, 0.4),
  L([-14, 0, 14].map((yy) => k.lineOnTop([-56, yy], [56, yy], BOL_Z, P)).join(''), { tone: 'faint' }),
  // the left upright with its tie-rod nuts and the guide gib on its inside
  box({ x: -72, y: -32, w: 20, d: 64, r: 0.8 }, BED_Z, UP_Z, { inner: seam({ x: -72, y: -32, w: 20, d: 64 }, UP_Z - 8, 2) }, 0.6, 2),
  box({ x: -52, y: -8, w: 3, d: 16, r: 0.2 }, 60, UP_Z, { tone: 'lo' }, 0, 1),
].join('');
press.ldie = [
  box({ x: -32, y: -21, w: 64, d: 42, r: 0.6 }, BOL_Z, LDIE_Z, { inner: seam({ x: -32, y: -21, w: 64, d: 42 }, BOL_Z + 4, 2) }, 0.5),
  box({ x: -12, y: -8, w: 24, d: 16, r: 0.6 }, LDIE_Z, LDIE_Z + 3, { tone: 'hi', crease: 'lo' }, 0.3),
  ...[[-26, -15], [26, -15], [-26, 15], [26, 15]].map(([x, y]) => post(x, y, 2.4, LDIE_Z, LDIE_Z + 30, { tone: 'hi', crease: 'lo' }, 14, 0.4)),
].join('');
// the ram, its upper die (with the bushings for the pillars) and the piston rod; it moves
press.ram = [
  post(0, 0, 8, RAM0 + RAM_H, UP_Z + 4, { tone: 'hi', crease: 'lo' }, 22),
  box({ x: -32, y: -21, w: 64, d: 42, r: 0.6 }, RAM0 - DIE_H, RAM0, { inner: seam({ x: -32, y: -21, w: 64, d: 42 }, RAM0 - 4, 2) }, 0.5),
  ...[[-26, -15], [26, -15], [-26, 15], [26, 15]].map(([x, y]) => post(x, y, 3.6, RAM0 - DIE_H - 10, RAM0 - DIE_H, {}, 14)),
  box({ x: -49, y: -27, w: 98, d: 54, r: 0.8 }, RAM0, RAM0 + RAM_H, { tone: 'hi', crease: 'lo', inner: seam({ x: -49, y: -27, w: 98, d: 54 }, RAM0 + 6, 2) }, 0.6, 2),
  Dt([[-40, 27, RAM0 + 26], [40, 27, RAM0 + 26], [-40, 27, RAM0 + 12], [40, 27, RAM0 + 12]].map(at), { size: 0.5 }),
].join('');
press.block = box(BLOCK, BOL_Z, BLOCK_TOP, { tone: 'hi', crease: 'lo', inner: seam(BLOCK, BOL_Z + 8, 1) + seam(BLOCK, BLOCK_TOP - 8, 1) }, 0.4, 1)
  + L([0, 1, 2, 3, 4].map((i) => k.segment([BLOCK.x, BLOCK.y + BLOCK.d, BOL_Z + 20 + i * 16], [BLOCK.x + BLOCK.w, BLOCK.y + BLOCK.d, BOL_Z + 28 + i * 16], P)).join(''), { tone: 'lo' });
press.front = [
  box({ x: 52, y: -32, w: 20, d: 64, r: 0.8 }, BED_Z, UP_Z, { inner: seam({ x: 52, y: -32, w: 20, d: 64 }, UP_Z - 8, 2) }, 0.6, 2),
  box({ x: 72, y: -10, w: 6, d: 18, r: 0.4 }, 112, 132, {}, 0.3), // the air valve block on the right upright
  led('y1', [78, 0, 128], 0.7),
  box({ x: -76, y: -38, w: 152, d: 76, r: 1.2 }, UP_Z, CROWN_Z, { inner: seam({ x: -76, y: -38, w: 152, d: 76 }, UP_Z + 6, 3) + seam({ x: -76, y: -38, w: 152, d: 76 }, CROWN_Z - 6, 3) }, 0.8, 3),
  screws({ x: -76, y: -38, w: 152, d: 76 }, CROWN_Z, 6),
  Dt([[-62, 38, UP_Z + 18], [62, 38, UP_Z + 18]].map(at), { size: 0.7 }),
  post(0, 0, 27, CROWN_Z, CROWN_Z + 8, {}, 26, 0.6),
  Dt(Array.from({ length: 8 }, (_, i) => at([24 * Math.cos((i / 8) * 2 * Math.PI), 24 * Math.sin((i / 8) * 2 * Math.PI), CROWN_Z + 8])), { size: 0.5 }),
  post(0, 0, 21, CROWN_Z + 8, CROWN_Z + 52, { inner: L(k.sideArc(0, 0, 21, CROWN_Z + 30, P, 22), { tone: 'faint' }) }, 26),
  post(0, 0, 23, CROWN_Z + 52, CROWN_Z + 58, {}, 26, 0.6),
  box({ x: 12, y: -6, w: 14, d: 12, r: 0.6 }, CROWN_Z + 58, CROWN_Z + 62, { tone: 'lo' }, 0.3),
].join('');

// ---------------------------------------------------------------- the air panel: ball valve and filter-regulator
const air = (() => {
  let out = halo({ x: 90, y: -16, w: 12, d: 10, r: 2 }, 0, 2);
  out += box({ x: 91, y: -15, w: 11, d: 9, r: 0.6 }, 0, 2, { tone: 'lo' }, 0.2) + screws({ x: 91, y: -15, w: 11, d: 9 }, 2, 1.4);
  out += box({ x: 94, y: -13, w: 5, d: 5, r: 0.3 }, 2, 150, {}, 0.2, 1);
  out += box({ x: 88, y: -9, w: 30, d: 2, r: 0.3 }, 92, 142, { tone: 'lo' }, 0.2, 1) + Dt([[90, -7, 94], [116, -7, 94], [90, -7, 140], [116, -7, 140]].map(at), { size: 0.4 });
  // the pipe: up from the floor coupling, through the valve to the regulator
  out += post(95, -4.5, 1.6, 96, 117, {}, 12) + box({ x: 93, y: -6.5, w: 4, d: 4, r: 0.3 }, 93, 97, { tone: 'hi', crease: 'lo' }, 0, 1);
  out += cue('points', cue('valve', box({ x: 91, y: -7, w: 8, d: 5, r: 0.6 }, 117, 127, { tone: 'hi', crease: 'lo' }, 0.3) + g('vLever', '')));
  out += alongX(-4.5, 122, 99, 104, 1.6, {}, 12);
  out += box({ x: 104, y: -7, w: 8, d: 6, r: 0.5 }, 116, 128, {}, 0.3);
  out += post(108, -4, 3, 104, 116, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(108, -4, 3, 110, P, 16), { tone: 'faint' }) }, 16, 0.6);
  out += post(108, -4, 1, 128, 131, {}, 10);
  out += post(108, -4, 3.4, 131, 133.4, {}, 14, 0.5);
  out += alongX(-4.5, 122, 112, 115, 1.6, {}, 12);
  return out;
})();
const hose = (pts, tone = 'mid', size = 1.1) => k.wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via: pts.slice(1, -1).map(at), tone, size, ends: 'both' });
const airHoses = hose([[115, -4.5, 122], [120, 6, 118], [100, 10, 122], [78, 0, 122]], 'mid', 1.1)
  + hose([[95, -4.5, 93], [95, -8, 60], [95, -20, 4], [95, -30, 1]], 'lo', 1.1);

// ---------------------------------------------------------------- the hydraulic power unit
const TANK = { x: 116, y: -92, w: 84, d: 46, r: 1 };
const hpu = (() => {
  let out = halo(k.insetPlan(TANK, -3), 0, 2);
  out += k.corners(TANK, 5).map(([x, y]) => box({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.4 }, 0, 4, { tone: 'lo' }, 0.2, 1)).join('');
  out += box(TANK, 4, 46, { tone: 'lo', inner: seam(TANK, 42, 2) + seam(TANK, 9, 2) }, 0.6, 2) + screws(TANK, 46, 3);
  out += card(TANK.y + TANK.d, 124, 128, 14, 36, 'lt-glass') + `<path class="lt-level" d="${faceY(TANK.y + TANK.d, 124.6, 127.4, 14.6, 28)}"/>`;
  out += post(130, -82, 3, 46, 52, {}, 12) + post(130, -82, 3.6, 52, 54, { tone: 'hi', crease: 'lo' }, 12, 0.4);
  // the motor with its cooling fins, the bell housing and the pump
  out += box({ x: 138, y: -80, w: 26, d: 20, r: 0.6 }, 46, 50, { tone: 'lo' }, 0.2);
  out += alongX(-70, 62, 134, 164, 11, {}, 16);
  out += L([140, 145, 150, 155, 160].map((xx) => k.pathOf(Array.from({ length: 13 }, (_, i) => { const a = -0.2 + (i / 12) * 3.4; return at([xx, -70 + 11.2 * Math.cos(a), 62 + 11.2 * Math.sin(a)]); }))).join(''), { tone: 'faint' });
  out += alongX(-70, 62, 130, 134, 9, { tone: 'lo' }, 16);
  out += box({ x: 142, y: -77, w: 12, d: 10, r: 0.5 }, 72, 78, {}, 0.3) + led('motor', [148, -67, 76], 0.7);
  out += alongX(-70, 62, 164, 174, 8, {}, 16);
  out += alongX(-70, 62, 174, 186, 6, { tone: 'hi', crease: 'lo' }, 14);
  out += post(180, -70, 2, 66, 72, {}, 12);
  // the accumulator: a safety block with the bleed valve and gauge, the bottle on top
  const AB = { x: 182, y: -34, w: 22, d: 14, r: 0.6 };
  out += halo(k.insetPlan(AB, -2), 0, 2);
  out += box(AB, 0, 30, { inner: seam(AB, 26, 1.4) }, 0.4, 1) + screws(AB, 30, 1.6);
  out += cue('accumulator', post(ACC[0], ACC[1], 9, 30, 80, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(ACC[0], ACC[1], 9, 62, P, 16), { tone: 'faint' }) }, 16)
    + S(k.cylinder(ACC[0], ACC[1], 9, 80, 8, P, 16, 6), { tone: 'hi', crease: 'lo' })
    + post(ACC[0], ACC[1], 1.8, 88, 93, {}, 12) + post(ACC[0], ACC[1], 2.6, 93, 95, { tone: 'lo' }, 12, 0.3)
    + box({ x: ACC[0] - 10, y: ACC[1] + 8, w: 20, d: 2, r: 0.3 }, 58, 64, { tone: 'lo' }, 0, 1));
  // the bleed valve: a knurled knob on the block's front
  out += cue('bleed', alongY(186, 10, AB.y + AB.d, AB.y + AB.d + 2, 3.4, { tone: 'lo' }, 14) + alongY(186, 10, AB.y + AB.d + 2, AB.y + AB.d + 4.6, 2.6, { tone: 'hi', crease: 'lo' }, 14));
  // the gauge: bezel, face, ticks; the needle is drawn by the stage
  out += cue('gauge', alongY(GAUGE[0], GAUGE[2], AB.y + AB.d, AB.y + AB.d + 1.6, 6.4, {}, 16)
    + `<path class="lt-dial" d="${ringY([GAUGE[0], AB.y + AB.d + 1.62, GAUGE[2]], 5.4)}"/>`
    + L(Array.from({ length: 11 }, (_, i) => { const a = (-135 + i * 27) * Math.PI / 180; const yy = AB.y + AB.d + 1.64; return k.segment([GAUGE[0] - 5 * Math.sin(-a), yy, GAUGE[2] + 5 * Math.cos(a)], [GAUGE[0] - (i % 5 ? 4.2 : 3.6) * Math.sin(-a), yy, GAUGE[2] + (i % 5 ? 4.2 : 3.6) * Math.cos(a)], P); }).join(''), { tone: 'mid' })
    + g('needle', ''));
  return out;
})();
// the pressure line from the pump up to the press's cylinder
const oilLine = hose([[184, -70, 68], [184, -70, 236], [180, -40, 240], [82, -20, 240], [76, -20, 240]], 'mid', 1.6);
const cables = hose([[-160, CAB_F, 9], [-156, -6, 1], [-80, -6, 1], [-76, 30, 1], [-64, 38, 14]], 'lo', 1.1);

// ---------------------------------------------------------------- people
// Three standing figures (the fitter and two operators), drawn by the stage
// when the page opens (stage.js, person), which keeps the page small.
const people = [g('op1', ''), g('op2', ''), g('fitter', cue('fitter', g('fitterBody', '')))].join('');

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('tags', ''),
  g('sheet', '', ' data-cue="sheet"'),
  g('badges', ''),
  g('gaugeBig', '', ' data-cue="gauge"'),
  g('proof', '', ' data-cue="zero"'),
  g('restart', '', ' data-cue="restart"'),
  g('rules', ''),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('lockbox', lockbox + cue('lockbox', boxLocks) + spareLocks),
  g('cabinet', cabinet + cue('locks', padlock([SW[0], CAB_F + 1.4, SW[2] - 8.6], 'lockSw'))),
  g('hpu', hpu),
  g('press', [
    press.back,
    press.ldie,
    cue('block', g('block', press.block)),
    cue('ram', g('ram', press.ram)),
    press.front,
  ].join('')),
  oilLine,
  g('air', air + cue('locks', padlock([VALVE[0], 0.6, VALVE[2] - 6], 'lockValve'))),
  airHoses,
  g('rail', ''),
  g('gate', ''),
  cue('block', g('blockOut', press.block)),
  cables,
  g('console', consoleSvg),
  people,
].join('');
// the cue groups for the isolation points and the locks: both points with their locks
// (switch, valve) are cued together through these names, set in the stage

// Static paths written with relative line-tos (the helper from the measuring
// film): the same points (to 0,1), about a third fewer bytes. Only M, L and Z
// paths at one decimal are rewritten, and each rewrite is read back to prove it exact.
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
if (process.argv.includes('--sizes')) for (const [n, v] of Object.entries({ lockbox, spareLocks, boxLocks, cabinet, consoleSvg, pb: press.back, pl: press.ldie, pr: press.ram, pk: press.block, pf: press.front, air, airHoses, hpu, oilLine, cables, people })) console.log(n, (compact(v).length / 1024).toFixed(1));
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const FULL = cam([-32, 0, 130], 640);
const CAM = [
  { from: FULL, to: cam([-90, 20, 110], 400), a: 0.72, b: 0.88 },
  { from: cam([-10, 20, 120], 560), to: cam([-30, 20, 110], 520) },
  { from: cam([-130, -10, 110], 300), to: cam([30, -10, 115], 330), a: 0.18, b: 0.34 },
  { from: cam([-250, -10, 100], 250), to: cam([-255, -10, 100], 230) },
  { from: cam([-20, 0, 110], 380), to: cam([120, -20, 70], 360), a: 0.33, b: 0.5 },
  { from: cam([-70, 30, 100], 400), to: cam([-30, 10, 110], 460), a: 0.4, b: 0.75 },
  { from: cam([-40, 10, 120], 520), to: cam([-60, 10, 115], 560) },
];

// ---------------------------------------------------------------- the film
const DUR = [36, 36, 36, 30, 36, 34, 38];
C.dur = DUR;
const spec = {
  id: 'eng.safety.loto',
  title: { nl: 'Vergrendelen en labelen', en: 'Lockout-tagout' },
  lessons: [LOTO],
  scenes: [
    {
      id: 's1', lesson: LOTO, level: 1, dur: DUR[0], still: 0.6, title: { nl: 'Een pers vol energie', en: 'A press full of energy' },
      beats: [
        { nl: 'Een hydraulische pers bij een matrijswissel: het gereedschap dat de delen vormt, gaat eruit.', en: 'A hydraulic press at a die change: the tool that shapes the parts comes out.', cues: ['ram'] },
        { nl: 'Vier bronnen van energie: stroom, perslucht, oliedruk en de zware stoter bovenin.', en: 'Four sources of energy: electricity, compressed air, oil pressure and the heavy ram at the top.', cues: ['switch', 'valve', 'accumulator', 'ram'] },
        { nl: 'Druk en een opgetilde last blijven na het stoppen: {t:Opgeslagen energie|opgeslagen energie}.', en: 'Pressure and a raised load stay after stopping: {t:Stored energy|stored energy}.', cue: { 'Opgeslagen energie': 'accumulator' }, cues: ['ram'] },
        { nl: 'Stoppen is niet scheiden: een {t:Noodstop|noodstop} kan worden teruggezet.', en: 'Stopping is not isolating: an {t:Emergency stop|emergency stop} can be reset.', cue: { Noodstop: 'estop' }, read: { nl: 'NEN-EN-ISO 14118: voorkomen van onverwacht starten', en: 'EN ISO 14118: prevention of unexpected start-up' } },
      ],
    },
    {
      id: 's2', lesson: LOTO, level: 1, dur: DUR[1], still: 0.4, title: { nl: 'Melden en normaal stoppen', en: 'Tell, then stop normally' },
      beats: [
        { nl: '{t:Vergrendelen en labelen|Vergrendelen en labelen}: elke bron dicht, met je eigen slot en een label met je naam.', en: '{t:LOTO|LOTO}: every source shut off, with your own lock and a tag with your name.', cue: { 'Vergrendelen en labelen': 'sheet' } },
        { nl: 'Eerst de LOTO-procedure van deze pers: één blad met een foto van elk scheidingspunt.', en: 'First the LOTO procedure for this press: one page with a photo of every isolation point.', cues: ['sheet'] },
        { nl: 'De monteur laat het de operators weten: de pers gaat stil voor onderhoud.', en: 'The technician tells the operators: the press is stopping for maintenance.', cues: ['fitter'] },
        { nl: 'Dan stopt hij de pers normaal, met de stoter bovenin.', en: 'Then he stops the press normally, with the ram at the top.', cues: ['ram'] },
      ],
    },
    {
      id: 's3', lesson: LOTO, level: 1, dur: DUR[2], still: 0.68, title: { nl: 'Elk scheidingspunt een slot', en: 'A lock on every isolation point' },
      beats: [
        { nl: 'Hoofdschakelaar uit: de stroom naar motor en besturing is gescheiden.', en: 'Main switch off: the power to the motor and the controls is isolated.', cues: ['switch'] },
        { nl: 'Persluchtkraan dicht: de lucht achter de kraan loopt weg.', en: 'Air valve closed: the air behind the valve bleeds away.', cues: ['valve'] },
        { nl: 'Op elk {t:Scheidingspunt|scheidingspunt} hangt hij zijn eigen slot, met een label met zijn naam.', en: 'On every {t:Isolation point|isolation point} he fits his own lock, with a tag with his name.', cue: { Scheidingspunt: 'points' } },
        { nl: 'Een label zonder slot telt niet: het slot houdt hem dicht, het label zegt wie.', en: 'A tag without a lock does not count: the lock keeps it shut, the tag says who.', cues: ['locks'] },
      ],
    },
    {
      id: 's4', lesson: LOTO, level: 1, dur: DUR[3], still: 0.6, title: { nl: 'Met meer mensen', en: 'With more people' },
      beats: [
        { nl: 'Met meer mensen gaan de sleutels in een {t:Groepsslotkast|groepsslotkast}.', en: 'With more people, the keys go into a {t:Group lockbox|group lockbox}.', cue: { Groepsslotkast: 'lockbox' } },
        { nl: 'Elke werker hangt zijn eigen, persoonlijke slot op de kast.', en: 'Every worker puts his own personal lock on the box.', cues: ['lockbox'] },
        { nl: 'Pas als het laatste slot eraf is, komen de sleutels vrij.', en: 'Only when the last lock is off do the keys come free.', cues: ['lockbox'] },
      ],
    },
    {
      id: 's5', lesson: LOTO, level: 1, dur: DUR[4], still: 0.55, title: { nl: 'Eerst blokkeren, dan de druk eraf', en: 'Block first, then bleed' },
      beats: [
        { nl: 'Eerst een veiligheidsblok onder de stoter: zakt hij, dan staat hij op het blok.', en: 'First a safety block under the ram: if it comes down, it lands on the block.', cues: ['block'] },
        { nl: 'Dan pas de accumulator leeg: een vat dat olie onder druk opslaat.', en: 'Only then empty the accumulator: a tank that stores oil under pressure.', cues: ['accumulator', 'bleed'] },
        { nl: 'Laten leeglopen tot de manometer {n:0} bar aangeeft.', en: 'Bleed it until the gauge reads {n:0} bar.', cues: ['gauge'] },
        { nl: 'Andersom kan de stoter zakken zodra de druk wegvalt.', en: 'The other way round, the ram can drop as soon as the pressure goes.', cues: ['ram', 'block'] },
      ],
    },
    {
      id: 's6', lesson: LOTO, level: 1, dur: DUR[5], still: 0.5, title: { nl: 'Bewijzen: energieloos', en: 'Proving zero energy' },
      beats: [
        { nl: 'Afscherming dicht, dan drukt hij op start: er gebeurt niks.', en: 'Guard closed, then he presses start: nothing happens.', cues: ['start'] },
        { nl: 'Proberen te starten en meters lezen: zo bewijs je {t:Energieloos|energieloos}.', en: 'Trying to start and reading the gauges: that is how you prove {t:Zero energy|zero energy}.', cue: { Energieloos: 'zero' }, cues: ['block', 'start'] },
        { nl: 'Bediening terug op uit. Pas dan gaat de afscherming open en grijpt hij naar binnen.', en: 'Controls back to off. Only then does the guard open and he reaches in.', cues: ['start'] },
        { nl: 'Beweegt er toch iets? Dan is er een bron vergeten, zoals een tweede persluchtvat.', en: 'Does something move after all? Then a source was missed, such as a second air tank.', cues: [] },
      ],
    },
    {
      id: 's7', lesson: LOTO, level: 1, dur: DUR[6], still: 0.4, title: { nl: 'Weer starten', en: 'Restarting' },
      beats: [
        { nl: 'Klaar: gereedschap en blok eruit, afschermingen dicht, iedereen vrij.', en: 'Done: tools and block out, guards closed, everyone clear.', cues: ['restart', 'block'] },
        { nl: 'Alleen wie het slot hing, haalt het eraf.', en: 'Only the person who fitted the lock removes it.', cues: ['locks'], stillAt: 0.45 },
        { nl: 'Is iemand naar huis met zijn slot erop? Alleen via een strenge procedure, nooit doorknippen.', en: 'Has someone gone home with his lock on? Only under a strict procedure, never cut it off.', cues: [] },
        { nl: 'Werk aan de elektrische installatie zelf? Dan gelden ook de vijf veiligheidsregels.', en: 'Work on the electrical installation itself? Then the five safety rules apply too.', cues: ['switch'], read: { nl: 'NEN 3140 en NEN-EN 50110', en: 'NEN 3140 and NEN-EN 50110' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully; the lesson is a Basis, so the whole film is one broad
// "how it works". No "/" or "&" in the spoken text; standard numbers stay in
// the captions only. Dutch: no "lockout-tagout" (espeak-ng reads "taagout"), and
// hoofdschakelaar and veiligheidsregels get a spoken split (films/_kit/timeline.mjs, SAY).
const SAY = [
  [ // s1 a press full of energy
    { nl: 'Dit is een hydraulische pers bij een onderdelenfabrikant. Vandaag krijgt hij een matrijswissel: het gereedschap dat de delen vormt, gaat eruit.',
      en: 'This is a hydraulic press at a parts manufacturer. Today it gets a die change: the tool that shapes the parts comes out.' },
    { nl: 'Kijk eerst waar de energie zit. Stroom uit de kast, voor de motor en de besturing. Perslucht, voor de klemmen. Olie onder druk in de accumulator, naast de pomp. En de zware stoter: hij staat opgetild, dus hij kan vallen.',
      en: 'First look at where the energy is. Electricity from the cabinet, for the motor and the controls. Compressed air, for the clamps. Oil under pressure in the accumulator, next to the pump. And the heavy ram: it is raised, so it can fall.' },
    { nl: 'Twee daarvan blijven er ook als alles uit staat: de oliedruk en de opgetilde stoter. Dat is {t:Opgeslagen energie|opgeslagen energie}. Die moet je ontladen of blokkeren, anders kan er na het uitzetten nog iets bewegen.',
      en: 'Two of them stay even when everything is off: the oil pressure and the raised ram. That is {t:Stored energy|stored energy}. You have to release it or block it, or something can still move after switching off.' },
    { nl: 'En de {t:Noodstop|noodstop}, de rode knop op geel? Die stopt de pers, maar scheidt niets. Iemand kan hem terugzetten, de besturing kan falen, en de opgeslagen energie blijft. Een noodstop is een veiligheidsfunctie, geen vergrendeling.',
      en: 'And the {t:Emergency stop|emergency stop}, the red button on yellow? It stops the press, but it isolates nothing. Someone can reset it, the controls can fail, and the stored energy stays. An emergency stop is a safety function, not a lockout.' },
  ],
  [ // s2 tell, then stop normally
    { nl: 'Daarom werk je met {t:Vergrendelen en labelen|vergrendelen en labelen}, kort LOTO. Je sluit elke bron van energie af, en hangt er je eigen hangslot op, met een label met je naam.',
      en: 'That is why you work with {t:LOTO|LOTO}, lockout-tagout. You shut off every source of energy, and fit your own padlock to it, with a tag with your name.' },
    { nl: 'Begin bij de LOTO-procedure van deze pers: vaak één blad met een foto van elk punt waar je een bron afsluit, in de juiste volgorde.',
      en: 'Start with the LOTO procedure for this press: often one page with a photo of every point where you shut off a source, in the right order.' },
    { nl: 'Dan laat de monteur de operators weten wat hij gaat doen, zodat niemand de pers straks verbaasd weer aanzet.',
      en: 'Then the technician tells the operators what he is going to do, so nobody switches the press back on in surprise.' },
    { nl: 'Daarna stopt hij de pers op de normale manier met de stopknop. Dan parkeert hij de stoter bovenin.',
      en: 'Next he stops the press the normal way, with the stop button, and parks the ram at the top.' },
  ],
  [ // s3 a lock on every isolation point
    { nl: 'Nu scheiden. Eerst de hoofdschakelaar op de kast: uit. De motor van de pomp en de besturing krijgen geen stroom meer.',
      en: 'Now isolate. First the main switch on the cabinet: off. The pump motor and the controls get no more power.' },
    { nl: 'Dan de persluchtkraan: dicht. Een vergrendelbare kraan met ontluchting laat de lucht achter de kraan weglopen, zodat de leiding naar de pers drukloos wordt.',
      en: 'Then the compressed-air valve: closed. A lockable valve with an exhaust lets the air behind the valve escape, so the line to the press loses its pressure.' },
    { nl: 'De schakelaar en de kraan zijn de {t:Scheidingspunt|scheidingspunten}: de plekken waar je een bron afsluit en een slot kunt hangen. Op allebei hangt hij zijn eigen slot, met een label met zijn naam.',
      en: 'The switch and the valve are the {t:Isolation point|isolation points}: the places where you shut off a source and can fit a lock. On both he fits his own lock, with a tag with his name.' },
    { nl: 'Het slot houdt de schakelaar echt op uit, het label vertelt wie er bezig is. Een label zonder slot telt niet.',
      en: 'The lock really keeps the switch off, the tag tells who is working. A tag without a lock does not count.' },
  ],
  [ // s4 with more people
    { nl: 'Werken er meer mensen aan de pers, zoals bij een grote matrijswissel? Dan gaan de sleutels van de sloten op de scheidingspunten in een {t:Groepsslotkast|groepsslotkast}.',
      en: 'Are more people working on the press, as in a big die change? Then the keys of the isolation locks go into a {t:Group lockbox|group lockbox}.' },
    { nl: 'Elke werker hangt zijn eigen, persoonlijke slot op die kast. Niet alleen de teamleider namens de ploeg: iedereen die erin grijpt, heeft zijn eigen slot.',
      en: 'Every worker puts his own personal lock on that box. Not just the team leader for the whole crew: everyone who reaches in has his own lock.' },
    { nl: 'Zo komen de sleutels pas vrij als de laatste werker zijn slot eraf heeft gehaald. Zolang er nog één iemand bezig is, kan de pers niet aan.',
      en: 'So the keys only come free when the last worker has taken his lock off. As long as one person is still working, the press cannot be switched on.' },
  ],
  [ // s5 block first, then bleed
    { nl: 'Nu de opgeslagen energie. Stap één: een mechanisch veiligheidsblok onder de opgetilde stoter. Zakt hij, dan komt hij op het blok te staan, en niet op een hand.',
      en: 'Now the stored energy. Step one: a mechanical safety block under the raised ram. If it comes down, it lands on the block, and not on a hand.' },
    { nl: 'Stap twee, en pas daarna: de hydraulische accumulator leeg laten lopen. Dat is een vat dat olie onder druk opslaat. Hij blijft onder druk, ook als de pomp stilstaat.',
      en: 'Step two, and only after that: bleed the hydraulic accumulator. That is a tank that stores oil under pressure. It stays under pressure, even when the pump has stopped.' },
    { nl: 'Hij draait het aftapventiel open en kijkt naar de manometer. De naald zakt, tot hij {n:0} bar aangeeft.',
      en: 'He opens the bleed valve and watches the gauge. The needle falls, until it reads {n:0} bar.' },
    { nl: 'Waarom deze volgorde? Laat je eerst de druk weg, dan kan de stoter zakken voordat het blok eronder staat. Oliedruk alleen houdt een last niet betrouwbaar omhoog: een klep kan lekken.',
      en: 'Why this order? Bleed the pressure first, and the ram can come down before the block is under it. Oil pressure alone does not hold a load up reliably: a valve can leak.' },
  ],
  [ // s6 proving zero energy
    { nl: 'Alles is gescheiden, vergrendeld en ontladen. Toch neemt hij het niet aan. Eerst doet hij de afscherming dicht: staat die open, dan houdt de beveiliging de pers vaak ook zonder slot tegen, en bewijst de proef niets. Dan drukt hij op de startknop. Er gebeurt niks.',
      en: 'Everything is isolated, locked and released. Still he does not assume it. First he closes the guard: with it open, the interlock often stops the press even without a lock, and the test proves nothing. Then he presses the start button. Nothing happens.' },
    { nl: 'Die startpoging, met de manometer op nul en het blok onder de stoter, bewijst dat de pers {t:Energieloos|energieloos} is. Bij elektrisch werk meet je ook dat er geen spanning meer op staat.',
      en: 'That start attempt, with the gauge at zero and the block under the ram, proves the press is at {t:Zero energy|zero energy}. For electrical work you also measure that no voltage is left.' },
    { nl: 'Daarna zet hij de bediening terug op uit, zodat er niets gebeurt als de energie terugkomt. Pas dan doet hij de afscherming open en grijpt hij naar binnen.',
      en: 'Then he sets the controls back to off, so nothing happens when the energy comes back. Only then does he open the guard and reach in.' },
    { nl: 'Beweegt er bij de test toch iets? Dan is er een bron vergeten, zoals een tweede persluchtvat, of is de verkeerde schakelaar gescheiden. Beter nu dan met je hand erin.',
      en: 'Does something move during the test after all? Then a source was missed, such as a second air tank, or the wrong switch was isolated. Better now than with your hand inside.' },
  ],
  [ // s7 restarting
    { nl: 'De nieuwe matrijs zit erin. Voor het opnieuw starten: gereedschap eruit, ook het veiligheidsblok, dan de afschermingen dicht, en iedereen uit de buurt van de pers. Rust de stoter op het blok, dan staat in de LOTO-procedure van de pers hoe het blok er veilig uit gaat.',
      en: 'The new die is in. Before restarting: tools out, the safety block too, then the guards closed, and everyone clear of the press. If the ram rests on the block, the press\'s LOTO procedure says how the block comes out safely.' },
    { nl: 'Dan de sloten. Alleen wie een slot heeft gehangen, haalt het eraf. De monteur haalt zijn eigen sloten weg en meldt de operators dat de pers weer kan draaien.',
      en: 'Then the locks. Only the person who fitted a lock removes it. The technician removes his own locks and tells the operators the press can run again.' },
    { nl: 'Is iemand naar huis met zijn slot er nog op? Dan gaat dat slot er alleen af volgens een strenge, schriftelijke procedure: die persoon proberen te bereiken, controleren dat de machine veilig is, en een leidinggevende laten beslissen. Nooit zomaar doorknippen.',
      en: 'Has someone gone home with his lock still on? Then that lock comes off only under a strict written procedure: try to reach that person, check the machine is safe, and let a manager decide. Never just cut it off.' },
    { nl: 'Werk je aan de elektrische installatie zelf, dan gelden daarnaast de vijf veiligheidsregels voor elektrisch werk. En vraag op elke vloer: mag ik de LOTO-procedure van deze machine zien?',
      en: 'If you work on the electrical installation itself, the five safety rules for electrical work apply as well. And ask on every floor: can I see the LOTO procedure for this machine?' },
  ],
];
// Each beat's reduced-motion still sits late in its own beat. The player places
// beats by the Dutch caption's words (beatStarts), the English gloss included, so
// the same count is made here; a beat may give its own fraction as stillAt.
{
  const tn = lessons.nl.get(LOTO).terms;
  const te = lessons.en.get(LOTO).terms;
  const wordsOf = (src) => src.replace(/\{t:([^|}]*)\|?([^}]*)\}/g, (m, term, shown) => {
    const i = tn.findIndex((x) => x.term.toLowerCase() === term.toLowerCase());
    return `${shown || term} (${te[i].term})`;
  }).replace(/\{n:([^}]*)\}/g, '$1').trim().split(/\s+/).length;
  for (const sc of spec.scenes) {
    const counts = sc.beats.map((b) => Math.max(1, wordsOf(b.nl)));
    const all = counts.reduce((a, b) => a + b, 0);
    let acc = 0;
    sc.beats.forEach((b, i) => {
      const a0 = acc / all;
      acc += counts[i];
      const a1 = acc / all;
      b.still = Math.round((a0 + (b.stillAt ?? 0.85) * (a1 - a0)) * 1000) / 1000;
      delete b.stillAt;
    });
  }
}
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
// The page needs the code only: the lathe module and the stage go in without
// their indentation, and without whole-line comments.
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const latheSource = lean(readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, ''));
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, prismOf, disc, sphereOf, arcOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.lt-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.lt-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.lt-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.lt-glass{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6}
.lt-level{fill:var(--anatomy-lo);stroke:none}
.lt-dial{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.4}
.lt-hole{fill:var(--anatomy-shade-0);stroke:none}
.lt-seam{fill:none;stroke:var(--anatomy-faint);stroke-width:.8}
.lt-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.lt-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.lt-shackle{fill:none;stroke:var(--anatomy-mid);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.lt-tag{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:.5}
.lt-stripe{fill:var(--anatomy-mid)}
.lt-key{fill:var(--anatomy-hi);stroke:var(--anatomy-lo);stroke-width:.3}
.lt-needle{fill:none;stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linecap:round}
.lt-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.lt-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.lt-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.lt-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.lt-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.lt-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.lt-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.lt-acc{fill:var(--fp-accent);stroke:none}
.lt-dimc{fill:var(--anatomy-lo);stroke:none}
.lt-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.lt-row{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-shade-0));stroke:var(--fp-accent);stroke-width:1.4}
.lt-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.lt-badge{fill:var(--fp-accent);stroke:none}
.lt-badgeT{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .lt-shackle,[data-cue][data-on] .lt-tag{stroke:var(--fp-accent)}
[data-cue][data-on] .lt-stripe{fill:var(--fp-accent)}
[data-cue][data-on] .lt-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .lt-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .lt-needle{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een werkvloer van links naar rechts: een groepsslotkast met hangsloten op een standaard, een besturingskast met een vergrendelbare hoofdschakelaar, een bedienpaneel met een noodstop, een startknop en een stopknop, een hydraulische pers met een bed, twee staanders, een kop met de hoofdcilinder, een stoter met de bovenste matrijs, de onderste matrijs op geleidekolommen en een scharnierende afscherming, een veiligheidsblok op de vloer, een persluchtpaneel met een vergrendelbare kraan en een filter-regelaar, en een hydraulisch aggregaat met een tank, een motor, een pomp en een accumulator met een aftapventiel en een manometer. Een monteur en twee operators. Grafieken tonen de energiebronnen, het LOTO-blad, de manometer, het bewijs van energieloos, de herstart en de vijf veiligheidsregels.',
  en: 'A shop floor from left to right: a group lockbox with padlocks on a stand, a control cabinet with a lockable main switch, an operator console with an emergency stop, a start button and a stop button, a hydraulic press with a bed, two uprights, a crown with the main cylinder, a ram with the upper die, the lower die on guide pillars and a hinged guard, a safety block on the floor, an air panel with a lockable valve and a filter-regulator, and a hydraulic power unit with a tank, a motor, a pump and an accumulator with a bleed valve and a gauge. A technician and two operators. Charts show the energy sources, the LOTO page, the gauge, the proof of zero energy, the restart and the five safety rules.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

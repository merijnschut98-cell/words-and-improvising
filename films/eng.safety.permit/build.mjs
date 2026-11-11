// Dev tool, not shipped. Builds the explainer film "Een vergunning en een LMRA
// op het dak / A permit and a last-minute risk check on the roof" for Veilig
// werken: the lessons eng.safety.permit (Scheiden, elektrisch werk en
// vergunningen, level 3) and eng.safety.lmra (Risico's en maatregelen, level 2),
// as the plan row lists. Both lesson ids still exist after the rebuild into
// topics x levels, so no mapping was needed.
//
//   node films/eng.safety.permit/build.mjs            build the page
//   node films/eng.safety.permit/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.safety.permit.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.safety). The scenes follow the day in time order, so the two jobs meet:
// the hot-work permit is issued and the welding starts (the permit lesson's
// faded example), the two technicians do their LMRA at the ladder and find the
// welder (the lmra lesson's worked example), the stop-work right, and the
// permit is closed at 14.30 with the fire watch staying, then the handover and
// Piper Alpha. The welders are the contractor of the lmra example.
//
// One flat factory roof: a parapet with a guardrail in the back left corner, a
// roof fan on its curb with its motor, a storage tank with a manhole (the
// confined space), a steel platform (bordes) with a handrail over a hydraulic
// power unit, a welding set on wheels with its cable, a fire extinguisher,
// puddles (it has rained), and a fixed ladder coming up over the front edge.
// Six people: the issuer, the holder (the welders' crew leader), the welder,
// the fire watch and two technicians. Cards in stage space carry the permit
// board, the permit, the work order, the LMRA questions, the VCA card, the
// stop-work right, permit against LMRA, the close-out and Piper Alpha; the
// cards with invented content are labelled "voorbeeld".
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
// The lessons' facts and worked examples, asserted against their current text
// (the build fails if a lesson drifts); {n:...} numbers are then checked against
// the Dutch lesson text by defineFilm. Times (8.00, 16.00, 14.30) and the year
// 1988 are written as plain text, because the number marker would format them
// as decimals or thousands (8,00 and 1.988); they are asserted here instead.
// Sources, as in the lessons: Arbowet article 29 (werkonderbreking: serious,
// immediate danger, pay kept, supervisor told at once, reported to the
// Nederlandse Arbeidsinspectie); VCA (Veiligheid, Gezondheid en Milieu Checklist
// Aannemers) as the origin of the LMRA; Piper Alpha, 6 July 1988, 167 dead (Cullen
// inquiry, 1990: a condensate pump restarted while its pressure safety valve was
// off for maintenance and the opening was closed only by a loosely fitted blind
// flange; the permit for that work was not passed on at shift change). How long
// the fire watch stays after hot work differs by site rule and insurer, so the
// film names no time, as the lesson does.
const PERMIT = 'eng.safety.permit';
const LMRA = 'eng.safety.lmra';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
// each word found after the one before it
const inOrder = (text, words) => { let from = 0; return words.every((w) => { const at = text.indexOf(w, from); if (at < 0) return false; from = at + w.length; return true; }); };
{
  const p = lessons.nl.get(PERMIT);
  const pe = lessons.en.get(PERMIT);
  const pt = p.teach.join('\n');
  assert(inOrder(pt, ['Heet werk: lassen, slijpen, snijden', 'besloten ruimte', 'tank of een put', 'werken op hoogte']), 'permit teach 1: hot work, confined space');
  assert(inOrder(pt, ['de precieze klus en plek', 'de gevaren', 'de scheidingen, met verwijzing naar de vergrendeling', 'gasmeting', 'de PBM', 'hoe lang hij geldig is', 'handtekeningen']), 'permit teach 2: what a permit holds');
  assert(inOrder(pt, ['De afgever, vaak van de operatie', 'bevestigt dat het klaar is', 'De houder, meestal de ploegleider', 'neemt de vergunning aan', 'houdt de vergunning bij de klus']), 'permit teach 2: issuer and holder');
  assert(inOrder(pt, ['persoonlijk overgedragen', 'geeft de houder hem terug', 'controleert de afgever het gebied', 'pas dan gaan de scheidingen eraf']), 'permit teach 3: handover and close');
  assert(inOrder(pt, ['Piper Alpha', 'in 1988 167 mensen om', 'veiligheidsklep', 'losse blindflens', 'bij de dienstwissel niet doorgegeven']), 'permit teach 3: Piper Alpha');
  assert(pe.teach.join('\n').includes('167 people died in 1988'), 'the English Piper Alpha line');
  assert(inOrder(pt, ['vervangt de LMRA niet', 'brandwacht', 'De bedrijfsregel bepaalt hoe lang', 'lassen naast een tank die iemand anders opent']), 'permit teach 4');
  const ex = p.example.text;
  assert(inOrder(ex, ['beugel lassen aan een stalen bordes boven een hydraulisch aggregaat', 'De afgever van productie en de ploegleider van de lassers lopen samen het gebied door', 'afgedekt binnen de afstand uit de bedrijfsregel', 'blusdeken', 'blusser binnen handbereik', 'brandwacht tijdens het werk', 'van 8.00 tot 16.00 uur', 'Allebei tekenen', 'Om 14.30 uur is het lassen klaar']), 'the permit example, in order');
  assert(inOrder(pe.example.text, ['from 08:00 to 16:00', 'At 14:30']), 'the English permit example times');
  assert(inOrder(p.example.reveal, ['brandwacht blijft de vastgestelde tijd', 'persoonlijk terug', 'loopt het gebied door', 'onder het bordes en rond het aggregaat', 'Pas dan sluit de afgever de vergunning af', 'pas daarna gaan de scheidingen eraf', 'verlengd of persoonlijk overgedragen']), 'the permit reveal, in order');
  const l = lessons.nl.get(LMRA);
  const lt = l.teach.join('\n');
  assert(inOrder(lt, ['laatste minuut risicoanalyse', 'vlak voor de start, door de mensen die het werk gaan doen', 'VCA', 'aannemer', 'werkorder']), 'lmra teach 1');
  assert(inOrder(lt, ['Weet ik wat ik moet doen en hoe?', 'Wat kan hier en nu misgaan?', 'Zijn de maatregelen uit de werkorder en de vergunning genomen?', 'goede gereedschap en de goede PBM', 'Hebben anderen om mij heen er last van?', 'nee of onduidelijk, dan begin je niet', 'één tot drie minuten', 'hardop']), 'lmra teach 2: the questions');
  assert(inOrder(lt, ['artikel 29 van de Arbowet', 'ernstig gevaar', 'Hij houdt zijn loon', 'leidinggevende meteen inlichten', 'Nederlandse Arbeidsinspectie', 'stopregel, ook bezoekers en aannemers', 'Stoppen is niet falen']), 'lmra teach 3: werkonderbreking');
  const lx = l.example.text;
  assert(inOrder(lx, ['Twee onderhoudsmonteurs', 'motor van een dakventilator vervangen', 'via de vaste ladder naar boven', 'Bij de ladder doen ze hun LMRA', 'nat en glad', 'aannemer lassen op hetzelfde dak', 'Ze beginnen niet', 'leidinggevende van de aannemer', 'lasvergunning heeft afgegeven', 'dakrand bij de ventilator een leuning heeft', 'Een uur later beginnen ze', 'aan de andere kant van het dak']), 'the lmra example, in order');
}

// ---------------------------------------------------------------- the world
// x to the right along the roof, y toward the viewer, z up; the roof is z = 0.
// Units of about 1 cm: the roof is 6.6 m by 2.8 m in view.
const W = 640;
const H = 400;
const ROOF = { x: -330, y: -150, w: 660, d: 280, r: 1 };
const FRONT = ROOF.y + ROOF.d; // the front edge
const PAR = 8; // parapet thickness
const PAR_Z = 24; // parapet height
const DECK = { x: 120, y: -100, w: 130, d: 95, r: 0.6 }; // the platform
const DECK_Z = 110;
const DECK_F = DECK.y + DECK.d; // its front edge
const WELD = [182, DECK_F + 1, 98]; // the weld spot under the front beam
const HPU = { x: 142, y: -82, w: 74, d: 42, r: 0.8 };
const MOTOR_Y = -60;
const TANK = [-30, -92, 36]; // storage tank: x, y, radius
const TANK_Z = 118;
const HOLE = [-20, -98]; // its manhole
const FAN = [-252, -92]; // roof fan
const LADDER_X = -210;
const EXT = [212, 26]; // the extinguisher
const SET = [272, 66]; // the welding set
const SPOT = {
  welder: [158, 24], fire: [238, 36], holderAt: [104, 56], issuerAt: [78, 70],
  start1: [-150, 104], start2: [-124, 104], m1: [-240, 104], m2: [-182, 104], fan1: [-262, -36], fan2: [-226, -40],
};
const PUDDLES = [[-120, 60, 30, 12], [-60, -10, 22, 9], [40, 92, 34, 11], [-280, 20, 20, 8], [80, -40, 18, 7], [300, 110, 18, 6]];
const C = { ROOF, FRONT, PAR_Z, DECK, DECK_Z, WELD, HPU, MOTOR_Y, TANK, TANK_Z, HOLE, FAN, LADDER_X, EXT, SET, SPOT };

const FIT = [[ROOF.x, ROOF.y, 0], [ROOF.x + ROOF.w, FRONT, 0], [ROOF.x, FRONT, -40], [ROOF.x + ROOF.w, FRONT, -40], [ROOF.x, ROOF.y, 120], [DECK.x + DECK.w, DECK.y, 210], [-30, -92, 150]];
const P = k.fitProjection(FIT, W, H, { pad: 6, azimuth: 50, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 16, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const alongY = (x, z, y0, y1, r, style = {}, steps) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'pm-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const led = (key, p, r = 0.8) => { const [x, y] = at(p); return `<circle class="pm-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };
// a flat ellipse on the roof (a puddle, a disc on a top)
const ellipse = (cx, cy, rx, ry, z, n = 24) => k.pathOf(Array.from({ length: n }, (_, i) => at([cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI), z])), true);
// a bar between two points (rails, rungs): a thin box along x or y
const barX = (x0, x1, y, z, t = 2, style = {}) => box({ x: x0, y: y - t / 2, w: x1 - x0, d: t, r: 0.3 }, z - t / 2, z + t / 2, style, 0);
const barY = (y0, y1, x, z, t = 2, style = {}) => box({ x: x - t / 2, y: y0, w: t, d: y1 - y0, r: 0.3 }, z - t / 2, z + t / 2, style, 0);
const postSq = (x, y, z0, z1, t = 3, style = {}) => box({ x: x - t / 2, y: y - t / 2, w: t, d: t, r: 0.3 }, z0, z1, style, 0);

// ---------------------------------------------------------------- the roof
const roof = (() => {
  let out = box(ROOF, -40, 0, { tone: 'lo', inner: seam(ROOF, -6, 2) }, 0.4, 1);
  // bitumen roofing: overlapping strips across the roof, edge to edge
  out += L(Array.from({ length: 6 }, (_, i) => k.lineOnTop([ROOF.x + 100 * (i + 1) - 10, ROOF.y + PAR], [ROOF.x + 100 * (i + 1) - 10, FRONT], 0, P)).join(''), { tone: 'faint' });
  // a roof drain with its grate, and the front edge trim
  out += `<path class="pm-hole" d="${ellipse(140, 96, 7, 7, 0.1, 16)}"/>` + L([-4, 0, 4].map((d) => k.lineOnTop([136, 96 + d], [144, 96 + d], 0.2, P)).join(''), { tone: 'lo' });
  out += box({ x: ROOF.x, y: FRONT - 4, w: ROOF.w, d: 4, r: 0.2 }, 0, 5, {}, 0.2);
  // the parapet along the back and the left edge, with its coping
  out += box({ x: ROOF.x, y: ROOF.y, w: ROOF.w, d: PAR, r: 0.3 }, 0, PAR_Z, { inner: seam({ x: ROOF.x, y: ROOF.y, w: ROOF.w, d: PAR }, PAR_Z - 4, 1) }, 0.3, 1);
  out += box({ x: ROOF.x, y: ROOF.y + PAR, w: PAR, d: ROOF.d - PAR - 4, r: 0.3 }, 0, PAR_Z, { inner: seam({ x: ROOF.x, y: ROOF.y + PAR, w: PAR, d: ROOF.d - PAR - 4 }, PAR_Z - 4, 1) }, 0.3, 1);
  // the hall's front wall under the edge: cladding seams down the face
  out += L(Array.from({ length: 16 }, (_, i) => k.segment([ROOF.x + 20 + i * 40, FRONT, -6], [ROOF.x + 20 + i * 40, FRONT, -40], P)).join(''), { tone: 'faint' });
  return out;
})();
const puddles = cue('wet', PUDDLES.map(([x, y, rx, ry]) => `<path class="pm-wet" d="${ellipse(x, y, rx, ry, 0.15)}"/>`).join(''));

// ---------------------------------------------------------------- the guardrail by the fan (on the parapet)
// Drawn by the stage when the page opens (stage.js), as the people and the
// fixed ladder are: thin posts and bars cost many bytes as static paths.
const rail = g('railBody', '');

// ---------------------------------------------------------------- the roof fan on its curb
const fan = (() => {
  const [x, y] = FAN;
  const CURB = { x: x - 32, y: y - 32, w: 64, d: 64, r: 1 };
  let out = halo(k.insetPlan(CURB, -3), 0, 2);
  out += box(CURB, 0, 30, { tone: 'lo', inner: seam(CURB, 26, 2) }, 0.4, 1) + box(k.insetPlan(CURB, -2), 30, 33, {}, 0.3) + screws(k.insetPlan(CURB, -2), 33, 3);
  out += post(x, y, 26, 33, 38, {}, 18, 0.6);
  out += post(x, y, 24, 38, 74, { inner: L(k.sideArc(x, y, 24, 56, P, 16), { tone: 'faint' }) }, 18);
  out += post(x, y, 25, 74, 77, {}, 18, 0.4);
  // the hood on four struts, then its rain cap
  out += [[-14, -14], [14, -14], [-14, 14], [14, 14]].map(([dx, dy]) => postSq(x + dx, y + dy, 77, 88, 2)).join('');
  out += S(k.cylinder(x, y, 36, 88, 6, P, 22, 2), { tone: 'hi', crease: 'lo' }) + S(k.cylinder(x, y, 30, 94, 5, P, 22, 4), { tone: 'hi', crease: 'lo' });
  // the motor on its bracket at the front, with the terminal box and a type plate
  out += cue('motor', box({ x: x - 8, y: y + 22, w: 16, d: 8, r: 0.4 }, 40, 46, { tone: 'lo' }, 0.2)
    + alongY(x, 56, y + 26, y + 46, 9, {}, 16) + alongY(x, 56, y + 46, y + 49, 6, { tone: 'lo' }, 14)
    + box({ x: x - 5, y: y + 30, w: 10, d: 8, r: 0.4 }, 64, 70, {}, 0.3) + led('fan', [x, y + 38, 70.2], 0.8));
  out += card(CURB.y + CURB.d, x - 22, x - 10, 8, 18) + rules(x - 21, CURB.y + CURB.d, 15.5, [9, 7, 8], 2);
  return out;
})();

// ---------------------------------------------------------------- the storage tank: the confined space
const tank = (() => {
  const [x, y, r] = TANK;
  let out = halo({ x: x - r - 2, y: y - r - 2, w: 2 * r + 4, d: 2 * r + 4, r: r + 2 }, 0, 3);
  out += [0, 1, 2, 3].map((i) => { const a = (i / 4) * 2 * Math.PI + 0.6; return box({ x: x + (r - 4) * Math.cos(a) - 4, y: y + (r - 4) * Math.sin(a) - 4, w: 8, d: 8, r: 0.4 }, 0, 6, { tone: 'lo' }, 0.2); }).join('');
  out += post(x, y, r, 6, TANK_Z, { inner: L(k.sideArc(x, y, r, 40, P, 28) + k.sideArc(x, y, r, 80, P, 28), { tone: 'faint' }) }, 30);
  out += S(k.cylinder(x, y, r, TANK_Z, 8, P, 30, 6), { tone: 'mid' });
  // the manhole collar on top; its lid (stage-moved) and a vent pipe
  out += post(HOLE[0], HOLE[1], 11, TANK_Z + 6, TANK_Z + 12, { tone: 'lo' }, 18, 0.4);
  out += `<path class="pm-hole" d="${ellipse(HOLE[0], HOLE[1], 8.5, 8.5, TANK_Z + 12.05, 18)}"/>`;
  out += post(x - 18, y + 4, 2.4, TANK_Z + 6, TANK_Z + 30, { tone: 'hi', crease: 'lo' }, 12) + alongX(y + 4, TANK_Z + 30, x - 18, x - 10, 2.4, { tone: 'hi', crease: 'lo' }, 12);
  // a plate on the shell: the sign at the manhole ("besloten ruimte")
  out += `<path class="pm-card" d="${k.pathOf([[x - 10, y + r + 0.4, 74], [x + 10, y + r + 0.4, 74], [x + 10, y + r + 0.4, 88], [x - 10, y + r + 0.4, 88]].map(at), true)}"/>` + rules(x - 8, y + r + 0.5, 85, [14, 10, 12], 2.4);
  return out;
})();
const lid = post(HOLE[0], HOLE[1], 10, TANK_Z + 12, TANK_Z + 14, { tone: 'hi', crease: 'lo' }, 18, 0.5) + Dt([at([HOLE[0], HOLE[1] + 4, TANK_Z + 14])], { size: 0.5 });

// ---------------------------------------------------------------- the hydraulic power unit under the platform
const hpu = (() => {
  let out = halo(k.insetPlan(HPU, -3), 0, 2);
  out += k.corners(HPU, 5).map(([x, y]) => box({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.4 }, 0, 4, { tone: 'lo' }, 0.2)).join('');
  out += box(HPU, 4, 38, { tone: 'lo', inner: seam(HPU, 34, 2) + seam(HPU, 9, 2) }, 0.5, 1) + screws(HPU, 38, 3);
  out += card(HPU.y + HPU.d, 150, 154, 12, 30, 'pm-glass');
  out += box({ x: 158, y: -76, w: 30, d: 20, r: 0.6 }, 38, 42, { tone: 'lo' }, 0.2);
  out += alongX(MOTOR_Y, 54, 154, 186, 11, {}, 16);
  out += L([160, 166, 172, 178].map((xx) => k.pathOf(Array.from({ length: 13 }, (_, i) => { const a = -0.2 + (i / 12) * 3.4; return at([xx, MOTOR_Y + 11.2 * Math.cos(a), 54 + 11.2 * Math.sin(a)]); }))).join(''), { tone: 'faint' });
  out += alongX(MOTOR_Y, 54, 186, 196, 8, {}, 16) + alongX(MOTOR_Y, 54, 196, 206, 6, { tone: 'hi', crease: 'lo' }, 14);
  out += box({ x: 164, y: MOTOR_Y - 6, w: 12, d: 10, r: 0.5 }, 64, 70, {}, 0.3) + led('hpu', [170, MOTOR_Y + 4, 70.2], 0.7);
  return out;
})();
// the fire blanket over the unit (shown from scene 2): a draped sheet with fold lines
const blanket = (() => {
  const B = { x: HPU.x - 4, y: HPU.y - 4, w: HPU.w + 8, d: HPU.d + 8, r: 2 };
  let out = S(k.slabOf({ ...B, r: 6 }, 0, 70, P, 6, 5), { tone: 'mid', crease: 'lo', className: 'pm-blanket' });
  // folds down the front and the side, a sag across the top and the hem
  out += L([0.2, 0.45, 0.7, 0.9].map((f) => k.segment([B.x + f * B.w, B.y + B.d, 64], [B.x + f * B.w + 3, B.y + B.d, 3], P)).join('')
    + [0.3, 0.7].map((f) => k.segment([B.x + B.w, B.y + f * B.d, 64], [B.x + B.w, B.y + f * B.d + 2, 3], P)).join('')
    + k.lineOnTop([B.x + 10, B.y + B.d / 2], [B.x + B.w - 10, B.y + B.d / 2 + 4], 70, P), { tone: 'lo' });
  return out;
})();

// ---------------------------------------------------------------- the steel platform (bordes)
const legs = k.corners(DECK, 3);
const bordes = { back: '', front: '' };
{
  const leg = ([x, y]) => halo({ x: x - 4, y: y - 4, w: 8, d: 8, r: 1 }, 0, 1) + box({ x: x - 5, y: y - 5, w: 10, d: 10, r: 0.3 }, 0, 2, { tone: 'lo' }, 0.1) + postSq(x, y, 2, DECK_Z - 6, 5);
  bordes.back = legs.filter(([, y]) => y < 0 - 50).map(leg).join('')
    // a diagonal brace on the back
    + L(k.segment([DECK.x + 3, DECK.y + 3, 10], [DECK.x + DECK.w - 3, DECK.y + 3, DECK_Z - 10], P), { tone: 'mid' });
  const BEAM = { x: DECK.x, y: DECK.y, w: DECK.w, d: DECK.d };
  bordes.front = legs.filter(([, y]) => y > -50).map(leg).join('')
    + box(BEAM, DECK_Z - 8, DECK_Z, { inner: seam(BEAM, DECK_Z - 4, 1) }, 0.3, 1)
    // the grating on the deck: bars edge to edge
    + L(Array.from({ length: 12 }, (_, i) => k.lineOnTop([DECK.x + 4 + i * 11, DECK.y + 2], [DECK.x + 4 + i * 11, DECK_F - 2], DECK_Z, P)).join(''), { tone: 'faint' })
    // the handrail on the back and the right edge, with knee rail and toe board
    + [0, 1, 2, 3].map((i) => postSq(DECK.x + 3 + i * 41.3, DECK.y + 2, DECK_Z, DECK_Z + 100, 3)).join('')
    + [1, 2].map((i) => postSq(DECK.x + DECK.w - 3, DECK.y + 2 + i * 45, DECK_Z, DECK_Z + 100, 3)).join('')
    + [50, 98].map((z) => barX(DECK.x + 3, DECK.x + DECK.w - 3, DECK.y + 2, DECK_Z + z, 2.6) + barY(DECK.y + 2, DECK_F - 2, DECK.x + DECK.w - 3, DECK_Z + z, 2.6)).join('')
    + box({ x: DECK.x + 1, y: DECK.y + 1, w: DECK.w - 2, d: 2, r: 0.2 }, DECK_Z, DECK_Z + 10, { tone: 'lo' }, 0.1)
    // a short ladder up at the front left
    + postSq(DECK.x - 6, DECK_F - 6, 0, DECK_Z + 40, 3) + postSq(DECK.x - 6, DECK_F - 30, 0, DECK_Z + 40, 3)
    + Array.from({ length: 4 }, (_, i) => barY(DECK_F - 30, DECK_F - 6, DECK.x - 6, 22 + i * 26, 2)).join('');
}
// the bracket being welded under the front beam, and the weld bead
const bracket = box({ x: WELD[0] - 6, y: DECK_F, w: 12, d: 6, r: 0.3 }, WELD[2] - 14, DECK_Z - 8, { tone: 'hi', crease: 'lo' }, 0.2) + Dt([at(WELD)], { size: 0.5 });

// ---------------------------------------------------------------- the welding set, its cable and the extinguisher
const weldSet = (() => {
  const [x, y] = SET;
  const B = { x: x - 14, y: y - 9, w: 28, d: 18, r: 1 };
  let out = halo(k.insetPlan(B, -3), 0, 2);
  out += alongY(x - 10, 6, y - 11, y - 9, 6, { tone: 'lo' }, 14) + alongY(x + 10, 6, y - 11, y - 9, 6, { tone: 'lo' }, 14);
  out += box(B, 6, 40, { inner: seam(B, 36, 1.4) }, 0.4, 1) + screws(B, 40, 2);
  out += card(B.y + B.d, x - 10, x + 2, 26, 34, 'pm-screen') + led('set', [x + 7, B.y + B.d, 30], 0.9);
  out += [x - 6, x - 1, x + 4].map((xx) => post(xx, B.y + B.d + 0.4, 1.4, 14, 15, { tone: 'lo' }, 10)).join('');
  out += alongY(x - 10, 6, y + 9, y + 11, 6, { tone: 'lo' }, 14) + alongY(x + 10, 6, y + 9, y + 11, 6, { tone: 'lo' }, 14);
  out += postSq(x - 12, y, 40, 52, 2) + postSq(x + 12, y, 40, 52, 2) + barX(x - 12, x + 12, y, 52, 2.4, { tone: 'hi', crease: 'lo' });
  return out;
})();
const extinguisher = (() => {
  const [x, y] = EXT;
  let out = halo({ x: x - 6, y: y - 6, w: 12, d: 12, r: 6 }, 0, 1.4);
  out += post(x, y, 5.6, 0, 3, { tone: 'lo' }, 12, 0.6) + post(x, y, 5.2, 3, 38, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(x, y, 5.2, 30, P, 10), { tone: 'faint' }) }, 12);
  out += S(k.cylinder(x, y, 5.2, 38, 4, P, 12, 3), { tone: 'hi', crease: 'lo' }) + post(x, y, 1.6, 42, 46, {}, 10);
  out += box({ x: x - 1, y: y - 4, w: 2, d: 8, r: 0.2 }, 46, 48, { tone: 'lo' }, 0.1);
  out += k.wireSvg(at([x + 1, y + 2, 45]), at([x + 5.4, y + 2, 12]), { via: [at([x + 6, y + 3, 40])], tone: 'lo', size: 0.9, ends: 'both' });
  out += card(y + 5.3, x - 3, x + 3, 16, 26);
  return out;
})();

// ---------------------------------------------------------------- the fixed ladder over the front edge (drawn by the stage)
const ladder = g('ladderBody', '');

// ---------------------------------------------------------------- people
// Six standing figures, drawn by the stage when the page opens (stage.js),
// which keeps the page small; the welding cable and the sparks are drawn live.
const people = ['welder', 'fire', 'holder', 'issuer', 'mech1', 'mech2']
  .map((key) => g(key, cue({ mech1: 'mechs', mech2: 'mechs', issuer: 'issuer', holder: 'holder', fire: 'firewatch', welder: 'welder' }[key], g(key + 'Body', '')))).join('');

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('board', '', ' data-cue="board"'),
  g('doc', '', ' data-cue="doc"'),
  g('order', '', ' data-cue="order"'),
  g('lmra', '', ' data-cue="lmra"'),
  g('vca', '', ' data-cue="vca"'),
  g('stop', '', ' data-cue="stop"'),
  g('plan', ''),
  g('close', '', ' data-cue="close"'),
  g('piper', '', ' data-cue="piper"'),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('roof', roof + puddles),
  cue('rail', rail),
  cue('fan', fan),
  cue('tank', tank + g('lid', lid)),
  bordes.back,
  cue('hpu', hpu),
  g('blanket', cue('blanket', blanket), ' style="display:none"'),
  bordes.front,
  cue('weld', bracket + g('sparks', '')),
  g('ext', cue('ext', extinguisher), ' style="display:none"'),
  g('cable', ''),
  people,
  weldSet,
  ladder,
].join('');

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
if (process.argv.includes('--sizes')) for (const [n, v] of Object.entries({ roof, puddles, rail, fan, tank, lid, hpu, blanket, bb: bordes.back, bf: bordes.front, bracket, weldSet, extinguisher, ladder })) console.log(n, (compact(v).length / 1024).toFixed(1));
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- the film
const DUR = [36, 40, 30, 40, 40, 34, 40];
const spec = {
  id: 'eng.safety.permit',
  title: { nl: 'Een vergunning en een LMRA op het dak', en: 'A permit and a last-minute risk check on the roof' },
  lessons: [PERMIT, LMRA],
  scenes: [
    {
      id: 's1', lesson: PERMIT, level: 3, dur: DUR[0], still: 0.9, title: { nl: 'Twee klussen op één dak', en: 'Two jobs on one roof' },
      beats: [
        { nl: 'Het platte dak van een onderdelenfabrikant. Vandaag staan hier twee klussen gepland.', en: 'The flat roof of a parts manufacturer. Two jobs are planned here today.', cues: ['fan', 'weld'] },
        { nl: 'Niet-routinematig werk met een hoog risico vraagt een {t:Werkvergunning|werkvergunning}.', en: 'Non-routine, high-risk work needs a {t:Permit to work|permit to work}.', cue: { Werkvergunning: 'board' } },
        { nl: '{t:Heet werk|Heet werk}: lassen, slijpen, snijden, alles wat vonken of vuur geeft.', en: '{t:Hot work|Hot work}: welding, grinding, cutting, anything that makes sparks or flame.', cue: { 'Heet werk': 'weld' }, cues: ['welder', 'board'] },
        { nl: 'Een {t:Besloten ruimte|besloten ruimte}, zoals deze tank: eerst een gasmeting.', en: 'A {t:Confined space|confined space}, like this tank: first a gas test.', cue: { 'Besloten ruimte': 'tank' }, cues: ['board'] },
      ],
    },
    {
      id: 's2', lesson: PERMIT, level: 3, dur: DUR[1], still: 0.9, title: { nl: 'Het gebied klaar', en: 'The area made ready' },
      beats: [
        { nl: 'Op de vergunning: de klus en de plek, de gevaren en de scheidingen.', en: 'On the permit: the job and the place, the hazards and the isolations.', cues: ['doc'] },
        { nl: 'Ook de metingen, de PBM en de geldigheid: vandaag 8.00–16.00 uur.', en: 'Also the tests, the PPE and how long it is valid: today 08:00–16:00.', cues: ['doc'] },
        { nl: 'De {t:Afgever|afgever} van productie loopt het gebied door met de ploegleider van de lassers.', en: 'The {t:Issuer|issuer} from production walks the area with the welding crew leader.', cue: { Afgever: 'issuer' }, cues: ['holder'] },
        { nl: 'Brandbaar spul weg, een blusdeken over het aggregaat, een blusser bij de hand.', en: 'Flammables cleared, a fire blanket over the power unit, an extinguisher at hand.', cues: ['blanket', 'ext'] },
        { nl: 'De afgever bevestigt dat het klaar is; de {t:Houder|houder} neemt de vergunning aan.', en: 'The issuer confirms it is ready; the {t:Holder|holder} accepts the permit.', cue: { Houder: 'holder' }, cues: ['doc', 'issuer'] },
      ],
    },
    {
      id: 's3', lesson: PERMIT, level: 3, dur: DUR[2], still: 0.9, title: { nl: 'Lassen met een brandwacht', en: 'Welding with a fire watch' },
      beats: [
        { nl: 'De lasser last een beugel aan het bordes. De vonken vallen naar beneden.', en: 'The welder welds a bracket to the platform. The sparks fall down.', cues: ['weld', 'welder'] },
        { nl: 'Een {t:Brandwacht|brandwacht} let alleen op brand, met een blusser bij de hand.', en: 'A {t:Fire watch|fire watch} only watches for fire, with an extinguisher at hand.', cue: { Brandwacht: 'firewatch' }, cues: ['ext'] },
        { nl: 'De houder houdt de vergunning bij de klus en geeft zijn ploeg uitleg.', en: 'The holder keeps the permit at the job and briefs his crew.', cues: ['holder'] },
      ],
    },
    {
      id: 's4', lesson: LMRA, level: 2, dur: DUR[3], still: 0.9, title: { nl: 'De LMRA bij de ladder', en: 'The LMRA at the ladder' },
      beats: [
        { nl: 'Twee monteurs komen de motor van de dakventilator vervangen.', en: 'Two technicians come to replace the motor of the roof fan.', cues: ['fan', 'mechs'] },
        { nl: 'Hun {t:Werkorder|werkorder}: welke klus waar, via de vaste ladder naar boven.', en: 'Their {t:Work order|work order}: which job where, up the fixed ladder.', cue: { Werkorder: 'order' } },
        { nl: 'Bij de ladder doen ze hun {t:LMRA|LMRA}: kort en hardop, vlak voor de start.', en: 'At the ladder they do their {t:LMRA|LMRA}: short and out loud, just before starting.', cue: { LMRA: 'mechs' } },
        { nl: 'Weet ik wat ik moet doen? Wat kan hier misgaan? Zijn de maatregelen genomen?', en: 'Do I know what to do? What can go wrong here? Are the measures in place?', cues: ['lmra'] },
        { nl: 'De LMRA komt uit de {t:VCA|VCA}: de veiligheidschecklist voor {t:Aannemer|aannemers}.', en: 'The LMRA comes from {t:VCA|VCA}: the safety checklist for {t:Contractor|contractors}.', cue: { VCA: 'vca', Aannemer: 'welder' } },
      ],
    },
    {
      id: 's5', lesson: LMRA, level: 2, dur: DUR[4], still: 0.9, title: { nl: 'Klopt het niet, dan begin je niet', en: 'If it is not right, you do not start' },
      beats: [
        { nl: 'Het dak is nat en glad. En daar last een aannemer: niet op hun werkorder.', en: 'The roof is wet and slippery. And a contractor is welding: not on their work order.', cues: ['wet', 'welder'] },
        { nl: 'Is een antwoord nee of onduidelijk, dan begin je niet.', en: 'If an answer is no or unclear, you do not start.', cues: ['lmra'] },
        { nl: 'Ze bellen de leidinggevende van de aannemer en de afgever van de lasvergunning.', en: 'They call the contractor’s supervisor and the issuer of the welding permit.', cues: ['mechs'] },
        { nl: 'Afspraak: de lasser blijft aan de andere kant, de dakrand bij de ventilator heeft een leuning.', en: 'Agreed: the welder stays at the other end, the roof edge by the fan has a guardrail.', cues: ['rail', 'welder'] },
        { nl: 'Twee vergunningen die elk kloppen, kunnen samen gevaar geven: lassen bij een open tank.', en: 'Two permits that each make sense can together be a hazard: welding by an open tank.', cues: ['tank', 'weld'] },
      ],
    },
    {
      id: 's6', lesson: LMRA, level: 2, dur: DUR[5], still: 0.9, title: { nl: 'Stilleggen mag', en: 'You may stop the work' },
      beats: [
        { nl: 'Ernstig, direct gevaar? Dan mag je het werk stilleggen: {t:Werkonderbreking|werkonderbreking}.', en: 'Serious, immediate danger? Then you may stop the work: the {t:Stop-work right|stop-work right}.', cue: { Werkonderbreking: 'stop' } },
        { nl: 'Arbowet artikel {n:29}: je houdt je loon en licht meteen je leidinggevende in.', en: 'Arbowet article {n:29}: you keep your pay and tell your supervisor right away.', cues: ['stop'] },
        { nl: 'Veel bedrijven geven iedereen een stopregel, ook bezoekers en aannemers.', en: 'Many sites give everyone a stop rule, visitors and contractors too.', cues: ['mechs'] },
        { nl: 'De vergunning legt het plan vast; de LMRA checkt het ter plaatse.', en: 'The permit sets the plan; the LMRA checks it on the spot.', cues: [] },
      ],
    },
    {
      id: 's7', lesson: PERMIT, level: 3, dur: DUR[6], still: 0.9, title: { nl: 'Afsluiten en overdragen', en: 'Closing and handing over' },
      beats: [
        { nl: 'Om 14.30 uur is het lassen klaar. De brandwacht blijft de vastgestelde tijd.', en: 'At 14:30 the welding is done. The fire watch stays for the set time.', cues: ['firewatch', 'close'] },
        { nl: 'De houder geeft de vergunning persoonlijk terug; de afgever loopt het gebied na.', en: 'The holder hands the permit back in person; the issuer walks the area again.', cues: ['holder', 'issuer'] },
        { nl: 'Pas dan sluit de afgever hem af, en gaan de scheidingen van het aggregaat eraf.', en: 'Only then does the issuer close it, and the isolations come off the power unit.', cues: ['hpu'] },
        { nl: 'Bij een dienstwissel draag je een open vergunning persoonlijk over.', en: 'At shift change you hand an open permit over in person.', cues: ['close'] },
        { nl: 'Piper Alpha, 1988: zo’n overdracht ging mis. {n:167} mensen kwamen om.', en: 'Piper Alpha, 1988: such a handover failed. {n:167} people died.', cues: ['piper'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces both lessons' text,
// so it explains fully. No "/", "&" or "%" in the spoken text; times are said as
// words. Loanwords and compounds were checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex): LMRA and VCA are read as words ("lmraa",
// "vkaa"), Piper Alpha with the Dutch i, and blusdeken, gasmeting, dienstwissel,
// dakventilator and controlekamer get their stress or vowels wrong; Dutch-only
// SAY rules in films/_kit/timeline.mjs fix them. Kept out of the Dutch
// narration: nachtdienst (espeak-ng drops the d), Noordzee and
// vergunningenbord (wrong vowels).
const SAY = [
  [ // s1 two jobs on one roof
    { nl: 'Het platte dak van een onderdelenfabrikant. Vandaag staan hier twee klussen gepland.',
      en: 'The flat roof of a parts manufacturer. Two jobs are planned here today.' },
    { nl: 'Niet-routinematig werk met een hoog risico vraagt een {t:Werkvergunning|werkvergunning}: de gevaren bekend, het gebied klaar, en duidelijk wie de leiding heeft. Ze hangen op een bord in de controlekamer.',
      en: 'Non-routine, high-risk work needs a {t:Permit to work|permit to work}: the hazards known, the area ready, and clear who is in control. Open permits hang on a board in the control room.' },
    { nl: 'De eerste klus is {t:Heet werk|heet werk}: alles wat vonken of vuur geeft, zoals lassen, slijpen of snijden. Lassers van een aannemer lassen een beugel aan het bordes.',
      en: 'The first job is {t:Hot work|hot work}: anything that makes sparks or flame, such as welding, grinding or cutting. Welders from a contractor weld a bracket to the platform.' },
    { nl: 'Ook een {t:Besloten ruimte|besloten ruimte}, zoals deze tank met zijn smalle toegang, vraagt een vergunning. Er kan te weinig zuurstof in zijn, of giftig of brandbaar gas, en dat zie je niet. Dus eerst een gasmeting.',
      en: 'A {t:Confined space|confined space}, like this tank with its narrow way in, needs a permit too. It can hold too little oxygen, or toxic or flammable gas, and you cannot see that. So first a gas test.' },
  ],
  [ // s2 the area made ready
    { nl: 'Op de vergunning staan de klus en de plek, de gevaren, en de scheidingen, met een verwijzing naar de vergrendeling op elk scheidingspunt.',
      en: 'The permit lists the job and the place, the hazards, and the isolations, with a reference to the lockout on every isolation point.' },
    { nl: 'Verder de metingen, de PBM, de geldigheid, vandaag van acht tot zestien uur, en de handtekeningen.',
      en: 'Then the tests, the PPE, how long it is valid, today from eight to four, and the signatures.' },
    { nl: 'De {t:Afgever|afgever} van productie gaat over dit gebied. Hij loopt het door met de ploegleider van de lassers; tekenen zonder te kijken gaat vaak mis.',
      en: 'The {t:Issuer|issuer} from production controls this area. He walks it with the welding crew leader; signing without looking often goes wrong.' },
    { nl: 'Brandbaar materiaal gaat weg of wordt afgedekt, binnen de afstand uit de bedrijfsregel. Over het aggregaat komt een blusdeken, en een blusser binnen handbereik.',
      en: 'Flammable material is removed or covered, within the distance in the site rule. A fire blanket goes over the power unit, and an extinguisher within reach.' },
    { nl: 'Dan tekent de afgever: het gebied is klaar. De ploegleider is de {t:Houder|houder}: hij neemt de vergunning aan en tekent ook.',
      en: 'Then the issuer signs: the area is ready. The crew leader is the {t:Holder|holder}: he accepts the permit and signs too.' },
  ],
  [ // s3 welding with a fire watch
    { nl: 'De lasser last de beugel onder het bordes; de vonken vallen op het dak.',
      en: 'The welder welds the bracket under the platform; the sparks fall onto the roof.' },
    { nl: 'Naast hem staat de {t:Brandwacht|brandwacht}: iemand die alleen op brand let, met de blusser bij de hand.',
      en: 'Next to him stands the {t:Fire watch|fire watch}: someone who only watches for fire, with the extinguisher at hand.' },
    { nl: 'De houder houdt de vergunning bij de klus en geeft zijn ploeg uitleg.',
      en: 'The holder keeps the permit at the job and briefs his crew.' },
  ],
  [ // s4 the LMRA at the ladder
    { nl: 'Dan de tweede klus: twee monteurs komen de motor van de dakventilator vervangen.',
      en: 'Then the second job: two technicians come to replace the motor of the roof fan.' },
    { nl: 'Op hun {t:Werkorder|werkorder} staat welke klus waar moet gebeuren, met welke maatregelen: via de vaste ladder naar boven. Over een lasser staat er niets.',
      en: 'Their {t:Work order|work order} says which job to do where, with which measures: up the fixed ladder. It says nothing about a welder.' },
    { nl: 'Bij de ladder doen ze hun {t:LMRA|LMRA}, de laatste minuut risicoanalyse: een korte check, vlak voor de start, door wie het werk doet. Eén tot drie minuten, hardop.',
      en: 'At the ladder they do their {t:LMRA|LMRA}, the last-minute risk analysis: a short check, just before starting, by the people doing the work. One to three minutes, out loud.' },
    { nl: 'Weet ik wat ik moet doen, en hoe? Wat kan hier en nu misgaan? Zijn de maatregelen genomen? Heb ik het goede gereedschap en de PBM? Hebben anderen er last van?',
      en: 'Do I know what to do, and how? What can go wrong here and now? Are the measures in place? Do I have the right tools and PPE? Are others affected?' },
    { nl: 'De LMRA komt uit de {t:VCA|VCA}, de Nederlandse veiligheidschecklist en het certificaat voor {t:Aannemer|aannemers}: bedrijven die je inhuurt om op jouw terrein te werken.',
      en: 'The LMRA comes from {t:VCA|VCA}, the Dutch safety checklist and certificate for {t:Contractor|contractors}: firms hired to work on your site.' },
  ],
  [ // s5 if it is not right, you do not start
    { nl: 'Het heeft geregend: het dak is nat en glad. En ze horen een aannemer lassen op hetzelfde dak, wat niet op hun werkorder stond.',
      en: 'It has rained, so the roof is wet and slippery. And they hear a contractor welding on the same roof, which was not on their work order.' },
    { nl: 'De LMRA vangt wat er sinds de planning veranderd is. Is een antwoord nee of onduidelijk, dan begin je niet.',
      en: 'The LMRA catches what has changed since the planning. If an answer is no or unclear, you do not start.' },
    { nl: 'Ze bellen de leidinggevende van de aannemer, en de afgever van de lasvergunning.',
      en: 'They call the contractor’s supervisor, and the issuer of the welding permit.' },
    { nl: 'Ze spreken af dat de lasser aan de andere kant blijft, en checken de leuning op de dakrand bij de ventilator. Een uur later beginnen ze.',
      en: 'They agree that the welder stays at the other end, and check the guardrail on the roof edge by the fan. An hour later they start.' },
    { nl: 'Klussen in één gebied stem je dus af: twee vergunningen die elk kloppen, kunnen samen gevaar geven.',
      en: 'So jobs in one area are coordinated: two permits that each make sense can together create a hazard.' },
  ],
  [ // s6 you may stop the work
    { nl: 'Is er naar je redelijk oordeel ernstig gevaar, zo direct dat je niet op de inspectie kunt wachten? Dan mag je het werk stilleggen: {t:Werkonderbreking|werkonderbreking}.',
      en: 'Is there, in your reasonable judgement, serious danger so immediate that you cannot wait for the inspectorate? Then you may stop the work: the {t:Stop-work right|stop-work right}.' },
    { nl: 'Dat staat in artikel {n:29} van de Arbowet. Je houdt je loon, licht meteen je leidinggevende in, en de onderbreking wordt snel gemeld bij de Arbeidsinspectie.',
      en: 'It is in article {n:29} of the Arbowet. You keep your pay, tell your supervisor right away, and the stop is reported to the Netherlands Labour Authority as soon as possible.' },
    { nl: 'Veel bedrijven geven iedereen een stopregel, ook bezoekers en aannemers. Stoppen is niet falen; doorgaan terwijl je twijfelt wel. Wie stopt, wordt bedankt.',
      en: 'Many sites give everyone a stop rule, visitors and contractors too. Stopping is not failing; carrying on when unsure is. Whoever stops is thanked.' },
    { nl: 'Een vergunning vervangt de LMRA niet: de vergunning legt het plan vast, de LMRA controleert het ter plaatse. Een kaartje dat in twee seconden is getekend, checkt niks: benoem de risico’s samen, hardop. Wie per klus wordt afgerekend, slaat de LMRA als eerste over. De toets: wordt er na een LMRA weleens gestopt?',
      en: 'A permit does not replace the LMRA: the permit sets the plan, the LMRA checks it on the spot. A card signed in two seconds checks nothing: name the risks together, out loud. Crews measured or paid per job skip the LMRA first. The test: is work ever stopped after an LMRA?' },
  ],
  [ // s7 closing and handing over
    { nl: 'Om half drie is het lassen klaar. De brandwacht blijft de vastgestelde tijd, want smeulend materiaal kan later opvlammen; de bedrijfsregel zegt hoe lang.',
      en: 'At half past two the welding is done. The fire watch stays for the set time, because smouldering material can flare up later; the site rule says how long.' },
    { nl: 'De houder geeft de vergunning persoonlijk terug, en de afgever loopt het gebied na, ook onder het bordes.',
      en: 'The holder hands the permit back in person, and the issuer walks the area again, under the platform too.' },
    { nl: 'Pas dan sluit de afgever de vergunning af, en daarna gaan de scheidingen eraf en draait het aggregaat weer.',
      en: 'Only then does the issuer close the permit, and after that the isolations come off and the power unit runs again.' },
    { nl: 'Loopt een klus door in de volgende dienst, dan wordt de vergunning verlengd of persoonlijk overgedragen.',
      en: 'If a job runs into the next shift, the permit is extended or handed over in person.' },
    { nl: 'Op Piper Alpha, een olieplatform, ging dat in 1988 mis. Een pomp in onderhoud, zonder veiligheidsklep, werd gestart, want de vergunning was bij de dienstwissel niet doorgegeven. Er kwamen {n:167} mensen om.',
      en: 'On Piper Alpha, an oil platform, this went wrong in 1988. A pump under maintenance, without its safety valve, was started, because the permit had not been passed on at shift change. {n:167} people died.' },
  ],
];

// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
const resolved = resolveFilm(spec, lessons);
const FR = resolved.scenes.map((rs) => beatStarts(rs, 'nl').map((x) => Math.round((x / rs.dur) * 1000) / 1000));
resolved.scenes.forEach((rs, si) => {
  spec.scenes[si].beats.forEach((b, bi) => {
    const a0 = FR[si][bi];
    const a1 = bi + 1 < FR[si].length ? FR[si][bi + 1] : 1;
    b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
  });
});
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx, sy): world point p lands at stage (sx, sy) in a view w wide
const cam = (p, w, sx = W / 2, sy = H / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round((y + (H / 2 - sy) * (w / W)) * 10) / 10, w]; };
const MID = [0, -10, 40];
const BORDES = [180, -20, 70];
const LADDER = [LADDER_X, 90, 60];
const CAM = [
  { from: cam(MID, 660), to: cam(MID, 620, 360, 180), a: FR[0][1] - 0.04, b: FR[0][1] + 0.08 },
  { from: cam(BORDES, 470, 520, 210), to: cam(BORDES, 450, 530, 215) },
  { from: cam(BORDES, 380), to: cam(BORDES, 340, 330, 210) },
  { from: cam(LADDER, 400, 470, 220), to: cam(MID, 640, 360, 160), a: FR[3][4] - 0.03, b: FR[3][4] + 0.07 },
  { from: cam(MID, 640), to: cam(MID, 620) },
  { from: cam(MID, 720, 340, 196), to: cam(MID, 700, 340, 192) },
  { from: cam(BORDES, 480, 520, 220), to: cam(MID, 640, 320, 140), a: FR[6][4] - 0.03, b: FR[6][4] + 0.05 },
];
C.dur = DUR;
C.FR = FR;

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const latheSource = lean(readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, ''));
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, prismOf, disc, sphereOf, arcOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.pm-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.pm-glass{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6}
.pm-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-wet{fill:color-mix(in srgb,var(--anatomy-shade-0) 70%,var(--anatomy-mid));stroke:var(--anatomy-faint);stroke-width:.6}
[data-cue][data-on] .pm-wet{fill:color-mix(in srgb,var(--fp-accent) 30%,var(--anatomy-shade-0));stroke:var(--fp-accent)}
.pm-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.pm-spark{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-linecap:round}
.pm-blanket .iso-top{fill:var(--anatomy-shade-2)}
[data-cue][data-on] .pm-spark{stroke:var(--fp-accent)}
.pm-arc{fill:var(--anatomy-hi)}
.pm-glow{fill:var(--anatomy-hi);opacity:.4}
.pm-visor{fill:var(--anatomy-strong);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-torch{fill:none;stroke:var(--anatomy-lo);stroke-width:2.8;stroke-linecap:round}
.pm-nozzle{stroke:var(--anatomy-strong);stroke-width:3.4}
.pm-cable{fill:none;stroke:var(--anatomy-lo);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.pm-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pm-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.pm-row{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-shade-0));stroke:var(--fp-accent);stroke-width:1.4}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-sig{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-rule{fill:none;stroke:var(--fp-hair);stroke-width:1}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .pm-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .pm-sig{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Het platte dak van een fabriekshal: een dakopstand met een leuning in de hoek achter links, een dakventilator op zijn opstand met de motor, een opslagtank met een mangat, een stalen bordes met een leuning boven een hydraulisch aggregaat, een lasapparaat op wielen met zijn kabel, een brandblusser, plassen na de regen, en een vaste ladder die over de dakrand omhoogkomt. Zes mensen: de afgever, de houder (de ploegleider van de lassers), de lasser, de brandwacht en twee monteurs. Kaarten tonen het bord met vergunningen, de werkvergunning, de werkorder, de vragen van de LMRA, het VCA-pasje, de werkonderbreking, vergunning tegenover LMRA, het afsluiten en Piper Alpha; de kaarten met verzonnen inhoud zijn gemarkeerd als voorbeeld.',
  en: 'The flat roof of a factory hall: a parapet with a guardrail in the back left corner, a roof fan on its curb with its motor, a storage tank with a manhole, a steel platform with a handrail above a hydraulic power unit, a welding set on wheels with its cable, a fire extinguisher, puddles after the rain, and a fixed ladder coming up over the roof edge. Six people: the issuer, the holder (the welders\' crew leader), the welder, the fire watch and two technicians. Cards show the permit board, the permit, the work order, the LMRA questions, the VCA card, the stop-work right, permit against LMRA, the close-out and Piper Alpha; the cards with invented content are marked as an example.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

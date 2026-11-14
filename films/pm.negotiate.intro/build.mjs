// Dev tool, not shipped. Builds the module intro film "Lijn 3 verhuist: de datum onderhandelen / Line 3
// moves: negotiating the date" for Onderhandelen en voet bij stuk houden (pm.negotiate), the eighth
// module intro film (v17) and the third of the cluster "Mensen en invloed": the high-over picture at
// the top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing
// I need the most").
//
//   node films/pm.negotiate.intro/build.mjs            build the page
//   node films/pm.negotiate.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.negotiate.intro.html: one offline page with the anatomy kit,
// the stage script and the player inlined. The index names it (pm.negotiate's `intro`), coursehome
// shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro) and of the two films before it in the
// cluster (films/pm.stuck.intro, films/pm.lead.intro): ONE concrete project travels through the whole
// module, the map before the detail, no calculations. The world of field film 2
// (films/pm.field.people), whose station for this module this intro agrees with: line 3 moves to
// hall B, the plan is right, and the installer from outside cannot make the date before the
// shutdown while you need the power by then; the station's two tools, a BATNA and a fair standard,
// are named here too, and its point (without preparation you stand weak and dig in on positions) is
// the first scene. The same hall as the other films of the cluster, with the cast the negotiations
// need: the installer (a hard hat, as in the pilot), the buyer, whose budget has been cut (the fact of
// pm.lead.intro, here the reason he pays for the installer's surcharge out of a tight budget and
// asks for a discount on your fee), and the sponsor (the senior, in two scenes). Every negotiation
// has a stake and a reason; the story is drawn in the room:
//   s1 line 3 has to stand in hall B before the summer shutdown ends; the power comes from an
//      installer from outside, and he says he can only come after the shutdown; the four topics
//   s2 Voorbereiden: belangen en alternatieven: his position (only after the shutdown) and his
//      interest (his crew works for another client first, and he does not want to let that client
//      wait); an option that serves both (the plant digs the trench for the cable itself: it costs
//      you little and saves him half a day); what you do if he keeps saying no (a second installer)
//                                                              → pm.negotiate.interests, .batna
//   s3 Aan tafel: bieden en ruilen: he comes sooner for a surcharge (his crew works at the weekend),
//      the buyer pays from a cut budget; he names a figure first: do not argue about it, ask what it
//      rests on and put your own on the table with a reason (what similar jobs cost); then give in
//      small steps and ask for something back each time              → pm.negotiate.anchor
//   s4 Scope, tarief en klanten: the sponsor asks whether the lighting of line 4 can be done in the
//      same shutdown (it is the only time everything stands still); scope, time and cost hang
//      together, you make the trade visible and let him choose; the buyer has to save and asks for a
//      discount: keep the rate, move the scope                  → pm.negotiate.scope, .price
//   s5 Voet bij stuk houden: to make the date the sponsor wants to skip the safety inspection of the
//      power cabinet; yes to what you protect, a clear no, yes to something else (the inspection
//      goes first on the day after the connection); safety is a red line → pm.negotiate.no
//   s6 one whole: prepare, bid, keep scope and fee in balance, hold your ground; the installer comes
//      a day sooner for a surcharge the buyer can live with, the inspection stays, line 3 gets
//      into place
//   s7 the shared Projects map with Onderhandelen en voet bij stuk houden lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.negotiate.interests, .anchor, .scope, .no). Each
// topic scene names the tools of that topic's lessons in one short sentence, without explaining
// them (Merijn's checkpoint, 14 Nov), each a term of its lesson: a BATNA (pm.negotiate.batna,
// Werkkennis, as field film 2 names it) and a fair standard (pm.negotiate.interests, Basis); an anchor
// and a counteroffer (pm.negotiate.anchor, Basis); a change log and a change request
// (pm.negotiate.scope, Basis); a positive no (pm.negotiate.no, Basis) and the conflict modes
// (pm.negotiate.assert, Werkkennis). The Werkkennis tools named in a Basis scene (the BATNA, the
// conflict modes) do not come back in s7; s7 names what each later level adds and nothing a
// scene explained or named. Terms come from the module's lessons and {n:} numbers from the
// module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its
// map (every topic named in a caption of its own scene, explained in two beats and lit), to the
// narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor from its cast,
// the buyer and the installer (with a hard hat) drawn with pm.agile.scrum's cast
// (films/pm.agile.scrum/cast.mjs). The things of hall B are the pilot's (../pm.plan.intro/hall.mjs,
// imported, not copied). A panel at the right, in stage space, draws each step as a schema, labelled
// "voorbeeld" (line 3's story) or "schema" (the module's map).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { textUnits, wrapUnits, CHAR_W } from '../_kit/assert.mjs';
import { mapScene, mapStyles, mapCue, levelWords } from '../_kit/mapscene.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import pmMap from '../../src/content/courses/maps/pm.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));


// ---------------------------------------------------------------- the module
// The map this film draws, asserted against the index (the build fails if the
// module's topics or levels move): s7 names what each level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'pm.negotiate');
const LEVELS = {
  prepare: ['pm.negotiate.interests', 'pm.negotiate.batna', 'pm.negotiate.prepare', 'pm.negotiate.leverage'],
  trade: ['pm.negotiate.anchor', 'pm.negotiate.concede', 'pm.negotiate.package', 'pm.negotiate.tactics'],
  clients: ['pm.negotiate.scope', 'pm.negotiate.price', 'pm.negotiate.terms', 'pm.negotiate.renegotiate'],
  ground: ['pm.negotiate.no', 'pm.negotiate.assert', 'pm.negotiate.senior', 'pm.negotiate.escalate'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.negotiate has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// a tool is a term of its lesson (a method the lesson teaches, in its glossary), in both languages
const isTerm = (id, term, lang) => assert((lessons[lang].get(id).terms || []).some((t) => t.term === term), `${id} (${lang}) has no term "${term}"`);
// s2: a position is what someone says he wants and an interest is why; options that serve both interests; give what is
// cheap for you and valuable for them; what you will really do if you walk away (the idea behind a BATNA, not its name);
// the tools: a BATNA (pm.negotiate.batna, Werkkennis, as field film 2 names it, so it is not in s7) and a fair standard
// (pm.negotiate.interests, Basis)
has('pm.negotiate.interests', ['Een standpunt is wat iemand zegt te willen', 'Een belang is waarom hij dat wil', 'wie naar belangen kijkt, ziet ruimte voor opties', 'geef wat voor jou goedkoop is en voor de ander veel waard']);
has('pm.negotiate.interests', ['A position is what someone says they want', 'An interest is why they want it', 'looking at interests opens up options', 'give what is cheap for you and valuable for them'], 'en');
has('pm.negotiate.batna', ['Het is wat je echt gaat doen als je wegloopt']);
has('pm.negotiate.batna', ['what you will actually do if you walk away'], 'en');
isTerm('pm.negotiate.batna', 'BATNA', 'nl'); isTerm('pm.negotiate.batna', 'BATNA', 'en');
isTerm('pm.negotiate.interests', 'Eerlijke maatstaf', 'nl'); isTerm('pm.negotiate.interests', 'Fair standard', 'en');
// s3: the first number in the room pulls the outcome towards it; when they anchor first, do not argue about their number,
// ask how they arrived at it and put your own on the table with its basis (similar jobs cost); concessions in smaller
// steps and something back for each; the tools: an anchor and a counteroffer (both pm.negotiate.anchor, Basis)
has('pm.negotiate.anchor', ['het eerste getal in de kamer trekt ieders schatting naar zich toe', 'Ankert de ander eerst, ga dan niet over zijn getal in discussie', 'Vraag hoe hij erop kwam', 'leg jouw basis uit en leg je eigen getal op tafel', 'Vergelijkbare diagnoses kostten', 'maak elke stap kleiner', 'vraag er telkens iets voor terug', 'Grote of snelle concessies verraden dat er nog veel ruimte is']);
has('pm.negotiate.anchor', ['the first number in the room pulls everyone’s estimates towards it', 'When they anchor first, don’t argue about their number', 'Ask how they arrived at it', 'explain your basis and put your own number on the table', 'Similar diagnostics took', 'make each one smaller than the last', 'get something for each', 'Big or quick concessions signal much more room'], 'en');
isTerm('pm.negotiate.anchor', 'Anker', 'nl'); isTerm('pm.negotiate.anchor', 'Tegenbod', 'nl');
isTerm('pm.negotiate.anchor', 'Anchor', 'en'); isTerm('pm.negotiate.anchor', 'Counteroffer', 'en');
// s4: scope, time and cost hang together, you make the trade visible and the client chooses; keep the rate and move the
// scope; a first "too expensive" is information; a savings target; the tools: a change log and a change request (both
// pm.negotiate.scope, Basis)
has('pm.negotiate.scope', ['Beweegt er één, dan moet er iets anders mee', 'maar de ruil zichtbaar maken', 'Laat de klant kiezen: het is zijn prioriteit']);
has('pm.negotiate.scope', ['If one moves, something else has to', 'make the trade visible', 'Let the client choose: it’s their priority'], 'en');
has('pm.negotiate.price', ['houd het tarief vast en beweeg de scope', 'is dus informatie, geen oordeel', 'Besparingsdoel']);
has('pm.negotiate.price', ['keep the rate and move the scope', 'is information, not a verdict', 'Savings target'], 'en');
isTerm('pm.negotiate.scope', 'Wijzigingslog', 'nl'); isTerm('pm.negotiate.scope', 'Wijzigingsverzoek', 'nl');
isTerm('pm.negotiate.scope', 'Change log', 'en'); isTerm('pm.negotiate.scope', 'Change request', 'en');
// s5: yes to what you protect, a clear no, yes to something else; safety is not for trading (a red line); the tools: a
// positive no (pm.negotiate.no, Basis) and the conflict modes (pm.negotiate.assert, Werkkennis, so not in s7)
has('pm.negotiate.no', ['Eerst het ja tegen wat je beschermt', 'Dan een duidelijk nee', 'Dan een ja tegen iets anders', 'Sommige dingen ruil je niet: veiligheid', 'Rode lijn']);
has('pm.negotiate.no', ['First the yes to what you are protecting', 'Then a clear no', 'Then a yes to something else', 'Some things are not for trading: safety', 'Red line'], 'en');
isTerm('pm.negotiate.no', 'Positieve nee', 'nl'); isTerm('pm.negotiate.no', 'Positive no', 'en');
isTerm('pm.negotiate.assert', 'Conflictstijlen', 'nl'); isTerm('pm.negotiate.assert', 'Conflict modes', 'en');
// s7: the later levels, as the lessons are titled or word them (the grid names what each adds, and nothing a scene
// explained or named as a tool: no BATNA, fair standard, anchor, counteroffer, change log, change request, positive no,
// conflict modes, red line, interest, rate, trade; the ZOPA, splitting the difference, payment terms and appreciation
// without deference, the preparation sheet, trading across issues, assumptions and the fact-view-request, weaker
// positions, hard tactics, renegotiating and the golden bridge are named here and nowhere else)
for (const [id, word] of [['pm.negotiate.batna', 'ZOPA'], ['pm.negotiate.concede', 'Het verschil delen'], ['pm.negotiate.price', 'Betalingstermijn'], ['pm.negotiate.assert', 'Waardering zonder onderdanigheid'],
  ['pm.negotiate.prepare', 'Voorbereidingsblad'], ['pm.negotiate.package', 'Ruilen tussen punten'], ['pm.negotiate.terms', 'Aanname'], ['pm.negotiate.senior', 'Feit-visie-verzoek'],
  ['pm.negotiate.leverage', 'zwakkere positie'], ['pm.negotiate.tactics', 'Harde tactiek'], ['pm.negotiate.renegotiate', 'Heronderhandelen'], ['pm.negotiate.escalate', 'Gouden brug']]) has(id, [word]);
for (const [id, word] of [['pm.negotiate.batna', 'ZOPA'], ['pm.negotiate.concede', 'Splitting the difference'], ['pm.negotiate.price', 'Payment terms'], ['pm.negotiate.assert', 'Appreciation without deference'],
  ['pm.negotiate.prepare', 'Preparation sheet'], ['pm.negotiate.package', 'Trading across issues'], ['pm.negotiate.terms', 'Assumption'], ['pm.negotiate.senior', 'Fact-view-request'],
  ['pm.negotiate.leverage', 'weaker position'], ['pm.negotiate.tactics', 'Hard tactic'], ['pm.negotiate.renegotiate', 'Renegotiation'], ['pm.negotiate.escalate', 'Golden bridge']]) has(id, [word], 'en');
// s7: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 222, col: 100, box: 92, tile: 190 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
// the topic titles: "Voorbereiden: belangen en alternatieven" has a word of 158 units ("Voorbereiden:"), wider than the
// kit's 128-unit tile, so the film declares `tileUnits` = the narrowest box that draws a title, the closing grid's tile
// (GRID.tile less its padding, 178 units); the route's rows (284 wide) are wider. Every title box wraps with D.tileUnits,
// three lines.
const TILE_TEXT = GRID.tile - 12;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the grid's tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the grid's tile`);
}

// ---------------------------------------------------------------- the world (hall B, as field film 2)
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 170, h: 215 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const hall = hallWorld(w, k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

// where things stand (cm), as in the pilot: line 3's marked floor at the back wall at the right under the
// switchboard, line 4 (which stays) next to it, the power cabinet at the back wall at the left
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the sponsor is the pm cast; the buyer and the installer (a hard hat, as in the pilot) are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
// The installer stands at the cabinet; the buyer and the sponsor stand on the open floor in front of it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-installer', scrumPerson(w, k, G, P, { x: 44, y: 62, key: 'installer', look: 'sm', along: 'y' }) + hall.hat(44, 62)),
  g('pp-buyer', scrumPerson(w, k, G, P, { x: 90, y: 94, key: 'buyer', look: 'po', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-sponsor', person('sponsor', 142, 130, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has up to two tool chips (tool1, tool2) for the
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Onderhandelen is a cue group of its own (map-negotiate).
const tiles = ['tPrep', 'tTrade', 'tClient', 'tGround'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('need', g('needB', ''))
  + cueG('pos', g('posB', '')) + cueG('why', g('whyB', '')) + cueG('opt', g('optB', '')) + cueG('alt', g('altB', ''))
  + cueG('offer', g('offerB', '')) + cueG('first', g('firstB', '')) + cueG('steps', g('stepsB', ''))
  + cueG('extra', g('extraB', '')) + cueG('triangle', g('triB', '')) + cueG('fee', g('feeB', ''))
  + cueG('skip', g('skipB', '')) + cueG('yesno', g('yesnoB', '')) + cueG('line', g('lineB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Onderhandelen lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.negotiate'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const NEG_PLACE = pmMap.places.find((p) => p.module === 'pm.negotiate');
const MAPZ = [NEG_PLACE.x + NEG_PLACE.w / 2, NEG_PLACE.y + NEG_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.negotiate')}"`), 'the map lights pm.negotiate as a cue group');

// Static paths with relative line-tos (the helper of pm.plan.schedule): the
// same points, fewer bytes; each rewrite is read back to prove it exact.
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
    nums.forEach((v, i) => { const t = n(v); s += (i === 0 && s === '' && !t.startsWith('-') && out && /[\d.]$/.test(out)) || (i > 0 && !t.startsWith('-')) ? ` ${t}` : t; });
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('mapG', MAP)}${hud}</svg>`);


// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [ox, oy, s]: the point (ox, oy) of the hall, in stage units, is brought to the middle of the hall's half of the
// stage while the hall scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3's floor, the calendar and the cabinet
  { from: cam(70, 75, 60, 1.2), to: cam(75, 78, 60, 1.25) }, // s2 the installer at the cabinet
  { from: cam(72, 80, 60, 1.2), to: cam(77, 83, 60, 1.25) }, // s3 the installer and the buyer
  { from: cam(112, 108, 60, 1.15), to: cam(115, 112, 60, 1.2) }, // s4 the sponsor and the buyer, line 4 behind them
  { from: cam(90, 98, 60, 1.1), to: cam(95, 98, 60, 1.15) }, // s5 the sponsor and the installer at the cabinet
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.negotiate.intro',
  title: { nl: 'Lijn 3 verhuist: de datum onderhandelen', en: 'Line 3 moves: negotiating the date' },
  module: 'pm.negotiate',
  // the narrowest box that draws a topic title: the closing grid's tile (GRID.tile 190 less its padding); the route's rows
  // are wider. "Voorbereiden:" (158 units) does not fit the kit's 128-unit tile, so the film declares the width it draws
  tileUnits: 178,
  // the map: per topic of pm.negotiate, the scene that explains it and its tile
  topics: {
    prepare: { scene: 's2', cue: 'tPrep' },
    trade: { scene: 's3', cue: 'tTrade' },
    clients: { scene: 's4', cue: 'tClient' },
    ground: { scene: 's5', cue: 'tGround' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Lijn 3 moet voor het eind van de zomerstop in hal B staan. De stroom komt van een installateur van buiten.', en: 'Line 3 must be in hall B before the summer shutdown ends. The power comes from an installer from outside.', focus: ['goal', 'floor', 'calendar', 'power', 'installer'] },
        { nl: 'Hij zegt dat hij pas na de stop kan komen. Zonder stroom draait de lijn niet.', en: 'He says he can only come after the shutdown. Without power the line cannot run.', focus: ['need', 'installer', 'power', 'calendar'] },
        { nl: 'Hoe haal je de datum? We volgen dit project langs de vier onderwerpen van de module.', en: 'How do you make the date? We follow this project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Voorbereiden', en: 'Preparing' },
      beats: [
        { nl: 'Eerste onderwerp is Voorbereiden: belangen en alternatieven. De installateur zegt: pas na de stop.', en: 'First topic is Preparing: interests and alternatives. The installer says: only after the shutdown.', focus: ['tPrep', 'pos', 'installer'] },
        { nl: 'Dat is zijn standpunt. Zijn belang: zijn ploeg werkt eerst bij een andere klant.', en: 'That is his position. His interest: his crew works for another client first.', focus: ['why', 'installer'] },
        { nl: 'Zoek een optie die ook zijn belang dient: de fabriek graaft zelf de sleuf voor de kabel.', en: 'Find an option that also serves his interest: the plant digs the trench for the cable itself.', focus: ['opt', 'installer', 'power'] },
        { nl: 'En als hij nee blijft zeggen? Dan vraag je een tweede installateur.', en: 'And if he keeps saying no? Then you ask a second installer.', focus: ['alt', 'installer'] },
        { nl: 'Bij het voorbereiden gebruiken we een {t:BATNA|BATNA} en een {t:Eerlijke maatstaf|eerlijke maatstaf}.', en: 'For preparing we use a {t:BATNA|BATNA} and a {t:Fair standard|fair standard}.', cue: { BATNA: 'tool1', 'Eerlijke maatstaf': 'tool2', 'Fair standard': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Aan tafel', en: 'At the table' },
      beats: [
        { nl: 'Tweede onderwerp is Aan tafel: bieden en ruilen. Hij komt eerder, maar wil een toeslag.', en: 'Second topic is At the table: offers and trades. He will come sooner, but wants a surcharge.', focus: ['tTrade', 'offer', 'installer', 'buyer'] },
        { nl: 'Hij noemt als eerste een bedrag. Vraag waar het op rust en noem het jouwe, met een reden.', en: 'He names a figure first. Ask what it rests on and name yours, with a reason.', focus: ['first', 'installer', 'buyer'] },
        { nl: 'Geef daarna in kleine stappen toe, en vraag er telkens iets voor terug.', en: 'Then give ground in small steps, and ask for something back each time.', focus: ['steps', 'installer', 'buyer'] },
        { nl: 'Aan tafel gebruiken we een {t:Anker|anker} en een {t:Tegenbod|tegenbod}.', en: 'At the table we use an {t:Anchor|anchor} and a {t:Counteroffer|counteroffer}.', cue: { Anker: 'tool1', Tegenbod: 'tool2', Anchor: 'tool1', Counteroffer: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Klanten', en: 'Clients' },
      beats: [
        { nl: 'Derde onderwerp is Scope, tarief en klanten. De sponsor wil de verlichting van lijn 4 erbij.', en: 'Third topic is Scope, fees and clients. The sponsor wants the lighting of line 4 added.', focus: ['tClient', 'extra', 'sponsor', 'line4'] },
        { nl: 'Scope, tijd en kosten hangen samen. Weiger niet, maak de ruil zichtbaar en laat hem kiezen.', en: 'Scope, time and cost hang together. Do not refuse, make the trade visible and let him choose.', focus: ['triangle', 'sponsor'] },
        { nl: 'De inkoper moet besparen en wil korting op je tarief. Houd het tarief vast, beweeg de scope.', en: 'The buyer has to save and wants a discount on your fee. Keep the fee, move the scope.', focus: ['fee', 'buyer'] },
        { nl: 'Met klanten gebruiken we een {t:Wijzigingslog|wijzigingslog} en een {t:Wijzigingsverzoek|wijzigingsverzoek}.', en: 'With clients we use a {t:Change log|change log} and a {t:Change request|change request}.', cue: { Wijzigingslog: 'tool1', Wijzigingsverzoek: 'tool2', 'Change log': 'tool1', 'Change request': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Voet bij stuk', en: 'Holding firm' },
      beats: [
        { nl: 'Vierde onderwerp is Voet bij stuk houden. De sponsor wil de keuring van de stroomkast overslaan.', en: 'Fourth topic is Holding your ground. The sponsor wants to skip the inspection of the power cabinet.', focus: ['tGround', 'skip', 'sponsor', 'power'] },
        { nl: 'Zeg ja tegen wat je beschermt, dan een duidelijk nee, dan ja tegen iets anders.', en: 'Say yes to what you protect, then a clear no, then yes to something else.', focus: ['yesno', 'sponsor'] },
        { nl: 'Veiligheid ruil je niet, ook niet voor de datum. Dat is een {t:Rode lijn|rode lijn}.', en: 'You do not trade safety, not even for the date. That is a {t:Red line|red line}.', cue: { 'Rode lijn': 'line', 'Red line': 'line' }, focus: ['line', 'sponsor', 'power'] },
        { nl: 'We gebruiken een {t:Positieve nee|positieve nee} en de {t:Conflictstijlen|conflictstijlen}.', en: 'We use a {t:Positive no|positive no} and the {t:Conflict modes|conflict modes}.', cue: { 'Positieve nee': 'tool1', Conflictstijlen: 'tool2', 'Positive no': 'tool1', 'Conflict modes': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Voorbereiden, bieden, scope en tarief in balans, en voet bij stuk houden.', en: 'It connects. Preparing, bidding, scope and fee in balance, and holding your ground.', focus: ['flow', 'installer', 'buyer', 'sponsor'] },
        { nl: 'De installateur komt voor de stop, de keuring blijft. Lijn 3 komt op zijn plek.', en: 'The installer comes before the shutdown, the inspection stays. Line 3 gets into place.', focus: ['decision', 'installer', 'power', 'line3'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Op de kaart van Projecten is Onderhandelen en voet bij stuk houden het derde station van Mensen en invloed.', en: 'On the map of Projects, Negotiating and holding your ground is the third station of People and influence.', focus: mapCue('pm.negotiate') },
        { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.', en: 'This module has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Voorbereiden, op niveau Basis.', en: 'Start with Preparing, at Basics level.', focus: ['tPrep', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen de ZOPA, het verschil delen, betalingstermijnen en waardering zonder onderdanigheid erbij.', en: 'At Working knowledge you add ZOPA, splitting the difference, payment terms and appreciation without deference.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen het voorbereidingsblad, ruilen tussen punten, aannames en het feit-visie-verzoek erbij.', en: 'At Advanced you add the preparation sheet, trading across issues, assumptions and the fact-view-request.', focus: 'lv3' },
        { nl: 'Op Expert komen een zwakkere positie, harde tactieken, heronderhandelen en de gouden brug erbij.', en: 'At Expert you add a weaker position, hard tactics, renegotiating and the golden bridge.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said
// once. Short sentences, few colons and comma lists, no symbols the voice would
// read aloud and nothing in parentheses: the kit's narration guard
// (films/_kit/assert.mjs, checkNarration) holds every module film to that, and
// the render guard caps a pause inside a sentence at 0.4 s. Each topic scene ends
// on one short sentence naming the tools of that topic's lessons, without
// explaining them. This film needs no SAY rule of its own: BATNA and ZOPA are read
// right by the voice (films/_kit/timeline.mjs, the BATNA comment), deal, framing and the other
// negotiation words have rules there, and anker, tegenbod, toeslag, keuring, positieve nee,
// conflictstijlen, wijzigingslog, wijzigingsverzoek, voorbereidingsblad, betalingstermijn,
// aannames and the rest are plain Dutch words or already said by other films.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Lijn 3 moet voor het einde van de zomerstop in hal B staan. De stroom komt van een installateur van buiten.',
      en: 'Line 3 has to stand in hall B before the summer shutdown ends. The power comes from an installer from outside.' },
    { nl: 'Maar hij zegt dat hij pas na de stop kan komen. Zonder stroom kan de lijn niet draaien, dus jij moet het met hem regelen.',
      en: 'But he says he can only come after the shutdown. Without power the line cannot run, so you have to sort it out with him.' },
    { nl: 'Hoe haal je de datum? We volgen dit project langs de vier onderwerpen van de module.',
      en: 'How do you make the date? We follow this project through the four topics of the module.' },
  ],
  [ // s2 preparing: interests and alternatives
    { nl: 'Het eerste onderwerp is voorbereiden, met belangen en alternatieven. De installateur zegt dat het pas na de stop kan.',
      en: 'The first topic is preparing, with interests and alternatives. The installer says it can only happen after the shutdown.' },
    { nl: 'Dat is zijn standpunt. Zijn belang is dat zijn ploeg eerst bij een andere klant werkt, en die klant wil hij niet laten wachten.',
      en: 'That is his position. His interest is that his crew works for another client first, and he does not want to keep that client waiting.' },
    { nl: 'Zoek een optie die ook zijn belang dient. De fabriek graaft zelf de sleuf voor de kabel. Dat kost jou weinig en scheelt hem een halve dag.',
      en: 'Find an option that serves his interest too. The plant digs the trench for the cable itself. That costs you little and saves him half a day.' },
    { nl: 'En wat doe je als hij nee blijft zeggen? Dan vraag je een tweede installateur, die duurder is maar wel eerder kan.',
      en: 'And what do you do if he keeps saying no? Then you ask a second installer, who costs more but can come sooner.' },
    { nl: 'Bij het voorbereiden gebruiken we een BATNA en een eerlijke maatstaf.',
      en: 'For preparing we use a BATNA and a fair standard.' },
  ],
  [ // s3 at the table: offers and trades
    { nl: 'Het tweede onderwerp is aan tafel, bieden en ruilen. De installateur komt wel eerder, maar wil een toeslag omdat zijn ploeg dan in het weekend werkt. De inkoper betaalt dat uit een gekort budget.',
      en: 'The second topic is at the table, offers and trades. The installer will come sooner, but wants a surcharge because his crew then works at the weekend. The buyer pays for that from a cut budget.' },
    { nl: 'Hij noemt als eerste een bedrag, en dat getal trekt de uitkomst naar zich toe. Praat niet over zijn getal, maar vraag waar het op rust. Leg dan jouw bedrag op tafel, met een reden.',
      en: 'He names a figure first, and that number pulls the outcome towards it. Do not argue about his number, ask what it rests on. Then put your own figure on the table, with a reason.' },
    { nl: 'Daarna geef je in kleine stappen toe, en je vraagt er elke keer iets voor terug.',
      en: 'After that you give ground in small steps, and you ask for something back each time.' },
    { nl: 'Aan tafel gebruiken we een anker en een tegenbod.',
      en: 'At the table we use an anchor and a counteroffer.' },
  ],
  [ // s4 scope, fees and clients
    { nl: 'Het derde onderwerp is scope, tarief en klanten. De sponsor vraagt of de verlichting van lijn 4 er ook bij kan, want alleen tijdens de stop staat alles stil.',
      en: 'The third topic is scope, fees and clients. The sponsor asks whether the lighting of line 4 can be added too, because everything only stands still during the shutdown.' },
    { nl: 'Scope, tijd en kosten hangen aan elkaar. Beweegt er één, dan moet er iets anders mee. Je weigert niet, je maakt de ruil zichtbaar en laat de sponsor kiezen.',
      en: 'Scope, time and cost hang together. If one moves, something else has to. You do not refuse, you make the trade visible and let the sponsor choose.' },
    { nl: 'De inkoper moet besparen en vraagt korting op je tarief. Houd je tarief vast en doe minder voor minder geld.',
      en: 'The buyer has to save and asks for a discount on your fee. Keep your fee and do less for less money.' },
    { nl: 'Met klanten gebruiken we een wijzigingslog en een wijzigingsverzoek.',
      en: 'With clients we use a change log and a change request.' },
  ],
  [ // s5 holding your ground
    { nl: 'Het vierde onderwerp is voet bij stuk houden. Om de datum te halen wil de sponsor de veiligheidskeuring van de stroomkast overslaan.',
      en: 'The fourth topic is holding your ground. To make the date, the sponsor wants to skip the safety inspection of the power cabinet.' },
    { nl: 'Zeg eerst ja tegen wat je beschermt, de veiligheid. Zeg dan duidelijk nee. Zeg daarna ja tegen iets anders, de keuring direct na de aansluiting.',
      en: 'First say yes to what you protect, safety. Then say a clear no. After that say yes to something else, the inspection right after the connection.' },
    { nl: 'Veiligheid ruil je niet, ook niet voor de datum. Dat is een {t:Rode lijn|rode lijn}.',
      en: 'You do not trade safety, not even for the date. That is a {t:Red line|red line}.' },
    { nl: 'We gebruiken een positieve nee en de conflictstijlen.',
      en: 'We use a positive no and the conflict modes.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Je bereidt voor en biedt aan tafel. Je houdt scope en tarief in balans en houdt voet bij stuk waar het moet.',
      en: 'It connects. You prepare and bid at the table. You keep scope and fee in balance and hold your ground where you must.' },
    { nl: 'De installateur komt nu voor de stop, voor een toeslag waar de inkoper mee kan leven. De keuring blijft, en lijn 3 komt op zijn plek.',
      en: 'The installer now comes before the shutdown, for a surcharge the buyer can live with. The inspection stays, and line 3 gets into place.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Onderhandelen en voet bij stuk houden is het derde station van Mensen en invloed.',
      en: 'This is the map of Projects. Negotiating and holding your ground is the third station of People and influence.' },
    { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.',
      en: 'This module has four topics, each with four levels.' },
    { nl: 'Begin bij voorbereiden, op niveau Basis.',
      en: 'Start with preparing, at Basics level.' },
    { nl: 'Op Werkkennis komen de ZOPA, het verschil delen, betalingstermijnen en waardering zonder onderdanigheid erbij.',
      en: 'At Working knowledge you add ZOPA, splitting the difference, payment terms and appreciation without deference.' },
    { nl: 'Op Gevorderd komen het voorbereidingsblad, ruilen tussen punten, aannames en het feit-visie-verzoek erbij.',
      en: 'At Advanced you add the preparation sheet, trading across issues, assumptions and the fact-view-request.' },
    { nl: 'Op Expert komen een zwakkere positie, harde tactieken, heronderhandelen en de gouden brug erbij.',
      en: 'At Expert you add a weaker position, hard tactics, renegotiating and the golden bridge.' },
    { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.',
      en: 'Every lesson and every film in this module has a place on this map.' },
  ],
];
// Each scene's length from its share of the Dutch narration, never shorter than
// its captions need (as pm.plan.wbs).
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = SAY.map((sc) => sc.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * SAY.length);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > 300) throw new Error(`film is ${total} s, over 300`);
}
// Each beat's still (reduced motion) sits late in its own share of the scene.
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst GRID = ${JSON.stringify(GRID)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="buyer"],[data-cue="installer"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-pkg{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-stop{fill:color-mix(in srgb,var(--fp-accent) 10%,transparent);stroke:var(--anatomy-lo);stroke-width:1;stroke-dasharray:3 3}
.pm-range{fill:color-mix(in srgb,var(--fp-accent) 16%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-buf{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 3}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-rag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-g{fill:#5E9A6B;stroke:#4A7F56;stroke-width:1.2}
.pm-rag-a{fill:#D49A35;stroke:#B07B22;stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
.pm-tick{fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-pkg,.pm-bar,.pm-range,.pm-buf,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();


const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de film over de mensenkant van het project. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met een gestippelde kabel van buiten, die pas een gewone lijn wordt als de installateur is geweest, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp staan er mensen: de installateur met een helm, de inkoper en de sponsor. Aan het eind staat lijn 3 op zijn plek, is de kabel aangesloten en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel, de installateur die pas na de stop kan en de vier onderwerpen van de module als tegels; zijn standpunt en zijn belang, een optie die beide dient en een tweede installateur als alternatief; een toeslag met de reden en het gekorte budget van de inkoper, zijn bedrag eerst en dat van jou met een reden, en kleine stappen waar steeds iets tegenover staat; extra werk van de sponsor, de driehoek van scope, tijd en kosten, en een inkoper die korting wil terwijl het tarief blijft; de keuring die overgeslagen zou worden, ja nee ja, en een rode lijn; per onderwerp twee namen van hulpmiddelen; en de keten van voorbereiden tot voet bij stuk houden. Aan het eind de kaart van Projecten met Onderhandelen en voet bij stuk houden verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go, as in the film about the people side of the project. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with a dashed cable from outside, which becomes a solid line once the installer has been, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the installer in a hard hat, the buyer and the sponsor. At the end line 3 stands in place, the cable is connected and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the goal, the installer who can only come after the shutdown and the module’s four topics as tiles; his position and his interest, an option that serves both and a second installer as the alternative; a surcharge with its reason and the buyer’s cut budget, his figure first and yours with a reason, and small steps with something back each time; extra work from the sponsor, the triangle of scope, time and cost, and a buyer who wants a discount while the fee stays; the inspection that would be skipped, yes no yes, and a red line; two tool names per topic; and the chain from preparing to holding your ground. At the end the map of Projects with Negotiating and holding your ground lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  for (const s of data.scenes) console.log(`  ${s.id}: nl ${s.beats.reduce((n, b) => n + b.voice.nl.split(/\s+/).length, 0)} en ${s.beats.reduce((n, b) => n + b.voice.en.split(/\s+/).length, 0)}`);
}


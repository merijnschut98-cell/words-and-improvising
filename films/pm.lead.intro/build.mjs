// Dev tool, not shipped. Builds the module intro film "Lijn 3 en de mensen / Line 3 and the
// people" for Mensen leiden (pm.lead), the seventh module intro film (v17) and the second of
// the cluster "Mensen en invloed": the high-over picture at the top of the module, before its
// four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.lead.intro/build.mjs            build the page
//   node films/pm.lead.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.lead.intro.html: one offline page with the anatomy kit,
// the stage script and the player inlined. The index names it (pm.lead's `intro`), coursehome
// shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro) and of the first film of the cluster
// (films/pm.lead.intro): ONE concrete project travels through the whole module, the map before
// the detail, no calculations. The world of field film 2 (films/pm.field.people), whose station
// for this module this intro agrees with: line 3 moves to hall B, the plan is right, and you
// need two people who do not report to you, the buyer and the team lead; the station's two
// tools, SBI and active listening, are named here too, and its point (without influence of your
// own you keep borrowing the sponsor's power, and it wears out) is the second scene. The same
// hall and the same cast as pm.lead.intro (the sponsor, the team lead of the line with his reason
// for his stance: he fears for line 4 when his crew leaves, the crew), plus the buyer of the
// field film. The story is drawn in the room:
//   s1 line 3 has to stand in hall B before the summer shutdown ends; the plan is right, but
//      you are the youngest consultant and need the buyer (the switchboard must be ordered this
//      week, or it comes too late) and the team lead (his crew); the four topics
//   s2 Invloed zonder macht: you cannot order the buyer; the sponsor only lends you a little
//      position power and it wears thin; your own expert and referent power grow with your work
//                                                           → pm.lead.power
//   s3 Feedback en moeilijke gesprekken: the team lead walked away from the start of the shift
//      twice and the crew had no plan; behaviour, not character; soon and in private, then a
//      question; line 4 had stopped and he had to go there   → pm.lead.feedback
//   s4 Luisteren en coachen: the buyer says the switchboard is too expensive; under pressure you
//      defend or fix, listen first; there is a worry underneath, his budget is cut
//                                                           → pm.lead.listen
//   s5 Teams en jezelf leiden: on Monday you tell the crew and the team lead how the move goes
//      and you are the youngest in the room; a first impression forms fast, drop the hedge; act on
//      evidence, not on a feeling of being a fraud             → pm.lead.self
//   s6 one whole: own influence, feedback on behaviour, listening, saying clearly what you
//      propose; the buyer orders the switchboard, the crew is free, line 3 moves into its place
//   s7 the shared Projects map with Mensen leiden lit, then the module's four topics with their
//      levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.lead.power, .feedback, .listen, .self). Each
// topic scene names the tools of that topic's lessons in one short sentence, without explaining
// them (Merijn's checkpoint, 14 Nov), each a method the lesson teaches as a term: reciprocity and
// social proof (pm.lead.persuade), SBI (pm.lead.feedback) and Radical Candor (pm.lead.candor),
// active listening (pm.lead.listen) and Toyota Kata (pm.lead.kata), an assertive statement and
// reframing (pm.lead.self). The Basis lessons are taught in the scenes without naming the
// tools in the beat before the tool sentence; s7 names what each later level adds and nothing a
// scene explained or named. Terms come from the module's lessons and {n:} numbers from the
// module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its
// map (every topic named in a caption of its own scene, explained in two beats and lit), to the
// narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor and the team
// lead from its cast, the buyer and the two crew members drawn with pm.agile.scrum's cast
// (films/pm.agile.scrum/cast.mjs). The things of hall B are the pilot's (../pm.plan.intro/hall.mjs,
// imported, not copied). A panel at the right, in stage space, draws each step as a schema,
// labelled "voorbeeld" (line 3's story) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.lead');
const LEVELS = {
  influence: ['pm.lead.power', 'pm.lead.persuade', 'pm.lead.influence', 'pm.lead.coalition'],
  feedback: ['pm.lead.feedback', 'pm.lead.candor', 'pm.lead.difficult', 'pm.lead.triggers'],
  coaching: ['pm.lead.listen', 'pm.lead.kata', 'pm.lead.cycle', 'pm.lead.situational'],
  teams: ['pm.lead.self', 'pm.lead.stages', 'pm.lead.teams', 'pm.lead.safety'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.lead has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// a tool is a term of its lesson (a method the lesson teaches, in its glossary), in both languages
const isTerm = (id, term, lang) => assert((lessons[lang].get(id).terms || []).some((t) => t.term === term), `${id} (${lang}) has no term "${term}"`);
// s2: little position power, the sponsor lends a little of his and it wears thin; own expert and referent power grow
// with your work; the tools: reciprocity and social proof (pm.lead.persuade, the Werkkennis lesson)
has('pm.lead.power', ['bijna geen positiemacht', 'leent je maar een beetje van zijn positiemacht', 'die slijt elke keer dat je hem gebruikt', 'Deskundigheidsmacht is zichtbare kunde', 'Referentiemacht is iemand zijn met wie mensen willen werken', 'Positiemacht', 'Deskundigheidsmacht', 'Referentiemacht']);
has('pm.lead.power', ['almost no position power', 'only lends you a little of his position power', 'it wears thin each time you use it', 'Expert power is visible competence', 'Referent power is being someone people want to work with', 'Position power', 'Expert power', 'Referent power'], 'en');
isTerm('pm.lead.persuade', 'Wederkerigheid', 'nl'); isTerm('pm.lead.persuade', 'Sociaal bewijs', 'nl');
isTerm('pm.lead.persuade', 'Reciprocity', 'en'); isTerm('pm.lead.persuade', 'Social proof', 'en');
// s3: behaviour, not character (what a camera would have recorded), soon and in private, then a question; the tools:
// SBI (pm.lead.feedback, Basis) and Radical Candor (pm.lead.candor, Werkkennis)
has('pm.lead.feedback', ['Gedrag, geen karakter', 'wat een camera had opgenomen', 'Zo snel als het kan, onder vier ogen', 'Daarna een vraag']);
has('pm.lead.feedback', ['Behaviour, not character', 'what a camera would have recorded', 'As soon as you can, in private', 'Then a question'], 'en');
isTerm('pm.lead.feedback', 'SBI', 'nl'); isTerm('pm.lead.feedback', 'SBI', 'en');
isTerm('pm.lead.candor', 'Radical Candor', 'nl'); isTerm('pm.lead.candor', 'Radical Candor', 'en');
// s4: under pressure you defend or solve, listen first and let silence work; whoever attacks the project has a worry
// underneath (workload, blame, control); the tools: active listening (pm.lead.listen, Basis) and Toyota Kata
// (pm.lead.kata, Werkkennis)
has('pm.lead.listen', ['Onder druk schiet je meteen in verdedigen of oplossen', 'Silence: laat stilte werken', 'Wie het project aanvalt, heeft er meestal een zorg onder: werkdruk, schuld, controle kwijtraken']);
has('pm.lead.listen', ['Under pressure you skip straight to defending or solving', 'Silence: let it work', 'When someone attacks the project, there’s usually a worry underneath: workload, blame, losing control'], 'en');
isTerm('pm.lead.listen', 'Actief luisteren', 'nl'); isTerm('pm.lead.listen', 'Active listening', 'en');
isTerm('pm.lead.kata', 'Toyota Kata', 'nl'); isTerm('pm.lead.kata', 'Toyota Kata', 'en');
// s5: a first impression forms fast; know your numbers, sit at the table, drop the hedge; feeling like a fraud is
// common and you act on evidence; the tools: an assertive statement and reframing (pm.lead.self, Basis)
has('pm.lead.self', ['Een eerste indruk ontstaat snel', 'ken je cijfers uit je hoofd', 'ga aan tafel zitten', 'laat het voorbehoud weg', 'Veel capabele mensen voelen zich een bedrieger', 'handelen op bewijs']);
has('pm.lead.self', ['First impressions form fast', 'know your numbers cold', 'sit at the table', 'drop the hedge', 'Many capable people feel like frauds', 'act on evidence'], 'en');
isTerm('pm.lead.self', 'Assertieve uitspraak', 'nl'); isTerm('pm.lead.self', 'Herkaderen', 'nl');
isTerm('pm.lead.self', 'Assertive statement', 'en'); isTerm('pm.lead.self', 'Reframing', 'en');
// s7: the later levels, as the lessons are titled or word them (the grid names what each adds, and nothing a scene
// explained or named as a tool: no reciprocity, SBI, active listening, assertive statement, hedge, fraud)
for (const [id, word] of [['pm.lead.persuade', 'Manipulatie'], ['pm.lead.candor', 'Botte agressie'], ['pm.lead.kata', 'Doeltoestand'], ['pm.lead.stages', 'vier fasen'],
  ['pm.lead.influence', 'Valuta'], ['pm.lead.difficult', 'Identiteitsgesprek'], ['pm.lead.cycle', 'Coachingscycli'], ['pm.lead.teams', 'Teamdynamiek'],
  ['pm.lead.coalition', 'Coalitie'], ['pm.lead.triggers', 'Feedback die je raakt'], ['pm.lead.situational', 'Situationeel leiderschap'], ['pm.lead.safety', 'Psychologische veiligheid']]) has(id, [word]);
for (const [id, word] of [['pm.lead.persuade', 'Manipulation'], ['pm.lead.candor', 'Obnoxious aggression'], ['pm.lead.kata', 'Target condition'], ['pm.lead.stages', 'four stages'],
  ['pm.lead.influence', 'Currency'], ['pm.lead.difficult', 'Identity conversation'], ['pm.lead.cycle', 'coaching cycles'], ['pm.lead.teams', 'Team dynamics'],
  ['pm.lead.coalition', 'Coalition'], ['pm.lead.triggers', 'Feedback that hits you'], ['pm.lead.situational', 'Situational Leadership'], ['pm.lead.safety', 'psychological safety']]) has(id, [word], 'en');
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
// the topic titles: "Feedback and difficult conversations" has a word of 154 units ("conversations"), wider than the kit's
// 128-unit tile, so the film declares `tileUnits` = the narrowest box that draws a title, the closing grid's tile (GRID.tile
// less its padding, 178 units); the route's rows (284 wide) are wider. Every title box wraps with D.tileUnits, three lines.
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

// the people: the sponsor and the team lead of the line are the pm cast; the buyer and the two crew members are
// pm.agile.scrum's figures, as in field film 2 (the same places). Each stands in a cue group; the stage script
// shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-buyer', scrumPerson(w, k, G, P, { x: 224, y: 96, key: 'buyer', look: 'po', along: 'x' })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 122, 138, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has up to two tool chips (tool1, tool2) for the
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Mensen leiden is a cue group of its own (map-lead).
const tiles = ['tInf', 'tFb', 'tCoach', 'tTeam'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('need', g('needB', ''))
  + cueG('order', g('orderB', '')) + cueG('borrow', g('borrowB', '')) + cueG('own', g('ownB', ''))
  + cueG('walk', g('walkB', '')) + cueG('label', g('labelB', '')) + cueG('talk', g('talkB', ''))
  + cueG('price', g('priceB', '')) + cueG('react', g('reactB', '')) + cueG('worry', g('worryB', ''))
  + cueG('meet', g('meetB', '')) + cueG('first', g('firstB', '')) + cueG('proof', g('proofB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Mensen leiden lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.lead'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const LEAD_PLACE = pmMap.places.find((p) => p.module === 'pm.lead');
const MAPZ = [LEAD_PLACE.x + LEAD_PLACE.w / 2, LEAD_PLACE.y + LEAD_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.lead')}"`), 'the map lights pm.lead as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3's floor and the calendar
  { from: cam(175, 115, 60, 1.15), to: cam(172, 115, 60, 1.2) }, // s2 the buyer and the sponsor
  { from: cam(180, 95, 60, 1.15), to: cam(175, 98, 60, 1.2) }, // s3 the team lead and the crew
  { from: cam(205, 105, 60, 1.25), to: cam(210, 102, 60, 1.3) }, // s4 the buyer
  { from: cam(170, 92, 60, 1.2), to: cam(165, 95, 60, 1.25) }, // s5 the crew and the team lead
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.lead.intro',
  title: { nl: 'Lijn 3 verhuist: de mensen erbij', en: 'Line 3 moves: bringing the people along' },
  module: 'pm.lead',
  // the narrowest box that draws a topic title: the closing grid's tile (GRID.tile 190 less its padding); the route's rows
  // are wider. "conversations" (154 units) does not fit the kit's 128-unit tile, so the film declares the width it draws
  tileUnits: 178,
  // the map: per topic of pm.lead, the scene that explains it and its tile
  topics: {
    influence: { scene: 's2', cue: 'tInf' },
    feedback: { scene: 's3', cue: 'tFb' },
    coaching: { scene: 's4', cue: 'tCoach' },
    teams: { scene: 's5', cue: 'tTeam' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Lijn 3 moet voor het eind van de zomerstop in hal B staan. Het plan klopt, jij bent de jongste adviseur.', en: 'Line 3 must be in hall B before the summer shutdown ends. The plan is right, you are the youngest consultant.', focus: ['goal', 'floor', 'calendar'] },
        { nl: 'Twee mensen rapporteren niet aan jou: de inkoper bestelt de schakelkast, de teamleider maakt zijn ploeg vrij.', en: 'Two people do not report to you: the buyer orders the switchboard, the team lead frees his crew.', focus: ['need', 'buyer', 'teamlead', 'crew'] },
        { nl: 'Hoe krijg je hun hulp? We volgen dit project langs de vier onderwerpen van de module.', en: 'How do you get their help? We follow this project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Invloed', en: 'Influence' },
      beats: [
        { nl: 'Eerste onderwerp is Invloed zonder macht. Je kunt de inkoper niets opdragen. Wat doe je dan?', en: 'First topic is Influence without authority. You cannot order the buyer around. What do you do then?', focus: ['tInf', 'order', 'buyer'] },
        { nl: 'De sponsor leent je een beetje {t:Positiemacht|positiemacht}, en die slijt elke keer dat je hem gebruikt.', en: 'The sponsor lends you a little {t:Position power|position power}, and it wears thin each time you use it.', cue: { Positiemacht: 'borrow', 'Position power': 'borrow' }, focus: ['borrow', 'sponsor', 'buyer'] },
        { nl: 'Je kent de lijn: {t:Deskundigheidsmacht|deskundigheidsmacht}. Je houdt je woord: {t:Referentiemacht|referentiemacht}.', en: 'You know the line: {t:Expert power|expert power}. You keep your word: {t:Referent power|referent power}.', cue: { Deskundigheidsmacht: 'own', Referentiemacht: 'own', 'Expert power': 'own', 'Referent power': 'own' }, focus: ['own', 'buyer'] },
        { nl: 'Om te overtuigen gebruiken we {t:Wederkerigheid|wederkerigheid} en {t:Sociaal bewijs|sociaal bewijs}.', en: 'To persuade we use {t:Reciprocity|reciprocity} and {t:Social proof|social proof}.', cue: { Wederkerigheid: 'tool1', 'Sociaal bewijs': 'tool2', Reciprocity: 'tool1', 'Social proof': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Feedback', en: 'Feedback' },
      beats: [
        { nl: 'Tweede onderwerp is Feedback en moeilijke gesprekken. De teamleider liep twee keer weg tijdens de start.', en: 'Second topic is Feedback and difficult conversations. The team lead walked away twice during the start.', focus: ['tFb', 'walk', 'teamlead', 'crew'] },
        { nl: 'Zeg wat een camera zag, geen etiket. Hij liep weg, en de ploeg had geen plan.', en: 'Say what a camera saw, not a label. He walked away, and the crew had no plan.', focus: ['label', 'teamlead'] },
        { nl: 'Doe het snel, onder vier ogen, met een vraag. Lijn 4 stond stil, hij moest erheen.', en: 'Do it soon, in private, with a question. Line 4 had stopped, he had to go there.', focus: ['talk', 'teamlead'] },
        { nl: 'Bij feedback gebruiken we {t:SBI|SBI} en {t:Radical Candor|Radical Candor}.', en: 'For feedback we use {t:SBI|SBI} and {t:Radical Candor|Radical Candor}.', cue: { SBI: 'tool1', 'Radical Candor': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Luisteren', en: 'Listening' },
      beats: [
        { nl: 'Derde onderwerp is Luisteren en coachen. De inkoper vindt de schakelkast te duur.', en: 'Third topic is Listening and coaching. The buyer thinks the switchboard is too expensive.', focus: ['tCoach', 'price', 'buyer'] },
        { nl: 'Onder druk wil je verdedigen of oplossen. Luister eerst, en laat de stilte werken.', en: 'Under pressure you want to defend or fix. Listen first, and let the silence work.', focus: ['react', 'buyer'] },
        { nl: 'Wie aanvalt, heeft meestal een zorg. Bij de inkoper is het zijn gekorte budget.', en: 'Whoever attacks usually has a worry. The buyer’s is his budget, which has been cut.', focus: ['worry', 'buyer'] },
        { nl: 'We gebruiken {t:Actief luisteren|actief luisteren} en, om te coachen, {t:Toyota Kata|Toyota Kata}.', en: 'We use {t:Active listening|active listening} and, to coach, {t:Toyota Kata|Toyota Kata}.', cue: { 'Actief luisteren': 'tool1', 'Active listening': 'tool1', 'Toyota Kata': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Jezelf', en: 'Yourself' },
      beats: [
        { nl: 'Vierde onderwerp is Teams en jezelf leiden. Maandag vertel jij de ploeg hoe de verhuizing gaat.', en: 'Fourth topic is Leading teams and yourself. On Monday you tell the crew how the move goes.', focus: ['tTeam', 'meet', 'crew', 'teamlead'] },
        { nl: 'Een eerste indruk ontstaat snel. Ken je cijfers, zit aan tafel en laat het voorbehoud weg.', en: 'A first impression forms fast. Know your numbers, sit at the table and drop the hedge.', focus: ['first', 'crew', 'teamlead'] },
        { nl: 'Voel je je een bedrieger? Handel op bewijs, niet op gevoel.', en: 'Do you feel like a fraud? Act on evidence, not on feeling.', focus: ['proof', 'crew'] },
        { nl: 'We gebruiken een {t:Assertieve uitspraak|assertieve uitspraak} en {t:Herkaderen|herkaderen} van je zenuwen.', en: 'We use an {t:Assertive statement|assertive statement} and {t:Reframing|reframing} of your nerves.', cue: { 'Assertieve uitspraak': 'tool1', Herkaderen: 'tool2', 'Assertive statement': 'tool1', Reframing: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Eigen invloed, feedback op gedrag, luisteren, en duidelijk zeggen wat je voorstelt.', en: 'It connects. Your own influence, feedback on behaviour, listening, and saying clearly what you propose.', focus: ['flow', 'buyer', 'teamlead'] },
        { nl: 'De inkoper bestelt de schakelkast en de ploeg is vrij. Lijn 3 komt op zijn plek.', en: 'The buyer orders the switchboard and the crew is free. Line 3 gets into place.', focus: ['decision', 'buyer', 'teamlead', 'line3'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Op de kaart van Projecten is Mensen leiden het tweede station van Mensen en invloed.', en: 'On the map of Projects, Leading people is the second station of People and influence.', focus: mapCue('pm.lead') },
        { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.', en: 'This module has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Invloed zonder macht, op niveau Basis.', en: 'Start with Influence without authority, at Basics level.', focus: ['tInf', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen manipulatie, botte agressie, doeltoestanden en de fasen van een team erbij.', en: 'At Working knowledge you add manipulation, obnoxious aggression, target conditions and the stages of a team.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen ruilen met valuta, het identiteitsgesprek, coachingscycli en teamdynamiek erbij.', en: 'At Advanced you add trading with currency, the identity conversation, coaching cycles and team dynamics.', focus: 'lv3' },
        { nl: 'Op Expert komen coalities, feedback die je raakt, situationeel leiderschap en psychologische veiligheid erbij.', en: 'At Expert you add coalitions, feedback that hits you, situational leadership and psychological safety.', focus: 'lv4' },
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
// explaining them. Words checked with espeak-ng phonemes through Piper's own
// bridge (nl_NL-alex); this film's own SAY group (the last of the Dutch list in
// films/_kit/timeline.mjs) carries what it alone says: "Radical Candor". Toyota has
// its rule (pm.land.training), SBI its rule (pm.lead.feedback); the other names
// (wederkerigheid, sociaal bewijs, actief luisteren, Kata, herkaderen, valuta,
// coachingscycli, psychologische) are read right as they are. The film says "de
// ploeg", not operators.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Lijn 3 moet voor het einde van de zomerstop in hal B staan. Het plan klopt, maar jij bent de jongste adviseur.',
      en: 'Line 3 has to stand in hall B before the summer shutdown ends. The plan is right, but you are the youngest consultant.' },
    { nl: 'Twee mensen rapporteren niet aan jou. De inkoper moet deze week de schakelkast bestellen, anders komt hij te laat. De teamleider moet zijn ploeg vrijmaken voor de verhuizing.',
      en: 'Two people do not report to you. The buyer has to order the switchboard this week, or it arrives too late. The team lead has to free his crew for the move.' },
    { nl: 'Hoe krijg je hun hulp? We volgen dit project langs de vier onderwerpen van de module.',
      en: 'How do you get their help? We follow this project through the four topics of the module.' },
  ],
  [ // s2 influence without authority
    { nl: 'Het eerste onderwerp is Invloed zonder macht. Je kunt de inkoper niets opdragen. Wat doe je dan?',
      en: 'The first topic is Influence without authority. You cannot order the buyer around. What do you do then?' },
    { nl: 'De sponsor leent je maar een beetje positiemacht, en die slijt elke keer dat je hem gebruikt.',
      en: 'The sponsor only lends you a little position power, and it wears thin each time you use it.' },
    { nl: 'Je cijfers kloppen en je kent de lijn. Dat is {t:Deskundigheidsmacht|deskundigheidsmacht}. Je houdt je woord, en mensen werken graag met je. Dat is {t:Referentiemacht|referentiemacht}.',
      en: 'Your numbers are right and you know the line. That is {t:Expert power|expert power}. You keep your word, and people like working with you. That is {t:Referent power|referent power}.' },
    { nl: 'Om te overtuigen gebruiken we wederkerigheid en sociaal bewijs.',
      en: 'To persuade we use reciprocity and social proof.' },
  ],
  [ // s3 feedback and difficult conversations
    { nl: 'Het tweede onderwerp is Feedback en moeilijke gesprekken. De teamleider liep twee keer weg tijdens de start van de dienst.',
      en: 'The second topic is Feedback and difficult conversations. The team lead walked away twice during the start of the shift.' },
    { nl: 'Praat over gedrag, niet over karakter. Zeg wat een camera had opgenomen. Hij liep weg, en de ploeg kreeg het plan niet.',
      en: 'Talk about behaviour, not character. Say what a camera would have recorded. He walked away, and the crew did not get the plan.' },
    { nl: 'Doe het snel en onder vier ogen, met een vraag. Wat speelde er? Lijn 4 stond stil, en hij moest erheen.',
      en: 'Do it soon and in private, with a question. What was going on? Line 4 had stopped, and he had to go there.' },
    { nl: 'Bij feedback gebruiken we SBI en Radical Candor.',
      en: 'For feedback we use SBI and Radical Candor.' },
  ],
  [ // s4 listening and coaching
    { nl: 'Het derde onderwerp is Luisteren en coachen. De inkoper vindt de schakelkast te duur.',
      en: 'The third topic is Listening and coaching. The buyer thinks the switchboard is too expensive.' },
    { nl: 'Onder druk wil je jezelf verdedigen of meteen oplossen. Luister eerst, en laat de stilte werken.',
      en: 'Under pressure you want to defend yourself or fix it right away. Listen first, and let the silence work.' },
    { nl: 'Wie het project aanvalt, heeft meestal een zorg eronder. Bij de inkoper is dat zijn budget, dat al gekort is.',
      en: 'Whoever attacks the project usually has a worry underneath. The buyer’s is his budget, which has already been cut.' },
    { nl: 'We gebruiken actief luisteren en, om te coachen, Toyota Kata.',
      en: 'We use active listening and, to coach, Toyota Kata.' },
  ],
  [ // s5 leading teams and yourself
    { nl: 'Het vierde onderwerp is Teams en jezelf leiden. Maandag vertel jij de ploeg en de teamleider hoe de verhuizing gaat.',
      en: 'The fourth topic is Leading teams and yourself. On Monday you tell the crew and the team lead how the move goes.' },
    { nl: 'Een eerste indruk ontstaat snel. Ken je cijfers, zit aan tafel en laat het voorbehoud weg.',
      en: 'A first impression forms fast. Know your numbers, sit at the table and drop the hedge.' },
    { nl: 'Voel je je een bedrieger? Dan handel je op bewijs, niet op gevoel.',
      en: 'Do you feel like a fraud? Then you act on evidence, not on feeling.' },
    { nl: 'We gebruiken een assertieve uitspraak en herkaderen van je zenuwen.',
      en: 'We use an assertive statement and reframing of your nerves.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Je bouwt eigen invloed op, geeft feedback op gedrag, en luistert naar de zorg erachter. Dan zeg je duidelijk wat je voorstelt.',
      en: 'It connects. You build your own influence, give feedback on behaviour, and listen for the worry behind it. Then you say clearly what you propose.' },
    { nl: 'De inkoper bestelt de schakelkast, nu zijn zorg gehoord is. De teamleider geeft zijn ploeg vrij, want ook zijn zorg om lijn 4 is gehoord. Lijn 3 komt op zijn plek.',
      en: 'The buyer orders the switchboard, now that his worry has been heard. The team lead frees his crew, because his worry about line 4 has been heard too. Line 3 gets into place.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Mensen leiden is het tweede station van Mensen en invloed.',
      en: 'This is the map of Projects. Leading people is the second station of People and influence.' },
    { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.',
      en: 'This module has four topics, each with four levels.' },
    { nl: 'Begin bij Invloed zonder macht, op niveau Basis.',
      en: 'Start with Influence without authority, at Basics level.' },
    { nl: 'Op Werkkennis komen manipulatie, botte agressie, doeltoestanden en de fasen van een team erbij.',
      en: 'At Working knowledge you add manipulation, obnoxious aggression, target conditions and the stages of a team.' },
    { nl: 'Op Gevorderd komen ruilen met valuta, het identiteitsgesprek, coachingscycli en teamdynamiek erbij.',
      en: 'At Advanced you add trading with currency, the identity conversation, coaching cycles and team dynamics.' },
    { nl: 'Op Expert komen coalities, feedback die je raakt, situationeel leiderschap en psychologische veiligheid erbij.',
      en: 'At Expert you add coalitions, feedback that hits you, situational leadership and psychological safety.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="buyer"],[data-cue="crew"],[data-cue="teamlead"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de film over de mensenkant van het project. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met de kabel van buiten, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp staan er mensen: de inkoper, de teamleider van de lijn, twee mensen van de ploeg en de sponsor. Aan het eind staat lijn 3 op zijn plek en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel en de vier onderwerpen van de module als tegels; opdragen dat niet werkt, geleende macht van de sponsor die slijt, en eigen deskundigheid en referentie; de teamleider die tweemaal wegliep, een etiket dat doorgestreept is naast wat een camera zag, en een snel gesprek onder vier ogen met een vraag; een inkoper die de kast te duur vindt, verdedigen en oplossen die niet helpen, en de zorg eronder; maandag voor de ploeg met drie dingen die werken en een bedrieger die handelt op bewijs; per onderwerp twee namen van hulpmiddelen; en de keten van eigen invloed naar het besluit. Aan het eind de kaart van Projecten met Mensen leiden verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go, as in the film about the people side of the project. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with the cable from outside, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the buyer, the team lead of the line, two members of the crew and the sponsor. At the end line 3 stands in place and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the goal and the module’s four topics as tiles; ordering people around that does not work, the sponsor’s borrowed power that wears thin, and your own expertise and reference; the team lead who walked away twice, a label crossed out next to what a camera saw, and a quick one-to-one talk with a question; a buyer who finds the switchboard too expensive, defending and fixing that do not help, and the worry underneath; Monday in front of the crew with three things that work and a fraud who acts on evidence; two tool names per topic; and the chain from your own influence to the decision. At the end the map of Projects with Leading people lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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


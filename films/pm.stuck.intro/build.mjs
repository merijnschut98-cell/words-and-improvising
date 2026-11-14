// Dev tool, not shipped. Builds the module intro film "Lijn 3 staat stil / Line 3
// stands still" for Als je vastzit (pm.stuck), the sixth module intro film (v17) and
// the first of the cluster "Mensen en invloed": the high-over picture at the top of the
// module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing
// I need the most").
//
//   node films/pm.stuck.intro/build.mjs            build the page
//   node films/pm.stuck.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.stuck.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.stuck's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro): ONE concrete project
// travels through the whole module, the map before the detail, no calculations.
// The world of field film 2 (films/pm.field.people), whose station for this module
// this intro agrees with: line 3 moves to hall B, the materials and the plan are
// right, and the project is stuck; line 3 stands still and nobody knows why. The
// same hall and the same people (the sponsor, the team lead of the line, two
// operators); the station's two tools, triangulation and a decision log, are the
// ones named here. The story is drawn in the room:
//   s1 line 3 has to stand in hall B before the summer shutdown ends, plan and
//      materials are right, the line stands still; the module's four topics
//   s2 Diagnose: waarom het vastzit: the four kinds of stuck, the four questions,
//      the goal and the way are clear but the team lead does not give his support:
//      a people problem                                  → pm.stuck.diagnose
//   s3 Als je het niet weet: the sponsor asks when line 3 runs again; say you do not
//      know and when you will; know, think, do not know → pm.stuck.buytime
//   s4 Weerstand en politiek: the team lead says "good idea, but not right now";
//      pushing or working around makes it worse; a one-to-one talk, then escalate
//      and tell him first                                → pm.stuck.blocker
//   s5 Herstarten met de sponsor: decide, make room, give air cover; ask concretely
//      with a name and a date                            → pm.stuck.sponsor
//   s6 one whole: the chain from the facts to the sponsor's decision; the operators
//      are free again and line 3 moves into its place
//   s7 the shared Projects map with Als je vastzit lit, then the module's four topics
//      with their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.stuck.diagnose, .buytime, .blocker,
// .sponsor). Each topic scene names the tools of that topic's lessons in one short
// sentence, without explaining them (Merijn's checkpoint, 14 Nov): triangulation and a
// decision log (pm.stuck.facts), a holding statement and a range (pm.stuck.buytime),
// the three levels of resistance (pm.stuck.blocker) and a sponsor check-in
// (pm.stuck.sponsor). Only real tools: a call-back moment (client pressure, and the same idea as
// the holding statement) and a small win (an outcome, not a tool) are left out, and the
// Werkkennis lessons on them are what s7 says that level adds. Terms come from the module's lessons and {n:} numbers from the
// module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the
// film to its map (every topic named in a caption of its own scene, explained in two
// beats and lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor
// and the team lead from its cast, the two operators drawn with pm.agile.scrum's cast
// (films/pm.agile.scrum/cast.mjs). The things of hall B are the pilot's
// (../pm.plan.intro/hall.mjs, imported, not copied). A panel at the right, in stage
// space, draws each step as a schema, labelled "voorbeeld" (line 3's story) or
// "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.stuck');
const LEVELS = {
  diagnose: ['pm.stuck.diagnose', 'pm.stuck.facts', 'pm.stuck.rootcause', 'pm.stuck.healthcheck'],
  unknown: ['pm.stuck.buytime', 'pm.stuck.askhelp', 'pm.stuck.experiment', 'pm.stuck.cynefin'],
  politics: ['pm.stuck.blocker', 'pm.stuck.pressure', 'pm.stuck.hidden', 'pm.stuck.turf'],
  restart: ['pm.stuck.sponsor', 'pm.stuck.smallwins', 'pm.stuck.reset', 'pm.stuck.recovery'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.stuck has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: four kinds of stuck, the four questions (the first no is where you start), a diagnosis on feeling convinces nobody
// and the two tools: triangulation and the decision log (pm.stuck.facts, the Werkkennis lesson; the field film's pair)
has('pm.stuck.diagnose', ['vier soorten vastzitten', 'Onduidelijk doel', 'Onduidelijke weg', 'Mensenprobleem', 'Capaciteitsprobleem', 'Is er iemand wiens steun we nodig hebben en niet hebben', 'Het eerste “nee” is meestal waar je begint']);
has('pm.stuck.diagnose', ['four kinds of stuck', 'Unclear goal', 'Unclear way', 'People problem', 'Capacity problem', 'Is there someone whose support we need and don’t have', 'The first “no” is usually where you start'], 'en');
has('pm.stuck.facts', ['Een diagnose op gevoel overtuigt niemand', 'Triangulatie', 'Besluitenlijst']);
has('pm.stuck.facts', ['A diagnosis based on a feeling convinces nobody', 'Triangulation', 'Decision log'], 'en');
// s3: when you do not know, say so and say when; the split of known, thought and unknown; never bluff; the two tools
has('pm.stuck.buytime', ['Weet je het niet, zeg dat dan, en zeg wanneer je het wel weet', 'Scheid wat je weet, wat je denkt en wat je niet weet', 'Bluf nooit', 'Een beloofd antwoord op donderdag dat op donderdag komt', 'Tussenbericht', 'Bandbreedte']);
has('pm.stuck.buytime', ['When you don’t know, say so, and say when you will', 'Separate what you know, what you think, and what you don’t know', 'Never bluff', 'A promised answer on Thursday that arrives on Thursday', 'Holding statement', 'Range'], 'en');
// s4: a blocker rarely says a hard no; pushing and working around make it worse; understand why; one-to-one; escalate and
// tell him first; the tool: the three levels of resistance (Basis), a model for diagnosing resistance; he may fear for line 4 (level 2, a feared loss)
has('pm.stuck.blocker', ['“goed idee, maar nu even niet”', 'Allebei maken het meestal erger', 'Begin met begrijpen waarom', 'Het gesprek voer je onder vier ogen', 'je zegt het hem eerst', 'Drie niveaus van weerstand']);
has('pm.stuck.blocker', ['“good idea, but not right now”', 'Both usually make it worse', 'Start by understanding why', 'You have the conversation one-on-one', 'you tell him first', 'Three levels of resistance'], 'en');
// s5: the sponsor's three jobs, a concrete ask with a name and a date; the tool: the sponsor check-in (Basis)
has('pm.stuck.sponsor', ['Zit een project vast, dan kan de sponsor het meestal los krijgen', 'Beslissen', 'Ruimte maken', 'Rugdekking geven', 'Vraag concreet, met naam en datum', 'dat de planners een dag per week vrij zijn', 'Sponsorgesprek']);
has('pm.stuck.sponsor', ['When a project is stuck, the sponsor can usually get it moving', 'Deciding', 'Making room', 'Giving air cover', 'Ask concretely, with a name and a date', 'that the planners are free one day a week', 'Sponsor check-in'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.stuck.facts', 'Feiten verzamelen'], ['pm.stuck.askhelp', 'hulp vragen'], ['pm.stuck.pressure', 'klant druk zet'], ['pm.stuck.smallwins', 'kleine successen'],
  ['pm.stuck.rootcause', 'Oorzaken onder de oppervlakte'], ['pm.stuck.experiment', 'Handelen onder onzekerheid'], ['pm.stuck.hidden', 'Ja zeggen, nee doen'], ['pm.stuck.reset', 'herstarten'],
  ['pm.stuck.healthcheck', 'projectreview'], ['pm.stuck.cynefin', 'Welk soort probleem is dit'], ['pm.stuck.turf', 'twee afdelingen'], ['pm.stuck.recovery', 'rood project']]) has(id, [word]);
for (const [id, word] of [['pm.stuck.facts', 'Getting the facts'], ['pm.stuck.askhelp', 'Asking for help'], ['pm.stuck.pressure', 'When the client pushes'], ['pm.stuck.smallwins', 'small wins'],
  ['pm.stuck.rootcause', 'Causes below the surface'], ['pm.stuck.experiment', 'Acting under uncertainty'], ['pm.stuck.hidden', 'Saying yes, doing no'], ['pm.stuck.reset', 'Resetting'],
  ['pm.stuck.healthcheck', 'project review'], ['pm.stuck.cynefin', 'What kind of problem is this'], ['pm.stuck.turf', 'two departments'], ['pm.stuck.recovery', 'red project']]) has(id, [word], 'en');
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
// the topic titles fit the kit's default tile (128 units of text, up to three lines, no word wider), so the film
// declares no tileUnits of its own; the closing grid's tile (GRID.tile - 12 units) holds them too
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

// the people: the sponsor and the team lead of the line are the pm cast; the two operators are pm.agile.scrum's figures.
// Each stands in a cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
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
// the panel; its place Als je vastzit is a cue group of its own (map-stuck).
const tiles = ['tDiag', 'tUnk', 'tPol', 'tRes'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', ''))
  + cueG('kinds', g('kindsB', '')) + cueG('ask', g('askB', ''))
  + cueG('qa', g('qaB', '')) + cueG('know', g('knowB', ''))
  + cueG('quote', g('quoteB', '')) + cueG('reflex', g('reflexB', '')) + cueG('talk', g('talkB', ''))
  + cueG('tasks', g('tasksB', '')) + cueG('conc', g('concB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Als je vastzit lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.stuck'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const STUCK_PLACE = pmMap.places.find((p) => p.module === 'pm.stuck');
const MAPZ = [STUCK_PLACE.x + STUCK_PLACE.w / 2, STUCK_PLACE.y + STUCK_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.stuck')}"`), 'the map lights pm.stuck as a cue group');

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
  { from: cam(165, 90, 60, 1.15), to: cam(160, 95, 60, 1.2) }, // s2 the team lead and the operators
  { from: cam(125, 120, 60, 1.25), to: cam(130, 115, 60, 1.3) }, // s3 the sponsor
  { from: cam(165, 90, 60, 1.2), to: cam(160, 95, 60, 1.25) }, // s4 the team lead and the operators at line 3
  { from: cam(135, 125, 60, 1.2), to: cam(140, 120, 60, 1.25) }, // s5 the sponsor and the team lead
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.stuck.intro',
  title: { nl: 'Lijn 3 staat stil: weer in beweging', en: 'Line 3 stands still: moving again' },
  module: 'pm.stuck',
  // the room of text in a topic tile: the kit's default (the four titles fit it, see the module section above)
  tileUnits: 128,
  // the map: per topic of pm.stuck, the scene that explains it and its tile
  topics: {
    diagnose: { scene: 's2', cue: 'tDiag' },
    unknown: { scene: 's3', cue: 'tUnk' },
    politics: { scene: 's4', cue: 'tPol' },
    restart: { scene: 's5', cue: 'tRes' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Lijn 3 moet voor het eind van de zomerstop in hal B staan. Plan en materiaal kloppen, de lijn staat stil.', en: 'Line 3 must stand in hall B before the summer shutdown ends. Plan and materials are right, it stands still.', focus: ['goal', 'floor', 'calendar'] },
        { nl: 'Niemand weet waarom. Jij leidt het project, en de sponsor wil weten wat er aan de hand is.', en: 'Nobody knows why. You lead the project, and the sponsor wants to know what is going on.', focus: ['goal', 'sponsor', 'crew'] },
        { nl: 'We volgen dit project langs de vier onderwerpen van de module.', en: 'We follow this project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Diagnose', en: 'Diagnosis' },
      beats: [
        { nl: 'Eerste onderwerp is Diagnose: waarom het vastzit. Welke soort vastzitten is het?', en: 'First topic is Diagnosing why it’s stuck. Which kind of stuck is it?', focus: ['tDiag', 'teamlead', 'crew'] },
        { nl: 'Vier soorten vastzitten: onduidelijk doel, onduidelijke weg, mensenprobleem of capaciteitsprobleem.', en: 'Four kinds of stuck: unclear goal, unclear way, people problem or capacity problem.', focus: ['kinds', 'crew'] },
        { nl: 'Begin bij het eerste nee. De teamleider geeft zijn steun niet. Dat is een {t:Mensenprobleem|mensenprobleem}.', en: 'Start at the first no. The team lead does not give his support. That is a {t:People problem|people problem}.', cue: { Mensenprobleem: 'ask', 'People problem': 'ask' }, focus: ['ask', 'kinds', 'teamlead'] },
        { nl: 'Een diagnose op gevoel overtuigt niemand. Zoek de feiten.', en: 'A diagnosis based on a feeling convinces nobody. Look for the facts.', focus: ['ask', 'teamlead'] },
        { nl: 'Voor de feiten gebruiken we {t:Triangulatie|triangulatie} en een {t:Besluitenlijst|besluitenlijst}.', en: 'For the facts we use {t:Triangulation|triangulation} and a {t:Decision log|decision log}.', cue: { Triangulatie: 'tool1', Besluitenlijst: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Niet weten', en: 'Not knowing' },
      beats: [
        { nl: 'Tweede onderwerp is Als je het niet weet. De sponsor vraagt iets wat je niet weet.', en: 'Second topic is When you don’t know. The sponsor asks something you do not know.', focus: ['tUnk', 'sponsor'] },
        { nl: 'Wanneer draait lijn 3 weer? Je weet het niet. Zeg dat, en zeg wanneer je het wel weet.', en: 'When does line 3 run again? You do not know. Say so, and say when you will.', focus: ['qa', 'sponsor'] },
        { nl: 'Scheid wat je weet, wat je denkt en wat je nog niet weet. Bluf nooit.', en: 'Separate what you know, what you think and what you do not know yet. Never bluff.', focus: ['know', 'sponsor'] },
        { nl: 'Bij niet weten gebruiken we een {t:Tussenbericht|tussenbericht} en een {t:Bandbreedte|bandbreedte}.', en: 'When you do not know we use a {t:Holding statement|holding statement} and a {t:Range|range}.', cue: { Tussenbericht: 'tool1', Bandbreedte: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Weerstand', en: 'Resistance' },
      beats: [
        { nl: 'Derde onderwerp is Weerstand en politiek. De teamleider zegt: goed idee, maar nu even niet.', en: 'Third topic is Resistance and politics. The team lead says: good idea, but not right now.', focus: ['tPol', 'quote', 'teamlead', 'crew'] },
        { nl: 'Duwen of er omheen werken maakt het meestal erger. Begin met begrijpen waarom. Vreest hij voor lijn 4?', en: 'Pushing or working around him usually makes it worse. Start by understanding why. Does he fear for line 4?', focus: ['reflex', 'teamlead', 'line4'] },
        { nl: 'Praat onder vier ogen. Lukt dat niet, dan escaleer je, en je zegt het hem eerst.', en: 'Talk one to one. If that fails, you escalate, and you tell him first.', focus: ['talk', 'teamlead'] },
        { nl: 'We gebruiken {t:Drie niveaus van weerstand|drie niveaus van weerstand}.', en: 'We use the {t:Three levels of resistance|three levels of resistance}.', cue: { 'Drie niveaus van weerstand': 'tool1' }, focus: ['tool1'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Herstart', en: 'Restart' },
      beats: [
        { nl: 'Vierde onderwerp is Herstarten met de sponsor. Wat heb je van je sponsor nodig?', en: 'Fourth topic is Restarting with the sponsor. What do you need from your sponsor?', focus: ['tRes', 'sponsor'] },
        { nl: 'Een sponsor beslist, maakt ruimte en geeft {t:Rugdekking|rugdekking}, maar alleen als jij vraagt.', en: 'A sponsor decides, makes room and gives {t:Air cover|air cover}, but only if you ask.', cue: { Rugdekking: 'tasks', 'Air cover': 'tasks' }, focus: ['tasks', 'sponsor'] },
        { nl: 'Vraag concreet, met naam en datum. Zeg jij maandag tegen de teamleider dat de ploeg vrij is?', en: 'Ask concretely, with a name and a date. Will you tell the team lead on Monday that the crew is free?', focus: ['conc', 'sponsor', 'teamlead'] },
        { nl: 'Bij herstarten gebruiken we een {t:Sponsorgesprek|sponsorgesprek}.', en: 'To restart we use a {t:Sponsor check-in|sponsor check-in}.', cue: { Sponsorgesprek: 'tool1' }, focus: ['tool1'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Je zoekt feiten, blijft eerlijk, praat met de teamleider, en dan beslist de sponsor.', en: 'It connects. You look for facts, stay honest, talk to the team lead, and then the sponsor decides.', focus: ['flow', 'teamlead'] },
        { nl: 'De sponsor zegt het maandag tegen de teamleider. De ploeg is vrij en lijn 3 komt in beweging.', en: 'The sponsor tells the team lead on Monday. The crew is free and line 3 gets moving.', focus: ['decision', 'sponsor', 'line3'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Op de kaart van Projecten is Als je vastzit het eerste station van Mensen en invloed.', en: 'On the map of Projects, When you’re stuck is the first station of People and influence.', focus: mapCue('pm.stuck') },
        { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.', en: 'This module has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Diagnose: waarom het vastzit, op niveau Basis.', en: 'Start with Diagnosing why it’s stuck, at Basics level.', focus: ['tDiag', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen feiten verzamelen, hulp vragen, klantdruk en kleine successen erbij.', en: 'At Working knowledge you add getting facts, asking for help, client pressure and small wins.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen diepere oorzaken, onzekerheid, het stille veto en de herstart erbij.', en: 'At Advanced you add deeper causes, uncertainty, the pocket veto and the reset.', focus: 'lv3' },
        { nl: 'Op Expert komen de projectreview, het soort probleem, vastzittende afdelingen en een rood project erbij.', en: 'At Expert you add the project review, the kind of problem, stuck departments and a red project.', focus: 'lv4' },
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
// films/_kit/timeline.mjs) carries what it alone says. The word blokkeerder is not
// said (the voice reads it "BLOK-i-der"): the film says "blokkeren".
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Lijn 3 moet voor het einde van de zomerstop in hal B staan. Plan en materiaal kloppen, maar de lijn staat stil.',
      en: 'Line 3 has to stand in hall B before the summer shutdown ends. Plan and materials are right, but the line stands still.' },
    { nl: 'Niemand weet waarom. Jij leidt het project, en de sponsor wil weten wat er aan de hand is.',
      en: 'Nobody knows why. You lead the project, and the sponsor wants to know what is going on.' },
    { nl: 'We volgen dit project langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this project through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 diagnosis
    { nl: 'Het eerste onderwerp is Diagnose, waarom het vastzit. Welke soort vastzitten is het?',
      en: 'The first topic is Diagnosing why it is stuck. Which kind of stuck is it?' },
    { nl: 'Er zijn vier soorten vastzitten. Onduidelijk doel, onduidelijke weg, een mensenprobleem of een capaciteitsprobleem.',
      en: 'There are four kinds of stuck. An unclear goal, an unclear way, a people problem or a capacity problem.' },
    { nl: 'Stel vier vragen, en begin bij het eerste nee. Doel en weg zijn helder, maar de teamleider geeft zijn steun niet. Dat is een {t:Mensenprobleem|mensenprobleem}.',
      en: 'Ask four questions, and start at the first no. The goal and the way are clear, but the team lead does not give his support. That is a {t:People problem|people problem}.' },
    { nl: 'Een diagnose op gevoel overtuigt niemand, dus zoek je de feiten.',
      en: 'A diagnosis based on a feeling convinces nobody, so you look for the facts.' },
    { nl: 'Voor de feiten gebruiken we triangulatie en een besluitenlijst.',
      en: 'For the facts we use triangulation and a decision log.' },
  ],
  [ // s3 not knowing
    { nl: 'Het tweede onderwerp is Als je het niet weet. De sponsor vraagt iets wat je niet weet. Wat zeg je dan?',
      en: 'The second topic is When you do not know. The sponsor asks something you do not know. What do you say then?' },
    { nl: 'De sponsor vraagt wanneer lijn 3 weer draait. Je weet het niet. Zeg dat, en zeg wanneer je het wel weet. Komt het antwoord op die dag, dan bouwt dat vertrouwen.',
      en: 'The sponsor asks when line 3 runs again. You do not know. Say so, and say when you will. When the answer comes on that day, it builds trust.' },
    { nl: 'Scheid wat je weet, wat je denkt en wat je nog niet weet. Bluf nooit.',
      en: 'Separate what you know, what you think and what you do not know yet. Never bluff.' },
    { nl: 'Bij niet weten gebruiken we een tussenbericht en een bandbreedte.',
      en: 'When you do not know we use a holding statement and a range.' },
  ],
  [ // s4 resistance and politics
    { nl: 'Het derde onderwerp is Weerstand en politiek. De teamleider zegt dat het een goed idee is, maar nu even niet. Zo blokkeren mensen zelden met een hard nee.',
      en: 'The third topic is Resistance and politics. The team lead says it is a good idea, but not right now. People rarely block with a hard no.' },
    { nl: 'Duwen of er omheen werken maakt het meestal erger. Begin met begrijpen waarom. Misschien vreest hij dat lijn 4 het zwaar krijgt als zijn ploeg wegloopt.',
      en: 'Pushing or working around him usually makes it worse. Start by understanding why. Maybe he fears that line 4 will struggle if his crew goes away.' },
    { nl: 'Praat onder vier ogen en vraag wat het lastig maakt. Lukt dat niet, dan escaleer je, en je zegt het hem eerst.',
      en: 'Talk one to one and ask what makes it hard. If that fails, you escalate, and you tell him first.' },
    { nl: 'Daarbij gebruiken we de drie niveaus van weerstand.',
      en: 'For this we use the three levels of resistance.' },
  ],
  [ // s5 restarting with the sponsor
    { nl: 'Het vierde onderwerp is Herstarten met de sponsor. Wat heb je van je sponsor nodig?',
      en: 'The fourth topic is Restarting with the sponsor. What do you need from your sponsor?' },
    { nl: 'Een sponsor kan een vastgelopen project meestal los krijgen. Hij beslist, maakt ruimte en geeft {t:Rugdekking|rugdekking}, maar alleen als jij vraagt.',
      en: 'A sponsor can usually get a stuck project moving. He decides, makes room and gives {t:Air cover|air cover}, but only if you ask.' },
    { nl: 'Vraag concreet, met naam en datum. Zeg jij maandag tegen de teamleider dat de ploeg een dag per week vrij is?',
      en: 'Ask concretely, with a name and a date. Will you tell the team lead on Monday that the crew is free one day a week?' },
    { nl: 'Bij herstarten gebruiken we een sponsorgesprek.',
      en: 'To restart we use a sponsor check-in.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Je zoekt de feiten, je blijft eerlijk over wat je niet weet, en je praat met de teamleider. Dan beslist de sponsor.',
      en: 'It connects. You look for the facts, you stay honest about what you do not know, and you talk to the team lead. Then the sponsor decides.' },
    { nl: 'De sponsor zegt het maandag tegen de teamleider. De ploeg is weer vrij, en lijn 3 komt in beweging. Het besluit staat op de besluitenlijst.',
      en: 'The sponsor says it to the team lead on Monday. The crew is free again, and line 3 gets moving. The decision is on the decision log.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Als je vastzit is het eerste station van Mensen en invloed.',
      en: 'This is the map of Projects. When you are stuck is the first station of People and influence.' },
    { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.',
      en: 'This module has four topics, each with four levels.' },
    { nl: 'Begin bij Diagnose, waarom het vastzit, op niveau Basis.',
      en: 'Start with Diagnosing why it is stuck, at Basics level.' },
    { nl: 'Op Werkkennis komen feiten verzamelen, hulp vragen, klantdruk en kleine successen erbij.',
      en: 'At Working knowledge you add getting facts, asking for help, client pressure and small wins.' },
    { nl: 'Op Gevorderd komen diepere oorzaken, onzekerheid, het stille veto en de herstart erbij.',
      en: 'At Advanced you add deeper causes, uncertainty, the pocket veto and the reset.' },
    { nl: 'Op Expert komen de projectreview, het soort probleem, vastzittende afdelingen en een rood project erbij.',
      en: 'At Expert you add the project review, the kind of problem, stuck departments and a red project.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de film over de mensenkant van het project. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met de kabel van buiten, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp staan er mensen: de teamleider van de lijn, twee mensen van de ploeg en de sponsor. Aan het eind staat lijn 3 op zijn plek en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel en de vier onderwerpen van de module als tegels; de vier soorten vastzitten met vier vragen waarvan het derde antwoord nee is; een vraag van de sponsor met een eerlijk antwoord en wat je weet, denkt en nog niet weet; een opmerking van de teamleider, duwen en eromheen werken die niet helpen, en een gesprek onder vier ogen; wat een sponsor doet en een vraag met naam, wat en datum; per onderwerp twee namen van hulpmiddelen; en de keten van feiten naar het besluit van de sponsor. Aan het eind de kaart van Projecten met Als je vastzit verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go, as in the film about the people side of the project. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with the cable from outside, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the team lead of the line, two members of the crew and the sponsor. At the end line 3 stands in place and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the goal and the module’s four topics as tiles; the four kinds of stuck with four questions, the third answered no; a question from the sponsor with an honest answer, and what you know, think and do not know yet; a remark from the team lead, pushing and working around that do not help, and a one-to-one conversation; what a sponsor does and a question with a name, a what and a date; two tool names per topic; and the chain from the facts to the sponsor’s decision. At the end the map of Projects with When you’re stuck lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

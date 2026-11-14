// Dev tool, not shipped. Builds the module intro film "Lijn 3 in uitvoering /
// Line 3 under way" for Uitvoeren (pm.run), the third module intro film (v17):
// the high-over picture at the top of the module, before its four topics
// (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.run.intro/build.mjs            build the page
//   node films/pm.run.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.run.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.run's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro): ONE concrete project
// travels through the whole module, the map before the detail, no calculations.
// Same hall B and cast as the pilot and field film 1 (films/pm.field.lifecycle,
// whose Run station this intro agrees with: an honest status with the switchboard
// late, amber; a change request for line 4; the A3 status report and the
// decision log). Now the shutdown is running, and the STORY IS DRAWN IN THE ROOM:
//   s1 the shutdown has begun: the hall, line 3's outline, the calendar; the
//      sponsor; the module's four topics as a route on the panel
//   s2 Sturen en rapporteren: the buyer reports the switchboard late, an honest
//      status in amber, bad news early is cheap     → pm.run.status (steerco)
//   s3 Scope en wijzigingen: "line 4 as well?" from the team lead, scope creep, a
//      change request with its price, the sponsor chooses → pm.run.scope (change)
//   s4 Team en overleg: the operators and the team lead at a stand-up, the three
//      meetings, every meeting ends in decisions and actions → pm.run.rhythm
//   s5 Issues en escalatie: the late switchboard is a risk that came true, an issue
//      in the issue log with one owner (the buyer); it goes up to the sponsor
//      with a proposal                              → pm.run.issues (decisions)
//   s6 one rhythm: what happens in the team reaches the status; what it cannot
//      decide goes up; the sponsor chooses, line 4 comes after the shutdown
//   s7 the shared Projects map with Run lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.run.status, .scope, .rhythm,
// .issues). Each topic scene names two tools of that topic's lessons in one
// short sentence, without explaining them (Merijn's checkpoint, 14 Nov). Terms
// come from the module's lessons and {n:} numbers from the module's text (the
// kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its map
// (every topic named in a caption of its own scene, explained in two beats and
// lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast, the buyer and two operators drawn
// with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs). The things of hall B
// are the pilot's (../pm.plan.intro/hall.mjs, imported, not copied). A panel at
// the right, in stage space, draws each step as a schema, labelled "voorbeeld"
// (the line's execution) or "schema" (the module's map).
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
// module's topics or levels move): s7 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'pm.run');
const LEVELS = {
  steer: ['pm.run.status', 'pm.run.steerco', 'pm.run.earned', 'pm.run.exception'],
  scope: ['pm.run.scope', 'pm.run.change', 'pm.run.replan', 'pm.run.rescope'],
  team: ['pm.run.rhythm', 'pm.run.team', 'pm.run.conflict', 'pm.run.workstreams'],
  issues: ['pm.run.issues', 'pm.run.decisions', 'pm.run.tiers', 'pm.run.multiparty'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.run has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: the status and its colours, bad news early, and the two tools (the A3 status report, the forecast)
has('pm.run.status', ['rood, oranje of groen', 'Oranje, risico, maar het team kan het met eigen acties herstellen', 'Slecht nieuws vroeg is goedkoop', 'een probleem neerleggen bij iemand die kan beslissen of helpen, met een voorstel']);
has('pm.run.status', ['Bad news early is cheap'], 'en');
has('pm.run.steerco', ['A3-statusrapport']);
has('pm.run.steerco', ['A3 status report'], 'en');
has('pm.run.status', ['Prognose', 'Meld een prognose, niet alleen voortgang']);
has('pm.run.status', ['Forecast'], 'en');
// s3: scope creep, the change request and its price; the tools (the change log, the impact analysis)
has('pm.run.scope', ['als je toch bezig bent, kun je ook even naar lijn 4 kijken', 'Scope creep is die scope die ongemerkt groeit', 'een wijzigingsverzoek: een schriftelijk verzoek met de impact, waar de sponsor over beslist', 'wat je opgeeft om iets anders te krijgen']);
has('pm.run.scope', ['while you’re at it, can you also look at line 4', 'a change request: a written request with its impact, which the sponsor decides on'], 'en');
has('pm.run.change', ['Wijzigingslog', 'Impactanalyse']);
has('pm.run.change', ['Change log', 'Impact analysis'], 'en');
// s4: the three meetings, the decision note and the minutes
has('pm.run.rhythm', ['Een project draait op drie overleggen', 'Een stand-up', 'Een wekelijks teamoverleg', 'een stuurgroep elke vier tot zes weken', 'Besluitnotitie', 'Notulen', 'besluiten, bespreken of informeren', 'besluiten en acties']);
has('pm.run.rhythm', ['A project runs on three meetings', 'decisions and actions'], 'en');
// s5: a risk that comes true is an issue; one owner; the issue log; escalating with a proposal; the escalation path and the decision log
has('pm.run.issues', ['Een issue is een probleem dat nu speelt en actie vraagt', 'Als een risico werkelijkheid wordt, verhuist het van de risicolijst naar de issuelog', 'Elk issue heeft één eigenaar', 'Issuelog']);
has('pm.run.issues', ['When a risk comes true, it moves from the risk register to the issue log', 'Every issue has one owner'], 'en');
has('pm.run.decisions', ['Besluitenlijst', 'Escalatieroute']);
has('pm.run.decisions', ['Decision log', 'Escalation path'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.run.steerco', 'stuurgroep voorbereiden'], ['pm.run.change', 'Wijzigingen beheersen'], ['pm.run.team', 'zonder macht'], ['pm.run.decisions', 'Besluiten voor elkaar krijgen'],
  ['pm.run.earned', 'earned value'], ['pm.run.replan', 'Herplannen en reserves'], ['pm.run.conflict', 'lastige gesprek'], ['pm.run.tiers', 'Escaleren in lagen'],
  ['pm.run.exception', 'Sturen op uitzondering'], ['pm.run.rescope', 'Bijsturen of stoppen'], ['pm.run.workstreams', 'werkstromen'], ['pm.run.multiparty', 'tussen bedrijven']]) has(id, [word]);
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

// ---------------------------------------------------------------- the world (hall B)
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

// the people: the sponsor and the team lead of the line are the pm cast; the buyer and the two operators are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
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
// scene's parts. Each topic scene has two tool chips (tool1, tool2) for the two
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Run is a cue group of its own (map-run).
const tiles = ['tSteer', 'tScope', 'tTeam', 'tIssues'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', ''))
  + cueG('status', g('statusB', '')) + cueG('news', g('newsB', ''))
  + cueG('request', g('requestB', '')) + cueG('impact', g('impactB', '')) + cueG('cr', g('crB', ''))
  + cueG('standup', g('standupB', '')) + cueG('weekly', g('weeklyB', '')) + cueG('steerg', g('steergB', '')) + cueG('actions', g('actionsB', ''))
  + cueG('risk', g('riskB', '')) + cueG('log', g('logB', '')) + cueG('ladder', g('ladderB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Run lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.run'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const RUN_PLACE = pmMap.places.find((p) => p.module === 'pm.run');
const MAPZ = [RUN_PLACE.x + RUN_PLACE.w / 2, RUN_PLACE.y + RUN_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.run')}"`), 'the map lights pm.run as a cue group');

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
  { from: cam(200, 80, 90, 1.2), to: cam(205, 85, 90, 1.25) }, // s2 the switchboard and the buyer
  { from: cam(115, 70, 50, 1.25), to: cam(105, 75, 50, 1.3) }, // s3 line 4 and the team lead
  { from: cam(190, 85, 60, 1.2), to: cam(180, 90, 60, 1.15) }, // s4 the operators and the team lead at line 3
  { from: cam(150, 85, 90, 1.1), to: cam(190, 80, 90, 1.15) }, // s5 the switchboard, the buyer and the sponsor
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.run.intro',
  title: { nl: 'Lijn 3 in uitvoering: het project in beweging', en: 'Line 3 under way: keeping the project moving' },
  module: 'pm.run',
  tileUnits: 130,
  // the map: per topic of pm.run, the scene that explains it and its tile
  topics: {
    steer: { scene: 's2', cue: 'tSteer' },
    scope: { scene: 's3', cue: 'tScope' },
    team: { scene: 's4', cue: 'tTeam' },
    issues: { scene: 's5', cue: 'tIssues' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'De zomerstop is begonnen. Lijn 3 moet in {n:3} weken in hal B staan.', en: 'The summer shutdown has begun. Line 3 has to stand in hall B in {n:3} weeks.', focus: ['goal', 'floor', 'calendar'] },
        { nl: 'Het plan ligt er. Nu moet het project in beweging blijven.', en: 'The plan is ready. Now the project has to keep moving.', focus: ['goal', 'sponsor'] },
        { nl: 'We volgen dit ene project langs de vier onderwerpen van de module.', en: 'We follow this one project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Sturen en rapporteren', en: 'Steering and reporting' },
      beats: [
        { nl: 'Eerste onderwerp: Sturen en rapporteren. Hoe staat het er echt voor?', en: 'First topic: Steering and reporting. How is it really going?', focus: ['tSteer', 'switch'] },
        { nl: 'De inkoper meldt dat de schakelkast later komt. De {t:RAG-status|RAG-status} is oranje.', en: 'The buyer reports that the switchboard will be late. The {t:RAG status|RAG status} is amber.', cue: { 'RAG-status': 'status' }, focus: ['status', 'switch', 'buyer'] },
        { nl: 'Meld het de stuurgroep meteen. Slecht nieuws vroeg is goedkoop, laat is duur.', en: 'Tell the steering group at once. Bad news early is cheap, late is expensive.', focus: ['news', 'sponsor'] },
        { nl: 'We gebruiken vaak een {t:A3-statusrapport|A3-statusrapport} en een {t:Prognose|prognose}.', en: 'We often use an {t:A3 status report|A3 status report} and a {t:Forecast|forecast}.', cue: { 'A3-statusrapport': 'tool1', Prognose: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Scope en wijzigingen', en: 'Scope and change control' },
      beats: [
        { nl: 'Tweede onderwerp: Scope en wijzigingen. Wat hoort erbij, en wat niet?', en: 'Second topic: Scope and change control. What is part of it, and what is not?', focus: ['tScope', 'line4'] },
        { nl: 'De teamleider vraagt of lijn 4 er ook bij kan. Zo groeit {t:Scope creep|scope creep}.', en: 'The team lead asks whether line 4 can come along. That is how {t:Scope creep|scope creep} grows.', cue: { 'Scope creep': 'request' }, focus: ['request', 'line4', 'teamlead'] },
        { nl: 'Laat de prijs zien. Het wordt een {t:Wijzigingsverzoek|wijzigingsverzoek}, en de sponsor kiest.', en: 'Show the price. It becomes a {t:Change request|change request}, and the sponsor chooses.', cue: { Wijzigingsverzoek: 'cr' }, focus: ['impact', 'cr', 'sponsor'] },
        { nl: 'We gebruiken vaak een {t:Wijzigingslog|wijzigingslog} en een {t:Impactanalyse|impactanalyse}.', en: 'We often use a {t:Change log|change log} and an {t:Impact analysis|impact analysis}.', cue: { Wijzigingslog: 'tool1', Impactanalyse: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Team en overleg', en: 'Team and meetings' },
      beats: [
        { nl: 'Derde onderwerp: Team en overleg. Hoe houd je iedereen op één lijn?', en: 'Third topic: Team and meetings. How do you keep everyone on the same page?', focus: ['tTeam', 'crew', 'teamlead'] },
        { nl: 'Drie overleggen: een {t:Stand-up|stand-up} bij de lijn, een weekoverleg en de {t:Stuurgroep|stuurgroep}.', en: 'Three meetings: a {t:Stand-up|stand-up} at the line, a weekly meeting and the {t:Steering group|steering group}.', cue: { 'Stand-up': 'standup', Stuurgroep: 'steerg' }, focus: ['standup', 'weekly', 'steerg', 'crew'] },
        { nl: 'Elk overleg eindigt in besluiten en acties, met een naam en een datum.', en: 'Every meeting ends in decisions and actions, with a name and a date.', focus: ['actions', 'teamlead'] },
        { nl: 'We gebruiken vaak een {t:Besluitnotitie|besluitnotitie} en {t:Notulen|notulen}.', en: 'We often use a {t:Decision note|decision note} and {t:Minutes|minutes}.', cue: { Besluitnotitie: 'tool1', Notulen: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Issues en escalatie', en: 'Issues and escalation' },
      beats: [
        { nl: 'Vierde onderwerp: Issues en escalatie. Wat gaat er nu mis, en wie lost het op?', en: 'Fourth topic: Issues and escalation. What is going wrong now, and who solves it?', focus: ['tIssues', 'switch'] },
        { nl: 'Het risico komt uit. De late schakelkast is nu een {t:Issue|issue}.', en: 'The risk comes true. The late switchboard is now an {t:Issue|issue}.', cue: { Issue: 'risk' }, focus: ['risk', 'switch'] },
        { nl: 'In de {t:Issuelog|issuelog} met één {t:Eigenaar|eigenaar}, de inkoper.', en: 'In the {t:Issue log|issue log} with one {t:Owner|owner}, the buyer.', cue: { Issuelog: 'log', Eigenaar: 'log' }, focus: ['log', 'buyer'] },
        { nl: 'Lukt het niet, dan volgt {t:Escalatie|escalatie}: naar de sponsor, met een voorstel.', en: 'If that fails, {t:Escalation|escalation} follows: to the sponsor, with a proposal.', cue: { Escalatie: 'ladder' }, focus: ['ladder', 'sponsor'] },
        { nl: 'We gebruiken vaak een {t:Escalatieroute|escalatieroute} en een {t:Besluitenlijst|besluitenlijst}.', en: 'We often use an {t:Escalation path|escalation path} and a {t:Decision log|decision log}.', cue: { Escalatieroute: 'tool1', Besluitenlijst: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén ritme', en: 'One rhythm' },
      beats: [
        { nl: 'Het hangt samen: het team ziet het, de status meldt het, de sponsor beslist.', en: 'It all connects: the team sees it, the status reports it, the sponsor decides.', focus: ['flow', 'teamlead'] },
        { nl: 'De sponsor kiest: lijn 4 komt na de stop. Het besluit staat op de lijst.', en: 'The sponsor chooses: line 4 comes after the shutdown. The decision is on the log.', focus: ['decision', 'sponsor', 'line4'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Uitvoeren is het derde station op de weg van een project.', en: 'The map of Projects: Run is the third station on the road of a project.', focus: 'map-run' },
        { nl: 'Uitvoeren heeft vier onderwerpen, elk met vier niveaus.', en: 'Run has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Sturen en rapporteren, op niveau Basis.', en: 'Start with Steering and reporting, at Basics level.', focus: ['tSteer', 'start'] },
        { nl: 'Werkkennis: stuurgroep voorbereiden, wijzigingen beheersen, leiden zonder macht, besluiten halen.', en: 'Working knowledge: prepare the steering group, control changes, lead without authority, get decisions.', focus: 'lv2' },
        { nl: 'Gevorderd stuurt met cijfers en escaleert in lagen. Expert stuurt op uitzondering en leidt werkstromen.', en: 'Advanced steers with numbers and escalates in tiers. Expert manages by exception and runs several workstreams.', focus: ['lv3', 'lv4'] },
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
// on one short sentence naming two tools of that topic's lessons, without
// explaining them. Words checked with espeak-ng phonemes through Piper's own
// bridge (nl_NL-alex); this film's own SAY group (the last of the Dutch list in
// films/_kit/timeline.mjs) carries what it alone says. The module "Intake" is
// not named aloud: the Dutch voice reads it "in-taa-ke".
const SAY = [
  [ // s1 one project, four topics
    { nl: 'De zomerstop is begonnen. Lijn 3 moet in {n:3} weken in hal B staan.',
      en: 'The summer shutdown has begun. Line 3 has to stand in hall B in {n:3} weeks.' },
    { nl: 'Het plan ligt er. Nu gaat het erom het project in beweging te houden, elke dag van de stop.',
      en: 'The plan is ready. Now the point is to keep the project moving, every day of the shutdown.' },
    { nl: 'We volgen dit ene project langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this one project through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 steering and reporting
    { nl: 'Het eerste onderwerp is Sturen en rapporteren. Hoe staat het er echt voor?',
      en: 'The first topic is Steering and reporting. How is the project really doing?' },
    { nl: 'De inkoper meldt dat de schakelkast later komt. Het is een risico, maar het team kan het nog zelf opvangen. Dus is de status oranje.',
      en: 'The buyer reports that the switchboard will be late. It is a risk, but the team can still absorb it. So the status is amber.' },
    { nl: 'Meld het de stuurgroep meteen. Slecht nieuws vroeg is goedkoop. Slecht nieuws laat is duur.',
      en: 'Tell the steering group at once. Bad news early is cheap. Bad news late is expensive.' },
    { nl: 'Bij sturen en rapporteren gebruiken we vaak een A3-statusrapport en een prognose.',
      en: 'For steering and reporting we often use an A3 status report and a forecast.' },
  ],
  [ // s3 scope and change control
    { nl: 'Het tweede onderwerp is Scope en wijzigingen. Wat hoort bij het project, en wat niet?',
      en: 'The second topic is Scope and change control. What is part of the project, and what is not?' },
    { nl: 'De teamleider vraagt of lijn 4 er ook bij kan. Elk verzoek is klein en redelijk. Zo groeit de scope ongemerkt. Dat heet {t:Scope creep|scope creep}.',
      en: 'The team lead asks whether line 4 can come along too. Each request is small and reasonable. That is how the scope grows unnoticed. It is called {t:Scope creep|scope creep}.' },
    { nl: 'Je zegt geen nee, je laat zien wat het kost. Tijd, geld en risico. Het wordt een {t:Wijzigingsverzoek|wijzigingsverzoek}, en de sponsor kiest.',
      en: 'You do not say no, you show what it costs. Time, money and risk. It becomes a {t:Change request|change request}, and the sponsor chooses.' },
    { nl: 'Bij scope en wijzigingen gebruiken we vaak een wijzigingslog en een impactanalyse.',
      en: 'For scope and change control we often use a change log and an impact analysis.' },
  ],
  [ // s4 team and meetings
    { nl: 'Het derde onderwerp is Team en overleg. Hoe houd je iedereen op één lijn?',
      en: 'The third topic is Team and meetings. How do you keep everyone on the same page?' },
    { nl: 'Een project draait op drie overleggen. Een korte stand-up bij de lijn, een weekoverleg en een stuurgroep om de paar weken.',
      en: 'A project runs on three meetings. A short stand-up at the line, a weekly meeting and a steering group every few weeks.' },
    { nl: 'Elk overleg eindigt in besluiten en acties. Met een naam en een datum, anders gebeurt er niets.',
      en: 'Every meeting ends in decisions and actions. With a name and a date, or nothing happens.' },
    { nl: 'Bij team en overleg gebruiken we vaak een besluitnotitie en notulen.',
      en: 'For team and meetings we often use a decision note and minutes.' },
  ],
  [ // s5 issues and escalation
    { nl: 'Het vierde onderwerp is Issues en escalatie. Wat gaat er nu mis, en wie lost het op?',
      en: 'The fourth topic is Issues and escalation. What is going wrong now, and who solves it?' },
    { nl: 'De late schakelkast was een risico. Nu het echt gebeurt, is het een {t:Issue|issue}. Een probleem dat nu speelt en actie vraagt.',
      en: 'The late switchboard was a risk. Now that it is happening, it is an {t:Issue|issue}. A problem that is happening now and needs action.' },
    { nl: 'Het komt in de issuelog, met één eigenaar. Dat is de inkoper, een naam en niet het team.',
      en: 'It goes into the issue log, with one owner. That is the buyer, a name and not the team.' },
    { nl: 'Lukt het niet, dan escaleer je. Je legt het bij de sponsor neer, met een voorstel.',
      en: 'If that fails, you escalate. You put it with the sponsor, with a proposal.' },
    { nl: 'Bij issues en escalatie gebruiken we vaak een escalatieroute en een besluitenlijst.',
      en: 'For issues and escalation we often use an escalation path and a decision log.' },
  ],
  [ // s6 one rhythm
    { nl: 'Het hangt samen. Het team ziet wat er speelt. De status meldt het, en wat het team niet kan besluiten, gaat omhoog naar de sponsor.',
      en: 'It all connects. The team sees what is going on. The status reports it, and what the team cannot decide goes up to the sponsor.' },
    { nl: 'De sponsor kiest, lijn 4 komt na de stop. Het besluit staat op de besluitenlijst, en iedereen weet waar hij aan toe is.',
      en: 'The sponsor chooses, line 4 comes after the shutdown. The decision is on the decision log, and everyone knows where they stand.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Uitvoeren is het derde station op de weg van een project.',
      en: 'This is the map of Projects. Run is the third station on the road of a project.' },
    { nl: 'Uitvoeren heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Run has four topics, each with four levels.' },
    { nl: 'Begin bovenaan, bij Sturen en rapporteren, op het eerste niveau.',
      en: 'Start at the top, with Steering and reporting, at the first level.' },
    { nl: 'Op het tweede niveau bereid je de stuurgroep voor en beheers je wijzigingen. Je leidt zonder macht en krijgt besluiten voor elkaar.',
      en: 'At the second level you prepare the steering group and control changes. You lead without authority and get decisions made.' },
    { nl: 'Op het derde niveau stuur je met cijfers, herplan je met reserves en escaleer je in lagen. Het vierde niveau stuurt op uitzondering en leidt meerdere werkstromen.',
      en: 'At the third level you steer with numbers, replan with reserves and escalate in tiers. The fourth level manages by exception and runs several workstreams.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="installer"],[data-cue="buyer"],[data-cue="crew"],[data-cue="teamlead"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de intro van Plannen en in de film over het hele project. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met de kabel van buiten, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp komen er mensen bij: de inkoper, de sponsor, de teamleider van de lijn en twee operators. Aan het eind staat lijn 3 op zijn plek en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel en de vier onderwerpen van de module als tegels; een status met drie lampen waarvan de oranje brandt, en slecht nieuws vroeg tegenover laat; een verzoek voor lijn 4 met wat het kost en een wijzigingsverzoek waar de sponsor over kiest; de drie overleggen, stand-up, weekoverleg en stuurgroep, met besluiten en acties; een risico dat een issue wordt, een issuelog met één eigenaar en een trap omhoog naar de sponsor; per onderwerp twee namen van hulpmiddelen; en de keten van team naar status naar besluit. Aan het eind de kaart van Projecten met Uitvoeren verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go, as in the intro of Plan and in the film about the whole project. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with the cable from outside, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the buyer, the sponsor, the team lead of the line and two operators. At the end line 3 stands in place and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the goal and the module’s four topics as tiles; a status with three lights, the amber one lit, and bad news early against late; a request for line 4 with what it costs and a change request the sponsor chooses on; the three meetings, stand-up, weekly meeting and steering group, with decisions and actions; a risk that becomes an issue, an issue log with one owner and a step up to the sponsor; two tool names per topic; and the chain from team to status to decision. At the end the map of Projects with Run lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

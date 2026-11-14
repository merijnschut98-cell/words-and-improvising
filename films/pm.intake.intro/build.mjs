// Dev tool, not shipped. Builds the module intro film "Verhuis lijn 3 / Move line 3"
// for Intake (pm.intake), the third module intro film (v17): the high-over picture
// at the top of the module, before its four topics (Merijn, 13 Nov: "that
// high-over picture is the thing I need the most"), in the pattern he approved with
// the Planning intro (pm.plan.intro): one concrete project travels through the
// module, each topic names its tools briefly without explaining them (the
// Checkpoint of 14 Nov), and the film is as long as its content needs.
//
//   node films/pm.intake.intro/build.mjs            build the page
//   node films/pm.intake.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.intake.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.intake's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story is the shared project world of the Planning intro and the field films:
// line 3 moves to hall B in the summer shutdown. Here it is told from its intake,
// and it agrees with the Intake station of the lifecycle film (pm.field.lifecycle):
// the request "move line 3", the question behind the question (why, and when is it
// done), the goal "line 3 runs in hall B, as fast as now" with the sponsor who
// decides, and the tools projectopdracht and SIPOC. The STORY IS DRAWN IN THE
// ROOM: hall B is still empty (the line stands in the old hall), the new floor
// with the dashed outline of line 3, line 4 next to it (it stays), the power
// cabinet with a cable still to be connected, the dashed place of the switchboard
// and the calendar of the shutdown; the cast changes per topic.
//   s1 the request: the sponsor on the empty floor, "move line 3", the road from a
//      request to a project worth doing, the module's four topics as a route
//   s2 Van vraag naar probleem: the request is a solution; why and when; the goal
//      (what must be measurably different)             → pm.intake.ask (Basis)
//   s3 Stakeholders en vertrouwen: the stakeholder map with the sponsor, the team
//      lead (process owner), the operators (users) and the works council (who can
//      stop it)                                       → pm.intake.stakeholders
//   s4 Scope en projectopdracht: the goal in one sentence, the baseline, what is
//      in and out of scope (line 4 stays)             → pm.intake.done
//   s5 Businesscase en voorstel: costs against benefits (the old hall's rent stops),
//      no figures, then the proposal the sponsor says yes or no to         → pm.intake.value
//   s6 together: the four feed the sponsor's decision; yes, and Plan follows
//   s7 the shared Projects map (the kit's mapScene, as the app draws it) with
//      Intake lit, then the module's four topics with their levels as columns,
//      where to start, and what each later level adds
// Tools named per topic, one short sentence each and never explained (terms of the
// module's own lessons): problem 5 keer waarom (pm.intake.problemstatement) and
// vragenboom (pm.intake.issuetree); people stakeholdermap (pm.intake.stakeholders)
// and kick-off (pm.intake.start); scope projectopdracht (pm.intake.charter) and
// SIPOC (pm.intake.sipoc); case terugverdientijd (pm.intake.value) and SCQ
// (pm.intake.proposal). Definitions as the Basis lessons word them. Terms come from
// the module's lessons and {n:} numbers from the module's text (the kit's intro
// mode, films/_kit/build-film.mjs); the kit holds the film to its map (every topic
// named in a caption of its own scene, explained in two beats and lit), to the
// narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast and the two operators drawn with
// pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs), the things of hall B from
// the pilot (films/pm.plan.intro/hall.mjs), all imported, not copied. A panel at the
// right, in stage space, draws each step as a schema, labelled "voorbeeld" (the
// line's move) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.intake');
const LEVELS = {
  problem: ['pm.intake.ask', 'pm.intake.firsttalk', 'pm.intake.problemstatement', 'pm.intake.issuetree'],
  people: ['pm.intake.stakeholders', 'pm.intake.start', 'pm.intake.contracting', 'pm.intake.coalition'],
  scope: ['pm.intake.done', 'pm.intake.charter', 'pm.intake.sipoc', 'pm.intake.phasing'],
  case: ['pm.intake.value', 'pm.intake.proposal', 'pm.intake.no', 'pm.intake.sensitivity'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.intake has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// the Basis definitions as the film words them, and what s7 says the later levels add
has('pm.intake.ask', ['Klanten komen zelden met een probleem. Ze komen met een oplossing', 'Het doel is wat er meetbaar anders moet zijn', 'een project op hun gekozen oplossing lost misschien het verkeerde op', 'Waaraan merk je het?']);
has('pm.intake.ask', ['Clients rarely bring a problem. They bring a solution', 'The goal is what should be measurably different', 'may fix the wrong thing'], 'en');
has('pm.intake.stakeholders', ['Sponsor: eigenaar van budget en resultaat, en kan beslissen', 'Proceseigenaar: de manager die het proces runt en met de verandering moet leven', 'de operators, planners of monteurs van wie het werk verandert', 'Blokkeerders: iedereen wiens belang, macht of tijd geraakt wordt', 'ondernemingsraad', 'instemmingsrecht bij een wijziging van de werktijdenregeling', 'Weerstand klinkt zelden als']);
has('pm.intake.stakeholders', ['A stakeholder is anyone who affects the project or is affected by it', 'Sponsor: owns the budget and the result, and can decide', 'Process owner: the manager who runs the process and has to live with the change', 'works council', 'Resistance rarely sounds like'], 'en');
has('pm.intake.done', ['Schrijf een doel in één zin', 'Eerst een nulmeting (baseline): de gemeten beginwaarde waar je later tegen vergelijkt', 'Zonder die meting kan niemand zeggen dat het gelukt is', 'Scope is wat het project omvat', 'buiten scope valt']);
has('pm.intake.done', ['Write a one-sentence goal', 'Baseline first: the measured starting value', 'Without it nobody can say you succeeded', 'Scope is what the project covers', 'out of scope'], 'en');
has('pm.intake.value', ['laat zien of een project het waard is: wat het kost, wat het oplevert, en hoe zeker dat is', 'Eenmalige kosten betaal je één keer', 'Baten zijn de meetbare winst']);
has('pm.intake.value', ['shows whether a project is worth it: what it costs, what it yields, and how certain that is', 'One-off costs you pay once', 'Benefits are the measurable gain'], 'en');
has('pm.intake.proposal', ['het document waarin je de klant een aanpak, een resultaat en een prijs aanbiedt']);
has('pm.intake.proposal', ['the document in which you offer the client an approach, a result and a price'], 'en');
// s7: what each later level adds is the title of its lessons, in the app's words
const TITLES = { 'pm.intake.firsttalk': 'Het eerste gesprek', 'pm.intake.start': 'De eerste weken', 'pm.intake.charter': 'De projectopdracht op één A4', 'pm.intake.proposal': 'Het voorstel schrijven',
  'pm.intake.problemstatement': 'Een scherpe probleemstelling', 'pm.intake.contracting': 'Afspraken met de sponsor', 'pm.intake.sipoc': 'Grenzen trekken met SIPOC', 'pm.intake.no': 'Nee zeggen of ombouwen',
  'pm.intake.issuetree': 'Werken met hypotheses', 'pm.intake.coalition': 'Een coalitie bouwen', 'pm.intake.phasing': 'Fasering en wijzigingen', 'pm.intake.sensitivity': 'Een businesscase die standhoudt' };
for (const [id, title] of Object.entries(TITLES)) assert(lessons.nl.get(id).title === title, `${id} is no longer called "${title}"`);
// the tools of each topic are terms of its own lessons (the Checkpoint of 14 Nov), nl and en
const TOOLS = [['pm.intake.problemstatement', '5 keer waarom', '5 Whys'], ['pm.intake.issuetree', 'Vragenboom', 'Issue tree'], ['pm.intake.stakeholders', 'Stakeholdermap', 'Stakeholder map'], ['pm.intake.start', 'Kick-off', 'Kick-off'],
  ['pm.intake.charter', 'Projectopdracht', 'Project charter'], ['pm.intake.sipoc', 'SIPOC', 'SIPOC'], ['pm.intake.value', 'Terugverdientijd', 'Payback period'], ['pm.intake.proposal', 'SCQ', 'SCQ']];
for (const [id, nl, en] of TOOLS) {
  assert(lessons.nl.get(id).terms.some((t) => t.term === nl), `${id} has no term "${nl}"`);
  assert(lessons.en.get(id).terms.some((t) => t.term === en), `${id} has no term "${en}" (en)`);
}
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

// the topic titles in the closing grid: a tile of GRID.tile units holds GRID.tile - 12 units of text, up to three lines
// (the film's tileUnits, so the kit's checkLabels holds the titles to it too, also after a rename without a rebuild)
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= GRID.tile - 12, `"${title}" (${lang}) has a word wider than the grid's tile`);
  assert(wrapUnits(title, GRID.tile - 12, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the grid's tile`);
}

// ---------------------------------------------------------------- the world (hall B, still empty)
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
// switchboard's place, line 4 (which stays) next to it, the power cabinet at the back wall at the left. Line 3
// itself is not drawn: at the intake it still stands in the old hall.
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
// the last three weeks of the calendar are the summer shutdown
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
// the incoming power: from the wall opening to the cabinet, and on to the line; dashed = not connected yet
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the sponsor and the team lead are the pm cast; the two operators are pm.agile.scrum's figures.
// Each stands in a cue group; the cast that is not on stage is hidden by the stage script.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + cablePath(true)),
  cueG('switch', hall.switchboardGhost(SWB)),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, the request,
// and each scene's parts. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Intake is a cue group of its own (map-intake).
const tiles = ['tProb', 'tPeople', 'tScope', 'tCase'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('req', g('reqB', '')) + cueG('path', g('pathB', ''))
  + cueG('ask', g('askB', '')) + cueG('why', g('whyB', '')) + cueG('goal', g('goalB', ''))
  + cueG('smap', g('smapB', '')) + cueG('p-sponsor', g('psB', '')) + cueG('p-lead', g('plB', '')) + cueG('p-ops', g('poB', '')) + cueG('p-or', g('orB', ''))
  + cueG('goalS', g('goalSB', '')) + cueG('base', g('baseB', '')) + cueG('scopeIn', g('scopeInB', '')) + cueG('scopeOut', g('scopeOutB', '')) + cueG('page', g('pageB', ''))
  + cueG('costs', g('costsB', '')) + cueG('benefits', g('benefitsB', '')) + cueG('proposal', g('propB', ''))
  + cueG('four', g('fourB', '')) + cueG('chain', g('chainB', '')));
// the shared map, Intake lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.intake'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const INTAKE_PLACE = pmMap.places.find((p) => p.module === 'pm.intake');
const MAPZ = [INTAKE_PLACE.x + INTAKE_PLACE.w / 2, INTAKE_PLACE.y + INTAKE_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.intake')}"`), 'the map lights pm.intake as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, the empty floor and the calendar
  { from: cam(110, 100, 70, 1.12), to: cam(118, 100, 70, 1.18) }, // s2 the sponsor on the empty floor
  { from: cam(120, 95, 70, 1.1), to: cam(140, 95, 70, 1.05) }, // s3 the sponsor, the team lead and the operators
  { from: cam(170, 50, 50, 1.25), to: cam(180, 55, 50, 1.3) }, // s4 the floor, line 3's outline and line 4
  { from: cam(110, 60, 80, 1.15), to: cam(170, 70, 80, 1.12) }, // s5 the cabinet, the switchboard's place and the operators
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.intake.intro',
  title: { nl: 'Verhuis lijn 3: van verzoek naar project', en: 'Move line 3: from request to project' },
  module: 'pm.intake',
  // the index titles Stakeholders (143 units) and projectopdracht (174) are wider than the pilot's 128-unit tile: the
  // film declares the room of its narrowest title box, the closing grid's tile (GRID.tile less its padding), and
  // the route's full-width rows wrap with the same width; the kit holds the titles to it (checkLabels)
  tileUnits: GRID.tile - 12,
  // the map: per topic of pm.intake, the scene that explains it and its tile
  topics: {
    problem: { scene: 's2', cue: 'tProb' },
    people: { scene: 's3', cue: 'tPeople' },
    scope: { scene: 's4', cue: 'tScope' },
    case: { scene: 's5', cue: 'tCase' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Een verzoek', en: 'A request' },
      beats: [
        { nl: 'Hal B wacht op lijn 3, in de zomerstop van {n:3} weken. De sponsor vraagt: verhuis lijn 3.', en: 'Hall B is waiting for line 3, in the {n:3}-week summer shutdown. The sponsor asks: move line 3.', focus: ['req', 'floor', 'calendar', 'sponsor'] },
        { nl: 'Een verzoek is nog geen project. Eerst de intake: van de vraag naar een project dat het waard is.', en: 'A request is not a project yet. First the intake: from the question to a project worth doing.', focus: ['path', 'sponsor'] },
        { nl: 'We volgen dit ene verzoek langs de vier onderwerpen van de module.', en: 'We follow this one request through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Van vraag naar probleem', en: 'From question to problem' },
      beats: [
        { nl: 'Eerste onderwerp: Van vraag naar probleem. Verhuis lijn 3 is een oplossing, nog geen probleem.', en: 'First topic: From question to problem. Move line 3 is a solution, not a problem yet.', focus: ['tProb', 'ask', 'floor'] },
        { nl: 'Vraag door naar het probleem: waarom moet het, en wanneer is het gelukt?', en: 'Ask about the problem underneath: why does it have to happen, and when is it done?', focus: ['why', 'sponsor'] },
        { nl: 'Het antwoord is het {t:Doel|doel}: wat er meetbaar anders moet zijn. Lijn 3 draait in hal B, even snel als nu.', en: 'The answer is the {t:Goal|goal}: what must be measurably different. Line 3 runs in hall B, as fast as now.', cue: { Doel: 'goal' }, focus: ['goal', 'floor'] },
        { nl: 'Bij het onderzoeken gebruiken we vaak {t:5 keer waarom|5 keer waarom} en een {t:Vragenboom|vragenboom}.', en: 'To dig deeper we often use the {t:5 Whys|5 Whys} and an {t:Issue tree|issue tree}.', cue: { '5 keer waarom': 'why', Vragenboom: 'ask' }, focus: ['why', 'ask'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Stakeholders en vertrouwen', en: 'Stakeholders and trust' },
      beats: [
        { nl: 'Tweede onderwerp: Stakeholders en vertrouwen. Wie beslist, en wie kan het stoppen?', en: 'Second topic: Stakeholders and trust. Who decides, and who can stop it?', focus: ['tPeople', 'sponsor'] },
        { nl: 'Een {t:Stakeholder|stakeholder} is iedereen die invloed heeft op het project, of er last of baat van heeft.', en: 'A {t:Stakeholder|stakeholder} is anyone who affects the project or is affected by it.', cue: { Stakeholder: 'smap' }, focus: ['smap'] },
        { nl: 'De {t:Sponsor|sponsor} beslist. De {t:Proceseigenaar|proceseigenaar}, de teamleider, moet met de verandering leven.', en: 'The {t:Sponsor|sponsor} decides. The {t:Process owner|process owner}, the team lead, has to live with the change.', cue: { Sponsor: 'p-sponsor', Proceseigenaar: 'p-lead' }, focus: ['p-sponsor', 'p-lead', 'sponsor', 'teamlead'] },
        { nl: 'Operators gebruiken het. Een {t:Blokkeerder|blokkeerder} kan het stoppen: de OR bij werk in de zomerstop.', en: 'Operators use it. A {t:Blocker|blocker} can stop it: the works council if people work in the shutdown.', cue: { Blokkeerder: 'p-or' }, focus: ['p-or', 'p-ops', 'crew'] },
        { nl: 'Bij de stakeholders gebruiken we vaak een {t:Stakeholdermap|stakeholdermap} en een {t:Kick-off|kick-off}.', en: 'For stakeholders we often use a {t:Stakeholder map|stakeholder map} and a {t:Kick-off|kick-off}.', cue: { Stakeholdermap: 'smap', 'Kick-off': 'sponsor' }, focus: ['smap', 'sponsor'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Scope en projectopdracht', en: 'Scope and charter' },
      beats: [
        { nl: 'Derde onderwerp: Scope en projectopdracht. Wanneer is het af?', en: 'Third topic: Scope and charter. When is it done?', focus: ['tScope', 'floor'] },
        { nl: 'Het doel in één zin, en een {t:Nulmeting|nulmeting}: hoe snel draait lijn 3 nu?', en: 'The goal in one sentence, and a {t:Baseline|baseline}: how fast does line 3 run now?', cue: { Nulmeting: 'base' }, focus: ['goalS', 'base'] },
        { nl: 'De {t:Scope|scope}: wat het project omvat. Lijn 4 blijft staan, dus {t:Buiten scope|buiten scope}.', en: 'The {t:Scope|scope}: what the project covers. Line 4 stays, so it is {t:Out of scope|out of scope}.', cue: { Scope: 'scopeIn', 'Buiten scope': 'scopeOut' }, focus: ['scopeIn', 'scopeOut', 'floor', 'line4'] },
        { nl: 'Bij de scope gebruiken we vaak een {t:Projectopdracht|projectopdracht} en een {t:SIPOC|SIPOC}.', en: 'For the scope we often use a {t:Project charter|project charter} and a {t:SIPOC|SIPOC}.', cue: { Projectopdracht: 'page', SIPOC: 'scopeIn' }, focus: ['page', 'scopeIn'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Businesscase en voorstel', en: 'Business case and proposal' },
      beats: [
        { nl: 'Vierde onderwerp: Businesscase en voorstel. Is het de moeite waard?', en: 'Fourth topic: Business case and proposal. Is it worth doing?', focus: ['tCase', 'floor'] },
        { nl: 'Een {t:Businesscase|businesscase}: wat kost het, wat levert het op, en hoe zeker is dat?', en: 'A {t:Business case|business case}: what does it cost, what does it yield, and how certain is that?', cue: { Businesscase: 'costs' }, focus: ['costs', 'benefits'] },
        { nl: '{t:Eenmalige kosten|Eenmalige kosten} betaal je één keer, zoals de installateur en de schakelkast.', en: '{t:One-off costs|One-off costs} you pay once, like the installer and the switchboard.', cue: { 'Eenmalige kosten': 'costs' }, focus: ['costs', 'power', 'switch'] },
        { nl: 'De {t:Baten|baten}: de meetbare winst, het liefst in euro’s. Hier vervalt de huur van de oude hal.', en: 'The {t:Benefits|benefits}: the measurable gain, preferably in euros. Here the rent of the old hall stops.', cue: { Baten: 'benefits' }, focus: ['benefits'] },
        { nl: 'Dan het {t:Voorstel|voorstel}: aanpak, resultaat en prijs. De sponsor zegt ja of nee.', en: 'Then the {t:Proposal|proposal}: approach, result and price. The sponsor says yes or no.', cue: { Voorstel: 'proposal' }, focus: ['proposal', 'sponsor'] },
        { nl: 'Hier gebruiken we vaak de {t:Terugverdientijd|terugverdientijd} en een {t:SCQ|SCQ} als opening.', en: 'Here we often use the {t:Payback period|payback period} and an {t:SCQ|SCQ} as the opening.', cue: { Terugverdientijd: 'costs', SCQ: 'proposal' }, focus: ['costs', 'proposal'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Samen', en: 'Together' },
      beats: [
        { nl: 'Samen geven ze de sponsor wat nodig is om te beslissen: doel, mensen, scope en waarde.', en: 'Together they give the sponsor what is needed to decide: goal, people, scope and value.', focus: ['four', 'sponsor'] },
        { nl: 'Alles hangt samen: zonder doel geen scope. Zegt de sponsor ja, dan volgt Plannen.', en: 'It all connects: no goal, no scope. If the sponsor says yes, Plan follows.', focus: ['chain', 'sponsor'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Intake is het eerste station op de weg van een project.', en: 'The map of Projects: Intake is the first station on the road of a project.', focus: mapCue('pm.intake') },
        { nl: 'Intake heeft vier onderwerpen, elk met vier niveaus.', en: 'Intake has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Van vraag naar probleem, op niveau Basis.', en: 'Start with From question to problem, at Basics level.', focus: ['tProb', 'start'] },
        { nl: 'Werkkennis: het eerste gesprek, de eerste weken, de opdracht op één A4 en het voorstel.', en: 'Working knowledge: the first conversation, the first weeks, the one-page charter and the proposal.', focus: 'lv2' },
        { nl: 'Gevorderd: een scherpe probleemstelling, afspraken, grenzen. Expert: hypotheses, coalitie, fasering.', en: 'Advanced: a sharp problem statement, agreements, boundaries. Expert: hypotheses, coalition, phasing.', focus: ['lv3', 'lv4'] },
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
// the render guard caps a pause inside a sentence at 0.4 s. Words checked with
// espeak-ng phonemes through Piper's own bridge (nl_NL-alex): "de intake" goes
// through the field film's rule in films/_kit/timeline.mjs (so it is always written
// lowercase after "de", never as the first word of a sentence), "business case" as
// two words through the business case rule, and stakeholder, proceseigenaar,
// nulmeting, scope, sponsor and the tools through the rules above or as they are.
// This film's own SAY group (the last of the Dutch list) carries only "blokkeerder".
const SAY = [
  [ // s1 a request
    { nl: 'Een fabriek bouwt een nieuwe hal. Verpakkingslijn 3 moet erheen, in de zomerstop van {n:3} weken. De sponsor komt met een verzoek, verhuis lijn 3.',
      en: 'A plant is building a new hall. Packing line 3 has to move there, during the summer shutdown of {n:3} weeks. The sponsor comes with a request, move line 3.' },
    { nl: 'Maar een verzoek is nog geen project. Eerst komt de intake, van de vraag van de klant naar een project dat het waard is.',
      en: 'But a request is not a project yet. First comes the intake, from the client’s question to a project worth doing.' },
    { nl: 'We volgen dit ene verzoek langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this one request through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 from question to problem
    { nl: 'Het eerste onderwerp is Van vraag naar probleem. Verhuis lijn 3 is een oplossing, nog geen probleem. Een project daarop lost misschien het verkeerde op.',
      en: 'The first topic is From question to problem. Move line 3 is a solution, not a problem yet. A project aimed at it may fix the wrong thing.' },
    { nl: 'Vraag door naar het probleem eronder. Waarom moet het, en wanneer is het gelukt?',
      en: 'Ask about the problem underneath. Why does it have to happen, and when is it done?' },
    { nl: 'Het antwoord is het {t:Doel|doel}, wat er meetbaar anders moet zijn. Na de stop draait lijn 3 in hal B, even snel als nu.',
      en: 'The answer is the {t:Goal|goal}, what must be measurably different. After the shutdown line 3 runs in hall B, as fast as it does now.' },
    { nl: 'Bij het onderzoeken van het probleem gebruiken we vaak de 5 keer waarom en een vragenboom.',
      en: 'To dig into the problem we often use the 5 Whys and an issue tree.' },
  ],
  [ // s3 stakeholders and trust
    { nl: 'Het tweede onderwerp is Stakeholders en vertrouwen. Wie beslist, en wie kan het stoppen?',
      en: 'The second topic is Stakeholders and trust. Who decides, and who can stop it?' },
    { nl: 'Een {t:Stakeholder|stakeholder} is iedereen die invloed heeft op het project, of er last of baat van heeft.',
      en: 'A {t:Stakeholder|stakeholder} is anyone who affects the project or is affected by it.' },
    { nl: 'De {t:Sponsor|sponsor} is eigenaar van budget en resultaat, en beslist. De {t:Proceseigenaar|proceseigenaar}, hier de teamleider, moet met de verandering leven.',
      en: 'The {t:Sponsor|sponsor} owns the budget and the result, and decides. The {t:Process owner|process owner}, here the team lead, has to live with the change.' },
    { nl: 'De operators zijn de gebruikers, want hun werk verandert. En een {t:Blokkeerder|blokkeerder} kan het stoppen, ook zonder nee te zeggen. Hier is dat de ondernemingsraad, als operators in de zomerstop moeten werken.',
      en: 'The operators are the users, because their work changes. And a {t:Blocker|blocker} can stop it, even without saying no. Here that is the works council, if operators have to work in the shutdown.' },
    { nl: 'Bij de stakeholders gebruiken we vaak een stakeholdermap en een kick-off.',
      en: 'For stakeholders we often use a stakeholder map and a kick-off.' },
  ],
  [ // s4 scope and charter
    { nl: 'Het derde onderwerp is Scope en projectopdracht. Wanneer is het af?',
      en: 'The third topic is Scope and charter. When is it done?' },
    { nl: 'Schrijf het doel in één zin op. En doe een {t:Nulmeting|nulmeting}. Hoe snel draait lijn 3 nu? Zonder meting kan niemand zeggen dat het gelukt is.',
      en: 'Write the goal in one sentence. And take a {t:Baseline|baseline}. How fast does line 3 run now? Without it nobody can say it worked.' },
    { nl: 'Dan de {t:Scope|scope}, wat het project omvat. Lijn 3 zit erin. Lijn 4 blijft staan, dat valt {t:Buiten scope|buiten scope}.',
      en: 'Then the {t:Scope|scope}, what the project covers. Line 3 is in. Line 4 stays where it is, so it is {t:Out of scope|out of scope}.' },
    { nl: 'Bij de scope gebruiken we vaak een projectopdracht en een SIPOC.',
      en: 'For the scope we often use a project charter and a SIPOC.' },
  ],
  [ // s5 business case and proposal
    { nl: 'Het vierde onderwerp is business case en voorstel. Is het de moeite waard?',
      en: 'The fourth topic is Business case and proposal. Is it worth doing?' },
    { nl: 'Een {t:Businesscase|business case} laat zien of het project het waard is. Wat kost het, wat levert het op, en hoe zeker is dat?',
      en: 'A {t:Business case|business case} shows whether the project is worth it. What does it cost, what does it yield, and how certain is that?' },
    { nl: '{t:Eenmalige kosten|Eenmalige kosten} betaal je één keer, zoals de installateur en de nieuwe schakelkast.',
      en: '{t:One-off costs|One-off costs} you pay once, like the installer and the new switchboard.' },
    { nl: 'De {t:Baten|baten} zijn de meetbare winst, het liefst in euro’s. Hier vervalt de huur van de oude hal.',
      en: 'The {t:Benefits|benefits} are the measurable gain, preferably in euros. Here the rent of the old hall stops.' },
    { nl: 'Daarna volgt het {t:Voorstel|voorstel}, met aanpak, resultaat en prijs. Daar zegt de sponsor ja of nee op.',
      en: 'Then comes the {t:Proposal|proposal}, with approach, result and price. The sponsor says yes or no to it.' },
    { nl: 'Bij de business case en het voorstel gebruiken we vaak de terugverdientijd en een SCQ als opening.',
      en: 'For the business case and the proposal we often use the payback period and an SCQ as the opening.' },
  ],
  [ // s6 together
    { nl: 'Samen geven ze de sponsor wat nodig is om te beslissen. Het doel, de mensen, de scope en wat het oplevert.',
      en: 'Together they give the sponsor what is needed to decide. The goal, the people, the scope and what it yields.' },
    { nl: 'Alles hangt samen. Zonder doel kun je de scope niet toetsen. Zegt de sponsor ja, dan begint het plannen.',
      en: 'It all connects. Without a goal you cannot test the scope. If the sponsor says yes, planning begins.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Het eerste station op de weg van een project is de intake.',
      en: 'This is the map of Projects. The first station on the road of a project is the intake.' },
    { nl: 'In de intake zitten vier onderwerpen, elk met vier niveaus.',
      en: 'The intake has four topics, each with four levels.' },
    { nl: 'Begin bovenaan, bij Van vraag naar probleem, op het eerste niveau.',
      en: 'Start at the top, with From question to problem, at the first level.' },
    { nl: 'Op het tweede niveau voer je het eerste gesprek, bouw je vertrouwen in de eerste weken, leg je de opdracht op één pagina vast en schrijf je het voorstel.',
      en: 'At the second level you hold the first conversation, build trust in the first weeks, put the assignment on one page and write the proposal.' },
    { nl: 'Op het derde niveau maak je de probleemstelling scherp, maak je afspraken met de sponsor en trek je grenzen. Op het vierde werk je met hypotheses, bouw je een coalitie en deel je het project in fases.',
      en: 'At the third level you sharpen the problem statement, make agreements with the sponsor and draw boundaries. At the fourth you work with hypotheses, build a coalition and split the project into phases.' },
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
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
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
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet: de lijn staat nog in de oude hal. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast, vlak bij de zijwand, staat lijn 4, die blijft waar hij is. Links de stroomkast met de kabel van buiten, nog niet aangesloten, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender met weken, waarvan de laatste drie de zomerstop zijn. Per onderwerp komen er mensen bij: de sponsor, de teamleider en twee operators. Rechts een paneel, gemarkeerd als voorbeeld of schema: het verzoek van de sponsor, de weg van vraag naar project en de vier onderwerpen van de module als tegels; de vraag, waarom en wanneer, en het doel; een stakeholdermap met de sponsor, de teamleider, de operators en de ondernemingsraad; één pagina met het doel, de nulmeting en wat binnen en buiten de scope valt; de kosten tegenover de baten, de huur van de oude hal die vervalt, en het voorstel; de vier plaatjes samen en de weg naar de sponsor die ja zegt. Aan het eind de kaart van Projecten met Intake verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go: the line still stands in the old hall. On the floor the new place of line 3 with a dashed outline; next to it, near the side wall, stands line 4, which stays where it is. At the left the power cabinet with the cable from outside, not connected yet, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar of weeks, the last three of which are the summer shutdown. Each topic brings people: the sponsor, the team lead and two operators. At the right a panel, marked as an example or a diagram: the sponsor’s request, the road from question to project and the module’s four topics as tiles; the question, why and when, and the goal; a stakeholder map with the sponsor, the team lead, the operators and the works council; one page with the goal, the baseline and what is in and out of scope; the costs against the benefits, the rent of the old hall that stops, and the proposal; the four pictures together and the road to the sponsor who says yes. At the end the map of Projects with Intake lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

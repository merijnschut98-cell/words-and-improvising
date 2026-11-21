// Dev tool, not shipped. Builds the module intro film "Het MES in korte rondes /
// The MES in short rounds" for Agile en Scrum (pm.agile), the sixth module intro
// film (v17): the high-over picture at the top of the module, before its four
// topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.agile.intro/build.mjs            build the page
//   node films/pm.agile.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.agile.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.agile's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro): ONE concrete project
// travels through the whole module, the map before the detail, no calculations.
// This module belongs to the IT cluster, so the world is field film 4's
// (films/pm.field.it, whose Agile station this intro agrees with: the IT team
// builds the new MES for the orders on the floor in short rounds, sprints, and
// users react after each; a Kanban board and planning poker): line 3 runs in
// hall B, the plant brings in a new MES, you lead that IT project for the plant
// manager and the IT team builds it. The STORY IS DRAWN IN THE ROOM: the MES is
// the laptop on the table at the front of the hall, and the cast changes per
// topic (the plant manager, the IT team at the table, the team lead of line 3 as
// Product Owner, the operators at the line).
//   s1 the goal: line 3 runs in hall B, the new MES for the orders on the floor;
//      the plant manager, you and the IT team; the module's four topics as a route
//   s2 Agile denken: a waterfall shows the MES to the operators only at the end,
//      then it turns out to be wrong; short rounds, each with something that
//      works; the operators try it and the team adjusts  → pm.agile.whyagile
//   s3 Scrum: a sprint of two weeks, the team lead as Product Owner (decides what
//      comes first, he knows the floor), the Scrum Master, the Developers
//                                                          → pm.agile.scrumbasics
//   s4 Backlog en schatten: one list in order of value, estimating by comparing,
//      an honest end date as a range with a probability   → pm.agile.stories,
//      .refine, .points, .forecast
//   s5 Kanban en flow: wishes and faults from the floor as cards that move from
//      left to right, a blocked card, the cycle time       → pm.agile.board, .wip,
//      .flowmetrics
//   s6 one whole: mindset, rhythm, order and flow; Scrum and Kanban side by side
//   s7 the shared Projects map with Agile and Scrum lit, then the module's four
//      topics with their levels as columns, where to start, and what each later
//      level adds
// Definitions as the Basis lessons word them (pm.agile.whyagile, .scrumbasics,
// .stories, .board). Each topic scene names two tools of that topic's lessons in
// one short sentence, without explaining them (Merijn's checkpoint, 14 Nov):
// Agile Manifesto (pm.agile.whyagile) and Hybride aanpak (pm.agile.fit), together the agile mindset, Daily Scrum and
// Sprint Review (Scrum; pm.agile.events), User story and Planning poker (backlog;
// pm.agile.stories, .points) and Kanbanbord and WIP-limiet (Kanban; pm.agile.board,
// .wip). The field film's two tools of the module, Kanbanbord and Planning poker,
// are the third and fourth topic's. Terms come from the module's lessons and {n:}
// numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs);
// the kit holds the film to its map (every topic named in a caption of its own
// scene, explained in two beats and lit), to the narration guard and to the label
// fit. The index has a topic title that wraps to four lines in the default tile
// ("Scrum: rollen, events en artefacten"), so the film declares tileUnits (as
// pm.intake.intro and pm.land.intro).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast; the IT team and the operators drawn
// with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs). The things of hall B
// are the pilot's (../pm.plan.intro/hall.mjs, imported, not copied). A panel at
// the right, in stage space, draws each step as a schema, labelled "voorbeeld"
// (the MES in use) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.agile');
const LEVELS = {
  mindset: ['pm.agile.whyagile', 'pm.agile.principles', 'pm.agile.leanroots', 'pm.agile.fit'],
  scrum: ['pm.agile.scrumbasics', 'pm.agile.events', 'pm.agile.artefacts', 'pm.agile.scrumfail'],
  backlog: ['pm.agile.stories', 'pm.agile.refine', 'pm.agile.points', 'pm.agile.forecast'],
  kanban: ['pm.agile.board', 'pm.agile.wip', 'pm.agile.flowmetrics', 'pm.agile.flowsteer'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.agile has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// the world is field film 4's (films/pm.field.it): the new MES for the orders on the floor, you lead the IT project for the
// plant manager, the IT team builds it, in sprints; pm.agile.scrumbasics says the same of the factory (Scrum teams for MES)
has('pm.agile.scrumbasics', ['In de fabriek zie je Scrum vooral bij IT-teams voor MES']);
has('pm.agile.scrumbasics', ['In factories you mostly see Scrum in IT teams for MES'], 'en');
// s2: the waterfall (users only know what they want when they see something, so after months it was the wrong thing),
// short rounds with something that works, users try it and the team adjusts; the tools (the Agile Manifesto, a hybrid approach)
has('pm.agile.whyagile', ['de watervalaanpak', 'Bij software weet de gebruiker dat vaak pas als hij iets ziet', 'Dan ontdek je na maanden dat je het verkeerde hebt gebouwd', 'Je werkt in korte rondes van één tot vier weken', 'Elke iteratie levert een klein stuk dat echt werkt', 'Gebruikers proberen het, reageren, en het team past het plan aan']);
has('pm.agile.whyagile', ['the waterfall approach', 'users often only know when they see something', 'Then you find out after months that you built the wrong thing', 'You work in short rounds of one to four weeks', 'Each iteration delivers a small piece that really works', 'Users try it, react, and the team adjusts the plan'], 'en');
has('pm.agile.whyagile', ['Agile Manifesto']);
has('pm.agile.fit', ['Daarom werken veel fabrikanten hybride', 'Hybride aanpak']);
has('pm.agile.whyagile', ['Agile Manifesto'], 'en');
has('pm.agile.fit', ['many manufacturers work hybrid', 'Hybrid approach'], 'en');
// s3: the sprint (a fixed period of one month or less, often two weeks, something usable at the end), the three
// accountabilities; the tools (the Daily Scrum, the Sprint Review)
has('pm.agile.scrumbasics', ['Het werk gebeurt in sprints: vaste periodes van hooguit een maand, vaak twee weken', 'In elke sprint maakt het team iets bruikbaars af', 'De Product Owner is één persoon, geen commissie', 'wat het team als eerste doet en waarom', 'De Scrum Master helpt team en organisatie om Scrum goed te gebruiken en ruimt obstakels op', 'De Developers zijn de mensen die het werk maken']);
has('pm.agile.scrumbasics', ['The work happens in sprints: fixed periods of one month or less, often two weeks', 'In each sprint the team finishes something usable', 'The Product Owner is one person, not a committee', 'what the team does first and why', 'The Scrum Master helps the team and the organisation use Scrum well and removes impediments', 'The Developers are the people who do the work'], 'en');
has('pm.agile.events', ['Daily Scrum', 'Sprint Review']);
has('pm.agile.events', ['Daily Scrum', 'Sprint Review'], 'en');
// s4: one ordered list (the Product Owner orders on value, risk and dependencies, often first what yields a lot), relative
// estimating (comparing with work you know), a probabilistic forecast (a probability, not a date, from what the team
// finishes); the tools (user stories, planning poker)
has('pm.agile.refine', ['Ordenen is het bepalen van de volgorde van de backlog', 'vaak eerst wat veel oplevert of veel onzekerheid wegneemt']);
has('pm.agile.refine', ['Ordering is deciding the sequence of the backlog', 'often first what delivers a lot or removes a lot of uncertainty'], 'en');
has('pm.agile.points', ['je vergelijkt nieuw werk met werk dat je kent', 'Planning poker']);
has('pm.agile.points', ['you compare new work with work you know', 'Planning poker'], 'en');
has('pm.agile.forecast', ['geeft geen datum, maar een kans', 'het aantal items dat het team per week afmaakt']);
has('pm.agile.forecast', ['gives not a date but a probability', 'the number of items the team finishes per week'], 'en');
has('pm.agile.stories', ['User story']);
has('pm.agile.stories', ['User story'], 'en');
// s5: Kanban (a wish or a fault is a card that moves from left to right, blocked cards show where the system stutters,
// cycle time is the time from start to done); the tools (the Kanban board, the WIP limit)
has('pm.agile.board', ['Het hart is het kanbanbord', 'een stuk werk zoals een wens of een storing, is een kaart die van links naar rechts schuift', 'markeer je als geblokkeerd', 'ze laten zien waar het systeem hapert', 'Kanban begint waar je nu bent', 'je kunt Kanban ook naast Scrum gebruiken', 'Kanbanbord']);
has('pm.agile.board', ['At its heart is the Kanban board', 'a piece of work such as a request or a fault, is a card that moves from left to right', 'you mark as blocked', 'they show where the system stutters', 'Kanban starts where you are', 'you can also use Kanban alongside Scrum', 'Kanban board'], 'en');
has('pm.agile.wip', ['Een WIP-limiet is een afgesproken maximum aan werkitems tegelijk', 'WIP-limiet']);
has('pm.agile.wip', ['A WIP limit is an agreed maximum number of work items at once', 'WIP limit'], 'en');
has('pm.agile.flowmetrics', ['Cycle time: de tijd van begin tot klaar van een afgerond item']);
has('pm.agile.flowmetrics', ['Cycle time: the time from start to finish of a completed item'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.agile.principles', 'De twaalf principes'], ['pm.agile.leanroots', 'wortels'], ['pm.agile.fit', 'Wanneer agile past'],
  ['pm.agile.events', 'De vijf events'], ['pm.agile.artefacts', 'De drie artefacten'], ['pm.agile.scrumfail', 'Scrum in het echt'],
  ['pm.agile.refine', 'Refinement'], ['pm.agile.points', 'Velocity'], ['pm.agile.forecast', 'Voorspellen'],
  ['pm.agile.wip', 'WIP-limieten'], ['pm.agile.flowmetrics', 'Cycle time'], ['pm.agile.flowsteer', 'Sturen op flow'],
  ['pm.agile.whyagile', 'Wat agile is'], ['pm.agile.scrumbasics', 'Scrum Team'], ['pm.agile.stories', 'User stories'], ['pm.agile.board', 'kanbanbord']]) has(id, [word]);
for (const [id, word] of [['pm.agile.principles', 'The twelve principles'], ['pm.agile.leanroots', 'roots'], ['pm.agile.fit', 'When agile fits'],
  ['pm.agile.events', 'The five Scrum events'], ['pm.agile.artefacts', 'The three artefacts'], ['pm.agile.scrumfail', 'Scrum for real'],
  ['pm.agile.refine', 'Refinement'], ['pm.agile.points', 'Velocity'], ['pm.agile.forecast', 'Forecasting'],
  ['pm.agile.wip', 'WIP limits'], ['pm.agile.flowmetrics', 'Cycle time'], ['pm.agile.flowsteer', 'Steering on flow'],
  ['pm.agile.whyagile', 'What agile is'], ['pm.agile.scrumbasics', 'Scrum Team'], ['pm.agile.stories', 'User stories'], ['pm.agile.board', 'Kanban board']]) has(id, [word], 'en');
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

// the topic titles: "Scrum: rollen, events en artefacten" wraps to four lines in the default 128-unit tile (no word is wider
// than it, 110 units), so, as pm.land.intro, the film declares tileUnits = the room of its narrowest title box, the closing
// grid's tile (GRID.tile - 12 units of text, up to three lines), and every title box of the stage wraps with D.tileUnits
// (the kit's checkLabels holds the titles to it too, also after a rename without a rebuild)
const TILE_TEXT = GRID.tile - 12;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the grid's tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the grid's tile`);
}

// ---------------------------------------------------------------- the world (hall B, as field film 4, with the MES on a table)
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

// where things stand (cm), as in the pilot and field film 4: line 3's marked floor at the back wall at the right under the
// switchboard, line 4 (which stays) next to it, the power cabinet at the back wall at the left, the MES (a laptop on a
// small table) at the front of the hall
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const MESTAB = { x: 70, y: 112, w: 58, d: 30, h: 74 };
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the plant manager (the sponsor) and the team lead of line 3 (the Product Owner of the MES) are the pm cast;
// the IT team (two Developers and the Scrum Master) and the two operators are pm.agile.scrum's figures. Each stands in a
// cue group; the stage script shows each when the story needs it.
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
  g('pp-devs', scrumPerson(w, k, G, P, { x: 84, y: 96, key: 'devs', look: 'dev2', along: 'x' }) + scrumPerson(w, k, G, P, { x: 116, y: 96, key: 'devs', look: 'dev', along: 'x' })),
  g('pp-sm', scrumPerson(w, k, G, P, { x: 46, y: 126, key: 'sm', look: 'sm', along: 'y' })),
  g('pp-sponsor', person('sponsor', 36, 150, 'y')),
  cueG('mes', w.table(MESTAB) + w.laptop({ x: MESTAB.x + MESTAB.w / 2, y: MESTAB.y + MESTAB.d / 2, z: MESTAB.h, toward: 1 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has two tool chips (tool1, tool2) for the two
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Agile and Scrum is a cue group of its own (map-agile).
const tiles = ['tMind', 'tScrum', 'tBack', 'tKan'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('team', g('teamB', ''))
  + cueG('wf', g('wfB', '')) + cueG('rounds', g('roundsB', '')) + cueG('loop', g('loopB', ''))
  + cueG('sprint', g('sprintB', '')) + cueG('po', g('poB', '')) + cueG('smr', g('smB', '')) + cueG('dvr', g('dvB', ''))
  + cueG('list', g('listB', '')) + cueG('size', g('sizeB', '')) + cueG('range', g('rangeB', ''))
  + cueG('board', g('boardB', '')) + cueG('block', g('blockB', '')) + cueG('cycle', g('cycleB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Agile and Scrum lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.agile'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const AGILE_PLACE = pmMap.places.find((p) => p.module === 'pm.agile');
const MAPZ = [AGILE_PLACE.x + AGILE_PLACE.w / 2, AGILE_PLACE.y + AGILE_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.agile')}"`), 'the map lights pm.agile as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor and the MES
  { from: cam(135, 100, 70, 1), to: cam(140, 100, 70, 1.05) }, // s2 the operators at line 3 and the IT team at the MES
  { from: cam(110, 115, 70, 1.12), to: cam(105, 115, 70, 1.18) }, // s3 the IT team at the MES table
  { from: cam(110, 115, 70, 1.12), to: cam(105, 115, 70, 1.18) }, // s4 the team lead and the IT team at the table
  { from: cam(150, 95, 60, 1.05), to: cam(145, 100, 60, 1.1) }, // s5 the operators at the line, the IT team at the table
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.agile.intro',
  title: { nl: 'Het MES in korte rondes', en: 'The MES in short rounds' },
  module: 'pm.agile',
  // the room of text in the narrowest title box (the closing grid's tile), see the module section above
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.agile, the scene that explains it and its tile
  topics: {
    mindset: { scene: 's2', cue: 'tMind' },
    scrum: { scene: 's3', cue: 'tScrum' },
    backlog: { scene: 's4', cue: 'tBack' },
    kanban: { scene: 's5', cue: 'tKan' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Lijn 3 draait in hal B. Nu komt er een nieuw MES voor de orders op de vloer.', en: 'Line 3 runs in hall B. Now a new MES is coming for the orders on the floor.', focus: ['goal', 'line3', 'mes'] },
        { nl: 'Jij leidt dat IT-project voor de plantmanager. Het IT-team bouwt het MES.', en: 'You lead that IT project for the plant manager. The IT team builds the MES.', focus: ['team', 'sponsor', 'devs', 'mes'] },
        { nl: 'We volgen dit ene project langs de vier onderwerpen van de module.', en: 'We follow this one project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Agile denken', en: 'The agile mindset' },
      beats: [
        { nl: 'Eerste onderwerp: Agile denken. Hoe bouw je iets wat de operators echt gebruiken?', en: 'First topic: The agile mindset. How do you build something the operators really use?', focus: ['tMind', 'crew', 'mes'] },
        { nl: 'In een {t:Watervalaanpak|watervalaanpak} zien de operators het MES pas aan het eind. Dan klopt het vaak niet.', en: 'In a {t:Waterfall|waterfall} approach the operators see the MES only at the end. It often turns out wrong.', cue: { Watervalaanpak: 'wf' }, focus: ['wf', 'crew'] },
        { nl: 'Agile werkt in korte rondes, {t:Iteratie|iteraties}. Elke ronde levert iets kleins dat echt werkt.', en: 'Agile works in short rounds, {t:Iteration|iterations}. Each round delivers something small that really works.', cue: { Iteratie: 'rounds' }, focus: ['rounds', 'devs', 'mes'] },
        { nl: 'De operators proberen het uit en het team stuurt bij. Zo merk je het na weken, niet na maanden.', en: 'The operators try it out and the team adjusts. So you notice after weeks, not months.', focus: ['loop', 'crew', 'devs'] },
        { nl: 'Bij agile denken gebruiken we vaak het {t:Agile Manifesto|Agile Manifesto} en een {t:Hybride aanpak|hybride aanpak}.', en: 'For the agile mindset we often use the {t:Agile Manifesto|Agile Manifesto} and a {t:Hybrid approach|hybrid approach}.', cue: { 'Agile Manifesto': 'tool1', 'Hybride aanpak': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Scrum', en: 'Scrum' },
      beats: [
        { nl: 'Tweede onderwerp is Scrum: rollen, events en artefacten. Hoe werkt het IT-team samen?', en: 'Second topic is Scrum: roles, events and artefacts. How does the IT team work together?', focus: ['tScrum', 'devs', 'mes'] },
        { nl: 'Het team werkt in {t:Sprint|sprints} van twee weken. Elke sprint maakt het iets bruikbaars af.', en: 'The team works in {t:Sprint|sprints} of two weeks. Each sprint it finishes something usable.', cue: { Sprint: 'sprint' }, focus: ['sprint', 'devs', 'mes'] },
        { nl: 'De {t:Product Owner|Product Owner} is de teamleider van lijn 3. Hij bepaalt wat eerst komt, want hij kent de vloer.', en: 'The {t:Product Owner|Product Owner} is the team lead of line 3. He decides what comes first, because he knows the floor.', cue: { 'Product Owner': 'po' }, focus: ['po', 'teamlead'] },
        { nl: 'De {t:Scrum Master|Scrum Master} helpt het team en ruimt obstakels op. De {t:Developers|Developers} bouwen het MES.', en: 'The {t:Scrum Master|Scrum Master} helps the team and clears obstacles. The {t:Developers|Developers} build the MES.', cue: { 'Scrum Master': 'smr', Developers: 'dvr' }, focus: ['smr', 'dvr', 'sm', 'devs'] },
        { nl: 'Bij Scrum gebruiken we vaak een {t:Daily Scrum|Daily Scrum} en een {t:Sprint Review|Sprint Review}.', en: 'For Scrum we often use a {t:Daily Scrum|Daily Scrum} and a {t:Sprint Review|Sprint Review}.', cue: { 'Daily Scrum': 'tool1', 'Sprint Review': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Backlog en schatten', en: 'Backlog and estimating' },
      beats: [
        { nl: 'Derde onderwerp: Backlog en schatten. Wat bouwen we eerst, en hoe lang duurt het?', en: 'Third topic: Backlog and estimating. What do we build first, and how long will it take?', focus: ['tBack', 'teamlead', 'devs'] },
        { nl: 'De Product Owner zet al het werk op één lijst. Wat het meest oplevert, staat vaak bovenaan.', en: 'The Product Owner puts all the work on one list. What delivers the most is often at the top.', focus: ['list', 'teamlead'] },
        { nl: 'Het team schat de grootte {t:Relatief schatten|relatief}, door te vergelijken met werk dat het al kent.', en: 'The team estimates the size {t:Relative estimation|relatively}, by comparing with work it already knows.', cue: { 'Relatief schatten': 'size' }, focus: ['size', 'devs'] },
        { nl: 'Over de einddatum zijn we eerlijk. We geven een voorspelling met een kans en geen datum.', en: 'We are honest about the end date. We give a forecast with a probability, not a date.', focus: ['range', 'devs'] },
        { nl: 'Bij Backlog en schatten gebruiken we vaak {t:User story|user stories} en {t:Planning poker|planning poker}.', en: 'For Backlog and estimating we often use {t:User story|user stories} and {t:Planning poker|planning poker}.', cue: { 'User story': 'tool1', 'Planning poker': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Kanban en flow', en: 'Kanban and flow' },
      beats: [
        { nl: 'Vierde onderwerp: Kanban en flow. Hoe houd je wensen en storingen van de vloer in beweging?', en: 'Fourth topic: Kanban and flow. How do you keep requests and faults from the floor moving?', focus: ['tKan', 'crew'] },
        { nl: 'Bij {t:Kanban|Kanban} schuift elke wens of storing als kaart van links naar rechts.', en: 'In {t:Kanban|Kanban} every request or fault is a card that moves from left to right.', cue: { Kanban: 'board' }, focus: ['board', 'crew'] },
        { nl: 'Een kaart die niet verder kan, is {t:Geblokkeerd|geblokkeerd}. Zo zie je waar het hapert.', en: 'A card that cannot move on is {t:Blocked|blocked}. So you see where it stutters.', cue: { Geblokkeerd: 'block' }, focus: ['block', 'board'] },
        { nl: 'De tijd van begin tot klaar heet {t:Cycle time|cycle time}. Zo zie je hoe snel het werk stroomt.', en: 'The time from start to done is called {t:Cycle time|cycle time}. So you see how fast the work flows.', cue: { 'Cycle time': 'cycle' }, focus: ['cycle', 'board'] },
        { nl: 'Bij Kanban gebruiken we vaak een {t:Kanbanbord|kanbanbord} en een {t:WIP-limiet|WIP-limiet}.', en: 'For Kanban we often use a {t:Kanban board|Kanban board} and a {t:WIP limit|WIP limit}.', cue: { Kanbanbord: 'tool1', 'WIP-limiet': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Agile geeft de reden, Scrum het ritme, de lijst de volgorde en Kanban de stroom.', en: 'It connects. Agile gives the reason, Scrum the rhythm, the list the order and Kanban the flow.', focus: ['flow', 'mes'] },
        { nl: 'Kanban begint waar je nu bent. Daarom past het ook naast Scrum.', en: 'Kanban starts where you are now. That is why it also fits alongside Scrum.', focus: ['decision', 'devs'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Agile en Scrum is het eerste station van IT en agile.', en: 'The map of Projects: Agile and Scrum is the first station of IT and agile.', focus: mapCue('pm.agile') },
        { nl: 'Agile en Scrum heeft vier onderwerpen, elk met vier niveaus.', en: 'Agile and Scrum has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Agile denken. Op niveau Basis: wat agile is, het Scrum Team, user stories en het kanbanbord.', en: 'Start with the agile mindset. At Basics level: what agile is, the Scrum Team, user stories, the Kanban board.', focus: ['tMind', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen de twaalf principes, de events, refinement en WIP-limieten erbij.', en: 'At Working knowledge you add the twelve principles, the events, refinement and WIP limits.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen de wortels van agile, de artefacten, velocity en het meten van flow erbij.', en: 'At Advanced you add the roots of agile, the artefacts, velocity and measuring flow.', focus: 'lv3' },
        { nl: 'Op Expert komen de grenzen van agile, Scrum in het echt, voorspellen met data en sturen op flow erbij.', en: 'At Expert you add the limits of agile, Scrum for real, forecasting from data and steering on flow.', focus: 'lv4' },
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
// explaining them (Kanban's WIP limit gets one clause, the acronym being opaque).
// Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): every
// word of this film already has a voice rule of an earlier film (agile, hybride,
// Agile Manifesto as in pm.plan.method, Daily Scrum, Sprint Review, Product Owner, Developers, events,
// refinement, user stories, cycle time, MES), so the film adds no SAY rule.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Lijn 3 draait in hal B. Nu komt er een nieuw MES, het systeem dat de orders op de vloer aanstuurt.',
      en: 'Line 3 runs in hall B. Now a new MES is coming, the system that runs the orders on the floor.' },
    { nl: 'Jij leidt dat IT-project voor de plantmanager. Het IT-team bouwt het MES.',
      en: 'You lead that IT project for the plant manager. The IT team builds the MES.' },
    { nl: 'We volgen dit ene project langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this one project through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 the agile mindset
    { nl: 'Het eerste onderwerp is Agile denken. Hoe bouw je iets wat de operators echt gebruiken?',
      en: 'The first topic is the agile mindset. How do you build something the operators really use?' },
    { nl: 'In een {t:Watervalaanpak|watervalaanpak} zien de operators het MES pas aan het eind. Dan blijkt vaak dat het niet is wat ze nodig hebben.',
      en: 'In a {t:Waterfall|waterfall} approach the operators only see the MES at the end. Then it often turns out not to be what they need.' },
    { nl: 'Agile werkt in korte rondes, {t:Iteratie|iteraties}. Elke ronde levert iets kleins dat echt werkt.',
      en: 'Agile works in short rounds, {t:Iteration|iterations}. Each round delivers something small that really works.' },
    { nl: 'De operators proberen het uit en het team stuurt bij. Zo merk je het na weken, niet na maanden.',
      en: 'The operators try it out and the team adjusts. So you notice after weeks, not months.' },
    { nl: 'Bij agile denken gebruiken we vaak het Agile Manifesto en een hybride aanpak.',
      en: 'For the agile mindset we often use the Agile Manifesto and a hybrid approach.' },
  ],
  [ // s3 Scrum
    { nl: 'Het tweede onderwerp is Scrum, met rollen, events en artefacten. Hoe werkt het IT-team samen?',
      en: 'The second topic is Scrum, with roles, events and artefacts. How does the IT team work together?' },
    { nl: 'Het team werkt in {t:Sprint|sprints} van twee weken. Elke sprint maakt het iets bruikbaars af, en dan begint de volgende.',
      en: 'The team works in {t:Sprint|sprints} of two weeks. Each sprint it finishes something usable, and then the next one starts.' },
    { nl: 'De {t:Product Owner|Product Owner} is de teamleider van lijn 3. Hij bepaalt wat eerst komt, want hij kent de vloer.',
      en: 'The {t:Product Owner|Product Owner} is the team lead of line 3. He decides what comes first, because he knows the floor.' },
    { nl: 'De {t:Scrum Master|Scrum Master} helpt het team en ruimt obstakels op. De {t:Developers|Developers} bouwen het MES.',
      en: 'The {t:Scrum Master|Scrum Master} helps the team and clears obstacles. The {t:Developers|Developers} build the MES.' },
    { nl: 'Bij Scrum gebruiken we vaak een Daily Scrum en een Sprint Review.',
      en: 'For Scrum we often use a Daily Scrum and a Sprint Review.' },
  ],
  [ // s4 backlog and estimating
    { nl: 'Het derde onderwerp is Backlog en schatten. Wat bouwen we eerst, en hoe lang duurt het?',
      en: 'The third topic is Backlog and estimating. What do we build first, and how long will it take?' },
    { nl: 'De Product Owner zet al het werk op één lijst. Wat het meest oplevert, staat vaak bovenaan.',
      en: 'The Product Owner puts all the work on one list. What delivers the most is often at the top.' },
    { nl: 'Het team schat de grootte {t:Relatief schatten|relatief}, door te vergelijken met werk dat het al kent.',
      en: 'The team estimates the size {t:Relative estimation|relatively}, by comparing with work it already knows.' },
    { nl: 'Over de einddatum zijn we eerlijk. We geven een voorspelling met een kans en geen datum, op basis van wat het team echt afmaakt.',
      en: 'We are honest about the end date. We give a forecast with a probability and not a date, based on what the team really finishes.' },
    { nl: 'Bij Backlog en schatten gebruiken we vaak user stories en planning poker.',
      en: 'For Backlog and estimating we often use user stories and planning poker.' },
  ],
  [ // s5 Kanban and flow
    { nl: 'Het vierde onderwerp is Kanban en flow. Hoe houd je wensen en storingen van de vloer in beweging?',
      en: 'The fourth topic is Kanban and flow. How do you keep requests and faults from the floor moving?' },
    { nl: 'Bij {t:Kanban|Kanban} schuift elke wens of storing als kaart van links naar rechts.',
      en: 'In {t:Kanban|Kanban} every request or fault is a card that moves from left to right.' },
    { nl: 'Een kaart die niet verder kan, is {t:Geblokkeerd|geblokkeerd}. Zo zie je waar het hapert.',
      en: 'A card that cannot move on is {t:Blocked|blocked}. So you see where it stutters.' },
    { nl: 'De tijd van begin tot klaar heet {t:Cycle time|cycle time}. Zo zie je hoe snel het werk stroomt.',
      en: 'The time from start to done is called {t:Cycle time|cycle time}. So you see how fast the work flows.' },
    { nl: 'Bij Kanban gebruiken we vaak een kanbanbord en een WIP-limiet, een maximum aan werk dat tegelijk loopt.',
      en: 'For Kanban we often use a Kanban board and a WIP limit, a maximum of work in progress at once.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Agile denken geeft de reden, Scrum het ritme, de lijst met werk de volgorde en Kanban de stroom.',
      en: 'It all connects. The agile mindset gives the reason, Scrum the rhythm, the list of work the order and Kanban the flow.' },
    { nl: 'Kanban begint waar je nu bent. Daarom past het ook naast Scrum.',
      en: 'Kanban starts where you are now. That is why it also fits alongside Scrum.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Agile en Scrum is het eerste station van IT en agile.',
      en: 'This is the map of Projects. Agile and Scrum is the first station of IT and agile.' },
    { nl: 'Agile en Scrum heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Agile and Scrum has four topics, each with four levels.' },
    { nl: 'Begin bij Agile denken. Op niveau Basis gaat het over wat agile is, het Scrum Team, user stories en het kanbanbord.',
      en: 'Start with the agile mindset. At Basics level it is about what agile is, the Scrum Team, user stories and the Kanban board.' },
    { nl: 'Op Werkkennis komen de twaalf principes, de events, refinement en WIP-limieten erbij.',
      en: 'At Working knowledge you add the twelve principles, the events, refinement and WIP limits.' },
    { nl: 'Op Gevorderd komen de wortels van agile, de artefacten, velocity en het meten van flow erbij.',
      en: 'At Advanced you add the roots of agile, the artefacts, velocity and measuring flow.' },
    { nl: 'Op Expert komen de grenzen van agile, Scrum in het echt, voorspellen met data en sturen op flow erbij.',
      en: 'At Expert you add the limits of agile, Scrum for real, forecasting from data and steering on flow.' },
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
const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"],[data-cue="devs"],[data-cue="sm"])';
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
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.pm-curve-ok{fill:none;stroke:var(--fp-accent);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:6 5}
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
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-curve,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-curve{stroke-width:3.4}
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait, zoals in het vierde veldfilmpje, IT en agile. Op de vloer lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, aan de zijwand een kalender en voorin een tafel met een laptop: het nieuwe MES. Per onderwerp komen er mensen bij: de plantmanager, het IT-team bij de tafel, de teamleider van lijn 3 als Product Owner en twee operators bij lijn 3. Rechts een paneel, gemarkeerd als voorbeeld of schema: het nieuwe MES en wie wat doet; een watervalbalk waarin de operators het MES pas aan het eind zien, korte rondes met elk een stuk dat werkt en een stap van proberen naar bijsturen; een sprint van twee weken met de drie rollen van Scrum; een lijst met werk in volgorde, drie blokken van verschillende grootte en een bandbreedte voor de einddatum; een kanbanbord met drie kolommen, een geblokkeerde kaart en een pijl voor de cycle time; en per onderwerp twee namen van hulpmiddelen. Aan het eind de kaart van Projecten met Agile en Scrum verlicht, en de vier onderwerpen met hun vier niveaus.',
  en: 'Hall B of the plant, where line 3 runs, as in the fourth field film, IT and agile. On the floor line 3 in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, on the side wall a calendar and at the front a table with a laptop: the new MES. Each topic brings people: the plant manager, the IT team at the table, the team lead of line 3 as Product Owner and two operators at line 3. At the right a panel, marked as an example or a diagram: the new MES and who does what; a waterfall bar in which the operators only see the MES at the end, short rounds each with a piece that works and a step from trying to adjusting; a sprint of two weeks with the three roles of Scrum; a list of work in order, three blocks of different sizes and a range for the end date; a Kanban board with three columns, a blocked card and an arrow for the cycle time; and per topic two names of tools. At the end the map of Projects with Agile and Scrum lit, and the four topics with their four levels.',
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

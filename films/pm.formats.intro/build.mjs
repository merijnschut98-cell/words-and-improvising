// Dev tool, not shipped. Builds the module intro film "Het plan ligt er: nu de mensen / The plan is ready: now the people"
// for Werkvormen en overleggen (pm.formats), the station between Plan and Run of the field "Een project van begin tot eind"
// and a module intro film (v17): the high-over picture at the top of the module, before its four topics
// (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.formats.intro/build.mjs            build the page
//   node films/pm.formats.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.formats.intro.html: one offline page with the anatomy kit, the stage script and
// the player inlined. The index names it (pm.formats' `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved intros (films/pm.plan.intro, pm.approach.intro, pm.run.intro and the others): ONE concrete
// project travels through the module, the map before the detail, no calculations, each topic names ONE tool of its own
// lessons without explaining it (the Checkpoint of 14 Nov, and Merijn's rule of 15 Nov: one real tool per topic, a term the
// Basis or Werkkennis lessons teach, no brand, no click path). The story is the shared project world of the field film
// (films/pm.field.lifecycle): line 3 moves to hall B in the summer shutdown. This module is the station AFTER the plan and
// BEFORE the run: the plan is ready, and the consultant ("jij") brings the people together in meetings and sessions with
// the sponsor, the team lead and the planner. The film agrees with the plan intro's last scene (the plan is ready) and
// with the run intro's first (the project has to keep moving), and ends where the Run station begins. The STORY IS DRAWN IN
// THE ROOM: hall B with the new floor and the dashed outline of line 3, line 4 next to it, the power cabinet, the dashed
// place of the switchboard and the calendar of the shutdown; on the back wall a brown paper (s3) and a shared board (s4), on
// the desk the pre-read (s2) and the interview guide (s5).
//   s1 the plan is ready: the module sits between the plan and the run, the four topics
//   s2 Welk overleg wanneer: every format has a purpose, participants, a duration and an output, a meeting shares or
//      decides and a workshop makes something, the kick-off; tool: voorleesstuk (pre-read)
//                                                         → pm.formats.catalogue (Basis), .kickoff (Werkkennis)
//   s3 Een werksessie ontwerpen en leiden: one purpose and a visible output, the facilitator leads the process, the group
//      draws the process of line 3 as it really goes; tool: brown paper → pm.formats.workshop (Basis), .brownpaper (Werkkennis)
//   s4 Ideeën en besluiten in de groep: many ideas first, then choose; silent writing, grouping, dots, an owner and a date;
//      tool: digitaal whiteboard                          → pm.formats.diverge (Basis), .session (Werkkennis)
//   s5 Werkvormen op de vloer: what people say and what happens, the four formats, an interview round across levels;
//      tool: interviewleidraad                            → pm.formats.floor (Basis), .interviews (Werkkennis)
//   s6 the shared Projects map with Werkvormen en overleggen lit, then the module's four topics with their levels as
//      columns, where to start, what each later level adds, and the hand-over to Run
// Definitions as the Basis lessons word them. The tools are terms of those lessons (checked below, nl and en). A
// Werkkennis tool a scene names does not come back in the closing grid: the grid names what each level adds in other
// words. Terms come from the module's lessons (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to
// its map (every topic named in a caption of its own scene, explained in two beats and lit), to the narration guard and to
// the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor, the team lead, the planner and "jij"
// from its cast. The things of hall B are the pilot's (../pm.plan.intro/hall.mjs, imported, not copied). A panel at the
// right, in stage space, draws each step as a schema, labelled "voorbeeld" (the line's move) or "schema" (the module's map).
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
// module's topics or levels move): s6 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'pm.formats');
const LEVELS = {
  meetings: ['pm.formats.catalogue', 'pm.formats.kickoff', 'pm.formats.system', 'pm.formats.governance'],
  workshop: ['pm.formats.workshop', 'pm.formats.brownpaper', 'pm.formats.design', 'pm.formats.facilitation'],
  ideas: ['pm.formats.diverge', 'pm.formats.session', 'pm.formats.decide', 'pm.formats.legitimacy'],
  floor: ['pm.formats.floor', 'pm.formats.interviews', 'pm.formats.demo', 'pm.formats.kaizenevent'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.formats has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: a project has several formats, each with a purpose, participants, a duration and an output; a meeting shares or
// decides, a workshop makes something together; the kick-off; the pre-read goes out beforehand
has('pm.formats.catalogue', ['Een project heeft meerdere overlegvormen', 'een doel, deelnemers, een duur en een opbrengst', 'Een overleg is bedoeld om te delen of te besluiten', 'een werksessie (workshop) is bedoeld om samen iets te maken', 'Kick-off: het project start', 'Overlegvorm', 'Werksessie']);
has('pm.formats.catalogue', ['A project has several meeting formats', 'a purpose, participants, a duration and an output', 'A meeting is meant to share or to decide', 'a workshop is meant to make something together', 'Kick-off: the project starts', 'Meeting format', 'Workshop'], 'en');
has('pm.formats.kickoff', ['Waarom, door de sponsor', 'voor de mensen die het werk doen', 'Stuur twee dagen vooraf een voorleesstuk (pre-read) van één pagina', 'Wie het leest, hoeft in de zaal niet meer te horen wat er al staat', 'Voorleesstuk']);
has('pm.formats.kickoff', ['Why, by the sponsor', 'for the people who do the work', 'Send a one-page pre-read two days ahead', 'Whoever reads it need not hear in the room what is already there', 'Pre-read'], 'en');
// s3: a workshop has one purpose and a visible output you can photograph; the facilitator leads the process; the brown
// paper: the group draws the process left to right with sticky notes, first how it really goes
has('pm.formats.workshop', ['ze levert een zichtbare uitkomst op die je kunt fotograferen', 'De facilitator leidt het proces en stuurt niet op de inhoud', 'Facilitator']);
has('pm.formats.workshop', ['it delivers a visible output you can photograph', 'The facilitator leads the process and does not steer the content', 'Facilitator'], 'en');
has('pm.formats.brownpaper', ['Een brown paper is een lang vel papier', 'De groep tekent met geeltjes het proces van links naar rechts', 'we tekenen hoe het nu echt gaat, niet hoe het volgens de procedure hoort', 'Brown paper']);
has('pm.formats.brownpaper', ['A brown paper is a long sheet of paper', 'The group draws the process from left to right with sticky notes', 'we draw how it really goes, not how the procedure says it should', 'Brown paper'], 'en');
// s4: first diverge, then converge; silent writing, grouping; the online whiteboard as a shared board; the dots and the
// top three with an owner and a date
has('pm.formats.diverge', ['eerst divergeren, dan convergeren', 'Stil schrijven', 'Stille mensen tellen mee', 'Clusteren']);
has('pm.formats.diverge', ['first diverge, then converge', 'Silent writing', 'Quiet people count', 'Affinity grouping'], 'en');
has('pm.formats.session', ['Een digitaal whiteboard (online whiteboard) is een gedeeld bord waarop iedereen tegelijk geeltjes plakt', 'Stemronde (voting round) met drie stippen per persoon', 'De top drie krijgen een eigenaar en een datum', 'Digitaal whiteboard']);
has('pm.formats.session', ['An online whiteboard is a shared board on which everyone sticks notes at the same time', 'A voting round with three dots per person', 'The top three get an owner and a date', 'Online whiteboard'], 'en');
// s5: reports and meetings show what people say, the floor what happens; the four formats; an interview round across levels
// and its guide of five open questions
has('pm.formats.floor', ['Rapporten en overleg laten zien wat mensen zeggen; de werkvloer laat zien wat er gebeurt', 'de gembawalk, de interviewronde, de demo en het kaizen-event', 'Interviewronde', 'losse gesprekken met mensen uit verschillende lagen']);
has('pm.formats.floor', ['Reports and meetings show what people say; the shop floor shows what happens', 'the gemba walk, the interview round, the demo and the kaizen event', 'Interview round', 'one-to-one conversations with people at different levels'], 'en');
has('pm.formats.interviews', ['interviewleidraad (interview guide) met vijf open vragen', 'Steekproef over lagen']);
has('pm.formats.interviews', ['interview guide with five open questions', 'Sample across levels'], 'en');
// s6: what each later level adds is the title of its lessons, in the app's words
const TITLES = { 'pm.formats.kickoff': 'Een kick-off voorbereiden en leiden', 'pm.formats.brownpaper': 'Een brown-papersessie houden', 'pm.formats.session': 'Een ideeënsessie op een digitaal bord', 'pm.formats.interviews': 'Een interviewronde houden',
  'pm.formats.system': 'Het overlegsysteem van één project', 'pm.formats.design': 'Ontwerpkeuzes voor een sessie', 'pm.formats.decide': 'Wie beslist, en hoe', 'pm.formats.demo': 'Een demo op de vloer en de juiste werkvorm kiezen',
  'pm.formats.governance': 'Het overleg als governance', 'pm.formats.facilitation': 'Faciliteren als vak', 'pm.formats.legitimacy': 'Legitimiteit en schijninspraak', 'pm.formats.kaizenevent': 'Een kaizen-event laten doen' };
for (const [id, title] of Object.entries(TITLES)) assert(lessons.nl.get(id).title === title, `${id} is no longer called "${title}"`);
// the tools of each topic are terms of its own Werkkennis lesson (the Checkpoint of 14 Nov), nl and en; the closing grid
// names none of them
const TOOLS = [['pm.formats.kickoff', 'Voorleesstuk', 'Pre-read'], ['pm.formats.brownpaper', 'Brown paper', 'Brown paper'], ['pm.formats.session', 'Digitaal whiteboard', 'Online whiteboard'], ['pm.formats.interviews', 'Interviewleidraad', 'Interview guide']];
for (const [id, nl, en] of TOOLS) {
  assert(lessons.nl.get(id).terms.some((t) => t.term === nl), `${id} has no term "${nl}"`);
  assert(lessons.en.get(id).terms.some((t) => t.term === en), `${id} has no term "${en}" (en)`);
}
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
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
// itself is not drawn: it still stands in the old hall. The back wall between the cabinet and the switchboard's place
// carries the brown paper (s3) and the shared board (s4), one at a time; the desk stands in front at the right.
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
// the last three weeks of the calendar are the summer shutdown
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
// the incoming power: from the wall opening to the cabinet and on to the line; dashed = not connected yet
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the brown paper: a long brown sheet on the back wall (x 62 to 204, z 112 to 204), taped at the corners; its notes are
// drawn by the stage script into the group "pnotes", in the plane of the wall (local u = x, v = -z)
const PAPER = `<g transform="${w.planeY(1.4)}"><path class="pm-brown" d="${w.rectD(62, -204, 204, -112)}"/></g><g transform="${w.planeY(2.2)}">${g('pnotes', '')}</g>`;
// the shared board: the whiteboard of the pilot, its notes drawn by the stage script into "snotes"
const BOARD = w.board({ x0: 66, x1: 200, z0: 124, z1: 200 });
const SCREEN = BOARD.svg + `<g transform="${w.planeY(2.9)}">${g('snotes', '')}</g>`;
// the desk of the planner, and on it the pre-read (s2) and the interview guide (s5): sheets with lines of print
const DESK = w.table({ x: 196, y: 98, w: 66, d: 32, h: 74 });
const PREREAD = w.sheet({ x: 203, y: 100, z: 74, lines: 6 }).svg;
const GUIDE = w.sheet({ x: 232, y: 100, z: 74, lines: 5 }).svg;

// the people: "jij", the sponsor, the team lead and the planner are the pm cast (films/_pm/world.mjs). Each stands
// in a cue group; the cast that is not on stage is hidden by the stage script.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + cablePath(true)),
  cueG('switch', hall.switchboardGhost(SWB)),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-paper', cueG('paper', PAPER)),
  g('pp-screen', cueG('screen', SCREEN)),
  g('pp-planner', person('planner', 229, 82, 'x')),
  cueG('desk', DESK),
  g('pp-preread', cueG('preread', PREREAD)),
  g('pp-guide', cueG('guide', GUIDE)),
  g('pp-sponsor', person('sponsor', 46, 140, 'y')),
  g('pp-lead', person('teamlead', 134, 76, 'x')),
  g('pp-jij', person('jij', 112, 142, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has one tool chip (tool1) for the name of its sentence.
// The shared map (the kit's mapScene) sits under the panel; its place
// Werkvormen en overleggen is a cue group of its own (map-formats).
const tiles = ['tMeet', 'tWork', 'tIdeas', 'tFloor'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('plan', g('planB', '')) + cueG('path', g('pathB', '')) + cueG('ask', g('askB', ''))
  + cueG('format', g('formatB', '')) + cueG('mvw', g('mvwB', '')) + cueG('kick', g('kickB', ''))
  + cueG('goal', g('goalB', '')) + cueG('facil', g('facilB', '')) + cueG('lanes', g('lanesB', '')) + cueG('asis', g('asisB', ''))
  + cueG('ph1', g('ph1B', '')) + cueG('silent', g('silentB', '')) + cueG('clus', g('clusB', '')) + cueG('choose', g('chooseB', ''))
  + cueG('fmts', g('fmtsB', '')) + cueG('layers', g('layersB', '')) + cueG('guideP', g('guideB', ''))
  + cueG('tool1', g('tool1B', '')));
// the shared map, Werkvormen en overleggen lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.formats'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const FORMATS_PLACE = pmMap.places.find((p) => p.module === 'pm.formats');
const MAPZ = [FORMATS_PLACE.x + FORMATS_PLACE.w / 2, FORMATS_PLACE.y + FORMATS_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.formats')}"`), 'the map lights pm.formats as a cue group');

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
  { from: cam(140, 95, 70, 1.05), to: cam(165, 98, 70, 1.12) }, // s2 the group in the hall, then the desk with the pre-read
  { from: cam(110, 55, 115, 1.12), to: cam(118, 50, 115, 1.16) }, // s3 the brown paper and the facilitator
  { from: cam(118, 50, 115, 1.14), to: cam(125, 48, 115, 1.1) }, // s4 the shared board
  { from: cam(150, 95, 70, 1.08), to: cam(185, 98, 66, 1.16) }, // s5 the people of the floor, then the desk with the guide
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(6).fill(30);
const spec = {
  id: 'pm.formats.intro',
  title: { nl: 'Het plan ligt er: nu de mensen', en: 'The plan is ready: now the people' },
  module: 'pm.formats',
  // the narrowest box that draws a topic title: the closing grid's tile (GRID.tile 190 less its padding); the route's
  // rows are wider. The film declares the width it draws, the kit holds the titles to it (checkLabels)
  tileUnits: GRID.tile - 12,
  // the map: per topic of pm.formats, the scene that explains it and its tile
  topics: {
    meetings: { scene: 's2', cue: 'tMeet' },
    workshop: { scene: 's3', cue: 'tWork' },
    ideas: { scene: 's4', cue: 'tIdeas' },
    floor: { scene: 's5', cue: 'tFloor' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Het plan ligt er', en: 'The plan is ready' },
      beats: [
        { nl: 'Het plan voor lijn 3 ligt er. Nu gaan sponsor, team en jij aan de slag.', en: 'The plan for line 3 is ready. Now the sponsor, team and you get to work.', focus: ['plan', 'jij', 'sponsor', 'teamlead', 'calendar'] },
        { nl: 'Tussen het plan en het uitvoeren liggen overleggen en sessies.', en: 'Between the plan and the run lie meetings and sessions.', focus: ['path', 'jij'] },
        { nl: 'Vier onderwerpen, van het overleg tot de vloer.', en: 'Four topics, from the meeting to the floor.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Welk overleg wanneer', en: 'Which meeting when' },
      beats: [
        { nl: 'Eerste onderwerp: Welk overleg wanneer.', en: 'First topic: Which meeting when.', focus: ['tMeet', 'jij', 'sponsor'] },
        { nl: 'Elke {t:Overlegvorm|overlegvorm} heeft een doel, deelnemers, een duur en een opbrengst.', en: 'Each {t:Meeting format|meeting format} has a purpose, participants, a duration and an output.', cue: { Overlegvorm: 'format' }, focus: ['format'] },
        { nl: 'Een overleg deelt of besluit. Een {t:Werksessie|werksessie} maakt samen iets.', en: 'A meeting shares or decides. A {t:Workshop|workshop} makes something together.', cue: { Werksessie: 'mvw' }, focus: ['mvw'] },
        { nl: 'Voor het werk begint, houd je een {t:Kick-off|kick-off} met het team.', en: 'Before the work begins, you hold a {t:Kick-off|kick-off} with the team.', cue: { 'Kick-off': 'kick' }, focus: ['kick', 'sponsor', 'teamlead', 'planner'] },
        { nl: 'Twee dagen vooraf gaat een {t:Voorleesstuk|voorleesstuk} van één pagina rond.', en: 'Two days ahead a one-page {t:Pre-read|pre-read} goes round.', cue: { Voorleesstuk: 'tool1' }, focus: ['tool1', 'preread', 'desk'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Een werksessie ontwerpen en leiden', en: 'Designing and leading a workshop' },
      beats: [
        { nl: 'Tweede onderwerp: Een werksessie ontwerpen en leiden.', en: 'Second topic: Designing and leading a workshop.', focus: ['tWork', 'ask', 'jij', 'sponsor'] },
        { nl: 'Een werksessie heeft één doel en een zichtbare uitkomst.', en: 'A workshop has one purpose and a visible output.', focus: ['goal', 'paper'] },
        { nl: 'Jij bent de {t:Facilitator|facilitator}. Je leidt het proces, niet de inhoud.', en: 'You are the {t:Facilitator|facilitator}. You lead the process, not the content.', cue: { Facilitator: 'facil' }, focus: ['facil', 'jij'] },
        { nl: 'De groep tekent het proces van lijn 3 op een {t:Brown paper|brown paper}.', en: 'The group draws the process of line 3 on a {t:Brown paper|brown paper}.', cue: { 'Brown paper': 'tool1' }, focus: ['tool1', 'paper', 'lanes'] },
        { nl: 'Eerst hoe het nu echt gaat, niet hoe de procedure het zegt.', en: 'First how it really goes, not how the procedure says it should.', focus: ['asis', 'lanes', 'paper'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Ideeën en besluiten in de groep', en: 'Ideas and decisions in a group' },
      beats: [
        { nl: 'Derde onderwerp: Ideeën en besluiten in de groep.', en: 'Third topic: Ideas and decisions in a group.', focus: ['tIdeas', 'ask', 'jij', 'sponsor'] },
        { nl: 'Eerst veel ideeën, dan kiezen. Op een {t:Digitaal whiteboard|digitaal whiteboard}.', en: 'First many ideas, then choose. On an {t:Online whiteboard|online whiteboard}.', cue: { 'Digitaal whiteboard': 'tool1' }, focus: ['tool1', 'screen'] },
        { nl: 'Iedereen begint met {t:Stil schrijven|stil schrijven}, zonder oordeel.', en: 'Everyone starts with {t:Silent writing|silent writing}, without judging.', cue: { 'Stil schrijven': 'silent' }, focus: ['silent', 'ph1', 'screen'] },
        { nl: 'Gelijke ideeën gaan bij elkaar. Dat heet {t:Clusteren|clusteren}.', en: 'Similar ideas go together. That is {t:Affinity grouping|affinity grouping}.', cue: { Clusteren: 'clus' }, focus: ['clus', 'screen'] },
        { nl: 'De groep kiest met stippen. De top drie krijgen een eigenaar en een datum.', en: 'The group chooses with dots. The top three get an owner and a date.', focus: ['choose', 'screen'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Werkvormen op de vloer', en: 'Formats on the floor' },
      beats: [
        { nl: 'Vierde onderwerp: Werkvormen op de vloer.', en: 'Fourth topic: Formats on the floor.', focus: ['tFloor', 'ask', 'jij', 'teamlead'] },
        { nl: 'De gembawalk, de interviewronde, de demo en het kaizen-event.', en: 'The gemba walk, the interview round, the demo and the kaizen event.', focus: ['fmts', 'line4'] },
        { nl: 'Jij houdt een {t:Interviewronde|interviewronde}, met mensen uit alle lagen.', en: 'You hold an {t:Interview round|interview round}, with people from every level.', cue: { Interviewronde: 'layers' }, focus: ['layers', 'sponsor', 'planner', 'teamlead'] },
        { nl: 'Elk gesprek volgt dezelfde {t:Interviewleidraad|interviewleidraad}.', en: 'Every conversation follows the same {t:Interview guide|interview guide}.', cue: { Interviewleidraad: 'tool1' }, focus: ['tool1', 'guideP', 'guide'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Dit is de kaart van Projecten. Werkvormen en overleggen ligt tussen Plannen en Uitvoeren.', en: 'This is the map of Projects. Formats and meetings lies between Plan and Run.', focus: mapCue('pm.formats') },
        { nl: 'Werkvormen en overleggen heeft vier onderwerpen, elk met vier niveaus.', en: 'Formats and meetings has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Welk overleg wanneer, op niveau Basis.', en: 'Start with Which meeting when, at Basics level.', focus: ['tMeet', 'start'] },
        { nl: 'Op Werkkennis houd je een kick-off, teken je een proces, doe je een online ideeënsessie en een interviewronde.', en: 'At Working knowledge you hold a kick-off, draw a process, run an online idea session and an interview round.', focus: 'lv2' },
        { nl: 'Op Gevorderd ontwerp je het overlegsysteem en de sessie, kies je wie beslist en welke werkvorm past.', en: 'At Advanced you design the meeting system and the session, choose who decides and which format fits.', focus: 'lv3' },
        { nl: 'Op Expert weeg je overleglast en legitimiteit, faciliteer je als vak en laat je een kaizen-event doen.', en: 'At Expert you weigh meeting load and legitimacy, facilitate as a craft and commission a kaizen event.', focus: 'lv4' },
        { nl: 'Daarna volgt Uitvoeren, waar het project in beweging blijft.', en: 'After that comes Run, where the project keeps moving.', focus: null },
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
// through the field film's rule in films/_kit/timeline.mjs (kept out of this film's text),
// sponsor, kick-off, voorleesstuk, werksessie, facilitator, interviewleidraad, gembawalk and kaizen-event as they are.
// This film's own SAY group (the last of the Dutch list) carries only brown paper and the digitaal whiteboard as a
// Dutch coach says them, each in its own phrase. The s6 narration says what its captions say, with the app's level words.
const SAY = [
  [ // s1 the plan is ready
    { nl: 'Het plan om lijn 3 naar hal B te verhuizen ligt er. Nu moeten sponsor, team en jij samen aan de slag.',
      en: 'The plan to move line 3 to hall B is ready. Now the sponsor, the team and you have to get to work together.' },
    { nl: 'Tussen het plan en het uitvoeren liggen overleggen en sessies.',
      en: 'Between the plan and the run lie meetings and sessions.' },
    { nl: 'Vier onderwerpen, van het overleg tot de werkvloer.',
      en: 'Four topics, from the meeting to the shop floor.' },
  ],
  [ // s2 which meeting when
    { nl: 'Het eerste onderwerp is Welk overleg wanneer.',
      en: 'The first topic is Which meeting when.' },
    { nl: 'Elke {t:Overlegvorm|overlegvorm} heeft een doel, deelnemers, een duur en een opbrengst.',
      en: 'Each {t:Meeting format|meeting format} has a purpose, participants, a duration and an output.' },
    { nl: 'Een overleg deelt of besluit. Een {t:Werksessie|werksessie} maakt samen iets.',
      en: 'A meeting shares or decides. A {t:Workshop|workshop} makes something together.' },
    { nl: 'Voor het werk begint, houd je een {t:Kick-off|kick-off} met het team. Daar leggen jullie doel, rollen en eerste stappen vast.',
      en: 'Before the work begins, you hold a {t:Kick-off|kick-off} with the team. There you fix the goal, the roles and the first steps.' },
    { nl: 'Twee dagen vooraf stuur je een {t:Voorleesstuk|voorleesstuk} van één pagina rond. Zo gaat de kick-off over afspraken.',
      en: 'Two days ahead you send round a one-page {t:Pre-read|pre-read}. That way the kick-off is about agreements.' },
  ],
  [ // s3 designing and leading a workshop
    { nl: 'Het tweede onderwerp is Een werksessie ontwerpen en leiden.',
      en: 'The second topic is Designing and leading a workshop.' },
    { nl: 'Een werksessie heeft één doel. Ze levert een zichtbare uitkomst op die je kunt fotograferen.',
      en: 'A workshop has one purpose. It delivers a visible output you can photograph.' },
    { nl: 'Jij bent de {t:Facilitator|facilitator}. Je leidt het proces en stuurt niet op de inhoud.',
      en: 'You are the {t:Facilitator|facilitator}. You lead the process and do not steer the content.' },
    { nl: 'De groep tekent het proces van lijn 3 met geeltjes op een {t:Brown paper|brown paper}.',
      en: 'The group draws the process of line 3 with sticky notes on a {t:Brown paper|brown paper}.' },
    { nl: 'Eerst hoe het nu echt gaat, niet hoe de procedure het zegt.',
      en: 'First how it really goes, not how the procedure says it should.' },
  ],
  [ // s4 ideas and decisions in a group
    { nl: 'Het derde onderwerp is Ideeën en besluiten in de groep. Hoe krijgen we de schakelkast op tijd?',
      en: 'The third topic is Ideas and decisions in a group. How do we get the switchboard in time?' },
    { nl: 'Eerst veel ideeën, dan kiezen. Dat doen we op een {t:Digitaal whiteboard|digitaal whiteboard}, een gedeeld bord met geeltjes.',
      en: 'First many ideas, then choose. We do that on an {t:Online whiteboard|online whiteboard}, a shared board with sticky notes.' },
    { nl: 'Iedereen begint met {t:Stil schrijven|stil schrijven}, zonder te oordelen. Zo tellen ook stille mensen mee.',
      en: 'Everyone starts with {t:Silent writing|silent writing}, without judging. That way quiet people count too.' },
    { nl: 'Gelijke ideeën gaan bij elkaar. Dat heet {t:Clusteren|clusteren}.',
      en: 'Similar ideas go together. That is {t:Affinity grouping|affinity grouping}.' },
    { nl: 'De groep kiest met stippen. De top drie krijgen een eigenaar en een datum.',
      en: 'The group chooses with dots. The top three get an owner and a date.' },
  ],
  [ // s5 formats on the floor
    { nl: 'Het vierde onderwerp is Werkvormen op de vloer. Rapporten en overleg laten zien wat mensen zeggen. De vloer laat zien wat er gebeurt.',
      en: 'The fourth topic is Formats on the floor. Reports and meetings show what people say. The shop floor shows what happens.' },
    { nl: 'Er zijn er vier. De gembawalk, de interviewronde, de demo en het kaizen-event.',
      en: 'There are four. The gemba walk, the interview round, the demo and the kaizen event.' },
    { nl: 'Jij houdt een {t:Interviewronde|interviewronde}. Losse gesprekken met mensen uit alle lagen.',
      en: 'You hold an {t:Interview round|interview round}. One-to-one conversations with people from every level.' },
    { nl: 'Elk gesprek volgt dezelfde {t:Interviewleidraad|interviewleidraad}, met vijf open vragen.',
      en: 'Every conversation follows the same {t:Interview guide|interview guide}, with five open questions.' },
  ],
  [ // s6 the map
    { nl: 'Dit is de kaart van Projecten. Werkvormen en overleggen ligt tussen Plannen en Uitvoeren.',
      en: 'This is the map of Projects. Formats and meetings lies between Plan and Run.' },
    { nl: 'Werkvormen en overleggen heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Formats and meetings has four topics, each with four levels.' },
    { nl: 'Begin bij Welk overleg wanneer, op niveau Basis.',
      en: 'Start with Which meeting when, at Basics level.' },
    { nl: 'Op Werkkennis houd je een kick-off, teken je een proces, doe je een online ideeënsessie en een interviewronde.',
      en: 'At Working knowledge you hold a kick-off, draw a process, run an online idea session and an interview round.' },
    { nl: 'Op Gevorderd ontwerp je het overlegsysteem en de sessie, kies je wie beslist en welke werkvorm past.',
      en: 'At Advanced you design the meeting system and the session, choose who decides and which format fits.' },
    { nl: 'Op Expert weeg je overleglast en legitimiteit, faciliteer je als vak en laat je een kaizen-event doen.',
      en: 'At Expert you weigh meeting load and legitimacy, facilitate as a craft and commission a kaizen event.' },
    { nl: 'Daarna volgt Uitvoeren, waar het project in beweging blijft.',
      en: 'After that comes Run, where the project keeps moving.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="jij"],[data-cue="planner"],[data-cue="teamlead"])';
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
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
.pm-ink{fill:var(--anatomy-mid);stroke:none}
.pm-note{fill:color-mix(in srgb,var(--fp-accent) 38%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:.5}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-pkg,.pm-bar,.pm-range,.pm-buf,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
[data-cue][data-on] .pm-note{fill:var(--fp-focus);stroke:var(--fp-accent)}
.pm-brown{fill:color-mix(in srgb,#9C7448 62%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:.6}
.pm-grp{fill:none;stroke:var(--anatomy-mid);stroke-width:.8;stroke-dasharray:3 2;stroke-linejoin:round}
.pm-dot{fill:var(--fp-accent);stroke:var(--anatomy-face);stroke-width:.5}
[data-cue][data-on] .pm-brown{stroke:var(--fp-accent);stroke-width:1.2}
[data-cue][data-on] .pm-grp{stroke:var(--fp-accent)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van een grote fabriek, waar lijn 3 naartoe moet: de lijn staat nog in de oude hal. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft waar hij is. Links de stroomkast met de kabel van buiten, nog niet aangesloten, en aan de zijwand een kalender met weken, waarvan de laatste drie de zomerstop zijn. Aan de achterwand de gestippelde plek van de schakelkast. Rechts voor staat een bureau. Het plan ligt er, en de mensen komen samen: jij als adviseur, de sponsor, de teamleider en de planner van de klant. Bij het eerste onderwerp ligt een pagina op het bureau, het voorleesstuk. Bij het tweede hangt een lang bruin vel aan de achterwand waarop geeltjes het proces van links naar rechts vormen. Bij het derde hangt er een gedeeld bord met geeltjes die eerst verspreid zitten, dan in drie groepen en dan stippen krijgen. Bij het vierde ligt een pagina met vijf vragen op het bureau, de interviewleidraad. Rechts een paneel, gemarkeerd als voorbeeld of schema: het plan en de plek van de module tussen plannen en uitvoeren, de vier onderwerpen als tegels; wat elk overleg heeft, het verschil tussen overleg en werksessie, de kick-off en het voorleesstuk; doel en uitkomst, de facilitator en het proces op een brown paper; veel ideeën, stil schrijven, clusteren en kiezen op een digitaal whiteboard; wat mensen zeggen en wat er gebeurt, de vier werkvormen, de lagen van een interviewronde en de leidraad. Aan het eind de kaart van Projecten met Werkvormen en overleggen verlicht, en de vier onderwerpen met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of a large plant, where line 3 has to go: the line still stands in the old hall. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays where it is. At the left the power cabinet with the cable from outside, not connected yet, and on the side wall a calendar of weeks, the last three of which are the summer shutdown. On the back wall the dashed place of the switchboard. At the front right stands a desk. The plan is ready and the people come together: you as the consultant, the sponsor, the team lead and the client’s planner. At the first topic a page lies on the desk, the pre-read. At the second a long brown sheet hangs on the back wall, on which sticky notes form the process from left to right. At the third a shared board hangs there, with sticky notes that first sit scattered, then in three groups and then get dots. At the fourth a page with five questions lies on the desk, the interview guide. At the right a panel, marked as example or diagram: the plan and the place of the module between plan and run, the four topics as tiles; what each meeting has, the difference between a meeting and a workshop, the kick-off and the pre-read; purpose and output, the facilitator and the process on a brown paper; many ideas, silent writing, grouping and choosing on an online whiteboard; what people say and what happens, the four formats, the levels of an interview round and the guide. At the end the map of Projects with Formats and meetings lit, and the four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

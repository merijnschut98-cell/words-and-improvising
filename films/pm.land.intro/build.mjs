// Dev tool, not shipped. Builds the module intro film "Lijn 3 landt / Line 3
// lands" for Landen (pm.land), the fourth module intro film (v17): the
// high-over picture at the top of the module, before its four topics
// (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.land.intro/build.mjs            build the page
//   node films/pm.land.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.land.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.land's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro): ONE concrete project
// travels through the whole module, the map before the detail, no calculations.
// Same hall B and cast as the pilot, field film 1 (films/pm.field.lifecycle,
// whose Land station this intro agrees with: a work instruction with photos of the
// real line and training on the floor, adoption, the handover to the line, the
// skills matrix and the handover checklist) and the other intros. Now line 3 stands
// in hall B and the shutdown is ending, and the STORY IS DRAWN IN THE ROOM:
//   s1 line 3 stands in hall B, the shutdown is ending; the sponsor; the module's
//      four topics as a route on the panel
//   s2 Standaardwerk en training: the operators get a work instruction, a
//      newcomer tries it out, the team lead trains every shift, the night shift
//      too                                           → pm.land.training (skills)
//   s3 Adoptie en overdracht: adoption and what drives it, the old way is gone,
//      the team lead becomes the process owner       → pm.land.change (handover)
//   s4 Borgen: the dip after three months, short regular checks and the monthly
//      look at the trend, a follow-up and a trigger  → pm.land.sustain (tiered)
//   s5 Baten en reflectie: output, outcome, benefit (the rent of the old hall
//      stops, line 3 stays as fast as at the baseline), the benefit owner
//                                                    → pm.land.benefits (hansei)
//   s6 one whole: the standard, the line, the checks, the benefits; line 4 comes
//      later with what line 3 taught
//   s7 the shared Projects map with Land lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.land.training, .change,
// .sustain, .benefits). Each topic scene names two tools of that topic's lessons
// in one short sentence, without explaining them (Merijn's checkpoint, 14 Nov).
// Terms come from the module's lessons and {n:} numbers from the module's text
// (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to
// its map (every topic named in a caption of its own scene, explained in two
// beats and lit), to the narration guard and to the label fit. The index has a
// topic title with a word wider than the default tile ("Standaardwerk"), so the
// film declares tileUnits (as pm.intake.intro).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast, two operators drawn with
// pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs). The things of hall B
// are the pilot's (../pm.plan.intro/hall.mjs, imported, not copied). A panel at
// the right, in stage space, draws each step as a schema, labelled "voorbeeld"
// (the line in use) or "schema" (the module's map).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
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
const MOD = MODULES.find((m) => m.id === 'pm.land');
const LEVELS = {
  standard: ['pm.land.training', 'pm.land.standardwork', 'pm.land.skills', 'pm.land.sdca'],
  handover: ['pm.land.change', 'pm.land.resistance', 'pm.land.communication', 'pm.land.handover'],
  sustain: ['pm.land.sustain', 'pm.land.lsw', 'pm.land.tiered', 'pm.land.audits'],
  benefits: ['pm.land.benefits', 'pm.land.savings', 'pm.land.hansei', 'pm.land.yokoten'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.land has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: the work instruction (one A4 per task, photos of the real equipment, tested by someone who was not involved:
// where he hesitates the instruction is unclear), training just before it is needed and on every shift; the tools
// (the skills matrix, the training timetable)
has('pm.land.training', ['één A4 per taak', 'foto’s van de echte apparatuur', 'Schrijf hem met de mensen die het werk doen', 'laat iemand die er niet bij was hem volgen terwijl jij kijkt', 'Waar hij aarzelt, is de instructie onduidelijk', 'Train vlak voordat mensen het nodig hebben', 'Ploegleiders of ervaren operators zijn de beste trainers', 'ook nacht en weekend, die projecten vaak vergeten', 'Werkinstructie']);
has('pm.land.training', ['one page per task', 'photos of the real equipment', 'let someone who wasn’t involved follow it while you watch', 'Where they hesitate, the instruction is unclear', 'Train just before people need it', 'including nights and weekends, which projects often forget', 'Work instruction'], 'en');
has('pm.land.skills', ['Vaardigheidsmatrix', 'Trainingsrooster']);
has('pm.land.skills', ['Skills matrix', 'Training timetable'], 'en');
// s3: adoption and what drives it (they helped shape it, the direct boss asks, the old way is gone); one process
// owner and the number that shows whether it works; the tools (the communication plan, the handover checklist)
has('pm.land.change', ['Adoptie betekent dat mensen de nieuwe manier echt gebruiken, ook als niemand kijkt', 'ze hebben het mee vormgegeven', 'hun directe baas vraagt ernaar', 'de oude manier is weg']);
has('pm.land.change', ['Adoption means people actually using the new way, also when nobody is watching', 'they helped shape it', 'their direct boss asks about it', 'the old way is gone'], 'en');
has('pm.land.handover', ['Benoem één proceseigenaar per nieuw proces', 'het getal dat laat zien of het werkt', 'Overdrachtschecklist', 'Proceseigenaar', 'De eigenaar heeft dagelijks contact met het werk']);
has('pm.land.handover', ['Name one process owner for each new process', 'the number that shows whether it works', 'Handover checklist', 'Process owner', 'The owner should have daily contact with the work'], 'en');
has('pm.land.communication', ['Communicatieplan']);
has('pm.land.communication', ['Communication plan'], 'en');
// s4: the dip, short regular checks and the owner's monthly look at the trend, the follow-up and the trigger; the
// tools (the layered process audit, the KPI board)
has('pm.land.sustain', ['Reken op de dip na drie maanden', 'gaat de aandacht naar iets anders', 'Korte, regelmatige checks houden het levend', 'Kijk naar de trend, niet naar één week', 'een follow-up', 'een trigger', 'belt de eigenaar ons', 'Gelaagde procesaudit']);
has('pm.land.sustain', ['Expect the three-month dip', 'attention goes elsewhere', 'Short, regular checks keep it alive', 'Look at the trend, not one week', 'a follow-up', 'a trigger', 'the owner calls us', 'Layered process audit'], 'en');
has('pm.land.tiered', ['KPI-bord']);
has('pm.land.tiered', ['KPI board'], 'en');
// s5: output, outcome, benefit; a baseline; the benefit owner is in the line, not the consultant; the tools (the A3
// report, the after-action review). The source of the film's benefit, the rent of the old hall, is the business case
// of pm.intake.intro (and the baseline its goal: as fast as now)
has('pm.land.benefits', ['output, uitkomst, baat', 'Output is wat het project oplevert: een standaard, een bord, een training', 'mensen werken anders', 'meetbare verbetering', 'nulmeting', 'nooit de consultant', 'Jij bent straks weg']);
has('pm.land.benefits', ['output, outcome, benefit', 'Output is what the project delivers: a standard, a board, a training', 'people work differently', 'measurable improvement', 'baseline', 'never the consultant', 'You will be gone'], 'en');
has('pm.land.hansei', ['A3-rapport', 'After-action review']);
has('pm.land.hansei', ['A3 report', 'After-action review'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.land.standardwork', 'Standaardwerk'], ['pm.land.resistance', 'weerstand'], ['pm.land.lsw', 'Leiderstandaardwerk'], ['pm.land.savings', 'Harde en zachte besparingen'],
  ['pm.land.skills', 'vaardigheidsmatrix'], ['pm.land.communication', 'Verandering communiceren'], ['pm.land.tiered', 'Getrapt overleg'], ['pm.land.hansei', 'Reflecteren'],
  ['pm.land.sdca', 'De standaard levend houden'], ['pm.land.handover', 'Overdragen aan de lijn'], ['pm.land.audits', 'Audits'], ['pm.land.yokoten', 'uitrollen naar andere lijnen']]) has(id, [word]);
has('pm.land.standardwork', ['Standardised work'], 'en');
has('pm.land.resistance', ['resistance'], 'en');
has('pm.land.lsw', ['Leader standard work'], 'en');
has('pm.land.savings', ['Hard and soft savings'], 'en');
has('pm.land.skills', ['skills matrix'], 'en');
has('pm.land.communication', ['Communicating change'], 'en');
has('pm.land.tiered', ['Tiered meetings'], 'en');
has('pm.land.hansei', ['Reflecting'], 'en');
has('pm.land.sdca', ['Keeping the standard alive'], 'en');
has('pm.land.handover', ['Handing over to the line'], 'en');
has('pm.land.audits', ['Audits'], 'en');
has('pm.land.yokoten', ['rolling out to other lines'], 'en');
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

// the topic titles: the index has a word wider than the default 128-unit tile ("Standaardwerk", 165 units; "Standardised",
// 143), so, as pm.intake.intro, the film declares tileUnits = the room of its narrowest title box, the closing grid's
// tile (GRID.tile - 12 units of text, up to three lines), and every title box of the stage wraps with D.tileUnits
// (the kit's checkLabels holds the titles to it too, also after a rename without a rebuild)
const TILE_TEXT = GRID.tile - 12;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the grid's tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the grid's tile`);
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

// the people: the sponsor and the team lead of the line are the pm cast; the two operators are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
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
// scene's parts. Each topic scene has two tool chips (tool1, tool2) for the two
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Land is a cue group of its own (map-land).
const tiles = ['tStd', 'tHand', 'tSus', 'tBen'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', ''))
  + cueG('instr', g('instrB', '')) + cueG('shifts', g('shiftsB', ''))
  + cueG('adopt', g('adoptB', '')) + cueG('drivers', g('driversB', '')) + cueG('owner', g('ownerB', ''))
  + cueG('chart', g('chartB', '')) + cueG('checks', g('checksB', '')) + cueG('follow', g('followB', ''))
  + cueG('outp', g('outpB', '')) + cueG('outc', g('outcB', '')) + cueG('bene', g('beneB', '')) + cueG('base', g('baseB', '')) + cueG('bown', g('bownB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Land lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.land'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const LAND_PLACE = pmMap.places.find((p) => p.module === 'pm.land');
const MAPZ = [LAND_PLACE.x + LAND_PLACE.w / 2, LAND_PLACE.y + LAND_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.land')}"`), 'the map lights pm.land as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor and the calendar
  { from: cam(215, 55, 40, 1.2), to: cam(225, 65, 40, 1.28) }, // s2 line 3, the operators and the team lead
  { from: cam(190, 75, 50, 1.15), to: cam(175, 85, 50, 1.2) }, // s3 the operators and the team lead at the line
  { from: cam(160, 80, 60, 1.1), to: cam(145, 90, 60, 1.15) }, // s4 the team lead on the floor
  { from: cam(130, 95, 70, 1.1), to: cam(125, 100, 70, 1.15) }, // s5 the sponsor
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.land.intro',
  title: { nl: 'Lijn 3 landt: de verandering laten beklijven', en: 'Line 3 lands: making the change stick' },
  module: 'pm.land',
  // the room of text in the narrowest title box (the closing grid's tile), see the module section above
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.land, the scene that explains it and its tile
  topics: {
    standard: { scene: 's2', cue: 'tStd' },
    handover: { scene: 's3', cue: 'tHand' },
    sustain: { scene: 's4', cue: 'tSus' },
    benefits: { scene: 's5', cue: 'tBen' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'De zomerstop loopt af. Lijn 3 staat in hal B.', en: 'The summer shutdown is ending. Line 3 stands in hall B.', focus: ['goal', 'line3', 'calendar'] },
        { nl: 'De lijn staat. Nu moet de nieuwe manier van werken blijven.', en: 'The line is in place. Now the new way of working has to last.', focus: ['goal', 'sponsor'] },
        { nl: 'We volgen dit ene project langs de vier onderwerpen van de module.', en: 'We follow this one project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Standaardwerk en training', en: 'Standardised work and training' },
      beats: [
        { nl: 'Eerste onderwerp: Standaardwerk en training. Werkt iedereen op dezelfde manier?', en: 'First topic: Standardised work and training. Does everyone work the same way?', focus: ['tStd', 'line3'] },
        { nl: 'De operators krijgen een {t:Werkinstructie|werkinstructie}: één A4 per taak, met foto’s van de echte lijn.', en: 'The operators get a {t:Work instruction|work instruction}: one A4 page per task, with photos of the real line.', cue: { Werkinstructie: 'instr' }, focus: ['instr', 'crew'] },
        { nl: 'Iemand die er niet bij was, probeert de instructie uit. Waar hij aarzelt, is de instructie onduidelijk.', en: 'Someone who was not involved tries it out. Where they hesitate, the instruction is unclear.', focus: ['instr', 'teamlead', 'crew'] },
        { nl: 'Vlak voor de start traint de teamleider elke ploeg op de vloer, ook de nachtploeg.', en: 'Just before the start the team lead trains every shift on the floor, the night shift too.', focus: ['shifts', 'teamlead', 'crew'] },
        { nl: 'We gebruiken vaak een {t:Vaardigheidsmatrix|vaardigheidsmatrix} en een {t:Trainingsrooster|trainingsrooster}.', en: 'We often use a {t:Skills matrix|skills matrix} and a {t:Training timetable|training timetable}.', cue: { Vaardigheidsmatrix: 'tool1', Trainingsrooster: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Adoptie en overdracht', en: 'Adoption and handover' },
      beats: [
        { nl: 'Tweede onderwerp: Adoptie en overdracht. Wordt het ook echt gebruikt?', en: 'Second topic: Adoption and handover. Is it really used?', focus: ['tHand', 'crew'] },
        { nl: '{t:Adoptie|Adoptie} is dat mensen de nieuwe manier echt gebruiken, ook als niemand kijkt.', en: '{t:Adoption|Adoption} means people really use the new way, even when nobody is watching.', cue: { Adoptie: 'adopt' }, focus: ['adopt', 'crew'] },
        { nl: 'Dat lukt als ze het mee hebben vormgegeven, hun teamleider ernaar vraagt en de oude manier weg is.', en: 'That works when they helped shape it, their team lead asks about it and the old way is gone.', focus: ['drivers', 'teamlead', 'crew'] },
        { nl: 'Dan draagt het project over aan de lijn. De teamleider wordt {t:Proceseigenaar|proceseigenaar}.', en: 'Then the project hands over to the line. The team lead becomes {t:Process owner|process owner}.', cue: { Proceseigenaar: 'owner' }, focus: ['owner', 'teamlead'] },
        { nl: 'We gebruiken vaak een {t:Communicatieplan|communicatieplan} en een {t:Overdrachtschecklist|overdrachtschecklist}.', en: 'We often use a {t:Communication plan|communication plan} and a {t:Handover checklist|handover checklist}.', cue: { Communicatieplan: 'tool1', Overdrachtschecklist: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Borgen', en: 'Sustaining' },
      beats: [
        { nl: 'Derde onderwerp: Borgen. Blijft het zo, ook als het project weg is?', en: 'Third topic: Sustaining. Does it last, even when the project is gone?', focus: ['tSus', 'line3'] },
        { nl: 'Reken op de {t:Dip na drie maanden|dip na drie maanden}. Dan gaat de aandacht naar iets anders.', en: 'Expect the {t:Three-month dip|three-month dip}. Attention goes to something else.', cue: { 'Dip na drie maanden': 'chart' }, focus: ['chart'] },
        { nl: 'Korte, regelmatige checks houden het levend. Elke maand kijkt de eigenaar naar de trend.', en: 'Short, regular checks keep it alive. Every month the owner looks at the trend.', focus: ['checks', 'teamlead', 'chart'] },
        { nl: 'Spreek een {t:Follow-up|follow-up} af en een {t:Trigger|trigger}: zakt het getal te ver, dan belt de eigenaar.', en: 'Agree a {t:Follow-up|follow-up} and a {t:Trigger|trigger}: if the number drops too far, the owner calls.', cue: { 'Follow-up': 'follow', Trigger: 'follow' }, focus: ['follow'] },
        { nl: 'We gebruiken vaak een {t:Gelaagde procesaudit|gelaagde procesaudit} en een {t:KPI-bord|KPI-bord}.', en: 'We often use a {t:Layered process audit|layered process audit} and a {t:KPI board|KPI board}.', cue: { 'Gelaagde procesaudit': 'tool1', 'KPI-bord': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Baten en reflectie', en: 'Benefits and reflection' },
      beats: [
        { nl: 'Vierde onderwerp: Baten en reflectie. Heeft het opgeleverd wat we beloofden?', en: 'Fourth topic: Benefits and reflection. Did it deliver what we promised?', focus: ['tBen', 'sponsor'] },
        { nl: 'Instructie en training zijn de {t:Output|output}. Dat mensen anders werken is de {t:Uitkomst|uitkomst}.', en: 'The instruction and the training are the {t:Output|output}. People working differently is the {t:Outcome|outcome}.', cue: { Output: 'outp', Uitkomst: 'outc' }, focus: ['outp', 'outc'] },
        { nl: 'De {t:Baat|baat} is de meetbare winst: de huur van de oude hal vervalt, en lijn 3 blijft even snel.', en: 'The {t:Benefit|benefit} is the measurable gain: the rent of the old hall stops, and line 3 stays as fast.', cue: { Baat: 'bene' }, focus: ['bene', 'base'] },
        { nl: 'Een {t:Baateigenaar|baateigenaar} in de lijn zorgt dat de baat binnenkomt. De sponsor, niet de consultant.', en: 'A {t:Benefit owner|benefit owner} in the line makes sure the benefit comes in. The sponsor, not the consultant.', cue: { Baateigenaar: 'bown' }, focus: ['bown', 'sponsor'] },
        { nl: 'We gebruiken vaak een {t:A3-rapport|A3-rapport} en een {t:After-action review|after-action review}.', en: 'We often use an {t:A3 report|A3 report} and an {t:After-action review|after-action review}.', cue: { 'A3-rapport': 'tool1', 'After-action review': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen: de standaard, de lijn die hem overneemt, de checks en de baten.', en: 'It all connects: the standard, the line that takes it over, the checks and the benefits.', focus: ['flow', 'teamlead'] },
        { nl: 'Lijn 4 komt later aan de beurt, met wat lijn 3 leerde.', en: 'Line 4 comes later, with what line 3 taught us.', focus: ['decision', 'sponsor', 'line4'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Landen is het zesde station op de weg van een project.', en: 'The map of Projects: Land is the sixth station on the road of a project.', focus: mapCue('pm.land') },
        { nl: 'Landen heeft vier onderwerpen, elk met vier niveaus.', en: 'Land has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Standaardwerk en training, op niveau Basis.', en: 'Start with Standardised work and training, at Basics level.', focus: ['tStd', 'start'] },
        { nl: 'Werkkennis: standaardwerk, werken met weerstand, leiderstandaardwerk, harde en zachte besparingen.', en: 'Working knowledge: standardised work, working with resistance, leader standard work, hard and soft savings.', focus: 'lv2' },
        { nl: 'Gevorderd: vaardigheden, communicatie, getrapt overleg, reflectie.', en: 'Advanced: skills, communication, tiered meetings, reflection.', focus: 'lv3' },
        { nl: 'Expert: de standaard levend houden, overdragen aan de lijn, audits, uitrollen naar andere lijnen.', en: 'Expert: keeping the standard alive, handing over to the line, audits, rolling out to other lines.', focus: 'lv4' },
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
// films/_kit/timeline.mjs) carries what it alone says.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'De zomerstop loopt af, en lijn 3 staat in hal B.',
      en: 'The summer shutdown is ending, and line 3 stands in hall B.' },
    { nl: 'De lijn staat. Nu moet de nieuwe manier van werken blijven.',
      en: 'The line is in place. Now the new way of working has to last.' },
    { nl: 'We volgen dit ene project langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this one project through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 standardised work and training
    { nl: 'Het eerste onderwerp is Standaardwerk en training. Werkt iedereen straks op dezelfde manier?',
      en: 'The first topic is Standardised work and training. Will everyone work the same way?' },
    { nl: 'De operators krijgen een {t:Werkinstructie|werkinstructie}. Eén A4 per taak, met foto’s van de echte lijn.',
      en: 'The operators get a {t:Work instruction|work instruction}. One A4 page per task, with photos of the real line.' },
    { nl: 'Iemand die er niet bij was, probeert de instructie uit terwijl de teamleider kijkt. Waar hij aarzelt, is de instructie onduidelijk.',
      en: 'Someone who was not involved tries the instruction out while the team lead watches. Where they hesitate, the instruction is unclear.' },
    { nl: 'Vlak voor de start traint de teamleider elke ploeg op de vloer. Ook de nachtploeg, want die wordt vaak vergeten.',
      en: 'Just before the start the team lead trains every shift on the floor. The night shift too, because projects often forget it.' },
    { nl: 'Bij standaardwerk en training gebruiken we vaak een vaardigheidsmatrix en een trainingsrooster.',
      en: 'For standardised work and training we often use a skills matrix and a training timetable.' },
  ],
  [ // s3 adoption and handover
    { nl: 'Het tweede onderwerp is Adoptie en overdracht. Wordt het ook echt gebruikt?',
      en: 'The second topic is Adoption and handover. Is it really used?' },
    { nl: 'Dat heet {t:Adoptie|adoptie}. Mensen gebruiken de nieuwe manier echt, ook als niemand kijkt.',
      en: 'That is called {t:Adoption|adoption}. People really use the new way, even when nobody is watching.' },
    { nl: 'Dat lukt als ze het mee hebben vormgegeven, hun teamleider ernaar vraagt en de oude manier weg is.',
      en: 'That works when they helped shape it, their team lead asks about it and the old way is gone.' },
    { nl: 'Dan draagt het project over aan de lijn. De teamleider wordt de {t:Proceseigenaar|proceseigenaar}, één naam voor het proces en voor het getal dat laat zien of het werkt.',
      en: 'Then the project hands over to the line. The team lead becomes the {t:Process owner|process owner}, one name for the process and for the number that shows whether it works.' },
    { nl: 'Bij adoptie en overdracht gebruiken we vaak een communicatieplan en een overdrachtschecklist.',
      en: 'For adoption and handover we often use a communication plan and a handover checklist.' },
  ],
  [ // s4 sustaining
    { nl: 'Het derde onderwerp is Borgen. Blijft het zo, ook als het project weg is?',
      en: 'The third topic is Sustaining. Does it last, even when the project is gone?' },
    { nl: 'Reken op de {t:Dip na drie maanden|dip na drie maanden}. Als het project weg is, gaat de aandacht naar iets anders.',
      en: 'Expect the {t:Three-month dip|three-month dip}. Once the project is gone, attention goes to something else.' },
    { nl: 'Korte, regelmatige checks houden het levend. Elke maand kijkt de eigenaar met het team naar de trend, niet naar één week.',
      en: 'Short, regular checks keep it alive. Every month the owner looks at the trend with the team, not at one week.' },
    { nl: 'Spreek vooraf een {t:Follow-up|follow-up} af en een {t:Trigger|trigger}. Zakt het getal te ver, dan belt de eigenaar ons.',
      en: 'Agree a {t:Follow-up|follow-up} and a {t:Trigger|trigger} in advance. If the number drops too far, the owner calls us.' },
    { nl: 'Bij het borgen gebruiken we vaak een gelaagde procesaudit en een KPI-bord.',
      en: 'For sustaining we often use a layered process audit and a KPI board.' },
  ],
  [ // s5 benefits and reflection
    { nl: 'Het vierde onderwerp is Baten en reflectie. Heeft het opgeleverd wat we beloofden?',
      en: 'The fourth topic is Benefits and reflection. Did it deliver what we promised?' },
    { nl: 'De instructie en de training zijn de {t:Output|output}. Dat mensen anders werken is de {t:Uitkomst|uitkomst}.',
      en: 'The instruction and the training are the {t:Output|output}. People working differently is the {t:Outcome|outcome}.' },
    { nl: 'De {t:Baat|baat} is de meetbare winst. De huur van de oude hal vervalt, en lijn 3 blijft even snel als bij de nulmeting.',
      en: 'The {t:Benefit|benefit} is the measurable gain. The rent of the old hall stops, and line 3 stays as fast as at the baseline.' },
    { nl: 'Een {t:Baateigenaar|baateigenaar} in de lijn zorgt dat de baat binnenkomt. Dat is de sponsor, niet de consultant, want die is straks weg.',
      en: 'A {t:Benefit owner|benefit owner} in the line makes sure the benefit comes in. That is the sponsor, not the consultant, because the consultant will be gone.' },
    { nl: 'Bij baten en reflectie gebruiken we vaak een A3-rapport en een after-action review.',
      en: 'For benefits and reflection we often use an A3 report and an after-action review.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Eerst de standaard, dan de lijn die hem overneemt, dan de checks die hem vasthouden. De baten laten zien of het de moeite was.',
      en: 'It all connects. First the standard, then the line that takes it over, then the checks that hold it. The benefits show whether it was worth it.' },
    { nl: 'Lijn 4 komt later aan de beurt, en dan nemen we mee wat lijn 3 ons leerde.',
      en: 'Line 4 comes later, and then we take along what line 3 taught us.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Landen is het zesde station op de weg van een project.',
      en: 'This is the map of Projects. Land is the sixth station on the road of a project.' },
    { nl: 'Landen heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Land has four topics, each with four levels.' },
    { nl: 'Begin bij Standaardwerk en training, op niveau Basis.',
      en: 'Start with Standardised work and training, at Basics level.' },
    { nl: 'Op Werkkennis leer je standaardwerk en werken met weerstand. Dan volgen leiderstandaardwerk en harde en zachte besparingen.',
      en: 'At Working knowledge you learn standardised work and working with resistance. Then come leader standard work and hard and soft savings.' },
    { nl: 'Op Gevorderd gaat het over vaardigheden en communicatie. Dan volgen getrapt overleg en reflectie.',
      en: 'At Advanced it is about skills and communication. Then come tiered meetings and reflection.' },
    { nl: 'Op Expert houd je de standaard levend en draag je over aan de lijn. Dan volgen audits en uitrollen naar andere lijnen.',
      en: 'At Expert you keep the standard alive and hand over to the line. Then come audits and rolling out to other lines.' },
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
  nl: 'Hal B van de fabriek, waar lijn 3 nu staat, zoals aan het eind van de intro van Uitvoeren. Op de vloer lijn 3 op zijn plek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand hangt de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp komen er mensen bij: twee operators, de teamleider van de lijn en de sponsor. Rechts een paneel, gemarkeerd als voorbeeld of schema: de stand van lijn 3 en de vier onderwerpen van de module als tegels; een werkinstructie van één pagina met foto’s bij drie stappen, waarbij de operator bij één stap aarzelt, en drie ploegen die getraind worden; wat adoptie drijft, en de proceseigenaar die de snelheid van de lijn bewaakt; de uitkomsten na het project met een dip na drie maanden, korte checks die de lijn omhoog houden en een follow-up met een trigger; de keten output, uitkomst en baat met een nulmeting en de baateigenaar; en per onderwerp twee namen van hulpmiddelen. Aan het eind de kaart van Projecten met Landen verlicht, en de vier onderwerpen met hun vier niveaus.',
  en: 'Hall B of the plant, where line 3 stands now, as at the end of the intro of Run. On the floor line 3 in its place; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard hangs, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: two operators, the team lead of the line and the sponsor. At the right a panel, marked as an example or a diagram: the state of line 3 and the module’s four topics as tiles; a one-page work instruction with photos on three steps, where the operator hesitates at one, and three shifts being trained; what drives adoption, and the process owner who watches the line’s speed; the results after the project with a dip at three months, short checks that keep the line up and a follow-up with a trigger; the chain output, outcome and benefit with a baseline and the benefit owner; and per topic two names of tools. At the end the map of Projects with Land lit, and the four topics with their four levels.',
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

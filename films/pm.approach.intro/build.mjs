// Dev tool, not shipped. Builds the module intro film "Jij begint bij de klant / You start at the client"
// for Aanpak en gereedschap (pm.approach), the first station of the field "Een project van begin tot eind"
// and a module intro film (v17): the high-over picture at the top of the module, before its four topics
// (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.approach.intro/build.mjs            build the page
//   node films/pm.approach.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.approach.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.approach's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved intros (films/pm.plan.intro, pm.intake.intro, pm.run.intro, pm.land.intro and
// pm.close.intro): ONE concrete project travels through the module, the map before the detail, no calculations,
// each topic names ONE tool of its own lessons without explaining it (the Checkpoint of 14 Nov, and Merijn's rule
// of 15 Nov: one real tool per topic, a term the Basis or Werkkennis lessons teach, no brand, no click path).
// The story is the shared project world of the field film (films/pm.field.lifecycle): line 3 moves to hall B in the
// summer shutdown. This module is the station BEFORE the intake: the consultant ("jij") starts on day one at a
// large client, the sponsor's request is "move line 3", and before any intake the consultant chooses how to run
// the project. So the film agrees with the field film's first scene (hall B, the sponsor, the request) and ends
// where the field film's Intake station begins. The STORY IS DRAWN IN THE ROOM: hall B with the new floor and
// the dashed outline of line 3 (the line still stands in the old hall), line 4 next to it, the power cabinet, the
// dashed place of the switchboard and the calendar of the shutdown; a whiteboard on the back wall becomes the
// team's task board, and a desk with a laptop is where the planner sits in the client's systems. The cast changes
// per topic (the sponsor, the team lead, the planner), and "jij" stands in the room throughout.
//   s1 first day: the sponsor's request, the module sits between the request and the intake, the four topics
//      in two groups (how you work: route and approach; what you work with: tools and the client's systems)
//   s2 De route: five stages, one stage product each, the mandate from the sponsor; tool: status check
//                                                         → pm.approach.route (Basis), .takeover (Werkkennis)
//   s3 Een aanpak kiezen: the four method families and a mix, the move is predictive, a recurring problem
//      with data goes to Six Sigma; tool: DMAIC         → pm.approach.families (Basis), .dmaic (Werkkennis)
//   s4 Gereedschap kiezen: a tool pays off when it yields more than it costs, tool families, the team's tasks
//      go on a task board on the whiteboard; tool: takenbord → pm.approach.toolfamilies (Basis), .board (Werkkennis)
//   s5 Gereedschap bij grote organisaties: a large client has many systems with one task each, a system of
//      record, the planner gives you the project code; tool: ERP → pm.approach.systems (Basis), .guest (Werkkennis)
//   s6 the shared Projects map with Aanpak en gereedschap lit, then the module's four topics with their
//      levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.approach.route, .families, .toolfamilies, .systems). The tools
// are terms of those lessons (checked below, nl and en). A Werkkennis tool a scene names does not come back in
// the closing grid: the grid names what each level adds in other words. Terms come from the module's lessons
// (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a
// caption of its own scene, explained in two beats and lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor, the team lead, the planner
// and "jij" from its cast. The things of hall B are the pilot's (../pm.plan.intro/hall.mjs, imported, not
// copied). A panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld" (the line's
// move) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.approach');
const LEVELS = {
  route: ['pm.approach.route', 'pm.approach.takeover', 'pm.approach.tailor', 'pm.approach.clientroute'],
  method: ['pm.approach.families', 'pm.approach.dmaic', 'pm.approach.choose', 'pm.approach.translate'],
  tools: ['pm.approach.toolfamilies', 'pm.approach.board', 'pm.approach.toolchoice', 'pm.approach.toolcost'],
  enterprise: ['pm.approach.systems', 'pm.approach.guest', 'pm.approach.recordof', 'pm.approach.landscape'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.approach has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: five stages, one stage product each, the mandate from the sponsor, the status check of a running project
has('pm.approach.route', ['vijf fasen', 'Intake', 'Plannen', 'Uitvoeren', 'Landen', 'Afsluiten', 'faseproduct', 'Een project begint met een mandaat', 'de opdracht en de bevoegdheid om te mogen starten', 'Sponsor']);
has('pm.approach.route', ['five stages', 'Intake', 'Plan', 'Run', 'Land', 'Close', 'stage product', 'A project begins with a mandate', 'the assignment and the authority to start', 'Sponsor'], 'en');
has('pm.approach.takeover', ['Statuscheck', 'een eerste meting van waar het project echt staat']);
has('pm.approach.takeover', ['Status check', 'a first measurement of where the project really stands'], 'en');
// s3: the four families and a mix, the predictive family (the move), Six Sigma and its DMAIC steps
has('pm.approach.families', ['en een mengvorm', 'Voorspellend (predictive): eerst plannen, dan uitvoeren', 'Agile', 'Lean-verbeteren', 'Six Sigma: verbeteren met data, in vaste stappen die DMAIC heten', 'Methodefamilie']);
has('pm.approach.families', ['There are four, plus a blend', 'Predictive: plan first, then execute', 'Agile', 'Lean improvement', 'Six Sigma: improving with data, in fixed steps called DMAIC', 'Method family'], 'en');
has('pm.approach.dmaic', ['DMAIC is een vaste route voor een terugkerend probleem waar je data over kunt krijgen']);
has('pm.approach.dmaic', ['DMAIC is a fixed route for a recurring problem you can get data about'], 'en');
// s4: a tool pays off when it yields more than it costs, the tool families, the task board
has('pm.approach.toolfamilies', ['Een tool is het waard als hij meer oplevert dan hij kost', 'Een spreadsheet is genoeg zolang je een lijst bijhoudt', 'Denk in toolfamilies', 'Planningstool', 'Takenbord', 'Toolfamilie']);
has('pm.approach.toolfamilies', ['A tool is worth it when it delivers more than it costs', 'A spreadsheet is enough as long as you keep a list', 'Think in terms of a tool family', 'Scheduling tool', 'Task board', 'Tool family'], 'en');
has('pm.approach.board', ['Een bord in de stijl van Planner heeft kaarten', 'Een kaart is één stuk werk']);
has('pm.approach.board', ['A board in the style of Planner has cards', 'A card is one piece of work'], 'en');
// s5: a large client has many systems with one task each, the system of record, the project code, the ERP
has('pm.approach.systems', ['Een grote klant heeft veel systemen, en elk heeft één taak', 'ERP (enterprise resource planning): geld, uren en materiaal, per projectnummer', 'PPM', 'PLM', 'Een systeem van vastlegging (system of record) is het systeem waarin een officieel feit staat', 'Het projectnummer of de WBS-code']);
has('pm.approach.systems', ['A large client has many systems, and each has one job', 'ERP (enterprise resource planning): money, hours and materials, per project number', 'PPM', 'PLM', 'A system of record is the system in which an official fact sits', 'The project code or WBS code'], 'en');
has('pm.approach.guest', ['Geboekte uren', 'Wijzigingskalender']);
has('pm.approach.guest', ['Booked hours', 'Change calendar'], 'en');
// s6: what each later level adds is the title of its lessons, in the app's words
const TITLES = { 'pm.approach.takeover': 'Een lopend project overnemen', 'pm.approach.dmaic': 'DMAIC op een klein probleem', 'pm.approach.board': 'Een takenbord inrichten in het eerste uur', 'pm.approach.guest': 'Als gast in de systemen van de klant',
  'pm.approach.tailor': 'Hoeveel route: op maat maken', 'pm.approach.choose': 'De methode kiezen voor dit project', 'pm.approach.toolchoice': 'De tool kiezen voor dit project', 'pm.approach.recordof': 'Wat leeft waar: werktool en systeem van vastlegging',
  'pm.approach.clientroute': 'De route van de klant: gates, PMO en niet beginnen', 'pm.approach.translate': 'Werken in de methode van de klant', 'pm.approach.toolcost': 'Wat een tool echt kost', 'pm.approach.landscape': 'Het toollandschap als senior' };
for (const [id, title] of Object.entries(TITLES)) assert(lessons.nl.get(id).title === title, `${id} is no longer called "${title}"`);
// the tools of each topic are terms of its own lessons (the Checkpoint of 14 Nov), nl and en
const TOOLS = [['pm.approach.takeover', 'Statuscheck', 'Status check'], ['pm.approach.families', 'DMAIC', 'DMAIC'], ['pm.approach.toolfamilies', 'Takenbord', 'Task board'], ['pm.approach.systems', 'ERP', 'ERP']];
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
// itself is not drawn: on day one it still stands in the old hall. The whiteboard hangs on the back wall between
// the cabinet and the switchboard's place; the desk with the laptop stands in front at the right.
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

// the whiteboard on the back wall and the team's tasks on it: three columns of cards (the first column is
// short, the last is tall), drawn in the face plane of the board (local u = x, v = -z); shown in s4 when the
// narration puts the tasks on a task board
const BOARD = w.board({ x0: 66, x1: 200, z0: 124, z1: 200 });
// sticky notes: near-square cards with a line of "writing" at the top, a thin header bar over each column
const CARDS = [3, 3, 2].map((n, c) => {
  const x = 71.5 + c * 43;
  let out = `<path class="pm-ink" d="${w.rectD(x, -197.5, x + 36, -195.8)}"/>`;
  for (let i = 0; i < n; i++) {
    const top = 193 - i * 23;
    out += `<path class="pm-note" d="${w.rectD(x, -top, x + 36, -(top - 20))}"/>`
      + `<path class="pm-ink" d="${w.rectD(x + 4, -(top - 5), x + 26, -(top - 6.6))}"/><path class="pm-ink" d="${w.rectD(x + 4, -(top - 10), x + 18, -(top - 11.6))}"/>`;
  }
  return out;
}).join('');
const cardsOnBoard = `<g transform="${w.planeY(2.8)}">${CARDS}</g>`;
// the desk of the client's planner: a table with a laptop on it
const DESK = w.table({ x: 196, y: 98, w: 66, d: 32, h: 74 }) + w.laptop({ x: 229, y: 114, z: 74, toward: -1 });

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
  cueG('board', BOARD.svg + g('cardsG', cardsOnBoard)),
  g('pp-planner', person('planner', 229, 82, 'x')),
  cueG('desk', DESK),
  g('pp-sponsor', person('sponsor', 46, 140, 'y')),
  g('pp-lead', person('teamlead', 134, 76, 'x')),
  g('pp-jij', person('jij', 112, 142, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has one tool chip (tool1) for the name of its sentence.
// The shared Projects map (the kit's mapScene) sits under the panel; its place
// Aanpak en gereedschap is a cue group of its own (map-approach).
const tiles = ['tRoute', 'tMethod', 'tTools', 'tSys'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('req', g('reqB', '')) + cueG('path', g('pathB', ''))
  + cueG('stages', g('stagesB', '')) + cueG('products', g('productsB', '')) + cueG('mandate', g('mandateB', ''))
  + cueG('ask', g('askB', '')) + cueG('fams', g('famsB', '')) + cueG('predict', g('predB', '')) + cueG('sigma', g('sigB', ''))
  + cueG('worth', g('worthB', '')) + cueG('tfams', g('tfamsB', ''))
  + cueG('sys', g('sysB', '')) + cueG('record', g('recordB', '')) + cueG('proj', g('projB', ''))
  + cueG('tool1', g('tool1B', '')));
// the shared map, Aanpak en gereedschap lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.approach'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const APPROACH_PLACE = pmMap.places.find((p) => p.module === 'pm.approach');
const MAPZ = [APPROACH_PLACE.x + APPROACH_PLACE.w / 2, APPROACH_PLACE.y + APPROACH_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.approach')}"`), 'the map lights pm.approach as a cue group');


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
  { from: cam(100, 100, 70, 1.12), to: cam(108, 100, 70, 1.18) }, // s2 the sponsor and you on the floor
  { from: cam(115, 95, 70, 1.1), to: cam(130, 95, 70, 1.05) }, // s3 the sponsor and you, line 3's floor behind
  { from: cam(130, 30, 120, 1.2), to: cam(135, 35, 120, 1.25) }, // s4 the whiteboard and the team lead
  { from: cam(185, 100, 60, 1.12), to: cam(195, 98, 62, 1.2) }, // s5 the desk with the laptop and the planner
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(6).fill(30);
const spec = {
  id: 'pm.approach.intro',
  title: { nl: 'Jij begint bij de klant: aanpak en gereedschap', en: 'You start at the client: approach and tools' },
  module: 'pm.approach',
  // the narrowest box that draws a topic title: the closing grid's tile (GRID.tile 190 less its padding); the route's
  // rows are wider. The film declares the width it draws, the kit holds the titles to it (checkLabels)
  tileUnits: GRID.tile - 12,
  // the map: per topic of pm.approach, the scene that explains it and its tile
  topics: {
    route: { scene: 's2', cue: 'tRoute' },
    method: { scene: 's3', cue: 'tMethod' },
    tools: { scene: 's4', cue: 'tTools' },
    enterprise: { scene: 's5', cue: 'tSys' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eerste dag', en: 'First day' },
      beats: [
        { nl: 'Jij begint als adviseur bij een grote fabriek. De sponsor vraagt: verhuis lijn 3.', en: 'You start as a consultant at a large plant. The sponsor asks: move line 3.', focus: ['req', 'jij', 'sponsor', 'floor', 'calendar'] },
        { nl: 'Voordat de intake begint, kies je hoe je het project aanpakt.', en: 'Before the intake begins, you choose how to run the project.', focus: ['path', 'jij'] },
        { nl: 'Vier onderwerpen: twee over hoe je werkt, twee over waarmee.', en: 'Four topics: two about how you work, two about what you work with.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'De route', en: 'The route' },
      beats: [
        { nl: 'Eerste onderwerp: De route: wat eerst, wat daarna.', en: 'First topic: The route: what first, what next.', focus: ['tRoute', 'jij', 'sponsor'] },
        { nl: 'Een project loopt over vijf {t:Fase|fasen}, van intake tot afsluiten.', en: 'A project runs over five {t:Stage|stages}, from intake to close.', cue: { Fase: 'stages' }, focus: ['stages'] },
        { nl: 'Elke fase laat één {t:Faseproduct|faseproduct} achter dat de volgende nodig heeft.', en: 'Each stage leaves one {t:Stage product|stage product} that the next one needs.', cue: { Faseproduct: 'products' }, focus: ['products'] },
        { nl: 'Het begint met een {t:Mandaat|mandaat}: de bevoegdheid om te starten.', en: 'It starts with a {t:Mandate|mandate}: the authority to start.', cue: { Mandaat: 'mandate' }, focus: ['mandate', 'sponsor'] },
        { nl: 'Neem je een lopend project over, dan doe je eerst een {t:Statuscheck|statuscheck}.', en: 'If you take over a running project, you first do a {t:Status check|status check}.', cue: { Statuscheck: 'tool1' }, focus: ['tool1', 'jij'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Een aanpak kiezen', en: 'Choosing an approach' },
      beats: [
        { nl: 'Tweede onderwerp: Een aanpak kiezen. Welke manier van werken past?', en: 'Second topic: Choosing an approach. Which way of working fits?', focus: ['tMethod', 'ask', 'sponsor'] },
        { nl: 'Er zijn vier {t:Methodefamilie|methodefamilies} en een mengvorm.', en: 'There are four {t:Method family|method families} and a mix.', cue: { Methodefamilie: 'fams' }, focus: ['fams'] },
        { nl: 'De verhuizing is voorspellend: eerst plannen, dan uitvoeren.', en: 'The move is predictive: plan first, then run.', focus: ['predict', 'floor', 'calendar'] },
        { nl: 'Een terugkerend probleem met data pak je aan met {t:DMAIC|DMAIC}, de stappen van Six Sigma.', en: 'A recurring problem with data you tackle with {t:DMAIC|DMAIC}, the steps of Six Sigma.', cue: { DMAIC: 'tool1' }, focus: ['sigma', 'tool1'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Gereedschap kiezen', en: 'Choosing tools' },
      beats: [
        { nl: 'Derde onderwerp: Gereedschap kiezen. Welk gereedschap, en wanneer?', en: 'Third topic: Choosing tools. Which tool, and when?', focus: ['tTools', 'jij', 'teamlead'] },
        { nl: 'Gereedschap loont als het meer oplevert dan het kost.', en: 'A tool pays off when it yields more than it costs.', focus: ['worth'] },
        { nl: 'Denk in {t:Toolfamilie|toolfamilies}: een soort gereedschap per soort werk.', en: 'Think in {t:Tool family|tool families}: one kind of tool for each kind of work.', cue: { Toolfamilie: 'tfams' }, focus: ['tfams'] },
        { nl: 'De taken van de verhuizing zetten we op een {t:Takenbord|takenbord}.', en: 'We put the tasks of the move on a {t:Task board|task board}.', cue: { Takenbord: 'board' }, focus: ['board', 'tool1', 'teamlead'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Gereedschap bij grote organisaties', en: 'Tools at large organisations' },
      beats: [
        { nl: 'Vierde onderwerp: Gereedschap bij grote organisaties. De klant heeft veel systemen.', en: 'Fourth topic: Tools at large organisations. The client has many systems.', focus: ['tSys', 'sys', 'desk'] },
        { nl: 'Elk systeem heeft één taak: uren en geld, projecten, tekeningen.', en: 'Each system has one task: hours and money, projects, drawings.', focus: ['sys', 'planner'] },
        { nl: 'Een {t:Systeem van vastlegging|systeem van vastlegging} is waar een feit officieel staat.', en: 'A {t:System of record|system of record} is where a fact is officially kept.', cue: { 'Systeem van vastlegging': 'record' }, focus: ['record', 'sys'] },
        { nl: 'De planner geeft je het {t:Projectnummer|projectnummer}. Daaronder boek je uren in het {t:ERP|ERP}.', en: 'The planner gives you the {t:Project code|project code}. Under it you book hours in the {t:ERP|ERP}.', cue: { Projectnummer: 'proj', ERP: 'tool1' }, focus: ['proj', 'tool1', 'planner', 'jij'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Dit is de kaart van Projecten. Aanpak en gereedschap is het eerste station op de weg van een project.', en: 'This is the map of Projects. Approach and tools is the first station on the road of a project.', focus: mapCue('pm.approach') },
        { nl: 'Aanpak en gereedschap heeft vier onderwerpen, elk met vier niveaus.', en: 'Approach and tools has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij De route, op niveau Basis.', en: 'Start with The route, at Basics level.', focus: ['tRoute', 'start'] },
        { nl: 'Op Werkkennis neem je een project over, pas je een methode toe, zet je gereedschap op en werk je als gast.', en: 'At Working knowledge you take over a project, apply a method, set up your tools and work as a guest.', focus: 'lv2' },
        { nl: 'Op Gevorderd maak je de route op maat, kies je methode en gereedschap en bepaal je wat waar leeft.', en: 'At Advanced you tailor the route, choose method and tools and decide what lives where.', focus: 'lv3' },
        { nl: 'Op Expert werk je in de route van de klant, weeg je wat gereedschap kost en overzie je het landschap.', en: 'At Expert you work in the client’s route, weigh what tools cost and oversee the landscape.', focus: 'lv4' },
        { nl: 'Daarna volgt de intake, het tweede station.', en: 'After that comes the intake, the second station.', focus: null },
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
// lowercase after "de", never as the first word of a sentence), agile through the
// rule for the ways of working, sponsor, statuscheck, faseproduct, mandaat, takenbord, 
// systeem van vastlegging, projectnummer and ERP as they are. This film's own SAY group (the last of
// the Dutch list) carries only DMAIC as letters and Lean and Six Sigma as a Dutch coach says them, in its own phrases.
// The s6 narration says what its captions say, with the app's level words.
const SAY = [
  [ // s1 first day
    { nl: 'Een grote fabriek bouwt een nieuwe hal. Lijn 3 moet erheen, in de zomerstop. Jij begint als adviseur en de sponsor vraagt, verhuis lijn 3.',
      en: 'A large plant is building a new hall. Line 3 has to move there, during the summer shutdown. You start as a consultant and the sponsor asks, move line 3.' },
    { nl: 'Voordat de intake begint, kies je hoe je het project aanpakt.',
      en: 'Before the intake begins, you choose how to run the project.' },
    { nl: 'We volgen dit verzoek langs vier onderwerpen. Twee gaan over hoe je werkt, en twee over waarmee je werkt.',
      en: 'We follow this request through four topics. Two are about how you work, and two about what you work with.' },
  ],
  [ // s2 the route
    { nl: 'Het eerste onderwerp is De route, wat eerst en wat daarna. Hoe loopt een project van begin tot eind?',
      en: 'The first topic is The route, what first and what next. How does a project run from start to finish?' },
    { nl: 'Een project loopt over vijf {t:Fase|fasen}, van intake tot afsluiten.',
      en: 'A project runs over five {t:Stage|stages}, from intake to close.' },
    { nl: 'Elke fase laat één {t:Faseproduct|faseproduct} achter, dat de volgende nodig heeft. Zoals een opdracht, een plan of een besluit.',
      en: 'Each stage leaves one {t:Stage product|stage product} that the next one needs. Like an assignment, a plan or a decision.' },
    { nl: 'Het begint met een {t:Mandaat|mandaat}. Dat is de bevoegdheid om te starten, van de sponsor.',
      en: 'It starts with a {t:Mandate|mandate}. That is the authority to start, from the sponsor.' },
    { nl: 'Neem je een lopend project over, dan doe je eerst een {t:Statuscheck|statuscheck}.',
      en: 'If you take over a running project, you first do a {t:Status check|status check}.' },
  ],
  [ // s3 choosing an approach
    { nl: 'Het tweede onderwerp is Een aanpak kiezen. Welke manier van werken past bij dit project?',
      en: 'The second topic is Choosing an approach. Which way of working fits this project?' },
    { nl: 'Er zijn vier {t:Methodefamilie|methodefamilies} en een mengvorm. Voorspellend, agile, Lean en Six Sigma.',
      en: 'There are four {t:Method family|method families} and a mix. Predictive, agile, Lean and Six Sigma.' },
    { nl: 'De verhuizing is voorspellend. Eerst plannen, dan uitvoeren.',
      en: 'The move is predictive. Plan first, then run.' },
    { nl: 'Een terugkerend probleem met data pak je aan met {t:DMAIC|DMAIC}, de stappen van Six Sigma.',
      en: 'A recurring problem with data you tackle with {t:DMAIC|DMAIC}, the steps of Six Sigma.' },
  ],
  [ // s4 choosing tools
    { nl: 'Het derde onderwerp is Gereedschap kiezen. Welk gereedschap kies je, en wanneer loont dat?',
      en: 'The third topic is Choosing tools. Which tool do you pick, and when does it pay off?' },
    { nl: 'Gereedschap loont als het meer oplevert dan het kost.',
      en: 'A tool pays off when it yields more than it costs.' },
    { nl: 'Denk in {t:Toolfamilie|toolfamilies}, een soort gereedschap per soort werk. Een voor lijsten, een voor planningen.',
      en: 'Think in {t:Tool family|tool families}, one kind of tool for each kind of work. One for lists, one for schedules.' },
    { nl: 'De taken van de verhuizing zetten we op een {t:Takenbord|takenbord}.',
      en: 'We put the tasks of the move on a {t:Task board|task board}.' },
  ],
  [ // s5 tools at large organisations
    { nl: 'Het vierde onderwerp is Gereedschap bij grote organisaties. De klant is groot en heeft veel systemen.',
      en: 'The fourth topic is Tools at large organisations. The client is large and has many systems.' },
    { nl: 'Elk systeem heeft één taak, zoals uren en geld, projecten of tekeningen.',
      en: 'Each system has one task, such as hours and money, projects or drawings.' },
    { nl: 'Een {t:Systeem van vastlegging|systeem van vastlegging} is het systeem waar een feit officieel staat.',
      en: 'A {t:System of record|system of record} is the system where a fact is officially kept.' },
    { nl: 'De planner geeft je het {t:Projectnummer|projectnummer}. Daaronder boek je uren in het {t:ERP|ERP}.',
      en: 'The planner gives you the {t:Project code|project code}. Under it you book hours in the {t:ERP|ERP}.' },
  ],
  [ // s6 the map
    { nl: 'Dit is de kaart van Projecten. Aanpak en gereedschap is het eerste station op de weg van een project.',
      en: 'This is the map of Projects. Approach and tools is the first station on the road of a project.' },
    { nl: 'Aanpak en gereedschap heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Approach and tools has four topics, each with four levels.' },
    { nl: 'Begin bij De route, op niveau Basis.',
      en: 'Start with The route, at Basics level.' },
    { nl: 'Op Werkkennis neem je een project over, pas je een methode toe, zet je gereedschap op en werk je als gast.',
      en: 'At Working knowledge you take over a project, apply a method, set up your tools and work as a guest.' },
    { nl: 'Op Gevorderd maak je de route op maat, kies je methode en gereedschap en bepaal je wat waar leeft.',
      en: 'At Advanced you tailor the route, choose method and tools and decide what lives where.' },
    { nl: 'Op Expert werk je in de route van de klant, weeg je wat gereedschap kost en overzie je het landschap.',
      en: 'At Expert you work in the client’s route, weigh what tools cost and oversee the landscape.' },
    { nl: 'Daarna volgt de intake, het tweede station.',
      en: 'After that comes the intake, the second station.' },
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
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van een grote fabriek, waar lijn 3 naartoe moet: de lijn staat nog in de oude hal. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft waar hij is. Links de stroomkast met de kabel van buiten, nog niet aangesloten, aan de achterwand een whiteboard en de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender met weken, waarvan de laatste drie de zomerstop zijn. Op het whiteboard komen later de taken van de verhuizing als kaarten in kolommen. Rechts voor staat een bureau met een laptop. Per onderwerp komen er mensen bij: jij als adviseur, de sponsor, de teamleider en de planner van de klant. Rechts een paneel, gemarkeerd als voorbeeld of schema: het verzoek van de sponsor, de plek van de module tussen het verzoek en de intake en de vier onderwerpen van de module als tegels in twee groepen; de vijf fasen met hun faseproduct, het mandaat en een statuscheck; de vier methodefamilies en een mengvorm, de verhuizing als voorspellend en DMAIC voor een terugkerend probleem; een tool die meer oplevert dan hij kost, de toolfamilies en het takenbord; de systemen van een grote klant met elk één taak, het systeem van vastlegging, het projectnummer en het ERP; de vier keuzes samen en de weg naar de intake. Aan het eind de kaart van Projecten met Aanpak en gereedschap verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of a large plant, where line 3 has to go: the line still stands in the old hall. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays where it is. At the left the power cabinet with the cable from outside, not connected yet, on the back wall a whiteboard and the place of the switchboard as a dashed outline, and on the side wall a calendar of weeks, the last three of which are the summer shutdown. Later the tasks of the move appear on the whiteboard as cards in columns. At the front right stands a desk with a laptop. Each topic brings people: you as the consultant, the sponsor, the team lead and the client’s planner. At the right a panel, marked as an example or a diagram: the sponsor’s request, the place of the module between the request and the intake and the module’s four topics as tiles in two groups; the five stages with their stage product, the mandate and a status check; the four method families and a mix, the move as predictive and DMAIC for a recurring problem; a tool that yields more than it costs, the tool families and the task board; the systems of a large client with one task each, the system of record, the project code and the ERP; the four choices together and the road to the intake. At the end the map of Projects with Approach and tools lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

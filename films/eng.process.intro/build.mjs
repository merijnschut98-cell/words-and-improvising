// Dev tool, not shipped. Builds the module intro film "Van ketel naar tank / From kettle to tank" for
// Procestechniek: de basis (eng.process), an Engineering module intro film (v17, Task 13): the high-over picture
// at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need
// the most"). Pattern and rules: films/eng.machining.intro (the approved reference), eng.joining.intro and
// eng.moulding.intro, and the notes section "Engineering module intros".
//
//   node films/eng.process.intro/build.mjs            build the page
//   node films/eng.process.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.process.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (eng.process's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The story: the product in the tank of line 3 (the field film films/eng.field.making: a tank behind the filling
// unit with a pipe into the back of the plate; its station Procestechniek says what is in the tank comes from a
// process plant, that you use a process flow diagram and a mass balance, and that without this nobody knows what
// flows or where product is lost) is made in the plant, at person scale. The product flows from the right to the
// left along one wall: a batch kettle, a pump, a heat exchanger, the tank, and a pipe through the wall towards
// hall B. Every topic of the module has its place in that one flow:
//   s1 the plant and what a process plant is (unit operations, as the first lesson words them), and the map before
//      any detail: four topics follow the product, two about making it and letting it flow (types, variables and
//      control), two about counting it and the capacity (balances, batch capacity and scale-up)
//                                                                       → eng.process.types
//   s2 Procestypen en processchema's: the kettle makes one lot at a time, a batch; from the tank the product flows
//      non-stop to the filling unit (the cartons keep coming), so a batch feeds a continuous line; the block
//      diagram and the process flow diagram, in which each unit has a code (Werkkennis, .diagrams)  → .types (.diagrams)
//   s3 Procesgrootheden en regelen: pressure, temperature, flow and level run the plant, and are kept at their
//      value; a Coriolis meter on the pipe to hall B (mass directly) and a Pt100 in the pipe (Basis, .variables)
//                                                                       → .variables
//   s4 Massa- en energiebalans: what goes in comes out or stays in; if something is missing look for a leak, the
//      product can go down the floor drain; the mass balance (Basis, .mass)  → .mass
//   s5 Batchcapaciteit en opschalen: a cycle runs from start to start and the waiting counts; what works in a flask
//      fails in the big kettle, so a pilot plant (Werkkennis, .scaleup) tests it small; then the product goes
//      through the pipe to the filling unit in hall B                   → .batch (.scaleup)
//   s6 the shared Engineering map (the kit's mapScene) with Process engineering basics lit, then the module's
//      four topics with their levels as columns, where to start, and what each later level adds, in the app's
//      level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a
// topic scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are
// real things of the topic at Basis or Working knowledge level, one short sentence each, not explained; a Werkkennis
// tool named in a scene (block diagram, process flow diagram, pilot plant) is not named again in the closing grid, and no
// tool of another module of the zone is used (the P&ID and the control loop belong to eng.drawings, CIP and the
// regeneration section to eng.fluids); the closing grid has one beat per later level in the app's level words; the
// people are plant people with safety glasses; the story ends where the field film picks it up (the pipe to the
// filling unit in hall B), in the last topic scene.
// Definitions as the Basis lessons word them (eng.process.types, .variables, .mass, .batch). Terms come from the
// module's lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the
// kit holds the film to its map (every topic named in a caption of its own scene, explained in two beats and lit),
// to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the person of the cast (you, the engineer), the
// room, with pm.agile.scrum's figure for the operator, given safety glasses (crew below). The plant's things are
// this film's own simple solids (films/eng.process.intro/process.mjs). A panel at the right, in stage space, draws
// each step as a schema, labelled "voorbeeld" (the product's way) or "schema" (the module's map).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { textUnits, wrapUnits, CHAR_W } from '../_kit/assert.mjs';
import { mapScene, mapStyles, mapCue, levelWords } from '../_kit/mapscene.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
import { processWorld, PROCESS_CSS } from './process.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import engMap from '../../src/content/courses/maps/eng.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the module
// The map this film draws, asserted against the index (the build fails if the module's topics or levels move):
// s6 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.process');
const LEVELS = {
  types: ['eng.process.types', 'eng.process.diagrams', 'eng.process.buffers', 'eng.process.continuous'],
  control: ['eng.process.variables', 'eng.process.loops', 'eng.process.strategies', 'eng.process.variability'],
  balances: ['eng.process.mass', 'eng.process.energy', 'eng.process.blending', 'eng.process.pinch'],
  capacity: ['eng.process.batch', 'eng.process.scaleup', 'eng.process.scheduling', 'eng.process.debottleneck'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.process has the four topics and levels this film draws');
assert(MOD.intro === 'eng.process.intro', 'eng.process names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: what a process plant is, as the first lesson words it (built from unit operations: pumping, heating, mixing)
has('eng.process.types', ['Een procesfabriek is opgebouwd uit unit operations', 'Pompen, verwarmen en koelen, mengen']);
has('eng.process.types', ['A process plant is built from unit operations', 'Pumping, heating and cooling, mixing'], 'en');
// s2: batch (one lot, one batch number) and continuous (non-stop), the two combined, the block diagram, the process flow diagram and the code of a unit
has('eng.process.types', ['In een batchproces gaat een vaste hoeveelheid een vat in', 'komt eruit als één partij, met één batchnummer', 'In een continu proces stroomt het product non-stop in en uit', 'batchgewijs mengen dat een continue vullijn voedt']);
has('eng.process.types', ['In a batch process a fixed amount goes into a vessel', 'comes out as one lot, with one batch number', 'In a continuous process material flows in and out non-stop', 'batch mixing that feeds a continuous filling line'], 'en');
has('eng.process.diagrams', ['Blokschema', 'Processchema', 'Apparaatcode', 'P-101 voor een pomp']);
has('eng.process.diagrams', ['Block flow diagram', 'Process flow diagram', 'Equipment tag', 'P-101 for a pump'], 'en');
// s3: the four variables, a Coriolis meter (mass directly) and the Pt100
has('eng.process.variables', ['Vier grootheden sturen de meeste procesfabrieken: druk, temperatuur, debiet en niveau', 'Een Coriolismeter laat een buis trillen', 'hij meet direct massa', 'Pt100', 'platina weerstand']);
has('eng.process.variables', ['pressure, temperature, flow and level', 'A Coriolis meter vibrates a tube', 'it gives mass flow directly', 'Pt100', 'platinum resistor'], 'en');
// s4: the mass balance (in comes out or stays inside, accumulation, a tank that fills, a leak, product to the drain)
has('eng.process.mass', ['wat erin gaat, komt eruit of blijft erin zitten', 'zoals een tank die langzaam volloopt', 'Een massabalans is het eerste gereedschap van een procesengineer', 'Mist er 2% van de massa, zoek dan een lek', 'product dat naar het riool gaat']);
has('eng.process.mass', ['what goes in comes out or stays inside', 'such as a tank that slowly fills', 'A mass balance is the first tool of a process engineer', 'If 2% of the mass is missing, look for a leak', 'product going to drain'], 'en');
// s5: the batch cycle (start to start, waiting counts), scale-up (a flask against the big kettle), the pilot plant
has('eng.process.batch', ['De batchcyclustijd is alles tussen twee starts', 'het wachten op een operator, een labuitslag of een vrije tank verderop']);
has('eng.process.batch', ['The batch cycle time is everything between two starts', 'waiting for an operator, a lab result or a free tank downstream'], 'en');
has('eng.process.scaleup', ['Een recept dat werkt in een glazen kolf van 2 liter gaat vaak mis', 'Een proeffabriek is een kleine installatie', 'Proeffabriek']);
has('eng.process.scaleup', ['A recipe that works in a 2-litre glass flask often misbehaves', 'A pilot plant is a small, production-like installation', 'Pilot plant'], 'en');
// s6: the first lesson shows how a plant is built and runs (where to start)
has('eng.process.types', ['Unit operations, batch en continu']);
// s6: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.process.diagrams', 'Blokschema’s'], ['eng.process.loops', 'Regelkringen'], ['eng.process.energy', 'Energiebalans'], ['eng.process.scaleup', 'opschalen'],
  ['eng.process.buffers', 'Buffertanks'], ['eng.process.strategies', 'Cascade'], ['eng.process.blending', 'standaardiseren'], ['eng.process.scheduling', 'meerdere producten plannen'],
  ['eng.process.continuous', 'lijninhoud, opstarten en omstellen'], ['eng.process.variability', 'Minder spreiding'], ['eng.process.pinch', 'pinch'], ['eng.process.debottleneck', 'debottlenecken']]) has(id, [word]);
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 240, col: 100, box: 92, tile: 216, top: 64, pitch: 80, h: 64 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
assert(GRID.top + (ORDER.length - 1) * GRID.pitch + GRID.h <= 392, 'the four rows of the grid fit the stage');
for (const lang of ['nl', 'en']) {
  for (const id of ORDER) {
    const title = MOD.topics.find((t) => t.id === id).title[lang];
    assert(wrapUnits(title, GRID.tile - 12, CHAR_W).length <= 2, `the grid tile of "${title}" (${lang}) needs more than two lines`);
  }
}

// ---------------------------------------------------------------- the world (the process plant)
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 170, h: 215 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const plant = processWorld(w, k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const person = (role, x, y, along) => w.person({ x, y, role, along });
// The operator: pm.agile.scrum's figure (imported, not copied) without the laptop, in a dark work jacket (look sm), with
// safety glasses: a dark band round the head at eye height, drawn over the head, so he reads as a person of the plant
// and not as office staff.
const crew = (key, look, x, y, along = 'x') => {
  const fig = scrumPerson(w, k, G, P, { x, y, key, look, along });
  const glasses = w.post(x + 0.5, y + 0.5, 11.9, 158, 162.5, { tone: 'lo' }, 28);
  if (!fig.endsWith('</g>')) throw new Error('cast: a figure is one group');
  return fig.slice(0, -4) + glasses + '</g>';
};

const part = plant.parts({ cueG, g });
// The operator stands in one place of the plant and is moved, in stage units, to where each scene needs him: at the
// front of the line (s1, s2), at the front right (s3), at the front right (s4), by the pilot kettle (s5): never
// in front of a part the beat lights. You stand at the front left.
const OP0 = [180, 150];
const OPP = { 2: [230, 150], 3: [230, 150], 4: [225, 150] };
const JIJ0 = [20, 135];
const JIJP = {};
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const OPSHIFT = Object.fromEntries(Object.entries(OPP).map(([si, to]) => [si, shiftOf(OP0, to)]));
const JIJSHIFT = Object.fromEntries(Object.entries(JIJP).map(([si, to]) => [si, shiftOf(JIJ0, to)]));
// painted back to front (large x and small y are far): the kettle, the line (pump, heat exchanger, the pipe with
// the Pt100), the tank, the outlet pipe with the meter, the floor (drain, sacks), the pilot kettle, the operator, you
const world = [
  w.room(ROOM),
  part.kettle,
  part.line,
  part.tank,
  part.outlet,
  part.floor,
  part.pilot,
  g('pp-op', crew('opP', 'sm', OP0[0], OP0[1], 'x')),
  g('pp-jij', person('jij', JIJ0[0], JIJ0[1], 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Process
// engineering basics is a cue group of its own (map-process).
const TILE = { types: 'tTypes', control: 'tControl', balances: 'tBal', capacity: 'tCap' };
const PANEL = ['flowS', 'unitS', 'grpA', 'grpB', 'batchS', 'contS', 'blokS', 'fourS', 'keepS', 'balS', 'gapS', 'cycS', 'scaleS', 'ship',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Process engineering basics lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.process'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.process');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.process')}"`), 'the map lights eng.process as a cue group');
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), `the Engineering map is ${MAP_W} by ${MAP_H}`);

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
// [ox, oy, s]: the point (ox, oy) of the room, in stage units, is brought to the middle of the room's half of the
// stage while the room scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(150, 70, 40, 1.2), to: cam(150, 75, 40, 1.26) }, // s1 the whole plant: kettle, line, tank
  { from: cam(240, 42, 60, 1.5), to: cam(150, 50, 55, 1.3), at: 1 }, // s2 the kettle, then (b1) the tank and the line to hall B
  { from: cam(140, 45, 55, 1.3), to: cam(70, 45, 50, 1.5), at: 1 }, // s3 the pipe with the Pt100, then the meter
  { from: cam(160, 75, 40, 1.2), to: cam(100, 75, 30, 1.5), at: 1 }, // s4 the sacks and the tank, then (b1) the drain
  { from: cam(240, 50, 60, 1.4), to: cam(70, 70, 50, 1.5), at: 2 }, // s5 the kettle, then (b2) the pilot kettle and the pipe to hall B
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.process.intro',
  title: { nl: 'Van ketel naar tank: een procesfabriek', en: 'From kettle to tank: a process plant' },
  module: 'eng.process',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.process, the scene that explains it and its tile
  topics: {
    types: { scene: 's2', cue: 'tTypes' },
    control: { scene: 's3', cue: 'tControl' },
    balances: { scene: 's4', cue: 'tBal' },
    capacity: { scene: 's5', cue: 'tCap' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén product, vier onderwerpen', en: 'One product, four topics' },
      beats: [
        { nl: 'In de procesfabriek wordt het product gemaakt dat in de tank van lijn 3 zit.', en: 'In the process plant the product is made that sits in the tank of line 3.', focus: ['flowS', 'kettle', 'tank', 'jij'] },
        { nl: 'Een procesfabriek bestaat uit vaste stappen, de unit operations, zoals pompen en mengen.', en: 'A process plant is built from fixed steps, the unit operations, such as pumping and mixing.', focus: ['unitS', 'pump', 'hx', 'kettle'] },
        { nl: 'Vier onderwerpen volgen het product. Twee gaan over maken en laten stromen.', en: 'Four topics follow the product. Two are about making it and letting it flow.', focus: 'grpA' },
        { nl: 'De andere twee gaan over tellen en over capaciteit.', en: 'The other two are about counting and about capacity.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Procestypen', en: 'Types' },
      beats: [
        { nl: 'Eerste onderwerp: Procestypen en processchema’s. De ketel maakt één partij, een batch.', en: 'First topic: Process types and diagrams. The kettle makes one lot, a batch.', focus: ['tTypes', 'batchS', 'kettle'] },
        { nl: 'Vanaf de tank stroomt het product non-stop naar de vuleenheid, want de dozen blijven komen.', en: 'From the tank the product flows non-stop to the filling unit, because the cartons keep coming.', focus: ['contS', 'tank', 'pipe4'] },
        { nl: 'We gebruiken vaak een {t:Blokschema|blokschema} en een {t:Processchema|processchema}.', en: 'For process types we often use a {t:Block flow diagram|block diagram} and a {t:Process flow diagram|process flow diagram}.', ...TOOL('Blokschema', 'Processchema'), focus: ['tool1', 'tool2', 'blokS', 'tagP', 'tagT'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Procesgrootheden', en: 'Process variables' },
      beats: [
        { nl: 'Tweede onderwerp: Procesgrootheden en regelen. Druk, temperatuur, debiet en niveau sturen de fabriek.', en: 'Second topic: Process variables and control. Pressure, temperature, flow and level run the plant.', focus: ['tControl', 'fourS', 'pipe3'] },
        { nl: 'Je houdt ze op hun waarde, zodat elke doos in de vuleenheid hetzelfde product krijgt.', en: 'You keep them at their value, so every carton in the filling unit gets the same product.', focus: ['keepS', 'tank'] },
        { nl: 'Bij meten gebruiken we vaak een {t:Coriolismeter|Coriolismeter} voor debiet en een {t:Pt100|Pt100} voor temperatuur.', en: 'For measuring we often use a {t:Coriolis meter|Coriolis meter} for flow and a {t:Pt100|Pt100} for temperature.', ...TOOL('Coriolismeter', 'Pt100'), focus: ['tool1', 'tool2', 'meter', 'pt'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Balansen', en: 'Balances' },
      beats: [
        { nl: 'Derde onderwerp: Massa- en energiebalans. Wat erin gaat, komt eruit of blijft erin.', en: 'Third topic: Mass and energy balances. What goes in comes out or stays in.', focus: ['tBal', 'balS', 'sacks', 'tank'] },
        { nl: 'Mist er iets in de som, dan zoek je een lek. Product kan naar het riool verdwijnen.', en: 'If something is missing in the sum, look for a leak. Product can disappear down the drain.', focus: ['gapS', 'drain'] },
        { nl: 'Bij balansen gebruiken we vaak een {t:Massabalans|massabalans}. Die laat zien waar product blijft.', en: 'For balances we often use a {t:Mass balance|mass balance}. It shows where product goes.', ...TOOL('Massabalans'), focus: ['tool1', 'tank', 'pipe4'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Capaciteit', en: 'Capacity' },
      beats: [
        { nl: 'Vierde onderwerp: Batchcapaciteit en opschalen. Een cyclus loopt van start tot start.', en: 'Fourth topic: Batch capacity and scale-up. A cycle runs from start to start.', focus: ['tCap', 'cycS', 'kettle'] },
        { nl: 'Wat in een kolf werkt, gaat in de grote ketel vaak mis. Daarom schaal je in stappen op.', en: 'What works in a flask often fails in the big kettle. So you scale up in steps.', focus: ['scaleS', 'kettle'] },
        { nl: 'Bij opschalen gebruiken we vaak een {t:Proeffabriek|proeffabriek}. Daar test je klein wat later groot moet.', en: 'For scale-up we often use a {t:Pilot plant|pilot plant}. There you test small what must later run big.', ...TOOL('Proeffabriek'), focus: ['tool1', 'pilot'] },
        { nl: 'Het product is klaar en gaat via de leiding naar de vuleenheid in hal B.', en: 'The product is ready and goes through the pipe to the filling unit in hall B.', focus: ['ship', 'pipe4', 'tank', 'jij'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Procestechniek: de basis is het derde station van Dingen maken.', en: 'The whole map. Process engineering basics is the third station of Making things.', focus: 'map-process' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Procestypen en processchema’s op niveau Basis. Die les laat zien hoe een fabriek draait.', en: 'Start with Process types and diagrams at Basics level. That lesson shows how a plant runs.', focus: ['tTypes', 'start'] },
        { nl: 'Op niveau Werkkennis lees je tekeningen en regelkringen, reken je met energie en schaal je op.', en: 'At Working knowledge level you read drawings and control loops, work with energy and scale up.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen buffertanks, cascaderegeling, standaardiseren en het plannen van meer producten.', en: 'At Advanced level come buffer tanks, cascade control, standardising and scheduling several products.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om opstartverlies, minder spreiding, pinch-analyse en knelpunten wegnemen.', en: 'At Expert level it is about start-up losses, less variation, pinch analysis and removing bottlenecks.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said once. Short sentences, few
// colons and comma lists, no symbols the voice would read aloud and nothing in parentheses: the kit's narration
// guard (films/_kit/assert.mjs, checkNarration) holds every module film to that, and the render guard caps a pause
// inside a sentence at 0.4 s. Each topic scene ends on one short sentence naming the tools of that topic's lessons,
// without explaining them. Every drawn detail has its reason in the narration: the kettle (it makes one batch at a
// time), the pump and the heat exchanger (pumping and heating are unit operations), the tag plates (everyone
// means the same unit), the meter on the pipe (it measures mass directly), the drain (product can go missing
// there), the pilot kettle (you test small what must later run big), the pipe (the product goes to hall B).
const SAY = [
  [ // s1 one product, four topics: what a process plant is, two topics make and flow, two count and capacity
    { nl: 'In de procesfabriek wordt het product gemaakt dat in de tank van lijn 3 zit.',
      en: 'In the process plant the product is made that sits in the tank of line 3.' },
    { nl: 'Een procesfabriek bestaat uit vaste stappen, zoals pompen, verwarmen en mengen. Die heten unit operations.',
      en: 'A process plant is built from fixed steps, such as pumping, heating and mixing. They are called unit operations.' },
    { nl: 'Vier onderwerpen volgen het product. Twee gaan over maken en laten stromen.',
      en: 'Four topics follow the product. Two are about making it and letting it flow.' },
    { nl: 'De andere twee gaan over tellen en over capaciteit.',
      en: 'The other two are about counting and about capacity.' },
  ],
  [ // s2 process types: a batch, a continuous line, the block diagram, the process flow diagram and the code of a unit
    { nl: 'Het eerste onderwerp is Procestypen en processchema’s. In de ketel maak je één partij tegelijk, een batch.',
      en: 'The first topic is Process types and diagrams. In the kettle you make one lot at a time, a batch.' },
    { nl: 'Vanaf de tank stroomt het product non-stop naar de vuleenheid, want de dozen blijven komen.',
      en: 'From the tank the product flows non-stop to the filling unit, because the cartons keep coming.' },
    { nl: 'Bij procestypen gebruiken we vaak een {t:Blokschema|blokschema} en een {t:Processchema|processchema}. Daarin heeft elk apparaat een code, zodat iedereen hetzelfde apparaat bedoelt.',
      en: 'For process types we often use a {t:Block flow diagram|block diagram} and a {t:Process flow diagram|process flow diagram}. In it every unit has a code, so everyone means the same unit.' },
  ],
  [ // s3 variables and control
    { nl: 'Het tweede onderwerp is Procesgrootheden en regelen. Vier grootheden sturen de fabriek. Dat zijn druk, temperatuur, debiet en niveau.',
      en: 'The second topic is Process variables and control. Four variables run the plant. They are pressure, temperature, flow and level.' },
    { nl: 'Je houdt ze op hun waarde, zodat elke doos in de vuleenheid hetzelfde product krijgt.',
      en: 'You keep them at their value, so every carton in the filling unit gets the same product.' },
    { nl: 'Bij meten gebruiken we vaak een {t:Coriolismeter|Coriolismeter} voor het debiet en een {t:Pt100|Pt100} voor de temperatuur. De Coriolismeter meet direct de massa.',
      en: 'For measuring we often use a {t:Coriolis meter|Coriolis meter} for flow and a {t:Pt100|Pt100} for temperature. The Coriolis meter measures mass directly.' },
  ],
  [ // s4 mass and energy balances
    { nl: 'Het derde onderwerp is Massa- en energiebalans. Wat erin gaat, zoals de zakken op de pallet, komt eruit of blijft erin.',
      en: 'The third topic is Mass and energy balances. What goes in, like the sacks on the pallet, comes out or stays in.' },
    { nl: 'Mist er iets in de som, dan zoek je een lek. Product kan bijvoorbeeld via de vloer naar het riool verdwijnen.',
      en: 'If something is missing in the sum, look for a leak. Product can, for instance, disappear down the floor drain.' },
    { nl: 'Bij balansen gebruiken we vaak een {t:Massabalans|massabalans}. Die laat zien waar product blijft.',
      en: 'For balances we often use a {t:Mass balance|mass balance}. It shows where product goes.' },
  ],
  [ // s5 batch capacity and scale-up, and the product leaves for hall B
    { nl: 'Het vierde onderwerp is Batchcapaciteit en opschalen. Een cyclus loopt van de ene start tot de volgende, en het wachten telt mee.',
      en: 'The fourth topic is Batch capacity and scale-up. A cycle runs from one start to the next, and the waiting counts.' },
    { nl: 'Wat in een kolf werkt, gaat in de grote ketel vaak mis. Daarom schaal je in stappen op.',
      en: 'What works in a flask often fails in the big kettle. So you scale up in steps.' },
    { nl: 'Bij opschalen gebruiken we vaak een {t:Proeffabriek|proeffabriek}. Daar test je klein wat later groot moet.',
      en: 'For scale-up we often use a {t:Pilot plant|pilot plant}. There you test small what must later run big.' },
    { nl: 'Het product is klaar en gaat via de leiding naar de vuleenheid in hal B.',
      en: 'The product is ready and goes through the pipe to the filling unit in hall B.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'Dit is de hele kaart. Procestechniek, de basis, is het derde station van Dingen maken.',
      en: 'This is the whole map. Process engineering basics is the third station of Making things.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Procestypen en processchema’s op niveau Basis. Die les laat zien hoe een fabriek draait.',
      en: 'Start with Process types and diagrams at Basics level. That lesson shows how a plant runs.' },
    { nl: 'Op niveau Werkkennis lees je tekeningen en regelkringen, reken je met energie en schaal je op.',
      en: 'At Working knowledge level you read drawings and control loops, work with energy and scale up.' },
    { nl: 'Op niveau Gevorderd komen buffertanks, cascaderegeling, standaardiseren en het plannen van meer producten.',
      en: 'At Advanced level come buffer tanks, cascade control, standardising and scheduling several products.' },
    { nl: 'Op niveau Expert gaat het om opstartverlies, minder spreiding, pinch-analyse en knelpunten wegnemen.',
      en: 'At Expert level it is about start-up losses, less variation, pinch analysis and removing bottlenecks.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst OPSHIFT = ${JSON.stringify(OPSHIFT)};\nconst JIJSHIFT = ${JSON.stringify(JIJSHIFT)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="opP"])';
const css = PM_CSS + PROCESS_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
.pm-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.pm-chip{fill:var(--anatomy-hi);stroke:none}
.pm-gap{fill:none;stroke:#C2553F;stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-hole){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-chip{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'De procesfabriek, op mensenmaat. Langs de achterwand stroomt het product van rechts naar links: een batchketel met een roermotor en een batchlabel, een pomp, een platenwarmtewisselaar, een leiding met een Pt100, de tank van lijn 3 en een leiding door de linkerwand naar hal B met een Coriolismeter. Pomp en tank hebben een apparaatcode. Voor de wand een pallet met zakken, een vloerput en op een tafel een kleine proefketel. Een operator met een veiligheidsbril die van de ketel naar de leiding, de put en de proefketel loopt, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: het product dat uit de procesfabriek in de tank van lijn 3 komt, de stappen pompen, verwarmen en mengen, de vier onderwerpen van de module als route in twee groepen, elk met zijn schema: batch en continu met een blokschema, de vier procesgrootheden, de balans met een gat, de batchcyclus en het opschalen van een kolf naar een ketel, met per onderwerp de namen van een of twee hulpmiddelen, en het product dat naar hal B gaat. Aan het eind de hele kaart van Engineering met Procestechniek: de basis verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'The process plant, at person scale. Along the back wall the product flows from the right to the left: a batch kettle with an agitator motor and a batch tag, a pump, a plate heat exchanger, a pipe with a Pt100, the tank of line 3 and a pipe through the left wall to hall B with a Coriolis meter. The pump and the tank have an equipment tag. In front of the wall a pallet of sacks, a floor drain and, on a table, a small pilot kettle. An operator in safety glasses who walks from the kettle to the pipe, the drain and the pilot kettle, and you, the engineer. At the right a panel, marked as an example or a diagram: the product that comes from the process plant into the tank of line 3, the steps pumping, heating and mixing, the four topics of the module as a route in two groups, each with its diagram: batch and continuous with a block diagram, the four process variables, the balance with a gap, the batch cycle and the scale-up from a flask to a kettle, with the names of one or two tools per topic, and the product going to hall B. At the end the whole map of Engineering with Process engineering basics lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

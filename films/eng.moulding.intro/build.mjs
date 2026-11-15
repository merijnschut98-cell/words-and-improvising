// Dev tool, not shipped. Builds the module intro film "De kap uit de pers / The cover from the press" for
// Spuitgieten (eng.moulding), an Engineering module intro film (v17, Task 13): the high-over picture at the
// top of the module, before its six topics (Merijn, 13 Nov: "that high-over picture is the thing I need
// the most"). Pattern and rules: films/eng.machining.intro (the approved reference) and the notes section
// "Engineering module intros".
//
//   node films/eng.moulding.intro/build.mjs            build the page
//   node films/eng.moulding.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.moulding.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (eng.moulding's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The story: the plastic cover of the new filling unit of line 3 (the field film films/eng.field.making: a
// light plastic cover that sits on the beam of the frame, on top of the unit; its station Spuitgieten says the
// cover is injected into a mould, that you use a hot runner and a setting sheet, and that without this the cover
// gets flash or sink marks) is moulded in the plant's moulding shop, at person scale, on one press. Every topic
// of the module has its place in that one job:
//   s1 the press, the cover on the table, what injection moulding is (molten plastic injected into a steel
//      mould and left to set), and the map before any detail: six topics follow the cover, three of them make
//      it (the machine, the cycle, the plastics) and three keep it right (the faults, the process setting, the
//      moulds)                                                          → eng.moulding.machine
//   s2 De machine: the injection unit melts the plastic, the clamp unit holds the mould shut against the
//      pressure (too little clamp force gives flash); the mould has to fit between the tie bars
//                                                                       → .machine (Geleidekolommen)
//   s3 Cyclus en output: one cycle runs from one closing of the mould to the next; cooling takes the longest
//      and sets the output; cooling channels and the temperature control unit (Werkkennis, .cooling)
//                                                                       → .cycle (.cooling)
//   s4 Kunststoffen: thermoplastics melt and set again; the cover is polycarbonate, hard to break and it
//      absorbs water, so the granules go through a dryer first (a tool of the Basis text, not a glossary term)
//                                                                       → .materials
//   s5 Fouten: flash and a sink mark on the cover; the boundary sample lies on the table at the machine so every shift
//      judges the same (Werkkennis, .diagnose)                          → .defects (.diagnose)
//   s6 Procesinstelling: five groups of settings decide the part, they affect each other, the setter starts
//      from the setting sheet for this mould on this press             → .setup
//   s7 Matrijzen: the mould is the costly part made for this cover; it is kept up before it breaks (a hot runner
//      and a shot counter on the trolley); then the cover is good and goes to hall B
//                                                                       → .tooling
//   s8 the shared Engineering map (the kit's mapScene) with Injection moulding lit, then the module's six topics
//      with their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail;
// a topic scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools
// are real things of the topic at Basis or Working knowledge level, one short sentence each, not explained; a
// Werkkennis tool named in a scene (the temperature control unit, the boundary sample) is not named again in the
// closing grid; the closing grid has one beat per later level in the app's level words; the people are workshop
// people with safety glasses; the story ends where the field film picks it up (the cover goes to hall B), in
// the last topic scene.
// Definitions as the Basis lessons word them (eng.moulding.machine, .cycle, .materials, .defects, .setup,
// .tooling). Terms come from the module's lessons and {n:} numbers from the module's text (the kit's intro
// mode, films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a caption of its own
// scene, explained in two beats and lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the person of the cast (you, the engineer),
// the table, the sheet and the room, with pm.agile.scrum's figure for the operator, given safety glasses
// (crew below). The press and its things are this film's own simple solids (films/eng.moulding.intro/moulding.mjs).
// A panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld" (the cover's job) or
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
import { mouldingWorld, MOULDING_CSS } from './moulding.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import engMap from '../../src/content/courses/maps/eng.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the module
// The map this film draws, asserted against the index (the build fails if the
// module's topics or levels move): s8 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.moulding');
const LEVELS = {
  machine: ['eng.moulding.machine', 'eng.moulding.screw', 'eng.moulding.clamp', 'eng.moulding.electric'],
  cycle: ['eng.moulding.cycle', 'eng.moulding.cooling', 'eng.moulding.cavities', 'eng.moulding.partcost'],
  materials: ['eng.moulding.materials', 'eng.moulding.polymers', 'eng.moulding.drying', 'eng.moulding.fillers'],
  defects: ['eng.moulding.defects', 'eng.moulding.diagnose', 'eng.moulding.warpage', 'eng.moulding.defectdata'],
  setting: ['eng.moulding.setup', 'eng.moulding.process', 'eng.moulding.scientific', 'eng.moulding.validation'],
  moulds: ['eng.moulding.tooling', 'eng.moulding.mouldparts', 'eng.moulding.mouldcare', 'eng.moulding.newmould'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.moulding has the six topics and levels this film draws');
assert(MOD.intro === 'eng.moulding.intro', 'eng.moulding names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: what injection moulding is, as the first lesson words it (the machine that squirts molten plastic into a steel mould)
has('eng.moulding.machine', ['gesmolten kunststof in een stalen matrijs', 'te spuiten en te laten stollen']);
has('eng.moulding.machine', ['molten plastic into a steel mould', 'and letting it set'], 'en');
// s2: the machine (the injection unit melts, the clamp unit holds the mould, the clamp force holds it shut against the melt, too little gives flash), and the tie bars
has('eng.moulding.machine', ['De spuitunit smelt de kunststof', 'De sluitunit houdt de matrijs vast', 'Te weinig kracht en de matrijs gaat een haarbreed open op de deellijn', 'braam', 'Sluitkracht', 'Geleidekolommen', 'de matrijs moet ertussen passen']);
has('eng.moulding.machine', ['The injection unit melts the plastic', 'The clamp unit holds the mould', 'Too little force', 'flash', 'Clamp force', 'Tie bars'], 'en');
// s3: the cycle (from one closing to the next, cooling is most of it), the cooling channels and the temperature control unit
has('eng.moulding.cycle', ['De cyclustijd is de tijd van het ene sluiten van de matrijs tot het volgende', 'Koelen is vaak 50 tot 80% van de cyclus', 'Koelkanalen']);
has('eng.moulding.cycle', ['Cycle time is the time from one mould close to the next', 'Cooling is often 50 to 80% of the cycle', 'Cooling channels'], 'en');
has('eng.moulding.cooling', ['Temperatuurregelaar', 'De kast naast de pers']);
has('eng.moulding.cooling', ['Temperature control unit'], 'en');
// s4: the plastics (thermoplastics, the cover plastic PC, water from the air, the dryer)
has('eng.moulding.materials', ['thermoplasten: ze smelten bij verwarmen en worden weer vast bij afkoelen', 'PC (polycarbonaat): helder en bijna onbreekbaar', 'lenzen en kappen', 'Sommige kunststoffen zijn hygroscopisch: ze nemen water op uit de lucht', 'in een droger die heel droge lucht door de korrels blaast']);
has('eng.moulding.materials', ['thermoplastics: they melt when heated and set when cooled', 'PC (polycarbonate): clear and hard to break', 'covers', 'Some plastics are hygroscopic: they absorb water from the air', 'in a dryer that blows very dry air through the granules'], 'en');
// s5: the faults (flash, sink mark), and the boundary sample the shifts compare with
has('eng.moulding.defects', ['Braam is het omgekeerde: kunststof komt waar hij niet hoort', 'op de deellijn', 'Een inzakplek, ook wel invalplek, is een deukje boven een dik deel']);
has('eng.moulding.defects', ['Flash is the opposite: plastic gets where it should not', 'at the parting line', 'A sink mark is a dent above a thick section'], 'en');
has('eng.moulding.diagnose', ['Grensmonster', 'Operators vergelijken met het grensmonster', 'in elke dienst hetzelfde oordeel']);
has('eng.moulding.diagnose', ['Boundary sample', 'the same verdict'], 'en');
// s6: the process setting (five groups, they affect each other, the setting sheet)
has('eng.moulding.setup', ['vijf groepen instellingen bepalen het product', 'de instelkaart: de goedgekeurde lijst instellingen voor één matrijs op één pers', 'de instellingen beïnvloeden elkaar', 'Instelkaart']);
has('eng.moulding.setup', ['five groups of settings decide the part', 'the setting sheet: the approved list of settings for one mould on one press', 'the settings interact', 'Setting sheet'], 'en');
// s7: the moulds (the costly part made for the product, maintenance before it fails, the hot runner, the shot counter)
has('eng.moulding.machine', ['De matrijs is het dure, productspecifieke deel']);
has('eng.moulding.machine', ['expensive, part-specific'], 'en');
has('eng.moulding.tooling', ['Matrijzen hebben preventief onderhoud nodig, gepland voordat ze stukgaan', 'Onderhoud overslaan zie je later terug als braam', 'Heetkanaal', 'Shotteller']);
has('eng.moulding.tooling', ['Moulds need preventive maintenance, planned before they fail', 'Skipping maintenance shows up later as flash', 'Hot runner', 'Shot counter'], 'en');
// s8: the first lesson shows one whole cycle, a shot (where to start)
has('eng.moulding.machine', ['Eén cyclus, een shot, heeft zes stappen']);
// s8: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.moulding.screw', 'De schroef'], ['eng.moulding.cooling', 'Koelen'], ['eng.moulding.polymers', 'kunststoffen'], ['eng.moulding.diagnose', 'oorzaak van een fout'], ['eng.moulding.process', 'procesvenster'], ['eng.moulding.mouldparts', 'Binnen in een matrijs'],
  ['eng.moulding.clamp', 'juiste pers kiezen'], ['eng.moulding.cavities', 'holtes'], ['eng.moulding.drying', 'Drogen'], ['eng.moulding.warpage', 'Kromtrekken'], ['eng.moulding.scientific', 'drie studies'], ['eng.moulding.mouldcare', 'wissels plannen'],
  ['eng.moulding.electric', 'Hydraulisch, elektrisch'], ['eng.moulding.partcost', 'kost'], ['eng.moulding.fillers', 'Glasvezel'], ['eng.moulding.defectdata', 'blijvend oplossen'], ['eng.moulding.validation', 'valideren'], ['eng.moulding.newmould', 'nieuwe matrijs']]) has(id, [word]);
// s8: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 222, col: 100, box: 92, tile: 200, top: 64, pitch: 54, h: 50 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
assert(GRID.top + (ORDER.length - 1) * GRID.pitch + GRID.h <= 392, 'the six rows of the grid fit the stage');

// ---------------------------------------------------------------- the world (the moulding shop)
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 170, h: 215 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const shop = mouldingWorld(w, k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const person = (role, x, y, along) => w.person({ x, y, role, along });
// The operator: pm.agile.scrum's figure (imported, not copied) without the laptop, in a dark work jacket
// (look sm) or a mid-tone one (look dev), each with safety glasses: a dark band round the head at eye height,
// drawn over the head, so they read as people at the press and not as office staff.
const crew = (key, look, x, y, along = 'x') => {
  const fig = scrumPerson(w, k, G, P, { x, y, key, look, along });
  const glasses = w.post(x + 0.5, y + 0.5, 11.9, 158, 162.5, { tone: 'lo' }, 28);
  if (!fig.endsWith('</g>')) throw new Error('cast: a figure is one group');
  return fig.slice(0, -4) + glasses + '</g>';
};

const part = shop.parts({ cueG, g });
// The operator stands in one place of the shop and is moved, in stage units, to where each scene needs him: at the
// press (s1 to s3), at the hopper (s4), by the table and the control (s6), by the trolley (s7).
const OP0 = [40, 112];
const OPP = { 3: [160, 74], 5: [126, 128], 6: [30, 154] };
const JIJ0 = [278, 136];
const JIJP = { 4: [136, 142], 6: [136, 142] };
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const OPSHIFT = Object.fromEntries(Object.entries(OPP).map(([si, to]) => [si, shiftOf(OP0, to)]));
const JIJSHIFT = Object.fromEntries(Object.entries(JIJP).map(([si, to]) => [si, shiftOf(JIJ0, to)]));
// painted back to front: the press, the bin of granules, the temperature control unit, the control,
// the operator, the trolley with the mould, the table (with the cover and the boundary sample), you
const world = [
  w.room(ROOM),
  part.press,
  part.bin,
  part.tcu,
  part.control,
  g('pp-opP', crew('opP', 'sm', 40, 112, 'x')),
  part.trolley,
  part.table,
  g('pp-jij', person('jij', JIJ0[0], JIJ0[1], 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the six topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Injection
// moulding is a cue group of its own (map-moulding).
const TILE = { machine: 'tMach', cycle: 'tCycle', materials: 'tMat', defects: 'tDef', setting: 'tSet', moulds: 'tMould' };
const PANEL = ['flow', 'shotS', 'cutters', 'support', 'pressS', 'clampS', 'cycleS', 'coolS', 'thermoS', 'pcS', 'defS', 'defX', 'fiveS', 'linkS', 'mouldS', 'careS', 'ship',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Injection moulding lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.moulding'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.moulding');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.moulding')}"`), 'the map lights eng.moulding as a cue group');
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), 'the Engineering map is 640 by 1128');

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
  { from: cam(135, 80, 60, 1), to: cam(135, 85, 60, 1.06) }, // s1 the whole shop: the press, the cover on the table
  { from: cam(132, 30, 100, 1.2), to: cam(104, 30, 105, 1.5) }, // s2 the press: the injection unit, the clamp unit, then the tie bars
  { from: cam(95, 30, 100, 1.5), to: cam(55, 55, 70, 1.5), at: 2 }, // s3 the mould, then (b3) the temperature control unit
  { from: cam(250, 70, 60, 1.15), to: cam(205, 70, 110, 1.2), at: 1 }, // s4 the granules, then (b2) the hopper with the dryer and the cover
  { from: cam(215, 130, 80, 1.9), to: cam(225, 130, 80, 1.9), at: 2 }, // s5 the cover on the table, then the boundary sample
  { from: cam(150, 90, 100, 1.5), to: cam(160, 100, 90, 1.5) }, // s6 the control and the table with the setting sheet
  { from: cam(90, 128, 70, 1.7), to: cam(190, 128, 80, 1.25), at: 3 }, // s7 the trolley with the opened mould, then (b4) you with the cover
  { from: cam(135, 85, 60, 1), to: cam(135, 85, 60, 1) }, // s8 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(8).fill(30);
const spec = {
  id: 'eng.moulding.intro',
  title: { nl: 'De kap uit de pers: van korrel tot kap', en: 'The cover from the press: from granule to cover' },
  module: 'eng.moulding',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile 200, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.moulding, the scene that explains it and its tile
  topics: {
    machine: { scene: 's2', cue: 'tMach' },
    cycle: { scene: 's3', cue: 'tCycle' },
    materials: { scene: 's4', cue: 'tMat' },
    defects: { scene: 's5', cue: 'tDef' },
    setting: { scene: 's6', cue: 'tSet' },
    moulds: { scene: 's7', cue: 'tMould' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén kap, zes onderwerpen', en: 'One cover, six topics' },
      beats: [
        { nl: 'In de spuitgieterij staat een pers. Daaruit komt de kap van de vuleenheid.', en: 'In the moulding shop stands a press. The cover of the filling unit comes out of it.', focus: ['flow', 'press', 'cover', 'jij'] },
        { nl: 'Een spuitgietmachine spuit gesmolten kunststof in een stalen matrijs. Daar stolt het.', en: 'An injection moulding machine injects molten plastic into a steel mould, where it sets.', focus: ['shotS', 'press'] },
        { nl: 'Zes onderwerpen volgen de kap. De machine, de cyclus en de kunststoffen maken hem.', en: 'Six topics follow the cover. The machine, the cycle and the plastics make it.', focus: 'cutters' },
        { nl: 'Fouten, procesinstelling en matrijzen zorgen dat elke kap goed is.', en: 'Defects, process setting and moulds make sure every cover is good.', focus: 'support' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'De machine', en: 'The machine' },
      beats: [
        { nl: 'Eerste onderwerp: De machine. De spuitunit smelt, de sluitunit houdt de matrijs vast.', en: 'First topic: The machine. The injection unit melts, the clamp unit holds the mould.', focus: ['tMach', 'pressS', 'inj', 'mouldP'] },
        { nl: 'De sluitkracht houdt de matrijs dicht. Te weinig geeft braam op de kap.', en: 'The clamp force keeps the mould shut. Too little gives flash on the cover.', focus: ['clampS', 'mouldP'] },
        { nl: 'Bij de machine kijken we naar de {t:Geleidekolommen|geleidekolommen}. De matrijs moet ertussen passen.', en: 'For the machine we look at the {t:Tie bars|tie bars}. The mould has to fit between them.', ...TOOL('Geleidekolommen'), focus: ['tool1', 'cols'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Cyclus en output', en: 'Cycle and output' },
      beats: [
        { nl: 'Tweede onderwerp: Cyclus en output. Een cyclus loopt van sluiten tot weer sluiten.', en: 'Second topic: Cycle and output. A cycle runs from one mould close to the next.', focus: ['tCycle', 'cycleS', 'mouldP'] },
        { nl: 'Het koelen duurt het langst. Daarom bepaalt het hoeveel kappen je per uur maakt.', en: 'Cooling takes longest. So it decides how many covers you make per hour.', focus: ['coolS', 'mouldP'] },
        { nl: 'We gebruiken vaak {t:Koelkanalen|koelkanalen} en een {t:Temperatuurregelaar|temperatuurregelaar}.', en: 'We often use {t:Cooling channels|cooling channels} and a {t:Temperature control unit|temperature control unit}.', ...TOOL('Koelkanalen', 'Temperatuurregelaar'), focus: ['tool1', 'tool2', 'chan', 'tcu'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Kunststoffen', en: 'Plastics' },
      beats: [
        { nl: 'Derde onderwerp: Kunststoffen. De korrels smelten bij verwarmen en worden weer vast.', en: 'Third topic: Plastics. The granules melt when heated and set again when cooled.', focus: ['tMat', 'thermoS', 'granules'] },
        { nl: 'De kap is van polycarbonaat, helder en bijna onbreekbaar. Het neemt water op.', en: 'The cover is polycarbonate, clear and hard to break. It absorbs water.', focus: ['pcS', 'cover'] },
        { nl: 'Daarom gebruiken we vaak een droger voor de korrels.', en: 'So we often use a dryer for the granules.', focus: ['tool1', 'dryer'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Fouten', en: 'Defects' },
      beats: [
        { nl: 'Vierde onderwerp: Fouten. Op een kap kun je braam zien of een inzakplek.', en: 'Fourth topic: Defects. On a cover you can see flash or a sink mark.', focus: ['tDef', 'defS', 'flash', 'sink'] },
        { nl: 'Braam is kunststof waar het niet hoort. Een inzakplek is een deukje boven een dik deel.', en: 'Flash is plastic where it should not be. A sink mark is a dent above a thick section.', focus: ['defX', 'flash', 'sink'] },
        { nl: 'Bij fouten vergelijken we met een {t:Grensmonster|grensmonster}. Zo oordeelt elke dienst hetzelfde.', en: 'For defects we compare with a {t:Boundary sample|boundary sample}. So every shift judges the same.', ...TOOL('Grensmonster'), focus: ['tool1', 'sample'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Procesinstelling', en: 'Process setting' },
      beats: [
        { nl: 'Vijfde onderwerp: Procesinstelling. Op het scherm bepalen vijf groepen instellingen het product.', en: 'Fifth topic: Process setting. On the screen, five groups of settings decide the part.', focus: ['tSet', 'fiveS', 'screen'] },
        { nl: 'Ze beïnvloeden elkaar. Daarom draait de insteller niet zomaar aan één ervan.', en: 'They affect each other. So the setter does not just turn one of them.', focus: ['linkS', 'screen'] },
        { nl: 'Bij het instellen starten we met de {t:Instelkaart|instelkaart} voor deze matrijs op deze pers.', en: 'For setting we start with the {t:Setting sheet|setting sheet} for this mould on this press.', ...TOOL('Instelkaart'), focus: ['tool1', 'card'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Matrijzen', en: 'Moulds' },
      beats: [
        { nl: 'Zesde onderwerp: Matrijzen. De matrijs is het dure deel en past alleen bij deze kap.', en: 'Sixth topic: Moulds. The mould is the costly part and fits only this cover.', focus: ['tMould', 'mouldS', 'trolley'] },
        { nl: 'Je onderhoudt de matrijs voordat hij stukgaat. Anders krijg je later braam.', en: 'You service the mould before it breaks. Otherwise flash comes later.', focus: ['careS', 'trolley'] },
        { nl: 'Bij matrijzen gebruiken we vaak een {t:Heetkanaal|heetkanaal} en een {t:Shotteller|shotteller}.', en: 'For moulds we often use a {t:Hot runner|hot runner} and a {t:Shot counter|shot counter}.', ...TOOL('Heetkanaal', 'Shotteller'), focus: ['tool1', 'tool2', 'hotrunner', 'counter'] },
        { nl: 'De kap is goed. Hij gaat naar de vuleenheid van lijn 3 in hal B.', en: 'The cover is good. It goes to the filling unit of line 3 in hall B.', focus: ['ship', 'cover', 'jij'] },
      ],
    },
    {
      id: 's8', level: 1, dur: DURS[7], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: Spuitgieten is het zesde station van Dingen maken.', en: 'The whole map: Injection moulding is the sixth station of Making things.', focus: 'map-moulding' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij De machine, op niveau Basis. Die les laat zien hoe een pers werkt.', en: 'Start with The machine, at Basics level. That lesson shows how a press works.', focus: ['tMach', 'start'] },
        { nl: 'Werkkennis: schroef, koelen, soorten kunststof, foutoorzaken, procesvenster en de matrijs van binnen.', en: 'Working knowledge: screw, cooling, plastic families, causes of defects, process window and inside the mould.', focus: 'lv2' },
        { nl: 'Gevorderd: pers kiezen, meer holtes, kromtrekken, drie studies en matrijsonderhoud.', en: 'Advanced: choosing a press, more cavities, warpage, three studies and mould maintenance.', focus: 'lv3' },
        { nl: 'Expert: soorten persen, kostprijs, glasvezel en recyclaat, blijvende oplossingen en valideren.', en: 'Expert: kinds of presses, part cost, glass fibre and recyclate, lasting fixes and validating.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and film in this module has a place on this map.', focus: null },
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
// inside a sentence at 0.4 s. Each topic scene ends on one short sentence naming the tools of that topic's
// lessons, without explaining them. Every drawn detail has its reason in the narration: the press and the cover
// (the cover of the unit comes out of it), the tie bars (the mould has to fit between them), the clamp force (too
// little gives flash), the dryer (polycarbonate absorbs water), the boundary sample (every shift judges the same),
// the setting sheet (the settings affect each other), the shot counter (it tells when the mould needs service).
const SAY = [
  [ // s1 one cover, six topics: what injection moulding is, the three that make the cover and the three that keep it right
    { nl: 'In de spuitgieterij staat een pers. Daar komt de kap voor de vuleenheid van lijn 3 uit.',
      en: 'In the moulding shop stands a press. The cover for the filling unit of line 3 comes out of it.' },
    { nl: 'Een spuitgietmachine maakt kunststof producten door gesmolten kunststof in een stalen matrijs te spuiten en te laten stollen.',
      en: 'An injection moulding machine makes plastic parts by injecting molten plastic into a steel mould and letting it set.' },
    { nl: 'Zes onderwerpen volgen de kap. De machine, de cyclus en de kunststoffen maken hem.',
      en: 'Six topics follow the cover. The machine, the cycle and the plastics make it.' },
    { nl: 'Fouten, procesinstelling en matrijzen zorgen dat elke kap goed is.',
      en: 'Defects, process setting and moulds make sure every cover is good.' },
  ],
  [ // s2 the machine: the injection unit melts, the clamp unit holds the mould shut, the mould fits between the tie bars
    { nl: 'Het eerste onderwerp is De machine. De spuitunit smelt de kunststof en de sluitunit houdt de matrijs vast.',
      en: 'The first topic is The machine. The injection unit melts the plastic and the clamp unit holds the mould.' },
    { nl: 'De {t:Sluitkracht|sluitkracht} houdt de matrijs dicht tegen de druk. Te weinig geeft braam op de kap.',
      en: 'The {t:Clamp force|clamp force} keeps the mould shut against the pressure. Too little gives flash on the cover.' },
    { nl: 'Bij de machine kijken we naar de geleidekolommen. De matrijs moet ertussen passen.',
      en: 'For the machine we look at the tie bars. The mould has to fit between them.' },
  ],
  [ // s3 cycle and output
    { nl: 'Het tweede onderwerp is Cyclus en output. Een cyclus loopt van sluiten tot weer sluiten.',
      en: 'The second topic is Cycle and output. A cycle runs from one closing of the mould to the next.' },
    { nl: 'Het koelen duurt meestal het langst. Daarom bepaalt het hoeveel kappen je per uur maakt.',
      en: 'The cooling usually takes longest. So it decides how many covers you make per hour.' },
    { nl: 'Bij het koelen gebruiken we vaak koelkanalen en een temperatuur-regelaar.',
      en: 'For cooling we often use cooling channels and a temperature control unit.' },
  ],
  [ // s4 plastics: thermoplastics, the cover plastic takes up water, so the granules are dried
    { nl: 'Het derde onderwerp is Kunststoffen. De korrels zijn thermoplasten. Ze smelten bij verwarmen en worden weer vast.',
      en: 'The third topic is Plastics. The granules are thermoplastics. They melt when heated and set again when cooled.' },
    { nl: 'De kap is van polycarbonaat, helder en bijna onbreekbaar. Maar het neemt water op uit de lucht.',
      en: 'The cover is polycarbonate, clear and hard to break. But it absorbs water from the air.' },
    { nl: 'Daarom gebruiken we bij kunststoffen vaak een droger voor de korrels.',
      en: 'So with plastics we often use a dryer for the granules.' },
  ],
  [ // s5 defects
    { nl: 'Het vierde onderwerp is Fouten. Op een kap kun je braam zien of een inzakplek.',
      en: 'The fourth topic is Defects. On a cover you can see flash or a sink mark.' },
    { nl: 'Braam is kunststof waar het niet hoort. Een inzakplek is een deukje boven een dik deel.',
      en: 'Flash is plastic where it should not be. A sink mark is a dent above a thick section.' },
    { nl: 'Bij fouten vergelijken we met een grensmonster. Zo oordeelt elke dienst hetzelfde.',
      en: 'For defects we compare with a boundary sample. So every shift judges the same.' },
  ],
  [ // s6 process setting
    { nl: 'Het vijfde onderwerp is Procesinstelling. Op het scherm bepalen vijf groepen instellingen het product.',
      en: 'The fifth topic is Process setting. On the screen, five groups of settings decide the part.' },
    { nl: 'Ze beïnvloeden elkaar. Daarom draait de insteller niet zomaar aan één ervan.',
      en: 'They affect each other. So the setter does not just turn one of them.' },
    { nl: 'Bij het instellen starten we met de instelkaart voor deze matrijs op deze pers.',
      en: 'For setting we start with the setting sheet for this mould on this press.' },
  ],
  [ // s7 moulds, and the cover leaves the shop
    { nl: 'Het zesde onderwerp is Matrijzen. De matrijs is het dure deel, gemaakt voor alleen deze kap.',
      en: 'The sixth topic is Moulds. The mould is the costly part, made for this cover only.' },
    { nl: 'Je onderhoudt de matrijs voordat hij stuk gaat. Anders krijg je later braam op de kap.',
      en: 'You service the mould before it breaks. Otherwise you get flash on the cover later.' },
    { nl: 'Bij matrijzen gebruiken we vaak een heetkanaal en een shotteller, die telt hoe vaak hij sluit.',
      en: 'For moulds we often use a hot runner and a shot counter, which counts how often it closes.' },
    { nl: 'De kap is goed. Hij gaat naar de vuleenheid van lijn 3 in hal B.',
      en: 'The cover is good. It goes to the filling unit of line 3 in hall B.' },
  ],
  [ // s8 the map: the level words of the app, as the captions show them
    { nl: 'Dit is de hele kaart. Spuitgieten is het zesde station van Dingen maken.',
      en: 'This is the whole map. Injection moulding is the sixth station of Making things.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij De machine, op niveau Basis. Die eerste les laat een hele cyclus van de pers zien.',
      en: 'Start with The machine, at Basics level. That first lesson shows one whole cycle of the press.' },
    { nl: 'Op niveau Werkkennis komen de schroef, het koelen en de soorten kunststof. Je zoekt de oorzaak van een fout, stelt het procesvenster in en kijkt in de matrijs.',
      en: 'At Working knowledge level come the screw, the cooling and the plastic families. You look for the cause of a defect, set the process window and look inside the mould.' },
    { nl: 'Op niveau Gevorderd kies je de juiste pers, weeg je meer holtes af en pak je kromtrekken aan. Daarna komen drie studies en het matrijsonderhoud.',
      en: 'At Advanced level you choose the right press, weigh more cavities and tackle warpage. Then come three studies and the mould maintenance.' },
    { nl: 'Op niveau Expert ken je alle soorten persen en reken je de kostprijs uit. Je werkt met glasvezel en recyclaat, lost fouten blijvend op en valideert het proces.',
      en: 'At Expert level you know all kinds of presses and work out the part cost. You work with glass fibre and recyclate, solve defects for good and validate the process.' },
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
const css = PM_CSS + MOULDING_CSS + `
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
.pm-heat{fill:none;stroke:#C2553F;stroke-width:2;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-hole){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-chip{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'De spuitgieterij van de fabriek, op mensenmaat. Langs de achterwand een spuitgietmachine: links de sluitunit met de matrijs tussen twee platen op vier geleidekolommen, rechts de spuitunit met een cilinder, een trechter met een droger erboven en de aandrijving. Voor de machine een temperatuurregelaar met een slang naar de matrijs, een besturing met een scherm, een bak met kunststofkorrels, een tafel met de instelkaart, de kap en het grensmonster, en vooraan links een wagen met een geopende matrijs met een heetkanaal en een shotteller. Een operator met een veiligheidsbril die van de pers naar de droger, de besturing en de wagen loopt, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: de kap van de vuleenheid van lijn 3 die uit korrels in een matrijs ontstaat, de zes onderwerpen van de module als route in twee groepen, de drie die de kap maken en de drie die hem goed houden, elk met zijn schema: de machine, de cyclus, de kunststoffen, de fouten, de procesinstelling en de matrijzen, met per onderwerp de namen van een of twee hulpmiddelen, en de goede kap die naar hal B gaat. Aan het eind de hele kaart van Engineering met Spuitgieten verlicht, en de zes onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'The moulding shop of the plant, at person scale. Along the back wall an injection moulding machine: at the left the clamp unit with the mould between two platens on four tie bars, at the right the injection unit with a barrel, a hopper with a dryer on top and the drive. In front of the machine a temperature control unit with a hose to the mould, a control with a screen, a bin of plastic granules, a table with the setting sheet, the cover and the boundary sample, and at the front left a trolley with an opened mould with a hot runner and a shot counter. An operator in safety glasses who walks from the press to the dryer, the control and the trolley, and you, the engineer. At the right a panel, marked as an example or a diagram: the cover of the filling unit of line 3 that comes from granules in a mould, the six topics of the module as a route in two groups, the three that make the cover and the three that keep it right, each with its diagram: the machine, the cycle, the plastics, the defects, the process setting and the moulds, with the names of one or two tools per topic, and the good cover going to hall B. At the end the whole map of Engineering with Injection moulding lit, and the module’s six topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

// Dev tool, not shipped. Builds the module intro film "Het frame en zijn staal / The frame and its steel" for
// Materialen en sterkte (eng.mechanics), an Engineering module intro film (v17, Task 13): the high-over picture at
// the top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/eng.mechanics.intro/build.mjs            build the page
//   node films/eng.mechanics.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.mechanics.intro.html: one offline page with the anatomy kit, the stage script
// and the player inlined. The index names it (eng.mechanics' `intro`), coursehome shows it above the topics, sw.js
// precaches it.
//
// The story: the frame of the filling unit of line 3 (the field film films/eng.field.making: a steel frame of two
// uprights and a beam with a plate hung from the beam, a plastic cover on top and a tank behind it; its Materialen
// en sterkte station: you choose a steel that can take more than the load, test it with a tensile test and a hardness
// test, and without this the frame can break after months) is followed through the module's four topics, in the
// module's own order, at person scale in the plant's lab and workshop, and every topic has its place in that one job:
//   s1 the frame under its load, what a load and strength are (the first lessons' words) and the map before any
//      detail: four topics in two groups in the module's order, what the frame carries and what the steel can
//      take, then how it can still break and which steel to choose
//   s2 Krachten, momenten en spanning: the frame carries the weight of the filled tank and every filling is a
//      shock; stress is force per area, the same force is harmless to a thick bar and fatal to a thin one; the
//      frame will hang from a lifting sling, so the working load limit on its tag      → eng.mechanics.forces (.stress)
//   s3 Materiaalsterkte en beproeving: a bar of the frame's steel goes to the lab, a machine pulls it until it
//      breaks, the yield strength is where it bends for good and the frame stays below it; the tensile test
//                                                                               → .strength (.testing)
//   s4 Vermoeiing en breuk: strong enough once, the frame can still break after months: a load that comes back
//      millions of times grows a crack from a sharp corner, below the yield strength; a broken part is read with
//      fractography                                                             → .fatigue (.fracture)
//   s5 Warmtebehandeling en materiaalkeuze: structural steel for the frame (strong, stiff, weldable); heating and
//      quenching make steel hard but brittle, tempering makes it tougher; the hardness test; a block of the steel goes
//      to the workshop, where the plate is machined from it (the field film's next station and films/eng.machining.intro)
//                                                                               → .materials (.heattreat)
//   s6 the shared Engineering map (the kit's mapScene) with Materials and strength lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level words
// Definitions as the Basis lessons word them (eng.mechanics.forces, .strength, .fatigue, .materials). Each topic
// scene names one tool or test of that topic's lessons in one short sentence, without explaining it (Merijn's
// checkpoint, 14 Nov): the tensile test and the hardness test agree with the Materialen en sterkte station of the
// field film; a tool named in a scene is not named again in the closing grid. Terms come from the module's lessons
// and the kit's intro mode (films/_kit/build-film.mjs) holds the film to its map (every topic named in a caption of
// its own scene, explained in two beats and lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the people of the cast (you, the engineer), the
// table and the room, with pm.agile.scrum's figures for the lab technician and the rigger, given safety glasses and
// gloves (crew below). The frame, the tank, the sling, the test machine, the steel rack, the hardness tester and the
// microscope are this film's own simple solids (films/eng.mechanics.intro/workshop.mjs). A panel at the right, in
// stage space, draws each step as a schema, labelled "voorbeeld" (the frame's job) or "schema" (the module's map).
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
import { workshopWorld, WORKSHOP_CSS } from './workshop.mjs';
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
// module's topics or levels move): s6 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.mechanics');
const LEVELS = {
  load: ['eng.mechanics.forces', 'eng.mechanics.stress', 'eng.mechanics.bending', 'eng.mechanics.calccheck'],
  strength: ['eng.mechanics.strength', 'eng.mechanics.testing', 'eng.mechanics.toughness', 'eng.mechanics.traceability'],
  failure: ['eng.mechanics.fatigue', 'eng.mechanics.fracture', 'eng.mechanics.snlife', 'eng.mechanics.weldfatigue'],
  choice: ['eng.mechanics.materials', 'eng.mechanics.heattreat', 'eng.mechanics.designation', 'eng.mechanics.selection'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.mechanics has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: a load and strength, as the first lessons word them
has('eng.mechanics.forces', ['belastingen (loads), de krachten die een onderdeel moet dragen']);
has('eng.mechanics.forces', ['loads, the forces a part must carry'], 'en');
has('eng.mechanics.stress', ['Sterkte Hoeveel belasting een onderdeel aankan voordat het blijvend vervormt of breekt']);
has('eng.mechanics.stress', ['Strength How much load a part takes before it bends permanently or breaks'], 'en');
// s2: loads: a static load like a tank, a dynamic load that changes; stress is force per area, the same force is harmless on a thick bar; lifting gear and its WLL
has('eng.mechanics.forces', ['Een statische belasting is constant, zoals een tank op zijn poten', 'Dynamische belasting', 'Hijsmiddelen', 'Werklast (WLL)']);
has('eng.mechanics.forces', ['A static load is constant, like a tank on its legs', 'Dynamic load', 'Lifting gear', 'Working load limit (WLL)'], 'en');
has('eng.mechanics.stress', ['Spanning is kracht per oppervlak', 'dezelfde kracht is onschuldig voor een dikke staaf en fataal voor een dunne']);
has('eng.mechanics.stress', ['Stress is force per area', 'the same force is harmless on a thick bar and fatal on a thin one'], 'en');
// s3: strength: a tensile test pulls a bar until it breaks; the yield strength; designers keep the stress below it
has('eng.mechanics.strength', ['Bij een trekproef trek je een proefstaaf tot hij breekt', 'Bij de vloeigrens begint het materiaal blijvend te vervormen', 'Ontwerpers houden de spanning onder de vloeigrens', 'Trekproef Een proefstaaf uittrekken tot hij breekt']);
has('eng.mechanics.strength', ['Tensile test Pulling a sample bar until it breaks', 'At the yield strength the material starts to deform permanently', 'Designers keep stresses below yield, because a permanently bent part has usually failed'], 'en');
// s4: fatigue: a load that comes back millions of times grows a crack, below yield; cracks start at a stress concentration (a sharp corner); the fracture is read (fractography)
has('eng.mechanics.fatigue', ['een belasting die miljoenen keren terugkomt, laat een kleine scheur groeien tot het onderdeel knapt', 'Scheuren beginnen waar kerfwerking', 'scherpe hoeken']);
has('eng.mechanics.fatigue', ['a load that repeats millions of times grows a small crack until the part snaps', 'Cracks start at a stress concentration', 'sharp corners'], 'en');
has('eng.mechanics.fracture', ['Fractografie is de studie ervan', 'Fractografie']);
has('eng.mechanics.fracture', ['Fractography is the study of it', 'Fractography'], 'en');
// s5: material choice: structural steel in frames, strong, stiff, cheap and weldable; quenching and tempering; the hardness test
has('eng.mechanics.materials', ['Constructiestaal zoals S235 en S355 gaat in frames', 'sterk, stijf, goedkoop en lasbaar']);
has('eng.mechanics.materials', ['Structural grades such as S235 and S355 go into frames', 'strong, stiff, cheap and weldable'], 'en');
has('eng.mechanics.heattreat', ['Dat snelle afkoelen heet afschrikken', 'Het staal wordt heel hard, maar ook bros', 'Daarna volgt ontlaten', 'Harden en ontlaten samen geven assen, tandwielen en gereedschappen hun eigenschappen', 'Hardheid Weerstand tegen indrukken']);
has('eng.mechanics.heattreat', ['Quenching', 'Tempering', 'Quench and temper together is how shafts, gears and tools get their properties', 'Hardness Resistance to being dented'], 'en');
// s6: where to start: the first Basis lesson is about what a part has to carry
has('eng.mechanics.forces', ['Kracht, gewicht en moment', 'de krachten die een onderdeel moet dragen']);
// s6: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.mechanics.stress', 'Spanning, rek en stijfheid'], ['eng.mechanics.testing', 'De trekproef en hardheidsmetingen in de praktijk'], ['eng.mechanics.fracture', 'Een gebroken onderdeel lezen'], ['eng.mechanics.heattreat', 'Hardheid en warmtebehandeling'],
  ['eng.mechanics.bending', 'Buiging en torsie in balken en assen'], ['eng.mechanics.toughness', 'Taaiheid, brosse breuk en de kerfslagproef'], ['eng.mechanics.snlife', 'Vermoeiingslevensduur berekenen'], ['eng.mechanics.designation', 'Staalnamen lezen'],
  ['eng.mechanics.calccheck', 'Een sterkteberekening en een FEM-plot lezen'], ['eng.mechanics.traceability', 'Materiaalcertificaten, traceerbaarheid en verwisselingen'], ['eng.mechanics.weldfatigue', 'Vermoeiing van gelaste constructies'], ['eng.mechanics.selection', 'Materialen kiezen en vervangen']]) has(id, [word]);
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 290, col: 82, box: 74, tile: 262, top: 64, pitch: 80, h: 70 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
assert(GRID.top + (ORDER.length - 1) * GRID.pitch + GRID.h <= 392, 'the four rows of the grid fit the stage');

// ---------------------------------------------------------------- the world (the lab and the workshop)
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 170, h: 215 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const shop = workshopWorld(w, k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const person = (role, x, y, along) => w.person({ x, y, role, along });
// The two other people: pm.agile.scrum's figures (imported, not copied) without the laptop, in a dark work jacket
// (look sm) or a mid-tone one (look dev), each with safety glasses (a dark band round the head at eye height) and
// work gloves (a dark box at the end of each arm), so they read as people in the lab and the workshop and not as office staff.
const crew = (key, look, x, y, along = 'x') => {
  const fig = scrumPerson(w, k, G, P, { x, y, key, look, along });
  const glasses = w.post(x + 0.5, y + 0.5, 11.9, 158, 162.5, { tone: 'lo' }, 28);
  const gloves = [-20.5, 20.5].map((s) => w.box({ x: x + s - 4.4, y: y - 4.4, w: 8.8, d: 8.8, r: 3 }, 86, 96, { tone: 'lo' }, { steps: 2 })).join('');
  if (!fig.endsWith('</g>')) throw new Error('cast: a figure is one group');
  return fig.slice(0, -4) + glasses + gloves + '</g>';
};

const part = shop.parts({ cueG, g });
// painted back to front: the tank, the steel rack and the test machine, the platform with the frame, the technician, the
// table with the tools, the rigger, you
const world = [
  w.room(ROOM),
  part.back,
  part.platform,
  part.frame,
  g('pp-tech', crew('tech', 'dev', 196, 76, 'x')),
  part.table,
  part.tools,
  g('pp-rig', crew('rig', 'sm', 62, 92, 'x')),
  g('pp-jij', person('jij', 20, 140, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Materials and
// strength is a cue group of its own (map-mechanics).
const TILE = { load: 'tLoad', strength: 'tStrength', failure: 'tFail', choice: 'tChoice' };
const PANEL = ['flow', 'melt', 'cutters', 'support', 'sA', 'sB', 'ship', 'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Materials and strength lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.mechanics'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.mechanics');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.mechanics')}"`), 'the map lights eng.mechanics as a cue group');
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
  { from: cam(145, 80, 60, 1), to: cam(145, 85, 60, 1.06) }, // s1 the whole workshop: the frame and the tank
  { from: cam(75, 55, 110, 1.45), to: cam(75, 45, 185, 1.6) }, // s2 the frame with the tank behind it, then the sling
  { from: cam(190, 50, 70, 1.45), to: cam(205, 50, 70, 1.4) }, // s3 the lab: the test machine and the technician
  { from: cam(106, 48, 143, 2.6), to: cam(185, 125, 95, 1.9) }, // s4 the crack in the corner, then the microscope on the table
  { from: cam(40, 30, 30, 1.6), to: cam(150, 100, 80, 1.35) }, // s5 the rack of steel bars, then the hardness tester
  { from: cam(145, 85, 60, 1), to: cam(145, 85, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.mechanics.intro',
  title: { nl: 'Het frame en zijn staal', en: 'The frame and its steel' },
  module: 'eng.mechanics',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile 262, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.mechanics, the scene that explains it and its tile
  topics: {
    load: { scene: 's2', cue: 'tLoad' },
    strength: { scene: 's3', cue: 'tStrength' },
    failure: { scene: 's4', cue: 'tFail' },
    choice: { scene: 's5', cue: 'tChoice' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén frame, vier onderwerpen', en: 'One frame, four topics' },
      beats: [
        { nl: 'In de fabriek staat het frame van de vuleenheid. Het moet de eenheid dragen, jarenlang.', en: 'In the plant stands the frame of the filling unit. It has to carry the unit, for years.', focus: ['flow', 'frame', 'tank', 'jij'] },
        { nl: 'Belasting is wat het frame draagt. Sterkte is wat het staal aankan voor het blijvend buigt of breekt.', en: 'Load is what the frame carries. Strength is what the steel takes before it bends for good or breaks.', focus: 'melt' },
        { nl: 'Vier onderwerpen volgen het frame. De eerste twee gaan over wat het frame draagt en wat het staal aankan.', en: 'Four topics follow the frame. The first two are about what the frame carries and what the steel takes.', focus: 'cutters' },
        { nl: 'De laatste twee gaan over hoe het frame toch kan breken en welk staal je kiest.', en: 'The last two are about how the frame can still break and which steel you choose.', focus: 'support' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Krachten, momenten en spanning', en: 'Forces, moments and stress' },
      beats: [
        { nl: 'Eerste onderwerp: Krachten, momenten en spanning. Het frame draagt de gevulde tank.', en: 'First topic: Forces, moments and stress. The frame carries the filled tank.', focus: ['tLoad', 'sA', 'frame', 'tank'] },
        { nl: 'Spanning is kracht per oppervlak. Dezelfde kracht is onschuldig voor een dikke staaf en fataal voor een dunne.', en: 'Stress is force per area. The same force is harmless to a thick bar and fatal to a thin one.', focus: ['sB', 'frame'] },
        { nl: 'Het frame hangt straks aan een hijsband. We lezen vaak de {t:Werklast (WLL)|werklast} op het label.', en: 'The frame will soon hang from a sling. We often read the {t:Working load limit (WLL)|working load limit} on the tag.', ...TOOL('Werklast (WLL)'), focus: ['tool1', 'sling', 'rig'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Materiaalsterkte en beproeving', en: 'Material strength and testing' },
      beats: [
        { nl: 'Tweede onderwerp: Materiaalsterkte en beproeving. Een staaf van het frame-staal gaat naar het lab.', en: 'Second topic: Material strength and testing. A bar of the frame steel goes to the lab.', focus: ['tStrength', 'sA', 'tech'] },
        { nl: 'Een machine trekt de staaf uit tot hij breekt. Bij de vloeigrens buigt hij blijvend. Het frame blijft eronder.', en: 'A machine pulls the bar until it breaks. At the yield strength it bends for good. The frame stays below it.', focus: ['sB', 'tens'] },
        { nl: 'Bij sterkte gebruiken we vaak een {t:Trekproef|trekproef}.', en: 'For strength we often use a {t:Tensile test|tensile test}.', ...TOOL('Trekproef'), focus: ['tool1', 'tens'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Vermoeiing en breuk', en: 'Fatigue and failure' },
      beats: [
        { nl: 'Derde onderwerp: Vermoeiing en breuk. Het frame is sterk genoeg en kan na maanden toch breken.', en: 'Third topic: Fatigue and failure. The frame is strong enough and can still break after months.', focus: ['tFail', 'sA', 'frame'] },
        { nl: 'Een belasting die miljoenen keren terugkomt, laat een scheur groeien. Hij begint in een scherpe hoek.', en: 'A load that comes back millions of times grows a crack. It starts at a sharp corner.', focus: ['sB', 'crack'] },
        { nl: 'Een gebroken stuk lezen we vaak met {t:Fractografie|fractografie}.', en: 'We often read a broken part with {t:Fractography|fractography}.', ...TOOL('Fractografie'), focus: ['tool1', 'micro'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Warmtebehandeling en materiaalkeuze', en: 'Heat treatment and material choice' },
      beats: [
        { nl: 'Vierde onderwerp: Warmtebehandeling en materiaalkeuze. Het frame wordt constructiestaal.', en: 'Fourth topic: Heat treatment and material choice. The frame becomes structural steel.', focus: ['tChoice', 'sA', 'stock'] },
        { nl: 'Verhitten en afschrikken maakt staal hard maar bros. Ontlaten maakt het weer taaier.', en: 'Heating and quenching make steel hard but brittle. Tempering makes it tougher again.', focus: ['sB', 'stock'] },
        { nl: 'Bij warmtebehandeling gebruiken we vaak een {t:Hardheid|hardheidsmeting}.', en: 'For heat treatment we often use a {t:Hardness|hardness test}.', ...TOOL('Hardheid'), focus: ['tool1', 'hard'] },
        { nl: 'Het staal is gekozen en getest. Een blok ervan gaat naar de werkplaats voor de plaat.', en: 'The steel is chosen and tested. A block of it goes to the workshop for the plate.', focus: ['ship', 'stock', 'tech'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: Materialen en sterkte is het eerste station van Dingen maken.', en: 'The whole map: Materials and strength is the first station of Making things.', focus: mapCue('eng.mechanics') },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Kracht, gewicht en moment, op niveau Basis. Die les laat zien wat het frame draagt.', en: 'Start with Force, weight and torque, at Basics level. That lesson shows what the frame carries.', focus: ['tLoad', 'start'] },
        { nl: 'Op niveau Werkkennis: spanning en rek, de uitkomst van tests, een gebroken onderdeel en warmtebehandeling.', en: 'At Working knowledge level: stress and strain, test results, a broken part and heat treatment.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd: buiging in balken en assen, taaiheid, vermoeiingslevensduur en staalnamen.', en: 'At Advanced level: bending in beams and shafts, toughness, fatigue life and steel names.', focus: 'lv3' },
        { nl: 'Op niveau Expert: een FEM-plot, materiaalcertificaten, gelaste vermoeiing en materiaal vervangen.', en: 'At Expert level: an FEA plot, material certificates, welded fatigue and substituting materials.', focus: 'lv4' },
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
// on one short sentence naming one tool or test of that topic's lessons, without
// explaining it. Every drawn detail has its reason in the narration: the frame
// (it carries the unit), the tank (the load), the sling and its tag (the frame
// is lifted, so the lifting gear has a maximum), the test bar and the machine (the
// steel's yield strength), the crack in the corner (a sharp corner starts it), the
// microscope (a broken part is read), the rack of bars (the steel is chosen from
// it) and the hardness tester (the check of a heat treatment).
const SAY = [
  [ // s1 one frame, four topics: a load and strength, then the four topics in two groups
    { nl: 'In de fabriek staat het frame van de vuleenheid voor lijn 3. Het moet de gevulde tank dragen, jarenlang.',
      en: 'In the plant stands the frame of the filling unit for line 3. It has to carry the filled tank, for years.' },
    { nl: 'Een belasting is een kracht die het frame moet dragen. Sterkte is hoeveel last het staal aankan voordat het blijvend buigt of breekt.',
      en: 'A load is a force the frame has to carry. Strength is how much load the steel takes before it bends for good or breaks.' },
    { nl: 'Vier onderwerpen volgen het frame. De eerste twee gaan over wat het frame draagt en wat het staal aankan.',
      en: 'Four topics follow the frame. The first two are about what the frame carries and what the steel takes.' },
    { nl: 'De laatste twee gaan over hoe het frame toch kan breken en welk staal je kiest.',
      en: 'The last two are about how the frame can still break and which steel you choose.' },
  ],
  [ // s2 loads: the tank is the load, stress is force per area, the frame is lifted with a sling
    { nl: 'Het eerste onderwerp is Krachten, momenten en spanning. Het frame draagt het gewicht van de gevulde tank. Elke vulling geeft ook een stoot.',
      en: 'The first topic is Forces, moments and stress. The frame carries the weight of the filled tank. Every filling also gives a shock.' },
    { nl: 'Spanning is kracht per oppervlak. Dezelfde kracht is onschuldig voor een dikke staaf en fataal voor een dunne.',
      en: 'Stress is force per area. The same force is harmless to a thick bar and fatal to a thin one.' },
    { nl: 'Het frame hangt straks aan een hijsband. Bij krachten lezen we vaak de werklast op het label.',
      en: 'The frame will soon hang from a sling. For forces we often read the working load limit on the tag.' },
  ],
  [ // s3 strength and testing: a bar of the frame's steel goes to the lab, the yield strength
    { nl: 'Het tweede onderwerp is Materiaalsterkte en beproeving. Een staaf uit het staal van het frame gaat naar het lab.',
      en: 'The second topic is Material strength and testing. A bar from the steel of the frame goes to the lab.' },
    { nl: 'Een machine trekt de staaf uit tot hij breekt. Bij de {t:Vloeigrens|vloeigrens} gaat hij blijvend buigen. Het frame blijft daaronder.',
      en: 'A machine pulls the bar until it breaks. At the {t:Yield strength|yield strength} it starts to bend for good. The frame stays below it.' },
    { nl: 'Bij sterkte gebruiken we vaak een trekproef.',
      en: 'For strength we often use a tensile test.' },
  ],
  [ // s4 fatigue and failure: strong enough, and still it cracks after months (the field film), from a sharp corner
    { nl: 'Het derde onderwerp is Vermoeiing en breuk. Het frame is sterk genoeg en kan toch na maanden breken.',
      en: 'The third topic is Fatigue and failure. The frame is strong enough and can still break after months.' },
    { nl: 'Een belasting die miljoenen keren terugkomt laat een scheur groeien, ook onder de vloeigrens. Hij begint in een scherpe hoek.',
      en: 'A load that comes back millions of times grows a crack, even below the yield strength. It starts at a sharp corner.' },
    { nl: 'Een gebroken stuk lezen we vaak met fractografie.',
      en: 'We often read a broken part with fractography.' },
  ],
  [ // s5 heat treatment and choice: structural steel for the frame, hardening and tempering, a block goes on to the workshop
    { nl: 'Het vierde onderwerp is Warmtebehandeling en materiaalkeuze. Het frame wordt constructiestaal, want dat is sterk, stijf en goed te lassen.',
      en: 'The fourth topic is Heat treatment and material choice. The frame becomes structural steel, because it is strong, stiff and easy to weld.' },
    { nl: 'Een warmtebehandeling verhit staal en schrikt het af. Dan is het hard maar bros. Ontlaten maakt het weer taaier. Zo krijgen assen en tandwielen hun eigenschappen.',
      en: 'A heat treatment heats steel and quenches it. Then it is hard but brittle. Tempering makes it tougher again. That is how shafts and gears get their properties.' },
    { nl: 'Bij warmtebehandeling gebruiken we vaak een hardheidsmeting.',
      en: 'For heat treatment we often use a hardness test.' },
    { nl: 'Het staal is gekozen en getest. Een blok ervan gaat naar de werkplaats. Daar wordt de plaat van het frame uit gemaakt.',
      en: 'The steel is chosen and tested. A block of it goes to the workshop. The plate of the frame is made from it there.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'Dit is de hele kaart. Materialen en sterkte is het eerste station van Dingen maken.',
      en: 'This is the whole map. Materials and strength is the first station of Making things.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Kracht, gewicht en moment, op niveau Basis. Die les laat zien wat het frame draagt.',
      en: 'Start with Force, weight and torque, at Basics level. That lesson shows what the frame carries.' },
    { nl: 'Op niveau Werkkennis gaat het over spanning en rek, de uitkomst van tests, een gebroken onderdeel en warmtebehandeling.',
      en: 'At Working knowledge level it is about stress and strain, test results, a broken part and heat treatment.' },
    { nl: 'Op niveau Gevorderd gaat het over buiging in balken en assen, taaiheid, vermoeiingslevensduur en staalnamen.',
      en: 'At Advanced level it is about bending in beams and shafts, toughness, fatigue life and steel names.' },
    { nl: 'Op niveau Expert gaat het over een FEM-plot, materiaalcertificaten, gelaste vermoeiing en materiaal vervangen.',
      en: 'At Expert level it is about an FEA plot, material certificates, welded fatigue and substituting materials.' },
    { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.',
      en: 'Every lesson and film in this module has a place on this map.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="tech"],[data-cue="rig"])';
const css = PM_CSS + WORKSHOP_CSS + `
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
  nl: 'De werkplaats en het lab van de fabriek, op mensenmaat. Links op een werkplatform het frame van de vuleenheid van lijn 3: twee stijlen en een balk, met aan de balk de plaat met vier gaten op vier bouten en bovenop de lichte kunststof kap, met achter het frame de tank; een hijsband met een label hangt aan de kap, in de rechterhoek van het frame zit een scheur; achterin een rek met stalen staven en een trekbank voor proefstaven; vooraan een tafel met een hardheidsmeter en een microscoop met een gebroken staaf. Een laborant met een veiligheidsbril en handschoenen, een monteur met een veiligheidsbril en handschoenen, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: het frame onder zijn last, de sterkte van het staal, een kromme van de trekproef, een scheur in een hoek, de warmtebehandeling en de vier onderwerpen van de module; aan het eind de kaart van Engineering met Materialen en sterkte verlicht en de vier onderwerpen met hun niveaus.',
  en: 'The workshop and the lab of the plant, at person scale. At the left on a work platform the frame of the filling unit of line 3: two uprights and a beam, with the plate with four holes on four bolts under the beam and the light plastic cover on top, with the tank behind the frame; a sling with a tag hangs from the cover, in the right corner of the frame is a crack; at the back a rack of steel bars and a tensile test machine for test bars; at the front a table with a hardness tester and a microscope with a broken bar. A lab technician in safety glasses and gloves, a fitter in safety glasses and gloves, and you, the engineer. At the right a panel, marked as an example or a diagram: the frame under its load, the strength of the steel, a curve of the tensile test, a crack in a corner, the heat treatment and the four topics of the module; at the end the Engineering map with Materials and strength lit and the four topics with their levels.',
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

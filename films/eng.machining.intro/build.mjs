// Dev tool, not shipped. Builds the module intro film "De plaat in de werkplaats /
// The plate in the workshop" for Verspanen (eng.machining), the first Engineering
// module intro film (v17, Task 13): the high-over picture at the top of the module,
// before its six topics (Merijn, 13 Nov: "that high-over picture is the thing I need
// the most").
//
//   node films/eng.machining.intro/build.mjs            build the page
//   node films/eng.machining.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.machining.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (eng.machining's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: the plate of the new filling unit of line 3 (the field film
// films/eng.field.making: a mounting plate with four holes that hangs from the beam of
// the frame above the cartons, the product runs through the holes into them) is made in
// the plant's workshop. It is cut from a block of steel, at person scale, and every
// topic of the module has its place in that one job:
//   s1 the block, the drawing (the plate with four holes, and why four holes), what
//      machining is (cutting material away until the shape of the drawing is left), the
//      module's six topics as a route                       → eng.machining.processes
//   s2 Draaien: the pipe of the tank joins the plate with a round part, made on the lathe;
//      the workpiece turns and a still tool moves along it; the diameter has to be right
//      or the pipe does not fit; a carbide insert              → .processes (.cutting)
//   s3 Frezen: the tool turns and the workpiece is held on the table; first the top is
//      made flat, then the tool follows the outline; a face mill and an end mill
//                                                              → .processes, .mill
//   s4 Boren: the four holes (the product has to fall into a carton); a drill can wander,
//      so a dimple first; a centre drill and a twist drill    → .processes, .drill
//   s5 CNC-programma: a computer drives the machine from a program; the machine has to
//      know where the plate lies; G-code and the work offset (workpiece zero)
//                                                              → .cnc
//   s6 Gereedschap: the cutting edge peels a chip, gets hot, has to stay hard, has to
//      suit the material; cemented carbide and a tool holder   → .toolbasics
//   s7 Opspanning en meten: the plate is held in the same place every time, then measured
//      against the drawing; a fixture and a micrometer        → .fixtures (.quality)
//   s8 how they hang together: turning, milling and drilling cut; the program, the tool and
//      the holding are needed at every cut; the plate goes to hall B
//   s9 the shared Engineering map (the kit's mapScene) with Machining lit, then the
//      module's six topics with their levels as columns, where to start, and what each
//      later level adds
// Definitions as the Basis lessons word them (eng.machining.processes, .cnc, .drill, .mill,
// .toolbasics, .fixtures). Each topic scene names one or two tools of that topic's lessons in
// one short sentence, without explaining them (Merijn's checkpoint, 14 Nov): the end mill
// and the twist drill agree with the Verspanen station of the field film; a tool named in a
// scene is not named again in the closing grid. Terms come from the module's lessons and
// {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the
// kit holds the film to its map (every topic named in a caption of its own scene, explained
// in two beats and lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the person of the cast
// (you, the engineer), the table, the sheet and the room, with pm.agile.scrum's figures for
// the two operators. The machines are this film's own simple solids (films/eng.machining.intro/
// workshop.mjs). A panel at the right, in stage space, draws each step as a schema, labelled
// "voorbeeld" (the plate's job) or "schema" (the module's map).
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
// module's topics or levels move): s9 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.machining');
const LEVELS = {
  turning: ['eng.machining.processes', 'eng.machining.cutting', 'eng.machining.turnfinish', 'eng.machining.turncell'],
  milling: ['eng.machining.mill', 'eng.machining.millfeeds', 'eng.machining.millstrategy', 'eng.machining.fiveaxis'],
  drilling: ['eng.machining.drill', 'eng.machining.holes', 'eng.machining.deephole', 'eng.machining.holequality'],
  cnc: ['eng.machining.cnc', 'eng.machining.gcode', 'eng.machining.offsets', 'eng.machining.cam'],
  tooling: ['eng.machining.toolbasics', 'eng.machining.tools', 'eng.machining.toollife', 'eng.machining.toolcost'],
  workholding: ['eng.machining.fixtures', 'eng.machining.quality', 'eng.machining.metrology', 'eng.machining.capable'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.machining has the six topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: what machining is, as the first lesson words it
has('eng.machining.processes', ['Verspanen betekent een onderdeel maken door materiaal weg te snijden in kleine krulletjes', 'tot de vorm van de tekening overblijft']);
has('eng.machining.processes', ['Machining means making a part by cutting away material in small curls', 'until the shape on the drawing is left'], 'en');
// s2: turning (the workpiece turns, a still tool moves along it; round shapes), and its tool, the insert of the cutting lesson
has('eng.machining.processes', ['het werkstuk draait en een stilstaande beitel', 'Zo maak je ronde vormen: assen, bussen']);
has('eng.machining.processes', ['the part spins and a fixed cutting tool moves along it', 'It makes round shapes: shafts, bushings'], 'en');
has('eng.machining.cutting', ['Wisselplaat']);
has('eng.machining.cutting', ['Carbide insert'], 'en');
// s3: milling (the tool turns, the workpiece is held on the table), the two mills
has('eng.machining.processes', ['Frezen: het gereedschap draait en het werkstuk, vastgezet op de tafel, beweegt eronder']);
has('eng.machining.processes', ['Milling: the tool spins and the part, clamped on the table, moves under it'], 'en');
has('eng.machining.mill', ['Een vlakfrees is een brede schijf met wisselplaten rondom: hij maakt de bovenkant van een blok in een paar banen vlak', 'Een vingerfrees is een smalle staaf met snijkanten op de zijkant en de punt', 'Vlakfrees', 'Vingerfrees']);
has('eng.machining.mill', ['A face mill is a wide disc with inserts all around', 'An end mill is a narrow bar with cutting edges on its side and tip', 'Face mill', 'End mill'], 'en');
// s4: drilling (a round hole, mostly on a milling machine), drill wander and the dimple; the two drills
has('eng.machining.processes', ['Boren: een draaiende boor maakt ronde gaten, meestal op een freesmachine']);
has('eng.machining.processes', ['Drilling: a spinning drill makes round holes, usually on a milling machine'], 'en');
has('eng.machining.drill', ['Een boor die op een vlak oppervlak begint, glijdt een fractie opzij', 'Dat heet weglopen', 'Daarom zet je eerst een kort kuiltje met een centreerboor', 'Centreerboor', 'Spiraalboor']);
has('eng.machining.drill', ['A drill that starts on a flat surface slides a fraction sideways', 'drill wander', 'a short dimple with a centre drill', 'Centre drill', 'Twist drill'], 'en');
// s5: CNC (a computer drives the motors from a program), the program is G-code, the work offset tells where the workpiece lies
has('eng.machining.cnc', ['betekent dat een computer de motoren van de machine aanstuurt, volgens een programma', 'Het programma is G-code: een lijst korte commando', 'Het werkstuknulpunt (G54) vertelt de machine waar het werkstuk op de tafel ligt', 'G-code', 'Werkstuknulpunt']);
has('eng.machining.cnc', ['means a computer drives the machine’s motors, following a program', 'The program is G-code: a list of short commands', 'The work offset (G54) tells the machine where the part sits on the table', 'Work offset'], 'en');
// s6: tooling (a hard, sharp edge peels a chip, it gets hot and has to stay hard, the material group), carbide and the holder
has('eng.machining.toolbasics', ['Snijgereedschap is een harde, scherpe kant die een spaan van een zachter werkstuk afschilt', 'Die snijkant wordt erg heet, dus het gereedschapsmateriaal moet hard blijven als het heet is', 'P, blauw: staal', 'N, groen: aluminium', 'Hardmetaal', 'Gereedschapshouder']);
has('eng.machining.toolbasics', ['A cutting tool is a hard, sharp edge that peels a chip off a softer workpiece', 'so the tool material must stay hard when hot', 'P, blue: steel', 'Cemented carbide', 'Tool holder'], 'en');
// s7: workholding (the same place every time, firm against the cutting forces) and measuring; a fixture and a micrometer
has('eng.machining.fixtures', ['Opspanning is hoe het werkstuk vastgehouden wordt', 'het werkstuk elke keer op precies dezelfde plek leggen en het stevig vasthouden tegen de snijkrachten', 'Mal']);
has('eng.machining.fixtures', ['Workholding is how the part is held', 'put the part in exactly the same place every time and hold it firmly against the cutting forces', 'Fixture'], 'en');
has('eng.machining.quality', ['Micrometer']);
has('eng.machining.quality', ['Micrometer'], 'en');
// s9: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.machining.cutting', 'Snijsnelheid, voeding en snedediepte'], ['eng.machining.millfeeds', 'Snijwaarden bij frezen'], ['eng.machining.holes', 'Gaten op maat'], ['eng.machining.gcode', 'programma lezen'],
  ['eng.machining.tools', 'Slijtage'], ['eng.machining.quality', 'meten'], ['eng.machining.turnfinish', 'Nadraaien'], ['eng.machining.millstrategy', 'Freesstrategie'], ['eng.machining.deephole', 'Diep boren'],
  ['eng.machining.offsets', 'crashes'], ['eng.machining.toollife', 'Standtijd'], ['eng.machining.metrology', 'meetonzekerheid'], ['eng.machining.turncell', 'in één opspanning'], ['eng.machining.fiveaxis', 'Vijfassig frezen'],
  ['eng.machining.holequality', 'positie'], ['eng.machining.cam', 'CAM'], ['eng.machining.toolcost', 'per stuk'], ['eng.machining.capable', 'capabel']]) has(id, [word]);
// s9: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
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

// ---------------------------------------------------------------- the world (the workshop)
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
const crew = (key, look, x, y, along = 'x') => scrumPerson(w, k, G, P, { x, y, key, look, along });

const part = shop.parts({ cueG, g });
// painted back to front: the mill and the people in front of it, the wall of tools, the control, the lathe, the pallet,
// you, the operator at the lathe, the table
const world = [
  w.room(ROOM),
  part.mill,
  g('pp-opM', crew('opM', 'dev2', 12, 62, 'y')),
  part.rack,
  part.control,
  part.lathe,
  g('pp-jij', person('jij', 190, 112, 'x')),
  g('pp-opL', crew('opL', 'dev', 150, 64)),
  part.table,
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the six topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Machining
// is a cue group of its own (map-machining).
const TILE = { turning: 'tTurn', milling: 'tMill', drilling: 'tBore', cnc: 'tCnc', tooling: 'tTool', workholding: 'tWork' };
const PANEL = ['flow', 'plate', 'cut', 'chain', 'turnS', 'size', 'millS', 'plan', 'drillS', 'holesP', 'wander', 'codeS', 'pathS', 'datumP', 'edgeS', 'heatS', 'gradeS', 'holdS', 'measP', 'cutters', 'support', 'ship',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Machining lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.machining'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.machining');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.machining')}"`), 'the map lights eng.machining as a cue group');
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
  { from: cam(145, 80, 60, 1), to: cam(145, 85, 60, 1.06) }, // s1 the whole workshop: the block, the drawing
  { from: cam(240, 50, 90, 1.5), to: cam(240, 55, 90, 1.7) }, // s2 the lathe
  { from: cam(70, 50, 80, 1.5), to: cam(95, 34, 100, 1.65) }, // s3 the milling machine, then the tool wall
  { from: cam(70, 50, 90, 1.7), to: cam(92, 36, 100, 1.65) }, // s4 the plate and the drill, then the tool wall
  { from: cam(80, 60, 100, 1.4), to: cam(88, 62, 100, 1.5) }, // s5 the machine and its control
  { from: cam(120, 30, 120, 1.7), to: cam(125, 30, 120, 1.9) }, // s6 the tool wall
  { from: cam(70, 88, 75, 1.35), to: cam(70, 92, 75, 1.45) }, // s7 the vise and the table with the plate and the drawing
  { from: cam(145, 80, 60, 1.05), to: cam(145, 85, 60, 1) }, // s8 the whole workshop
  { from: cam(145, 85, 60, 1), to: cam(145, 85, 60, 1) }, // s9 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(9).fill(30);
const spec = {
  id: 'eng.machining.intro',
  title: { nl: 'De plaat in de werkplaats: van blok tot meting', en: 'The plate in the workshop: from block to measurement' },
  module: 'eng.machining',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile 200, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.machining, the scene that explains it and its tile
  topics: {
    turning: { scene: 's2', cue: 'tTurn' },
    milling: { scene: 's3', cue: 'tMill' },
    drilling: { scene: 's4', cue: 'tBore' },
    cnc: { scene: 's5', cue: 'tCnc' },
    tooling: { scene: 's6', cue: 'tTool' },
    workholding: { scene: 's7', cue: 'tWork' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén plaat, zes onderwerpen', en: 'One plate, six topics' },
      beats: [
        { nl: 'In de werkplaats ligt een blok staal. Daaruit komt de plaat van de vuleenheid.', en: 'In the workshop lies a block of steel. The plate of the filling unit comes from it.', focus: ['flow', 'stock', 'jij'] },
        { nl: 'De tekening vraagt vier gaten. Het product loopt erdoor naar de dozen.', en: 'The drawing asks for four holes. The product runs through them into the cartons.', focus: ['plate', 'sheet'] },
        { nl: 'Verspanen is een onderdeel maken door materiaal weg te snijden.', en: 'Machining is making a part by cutting away material.', focus: ['cut', 'stock'] },
        { nl: 'Zes onderwerpen volgen de plaat, van blok tot meting.', en: 'Six topics follow the plate, from block to measurement.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Draaien', en: 'Turning' },
      beats: [
        { nl: 'Eerste onderwerp: Draaien. Een rond onderdeel voor de pijp van de tank.', en: 'First topic: Turning. A round part for the pipe of the tank.', focus: ['tTurn', 'chain', 'lathe'] },
        { nl: 'Het werkstuk draait en een stilstaande beitel beweegt erlangs.', en: 'The workpiece turns and a stationary tool moves along it.', focus: ['turnS', 'bar'] },
        { nl: 'De diameter moet kloppen, anders past de pijp niet.', en: 'The diameter has to be right, or the pipe does not fit.', focus: ['size', 'bar'] },
        { nl: 'Bij draaien gebruiken we vaak een {t:Wisselplaat|wisselplaat}.', en: 'For turning we often use a {t:Carbide insert|carbide insert}.', ...TOOL('Wisselplaat'), focus: ['tool1', 'insert'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Frezen', en: 'Milling' },
      beats: [
        { nl: 'Tweede onderwerp: Frezen. Het gereedschap draait, het werkstuk ligt vast.', en: 'Second topic: Milling. The tool turns, the workpiece is held.', focus: ['tMill', 'millS', 'blank'] },
        { nl: 'Eerst maak je de bovenkant vlak, dan volgt de omtrek.', en: 'First you make the top flat, then comes the outline.', focus: ['plan', 'plateM'] },
        { nl: 'Bij frezen gebruiken we vaak een {t:Vlakfrees|vlakfrees} en een {t:Vingerfrees|vingerfrees}.', en: 'For milling we often use a {t:Face mill|face mill} and an {t:End mill|end mill}.', ...TOOL('Vlakfrees', 'Vingerfrees'), focus: ['tool1', 'tool2', 'tFace', 'tEnd'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Boren', en: 'Drilling' },
      beats: [
        { nl: 'Derde onderwerp: Boren. De plaat krijgt vier gaten.', en: 'Third topic: Drilling. The plate gets four holes.', focus: ['tBore', 'drillS', 'plateM'] },
        { nl: 'Elk gat moet op zijn plek zitten, boven een doos.', en: 'Every hole has to be in its place, above a carton.', focus: ['holesP', 'holes'] },
        { nl: 'Een boor kan weglopen. Zet daarom eerst een kuiltje.', en: 'A drill can wander. So make a small dimple first.', focus: ['wander', 'holes'] },
        { nl: 'Bij boren gebruiken we vaak een {t:Centreerboor|centreerboor} en een {t:Spiraalboor|spiraalboor}.', en: 'For drilling we often use a {t:Centre drill|centre drill} and a {t:Twist drill|twist drill}.', ...TOOL('Centreerboor', 'Spiraalboor'), focus: ['tool1', 'tool2', 'tCentre', 'tTwist'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'CNC-programma', en: 'CNC programming' },
      beats: [
        { nl: 'Vierde onderwerp: CNC-programma. Een computer stuurt de machine.', en: 'Fourth topic: CNC programming. A computer drives the machine.', focus: ['tCnc', 'codeS', 'screen'] },
        { nl: 'Elke regel van het programma is één beweging van het gereedschap.', en: 'Every line of the program is one move of the tool.', focus: ['pathS', 'screen'] },
        { nl: 'De machine moet weten waar de plaat ligt, anders zit alles ernaast.', en: 'The machine has to know where the plate lies, or everything ends up off.', focus: ['datumP', 'plateM'] },
        { nl: 'Bij CNC gebruiken we vaak {t:G-code|G-code} en een {t:Werkstuknulpunt|werkstuknulpunt}.', en: 'For CNC we often use {t:G-code|G-code} and a {t:Work offset|work offset}.', ...TOOL('G-code', 'Werkstuknulpunt'), focus: ['tool1', 'tool2', 'screen', 'datum'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Gereedschap', en: 'Tooling' },
      beats: [
        { nl: 'Vijfde onderwerp: Gereedschap. De snijkant schilt een spaan af.', en: 'Fifth topic: Tooling. The cutting edge peels off a chip.', focus: ['tTool', 'edgeS', 'rack'] },
        { nl: 'De snijkant wordt heet, dus het gereedschap moet hard blijven.', en: 'The edge gets hot, so the tool has to stay hard.', focus: ['heatS', 'rack'] },
        { nl: 'Het gereedschap moet bij het materiaal passen, hier staal.', en: 'The tool has to suit the material, here steel.', focus: ['gradeS', 'rack'] },
        { nl: 'We gebruiken vaak {t:Hardmetaal|hardmetaal} en een {t:Gereedschapshouder|gereedschapshouder}.', en: 'We often use {t:Cemented carbide|cemented carbide} and a {t:Tool holder|tool holder}.', ...TOOL('Hardmetaal', 'Gereedschapshouder'), focus: ['tool1', 'tool2', 'tFace', 'tEnd', 'tCentre', 'tTwist', 'spare', 'holders'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Opspanning en meten', en: 'Workholding and measuring' },
      beats: [
        { nl: 'Zesde onderwerp: Opspanning en meten. Eerst vast, dan meten.', en: 'Sixth topic: Workholding and measuring. First held, then measured.', focus: ['tWork', 'holdS', 'vise'] },
        { nl: 'De opspanning houdt de plaat elke keer op dezelfde plek, stevig vast.', en: 'The workholding keeps the plate in the same place every time, firmly.', focus: ['holdS', 'vise'] },
        { nl: 'Daarna meet je of de plaat klopt met de tekening.', en: 'Then you measure whether the plate matches the drawing.', focus: ['measP', 'plateT', 'sheet'] },
        { nl: 'Bij opspanning en meten gebruiken we vaak een {t:Mal|mal} en een {t:Micrometer|micrometer}.', en: 'For workholding and measuring we often use a {t:Fixture|fixture} and a {t:Micrometer|micrometer}.', ...TOOL('Mal', 'Micrometer'), focus: ['tool1', 'tool2', 'vise', 'mic'] },
      ],
    },
    {
      id: 's8', level: 1, dur: DURS[7], still: 0.9, title: { nl: 'Eén werkplaats', en: 'One workshop' },
      beats: [
        { nl: 'Draaien, frezen en boren snijden. De rest heb je bij elke snede nodig.', en: 'Turning, milling and drilling cut. You need the rest at every cut.', focus: ['cutters', 'support'] },
        { nl: 'De plaat is gemeten en goed. Hij gaat naar hal B.', en: 'The plate is measured and good. It goes to hall B.', focus: ['ship', 'plateT', 'jij'] },
      ],
    },
    {
      id: 's9', level: 1, dur: DURS[8], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: Verspanen is het tweede station van Dingen maken.', en: 'The whole map: Machining is the second station of Making things.', focus: 'map-machining' },
        { nl: 'Verspanen heeft zes onderwerpen, elk met vier niveaus.', en: 'Machining has six topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Draaien, op niveau Basis.', en: 'Start with Turning, at Basics level.', focus: ['tTurn', 'start'] },
        { nl: 'Werkkennis: snijwaarden, gaten op maat, een programma lezen, slijtage en meten.', en: 'Working knowledge: cutting data, holes to size, reading a program, wear and measuring.', focus: 'lv2' },
        { nl: 'Gevorderd: afwerking, freesstrategie, diepe gaten, crashes, standtijd en meetonzekerheid.', en: 'Advanced: finishing, milling strategy, deep holes, crashes, tool life and measurement uncertainty.', focus: 'lv3' },
        { nl: 'Expert: één opspanning, gatpositie, CAM, kosten per stuk en een capabel proces.', en: 'Expert: one setup, hole position, CAM, cost per part and a capable process.', focus: 'lv4' },
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
// on one short sentence naming one or two tools of that topic's lessons, without
// explaining them. Every drawn detail has its reason in the narration: the four holes
// (the product runs through them), the round part (the pipe has to fit), the dimple (a
// drill wanders), the datum (the machine has to know where the plate lies), the vise
// (the same place every time) and the measuring (the holes must stand above the cartons).
const SAY = [
  [ // s1 one plate, six topics
    { nl: 'In de werkplaats van de fabriek ligt een blok staal. Daaruit komt de plaat voor de vuleenheid van lijn 3.',
      en: 'In the workshop of the plant lies a block of steel. The plate for the filling unit of line 3 comes from it.' },
    { nl: 'De tekening vraagt een plaat met vier gaten. Het product loopt erdoor naar de dozen op de band.',
      en: 'The drawing asks for a plate with four holes. The product runs through them into the cartons on the belt.' },
    { nl: 'Verspanen betekent een onderdeel maken door materiaal weg te snijden, in kleine krulletjes. Tot de vorm van de tekening overblijft.',
      en: 'Machining means making a part by cutting away material, in small curls. Until the shape of the drawing is left.' },
    { nl: 'Verspanen heeft zes onderwerpen. We volgen de plaat langs alle zes, van het blok tot de meting.',
      en: 'Machining has six topics. We follow the plate through all six, from the block to the measurement.' },
  ],
  [ // s2 turning
    { nl: 'Het eerste onderwerp is {t:Draaien|Draaien}. De pijp van de tank sluit aan op de plaat met een rond onderdeel. Dat maak je op een draaibank.',
      en: 'The first topic is {t:Turning|Turning}. The pipe of the tank joins the plate with a round part. You make that on a lathe.' },
    { nl: 'Het werkstuk draait en een stilstaande beitel beweegt erlangs. Zo maak je ronde vormen, zoals assen en bussen.',
      en: 'The workpiece turns and a stationary tool moves along it. That makes round shapes, like shafts and bushes.' },
    { nl: 'De diameter moet kloppen. Anders past de pijp niet in de plaat.',
      en: 'The diameter has to be right. Otherwise the pipe does not fit into the plate.' },
    { nl: 'Bij draaien gebruiken we vaak een wisselplaat.',
      en: 'For turning we often use a carbide insert.' },
  ],
  [ // s3 milling
    { nl: 'Het tweede onderwerp is Frezen. Nu draait het gereedschap en ligt het werkstuk vast op de tafel. Zo krijgt de plaat zijn vorm.',
      en: 'The second topic is Milling. Now the tool turns and the workpiece is held on the table. That is how the plate gets its shape.' },
    { nl: 'Eerst maak je de bovenkant vlak, zodat de plaat strak tegen het frame ligt. Dan volgt het gereedschap de omtrek van de tekening.',
      en: 'First you make the top flat, so the plate sits snug against the frame. Then the tool follows the outline of the drawing.' },
    { nl: 'Bij frezen gebruiken we vaak een vlakfrees en een vingerfrees.',
      en: 'For milling we often use a face mill and an end mill.' },
  ],
  [ // s4 drilling
    { nl: 'Het derde onderwerp is Boren. De plaat krijgt vier gaten. Een draaiende boor maakt ze, meestal op dezelfde freesmachine.',
      en: 'The third topic is Drilling. The plate gets four holes. A rotating drill makes them, usually on the same milling machine.' },
    { nl: 'Elk gat moet op zijn plek zitten. Het product moet precies in een doos vallen.',
      en: 'Every hole has to be in its place. The product has to fall exactly into a carton.' },
    { nl: 'Een boor die op een vlak oppervlak begint, glijdt een fractie opzij. Dat heet weglopen. Zet daarom eerst een kuiltje.',
      en: 'A drill that starts on a flat surface slides sideways a little. That is called wander. So make a small dimple first.' },
    { nl: 'Bij boren gebruiken we vaak een centreerboor en een spiraalboor.',
      en: 'For drilling we often use a centre drill and a twist drill.' },
  ],
  [ // s5 CNC
    { nl: 'Het vierde onderwerp is CNC-programma. Een computer stuurt de motoren van de machine aan, volgens een programma.',
      en: 'The fourth topic is CNC programming. A computer drives the motors of the machine, following a program.' },
    { nl: 'Elke regel van het programma is één beweging van het gereedschap. Zo volgt de machine elke keer dezelfde baan.',
      en: 'Every line of the program is one move of the tool. So the machine follows the same path every time.' },
    { nl: 'De machine moet weten waar de plaat op de tafel ligt. Klopt dat niet, dan zitten de gaten ernaast of botst het gereedschap.',
      en: 'The machine has to know where the plate lies on the table. If that is wrong, the holes end up off or the tool crashes.' },
    { nl: 'Bij CNC gebruiken we vaak G-code en een werkstuknulpunt.',
      en: 'For CNC we often use G-code and a work offset.' },
  ],
  [ // s6 tooling
    { nl: 'Het vijfde onderwerp is Gereedschap. De snijkant is een harde, scherpe kant die een spaan van de plaat afschilt.',
      en: 'The fifth topic is Tooling. The cutting edge is a hard, sharp edge that peels a chip off the plate.' },
    { nl: 'Die snijkant wordt erg heet. Daarom moet het gereedschap hard blijven als het heet is.',
      en: 'That edge gets very hot. So the tool has to stay hard when it is hot.' },
    { nl: 'Het gereedschap moet bij het materiaal passen. Voor staal kies je een andere soort dan voor aluminium.',
      en: 'The tool has to suit the material. For steel you choose a different grade than for aluminium.' },
    { nl: 'Bij gereedschap gebruiken we vaak hardmetaal en een gereedschapshouder.',
      en: 'For tooling we often use cemented carbide and a tool holder.' },
  ],
  [ // s7 workholding and measuring
    { nl: 'Het zesde onderwerp is Opspanning en meten. Eerst moet de plaat vaststaan, en daarna meet je of hij klopt.',
      en: 'The sixth topic is Workholding and measuring. First the plate has to be held, and then you measure whether it is right.' },
    { nl: 'De opspanning houdt de plaat elke keer op precies dezelfde plek. Ook houdt hij de plaat stevig tegen de snijkrachten, zonder dat de plaat buigt.',
      en: 'The workholding keeps the plate in exactly the same place every time. It also holds the plate firmly against the cutting forces, without bending it.' },
    { nl: 'Daarna meet je of de plaat klopt met de tekening. Anders staan de gaten niet boven de dozen.',
      en: 'Then you measure whether the plate matches the drawing. Otherwise the holes do not stand above the cartons.' },
    { nl: 'Bij opspanning en meten gebruiken we vaak een mal en een micrometer.',
      en: 'For workholding and measuring we often use a fixture and a micrometer.' },
  ],
  [ // s8 one workshop
    { nl: 'Het hangt samen. Draaien, frezen en boren zijn de manieren van snijden. Programma, gereedschap en opspanning heb je bij elke snede nodig.',
      en: 'It all connects. Turning, milling and drilling are the ways of cutting. You need the program, the tool and the holding at every cut.' },
    { nl: 'De plaat is gemeten en goed. Hij gaat naar hal B, naar de vuleenheid van lijn 3.',
      en: 'The plate is measured and good. It goes to hall B, to the filling unit of line 3.' },
  ],
  [ // s9 the map
    { nl: 'Dit is de hele kaart. Verspanen is het tweede station van Dingen maken.',
      en: 'This is the whole map. Machining is the second station of Making things.' },
    { nl: 'Verspanen heeft zes onderwerpen, elk met vier niveaus.',
      en: 'Machining has six topics, each with four levels.' },
    { nl: 'Begin bij Draaien, op het eerste niveau. Die les laat zien wat verspanen is.',
      en: 'Start with Turning, at the first level. That lesson shows what machining is.' },
    { nl: 'Op het tweede niveau kies je snijwaarden en maak je gaten op maat. Je leest een programma, volgt de slijtage en meet wat eruit komt.',
      en: 'At the second level you choose cutting data and make holes to size. You read a program, follow the wear and measure what comes out.' },
    { nl: 'Op het derde niveau beheers je de afwerking, de freesbaan en diepe gaten. Je begrijpt crashes en rekent met standtijd en meetonzekerheid.',
      en: 'At the third level you master the finish, the milling path and deep holes. You understand crashes and work with tool life and measurement uncertainty.' },
    { nl: 'Op het vierde niveau werk je in één opspanning en bewaak je de gatpositie. Je programmeert met CAM, rekent de kosten per stuk uit en maakt het proces capabel.',
      en: 'At the fourth level you work in one setup and guard the hole position. You program with CAM, work out the cost per part and make the process capable.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="opL"],[data-cue="opM"])';
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
  nl: 'De werkplaats van de fabriek, op mensenmaat. Links een freesmachine met een bankschroef en een plaat, daarnaast een wand met gereedschap in houders; rechts een draaibank met een stang; een besturing met een scherm; een pallet met een blok staal; vooraan een tafel met de tekening van de plaat, de gemeten plaat en een micrometer. Een operator bij de draaibank en een bij de freesmachine, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: de plaat van de vuleenheid van lijn 3 met vier gaten, die uit een blok staal wordt gesneden, en de zes onderwerpen van de module als route, elk met zijn schema: draaien, frezen, boren, het CNC-programma, gereedschap, en opspanning en meten, met per onderwerp de namen van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met Verspanen verlicht, en de zes onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'The workshop of the plant, at person scale. At the left a milling machine with a vise and a plate, next to it a wall with tools in holders; at the right a lathe with a bar; a control with a screen; a pallet with a block of steel; at the front a table with the drawing of the plate, the measured plate and a micrometer. An operator at the lathe and one at the milling machine, and you, the engineer. At the right a panel, marked as an example or a diagram: the plate of the filling unit of line 3 with four holes, cut from a block of steel, and the six topics of the module as a route, each with its diagram: turning, milling, drilling, the CNC program, tooling, and workholding and measuring, with the names of one or two tools per topic. At the end the whole map of Engineering with Machining lit, and the module’s six topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

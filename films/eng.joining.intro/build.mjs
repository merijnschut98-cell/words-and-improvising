// Dev tool, not shipped. Builds the module intro film "Eén frame, zes manieren om te verbinden /
// One frame, six ways of joining" for Lassen en verbinden (eng.joining), the next Engineering
// module intro film (v17, Task 13): the high-over picture at the top of the module, before its six
// topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/eng.joining.intro/build.mjs            build the page
//   node films/eng.joining.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.joining.intro.html: one offline page with the anatomy kit,
// the stage script and the player inlined. The index names it (eng.joining's `intro`), coursehome
// shows it above the topics, sw.js precaches it.
//
// The story: the frame of the filling unit of line 3 (the field film films/eng.field.making: a steel
// frame of two uprights and a beam, welded at the corners, with a plate with four holes hung from the
// beam and a plastic cover on top; without the welding fixture the frame warps) is joined in the plant's
// workshop, at person scale, and every topic of the module has its place in that one job:
//   s1 the frame in loose parts, what joining is (welding melts the edges together, bolts and glue do
//      it without melting) and the map before any detail: six topics follow the frame, in three
//      groups in the module's order: three about welding and what goes wrong in it, two about bolts
//      and glue (joining without melting) and the last about welding in production
//   s2 Booglassen: the corners of the frame are welded; the arc melts the edges, the weld pool sets,
//      the shielding gas keeps the air away; MIG/MAG and TIG                    → eng.joining.arc
//   s3 Puntlassen: a guard of two thin overlapping sheets, joined with spot welds, in front of the lower
//      frame: the product will fall through the plate into the cartons (the field film and the
//      machining intro), so hands stay away from that place; the tip dresser     → .spot
//   s4 Lasfouten en inspectie: a weld can look good outside and hide a gap inside, which grows under
//      load, so the welds are tested; dye penetrant and ultrasonic testing      → .defects (.inspection)
//   s5 Boutverbindingen: the plate hangs from the beam on four bolts, so it can come off for service;
//      a nutrunner                                                              → .bolts (.bolting)
//   s6 Lijmen en mechanisch verbinden: the plastic cover is glued on the steel frame (different
//      materials, no heat, seals out water), rivets and clinching join mechanically; a static mixer
//                                                                               → .bonding (.adhesives)
//   s7 Lassen in productie: for a series a robot welds the corners; the parts have to stay in place or
//      the frame warps (the field film's reason); a welding fixture and a positioner; the frame
//      goes to hall B                                                           → .weldcell (.fixturing)
//   s8 the shared Engineering map (the kit's mapScene) with Welding and joining lit, then the
//      module's six topics with their levels as columns, where to start, and what each later level
//      adds, in the app's level words
// Definitions as the Basis lessons word them (eng.joining.arc, .spot, .defects, .bolts, .bonding,
// .weldcell). Each topic scene names one or two tools of that topic's lessons in one short sentence,
// without explaining them (Merijn's checkpoint, 14 Nov): MIG/MAG and the welding fixture agree with
// the Lassen en verbinden station of the field film; a tool named in a scene is not named again in the
// closing grid. Terms come from the module's lessons and {n:} numbers from the module's text (the kit's
// intro mode, films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a
// caption of its own scene, explained in two beats and lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the people of the cast (you, the
// engineer, and the welder in a work vest, given a welding helmet and gloves), the table, the sheet and
// the room, with pm.agile.scrum's figures for the other worker, given safety glasses and gloves
// (crew below). The frame, the welders, the spot welder and the cell are this film's own simple solids
// (films/eng.joining.intro/workshop.mjs). A panel at the right, in stage space, draws each step as a
// schema, labelled "voorbeeld" (the frame's job) or "schema" (the module's map).
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
// module's topics or levels move): s8 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.joining');
const LEVELS = {
  arc: ['eng.joining.arc', 'eng.joining.weldparams', 'eng.joining.wps', 'eng.joining.metallurgy'],
  spot: ['eng.joining.spot', 'eng.joining.spotwear', 'eng.joining.spotquality', 'eng.joining.spotlobe'],
  defects: ['eng.joining.defects', 'eng.joining.inspection', 'eng.joining.ndt', 'eng.joining.weldrca'],
  bolting: ['eng.joining.bolts', 'eng.joining.bolting', 'eng.joining.tightening', 'eng.joining.jointdesign'],
  bonding: ['eng.joining.bonding', 'eng.joining.adhesives', 'eng.joining.rivets', 'eng.joining.choosejoint'],
  production: ['eng.joining.weldcell', 'eng.joining.fixturing', 'eng.joining.arcon', 'eng.joining.weldsystem'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.joining has the six topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: what joining is: welding melts the edges together (the first lesson), bolts and glue join without melting
has('eng.joining.arc', ['Booglassen verbindt twee metalen delen door de randen samen te smelten']);
has('eng.joining.arc', ['Arc welding joins two metal parts by melting their edges together'], 'en');
has('eng.joining.bonding', ['Ze verbinden verschillende materialen, zoals aluminium aan staal, zonder warmte']);
has('eng.joining.bonding', ['They join different materials, such as aluminium to steel, without heat'], 'en');
// s2: arc welding: the arc melts the edges, the weld pool sets into the weld, the shielding gas keeps the air away; MIG/MAG and TIG
has('eng.joining.arc', ['het smeltbad, dat stolt tot de las', 'Lucht moet weg blijven van het smeltbad', 'stroomt er beschermgas uit de toorts', 'MIG/MAG: een draad', 'TIG: een puntige elektrode van wolfraam']);
has('eng.joining.arc', ['the weld pool, that freezes into the weld', 'Air must stay away from the weld pool', 'a shielding gas flows out of the torch', 'MIG/MAG: a reel of wire', 'TIG: a pointed electrode of tungsten'], 'en');
has('eng.joining.arc', ['MIG/MAG', 'TIG']);
// s3: spot welding: a guard of two overlapping thin sheets joined with spot welds; a weld gun squeezes the sheets between copper electrodes, current, a nugget; the tip dresser (kappenfrees) of the Basis lesson
has('eng.joining.spot', ['Weerstandspuntlassen verbindt twee of drie overlappende stalen platen op losse punten', 'knijpt de platen tussen twee koperen elektroden', 'tot er een laslens ontstaat', 'zwaait de tang naar de kappenfrees, een kleine frees', 'Kappenfrezen']);
has('eng.joining.spot', ['Resistance spot welding joins two or three overlapping steel sheets at single points', 'squeezes the sheets between two copper electrodes', 'until a nugget forms', 'swings to the tip dresser, a small cutter', 'Tip dressing'], 'en');
// s4: defects: a weld can look perfect outside and hide a gap inside that grows under repeated load; dye penetrant and ultrasonic testing (Werkkennis)
has('eng.joining.defects', ['een las kan er van buiten perfect uitzien en binnenin een platte, scheurachtige spleet verbergen', 'Onder herhaalde belasting groeit die uit tot een scheur']);
has('eng.joining.defects', ['a weld can look perfect outside and hide a flat, crack-like gap inside', 'Under repeated load it grows into a crack'], 'en');
has('eng.joining.inspection', ['Penetrantonderzoek', 'Ultrasoon onderzoek', 'Penetrantonderzoek (PT): een rode vloeistof wordt opgespoten', 'Ultrasoon onderzoek (UT): een meetkop']);
has('eng.joining.inspection', ['Dye penetrant', 'Ultrasonic testing', 'Dye penetrant testing (PT): a red liquid is sprayed on', 'Ultrasonic testing (UT): a probe'], 'en');
// s5: bolts: a bolt, a nut and a washer, the property class on the head; the nutrunner of the Werkkennis lesson
has('eng.joining.bolts', ['Een boutverbinding heeft drie delen: de bout met kop en schroefdraad, de moer, en meestal een sluitring', 'Op de kop staat de sterkteklasse']);
has('eng.joining.bolts', ['A bolted joint has three parts: the bolt with its head and thread, the nut, and usually a washer under the nut', 'The head shows the property class'], 'en');
has('eng.joining.bonding', ['Moet uit elkaar voor service: bouten']);
has('eng.joining.bonding', ['Must come apart for service: bolts'], 'en');
has('eng.joining.bolting', ['Schroefspindel', 'schroefspindels (nutrunners)']);
has('eng.joining.bolting', ['Nutrunner', 'nutrunners'], 'en');
// s6: bonding and mechanical joining: structural adhesive joins different materials without heat and seals; rivets and clinching; the static mixer of the Werkkennis lesson
has('eng.joining.bonding', ['Ze dichten ook af tegen water', 'Zelfponsende klinknagels', 'Clinchen: een stempel']);
has('eng.joining.bonding', ['They also seal out water', 'Self-piercing rivets', 'Clinching: a punch'], 'en');
has('eng.joining.adhesives', ['Statische menger', 'Een statische menger, een buisje met schroefvormige elementen']);
has('eng.joining.adhesives', ['Static mixer', 'A static mixer, a small tube with spiral elements'], 'en');
// s7: welding in production: the robot cell, the welding fixture holds every part in the right place, the positioner; without it the frame warps
has('eng.joining.weldcell', ['Een lasrobotcel is een afgeschermde ruimte waarin een robot last', 'Het werkstuk zit in een lasmal: een opspanmal met aanslagen en klemmen die alle delen op de juiste plek houdt', 'Lasmal', 'Positioner']);
has('eng.joining.weldcell', ['A robot welding cell is a guarded space in which a robot welds', 'The workpiece sits in a welding fixture: a jig with stops and clamps that holds every part in the right place', 'Welding fixture', 'Positioner'], 'en');
has('eng.joining.defects', ['Vervorming: warmte zet het metaal uit en afkoelen laat het krimpen, dus delen trekken krom']);
has('eng.joining.defects', ['Distortion: heat expands the metal and cooling shrinks it, so parts bend'], 'en');
// s8: the first Arc welding lesson shows how an arc and a weld pool make a weld (where to start)
has('eng.joining.arc', ['het smeltbad']);
// s8: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.joining.weldparams', 'Lasparameters'], ['eng.joining.spotwear', 'Kappen'], ['eng.joining.inspection', 'Lasinspectie'], ['eng.joining.bolting', 'aanhaalmoment'], ['eng.joining.adhesives', 'Lijmen in productie'], ['eng.joining.fixturing', 'lasvolgorde'],
  ['eng.joining.wps', 'Lassen op papier'], ['eng.joining.spotquality', 'Laspunten controleren'], ['eng.joining.ndt', 'kwaliteitsniveau'], ['eng.joining.tightening', 'Aandraaimethoden'], ['eng.joining.rivets', 'Klinken en clinchen'], ['eng.joining.arcon', 'kosten van een meter las'],
  ['eng.joining.metallurgy', 'Wat warmte met het staal doet'], ['eng.joining.spotlobe', 'Het lasvenster'], ['eng.joining.weldrca', 'Terugkerende lasfouten'], ['eng.joining.jointdesign', 'Boutverbindingen ontwerpen'], ['eng.joining.choosejoint', 'Een verbindingsmethode kiezen'], ['eng.joining.weldsystem', 'Laskwaliteit als systeem']]) has(id, [word]);
// s8: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 290, col: 82, box: 74, tile: 262, top: 64, pitch: 54, h: 50 };
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
// The two other workers: pm.agile.scrum's figures (imported, not copied) without the laptop, in a dark work jacket
// (look sm) or a mid-tone one (look dev), each with safety glasses (a dark band round the head at eye height) and
// work gloves (a dark box at the end of each arm), so they read as people in the workshop and not as office staff.
const crew = (key, look, x, y, along = 'x') => {
  const fig = scrumPerson(w, k, G, P, { x, y, key, look, along });
  const glasses = w.post(x + 0.5, y + 0.5, 11.9, 158, 162.5, { tone: 'lo' }, 28);
  const gloves = [-20.5, 20.5].map((s) => w.box({ x: x + s - 4.4, y: y - 4.4, w: 8.8, d: 8.8, r: 3 }, 86, 96, { tone: 'lo' }, { steps: 2 })).join('');
  if (!fig.endsWith('</g>')) throw new Error('cast: a figure is one group');
  return fig.slice(0, -4) + glasses + gloves + '</g>';
};

const part = shop.parts({ cueG, g });
// painted back to front: the spot welder, the MIG/MAG welder, the platform with the frame, the robot, the
// welder, the people, the table with the tools, the light curtain, you
const world = [
  w.room(ROOM),
  part.back,
  part.mig,
  part.platform,
  part.frame,
  part.robot,
  part.welder(134, 54),
  g('pp-wrk', crew('wrk', 'dev', 158, 86, 'x')),
  part.table,
  part.tools,
  part.curtain,
  g('pp-jij', person('jij', 26, 122, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the six topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Welding
// and joining is a cue group of its own (map-joining).
const TILE = { arc: 'tArc', spot: 'tSpot', defects: 'tDef', bolting: 'tBolt', bonding: 'tGlue', production: 'tProd' };
const PANEL = ['flow', 'melt', 'cutters', 'support', 'chain', 'arcS', 'spotP', 'spotS', 'defS', 'crackS', 'boltP', 'boltS', 'glueP', 'mechS', 'cellS', 'jigS', 'ship',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Welding and joining lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.joining'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.joining');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.joining')}"`), 'the map lights eng.joining as a cue group');
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
  { from: cam(145, 80, 60, 1), to: cam(145, 85, 60, 1.06) }, // s1 the whole workshop: the frame in loose parts
  { from: cam(118, 50, 135, 1.7), to: cam(150, 85, 90, 1.25) }, // s2 the welder at the corner, then the welder set and the table
  { from: cam(75, 60, 60, 1.45), to: cam(200, 70, 95, 1.45) }, // s3 the guard on the frame, then the spot welder and the table
  { from: cam(105, 60, 135, 1.45), to: cam(160, 100, 100, 1.35) }, // s4 the welds, then the table
  { from: cam(80, 66, 125, 1.6), to: cam(140, 100, 100, 1.4) }, // s5 the plate on the beam, then the table
  { from: cam(80, 50, 150, 1.55), to: cam(170, 100, 100, 1.35) }, // s6 the cover on the beam, then the table
  { from: cam(100, 66, 110, 1.3), to: cam(95, 68, 110, 1.25) }, // s7 the cell: robot, jig and curtain
  { from: cam(145, 85, 60, 1), to: cam(145, 85, 60, 1) }, // s8 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(8).fill(30);
const spec = {
  id: 'eng.joining.intro',
  title: { nl: 'Eén frame, zes manieren om te verbinden', en: 'One frame, six ways of joining' },
  module: 'eng.joining',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile 200, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.joining, the scene that explains it and its tile
  topics: {
    arc: { scene: 's2', cue: 'tArc' },
    spot: { scene: 's3', cue: 'tSpot' },
    defects: { scene: 's4', cue: 'tDef' },
    bolting: { scene: 's5', cue: 'tBolt' },
    bonding: { scene: 's6', cue: 'tGlue' },
    production: { scene: 's7', cue: 'tProd' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén frame, zes onderwerpen', en: 'One frame, six topics' },
      beats: [
        { nl: 'In de werkplaats staat het frame van de vuleenheid. Het bestaat nog uit losse delen.', en: 'In the workshop stands the frame of the filling unit. It is still made of loose parts.', focus: ['flow', 'frame', 'jij'] },
        { nl: 'Lassen verbindt delen door de randen samen te smelten. Bouten en lijm doen het zonder smelten.', en: 'Welding joins parts by melting their edges together. Bolts and glue do it without melting.', focus: 'melt' },
        { nl: 'Zes onderwerpen volgen het frame. Drie gaan over lassen en wat daarin misgaat.', en: 'Six topics follow the frame. Three are about welding and what goes wrong in it.', focus: 'cutters' },
        { nl: 'Twee gaan over bouten en lijm, verbinden zonder smelten. De laatste gaat over lassen in productie.', en: 'Two are about bolts and glue, joining without melting. The last is about welding in production.', focus: 'support' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Booglassen', en: 'Arc welding' },
      beats: [
        { nl: 'Eerste onderwerp: Booglassen. De hoeken van het frame gaan aan elkaar.', en: 'First topic: Arc welding. The corners of the frame get joined.', focus: ['tArc', 'chain', 'frame', 'teamlead'] },
        { nl: 'De boog smelt de randen. Het smeltbad stolt tot de las en gas houdt de lucht weg.', en: 'The arc melts the edges. The weld pool sets into the weld and gas keeps the air away.', focus: ['arcS', 'welds', 'arc', 'torch'] },
        { nl: 'Bij booglassen gebruiken we vaak {t:MIG/MAG|MIG/MAG} en {t:TIG|TIG}.', en: 'For arc welding we often use {t:MIG/MAG|MIG/MAG} and {t:TIG|TIG}.', ...TOOL('MIG/MAG', 'TIG'), focus: ['tool1', 'tool2', 'mig', 'tig'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Puntlassen', en: 'Spot welding' },
      beats: [
        { nl: 'Tweede onderwerp: Puntlassen. Een scherm van dun staal houdt handen bij het product weg.', en: 'Second topic: Spot welding. A guard of thin steel keeps hands away from the product.', focus: ['tSpot', 'spotP', 'guard'] },
        { nl: 'Een tang knijpt de platen samen en stuurt er stroom door. Zo smelt een laslens.', en: 'A gun squeezes the sheets together and sends current through. That melts a nugget.', focus: ['spotS', 'tips', 'sheets', 'lens'] },
        { nl: 'Bij puntlassen gebruiken we vaak een {t:Kappenfrezen|kappenfrees}.', en: 'For spot welding we often use a {t:Tip dressing|tip dresser}.', ...TOOL('Kappenfrezen'), focus: ['tool1', 'dresser'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Lasfouten en inspectie', en: 'Weld defects and inspection' },
      beats: [
        { nl: 'Derde onderwerp: Lasfouten en inspectie. De lassen van het frame worden gecontroleerd.', en: 'Third topic: Weld defects and inspection. The welds of the frame are checked.', focus: ['tDef', 'defS', 'welds', 'wrk'] },
        { nl: 'Een las kan er van buiten goed uitzien en binnenin een spleet hebben. Die groeit onder belasting.', en: 'A weld can look good outside and have a gap inside. That gap grows under load.', focus: ['crackS', 'welds'] },
        { nl: 'We testen vaak met {t:Penetrantonderzoek|penetrantonderzoek} en {t:Ultrasoon onderzoek|ultrasoon onderzoek}.', en: 'We often test with {t:Dye penetrant|dye penetrant} and {t:Ultrasonic testing|ultrasonic testing}.', ...TOOL('Penetrantonderzoek', 'Ultrasoon onderzoek'), focus: ['tool1', 'tool2', 'pen', 'ut'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Boutverbindingen', en: 'Bolted joints' },
      beats: [
        { nl: 'Vierde onderwerp: Boutverbindingen. De plaat hangt met vier bouten aan de balk.', en: 'Fourth topic: Bolted joints. The plate hangs from the beam on four bolts.', focus: ['tBolt', 'boltP', 'plate', 'bolts'] },
        { nl: 'Een bout, een moer en een sluitring. De sterkteklasse op de kop zegt hoe sterk hij is.', en: 'A bolt, a nut and a washer. The property class on the head says how strong it is.', focus: ['boltS', 'bolts'] },
        { nl: 'Bij bouten gebruiken we vaak een {t:Schroefspindel|schroefspindel}.', en: 'For bolts we often use a {t:Nutrunner|nutrunner}.', ...TOOL('Schroefspindel'), focus: ['tool1', 'nut'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Lijmen en mechanisch verbinden', en: 'Bonding and mechanical joining' },
      beats: [
        { nl: 'Vijfde onderwerp: Lijmen en mechanisch verbinden. De kunststof kap gaat met lijm op het frame.', en: 'Fifth topic: Bonding and mechanical joining. The plastic cover goes on the frame with glue.', focus: ['tGlue', 'glueP', 'cover', 'bead'] },
        { nl: 'Lijm verbindt kunststof met staal zonder warmte. Klinken en clinchen doen het mechanisch.', en: 'Glue joins plastic to steel without heat. Riveting and clinching do it mechanically.', focus: ['mechS', 'bead', 'cover'] },
        { nl: 'Bij lijmen gebruiken we vaak een {t:Statische menger|statische menger}.', en: 'For bonding we often use a {t:Static mixer|static mixer}.', ...TOOL('Statische menger'), focus: ['tool1', 'mix'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Lassen in productie', en: 'Welding in production' },
      beats: [
        { nl: 'Zesde onderwerp: Lassen in productie. Een robot last de hoeken van elk frame.', en: 'Sixth topic: Welding in production. A robot welds the corners of every frame.', focus: ['tProd', 'cellS', 'robot', 'curtain'] },
        { nl: 'De delen moeten op hun plek blijven. Anders trekt het frame krom.', en: 'The parts have to stay in place. Otherwise the frame warps.', focus: ['jigS', 'frame', 'welds'] },
        { nl: 'Bij productie gebruiken we vaak een {t:Lasmal|lasmal} en een {t:Positioner|positioner}.', en: 'For production we often use a {t:Welding fixture|welding fixture} and a {t:Positioner|positioner}.', ...TOOL('Lasmal', 'Positioner'), focus: ['tool1', 'tool2', 'jig', 'posit'] },
        { nl: 'Het frame is klaar, met plaat, scherm en kap. Het gaat naar hal B.', en: 'The frame is done, with plate, guard and cover. It goes to hall B.', focus: ['ship', 'frame', 'plate', 'guard', 'cover', 'jij'] },
      ],
    },
    {
      id: 's8', level: 1, dur: DURS[7], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: Lassen en verbinden is het vijfde station van Dingen maken.', en: 'The whole map: Welding and joining is the fifth station of Making things.', focus: 'map-joining' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Booglassen, op niveau Basis. Die les laat zien hoe een boog delen aan elkaar smelt.', en: 'Start with Arc welding, at Basics level. That lesson shows how an arc melts parts together.', focus: ['tArc', 'start'] },
        { nl: 'Werkkennis: lasparameters, kappen, inspectie, aanhaalmoment, lijmen in productie en lasvolgorde.', en: 'Working knowledge: weld parameters, tips, inspection, torque, bonding in production and welding sequence.', focus: 'lv2' },
        { nl: 'Gevorderd: lassen op papier, laspunten controleren, kwaliteitsniveau, aandraaien, klinken en laskosten.', en: 'Advanced: welding on paper, checking spot welds, quality level, tightening, riveting and weld cost.', focus: 'lv3' },
        { nl: 'Expert: warmte in staal, lasvenster, terugkerende fouten, bouten ontwerpen, methode kiezen en laskwaliteit.', en: 'Expert: heat in the steel, weld lobe, recurring defects, bolt design, choosing a method and weld quality.', focus: 'lv4' },
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
// explaining them. Every drawn detail has its reason in the narration: the frame
// in loose parts (it has to be joined), the gas (it keeps the air away), the guard
// of thin steel (nobody may reach the holes), the hidden gap (it grows under load,
// so the welds are tested), the four bolts (the plate comes off for service), the
// glue (different materials, no heat, sealing), the jig (the parts stay in place or
// the frame warps) and the light curtain (it stops the robot).
const SAY = [
  [ // s1 one frame, six topics: what joining is, then the six topics in two groups
    { nl: 'In de werkplaats van de fabriek staat het frame van de vuleenheid voor lijn 3. Twee stijlen en een balk, nog los.',
      en: 'In the workshop of the plant stands the frame of the filling unit for line 3. Two uprights and a beam, still loose.' },
    { nl: 'Lassen verbindt metalen delen door de randen samen te smelten. Bouten en lijm doen het zonder smelten.',
      en: 'Welding joins metal parts by melting their edges together. Bolts and glue do it without melting.' },
    { nl: 'Zes onderwerpen volgen het frame. Drie gaan over lassen en wat daarin misgaat.',
      en: 'Six topics follow the frame. Three are about welding and what goes wrong in it.' },
    { nl: 'Twee gaan over bouten en lijm, verbinden zonder smelten. De laatste gaat over lassen in productie.',
      en: 'Two are about bolts and glue, joining without melting. The last is about welding in production.' },
  ],
  [ // s2 arc welding: the corners of the frame (the field film: welded at the corners)
    { nl: 'Het eerste onderwerp is Booglassen. Een lasser last de hoeken van het frame aan elkaar, met een boog.',
      en: 'The first topic is Arc welding. A welder joins the corners of the frame, with an arc.' },
    { nl: 'De boog smelt de randen van de delen. Het {t:Smeltbad|smeltbad} stolt tot de las. Beschermgas houdt de lucht weg.',
      en: 'The arc melts the edges of the parts. The {t:Weld pool|weld pool} sets into the weld. Shielding gas keeps the air away.' },
    { nl: 'Bij booglassen gebruiken we vaak MIG of MAG, en TIG.',
      en: 'For arc welding we often use MIG or MAG, and TIG.' },
  ],
  [ // s3 spot welding: a guard of two overlapping thin sheets
    { nl: 'Het tweede onderwerp is Puntlassen. Het product valt straks door de plaat in de dozen. Een scherm van twee dunne platen houdt daar handen weg.',
      en: 'The second topic is Spot welding. The product will fall through the plate into the cartons. A guard of two thin sheets keeps hands away there.' },
    { nl: 'Een lastang knijpt de platen samen tussen koperen elektroden en stuurt er stroom door. Waar ze elkaar raken smelt een laslens.',
      en: 'A weld gun squeezes the sheets together between copper electrodes and sends current through. Where they touch a nugget melts.' },
    { nl: 'Bij puntlassen gebruiken we vaak een kappenfrees.',
      en: 'For spot welding we often use a tip dresser.' },
  ],
  [ // s4 defects and inspection: the gap that hides inside, the welds of the frame are tested
    { nl: 'Het derde onderwerp is Lasfouten en inspectie. Voordat het frame de eenheid gaat dragen, controleren we de lassen.',
      en: 'The third topic is Weld defects and inspection. Before the frame has to carry the unit, we check the welds.' },
    { nl: 'Een las kan er van buiten perfect uitzien en binnenin een spleet verbergen. Onder belasting groeit die uit tot een scheur.',
      en: 'A weld can look perfect outside and hide a gap inside. Under load it grows into a crack.' },
    { nl: 'Bij lasfouten testen we vaak met penetrantonderzoek en ultrasoon onderzoek.',
      en: 'For weld defects we often test with dye penetrant and ultrasonic testing.' },
  ],
  [ // s5 bolted joints: the plate hangs on four bolts, so it can come off for service
    { nl: 'Het vierde onderwerp is Boutverbindingen. De plaat hangt met vier bouten aan de balk. Zo kan hij voor onderhoud weer los.',
      en: 'The fourth topic is Bolted joints. The plate hangs from the beam on four bolts. That way it can come off again for service.' },
    { nl: 'Een boutverbinding heeft een bout, een moer en een sluitring. De sterkteklasse op de kop zegt hoe sterk de bout is.',
      en: 'A bolted joint has a bolt, a nut and a washer. The property class on the head says how strong the bolt is.' },
    { nl: 'Bij bouten gebruiken we vaak een schroefspindel.',
      en: 'For bolts we often use a nutrunner.' },
  ],
  [ // s6 bonding and mechanical joining: the plastic cover is glued on the steel frame
    { nl: 'Het vijfde onderwerp is Lijmen en mechanisch verbinden. De kunststof kap gaat met lijm op het stalen frame.',
      en: 'The fifth topic is Bonding and mechanical joining. The plastic cover goes on the steel frame with glue.' },
    { nl: 'Lijm verbindt kunststof met staal zonder warmte en dicht af tegen water. Klinken en clinchen verbinden mechanisch.',
      en: 'Glue joins plastic to steel without heat and seals out water. Riveting and clinching join mechanically.' },
    { nl: 'Bij lijmen gebruiken we vaak een statische menger.',
      en: 'For bonding we often use a static mixer.' },
  ],
  [ // s7 welding in production: the robot cell, the parts stay in place (the field film: without it the frame warps)
    { nl: 'Het zesde onderwerp is Lassen in productie. Voor een serie last een robot de hoeken, in een afgeschermde cel.',
      en: 'The sixth topic is Welding in production. For a series a robot welds the corners, in a fenced cell.' },
    { nl: 'De delen moeten op hun plek blijven. Anders trekt het frame krom door de warmte van het lassen.',
      en: 'The parts have to stay in place. Otherwise the heat of welding warps the frame.' },
    { nl: 'Bij productie gebruiken we vaak een lasmal en een positioner.',
      en: 'For production we often use a welding fixture and a positioner.' },
    { nl: 'Het frame is klaar, met plaat, scherm en kap. Het gaat naar hal B, naar lijn 3.',
      en: 'The frame is done, with plate, guard and cover. It goes to hall B, to line 3.' },
  ],
  [ // s8 the map: the level words of the app, as the captions show them
    { nl: 'Dit is de hele kaart. Lassen en verbinden is het vijfde station van Dingen maken.',
      en: 'This is the whole map. Welding and joining is the fifth station of Making things.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Booglassen, op niveau Basis. Die les laat zien hoe een boog delen aan elkaar smelt.',
      en: 'Start with Arc welding, at Basics level. That lesson shows how an arc melts parts together.' },
    { nl: 'Op niveau Werkkennis stel je lasparameters in en onderhoud je de kappen. Je inspecteert lassen, werkt met het aanhaalmoment, lijmt in productie en kiest de lasvolgorde.',
      en: 'At Working knowledge level you set weld parameters and maintain the tips. You inspect welds, work with torque, bond in production and choose the welding sequence.' },
    { nl: 'Op niveau Gevorderd leg je lassen vast op papier en controleer je laspunten. Je kiest het kwaliteitsniveau en de aandraaimethode, plaatst klinknagels en rekent de kosten van een las uit.',
      en: 'At Advanced level you put welds on paper and check spot welds. You choose the quality level and the tightening method, place rivets and work out the cost of a weld.' },
    { nl: 'Op niveau Expert weet je wat warmte met het staal doet en lees je het lasvenster. Je zoekt terugkerende fouten, ontwerpt boutverbindingen, kiest de methode en bewaakt de laskwaliteit.',
      en: 'At Expert level you know what heat does to the steel and read the weld lobe. You look for recurring defects, design bolted joints, choose the method and guard weld quality.' },
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="teamlead"],[data-cue="wrk"])';
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
  nl: 'De werkplaats van de fabriek, op mensenmaat. Links op een werkplatform het frame van de vuleenheid van lijn 3: twee stijlen en een balk, met aan de balk de plaat met vier gaten op vier bouten en bovenop de lichte kunststof kap; rechts ervan een MIG/MAG-lasapparaat met een gasfles, achter in de hoek een puntlasmachine, voor het onderste deel van het frame een scherm van twee dunne platen, vooraan een tafel met het gereedschap per onderwerp en een lichtscherm voor de lascel met een robot en een lasmal. Een lasser met een lashelm en handschoenen, twee werknemers met een veiligheidsbril en handschoenen, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: het frame in losse delen en de zes onderwerpen van de module als route in drie groepen: het lassen met wat daarin misgaat, de verbindingen zonder smelten en de lassen in productie, elk met zijn schema: booglassen, puntlassen, lasfouten en inspectie, boutverbindingen, lijmen en mechanisch verbinden, en lassen in productie, met per onderwerp de namen van een of twee hulpmiddelen, en het frame dat naar hal B gaat. Aan het eind de kaart van Engineering met Lassen en verbinden verlicht, en de zes onderwerpen met hun vier niveaus.',
  en: 'The workshop of the plant, at person scale. At the left on a work platform the frame of the filling unit of line 3: two uprights and a beam, with the plate with four holes on four bolts under the beam and the light plastic cover on top; at its right a MIG/MAG welder with a gas bottle, at the back corner a spot welder, in front of the lower frame a guard of two thin sheets, at the front a table with the tool of each topic and a light curtain for the weld cell with a robot and a welding fixture. A welder in a welding helmet and gloves, two workers in safety glasses and gloves, and you, the engineer. At the right a panel, marked as an example or a diagram: the frame in loose parts and the six topics of the module as a route in three groups: the welding with what goes wrong in it, the joints without melting and welding in production, each with its diagram: arc welding, spot welding, weld defects and inspection, bolted joints, bonding and mechanical joining, and welding in production, with the names of one or two tools per topic, and the frame going to hall B. At the end the map of Engineering with Welding and joining lit, and the six topics with their four levels.',
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

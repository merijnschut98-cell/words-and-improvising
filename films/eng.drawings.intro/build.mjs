// Dev tool, not shipped. Builds the module intro film "Van tekening tot regeling / From drawing to control" for
// Tekeningen en regeling (eng.drawings), an Engineering module intro film (v17, Task 13): the high-over picture at
// the top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/eng.drawings.intro/build.mjs            build the page
//   node films/eng.drawings.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.drawings.intro.html: one offline page with the anatomy kit, the stage script
// and the player inlined. The index names it (eng.drawings' `intro`), coursehome shows it above the topics, sw.js
// precaches it.
//
// The story: the plate of the filling unit of line 3 (the field film films/eng.field.making: a plate with four holes
// that hangs from the beam of the frame on four bolts, under the plastic cover, with the tank behind the frame; its
// Tekeningen en regeling station: frame, plate and tank come together on one drawing, you read its title block and a
// feature control frame, and without it maker and customer measure in their own way) is followed from the drawing to
// the plant, through the module's four topics, in the module's own order, at person scale among office and workshop
// people, and every topic has its place in that one job:
//   s1 the designer draws the filling unit in the office and the maker makes its plate in the workshop; a drawing
//      tells the maker what to make, a control loop keeps the tank level at its target, and the map before any
//      detail: four topics in two groups in the module's order, the drawing for the maker, then the diagram of the
//      plant and the control that keeps it at its value
//   s2 Een technische tekening lezen: the maker was not there and has only the drawing; the plate in views, the
//      dimensions are read and not measured (a print may be shrunk); the title block bottom right, with the revision
//                                                                               → eng.drawings.views (.assembly)
//   s3 Toleranties en GD&T: the four holes must fit the four bolts of the frame; a dimension may differ by its
//      tolerance; the feature control frame names the datums, so maker and customer measure the same way
//                                                                               → .dims (.gdt)
//   s4 P&ID's, schema's en het besturingssysteem: the tank of the unit drawn as a P&ID, what is connected to what and
//      how it is measured and controlled (a level meter and a control valve), the tag number of each instrument; the
//      operator walks along the tank with the drawing, a valve that is not on it is a surprise
//                                                                               → .pid (.plc)
//   s5 Regelkringen en PID: every filling lowers the level; a sensor measures it, the controller compares it with the
//      target and steers the valve; a PID controller is used; the level stays at its value and frame, plate and
//      tank stand together on one drawing (where the field film picks the story up)
//                                                                               → .loop (.pid_control)
//   s6 the shared Engineering map (the kit's mapScene) with Drawings and control lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level words
// Definitions as the Basis lessons word them (eng.drawings.views, .dims, .pid, .loop). Each topic scene names one
// tool of that topic's lessons in one short sentence, without explaining it (Merijn's checkpoint, 14 Nov): the title
// block and the feature control frame are the two tools of the field film's Tekeningen en regeling station (this
// film names one in each of the first two topics), the tag number and the PID controller are this film's own; a tool
// named in a scene is not named again in the closing grid (the Werkkennis grid names the lessons' subjects: assembly
// drawings, GD&T, the PLC, the feel for control). Terms come from the module's lessons and the kit's intro mode
// (films/_kit/build-film.mjs) holds the film to its map (every topic named in a caption of its own scene, explained
// in two beats and lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the people of the cast (you, the engineer), the
// table and the room, with pm.agile.scrum's figures for the designer (as they come), the maker and the operator
// (given safety glasses and gloves, crew below). The drawing table with its sheet, the bench with the plate, the
// tank with its level meter, valve and pump, and the control screen are this film's own simple solids
// (films/eng.drawings.intro/workshop.mjs). A panel at the right, in stage space, draws each step as a schema,
// labelled "voorbeeld" (the plate and the tank) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.drawings');
const LEVELS = {
  draw: ['eng.drawings.views', 'eng.drawings.assembly', 'eng.drawings.callouts', 'eng.drawings.change'],
  tol: ['eng.drawings.dims', 'eng.drawings.gdt', 'eng.drawings.gdtsymbols', 'eng.drawings.gps'],
  schematics: ['eng.drawings.pid', 'eng.drawings.plc', 'eng.drawings.electrical', 'eng.drawings.sis'],
  control: ['eng.drawings.loop', 'eng.drawings.pid_control', 'eng.drawings.tuning', 'eng.drawings.loopaudit'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.drawings has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// the field film (films/eng.field.making) names the Tekeningen en regeling station's tools: this intro names the same two
const FIELD = readFileSync(join(HERE, '../eng.field.making/build.mjs'), 'utf8');
for (const s of ['{t:Stempel|stempel}', '{t:Tolerantiekader|tolerantiekader}', '{t:Title block|title block}', '{t:Feature control frame|feature control frame}', 'Frame, plaat en tank komen samen op één tekening']) assert(FIELD.includes(s), `the field film no longer says ${s}`);
// s1: a drawing says what to make; a control loop keeps a value on its target (the first lessons' words)
has('eng.drawings.views', ['Een onderdeel staat getekend in aanzichten']);
has('eng.drawings.views', ['A part is shown in orthographic views'], 'en');
has('eng.drawings.loop', ['De regelaar (controller) vergelijkt die met het setpoint (SP), de streefwaarde', 'Gesloten regelkring betekent terugkoppeling (feedback): meten, vergelijken, corrigeren']);
has('eng.drawings.loop', ['compares it with the setpoint (SP), the target', 'Closed loop means feedback: measure, compare, correct'], 'en');
// s2: views, dimensions read and not measured, the title block with the revision
has('eng.drawings.views', ['platte plaatjes recht van voren, van boven en van opzij', 'Meet nooit met een liniaal op een print', 'prints worden verkleind', 'De stempel (title block) rechtsonder is waar je begint', 'de revisieletter', 'Een oude print in een plastic hoesje bij de machine wint van elke procedure', 'Stempel Vak rechtsonder']);
has('eng.drawings.views', ['flat, straight-on pictures from the front, top and side', 'Never measure off a print with a ruler', 'prints get shrunk to fit', 'The title block, bottom right, is where you start', 'the revision letter', 'An old print in a plastic sleeve at the machine beats any procedure', 'Title block Box bottom right'], 'en');
// s3: a tolerance is how far a dimension may differ; the feature control frame names the datums; maker and customer measure from different ones
has('eng.drawings.dims', ['Een tolerantie kan op vier manieren staan', 'Symmetrisch: 50 ±0,1']);
has('eng.drawings.dims', ['A tolerance can be written in four ways', 'Symmetric: 50 ±0.1'], 'en');
has('eng.drawings.gdt', ['in een tolerantiekader: een vakje met een symbool, een tolerantie en de referenties', 'leverancier en klant meten vanaf verschillende referenties', 'Tolerantiekader']);
has('eng.drawings.gdt', ['in a feature control frame: a small box with a symbol, a tolerance and the datums it refers to', 'supplier and customer measure from different datums', 'Feature control frame'], 'en');
// s4: a P&ID shows what is connected to what and how it is measured and controlled; tags; circle in a square; the plant that no longer matches
has('eng.drawings.pid', ['Het laat zien wat met wat verbonden is, en hoe het gemeten en geregeld wordt', 'Elk instrument heeft een tagnummer', 'Een los rondje zit in het veld; een rondje in een vierkant staat op het scherm van het DCS', 'Een strikje met een koepeltje erop is een regelklep', 'de P&ID klopt niet meer met de fabriek', 'Een klep die in een weekend is bijgeplaatst', 'Tagnummer']);
has('eng.drawings.pid', ['It shows what is connected to what, and how it is measured and controlled', 'Every instrument has a tag number', 'A plain circle is in the field; a circle in a square is on the screen of the DCS', 'A bowtie with a dome on top is a control valve', 'the P&ID no longer matches the plant', 'A valve added in a weekend', 'Tag number'], 'en');
// s5: a sensor measures, the controller compares with the setpoint, an actuator (a valve) acts; a tank level is the lesson's own example; a PID controller
has('eng.drawings.loop', ['Elke regelkring (control loop) heeft vier delen. Een sensor meet de proceswaarde (PV)', 'Een actuator, het deel dat ingrijpt', 'een tankniveau met een klep']);
has('eng.drawings.loop', ['Every control loop has four parts. A sensor measures the process value (PV)', 'An actuator, the part that acts', 'a tank level with a valve'], 'en');
has('eng.drawings.pid_control', ['Een PID-regelaar combineert drie acties', 'P, I, D']);
has('eng.drawings.pid_control', ['A PID controller combines three actions', 'P, I, D'], 'en');
// s6: where to start: the first Basis lesson
has('eng.drawings.views', ['Een technische tekening lezen']);
// s6: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.drawings.assembly', 'Lijnen, samenstellingstekeningen en de onderdelenlijst'], ['eng.drawings.gdt', 'Toleranties op tekening en GD&T'], ['eng.drawings.plc', 'PLC, HMI, SCADA en veiligheid'], ['eng.drawings.pid_control', 'PID-regeling: het gevoel erachter'],
  ['eng.drawings.callouts', 'Aanduidingen: schroefdraad, gaten, ruwheid en lassen'], ['eng.drawings.gdtsymbols', 'De GD&T-symbolen verdiept: vorm, slag en profiel'], ['eng.drawings.electrical', 'Een elektrisch schema lezen'], ['eng.drawings.tuning', 'Een kring inregelen: staptest en inregelmethodes'],
  ['eng.drawings.change', 'Tekeningbeheer: wijzigingen, ingangsmoment en het 3D-model'], ['eng.drawings.gps', 'ISO tegenover ASME, en tekeninggeschillen beslechten'], ['eng.drawings.sis', 'Beveiligingen en veiligheidsfuncties op de tekening'], ['eng.drawings.loopaudit', 'Kringprestaties: de kringen vinden die geld kosten']]) has(id, [word]);
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
// The designer at the drawing table is the office figure as it comes (the light jumper with a tablet).
const office = (key, look, x, y, along = 'x') => scrumPerson(w, k, G, P, { x, y, key, look, along });
const crew = (key, look, x, y, along = 'x') => {
  const fig = scrumPerson(w, k, G, P, { x, y, key, look, along });
  const glasses = w.post(x + 0.5, y + 0.5, 11.9, 158, 162.5, { tone: 'lo' }, 28);
  const gloves = [-20.5, 20.5].map((s) => w.box({ x: x + s - 4.4, y: y - 4.4, w: 8.8, d: 8.8, r: 3 }, 86, 96, { tone: 'lo' }, { steps: 2 })).join('');
  if (!fig.endsWith('</g>')) throw new Error('cast: a figure is one group');
  return fig.slice(0, -4) + glasses + gloves + '</g>';
};

const part = shop.parts({ cueG, g });
// The operator stands at the tank (OPB) in the third topic, where he walks along it with the drawing; in the fourth he stands
// at the control screen (OPA), a move of OPWALK in stage units (the stage script moves his group by it)
const OPA = [112, 70];
const OPB = [200, 84];
const OPWALK = [0, 1].map((i) => Math.round((w.at([OPB[0], OPB[1], 0])[i] - w.at([OPA[0], OPA[1], 0])[i]) * 10) / 10);
// painted back to front: the tank and the screen, the pipes, the operator, the drawing table with the designer, the bench
// with the maker, you
const world = [
  w.room(ROOM),
  part.back,
  part.pipes,
  g('pp-op', crew('op', 'dev', OPB[0], OPB[1], 'x')),
  part.office,
  g('pp-des', office('des', 'po', 62, 90, 'x')),
  part.bench,
  g('pp-mak', crew('mak', 'sm', 196, 94, 'x')),
  g('pp-jij', person('jij', 140, 160, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Materials and
// strength is a cue group of its own (map-drawings).
const TILE = { draw: 'tDraw', tol: 'tTol', schematics: 'tSch', control: 'tCtl' };
const PANEL = ['flow', 'melt', 'cutters', 'support', 'sA', 'sB', 'ship', 'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Drawings and control lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.drawings'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.drawings');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.drawings')}"`), 'the map lights eng.drawings as a cue group');
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
  { from: cam(145, 85, 70, 1), to: cam(145, 90, 70, 1.06) }, // s1 the whole room: the drawing table, the bench and the tank
  { from: cam(80, 112, 90, 1.3), to: cam(100, 126, 78, 1.6) }, // s2 the drawing table with the designer, then the title block bottom right
  { from: cam(150, 118, 80, 1.3), to: cam(135, 122, 78, 1.45) }, // s3 the plate on the bench and the tolerance frame on the sheet
  { from: cam(190, 55, 90, 1.35), to: cam(215, 60, 82, 1.5) }, // s4 the tank with its instruments and the operator
  { from: cam(170, 50, 95, 1.5), to: cam(150, 90, 75, 1.0) }, // s5 the screen with the trend, the tank and the valve, then the whole room: the plate's drawing and the tank together
  { from: cam(145, 85, 60, 1), to: cam(145, 85, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.drawings.intro',
  title: { nl: 'Van tekening tot regeling', en: 'From drawing to control' },
  module: 'eng.drawings',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile 262, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.drawings, the scene that explains it and its tile
  topics: {
    draw: { scene: 's2', cue: 'tDraw' },
    tol: { scene: 's3', cue: 'tTol' },
    schematics: { scene: 's4', cue: 'tSch' },
    control: { scene: 's5', cue: 'tCtl' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén tekening, vier onderwerpen', en: 'One drawing, four topics' },
      beats: [
        { nl: 'Op kantoor tekent de ontwerper de vuleenheid. In de werkplaats maakt de maker de plaat.', en: 'In the office the designer draws the filling unit. In the workshop the maker makes the plate.', focus: ['flow', 'des', 'mak', 'sheet', 'plate'] },
        { nl: 'Een tekening zegt de maker wat hij moet maken. Een regelkring houdt het tankniveau op zijn streefwaarde.', en: 'A drawing tells the maker what to make. A control loop keeps the tank level at its target.', focus: ['melt', 'tank'] },
        { nl: 'Vier onderwerpen volgen de vuleenheid. De eerste twee gaan over de tekening voor de maker.', en: 'Four topics follow the filling unit. The first two are about the drawing for the maker.', focus: 'cutters' },
        { nl: 'De laatste twee gaan over het schema van de installatie en de regeling die haar op waarde houdt.', en: 'The last two are about the diagram of the plant and the control that keeps it at its value.', focus: 'support' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Een technische tekening lezen', en: 'Reading a technical drawing' },
      beats: [
        { nl: 'Eerste onderwerp: Een technische tekening lezen. De maker heeft alleen de tekening.', en: 'First topic: Reading a technical drawing. The maker has only the drawing.', focus: ['tDraw', 'sA', 'des', 'sheet', 'mak'] },
        { nl: 'De plaat staat getekend in aanzichten. De maker leest de maten en meet niet met een liniaal.', en: 'The plate is drawn in views. The maker reads the dimensions and does not measure with a ruler.', focus: ['sB', 'sheet', 'mak'] },
        { nl: 'We lezen eerst de {t:Stempel|stempel}. Daar staat de revisie.', en: 'We first read the {t:Title block|title block}. It holds the revision.', ...TOOL('Stempel'), focus: ['tool1', 'tblock', 'mak'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Toleranties en GD&T', en: 'Tolerances and GD&T' },
      beats: [
        { nl: 'Tweede onderwerp: Toleranties en GD&T. De vier gaten van de plaat moeten op de bouten passen.', en: 'Second topic: Tolerances and GD&T. The four holes of the plate must fit the bolts.', focus: ['tTol', 'sA', 'plate', 'mak'] },
        { nl: 'Elke maat mag een stukje afwijken, dat is de tolerantie. Staat een gat te ver, dan past de bout niet.', en: 'Every dimension may differ a little, that is the tolerance. A hole too far off and the bolt will not fit.', focus: ['sB', 'plate'] },
        { nl: 'Daarbij lezen we het {t:Tolerantiekader|tolerantiekader}.', en: 'There we read the {t:Feature control frame|feature control frame}.', ...TOOL('Tolerantiekader'), focus: ['tool1', 'tframe', 'mak'] },
        { nl: 'Het zegt vanaf welke referenties je meet. Zo meten maker en klant op dezelfde manier.', en: 'It says which datums you measure from. So maker and customer measure the same way.', focus: ['ship', 'tframe', 'plate'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'P&ID’s, schema’s en het besturingssysteem', en: 'P&IDs, schematics and the control system' },
      beats: [
        { nl: 'Derde onderwerp: P&ID’s, schema’s en het besturingssysteem. Zo is de tank getekend.', en: 'Third topic: P&IDs, schematics and the control system. This is how the tank is drawn.', focus: ['tSch', 'sA', 'tank', 'pump'] },
        { nl: 'Een P&ID laat zien wat met wat verbonden is en hoe het gemeten en geregeld wordt.', en: 'A P&ID shows what is connected to what and how it is measured and controlled.', focus: ['sB', 'lt', 'valve'] },
        { nl: 'Daarbij lezen we het {t:Tagnummer|tagnummer} van elk instrument.', en: 'There we read the {t:Tag number|tag number} of every instrument.', ...TOOL('Tagnummer'), focus: ['tool1', 'lt', 'valve'] },
        { nl: 'De operator loopt langs de tank met de tekening. Een klep die er niet op staat, is een verrassing.', en: 'The operator walks along the tank with the drawing. A valve that is not on it is a surprise.', focus: ['ship', 'op', 'valve'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Regelkringen en PID', en: 'Control loops and PID' },
      beats: [
        { nl: 'Vierde onderwerp: Regelkringen en PID. Bij elke vulling zakt het niveau in de tank.', en: 'Fourth topic: Control loops and PID. With every filling the level in the tank drops.', focus: ['tCtl', 'sA', 'tank', 'screen'] },
        { nl: 'Een sensor meet het niveau. De regelaar vergelijkt het met de streefwaarde en stuurt de klep.', en: 'A sensor measures the level. The controller compares it with the target and steers the valve.', focus: ['sB', 'lt', 'screen', 'valve'] },
        { nl: 'We gebruiken vaak een {t:P, I, D|PID-regelaar}.', en: 'We often use a {t:P, I, D|PID controller}.', ...TOOL('P, I, D'), focus: ['tool1', 'screen', 'op'] },
        { nl: 'Het niveau blijft op zijn waarde. Frame, plaat en tank staan nu samen op één tekening.', en: 'The level stays at its value. Frame, plate and tank now stand together on one drawing.', focus: ['ship', 'tank', 'sheet'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: Tekeningen en regeling is het vierde station van Dingen maken.', en: 'The whole map: Drawings and control is the fourth station of Making things.', focus: mapCue('eng.drawings') },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Een technische tekening lezen, op niveau Basis. Die les laat zien waar je op een tekening begint.', en: 'Start with Reading a technical drawing, at Basics level. That lesson shows where to begin on a drawing.', focus: ['tDraw', 'start'] },
        { nl: 'Op niveau Werkkennis: samenstellingstekeningen, GD&T, de PLC en het gevoel achter regelen.', en: 'At Working knowledge level: assembly drawings, GD&T, the PLC and the feel for control.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd: schroefdraad en ruwheid, vormtoleranties, elektrische schema’s en inregelen.', en: 'At Advanced level: threads and roughness, form tolerances, electrical diagrams and tuning a loop.', focus: 'lv3' },
        { nl: 'Op niveau Expert: tekeningbeheer, tekeninggeschillen, beveiligingen en kringprestaties.', en: 'At Expert level: drawing control, drawing disputes, protection functions and loop performance.', focus: 'lv4' },
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
// on one short sentence naming one tool of that topic's lessons, without
// explaining it. Every drawn detail has its reason in the narration: the drawing
// of the plate (the maker was not there), the views and the dimensions (a print
// may be shrunk), the title block (the revision), the four holes (the four bolts
// of the frame), the tolerance frame (the datums), the P&ID of the tank, its tag
// numbers and the operator's walk with the drawing (a valve that is not on it),
// the level meter, the valve and the screen (the loop that keeps the level).
const SAY = [
  [ // s1 one drawing, four topics: the designer and the maker, a drawing and a loop, then the four topics in two groups
    { nl: 'Op kantoor tekent de ontwerper de vuleenheid voor lijn 3. In de werkplaats maakt de maker de plaat ervan.',
      en: 'In the office the designer draws the filling unit for line 3. In the workshop the maker makes its plate.' },
    { nl: 'Een tekening zegt de maker wat hij moet maken en hoe nauw. Een regelkring houdt het niveau in de tank op zijn streefwaarde.',
      en: 'A drawing tells the maker what to make and how exact. A control loop keeps the level in the tank at its target.' },
    { nl: 'Vier onderwerpen volgen de vuleenheid. De eerste twee gaan over de tekening voor de maker.',
      en: 'Four topics follow the filling unit. The first two are about the drawing for the maker.' },
    { nl: 'De laatste twee gaan over het schema van de installatie en de regeling die haar op waarde houdt.',
      en: 'The last two are about the diagram of the plant and the control that keeps it at its value.' },
  ],
  [ // s2 reading a drawing: the maker was not there, views and dimensions, the title block
    { nl: 'Het eerste onderwerp is Een technische tekening lezen. De maker was er niet bij en heeft alleen de tekening.',
      en: 'The first topic is Reading a technical drawing. The maker was not there and has only the drawing.' },
    { nl: 'De plaat staat getekend in aanzichten, van voren, van boven en van opzij. De maker leest de maten, want een print kan verkleind zijn.',
      en: 'The plate is drawn in views, from the front, from above and from the side. The maker reads the dimensions, because a print may be shrunk.' },
    { nl: 'Daarbij lezen we eerst de stempel rechtsonder, want daar staat de revisie van de tekening.',
      en: 'There we first read the title block at the bottom right, because it holds the revision of the drawing.' },
  ],
  [ // s3 tolerances: the four holes on the four bolts of the frame, a tolerance, the tolerance frame with its datums
    { nl: 'Het tweede onderwerp is Toleranties en GD en T. De vier gaten van de plaat moeten op de vier bouten van het frame passen.',
      en: 'The second topic is Tolerances and G D and T. The four holes of the plate must fit the four bolts of the frame.' },
    { nl: 'Elke maat mag een klein stukje afwijken, en dat stukje is de tolerantie. Staat een gat te ver weg, dan past de bout niet.',
      en: 'Every dimension may differ a little, and that little is the tolerance. If a hole is too far off, the bolt will not fit.' },
    { nl: 'Daarbij lezen we het tolerantiekader.',
      en: 'There we read the feature control frame.' },
    { nl: 'Het zegt vanaf welke {t:Referentievlak|referenties} de maker meet. Zo meten de maker en de klant op dezelfde manier.',
      en: 'It says which {t:Datum|datums} the maker measures from. So the maker and the customer measure the same way.' },
  ],
  [ // s4 the P&ID of the tank: what is connected, how it is measured and controlled, the tags, the walk along the plant
    { nl: 'Het derde onderwerp is P en I D’s, schema’s en het besturingssysteem. De tank levert het product aan de vuleenheid.',
      en: 'The third topic is P and I Ds, schematics and the control system. The tank supplies the product for the filling unit.' },
    { nl: 'Een P en I D laat zien wat met wat verbonden is, en hoe het gemeten en geregeld wordt. Bij de tank is dat een niveaumeter en een regelklep.',
      en: 'A P and I D shows what is connected to what, and how it is measured and controlled. At the tank that is a level meter and a control valve.' },
    { nl: 'Daarbij lezen we het tagnummer van elk instrument.',
      en: 'There we read the tag number of every instrument.' },
    { nl: 'De operator loopt langs de tank met de tekening. Een klep die er niet op staat, is een verrassing.',
      en: 'The operator walks along the tank with the drawing. A valve that is not on it is a surprise.' },
  ],
  [ // s5 the loop of the tank level: every filling lowers it, a sensor, a controller and a valve keep it at its target
    { nl: 'Het vierde onderwerp is Regelkringen en PID. Bij elke vulling zakt het niveau in de tank, maar het moet op zijn waarde blijven.',
      en: 'The fourth topic is Control loops and PID. With every filling the level in the tank drops, but it has to stay at its value.' },
    { nl: 'Een sensor meet het niveau. De regelaar vergelijkt het met de streefwaarde en stuurt de klep open of dicht.',
      en: 'A sensor measures the level. The controller compares it with the target and opens or closes the valve.' },
    { nl: 'Daarbij gebruiken we vaak een PID-regelaar.',
      en: 'There we often use a PID controller.' },
    { nl: 'Het niveau blijft op zijn waarde. Nu kunnen de makers verder, want frame, plaat en tank staan samen op één tekening.',
      en: 'The level stays at its value. Now the makers can go on, because frame, plate and tank are together on one drawing.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'Dit is de hele kaart. Tekeningen en regeling is het vierde station van Dingen maken.',
      en: 'This is the whole map. Drawings and control is the fourth station of Making things.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Een technische tekening lezen, op niveau Basis. Die les laat zien waar je op een tekening begint.',
      en: 'Start with Reading a technical drawing, at Basics level. That lesson shows where to begin on a drawing.' },
    { nl: 'Op niveau Werkkennis gaat het over samenstellingstekeningen, GD en T, de PLC en het gevoel achter regelen.',
      en: 'At Working knowledge level it is about assembly drawings, G D and T, the PLC and the feel for control.' },
    { nl: 'Op niveau Gevorderd gaat het over schroefdraad en ruwheid, vormtoleranties, elektrische schema’s en inregelen.',
      en: 'At Advanced level it is about threads and roughness, form tolerances, electrical diagrams and tuning a loop.' },
    { nl: 'Op niveau Expert gaat het over tekeningbeheer, tekeninggeschillen, beveiligingen en kringprestaties.',
      en: 'At Expert level it is about drawing control, drawing disputes, protection functions and loop performance.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst OPWALK = ${JSON.stringify(OPWALK)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="des"],[data-cue="mak"],[data-cue="op"])';
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
.pm-pipe{fill:none;stroke:var(--anatomy-hi);stroke-width:3.4;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
.pm-hole{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.6}
.pm-chip{fill:var(--anatomy-hi);stroke:none}
.pm-heat{fill:none;stroke:#C2553F;stroke-width:2;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-pipe{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-hole){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-chip{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');


const label = {
  nl: 'Een kantoorhoek, een werkbank en de tank van de fabriek, op mensenmaat. Links vooraan een tekentafel met de tekening van de plaat: het vooraanzicht met vier gaten, een zijaanzicht, een tolerantiekader bij een gat en rechtsonder de stempel; vooraan rechts een werkbank met de plaat zelf; achterin rechts de tank van de vuleenheid met een niveaumeter bovenop, een regelklep in de toevoerleiding en een afvoerleiding met een pomp naar de eenheid; op de achterwand een besturingsscherm met het niveau en de streefwaarde. Een ontwerper aan de tekentafel, een maker met een veiligheidsbril en handschoenen, een operator met een veiligheidsbril, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: de tekening voor de maker, de aanzichten van de plaat, de maat met zijn tolerantie, de P&ID van de tank, de regelkring van het niveau en de vier onderwerpen van de module; aan het eind de kaart van Engineering met Tekeningen en regeling verlicht en de vier onderwerpen met hun niveaus.',
  en: 'An office corner, a workbench and the tank of the plant, at person scale. At the front left a drawing table with the drawing of the plate: the front view with four holes, a side view, a feature control frame at a hole and the title block bottom right; at the front right a workbench with the plate itself; at the back right the tank of the filling unit with a level meter on top, a control valve in the inlet pipe and an outlet pipe with a pump to the unit; on the back wall a control screen with the level and the target. A designer at the drawing table, a maker in safety glasses and gloves, an operator in safety glasses, and you, the engineer. At the right a panel, marked as an example or a diagram: the drawing for the maker, the views of the plate, a dimension with its tolerance, the P&ID of the tank, the control loop of the level and the four topics of the module; at the end the map of Engineering with Drawings and control lit and the four topics with their levels.',
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

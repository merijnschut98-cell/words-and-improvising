// Dev tool, not shipped. Builds the module intro film "Elke doos goed / Every carton good" for Quality basics (eng.quality),
// an Engineering module intro film (v17, Task 13) and the second intro of the zone "De fabriek draaiend houden"
// (eng.field.run): the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved
// intros films/eng.flow.intro (the zone's first intro and its review fixes: labels only when named, the same room
// coordinates as the field film), eng.lines.intro and eng.industry40.intro (one clear tool per topic, as short as the content
// allows, nothing labelled before it is named, no SAY rule that is not needed) and the notes section "Engineering module intros".
//
//   node films/eng.quality.intro/build.mjs            build the page
//   node films/eng.quality.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.quality.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.quality's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.run ("Een dienst op lijn 3": the filling unit stands over the belt of
// line 3, you and the team lead keep it going for a whole shift; its station Kwaliteit says every carton that leaves the line
// must be good, that at the end of the belt a check table with a check sheet and a marked quarantine place wait, that a bad
// carton is set apart, and that the tools are the check sheet and the nonconformance report). This film follows HOW LINE 3
// KEEPS EVERY CARTON GOOD THROUGH A SHIFT, topic by topic, in the room of the field film: the belt with its cartons, the filling
// unit over it, the check table at the end of the belt (at the sentence that names the check sheet), the marked quarantine place
// on the floor in front of it (at the sentence that sets a bad carton apart), you and the team lead at the front. The tolerance,
// the spread, the control chart and the report are schemas in the panel; the field film's room has no scale, no gauge and no
// chart, so none is drawn there.
//   s1 every carton that leaves line 3 must be good; the module is about how engineers talk about good parts (the module's
//      blurb); you and the team lead keep every carton good for a shift; the map before any detail: four topics in two groups
//      (what is good and how you measure it, with tolerances and with variation and capability; watching the process and
//      catching a fault, with SPC and with risk and control)
//   s2 Toleranties en meten: the tolerance is how far a part may deviate and still work (Basis, .tolerance); the spec limits are
//      the edges of what the customer accepts, outside them a part is nonconforming (Basis, .tolerance); the tool is the caliper
//      (schuifmaat, Werkkennis, .gauges: the gauge is chosen to suit the tolerance), drawn as a schema in the panel
//   s3 Spreiding en procesgeschiktheid: no two parts are identical, the spread (Basis, .variation); capability says whether a
//      process can stay inside the tolerance (Werkkennis, .capability); the topic has no real tool at Basis or Werkkennis, so
//      the most tool-like term is the Cpk (Werkkennis, .capability: the index worked out from the spread and the nearest limit)
//   s4 SPC en regelkaarten: SPC is watching a running process so you see a change before it makes bad parts (Werkkennis, .spc);
//      a control chart plots measurements over time with a centre line and two control limits (Werkkennis, .spc); the tool is
//      the check sheet (turflijst, Basis, .datatools), the field film's own tool, kept on the check table at the end of the belt
//   s5 Risico en beheersing: a nonconforming part must first stop moving (Basis, .nonconform); quarantine sets it aside and marks
//      it (Basis, .nonconform), the marked place on the floor; the tool is the nonconformance report (afwijkingsrapport, Basis,
//      .nonconform), the field film's other tool. The story ends here: you and the team lead keep every carton good all shift
//   s6 the shared Engineering map (the kit's mapScene) with Quality lit, then the module's four topics with their levels as
//      columns, where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40, gridplanning and flow intros: one clear tool per topic; drop what is not needed;
// nothing labelled before it is named; a Werkkennis tool named in a scene (caliper, Cpk) is not named again in the closing grid;
// the tools of no other intro are repeated (no other intro names one of these). The second topic has no real tool at Basis or
// Werkkennis (reported). FMEA is not named in the voice (espeak-ng reads it "fmeea", with no vowel for f and m); the closing grid
// says what it is for ("de risico's vóór de start").
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
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import engMap from '../../src/content/courses/maps/eng.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the module
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.quality');
const LEVELS = {
  tolerances: ['eng.quality.tolerance', 'eng.quality.gauges', 'eng.quality.gdt', 'eng.quality.stackup'],
  capability: ['eng.quality.variation', 'eng.quality.capability', 'eng.quality.capstudy', 'eng.quality.sigma'],
  spc: ['eng.quality.datatools', 'eng.quality.spc', 'eng.quality.chartchoice', 'eng.quality.spcpractice'],
  risk: ['eng.quality.nonconform', 'eng.quality.fmea', 'eng.quality.controlplan', 'eng.quality.eightd'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.quality has the four topics and levels this film draws');
assert(MOD.intro === 'eng.quality.intro', 'eng.quality names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb
assert(MOD.blurb.nl.includes('hoe engineers over goede onderdelen praten'), 'the module blurb (nl) says how engineers talk about good parts');
assert(MOD.blurb.en.includes('how engineers talk about good parts'), 'the module blurb (en) says how engineers talk about good parts');
// s2: the tolerance, the spec limits, a part outside them; the caliper is chosen to suit the tolerance
has('eng.quality.tolerance', ['De tolerantie is hoeveel een onderdeel mag afwijken en nog steeds werkt', 'De twee specgrenzen zijn de randen van wat de klant accepteert', 'Een onderdeel buiten de grenzen is afwijkend']);
has('eng.quality.tolerance', ['Tolerance is how far a part may deviate and still work', 'The two spec limits are the edges of what the customer accepts', 'A part outside the limits is nonconforming'], 'en');
has('eng.quality.gauges', ['het meetmiddel (gauge) kies je bij de tolerantie', 'De schuifmaat (caliper) is het zakmes van de werkplaats']);
has('eng.quality.gauges', ['you choose the gauge to suit the tolerance', 'The caliper is the pocket knife of the shop floor'], 'en');
// s3: no two parts are identical; capability compares the spread with the tolerance; the Cpk adds the centring
has('eng.quality.variation', ['Geen twee onderdelen zijn gelijk', 'Engineers beschrijven die spreiding (variation)']);
has('eng.quality.variation', ['No two parts are identical', 'Engineers describe that variation'], 'en');
has('eng.quality.capability', ['Procesgeschiktheid (capability) zegt of een proces binnen de tolerantie kan blijven', 'je vergelijkt de spreiding van het proces met de breedte van de tolerantie', 'Cpk telt het centreren mee: de afstand van het gemiddelde tot de dichtstbijzijnde specgrens']);
has('eng.quality.capability', ['Capability says whether a process can stay inside the tolerance', 'it compares the spread of the process with the width of the tolerance', 'Cpk adds the centring: the distance from the mean to the nearest spec limit'], 'en');
// s4: SPC watches a running process; the control chart; the check sheet
has('eng.quality.spc', ['betekent een proces met eenvoudige statistiek in de gaten houden terwijl het draait, zodat je een verandering ziet voordat er slechte delen van komen', 'een meting uitgezet in de tijd, met een middellijn en twee regelgrenzen']);
has('eng.quality.spc', ['means watching a process with simple statistics while it runs, so you see a change before it makes bad parts', 'a measurement plotted over time, with a centre line and two control limits'], 'en');
has('eng.quality.datatools', ['De turflijst (check sheet) is de eenvoudigste: een formulier naast de machine waarop de operator met een streepje noteert welke fout hij ziet']);
has('eng.quality.datatools', ['The check sheet is the simplest: a form next to the machine on which the operator makes a tally mark for each defect he sees'], 'en');
// s5: a nonconforming part stops moving; quarantine; the nonconformance report
has('eng.quality.nonconform', ['Een afwijkend deel dat ontdekt is, moet eerst stoppen met bewegen', 'Quarantaine (quarantine) betekent: apart zetten en duidelijk markeren', 'Alles komt in een afwijkingsrapport (nonconformance report, NCR): wat, hoeveel']);
has('eng.quality.nonconform', ['A nonconforming part that has been found must first stop moving', 'Quarantine means setting it aside and marking it clearly', 'Everything goes into a nonconformance report (NCR): what, how many'], 'en');
// s6: the first lesson names the nominal, the tolerance and the spec limits (where to start); the later levels, as the lessons are titled
for (const [id, word] of [['eng.quality.tolerance', 'Nominale maat, tolerantie en specgrenzen'], ['eng.quality.gauges', 'kalibratie'], ['eng.quality.fmea', 'risico’s vóór de start'],
  ['eng.quality.spc', 'Regelkaarten (SPC)'], ['eng.quality.gdt', 'Vorm- en plaatstoleranties'], ['eng.quality.capstudy', 'capability-studie'], ['eng.quality.chartchoice', 'De juiste kaart'],
  ['eng.quality.controlplan', 'Control plan'], ['eng.quality.stackup', 'Tolerantiestapeling'], ['eng.quality.sigma', 'Sigma-niveau'], ['eng.quality.spcpractice', 'loos alarm'], ['eng.quality.eightd', 'de echte oorzaak']]) has(id, [word]);
for (const [id, word] of [['eng.quality.tolerance', 'Nominal, tolerance and spec limits'], ['eng.quality.gauges', 'calibration'], ['eng.quality.fmea', 'risk before launch'],
  ['eng.quality.spc', 'Control charts (SPC)'], ['eng.quality.gdt', 'Geometric tolerancing'], ['eng.quality.capstudy', 'capability study'], ['eng.quality.chartchoice', 'The right chart'],
  ['eng.quality.controlplan', 'Control plan'], ['eng.quality.stackup', 'Tolerance stack-up'], ['eng.quality.sigma', 'Sigma level'], ['eng.quality.spcpractice', 'false alarms'], ['eng.quality.eightd', 'the real cause']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));

// the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from GRID.x; the words
// stand on one line each, staggered over two rows, so a word may be wider than its column but not wider than the room to
// the next word on its row, nor run off the stage. Four rows of GRID.pitch.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 276, col: 90, box: 82, tile: 252, top: 76, pitch: 74, h: 62 };
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
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the run field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the table with the check sheet at the end of
// the belt and the marked quarantine place on the floor in front of it with two cartons in it, you and the team lead at the
// front. Without the field film's tank, stop board, CILT board, laptop and isolator: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const QT = { x: 262, y: 58, w: 26, d: 44, h: 70 }; // the table with the check sheet at the end of the belt
const QZ = { x: 196, y: 84, w: 52, d: 56 }; // the marked quarantine place on the floor, in front of the belt
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the check table at the end of the belt with the check sheet on it (a sheet with rules)
const checkSheet = w.sheet({ x: QT.x + 6, y: QT.y + 6, z: QT.h, w: 14, d: 22, lines: 4 }).svg;
const checkTable = w.table(QT) + checkSheet;
// the quarantine place: the marked floor with two cartons in it, one on the other
const quarantine = hall.floorMark(QZ)
  + w.box({ x: QZ.x + 15, y: QZ.y + 20, w: 20, d: 18, r: 1 }, 0.4, 20.4, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: QZ.x + 16, y: QZ.y + 20, w: 20, d: 18, r: 1 }, 20.4, 40.4, { tone: 'hi' }, { steps: 1 });

// painted back to front: the belt and the unit, the check table (shown from the sentence that names the check sheet noted on it),
// the quarantine place (from the sentence that sets a bad carton apart), you and the team lead (from the sentence that names you)
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-sheet', cueG('checksheet', checkTable)),
  g('o-quar', cueG('quarantine', quarantine)),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Quality is a cue group of its own (map-quality).
const TILE = { tolerances: 'tTol', capability: 'tVar', spc: 'tSpc', risk: 'tRisk' };
const PANEL = ['goodS', 'askS', 'shiftS', 'grpA', 'grpB', 'tolS', 'limS', 'calS', 'varS', 'capS', 'cpkS', 'spcS', 'chartS', 'sheetS', 'badS', 'quaS', 'ncrS', 'endS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.quality'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.quality');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.quality')}"`), 'the map lights eng.quality as a cue group');
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
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.07) }, // s1 the whole hall: the unit on line 3, you and the team lead
  { from: cam(150, 40, 70, 1.15), to: cam(150, 40, 70, 1.25) }, // s2 the belt and the unit: a carton and its tolerance
  { from: cam(150, 40, 70, 1.25), to: cam(150, 40, 70, 1.35) }, // s3 the belt and the unit: no two cartons alike
  { from: cam(245, 90, 40, 1.25), to: cam(245, 90, 40, 1.38) }, // s4 the end of the belt: the check table
  { from: cam(235, 90, 40, 1.15), to: cam(235, 90, 40, 1.28) }, // s5 the end of the belt: the check table and the quarantine place
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.quality.intro',
  title: { nl: 'Elke doos goed', en: 'Every carton good' },
  module: 'eng.quality',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.quality, the scene that explains it and its tile
  topics: {
    tolerances: { scene: 's2', cue: 'tTol' },
    capability: { scene: 's3', cue: 'tVar' },
    spc: { scene: 's4', cue: 'tSpc' },
    risk: { scene: 's5', cue: 'tRisk' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Elke doos goed', en: 'Every carton good' },
      beats: [
        { nl: 'Elke doos die lijn 3 verlaat, moet goed zijn.', en: 'Every carton that leaves line 3 must be good.', focus: ['goodS', 'line3', 'unit'] },
        { nl: 'De module Kwaliteit gaat over hoe engineers over goede onderdelen praten.', en: 'The module Quality is about how engineers talk about good parts.', focus: ['askS', 'line3'] },
        { nl: 'Jij bent de engineer. Met de teamleider houd je een hele dienst elke doos goed.', en: 'You are the engineer. With the team lead you keep every carton good for a whole shift.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst wat goed is en hoe je dat meet, met toleranties en meten en met spreiding en procesgeschiktheid.', en: 'First what is good and how you measure it, with tolerances and measuring and with variation and capability.', focus: 'grpA' },
        { nl: 'Dan het proces bewaken en een fout opvangen, met SPC en regelkaarten en met risico en beheersing.', en: 'Then watching the process and catching a fault, with SPC and control charts and with risk and control.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Toleranties en meten', en: 'Tolerances and measuring' },
      beats: [
        { nl: 'Het eerste onderwerp is Toleranties en meten. De tolerantie is hoeveel een maat mag afwijken en nog werkt.', en: 'The first topic is Tolerances and measuring. The tolerance is how far a dimension may deviate and still work.', focus: ['tTol', 'tolS', 'line3', 'unit'] },
        { nl: 'De specgrenzen zijn de randen van wat de klant accepteert. Daarbuiten is een doos afwijkend.', en: 'The spec limits are the edges of what the customer accepts. Outside them a carton is nonconforming.', focus: ['limS', 'line3'] },
        { nl: 'Je meet de maat met een {t:Schuifmaat|schuifmaat}.', en: 'You measure the dimension with a {t:Caliper|caliper}.', ...TOOL('Schuifmaat'), focus: ['tool1', 'calS'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Spreiding en procesgeschiktheid', en: 'Variation and capability' },
      beats: [
        { nl: 'Het tweede onderwerp is Spreiding en procesgeschiktheid. Geen twee dozen zijn precies gelijk.', en: 'The second topic is Variation and capability. No two cartons are exactly alike.', focus: ['tVar', 'varS', 'line3', 'unit'] },
        { nl: 'Procesgeschiktheid zegt of lijn 3 binnen de tolerantie kan blijven.', en: 'Capability says whether line 3 can stay within the tolerance.', focus: ['capS', 'line3'] },
        { nl: 'Je rekent het uit met de {t:Cpk|Cpk}.', en: 'You work it out with the {t:Cpk|Cpk}.', ...TOOL('Cpk'), focus: ['tool1', 'cpkS'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'SPC en regelkaarten', en: 'SPC and control charts' },
      beats: [
        { nl: 'Het derde onderwerp is SPC en regelkaarten. Je ziet een verandering voordat er foute dozen komen.', en: 'The third topic is SPC and control charts. You see a change before bad cartons appear.', focus: ['tSpc', 'spcS', 'line3'] },
        { nl: 'Een regelkaart zet metingen uit in de tijd, met een middellijn en twee regelgrenzen.', en: 'A control chart plots measurements over time, with a centre line and two control limits.', focus: ['chartS', 'line3'] },
        { nl: 'Aan het eind van de band noteer je fouten op een {t:Turflijst|turflijst}.', en: 'At the end of the belt you note faults on a {t:Check sheet|check sheet}.', ...TOOL('Turflijst'), focus: ['tool1', 'sheetS', 'checksheet'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Risico en beheersing', en: 'Risk and control' },
      beats: [
        { nl: 'Het vierde onderwerp is Risico en beheersing. Het begint bij een foute doos, die moet stoppen met bewegen.', en: 'The fourth topic is Risk and control. It starts with a bad carton, which must stop moving.', focus: ['tRisk', 'badS', 'line3'] },
        { nl: 'Je zet hem apart op een gemarkeerde plek. Dat heet quarantaine.', en: 'You set it aside in a marked place. That is called quarantine.', focus: ['quaS', 'quarantine'] },
        { nl: 'Wat er mis is, schrijf je in een {t:Afwijkingsrapport|afwijkingsrapport}.', en: 'What is wrong you write in a {t:Nonconformance report|nonconformance report}.', ...TOOL('Afwijkingsrapport'), focus: ['tool1', 'ncrS', 'quarantine'] },
        { nl: 'Zo houden jij en de teamleider elke doos goed, de hele dienst.', en: 'That is how you and the team lead keep every carton good, all shift.', focus: ['endS', 'jij', 'teamlead'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het tweede station is Kwaliteit, in De fabriek draaiend houden.', en: 'The whole map. The second station is Quality, in Keeping the plant running.', focus: 'map-quality' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met nominale maat, tolerantie en specgrenzen. Die grenzen zijn de maat voor de rest.', en: 'Start at Basics level with nominal size, tolerance and spec limits. They are the yardstick for the rest.', focus: ['tTol', 'start'] },
        { nl: 'Op niveau Werkkennis komen kalibratie, spreiding naast tolerantie, regelkaarten en risico’s vóór de start.', en: 'At Working knowledge level come calibration, spread against tolerance, control charts and risks before launch.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen vormtoleranties, een geschiktheidsstudie, de juiste regelkaart en het control plan.', en: 'At Advanced level come geometric tolerancing, a capability study, the right chart and the control plan.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen tolerantiestapeling, het sigma-niveau, loos alarm en de echte oorzaak.', en: 'At Expert level come tolerance stack-up, the sigma level, false alarms and the real cause.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says is what the captions show (as in the other module intros): short sentences, few commas, no colons
// and no symbols the voice would read aloud. Each topic scene ends on one short sentence naming the tool of that topic's
// lessons, without explaining it. Every drawn detail has its reason in the narration: the belt and the unit (line 3), the
// check table (the check sheet noted on it), the quarantine place (the bad carton set apart), you and the team lead (the ones
// who keep every carton good for the shift).
spec.scenes.forEach((s) => s.beats.forEach((b) => { b.say = { nl: b.nl, en: b.en }; }));
// Each scene's length from its share of the Dutch narration, never shorter than its captions need.
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = spec.scenes.map((sc) => sc.beats.reduce((a, b) => a + wordsOf(plainSay(b.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * spec.scenes.length);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="teamlead"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.pm-cross{fill:none;stroke:var(--anatomy-muted);stroke-width:2.4;stroke-linecap:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
.pm-arm{fill:none;stroke:var(--anatomy-mid);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.pm-joint{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:2}
[data-cue][data-on] .pm-arm{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-joint{stroke:var(--fp-accent)}

/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');



const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Aan het eind van de band een tafel met een turflijst, en daarvoor op de vloer een gemarkeerde plek met twee dozen. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: een doos die goed of fout is, drie vragen over goede onderdelen, een dienst van lijn 3, de route in twee groepen, een tolerantieveld met een ondergrens en een bovengrens, een schuifmaat om een doos, een rij dozen die om een gemiddelde spreiden, die spreiding binnen de tolerantie, een Cpk met de afstand tot de dichtste grens, punten in de tijd, een regelkaart met een middellijn en twee regelgrenzen, een turflijst met streepjes, een foute doos op de band, een doos in quarantaine, een afwijkingsrapport en een dienst met goede dozen voor de klant. Aan het eind de hele kaart van Engineering met Kwaliteit verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. At the end of the belt a table with a check sheet, and in front of it on the floor a marked place with two cartons. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: a carton that is good or bad, three questions about good parts, a shift of line 3, the route in two groups, a tolerance band with a lower and an upper limit, a caliper round a carton, a row of cartons spreading around an average, that spread within the tolerance, a Cpk with the distance to the nearest limit, points in time, a control chart with a centre line and two control limits, a check sheet with tally marks, a bad carton on the belt, a carton in quarantine, a nonconformance report and a shift with good cartons for the customer. At the end the whole map of Engineering with Quality lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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


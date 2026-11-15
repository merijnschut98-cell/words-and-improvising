// Dev tool, not shipped. Builds the module intro film "Lijn 3 automatiseren / Automating line 3" for Lines and automation
// (eng.lines), an Engineering module intro film (v17, Task 13) and the fourth intro of the digital zone: the high-over
// picture at the top of the module, before its six topics (Merijn, 13 Nov: "that high-over picture is the thing I need
// the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved digital intros
// films/eng.itbasics.intro, eng.ot.intro and eng.cyber.intro (their tools router, virtual machine, query, web application,
// information flow, production order, OPC server, tag, machine builder, report button, zone, conduit, annexes and
// manual fallback procedure are not repeated; one clear tool per topic, near 165 to 175 s, nothing labelled before it
// is named) and the notes section "Engineering module intros".
//
//   node films/eng.lines.intro/build.mjs            build the page
//   node films/eng.lines.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.lines.intro.html: one offline page with the anatomy kit, the stage script and
// the player inlined. The index names it (eng.lines' `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.digital ("Automatisering en IT": the filling unit stands over
// the belt of line 3, you, the engineer, connect it step by step; its fourth station, Lijnen en automatisering, says the
// line is where cartons arrive and get filled, that the unit only fills when a carton stands under the plate (the sensor
// pair across the belt), that you use poka-yoke and an interlock, and that without it product runs onto the belt). This
// film follows HOW LINE 3 RUNS AS AN AUTOMATED LINE, topic by topic, in the room of the field film: the belt with its
// cartons, the filling unit over it, the PLC cabinet at the back wall, the pair of sensors across the belt and you at
// the front right. Robots, recipes, ladder logic and the business case are schemas in the panel: the field film's room
// has no robot, no recipe and no spreadsheet, so none is drawn there. The sensors, the spilled product and the PLC cabinet
// appear at the sentence that gives each its reason.
//   s1 line 3 is a row of stations (the Basis definition, eng.lines.linebasics); what the module is (the blurb); the map
//      before any detail: six topics in three groups (the line and its robots; what keeps it running well: error-proofing,
//      variants, control; the business case)
//   s2 Lijnontwerp: follow one carton and count the stations (Basis, .linebasics); the slowest station sets the pace of
//      the line (the bottleneck); the tool is the signal tower (Basis, .linebasics), the one real thing you read off a line
//      (the conveyor is only the belt that is already in the room; cycle time and takt are measures, the stopwatch is in the text)
//   s3 Robots: an arm with usually six axes and a gripper (Basis, .robotbasics); a robot could put the cartons on the belt;
//      the tool is the teach pendant (you teach positions with it)
//   s4 Foutvrij maken: the unit fills only when a carton stands under the plate, the sensor pair sees it, without it
//      product runs onto the belt; the tools are those of the field film's station, poka-yoke (Basis, .errors) and the
//      interlock (Werkkennis, .pokayoke), two parts of one idea
//   s5 Varianten en omstellen: a variant is a version of the same product, changeover is switching to the next one and the
//      line makes nothing meanwhile (Basis, .variants); the tool is the recipe (Werkkennis, .linechange)
//   s6 Besturing en data: a machine has eyes, a brain and hands: sensor, PLC, actuator (Basis, .plc); the PLC is known from
//      eng.ot.intro (it sends no word of the OT stack here), this module adds the logic for the line; the tool is the
//      ladder diagram (Basis, .plc).
//      Machine safety is the Werkkennis level of this topic and is said in the closing, not as a tool
//   s7 Businesscase: whether automating pays depends on labour, volume, variation and quality (Basis, .autobasics); the
//      tool is the payback time (Werkkennis, .payback: the calculation that answers whether the cell earns its cost back,
//      "reken uit"; the business case itself is the topic's name, and Basis has only measures and a company); the story ends where the field film picks it up (the numbers of
//      the line), in the last topic scene
//   s8 the shared Engineering map (the kit's mapScene) with Lines and automation lit, then the module's six topics with
//      their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of the digital intros: one clear tool per topic (two only for error-proofing, where the field film names
// both and they form one idea); drop what is not needed; nothing labelled before it is named; a Werkkennis tool named in
// a scene (interlock, recipe, payback time) is not named again in the closing grid; no dashboards or edge gateways (those
// are eng.industry40's); the PLC is said as what this module adds, the logic for the line.
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
const MOD = MODULES.find((m) => m.id === 'eng.lines');
const LEVELS = {
  design: ['eng.lines.linebasics', 'eng.lines.layout', 'eng.lines.buffers', 'eng.lines.simulation'],
  robots: ['eng.lines.robotbasics', 'eng.lines.robots', 'eng.lines.robotcell', 'eng.lines.vision'],
  errorproof: ['eng.lines.errors', 'eng.lines.pokayoke', 'eng.lines.sensors', 'eng.lines.detection'],
  variants: ['eng.lines.variants', 'eng.lines.linechange', 'eng.lines.mixed', 'eng.lines.sequencing'],
  control: ['eng.lines.plc', 'eng.lines.safety', 'eng.lines.oee_auto', 'eng.lines.stoppages'],
  business: ['eng.lines.autobasics', 'eng.lines.payback', 'eng.lines.business', 'eng.lines.risk'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.lines has the six topics and levels this film draws');
assert(MOD.intro === 'eng.lines.intro', 'eng.lines names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: a line is a row of stations; the blurb of the module
has('eng.lines.linebasics', ['Een assemblagelijn (assembly line) is een rij stations', 'werkplekken waar één vast deel van het werk gebeurt']);
has('eng.lines.linebasics', ['An assembly line is a row of stations', 'workplaces where one fixed part of the work is done'], 'en');
assert(MOD.blurb.nl.includes('Assemblagelijnen ontwerpen en verbeteren met automatisering'), 'the module blurb (nl) says what it is for');
assert(MOD.blurb.en.includes('Designing and improving assembly lines with automation'), 'the module blurb (en) says what it is for');
// s2: follow one product and count the stations; the slowest station sets the pace; the signal tower
has('eng.lines.linebasics', ['volg dan één product van begin tot eind. Tel de stations', 'Het station met de langste cyclustijd is de bottleneck: de hele lijn kan niet sneller dan dat station', 'Signaalzuil De lampenpaal op een machine']);
has('eng.lines.linebasics', ['follow one product from start to finish. Count the stations', 'The station with the longest cycle time is the bottleneck: the whole line can go no faster than that station', 'Stack light The lamp column on a machine'], 'en');
// s3: an arm with usually six axes and a gripper; the teach pendant
has('eng.lines.robotbasics', ['Een industriële robot is een arm op een vaste voet', 'De meeste robots op een lijn hebben er zes', 'een grijper', 'Posities leer je in met de teach pendant']);
has('eng.lines.robotbasics', ['An industrial robot is an arm on a fixed base', 'Most robots on a line have six', 'a gripper', 'Positions are taught with the teach pendant'], 'en');
// s4: what poka-yoke is, the photoelectric sensor, the interlock
has('eng.lines.errors', ['Poka-yoke Foutvrij maken: een vergissing onmogelijk maken, of hem meteen vangen en stoppen']);
has('eng.lines.errors', ['Poka-yoke Error-proofing: making a mistake impossible, or catching it at once and stopping'], 'en');
has('eng.lines.pokayoke', ['een foto-elektrische sensor stuurt een lichtstraal en merkt het als iets die onderbreekt', 'Interlock Een regel in de PLC die de volgende stap blokkeert']);
has('eng.lines.pokayoke', ['a photoelectric sensor sends a light beam and notices when something breaks it', 'Interlock A rule in the PLC that blocks the next step'], 'en');
// s5: a variant, changeover, the recipe
has('eng.lines.variants', ['Een variant is een versie van hetzelfde product', 'en ondertussen maakt de lijn niks']);
has('eng.lines.variants', ['A variant is a version of the same product', 'and the line makes nothing meanwhile'], 'en');
has('eng.lines.linechange', ['De softwarehelft is het recept: een opgeslagen set instellingen per variant in de PLC', 'De operator kiest de variant en de machine laadt het recept']);
has('eng.lines.linechange', ['The software half is the recipe: a stored set of settings per variant in the PLC', 'The operator picks the variant and the machine loads it'], 'en');
// s6: eyes, brain and hands; the ladder diagram
has('eng.lines.plc', ['Een machine werkt dus als een mens: ogen, een brein en handen', 'Ladderdiagram Een PLC-programmeertaal die eruitziet als een elektrisch schema met sporten']);
has('eng.lines.plc', ['So a machine works like a person: eyes, a brain and hands', 'Ladder diagram A PLC programming language that looks like an electrical drawing with rungs'], 'en');
// s7: four questions; the payback time
has('eng.lines.autobasics', ['Of het zinvol is, hangt af van vier vragen', 'hoeveel arbeid vervangt het, hoeveel producten, hoeveel variatie, en wat doet het voor de kwaliteit']);
has('eng.lines.autobasics', ['Whether it makes sense comes down to four questions'], 'en');
has('eng.lines.payback', ['Terugverdientijd = investering / jaarlijkse netto besparing', 'Terugverdientijd De investering gedeeld door de jaarlijkse netto besparing']);
has('eng.lines.payback', ['Payback time = investment / yearly net saving', 'Payback time Investment divided by the yearly net saving'], 'en');
// s8: the first lesson reads a line (where to start); the later levels, as the lessons are titled
for (const [id, word] of [['eng.lines.layout', 'Lijntypes'], ['eng.lines.robots', 'Robots'], ['eng.lines.pokayoke', 'Foutvrij maken met sensoren'], ['eng.lines.linechange', 'Omstellen'], ['eng.lines.safety', 'Machineveiligheid'], ['eng.lines.payback', 'investering'],
  ['eng.lines.buffers', 'Buffers'], ['eng.lines.robotcell', 'robotcel'], ['eng.lines.sensors', 'Sensoren kiezen'], ['eng.lines.mixed', 'Mixed-model'], ['eng.lines.oee_auto', 'OEE'], ['eng.lines.business', 'businesscase'],
  ['eng.lines.simulation', 'simulatie'], ['eng.lines.vision', 'Vision'], ['eng.lines.detection', 'Foutvrij maken als strategie'], ['eng.lines.sequencing', 'Volgorde'], ['eng.lines.stoppages', 'Microstops'], ['eng.lines.risk', 'Risico']]) has(id, [word]);
for (const [id, word] of [['eng.lines.layout', 'Line types'], ['eng.lines.robots', 'Robots'], ['eng.lines.pokayoke', 'Error-proofing with sensors'], ['eng.lines.linechange', 'Changeover'], ['eng.lines.safety', 'Machine safety'], ['eng.lines.payback', 'investment'],
  ['eng.lines.buffers', 'buffers'], ['eng.lines.robotcell', 'robot cell'], ['eng.lines.sensors', 'Choosing and validating sensors'], ['eng.lines.mixed', 'Mixed-model'], ['eng.lines.oee_auto', 'OEE'], ['eng.lines.business', 'business case'],
  ['eng.lines.simulation', 'simulation'], ['eng.lines.vision', 'Vision'], ['eng.lines.detection', 'Error-proofing as a strategy'], ['eng.lines.sequencing', 'Sequencing'], ['eng.lines.stoppages', 'Micro-stops'], ['eng.lines.risk', 'Risk']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));
// the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from GRID.x; the words
// stand on one line each, staggered over two rows, so a word may be wider than its column but not wider than the room to
// the next word on its row, nor run off the stage. Six rows of GRID.pitch.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 276, col: 90, box: 82, tile: 252, top: 66, pitch: 54, h: 48 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
assert(GRID.top + (ORDER.length - 1) * GRID.pitch + GRID.h <= 392, 'the six rows of the grid fit the stage');
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
const at = w.at;
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the digital field film: the filling unit over the start of line 3's belt (two uprights
// and a beam, a plate hung from the beam above the cartons, a plastic cover on top), the PLC cabinet at the back wall
// between the corner and the belt, the pair of sensors across the belt at the carton under the plate, you at the front
// right. Without the field film's tank, network cabinet, cable, zone, screen, edge box and MES table: other stations own
// them. Product that runs onto the belt where no carton stands is a few dots in the gap under the plate.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const PLC = { x: 96, w: 30, d: 20, h: 112 };
const EYE = { x: 181, y0: 10, y1: 56, z: 76 }; // the pair of sensors at the carton under the plate
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the pair of sensors: a post with an eye on each side of the belt and a dashed beam between them at the carton
const eyes = w.post(EYE.x, EYE.y0, 3, 0, EYE.z, { tone: 'lo' }, 12) + w.box({ x: EYE.x - 4, y: EYE.y0 - 4, w: 8, d: 8, r: 1.5 }, EYE.z, EYE.z + 10, { tone: 'hi' }, { steps: 2 })
  + w.post(EYE.x, EYE.y1, 3, 0, EYE.z, { tone: 'lo' }, 12) + w.box({ x: EYE.x - 4, y: EYE.y1 - 4, w: 8, d: 8, r: 1.5 }, EYE.z, EYE.z + 10, { tone: 'hi' }, { steps: 2 })
  + k.lineSvg(k.pathOf([at([EYE.x, EYE.y0 + 4, EYE.z + 5]), at([EYE.x, EYE.y1 - 4, EYE.z + 5])]), { tone: 'hi', dashed: true });
// product on the belt in the gap between two cartons under the plate (cartons stand at x 138 to 158 and 168 to 188)
const spill = [[159, 22], [163, 28], [159, 34], [163, 40]].map(([x, y]) => w.box({ x, y, w: 5, d: 5, r: 1 }, 60, 67, { tone: 'hi' }, { steps: 1 })).join('');

// painted back to front: the belt, the unit, the PLC cabinet (shown from the control scene on), the sensors (from the
// error-proofing scene on), the product on the belt (only where it is the point), you
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-plc', cueG('plc', hall.cabinet({ x: PLC.x, w: PLC.w, d: PLC.d, h: PLC.h }))),
  g('o-eye', cueG('sensor', eyes)),
  g('o-spill', cueG('spill', spill)),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the six topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared map (the kit's mapScene) sits under the panel; its place Lines and automation is a
// cue group of its own (map-lines).
const TILE = { design: 'tDesign', robots: 'tRobots', errorproof: 'tErr', variants: 'tVar', control: 'tCtl', business: 'tBiz' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'grpC', 'staS', 'botS', 'robS', 'errS', 'eyeS', 'spillS', 'varS', 'chgS', 'ctlS', 'logS', 'fourS', 'payS', 'nextS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Lines and automation lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.lines'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.lines');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.lines')}"`), 'the map lights eng.lines as a cue group');
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
  { from: cam(150, 70, 60, 1.0), to: cam(150, 75, 60, 1.06) }, // s1 the whole hall: the unit on line 3, you
  { from: cam(170, 45, 70, 1.35), to: cam(170, 45, 70, 1.45) }, // s2 the belt with its cartons
  { from: cam(150, 45, 70, 1.35), to: cam(150, 45, 70, 1.45) }, // s3 the start of the belt, where a robot could put the cartons
  { from: cam(168, 35, 80, 1.7), to: cam(168, 35, 80, 1.9) }, // s4 the belt, the carton under the plate, the sensors
  { from: cam(160, 45, 70, 1.3), to: cam(160, 45, 70, 1.4) }, // s5 the unit and the belt
  { from: cam(140, 40, 75, 1.3), to: cam(140, 40, 75, 1.2) }, // s6 the sensors and the PLC cabinet
  { from: cam(150, 70, 60, 1.0), to: cam(150, 75, 60, 1.04) }, // s7 the whole hall, you
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s8 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(8).fill(30);
const spec = {
  id: 'eng.lines.intro',
  title: { nl: 'Lijn 3 automatiseren', en: 'Automating line 3' },
  module: 'eng.lines',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.lines, the scene that explains it and its tile
  topics: {
    design: { scene: 's2', cue: 'tDesign' },
    robots: { scene: 's3', cue: 'tRobots' },
    errorproof: { scene: 's4', cue: 'tErr' },
    variants: { scene: 's5', cue: 'tVar' },
    control: { scene: 's6', cue: 'tCtl' },
    business: { scene: 's7', cue: 'tBiz' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De lijn en de route', en: 'The line and the route' },
      beats: [
        { nl: 'Lijn 3 is een rij stations. Elk station doet één vast deel van het werk.', en: 'Line 3 is a row of stations. Each station does one fixed part of the work.', focus: ['flowS', 'unit', 'line3'] },
        { nl: 'Lijnen en automatisering leert je lijnen ontwerpen en verbeteren met automatisering.', en: 'Lines and automation teaches you to design and improve lines with automation.', focus: ['defS', 'line3'] },
        { nl: 'Eerst de lijn zelf, met ontwerp en robots.', en: 'First the line itself, with design and robots.', focus: 'grpA' },
        { nl: 'Dan wat hem goed laat draaien. Foutvrij maken, varianten en besturing.', en: 'Then what keeps it running well. Error-proofing, variants and control.', focus: 'grpB' },
        { nl: 'Tot slot de businesscase.', en: 'Last the business case.', focus: 'grpC' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Lijnontwerp', en: 'Line design' },
      beats: [
        { nl: 'Het eerste onderwerp is Lijnontwerp. Je volgt één doos en telt de stations.', en: 'The first topic is Line design. You follow one carton and count the stations.', focus: ['tDesign', 'staS', 'line3'] },
        { nl: 'Het langzaamste station bepaalt hoe snel de hele lijn kan.', en: 'The slowest station decides how fast the whole line can go.', focus: ['botS', 'unit'] },
        { nl: 'Op een {t:Signaalzuil|signaalzuil} lees je af of een station draait, wacht of storing heeft.', en: 'On a {t:Stack light|stack light} you read whether a station is running, waiting or faulted.', ...TOOL('Signaalzuil'), focus: ['tool1', 'staS', 'line3'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Robots', en: 'Robots' },
      beats: [
        { nl: 'Het tweede onderwerp is Robots. Een robot is een arm met meestal zes assen en een grijper.', en: 'The second topic is Robots. A robot is an arm with usually six axes and a gripper.', focus: ['tRobots', 'robS'] },
        { nl: 'Een robot kan aan het begin van de band de dozen neerzetten.', en: 'A robot could place the cartons at the start of the belt.', focus: ['robS', 'line3'] },
        { nl: 'Posities leer je in met een {t:Teach pendant|teach pendant}.', en: 'You teach positions with a {t:Teach pendant|teach pendant}.', ...TOOL('Teach pendant'), focus: ['tool1', 'robS'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Foutvrij maken', en: 'Error-proofing' },
      beats: [
        { nl: 'Het derde onderwerp is Foutvrij maken. De eenheid vult alleen als er een doos onder de plaat staat.', en: 'The third topic is Error-proofing. The unit only fills when a carton stands under the plate.', focus: ['tErr', 'errS', 'unit'] },
        { nl: 'Twee sensoren zien of die doos er is. Anders loopt product de band op.', en: 'Two sensors see if that carton is there. Otherwise product runs onto the belt.', focus: ['eyeS', 'sensor', 'spillS', 'spill'] },
        { nl: 'Daartegen gebruik je {t:Poka-yoke|poka-yoke} en een {t:Interlock|interlock}.', en: 'Against this you use {t:Poka-yoke|poka-yoke} and an {t:Interlock|interlock}.', ...TOOL('Poka-yoke', 'Interlock'), focus: ['tool1', 'tool2', 'sensor'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Varianten en omstellen', en: 'Variants and changeover' },
      beats: [
        { nl: 'Het vierde onderwerp is Varianten en omstellen. Een variant is een versie van hetzelfde product.', en: 'The fourth topic is Variants and changeover. A variant is a version of the same product.', focus: ['tVar', 'varS'] },
        { nl: 'Omstellen is wisselen naar de volgende variant. Zolang dat duurt, maakt de lijn niks.', en: 'Changeover is switching to the next variant. While it lasts, the line makes nothing.', focus: ['chgS', 'line3'] },
        { nl: 'Daarvoor laadt de machine een {t:Recept|recept} met instellingen zoals snelheid en posities.', en: 'For that the machine loads a {t:Recipe|recipe} with settings like speed and positions.', ...TOOL('Recept'), focus: ['tool1', 'unit'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Besturing en data', en: 'Control and data' },
      beats: [
        { nl: 'Het vijfde onderwerp is Besturing en data. Een machine heeft ogen, een brein en handen.', en: 'The fifth topic is Control and data. A machine has eyes, a brain and hands.', focus: ['tCtl', 'ctlS'] },
        { nl: 'Dat zijn de sensoren, de PLC in de kast en de actuatoren.', en: 'Those are the sensors, the PLC in the cabinet and the actuators.', focus: ['ctlS', 'sensor', 'plc'] },
        { nl: 'De PLC ken je al. Hier schrijf je de logica van de lijn als {t:Ladderdiagram|ladderdiagram}.', en: 'You know the PLC already. Here you write the logic of the line as a {t:Ladder diagram|ladder diagram}.', ...TOOL('Ladderdiagram'), focus: ['tool1', 'logS', 'plc'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Businesscase', en: 'Business case' },
      beats: [
        { nl: 'Het zesde onderwerp is Businesscase. Het draait om arbeid, volume, variatie en kwaliteit.', en: 'The sixth topic is Business case. It comes down to labour, volume, variation and quality.', focus: ['tBiz', 'fourS'] },
        { nl: 'Investering gedeeld door besparing per jaar. Zo reken je de {t:Terugverdientijd|terugverdientijd} uit.', en: 'Investment divided by saving per year. That is how you work out the {t:Payback time|payback time}.', ...TOOL('Terugverdientijd'), focus: ['tool1', 'payS'] },
        { nl: 'Zo draait lijn 3 geautomatiseerd. Daarna ga jij verder met de cijfers van de lijn.', en: 'That is how line 3 runs automated. Then you move on to the numbers of the line.', focus: ['nextS', 'jij'] },
      ],
    },
    {
      id: 's8', level: 1, dur: DURS[7], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Lijnen en automatisering is het vierde station van Automatisering en IT.', en: 'The whole map. Lines and automation is the fourth station of Automation and IT.', focus: 'map-lines' },
        { nl: 'Elk van de zes onderwerpen heeft vier niveaus.', en: 'Each of the six topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis bij het lezen van een lijn. Dat laat zien waar de rest op past.', en: 'Start at Basics level with reading a line. It shows where the rest fits.', focus: ['tDesign', 'start'] },
        { nl: 'Op niveau Werkkennis komen soorten lijnen en robots, sensoren en omstellen, veiligheid en investering.', en: 'At Working knowledge level come line types and robots, sensors and changeover, safety and investment.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen buffers en robotcellen, sensoren kiezen, OEE en de businesscase.', en: 'At Advanced level come buffers and robot cells, choosing sensors, OEE and the business case.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen simulatie en vision, foutvrij maken en volgorde, microstops en risico.', en: 'At Expert level come simulation and vision, error-proofing and sequencing, micro-stops and risk.', focus: 'lv4' },
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
// lessons, without explaining it. Every drawn detail has its reason in the narration: the belt and the unit (line 3, the
// stations), the sensors (they see the carton), the product on the belt (without them), the PLC cabinet (the brain), you
// (you move on to the numbers of the line).
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

const PEOPLE = ':is([data-cue="jij"])';
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
/* the sensors' beam reads at phone width: a little heavier than the kit's hairline */
[data-cue="sensor"] .iso-line{stroke-width:1.8}
.pm-arm{fill:none;stroke:var(--anatomy-mid);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.pm-joint{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:2}
[data-cue][data-on] .pm-arm{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-joint{stroke:var(--fp-accent)}

/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');



const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Over het begin van de band staat de nieuwe vuleenheid, met een plaat boven de dozen. Tegen de achterwand een besturingskast, en over de band twee sensoren met een gestippelde straal bij de doos onder de plaat. Jij, de engineer, staat vooraan rechts. Rechts een paneel, gemarkeerd als voorbeeld of schema: een rij stations, wat de module is, de route in drie groepen, stations met een doos die meeloopt, het langzaamste station, een signaalzuil, een robotarm met grijper en een teach pendant, een doos onder de plaat, twee sensoren, product op de band, poka-yoke en een interlock, twee varianten en een omstelgat, een recept met snelheid en posities, sensor, PLC en actuator, de logica van de lijn als ladderdiagram, vier vragen over automatiseren, de terugverdientijd en wat daarna komt. Aan het eind de hele kaart van Engineering met Lijnen en automatisering verlicht, en de zes onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs. Over the start of the belt stands the new filling unit, with a plate above the cartons. Against the back wall a control cabinet, and across the belt two sensors with a dashed beam at the carton under the plate. You, the engineer, stand at the front right. At the right a panel, marked as an example or a diagram: a row of stations, what the module is, the route in three groups, stations with a carton moving along, the slowest station, a stack light, a robot arm with a gripper and a teach pendant, a carton under the plate, two sensors, product on the belt, poka-yoke and an interlock, two variants and a changeover gap, a recipe with speed and positions, sensor, PLC and actuator, the logic of the line as a ladder diagram, four questions about automating, the payback time and what comes next. At the end the whole map of Engineering with Lines and automation lit, and the module’s six topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

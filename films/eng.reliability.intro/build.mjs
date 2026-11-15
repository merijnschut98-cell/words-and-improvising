// Dev tool, not shipped. Builds the module intro film "De unit betrouwbaarder maken / Making the unit more reliable" for Reliability and
// asset strategy (eng.reliability), an Engineering module intro film (v17, Task 13), the fourth intro of the zone "De fabriek beter maken"
// (eng.field.better) and the last Engineering intro: the high-over picture at the top of the module, before its four topics (Merijn,
// 13 Nov: "that high-over picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the
// approved intros films/eng.cost.intro, eng.improve.intro and eng.safety.intro (one clear tool per topic, as short as the content allows,
// nothing labelled before it is named, no SAY rule that is not needed, the room of the field film) and the notes section "Engineering
// module intros".
//
//   node films/eng.reliability.intro/build.mjs            build the page
//   node films/eng.reliability.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.reliability.intro.html: one offline page with the anatomy kit, the stage script and the player
// inlined. The index names it (eng.reliability's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.better ("Na de dienst op lijn 3": you and the team lead stay after the shift; its
// station Betrouwbaarheid en assetstrategie says you make the line more reliable where it counts, that not every part counts the same,
// that you look at what happens when it fails, and that the tools are a risk matrix and an FMECA: the two boards on the side wall, a 3
// by 3 risk matrix with the top right cell marked and an FMECA sheet). This film follows WHAT MAKES THE FILLING UNIT OF LINE 3 MORE
// RELIABLE, topic by topic, in the room of the field film: the belt with its cartons and the filling unit over it, you and the team
// lead at the front, and the two boards on the side wall, which come in at the sentence that names the risk matrix and the FMECA.
// Without the field film's tank, chalk circle, board, scale, chart, crate and laptop (other stations own them). How a part fails,
// the failure data, what a function is, the hidden failure, the stop and the decision are schemas in the panel: the field film's room
// has no place for them. Hedged as the lessons are ("meestal", "kan", "in veel fabrieken").
//   s1 the filling unit of line 3 sometimes fails and then the line stands still; the module is about how parts fail and what you do
//      about it (the module's blurb); you and the team lead make the unit more reliable after the shift; the map before any detail:
//      four topics in two groups (how parts fail and which part weighs most, with failure and its patterns and with FMEA and criticality;
//      which maintenance fits and what the numbers say, with RCM and asset strategy and with reliability data and decisions)
//   s2 Falen en faalpatronen: a part fails when the load on it is higher than its strength (Basis, .mechanisms: "een handig beeld");
//      degradation (wear) usually gives a warning, a sudden overload does not (Basis, .mechanisms); the tool is the Weibull fit (Werkkennis,
//      .weibull: the curve that turns a list of failure ages into two numbers). It is no glossary term of the lesson (the lesson's terms
//      are failure rate, suspension, characteristic life, shape parameter, early failure, wear), so it is not a {t:} term; it is the one
//      real tool of the topic and the maintenance intro (eng.maintenance.intro) leaves the Weibull fit to this module on purpose
//   s3 FMEA en kritikaliteit: not every part counts the same, you look at what happens when it fails and how likely that is (Basis,
//      .criticality: criticality is that combination); the tools are the risk matrix (Basis, .criticality) and the FMECA (Werkkennis,
//      .fmeca: an FMEA with a criticality rating per failure mode), one idea in two documents and the field film's own two tools: the
//      two boards on the side wall; the marked cell is the part you tackle first
//   s4 RCM en assetstrategie: RCM decides which maintenance each part really needs (Werkkennis, .rcm); you start with what the unit must
//      do, a verb, an object and a standard (Basis, .functions); a protection can fail without anyone noticing, a hidden failure
//      (Werkkennis, .rcm); the tool is the failure-finding task (Werkkennis, .rcm: test the device on an interval to find out whether it
//      still works). No protection is drawn: the field film's room has none, it is a schema in the panel
//   s5 Betrouwbaarheidsdata en besluiten: you count how often the unit fails and how long it then stands still (Basis, .mtbf); in many
//      plants waiting is the biggest share of the downtime, not the repair (Werkkennis, .availability); the topic has no real tool at Basis
//      or Werkkennis: MTBF is the maintenance module's measure (it is named in eng.maintenance.intro), so the most tool-like term is the
//      operational availability (Werkkennis, .availability), the figure that counts the whole stop. The story ends: you make the unit
//      more reliable where it counts (the field film's own sentence)
//   s6 the shared Engineering map (the kit's mapScene) with Reliability lit, then the module's four topics with their levels as columns,
//      where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40, quality, maintenance, cost and safety intros: one clear tool per topic; drop what is not needed;
// nothing labelled before it is named; a Werkkennis tool named in a scene (Weibull fit, FMECA, failure-finding task, operational
// availability) is not named again in the closing grid, and neither is the Basis tool (risk matrix); no other intro names one of
// these tools (the maintenance intro has the bathtub curve, CILT standard, CMMS and work sampling and says MTBF in its own scene).
// Narration: FMEA is said as letters in a variant of the beat (espeak-ng reads it "fmeea"; the quality intro leaves it out of the
// voice), FMECA by the SAY rule of the field film ("en maakt een FMECA", the same phrase), failure-finding as "feeljer-fainding" in a
// variant of the beat (espeak-ng reads "failure" as "fajluure"), not by a SAY rule.
//
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
import { pathBox } from '../../src/content/courses/validate.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the module
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.reliability');
const LEVELS = {
  failure: ['eng.reliability.mechanisms', 'eng.reliability.weibull', 'eng.reliability.rca', 'eng.reliability.lifedata'],
  risk: ['eng.reliability.criticality', 'eng.reliability.fmeca', 'eng.reliability.redundancy', 'eng.reliability.riskbased'],
  strategy: ['eng.reliability.functions', 'eng.reliability.rcm', 'eng.reliability.program', 'eng.reliability.assetmgmt'],
  decide: ['eng.reliability.mtbf', 'eng.reliability.availability', 'eng.reliability.spares', 'eng.reliability.lcc'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.reliability has the four topics and levels this film draws');
assert(MOD.intro === 'eng.reliability.intro', 'eng.reliability names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb
assert(MOD.blurb.nl.includes('hoe onderdelen falen') && MOD.blurb.en.includes('how parts fail'), 'the module blurb says how parts fail');
// s2: a part fails when the load on it is higher than its strength; degradation usually gives a warning, an overload does not; a Weibull fit
// turns the list of failure ages into two numbers
has('eng.reliability.mechanisms', ['een onderdeel faalt als de belasting hoger is dan de sterkte', 'Degradatie geeft meestal een waarschuwing', 'een plotselinge overbelasting zie je niet aankomen']);
has('eng.reliability.mechanisms', ['a part fails when the load on it is higher than its strength', 'Degradation usually gives a warning', 'you cannot measure a sudden overload coming'], 'en');
has('eng.reliability.weibull', ['Een Weibull-fit, een curve vernoemd naar de Zweedse ingenieur Waloddi Weibull, maakt van die lijst twee getallen']);
has('eng.reliability.weibull', ['A Weibull fit, a curve named after the Swedish engineer Waloddi Weibull, then turns that list into two numbers'], 'en');
// s3: criticality is how heavy the failure of a machine weighs, consequence combined with likelihood; the risk matrix is a grid of
// consequence against likelihood; an FMECA is an FMEA with a criticality rating per failure mode
has('eng.reliability.criticality', ['Kritikaliteit is die combinatie: hoe zwaar de uitval van deze machine weegt', 'De meeste sites gebruiken een risicomatrix: een raster met het gevolg op de ene as en de kans op de andere', 'Risicomatrix Raster dat gevolg tegen kans zet']);
has('eng.reliability.criticality', ['Criticality is that combination: how much the failure of this machine matters', 'Most sites use a risk matrix: a grid with consequence on one axis and likelihood on the other', 'Risk matrix Grid that scores consequence against likelihood'], 'en');
has('eng.reliability.fmeca', ['Een FMECA voegt per faalwijze een kritikaliteitsscore toe', 'FMECA Een FMEA met een kritikaliteitsscore per faalwijze']);
has('eng.reliability.fmeca', ['An FMECA adds a criticality rating per failure mode', 'FMECA An FMEA with a criticality rating per failure mode'], 'en');
// s4: RCM decides which maintenance each asset really needs; a function is a verb, an object and a standard; a hidden failure is one
// nobody notices in normal operation, of a protective or standby device; it needs a failure-finding task, a test on an interval
has('eng.reliability.rcm', ['Reliability-centred maintenance (RCM) is een methode om te bepalen welk onderhoud elke asset echt nodig heeft', 'Een verborgen storing vraagt een failure-finding-taak: test het apparaat op een vast interval om te ontdekken of het nog werkt', 'Failure-finding-taak Een geplande test van een beveiliging of reserve-unit']);
has('eng.reliability.rcm', ['Reliability-centred maintenance (RCM) is a method to decide which maintenance each asset really needs', 'A hidden failure needs a failure-finding task: test the device on an interval to find out whether it still works', 'Failure-finding task A scheduled test of a protective or standby device to find out whether it still works'], 'en');
has('eng.reliability.functions', ['Een functie is een werkwoord, een object en een eis']);
has('eng.reliability.functions', ['A function is a verb, an object and a standard'], 'en');
// s5: a failure rate is the failures divided by the time all the units ran; in many plants waiting is the biggest share of the downtime, not
// the repair; operational availability counts the whole stop
has('eng.reliability.mtbf', ['Uit parkdata haal je een faalkans', 'storingen gedeeld door de tijd die alle units samen draaiden']);
has('eng.reliability.mtbf', ['From fleet data you get a failure rate', 'failures divided by the time all units ran together'], 'en');
has('eng.reliability.availability', ['In veel fabrieken is wachten het grootste deel van de stilstand, niet de reparatie', 'Operationele beschikbaarheid Beschikbaarheid met de hele stop, inclusief wachten op mensen, vergunningen en onderdelen']);
has('eng.reliability.availability', ['In many plants waiting is the biggest share of downtime, not the repair', 'Operational availability Availability counting the whole stop, including waiting for people, permits and parts'], 'en');
// s6: the first lesson names where to start; the later levels, as the lessons are titled
for (const [id, word] of [['eng.reliability.mechanisms', 'Hoe onderdelen fysiek falen'], ['eng.reliability.weibull', 'Storingsdata'], ['eng.reliability.rca', 'Grondoorzaakanalyse'], ['eng.reliability.lifedata', 'Zelf een Weibull fitten'],
  ['eng.reliability.fmeca', 'FMEA en FMECA op installaties'], ['eng.reliability.redundancy', 'reserve-units'], ['eng.reliability.riskbased', 'Risico in euro’s'],
  ['eng.reliability.rcm', 'Reliability-centred maintenance'], ['eng.reliability.program', 'betrouwbaarheidsprogramma'], ['eng.reliability.assetmgmt', 'Assetmanagement'],
  ['eng.reliability.availability', 'waar de stilstand blijft'], ['eng.reliability.spares', 'Reservedelen'], ['eng.reliability.lcc', 'Levensduurkosten']]) has(id, [word]);
for (const [id, word] of [['eng.reliability.mechanisms', 'How parts physically fail'], ['eng.reliability.weibull', 'Failure data'], ['eng.reliability.rca', 'Root cause failure analysis'], ['eng.reliability.lifedata', 'Fitting Weibull yourself'],
  ['eng.reliability.fmeca', 'FMEA and FMECA on equipment'], ['eng.reliability.redundancy', 'standby units'], ['eng.reliability.riskbased', 'Risk in euros'],
  ['eng.reliability.rcm', 'Reliability-centred maintenance'], ['eng.reliability.program', 'reliability programme'], ['eng.reliability.assetmgmt', 'Asset management'],
  ['eng.reliability.availability', 'where downtime goes'], ['eng.reliability.spares', 'Spare parts'], ['eng.reliability.lcc', 'Life-cycle cost']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));
// the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from GRID.x; the words
// stand on one line each, staggered over two rows, so a word may be wider than its column but not wider than the room to
// the next word on its row, nor run off the stage. Four rows of GRID.pitch.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 308, col: 82, box: 74, tile: 284, top: 76, pitch: 78, h: 76 };
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
    assert(wrapUnits(title, GRID.tile - 12, CHAR_W).length <= 3, `the grid tile of "${title}" (${lang}) needs more than three lines`);
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
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the better field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), you and the team lead at the front, and the two
// boards on the side wall (x = 0): the risk matrix and the FMECA sheet, at the same coordinates as the field film. Without the
// field film's tank, chalk circle, board, scale, chart, crate and laptop: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const RISK = { y0: 56, y1: 114, z0: 104, z1: 176 }; // the risk matrix on the side wall
const FMEC = { y0: 122, y1: 168, z0: 104, z1: 176 }; // the FMECA sheet on the side wall
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the two boards on the side wall (x = 0): local (u, v) on the face is (-y, -z). The risk matrix is a grid of three by three with the
// top right cell marked, the FMECA sheet a header and three rows (as in the field film).
const SX = 2.7;
const sideBoard = (b) => w.box({ x: 0, y: b.y0, w: 2.6, d: b.y1 - b.y0, r: 0.6 }, b.z0, b.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeX(SX)}"><path class="pm-board" d="${w.rectD(-(b.y1 - 2.4), -(b.z1 - 2.4), -(b.y0 + 2.4), -(b.z0 + 2.4))}"/></g>`;
const cellsOf = (b) => {
  const m = 6;
  const cw = (b.y1 - b.y0 - 2 * m - 4) / 3;
  const ch = (b.z1 - b.z0 - 2 * m - 4) / 3;
  const out = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
    const u0 = -(b.y1 - m) + i * (cw + 2);
    const v0 = -(b.z1 - m) + j * (ch + 2);
    out.push(`<path class="${i === 2 && j === 0 ? 'pm-hot' : 'pm-cell'}" d="${w.rectD(u0, v0, u0 + cw, v0 + ch)}"/>`);
  }
  return `<g transform="${w.planeX(SX + 0.1)}">${out.join('')}</g>`;
};
const fmecRows = (b) => {
  const m = 6;
  const u0 = -(b.y1 - m);
  const u1 = -(b.y0 + m);
  const z = (t) => -(b.z1 - m) + t * (b.z1 - b.z0 - 2 * m);
  const cols = [u0 + 0.38 * (u1 - u0)];
  const rules = [0.25, 0.5, 0.75].map((t) => `M${f1(u0)} ${f1(z(t))}H${f1(u1)}`).join('') + `M${f1(cols[0])} ${f1(z(0))}V${f1(z(1))}`;
  return `<g transform="${w.planeX(SX + 0.1)}"><path class="pm-hatch" d="${w.rectD(u0, z(0), u1, z(0.25))}"/><path class="pm-rule" d="${rules}"/></g>`;
};
const riskBoard = sideBoard(RISK) + cellsOf(RISK);
const fmecBoard = sideBoard(FMEC) + fmecRows(FMEC);

// painted back to front: the belt and the unit, the two boards on the side wall (from the sentence that names the risk matrix and the
// FMECA), you and the team lead (from the sentence that names you)
const world = [
  w.room(ROOM),
  g('o-wall', cueG('matrix', riskBoard) + cueG('fmeca', fmecBoard)),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij0', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Reliability and asset strategy is a cue group of its own (map-reliability).
const TILE = { failure: 'tFail', risk: 'tRisk', strategy: 'tStrat', decide: 'tDec' };
const PANEL = ['unitS', 'modS', 'shiftS', 'grpA', 'grpB', 'failS', 'loadS', 'warnS', 'weibS', 'partsS', 'critS', 'matS', 'markS', 'rcmS', 'funcS', 'hidS', 'ffS',
  'dataS', 'countS', 'waitS', 'opS', 'endS', 'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Reliability and asset strategy lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.reliability'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.reliability');
// the zoom looks at the middle of the zone's band (the zone's name, which the beat says, stays on screen above the lit place)
const ZONEB = engMap.zones.find((z) => z.field === 'eng.field.better');
const ZBAND = [pathBox(ZONEB.path)[1], pathBox(ZONEB.path)[3]];
assert(PLACE.y > ZBAND[0] && PLACE.y + PLACE.h < ZBAND[1] && (ZBAND[1] - ZBAND[0]) * 1.5 <= H - 20, 'the lit place lies in the better zone and the zone fits the zoom');
const MAPZ = [PLACE.x + PLACE.w / 2, (ZBAND[0] + ZBAND[1]) / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.reliability')}"`), 'the map lights eng.reliability as a cue group');
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
  { from: cam(160, 60, 70, 1.1), to: cam(160, 60, 70, 1.2) }, // s2 the unit over the belt
  { from: cam(150, 70, 70, 1.05), to: cam(70, 90, 100, 1.18), at: 2 }, // s3 the unit, then (b2) the risk matrix and the FMECA sheet on the side wall, the unit beside them
  { from: cam(150, 70, 70, 1.05), to: cam(150, 70, 70, 1.15) }, // s4 the unit
  { from: cam(150, 70, 70, 1.05), to: cam(150, 70, 70, 1.15) }, // s5 the unit, you and the team lead at the end
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.reliability.intro',
  title: { nl: 'De unit betrouwbaarder maken', en: 'Making the unit more reliable' },
  module: 'eng.reliability',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.reliability, the scene that explains it and its tile
  topics: {
    failure: { scene: 's2', cue: 'tFail' },
    risk: { scene: 's3', cue: 'tRisk' },
    strategy: { scene: 's4', cue: 'tStrat' },
    decide: { scene: 's5', cue: 'tDec' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De unit betrouwbaarder maken', en: 'Making the unit more reliable' },
      beats: [
        { nl: 'De vuleenheid van lijn 3 valt soms uit. Dan staat de hele lijn stil.', en: 'The filling unit of line 3 sometimes fails. Then the whole line stands still.', focus: ['unitS', 'unit', 'line3'] },
        { nl: 'De module Betrouwbaarheid en assetstrategie gaat over hoe onderdelen falen en wat je daaraan doet.', en: 'The module Reliability and asset strategy is about how parts fail and what you do about it.', focus: ['modS', 'unit'] },
        { nl: 'Jij bent de engineer. Na de dienst maak je met de teamleider de unit betrouwbaarder.', en: 'You are the engineer. After the shift you and the team lead make the unit more reliable.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst weet je hoe onderdelen falen en welk onderdeel het zwaarst weegt.', en: 'First you know how parts fail and which part weighs most.', focus: 'grpA' },
        { nl: 'Dan kies je welk onderhoud past en laat je de cijfers besluiten.', en: 'Then you choose which maintenance fits and let the numbers decide.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Falen en faalpatronen', en: 'Failure and its patterns' },
      beats: [
        { nl: 'Het eerste onderwerp is Falen en faalpatronen. Je kijkt eerst hoe een onderdeel van de unit faalt.', en: 'The first topic is Failure and its patterns. First you look at how a part of the unit fails.', focus: ['tFail', 'failS', 'unit'] },
        { nl: 'Een onderdeel faalt als de belasting hoger is dan de sterkte.', en: 'A part fails when the load on it is higher than its strength.', focus: ['loadS', 'unit'] },
        { nl: 'Slijtage geeft meestal een waarschuwing. Een plotselinge overbelasting niet.', en: 'Wear usually gives a warning. A sudden overload does not.', focus: ['warnS', 'unit'] },
        { nl: 'Het patroon in de storingsdata zie je met een Weibull-fit.', en: 'You see the pattern in the failure data with a Weibull fit.', focus: ['tool1', 'weibS', 'unit'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'FMEA en kritikaliteit', en: 'FMEA and criticality' },
      beats: [
        { nl: 'Het tweede onderwerp is FMEA en kritikaliteit. Niet elk onderdeel telt even zwaar.', en: 'The second topic is FMEA and criticality. Not every part counts the same.', focus: ['tRisk', 'partsS', 'unit'] },
        { nl: 'Je kijkt wat er gebeurt als het uitvalt, en hoe waarschijnlijk dat is.', en: 'You look at what happens when it fails, and how likely that is.', focus: ['critS', 'unit'] },
        { nl: 'Je zet de onderdelen in een {t:Risicomatrix|risicomatrix} en maakt een {t:FMECA|FMECA}.', en: 'You put the parts in a {t:Risk matrix|risk matrix} and make an {t:FMECA|FMECA}.', cue: { Risicomatrix: 'tool1', FMECA: 'tool2' }, focus: ['tool1', 'tool2', 'matS', 'matrix', 'fmeca'] },
        { nl: 'Het gemarkeerde vak staat voor een groot gevolg en een grote kans. Dat onderdeel pak je eerst aan.', en: 'The marked cell stands for a big consequence and a high likelihood. You tackle that part first.', focus: ['markS', 'matrix'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'RCM en assetstrategie', en: 'RCM and asset strategy' },
      beats: [
        { nl: 'Het derde onderwerp is RCM en assetstrategie. Je kiest welk onderhoud elk onderdeel echt nodig heeft.', en: 'The third topic is RCM and asset strategy. You choose which maintenance each part really needs.', focus: ['tStrat', 'rcmS', 'unit'] },
        { nl: 'Je begint bij wat de unit moet doen, met een eis erbij.', en: 'You start with what the unit must do, with a standard in it.', focus: ['funcS', 'unit'] },
        { nl: 'Een beveiliging kan uitvallen zonder dat iemand het merkt.', en: 'A protection can fail without anyone noticing.', focus: ['hidS', 'unit'] },
        { nl: 'Die test je met een {t:Failure-finding-taak|failure-finding-taak}.', en: 'You test it with a {t:Failure-finding task|failure-finding task}.', ...TOOL('Failure-finding-taak'), focus: ['tool1', 'ffS', 'unit'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Betrouwbaarheidsdata en besluiten', en: 'Reliability data and decisions' },
      beats: [
        { nl: 'Het vierde onderwerp is Betrouwbaarheidsdata en besluiten. Je laat de cijfers zeggen wat loont.', en: 'The fourth topic is Reliability data and decisions. You let the numbers say what pays off.', focus: ['tDec', 'dataS', 'unit'] },
        { nl: 'Je telt hoe vaak de unit uitvalt en hoe lang hij dan stilstaat.', en: 'You count how often the unit fails and how long it then stands still.', focus: ['countS', 'unit'] },
        { nl: 'In veel fabrieken is wachten het grootste deel van de stilstand, niet de reparatie.', en: 'In many plants waiting is the biggest share of the downtime, not the repair.', focus: ['waitS', 'unit'] },
        { nl: 'Je rekent de {t:Operationele beschikbaarheid|operationele beschikbaarheid} uit.', en: 'You work out the {t:Operational availability|operational availability}.', ...TOOL('Operationele beschikbaarheid'), focus: ['tool1', 'opS', 'unit'] },
        { nl: 'Zo maak je de unit betrouwbaarder, waar het telt.', en: 'That is how you make the unit more reliable, where it counts.', focus: ['endS', 'jij', 'teamlead', 'unit'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het vierde station is Betrouwbaarheid en assetstrategie, in De fabriek beter maken.', en: 'The whole map. The fourth station is Reliability and asset strategy, in Making the plant better.', focus: 'map-reliability' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Each topic has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met hoe onderdelen fysiek falen. Zo weet je wat er stukgaat en waarom.', en: 'Start at Basics level with how parts physically fail. It shows what breaks and why.', focus: ['tFail', 'start'] },
        { nl: 'Op niveau Werkkennis komen storingsdata lezen, FMEA op installaties, RCM en waar de stilstand blijft.', en: 'At Working knowledge level come reading failure data, FMEA on plant, RCM and where the downtime goes.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen grondoorzaken, reserve-units, een betrouwbaarheidsprogramma en reservedelen.', en: 'At Advanced level come root causes, standby units, a reliability programme and spare parts.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen levensduurdata fitten, risico in euro’s, assetmanagement en levensduurkosten.', en: 'At Expert level come fitting life data, risk in euros, asset management and life-cycle cost.', focus: 'lv4' },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says is what the captions show (as in the other module intros): short sentences, few commas, no colons and no
// symbols the voice would read aloud. Each topic scene ends on one short sentence naming the tool of that topic's lessons, without
// explaining it. Every drawn detail has its reason in the narration: the unit and the belt (line 3, where the unit fails), the two
// boards (the risk matrix and the FMECA the sentence names, and the marked cell the next sentence explains), you and the team lead
// (the ones who stay after the shift).
// Two words the voice reads wrong, said in a variant of the beat (not in a SAY rule, so no other film changes): FMEA as letters (espeak-ng
// reads "fmeea", with no vowel for f and m; the quality intro leaves it out of the voice) and failure-finding as "feeljer-fainding" ("fajluure").
// FMECA is said as letters by the SAY rule of the field film (the same phrase "en maakt een FMECA", "and make an FMECA"); the
// Weibull-fit, risicomatrix, RCM and the level words are read right.
spec.scenes.forEach((s) => s.beats.forEach((b) => {
  b.say = {
    nl: b.nl.replace(/\bFMEA\b/g, 'F M E A').replace('{t:Failure-finding-taak|failure-finding-taak}', 'feeljer-fainding-taak'),
    en: b.en.replace(/\bFMEA\b/g, 'F M E A').replace('{t:Failure-finding task|failure-finding task}', 'failure-finding task'),
  };
}));
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
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-face));stroke:var(--anatomy-lo);stroke-width:.35}
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

/* the lines of the FMECA sheet read at phone width: a little heavier than the kit's hairline */
[data-cue="fmeca"] .pm-rule{stroke-width:.9}

/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');




const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Later komen aan de zijwand twee borden: een risicomatrix van drie bij drie met het vak rechtsboven gemarkeerd, en een FMECA-blad met een kopregel en drie rijen. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: een unit die uitvalt en een lijn die stilstaat, de route in twee groepen, een onderdeel dat faalt, een belasting die hoger is dan de sterkte, slijtage met een waarschuwing en overbelasting zonder, uitvalpunten met een Weibull-curve, onderdelen van ongelijk gewicht, een gevolg en een kans, een risicomatrix en een FMECA-blad, het gemarkeerde vak dat je eerst aanpakt, welk onderhoud elk onderdeel nodig heeft, een functie met werkwoord, object en eis, een beveiliging die stil uitvalt, een test op een vast interval, cijfers die tot een besluit leiden, hoe vaak en hoe lang, repareren tegenover wachten, draaitijd en de hele stop, en een unit die betrouwbaarder wordt waar het telt. Aan het eind de hele kaart van Engineering met Betrouwbaarheid en assetstrategie verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. Later two boards appear on the side wall: a risk matrix of three by three with the cell at the top right marked, and an FMECA sheet with a header and three rows. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: a unit that fails and a line that stands still, the route in two groups, a part that fails, a load higher than the strength, wear with a warning and overload without, failure points with a Weibull curve, parts of unequal weight, a consequence and a likelihood, a risk matrix and an FMECA sheet, the marked cell you tackle first, which maintenance each part needs, a function with a verb, an object and a standard, a protection that fails silently, a test on a fixed interval, numbers that lead to a decision, how often and how long, repairing against waiting, running time and the whole stop, and a unit that becomes more reliable where it counts. At the end the whole map of Engineering with Reliability and asset strategy lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

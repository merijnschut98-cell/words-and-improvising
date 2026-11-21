// Dev tool, not shipped. Builds the module intro film "De vuleenheid heel houden / Keeping the filling unit whole" for Maintenance
// (eng.maintenance), an Engineering module intro film (v17, Task 13) and the third intro of the zone "De fabriek draaiend houden"
// (eng.field.run): the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved
// intros films/eng.flow.intro, eng.lines.intro and eng.industry40.intro (one clear tool per topic, as short as the content
// allows, nothing labelled before it is named, no SAY rule that is not needed) and the notes section "Engineering module intros".
//
//   node films/eng.maintenance.intro/build.mjs            build the page
//   node films/eng.maintenance.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.maintenance.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.maintenance's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.run ("Een dienst op lijn 3": the filling unit stands over the belt of
// line 3, you and the team lead keep it going for a whole shift; its station Onderhoud says the unit has to stay whole: at the
// start of the shift you walk a round past it with the standard on its board, a deviation gets a tag on the unit, the rest goes
// in the CMMS on the laptop; the tools are the CILT standard and the CMMS). This film follows HOW THE UNIT STAYS WHOLE THROUGH A
// SHIFT, topic by topic, in the room of the field film: the belt with its cartons, the filling unit over it, you and the team
// lead at the front. What the field film's station draws comes in at the sentence that gives it its reason: the tag on the
// unit's front upright (where a deviation gets a label), the CILT standard on its board on two posts beside the unit (the
// sentence that names it), the laptop on its table at the front left (the sentence that names the CMMS). Without the field
// film's tank, stop log, check table and isolator: other stations own them. The strategies, the planning and the measures are
// schemas in the panel: the field film's room has no gearbox, no stores and no clock, so none is drawn there.
//   s1 the unit must run the whole shift; the module goes from breakdown to predictive and covers the numbers that show whether
//      maintenance works (the module's blurb); you and the team lead keep the unit whole; the map before any detail: four topics
//      in two groups (what maintenance you choose and who does it, with strategies and TPM; how you prepare and measure it,
//      with planning and spare parts and with measuring)
//   s2 Onderhoudsstrategieën: four ways (repair after the breakdown, at a fixed interval, on condition, on a forecast; Basis,
//      .strategies); parts wear with age or fail at random, so a fixed interval does not fit everything (Werkkennis, .failure);
//      the tool is the bathtub curve (Werkkennis, .failure), the chart of failure chance against age, which "holds for only
//      part of the equipment". The topic has no real tool at Basis (the four strategies are ways of working, RCM is only named
//      and handed to the reliability module, a hand meter is no term) and at Werkkennis the others are the Weibull fit, which
//      belongs to eng.reliability: the badkuipkromme is the most tool-like term (a chart you read)
//   s3 TPM en autonoom onderhoud: operators do the basic care themselves (Basis, .tpm); they clean, inspect, lubricate and
//      tighten, and anything that is off gets a tag (Basis, .tpm); the tool is the CILT standard (Werkkennis, .cilt), the sheet
//      at the machine, the field film's own tool of this station
//   s4 Werkvoorbereiding, planning en reservedelen: a job is prepared before anyone picks up a spanner, with steps, parts and tools,
//      and the week is filled up to the hours available (Werkkennis, .planning); the tool is the CMMS (Basis, .cmms), the field
//      film's other tool: the database where a work order runs from notification to closing
//   s5 Onderhoud meten: how often the unit stops and how long it takes (Basis, .metrics); how many of the hours were planned
//      work (Werkkennis, .workmix); the tool is work sampling, the multimomentopname (Werkkennis, .workmix), observing at random
//      moments what a technician does. The story ends here: the unit stays whole for the whole shift
//   s6 the shared Engineering map (the kit's mapScene) with Maintenance lit, then the module's four topics with their levels as
//      columns, where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40 and gridplanning intros: one clear tool per topic; drop what is not needed; nothing
// labelled before it is named; a Werkkennis tool named in a scene (bathtub curve, CILT standard, work sampling) is not named again
// in the closing grid; no other intro names one of these tools (the CMMS and the CILT standard are the field film's).
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
const MOD = MODULES.find((m) => m.id === 'eng.maintenance');
const LEVELS = {
  strategy: ['eng.maintenance.strategies', 'eng.maintenance.failure', 'eng.maintenance.condition', 'eng.maintenance.pmreview'],
  tpm: ['eng.maintenance.tpm', 'eng.maintenance.cilt', 'eng.maintenance.amsteps', 'eng.maintenance.pillars'],
  planning: ['eng.maintenance.cmms', 'eng.maintenance.planning', 'eng.maintenance.stores', 'eng.maintenance.shutdown'],
  measure: ['eng.maintenance.metrics', 'eng.maintenance.workmix', 'eng.maintenance.kpiset', 'eng.maintenance.cost'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.maintenance has the four topics and levels this film draws');
assert(MOD.intro === 'eng.maintenance.intro', 'eng.maintenance names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb
assert(MOD.blurb.nl.includes('Van storing tot voorspellend') && MOD.blurb.nl.includes('de cijfers die laten zien of onderhoud werkt'), 'the module blurb (nl) goes from breakdown to predictive and names the numbers');
assert(MOD.blurb.en.includes('From breakdown to predictive') && MOD.blurb.en.includes('the numbers that show whether maintenance works'), 'the module blurb (en) goes from breakdown to predictive and names the numbers');
// s2: the four strategies; parts wear with age or fail at random; the bathtub curve holds for only part of the equipment
has('eng.maintenance.strategies', ['Correctief onderhoud', 'Preventief onderhoud gaat op tijd of gebruik: je onderhoudt of vervangt met een vast interval', 'Toestandsafhankelijk onderhoud: je meet de conditie', 'Predictief onderhoud gaat een stap verder: je gebruikt de trend om te voorspellen']);
has('eng.maintenance.strategies', ['Reactive maintenance, also called run-to-failure', 'Preventive maintenance is time- or usage-based: you service or replace at a fixed interval', 'Condition-based maintenance: you measure the condition', 'Predictive maintenance goes one step further: you use the trend to forecast'], 'en');
has('eng.maintenance.failure', ['de badkuipkromme (bathtub curve): een grafiek van de faalkans tegen de leeftijd', 'Slijtage', 'Willekeurig falen', 'geldt maar voor een deel van de apparatuur', 'Het schoolboek suggereert dat alle apparatuur zo werkt. Dat klopt niet', 'een onderdeel dat willekeurig faalt op schema vervangen, vermindert de storingen niet']);
has('eng.maintenance.failure', ['the bathtub curve: a graph of failure rate against age', 'Wear', 'Random failure', 'true for only some equipment', 'The textbook suggests all equipment looks like this. It doesn’t', 'replacing a randomly failing part on a schedule does not reduce failures'], 'en');
// s3: operators do the basic care; clean, inspect, lubricate, tighten; a tag on every abnormality; the CILT standard is one sheet at the machine
has('eng.maintenance.tpm', ['Autonoom onderhoud (AM): operators zijn eigenaar van de basiszorg', 'Ze maken schoon, inspecteren, smeren en draaien aan (CILT), en ze zien afwijkingen en hangen er een label aan']);
has('eng.maintenance.tpm', ['Autonomous maintenance (AM): operators own basic care', 'They clean, inspect, lubricate and tighten (CILT), and spot and tag abnormalities'], 'en');
has('eng.maintenance.cilt', ['Een CILT-standaard is het blad van één pagina bij de machine', 'CILT-standaard Eén blad bij de machine met elke controle']);
has('eng.maintenance.cilt', ['A CILT standard is the one-page sheet at the machine', 'CILT standard One sheet at the machine listing each check'], 'en');
// s4: a job is prepared before anyone picks up a spanner (steps, parts, tools); the week is filled up to the hours available; the CMMS runs a work order from notification to closing
has('eng.maintenance.planning', ['Werkvoorbereiding (planning) maakt een klus klaar voordat iemand een sleutel pakt', 'de stappen, de onderdelen met hun nummers, speciaal gereedschap', 'Vul ze met voorbereide klussen op volgorde van prioriteit: de weekplanning']);
has('eng.maintenance.planning', ['Planning prepares a job before anyone picks up a spanner', 'the steps, the parts and their numbers, special tools', 'Fill them with planned jobs in order of priority: the weekly schedule'], 'en');
has('eng.maintenance.cmms', ['Een CMMS (computerised maintenance management system, een onderhoudsmanagementsysteem) is de onderhoudsdatabase', 'Zo loopt een werkorder: melding (iemand meldt een probleem)', 'afgemeld met terugkoppeling', 'gesloten']);
has('eng.maintenance.cmms', ['A CMMS (computerised maintenance management system) is the maintenance database', 'Work order flow: notification (someone reports a problem)', 'closed'], 'en');
// s5: how often and how long (MTBF and MTTR); planned work against all hours; work sampling at random moments
has('eng.maintenance.metrics', ['MTBF (mean time between failures)', 'Het meet betrouwbaarheid (reliability): hoe vaak gaat de machine stuk', 'Het meet onderhoudbaarheid (maintainability): hoe snel heb je de machine weer draaiend']);
has('eng.maintenance.metrics', ['MTBF (mean time between failures)', 'It measures reliability: how often the machine breaks', 'It measures maintainability: how fast you get the machine running again'], 'en');
has('eng.maintenance.workmix', ['Gepland werk (planned work)', 'De nuttige splitsing voor een consultant is geplande tegen ongeplande uren', 'multimomentopname (work sampling): een waarnemer noteert op willekeurige momenten wat elke monteur doet']);
has('eng.maintenance.workmix', ['Planned work', 'planned against unplanned hours', 'work sampling study: an observer notes at random moments what each technician is doing'], 'en');
// s6: the first lesson names the four strategies (where to start); the later levels, as the lessons are titled
for (const [id, word] of [['eng.maintenance.strategies', 'Vier onderhoudsstrategieën'], ['eng.maintenance.failure', 'Hoe machines echt falen'], ['eng.maintenance.cilt', 'standaard schrijven'], ['eng.maintenance.planning', 'Werkvoorbereiding'], ['eng.maintenance.workmix', 'Waar de onderhoudsuren heen gaan'],
  ['eng.maintenance.condition', 'Conditiemonitoring'], ['eng.maintenance.amsteps', 'De zeven AM-stappen'], ['eng.maintenance.stores', 'Reservedelen'], ['eng.maintenance.kpiset', 'onderhouds-KPI'],
  ['eng.maintenance.pmreview', 'PM-plan doorlichten'], ['eng.maintenance.pillars', 'TPM als programma'], ['eng.maintenance.shutdown', 'Geplande stilstanden'], ['eng.maintenance.cost', 'Onderhoudskosten']]) has(id, [word]);
for (const [id, word] of [['eng.maintenance.strategies', 'Four maintenance strategies'], ['eng.maintenance.failure', 'How equipment really fails'], ['eng.maintenance.cilt', 'CILT standard'], ['eng.maintenance.planning', 'Planning and scheduling'], ['eng.maintenance.workmix', 'Where maintenance hours go'],
  ['eng.maintenance.condition', 'Condition monitoring'], ['eng.maintenance.amsteps', 'The seven AM steps'], ['eng.maintenance.stores', 'Spare parts'], ['eng.maintenance.kpiset', 'KPI set'],
  ['eng.maintenance.pmreview', 'Reviewing a PM plan'], ['eng.maintenance.pillars', 'TPM as a programme'], ['eng.maintenance.shutdown', 'Planned shutdowns'], ['eng.maintenance.cost', 'Maintenance cost']]) has(id, [word], 'en');
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
const at = w.at;
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the run field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the CILT standard on its board on two posts
// beside the unit, a tag on the unit's front upright, the laptop on its table at the front left, you and the team lead at the
// front. Without the field film's tank, stop log, check table and isolator: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 }; // the table with the laptop (the CMMS)
const CILT = { x: 104, y: 84, w: 26, d: 3, z0: 74, z1: 126 }; // the CILT standard on its board
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// a few short strokes on a face: [x0, x1, z] on the plane y (the +y face of the board)
const strokes = (y, rows, tone = 'lo') => k.lineSvg(rows.map(([x0, x1, z]) => k.pathOf([at([x0, y, z]), at([x1, y, z])])).join(''), { tone });
// the CILT standard: one sheet on a board on two posts (its checks as rows), and a tag on the front upright of the unit
const ciltBoard = w.post(CILT.x + 4, CILT.y + 1.5, 1.8, 0, CILT.z0, { tone: 'lo' }, 10) + w.post(CILT.x + CILT.w - 4, CILT.y + 1.5, 1.8, 0, CILT.z0, { tone: 'lo' }, 10)
  + w.box({ x: CILT.x, y: CILT.y, w: CILT.w, d: CILT.d, r: 0.8 }, CILT.z0, CILT.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + strokes(CILT.y + CILT.d + 0.3, [0, 1, 2, 3].map((i) => [CILT.x + 4, CILT.x + CILT.w - 4 - (i % 2) * 5, CILT.z1 - 9 - i * 10]));
const tag = w.box({ x: UX + 9, y: 53, w: 4, d: 7, r: 0.8 }, 66, 98, { tone: 'hi' }, { steps: 1 });

// painted back to front: the belt and the unit, the CILT board and the tag (shown from the sentences that name them), the
// laptop table (from the sentence that names the CMMS), you and the team lead (from the sentence that names you)
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-cilt', cueG('cilt', ciltBoard)),
  g('o-tag', cueG('tag', tag)),
  g('o-lap', cueG('laptop', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 }))),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Capacity and flow is a cue group of its own (map-flow).
const TILE = { strategy: 'tStrat', tpm: 'tTpm', planning: 'tPlan', measure: 'tMeas' };
const PANEL = ['unitS', 'modS', 'shiftS', 'grpA', 'grpB', 'ladS', 'wearS', 'bathS', 'opS', 'cyclS', 'sheetS', 'p3S', 'jobS', 'weekS', 'cmmsS', 'cntS', 'hrsS', 'smpS', 'endS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Capacity and flow lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.maintenance'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.maintenance');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.maintenance')}"`), 'the map lights eng.maintenance as a cue group');
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
  { from: cam(150, 40, 70, 1.15), to: cam(150, 40, 70, 1.25) }, // s2 the unit over the belt: the parts that wear
  { from: cam(120, 55, 70, 1.2), to: cam(120, 55, 70, 1.32) }, // s3 the tag on the unit and the CILT standard on its board
  { from: cam(120, 75, 60, 1.05), to: cam(120, 75, 60, 1.12) }, // s4 the unit, the board and the laptop at the front left
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.05) }, // s5 the whole hall, you and the team lead
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.maintenance.intro',
  title: { nl: 'De vuleenheid heel houden', en: 'Keeping the filling unit whole' },
  module: 'eng.maintenance',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.maintenance, the scene that explains it and its tile
  topics: {
    strategy: { scene: 's2', cue: 'tStrat' },
    tpm: { scene: 's3', cue: 'tTpm' },
    planning: { scene: 's4', cue: 'tPlan' },
    measure: { scene: 's5', cue: 'tMeas' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De vuleenheid heel houden', en: 'Keeping the filling unit whole' },
      beats: [
        { nl: 'De vuleenheid van lijn 3 moet de hele dienst blijven draaien.', en: 'The filling unit of line 3 has to keep running for the whole shift.', focus: ['unitS', 'line3', 'unit'] },
        { nl: 'De module Onderhoud gaat van storing tot voorspellend en over de cijfers die tonen of het werkt.', en: 'The module Maintenance goes from breakdown to predictive and covers the numbers that show whether it works.', focus: ['modS', 'line3', 'unit'] },
        { nl: 'Jij bent de engineer. Met de teamleider houd je de eenheid een hele dienst heel.', en: 'You are the engineer. With the team lead you keep the unit whole through a shift.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst wat voor onderhoud je kiest en wie het doet, met strategieën en met TPM.', en: 'First what maintenance you choose and who does it, with strategies and with TPM.', focus: 'grpA' },
        { nl: 'Dan hoe je het voorbereidt en meet, met planning en reservedelen en met onderhoud meten.', en: 'Then how you prepare and measure it, with planning and spare parts and with measuring maintenance.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Onderhoudsstrategieën', en: 'Maintenance strategies' },
      beats: [
        { nl: 'Het eerste onderwerp is Onderhoudsstrategieën. Er zijn er vier.', en: 'The first topic is Maintenance strategies. There are four.', focus: ['tStrat', 'ladS', 'unit'] },
        { nl: 'Je repareert na de storing, op een vast interval, op de conditie of op een voorspelling.', en: 'You repair after the breakdown, at a fixed interval, on condition or on a forecast.', focus: ['ladS', 'unit'] },
        { nl: 'Sommige onderdelen slijten met de leeftijd, andere falen willekeurig. Een vast interval past dus niet overal.', en: 'Some parts wear with age and others fail at random. A fixed interval does not fit everything.', focus: ['wearS', 'unit'] },
        { nl: 'De faalkans tegen de leeftijd lees je in een {t:Badkuipkromme|badkuipkromme}, al geldt die maar voor een deel.', en: 'You read the failure rate against age in a {t:Bathtub curve|bathtub curve}, though it holds for only some equipment.', ...TOOL('Badkuipkromme'), focus: ['tool1', 'bathS'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'TPM en autonoom onderhoud', en: 'TPM and autonomous maintenance' },
      beats: [
        { nl: 'Het tweede onderwerp is TPM en autonoom onderhoud. Operators doen zelf de basiszorg.', en: 'The second topic is TPM and autonomous maintenance. Operators do the basic care themselves.', focus: ['tTpm', 'opS', 'unit'] },
        { nl: 'Ze maken schoon, inspecteren, smeren en draaien aan. Wat afwijkt, krijgt een label.', en: 'They clean, inspect, lubricate and tighten. Anything that is off gets a tag.', focus: ['cyclS', 'tag', 'unit'] },
        { nl: 'De controles staan op een {t:CILT-standaard|CILT-standaard} bij de eenheid.', en: 'The checks are on a {t:CILT standard|CILT standard} at the unit.', ...TOOL('CILT-standaard'), focus: ['tool1', 'sheetS', 'cilt'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Werkvoorbereiding, planning en reservedelen', en: 'Planning, scheduling and spare parts' },
      beats: [
        { nl: 'Het derde onderwerp is Werkvoorbereiding, planning en reservedelen.', en: 'The third topic is Planning, scheduling and spare parts.', focus: ['tPlan', 'p3S'] },
        { nl: 'Je maakt een klus klaar met stappen, onderdelen en gereedschap, voordat iemand een sleutel pakt.', en: 'You prepare a job with steps, parts and tools before anyone picks up a spanner.', focus: ['jobS', 'unit'] },
        { nl: 'Dan vul je de week met klussen, tot de beschikbare uren.', en: 'Then you fill the week with jobs, up to the hours available.', focus: ['weekS', 'unit'] },
        { nl: 'Op de laptop staat het {t:CMMS|CMMS}, van melding tot afsluiting.', en: 'On the laptop is the {t:CMMS|CMMS}, from notification to closing.', ...TOOL('CMMS'), focus: ['tool1', 'cmmsS', 'laptop'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Onderhoud meten', en: 'Measuring maintenance' },
      beats: [
        { nl: 'Het vierde onderwerp is Onderhoud meten. Je telt hoe vaak de eenheid stilvalt en hoe lang dat duurt.', en: 'The fourth topic is Measuring maintenance. You count how often the unit stops and how long it takes.', focus: ['tMeas', 'cntS', 'unit'] },
        { nl: 'Je kijkt ook hoeveel van alle uren gepland werk waren.', en: 'You also look at how many of all the hours were planned work.', focus: ['hrsS'] },
        { nl: 'Waar de tijd van een monteur heen gaat, meet je met een {t:Multimomentopname|multimomentopname}.', en: 'Where a technician’s time goes, you measure with {t:Work sampling|work sampling}.', ...TOOL('Multimomentopname'), focus: ['tool1', 'smpS'] },
        { nl: 'Zo blijft de vuleenheid van lijn 3 de hele dienst heel.', en: 'That is how the filling unit of line 3 stays whole for the whole shift.', focus: ['endS', 'jij', 'teamlead', 'unit'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het derde station is Onderhoud, in De fabriek draaiend houden.', en: 'The whole map. The third station is Maintenance, in Keeping the plant running.', focus: 'map-maintenance' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met de vier onderhoudsstrategieën. Daaruit volgt wat bij elke machine past.', en: 'Start at Basics level with the four maintenance strategies. They tell you what fits each machine.', focus: ['tStrat', 'start'] },
        { nl: 'Op niveau Werkkennis komen falen, een standaard schrijven, werkvoorbereiding en waar de uren heen gaan.', en: 'At Working knowledge level come failure, writing a standard, planning the work and where the hours go.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen conditiemonitoring, de zeven stappen, reservedelen en een set KPI’s.', en: 'At Advanced level come condition monitoring, the seven steps, spare parts and a set of KPIs.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen een plan doorlichten, TPM als programma, geplande stilstanden en de kosten.', en: 'At Expert level come reviewing a plan, TPM as a programme, planned shutdowns and the cost.', focus: 'lv4' },
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
// stop board (the downtime log you keep on it), you and the team lead (the ones who keep the line on pace for the shift).
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Later komen erbij een label aan de voorste stijl van de eenheid, een CILT-standaard op een bord op twee palen naast de eenheid, en links voor een tafel met een laptop voor het CMMS. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: de vuleenheid en een hele dienst, de route in twee groepen, de vier onderhoudsstrategieën, een onderdeel dat slijt en een onderdeel dat willekeurig faalt, een badkuipkromme, operators en basiszorg, schoonmaken, inspecteren, smeren en aandraaien met een label, een CILT-standaard als blad met controles, werkvoorbereiding, planning en reservedelen, een klus met stappen, onderdelen en gereedschap, een week met klussen, het CMMS van melding tot afsluiting, hoe vaak en hoe lang de eenheid stilvalt, gepland werk tegen alle uren, een multimomentopname op willekeurige momenten en een dienst waarin de eenheid heel blijft. Aan het eind de hele kaart van Engineering met Onderhoud verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. Later come a tag on the front upright of the unit, a CILT standard on a board on two posts beside the unit, and at the front left a table with a laptop for the CMMS. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: the filling unit and a whole shift, the route in two groups, the four maintenance strategies, a part that wears and a part that fails at random, a bathtub curve, operators and basic care, cleaning, inspecting, lubricating and tightening with a tag, a CILT standard as a sheet of checks, planning and spare parts, a job with steps, parts and tools, a week of jobs, the CMMS from notification to closing, how often and how long the unit stops, planned work against all hours, work sampling at random moments and a shift in which the unit stays whole. At the end the whole map of Engineering with Maintenance lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

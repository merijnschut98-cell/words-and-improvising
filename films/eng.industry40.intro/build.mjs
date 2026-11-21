// Dev tool, not shipped. Builds the module intro film "Lijn 3 en haar cijfers / Line 3 and its numbers" for Data and digital
// manufacturing (eng.industry40), an Engineering module intro film (v17, Task 13) and the fifth and last intro of the digital
// zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the
// thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved digital intros
// films/eng.itbasics.intro, eng.ot.intro, eng.cyber.intro and eng.lines.intro (their tools router, virtual machine, query,
// web application, information flow, production order, OPC server, tag, machine builder, report button, zone, conduit, annexes,
// manual fallback procedure, stack light, teach pendant, poka-yoke, interlock, recipe, ladder diagram and payback time are not
// repeated; one clear tool per topic, as short as the content allows, nothing labelled before it is named) and the notes
// section "Engineering module intros".
//
//   node films/eng.industry40.intro/build.mjs            build the page
//   node films/eng.industry40.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.industry40.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.industry40's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.digital ("Automatisering en IT": the filling unit stands over the belt
// of line 3, you, the engineer, connect it step by step; its fifth and last station, Data en digitale productie, says the unit's
// numbers go to the MES and to a screen by the line, that you use an edge gateway and a dashboard, and that without it the
// numbers come too late or are wrong). This film follows HOW LINE 3'S NUMBERS BECOME DECISIONS, topic by topic, in the room of
// the field film: the belt with its cartons, the filling unit over it, the PLC cabinet at the back wall with the edge box on top,
// the screen on the back wall at the right, the MES laptop on the table at the front and you at the front right. Data quality,
// the data platform and the models are schemas in the panel: the field film's room has no database, no model and no camera, so
// none is drawn there. The MES table and the screen appear at the sentence that gives each its reason (the unit's numbers go to
// them), the PLC cabinet and the edge box at the sentence that reads the numbers from the cabinet.
//   s1 the numbers of line 3 become decisions (the module's blurb); the numbers go to the MES and to a screen by the line (the
//      field film's own sentence); the map before any detail: four topics in two groups (the numbers themselves, with data
//      quality and dashboards; what carries them further, with integration and AI and models)
//   s2 Datakwaliteit: good data are fit for the use you have in mind (Basis, .dimensions); the unit's numbers have to be on time
//      (timeliness) and right (accuracy), the field film's "too late or wrong"; the tool is the edge gateway (Werkkennis,
//      .machinedata), the field film's tool: you read the numbers from the PLC cabinet with it
//   s3 Dashboards en visueel sturen: a KPI shows whether you are on track for a goal, seen at a glance by the line (Basis, .kpi);
//      the tool is the dashboard (Basis, .kpi), the field film's other tool. KPI and dashboard design belong to a future
//      Performance subject: here only what the lesson says
//   s4 Integratie: where each number is born, the PLC or the MES (Basis, .stack); a data platform brings the sources together
//      for reports (Werkkennis, .pipeline); the tool is the data warehouse (Werkkennis, .pipeline), the store of cleaned tables
//   s5 AI en modellen: a model learns a pattern from examples (Basis, .ml); it is only as good as its data and few plants have
//      examples of failures (Basis .ml, Werkkennis .predictive); the tool is anomaly detection (Werkkennis, .predictive: it
//      learns what normal looks like and flags what departs; different is not always broken). The AI topic has no physical
//      tool, so this is the most tool-like term (a method you run on the numbers). The story ends here: the numbers become decisions
//   s6 the shared Engineering map (the kit's mapScene) with Data and digital manufacturing lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of the digital intros: one clear tool per topic; drop what is not needed; nothing labelled before it is named; a
// Werkkennis tool named in a scene (edge gateway, data warehouse, anomaly detection) is not named again in the closing grid; the
// tools of the other digital intros (and the PLC, which this module only reads from) are not repeated.
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
const MOD = MODULES.find((m) => m.id === 'eng.industry40');
const LEVELS = {
  quality: ['eng.industry40.dimensions', 'eng.industry40.machinedata', 'eng.industry40.mes', 'eng.industry40.dqrules'],
  dashboards: ['eng.industry40.kpi', 'eng.industry40.powerbi', 'eng.industry40.floor', 'eng.industry40.alerts'],
  integration: ['eng.industry40.stack', 'eng.industry40.pipeline', 'eng.industry40.ownership', 'eng.industry40.case'],
  ai: ['eng.industry40.ml', 'eng.industry40.predictive', 'eng.industry40.vision', 'eng.industry40.twin'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.industry40 has the four topics and levels this film draws');
assert(MOD.intro === 'eng.industry40.intro', 'eng.industry40 names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb; the numbers go to the MES and to a screen by the line (the field film says so; the stack lesson names the MES)
assert(MOD.blurb.nl.includes('Datakwaliteit, KPI-dashboards en Power BI'), 'the module blurb (nl) names data quality and dashboards');
assert(MOD.blurb.en.includes('Data quality, KPI dashboards and Power BI'), 'the module blurb (en) names data quality and dashboards');
assert(MOD.blurb.nl.includes('AI') && MOD.blurb.en.includes('AI'), 'the module blurb names AI');
has('eng.industry40.stack', ['MES (manufacturing execution system) regelt orders per lijn']);
has('eng.industry40.stack', ['MES (manufacturing execution system) handles orders per line'], 'en');
// s2: data quality is fitness for use; timeliness and accuracy; the edge gateway
has('eng.industry40.dimensions', ['Datakwaliteit betekent: data die geschikt zijn voor het gebruik dat je voor ogen hebt', 'Tijdigheid Of de data beschikbaar zijn op het moment dat de beslissing valt', 'Juistheid Of een waarde klopt met wat er in werkelijkheid gebeurde']);
has('eng.industry40.dimensions', ['Data quality means data fit for the use you have in mind', 'Timeliness Whether data are available when the decision that needs them is made', 'Accuracy Whether a value matches what really happened'], 'en');
has('eng.industry40.machinedata', ['Edge gateway Kleine computer bij de machines die hun data uitleest, buffert en doorstuurt']);
has('eng.industry40.machinedata', ['Edge gateway Small computer near the machines that reads, buffers and forwards their data'], 'en');
// s3: a KPI, the dashboard
has('eng.industry40.kpi', ['Een KPI, een key performance indicator, is een getal dat laat zien of je op koers ligt voor een doel', 'op één scherm, zodat je het in één oogopslag kunt volgen', 'Dashboard Een visuele weergave van de belangrijkste informatie']);
has('eng.industry40.kpi', ['A KPI, a key performance indicator, is a number that shows whether you are on track for a goal', 'arranged on a single screen so it can be monitored at a glance', 'Dashboard A visual display of the most important information'], 'en');
// s4: where each number is born, the data platform, the data warehouse
has('eng.industry40.stack', ['Voordat je een rapport bouwt, moet je weten waar elk getal geboren wordt', 'Een PLC (programmable logic controller), de industriële computer in de besturingskast']);
has('eng.industry40.stack', ['Before you build a report, know where each number is born', 'A PLC (programmable logic controller), the industrial computer in the control cabinet'], 'en');
has('eng.industry40.pipeline', ['Een dataplatform is het geheel van tools dat data uit veel bronnen samenbrengt voor analyse', 'Een datawarehouse bevat gestructureerde, opgeschoonde tabellen met een vast ontwerp, gebouwd voor rapportage']);
has('eng.industry40.pipeline', ['A data platform is the set of tools that brings data from many sources together for analysis', 'A data warehouse holds structured, cleaned tables with a fixed design, built for reporting'], 'en');
// s5: a model learns from examples, is only as good as its data, few examples of failures, anomaly detection (different is not broken)
has('eng.industry40.ml', ['Machine learning (ML) is het deel waarin de computer een patroon leert uit voorbeelden, in plaats van regels te volgen die een mens schreef', 'Een model is zo goed als zijn data']);
has('eng.industry40.ml', ['Machine learning (ML) is the part where the computer learns a pattern from examples instead of following rules a person wrote', 'A model is only as good as its data'], 'en');
has('eng.industry40.predictive', ['Anomaliedetectie is een ongesuperviseerde methode: het model leert hoe normaal eruitziet', 'markeert data die afwijken', 'een anomalie betekent “anders”, niet “kapot”', 'Weinig fabrieken hebben dat voor één type installatie']);
has('eng.industry40.predictive', ['Anomaly detection is an unsupervised method: the model learns what normal looks like', 'flags data that deviate', 'an anomaly means “different”, not “broken”', 'Few plants have that for one asset type'], 'en');
// s6: the first lesson names the six dimensions (where to start); the later levels, as the lessons are titled
has('eng.industry40.dimensions', ['Zes dimensies van datakwaliteit']);
has('eng.industry40.dimensions', ['Six dimensions of data quality'], 'en');
for (const [id, word] of [['eng.industry40.machinedata', 'Machinedata'], ['eng.industry40.powerbi', 'Power BI'], ['eng.industry40.pipeline', 'Van bron tot rapport'], ['eng.industry40.predictive', 'Voorspellend onderhoud'],
  ['eng.industry40.mes', 'Stamdata'], ['eng.industry40.floor', 'Scherm op de vloer'], ['eng.industry40.ownership', 'Data-eigenaarschap'], ['eng.industry40.vision', 'AI-inspectie'],
  ['eng.industry40.dqrules', 'Datakwaliteit managen'], ['eng.industry40.alerts', 'alertmoeheid'], ['eng.industry40.case', 'Business case'], ['eng.industry40.twin', 'Digital twins']]) has(id, [word]);
for (const [id, word] of [['eng.industry40.machinedata', 'machine data'], ['eng.industry40.powerbi', 'Power BI'], ['eng.industry40.pipeline', 'From source to report'], ['eng.industry40.predictive', 'Predictive maintenance'],
  ['eng.industry40.mes', 'Master data'], ['eng.industry40.floor', 'Shop-floor screen'], ['eng.industry40.ownership', 'Data ownership'], ['eng.industry40.vision', 'AI inspection'],
  ['eng.industry40.dqrules', 'Managing data quality'], ['eng.industry40.alerts', 'alert fatigue'], ['eng.industry40.case', 'Business case'], ['eng.industry40.twin', 'Digital twins']]) has(id, [word], 'en');
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
const at = w.at;
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the digital field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the PLC cabinet at the back wall between the
// corner and the belt with the edge box on top, the screen on the back wall at the right with bars and a target line, the table
// with the MES laptop at the front left, you at the front right. Without the field film's tank, network cabinet, cable, zone,
// guard and sensors: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const PLC = { x: 96, w: 30, d: 20, h: 112 };
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 };
const SCR = { x0: 196, x1: 262, z0: 112, z1: 168 };
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the edge box on top of the PLC cabinet (with its three ports) and the screen on the back wall: bars of what is made and a target line
const edge = w.box({ x: PLC.x + 4, y: 0, w: 22, d: 9, r: 1 }, PLC.h + 6, PLC.h + 24, { tone: 'hi' }, { steps: 2 })
  + k.dotsSvg([0, 1, 2].map((i) => at([PLC.x + 9 + i * 6, 9.4, PLC.h + 15])), { size: 1.2, tone: 'mid' });
const bars = [12, 22, 17, 30].map((h, i) => `<path class="pm-cell" d="${w.rectD(SCR.x0 + 8 + i * 13, -(SCR.z0 + 6 + h), SCR.x0 + 17 + i * 13, -(SCR.z0 + 6))}"/>`).join('');
const screen = w.box({ x: SCR.x0, y: 0, w: SCR.x1 - SCR.x0, d: 3.4, r: 1 }, SCR.z0, SCR.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(3.6)}"><path class="pm-board" d="${w.rectD(SCR.x0 + 3, -(SCR.z1 - 3), SCR.x1 - 3, -(SCR.z0 + 3))}"/>${bars}`
  + `<path class="pm-rule" style="stroke-width:1" d="M${SCR.x0 + 6} ${-(SCR.z0 + 24)}H${SCR.x1 - 6}"/></g>`;

// painted back to front: the belt, the unit, the PLC cabinet and the edge box (shown from the sentence that reads the numbers
// from the cabinet), the screen and the MES laptop (from the sentence that sends the numbers there), you
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-plc', cueG('plc', hall.cabinet({ x: PLC.x, w: PLC.w, d: PLC.d, h: PLC.h }))),
  g('o-edge', cueG('edge', edge)),
  g('o-scr', cueG('screen', screen)),
  g('o-mes', cueG('mes', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 }))),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Data and digital manufacturing is a cue group of its own
// (map-industry40).
const TILE = { quality: 'tQual', dashboards: 'tDash', integration: 'tInt', ai: 'tAI' };
const PANEL = ['flowS', 'goS', 'grpA', 'grpB', 'qualS', 'timeS', 'gateS', 'kpiS', 'glanceS', 'srcS', 'platS', 'mlS', 'dataS', 'anomS', 'nextS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Data and digital manufacturing lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.industry40'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.industry40');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.industry40')}"`), 'the map lights eng.industry40 as a cue group');
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
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.07) }, // s1 the whole hall: the unit on line 3, the screen, the MES table, you
  { from: cam(140, 40, 85, 1.1), to: cam(140, 40, 85, 1.2) }, // s2 the PLC cabinet with the edge box, next to the unit
  { from: cam(215, 25, 130, 1.5), to: cam(215, 25, 130, 1.65) }, // s3 the screen on the back wall by the line
  { from: cam(135, 70, 70, 1.0), to: cam(135, 70, 70, 1.05) }, // s4 the PLC cabinet and the MES table, the sources
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.05) }, // s5 the whole hall, you
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.industry40.intro',
  title: { nl: 'Lijn 3 en haar cijfers', en: 'Line 3 and its numbers' },
  module: 'eng.industry40',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.industry40, the scene that explains it and its tile
  topics: {
    quality: { scene: 's2', cue: 'tQual' },
    dashboards: { scene: 's3', cue: 'tDash' },
    integration: { scene: 's4', cue: 'tInt' },
    ai: { scene: 's5', cue: 'tAI' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De cijfers van lijn 3', en: 'The numbers of line 3' },
      beats: [
        { nl: 'Lijn 3 maakt cijfers. Data en digitale productie leert je van die cijfers beslissingen te maken.', en: 'Line 3 makes numbers. Data and digital manufacturing teaches you to turn those numbers into decisions.', focus: ['flowS', 'line3', 'unit'] },
        { nl: 'De cijfers van de eenheid gaan naar het MES en naar een scherm bij de lijn.', en: 'The unit’s numbers go to the MES and to a screen by the line.', focus: ['goS', 'unit', 'mes', 'screen'] },
        { nl: 'Jij bent de engineer. Je begint bij de cijfers zelf, met datakwaliteit en dashboards.', en: 'You are the engineer. You start with the numbers themselves, with data quality and dashboards.', focus: ['grpA', 'jij'] },
        { nl: 'Daarna komt wat ze verder brengt, met integratie en met AI en modellen.', en: 'Then comes what carries them further, with integration and with AI and models.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Datakwaliteit', en: 'Data quality' },
      beats: [
        { nl: 'Het eerste onderwerp is Datakwaliteit. Goede data zijn geschikt voor het gebruik dat je voor ogen hebt.', en: 'The first topic is Data quality. Good data are fit for the use you have in mind.', focus: ['tQual', 'qualS'] },
        { nl: 'De cijfers van de eenheid moeten op tijd zijn en ze moeten kloppen.', en: 'The unit’s numbers have to be on time and they have to be right.', focus: ['timeS', 'unit'] },
        { nl: 'Je leest ze uit de PLC-kast met een {t:Edge gateway|edge gateway}.', en: 'You read them from the PLC cabinet with an {t:Edge gateway|edge gateway}.', ...TOOL('Edge gateway'), focus: ['tool1', 'gateS', 'plc', 'edge'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Dashboards', en: 'Dashboards' },
      beats: [
        { nl: 'Het tweede onderwerp is Dashboards en visueel sturen. Een KPI laat zien of je op koers ligt voor een doel.', en: 'The second topic is Dashboards and visual management. A KPI shows whether you are on track for a goal.', focus: ['tDash', 'kpiS'] },
        { nl: 'Dat getal wil je bij de lijn in één oogopslag zien.', en: 'You want to see that number by the line at a glance.', focus: ['glanceS', 'screen'] },
        { nl: 'Daarvoor volg je de lijn op een {t:Dashboard|dashboard}.', en: 'For that you follow the line on a {t:Dashboard|dashboard}.', ...TOOL('Dashboard'), focus: ['tool1', 'glanceS', 'screen'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Integratie', en: 'Integration' },
      beats: [
        { nl: 'Het derde onderwerp is Integratie. Elk getal wordt ergens geboren, zoals in de PLC of in het MES.', en: 'The third topic is Integration. Every number is born somewhere, such as in the PLC or in the MES.', focus: ['tInt', 'srcS', 'plc', 'mes'] },
        { nl: 'Een dataplatform brengt die bronnen samen voor rapporten.', en: 'A data platform brings those sources together for reports.', focus: ['platS', 'plc', 'mes'] },
        { nl: 'Je slaat de cijfers op in een {t:Datawarehouse|datawarehouse}.', en: 'You store the numbers in a {t:Data warehouse|data warehouse}.', ...TOOL('Datawarehouse'), focus: ['tool1', 'platS'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'AI en modellen', en: 'AI and models' },
      beats: [
        { nl: 'Het vierde onderwerp is AI en modellen. Een model leert een patroon uit voorbeelden.', en: 'The fourth topic is AI and models. A model learns a pattern from examples.', focus: ['tAI', 'mlS'] },
        { nl: 'Een model is zo goed als zijn data. Van storingen heb je vaak weinig voorbeelden.', en: 'A model is only as good as its data. You often have few examples of failures.', focus: ['dataS'] },
        { nl: 'Je laat {t:Anomaliedetectie|anomaliedetectie} markeren wat afwijkt. Een afwijking is niet altijd kapot.', en: 'You let {t:Anomaly detection|anomaly detection} flag what deviates. A deviation is not always broken.', ...TOOL('Anomaliedetectie'), focus: ['tool1', 'anomS'] },
        { nl: 'Zo worden de cijfers van lijn 3 beslissingen.', en: 'That is how the numbers of line 3 become decisions.', focus: ['nextS', 'screen', 'jij'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Data en digitale productie is het vijfde en laatste station van Automatisering en IT.', en: 'The whole map. Data and digital manufacturing is the fifth and last station of Automation and IT.', focus: 'map-industry40' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met de zes dimensies van datakwaliteit. Ze geven woorden voor wat er mis is.', en: 'Start at Basics level with the six dimensions of data quality. They give words for what is wrong.', focus: ['tQual', 'start'] },
        { nl: 'Op niveau Werkkennis komen machinedata, Power BI, van bron tot rapport. Ook voorspellend onderhoud.', en: 'At Working knowledge level come machine data, Power BI, from source to report. Also predictive maintenance.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen stamdata en MES, het scherm op de vloer, eigenaarschap en AI-inspectie.', en: 'At Advanced level come master data and MES, the floor screen, ownership and AI inspection.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen datakwaliteit managen, alertmoeheid, de businesscase en digitale tweelingen.', en: 'At Expert level come managing data quality, alert fatigue, the business case and digital twins.', focus: 'lv4' },
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
// screen and the MES table (the unit's numbers go there), the PLC cabinet and the edge box (you read the numbers from the
// cabinet with an edge gateway), you (the engineer, and the one who turns the numbers into decisions).
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
.pm-arm{fill:none;stroke:var(--anatomy-mid);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.pm-joint{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:2}
[data-cue][data-on] .pm-arm{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-joint{stroke:var(--fp-accent)}

/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');



const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Over het begin van de band staat de nieuwe vuleenheid, met een plaat boven de dozen. Tegen de achterwand een PLC-kast met een klein kastje erop, daarnaast een scherm met staven en een doellijn, en vooraan links een tafel met de laptop van het MES. Jij, de engineer, staat vooraan rechts. Rechts een paneel, gemarkeerd als voorbeeld of schema: lijn 3, cijfers en beslissingen, de eenheid met het MES en een scherm, de route in twee groepen, data voor een gebruik, op tijd en kloppend, de PLC-kast met een edge gateway, een KPI met een doel, een scherm bij de lijn, bronnen zoals de PLC en het MES, een dataplatform met een datawarehouse, voorbeelden en een patroon, weinig voorbeelden van storingen, een lijn met een afwijking en wat daarna komt. Aan het eind de hele kaart van Engineering met Data en digitale productie verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs. Over the start of the belt stands the new filling unit, with a plate above the cartons. Against the back wall a PLC cabinet with a small box on top, next to it a screen with bars and a target line, and at the front left a table with the laptop of the MES. You, the engineer, stand at the front right. At the right a panel, marked as an example or a diagram: line 3, numbers and decisions, the unit with the MES and a screen, the route in two groups, data for a use, on time and right, the PLC cabinet with an edge gateway, a KPI with a goal, a screen by the line, sources such as the PLC and the MES, a data platform with a data warehouse, examples and a pattern, few examples of failures, a line with a deviation and what comes next. At the end the whole map of Engineering with Data and digital manufacturing lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

// Dev tool, not shipped. Builds the module intro film "Een dienst op lijn 3 / A shift on line 3" for Capacity and flow
// (eng.flow), an Engineering module intro film (v17, Task 13) and the first intro of the zone "De fabriek draaiend houden"
// (eng.field.run): the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved
// intros films/eng.lines.intro, eng.industry40.intro and eng.gridplanning.intro (one clear tool per topic, as short as the
// content allows, nothing labelled before it is named, no SAY rule that is not needed) and the notes section "Engineering
// module intros".
//
//   node films/eng.flow.intro/build.mjs            build the page
//   node films/eng.flow.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.flow.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.flow's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.run ("Een dienst op lijn 3": the filling unit stands over the belt of
// line 3, you and the team lead keep it going for a whole shift; its first station, Capaciteit en flow, says line 3 must make
// enough cartons for the customer, that the customer sets the pace and that every minute of stoppage is a minute behind; the
// tools are the takt time and a downtime log, and the log is the stop board on the back wall). This film follows HOW LINE 3
// KEEPS PACE THROUGH A SHIFT, topic by topic, in the room of the field film: the belt with its cartons, the filling unit over
// it, the stop board on the back wall at the right, you and the team lead at the front. The takt, the bottleneck, the losses
// and the changeover are schemas in the panel: the field film's room has no clock, no second machine and no cart, so none is
// drawn there. The stop board appears at the sentence that gives it its reason (the downtime log you keep on it), you and the
// team lead at the sentence that names you.
//   s1 line 3 must make enough cartons for the customer in a shift; the module is about how much a line can make and why it does
//      not always work (the module's blurb); you and the team lead keep it going; the map before any detail: four topics in two
//      groups (the customer's pace and what limits the line, with takt and line balance and with bottleneck and capacity; where
//      the minutes go, with OEE and losses and with changeover and batch size)
//   s2 Takt en lijnbalans: takt time is the pace the customer asks for (Basis, .takt); line balancing divides the work over the
//      stations so each sits just under takt (Werkkennis, .balance); the tool is the yamazumi (Werkkennis, .balance), a stacked
//      bar per station with the takt line across. The field film names the takt time itself as its tool and "takttijd" is also
//      the topic's word, so this scene names the sister tool of the same topic
//   s3 Bottleneck en capaciteit: a line makes no more than its slowest step (Basis, .bottleneck); capacity is what a line can
//      make after losses, so plan on that and not on the paper capacity (Werkkennis, .capacity); the topic has no real tool at
//      Basis or Werkkennis, so the most tool-like term is the shift model (ploegenrooster, Werkkennis, .capacity: it sets the hours)
//   s4 OEE en verliezen: OEE asks how much of the planned time goes into good parts (Basis, .oee), it is lost to the six big
//      losses (Basis, .oee); OEE does not say why (Werkkennis, .downtime); the tool is the downtime log (Werkkennis, .downtime),
//      the field film's other tool, kept on the stop board
//   s5 Omstellen en seriegrootte: a changeover is switching to another product, the batch size is the number of parts between two
//      changeovers (Basis, .changeover); a changeover costs time in which nothing is made (the availability loss of s4); the
//      tool is the changeover cart (Werkkennis, .smed), with all tools ready in fixed places. The story ends here: you and the
//      team lead keep line 3 on pace for the whole shift
//   s6 the shared Engineering map (the kit's mapScene) with Capacity and flow lit, then the module's four topics with their
//      levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40 and gridplanning intros: one clear tool per topic; drop what is not needed; nothing
// labelled before it is named; a Werkkennis tool named in a scene (yamazumi, shift model, downtime log, changeover cart) is not
// named again in the closing grid; the tools of no other intro are repeated (no other intro names one of these).
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
const MOD = MODULES.find((m) => m.id === 'eng.flow');
const LEVELS = {
  takt: ['eng.flow.takt', 'eng.flow.balance', 'eng.flow.precedence', 'eng.flow.staffing'],
  bottleneck: ['eng.flow.bottleneck', 'eng.flow.capacity', 'eng.flow.toc', 'eng.flow.throughput'],
  oee: ['eng.flow.oee', 'eng.flow.downtime', 'eng.flow.teep', 'eng.flow.oeecase'],
  changeover: ['eng.flow.changeover', 'eng.flow.smed', 'eng.flow.batch', 'eng.flow.wheel'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.flow has the four topics and levels this film draws');
assert(MOD.intro === 'eng.flow.intro', 'eng.flow names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb
assert(MOD.blurb.nl.includes('hoeveel een lijn kan maken en waarom dat niet lukt'), 'the module blurb (nl) says how much a line can make and why not');
assert(MOD.blurb.en.includes('how much a line can make and why it doesn’t'), 'the module blurb (en) says how much a line can make and why not');
// s2: takt time is the pace the customer asks for; line balancing puts each station just under takt; the yamazumi
has('eng.flow.takt', ['Takttijd (takt time) is het tempo dat de klant vraagt']);
has('eng.flow.takt', ['Takt time is the pace the customer asks for'], 'en');
has('eng.flow.balance', ['Lijnbalancering (line balancing) verdeelt het werk aan één product over de stations van een lijn, zodat elk station net onder de takt zit', 'Yamazumi (Japans voor “opgestapeld”): een gestapelde balk per station, elk blokje één taak, met de taktlijn erdoorheen', 'In één oogopslag zie je welke balk uitsteekt']);
has('eng.flow.balance', ['Line balancing divides the work of one product over the stations of a line, so that each station’s cycle time sits just under takt', 'Yamazumi chart (Japanese for “piled up”): a stacked bar per station, each block one task, with the takt line drawn across', 'One glance shows which bar sticks out'], 'en');
// s3: the slowest step; capacity after losses, not the paper figure; the shift model sets the hours
has('eng.flow.bottleneck', ['Een lijn produceert nooit sneller dan zijn langzaamste stap: de bottleneck']);
has('eng.flow.bottleneck', ['A line produces no faster than its slowest step: the bottleneck'], 'en');
has('eng.flow.capacity', ['Capaciteit (capacity) is wat een machine of lijn in een periode kan maken, na verliezen', 'Plan op het realistische getal, niet op de papieren capaciteit', 'ploegenrooster (shift model) bepaalt de uren: 1, 2 of 3 ploegen per dag']);
has('eng.flow.capacity', ['Capacity is what a machine or line can make in a period, after losses', 'Plan on the realistic number, not on nameplate capacity', 'shift model sets the hours: 1, 2 or 3 shifts a day'], 'en');
// s4: OEE, the six big losses, OEE does not say why, the downtime log
has('eng.flow.oee', ['OEE (overall equipment effectiveness) vraagt: van de tijd dat een machine gepland stond, hoeveel ging er op aan goede stuks op volle snelheid', 'De zes grote verliezen komen uit TPM', 'Beschikbaarheid: storingen, en omstellen en afstellen', 'microstops', 'verlaagde snelheid', 'opstartafkeur en productieafkeur']);
has('eng.flow.oee', ['OEE (overall equipment effectiveness) asks: of the time a machine was planned to run, how much went into good parts at full speed', 'The six big losses come from', 'Availability: breakdowns, and setups and adjustments', 'small stops', 'reduced speed', 'start-up rejects and production rejects'], 'en');
has('eng.flow.downtime', ['OEE zegt hoeveel tijd je verliest, niet waarom', 'stilstandregistratie (downtime log): bij elke stop de begintijd, de duur, de machine en een oorzaakcode']);
has('eng.flow.downtime', ['OEE tells you how much time you lose, not why', 'a downtime log: for every stop the start time, the duration, the machine and a reason code'], 'en');
// s5: a changeover, the batch size, the changeover cart
has('eng.flow.changeover', ['Een omstelling (changeover, ook setup) is een machine ombouwen van product A naar product B', 'Seriegrootte Het aantal stuks dat je maakt tussen twee omstellingen']);
has('eng.flow.changeover', ['A changeover, also called a setup, is switching a machine from product A to product B', 'Batch size is how many parts you make between two changeovers'], 'en');
has('eng.flow.smed', ['Een omstelkar (changeover cart) met alle gereedschap, klemmen en de instelkaart op vaste plekken']);
has('eng.flow.smed', ['A changeover cart with all tools, clamps and the setting sheet in fixed places'], 'en');
// s6: the first lesson names takt, cycle and lead time (where to start); the later levels, as the lessons are titled
for (const [id, word] of [['eng.flow.takt', 'Takt, cyclustijd en doorlooptijd'], ['eng.flow.balance', 'Lijnbalancering'], ['eng.flow.capacity', 'Capaciteit en bezettingsgraad'], ['eng.flow.downtime', 'pareto'], ['eng.flow.smed', 'SMED-workshop'],
  ['eng.flow.precedence', 'Balanceren met volgorde en spreiding'], ['eng.flow.toc', 'De vijf focusstappen'], ['eng.flow.teep', 'OEE eerlijk definiëren'], ['eng.flow.batch', 'De juiste seriegrootte'],
  ['eng.flow.staffing', 'Bemensing'], ['eng.flow.throughput', 'Wat een uur op de bottleneck waard is'], ['eng.flow.oeecase', 'Van OEE-punten naar capaciteit en geld'], ['eng.flow.wheel', 'Productwiel']]) has(id, [word]);
for (const [id, word] of [['eng.flow.takt', 'Takt, cycle and lead time'], ['eng.flow.balance', 'Line balancing'], ['eng.flow.capacity', 'Capacity and utilisation'], ['eng.flow.downtime', 'Pareto'], ['eng.flow.smed', 'SMED workshop'],
  ['eng.flow.precedence', 'Balancing with precedence and variation'], ['eng.flow.toc', 'The five focusing steps'], ['eng.flow.teep', 'Defining OEE honestly'], ['eng.flow.batch', 'The right batch size'],
  ['eng.flow.staffing', 'Staffing'], ['eng.flow.throughput', 'What an hour on the bottleneck is worth'], ['eng.flow.oeecase', 'From OEE points to capacity and money'], ['eng.flow.wheel', 'Product wheel']]) has(id, [word], 'en');
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

// where things stand (cm), as in the run field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the stop board on the back wall at the right
// (rows of tally strokes), you and the team lead at the front. Without the field film's tank, check table, CILT board,
// laptop and isolator: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const LOG = { x0: 196, x1: 262, z0: 112, z1: 168 }; // the stop board on the back wall
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// a few short strokes on a face: [x0, x1, z] on the plane y (the +y face of the board)
const strokes = (y, rows, tone = 'lo') => k.lineSvg(rows.map(([x0, x1, z]) => k.pathOf([at([x0, y, z]), at([x1, y, z])])).join(''), { tone });
// the stop board: three rows of tally strokes (a stop, its length, its cause)
const logBoard = w.box({ x: LOG.x0, y: 0, w: LOG.x1 - LOG.x0, d: 3.4, r: 1 }, LOG.z0, LOG.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(3.6)}"><path class="pm-board" d="${w.rectD(LOG.x0 + 3, -(LOG.z1 - 3), LOG.x1 - 3, -(LOG.z0 + 3))}"/></g>`
  + strokes(3.8, [[LOG.x0 + 8, LOG.x1 - 10, LOG.z1 - 14], [LOG.x0 + 8, LOG.x1 - 22, LOG.z1 - 28], [LOG.x0 + 8, LOG.x1 - 34, LOG.z1 - 42]], 'mid')
  + k.dotsSvg([0, 1, 2].map((i) => at([LOG.x1 - 8, 3.8, LOG.z1 - 14 - i * 14])), { size: 1.3, tone: 'hi' });

// painted back to front: the belt and the unit, the stop board (shown from the sentence that names the downtime log you keep
// on it), you and the team lead (from the sentence that names you)
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-log', cueG('board', logBoard)),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Capacity and flow is a cue group of its own (map-flow).
const TILE = { takt: 'tTakt', bottleneck: 'tBott', oee: 'tOee', changeover: 'tChg' };
const PANEL = ['flowS', 'shiftS', 'grpA', 'grpB', 'taktS', 'balS', 'yamS', 'bnS', 'capS', 'shmS', 'oeeS', 'lossS', 'logS', 'chgS', 'batchS', 'cartS', 'endS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Capacity and flow lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.flow'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.flow');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.flow')}"`), 'the map lights eng.flow as a cue group');
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
  { from: cam(150, 40, 70, 1.15), to: cam(150, 40, 70, 1.25) }, // s2 the belt and the unit: the pace
  { from: cam(150, 40, 70, 1.25), to: cam(150, 40, 70, 1.35) }, // s3 the belt and the unit: the slowest step
  { from: cam(215, 25, 130, 1.5), to: cam(215, 25, 130, 1.65) }, // s4 the stop board on the back wall
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.05) }, // s5 the whole hall, you and the team lead
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.flow.intro',
  title: { nl: 'Een dienst op lijn 3', en: 'A shift on line 3' },
  module: 'eng.flow',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.flow, the scene that explains it and its tile
  topics: {
    takt: { scene: 's2', cue: 'tTakt' },
    bottleneck: { scene: 's3', cue: 'tBott' },
    oee: { scene: 's4', cue: 'tOee' },
    changeover: { scene: 's5', cue: 'tChg' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Een dienst op lijn 3', en: 'A shift on line 3' },
      beats: [
        { nl: 'Lijn 3 moet in een dienst genoeg dozen voor de klant maken.', en: 'Line 3 must make enough cartons for the customer in a shift.', focus: ['flowS', 'line3', 'unit'] },
        { nl: 'De module Capaciteit en flow gaat over hoeveel een lijn kan maken en waarom dat niet altijd lukt.', en: 'The module Capacity and flow is about how much a line can make and why it does not always work.', focus: ['flowS', 'line3'] },
        { nl: 'Jij bent de engineer. Met de teamleider houd je de lijn een hele dienst op tempo.', en: 'You are the engineer. With the team lead you keep the line on pace for a whole shift.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst het tempo en wat de lijn begrenst, met takt en lijnbalans en met bottleneck en capaciteit.', en: 'First the pace and what limits the line, with takt and line balance and with bottleneck and capacity.', focus: 'grpA' },
        { nl: 'Dan waar de minuten blijven, met OEE en verliezen en met omstellen en seriegrootte.', en: 'Then where the minutes go, with OEE and losses and with changeover and batch size.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Takt en lijnbalans', en: 'Takt and line balance' },
      beats: [
        { nl: 'Het eerste onderwerp is Takt en lijnbalans. Takttijd is het tempo dat de klant vraagt.', en: 'The first topic is Takt and line balance. Takt time is the pace the customer asks for.', focus: ['tTakt', 'taktS', 'line3'] },
        { nl: 'Lijnbalancering verdeelt het werk over de stations, zodat elk station net onder de takt zit.', en: 'Line balancing divides the work over the stations, so each station sits just under takt.', focus: ['balS', 'line3', 'unit'] },
        { nl: 'Je tekent het werk per station in een {t:Yamazumi|yamazumi}.', en: 'You draw the work per station in a {t:Yamazumi|yamazumi}.', ...TOOL('Yamazumi'), focus: ['tool1', 'yamS'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Bottleneck en capaciteit', en: 'Bottleneck and capacity' },
      beats: [
        { nl: 'Het tweede onderwerp is Bottleneck en capaciteit. Een lijn maakt nooit meer dan zijn langzaamste stap.', en: 'The second topic is Bottleneck and capacity. A line never makes more than its slowest step.', focus: ['tBott', 'bnS', 'line3', 'unit'] },
        { nl: 'Capaciteit is wat de lijn na verliezen echt kan maken. Plan daarop, niet op het papier.', en: 'Capacity is what the line can really make after losses. Plan on that, not on the paper.', focus: ['capS', 'line3'] },
        { nl: 'De uren van de lijn leg je vast in een {t:Ploegenrooster|ploegenrooster}.', en: 'You fix the hours of the line in a {t:Shift model|shift model}.', ...TOOL('Ploegenrooster'), focus: ['tool1', 'shmS'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'OEE en verliezen', en: 'OEE and losses' },
      beats: [
        { nl: 'Het derde onderwerp is OEE en verliezen. OEE meet hoeveel geplande tijd opgaat aan goede stuks.', en: 'The third topic is OEE and losses. OEE measures how much planned time goes into good parts.', focus: ['tOee', 'oeeS'] },
        { nl: 'De rest verlies je aan de zes grote verliezen, van storingen tot afkeur.', en: 'You lose the rest to the six big losses, from breakdowns to rejects.', focus: ['lossS'] },
        { nl: 'OEE zegt niet waarom. Op het bord aan de wand houd je een {t:Stilstandregistratie|stilstandregistratie} bij.', en: 'OEE does not say why. On the board on the wall you keep a {t:Downtime log|downtime log}.', ...TOOL('Stilstandregistratie'), focus: ['tool1', 'logS', 'board'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Omstellen en seriegrootte', en: 'Changeover and batch size' },
      beats: [
        { nl: 'Het vierde onderwerp is Omstellen en seriegrootte. Omstellen is ombouwen voor een ander product.', en: 'The fourth topic is Changeover and batch size. A changeover is switching to another product.', focus: ['tChg', 'chgS'] },
        { nl: 'De seriegrootte is het aantal stuks tussen twee omstellingen. Een omstelling kost tijd zonder productie.', en: 'The batch size is the number of parts between two changeovers. A changeover costs time without output.', focus: ['batchS'] },
        { nl: 'Je legt het gereedschap vooraf klaar op een {t:Omstelkar|omstelkar}.', en: 'You put the tools ready beforehand on a {t:Changeover cart|changeover cart}.', ...TOOL('Omstelkar'), focus: ['tool1', 'cartS'] },
        { nl: 'Zo kunnen jij en de teamleider lijn 3 de hele dienst op tempo houden.', en: 'That is how you and the team lead can keep line 3 on pace for the whole shift.', focus: ['endS', 'jij', 'teamlead'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het eerste station is Capaciteit en flow, in De fabriek draaiend houden.', en: 'The whole map. The first station is Capacity and flow, in Keeping the plant running.', focus: 'map-flow' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met takt, cyclustijd en doorlooptijd. Het tempo van de klant is de maat voor de rest.', en: 'Start at Basics level with takt, cycle and lead time. The customer’s pace is the yardstick for the rest.', focus: ['tTakt', 'start'] },
        { nl: 'Op niveau Werkkennis komen lijnbalancering, bezettingsgraad, de pareto en de SMED-workshop.', en: 'At Working knowledge level come line balancing, utilisation, the Pareto and the SMED workshop.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen volgorde en spreiding, vijf focusstappen, OEE eerlijk definiëren en seriegrootte.', en: 'At Advanced level come precedence and variation, five focusing steps, defining OEE honestly and batch size.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen bemensing, een uur op de bottleneck, OEE in geld en het productwiel.', en: 'At Expert level come staffing, an hour on the bottleneck, OEE in money and the product wheel.', focus: 'lv4' },
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Rechts daarvan, tegen de achterwand, een bord met streepjes voor de stops. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: een dienst van lijn 3 en de klant, de route in twee groepen, de takt en de stations, een yamazumi met de taktlijn, de langzaamste stap, de papieren en de echte capaciteit, een ploegenrooster met drie ploegen, geplande tijd met goede stuks, de zes grote verliezen, een stilstandregistratie met tijd, duur en oorzaak, product A en product B, een serie tussen twee omstellingen, een omstelkar met gereedschap en een dienst die op tempo blijft. Aan het eind de hele kaart van Engineering met Capaciteit en flow verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. To the right of it, against the back wall, a board with strokes for the stops. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: a shift of line 3 and the customer, the route in two groups, the takt and the stations, a yamazumi with the takt line, the slowest step, paper and real capacity, a shift model with three shifts, planned time with good parts, the six big losses, a downtime log with time, duration and cause, product A and product B, a batch between two changeovers, a changeover cart with tools and a shift that stays on pace. At the end the whole map of Engineering with Capacity and flow lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

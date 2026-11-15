// Dev tool, not shipped. Builds the module intro film "Te lichte dozen op lijn 3 / Too-light cartons on line 3" for Engineering problem
// solving (eng.improve), an Engineering module intro film (v17, Task 13) and the first intro of the zone "De fabriek beter maken"
// (eng.field.better): the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved
// intros films/eng.flow.intro, eng.quality.intro, eng.maintenance.intro and eng.lines.intro (one clear tool per topic, as short as
// the content allows, nothing labelled before it is named, no SAY rule that is not needed) and the notes section "Engineering module
// intros".
//
//   node films/eng.improve.intro/build.mjs            build the page
//   node films/eng.improve.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.improve.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.improve's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.better ("Na de dienst op lijn 3": too-light cartons keep coming out of the
// filling unit on line 3, you and the team lead stay after the shift to fix it for good; its station Technisch probleemoplossen
// says you find the root cause, not only treat the symptom: you stand in an Ohno circle, a chalk circle on the floor in front of
// the belt, and you draw a why tree on a board on two posts). This film follows HOW YOU AND THE TEAM SOLVE LINE 3's RECURRING
// PROBLEM FOR GOOD, topic by topic, in the room of the field film: the belt with its cartons, the filling unit over it, you and the
// team lead at the front. What the field film's station draws comes in at the sentence that gives it its reason: the board with
// the why tree (the sentence that names the why tree), the chalk circle (the sentence that names the Ohno circle; you stand in it).
// New here, from the topic that needs it: the andon, a cord and a light on the unit's front upright where the operator is (the
// sentence that names it). Without the field film's tank, scale, chart, crate, laptop and the two boards of the other stations.
// The root cause, the cycle and the value stream are schemas in the panel: the field film's room has no place for them.
//   s1 too-light cartons keep coming out of the filling unit of line 3 (the field film's own sentence); the module is about how
//      plants find root causes and improve (the module's blurb); you and the team lead stay after the shift to fix it for good;
//      the map before any detail: four topics in two groups (the cause and the facts, then the improvement and making it last)
//   s2 De grondoorzaak vinden: a too-light carton is only the symptom (Basis, .whys); the root cause is the cause that stops the
//      problem once removed (Basis, .whys); you keep asking why until you reach a cause you can act on (Basis, .whys); the tool is
//      the why tree (Werkkennis, .fishbone), a 5 whys with branches, the field film's own tool of this station, drawn on the board
//   s3 Feiten, data en experimenten: a report shows what someone chose to record, so you go and see for yourself (Basis, .gemba);
//      you count and measure what you see and test what you think with that data (the topic's data and experiment lessons); the
//      tool is the Ohno circle (Basis, .gemba), the field film's other tool of this station: you stand in it on the floor
//   s4 PDCA en de A3: an improvement is an experiment (Basis, .pdca); you predict what a countermeasure does, try it small and see
//      whether it holds (Basis, .pdca); the story of the problem fits on one A3 sheet (Werkkennis, .a3: said, not named as a tool, the
//      A3 report is a tool of the Projects intro pm.land.intro); the tool is PDCA (Basis, .pdca), the cycle. The topic has no tool
//      at Basis or Werkkennis that no other intro names (the A3 report is pm.land.intro's; the trial and the hypothesis are concepts
//      of the cycle): PDCA is the most tool-like term, a method you run round again and again
//   s5 Kaizen en de waardestroom: improving step by step by the people who do the work, every day and in events (Basis, .kaizen);
//      you also draw the value stream to see where the material waits (Werkkennis, .vsm: said, not named as a tool, the value stream
//      map is a tool of the Projects intro pm.devops.intro); the tool is the andon (Basis, .kaizen), a cord with a light on the
//      unit's upright, with which an operator calls the team lead. The story ends: the problem of line 3 is tackled until it no
//      longer comes back
//   s6 the shared Engineering map (the kit's mapScene) with Engineering problem solving lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40, quality and maintenance intros: one clear tool per topic; drop what is not needed; nothing
// labelled before it is named; a Werkkennis tool named in a scene (the why tree) is not named again in the closing grid; no other
// intro names one of these tools (the field film's are the why tree and the Ohno circle).
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
const MOD = MODULES.find((m) => m.id === 'eng.improve');
const LEVELS = {
  cause: ['eng.improve.whys', 'eng.improve.fishbone', 'eng.improve.isisnot', 'eng.improve.verify'],
  facts: ['eng.improve.gemba', 'eng.improve.breakdown', 'eng.improve.data', 'eng.improve.doe'],
  a3: ['eng.improve.pdca', 'eng.improve.a3', 'eng.improve.8d', 'eng.improve.a3review'],
  kaizen: ['eng.improve.kaizen', 'eng.improve.vsm', 'eng.improve.facilitate', 'eng.improve.system'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.improve has the four topics and levels this film draws');
assert(MOD.intro === 'eng.improve.intro', 'eng.improve names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb
assert(MOD.blurb.nl.includes('Hoe fabrieken grondoorzaken vinden en verbeteren') && MOD.blurb.en.includes('How plants find root causes and improve'), 'the module blurb says how plants find root causes and improve');
// s2: a symptom is what you see; a root cause is the cause that stops the problem once removed; you ask why again at every answer; a why tree is a 5 whys with branches
has('eng.improve.whys', ['Een grondoorzaak is de oorzaak die het probleem stopt als je hem weghaalt', 'Symptoom Wat je van een probleem ziet', 'vraagt bij elk antwoord opnieuw “waarom?”, tot je bij een oorzaak komt waar je iets mee kunt']);
has('eng.improve.whys', ['A root cause is the cause that, once removed, stops the problem coming back', 'Symptom What you see of a problem', 'ask “why?” again at every answer, until you reach a cause you can act on'], 'en');
has('eng.improve.fishbone', ['Waaromboom Een 5 keer waarom met takken, voor als één antwoord meer dan één oorzaak heeft']);
has('eng.improve.fishbone', ['Why tree A 5 whys with branches, for when one answer has more than one cause'], 'en');
// s3: a report shows what someone chose to record, so you go and see for yourself; you count and measure what you see; the Ohno circle is a chalk circle on the floor
has('eng.improve.gemba', ['Een rapport toont wat iemand koos vast te leggen', 'zelf gaan kijken', '(tel en meet wat je ziet)', 'krijtcirkel op de vloer', 'Ohno-cirkel Op één plek op de vloer blijven staan en het werk bekijken']);
has('eng.improve.gemba', ['A report shows what someone chose to record', 'going to see for yourself', '(count and time what you see)', 'chalk circle on the floor', 'Ohno circle Standing still at one spot on the floor to watch the work'], 'en');
has('eng.improve.data', ['Meten voordat je concludeert']);
has('eng.improve.data', ['Measuring before concluding'], 'en');
has('eng.improve.doe', ['Proefopzetten (DOE) in gewone woorden']);
has('eng.improve.doe', ['Design of experiments in plain words'], 'en');
// s4: improving is an experiment; plan with a prediction, try it small, compare, then standardise or adjust; the story of the problem on one A3 sheet
has('eng.improve.pdca', ['PDCA: verbeteren als experiment', 'kies een tegenmaatregel en voorspel het resultaat. Do: probeer het, klein. Check: vergelijk het resultaat met de voorspelling. Act: standaardiseer wat werkte, of stuur bij en ga nog een rondje', 'PDCA Plan, Do, Check, Act: de cyclus']);
has('eng.improve.pdca', ['PDCA: improving as an experiment', 'choose a countermeasure and predict the result. Do: try it, on a small scale. Check: compare the result with the prediction. Act: standardise what worked, or adjust and go round again', 'PDCA Plan, Do, Check, Act: the cycle'], 'en');
has('eng.improve.a3', ['een probleemoplosverhaal te vertellen op één vel A3-papier']);
has('eng.improve.a3', ['telling a problem-solving story on one sheet of A3 paper'], 'en');
// s5: kaizen is improving step by step by the people who do the work, every day and in events; the andon is a cord or button an operator uses to signal a problem so the team leader comes
// to help; the value stream is every step that takes one product to the customer and the lead time is mostly waiting
has('eng.improve.kaizen', ['stap voor stap verbeteren, door de mensen die het werk doen', 'Dagelijkse kaizen (daily kaizen): veel kleine verbeteringen, elke dag', 'Een kaizen-event (kaizen event): een team dat een paar dagen fulltime aan één gebied werkt', 'een koord of knop waarmee een operator meteen een probleem meldt, zodat de teamleider komt helpen']);
has('eng.improve.kaizen', ['improving step by step, by the people who do the work', 'Daily kaizen: many small improvements, every day', 'A kaizen event: a team working full-time for a few days on one area', 'a cord or button an operator uses to signal a problem straight away, so the team leader comes to help'], 'en');
has('eng.improve.vsm', ['Een waardestroom is elke stap, waarde toevoegend of niet', 'Doorlooptijd Hoe lang één deel door de fabriek doet, grotendeels wachttijd op voorraad']);
has('eng.improve.vsm', ['A value stream is every step, adding value or not', 'Production lead time How long one part takes through the plant, mostly time waiting in stock'], 'en');
// s6: the first lesson names where to start (the symptom against the root cause); the later levels, as the lessons are titled
for (const [id, word] of [['eng.improve.whys', '5 keer waarom'], ['eng.improve.fishbone', 'Ishikawa en de grenzen van 5 keer waarom'], ['eng.improve.breakdown', 'Een groot probleem opknippen'], ['eng.improve.a3', 'Het A3-rapport'], ['eng.improve.vsm', 'Waardestroomanalyse'],
  ['eng.improve.isisnot', 'Is/is-niet en stratificatie'], ['eng.improve.data', 'Meten voordat je concludeert'], ['eng.improve.8d', '8D: indammen'], ['eng.improve.facilitate', 'Een grondoorzaaksessie begeleiden'],
  ['eng.improve.verify', 'De fix verifiëren'], ['eng.improve.doe', 'Proefopzetten'], ['eng.improve.a3review', 'Een A3 bespreken'], ['eng.improve.system', 'Van events naar een systeem van dagelijks verbeteren']]) has(id, [word]);
for (const [id, word] of [['eng.improve.whys', '5 whys'], ['eng.improve.fishbone', 'Ishikawa and the limits of 5 whys'], ['eng.improve.breakdown', 'Breaking down a big problem'], ['eng.improve.a3', 'The A3 report'], ['eng.improve.vsm', 'Value stream mapping'],
  ['eng.improve.isisnot', 'Is/is-not and stratification'], ['eng.improve.data', 'Measuring before concluding'], ['eng.improve.8d', '8D: contain'], ['eng.improve.facilitate', 'Facilitating a root-cause session'],
  ['eng.improve.verify', 'Verifying the fix'], ['eng.improve.doe', 'Design of experiments'], ['eng.improve.a3review', 'Reviewing an A3'], ['eng.improve.system', 'From events to a system of daily improvement']]) has(id, [word], 'en');
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

// where things stand (cm), as in the better field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the board with the why tree on two posts beside the
// unit, the chalk circle on the floor in front of the belt, you and the team lead at the front. New here: the andon on the unit's
// front upright (a light on the beam and a cord with a knob). Without the field film's tank, scale, chart, crate and laptop: other
// stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const RING = { x: 232, y: 124, r: 22 }; // the chalk circle on the floor, where you stand
const TREE = { x: 96, y: 80, w: 38, d: 3, z0: 78, z1: 138 }; // the board with the why tree, on two posts
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the chalk circle: a ring on the floor
const circle = k.lineSvg(k.pathOf([...k.circleRing(RING.x, RING.y, RING.r, 48), [RING.x + RING.r, RING.y]].map(([px, py]) => at([px, py, 0.3]))), { tone: 'hi' });
// the why tree: a board on two posts with a tree of strokes on its face, from the problem at the left to the causes at the right
const TY = TREE.y + TREE.d + 0.3; // the board's front face
const treeSegs = (x0, z0) => [
  [[x0 + 5, z0 + 30], [x0 + 12, z0 + 30]], [[x0 + 12, z0 + 14], [x0 + 12, z0 + 46]], [[x0 + 12, z0 + 46], [x0 + 22, z0 + 46]], [[x0 + 12, z0 + 14], [x0 + 22, z0 + 14]],
  [[x0 + 22, z0 + 6], [x0 + 22, z0 + 22]], [[x0 + 22, z0 + 22], [x0 + 31, z0 + 22]], [[x0 + 22, z0 + 6], [x0 + 31, z0 + 6]],
];
const treeBoard = w.post(TREE.x + 4, TREE.y + 1.5, 1.8, 0, TREE.z0, { tone: 'lo' }, 10) + w.post(TREE.x + TREE.w - 4, TREE.y + 1.5, 1.8, 0, TREE.z0, { tone: 'lo' }, 10)
  + w.box({ x: TREE.x, y: TREE.y, w: TREE.w, d: TREE.d, r: 0.8 }, TREE.z0, TREE.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(TY)}"><path class="pm-board" d="${w.rectD(TREE.x + 2.4, -(TREE.z1 - 2.4), TREE.x + TREE.w - 2.4, -(TREE.z0 + 2.4))}"/></g>`
  + k.lineSvg(treeSegs(TREE.x, TREE.z0 + 14).map(([a, b]) => k.pathOf([at([a[0], TY + 0.3, a[1]]), at([b[0], TY + 0.3, b[1]])])).join(''), { tone: 'lo' })
  + k.dotsSvg([[TREE.x + 5, TREE.z0 + 44], [TREE.x + 22, TREE.z0 + 60], [TREE.x + 31, TREE.z0 + 36], [TREE.x + 31, TREE.z0 + 20]].map(([px, pz]) => at([px, TY + 0.3, pz])), { size: 1.3, tone: 'hi' });
// the andon: a light on the beam at the front of the unit and a cord with a knob hanging from it, where the operator stands
const andon = w.box({ x: UX + 1, y: 53, w: 7, d: 7, r: 1.2 }, FRAME.beam, FRAME.beam + 11, { tone: 'hi' }, { steps: 2 })
  + w.post(UX + 4.5, 66, 0.7, 100, FRAME.beam, { tone: 'lo' }, 8)
  + w.box({ x: UX + 1.5, y: 63.5, w: 6, d: 5, r: 1 }, 92, 102, { tone: 'hi' }, { steps: 1 });

// painted back to front: the belt and the unit, the board with the why tree and the chalk circle and the andon (shown from the
// sentences that name them), you and the team lead (from the sentence that names you; in the circle while you stand in it)
const world = [
  w.room(ROOM),
  g('o-ring', cueG('circle', circle)),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-tree', cueG('tree', treeBoard)),
  g('o-andon', cueG('andon', andon)),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij0', person('jij', 188, 132, 'x')),
  g('pp-jij', person('jij', RING.x, RING.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Engineering problem solving is a cue group of its own (map-improve).
const TILE = { cause: 'tCause', facts: 'tFacts', a3: 'tA3', kaizen: 'tKaizen' };
const PANEL = ['unitS', 'modS', 'shiftS', 'grpA', 'grpB', 'symS', 'rootS', 'whyS', 'treeS', 'flS', 'cmpS', 'dataS', 'ringS', 'expS', 'trialS', 'sheetS', 'cycS', 'stepS', 'evtS', 'flowS', 'andS', 'endS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Engineering problem solving lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.improve'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.improve');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.improve')}"`), 'the map lights eng.improve as a cue group');
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
  { from: cam(125, 60, 80, 1.15), to: cam(125, 60, 80, 1.25) }, // s2 the unit over the belt and the board with the why tree beside it
  { from: cam(190, 80, 40, 1.15), to: cam(190, 80, 40, 1.25) }, // s3 the chalk circle on the floor in front of the belt
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.06) }, // s4 the hall: the unit, the board, you and the team lead
  { from: cam(150, 55, 90, 1.2), to: cam(150, 55, 90, 1.3) }, // s5 the unit and its andon
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.improve.intro',
  title: { nl: 'Te lichte dozen op lijn 3', en: 'Too-light cartons on line 3' },
  module: 'eng.improve',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.improve, the scene that explains it and its tile
  topics: {
    cause: { scene: 's2', cue: 'tCause' },
    facts: { scene: 's3', cue: 'tFacts' },
    a3: { scene: 's4', cue: 'tA3' },
    kaizen: { scene: 's5', cue: 'tKaizen' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Te lichte dozen op lijn 3', en: 'Too-light cartons on line 3' },
      beats: [
        { nl: 'Op lijn 3 komen telkens te lichte dozen uit de vuleenheid.', en: 'On line 3 too-light cartons keep coming out of the filling unit.', focus: ['unitS', 'line3', 'unit'] },
        { nl: 'De module Technisch probleemoplossen gaat over hoe fabrieken grondoorzaken vinden en verbeteren.', en: 'The module Engineering problem solving is about how plants find root causes and improve.', focus: ['modS', 'line3', 'unit'] },
        { nl: 'Jij bent de engineer. Na de dienst blijf je met de teamleider om het echt op te lossen.', en: 'You are the engineer. After the shift you stay with the team lead to fix it for good.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst vind je de oorzaak en haal je de feiten op.', en: 'First you find the cause and gather the facts.', focus: 'grpA' },
        { nl: 'Dan probeer je de verbetering uit en houd je haar vast.', en: 'Then you try out the improvement and make it last.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'De grondoorzaak vinden', en: 'Finding the root cause' },
      beats: [
        { nl: 'Het eerste onderwerp is De grondoorzaak vinden. Een te lichte doos is alleen het symptoom.', en: 'The first topic is Finding the root cause. A too-light carton is only the symptom.', focus: ['tCause', 'symS', 'line3'] },
        { nl: 'De grondoorzaak is de oorzaak die het probleem stopt als je hem weghaalt.', en: 'The root cause is the cause that, once removed, stops the problem coming back.', focus: ['rootS', 'unit'] },
        { nl: 'Je vraagt telkens waarom, tot je een oorzaak vindt waar je iets mee kunt.', en: 'You keep asking why, until you reach a cause you can act on.', focus: ['whyS', 'unit'] },
        { nl: 'Heeft een antwoord meer dan één oorzaak, dan teken je op het bord een {t:Waaromboom|waaromboom}.', en: 'If one answer has more than one cause, you draw a {t:Why tree|why tree} on the board.', ...TOOL('Waaromboom'), focus: ['tool1', 'treeS', 'tree'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Feiten, data en experimenten', en: 'Facts, data and experiments' },
      beats: [
        { nl: 'Het tweede onderwerp is Feiten, data en experimenten. Je gaat zelf kijken waar het gebeurt.', en: 'The second topic is Facts, data and experiments. You go and see for yourself where it happens.', focus: ['tFacts', 'flS', 'line3', 'jij'] },
        { nl: 'Een rapport toont wat iemand vastlegde. Op de vloer tel en meet je zelf.', en: 'A report shows what someone chose to record. On the floor you count and measure for yourself.', focus: ['cmpS', 'line3'] },
        { nl: 'Met die cijfers toets je wat je denkt, soms met een proef.', en: 'With those figures you test what you think, sometimes with a trial.', focus: ['dataS', 'line3'] },
        { nl: 'Je kijkt vanuit een {t:Ohno-cirkel|Ohno-cirkel}, een krijtcirkel op de vloer.', en: 'You watch from an {t:Ohno circle|Ohno circle}, a chalk circle on the floor.', ...TOOL('Ohno-cirkel'), focus: ['tool1', 'ringS', 'circle', 'jij'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'PDCA en de A3', en: 'PDCA and the A3' },
      beats: [
        { nl: 'Het derde onderwerp is PDCA en de A3. Een verbetering is een experiment.', en: 'The third topic is PDCA and the A3. An improvement is an experiment.', focus: ['tA3', 'expS', 'unit'] },
        { nl: 'Je voorspelt wat een tegenmaatregel doet, probeert hem klein en kijkt of het klopt.', en: 'You predict what a countermeasure does, try it small and see whether it holds.', focus: ['trialS', 'unit'] },
        { nl: 'Het verhaal van het probleem past op één vel, de A3.', en: 'The story of the problem fits on one sheet, the A3.', focus: ['sheetS'] },
        { nl: 'Dat rondje heet {t:PDCA|PDCA} en je draait het steeds opnieuw.', en: 'That round is called {t:PDCA|PDCA} and you run it again and again.', ...TOOL('PDCA'), focus: ['tool1', 'cycS'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Kaizen en de waardestroom', en: 'Kaizen and the value stream' },
      beats: [
        { nl: 'Het vierde onderwerp is Kaizen en de waardestroom. Je verbetert stap voor stap, met het team.', en: 'The fourth topic is Kaizen and the value stream. You improve step by step, with the team.', focus: ['tKaizen', 'stepS', 'unit'] },
        { nl: 'Elke dag kleine verbeteringen, en soms een paar dagen een event aan één gebied.', en: 'Small improvements every day, and sometimes a few days of an event on one area.', focus: ['evtS', 'unit'] },
        { nl: 'Je tekent ook de waardestroom, om te zien waar het materiaal wacht.', en: 'You also draw the value stream, to see where the material waits.', focus: ['flowS'] },
        { nl: 'Een operator meldt een probleem met een {t:Andon|andon}, en de teamleider komt helpen.', en: 'An operator reports a problem with an {t:Andon|andon}, and the team lead comes to help.', ...TOOL('Andon'), focus: ['tool1', 'andS', 'andon', 'teamlead'] },
        { nl: 'Zo pak je het probleem van lijn 3 aan, tot het niet meer terugkomt.', en: 'That is how you tackle the problem of line 3, until it no longer comes back.', focus: ['endS', 'jij', 'teamlead', 'unit'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het eerste station is Technisch probleemoplossen, in De fabriek beter maken.', en: 'The whole map. The first station is Engineering problem solving, in Making the plant better.', focus: 'map-improve' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met 5 keer waarom. Zo zie je het verschil tussen symptoom en grondoorzaak.', en: 'Start at Basics level with 5 whys. It shows the difference between symptom and root cause.', focus: ['tCause', 'start'] },
        { nl: 'Op niveau Werkkennis komen de grenzen van 5 keer waarom, opknippen, het A3-rapport en waardestroomanalyse.', en: 'At Working knowledge level come the limits of 5 whys, breaking down, the A3 report and value stream mapping.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen is en is niet, meten voor je concludeert, de 8D en een sessie begeleiden.', en: 'At Advanced level come is and is not, measuring before concluding, the 8D and facilitating a session.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen de fix verifiëren, proefopzetten, een A3 bespreken en een verbetersysteem.', en: 'At Expert level come verifying the fix, experiment design, reviewing an A3 and an improvement system.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says is what the captions show (as in the other module intros): short sentences, few commas, no colons and no
// symbols the voice would read aloud. Each topic scene ends on one short sentence naming the tool of that topic's lessons, without
// explaining it. Every drawn detail has its reason in the narration: the belt and the unit (line 3, where the too-light cartons
// come out), the board (the why tree is drawn on it), the chalk circle (the Ohno circle), the andon (an operator reports a
// problem with it), you and the team lead (the ones who stay after the shift).
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Later komen erbij een bord op twee palen naast de eenheid met een waaromboom, een krijtcirkel op de vloer voor de band, en een andon aan de voorste stijl van de eenheid: een lamp op de balk met een koord eronder. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: de vuleenheid met te lichte dozen, de route in twee groepen, een symptoom en een grondoorzaak, een keten van waarom-vragen, de rapportage naast de vloer, tellen en meten, cijfers die toetsen wat je denkt, het verbeteren als experiment, voorspellen, klein proberen en vergelijken, een A3-vel, het PDCA-rondje, stap voor stap verbeteren, elke dag en in events, een waardestroom met wachttijd, een andon en een lijn waar het probleem niet meer terugkomt. Aan het eind de hele kaart van Engineering met Technisch probleemoplossen verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. Later come a board on two posts beside the unit with a why tree, a chalk circle on the floor in front of the belt, and an andon on the front upright of the unit: a light on the beam with a cord under it. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: the filling unit with too-light cartons, the route in two groups, a symptom and a root cause, a chain of why questions, a report next to the floor, counting and measuring, figures that test what you think, improving as an experiment, predicting, trying it small and comparing, an A3 sheet, the PDCA round, improving step by step, every day and in events, a value stream with waiting time, an andon and a line where the problem no longer comes back. At the end the whole map of Engineering with Engineering problem solving lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

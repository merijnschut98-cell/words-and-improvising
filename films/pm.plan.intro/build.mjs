// Dev tool, not shipped. Builds the module intro film "Lijn 3 verhuist / Line 3
// moves" for Plannen (pm.plan), the first module intro film (v17): the high-over
// picture at the top of the module, before its four topics (Merijn, 13 Nov:
// "that high-over picture is the thing I need the most").
//
//   node films/pm.plan.intro/build.mjs            build the page
//   node films/pm.plan.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.plan.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.plan's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern (as eng.machining.overview, where one gearbox shaft follows its
// routing across the floor): ONE concrete project travels through the whole
// module, the map before the detail, few numbers and no calculations. Here a
// packing line moves to hall B during the three-week summer shutdown, and the
// STORY IS DRAWN IN THE ROOM, not in a generic meeting room: hall B with the
// marked floor and the dashed outline of line 3, line 4 standing next to it (it
// stays), the power cabinet with its cable, the switchboard on the wall (a dashed
// outline until it is there), and a cast that changes per topic.
//   s1 the goal: the hall, line 3's outline, the calendar of the shutdown; the
//      sponsor; the module's four topics as a route on the panel
//   s2 Opdeling en scope: deliverables (the floor, the power), the WBS tree, work
//      packages (cables, panel, test), scope (line 4 stays)   → pm.plan.wbs film
//   s3 Planning en kritiek pad: a dependency (the line waits for floor and power),
//      the outside installer at the cabinet as the critical path, the go/no-go
//      milestone with the sponsor at the end of the shutdown → pm.plan.schedule, .method
//   s4 Schatten en buffers: the mechanics give a range (best, most likely, worst),
//      effort against duration, one visible buffer        → pm.plan.wbs (estimate)
//   s5 Risico’s en mensen: the switchboard that may come late, the buyer as its one
//      owner, a mitigation (order it now: "who does what, and when" answered
//      as the Basis lesson does, one owner with a dated action), and the same
//      mechanics wanted everywhere                         → pm.plan.risk
//   s6 one plan: line 3 stands in its outline, the switchboard hangs; the four
//      pictures side by side, and how they feed each other (work that is not in
//      the tree is work nobody does)
//   s7 the shared Projects map (the kit's mapScene, as the app draws it) with Plan
//      lit, then the module's four topics with their levels as columns, where to
//      start, and what each later level adds
// Definitions as the Basis lessons word them (pm.plan.wbs, .scope, .schedule,
// .estimate, .risk). Terms come from the module's lessons and {n:} numbers from
// the module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit
// holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor from its cast (no consultant in the room), and the buyer, the installer
// (with a hard hat) and two mechanics drawn with pm.agile.scrum's cast
// (films/pm.agile.scrum/cast.mjs). The things of the hall are in ./hall.mjs.
// A panel at the right, in stage space, draws each step as a schema, labelled
// "voorbeeld" (the line's move) or "schema" (the module's map).
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
import { hallWorld, HALL_CSS } from './hall.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import pmMap from '../../src/content/courses/maps/pm.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the module
// The map this film draws, asserted against the index (the build fails if the
// module's topics or levels move): s7 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'pm.plan');
const LEVELS = {
  breakdown: ['pm.plan.wbs', 'pm.plan.scope', 'pm.plan.products', 'pm.plan.control'],
  schedule: ['pm.plan.schedule', 'pm.plan.method', 'pm.plan.network', 'pm.plan.compress'],
  estimate: ['pm.plan.estimate', 'pm.plan.techniques', 'pm.plan.spread', 'pm.plan.chain'],
  resources: ['pm.plan.risk', 'pm.plan.raci', 'pm.plan.capacity', 'pm.plan.riskvalue'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.plan has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// the Basis definitions as the film words them, and what s7 says the later levels add
has('pm.plan.wbs', ['Begin bij de resultaten, niet bij de activiteiten', 'wat iemand kan controleren', 'project bovenaan, de deliverables daaronder en de werkpakketten onderaan', 'één persoon of een klein team kan doen en afmaken']);
// s6: "work that is not in the tree is work nobody does", as the WBS lesson words it (the 100% rule)
has('pm.plan.wbs', ['Moet iets gebeuren en staat het niet in de boom, dan doet niemand het']);
has('pm.plan.wbs', ['If something has to happen and it isn’t in the tree, nobody will do it'], 'en');
has('pm.plan.schedule', ['pas kan beginnen als ander werk af is', 'langste keten van afhankelijk werk', 'bepaalt de einddatum', 'Een mijlpaal is een moment, geen activiteit', 'trage stappen buiten het team']);
// s4: the three points of the range are the lesson's own words, "meest waarschijnlijk" and "most likely"
has('pm.plan.estimate', ['Geef een bandbreedte', 'meest waarschijnlijk', 'Inspanning (effort) is het aantal uren werk', 'doorlooptijd (duration) is de kalendertijd', 'Zet één zichtbare buffer', 'Zet niet stiekem in elke taak wat extra']);
has('pm.plan.estimate', ['most likely'], 'en');
// s5: who does what, and when: one owner per risk with a dated action (the buyer orders it this week), nothing about roles (the RACI is Werkkennis)
has('pm.plan.risk', ['Een risicolijst', 'De risico-eigenaar is één persoon', 'een actie met een datum', 'wat je nu doet om het risico kleiner']);
has('pm.plan.risk', ['The risk owner is one person', 'an action with a date'], 'en');
for (const [id, word] of [['pm.plan.scope', 'Scope vastleggen'], ['pm.plan.method', 'werkwijze kiezen'], ['pm.plan.techniques', 'Schatmethodes'], ['pm.plan.raci', 'Rollen'],
  ['pm.plan.network', 'Rekenen met het netwerk'], ['pm.plan.spread', 'Onzekerheid optellen'], ['pm.plan.capacity', 'capaciteit'], ['pm.plan.compress', 'bewaken'], ['pm.plan.riskvalue', 'reserves']]) has(id, [word]);
assert(lessons.nl.get('pm.plan.scope').terms[0].def.startsWith('Wat het project oplevert'), 'Scope: what the project delivers');
// s7: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 222, col: 100, box: 92, tile: 190 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
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

// where things stand (cm). Line 3's marked floor is at the back wall at the right, under the switchboard;
// line 4, which stays, stands next to it; the power cabinet is at the back wall at the left.
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
// the last three weeks of the calendar are the summer shutdown
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
// the incoming power: from the wall opening to the cabinet, and on to the line
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people. The sponsor is the pm cast; the buyer, the installer and the two mechanics are pm.agile.scrum's
// figures, the installer with a hard hat. Each stands in a cue group; the cast that is not on stage is hidden by the stage script.
const person = (role, x, y, along) => w.person({ x, y, role, along });
const installer = scrumPerson(w, k, G, P, { x: 44, y: 62, key: 'installer', look: 'sm', along: 'y' });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-installer', installer + hall.hat(44, 62)),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 110, y: 96, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 150, y: 102, key: 'crew', look: 'dev2', along: 'x' })),
  g('pp-buyer', scrumPerson(w, k, G, P, { x: 224, y: 96, key: 'buyer', look: 'po', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, the goal, and
// each scene's parts. The shared Projects map (the kit's mapScene) sits under the
// panel; its place Plan is a cue group of its own (map-plan).
const tiles = ['tBreak', 'tSched', 'tEst', 'tRisk'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', ''))
  + cueG('wbs', g('wbsB', '')) + cueG('deliv', g('delivB', '')) + cueG('pkg', g('pkgB', '')) + cueG('scope', g('scopeB', ''))
  + g('barsB', '') + cueG('crit', g('critB', '')) + cueG('dep', g('depB', '')) + cueG('mile', g('mileB', ''))
  + cueG('range', g('rangeB', '')) + cueG('effort', g('effortB', '')) + cueG('dur', g('durB', '')) + cueG('buffer', g('bufferB', ''))
  + cueG('reg', g('regB', '')) + cueG('owner', g('ownerB', '')) + cueG('action', g('actionB', '')) + cueG('people', g('peopleB', ''))
  + cueG('plan', g('planB', '')) + cueG('loop', g('loopB', '')));
// the shared map, Plan lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.plan'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const PLAN_PLACE = pmMap.places.find((p) => p.module === 'pm.plan');
const MAPZ = [PLAN_PLACE.x + PLAN_PLACE.w / 2, PLAN_PLACE.y + PLAN_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.plan')}"`), 'the map lights pm.plan as a cue group');

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
// [ox, oy, s]: the point (ox, oy) of the hall, in stage units, is brought to the middle of the hall's half of the
// stage while the hall scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3's floor and the calendar
  { from: cam(170, 50, 50, 1.25), to: cam(180, 55, 50, 1.3) }, // s2 the floor, line 3's outline and line 4
  { from: cam(70, 60, 60, 1.2), to: cam(120, 65, 60, 1.15) }, // s3 the cabinet and the installer
  { from: cam(145, 85, 60, 1.2), to: cam(150, 90, 60, 1.25) }, // s4 the mechanics at line 3
  { from: cam(200, 55, 100, 1.25), to: cam(200, 70, 90, 1.3) }, // s5 the switchboard and the buyer
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.plan.intro',
  title: { nl: 'Lijn 3 verhuist: het hele plan', en: 'Line 3 moves: the whole plan' },
  module: 'pm.plan',
  // the map: per topic of pm.plan, the scene that explains it and its tile
  topics: {
    breakdown: { scene: 's2', cue: 'tBreak' },
    schedule: { scene: 's3', cue: 'tSched' },
    estimate: { scene: 's4', cue: 'tEst' },
    resources: { scene: 's5', cue: 'tRisk' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'De fabriek bouwt een nieuwe hal. Lijn 3 moet erheen, in de zomerstop van {n:3} weken.', en: 'The plant is building a new hall. Line 3 must move there, in the {n:3}-week summer shutdown.', focus: ['goal', 'floor', 'calendar'] },
        { nl: 'De sponsor heeft het doel gesteld. Deze module maakt er een plan van waar mensen in geloven.', en: 'The sponsor has set the goal. This module turns it into a plan that people believe in.', focus: ['goal', 'sponsor'] },
        { nl: 'We volgen dit ene project langs de vier onderwerpen van de module.', en: 'We follow this one project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Opdeling en scope', en: 'Breakdown and scope' },
      beats: [
        { nl: 'Eerste onderwerp: Opdeling en scope. Wat moet er allemaal gebeuren?', en: 'First topic: Breakdown and scope. What has to happen?', focus: ['tBreak', 'floor'] },
        { nl: 'Begin bij de {t:Deliverable|deliverables}: wat er straks is en wat iemand kan controleren.', en: 'Start with the {t:Deliverable|deliverables}: what will exist at the end and can be checked.', cue: { Deliverable: 'deliv' }, focus: ['deliv', 'floor'] },
        { nl: 'Zo ontstaat een {t:WBS|WBS}: een boom met het project bovenaan en de deliverables daaronder.', en: 'This gives a {t:WBS|WBS}: a tree with the project on top and the deliverables below.', cue: { WBS: 'wbs' }, focus: ['wbs', 'floor'] },
        { nl: 'Onderaan het {t:Werkpakket|werkpakket}: werk dat één persoon of een klein team kan afmaken.', en: 'At the bottom the {t:Work package|work package}: work one person or a small team can finish.', cue: { Werkpakket: 'pkg' }, focus: ['pkg', 'power'] },
        { nl: '{t:Scope|Scope}: wat het project oplevert. Lijn 4 meteen ombouwen hoort er niet bij.', en: '{t:Scope|Scope}: what the project delivers. Rebuilding line 4 as well is not part of it.', cue: { Scope: 'scope' }, focus: ['scope', 'line4'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Planning en kritiek pad', en: 'Schedule and critical path' },
      beats: [
        { nl: 'Tweede onderwerp: Planning en kritiek pad. Wat moet op wat wachten?', en: 'Second topic: Schedule and critical path. What waits for what?', focus: ['tSched', 'calendar'] },
        { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: de lijn verhuist pas als vloer en stroom klaar zijn.', en: 'A {t:Dependency|dependency}: the line moves only once the floor and the power are ready.', cue: { Afhankelijkheid: 'dep' }, focus: ['dep', 'floor', 'power'] },
        { nl: 'De nieuwe stroomaansluiting duurt het langst. Die keten is het {t:Kritiek pad|kritieke pad}.', en: 'The new power supply takes longest. That chain is the {t:Critical path|critical path}.', cue: { 'Kritiek pad': 'crit' }, focus: ['crit', 'installer', 'power'] },
        { nl: 'Een {t:Mijlpaal|mijlpaal}: na de stop beslist de sponsor of de lijn in productie gaat.', en: 'A {t:Milestone|milestone}: after the shutdown the sponsor decides if the line goes into production.', cue: { Mijlpaal: 'mile' }, focus: ['mile', 'sponsor'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Schatten en buffers', en: 'Estimating and buffers' },
      beats: [
        { nl: 'Derde onderwerp: Schatten en buffers. Hoe lang duurt het echt?', en: 'Third topic: Estimating and buffers. How long does it really take?', focus: 'tEst' },
        { nl: 'Geen punt maar een {t:Bandbreedte|bandbreedte}: van het beste tot het slechtste geval.', en: 'Not a point but a {t:Range|range}: from the best case to the worst.', cue: { Bandbreedte: 'range' }, focus: ['range', 'crew'] },
        { nl: '{t:Inspanning|Inspanning} is uren werk, {t:Doorlooptijd|doorlooptijd} is kalendertijd.', en: '{t:Effort|Effort} is hours of work, {t:Duration|duration} is calendar time.', cue: { Inspanning: 'effort', Doorlooptijd: 'dur' }, focus: ['effort', 'dur'] },
        { nl: 'Eén zichtbare {t:Buffer|buffer} voor het eind van de stop, geen stiekeme marge in elke taak.', en: 'One visible {t:Buffer|buffer} before the end of the shutdown, no hidden padding in every task.', cue: { Buffer: 'buffer' }, focus: ['buffer', 'calendar'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Risico’s en mensen', en: 'Risk and resources' },
      beats: [
        { nl: 'Vierde onderwerp: Risico’s en mensen. Wat kan er misgaan, en wie doet wat?', en: 'Fourth topic: Risk and resources. What can go wrong, and who does what?', focus: ['tRisk', 'switch'] },
        { nl: 'Een {t:Risicolijst|risicolijst}: de nieuwe schakelkast komt misschien te laat.', en: 'A {t:Risk register|risk register}: the new switchboard may arrive late.', cue: { Risicolijst: 'reg' }, focus: ['reg', 'switch'] },
        { nl: 'Eén {t:Risico-eigenaar|risico-eigenaar}, de inkoper. Een {t:Beheersmaatregel|beheersmaatregel}: de kast nu bestellen.', en: 'One {t:Risk owner|risk owner}, the buyer. A {t:Mitigation|mitigation}: order the switchboard now.', cue: { 'Risico-eigenaar': 'owner', Beheersmaatregel: 'action' }, focus: ['owner', 'action', 'buyer'] },
        { nl: 'En mensen: in de zomerstop wil iedereen dezelfde monteurs.', en: 'And people: in the shutdown everyone wants the same mechanics.', focus: ['people', 'crew'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén plan', en: 'One plan' },
      beats: [
        { nl: 'Samen één plan: het werk, de tijd, de duur en wat er mis kan gaan.', en: 'Together one plan: the work, the time, the duration and what can go wrong.', focus: ['plan', 'line3'] },
        { nl: 'Alles hangt samen: een beheersmaatregel is werk, en werk dat niet in de boom staat doet niemand.', en: 'It all connects: a mitigation is work, and work that is not in the tree is work nobody does.', focus: ['loop', 'switch'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Plannen is het tweede station op de weg van een project.', en: 'The map of Projects: Plan is the second station on the road of a project.', focus: 'map-plan' },
        { nl: 'Plannen heeft vier onderwerpen, elk met vier niveaus.', en: 'Plan has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Opdeling en scope, op niveau Basis.', en: 'Start with Breakdown and scope, at Basics level.', focus: ['tBreak', 'start'] },
        { nl: 'Werkkennis: scope vastleggen, een werkwijze kiezen, schatmethodes en rollen.', en: 'Working knowledge: fixing the scope, choosing a way of working, estimating methods and roles.', focus: 'lv2' },
        { nl: 'Gevorderd rekent: het netwerk, onzekerheid, capaciteit. Expert bewaakt en beheert reserves.', en: 'Advanced calculates: the network, uncertainty, capacity. Expert tracks and manages reserves.', focus: ['lv3', 'lv4'] },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, about 600
// words a language, each thing said once (trimmed of repetition in review). Short sentences, few colons and comma lists, no symbols the
// voice would read aloud and nothing in parentheses: the kit's narration guard
// (films/_kit/assert.mjs, checkNarration) holds every module film to that, and
// the render guard caps a pause inside a sentence at 0.4 s. Words checked with
// espeak-ng phonemes through Piper's own bridge (nl_NL-alex): "deliverable" is
// said as "resultaat" (as pm.plan.wbs); scope, werkpakket, mijlpaal and issue go
// through the rules of pm.plan.wbs, pm.plan.schedule and pm.plan.risk in
// films/_kit/timeline.mjs, and this film's own SAY group (the last of the Dutch
// list) carries what it alone says. The module "Intake" is not named aloud: the
// Dutch voice reads it "in-taa-ke".
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Een fabriek bouwt een nieuwe hal. Verpakkingslijn 3 moet erheen, in de zomerstop van {n:3} weken.',
      en: 'A plant is building a new hall. Packing line 3 has to move there, during the summer shutdown of {n:3} weeks.' },
    { nl: 'De sponsor heeft het doel gesteld. Daar gaat deze module over. Plannen is van een doel naar een plan waar mensen in geloven.',
      en: 'The sponsor has set the goal. That is what this module is about. Planning turns a goal into a plan that people believe in.' },
    { nl: 'We volgen dit ene project door de hele module, langs vier onderwerpen. Eerst het grote plaatje. De details en het rekenwerk komen later, in de lessen.',
      en: 'We follow this one project through the whole module, past four topics. First the big picture. The details and the calculations come later, in the lessons.' },
  ],
  [ // s2 breakdown and scope
    { nl: 'Het eerste onderwerp is Opdeling en scope. Wat moet er allemaal gebeuren voordat de lijn weer draait?',
      en: 'The first topic is Breakdown and scope. What has to happen before the line runs again?' },
    { nl: 'Begin bij de resultaten, niet bij de activiteiten. Wat is er straks, dat iemand kan controleren? Een vloer die klaar is. Stroom en perslucht. De lijn op zijn plek. En getrainde operators.',
      en: 'Start with the deliverables, not the activities. What will exist at the end that someone can check? A floor that is ready. Power and compressed air. The line in its place. And trained operators.' },
    { nl: 'Zo ontstaat een {t:WBS|WBS}, een boom. Het project staat bovenaan, met de resultaten daaronder.',
      en: 'This gives a {t:WBS|WBS}, a tree. The project sits at the top, with the deliverables below it.' },
    { nl: 'Onderaan hangen de werkpakketten. Elk pakket kan één persoon of een klein team doen en afmaken.',
      en: 'The work packages hang at the bottom. One person or a small team can do and finish each one.' },
    { nl: 'En je spreekt de scope af, wat het project wel en niet doet. Lijn 4 meteen ombouwen? Dat hoort er niet bij.',
      en: 'And you agree the scope, what the project does and does not do. Rebuild line 4 while we are at it? That is not part of it.' },
  ],
  [ // s3 schedule and critical path
    { nl: 'Het tweede onderwerp is Planning en kritiek pad. Nu zet je de resultaten in de tijd.',
      en: 'The second topic is Schedule and critical path. Now you put the deliverables in time.' },
    { nl: 'Sommig werk kan pas beginnen als ander werk af is. Dat is een afhankelijkheid. De lijn kan pas verhuizen als de vloer klaar is en de stroom erop zit.',
      en: 'Some work can only start when other work is done. That is a dependency. The line can only move once the floor is ready and the power is on.' },
    { nl: 'De nieuwe stroomaansluiting komt van een installateur van buiten, en die duurt het langst. Die keten bepaalt de einddatum. Dat is het kritieke pad, en daar let je het scherpst op.',
      en: 'The new power supply comes from an outside contractor, and it takes longest. That chain sets the end date. It is the critical path, and you watch it most closely.' },
    { nl: 'En je zet mijlpalen, momenten met een besluit. De belangrijkste komt aan het eind van de stop. Gaat de lijn in productie, of niet?',
      en: 'And you set milestones, moments with a decision. The key one comes at the end of the shutdown. Does the line go into production, or not?' },
  ],
  [ // s4 estimating and buffers
    { nl: 'Het derde onderwerp is Schatten en buffers. Hoe lang duurt elk stuk werk echt?',
      en: 'The third topic is Estimating and buffers. How long does each piece of work really take?' },
    { nl: 'Vraag de monteurs naar het beste, het slechtste en het meest waarschijnlijke geval. Dan krijg je een bandbreedte in plaats van één getal, en zie je waar de onzekerheid zit.',
      en: 'Ask the mechanics for the best, the worst and the most likely case. Then you get a range instead of one number, and you see where the uncertainty is.' },
    { nl: 'Reken ook de uren om naar weken. Inspanning is het aantal uren werk. Doorlooptijd is de tijd op de kalender, want de monteurs hebben ook hun gewone werk.',
      en: 'Turn the hours into weeks as well. Effort is the number of hours of work. Duration is the time on the calendar, because the mechanics also have their normal job.' },
    { nl: 'En zet één zichtbare buffer vlak voor het eind van de stop, in plaats van stiekem wat extra in elke taak.',
      en: 'And put one visible buffer just before the end of the shutdown, instead of hiding a little extra in every task.' },
  ],
  [ // s5 risk and resources
    { nl: 'Het vierde onderwerp is Risico’s en mensen. Wat kan er misgaan, en wie doet wat?',
      en: 'The fourth topic is Risk and resources. What can go wrong, and who does what?' },
    { nl: 'Een risicolijst zet de risico’s op een rij. Hier bijvoorbeeld de nieuwe schakelkast voor de stroom. Die komt misschien te laat.',
      en: 'A risk register lists the risks. Here, for example, the new switchboard for the power supply. It may arrive late.' },
    { nl: 'Elk risico krijgt één eigenaar, hier de inkoper. En een beheersmaatregel, iets wat je nu al doet. Hij bestelt de kast deze week.',
      en: 'Each risk gets one owner, here the buyer. And a mitigation, something you do now. He orders the switchboard this week.' },
    { nl: 'En dan de mensen. In de zomerstop wil iedereen dezelfde monteurs.',
      en: 'And then the people. In the shutdown everyone wants the same mechanics.' },
  ],
  [ // s6 one plan
    { nl: 'Leg het naast elkaar en je ziet één plan. De boom geeft het werk. De planning zet het in de tijd. De schattingen geven de duur. En de risicolijst zegt wat er mis kan gaan.',
      en: 'Put it side by side and you see one plan. The tree gives the work. The schedule puts it in time. The estimates give the duration. And the risk register says what can go wrong.' },
    { nl: 'De onderwerpen hangen samen. Een beheersmaatregel is ook werk. Staat dat niet in de boom, dan doet niemand het. Zet het er dus bij als werkpakket, en in de planning.',
      en: 'The topics hang together. A mitigation is work too. If it is not in the tree, nobody will do it. So add it as a work package, and put it in the schedule.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Plannen is het tweede station op de weg van een project.',
      en: 'This is the map of Projects. Plan is the second station on the road of a project.' },
    { nl: 'Plannen heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Plan has four topics, each with four levels.' },
    { nl: 'Begin bovenaan, bij Opdeling en scope, op het eerste niveau.',
      en: 'Start at the top, with Breakdown and scope, at the first level.' },
    { nl: 'Op het tweede niveau leg je de scope vast en kies je een werkwijze. Je leert schatmethodes en verdeelt de rollen.',
      en: 'At the second level you fix the scope and choose a way of working. You learn estimating methods and share out the roles.' },
    { nl: 'Op het derde niveau reken je het netwerk door, tel je onzekerheid op en plan je de capaciteit. Het vierde niveau bewaakt het plan en beheert de reserves.',
      en: 'At the third level you work through the network, add up uncertainty and plan capacity. The fourth level tracks the plan and manages the reserves.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst GRID = ${JSON.stringify(GRID)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="installer"],[data-cue="buyer"],[data-cue="crew"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-pkg{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-stop{fill:color-mix(in srgb,var(--fp-accent) 10%,transparent);stroke:var(--anatomy-lo);stroke-width:1;stroke-dasharray:3 3}
.pm-range{fill:color-mix(in srgb,var(--fp-accent) 16%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-buf{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 3}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-pkg,.pm-bar,.pm-range,.pm-buf,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet. Op de vloer de nieuwe vloer van lijn 3 met een gestippelde omtrek; ernaast, vlak bij de zijwand, staat lijn 4, die blijft waar hij is. Links de stroomkast met de kabel van buiten, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender met weken, waarvan de laatste drie de zomerstop zijn. Per onderwerp komen er mensen bij: de sponsor, de installateur van buiten met een helm, de monteurs en de inkoper. Aan het eind staat lijn 3 op zijn plek en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel; de vier onderwerpen van de module als tegels; een WBS met vier deliverables, werkpakketten en wat buiten de scope valt; een planning met balken, de afhankelijkheden, het kritieke pad en een mijlpaal; een bandbreedte met beste, meest waarschijnlijke en slechtste geval, inspanning tegen doorlooptijd en één buffer; een risicolijst met eigenaar en maatregel, en de monteurs; de vier plaatjes samen als één plan. Aan het eind de kaart van Projecten met Plannen verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go. On the floor the new floor of line 3 with a dashed outline; next to it, near the side wall, stands line 4, which stays where it is. At the left the power cabinet with the cable from outside, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar of weeks, the last three of which are the summer shutdown. Each topic brings people: the sponsor, the outside installer in a hard hat, the mechanics and the buyer. At the end line 3 stands in place and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the goal; the module’s four topics as tiles; a WBS with four deliverables, work packages and what is out of scope; a schedule of bars with the dependencies, the critical path and a milestone; a range with the best, most likely and worst case, effort against duration and one buffer; a risk register with an owner and a mitigation, and the mechanics; the four pictures together as one plan. At the end the map of Projects with Plan lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

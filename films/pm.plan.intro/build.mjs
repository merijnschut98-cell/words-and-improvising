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
// packing line moves to a new hall during the three-week summer shutdown:
//   s1 the goal, and the module's four topics as a route (the map, greyed)
//   s2 Opdeling en scope: deliverables, the WBS tree, work packages, scope
//      (rebuilding line 4 is out)                         → pm.plan.wbs film
//   s3 Planning en kritiek pad: a dependency (the line waits for floor and
//      power), the outside power supply as the critical path, the go/no-go
//      milestone at the end of the shutdown               → pm.plan.schedule, .method
//   s4 Schatten en buffers: a range, effort against duration, one visible
//      buffer before the end of the shutdown              → pm.plan.wbs (estimate)
//   s5 Risico's en mensen: the register (the switchboard may come late), one
//      owner, a mitigation (order it now), the same mechanics wanted everywhere
//                                                         → pm.plan.risk
//   s6 one plan: the four pictures side by side, and how they feed each other
//   s7 the map: four topics with four levels each, where to start, and what
//      each later level adds
// Definitions as the Basis lessons word them (pm.plan.wbs, .scope, .schedule,
// .estimate, .risk). Terms come from the module's lessons and {n:} numbers from
// the module's text (the kit's intro mode, films/_kit/build-film.mjs); the map
// rule (every topic named in a caption or on a card, and lit) is checked there.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// meeting room of pm.plan.schedule and pm.plan.wbs, with the whiteboard, the
// calendar strip, the table with the A4 and the laptop, and the cast ("jij" the
// consultant at the board, the sponsor, the team lead, the planner), plus two
// mechanics drawn with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs).
// A panel at the right, in stage space, draws each step, labelled "voorbeeld"
// (the line's move) or "schema" (the module's map); the board repeats it in
// miniature, and in s6 the A4 on the table carries the whole plan.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
import { MODULES } from '../../src/content/courses/index.js';

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
const has = (id, list) => { const l = lessons.nl.get(id); const text = [l.title, ...l.teach].join('\n'); for (const s of list) assert(text.includes(s), `${id} no longer says "${s}"`); };
// the Basis definitions as the film words them, and what s7 says the later levels add
has('pm.plan.wbs', ['Begin bij de resultaten, niet bij de activiteiten', 'wat iemand kan controleren', 'project bovenaan, de deliverables daaronder en de werkpakketten onderaan', 'één persoon of een klein team kan doen en afmaken']);
has('pm.plan.schedule', ['pas kan beginnen als ander werk af is', 'langste keten van afhankelijk werk', 'bepaalt de einddatum', 'Een mijlpaal is een moment, geen activiteit', 'trage stappen buiten het team']);
has('pm.plan.estimate', ['Geef een bandbreedte', 'Inspanning (effort) is het aantal uren werk', 'doorlooptijd (duration) is de kalendertijd', 'Zet één zichtbare buffer', 'Zet niet stiekem in elke taak wat extra']);
has('pm.plan.risk', ['Een risicolijst', 'De risico-eigenaar is één persoon', 'wat je nu doet om het risico kleiner']);
for (const [id, word] of [['pm.plan.scope', 'Scope vastleggen'], ['pm.plan.method', 'werkwijze kiezen'], ['pm.plan.techniques', 'Schatmethodes'], ['pm.plan.raci', 'Rollen'],
  ['pm.plan.network', 'Rekenen met het netwerk'], ['pm.plan.spread', 'Onzekerheid optellen'], ['pm.plan.capacity', 'capaciteit'], ['pm.plan.compress', 'bewaken'], ['pm.plan.riskvalue', 'reserves']]) has(id, [word]);
assert(lessons.nl.get('pm.plan.scope').terms[0].def.startsWith('Wat het project oplevert'), 'Scope: what the project delivers');

// ---------------------------------------------------------------- the world (the room of pm.plan.schedule)
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 228, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const CAL = w.calendar({ y0: 30, z0: 104, weeks: 15, cw: 12.6, ch: 46 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const PLAN = w.sheet({ x: 140, y: 154, z: TZ, w: 29.7, d: 21 });
const DOC_AT = w.at([155, 165, TZ]);
// the panel's drawing area (below the head line) that the board and the A4 copy
const PANEL_AREA = { x: 324, y: 46, w: 300, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const docMini = `<g transform="${PLAN.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, 1.2, 1.2, 28.5, 19.8)}">${g('dMini', '')}</g></g>`;
const calHi = `<g transform="${CAL.face}">${g('calHi', '')}</g>`;
// the calendar's last three weeks are the summer shutdown
const CELLS = [...Array(15).keys()].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const STOP = [12, 13, 14];

const world = [
  w.room(ROOM),
  w.clock(258, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calHi),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  w.stack({ x: 104, y: 126, z: TZ, n: 4 }),
  cueG('doc', PLAN.svg + docMini),
  cueG('laptop', w.laptop({ x: 214, y: 140, z: TZ, toward: 1 })),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 262, y: 152, role: 'sponsor', along: 'y' }),
  // the two mechanics the shutdown needs, in front of the table (pm.agile.scrum's cast, key "crew")
  scrumPerson(w, k, G, P, { x: 136, y: 222, key: 'crew', look: 'dev', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 176, y: 230, key: 'crew', look: 'dev2', along: 'x' }),
  w.person({ x: 236, y: 212, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level marks, the goal, and
// each scene's parts.
const tiles = ['tBreak', 'tSched', 'tEst', 'tRisk'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('panel', `<rect class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', ''))
  + cueG('wbs', g('wbsB', '')) + cueG('deliv', g('delivB', '')) + cueG('pkg', g('pkgB', '')) + cueG('scope', g('scopeB', ''))
  + g('barsB', '') + cueG('crit', g('critB', '')) + cueG('dep', g('depB', '')) + cueG('mile', g('mileB', ''))
  + cueG('range', g('rangeB', '')) + cueG('effort', g('effortB', '')) + cueG('dur', g('durB', '')) + cueG('buffer', g('bufferB', ''))
  + cueG('reg', g('regB', '')) + cueG('owner', g('ownerB', '')) + cueG('action', g('actionB', '')) + cueG('people', g('peopleB', ''))
  + cueG('plan', g('planB', '')) + cueG('loop', g('loopB', '')));

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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const CAM = [
  { from: [150, 210, 1], to: [150, 200, 1.06] },
  { from: [150, 200, 1.06], to: [130, 170, 1.1] },
  { from: [130, 170, 1.1], to: [60, 170, 1.08] },
  { from: [150, 200, 1.04], to: [160, 230, 1.1] },
  { from: [160, 230, 1.1], to: [150, 210, 1.04] },
  { from: [150, 200, 1.04], to: [DOC_AT[0], DOC_AT[1], 1.16] },
  { from: [150, 210, 1.06], to: [150, 200, 1] },
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const C = { CELLS, STOP };
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
        { nl: 'De fabriek bouwt een nieuwe hal. Lijn 3 moet erheen, in de zomerstop van {n:3} weken.', en: 'The plant is building a new hall. Line 3 must move there, in the {n:3}-week summer shutdown.', focus: ['goal', 'calendar'] },
        { nl: 'Deze module: van een doel naar een plan waar mensen in geloven.', en: 'This module: from a goal to a plan that people believe in.', focus: ['goal', 'sponsor'] },
        { nl: 'We volgen dit ene project langs de vier onderwerpen van de module.', en: 'We follow this one project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Opdeling en scope', en: 'Breakdown and scope' },
      beats: [
        { nl: 'Eerste onderwerp: Opdeling en scope. Wat moet er allemaal gebeuren?', en: 'First topic: Breakdown and scope. What has to happen?', focus: 'tBreak' },
        { nl: 'Begin bij de {t:Deliverable|deliverables}: wat er straks is en wat iemand kan controleren.', en: 'Start with the {t:Deliverable|deliverables}: what will exist at the end and can be checked.', cue: { Deliverable: 'deliv' }, focus: 'deliv' },
        { nl: 'Zo ontstaat een {t:WBS|WBS}: een boom met het project bovenaan en de deliverables daaronder.', en: 'This gives a {t:WBS|WBS}: a tree with the project on top and the deliverables below.', cue: { WBS: 'wbs' }, focus: ['wbs', 'board'] },
        { nl: 'Onderaan het {t:Werkpakket|werkpakket}: werk dat één persoon of een klein team kan afmaken.', en: 'At the bottom the {t:Work package|work package}: work one person or a small team can finish.', cue: { Werkpakket: 'pkg' }, focus: 'pkg' },
        { nl: '{t:Scope|Scope}: wat het project oplevert. Lijn 4 meteen ombouwen hoort er niet bij.', en: '{t:Scope|Scope}: what the project delivers. Rebuilding line 4 as well is not part of it.', cue: { Scope: 'scope' }, focus: ['scope', 'sponsor'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Planning en kritiek pad', en: 'Schedule and critical path' },
      beats: [
        { nl: 'Tweede onderwerp: Planning en kritiek pad. Wat moet op wat wachten?', en: 'Second topic: Schedule and critical path. What waits for what?', focus: ['tSched', 'calendar'] },
        { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: de lijn verhuist pas als vloer en stroom klaar zijn.', en: 'A {t:Dependency|dependency}: the line moves only once the floor and the power are ready.', cue: { Afhankelijkheid: 'dep' }, focus: 'dep' },
        { nl: 'De nieuwe stroomaansluiting duurt het langst. Die keten is het {t:Kritiek pad|kritieke pad}.', en: 'The new power supply takes longest. That chain is the {t:Critical path|critical path}.', cue: { 'Kritiek pad': 'crit' }, focus: 'crit' },
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
        { nl: 'Vierde onderwerp: Risico’s en mensen. Wat kan er misgaan, en wie doet wat?', en: 'Fourth topic: Risk and resources. What can go wrong, and who does what?', focus: 'tRisk' },
        { nl: 'Een {t:Risicolijst|risicolijst}: de nieuwe schakelkast komt misschien te laat.', en: 'A {t:Risk register|risk register}: the new switchboard may arrive late.', cue: { Risicolijst: 'reg' }, focus: 'reg' },
        { nl: 'Eén {t:Risico-eigenaar|risico-eigenaar}, de inkoper. Een {t:Beheersmaatregel|beheersmaatregel}: de kast nu bestellen.', en: 'One {t:Risk owner|risk owner}, the buyer. A {t:Mitigation|mitigation}: order the switchboard now.', cue: { 'Risico-eigenaar': 'owner', Beheersmaatregel: 'action' }, focus: ['owner', 'action'] },
        { nl: 'En mensen: in de zomerstop wil iedereen dezelfde monteurs.', en: 'And people: in the shutdown everyone wants the same mechanics.', focus: ['people', 'crew'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén plan', en: 'One plan' },
      beats: [
        { nl: 'Samen één plan: het werk, de tijd, de duur en wat er mis kan gaan.', en: 'Together one plan: the work, the time, the duration and what can go wrong.', focus: ['plan', 'doc'] },
        { nl: 'Alles hangt samen: een beheersmaatregel wordt een nieuw werkpakket in de planning.', en: 'It all connects: a mitigation becomes a new work package in the schedule.', focus: 'loop' },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van de module: vier onderwerpen, elk met vier niveaus.', en: 'The map of the module: four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Opdeling en scope, op niveau Basis. Dan planning, schatten en risico’s.', en: 'Start with Breakdown and scope, at Basics level. Then schedule, estimates and risks.', focus: ['tBreak', 'start'] },
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
// What the voice says, per scene and beat: the high-over picture, about 520
// words a language. Short sentences, few colons and comma lists (the render
// guard caps a pause inside a sentence at 0.4 s), no symbols the voice would
// read aloud and nothing in parentheses. Words checked with espeak-ng phonemes
// through Piper's own bridge (nl_NL-alex): "deliverable" is said as
// "resultaat" (as pm.plan.wbs); scope, werkpakket, mijlpaal and issue go through
// the rules of pm.plan.wbs, pm.plan.schedule and pm.plan.risk in
// films/_kit/timeline.mjs, and this film's own SAY group (the last of the
// Dutch list) carries what it alone says.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Een fabriek bouwt een nieuwe hal. Verpakkingslijn 3 moet erheen, in de zomerstop van {n:3} weken.',
      en: 'A plant is building a new hall. Packing line 3 has to move there, during the summer shutdown of {n:3} weeks.' },
    { nl: 'Daar gaat deze module over. Plannen is van een doel naar een plan waar mensen in geloven.',
      en: 'That is what this module is about. Planning turns a goal into a plan that people believe in.' },
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
    { nl: 'Vraag de monteurs naar het beste en het slechtste geval. Dan krijg je een bandbreedte in plaats van één getal, en zie je waar de onzekerheid zit.',
      en: 'Ask the mechanics for the best and the worst case. Then you get a range instead of one number, and you see where the uncertainty is.' },
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
    { nl: 'En dan de mensen. In de zomerstop wil iedereen dezelfde monteurs. Wie doet dus wat, en wanneer?',
      en: 'And then the people. In the shutdown everyone wants the same mechanics. So who does what, and when?' },
  ],
  [ // s6 one plan
    { nl: 'Leg het naast elkaar en je ziet één plan. De boom geeft het werk. De planning zet het in de tijd. De schattingen geven de duur. En de risicolijst zegt wat er mis kan gaan.',
      en: 'Put it side by side and you see one plan. The tree gives the work. The schedule puts it in time. The estimates give the duration. And the risk register says what can go wrong.' },
    { nl: 'De onderwerpen hangen samen. Een beheersmaatregel wordt vaak een nieuw werkpakket, en dat verandert de planning weer.',
      en: 'The topics hang together. A mitigation often becomes a new work package, and that changes the schedule again.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van de module. Vier onderwerpen, elk met vier niveaus.',
      en: 'This is the map of the module. Four topics, each with four levels.' },
    { nl: 'Begin bovenaan, bij Opdeling en scope, op het eerste niveau. Daarna de planning, het schatten en de risico’s.',
      en: 'Start at the top, with Breakdown and scope, at the first level. Then the schedule, the estimating and the risks.' },
    { nl: 'Op het tweede niveau leg je de scope vast en kies je een werkwijze. Je leert schatmethodes en verdeelt de rollen.',
      en: 'At the second level you fix the scope and choose a way of working. You learn estimating methods and share out the roles.' },
    { nl: 'Het derde niveau rekent. Je rekent het netwerk door en telt onzekerheid op, en je plant de capaciteit. Het vierde niveau bewaakt het plan en beheert de reserves.',
      en: 'The third level calculates. You work through the network and add up uncertainty, and you plan capacity. The fourth level tracks the plan and manages the reserves.' },
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
// no symbol the voice would read aloud, nothing spoken in parentheses or quotes,
// none of the words the Dutch voice misreads, and few pauses inside a sentence
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '');
  if (/[/&×=+()“”"‘<>≈→~:;%]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud, or a colon, in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /\b(deliverable|definition of done|PMI|deadline)\b/i.test(plain)) throw new Error(`narration: a word the Dutch voice misreads in "${line.nl.slice(0, 50)}"`);
  for (const sentence of plain.split(/[.?!]\s+/)) if ((sentence.match(/,/g) || []).length > 2) throw new Error(`narration: more than two commas in "${sentence.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"],[data-cue="crew"])';
const css = PM_CSS + `
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
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini text{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini :is(.pm-card,.pm-tile,.pm-badge,.pm-crit,.pm-arrow,.pm-link,.pm-pkg,.pm-bar,.pm-range,.pm-buf,.pm-out,.pm-lvl){stroke-width:.7px}
.pm-mini :is(.pm-axis,.pm-dia,.pm-stop){stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok; aan de zijwand een kalenderstrook met weken, waarvan de laatste drie de zomerstop zijn. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak aan het rechtereind, de planner met een tablet en twee monteurs aan de voorkant. Op tafel papier, een laptop, twee kopjes en een A4. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel, lijn 3 draait na de zomerstop in hal B; de vier onderwerpen van de module als tegels; een WBS met vier deliverables, werkpakketten en wat buiten de scope valt; een planning met balken, de afhankelijkheden, het kritieke pad en een mijlpaal; een bandbreedte, inspanning tegen doorlooptijd en één buffer; een risicolijst met eigenaar en maatregel, en de monteurs; de vier plaatjes samen als één plan; en de kaart, vier onderwerpen met elk vier niveaus.',
  en: 'A meeting room. On the back wall a whiteboard and a clock; on the side wall a calendar strip of weeks, the last three of which are the summer shutdown. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit at the right end, the planner with a tablet and two mechanics at the front. On the table paper, a laptop, two cups and a page. At the right a panel, marked as an example or a diagram: the goal, line 3 runs in hall B after the shutdown; the module’s four topics as tiles; a WBS with four deliverables, work packages and what is out of scope; a schedule of bars with the dependencies, the critical path and a milestone; a range, effort against duration and one buffer; a risk register with an owner and a mitigation, and the mechanics; the four pictures together as one plan; and the map, four topics with four levels each.',
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

// Dev tool, not shipped. Builds the module intro film "Het net draaiend houden / Keeping the grid running" for
// Netbedrijf en assetmanagement (eng.gridops), an Engineering module intro film (v17, Task 13) and the sixth intro of
// the energy zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that
// high-over picture is the thing I need the most"). Pattern and rules: films/eng.gridbasics.intro and
// films/eng.machining.intro (the approved references) and the notes section "Engineering module intros".
//
//   node films/eng.gridops.intro/build.mjs            build the page
//   node films/eng.gridops.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.gridops.intro.html: one offline page with the anatomy kit, the stage script
// and the player inlined. The index names it (eng.gridops's `intro`), coursehome shows it above the topics, sw.js
// precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more
// power). Its sixth station, Netbedrijf en assetmanagement, says the grid operator upgrades the plant's connection,
// then watches the grid, fixes outages and steers when it is full; it runs a readiness check and switches by a
// switching plan; without this the connection takes longer and a job drops the power unexpectedly. This film is
// line 3's bigger connection seen from inside the grid operator, in the same hall B (the cable through the left
// wall to the power cabinet, line 3 at the right), with two people of the operator: the technician of the gridbasics
// intro (hard hat, at the wall where the cable enters) and a work preparer (the lesson's word; not "planner", who is the gridplanning station's figure in the field film). Every topic of the module has its place on that
// one job:
//   s1 line 3 gets a heavier connection and that is the grid operator's work (the five core tasks as
//      eng.gridbasics.roles words them: connect customers, maintain the grid, restore outages); the map before
//      any detail: four topics in two groups, the request and the field work (topics 1 and 2), then the daily work
//      of outages and a full grid (topics 3 and 4)                                  → eng.gridops.request, eng.gridbasics.roles
//   s2 Van aanvraag tot aansluiting: the plant applies and gets an offer; work preparation (permit, material,
//      planning) is the work preparer's; before the job is planned the work preparer runs a readiness check (the field film's
//      tool; Werkkennis, .chain)                                                     → .request (.chain)
//   s3 Werk in het veld: a heavier cable to hall B is work for the crew; the crew switches a part of the grid off
//      and the wrong order can drop customers; the technician switches by a switching plan (the field film's
//      tool; Werkkennis, .switching)                                                 → .workload (.switching)
//   s4 Storingen en assetrisico: a cable fails and the plant is dark; the control room sees it and switches round;
//      the technician reads the fault indicators and the control room closes the normally open point (Basis,
//      .outage); the plant hangs on the ring below the fault, so it is dark until the point is closed (hedged: "can be")
//                                                                                    → .outage (.assets)
//   s5 Congestiemanagement in de bedrijfsvoering: at peak moments the grid is full; a team steers offtake and
//      feed-in and buys flexibility through GOPACS (Basis, .cmbasics); the grid keeps running while line 3 gets its
//      heavier connection, which is where the field film picks it up (the operator upgrades the connection, watches
//      the grid, steers when it is full)                                            → .cmbasics
//   s6 the shared Engineering map (the kit's mapScene) with Netbedrijf en assetmanagement lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a
// topic scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are real
// things of the topic at Basis or Working knowledge level, one short sentence each, not explained: the readiness check
// and the switching plan (the field film's two, Werkkennis), the fault indicator and the normally open point (Basis,
// the outage lesson) and GOPACS (Basis). A Werkkennis tool named in a scene is not named again in the closing grid
// (it says commissioning, safe switching, the fault service and the congestion study, not the check or the plan); the
// closing grid has one beat per later level in the app's level words; the story ends where the field film picks it up
// (the grid keeps running while line 3 gets its heavier connection), in the last topic scene.
// Topic 3's Werkkennis lesson (the fault service) has no tool, so its tools are the two Basis ones; asset risk
// (the risk ranking and matrix, Gevorderd .assets) is not taught here: the closing grid names asset management at Gevorderd.
// Not used as tools: the offer (a document, the field film's own remark), the KLIC notification (a step before digging,
// one tool is enough), the congestion study (the Werkkennis title the grid names) and the contracts (the gridbasics intro's
// flexibel contract).
// Definitions as the Basis lessons word them (eng.gridops.request, .workload, .outage, .cmbasics and eng.gridbasics.roles).
// Terms come from the module's lessons and {n:} numbers from the module's text (the kit's intro mode,
// films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), its narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall
// of films/pm.plan.intro/hall.mjs), with pm.agile.scrum's figures for the technician and the work preparer (not edited). The
// film's own things (the wall entry) are simple solids drawn here. A panel at the right, in stage space, draws each
// step as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map).
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
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
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
// The map this film draws, asserted against the index (the build fails if the module's topics or levels move):
// s6 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.gridops');
const LEVELS = {
  connect: ['eng.gridops.request', 'eng.gridops.chain', 'eng.gridops.data', 'eng.gridops.promise'],
  field: ['eng.gridops.workload', 'eng.gridops.switching', 'eng.gridops.crews', 'eng.gridops.fieldlean'],
  outage: ['eng.gridops.outage', 'eng.gridops.control', 'eng.gridops.assets', 'eng.gridops.learn'],
  congestion: ['eng.gridops.cmbasics', 'eng.gridops.cmstudy', 'eng.gridops.cmdesk', 'eng.gridops.cmvalue'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.gridops has the four topics and levels this film draws');
assert(MOD.intro === 'eng.gridops.intro', 'eng.gridops names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: what a grid operator does (the five core tasks), the connection as a request to the grid operator
has('eng.gridbasics.roles', ['klanten aansluiten', 'het net onderhouden zodat het veilig en betrouwbaar blijft', 'storingen verhelpen, dag en nacht']);
has('eng.gridbasics.roles', ['connect customers', 'maintain the grid so it stays safe and reliable', 'restore outages, day and night'], 'en');
has('eng.gridops.request', ['Een aansluiting begint met een aanvraag (request) bij de regionale netbeheerder', 'Offerte Het aanbod van de netbeheerder na een complete aanvraag']);
has('eng.gridops.request', ['A connection starts with a request', 'Offer The operator’s proposal after a complete request'], 'en');
// s2: work preparation, the readiness check and why (the crew does not arrive at a job that cannot be done)
has('eng.gridops.chain', ['Werkvoorbereiding Vergunningen, kaarten, materiaal en planning vóór de uitvoering', 'Gereedheidscheck Controle dat ontwerp, vergunning, materiaal, schakelplan en ploeg klaar zijn', 'voorkomt dat ploegen bij klussen aankomen die niet kunnen']);
has('eng.gridops.chain', ['Work preparation Permits, maps, materials and planning before execution', 'Readiness check Check that design, permit, material, switching plan and crew are all ready', 'stops crews arriving at jobs that cannot be done'], 'en');
// s3: reinforcement, the switching plan and the order
has('eng.gridops.workload', ['Verzwaring Het net sterker maken: een zwaardere kabel, een extra trafo of een nieuw station']);
has('eng.gridops.workload', ['Reinforcement Making the grid stronger: a heavier cable, an extra transformer or a new station'], 'en');
has('eng.gridops.switching', ['Stap-voor-stap-script om een deel van het net uit te schakelen, veilig te maken en terug te schakelen', 'de verkeerde volgorde kan klanten laten uitvallen']);
has('eng.gridops.switching', ['Step-by-step script to switch part of the grid off, make it safe and switch it back', 'the wrong order can drop customers'], 'en');
// s4: the control room, the fault indicators and the normally open point, and what asset management decides
has('eng.gridops.outage', ['Het bedrijfsvoeringscentrum, dat het net dag en nacht bewaakt en schakelt, ziet het binnen seconden', 'lezen het bedrijfsvoeringscentrum en de storingsmonteur de kortsluitverklikkers', 'sluit het normaal openpunt', 'Kortsluitverklikker Indicator die laat zien of meldt dat er foutstroom langs is gekomen', 'Normaal openpunt De schakelaar in een MS-ring die openstaat; je sluit hem om een deel van de andere kant te voeden']);
has('eng.gridops.outage', ['The control room, the team that watches and switches the grid around the clock', 'read the fault indicators', 'closes the normally open point', 'Fault indicator Device that shows or reports whether fault current has passed it', 'Normally open point The switch in an MV ring that is kept open; you close it to feed a section from the other side'], 'en');
has('eng.gridops.assets', ['Assetmanagement is beslissen wat je inspecteert, repareert en vervangt', 'risico = faalkans × effect']);
has('eng.gridops.assets', ['Asset management means deciding what to inspect, repair and replace', 'Risk Likelihood of failure times its consequence'], 'en');
// s5: congestion management in operations, the team next to the control room, the platform
has('eng.gridops.cmbasics', ['Congestiemanagement betekent afname of invoeding op piekmomenten sturen', 'zodat er meer klanten op een vol net passen', 'zit daarvoor een team naast het bedrijfsvoeringscentrum', 'GOPACS Het gezamenlijke platform van de Nederlandse netbeheerders om flexibiliteit tegen congestie in te kopen']);
has('eng.gridops.cmbasics', ['Congestion management means steering offtake or feed-in at peak moments', 'so more customers fit on a full grid', 'a team sits next to the control room', 'GOPACS The joint platform of the Dutch grid operators for buying flexibility against congestion'], 'en');
// s6: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.gridops.chain', 'inbedrijfname'], ['eng.gridops.switching', 'Schakelplannen'], ['eng.gridops.control', 'storingsdienst'], ['eng.gridops.cmstudy', 'congestieonderzoek'],
  ['eng.gridops.data', 'Netdata'], ['eng.gridops.crews', 'Ploegen plannen'], ['eng.gridops.assets', 'Assetmanagement en risico'], ['eng.gridops.cmdesk', 'congestiedesk'],
  ['eng.gridops.promise', 'eerlijke datums'], ['eng.gridops.fieldlean', 'handwerk'], ['eng.gridops.learn', 'Leren van storingen'], ['eng.gridops.cmvalue', 'Flexibiliteit of wachten']]) has(id, [word]);
for (const [id, word] of [['eng.gridops.chain', 'commissioning'], ['eng.gridops.switching', 'Switching plans'], ['eng.gridops.control', 'fault service'], ['eng.gridops.cmstudy', 'congestion study'],
  ['eng.gridops.data', 'Asset data'], ['eng.gridops.crews', 'Planning crews'], ['eng.gridops.assets', 'Asset management and risk'], ['eng.gridops.cmdesk', 'congestion desk'],
  ['eng.gridops.promise', 'honest dates'], ['eng.gridops.fieldlean', 'Wrench time'], ['eng.gridops.learn', 'Learning from outages'], ['eng.gridops.cmvalue', 'Flexibility or waiting']]) has(id, [word], 'en');
has('eng.gridops.request', ['Een aansluiting aanvragen']);
has('eng.gridops.request', ['Requesting a connection'], 'en');
// the digital twin is "een model van het net" in the lesson's own words
has('eng.gridops.data', ['Een verbonden model van het net']);
has('eng.gridops.data', ['A connected model of the grid'], 'en');
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 314, col: 80, box: 70, tile: 284, top: 64, pitch: 80, h: 64 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
assert(GRID.top + (ORDER.length - 1) * GRID.pitch + GRID.h <= 392, 'the four rows of the grid fit the stage');
// the route of s1: group A from y 82 (head at 74), group B from y 214 (head at 206), a row 34, 56 or 78 units for one, two or
// three lines; both groups must end inside the panel (y 380) and A must end above B's head
for (const lang of ['nl', 'en']) {
  const hs = ORDER.map((id) => [34, 56, 78][wrapUnits(MOD.topics.find((t) => t.id === id).title[lang], 240, CHAR_W).length - 1]);
  assert(82 + hs[0] + 6 + hs[1] <= 196, `route group A (${lang}) runs into group B`);
  assert(214 + hs[2] + 6 + hs[3] <= 380, `route group B (${lang}) runs out of the panel`);
}
for (const lang of ['nl', 'en']) {
  for (const id of ORDER) {
    const title = MOD.topics.find((t) => t.id === id).title[lang];
    assert(wrapUnits(title, GRID.tile - 12, CHAR_W).length <= 2, `the grid tile of "${title}" (${lang}) needs more than two lines`);
    assert(wrapUnits(title, 240, CHAR_W).length <= 3, `the route row of "${title}" (${lang}) needs more than three lines`);
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

// where things stand (cm), as in the energy field film: the power cabinet at the back wall at the left (x 12), the cable
// from the grid through the left wall (y 86 to 114) to the cabinet, line 3 at the right (x 186). The technician of the
// grid operator by the wall entry (as in the gridbasics intro) and the work preparer in the hall.
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const cabA = hall.cable([[0, 100], [32, 100], [32, 28]]);
const wallEntry = w.box({ x: 0, y: 86, w: 10, d: 28, r: 1.5 }, 0, 40, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 10, y: 96, w: 3, d: 8, r: 1 }, 0, 10, { tone: 'mid' }, { steps: 1 });
const TECH = { x: 14, y: 140 };
const PLAN = { x: 138, y: 52 };
const tech = scrumPerson(w, k, G, P, { x: TECH.x, y: TECH.y, key: 'tech', look: 'dev', along: 'y' });
const planner = scrumPerson(w, k, G, P, { x: PLAN.x, y: PLAN.y, key: 'planner', look: 'po', along: 'y' });

// painted back to front (large x and small y are far): the cable and the cabinet, the line, the people (the technician
// at the wall, the work preparer)
const world = [
  w.room(ROOM),
  cueG('net', wallEntry + cabA),
  cueG('cab', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h })),
  cueG('line3', hall.conveyor({ ...L3, cartons: 3 })),
  g('pp-planner', planner),
  g('pp-tech', tech + hall.hat(TECH.x, TECH.y)),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Netbedrijf
// en assetmanagement is a cue group of its own (map-gridops).
const TILE = { connect: 'tConn', field: 'tField', outage: 'tOut', congestion: 'tCong' };
const PANEL = ['flowS', 'taskS', 'grpA', 'grpB', 'reqS', 'prepS', 'checkS', 'reinfS', 'stepS', 'planS', 'ringS', 'ctrS', 'ring2S',
  'peakS', 'steerS', 'gopS', 'endS', 'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the dark of an outage: the hall dims while the cable is down (a plain rectangle over the room, under the panel)
const dim = '<rect data-k="dim" class="pm-dim" x="0" y="0" width="322" height="400" style="display:none"/>';
// the shared map, Netbedrijf en assetmanagement lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.gridops'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.gridops');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.gridops')}"`), 'the map lights eng.gridops as a cue group');
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${dim}${g('mapG', MAP)}${hud}</svg>`);
// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [ox, oy, s]: the point (ox, oy) of the room, in stage units, is brought to the middle of the room's half of the
// stage while the room scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(140, 70, 50, 1.0), to: cam(140, 75, 50, 1.05) }, // s1 the whole hall: the cable, the cabinet, line 3, both people
  { from: cam(95, 60, 50, 1.1), to: cam(90, 55, 50, 1.2), at: 1 }, // s2 the work preparer and the cabinet
  { from: cam(80, 80, 50, 1.1), to: cam(75, 75, 50, 1.2), at: 1 }, // s3 the cable, the technician and the cabinet
  { from: cam(130, 80, 50, 1.1), to: cam(130, 80, 50, 1.1) }, // s4 the dark hall
  { from: cam(140, 75, 50, 1.0), to: cam(140, 75, 50, 1.0) }, // s5 the whole hall: line 3 and the people at the end
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];
// People are moved, in stage units, to where each scene needs them; the base places are TECH and PLAN above.
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const TECHSHIFT = { 2: shiftOf([TECH.x, TECH.y], [104, 80]), 4: shiftOf([TECH.x, TECH.y], [104, 80]) };
const PLANSHIFT = {};

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.gridops.intro',
  title: { nl: 'Het net draaiend houden: netbedrijf en assetmanagement', en: 'Keeping the grid running: grid operations and assets' },
  module: 'eng.gridops',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.gridops, the scene that explains it and its tile
  topics: {
    connect: { scene: 's2', cue: 'tConn' },
    field: { scene: 's3', cue: 'tField' },
    outage: { scene: 's4', cue: 'tOut' },
    congestion: { scene: 's5', cue: 'tCong' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Lijn 3 en het netbedrijf', en: 'Line 3 and the grid operator' },
      beats: [
        { nl: 'Lijn 3 in hal B krijgt een zwaardere aansluiting. Dat is werk voor de netbeheerder.', en: 'Line 3 in hall B gets a heavier connection. That is work for the grid operator.', focus: ['flowS', 'net', 'line3'] },
        { nl: 'Een netbeheerder sluit klanten aan, onderhoudt het net en verhelpt storingen, dag en nacht.', en: 'A grid operator connects customers, maintains the grid and restores outages, day and night.', focus: ['taskS', 'tech'] },
        { nl: 'Vier onderwerpen volgen de klus. Eerst de aanvraag en het werk in het veld.', en: 'Four topics follow the job. First the request and the field work.', focus: 'grpA' },
        { nl: 'Dan het dagelijkse werk met storingen en een vol net.', en: 'Then the daily work with outages and a full grid.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Aansluiting', en: 'Connection' },
      beats: [
        { nl: 'Eerste onderwerp: Van aanvraag tot aansluiting. De fabriek vraagt aan en krijgt een offerte.', en: 'First topic: From request to connection. The plant applies and gets an offer.', focus: ['tConn', 'reqS'] },
        { nl: 'Dan volgt de werkvoorbereiding met vergunning, materiaal en planning. De werkvoorbereider regelt dat.', en: 'Then comes work preparation with permit, material and planning. The work preparer arranges it.', focus: ['prepS', 'planner'] },
        { nl: 'De werkvoorbereider doet een {t:Gereedheidscheck|gereedheidscheck} voor de klus begint.', en: 'The work preparer runs a {t:Readiness check|readiness check} before the job starts.', ...TOOL('Gereedheidscheck'), focus: ['tool1', 'checkS', 'planner'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Veldwerk', en: 'Field work' },
      beats: [
        { nl: 'Tweede onderwerp: Werk in het veld. Een zwaardere kabel naar hal B is werk voor de ploeg.', en: 'Second topic: Field work. A heavier cable to hall B is work for the crew.', focus: ['tField', 'reinfS', 'net'] },
        { nl: 'Daarvoor schakelt de ploeg een stuk net uit, maakt het veilig en schakelt het weer in.', en: 'For that the crew switches a part of the grid off, makes it safe and switches it back on.', focus: ['stepS', 'tech'] },
        { nl: 'De verkeerde volgorde kan klanten laten uitvallen.', en: 'The wrong order can drop customers.', focus: ['stepS', 'tech'] },
        { nl: 'De monteur schakelt volgens een {t:Schakelplan|schakelplan}, stap voor stap.', en: 'The technician switches by a {t:Switching plan|switching plan}, step by step.', ...TOOL('Schakelplan'), focus: ['tool1', 'planS', 'tech'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Storing', en: 'Outage' },
      beats: [
        { nl: 'Derde onderwerp: Storingen en assetrisico. Valt een kabel uit, dan kan de fabriek zonder stroom zitten.', en: 'Third topic: Outages and asset risk. If a cable fails, the plant can be without power.', focus: ['tOut', 'ringS'] },
        { nl: 'Het bedrijfsvoeringscentrum bewaakt het net dag en nacht. Een uitschakeling ziet het binnen seconden.', en: 'The control room watches the grid day and night. It sees a trip within seconds.', focus: 'ctrS' },
        { nl: 'De monteur leest de {t:Kortsluitverklikker|kortsluitverklikkers} af.', en: 'The technician reads the {t:Fault indicator|fault indicators}.', ...TOOL('Kortsluitverklikker'), focus: 'tool1' },
        { nl: 'Dan sluit het centrum het {t:Normaal openpunt|normaal openpunt}.', en: 'Then the centre closes the {t:Normally open point|normally open point}.', ...{ cue: { 'Normaal openpunt': 'tool2' } }, focus: 'tool2' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Een vol net', en: 'A full grid' },
      beats: [
        { nl: 'Vierde onderwerp: Congestiemanagement in de bedrijfsvoering. Op piekmomenten zit het net vol.', en: 'Fourth topic: Congestion management in operations. At peak moments the grid is full.', focus: ['tCong', 'peakS'] },
        { nl: 'Een team stuurt afname en invoeding bij op die momenten, zodat meer klanten op een vol net passen.', en: 'A team steers offtake and feed-in at those moments, so more customers fit on a full grid.', focus: 'steerS' },
        { nl: 'Daarvoor koopt het flexibiliteit in via {t:GOPACS}.', en: 'It buys flexibility through {t:GOPACS}.', ...TOOL('GOPACS'), focus: ['tool1', 'gopS'] },
        { nl: 'Zo blijft het net draaien terwijl lijn 3 zijn zwaardere aansluiting krijgt.', en: 'So the grid keeps running while line 3 gets its heavier connection.', focus: ['endS', 'line3', 'tech', 'planner'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Netbedrijf en assetmanagement is het zesde station van Energie en het net.', en: 'The whole map. Grid operations and assets is the sixth station of Energy and the grid.', focus: 'map-gridops' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Een aansluiting aanvragen op niveau Basis. Die les laat de weg van aanvraag naar offerte zien.', en: 'Start with Requesting a connection at Basics level. That lesson shows the way from request to offer.', focus: ['tConn', 'start'] },
        { nl: 'Op niveau Werkkennis komen inbedrijfname, veilig schakelen, de storingsdienst en het congestieonderzoek.', en: 'At Working knowledge level come commissioning, safe switching, the fault service and the congestion study.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen netdata en modellen van het net, ploegplanning, assetmanagement en de congestiedesk.', en: 'At Advanced level come asset data and grid models, crew planning, asset management and the congestion desk.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om eerlijke datums, handwerktijd, leren van storingen en flexibiliteit of wachten.', en: 'At Expert level it is about honest dates, wrench time, learning from outages and flexibility or waiting.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said once. Short sentences, few
// colons and comma lists, no symbols the voice would read aloud and nothing in parentheses: the kit's narration
// guard (films/_kit/assert.mjs, checkNarration) holds every module film to that, and the render guard caps a pause
// inside a sentence at 0.4 s. Each topic scene ends on one short sentence naming the tools of that topic's lessons,
// without explaining them. Every drawn detail has its reason in the narration: the cable through the wall (the grid
// brings the power into the hall), the cabinet (where the cable ends), line 3 (it asks for the heavier connection),
// the technician at the wall (the grid operator's crew works there and switches), the work preparer (he prepares the job and
// runs the readiness check), the dark hall (the plant is without power while the cable is down).
const SAY = [
  [ // s1 line 3 gets a heavier connection, the grid operator's tasks, the map in two groups
    { nl: 'Lijn 3 in hal B krijgt een zwaardere aansluiting. Dat is werk voor de netbeheerder.',
      en: 'Line 3 in hall B gets a heavier connection. That is work for the grid operator.' },
    { nl: 'Een netbeheerder sluit klanten aan, onderhoudt het net en verhelpt storingen, dag en nacht.',
      en: 'A grid operator connects customers, maintains the grid and restores outages, day and night.' },
    { nl: 'Vier onderwerpen volgen de klus. Eerst de aanvraag en het werk in het veld.',
      en: 'Four topics follow the job. First the request and the field work.' },
    { nl: 'Dan het dagelijkse werk met storingen en een vol net.',
      en: 'Then the daily work with outages and a full grid.' },
  ],
  [ // s2 from request to connection: the offer, work preparation, the readiness check
    { nl: 'Het eerste onderwerp is Van aanvraag tot aansluiting. De fabriek vraagt aan en krijgt een offerte.',
      en: 'The first topic is From request to connection. The plant applies and gets an offer.' },
    { nl: 'Dan volgt de werkvoorbereiding met vergunning, materiaal en planning. De werkvoorbereider regelt dat.',
      en: 'Then comes work preparation with permit, material and planning. The work preparer arranges it.' },
    { nl: 'De werkvoorbereider doet een {t:Gereedheidscheck|gereedheidscheck} voor de klus begint. Zo komt de ploeg niet voor niets.',
      en: 'The work preparer runs a {t:Readiness check|readiness check} before the job starts. So the crew does not come for nothing.' },
  ],
  [ // s3 field work: the heavier cable, switching a part of the grid off in the right order, the switching plan
    { nl: 'Het tweede onderwerp is Werk in het veld. Een zwaardere kabel naar hal B is werk voor de ploeg.',
      en: 'The second topic is Field work. A heavier cable to hall B is work for the crew.' },
    { nl: 'Daarvoor schakelt de ploeg een stuk net uit, maakt het veilig en schakelt het weer in.',
      en: 'For that the crew switches a part of the grid off, makes it safe and switches it back on.' },
    { nl: 'De verkeerde volgorde kan klanten laten uitvallen.',
      en: 'The wrong order can drop customers.' },
    { nl: 'De monteur schakelt volgens een {t:Schakelplan|schakelplan}, stap voor stap. Zo werkt de ploeg veilig.',
      en: 'The technician switches by a {t:Switching plan|switching plan}, step by step. So the crew works safely.' },
  ],
  [ // s4 outages and asset risk: the plant that can be dark, the control room, the two tools
    { nl: 'Het derde onderwerp is Storingen en assetrisico. Valt een kabel uit, dan kan de fabriek zonder stroom zitten.',
      en: 'The third topic is Outages and asset risk. If a cable fails, the plant can be without power.' },
    { nl: 'Het bedrijfsvoeringscentrum bewaakt het net dag en nacht. Een uitschakeling ziet het binnen seconden.',
      en: 'The control room watches the grid day and night. It sees a trip within seconds.' },
    { nl: 'De monteur leest de {t:Kortsluitverklikker|kortsluitverklikkers} af. Zo ziet hij welk stuk kabel kapot is.',
      en: 'The technician reads the {t:Fault indicator|fault indicators}. So he sees which piece of cable is broken.' },
    { nl: 'Dan sluit het centrum het {t:Normaal openpunt|normaal openpunt}. Zo krijgt de fabriek weer stroom.',
      en: 'Then the centre closes the {t:Normally open point|normally open point}. So the plant has power again.' },
  ],
  [ // s5 congestion management in operations, and the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Congestiemanagement in de bedrijfsvoering. Op piekmomenten zit het net vol.',
      en: 'The fourth topic is Congestion management in operations. At peak moments the grid is full.' },
    { nl: 'Een team naast het centrum stuurt afname en invoeding bij op die momenten, zodat meer klanten op een vol net passen.',
      en: 'A team next to the centre steers offtake and feed-in at those moments, so more customers fit on a full grid.' },
    { nl: 'Daarvoor koopt het flexibiliteit in via {t:GOPACS}.',
      en: 'It buys flexibility through {t:GOPACS}.' },
    { nl: 'Zo blijft het net draaien terwijl lijn 3 zijn zwaardere aansluiting krijgt.',
      en: 'So the grid keeps running while line 3 gets its heavier connection.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Netbedrijf en assetmanagement is het zesde station van Energie en het net.',
      en: 'The whole map. Grid operations and assets is the sixth station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Een aansluiting aanvragen op niveau Basis. Die les laat de weg van aanvraag naar offerte zien.',
      en: 'Start with Requesting a connection at Basics level. That lesson shows the way from request to offer.' },
    { nl: 'Op niveau Werkkennis komen inbedrijfname, veilig schakelen, de storingsdienst en het congestieonderzoek.',
      en: 'At Working knowledge level come commissioning, safe switching, the fault service and the congestion study.' },
    { nl: 'Op niveau Gevorderd komen netdata en modellen van het net, ploegplanning, assetmanagement en de congestiedesk.',
      en: 'At Advanced level come asset data and grid models, crew planning, asset management and the congestion desk.' },
    { nl: 'Op niveau Expert gaat het om eerlijke datums, handwerktijd, leren van storingen en flexibiliteit of wachten.',
      en: 'At Expert level it is about honest dates, wrench time, learning from outages and flexibility or waiting.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst TECHSHIFT = ${JSON.stringify(TECHSHIFT)};\nconst PLANSHIFT = ${JSON.stringify(PLANSHIFT)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="tech"],[data-cue="planner"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-full{fill:color-mix(in srgb,#C2553F 55%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
.pm-gap{fill:none;stroke:#C2553F;stroke-width:4;stroke-linecap:round}
.pm-live{fill:none;stroke:var(--fp-accent);stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.pm-lamp{fill:#C2553F;stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-tick{fill:none;stroke:var(--anatomy-hi);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.pm-dim{fill:#04070d;opacity:.55;pointer-events:none}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-tick{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-full){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Door de linkerwand komt de kabel van het net binnen, naar de stroomkast langs de achterwand. Rechts de verpakkingslijn met dozen. Een monteur van de netbeheerder in een helm bij de muur waar de kabel binnenkomt, en een werkvoorbereider van de netbeheerder in de hal. Bij een storing wordt de hal donker. Rechts een paneel, gemarkeerd als voorbeeld of schema: de weg van lijn 3 naar een zwaardere aansluiting, de taken van een netbeheerder, de stappen van aanvraag tot offerte en werkvoorbereiding, een zwaardere kabel en het uit- en inschakelen in stappen, een middenspanningsring met een kabelfout, een normaal openpunt en kortsluitverklikkers, een dagcurve met een piek boven de grens en de inkoop van flexibiliteit, met per onderwerp de naam van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met Netbedrijf en assetmanagement verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs at its new place. Through the left wall the cable from the grid comes in, to the power cabinet along the back wall. At the right the packing line with cartons. A technician of the grid operator in a hard hat by the wall where the cable enters, and a work preparer of the grid operator in the hall. In an outage the hall goes dark. At the right a panel, marked as an example or a diagram: the way from line 3 to a heavier connection, the tasks of a grid operator, the steps from request to offer and work preparation, a heavier cable and switching off and on in steps, a medium-voltage ring with a cable fault, a normally open point and fault indicators, a day curve with a peak above the limit and the purchase of flexibility, with the names of one or two tools per topic. At the end the whole map of Engineering with Grid operations and assets lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

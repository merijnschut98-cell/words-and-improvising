// Dev tool, not shipped. Builds the module intro film "Elke versie naar de vloer /
// Every version to the floor" for DevOps en levering (pm.devops), the seventh module
// intro film (v17): the high-over picture at the top of the module, before its four
// topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.devops.intro/build.mjs            build the page
//   node films/pm.devops.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.devops.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.devops' `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro) and of the first IT-cluster
// intro (pm.agile.intro): ONE concrete thing travels through the whole module, the map
// before the detail, no calculations. The world is field film 4's (films/pm.field.it,
// whose DevOps station this intro agrees with: whoever builds the MES also keeps it
// running, a new version goes through test and acceptance before the floor, and a
// pipeline and a feature flag): line 3 runs in hall B, the IT team builds the new MES
// for the orders on the floor, you lead the project for the plant manager. What
// travels is ONE new version of the MES, with the screen of the rejected pieces (the
// third item of pm.agile.intro's backlog). The STORY IS DRAWN IN THE ROOM: the MES is
// the laptop on the table at the front of the hall, line 3 is where the version has to
// arrive, and the cast changes per topic (the IT team at the table, the plant manager,
// the team lead of line 3, the operators). The drawing is lean on purpose (the agile
// intro is at 295 KB): no calendar, power cabinet or switchboard, they belong to the
// planning story.
//   s1 the goal: the IT team builds and keeps the MES running; you lead the project for
//      the plant manager; the next version has a screen of the rejected pieces; the
//      module's four topics as a route
//   s2 CI/CD-pipeline en testautomatisering: one change through the same automatic steps
//      to a test environment; an automatic test that fails stops the line
//                                                          → pm.devops.pipeline, .tests
//   s3 DORA-metingen: two measures of speed, two of stability, all four together
//                                                          → pm.devops.fourkeys, .measure
//   s4 Release- en omgevingsbeheer: development, test, acceptance (the team lead checks),
//      production; deploy is not release; a fault should touch few lines
//                                    → pm.devops.environments, .flags, .strategies
//   s5 IT-servicemanagement en incidenten: the MES stops, the service desk, an incident
//      (work again), a problem (the cause), an agreement on speed and priority, a
//      blameless post-mortem                    → pm.devops.incident, .sla, .postmortem
//   s6 one whole: pipeline, measuring, safe roll-out, safety net; small and often
//   s7 the shared Projects map with DevOps en levering lit, then the module's four topics
//      with their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.devops.pipeline, .fourkeys,
// .environments, .incident). Each topic scene names two tools of that topic's lessons in
// one short sentence, without explaining them (Merijn's checkpoint, 14 Nov):
// versiebeheer and testpiramide (pm.devops.pipeline, .tests), mediaan and State of
// DevOps-rapport (.measure, .benchmark), feature flag and rollbackplan (.flags,
// .rollback), prioriteitsmatrix and A3 (.sla, .leanops). The field film's two tools of
// the module, Pipeline and Feature flag, are the first topic's name and the third
// topic's tool. Terms come from the module's lessons and {n:} numbers from the module's
// text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its
// map (every topic named in a caption of its own scene, explained in two beats and lit),
// to the narration guard and to the label fit. Three topic titles ("IT-servicemanagement
// en incidenten", "CI/CD-pipeline en testautomatisering", "Release- en
// omgevingsbeheer") have words up to 252 units, wider than the default tile, so the film
// declares tileUnits (as pm.agile.intro) and every title box of the stage wraps with it.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor and
// the team lead from its cast; the IT team and the operators drawn with pm.agile.scrum's
// cast (films/pm.agile.scrum/cast.mjs). The things of hall B are the pilot's
// (../pm.plan.intro/hall.mjs, imported, not copied). A panel at the right, in stage
// space, draws each step as a schema, labelled "voorbeeld" (the MES in use) or "schema".
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
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
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
const MOD = MODULES.find((m) => m.id === 'pm.devops');
const LEVELS = {
  pipeline: ['pm.devops.pipeline', 'pm.devops.tests', 'pm.devops.trunk', 'pm.devops.cdflow'],
  dora: ['pm.devops.fourkeys', 'pm.devops.measure', 'pm.devops.benchmark', 'pm.devops.metricsuse'],
  release: ['pm.devops.environments', 'pm.devops.flags', 'pm.devops.strategies', 'pm.devops.rollback'],
  itsm: ['pm.devops.incident', 'pm.devops.sla', 'pm.devops.postmortem', 'pm.devops.leanops'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.devops has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// the world is field film 4's (films/pm.field.it): whoever builds the MES keeps it running, a new version goes through test
// and acceptance before the floor; the Basis lesson names the MES as one of the things that is changed again and again
has('pm.devops.pipeline', ['DevOps is de werkwijze die die muur weghaalt: één team is verantwoordelijk voor bouwen én draaien', 'MES (Manufacturing Execution System, het systeem dat orders en productie op de vloer bijhoudt)']);
has('pm.devops.pipeline', ['DevOps is the way of working that removes that wall: one team is responsible for building and running', 'MES (Manufacturing Execution System, the system that tracks orders and production on the floor)'], 'en');
// s2: the pipeline (a conveyor that every change runs through in the same steps), the steps, an automatic test, a failing
// step stops the line; the tools (version control, the test pyramid)
has('pm.devops.pipeline', ['Het hart van DevOps is de pipeline: een geautomatiseerde lopende band die elke wijziging in de code dezelfde stappen laat doorlopen', 'Stap 1 is de build', 'automatische tests controleren of alles nog werkt', 'Stap 3: het resultaat wordt bewaard als artefact', 'Stap 4: dat artefact wordt geïnstalleerd op een testomgeving', 'Faalt een stap, dan stopt de band en krijgt het team direct een melding', 'Het begint bij versiebeheer', 'Versiebeheer']);
has('pm.devops.pipeline', ['The heart of DevOps is the pipeline: an automated conveyor that takes every change to the code through the same steps', 'Step 1 is the build', 'automated tests check that everything still works', 'Step 3: the result is stored as an artefact', 'Step 4: that artefact is installed on a test environment', 'If a step fails, the conveyor stops and the team is told at once', 'It starts with version control', 'Version control'], 'en');
has('pm.devops.tests', ['Draait hij in de pipeline, dan controleert hij elke wijziging opnieuw, zonder dat iemand hoeft te klikken', 'Testpiramide', 'Automatische test']);
has('pm.devops.tests', ['Run in the pipeline, it checks every change again, without anyone having to click', 'Test pyramid', 'Automated test'], 'en');
// s3: the four measures (two about speed, two about stability), the best teams score well on all four, all measures together;
// the tools (the median, the State of DevOps report)
has('pm.devops.fourkeys', ['DORA staat voor DevOps Research and Assessment: een onderzoeksprogramma', 'Twee metingen gaan over snelheid', 'hoe vaak een team een nieuwe versie in productie zet, de echte systemen die gebruikers gebruiken', 'Twee metingen gaan over stabiliteit', 'de beste teams scoren op alle vier goed', 'Snelheid en stabiliteit zijn geen ruil, maar gaan samen', 'Deployfrequentie', 'Faalpercentage van wijzigingen']);
has('pm.devops.fourkeys', ['DORA stands for DevOps Research and Assessment: a research programme', 'speed', 'how often a team puts a new version into production, the real systems that users use', 'stability', 'the best teams score well on all four', 'Speed and stability are not a trade-off but go together', 'Deployment frequency', 'Change fail rate'], 'en');
has('pm.devops.measure', ['Voor tijden gebruik je liever de mediaan', 'Mediaan']);
has('pm.devops.measure', ['median', 'Median'], 'en');
has('pm.devops.metricsuse', ['Daarom kijk je altijd naar alle metingen samen']);
has('pm.devops.metricsuse', ['That is why you always look at all the metrics together'], 'en');
has('pm.devops.benchmark', ['State of DevOps-rapport']);
has('pm.devops.benchmark', ['State of DevOps report'], 'en');
// s4: environments (the series a version goes through, users such as team leads check in acceptance, production is the real
// situation), deploy is not release (the company chooses when it releases), a fault should touch few lines, first one line
// then the next; the tools (the feature flag, the rollback plan)
has('pm.devops.environments', ['In Nederland heet die reeks vaak OTAP: Ontwikkeling, Test, Acceptatie, Productie', 'Daar controleren gebruikers, bijvoorbeeld ploegleiders of kwaliteitsmensen, of de software doet wat ze nodig hebben', 'Productie is de echte situatie, met echte orders en echte machines', 'Acceptatieomgeving']);
has('pm.devops.environments', ['That series is often called DTAP: development, test, acceptance, production', 'There users, for example shift leaders or quality staff, check whether the software does what they need', 'Production is the real situation, with real orders and real machines', 'Acceptance environment'], 'en');
has('pm.devops.flags', ['Een deploy is het technisch installeren van een nieuwe versie in een omgeving', 'Een release is het moment dat gebruikers een nieuwe functie echt kunnen gebruiken', 'terwijl het bedrijf kiest wanneer het releaset', 'Productie kan zeggen', 'Feature flag', 'Deploy', 'Release']);
has('pm.devops.flags', ['A deploy is the technical installation of a new version in an environment', 'A release is the moment users can really use a new feature', 'while the business chooses when to release', 'Production can say', 'Feature flag', 'Deploy', 'Release'], 'en');
has('pm.devops.strategies', ['als het misgaat, hoeveel gebruikers, lijnen of orders raakt het?', 'In een fabriek is het equivalent: eerst één lijn, dan de volgende', 'Impactstraal']);
has('pm.devops.strategies', ['if it goes wrong, how many users, lines or orders does it hit?', 'In a factory the equivalent is: first one line, then the next', 'Blast radius'], 'en');
has('pm.devops.rollback', ['Rollbackplan']);
has('pm.devops.rollback', ['Rollback plan'], 'en');
// s5: ITIL (the incident, the problem), the service desk, an SLA (an agreement on how fast to respond and how fast to
// resolve) and priority (a line that is down before a single office printer), the blameless post-mortem; the tools
// (the priority matrix, the A3)
has('pm.devops.incident', ['Het MES reageert niet', 'Het doel bij een incident is: zo snel mogelijk weer werken', 'Incidenten komen binnen bij de servicedesk: het centrale meldpunt waar gebruikers storingen en vragen melden', 'Bij een probleem is het doel anders: begrijpen waarom het gebeurt, zodat het niet terugkomt']);
has('pm.devops.incident', ['The MES doesn’t respond', 'The goal with an incident is: working again as fast as possible', 'Incidents come in at the service desk: the central point where users report outages and questions', 'With a problem the goal is different: understanding why it happens, so it doesn’t come back'], 'en');
has('pm.devops.sla', ['een afspraak tussen een leverancier en een klant over hoe goed een dienst moet zijn', 'hoe snel er gereageerd wordt op een storing, hoe snel die opgelost is', 'Een stilstaande lijn met een spoedorder: hoge impact, hoge urgentie, prioriteit 1', 'Eén kantoorprinter die niet werkt terwijl er nog drie zijn', 'Die bepaal je vaak met een prioriteitsmatrix', 'Prioriteitsmatrix']);
has('pm.devops.sla', ['an agreement between a supplier and a customer about how good a service must be', 'how fast', 'A stopped line with a rush order: high impact, high urgency, priority 1', 'One office printer not working while there are three others', 'You often set it with a priority matrix', 'Priority matrix'], 'en');
has('pm.devops.postmortem', ['Een post-mortem (ook incidentreview) is een gestructureerde bespreking na een grote storing', 'de bespreking schuldvrij (blameless) is: je zoekt naar wat in het systeem de fout mogelijk maakte, niet naar wie hem maakte', 'Schuldvrij']);
has('pm.devops.postmortem', ['A post-mortem (also incident review) is a structured discussion after a major outage', 'the discussion is blameless: you look for what in the system made the mistake possible, not for who made it', 'Blameless'], 'en');
has('pm.devops.leanops', ['A3', 'Een A3 is een probleemoplosrapport op één vel papier van A3-formaat']);
has('pm.devops.leanops', ['A3', 'An A3 is a problem-solving report on one sheet of A3-size paper'], 'en');
// s6: small changes are easier to test and to recover than one big release a quarter (the lesson's own pre-question, DORA)
has('pm.devops.fourkeys', ['omdat kleine wijzigingen makkelijker te testen en te herstellen zijn', 'zeldzame, grote deploys gaan vaker mis']);
has('pm.devops.fourkeys', ['because small changes are easier to test and to recover', 'rare, big deployments fail more often'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.devops.pipeline', 'Wat DevOps is'], ['pm.devops.tests', 'Testautomatisering'], ['pm.devops.trunk', 'trunk-based development'], ['pm.devops.cdflow', 'fabrieksvloer'],
  ['pm.devops.fourkeys', 'DORA'], ['pm.devops.measure', 'DORA meten'], ['pm.devops.benchmark', 'rapporten'], ['pm.devops.metricsuse', 'Sturen met DORA'],
  ['pm.devops.environments', 'Omgevingen'], ['pm.devops.flags', 'feature flags'], ['pm.devops.strategies', 'veilig live gaan'], ['pm.devops.rollback', 'Terugdraaien'],
  ['pm.devops.incident', 'Incident'], ['pm.devops.sla', 'SLA'], ['pm.devops.postmortem', 'post-mortem'], ['pm.devops.leanops', 'Lean in IT-beheer']]) has(id, [word]);
for (const [id, word] of [['pm.devops.pipeline', 'What DevOps is'], ['pm.devops.tests', 'Test automation'], ['pm.devops.trunk', 'trunk-based development'], ['pm.devops.cdflow', 'factory floor'],
  ['pm.devops.fourkeys', 'DORA'], ['pm.devops.measure', 'Measuring DORA'], ['pm.devops.benchmark', 'reports'], ['pm.devops.metricsuse', 'Steering with DORA'],
  ['pm.devops.environments', 'Environments'], ['pm.devops.flags', 'feature flags'], ['pm.devops.strategies', 'going live safely'], ['pm.devops.rollback', 'Rolling back'],
  ['pm.devops.incident', 'Incident'], ['pm.devops.sla', 'SLA'], ['pm.devops.postmortem', 'post-mortem'], ['pm.devops.leanops', 'Lean in IT operations']]) has(id, [word], 'en');
// s7: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 298, col: 82, box: 74, tile: 270 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 - 2 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}

// the topic titles: "IT-servicemanagement en incidenten" has a word of 252 units, wider than the default 128-unit tile, so,
// as pm.agile.intro, the film declares tileUnits = the room of its narrowest title box (the closing grid's tile, GRID.tile -
// 12 units of text, up to three lines), and every title box of the stage wraps with D.tileUnits (the kit's checkLabels holds
// the titles to it too, also after a rename without a rebuild)
const TILE_TEXT = GRID.tile - 12;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the grid's tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the grid's tile`);
}

// ---------------------------------------------------------------- the world (hall B, as field film 4, with the MES on a table)
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

// where things stand (cm), as in the pilot and field film 4: line 3 at the back wall at the right, line 4 (which stays) next to
// it, the MES (a laptop on a small table) at the front of the hall
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const MESTAB = { x: 70, y: 112, w: 58, d: 30, h: 74 };

// the people: the plant manager (the sponsor) and the team lead of line 3 are the pm cast; the IT team (two Developers)
// and the two operators are pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the
// story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...L3, cartons: 4 })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-devs', scrumPerson(w, k, G, P, { x: 84, y: 96, key: 'devs', look: 'dev2', along: 'x' }) + scrumPerson(w, k, G, P, { x: 116, y: 96, key: 'devs', look: 'dev', along: 'x' })),
  g('pp-sponsor', person('sponsor', 36, 150, 'y')),
  cueG('mes', w.table(MESTAB) + w.laptop({ x: MESTAB.x + MESTAB.w / 2, y: MESTAB.y + MESTAB.d / 2, z: MESTAB.h, toward: 1 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has two tool chips (tool1, tool2) for the two
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place DevOps en levering is a cue group of its own (map-devops).
const tiles = ['tPipe', 'tDora', 'tRel', 'tItsm'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const PARTS = ['goal', 'team', 'pipe', 'tests', 'stop', 'speed', 'stab', 'all4', 'env', 'accept', 'dep', 'rel', 'impact', 'inc', 'prob', 'sla', 'pm', 'tool1', 'tool2', 'whole', 'decision'];
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + PARTS.map((n) => cueG(n, g(`${n}B`, ''))).join(''));
// the shared map, DevOps en levering lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.devops'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const DEVOPS_PLACE = pmMap.places.find((p) => p.module === 'pm.devops');
const MAPZ = [DEVOPS_PLACE.x + DEVOPS_PLACE.w / 2, DEVOPS_PLACE.y + DEVOPS_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.devops')}"`), 'the map lights pm.devops as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 and the MES
  { from: cam(110, 115, 70, 1.12), to: cam(105, 115, 70, 1.18) }, // s2 the IT team at the MES table
  { from: cam(110, 115, 70, 1.12), to: cam(105, 115, 70, 1.18) }, // s3 the IT team at the MES table
  { from: cam(150, 95, 60, 1.05), to: cam(145, 100, 60, 1.1) }, // s4 the team lead, the plant manager and line 3
  { from: cam(150, 95, 60, 1.05), to: cam(145, 100, 60, 1.1) }, // s5 the operators at the line, the IT team at the table
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.devops.intro',
  title: { nl: 'Elke versie naar de vloer', en: 'Every version to the floor' },
  module: 'pm.devops',
  // the room of text in the narrowest title box (the closing grid's tile), see the module section above
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.devops, the scene that explains it and its tile
  topics: {
    pipeline: { scene: 's2', cue: 'tPipe' },
    dora: { scene: 's3', cue: 'tDora' },
    release: { scene: 's4', cue: 'tRel' },
    itsm: { scene: 's5', cue: 'tItsm' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén versie, vier onderwerpen', en: 'One version, four topics' },
      beats: [
        { nl: 'Het IT-team bouwt het nieuwe MES en houdt het ook draaiend.', en: 'The IT team builds the new MES and also keeps it running.', focus: ['goal', 'devs', 'mes'] },
        { nl: 'Jij leidt het project. De volgende versie krijgt een scherm met afgekeurde stuks.', en: 'You lead the project. The next version gets a screen with rejected pieces.', focus: ['team', 'sponsor', 'devs', 'mes'] },
        { nl: 'We volgen die ene versie langs de vier onderwerpen.', en: 'We follow that one version through the four topics.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'De pipeline', en: 'The pipeline' },
      beats: [
        { nl: 'Eerste onderwerp: CI/CD-pipeline en testautomatisering. Hoe komt een wijziging bij de vloer?', en: 'First topic: CI/CD pipeline and test automation. How does a change reach the floor?', focus: ['tPipe', 'devs', 'mes'] },
        { nl: 'Een {t:Pipeline|pipeline} is een geautomatiseerde lopende band. Elke wijziging volgt dezelfde stappen.', en: 'A {t:Pipeline|pipeline} is an automated conveyor. Every change follows the same steps.', cue: { Pipeline: 'pipe' }, focus: ['pipe', 'devs', 'mes'] },
        { nl: '{t:Automatische test|Automatische tests} controleren elke wijziging. Faalt er een, dan stopt de band.', en: '{t:Automated test|Automated tests} check every change. If one fails, the line stops.', cue: { 'Automatische test': 'tests', 'Automated test': 'tests' }, focus: ['tests', 'stop', 'devs'] },
        { nl: 'Bij pipeline en tests gebruiken we vaak {t:Versiebeheer|versiebeheer} en een {t:Testpiramide|testpiramide}.', en: 'For pipeline and tests we often use {t:Version control|version control} and a {t:Test pyramid|test pyramid}.', cue: { Versiebeheer: 'tool1', Testpiramide: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'DORA-metingen', en: 'DORA metrics' },
      beats: [
        { nl: 'Tweede onderwerp: DORA-metingen. Hoe weet je of het IT-team goed levert?', en: 'Second topic: DORA metrics. How do you know the IT team delivers well?', focus: ['tDora', 'devs', 'mes'] },
        { nl: 'Twee metingen gaan over snelheid: hoe vaak een versie bij de vloer komt en hoe lang dat duurt.', en: 'Two measures are about speed: how often a version reaches the floor and how long it takes.', focus: ['speed', 'devs'] },
        { nl: 'Twee gaan over stabiliteit: hoe vaak het misgaat en hoe snel je herstelt.', en: 'Two are about stability: how often it goes wrong and how fast you recover.', focus: ['stab', 'devs'] },
        { nl: 'De beste teams scoren op alle vier goed. Kijk naar alle vier samen.', en: 'The best teams score well on all four. Look at all four together.', focus: ['all4', 'devs'] },
        { nl: 'Bij DORA gebruiken we vaak een {t:Mediaan|mediaan} en het {t:State of DevOps-rapport|State of DevOps-rapport}.', en: 'With DORA we often use a {t:Median|median} and the {t:State of DevOps report|State of DevOps report}.', cue: { Mediaan: 'tool1', 'State of DevOps-rapport': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Veilig naar de vloer', en: 'Safely to the floor' },
      beats: [
        { nl: 'Derde onderwerp: Release- en omgevingsbeheer. Hoe komt de nieuwe versie veilig bij lijn 3?', en: 'Third topic: Release and environment management. How does the new version reach line 3 safely?', focus: ['tRel', 'line3', 'mes'] },
        { nl: 'Een versie gaat langs ontwikkeling, test en {t:Acceptatieomgeving|acceptatie}. Dan pas volgt productie.', en: 'A version passes development, test and {t:Acceptance environment|acceptance}. Only then comes production.', cue: { Acceptatieomgeving: 'accept', 'Acceptance environment': 'accept' }, focus: ['env', 'teamlead'] },
        { nl: 'Installeren is nog geen vrijgeven. De fabriek kiest wanneer lijn 3 het scherm ziet.', en: 'Installing is not yet releasing. The plant chooses when line 3 sees the screen.', focus: ['dep', 'rel', 'sponsor', 'crew'] },
        { nl: 'Een fout raakt liefst weinig lijnen, de {t:Impactstraal|impactstraal}. Dus eerst één lijn.', en: 'A fault should touch few lines, the {t:Blast radius|blast radius}. So one line first.', cue: { Impactstraal: 'impact', 'Blast radius': 'impact' }, focus: ['impact', 'line3', 'line4'] },
        { nl: 'Bij release- en omgevingsbeheer gebruiken we vaak een {t:Feature flag|feature flag} en een {t:Rollbackplan|rollbackplan}.', en: 'For release and environment management we often use a {t:Feature flag|feature flag} and a {t:Rollback plan|rollback plan}.', cue: { 'Feature flag': 'tool1', Rollbackplan: 'tool2', 'Rollback plan': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Als het misgaat', en: 'When it goes wrong' },
      beats: [
        { nl: 'Vierde onderwerp: IT-servicemanagement en incidenten. Wat als het MES stilvalt?', en: 'Fourth topic: IT service management and incidents. What if the MES stops?', focus: ['tItsm', 'crew', 'mes'] },
        { nl: 'De operators melden het bij de servicedesk. Een {t:Incident|incident}: zo snel mogelijk weer werken.', en: 'The operators report it to the service desk. An {t:Incident|incident}: back to work fast.', cue: { Incident: 'inc' }, focus: ['inc', 'crew', 'mes'] },
        { nl: 'Komt de storing steeds terug, dan zoeken we de oorzaak: een {t:Probleem|probleem}.', en: 'If the fault keeps coming back, we look for the cause: a {t:Problem|problem}.', cue: { Probleem: 'prob', Problem: 'prob' }, focus: ['prob', 'crew'] },
        { nl: 'We maken afspraken over reageren en oplossen. Een stilstaande lijn gaat voor een printer.', en: 'We agree how fast to respond and fix. A line that is down comes before a printer.', focus: ['sla', 'crew'] },
        { nl: 'Na een grote storing een {t:Post-mortem|post-mortem}, {t:Schuldvrij|schuldvrij}: wat maakte de fout mogelijk?', en: 'After a big outage a {t:Post-mortem|post-mortem}, {t:Blameless|blameless}: what made the error possible?', cue: { 'Post-mortem': 'pm', Schuldvrij: 'pm', Blameless: 'pm' }, focus: ['pm', 'devs'] },
        { nl: 'Bij incidenten gebruiken we vaak een {t:Prioriteitsmatrix|prioriteitsmatrix} en een {t:A3|A3}, een rapport op één vel.', en: 'For incidents we often use a {t:Priority matrix|priority matrix} and an {t:A3|A3}, a report on one sheet.', cue: { Prioriteitsmatrix: 'tool1', 'Priority matrix': 'tool1', A3: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Pipeline, meting, veilige uitrol en vangnet hangen samen.', en: 'Pipeline, measuring, safe roll-out and safety net belong together.', focus: ['whole', 'mes'] },
        { nl: 'Snelheid en stabiliteit gaan samen: kleine wijzigingen zijn makkelijker te testen en te herstellen.', en: 'Speed and stability go together: small changes are easier to test and to recover.', focus: ['decision', 'devs'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: DevOps en levering is het derde station van IT en agile.', en: 'The map of Projects: DevOps and delivery is the third station of IT and agile.', focus: mapCue('pm.devops') },
        { nl: 'DevOps en levering heeft vier onderwerpen, elk met vier niveaus.', en: 'DevOps and delivery has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij de pipeline. Op niveau Basis: wat DevOps is, wat DORA meet, omgevingen en incidenten.', en: 'Start with the pipeline. At Basics level: what DevOps is, what DORA measures, environments and incidents.', focus: ['tPipe', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen testautomatisering, eerlijk meten, feature flags en serviceafspraken erbij.', en: 'At Working knowledge you add test automation, honest measuring, feature flags and service agreements.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen dagelijks samenvoegen, rapporten lezen, veilig uitrollen en de post-mortem erbij.', en: 'At Advanced you add merging daily, reading the reports, rolling out safely and the post-mortem.', focus: 'lv3' },
        { nl: 'Op Expert komen leveren op de fabrieksvloer, sturen met DORA, terugdraaien en Lean in IT-beheer erbij.', en: 'At Expert you add delivering on the factory floor, steering with DORA, rolling back and Lean in IT operations.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said
// once. Short sentences, few colons and comma lists, no symbols the voice would
// read aloud and nothing in parentheses: the kit's narration guard
// (films/_kit/assert.mjs, checkNarration) holds every module film to that, and
// the render guard caps a pause inside a sentence at 0.4 s. Each topic scene ends
// on one short sentence naming two tools of that topic's lessons, without
// explaining them (the A3 gets one clause, the acronym being opaque).
// Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL): most of
// the film's words have a voice rule of an earlier film (pipeline, DevOps, State of
// DevOps, feature flag, MES, plantmanager in "voor de plantmanager", servicedesk,
// post-mortem) or are read right as they are. The voice does not say the words it
// would misread, and the captions show them: "live" (said "in productie" and "bij de
// vloer"), "release" (said "versies" and "vrijgeven"), "SLA" (said as the agreement it
// is), "benchmarks" (said "rapporten lezen"), "continuous integration" (said "dagelijks
// samenvoegen"), "CI/CD" and "IT-servicemanagement" (said by the topic's own words).
// One word needs a rule: testpiramide (espeak-ng stresses the second part on "raa").
const SAY = [
  [ // s1 one version, four topics
    { nl: 'Het IT-team bouwt het nieuwe MES voor de orders op de vloer. Wie het bouwt, houdt het ook draaiend.',
      en: 'The IT team builds the new MES for the orders on the floor. Whoever builds it also keeps it running.' },
    { nl: 'Jij leidt dat IT-project voor de plantmanager. De volgende versie krijgt een scherm met de afgekeurde stuks, en die moet veilig bij lijn 3 komen.',
      en: 'You lead that IT project for the plant manager. The next version gets a screen with the rejected pieces, and it has to reach line 3 safely.' },
    { nl: 'We volgen die ene versie langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow that one version through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 the pipeline
    { nl: 'Het eerste onderwerp is de pipeline en testautomatisering. Hoe komt een wijziging van het IT-team bij de vloer?',
      en: 'The first topic is the pipeline and test automation. How does a change from the IT team reach the floor?' },
    { nl: 'Een {t:Pipeline|pipeline} is een geautomatiseerde lopende band. Elke wijziging loopt door dezelfde stappen, van bouwen tot een testomgeving.',
      en: 'A {t:Pipeline|pipeline} is an automated conveyor. Every change runs through the same steps, from building to a test environment.' },
    { nl: '{t:Automatische test|Automatische tests} controleren elke wijziging opnieuw, zonder dat iemand hoeft te klikken. Faalt er een, dan stopt de band en krijgt het team direct een melding.',
      en: '{t:Automated test|Automated tests} check every change again, without anyone having to click. If one fails, the line stops and the team gets a message at once.' },
    { nl: 'Bij pipeline en testautomatisering gebruiken we vaak versiebeheer en een testpiramide.',
      en: 'For the pipeline and test automation we often use version control and a test pyramid.' },
  ],
  [ // s3 DORA
    { nl: 'Het tweede onderwerp zijn de DORA-metingen, uit onderzoek naar hoe goed IT-teams leveren. Hoe weet je of het IT-team goed levert?',
      en: 'The second topic is the DORA metrics, from research into how well IT teams deliver. How do you know whether the IT team delivers well?' },
    { nl: 'Twee metingen gaan over snelheid. Hoe vaak komt er een nieuwe versie bij de vloer, en hoe lang duurt het van wijziging tot daar?',
      en: 'Two measures are about speed. How often does a new version reach the floor, and how long does a change take to get there?' },
    { nl: 'Twee gaan over stabiliteit. Hoe vaak gaat een nieuwe versie mis, en hoe snel ben je dan weer hersteld?',
      en: 'Two are about stability. How often does a new version go wrong, and how quickly are you back on track?' },
    { nl: 'De beste teams scoren op alle vier goed. Kijk dus altijd naar alle vier samen, niet naar één getal.',
      en: 'The best teams score well on all four. So always look at all four together, not at one number.' },
    { nl: 'Bij DORA gebruiken we vaak een mediaan en het State of DevOps-rapport.',
      en: 'With DORA we often use a median and the State of DevOps report.' },
  ],
  [ // s4 release and environments
    { nl: 'Het derde onderwerp is het beheer van omgevingen en versies. Hoe komt de nieuwe versie veilig bij lijn 3?',
      en: 'The third topic is managing environments and releases. How does the new version reach line 3 safely?' },
    { nl: 'Een nieuwe versie gaat eerst langs ontwikkeling, test en {t:Acceptatieomgeving|acceptatie}. Daar controleert de teamleider van lijn 3 of het scherm klopt, want hij kent de vloer. Pas daarna volgt productie, met echte orders en machines.',
      en: 'A new version first passes development, test and {t:Acceptance environment|acceptance}. There the team lead of line 3 checks that the screen is right, because he knows the floor. Only then comes production, with real orders and machines.' },
    { nl: 'Installeren is nog geen vrijgeven. Het scherm staat al in productie, maar de fabriek kiest wanneer lijn 3 het ziet.',
      en: 'Installing is not yet releasing. The screen is already in production, but the plant chooses when line 3 sees it.' },
    { nl: 'Een fout raakt liefst weinig lijnen. Dat is de {t:Impactstraal|impactstraal}. Daarom gaat een nieuwe versie eerst naar één lijn, en dan naar de rest.',
      en: 'A fault should touch few lines. That is the {t:Blast radius|blast radius}. So a new version goes to one line first, and then to the rest.' },
    { nl: 'Bij het beheer van versies gebruiken we vaak een feature flag en een rollbackplan.',
      en: 'For managing releases we often use a feature flag and a rollback plan.' },
  ],
  [ // s5 service management and incidents
    { nl: 'Het vierde onderwerp is het beheer van IT-diensten en incidenten. Wat doe je als het MES op de vloer stilvalt?',
      en: 'The fourth topic is IT service management and incidents. What do you do when the MES on the floor stops?' },
    { nl: 'Valt het MES stil, dan melden de operators dat bij de servicedesk. Bij een {t:Incident|incident} telt één ding, zo snel mogelijk weer werken.',
      en: 'If the MES stops, the operators report it to the service desk. With an {t:Incident|incident} one thing counts, getting back to work as fast as possible.' },
    { nl: 'Komt dezelfde storing steeds terug, dan zoeken we de oorzaak. Dat heet een {t:Probleem|probleem}, en het doel is dat het niet terugkomt.',
      en: 'If the same fault keeps coming back, we look for the cause. That is a {t:Problem|problem}, and the goal is that it does not come back.' },
    { nl: 'Over reageren en oplossen maken we afspraken met de fabriek. Een stilstaande lijn gaat voor een kantoorprinter.',
      en: 'We agree with the plant how fast we respond and how fast we fix. A line that is down comes before an office printer.' },
    { nl: 'Na een grote storing houden we een {t:Post-mortem|post-mortem}. We zoeken wat in het systeem de fout mogelijk maakte, niet wie hem maakte. Dat is {t:Schuldvrij|schuldvrij}.',
      en: 'After a big outage we hold a {t:Post-mortem|post-mortem}. We look for what in the system made the error possible, not who made it. That is {t:Blameless|blameless}.' },
    { nl: 'Bij incidenten gebruiken we vaak een prioriteitsmatrix en een A3, een rapport op één vel.',
      en: 'For incidents we often use a priority matrix and an A3, a report on one sheet.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. De pipeline brengt de wijziging, DORA meet hoe het gaat, de uitrol houdt het veilig en incidentbeheer vangt de rest op.',
      en: 'It all connects. The pipeline carries the change, DORA measures how it goes, the roll-out keeps it safe and incident management catches the rest.' },
    { nl: 'Snelheid en stabiliteit gaan samen. Kleine wijzigingen zijn makkelijker te testen en te herstellen dan één grote versie per kwartaal.',
      en: 'Speed and stability go together. Small changes are easier to test and to recover than one big version a quarter.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. DevOps en levering is het derde station van IT en agile.',
      en: 'This is the map of Projects. DevOps and delivery is the third station of IT and agile.' },
    { nl: 'DevOps en levering heeft vier onderwerpen, elk met vier niveaus.',
      en: 'DevOps and delivery has four topics, each with four levels.' },
    { nl: 'Begin bij de pipeline. Op niveau Basis gaat het over wat DevOps is, wat DORA meet, omgevingen en incidenten.',
      en: 'Start with the pipeline. At Basics level it is about what DevOps is, what DORA measures, environments and incidents.' },
    { nl: 'Op Werkkennis komen testautomatisering, eerlijk meten, feature flags en serviceafspraken erbij.',
      en: 'At Working knowledge you add test automation, honest measuring, feature flags and service agreements.' },
    { nl: 'Op Gevorderd komen dagelijks samenvoegen, rapporten lezen, veilig uitrollen en de post-mortem erbij.',
      en: 'At Advanced you add merging daily, reading the reports, rolling out safely and the post-mortem.' },
    { nl: 'Op Expert komen leveren op de fabrieksvloer, sturen met DORA, terugdraaien en Lean in IT-beheer erbij.',
      en: 'At Expert you add delivering on the factory floor, steering with DORA, rolling back and Lean in IT operations.' },
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
const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"],[data-cue="devs"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-off{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
[data-cue][data-on] :is(.pm-arrow,.pm-link){stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait, zoals in het vierde veldfilmpje, IT en agile. Aan de achterwand lijn 3 met ernaast lijn 4, voorin een tafel met een laptop: het nieuwe MES. Per onderwerp komen er mensen bij: het IT-team bij de tafel, de plantmanager, de teamleider van lijn 3 en twee operators bij lijn 3. Rechts een paneel, gemarkeerd als voorbeeld of schema: het nieuwe MES en wie wat doet; een pipeline met de stappen commit, build, tests, artefact en testomgeving, waarbij een falende test de band stopt; de vier DORA-metingen in twee groepen, snelheid en stabiliteit; de omgevingen van ontwikkeling tot productie, installeren naast vrijgeven met een schakelaar, en een nieuwe versie die eerst naar één lijn gaat; een storing in het MES die via de servicedesk een incident wordt, een probleem met een oorzaak, een afspraak over reageren en oplossen met prioriteiten en een post-mortem; en per onderwerp twee namen van hulpmiddelen. Aan het eind de kaart van Projecten met DevOps en levering verlicht, en de vier onderwerpen met hun vier niveaus.',
  en: 'Hall B of the plant, where line 3 runs, as in the fourth field film, IT and agile. At the back wall line 3 with line 4 next to it, at the front a table with a laptop: the new MES. Each topic brings people: the IT team at the table, the plant manager, the team lead of line 3 and two operators at line 3. At the right a panel, marked as an example or a diagram: the new MES and who does what; a pipeline with the steps commit, build, tests, artefact and test environment, where a failing test stops the line; the four DORA metrics in two groups, speed and stability; the environments from development to production, installing next to releasing with a switch, and a new version that goes to one line first; a fault in the MES that becomes an incident via the service desk, a problem with a cause, an agreement on responding and fixing with priorities, and a post-mortem; and per topic two names of tools. At the end the map of Projects with DevOps and delivery lit, and the four topics with their four levels.',
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

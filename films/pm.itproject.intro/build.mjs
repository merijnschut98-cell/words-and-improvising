// Dev tool, not shipped. Builds the module intro film "Het MES kiezen en invoeren /
// Choosing and introducing the MES" for IT-projecten leiden (pm.itproject), the
// ninth module intro film (v17): the high-over picture at the top of the module,
// before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I
// need the most").
//
//   node films/pm.itproject.intro/build.mjs            build the page
//   node films/pm.itproject.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.itproject.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.itproject's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro): ONE concrete project
// travels through the whole module, the map before the detail, no calculations.
// This module belongs to the IT cluster, so the world is field film 4's
// (films/pm.field.it, whose IT-project station this intro agrees with: from
// requirements and vendor to go-live, real users test the MES, then the cutover
// weekend, with MoSCoW as the first tool): line 3 runs in hall B, the plant brings in
// a new MES for the orders on the floor, you lead that IT project for the plant
// manager together with the IT team. The STORY IS DRAWN IN THE ROOM: the MES is the
// laptop on the table at the front of the hall, and the cast changes per topic (the
// plant manager, the IT team at the table, the team lead of line 3 who knows the
// work, the operators at the line). The film is about the IT project as a whole:
// not the delivery pipeline (pm.devops.intro) and not scaling (pm.scaled.intro).
//   s1 the goal: line 3 runs in hall B, the new MES for the orders on the floor;
//      the plant manager, you and the IT team; the module's four topics as a route
//   s2 Requirements en scope: a requirement is something the MES must do, written so
//      you can check it, with the people who know the work; not everything fits in the
//      first version, so what must be in at go-live and what may wait
//                                                          → pm.itproject.requirements
//   s3 Leverancier, SaaS en contract kiezen: build, buy or rent (SaaS); the vendor makes
//      the package, the partner sets it up, one table of who does what; the selection
//      runs in steps to a shortlist and one choice        → pm.itproject.saas, .selection
//   s4 ERP/MES invoeren: the go-live is the day the new MES becomes the official system;
//      big bang or phased                                  → pm.itproject.rollout
//   s5 Testen en adoptie: the UAT with key users (the team lead of line 3), the sign-off
//      by the process owners, and whether the MES is used  → pm.itproject.uat
//   s6 one whole: the project in the order it runs and the day all of it points at
//   s7 the shared Projects map with IT projects lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.itproject.requirements, .saas,
// .rollout, .uat). Each topic scene names two tools of that topic's lessons in one
// short sentence, without explaining them (Merijn's checkpoint, 14 Nov): MoSCoW
// (pm.itproject.mvp) and To-be-proces (.requirements); RFP and Beoordelingsmatrix
// (.selection); Pilot (.rollout) and Proefmigratie (.migration); Testscript (.uat) and
// Triage (.defects). All are terms of their lessons at Basis or Werkkennis, and the
// build asserts that in both languages. The field film's second tool of the module, the
// Cutoverdraaiboek, is a Gevorderd term (pm.itproject.cutover) and so not a tool here;
// the cutover weekend is on the level grid. Terms come from the module's lessons and
// {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs);
// the kit holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), to the narration guard and to the label fit. The
// index has a topic title that wraps to four lines in the default tile ("ERP/MES invoeren:
// van migratie tot hypercare"), so the film declares tileUnits (as pm.agile.intro).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast; the IT team and the operators drawn
// with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs). The things of hall B
// are the pilot's (../pm.plan.intro/hall.mjs, imported, not copied). A panel at
// the right, in stage space, draws each step as a schema, labelled "voorbeeld"
// (the MES in use) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.itproject');
const LEVELS = {
  scope: ['pm.itproject.requirements', 'pm.itproject.mvp', 'pm.itproject.fitgap', 'pm.itproject.scopegov'],
  vendor: ['pm.itproject.saas', 'pm.itproject.selection', 'pm.itproject.tco', 'pm.itproject.contract'],
  golive: ['pm.itproject.rollout', 'pm.itproject.migration', 'pm.itproject.cutover', 'pm.itproject.hypercare'],
  adoption: ['pm.itproject.uat', 'pm.itproject.defects', 'pm.itproject.roles', 'pm.itproject.change'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.itproject has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// a tool must be a TERM of its lesson (not just a word in its text), in both languages, at Basis (level 1) or Werkkennis (level 2)
const tool = (id, nl, en) => {
  assert([0, 1].includes(LEVELS[Object.keys(LEVELS).find((t) => LEVELS[t].includes(id))].indexOf(id)), `${id} is not a Basis or Werkkennis lesson`);
  assert((lessons.nl.get(id).terms || []).some((t) => t.term === nl), `${id}: "${nl}" is no Dutch term of the lesson`);
  assert((lessons.en.get(id).terms || []).some((t) => t.term === en), `${id}: "${en}" is no English term of the lesson`);
};
// the world is field film 4's (films/pm.field.it): the new MES for the orders on the floor, you lead the IT project for the
// plant manager; pm.itproject.rollout says what an MES is, in the same words
has('pm.itproject.rollout', ['Een MES is het systeem op de vloer dat de orders per lijn aanstuurt']);
has('pm.itproject.rollout', ['An MES is the system on the floor that runs orders per line'], 'en');
// s2: a requirement (something the system must do, written so you can check it later), written with the people who know the
// work; scope (what is in the first version); the tools (MoSCoW, the to-be process)
has('pm.itproject.requirements', ['Een requirement is iets wat het nieuwe systeem moet doen of moet zijn, zo opgeschreven dat je het later kunt controleren', 'Requirements schrijf je met de mensen die het werk kennen', 'Een goede requirement is toetsbaar']);
has('pm.itproject.requirements', ['A requirement is something the new system must do or must be, written so that you can check it later', 'Requirements are written by the people who know the work', 'A good requirement is testable'], 'en');
has('pm.itproject.mvp', ['De MVP-lijn is de streep in de gesorteerde lijst: alles erboven moet klaar zijn voor de go-live']);
has('pm.itproject.mvp', ['The MVP cut line is the line in the sorted list above which everything must be ready for go-live'], 'en');
tool('pm.itproject.mvp', 'MoSCoW', 'MoSCoW');
tool('pm.itproject.requirements', 'To-be-proces', 'To-be process');
has('pm.itproject.requirements', ['hoe het werk na de go-live loopt, stap voor stap']);
has('pm.itproject.requirements', ['how the work will run after go-live, step by step'], 'en');
// s3: build, buy or rent (SaaS, the vendor runs it), the vendor makes the package and the partner sets it up (and writes down who
// does what in one table), the selection in steps (many candidates, a shortlist); the tools (RFP, the scoring matrix)
has('pm.itproject.saas', ['Zelf bouwen', 'Een pakket kopen en op je eigen servers draaien', 'huren als SaaS', 'de leverancier regelt alles', 'De softwareleverancier maakt het pakket', 'De implementatiepartner is een apart bedrijf dat het voor jou inricht', 'Zet het antwoord in één tabel die alle drie tekenen']);
has('pm.itproject.saas', ['Build it yourself', 'Buy a package and run it on your own servers', 'rent it as SaaS', 'the vendor runs everything', 'The software vendor makes the package', 'The implementation partner is a separate company that configures it for you', 'Put the answer in one table that all three sign'], 'en');
has('pm.itproject.selection', ['Een longlist van acht tot tien kandidaten', 'Een shortlist van een stuk of drie']);
has('pm.itproject.selection', ['A longlist of eight to ten candidates', 'A shortlist of about three'], 'en');
tool('pm.itproject.selection', 'RFP', 'RFP');
tool('pm.itproject.selection', 'Beoordelingsmatrix', 'Scoring matrix');
has('pm.itproject.selection', ['RFP, request for proposal: jouw requirements, scenario’s en contractvoorwaarden, waarop zij reageren met een voorstel en een prijs']);
has('pm.itproject.selection', ['RFP, request for proposal: your requirements, scenarios and contract terms, to which they respond with a proposal and a price'], 'en');
// s4: the go-live is the day the new system becomes the official one (the old one is no longer used for new work); big bang
// (everything on the same day) or phased (per site, per line or per module, less risk per step, at an extra cost); the tools
// (a pilot, a mock migration, the trial run of the data move)
has('pm.itproject.rollout', ['De go-live is de dag dat het nieuwe systeem het officiële wordt', 'wordt niet meer gebruikt voor nieuw werk', 'Big bang: alle vestigingen en afdelingen schakelen op dezelfde dag om', 'Een gefaseerde invoering gaat per vestiging, per lijn of per module', 'Dat is de prijs van een kleiner risico per stap', 'Gefaseerd kost extra']);
has('pm.itproject.rollout', ['Go-live is the day the new system becomes the official one', 'is no longer used for new work', 'Big bang: all sites and departments switch on the same day', 'A phased rollout goes per site, per line or per module', 'That is the price of a smaller risk per step', 'Phased costs extra'], 'en');
tool('pm.itproject.rollout', 'Pilot', 'Pilot');
tool('pm.itproject.migration', 'Proefmigratie', 'Mock migration');
has('pm.itproject.migration', ['Dat oefen je meerdere keren in een proefmigratie: een proefrun naar een testomgeving']);
has('pm.itproject.migration', ['You rehearse that several times in a mock migration: a trial run into a test environment'], 'en');
// s5: the UAT (future users check that the system supports their work, with scenarios from the real work), key users test, the
// sign-off by the process owners, the system only pays off when it is used; the tools (a test script, triage)
has('pm.itproject.uat', ['Dan de UAT, de gebruikersacceptatietest (user acceptance test): de toekomstige gebruikers controleren of het systeem hun werk ondersteunt, en accepteren het', 'Het testen doen key users', 'testscenario’s uit het echte werk', 'De UAT eindigt met een sign-off: de formele acceptatie door de proceseigenaren']);
has('pm.itproject.uat', ['Then the UAT, the user acceptance test: the future users check whether the system supports their work, and accept it', 'The testing is done by key users', 'test scenarios taken from real work', 'The UAT ends with sign-off: the formal acceptance by the process owners'], 'en');
tool('pm.itproject.uat', 'Testscript', 'Test script');
tool('pm.itproject.defects', 'Triage', 'Triage');
has('pm.itproject.defects', ['Triage is het dagelijkse overleg waarin bevindingen gesorteerd worden']);
has('pm.itproject.defects', ['Triage is the daily meeting where defects are sorted'], 'en');
has('pm.itproject.change', ['Zonder gebruik geen uitkomst']);
has('pm.itproject.change', ['Without use, no outcome'], 'en');
// s6: the order of the project, and the go-live as the day everything points at, not in your busiest season
has('pm.itproject.rollout', ['Alles in het project wijst naar die dag', 'Daarom kies je de datum zorgvuldig', 'ga nooit live in je piekseizoen']);
has('pm.itproject.rollout', ['Everything in the project points at that day', 'That is why the date is chosen carefully', 'never go live in your peak season'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.itproject.requirements', 'requirement'], ['pm.itproject.saas', 'SaaS'], ['pm.itproject.rollout', 'invoering'], ['pm.itproject.uat', 'gebruikersacceptatietest'],
  ['pm.itproject.mvp', 'MVP'], ['pm.itproject.selection', 'selectie'], ['pm.itproject.migration', 'Datamigratie'], ['pm.itproject.defects', 'exitcriteria'],
  ['pm.itproject.fitgap', 'maatwerk'], ['pm.itproject.tco', 'totale kosten'], ['pm.itproject.cutover', 'cutover'], ['pm.itproject.roles', 'training'],
  ['pm.itproject.scopegov', 'Vaste datum, flexibele scope'], ['pm.itproject.contract', 'Het contract'], ['pm.itproject.hypercare', 'Hypercare'], ['pm.itproject.change', 'Adoptie']]) has(id, [word]);
for (const [id, word] of [['pm.itproject.requirements', 'requirement'], ['pm.itproject.saas', 'SaaS'], ['pm.itproject.rollout', 'implementation'], ['pm.itproject.uat', 'user acceptance test'],
  ['pm.itproject.mvp', 'MVP'], ['pm.itproject.selection', 'selection'], ['pm.itproject.migration', 'Data migration'], ['pm.itproject.defects', 'exit criteria'],
  ['pm.itproject.fitgap', 'custom'], ['pm.itproject.tco', 'Total cost'], ['pm.itproject.cutover', 'cutover'], ['pm.itproject.roles', 'training'],
  ['pm.itproject.scopegov', 'Fixed date, flexible scope'], ['pm.itproject.contract', 'The contract'], ['pm.itproject.hypercare', 'Hypercare'], ['pm.itproject.change', 'Adoption']]) has(id, [word], 'en');
has('pm.itproject.selection', ['Scripted demo']);
has('pm.itproject.selection', ['Scripted demo'], 'en');
// s7: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 282, col: 86, box: 76, tile: 264 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}

// the topic titles: "ERP/MES invoeren: van migratie tot hypercare" wraps to four lines in the default 128-unit tile (no word is
// wider than it), so, as pm.agile.intro, the film declares tileUnits = the room of its narrowest title box, the closing
// grid's tile (GRID.tile - 12 units of text, up to three lines), and every title box of the stage wraps with D.tileUnits
// (the kit's checkLabels holds the titles to it too, also after a rename without a rebuild)
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

// where things stand (cm), as in the pilot and field film 4: line 3's marked floor at the back wall at the right under the
// switchboard, line 4 (which stays) next to it, the power cabinet at the back wall at the left, the MES (a laptop on a
// small table) at the front of the hall
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const MESTAB = { x: 70, y: 112, w: 58, d: 30, h: 74 };
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the plant manager (the sponsor) and the team lead of line 3 (the Product Owner of the MES) are the pm cast;
// the IT team (two Developers and the Scrum Master) and the two operators are pm.agile.scrum's figures. Each stands in a
// cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
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
// the panel; its place IT projects is a cue group of its own (map-itproject).
const tiles = ['tScope', 'tVendor', 'tLive', 'tTest'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('team', g('teamB', ''))
  + cueG('req', g('reqB', '')) + cueG('list', g('listB', '')) + cueG('opt', g('optB', '')) + cueG('party', g('partyB', '')) + cueG('table', g('tableB', '')) + cueG('funnel', g('funnelB', ''))
  + cueG('golive', g('lineB', '')) + cueG('how', g('howB', ''))
  + cueG('uat', g('uatB', '')) + cueG('sit', g('sitB', '')) + cueG('sign', g('signB', '')) + cueG('use', g('useB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Agile and Scrum lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.itproject'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const PLACE = pmMap.places.find((p) => p.module === 'pm.itproject');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.itproject')}"`), 'the map lights pm.agile as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor and the MES
  { from: cam(110, 115, 70, 1.12), to: cam(105, 115, 70, 1.18) }, // s2 the IT team and the team lead at the MES table
  { from: cam(110, 115, 70, 1.12), to: cam(105, 115, 70, 1.18) }, // s3 the IT team at the MES table
  { from: cam(150, 95, 60, 1.05), to: cam(145, 100, 60, 1.1) }, // s4 line 3 and the operators, the IT team at the table
  { from: cam(135, 100, 70, 1), to: cam(140, 100, 70, 1.05) }, // s5 the team lead at the MES, the operators at the line
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];


// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.itproject.intro',
  title: { nl: 'Het MES kiezen en invoeren', en: 'Choosing and introducing the MES' },
  module: 'pm.itproject',
  // the room of text in the narrowest title box (the closing grid's tile), see the module section above
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.itproject, the scene that explains it and its tile
  topics: {
    scope: { scene: 's2', cue: 'tScope' },
    vendor: { scene: 's3', cue: 'tVendor' },
    golive: { scene: 's4', cue: 'tLive' },
    adoption: { scene: 's5', cue: 'tTest' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Lijn 3 draait in hal B. Nu komt er een nieuw MES voor de orders op de vloer.', en: 'Line 3 runs in hall B. Now a new MES is coming for the orders on the floor.', focus: ['goal', 'line3', 'mes'] },
        { nl: 'Jij leidt dat IT-project voor de plantmanager, samen met het IT-team.', en: 'You lead that IT project for the plant manager, together with the IT team.', focus: ['team', 'sponsor', 'devs', 'mes'] },
        { nl: 'We volgen het project van eerste eis tot echt gebruik, langs de vier onderwerpen van de module.', en: 'We follow the project from the first requirement to real use, through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Requirements en scope', en: 'Requirements and scope' },
      beats: [
        { nl: 'Eerste onderwerp: Requirements en scope. Wat moet het MES eigenlijk kunnen?', en: 'First topic: Requirements and scope. What must the MES actually do?', focus: ['tScope', 'devs', 'mes'] },
        { nl: 'Een {t:Requirement|requirement} is iets wat het MES moet doen, zo opgeschreven dat je het kunt controleren.', en: 'A {t:Requirement|requirement} is something the MES must do, written so that you can check it.', cue: { Requirement: 'req' }, focus: ['req', 'devs', 'mes'] },
        { nl: 'Je schrijft ze met mensen die het werk kennen, zoals de teamleider van lijn 3.', en: 'You write them with people who know the work, like the team lead of line 3.', focus: ['req', 'teamlead'] },
        { nl: 'Alles past niet in de eerste versie. Wat moet er bij de go-live zeker in, en wat mag later?', en: 'Not everything fits in the first version. What must be in at go-live, and what can wait?', focus: ['list', 'teamlead', 'devs'] },
        { nl: 'Bij requirements gebruiken we {t:MoSCoW|MoSCoW} en een {t:To-be-proces|to-be-proces}, het werk zoals het straks loopt.', en: 'For requirements we use {t:MoSCoW|MoSCoW} and a {t:To-be process|to-be process}, the work as it will run.', cue: { MoSCoW: 'tool1', 'To-be-proces': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Leverancier kiezen', en: 'Choosing a vendor' },
      beats: [
        { nl: 'Tweede onderwerp: Leverancier, SaaS en contract kiezen. Van wie komt het MES?', en: 'Second topic: Choosing a vendor, SaaS and contracts. Where does the MES come from?', focus: ['tVendor', 'devs', 'mes'] },
        { nl: 'Je kunt een MES zelf bouwen, kopen of huren. Huren heet {t:SaaS|SaaS}, de leverancier draait het voor je.', en: 'You can build an MES yourself, buy it or rent it. Renting is called {t:SaaS|SaaS}, the vendor runs it for you.', cue: { SaaS: 'opt' }, focus: ['opt', 'devs'] },
        { nl: 'De {t:Softwareleverancier|leverancier} maakt het pakket. De {t:Implementatiepartner|partner} richt het in.', en: 'The {t:Software vendor|vendor} makes the package. The {t:Implementation partner|partner} sets it up.', cue: { Softwareleverancier: 'party', Implementatiepartner: 'party' }, focus: ['party', 'devs'] },
        { nl: 'Leg vooraf vast wie wat doet, in één tabel. Anders wijst de een later naar de ander.', en: 'Fix who does what in advance, in one table. Otherwise one points at the other later.', focus: ['table', 'party'] },
        { nl: 'Je kiest in stappen, van veel kandidaten via een {t:Shortlist|shortlist} naar één keuze.', en: 'You choose in steps, from many candidates via a {t:Shortlist|shortlist} to one choice.', cue: { Shortlist: 'funnel' }, focus: ['funnel', 'devs'] },
        { nl: 'Bij het kiezen gebruiken we een {t:RFP|RFP}, de vraag om een voorstel, en een {t:Beoordelingsmatrix|beoordelingsmatrix}.', en: 'For choosing we use an {t:RFP|RFP}, the request for a proposal, and a {t:Scoring matrix|scoring matrix}.', cue: { RFP: 'tool1', Beoordelingsmatrix: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Invoeren en go-live', en: 'Roll-out and go-live' },
      beats: [
        { nl: 'Derde onderwerp: ERP/MES invoeren: van migratie tot hypercare. Hoe gaat het MES echt live?', en: 'Third topic: ERP/MES implementation: from migration to hypercare. How does the MES really go live?', focus: ['tLive', 'line3', 'mes'] },
        { nl: 'De {t:Go-live|go-live} is de dag dat het MES het officiële systeem wordt. Het oude systeem doet geen nieuw werk meer.', en: '{t:Go-live|Go-live} is the day the MES becomes the official system. The old system does no new work.', cue: { 'Go-live': 'golive' }, focus: ['golive', 'mes'] },
        { nl: 'Een {t:Big bang|big bang} gaat alles tegelijk. {t:Gefaseerde invoering|Gefaseerd} gaat lijn voor lijn, met minder risico per stap.', en: 'A {t:Big bang|big bang} switches everything at once. {t:Phased rollout|Phased} goes line by line, with less risk per step.', cue: { 'Big bang': 'how', 'Gefaseerde invoering': 'how' }, focus: ['how', 'line3', 'crew'] },
        { nl: 'Bij het invoeren gebruiken we een {t:Pilot|pilot} en een {t:Proefmigratie|proefmigratie}, een oefenrun voor de data.', en: 'For roll-out we use a {t:Pilot|pilot} and a {t:Mock migration|mock migration}, a practice run for the data.', cue: { Pilot: 'tool1', Proefmigratie: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Testen en adoptie', en: 'Testing and adoption' },
      beats: [
        { nl: 'Vierde onderwerp: Testen en adoptie. Past het MES echt bij het werk?', en: 'Fourth topic: Testing and adoption. Does the MES really fit the work?', focus: ['tTest', 'devs', 'mes'] },
        { nl: 'Bij de {t:UAT|UAT}, de gebruikersacceptatietest, controleren toekomstige gebruikers of het MES past.', en: 'In the {t:UAT|UAT}, the user acceptance test, future users check that the MES fits.', cue: { UAT: 'uat' }, focus: ['uat', 'devs', 'mes'] },
        { nl: '{t:Key user|Key users}, zoals de teamleider van lijn 3, testen met situaties uit het echte werk.', en: '{t:Key user|Key users}, like the team lead of line 3, test with situations from the real work.', cue: { 'Key user': 'sit' }, focus: ['sit', 'teamlead'] },
        { nl: 'Na de test tekenen de proceseigenaren voor de {t:Sign-off|sign-off}. Dan is het MES geaccepteerd.', en: 'After the test the process owners sign the {t:Sign-off|sign-off}. Then the MES is accepted.', cue: { 'Sign-off': 'sign' }, focus: ['sign', 'teamlead'] },
        { nl: 'En na de go-live? Zonder gebruik levert het MES niets op.', en: 'And after go-live? Without use the MES delivers nothing.', focus: ['use', 'crew'] },
        { nl: 'Bij testen gebruiken we een {t:Testscript|testscript} en {t:Triage|triage}, het sorteren van bevindingen.', en: 'For testing we use a {t:Test script|test script} and {t:Triage|triage}, sorting the defects.', cue: { Testscript: 'tool1', Triage: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Eerst de requirements en de leverancier, dan de test, de go-live en het gebruik.', en: 'It all connects. First the requirements and the vendor, then the test, the go-live and the use.', focus: ['flow', 'mes'] },
        { nl: 'Alles wijst naar de go-live. Daarom kies je die dag zorgvuldig en niet in je drukste tijd.', en: 'Everything points at go-live. So you choose that day carefully, not in your busiest time.', focus: ['decision', 'sponsor'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: IT-projecten leiden is het vierde station van IT en agile.', en: 'The map of Projects: Leading IT projects is the fourth station of IT and agile.', focus: mapCue('pm.itproject') },
        { nl: 'IT-projecten leiden heeft vier onderwerpen, elk met vier niveaus.', en: 'Leading IT projects has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Requirements en scope. Op niveau Basis: een requirement, SaaS, de invoering en de UAT.', en: 'Start with Requirements and scope. At Basics level: a requirement, SaaS, the roll-out and the UAT.', focus: ['tScope', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen de MVP, de leveranciersselectie, datamigratie en exitcriteria erbij.', en: 'At Working knowledge you add the MVP, vendor selection, data migration and exit criteria.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen standaard of maatwerk, de totale kosten, het cutover-weekend en training erbij.', en: 'At Advanced you add standard or custom, the total cost, the cutover weekend and training.', focus: 'lv3' },
        { nl: 'Op Expert komen vaste datum met flexibele scope, het contract, hypercare en adoptie meten erbij.', en: 'At Expert you add a fixed date with flexible scope, the contract, hypercare and measuring adoption.', focus: 'lv4' },
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
// explaining them (an opaque name gets one short clause).
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Lijn 3 draait in hal B. Nu komt er een nieuw MES, het systeem dat de orders op de vloer aanstuurt.',
      en: 'Line 3 runs in hall B. Now a new MES is coming, the system that runs the orders on the floor.' },
    { nl: 'Jij leidt dat IT-project voor de plantmanager, samen met het IT-team.',
      en: 'You lead that IT project for the plant manager, together with the IT team.' },
    { nl: 'We volgen het project van eerste eis tot echt gebruik, langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow the project from the first requirement to real use, through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 requirements and scope
    { nl: 'Het eerste onderwerp is Requirements en scope. Wat moet het MES eigenlijk kunnen?',
      en: 'The first topic is Requirements and scope. What must the MES actually do?' },
    { nl: 'Een {t:Requirement|requirement} is iets wat het MES moet doen, zo opgeschreven dat je het kunt controleren.',
      en: 'A {t:Requirement|requirement} is something the MES must do, written so that you can check it.' },
    { nl: 'Je schrijft ze met mensen die het werk kennen, zoals de teamleider van lijn 3.',
      en: 'You write them with people who know the work, like the team lead of line 3.' },
    { nl: 'Alles past niet in de eerste versie. Wat moet er bij de go-live zeker in, en wat mag later?',
      en: 'Not everything fits in the first version. What must be in at go-live, and what can wait?' },
    { nl: 'Bij requirements gebruiken we MoSCoW en een to-be-proces, het werk zoals het straks loopt.',
      en: 'For requirements we use MoSCoW and a to-be process, the work as it will run.' },
  ],
  [ // s3 choosing a vendor
    { nl: 'Het tweede onderwerp is Leverancier, SaaS en contract kiezen. Van wie komt het MES?',
      en: 'The second topic is Choosing a vendor, SaaS and contracts. Where does the MES come from?' },
    { nl: 'Je kunt een MES zelf bouwen, kopen of huren. Huren heet {t:SaaS|SaaS}, de leverancier draait het voor je.',
      en: 'You can build an MES yourself, buy it or rent it. Renting is called {t:SaaS|SaaS}, the vendor runs it for you.' },
    { nl: 'De {t:Softwareleverancier|softwareleverancier} maakt het pakket. De {t:Implementatiepartner|implementatiepartner} richt het voor jou in.',
      en: 'The {t:Software vendor|software vendor} makes the package. The {t:Implementation partner|implementation partner} sets it up for you.' },
    { nl: 'Leg vooraf vast wie wat doet, in één tabel. Anders wijst de een later naar de ander.',
      en: 'Fix who does what in advance, in one table. Otherwise one points at the other later.' },
    { nl: 'Je kiest in stappen, van veel kandidaten via een {t:Shortlist|shortlist} naar één keuze.',
      en: 'You choose in steps, from many candidates via a {t:Shortlist|shortlist} to one choice.' },
    { nl: 'Bij het kiezen gebruiken we een RFP, de vraag om een voorstel, en een beoordelingsmatrix.',
      en: 'For choosing we use an RFP, the request for a proposal, and a scoring matrix.' },
  ],
  [ // s4 roll-out and go-live
    { nl: 'Het derde onderwerp is ERP en MES invoeren, van migratie tot hypercare. Hoe gaat het MES echt live?',
      en: 'The third topic is ERP and MES implementation, from migration to hypercare. How does the MES really go live?' },
    { nl: 'De {t:Go-live|go-live} is de dag dat het nieuwe MES het officiële systeem wordt. Het oude systeem doet dan geen nieuw werk meer.',
      en: '{t:Go-live|Go-live} is the day the new MES becomes the official system. The old system then does no new work.' },
    { nl: 'Een {t:Big bang|big bang} schakelt alles tegelijk om. {t:Gefaseerde invoering|Gefaseerd} gaat lijn voor lijn, met minder risico per stap.',
      en: 'A {t:Big bang|big bang} switches everything at once. {t:Phased rollout|Phased} goes line by line, with less risk per step.' },
    { nl: 'Bij het invoeren gebruiken we een pilot en een proefmigratie, een oefenrun voor het verhuizen van data.',
      en: 'For roll-out we use a pilot and a mock migration, a practice run for moving the data.' },
  ],
  [ // s5 testing and adoption
    { nl: 'Het vierde onderwerp is Testen en adoptie. Past het MES echt bij het werk?',
      en: 'The fourth topic is Testing and adoption. Does the MES really fit the work?' },
    { nl: 'Bij de {t:UAT|UAT}, de gebruikersacceptatietest, controleren toekomstige gebruikers of het MES past.',
      en: 'In the {t:UAT|UAT}, the user acceptance test, future users check that the MES fits.' },
    { nl: '{t:Key user|Key users}, zoals de teamleider van lijn 3, testen met situaties uit het echte werk.',
      en: '{t:Key user|Key users}, like the team lead of line 3, test with situations from the real work.' },
    { nl: 'Na de test tekenen de proceseigenaren voor de {t:Sign-off|sign-off}. Dan is het MES geaccepteerd.',
      en: 'After the test the process owners sign the {t:Sign-off|sign-off}. Then the MES is accepted.' },
    { nl: 'En na de go-live? Zonder gebruik levert het MES niets op.',
      en: 'And after go-live? Without use the MES delivers nothing.' },
    { nl: 'Bij testen gebruiken we een testscript en triage, het sorteren van bevindingen.',
      en: 'For testing we use a test script and triage, sorting the defects.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Eerst de requirements en de leverancier, dan de test, de go-live en het gebruik.',
      en: 'It all connects. First the requirements and the vendor, then the test, the go-live and the use.' },
    { nl: 'Alles wijst naar de go-live. Daarom kies je die dag zorgvuldig en niet in je drukste tijd.',
      en: 'Everything points at go-live. So you choose that day carefully, not in your busiest time.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. IT-projecten leiden is het vierde station van IT en agile.',
      en: 'This is the map of Projects. Leading IT projects is the fourth station of IT and agile.' },
    { nl: 'IT-projecten leiden heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Leading IT projects has four topics, each with four levels.' },
    { nl: 'Begin bij Requirements en scope. Op niveau Basis gaat het over een requirement, SaaS, de invoering en de gebruikersacceptatietest.',
      en: 'Start with Requirements and scope. At Basics level it is about a requirement, SaaS, the roll-out and the user acceptance test.' },
    { nl: 'Op Werkkennis komen de MVP, de leveranciersselectie, datamigratie en exitcriteria erbij.',
      en: 'At Working knowledge you add the MVP, vendor selection, data migration and exit criteria.' },
    { nl: 'Op Gevorderd komen standaard of maatwerk, de totale kosten, het cutover-weekend en training erbij.',
      en: 'At Advanced you add standard or custom, the total cost, the cutover weekend and training.' },
    { nl: 'Op Expert komen vaste datum met flexibele scope, het contract, hypercare en adoptie meten erbij.',
      en: 'At Expert you add a fixed date with flexible scope, the contract, hypercare and measuring adoption.' },
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
const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"],[data-cue="devs"],[data-cue="sm"])';
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
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.pm-curve-ok{fill:none;stroke:var(--fp-accent);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:6 5}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-rag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-g{fill:#5E9A6B;stroke:#4A7F56;stroke-width:1.2}
.pm-rag-a{fill:#D49A35;stroke:#B07B22;stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-curve,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-curve{stroke-width:3.4}
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait, zoals in het vierde veldfilmpje, IT en agile. Op de vloer lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, aan de zijwand een kalender en voorin een tafel met een laptop: het nieuwe MES. Per onderwerp komen er mensen bij: de plantmanager, het IT-team bij de tafel, de teamleider van lijn 3 die het werk kent en twee operators bij lijn 3. Rechts een paneel, gemarkeerd als voorbeeld of schema: het nieuwe MES en wie wat doet; een eis met een controle, de teamleider die meeschrijft en een lijst die verdeeld is in wat bij de go-live moet en wat later mag; drie manieren om aan een MES te komen, de leverancier en de partner met één tabel en een trechter van kandidaten naar een keuze; de go-live als moment tussen het oude systeem en het nieuwe MES, een big bang en een gefaseerde invoering; de gebruikers die het MES testen, een situatie uit het werk, een akkoord en de vraag of het MES wordt gebruikt; en per onderwerp twee namen van hulpmiddelen. Aan het eind de kaart van Projecten met IT-projecten leiden verlicht, en de vier onderwerpen met hun vier niveaus.',
  en: 'Hall B of the plant, where line 3 runs, as in the fourth field film, IT and agile. On the floor line 3 in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, on the side wall a calendar and at the front a table with a laptop: the new MES. Each topic brings people: the plant manager, the IT team at the table, the team lead of line 3 who knows the work and two operators at line 3. At the right a panel, marked as an example or a diagram: the new MES and who does what; a requirement with a check, the team lead who helps write and a list divided into what must be in at go-live and what can wait; three ways to get an MES, the vendor and the partner with one table and a funnel from candidates to one choice; the go-live as the moment between the old system and the new MES, a big bang and a phased roll-out; the users who test the MES, a situation from the work, an acceptance and the question whether the MES is used; and per topic two names of tools. At the end the map of Projects with Leading IT projects lit, and the four topics with their four levels.',
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


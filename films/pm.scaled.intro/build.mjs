// Dev tool, not shipped. Builds the module intro film "Eén MES, meer teams /
// One MES, more teams" for Opschalen: SAFe en verder (pm.scaled), the seventh
// module intro film (v17): the high-over picture at the top of the module,
// before its four topics (Merijn, 13 Nov: "that high-over picture is the thing
// I need the most").
//
//   node films/pm.scaled.intro/build.mjs            build the page
//   node films/pm.scaled.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.scaled.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.scaled's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro), as pm.agile.intro: ONE
// concrete project travels through the whole module, the map before the detail, no
// calculations. This module belongs to the IT cluster, so the world is field film
// 4's (films/pm.field.it, whose Scaling station this intro agrees with: one team is
// too small for the whole MES, so the teams plan together and work to one rhythm,
// like a train; PI Planning and WSJF) and pm.agile.intro's: line 3 runs in hall B,
// the plant brings in a new MES for the orders on the floor, you lead that IT
// project for the plant manager and the IT team builds it. Now the MES has to go to
// more lines, so there are several IT teams. This film keeps to scaling: nothing
// of deployment (pm.devops.intro tells that). The STORY IS DRAWN IN THE ROOM: the
// MES is the laptop on the table at the front of the hall, the first IT team
// stands at it, a second team joins, the plant manager comes for the decisions and
// the hardware of the lines (weighing scales, which the itproject lessons name as an
// interface of the MES) appears in the hardware topic.
//   s1 the goal: the new MES must go to more lines, one IT team is too small; the
//      plant manager, you and the IT teams; the module's four topics as a route
//   s2 SAFe-basis: team A waits for team B (a dependency), the teams on one train
//      that stays together, one fixed rhythm for all        → pm.scaled.why
//   s3 Portfolio en Lean budgets: all development of the plant is the portfolio,
//      project funding against funding the train, strategic themes
//                                                          → pm.scaled.lpm
//   s4 Alternatieven en kritiek: SAFe is not the only way; LeSS leaves things out
//      (one Product Owner, one backlog, feature teams)     → pm.scaled.less
//   s5 Hybride: stage-gate plus agile: hardware makes a change costly, so stages
//      with a gate, sprints inside the stages               → pm.scaled.stagegate
//   s6 one whole
//   s7 the shared Projects map with Opschalen lit, then the module's four topics
//      with their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.scaled.why, .lpm, .less,
// .stagegate). Each topic scene names two tools of that topic's lessons in one
// short sentence, without explaining them (Merijn's checkpoint, 14 Nov): PI Planning
// and the ART Planning Board (SAFe-basis; pm.scaled.piplanning), a Lean business case
// and WSJF (portfolio; pm.scaled.epics, .wsjf; WSJF is the field film's second tool of
// this station), Sprint Planning One of LeSS and Cross-Team Refinement of Nexus
// (alternatives; pm.scaled.less, .nexus) and backward planning and a design freeze
// (hybrid; pm.scaled.longlead). Terms come from the module's lessons and {n:} numbers
// from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit
// holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), to the narration guard and to the label fit. A
// topic title is a word wider than the kit's default 128-unit tile ("Alternatieven"
// and "Alternatives") so, as pm.agile.intro, the film declares tileUnits.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the plant
// manager from its cast; the two IT teams drawn with pm.agile.scrum's cast
// (films/pm.agile.scrum/cast.mjs). The things of hall B are the pilot's
// (../pm.plan.intro/hall.mjs, imported, not copied). A panel at the right, in stage
// space, draws each step as a schema, labelled "voorbeeld" (the MES in use) or
// "schema" (the module's map).
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
// module's topics or levels move): s7 names what each level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'pm.scaled');
const LEVELS = {
  safe: ['pm.scaled.why', 'pm.scaled.piplanning', 'pm.scaled.roles', 'pm.scaled.configs'],
  portfolio: ['pm.scaled.lpm', 'pm.scaled.epics', 'pm.scaled.wsjf', 'pm.scaled.budgets'],
  alternatives: ['pm.scaled.less', 'pm.scaled.nexus', 'pm.scaled.spotify', 'pm.scaled.critique'],
  hybrid: ['pm.scaled.stagegate', 'pm.scaled.longlead', 'pm.scaled.integration', 'pm.scaled.hybridgov'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.scaled has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// the world is field film 4's (films/pm.field.it) and pm.agile.intro's: the new MES for the orders on the floor, you lead the IT
// project for the plant manager, the IT team builds it; field film 4's Scaling station: one team is too small for the whole MES
has('pm.scaled.why', ['Eén Scrum-team telt meestal hooguit tien mensen', 'toch loopt het geheel vast, omdat team A wacht op werk van team B']);
has('pm.scaled.why', ['One Scrum team usually has ten people at most', 'the whole still gets stuck, because team A waits for work from team B'], 'en');
// s2: a dependency, the Agile Release Train (a team of agile teams that stays together), the cadence (one fixed rhythm for all);
// the tools (PI Planning, the ART Planning Board, which hold the dependencies)
has('pm.scaled.why', ['Dat heet een afhankelijkheid', 'Het hart van SAFe is de Agile Release Train', 'dat lang bij elkaar blijft en samen één of meer producten ontwikkelt en levert', 'Die vaste tijden heten de cadans', 'het vaste ritme waarin alle teams tegelijk plannen, bouwen en opleveren']);
has('pm.scaled.why', ['That is called a dependency', 'The heart of SAFe is the Agile Release Train', 'a team of agile teams that stays together for a long time and jointly develops and delivers one or more products', 'Those fixed times are the cadence', 'the fixed rhythm in which all teams plan, build and deliver at the same time'], 'en');
has('pm.scaled.piplanning', ['PI Planning', 'ART Planning Board']);
has('pm.scaled.piplanning', ['PI Planning', 'ART Planning Board'], 'en');
// s3: the portfolio (all development investments, new products, improvements, IT systems), project funding (own budget, a
// temporary team) against funding the train (the work comes to the train), strategic themes (a few goals that steer the
// choices); the tools (a Lean business case, WSJF)
has('pm.scaled.lpm', ['Een portfolio is het geheel van alle ontwikkelinvesteringen', 'elk project schrijft een businesscase, krijgt in een jaarronde een budget, stelt een team samen', 'SAFe financiert die ontwikkelwaardestromen, niet losse projecten. De trein heeft een budget; het werk komt naar de trein', 'Richting komt uit strategische thema’s', 'Projectfinanciering', 'Strategische thema’s']);
has('pm.scaled.lpm', ['A portfolio is the whole of an organisation’s or division’s development investments', 'each project writes a business case, gets a budget in an annual round, assembles a team', 'SAFe funds those development value streams, not separate projects. The train has a budget; the work comes to the train', 'Direction comes from strategic themes', 'Project funding', 'Strategic themes'], 'en');
has('pm.scaled.epics', ['Lean business case']);
has('pm.scaled.epics', ['Lean business case'], 'en');
has('pm.scaled.wsjf', ['WSJF, Weighted Shortest Job First']);
has('pm.scaled.wsjf', ['WSJF, Weighted Shortest Job First'], 'en');
// s4: LeSS takes things away (one Product Owner, one Product Backlog for the whole product), feature teams (a customer function
// from start to finish, through all layers); the tools (Sprint Planning One of LeSS, Cross-Team Refinement of Nexus)
has('pm.scaled.less', ['Het idee is het omgekeerde van een raamwerk met veel lagen: haal zo veel mogelijk weg', 'Eén Product Owner, één Product Backlog voor het hele product', 'LeSS vraagt feature teams: teams die een klantfunctie van begin tot eind bouwen, door alle lagen heen', 'Sprint Planning One']);
has('pm.scaled.less', ['The idea is the opposite of a framework with many layers: take away as much as possible', 'One Product Owner, one Product Backlog for the whole product', 'LeSS asks for feature teams: teams that build a customer function from start to finish, through all layers', 'Sprint Planning One'], 'en');
has('pm.scaled.nexus', ['Nexus', 'Cross-Team Refinement']);
has('pm.scaled.nexus', ['Nexus', 'Cross-Team Refinement'], 'en');
// s5: the cost of change rises for hardware, stage-gate (stages, a gate between them where management decides), sprints
// inside the stages; the hardware of the story (the MES has interfaces with the scales; pm.itproject.tco); the tools
// (backward planning, a design freeze)
has('pm.itproject.tco', ['koppelingen met het MES, de weegschalen']);
has('pm.itproject.tco', ['interfaces with the MES, the scales'], 'en');
has('pm.scaled.stagegate', ['Het werk loopt in fases', 'Tussen de fases zit een gate: een beslismoment waar het management', 'De kosten van verandering (cost of change) stijgen naarmate je verder bent', 'De sprints, dagelijkse korte overleggen, demo’s en retrospectives zitten in de fases; de gates blijven voor de grote investeringsbeslissingen']);
has('pm.scaled.stagegate', ['The work runs in stages', 'Between the stages sits a gate: a decision moment where management chooses', 'The cost of change rises the further along you are', 'The sprints, short daily meetings, demos and retrospectives sit inside the stages; the gates stay for the big investment decisions'], 'en');
has('pm.scaled.longlead', ['Terugplannen', 'Design freeze']);
has('pm.scaled.longlead', ['Backward planning', 'Design freeze'], 'en');
// s6: what scaling is
has('pm.scaled.why', ['Opschalen (scaling) betekent: afspraken waarmee veel teams als één geheel leveren']);
has('pm.scaled.why', ['Scaling means agreements that let many teams deliver as one'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.scaled.why', 'Waarom opschalen'], ['pm.scaled.lpm', 'waardestromen'], ['pm.scaled.less', 'LeSS'], ['pm.scaled.stagegate', 'Stage-gate'],
  ['pm.scaled.piplanning', 'PI Planning'], ['pm.scaled.epics', 'Epics'], ['pm.scaled.nexus', 'Nexus'], ['pm.scaled.longlead', 'Lange levertijden'],
  ['pm.scaled.roles', 'De rollen'], ['pm.scaled.wsjf', 'WSJF'], ['pm.scaled.spotify', 'Spotify-model'], ['pm.scaled.integration', 'Integratiepunten'],
  ['pm.scaled.configs', 'De vier configuraties'], ['pm.scaled.budgets', 'Lean budgets'], ['pm.scaled.critique', 'Kritiek op SAFe'], ['pm.scaled.hybridgov', 'hybride aanpak inrichten']]) has(id, [word]);
for (const [id, word] of [['pm.scaled.why', 'Why scale'], ['pm.scaled.lpm', 'value streams'], ['pm.scaled.less', 'LeSS'], ['pm.scaled.stagegate', 'Stage-gate'],
  ['pm.scaled.piplanning', 'PI Planning'], ['pm.scaled.epics', 'Epics'], ['pm.scaled.nexus', 'Nexus'], ['pm.scaled.longlead', 'Long lead times'],
  ['pm.scaled.roles', 'The roles'], ['pm.scaled.wsjf', 'WSJF'], ['pm.scaled.spotify', 'Spotify model'], ['pm.scaled.integration', 'Integration points'],
  ['pm.scaled.configs', 'The four configurations'], ['pm.scaled.budgets', 'Lean budgets'], ['pm.scaled.critique', 'Criticism of SAFe'], ['pm.scaled.hybridgov', 'hybrid approach']]) has(id, [word], 'en');
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

// the topic titles: "Alternatieven en kritiek" has a word (Alternatieven) wider than the default 128-unit tile, so, as
// pm.agile.intro, the film declares tileUnits = the room of its narrowest title box, the closing grid's tile (GRID.tile - 12
// units of text, up to three lines), and every title box of the stage wraps with D.tileUnits (the kit's checkLabels holds the
// titles to it too, also after a rename without a rebuild)
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
// the hardware of the lines, in the hardware topic: a weighing scale at the front of each line (the MES has interfaces with
// the scales): a low base and a plate on it
const scale = (x, y) => w.box({ x, y, w: 34, d: 24, r: 2 }, 0, 9, { tone: 'lo' }, { steps: 2 }) + w.box({ x: x + 2, y: y + 2, w: 30, d: 20, r: 1.5 }, 9, 14, { tone: 'hi' }, { steps: 2 });

// the people: the plant manager (the sponsor) is the pm cast; the first IT team (two Developers) and the second IT team
// (two Developers) are pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('hw', cueG('scales', scale(92, 56) + scale(204, 56))),
  g('pp-team2', scrumPerson(w, k, G, P, { x: 178, y: 104, key: 'team2', look: 'dev2', along: 'x' }) + scrumPerson(w, k, G, P, { x: 214, y: 112, key: 'team2', look: 'dev', along: 'x' })),
  g('pp-devs', scrumPerson(w, k, G, P, { x: 84, y: 96, key: 'devs', look: 'dev2', along: 'x' }) + scrumPerson(w, k, G, P, { x: 116, y: 96, key: 'devs', look: 'dev', along: 'x' })),
  g('pp-sponsor', person('sponsor', 36, 150, 'y')),
  cueG('mes', w.table(MESTAB) + w.laptop({ x: MESTAB.x + MESTAB.w / 2, y: MESTAB.y + MESTAB.d / 2, z: MESTAB.h, toward: 1 })),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has two tool chips (tool1, tool2) for the two
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Opschalen is a cue group of its own (map-scaled).
const tiles = ['tSafe', 'tPort', 'tAlt', 'tHyb'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('team', g('teamB', ''))
  + cueG('dep', g('depB', '')) + cueG('train', g('trainB', '')) + cueG('cadence', g('cadB', ''))
  + cueG('plist', g('plistB', '')) + cueG('fund', g('fundB', '')) + cueG('themes', g('themesB', ''))
  + cueG('opts', g('optsB', '')) + cueG('less', g('lessB', '')) + cueG('feat', g('featB', ''))
  + cueG('cost', g('costB', '')) + cueG('stages', g('stagesB', '')) + cueG('sprints', g('sprintsB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Opschalen lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.scaled'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const SCALED_PLACE = pmMap.places.find((p) => p.module === 'pm.scaled');
const MAPZ = [SCALED_PLACE.x + SCALED_PLACE.w / 2, SCALED_PLACE.y + SCALED_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.scaled')}"`), 'the map lights pm.scaled as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, the MES and the first IT team
  { from: cam(130, 100, 70, 1.08), to: cam(135, 100, 70, 1.12) }, // s2 two IT teams at the floor
  { from: cam(100, 115, 70, 1.1), to: cam(95, 120, 70, 1.15) }, // s3 the plant manager at the MES table
  { from: cam(130, 100, 70, 1.08), to: cam(135, 100, 70, 1.12) }, // s4 the two teams
  { from: cam(150, 80, 40, 1.08), to: cam(145, 85, 40, 1.12) }, // s5 the lines with their scales, the plant manager
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.scaled.intro',
  title: { nl: 'Eén MES, meer teams', en: 'One MES, more teams' },
  module: 'pm.scaled',
  // the room of text in the narrowest title box (the closing grid's tile), see the module section above
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.scaled, the scene that explains it and its tile
  topics: {
    safe: { scene: 's2', cue: 'tSafe' },
    portfolio: { scene: 's3', cue: 'tPort' },
    alternatives: { scene: 's4', cue: 'tAlt' },
    hybrid: { scene: 's5', cue: 'tHyb' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Het nieuwe MES moet naar meer lijnen. Eén IT-team is te klein voor het hele systeem.', en: 'The new MES has to go to more lines. One IT team is too small for the whole system.', focus: ['goal', 'line3', 'line4', 'mes', 'devs'] },
        { nl: 'Jij leidt het project voor de plantmanager. Er komen meer IT-teams bij.', en: 'You lead the project for the plant manager. More IT teams join.', focus: ['team', 'sponsor', 'devs', 'team2'] },
        { nl: 'We volgen dit project langs de vier onderwerpen van de module.', en: 'We follow this project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'SAFe-basis', en: 'SAFe basics' },
      beats: [
        { nl: 'Eerste onderwerp: SAFe-basis. Hoe laat je veel teams als één geheel werken?', en: 'First topic: SAFe basics. How do you make many teams work as one whole?', focus: ['tSafe', 'devs', 'team2'] },
        { nl: 'Elk team werkt prima en toch loopt het vast. Team A wacht op team B, een {t:Afhankelijkheid|afhankelijkheid}.', en: 'Each team works fine and still it gets stuck. Team A waits for team B, a {t:Dependency|dependency}.', cue: { Afhankelijkheid: 'dep' }, focus: ['dep', 'devs', 'team2'] },
        { nl: 'SAFe zet de teams in een trein, de {t:Agile Release Train|Agile Release Train}. Ze blijven lang bij elkaar.', en: 'SAFe puts the teams on a train, the {t:Agile Release Train|Agile Release Train}. They stay together for long.', cue: { 'Agile Release Train': 'train' }, focus: ['train', 'devs', 'team2'] },
        { nl: 'De trein heeft één vast ritme, de {t:Cadans|cadans}. Alle teams plannen en leveren tegelijk.', en: 'The train has one fixed rhythm, the {t:Cadence|cadence}. All teams plan and deliver together.', cue: { Cadans: 'cadence' }, focus: ['cadence', 'devs', 'team2'] },
        { nl: 'Bij SAFe gebruiken we vaak {t:PI Planning|PI Planning} en het {t:ART Planning Board|ART Planning Board}.', en: 'For SAFe we often use {t:PI Planning|PI Planning} and the {t:ART Planning Board|ART Planning Board}.', cue: { 'PI Planning': 'tool1', 'ART Planning Board': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Portfolio en Lean budgets', en: 'Portfolio and Lean budgets' },
      beats: [
        { nl: 'Tweede onderwerp: Portfolio en Lean budgets. Welk werk krijgt de teams, en wie betaalt dat?', en: 'Second topic: Portfolio and Lean budgets. Which work do the teams get, and who pays for it?', focus: ['tPort', 'sponsor'] },
        { nl: 'Alle ontwikkelinvesteringen van de fabriek samen heten het {t:Portfolio|portfolio}. Het MES is er één van.', en: 'All the development investments of the plant together are called the {t:Portfolio|portfolio}. The MES is one of them.', cue: { Portfolio: 'plist' }, focus: ['plist', 'sponsor'] },
        { nl: 'Bij {t:Projectfinanciering|projectfinanciering} krijgt elk project een eigen budget. SAFe financiert de trein.', en: 'With {t:Project funding|project funding} each project gets its own budget. SAFe funds the train.', cue: { Projectfinanciering: 'fund' }, focus: ['fund', 'sponsor'] },
        { nl: 'De plantmanager kiest een paar {t:Strategische thema’s|strategische thema’s}. Die wijzen de richting voor de keuzes.', en: 'The plant manager picks a few {t:Strategic themes|strategic themes}. They give the direction for the choices.', cue: { 'Strategische thema’s': 'themes' }, focus: ['themes', 'sponsor'] },
        { nl: 'Bij het portfolio gebruiken we vaak een {t:Lean business case|Lean business case} en {t:WSJF|WSJF}.', en: 'For the portfolio we often use a {t:Lean business case|Lean business case} and {t:WSJF|WSJF}.', cue: { 'Lean business case': 'tool1', WSJF: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Alternatieven en kritiek', en: 'Alternatives and criticism' },
      beats: [
        { nl: 'Derde onderwerp: Alternatieven en kritiek. SAFe is niet de enige weg, er zijn ook LeSS en Nexus.', en: 'Third topic: Alternatives and criticism. SAFe is not the only way, there are also LeSS and Nexus.', focus: ['tAlt', 'opts', 'devs', 'team2'] },
        { nl: '{t:LeSS|LeSS} haalt juist dingen weg. Alle teams delen één Product Owner en één backlog.', en: '{t:LeSS|LeSS} takes things away instead. All teams share one Product Owner and one backlog.', cue: { LeSS: 'less' }, focus: ['less', 'devs', 'team2'] },
        { nl: 'Het werkt met {t:Feature teams|feature teams}. Zo’n team bouwt een klantfunctie van begin tot eind.', en: 'It works with {t:Feature teams|feature teams}. Such a team builds a customer function from start to finish.', cue: { 'Feature teams': 'feat' }, focus: ['feat', 'devs', 'team2'] },
        { nl: 'Bij alternatieven horen onder meer {t:Sprint Planning One|Sprint Planning One} van LeSS en {t:Cross-Team Refinement|Cross-Team Refinement} van Nexus.', en: 'Alternatives include {t:Sprint Planning One|Sprint Planning One} of LeSS and {t:Cross-Team Refinement|Cross-Team Refinement} of Nexus.', cue: { 'Sprint Planning One': 'tool1', 'Cross-Team Refinement': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Hybride: stage-gate plus agile', en: 'Hybrid: stage-gate plus agile' },
      beats: [
        { nl: 'Vierde onderwerp: Hybride: stage-gate plus agile. Wat als er ook hardware bij komt?', en: 'Fourth topic: Hybrid: stage-gate plus agile. What if hardware joins in?', focus: ['tHyb', 'line3', 'line4'] },
        { nl: 'Het MES koppelt met weegschalen. Bij hardware stijgen de {t:Kosten van verandering|kosten van verandering}.', en: 'The MES links to scales. With hardware the {t:Cost of change|cost of change} rises.', cue: { 'Kosten van verandering': 'cost' }, focus: ['scales', 'cost'] },
        { nl: 'In {t:Stage-gate|stage-gate} werk je in fases. Bij elke {t:Gate|gate} beslist de plantmanager of het doorgaat.', en: 'In {t:Stage-gate|stage-gate} you work in stages. At each {t:Gate|gate} the plant manager decides whether it goes on.', cue: { 'Stage-gate': 'stages', Gate: 'stages' }, focus: ['stages', 'sponsor'] },
        { nl: 'Binnen elke fase werken de teams in sprints. De gates blijven voor de grote beslissingen.', en: 'Within each stage the teams work in sprints. The gates stay for the big decisions.', focus: ['sprints', 'stages', 'devs', 'team2'] },
        { nl: 'Bij hybride werken gebruiken we vaak {t:Terugplannen|terugplannen} en een {t:Design freeze|design freeze}.', en: 'For hybrid work we often use {t:Backward planning|backward planning} and a {t:Design freeze|design freeze}.', cue: { Terugplannen: 'tool1', 'Design freeze': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. De trein, de volgorde, andere wegen en de hardware.', en: 'It connects. The train, the order, other ways and the hardware.', focus: ['flow', 'mes'] },
        { nl: 'Opschalen betekent afspraken waarmee veel teams als één geheel leveren.', en: 'Scaling means agreements that let many teams deliver as one.', focus: ['decision', 'devs', 'team2'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Opschalen is het tweede station van IT en agile.', en: 'The map of Projects: Scaling is the second station of IT and agile.', focus: mapCue('pm.scaled') },
        { nl: 'Opschalen heeft vier onderwerpen, elk met vier niveaus.', en: 'Scaling has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij SAFe-basis. Op niveau Basis: waarom opschalen, waardestromen, LeSS en stage-gate.', en: 'Start with SAFe basics. At Basics level: why scale, value streams, LeSS and stage-gate.', focus: ['tSafe', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen PI Planning, epics, Nexus en lange levertijden erbij.', en: 'At Working knowledge you add PI Planning, epics, Nexus and long lead times.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen de rollen, het scoren met WSJF, het Spotify-model en integratiepunten erbij.', en: 'At Advanced you add the roles, scoring with WSJF, the Spotify model and integration points.', focus: 'lv3' },
        { nl: 'Op Expert komen de vier configuraties, Lean budgets, de kritiek op SAFe en hybride sturing erbij.', en: 'At Expert you add the four configurations, Lean budgets, the criticism of SAFe and steering a hybrid approach.', focus: 'lv4' },
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
// explaining them (WSJF, an opaque acronym, gets one clause, as PI Planning does).
// Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex); the
// film adds the one self-contained SAY group of films/_kit/timeline.mjs it needs.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Het nieuwe MES, het systeem dat de orders op de vloer aanstuurt, moet naar meer lijnen. Eén IT-team is te klein voor het hele systeem.',
      en: 'The new MES, the system that runs the orders on the floor, has to go to more lines. One IT team is too small for the whole system.' },
    { nl: 'Jij leidt het project voor de plantmanager. Er komen meer IT-teams bij.',
      en: 'You lead the project for the plant manager. More IT teams join.' },
    { nl: 'We volgen dit project langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this project through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 SAFe basics
    { nl: 'Het eerste onderwerp is SAFe-basis. Hoe laat je veel teams als één geheel werken?',
      en: 'The first topic is SAFe basics. How do you make many teams work as one whole?' },
    { nl: 'Elk team kan prima werken en toch loopt het vast. Team A wacht op team B. Dat heet een {t:Afhankelijkheid|afhankelijkheid}.',
      en: 'Each team can work fine and the whole still gets stuck. Team A waits for team B. That is called a {t:Dependency|dependency}.' },
    { nl: 'SAFe zet de teams in een trein, de {t:Agile Release Train|Agile Release Train}. De teams blijven lang bij elkaar en bouwen samen één product.',
      en: 'SAFe puts the teams on a train, the {t:Agile Release Train|Agile Release Train}. The teams stay together for a long time and build one product together.' },
    { nl: 'De trein werkt op één vast ritme, de {t:Cadans|cadans}. Alle teams plannen, bouwen en leveren op dezelfde momenten.',
      en: 'The train works to one fixed rhythm, the {t:Cadence|cadence}. All teams plan, build and deliver at the same moments.' },
    { nl: 'Bij SAFe gebruiken we vaak PI Planning, de planning met alle teams, en het ART Planning Board.',
      en: 'For SAFe we often use PI Planning, the planning with all teams, and the ART Planning Board.' },
  ],
  [ // s3 portfolio and Lean budgets
    { nl: 'Het tweede onderwerp is Portfolio en Lean budgets. Welk werk krijgt de teams, en wie betaalt dat?',
      en: 'The second topic is Portfolio and Lean budgets. Which work do the teams get, and who pays for it?' },
    { nl: 'Alle ontwikkelinvesteringen van de fabriek samen heten het {t:Portfolio|portfolio}. Het MES is er één van.',
      en: 'All the development investments of the plant together are called the {t:Portfolio|portfolio}. The MES is one of them.' },
    { nl: 'Bij {t:Projectfinanciering|projectfinanciering} krijgt elk project een eigen budget en een tijdelijk team. SAFe financiert de trein, en het werk komt naar de trein.',
      en: 'With {t:Project funding|project funding} each project gets its own budget and a temporary team. SAFe funds the train, and the work comes to the train.' },
    { nl: 'De plantmanager kiest een paar {t:Strategische thema’s|strategische thema’s}. Die wijzen de richting voor de keuzes.',
      en: 'The plant manager picks a few {t:Strategic themes|strategic themes}. They give the direction for the choices.' },
    { nl: 'Bij het portfolio gebruiken we vaak een Lean business case en WSJF, een formule voor de volgorde.',
      en: 'For the portfolio we often use a Lean business case and WSJF, a formula for the order.' },
  ],
  [ // s4 alternatives and criticism
    { nl: 'Het derde onderwerp is Alternatieven en kritiek. SAFe is niet de enige weg, er zijn ook LeSS en Nexus.',
      en: 'The third topic is Alternatives and criticism. SAFe is not the only way, there are also LeSS and Nexus.' },
    { nl: '{t:LeSS|LeSS} haalt juist dingen weg. Alle teams delen één Product Owner en één backlog.',
      en: '{t:LeSS|LeSS} takes things away instead. All teams share one Product Owner and one backlog.' },
    { nl: 'Het werkt met {t:Feature teams|feature teams}. Zo’n team bouwt een klantfunctie van begin tot eind.',
      en: 'It works with {t:Feature teams|feature teams}. Such a team builds a customer function from start to finish.' },
    { nl: 'Bij alternatieven horen onder meer Sprint Planning One van LeSS en Cross-Team Refinement van Nexus.',
      en: 'Alternatives include Sprint Planning One of LeSS and Cross-Team Refinement of Nexus.' },
  ],
  [ // s5 hybrid, stage-gate plus agile
    { nl: 'Het vierde onderwerp is Hybride, stage-gate plus agile. Wat als er ook hardware bij komt?',
      en: 'The fourth topic is Hybrid, stage-gate plus agile. What if hardware joins in?' },
    { nl: 'Het MES krijgt een koppeling met weegschalen op de lijnen. Dat is hardware, en bij hardware stijgen de {t:Kosten van verandering|kosten van verandering} snel.',
      en: 'The MES gets a link to scales on the lines. That is hardware, and with hardware the {t:Cost of change|cost of change} rises fast.' },
    { nl: 'In {t:Stage-gate|stage-gate} werk je in fases. Tussen twee fases zit een {t:Gate|gate}, daar beslist de plantmanager of het doorgaat.',
      en: 'In {t:Stage-gate|stage-gate} you work in stages. Between two stages sits a {t:Gate|gate}, where the plant manager decides whether it goes on.' },
    { nl: 'Binnen elke fase werken de teams in sprints. De gates blijven voor de grote beslissingen.',
      en: 'Within each stage the teams work in sprints. The gates stay for the big decisions.' },
    { nl: 'Bij hybride werken gebruiken we vaak terugplannen en een design freeze, het vastleggen van het ontwerp.',
      en: 'For hybrid work we often use backward planning and a design freeze, fixing the design.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. SAFe-basis geeft de trein, het portfolio de volgorde, de alternatieven andere wegen en hybride werken de hardware.',
      en: 'It all connects. SAFe basics gives the train, the portfolio the order, the alternatives other ways and hybrid work the hardware.' },
    { nl: 'Opschalen betekent afspraken waarmee veel teams als één geheel leveren.',
      en: 'Scaling means agreements that let many teams deliver as one.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Opschalen is het tweede station van IT en agile.',
      en: 'This is the map of Projects. Scaling is the second station of IT and agile.' },
    { nl: 'Opschalen heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Scaling has four topics, each with four levels.' },
    { nl: 'Begin bij SAFe-basis. Op niveau Basis gaat het over waarom opschalen, waardestromen, LeSS en stage-gate.',
      en: 'Start with SAFe basics. At Basics level it is about why scale, value streams, LeSS and stage-gate.' },
    { nl: 'Op Werkkennis komen PI Planning, epics, Nexus en lange levertijden erbij.',
      en: 'At Working knowledge you add PI Planning, epics, Nexus and long lead times.' },
    { nl: 'Op Gevorderd komen de rollen, het scoren met WSJF, het Spotify-model en integratiepunten erbij.',
      en: 'At Advanced you add the roles, scoring with WSJF, the Spotify model and integration points.' },
    { nl: 'Op Expert komen de vier configuraties, Lean budgets, de kritiek op SAFe en hybride sturing erbij.',
      en: 'At Expert you add the four configurations, Lean budgets, the criticism of SAFe and steering a hybrid approach.' },
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
const PEOPLE = ':is([data-cue="sponsor"],[data-cue="team2"],[data-cue="devs"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait, zoals in het vierde veldfilmpje, IT en agile. Op de vloer lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, aan de zijwand een kalender en voorin een tafel met een laptop: het nieuwe MES. Per onderwerp komen er mensen bij: het eerste IT-team bij de tafel, een tweede IT-team op de vloer en de plantmanager; in het onderwerp over hardware staan er weegschalen voor de lijnen. Rechts een paneel, gemarkeerd als voorbeeld of schema: het nieuwe MES en wie wat doet; twee teams waarvan er een wacht op het ander, vier teams op één trein en een vast ritme van vijf rondes; een portfolio met drie soorten werk, een project met een eigen budget tegenover een trein met een vast budget en de richting van strategische thema’s; drie keuzes voor opschalen en bij LeSS één backlog voor drie teams en een feature team van begin tot eind; stijgende kosten van een wijziging, drie fases met een gate ertussen en sprints binnen de fases; en per onderwerp twee namen van hulpmiddelen. Aan het eind de kaart van Projecten met Opschalen verlicht, en de vier onderwerpen met hun vier niveaus.',
  en: 'Hall B of the plant, where line 3 runs, as in the fourth field film, IT and agile. On the floor line 3 in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, on the side wall a calendar and at the front a table with a laptop: the new MES. Each topic brings people: the first IT team at the table, a second IT team on the floor and the plant manager; in the topic on hardware there are scales at the lines. At the right a panel, marked as an example or a diagram: the new MES and who does what; two teams one of which waits for the other, four teams on one train and a fixed rhythm of five rounds; a portfolio with three kinds of work, a project with its own budget against a train with a fixed budget and the direction of strategic themes; three choices for scaling and, at LeSS, one backlog for three teams and a feature team from start to finish; a rising cost of change, three stages with a gate between them and sprints within the stages; and per topic two names of tools. At the end the map of Projects with Scaling lit, and the four topics with their four levels.',
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

// Dev tool, not shipped. Builds the module intro film "Vier projecten, twee engineers / Four projects,
// two engineers" for Programma’s en governance (pm.portfolio), the tenth module intro film (v17) and the
// first of the cluster "Portfolio en advies": the high-over picture at the top of the module, before its
// four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.portfolio.intro/build.mjs            build the page
//   node films/pm.portfolio.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.portfolio.intro.html: one offline page with the anatomy kit, the
// stage script and the player inlined. The index names it (pm.portfolio's `intro`), coursehome shows it
// above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro) and of the reviewed intros after it
// (films/pm.run.intro, pm.negotiate.intro, pm.outside.intro): ONE concrete story travels through the whole
// module, the map before the detail, no calculations. The world of field film 3 (films/pm.field.portfolio),
// whose station for this module this intro agrees with: line 3 stands in hall B (the project is done, it
// was one of four projects of this year), the other three are a readiness check, a planning tool and a
// new materials process, and the plant manager (the sponsor of the world) is advised by you. The station's
// two tools, a capacity line and a decision log, are named here too. The same hall as the other films,
// with the cast this module needs: the sponsor (the plant manager), the team lead of the line and the two
// process engineers (pm.agile.scrum's developers). The story is drawn in the room:
//   s1 line 3 stands in hall B, the first of four projects of this year; the other three need the same two
//      process engineers and the same money; you advise the plant manager; the four topics
//   s2 Programma’s: the readiness check, the planning tool and the materials process reach one goal
//      together, fewer cancelled jobs, and none of them alone: a programme; line 3's move is not part of it
//      (drop it and the goal still holds, it belongs in the portfolio); every project reports green on its
//      own plan, so you report the goal's number every month        → pm.portfolio.programme
//   s3 Prioriteren en capaciteit: the bottleneck is the two process engineers, not the money; count their
//      days, not the headcount; no bare no but "not now, and this is what it would push out"
//                                                                    → pm.portfolio.prioritise
//   s4 Governance en sturen: who decides what is agreed in advance; the project lead inside the margins,
//      the steering group beyond, the board on strategy; decisions on the agenda, not updates
//                                                                    → pm.portfolio.governance
//   s5 Baten: the readiness check going live is an output, the benefit comes later; the managers who run
//      the plant own it, not the project lead, who leaves; without anyone watching the old way creeps back
//                                                                    → pm.portfolio.benefits
//   s6 one whole: programme, capacity, decision, benefits; the line falls under the materials process, which
//      starts later, the steering group records it, and someone keeps following the benefits
//   s7 the shared Projects map with Programma’s en governance lit, then the module's four topics with their
//      levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.portfolio.programme, .prioritise, .governance, .benefits).
// Each topic scene names the tools of that topic's BASIS lesson in one short sentence, without explaining them
// (Merijn's checkpoint, 14 Nov), each a term of that lesson: a programme board (programme); a capacity line
// (prioritise, as field film 3 names it); decision rights and a decision log (governance; the decision log is
// field film 3's tool for this module, the run and stuck intros name it for their own topics, the list of decision
// rights is this topic's own); a baseline and a benefit owner (benefits; the baseline is also the intake and close
// intros' tool, here it is what lets benefits be shown at all). MSP, the capacity matrix and the benefits map
// are Werkkennis lessons, so they are what the closing map says that level adds (as pm.lead.intro does for its
// Werkkennis methods), and no Basis scene names them. s7 names what each later level adds and nothing a scene
// explained or named. Terms come from the
// module's lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs);
// the kit holds the film to its map (every topic named in a caption of its own scene, explained in two beats
// and lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor and the team lead from its
// cast, the two process engineers with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs), and the things
// of hall B from the pilot (../pm.plan.intro/hall.mjs, imported, not copied). A panel at the right, in stage
// space, draws each step as a schema, labelled "voorbeeld" (the plant's story) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.portfolio');
const LEVELS = {
  programmes: ['pm.portfolio.programme', 'pm.portfolio.msp', 'pm.portfolio.dependencies', 'pm.portfolio.tranches'],
  priorities: ['pm.portfolio.prioritise', 'pm.portfolio.capacity', 'pm.portfolio.costofdelay', 'pm.portfolio.balance'],
  governance: ['pm.portfolio.governance', 'pm.portfolio.gates', 'pm.portfolio.boardroom', 'pm.portfolio.assurance'],
  benefits: ['pm.portfolio.benefits', 'pm.portfolio.benefitsmap', 'pm.portfolio.tracking', 'pm.portfolio.realism'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.portfolio has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// a tool is a term of its lesson (a method the lesson teaches, in its glossary), in both languages
const isTerm = (id, term, lang) => assert((lessons[lang].get(id).terms || []).some((t) => t.term === term), `${id} (${lang}) has no term "${term}"`);
// s2: a programme is a group of projects run together because they deliver one outcome none of them reaches alone
// (the lesson's own example: a readiness check, a new materials process and a planning-tool change); drop one
// project and the goal still holds, and it belongs in the portfolio, the full list of projects competing for the
// same money and people, not in this programme; watermelon reporting: every project reports green on its own plan
// while the shared goal does not move, so report the outcome number itself every month, next to the project
// statuses; the tool: the programme board (pm.portfolio.programme, Basis)
has('pm.portfolio.programme', ['Een programma is een groep projecten die je samen stuurt omdat ze één uitkomst leveren die geen van hen alleen haalt', 'een gereedheidscheck, een nieuw materiaalproces én een aanpassing in de planningstool', 'kun je één project schrappen en blijft het doel overeind, dan hoort het in het portfolio, de hele lijst projecten die om hetzelfde geld en dezelfde mensen strijden', 'Elk project meldt groen op zijn eigen plan terwijl het gezamenlijke doel niet beweegt', 'rapporteer elke maand het uitkomstgetal zelf, naast de projectstatussen']);
has('pm.portfolio.programme', ['A programme is a group of projects run together because they deliver one outcome none of them reaches alone', 'a readiness check, a new materials process and a planning-tool change', 'if you can drop one project and the goal still holds, it belongs in the portfolio, the full list of projects competing for the same money and people', 'Each project reports green against its own plan while the shared goal doesn’t move', 'report the outcome number itself every month, next to the project statuses'], 'en');
isTerm('pm.portfolio.programme', 'Programmaraad', 'nl');
isTerm('pm.portfolio.programme', 'Programme board', 'en');
// s3: the bottleneck limits how much gets done, usually a few scarce experts and not money (the lesson's two
// process engineers); count the scarce people, not the headcount; saying no at portfolio level is never a bare
// no, it is "not now, and here is what it would push out"; the tool: the capacity line (pm.portfolio.prioritise,
// Basis, as field film 3 names it)
has('pm.portfolio.prioritise', ['De bottleneck is wat bepaalt hoeveel er af komt: meestal een paar schaarse experts, niet geld', 'twee procesengineers', 'Tel de schaarse mensen, niet de headcount', 'is nooit een kaal nee', 'wat het zou verdringen']);
has('pm.portfolio.prioritise', ['The bottleneck is the resource that limits how much gets done: usually a few scarce experts, not money', 'two process engineers', 'Count the scarce people, not the headcount', 'is never a bare no', 'what it would push out'], 'en');
isTerm('pm.portfolio.prioritise', 'Capaciteitsstreep', 'nl');
isTerm('pm.portfolio.prioritise', 'Capacity line', 'en');
// s4: governance is the set of agreements on who decides what, made in advance, for scope, budget, timeline and
// people; the project lead decides within the margins, the steering group beyond, the board on anything that
// touches strategy; a steering group that decides has decisions on the agenda, not updates, and cancels the
// meeting when there is none; the minutes are a decision log; the tools: decision rights and the decision log (pm.portfolio.governance,
// Basis, as field film 3 names it; the run and stuck intros name it for their own topics)
has('pm.portfolio.governance', ['Governance is het geheel van afspraken over wie wat beslist, vooraf vastgelegd', 'voor scope, budget, planning en mensen', 'de projectleider beslist binnen 10% op budget en twee weken op planning; daarbuiten beslist de stuurgroep', 'beslist de directie', 'Op de agenda staan besluiten, geen updates', 'zeg het overleg dan af', 'De notulen zijn een besluitenlijst']);
has('pm.portfolio.governance', ['Governance is the set of agreements on who decides what, made in advance', 'for scope, budget, timeline and people', 'the project lead decides within 10% on budget and two weeks on timeline; the steering group decides beyond that', 'the board decides', 'The agenda lists decisions, not updates', 'cancel the meeting', 'The minutes are a decision log'], 'en');
isTerm('pm.portfolio.governance', 'Beslisbevoegdheden', 'nl'); isTerm('pm.portfolio.governance', 'Besluitenlijst', 'nl');
isTerm('pm.portfolio.governance', 'Decision rights', 'en'); isTerm('pm.portfolio.governance', 'Decision log', 'en');
// s5: output is what the project delivers (the readiness check going live), the benefit is the measurable gain
// for the organisation; projects deliver outputs, the line, the managers who run daily operations, owns outcomes
// and benefits, and a benefit owner is not the project lead, who leaves; when benefits leak the project closes, the
// team moves on and the old way creeps back within months; the tools: a baseline and a benefit owner
// (pm.portfolio.benefits, Basis, both terms of its glossary)
has('pm.portfolio.benefits', ['Output: wat het project oplevert, zoals de gereedheidscheck die live gaat', 'Baten: de meetbare winst voor de organisatie', 'de lijn, de managers die de dagelijkse operatie draaien, is eigenaar van uitkomsten en baten', 'niet de projectleider, want die vertrekt', 'het project sluit, het team gaat verder, en binnen een paar maanden sluipt de oude manier terug', 'Plan het volgen van de baten voor 6 tot 12 maanden na de livegang']);
has('pm.portfolio.benefits', ['Output: what the project delivers, such as the readiness check going live', 'Benefit: the measurable gain for the organisation', 'the line, the managers who run daily operations, owns outcomes and benefits', 'not the project lead, who leaves', 'the project closes, the team moves on, and the old way creeps back within months', 'Plan benefits tracking for 6–12 months after go-live'], 'en');
isTerm('pm.portfolio.benefits', 'Nulmeting', 'nl'); isTerm('pm.portfolio.benefits', 'Batenhouder', 'nl');
isTerm('pm.portfolio.benefits', 'Baseline', 'en'); isTerm('pm.portfolio.benefits', 'Benefit owner', 'en');
// s7: the later levels, as the lessons are titled or word them (the grid names what each adds, and nothing a scene
// explained or named: no programme board, capacity line, decision rights, decision log, baseline, benefit owner,
// programme, portfolio, bottleneck, output; MSP, the capacity matrix, stage-gates, the benefits map, the dependency
// register, cost of delay, pre-wiring, double counting, change
// saturation, zombie projects, independent assurance and the iron law are named here and nowhere else)
for (const [id, word] of [['pm.portfolio.msp', 'MSP'], ['pm.portfolio.capacity', 'Capaciteitsmatrix'], ['pm.portfolio.gates', 'Stage gate'], ['pm.portfolio.benefitsmap', 'Batenkaart'],
  ['pm.portfolio.dependencies', 'Afhankelijkhedenregister'], ['pm.portfolio.costofdelay', 'Kosten van vertraging'], ['pm.portfolio.boardroom', 'Voorsorteren'], ['pm.portfolio.tracking', 'Dubbeltelling'],
  ['pm.portfolio.tranches', 'Veranderverzadiging'], ['pm.portfolio.balance', 'Zombieproject'], ['pm.portfolio.assurance', 'Onafhankelijke toetsing'], ['pm.portfolio.realism', 'IJzeren wet']]) has(id, [word]);
for (const [id, word] of [['pm.portfolio.msp', 'MSP'], ['pm.portfolio.capacity', 'Capacity matrix'], ['pm.portfolio.gates', 'Stage gate'], ['pm.portfolio.benefitsmap', 'Benefits map'],
  ['pm.portfolio.dependencies', 'Dependency register'], ['pm.portfolio.costofdelay', 'Cost of delay'], ['pm.portfolio.boardroom', 'Pre-wiring'], ['pm.portfolio.tracking', 'Double counting'],
  ['pm.portfolio.tranches', 'Change saturation'], ['pm.portfolio.balance', 'Zombie project'], ['pm.portfolio.assurance', 'Independent assurance'], ['pm.portfolio.realism', 'Iron law']]) has(id, [word], 'en');
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
// the topic titles: the closing grid's tile (GRID.tile less its padding, 178 units) is the narrowest box that draws a
// title, and the route's rows (284 wide) are wider. "Programma’s" (145) and "Governance" (132) are wider than the kit's
// default 128-unit tile, so the film declares tileUnits = the room of the grid's tile (as pm.close.intro and
// pm.agile.intro), the build asserts that no title has a word wider than it and that each wraps in at most three lines;
// every title box wraps with D.tileUnits
const TILE_TEXT = GRID.tile - 12;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the tile`);
}

// ---------------------------------------------------------------- the world (hall B, as field film 3)
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

// where things stand (cm), as in the pilot and field film 3: line 3 on its marked floor at the back wall at the right
// under the switchboard (the project is done), line 4 (which stays) next to it, the power cabinet at the back wall at
// the left with its cable connected
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the sponsor (the plant manager) and the team lead of the line are the pm cast; the two process
// engineers are pm.agile.scrum's developers. Each stands in a cue group; the stage script shows each when the story
// needs it. The engineers stand in front of the cabinet, the sponsor and the team lead on the open floor.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOn', cablePath(false))),
  cueG('switch', g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-engineers', scrumPerson(w, k, G, P, { x: 46, y: 66, key: 'engineers', look: 'dev', along: 'y' }) + scrumPerson(w, k, G, P, { x: 100, y: 88, key: 'engineers', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-teamlead', person('teamlead', 168, 120, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');


// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has up to two tool chips (tool1, tool2) for the
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Programma’s en governance is a cue group of its own
// (map-portfolio).
const tiles = ['tProg', 'tPrio', 'tGov', 'tBen'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('need', g('needB', ''))
  + cueG('pgoal', g('pgoalB', '')) + cueG('pline3', g('pline3B', '')) + cueG('pgreen', g('pgreenB', ''))
  + cueG('bottle', g('bottleB', '')) + cueG('days', g('daysB', '')) + cueG('notnow', g('notnowB', ''))
  + cueG('who', g('whoB', '')) + cueG('levels', g('levelsB', '')) + cueG('agenda', g('agendaB', ''))
  + cueG('chain', g('chainB', '')) + cueG('owner', g('ownerB', '')) + cueG('leak', g('leakB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Programma’s en governance lit, in the stage (the film's closing scene; the stage script moves and fades it)
const PF_PLACE = pmMap.places.find((p) => p.module === 'pm.portfolio');
// The label of this place is as wide as its tile (213 units in Dutch and 218 in English of the tile's 220, at the map's 15-unit
// label), so at the closing zoom its ends touch the tile's edges and its halo. mapSvg is pinned and the app's own, so this film
// sets the two labels at 13 units (inline style on their text) and zooms to 1.7 instead of 1.5: the label is still 22 units
// on the stage (13 * 1.7), the tile is 374 of the stage's 640 wide, and the build asserts the drawing it edits and the room
// that is left on each side of the label; the baseline moves up two units so the descenders keep 4 units clear of the tile's
// bottom border at the larger zoom.
const LABEL_STYLE = 13;
const LABEL_Y = 96; // 2 units up: 7 units under the baseline to the tile's bottom border (103), the plinth ends at 86
const labelNl = '<text class="map-label" text-anchor="middle"><tspan x="210" y="98">Programma’s en governance</tspan></text>';
const labelEn = '<text class="map-label" text-anchor="middle"><tspan x="210" y="98">Programmes and governance</tspan></text>';
const MAP0_SVG = await mapScene({ subject: 'pm', highlight: ['pm.portfolio'] });
assert(MAP0_SVG.split(labelNl).length === 2 && MAP0_SVG.split(labelEn).length === 2, 'the shared map draws the labels of Programma’s en governance as this film expects');
assert(PF_PLACE.x + PF_PLACE.w / 2 === 210, 'the place is centred on x 210, as the labels are');
for (const t of ['Programma’s en governance', 'Programmes and governance']) assert((PF_PLACE.w - (textUnits(t) * LABEL_STYLE) / 22) / 2 >= 14, `"${t}" has 14 units clear on each side of the label at ${LABEL_STYLE} units`);
const fitLabel = (l) => l.replace('<text ', `<text style="font-size:${LABEL_STYLE}px" `).replace('y="98"', `y="${LABEL_Y}"`);
const MAP = MAP0_SVG.replace(labelNl, fitLabel(labelNl)).replace(labelEn, fitLabel(labelEn))
  .replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const MAPZ = [PF_PLACE.x + PF_PLACE.w / 2, PF_PLACE.y + PF_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.portfolio')}"`), 'the map lights pm.portfolio as a cue group');


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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor, then the engineers at the cabinet
  { from: cam(140, 92, 70, 1), to: cam(145, 90, 70, 1.02) }, // s2 the whole hall: the plant manager, the team lead and line 3 on its floor
  { from: cam(70, 80, 60, 1.15), to: cam(78, 84, 60, 1.2) }, // s3 the two process engineers at the cabinet
  { from: cam(100, 110, 70, 1.05), to: cam(105, 112, 70, 1.1) }, // s4 the steering group: the plant manager and the team lead
  { from: cam(120, 100, 70, 1.05), to: cam(125, 100, 70, 1.1) }, // s5 the managers who run the plant
  { from: cam(145, 88, 70, 1), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.portfolio.intro',
  title: { nl: 'Vier projecten, twee engineers', en: 'Four projects, two engineers' },
  module: 'pm.portfolio',
  // the room of text of the narrowest box that draws a topic title (the closing grid's tile, asserted above): every
  // title box wraps with D.tileUnits
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.portfolio, the scene that explains it and its tile
  topics: {
    programmes: { scene: 's2', cue: 'tProg' },
    priorities: { scene: 's3', cue: 'tPrio' },
    governance: { scene: 's4', cue: 'tGov' },
    benefits: { scene: 's5', cue: 'tBen' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Vier projecten, twee engineers', en: 'Four projects, two engineers' },
      beats: [
        { nl: 'Lijn 3 staat in hal B. Het was het eerste van vier projecten dit jaar.', en: 'Line 3 stands in hall B. It was the first of four projects this year.', focus: ['goal', 'line3', 'floor', 'teamlead'] },
        { nl: 'De andere drie willen dezelfde twee procesengineers en hetzelfde geld.', en: 'The other three want the same two process engineers and the same money.', focus: ['need', 'engineers'] },
        { nl: 'Jij adviseert de plantmanager. We volgen het langs de vier onderwerpen.', en: 'You advise the plant manager. We follow it through the four topics.', focus: ['route', 'sponsor'] },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Programma’s', en: 'Programmes' },
      beats: [
        { nl: 'Eerste onderwerp is Programma’s. Drie projecten halen samen één doel, minder afgezegde klussen.', en: 'First topic is Programmes. Three projects reach one goal together, fewer cancelled jobs.', focus: ['tProg', 'pgoal', 'sponsor', 'teamlead'] },
        { nl: 'Lijn 3 hoort er niet bij. Zonder die verhuizing blijft het doel overeind.', en: 'Line 3 is not part of it. Without that move the goal still stands.', focus: ['pline3', 'line3'] },
        { nl: 'Elk project meldt groen, maar het doel beweegt niet. Meld elke maand ook het getal zelf.', en: 'Each project reports green, but the goal does not move. Also report its number every month.', focus: ['pgreen', 'sponsor'] },
        { nl: 'Bij programma’s gebruiken we een {t:Programmaraad|programmaraad}.', en: 'For programmes we use a {t:Programme board|programme board}.', cue: { Programmaraad: 'tool1', 'Programme board': 'tool1' }, focus: ['tool1'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Prioriteren en capaciteit', en: 'Prioritising and capacity' },
      beats: [
        { nl: 'Tweede onderwerp is Prioriteren en capaciteit. Het knelpunt is niet geld maar twee engineers.', en: 'Second topic is Prioritising and capacity. The bottleneck is two engineers, not money.', focus: ['tPrio', 'bottle', 'engineers'] },
        { nl: 'Tel hun dagen, niet het aantal medewerkers. Meer dagen dan dat zijn er niet.', en: 'Count their days, not the headcount. There are no more days than that.', focus: ['days', 'engineers'] },
        { nl: 'Moet een project wachten? Zeg niet nee, maar niet nu, en wat het zou verdringen.', en: 'Must a project wait? Do not say no, but not now, and what it would push out.', focus: ['notnow', 'sponsor'] },
        { nl: 'Bij prioriteren gebruiken we een {t:Capaciteitsstreep|capaciteitsstreep}.', en: 'For prioritising we use a {t:Capacity line|capacity line}.', cue: { Capaciteitsstreep: 'tool1', 'Capacity line': 'tool1' }, focus: ['tool1'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Governance en sturen', en: 'Governance and steering' },
      beats: [
        { nl: 'Derde onderwerp is Governance en sturen. Leg vooraf vast wie wat beslist.', en: 'Third topic is Governance and steering. Agree in advance who decides what.', focus: ['tGov', 'who', 'sponsor', 'teamlead'] },
        { nl: 'De projectleider beslist binnen zijn marges, de stuurgroep daarbuiten en de directie over strategie.', en: 'The project lead decides within the margins, the steering group beyond, the board on strategy.', focus: ['levels'] },
        { nl: 'In de stuurgroep staan besluiten op de agenda, geen updates.', en: 'The steering group has decisions on its agenda, not updates.', focus: ['agenda', 'sponsor'] },
        { nl: 'Bij governance gebruiken we {t:Beslisbevoegdheden|beslisbevoegdheden} en een {t:Besluitenlijst|besluitenlijst}.', en: 'For governance we use {t:Decision rights|decision rights} and a {t:Decision log|decision log}.', cue: { Beslisbevoegdheden: 'tool1', Besluitenlijst: 'tool2', 'Decision rights': 'tool1', 'Decision log': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Baten', en: 'Benefits' },
      beats: [
        { nl: 'Vierde onderwerp is Baten. De check gaat live, maar de baten komen later.', en: 'Fourth topic is Benefits. The check goes live, but the benefits come later.', focus: ['tBen', 'chain', 'teamlead'] },
        { nl: 'De managers die de fabriek draaien zijn eigenaar van de baten, niet de projectleider.', en: 'The managers who run the plant own the benefits, not the project lead.', focus: ['owner', 'sponsor'] },
        { nl: 'Kijkt niemand mee, dan sluipt de oude manier terug. Volg het getal maandenlang.', en: 'If nobody watches, the old way creeps back. Follow the number for months.', focus: ['leak'] },
        { nl: 'Bij baten gebruiken we een {t:Nulmeting|nulmeting} en een {t:Batenhouder|batenhouder}.', en: 'For benefits we use a {t:Baseline|baseline} and a {t:Benefit owner|benefit owner}.', cue: { Nulmeting: 'tool1', Batenhouder: 'tool2', Baseline: 'tool1', 'Benefit owner': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Programma, capaciteit, besluiten en baten.', en: 'It connects. Programme, capacity, decisions and benefits.', focus: ['flow', 'engineers', 'sponsor', 'teamlead'] },
        { nl: 'De streep valt onder het materiaalproces. De stuurgroep legt het vast.', en: 'The capacity line falls under the materials process. The steering group records it.', focus: ['decision', 'sponsor', 'teamlead'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Op de kaart van Projecten is Programma’s en governance het eerste station van Portfolio en advies.', en: 'On the map of Projects, Programmes and governance is the first station of Portfolio and consulting.', focus: mapCue('pm.portfolio') },
        { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.', en: 'This module has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Programma’s, op niveau Basis.', en: 'Start with Programmes, at Basics level.', focus: ['tProg', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen de methode MSP, de capaciteitsmatrix, stage-gates en de batenkaart erbij.', en: 'At Working knowledge you add the MSP method, the capacity matrix, stage-gates and the benefits map.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen het afhankelijkhedenregister, kosten van vertraging, voorsorteren en dubbeltelling erbij.', en: 'At Advanced you add the dependency register, cost of delay, pre-wiring and double counting.', focus: 'lv3' },
        { nl: 'Op Expert komen veranderverzadiging, zombieprojecten, onafhankelijke toetsing en de ijzeren wet erbij.', en: 'At Expert you add change saturation, zombie projects, independent assurance and the iron law.', focus: 'lv4' },
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
// on one short sentence naming the tools of that topic's lessons, without
// explaining them. The Dutch voice says the process engineers as "procesingenieurs" and
// the plant manager only in a phrase that has a SAY rule ("adviseer je de plantmanager"); the
// captions show the lessons' own words (procesengineers, plantmanager).
const SAY = [
  [ // s1 four projects, two engineers
    { nl: 'Lijn 3 staat in hal B. Dat was het eerste van vier projecten dit jaar. De andere drie moeten nog beginnen.',
      en: 'Line 3 stands in hall B. That was the first of four projects this year, and the other three still have to start.' },
    { nl: 'De andere drie hebben dezelfde twee procesingenieurs nodig, en hetzelfde geld. Er is niet genoeg voor alles tegelijk.',
      en: 'The other three need the same two process engineers, and the same money. There is not enough for everything at once.' },
    { nl: 'Nu adviseer je de plantmanager. We volgen dat langs de vier onderwerpen van de module.',
      en: 'Now you advise the plant manager. We follow that through the four topics of the module.' },
  ],
  [ // s2 programmes
    { nl: 'Het eerste onderwerp is programma’s. De gereedheidscheck, de planningstool en het materiaalproces halen samen één doel, minder afgezegde klussen. Geen van de drie haalt dat alleen, dus ze vormen een programma.',
      en: 'The first topic is programmes. The readiness check, the planning tool and the materials process reach one goal together, fewer cancelled jobs. None of the three reaches it alone, so they form a programme.' },
    { nl: 'Lijn 3 hoort er niet bij, want zonder die verhuizing blijft het doel overeind. Die hoort bij het portfolio, alle projecten samen.',
      en: 'Line 3 is not part of it, because without that move the goal still stands. It belongs in the portfolio, all projects together.' },
    { nl: 'Elk project meldt groen, terwijl het doel niet beweegt. Meld daarom elke maand ook het getal van het doel zelf.',
      en: 'Each project reports green, while the goal does not move. So also report the goal’s own number every month.' },
    { nl: 'Bij programma’s gebruiken we een {t:Programmaraad|programmaraad}.',
      en: 'For programmes we use a {t:Programme board|programme board}.' },
  ],
  [ // s3 prioritising and capacity
    { nl: 'Het tweede onderwerp is prioriteren en capaciteit. Het knelpunt is niet geld maar de twee procesingenieurs, want die zijn schaars.',
      en: 'The second topic is prioritising and capacity. The bottleneck is not money but the two process engineers, because they are scarce.' },
    { nl: 'Tel dus hun dagen, niet het aantal medewerkers. Meer dagen dan dat kun je niet uitgeven.',
      en: 'So count their days, not the headcount. You cannot spend more days than they have.' },
    { nl: 'Moet een project wachten, dan zeg je geen kaal nee. Je zegt niet nu, en dit is wat het zou verdringen.',
      en: 'If a project has to wait, you do not just say no. You say not now, and this is what it would push out.' },
    { nl: 'Bij prioriteren gebruiken we een {t:Capaciteitsstreep|capaciteitsstreep}.',
      en: 'For prioritising we use a {t:Capacity line|capacity line}.' },
  ],
  [ // s4 governance and steering
    { nl: 'Het derde onderwerp is governance en sturen. Wie wat beslist, leg je vooraf vast. Dat geldt voor scope, budget, planning en mensen.',
      en: 'The third topic is governance and steering. You agree in advance who decides what. That covers scope, budget, timeline and people.' },
    { nl: 'De projectleider beslist binnen zijn marges. Daarbuiten beslist de stuurgroep, en alles wat de strategie raakt gaat naar de directie.',
      en: 'The project lead decides within the margins. Beyond that the steering group decides, and anything that touches strategy goes to the board.' },
    { nl: 'In de stuurgroep staan besluiten op de agenda, geen updates. Is er geen besluit, dan zeg je het overleg af.',
      en: 'The steering group has decisions on its agenda, not updates. If there is no decision, you cancel the meeting.' },
    { nl: 'Bij governance gebruiken we {t:Beslisbevoegdheden|beslisbevoegdheden} en een {t:Besluitenlijst|besluitenlijst}.',
      en: 'For governance we use {t:Decision rights|decision rights} and a {t:Decision log|decision log}.' },
  ],
  [ // s5 benefits
    { nl: 'Het vierde onderwerp is baten. De gereedheidscheck gaat live, en dat is de output. Pas later dalen de afzeggingen, en de meetbare winst daarvan zijn de baten.',
      en: 'The fourth topic is benefits. The readiness check goes live, and that is the output. Only later do cancellations drop, and the measurable gain from that is the benefit.' },
    { nl: 'De managers die de fabriek draaien zijn eigenaar van de baten. Niet de projectleider, want die vertrekt.',
      en: 'The managers who run the plant own the benefits. Not the project lead, because the project lead leaves.' },
    { nl: 'Het project sluit en het team gaat verder. Kijkt dan niemand mee, dan sluipt de oude manier terug. Daarom volg je het getal nog maanden na de livegang.',
      en: 'The project closes and the team moves on. If nobody keeps watching then, the old way creeps back. So you follow the number for months after go-live.' },
    { nl: 'Bij baten gebruiken we een {t:Nulmeting|nulmeting} en een {t:Batenhouder|batenhouder}.',
      en: 'For benefits we use a {t:Baseline|baseline} and a {t:Benefit owner|benefit owner}.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Het programma bundelt de projecten, de capaciteit bepaalt wat nu kan, en de stuurgroep besluit.',
      en: 'It connects. The programme bundles the projects, the capacity decides what can start now, and the steering group decides.' },
    { nl: 'De streep valt onder het materiaalproces, dus dat start later. De stuurgroep legt dat vast, en iemand blijft de baten volgen.',
      en: 'The capacity line falls under the materials process, so it starts later. The steering group records that, and someone keeps following the benefits.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Programma’s en governance is het eerste station van Portfolio en advies.',
      en: 'This is the map of Projects. Programmes and governance is the first station of Portfolio and consulting.' },
    { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.',
      en: 'This module has four topics, each with four levels.' },
    { nl: 'Begin bij Programma’s, op niveau Basis.',
      en: 'Start with Programmes, at Basics level.' },
    { nl: 'Op Werkkennis komen de methode MSP, de capaciteitsmatrix, stage-gates en de batenkaart erbij.',
      en: 'At Working knowledge you add the MSP method, the capacity matrix, stage-gates and the benefits map.' },
    { nl: 'Op Gevorderd komen het afhankelijkhedenregister, kosten van vertraging, voorsorteren en dubbeltelling erbij.',
      en: 'At Advanced you add the dependency register, cost of delay, pre-wiring and double counting.' },
    { nl: 'Op Expert komen veranderverzadiging, zombieprojecten, onafhankelijke toetsing en de ijzeren wet erbij.',
      en: 'At Expert you add change saturation, zombie projects, independent assurance and the iron law.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="teamlead"],[data-cue="engineers"])';
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
.pm-rag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-g{fill:#5E9A6B;stroke:#4A7F56;stroke-width:1.2}
.pm-rag-a{fill:#D49A35;stroke:#B07B22;stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
.pm-tick{fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
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
  nl: 'Hal B van de fabriek, zoals in de film over Portfolio en advies. Op de vloer staat lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp staan er mensen: de twee procesengineers bij de stroomkast, de sponsor (de plantmanager) en de teamleider van de lijn. Rechts een paneel, gemarkeerd als voorbeeld of schema: de vier projecten van dit jaar en de twee engineers die ze allemaal nodig hebben, en de vier onderwerpen van de module als tegels; drie projecten die samen één doel halen, lijn 3 daarbuiten als gestippelde kaart en elk project dat groen meldt terwijl het doel niet beweegt; het knelpunt van twee engineers, hun dagen als grens en niet nu in plaats van een kaal nee; wie wat beslist, drie niveaus van beslissen en een agenda met een besluit in plaats van een update; van output naar uitkomst en baten, de managers van de fabriek als eigenaar en een oude manier die terugsluipt; per onderwerp een of twee namen van hulpmiddelen; en de keten van programma tot baten met de uitkomst voor het materiaalproces. Aan het eind de kaart van Projecten met Programma’s en governance verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, as in the film about Portfolio and consulting. On the floor line 3 stands in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the two process engineers at the power cabinet, the sponsor (the plant manager) and the team lead of the line. At the right a panel, marked as an example or a diagram: the four projects of this year and the two engineers they all need, and the module’s four topics as tiles; three projects that reach one goal together, line 3 outside it as a dashed card and each project reporting green while the goal does not move; the bottleneck of two engineers, their days as the limit and not now instead of a bare no; who decides what, three levels of deciding and an agenda with a decision instead of an update; from output to outcome and benefits, the plant’s managers as the owner and an old way that creeps back; one or two tool names per topic; and the chain from programme to benefits with the result for the materials process. At the end the map of Projects with Programmes and governance lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

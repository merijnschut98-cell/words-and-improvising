// Dev tool, not shipped. Builds the module intro film "Lijn 3 en de experts / Line 3 and the
// experts" for Projecten leiden buiten je vakgebied (pm.outside), the ninth module intro film (v17)
// and the fourth of the cluster "Mensen en invloed": the high-over picture at the top of the
// module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the
// most").
//
//   node films/pm.outside.intro/build.mjs            build the page
//   node films/pm.outside.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.outside.intro.html: one offline page with the anatomy kit,
// the stage script and the player inlined. The index names it (pm.outside's `intro`), coursehome
// shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro) and of the three films before it in the
// cluster (films/pm.stuck.intro, films/pm.lead.intro, films/pm.negotiate.intro): ONE concrete
// project travels through the whole module, the map before the detail, no calculations. The world
// of field film 2 (films/pm.field.people), whose station for this module this intro agrees with:
// line 3 moves to hall B, and the content is too deep for you to judge: one expert finds the power
// cabinet big enough, the other does not. The station's two tools, a question set and a second
// opinion, are named here too, and its point (without them the loudest voice wins) is the
// expert scene. The same hall as the other films of the cluster, with the cast this module needs:
// the installer from outside (a hard hat, as in the pilot), the PLC programmer (the second expert,
// drawn with pm.agile.scrum's developer who carries a laptop) and the sponsor (scope is yours with
// the sponsor, and progress is told to him). The story is drawn in the room:
//   s1 line 3 has to stand in hall B before the summer shutdown ends; the work is power, a
//      switchboard and a PLC, and you are neither an electrician nor a programmer; the four topics
//   s2 Instelling: the installer is the subject matter expert, he knows how the connection works;
//      you are the director and own the route, they own the engine; you do not answer technical
//      questions, you see that the right person does, on a date; what the project delivers is
//      yours with the sponsor, how it is built is theirs        → pm.outside.director
//   s3 Vragen stellen: you cannot judge the answers, so your questions are your expertise; ask what
//      is explicitly not in the connection; the installer assumes the cabinet is big enough, and an
//      assumption is a risk until it is checked                   → pm.outside.phasequestions
//   s4 Werken met experts: the installer finds the cabinet big enough; trust his craft and check
//      the result (who checked the calculation, where is it signed); a second qualified person
//      checks important work; the PLC programmer finds the cabinet too small: two experts, two
//      opinions, and you cannot judge the content                  → pm.outside.trust
//   s5 Sturen en besluiten: the installer says the connection is ninety percent done, a percentage
//      is an opinion; count milestones, yes or no, with evidence you can see; the sponsor decides
//      on facts                                                   → pm.outside.progress
//   s6 one whole: director, questions, trust and check, steering on evidence; the calculation is
//      checked and signed, the cabinet turns out too small and gets bigger, line 3 gets into place
//   s7 the shared Projects map with Projecten leiden buiten je vakgebied lit, then the module's
//      four topics with their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.outside.director, .phasequestions, .trust,
// .progress). Each topic scene names the tools of that topic's lessons in one short sentence,
// without explaining them (Merijn's checkpoint, 14 Nov), each a term of its lesson: a naive
// question (pm.outside.humility, Werkkennis); a question set (pm.outside.phasequestions, Basis, as
// field film 2 names it) and a premortem (pm.outside.fail, Werkkennis); a spot check
// (pm.outside.trust, Basis) and a second opinion (pm.outside.disagree, Werkkennis, as field film 2
// names it); a factory acceptance test (pm.outside.progress, Basis; a FAT is the test of a
// supplier-built item at the supplier before shipping, here the switchboard). The decision memo (pm.outside.decide)
// is the run intro's decision note and is not named here. The Werkkennis tools named in a Basis scene do not come back in
// s7, and neither does any Basis term a scene named; s7 names what each later level adds and
// nothing a scene explained or named. Acceptance criteria and the milestone are not named as tools:
// the close intro and the plan intro already name them for their own topics. Terms come from the
// module's lessons and {n:} numbers from the module's text (the kit's intro mode,
// films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a caption of
// its own scene, explained in two beats and lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor from its cast,
// the installer (with a hard hat), the PLC programmer drawn with
// pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs). The things of hall B are the pilot's
// (../pm.plan.intro/hall.mjs, imported, not copied). A panel at the right, in stage space, draws
// each step as a schema, labelled "voorbeeld" (line 3's story) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.outside');
const LEVELS = {
  mindset: ['pm.outside.director', 'pm.outside.humility', 'pm.outside.credibility', 'pm.outside.keep'],
  questions: ['pm.outside.phasequestions', 'pm.outside.fail', 'pm.outside.estimates', 'pm.outside.jargon'],
  experts: ['pm.outside.trust', 'pm.outside.disagree', 'pm.outside.time', 'pm.outside.redflags'],
  steer: ['pm.outside.progress', 'pm.outside.decide', 'pm.outside.stakeholders', 'pm.outside.learnfast'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.outside has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// a tool is a term of its lesson (a method the lesson teaches, in its glossary), in both languages
const isTerm = (id, term, lang) => assert((lessons[lang].get(id).terms || []).some((t) => t.term === term), `${id} (${lang}) has no term "${term}"`);
// s2: you are the director, not the expert; the subject matter expert knows the content and owns how something works;
// you own the route and they own the engine; you do not answer technical questions, you see that the right person does,
// by a date; scope is yours with the sponsor, the solution is theirs; the tool: a naive question (pm.outside.humility,
// Werkkennis; the scene does not show or explain it, and it is not in s7)
has('pm.outside.director', ['zie jezelf als regisseur, niet als expert', 'is degene die de inhoud kent', 'Hij is eigenaar van hoe iets werkt', 'Jij bent eigenaar van de route; zij van de motor', 'je beantwoordt geen technische vragen; je zorgt dat ze beantwoord worden, door de juiste persoon, op een datum', 'De scope is van jou en de sponsor', 'De oplossing is van hen']);
has('pm.outside.director', ['see yourself as a director, not an expert', 'is the person who knows the content', 'They own how something works', 'You own the route; they own the engine', 'you make sure they get answered, by the right person, by a date', 'Scope is yours with the sponsor', 'The solution is theirs'], 'en');
isTerm('pm.outside.humility', 'Naïeve vraag', 'nl'); isTerm('pm.outside.humility', 'Naive question', 'en');
// s3: when you cannot judge the answers the quality of your questions is your expertise; ask what is explicitly not
// included, the second half matters most; an assumption is treated as true without proof and is a risk until it is
// checked; the tools: a question set (pm.outside.phasequestions, Basis, as field film 2 names it) and a premortem
// (pm.outside.fail, Werkkennis)
has('pm.outside.phasequestions', ['is de kwaliteit van je vragen je vakkennis', 'Wat zit er uitdrukkelijk niet in?', 'daar zitten de misverstanden', 'Een aanname is iets wat je voorlopig als waar behandelt, zonder bewijs', 'elke aanname is een risico tot hij gecheckt is']);
has('pm.outside.phasequestions', ['the quality of your questions is your expertise', 'What is explicitly not included?', 'misunderstandings live there', 'something you treat as true for now without proof', 'each one is a risk until it is checked'], 'en');
isTerm('pm.outside.phasequestions', 'Vragenset', 'nl'); isTerm('pm.outside.fail', 'Premortem', 'nl');
isTerm('pm.outside.phasequestions', 'Question set', 'en'); isTerm('pm.outside.fail', 'Premortem', 'en');
// s4: you trust their skill and intent and check the results that matter; check results, not methods (who checked the
// calculation, and where is it signed); every important piece of work is checked by a second qualified person and your
// job is to make sure that person exists; the tools: a spot check (pm.outside.trust, Basis) and a second opinion
// (pm.outside.disagree, Werkkennis, as field film 2 names it; the two experts who disagree only set it up)
has('pm.outside.trust', ['Je vertrouwt hun vakmanschap en bedoelingen; je controleert de resultaten die echt tellen', 'Controleer resultaten, geen methodes', 'Wie heeft de berekening gecontroleerd, en waar is die getekend?', 'elk belangrijk stuk werk door een tweede bevoegde persoon wordt gecontroleerd', 'zorgen dat dat tweede paar ogen er is']);
has('pm.outside.trust', ['You trust their skill and intent; you check the results that matter', 'Check results, not methods', 'Who checked the calculation, and where is it signed?', 'every important piece of work is checked by a second qualified person', 'make sure the second pair of eyes exists'], 'en');
has('pm.outside.disagree', ['kun je de inhoud niet beoordelen, maar wel het besluit structureren']);
has('pm.outside.disagree', ['can’t judge the content, but you can structure the decision'], 'en');
isTerm('pm.outside.trust', 'Steekproef', 'nl'); isTerm('pm.outside.disagree', 'Second opinion', 'nl');
isTerm('pm.outside.trust', 'Spot check', 'en'); isTerm('pm.outside.disagree', 'Second opinion', 'en');
// s5: outside your field you cannot look at the work and judge how far it is; percent complete is the weakest measure,
// an opinion that tends to stall near 90%; a milestone is a yes or no, not a percentage (switchgear energised); count a
// milestone only when its evidence exists (a signed test report, a demo); the tools: a factory acceptance test
// (pm.outside.progress, Basis), given its reason: the switchboard comes from a supplier. The decision memo is the run
// intro's besluitnotitie, the same one-page idea, and is dropped here. The milestone and acceptance
// criteria are the plan and close intros' tools and are not named here
has('pm.outside.progress', ['Percentage gereed', 'is buiten je vak de zwakste maat: het is een mening', 'Een mijlpaal (milestone) is een punt in het project waarop een duidelijk resultaat er moet zijn', 'schakelinstallatie onder spanning', 'Het is ja of nee, geen percentage', 'tel een mijlpaal pas als het bewijs er is: een getekend testrapport, een demo']);
has('pm.outside.progress', ['Percent complete', 'is the weakest measure outside your field: it’s an opinion', 'A milestone is a point in the project where a clear result has to exist', 'switchgear energised', 'It’s a yes-or-no, not a percentage', 'only count a milestone when its evidence exists: a signed test report, a demo'], 'en');
isTerm('pm.outside.progress', 'Fabrieksacceptatietest', 'nl');
isTerm('pm.outside.progress', 'Factory acceptance test', 'en');
// s7: the later levels, as the lessons are titled or word them (the grid names what each adds, and nothing a scene
// explained or named: no naive question, question set, premortem, spot check, second opinion, factory acceptance test,
// director, process owner, assumption, milestone, evidence, percentage; curiosity, single point of
// failure, decision criteria, one-way doors, the trust equation, reference classes, context switching, the pyramid
// principle, what you never hand over, teach-back, the watermelon status and shadowing are named here and nowhere else)
for (const [id, word] of [['pm.outside.humility', 'Nieuwsgierigheid'], ['pm.outside.fail', 'Single point of failure'], ['pm.outside.disagree', 'Besliscriteria'], ['pm.outside.decide', 'Eenrichtingsdeur'],
  ['pm.outside.credibility', 'Vertrouwensformule'], ['pm.outside.estimates', 'Referentieklasse'], ['pm.outside.time', 'Contextwisseling'], ['pm.outside.stakeholders', 'Piramideprincipe'],
  ['pm.outside.keep', 'Wat je nooit uit handen geeft'], ['pm.outside.jargon', 'Terugvertellen'], ['pm.outside.redflags', 'Watermeloenstatus'], ['pm.outside.learnfast', 'Meelopen']]) has(id, [word]);
for (const [id, word] of [['pm.outside.humility', 'Curiosity'], ['pm.outside.fail', 'Single point of failure'], ['pm.outside.disagree', 'Decision criteria'], ['pm.outside.decide', 'One-way door'],
  ['pm.outside.credibility', 'Trust equation'], ['pm.outside.estimates', 'Reference class'], ['pm.outside.time', 'Context switching'], ['pm.outside.stakeholders', 'Pyramid principle'],
  ['pm.outside.keep', 'What you never hand over'], ['pm.outside.jargon', 'Teach-back'], ['pm.outside.redflags', 'Watermelon status'], ['pm.outside.learnfast', 'Shadowing']]) has(id, [word], 'en');
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
// title, and the route's rows (284 wide) are wider. "Werken met experts" and "Sturen en besluiten" have no word wider
// than the kit's 128-unit tile and wrap in at most three lines, so the film declares the kit's own 128 (`tileUnits`, as
// pm.stuck.intro) and the build asserts it; every title box wraps with D.tileUnits
const TILE_TEXT = 128;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the tile`);
}

// ---------------------------------------------------------------- the world (hall B, as field film 2)
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

// where things stand (cm), as in the pilot: line 3's marked floor at the back wall at the right under the
// switchboard, line 4 (which stays) next to it, the power cabinet at the back wall at the left
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

// the people: the sponsor is the pm cast; the installer (a hard hat, as in the pilot) and the PLC programmer are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
// The installer stands at the cabinet; the PLC programmer (the developer with a laptop) and the sponsor stand on the open floor in front of it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-installer', scrumPerson(w, k, G, P, { x: 44, y: 62, key: 'installer', look: 'sm', along: 'y' }) + hall.hat(44, 62)),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-plc', scrumPerson(w, k, G, P, { x: 112, y: 96, key: 'plc', look: 'dev2', along: 'x' })),
  g('pp-sponsor', person('sponsor', 142, 130, 'y')),
].join('');


// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has up to two tool chips (tool1, tool2) for the
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Projecten leiden buiten je vakgebied is a cue group of its
// own (map-outside).
const tiles = ['tMind', 'tQuest', 'tExp', 'tSteer'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('need', g('needB', ''))
  + cueG('owner', g('ownerB', '')) + cueG('director', g('directorB', '')) + cueG('split', g('splitB', ''))
  + cueG('blind', g('blindB', '')) + cueG('notin', g('notinB', '')) + cueG('assume', g('assumeB', ''))
  + cueG('claim', g('claimB', '')) + cueG('verify', g('verifyB', '')) + cueG('eyes', g('eyesB', '')) + cueG('clash', g('clashB', ''))
  + cueG('pct', g('pctB', '')) + cueG('mile', g('mileB', '')) + cueG('proof', g('proofB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Projecten leiden buiten je vakgebied lit, in the stage (the film's closing scene; the stage script moves and fades it)
const OUT_PLACE = pmMap.places.find((p) => p.module === 'pm.outside');
// The English label of this place is four lines of 17 units from y 326 (Leading, projects, outside your, field): the last
// line's descenders and the lit halo reach the tile's bottom border (y 382), which shows at the 1.5 zoom of the closing
// scene. mapSvg is pinned and the app's own, so this film closes its label up to 16 units a line (baselines 323 to 371),
// which keeps it clear of the border and of the desk above it; the build asserts the drawing it edits and that it fits.
const LABEL_EN = [326, 343, 360, 377].map((y, i) => `<tspan x="${OUT_PLACE.x + OUT_PLACE.w / 2}" y="${y}">${['Leading', 'projects', 'outside your', 'field'][i]}</tspan>`).join('');
const LABEL_EN_FIT = [323, 339, 355, 371].map((y, i) => `<tspan x="${OUT_PLACE.x + OUT_PLACE.w / 2}" y="${y}">${['Leading', 'projects', 'outside your', 'field'][i]}</tspan>`).join('');
assert(OUT_PLACE.y + OUT_PLACE.h - 371 >= 8, 'the closed-up English label keeps 8 units clear of the tile border');
const MAP0_SVG = await mapScene({ subject: 'pm', highlight: ['pm.outside'] });
assert(MAP0_SVG.split(LABEL_EN).length === 2, 'the shared map draws the English label of Leading projects outside your field as this film expects');
const MAP = MAP0_SVG.replace(LABEL_EN, LABEL_EN_FIT).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const MAPZ = [OUT_PLACE.x + OUT_PLACE.w / 2, OUT_PLACE.y + OUT_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.outside')}"`), 'the map lights pm.outside as a cue group');


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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3's floor, the calendar and the cabinet
  { from: cam(95, 95, 60, 1.1), to: cam(98, 98, 60, 1.15) }, // s2 the installer at the cabinet and the sponsor on the floor
  { from: cam(70, 75, 60, 1.2), to: cam(75, 78, 60, 1.25) }, // s3 the installer at the cabinet
  { from: cam(78, 82, 60, 1.1), to: cam(82, 84, 60, 1.15) }, // s4 the installer and the PLC programmer
  { from: cam(145, 88, 70, 1), to: cam(148, 90, 70, 1.03) }, // s5 the whole hall: the installer, the sponsor and the switchboard's place on the wall
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.outside.intro',
  title: { nl: 'Lijn 3 en de experts', en: 'Line 3 and the experts' },
  module: 'pm.outside',
  // the topic titles have no word wider than the kit's 128-unit tile and wrap in at most three lines (asserted above), so
  // the film declares the kit's own width (as pm.stuck.intro): every title box wraps with D.tileUnits
  tileUnits: 128,
  // the map: per topic of pm.outside, the scene that explains it and its tile
  topics: {
    mindset: { scene: 's2', cue: 'tMind' },
    questions: { scene: 's3', cue: 'tQuest' },
    experts: { scene: 's4', cue: 'tExp' },
    steer: { scene: 's5', cue: 'tSteer' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'Lijn 3 moet voor het eind van de zomerstop in hal B staan, met stroom, een schakelkast en een PLC.', en: 'Line 3 must be in hall B before the summer shutdown ends, with power, a switchboard and a PLC.', focus: ['goal', 'floor', 'calendar', 'power', 'switch'] },
        { nl: 'Jij bent geen elektricien en geen programmeur. De installateur en de PLC-programmeur weten er meer van.', en: 'You are not an electrician or a programmer. The installer and the PLC programmer know more about it.', focus: ['need', 'installer', 'plc'] },
        { nl: 'Toch leid jij dit project. We volgen het langs de vier onderwerpen van de module.', en: 'Yet you lead this project. We follow it through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Instelling', en: 'Mindset' },
      beats: [
        { nl: 'Eerste onderwerp is Instelling. De installateur is de vakexpert en weet hoe de aansluiting werkt.', en: 'First topic is Mindset. The installer is the subject matter expert and knows how the connection works.', focus: ['tMind', 'owner', 'installer'] },
        { nl: 'Zie jezelf als regisseur. Jij bent eigenaar van de route, de expert van de motor.', en: 'See yourself as a director. You own the route, the expert owns the engine.', focus: ['director', 'installer'] },
        { nl: 'Wat het project oplevert bepaal je met de sponsor. Hoe het gebouwd wordt, is aan de installateur.', en: 'What the project delivers you decide with the sponsor. How it is built is up to the installer.', focus: ['split', 'sponsor', 'installer'] },
        { nl: 'Bij de instelling gebruiken we een {t:Naïeve vraag|naïeve vraag}.', en: 'For the mindset we use a {t:Naive question|naive question}.', cue: { 'Naïeve vraag': 'tool1', 'Naive question': 'tool1' }, focus: ['tool1'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Vragen stellen', en: 'Asking questions' },
      beats: [
        { nl: 'Tweede onderwerp is Vragen stellen. Je kunt antwoorden niet beoordelen, dus zijn je vragen je vakkennis.', en: 'Second topic is Asking questions. You cannot judge answers, so your questions are your expertise.', focus: ['tQuest', 'blind', 'installer'] },
        { nl: 'Vraag de installateur wat er uitdrukkelijk niet in de aansluiting zit. Daar zitten de misverstanden.', en: 'Ask the installer what is explicitly not in the connection. That is where the misunderstandings are.', focus: ['notin', 'installer', 'power'] },
        { nl: 'Hij neemt aan dat de kast groot genoeg is. Een aanname is een risico tot hij gecheckt is.', en: 'He assumes the cabinet is big enough. An assumption is a risk until it is checked.', focus: ['assume', 'installer', 'power'] },
        { nl: 'Bij vragen stellen gebruiken we een {t:Vragenset|vragenset} en een {t:Premortem|premortem}.', en: 'For asking questions we use a {t:Question set|question set} and a {t:Premortem|premortem}.', cue: { Vragenset: 'tool1', Premortem: 'tool2', 'Question set': 'tool1' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Experts', en: 'Experts' },
      beats: [
        { nl: 'Derde onderwerp is Werken met experts. De installateur zegt dat de stroomkast groot genoeg is.', en: 'Third topic is Working with experts. The installer says the power cabinet is big enough.', focus: ['tExp', 'claim', 'installer', 'power'] },
        { nl: 'Vertrouw zijn vak, controleer het resultaat. Wie controleerde de berekening, en waar is die getekend?', en: 'Trust his skill, check the result. Who checked the calculation, and where is it signed?', focus: ['verify', 'installer'] },
        { nl: 'Belangrijk werk controleert een tweede bevoegde persoon. Jij zorgt dat hij er is, niet jijzelf.', en: 'A second qualified person checks important work. You make sure he is there, not you.', focus: ['eyes', 'installer'] },
        { nl: 'De PLC-programmeur vindt de kast te klein. Twee experts, twee meningen, en jij kunt het niet beoordelen.', en: 'The PLC programmer finds the cabinet too small. Two experts, two opinions, and you cannot judge it.', focus: ['clash', 'plc', 'installer', 'power'] },
        { nl: 'Met experts gebruiken we een {t:Steekproef|steekproef} en een {t:Second opinion|second opinion}.', en: 'With experts we use a {t:Spot check|spot check} and a {t:Second opinion|second opinion}.', cue: { Steekproef: 'tool1', 'Second opinion': 'tool2', 'Spot check': 'tool1' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Sturen', en: 'Steering' },
      beats: [
        { nl: 'Vierde onderwerp is Sturen en besluiten. De installateur zegt dat de aansluiting negentig procent klaar is.', en: 'Fourth topic is Steering and deciding. The installer says the connection is ninety percent done.', focus: ['tSteer', 'pct', 'installer'] },
        { nl: 'Een percentage is een mening. Tel mijlpalen, ja of nee, zoals de schakelkast onder spanning.', en: 'A percentage is an opinion. Count milestones, yes or no, like the switchboard energised.', focus: ['mile', 'installer', 'switch'] },
        { nl: 'Een mijlpaal telt pas met bewijs, zoals een getekend testrapport of een demo. De sponsor besluit op feiten.', en: 'A milestone counts only with evidence, such as a signed test report or a demo. The sponsor decides on facts.', focus: ['proof', 'sponsor'] },
        { nl: 'Een leverancier bouwt de schakelkast. We testen daar met een {t:Fabrieksacceptatietest|fabrieksacceptatietest}.', en: 'A supplier builds the switchboard. We test there with a {t:Factory acceptance test|factory acceptance test}.', cue: { Fabrieksacceptatietest: 'tool1', 'Factory acceptance test': 'tool1' }, focus: ['switch', 'tool1'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Regisseur, goede vragen, vertrouwen en controleren, sturen op bewijs.', en: 'It connects. Director, good questions, trust and check, steering on evidence.', focus: ['flow', 'installer', 'plc', 'sponsor'] },
        { nl: 'De tweede controleur rekent na en tekent. De kast is te klein, wordt groter en lijn 3 komt op zijn plek.', en: 'The second checker recalculates and signs. The cabinet is too small, gets bigger and line 3 gets into place.', focus: ['decision', 'installer', 'power', 'line3'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Op de kaart van Projecten is Projecten leiden buiten je vakgebied het vierde station van Mensen en invloed.', en: 'On the map of Projects, Leading projects outside your field is the fourth station of People and influence.', focus: mapCue('pm.outside') },
        { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.', en: 'This module has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Instelling, op niveau Basis.', en: 'Start with Mindset, at Basics level.', focus: ['tMind', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen nieuwsgierigheid, single point of failure, besliscriteria en eenrichtingsdeuren erbij.', en: 'At Working knowledge you add curiosity, single point of failure, decision criteria and one-way doors.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen de vertrouwensformule, referentieklassen, contextwisseling en het piramideprincipe erbij.', en: 'At Advanced you add the trust equation, reference classes, context switching and the pyramid principle.', focus: 'lv3' },
        { nl: 'Op Expert komen wat je nooit uit handen geeft, terugvertellen, de watermeloenstatus en meelopen erbij.', en: 'At Expert you add what you never hand over, teach-back, the watermelon status and shadowing.', focus: 'lv4' },
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
// explaining them. The film has one SAY rule of its own (films/_kit/timeline.mjs, the group at the end of
// the Dutch list): second opinion in "steekproef en een second opinion". PLC, premortem, single point of
// failure, vertrouwensformule and fabrieksacceptatietest have rules there or are read right, and
// the other words (naïeve vraag, vragenset, stroomkast, besliscriteria, eenrichtingsdeuren,
// contextwisseling, referentieklassen, piramideprincipe, terugvertellen, watermeloenstatus, meelopen) are
// plain Dutch words or already said by other films.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'Lijn 3 moet voor het einde van de zomerstop in hal B staan. Het werk draait om stroom, een schakelkast en een PLC die de lijn bestuurt.',
      en: 'Line 3 has to stand in hall B before the summer shutdown ends. The work is about power, a switchboard and a PLC that controls the line.' },
    { nl: 'Jij bent geen elektricien en geen programmeur. De installateur en de PLC-programmeur weten er veel meer van dan jij.',
      en: 'You are not an electrician and not a programmer. The installer and the PLC programmer know far more about it than you.' },
    { nl: 'Toch leid jij dit project. Hoe doe je dat? We volgen het langs de vier onderwerpen van de module.',
      en: 'Yet you lead this project. How do you do that? We follow it through the four topics of the module.' },
  ],
  [ // s2 mindset
    { nl: 'Het eerste onderwerp is de instelling. De installateur is de vakexpert en weet hoe de aansluiting werkt.',
      en: 'The first topic is the mindset. The installer is the subject matter expert, and he knows how the connection works.' },
    { nl: 'Zie jezelf als regisseur, niet als expert. Jij bent eigenaar van de route, de expert van de motor. Je zorgt dat de juiste persoon elke technische vraag beantwoordt, op een datum.',
      en: 'See yourself as a director, not as an expert. You own the route, the expert owns the engine. You make sure the right person answers each technical question, by a date.' },
    { nl: 'Wat het project oplevert bepaal je met de sponsor. Hoe het gebouwd wordt, is aan de installateur.',
      en: 'What the project delivers you decide with the sponsor. How it is built is up to the installer.' },
    { nl: 'Bij de instelling gebruiken we een {t:Naïeve vraag|naïeve vraag}.',
      en: 'For the mindset we use a {t:Naive question|naive question}.' },
  ],
  [ // s3 asking questions
    { nl: 'Het tweede onderwerp is vragen stellen. Je kunt de antwoorden niet beoordelen, dus is de kwaliteit van je vragen je vakkennis.',
      en: 'The second topic is asking questions. You cannot judge the answers, so the quality of your questions is your expertise.' },
    { nl: 'Vraag de installateur wat er uitdrukkelijk niet in de aansluiting zit. Daar zitten de misverstanden.',
      en: 'Ask the installer what is explicitly not in the connection. That is where the misunderstandings are.' },
    { nl: 'Hij neemt aan dat de stroomkast groot genoeg is. Schrijf dat op, want een aanname is een risico tot hij gecheckt is.',
      en: 'He assumes the power cabinet is big enough. Write that down, because an assumption is a risk until it is checked.' },
    { nl: 'Bij vragen stellen gebruiken we een {t:Vragenset|vragenset} en een {t:Premortem|premortem}.',
      en: 'For asking questions we use a {t:Question set|question set} and a {t:Premortem|premortem}.' },
  ],
  [ // s4 working with experts
    { nl: 'Het derde onderwerp is werken met experts. De installateur zegt dat de stroomkast groot genoeg is.',
      en: 'The third topic is working with experts. The installer says the power cabinet is big enough.' },
    { nl: 'Je vertrouwt zijn vakmanschap en controleert het resultaat. Wie heeft de berekening gecontroleerd, en waar is die getekend?',
      en: 'You trust his skill and check the result. Who checked the calculation, and where is it signed?' },
    { nl: 'Elk belangrijk stuk werk wordt door een tweede bevoegde persoon gecontroleerd. Jij zorgt dat hij er is, je bent het niet zelf.',
      en: 'Every important piece of work is checked by a second qualified person. You make sure he is there, you are not him yourself.' },
    { nl: 'Maar de PLC-programmeur vindt de stroomkast te klein. Twee experts, twee meningen, en jij kunt de inhoud niet beoordelen.',
      en: 'But the PLC programmer finds the power cabinet too small. Two experts, two opinions, and you cannot judge the content.' },
    { nl: 'Met experts gebruiken we een {t:Steekproef|steekproef} en een {t:Second opinion|second opinion}.',
      en: 'With experts we use a {t:Spot check|spot check} and a {t:Second opinion|second opinion}.' },
  ],
  [ // s5 steering and deciding
    { nl: 'Het vierde onderwerp is sturen en besluiten. De installateur zegt dat de aansluiting voor negentig procent klaar is.',
      en: 'The fourth topic is steering and deciding. The installer says the connection is ninety percent done.' },
    { nl: 'Buiten je vak is een percentage de zwakste maat, want het is een mening. Tel liever mijlpalen, die zijn ja of nee, zoals de schakelkast onder spanning.',
      en: 'Outside your field a percentage is the weakest measure, because it is an opinion. Count milestones instead, which are yes or no, like the switchboard energised.' },
    { nl: 'Tel een mijlpaal pas als het bewijs er is, zoals een getekend testrapport of een demo. Zo besluit de sponsor op feiten.',
      en: 'Only count a milestone when the evidence exists, such as a signed test report or a demo. That way the sponsor decides on facts.' },
    { nl: 'Een leverancier bouwt de schakelkast. We testen hem daar voor verzending, met een {t:Fabrieksacceptatietest|fabrieksacceptatietest}.',
      en: 'A supplier builds the switchboard. We test it there before shipping, with a {t:Factory acceptance test|factory acceptance test}.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Je bent regisseur, je stelt goede vragen, en je vertrouwt experts maar controleert wat telt. Je stuurt op bewijs.',
      en: 'It connects. You are the director, you ask good questions, and you trust experts but check what counts. You steer on evidence.' },
    { nl: 'De tweede controleur rekent na en tekent. De stroomkast is te klein, wordt groter, en lijn 3 komt op zijn plek.',
      en: 'The second checker recalculates and signs. The power cabinet is too small, gets bigger, and line 3 gets into place.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Projecten leiden buiten je vakgebied is het vierde station van Mensen en invloed.',
      en: 'This is the map of Projects. Leading projects outside your field is the fourth station of People and influence.' },
    { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.',
      en: 'This module has four topics, each with four levels.' },
    { nl: 'Begin bij de instelling, op niveau Basis.',
      en: 'Start with the mindset, at Basics level.' },
    { nl: 'Op Werkkennis komen nieuwsgierigheid, single point of failure, besliscriteria en eenrichtingsdeuren erbij.',
      en: 'At Working knowledge you add curiosity, single point of failure, decision criteria and one-way doors.' },
    { nl: 'Op Gevorderd komen de vertrouwensformule, referentieklassen, contextwisseling en het piramideprincipe erbij.',
      en: 'At Advanced you add the trust equation, reference classes, context switching and the pyramid principle.' },
    { nl: 'Op Expert komen wat je nooit uit handen geeft, terugvertellen, de watermeloenstatus en meelopen erbij.',
      en: 'At Expert you add what you never hand over, teach-back, the watermelon status and shadowing.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="buyer"],[data-cue="installer"],[data-cue="plc"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de film over de mensenkant van het project. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met een gestippelde kabel van buiten, die pas een gewone lijn wordt als de aansluiting klaar is, aan de achterwand de plek van de schakelkast als gestippelde omtrek, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp staan er mensen: de installateur met een helm, de PLC-programmeur met een laptop en de sponsor. Aan het eind staat lijn 3 op zijn plek, is de kabel aangesloten en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel, de installateur en de PLC-programmeur die jij niet kunt beoordelen en de vier onderwerpen van de module als tegels; de vakexpert die weet hoe het werkt en jij als regisseur van de route, wat jij met de sponsor bepaalt en wat de installateur bepaalt; wat je niet kunt beoordelen en je vragen als vakkennis, wat er niet in de aansluiting zit en een aanname die een risico is tot ze gecheckt is; de claim van de installateur, vertrouwen en controleren, een tweede paar ogen en twee experts die het oneens zijn; een percentage dat een mening is, mijlpalen met ja of nee en het bewijs dat ze tellen; per onderwerp een of twee namen van hulpmiddelen; en de keten van instelling tot sturen. Aan het eind de kaart van Projecten met Projecten leiden buiten je vakgebied verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 has to go, as in the film about the people side of the project. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with a dashed cable from outside, which becomes a solid line once the connection is done, on the back wall the place of the switchboard as a dashed outline, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the installer in a hard hat, the PLC programmer with a laptop and the sponsor. At the end line 3 stands in place, the cable is connected and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the goal, the installer and the PLC programmer whom you cannot judge, and the module’s four topics as tiles; the subject matter expert who knows how it works and you as director of the route, what you decide with the sponsor and what the installer decides; what you cannot judge and your questions as your expertise, what is not in the connection and an assumption that is a risk until it is checked; the installer’s claim, trust and check, a second pair of eyes and two experts who disagree; a percentage that is an opinion, milestones with yes or no and the evidence that makes them count; one or two tool names per topic; and the chain from mindset to steering. At the end the map of Projects with Leading projects outside your field lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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


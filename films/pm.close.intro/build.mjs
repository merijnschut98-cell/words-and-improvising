// Dev tool, not shipped. Builds the module intro film "Lijn 3 is af / Line 3 is done"
// for Afsluiten (pm.close), the fifth module intro film (v17): the high-over
// picture at the top of the module, before its four topics (Merijn, 13 Nov: "that
// high-over picture is the thing I need the most").
//
//   node films/pm.close.intro/build.mjs            build the page
//   node films/pm.close.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.close.intro.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it
// (pm.close's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro): ONE concrete project
// travels through the whole module, the map before the detail, no calculations.
// Same hall B and cast as the pilot, the other intros and field film 1
// (films/pm.field.lifecycle, whose Close station this intro agrees with: the
// baseline measured the same way from before the move, the sponsor's signature, a
// retrospective, the run chart and the closing report). Now the shutdown is over,
// line 3 runs in hall B and the goal of the intake ("line 3 runs in hall B, as fast
// as now") has to be shown. The STORY IS DRAWN IN THE ROOM:
//   s1 the shutdown is over: line 3 on its floor, the switchboard on the wall, the
//      goal from the intake; the sponsor asks whether it is met; the module's four
//      topics as a route on the panel
//   s2 Resultaat aantonen: the same speed measurement as before the move, and why one
//      good week proves nothing (every week varies)        → pm.close.results, .runchart
//   s3 Overdracht en afsluiting: the sponsor goes through the criteria agreed at the
//      start and signs; line 4 is an open point with the team lead as owner (the line
//      stays when the project ends); the time code, the final invoice and access are
//      closed                                                → pm.close.acceptance, .closeout
//   s4 Terugblik en lessen: the team looks back, speaking is safe, the lesson of the
//      late switchboard becomes an action with an owner (the buyer) and a moment
//                                                            → pm.close.retro, .lessonbank
//   s5 Klantrelatie en vervolg: the closing report on one page, answer first; the
//      adviser leaves and the team lead keeps measuring, so there is no dependency
//                                                            → pm.close.report, .evaluation, .followup, .exit
//   s6 one close: proof, signature, lesson, a client who carries on
//   s7 the shared Projects map with Close lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.close.results, .acceptance, .retro,
// .report). Each topic scene names two tools of that topic's lessons in one short
// sentence, without explaining them (Merijn's checkpoint, 14 Nov). Terms come from
// the module's lessons (the kit's intro mode, films/_kit/build-film.mjs); the kit
// holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead of the line from its cast, the buyer and two operators
// drawn with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs). The things of
// hall B are the pilot's (../pm.plan.intro/hall.mjs, imported, not copied). A panel at
// the right, in stage space, draws each step as a schema, labelled "voorbeeld"
// (the line's close) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'pm.close');
const LEVELS = {
  proof: ['pm.close.results', 'pm.close.runchart', 'pm.close.attribution', 'pm.close.claim'],
  closure: ['pm.close.acceptance', 'pm.close.closeout', 'pm.close.stop', 'pm.close.registers'],
  learn: ['pm.close.retro', 'pm.close.yourself', 'pm.close.formats', 'pm.close.lessonbank'],
  client: ['pm.close.report', 'pm.close.followup', 'pm.close.evaluation', 'pm.close.exit'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.close has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: the baseline measured the same way as after; every week varies (noise); the two tools (baseline, run chart)
has('pm.close.results', ['de prestatie vóór de verandering, gemeten op dezelfde manier als erna', 'de normale schommeling van week tot week', 'Nulmeting', 'Ruis']);
has('pm.close.results', ['the performance before the change, measured the same way as after', 'the normal week-to-week swing', 'Baseline', 'Noise'], 'en');
has('pm.close.runchart', ['Run chart', 'weekwaarden op volgorde in de tijd'], 'nl');
has('pm.close.runchart', ['Run chart', 'weekly values in time order'], 'en');
// s3: the criteria agreed at the start, the sign-off, the open points list with an owner in the line, the close-out
has('pm.close.acceptance', ['Acceptatiecriteria zeggen wanneer het project klaar is', 'spreek ze aan het begin af', 'De ondertekening is het formele ja van de sponsor', 'Gebruik een openpuntenlijst', 'Die eigenaar zit in de lijnorganisatie', 'Punten bij de lijn overleven de overdracht']);
has('pm.close.acceptance', ['Acceptance criteria say when the project is done', 'agree them at the start', 'The sign-off is the sponsor’s formal yes', 'Use an open points list', 'The owner sits in the line organisation', 'Points owned by the line survive the handover'], 'en');
has('pm.close.closeout', ['Afsluitchecklist', 'Sluit de urencode', 'zodat niemand er na de afsluiting nog op boekt', 'Stuur de eindfactuur', 'Toegang intrekken']);
has('pm.close.closeout', ['Close-out checklist', 'Close the time code', 'so nobody books on it after closing', 'Send the final invoice', 'Revoking access'], 'en');
// s4: the retrospective's question, safety, a lesson as an action with an owner and a moment, the two tools
has('pm.close.retro', ['wat herhalen we, wat veranderen we', 'met het klantteam', 'Psychologische veiligheid komt eerst', 'Maak van elke les een actie', 'een eigenaar en een moment waarop hij gebruikt wordt', 'Tijdlijn']);
has('pm.close.retro', ['what do we repeat, what do we change', 'with the client team', 'Psychological safety comes first', 'Turn each lesson into an action', 'an owner and a moment it will be used', 'Timeline'], 'en');
has('pm.close.lessonbank', ['Lessenrapport']);
has('pm.close.lessonbank', ['Lessons report'], 'en');
// s5: the closing report on one page, answer first; leaving without dependency; the evaluation and the follow-up
has('pm.close.report', ['Het eindrapport (closing report): één A4', 'Antwoord eerst: begin met de conclusie', 'Een bijlage bevat het detail']);
has('pm.close.report', ['The closing report: one page', 'Answer first: start with the conclusion'], 'en');
has('pm.close.exit', ['kan de klant het zonder jou', 'Afhankelijkheid (dependency) is het omgekeerde: het werk loopt alleen als jij er bent', 'Kennisoverdracht']);
has('pm.close.exit', ['can the client do it without you', 'Dependency is the opposite: the work only runs when you are there'], 'en');
has('pm.close.evaluation', ['Klantevaluatie']);
has('pm.close.evaluation', ['Client evaluation'], 'en');
has('pm.close.followup', ['Follow-up', 'Een follow-up is een gepland contact na het project']);
has('pm.close.followup', ['A follow-up is a planned contact after the project'], 'en');
// s7: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['pm.close.runchart', 'run chart lezen'], ['pm.close.closeout', 'Administratief afsluiten'], ['pm.close.yourself', 'eigen reflectie'], ['pm.close.followup', 'Opvolging en het volgende project'],
  ['pm.close.attribution', 'eigen effect scheiden'], ['pm.close.stop', 'Voortijdig stoppen'], ['pm.close.formats', 'terugblik ontwerpen'], ['pm.close.evaluation', 'evaluatiegesprek met de klant'],
  ['pm.close.claim', 'claim die standhoudt'], ['pm.close.registers', 'Registers en restrisico’s overdragen'], ['pm.close.lessonbank', 'Lessen die reizen'], ['pm.close.exit', 'Weggaan zonder afhankelijkheid']]) has(id, [word]);
for (const [id, word] of [['pm.close.runchart', 'Reading a run chart'], ['pm.close.closeout', 'Administrative close-out'], ['pm.close.yourself', 'Your own reflection'], ['pm.close.followup', 'Follow-up and the next project'],
  ['pm.close.attribution', 'Separating your own effect'], ['pm.close.stop', 'Stopping early'], ['pm.close.formats', 'Designing a retrospective'], ['pm.close.evaluation', 'The client evaluation'],
  ['pm.close.claim', 'A claim that holds'], ['pm.close.registers', 'Handing over registers and residual risks'], ['pm.close.lessonbank', 'Lessons that travel'], ['pm.close.exit', 'Leaving without dependency']]) has(id, [word], 'en');
// the film's own facts, as the other films of the road tell them (field film 1, the intake and run intros)
const fieldFilm = readFileSync(join(HERE, '../pm.field.lifecycle/build.mjs'), 'utf8');
assert(fieldFilm.includes('van voor de verhuizing') && fieldFilm.includes('Dan tekent de sponsor'), 'field film 1 still closes with the baseline from before the move and the sponsor\'s signature');
const intakeStage = readFileSync(join(HERE, '../pm.intake.intro/stage.js'), 'utf8');
assert(intakeStage.includes("'even snel als nu'") && intakeStage.includes("'Nulmeting: snelheid'"), 'the intake intro still sets the goal "as fast as now" and the baseline speed');
const runFilm = readFileSync(join(HERE, '../pm.run.intro/build.mjs'), 'utf8');
assert(runFilm.includes('lijn 4 komt na de stop') && runFilm.includes('late schakelkast'), 'the run intro still puts line 4 after the shutdown and the switchboard late');
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

// the people: the sponsor and the team lead of the line are the pm cast; the buyer and the two operators are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-buyer', scrumPerson(w, k, G, P, { x: 224, y: 96, key: 'buyer', look: 'po', along: 'x' })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 122, 138, 'y')),
].join('');


// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has two tool chips (tool1, tool2) for the two
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Close is a cue group of its own (map-close).
const tiles = ['tProof', 'tClosure', 'tLearn', 'tClient'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('ask', g('askB', ''))
  + cueG('base', g('baseB', '')) + cueG('noise', g('noiseB', ''))
  + cueG('criteria', g('criteriaB', '')) + cueG('sign', g('signB', '')) + cueG('open', g('openB', '')) + cueG('closeout', g('closeB', ''))
  + cueG('retro', g('retroB', '')) + cueG('safe', g('safeB', '')) + cueG('action', g('actionB', ''))
  + cueG('report', g('reportB', '')) + cueG('leave', g('leaveB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('end', g('endB', '')));
// the shared map, Close lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.close'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const CLOSE_PLACE = pmMap.places.find((p) => p.module === 'pm.close');
const MAPZ = [CLOSE_PLACE.x + CLOSE_PLACE.w / 2, CLOSE_PLACE.y + CLOSE_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.close')}"`), 'the map lights pm.close as a cue group');

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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor and the calendar
  { from: cam(215, 55, 40, 1.2), to: cam(225, 65, 45, 1.25) }, // s2 line 3 running and the operators
  { from: cam(150, 100, 60, 1.2), to: cam(140, 110, 60, 1.3) }, // s3 the sponsor and the team lead
  { from: cam(200, 80, 60, 1.1), to: cam(190, 85, 60, 1.15) }, // s4 the team together, the buyer at the cabinet side
  { from: cam(140, 115, 60, 1.2), to: cam(135, 118, 60, 1.25) }, // s5 the sponsor and the team lead
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.close.intro',
  title: { nl: 'Lijn 3 is af: het project afsluiten', en: 'Line 3 is done: closing the project' },
  module: 'pm.close',
  // the narrowest box that draws a topic title: the closing grid's tile (GRID.tile 190 less its padding); the route's rows
  // are wider. "Retrospective" (150 units) does not fit the kit's 128-unit tile, so the film declares the width it draws
  tileUnits: 178,
  // the map: per topic of pm.close, the scene that explains it and its tile
  topics: {
    proof: { scene: 's2', cue: 'tProof' },
    closure: { scene: 's3', cue: 'tClosure' },
    learn: { scene: 's4', cue: 'tLearn' },
    client: { scene: 's5', cue: 'tClient' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén project, vier onderwerpen', en: 'One project, four topics' },
      beats: [
        { nl: 'De zomerstop is voorbij. Lijn 3 draait nu in hal B.', en: 'The summer shutdown is over. Line 3 now runs in hall B.', focus: ['goal', 'line3', 'calendar'] },
        { nl: 'Het werk is klaar, het project nog niet. Is het doel gehaald?', en: 'The work is done, the project is not. Has the goal been met?', focus: ['ask', 'goal', 'sponsor'] },
        { nl: 'We volgen dit ene project langs de vier onderwerpen van de module.', en: 'We follow this one project through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Resultaat aantonen', en: 'Proving results' },
      beats: [
        { nl: 'Eerste onderwerp: Resultaat aantonen. Werkte het echt?', en: 'First topic: Proving results. Did it really work?', focus: ['tProof', 'line3'] },
        { nl: 'Draait lijn 3 nog even snel? Meet op dezelfde manier als voor de verhuizing.', en: 'Does line 3 still run as fast? Measure the same way as before the move.', focus: ['base', 'line3', 'crew'] },
        { nl: 'Eén goede week bewijst niets. Elke week schommelt: dat is {t:Ruis|ruis}.', en: 'One good week proves nothing. Every week varies: that is {t:Noise|noise}.', cue: { Ruis: 'noise' }, focus: ['noise', 'crew'] },
        { nl: 'We gebruiken vaak een {t:Nulmeting|nulmeting} en een {t:Run chart|run chart}.', en: 'We often use a {t:Baseline|baseline} and a {t:Run chart|run chart}.', cue: { Nulmeting: 'tool1', 'Run chart': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Overdracht en afsluiting', en: 'Handover and closure' },
      beats: [
        { nl: 'Tweede onderwerp: Overdracht en afsluiting. Wanneer is het project klaar?', en: 'Second topic: Handover and closure. When is the project done?', focus: ['tClosure', 'sponsor'] },
        { nl: 'De sponsor loopt de lijst van het begin langs. Alles gehaald, dan volgt de {t:Ondertekening|ondertekening}.', en: 'The sponsor goes through the list from the start. All met, then comes the {t:Sign-off|sign-off}.', cue: { Ondertekening: 'sign' }, focus: ['criteria', 'sign', 'sponsor'] },
        { nl: 'Eén punt blijft open: lijn 4 komt later. Het staat op de {t:Openpuntenlijst|openpuntenlijst}.', en: 'One point stays open: line 4 comes later. It goes on the {t:Open points list|open points list}.', cue: { Openpuntenlijst: 'open' }, focus: ['open', 'line4', 'teamlead'] },
        { nl: 'Dan sluit je af: urencode, {t:Eindfactuur|eindfactuur} en toegang.', en: 'Then you close down: time code, {t:Final invoice|final invoice} and access.', cue: { Eindfactuur: 'closeout' }, focus: ['closeout', 'sponsor'] },
        { nl: 'We gebruiken vaak {t:Acceptatiecriteria|acceptatiecriteria} en een {t:Afsluitchecklist|afsluitchecklist}.', en: 'We often use {t:Acceptance criteria|acceptance criteria} and a {t:Close-out checklist|close-out checklist}.', cue: { Acceptatiecriteria: 'tool1', Afsluitchecklist: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Terugblik en lessen', en: 'Retrospective and lessons' },
      beats: [
        { nl: 'Derde onderwerp: Terugblik en lessen. Wat nemen we mee?', en: 'Third topic: Retrospective and lessons learned. What do we take with us?', focus: ['tLearn', 'crew', 'teamlead'] },
        { nl: 'Het team kijkt terug, ook de operators. Dat is een {t:Terugblik|terugblik}.', en: 'The team looks back, the operators too. That is a {t:Retrospective|retrospective}.', cue: { Terugblik: 'retro' }, focus: ['retro', 'crew', 'teamlead'] },
        { nl: 'Praten over wat misging kan alleen als het veilig voelt: {t:Psychologische veiligheid|psychologische veiligheid}.', en: 'Talking about what went wrong only works when it feels safe: {t:Psychological safety|psychological safety}.', cue: { 'Psychologische veiligheid': 'safe' }, focus: ['safe', 'crew'] },
        { nl: 'De les wordt een {t:Actie|actie}: de inkoper vraagt een vaste leverdatum.', en: 'The lesson becomes an {t:Action|action}: the buyer asks for a fixed delivery date.', cue: { Actie: 'action' }, focus: ['action', 'buyer', 'switch'] },
        { nl: 'We gebruiken vaak een {t:Tijdlijn|tijdlijn} en een {t:Lessenrapport|lessenrapport}.', en: 'We often use a {t:Timeline|timeline} and a {t:Lessons report|lessons report}.', cue: { Tijdlijn: 'tool1', Lessenrapport: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Klantrelatie en vervolg', en: 'Client relationship and follow-up' },
      beats: [
        { nl: 'Vierde onderwerp: Klantrelatie en vervolg. Hoe laat je de klant sterker achter?', en: 'Fourth topic: Client relationship and follow-up. How do you leave the client stronger?', focus: ['tClient', 'sponsor'] },
        { nl: 'Het {t:Eindrapport|eindrapport} is één A4. {t:Antwoord eerst|Antwoord eerst}, het bewijs eronder.', en: 'The {t:Closing report|closing report} is one page. {t:Answer first|Answer first}, the evidence below.', cue: { Eindrapport: 'report', 'Antwoord eerst': 'report' }, focus: ['report', 'sponsor'] },
        { nl: 'Dan ga je weg. De teamleider meet zelf verder: geen {t:Afhankelijkheid|afhankelijkheid} van jou.', en: 'Then you leave. The team lead keeps measuring: no {t:Dependency|dependency} on you.', cue: { Afhankelijkheid: 'leave' }, focus: ['leave', 'teamlead'] },
        { nl: 'We gebruiken vaak een {t:Klantevaluatie|klantevaluatie} en een {t:Follow-up|follow-up}.', en: 'We often use a {t:Client evaluation|client evaluation} and a {t:Follow-up|follow-up}.', cue: { Klantevaluatie: 'tool1', 'Follow-up': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén afsluiting', en: 'One close' },
      beats: [
        { nl: 'Het hangt samen: bewijs, handtekening, les en een klant die zelf verder kan.', en: 'It all connects: proof, signature, lesson and a client who can carry on.', focus: ['flow', 'sponsor', 'teamlead'] },
        { nl: 'Het project is niet alleen klaar, maar afgesloten. Lijn 3 draait, en de lijn is van het team.', en: 'The project is not only done but closed. Line 3 runs, and the line belongs to the team.', focus: ['end', 'line3', 'crew'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: Afsluiten is het laatste station op de weg van een project.', en: 'The map of Projects: Close is the last station on the road of a project.', focus: 'map-close' },
        { nl: 'Afsluiten heeft vier onderwerpen, elk met vier niveaus.', en: 'Close has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Resultaat aantonen, op niveau Basis.', en: 'Start with Proving results, at Basics level.', focus: ['tProof', 'start'] },
        { nl: 'Werkkennis: een run chart lezen, administratief afsluiten, je eigen reflectie, opvolging.', en: 'Working knowledge: read a run chart, close out the paperwork, reflect on yourself, follow up.', focus: 'lv2' },
        { nl: 'Gevorderd: je eigen effect scheiden, voortijdig stoppen, een terugblik ontwerpen, het evaluatiegesprek.', en: 'Advanced: separate your own effect, stop early, design a retrospective, hold the client evaluation.', focus: 'lv3' },
        { nl: 'Expert: een claim die standhoudt, registers overdragen, lessen laten reizen, weggaan zonder afhankelijkheid.', en: 'Expert: a claim that holds, hand over registers, make lessons travel, leave without dependency.', focus: 'lv4' },
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
// explaining them. Words checked with espeak-ng phonemes through Piper's own
// bridge (nl_NL-alex): nothing in this film needs a SAY rule of its own (run chart
// has its rule above; follow-up is read like stand-up). The word "operators" is
// not said in Dutch (the voice reads it "oo-pe-raa-tors"); the caption may show it.
const SAY = [
  [ // s1 one project, four topics
    { nl: 'De zomerstop is voorbij. Lijn 3 draait nu in hal B.',
      en: 'The summer shutdown is over. Line 3 now runs in hall B.' },
    { nl: 'Het werk is klaar, maar het project nog niet. Het doel was lijn 3 in hal B, even snel als vroeger. Is dat gehaald?',
      en: 'The work is done, but the project is not. The goal was line 3 in hall B, as fast as before. Has it been met?' },
    { nl: 'We volgen dit ene project langs de vier onderwerpen van de module. De details komen later, in de lessen.',
      en: 'We follow this one project through the four topics of the module. The details come later, in the lessons.' },
  ],
  [ // s2 proving results
    { nl: 'Het eerste onderwerp is Resultaat aantonen. Werkte het echt?',
      en: 'The first topic is Proving results. Did it really work?' },
    { nl: 'Draait lijn 3 nog even snel? Dan meet je op precies dezelfde manier als voor de verhuizing.',
      en: 'Does line 3 still run as fast? Then you measure in exactly the same way as before the move.' },
    { nl: 'Eén goede week bewijst niets. Elke week schommelt een beetje, ook zonder de verhuizing. Dat is {t:Ruis|ruis}.',
      en: 'One good week proves nothing. Every week varies a little, even without the move. That is {t:Noise|noise}.' },
    { nl: 'Bij resultaat aantonen gebruiken we vaak een nulmeting en een run chart.',
      en: 'For proving results we often use a baseline and a run chart.' },
  ],
  [ // s3 handover and closure
    { nl: 'Het tweede onderwerp is Overdracht en afsluiting. Wanneer is het project klaar?',
      en: 'The second topic is Handover and closure. When is the project done?' },
    { nl: 'De sponsor loopt de lijst langs die jullie aan het begin hebben afgesproken. Alles is gehaald. Dan volgt de ondertekening, het formele ja van de sponsor.',
      en: 'The sponsor goes through the list you agreed at the start. All of it is met. Then comes the sign-off, the sponsor’s formal yes.' },
    { nl: 'Eén punt blijft open, want lijn 4 komt later. Het staat op de openpuntenlijst. De teamleider is de eigenaar, want hij blijft als het project weg is.',
      en: 'One point stays open, because line 4 comes later. It goes on the open points list. The team lead is the owner, because he stays when the project is gone.' },
    { nl: 'Dan sluit je af. De urencode gaat dicht, de eindfactuur gaat weg en de toegang wordt ingetrokken. Anders boeken mensen er nog uren op.',
      en: 'Then you close down. The time code is closed, the final invoice goes out and access is revoked. Otherwise people keep booking hours.' },
    { nl: 'Bij overdracht en afsluiting gebruiken we vaak acceptatiecriteria en een afsluitchecklist.',
      en: 'For handover and closure we often use acceptance criteria and a close-out checklist.' },
  ],
  [ // s4 retrospective and lessons
    { nl: 'Het derde onderwerp is Terugblik en lessen. Wat nemen we mee naar het volgende project?',
      en: 'The third topic is Retrospective and lessons learned. What do we take to the next project?' },
    { nl: 'Het team kijkt terug, ook de mensen van de lijn. Wat herhalen we, en wat doen we de volgende keer anders? Dat is een terugblik.',
      en: 'The team looks back, the people on the line too. What do we repeat, and what do we do differently next time? That is a retrospective.' },
    { nl: 'Praten over wat misging kan alleen als het veilig voelt. Dat heet psychologische veiligheid.',
      en: 'Talking about what went wrong only works when it feels safe. That is called psychological safety.' },
    { nl: 'Een les wordt een actie, met een eigenaar en een moment. De schakelkast kwam te laat. Dus vraagt de inkoper bij de volgende start om een vaste leverdatum.',
      en: 'A lesson becomes an action, with an owner and a moment. The switchboard came late. So at the next start the buyer asks for a fixed delivery date.' },
    { nl: 'Bij terugblik en lessen gebruiken we vaak een tijdlijn en een lessenrapport.',
      en: 'For retrospective and lessons we often use a timeline and a lessons report.' },
  ],
  [ // s5 client relationship and follow-up
    { nl: 'Het vierde onderwerp is Klantrelatie en vervolg. Hoe laat je de klant sterker achter?',
      en: 'The fourth topic is Client relationship and follow-up. How do you leave the client stronger?' },
    { nl: 'Het eindrapport is één A4. Antwoord eerst, het bewijs staat eronder.',
      en: 'The closing report is one page. Answer first, the evidence is below it.' },
    { nl: 'Dan ga je weg. De teamleider doet de metingen zelf. Zo blijft er geen afhankelijkheid van jou.',
      en: 'Then you leave. The team lead does the measuring alone. So there is no dependency on you.' },
    { nl: 'Bij klantrelatie en vervolg gebruiken we vaak een klantevaluatie en een follow-up.',
      en: 'For client relationship and follow-up we often use a client evaluation and a follow-up.' },
  ],
  [ // s6 one close
    { nl: 'Het hangt samen. Het resultaat is bewezen, dus de sponsor tekent. De les is een actie, en de klant kan zelf verder.',
      en: 'It all connects. The result is proven, so the sponsor signs. The lesson is an action, and the client can carry on alone.' },
    { nl: 'Het project is niet alleen klaar, maar afgesloten. Lijn 3 draait, en de lijn is van het team.',
      en: 'The project is not only done but closed. Line 3 runs, and the line belongs to the team.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Afsluiten is het laatste station op de weg van een project.',
      en: 'This is the map of Projects. Close is the last station on the road of a project.' },
    { nl: 'Afsluiten heeft vier onderwerpen, elk met vier niveaus.',
      en: 'Close has four topics, each with four levels.' },
    { nl: 'Begin bij Resultaat aantonen, op niveau Basis.',
      en: 'Start with Proving results, at Basics level.' },
    { nl: 'Op Werkkennis lees je een run chart en sluit je administratief af. Dan volgen je eigen reflectie en de opvolging.',
      en: 'At Working knowledge you read a run chart and close out the paperwork. Then come your own reflection and the follow-up.' },
    { nl: 'Op Gevorderd scheid je je eigen effect, stop je voortijdig en ontwerp je een terugblik. En je voert het evaluatiegesprek.',
      en: 'At Advanced you separate your own effect, stop early and design a retrospective. And you hold the client evaluation.' },
    { nl: 'Op Expert maak je een claim die standhoudt. Je draagt registers over, laat lessen reizen en gaat weg zonder afhankelijkheid.',
      en: 'At Expert you make a claim that holds. You hand over registers, make lessons travel and leave without dependency.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="installer"],[data-cue="buyer"],[data-cue="crew"],[data-cue="teamlead"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 nu staat, zoals in de intro van Plannen, de film over het hele project en de intro van Uitvoeren. Op de vloer lijn 3 op zijn plek; ernaast staat lijn 4, die blijft. Links de stroomkast met de kabel van buiten, aan de achterwand hangt de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop waren. Per onderwerp komen er mensen bij: de sponsor, de teamleider van de lijn, twee operators en de inkoper. Rechts een paneel, gemarkeerd als voorbeeld of schema: het doel van de intake, lijn 3 in hal B even snel als vroeger, met de vraag van de sponsor of het gehaald is, en de vier onderwerpen van de module als tegels; de snelheid voor de verhuizing naast de snelheid nu, met weekwaarden die een beetje schommelen; de punten van de lijst van het begin met een vinkje en de handtekening van de sponsor, een open punt voor lijn 4 met de teamleider als eigenaar en de afsluiting van urencode, eindfactuur en toegang; een terugblik, veilig praten en een actie voor een vaste leverdatum met de inkoper als eigenaar; een eindrapport van één A4 met het antwoord eerst en de overdracht van de adviseur aan de teamleider; per onderwerp twee namen van hulpmiddelen; en de keten van bewijs naar handtekening naar les naar een klant die zelf verder kan. Aan het eind de kaart van Projecten met Afsluiten verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 stands now, as in the intro of Plan, the film about the whole project and the intro of Run. On the floor line 3 in its place; next to it stands line 4, which stays. At the left the power cabinet with the cable from outside, on the back wall the switchboard hangs, and on the side wall a calendar whose last three weeks were the summer shutdown. Each topic brings people: the sponsor, the team lead of the line, two operators and the buyer. At the right a panel, marked as an example or a diagram: the goal of the intake, line 3 in hall B as fast as before, with the sponsor’s question whether it is met, and the module’s four topics as tiles; the speed before the move next to the speed now, with weekly values that vary a little; the points of the list from the start with a tick and the sponsor’s signature, an open point for line 4 with the team lead as owner and the closing of time code, final invoice and access; a retrospective, safe speaking and an action for a fixed delivery date with the buyer as owner; a closing report of one page with the answer first and the adviser handing over to the team lead; two tool names per topic; and the chain from proof to signature to lesson to a client who can carry on. At the end the map of Projects with Close lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

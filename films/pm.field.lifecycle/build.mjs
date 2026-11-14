// Dev tool, not shipped. Builds the field film "Een project van begin tot eind /
// A project from start to finish" (pm.field.lifecycle), the first field film
// (v17): the level above the module intros. It places the five modules of the
// lifecycle field (FIELDS in src/content/courses/index.js: intake, plan, run,
// land, close) on one road and says, per station, what happens there and what
// goes wrong without it. The map, not a lesson: no calculations, one number.
//
//   node films/pm.field.lifecycle/build.mjs            build the page
//   node films/pm.field.lifecycle/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.field.lifecycle.html: one offline page with
// the anatomy kit, the stage script and the player inlined. The index names it
// (the field's `film`), sw.js precaches it; the app shows field films from Task 7.
//
// The story is the pilot's project (pm.plan.intro, "Lijn 3 verhuist"), so the two
// films agree: packing line 3 moves to hall B in the three-week summer shutdown.
// Here it walks the whole road, drawn in the same hall with the same cast:
//   s1 the road: the hall, line 3's outline and the shutdown; the five stations
//   s2 Intake: the question behind the question ("move line 3": why, and when is
//      it done?), the goal and the sponsor; without it, the wrong problem
//   s3 Plannen: the pilot's four topics in one line (the work, the order, the
//      duration, the risks) and a pointer to the Planning intro; without it, the
//      late power supply found in the last week (the pilot's critical path)
//   s4 Uitvoeren: an honest status (the switchboard comes later: amber), a change
//      request for line 4 that the sponsor decides; without it, the watermelon
//   s5 Landen: a work instruction and training on the floor, the handover to the
//      line and adoption; without it, the result slips once the project is gone
//   s6 Afsluiten: proving the result against the baseline, the sponsor's sign-off,
//      a retrospective; without it, nobody knows and the next project repeats it
//   s7 the shared Projects map (the kit's mapScene, as the app draws it) with the
//      five stations lit: the whole road, then the zoom moves station by station
//      (the whole map's labels are about 7 px at 390 px; at 1.5 a lit label is 22
//      units), and back out: start with the intake
// Definitions as the Basis lessons word them (pm.intake.ask, .stakeholders,
// pm.run.status, .scope, pm.land.training, .change, .sustain, pm.close.results,
// .acceptance, .retro; the plan in one line as pm.plan.intro). Terms come from the
// field's lessons and the {n:} number from the field's text (the kit's field mode,
// films/_kit/build-film.mjs); the kit holds the film to its road (every module
// named in a caption of its own scene, in the order of the road, explained in two
// beats and lit, ending on the map with the field's places lit), to the narration
// guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast, the buyer, the installer (with a hard
// hat) and two operators with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs),
// and the things of hall B from the pilot (films/pm.plan.intro/hall.mjs), imported.
// A panel at the right, in stage space, draws each station as a schema, labelled
// "voorbeeld" (the line's move) or "schema" (the road).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { mapScene, mapStyles, mapCue } from '../_kit/mapscene.mjs';
import { wrapUnits, CHAR_W, STATION_UNITS } from '../_kit/assert.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { FIELDS } from '../../src/content/courses/index.js';
import pmMap from '../../src/content/courses/maps/pm.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the field
// The road this film draws, asserted against the index (the build fails if the
// field's modules move), and the Basis lessons' words the narration leans on.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const FIELD = FIELDS.find((f) => f.id === 'pm.field.lifecycle');
const ROAD = ['pm.intake', 'pm.plan', 'pm.run', 'pm.land', 'pm.close'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the lifecycle field is the road intake, plan, run, land, close');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2: the question behind the question, the goal, the sponsor
has('pm.intake.ask', ['Het doel is wat er meetbaar anders moet zijn', 'Een project op het symptoom lost niks op', 'lost misschien het verkeerde op']);
has('pm.intake.ask', ['The goal is what should be measurably different', 'may fix the wrong thing'], 'en');
has('pm.intake.stakeholders', ['Sponsor: eigenaar van budget en resultaat, en kan beslissen']);
// s3: the pilot's four topics; the new power supply as its critical path
has('pm.plan.schedule', ['langste keten van afhankelijk werk', 'bepaalt de einddatum']);
// s4: an honest status, the watermelon, the change request the sponsor decides, the steering group
has('pm.run.status', ['rood, oranje of groen', 'groen van buiten, rood van binnen', 'Slecht nieuws vroeg is goedkoop']);
has('pm.run.scope', ['Scope creep is die scope die ongemerkt groeit', 'een wijzigingsverzoek: een schriftelijk verzoek met de impact, waar de sponsor over beslist']);
has('pm.run.rhythm', ['De sponsor en senior managers die om de paar weken samenkomen om de besluiten te nemen die het team niet kan nemen']);
// s5: the work instruction and training on the job, adoption, the slip after the project
has('pm.land.training', ['één A4 per taak', 'foto’s van de echte apparatuur', 'Train vlak voordat mensen het nodig hebben']);
has('pm.land.training', ['one page per task', 'photos of the real equipment'], 'en');
has('pm.land.change', ['ook als niemand kijkt']);
has('pm.land.change', ['also when nobody is watching'], 'en');
has('pm.land.sustain', ['resultaten zakken vaak een paar maanden na het einde van het project weg']);
// s6: the baseline measured the same way, the sponsor's signature, the retrospective's questions
has('pm.close.results', ['gemeten op dezelfde manier als erna']);
has('pm.close.acceptance', ['De ondertekening is het formele ja van de sponsor']);
has('pm.close.retro', ['wat herhalen we, wat veranderen we', 'wat doen we de volgende keer anders']);
has('pm.close.retro', ['what do we repeat, what do we change'], 'en');

// ---------------------------------------------------------------- the world (hall B, as the pilot)
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

// the people: the sponsor and the team lead of the line are the pm cast; the installer, the buyer and the two
// operators are pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
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
  g('pp-buyer', scrumPerson(w, k, G, P, { x: 224, y: 96, key: 'buyer', look: 'po', along: 'x' })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the five stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s6 a numbered square of the strip under the heading. The shared Projects map (mapScene,
// the five stations lit) sits under the panel; its places are cue groups of their own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('goal', g('goalB', '')) + cueG('ask', g('askB', ''))
  + cueG('plan4', g('plan4B', '')) + cueG('more', g('moreB', ''))
  + cueG('status', g('statusB', '')) + cueG('change', g('changeB', ''))
  + cueG('instr', g('instrB', '')) + cueG('handover', g('handB', ''))
  + cueG('proof', g('proofB', '')) + cueG('sign', g('signB', '')) + cueG('retro', g('retroB', ''))
  + cueG('without', g('withoutB', '')));
const MAP = (await mapScene({ subject: 'pm', highlight: ROAD })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
for (const id of ROAD) assert(MAP.includes(`data-cue="${mapCue(id)}"`), `the map lights ${id} as a cue group`);
// the centre of each station's place on the map, for the zoom of the closing scene
const MAPZ = ROAD.map((id) => { const p = pmMap.places.find((x) => x.module === id); return [p.x + p.w / 2, p.y + p.h / 2]; });
// Static paths with relative line-tos (the helper of pm.plan.schedule and the pilot): the
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
// stage while the hall scales by s (camera() in stage.js). Each scene looks at what its station is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3's floor and the calendar
  { from: cam(110, 100, 70, 1.12), to: cam(118, 100, 70, 1.18) }, // s2 the sponsor and the empty floor
  { from: cam(70, 60, 60, 1.2), to: cam(110, 65, 60, 1.15) }, // s3 the cabinet, the installer and the calendar
  { from: cam(170, 80, 90, 1.1), to: cam(140, 90, 80, 1.08) }, // s4 the switchboard, the buyer and line 4
  { from: cam(200, 85, 60, 1.2), to: cam(195, 90, 60, 1.24) }, // s5 line 3, the operators and the team lead
  { from: cam(150, 90, 60, 1.1), to: cam(145, 85, 70, 1) }, // s6 the whole hall, finished
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.field.lifecycle',
  title: { nl: 'Een project van begin tot eind', en: 'A project from start to finish' },
  field: 'pm.field.lifecycle',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De weg van een project', en: 'The road of a project' },
      beats: [
        { nl: 'Een fabriek bouwt een nieuwe hal. Lijn 3 moet erheen, in de zomerstop van {n:3} weken.', en: 'A plant is building a new hall. Line 3 must move there, in the {n:3}-week summer shutdown.', focus: ['goal', 'floor', 'calendar'] },
        { nl: 'Elk project loopt dezelfde weg, langs vijf stations.', en: 'Every project walks the same road, past five stations.', focus: 'road' },
        { nl: 'Per station: wat er gebeurt, en wat er misgaat als je het overslaat.', en: 'At each station: what happens, and what goes wrong if you skip it.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Intake', en: 'Intake' },
      beats: [
        { nl: 'Het eerste station is Intake: de vraag achter de vraag.', en: 'The first station is Intake: the question behind the question.', focus: ['st-intake', 'ask'] },
        { nl: 'Het {t:Doel|doel}: wat er na de stop meetbaar anders is. De {t:Sponsor|sponsor} beslist.', en: 'The {t:Goal|goal}: what is measurably different after the shutdown. The {t:Sponsor|sponsor} decides.', cue: { Doel: 'goal', Sponsor: 'sponsor' }, focus: ['goal', 'sponsor'] },
        { nl: 'Zonder intake los je misschien het verkeerde probleem op.', en: 'Without an intake you may solve the wrong problem.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Plannen', en: 'Plan' },
      beats: [
        { nl: 'Het tweede station is Plannen: van het doel naar een plan waar mensen in geloven.', en: 'The second station is Plan: from the goal to a plan people believe in.', focus: ['st-plan', 'plan4', 'calendar'] },
        { nl: 'Het werk, de volgorde, de duur en de risico’s. De intro van Plannen laat ze zien.', en: 'The work, the order, the duration and the risks. The intro of Plan shows them.', focus: ['plan4', 'more'] },
        { nl: 'Zonder plan blijkt pas in de laatste week dat de stroom niet klaar is.', en: 'Without a plan you only find out in the last week that the power is not ready.', focus: ['without', 'power', 'installer'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Uitvoeren', en: 'Run' },
      beats: [
        { nl: 'Het derde station is Uitvoeren: het project in beweging houden.', en: 'The third station is Run: keeping the project moving.', focus: 'st-run' },
        { nl: 'Een eerlijke {t:RAG-status|status}: de schakelkast komt later, dus nu al oranje.', en: 'An honest {t:RAG status|status}: the switchboard comes later, so amber now.', cue: { 'RAG-status': 'status' }, focus: ['status', 'switch', 'buyer'] },
        { nl: 'Lijn 4 ook meteen? Een {t:Wijzigingsverzoek|wijzigingsverzoek}, en de sponsor kiest.', en: 'Line 4 as well? A {t:Change request|change request}, and the sponsor chooses.', cue: { Wijzigingsverzoek: 'change' }, focus: ['change', 'line4', 'sponsor'] },
        { nl: 'Zonder sturing blijft het groen tot het te laat is.', en: 'Without steering it stays green until it is too late.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Landen', en: 'Land' },
      beats: [
        { nl: 'Het vierde station is Landen: de verandering laten beklijven.', en: 'The fourth station is Land: making the change stick.', focus: ['st-land', 'line3'] },
        { nl: 'Een {t:Werkinstructie|werkinstructie} met foto’s, en training op de vloer.', en: 'A {t:Work instruction|work instruction} with photos, and training on the floor.', cue: { Werkinstructie: 'instr' }, focus: ['instr', 'crew'] },
        { nl: 'Dan neemt de lijn het over. {t:Adoptie|Adoptie}: werken op de nieuwe manier, ook als niemand kijkt.', en: 'Then the line takes over. {t:Adoption|Adoption}: working the new way, even when nobody is watching.', cue: { Adoptie: 'crew' }, focus: ['handover', 'teamlead', 'crew'] },
        { nl: 'Zonder landen zakt het resultaat weg, een paar maanden na het project.', en: 'Without landing the result slips, a few months after the project.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Afsluiten', en: 'Close' },
      beats: [
        { nl: 'Het laatste station is Afsluiten: het werk is klaar, het project nog niet.', en: 'The last station is Close: the work is done, the project is not.', focus: 'st-close' },
        { nl: 'Meten zoals in de {t:Nulmeting|nulmeting}, van voor de verhuizing. Dan tekent de sponsor.', en: 'Measure as in the {t:Baseline|baseline}, from before the move. Then the sponsor signs.', cue: { Nulmeting: 'proof' }, focus: ['proof', 'sign', 'sponsor'] },
        { nl: 'Een {t:Terugblik|terugblik}: wat herhalen we, en wat doen we de volgende keer anders?', en: 'A {t:Retrospective|retrospective}: what do we repeat, and what do we change next time?', cue: { Terugblik: 'retro' }, focus: ['retro', 'crew'] },
        { nl: 'Zonder afsluiten weet niemand of het werkte, en herhaalt het volgende project de fouten.', en: 'Without closing nobody knows if it worked, and the next project repeats the mistakes.', focus: 'without' },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: de vijf stations liggen op één weg.', en: 'The map of Projects: the five stations lie on one road.', focus: MAPS },
        { nl: 'Eerst Intake en Plannen: de vraag en het plan.', en: 'First Intake and Plan: the question and the plan.', focus: MAPS.slice(0, 2) },
        { nl: 'Dan Uitvoeren en Landen: het werk en de verandering.', en: 'Then Run and Land: the work and the change.', focus: MAPS.slice(2, 4) },
        { nl: 'Tot slot Afsluiten: aantonen en leren.', en: 'Finally Close: proving and learning.', focus: MAPS.slice(4) },
        { nl: 'Elk station is een module met vier onderwerpen. Begin bij Intake.', en: 'Each station is a module with four topics. Start with Intake.', focus: MAPS[0] },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said
// once. Short sentences, few colons and comma lists, no symbols the voice would
// read aloud and nothing in parentheses (the kit's narration guard, checkNarration,
// holds every field film to that; the render guard caps a pause inside a sentence
// at 0.4 s). Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex): this film's SAY group (the last of the Dutch list in
// films/_kit/timeline.mjs) says "de intake" as in-teek, "De operators krijgen"
// with ope-raators and "nu op oranje" with o-ranje, in these phrases only.
const SAY = [
  [ // s1 the road
    { nl: 'Een fabriek bouwt een nieuwe hal. Verpakkingslijn 3 moet erheen, in de zomerstop van {n:3} weken.',
      en: 'A plant is building a new hall. Packing line 3 has to move there, during the summer shutdown of {n:3} weeks.' },
    { nl: 'Elk project loopt dezelfde weg, langs vijf stations.',
      en: 'Every project walks the same road, past five stations.' },
    { nl: 'Bij elk station zie je wat er gebeurt, en wat er misgaat als je het overslaat.',
      en: 'At each station you see what happens, and what goes wrong if you skip it.' },
  ],
  [ // s2 intake
    { nl: 'Het eerste station is de intake. De vraag is, verhuis lijn 3. Je vraagt door, naar de vraag erachter. Waarom moet het, en wanneer is het gelukt?',
      en: 'The first station is the intake. The request is, move line 3. You dig deeper, to the question behind it. Why does it have to happen, and when is it done?' },
    { nl: 'Het antwoord wordt het {t:Doel|doel}, wat er meetbaar anders moet zijn. Na de stop draait lijn 3 in hal B, even snel als nu. De sponsor is eigenaar van budget en resultaat, en beslist.',
      en: 'The answer becomes the {t:Goal|goal}, what must be measurably different. After the shutdown line 3 runs in hall B, as fast as it does now. The sponsor owns the budget and the result, and decides.' },
    { nl: 'Sla je de intake over, dan los je misschien het verkeerde probleem op.',
      en: 'Skip the intake, and you may solve the wrong problem.' },
  ],
  [ // s3 plan
    { nl: 'Het tweede station is Plannen. Van het doel maak je een plan waar mensen in geloven.',
      en: 'The second station is Plan. You turn the goal into a plan that people believe in.' },
    { nl: 'Het werk, de volgorde, de duur en de risico’s. De intro van Plannen laat ze een voor een zien.',
      en: 'The work, the order, the duration and the risks. The intro of Plan shows them one by one.' },
    { nl: 'Zonder plan merk je pas in de laatste week van de stop dat de nieuwe stroom niet klaar is. Dan is het te laat.',
      en: 'Without a plan you only notice in the last week of the shutdown that the new power supply is not ready. Then it is too late.' },
  ],
  [ // s4 run
    { nl: 'Het derde station is Uitvoeren. Nu moet het project in beweging blijven.',
      en: 'The third station is Run. Now the project has to keep moving.' },
    { nl: 'Met een eerlijke status. De schakelkast komt later dan gepland, dus zet je de status nu op oranje.',
      en: 'With an honest status. The switchboard will arrive later than planned, so you set the status to amber now.' },
    { nl: 'Iemand vraagt of lijn 4 meteen mee kan. Dat wordt een {t:Wijzigingsverzoek|wijzigingsverzoek}, en de sponsor kiest in de stuurgroep.',
      en: 'Someone asks whether line 4 can come along too. That becomes a {t:Change request|change request}, and the sponsor chooses in the steering group.' },
    { nl: 'Zonder sturing krijg je een watermeloenproject. Groen van buiten, rood van binnen, tot het te laat is.',
      en: 'Without steering you get a watermelon project. Green outside, red inside, until it is too late.' },
  ],
  [ // s5 land
    { nl: 'Het vierde station is Landen. Lijn 3 staat, en nu moet de nieuwe manier van werken blijven.',
      en: 'The fourth station is Land. Line 3 is in place, and now the new way of working has to stick.' },
    { nl: 'De operators krijgen een werkinstructie met foto’s van de echte lijn, en training op de vloer.',
      en: 'The operators get a work instruction with photos of the real line, and training on the floor.' },
    { nl: 'Dan neemt de lijn het over. Het gaat om {t:Adoptie|adoptie}. Mensen werken op de nieuwe manier, ook als niemand kijkt.',
      en: 'Then the line takes over. It is about {t:Adoption|adoption}. People work the new way, even when nobody is watching.' },
    { nl: 'Sla je dit over, dan zakt het resultaat een paar maanden na het project weer weg.',
      en: 'Skip this, and the result slips back a few months after the project.' },
  ],
  [ // s6 close
    { nl: 'Het laatste station is Afsluiten. Het werk is klaar, het project nog niet.',
      en: 'The last station is Close. The work is done, the project is not.' },
    { nl: 'Je meet de lijn op dezelfde manier als in de {t:Nulmeting|nulmeting}, van voor de verhuizing. Dan tekent de sponsor.',
      en: 'You measure the line the same way as in the {t:Baseline|baseline}, from before the move. Then the sponsor signs.' },
    { nl: 'Daarna een terugblik. Wat herhalen we, en wat doen we de volgende keer anders?',
      en: 'Then a retrospective. What do we repeat, and what do we do differently next time?' },
    { nl: 'Zonder afsluiten weet niemand of het werkte. En het volgende project maakt dezelfde fouten.',
      en: 'Without closing, nobody knows whether it worked. And the next project makes the same mistakes.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. De vijf stations liggen op één weg. Eromheen liggen de andere delen van het vak.',
      en: 'This is the map of Projects. The five stations lie on one road. Around it lie the other parts of the field.' },
    { nl: 'Eerst de intake en Plannen, de vraag en het plan.',
      en: 'First the intake and Plan, the question and the plan.' },
    { nl: 'Dan Uitvoeren en Landen, het werk en de verandering.',
      en: 'Then Run and Land, the work and the change.' },
    { nl: 'Tot slot Afsluiten, aantonen en leren.',
      en: 'Finally Close, proving and learning.' },
    { nl: 'Elk station is een module met vier onderwerpen. Begin bij de intake.',
      en: 'Each station is a module with four topics. Start with the intake.' },
  ],
];
// Each scene's length from its share of the Dutch narration, never shorter than its captions need (as the pilot).
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst ROW = ${STATION_UNITS};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="installer"],[data-cue="buyer"],[data-cue="crew"],[data-cue="teamlead"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-range{fill:color-mix(in srgb,var(--fp-accent) 16%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-buf{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 3}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.pm-road{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-dasharray:6 6;stroke-linecap:round}
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-cross{fill:none;stroke:var(--anatomy-muted);stroke-width:2.4;stroke-linecap:round}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
.pm-rag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-g{fill:#5E9A6B;stroke:#4A7F56;stroke-width:1.2}
.pm-rag-a{fill:#D49A35;stroke:#B07B22;stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-range,.pm-buf,.pm-out,.pm-dot){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de intro van Plannen. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met de kabel van buiten, aan de achterwand de plek van de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per station komen er mensen bij: de sponsor, de installateur van buiten met een helm, de inkoper, twee operators en de teamleider van de lijn. Later staat lijn 3 op zijn plek en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema: de weg met vijf stations, Intake, Plannen, Uitvoeren, Landen en Afsluiten; per station wat er gebeurt en, gestippeld, wat er misgaat zonder. Bij Intake de vraag, de vragen erachter en het doel; bij Plannen vier tegels voor werk, volgorde, duur en risico; bij Uitvoeren een status met drie lampen en een wijzigingsverzoek voor lijn 4; bij Landen een werkinstructie, training en de overdracht van project naar lijn; bij Afsluiten de nulmeting naast de meting na de stop, de handtekening van de sponsor en een terugblik. Aan het eind de kaart van Projecten met de vijf stations verlicht, eerst helemaal en dan station voor station van dichtbij.',
  en: 'Hall B of the plant, where line 3 has to go, as in the intro of Plan. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with the cable from outside, on the back wall the place of the switchboard, and on the side wall a calendar whose last three weeks are the summer shutdown. Each station brings people: the sponsor, the outside installer in a hard hat, the buyer, two operators and the team lead of the line. Later line 3 stands in place and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram: the road with five stations, Intake, Plan, Run, Land and Close; per station what happens and, dashed, what goes wrong without it. At Intake the request, the questions behind it and the goal; at Plan four tiles for work, order, duration and risk; at Run a status with three lights and a change request for line 4; at Land a work instruction, training and the handover from the project to the line; at Close the baseline next to the measurement after the shutdown, the sponsor’s signature and a retrospective. At the end the map of Projects with the five stations lit, first whole and then station by station up close.',
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

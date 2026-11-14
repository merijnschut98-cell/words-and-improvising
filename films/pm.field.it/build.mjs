// Dev tool, not shipped. Builds the field film "IT en agile / IT and agile"
// (pm.field.it), the fourth field film (v17): the level above the module intros. It
// places the four modules of the IT field (FIELDS in src/content/courses/index.js:
// agile, scaled, devops, itproject) on one road and says, per station, what it is for,
// when you meet it, which two tools of the module you use there (named, not explained:
// the checkpoint rule of 14 Nov) and what goes wrong without it. The map, not a lesson:
// no calculations, no numbers.
//
//   node films/pm.field.it/build.mjs            build the page
//   node films/pm.field.it/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.field.it.html: one offline page with the anatomy
// kit, the stage script and the player inlined. The index names it (the field's `film`),
// sw.js precaches it.
//
// The story continues the pilot's world and field films 1 to 3: line 3 runs in hall B
// and the plant brings in a new MES for the orders on the floor. You lead that IT
// project for the plant manager (the sponsor of the world); the IT team builds the MES.
// The MES is the laptop on the table at the left of the hall (cue "mes"); the room
// stays the same hall B, only its cast changes per station.
//   s1 the opening: line 3 runs in hall B, the new MES (orders per line, what is made,
//      what is rejected); the plant manager, you and the IT team; the road with four
//      stations
//   s2 Agile en Scrum (pm.agile): the IT team builds in short rounds, sprints, and
//      users react after each; a kanban board and planning poker (pm.agile.board,
//      .points); without it you find out after months that you built the wrong thing
//   s3 Opschalen: SAFe en verder (pm.scaled): one team is too small for the whole MES,
//      so the teams plan together to one rhythm; PI Planning and WSJF
//      (pm.scaled.piplanning, .wsjf); without it the whole gets stuck, one team waiting
//      for another
//   s4 DevOps en levering (pm.devops): whoever builds the MES keeps it running; a new
//      version goes through test and acceptance before the floor; a pipeline and a
//      feature flag (pm.devops.pipeline, .flags); without it every step is manual work
//   s5 IT-projecten leiden (pm.itproject): from requirements and vendor to go-live;
//      the test levels, then the cutover weekend; MoSCoW and a cutover plan
//      (pm.itproject.mvp, .cutover); without it nobody knows what belongs in and the
//      switchover is improvised
//   s6 the shared Projects map (the kit's mapScene, as the app draws it) with the four
//      stations lit, the zoom place by place at 1.5, and back out
// The tools come from the modules' own lessons (checked below), each a method or an
// artefact the lesson teaches and a term of its glossary; two of them (planning poker,
// PI Planning, WSJF, MoSCoW, the cutover plan) sit above the Basis lesson of their
// topic, next to a Basis one or a Basis-level topic. Terms come from the field's lessons
// (the kit's field mode, films/_kit/build-film.mjs); the kit holds the film to its road
// (every module named in a caption of its own scene, in the order of the road, explained
// in two beats and lit, ending on the map with the field's places lit), to the
// narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor and the
// team lead from its cast, two operators with pm.agile.scrum's cast
// (films/pm.agile.scrum/cast.mjs), and the things of hall B from the pilot
// (films/pm.plan.intro/hall.mjs), imported. A panel at the right draws each station as
// four small schemas (what it is for, how it works, then one for each tool as it is
// named), two chips with the tools and a dashed card with what goes wrong without it.
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
import { FIELDS, MODULES } from '../../src/content/courses/index.js';
import pmMap from '../../src/content/courses/maps/pm.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));


// ---------------------------------------------------------------- the field
// The road this film draws, asserted against the index (the build fails if the
// field's modules move), and the lessons' words the narration leans on: the lessons
// the tool names come from (the names are terms of those lessons) and the Basis
// lessons for what each station is for and what goes wrong without it.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const FIELD = FIELDS.find((f) => f.id === 'pm.field.it');
const ROAD = ['pm.agile', 'pm.scaled', 'pm.devops', 'pm.itproject'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the IT field is the road agile, scaled, devops, itproject');
// the panel heading draws the module's title in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = MODULES.find((m) => m.id === id).title[lang];
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2 agile: waterfall found out too late, short rounds and the feedback loop, sprints, MES teams; the kanban board and planning poker
has('pm.agile.whyagile', ['Dan ontdek je na maanden dat je het verkeerde hebt gebouwd', 'Je werkt in korte rondes van één tot vier weken', 'Die cyclus van maken, laten zien en bijsturen heet een feedbacklus']);
has('pm.agile.whyagile', ['Then you find out after months that you built the wrong thing', 'You work in short rounds of one to four weeks', 'That cycle of making, showing and adjusting is a feedback loop'], 'en');
has('pm.agile.scrumbasics', ['Het werk gebeurt in sprints: vaste periodes van hooguit een maand, vaak twee weken', 'In de fabriek zie je Scrum vooral bij IT-teams voor MES']);
has('pm.agile.scrumbasics', ['The work happens in sprints: fixed periods of one month or less, often two weeks', 'In factories you mostly see Scrum in IT teams for MES'], 'en');
has('pm.agile.board', ['Het hart is het kanbanbord: een bord met kolommen voor de stappen in het werk', 'Kanbanbord Een bord met kolommen']);
has('pm.agile.board', ['At its heart is the Kanban board: a board with columns for the steps in the work', 'Kanban board A board with columns'], 'en');
has('pm.agile.points', ['Planning poker is een manier om samen te schatten', 'Planning poker Samen schatten met kaarten']);
has('pm.agile.points', ['Planning poker is a way of estimating together', 'Planning poker Estimating together with cards'], 'en');
// s3 scaled: one team is too small, a dependency, the train and its cadence; PI Planning and WSJF
has('pm.scaled.why', ['Eén Scrum-team telt meestal hooguit tien mensen', 'toch loopt het geheel vast, omdat team A wacht op werk van team B', 'Het hart van SAFe is de Agile Release Train', 'Die vaste tijden heten de cadans', 'Een PI bestaat uit een paar iteraties']);
has('pm.scaled.why', ['One Scrum team usually has ten people at most', 'the whole still gets stuck, because team A waits for work from team B', 'The heart of SAFe is the Agile Release Train', 'Those fixed times are the cadence', 'A PI consists of a few iterations'], 'en');
has('pm.scaled.piplanning', ['PI Planning is volgens SAFe een event voor de hele trein', 'Afhankelijkheden komen op het ART Planning Board', 'PI Planning Event van meestal twee dagen']);
has('pm.scaled.piplanning', ['PI Planning is an event for the whole train', 'Dependencies go on the ART Planning Board', 'PI Planning Event of usually two days'], 'en');
has('pm.scaled.wsjf', ['WSJF, Weighted Shortest Job First, is de Cost of Delay gedeeld door de duur van het werk', 'Hoogste score eerst']);
has('pm.scaled.wsjf', ['WSJF, Weighted Shortest Job First, is the Cost of Delay divided by the duration of the work', 'Highest score first'], 'en');
// s4 devops: the wall between building and running, the pipeline's steps, manual steps; environments; the feature flag
has('pm.devops.pipeline', ['DevOps is de werkwijze die die muur weghaalt: één team is verantwoordelijk voor bouwen én draaien', 'Het hart van DevOps is de pipeline: een geautomatiseerde lopende band', 'Stap 4: dat artefact wordt geïnstalleerd op een testomgeving en later op de echte systemen', 'Elke handmatige stap is een plek waar fouten en wachttijd ontstaan']);
has('pm.devops.pipeline', ['DevOps is the way of working that removes that wall: one team is responsible for building and running', 'The heart of DevOps is the pipeline: an automated conveyor', 'Step 4: that artefact is installed on a test environment and later on the real systems', 'Every manual step is a place where errors and waiting arise'], 'en');
has('pm.devops.environments', ['In de testomgeving (test environment) draaien de automatische tests', 'zo getrouw mogelijke kopie van productie', 'Productie is de echte situatie']);
has('pm.devops.environments', ['In the test environment the automated tests run', 'as faithful a copy of production as possible', 'Production is the real situation'], 'en');
has('pm.devops.flags', ['Het gereedschap daarvoor is een feature flag', 'bijvoorbeeld alleen voor lijn 2']);
has('pm.devops.flags', ['The tool for that is a feature flag', 'for example only for line 2'], 'en');
// s5 itproject: requirements, the vendor, the MES and go-live, the test levels, MoSCoW, the cutover plan and its Monday 06:00 clock
has('pm.itproject.requirements', ['Een requirement is iets wat het nieuwe systeem moet doen of moet zijn', 'Elke vage regel wordt later een discussie of iets wel “in scope” was']);
has('pm.itproject.requirements', ['A requirement is something the new system must do or must be', 'Every vague line later becomes a discussion about whether something was “in scope”'], 'en');
has('pm.itproject.saas', ['De softwareleverancier maakt het pakket', 'De implementatiepartner is een apart bedrijf']);
has('pm.itproject.saas', ['The software vendor makes the package', 'The implementation partner is a separate company'], 'en');
has('pm.itproject.rollout', ['Een MES is het systeem op de vloer dat de orders per lijn aanstuurt en registreert wat er gemaakt, verbruikt en afgekeurd wordt', 'De go-live is de dag dat het nieuwe systeem het officiële wordt']);
has('pm.itproject.rollout', ['An MES is the system on the floor that runs orders per line and records what is made, used and scrapped', 'Go-live is the day the new system becomes the official one'], 'en');
has('pm.itproject.uat', ['Eerst test de partner zijn eigen configuratie: de systeemtest. Dan de ketentest', 'Dan de UAT, de gebruikersacceptatietest']);
has('pm.itproject.uat', ['First the partner tests its own configuration: the system test. Then the chain test', 'Then the UAT, the user acceptance test'], 'en');
has('pm.itproject.mvp', ['MoSCoW is een manier om requirements in vier bakken te sorteren: Must have, Should have, Could have en Won’t have this time']);
has('pm.itproject.mvp', ['MoSCoW is a way to sort requirements into four bins: Must have, Should have, Could have and Won’t have this time'], 'en');
has('pm.itproject.cutover', ['Het cutoverdraaiboek is het script daarvoor, uur voor uur', 'Niets daarin wordt geïmproviseerd', 'Het begint met een freeze: vanaf een vast moment, bijvoorbeeld vrijdag 18:00', 'heeft om 06:00 orders, etiketten en de weegschalen nodig']);
has('pm.itproject.cutover', ['The cutover plan is the hour-by-hour script for it', 'Nothing in it is improvised', 'It starts with a freeze: from a fixed moment, for example Friday 18:00', 'needs orders, labels and the scales at 06:00'], 'en');

// ---------------------------------------------------------------- the world (hall B, as the pilot, with the MES on a table)
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
// the new MES: a laptop on a small table at the front of the hall, the screen toward the viewer (the IT side of the story)
const MESTAB = { x: 70, y: 112, w: 58, d: 30, h: 74 };
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the sponsor (the plant manager) and the team lead of the line are the pm cast, the two operators are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOn', cablePath(false))),
  cueG('switch', g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  cueG('mes', w.table(MESTAB) + w.laptop({ x: MESTAB.x + MESTAB.w / 2, y: MESTAB.y + MESTAB.d / 2, z: MESTAB.h, toward: 1 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the four stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s5 a numbered square of the strip under the heading. The shared Projects map (mapScene,
// the four stations lit) sits under the panel; its places are cue groups of their own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('goal', g('goalB', '')) + cueG('people5', g('peopleB', '')) + cueG('for', g('forB', ''))
  + cueG('t1', g('t1B', '')) + cueG('t2', g('t2B', ''))
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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor
  { from: cam(105, 110, 70, 1), to: cam(100, 115, 70, 1.07) }, // s2 the IT team at the MES laptop
  { from: cam(130, 100, 70, 1), to: cam(135, 100, 70, 1.05) }, // s3 the hall: many teams, one product
  { from: cam(150, 90, 70, 1), to: cam(155, 90, 70, 1.05) }, // s4 line 3 on the floor, where the software arrives
  { from: cam(110, 105, 70, 1), to: cam(105, 105, 70, 1.05) }, // s5 the plant manager and the team lead at the go-live
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
const TOOLCUE = (a, b) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2'] });
const DURS = Array(6).fill(30);
const spec = {
  id: 'pm.field.it',
  title: { nl: 'IT en agile', en: 'IT and agile' },
  field: 'pm.field.it',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Het nieuwe MES', en: 'The new MES' },
      beats: [
        { nl: 'Lijn 3 draait in hal B. Nu komt er een nieuw MES voor de orders op de vloer.', en: 'Line 3 runs in hall B. Now a new MES is coming for the orders on the floor.', focus: ['goal', 'line3', 'mes'] },
        { nl: 'Jij leidt dat IT-project voor de plantmanager. Het IT-team bouwt het MES.', en: 'You lead that IT project for the plant manager. The IT team builds the MES.', focus: ['people5', 'sponsor', 'mes'] },
        { nl: 'Vier stations: in korte rondes werken, met veel teams, veilig leveren en het project leiden.', en: 'Four stations: working in short cycles, with many teams, delivering safely and leading the project.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Agile en Scrum', en: 'Agile and Scrum' },
      beats: [
        { nl: 'Het eerste station is Agile en Scrum: het IT-team bouwt het MES in korte rondes, sprints.', en: 'The first station is Agile and Scrum: the IT team builds the MES in short rounds, called sprints.', focus: ['st-agile', 'for', 'mes'] },
        { nl: 'Na elke ronde proberen gebruikers het uit, en het team stuurt bij.', en: 'After each round users try it out, and the team adjusts.', focus: ['for', 'mes'] },
        { nl: 'Je gebruikt een {t:Kanbanbord|kanbanbord} en {t:Planning poker|planning poker}.', en: 'You use a {t:Kanban board|Kanban board} and {t:Planning poker|planning poker}.', ...TOOLCUE('Kanbanbord', 'Planning poker') },
        { nl: 'Zonder dit merk je pas na maanden dat je het verkeerde hebt gebouwd.', en: 'Without this you only find out after months that you built the wrong thing.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Opschalen: SAFe en verder', en: 'Scaling: SAFe and beyond' },
      beats: [
        { nl: 'Het tweede station is Opschalen: SAFe en verder. Eén team is te klein voor het hele MES.', en: 'The second station is Scaling: SAFe and beyond. One team is too small for the whole MES.', focus: ['st-scaled', 'for', 'mes'] },
        { nl: 'Dan plannen de teams samen en werken ze op één ritme, als een trein.', en: 'Then the teams plan together and work to one rhythm, like a train.', focus: ['for', 'sponsor'] },
        { nl: 'Je gebruikt {t:PI Planning|PI Planning} en {t:WSJF|WSJF}.', en: 'You use {t:PI Planning|PI Planning} and {t:WSJF|WSJF}.', ...TOOLCUE('PI Planning', 'WSJF') },
        { nl: 'Zonder dit loopt het geheel vast, omdat het ene team op het andere wacht.', en: 'Without this the whole gets stuck, because one team waits for another.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'DevOps en levering', en: 'DevOps and delivery' },
      beats: [
        { nl: 'Het derde station is DevOps en levering: wie het MES bouwt, houdt het ook draaiend.', en: 'The third station is DevOps and delivery: whoever builds the MES also keeps it running.', focus: ['st-devops', 'for', 'mes'] },
        { nl: 'Een nieuwe versie gaat eerst langs test en acceptatie, en pas daarna naar de vloer.', en: 'A new version goes through test and acceptance first, and only then to the floor.', focus: ['for', 'line3', 'crew'] },
        { nl: 'Je gebruikt een {t:Pipeline|pipeline} en een {t:Feature flag|feature flag}.', en: 'You use a {t:Pipeline|pipeline} and a {t:Feature flag|feature flag}.', ...TOOLCUE('Pipeline', 'Feature flag') },
        { nl: 'Zonder dit blijft elke stap handwerk, en daar ontstaan fouten en wachttijd.', en: 'Without this every step stays manual, and that is where errors and waiting arise.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'IT-projecten leiden', en: 'Leading IT projects' },
      beats: [
        { nl: 'Het vierde station is IT-projecten leiden: van eisen en leverancier tot de go-live.', en: 'The fourth station is Leading IT projects: from requirements and vendor to go-live.', focus: ['st-itproject', 'for', 'sponsor', 'teamlead'] },
        { nl: 'Daarna testen echte gebruikers het MES, en dan volgt het cutover-weekend.', en: 'Then real users test the MES, and then comes the cutover weekend.', focus: ['for', 'sponsor', 'teamlead'] },
        { nl: 'Je gebruikt {t:MoSCoW|MoSCoW} en een {t:Cutoverdraaiboek|cutoverdraaiboek}.', en: 'You use {t:MoSCoW|MoSCoW} and a {t:Cutover plan|cutover plan}.', ...TOOLCUE('MoSCoW', 'Cutoverdraaiboek') },
        { nl: 'Zonder dit is onduidelijk wat erin hoort, en wordt de omschakeling geïmproviseerd.', en: 'Without this it is unclear what belongs in, and the switchover is improvised.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: de vier stations van IT en agile liggen naast elkaar.', en: 'The map of Projects: the four stations of IT and agile lie side by side.', focus: MAPS },
        { nl: 'Eerst Agile en Scrum: agile denken, Scrum, backlog en Kanban.', en: 'First Agile and Scrum: the agile mindset, Scrum, backlog and Kanban.', focus: MAPS[0] },
        { nl: 'Dan Opschalen: SAFe en verder. Daar gaat het om SAFe, portfolio, alternatieven en hybride werken.', en: 'Then Scaling: SAFe and beyond. It covers SAFe, portfolio, alternatives and hybrid working.', focus: MAPS[1] },
        { nl: 'Dan DevOps en levering: de pipeline, DORA, releases en incidenten.', en: 'Then DevOps and delivery: the pipeline, DORA, releases and incidents.', focus: MAPS[2] },
        { nl: 'Tot slot IT-projecten leiden: eisen, leverancier, go-live en testen.', en: 'Finally Leading IT projects: requirements, vendor, go-live and testing.', focus: MAPS[3] },
        { nl: 'Elk station is een module met vier onderwerpen. Begin waar het nu knelt.', en: 'Each station is a module with four topics. Start where it hurts.', focus: MAPS },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said once. Short sentences, few
// colons and comma lists, no symbols the voice would read aloud and nothing in parentheses (the kit's narration
// guard, checkNarration, holds every field film to that; the render guard caps a pause inside a sentence at
// 0.4 s). Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): see this film's
// SAY group (the last of the Dutch list in films/_kit/timeline.mjs) for what needed a rule.
const SAY = [
  [ // s1 the opening
    { nl: 'Lijn 3 draait in hal B. Nu komt er een nieuw MES, het systeem dat de orders op de vloer aanstuurt.',
      en: 'Line 3 runs in hall B. Now a new MES is coming, the system that runs the orders on the floor.' },
    { nl: 'Jij leidt dat IT-project voor de plantmanager. Het IT-team bouwt het MES.',
      en: 'You lead that IT project for the plant manager. The IT team builds the MES.' },
    { nl: 'Daar horen vier stations bij. Korte rondes, veel teams, veilig leveren en het project leiden.',
      en: 'That takes four stations. Short cycles, many teams, safe delivery and leading the project.' },
  ],
  [ // s2 agile
    { nl: 'Het eerste station is Agile en Scrum. Het IT-team bouwt het MES in korte rondes, sprints genoemd.',
      en: 'The first station is Agile and Scrum. The IT team builds the MES in short rounds, called sprints.' },
    { nl: 'Na elke ronde proberen gebruikers het uit. Daarna stuurt het team bij.',
      en: 'After each round users try it out. Then the team adjusts.' },
    { nl: 'Je gebruikt een {t:Kanbanbord|kanbanbord} en {t:Planning poker|planning poker}.',
      en: 'You use a {t:Kanban board|Kanban board} and {t:Planning poker|planning poker}.' },
    { nl: 'Zonder dit merk je pas na maanden dat je het verkeerde hebt gebouwd.',
      en: 'Without this you only find out after months that you built the wrong thing.' },
  ],
  [ // s3 scaled
    { nl: 'Het tweede station is Opschalen, SAFe en verder. Eén team is te klein voor het hele MES.',
      en: 'The second station is Scaling, SAFe and beyond. One team is too small for the whole MES.' },
    { nl: 'Dan plannen de teams samen en werken ze op één ritme, als een trein.',
      en: 'Then the teams plan together and work to one rhythm, like a train.' },
    { nl: 'Je gebruikt {t:PI Planning|PI Planning} en {t:WSJF|WSJF}.',
      en: 'You use {t:PI Planning|PI Planning} and {t:WSJF|WSJF}.' },
    { nl: 'Zonder dit loopt het geheel vast, omdat het ene team op het andere wacht.',
      en: 'Without this the whole gets stuck, because one team waits for another.' },
  ],
  [ // s4 devops
    { nl: 'Het derde station is DevOps en levering. Wie het MES bouwt, houdt het ook draaiend.',
      en: 'The third station is DevOps and delivery. Whoever builds the MES also keeps it running.' },
    { nl: 'Een nieuwe versie gaat eerst langs test en acceptatie. Pas daarna gaat hij naar de vloer.',
      en: 'A new version goes through test and acceptance first. Only then does it go to the floor.' },
    { nl: 'Je gebruikt een {t:Pipeline|pipeline} en een {t:Feature flag|feature flag}.',
      en: 'You use a {t:Pipeline|pipeline} and a {t:Feature flag|feature flag}.' },
    { nl: 'Zonder dit blijft elke stap handwerk, en daar ontstaan fouten en wachttijd.',
      en: 'Without this every step stays manual, and that is where errors and waiting arise.' },
  ],
  [ // s5 itproject
    { nl: 'Het vierde station is IT-projecten leiden. Van eisen en leverancier tot de go-live.',
      en: 'The fourth station is Leading IT projects. From requirements and vendor to go-live.' },
    { nl: 'Daarna testen echte gebruikers het MES. Dan volgt het cutover-weekend.',
      en: 'Then real users test the MES. Then comes the cutover weekend.' },
    { nl: 'Je gebruikt {t:MoSCoW|MoSCoW} en een {t:Cutoverdraaiboek|cutoverdraaiboek}.',
      en: 'You use {t:MoSCoW|MoSCoW} and a {t:Cutover plan|cutover plan}.' },
    { nl: 'Zonder dit is onduidelijk wat erin hoort, en wordt de omschakeling geïmproviseerd.',
      en: 'Without this it is unclear what belongs in, and the switchover is improvised.' },
  ],
  [ // s6 the map
    { nl: 'Dit is de kaart van Projecten. De vier stations van IT en agile liggen naast elkaar.',
      en: 'This is the map of Projects. The four stations of IT and agile lie side by side.' },
    { nl: 'Eerst Agile en Scrum. Daar gaat het om agile denken, Scrum, backlog en Kanban.',
      en: 'First Agile and Scrum. It covers the agile mindset, Scrum, backlog and Kanban.' },
    { nl: 'Dan Opschalen, SAFe en verder. Daar gaat het om SAFe, portfolio, alternatieven en hybride werken.',
      en: 'Then Scaling, SAFe and beyond. It covers SAFe, portfolio, alternatives and hybrid working.' },
    { nl: 'Dan DevOps en levering. Daar gaat het om de pipeline, DORA, releases en incidenten.',
      en: 'Then DevOps and delivery. It covers the pipeline, DORA, releases and incidents.' },
    { nl: 'Tot slot IT-projecten leiden. Daar gaat het om eisen, leverancier, go-live en testen.',
      en: 'Finally Leading IT projects. It covers requirements, vendor, go-live and testing.' },
    { nl: 'Elk station is een module met vier onderwerpen. Begin waar het nu knelt.',
      en: 'Each station is a module with four topics. Start where it hurts.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst ROW = ${STATION_UNITS};\nconst HEAD = 284;\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait, zoals in de intro van Plannen. Op de vloer lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, aan de zijwand een kalender en voorin een tafel met een laptop: het nieuwe MES. Eerst staan de teamleider en de operators bij lijn 3; later komt de sponsor erbij, de plantmanager. Rechts een paneel, gemarkeerd als voorbeeld of schema. Eerst het nieuwe MES met zijn orders per lijn, dan jij, de plantmanager en het IT-team, en de weg met vier stations. Dan per station een schema, twee namen van hulpmiddelen en, gestippeld, wat er misgaat zonder: bij Agile en Scrum korte rondes en een lus van maken, laten zien en bijsturen, met een kanbanbord en planning poker; bij Opschalen een team dat op een ander wacht en een vast ritme van iteraties, met PI Planning en WSJF; bij DevOps en levering één team dat bouwt en draait en de reeks test, acceptatie en productie, met een pipeline en een feature flag; bij IT-projecten leiden de weg van eisen via leverancier naar go-live en de testniveaus, met MoSCoW en een cutoverdraaiboek. Aan het eind de kaart van Projecten met de vier stations verlicht, eerst helemaal en dan plek voor plek van dichtbij.',
  en: 'Hall B of the plant, where line 3 runs, as in the intro of Plan. On the floor line 3 in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, on the side wall a calendar and at the front a table with a laptop: the new MES. First the team lead and the operators stand at line 3; later the sponsor joins, the plant manager. At the right a panel, marked as an example or a diagram. First the new MES with its orders per line, then you, the plant manager and the IT team, and the road with four stations. Then per station a schema, two names of tools and, dashed, what goes wrong without it: at Agile and Scrum short rounds and a loop of making, showing and adjusting, with a Kanban board and planning poker; at Scaling a team waiting for another and a fixed rhythm of iterations, with PI Planning and WSJF; at DevOps and delivery one team that builds and runs and the series test, acceptance and production, with a pipeline and a feature flag; at Leading IT projects the road from requirements via vendor to go-live and the test levels, with MoSCoW and a cutover plan. At the end the map of Projects with the four stations lit, first whole and then place by place up close.',
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

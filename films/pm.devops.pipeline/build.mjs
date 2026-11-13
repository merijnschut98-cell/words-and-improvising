// Dev tool, not shipped. Builds the explainer film "Een commit door de
// pipeline / A commit through the pipeline" for the Projects course:
// pm.devops.pipeline (level 1 of the topic CI/CD-pipeline en testautomatisering)
// and pm.devops.fourkeys (level 1 of the topic DORA-metingen), both in DevOps
// en levering.
//
//   node films/pm.devops.pipeline/build.mjs            build the page
//   node films/pm.devops.pipeline/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.devops.pipeline.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.devops.pipeline, P1, 120 s: CI/CD and test automation, DORA metrics; "a
// change from commit to production in minutes; a red test, a rollback; the four
// DORA meters"; provisional storyboard: commit, build, unit tests, integration
// tests, deploy to staging, deploy to production, a failing test stops a bad
// change, a rollback, the four DORA meters move). Storyboard drift: the plan's
// 120 s are about 290 s in nine scenes, because a lesson with a film no longer
// shows its worked example (v16 notes), so the film carries the teach text and
// the example of both lessons: the pipeline (s1 to s5) and the four DORA
// metrics (s6 to s9). The storyboard's beats are there: commit to the test
// environment and production in minutes (s2 b1, s3, s5), the red test that
// stops a bad change (s3 b5, s4 b2), a rollback (s7 b2, as the fourkeys lesson
// names it: "terugdraaien"; s9 b4), the four meters moving (s6, s7, s9). Unit
// and integration tests are pm.devops.tests (level 2: its own terms, the test
// pyramid, flaky tests) and are not served, so the film says "automatische
// tests" as pm.devops.pipeline does; staging is the lesson's "testomgeving".
// The rollback lesson (pm.devops.rollback, level 4 of release management, with
// roll forward, expand-contract and flag debt) is not served either.
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   pipeline teach 1: two camps in IT, developers (development) build new
//     software, operators (operations) keep the systems running; one wants fast
//     change, the other calm (s1 b1; development and operations on the card);
//     code thrown over the wall (s1 b2); DevOps removes the wall: one team
//     responsible for building and running, automating everything that recurs
//     (s1 b3); the word around 2009, Patrick Debois, the first DevOpsDays in
//     Ghent (s1 b4)
//   pipeline teach 2: the heart of DevOps, the pipeline: an automated conveyor
//     taking every change through the same steps, developer to user (s2 b1);
//     version control, usually Git, keeps every version and shows who changed
//     what (s2 b2); a commit, a small package of changes with a short
//     explanation (s2 b3)
//   pipeline teach 3: after a commit the pipeline starts by itself; step 1 the
//     build, code turned into something a computer can run (s3 b1); step 2
//     automated tests check everything still works (s3 b2); step 3 the result
//     stored as an artefact, a fixed package that no longer changes (s3 b3); step
//     4 installed on a test environment and later the real systems (s3 b4); a
//     step fails: the conveyor stops, the team is told at once (s3 b5)
//   pipeline teach 4: for a Lean consultant familiar: standard work for
//     software, same route, predictable outcome (s4 b1); stopping at a fault is
//     jidoka, the Toyota idea that a machine stops as soon as something goes
//     wrong, so faults are not passed on (s4 b2); small commits like small
//     batches, less work in between, faults seen sooner (s4 b3); in proposals
//     often called CI/CD, continuous integration and continuous delivery, both
//     in the next lessons (s4 b4)
//   pipeline teach 5: "we are not a software company, DevOps is not for us";
//     but an MES (the system that tracks orders and production on the floor),
//     label software and links to the ERP change more and more (s4 b5); the
//     sharp question, how does a change get from the developer to the floor and
//     which steps are manual; every manual step a place for errors and waiting
//     (s4 b6)
//   pipeline example: a dairy plant, the supplier changes the label software,
//     the best-before date in a larger font (s5 b1); 09:00 commit "datum op
//     etiket groter", 09:01 the pipeline starts, build 3 minutes (s5 b2); 09:04
//     automated tests 8 minutes, checking among others the date's format (s5
//     b3); 09:12 the artefact, version 4.7.1, stored; 09:15 on the test
//     environment, quality prints a test label (s5 b4); total 15 minutes from
//     commit to test environment, without one manual step (s5 b5)
//   fourkeys teach 1: DORA, DevOps Research and Assessment, a research
//     programme surveying thousands of IT professionals yearly since 2014 (s6
//     b1); Nicole Forsgren, Jez Humble and Gene Kim summed up the first years in
//     Accelerate (2018); since late 2018 part of Google Cloud; the yearly State
//     of DevOps report, best known for a few metrics of how well a team
//     delivers software (s6 b2; the report's name also on the card)
//   fourkeys teach 2: two metrics about speed: deployment frequency, how often a
//     team puts a new version into production; three times a day, or once a
//     month (s6 b3); production, the real systems users use (s6 b4); change
//     lead time, from a commit, a saved change in version control, until it runs
//     in production: the part of the chain the team controls (s6 b5)
//   fourkeys teach 3: two metrics about stability: change fail rate, the share
//     of deployments needing immediate intervention (s7 b1), for example
//     rolling back or an urgent fix (s7 b2); failed deployment recovery time,
//     how long to recover when a deployment goes wrong (s7 b3); until 2023 MTTR
//     (mean time to restore); DORA narrowed it to failures from the team's own
//     change, not a power cut in the data centre (s7 b4)
//   fourkeys teach 4: together often called the four keys; the best teams score
//     well on all four; speed and stability not a trade-off but together,
//     because small changes are easier to test and recover (s7 b5); for a Lean
//     consultant lead time resembles lead time in a value stream, change fail
//     rate first pass yield, the share right first time, but reversed (s8 b1)
//   fourkeys teach 5: "we deploy only once a quarter, then less goes wrong";
//     DORA shows the reverse: rare big deployments fail more often and recover
//     slower (s8 b2); the sharp question: how often do you put something into
//     production, how often must you step in straight afterwards; nobody knows,
//     then nothing is measured yet (s8 b3)
//   fourkeys example: a confectionery plant's IT team builds links between ERP
//     and MES; you collect the numbers for the last 4 weeks (s9 b1); 8
//     deployments in 4 weeks, 8 / 4 = 2 per week (s9 b2); a typical change in
//     production 6 working days after the commit, mostly waiting for a weekly
//     test slot (s9 b3); 2 of the 8 rolled back at once, 2 / 8 = 25 %; the two
//     recovered after 1 and 3 hours (s9 b4); conclusion: fairly often, but one
//     in four goes wrong; that is where the first improvement lies (s9 b5)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts checked (2026-11-13), credited only as the lessons do: Patrick Debois
// organised the first DevOpsDays in Ghent in October 2009, where the word
// DevOps took hold. Jidoka is one of the two pillars of the Toyota Production
// System (stop at an abnormality). DORA: the State of DevOps research led by
// Nicole Forsgren with Jez Humble and Gene Kim from 2014; their book Accelerate
// (IT Revolution, 2018) sums up the 2014 to 2017 surveys; Google Cloud acquired
// DORA in December 2018. The four key metrics: deployment frequency, lead time
// for changes, change failure rate (DORA now writes "change fail rate") and
// time to restore service, which Accelerate called mean time to restore (MTTR);
// the 2023 report renamed and narrowed it to failed deployment recovery time,
// recovery from a failure caused by a change (dora.dev, "A history of DORA's
// software delivery metrics"). The film follows the lessons' names (the newer
// ones) and states nothing about the 2024 change (a fifth metric), which the
// lesson does not name. The dairy and the confectionery numbers are the
// lessons' own illustrations.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// project room with a whiteboard on the back wall that carries shapes only (no
// text there, so nothing on the stage is under 22 units). On a long table the
// pipeline as the lesson's own picture, a conveyor: five stations (a build box
// with a hopper, a test box with two probes, a shelf of sealed packages for
// the artefacts, a screen for the test environment, a server rack for
// production), each with a lamp on top, and a parcel for the commit that rides
// along the belt. People: you (the consultant, at the board), a developer with
// a laptop at the start of the belt and an operator at the production end (the
// Scrum film's cast, pm.agile.scrum/cast.mjs, imported, not edited). A panel
// at the right, in stage space, carries one card per scene, labelled "schema"
// or "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// belt, the parcel, each station and each layer of the board (each dial too).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS, MAX_TOTAL } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const PL = 'pm.devops.pipeline';
const FK = 'pm.devops.fourkeys';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(PL, ['Vroeger waren er in IT twee kampen', 'Ontwikkelaars (development) bouwden nieuwe software; beheerders (operations) hielden de systemen draaiend',
  'De een wilde snel veranderen, de ander wilde rust', 'Code werd “over de muur gegooid”', 'één team is verantwoordelijk voor bouwen én draaien, en automatiseert alles wat vaak terugkomt',
  'rond 2009, toen Patrick Debois in Gent de eerste DevOpsDays organiseerde',
  'een geautomatiseerde lopende band die elke wijziging in de code dezelfde stappen laat doorlopen, van ontwikkelaar tot gebruiker',
  'meestal Git, dat elke versie van de code bewaart en laat zien wie wat veranderde', 'een pakketje veranderingen met een korte uitleg',
  'Na een commit start de pipeline vanzelf', 'de code wordt omgezet in iets wat een computer kan draaien', 'automatische tests controleren of alles nog werkt',
  'artefact, een vast pakket dat niet meer verandert', 'geïnstalleerd op een testomgeving en later op de echte systemen', 'Faalt een stap, dan stopt de band en krijgt het team direct een melding',
  'Een pipeline is standaardwerk voor software: elke wijziging volgt dezelfde route, dus de uitkomst is voorspelbaar',
  'jidoka, de Toyota-gedachte dat een machine stopt zodra er iets misgaat, zodat je geen fouten doorgeeft',
  'kleine commits lijken op kleine series: minder tussenvoorraad, sneller zien wat er fout gaat', 'CI/CD (continuous integration en continuous delivery); die twee komen in de volgende lessen',
  '“Wij zijn geen softwarebedrijf, DevOps is niets voor ons.”', 'het systeem dat orders en productie op de vloer bijhoudt', 'etiketsoftware en koppelingen met het ERP worden ook steeds aangepast',
  '“Hoe komt een wijziging nu van de ontwikkelaar op de vloer, en welke stappen gaan met de hand?”', 'Elke handmatige stap is een plek waar fouten en wachttijd ontstaan',
  'zuivelfabriek laat de leverancier een kleine wijziging maken in de etiketsoftware: de houdbaarheidsdatum moet in een groter lettertype',
  '09:00 De ontwikkelaar doet een commit met de uitleg “datum op etiket groter”', '09:01 De pipeline start: de build duurt 3 minuten',
  '09:04 De automatische tests draaien 8 minuten en controleren onder andere dat de datum nog in het juiste formaat staat', '09:12 Het artefact, versie 4.7.1, wordt bewaard',
  '09:15 Het staat op de testomgeving; de kwaliteitsafdeling print een proefetiket', 'Totaal: 15 minuten van commit tot testomgeving, zonder één handmatige stap']);
says(FK, ['DORA staat voor DevOps Research and Assessment: een onderzoeksprogramma dat sinds 2014 jaarlijks duizenden IT-professionals ondervraagt',
  'Nicole Forsgren, Jez Humble en Gene Kim vatten de eerste jaren samen in het boek Accelerate (2018)', 'Sinds eind 2018 hoort DORA bij Google Cloud',
  'De jaarlijkse uitkomst heet het State of DevOps-rapport', 'een paar metingen die laten zien hoe goed een team software levert',
  'Twee metingen gaan over snelheid', 'hoe vaak een team een nieuwe versie in productie zet, de echte systemen die gebruikers gebruiken', 'drie keer per dag, of één keer per maand',
  'hoe lang het duurt van een commit, een opgeslagen wijziging in versiebeheer, tot die wijziging in productie draait. Dat is het deel van de keten dat het team zelf in de hand heeft',
  'Twee metingen gaan over stabiliteit', 'het aandeel van de deploys dat direct ingrijpen nodig heeft, bijvoorbeeld terugdraaien of een spoedreparatie',
  'hoe lang het duurt om te herstellen als een deploy misgaat', 'Tot 2023 heette die meting MTTR (mean time to restore); DORA beperkte hem toen tot storingen door een eigen wijziging, niet door bijvoorbeeld een stroomstoring in het datacenter',
  'Samen heten ze vaak de vier sleutels (four keys)', 'de beste teams scoren op alle vier goed', 'Snelheid en stabiliteit zijn geen ruil, maar gaan samen, omdat kleine wijzigingen makkelijker te testen en te herstellen zijn',
  'de doorlooptijd lijkt op doorlooptijd in een waardestroom, en het faalpercentage op first pass yield, het deel dat in één keer goed is, maar dan omgekeerd',
  '“Wij deployen maar één keer per kwartaal, want dan gaat er minder mis.”', 'zeldzame, grote deploys gaan vaker mis en herstellen duurt langer',
  '“Hoe vaak zetten jullie iets in productie, en hoe vaak moet je daarna direct ingrijpen?” Weet niemand het antwoord, dan wordt er nog niet gemeten',
  'Het IT-team van een snoepfabriek bouwt koppelingen tussen ERP en MES', 'cijfers over de afgelopen 4 weken', '8 deploys in 4 weken, dus 8 / 4 = 2 per week',
  'een typische wijziging staat 6 werkdagen na de commit in productie, vooral omdat hij wacht op een wekelijks testmoment',
  '2 van de 8 deploys moesten direct worden teruggedraaid. 2 / 8 = 25%', 'de twee mislukte deploys waren na 1 uur en na 3 uur hersteld',
  'het team levert redelijk vaak, maar één op de vier deploys gaat mis. Daar ligt de eerste verbetering']);
says(PL, ['Patrick Debois organised the first DevOpsDays in Ghent, Belgium', 'Stopping at a fault is jidoka', 'Total: 15 minutes from commit to test environment, without a single manual step'], 'en');
says(FK, ['Nicole Forsgren, Jez Humble and Gene Kim summed up the first years in the book Accelerate (2018)', 'Until 2023 this metric was called MTTR (mean time to restore)',
  'change fail rate resembles first pass yield, the share that is right first time, but reversed', '2 / 8 = 25%'], 'en');
assert(lessons.nl.get(PL).terms.map((t) => t.term).join() === 'DevOps,Pipeline,Versiebeheer,Commit,Build,Artefact', 'the six terms of pipeline');
assert(lessons.nl.get(FK).terms.map((t) => t.term).join() === 'DORA,Deployfrequentie,Doorlooptijd van een wijziging,Faalpercentage van wijzigingen,Hersteltijd na een mislukte deploy,Productie', 'the six terms of fourkeys');
for (const id of [PL, FK]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.devops.pipeline', `no other film is wired to ${id}`);
// the dairy label: commit at 09:00, start 09:01, build 3, tests 8, stored 09:12, test environment 09:15
const MIN = { start: 1, build: 1 + 3, tests: 1 + 3 + 8, env: 15 };
assert(MIN.build === 4 && MIN.tests === 12, 'build ends 09:04, tests end 09:12');
assert(MIN.env - 0 === 15, '15 minutes from commit to test environment');
// the confectionery plant: four weeks
assert(8 / 4 === 2, '8 deployments in 4 weeks: 2 a week');
assert(2 / 8 === 0.25, '2 of 8 rolled back: 25 percent');
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 8, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the whiteboard: each layer its own cue group, drawn by stage.js in the board's
// face plane (u = x, v = -z); the four dials sit inside one group, bMeters
const BOARD = w.board({ x0: 40, x1: 200, z0: 112, z1: 208 });
const BA = BOARD.area;
const DIALS = ['mFreq', 'mLead', 'mFail', 'mRec'];
const LAYERS = ['bWall', 'bGit', 'bBatch', 'bTime', 'bDeploys'];
const boardLayers = `<g transform="${BOARD.face}">${LAYERS.map((c) => cueG(c, g(c, ''))).join('')}${cueG('bMeters', DIALS.map((c) => cueG(c, g(c, ''))).join(''))}</g>`;
const AREA = { u0: r1(BA.x0 + 6), u1: r1(BA.x1 - 6), v0: r1(-BA.z1 + 6), v1: r1(-BA.z0 - 6) };

// the conveyor: a long table, a belt in front, five stations behind it
const TABLE = { x: 48, y: 118, w: 214, d: 52, h: 74 };
const TZ = TABLE.h;
const BELT = { x: 50, y: 145, w: 210, d: 16 };
const BZ = TZ + 5;
const STX = [88, 128, 168, 208, 248];
const PX0 = 60;
const STATIONS = ['stBuild', 'stTest', 'stArt', 'stEnv', 'stProd'];
const lampAt = [[STX[0] + 7, 137, TZ + 20], [STX[1], 137, TZ + 16], [STX[2], 139, TZ + 6], [STX[3], 136, TZ + 4], [STX[4], 131, TZ + 52]];
const LAMPS = lampAt.map(([x, y, z], i) => k.pathOf(k.circleRing(x, y, i === 2 ? 2.8 : 3.6, 20).map(([px, py]) => w.at([px, py, z + 0.2]).map(r1)), true));
const lamp = (i) => g(`lamp${i}`, '');
const stationSvg = [
  // build: a box with a hopper on top
  w.box({ x: STX[0] - 13, y: 122, w: 26, d: 20, r: 1 }, TZ, TZ + 20, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
    + w.box({ x: STX[0] - 9, y: 125, w: 11, d: 10, r: 0.8 }, TZ + 20, TZ + 27, { tone: 'hi' }, { steps: 2 }) + lamp(0),
  // tests: a box with two probes
  w.box({ x: STX[1] - 13, y: 122, w: 26, d: 20, r: 1 }, TZ, TZ + 16, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
    + w.post(STX[1] - 7, 127, 1.3, TZ + 16, TZ + 30, { tone: 'lo' }, 10) + w.post(STX[1] + 7, 127, 1.3, TZ + 16, TZ + 30, { tone: 'lo' }, 10) + lamp(1),
  // artefacts: a low shelf with sealed packages
  w.box({ x: STX[2] - 13, y: 122, w: 26, d: 20, r: 1 }, TZ, TZ + 6, { tone: 'lo' }, { steps: 2 })
    + w.box({ x: STX[2] - 12, y: 123, w: 11, d: 11, r: 0.8 }, TZ + 6, TZ + 16, { tone: 'hi' }, { steps: 2 })
    + w.box({ x: STX[2] + 1, y: 123, w: 11, d: 11, r: 0.8 }, TZ + 6, TZ + 16, { tone: 'hi' }, { steps: 2 })
    + w.box({ x: STX[2] - 6, y: 124, w: 11, d: 10, r: 0.8 }, TZ + 16, TZ + 26, { tone: 'hi' }, { steps: 2 }) + lamp(2),
  // test environment: a screen on a stand
  w.box({ x: STX[3] - 12, y: 122, w: 24, d: 20, r: 1 }, TZ, TZ + 4, { tone: 'lo' }, { steps: 2 })
    + w.post(STX[3], 126, 1.6, TZ + 4, TZ + 12, { tone: 'lo' }, 10)
    + w.box({ x: STX[3] - 13, y: 124, w: 26, d: 2, r: 0.5 }, TZ + 11, TZ + 30, { tone: 'hi' }, { steps: 2 }) + lamp(3),
  // production: a server rack with rows of lights
  w.box({ x: STX[4] - 12, y: 120, w: 24, d: 22, r: 1 }, TZ, TZ + 52, { tone: 'lo' }, { steps: 3, bevel: 0.4,
    extra: k.dotsSvg([0, 1, 2, 3, 4].flatMap((row) => [0, 1, 2, 3].map((c) => w.at([STX[4] - 8 + c * 5, 142.2, TZ + 10 + row * 8]))), { size: 0.55, tone: 'hi' }) }) + lamp(4),
];
const slats = [];
for (let x = BELT.x + 8; x < BELT.x + BELT.w; x += 10) slats.push(`M${w.at([x, BELT.y + 1, BZ]).map(r1).join(' ')}L${w.at([x, BELT.y + BELT.d - 1, BZ]).map(r1).join(' ')}`);
const belt = w.box({ ...BELT, r: 1 }, TZ, BZ, { tone: 'lo' }, { steps: 2 }) + k.lineSvg(slats.join(''), { tone: 'faint' });
const parcel = w.box({ x: PX0 - 5, y: BELT.y + 3, w: 10, d: 10, r: 1 }, BZ, BZ + 8, { tone: 'hi' }, { steps: 2, bevel: 0.3 })
  + k.lineSvg(`M${w.at([PX0 - 5, BELT.y + 8, BZ + 8]).map(r1).join(' ')}L${w.at([PX0 + 5, BELT.y + 8, BZ + 8]).map(r1).join(' ')}`, { tone: 'lo' });
const o0 = w.at([0, 0, 0]);
const o1 = w.at([1, 0, 0]);
const PV = [r1((o1[0] - o0[0]) * 1000) / 1000, r1((o1[1] - o0[1]) * 1000) / 1000];
const world = [
  w.room(ROOM),
  w.clock(252, 180, 11),
  cueG('board', BOARD.svg + boardLayers),
  w.person({ x: 222, y: 50, role: 'jij', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 24, y: 150, key: 'dev', look: 'dev2', along: 'y' }),
  w.table(TABLE),
  STATIONS.map((c, i) => cueG(c, stationSvg[i])).join(''),
  cueG('belt', belt),
  cueG('parcel', g('parcel', parcel, ' class="pm-parcel"')),
  w.cup(236, 166, TZ),
  scrumPerson(w, k, G, P, { x: 284, y: 200, key: 'ops', look: 'sm', along: 'y' }),
].join('');
for (const r of ['jij', 'dev', 'ops', 'board', 'belt', 'parcel', 'bMeters', ...STATIONS, ...LAYERS, ...DIALS]) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['camps', 'wall', 'devops', 'origin',
  'pipe', 'vc', 'commit',
  'build', 'tests', 'art', 'install', 'red',
  'std', 'jidoka', 'batch', 'cicd', 'notsw', 'ask',
  'dairy', 't1', 't2', 't3', 't4',
  'dora', 'book', 'freq', 'prodterm', 'lead',
  'fail', 'roll', 'rec', 'mttr', 'keys',
  'leanv', 'quarter', 'ask2',
  'candy', 'e1', 'e2', 'e3', 'e4'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.agile.scrum): the same points, fewer bytes; each rewrite is read back.
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
const BOARD_AT = w.at([(BA.x0 + BA.x1) / 2, 0, (BA.z0 + BA.z1) / 2]).map(r1);
const BCAM = (s) => [BOARD_AT[0], BOARD_AT[1] + 30, s];
const BELT_AT = w.at([155, 150, TZ]).map(r1);
const TCAM = (s) => [BELT_AT[0], BELT_AT[1], s];
const CAM = [
  { from: [160, 205, 1], to: BCAM(1.1) },
  { from: TCAM(1.02), to: TCAM(1.12) },
  { from: TCAM(1.06), to: TCAM(1.16) },
  { from: [160, 205, 1], to: TCAM(1.08) },
  { from: TCAM(1.04), to: BCAM(1.08) },
  { from: [160, 205, 1], to: BCAM(1.12) },
  { from: TCAM(1.04), to: BCAM(1.1) },
  { from: BCAM(1.06), to: [160, 205, 1] },
  { from: [160, 205, 1], to: BCAM(1.12) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, AREA, STX, PX0, PV, LAMPS, MIN };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.devops.pipeline',
  title: { nl: 'Een commit door de pipeline', en: 'A commit through the pipeline' },
  lessons: [PL, FK],
  strictFocus: true,
  scenes: [
    sc('s1', PL, 1, { nl: 'Twee kampen, één team', en: 'Two camps, one team' }, [
      { nl: 'Vroeger twee kampen: ontwikkelaars bouwen, beheerders houden alles draaiend.', en: 'There used to be two camps: developers build, operators keep things running.', focus: ['camps', 'dev', 'ops'] },
      { nl: 'De een wil veranderen, de ander rust. Code werd over de muur gegooid.', en: 'One wants change, the other calm. Code was thrown over the wall.', focus: ['wall', 'bWall'] },
      { nl: '{t:DevOps|DevOps}: één team bouwt én draait, en automatiseert wat vaak terugkomt.', en: '{t:DevOps|DevOps}: one team builds and runs, and automates what recurs.', cue: { DevOps: 'devops' }, focus: ['devops', 'bWall'] },
      { nl: 'Het woord ontstond rond 2009: Patrick Debois organiseerde de eerste DevOpsDays in Gent.', en: 'The word appeared around 2009: Patrick Debois organised the first DevOpsDays in Ghent.', focus: 'origin' },
    ]),
    sc('s2', PL, 1, { nl: 'De lopende band', en: 'The conveyor' }, [
      { nl: 'Het hart: de {t:Pipeline|pipeline}, een automatische lopende band van ontwikkelaar tot gebruiker.', en: 'The heart: the {t:Pipeline|pipeline}, an automated conveyor from developer to user.', cue: { Pipeline: 'pipe' }, focus: ['pipe', 'belt'] },
      { nl: '{t:Versiebeheer|Versiebeheer}, meestal Git: elke versie bewaard, en wie wat veranderde.', en: '{t:Version control|Version control}, usually Git: every version kept, and who changed what.', cue: { Versiebeheer: 'vc' }, focus: ['vc', 'bGit'] },
      { nl: 'Een {t:Commit|commit}: een pakketje veranderingen met een korte uitleg.', en: 'A {t:Commit|commit}: a small package of changes with a short explanation.', cue: { Commit: 'commit' }, focus: ['commit', 'parcel', 'dev'] },
    ]),
    sc('s3', PL, 1, { nl: 'Vier stappen, en stop bij rood', en: 'Four steps, and stop at red' }, [
      { nl: 'Na een commit start de band vanzelf. Stap 1, de {t:Build|build}: code wordt iets wat draait.', en: 'After a commit the conveyor starts itself. Step 1, the {t:Build|build}: code becomes something that runs.', cue: { Build: 'build' }, focus: ['build', 'stBuild', 'parcel'] },
      { nl: 'Stap 2: automatische tests controleren of alles nog werkt.', en: 'Step 2: automated tests check that everything still works.', focus: ['tests', 'stTest'] },
      { nl: 'Stap 3: het {t:Artefact|artefact}, een vast pakket dat niet meer verandert.', en: 'Step 3: the {t:Artefact|artefact}, a fixed package that no longer changes.', cue: { Artefact: 'art' }, focus: ['art', 'stArt'] },
      { nl: 'Stap 4: installeren op een testomgeving, later op de echte systemen.', en: 'Step 4: install on a test environment, later on the real systems.', focus: ['install', 'stEnv', 'stProd'] },
      { nl: 'Faalt een stap, zoals een rode test, dan stopt de band en krijgt het team direct een melding.', en: 'If a step fails, like a red test, the conveyor stops and the team is told at once.', focus: ['red', 'stTest', 'dev'] },
    ]),
    sc('s4', PL, 1, { nl: 'Lean-blik, en de fabriek', en: 'The Lean view, and the factory' }, [
      { nl: 'Een pipeline is standaardwerk voor software: dezelfde route, een voorspelbare uitkomst.', en: 'A pipeline is standard work for software: the same route, a predictable outcome.', focus: ['std', 'belt'] },
      { nl: 'Stoppen bij een fout is jidoka: de machine stopt, je geeft geen fouten door.', en: 'Stopping at a fault is jidoka: the machine stops, faults are not passed on.', focus: ['jidoka', 'stTest'] },
      { nl: 'Kleine commits zijn kleine series: minder tussenvoorraad, sneller zien wat fout gaat.', en: 'Small commits are small batches: less work in between, faults seen sooner.', focus: ['batch', 'bBatch'] },
      { nl: 'In offertes heet dit vaak CI/CD: continuous integration en continuous delivery.', en: 'In proposals this is often called CI/CD: continuous integration and continuous delivery.', focus: ['cicd', 'belt'] },
      { nl: '“Wij zijn geen softwarebedrijf.” Maar MES, etiketsoftware en ERP-koppelingen veranderen steeds.', en: '“We are not a software company.” But the MES, label software and ERP links keep changing.', focus: ['notsw', 'stProd', 'ops'] },
      { nl: 'Vraag: hoe komt een wijziging nu op de vloer, en welke stappen gaan met de hand?', en: 'Ask: how does a change reach the floor today, and which steps are manual?', focus: ['ask', 'jij'] },
    ]),
    sc('s5', PL, 1, { nl: 'Voorbeeld: het etiket', en: 'Example: the label' }, [
      { nl: 'Een zuivelfabriek: de houdbaarheidsdatum op het etiket moet groter.', en: 'A dairy plant: the best-before date on the label must be larger.', focus: ['dairy', 'dev'] },
      { nl: '09:00 commit: “datum op etiket groter”. 09:01 de build, {n:3} minuten.', en: '09:00 commit: “larger date on label”. 09:01 the build, {n:3} minutes.', focus: ['t1', 'stBuild', 'parcel'] },
      { nl: '09:04 de tests, {n:8} minuten: staat de datum nog in het juiste formaat?', en: '09:04 the tests, {n:8} minutes: is the date still in the right format?', focus: ['t2', 'stTest'] },
      { nl: '09:12 het artefact, versie 4.7.1, bewaard. 09:15 op de testomgeving: een proefetiket.', en: '09:12 the artefact, version 4.7.1, stored. 09:15 on the test environment: a test label.', focus: ['t3', 'stArt', 'stEnv'] },
      { nl: 'Totaal: {n:15} minuten van commit tot testomgeving, zonder één handmatige stap.', en: 'Total: {n:15} minutes from commit to test environment, without a single manual step.', focus: ['t4', 'bTime'] },
    ]),
    sc('s6', FK, 1, { nl: 'DORA en snelheid', en: 'DORA and speed' }, [
      { nl: '{t:DORA|DORA}: DevOps Research and Assessment. Sinds 2014 elk jaar een grote enquête.', en: '{t:DORA|DORA}: DevOps Research and Assessment. Since 2014 a large survey every year.', cue: { DORA: 'dora' }, focus: ['dora', 'bMeters'] },
      { nl: 'Forsgren, Humble en Kim: het boek Accelerate, 2018. Sinds eind 2018 hoort DORA bij Google Cloud.', en: 'Forsgren, Humble and Kim: the book Accelerate, 2018. Since late 2018 DORA is part of Google Cloud.', focus: 'book' },
      { nl: 'Snelheid: de {t:Deployfrequentie|deployfrequentie}, hoe vaak een nieuwe versie live gaat.', en: 'Speed: {t:Deployment frequency|deployment frequency}, how often a new version goes live.', cue: { Deployfrequentie: 'freq' }, focus: ['freq', 'mFreq', 'parcel'] },
      { nl: 'Live betekent in {t:Productie|productie}: de echte systemen die gebruikers gebruiken.', en: 'Live means in {t:Production|production}: the real systems that users use.', cue: { Productie: 'stProd' }, focus: 'prodterm' },
      { nl: '{t:Doorlooptijd van een wijziging|Doorlooptijd van een wijziging}: van commit tot in productie.', en: '{t:Change lead time|Change lead time}: from commit until it runs in production.', cue: { 'Doorlooptijd van een wijziging': 'lead' }, focus: ['lead', 'mLead', 'belt'] },
    ]),
    sc('s7', FK, 1, { nl: 'Stabiliteit, en de vier samen', en: 'Stability, and all four together' }, [
      { nl: 'Stabiliteit: het {t:Faalpercentage van wijzigingen|faalpercentage van wijzigingen}.', en: 'Stability: the {t:Change fail rate|change fail rate}, the share of deployments that need intervention.', cue: { 'Faalpercentage van wijzigingen': 'fail' }, focus: ['fail', 'mFail', 'stProd'] },
      { nl: 'Dat zijn deploys die direct ingrijpen vragen: terugdraaien, of een spoedreparatie.', en: 'That means action at once: a rollback, or an urgent fix.', focus: ['roll', 'parcel'] },
      { nl: 'De {t:Hersteltijd na een mislukte deploy|hersteltijd na een mislukte deploy}: hoe lang herstellen duurt.', en: 'The {t:Failed deployment recovery time|failed deployment recovery time}: how long recovery takes.', cue: { 'Hersteltijd na een mislukte deploy': 'rec' }, focus: ['rec', 'mRec', 'stProd'] },
      { nl: 'Tot 2023 heette die MTTR; nu telt alleen een storing door een eigen wijziging.', en: 'Until 2023 it was called MTTR; now only a failure from the team’s own change counts.', focus: ['mttr', 'mRec'] },
      { nl: 'De vier sleutels: de beste teams scoren op alle vier goed. Snel en stabiel gaan samen.', en: 'The four keys: the best teams score well on all four. Fast and stable go together.', focus: ['keys', 'bMeters'] },
    ]),
    sc('s8', FK, 1, { nl: 'Lean-blik en de praktijk', en: 'The Lean view and practice' }, [
      { nl: 'Doorlooptijd als in een waardestroom; het faalpercentage als first pass yield, omgekeerd.', en: 'Lead time as in a value stream; the fail rate as first pass yield, reversed.', focus: ['leanv', 'mLead', 'mFail'] },
      { nl: '“Eén keer per kwartaal, dan gaat er minder mis.” DORA: vaak juist andersom.', en: '“Once a quarter, then less goes wrong.” DORA: often the other way round.', focus: ['quarter', 'bBatch'] },
      { nl: 'Vraag: hoe vaak gaat er iets in productie, en hoe vaak moet je direct ingrijpen?', en: 'Ask: how often does something go into production, and how often must you step in?', focus: ['ask2', 'jij'] },
    ]),
    sc('s9', FK, 1, { nl: 'Voorbeeld: de snoepfabriek', en: 'Example: the confectionery plant' }, [
      { nl: 'Een snoepfabriek: het IT-team bouwt koppelingen tussen ERP en MES. Cijfers over {n:4} weken.', en: 'A confectionery plant: the IT team builds ERP and MES links. Numbers for {n:4} weeks.', focus: ['candy', 'bDeploys'] },
      { nl: 'Deployfrequentie: {n:8} deploys in {n:4} weken, dus {n:2} per week.', en: 'Deployment frequency: {n:8} deployments in {n:4} weeks, so {n:2} a week.', focus: ['e1', 'mFreq', 'bDeploys'] },
      { nl: 'Doorlooptijd: {n:6} werkdagen na de commit, vooral wachten op een wekelijks testmoment.', en: 'Lead time: {n:6} working days after the commit, mostly waiting for a weekly test slot.', focus: ['e2', 'mLead'] },
      { nl: '{n:2} van de {n:8} deploys teruggedraaid: {n:25}%. Hersteld na {n:1} en na {n:3} uur.', en: '{n:2} of the {n:8} deployments rolled back: {n:25}%. Recovered after {n:1} and {n:3} hours.', focus: ['e3', 'mFail', 'mRec', 'bDeploys'] },
      { nl: 'Conclusie: redelijk vaak geleverd, maar één op de vier deploys gaat mis. Daar eerst verbeteren.', en: 'Conclusion: fairly frequent, but one in four deployments goes wrong. Improve that first.', focus: ['e4', 'mFail'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons'
// teach text and worked examples, so every point of the checklist above is
// said here or shown on the card. No symbol the voice would read aloud, no
// spoken parenthesis or quote; quoted sentences are introduced in words.
// Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-13). Read as written: DevOps, DevOpsDays, Gent, commit,
// Git, DORA, Forsgren, Google Cloud, MTTR (letters), first pass yield,
// jidoka, testomgeving, proefetiket, houdbaarheidsdatum, kwaliteitsafdeling,
// spoedreparatie, datacenter, stroomstoring, snoepfabriek, IT-professionals.
// New SAY rules in films/_kit/timeline.mjs (tested; recomputed for every film:
// no other film's spoken text changes): pipeline as "paiplain", build as
// "bild", deploy, deploys, deployen and deployfrequentie as "die-ploj",
// Debois as "De-bwa", "Jez Humble en Gene Kim" with English sounds, Accelerate,
// State of, mean time to restore, four keys, CI/CD as letters, continuous
// integration and delivery in Dutch sounds, softwarebedrijf, artefact and "in
// een waardestroom" split at the head. Toyota goes through pm.land.training's
// rule, Lean-consultant through pm.run.conflict's, MES through the letters
// rule, lead time is not said in Dutch. In English, CI/CD as letters. Said
// around because espeak-ng misreads it (it stays in the captions and on the
// cards): etiketsoftware (Dutch "softwaare" in the compound; said "de software
// voor etiketten"). Years, times and numbers in words.
const SAY = [
  [ // s1 two camps, the wall, DevOps, 2009
    { nl: 'Vroeger had IT twee kampen: ontwikkelaars bouwden software, beheerders hielden de systemen draaiend.',
      en: 'IT used to have two camps: developers built software, operators kept the systems running.' },
    { nl: 'De een wilde snel veranderen, de ander wilde rust. Code werd over de muur gegooid.',
      en: 'One side wanted fast change, the other calm. Code was thrown over the wall.' },
    { nl: '{t:DevOps|DevOps} haalt die muur weg: één team bouwt en draait, en automatiseert alles wat vaak terugkomt.',
      en: '{t:DevOps|DevOps} removes that wall: one team builds and runs, and automates everything that recurs.' },
    { nl: 'Het woord ontstond rond tweeduizend negen, toen Patrick Debois in Gent de eerste DevOpsDays organiseerde.',
      en: 'The word appeared around two thousand and nine, when Patrick Debois organised the first DevOpsDays in Ghent.' },
  ],
  [ // s2 the pipeline, version control, a commit
    { nl: 'Het hart van DevOps is de {t:Pipeline|pipeline}: een automatische lopende band, met voor elke wijziging dezelfde stappen, van ontwikkelaar tot gebruiker.',
      en: 'The heart of DevOps is the {t:Pipeline|pipeline}: an automated conveyor, the same steps for every change, from developer to user.' },
    { nl: 'Het begint bij {t:Versiebeheer|versiebeheer}, meestal Git: het bewaart elke versie van de code en laat zien wie wat veranderde.',
      en: 'It starts with {t:Version control|version control}, usually Git: every version of the code kept, and who changed what.' },
    { nl: 'Een wijziging opslaan heet een {t:Commit|commit}: een pakketje veranderingen met een korte uitleg.',
      en: 'Saving a change is a {t:Commit|commit}: a small package of changes with a short explanation.' },
  ],
  [ // s3 the four steps, the red test
    { nl: 'Na een commit start de pipeline vanzelf. Stap één, de {t:Build|build}: de code wordt iets wat een computer kan draaien.',
      en: 'After a commit the pipeline starts itself. Step one, the {t:Build|build}: the code becomes something a computer can run.' },
    { nl: 'Stap twee: automatische tests controleren of alles nog werkt.',
      en: 'Step two: automated tests check that everything still works.' },
    { nl: 'Stap drie: het resultaat wordt bewaard als {t:Artefact|artefact}, een vast pakket dat niet meer verandert.',
      en: 'Step three: the result is stored as an {t:Artefact|artefact}, a fixed package that no longer changes.' },
    { nl: 'Stap vier: installeren op een testomgeving, en later op de echte systemen.',
      en: 'Step four: installing on a test environment, and later on the real systems.' },
    { nl: 'Faalt een stap, zoals een rode test, dan stopt de band en krijgt het team direct een melding.',
      en: 'If a step fails, like a red test, the conveyor stops and the team is told at once.' },
  ],
  [ // s4 the Lean view; CI/CD; the factory
    { nl: 'Voor een Lean-consultant bekend: een pipeline is standaardwerk voor software. Dezelfde route, dus een voorspelbare uitkomst.',
      en: 'For a Lean consultant, familiar: a pipeline is standard work for software, the same route, a predictable outcome.' },
    { nl: 'Stoppen bij een fout is jidoka, de Toyota-gedachte dat een machine stopt zodra er iets misgaat: geen fouten doorgeven.',
      en: 'Stopping at a fault is jidoka, the Toyota idea that a machine stops as soon as something goes wrong: no faults passed on.' },
    { nl: 'Kleine commits lijken op kleine series: minder tussenvoorraad, sneller zien wat fout gaat.',
      en: 'Small commits are like small batches: less work in between, faults seen sooner.' },
    { nl: 'In offertes heet dit vaak CI/CD: continuous integration en continuous delivery. Die komen later.',
      en: 'In proposals this is often called CI/CD: continuous integration and continuous delivery. Both follow in later lessons.' },
    { nl: 'In fabrieken hoor je: wij zijn geen softwarebedrijf, DevOps is niets voor ons. Maar het MES, de software voor etiketten en de ERP-koppelingen veranderen steeds vaker.',
      en: 'Factories say: we are no software company, DevOps is not for us. Yet the MES, label software and ERP links change ever more often.' },
    { nl: 'Vraag: hoe komt een wijziging nu op de vloer, en welke stappen gaan met de hand? Elke handmatige stap geeft fouten en wachttijd.',
      en: 'Ask: how does a change reach the floor today, and which steps are manual? Each manual step means errors and waiting.' },
  ],
  [ // s5 the dairy label
    { nl: 'Een voorbeeld: een zuivelfabriek laat de leverancier de houdbaarheidsdatum op het etiket groter maken.',
      en: 'An example: a dairy plant has its supplier make the best-before date on the label larger.' },
    { nl: 'Om negen uur de commit: datum op etiket groter. Een minuut later start de pipeline; de build duurt drie minuten.',
      en: 'At nine o\'clock the commit: larger date on label. A minute later the pipeline starts; the build takes three minutes.' },
    { nl: 'Om vier over negen de tests, acht minuten; ze controleren onder meer of de datum nog in het juiste formaat staat.',
      en: 'At four past nine the tests, eight minutes, checking among other things that the date format is still right.' },
    { nl: 'Om twaalf over negen is artefact vier punt zeven punt één bewaard. Kwart over negen staat het op de testomgeving, en kwaliteit print een proefetiket.',
      en: 'At twelve past nine artefact four point seven point one is stored; at quarter past, it is on the test environment and quality prints a test label.' },
    { nl: 'Totaal: vijftien minuten van commit tot testomgeving, zonder één handmatige stap.',
      en: 'Total: fifteen minutes from commit to test environment, without a single manual step.' },
  ],
  [ // s6 DORA; deployment frequency, production, change lead time
    { nl: 'Hoe goed levert een team? Dat meet {t:DORA|DORA}, DevOps Research and Assessment: sinds tweeduizend veertien elk jaar duizenden IT-professionals ondervraagd.',
      en: 'How well does a team deliver? {t:DORA|DORA} measures it: DevOps Research and Assessment, surveying thousands of IT professionals yearly since twenty fourteen.' },
    { nl: 'Nicole Forsgren, Jez Humble en Gene Kim vatten de eerste jaren samen in het boek Accelerate, tweeduizend achttien; eind dat jaar ging DORA naar Google Cloud. Het State of DevOps-rapport is bekend om een paar metingen.',
      en: 'Nicole Forsgren, Jez Humble and Gene Kim summed up the first years in the book Accelerate, twenty eighteen; late that year DORA joined Google Cloud. The State of DevOps report is known for a few metrics.' },
    { nl: 'Twee gaan over snelheid. De {t:Deployfrequentie|deployfrequentie}: hoe vaak een nieuwe versie live gaat, van drie keer per dag tot één keer per maand.',
      en: 'Two are about speed. {t:Deployment frequency|Deployment frequency}: how often a new version goes live, from three times a day to once a month.' },
    { nl: 'Live betekent in {t:Productie|productie}: de echte systemen die gebruikers gebruiken.',
      en: 'Live means in {t:Production|production}: the real systems that users use.' },
    { nl: 'De {t:Doorlooptijd van een wijziging|doorlooptijd van een wijziging}: van commit tot productie, het deel van de keten dat het team zelf in de hand heeft.',
      en: '{t:Change lead time|Change lead time}: from commit to production, the part of the chain the team controls itself.' },
  ],
  [ // s7 change fail rate, rollback; recovery time, MTTR; the four keys
    { nl: 'Twee gaan over stabiliteit. Het {t:Faalpercentage van wijzigingen|faalpercentage van wijzigingen}: het aandeel deploys dat direct ingrijpen vraagt.',
      en: 'Two are about stability. {t:Change fail rate|Change fail rate}: the share of deployments that need immediate intervention.' },
    { nl: 'Ingrijpen is bijvoorbeeld terugdraaien, of een spoedreparatie.',
      en: 'For example a rollback, or an urgent fix.' },
    { nl: 'De {t:Hersteltijd na een mislukte deploy|hersteltijd na een mislukte deploy}: hoe lang herstellen duurt als een deploy misgaat.',
      en: '{t:Failed deployment recovery time|Failed deployment recovery time}: how long recovery takes when a deployment goes wrong.' },
    { nl: 'Tot tweeduizend drieëntwintig heette die MTTR, mean time to restore. Nu telt alleen een storing door een eigen wijziging, geen stroomstoring in het datacenter.',
      en: 'Until twenty twenty-three it was called MTTR, mean time to restore. Now only a failure from the team\'s own change counts, not a power cut in the data centre.' },
    { nl: 'Samen heten ze de vier sleutels, four keys. De beste teams scoren op alle vier goed: snelheid en stabiliteit gaan samen, want kleine wijzigingen test en herstel je makkelijker.',
      en: 'Together, the four keys. The best teams score well on all four: speed and stability go together, as small changes are easier to test and recover.' },
  ],
  [ // s8 the Lean view, once a quarter, the question
    { nl: 'Lean-blik: de doorlooptijd lijkt op die in een waardestroom, het faalpercentage op first pass yield, het deel dat in één keer goed is, maar omgekeerd.',
      en: 'The Lean view: lead time is like lead time in a value stream, change fail rate like first pass yield, the share right first time, but reversed.' },
    { nl: 'Je hoort: wij deployen één keer per kwartaal, dan gaat er minder mis. DORA laat vaak het omgekeerde zien: zeldzame, grote deploys gaan vaker mis en herstellen langzamer.',
      en: 'You hear: we deploy once a quarter, so less goes wrong. DORA often shows the reverse: rare, big deployments fail more often and recover more slowly.' },
    { nl: 'Vraag een IT-team: hoe vaak zetten jullie iets in productie, en hoe vaak moet je direct ingrijpen? Weet niemand het, dan wordt er nog niet gemeten.',
      en: 'Ask an IT team: how often do you deploy to production, and how often must you step in straight after? If nobody knows, nothing is measured yet.' },
  ],
  [ // s9 the confectionery plant
    { nl: 'Een voorbeeld. Het IT-team van een snoepfabriek bouwt koppelingen tussen ERP en MES. Jij verzamelt de cijfers van vier weken.',
      en: 'An example: a confectionery plant\'s IT team builds ERP and MES links; you collect four weeks of numbers.' },
    { nl: 'De deployfrequentie: acht deploys in vier weken, dus twee per week.',
      en: 'Deployment frequency: eight deployments in four weeks, so two a week.' },
    { nl: 'De doorlooptijd: zes werkdagen van commit tot productie, vooral door wachten op een wekelijks testmoment.',
      en: 'Change lead time: six working days from commit to production, mainly waiting for a weekly test slot.' },
    { nl: 'Het faalpercentage: twee van de acht deploys direct teruggedraaid, vijfentwintig procent. Hersteld na een uur en na drie uur.',
      en: 'Change fail rate: two of the eight rolled back at once, twenty-five percent. Recovered after one and after three hours.' },
    { nl: 'Conclusie: het team levert redelijk vaak, maar één op de vier deploys gaat mis. Daar ligt de eerste verbetering.',
      en: 'Conclusion: fairly frequent delivery, but one in four goes wrong. That is where to improve first.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the voice, and none of the words espeak-ng misreads (see above);
// checked on the text after the SAY rules, so a word a rule rewrites passes
// and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(pipelines?|build|deploy\w*|etiketsoftware|softwarebedrijf|Debois|Accelerate|State of|four keys|continuous|artefact)\b|(^|[.?!;]\s)Eén\b/i,
  en: /\bCI\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (/\d/.test(said)) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(MAX_TOTAL, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > MAX_TOTAL) throw new Error(`film is ${total} s, over ${MAX_TOTAL} (words per scene ${said.join(' ')}, all ${all})`);
}
// each beat's still (reduced motion) sits late in its own share of the scene;
// and every beat holds at least 4 s in both languages, so a card-only point is
// on screen long enough to read
{
  const resolved = resolveFilm(spec, lessons);
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
    for (const lang of ['nl', 'en']) {
      const s2 = beatStarts(rs, lang);
      s2.forEach((t, bi) => { const len = (bi + 1 < s2.length ? s2[bi + 1] : rs.dur) - t; if (len < 4) FAILS.push(`${rs.id} beat ${bi + 1} (${lang}) holds ${len.toFixed(1)} s, under 4 s`); });
    }
  });
  if (FAILS.length) throw new Error(`pacing:\n  ${FAILS.join('\n  ')}`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="dev"],[data-cue="ops"])';
const css = PM_CSS + `
.iso{--pl-red:#E0605A;--pl-green:#5FB37A}
.iso[data-theme="light"]{--pl-red:#C0392B;--pl-green:#2E8049}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-badt{fill:var(--pl-red);font-family:var(--fp-sans);font-weight:700}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-red{fill:var(--pl-red);stroke:none}
.pm-loop{fill:none;stroke:var(--anatomy-hi);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.pm-needle{fill:none;stroke:var(--anatomy-strong);stroke-width:1.6;stroke-linecap:round}
.pm-redp{fill:none;stroke:var(--pl-red);stroke-width:2;stroke-linecap:round}
.pm-bdash{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:2.4 1.8}
.pm-lamp{fill:var(--anatomy-mid);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-run{fill:var(--fp-accent);stroke:none}
.pm-ok{fill:var(--pl-green);stroke:none}
.pm-bad{fill:var(--pl-red);stroke:none}
.pm-parcel[data-bad]>.iso-solid>:is(.iso-fill,.iso-top,.iso-shade){fill:var(--pl-red)}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-loop,[data-cue][data-on] .pm-bdash,[data-cue][data-on] .pm-needle{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een projectruimte met een lange tafel. Daarop de pipeline als lopende band: links een ontwikkelaar met een laptop, dan een pakketje voor de commit dat over de band rijdt, langs vijf stations met elk een lampje: de build, een testkast met twee voelers, een plank met verzegelde pakketten voor de artefacten, een scherm voor de testomgeving en een serverkast voor productie, waar rechts de beheerder staat. Een lampje brandt groen als een stap lukt en rood bij een rode test. Aan de achterwand een whiteboard met alleen vormen: twee kampen met een muur ertussen, de lijn van versies, een grote serie naast kleine, de minuten van het voorbeeld, vier meters voor de DORA-metingen en acht deploys. Jij, de adviseur in petrol, staat bij het bord. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: DevOps, de pipeline, de vier stappen, de Lean-blik en de fabriek, het etiket van de zuivelfabriek, DORA en snelheid, stabiliteit en de vier sleutels, de praktijk, en de snoepfabriek.',
  en: 'A project room with a long table. On it the pipeline as a conveyor: at the left a developer with a laptop, then a parcel for the commit that rides along the belt past five stations, each with a small lamp: the build, a test box with two probes, a shelf of sealed packages for the artefacts, a screen for the test environment and a server rack for production, where the operator stands at the right. A lamp turns green when a step passes and red at a red test. On the back wall a whiteboard with shapes only: two camps with a wall between them, the line of versions, one big batch beside small ones, the example\'s minutes, four dials for the DORA metrics and eight deployments. You, the consultant in petrol, stand at the board. At the right a panel with one card per scene, marked as example or diagram: DevOps, the pipeline, the four steps, the Lean view and the factory, the dairy plant\'s label, DORA and speed, stability and the four keys, practice, and the confectionery plant.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  // every font size on the stage: drawing and script
  const sizes = new Set([...`${svg}\n${readFileSync(join(HERE, 'stage.js'), 'utf8')}`.matchAll(/font-size="(\d+)"/g)].map((m) => Number(m[1])));
  if ([...sizes].some((s) => s < 22)) throw new Error(`stage text under 22 units: ${[...sizes].join(', ')}`);
  console.log(`stage font sizes: ${[...sizes].join(', ')}`);
  for (const c of ['fp-bar', 'fp-note', 'fp-poster', 'fp-end', 'fp-sheet']) if (new RegExp(`class="[^"]*\\b${c}\\b`).test(svg + readFileSync(join(HERE, 'stage.js'), 'utf8'))) throw new Error(`reserved class ${c} on the stage`);
}

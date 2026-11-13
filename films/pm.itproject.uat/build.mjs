// Dev tool, not shipped. Builds the explainer film "De gebruikersacceptatietest
// / The user acceptance test" for the Projects course: pm.itproject.uat and
// pm.itproject.defects (levels 1 and 2 of the topic Testen en adoptie, in
// IT-projecten leiden).
//
//   node films/pm.itproject.uat/build.mjs            build the page
//   node films/pm.itproject.uat/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.itproject.uat.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// A lesson with a film no longer shows its worked example (v16 notes), so the
// film carries the whole teach text and the worked example of both lessons:
// the test levels (s1), key users and test scenarios (s2), the test script and
// real data (s3), sign-off and what goes wrong (s4), the food producer's UAT
// plan (s5); then defects and severity (s6), triage, retest and regression
// test (s7), exit criteria (s8) and day 8 at the plastics processor (s9). Both
// lessons fit in nine scenes and about 760 words a language, as the MoSCoW
// film did with its two lessons; a few details stand on the cards only (marked
// "card" below), each on screen at least one beat of 4 s or more.
//
// Consistent with the reviewed films: key users, go-live and MES as the
// cutover and MoSCoW films say them (the kit's rules), the Lean consultant as
// pm.negotiate.batna and the MoSCoW film say it, ERP as the word.
//
// Checklist (lesson point: scene and beat; "card" = on the card or the strip
// only, not spoken, on screen at least 4 s; every card stays up for the rest of
// its page):
//   uat teach 1: an ERP or MES project has several test levels (s1 b1, "the
//     first test level"; the card's title and the strip's four levels); first
//     the partner tests its own configuration, the system test (s1 b1); then the
//     chain test, a whole process across all systems (s1 b2), order to MES to
//     label to shipment to invoice (s1 b2 says order to invoice; the steps on
//     the card and the strip); then the UAT, the user acceptance test: the future
//     users check whether the system supports their work, and accept it (s1 b3);
//     ISTQB, the international board for software testing, described acceptance
//     testing as formal testing against user needs, requirements and business
//     processes (s1 b4)
//   uat teach 2: the testing is done by key users, experienced employees from
//     each department who help design the system, test it and later train their
//     colleagues; not by the partner (s2 b1); test scenarios from real work: a
//     rush order while a material is short, quality blocks a batch that is
//     already half packed, a customer returns a pallet (s2 b2); each scenario
//     links back to the requirements, so every Must has been tested (s2 b3)
//   uat teach 3: a test script spells a scenario out: steps, input data,
//     expected result; the tester carries it out and writes down what happened:
//     pass or fail (s3 b1); use real data from the last mock migration; a key
//     user spots at once a familiar article with the wrong unit, or a routing
//     missing a step (s3 b2); with invented test data those errors stay hidden
//     until go-live (s3 b3)
//   uat teach 4: sign-off, the formal acceptance by the process owners that the
//     test met the agreed criteria; often linked to a payment to the partner
//     (s4 b1); UAT is not the training, although it helps the key users learn;
//     not the moment for new wishes: they go to the change process, not into
//     the test (s4 b2; the quote "it would be handy if..." on the card)
//   uat teach 5: what often goes wrong: the build runs late, the UAT is squeezed
//     from four weeks to one, the key users test in between their normal work
//     (s4 b3); or they only test the happy path, where everything goes right
//     (s4 b4); the sharp question: who tests, how many hours per week are they
//     freed for it, and with which data? (s4 b5)
//   uat example: a food producer plans the UAT for its new ERP; four processes
//     (named on the card: order to cash, production, purchasing, quality); 120
//     test scripts, the awkward cases included (s5 b1; named on the card: a
//     quality hold, a recall, a rush order with a shortage); one script 1.5
//     hours on average, including preparing the data: 180 hours for the first
//     round (s5 b2; 120 x 1.5 = 180 on the card); 8 key users, each freed for
//     half of a 36-hour week: 144 hours a week (s5 b3; the 18 hours and 8 x 18
//     on the card and in the caption); 180 / 144 = 1.25 weeks (s5 b4); the
//     project lead plans two weeks for round 1, room for defects and waiting,
//     one week for round 2, retesting what failed (s5 b5); the backfill for the
//     key users arranged with the shift leaders before the UAT starts (s5 b6)
//   defects teach 1: a defect, a test result that differs from the expected
//     result, logged with the steps, a screenshot and the test script's ID, so
//     someone else can repeat it (s6 b1); not every defect is a fault in the
//     system: wrong test data, something the tester has not learned yet, or a
//     new wish, which goes to the change process (s6 b2; the routing on the
//     card, as s4 b2 says it)
//   defects teach 2: each defect gets a severity, how big the impact is; 1,
//     blocking, the process cannot continue, e.g. you cannot ship (said) or book
//     stock (card, its own line); 2, serious, but there is a workaround; 3, minor; 4,
//     cosmetic, such as a typo (s6 b3; the scale also on the strip); priority,
//     how fast it must be fixed; usually follows severity, but a date can raise
//     it, such as a label (format) for a customer who launches next month (s6 b4)
//   defects teach 3: triage, the daily meeting where defects are sorted: the
//     test lead, the partner, key users and a process owner; per new defect: is
//     it really a fault, what is the severity, who fixes it and by when? (s7
//     b1); for a Lean consultant it resembles an andon response: deal with
//     problems quickly, close to the work, with the people who know it; the
//     process owner has the last word on severity, not the partner (s7 b2)
//   defects teach 4: after a fix the tester runs the script again, a retest; if
//     it passes, the defect is closed (s7 b3); a fix can break something
//     elsewhere, so a regression test: running scripts again that passed
//     earlier, to check they still pass; the bigger the fix, the bigger the set
//     (s7 b4)
//   defects teach 5: the UAT ends on exit criteria, conditions agreed before the
//     test that say when it is finished (s8 b1); for example 100% of the scripts
//     run (said: all scripts), at least 95% passed, no open severity 1, severity
//     2 only with an accepted workaround and a fix date (s8 b2); the sharp
//     question: who decides the severity, and can the partner lower it on its
//     own? If yes, the exit criteria are only as strong as the partner wants
//     (s8 b3)
//   defects example: day 8 of the UAT for a new MES at a plastics processor; of
//     120 scripts 112 run and 101 passed; 23 open defects (s9 b1); triage: 6 are
//     not faults: 3 wrong test data, 2 a training gap, 1 a new wish (s9 b2; that
//     it goes to the change process on the card); 17 remain: severity 1: 2,
//     severity 2: 5, severity 3: 7, severity 4: 3 (s9 b3; the check 2 + 5 + 7 +
//     3 = 17 on the card as 23 − 6 = 17 = 2+5+7+3, and as the board's columns); the two severity 1s: a work order
//     cannot be closed, the label misses the batch number (s9 b4); the exit
//     criteria: 95% of 120 is 114, so 13 more must pass (s9 b5; all 120 run and
//     no open severity 1 said in s8 b2 and in the caption); both severity 1s
//     fixed, retested and covered by a regression set; the partner gets them
//     first, with a date (s9 b6)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts as the lessons credit them, and no more: ISTQB, the international board
// for software testing, described acceptance testing as formal testing against
// user needs, requirements and business processes. Nothing else is credited to
// a source; every count and duration is the lessons' own and asserted below
// (120 x 1.5 = 180; 8 x 18 = 144; 180 / 144 = 1.25; 23 - 6 = 17 = 2 + 5 + 7 +
// 3; 3 + 2 + 1 = 6; 95% of 120 = 114; 114 - 101 = 13).
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here) as a
// test room: on the back wall a whiteboard with four columns, filled per scene
// with notes (the test scripts of four processes, pass or fail; then the
// defects by severity, the six that are no fault in grey); a table with two
// laptops (the test system), a stack of test scripts and a sheet with pass and
// fail marks. People: you (the consultant, at the board), two key users (the pm
// world's planner with a tablet and the team lead from the floor), the partner
// and the process owner (the Scrum film's figures, pm.agile.scrum/cast.mjs,
// imported, not edited). At the top right a panel with one card per scene,
// labelled "schema" or "voorbeeld". Along the bottom the four test levels
// (system test, chain test, UAT, sign-off) and below them the weeks of the UAT
// or the bar of 120 scripts.
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// props, the board's notes and each part of the strip.
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
const UA = 'pm.itproject.uat';
const DF = 'pm.itproject.defects';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(UA, ['Een ERP- of MES-project heeft meerdere testniveaus. Eerst test de partner zijn eigen configuratie: de systeemtest',
  'Dan de ketentest: een heel proces over alle systemen heen, zoals order naar MES naar etiket naar verzending naar factuur',
  'Dan de UAT, de gebruikersacceptatietest (user acceptance test): de toekomstige gebruikers controleren of het systeem hun werk ondersteunt, en accepteren het',
  'ISTQB, de internationale organisatie voor softwaretesten, omschreef acceptatietesten als formeel testen tegen de behoeften van gebruikers, requirements en bedrijfsprocessen',
  'Het testen doen key users: ervaren medewerkers van elke afdeling die meehelpen het systeem te ontwerpen, het testen en later hun collega’s trainen. Niet de partner',
  'Ze testen met testscenario’s uit het echte werk: “Er komt een spoedorder binnen terwijl er van één materiaal te weinig is.” “Kwaliteit blokkeert een batch die al half verpakt is.” “Een klant stuurt een pallet terug.”',
  'Elk scenario verwijst terug naar de requirements, zodat je weet dat elke Must getest is',
  'Een testscript werkt een scenario uit: de stappen, de invoer en het verwachte resultaat. De tester voert het uit en schrijft op wat er echt gebeurde: geslaagd of gezakt',
  'Gebruik echte data, uit de laatste proefmigratie. Een key user ziet meteen dat een bekend artikel de verkeerde eenheid heeft of dat een routing een stap mist. Met verzonnen testdata blijven die fouten verborgen tot de go-live',
  'De UAT eindigt met een sign-off: de formele acceptatie door de proceseigenaren dat de test aan de afgesproken criteria voldeed. Vaak is daar een betaling aan de partner aan gekoppeld',
  'UAT is niet de training, al helpt het de key users om te leren', 'En het is niet het moment voor nieuwe wensen: “Het zou handig zijn als…” gaat naar het wijzigingsproces, niet in de test',
  'de bouw loopt uit, de UAT wordt van vier weken naar één geperst, en de key users testen tussen hun gewone werk door. Of ze testen alleen het “happy path”, waarin alles goed gaat',
  '“Wie test, hoeveel uur per week zijn ze ervoor vrijgemaakt, en met welke data?”',
  'Een voedingsbedrijf plant de UAT voor zijn nieuwe ERP. Vier processen worden getest: order tot betaling, productie, inkoop en kwaliteit. Samen hebben ze 120 testscripts, ook de lastige gevallen: een kwaliteitsblokkade, een terugroepactie, een spoedorder met een tekort',
  'één script kost gemiddeld 1,5 uur, inclusief het klaarzetten van de data. 120 × 1,5 = 180 uur voor de eerste ronde',
  '8 key users, elk vrijgemaakt voor de helft van een werkweek van 36 uur, dus 18 uur. 8 × 18 = 144 uur per week', 'Tijd: 180 / 144 = 1,25 week',
  'De projectleider plant twee weken voor ronde 1, om ruimte te houden voor bevindingen en wachten, en één week voor ronde 2: hertesten wat gezakt is',
  'De vervanging van de key users wordt met de ploegleiders geregeld voordat de UAT begint']);
says(DF, ['Een bevinding (defect) is een testresultaat dat afwijkt van het verwachte resultaat. De tester legt hem vast met de stappen, een schermafdruk en het nummer van het testscript, zodat een ander hem kan herhalen',
  'Niet elke bevinding is een fout in het systeem. Het kan verkeerde testdata zijn, iets wat de tester nog niet geleerd heeft, of een nieuwe wens die zich voordoet als fout. Die laatste soort gaat naar het wijzigingsproces',
  'Elke bevinding krijgt een ernst (severity): hoe groot de impact is. Een gangbare schaal: 1, blokkerend, het proces kan niet verder, bijvoorbeeld je kunt niet verzenden of geen voorraad boeken; 2, zwaar, maar er is een omweg; 3, klein; 4, cosmetisch, zoals een typefout',
  'Prioriteit is iets anders: hoe snel het opgelost moet worden. Die volgt meestal de ernst, maar een datum kan hem verhogen, zoals een etiketformaat voor een klant die volgende maand lanceert',
  'Triage is het dagelijkse overleg waarin bevindingen gesorteerd worden: de testcoördinator, de partner, key users en een proceseigenaar. Per nieuwe bevinding: is het echt een fout, wat is de ernst, wie lost hem op en wanneer?',
  'Voor een Lean-consultant lijkt het op een andonreactie: problemen snel oppakken, dicht bij het werk, met de mensen die het kennen. De proceseigenaar heeft het laatste woord over de ernst, niet de partner',
  'Na een oplossing voert de tester het script opnieuw uit: een hertest. Slaagt die, dan wordt de bevinding gesloten',
  'Maar een oplossing kan elders iets breken. Daarom is er een regressietest: een set scripts opnieuw uitvoeren die eerder geslaagd waren, om te controleren dat ze nog steeds slagen. Hoe groter de oplossing, hoe groter de set',
  'De UAT eindigt op exitcriteria: voorwaarden die voor de test zijn afgesproken en die zeggen wanneer hij klaar is. Bijvoorbeeld: 100% van de scripts uitgevoerd, minstens 95% geslaagd, geen open ernst 1, en ernst 2 alleen met een geaccepteerde omweg en een datum voor de oplossing',
  '“Wie bepaalt de ernst, en kan de partner die zelf verlagen?” Zo ja, dan zijn de exitcriteria maar zo sterk als de partner wil',
  'Dag 8 van de UAT voor een nieuw MES bij een kunststofverwerker. Van de 120 testscripts zijn er 112 uitgevoerd en 101 geslaagd. Er staan 23 bevindingen open',
  'Triage: 6 zijn geen fout in het systeem: 3 zijn verkeerde testdata, 2 een gat in de training, 1 een nieuwe wens die naar het wijzigingsproces gaat',
  'Er blijven er 17 over: ernst 1: 2 (een werkorder kan niet worden afgesloten; op het etiket ontbreekt het batchnummer), ernst 2: 5, ernst 3: 7, ernst 4: 3',
  'alle 120 scripts uitgevoerd, minstens 95% geslaagd, geen open ernst 1. 95% van 120 is 114, dus er moeten er nog 13 slagen, en beide bevindingen met ernst 1 moeten opgelost, hertest en gedekt zijn door een regressieset',
  'De partner krijgt beide bevindingen met ernst 1 als eerste, met een datum']);
says(UA, ['ISTQB, the international board for software testing, described acceptance testing as formal testing against user needs, requirements and business processes',
  'The backfill for the key users is arranged with the shift leaders before the UAT starts', 'from the last mock migration'], 'en');
says(DF, ['For a Lean consultant it resembles an andon response', 'a label format for a customer who launches next month', 'Day 8 of the UAT for a new MES at a plastics processor'], 'en');
assert(lessons.nl.get(UA).terms.map((t) => t.term).join() === 'UAT,Ketentest,Key user,Testscenario,Testscript,Sign-off', 'the six terms of uat (nl)');
assert(lessons.en.get(UA).terms.map((t) => t.term).join() === 'UAT,Chain test,Key user,Test scenario,Test script,Sign-off', 'the six terms of uat (en)');
assert(lessons.nl.get(DF).terms.map((t) => t.term).join() === 'Bevinding,Ernst,Triage,Hertest,Regressietest,Exitcriteria', 'the six terms of defects (nl)');
assert(lessons.en.get(DF).terms.map((t) => t.term).join() === 'Defect,Severity,Triage,Retest,Regression test,Exit criteria', 'the six terms of defects (en)');
for (const lang of ['nl', 'en']) for (const id of [UA, DF]) {
  const f = lessons[lang].get(id).film;
  assert(!f || f === 'pm.itproject.uat', `${id} (${lang}) has film ${f}: never overwrite another film`);
}
// the food producer's UAT plan
const SCRIPTS = 120;
const PER = 1.5;
const EFFORT = SCRIPTS * PER;
assert(EFFORT === 180, '120 x 1.5 = 180 hours');
const KU = 8;
const FREED = 36 / 2;
assert(FREED === 18 && KU * FREED === 144, 'half of 36 is 18; 8 x 18 = 144 hours a week');
assert(EFFORT / (KU * FREED) === 1.25, '180 / 144 = 1.25 weeks');
// day 8 at the plastics processor
const RUN = 112;
const PASSED = 101;
const OPEN = 23;
const NOFAULT = [3, 2, 1];
const SEV = [2, 5, 7, 3];
const sum = (a) => a.reduce((x, y) => x + y, 0);
assert(sum(NOFAULT) === 6 && OPEN - 6 === 17 && sum(SEV) === 17, '3 + 2 + 1 = 6; 23 - 6 = 17 = 2 + 5 + 7 + 3');
const NEED = Math.ceil(0.95 * SCRIPTS - 1e-9);
assert(NEED === 114 && NEED - PASSED === 13 && RUN <= SCRIPTS, '95% of 120 is 114; 114 - 101 = 13');
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 280, d: 220, h: 220 };
const RW = 326; // the room's window on the stage: x 0..326, y 0..290
const RH = 290;
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, RW, RH, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the whiteboard: four columns (a header bar each and a divider), the notes
// drawn by stage.js into "notesIn" in the board's face plane (u = x, v = -z)
const BX0 = 40;
const BX1 = 196;
const BOARD = w.board({ x0: BX0, x1: BX1, z0: 100, z1: 196 });
const NOTES = { u0: BX0 + 9, du: 37, v0: -184, dv: 10.4, w: 20, h: 7.4 };
const heads = [0, 1, 2, 3].map((c) => `<path class="pm-rule" style="stroke-width:1.6" d="M${NOTES.u0 + c * NOTES.du} -189H${NOTES.u0 + c * NOTES.du + NOTES.w}"/>`).join('')
  + [1, 2, 3].map((c) => `<path class="pm-rule" d="M${NOTES.u0 + c * NOTES.du - 8.5} -191V-104"/>`).join('');
const boardSvg = cueG('board', BOARD.svg + `<g transform="${BOARD.face}">${heads}</g>`);
const notesSvg = cueG('notes', `<g transform="${BOARD.face}">${g('notesIn', '')}</g>`);
const TABLE = { x: 72, y: 112, w: 160, d: 66, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 168, y: 140, z: TZ, lines: 0 });
const sheetRules = [6, 11, 16, 21].map((v) => `M2.5 ${v}H12`).join('');
const sheet = `<g transform="${SHEET.face}"><path class="pm-paper" d="M0 0H21V29.7H0Z"/><path class="pm-rule" d="${sheetRules}"/>${g('marks', '')}</g>`;
const scripts = w.stack({ x: 82, y: 148, z: TZ, n: 8 });
const systems = w.laptop({ x: 112, y: 132, z: TZ, toward: 1 }) + w.laptop({ x: 150, y: 132, z: TZ, toward: 1 });
const world = [
  w.room(ROOM),
  boardSvg,
  notesSvg,
  w.person({ x: 20, y: 54, role: 'jij', along: 'x', reach: [44, 6, 150] }),
  w.person({ x: 112, y: 84, role: 'planner', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 186, y: 80, key: 'partner', look: 'dev2', along: 'x' }),
  w.table(TABLE),
  cueG('systems', systems),
  cueG('scripts', scripts),
  cueG('sheet', sheet),
  w.cup(214, 168, TZ),
  scrumPerson(w, k, G, P, { x: 258, y: 148, key: 'owner', look: 'sm', along: 'y' }),
  w.person({ x: 120, y: 214, role: 'teamlead', along: 'x' }),
].join('');
for (const r of ['jij', 'planner', 'teamlead', 'partner', 'owner', 'board', 'notes', 'systems', 'scripts', 'sheet']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel and the strip (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 328;
const PW = 304;
const CUES = ['lev', 'chain', 'uat', 'istqb',
  'ku', 'scen', 'scen2', 'trace',
  'script', 'passfail', 'data', 'fake',
  'sign', 'not', 'wrong', 'happy', 'askq',
  'food', 'awk', 'effort', 'cap', 'time', 'plan', 'backfill',
  'defect', 'nofault', 'sev', 'prio',
  'triage', 'andon', 'retest', 'regr',
  'exit', 'ex1', 'ex2', 'askd',
  'day', 'six', 'left', 'sev1', 'need', 'fix'];
// the strip: row A the four test levels (x of each box), row B the weeks or the
// scripts bar (120 scripts over barW units)
const STRIP = { y0: 294, y1: 396, ly: 301, ay: 318, lw: 142, lx: [18, 172, 326, 480], ry: 346, bar0: 16, barW: 570 };
const SPARTS = ['lSys', 'lChain', 'lUat', 'lSign', 'sChain', 'sSev', 'wSqueeze', 'wR1', 'wR2', 'wNeed', 'bRun', 'bPass', 'bLine'];
assert(STRIP.lx[3] + STRIP.lw <= 628 && STRIP.bar0 + (STRIP.barW * 114) / 120 + 50 <= 628, 'the strip stays inside its panel');
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="10" width="${PW}" height="278" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''))
  + g('strip', `<rect class="pm-panel" x="8" y="${STRIP.y0}" width="624" height="${STRIP.y1 - STRIP.y0}" rx="10"/>`
  + SPARTS.map((c) => cueG(c, g(c, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.itproject.cutover):
// the same points, fewer bytes; each rewrite is read back.
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">`
  + `<clipPath id="ua-room"><rect x="0" y="0" width="${RW}" height="${RH}"/></clipPath>`
  + `<g clip-path="url(#ua-room)">${g('world', world)}</g>${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const AT = (p) => w.at(p).map(r1);
const BOARD_AT = AT([118, 0, 150]);
const TABLE_AT = AT([150, 145, TZ]);
const OWNER_AT = AT([240, 150, 120]);
const MID = [RW / 2, RH / 2, 1];
const CAM = [
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1], 1.08] },
  { from: [BOARD_AT[0], BOARD_AT[1], 1.02], to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.12] },
  { from: [TABLE_AT[0], TABLE_AT[1], 1.04], to: [TABLE_AT[0] + 20, TABLE_AT[1], 1.14] },
  { from: MID, to: [OWNER_AT[0], OWNER_AT[1], 1.08] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 20, 1.06], to: MID },
  { from: MID, to: [TABLE_AT[0] + 20, TABLE_AT[1], 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 30, 1.04], to: [OWNER_AT[0], OWNER_AT[1], 1.08] },
  { from: MID, to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 20, 1.12], to: MID },
];

// ---------------------------------------------------------------- the film
const C = { CUES, SPARTS, STRIP, NOTES, CAM_N: CAM.length };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.itproject.uat',
  title: { nl: 'De gebruikersacceptatietest', en: 'The user acceptance test' },
  lessons: [UA, DF],
  strictFocus: true,
  scenes: [
    sc('s1', UA, 1, { nl: 'Testniveaus', en: 'Test levels' }, [
      { nl: 'Het eerste testniveau: de partner test zijn eigen configuratie, de systeemtest.', en: 'The first test level: the partner tests its own configuration, the system test.', focus: ['lev', 'lSys', 'partner'] },
      { nl: '{t:Ketentest|Ketentest}: een heel proces over alle systemen, van order tot factuur.', en: '{t:Chain test|Chain test}: a whole process across all systems, from order to invoice.', cue: { Ketentest: 'chain' }, focus: ['chain', 'lChain', 'sChain'] },
      { nl: '{t:UAT|UAT}: de toekomstige gebruikers controleren of het systeem hun werk ondersteunt.', en: '{t:UAT|UAT}: the future users check whether the system supports their work.', cue: { UAT: 'uat' }, focus: ['uat', 'lUat', 'planner', 'teamlead'] },
      { nl: 'ISTQB over acceptatietesten: formeel testen tegen behoeften van gebruikers, requirements en bedrijfsprocessen.', en: 'ISTQB on acceptance testing: formal testing against user needs, requirements and business processes.', focus: ['istqb'] },
    ]),
    sc('s2', UA, 1, { nl: 'Key users en scenario’s', en: 'Key users and scenarios' }, [
      { nl: 'Testen doen {t:Key user|key users}: ervaren mensen van elke afdeling. Niet de partner.', en: 'Testing is done by {t:Key user|key users}: experienced people from each department. Not the partner.', cue: { 'Key user': 'ku' }, focus: ['ku', 'planner', 'teamlead'] },
      { nl: '{t:Testscenario|Testscenario’s} uit het echte werk: spoedorder bij tekort, geblokkeerde batch, pallet retour.', en: '{t:Test scenario|Test scenarios} from real work: a rush order in a shortage, a blocked batch, a returned pallet.', cue: { Testscenario: 'scen' }, focus: ['scen', 'scen2', 'notes'] },
      { nl: 'Elk scenario verwijst naar de requirements: zo weet je dat elke Must getest is.', en: 'Each scenario links back to the requirements: so you know every Must is tested.', focus: ['trace', 'board'] },
    ]),
    sc('s3', UA, 1, { nl: 'Testscript en echte data', en: 'Test script and real data' }, [
      { nl: 'Een {t:Testscript|testscript}: stappen, invoer en verwacht resultaat. De tester noteert: geslaagd of gezakt.', en: 'A {t:Test script|test script}: steps, input and expected result. The tester notes: pass or fail.', cue: { Testscript: 'script' }, focus: ['script', 'passfail', 'sheet', 'notes'] },
      { nl: 'Echte data uit de laatste proefmigratie: een key user ziet een verkeerde eenheid meteen.', en: 'Real data from the last mock migration: a key user spots a wrong unit at once.', focus: ['data', 'systems', 'planner'] },
      { nl: 'Met verzonnen testdata blijven die fouten verborgen tot de go-live.', en: 'With invented data, those errors stay hidden until go-live.', focus: ['fake'] },
    ]),
    sc('s4', UA, 1, { nl: 'Sign-off, en wat misgaat', en: 'Sign-off, and what goes wrong' }, [
      { nl: '{t:Sign-off|Sign-off}: de proceseigenaren accepteren formeel, vaak gekoppeld aan een betaling.', en: '{t:Sign-off|Sign-off}: the process owners accept formally, often linked to a payment.', cue: { 'Sign-off': 'sign' }, focus: ['sign', 'lSign', 'owner'] },
      { nl: 'UAT is niet de training, en geen moment voor nieuwe wensen: die gaan naar het wijzigingsproces.', en: 'UAT is not the training, nor the moment for new wishes: they go to the change process.', focus: ['not'] },
      { nl: 'Vaak mis: de UAT van vier weken naar één geperst, key users testen tussen hun werk door.', en: 'Often wrong: the UAT squeezed from four weeks to one, key users testing between their work.', focus: ['wrong', 'wSqueeze'] },
      { nl: 'Of ze testen alleen het happy path, waarin alles goed gaat.', en: 'Or they only test the happy path, where everything goes right.', focus: ['happy', 'notes'] },
      { nl: 'Vraag: wie test, hoeveel uur per week vrijgemaakt, en met welke data?', en: 'Ask: who tests, how many hours a week are they freed, and with which data?', focus: ['askq', 'jij'] },
    ]),
    sc('s5', UA, 1, { nl: 'Voorbeeld: de UAT plannen', en: 'Example: planning the UAT' }, [
      { nl: 'Een voedingsbedrijf test vier processen van zijn nieuwe ERP: {n:120} testscripts, ook de lastige gevallen.', en: 'A food producer tests four processes of its new ERP: {n:120} test scripts, awkward cases included.', focus: ['food', 'awk', 'notes'] },
      { nl: 'Inspanning: {n:120} × {n:1.5} uur = {n:180} uur voor de eerste ronde.', en: 'Effort: {n:120} × {n:1.5} hours = {n:180} hours for round one.', focus: ['effort', 'scripts'] },
      { nl: 'Capaciteit: {n:8} key users × {n:18} uur, de helft van {n:36}: {n:144} uur per week.', en: 'Capacity: {n:8} key users × {n:18} hours, half of {n:36}: {n:144} hours a week.', focus: ['cap', 'planner', 'teamlead'] },
      { nl: 'Tijd: {n:180} uur gedeeld door {n:144} uur per week geeft {n:1.25} week voor één ronde.', en: 'Time: {n:180} hours divided by {n:144} hours a week gives {n:1.25} weeks for one round.', focus: ['time', 'wNeed'] },
      { nl: 'Gepland: twee weken voor ronde {n:1}, één week voor ronde {n:2}: hertesten wat gezakt is.', en: 'Planned: two weeks for round {n:1}, one week for round {n:2}: retesting what failed.', focus: ['plan', 'wR1', 'wR2'] },
      { nl: 'De vervanging van de key users is met de ploegleiders geregeld, voor de UAT begint.', en: 'The backfill for the key users is arranged with the shift leaders before the UAT starts.', focus: ['backfill', 'teamlead'] },
    ]),
    sc('s6', DF, 2, { nl: 'Bevinding en ernst', en: 'Defect and severity' }, [
      { nl: 'Een {t:Bevinding|bevinding} wijkt af van het verwachte resultaat, en wordt herhaalbaar vastgelegd.', en: 'A {t:Defect|defect} differs from the expected result, and is logged so someone else can repeat it.', cue: { Bevinding: 'defect' }, focus: ['defect', 'sheet'] },
      { nl: 'Niet elke bevinding is een fout: testdata, iets nog niet geleerd, of een nieuwe wens.', en: 'Not every defect is a fault: test data, something not learned yet, or a new wish.', focus: ['nofault'] },
      { nl: '{t:Ernst|Ernst}: {n:1} blokkerend, {n:2} zwaar met omweg, {n:3} klein, {n:4} cosmetisch.', en: '{t:Severity|Severity}: {n:1} blocking, {n:2} serious with a workaround, {n:3} minor, {n:4} cosmetic.', cue: { Ernst: 'sev' }, focus: ['sev', 'sSev', 'notes'] },
      { nl: 'Prioriteit: hoe snel het opgelost moet worden. Een datum kan hem verhogen.', en: 'Priority: how fast it must be fixed. A date can raise it.', focus: ['prio'] },
    ]),
    sc('s7', DF, 2, { nl: 'Triage en hertest', en: 'Triage and retest' }, [
      { nl: '{t:Triage|Triage}: dagelijks bevindingen sorteren. Echt een fout? Welke ernst? Wie lost hem op, wanneer?', en: '{t:Triage|Triage}: sorting defects daily. A real fault? What severity? Who fixes it, by when?', cue: { Triage: 'triage' }, focus: ['triage', 'notes', 'partner', 'planner', 'owner'] },
      { nl: 'Een andonreactie: snel, dicht bij het werk. Laatste woord over de ernst: de proceseigenaar, niet de partner.', en: 'An andon response: fast, close to the work. The last word on severity: the process owner, not the partner.', focus: ['andon', 'owner'] },
      { nl: '{t:Hertest|Hertest}: na een oplossing het script opnieuw. Slaagt het, dan gaat de bevinding dicht.', en: '{t:Retest|Retest}: after a fix, run the script again. If it passes, the defect is closed.', cue: { Hertest: 'retest' }, focus: ['retest', 'sheet'] },
      { nl: '{t:Regressietest|Regressietest}: eerder geslaagde scripts opnieuw, want een oplossing kan elders iets breken.', en: '{t:Regression test|Regression test}: scripts that passed before, run again: a fix can break something elsewhere.', cue: { Regressietest: 'regr' }, focus: ['regr', 'scripts'] },
    ]),
    sc('s8', DF, 2, { nl: 'Exitcriteria', en: 'Exit criteria' }, [
      { nl: '{t:Exitcriteria|Exitcriteria}: vooraf afgesproken voorwaarden die zeggen wanneer de UAT klaar is.', en: '{t:Exit criteria|Exit criteria}: conditions agreed in advance that say when the UAT is finished.', cue: { Exitcriteria: 'exit' }, focus: ['exit', 'lUat'] },
      { nl: 'Bijvoorbeeld: {n:100}% uitgevoerd, minstens {n:95}% geslaagd, geen open ernst {n:1}, ernst {n:2} met omweg en datum.', en: 'For example: {n:100}% run, at least {n:95}% passed, no open severity {n:1}, severity {n:2} with workaround and date.', focus: ['ex1', 'ex2', 'bRun', 'bLine'] },
      { nl: 'Vraag: wie bepaalt de ernst, en kan de partner die zelf verlagen?', en: 'Ask: who decides severity, and can the partner lower it on its own?', focus: ['askd', 'partner', 'owner'] },
    ]),
    sc('s9', DF, 2, { nl: 'Voorbeeld: dag 8', en: 'Example: day 8' }, [
      { nl: 'Dag {n:8}, nieuw MES: van {n:120} scripts {n:112} uitgevoerd, {n:101} geslaagd. {n:23} bevindingen open.', en: 'Day {n:8}, new MES: of {n:120} scripts, {n:112} run, {n:101} passed. {n:23} defects open.', focus: ['day', 'bRun', 'bPass', 'notes'] },
      { nl: 'Triage: {n:6} geen fout. {n:3} testdata, {n:2} training, {n:1} nieuwe wens.', en: 'Triage: {n:6} are no fault. {n:3} test data, {n:2} training, {n:1} new wish.', focus: ['six', 'notes'] },
      { nl: 'Er blijven er {n:17}: ernst {n:1}: {n:2}, ernst {n:2}: {n:5}, ernst {n:3}: {n:7}, ernst {n:4}: {n:3}.', en: '{n:17} remain: severity {n:1}: {n:2}, severity {n:2}: {n:5}, severity {n:3}: {n:7}, severity {n:4}: {n:3}.', focus: ['left', 'notes'] },
      { nl: 'Ernst {n:1}: een werkorder gaat niet dicht, en op het etiket ontbreekt het batchnummer.', en: 'Severity {n:1}: a work order cannot be closed, and the label misses the batch number.', focus: ['sev1', 'notes'] },
      { nl: 'Exit: alle {n:120} uitgevoerd, minstens {n:95}%: dat is {n:114}, dus nog {n:13} moeten slagen.', en: 'Exit: all {n:120} run, at least {n:95}%: that is {n:114}, so {n:13} more must pass.', focus: ['need', 'bLine'] },
      { nl: 'Beide met ernst {n:1}: opgelost, hertest, met een regressieset. De partner krijgt ze eerst, met een datum.', en: 'Both severity {n:1}: fixed, retested, covered by a regression set. The partner gets them first, with a date.', focus: ['fix', 'partner'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons' teach
// text and worked examples, so every point of the checklist above is said here
// or shown on the card. No symbol the voice would read aloud, no spoken
// parenthesis or quote; the quoted sentences are said in words. Dutch checked
// with espeak-ng phonemes through Piper's own bridge (nl_NL-alex, 2026-11-13).
// New SAY rules in films/_kit/timeline.mjs (tested; recomputed for every film:
// no other film's spoken text changes): UAT as letters (U A T), ISTQB as
// letters (ie es tee kuu bee), acceptatietesten and gebruikersacceptatietest
// split at their parts, testdata as test-data, softwaretesten as
// software-testen, sign-off as sain-of, happy path as heppi paath,
// regressietest and regressieset split at the head (hertest needs nothing:
// espeak-ng stresses it on test); in English ISTQB as letters. key users, go-live, MES, batch and the Lean
// consultant through the kit's existing rules; ERP stays as the kit says it.
// Said around because espeak-ng misreads them: a lone "scenario" (stressed
// SEE-naa-rio; the Dutch narration says testscenario, stressed on test, as
// Dutch does) and "Eén" at a sentence start (read "ee-een"; written Één).
const SAY = [
  [ // s1 the test levels; ISTQB
    { nl: 'Het eerste testniveau: de partner test zijn eigen configuratie, de systeemtest.',
      en: 'The first test level: the partner tests its own configuration, the system test.' },
    { nl: 'Dan de {t:Ketentest|ketentest}: een heel proces over alle systemen heen, van order tot factuur.',
      en: 'Then the {t:Chain test|chain test}: a whole process across all systems, order to invoice.' },
    { nl: 'Dan de {t:UAT|UAT}, de gebruikersacceptatietest: de toekomstige gebruikers controleren of het systeem hun werk ondersteunt, en accepteren het.',
      en: 'Then the {t:UAT|UAT}, the user acceptance test: future users check whether the system supports their work, and accept it.' },
    { nl: 'ISTQB, de internationale organisatie voor softwaretesten, omschreef acceptatietesten als formeel testen tegen de behoeften van gebruikers, requirements en bedrijfsprocessen.',
      en: 'ISTQB, the international board for software testing, described acceptance testing as formal testing against user needs, requirements and business processes.' },
  ],
  [ // s2 key users and test scenarios
    { nl: 'Testen doen {t:Key user|key users}: ervaren mensen van elke afdeling, die het systeem mee ontwerpen en later collega\'s trainen. Niet de partner.',
      en: '{t:Key user|Key users} test: experienced people from every department, who help design the system and later train colleagues. Not the partner.' },
    { nl: 'Ze testen met {t:Testscenario|testscenario\'s} uit het echte werk: een spoedorder bij een tekort, een geblokkeerde, half verpakte batch, een teruggestuurde pallet.',
      en: 'They test with {t:Test scenario|test scenarios} from real work: a rush order during a shortage, a blocked half-packed batch, a returned pallet.' },
    { nl: 'Elk testscenario verwijst naar de requirements, zodat elke Must getest is.',
      en: 'Each scenario links back to the requirements, so every Must is tested.' },
  ],
  [ // s3 the test script; real data
    { nl: 'Een {t:Testscript|testscript} werkt een testscenario uit: stappen, invoer en verwacht resultaat. De tester noteert wat er echt gebeurde: geslaagd of gezakt.',
      en: 'A {t:Test script|test script} spells a scenario out: steps, input and expected result. The tester notes what happened: pass or fail.' },
    { nl: 'Gebruik echte data uit de laatste proefmigratie: een key user ziet meteen dat een bekend artikel de verkeerde eenheid heeft, of dat een routing een stap mist.',
      en: 'Use real data from the last mock migration: a key user spots a familiar article with the wrong unit at once, or a routing missing a step.' },
    { nl: 'Met verzonnen testdata blijven die fouten verborgen tot de go-live.',
      en: 'With invented data, those errors stay hidden until go-live.' },
  ],
  [ // s4 sign-off; not training, not wishes; what goes wrong; the question
    { nl: 'De UAT eindigt met een {t:Sign-off|sign-off}: de proceseigenaren accepteren formeel dat hij aan de afgesproken criteria voldeed, vaak met een betaling aan de partner.',
      en: 'The UAT ends with {t:Sign-off|sign-off}: the process owners formally accept that it met the agreed criteria, often tied to a partner payment.' },
    { nl: 'Het is niet de training, al leren key users ervan, en geen moment voor nieuwe wensen: die gaan naar het wijzigingsproces.',
      en: 'It is not the training, though it helps key users learn, nor the moment for new wishes: those go to the change process.' },
    { nl: 'Vaak loopt de bouw uit, wordt de UAT van vier weken naar één geperst, en testen key users tussen hun gewone werk door.',
      en: 'Often the build runs late, the UAT is squeezed from four weeks to one, and key users test between their normal work.' },
    { nl: 'Of ze testen alleen het happy path, waarin alles goed gaat.',
      en: 'Or they test only the happy path, where everything goes right.' },
    { nl: 'Vraag dus: wie test, hoeveel uur per week zijn ze vrijgemaakt, en met welke data?',
      en: 'Ask: who tests, how many hours a week are they freed, and with which data?' },
  ],
  [ // s5 the food producer's plan
    { nl: 'Een voedingsbedrijf plant de UAT voor zijn nieuwe ERP: vier processen, honderdtwintig testscripts, ook de lastige gevallen.',
      en: 'A food producer plans the UAT for its new ERP: four processes, a hundred and twenty test scripts, awkward cases included.' },
    { nl: 'Één script kost gemiddeld anderhalf uur, inclusief het klaarzetten van de data: honderdtachtig uur voor ronde één.',
      en: 'One script takes an hour and a half on average, including preparing the data: a hundred and eighty hours for round one.' },
    { nl: 'Acht key users, elk de helft van een werkweek van zesendertig uur vrijgemaakt: honderdvierenveertig uur per week.',
      en: 'Eight key users, each freed for half of a thirty-six-hour week: a hundred and forty-four hours a week.' },
    { nl: 'Één ronde duurt dus één komma vijfentwintig week.',
      en: 'So one round takes one point two five weeks.' },
    { nl: 'Toch plant de projectleider twee weken voor ronde één, met ruimte voor bevindingen en wachten, en één week om te hertesten wat gezakt is.',
      en: 'Yet the project lead plans two weeks for round one, with room for defects and waiting, and one week to retest what failed.' },
    { nl: 'De vervanging van de key users wordt vooraf met de ploegleiders geregeld.',
      en: 'Backfill for the key users is arranged with the shift leaders beforehand.' },
  ],
  [ // s6 the defect; severity; priority
    { nl: 'Een {t:Bevinding|bevinding} is een resultaat dat afwijkt van het verwachte, vastgelegd met stappen, schermafdruk en scriptnummer, zodat een ander hem kan herhalen.',
      en: 'A {t:Defect|defect} is a result that differs from the expected one, logged with steps, screenshot and script ID, so others can repeat it.' },
    { nl: 'Niet elke bevinding is een fout in het systeem: het kan verkeerde testdata zijn, iets wat de tester nog niet geleerd heeft, of een nieuwe wens.',
      en: 'Not every defect is a system fault: it can be wrong test data, something the tester has not learned yet, or a new wish.' },
    { nl: 'De {t:Ernst|ernst} is de impact. Één: blokkerend, het proces kan niet verder, zoals verzenden. Twee: zwaar, met een omweg. Drie: klein. Vier: cosmetisch, zoals een typefout.',
      en: 'The {t:Severity|severity} is the impact. One: blocking, the process cannot continue, such as shipping. Two: serious, with a workaround. Three: minor. Four: cosmetic, such as a typo.' },
    { nl: 'Prioriteit is hoe snel het opgelost moet worden: meestal als de ernst, maar een datum kan hem verhogen, zoals een etiketformaat voor een klant die volgende maand lanceert.',
      en: 'Priority is how fast to fix it: usually as severity, but a date can raise it, like a label format for a customer launching next month.' },
  ],
  [ // s7 triage; retest; regression test
    { nl: '{t:Triage|Triage} is het dagelijkse overleg waarin testcoördinator, partner, key users en een proceseigenaar nieuwe bevindingen sorteren: echt een fout? Welke ernst? Wie lost hem op, wanneer?',
      en: '{t:Triage|Triage} is the daily meeting where test lead, partner, key users and a process owner sort new defects: a real fault? How severe? Who fixes it, by when?' },
    { nl: 'Voor een Lean-consultant lijkt het op een andonreactie: snel, dicht bij het werk, met de mensen die het kennen. De proceseigenaar heeft het laatste woord over de ernst, niet de partner.',
      en: 'For a Lean consultant it resembles an andon response: quick, close to the work, with the people who know it. The process owner has the last word on severity, not the partner.' },
    { nl: 'Na een oplossing voert de tester het script opnieuw uit: een {t:Hertest|hertest}. Slaagt die, dan gaat de bevinding dicht.',
      en: 'After a fix, the tester reruns the script: a {t:Retest|retest}. If it passes, the defect is closed.' },
    { nl: 'Een oplossing kan elders iets breken. Een {t:Regressietest|regressietest} voert daarom eerder geslaagde scripts opnieuw uit. Hoe groter de oplossing, hoe groter de set.',
      en: 'A fix can break something elsewhere, so a {t:Regression test|regression test} reruns scripts that passed earlier. The bigger the fix, the bigger the set.' },
  ],
  [ // s8 exit criteria; the question
    { nl: 'De UAT eindigt op {t:Exitcriteria|exitcriteria}: vooraf afgesproken voorwaarden die zeggen wanneer hij klaar is.',
      en: 'The UAT ends on {t:Exit criteria|exit criteria}: conditions agreed in advance that say when it is finished.' },
    { nl: 'Bijvoorbeeld: alle scripts uitgevoerd, minstens vijfennegentig procent geslaagd, geen open ernst één, ernst twee alleen met een geaccepteerde omweg en een datum.',
      en: 'For example: all scripts run, at least ninety-five percent passed, no open severity one, severity two only with an accepted workaround and a fix date.' },
    { nl: 'Vraag vooraf: wie bepaalt de ernst, en kan de partner die zelf verlagen? Zo ja, dan zijn de exitcriteria maar zo sterk als de partner wil.',
      en: 'Ask early: who decides severity, and can the partner lower it alone? If so, the criteria are only as strong as the partner wants.' },
  ],
  [ // s9 day 8 at the plastics processor
    { nl: 'Dag acht van de UAT voor een nieuw MES bij een kunststofverwerker. Van honderdtwintig scripts zijn er honderdtwaalf uitgevoerd en honderdeen geslaagd. Drieëntwintig bevindingen staan open.',
      en: 'Day eight of the UAT for a new MES at a plastics processor. Of a hundred and twenty scripts, a hundred and twelve have run, a hundred and one passed; twenty-three defects are open.' },
    { nl: 'In de triage blijken er zes geen fout: drie keer verkeerde testdata, twee keer een gat in de training, één nieuwe wens.',
      en: 'Triage finds six are no fault: three wrong test data, two a training gap, one a new wish.' },
    { nl: 'Er blijven er zeventien over: twee met ernst één, vijf met ernst twee, zeven met drie, drie met vier.',
      en: 'Seventeen remain: two of severity one, five of two, seven of three, three of four.' },
    { nl: 'Die twee: een werkorder kan niet worden afgesloten, en op het etiket ontbreekt het batchnummer.',
      en: 'Those two: a work order cannot be closed, and the label misses the batch number.' },
    { nl: 'De exitcriteria vragen vijfennegentig procent van honderdtwintig: honderdveertien. Er moeten er dus nog dertien slagen.',
      en: 'The exit criteria ask ninety-five percent of a hundred and twenty: a hundred and fourteen. So thirteen more must pass.' },
    { nl: 'Beide met ernst één moeten opgelost, hertest en gedekt zijn door een regressieset. De partner krijgt ze eerst, met een datum.',
      en: 'Both severity ones must be fixed, retested and covered by a regression set. The partner gets them first, with a date.' },
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
  nl: /\b(UAT|ISTQB|sign-off|happy path|\w*acceptatietest\w*|testdata|softwaretest\w*|regressie(test|set)|key users?|go-live|Eén)\b|(?<!test)scenario\b/i,
  en: /\bISTQB\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S|\d/.test(said)) throw new Error(`narration: a symbol or digit the voice reads aloud in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(sayable(plainSay(l[lang]), lang)), 0))));
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="planner"],[data-cue="teamlead"],[data-cue="partner"],[data-cue="owner"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-blk{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-pass{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.5}
.pm-barpass{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1.2}
.pm-over{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:4 3}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pm-mark{fill:none;stroke:var(--fp-accent);stroke-width:3;stroke-linecap:round}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.5}
.pm-fail{fill:var(--anatomy-strong);stroke:var(--anatomy-strong);stroke-width:.5}
.pm-def{fill:color-mix(in srgb,var(--fp-accent) 30%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.5}
.pm-hotnote{fill:var(--fp-accent);stroke:var(--fp-accent);stroke-width:.5}
.pm-grey{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-btick{fill:none;stroke:var(--fp-accent);stroke-width:1;stroke-linecap:round;stroke-linejoin:round}
.pm-bcross{fill:none;stroke:var(--anatomy-strong);stroke-width:1;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-blk{fill:var(--anatomy-face);stroke:var(--fp-focus);stroke-width:2.4}
[data-cue][data-on] .pm-barpass,[data-cue][data-on] .pm-over{fill:var(--anatomy-face);stroke:var(--fp-focus);stroke-width:2.4}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-def,[data-cue][data-on] .pm-pass,[data-cue][data-on] .pm-hotnote{stroke:var(--fp-focus-text);stroke-width:.8}
[data-cue][data-on] .pm-on{fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een testruimte voor de gebruikersacceptatietest. Aan de achterwand een whiteboard met vier kolommen vol kaartjes: eerst de testscripts van vier processen, geslaagd of gezakt, later de bevindingen per ernst. Op tafel twee laptops met het testsysteem, een stapel testscripts en een vel met vinkjes en kruisjes. Jij, de adviseur in petrol, staat bij het bord; twee key users, een planner met een tablet en de teamleider van de vloer; de partner met een laptop, en de proceseigenaar aan het eind van de tafel. Rechts een paneel met per scène een kaart, gemarkeerd als schema of voorbeeld. Onderaan de vier testniveaus, systeemtest, ketentest, UAT en sign-off, en daaronder de weken van de UAT of de balk van 120 testscripts.',
  en: 'A test room for the user acceptance test. On the back wall a whiteboard with four columns of notes: first the test scripts of four processes, passed or failed, later the defects by severity. On the table two laptops with the test system, a stack of test scripts and a sheet with ticks and crosses. You, the consultant in petrol, stand at the board; two key users, a planner with a tablet and the team lead from the floor; the partner with a laptop, and the process owner at the end of the table. At the right a panel with one card per scene, marked as diagram or example. Along the bottom the four test levels, system test, chain test, UAT and sign-off, and below them the weeks of the UAT or the bar of 120 test scripts.',
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
}

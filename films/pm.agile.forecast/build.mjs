// Dev tool, not shipped. Builds the explainer film "Voorspellen en sturen op
// flow / Forecasting and steering on flow" for the Projects course:
// pm.agile.forecast (level 4 of the topic Backlog en schatten) and
// pm.agile.flowsteer (level 4 of the topic Kanban en flow), in Agile werken.
//
//   node films/pm.agile.forecast/build.mjs            build the page
//   node films/pm.agile.forecast/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.agile.forecast.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// A lesson with a film no longer shows its worked example (v16 notes), so the
// film carries the whole teach text and the worked example of both lessons:
// the cone of uncertainty (s1), the probabilistic forecast and throughput
// (s2), the Monte Carlo simulation (s3), NoEstimates, Goodhart's law and the
// steering-committee questions (s4), the packaging-film maker's go-live date
// (s5); then the service level expectation and the percentile (s6), work item
// age and the cumulative flow diagram (s7), utilisation (s8) and the sorting
// machine maker's cycle times (s9). Both lessons fit in nine scenes and about
// 760 words a language, as the UAT and MoSCoW films did with their two lessons
// and the kanban film with three; details stand on the cards only where marked
// "card" below, each on screen at least one beat of 4 s or more.
//
// Consistent with the reviewed films: the room, the board and the team of
// pm.agile.kanban and pm.agile.backlog (the Scrum film's figures, its cast.mjs
// imported, not edited); throughput, cycle time, work item age, the Kanban
// Guide, Vacanti and velocity as those films say them (the kit's rules); the
// Lean consultant as pm.negotiate.batna and the UAT film say it; a range is a
// "bandbreedte", as pm.plan.wbs and pm.agile.backlog say it.
//
// Checklist (lesson point: scene and beat; "card" = on the card or the strip
// only, not spoken, on screen at least 4 s; every card stays up for the rest of
// its page):
//   forecast teach 1: the cone of uncertainty, a model from Barry Boehm in 1981,
//     later worked out by Steve McConnell; the earlier in a project, the wider
//     the range of an estimate (s1 b1); at the initial idea between 0.25 and 4
//     times the estimate; largely expert judgement (s1 b2), not hard
//     measurement (s1 b2 caption and card); the cone only narrows if you really
//     remove uncertainty, e.g. by delivering working pieces; letting time pass
//     on its own doesn't help (s1 b3)
//   forecast teach 2: a probabilistic forecast gives not a date but a
//     probability, "85% chance it is done before 1 March" (s2 b1); more honest
//     than one date, the sponsor chooses how much certainty he wants (s2 b2);
//     the basis historical data, often the throughput, the items the team
//     finishes per week (s2 b3); 4 to 8 a week, 60 open: 60 / 8 = 7.5 to 60 / 4
//     = 15 weeks (s2 b4; the two sums on the card and the strip)
//   forecast teach 3: a Monte Carlo simulation makes that more precise (card);
//     the computer draws weeks at random from the real history thousands of
//     times (s3 b1), for example 5, 7, 4, 6 (card), and adds up until the 60
//     items are done (s3 b1); thousands of possible end dates; read off: done
//     after so many weeks in 50% of runs, after so many in 85% (s3 b2); Daniel
//     Vacanti and Troy Magennis made this popular in agile teams; it only works
//     if the way of working stays roughly the same (s3 b3)
//   forecast teach 4: NoEstimates, a movement (card) that took off around 2012:
//     stop spending time estimating each item, cut work small and forecast with
//     the count of items (s4 b1); critics: for investment decisions you do need
//     to know a size (s4 b2); a recurring problem is Goodhart's law: when a
//     measure becomes a target, it ceases to be a good measure (s4 b3); make
//     velocity or the number of points a target and people serve the measure
//     instead of the work (s4 b4)
//   forecast teach 5: for you, this ties in with estimating with ranges; the
//     difference, the team's own data instead of a feeling (s4 b5); questions
//     that make you credible in a steering committee: what data is this date
//     based on, with what percentage of certainty, what happens to the date if
//     the backlog grows by 20% (s4 b6), when do we update the forecast (s4 b6
//     caption and card)
//   forecast example: a team at a packaging-film manufacturer replaces the old
//     labelling system; the steering committee wants a go-live date; 48 items
//     open, all small (s5 b1), a few days of work each on average (card);
//     throughput of the last 10 weeks 3, 6, 5, 4, 7, 5, 6, 4, 5, 5 (strip and
//     card), total 50, average 5 per week (s5 b2); a Monte Carlo simulation with
//     10,000 runs: about 3 in 4 within 10 weeks, 98% within 11, practically all
//     within 12 (s5 b3)
//   ask and reveal: which date do you advise, and what do you say with it;
//     first check the simulation with a quick sum: 48 / 5 = 9.6, about 10 weeks
//     at an average week; matches the simulation (s5 b4), where most runs finish
//     in week 10 (card); the slowest week, 3 items: 48 / 3 = 16 weeks, but every
//     week that slow is unlikely (s5 b5); within 10 weeks only about 75%, so for
//     85% certainty advise 11 weeks as the commitment (s5 b6); ten weeks of
//     history is little (s5 b7), so the real spread is probably wider (card);
//     this holds for 48 items, if the list grows the date moves; we update the
//     forecast every week (s5 b7), so you see a shift early (card)
//   flowsteer teach 1: a service level expectation (SLE), by the Kanban Guide,
//     an expectation of how long an item takes, with a probability attached:
//     85% of items done within 8 days (s6 b1); taken from your own data with a
//     percentile (s6 b2), the value below which a given share of the
//     measurements falls (card and caption); the 85th percentile of cycle times
//     is the time within which 85% of items were done (s6 b2); that tells a
//     customer more than an average (s6 b3)
//   flowsteer teach 2: with the SLE you steer daily on work item age (s7 b1),
//     the age of items still under way (card); an item nearing the limit, 7 of
//     the 8 days, you discuss now (s7 b1), not when it is already late (card);
//     an early signal (card), similar to a control chart: you step in before
//     the product falls outside specification (s7 b2)
//   flowsteer teach 3: a cumulative flow diagram shows per day how many items
//     are in each step, stacked as coloured bands; a band getting thicker, work
//     piling up there: your bottleneck (s7 b3); the lines for arrivals and done
//     drifting apart: work in progress growing (s7 b4); conservation of flow:
//     what starts must on average also finish; a condition for Little's law
//     (s7 b5)
//   flowsteer teach 4: utilisation, the share of available time people or
//     machines are busy (s8 b1); in the simplest queueing model waiting time
//     grows with utilisation / (1 - utilisation) (card), at 80% 4, at 90% 9, at
//     95% 19 (s8 b1); the exact numbers only hold for that model (s8 b2), but
//     the shape holds widely (card); Donald Reinertsen showed that product
//     development at high utilisation gets stuck in queues (s8 b2); a team at
//     100% has no room for the unexpected (s8 b3)
//   flowsteer teach 5: for you as a Lean consultant, like the reason for
//     buffers and heijunka (s8 b4), level scheduling (card); the variation in
//     knowledge work is much bigger than on a line (s8 b4); experts argue: well
//     below 100%, or rather reduce variation by making work smaller (s8 b5);
//     questions: what is our SLE, how many items are now past half of it (s8 b5
//     caption and card), which band on the diagram is growing (card)
//   flowsteer example: a machine-software team at a maker of sorting machines,
//     the cycle times of the last 20 completed items in working days (s9 b1),
//     sorted: 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 11, 14, 18, 25
//     (strip); the average 160 / 20 = 8 days, but the customer wants to know
//     what he can count on (s9 b1; the sum on the card)
//   ask and reveal: 85% of 20 is 17, the 17th item in the sorted row is 11
//     days; SLE: 85% within 11 working days (s9 b2); one item 9 working days in
//     "testing on the machine" nears that limit; discuss it today at the team
//     meeting (s9 b3; "at the team meeting" on the card): what is holding it up,
//     can someone help (s9 b3); the tail 14, 18 and 25 days; what those items
//     had in common, for example waiting for a machine to test on (card); often
//     the real improvement (s9 b4)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts as the lessons credit them, and no more: the cone of uncertainty is a
// model from Barry Boehm in 1981, later worked out by Steve McConnell; Daniel
// Vacanti and Troy Magennis made the Monte Carlo forecast popular in agile
// teams; NoEstimates took off around 2012; Goodhart's law as the lesson words
// it; the SLE as the Kanban Guide's; Donald Reinertsen showed that product
// development at high utilisation gets stuck in queues. The control chart and
// the buffers and heijunka are likenesses, as the lessons word them. Every
// count and duration is the lessons' own and asserted below (60 / 8 = 7.5;
// 60 / 4 = 15; the ten weeks sum to 50, average 5; 48 / 5 = 9.6; 48 / 3 = 16;
// 0.8 / 0.2 = 4, 0.9 / 0.1 = 9, 0.95 / 0.05 = 19; the twenty days sum to 160,
// 160 / 20 = 8; 85% of 20 = 17, the 17th is 11).
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here) as
// the team room of the kanban and backlog films: on the back wall a whiteboard
// with four columns of notes (the open items, the work under way, one item
// that ages in test), a clock (the days of the SLE), on the side wall a strip
// of twelve weeks; a table with a laptop (the simulation). People: you (the
// consultant, at the board), the sponsor (the steering committee) and two
// team members (pm.agile.scrum's figures). At the top right a panel with one
// card per scene, labelled "schema" or "voorbeeld"; along the bottom a strip
// with the chart of the scene: the cone, the range of weeks, the histogram of
// runs, the throughput bars, the cycle times, the ages, the cumulative flow
// diagram and the utilisation curve.
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
const FC = 'pm.agile.forecast';
const FS = 'pm.agile.flowsteer';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(FC, ['De onzekerheidskegel is een model van Barry Boehm uit 1981, later uitgewerkt door Steve McConnell: hoe vroeger in een project, hoe breder de bandbreedte van een schatting',
  'Bij het eerste idee kan het werk ergens tussen 0,25 en 4 keer de schatting uitkomen; die getallen zijn grotendeels ervaringsoordeel, geen harde meting',
  'De kegel smalt alleen als je echt onzekerheid wegneemt, bijvoorbeeld door werkende stukken op te leveren. Tijd laten verstrijken alleen helpt niet',
  'Een probabilistische voorspelling geeft geen datum, maar een kans: “85% kans dat het voor 1 maart af is.” Dat is eerlijker dan één datum, en de opdrachtgever kan zelf kiezen hoeveel zekerheid hij wil',
  'De basis is historische data, vaak de throughput: het aantal items dat het team per week afmaakt. Haalt het team 4 tot 8 items per week en staan er 60 open, dan is dat 60 / 8 = 7,5 tot 60 / 4 = 15 weken',
  'Een Monte Carlo-simulatie maakt dat preciezer. De computer trekt duizenden keren willekeurig weken uit de echte historie, bijvoorbeeld 5, 7, 4, 6, en telt op tot de 60 items af zijn. Zo ontstaan duizenden mogelijke einddata',
  'Daaruit lees je af: in 50% van de runs klaar na zoveel weken, in 85% na zoveel. Daniel Vacanti en Troy Magennis maakten dit populair in agile teams. Het werkt alleen als de manier van werken ongeveer gelijk blijft',
  'NoEstimates is een beweging die rond 2012 op gang kwam: stop met tijd steken in schatten van elk item, knip werk klein en voorspel met het aantal items. Critici zeggen dat je voor investeringsbeslissingen wel een grootte moet weten',
  'Een terugkerend probleem is de wet van Goodhart: zodra een maat een doel wordt, is het geen goede maat meer. Maak je velocity of het aantal punten een doel, dan gaan mensen de maat bedienen in plaats van het werk',
  'Voor jou: dit sluit aan op wat je over schatten met bandbreedtes weet. Het verschil is dat je hier de data van het team zelf gebruikt in plaats van een gevoel',
  '“Op welke data is deze datum gebaseerd?” “Met hoeveel procent zekerheid?” “Wat gebeurt er met de datum als de backlog met 20% groeit?” “Wanneer werken we de voorspelling bij?”',
  'Een team bij een fabrikant van verpakkingsfolie vervangt het oude labelsysteem. De stuurgroep wil een livegangdatum. Nog open: 48 items, allemaal klein, gemiddeld een paar dagen werk',
  'Throughput van de laatste 10 weken, in afgemaakte items per week: 3, 6, 5, 4, 7, 5, 6, 4, 5, 5. Samen 50, gemiddeld 5 per week',
  'Een Monte Carlo-simulatie met 10.000 runs geeft: ongeveer 3 op de 4 runs klaar binnen 10 weken, 98% binnen 11 weken, vrijwel alle binnen 12 weken',
  'Welke datum adviseer je de stuurgroep, en wat zeg je erbij? Controleer eerst of de uitkomst van de simulatie klopt met een snelle eigen som',
  'Snelle som: 48 / 5 = 9,6, dus rond 10 weken bij een gemiddelde week; dat past bij de simulatie, waarin de meeste runs in week 10 klaar zijn. Met de traagste week, 3 items: 48 / 3 = 16 weken, maar alle weken zo traag is onwaarschijnlijk',
  'Binnen 10 weken is maar zo’n 75%, dus voor 85% zekerheid adviseer je 11 weken als toezegging. Tien weken historie is weinig, dus de echte spreiding is waarschijnlijk groter',
  'Zeg erbij: dit geldt voor 48 items; groeit de lijst, dan schuift de datum. We werken de voorspelling elke week bij, zodat jullie een verschuiving vroeg zien']);
says(FS, ['Een service level expectation (SLE) is volgens de Kanban Guide een verwachting voor hoe lang een item duurt, met een kans erbij: bijvoorbeeld “85% van de items is binnen 8 dagen klaar”',
  'Je haalt hem uit je eigen data met een percentiel: de waarde waar een bepaald deel van de metingen onder valt. Het 85e percentiel van de cycle times is de tijd waarbinnen 85% van de items klaar was. Dat zegt een klant meer dan een gemiddelde',
  'Met de SLE stuur je dagelijks op work item age, de leeftijd van items die nog onderweg zijn. Nadert een item de grens, bijvoorbeeld 7 van de 8 dagen, dan bespreek je het nu, niet als het al te laat is',
  'Dat is een vroeg signaal, vergelijkbaar met een regelkaart: je grijpt in voordat het product buiten de specificatie valt',
  'Een cumulatief stroomdiagram (cumulative flow diagram) toont per dag hoeveel items er in elke stap zitten, gestapeld als gekleurde banden. Wordt een band dikker, dan hoopt werk zich daar op: daar zit je bottleneck. Lopen de lijnen voor binnenkomst en klaar uit elkaar, dan groeit het onderhanden werk',
  'Dat raakt aan behoud van flow (conservation of flow): wat begint moet gemiddeld ook afkomen. Dat is een voorwaarde om de wet van Little te mogen gebruiken',
  'Bezettingsgraad is het deel van de beschikbare tijd dat mensen of machines bezig zijn. In het eenvoudigste wachtrijmodel groeit de wachttijd met bezetting / (1 − bezetting): bij 80% is dat 4, bij 90% 9, bij 95% 19',
  'De precieze getallen gelden alleen voor dat model, maar de vorm geldt breed: Donald Reinertsen liet zien dat productontwikkeling bij hoge bezetting vastloopt in wachtrijen. Een team op 100% heeft geen ruimte voor het onverwachte',
  'Voor jou als Lean-consultant: dit ken je als de reden voor buffers en heijunka, gelijkmatig plannen. Het verschil is dat variatie in kenniswerk veel groter is dan op een lijn',
  'Waar experts over discussiëren: sommigen zeggen dat je ver onder 100% moet plannen, anderen dat je beter variatie verkleint door werk kleiner te maken. Vragen die je geloofwaardig maken: “Wat is onze SLE, en hoeveel items staan er nu boven de helft ervan?” “Welke band op het diagram groeit?”',
  'Een team voor machinesoftware bij een fabrikant van sorteermachines kijkt naar de cycle times van de laatste 20 afgeronde items, in werkdagen, van kort naar lang: 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 11, 14, 18, 25',
  'Het gemiddelde is 160 / 20 = 8 dagen. Maar de klant wil weten waar hij op kan rekenen', 'Eén item staat nu al 9 werkdagen in “testen op de machine”',
  '85% van 20 is 17: het 17e item in de gesorteerde rij is 11 dagen. SLE: “85% van de items is binnen 11 werkdagen klaar.” Het item van 9 dagen nadert die grens; bespreek het vandaag in het teamoverleg: wat houdt het op, kan iemand helpen?',
  'Let ook op de staart: 14, 18 en 25 dagen. Kijk wat die items gemeen hadden, bijvoorbeeld wachten op een machine om op te testen. Dat is vaak de echte verbetering']);
says(FC, ['The cone of uncertainty is a model from Barry Boehm in 1981, later worked out by Steve McConnell', 'Daniel Vacanti and Troy Magennis made this popular in agile teams',
  'A team at a packaging-film manufacturer is replacing the old labelling system'], 'en');
says(FS, ['A service level expectation (SLE) is, by the Kanban Guide', 'similar to a control chart', 'Donald Reinertsen showed that product development at high utilisation gets stuck in queues',
  'For you as a Lean consultant: you know this as the reason for buffers and heijunka, level scheduling', 'A machine-software team at a maker of sorting machines'], 'en');
assert(lessons.nl.get(FC).terms.map((t) => t.term).join() === 'Onzekerheidskegel,Probabilistische voorspelling,Monte Carlo-simulatie,NoEstimates,Wet van Goodhart', 'the five terms of forecast (nl)');
assert(lessons.en.get(FC).terms.map((t) => t.term).join() === 'Cone of uncertainty,Probabilistic forecast,Monte Carlo simulation,NoEstimates,Goodhart’s law', 'the five terms of forecast (en)');
assert(lessons.nl.get(FS).terms.map((t) => t.term).join() === 'Service level expectation,Percentiel,Cumulatief stroomdiagram,Behoud van flow,Bezettingsgraad', 'the five terms of flowsteer (nl)');
assert(lessons.en.get(FS).terms.map((t) => t.term).join() === 'Service level expectation,Percentile,Cumulative flow diagram,Conservation of flow,Utilisation', 'the five terms of flowsteer (en)');
for (const lang of ['nl', 'en']) for (const id of [FC, FS]) {
  const f = lessons[lang].get(id).film;
  assert(!f || f === 'pm.agile.forecast', `${id} (${lang}) has film ${f}: never overwrite another film`);
}
// the range from throughput
assert(60 / 8 === 7.5 && 60 / 4 === 15, '60 / 8 = 7.5 and 60 / 4 = 15 weeks');
// the packaging-film example
const TP = [3, 6, 5, 4, 7, 5, 6, 4, 5, 5];
const sum = (a) => a.reduce((x, y) => x + y, 0);
assert(TP.length === 10 && sum(TP) === 50 && sum(TP) / TP.length === 5, 'ten weeks, together 50, on average 5');
assert(48 / 5 === 9.6 && Math.min(...TP) === 3 && 48 / 3 === 16, '48 / 5 = 9.6; the slowest week 3; 48 / 3 = 16');
// utilisation in the simplest queueing model
const wait = (u) => Math.round((u / (1 - u)) * 100) / 100;
assert(wait(0.8) === 4 && wait(0.9) === 9 && wait(0.95) === 19, 'u / (1 - u) at 80, 90, 95% is 4, 9, 19');
// the sorting machines' cycle times
const CT = [2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 11, 14, 18, 25];
assert(CT.length === 20 && sum(CT) === 160 && sum(CT) / 20 === 8, 'twenty cycle times, 160 / 20 = 8 days');
assert(CT.every((v, i) => i === 0 || CT[i - 1] <= v), 'the cycle times run from short to long');
assert(0.85 * 20 === 17 && CT[16] === 11, '85% of 20 is 17; the 17th is 11 days');
assert(CT.slice(-3).join() === '14,18,25', 'the tail: 14, 18, 25');
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

// the kanban board: four columns (a header bar each and a divider), the notes
// drawn by stage.js into "notesIn" in the board's face plane (u = x, v = -z)
const BX0 = 40;
const BX1 = 196;
const BOARD = w.board({ x0: BX0, x1: BX1, z0: 100, z1: 196 });
const NOTES = { u0: BX0 + 9, du: 37, v0: -184, dv: 10.4, w: 20, h: 7.4 };
const heads = [0, 1, 2, 3].map((c) => `<path class="pm-rule" style="stroke-width:1.6" d="M${NOTES.u0 + c * NOTES.du} -189H${NOTES.u0 + c * NOTES.du + NOTES.w}"/>`).join('')
  + [1, 2, 3].map((c) => `<path class="pm-rule" d="M${NOTES.u0 + c * NOTES.du - 8.5} -191V-104"/>`).join('');
const boardSvg = cueG('board', BOARD.svg + `<g transform="${BOARD.face}">${heads}</g>`);
const notesSvg = cueG('notes', `<g transform="${BOARD.face}">${g('notesIn', '')}</g>`);
// twelve weeks on the side wall, marked per scene by stage.js
const CAL = w.calendar({ y0: 40, z0: 132, weeks: 12, cw: 11, ch: 22 });
const CELLS = Array.from({ length: 12 }, (_, i) => CAL.cell(i).map(r1));
const weeksSvg = cueG('weeks', CAL.svg + `<g transform="${CAL.face}">${g('cMarks', '')}</g>`);
const TABLE = { x: 120, y: 120, w: 112, d: 60, h: 74 };
const TZ = TABLE.h;
const world = [
  w.room(ROOM),
  boardSvg,
  notesSvg,
  weeksSvg,
  cueG('clock', w.clock(236, 176, 12)),
  w.person({ x: 20, y: 54, role: 'jij', along: 'x', reach: [44, 6, 150] }),
  g('team', scrumPerson(w, k, G, P, { x: 140, y: 88, key: 'team', look: 'dev2', along: 'x' })
    + scrumPerson(w, k, G, P, { x: 196, y: 92, key: 'team', look: 'sm', along: 'x' })),
  w.table(TABLE),
  cueG('laptop', w.laptop({ x: 160, y: 150, z: TZ, toward: 1 })),
  w.stack({ x: 196, y: 152, z: TZ, n: 3 }),
  w.cup(136, 164, TZ),
  w.person({ x: 262, y: 156, role: 'sponsor', along: 'y' }),
].join('');
for (const r of ['jij', 'sponsor', 'team', 'board', 'notes', 'weeks', 'clock', 'laptop']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel and the strip (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 328;
const PW = 304;
const CUES = ['cone', 'range', 'narrow',
  'prob', 'honest', 'tp', 'calc',
  'mc', 'read', 'vac',
  'noest', 'critic', 'good', 'serve', 'you', 'askf',
  'film', 'hist', 'sim', 'sum', 'slow', 'advise', 'add',
  'sle', 'pct', 'avg',
  'age', 'ctrl', 'cfd', 'grow', 'cons',
  'util', 'rein', 'full', 'lean', 'exp',
  'sort', 'p85', 'nine', 'tail'];
// the strip: one chart per scene, each part its own cue group
const STRIP = { y0: 294, y1: 396 };
const SPARTS = ['sCone', 'sNarrow', 'sDate', 'sRange', 'sHist', 'sP50', 'sP85', 'sRow', 'sGood', 'sAsk',
  'sTp', 'sCum', 'sSort', 'sPct', 'sAge', 'sCfd', 'sGrow', 'sCons', 'sCurve', 'sLean', 'sBars', 'sP17', 'sNine', 'sTail'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="10" width="${PW}" height="278" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''))
  + g('strip', `<rect class="pm-panel" x="8" y="${STRIP.y0}" width="624" height="${STRIP.y1 - STRIP.y0}" rx="10"/>`
  + SPARTS.map((c) => cueG(c, g(c, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.itproject.cutover and
// pm.itproject.uat): the same points, fewer bytes; each rewrite is read back.
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
  + `<clipPath id="fc-room"><rect x="0" y="0" width="${RW}" height="${RH}"/></clipPath>`
  + `<g clip-path="url(#fc-room)">${g('world', world)}</g>${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const AT = (p) => w.at(p).map(r1);
const BOARD_AT = AT([118, 0, 150]);
const TABLE_AT = AT([170, 150, TZ]);
const CAL_AT = AT([0, 100, 150]);
const SPONSOR_AT = AT([250, 156, 120]);
const MID = [RW / 2, RH / 2, 1];
const CAM = [
  { from: MID, to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.08] },
  { from: [CAL_AT[0] + 30, CAL_AT[1], 1.04], to: [SPONSOR_AT[0], SPONSOR_AT[1], 1.08] },
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1], 1.12] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 20, 1.06], to: MID },
  { from: [TABLE_AT[0], TABLE_AT[1], 1.06], to: [CAL_AT[0] + 30, CAL_AT[1], 1.08] },
  { from: MID, to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 30, 1.1], to: MID },
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1] - 20, 1.08] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 20, 1.04], to: [BOARD_AT[0] + 20, BOARD_AT[1] + 30, 1.12] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, SPARTS, STRIP, NOTES, CELLS, TP, CT, CAM_N: CAM.length };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.agile.forecast',
  title: { nl: 'Voorspellen en sturen op flow', en: 'Forecasting and steering on flow' },
  lessons: [FC, FS],
  strictFocus: true,
  scenes: [
    sc('s1', FC, 4, { nl: 'De onzekerheidskegel', en: 'The cone of uncertainty' }, [
      { nl: '{t:Onzekerheidskegel|Onzekerheidskegel}: hoe vroeger in een project, hoe breder de bandbreedte.', en: '{t:Cone of uncertainty|Cone of uncertainty}: the earlier in a project, the wider the range.', cue: { Onzekerheidskegel: 'cone' }, focus: ['cone', 'sCone'] },
      { nl: 'Bij het eerste idee: {n:0.25} tot {n:4} keer de schatting. Grotendeels ervaringsoordeel, geen harde meting.', en: 'At the initial idea: {n:0.25} to {n:4} times the estimate. Largely expert judgement, not hard measurement.', focus: ['range', 'sCone'] },
      { nl: 'De kegel smalt alleen als je onzekerheid wegneemt, zoals met werkende stukken. Tijd alleen helpt niet.', en: 'The cone only narrows if you remove uncertainty, such as with working pieces. Time alone does not help.', focus: ['narrow', 'sNarrow', 'team'] },
    ]),
    sc('s2', FC, 4, { nl: 'Een kans, geen datum', en: 'A probability, not a date' }, [
      { nl: 'Een {t:Probabilistische voorspelling|probabilistische voorspelling}: {n:85}% kans dat het voor {n:1} maart af is.', en: 'A {t:Probabilistic forecast|probabilistic forecast}: an {n:85}% chance it is done before {n:1} March.', cue: { 'Probabilistische voorspelling': 'prob' }, focus: ['prob', 'sDate'] },
      { nl: 'Eerlijker dan één datum: de opdrachtgever kiest zelf hoeveel zekerheid hij wil.', en: 'More honest than one date: the sponsor chooses how much certainty he wants.', focus: ['honest', 'sponsor'] },
      { nl: 'De basis: historische data, vaak de throughput, het aantal items dat het team per week afmaakt.', en: 'The basis: historical data, often the throughput, the number of items the team finishes per week.', focus: ['tp', 'notes', 'weeks'] },
      { nl: '{n:4} tot {n:8} items per week, {n:60} open: {n:60} / {n:8} = {n:7.5} tot {n:60} / {n:4} = {n:15} weken.', en: '{n:4} to {n:8} items a week, {n:60} open: {n:60} / {n:8} = {n:7.5} to {n:60} / {n:4} = {n:15} weeks.', focus: ['calc', 'sRange'] },
    ]),
    sc('s3', FC, 4, { nl: 'Monte Carlo', en: 'Monte Carlo' }, [
      { nl: 'Een {t:Monte Carlo-simulatie|Monte Carlo-simulatie} trekt duizenden keren weken uit de echte historie.', en: 'A {t:Monte Carlo simulation|Monte Carlo simulation} draws weeks from the real history, thousands of times.', cue: { 'Monte Carlo-simulatie': 'mc' }, focus: ['mc', 'laptop', 'sHist'] },
      { nl: 'Duizenden einddata: in {n:50}% van de runs klaar na zoveel weken, in {n:85}% na zoveel.', en: 'Thousands of end dates: done after so many weeks in {n:50}% of runs, after so many in {n:85}%.', focus: ['read', 'sP50', 'sP85'] },
      { nl: 'Daniel Vacanti en Troy Magennis maakten dit populair. Werkt alleen bij een ongeveer gelijke manier van werken.', en: 'Daniel Vacanti and Troy Magennis made this popular. Only works if the way of working stays roughly the same.', focus: ['vac', 'team'] },
    ]),
    sc('s4', FC, 4, { nl: 'NoEstimates en Goodhart', en: 'NoEstimates and Goodhart' }, [
      { nl: '{t:NoEstimates|NoEstimates}, rond 2012: niet elk item schatten, werk klein knippen, voorspellen met het aantal.', en: '{t:NoEstimates|NoEstimates}, around 2012: don’t estimate each item, cut work small, forecast with the count.', cue: { NoEstimates: 'noest' }, focus: ['noest', 'sRow'] },
      { nl: 'Critici: voor investeringsbeslissingen moet je wel een grootte weten.', en: 'Critics: for investment decisions you do need to know a size.', focus: ['critic', 'sponsor'] },
      { nl: 'De {t:Wet van Goodhart|wet van Goodhart}: zodra een maat een doel wordt, is het geen goede maat meer.', en: '{t:Goodhart’s law|Goodhart’s law}: when a measure becomes a target, it ceases to be a good measure.', cue: { 'Wet van Goodhart': 'good' }, focus: ['good', 'sGood'] },
      { nl: 'Velocity of punten als doel: mensen bedienen de maat in plaats van het werk.', en: 'Velocity or points as a target: people serve the measure instead of the work.', focus: ['serve', 'sGood', 'team'] },
      { nl: 'Voor jou: bandbreedtes, maar uit de data van het team zelf in plaats van een gevoel.', en: 'For you: ranges again, but from the team’s own data instead of a feeling.', focus: ['you', 'jij'] },
      { nl: 'Vraag: op welke data? Hoeveel procent zekerheid? En als de backlog {n:20}% groeit? Wanneer bijwerken?', en: 'Ask: what data? What percentage of certainty? And if the backlog grows {n:20}%? When do we update?', focus: ['askf', 'sAsk', 'sponsor'] },
    ]),
    sc('s5', FC, 4, { nl: 'Voorbeeld: een livegangdatum', en: 'Example: a go-live date' }, [
      { nl: 'Verpakkingsfolie, nieuw labelsysteem: nog {n:48} kleine items open. De stuurgroep wil een livegangdatum.', en: 'Packaging film, new labelling system: {n:48} small items open. The steering committee wants a date.', focus: ['film', 'notes', 'sponsor'] },
      { nl: 'Throughput van de laatste {n:10} weken: samen {n:50}, gemiddeld {n:5} per week.', en: 'Throughput over the last {n:10} weeks: total {n:50}, average {n:5} a week.', focus: ['hist', 'sTp', 'weeks'] },
      { nl: 'Simulatie, {n:10000} runs: {n:3} op de {n:4} binnen {n:10} weken, {n:98}% binnen {n:11}, vrijwel alle binnen {n:12}.', en: 'Simulation, {n:10000} runs: {n:3} in {n:4} within {n:10} weeks, {n:98}% within {n:11}, practically all within {n:12}.', focus: ['sim', 'sCum', 'laptop'] },
      { nl: 'Welke datum adviseer je? Eerst een snelle som: {n:48} / {n:5} = {n:9.6}, rond {n:10} weken.', en: 'Which date do you advise? First a quick sum: {n:48} / {n:5} = {n:9.6}, about {n:10} weeks.', focus: ['sum', 'sCum'] },
      { nl: 'Traagste week, {n:3} items: {n:48} / {n:3} = {n:16} weken. Alle weken zo traag is onwaarschijnlijk.', en: 'Slowest week, {n:3} items: {n:48} / {n:3} = {n:16} weeks. Every week that slow is unlikely.', focus: ['slow', 'sTp'] },
      { nl: 'Binnen {n:10} weken is maar zo’n {n:75}%. Voor {n:85}% zekerheid: {n:11} weken als toezegging.', en: 'Within {n:10} weeks is only about {n:75}%. For {n:85}% certainty: {n:11} weeks as the commitment.', focus: ['advise', 'sCum', 'sponsor'] },
      { nl: 'Zeg erbij: weinig historie, en dit geldt voor {n:48} items. Groeit de lijst, dan schuift de datum.', en: 'Add: little history, and this holds for {n:48} items. If the list grows, the date moves.', focus: ['add', 'weeks', 'jij'] },
    ]),
    sc('s6', FS, 4, { nl: 'Service level expectation', en: 'Service level expectation' }, [
      { nl: 'Een {t:Service level expectation|service level expectation}: een tijd met een kans, zoals {n:85}% binnen {n:8} dagen.', en: 'A {t:Service level expectation|service level expectation}: a time with a probability, such as {n:85}% within {n:8} days.', cue: { 'Service level expectation': 'sle' }, focus: ['sle', 'clock'] },
      { nl: 'Uit eigen data, met een {t:Percentiel|percentiel}: de waarde waar een deel van de metingen onder valt.', en: 'From your own data, with a {t:Percentile|percentile}: the value below which a share of the measurements falls.', cue: { Percentiel: 'pct' }, focus: ['pct', 'sSort', 'sPct'] },
      { nl: 'Het {n:85}e percentiel van de cycle times zegt een klant meer dan een gemiddelde.', en: 'The {n:85}th percentile of the cycle times tells a customer more than an average.', focus: ['avg', 'sPct'] },
    ]),
    sc('s7', FS, 4, { nl: 'Leeftijd en stroomdiagram', en: 'Age and flow diagram' }, [
      { nl: 'Stuur dagelijks op work item age. Nadert een item de grens, {n:7} van de {n:8} dagen? Bespreek het nu.', en: 'Steer daily on work item age. An item nearing the limit, {n:7} of the {n:8} days? Discuss it now.', focus: ['age', 'sAge', 'notes'] },
      { nl: 'Een vroeg signaal, vergelijkbaar met een regelkaart: ingrijpen voor het buiten de specificatie valt.', en: 'An early signal, similar to a control chart: step in before it falls outside specification.', focus: ['ctrl', 'sAge'] },
      { nl: 'Een {t:Cumulatief stroomdiagram|cumulatief stroomdiagram}: items per stap als banden. Dikkere band: bottleneck.', en: 'A {t:Cumulative flow diagram|cumulative flow diagram}: items per step as bands. Thicker band: bottleneck.', cue: { 'Cumulatief stroomdiagram': 'cfd' }, focus: ['cfd', 'sCfd'] },
      { nl: 'Lopen binnenkomst en klaar uit elkaar, dan groeit het onderhanden werk.', en: 'If arrivals and done drift apart, work in progress is growing.', focus: ['grow', 'sGrow'] },
      { nl: '{t:Behoud van flow|Behoud van flow}: wat begint, komt gemiddeld ook af. Voorwaarde voor de wet van Little.', en: '{t:Conservation of flow|Conservation of flow}: what starts must on average also finish. A condition for Little’s law.', cue: { 'Behoud van flow': 'cons' }, focus: ['cons', 'sCons'] },
    ]),
    sc('s8', FS, 4, { nl: 'Bezetting en wachttijd', en: 'Utilisation and waiting' }, [
      { nl: '{t:Bezettingsgraad|Bezettingsgraad}: bij {n:80}% groeit de wachttijd met factor {n:4}, bij {n:90}% {n:9}, bij {n:95}% {n:19}.', en: '{t:Utilisation|Utilisation}: at {n:80}% waiting time grows by a factor {n:4}, at {n:90}% {n:9}, at {n:95}% {n:19}.', cue: { Bezettingsgraad: 'util' }, focus: ['util', 'sCurve'] },
      { nl: 'Getallen van één model. Reinertsen liet zien: productontwikkeling loopt bij hoge bezetting vast in wachtrijen.', en: 'Numbers from one model. Reinertsen showed: product development at high utilisation gets stuck in queues.', focus: ['rein', 'sCurve'] },
      { nl: 'Een team op {n:100}% heeft geen ruimte voor het onverwachte.', en: 'A team at {n:100}% has no room for the unexpected.', focus: ['full', 'team'] },
      { nl: 'Voor jou: dit ken je als reden voor buffers en heijunka. Maar kenniswerk varieert veel meer dan op een lijn.', en: 'For you: the reason for buffers and heijunka. But knowledge work varies far more than on a line.', focus: ['lean', 'sLean', 'jij'] },
      { nl: 'Experts twisten: ver onder {n:100}% plannen, of variatie verkleinen met kleiner werk?', en: 'Experts argue: plan well below {n:100}%, or reduce variation with smaller work?', focus: ['exp', 'sLean'] },
    ]),
    sc('s9', FS, 4, { nl: 'Voorbeeld: een SLE afspreken', en: 'Example: agreeing an SLE' }, [
      { nl: 'Sorteermachines: {n:20} cycle times, gemiddeld {n:8} werkdagen. Waar kan de klant op rekenen?', en: 'Sorting machines: {n:20} cycle times, on average {n:8} working days. What can the customer count on?', focus: ['sort', 'sBars'] },
      { nl: '{n:85}% van {n:20} is {n:17}. Het {n:17}e is {n:11} dagen. SLE: {n:85}% binnen {n:11} werkdagen.', en: '{n:85}% of {n:20} is {n:17}. The {n:17}th is {n:11} days. SLE: {n:85}% within {n:11} working days.', focus: ['p85', 'sP17'] },
      { nl: 'Eén item staat al {n:9} dagen in testen op de machine. Bespreek het vandaag: wat houdt het op?', en: 'One item has been {n:9} days in testing on the machine. Discuss it today: what is holding it up?', focus: ['nine', 'sNine', 'notes', 'team'] },
      { nl: 'De staart: {n:14}, {n:18} en {n:25} dagen. Wat hadden die gemeen? Daar zit vaak de echte verbetering.', en: 'The tail: {n:14}, {n:18} and {n:25} days. What did they have in common? Often the real improvement.', focus: ['tail', 'sTail'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons' teach
// text and worked examples, so every point of the checklist above is said here
// or shown on the card. No symbol the voice would read aloud, no spoken
// parenthesis or quote, no digits; few colons and comma lists, as Piper pauses
// long at them. Dutch checked with espeak-ng phonemes through Piper's own
// bridge (nl_NL-alex, 2026-11-13), English with en_GB-alan. New SAY rules in
// films/_kit/timeline.mjs (tested; recomputed for every film: no other film's
// spoken text changes), listed there. Throughput, cycle time, work item age,
// the Kanban Guide, Vacanti (in Dutch), velocity, Goodhart, heijunka (in
// Dutch), agile and the Lean consultant go through the kit's existing rules.
// Written around because espeak-ng misreads it: "Eén" at a sentence start
// (read "ee-een"; written Één, as the UAT film).
const SAY = [
  [ // s1 the cone of uncertainty
    { nl: 'De {t:Onzekerheidskegel|onzekerheidskegel} is een model van Barry Boehm uit negentienhonderdeenentachtig, later uitgewerkt door Steve McConnell. Hoe vroeger in een project, hoe breder de bandbreedte.',
      en: 'The {t:Cone of uncertainty|cone of uncertainty} is a model from Barry Boehm in nineteen eighty-one, later worked out by Steve McConnell. The earlier in a project, the wider the range.' },
    { nl: 'Bij het eerste idee ligt het tussen nul komma vijfentwintig en vier keer de schatting. Grotendeels ervaringsoordeel, geen harde meting.',
      en: 'At the initial idea it lands at zero point two five to four times the estimate. Largely expert judgement, not hard measurement.' },
    { nl: 'De kegel smalt alleen als je echt onzekerheid wegneemt, zoals met werkende stukken. Tijd alleen helpt niet.',
      en: 'The cone only narrows if you really remove uncertainty, say with working pieces. Time alone doesn\'t help.' },
  ],
  [ // s2 a probability; throughput; the range
    { nl: 'Een {t:Probabilistische voorspelling|probabilistische voorspelling} geeft geen datum maar een kans, zoals vijfentachtig procent kans dat het voor één maart af is.',
      en: 'A {t:Probabilistic forecast|probabilistic forecast} gives not a date but a probability, say an eighty-five percent chance it is done before the first of March.' },
    { nl: 'Dat is eerlijker, en de opdrachtgever kiest zelf hoeveel zekerheid hij wil.',
      en: 'That\'s more honest, and the sponsor chooses how much certainty he wants.' },
    { nl: 'De basis is historische data, vaak de throughput, de items die het team per week afmaakt.',
      en: 'The basis is historical data, often the throughput, the items the team finishes per week.' },
    { nl: 'Vier tot acht per week bij zestig open geeft zevenenhalf tot vijftien weken.',
      en: 'Four to eight a week with sixty open gives seven and a half to fifteen weeks.' },
  ],
  [ // s3 the Monte Carlo simulation
    { nl: 'Een {t:Monte Carlo-simulatie|Monte Carlo-simulatie} trekt duizenden keren willekeurig weken uit de echte historie, tot zestig items af zijn.',
      en: 'A {t:Monte Carlo simulation|Monte Carlo simulation} draws random weeks from the real history thousands of times, until sixty items are done.' },
    { nl: 'Zo ontstaan duizenden einddata. Je leest af wanneer vijftig procent van de runs klaar is, en wanneer vijfentachtig.',
      en: 'That gives thousands of end dates. You read off when fifty percent of runs are done, and when eighty-five.' },
    { nl: 'Daniel Vacanti en Troy Magennis maakten dit populair in agile teams. Het werkt alleen als de manier van werken ongeveer gelijk blijft.',
      en: 'Daniel Vacanti and Troy Magennis made this popular in agile teams. It only works if the way of working stays roughly the same.' },
  ],
  [ // s4 NoEstimates; Goodhart's law; for you; the questions
    { nl: '{t:NoEstimates|NoEstimates} kwam rond tweeduizend twaalf op gang. Stop met schatten per item, knip werk klein en voorspel met het aantal items.',
      en: '{t:NoEstimates|NoEstimates} took off around twenty twelve. Stop estimating each item, cut work small and forecast by counting items.' },
    { nl: 'Critici zeggen dat je voor investeringsbeslissingen wel een grootte moet weten.',
      en: 'Critics say you need a size for investment decisions.' },
    { nl: 'Een terugkerend probleem is de {t:Wet van Goodhart|wet van Goodhart}. Zodra een maat een doel wordt, is het geen goede maat meer.',
      en: 'A recurring problem is {t:Goodhart’s law|Goodhart\'s law}. When a measure becomes a target, it ceases to be a good measure.' },
    { nl: 'Maak je velocity of punten een doel, dan bedienen mensen de maat in plaats van het werk.',
      en: 'Make velocity or points a target, and people serve the measure instead of the work.' },
    { nl: 'Dit sluit aan op schatten met bandbreedten, maar dan uit eigen teamdata, niet op gevoel.',
      en: 'This ties in with estimating in ranges, now from the team\'s own data, not a feeling.' },
    { nl: 'Vraag in de stuurgroep op welke data de datum rust en hoe zeker hij is. En wat doet twintig procent meer backlog?',
      en: 'In the steering committee, ask what data the date rests on and how certain it is. And what does twenty percent more backlog do?' },
  ],
  [ // s5 the packaging-film maker's go-live date
    { nl: 'Een team bij een maker van verpakkingsfolie vervangt het labelsysteem. Nog achtenveertig kleine items staan open, en de stuurgroep wil een livegangdatum.',
      en: 'A team at a packaging-film maker replaces the labelling system. Forty-eight small items are open, and the steering committee wants a go-live date.' },
    { nl: 'In tien weken maakte het team vijftig items af, gemiddeld vijf per week.',
      en: 'In ten weeks the team finished fifty items, five a week on average.' },
    { nl: 'Tienduizend runs geven drie op de vier klaar binnen tien weken en achtennegentig procent binnen elf. Vrijwel alle binnen twaalf.',
      en: 'Ten thousand runs give three in four done within ten weeks and ninety-eight percent within eleven. Practically all within twelve.' },
    { nl: 'Welke datum adviseer je? Eerst een snelle som. Achtenveertig gedeeld door vijf is negen komma zes, rond tien weken, zoals de simulatie.',
      en: 'Which date do you advise? First a quick sum. Forty-eight divided by five is nine point six, about ten weeks, matching the simulation.' },
    { nl: 'De traagste week, drie items, geeft zestien weken, maar alle weken zo traag is onwaarschijnlijk.',
      en: 'The slowest week, three items, gives sixteen weeks, but every week that slow is unlikely.' },
    { nl: 'Binnen tien weken is maar zo\'n vijfenzeventig procent. Voor vijfentachtig procent zekerheid adviseer je elf weken als toezegging.',
      en: 'Within ten weeks is only about seventy-five percent. For eighty-five percent certainty, advise eleven weeks as the commitment.' },
    { nl: 'Zeg erbij dat tien weken historie weinig is, dus de spreiding is waarschijnlijk groter. Groeit de lijst, dan schuift de datum. Die werken we elke week bij.',
      en: 'Add that ten weeks is little history, so the spread is probably wider. If the list grows, the date moves. We update it weekly.' },
  ],
  [ // s6 the SLE; the percentile
    { nl: 'Een {t:Service level expectation|service level expectation} is volgens de Kanban Guide een verwachting voor hoe lang een item duurt, met een kans erbij, zoals vijfentachtig procent binnen acht dagen.',
      en: 'A {t:Service level expectation|service level expectation} is, by the Kanban Guide, an expected time for an item, with a probability, say eighty-five percent within eight days.' },
    { nl: 'Je haalt hem uit je eigen data met een {t:Percentiel|percentiel}. Het vijfentachtigste percentiel van de cycle times is de tijd waarbinnen vijfentachtig procent klaar was.',
      en: 'You take it from your own data with a {t:Percentile|percentile}. The eighty-fifth percentile of cycle times is the time within which eighty-five percent were done.' },
    { nl: 'Dat zegt een klant meer dan een gemiddelde.',
      en: 'That tells a customer more than an average.' },
  ],
  [ // s7 work item age; the cumulative flow diagram; conservation of flow
    { nl: 'Met de SLE stuur je dagelijks op work item age. Nadert een item de grens, zoals zeven van acht dagen, bespreek het dan nu.',
      en: 'With the SLE you steer daily on work item age. If an item nears the limit, say seven of eight days, discuss it now.' },
    { nl: 'Dat lijkt op een regelkaart, waarop je ingrijpt voordat het product buiten de specificatie valt.',
      en: 'Similar to a control chart, where you step in before the product falls outside specification.' },
    { nl: 'Een {t:Cumulatief stroomdiagram|cumulatief stroomdiagram} toont per dag de items per stap als gestapelde banden. Wordt een band dikker, dan zit daar je bottleneck.',
      en: 'A {t:Cumulative flow diagram|cumulative flow diagram} shows the items per step per day as stacked bands. A band getting thicker is your bottleneck.' },
    { nl: 'Lopen binnenkomst en klaar uit elkaar, dan groeit het onderhanden werk.',
      en: 'If arrivals and done drift apart, work in progress is growing.' },
    { nl: 'Dat raakt aan {t:Behoud van flow|behoud van flow}. Wat begint moet gemiddeld ook afkomen, een voorwaarde voor de wet van Little.',
      en: 'That touches on {t:Conservation of flow|conservation of flow}. What starts must on average also finish, a condition for Little\'s law.' },
  ],
  [ // s8 utilisation; Reinertsen; for you; the experts
    { nl: 'De {t:Bezettingsgraad|bezettingsgraad} is het deel van de tijd dat mensen of machines bezig zijn. In het eenvoudigste wachtrijmodel groeit de wachttijd met bezetting gedeeld door één min bezetting. Bij tachtig procent vier, bij negentig negen en bij vijfennegentig negentien.',
      en: '{t:Utilisation|Utilisation} is the share of time people or machines are busy. In the simplest queueing model, waiting time grows with utilisation divided by one minus utilisation. Four at eighty percent, nine at ninety and nineteen at ninety-five.' },
    { nl: 'Die getallen gelden alleen voor dat model, maar Donald Reinertsen liet zien dat productontwikkeling bij hoge bezetting vastloopt in wachtrijen.',
      en: 'Those numbers hold only for that model, but Donald Reinertsen showed product development at high utilisation gets stuck in queues.' },
    { nl: 'Een team op honderd procent heeft geen ruimte voor het onverwachte.',
      en: 'A team at a hundred percent has no room for the unexpected.' },
    { nl: 'Als Lean-consultant ken je dit als de reden voor buffers en heijunka, al varieert kenniswerk veel meer dan op een lijn.',
      en: 'As a Lean consultant you know this as the reason for buffers and heijunka, though knowledge work varies far more than on a line.' },
    { nl: 'Experts twisten of je ver onder honderd procent plant, of variatie verkleint met kleiner werk.',
      en: 'Experts argue whether to plan well below a hundred percent, or reduce variation with smaller work.' },
  ],
  [ // s9 the sorting machine maker's cycle times
    { nl: 'Een team voor machinesoftware bij een maker van sorteermachines rondde twintig items af, gemiddeld in acht werkdagen. Maar waar kan de klant op rekenen?',
      en: 'A machine-software team at a sorting-machine maker finished twenty items, on average in eight working days. But what can the customer count on?' },
    { nl: 'Vijfentachtig procent van twintig is zeventien. Het zeventiende item in de gesorteerde rij duurde elf dagen, dus de SLE wordt vijfentachtig procent binnen elf werkdagen.',
      en: 'Eighty-five percent of twenty is seventeen. The seventeenth sorted item took eleven days, so the SLE becomes eighty-five percent within eleven working days.' },
    { nl: 'Één item staat al negen dagen in testen op de machine en nadert die grens. Bespreek het vandaag. Wat houdt het op, kan iemand helpen?',
      en: 'One item has been nine days in testing on the machine, near that limit. Discuss it today. What holds it up, can someone help?' },
    { nl: 'Kijk ook naar de staart. Wat hadden die gemeen? Daar zit vaak de echte verbetering.',
      en: 'Look at the tail too. What did those share? That is often the real improvement.' },
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
  nl: /\b(onzekerheidskegel|Boehm|Steve|McConnell|Troy|Magennis|NoEstimates|backlog|verpakkingsfolie|labelsysteem|service level expectation|cycle times|wachtrijmodel|Donald|Reinertsen|productontwikkeling|wachtrijen|machinesoftware|item|Eén|flow)\b/,
  en: /\b(Boehm|Vacanti|Magennis|Reinertsen|heijunka)\b/,
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="team"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-blk{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-barhot{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1.2}
.pm-over{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:4 3}
.pm-band{fill:color-mix(in srgb,var(--fp-accent) 18%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1.2;stroke-linejoin:round}
.pm-band2{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;stroke-linejoin:round}
.pm-band3{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1;stroke-linejoin:round}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pm-curve{fill:none;stroke:var(--fp-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.pm-mark{fill:none;stroke:var(--fp-accent);stroke-width:3;stroke-linecap:round}
.pm-dot{fill:var(--fp-accent);stroke:var(--anatomy-face);stroke-width:1.2}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.5}
.pm-old{fill:var(--anatomy-strong);stroke:var(--anatomy-strong);stroke-width:.5}
.pm-hotnote{fill:var(--fp-accent);stroke:var(--fp-accent);stroke-width:.5}
.pm-wk{fill:color-mix(in srgb,var(--fp-accent) 40%,transparent);stroke:var(--fp-accent);stroke-width:.4}
.pm-wkhot{fill:var(--fp-accent);stroke:var(--fp-accent);stroke-width:.4}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-blk,[data-cue][data-on] .pm-bar{fill:var(--anatomy-face);stroke:var(--fp-focus);stroke-width:2}
[data-cue][data-on] .pm-barhot,[data-cue][data-on] .pm-over,[data-cue][data-on] .pm-band,[data-cue][data-on] .pm-band2,[data-cue][data-on] .pm-band3{stroke:var(--fp-focus);stroke-width:2.2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-curve,[data-cue][data-on] .pm-mark{stroke:var(--fp-focus)}
[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-hotnote,[data-cue][data-on] .pm-old{stroke:var(--fp-focus-text);stroke-width:.8}
[data-cue][data-on] .pm-on{fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een teamruimte. Aan de achterwand een kanbanbord met vier kolommen vol kaartjes: de open items, het werk onderweg en één item dat in test blijft hangen; ernaast een klok. Op de zijwand een strook van twaalf weken. Op tafel een laptop voor de simulatie. Jij, de adviseur in petrol, staat bij het bord; twee teamleden, en de sponsor aan het eind van de tafel. Rechts een paneel met per scène een kaart, gemarkeerd als schema of voorbeeld. Onderaan per scène een grafiek: de onzekerheidskegel, de bandbreedte in weken, het histogram van de runs, de throughput per week, de cycle times van kort naar lang, de leeftijd van items, het cumulatief stroomdiagram en de wachttijd tegen de bezettingsgraad.',
  en: 'A team room. On the back wall a kanban board with four columns of notes: the open items, the work under way and one item that stays stuck in test; beside it a clock. On the side wall a strip of twelve weeks. On the table a laptop for the simulation. You, the consultant in petrol, stand at the board; two team members, and the sponsor at the end of the table. At the right a panel with one card per scene, marked as diagram or example. Along the bottom a chart per scene: the cone of uncertainty, the range in weeks, the histogram of runs, the throughput per week, the cycle times from short to long, the age of items, the cumulative flow diagram and waiting time against utilisation.',
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

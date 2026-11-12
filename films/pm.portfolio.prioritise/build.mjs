// Dev tool, not shipped. Builds the explainer film "Wat past onder de streep? /
// What fits under the line?" for Projecten: pm.portfolio.programme (level 1 of
// the topic Programma's, "Programma of project"), pm.portfolio.prioritise
// (level 1 of Prioriteren en capaciteit, "Het portfolio prioriteren") and
// pm.portfolio.capacity (level 2, "Overal dezelfde experts").
//
//   node films/pm.portfolio.prioritise/build.mjs            build the page
//   node films/pm.portfolio.prioritise/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.portfolio.prioritise.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.portfolio.prioritise, P2: projects sorted by value per scarce day and cut
// at the capacity line; Fatima's week; about 100 s, three scenes). Storyboard
// drift: nine scenes and about five minutes, because a lesson with a film no
// longer shows its worked example, so the film carries all fifteen teach
// blocks and the three worked examples: programme and portfolio (s1, programme
// teach 1 and its example's outcome), dependencies (s2, teach 2 and the
// example's page of dependencies), the programme board, watermelon reporting
// and the programme lead (s3, teach 3 to 5 and the example's board), scoring
// and the bottleneck (s4, prioritise teach 1 and 2), the capacity line with the
// food producer's five projects (s5, teach 3 and the example), work in progress
// and saying no (s6, teach 4 and 5), the capacity matrix and real availability
// (s7, capacity teach 1 and 2), switching, options and the people side (s8,
// teach 3 to 5) and Fatima's month (s9, the capacity example). The month on
// the side wall stands in for the outline's "Fatima's week": the lesson counts
// her days per month.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard that repeats the panel's card in miniature,
// a wall clock and, on the side wall, a month of four weeks for Fatima's days;
// a table with one A4 of dependencies, a laptop and two cups; and the cast:
// "jij" the consultant in petrol at the board, the sponsor (the regional
// director, the MT, the owner of all four projects), the team lead (a project
// owner) and Fatima, the senior planner, a figure of this film's own (cue key
// "fatima": a mustard cardigan over a white top, dark hair in a bun and a
// folder, so she is not taken for the planner of the other pm films with his
// light jumper and tablet). A panel at the right, in stage space, carries one
// card per scene, labelled "schema" (a general picture) or "voorbeeld" (the
// worked examples; a scene that moves from rule to example switches its label
// at that beat). Each block of a card is its own cue group, so every sentence
// lights what it explains (strictFocus).
//
// Checklist (lesson point: scene and beat; "card" = on the card or in the
// caption, not spoken, each on screen for at least 4 s):
//   programme teach 1: a project delivers an output, a readiness check, a
//     rebuilt line, a new planning tool (s1 b1); a programme, projects steered
//     together for one outcome none reaches alone; cancelled grid jobs 14 to
//     8% (s1 b2), with a readiness check, a new materials process and a
//     planning-tool change (s1 b2-b3, card); the test: drop one project and
//     the goal still holds, then it belongs in the portfolio, the whole list
//     of projects competing for the same money and people (s1 b3)
//   programme teach 2: a dependency, what one project needs from another by a
//     date (s2 b1, caption); B needs A's data definition in week 10, C needs
//     B's two planners in Q2 (s2 b1); one list: owner, date, what happens if it
//     slips (s2 b2); four independent projects at 90% make 66% together (s2
//     b3), 0.9 x 0.9 x 0.9 x 0.9 and "shared people make it worse" (s2 b3,
//     card)
//   programme teach 3: the programme board, the sponsor, the project owners,
//     the line manager who owns the outcome, finance if money moves (s3 b1;
//     "if money moves" not said); monthly, decides on the seams: sequencing,
//     shared people, scope moving between projects; project decisions stay in
//     the project steering groups (s3 b2); an hour on one project's test plan:
//     a steering group with too many people (s3 b2, card, about 5 s)
//   programme teach 4: watermelon reporting, green outside, red inside (s3
//     b3); each green on its own plan, the shared goal not moving (s3 b3);
//     nobody reports on the seams (s3 b2-b3, card: the seams lit); report the
//     outcome number monthly next to the statuses (s3 b4); experts disagree
//     on the lead's power, budget control or a clear outcome and a strong
//     board (s3 b4, caption and card)
//   programme teach 5: the lead owns the outcome story, the dependency list
//     and the rhythm, does not run the projects (s3 b5); the two-minute test
//     with numbers, or the board steers each project apart (s3 b5, card); the
//     sharp question, which number moves, how much, which project moves which
//     part (s3 b5)
//   programme example: a regional director at a grid operator, three projects
//     started apart, a readiness check (team A), a materials-kit process (team
//     B), a planning-tool upgrade (IT) (s1 b2, s3 b1-b2: the three on the
//     cards); all green, still 14%, target 8% (s1 b2, s3 b3); the check reads
//     the material data team B redesigns (s2 b4), the Q3 IT release changes
//     the field the check uses (s2 b4, card); one number, 14 to 8% (s1 b2);
//     the dependencies on one A4, the planners all three teams need (card);
//     team B owns the definition and freezes it in week 6, IT tests the
//     release before go-live (s2 b4); a monthly board looking at the outcome
//     number with each project's share (s3 b4; who sits on it: the board card
//     of s3 b1, not the example's own list)
//   prioritise teach 1: score on value (euros or a KPI moved per year),
//     effort (days of the scarce people), risk (the chance it doesn't
//     deliver), fit with strategy; rough, 1 to 5 (s4 b1; the definitions and
//     the KPI on the card); not precision but "this before that" (s4 b1,
//     card); experts argue about weighted scoring: who sets the weights sets
//     the outcome (s4 b1)
//   prioritise teach 2: the bottleneck limits how much gets done, usually a
//     few scarce experts, not money (s4 b2); value per scarce day; A 300k a
//     year for 120 days of the two process engineers, 2.5k a day; B 150k for
//     30 days, 5k a day (s4 b3; the sums in the caption and on the card); B
//     first, although A looks bigger (s4 b3); risk-adjusted value, 300k at 50%
//     counts as 150k (s4 b4)
//   prioritise teach 3: capacity is the hard line (s5 b1, card title); count
//     the scarce people, not the headcount (s5 b1, caption); two process
//     engineers of 120 days give 240 (s5 b1); rank, draw the capacity line
//     where the running total reaches 240; everything below waits (s5 b3);
//     drawn in January, ignored by March (s5 b5), every request "only a few
//     days" (s5 b5, card)
//   prioritise teach 4: work in progress, started and not yet finished (s6
//     b1); Little's law (1961), lead time = work in progress / throughput (s6
//     b2), from queueing theory (card); three finished a quarter: twelve open
//     take about four quarters, six about two (s6 b2); switching and waiting
//     cut throughput too: twelve at half speed deliver less than six at full
//     speed (s6 b3)
//   prioritise teach 5: never a bare no, "not now, and this is what it would
//     push out" (s6 b4, card); "we can start this; B stops or slips three
//     months; which do you prefer?" (s6 b4); the choice to whoever owns both;
//     a visible waiting list (s6 b5), so not now isn't never (card); the sharp
//     question, what do we stop to make room (s6 b5)
//   prioritise example: an MT of a food producer (s5 b2), two process
//     engineers with 240 project days (s5 b1); A energy saving 200k / 80 days,
//     B changeover 180k / 40, C a new MES, software for the production orders
//     on the floor, 400k at 50% / 200, D packaging waste 90k / 30, E the plant
//     director's dashboard, no value, 40 (s5 b2; the rows on the card, the MES
//     gloss shortened in the voice); everyone wants all five (s5 b2); per
//     engineer day B 4.5k, D 3k, A 2.5k, C 1k after the 50% correction, E
//     unknown (s5 b2); B, D and A are 150 days, start those; C doesn't fit and
//     is the most uncertain (card): a 60-day first phase that tests the big
//     assumption before committing 200; 210 days, 30 as a buffer (s5 b4); E:
//     ask the plant director for a number, above 2.5k a day it goes ahead of
//     A; then the MT chooses, not you (s5 b5)
//   capacity teach 1: not total hours but the same five people (s7 b1), the
//     senior process engineer, the planner who knows the system, the one data
//     analyst (s7 b1, card); a capacity matrix: names down, projects across,
//     days per month per cell, real available days (s7 b1; drawn as a column
//     "echt", see open points); overbooked rows are capacity conflicts, more
//     days promised than the person has; two or three red rows explain most
//     of the delay (s7 b2)
//   capacity teach 2: real availability is lower than people think; of about
//     260 working days roughly 50 go to holidays, public holidays, sickness
//     and training, about 20 to general meetings and admin: about 190 left (s7
//     b3; "vrij" for holidays and public holidays, admin on the card); the day
//     job at 70%: 57 project days a year, about five a month (s7 b4); "two days
//     a week" is planning fiction (s7 b4, caption and card)
//   capacity teach 3: a context switch loses time (s8 b1), picking up the
//     thread (definition, not said); Gerald Weinberg (1992): two projects
//     about 20% lost, three about 40%, five about 75%; an estimate, not a
//     measurement, but recognised (s8 b1); each project waits for that person,
//     so the lead time grows (s8 b1-b2, card)
//   capacity teach 4: fewer projects at once, each with a real block of time,
//     Tuesdays and Thursdays for A (s8 b2); the owner decides between two
//     options: Jan on A and B, C starts in May; or a contractor does C, 40
//     days at 1,000 euro, 40k (s8 b3; the day rate on the card and in the
//     caption). Not said: the pointer to pm.plan for planning one project's
//     people (navigation, not content).
//   capacity teach 5: don't solve it quietly with evenings: it hides the real
//     cost (s8 b4) and burns out your best people (card); the signals,
//     "basically committed", "she'll manage" (s8 b4, caption), "just borrow
//     him for a few days" (card); experts differ: book scarce people to 80%
//     and keep 20%, or plan only a quarter ahead (s8 b5); the sharp question,
//     whose days, has she seen the plan (s8 b5)
//   capacity example: a grid operator, senior planner Fatima on four projects
//     including yours; each lead assumed a day a week; four days a week is
//     about 16 to 17 a month; next to her planning work she has 4 (s9 b1; her
//     manager's estimate not named); your pilot needs 8 days in March, two
//     other leads count on March too (s9 b2); the matrix, ask Fatima first,
//     take it to the person who owns all four projects, not to Fatima (s9
//     b3); options: March to the pilot and the others to April and May; the
//     regional office lends a second planner for 10 days; or the pilot moves a
//     month (s9 b4); everyone plans on the decision, not on hope (s9 b4)
//
// Facts checked (2026-11-12): Little's law, L = λW, so W = L / λ (lead time =
// work in progress / throughput); John D. C. Little, "A proof for the queuing
// formula: L = λW", Operations Research 9 (3), 1961. Gerald M. Weinberg,
// Quality Software Management, Volume 1: Systems Thinking, Dorset House 1992:
// his table of time per project gives 20% lost to switching with two
// projects, 40% with three, 60% with four and 75% with five (the film says
// two, three and five, as the lesson). No scoring model is named: no WSJF, no
// Reinertsen, no SAFe (the lesson names none; cost of delay is a later lesson
// of this topic). The sums are asserted below: 0.9^4 = 0.656; 300/120 = 2.5,
// 150/30 = 5, 300 x 50% = 150; B 180/40 = 4.5, D 90/30 = 3, A 200/80 = 2.5,
// C 400 x 50% / 200 = 1; 40 + 30 + 80 = 150, + 60 = 210, 240 - 210 = 30;
// 12/3 = 4 and 6/3 = 2 quarters; 260 - 50 - 20 = 190, 30% of 190 = 57, 57/12
// = 4.75, about five; 40 x 1,000 = 40,000; four days a week x 4 to 4.33
// weeks = 16 to 17 days a month.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const PG = 'pm.portfolio.programme';
const PR = 'pm.portfolio.prioritise';
const CA = 'pm.portfolio.capacity';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(PG, ['Een project levert een output: een gereedheidscheck, een omgebouwde lijn, een nieuwe planningstool', 'één uitkomst leveren die geen van hen alleen haalt', 'afgezegde netklussen van 14% naar 8%', 'een gereedheidscheck, een nieuw materiaalproces én een aanpassing in de planningstool',
  'kun je één project schrappen en blijft het doel overeind, dan hoort het in het portfolio', 'de hele lijst projecten die om hetzelfde geld en dezelfde mensen strijden',
  'iets wat het ene project op een datum van het andere nodig heeft', 'B heeft in week 10 de datadefinitie van A nodig', 'C heeft in Q2 dezelfde twee planners nodig als B', 'eigenaar, datum en wat er gebeurt als het uitloopt',
  'vier onafhankelijke projecten die elk 90% kans hebben', 'maar in 66% van de gevallen (0,9 × 0,9 × 0,9 × 0,9 = 0,66)', 'Gedeelde mensen maken het erger',
  'de sponsor, de projecteigenaren, de lijnmanager die eigenaar is van de uitkomst, en finance als er geld tussen projecten schuift', 'maandelijks', 'beslist over de naden: volgorde, gedeelde mensen, scope', 'Projectbesluiten blijven in de stuurgroepen', 'het testplan van één project, dan is het een stuurgroep met te veel mensen',
  'watermeloeneffect', 'groen aan de buitenkant, rood vanbinnen', 'omdat niemand over de naden rapporteert', 'rapporteer elke maand het uitkomstgetal zelf, naast de projectstatussen', 'zeggenschap over de projectbudgetten', 'een helder doel en een sterke raad genoeg',
  'eigenaar van het verhaal van de uitkomst, de lijst met afhankelijkheden en het ritme. Je draait de projecten niet zelf', 'in twee minuten, met getallen', 'elk project apart sturen', 'welk getal beweegt, hoeveel, en welk project beweegt welk deel?',
  'regiodirecteur bij een netbeheerder', 'een gereedheidscheck voor geplande klussen (team A)', 'een nieuw proces voor materiaalpakketten (team B)', 'een upgrade van de planningstool (IT)', 'Alle drie staan op groen', 'nog steeds op 14%; haar doel is 8%',
  'leest materiaaldata die team B aan het herontwerpen is', 'de IT-release in Q3 verandert het veld dat de check gebruikt', 'de definitie van de materiaaldata, de wijziging in het toolveld, en de planners die alle drie de teams nodig hebben',
  'bevriest die in week 6', 'IT test de Q3-release tegen de gereedheidscheck vóór de livegang', 'met haar, de drie projecteigenaren en de planningsmanager', 'met een schatting van wat elk project bijdraagt']);
says(PR, ['waarde (euro’s, of een KPI, een kernprestatie-indicator, die per jaar beweegt), inspanning (dagen van de schaarse mensen), risico (de kans dat het niet levert) en fit met de strategie', 'een schaal van 1 tot 5 is prima',
  'van “alles is belangrijk” naar “dit vóór dat”', 'wie de gewichten kiest, kiest de uitkomst',
  'De bottleneck is wat bepaalt hoeveel er af komt: meestal een paar schaarse experts, niet geld', 'Project A: € 300k per jaar voor 120 dagen van de twee procesengineers, dus € 2,5k per dag', 'Project B: € 150k voor 30 dagen, dus € 5k per dag', 'B gaat eerst, al lijkt A groter', '€ 300k bij 50% vertrouwen telt als € 150k',
  'Capaciteit is de harde grens', 'Tel de schaarse mensen, niet de headcount', 'Twee procesengineers met elk 120 projectdagen geven 240 dagen', 'waar het lopende totaal 240 bereikt', 'Alles onder de streep wacht', 'in januari getrokken en in maart stilletjes genegeerd', '“maar een paar dagen”',
  'alles wat gestart en nog niet af is', 'De wet van Little (1961), uit de wachtrijtheorie', 'gemiddelde doorlooptijd (lead time: van start tot klaar) = onderhanden werk ÷ doorzet', 'drie projecten per kwartaal af, dan duren twaalf open projecten elk zo’n vier kwartalen; zes open projecten zo’n twee',
  'schakelen en wachten verlagen ook de doorzet', 'Twaalf projecten op halve snelheid leveren dus minder op dan zes op volle snelheid',
  'nooit een kaal nee', '“niet nu, en dit is wat het zou verdringen.”', 'project B stopt of drie maanden opschuift. Wat heeft je voorkeur?', 'De keuze ligt bij degene die over allebei gaat', 'een zichtbare wachtlijst', 'wat stoppen we om hier ruimte voor te maken?',
  'van een levensmiddelenproducent', 'samen 240 projectdagen', 'A, energiebesparing, € 200k per jaar, 80 dagen', 'B, kortere omsteltijden, € 180k, 40 dagen', 'C, een nieuw MES', '€ 400k, maar slechts 50% vertrouwen, 200 dagen', 'D, verpakkingsafval, € 90k, 30 dagen', 'E, het dashboard van de plantdirecteur, waarde niet genoemd, 40 dagen', 'Iedereen wil ze alle vijf',
  'B € 4,5k, D € 3k, A € 2,5k, en C € 1k na de correctie voor 50% risico; E is onbekend', 'B, D en A kosten samen 150 dagen: daarmee starten', 'C past niet en is het onzekerst', 'een eerste fase van 60 dagen voor die de grote aanname test voordat je 200 dagen vastlegt', 'op 210 dagen, met 30 als buffer',
  '“Komt het boven € 2,5k per dag, dan gaat het vóór A.”', 'Dan kiest het MT, niet jij']);
says(CA, ['dezelfde vijf mensen: de senior procesengineer, de planner die het systeem kent, die ene data-analist', 'namen verticaal, projecten horizontaal, dagen per maand in elk vakje, en onderaan hun echte beschikbare dagen',
  'Overboekte rijen zijn je capaciteitsconflicten', 'twee of drie rode rijen, en die verklaren het grootste deel van de vertraging',
  'Echte beschikbaarheid is lager dan mensen denken', 'zo’n 260 werkdagen', 'grofweg 50 af aan vakantie, feestdagen, ziekte en opleiding', 'algemeen overleg en administratie kosten er nog zo’n 20', 'zo’n 190 echte dagen', 'Kost het eigen werk 70%, dan zijn er 57 projectdagen per jaar: ongeveer vijf per maand', '“twee dagen per week”', 'planningsfictie',
  'moet de draad weer oppakken', 'Gerald Weinberg (1992)', 'met twee projecten verlies je zo’n 20% van je tijd aan schakelen, met drie zo’n 40%, met vijf zo’n 75%', 'Het is een schatting, geen meting, maar mensen herkennen het', 'elk project wacht op die persoon', 'de kalendertijd van start tot klaar',
  'minder projecten tegelijk, elk met een echt blok tijd, zoals dinsdag en donderdag voor project A', 'laat de eigenaar beslissen', 'Optie 1: Jan werkt aan A en B, C start in mei', 'Optie 2: een externe doet C, 40 dagen à € 1.000, dus € 40k',
  'niet stilletjes op door mensen ’s avonds te laten doorwerken', 'verstopt de echte kosten en je beste mensen branden op', '“ligt eigenlijk wel vast”, “ze redt het wel”, “leen hem gewoon een paar dagen”', 'boeken schaarse mensen tot 80% en houden 20% achter de hand', 'plannen maar één kwartaal vooruit', '“Op wiens dagen rekenen we, en heeft zij dit plan gezien?”',
  'senior planner Fatima op vier projecten, waaronder het jouwe', 'ging uit van één dag per week van haar', 'zo’n vier projectdagen per maand', 'in maart 8 dagen nodig', 'twee andere projectleiders rekenen in maart ook op haar',
  'zo’n 16 à 17 dagen per maand; ze heeft er 4', 'de twee of drie andere schaarse mensen', 'vraagt Fatima eerst wat zij realistisch vindt', 'naar degene die over alle vier de projecten gaat, niet naar Fatima',
  'Maart gaat naar de pilot en de anderen schuiven haar werk naar april en mei', 'het regiokantoor leent 10 dagen een tweede planner uit', 'de pilot schuift een maand op', 'plant iedereen op het besluit, niet op hoop']);
says(PG, ['0.9 × 0.9 × 0.9 × 0.9 = 0.66', 'freezes it by week 6', 'watermelon reporting'], 'en');
says(PR, ['€2.5k per day', '€300k at 50% confidence counts as €150k', 'B €4.5k, D €3k, A €2.5k, and C €1k', 'That makes 210 days and leaves 30 as a buffer', 'Little’s law (1961)'], 'en');
says(CA, ['Gerald Weinberg’s rule of thumb (1992)', '57 project days a year', '40 days at €1,000, so €40k', 'about 16 to 17 days a month; she has 4'], 'en');
// the programme's odds: four projects at 90 % each
const ODDS = 0.9 ** 4;
assert(Math.round(ODDS * 100) === 66, 'four projects at 90%: 66% together');
// prioritise teach 2: value per scarce day, and the risk correction
assert(300 / 120 === 2.5 && 150 / 30 === 5 && 300 * 0.5 === 150, 'A 2.5k a day, B 5k a day, 300k at 50% is 150k');
// the food producer's five projects (k euro a year, engineer days, confidence)
const CAP = 2 * 120;
const PROJ = [
  { id: 'A', v: 200, d: 80, c: 1 },
  { id: 'B', v: 180, d: 40, c: 1 },
  { id: 'C', v: 400, d: 200, c: 0.5, phase: 60 },
  { id: 'D', v: 90, d: 30, c: 1 },
  { id: 'E', v: null, d: 40, c: 1 },
];
PROJ.forEach((p) => { p.perDay = p.v === null ? null : (p.v * p.c) / p.d; });
const RANK = PROJ.filter((p) => p.perDay !== null).sort((a, b) => b.perDay - a.perDay).map((p) => p.id);
assert(CAP === 240 && RANK.join('') === 'BDAC', 'ranked by value per engineer day: B, D, A, C');
assert(PROJ.map((p) => p.perDay).join() === '2.5,4.5,1,3,', 'per day: A 2.5k, B 4.5k, C 1k, D 3k, E unknown');
const START = PROJ.filter((p) => 'BDA'.includes(p.id)).reduce((a, p) => a + p.d, 0);
assert(START === 150 && START + 60 === 210 && CAP - 210 === 30 && START + 200 > CAP, 'B, D, A: 150 days; C\'s phase of 60 makes 210; 30 buffer; C in full does not fit');
// Little's law: three finished a quarter
assert(12 / 3 === 4 && 6 / 3 === 2, 'twelve open: four quarters; six open: two');
// real availability
const AV = 260 - 50 - 20;
assert(AV === 190 && Math.round(AV * 0.3) === 57 && Math.round(57 / 12) === 5, '190 real days, 57 project days, about five a month');
assert(40 * 1000 === 40000, 'a contractor: 40 days at 1,000 euro');
// Fatima: four projects of one day a week, about 4 to 4.33 weeks a month, 4 days available
assert(Math.floor(4 * 4) === 16 && Math.floor(4 * 52 / 12) === 17, 'four days a week: 16 to 17 days a month');
// the capacity matrix of s7 (drawn, not given by the lesson): three scarce people over four projects
const MATRIX = [
  { nl: 'senior engineer', en: 'senior engineer', cells: [4, 3, 2, 2], has: 6 },
  { nl: 'planner', en: 'planner', cells: [2, 2, 2, 1], has: 4 },
  { nl: 'data-analist', en: 'data analyst', cells: [1, 0, 2, 1], has: 5 },
];
MATRIX.forEach((r) => { r.sum = r.cells.reduce((a, b) => a + b, 0); });
assert(MATRIX.filter((r) => r.sum > r.has).length === 2, 'two red rows of three');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 228, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const WEEKS = 4;
const CAL = w.calendar({ y0: 64, z0: 116, weeks: WEEKS, cw: 26, ch: 30 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 148, y: 150, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([158, 165, TZ]).map((v) => Math.round(v * 10) / 10);
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pp-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;
// the month's week cells (local u, v of the side wall), for Fatima's days (s7, s9)
const CELLS = Array.from({ length: WEEKS }, (_, i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;

// Fatima, the senior planner: a figure of this film's own (not the world's
// planner, a man in a light jumper with a tablet in the other pm films): a
// mustard cardigan over a white top, dark hair in a bun, and a blue folder at
// the chest. Built from the world's parts with the person's proportions
// (world.mjs person()).
function fatimaFigure({ x, y }) {
  const S = (paths, style) => k.solidSvg(paths, style);
  const skin = { tone: 'hi', crease: 'none', className: 'pp-skin' };
  const cardigan = { tone: 'mid', className: 'pp-card' };
  const out = [w.halo({ x: x - 16, y: y - 12, w: 32, d: 24, r: 10 })];
  for (const s of [-7, 7]) {
    out.push(w.box({ x: x + s - 5, y: y - 5, w: 10, d: 14, r: 2.4 }, 0, 4.5, { tone: 'lo' }, { steps: 2 }));
    out.push(w.post(x + s, y, 6, 4, 84, { tone: 'lo' }, 14));
  }
  const torso = { x: x - 15, y: y - 10, w: 30, d: 20, r: 6 };
  const arm = (s) => w.box({ x: x + s - 4, y: y - 4, w: 8, d: 8, r: 3 }, 90, 140, cardigan, { steps: 2 });
  out.push(arm(-19.5));
  out.push(w.box(torso, 82, 142, cardigan, { steps: 4, bevel: 0.6, inner: k.lineSvg(k.sideSeam(torso, 134, P, 4), { tone: 'lo' }) }));
  // the white top in the cardigan's opening
  out.push(w.box({ x: x - 4.5, y: y + 10, w: 9, d: 0.8, r: 0.4 }, 104, 141, { tone: 'hi', className: 'pp-top' }, { steps: 1 }));
  out.push(arm(19.5));
  // a blue folder held at the chest
  out.push(w.box({ x: x - 10, y: y + 11, w: 20, d: 3.6, r: 0.8 }, 98, 124, { tone: 'lo', className: 'pp-folder' }, { steps: 2 }));
  out.push(w.post(x, y, 4.2, 142, 148, skin, 12));
  // dark hair, a bun at the back of the head, the face
  out.push(S(G.sphereOf([x - 1.6, y - 1.6, 161], 12, P, { steps: 28 }), { tone: 'lo', crease: 'none', className: 'pp-hair' }));
  out.push(S(G.sphereOf([x - 9, y - 9, 168], 6, P, { steps: 20 }), { tone: 'lo', crease: 'none', className: 'pp-hair' }));
  out.push(S(G.sphereOf([x + 0.6, y + 0.6, 158.5], 11.2, P, { steps: 28 }), skin));
  return `<g data-cue="fatima">${out.join('')}</g>`;
}
const fatima = fatimaFigure({ x: 232, y: 208 });
assert(fatima.includes('data-cue="fatima"') && !fatima.includes('data-cue="planner"'), 'Fatima is a cue group of her own');

const world = [
  w.room(ROOM),
  w.clock(262, 214, 10),
  cueG('board', BOARD.svg + boardMini),
  cueG('month', CAL.svg + calMarks),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  w.stack({ x: 104, y: 126, z: TZ, n: 3 }),
  cueG('sheet', SHEET.svg + sheetLines),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 262, y: 152, role: 'sponsor', along: 'y' }),
  fatima,
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); stage.js fills them per scene: o[key] goes into data-k "p_<key>".
const PX = 322;
const PW = 308;
const SLOTS = ['outputs', 'prog', 'test', 'pf', 'dep', 'list', 'odds', 'a4', 'raad', 'seams', 'steer', 'melon', 'report', 'power', 'lead',
  'score', 'weights', 'bneck', 'vpd', 'risk', 'cap', 'rows', 'line', 'run', 'ebox', 'trap', 'wip', 'little', 'speed', 'no', 'wait', 'ask',
  'five', 'matrix', 'red', 'avail', 'switch', 'block', 'opts', 'evening', 'signals', 'full', 'ask8', 'fm', 'claims', 'march', 'route', 'opts9'];
const hud = g('panel', `<rect class="pp-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + SLOTS.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.plan.schedule): the same points, fewer bytes; each rewrite is read back.
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
const BOARD_AT = w.at([145, 0, 150]).map((v) => Math.round(v * 10) / 10);
const FAT_AT = w.at([232, 208, 150]).map((v) => Math.round(v * 10) / 10);
const CAL_AT = w.at([0, 116, 140]).map((v) => Math.round(v * 10) / 10);
const SPON_AT = w.at([262, 152, 150]).map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [150, 210, 1], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.08] },
  { from: [150, 200, 1.02], to: [SHEET_AT[0], SHEET_AT[1], 1.12] },
  { from: [SPON_AT[0], SPON_AT[1] + 40, 1.06], to: [150, 200, 1.02] },
  { from: [150, 210, 1], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1], to: [SPON_AT[0], SPON_AT[1] + 40, 1.08] },
  { from: [150, 200, 1.04], to: [150, 210, 1] },
  { from: [150, 210, 1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: [150, 200, 1.02], to: [FAT_AT[0], FAT_AT[1] + 40, 1.1] },
  { from: [FAT_AT[0], FAT_AT[1] + 40, 1.1], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const C = { SLOTS, CELLS, PROJ, RANK, CAP, MATRIX };
const sc = (id, lesson, title, beats) => ({ id, lesson, level: lesson === CA ? 2 : 1, still: 0.9, title, beats });
const spec = {
  id: PR,
  title: { nl: 'Wat past onder de streep?', en: 'What fits under the line?' },
  lessons: [PG, PR, CA],
  strictFocus: true,
  scenes: [
    sc('s1', PG, { nl: 'Programma of project', en: 'Programme or project' }, [
      { nl: 'Een project levert een output: een gereedheidscheck, een omgebouwde lijn, een planningstool.', en: 'A project delivers an output: a readiness check, a rebuilt line, a planning tool.', focus: 'outputs' },
      { nl: 'Een {t:Programma|programma}: projecten samen gestuurd voor één uitkomst, afzeggingen van {n:14} naar {n:8}%.', en: 'A {t:Programme|programme}: projects run together for one outcome, cancellations from {n:14} to {n:8}%.', cue: { Programma: 'prog' }, focus: ['prog', 'outputs'] },
      { nl: 'Schrap er één en blijft het doel staan? Dan hoort het in het {t:Portfolio|portfolio}.', en: 'Drop one and the goal still holds? Then it belongs in the {t:Portfolio|portfolio}.', cue: { Portfolio: 'pf' }, focus: ['test', 'pf'] },
    ]),
    sc('s2', PG, { nl: 'Afhankelijkheden', en: 'Dependencies' }, [
      { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: wat het ene project op een datum van het andere nodig heeft.', en: 'A {t:Dependency|dependency}: what one project needs from another by a date.', cue: { Afhankelijkheid: 'dep' }, focus: 'dep' },
      { nl: 'Eén lijst: eigenaar, datum, en wat er gebeurt als het uitloopt.', en: 'One list: owner, date, and what happens if it slips.', focus: 'list' },
      { nl: 'Vier projecten van elk {n:90}% op tijd: samen maar {n:66}%.', en: 'Four projects, each {n:90}% on time: together only {n:66}%.', focus: 'odds' },
      { nl: 'De check leest data van team B. Op één A4: B bevriest in week {n:6}, IT test vóór de livegang.', en: 'The check reads team B’s data. On one page: B freezes by week {n:6}, IT tests before go-live.', focus: ['a4', 'sheet'] },
    ]),
    sc('s3', PG, { nl: 'De raad en de naden', en: 'The board and the seams' }, [
      { nl: 'De {t:Programmaraad|programmaraad}: sponsor, projecteigenaren, eigenaar van de uitkomst, finance.', en: 'The {t:Programme board|programme board}: sponsor, project owners, outcome owner, finance.', cue: { Programmaraad: 'raad' }, focus: ['raad', 'sponsor'] },
      { nl: 'Maandelijks over de naden. Projectbesluiten blijven in de stuurgroep.', en: 'Monthly, on the seams. Project decisions stay in the steering group.', focus: ['seams', 'steer'] },
      { nl: 'Het {t:Watermeloeneffect|watermeloeneffect}: groen buiten, rood vanbinnen. Drie keer groen, nog {n:14}%.', en: '{t:Watermelon reporting|Watermelon reporting}: green outside, red inside. Three times green, still {n:14}%.', cue: { Watermeloeneffect: 'melon' }, focus: 'melon' },
      { nl: 'Rapporteer elke maand het uitkomstgetal zelf. Experts twisten over de macht van de leider.', en: 'Report the outcome number itself every month. Experts argue about the lead’s power.', focus: ['report', 'power'] },
      { nl: 'Jij bezit verhaal, lijst en ritme. Welk project beweegt welk deel?', en: 'You own the story, the list, the rhythm. Which project moves which part?', focus: ['lead', 'jij'] },
    ]),
    sc('s4', PR, { nl: 'Waarde per schaarse dag', en: 'Value per scarce day' }, [
      { nl: 'Scoor grof, {n:1} tot {n:5}: waarde, inspanning, risico, strategie. Wie weegt, kiest de uitkomst.', en: 'Score roughly, {n:1} to {n:5}: value, effort, risk, strategy. Who sets the weights sets the outcome.', focus: ['score', 'weights'] },
      { nl: 'De {t:Bottleneck|bottleneck}: meestal een paar schaarse experts, niet geld.', en: 'The {t:Bottleneck|bottleneck}: usually a few scarce experts, not money.', cue: { Bottleneck: 'bneck' }, focus: 'bneck' },
      { nl: '{t:Waarde per schaarse dag|Waarde per schaarse dag}: A € {n:300}k ÷ {n:120} = € {n:2.5}k, B € {n:150}k ÷ {n:30} = € {n:5}k.', en: '{t:Value per scarce day|Value per scarce day}: A €{n:300}k ÷ {n:120} = €{n:2.5}k, B €{n:150}k ÷ {n:30} = €{n:5}k.', cue: { 'Waarde per schaarse dag': 'vpd' }, focus: 'vpd' },
      { nl: '{t:Risicogecorrigeerde waarde|Risicogecorrigeerde waarde}: € {n:300}k bij {n:50}% telt als € {n:150}k.', en: '{t:Risk-adjusted value|Risk-adjusted value}: €{n:300}k at {n:50}% counts as €{n:150}k.', cue: { 'Risicogecorrigeerde waarde': 'risk' }, focus: 'risk' },
    ]),
    sc('s5', PR, { nl: 'Onder de streep', en: 'Under the line' }, [
      { nl: 'Tel de schaarse mensen, niet de headcount: twee procesengineers, {n:240} dagen.', en: 'Count the scarce people, not the headcount: two process engineers, {n:240} days.', focus: ['cap', 'sponsor'] },
      { nl: 'Een levensmiddelenproducent, vijf projecten. Per engineersdag: B, D, A, en C na {n:50}% risico.', en: 'A food producer, five projects. Per engineer day: B, D, A, and C after {n:50}% risk.', focus: 'rows' },
      { nl: 'De {t:Capaciteitsstreep|capaciteitsstreep}: waar het lopende totaal {n:240} bereikt.', en: 'The {t:Capacity line|capacity line}: where the running total reaches {n:240}.', cue: { Capaciteitsstreep: 'line' }, focus: 'line' },
      { nl: 'B, D, A: {n:150} dagen. C eerst {n:60} dagen testen: {n:210}, {n:30} buffer.', en: 'B, D, A: {n:150} days. C first a {n:60}-day test: {n:210}, {n:30} buffer.', focus: ['run', 'line'] },
      { nl: 'E boven € {n:2.5}k per dag? Dan vóór A. Het MT kiest. Valkuil: in maart vergeten.', en: 'E above €{n:2.5}k a day? Then ahead of A. The team chooses. Trap: forgotten by March.', focus: ['ebox', 'trap', 'sponsor'] },
    ]),
    sc('s6', PR, { nl: 'Minder starten, meer af', en: 'Start less, finish more' }, [
      { nl: '{t:Onderhanden werk|Onderhanden werk}: alles wat gestart en nog niet af is.', en: '{t:Work in progress|Work in progress}: everything started and not yet finished.', cue: { 'Onderhanden werk': 'wip' }, focus: 'wip' },
      { nl: 'Little (1961): {t:Doorlooptijd|doorlooptijd} = onderhanden werk ÷ doorzet.', en: 'Little (1961): {t:Lead time|lead time} = work in progress ÷ throughput.', cue: { Doorlooptijd: 'little' }, focus: ['little', 'wip'] },
      { nl: 'Schakelen en wachten kosten doorzet: twaalf half leveren minder dan zes vol.', en: 'Switching and waiting cut throughput: twelve at half speed deliver less than six at full.', focus: 'speed' },
      { nl: 'Geen kaal nee: ‘Dan stopt B of schuift drie maanden. Wat heeft je voorkeur?’', en: 'No bare no: ‘Then B stops or slips three months. Which do you prefer?’', focus: ['no', 'jij'] },
      { nl: 'Wie over allebei gaat, kiest. Een zichtbare wachtlijst. Wat stoppen we hiervoor?', en: 'Whoever owns both chooses. A visible waiting list. What do we stop for this?', focus: ['wait', 'ask', 'sponsor'] },
    ]),
    sc('s7', CA, { nl: 'Dezelfde vijf mensen', en: 'The same five people' }, [
      { nl: 'Dezelfde vijf mensen. Een {t:Capaciteitsmatrix|capaciteitsmatrix}: namen, projecten, dagen per maand.', en: 'The same five people. A {t:Capacity matrix|capacity matrix}: names, projects, days per month.', cue: { Capaciteitsmatrix: 'matrix' }, focus: ['five', 'matrix'] },
      { nl: 'Overboekte rijen zijn {t:Capaciteitsconflict|capaciteitsconflicten}: de meeste vertraging.', en: 'Overbooked rows are {t:Resource conflict|resource conflicts}: most of the delay.', cue: { Capaciteitsconflict: 'red' }, focus: ['red', 'matrix'] },
      { nl: '{t:Echte beschikbaarheid|Echte beschikbaarheid}: {n:260} werkdagen, min {n:50}, min {n:20}: {n:190}.', en: '{t:Real availability|Real availability}: {n:260} weekdays, minus {n:50}, minus {n:20}: {n:190}.', cue: { 'Echte beschikbaarheid': 'avail' }, focus: 'avail' },
      { nl: 'Eigen werk {n:70}%: {n:57} projectdagen, vijf per maand. Twee dagen per week? Fictie.', en: 'Day job {n:70}%: {n:57} project days, five a month. Two days a week? Fiction.', focus: ['avail', 'month'] },
    ]),
    sc('s8', CA, { nl: 'Schakelen en kiezen', en: 'Switching and choosing' }, [
      { nl: '{t:Contextswitch|Contextswitch}, Weinberg (1992): twee projecten {n:20}% verlies, drie {n:40}%, vijf {n:75}%.', en: '{t:Context switching|Context switching}, Weinberg (1992): two projects {n:20}% lost, three {n:40}%, five {n:75}%.', cue: { Contextswitch: 'switch' }, focus: ['switch', 'fatima'] },
      { nl: 'Minder tegelijk, elk een echt blok tijd: dinsdag en donderdag voor A.', en: 'Fewer at once, each a real block of time: Tuesday and Thursday for A.', focus: 'block' },
      { nl: 'De eigenaar kiest: Jan doet A en B, C in mei; of een externe, {n:40} dagen, € {n:40}k.', en: 'The owner chooses: Jan on A and B, C in May; or a contractor, {n:40} days, €{n:40}k.', focus: ['opts', 'sponsor'] },
      { nl: 'Geen stil avondwerk. Signalen: ‘ligt eigenlijk wel vast’, ‘ze redt het wel’.', en: 'No quiet evenings. Signs: ‘basically committed’, ‘she’ll manage’.', focus: ['evening', 'signals'] },
      { nl: 'Tot {n:80}% plannen, of één kwartaal vooruit. Op wiens dagen rekenen we?', en: 'Book up to {n:80}%, or plan a quarter ahead. Whose days are we counting on?', focus: ['full', 'ask8', 'fatima'] },
    ]),
    sc('s9', CA, { nl: 'De maand van Fatima', en: 'Fatima’s month' }, [
      { nl: 'Fatima op vier projecten, elk een dag per week: {n:16} à {n:17} dagen per maand. Ze heeft er {n:4}.', en: 'Fatima on four projects, each a day a week: {n:16} to {n:17} days a month. She has {n:4}.', focus: ['fm', 'claims', 'fatima', 'month'] },
      { nl: 'Jouw pilot wil in maart {n:8} dagen; twee anderen rekenen ook op maart.', en: 'Your pilot needs {n:8} days in March; two other leads count on March too.', focus: 'march' },
      { nl: 'Matrix, eerst Fatima vragen, dan naar wie over alle vier gaat.', en: 'The matrix, ask Fatima first, then go to whoever owns all four.', focus: ['route', 'sponsor', 'fatima'] },
      { nl: 'Opties: de rest naar april en mei, een tweede planner {n:10} dagen, of de pilot later.', en: 'Options: the rest to April and May, a second planner for {n:10} days, or the pilot later.', focus: ['opts9', 'month'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons'
// teach text and worked examples, so every point of the checklist above is
// said here or shown on its card. No symbol the voice would read aloud, no
// spoken parenthesis or quote. Words checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex, 2026-11-12). SAY rules added in
// films/_kit/timeline.mjs for this film's terms, which no other film says:
// programmaraad, capaciteitsstreep, capaciteitsmatrix, capaciteitsconflict(en)
// and risicogecorrigeerde split at the head (espeak-ng stresses programmaRAAD,
// capaciteitsSTREEP, KAcapaciteitsmatrix, risicogecorrigEERde: split, each part
// keeps its own stress), onderhanden werk split in this film's two phrases
// only (it stresses ONderhanden: said onder-HANden; eng.lines.design keeps its
// voice), contextswitch with the tsj of "switch" (it reads the ch of
// "lachen"), planningstool with the oe Dutch speakers say (it reads
// planningsTOOL with the Dutch oo), and Gerald Weinberg as his English name (it
// reads the Dutch g and ei). Every film's spoken text was recomputed before and
// after these rules: only this film's changes. Reworded where it misreads a
// word that is not a lesson term (they stay in the captions and cards):
// projecteigenaren, projectbesluiten, projectdagen and projectleider (it
// stresses PRO-ject in a compound: "de eigenaren van de projecten", "besluiten
// binnen een project", "dagen voor projecten"), procesengineers, engineersdag
// and engineer (it reads "eng-ie-NEER": "experts", "per dag van een expert";
// "expertdag" drops the d), lijnmanager, planningsmanager and manager ("de
// eigenaar van de uitkomst", "leidinggevende"), finance and financiën ("de
// financiële kant"), headcount (not said), levensmiddelenproducent and
// voedingsmiddelen (stressed on -DEE-len: "een voedingsbedrijf"),
// plantdirecteur (the d dropped: "de directeur"), dashboard (on the card),
// feestdagen (stressed fees-TAA-gen: "vrij"), precisie (on the card),
// wachtrijtheorie (on the card), release (not said), KPI (on the card), Q2
// and Q3 ("het tweede kwartaal"), IT alone, read as the English "it" ("het
// IT-team"), programmaleider ("de leider van het programma") and the "à" of a
// day rate, read "a grave" ("voor 1000 euro per dag", now only on the card).
// The guard below reads the voice after the SAY rules, so a rule that fixes a
// word lets it through and a word with no rule is refused.
const SAY = [
  [ // s1 programme or project
    { nl: 'Een project levert een output: een gereedheidscheck, een omgebouwde lijn, een planningstool.',
      en: 'A project delivers an output: a readiness check, a rebuilt line, a planning tool.' },
    { nl: 'Een {t:Programma|programma} stuurt projecten samen die één uitkomst leveren die geen van hen alleen haalt: afgezegde klussen van {n:14} naar {n:8} procent.',
      en: 'A {t:Programme|programme} runs projects together that deliver one outcome none of them reaches alone: cancelled jobs from {n:14} to {n:8} percent.' },
    { nl: 'Kun je er één schrappen en blijft het doel staan, dan hoort het in het {t:Portfolio|portfolio}: alle projecten die om hetzelfde geld en dezelfde mensen strijden.',
      en: 'If you can drop one and the goal still holds, it belongs in the {t:Portfolio|portfolio}: all the projects competing for the same money and people.' },
  ],
  [ // s2 dependencies
    { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: B heeft in week {n:10} de datadefinitie van A nodig, en C wil in het tweede kwartaal de planners van B.',
      en: 'A {t:Dependency|dependency}: B needs A\'s data definition by week {n:10}, and C wants B\'s two planners in the second quarter.' },
    { nl: 'Houd één lijst bij: eigenaar, datum, en wat er gebeurt als het uitloopt.',
      en: 'Keep one list: owner, date, and what happens if it slips.' },
    { nl: 'Vier onafhankelijke projecten van elk {n:90} procent op tijd halen het samen maar in {n:66} procent.',
      en: 'Four independent projects, each {n:90} percent on time, all make it only {n:66} percent of the time.' },
    { nl: 'In de regio leest de check data die team B herontwerpt. Op één A4: B bevriest de definitie in week {n:6}, het IT-team test vóór de livegang.',
      en: 'In the region the check reads data team B is redesigning. On one page: B freezes the definition by week {n:6}, IT tests before go-live.' },
  ],
  [ // s3 the board, the watermelon, the lead
    { nl: 'De {t:Programmaraad|programmaraad}: de sponsor, de eigenaren van de projecten, de eigenaar van de uitkomst, en de financiële kant.',
      en: 'The {t:Programme board|programme board}: the sponsor, the project owners, the outcome\'s owner, and finance.' },
    { nl: 'Maandelijks beslist de raad over de naden: volgorde, gedeelde mensen, scope. Besluiten binnen een project blijven in de stuurgroep.',
      en: 'Monthly, the board decides on the seams: sequencing, shared people, scope. Decisions inside a project stay in its steering group.' },
    { nl: 'Let op het {t:Watermeloeneffect|watermeloeneffect}: groen buiten, rood vanbinnen. Alle drie staan op groen, de afzeggingen zitten nog op {n:14} procent.',
      en: 'Watch for {t:Watermelon reporting|watermelon reporting}: green outside, red inside. All three report green, cancellations are still at {n:14} percent.' },
    { nl: 'Rapporteer dus elke maand het uitkomstgetal zelf, met ieders bijdrage.',
      en: 'So report the outcome number itself monthly, with each project\'s share.' },
    { nl: 'Jij bezit het verhaal, de lijst en het ritme, niet de projecten. Vraag: welk getal beweegt, hoeveel, en welk project beweegt welk deel?',
      en: 'You own the story, the list and the rhythm, not the projects. Ask: which number moves, how much, and which project moves which part?' },
  ],
  [ // s4 scoring and the bottleneck
    { nl: 'Scoor elk project grof, van {n:1} tot {n:5}, op waarde, inspanning, risico en strategie. Wie de gewichten kiest, kiest de uitkomst.',
      en: 'Score each project roughly, {n:1} to {n:5}, on value, effort, risk and strategy. Whoever sets the weights sets the outcome.' },
    { nl: 'De {t:Bottleneck|bottleneck} bepaalt hoeveel er af komt: meestal een paar schaarse experts, niet het geld.',
      en: 'The {t:Bottleneck|bottleneck} limits how much gets done: usually a few scarce experts, not money.' },
    { nl: 'Tel dus in {t:Waarde per schaarse dag|waarde per schaarse dag}. A haalt tweeënhalfduizend euro per dag, B vijfduizend. B gaat eerst, al lijkt A groter.',
      en: 'So count in {t:Value per scarce day|value per scarce day}. A brings two and a half thousand euros a day, B five thousand. B goes first, although A looks bigger.' },
    { nl: 'En de {t:Risicogecorrigeerde waarde|risicogecorrigeerde waarde}: {n:300} duizend bij {n:50} procent vertrouwen telt als {n:150} duizend.',
      en: 'And the {t:Risk-adjusted value|risk-adjusted value}: {n:300} thousand at {n:50} percent confidence counts as {n:150} thousand.' },
  ],
  [ // s5 under the line
    { nl: 'Tel de schaarse mensen: twee experts met elk {n:120} dagen geven {n:240}.',
      en: 'Count the scarce people: two engineers with {n:120} days each give {n:240}.' },
    { nl: 'Een voedingsbedrijf wil alle vijf. Per dag van een expert: B vierenhalfduizend euro, D drie, A tweeënhalf, en C, een nieuw MES voor de orders op de vloer, één na {n:50} procent risico.',
      en: 'A food producer wants all five. Per engineer day: B four and a half thousand, D three, A two and a half, and C, a new MES for the orders on the floor, one at {n:50} percent risk.' },
    { nl: 'Rangschik, en trek de {t:Capaciteitsstreep|capaciteitsstreep} waar het lopende totaal {n:240} bereikt. Alles eronder wacht.',
      en: 'Rank, and draw the {t:Capacity line|capacity line} where the running total reaches {n:240}. Everything below waits.' },
    { nl: 'B, D en A: {n:150} dagen. C krijgt eerst een fase van {n:60} dagen die de grote aanname test. Samen {n:210}, met {n:30} buffer.',
      en: 'B, D and A: {n:150} days. C first gets a {n:60}-day phase that tests the big assumption. {n:210} in all, {n:30} as buffer.' },
    { nl: 'Voor E vraag je de directeur een getal: boven tweeënhalfduizend per dag gaat het vóór A. Het team kiest. Valkuil: in maart is de streep vergeten.',
      en: 'For E, ask the plant director for a number: above two and a half thousand a day, it goes ahead of A. The team chooses. Trap: by March the line is ignored.' },
  ],
  [ // s6 work in progress and saying no
    { nl: '{t:Onderhanden werk|Onderhanden werk} is alles wat gestart en nog niet af is.',
      en: '{t:Work in progress|Work in progress} is everything started and not yet finished.' },
    { nl: 'De wet van Little, 1961: de {t:Doorlooptijd|doorlooptijd} is onderhanden werk gedeeld door doorzet. Bij drie af per kwartaal duren twaalf open projecten vier kwartalen, zes er twee.',
      en: 'Little\'s law, 1961: {t:Lead time|lead time} is work in progress divided by throughput. At three finished a quarter, twelve open projects take four quarters, six take two.' },
    { nl: 'Schakelen en wachten kosten ook doorzet: twaalf projecten op halve snelheid leveren minder dan zes op volle.',
      en: 'Switching and waiting cut throughput too: twelve projects at half speed deliver less than six at full speed.' },
    { nl: 'Geen kaal nee, maar: dan stopt project B, of schuift drie maanden. Wat heeft je voorkeur?',
      en: 'Never a bare no, but: then project B stops, or slips three months. Which do you prefer?' },
    { nl: 'Wie over allebei gaat, kiest. Houd een zichtbare wachtlijst bij. Vraag: wat stoppen we om hier ruimte voor te maken?',
      en: 'Whoever owns both chooses. Keep a visible waiting list. Ask: what do we stop to make room for this?' },
  ],
  [ // s7 the same five people
    { nl: 'Meestal zijn het dezelfde vijf mensen. Een {t:Capaciteitsmatrix|capaciteitsmatrix} zet namen verticaal, projecten horizontaal, dagen per maand, en hun echte dagen.',
      en: 'Usually it is the same five people. A {t:Capacity matrix|capacity matrix} puts names down, projects across, days per month, and their real days.' },
    { nl: 'Overboekte rijen zijn {t:Capaciteitsconflict|capaciteitsconflicten}: meer dagen beloofd dan er zijn. Twee of drie rode rijen verklaren de meeste vertraging.',
      en: 'Overbooked rows are {t:Resource conflict|resource conflicts}: more days promised than there are. Two or three red rows explain most of the delay.' },
    { nl: '{t:Echte beschikbaarheid|Echte beschikbaarheid} is lager dan je denkt: van {n:260} werkdagen gaan er {n:50} af aan vrij, ziekte en opleiding, en {n:20} aan overleg. Er blijven er {n:190} over.',
      en: '{t:Real availability|Real availability} is lower than you think: of {n:260} weekdays, {n:50} go to leave, sickness and training, and {n:20} to meetings. {n:190} remain.' },
    { nl: 'Bij {n:70} procent eigen werk blijven er {n:57} dagen voor projecten over, vijf per maand.',
      en: 'With {n:70} percent day job, {n:57} project days are left, five a month.' },
  ],
  [ // s8 switching and choosing
    { nl: 'Elke {t:Contextswitch|contextswitch} kost tijd. Gerald Weinberg schatte in 1992: twee projecten {n:20} procent verlies, drie {n:40}, vijf {n:75}. Een schatting, maar herkenbaar.',
      en: 'A {t:Context switching|context switch} costs time. Gerald Weinberg estimated in 1992: two projects {n:20} percent lost, three {n:40}, five {n:75}. An estimate, but recognisable.' },
    { nl: 'Beter: minder tegelijk, met echte blokken, zoals dinsdag en donderdag voor A.',
      en: 'Better: fewer at once, in real blocks, such as Tuesday and Thursday for A.' },
    { nl: 'De eigenaar kiest: Jan doet A en B en C start in mei, of een externe doet C, voor {n:40} duizend.',
      en: 'The owner chooses: Jan does A and B and C starts in May, or a contractor does C for {n:40} thousand.' },
    { nl: 'Los het niet stil op met avondwerk: dat verstopt de kosten.',
      en: 'Don\'t solve it quietly with evenings: that hides the cost.' },
    { nl: 'Sommigen plannen tot {n:80} procent, anderen één kwartaal vooruit. Op wiens dagen rekenen we, en heeft zij het plan gezien?',
      en: 'Some book to {n:80} percent, others plan a quarter ahead. Whose days are we counting on, and has she seen this plan?' },
  ],
  [ // s9 Fatima's month
    { nl: 'Planner Fatima staat op vier projecten, ook het jouwe. Elk rekent op één dag per week: {n:16} tot {n:17} dagen per maand. Ze heeft er {n:4}.',
      en: 'Planner Fatima is on four projects, yours too. Each assumes a day a week: {n:16} to {n:17} days a month. She has {n:4}.' },
    { nl: 'Jouw pilot heeft haar in maart {n:8} dagen nodig, en twee anderen rekenen ook op maart.',
      en: 'Your pilot needs her for {n:8} days in March, and two other leads count on March too.' },
    { nl: 'Maak de matrix, vraag Fatima eerst wat realistisch is, en ga naar wie over alle vier gaat, niet naar haar.',
      en: 'Build the matrix, ask Fatima first what is realistic, and go to whoever owns all four, not to her.' },
    { nl: 'Opties: de rest naar april en mei, een planner van het regiokantoor voor {n:10} dagen, of de pilot later. Dan plant iedereen op het besluit, niet op hoop.',
      en: 'Options: the rest to April and May, a planner from the regional office for {n:10} days, or the pilot later. Then everyone plans on the decision, not hope.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above). The guard reads the
// voice after the SAY rules, so a rule may turn a word into something sayable.
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /(?:\s|^)à\s|\b(project(eigena\w*|besluit\w*|dagen|leider\w*|status\w*)|\w*engineer\w*|\w*manager\w*|finance|financiën|headcount|levensmiddel\w*|plantdirecteur|dashboard|feestdagen|precisie|wachtrij\w*|release|KPI|Q[1-4]|IT(?!-team)|programmaleider|planningstool|contextswitch\w*|Weinberg|programmaraad|capaciteits(streep|matrix|conflict\w*)|risicogecorrigeerde|onderhanden)\b/;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×÷=+()“”"‘’…%€]|:\S/.test(plain.replace(/(\w)'(\w)/g, '$1$2'))) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl') {
    const voiced = sayable(plain, 'nl');
    if (MISREAD.test(voiced)) throw new Error(`narration: "${MISREAD.exec(voiced)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
  }
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(300, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > 300) throw new Error(`film is ${total} s, over 300`);
}
// each beat's still (reduced motion) sits late in its own share of the scene
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
C.dur = spec.scenes.map((s) => s.dur);

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + `
.pp-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pp-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pp-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pp-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pp-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pp-big,.pp-lab{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pp-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pp-inv{fill:var(--anatomy-card);font-family:var(--fp-sans);font-weight:700}
.pp-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1.2}
.pp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 4}
.pp-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pp-cut{fill:none;stroke:var(--pp-red);stroke-width:2.6;stroke-dasharray:7 4}
.pp-cutl{fill:none;stroke:var(--pp-red);stroke-width:4;stroke-linecap:round}
[data-cue][data-on] .pp-cutl{stroke:var(--pp-red);stroke-width:5}
.pp-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.pp-bar{fill:var(--anatomy-hi)}
.pp-bar2{fill:color-mix(in srgb,var(--anatomy-hi) 35%,transparent);stroke:var(--anatomy-hi);stroke-width:1;stroke-dasharray:3 3}
.pp-acc{fill:var(--fp-accent)}
.pp-green{fill:var(--pp-green)}
.pp-redf{fill:var(--pp-red)}
.pp-redt{fill:var(--pp-red);font-family:var(--fp-sans);font-weight:700}
.pp-rind{fill:var(--pp-green);stroke:var(--anatomy-lo);stroke-width:1}
.pp-flesh{fill:var(--pp-red)}
.pp-seed{fill:var(--anatomy-strong)}
.pp-cell{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1}
.pp-cellr{fill:color-mix(in srgb,var(--pp-red) 30%,var(--anatomy-face));stroke:var(--pp-red);stroke-width:1.4}
.pp-row{fill:none;stroke:var(--anatomy-lo);stroke-width:.7;stroke-linecap:round}
.pp-day{fill:var(--anatomy-mid)}
.pp-real{fill:none;stroke:var(--fp-accent);stroke-width:1.2}
.iso{--pp-red:#E07A6A;--pp-green:#6FB37F}
.iso[data-theme="light"]{--pp-red:#B3402F;--pp-green:#3B7F52}
[data-cue][data-on] .pp-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pp-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pp-txt,[data-cue][data-on] .pp-big,[data-cue][data-on] .pp-lab,[data-cue][data-on] .pp-mute{fill:var(--fp-focus-text)}
[data-cue][data-on] .pp-row{stroke:var(--fp-accent)}
.pp-mini .pp-txt,.pp-mini .pp-mute,.pp-mini .pp-big,.pp-mini .pp-lab,.pp-mini .pp-on,.pp-mini .pp-redt,.pp-mini .pp-inv{display:none}
.pp-mini *{vector-effect:non-scaling-stroke}
.pp-mini .pp-card,.pp-mini .pp-hot,.pp-mini .pp-line,.pp-mini .pp-cell,.pp-mini .pp-cellr{stroke-width:.7px}
.pp-mini .pp-axis,.pp-mini .pp-dash,.pp-mini .pp-cut,.pp-mini .pp-cutl,.pp-mini .pp-strike,.pp-mini .pp-bar2,.pp-mini .pp-rind{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.iso:not([data-theme="light"]) [data-cue="fatima"]:not([data-on]) .pp-skin>:is(.iso-fill,.iso-top){fill:#C9A88A}
.iso:not([data-theme="light"]) [data-cue="fatima"]:not([data-on]) .pp-skin>.iso-shade{fill:#A88B70}
/* Fatima: a mustard cardigan, a white top, dark hair and a blue folder (this film's own figure, not the planner) */
.iso{--pp-mustard:#C9A24A;--pp-folder:#4F78A8}
.iso[data-theme="light"]{--pp-mustard:#A87F1E;--pp-folder:#2F5D8F}
[data-cue="fatima"]:not([data-on]) .pp-card>:is(.iso-fill,.iso-top){fill:color-mix(in srgb,var(--pp-mustard) 80%,var(--anatomy-top))}
[data-cue="fatima"]:not([data-on]) .pp-card>.iso-shade{fill:color-mix(in srgb,var(--pp-mustard) 88%,var(--anatomy-shade-0))}
[data-cue="fatima"]:not([data-on]) .pp-top>:is(.iso-fill,.iso-top,.iso-shade){fill:#F4F1EA}
[data-cue="fatima"]:not([data-on]) .pp-hair>:is(.iso-fill,.iso-top,.iso-shade){fill:#2E2622}
[data-cue="fatima"]:not([data-on]) .pp-folder>:is(.iso-fill,.iso-top){fill:var(--pp-folder)}
[data-cue="fatima"]:not([data-on]) .pp-folder>.iso-shade{fill:color-mix(in srgb,var(--pp-folder) 80%,#000)}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard dat het paneel in het klein herhaalt, en een klok; aan de zijwand een maand van vier weken met de dagen van Fatima. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak aan het rechtereind, en Fatima, de senior planner, in een okergeel vest met een blauwe map aan de voorkant. Op tafel een A4 met afhankelijkheden, een laptop en twee kopjes. Rechts een paneel met kaarten, gemarkeerd als voorbeeld of schema: drie projecten die samen één uitkomst halen, van 14 naar 8 procent; afhankelijkheden en vier keer 90 procent is 66 procent; de programmaraad en een watermeloen, groen buiten en rood binnen; een score van 1 tot 5 en waarde per schaarse dag; vijf projecten op volgorde met de capaciteitsstreep bij 240 dagen; onderhanden werk en de wet van Little; een capaciteitsmatrix met rode rijen en 190 echte dagen; tijdverlies door schakelen en twee opties; en de maand van Fatima, 16 tot 17 gevraagde dagen tegen 4.',
  en: 'A meeting room. On the back wall a whiteboard that repeats the panel in miniature, and a clock; on the side wall a month of four weeks with Fatima\'s days. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit at the right end, and Fatima, the senior planner, in a mustard cardigan with a blue folder at the front. On the table a page of dependencies, a laptop and two cups. At the right a panel with cards, marked as example or diagram: three projects that reach one outcome together, from 14 to 8 percent; dependencies, and four times 90 percent is 66 percent; the programme board and a watermelon, green outside and red inside; a score from 1 to 5 and value per scarce day; five projects in order with the capacity line at 240 days; work in progress and Little\'s law; a capacity matrix with red rows and 190 real days; time lost to switching and two options; and Fatima\'s month, 16 to 17 days asked against 4.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
}

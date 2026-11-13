// Dev tool, not shipped. Builds the explainer film "Flow op een kanbanbord /
// Flow on a kanban board" for the Projects course: pm.agile.board,
// pm.agile.wip and pm.agile.flowmetrics (levels 1 to 3 of the topic Kanban en
// flow in Agile werken).
//
//   node films/pm.agile.kanban/build.mjs            build the page
//   node films/pm.agile.kanban/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.agile.kanban.html: one offline page with
// the anatomy kit, the stage script and the player inlined. A film that will
// be rendered to video (Merijn, 2026-11-12: render every reviewed pm film), so
// all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.agile.kanban, P2, 90 s: cards moving, a WIP limit stopping a pile-up,
// cycle time and Little's law; the v13 board figure lets you play, this shows
// why). Storyboard drift: the plan's 90 s are about 300 s in nine scenes,
// because a lesson with a film no longer shows its worked example (v16 notes),
// so the film carries the teach text and the example of all three lessons: the
// board (s1 to s3), WIP limits (s4 to s6) and the flow measures with Little's
// law (s7 to s9). The storyboard's beats are all there: cards moving (s2, s5 to
// s8), a WIP limit stopping a pile-up (s4 b2, s5 b1 and b4, s6), cycle time
// (s7) and Little's law (s8, s9). pm.agile.flowsteer (level 4: service level
// expectation, ageing, utilisation) has its own terms and is not served.
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   board teach 1: Taiichi Ohno's Toyota Production System, a card with a bin
//     of parts (s1 b1); bin empty, the card goes back, the signal to make more;
//     consumption pulls production, no overproduction (s1 b2); in knowledge
//     work, IT and engineering, making the flow of work visible and steering
//     it; David Anderson from 2004, his book 2010 (s1 b3)
//   board teach 2: the 2020 Kanban Guide's definition, optimising the flow of
//     value through a process with a visual, pull-based system (s1 b4); the
//     Kanban board, a column per step, to do, analysis, build, test, done (s2
//     b1); each work item, a request or a fault, a card moving left to right
//     (s2 b2)
//   board teach 3: start where you are, draw the work as it really flows, not
//     as on paper; no fixed roles or sprints; alongside Scrum (s2 b3); the
//     Definition of Workflow: what a work item is, start and done, steps, how
//     work in progress is limited, rules, how long an item usually takes (s2 b4)
//   board teach 4: a card that can't move on (supplier, decision, test
//     environment) marked blocked, often a red sticker; blocked cards the gold
//     mine, where the system stutters (s2 b5); for a Lean consultant a visual
//     management board, a blocked card like an andon, a line that stopped (s2 b6)
//   board teach 5: at Toyota a standard part, always the same; here every item
//     different, the work varies; the card describes work, not stock (s3 b1);
//     the mistake, cards with no limit: a to-do list on the wall, not yet a
//     pull system; ask when work counts as started and as done (s3 b2)
//   board example: a machine builder's engineering, a whiteboard with 40 loose
//     notes, nobody knows what is in progress (s3 b3); columns as the work
//     really flows: requested, design, check by a second engineer, waiting for
//     customer, released to production (s3 b4); after an hour all 40 up, 12 in
//     design, 9 waiting for the customer, 6 of them over 3 weeks (s3 b5), the
//     other 19 in the other columns (card, s3 b5; the lesson gives no split, so
//     those cards are drawn faint, 7, 6 and 6, and the card says the split is
//     illustrative: "verdeling: voorbeeld"); 4 blocked by a missing customer
//     specification; started when an engineer takes the card, done when the
//     drawing is released (s3 b6). The lesson does not say in which column the
//     4 blocked cards hang: the board puts their stickers on design cards.
//   wip teach 1: WIP, work started and not done, the same term in the factory
//     (in Dutch: onderhanden werk); costs money, hides problems, slows
//     everything (s4 b1); a WIP limit, an agreed maximum at once in a column or
//     the whole system, test at most 2; full, start nothing new; that makes the
//     board a pull system (s4 b2)
//   wip teach 2: five things at once, switching costs time to get back in;
//     Gerald Weinberg, 1992, about 20 % per extra project, an estimate from
//     experience, not a measurement (s4 b3); more important, each item lies
//     idle longer, customers wait though everyone is busy (s4 b4)
//   wip teach 3: a full column: don't pick something new, help finish further
//     right: swarming, several people finishing one item (s5 b1); a developer
//     helps test, an engineer does a colleague's check; strange at first, not
//     your own work, but the team delivers more (s5 b2)
//   wip teach 4: the starting number needn't be perfect, about the people in
//     the step or slightly fewer, then adjust; too loose nothing changes, too
//     tight people wait (s5 b3); for a Lean consultant a supermarket stock or a
//     fixed buffer between two machines; the limit shows the bottleneck, work
//     piles up there (s5 b4)
//   wip teach 5: mistakes: limits stretched when busy, per person instead of
//     per step, no agreement for a full column (s5 b5); experts argue: one limit
//     on the whole system, simpler; ask what you do when finished and the next
//     column is full (s5 b6)
//   wip example: an IT team of 5 at a dairy plant, 15 items in progress, 3 per
//     person, a request takes 6 weeks on average (s6 b1); limits build at most
//     4, test at most 2 (s6 b2); week 1: test full with 2, a developer done
//     building would make a fifth in build, helps test instead, one item done
//     the same day (s6 b3); after 6 weeks 6 at once instead of 15, about 2.5
//     weeks per request (s6 b4)
//   flowmetrics teach 1: the Kanban Guide's four flow measures at a minimum:
//     WIP and throughput, items finished per unit of time, per week (s7 b1);
//     work item age, how long an unfinished item has been under way (s7 b2);
//     cycle time, start to finish of a completed item; start and finish as
//     agreed in the Definition of Workflow (s7 b3)
//   flowmetrics teach 2: the trap in the words: in Lean in the factory cycle
//     time is the time per unit at one station, 45 seconds per product; in
//     Kanban the whole time from start to finish, in the factory rather
//     throughput time (s7 b4); lead time from the customer's request, waiting
//     before the start included; agree which definition you mean (s7 b5)
//   flowmetrics teach 3: Little's law, proved by John Little in 1961: average
//     cycle time = average WIP / average throughput (s8 b1); 12 in progress, 3 a
//     week done, 12 / 3 = 4 weeks; the same in the factory, work in progress
//     divided by output gives the throughput time; averages over a period, not
//     one item (s8 b2)
//   flowmetrics teach 4: at equal throughput halving WIP halves the average
//     cycle time: why WIP limits work (s8 b3); the system must be stable, in =
//     out on average, WIP about equal at start and end; a growing pile breaks
//     the sum (s8 b4); Vacanti: a relationship between averages after the fact,
//     not a forecasting machine (s8 b5)
//   flowmetrics teach 5: where Lean and Kanban are most alike, less work in
//     progress gives shorter throughput times; the mistake, only the average
//     cycle time; items of months hide in it; look at the spread; ask where the
//     clock starts and stops (s8 b6)
//   flowmetrics example (faded): an office-furniture maker's IT team, 8 weeks
//     measured, on average 12 in progress, about as many at start and end, 3 a
//     week out and 3 in: stable (s9 b1); 12 / 3 = 4 weeks, measured 4.2, a
//     reasonable match; the plant manager finds 4 weeks too long for small
//     requests (s9 b2)
//   ask and reveal (the ask is answered in the voice): limit 6, still 3 a week,
//     6 / 3 = 2 weeks, half (s9 b3); throughput must really stay 3 a week, no
//     work running off the board (s9 b4); arrivals must fit: more than 3 a week
//     and the queue before the board grows, waiting that shows in the lead time
//     the customer sees, not in the cycle time; measure again after 4 weeks (s9
//     b5)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts checked (2026-11-13): kanban as the card of Taiichi Ohno's Toyota
// Production System, used parts pulling replenishment (Ohno, Toyota Production
// System, 1978, English 1988); David J. Anderson's Kanban, Successful
// Evolutionary Change for Your Technology Business (Blue Hole Press, 2010),
// his first kanban system at Microsoft from 2004; The Kanban Guide (Daniel
// Vacanti and John Coleman, ProKanban.org, December 2020): "a strategy for
// optimizing the flow of value through a process that uses a visual,
// pull-based system", a Definition of Workflow (units of value, start and
// finish points, states, how WIP is controlled, explicit policies, a service
// level expectation), and the four minimum flow measures WIP, throughput, work
// item age and cycle time (from start to finish); Little's law, John D. C.
// Little, "A proof for the queuing formula L = λW", Operations Research 9
// (1961): averages over a long run of a stable system; the same wording and
// credit as pm.portfolio.prioritise ("Little, 1961"); Daniel Vacanti's stress
// on Little's law as a relation of averages after the fact (Actionable Agile
// Metrics for Predictability, 2015); Gerald Weinberg, Quality Software
// Management, vol. 1 (1992): about 20 % lost to switching per extra project,
// a rule of thumb. The 45 seconds, the starting-number rule, the supermarket
// and andon comparisons and the three examples are the lessons' own.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// team room seen more from the front than in pm.agile.scrum (azimuth 68), so
// the kanban board on the back wall is wide enough to read. Five columns, each
// its own cue group, whose cards move per beat; a column's header strip shows
// its WIP limit as slots that fill, and turns to the accent colour when the
// column is full. Left of the board on the wall, a dashed place for the queue
// of requests before the board; a clock (where the clock starts and stops) at
// the right; a strip of eight weeks on the side wall; and in front a parts bin
// on a stand with its kanban card, Toyota's original. The team are
// pm.agile.scrum's figures (its cast.mjs, imported, not edited): two team
// members and a developer who walks from the build column to the test column
// when he swarms. A panel at the right, in stage space, carries one card per
// scene, labelled "schema" or "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the columns, the
// cards, the queue, the clock, the weeks, the bin and the people.
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
const BO = 'pm.agile.board';
const WI = 'pm.agile.wip';
const FM = 'pm.agile.flowmetrics';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(BO, ['Toyota-productiesysteem van Taiichi Ohno: een kaart bij een bak onderdelen', 'Is de bak leeg, dan gaat de kaart terug en is dat het signaal om bij te maken',
  'trekt verbruik de productie aan, pull, en ontstaat er geen overproductie', 'In kenniswerk, zoals IT en engineering', 'de stroom van werk zichtbaar te maken en te sturen',
  'David Anderson maakte die vanaf 2004 bekend; zijn boek verscheen in 2010', 'De Kanban Guide van 2020 definieert Kanban als een strategie om de stroom van waarde door een proces te optimaliseren, met een visueel systeem gebaseerd op pull',
  '“te doen”, “analyse”, “bouwen”, “testen”, “klaar”', 'een stuk werk zoals een wens of een storing, is een kaart die van links naar rechts schuift',
  'Kanban begint waar je nu bent. Je tekent het werk zoals het echt loopt, niet zoals het op papier hoort', 'Er zijn geen vaste rollen of sprints; je kunt Kanban ook naast Scrum gebruiken',
  'wat een werkitem is, wanneer werk begint en klaar is, welke stappen er zijn, hoe je onderhanden werk beperkt, welke regels er gelden, en hoe lang een item meestal mag duren',
  'wachten op een leverancier, een besluit of een testomgeving, markeer je als geblokkeerd, vaak met een rode sticker', 'de goudmijn van het bord: ze laten zien waar het systeem hapert',
  'een visueel managementbord, en een geblokkeerde kaart is als een andon, het signaal dat een lijn stilstaat', 'een signaal voor een standaardonderdeel dat steeds hetzelfde is',
  'De kaart beschrijft werk, geen voorraad', 'Dan is het een takenlijst aan de muur, nog geen pullsysteem', '“Wanneer telt werk hier als begonnen, en wanneer als klaar?”',
  'Bij een machinebouwer heeft de afdeling engineering een whiteboard met 40 losse post-its. Niemand weet wat er echt loopt',
  '“aangevraagd”, “ontwerp”, “controle” (een tweede engineer kijkt mee), “wacht op klant”, “vrijgegeven” (de tekening gaat naar productie)',
  'Na een uur hangen alle 40 kaarten. 12 staan in “ontwerp”, 9 in “wacht op klant”, waarvan 6 al langer dan 3 weken', '4 kaarten zijn geblokkeerd door een missende klantspecificatie',
  'begonnen is als een engineer de kaart pakt; klaar is als de tekening vrijgegeven is']);
says(WI, ['WIP staat voor work in progress: werk dat begonnen is maar nog niet af. In de fabriek heet dat onderhanden werk', 'Het kost geld, verbergt problemen en maakt alles trager',
  'een afgesproken maximum aan werkitems tegelijk in een kolom of in het hele systeem, bijvoorbeeld “testen: hooguit 2”', 'Staat de kolom vol, dan mag je niets nieuws beginnen. Dat maakt het bord pas een pullsysteem',
  'Gerald Weinberg gaf in 1992 als vuistregel dat iemand bij elk extra project zo’n 20% van zijn tijd verliest aan schakelen; dat is een schatting uit ervaring, geen meting',
  'elk item ligt langer stil, omdat iedereen aan iets anders werkt. Klanten wachten langer, ook al is iedereen druk', 'Niet iets nieuws pakken, maar kijken wat je rechts op het bord kunt helpen afmaken. Dat heet swarming',
  'Een ontwikkelaar helpt testen; een engineer doet de controle voor een collega', 'Maar het team levert meer op',
  'ongeveer het aantal mensen in de stap, of iets minder, en dan bijstellen. Te ruim en er verandert niets; te krap en mensen wachten', 'een supermarktvoorraad of een vaste buffer tussen twee machines',
  'De limiet maakt de bottleneck zichtbaar, omdat het werk zich daar ophoopt', 'limieten die bij elke drukte worden opgerekt; limieten per persoon in plaats van per stap; en geen afspraak wat je doet als een kolom vol zit',
  'sommigen beginnen met een limiet op het hele systeem in plaats van per kolom, omdat dat eenvoudiger is', '“Wat doe jij als je klaar bent en de volgende kolom zit vol?”',
  'Een IT-team van 5 mensen bij een zuivelfabriek heeft 15 werkitems onderhanden: 3 per persoon. Een wens doet er gemiddeld 6 weken over', 'bouwen hooguit 4, testen hooguit 2',
  'Week 1: testen zit vol met 2 items', 'maar dan staat er een vijfde in bouwen. Hij helpt in plaats daarvan met testen. Eén item gaat dezelfde dag naar klaar',
  'Na 6 weken staan er nog 6 items tegelijk onderhanden in plaats van 15, en een wens doet er gemiddeld zo’n 2,5 weken over']);
says(FM, ['De Kanban Guide noemt vier flowmaten die elk Kanban-systeem minimaal bijhoudt', 'het aantal items dat per tijdseenheid afkomt, bijvoorbeeld per week',
  'hoe lang een item dat nog niet af is al onderweg is', 'de tijd van begin tot klaar van een afgerond item', 'de punten die je in de Definition of Workflow hebt afgesproken',
  'de tijd per stuk op één station, bijvoorbeeld 45 seconden per product op een machine', 'wat in de fabriek eerder doorlooptijd heet',
  'Lead time gebruiken veel teams voor de tijd vanaf de aanvraag van de klant, inclusief wachten voordat het werk begint', 'Spreek in elk gesprek af welke definitie je bedoelt',
  'De wet van Little, in 1961 bewezen door John Little, verbindt de drie maten: gemiddelde cycle time = gemiddelde WIP / gemiddelde throughput',
  '12 items onderhanden, 3 items per week af, dan duurt een item gemiddeld 12 / 3 = 4 weken', 'onderhanden werk gedeeld door uitstroom geeft de doorlooptijd', 'Hij geldt voor gemiddelden over een periode, niet voor één item',
  'bij gelijke throughput halveert de gemiddelde cycle time als je de WIP halveert. Daarom werken WIP-limieten', 'wat binnenkomt, gaat er gemiddeld ook weer uit, en de WIP is aan het begin en eind van de periode ongeveer gelijk',
  'Groeit de stapel onderhanden werk, dan klopt de som niet meer', 'Vacanti benadrukt: het is een verband tussen gemiddelden achteraf, geen voorspelmachine',
  'dit is waar Lean en Kanban het meest op elkaar lijken', 'minder onderhanden werk geeft kortere doorlooptijden', 'Een paar items die maanden duren, verstoppen zich in een net gemiddelde. Kijk naar de spreiding',
  '“Waar begint en eindigt bij jullie de klok?”', 'Het IT-team van een fabrikant van kantoormeubelen meet over de laatste 8 weken', 'ongeveer even veel aan het begin als aan het eind',
  'Er komen ook gemiddeld 3 per week binnen, dus het systeem is stabiel', 'De gemeten cycle time van de afgeronde items is 4,2 weken: dat klopt redelijk', 'De plantmanager vindt 4 weken te lang voor kleine wensen',
  'Het team verlaagt de WIP-limiet naar 6 items en blijft er 3 per week afmaken', 'Gemiddelde cycle time = 6 / 3 = 2 weken, de helft', 'de throughput moet echt op 3 per week blijven en er mag niet stiekem werk buiten het bord om lopen',
  'komen er meer dan 3 per week binnen, dan groeit de rij vóór het bord. Die wachttijd zie je niet in de cycle time, wel in de lead time die de klant ervaart. Meet na 4 weken opnieuw']);
says(BO, ['Taiichi Ohno’s Toyota Production System', 'David Anderson made it known from 2004; his book came out in 2010', 'a visual, pull-based system'], 'en');
says(WI, ['In the factory it is the same term', 'Gerald Weinberg gave in 1992 as a rule of thumb'], 'en');
says(FM, ['Little’s law, proved by John Little in 1961', 'Vacanti stresses', 'office-furniture manufacturer'], 'en');
assert(lessons.nl.get(BO).terms.map((t) => t.term).join() === 'Kanban,Kanbanbord,Werkitem,Definition of Workflow,Geblokkeerd', 'the five terms of board');
assert(lessons.nl.get(WI).terms.map((t) => t.term).join() === 'WIP,WIP-limiet,Contextwisseling,Swarming', 'the four terms of wip');
assert(lessons.nl.get(FM).terms.map((t) => t.term).join() === 'Throughput,Cycle time,Lead time,Work item age,Wet van Little', 'the five terms of flowmetrics');
for (const id of [BO, WI, FM]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.agile.kanban', `no other film is wired to ${id}`);
// the numbers the cards draw
const MB = { all: 40, design: 12, waiting: 9, old: 6, blocked: 4 };
const OTHER = MB.all - MB.design - MB.waiting;
assert(OTHER === 19 && MB.old <= MB.waiting, 'machine builder: 19 cards in the other columns, 6 of the 9 waiting are old');
const DAIRY = { people: 5, wip: 15, build: 4, test: 2, after: 6 };
assert(DAIRY.wip / DAIRY.people === 3 && DAIRY.build + 1 === 5 && DAIRY.build + DAIRY.test === DAIRY.after, 'dairy: 3 per person, a fifth in build, 4 + 2 = 6 at once');
const little = (wip, tp) => wip / tp;
assert(little(12, 3) === 4 && little(6, 3) === 2 && little(6, 3) === little(12, 3) / 2, 'Little: 12 / 3 = 4 weeks, 6 / 3 = 2 weeks, half');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 68;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 8, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the kanban board on the back wall: five columns, a header strip each for its limit
const BOARD = w.board({ x0: 44, x1: 262, z0: 104, z1: 222 });
const BA = BOARD.area;
const CWD = (BA.x1 - BA.x0 - 6) / 5;
const COLS = [0, 1, 2, 3, 4].map((i) => ({ x0: r1(BA.x0 + 3 + i * CWD), x1: r1(BA.x0 + 3 + (i + 1) * CWD - 1.5) }));
const CARD = { w: r1((CWD - 1.5 - 6) / 2), h: 11, py: 14 };
const COLKEYS = ['colTodo', 'colAna', 'colBuild', 'colTest', 'colDone'];
const colRects = COLS.map((c, i) => cueG(COLKEYS[i], `<rect class="pm-col" x="${c.x0}" y="${r1(-BA.z1 + 1)}" width="${r1(c.x1 - c.x0)}" height="${r1(BA.z1 - BA.z0 - 2)}" rx="1"/>`)).join('');
const Q = { x0: 17 };
const queueSpot = cueG('wait', `<rect class="pm-qd" x="${Q.x0 - 2}" y="${r1(-BA.z1 + 14)}" width="${r1(CARD.w + 4)}" height="84" rx="1"/>`);
const boardFace = `<g transform="${BOARD.face}">${queueSpot}${colRects}${g('bLim', '')}${cueG('cards', g('bCards', ''))}</g>`;
// the eight weeks on the side wall
const CAL = w.calendar({ y0: 44, z0: 120, weeks: 8, cw: 16, ch: 40 });
const CELLS = Array.from({ length: 8 }, (_, i) => CAL.cell(i).map(r1));
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
// Toyota's original: a parts bin on a stand, its kanban card upright in front
const BIN = { x: 14, y: 196, w: 40, d: 30 };
const bin = cueG('bin', w.halo({ x: BIN.x - 2, y: BIN.y - 2, w: BIN.w + 4, d: BIN.d + 4, r: 3 })
  + w.box({ x: BIN.x, y: BIN.y, w: BIN.w, d: BIN.d, r: 1 }, 0, 58, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: BIN.x + 2, y: BIN.y + 2, w: BIN.w - 4, d: BIN.d - 4, r: 2 }, 58, 78, { tone: 'mid' }, { steps: 2 })
  + w.box({ x: BIN.x + 12, y: BIN.y + BIN.d - 3, w: 16, d: 1.4, r: 0.4 }, 64, 92, { tone: 'hi' }, { steps: 1 }));
// the team: pm.agile.scrum's figures; the helper starts at the build column
const colMid = (i) => (COLS[i].x0 + COLS[i].x1) / 2;
const HELP0 = { x: r1(colMid(2)), y: 204 };
const HV = (() => { const a = w.at([colMid(3), HELP0.y, 0]); const b = w.at([HELP0.x, HELP0.y, 0]); return [r1(a[0] - b[0]), r1(a[1] - b[1])]; })();
const fig = (x, y, key, look) => scrumPerson(w, k, G, P, { x, y, key, look, along: 'x' });
const world = [
  w.room(ROOM),
  cueG('board', BOARD.svg) + boardFace,
  cueG('clock', w.clock(282, 196, 11)),
  cueG('weeks', CAL.svg + calMarks),
  bin,
  g('helper', fig(HELP0.x, HELP0.y, 'helper', 'dev')),
  fig(96, 214, 'team', 'dev2'),
  fig(244, 210, 'team', 'sm'),
].join('');
for (const r of ['board', 'cards', 'wait', 'clock', 'weeks', 'bin', 'helper', 'team', ...COLKEYS]) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);

// ---------------------------------------------------------------- the board's states
// One string per beat (or a list, played over the beat): a column per card
// (0 to 4, . hidden, s scattered, q queue) and its flags (b blocked, a ageing,
// f faint, h tracked). Card identity is kept, so the stage moves each card.
const N = 40;
class Board {
  constructor(src) { this.c = src ? [...src.c] : Array(N).fill('.'); this.f = src ? [...src.f] : Array(N).fill(' '); }
  put(ids, col) { for (const i of ids) this.c[i] = String(col); return this; }
  flag(ids, ch) { for (const i of ids) this.f[i] = ch; return this; }
  clear() { this.f.fill(' '); return this; }
  hide() { this.c.fill('.'); this.f.fill(' '); return this; }
  count(col) { return this.c.filter((x) => x === String(col)).length; }
  get s() { for (let c = 0; c < 5; c++) assert(this.count(c) <= 12, `column ${c} holds ${this.count(c)} cards, room for 12`); return `${this.c.join('')}|${this.f.join('').trimEnd()}`; }
}
const R = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const B = new Board();
const BOARDS = [];
const LIM = [];
const WEEKS = [];
const HELP = [];
// s1: the board still empty (Toyota's bin first)
BOARDS.push([B.s]); LIM.push(['00000']); WEEKS.push([0]); HELP.push([0]);
// s2: a board with work; one card moves; one gets blocked
B.put([0, 1], 0).put([2, 3], 1).put([4, 5], 2).put([6], 3).put([7, 8], 4);
const s2a = B.s;
B.put([4], 3).flag([4], 'h');
const s2b = B.s;
B.flag([4], ' ').flag([2], 'b');
BOARDS.push([s2a, s2b, s2b, s2b, B.s, B.s]); LIM.push(['00000']); WEEKS.push([0]); HELP.push([0]);
// s3: Toyota's difference and the board without limits, then the machine
// builder's 40 loose notes, sorted: 12 design, 9 waiting (6 old), 19 faint, 4 blocked
const s3a = B.s;
B.hide().put(R(0, 39), 's');
const s3b = B.s;
B.put(R(0, 11), 1).put(R(12, 20), 3).put(R(21, 27), 0).put(R(28, 33), 2).put(R(34, 39), 4).flag(R(21, 39), 'f');
const s3c = B.s;
B.flag(R(12, 17), 'a');
const s3d = B.s;
B.flag(R(0, 3), 'b');
assert(B.count(1) === MB.design && B.count(3) === MB.waiting && B.count(0) + B.count(2) + B.count(4) === OTHER, 'the machine builder board holds 12, 9 and 19');
BOARDS.push([s3a, s3a, s3b, s3c, s3d, B.s]); LIM.push(['00000']); WEEKS.push([0]); HELP.push([0]);
// s4: WIP piling up in build; test limited to 2 and full; idle cards age
B.hide().put(R(15, 17), 0).put(R(0, 3), 1).put(R(4, 10), 2).put([11, 12], 3).put([18, 19], 4);
const s4a = B.s;
B.flag(R(4, 10), 'a');
BOARDS.push([s4a, s4a, s4a, B.s]); LIM.push(['00000', '00020']); WEEKS.push([0]); HELP.push([0]);
// s5: the developer swarms on test, one item done; limits per step; the
// pile-up before test; a stretched limit; one limit on the whole system
B.clear().put([11], 4).flag([11], 'h');
const s5a = B.s;
B.flag([11], ' ');
BOARDS.push([s5a, B.s]); LIM.push(['00020', '00020', '04320', '04320', '04820', 's10']); WEEKS.push([0]); HELP.push([1]);
// s6: the dairy plant: 15 in progress; limits build 4 and test 2; week 1 the
// developer helps test and one item is done; after 6 weeks 6 at once
B.hide().put(R(15, 17), 0).put(R(0, 2), 1).put(R(3, 9), 2).put(R(10, 14), 3);
assert(B.count(1) + B.count(2) + B.count(3) === DAIRY.wip, 'the dairy board starts with 15 in progress');
const s6a = B.s;
B.put([7, 8, 9, 12, 13, 14], '.');
const s6b = B.s;
B.put([10], 4).flag([10], 'h');
const s6c = B.s;
B.flag([10], ' ').put([0], 3).put([1, 2], 4);
assert(B.count(1) + B.count(2) + B.count(3) === DAIRY.after, 'after 6 weeks 6 at once');
BOARDS.push([s6a, s6a, [s6b, s6c], B.s]); LIM.push(['00000', '00420']); WEEKS.push([0, 0, 1, [1, 6]]); HELP.push([0, 0, 1, 0]);
// s7: throughput (cards reach done), age, a tracked card's cycle time, the queue
B.hide().put(R(20, 22), 0).put(R(0, 3), 1).put(R(4, 7), 2).put(R(8, 11), 3).put(R(12, 13), 4);
const s7 = [B.s];
for (const i of [8, 9, 10]) s7.push(B.put([i], 4).s);
B.flag([4, 5, 0], 'a');
const s7b = B.s;
B.clear().put([11], 3).flag([11], 'h');
const s7c0 = B.s;
B.put([11], 4);
const s7c = B.s;
B.flag([11], ' ').put(R(30, 34), 'q');
BOARDS.push([s7, s7b, [s7c0, s7c], s7c, B.s]); LIM.push(['00000']); WEEKS.push([0]); HELP.push([0]);
// s8: Little's law: 12 in progress, 3 a week done, 3 started, for 4 weeks;
// then the WIP halved; one long item in the spread
const cols8 = { 0: [], 1: R(0, 3), 2: R(4, 7), 3: R(8, 11), 4: [] };
let next = 12;
const draw8 = () => { B.hide(); for (const c of [0, 1, 2, 3, 4]) B.put(cols8[c], c); return B.s; };
for (let i = 0; i < 3; i++) cols8[0].push(next++);
const s8a = draw8();
const flow = [];
for (let wk = 0; wk < 4; wk++) {
  cols8[4].push(...cols8[3].splice(0, 3));
  cols8[3].push(...cols8[2].splice(0, 3));
  cols8[2].push(...cols8[1].splice(0, 3));
  cols8[1].push(...cols8[0].splice(0, 3));
  while (cols8[0].length < 3) cols8[0].push(next++);
  cols8[4] = cols8[4].slice(-9);
  assert(cols8[1].length + cols8[2].length + cols8[3].length === 12, 'Little: 12 in progress each week');
  flow.push(draw8());
}
assert(next <= N, 'enough cards for four weeks of flow');
for (const c of [1, 2, 3]) cols8[0].push(...cols8[c].splice(0, 2));
cols8[0] = cols8[0].slice(-9);
const s8c = draw8();
assert(B.count(1) + B.count(2) + B.count(3) === 6, 'WIP halved to 6');
B.flag([cols8[2][0]], 'a');
BOARDS.push([s8a, flow, s8c, s8c, s8c, B.s]); LIM.push(['00000', '00000', 's6']); WEEKS.push([0, [0, 4], 4]); HELP.push([0]);
// s9: the office-furniture team: 12 in progress, stable; then limit 6; then
// arrivals above 3 a week and the queue before the board grows
B.hide().put(R(20, 22), 0).put(R(0, 3), 1).put(R(4, 7), 2).put(R(8, 11), 3).put(R(12, 14), 4);
const s9a = B.s;
B.put([0, 1, 4, 5, 8, 9], 0).put(R(20, 22), '.');
const s9b = B.s;
const qs = [];
for (const i of R(30, 34)) qs.push(B.put([i], 'q').s);
BOARDS.push([s9a, s9a, s9b, s9b, qs]); LIM.push(['00000', '00000', 's6']); WEEKS.push([[0, 8], 8]); HELP.push([0]);
// scattered places for the 40 loose notes (a fixed seed)
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const SC = Array.from({ length: N }, () => [r1(BA.x0 + 2 + rnd() * (BA.x1 - BA.x0 - CARD.w - 4)), r1(-BA.z1 + 4 + rnd() * (BA.z1 - BA.z0 - CARD.h - 6))]);

// ---------------------------------------------------------------- the panel (stage space)
const PX = 322;
const PW = 308;
const CUES = ['toyota', 'pull', 'anderson', 'guide',
  'cols', 'item', 'start', 'dow', 'blk', 'andon',
  'diff', 'mistake', 'mb', 'cols5', 'count', 'blk4',
  'wip', 'lim', 'switch', 'idle',
  'swarm', 'own', 'startn', 'buffer', 'errs', 'sys',
  'dairy', 'lims', 'week1', 'after6',
  'tp', 'age', 'ct', 'trap', 'lt',
  'little', 'ex12', 'half', 'stable', 'vacanti', 'spread',
  'furn', 'calc4', 'calc2', 'watch', 'queue'];
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
const BIN_AT = w.at([BIN.x + BIN.w / 2, BIN.y, 80]).map(r1);
const CLOCK_AT = w.at([282, 0, 196]).map(r1);
const CAL_AT = w.at([0, 110, 140]).map(r1);
const HELP_AT = w.at([colMid(3), 0, 150]).map(r1);
const BV = (s) => [BOARD_AT[0], BOARD_AT[1], s];
const CAM = [
  { from: [160, 205, 1], to: [BIN_AT[0] + 30, BIN_AT[1] - 20, 1.1] },
  { from: [160, 205, 1], to: BV(1.5) },
  { from: BV(1.45), to: BV(1.55) },
  { from: BV(1.45), to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.3] },
  { from: BV(1.35), to: [HELP_AT[0], HELP_AT[1] + 20, 1.45] },
  { from: BV(1.45), to: [(BOARD_AT[0] + CAL_AT[0]) / 2, BOARD_AT[1] + 20, 1.15] },
  { from: BV(1.45), to: [(BOARD_AT[0] + CLOCK_AT[0]) / 2, BOARD_AT[1], 1.45] },
  { from: [(BOARD_AT[0] + CAL_AT[0]) / 2, BOARD_AT[1] + 20, 1.1], to: BV(1.45) },
  { from: [CAL_AT[0] + 40, CAL_AT[1], 1.1], to: BV(1.45) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, N, COLS, CARD, Q, SC, CELLS, BOARD: BOARDS, LIM, WEEKS, HELP, HV, BA: { x0: BA.x0, x1: BA.x1, z0: BA.z0, z1: BA.z1 } };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.agile.kanban',
  title: { nl: 'Flow op een kanbanbord', en: 'Flow on a kanban board' },
  lessons: [BO, WI, FM],
  strictFocus: true,
  scenes: [
    sc('s1', BO, 1, { nl: 'Van Toyota naar kenniswerk', en: 'From Toyota to knowledge work' }, [
      { nl: 'Toyota, Taiichi Ohno: een kaart bij een bak onderdelen.', en: 'Toyota, Taiichi Ohno: a card with a bin of parts.', focus: ['toyota', 'bin'] },
      { nl: 'Bak leeg? De kaart gaat terug: maak bij. Verbruik trekt de productie: pull.', en: 'Bin empty? The card goes back: make more. Use pulls production: pull.', focus: ['pull', 'bin'] },
      { nl: 'In kenniswerk: de stroom van werk zichtbaar maken en sturen. David Anderson, vanaf 2004.', en: 'In knowledge work: making the flow of work visible and steering it. David Anderson, from 2004.', focus: 'anderson' },
      { nl: '{t:Kanban|Kanban}, Kanban Guide 2020: de stroom van waarde optimaliseren, visueel en met pull.', en: '{t:Kanban|Kanban}, Kanban Guide 2020: optimising the flow of value, visual and pull-based.', cue: { Kanban: 'guide' }, focus: 'guide' },
    ]),
    sc('s2', BO, 1, { nl: 'Het bord', en: 'The board' }, [
      { nl: 'Het {t:Kanbanbord|kanbanbord}: een kolom per stap in het werk.', en: 'The {t:Kanban board|Kanban board}: a column for each step of the work.', cue: { Kanbanbord: 'cols' }, focus: ['cols', 'board'] },
      { nl: 'Elk {t:Werkitem|werkitem}, een wens of een storing, is een kaart die naar rechts schuift.', en: 'Each {t:Work item|work item}, a request or a fault, is a card moving to the right.', cue: { Werkitem: 'item' }, focus: ['item', 'cards'] },
      { nl: 'Begin waar je bent: teken het werk zoals het echt loopt. Geen vaste rollen of sprints.', en: 'Start where you are: draw the work as it really flows. No fixed roles or sprints.', focus: ['start', 'board'] },
      { nl: '{t:Definition of Workflow|Definition of Workflow}: de gedeelde afspraak over het bord.', en: '{t:Definition of Workflow|Definition of Workflow}: the shared agreement about the board.', cue: { 'Definition of Workflow': 'dow' }, focus: 'dow' },
      { nl: '{t:Geblokkeerd|Geblokkeerd}: wacht op een leverancier, besluit of testomgeving. Rode sticker.', en: '{t:Blocked|Blocked}: waiting on a supplier, a decision or a test environment. Red sticker.', cue: { Geblokkeerd: 'blk' }, focus: ['blk', 'cards'] },
      { nl: 'Lean-blik: een visueel managementbord; een geblokkeerde kaart is een andon.', en: 'Lean view: a visual management board; a blocked card is an andon.', focus: 'andon' },
    ]),
    sc('s3', BO, 1, { nl: 'Voorbeeld: de machinebouwer', en: 'Example: the machine builder' }, [
      { nl: 'Anders dan Toyota: geen standaardonderdeel. Elk item is anders; de kaart beschrijft werk.', en: 'Unlike Toyota: no standard part. Each item differs; the card describes work, not stock.', focus: 'diff' },
      { nl: 'Fout: kaarten zonder grens. Dan is het een takenlijst, geen pullsysteem.', en: 'Mistake: cards with no limit. Then it is a to-do list, not a pull system.', focus: ['mistake', 'cards'] },
      { nl: 'Machinebouwer, engineering: een whiteboard met {n:40} losse post-its.', en: 'A machine builder’s engineering: a whiteboard with {n:40} loose sticky notes.', focus: ['mb', 'cards'] },
      { nl: 'Kolommen zoals het echt loopt: aangevraagd, ontwerp, controle, wacht op klant, vrijgegeven.', en: 'Columns as it really flows: requested, design, check, waiting for customer, released.', focus: ['cols5', 'board'] },
      { nl: 'Na een uur: {n:12} in ontwerp, {n:9} wachten op de klant, {n:6} al langer dan {n:3} weken.', en: 'After an hour: {n:12} in design, {n:9} waiting for the customer, {n:6} for over {n:3} weeks.', focus: ['count', 'colAna', 'colTest'] },
      { nl: '{n:4} geblokkeerd: de klantspecificatie mist. Klaar is als de tekening is vrijgegeven.', en: '{n:4} blocked: no customer spec. Done is when the drawing is released.', focus: ['blk4', 'cards'] },
    ]),
    sc('s4', WI, 2, { nl: 'WIP en de limiet', en: 'WIP and the limit' }, [
      { nl: '{t:WIP|WIP}: work in progress, begonnen maar niet af. In de fabriek: onderhanden werk.', en: '{t:WIP|WIP}: work in progress, started but not done. The same term in a factory.', cue: { WIP: 'wip' }, focus: ['wip', 'cards'] },
      { nl: '{t:WIP-limiet|WIP-limiet}: een maximum per kolom of voor het hele systeem. Testen: hooguit {n:2}.', en: '{t:WIP limit|WIP limit}: a maximum per column or for the whole system. Test: at most {n:2}.', cue: { 'WIP-limiet': 'lim' }, focus: ['lim', 'colTest'] },
      { nl: '{t:Contextwisseling|Contextwisseling}: Weinberg, 1992: zo’n {n:20}% per extra project. Een schatting.', en: '{t:Context switching|Context switching}: Weinberg, 1992: about {n:20}% per extra project. An estimate.', cue: { Contextwisseling: 'switch' }, focus: ['switch', 'team'] },
      { nl: 'Belangrijker: elk item ligt langer stil. Iedereen druk, de klant wacht.', en: 'More important: each item sits idle longer. Everyone busy, the customer waits.', focus: ['idle', 'cards'] },
    ]),
    sc('s5', WI, 2, { nl: 'Kolom vol: help afmaken', en: 'Column full: help finish' }, [
      { nl: 'Kolom vol? Niets nieuws pakken: help rechts afmaken. Dat is {t:Swarming|swarming}.', en: 'Column full? Pick nothing new: help finish further right. That is {t:Swarming|swarming}.', cue: { Swarming: 'swarm' }, focus: ['swarm', 'helper'] },
      { nl: 'Een ontwikkelaar helpt testen. Onwennig, niet je eigen werk, maar het team levert meer.', en: 'A developer helps test. It feels odd, not your own work, but the team delivers more.', focus: ['own', 'helper'] },
      { nl: 'Startgetal: ongeveer het aantal mensen in de stap, of iets minder. Dan bijstellen.', en: 'Starting number: about the number of people in the step, or a few fewer. Then adjust.', focus: ['startn', 'board'] },
      { nl: 'Lean: een supermarkt of vaste buffer. Waar werk zich ophoopt, zit de bottleneck.', en: 'Lean: a supermarket or a fixed buffer. Where work piles up is the bottleneck.', focus: ['buffer', 'colBuild'] },
      { nl: 'Fouten: oprekken bij drukte; per persoon, niet per stap; geen afspraak als het vol zit.', en: 'Mistakes: stretching when busy; per person, not per step; no agreement for a full column.', focus: ['errs', 'colBuild'] },
      { nl: 'Discussie: één limiet voor het hele systeem. Vraag: wat doe jij als de volgende kolom vol zit?', en: 'Debate: one limit for the whole system. Ask: what do you do when the next column is full?', focus: ['sys', 'board'] },
    ]),
    sc('s6', WI, 2, { nl: 'Voorbeeld: de zuivelfabriek', en: 'Example: the dairy plant' }, [
      { nl: 'Zuivelfabriek, IT-team van {n:5}: {n:15} items onderhanden, {n:3} per persoon, {n:6} weken per wens.', en: 'Dairy plant, IT team of {n:5}: {n:15} items in progress, {n:3} each, {n:6} weeks per request.', focus: ['dairy', 'cards'] },
      { nl: 'WIP-limieten: bouwen hooguit {n:4}, testen hooguit {n:2}.', en: 'WIP limits: build at most {n:4}, test at most {n:2}.', focus: ['lims', 'colBuild', 'colTest'] },
      { nl: 'Week {n:1}: testen vol. Een vijfde in bouwen? Nee: hij helpt testen. Eén item klaar.', en: 'Week {n:1}: test full. A fifth in build? No: he helps test. One item done.', focus: ['week1', 'helper', 'colTest'] },
      { nl: 'Na {n:6} weken: {n:6} tegelijk in plaats van {n:15}; een wens duurt zo’n {n:2.5} week.', en: 'After {n:6} weeks: {n:6} at once instead of {n:15}; a request takes about {n:2.5} weeks.', focus: ['after6', 'weeks'] },
    ]),
    sc('s7', FM, 3, { nl: 'Vier flowmaten', en: 'Four flow measures' }, [
      { nl: 'Kanban Guide: vier flowmaten. WIP, en {t:Throughput|throughput}: items af per week.', en: 'Kanban Guide: four flow measures. WIP, and {t:Throughput|throughput}: items done per week.', cue: { Throughput: 'tp' }, focus: ['tp', 'colDone'] },
      { nl: '{t:Work item age|Work item age}: hoe lang een onaf item al onderweg is.', en: '{t:Work item age|Work item age}: how long an unfinished item has been under way.', cue: { 'Work item age': 'age' }, focus: ['age', 'cards'] },
      { nl: '{t:Cycle time|Cycle time}: begin tot klaar van een afgerond item, zoals je dat afsprak.', en: '{t:Cycle time|Cycle time}: start to finish of a completed item, as you agreed them.', cue: { 'Cycle time': 'ct' }, focus: ['ct', 'clock', 'cards'] },
      { nl: 'Valkuil: in Lean is cyclustijd de tijd per stuk op een station, zoals {n:45} seconden.', en: 'Trap: in Lean, cycle time is the time per unit at one station, such as {n:45} seconds.', focus: 'trap' },
      { nl: '{t:Lead time|Lead time}: vanaf de aanvraag van de klant, met wachten vooraf. Spreek af wat je bedoelt.', en: '{t:Lead time|Lead time}: from the customer’s request, waiting included. Agree what you mean.', cue: { 'Lead time': 'lt' }, focus: ['lt', 'wait'] },
    ]),
    sc('s8', FM, 3, { nl: 'De wet van Little', en: 'Little’s law' }, [
      { nl: '{t:Wet van Little|Wet van Little}, John Little 1961: gemiddelde cycle time = WIP ÷ throughput.', en: '{t:Little’s law|Little’s law}, John Little 1961: average cycle time = WIP ÷ throughput.', cue: { 'Wet van Little': 'little' }, focus: 'little' },
      { nl: '{n:12} onderhanden, {n:3} per week af: gemiddeld {n:12} ÷ {n:3} = {n:4} weken.', en: '{n:12} in progress, {n:3} a week done: on average {n:12} ÷ {n:3} = {n:4} weeks.', focus: ['ex12', 'cards', 'weeks'] },
      { nl: 'Halveer de WIP bij gelijke throughput: de gemiddelde cycle time halveert.', en: 'Halve the WIP at equal throughput: the average cycle time halves.', focus: ['half', 'cards'] },
      { nl: 'Voorwaarde: stabiel. Wat binnenkomt gaat eruit; de WIP aan begin en eind ongeveer gelijk.', en: 'Condition: stable. What comes in goes out; WIP about equal at start and end.', focus: ['stable', 'colTodo', 'colDone'] },
      { nl: 'Vacanti: een verband tussen gemiddelden achteraf, geen voorspelmachine.', en: 'Vacanti: a relation between averages after the fact, not a forecasting machine.', focus: 'vacanti' },
      { nl: 'Fout: alleen het gemiddelde. Kijk naar de spreiding. Waar begint en eindigt de klok?', en: 'Mistake: only the average. Look at the spread. Where does the clock start and stop?', focus: ['spread', 'clock'] },
    ]),
    sc('s9', FM, 3, { nl: 'Voorbeeld: de meubelfabriek', en: 'Example: the furniture maker' }, [
      { nl: 'Kantoormeubelen, {n:8} weken gemeten: {n:12} onderhanden, {n:3} per week uit en {n:3} binnen.', en: 'Office furniture, {n:8} weeks measured: {n:12} in progress, {n:3} a week out and {n:3} in.', focus: ['furn', 'weeks', 'cards'] },
      { nl: '{n:12} ÷ {n:3} = {n:4} weken; gemeten {n:4.2}. De plantmanager: te lang voor kleine wensen.', en: '{n:12} ÷ {n:3} = {n:4} weeks; measured {n:4.2}. The plant manager: too long for small requests.', focus: ['calc4', 'clock'] },
      { nl: 'WIP-limiet {n:6}, nog steeds {n:3} per week af: {n:6} ÷ {n:3} = {n:2} weken, de helft.', en: 'WIP limit {n:6}, still {n:3} a week done: {n:6} ÷ {n:3} = {n:2} weeks, half.', focus: ['calc2', 'cards'] },
      { nl: 'Bewaak: de throughput blijft {n:3} per week; geen werk stiekem buiten het bord om.', en: 'Watch: throughput stays at {n:3} a week; no work slipping past the board.', focus: ['watch', 'board'] },
      { nl: 'Meer dan {n:3} per week binnen? De rij vóór het bord groeit: dat zie je in de lead time.', en: 'More than {n:3} a week coming in? The queue before the board grows: it shows in lead time.', focus: ['queue', 'wait'] },
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
// (nl_NL-alex, 2026-11-13). Read as written: Kanban, kanbanbord, werkitem,
// swarming, contextwisseling, geblokkeerd, andon, goudmijn, pullsysteem with
// the poel rule below, testomgeving, machinebouwer, klantspecificatie,
// zuivelfabriek, supermarktvoorraad, bottleneck, voorspelmachine, Little (as
// "littel"), WIP as letters (wee-ie-pee; W I P in English); espeak-ng reads
// it as the word "wip" only right before a comma, so no line puts one there, Toyota
// through pm.land.training's Tojota rule, Gerald Weinberg through
// pm.portfolio.prioritise's rule, Lean-consultant through pm.run.conflict's.
// New SAY rules in films/_kit/timeline.mjs (tested; recomputed for every film:
// no other film's spoken text changes): Taiichi Ohno (Taitsjie Oono), David
// Anderson and John Little as their English names (Deevid Enderson, Djon),
// Vacanti (Va-kenti), the Kanban Guide (Gaid, as the Scrum Guide), Definition
// of Workflow (Deffi-nisjun of Wurkflo), throughput (Troepoet), cycle time
// (Saikl taim), lead time (Lied taim), work item age (Wurk aitem eetsj), pull
// as the Dutch say it (poel), flowmaten (floo-maten), "afdeling engineering"
// (entsjinieering), engineer as pm.consult.proposal's entsjinier in this
// film's two phrases, and onderhanden split as pm.portfolio.prioritise does
// (onder-handen) in this film's phrases only. Said around because espeak-ng
// misreads them (they stay in the captions and on the cards): whiteboard
// ("whie-te-board"), plantmanager (MAA-naa-gher: the voice drops the plant
// manager and keeps "te lang voor kleine wensen"), work in progress (a Dutch
// g: said "begonnen maar niet af"), vuistregel (stressed -GEL: said
// "schatte"), Weinberg alone (said with Gerald, the existing rule). Years in
// words. Card-only points (each on screen at least 4 s): Anderson's book of
// 2010, "niet zoals op papier", "ook naast Scrum", "geen voorraad", "niemand weet wat er loopt", the second engineer of
// the check, the missing customer specification, the factory's same relation
// for Little's law, "minder WIP: korter" and "meet na 4 weken".
const SAY = [
  [ // s1 from Toyota to knowledge work
    { nl: 'Kanban komt uit het Toyota-productiesysteem van Taiichi Ohno: een kaart bij een bak onderdelen.',
      en: 'Kanban comes from Taiichi Ohno\'s Toyota Production System: a card with a bin of parts.' },
    { nl: 'Bak leeg? De kaart gaat terug: maak bij. Verbruik trekt de productie aan: pull, geen overproductie.',
      en: 'Bin empty? The card goes back: make more. Consumption pulls production: no overproduction.' },
    { nl: 'In kenniswerk maakt Kanban de stroom van werk zichtbaar en stuurbaar; David Anderson maakte het bekend.',
      en: 'In knowledge work Kanban makes the flow of work visible and steerable; David Anderson made it known.' },
    { nl: 'De Kanban Guide noemt {t:Kanban|Kanban} een strategie om de stroom van waarde te optimaliseren, visueel en met pull.',
      en: 'The Kanban Guide calls {t:Kanban|Kanban} a strategy to optimise the flow of value, visual and pull-based.' },
  ],
  [ // s2 the board
    { nl: 'Het {t:Kanbanbord|kanbanbord} heeft een kolom per stap: te doen, analyse, bouwen, testen, klaar.',
      en: 'The {t:Kanban board|Kanban board} has a column per step: to do, analysis, build, test, done.' },
    { nl: 'Elk {t:Werkitem|werkitem}, een wens of een storing, is een kaart die naar rechts schuift.',
      en: 'Each {t:Work item|work item}, a request or a fault, is a card moving right.' },
    { nl: 'Begin waar je bent: teken het werk zoals het echt loopt. Geen vaste rollen of sprints.',
      en: 'Start where you are: draw the work as it really flows. No fixed roles or sprints.' },
    { nl: 'De {t:Definition of Workflow|Definition of Workflow} is de gedeelde afspraak: wat een item is, begin en klaar, stappen, limieten, regels en duur.',
      en: 'The {t:Definition of Workflow|Definition of Workflow} is the shared agreement: what an item is, start and done, steps, limits, rules, duration.' },
    { nl: 'Kan een kaart niet verder, dan is ze {t:Geblokkeerd|geblokkeerd}: een rode sticker. Die kaarten tonen waar het systeem hapert.',
      en: 'A card that can\'t move on is {t:Blocked|blocked}: a red sticker. These cards show where the system stutters.' },
    { nl: 'Voor jou als Lean-consultant: een visueel managementbord, en een geblokkeerde kaart is een andon.',
      en: 'For you as a Lean consultant: visual management, and a blocked card is an andon.' },
  ],
  [ // s3 the honest difference, and the machine builder
    { nl: 'Een eerlijk verschil: bij Toyota een standaardonderdeel, hier is elk item anders. De kaart beschrijft werk.',
      en: 'An honest difference: at Toyota a standard part, here every item differs. The card describes work.' },
    { nl: 'Typische fout: kaarten zonder grens. Dan is het een takenlijst, nog geen pullsysteem.',
      en: 'Typical mistake: cards with no limit. Then it is a to-do list, not yet a pull system.' },
    { nl: 'Voorbeeld: bij een machinebouwer heeft de afdeling engineering veertig losse post-its.',
      en: 'Example: a machine builder\'s engineering department has forty loose sticky notes.' },
    { nl: 'De kolommen zoals het echt loopt: aangevraagd, ontwerp, controle, wacht op klant, vrijgegeven.',
      en: 'Columns as the work really flows: requested, design, check, waiting for customer, released.' },
    { nl: 'Na een uur hangen alle veertig. Twaalf in ontwerp, negen wachten op de klant, zes daarvan al langer dan drie weken.',
      en: 'An hour later all forty are up: twelve in design, nine waiting for the customer, six for over three weeks.' },
    { nl: 'Vier zijn geblokkeerd. Begonnen: een engineer pakt de kaart; klaar: de tekening is vrijgegeven.',
      en: 'Four are blocked. Started: an engineer takes the card; done: the drawing is released.' },
  ],
  [ // s4 WIP and the limit
    { nl: '{t:WIP|WIP} is begonnen maar niet af; in de fabriek heet dat onderhanden werk. Het kost geld, verbergt problemen en vertraagt.',
      en: '{t:WIP|WIP} is work in progress: started, not done, as in the factory. It costs money, hides problems, slows things.' },
    { nl: 'Een {t:WIP-limiet|WIP-limiet} is een maximum per kolom of voor het hele systeem, zoals testen hooguit twee. Vol? Dan niets nieuws: dat is pull.',
      en: 'A {t:WIP limit|WIP limit}: a maximum per column or for the whole system, such as test at most two. Full? Nothing new: that is pull.' },
    { nl: 'Vijf dingen tegelijk is schakelen, en {t:Contextwisseling|contextwisseling} kost tijd. Gerald Weinberg schatte zo\'n twintig procent per extra project.',
      en: 'Five things at once means switching, and {t:Context switching|context switching} costs time. Gerald Weinberg estimated about twenty percent per extra project.' },
    { nl: 'Erger: elk item ligt langer stil. Iedereen druk, de klant wacht.',
      en: 'Worse: each item sits idle longer. Everyone is busy; the customer waits.' },
  ],
  [ // s5 column full: help finish
    { nl: 'Zit een kolom vol? Pak niets nieuws, maar help rechts afmaken: {t:Swarming|swarming}, samen één item.',
      en: 'Column full? Pick nothing new; help finish further right: {t:Swarming|swarming}, one item together.' },
    { nl: 'Een ontwikkelaar helpt testen; een engineer doet de controle voor een collega. Onwennig, maar het team levert meer.',
      en: 'A developer helps test; an engineer does a colleague\'s check. Odd, but the team delivers more.' },
    { nl: 'Het startgetal: ongeveer het aantal mensen in de stap, of iets minder, en dan bijstellen.',
      en: 'The starting number: about the people in the step, or a few fewer, then adjust.' },
    { nl: 'Voor jou: een supermarkt of vaste buffer. Het werk hoopt zich op bij de bottleneck.',
      en: 'For you: a supermarket or a fixed buffer. Work piles up at the bottleneck.' },
    { nl: 'Fouten: limieten oprekken bij drukte, per persoon in plaats van per stap, en geen afspraak als een kolom vol zit.',
      en: 'Mistakes: stretching limits when busy, limits per person, not per step, and no rule for a full column.' },
    { nl: 'Sommigen kiezen één limiet voor het hele systeem. Vraag: wat doe jij als de volgende kolom vol zit?',
      en: 'Some use one limit for the whole system. Ask: what do you do when the next column is full?' },
  ],
  [ // s6 the dairy plant
    { nl: 'Voorbeeld: een IT-team van vijf bij een zuivelfabriek, met vijftien werkitems onderhanden. Een wens duurt zes weken.',
      en: 'Example: an IT team of five at a dairy plant, fifteen work items in progress. A request takes six weeks.' },
    { nl: 'Limieten: bouwen hooguit vier, testen hooguit twee.',
      en: 'Limits: build at most four, test at most two.' },
    { nl: 'Week één: testen zit vol. Een vijfde in bouwen? Nee: de ontwikkelaar helpt testen, en een item is dezelfde dag klaar.',
      en: 'Week one: test is full. A fifth in build? No: the developer helps test; an item is done that day.' },
    { nl: 'Na zes weken: zes tegelijk in plaats van vijftien, en een wens duurt zo\'n tweeënhalve week.',
      en: 'After six weeks: six at once, not fifteen, and a request takes about two and a half weeks.' },
  ],
  [ // s7 four flow measures
    { nl: 'De Kanban Guide noemt vier flowmaten. Eerst de WIP en de {t:Throughput|throughput}: hoeveel items er per week afkomen.',
      en: 'The Kanban Guide names four flow measures. First WIP and {t:Throughput|throughput}: how many items finish per week.' },
    { nl: 'De {t:Work item age|work item age}: hoe lang een onaf item al onderweg is.',
      en: '{t:Work item age|Work item age}: how long an unfinished item has been under way.' },
    { nl: 'En de {t:Cycle time|cycle time}: begin tot klaar van een afgerond item, volgens je Definition of Workflow.',
      en: 'And {t:Cycle time|cycle time}: start to finish of a completed item, as your Definition of Workflow sets them.' },
    { nl: 'Valkuil: in Lean is cyclustijd de tijd per stuk op een station, zoals vijfenveertig seconden. Kanban bedoelt wat de fabriek doorlooptijd noemt.',
      en: 'A trap: in Lean, cycle time is the time per unit at a station, say forty-five seconds. Kanban means what a factory calls throughput time.' },
    { nl: 'Met {t:Lead time|lead time} bedoelen veel teams de tijd vanaf de aanvraag, wachten inbegrepen. Spreek af welke je bedoelt.',
      en: 'Many teams mean by {t:Lead time|lead time} the time from the request, waiting included. Agree which you mean.' },
  ],
  [ // s8 Little's law
    { nl: 'De {t:Wet van Little|wet van Little}, John Little, negentienhonderdeenenzestig: gemiddelde cycle time is gemiddelde WIP gedeeld door gemiddelde throughput.',
      en: '{t:Little’s law|Little\'s law}, John Little, 1961: average cycle time is average WIP divided by average throughput.' },
    { nl: 'Twaalf items onderhanden, drie per week af: gemiddeld vier weken. Het geldt voor gemiddelden, niet voor één item.',
      en: 'Twelve items in progress, three a week done: four weeks on average. It holds for averages, not for one item.' },
    { nl: 'Halveer de WIP bij gelijke throughput, en de gemiddelde cycle time halveert. Daarom werken WIP-limieten.',
      en: 'Halve the WIP at equal throughput, and the average cycle time halves. That is why WIP limits work.' },
    { nl: 'Voorwaarde: stabiel. Wat binnenkomt gaat er gemiddeld uit, en de WIP blijft ongeveer gelijk. Een groeiende stapel breekt het.',
      en: 'Condition: stable. What comes in goes out, on average; WIP stays about level. A growing pile breaks it.' },
    { nl: 'Vacanti benadrukt: een verband tussen gemiddelden achteraf, geen voorspelmachine.',
      en: 'Vacanti stresses: a relation between averages after the fact, not a forecasting machine.' },
    { nl: 'Lean en Kanban lijken hier het meest op elkaar. Fout: alleen het gemiddelde. Kijk naar de spreiding: waar begint en eindigt de klok?',
      en: 'Lean and Kanban are most alike here. Mistake: only the average. Look at the spread: where does the clock start and stop?' },
  ],
  [ // s9 the office-furniture example
    { nl: 'Voorbeeld: een meubelfabrikant meet acht weken. Gemiddeld twaalf onderhanden, drie per week uit en drie binnen: stabiel.',
      en: 'Example: a furniture maker measures eight weeks: twelve in progress, three a week out, three in: stable.' },
    { nl: 'Twaalf gedeeld door drie: vier weken. Gemeten vier komma twee, dat klopt. Maar voor kleine wensen te lang.',
      en: 'Twelve divided by three: four weeks. Measured four point two, a match. But too long for small requests.' },
    { nl: 'De WIP-limiet gaat naar zes, met nog steeds drie per week af: twee weken, de helft.',
      en: 'The WIP limit goes to six, still three a week done: two weeks, half.' },
    { nl: 'Bewaak wel: de throughput blijft drie per week, en geen werk loopt buiten het bord om.',
      en: 'But watch: throughput stays at three a week, and no work runs past the board.' },
    { nl: 'Meer dan drie per week binnen? De rij vóór het bord groeit: wachttijd in de lead time, niet in de cycle time.',
      en: 'More than three a week in? The queue before the board grows: waiting in lead time, not cycle time.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice, and none of the words espeak-ng misreads (see
// above; a WIP right before a comma is read as the word "wip"); checked on the text after the SAY rules, so a word a rule rewrites
// passes and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(\w*manager\w*|whiteboard|work in progress|vuistregel|Guide|Ohno|Anderson|Vacanti|Workflow|[Tt]hroughput|[Cc]ycle time|[Ll]ead time|[Ww]ork item age|pull\w*|flowmaten|engineer\w*|onderhanden|John|Lean-team|e-?mail|WIP(?=,))\b|(^|[.?!;]\s)Eén\b/,
  en: /\b(Ury|WIP(?=,))\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (lang === 'nl' && /\d/.test(said)) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
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
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > 300) throw new Error(`film is ${total} s, over 300 (words per scene ${said.join(' ')}, all ${all})`);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="team"],[data-cue="helper"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.5}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.9}
.pm-old{fill:var(--anatomy-mid);stroke:var(--anatomy-hi);stroke-width:.5}
.pm-red{fill:#D64545;stroke:none}
.pm-col{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
.pm-qd{fill:none;stroke:var(--anatomy-mid);stroke-width:.6;stroke-dasharray:2 1.6}
.pm-slot{fill:none;stroke:var(--anatomy-hi);stroke-width:.6}
.pm-slotbar{fill:var(--anatomy-shade-1);stroke:none}
.pm-full{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-old{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-col{fill:color-mix(in srgb,var(--fp-focus) 30%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1}
[data-cue][data-on] .pm-qd{stroke:var(--fp-accent);stroke-width:1}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een teamruimte. Aan de achterwand een kanbanbord met vijf kolommen, waarop kaartjes van links naar rechts schuiven; boven elke kolom een strook met de WIP-limiet als vakjes, die oplicht als de kolom vol zit; links van het bord een plek voor de rij wensen die nog wachten, rechts een klok. Aan de zijwand een strook van acht weken. Vooraan een bak onderdelen op een standaard met een kanbankaart, het origineel van Toyota, en drie teamleden, van wie één van de kolom bouwen naar de kolom testen loopt om te helpen. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: van Toyota naar kenniswerk; het bord, het werkitem, de Definition of Workflow en geblokkeerde kaarten; de machinebouwer met veertig post-its; WIP en de WIP-limiet; swarming en het startgetal; de zuivelfabriek; vier flowmaten; de wet van Little; en de fabrikant van kantoormeubelen.',
  en: 'A team room. On the back wall a kanban board with five columns, where cards move from left to right; above each column a strip with its WIP limit as slots, which lights up when the column is full; left of the board a place for the queue of requests still waiting, at the right a clock. On the side wall a strip of eight weeks. In front a parts bin on a stand with a kanban card, Toyota\'s original, and three team members, one of whom walks from the build column to the test column to help. At the right a panel with one card per scene, marked as example or diagram: from Toyota to knowledge work; the board, the work item, the Definition of Workflow and blocked cards; the machine builder with forty sticky notes; WIP and the WIP limit; swarming and the starting number; the dairy plant; four flow measures; Little\'s law; and the office-furniture maker.',
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

// Dev tool, not shipped. Builds the explainer film "Een PI-planning in twee
// dagen / A two-day PI planning" for the Projects course: pm.scaled.why,
// pm.scaled.piplanning and pm.scaled.roles (levels 1 to 3 of the topic
// SAFe-basis in Opschalen: SAFe en verder).
//
//   node films/pm.scaled.pi/build.mjs            build the page
//   node films/pm.scaled.pi/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.scaled.pi.html: one offline page with the
// anatomy kit, the stage script and the player inlined. A film that will be
// rendered to video (Merijn, 2026-11-12: render every reviewed pm film), so all
// stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.scaled.pi, P1, 140 s: SAFe basics, ART, PI planning, RTE, PO/PM; many
// teams, one room, the programme board filling, the confidence vote; and the
// beats: the ART as teams of teams; the RTE opens, the business context and
// vision, team breakouts writing objectives, the programme board fills with
// dependencies as red strings, risks ROAMed, the fist-of-five confidence vote).
// Storyboard drift: the plan's 140 s are about 300 s in nine scenes, because a
// lesson with a film no longer shows its worked example (v16 notes), so the
// film carries the teach text and the example of all three lessons: why scale
// and the train (s1 to s3), PI Planning (s4 to s6) and the roles (s7 to s9).
// The storyboard's beats are all there: many teams in one room (s1, s4), the
// ART as a team of teams (s2 b1), the RTE opening (s4 b1), the business
// context and vision (s4 b2), teams planning and writing objectives (s4 b3,
// b5), the board filling with red strings (s4 b3, s5 b1, b2), ROAM (s5 b3) and
// the confidence vote (s5 b4, b5). pm.scaled.configs (level 4: the four
// configurations) has its own terms and is not served.
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   why teach 1: one Scrum team ten people at most; a new packaging machine's
//     software needs more (s1 b1); the PLC controls, the operator screen, the
//     camera inspection, the ERP link (s1 b2), the PLC as the industrial
//     computer (card, s1 b2); six or seven teams on one product; each does
//     Scrum well and the whole stalls, team A waits for team B: a dependency
//     (s1 b3)
//   why teach 2: scaling, agreements so many teams deliver as one (s1 b4);
//     SAFe, first published 2011, version 6.0 from early 2023 (s1 b5), the
//     Scaled Agile Framework and Dean Leffingwell (card, s1 b5); an annual
//     survey, most used for years; not a sample (s1 b6), the State of Agile
//     survey of Digital.ai, interested respondents (card, s1 b6)
//   why teach 3: the Agile Release Train, ART, a team of agile teams (s2 b1);
//     50 to 125 people, long-lived (s2 b2); the train image: fixed departures,
//     not ready goes on the next (s2 b3); the work comes to the train, no new
//     team per project (card, s2 b3)
//   why teach 4: cadence, the fixed rhythm in which all teams plan, build and
//     deliver at once (s2 b4); the Planning Interval, PI, 8 to 12 weeks (s2
//     b5), until 6.0 Program Increment (card, s2 b5); iterations of 2 weeks,
//     the last the IP iteration, for improving and planning (s2 b6),
//     Innovation and Planning (card, s2 b7)
//   why teach 5: for a Lean consultant like takt on a line; integrate and test
//     together every two weeks (s2 b7), not only at the end (card, s2 b7); the
//     question which teams must deliver something that works together: that is
//     the train (s2 b8), not always the org chart (card, s2 b8)
//   why example: a machine builder, 72 people on a new line's software, teams
//     of 9 (s3 b1); 72 / 9 = 8 teams, within 50 to 125, one ART (s3 b2); a
//     10-week PI, 2-week iterations, 10 / 2 = 5: 4 to build, 1 IP (s3 b3);
//     52 / 10 = 5.2, about 5 times a year all 8 teams plan together (s3 b4)
//   piplanning teach 1: PI Planning, an event that aligns the whole train, usually two
//     days, ideally one room, in the IP iteration (s4 b1), so no build time
//     lost (card, s4 b1); day 1 the business context and the vision, what and
//     why (s4 b2); teams make a first plan per iteration with their own
//     capacity (s4 b3)
//   piplanning teach 2: end of day 1 the leaders look where capacity or
//     priorities pinch; day 2 adjust and present (s4 b4), the name management
//     review and problem solving (caption and card, s4 b4); PI objectives,
//     short goals in business language, the one-tap stoppage report (s4 b5);
//     unsure goals apart as uncommitted, in the plan, not a promise (s4 b6)
//   piplanning teach 3: the Business Owners, business-accountable, a business
//     value of 1 to 10 per objective (s4 b7), for example a director (card, s4
//     b7); value 9 before value 3 when time is tight (s4 b8)
//   piplanning teach 4: the ART Planning Board, teams in rows, iterations in
//     columns (s5 b1), formerly program board (card, s5 b1); a red string from
//     team A's work to team B that waits for it (s5 b2); ROAM: resolved, owned,
//     accepted, mitigated (s5 b3)
//   piplanning teach 5: the confidence vote, one to five fingers on how
//     feasible the plan is (s5 b4); a rule of thumb from training material: an
//     average of three or more is enough, lower means plan again; who shows one
//     or two gets the floor (s5 b5); an obeya (Japanese for big room); the pitfall: the board full
//     and nobody says it does not fit (s5 b6), "at scale" (caption and card)
//   piplanning example: a machine builder's team, 4 build iterations of 30
//     story points (a relative measure): 4 x 30 = 120 (s6 b1); 20 % free for
//     unplanned work and breakdowns: 120 x 0.8 = 96 (s6 b2); the objectives:
//     one-tap stoppage report 40 points, value 9; report per shift 35, value 6
//     (s6 b3); link with the new MES 30, value 7; together 105, not in 96 (s6
//     b4); the link uncommitted; committed 40 + 35 = 75, room for overrun (s6 b5)
//   roles teach 1: the Release Train Engineer, RTE, a servant leader and coach
//     of the train (s7 b1); facilitates the events, removes impediments, steers
//     on flow (s7 b2), PI Planning among them (card, s7 b2); no boss handing
//     out tasks; often a former programme manager, a known pitfall (s7 b3)
//   roles teach 2: Product Management decides which solutions are desirable,
//     feasible and viable (s7 b4); orders the ART Backlog, the features of the
//     whole train (s7 b5); a feature fits in one PI and has value for a user
//     (s7 b6); the Product Owner with one team, features into user stories (s7
//     b7), orders the team's backlog (card, s7 b7)
//   roles teach 3: Product Management market and customer, the PO team and
//     details (s8 b1); content authority, work closely, a clash in the room is
//     seen by all (card, s8 b1); the System Architect, technical coherence,
//     architecture, interfaces (s8 b2), enablers (card, s8 b2)
//   roles teach 4: a Scrum Master per team, also Team Coach in 6.0; the
//     Business Owners steer the business side (s8 b3); names: a product
//     manager at a machine builder often does marketing and sales, no SAFe
//     role (s8 b4)
//   roles teach 5: a strong PO has mandate and time; one day a week and teams
//     guess (s8 b5); the question: team 3 and Product Management disagree, who
//     decides and how fast (s8 b6); nobody knows, the org chart is only on
//     paper (card, s8 b6)
//   roles example (faded): a weighing-systems maker, a train of six teams, a
//     week of looking (s9 b1); the RTE, a former project manager, tasks on
//     Monday, a check on Friday (s9 b2); Product Management one person with a
//     sales job besides (account manager on the caption and card), the ART
//     Backlog nine months old (s9 b3); three of six teams share one PO, two
//     afternoons a week; the ask (s9 b4); the reveal: the RTE steers on tasks,
//     so teams do not learn to plan; Product Management without time, no real
//     ordering (card); the PO too thin, teams guess (s9 b5); the proposal:
//     coach the RTE, free up Product Management, a PO per team with mandate
//     (s9 b6), and time, or fewer teams at once (card, s9 b6)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts checked (2026-11-13) against the Scaled Agile Framework's own pages
// (framework.scaledagile.com, SAFe 6.0): the ART as "a long-lived team of
// Agile teams" of "generally 50-125 people", with Product Management, the
// System Architect, the RTE and Business Owners as its key roles (Agile
// Release Train); the PI "a timebox of 8-12 weeks", "four or five development
// iterations" and one Innovation and Planning (IP) iteration (Planning
// Interval); PI Planning "typically a 2-day event for the entire ART", in the
// IP iteration, with an "ART planning board" of features and dependencies
// (PI Planning); PI objectives "committed or uncommitted" (PI Objectives); the
// RTE a "servant leader and ART coach who facilitates ART events", "manages
// impediments" and "helps optimize flow" (Release Train Engineer); Product
// Management for "desirable, viable, feasible" solutions and the ART backlog
// (Product Management). Taken from the lessons and SAFe's longer articles
// (behind a login, not re-read here): business value 1 to 10 from the Business
// Owners, ROAM, the fist-of-five vote and content authority. The threshold of
// three is kept as the lesson's "rule of thumb from training material": the
// sources found disagree on it (fewer than three, or two or fewer). The
// rename from Program Increment (2023, SAFe 6.0), Dean Leffingwell, 2011, and
// the State of Agile survey are the lesson's, with its caveat (interested
// respondents, not a sample). The film claims no more for SAFe than the
// lesson does; its critique has its own lesson (pm.scaled.critique). The
// packaging machine, the machine builder, the one-tap stoppage report and the
// weighing-systems maker are the lessons' own examples.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): one
// big room for the whole train. On the back wall the ART Planning Board: six
// team rows, five columns (four iterations and the hatched IP iteration), a
// ROAM corner with four risk notes; feature cards fill it per beat and red
// strings join a card to the one that waits for it. On the side wall a strip of
// five iterations, the last hatched (the IP iteration). In the room three team
// tables with the team figures (pm.agile.scrum's cast.mjs, imported, not
// edited: Developers, a Product Owner with a tablet, a Scrum Master as the
// RTE, a Developer with a laptop as the System Architect), and the pm cast's
// sponsor (the Business Owner) and planner (Product Management), standing at
// the right. A panel at the right, in stage space, carries one card per
// scene, labelled "schema" or "voorbeeld"; the train, the fingers of the vote
// and the board's rows are drawn on it.
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the board, its grid,
// its cards, the strings, the ROAM corner, the highlighted row, the iterations
// strip and each person or group of people.
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
const WH = 'pm.scaled.why';
const PP = 'pm.scaled.piplanning';
const RO = 'pm.scaled.roles';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(WH, ['Eén Scrum-team telt meestal hooguit tien mensen', 'de software van een nieuwe verpakkingsmachine vraagt vaak meer',
  'de PLC-besturing (Programmable Logic Controller, de industriële computer die de machine aanstuurt), het bedieningsscherm, de camerakeuring en de koppeling met het ERP',
  'Dan werk je met zes, zeven teams aan één product. Elk team kan prima Scrum doen en toch loopt het geheel vast, omdat team A wacht op werk van team B',
  'afspraken waarmee veel teams als één geheel leveren', 'SAFe, het Scaled Agile Framework van Dean Leffingwell, voor het eerst gepubliceerd in 2011. De huidige versie is 6.0, uit begin 2023',
  'State of Agile-enquête, uitgegeven door de softwareleverancier Digital.ai, komt SAFe al jaren als meest gebruikte opschaalaanpak naar voren',
  'dat is een enquête onder belangstellenden, geen steekproef van alle bedrijven',
  'een team van agile teams dat lang bij elkaar blijft en samen één of meer producten ontwikkelt en levert. Volgens SAFe telt een ART meestal 50 tot 125 mensen',
  'Hij vertrekt op vaste tijden; wat niet klaar is, gaat mee met de volgende', 'het werk komt naar de trein toe, niet andersom: je bouwt geen nieuw team per project',
  'het vaste ritme waarin alle teams tegelijk plannen, bouwen en opleveren', 'Planning Interval (PI), volgens SAFe 8 tot 12 weken. Tot versie 6.0 heette dat Program Increment; de afkorting PI bleef',
  'iteraties (korte rondes, meestal van 2 weken) met als laatste de IP-iteratie, de Innovation and Planning-iteratie: tijd voor verbeteren, vernieuwen en het plannen van de volgende PI',
  'net als takt op een lijn, en alle teams synchroniseren erop', 'elke twee weken samen integreren en testen, in plaats van pas aan het eind',
  '“Welke teams moeten samen opleveren om de klant iets werkends te geven?” Dat is je trein, en die valt lang niet altijd samen met het organigram',
  'Een machinebouwer heeft 72 mensen op de software van een nieuwe lijn: besturing, schermen, camerakeuring, ERP-koppeling en testen. Ze werken in teams van 9',
  '72 / 9 = 8 teams. De grootte valt binnen 50 tot 125 mensen, dus dit past in één ART', 'ze kiezen een PI van 10 weken. Met iteraties van 2 weken zijn dat 10 / 2 = 5 iteraties: 4 om te bouwen en 1 IP-iteratie',
  '52 / 10 = 5,2, dus zo’n 5 PI’s, en daarmee 5 momenten waarop alle 8 teams samen opnieuw plannen']);
says(PP, ['een event voor de hele trein dat teams en belanghebbenden op één lijn brengt, meestal in twee dagen, liefst in één zaal. Het valt in de IP-iteratie, zodat het geen bouwtijd kost',
  'Dag 1 begint met de bedrijfscontext en de visie: wat moet het product de komende periode kunnen, en waarom?', 'een eerste plan, per iteratie, met hun eigen capaciteit',
  'bekijkt het management de conceptplannen: waar is te weinig capaciteit, waar botsen prioriteiten? Dat heet management review and problem solving. Op dag 2 passen teams hun plannen aan en presenteren ze',
  'korte doelen in zakelijke taal, zoals “operator kan een storing met één tik melden”', 'worden apart gezet als uncommitted: ze tellen mee in de planning, maar zijn geen belofte',
  'de managers die zakelijk verantwoordelijk zijn voor wat de trein oplevert, bijvoorbeeld de directeur operations of een productmanager', 'een zakelijke waarde, op een schaal van 1 tot 10',
  'Een objective met waarde 9 gaat voor één met waarde 3 als de tijd krap wordt', 'een groot bord met de teams in rijen en de iteraties in kolommen',
  'Een rode draad verbindt het werk van team A met het werk van team B dat erop wacht. Vóór SAFe 6.0 heette dit het program board',
  'Resolved (opgelost), Owned (iemand neemt het op zich), Accepted (we leven ermee) of Mitigated (we verkleinen het)',
  'iedereen stemt met één tot vijf vingers hoe zeker hij is dat het plan haalbaar is', 'Een veelgebruikte vuistregel uit trainingsmateriaal: gemiddeld drie of hoger is genoeg, lager betekent opnieuw plannen. Wie één of twee steekt, krijgt het woord',
  'dit is een obeya (Japans voor “grote kamer”', 'De valkuil: het bord hangt vol en niemand durft nog te zeggen dat het niet past',
  'Het heeft 4 bouw-iteraties en haalt gemiddeld 30 punten per iteratie (story points: een relatieve maat voor omvang). Capaciteit: 4 × 30 = 120 punten',
  'zo’n 20% vrij voor onverwacht werk en storingen: 120 × 0,8 = 96 punten', '“storing melden met één tik” (40 punten, waarde 9 van de Business Owner), “rapport per ploeg” (35 punten, waarde 6) en “koppeling met nieuw MES” (30 punten, waarde 7). Samen 105 punten: past niet in 96',
  'Het team zet de koppeling als uncommitted. Committed: 40 + 35 = 75 punten, met ruimte voor uitloop']);
says(RO, ['een dienend leider (servant leader) en coach van de trein: hij of zij begeleidt PI Planning en de andere events, haalt obstakels weg en stuurt op flow',
  'De RTE is geen projectmanager die taken uitdeelt en ook niet de baas van de teams. In de praktijk wordt de rol vaak ingevuld door een voormalige programmamanager, en dat is meteen een bekende valkuil',
  'welke oplossingen gewenst, haalbaar en levensvatbaar zijn. Zij beheren en ordenen de ART Backlog: de lijst met features voor de hele trein',
  'Een feature is een stuk functionaliteit dat in één PI past en waarde heeft voor een gebruiker', 'De Product Owner (PO) zit bij één team. Hij vertaalt features naar kleinere user stories (korte beschrijvingen van wat een gebruiker wil) en ordent de backlog van zijn team',
  '(content authority): Product Management kijkt naar markt en klant, de PO naar het team en de details', 'als ze elkaar tegenspreken in de zaal, ziet iedereen dat',
  'De System Architect bewaakt de technische samenhang: welke architectuur, welke interfaces, welke technische voorbereiding (enablers) is nodig voordat features kunnen?',
  'Scrum Master, in SAFe 6.0 Scrum Master/Team Coach genoemd', 'sturen vanuit de zakelijke kant', 'Een “productmanager” in een machinebouwbedrijf is vaak iemand met marketing- en commerciële taken, geen SAFe-rol',
  'een sterke PO heeft echt mandaat en tijd. Als de PO één dag per week beschikbaar is naast een volle andere baan, gaan teams zelf gokken wat belangrijk is',
  '“Als team 3 en Product Management het oneens zijn over wat eerst moet, wie hakt dan de knoop door, en hoe snel?” Als niemand dat weet, staat het organigram alleen op papier',
  'Een producent van weegsystemen heeft een trein van zes teams', 'De RTE, een oud-projectmanager, maakt elke maandag een takenlijst per team en controleert die vrijdag',
  'Product Management bestaat uit één persoon die ook accountmanager is; de ART Backlog is negen maanden niet bijgewerkt', 'Drie van de zes teams hebben dezelfde PO, die twee middagen per week beschikbaar is',
  'De RTE stuurt op taken in plaats van te coachen en obstakels weg te halen; de teams leren zo niet zelf plannen', 'Product Management heeft geen tijd, dus de ART Backlog is geen echte ordening meer',
  'één PO voor drie teams, twee middagen per week, is te dun: teams gaan zelf gokken', 'de RTE coachen op zijn rol, Product Management vrijmaken of versterken, en per team een PO met echt mandaat en tijd, of anders minder teams tegelijk laten werken']);
says(WH, ['Dean Leffingwell, first published in 2011', 'Digital.ai', '50 to 125 people'], 'en');
says(PP, ['management review and problem solving', 'Before SAFe 6.0 this was called the program board', 'A common rule of thumb from training material'], 'en');
says(RO, ['servant leader and coach of the train', 'SAFe calls that split content authority', 'weighing systems'], 'en');
assert(lessons.nl.get(WH).terms.map((t) => t.term).join() === 'Afhankelijkheid,SAFe,Agile Release Train,Cadans,Planning Interval,IP-iteratie', 'the six terms of why');
assert(lessons.nl.get(PP).terms.map((t) => t.term).join() === 'PI Planning,PI-objectives,Business Owners,ART Planning Board,ROAM,Confidence vote', 'the six terms of piplanning');
assert(lessons.nl.get(RO).terms.map((t) => t.term).join() === 'Release Train Engineer,Product Management,ART Backlog,Feature,Product Owner,System Architect', 'the six terms of roles');
for (const id of [WH, PP, RO]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.scaled.pi', `no other film is wired to ${id}`);
// the sums the film shows
const MB = { people: 72, team: 9, pi: 10, it: 2, year: 52 };
assert(MB.people / MB.team === 8 && MB.people / MB.team * MB.team >= 50 && MB.people <= 125, 'machine builder: 8 teams, one ART');
assert(MB.pi / MB.it === 5 && MB.pi / MB.it - 1 === 4 && MB.year / MB.pi === 5.2, 'machine builder: 5 iterations, 4 to build; 5.2 PIs a year');
const TEAM = { its: 4, vel: 30, free: 0.2, obj: [40, 35, 30] };
const capTeam = TEAM.its * TEAM.vel;
const planable = Math.round(capTeam * (1 - TEAM.free));
assert(capTeam === 120 && planable === 96, 'team: 120 points, 96 to plan');
assert(TEAM.obj.reduce((a, b) => a + b, 0) === 105 && 105 > planable && TEAM.obj[0] + TEAM.obj[1] === 75 && 75 <= planable, 'team: 105 does not fit, 75 committed');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 64;
const ROOM = { w: 420, d: 300, h: 240 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 8, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the ART Planning Board on the back wall: six team rows, four iterations and
// the IP iteration, and a ROAM corner at the right
const BOARD = w.board({ x0: 30, x1: 318, z0: 96, z1: 228 });
const BA = BOARD.area;
const ROWS = 6;
const GR = { x0: r1(BA.x0 + 14), x1: r1(BA.x1 - 52), top: r1(-BA.z1 + 13), bot: r1(-BA.z0 - 2) };
const CW = r1((GR.x1 - GR.x0) / 5);
const RH = r1((GR.bot - GR.top) / ROWS);
const colX = (c) => r1(GR.x0 + c * CW);
const rowY = (r) => r1(GR.top + r * RH);
let grid = '';
for (let c = 0; c < 5; c++) grid += `<rect class="${c === 4 ? 'pm-hatch' : 'pm-col'}" x="${colX(c) + 0.6}" y="${r1(-BA.z1 + 3)}" width="${r1(CW - 1.2)}" height="${r1(GR.top - (-BA.z1 + 3) - 2)}" rx="1"/>`;
for (let r = 0; r < ROWS; r++) grid += `<rect class="pm-tag" x="${r1(BA.x0 + 3)}" y="${rowY(r) + 1.5}" width="9" height="${r1(RH - 3)}" rx="1"/>`;
let rules = `M${GR.x0} ${GR.top}H${GR.x1}`;
for (let r = 1; r <= ROWS; r++) rules += `M${r1(BA.x0 + 3)} ${rowY(r)}H${GR.x1}`;
for (let c = 0; c <= 5; c++) rules += `M${colX(c)} ${r1(-BA.z1 + 3)}V${GR.bot}`;
grid += `<path class="pm-rule" d="${rules}"/><rect class="pm-hatch" x="${colX(4) + 0.6}" y="${GR.top + 0.6}" width="${r1(CW - 1.2)}" height="${r1(GR.bot - GR.top - 1.2)}"/>`;
// the ROAM corner: a header and four quadrants
const RM = { x0: r1(GR.x1 + 5), x1: r1(BA.x1 - 3), top: GR.top, bot: r1(GR.top + 2 * 34) };
const RMW = r1((RM.x1 - RM.x0) / 2);
const roamBox = `<rect class="pm-col" x="${RM.x0}" y="${r1(-BA.z1 + 3)}" width="${r1(RM.x1 - RM.x0)}" height="${r1(GR.top - (-BA.z1 + 3) - 2)}" rx="1"/>`
  + `<path class="pm-rule" d="M${RM.x0} ${RM.top}H${RM.x1}V${RM.bot}H${RM.x0}ZM${r1(RM.x0 + RMW)} ${RM.top}V${RM.bot}M${RM.x0} ${r1(RM.top + 34)}H${RM.x1}"/>`;
// the feature cards: [row, column, slot]; card 0 and 1 are team A's work and
// the work of team B that waits for it (string 0)
const CARDDEF = [[0, 1, 0], [1, 2, 1], [0, 0, 0], [1, 0, 0], [2, 1, 0], [3, 0, 0], [4, 2, 0], [5, 0, 1], [2, 2, 1], [3, 1, 0], [0, 3, 1], [4, 3, 0], [5, 1, 0], [2, 3, 0], [3, 3, 1], [5, 3, 0]];
const CARD = { w: r1((CW - 5) / 2), h: r1(RH - 6) };
const CARDS = CARDDEF.map(([r, c, s]) => [r1(colX(c) + 1.5 + s * (CARD.w + 2)), r1(rowY(r) + 3)]);
const STRINGS = [[0, 1], [3, 4], [5, 6], [8, 11], [12, 14]];
for (const [a, b] of STRINGS) assert(CARDDEF[a][1] < CARDDEF[b][1] && CARDDEF[a][0] !== CARDDEF[b][0], `string ${a}-${b} runs forward to another team`);
const SIX = 2; // the team of the worked example (s6): row 2, with three cards
assert(CARDDEF.filter(([r]) => r === SIX).length === 3, 'the example team has three cards on the board');
const boardFace = `<g transform="${BOARD.face}">${cueG('grid', grid)}${cueG('roam', roamBox + g('bRoam', ''))}${cueG('row', g('bRow', ''))}${cueG('cards', g('bCards', ''))}${cueG('strings', g('bStr', ''))}</g>`;
// the five iterations on the side wall, the last the IP iteration
const CAL = w.calendar({ y0: 30, z0: 120, weeks: 5, cw: 34, ch: 52 });
const CELLS = Array.from({ length: 5 }, (_, i) => CAL.cell(i).map(r1));
const calIP = `<g transform="${CAL.face}"><rect class="pm-hatch" x="${CELLS[4][0]}" y="${CELLS[4][1]}" width="${r1(CELLS[4][2] - CELLS[4][0])}" height="${r1(CELLS[4][3] - CELLS[4][1])}"/>${g('cMarks', '')}</g>`;
// the people: three team tables, each team behind its table, seen from the room
const fig = (x, y, key, look, along = 'x') => scrumPerson(w, k, G, P, { x, y, key, look, along });
const TABLES = [{ x: 34, y: 140 }, { x: 146, y: 140 }, { x: 258, y: 140 }];
const tables = TABLES.map((t) => w.table({ x: t.x, y: t.y, w: 76, d: 36 })).join('');
const world = [
  w.room(ROOM),
  cueG('board', BOARD.svg) + boardFace,
  cueG('weeks', CAL.svg + calIP),
  fig(372, 40, 'rte', 'sm', 'y'),
  w.person({ x: 396, y: 112, role: 'planner', along: 'y' }),
  tables,
  fig(70, 214, 'teams', 'dev'),
  fig(184, 216, 'po', 'po'),
  fig(296, 214, 'teams', 'dev'),
  fig(128, 262, 'arch', 'dev2'),
  w.person({ x: 392, y: 206, role: 'sponsor', along: 'y' }),
].join('');
for (const r of ['board', 'grid', 'roam', 'row', 'cards', 'strings', 'weeks', 'rte', 'planner', 'teams', 'po', 'arch', 'sponsor']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);

// ---------------------------------------------------------------- the board's states
// One entry per beat: cards shown, strings shown, ROAM step (0 none, 1 risks
// up, 2 sorted), and the highlighted row (-1 none); a pair [from, to] plays
// over the beat. A scene shorter than its beats holds its last entry.
const st = (c, s = 0, r = 0, h = -1) => ({ c, s, r, h });
const FULL = st(CARDS.length, STRINGS.length, 2);
const BOARDS = [
  // s1: an empty wall; team A's card, team B's card and the string between them
  [st(0), st(0), st([0, 2], [0, 1]), st(2, 1), st(2, 1), st(2, 1)],
  // s2, s3: the board waits; the iterations strip carries the cadence
  [st(0)], [st(0)],
  // s4: the teams fill the board with their first plans
  [st(0), st(0), st([0, 10]), st(10), st([10, 16]), st(16), st(16), st(16)],
  // s5: the red strings; the risks up and ROAMed; the vote
  [st(16), st(16, [0, 5]), st(16, 5, [0, 2]), FULL, FULL, FULL],
  // s6: one team's row
  [st(16, 5, 2, SIX)],
  // s7 to s9: the full board behind the roles
  [FULL], [FULL], [FULL],
];
const WEEKS = [[0], [0, 0, 0, [0, 5], 5, 5, 5, 5], [5, 5, 5, 5], [5], [5], [5], [5], [5], [5]];

// ---------------------------------------------------------------- the panel (stage space)
const PX = 322;
const PW = 308;
const CUES = ['one', 'parts', 'dep', 'scale', 'safe', 'survey',
  'art', 'size', 'train', 'cad', 'pi', 'ip', 'takt', 'ask',
  'mb', 'calc8', 'calc5', 'year',
  'pip', 'day1', 'cap', 'review', 'obj', 'unc', 'bo', 'bv',
  'apb', 'red', 'roamc', 'vote', 'rule', 'obeya',
  'cap120', 'free', 'o1', 'o2', 'commit',
  'rtec', 'rtedo', 'rtenot', 'pmc', 'backlog', 'feat', 'poc',
  'ca', 'sa', 'smc', 'names', 'po2', 'ask2',
  'weigh', 'ex1', 'ex2', 'ex3', 'rev', 'prop'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.agile.kanban): the same points, fewer bytes; each rewrite is read back.
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
const CAL_AT = w.at([0, 115, 146]).map(r1);
const ROOM_AT = w.at([160, 150, 90]).map(r1);
const RIGHT_AT = w.at([300, 140, 120]).map(r1);
const BV = (s, dy = 0) => [BOARD_AT[0], BOARD_AT[1] + dy, s];
const CAM = [
  { from: [ROOM_AT[0], ROOM_AT[1], 1.15], to: BV(1.3, 20) },
  { from: [ROOM_AT[0], ROOM_AT[1], 1.15], to: [CAL_AT[0] + 40, CAL_AT[1] + 10, 1.5] },
  { from: [CAL_AT[0] + 40, CAL_AT[1] + 10, 1.45], to: [ROOM_AT[0], ROOM_AT[1], 1.15] },
  { from: [ROOM_AT[0], ROOM_AT[1], 1], to: BV(1.3, 20) },
  { from: BV(1.3, 10), to: BV(1.5) },
  { from: BV(1.45), to: BV(1.6, -10) },
  { from: [160, 205, 1], to: [RIGHT_AT[0] - 30, RIGHT_AT[1], 1.2] },
  { from: [RIGHT_AT[0] - 30, RIGHT_AT[1], 1.2], to: [ROOM_AT[0], ROOM_AT[1] + 10, 1.1] },
  { from: [ROOM_AT[0], ROOM_AT[1], 1.05], to: [RIGHT_AT[0] - 40, RIGHT_AT[1], 1.2] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CARDS, CARD, STRINGS, BOARD: BOARDS, WEEKS, CELLS, RM, RMW, GR, RH, SIX, BA: { x0: BA.x0, x1: BA.x1, z0: BA.z0, z1: BA.z1 } };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.scaled.pi',
  title: { nl: 'Een PI-planning in twee dagen', en: 'A two-day PI planning' },
  lessons: [WH, PP, RO],
  strictFocus: true,
  scenes: [
    sc('s1', WH, 1, { nl: 'Veel teams, één product', en: 'Many teams, one product' }, [
      { nl: 'Eén Scrum-team: hooguit zo’n tien mensen. Een verpakkingsmachine vraagt meer.', en: 'One Scrum team: ten people at most. A packaging machine needs more.', focus: ['one', 'teams'] },
      { nl: 'PLC-besturing, bedieningsscherm, camerakeuring, ERP-koppeling.', en: 'PLC controls, operator screen, camera inspection, ERP link.', focus: 'parts' },
      { nl: 'Zes, zeven teams. Team A wacht op team B: een {t:Afhankelijkheid|afhankelijkheid}.', en: 'Six, seven teams. Team A waits for team B: a {t:Dependency|dependency}.', cue: { Afhankelijkheid: 'dep' }, focus: ['dep', 'strings', 'cards'] },
      { nl: 'Opschalen: afspraken, zodat veel teams als één geheel leveren.', en: 'Scaling: agreements so that many teams deliver as one.', focus: ['scale', 'teams'] },
      { nl: '{t:SAFe|SAFe}: sinds 2011, nu versie 6.0, van begin 2023.', en: '{t:SAFe|SAFe}: since 2011, now version 6.0, from early 2023.', cue: { SAFe: 'safe' }, focus: 'safe' },
      { nl: 'Al jaren het meest gebruikt, in een enquête: geen steekproef.', en: 'The most used for years, in a survey: not a sample.', focus: 'survey' },
    ]),
    sc('s2', WH, 1, { nl: 'De trein en zijn ritme', en: 'The train and its rhythm' }, [
      { nl: '{t:Agile Release Train|Agile Release Train} (ART): een team van agile teams.', en: '{t:Agile Release Train|Agile Release Train} (ART): a team of agile teams.', cue: { 'Agile Release Train': 'art' }, focus: ['art', 'teams'] },
      { nl: 'Meestal {n:50} tot {n:125} mensen, lang bij elkaar.', en: 'Usually {n:50} to {n:125} people, together for long.', focus: ['size', 'teams', 'po', 'arch'] },
      { nl: 'Vaste vertrektijden; niet klaar gaat mee met de volgende.', en: 'Fixed departures; not ready goes on the next one.', focus: 'train' },
      { nl: '{t:Cadans|Cadans}: alle teams plannen, bouwen en leveren tegelijk.', en: '{t:Cadence|Cadence}: all teams plan, build and deliver at once.', cue: { Cadans: 'cad' }, focus: ['cad', 'weeks'] },
      { nl: '{t:Planning Interval|Planning Interval} (PI): {n:8} tot {n:12} weken.', en: '{t:Planning Interval|Planning Interval} (PI): {n:8} to {n:12} weeks.', cue: { 'Planning Interval': 'pi' }, focus: ['pi', 'weeks'] },
      { nl: 'Iteraties van {n:2} weken; de laatste is de {t:IP-iteratie|IP-iteratie}.', en: 'Iterations of {n:2} weeks; the last is the {t:IP iteration|IP iteration}.', cue: { 'IP-iteratie': 'ip' }, focus: ['ip', 'weeks'] },
      { nl: 'Lean-blik: als takt op een lijn. Elke twee weken samen testen.', en: 'Lean view: like takt on a line. Test together every two weeks.', focus: ['takt', 'weeks'] },
      { nl: 'Welke teams leveren samen iets werkends? Dat is je trein.', en: 'Which teams deliver something that works together? That is your train.', focus: ['ask', 'teams', 'po'] },
    ]),
    sc('s3', WH, 1, { nl: 'Voorbeeld: de machinebouwer', en: 'Example: the machine builder' }, [
      { nl: 'Machinebouwer: {n:72} mensen op de software van een lijn, teams van {n:9}.', en: 'Machine builder: {n:72} people on a line’s software, teams of {n:9}.', focus: ['mb', 'teams'] },
      { nl: '{n:72} ÷ {n:9} = {n:8} teams: één ART.', en: '{n:72} ÷ {n:9} = {n:8} teams: one ART.', focus: ['calc8', 'teams'] },
      { nl: 'PI {n:10} weken ÷ {n:2} = {n:5} iteraties: {n:4} bouwen, {n:1} IP.', en: 'PI {n:10} weeks ÷ {n:2} = {n:5} iterations: {n:4} build, {n:1} IP.', focus: ['calc5', 'weeks'] },
      { nl: '{n:52} ÷ {n:10} = {n:5.2}: zo’n {n:5} keer per jaar samen plannen.', en: '{n:52} ÷ {n:10} = {n:5.2}: about {n:5} joint plannings a year.', focus: ['year', 'weeks'] },
    ]),
    sc('s4', PP, 2, { nl: 'Twee dagen in één zaal', en: 'Two days in one room' }, [
      { nl: '{t:PI Planning|PI Planning}: de hele trein, twee dagen, één zaal.', en: '{t:PI Planning|PI Planning}: the whole train, two days, one room.', cue: { 'PI Planning': 'pip' }, focus: ['pip', 'rte', 'teams'] },
      { nl: 'Dag 1: bedrijfscontext en visie. Wat, en waarom?', en: 'Day 1: business context and vision. What, and why?', focus: ['day1', 'sponsor'] },
      { nl: 'Teams plannen zelf, per iteratie, met eigen capaciteit.', en: 'Teams plan themselves, per iteration, with their own capacity.', focus: ['cap', 'teams', 'cards'] },
      { nl: 'Eind dag 1: management review. Dag 2: bijstellen, presenteren.', en: 'End of day 1: management review. Day 2: adjust, present.', focus: ['review', 'sponsor'] },
      { nl: '{t:PI-objectives|PI-objectives}: doelen in zakelijke taal, zoals storing melden met één tik.', en: '{t:PI objectives|PI objectives}: goals in business words, like reporting a stoppage in one tap.', cue: { 'PI-objectives': 'obj' }, focus: ['obj', 'cards'] },
      { nl: 'Twijfel? Uncommitted: telt mee, maar is geen belofte.', en: 'In doubt? Uncommitted: it counts, but is no promise.', focus: ['unc', 'cards'] },
      { nl: '{t:Business Owners|Business Owners}: elk doel een waarde van {n:1} tot {n:10}.', en: '{t:Business Owners|Business Owners}: each goal a value from {n:1} to {n:10}.', cue: { 'Business Owners': 'bo' }, focus: ['bo', 'sponsor'] },
      { nl: 'Krap? Waarde {n:9} gaat voor waarde {n:3}.', en: 'Tight? Value {n:9} goes before value {n:3}.', focus: ['bv', 'cards'] },
    ]),
    sc('s5', PP, 2, { nl: 'Het bord en de stemming', en: 'The board and the vote' }, [
      { nl: '{t:ART Planning Board|ART Planning Board}: teams in rijen, iteraties in kolommen.', en: '{t:ART Planning Board|ART Planning Board}: teams in rows, iterations in columns.', cue: { 'ART Planning Board': 'apb' }, focus: ['apb', 'grid'] },
      { nl: 'Rode draad: team B wacht op werk van team A.', en: 'A red string: team B waits for team A’s work.', focus: ['red', 'strings'] },
      { nl: '{t:ROAM|ROAM}: Resolved, Owned, Accepted of Mitigated.', en: '{t:ROAM|ROAM}: Resolved, Owned, Accepted or Mitigated.', cue: { ROAM: 'roamc' }, focus: ['roamc', 'roam'] },
      { nl: '{t:Confidence vote|Confidence vote}: één tot vijf vingers. Hoe haalbaar?', en: '{t:Confidence vote|Confidence vote}: one to five fingers. How feasible?', cue: { 'Confidence vote': 'vote' }, focus: ['vote', 'teams', 'po', 'arch'] },
      { nl: 'Vuistregel: gemiddeld drie of meer. Eén of twee? Die krijgt het woord.', en: 'Rule of thumb: an average of three or more. One or two? They get the floor.', focus: 'rule' },
      { nl: 'Een obeya op grote schaal. Valkuil: niemand zegt dat het niet past.', en: 'An obeya at scale. Pitfall: nobody says it does not fit.', focus: ['obeya', 'board'] },
    ]),
    sc('s6', PP, 2, { nl: 'Voorbeeld: één team plant', en: 'Example: one team plans' }, [
      { nl: '{n:4} iteraties × {n:30} story points = {n:120} punten.', en: '{n:4} iterations × {n:30} story points = {n:120} points.', focus: ['cap120', 'row'] },
      { nl: '{n:20}% vrij voor storingen: {n:120} × {n:0.8} = {n:96}.', en: '{n:20}% free for breakdowns: {n:120} × {n:0.8} = {n:96}.', focus: ['free', 'row'] },
      { nl: 'Storing melden: {n:40}, waarde {n:9}. Rapport per ploeg: {n:35}, waarde {n:6}.', en: 'Stoppage report: {n:40}, value {n:9}. Shift report: {n:35}, value {n:6}.', focus: ['o1', 'row'] },
      { nl: 'MES-koppeling: {n:30}, waarde {n:7}. Samen {n:105}: past niet in {n:96}.', en: 'MES link: {n:30}, value {n:7}. Together {n:105}: no fit in {n:96}.', focus: ['o2', 'row'] },
      { nl: 'Koppeling uncommitted. Beloofd: {n:40} + {n:35} = {n:75}.', en: 'The link uncommitted. Committed: {n:40} + {n:35} = {n:75}.', focus: ['commit', 'row'] },
    ]),
    sc('s7', RO, 3, { nl: 'De rollen', en: 'The roles' }, [
      { nl: '{t:Release Train Engineer|Release Train Engineer} (RTE): dienend leider en coach.', en: '{t:Release Train Engineer|Release Train Engineer} (RTE): servant leader and coach.', cue: { 'Release Train Engineer': 'rtec' }, focus: ['rtec', 'rte'] },
      { nl: 'Begeleidt de events, haalt obstakels weg, stuurt op flow.', en: 'Facilitates the events, removes impediments, steers on flow.', focus: ['rtedo', 'rte'] },
      { nl: 'Geen baas die taken uitdeelt. Vaak een oud-programmamanager: valkuil.', en: 'No boss handing out tasks. Often a former programme manager: a pitfall.', focus: ['rtenot', 'rte'] },
      { nl: '{t:Product Management|Product Management}: wat is gewenst, haalbaar, levensvatbaar?', en: '{t:Product Management|Product Management}: what is desirable, feasible, viable?', cue: { 'Product Management': 'pmc' }, focus: ['pmc', 'planner'] },
      { nl: 'Ordent de {t:ART Backlog|ART Backlog}: de features van de hele trein.', en: 'Orders the {t:ART Backlog|ART Backlog}: the features of the whole train.', cue: { 'ART Backlog': 'backlog' }, focus: ['backlog', 'planner'] },
      { nl: '{t:Feature|Feature}: past in één PI, waarde voor een gebruiker.', en: '{t:Feature|Feature}: fits in one PI, value for a user.', cue: { Feature: 'feat' }, focus: ['feat', 'cards'] },
      { nl: '{t:Product Owner|Product Owner} (PO): bij één team; maakt user stories.', en: '{t:Product Owner|Product Owner} (PO): with one team; writes user stories.', cue: { 'Product Owner': 'poc' }, focus: ['poc', 'po'] },
    ]),
    sc('s8', RO, 3, { nl: 'Wie beslist wat', en: 'Who decides what' }, [
      { nl: 'Product Management: markt en klant. De PO: team en details.', en: 'Product Management: market and customer. The PO: team and details.', focus: ['ca', 'planner', 'po'] },
      { nl: '{t:System Architect|System Architect}: technische samenhang, zoals architectuur en interfaces.', en: '{t:System Architect|System Architect}: technical coherence, such as architecture and interfaces.', cue: { 'System Architect': 'sa' }, focus: ['sa', 'arch'] },
      { nl: 'Per team een Scrum Master, in 6.0 ook Team Coach. Business Owners: de zakelijke kant.', en: 'Each team a Scrum Master, in 6.0 also Team Coach. Business Owners: the business side.', focus: ['smc', 'teams', 'sponsor'] },
      { nl: 'Let op namen: een productmanager doet vaak marketing en verkoop, geen SAFe-rol.', en: 'Watch names: a product manager often does marketing and sales, no SAFe role.', focus: 'names' },
      { nl: 'Sterke PO: mandaat en tijd. Eén dag per week? Teams gokken.', en: 'Strong PO: mandate and time. One day a week? Teams guess.', focus: ['po2', 'po'] },
      { nl: 'Team {n:3} en Product Management oneens: wie beslist, hoe snel?', en: 'Team {n:3} and Product Management disagree: who decides, how fast?', focus: ['ask2', 'teams', 'planner'] },
    ]),
    sc('s9', RO, 3, { nl: 'Voorbeeld: weegsystemen', en: 'Example: weighing systems' }, [
      { nl: 'Weegsystemen: een trein van zes teams. Je kijkt een week mee.', en: 'Weighing systems: a train of six teams. You watch for a week.', focus: ['weigh', 'teams', 'po'] },
      { nl: 'RTE: maandag een takenlijst per team, vrijdag controle.', en: 'RTE: a task list per team on Monday, a check on Friday.', focus: ['ex1', 'rte'] },
      { nl: 'Product Management: één persoon, ook accountmanager. Backlog oud.', en: 'Product Management: one person, also account manager. Backlog stale.', focus: ['ex2', 'planner'] },
      { nl: 'Drie teams delen één PO, twee middagen per week. Wat is mis?', en: 'Three teams share one PO, two afternoons a week. What is wrong?', focus: ['ex3', 'po'] },
      { nl: 'RTE stuurt op taken. PM zonder tijd. PO te dun.', en: 'RTE steers on tasks. PM without time. PO too thin.', focus: ['rev', 'rte', 'planner', 'po'] },
      { nl: 'Voorstel: RTE coachen, PM vrijmaken, per team een PO met mandaat.', en: 'Proposal: coach the RTE, free up PM, a PO per team with mandate.', focus: ['prop', 'teams'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons'
// teach text and worked examples, so every point of the checklist above is
// said here or shown on the card. No symbol the voice would read aloud, no
// spoken parenthesis or quote. Dutch checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex, 2026-11-13). Read as written: Scrum-team,
// verpakkingsmachine, PLC-besturing, camerakeuring, ERP (the word "erp", as
// the films with a video), afhankelijkheid, opschalen, cadans, iteraties,
// IP-iteratie, Planning Interval, PI and PI Planning (pee-ie; but espeak-ng
// reads PI right before a colon or comma as the word "pie", so no line puts one
// there), takt, organigram, machinebouwer, capaciteit, Scrum
// Master, Team Coach, levensvatbaar, MES through the existing letters rule;
// Agile through pm.plan.method's etsjail rule, Owner and Backlog through
// pm.agile.scrum's rules, events through its ievent rule. New SAY rules in
// films/_kit/timeline.mjs (tested; recomputed for every film: no other film's
// spoken text changes): SAFe (Seef), Release Train and its Engineer, ART and
// RTE as letters, Planning Board, confidence vote, Business Owners, ROAM,
// objectives, uncommitted, Product Management, System Architect, feature,
// obeya and the -manager compounds; user stories and story points through
// pm.agile.backlog's rules. Said around because
// espeak-ng misreads them (they stay in the captions and on the cards): Scaled
// Agile Framework, Dean Leffingwell, State of Agile and Digital.ai (said "een
// jaarlijkse enquête"), Program Increment, management review and problem
// solving (said "zoekt de leiding waar capaciteit of voorrang knelt";
// prioriteiten is stressed PRI-), Resolved, Owned, Accepted, Mitigated (said in
// Dutch), interfaces (said koppelingen), enablers (said voorbereiding), content
// authority, flow (said doorstroming), backlog in lower case, accountmanager
// (said "een commerciële baan erbij"), vuistregel and trainingsregel (stressed
// -GEL; said "een regel uit trainingen"), and Eén at a sentence start (read
// "ee-een"). Years in words. Card-only points (each on screen at least 4 s) are
// marked "card" in the checklist above.
const SAY = [
  [ // s1 many teams, one product
    { nl: 'Een Scrum-team telt hooguit tien mensen; een nieuwe verpakkingsmachine vraagt meer.',
      en: 'One Scrum team has ten people at most; a new packaging machine needs more.' },
    { nl: 'De PLC-besturing, het scherm, de camerakeuring en de koppeling met het ERP.',
      en: 'The PLC controls, the screen, the camera inspection and the ERP link.' },
    { nl: 'Zes teams doen prima Scrum en lopen toch vast: team A wacht op team B. Een {t:Afhankelijkheid|afhankelijkheid}.',
      en: 'Six teams do Scrum well and still stall: team A waits for team B. A {t:Dependency|dependency}.' },
    { nl: 'Opschalen: afspraken waarmee veel teams als één geheel leveren.',
      en: 'Scaling: agreements that let many teams deliver as one.' },
    { nl: 'De bekendste aanpak: {t:SAFe|SAFe}, uit tweeduizend elf; versie zes is van begin tweeduizend drieëntwintig.',
      en: 'The best known: {t:SAFe|SAFe}, from 2011; version six dates from early 2023.' },
    { nl: 'Een jaarlijkse enquête noemt SAFe al jaren het meest gebruikt. Let wel: geen steekproef.',
      en: 'An annual survey has named SAFe the most used for years. Note: not a sample.' },
  ],
  [ // s2 the train and its rhythm
    { nl: 'Het hart van SAFe: de {t:Agile Release Train|Agile Release Train}, een team van agile teams.',
      en: 'The heart of SAFe: the {t:Agile Release Train|Agile Release Train}, a team of agile teams.' },
    { nl: 'Meestal vijftig tot honderdvijfentwintig mensen, lang bij elkaar.',
      en: 'Usually fifty to a hundred and twenty-five people, long-lived.' },
    { nl: 'De trein vertrekt op vaste tijden; wat niet klaar is, gaat mee met de volgende.',
      en: 'The train leaves at fixed times; what is not ready takes the next one.' },
    { nl: 'Dat ritme is de {t:Cadans|cadans}: alle teams plannen, bouwen en leveren tegelijk.',
      en: 'That rhythm is the {t:Cadence|cadence}: all teams plan, build and deliver at once.' },
    { nl: 'De grote cadans is het {t:Planning Interval|Planning Interval}: de PI duurt acht tot twaalf weken.',
      en: 'The big cadence is the {t:Planning Interval|Planning Interval}: the PI lasts eight to twelve weeks.' },
    { nl: 'Iteraties duren twee weken; de laatste, de {t:IP-iteratie|IP-iteratie}, is voor verbeteren en plannen.',
      en: 'Iterations last two weeks; the last, the {t:IP iteration|IP iteration}, is for improving and planning.' },
    { nl: 'Net als takt op een lijn: elke twee weken samen integreren en testen.',
      en: 'Like takt on a line: integrate and test together every two weeks.' },
    { nl: 'Vraag: welke teams leveren samen iets werkends? Dat is je trein.',
      en: 'Ask: which teams deliver something that works together? That is your train.' },
  ],
  [ // s3 the machine builder
    { nl: 'Voorbeeld: een machinebouwer, tweeënzeventig mensen op de software van een nieuwe lijn, in teams van negen.',
      en: 'Example: a machine builder, seventy-two people on a new line\'s software, in teams of nine.' },
    { nl: 'Dat zijn acht teams: binnen vijftig tot honderdvijfentwintig, dus één ART.',
      en: 'That makes eight teams: within fifty to a hundred and twenty-five, so one ART.' },
    { nl: 'Een PI van tien weken heeft vijf iteraties van twee: vier om te bouwen, één IP-iteratie.',
      en: 'A ten-week PI has five two-week iterations: four to build, one IP iteration.' },
    { nl: 'Per jaar vijf komma twee: zo\'n vijf keer plannen alle acht teams samen.',
      en: 'Per year five point two: about five times all eight teams plan together.' },
  ],
  [ // s4 two days in one room
    { nl: '{t:PI Planning|PI Planning} brengt de hele trein op één lijn: meestal twee dagen, één zaal, in de IP-iteratie.',
      en: '{t:PI Planning|PI Planning} aligns the whole train: usually two days, one room, in the IP iteration.' },
    { nl: 'Dag één: de bedrijfscontext en de visie. Wat moet het product kunnen, en waarom?',
      en: 'Day one: the business context and the vision. What must the product do, and why?' },
    { nl: 'De teams plannen zelf, per iteratie, met hun eigen capaciteit.',
      en: 'The teams plan themselves, per iteration, with their own capacity.' },
    { nl: 'Eind dag één zoekt de leiding waar capaciteit of voorrang knelt. Dag twee: bijstellen en presenteren.',
      en: 'At the end of day one, management looks where capacity or priorities clash. Day two: adjust and present.' },
    { nl: 'Elk team schrijft {t:PI-objectives|PI-objectives}: korte doelen in zakelijke taal.',
      en: 'Each team writes {t:PI objectives|PI objectives}: short goals in business language.' },
    { nl: 'Twijfel? Dan uncommitted: het telt mee, maar is geen belofte.',
      en: 'In doubt? Then uncommitted: it counts, but is no promise.' },
    { nl: 'De {t:Business Owners|Business Owners}, zakelijk verantwoordelijk, geven elk doel een waarde van één tot tien.',
      en: 'The {t:Business Owners|Business Owners}, business-accountable, give each goal a value from one to ten.' },
    { nl: 'Wordt het krap, dan gaat waarde negen voor drie.',
      en: 'When time is tight, value nine goes before three.' },
  ],
  [ // s5 the board and the vote
    { nl: 'Afhankelijkheden komen op het {t:ART Planning Board|ART Planning Board}: teams in rijen, iteraties in kolommen.',
      en: 'Dependencies go on the {t:ART Planning Board|ART Planning Board}: teams in rows, iterations in columns.' },
    { nl: 'Een rode draad verbindt werk van team A met team B, dat erop wacht.',
      en: 'A red string joins team A\'s work to team B, which waits for it.' },
    { nl: 'Risico\'s gaan door {t:ROAM|ROAM}: opgelost, eigenaar, aanvaard of verkleind.',
      en: 'Risks go through {t:ROAM|ROAM}: resolved, owned, accepted or mitigated.' },
    { nl: 'Tot slot de {t:Confidence vote|confidence vote}: één tot vijf vingers voor hoe haalbaar het plan is.',
      en: 'Finally the {t:Confidence vote|confidence vote}: one to five fingers for how feasible the plan is.' },
    { nl: 'Een regel uit trainingen: gemiddeld drie of meer is genoeg, lager betekent opnieuw plannen. Wie één of twee steekt, krijgt het woord.',
      en: 'A training rule: an average of three or more is enough, lower means plan again. Whoever shows one or two gets the floor.' },
    { nl: 'Een obeya, Japans voor grote kamer. Valkuil: het bord hangt vol en niemand zegt dat het niet past.',
      en: 'An obeya, Japanese for big room. The pitfall: the board is full and nobody says it does not fit.' },
  ],
  [ // s6 one team plans
    { nl: 'Voorbeeld: een team heeft vier iteraties van dertig story points: honderdtwintig.',
      en: 'Example: a team has four iterations of thirty story points. A hundred and twenty.' },
    { nl: 'Twintig procent blijft vrij voor onverwacht werk en storingen: zesennegentig punten.',
      en: 'Twenty percent stays free for unplanned work and breakdowns: ninety-six points.' },
    { nl: 'Storing melden met één tik: veertig punten, waarde negen. Rapport per ploeg: vijfendertig, waarde zes.',
      en: 'Report a stoppage with one tap: forty points, value nine. Report per shift: thirty-five, value six.' },
    { nl: 'Koppeling met het nieuwe MES: dertig, waarde zeven. Samen honderdvijf: past niet.',
      en: 'Link with the new MES: thirty, value seven. Together a hundred and five: no fit.' },
    { nl: 'De koppeling wordt uncommitted. Beloofd: vijfenzeventig punten, met ruimte voor uitloop.',
      en: 'The link goes uncommitted. Committed: seventy-five points, with room for overrun.' },
  ],
  [ // s7 the roles
    { nl: 'De {t:Release Train Engineer|Release Train Engineer}, de RTE, is een dienend leider en coach van de trein.',
      en: 'The {t:Release Train Engineer|Release Train Engineer}, the RTE, is a servant leader and coach of the train.' },
    { nl: 'Begeleidt de events, haalt obstakels weg en stuurt op doorstroming.',
      en: 'Facilitates the events, removes impediments and steers on flow.' },
    { nl: 'Geen baas die taken uitdeelt; vaak een oud-programmamanager, een bekende valkuil.',
      en: 'No boss handing out tasks; often a former programme manager, a known pitfall.' },
    { nl: '{t:Product Management|Product Management} bepaalt welke oplossingen gewenst, haalbaar en levensvatbaar zijn.',
      en: '{t:Product Management|Product Management} decides which solutions are desirable, feasible and viable.' },
    { nl: 'Zij ordenen de {t:ART Backlog|ART Backlog}: de features van de hele trein.',
      en: 'They order the {t:ART Backlog|ART Backlog}: the features of the whole train.' },
    { nl: 'Een {t:Feature|feature} past in één PI en heeft waarde voor een gebruiker.',
      en: 'A {t:Feature|feature} fits in one PI and has value for a user.' },
    { nl: 'De {t:Product Owner|Product Owner} zit bij één team en maakt van features user stories.',
      en: 'The {t:Product Owner|Product Owner} sits with one team and turns features into user stories.' },
  ],
  [ // s8 who decides what
    { nl: 'Product Management kijkt naar markt en klant, de PO naar team en details.',
      en: 'Product Management looks at market and customer, the PO at team and details.' },
    { nl: 'De {t:System Architect|System Architect} bewaakt de technische samenhang: architectuur, koppelingen, voorbereiding.',
      en: 'The {t:System Architect|System Architect} guards technical coherence: architecture, interfaces, groundwork.' },
    { nl: 'Elk team heeft een Scrum Master, in SAFe zes ook Team Coach. De Business Owners sturen zakelijk.',
      en: 'Each team has a Scrum Master, in SAFe six also Team Coach. The Business Owners steer the business side.' },
    { nl: 'Let op namen: een productmanager bij een machinebouwer doet vaak marketing en verkoop: geen SAFe-rol.',
      en: 'Watch names: a product manager at a machine builder often does marketing and sales: no SAFe role.' },
    { nl: 'Een sterke PO heeft mandaat en tijd. Maar één dag per week? Dan gokken teams.',
      en: 'A strong PO has mandate and time. One day a week? Then teams guess.' },
    { nl: 'Vraag: als team drie en Product Management het oneens zijn, wie beslist, en hoe snel?',
      en: 'Ask: if team three and Product Management disagree, who decides, and how fast?' },
  ],
  [ // s9 weighing systems
    { nl: 'Voorbeeld: een producent van weegsystemen, zes teams. Je kijkt een week mee.',
      en: 'Example: a maker of weighing systems, six teams. You watch for a week.' },
    { nl: 'De RTE, een oud-projectmanager, deelt maandag taken uit en controleert vrijdag.',
      en: 'The RTE, a former project manager, hands out tasks on Monday and checks Friday.' },
    { nl: 'Product Management: één persoon met een commerciële baan erbij; de ART Backlog negen maanden oud.',
      en: 'Product Management: one person with a sales job besides; the ART Backlog nine months old.' },
    { nl: 'Drie teams delen één PO, twee middagen per week. Welke rollen zijn mis of te dun?',
      en: 'Three teams share one PO, two afternoons a week. Which roles are wrong or too thin?' },
    { nl: 'De RTE stuurt op taken, dus teams leren niet plannen; Product Management heeft geen tijd; de PO is te dun.',
      en: 'The RTE steers on tasks, so teams do not learn to plan; Product Management has no time; the PO is too thin.' },
    { nl: 'Voorstel: coach de RTE, maak Product Management vrij, en geef elk team een PO met mandaat.',
      en: 'Proposal: coach the RTE, free up Product Management, and give each team a PO with mandate.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice, and none of the words espeak-ng misreads (see
// above); checked on the text after the SAY rules, so a word a rule rewrites
// passes and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(\w*manager\w*|management|Scaled|Framework|Leffingwell|State of|Digital|Increment|Resolved|Owned|Accepted|Mitigated|interfaces|enablers|flow|backlog|operations|vuistregel|\w+regel|Business|Owners?|Board|Release|Train|ART|RTE|SAFe|ROAM|objectives|committed|feature\w*|obeya|Architect|stories|content authority|PI(?=[:,]))\b|(^|[.?!;]\s)Eén\b/,
  en: /\b(Room|Seef)\b/,
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
    const bs = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = bs[bi] / rs.dur;
      const a1 = bi + 1 < bs.length ? bs[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="teams"],[data-cue="po"],[data-cue="arch"],[data-cue="rte"],[data-cue="planner"],[data-cue="sponsor"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.5}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.9}
.pm-risk{fill:#E3B341;stroke:var(--anatomy-hi);stroke-width:.4}
.pm-red{fill:none;stroke:#D64545;stroke-width:1.3;stroke-linecap:round}
.pm-redp{fill:none;stroke:#D64545;stroke-width:3;stroke-linecap:round}
.pm-col{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
.pm-tag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-rowon{fill:color-mix(in srgb,var(--fp-accent) 30%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.8}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-col,[data-cue][data-on] .pm-tag{fill:color-mix(in srgb,var(--fp-focus) 30%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.8}
[data-cue][data-on] .pm-red{stroke-width:2}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.agile.kanban) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een grote zaal voor de hele trein. Aan de achterwand het ART Planning Board: zes rijen voor de teams, vier kolommen voor de iteraties en een gearceerde voor de IP-iteratie, met rechts een hoek voor de risico\'s; kaartjes met features vullen het bord en rode draden verbinden werk van het ene team met werk van een ander team dat erop wacht. Aan de zijwand een strook van vijf iteraties, de laatste gearceerd. In de zaal drie teamtafels met teamleden, een Product Owner met een tablet en een architect met een laptop; rechts de Release Train Engineer, Product Management en een Business Owner. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: waarom opschalen en SAFe; de trein en zijn cadans; de machinebouwer met tweeënzeventig mensen; twee dagen PI Planning; het bord, ROAM en de confidence vote; één team dat plant; de rollen; wie beslist wat; en de producent van weegsystemen.',
  en: 'A big room for the whole train. On the back wall the ART Planning Board: six rows for the teams, four columns for the iterations and a hatched one for the IP iteration, with a corner for risks at the right; feature cards fill the board and red strings join one team\'s work to another team\'s work that waits for it. On the side wall a strip of five iterations, the last hatched. In the room three team tables with team members, a Product Owner with a tablet and an architect with a laptop; at the right the Release Train Engineer, Product Management and a Business Owner. At the right a panel with one card per scene, marked as example or diagram: why scale and SAFe; the train and its cadence; the machine builder with seventy-two people; two days of PI Planning; the board, ROAM and the confidence vote; one team planning; the roles; who decides what; and the maker of weighing systems.',
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

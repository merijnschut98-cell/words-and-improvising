// Dev tool, not shipped. Builds the explainer film "Van idee tot sprintklaar /
// From idea to sprint-ready" for the Projects course: pm.agile.stories,
// pm.agile.refine and pm.agile.points (levels 1 to 3 of the topic backlog and
// estimating in Agile werken).
//
//   node films/pm.agile.backlog/build.mjs            build the page
//   node films/pm.agile.backlog/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.agile.backlog.html: one offline page with
// the anatomy kit, the stage script and the player inlined. A film that will
// be rendered to video (Merijn, 2026-11-12: render every reviewed pm film), so
// all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.agile.backlog, P2: backlog, user stories, refinement, estimating; "a
// story being split, refined and estimated by the team"). Storyboard drift: the
// plan's 100 s are about 290 s in nine scenes, because a lesson with a film no
// longer shows its worked example (v16 notes), so the film carries the teach
// text and the example of all three lessons: user stories (s1 to s3),
// refinement and splitting (s4 to s6), story points, planning poker and
// velocity (s7 to s9). The storyboard's beats are all there: a story on the
// Product Backlog (s1, s2), an epic split vertically into slices on the board
// (s5, s6), refined by the team at the table (s4 to s6) and estimated with
// planning poker cards above the Developers' heads (s8). pm.agile.forecast
// (level 4, forecasting with probabilities) has its own terms and is not served.
//
// Terms follow the Scrum film (films/pm.agile.scrum, reviewed): Product
// Backlog, Product Owner, Developers, Definition of Done, Sprint Planning, the
// same team figures (its cast.mjs, imported, not edited) and the same room. A
// range is a "bandbreedte", as pm.plan.wbs says it.
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   stories teach 1: a short description of what a user wants, in their own
//     words (s1 b1); the common template from the company Connextra, around
//     2001, as a role I want something so that value (s1 b2), British (card:
//     VK, UK), the template on the card; the downtime example, operator line 3,
//     two taps, the shift leader knows where the time went (s1 b3), when the
//     line stops (card); the so that is the most important part, it says why
//     (s1 b4)
//   stories teach 2: a story is no specification (card, s1 b5); Ron Jeffries
//     of Extreme Programming (s1 b5), one of its creators, an early agile
//     method (card); the three Cs in 2001 (s1 b5); card a reminder, details
//     from a conversation, agreements how you check; a promise, not a contract
//     (s1 b6), between users and builders (card)
//   stories teach 3: acceptance criteria, concrete testable conditions (s2
//     b1), when is it done (card); at most 8 causes, with work gloves on,
//     within 1 minute at the shift leader (s2 b2); without them the argument
//     only starts at delivery (s2 b3)
//   stories teach 4: an epic, too big for one sprint, OEE per line, cut later
//     (s2 b4), for the plant manager, OEE spelled out (card); stories and epics
//     are Product Backlog items; the Scrum Guide prescribes no format (s2 b5),
//     user stories a choice (card)
//   stories teach 5: typical mistakes, a task as a story, no so that, "the
//     user" as role (s2 b6), "as a developer I want a database", an operator
//     wants something else than a planner (card); experts find the template
//     schoolmasterly, fine as long as who, what and why are in it (card, s2
//     b7); ask who notices when it is done, and how (s2 b7)
//   stories example: a planner at a steel-door maker delivers 30 pages of
//     requirements (s3 b1), for a new planning screen (card); page 4, show the
//     load on all machines: who needs it and what for (s3 b2); after 10
//     minutes, the welding-robot story with 5 working days and rush orders on
//     a robot with room (s3 b3); criteria: hours per day, red above 90
//     percent, refreshed every 15 minutes (s3 b4); about 25 stories, 6 pages
//     deliver nothing (s3 b5)
//   refine teach 1: refinement, ongoing: cutting, adding details and criteria,
//     sizing (s4 b1); no separate event, a fixed slot, often an hour or two a
//     week (s4 b2); the Developers size it, the Product Owner explains what and
//     why (s4 b3)
//   refine teach 2: INVEST, Bill Wake 2003 (s4 b4); the six letters and what
//     they mean (s4 b5: Dutch meanings in the Dutch voice, the words in the
//     English one; the English words and short meanings on the card); a weak
//     letter tells you what to do (s4 b6)
//   refine teach 3: story splitting, smaller stories that each deliver
//     something working (s5 b1); not horizontally into layers, database, logic,
//     screen: then the user gets nothing (s5 b2), crossed out on card and
//     board; vertically like slices of cake: by step, rule, line or product
//     type, the simplest first (s5 b3), then the exceptions (card), slices on
//     card and board
//   refine teach 4: the Definition of Ready, when a story is ready for a
//     sprint; not in the Scrum Guide; not a new gate (s5 b4), e.g. criteria
//     known (card); ordering, the Product Owner on value, risk and
//     dependencies (s5 b5), often first what delivers much or removes much
//     uncertainty (card)
//   refine teach 5: for a Lean consultant, refinement is work preparation;
//     without criteria a story gets stuck (s6 b1), as in maintenance, a job
//     without parts and drawings (card); mistakes: refining far ahead, or not
//     at all, so Sprint Planning takes hours (s6 b2), a long meeting about work
//     six months out (card); ask: are the top items ready for the next two
//     sprints (card, s6 b2)
//   refine example: window frames, the planner's story to spread all orders
//     over the saws, an hour a day puzzling (s6 b3); the team estimates 3
//     sprints, so cut vertically (s6 b4); 1 saw and standard profiles, all 3
//     saws, rush orders, changeover time (s6 b5), rush orders first and the
//     time to set a machine up for another profile (card); story 1 fits one
//     sprint, in use after 2 weeks, the team learns whether the rules are
//     right (s6 b6), on one machine (card)
//   points teach 1: bad at hours, reasonable at comparing: relative estimation
//     (s7 b1), bigger or smaller than known work (card); story points: work,
//     complexity, uncertainty together, an 8 about four times a 2 (s7 b2); per
//     team, A's 5 is not B's 5 (s7 b3)
//   points teach 2: a modified Fibonacci sequence, the gaps grow (s7 b4), the
//     deck 1 2 3 5 8 13 20 40 100 and "big work is less precise" (card); doubt
//     between 8 and 13: big and uncertain, maybe cut it (s7 b5); points began
//     as ideal days (s7 b6), Extreme Programming, renamed, an ideal day about
//     three real days (card); Ron Jeffries in 2019, half joking, may have
//     invented them and is sorry (s7 b6)
//   points teach 3: planning poker, James Grenning 2002, estimating with
//     cards (s8 b1); the Product Owner reads a story, everyone picks silently,
//     all turn over at once (s8 b2); 3 and 13: highest and lowest explain; that
//     conversation is the value; then another round (s8 b3), one sees a risk
//     the other misses (card); the cards above the Developers' heads
//   points teach 4: velocity, the points a team finishes per sprint by the
//     Definition of Done (s8 b4), over several sprints a range (card); use the
//     spread: 18 to 30, don't plan on 30 (s8 b5); only with the same team and
//     stable estimating (card, s8 b5)
//   points teach 5: no productivity measure; made a target, teams estimate
//     more generously (s8 b6), for a Lean consultant it looks like output per
//     shift (card, s8 b7); experts: some just count items; ask what the points
//     are for (s8 b7), as good when items are small and alike, and who looks
//     (card)
//   points example (faded): tow-bar maker, six sprints of 18 to 30 points,
//     average 23.3 (s9 b1), customer portal, the six values, 140 / 6 (card);
//     120 points left, the sales director asks when (s9 b2); six sprints by
//     the average, a false certainty (s9 b3), 120 / 23.3 = 5.1 (card)
//   reveal (the ask is answered in the voice): fastest 30, 4 sprints; slowest
//     18, 6.7 so 7 (s9 b4), the divisions on the card; 4 to 7 sprints, 8 to 14
//     weeks, most likely 12 weeks (s9 b5), 6 sprints (card); only if the list
//     doesn't grow, and it nearly always does; update the range every sprint
//     (s9 b6)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text). Every card-only
//   point stays up at least one beat of 4 s or more.
//
// Facts checked (2026-11-13): the template "As a [role] I want [something] so
// that [value]" from Connextra (Rachel Davies' team, London, 2001; popularised
// by Mike Cohn's User Stories Applied, 2004; the lesson credits Connextra, and
// so does the film). Ron Jeffries' "Essential XP: Card, Conversation,
// Confirmation" (2001). Bill Wake, "INVEST in Good Stories, and SMART Tasks"
// (2003), with the six letters as the lesson gives them. James Grenning,
// "Planning Poker or How to avoid analysis paralysis while release planning"
// (2002). Ron Jeffries, "Story Points Revisited" (2019: "I like to say that I
// may have invented story points, and if I did, I'm sorry now"). The deck 1,
// 2, 3, 5, 8, 13, 20, 40, 100 is the common planning-poker deck (Mike Cohn's
// Mountain Goat cards); the lesson calls it a modified Fibonacci sequence and
// credits nobody, nor does the film. The Scrum Guide of November 2020:
// refinement "the act of breaking down and further defining Product Backlog
// items into smaller more precise items", "an ongoing activity to add details,
// such as a description, order, and size"; "The Developers who will be doing
// the work are responsible for the sizing. The Product Owner may influence the
// Developers by helping them understand and select trade-offs"; it names no
// Definition of Ready (only items "deemed ready for selection" when they can be
// Done within one Sprint) and no user stories. Credited to the Guide here only
// what it says; "an hour or two a week", the Lean comparisons, INVEST's Dutch
// meanings and the three examples are the lessons' own.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here) in
// the Scrum film's room: on the back wall the Product Backlog, an ordered
// column of cards with the current story in the accent colour, an epic that
// arrives on top and is cut on the right of the board (horizontally into three
// layers, crossed out; then vertically into four slices that drop into the
// list, story 1 first); in the points scenes each card gets a size chip. The
// Scrum Team is the Scrum film's (cast.mjs): the Product Owner with a tablet,
// the Scrum Master, three Developers; the planner from the pm world in front is
// the user the stories come from. Planning poker cards appear above the
// Developers' heads (s8): backs, then 3, 5 and 13, then a second round. A
// panel at the right, in stage space, carries one card per scene, labelled
// "schema" or "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// board and the poker cards.
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
const ST = 'pm.agile.stories';
const RF = 'pm.agile.refine';
const PT = 'pm.agile.points';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(ST, ['een korte beschrijving van iets wat een gebruiker wil, in zijn eigen woorden', 'het Britse bedrijf Connextra, rond 2001', '“Als [rol] wil ik [iets], zodat [waarde].”',
  'operator van lijn 3 wil ik bij een stilstand met twee tikken een oorzaak kiezen, zodat de ploegleider weet waar de tijd heen ging', 'Het “zodat” is het belangrijkste deel: het zegt waarom',
  'Een story is geen specificatie', 'Ron Jeffries, een van de bedenkers van Extreme Programming (een vroege agile methode), beschreef in 2001 de drie C’s',
  'als geheugensteun', 'de details komen uit een gesprek tussen gebruikers en bouwers', 'afspraken hoe je controleert dat het werkt', 'een belofte van een gesprek, geen contract',
  'concrete, toetsbare voorwaarden waaraan de story moet voldoen om geaccepteerd te worden', 'De keuzelijst toont hooguit 8 oorzaken', 'Kiezen kan met werkhandschoenen aan',
  'binnen 1 minuut in het overzicht van de ploegleider', 'begint de discussie pas bij de oplevering', 'te groot is voor één sprint', 'wil ik OEE (Overall Equipment Effectiveness', 'Een epic knip je later in kleinere stories',
  'soorten Product Backlog-items', 'De Scrum Guide schrijft geen vorm voor', 'technische taken in story-jasje (“Als ontwikkelaar wil ik een database”)', 'stories zonder “zodat”',
  'rollen als “de gebruiker”', 'schoolmeesterachtig', 'zolang wie, wat en waarom erin staan', '“Wie merkt het als dit af is, en waaraan?”',
  'fabrikant van stalen deuren levert een document van 30 pagina’s', 'Het systeem moet de bezetting van alle machines tonen', 'gesprek van 10 minuten met de planner',
  'per lasrobot de bezetting voor de komende 5 werkdagen zien, zodat ik spoedorders op een robot met ruimte kan zetten', 'bezetting in uren per dag; rood boven de 90% van de beschikbare tijd; ververst elke 15 minuten',
  'blijven zo’n 25 stories over, en 6 pagina’s blijken niemand iets op te leveren']);
says(RF, ['het doorlopend verfijnen van de Product Backlog', 'details en acceptatiecriteria toevoegen, en de grootte inschatten', 'Het is geen apart Scrum-event', 'vaak een of twee uur per week',
  'De Developers die het werk gaan doen, schatten de grootte. De Product Owner legt uit wat er nodig is en waarom', 'INVEST, van Bill Wake uit 2003',
  'Independent: zo los mogelijk van andere stories. Negotiable: details zijn bespreekbaar. Valuable: levert de gebruiker iets op. Estimable: het team kan de grootte inschatten. Small: past ruim in een sprint. Testable: je kunt controleren of hij werkt',
  'Scoort een story slecht op een letter, dan weet je wat je in refinement moet doen', 'die elk nog steeds iets werkends opleveren', 'Niet horizontaal knippen in lagen (database, logica, scherm)',
  'als plakjes van een taart: per stap in het werkproces, per regel, per lijn of per soort product. Eerst de eenvoudigste variant, dan de uitzonderingen',
  'Definition of Ready: een checklist wanneer een story klaar is om in een sprint te gaan', 'acceptatiecriteria bekend', 'Hij staat níet in de Scrum Guide', 'geen nieuwe poort wordt waar alles voor blijft wachten',
  'De Product Owner doet dat op waarde, risico en afhankelijkheden', 'veel oplevert of veel onzekerheid wegneemt', 'werkvoorbereiding (work preparation) in onderhoud',
  'zonder onderdelen en tekening de vloer op gaat, loopt vast; een story zonder criteria ook', 'items voor over een half jaar', 'zodat de Sprint Planning uren duurt',
  '“Zijn de bovenste items op de backlog klaar voor de komende twee sprints?”', 'fabrikant van kozijnen', 'alle orders automatisch over de zaagmachines verdeelt, zodat ik geen uur per dag puzzel',
  'Het team schat dat op 3 sprints', 'verdelen over 1 zaagmachine, alleen standaardprofielen. Story 2: over alle 3 zaagmachines. Story 3: spoedorders gaan voor. Story 4: rekening houden met omsteltijd',
  'Story 1 past in één sprint, en de planner kan er na 2 weken al op één machine mee werken. Het team leert direct of de verdeelregels kloppen']);
says(PT, ['Mensen zijn slecht in absoluut schatten (“hoeveel uur?”), maar redelijk in vergelijken', 'hoeveel werk, hoe complex en hoe onzeker samen', 'Een story van 8 is ongeveer vier keer zo groot als een van 2',
  'de 5 van team A is niet de 5 van team B', '1, 2, 3, 5, 8, 13, 20, 40, 100', 'De gaten worden groter naarmate de getallen groeien', 'Twijfel tussen 8 en 13 betekent: het is groot en onzeker, knip hem misschien',
  'Punten komen uit Extreme Programming: “ideale dagen” werden hernoemd', 'zo’n drie echte dagen kostte', 'Ron Jeffries schreef in 2019, half als grap, dat hij ze misschien heeft bedacht en dat het hem nu spijt',
  'beschreven door James Grenning in 2002', 'De Product Owner leest een story voor, iedereen kiest stil een kaart, en dan draait iedereen tegelijk zijn kaart om',
  'zeg 3 en 13, dan leggen de hoogste en laagste uit waarom. Juist dat gesprek is de waarde', 'Daarna nog een ronde', 'het aantal punten dat een team per sprint afmaakt, volgens de Definition of Done',
  'Gebruik de spreiding, niet één gemiddelde. Een team dat 18 tot 30 punten haalt, plan je niet op 30', 'van hetzelfde team komen en de manier van schatten stabiel blijft',
  'lijkt op output per ploeg, maar het is geen productiviteitsmaat', 'gaan teams ruimer schatten', 'tellen liever gewoon items', '“Waarvoor gebruiken we deze punten, en wie kijkt ernaar?”',
  'fabrikant van trekhaken bouwt een klantenportaal', '21, 25, 18, 30, 24, 22 punten. Samen 140, gemiddeld 140 / 6 = 23,3', 'nog 120 punten op de backlog', 'De sales-directeur vraagt: “Wanneer is het klaar?”',
  '120 / 23,3 = 5,1, dus 6 sprints', 'suggereert een zekerheid die er niet is', '120 / 30 = 4 sprints', '120 / 18 = 6,7, dus 7 sprints', '4 tot 7 sprints, oftewel 8 tot 14 weken. Waarschijnlijk 6 sprints, 12 weken',
  'dit geldt alleen als de backlog niet groeit, en backlogs groeien bijna altijd', 'de bandbreedte na elke sprint bij te werken']);
says(ST, ['the British company Connextra, around 2001', 'the three Cs in 2001', 'a promise of a conversation, not a contract', 'The Scrum Guide prescribes no format'], 'en');
says(RF, ['INVEST, from Bill Wake in 2003', 'It is not in the Scrum Guide', 'like slices of cake'], 'en');
says(PT, ['described by James Grenning in 2002', 'Ron Jeffries wrote in 2019, half joking', 'Most likely 6 sprints, 12 weeks'], 'en');
assert(lessons.nl.get(ST).terms.map((t) => t.term).join() === 'User story,Drie C’s,Acceptatiecriteria,Epic', 'the four terms of stories');
assert(lessons.nl.get(RF).terms.map((t) => t.term).join() === 'Refinement,INVEST,Story splitsen,Definition of Ready,Ordenen', 'the five terms of refine');
assert(lessons.nl.get(PT).terms.map((t) => t.term).join() === 'Relatief schatten,Story points,Fibonacci-reeks,Planning poker,Velocity', 'the five terms of points');
for (const id of [ST, RF, PT]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.agile.backlog', `no other film is wired to ${id}`);
// the numbers the cards draw: six sprints of velocity, their sum and mean; the
// single-number forecast and the range from the fastest and slowest sprint
const VEL = [21, 25, 18, 30, 24, 22];
const LEFT = 120;
const sum = VEL.reduce((a, b) => a + b, 0);
assert(sum === 140 && Math.round((sum / VEL.length) * 10) / 10 === 23.3, 'six sprints: 140 points, 23.3 a sprint');
assert(Math.round((LEFT / (sum / VEL.length)) * 10) / 10 === 5.1 && Math.ceil(LEFT / (sum / VEL.length)) === 6, '120 / 23.3 = 5.1, so 6 sprints');
const FAST = Math.max(...VEL);
const SLOW = Math.min(...VEL);
assert(FAST === 30 && LEFT / FAST === 4, 'fastest: 120 / 30 = 4 sprints');
assert(SLOW === 18 && Math.round((LEFT / SLOW) * 10) / 10 === 6.7 && Math.ceil(LEFT / SLOW) === 7, 'slowest: 120 / 18 = 6.7, so 7 sprints');
assert(4 * 2 === 8 && 7 * 2 === 14 && 6 * 2 === 12, 'two-week sprints: 8 to 14 weeks, 6 sprints 12 weeks');
const FIB = [1, 2, 3, 5, 8, 13, 20, 40, 100];
assert(8 / 2 === 4, 'an 8 is about four times a 2');
const POKER = { first: [3, 5, 13], second: [8, 8, 8] };
assert(POKER.first.every((v) => FIB.includes(v)) && POKER.second.every((v) => FIB.includes(v)), 'the poker cards come from the deck');
assert(Math.min(...POKER.first) === 3 && Math.max(...POKER.first) === 13, 'the first round: 3 and 13 apart, as the lesson');

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

// the Product Backlog on the back wall: the ordered list at the left, a
// cutting area at the right where the epic is split
const BOARD = w.board({ x0: 34, x1: 196, z0: 104, z1: 204 });
const BA = BOARD.area;
const LIST = { x0: BA.x0 + 6, x1: BA.x0 + 82, v0: -BA.z1 + 18, pitch: 13, h: 10 };
const CUT = { x0: BA.x0 + 94, x1: BA.x1 - 6, v0: -BA.z1 + 22, v1: -BA.z1 + 64 };
const boardRules = `<g transform="${BOARD.face}">`
  + `<path class="pm-rule" d="M${BA.x0 + 4} ${-BA.z1 + 12}H${LIST.x1 + 4}M${BA.x0 + 88} ${-BA.z1 + 6}V${-BA.z0 - 4}"/>`
  + g('bCards', '') + '</g>';
const TABLE = { x: 96, y: 116, w: 150, d: 70, h: 74 };
const TZ = TABLE.h;
// the cast: who stands where (world cm), as in the Scrum film
const SPOT = {
  po: { x: 70, y: 152, along: 'y', look: 'po' },
  sm: { x: 272, y: 152, along: 'y', look: 'sm' },
  d1: { x: 216, y: 84, along: 'x', look: 'dev' },
  d2: { x: 262, y: 92, along: 'x', look: 'dev2' },
  d3: { x: 128, y: 224, along: 'x', look: 'dev2' },
  planner: { x: 222, y: 226, along: 'x' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map(r1)]));
const fig = (r) => scrumPerson(w, k, G, P, { ...SPOT[r], key: r[0] === 'd' ? 'devs' : r });
const world = [
  w.room(ROOM),
  w.clock(246, 180, 11),
  cueG('board', BOARD.svg + boardRules),
  fig('d1'),
  fig('d2'),
  w.chair({ x: 140, y: 102, back: -1 }),
  fig('po'),
  w.table(TABLE),
  w.laptop({ x: 200, y: 136, z: TZ, toward: -1 }),
  w.laptop({ x: 128, y: 150, z: TZ, toward: 1 }),
  w.stack({ x: 160, y: 158, z: TZ, n: 3 }),
  w.cup(232, 170, TZ),
  fig('sm'),
  fig('d3'),
  w.person({ ...SPOT.planner, role: 'planner' }),
  // the planning poker cards above the Developers' heads (drawn by stage.js)
  cueG('cards', g('pk', '')),
].join('');
for (const r of ['po', 'sm', 'devs', 'planner', 'board', 'cards']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['story', 'tmpl', 'ex1', 'why', 'threec', 'promise',
  'ac', 'ac3', 'noac', 'epic', 'pbi', 'errs', 'ask',
  'doors', 'p4', 'story3', 'crit3', 'result',
  'refine', 'slot', 'who', 'invest', 'letters', 'fail',
  'split', 'horiz', 'vert', 'dor', 'order',
  'prep', 'errs2', 'frames', 'cut3', 'slices', 'learn',
  'rel', 'sp', 'perteam', 'fib', 'doubt', 'origin',
  'poker', 'read', 'talk', 'vel', 'spread', 'goal', 'count',
  'vel6', 'when', 'single', 'range', 'weeks', 'grow'];
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
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const toward = (p, s) => [p[0], p[1] + 40, s];
const BOARD_AT = w.at([(BA.x0 + BA.x1) / 2, 0, (BA.z0 + BA.z1) / 2]).map(r1);
const BCAM = (s) => [BOARD_AT[0], BOARD_AT[1] + 30, s];
const CAM = [
  { from: [160, 205, 1], to: BCAM(1.1) },
  { from: BCAM(1.06), to: BCAM(1.12) },
  { from: toward(HEAD.planner, 1.02), to: toward(mid(HEAD.planner, HEAD.po), 1.08) },
  { from: [160, 205, 1], to: toward(mid(HEAD.d1, HEAD.po), 1.08) },
  { from: BCAM(1.04), to: BCAM(1.14) },
  { from: toward(HEAD.planner, 1.02), to: BCAM(1.12) },
  { from: [160, 205, 1], to: BCAM(1.1) },
  { from: toward(mid(HEAD.d1, HEAD.d3), 1.0), to: toward(mid(HEAD.d1, HEAD.d3), 1.08) },
  { from: BCAM(1.04), to: [160, 205, 1] },
];

// ---------------------------------------------------------------- the film
const C = {
  CUES, FIB, VEL, POKER,
  LIST: { ...LIST }, CUT: { ...CUT },
  HEADS: [HEAD.d1, HEAD.d2, HEAD.d3],
};
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.agile.backlog',
  title: { nl: 'Van idee tot sprintklaar', en: 'From idea to sprint-ready' },
  lessons: [ST, RF, PT],
  strictFocus: true,
  scenes: [
    sc('s1', ST, 1, { nl: 'De user story', en: 'The user story' }, [
      { nl: '{t:User story|User story}: wat een gebruiker wil, in eigen woorden.', en: '{t:User story|User story}: what a user wants, in their own words.', cue: { 'User story': 'story' }, focus: ['story', 'board'] },
      { nl: 'Sjabloon van Connextra, rond 2001: als …, wil ik …, zodat ….', en: 'Connextra’s template, around 2001: as a …, I want …, so that ….', focus: 'tmpl' },
      { nl: 'Als operator van lijn {n:3} wil ik met twee tikken een oorzaak kiezen, zodat …', en: 'As an operator on line {n:3}, I want to pick a cause in two taps, so that …', focus: 'ex1' },
      { nl: 'Het “zodat” is het belangrijkste deel: het zegt waarom.', en: 'The “so that” is the most important part: it says why.', focus: 'why' },
      { nl: 'Ron Jeffries, 2001: de {t:Drie C’s|drie C’s}.', en: 'Ron Jeffries, 2001: the {t:Three Cs|three Cs}.', cue: { 'Drie C’s': 'threec' }, focus: 'threec' },
      { nl: 'Een belofte van een gesprek, geen contract.', en: 'A promise of a conversation, not a contract.', focus: ['promise', 'planner', 'devs'] },
    ]),
    sc('s2', ST, 1, { nl: 'Criteria en epics', en: 'Criteria and epics' }, [
      { nl: '{t:Acceptatiecriteria|Acceptatiecriteria}: concreet en toetsbaar.', en: '{t:Acceptance criteria|Acceptance criteria}: concrete and testable.', cue: { Acceptatiecriteria: 'ac' }, focus: 'ac' },
      { nl: 'Hooguit {n:8} oorzaken, met handschoenen, binnen {n:1} minuut.', en: 'At most {n:8} causes, with gloves on, within {n:1} minute.', focus: 'ac3' },
      { nl: 'Zonder criteria: discussie bij de oplevering.', en: 'Without criteria: the argument at delivery.', focus: 'noac' },
      { nl: '{t:Epic|Epic}: te groot voor één sprint. Later knippen.', en: '{t:Epic|Epic}: too big for one sprint. Cut it later.', cue: { Epic: 'epic' }, focus: ['epic', 'board'] },
      { nl: 'Product Backlog-items. De Scrum Guide schrijft geen vorm voor.', en: 'Product Backlog items. The Scrum Guide prescribes no format.', focus: ['pbi', 'board', 'po'] },
      { nl: 'Fouten: een taak als story, geen “zodat”, “de gebruiker”.', en: 'Mistakes: a task as a story, no “so that”, “the user”.', focus: 'errs' },
      { nl: 'Vraag: wie merkt het als dit af is, en waaraan?', en: 'Ask: who notices when this is done, and how?', focus: 'ask' },
    ]),
    sc('s3', ST, 1, { nl: 'Voorbeeld: stalen deuren', en: 'Example: steel doors' }, [
      { nl: 'Een planner levert {n:30} pagina’s eisen.', en: 'A planner delivers {n:30} pages of requirements.', focus: ['doors', 'planner'] },
      { nl: 'Pagina {n:4}: de bezetting van alle machines. Wie, en waarvoor?', en: 'Page {n:4}: the load on all machines. Who, and what for?', focus: 'p4' },
      { nl: 'Na {n:10} minuten: per lasrobot, {n:5} werkdagen, zodat spoedorders passen.', en: 'After {n:10} minutes: per welding robot, {n:5} working days, so rush orders fit.', focus: ['story3', 'planner'] },
      { nl: 'Criteria: uren per dag, rood boven {n:90}%, elke {n:15} minuten.', en: 'Criteria: hours per day, red above {n:90}%, every {n:15} minutes.', focus: 'crit3' },
      { nl: 'Zo’n {n:25} stories; {n:6} pagina’s leveren niets op.', en: 'About {n:25} stories; {n:6} pages deliver nothing.', focus: ['result', 'board'] },
    ]),
    sc('s4', RF, 2, { nl: 'Refinement en INVEST', en: 'Refinement and INVEST' }, [
      { nl: '{t:Refinement|Refinement}: knippen, details, criteria, grootte.', en: '{t:Refinement|Refinement}: cutting, details, criteria, size.', cue: { Refinement: 'refine' }, focus: ['refine', 'board'] },
      { nl: 'Geen event; vaak een of twee uur per week.', en: 'Not an event; often an hour or two a week.', focus: 'slot' },
      { nl: 'De Developers schatten; de Product Owner legt uit.', en: 'The Developers size; the Product Owner explains.', focus: ['who', 'devs', 'po'] },
      { nl: '{t:INVEST|INVEST}, van Bill Wake, 2003.', en: '{t:INVEST|INVEST}, by Bill Wake, 2003.', cue: { INVEST: 'invest' }, focus: 'invest' },
      { nl: 'Los, bespreekbaar, waardevol, schatbaar, klein, testbaar.', en: 'Independent, negotiable, valuable, estimable, small, testable.', focus: 'letters' },
      { nl: 'Slecht op een letter? Dan weet je wat te doen.', en: 'Weak on a letter? Then you know what to do.', focus: 'fail' },
    ]),
    sc('s5', RF, 2, { nl: 'Verticaal knippen', en: 'Cutting vertically' }, [
      { nl: '{t:Story splitsen|Story splitsen}: elk stuk levert iets werkends op.', en: '{t:Story splitting|Story splitting}: each piece delivers something working.', cue: { 'Story splitsen': 'split' }, focus: ['split', 'board'] },
      { nl: 'Niet horizontaal in lagen: database, logica, scherm.', en: 'Not horizontally in layers: database, logic, screen.', focus: ['horiz', 'board'] },
      { nl: 'Wel verticaal: per stap, regel, lijn of product. Eenvoudigste eerst.', en: 'Vertically: by step, rule, line or product. Simplest first.', focus: ['vert', 'board'] },
      { nl: '{t:Definition of Ready|Definition of Ready}: niet uit de Scrum Guide, geen nieuwe poort.', en: '{t:Definition of Ready|Definition of Ready}: not in the Scrum Guide, no new gate.', cue: { 'Definition of Ready': 'dor' }, focus: 'dor' },
      { nl: '{t:Ordenen|Ordenen}: de Product Owner, op waarde, risico en afhankelijkheden.', en: '{t:Ordering|Ordering}: the Product Owner, by value, risk and dependencies.', cue: { Ordenen: 'order' }, focus: ['order', 'po', 'board'] },
    ]),
    sc('s6', RF, 2, { nl: 'Voorbeeld: de kozijnen', en: 'Example: the window frames' }, [
      { nl: 'Lean-blik: werkvoorbereiding. Zonder criteria loopt het vast.', en: 'Lean view: work preparation. Without criteria it gets stuck.', focus: 'prep' },
      { nl: 'Fouten: te ver vooruit, of niet. Klaar voor twee sprints?', en: 'Mistakes: too far ahead, or none. Ready for two sprints?', focus: 'errs2' },
      { nl: 'Kozijnen: orders automatisch over de zaagmachines.', en: 'Window frames: orders spread over the saws automatically.', focus: ['frames', 'planner'] },
      { nl: 'Geschat op {n:3} sprints: verticaal knippen.', en: 'Estimated at {n:3} sprints: cut vertically.', focus: ['cut3', 'board'] },
      { nl: '{n:1} zaag; alle {n:3}; spoedorders; omsteltijd.', en: '{n:1} saw; all {n:3}; rush orders; changeover time.', focus: ['slices', 'board'] },
      { nl: 'Story {n:1}: na {n:2} weken in gebruik. Het team leert direct.', en: 'Story {n:1}: in use after {n:2} weeks. The team learns at once.', focus: ['learn', 'board', 'planner'] },
    ]),
    sc('s7', PT, 3, { nl: 'Story points', en: 'Story points' }, [
      { nl: '{t:Relatief schatten|Relatief schatten}: vergelijken, niet uren.', en: '{t:Relative estimation|Relative estimation}: comparing, not hours.', cue: { 'Relatief schatten': 'rel' }, focus: 'rel' },
      { nl: '{t:Story points|Story points}: werk, complexiteit, onzekerheid. {n:8} ≈ {n:4} × {n:2}.', en: '{t:Story points|Story points}: work, complexity, uncertainty. {n:8} ≈ {n:4} × {n:2}.', cue: { 'Story points': 'sp' }, focus: ['sp', 'board'] },
      { nl: 'Per team: de {n:5} van A is niet de {n:5} van B.', en: 'Per team: A’s {n:5} is not B’s {n:5}.', focus: 'perteam' },
      { nl: 'De {t:Fibonacci-reeks|Fibonacci-reeks}: de gaten groeien mee.', en: 'The {t:Fibonacci sequence|Fibonacci sequence}: the gaps grow.', cue: { 'Fibonacci-reeks': 'fib' }, focus: 'fib' },
      { nl: 'Twijfel tussen {n:8} en {n:13}? Knip hem misschien.', en: 'Torn between {n:8} and {n:13}? Maybe cut it.', focus: 'doubt' },
      { nl: 'Eerst ideale dagen. Jeffries, 2019: spijt.', en: 'Ideal days first. Jeffries, 2019: sorry.', focus: 'origin' },
    ]),
    sc('s8', PT, 3, { nl: 'Poker en velocity', en: 'Poker and velocity' }, [
      { nl: '{t:Planning poker|Planning poker}: James Grenning, 2002.', en: '{t:Planning poker|Planning poker}: James Grenning, 2002.', cue: { 'Planning poker': 'poker' }, focus: ['poker', 'cards', 'devs'] },
      { nl: 'Voorlezen, stil kiezen, tegelijk omdraaien.', en: 'Read out, pick silently, turn over at once.', focus: ['read', 'cards', 'po'] },
      { nl: '{n:3} en {n:13}? Uitleggen, dan nog een ronde.', en: '{n:3} and {n:13}? Explain, then another round.', focus: ['talk', 'cards'] },
      { nl: '{t:Velocity|Velocity}: punten per sprint, af volgens de Definition of Done.', en: '{t:Velocity|Velocity}: points per sprint, done by the Definition of Done.', cue: { Velocity: 'vel' }, focus: 'vel' },
      { nl: '{n:18} tot {n:30} punten? Plan niet op {n:30}.', en: '{n:18} to {n:30} points? Don’t plan on {n:30}.', focus: 'spread' },
      { nl: 'Geen productiviteitsmaat: als doel gaan teams ruimer schatten.', en: 'No productivity measure: as a target, teams estimate high.', focus: 'goal' },
      { nl: 'Of tel items. Vraag: waarvoor zijn deze punten?', en: 'Or count items. Ask: what are these points for?', focus: 'count' },
    ]),
    sc('s9', PT, 3, { nl: 'Voorbeeld: de trekhaken', en: 'Example: the tow bars' }, [
      { nl: 'Velocity in {n:6} sprints: samen {n:140}, gemiddeld {n:23.3}.', en: 'Velocity in {n:6} sprints: {n:140} in all, {n:23.3} on average.', focus: 'vel6' },
      { nl: 'Nog {n:120} punten. Wanneer klaar?', en: '{n:120} points left. When will it be done?', focus: 'when' },
      { nl: '{n:120} / {n:23.3} = {n:5.1}: {n:6} sprints? Schijnzekerheid.', en: '{n:120} / {n:23.3} = {n:5.1}: {n:6} sprints? False certainty.', focus: 'single' },
      { nl: 'Snelste: {n:4} sprints. Traagste: {n:6.7}, dus {n:7}.', en: 'Fastest: {n:4} sprints. Slowest: {n:6.7}, so {n:7}.', focus: 'range' },
      { nl: '{n:4} tot {n:7} sprints: {n:8} tot {n:14} weken, waarschijnlijk {n:12}.', en: '{n:4} to {n:7} sprints: {n:8} to {n:14} weeks, most likely {n:12}.', focus: 'weeks' },
      { nl: 'Groeit de lijst, dan schuift het. Na elke sprint bijwerken.', en: 'If the list grows, it moves. Update after every sprint.', focus: ['grow', 'board'] },
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
// (nl_NL-alex, 2026-11-13). Read as written: story ("STOO-rie"), planning
// poker, INVEST ("IN-vest"), Connextra, Grenning, refinement, Product Owner,
// Product Backlog, Developers, Definition of Done and Sprint Planning (the
// Scrum film's rules), OEE (letters), Lean-consultant, werkvoorbereiding,
// werkhandschoenen, lasrobot, spoedorders, standaardprofielen, omsteltijd,
// productiviteitsmaat, verkoopdirecteur. New SAY rules in
// films/_kit/timeline.mjs (tested; recomputed for every film: no other film's
// spoken text changes): user story as "joezer story" (espeak-ng reads "uuzer"),
// stories as "story's" (it stresses "sto-RIES"), story points with the oj of
// "point" (it reads "po-ints"), epic as "eppik", velocity as "ve-lossetti"
// (it reads "VEE-loo-si-ti"), the Fibonacci-reeks as "Fiebo-natsjie reeks",
// Definition of Ready as "Deffi-nisjun of Reddi" (as the Done rule), Ron
// Jeffries, Bill Wake and James Grenning as their names sound (Djeffriz, Bil
// Weejk, Djeems), Card, Conversation en Confirmation and Extreme Programming
// in English sounds, the Scrum Guide before "schrijft" and "noemt" (Gaid, as
// the Scrum film's rule), and acceptatiecriteria, zaagmachines and trekhaken
// split at the head (it reads "ti" for "tsie" and stresses the end). In
// English, "three Cs" as "three C's" (en_GB reads "C S"). Said around because
// espeak-ng misreads them (they stay in the captions and on the cards):
// plantmanager (left to the card), sales-directeur ("de
// verkoopdirecteur"), a lower-case backlog ("de lijst"), "bovenste" (it reads
// "bovenstee": "de eerste items"), and a sentence that starts with "Eén". Years
// in words.
const SAY = [
  [ // s1 the user story
    { nl: 'Een {t:User story|user story} zegt wat een gebruiker wil, in eigen woorden.',
      en: 'A {t:User story|user story} says what a user wants, in their own words.' },
    { nl: 'Het sjabloon is van Connextra, rond tweeduizend een: als wie, wil ik wat, zodat waarom.',
      en: 'The template is Connextra\'s, around 2001: as a who, I want what, so that why.' },
    { nl: 'Als operator van lijn drie wil ik met twee tikken een oorzaak kiezen, zodat de ploegleider weet waar de tijd heen ging.',
      en: 'As an operator on line three, I want to pick a cause in two taps, so the shift leader knows where the time went.' },
    { nl: 'Dat zodat is het belangrijkste: het zegt waarom.',
      en: 'That so that matters most: it says why.' },
    { nl: 'Ron Jeffries van Extreme Programming beschreef in tweeduizend een de {t:Drie C’s|drie C’s}: Card, Conversation en Confirmation.',
      en: 'Ron Jeffries of Extreme Programming described the {t:Three Cs|three Cs} in 2001: Card, Conversation and Confirmation.' },
    { nl: 'Een kaartje als geheugensteun, details uit een gesprek, afspraken over de controle: een belofte, geen contract.',
      en: 'A card as a reminder, details from a conversation, agreed checks: a promise, not a contract.' },
  ],
  [ // s2 criteria and epics
    { nl: '{t:Acceptatiecriteria|Acceptatiecriteria} zijn concrete, toetsbare voorwaarden.',
      en: '{t:Acceptance criteria|Acceptance criteria} are concrete, testable conditions.' },
    { nl: 'Hier: hooguit acht oorzaken, met werkhandschoenen, binnen een minuut bij de ploegleider.',
      en: 'Here: at most eight causes, with work gloves on, at the shift leader within a minute.' },
    { nl: 'Zonder criteria begint de discussie pas bij de oplevering.',
      en: 'Without criteria, the argument only starts at delivery.' },
    { nl: 'Een {t:Epic|epic} is te groot voor één sprint, zoals OEE per lijn. Die knip je later.',
      en: 'An {t:Epic|epic} is too big for one sprint, like OEE per line. You cut it later.' },
    { nl: 'Stories en epics zijn Product Backlog-items; de Scrum Guide schrijft geen vorm voor.',
      en: 'Stories and epics are Product Backlog items; the Scrum Guide prescribes no format.' },
    { nl: 'Fouten: een taak als story, geen zodat, of de gebruiker als rol.',
      en: 'Mistakes: a task as a story, no so that, or the user as the role.' },
    { nl: 'Vraag bij elke story: wie merkt het als dit af is, en waaraan?',
      en: 'Ask of every story: who notices when this is done, and how?' },
  ],
  [ // s3 the steel-door example
    { nl: 'Een planner bij een fabrikant van stalen deuren levert dertig pagina\'s eisen.',
      en: 'A planner at a steel-door maker hands in thirty pages of requirements.' },
    { nl: 'Pagina vier: toon de bezetting van alle machines. Wie heeft dat nodig, en waarvoor?',
      en: 'Page four: show the load on all machines. Who needs that, and what for?' },
    { nl: 'Na tien minuten: als planner wil ik per lasrobot de bezetting voor vijf werkdagen zien, zodat ik spoedorders op een robot met ruimte zet.',
      en: 'After ten minutes: as a planner I want each welding robot\'s load for five working days, so I can put rush orders on a robot with room.' },
    { nl: 'Criteria: uren per dag, rood boven negentig procent, elk kwartier ververst.',
      en: 'Criteria: hours per day, red above ninety percent, refreshed every fifteen minutes.' },
    { nl: 'Van dertig pagina\'s blijven zo\'n vijfentwintig stories over; zes pagina\'s leveren niemand iets op.',
      en: 'Thirty pages become about twenty-five stories; six pages deliver nothing to anyone.' },
  ],
  [ // s4 refinement and INVEST
    { nl: '{t:Refinement|Refinement} is de Product Backlog doorlopend verfijnen: knippen, details en criteria toevoegen, grootte inschatten.',
      en: '{t:Refinement|Refinement} is ongoing work on the Product Backlog: cutting items, adding details and criteria, sizing.' },
    { nl: 'Het is geen event; vaak een vast moment van een of twee uur per week.',
      en: 'Not a separate event; often a fixed slot of an hour or two a week.' },
    { nl: 'De Developers schatten de grootte; de Product Owner legt uit wat nodig is en waarom.',
      en: 'The Developers who do the work size it; the Product Owner explains what and why.' },
    { nl: 'Een bekende checklist is {t:INVEST|INVEST}, van Bill Wake uit tweeduizend drie.',
      en: 'A known checklist is {t:INVEST|INVEST}, by Bill Wake, 2003.' },
    { nl: 'Los van andere stories, bespreekbaar, waardevol, te schatten, klein en testbaar.',
      en: 'Independent, negotiable, valuable, estimable, small, testable.' },
    { nl: 'Scoort een story slecht op een letter, dan weet je wat je moet doen.',
      en: 'A weak letter tells you what to do in refinement.' },
  ],
  [ // s5 splitting, ready and ordering
    { nl: 'Het lastigste is {t:Story splitsen|story splitsen}: kleinere stories die elk iets werkends opleveren.',
      en: 'The hardest part is {t:Story splitting|story splitting}: smaller stories that each deliver something working.' },
    { nl: 'Niet horizontaal in lagen, database, logica, scherm: dan heeft de gebruiker niets.',
      en: 'Not horizontally into layers, database, logic, screen: then the user gets nothing.' },
    { nl: 'Wel verticaal, als plakjes taart: per stap, regel, lijn of soort product. Eerst het eenvoudigste.',
      en: 'Vertically, like slices of cake: by step, rule, line or product type. The simplest first.' },
    { nl: 'Een {t:Definition of Ready|Definition of Ready} zegt wanneer een story klaar is voor een sprint. De Scrum Guide noemt hem niet; maak er geen poort van.',
      en: 'A {t:Definition of Ready|Definition of Ready} says when a story is ready for a sprint. It is not in the Scrum Guide; don\'t make it a gate.' },
    { nl: '{t:Ordenen|Ordenen} doet de Product Owner: op waarde, risico en afhankelijkheden.',
      en: '{t:Ordering|Ordering} is the Product Owner\'s job: by value, risk and dependencies.' },
  ],
  [ // s6 work preparation, mistakes, and the window frames
    { nl: 'Voor jou als Lean-consultant: refinement is werkvoorbereiding; zonder criteria loopt een story vast.',
      en: 'For you as a Lean consultant: refinement is work preparation; without criteria, a story gets stuck.' },
    { nl: 'Fouten: ver vooruit verfijnen, of niet, zodat de Sprint Planning uren duurt.',
      en: 'Mistakes: refining far ahead, or not at all, so Sprint Planning takes hours.' },
    { nl: 'Voorbeeld: kozijnen. Als planner wil ik dat het systeem de orders over de zaagmachines verdeelt, zodat ik geen uur per dag puzzel.',
      en: 'Example: window frames. As a planner I want orders spread over the saws automatically, so I don\'t puzzle an hour a day.' },
    { nl: 'Het team schat drie sprints. Dus knip je verticaal.',
      en: 'The team estimates three sprints. So you cut vertically.' },
    { nl: 'Eerst één zaag, alleen standaardprofielen; dan alle drie, spoedorders en omsteltijd.',
      en: 'First one saw, standard profiles only; then all three, rush orders, changeover time.' },
    { nl: 'Story één past in één sprint: na twee weken werkt de planner ermee, en leert het team of de regels kloppen.',
      en: 'Story one fits a sprint: in use after two weeks, and the team learns whether the rules are right.' },
  ],
  [ // s7 relative estimation and story points
    { nl: 'Mensen schatten slecht in uren, maar vergelijken redelijk. Dat is {t:Relatief schatten|relatief schatten}.',
      en: 'People are bad at hours but fair at comparing. That is {t:Relative estimation|relative estimation}.' },
    { nl: '{t:Story points|Story points} geven de grootte: werk, complexiteit en onzekerheid samen. Een acht is zo\'n vier keer een twee.',
      en: '{t:Story points|Story points} give the size: work, complexity and uncertainty together. An eight is about four times a two.' },
    { nl: 'Punten zijn per team: de vijf van A is niet de vijf van B.',
      en: 'Points are per team: A\'s five is not B\'s five.' },
    { nl: 'Teams kiezen uit een aangepaste {t:Fibonacci-reeks|Fibonacci-reeks}: de gaten groeien mee.',
      en: 'Teams pick from a modified {t:Fibonacci sequence|Fibonacci sequence}: the gaps grow.' },
    { nl: 'Twijfel tussen acht en dertien? Groot en onzeker: knip hem misschien.',
      en: 'Torn between eight and thirteen? Big and uncertain: maybe cut it.' },
    { nl: 'Punten waren eerst ideale dagen. Ron Jeffries schreef in tweeduizend negentien, half als grap, dat hij ze misschien bedacht, en dat het hem spijt.',
      en: 'Points began as ideal days. Ron Jeffries wrote in 2019, half joking, that he may have invented them and is sorry.' },
  ],
  [ // s8 planning poker and velocity
    { nl: '{t:Planning poker|Planning poker}, van James Grenning uit tweeduizend twee: samen schatten met kaarten.',
      en: '{t:Planning poker|Planning poker}, described by James Grenning in 2002: estimating together with cards.' },
    { nl: 'De Product Owner leest een story voor; iedereen kiest stil en draait tegelijk om.',
      en: 'The Product Owner reads a story; all pick silently and turn over at once.' },
    { nl: 'Drie en dertien? Hoogste en laagste leggen uit waarom: dat gesprek is de waarde. Dan nog een ronde.',
      en: 'Three and thirteen? Highest and lowest explain why: that conversation is the value. Then another round.' },
    { nl: '{t:Velocity|Velocity} is wat een team per sprint afmaakt, volgens de Definition of Done.',
      en: '{t:Velocity|Velocity} is the points a team finishes per sprint, by the Definition of Done.' },
    { nl: 'Gebruik de spreiding: haalt een team achttien tot dertig, plan dan niet op dertig.',
      en: 'Use the spread: a team doing eighteen to thirty is not planned at thirty.' },
    { nl: 'Geen productiviteitsmaat: maak je er een doel van, dan schatten teams ruimer.',
      en: 'Not a productivity measure: make it a target, and estimates grow.' },
    { nl: 'Sommigen tellen liever items. Vraag: waarvoor zijn deze punten?',
      en: 'Some just count items. Ask: what are these points for?' },
  ],
  [ // s9 the tow-bar example
    { nl: 'Trekhaken: zes sprints van achttien tot dertig punten, gemiddeld drieëntwintig komma drie.',
      en: 'Tow bars: six sprints of eighteen to thirty points, twenty-three point three on average.' },
    { nl: 'Nog honderdtwintig punten. De verkoopdirecteur vraagt: wanneer is het klaar?',
      en: 'A hundred and twenty points left. The sales director asks: when is it done?' },
    { nl: 'Zes sprints, zegt het gemiddelde: schijnzekerheid.',
      en: 'Six sprints, says the average: a false certainty.' },
    { nl: 'Met de snelste sprint: vier sprints. Met de traagste: zes komma zeven, dus zeven.',
      en: 'At the fastest sprint: four sprints. At the slowest: six point seven, so seven.' },
    { nl: 'Vier tot zeven sprints: acht tot veertien weken, waarschijnlijk twaalf.',
      en: 'Four to seven sprints: eight to fourteen weeks, most likely twelve.' },
    { nl: 'Alleen als de lijst niet groeit, en die groeit bijna altijd. Werk de bandbreedte elke sprint bij.',
      en: 'Only if the list doesn\'t grow, and it nearly always does. Update the range every sprint.' },
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
  nl: /\b(\w*manager\w*|user|stories|points|epics?|velocity|Velocity|Fibonacci|Ready|Jeffries|Wake|James|Guide|backlog|bovenste|Owner|Backlog|Developers?|refinement|Refinement|acceptatiecriteria|Acceptatiecriteria|zaagmachines|trekhaken|sales\w*|e-?mail)\b|(^|[.?!;]\s)Eén\b/,
  en: /\bthree Cs\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (lang === 'nl' && /\d/.test(said)) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
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

const PEOPLE = ':is([data-cue="po"],[data-cue="sm"],[data-cue="devs"],[data-cue="planner"])';
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
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.5}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
.pm-pk{fill:var(--anatomy-face);stroke:var(--anatomy-strong);stroke-width:1.4}
.pm-pkb{fill:var(--anatomy-mid);stroke:var(--anatomy-strong);stroke-width:1.4}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-pk{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'De teamruimte van de Scrum-film. Aan de achterwand de Product Backlog: links een geordende kolom kaartjes, de huidige story in de accentkleur; rechts een vlak waar een epic eerst horizontaal in drie lagen wordt geknipt en doorgestreept, en daarna verticaal in vier plakjes die bovenaan de lijst schuiven. In de scènes over schatten krijgt elk kaartje een blokje voor zijn grootte. Aan het linkereind van de tafel de Product Owner met een tablet, aan het rechtereind de Scrum Master, drie Developers, en vooraan de planner, de gebruiker van wie de stories komen. Bij planning poker verschijnen kaarten boven de hoofden van de Developers: eerst de rugzijde, dan drie, vijf en dertien, dan een tweede ronde. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: de user story en de drie C’s; criteria en epics; de stalen deuren; refinement en INVEST; verticaal knippen, Definition of Ready en ordenen; de kozijnen; story points en de Fibonacci-reeks; planning poker en velocity; en de trekhaken.',
  en: 'The Scrum film\'s team room. On the back wall the Product Backlog: at the left an ordered column of cards, the current story in the accent colour; at the right an area where an epic is first cut horizontally into three layers and crossed out, then vertically into four slices that move to the top of the list. In the estimating scenes each card gets a block for its size. At the left end of the table the Product Owner with a tablet, at the right end the Scrum Master, three Developers, and in front the planner, the user the stories come from. At planning poker, cards appear above the Developers\' heads: first face down, then three, five and thirteen, then a second round. At the right a panel with one card per scene, marked as example or diagram: the user story and the three Cs; criteria and epics; the steel doors; refinement and INVEST; cutting vertically, the Definition of Ready and ordering; the window frames; story points and the Fibonacci sequence; planning poker and velocity; and the tow bars.',
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

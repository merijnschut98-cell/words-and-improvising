// Dev tool, not shipped. Builds the explainer film "Vastgelopen: welk soort
// probleem? / Stuck: which kind of problem?" for the Projects course:
// pm.stuck.diagnose (level 1 of Diagnose: waarom het vastzit, Het probleem
// benoemen), pm.stuck.experiment (level 3 of Als je het niet weet, Handelen
// onder onzekerheid) and pm.stuck.reset (level 3 of Herstarten met de sponsor,
// Een vastgelopen project herstarten).
//
//   node films/pm.stuck.diagnose/build.mjs            build the page
//   node films/pm.stuck.diagnose/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.stuck.diagnose.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.stuck.diagnose, P3): four problem types sorted; a reversible experiment;
// a restart. Storyboard drift: the plan's three scenes are nine, three per
// lesson, because the film carries the whole text of all three lessons and
// their worked examples (lessons with a film no longer show their example):
// the four kinds and the quick diagnostic (s1), symptoms, fixes, the chain and
// noticing it early (s2), the week-7 design workshop (s3); reversible or not
// (s4), the small experiment and saying yes (s5), the call ahead and the
// safety limit (s6); drifting, sunk cost and the honest page (s7), the
// conversation and the new deal (s8), week 14 of 20 (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard, a wall clock and a calendar strip of
// twenty weeks that rings the week a scene is about (and, in the reset scenes,
// a status dot: green over a red core for the watermelon, amber in the
// example), a table with a sheet that fills in when a page is written, and the
// recurring cast: "jij" the consultant in petrol at the board, the sponsor,
// the team lead (the head of execution in the week-7 example) and the planner
// (the head of planning). The CAST looks fit every role here, so the film has
// no figures of its own. A panel at the right, in stage space, carries one card
// per scene, labelled "schema" (a general picture) or "voorbeeld" (the worked
// examples); the board in the room repeats it in miniature.
//
// Facts: the film says only what the lessons say. It credits one outside
// source, as the experiment lesson does: Jeff Bezos's letter to shareholders
// for 2015 (published April 2016) describes reversible ("Type 2", two-way
// door) decisions that small groups should make fast; checked against the
// letter. The five safety rules are those of EN 50110-1, which NEN 3140
// applies in the Netherlands, in the lesson's words; the English lesson now
// uses the switchgear lesson's and eng.switchgear.fiverules' English (verify
// absence of voltage; protect against adjacent live parts). No problem-type model is
// credited to anyone (the four kinds are the lesson's own; Cynefin is a
// separate lesson, pm.stuck.cynefin, and is not named here).
//
// Checklist (lesson point: scene, beat). "Card" marks a point carried by the
// panel card (on screen for at least the whole beat, 4 s or more) rather than
// by the caption or the narration.
//   diagnose teach 1: stuck projects feel the same from inside, nothing moves;
//     four kinds, each with its own fix (s1 b1); unclear goal, people disagree
//     on success; unclear way, goal clear, nobody knows how (s1 b2); people
//     problem, someone whose yes you need isn't giving it; capacity problem,
//     everyone agrees, nobody has time (s1 b3)
//   diagnose teach 2: the quick diagnostic, four questions: would the sponsor
//     (the manager who owns the project) and the team write the same goal in
//     one sentence; the next three steps; support we need and lack; the hours
//     in their week (s1 b4); the first no is usually where you start (s1 b5)
//   diagnose teach 3: symptoms; goal: long debates about solutions, sponsor
//     changing direction, every design workshop reopening the last (s2 b1);
//     way: analysis loops, waiting for data; people: one person's actions slip,
//     silence in meetings, "we'll see" (s2 b2); capacity: everyone slips,
//     meetings cancelled, the project lives in the evening hours (s2 b3)
//   diagnose teach 4: fixes: goal back to the sponsor to choose; way a small
//     experiment or an expert; people a one-on-one; capacity a trade-off by
//     the sponsor, what gets less time so this gets more (s2 b4, "door de
//     sponsor" in the narration, card "what gets less time?" up 4 s or more); the classic mistake, a goal problem treated as a
//     people problem and pushing harder; two kinds mixed, start with the
//     earliest in the chain: goal, way, people, capacity (s2 b5, the chain on
//     the card)
//   diagnose teach 5: notice it early, "about to" do the same thing for two
//     weeks; week 3 instead of week 9 is the skill (s2 b6); experts argue:
//     nearly every stuck project a people problem, or "resistance" blames
//     people for a decision nobody took; "which decision is nobody taking?"
//     (s2 b7)
//   diagnose example: week 7, a grid operator, a readiness check for planned
//     jobs (has a job everything before it is released, handed to a crew), the
//     third design workshop (s3 b1); head of planning strict, blocks a job
//     without a confirmed switching plan and material (the plan's gloss, the
//     steps for switching grid parts safely, is not repeated); head of execution light, "strict means
//     even later" (s3 b2); sponsor "just make it work"; the team tired; looks
//     like a design debate, is an unclear goal (s3 b3); strict serves fewer
//     cancellations, light faster release; another workshop won't settle it,
//     as each optimises for something else (s3 b4, the two "serves" lines); one page with the two goals
//     and what each design does to cancellations and release time (card: the
//     arrows per design); tell both heads beforehand (s3 b5); the sponsor chooses or sets a target for both,
//     cancellations under 8% while release takes at most 2 days longer; then
//     design against it (s3 b6)
//   experiment teach 1: certainty is rare; not "are we sure?" but the cost of
//     being wrong and can we undo it (s4 b1); reversible: a meeting format, a
//     planning rule, a board on the wall, decide fast and test (s4 b2);
//     irreversible: buying a machine, changing a shift contract, announcing a
//     reorganisation, slow careful analysis (s4 b3; the full lists on the
//     card); two-way and one-way doors (the two doors of the card, labelled two-way and
//     one-way from s4 b4). Not said: the pointers to the Run and Leading-outside-your-
//     field lessons (navigation, not content).
//   experiment teach 2: a small experiment, time-boxed with a measure; a
//     hypothesis, a guess a test can prove wrong (s5 b1); "if planners confirm
//     crew and material two days ahead, cancellations drop"; smallest test:
//     two planners, two weeks, about 40 jobs; what you measure, against what
//     (s5 b2, card); the stop criterion agreed before you start, what means continue
//     and what means stop (s5 b3)
//   experiment teach 3: experiments lower resistance, "two weeks, then decide
//     together" against "from Monday" (card); keep the promise, evaluate openly,
//     really stop (s5 b4); typical failures: no comparison group, two changes
//     at once, a test team with so much attention it works only there (s5 b5)
//   experiment teach 4: Bezos, letter for 2015, April 2016: reversible
//     decisions are two-way doors small groups should make fast (s4 b4; the
//     years on the card);
//     critics: small changes are socially hard to undo once people are used to
//     them; ask what going back costs in money and trust (s4 b5); "we don't
//     know yet, this is the smallest thing that tells us" (s5 b2)
//   experiment teach 5: never experiment with safety: switching procedures,
//     lockout (a machine's energy locked off with a personal padlock, card),
//     whatever the pressure (card) (s6 b5); the five safety rules for
//     electrical work (NEN 3140 and EN 50110, card) (s6 b6); the
//     rules in the lesson's words and order, as eng.switchgear.fiverules
//     (card, long ones on two lines, no abbreviations): vrijschakelen,
//     beveiligen tegen herinschakelen, spanningsloosheid vaststellen, aarden en
//     kortsluiten, naastgelegen delen onder spanning afschermen; disconnect,
//     secure against reconnection, verify absence of voltage, earth and
//     short-circuit, protect against adjacent live parts (s6 b6)
//   experiment example: a grid operator, three weeks of debate on planners
//     calling the contractor two days ahead (the gloss of contractor, the firm
//     whose crews do the work, is not repeated) to confirm crew and material; eats planner time or cuts
//     cancellations; no data; cancellations 16% (s6 b1); reversible and cheap,
//     so test: two planners call ahead for two weeks on about 40 jobs, the
//     others as usual; measure cancellations in both (card) and minutes per
//     call (s6 b2, b3); agreed in advance: a drop of at least a third, to about 11% or
//     lower, and calls under 10 minutes, roll out, else stop (s6 b3); 6
//     minutes a call, 40 jobs 4 hours, small next to one cancelled crew day;
//     tell the team it is a test, present the result together (s6 b4,
//     narration and card)
//   reset teach 1: projects rarely fail suddenly, they drift; halfway, hoping
//     to catch up is the most common and most expensive choice (s7 b1); sunk
//     cost: what is spent feels like a reason to go on, only future costs and
//     benefits count (s7 b2); a reset, stopping to look honestly and agreeing a
//     new deal (s7 b3). Not said: the pointer to the Run lesson (navigation).
//   reset teach 2: the honest page: plan versus reality on goal, scope, time,
//     people, results; causes with the four kinds (s7 b3, card); the RAG status, red,
//     amber or green in the status report; green for weeks while the goal
//     slips is a watermelon, green outside, red inside; amber that never turns
//     red, the same trap (s7 b4, card); your own part, "I should have escalated the
//     capacity issue in week 4" (s7 b5)
//   reset teach 3: your own manager first, then the sponsor for 45 minutes;
//     open plainly, "as set up, this project won't reach its goal" (s8 b1),
//     with what you see, its cause and three options (narration s8 b2): stop and hand over what works, shrink
//     the scope and finish properly, re-plan with new conditions (s8 b2)
//   reset teach 4: re-contracting, the new deal in writing: goal sentence,
//     scope, end date, roles, what the sponsor commits to (every steering
//     group, freeing two planners, card) (s8 b3); a check-in point, an agreed moment
//     and criterion, "not at X by week 20: we stop"; a reset that only moves
//     dates fails again (s8 b4)
//   reset teach 5: uncomfortable, maybe shameful, do it anyway; sponsors often
//     relieved; experts differ on a new lead (a fresh face, or the lead who
//     named it has earned trust, card); "knowing what we know, would we start
//     this project today?" (s8 b5, caption, narration and card). Not said: "maybe shameful", "they felt it
//     too, and nobody said it" (the relief carries it).
//   reset example: week 14 of 20, a grid operator, halve the time from job
//     request to release in three regions; the pilot in one region, release
//     10% faster (s9 b1); the sponsor at one of four steering groups, two key
//     planners left in month two, not replaced; the team reports amber; the
//     honest page: mainly capacity and people; your part, raising the planners
//     leaving in month two (s9 b2: the causes in the narration, causes and
//     own part on the card through s9 b3; amber is "at risk" on the card);
//     manager first, then the sponsor for 45 minutes (as taught in s8 b1);
//     A stop and hand over the pilot region's work; B the pilot region only, a 40% cut, six weeks; C all three
//     regions with two extra planners and the sponsor at every steering group,
//     ten weeks later (s9 b3); recommend B unless she can really commit to C;
//     the new deal in writing with a check-in point (s9 b4)
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The three lessons' facts, asserted against their current text (the build
// fails if one drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const DG = 'pm.stuck.diagnose';
const EX = 'pm.stuck.experiment';
const RS = 'pm.stuck.reset';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return [...l.teach, l.example.text, l.example.reveal || ''].join('\n'); };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
for (const id of [DG, EX, RS]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.stuck.diagnose', `${id} (${lang}) already names another film`);
says(DG, ['voelen van binnen hetzelfde: er beweegt niks', 'vier soorten vastzitten, elk met een eigen oplossing', 'mensen zijn het oneens over wat succes is', 'het doel is helder, niemand weet hoe',
  'iemand wiens ja je nodig hebt, geeft hem niet', 'iedereen is het eens, niemand heeft tijd', 'de manager die eigenaar is van het project', 'hetzelfde doel in één zin', 'de volgende drie stappen',
  'wiens steun we nodig hebben en niet hebben', 'echt de uren in hun week', 'Het eerste “nee” is meestal waar je begint', 'lange discussies over oplossingen, een sponsor die van richting wisselt',
  'die de vorige weer openbreekt', 'analyses die rondjes draaien, wachten op meer data', 'de acties van één persoon lopen uit, stilte in overleggen, “we zien wel”', 'iedereen loopt uit, overleggen worden afgezegd, het project leeft in de avonduren',
  'terug naar de sponsor om te kiezen', 'een klein experiment of een expert', 'een één-op-ééngesprek', 'die besluit wat minder tijd krijgt zodat dit meer krijgt',
  'een doelprobleem behandelen als een mensenprobleem en harder duwen', 'begin dan bij de vroegste in de keten: doel, weg, mensen, capaciteit',
  'al twee weken “op het punt” hetzelfde te doen', 'week 3 zien in plaats van in week 9', 'bijna elk vastgelopen project eigenlijk een mensenprobleem', 'mensen de schuld geeft van een besluit dat niemand nam', '“Welk besluit neemt niemand?”',
  'Week 7 bij een netbeheerder', 'gereedheidscheck', 'voordat hij wordt vrijgegeven, aan een monteursploeg overgedragen', 'Dit is de derde ontwerpsessie', 'zonder bevestigd schakelplan', 'en zonder materiaal',
  'streng betekent dat klussen nog later worden vrijgegeven', '“Zorg gewoon dat het werkt.”', 'Het team raakt moe', 'Dit lijkt een ontwerpdiscussie, maar het is een onduidelijk doel',
  'Streng dient “minder afzeggingen”; licht dient “sneller vrijgeven”', 'ze optimaliseren voor verschillende dingen', 'Schrijf één A4 met de twee doelen en wat elk ontwerp doet met afzeggingen en vrijgavetijd',
  'afzeggingen onder de 8% terwijl het vrijgeven hooguit 2 dagen langer duurt', 'Vertel beide hoofden vooraf dat je dit doet', 'Ontwerp daarna tegen het gekozen doel']);
says(EX, ['Zekerheid krijg je zelden', 'wat kost het als we het mis hebben, en kunnen we het terugdraaien?', 'een nieuw overlegformat, een planningsregel of een bord aan de muur', 'een machine kopen, een ploegencontract wijzigen of een reorganisatie aankondigen',
  'trage, zorgvuldige analyse', 'two-way en one-way doors', 'een test met een vaste duur en een meting', 'een vermoeden dat een test kan weerleggen', 'Als planners ploeg en materiaal twee dagen vooraf bevestigen, dalen de afzeggingen',
  'twee planners, twee weken, ongeveer 40 klussen', 'Wat je meet, en waartegen', 'welke uitkomst doorgaan betekent en welke stoppen', 'Experimenten verlagen weerstand', '“vanaf maandag is dit de nieuwe manier”',
  'evalueer open, en stop ook echt als het niet werkt', 'geen vergelijkingsgroep (control group), twee veranderingen tegelijk', 'zoveel aandacht krijgt dat het daar werkt en nergens anders',
  'Jeff Bezos noemde omkeerbare besluiten in zijn aandeelhoudersbrief over 2015, verschenen in april 2016, “two-way doors”', 'die kleine groepen snel mogen nemen', 'sociaal moeilijk terug te draaien',
  '“Wat kost teruggaan, in geld en in vertrouwen?”', 'Dit is het kleinste wat het ons kan vertellen', 'experimenteer nooit met veiligheid', 'Schakelprocedures, vergrendeling', 'met een persoonlijk hangslot',
  'NEN 3140 en de Europese norm EN 50110', 'vrijschakelen; beveiligen tegen herinschakelen; spanningsloosheid vaststellen; aarden en kortsluiten; naastgelegen delen onder spanning afschermen',
  'al drie weken', 'de aannemer (contractor)', 'twee dagen voor elke klus moeten bellen om ploeg en materiaal te bevestigen', 'plannerstijd opvreet', 'Er is geen data', '16% van de geplande klussen',
  'Dit is omkeerbaar en goedkoop', 'Twee planners bellen twee weken lang vooraf bij ongeveer 40 klussen; de andere planners werken zoals altijd', 'de afzeggingen in beide groepen en de minuten per belletje',
  'met minstens een derde, naar ongeveer 11% of lager', 'minder dan 10 minuten', 'anders stoppen we', 'Bij 6 minuten per belletje kosten 40 klussen 4 uur, weinig naast één afgezegde ploegdag', 'dat het een test is, en presenteer de uitkomst samen']);
says(RS, ['Projecten mislukken zelden plotseling; ze drijven af', 'de meest gemaakte en duurste keuze', 'verzonken kosten', 'alleen toekomstige kosten en baten zouden moeten tellen', 'stoppen om eerlijk te kijken en een nieuwe afspraak maken',
  'op één A4', 'Plan tegenover werkelijkheid op doel, scope, tijd, mensen en resultaten', 'de vier soorten vastzitten: doel, weg, mensen, capaciteit', 'de kleur rood, oranje of groen in het statusrapport',
  '“watermeloen”: groen van buiten, rood van binnen', 'Oranje dat nooit rood wordt, is dezelfde valkuil', '“Ik had het capaciteitsprobleem in week 4 moeten escaleren.”', 'Praat eerst met je eigen manager', 'de sponsor om 45 minuten',
  'zoals het nu is opgezet, haalt dit project zijn doel niet', 'stoppen en overdragen wat werkt; de scope verkleinen en het goed afmaken; opnieuw plannen onder nieuwe voorwaarden',
  'een nieuwe doelzin, scope, einddatum, rollen, en waar de sponsor zich aan verbindt', 'bij elke stuurgroep zijn of twee planners vrijmaken', 'een afgesproken moment en criterium', '“Als we in week 20 niet op X zitten, stoppen we.”',
  'Een herstart die alleen datums verschuift, mislukt een tweede keer', 'misschien zelfs beschamend. Doe het toch', 'Sponsors zijn vaak opgelucht', 'een nieuwe projectleider', 'een nieuw gezicht', 'juist vertrouwen heeft verdiend',
  '“Met wat we nu weten, zouden we dit project vandaag starten?”', 'Week 14 van 20 bij een netbeheerder', 'halveren in drie regio’s', 'de pilot draait in één regio; de vrijgavetijd is 10% korter', 'de sponsor was bij één van de vier stuurgroepen',
  'twee belangrijke planners vertrokken in maand twee en zijn niet vervangen', 'Het team rapporteert nog steeds oranje', 'Vooral capaciteit (twee planners weg) en mensen (een afwezige sponsor)', 'in maand twee moeten aankaarten',
  'A: nu stoppen en overdragen wat in de pilotregio werkt', 'B: terug naar de pilotregio, daar 40% korter als doel, in zes weken goed afronden', 'C: alle drie de regio’s met twee extra planners en de sponsor bij elke stuurgroep, einddatum tien weken later',
  'Adviseer B, tenzij zij zich echt aan C kan verbinden', 'met een ijkmoment']);
says(EX, ['letter to shareholders for 2015, published in April 2016', 'two planners, two weeks, about 40 jobs', 'to about 11% or lower', 'under 10 minutes', 'At 6 minutes a call, 40 jobs cost 4 hours'], 'en');
says(RS, ['Week 14 of 20', 'release time is down 10%', 'aim for a 40% cut there, finish properly in six weeks', 'end date ten weeks later'], 'en');
says(DG, ['cancellations under 8% while release takes no more than 2 days longer'], 'en');
// the call-ahead test: 40 calls of 6 minutes are 4 hours; a drop of a third from 16% lands near 11%
const CALLS = 40;
const MIN = 6;
assert((CALLS * MIN) / 60 === 4, '40 calls of 6 minutes: 4 hours');
const BASE = 16;
assert(Math.round(BASE * (2 / 3)) === 11, 'a third off 16%: about 11%');
const WEEK = { now: 14, of: 20 };

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 12, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const WEEKS = WEEK.of;
const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const CAL = w.calendar({ y0: 50, z0: 118, weeks: WEEKS, cw: 8.4, ch: 24 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 186, y: 146, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([196, 161, TZ]);
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
// the calendar's week cells (local u, v of the side wall) and a point on its header for the status dot
const CELLS = Array.from({ length: WEEKS }, (_, i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const HEAD = [Math.round((CELLS[WEEKS - 1][2] - 6) * 10) / 10, Math.round((CELLS[0][1] - 6) * 10) / 10];
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
// the sheet on the table: its lines fill in when a page is written
const sheetLines = `<g transform="${SHEET.face}">${g('dLines', '')}</g>`;

const world = [
  w.room(ROOM),
  w.clock(266, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calMarks),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  w.stack({ x: 112, y: 132, z: TZ, n: 3 }),
  cueG('paper', SHEET.svg + sheetLines),
  w.cup(150, 176, TZ),
  w.cup(234, 128, TZ),
  w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each part of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['goal', 'way', 'people', 'cap', 'first', 'trade', 'mistake', 'chain', 'early', 'debate', 'ask',
  'check', 'verdict', 'strict', 'light', 'page', 'target',
  'certain', 'rev', 'irrev', 'bezos', 'back', 'exp', 'hyp', 'test', 'stop', 'yes', 'fails', 'case', 'crit', 'cost', 'safety', 'rules',
  'drift', 'sunk', 'reset', 'rag', 'own', 'talk', 'opts', 'recon', 'ijk', 'relief', 'causes', 'advice'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '')
  + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));

// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.run.scope): the same points, fewer bytes; each rewrite is read back.
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
const CAM = [
  { from: [150, 210, 1], to: [130, 195, 1.08] },
  { from: [140, 200, 1.04], to: [110, 180, 1.12] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.04], to: [SHEET_AT[0], SHEET_AT[1], 1.14] },
  { from: [150, 200, 1.02], to: [140, 190, 1.08] },
  { from: [180, 210, 1.04], to: [190, 220, 1.1] },
  { from: [150, 190, 1.06], to: [140, 200, 1.1] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.02], to: [SHEET_AT[0], SHEET_AT[1], 1.12] },
  { from: [210, 190, 1.04], to: [200, 180, 1.12] },
  { from: [120, 200, 1.06], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is fitted to its narration below
const DURS = [30, 40, 34, 30, 32, 34, 30, 32, 30];
const C = { PX, PW, CUES, CELLS, HEAD, dur: DURS };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, dur: DURS[Number(id.slice(1)) - 1], still: 0.9, title, beats });
const spec = {
  id: 'pm.stuck.diagnose',
  title: { nl: 'Vastgelopen: welk soort probleem?', en: 'Stuck: which kind of problem?' },
  lessons: [DG, EX, RS],
  strictFocus: true,
  scenes: [
    sc('s1', DG, 1, { nl: 'Vier soorten vastzitten', en: 'Four kinds of stuck' }, [
      { nl: 'Vastgelopen voelt altijd hetzelfde: er beweegt niks. Toch zijn er vier soorten.', en: 'Stuck always feels the same: nothing moves. Yet there are four kinds.', focus: ['goal', 'way', 'people', 'cap'] },
      { nl: '{t:Onduidelijk doel|Onduidelijk doel}: oneens over succes. {t:Onduidelijke weg|Onduidelijke weg}: het hoe ontbreekt.', en: '{t:Unclear goal|Unclear goal}: no agreement on success. {t:Unclear way|Unclear way}: clear goal, no how.', cue: { 'Onduidelijk doel': 'goal', 'Onduidelijke weg': 'way' }, focus: ['goal', 'way'] },
      { nl: '{t:Mensenprobleem|Mensenprobleem}: iemands ja ontbreekt. {t:Capaciteitsprobleem|Capaciteitsprobleem}: geen tijd.', en: '{t:People problem|People problem}: a needed yes is missing. {t:Capacity problem|Capacity problem}: no time.', cue: { Mensenprobleem: 'people', Capaciteitsprobleem: 'cap' }, focus: ['people', 'cap'] },
      { nl: 'Vier vragen: zelfde doel in één zin? Volgende drie stappen? Steun die we missen? Echt de uren?', en: 'Four questions: one goal in one line? Next three steps? Support we lack? Real hours?', focus: ['goal', 'way', 'people', 'cap', 'sponsor'] },
      { nl: 'Het eerste nee is meestal waar je begint.', en: 'The first no is usually where you start.', focus: 'first' },
    ]),
    sc('s2', DG, 1, { nl: 'Symptomen en oplossingen', en: 'Symptoms and fixes' }, [
      { nl: 'Doel: lange discussies, wisselende sponsor, elke sessie breekt de vorige open.', en: 'Goal: long debates, a shifting sponsor, every workshop reopening the last.', focus: ['goal', 'sponsor'] },
      { nl: 'Weg: analyses in rondjes, wachten op data. Mensen: één loopt uit, stilte, “we zien wel”.', en: 'Way: analysis loops, waiting for data. People: one slips, silence, “we’ll see”.', focus: ['way', 'people'] },
      { nl: 'Capaciteit: iedereen loopt uit, overleggen vallen af, werk in de avond.', en: 'Capacity: everyone slips, meetings cancelled, work in the evenings.', focus: 'cap' },
      { nl: 'Doel: de sponsor kiest. Weg: experiment of expert. Mensen: één-op-één. Capaciteit: een {t:Afweging|afweging}.', en: 'Goal: the sponsor chooses. Way: experiment or expert. People: one-on-one. Capacity: a {t:Trade-off|trade-off}.', cue: { Afweging: 'trade' }, focus: ['goal', 'way', 'people', 'trade', 'sponsor'] },
      { nl: 'Fout: doelprobleem als mensenprobleem behandelen. Twee soorten? Begin vooraan in de keten.', en: 'Mistake: a goal problem treated as a people one. Two kinds? Start earliest in the chain.', focus: ['mistake', 'chain'] },
      { nl: 'Twee weken “op het punt”? Week {n:3} zien, niet week {n:9}: het vak.', en: 'Two weeks “about to”? Week {n:3}, not week {n:9}: that is the skill.', focus: ['early', 'calendar', 'jij'] },
      { nl: 'Experts: altijd mensen? Of geeft “weerstand” de schuld van een besluit dat niemand nam?', en: 'Experts: nearly always people? Or does “resistance” blame them for a decision nobody took?', focus: ['debate', 'ask'] },
    ]),
    sc('s3', DG, 1, { nl: 'De derde ontwerpsessie', en: 'The third design workshop' }, [
      { nl: 'Week {n:7}, netbeheerder: derde sessie over een gereedheidscheck. Heeft een klus alles?', en: 'Week {n:7}, grid operator: third workshop on a readiness check. Has a job got everything?', focus: ['check', 'calendar'] },
      { nl: 'Planning wil streng: niets vrij zonder schakelplan en materiaal. Uitvoering wil licht: streng is later.', en: 'Planning wants strict: nothing out without switching plan and material. Execution: light.', focus: ['strict', 'light', 'planner', 'teamlead'] },
      { nl: 'Sponsor: “Zorg gewoon dat het werkt.” Een moe team. Geen ontwerpkwestie: een onduidelijk doel.', en: 'Sponsor: “Just make it work.” A tired team. Not a design debate: an unclear goal.', focus: ['verdict', 'sponsor'] },
      { nl: 'Streng dient minder afzeggingen, licht sneller vrijgeven. Nog een sessie lost dat niet op.', en: 'Strict serves fewer cancellations, light faster release. Another workshop won’t settle it.', focus: ['strict', 'light'] },
      { nl: 'Eén A4: beide doelen, wat elk ontwerp doet. Beide hoofden weten het vooraf.', en: 'One page: both goals, what each design does. Both heads know beforehand.', focus: ['page', 'paper'] },
      { nl: 'De sponsor kiest, of één doel: afzeggingen onder {n:8}%, vrijgeven hooguit {n:2} dagen langer.', en: 'The sponsor chooses, or one target: cancellations under {n:8}%, release at most {n:2} days longer.', focus: ['target', 'sponsor'] },
    ]),
    sc('s4', EX, 3, { nl: 'Omkeerbaar of niet', en: 'Reversible or not' }, [
      { nl: 'Niet: weten we het zeker? Wel: wat kost het als het mis is, en kunnen we terug?', en: 'Not: are we sure? But: the cost of being wrong, and can we undo it?', focus: 'certain' },
      { nl: 'Een {t:Omkeerbaar besluit|omkeerbaar besluit}, zoals een planningsregel: snel nemen, en testen.', en: 'A {t:Reversible decision|reversible decision}, like a planning rule: make it fast, and test it.', cue: { 'Omkeerbaar besluit': 'rev' }, focus: 'rev' },
      { nl: 'Een {t:Onomkeerbaar besluit|onomkeerbaar besluit}, zoals een machine kopen: traag en zorgvuldig.', en: 'An {t:Irreversible decision|irreversible decision}, like buying a machine: slow and careful.', cue: { 'Onomkeerbaar besluit': 'irrev' }, focus: 'irrev' },
      { nl: 'Jeff Bezos noemde omkeerbare besluiten “two-way doors”, voor kleine groepen, snel.', en: 'Jeff Bezos called reversible decisions “two-way doors”, for small groups, fast.', focus: ['bezos', 'rev'] },
      { nl: 'Critici: klein is sociaal lastig terug te draaien. Wat kost teruggaan, in geld en vertrouwen?', en: 'Critics: small is socially hard to undo. What does going back cost, in money and trust?', focus: 'back' },
    ]),
    sc('s5', EX, 3, { nl: 'Een klein experiment', en: 'A small experiment' }, [
      { nl: 'Een {t:Experiment|experiment}: vaste duur, een meting, en een {t:Hypothese|hypothese} die een test kan weerleggen.', en: 'An {t:Experiment|experiment}: time-boxed, a measure, and a {t:Hypothesis|hypothesis} a test can prove wrong.', cue: { Experiment: 'exp', Hypothese: 'hyp' }, focus: ['exp', 'hyp'] },
      { nl: 'Bevestigen planners vooraf, dan dalen de afzeggingen. Test: {n:2} planners, {n:2} weken, {n:40} klussen.', en: 'If planners confirm ahead, cancellations drop. Test: {n:2} planners, {n:2} weeks, {n:40} jobs.', focus: ['hyp', 'test', 'planner'] },
      { nl: 'Spreek vooraf het {t:Stopcriterium|stopcriterium} af: wat betekent doorgaan, wat stoppen?', en: 'Agree the {t:Stop criterion|stop criterion} first: what means continue, what means stop?', cue: { Stopcriterium: 'stop' }, focus: 'stop' },
      { nl: '“Twee weken, dan samen beslissen” verlaagt weerstand. Evalueer open, en stop echt.', en: '“Two weeks, then decide together” lowers resistance. Evaluate openly, really stop.', focus: ['yes', 'teamlead'] },
      { nl: 'Fouten: geen vergelijkingsgroep, twee veranderingen tegelijk, een testteam met alle aandacht.', en: 'Failures: no comparison group, two changes at once, a test team with all the attention.', focus: 'fails' },
    ]),
    sc('s6', EX, 3, { nl: 'Het belletje vooraf', en: 'The call ahead' }, [
      { nl: 'Drie weken discussie: de aannemer twee dagen vooraf bellen? Geen data; {n:16}% wordt afgezegd.', en: 'Three weeks of debate: call the contractor ahead? No data; {n:16}% cancelled.', focus: 'case' },
      { nl: 'Omkeerbaar en goedkoop: test het. Twee planners bellen, de anderen werken als altijd.', en: 'Reversible and cheap: test it. Two planners call ahead, the others work as usual.', focus: ['test', 'planner'] },
      { nl: 'Door bij een derde minder, zo’n {n:11}%, en belletjes onder {n:10} minuten. Anders stoppen.', en: 'A third fewer, about {n:11}%, and calls under {n:10} minutes: go on. Else stop.', focus: 'crit' },
      { nl: '{n:6} minuten per belletje: {n:40} klussen, {n:4} uur, weinig naast één afgezegde ploegdag.', en: '{n:6} minutes a call: {n:40} jobs, {n:4} hours, small next to a cancelled crew day.', focus: 'cost' },
      { nl: 'De grens: nooit met veiligheid. Schakelprocedures en vergrendeling test je niet.', en: 'The limit: never with safety. Switching procedures and lockout are never tested.', focus: 'safety' },
      { nl: 'Ook niet de {t:Vijf veiligheidsregels|vijf veiligheidsregels} voor elektrisch werk.', en: 'Nor the {t:Five safety rules|five safety rules} for electrical work.', cue: { 'Vijf veiligheidsregels': 'rules' }, focus: 'rules' },
    ]),
    sc('s7', RS, 3, { nl: 'Afdrijven', en: 'Drifting' }, [
      { nl: 'Projecten drijven af. Halverwege hopen op inhalen is de vaakste en duurste keuze.', en: 'Projects drift. Hoping to catch up halfway is the commonest, costliest choice.', focus: 'drift' },
      { nl: '{t:Verzonken kosten|Verzonken kosten} voelen als reden om door te gaan. Alleen de toekomst telt.', en: '{t:Sunk cost|Sunk cost} feels like a reason to go on. Only the future counts.', cue: { 'Verzonken kosten': 'sunk' }, focus: 'sunk' },
      { nl: 'Een {t:Herstart|herstart}: eerlijk kijken, een nieuwe afspraak. Eerst één A4: plan tegenover werkelijkheid.', en: 'A {t:Reset|reset}: look honestly, a new deal. First one page: plan versus reality.', cue: { Herstart: 'reset' }, focus: ['reset', 'page', 'paper'] },
      { nl: 'Een {t:RAG-status|RAG-status} die wekenlang groen blijft terwijl het doel wegglijdt: een watermeloen.', en: 'A {t:RAG status|RAG status} green for weeks while the goal slips: a watermelon.', cue: { 'RAG-status': 'rag' }, focus: ['rag', 'calendar'] },
      { nl: 'Je eigen aandeel: “Ik had het capaciteitsprobleem in week {n:4} moeten escaleren.”', en: 'Your own part: “I should have escalated the capacity issue in week {n:4}.”', focus: ['own', 'jij'] },
    ]),
    sc('s8', RS, 3, { nl: 'Het gesprek, de nieuwe afspraak', en: 'The talk, the new deal' }, [
      { nl: 'Eerst je eigen manager. Dan de sponsor, {n:45} minuten: “Zo haalt dit project zijn doel niet.”', en: 'Own manager first. Then the sponsor, {n:45} minutes: “As set up, it won’t reach its goal.”', focus: ['talk', 'sponsor', 'jij'] },
      { nl: 'Stoppen en overdragen, de scope verkleinen en goed afmaken, of opnieuw plannen.', en: 'Stop and hand over, shrink the scope and finish properly, or re-plan.', focus: 'opts' },
      { nl: '{t:Opnieuw contracteren|Opnieuw contracteren}: doel, scope, datum, rollen, toezeggingen, op papier.', en: '{t:Re-contracting|Re-contracting}: goal, scope, date, roles, commitments, in writing.', cue: { 'Opnieuw contracteren': 'recon' }, focus: ['recon', 'paper'] },
      { nl: 'Met een {t:IJkmoment|ijkmoment}: “Niet op X in week {n:20}? Dan stoppen we.”', en: 'With a {t:Check-in point|check-in point}: “Not at X by week {n:20}? We stop.”', cue: { IJkmoment: 'ijk' }, focus: 'ijk' },
      { nl: 'Ongemakkelijk; doe het toch. Met wat we nu weten: zouden we dit vandaag starten?', en: 'Uncomfortable; do it anyway. Knowing what we know, would we start it today?', focus: ['relief', 'sponsor'] },
    ]),
    sc('s9', RS, 3, { nl: 'Week 14 van 20', en: 'Week 14 of 20' }, [
      { nl: 'Week {n:14} van {n:20}: vrijgeven twee keer zo snel, in drie regio’s. Nu: één regio, {n:10}% korter.', en: 'Week {n:14} of {n:20}: release twice as fast in three regions. Now one region, {n:10}% faster.', focus: ['case', 'calendar'] },
      { nl: 'De sponsor op één van vier stuurgroepen, twee planners weg. Het team meldt oranje.', en: 'The sponsor at one of four steering groups, two planners gone. Status: amber.', focus: ['causes', 'sponsor'] },
      { nl: 'A: stoppen. B: de pilotregio, {n:40}% korter, zes weken. C: drie regio’s, tien weken later.', en: 'A: stop. B: the pilot region, {n:40}% shorter, six weeks. C: three regions, ten weeks later.', focus: 'opts' },
      { nl: 'Adviseer B, tenzij de sponsor zich echt aan C verbindt. Met een ijkmoment.', en: 'Recommend B, unless the sponsor truly commits to C. With a check-in point.', focus: ['advice', 'paper'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the captions and the cards it
// carries every point of the checklist above. No symbols the voice would read
// aloud: words for %, no quotes or parentheses. Words checked with espeak-ng
// phonemes through Piper's own bridge (nl_NL-alex, 2026-11-12). The Dutch
// narration says the terms the cards show. The kit's SAY rules already voice
// stuurgroep, gereedheidscheck, pilot(regio), scope, Jeff Bezos, vijf
// veiligheidsregels and vrijschakelen; the rules added with this film (tested
// in tests/filmvideo.test.js, no other film's spoken text changes) split
// mensenprobleem, capaciteitsprobleem, ijkmoment and planningsregel at the head
// (espeak-ng stresses mensenproBLEEM, capaciteitsproBLEEM, ijkmoMENT and
// planningsreGEL) and say vrijgeven as VRIJ-geven (espeak-ng: vrij-GEE-ven).
// Kept out of the Dutch narration because espeak-ng misreads them (they stay on
// the cards and in the captions): two-way doors ("tvoo-vaai"; said as the lesson
// glosses it, deuren waar je weer door terug kunt), vrijgavetijd
// ("vrijgaa-vee-tijd"; said "vrijgeven"), vergelijkingsgroep (stressed on
// -GROEP; said "een groep om mee te vergelijken"), één-op-ééngesprek (the g
// dropped; said "een gesprek één op één"), manager (read the Dutch way,
// "maa-naa-ger"; said "leidinggevende", as a manager rule would change
// pm.run.scope), and the standards NEN 3140 and EN 50110 (on the card only).
const SAY = [
  [ // s1 four kinds of stuck
    { nl: 'Vastgelopen voelt altijd hetzelfde. Toch zijn er vier soorten, elk met een eigen oplossing.',
      en: 'Stuck always feels the same. Yet there are four kinds, each with its own fix.' },
    { nl: 'Onduidelijk doel: oneens over succes. Onduidelijke weg: het doel is helder, niemand weet hoe.',
      en: 'Unclear goal: no agreement on success. Unclear way: the goal is clear, nobody knows how.' },
    { nl: 'Mensenprobleem: iemand wiens ja je nodig hebt, geeft hem niet. Bij een capaciteitsprobleem is iedereen het eens, maar niemand heeft tijd.',
      en: 'People problem: someone whose yes you need isn\'t giving it. Capacity problem: everyone agrees, nobody has time.' },
    { nl: 'Vier vragen: zelfde doel bij sponsor, eigenaar en team? Volgende drie stappen? Steun die we missen? Echt uren?',
      en: 'Four questions: same goal for sponsor, owner and team? Next three steps? Support we lack? Real hours?' },
    { nl: 'Het eerste nee is meestal waar je begint.',
      en: 'The first no is usually where you start.' },
  ],
  [ // s2 symptoms and fixes
    { nl: 'Doel: lange discussies, wisselende sponsor, elke sessie breekt de vorige open.',
      en: 'Goal: long debates, shifting sponsor, every workshop reopening the last.' },
    { nl: 'Weg: analyses in rondjes, wachten op data. Mensen: één persoon loopt uit, stilte.',
      en: 'Way: analysis loops, waiting for data. People: one person slips, silence.' },
    { nl: 'Capaciteit: iedereen loopt uit, overleggen vallen af, werk in de avonduren.',
      en: 'Capacity: everyone slips, meetings get cancelled, work in the evenings.' },
    { nl: 'Oplossingen: de sponsor kiest, een experiment of expert, een gesprek één op één, en een {t:Afweging|afweging} door de sponsor.',
      en: 'Fixes: the sponsor chooses, an experiment or an expert, a one-on-one, and a {t:Trade-off|trade-off} by the sponsor.' },
    { nl: 'Klassieke fout: een doelprobleem als mensenprobleem behandelen, harder duwen. Twee soorten tegelijk? Begin bij de vroegste.',
      en: 'Classic mistake: a goal problem treated as a people one, pushing harder. Two kinds at once? Start with the earliest.' },
    { nl: 'Al twee weken op het punt? Zie het in week drie, niet negen.',
      en: 'Two weeks about to act? See it in week three, not week nine.' },
    { nl: 'Experts twisten: altijd mensen, of een besluit dat niemand nam? Welk besluit neemt niemand?',
      en: 'Experts argue: always people, or a decision nobody took? Ask: which decision is nobody taking?' },
  ],
  [ // s3 the third design workshop
    { nl: 'Week {n:7}, netbeheerder: derde ontwerpsessie over een gereedheidscheck. Heeft een klus alles?',
      en: 'Week {n:7}, grid operator: third workshop on a readiness check. Is a job ready for the crew?' },
    { nl: 'Planning wil streng: niets vrij zonder bevestigd schakelplan en materiaal. Uitvoering wil licht.',
      en: 'Planning wants strict: nothing released without a confirmed switching plan and material. Execution wants light.' },
    { nl: 'De sponsor: zorg gewoon dat het werkt. Het team raakt moe, maar het doel is onduidelijk.',
      en: 'The sponsor said: just make it work. The team tires, but the goal is unclear.' },
    { nl: 'Streng dient minder afzeggingen, licht sneller vrijgeven. Nog een sessie lost dat niet op.',
      en: 'Strict serves fewer cancellations, light faster release. Another workshop won\'t settle that.' },
    { nl: 'Schrijf één A4 met beide doelen en wat elk ontwerp doet. Vertel beide hoofden het vooraf.',
      en: 'Write one page with both goals and what each design does. Tell both heads beforehand.' },
    { nl: 'De sponsor kiest, of stelt één doel: afzeggingen onder {n:8} procent, vrijgeven hooguit {n:2} dagen langer.',
      en: 'The sponsor chooses, or sets one target: cancellations under {n:8} percent, release at most {n:2} days longer.' },
  ],
  [ // s4 reversible or not
    { nl: 'Wat kost het als het mis is, en kun je terug?',
      en: 'What does being wrong cost, and can you undo it?' },
    { nl: 'Een {t:Omkeerbaar besluit|omkeerbaar besluit}, zoals een planningsregel, neem je snel, en je test het.',
      en: 'A {t:Reversible decision|reversible decision}, like a planning rule, you make fast, and test.' },
    { nl: 'Een {t:Onomkeerbaar besluit|onomkeerbaar besluit}, zoals een machine kopen of een reorganisatie: traag en zorgvuldig.',
      en: 'An {t:Irreversible decision|irreversible decision}, like buying a machine or a reorganisation: slow and careful.' },
    { nl: 'Jeff Bezos noemde omkeerbare besluiten deuren waar je terug door kunt, voor kleine groepen, snel.',
      en: 'Jeff Bezos called reversible decisions two-way doors: small groups should make them fast.' },
    { nl: 'Critici: ook klein is sociaal lastig terug te draaien. Wat kost teruggaan, in geld en vertrouwen?',
      en: 'Critics: even small is socially hard to undo. What does going back cost, in money and trust?' },
  ],
  [ // s5 a small experiment
    { nl: 'Een {t:Experiment|experiment}: een kleine test met vaste duur en meting. Een {t:Hypothese|hypothese} is een vermoeden dat een test kan weerleggen.',
      en: 'An {t:Experiment|experiment}: a small test, time-boxed, with a measure. Start from a {t:Hypothesis|hypothesis}, a guess a test can prove wrong.' },
    { nl: 'Bevestigen planners vooraf, dan dalen de afzeggingen? Test klein: twee planners, twee weken, zo\'n {n:40} klussen.',
      en: 'If planners confirm ahead, do cancellations drop? Test small: two planners, two weeks, about {n:40} jobs.' },
    { nl: 'Spreek vooraf af wat je meet, en het {t:Stopcriterium|stopcriterium}: wanneer door, wanneer stoppen.',
      en: 'Agree first what you measure, and the {t:Stop criterion|stop criterion}: when to go on, when to stop.' },
    { nl: 'Twee weken proberen, dan samen beslissen: daar zeg je makkelijker ja tegen. Stop dan echt.',
      en: 'Two weeks, then decide together: easier to say yes to. Then really stop.' },
    { nl: 'Fouten: geen groep om mee te vergelijken, twee veranderingen tegelijk, of een testteam met alle aandacht.',
      en: 'Failures: no comparison group, two changes at once, or a test team with all the attention.' },
  ],
  [ // s6 the call ahead
    { nl: 'Drie weken discussie: de aannemer vooraf bellen, kost dat plannerstijd of scheelt het afzeggingen? Geen data; {n:16} procent afgezegd.',
      en: 'Three weeks of debate: calling the contractor ahead, planner time or fewer cancellations? No data; {n:16} percent cancelled.' },
    { nl: 'Omkeerbaar en goedkoop: test het. Twee planners bellen, de rest niet.',
      en: 'Reversible and cheap: test it. Two planners call; the rest don\'t.' },
    { nl: 'Een derde minder, zo\'n {n:11} procent, en belletjes onder {n:10} minuten? Uitrollen, anders stoppen.',
      en: 'A third fewer, about {n:11} percent, and calls under {n:10} minutes? Roll out; else stop.' },
    { nl: 'Bij {n:6} minuten kosten {n:40} belletjes {n:4} uur, weinig naast één afgezegde ploegdag. Noem het een test en deel de uitkomst.',
      en: 'At {n:6} minutes, {n:40} calls cost {n:4} hours, small next to a cancelled crew day. Call it a test; share the result.' },
    { nl: 'Maar experimenteer nooit met veiligheid: niet met schakelprocedures of vergrendeling.',
      en: 'Never experiment with safety: not switching procedures, not lockout.' },
    { nl: 'Niet met de {t:Vijf veiligheidsregels|vijf veiligheidsregels}: vrijschakelen, beveiligen tegen herinschakelen, spanningsloosheid vaststellen, aarden en kortsluiten, afschermen.',
      en: 'Nor the {t:Five safety rules|five safety rules}: disconnect, secure against reconnection, verify absence of voltage, earth and short-circuit, protect against adjacent live parts.' },
  ],
  [ // s7 drifting
    { nl: 'Projecten mislukken zelden plotseling, ze drijven af. Halverwege hopen op inhalen is de duurste keuze.',
      en: 'Projects rarely fail suddenly, they drift. Hoping to catch up halfway is the costliest choice.' },
    { nl: '{t:Verzonken kosten|Verzonken kosten}: wat op is, voelt als reden om door te gaan. Alleen de toekomst telt.',
      en: '{t:Sunk cost|Sunk cost}: what is spent feels like a reason to go on. Only the future counts.' },
    { nl: 'Een {t:Herstart|herstart}: eerlijk kijken, nieuwe afspraak. Eerst één A4: plan tegenover werkelijkheid, met oorzaken.',
      en: 'A {t:Reset|reset}: look honestly, a new deal. First one page: plan versus reality, and causes.' },
    { nl: 'Een {t:RAG-status|RAG-status}, rood, oranje of groen, die wekenlang groen blijft terwijl het doel wegglijdt: een watermeloen.',
      en: 'A {t:RAG status|RAG status}, red, amber or green, green for weeks while the goal slips: a watermelon.' },
    { nl: 'Benoem je eigen aandeel: ik had het capaciteitsprobleem in week vier moeten escaleren.',
      en: 'Name your own part: I should have escalated the capacity issue in week four.' },
  ],
  [ // s8 the talk, the new deal
    { nl: 'Eerst je leidinggevende, dan de sponsor, {n:45} minuten: zo haalt dit project zijn doel niet.',
      en: 'Your manager first, then the sponsor, {n:45} minutes: as set up, this project won\'t reach its goal.' },
    { nl: 'Met wat je ziet, de oorzaak en drie opties: stoppen en overdragen wat werkt, kleiner afmaken, of opnieuw plannen.',
      en: 'With what you see, the cause and three options: stop and hand over what works, shrink and finish, or re-plan.' },
    { nl: '{t:Opnieuw contracteren|Opnieuw contracteren}: doel, scope, einddatum, rollen en wat de sponsor toezegt, op papier.',
      en: '{t:Re-contracting|Re-contracting}: goal, scope, end date, roles, the sponsor\'s commitments, in writing.' },
    { nl: 'Plus een {t:IJkmoment|ijkmoment}: in week {n:20} niet op X, dan stoppen we. Alleen datums verschuiven mislukt weer.',
      en: 'Plus a {t:Check-in point|check-in point}: not at X by week {n:20}, we stop. Only moving dates fails again.' },
    { nl: 'Ongemakkelijk? Doe het toch; sponsors zijn vaak opgelucht. Met wat we nu weten: zouden we dit vandaag starten?',
      en: 'Uncomfortable? Do it anyway; sponsors are often relieved. Knowing what we know, would we start this today?' },
  ],
  [ // s9 week 14 of 20
    { nl: 'Week {n:14} van {n:20}: vrijgeven twee keer zo snel, in drie regio\'s. De pilot: één regio, {n:10} procent sneller.',
      en: 'Week {n:14} of {n:20}: release twice as fast, in three regions. The pilot: one region, {n:10} percent faster.' },
    { nl: 'De sponsor kwam op één van vier stuurgroepen, twee planners vertrokken. Toch meldt het team oranje. Oorzaak: capaciteit en mensen.',
      en: 'The sponsor came to one of four steering groups, two planners left. Yet the team reports amber. Cause: capacity and people.' },
    { nl: 'A: stoppen. B is de pilotregio, {n:40} procent korter, zes weken. C: drie regio\'s, tien weken later.',
      en: 'A: stop. B: the pilot region, {n:40} percent shorter, six weeks. C: three regions, ten weeks later.' },
    { nl: 'Adviseer B, tenzij zij zich echt aan C verbindt. Leg het vast met een ijkmoment.',
      en: 'Recommend B, unless she truly commits to C. Write it down, with a check-in point.' },
  ],
];
// Each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap (as
// pm.portfolio.prioritise).
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(300, Math.round(all / NARRATION_WPS));
  // the captions as shown, with each term's English gloss (the check counts those words too)
  const shown = resolveFilm(spec, lessons);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(shown.scenes[si].beats.map((b) => b.text[lang]).join(' ')) + 2)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  spec.scenes.forEach((s, si) => { DURS[si] = s.dur; });
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
// no symbol the voice would read aloud, no spoken parenthesis or quote, and no
// word espeak-ng misreads in the Dutch narration (see above)
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '');
  if (/[/&×=+()“”"‘%€~<>≤÷↓↑→]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /two-way|one-way|vrijgavetijd|vergelijkingsgroep|één-op-één|\bEN 50110|\bmanager/i.test(line.nl)) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// the status colours, muted, per theme; the focus glow stays the player's
const css = PM_CSS + `
.iso{--sc-g:#5FA877;--sc-a:#D9A441;--sc-r:#C8645A}
.iso[data-theme="light"]{--sc-g:#3B7F52;--sc-a:#B9832A;--sc-r:#B04A40}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-ring{fill:none;stroke:var(--fp-accent);stroke-width:2.4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-bar{fill:var(--anatomy-hi)}
.pm-dot{fill:var(--anatomy-mid)}
.sc-g{fill:var(--sc-g)}
.sc-a{fill:var(--sc-a)}
.sc-r{fill:var(--sc-r)}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.scope) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twintig weken die de week van elke scène omcirkelt, met in de herstartscènes een statusstip: groen, en oranje in het voorbeeld. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel een stapel papier en een vel dat zich vult als er een A4 geschreven wordt. Rechts een paneel met per scène een kaart: de vier soorten vastzitten met hun vragen, symptomen en oplossingen, de keten van doel naar capaciteit, de gereedheidscheck met streng en licht en het doel voor allebei, een deur die twee kanten op gaat en een die maar één kant op gaat, het experiment met hypothese, test en stopcriterium, het belletje vooraf met zijn criteria en kosten, de vijf veiligheidsregels, een plan dat afdrijft, een watermeloen voor de RAG-status, de drie opties en de nieuwe afspraak met een ijkmoment, en de opties A, B en C van week 14.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twenty weeks that rings each scene\'s week, with a status dot in the reset scenes: green, and amber in the example. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table a stack of paper and a sheet that fills in when a page is written. At the right a panel with one card per scene: the four kinds of stuck with their questions, symptoms and fixes, the chain from goal to capacity, the readiness check with strict and light and the target for both, a door that swings both ways and one that opens one way, the experiment with hypothesis, test and stop criterion, the call ahead with its criteria and cost, the five safety rules, a plan drifting away, a watermelon for the RAG status, the three options and the new deal with a check-in point, and options A, B and C of week 14.',
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

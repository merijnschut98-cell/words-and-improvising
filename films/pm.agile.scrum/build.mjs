// Dev tool, not shipped. Builds the explainer film "Een sprint van twee weken /
// A two-week sprint" for the Projects course: pm.agile.scrumbasics,
// pm.agile.events and pm.agile.artefacts (levels 1 to 3 of the topic Scrum in
// Agile werken).
//
//   node films/pm.agile.scrum/build.mjs            build the page
//   node films/pm.agile.scrum/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.agile.scrum.html: one offline page with
// the anatomy kit, the stage script and the player inlined. A film that will
// be rendered to video (Merijn, 2026-11-12: render every reviewed pm film), so
// all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.agile.scrum, P1: people and events in time; the roles introduced, sprint
// planning pulls items from the backlog, the daily at the board with cards
// moving, the review with users who react, the retro picks one improvement,
// the next sprint starts). Storyboard drift: the plan's 130 s are about 300 s
// in nine scenes, because a lesson with a film no longer shows its worked
// example (v16 notes), so the film carries the teach text and the example of
// all three Scrum lessons: the team and the sprint (s1 to s3), the five events
// (s4 to s6) and the three artefacts (s7 to s9). The storyboard's beats are all
// there: the roles (s2), planning pulling cards onto the board (s4), the daily
// with cards moving (s5), the review with the shift lead from the floor (s5),
// the retro's one improvement and the next sprint (s5), in the two weeks of
// the side-wall calendar. pm.agile.scrumfail (level 4, what goes wrong) has
// its own terms and is not served.
//
// Terms and claims follow pm.plan.method, which already introduced Scrum: a
// sprint is a fixed period of at most a month, often two weeks; Scrum is the
// best-known agile method; the Scrum Guide names a sprint planning, a review
// and a retrospective. "Often two weeks" is the lesson's, not the Guide's.
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   scrumbasics teach 1: a framework for a small team to make complex
//     products, the best-known agile way of working (s1 b1); the Scrum Guide by
//     Ken Schwaber and Jeff Sutherland, about thirteen pages (s1 b2), version
//     November 2020 (card and caption, s1 b2); deliberately little on how you
//     do the work: fixed roles, moments and lists, the rest to the team (s1 b3)
//   scrumbasics teach 2: sprints, fixed periods of at most a month, often two
//     weeks, the next right after (s1 b4); something usable each sprint, a
//     fixed rhythm (s1 b5) of planning, showing and looking back (card, s1 b5);
//     longer is risky, the goal goes stale, problems stay hidden (s1 b6)
//   scrumbasics teach 3: the Scrum Team is small, usually ten or fewer, no
//     hierarchy (s2 b1), no sub-teams (card, s2 b1); three accountabilities (s2
//     b2); the Product Owner one person, not a committee, guards the value:
//     what first and why (s2 b3); the Scrum Master helps use Scrum well and
//     removes obstacles (s2 b4), for team and organisation (card, s2 b4); the
//     Developers make the work: anyone who builds, testers and analysts too
//     (s2 b5), programmers (card, s2 b5)
//   scrumbasics teach 4: since 2020 accountabilities, not job titles (s2 b2); a
//     Developer needn't be a programmer (s2 b5: anyone who builds, testers and
//     analysts too); the Scrum Master is no boss (s2 b4); for a Lean consultant
//     the Product Owner is the voice of the customer, the Scrum Master a coach
//     of the system (s2 b6), in a value stream, not handing out tasks (card,
//     s2 b6)
//   scrumbasics teach 5: in plants mostly IT teams, for MES, ERP, data and
//     machine software (s3 b1), MES as the system for orders and production on
//     the floor (card, s3 b1); the common mistake, the IT manager as Product
//     Owner and Scrum Master, nobody holds up a mirror (s3 b2), because he
//     decides and guards at once (card, s3 b2); ask "who decides what comes
//     first, and who guards how we work?" (s3 b3)
//   scrumbasics example: a pipe maker, a team of seven, the production
//     manager as Product Owner two days a week (s3 b4), an MES team, because he
//     knows the floor (card, s3 b4); Scrum Master a process improver from the
//     Lean team, five Developers (s3 b5), 3 programmers, 1 tester, 1 data
//     analyst (card, s3 b5); sprint 5's goal: scrap per cause on a screen, not
//     on paper (s3 b6), two-week sprints from Monday, extrusion line 2 (card,
//     s3 b6); after two weeks all shifts use it, sprint 6 starts on Monday (s3
//     b7), the screen on line 2, three shifts (card, s3 b7)
//   events teach 1: five events, fixed moments to plan, inspect and adapt; the
//     sprint contains the other four (s4 b1); each a timebox, a maximum
//     duration; for a month planning at most 8 h, the Daily Scrum 15 min (s4
//     b2), review at most 4 h, retrospective at most 3 h, shorter sprints
//     usually shorter (card, s4 b2)
//   events teach 2: Sprint Planning, three questions: why valuable, the sprint
//     goal (s4 b3); what can be done, the Developers pick (s4 b4); how, pieces
//     of usually a day or less (s4 b5); the Developers decide how much, the
//     Product Owner what matters most (s4 b6)
//   events teach 3: the Daily Scrum, 15 minutes for the Developers, every
//     working day same time and place, toward the sprint goal (s5 b1); no
//     status meeting for a manager, the team picks the form (s5 b2), the three
//     fixed questions were in older versions, since 2020 (card, s5 b2)
//   events teach 4: the Sprint Review shows stakeholders what is done, together
//     they discuss what matters most now; a working session, not a
//     presentation (s5 b3), no slides (card); never a gate, what is done may go
//     into use earlier (s5 b4)
//   events teach 5: the Sprint Retrospective, the team looks back; Scrum's
//     kaizen engine, with one concrete action (s5 b5); what went well, what can
//     improve, improvements straight into the next sprint, without an action a
//     kaizen board without an owner (card, s5 b5); refinement is no event, it
//     runs continuously (s5 b6)
//   events example: a beverage maker, ten-day sprints; the team halves each
//     timebox, a common rule of thumb (s6 b1); Monday the planning, at most 4 h
//     (s6 b2), instead of 8 (said in s4 b2); every working day at nine the Daily
//     Scrum (s6 b3), at the board (card and caption); Friday of week two the
//     Sprint Review with the shift leaders, then the Sprint Retrospective (s6
//     b4), at most 2 h and 1.5 h (card); ten days of fifteen minutes, 2.5 hours
//     per person per sprint (s6 b5), 150 minutes (card and caption)
//   artefacts teach 1: three artefacts, since 2020 each with a commitment (s7
//     b1), lists or results that make work visible, a goal or agreement (card,
//     s7 b1); the Product Backlog, the ordered list of all that makes the
//     product better, the Product Owner orders it (s7 b2); its commitment the
//     Product Goal, the longer-term goal (s7 b3), sprint after sprint (card)
//   artefacts teach 2: the Sprint Backlog, the Developers' plan for this
//     sprint, it changes as they learn (s7 b4), the chosen work plus how (card);
//     its commitment the Sprint Goal, the one goal, focus (s7 b5) and room
//     (card); too big: scope adjusted with the Product Owner, the goal stands
//     (s7 b6)
//   artefacts teach 3: the Increment, working product that is done, several
//     per sprint (s8 b1), adds to the Product Goal, may be used earlier (card,
//     s8 b1); its commitment the Definition of Done, when work is really done,
//     such as tested and installed (s8 b2), documented, on the test environment
//     (card); work that fails it is not shown, back to the Product Backlog (s8
//     b3), nor delivered (card)
//   artefacts teach 4: a quality gate at the end of the line, half work doesn't
//     count (s8 b4), no hiding it (card); a pointless Sprint Goal: only the
//     Product Owner may cancel the sprint, rarely (s8 b5), e.g. a stopped
//     project (card)
//   artefacts teach 5: typical mistakes, 400 items, the manager's task list, a
//     Definition of Done of only code (s8 b6), nobody oversees the backlog,
//     testing slides (card); ask for the Product Goal, this sprint's goal, the
//     Definition of Done (s8 b7), in one sentence, and is it used (card)
//   artefacts example: linking a meat plant's scales to the MES, sprint 4's
//     goal: line 1 sends weights (s9 b1); Product Goal, every batch the right
//     weight automatically (card, s9 b1); Definition of Done: real weighing
//     data, checked by quality, on the acceptance environment (s9 b2), a copy
//     of the real system (card); 5 items, 3 meet it, 4 not checked, 5 not
//     started (s9 b3)
//   reveal (the ask is answered in the voice): only those three are shown (s9
//     b4); 4 and 5 back to the Product Backlog, the Product Owner decides the
//     order (s9 b5); if line 1's weights get through, the goal is met: a sprint
//     goal beats a task list (s9 b6), though not all work went (card)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts checked (2026-11-13) against the Scrum Guide of November 2020 (Ken
// Schwaber and Jeff Sutherland, 13 pages of text): Scrum Team typically 10 or
// fewer, no sub-teams or hierarchies; three accountabilities, Developers,
// Product Owner (one person, not a committee; maximising value, ordering the
// Product Backlog) and Scrum Master (establishing Scrum, causing the removal
// of impediments); sprints of one month or less, the next starting right after
// the previous; five events with timeboxes for a one-month sprint (Sprint
// Planning 8 h, Daily Scrum 15 min, Sprint Review 4 h, Sprint Retrospective 3
// h, "usually shorter" for shorter sprints); the three planning topics (why,
// what, how) and work items of one day or less; the Daily Scrum for the
// Developers, same time and place, any structure; the review "a working
// session", "never a gate to releasing value"; improvements may go onto the
// next Sprint Backlog; refinement an ongoing activity; Product Backlog and
// Product Goal, Sprint Backlog and Sprint Goal (scope renegotiated with the
// Product Owner without affecting the goal), Increment and Definition of Done
// (work that does not meet it "cannot be released or even presented at the
// Sprint Review" and returns to the Product Backlog); several increments per
// sprint; only the Product Owner may cancel a sprint, when its goal is
// obsolete. The three daily questions are the 2017 Guide's. Credited to the
// Guide here only what it says; "often two weeks", halving the timeboxes, the
// Lean comparisons (voice of the customer, coach, kaizen, quality gate),
// "rarely" and the three examples are the lessons' own.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// team room with a Scrum board on the back wall (three columns, to do, doing,
// done, whose cards move: pulled in at the planning, moving at the daily,
// done ones shown at the review, two going back in the weighing example), a
// clock, and on the side wall a calendar strip of ten working days, the two
// weeks of a sprint, where the events light up (planning on day 1, a daily dot
// on each day, review and retrospective on day 10). The Scrum Team is the
// film's own (cast.mjs): the Product Owner with a tablet at the left end of
// the table, the Scrum Master at the right end, three Developers (two behind
// the table, one in front), and the shift lead from the floor (the pm world's
// team lead in his work vest) in front, the users at the review. A panel at
// the right, in stage space, carries one card per scene, labelled "schema" or
// "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// board and the calendar.
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
import { scrumPerson } from './cast.mjs';

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
const SB = 'pm.agile.scrumbasics';
const EV = 'pm.agile.events';
const AR = 'pm.agile.artefacts';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(SB, ['Scrum is een raamwerk om in een klein team complexe producten te maken', 'bekendste agile werkwijze', 'de Scrum Guide van Ken Schwaber en Jeff Sutherland',
  'van november 2020 en telt zo’n dertien pagina’s', 'Scrum zegt bewust weinig over hoe je het werk doet', 'een paar vaste rollen, momenten en lijsten, en laat de rest aan het team',
  'vaste periodes van hooguit een maand, vaak twee weken. Een nieuwe sprint begint direct na de vorige', 'In elke sprint maakt het team iets bruikbaars af',
  'gepland, getoond en teruggekeken', 'het doel kan verouderen en problemen blijven langer verborgen', 'meestal tien mensen of minder', 'geen hiërarchie en geen subteams',
  'drie verantwoordelijkheden', 'één persoon, geen commissie', 'wat het team als eerste doet en waarom', 'helpt team en organisatie om Scrum goed te gebruiken en ruimt obstakels op',
  'programmeurs, testers, analisten, iedereen die bouwt', 'sinds 2020 van verantwoordelijkheden, niet van functies', 'Een Developer hoeft geen programmeur te zijn',
  'de Scrum Master is geen baas van het team', 'de klantstem in een waardestroom', 'een coach die het systeem verbetert in plaats van taken uit te delen',
  'MES (het systeem voor orders en productie op de vloer), ERP-aanpassingen, data en machinesoftware', 'de IT-manager wordt Product Owner én Scrum Master tegelijk',
  'niemand houdt hem een spiegel voor', '“Wie beslist hier wat er eerst komt, en wie bewaakt hoe we werken?”',
  'kunststof buizen heeft een MES-team van 7 mensen', 'de productieleider, vrijgemaakt voor 2 dagen per week', 'een procesverbeteraar uit het Lean-team',
  '3 programmeurs, 1 tester, 1 data-analist', 'Sprints van 2 weken, start op maandag', 'Operators van extrusielijn 2 melden afkeur', 'per oorzaak op het scherm in plaats van op papier',
  'gebruiken operators het in alle 3 ploegen. Sprint 6 begint de maandag daarna']);
says(EV, ['Scrum kent vijf events: vaste momenten om te plannen, te inspecteren en bij te sturen', 'De sprint zelf is het eerste; hij bevat de andere vier',
  'Sprint Planning hooguit 8 uur, Daily Scrum 15 minuten, Sprint Review hooguit 4 uur, Sprint Retrospective hooguit 3 uur', 'Bij kortere sprints zijn ze “meestal korter”',
  'Waarom is deze sprint waardevol? Daaruit komt het sprintdoel', 'De Developers kiezen werk van de lijst', 'stukken van meestal een dag of minder',
  'De Developers bepalen hoeveel ze aannemen. De Product Owner zegt wat het belangrijkst is, niet hoeveel erin moet', 'elke werkdag op dezelfde tijd en plek',
  'Het is geen statusoverleg voor een manager', 'stonden in oudere versies; sinds 2020 kiest het team zelf de vorm', 'laat belanghebbenden (stakeholders) zien wat er af is',
  'Het is een werksessie, geen presentatie met slides', 'de review is nooit een poort om iets live te zetten. Wat af is, mag eerder in gebruik',
  'kiest de belangrijkste verbeteringen. Die mogen direct op de lijst voor de volgende sprint', 'de kaizenmotor van Scrum', 'als een kaizenbord zonder eigenaar',
  'Refinement, het verfijnen van de lijst met werk, is overigens geen event; dat gebeurt doorlopend', 'drankenproducent werkt in sprints van 2 weken, 10 werkdagen',
  'Het team halveert ze, een gangbare vuistregel', 'hooguit 4 uur in plaats van 8', 'Elke werkdag om 9:00: Daily Scrum, 15 minuten bij het bord',
  'Vrijdag week 2: Sprint Review, hooguit 2 uur, met de ploegleiders van de vullijnen', 'Sprint Retrospective, hooguit 1,5 uur', '10 dagen × 15 minuten = 150 minuten, 2,5 uur per persoon']);
says(AR, ['lijsten of resultaten die het werk zichtbaar maken', 'Sinds 2020 hoort bij elk artefact een toezegging (commitment)', 'De Product Backlog is de geordende lijst van alles wat het product beter kan maken; de Product Owner bepaalt de volgorde',
  'het Product Goal: het doel op langere termijn', 'De Sprint Backlog is het plan van de Developers voor deze sprint: het gekozen werk, plus hoe ze het gaan doen',
  'verandert tijdens de sprint als ze iets leren', 'het Sprint Goal: het ene doel van deze sprint. Het geeft focus en ruimte', 'zolang het sprintdoel overeind blijft',
  'Het Increment is een concreet stuk werkend product dat af is en bijdraagt aan het Product Goal', 'meerdere increments in één sprint ontstaan, en ze mogen eerder in gebruik',
  'getest, gedocumenteerd en geïnstalleerd op de testomgeving', 'mag niet worden opgeleverd of in de review getoond. Het gaat terug naar de Product Backlog',
  'een kwaliteitspoort aan het eind van een lijn', 'Half werk verstoppen kan dan niet meer', 'dan mag alleen de Product Owner de sprint afbreken. Dat gebeurt zelden',
  'een Product Backlog van 400 items die niemand overziet', 'een takenlijst van de manager', 'alleen “code geschreven” zegt, zodat testen naar later schuift',
  '“Wat is het Product Goal, in één zin?” “Wat is het doel van deze sprint?” “Mag ik jullie Definition of Done zien, en wordt hij ook gebruikt?”',
  'weegschalen in een vleesverwerkende fabriek en het MES', 'Elke partij krijgt automatisch het juiste gewicht in het MES, zonder handwerk', 'De weegschaal van lijn 1 stuurt gewichten naar het MES',
  'getest met echte weegdata, gecontroleerd door kwaliteit, geïnstalleerd op de acceptatieomgeving', '5 items gekozen. 3 voldoen aan de Definition of Done',
  'Item 4 is geschreven maar niet door kwaliteit gecontroleerd. Item 5 is niet begonnen', 'Alleen de 3 items die voldoen aan de Definition of Done komen in de review',
  'Items 4 en 5 gaan terug naar de Product Backlog; de Product Owner bepaalt waar ze in de volgorde komen', 'Daarom is een sprintdoel sterker dan een lijst met taken']);
says(SB, ['the Scrum Guide by Ken Schwaber and Jeff Sutherland', 'the voice of the customer in a value stream', 'the production manager, freed up for 2 days a week'], 'en');
says(EV, ['a common rule of thumb', 'with the shift leaders of the filling lines', 'never a gate to releasing value'], 'en');
says(AR, ['the scales in a meat-processing plant and the MES', 'installed on the acceptance environment', 'That is why a sprint goal is stronger than a list of tasks'], 'en');
assert(lessons.nl.get(SB).terms.map((t) => t.term).join() === 'Scrum,Sprint,Scrum Team,Product Owner,Scrum Master,Developers', 'the six terms of scrumbasics');
assert(lessons.nl.get(EV).terms.map((t) => t.term).join() === 'Timebox,Sprint Planning,Daily Scrum,Sprint Review,Sprint Retrospective', 'the five terms of events');
assert(lessons.nl.get(AR).terms.map((t) => t.term).join() === 'Product Backlog,Product Goal,Sprint Backlog,Sprint Goal,Increment,Definition of Done', 'the six terms of artefacts');
for (const id of [SB, EV, AR]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.agile.scrum', `no other film is wired to ${id}`);
// the numbers the cards draw: the Guide's timeboxes for a month, halved in the
// beverage example; ten working days of fifteen minutes; five items, three done
const TB = { plan: 8, daily: 15, review: 4, retro: 3 };
const HALF = { plan: 4, review: 2, retro: 1.5 };
assert(HALF.plan * 2 === TB.plan && HALF.review * 2 === TB.review && HALF.retro * 2 === TB.retro, 'the example halves the timeboxes');
const DAYS = 10;
assert(DAYS * TB.daily === 150 && 150 / 60 === 2.5, 'ten dailies of fifteen minutes: 150 minutes, 2.5 hours');
const ITEMS = { chosen: 5, done: 3 };
assert(ITEMS.done < ITEMS.chosen, 'three of five done; items 4 and 5 go back');

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

// the Scrum board on the back wall: three columns, to do, doing, done
const BOARD = w.board({ x0: 34, x1: 196, z0: 104, z1: 204 });
const BA = BOARD.area;
const COLS = [0, 1, 2].map((i) => {
  const cw = (BA.x1 - BA.x0 - 8) / 3;
  return { x0: r1(BA.x0 + 4 + i * cw), x1: r1(BA.x0 + 4 + (i + 1) * cw) };
});
const boardRules = `<g transform="${BOARD.face}">`
  + `<path class="pm-rule" d="${COLS.slice(1).map((c) => `M${c.x0} ${-BA.z1 + 4}V${-BA.z0 - 4}`).join('')}M${BA.x0 + 4} ${-BA.z1 + 14}H${BA.x1 - 4}"/>`
  + g('bCards', '') + '</g>';
// ten working days on the side wall: the two weeks of a sprint
const CAL = w.calendar({ y0: 34, z0: 104, weeks: DAYS, cw: 15, ch: 44 });
const CELLS = Array.from({ length: DAYS }, (_, i) => CAL.cell(i).map(r1));
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
const TABLE = { x: 96, y: 116, w: 150, d: 70, h: 74 };
const TZ = TABLE.h;
// the cast: who stands where (world cm)
const SPOT = {
  po: { x: 70, y: 152, along: 'y', look: 'po' },
  sm: { x: 272, y: 152, along: 'y', look: 'sm' },
  d1: { x: 216, y: 84, along: 'x', look: 'dev' },
  d2: { x: 262, y: 92, along: 'x', look: 'dev2' },
  d3: { x: 128, y: 224, along: 'x', look: 'dev2' },
  users: { x: 222, y: 226, along: 'x' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map(r1)]));
const fig = (r) => scrumPerson(w, k, G, P, { ...SPOT[r], key: r[0] === 'd' ? 'devs' : r });
const world = [
  w.room(ROOM),
  w.clock(246, 180, 11),
  cueG('board', BOARD.svg + boardRules),
  cueG('calendar', CAL.svg + calMarks),
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
  w.person({ ...SPOT.users, role: 'teamlead' }).replace('data-cue="teamlead"', 'data-cue="users"'),
].join('');
for (const r of ['po', 'sm', 'devs', 'users', 'board', 'calendar']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['scrum', 'guide', 'little', 'sprint', 'usable', 'risk',
  'team', 'acc', 'cpo', 'csm', 'cdev', 'lean',
  'plant', 'mistake', 'ask', 'pipes', 'roles', 'goal5', 'shifts',
  'five', 'tbox', 'why', 'what', 'how', 'much',
  'daily', 'status', 'review', 'gate', 'retro', 'refine',
  'drinks', 'plan4', 'day9', 'fri', 'sum',
  'arte', 'pb', 'pg', 'sb', 'sg', 'scope',
  'inc', 'dod', 'back', 'qgate', 'cancel', 'errs', 'qs',
  'scales', 'dodx', 'items', 'show', 'retour', 'met'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.run.conflict): the same points, fewer bytes; each rewrite is read back.
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
const CAL_AT = w.at([0, 110, 150]).map(r1);
const CAM = [
  { from: [160, 205, 1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.08] },
  { from: [160, 205, 1], to: toward(mid(HEAD.po, HEAD.sm), 1.08) },
  { from: toward(HEAD.po, 1.02), to: toward(mid(HEAD.d1, HEAD.d3), 1.1) },
  { from: [160, 205, 1], to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 30, 1.08], to: toward(HEAD.users, 1.08) },
  { from: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.04], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.12] },
  { from: toward(HEAD.po, 1.02), to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 30, 1.04], to: toward(HEAD.sm, 1.06) },
  { from: [160, 205, 1], to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.12] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, COLS, BA: { x0: BA.x0, x1: BA.x1, z0: BA.z0, z1: BA.z1 } };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.agile.scrum',
  title: { nl: 'Een sprint van twee weken', en: 'A two-week sprint' },
  lessons: [SB, EV, AR],
  strictFocus: true,
  scenes: [
    sc('s1', SB, 1, { nl: 'Scrum en de sprint', en: 'Scrum and the sprint' }, [
      { nl: '{t:Scrum|Scrum}: een raamwerk voor een klein team en complexe producten.', en: '{t:Scrum|Scrum}: a framework for a small team and complex products.', cue: { Scrum: 'scrum' }, focus: 'scrum' },
      { nl: 'De Scrum Guide van Schwaber en Sutherland, versie 2020.', en: 'The Scrum Guide by Schwaber and Sutherland, 2020 version.', focus: 'guide' },
      { nl: 'Vaste rollen, momenten en lijsten; de rest is aan het team.', en: 'Fixed accountabilities, events and lists; the rest is up to the team.', focus: 'little' },
      { nl: '{t:Sprint|Sprints}: hooguit een maand, vaak twee weken, direct na elkaar.', en: '{t:Sprint|Sprints}: a month or less, often two weeks, back to back.', cue: { Sprint: 'sprint' }, focus: ['sprint', 'calendar'] },
      { nl: 'Elke sprint iets bruikbaars, in een vast ritme.', en: 'Something usable every sprint, in a fixed rhythm.', focus: 'usable' },
      { nl: 'Te lang is riskant: het doel veroudert, problemen blijven verborgen.', en: 'Too long is risky: the goal goes stale, problems stay hidden.', focus: 'risk' },
    ]),
    sc('s2', SB, 1, { nl: 'Drie verantwoordelijkheden', en: 'Three accountabilities' }, [
      { nl: 'Het {t:Scrum Team|Scrum Team}: meestal tien of minder, geen hiërarchie.', en: 'The {t:Scrum Team|Scrum Team}: usually ten or fewer, no hierarchy.', cue: { 'Scrum Team': 'team' }, focus: ['team', 'po', 'sm', 'devs'] },
      { nl: 'Drie verantwoordelijkheden, accountabilities: sinds 2020 zo genoemd, niet functies.', en: 'Three accountabilities: the Guide’s word since 2020, not job titles.', focus: 'acc' },
      { nl: '{t:Product Owner|Product Owner}: één persoon. Bewaakt de waarde: wat eerst, en waarom.', en: '{t:Product Owner|Product Owner}: one person. Looks after value: what first, and why.', cue: { 'Product Owner': 'cpo' }, focus: ['cpo', 'po'] },
      { nl: '{t:Scrum Master|Scrum Master}: helpt Scrum goed te gebruiken, ruimt obstakels op. Geen baas.', en: '{t:Scrum Master|Scrum Master}: helps use Scrum well, removes impediments. No boss.', cue: { 'Scrum Master': 'csm' }, focus: ['csm', 'sm'] },
      { nl: '{t:Developers|Developers}: iedereen die bouwt.', en: '{t:Developers|Developers}: anyone who builds.', cue: { Developers: 'cdev' }, focus: ['cdev', 'devs'] },
      { nl: 'Lean-blik: de Product Owner als klantstem, de Scrum Master als coach.', en: 'Lean view: the Product Owner as customer voice, the Scrum Master as coach.', focus: 'lean' },
    ]),
    sc('s3', SB, 1, { nl: 'Voorbeeld: de buizenfabriek', en: 'Example: the pipe plant' }, [
      { nl: 'In de fabriek: IT-teams voor MES, ERP, data en machinesoftware.', en: 'In the plant: IT teams for MES, ERP, data and machine software.', focus: ['plant', 'devs'] },
      { nl: 'Fout: de IT-manager als Product Owner én Scrum Master.', en: 'Mistake: the IT manager as Product Owner and Scrum Master.', focus: 'mistake' },
      { nl: 'Vraag: wie beslist wat eerst komt, wie bewaakt hoe we werken?', en: 'Ask: who decides what comes first, who guards how we work?', focus: 'ask' },
      { nl: 'Buizenfabrikant, MES-team van {n:7}. Product Owner: de productieleider.', en: 'A pipe maker, MES team of {n:7}. Product Owner: the production manager.', focus: ['pipes', 'po'] },
      { nl: 'Scrum Master uit het Lean-team, plus vijf Developers.', en: 'Scrum Master from the Lean team, plus five Developers.', focus: ['roles', 'sm', 'devs'] },
      { nl: 'Sprint {n:5}: afkeur per oorzaak op het scherm, niet op papier.', en: 'Sprint {n:5}: scrap by cause on the screen, not on paper.', focus: ['goal5', 'calendar'] },
      { nl: 'Na twee weken: alle ploegen. Dan sprint {n:6}.', en: 'After two weeks: all shifts. Then sprint {n:6}.', focus: ['shifts', 'calendar'] },
    ]),
    sc('s4', EV, 2, { nl: 'Vijf events, en de planning', en: 'Five events, and the planning' }, [
      { nl: 'Vijf events: plannen, inspecteren, bijsturen. De sprint bevat de andere vier.', en: 'Five events: plan, inspect, adapt. The sprint holds the other four.', focus: ['five', 'calendar'] },
      { nl: 'Elk een {t:Timebox|timebox}: bij een maand planning {n:8} uur, daily {n:15} minuten.', en: 'Each a {t:Timebox|timebox}: for a month, planning {n:8} h, daily {n:15} min.', cue: { Timebox: 'tbox' }, focus: 'tbox' },
      { nl: '{t:Sprint Planning|Sprint Planning}: waarom waardevol? Dat wordt het sprintdoel.', en: '{t:Sprint Planning|Sprint Planning}: why valuable? That gives the sprint goal.', cue: { 'Sprint Planning': 'why' }, focus: ['why', 'po'] },
      { nl: 'Wat kan er af? De Developers kiezen.', en: 'What can be done? The Developers pick.', focus: ['what', 'devs', 'board'] },
      { nl: 'Hoe? Stukken van een dag of minder.', en: 'How? Pieces of a day or less.', focus: ['how', 'board'] },
      { nl: 'De Developers bepalen hoeveel, de Product Owner wat eerst.', en: 'The Developers decide how much, the Product Owner what first.', focus: ['much', 'devs', 'po'] },
    ]),
    sc('s5', EV, 2, { nl: 'Daily, review en retro', en: 'Daily, review and retro' }, [
      { nl: '{t:Daily Scrum|Daily Scrum}: {n:15} minuten, elke werkdag, richting het sprintdoel.', en: '{t:Daily Scrum|Daily Scrum}: {n:15} minutes, every working day, toward the sprint goal.', cue: { 'Daily Scrum': 'daily' }, focus: ['daily', 'devs', 'board'] },
      { nl: 'Geen statusoverleg. Het team kiest de vorm.', en: 'No status meeting. The team picks the format.', focus: 'status' },
      { nl: '{t:Sprint Review|Sprint Review}: belanghebbenden zien wat af is. Een werksessie.', en: '{t:Sprint Review|Sprint Review}: stakeholders see what is done. A working session.', cue: { 'Sprint Review': 'review' }, focus: ['review', 'users'] },
      { nl: 'Geen poort: wat af is, mag eerder in gebruik.', en: 'No gate: what is done may go into use earlier.', focus: 'gate' },
      { nl: '{t:Sprint Retrospective|Sprint Retrospective}: terugkijken, één concrete verbetering.', en: '{t:Sprint Retrospective|Sprint Retrospective}: look back, one concrete improvement.', cue: { 'Sprint Retrospective': 'retro' }, focus: ['retro', 'sm', 'board'] },
      { nl: 'Refinement is geen event: het loopt door.', en: 'Refinement is not an event: it runs all the time.', focus: 'refine' },
    ]),
    sc('s6', EV, 2, { nl: 'Voorbeeld: twee weken bij de drank', en: 'Example: two weeks at the drinks plant' }, [
      { nl: 'Drankenproducent: sprints van {n:10} werkdagen, timeboxes gehalveerd.', en: 'A beverage maker: sprints of {n:10} working days, timeboxes halved.', focus: ['drinks', 'calendar'] },
      { nl: 'Maandag: Sprint Planning, hooguit {n:4} uur.', en: 'Monday: Sprint Planning, at most {n:4} hours.', focus: ['plan4', 'calendar'] },
      { nl: 'Elke werkdag om 9:00 de Daily Scrum, bij het bord.', en: 'Every working day at 9:00, the Daily Scrum, at the board.', focus: ['day9', 'board', 'calendar'] },
      { nl: 'Vrijdag week {n:2}: review met de ploegleiders, dan de retro.', en: 'Friday week {n:2}: review with the shift leaders, then the retro.', focus: ['fri', 'users', 'calendar'] },
      { nl: '{n:10} × {n:15} minuten = {n:150} minuten, {n:2.5} uur per persoon.', en: '{n:10} × {n:15} minutes = {n:150} minutes, {n:2.5} hours per person.', focus: 'sum' },
    ]),
    sc('s7', AR, 3, { nl: 'Twee backlogs, twee doelen', en: 'Two backlogs, two goals' }, [
      { nl: 'Drie artefacten, elk met een toezegging.', en: 'Three artefacts, each with a commitment.', focus: 'arte' },
      { nl: '{t:Product Backlog|Product Backlog}: geordende lijst; de Product Owner bepaalt de volgorde.', en: '{t:Product Backlog|Product Backlog}: an ordered list; the Product Owner sets the order.', cue: { 'Product Backlog': 'pb' }, focus: ['pb', 'po'] },
      { nl: 'Toezegging: het {t:Product Goal|Product Goal}, het doel op lange termijn.', en: 'Commitment: the {t:Product Goal|Product Goal}, the long-term objective.', cue: { 'Product Goal': 'pg' }, focus: 'pg' },
      { nl: '{t:Sprint Backlog|Sprint Backlog}: het plan van de Developers.', en: '{t:Sprint Backlog|Sprint Backlog}: the Developers’ plan.', cue: { 'Sprint Backlog': 'sb' }, focus: ['sb', 'board', 'devs'] },
      { nl: 'Toezegging: het {t:Sprint Goal|Sprint Goal}, het ene doel.', en: 'Commitment: the {t:Sprint Goal|Sprint Goal}, the single objective.', cue: { 'Sprint Goal': 'sg' }, focus: 'sg' },
      { nl: 'Te groot? Inhoud bijstellen met de Product Owner; het doel blijft.', en: 'Too big? Adjust scope with the Product Owner; the goal stands.', focus: ['scope', 'po'] },
    ]),
    sc('s8', AR, 3, { nl: 'Increment en Definition of Done', en: 'Increment and Definition of Done' }, [
      { nl: '{t:Increment|Increment}: werkend product dat af is.', en: '{t:Increment|Increment}: working product that is done.', cue: { Increment: 'inc' }, focus: ['inc', 'board'] },
      { nl: 'Toezegging: de {t:Definition of Done|Definition of Done}.', en: 'Commitment: the {t:Definition of Done|Definition of Done}.', cue: { 'Definition of Done': 'dod' }, focus: 'dod' },
      { nl: 'Voldoet het niet? Niet tonen: terug naar de Product Backlog.', en: 'Doesn’t meet it? Not shown: back to the Product Backlog.', focus: ['back', 'board'] },
      { nl: 'Een kwaliteitspoort: half werk telt niet.', en: 'A quality gate: half-done work doesn’t count.', focus: 'qgate' },
      { nl: 'Sprint Goal zinloos? Alleen de Product Owner breekt af.', en: 'Sprint Goal obsolete? Only the Product Owner cancels.', focus: ['cancel', 'po'] },
      { nl: 'Fouten: {n:400} items, een takenlijst van de baas, Done als “code geschreven”.', en: 'Mistakes: {n:400} items, the boss’s task list, Done as “code written”.', focus: 'errs' },
      { nl: 'Vraag naar het Product Goal, het sprintdoel en de Definition of Done.', en: 'Ask for the Product Goal, the sprint goal and the Definition of Done.', focus: 'qs' },
    ]),
    sc('s9', AR, 3, { nl: 'Voorbeeld: de weegschaal', en: 'Example: the scale' }, [
      { nl: 'Weegschalen aan het MES. Sprint {n:4}: lijn {n:1} stuurt gewichten.', en: 'Scales to the MES. Sprint {n:4}: line {n:1} sends weights.', focus: 'scales' },
      { nl: 'Done: echte weegdata, gecontroleerd door kwaliteit, acceptatieomgeving.', en: 'Done: real weighing data, checked by quality, acceptance environment.', focus: 'dodx' },
      { nl: '{n:5} items, {n:3} af. Item {n:4} niet gecontroleerd, item {n:5} niet begonnen.', en: '{n:5} items, {n:3} done. Item {n:4} not checked, item {n:5} not started.', focus: ['items', 'board'] },
      { nl: 'In de review: alleen de {n:3}.', en: 'At the review: only the {n:3}.', focus: ['show', 'users'] },
      { nl: 'Items {n:4} en {n:5} terug; de Product Owner bepaalt de volgorde.', en: 'Items {n:4} and {n:5} go back; the Product Owner sets the order.', focus: ['retour', 'po', 'board'] },
      { nl: 'Gewichten van lijn {n:1} in het MES? Doel gehaald.', en: 'Line {n:1}’s weights in the MES? Goal met.', focus: 'met' },
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
// (nl_NL-alex, 2026-11-13). Read as written: Scrum, sprint, Scrum Team, Scrum
// Master, Sprint Planning, Increment, timebox (the taimboks rule of
// pm.outside.disagree), agile (etsjail, pm.plan.method), Lean-consultant (Lien
// consultant, pm.run.conflict), MES (em ee es), klantstem, kaizenmotor,
// kaizenbord, belanghebbenden, werksessie, kwaliteitspoort, buizenfabrikant,
// drankenproducent, weegschalen, gedocumenteerd, geïnstalleerd. New SAY rules
// in films/_kit/timeline.mjs (tested; recomputed for every film: no other
// film's spoken text changes): Product Owner, Product Backlog and Product Goal
// (Prodduct Ooner, Bek-lok, Gool), Sprint Backlog and Sprint Goal, Developers
// (Di-vellopers), Daily Scrum (Deeli), Sprint Review (Rievjoe), Sprint
// Retrospective (Retro-spektif), Scrum Guide after "van" and the Guide after
// "volgens" (Gaid), Ken Schwaber en Jeff Sutherland (Sjwaaber, Djef),
// Definition of Done with a capital D (Deffi-nisjun of Dun), events
// (ievents), refinement (ri-fainmunt), and split compounds: productieleider,
// extrusielijn, waardestroom, acceptatieomgeving, sprintdoel, "uit het
// Lean-team" (Lien team) and "gangbare vuistregel". Said around because
// espeak-ng misreads them (they stay in the captions and on the cards):
// manager ("maa-naa-gher": said "het hoofd IT", "de baas"), machinesoftware
// ("zoftwaare": said "software voor machines"), slides ("slie-des": said
// "dia's"), live ("lie-ve": said "in gebruik"), a lower-case review or
// retrospective (always the full Sprint Review, Sprint Retrospective in the
// voice), accountabilities and stakeholders (said in Dutch,
// verantwoordelijkheden and belanghebbenden), Lean-taal ("lee-an": said "als
// Lean-consultant", the Lien consultant rule), timeboxes (the taimboks rule
// covers the singular: said "elke timebox") and "item vier" ("ie-tem", while
// items is "ai-tems": said "nummer vier"). ERP stays the word "erp" in both
// voices, as eng.ot.isa95 and eng.ot.orderflow say it. Years in words.
const SAY = [
  [ // s1 scrum and the sprint
    { nl: '{t:Scrum|Scrum} is een raamwerk voor een klein team en complexe producten: de bekendste agile werkwijze.',
      en: '{t:Scrum|Scrum} is a framework for a small team and complex products: the best-known agile way.' },
    { nl: 'De Scrum Guide van Ken Schwaber en Jeff Sutherland beschrijft het, in zo\'n dertien pagina\'s.',
      en: 'The Scrum Guide by Ken Schwaber and Jeff Sutherland describes it, in about thirteen pages.' },
    { nl: 'Vaste rollen, momenten en lijsten; de rest laat het bewust aan het team.',
      en: 'Fixed accountabilities, events and lists; the rest it deliberately leaves to the team.' },
    { nl: 'Het werk gebeurt in {t:Sprint|sprints} van hooguit een maand, vaak twee weken, direct na elkaar.',
      en: 'The work happens in {t:Sprint|sprints} of one month or less, often two weeks, back to back.' },
    { nl: 'Elke sprint levert iets bruikbaars op, in een vast ritme.',
      en: 'Each sprint delivers something usable, in a fixed rhythm.' },
    { nl: 'Langer is riskant: het doel veroudert, en problemen blijven verborgen.',
      en: 'Longer is risky: the goal goes stale, and problems stay hidden.' },
  ],
  [ // s2 three accountabilities
    { nl: 'Het {t:Scrum Team|Scrum Team} is klein: meestal tien mensen of minder, zonder hiërarchie.',
      en: 'The {t:Scrum Team|Scrum Team} is small: typically ten people or fewer, with no hierarchy.' },
    { nl: 'Het draagt drie verantwoordelijkheden. Sinds tweeduizend twintig zijn dat geen functies.',
      en: 'It holds three accountabilities. Since 2020, they are not job titles.' },
    { nl: 'De {t:Product Owner|Product Owner} is één persoon, geen commissie. Hij bewaakt de waarde: wat eerst komt, en waarom.',
      en: 'The {t:Product Owner|Product Owner} is one person, not a committee, guarding value: what comes first, and why.' },
    { nl: 'De {t:Scrum Master|Scrum Master} helpt Scrum goed te gebruiken, en ruimt obstakels op. Hij is geen baas.',
      en: 'The {t:Scrum Master|Scrum Master} helps people use Scrum well and removes impediments. Not the boss.' },
    { nl: 'De {t:Developers|Developers} maken het werk: iedereen die bouwt, ook testers en analisten.',
      en: 'The {t:Developers|Developers} do the work: anyone who builds, testers and analysts too.' },
    { nl: 'Voor jou als Lean-consultant: de Product Owner is de klantstem, de Scrum Master een coach van het systeem.',
      en: 'In Lean terms: the Product Owner is the customer\'s voice, the Scrum Master a coach of the system.' },
  ],
  [ // s3 in the plant, and the pipe maker
    { nl: 'In de fabriek werken vooral IT-teams zo: voor MES, ERP, data en software voor machines.',
      en: 'In factories, mostly IT teams work this way: MES, ERP, data and machine software.' },
    { nl: 'Een veelgemaakte fout: het hoofd IT als Product Owner én Scrum Master. Niemand houdt hem een spiegel voor.',
      en: 'A common mistake: the IT manager as Product Owner and Scrum Master. Nobody holds up a mirror.' },
    { nl: 'Vraag: wie beslist wat er eerst komt, en wie bewaakt hoe we werken?',
      en: 'Ask: who decides what comes first, and who guards how we work?' },
    { nl: 'Voorbeeld: een buizenfabrikant, een team van zeven. Product Owner: de productieleider, twee dagen per week.',
      en: 'Example: a pipe maker, a team of seven. Product Owner: the production manager, two days a week.' },
    { nl: 'Scrum Master: een procesverbeteraar uit het Lean-team. Plus vijf Developers.',
      en: 'Scrum Master: a process improver from the Lean team. Plus five Developers.' },
    { nl: 'Doel van sprint vijf: afkeur per oorzaak op een scherm melden, niet op papier.',
      en: 'Sprint five\'s goal: operators report scrap by cause on a screen, not paper.' },
    { nl: 'Na twee weken gebruiken alle ploegen het. Maandag begint sprint zes.',
      en: 'After two weeks, all shifts use it. Sprint six starts the next Monday.' },
  ],
  [ // s4 five events, and the planning
    { nl: 'Scrum kent vijf events: vaste momenten om te plannen, te inspecteren en bij te sturen. De sprint bevat de andere vier.',
      en: 'Scrum has five events: fixed moments to plan, inspect and adapt. The sprint contains the other four.' },
    { nl: 'Elk heeft een {t:Timebox|timebox}, een maximale duur. Bij een maand: planning hooguit acht uur, de Daily Scrum een kwartier.',
      en: 'Each has a {t:Timebox|timebox}, a maximum duration. For a month: planning at most eight hours, the Daily Scrum fifteen minutes.' },
    { nl: 'De {t:Sprint Planning|Sprint Planning} beantwoordt drie vragen. Waarom is deze sprint waardevol? Dat wordt het sprintdoel.',
      en: '{t:Sprint Planning|Sprint Planning} answers three questions. Why is this sprint valuable? That becomes the sprint goal.' },
    { nl: 'Wat kan er af? Dat kiezen de Developers.',
      en: 'What can be done? The Developers pick it.' },
    { nl: 'En hoe? In stukken van meestal een dag of minder.',
      en: 'And how? In pieces of usually a day or less.' },
    { nl: 'De Developers bepalen hoeveel, de Product Owner wat het belangrijkst is.',
      en: 'The Developers decide how much. The Product Owner says what matters most.' },
  ],
  [ // s5 daily, review and retro
    { nl: 'De {t:Daily Scrum|Daily Scrum}: een kwartier voor de Developers, elke werkdag op dezelfde tijd en plek, richting het sprintdoel.',
      en: 'The {t:Daily Scrum|Daily Scrum}: fifteen minutes for the Developers, every working day, same time and place, toward the sprint goal.' },
    { nl: 'Geen statusoverleg voor de baas; de vorm kiest het team zelf.',
      en: 'Not a status meeting for a manager; the team picks the format.' },
    { nl: 'De {t:Sprint Review|Sprint Review} laat belanghebbenden zien wat af is; samen bespreken ze wat nu het belangrijkst is. Een werksessie, geen presentatie.',
      en: 'The {t:Sprint Review|Sprint Review} shows stakeholders what is done; together they discuss what matters most now. A working session, not a presentation.' },
    { nl: 'En nooit een poort: wat af is, mag eerder in gebruik.',
      en: 'And never a gate: what is done may go into use earlier.' },
    { nl: 'In de {t:Sprint Retrospective|Sprint Retrospective} kijkt het team terug: de kaizenmotor van Scrum, met één concrete actie.',
      en: 'In the {t:Sprint Retrospective|Sprint Retrospective} the team looks back: Scrum\'s kaizen engine, with one concrete action.' },
    { nl: 'Refinement, het verfijnen van de lijst, is geen event. Dat loopt door.',
      en: 'Refinement, refining the list, is not an event. It runs all the time.' },
  ],
  [ // s6 the beverage example
    { nl: 'Een voorbeeld: een drankenproducent met sprints van tien werkdagen. Het team halveert elke timebox, een gangbare vuistregel.',
      en: 'An example: a beverage maker with ten-day sprints. The team halves the timeboxes, a common rule of thumb.' },
    { nl: 'Maandag de planning, hooguit vier uur.',
      en: 'Monday, the planning, at most four hours.' },
    { nl: 'Elke werkdag om negen uur de Daily Scrum.',
      en: 'Every working day at nine, the Daily Scrum.' },
    { nl: 'Vrijdag in week twee de Sprint Review met de ploegleiders, en de Sprint Retrospective.',
      en: 'Friday of week two, the review with the shift leaders, then the retrospective.' },
    { nl: 'Tien dagen een kwartier: tweeënhalf uur per persoon per sprint.',
      en: 'Ten days of fifteen minutes: two and a half hours per person per sprint.' },
  ],
  [ // s7 two backlogs, two goals
    { nl: 'Dan de drie artefacten, sinds tweeduizend twintig elk met een toezegging.',
      en: 'Then the three artefacts. Since 2020, each has a commitment.' },
    { nl: 'De {t:Product Backlog|Product Backlog} is de geordende lijst van alles wat het product beter maakt. De Product Owner bepaalt de volgorde.',
      en: 'The {t:Product Backlog|Product Backlog} is the ordered list of everything that could improve the product. The Product Owner decides the order.' },
    { nl: 'De toezegging is het {t:Product Goal|Product Goal}, het doel op langere termijn.',
      en: 'Its commitment is the {t:Product Goal|Product Goal}, the longer-term objective.' },
    { nl: 'De {t:Sprint Backlog|Sprint Backlog} is het plan van de Developers voor deze sprint. Het verandert als ze leren.',
      en: 'The {t:Sprint Backlog|Sprint Backlog} is the Developers\' plan for this sprint. It changes as they learn.' },
    { nl: 'De toezegging is het {t:Sprint Goal|Sprint Goal}: het ene doel, dat focus geeft.',
      en: 'Its commitment is the {t:Sprint Goal|Sprint Goal}: the single objective, which gives focus.' },
    { nl: 'Te groot? Dan passen ze de inhoud aan met de Product Owner; het doel blijft.',
      en: 'Too big? Then they renegotiate the scope with the Product Owner; the goal stands.' },
  ],
  [ // s8 the increment and the definition of done
    { nl: 'Het {t:Increment|Increment} is werkend product dat af is; soms meerdere per sprint.',
      en: 'The {t:Increment|Increment} is working product that is done; a sprint can have several.' },
    { nl: 'De toezegging: de {t:Definition of Done|Definition of Done}, wanneer werk echt af is, zoals getest en geïnstalleerd.',
      en: 'Its commitment: the {t:Definition of Done|Definition of Done}, when work is really done, such as tested and installed.' },
    { nl: 'Wat daar niet aan voldoet, wordt niet getoond, en gaat terug naar de Product Backlog.',
      en: 'Work that fails it is not shown; it goes back to the Product Backlog.' },
    { nl: 'Voor jou: een kwaliteitspoort aan het eind van de lijn. Half werk telt niet.',
      en: 'For you: a quality gate at the end of the line. Half-done work doesn\'t count.' },
    { nl: 'Is het Sprint Goal zinloos, dan mag alleen de Product Owner de sprint afbreken. Zelden.',
      en: 'Is the Sprint Goal obsolete? Only the Product Owner may cancel the sprint. Rarely.' },
    { nl: 'Fouten: vierhonderd items, een takenlijst van de baas, een Definition of Done van alleen code.',
      en: 'Mistakes: four hundred items, the manager\'s task list, a Definition of Done of just code.' },
    { nl: 'Vraag: wat is het Product Goal? Het doel van deze sprint? Mag ik jullie Definition of Done zien?',
      en: 'So ask: what is the Product Goal? This sprint\'s goal? May I see your Definition of Done?' },
  ],
  [ // s9 the weighing example
    { nl: 'Een voorbeeld: weegschalen in een vleesfabriek koppelen aan het MES. Doel van sprint vier: lijn één stuurt gewichten.',
      en: 'An example: linking a meat plant\'s scales to the MES. Sprint four\'s goal: line one sends weights.' },
    { nl: 'De Definition of Done: getest met echte weegdata, gecontroleerd door kwaliteit, op de acceptatieomgeving.',
      en: 'The Definition of Done: tested with real weighing data, checked by quality, on the acceptance environment.' },
    { nl: 'Van vijf items voldoen er drie. Nummer vier is niet gecontroleerd, nummer vijf niet begonnen.',
      en: 'Of five items, three meet it. Item four is not checked, item five not started.' },
    { nl: 'Wat laat het team zien? Alleen die drie.',
      en: 'What does the team show? Only those three.' },
    { nl: 'Vier en vijf gaan terug naar de Product Backlog; de Product Owner bepaalt de volgorde.',
      en: 'Four and five go back to the Product Backlog; the Product Owner decides the order.' },
    { nl: 'Komen de gewichten van lijn één al door? Dan is het doel gehaald: een sprintdoel is sterker dan een takenlijst.',
      en: 'Do line one\'s weights already get through? Then the goal is met: a sprint goal beats a task list.' },
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
  nl: /\b(\w*manager\w*|Guide|Owner|Backlog|Goal|Developers?|Daily|Review|Retrospective|review|retrospective|retro|events?|refinement|Schwaber|Jeff|Lean-team|live|slides|machinesoftware|sprintdoel|productieleider|accountabilit\w*|stakeholders?|e-?mail)\b|(^|[.?!;]\s)Eén\b/,
  en: /\bUry\b/,
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
  // the seconds lost to rounding down go to the scenes that lost the most
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

const PEOPLE = ':is([data-cue="po"],[data-cue="sm"],[data-cue="devs"],[data-cue="users"])';
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
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een teamruimte. Aan de achterwand een scrumbord met drie kolommen, te doen, bezig en af, waarop kaartjes verschuiven, en een klok; aan de zijwand een kalenderstrook van tien werkdagen, de twee weken van een sprint, waarop de events oplichten: de planning op dag één, elke dag een stip voor de Daily Scrum, review en retrospective op dag tien. Aan het linkereind van de tafel de Product Owner met een tablet, aan het rechtereind de Scrum Master, drie Developers, twee achter de tafel en één vooraan, en vooraan de ploegleider van de vloer in zijn werkvest, de gebruiker bij de review. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: Scrum en de sprint; de drie verantwoordelijkheden; de buizenfabriek; de vijf events met hun timeboxes en de drie vragen van de planning; daily, review en retro; de twee weken bij de drankenproducent; de twee backlogs en hun doelen; het increment en de Definition of Done; en de weegschaal van de vleesfabriek.',
  en: 'A team room. On the back wall a Scrum board with three columns, to do, doing and done, where cards move, and a clock; on the side wall a calendar strip of ten working days, the two weeks of a sprint, where the events light up: planning on day one, a dot for the Daily Scrum each day, review and retrospective on day ten. At the left end of the table the Product Owner with a tablet, at the right end the Scrum Master, three Developers, two behind the table and one in front, and in front the shift lead from the floor in his work vest, the user at the review. At the right a panel with one card per scene, marked as example or diagram: Scrum and the sprint; the three accountabilities; the pipe plant; the five events with their timeboxes and the three planning questions; daily, review and retro; two weeks at the beverage maker; the two backlogs and their goals; the increment and the Definition of Done; and the scale at the meat plant.',
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

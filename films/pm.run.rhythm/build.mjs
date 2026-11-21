// Dev tool, not shipped. Builds the explainer film "Een overlegritme dat werkt
// / A meeting rhythm that works" for the Projects course: pm.intake.start
// (level 2 of Stakeholders en vertrouwen, "De eerste weken"), pm.run.rhythm
// (level 1 of Team en overleg) and pm.perform.rhythm (level 2 of Ritme en
// systeem, "Een overlegritme dat blijft").
//
//   node films/pm.run.rhythm/build.mjs            build the page
//   node films/pm.run.rhythm/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.run.rhythm.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.run.rhythm, P2): a week calendar coming alive: stand-up, weekly,
// steering group, decision note; four scenes, about 90 s. Storyboard drift:
// nine scenes and about five minutes, because a lesson with a film no longer
// shows its worked example, so the film carries the whole teach text and the
// worked example of three lessons: the first weeks (s1 to s3, with the pump
// assembly), the three meetings and the beverage plant's week (s4, s5),
// agendas, the decision note and the minutes (s6), the people side (s7), the
// review cascade (s8) and the handover with the parts manufacturer (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (it repeats the panel in miniature), a
// wall clock and a calendar strip of twelve weeks on the side wall (the
// kick-off and the first quick wins, the floor weeks, the stop log, the
// steering group every five weeks, the four handover weeks), a table with a
// sheet that fills as minutes and as the action list, and the recurring cast:
// "jij" the consultant in petrol at the board, the sponsor, the team lead and
// the planner. A panel at the right, in stage space, carries one card per
// scene, labelled "schema" (a general picture) or "voorbeeld" (the worked
// examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// board, the calendar strip and the sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries it):
//   start teach 1: quick wins and foundations in parallel (s1 b2); a quick win
//     is a small visible fix from the people themselves, a missing tool (card),
//     a printer that jams every shift (s1 b2); foundations the slower
//     groundwork: baseline, clear roles, a meeting rhythm (s1 b2); quick wins
//     alone a show, foundations alone and people see nothing for six weeks
//     and drop out; one or two quick wins in each of the first four weeks (s1 b3)
//   start teach 2: the kick-off starts the project officially: goal, scope
//     (said: skoop), roles, first steps; short, about an hour; the sponsor says why it matters
//     in his own words (s1 b1); trust from doing what you say: write down every
//     promise however small, "I'll check that with IT" (card), come back within
//     a week, even with "no, and here's why" (s2 b3)
//   start teach 3: the first two weeks on the floor or with the crews, not in
//     the meeting room; ask before you suggest; a changeover, a day with a field
//     crew (s2 b1); what you see beats any report: 40 metres for a tool, three
//     calls for one answer (card); times and counts, not just impressions (s2 b2)
//   start teach 4: set the rhythm early, fixed meetings with a fixed agenda
//     (s4 b1); a weekly 30-minute check with the process owner (s4 b3); a short
//     stand-up, a quarter, standing, what's done and what's stuck (s4 b2); a
//     monthly steering group where the sponsor checks progress and decides
//     (s4 b4, "monthly" on the card); fixed day, time, agenda: progress against the goal, what's
//     stuck, which decisions (s4 b1); problems in week three, not month four (s4 b5)
//   start teach 5: resistance in weeks 1 to 4, "we tried this in 2019", "you
//     don't know our process" (card), often true; "You're right, I don't know it
//     the way you do. What went wrong in 2019?" (card, said as "ask what went
//     wrong then"); that history tells you what to avoid (s2 b4); the trap: so many
//     quick wins the baseline never gets measured; week 4: "do we know the
//     starting number yet?" (s2 b5)
//   start example: week 1 at a pump assembly, two days on the line, one with
//     planning; the torque wrench (the term on the card, its meaning said)
//     missing on second shift, about 20 minutes a shift (s3 b1); raised with
//     the team lead, a second wrench Wednesday for 400 euro (s3 b2); a two-week
//     stop log as baseline, Tuesday 9:00 weekly check with the production
//     manager (s3 b3); by week 3 operators come with problems: trust (s3 b4)
//   rhythm teach 1: three meetings (s4 b2); the stand-up: 15 minutes standing
//     at a whiteboard, two or three times a week, done, next, what blocks; from
//     agile methods such as Scrum, short cycles (card, s4 b2); the weekly team
//     meeting, 45 to 60 minutes: progress, blockers, decisions needed (s4 b3);
//     a steering group every four to six weeks, 60 to 90 minutes: the sponsor,
//     the senior manager who owns goal and budget, plus a few department heads
//     (s4 b4)
//   rhythm teach 2: agendas that end in decisions; label each item decide,
//     discuss or inform (s6 b1); decision items as a question, "Do we extend the
//     pilot to region North from week 12?" (s6 b2); the agenda two days before
//     with a decision note: one page, question, options, recommendation,
//     deadline; information items in a written update, not in the meeting (s6 b3)
//   rhythm teach 3: the minutes, the written record; only decisions and
//     actions, what was decided, who does what by when; sent the same day
//     (s6 b4); start the next meeting with the actions; slipping actions say
//     more than any status slide; "Which of last week's actions are done?" (s6 b6)
//   rhythm teach 4: client staff drown in meetings; each one you add costs them
//     hours; short, on time, end early, cancel when nothing to decide (s7 b1);
//     a sponsor who keeps cancelling: a signal, not bad luck; "Is this still the
//     right moment, or should we find another way for you to decide?" (said and
//     shown in short, s7 b2)
//   rhythm teach 5: the weekly grows to twelve who only listen, the steering
//     group a slideshow where nothing is decided (s7 b3); experts differ:
//     full-time agile teams a daily stand-up (agile said: etsjail), part-time
//     client teams often two a week; test: past 15 minutes, or nobody names a blocker: change the format
//     (s7 b4)
//   rhythm example: downtime (the hours a line stands still when it should
//     run) at a beverage plant; stand-up Monday and Thursday 08:30 at the board
//     on the floor, 15 minutes, five people (s5 b1); weekly Tuesday 13:00, 45
//     minutes: 10 actions, 15 progress against the one-page plan, 15 two
//     decisions (which line next, the supplier: card), 5 next week (s5 b2);
//     steering group every five weeks, 60 minutes, three decision items (s5 b3),
//     the decision note sent the Friday before (s6 b3); after the first
//     steering group the minutes fit on half a page: three decisions, four
//     actions, sent at 16:00 the same day (s6 b5)
//   perform teach 1: a review cascade, short meetings that feed each other;
//     team daily or weekly, about 15 minutes standing at the board; department
//     weekly or every two weeks; management monthly; the same definitions all
//     the way up (s8 b1); escalation connects the levels: up one level, with a
//     date by which a decision comes back (s8 b2); the daily ladder is in Land
//     (card, s8 b2)
//   perform teach 2: frequency fits the number; daily for jobs started or
//     breakdowns, monthly for cost per connection or customer satisfaction; a
//     slow number daily is noise and frustration; as often as it can really
//     change and someone can act on it (s8 b3)
//   perform teach 3: a fixed agenda: last actions, numbers against target, one
//     or two problems in depth, new actions; same time, same place (s8 b4); one
//     visible action list, who does what by when; one nobody looks at is how a
//     rhythm dies (s8 b5)
//   perform teach 4: design for your exit from day one; a line manager chairs,
//     you coach from the side and step back; the gradual handover is the real
//     deliverable (s9 b1); the data refreshes without you; a one-page
//     description of who, when, which numbers, how problems go up; check after
//     you leave (s9 b4)
//   perform teach 5: cancelled "just this once", then for good; the same action
//     carried over for six weeks; a board kept by one enthusiast who goes on
//     holiday; 15 minutes daily with eight people is 10 person-hours a week, so
//     it must save more (s9 b5); "If I don't show up next week, will this
//     meeting happen?" (s9 b6)
//   perform example: a parts manufacturer, a weekly KPI review chaired by you
//     for eight weeks, the spreadsheet updated by you every Monday (card); the
//     production manager attends and likes it (card); the contract ends in four
//     weeks (s9 b2); week 1 he chairs, you beside; week 2 you only attend; weeks 3 and
//     4 you stay away and ask afterwards (s9 b3); the refresh to an automatic
//     export or the planner who owns the source, tested while there (card); the
//     one-pager; a check four and twelve weeks after, with the sponsor (card)
//     (s9 b4);
//     sustaining results is in Land (card, s9 b4)
//
// Facts: nothing here is credited to a source; every claim is the lessons' own
// (Scrum as an agile method of short cycles is the lesson's wording). The
// numbers the film works out are asserted below: 10 + 15 + 15 + 5 = 45
// minutes, and 15 minutes a day, five days, eight people = 10 person-hours.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The three lessons' facts, asserted against their current text (the build
// fails if one drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const ST = 'pm.intake.start';
const RH = 'pm.run.rhythm';
const PF = 'pm.perform.rhythm';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(ST, ['Quick wins en fundament, tegelijk', 'die van de mensen zelf komt: een ontbrekend gereedschap, een printer die elke dienst vastloopt', 'nulmeting (baseline), duidelijke rollen, een vast overlegritme',
  'Alleen quick wins wordt een show', 'zes weken niks en haken af', 'één of twee quick wins in elk van de eerste vier weken',
  'doel, scope, rollen, eerste stappen', 'zo’n uur', 'in zijn eigen woorden zeggen waarom het ertoe doet', 'van doen wat je zegt', '(“ik check dat even bij IT”)', 'binnen een week op terug', '“nee, en dit is waarom”',
  'de eerste twee weken vooral op de vloer', 'Vraag voordat je iets voorstelt', 'tijdens een omstelling', 'rij een dag mee met een ploeg monteurs', 'verslaat elk rapport', '40 meter loopt', 'drie mensen belt voor één antwoord', 'tijden en aantallen',
  'vaste overleggen met een vaste agenda', 'wekelijkse check van 30 minuten met de proceseigenaar', 'een kwartier, staand: wat is af, wat zit vast', 'maandelijkse stuurgroep', 'voortgang op het doel, wat zit vast, welke besluiten zijn nodig', 'in week drie, niet in maand vier',
  'in 2019 ook geprobeerd', 'jij kent ons proces niet', 'Allebei vaak waar', 'Klopt, ik ken het niet zoals jij. Wat ging er in 2019 mis?', 'wat je moet vermijden', 'de nulmeting nooit gemeten wordt', 'Weten we het startgetal al?',
  'Week 1 bij een pompenassemblage', 'twee dagen aan de lijn en zit één dag bij de planning', 'momentsleutel (een sleutel die bouten met een precieze kracht aandraait)', 'middagdienst', 'zo’n 20 minuten per dienst',
  'bij de teamleider; woensdag ligt er een tweede sleutel van 400 euro', 'stoplog van twee weken als nulmeting', 'dinsdag 9:00 af als wekelijkse check met de productiemanager', 'In week 3 komen operators uit zichzelf met problemen']);
says(RH, ['drie overleggen', '15 minuten staand bij een whiteboard, twee of drie keer per week', 'wat hij af heeft, wat de volgende stap is en wat hem tegenhoudt', 'agile methodes zoals Scrum: werken in korte cycli',
  '45 tot 60 minuten: voortgang, blokkades, benodigde besluiten', 'elke vier tot zes weken, 60 tot 90 minuten', 'eigenaar is van doel en budget, plus een paar afdelingshoofden',
  'besluiten, bespreken of informeren', '“Breiden we de pilot vanaf week 12 uit naar regio Noord?”', 'twee dagen vooraf', 'één A4 met de vraag, de opties, jouw advies en de deadline', 'in een schriftelijke update, niet in het overleg',
  'Houd ze bij besluiten en acties, verder niks', 'wie doet wat voor wanneer', 'Stuur ze dezelfde dag', 'Begin het volgende overleg met de acties', 'dan welke statusslide ook', '“Welke acties van vorige week zijn af?”',
  'verzuipen in overleggen', 'kost ze uren', 'begin op tijd, stop eerder als het kan, en zeg af als er niets te besluiten is', 'een signaal, geen pech', 'een andere manier vinden waarop jij beslist?',
  'twaalf mensen die alleen luisteren', 'diavoorstelling waarin niks besloten wordt', 'Experts verschillen', 'fulltime in korte cycli', 'dagelijkse stand-up', 'parttime meedraaien hebben vaak genoeg aan twee per week', 'over de 15 minuten', 'noemt niemand ooit een blokkade', 'verander dan de vorm',
  'de uren dat een lijn stilstaat terwijl hij zou moeten draaien', 'frisdrankfabriek', 'maandag en donderdag om 08:30 bij het bord op de vloer, 15 minuten, vijf mensen',
  'dinsdag 13:00, 45 minuten: 10 minuten acties, 15 minuten voortgang tegen de planning op één A4, 15 minuten twee besluiten (welke lijn hierna, of we de leverancier erbij halen), 5 minuten volgende week',
  'Stuurgroep elke vijf weken, 60 minuten, drie besluitpunten, besluitnotitie de vrijdag ervoor verstuurd', 'half A4: drie besluiten, vier acties, om 16:00 dezelfde dag verstuurd']);
says(PF, ['korte overleggen die elkaar voeden', 'Dagelijks of wekelijks op teamniveau, zo’n 15 minuten staand aan het bord', 'wekelijks of tweewekelijks op afdelingsniveau', 'maandelijks voor het management', 'Dezelfde definities van onder tot boven',
  'Escaleren verbindt de niveaus', 'een niveau omhoog, met een datum waarop er een besluit terugkomt', 'De dagelijkse ladder in een fabriek staat in Landen',
  'Laat de frequentie passen bij het cijfer', 'gestarte klussen of storingen', 'kosten per aansluiting of klanttevredenheid', 'ruis en frustratie', 'zo vaak als het echt kan veranderen en iemand erop kan handelen',
  'acties van de vorige keer, de cijfers tegen het doel, een of twee problemen in de diepte, nieuwe acties', 'Zelfde tijd, zelfde plek', 'Houd één actielijst bij: wie doet wat voor wanneer', 'Maak het zichtbaar', 'is hoe een ritme doodgaat',
  'Ontwerp vanaf dag één voor je vertrek', 'Een lijnmanager zit vanaf het begin voor', 'coacht vanaf de zijlijn en stapt dan terug', 'is het echte resultaat', 'De data ververst zonder jou', 'wie, wanneer, welke cijfers en hoe problemen omhoog gaan', 'Check na je vertrek',
  '“één keertje” vervallen, en dan voorgoed', 'zes weken wordt doorgeschoven', 'één enthousiasteling bijhoudt, die dan op vakantie gaat', 'een dagelijks overleg van 15 minuten met een team van acht kost 10 manuren per week', 'meer opleveren dan dat',
  '“Als ik volgende week niet kom, gaat dit overleg dan door?”',
  'onderdelenfabrikant', 'wekelijks KPI-overleg', 'al acht weken voor', 'spreadsheet elke maandagochtend zelf bij', 'De productiemanager is erbij en vindt het goed', 'Over vier weken loopt je opdracht af',
  'Week 1: de productiemanager zit voor en jij zit naast hem. Week 2: je bent er alleen bij. Week 3 en 4: je blijft weg en vraagt achteraf hoe het ging',
  'automatische export, of bij de planner die eigenaar is van de bron, en test dat terwijl je er nog bent', 'beschrijving van één pagina', 'vier en twaalf weken na je vertrek', 'staat in Landen (Resultaten vasthouden)']);
says(RH, ['Monday and Thursday 08:30', 'Tuesday 13:00, 45 minutes', 'every five weeks, 60 minutes', 'sent at 16:00 the same day'], 'en');
says(ST, ['torque wrench', 'Tuesday 9:00'], 'en');
says(PF, ['10 person-hours a week'], 'en');
const WEEKLY = { actions: 10, progress: 15, decisions: 15, next: 5, total: 45 };
assert(WEEKLY.actions + WEEKLY.progress + WEEKLY.decisions + WEEKLY.next === WEEKLY.total, 'the weekly agenda adds up to 45 minutes');
const COST = { min: 15, days: 5, people: 8, hours: 10 };
assert((COST.min * COST.days * COST.people) / 60 === COST.hours, '15 minutes a day, five days, eight people: 10 person-hours a week');
const STEER = { every: 5, weeks: 12 };
const STEER_WEEKS = Array.from({ length: Math.floor(STEER.weeks / STEER.every) }, (_, i) => (i + 1) * STEER.every);
assert(STEER_WEEKS.join() === '5,10' && STEER.every >= 4 && STEER.every <= 6, 'a steering group every five weeks: within four to six; weeks 5 and 10 on the strip');

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

const WEEKS = 12;
const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
// tall week cells: the side wall is seen edge-on, so the height carries the strip at 390 px
const CAL = w.calendar({ y0: 30, z0: 104, weeks: WEEKS, cw: 15.6, ch: 46 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 148, y: 150, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([158, 165, TZ]);
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
// the calendar's week cells (local u, v of the side wall), for the stage's marks
const CELLS = Array.from({ length: WEEKS }, (_, i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;

const world = [
  w.room(ROOM),
  w.clock(262, 214, 10),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calMarks),
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
  w.person({ x: 232, y: 208, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; every block of a
// card sits in its own cue group, so each beat's focus lights the block it
// explains.
const PX = 322;
const PW = 308;
const CUES = ['kick', 'qw', 'found', 'mix', 'floor', 'seen', 'promise', 'resist', 'start', 'pump', 'wrench', 'stoplog', 'trust',
  'rhythm', 'standup', 'weekly', 'steer', 'early', 'week', 'wagenda', 'steer5', 'labels', 'question', 'note', 'minutes', 'half', 'done',
  'drown', 'cancel', 'wrong', 'freq', 'cascade', 'escal', 'pace', 'agenda', 'actions', 'handover', 'case2', 'steps', 'data', 'fail', 'cost', 'ask'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const CAL_AT = w.at([0, 120, 150]).map((v) => Math.round(v * 10) / 10);
const BOARD_AT = w.at([145, 0, 150]).map((v) => Math.round(v * 10) / 10);
const SH = SHEET_AT.map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [150, 210, 1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.08] },
  { from: [150, 200, 1.04], to: [120, 230, 1.1] },
  { from: [120, 220, 1.06], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: [150, 210, 1.02], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.08] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: [150, 200, 1.04], to: [SH[0], SH[1], 1.16] },
  { from: [SH[0], SH[1], 1.1], to: [200, 210, 1.04] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.06], to: [SH[0], SH[1], 1.12] },
  { from: [150, 200, 1.08], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const C = { PX, PW, CELLS, WEEKS, STEER_WEEKS, WEEKLY, COST };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.run.rhythm',
  title: { nl: 'Een overlegritme dat werkt', en: 'A meeting rhythm that works' },
  // run.rhythm first: the shared term Stuurgroep resolves to the first served
  // lesson, and run.rhythm is the level-1 lesson that defines it
  lessons: [RH, ST, PF],
  strictFocus: true,
  scenes: [
    sc('s1', ST, 2, { nl: 'De eerste weken', en: 'The first weeks' }, [
      { nl: 'De {t:Kick-off|kick-off}: doel, scope, rollen, eerste stappen. Zo’n uur; de sponsor zegt waarom het telt.', en: 'The {t:Kick-off|kick-off}: goal, scope, roles, first steps. About an hour; the sponsor says why it matters.', cue: { 'Kick-off': 'kick' }, focus: ['kick', 'sponsor'] },
      { nl: 'Tegelijk {t:Quick win|quick wins}, klein en zichtbaar, en het {t:Fundament|fundament}: nulmeting, rollen, ritme.', en: '{t:Quick win|Quick wins}, small and visible, alongside {t:Foundations|foundations}: baseline, roles, rhythm.', cue: { 'Quick win': 'qw', Fundament: 'found' }, focus: ['qw', 'found'] },
      { nl: 'Alleen quick wins is een show; alleen fundament, en men haakt af. Eén of twee per week, vier weken.', en: 'Quick wins alone are a show; foundations alone, and people drop out. One or two a week, for four weeks.', focus: ['mix', 'calendar'] },
    ]),
    sc('s2', ST, 2, { nl: 'Eerst kijken', en: 'Look first' }, [
      { nl: 'De eerste twee weken op de vloer, niet in de vergaderzaal. Vraag voordat je voorstelt.', en: 'The first two weeks on the floor, not in the meeting room. Ask before you suggest.', focus: ['floor', 'jij', 'calendar'] },
      { nl: '{n:40} meter lopen voor gereedschap, drie mensen bellen voor één antwoord: noteer tijden en aantallen.', en: '{n:40} metres for a tool, three calls for one answer: write down times and counts.', focus: 'seen' },
      { nl: 'Vertrouwen: schrijf elke toezegging op en kom binnen een week terug, ook met nee.', en: 'Trust: write down every promise and come back within the week, even with a no.', focus: 'promise' },
      { nl: 'Weerstand in week {n:1} tot {n:4}: “Dat hebben we in 2019 ook geprobeerd.” Klopt. Wat ging er toen mis?', en: 'Resistance in weeks {n:1} to {n:4}: “We tried this in 2019.” You’re right. What went wrong then?', focus: 'resist' },
      { nl: 'Week {n:4}: weten we het startgetal al? Anders jaag je alleen quick wins na.', en: 'Week {n:4}: do we know the starting number yet? Otherwise you only chase quick wins.', focus: ['start', 'calendar'] },
    ]),
    sc('s3', ST, 2, { nl: 'Week 1 bij de pompen', en: 'Week 1 at the pumps' }, [
      { nl: 'Pompenassemblage, week {n:1}: in de middagdienst ontbreekt de momentsleutel. Zo’n {n:20} minuten per dienst.', en: 'Pump assembly, week {n:1}: second shift has no torque wrench. About {n:20} minutes a shift.', focus: 'pump' },
      { nl: 'Via de teamleider ligt er woensdag een tweede sleutel, van {n:400} euro.', en: 'Through the team lead, a second wrench arrives Wednesday, for {n:400} euros.', focus: ['wrench', 'teamlead'] },
      { nl: 'Een stoplog van twee weken als nulmeting; dinsdag om negen uur de wekelijkse check.', en: 'A two-week stop log as the baseline; Tuesday at nine the weekly check.', focus: ['stoplog', 'calendar'] },
      { nl: 'In week {n:3} komen operators zelf met problemen: het vertrouwen is er.', en: 'By week {n:3} operators bring problems unasked: the trust is there.', focus: ['trust', 'calendar'] },
    ]),
    sc('s4', RH, 1, { nl: 'Drie overleggen', en: 'Three meetings' }, [
      { nl: 'Een vast {t:Overlegritme|overlegritme}: vaste dag, vaste tijd, vaste agenda.', en: 'A fixed {t:Rhythm|rhythm}: fixed day, fixed time, fixed agenda.', cue: { Overlegritme: 'rhythm' }, focus: 'rhythm' },
      { nl: 'De {t:Stand-up|stand-up}: een kwartier staand bij het bord, twee of drie keer per week.', en: 'The {t:Stand-up|stand-up}: fifteen minutes standing at the board, two or three times a week.', cue: { 'Stand-up': 'standup' }, focus: ['standup', 'board'] },
      { nl: 'Het weekoverleg: {n:45} tot {n:60} minuten met het team, of {n:30} met de proceseigenaar.', en: 'The weekly: {n:45} to {n:60} minutes with the team, or {n:30} with the process owner.', focus: 'weekly' },
      { nl: 'De {t:Stuurgroep|stuurgroep} om de vier tot zes weken: de {t:Sponsor|sponsor} en een paar afdelingshoofden.', en: 'The {t:Steering group|steering group} every four to six weeks: the {t:Sponsor|sponsor} and a few department heads.', cue: { Stuurgroep: 'steer', Sponsor: 'sponsor' }, focus: ['steer', 'sponsor', 'calendar'] },
      { nl: 'Zo zie je problemen in week drie, niet in maand vier.', en: 'So you see problems in week three, not month four.', focus: 'early' },
    ]),
    sc('s5', RH, 1, { nl: 'Een week bij de frisdrank', en: 'A week at the beverage plant' }, [
      { nl: 'Minder stilstand bij een frisdrankfabriek. Stand-up maandag en donderdag om half negen, vijf mensen.', en: 'Less downtime at a beverage plant. Stand-up Monday and Thursday at half past eight, five people.', focus: ['week', 'board'] },
      { nl: 'Weekoverleg dinsdag om één uur, {n:45} minuten: {n:10} acties, {n:15} voortgang, {n:15} besluiten, {n:5} vooruit.', en: 'Weekly on Tuesday at one, {n:45} minutes: {n:10} actions, {n:15} progress, {n:15} decisions, {n:5} ahead.', focus: 'wagenda' },
      { nl: 'De stuurgroep elke vijf weken, {n:60} minuten, met drie besluitpunten.', en: 'The steering group every five weeks, {n:60} minutes, with three decision items.', focus: ['steer5', 'calendar'] },
    ]),
    sc('s6', RH, 1, { nl: 'Van agenda tot notulen', en: 'From agenda to minutes' }, [
      { nl: 'Label elk agendapunt: besluiten, bespreken of informeren.', en: 'Label each agenda item: to decide, to discuss or to inform.', focus: 'labels' },
      { nl: 'Een besluitpunt als vraag: breiden we de pilot vanaf week {n:12} uit naar regio Noord?', en: 'A decision item as a question: do we extend the pilot to region North from week {n:12}?', focus: 'question' },
      { nl: 'Twee dagen vooraf een {t:Besluitnotitie|besluitnotitie}: vraag, opties, advies, uiterste datum.', en: 'Two days before, a {t:Decision note|decision note}: question, options, recommendation, deadline.', cue: { Besluitnotitie: 'note' }, focus: 'note' },
      { nl: '{t:Notulen|Notulen}: alleen besluiten en acties, wie wat voor wanneer. Dezelfde dag.', en: '{t:Minutes|Minutes}: only decisions and actions, who does what by when. The same day.', cue: { Notulen: 'minutes' }, focus: ['minutes', 'sheet'] },
      { nl: 'Na de eerste stuurgroep: een half A4, drie besluiten, vier acties, om vier uur verstuurd.', en: 'After the first steering group: half a page, three decisions, four actions, sent at four.', focus: ['half', 'sheet'] },
      { nl: 'Begin met de acties: welke acties van vorige week zijn af?', en: 'Start with the actions: which of last week’s actions are done?', focus: 'done' },
    ]),
    sc('s7', RH, 1, { nl: 'De mensenkant', en: 'The people side' }, [
      { nl: 'Elk overleg kost de klant uren: kort, op tijd beginnen, eerder stoppen, afzeggen als er niets te besluiten is.', en: 'Every meeting costs the client hours: short, start on time, end early, cancel if nothing needs deciding.', focus: 'drown' },
      { nl: 'Zegt de sponsor steeds af? Een signaal, geen pech. Vraag hoe hij dan wil beslissen.', en: 'The sponsor keeps cancelling? A signal, not bad luck. Ask how he would rather decide.', focus: ['cancel', 'sponsor', 'calendar'] },
      { nl: 'Mis: twaalf luisteraars in het weekoverleg, een diavoorstelling in de stuurgroep.', en: 'Wrong: twelve listeners at the weekly, a slideshow at the steering group.', focus: 'wrong' },
      { nl: 'Dagelijks of twee keer per week? Loopt de stand-up uit, of noemt niemand een blokkade: verander de vorm.', en: 'Daily or twice a week? If the stand-up runs over, or nobody names a blocker: change the format.', focus: 'freq' },
    ]),
    sc('s8', PF, 2, { nl: 'Een ritme dat blijft', en: 'A rhythm that lasts' }, [
      { nl: 'Een {t:Overlegstructuur|overlegstructuur}: team, afdeling, management, met dezelfde definities.', en: 'A {t:Review cascade|review cascade}: team, department, management, with the same definitions.', cue: { Overlegstructuur: 'cascade' }, focus: 'cascade' },
      { nl: '{t:Escaleren|Escaleren}: een niveau omhoog, met een datum waarop het besluit terugkomt.', en: '{t:Escalation|Escalation}: one level up, with a date by which the decision comes back.', cue: { Escaleren: 'escal' }, focus: ['escal', 'cascade'] },
      { nl: 'Dagelijks voor storingen, maandelijks voor trage cijfers: zo vaak als het echt verandert.', en: 'Daily for breakdowns, monthly for slow numbers: as often as it really changes.', focus: 'pace' },
      { nl: 'Een {t:Vaste agenda|vaste agenda}: acties, cijfers tegen het doel, problemen, nieuwe acties.', en: 'A {t:Fixed agenda|fixed agenda}: actions, numbers against target, problems, new actions.', cue: { 'Vaste agenda': 'agenda' }, focus: 'agenda' },
      { nl: 'Eén zichtbare {t:Actielijst|actielijst}. Kijkt niemand ernaar, dan sterft het ritme.', en: 'One visible {t:Action list|action list}. If nobody looks at it, the rhythm dies.', cue: { Actielijst: 'actions' }, focus: ['actions', 'sheet'] },
    ]),
    sc('s9', PF, 2, { nl: 'Overdragen', en: 'Handing over' }, [
      { nl: 'Ontwerp voor je vertrek: de lijn zit voor, jij coacht. De {t:Overdracht|overdracht} is het resultaat.', en: 'Design for your exit: the line chairs, you coach. The {t:Handover|handover} is the deliverable.', cue: { Overdracht: 'handover' }, focus: ['handover', 'jij'] },
      { nl: 'Onderdelenfabrikant: jij zit acht weken het KPI-overleg voor. Nog vier weken.', en: 'Parts manufacturer: you have chaired the KPI review for eight weeks. Four weeks to go.', focus: 'case2' },
      { nl: 'Week {n:1} naast hem, week {n:2} alleen erbij, week {n:3} en {n:4} weg.', en: 'Week {n:1} beside him, week {n:2} only attending, weeks {n:3} and {n:4} away.', focus: ['steps', 'calendar'] },
      { nl: 'Data zonder jou, één pagina beschrijving, een check na vier en twaalf weken.', en: 'Data without you, a one-page description, a check after four and twelve weeks.', focus: ['data', 'planner'] },
      { nl: 'Vervallen overleggen, een actie die doorschuift. Een kwartier per dag met acht: {n:10} manuren.', en: 'Cancelled meetings, an action carried over. Fifteen minutes a day with eight: {n:10} person-hours.', focus: ['fail', 'cost'] },
      { nl: 'Als ik volgende week niet kom, gaat dit overleg dan door?', en: 'If I don’t show up next week, will this meeting happen?', focus: 'ask' },
    ]),
  ],
  skip: [
    { lesson: ST, term: 'Stuurgroep', reason: 'Same term as Stuurgroep of pm.run.rhythm, which scene 4 names with its cue (the steering group card and its weeks on the calendar strip); scene 4 also says the monthly steering group where the sponsor checks progress and decides, as this lesson defines it. The build resolves a shared term name to the first served lesson.' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; it carries every point of the
// checklist above. No symbols the voice would read aloud: times and numbers
// that the lessons write as words stay words, no quotes or parentheses.
// Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12) and Whisper small on the voice: stand-up is read
// stˈɑndˈʌp (Whisper hears "stand-up"), quick win kvˈɪk ʋˈɪn, kick-off
// kˈɪkˈɔf, check tʃˈɛk, team tˈiːm, Scrum skrˈɵm: left as read. Scope and agile
// are said, as the cards show them: the shared SAY rules (pm.plan.wbs, pm.plan.method)
// make them skoop and etsjail. Kept out of the Dutch narration because espeak-ng
// misreads them (they stay on the cards): update (ɵpdˈaːtə), whiteboard, spreadsheet, statusslide, fulltime and parttime (said voltijds,
// deeltijds), momentsleutel (stressed on -TEL: said by its meaning), deadline,
// and manager (said leidinggevende, hoofd productie), enthousiasteling (with a
// zh: said een enthousiaste collega), management (mˈaːnɪdʒmənt: said de leiding),
// manuren (stressed maːnˈyrən: said samen tien uur) and a capital Eén at the
// start of a sentence (read ˈeːeːn: reworded). No new SAY rule: stuurgroep, pilot and
// nulmeting already have one (films/_kit/timeline.mjs, pm.plan.schedule).
const SAY = [
  [ // s1 the first weeks
    { nl: 'Het project start met de {t:Kick-off|kick-off}: doel, scope, rollen, eerste stappen. Een uur; de sponsor zegt in eigen woorden waarom het telt.',
      en: 'The project starts with the {t:Kick-off|kick-off}: goal, scope, roles, first steps. An hour, and the sponsor says in his own words why it matters.' },
    { nl: 'Dan tegelijk {t:Quick win|quick wins}, kleine zichtbare verbeteringen van de mensen zelf, en het {t:Fundament|fundament}: nulmeting, rollen, ritme.',
      en: 'Then, in parallel, {t:Quick win|quick wins}, small visible fixes from the people themselves, and {t:Foundations|foundations}: baseline, roles, rhythm.' },
    { nl: 'Alleen quick wins is een show; alleen fundament, en mensen haken af. Grofweg één of twee per week, vier weken lang.',
      en: 'Quick wins alone are a show; foundations alone, and people drop out. Roughly one or two a week, for four weeks.' },
  ],
  [ // s2 look first
    { nl: 'De eerste twee weken zit je op de vloer. Vraag voordat je voorstelt; sta bij een omstelling, rij mee met monteurs.',
      en: 'The first two weeks, be on the floor. Ask before you suggest; stand at a changeover, ride along with a crew.' },
    { nl: 'Wat je daar ziet, zoals {n:40} meter lopen voor gereedschap, verslaat elk rapport. Noteer tijden en aantallen.',
      en: 'What you see there, like {n:40} metres walked for a tool, beats any report. Note times and counts.' },
    { nl: 'Vertrouwen: noteer elke toezegging, en kom binnen een week terug, ook met nee.',
      en: 'Trust: write down every promise, and come back within the week, even with a no.' },
    { nl: 'Dit hebben we in 2019 al geprobeerd? Vaak waar. Vraag wat er toen misging; dat moet je vermijden.',
      en: 'We tried this in 2019? Often true. Ask what went wrong then; that is what to avoid.' },
    { nl: 'Vraag in week {n:4}: weten we het startgetal al? Anders blijft de nulmeting liggen.',
      en: 'Ask in week {n:4}: do we know the starting number yet? Or the baseline waits.' },
  ],
  [ // s3 week 1 at the pumps
    { nl: 'Week {n:1} bij een pompenassemblage. In de middagdienst ontbreekt een sleutel die bouten precies aandraait: zo\'n {n:20} minuten per dienst.',
      en: 'Week {n:1} at a pump assembly plant. Second shift lacks a wrench that tightens bolts exactly: about {n:20} minutes a shift.' },
    { nl: 'Via de teamleider ligt er woensdag een tweede, van {n:400} euro.',
      en: 'Through the team lead, a second one arrives Wednesday, for {n:400} euros.' },
    { nl: 'Intussen een stoplog van twee weken als nulmeting, en elke dinsdag om negen een check met het hoofd productie.',
      en: 'Meanwhile a two-week stop log as the baseline, and every Tuesday at nine a check with the production manager.' },
    { nl: 'In week {n:3} komen operators zelf met problemen: het vertrouwen is er.',
      en: 'By week {n:3} operators bring problems unasked: the trust is there.' },
  ],
  [ // s4 three meetings
    { nl: 'Zet het {t:Overlegritme|overlegritme} vroeg neer: vaste dag, tijd en agenda. Voortgang op het doel, wat zit vast, welke besluiten nodig zijn.',
      en: 'Set the {t:Rhythm|rhythm} early: fixed day, time and agenda. Progress against the goal, what is blocked, which decisions are needed.' },
    { nl: 'Drie overleggen. De {t:Stand-up|stand-up}: een kwartier staand bij het bord, twee of drie keer per week. Wat is af, wat komt, wat houdt je tegen?',
      en: 'Three meetings. The {t:Stand-up|stand-up}: fifteen minutes standing at the board, two or three times a week. Done, next, what blocks you?' },
    { nl: 'Het weekoverleg: {n:45} tot {n:60} minuten met het team, of {n:30} met de proceseigenaar.',
      en: 'The weekly: {n:45} to {n:60} minutes with the team, or {n:30} with the process owner.' },
    { nl: 'De {t:Stuurgroep|stuurgroep}, om de vier tot zes weken, {n:60} tot {n:90} minuten. Daar besluiten de {t:Sponsor|sponsor}, eigenaar van doel en budget, en een paar afdelingshoofden.',
      en: 'The {t:Steering group|steering group}, every four to six weeks, {n:60} to {n:90} minutes, where the {t:Sponsor|sponsor}, who owns goal and budget, and a few department heads decide.' },
    { nl: 'Zo zie je problemen in week drie, niet in maand vier.',
      en: 'So you see problems in week three, not month four.' },
  ],
  [ // s5 a week at the beverage plant
    { nl: 'Een frisdrankfabriek wil minder stilstand: uren dat een lijn stilstaat terwijl hij zou moeten draaien. Stand-up maandag en donderdag om half negen, bij het bord: een kwartier, vijf mensen.',
      en: 'A beverage plant wants less downtime: hours a line stands still when it should run. Stand-up Monday and Thursday at half past eight, at the board: fifteen minutes, five people.' },
    { nl: 'Weekoverleg op dinsdag om één uur, {n:45} minuten: {n:10} acties, {n:15} voortgang, {n:15} besluiten, {n:5} vooruitkijken.',
      en: 'Weekly on Tuesday at one, {n:45} minutes: {n:10} actions, {n:15} progress, {n:15} decisions, {n:5} looking ahead.' },
    { nl: 'De stuurgroep: elke vijf weken een uur, met drie besluitpunten.',
      en: 'The steering group: every five weeks, an hour, three decision items.' },
  ],
  [ // s6 from agenda to minutes
    { nl: 'Een agenda eindigt in besluiten: label elk punt als besluiten, bespreken of informeren.',
      en: 'An agenda ends in decisions: label each item decide, discuss or inform.' },
    { nl: 'Een besluitpunt is een vraag: breiden we de pilot vanaf week {n:12} uit naar regio Noord?',
      en: 'A decision item is a question: do we extend the pilot to region North from week {n:12}?' },
    { nl: 'Twee dagen vooraf gaat een {t:Besluitnotitie|besluitnotitie} mee: één A4 met vraag, opties, advies en uiterste datum. Informatie gaat op papier, niet in het overleg.',
      en: 'Two days before, a {t:Decision note|decision note} goes out: one page with question, options, recommendation, deadline. Information goes in writing, not the meeting.' },
    { nl: 'De {t:Notulen|notulen}, het schriftelijke verslag: alleen besluiten en acties, wie wat voor wanneer, dezelfde dag verstuurd.',
      en: 'The {t:Minutes|minutes}, the written record: only decisions and actions, who does what by when, sent the same day.' },
    { nl: 'Bij de frisdrankfabriek: na de stuurgroep een half A4, drie besluiten, vier acties, om vier uur verstuurd.',
      en: 'At the beverage plant: after the steering group, half a page, three decisions, four actions, sent at four.' },
    { nl: 'Begin elk overleg met: welke acties van vorige week zijn af? Uitlopende acties zeggen meer dan elk statusoverzicht.',
      en: 'Start every meeting with: which of last week\'s actions are done? Slipping actions say more than any status slide.' },
  ],
  [ // s7 the people side
    { nl: 'Elk overleg kost de klant uren. Kort, op tijd beginnen, eerder stoppen, en afzeggen als er niets te besluiten is.',
      en: 'Every meeting costs the client hours. Keep it short, start on time, end early, cancel when there is nothing to decide.' },
    { nl: 'Zegt de sponsor steeds af? Een signaal, geen pech. Vraag of hij liever op een andere manier beslist.',
      en: 'The sponsor keeps cancelling? A signal, not bad luck. Ask whether he would rather decide another way.' },
    { nl: 'Mis gaat het met twaalf luisteraars in het weekoverleg, en een diavoorstelling in de stuurgroep.',
      en: 'It goes wrong with twelve listeners at the weekly, and a slideshow at the steering group.' },
    { nl: 'Hoe vaak? Experts verschillen: voltijdse agile teams dagelijks, deeltijdse klantteams twee keer per week. Loopt de stand-up uit, of noemt niemand een blokkade? Verander de vorm.',
      en: 'How often? Experts disagree: full-time agile teams daily, part-time client teams twice a week. Stand-up running over, nobody naming a blocker? Change the format.' },
  ],
  [ // s8 a rhythm that lasts
    { nl: 'Een {t:Overlegstructuur|overlegstructuur}: korte overleggen die elkaar voeden, van team via afdeling naar de leiding, met dezelfde definities.',
      en: 'A {t:Review cascade|review cascade}: short meetings feeding each other, from team through department to management, with the same definitions.' },
    { nl: '{t:Escaleren|Escaleren} verbindt ze: een probleem gaat een niveau omhoog, met een datum waarop het besluit terugkomt.',
      en: '{t:Escalation|Escalation} links them: a problem goes up one level, with a date by which the decision comes back.' },
    { nl: 'Kijk naar een cijfer zo vaak als het echt verandert en iemand kan handelen: storingen dagelijks, kosten maandelijks. Anders is het ruis.',
      en: 'Look at a number as often as it really changes and someone can act: breakdowns daily, costs monthly. Else it is noise.' },
    { nl: 'Een {t:Vaste agenda|vaste agenda}: acties, cijfers tegen het doel, een of twee problemen, nieuwe acties. Zelfde tijd, zelfde plek.',
      en: 'A {t:Fixed agenda|fixed agenda}: actions, numbers against target, one or two problems, new actions. Same time, same place.' },
    { nl: 'En één zichtbare {t:Actielijst|actielijst}. Kijkt niemand ernaar, dan gaat het ritme dood.',
      en: 'And one visible {t:Action list|action list}. If nobody looks at it, the rhythm dies.' },
  ],
  [ // s9 handing over
    { nl: 'Ontwerp vanaf dag één voor je vertrek: de lijn zit voor, jij coacht en stapt terug. Die {t:Overdracht|overdracht} is het echte resultaat.',
      en: 'Design for your exit from day one: the line chairs, you coach and step back. That {t:Handover|handover} is the real deliverable.' },
    { nl: 'Een onderdelenfabrikant: jij zit al acht weken het KPI-overleg voor. Over vier weken stop je.',
      en: 'A parts manufacturer: you have chaired the KPI review for eight weeks. In four weeks you leave.' },
    { nl: 'Week {n:1} zit het hoofd productie voor, jij ernaast. Week {n:2} ben je er alleen bij. Week {n:3} en {n:4} blijf je weg.',
      en: 'Week {n:1} the production manager chairs, you beside him. Week {n:2} you only attend. Weeks {n:3} and {n:4} you stay away.' },
    { nl: 'De data ververst zonder jou. Op één pagina staat wie, wanneer, welke cijfers en hoe problemen omhoog gaan. Plan een check na vier en twaalf weken.',
      en: 'The data refreshes without you. One page says who, when, which numbers, how problems go up. Plan checks after four and twelve weeks.' },
    { nl: 'Pas op voor overleggen die één keertje vervallen, acties die doorschuiven, en een bord van één persoon. Een kwartier per dag met acht mensen kost samen {n:10} uur per week, en moet dus meer opleveren.',
      en: 'Watch for meetings cancelled just this once, actions carried over, and a one-person board. Fifteen minutes a day with eight people costs {n:10} person-hours a week, so it must deliver more.' },
    { nl: 'Vraag de eigenaar: als ik volgende week niet kom, gaat dit overleg dan door?',
      en: 'Ask the owner: if I don\'t show up next week, will this meeting happen?' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(update\w*|whiteboard|spreadsheet|statusslide|fulltime|parttime|momentsleutel|deadline|\w*manager\w*|management|manuren|enthousiasteling)\b|(^|[.?!;]\s)Eén\b|\bIT\b(?!-)/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%€]|:\S/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(plain)) throw new Error(`narration: "${MISREAD.exec(plain)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
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
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-grid{fill:none;stroke:var(--anatomy-shade-3);stroke-width:1}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-dot{fill:var(--anatomy-mid)}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia,[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-big,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-grid,.pm-mini .pm-dash,.pm-mini .pm-dia,.pm-mini .pm-strike{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken, waarop de kick-off, de eerste quick wins, de stoplog, de stuurgroep om de vijf weken en de vier weken van de overdracht verschijnen. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel een vel dat zich vult als notulen en als actielijst. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: de kick-off, quick wins en fundament; de eerste weken op de vloer, toezeggingen, weerstand en het startgetal; week 1 bij een pompenassemblage; de stand-up, het weekoverleg en de stuurgroep; de week van een frisdrankfabriek met de agenda van het weekoverleg; agendalabels, een besluitpunt als vraag, de besluitnotitie en de notulen; de mensenkant; de overlegstructuur in drie lagen, de vaste agenda en de actielijst; en de overdracht in vier weken, met de kosten van een overleg en de scherpe vraag aan de eigenaar.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks, where the kick-off, the first quick wins, the stop log, the steering group every five weeks and the four handover weeks appear. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table a sheet that fills as minutes and as the action list. At the right a panel with one card per scene, marked as example or diagram: the kick-off, quick wins and foundations; the first weeks on the floor, promises, resistance and the starting number; week 1 at a pump assembly plant; the stand-up, the weekly meeting and the steering group; a beverage plant\'s week with the weekly agenda; agenda labels, a decision item as a question, the decision note and the minutes; the people side; the review cascade in three tiers, the fixed agenda and the action list; and the handover over four weeks, with the cost of a meeting and the sharp question for the owner.',
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

// Dev tool, not shipped. Builds the explainer film "Het eerste gesprek / The
// first conversation" for Projecten: pm.intake.ask (level 1) and
// pm.intake.firsttalk (level 2) of the topic Van vraag naar probleem, and
// pm.lead.listen (level 1 of Luisteren en coachen).
//
//   node films/pm.intake.firsttalk/build.mjs            build the page
//   node films/pm.intake.firsttalk/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.intake.firsttalk.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.intake.firsttalk: the hour on a clock, talk time, the correction that
// reveals the real problem, MORE PIES). Storyboard drift: the plan's five
// scenes are nine here, because the film now carries the whole text of three
// lessons: the dashboard request (s1) gets the questions and OEE (s2) and the
// people side (s3) of pm.intake.ask; quiet resistance shares the last scene of
// the first talk with the summary (s7); pm.lead.listen gets its own worked
// example (s8) and its questions, silence and experience (s9).
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of the three lessons' teach text and worked examples, in the
// voice or, where the narration's 760 words run out, on a card (marked "card").
// Checklist (lesson point: scene and beat):
//   ask teach 1: clients bring a solution (a dashboard, a screen of figures) or
//     a symptom, rarely a problem (s1 b1; "orders te laat" on the card, b1);
//     three layers: symptom what they see, problem the cause a project can
//     change, goal measurably different (s1 b2); a project on the symptom fixes
//     nothing (s1 b4), on their solution maybe the wrong thing (card, s1 b4)
//   ask teach 2: how do you notice it, since when, what was tried (s2 b1); one
//     recent case shows the mechanism, the general picture their opinion (s2 b1;
//     Tuesday's late order on the card); cost per week, after a year: the cost
//     of inaction says whether a project is worth it (s2 b2)
//   ask teach 3: a target on a KPI (s2 b3; "KPI: a steering number" on the card,
//     b4); OEE defined (s2 b3); 58 to 75% still a wish; 85% "world class" a
//     convention (s2 b4); not a norm, many plants about 60% (card, s2 b4); where
//     the 42 points go: breakdowns, changeovers, slow running, scrap (s2 b4)
//   ask teach 4: the asker's name is tied to the solution; don't attack it; "it
//     could help, but can I first see where the delay comes from?" (s3 b1);
//     "analysed already?": show me; if they can't, you learn something (s3 b2)
//   ask teach 5: experts differ on how hard to push (s3 b3; never take it over
//     or half diagnosed already, on the card); the fair middle, a hypothesis
//     checked with data in a week or two (s3 b3); naive questions, their words
//     literally (s3 b4); say you don't know the process, for the goal sentence
//     (card, s3 b4)
//   ask example: a team lead at a grid operator asks for a better dashboard for
//     the work orders (s1 b1); what for: seeing stuck jobs; 140 of 600 orders
//     over 4 weeks, 90 on material (s1 b3; permits and material in the
//     caption); problem materials not linked to the planning, goal no order
//     over 4 weeks on material, the dashboard a small part (s1 b4)
//   firsttalk teach 1: an hour in four parts, open 5, explore 35, check 10,
//     close 10 (s4 b1, the clock); say the structure, "mostly listen, end with a
//     next step", it gives calm (s4 b2); explore their story, check summarise
//     and what's missing, close a step with a date (s4 b3; the clock legend)
//   firsttalk teach 2: MORE PIES letter by letter: mood, open questions ("how
//     does a normal Monday go"), reflecting ("that sounds frustrating"), empathy
//     (s5 b2); paraphrasing the core in your own words, inquiry, experience
//     briefly for trust, three seconds of silence (s5 b3)
//   firsttalk teach 3: 70 to 80% client talk time; two minutes talking: ask a
//     question (s6 b1); people correct a wrong summary far more easily than
//     they tell it all; the real point is in the correction (s6 b3); juniors
//     fill silences from nerves, the key sentence comes just after (s6 b4)
//   firsttalk teach 4: quiet resistance: short answers, "it's in the report",
//     name it lightly, "how did that go last time?" (s7 b1; the phone on the
//     table on the card); a previous consultant's deck, nothing changed, let
//     them tell it (s7 b2; "don't repeat that" on the card); a notebook feels
//     less like an interrogation (s7 b2; "notebook or laptop?" on the card)
//   firsttalk teach 5: leave with five things: problem in their words, three
//     names, data, success for the sponsor, a date; on one page within 24
//     hours, unknowns as open questions, not assumptions (s7 b3, the page);
//     the sharp closing question, word for word (s7 b5)
//   firsttalk example: an hour with the production manager of a dairy plant
//     (s4 b1); 0-5 your aim, 40-50 summarise, 50-60 the next step (the clock
//     legend, s4 b2-b3); 6 changeovers a day of 50 minutes, the paraphrase
//     "five hours ... the extra volume" (s6 b2); "no, cleaning is the bigger
//     problem" (s6 b3), gold (card, s6 b3); Thursday on the line with two
//     shift leads, the summary that evening (s7 b4)
//   listen teach 1: active listening, to understand, not to reply; MORE PIES
//     from crisis negotiation (s5 b1); Rogers and Farson 1957, Scott Walker
//     2023 (the card, s5 b1); mood, open questions with what and how, reflect
//     the feeling, empathy why it matters (s5 b2, the card's glosses)
//   listen teach 2: paraphrase, inquiry one level deeper, experience only when
//     it helps, silence (s5 b3); under pressure you defend; the rule: reflect
//     or paraphrase first, then ask, then answer; an attack hides a worry:
//     workload, blame, control (s8 b2)
//   listen teach 3: three seconds, five under pressure; teachers waited about
//     one second, at three answers got longer and better (s9 b1; Rowe, the
//     1970s on the card); the real answer after the first (caption, s9 b1);
//     calm in silence reads as confidence, helps the youngest (s9 b1)
//   listen teach 4: questions that open: what am I missing, what must be true
//     (s9 b2); no "why" when heated, it sounds like blame; "what made you"
//     (s9 b2); the fake question "don't you think": you learn nothing (s9 b3)
//   listen teach 5: experience as a bridge: one sentence, then back; check
//     yourself: what did I learn? nothing: you talked too much (s9 b4);
//     versions: M minimal encouragers, S summarising (s5 b4)
//   listen example: the senior work preparer in a team meeting: "three years
//     ago, only more forms" (s8 b1); mood tense, reflect "more work", wait five
//     seconds (s8 b3); open question "what happened then", paraphrase "not
//     asked, forms from head office" (s8 b4); empathy and Thursday's check
//     (s8 b5; the steps on the card)
//
// The drawing is the shared pm world (films/_pm/world.mjs): a meeting room with
// a whiteboard and a clock on the back wall, a wall calendar on the side wall,
// a meeting table with the A4 of the summary, a notebook and cups, and the
// recurring cast: "jij" the consultant in petrol, the sponsor (the client's
// manager: the production manager of the dairy), the team lead (who asks for
// the dashboard) and the planner (the senior work preparer of s8). Speech
// bubbles hang over the speakers. A panel at the right, in stage space, carries
// the cards, each labelled "voorbeeld" or "schema": the three layers, the OEE
// bar, the hour as a clock, MORE PIES letter by letter, talk time and the
// correction, the summary on one page, the steps under pressure and the wait
// time. The whiteboard copies the panel's shapes in miniature.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf } from '../_kit/timeline.mjs';
import { pmWorld, CAST, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The facts the film shows, asserted against the lessons' current text (the
// build fails if one drifts); {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm. Facts as in the lessons: active listening
// (Rogers and Farson, Active Listening, 1957), MORE PIES (Scott Walker, Order
// Out of Chaos, 2023), wait time (Mary Budd Rowe, 1972-1974), OEE (Nakajima;
// 85 % "world class" is a convention, not a norm).
const ASK = 'pm.intake.ask';
const FT = 'pm.intake.firsttalk';
const LI = 'pm.lead.listen';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const has = (id, field, list, lang = 'nl') => {
  const l = lessons[lang].get(id);
  const t = field === 'teach' ? l.teach.join('\n') : l.example.text;
  for (const s of list) assert(t.includes(s), `${id} ${lang} ${field} no longer says "${s}"`);
};
has(ASK, 'teach', ['Ze komen met een oplossing', 'een scherm vol cijfers', 'Het symptoom is wat ze zien', 'waar een project echt iets aan kan doen', 'meetbaar anders',
  '“Waaraan merk je het?”, “Sinds wanneer?”, “Wat hebben jullie al geprobeerd?”', 'kosten van niksdoen', 'late order van vorige week dinsdag',
  '85% heet vaak “wereldklasse”, een vakafspraak, geen norm', 'rond de 60%', '“Van 58 naar 75%”', '42 procentpunten', 'storingen, omstellen', 'langzaam draaien of afkeur',
  'zijn naam verbonden aan die oplossing', 'mag ik eerst zien waar de vertraging vandaan komt?', '“dat hebben we al geanalyseerd”', 'Kunnen ze het niet laten zien, dan weet je ook iets.',
  'half gediagnosticeerd', 'hypothese', 'in een week of twee met data checkt', 'naïeve vragen', 'letterlijk op', 'doelzin']);
has(ASK, 'example', ['een beter dashboard voor de werkorders', '“Zien welke klussen vastlopen.”', '“Op vergunningen en materiaal.”', '140 van de 600 openstaande orders wachten al langer dan 4 weken, 90 daarvan op materiaal',
  'materiaalreserveringen zijn niet gekoppeld aan de planning', 'geen order wacht langer dan 4 weken op materiaal', 'Het dashboard wordt een klein onderdeel, niet het project.']);
has(FT, 'teach', ['Openen (5 minuten)', 'Verkennen (35)', 'Checken (10)', 'Afsluiten (10)', 'Ik wil vandaag vooral luisteren en eindigen met een concrete volgende stap. Is dat goed?', 'Dat geeft rust.',
  '“Hoe gaat een gewone maandag?”', '“Dat klinkt frustrerend.”', 'wacht drie tellen na een antwoord', 'alleen voor vertrouwen',
  'veel makkelijker dan dat ze uit zichzelf het hele verhaal vertellen', 'In die correctie zit het echte punt.', '70 tot 80% spreektijd', 'twee minuten achter elkaar', 'net na de stilte',
  'korte antwoorden, “het staat allemaal in het rapport”, een telefoon met het scherm naar boven', 'Hoe ging dat toen?', 'slidedeck', 'papieren notitieboek voelt minder als een verhoor',
  'drie namen van mensen om te spreken', 'binnen 24 uur een intakesamenvatting: één A4', 'als open vraag, niet als aanname', '“Wanneer zeg jij over een half jaar: dit was het waard?”']);
has(FT, 'example', ['zuivelfabriek', '6 omstellingen per dag', 'van 50 minuten', 'vijf uur per dag naar omstellen', 'extra volume', '“Nee, het reinigen is het grotere probleem.”', 'goud waard',
  'donderdag de lijn op te gaan en twee ploegleiders te spreken', 'dezelfde avond']);
has(LI, 'teach', ['Carl Rogers en Richard Farson (1957)', 'luisteren om te begrijpen, niet om te antwoorden', 'crisisonderhandeling', 'Scott Walker', 'Order Out of Chaos (2023)',
  'eerst reflecteren of parafraseren, dan vragen, dan pas antwoorden', 'werkdruk, schuld, controle kwijtraken', 'tel onder druk tot vijf', 'Mary Budd Rowe', 'zo’n één seconde', 'drie seconden of langer',
  'komt over als zelfvertrouwen', '“Waar maak je je het meeste zorgen over?”', '“Wat mis ik?”', 'Vermijd “waarom”', '“wat maakte dat je…”', 'nepvraag',
  'één zin, en geef het terug', 'wat heb ik geleerd dat ik nog niet wist?', 'minimal encouragers', 'summarising']);
has(LI, 'example', ['senior werkvoorbereider', 'tekeningen, vergunningen en materiaal', 'drie jaar geleden', 'meer formulieren', 'je wacht vijf seconden', 'Waardoor eindigde het in formulieren?',
  'niet gevraagd werden, en de formulieren kwamen van het hoofdkantoor', 'Ik snap dat je sceptisch bent.', 'donderdag samen met mij naar de check kijken?']);
// the numbers the cards draw
const HOUR = [['open', 5], ['explore', 35], ['check', 10], ['close', 10]];
assert(HOUR.reduce((a, [, m]) => a + m, 0) === 60, 'the four parts make an hour');
const OEE = { now: 58, target: 75, world: 85, typical: 60 };
assert(100 - OEE.now === 42, '42 points between 58 and 100');
const CHANGE = { n: 6, min: 50 };
assert(CHANGE.n * CHANGE.min === 5 * 60, '6 changeovers of 50 minutes are five hours');
const TALK = [70, 80];
const ORDERS = { open: 600, late: 140, material: 90, weeks: 4 };
assert(ORDERS.material < ORDERS.late && ORDERS.late < ORDERS.open, '90 of the 140 late orders, of 600');

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

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const CAL = w.calendar({ y0: 40, z0: 128, weeks: 12, cw: 10, ch: 22 });
const TABLE = { x: 96, y: 112, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SUM = w.sheet({ x: 150, y: 152, z: TZ, lines: 7 });
const NOTE = w.sheet({ x: 116, y: 150, z: TZ, w: 15, d: 21, lines: 5 });
// the cast: who stands where (world cm); heads at z 163 for the speech bubbles
const SPOT = {
  planner: { x: 176, y: 78, along: 'x' },
  teamlead: { x: 70, y: 150, along: 'y' },
  sponsor: { x: 272, y: 150, along: 'y' },
  jij: { x: 170, y: 222, along: 'x' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map((v) => Math.round(v * 10) / 10)]));
const SUM_AT = w.at([160, 167, TZ]).map((v) => Math.round(v * 10) / 10);
// the panel's drawing area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 50, w: 300, h: 320 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="ft-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
// the summary on the table fills in with the panel's sheet lines, in miniature
const sumMini = `<g transform="${SUM.face}">${g('sMini', '')}</g>`;

const person = (role) => w.person({ ...SPOT[role], role });
const world = [
  w.room(ROOM),
  w.clock(266, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  CAL.svg,
  person('planner'),
  w.chair({ x: 128, y: 98, back: -1 }),
  w.chair({ x: 224, y: 98, back: -1 }),
  person('teamlead'),
  w.table(TABLE),
  w.stack({ x: 104, y: 120, z: TZ, n: 3 }),
  NOTE.svg,
  cueG('summary', SUM.svg + sumMini),
  w.laptop({ x: 214, y: 134, z: TZ, toward: -1 }),
  w.cup(196, 172, TZ),
  w.cup(232, 166, TZ),
  person('sponsor'),
  person('jij'),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Each term's cue is a static group here (the player lights the groups it
// finds at start); the stage fills their contents per scene.
const PX = 322;
const PW = 308;
const hud = g('panel', `<rect class="ft-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '')
  + cueG('symptom', g('cSym', '')) + cueG('problem', g('cProb', '')) + cueG('goal', g('cGoal', ''))
  + cueG('cost', g('cCost', '')) + cueG('oee', g('cOee', ''))
  + cueG('clock', g('cClock', ''))
  + cueG('active', g('cActive', ''))
  + cueG('pies', g('cPies', '') + cueG('pO', g('cPO', '')) + cueG('pR', g('cPR', '')) + cueG('pP', g('cPP', '')))
  + cueG('talk', g('cTalk', ''))
  + cueG('summary', g('cSum', ''))
  + cueG('openq', g('cOpenq', ''))
  + g('pText', ''));

const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world + g('bubbles', ''))}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const toward = (p, s) => [p[0], p[1] + 40, s];
const CAM = [
  { from: [160, 200, 1], to: [...mid(HEAD.teamlead, HEAD.jij), 1.08].map((v, i) => (i === 1 ? v + 40 : v)) },
  { from: toward(mid(HEAD.teamlead, HEAD.jij), 1.08), to: toward(mid(HEAD.teamlead, HEAD.jij), 1.12) },
  { from: toward(HEAD.teamlead, 1.1), to: toward(mid(HEAD.teamlead, HEAD.jij), 1.04) },
  { from: [160, 200, 1.02], to: toward(mid(HEAD.sponsor, HEAD.jij), 1.08) },
  { from: toward(HEAD.jij, 1.06), to: toward(HEAD.jij, 1.14) },
  { from: toward(mid(HEAD.sponsor, HEAD.jij), 1.08), to: toward(HEAD.sponsor, 1.14) },
  { from: toward(mid(HEAD.sponsor, HEAD.jij), 1.06), to: [SUM_AT[0], SUM_AT[1], 1.24] },
  { from: [160, 200, 1.02], to: toward(HEAD.planner, 1.1) },
  { from: toward(HEAD.planner, 1.1), to: toward(HEAD.jij, 1.06) },
];

// ---------------------------------------------------------------- the film
const C = { PX, PW, PANEL_AREA, HEAD, HOUR, OEE, TALK, ORDERS, CHANGE, CAST: Object.fromEntries(Object.entries(CAST).map(([key, v]) => [key, { nl: v.nl, en: v.en }])) };
const spec = {
  id: 'pm.intake.firsttalk',
  title: { nl: 'Het eerste gesprek', en: 'The first conversation' },
  lessons: [ASK, FT, LI],
  scenes: [
    {
      id: 's1', lesson: ASK, level: 1, still: 0.9, title: { nl: 'Wat ze vragen', en: 'What they ask' },
      beats: [
        { nl: 'De teamleider vraagt om een beter dashboard. Klanten komen met een oplossing of een symptoom.', en: 'The team lead asks for a better dashboard. Clients bring a solution or a symptom.', cues: ['teamlead', 'jij'] },
        { nl: 'Drie lagen: het {t:Symptoom|symptoom}, het {t:Probleem|probleem} eronder en het {t:Doel|doel}.', en: 'Three layers: the {t:Symptom|symptom}, the {t:Problem|problem} underneath and the {t:Goal|goal}.', cue: { Symptoom: 'symptom', Probleem: 'problem', Doel: 'goal' } },
        { nl: 'Klussen lopen vast: {n:140} van de {n:600} orders wachten langer dan {n:4} weken, {n:90} op materiaal.', en: 'Jobs get stuck: {n:140} of {n:600} orders have waited over {n:4} weeks, {n:90} for materials.', cues: ['symptom', 'teamlead'] },
        { nl: 'Probleem: materiaal niet gekoppeld aan de planning. Het dashboard wordt een klein onderdeel.', en: 'Problem: materials not linked to the planning. The dashboard becomes a small part.', cues: ['problem', 'goal'] },
      ],
    },
    {
      id: 's2', lesson: ASK, level: 1, still: 0.9, title: { nl: 'Eronder komen', en: 'Getting underneath' },
      beats: [
        { nl: 'Waaraan merk je het? Sinds wanneer? Wat al geprobeerd? En één recent geval.', en: 'How do you notice it? Since when? What have you tried? And one recent case.', cues: ['jij'] },
        { nl: 'Wat kost het per week? Dat zijn de {t:Kosten van niksdoen|kosten van niksdoen}.', en: 'What does it cost per week? That is the {t:Cost of inaction|cost of inaction}.', cue: { 'Kosten van niksdoen': 'cost' } },
        { nl: 'Een streefcijfer op een KPI, zoals de {t:OEE|OEE}: goede producten op volle snelheid.', en: 'A target on a KPI, like {t:OEE|OEE}: good parts at full speed.', cue: { OEE: 'oee' } },
        { nl: 'Van {n:58} naar {n:75}% is een wens. Waar gaan de {n:42} punten heen?', en: 'From {n:58} to {n:75}% is a wish. Where do the {n:42} points go?', cues: ['oee'] },
      ],
    },
    {
      id: 's3', lesson: ASK, level: 1, still: 0.9, title: { nl: 'De mensenkant', en: 'The people side' },
      beats: [
        { nl: 'Ga niet tegen hun oplossing in: “Mag ik eerst zien waar de vertraging vandaan komt?”', en: 'Don’t attack their solution: “Can I first see where the delays come from?”', cues: ['teamlead', 'jij'] },
        { nl: '“Al geanalyseerd?” Mooi, laat het zien. Kan dat niet, dan weet je ook iets.', en: '“Analysed already?” Great, show me. If they can’t, you’ve learned something too.', cues: ['teamlead'] },
        { nl: 'Hun oplossing is een hypothese, die je in een week of twee met data checkt.', en: 'Their solution is a hypothesis you check with data in a week or two.', cues: ['jij'] },
        { nl: 'Stel naïeve vragen en schrijf hun woorden letterlijk op.', en: 'Ask naive questions and write their words down literally.', cues: ['jij'] },
      ],
    },
    {
      id: 's4', lesson: FT, level: 2, still: 0.9, title: { nl: 'Een uur met vier delen', en: 'An hour in four parts' },
      beats: [
        { nl: 'Een uur bij een zuivelfabriek: openen {n:5} minuten, verkennen {n:35}, checken {n:10}, afsluiten {n:10}.', en: 'An hour at a dairy plant: open {n:5} minutes, explore {n:35}, check {n:10}, close {n:10}.', cues: ['clock', 'sponsor', 'jij'] },
        { nl: 'Benoem de opbouw: “Ik wil vooral luisteren en eindigen met een volgende stap.”', en: 'Say the structure: “I’d like to mostly listen and end with a next step.”', cues: ['clock', 'jij'] },
        { nl: 'Verkennen: hun verhaal. Checken: samenvatten. Afsluiten: een stap met een datum.', en: 'Explore: their story. Check: summarise. Close: a step with a date.', cues: ['clock'] },
      ],
    },
    {
      id: 's5', lesson: LI, level: 1, still: 0.9, title: { nl: 'MORE PIES', en: 'MORE PIES' },
      beats: [
        { nl: '{t:Actief luisteren|Actief luisteren}: om te begrijpen. De checklist: {t:MORE PIES|MORE PIES}.', en: '{t:Active listening|Active listening}: to understand. The checklist: {t:MORE PIES|MORE PIES}.', cue: { 'Actief luisteren': 'active', 'MORE PIES': 'pies' } },
        { nl: 'De sfeer, {t:Open vragen|open vragen}, {t:Reflecteren|reflecteren} en empathie.', en: 'Mood, {t:Open questions|open questions}, {t:Reflecting|reflecting} and empathy.', cue: { 'Open vragen': 'pO', Reflecteren: 'pR' } },
        { nl: '{t:Parafraseren|Parafraseren}, doorvragen, kort je ervaring, en stilte.', en: '{t:Paraphrasing|Paraphrasing}, inquiry, your experience briefly, and silence.', cue: { Parafraseren: 'pP' } },
        { nl: 'Varianten: soms is de M aanmoedigen en de S samenvatten.', en: 'Versions differ: M can be minimal encouragers, S summarising.', cues: ['pies'] },
      ],
    },
    {
      id: 's6', lesson: FT, level: 2, still: 0.9, title: { nl: 'In de correctie', en: 'In the correction' },
      beats: [
        { nl: 'De klant praat {n:70} tot {n:80}% van de tijd. Twee minuten aan het woord? Stel een vraag.', en: 'The client talks {n:70} to {n:80}% of the time. Talked two minutes? Ask a question.', cues: ['talk', 'sponsor'] },
        { nl: '{n:6} omstellingen van {n:50} minuten. Jij: “Dus vijf uur omstellen houdt het volume tegen?”', en: '{n:6} changeovers of {n:50} minutes. You: “So five hours of changeovers block the volume?”', cues: ['jij'] },
        { nl: '“Nee, het reinigen is het grotere probleem.” In de correctie zit het echte punt.', en: '“No, cleaning is the bigger problem.” The correction is where the real issue shows.', cues: ['sponsor'] },
        { nl: 'Vul de stilte niet: de belangrijkste zin komt vaak net erna.', en: 'Don’t fill the silence: the important sentence often comes right after.', cues: ['sponsor'] },
      ],
    },
    {
      id: 's7', lesson: FT, level: 2, still: 0.9, title: { nl: 'Wat je meeneemt', en: 'What you leave with' },
      beats: [
        { nl: 'Stille weerstand: korte antwoorden, “staat in het rapport”. Vraag: “Hoe ging dat toen?”', en: 'Quiet resistance: short answers, “it’s in the report”. Ask: “What happened last time?”', cues: ['sponsor', 'jij'] },
        { nl: 'Laat het verhaal van de vorige consultant vertellen. Een notitieboek, geen verhoor.', en: 'Let them tell the previous consultant’s story. A notebook, not an interrogation.', cues: ['jij'] },
        { nl: 'Binnen {n:24} uur een {t:Intakesamenvatting|intakesamenvatting}: vijf dingen op één A4.', en: 'Within {n:24} hours an {t:Intake summary|intake summary}: five things on one page.', cue: { Intakesamenvatting: 'summary' } },
        { nl: 'Donderdag de lijn op met twee ploegleiders. De samenvatting gaat dezelfde avond weg.', en: 'Thursday on the line with two shift leads. The summary goes out that evening.', cues: ['summary'] },
        { nl: '“Wanneer zeg jij over een half jaar: dit was het waard?”', en: '“What would make you say in six months that this was worth it?”', cues: ['sponsor', 'jij'] },
      ],
    },
    {
      id: 's8', lesson: LI, level: 1, still: 0.9, title: { nl: 'Luisteren onder druk', en: 'Listening under pressure' },
      beats: [
        { nl: 'De werkvoorbereider: “Drie jaar geleden ook gedaan. We kregen alleen meer formulieren.”', en: 'The work preparer: “We did this three years ago. We just got more forms.”', cues: ['planner'] },
        { nl: 'Eerst reflecteren of parafraseren, dan vragen, dan pas antwoorden.', en: 'Reflect or paraphrase first, then ask, then answer.', cues: ['jij'] },
        { nl: 'Jij: “Het leverde je vooral meer werk op.” Dan vijf seconden stilte.', en: 'You: “It mostly gave you more work.” Then five seconds of silence.', cues: ['jij', 'planner'] },
        { nl: 'Een {t:Open vraag|open vraag}: “Wat gebeurde er toen?” De formulieren kwamen van het hoofdkantoor.', en: 'An {t:Open question|open question}: “What happened then?” The forms came from head office.', cue: { 'Open vraag': 'openq' } },
        { nl: '“Ik snap dat je sceptisch bent. Kijk je donderdag mee naar de check?”', en: '“I get why you’re sceptical. Will you look at the check with me Thursday?”', cues: ['jij', 'planner'] },
      ],
    },
    {
      id: 's9', lesson: LI, level: 1, still: 0.9, title: { nl: 'Stilte en echte vragen', en: 'Silence and real questions' },
      beats: [
        { nl: 'Wacht minstens drie seconden, onder druk vijf. Het echte antwoord komt na het eerste.', en: 'Wait at least three seconds, five under pressure. The real answer comes after the first.', cues: ['jij'] },
        { nl: '“Wat mis ik?” Geen “waarom” als de emoties hoog zitten: “wat maakte dat je…”', en: '“What am I missing?” No “why” when emotions run high: “what made you…”', cues: ['jij'] },
        { nl: 'Geen nepvraag: “Vind je ook niet dat…?” Dan leer je niks.', en: 'No fake questions: “Don’t you think…?” Then you learn nothing.', cues: ['jij'] },
        { nl: 'Ervaring: één zin, en geef het terug. Wat heb ik geleerd dat ik nog niet wist?', en: 'Experience: one sentence, then hand it back. What did I learn that I didn’t know?', cues: ['jij', 'planner'] },
      ],
    },
  ],
  skip: [
    { lesson: LI, term: 'MORE PIES', reason: 'Same term and meaning as MORE PIES of pm.intake.firsttalk, which scene 5 names with its cue (the letters card) and builds letter by letter; the build resolves a shared term name to the first served lesson.' },
    { lesson: LI, term: 'Reflecteren', reason: 'Same term and meaning as Reflecteren of pm.intake.firsttalk, named with its cue in scene 5 (the R row); scene 8 shows it under pressure.' },
    { lesson: LI, term: 'Parafraseren', reason: 'Same term and meaning as Parafraseren of pm.intake.firsttalk, named with its cue in scene 5 (the P row); scene 6 and scene 8 show a paraphrase corrected and confirmed.' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons'
// teach text and worked examples, so every point of the checklist above is
// said here or drawn on a card. No symbol the voice would read aloud, no
// spoken parenthesis or quote. Words checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex, 2026-11-12), and reworded where it misreads:
// "dashboard" is read "dasj-boo-ard" (said "een scherm vol cijfers", "het
// scherm"), "intake" "in-taa-ke" (said "het eerste gesprek"; the term
// Intakesamenvatting stays in the caption), "slidedeck" "slie-de-dek" (said
// "een mooie presentatie"), "target" with a Dutch g (said "streefcijfer"),
// "tool" "tohl" (said "zo'n scherm"), "sceptisch" "sep-tis" (said "twijfelt"),
// and "de S samenvatten" loses its S, the clitic 's (said "de S: samenvatten").
// The English words of MORE PIES (Mood "moot", Inquiry "inkviri", Experience,
// Silence) are said as their Dutch meanings, letter by letter, while the card
// shows them; names (Rogers with a Dutch g, Farson, Mary Budd Rowe) are on the
// cards, not spoken. One Dutch SAY rule in films/_kit/timeline.mjs, which only
// this film says: MORE PIES as "Mor pais" (espeak-ng reads PIES as the Dutch
// "pis"). Left as read: "niksdoen" stressed on "doen", a small drift.
const SAY = [
  [ // s1 what they ask
    { nl: 'Een teamleider bij een netbeheerder vraagt om een beter overzicht van de werkorders: een scherm vol cijfers. Klanten komen zelden met een probleem, maar met een oplossing of een symptoom.',
      en: 'A team lead at a grid operator asks for a better dashboard for the work orders: a screen full of figures. Clients rarely bring a problem, but a solution or a symptom.' },
    { nl: 'Haal drie lagen uit elkaar. Het {t:Symptoom|symptoom}: wat ze zien. Het {t:Probleem|probleem}: de oorzaak eronder, waar een project iets aan kan doen. Het {t:Doel|doel}: wat meetbaar anders moet zijn.',
      en: 'Separate three layers. The {t:Symptom|symptom}: what they see. The {t:Problem|problem}: the cause underneath, which a project can change. The {t:Goal|goal}: what should be measurably different.' },
    { nl: 'Waarvoor? Zien welke klussen vastlopen. {n:140} van de {n:600} orders wachten langer dan {n:4} weken, {n:90} op materiaal.',
      en: 'What for? Seeing which jobs get stuck. {n:140} of {n:600} orders have waited over {n:4} weeks, {n:90} for materials.' },
    { nl: 'Het probleem: materiaal is niet gekoppeld aan de planning. Het doel: geen order wacht langer dan {n:4} weken op materiaal. Het scherm wordt een klein onderdeel: een project op het symptoom lost niks op.',
      en: 'The problem: materials aren\'t linked to the planning. The goal: no order waits over {n:4} weeks for materials. The dashboard becomes a small part: a project on the symptom fixes nothing.' },
  ],
  [ // s2 getting underneath
    { nl: 'Vraag waaraan ze het merken, sinds wanneer, en wat al geprobeerd is. Neem één recent geval door: dat toont het mechanisme, niet hun mening.',
      en: 'Ask how they notice it, since when, and what has been tried. Walk through one recent case: it shows the mechanism, not their opinion.' },
    { nl: 'Wat kost het per week, of na een jaar? Dat zijn de {t:Kosten van niksdoen|kosten van niksdoen}: is een project het waard?',
      en: 'What does it cost per week, or after a year? That is the {t:Cost of inaction|cost of inaction}: is a project worth it?' },
    { nl: 'Vaak gaat het om een streefcijfer op een KPI, zoals de {t:OEE|OEE}: het deel van de geplande tijd dat een machine op volle snelheid goede producten maakt.',
      en: 'Often it is a target on a KPI, like {t:OEE|OEE}: the share of planned time a machine makes good parts at full speed.' },
    { nl: 'Van {n:58} naar {n:75} procent is nog een wens; {n:85} heet wereldklasse, maar is een afspraak. Waar gaan de {n:42} punten heen: storingen, omstellen, langzaam draaien of afkeur?',
      en: 'From {n:58} to {n:75} percent is still a wish; {n:85} is called world class, but is a convention. Where do the {n:42} points go: breakdowns, changeovers, slow running or scrap?' },
  ],
  [ // s3 the people side
    { nl: 'Wie vraagt, heeft er vaak zijn naam aan verbonden. Ga er niet tegenin: zo\'n scherm kan best helpen, maar mag ik eerst zien waar de vertraging vandaan komt?',
      en: 'Whoever asks often has their name tied to it. Don\'t attack it: a dashboard could well help, but can I first see where the delays come from?' },
    { nl: 'Al geanalyseerd? Mooi, laat maar zien. Kan dat niet, dan weet je ook iets.',
      en: 'Analysed already? Great, show me. If they can\'t, you\'ve learned something too.' },
    { nl: 'Experts verschillen hierover. Een eerlijk midden: hun oplossing is een hypothese, die je in een week of twee met data checkt.',
      en: 'Experts disagree here. A fair middle: their solution is a hypothesis you check with data in a week or two.' },
    { nl: 'Stel naïeve vragen, en schrijf hun woorden letterlijk op.',
      en: 'Ask naive questions, and write their words down literally.' },
  ],
  [ // s4 an hour in four parts
    { nl: 'Het eerste gesprek: een uur met de productiemanager van een zuivelfabriek. Openen {n:5} minuten, verkennen {n:35}, checken {n:10}, afsluiten {n:10}.',
      en: 'The first conversation: an hour with the production manager of a dairy plant. Open {n:5} minutes, explore {n:35}, check {n:10}, close {n:10}.' },
    { nl: 'Benoem de opbouw: ik wil vooral luisteren en eindigen met een volgende stap. Dat geeft rust.',
      en: 'Say the structure: I\'d like to mostly listen and end with a next step. It puts people at ease.' },
    { nl: 'Verkennen: hun verhaal. Checken: samenvatten, wat mist er? Afsluiten: een stap met een datum.',
      en: 'Explore: their story. Check: summarise, what\'s missing? Close: a step with a date.' },
  ],
  [ // s5 MORE PIES
    { nl: '{t:Actief luisteren|Actief luisteren} is luisteren om te begrijpen, niet om te antwoorden. De checklist {t:MORE PIES|MORE PIES} komt uit de crisisonderhandeling.',
      en: '{t:Active listening|Active listening} means listening to understand, not to reply. The checklist {t:MORE PIES|MORE PIES} comes from crisis negotiation.' },
    { nl: 'De M: lees de sfeer. De O: {t:Open vragen|open vragen}: hoe gaat een gewone maandag? De R: {t:Reflecteren|reflecteren}: dat klinkt frustrerend. De E: empathie.',
      en: 'M, mood: read the room. O: {t:Open questions|open questions}: how does a normal Monday go? R: {t:Reflecting|reflecting}: that sounds frustrating. E: empathy.' },
    { nl: 'De P: {t:Parafraseren|parafraseren}, de kern in je eigen woorden. De I: doorvragen. De E: kort je ervaring, voor vertrouwen. De S: drie tellen stilte.',
      en: 'P: {t:Paraphrasing|paraphrasing}, the core in your own words. I: inquiry. E: your experience, briefly, for trust. S: three seconds of silence.' },
    { nl: 'Soms is de M aanmoedigen, en de S: samenvatten.',
      en: 'In some versions M is minimal encouragers, and S is summarising.' },
  ],
  [ // s6 in the correction
    { nl: 'Laat de klant {n:70} tot {n:80} procent praten. Praat je twee minuten? Stel een vraag.',
      en: 'Let the client talk {n:70} to {n:80} percent of the time. Talked for two minutes? Ask a question.' },
    { nl: '{n:6} omstellingen per dag, van {n:50} minuten. Jij parafraseert: dus vijf uur omstellen remt het extra volume?',
      en: '{n:6} changeovers a day, of {n:50} minutes. You paraphrase: so five hours of changeovers block the extra volume?' },
    { nl: 'Nee, het reinigen is het grotere probleem. Daar zit het echte punt: een verkeerde samenvatting verbeteren mensen veel makkelijker dan dat ze zelf alles vertellen.',
      en: 'No, the cleaning is the bigger issue. That is the real point: people correct a wrong paraphrase far more readily than they tell it all themselves.' },
    { nl: 'Junioren vullen stiltes uit zenuwen; de belangrijkste zin komt vaak net erna.',
      en: 'Juniors fill silences out of nerves; the important sentence often comes right after.' },
  ],
  [ // s7 what you leave with
    { nl: 'Weerstand is meestal stil: korte antwoorden, het staat in het rapport. Benoem het luchtig: hoe ging dat de vorige keer?',
      en: 'Resistance is usually quiet: short answers, it\'s in the report. Name it lightly: what happened last time?' },
    { nl: 'Vaak liet een vorige consultant een mooie presentatie achter, zonder resultaat. Laat dat vertellen. Een notitieboek voelt minder als een verhoor.',
      en: 'Often a previous consultant left a slide deck, and nothing changed. Let them tell it. A notebook feels less like an interrogation.' },
    { nl: 'Ga weg met vijf dingen: het probleem in hun woorden, drie namen, welke data, wat succes is voor de sponsor, en een datum. Binnen {n:24} uur op één A4: open vragen, geen aannames.',
      en: 'Leave with five things: the problem in their words, three names, which data, what success means to the sponsor, and a date. Within {n:24} hours on one page: open questions, not guesses.' },
    { nl: 'Donderdag de lijn op met twee ploegleiders, en dezelfde avond de samenvatting.',
      en: 'The line on Thursday with two shift leads, and the summary that same evening.' },
    { nl: 'Slotvraag: wanneer zeg jij over een half jaar, dit was het waard?',
      en: 'Closing question: what would make you say in six months that this was worth it?' },
  ],
  [ // s8 listening under pressure
    { nl: 'In een teamoverleg zegt de senior werkvoorbereider: dit hebben we drie jaar geleden ook gedaan. We kregen alleen meer formulieren.',
      en: 'In a team meeting the senior work preparer says: we did this three years ago. We just got more forms.' },
    { nl: 'Onder druk verdedig je. De regel: eerst reflecteren of parafraseren, dan vragen, dan pas antwoorden. Onder een aanval zit vaak een zorg: werkdruk, schuld, controle.',
      en: 'Under pressure you want to defend. The rule: reflect or paraphrase first, then ask, then answer. An attack often hides a worry: workload, blame, control.' },
    { nl: 'De sfeer is gespannen. Je reflecteert: het leverde je vooral meer werk op. Dan wacht je vijf seconden.',
      en: 'The mood is tense. You reflect: it mostly gave you more work. Then you wait five seconds.' },
    { nl: 'Een {t:Open vraag|open vraag}: wat gebeurde er toen? Je parafraseert: dus jullie werden niet gevraagd, en de formulieren kwamen van het hoofdkantoor.',
      en: 'An {t:Open question|open question}: what happened then? You paraphrase: so you weren\'t asked, and the forms came from head office.' },
    { nl: 'Ik snap dat je twijfelt. Kijk je donderdag mee naar de check?',
      en: 'I get why you\'re sceptical. Will you look at the check with me on Thursday?' },
  ],
  [ // s9 silence and real questions
    { nl: 'Wacht drie seconden, onder druk vijf. Leraren wachtten zo\'n één seconde; bij drie werden antwoorden langer en beter. Rust bij stilte oogt als zelfvertrouwen, handig als je de jongste bent.',
      en: 'Wait three seconds, five under pressure. Teachers waited about one second; at three, answers got longer and better. Calm in silence reads as confidence, which helps the youngest.' },
    { nl: 'Open met: wat mis ik? Wat moet er waar zijn? Geen waarom als het verhit is, dat klinkt als een verwijt; zeg: wat maakte dat je.',
      en: 'Open with: what am I missing? What would have to be true? No why when it gets heated, it sounds like blame; say: what made you.' },
    { nl: 'Geen nepvraag als vind je ook niet: dan leer je niks.',
      en: 'No fake question like don\'t you think: then you learn nothing.' },
    { nl: 'Je ervaring is een brug: één zin, en terug. Check: wat heb ik geleerd? Niks? Dan praatte je te veel.',
      en: 'Your experience is a bridge: one sentence, then back. Check: what did I learn? Nothing? Then you talked too much.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(dashboard|intake\w*|slidedeck|target|tool|sceptisch|mood|inquiry|experience|silence|rogers|farson|rowe)\b|\bde S [a-z]/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(plain)) throw new Error(`narration: "${MISREAD.exec(plain)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// each scene's length from its share of the Dutch narration, never shorter than
// its captions need, all within the 300 s cap
{
  const TOTAL = 296;
  const said = SAY.map((sc) => sc.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
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
.ft-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.ft-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.ft-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.ft-fill{fill:var(--anatomy-hi);stroke:none}
.ft-gap{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:4 3}
.ft-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.ft-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.ft-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.ft-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.ft-let{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:800}
.ft-line{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.ft-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.ft-hand{fill:none;stroke:var(--anatomy-strong);stroke-width:3;stroke-linecap:round}
.ft-dot{fill:var(--anatomy-mid)}
.ft-dot1{fill:var(--fp-accent)}
.ft-bub{fill:var(--anatomy-card);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linejoin:round}
.ft-bubon{fill:var(--anatomy-card);stroke:var(--fp-accent);stroke-width:2;stroke-linejoin:round}
[data-cue][data-on] .ft-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .ft-let,[data-cue][data-on] .ft-lab{fill:var(--fp-accent-text)}
[data-cue][data-on] .ft-fill{fill:var(--fp-accent)}
[data-cue][data-on] .ft-line{stroke:var(--fp-accent)}
.ft-lab{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.ft-mini text{display:none}
.ft-mini *{vector-effect:non-scaling-stroke}
.ft-mini .ft-card,.ft-mini .ft-hot,.ft-mini .ft-line,.ft-mini .ft-gap{stroke-width:.7px}
.ft-mini .ft-hand,.ft-mini .ft-strike{stroke-width:.9px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalender. Jij, de adviseur in petrol, staat aan de voorkant van een vergadertafel; de teamleider aan het linkereind, de sponsor in pak aan het rechtereind, de planner erachter. Op tafel een notitieboek, een laptop, twee kopjes en een A4 dat zich vult. Boven wie spreekt verschijnt een tekstballon. Rechts een paneel met kaarten, gemarkeerd als voorbeeld of schema: symptoom, probleem en doel; de vragen en een OEE-balk van 58 procent; het uur als klok met 5, 35, 10 en 10 minuten; MORE PIES letter voor letter; spreektijd en de correctie over het reinigen; de samenvatting op één A4; de stappen onder druk; en de wachttijd van één tegen drie seconden.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar. You, the consultant in petrol, stand at the front of a meeting table; the team lead at the left end, the sponsor in a suit at the right end, the planner behind. On the table a notebook, a laptop, two cups and a page that fills in. A speech bubble appears over whoever speaks. At the right a panel with cards, marked as example or diagram: symptom, problem and goal; the questions and an OEE bar at 58 percent; the hour as a clock of 5, 35, 10 and 10 minutes; MORE PIES letter by letter; talk time and the correction about cleaning; the summary on one page; the steps under pressure; and the wait time of one against three seconds.',
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

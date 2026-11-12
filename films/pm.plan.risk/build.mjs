// Dev tool, not shipped. Builds the explainer film "Een pre-mortem / A
// pre-mortem" for Projecten: pm.plan.risk (level 1 of the topic Risico's en
// mensen, "Een risicolijst die gebruikt wordt").
//
//   node films/pm.plan.risk/build.mjs            build the page
//   node films/pm.plan.risk/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.plan.risk.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.plan.risk: "it failed: why?" turning into a used risk list; three
// scenes, about 80 s). Storyboard drift: six scenes and about three minutes,
// because a lesson with a film no longer shows its worked example, so the film
// carries all five teach blocks and the worked example: the pre-mortem (s1)
// and why it works (s2) of teach 4, the register and the owner (s3, teach 1),
// scores and mitigations with the bakery's lines (s4, teach 2 and the
// example), a living register and issues (s5, teach 3), and the people side
// (s6, teach 5).
//
// Checklist (lesson point: scene and beat; "card" where the card carries it):
//   teach 1: a risk might happen and would hurt the project (s3 b1); the
//     register lists them with likelihood, impact (how bad), owner and a dated
//     action (s3 b2); the owner is one person who watches and acts, not a
//     department (s3 b3); "data may be poor" is no use, the pre-2023
//     maintenance data after the move to the new system, owner Pieter, test
//     export in week 1 is (s3 b4)
//   teach 2: likelihood and impact 1 to 5, multiplied, 1 to 25 (s4 b1); a way
//     to sort, not truth, a 12 is not really worse than a 10 (s4 b2); the
//     action is the mitigation, what you do now to make it less likely or
//     less harmful; "monitor" is none, "test export in week 1" is (s4 b3)
//   teach 3: most registers die after the kick-off (s5 b1); only the top five
//     at each steering group (s5 b1), the owner says what happened since
//     (s5 b2); new risks as you hear them, often at the coffee machine
//     (s5 b3); risks that came true become issues, handled, not watched (s5 b4)
//   teach 4: the pre-mortem, Gary Klein 2007 (s1 b4; "HBR" on the card);
//     "imagine it's six months from now and this project has failed; write
//     down, alone, why" (s1 b2-b3); one reason per person per round (s1 b3);
//     failure imagined as fact makes people name what they would not say:
//     the sponsor might leave, the night shift won't accept it, the IT change
//     isn't budgeted (s2 b2); Klein cites Mitchell, Russo and Pennington
//     (1989; the names on the card): prospective hindsight, looking back from
//     an imagined future, by Klein's account raises the ability to identify
//     the right reasons by 30% (s2 b3)
//   teach 5: a sensitive risk, "the plant manager doesn't really believe in
//     this", not in a register the plant manager reads (s6 b1); worded as a
//     theme, sponsorship and visible support, the real point one-on-one with
//     whoever can act (s6 b2); unknown likelihood: say so, plan a cheap test
//     (s6 b3); the sharp question, word for word (s6 b4)
//   example: a downtime project at a bakery, kick-off, a 20-minute pre-mortem
//     with six people (s1 b1); the reasons: summer peak (three people),
//     operators stopped logging after two weeks, the new manager cancelled it
//     (s2 b1); the top ones become register lines (s3 b1, s4 b4); summer peak
//     high and high, owner the maintenance manager, analysis before June and
//     4 hours a week per technician (s4 b4); logging, owner the shift lead,
//     one-tap logging on the line terminal, the screen at the line, by week 3
//     (s4 b5); each steering group starts with these five (s5 b1)
//   recall (not teach, said once): writing alone first keeps the loudest
//     voice from setting the direction (s1 b4)
//
// Facts: Gary Klein, "Performing a Project Premortem", Harvard Business Review
// 85 (9), September 2007, describes the method (each person writes reasons
// alone, then the leader collects one reason per person in turn) and cites
// Deborah Mitchell, Jay Russo and Nancy Pennington (1989) for prospective
// hindsight: it "increases the ability to correctly identify reasons for future
// outcomes by 30%". The 1989 paper itself counted reasons rather than judging
// them right, so film and lesson give the 30% as Klein reports it ("volgens
// hem", "by his account"), not as the paper's own finding; the
// "six months" wording is the lesson's, not quoted as Klein's.
//
// The drawing is the shared pm world (films/_pm/world.mjs): a meeting room with
// a whiteboard (the sticky notes of the pre-mortem fill it, then cluster), a
// wall clock and, in this folder, a coffee machine on a low cabinet; a meeting
// table with the register sheet (a rule per line written), a stack of papers
// and cups; and the recurring cast: "jij" the consultant in petrol at the
// board, the sponsor, the team lead and the planner. A panel at the right, in
// stage space, carries the cards, each labelled "voorbeeld" or "schema".
//
// Focus (strictFocus): every beat names the block it explains. Each card
// block of the panel is its own cue group (SLOTS below), and so are the
// people, the board, the register sheet and the coffee machine. The sensitive
// risk (s6 b1) lights the register it stays out of, not the sponsor: the
// lesson never says the sponsor is the doubting plant manager. In s5 rows 4
// and 5 of the top five stay unnamed bars (the lesson names three reasons),
// but every row shows its owner.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lesson's current text (the build
// fails if it drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const RISK = 'pm.plan.risk';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const has = (lang, field, list) => {
  const l = lessons[lang].get(RISK);
  const t = field === 'teach' ? l.teach.join('\n') : l.example.text;
  for (const s of list) assert(t.includes(s), `${RISK} ${lang} ${field} no longer says "${s}"`);
};
has('nl', 'teach', ['iets wat kan gebeuren en het project pijn zou doen', 'een kans, een impact (hoe erg), een risico-eigenaar en een actie met een datum',
  'één persoon die het in de gaten houdt en handelt, geen afdeling', '“Data kan slecht zijn” helpt niet', 'van voor 2023', 'eigenaar: Pieter; actie: testexport in week 1',
  'van 1 tot 5 en vermenigvuldigen', '1 tot 25', 'sorteerhulp, niet als waarheid', 'een 12 is niet echt erger dan een 10', 'kleiner of minder schadelijk',
  '“Monitoren” is geen beheersmaatregel', 'sterven na de kick-off', 'alleen de top vijf komt in elke stuurgroep langs', 'wat er sindsdien gebeurd is',
  'Risico’s die uitkomen worden issues', 'niet alleen gevolgd', 'bij het koffieapparaat',
  'Gary Klein in 2007', 'over zes maanden en dit project is mislukt. Schrijf alleen op waarom.', 'één reden per persoon', 'als feit wordt voorgesteld',
  'de sponsor vertrekt misschien, de nachtploeg accepteert het niet, de IT-aanpassing heeft geen budget', 'Mitchell, Russo en Pennington (1989)', 'volgens hem vergroot', 'het vermogen om de juiste redenen te noemen met 30%',
  'de plantmanager gelooft er eigenlijk niet in', '(“sponsorschap en zichtbare steun”)', 'één op één met wie er iets aan kan doen', 'plan een goedkope test',
  '“Wat zien we als eerste als dit begint te gebeuren?”']);
has('nl', 'example', ['stilstandproject bij een bakkerij', 'pre-mortem van 20 minuten met zes mensen', 'zomerpiek” (drie mensen)', 'na twee weken met stops registreren',
  'de nieuwe manager blies het af', 'kans hoog, impact hoog, eigenaar de onderhoudsmanager', 'analyse voor juni plannen en per monteur 4 uur per week reserveren',
  'eigenaar de ploegleider', 'met één tik op de lijnterminal (het scherm bij de lijn) voor week 3', 'Elke stuurgroep begint met deze vijf.']);
has('en', 'example', ['20-minute pre-mortem with six people', 'reserve 4 hours a week per technician', 'by week 3']);
const SCORE = { min: 1, max: 5 };
assert(SCORE.min * SCORE.min === 1 && SCORE.max * SCORE.max === 25, 'scores 1 to 5, products 1 to 25');
assert(3 * 4 === 12 && 2 * 5 === 10, 'the two marked cells score 12 and 10');

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
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const REG = w.sheet({ x: 140, y: 154, z: TZ, w: 29.7, d: 21 });
const REG_AT = w.at([155, 165, TZ]).map((v) => Math.round(v * 10) / 10);
// the cast: who stands where (world cm); heads at z 172 for the speech bubbles
const SPOT = {
  jij: { x: 44, y: 50, along: 'x', reach: [72, 6, 150] },
  teamlead: { x: 76, y: 182, along: 'y' },
  sponsor: { x: 262, y: 152, along: 'y' },
  planner: { x: 232, y: 208, along: 'x' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map((v) => Math.round(v * 10) / 10)]));
const person = (role) => w.person({ ...SPOT[role], role });

// The sticky notes (board face: u = x, v = -z; a note hangs down from its top
// edge): [scattered x, z, clustered x, z, group]. Two rounds of six people, so
// twelve; group 0 the summer peak (three people), 1 logging, 2 the manager,
// 3 the rest. The ticks mark clusters that became register lines.
const NOTE = 14;
const NOTES = [
  [74, 186, 72, 186, 0], [114, 184, 120, 186, 1], [152, 187, 72, 182, 3], [190, 185, 166, 186, 2],
  [76, 155, 76, 182, 0], [116, 157, 92, 140, 3], [154, 154, 124, 182, 1], [192, 156, 112, 140, 3],
  [74, 126, 80, 178, 0], [112, 124, 132, 140, 3], [150, 127, 152, 140, 3], [190, 125, 172, 140, 3],
];
for (const [sx, sz, cx, cz] of NOTES) for (const [x, z] of [[sx, sz], [cx, cz]]) assert(x >= BOARD.area.x0 && x + NOTE <= BOARD.area.x1 && z <= BOARD.area.z1 && z - NOTE >= BOARD.area.z0, 'every note on the board');
assert(NOTES.filter((n) => n[4] === 0).length === 3, 'three people wrote the summer peak');
const TICKS = [[98, 175], [142, 177]];
const EXTRA = [204, 186];

// a coffee machine on a low cabinet against the back wall (teach 3: new risks
// are heard at the coffee machine); drawn with the world's own solids
function coffee(x, y) {
  const out = [w.halo({ x: x - 2, y: y - 2, w: 34, d: 34, r: 4 })];
  out.push(w.box({ x, y, w: 30, d: 30, r: 1 }, 0, 86, { tone: 'lo' }, { steps: 2, bevel: 0.4 }));
  out.push(w.box({ x: x + 3, y: y + 2, w: 24, d: 22, r: 2 }, 86, 128, { tone: 'mid' }, { steps: 3, bevel: 0.6 }));
  // the spout recess and a cup under it, and two buttons
  out.push(w.box({ x: x + 8, y: y + 22, w: 14, d: 3, r: 0.6 }, 92, 104, { tone: 'lo' }, { steps: 1 }));
  out.push(w.post(x + 15, y + 21, 2.6, 86, 92, { tone: 'hi' }, 14));
  out.push(k.dotsSvg([w.at([x + 10, y + 24.2, 116]), w.at([x + 20, y + 24.2, 116])], { size: 0.9, tone: 'hi' }));
  return out.join('');
}

const boardNotes = `<g transform="${BOARD.face}">${g('bNotes', '')}</g>`;
const regMini = `<g transform="${REG.face}">${g('dMini', '')}</g>`;
const world = [
  w.room(ROOM),
  w.clock(208, 214, 10),
  cueG('board', BOARD.svg + boardNotes),
  cueG('coffee', coffee(250, 4)),
  person('jij'),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  person('teamlead'),
  w.table(TABLE),
  w.stack({ x: 104, y: 126, z: TZ, n: 4 }),
  cueG('doc', REG.svg + regMini),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.cup(214, 146, TZ),
  person('sponsor'),
  person('planner'),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); the stage fills their contents per scene: o[key] goes into data-k
// "t_<key>".
const SLOTS = ['prompt', 'rules', 'reasons', 'unsaid', 'hind', 'def', 'row', 'owner', 'vague', 'grid', 'measure', 'rows', 'top5', 'issue', 'theme', 'test', 'first'];
const slot = (key) => cueG(key, g(`t_${key}`, ''));
const PX = 322;
const PW = 308;
const hud = g('panel', `<rect class="pr-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>` + g('pHead', '') + SLOTS.map(slot).join(''));
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world + g('bubbles', ''))}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const BOARD_AT = w.at([145, 0, 150]).map((v) => Math.round(v * 10) / 10);
const COFFEE_AT = w.at([265, 20, 110]).map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [150, 210, 1], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.12], to: [BOARD_AT[0], BOARD_AT[1] + 50, 1.18] },
  { from: [150, 190, 1.04], to: [REG_AT[0], REG_AT[1], 1.12] },
  { from: [REG_AT[0], REG_AT[1], 1.1], to: [REG_AT[0], REG_AT[1], 1.2] },
  { from: [150, 200, 1.02], to: [COFFEE_AT[0], COFFEE_AT[1] + 60, 1.1] },
  { from: [HEAD.sponsor[0], HEAD.sponsor[1] + 60, 1.08], to: [150, 200, 1.02] },
];

// ---------------------------------------------------------------- the film
const C = { PX, PW, SLOTS, HEAD, NOTE, NOTES, TICKS, EXTRA };
const spec = {
  id: RISK,
  title: { nl: 'Een pre-mortem', en: 'A pre-mortem' },
  lessons: [RISK],
  strictFocus: true,
  scenes: [
    {
      id: 's1', lesson: RISK, level: 1, still: 0.9, title: { nl: 'Het is mislukt', en: 'It failed' },
      beats: [
        { nl: 'Kick-off van een stilstandproject bij een bakkerij: zes mensen, {n:20} minuten.', en: 'Kick-off of a downtime project at a bakery: six people, {n:20} minutes.', focus: ['jij', 'teamlead', 'sponsor', 'planner', 'rules'] },
        { nl: 'Een {t:Pre-mortem|pre-mortem}: “Stel, het is over zes maanden en het project is mislukt.”', en: 'A {t:Pre-mortem|pre-mortem}: “Imagine it’s six months from now and the project has failed.”', cue: { 'Pre-mortem': 'prompt' }, focus: ['prompt', 'jij'] },
        { nl: '“Schrijf alleen op waarom.” Daarna per ronde één reden per persoon.', en: '“Write down, alone, why.” Then one reason per person per round.', focus: ['rules', 'board'] },
        { nl: 'Eerst alleen schrijven: zo bepaalt de luidste niet de richting. Gary Klein beschreef het in 2007.', en: 'Writing alone first keeps the loudest from steering. Gary Klein described it in 2007.', focus: 'rules' },
      ],
    },
    {
      id: 's2', lesson: RISK, level: 1, still: 0.9, title: { nl: 'Waarom het werkt', en: 'Why it works' },
      beats: [
        { nl: 'Drie keer “geen tijd door de zomerpiek”; registreren gestopt; de nieuwe manager blies het af.', en: 'Three times “no time, summer peak”; logging stopped; the new manager cancelled it.', focus: ['reasons', 'board'] },
        { nl: 'Mislukken als feit: mensen noemen wat ze anders niet zeggen.', en: 'Failure as a fact: people name what they would otherwise not say.', focus: ['unsaid', 'planner'] },
        { nl: 'Volgens Klein, die Mitchell, Russo en Pennington aanhaalt: {n:30}% beter in de juiste redenen.', en: 'According to Klein, citing Mitchell, Russo and Pennington: {n:30}% better at the right reasons.', focus: 'hind' },
      ],
    },
    {
      id: 's3', lesson: RISK, level: 1, still: 0.9, title: { nl: 'Van reden naar regel', en: 'From reason to line' },
      beats: [
        { nl: 'Een risico: iets wat kan gebeuren en het project pijn zou doen.', en: 'A risk: something that might happen and would hurt the project.', focus: ['def', 'board'] },
        { nl: 'De {t:Risicolijst|risicolijst}: per risico een kans, een impact, een eigenaar en een actie met datum.', en: 'The {t:Risk register|risk register}: per risk a likelihood, an impact, an owner and a dated action.', cue: { Risicolijst: 'row' }, focus: ['row', 'owner', 'doc'] },
        { nl: 'De {t:Risico-eigenaar|risico-eigenaar} is één persoon die het volgt en handelt, geen afdeling.', en: 'The {t:Risk owner|risk owner} is one person who watches it and acts, not a department.', cue: { 'Risico-eigenaar': 'owner' }, focus: 'owner' },
        { nl: '“Data kan slecht zijn” helpt niet. Data van voor 2023, eigenaar Pieter, testexport in week {n:1} wel.', en: '“Data may be poor” is no help. Data before 2023, owner Pieter, test export in week {n:1} is.', focus: 'vague' },
      ],
    },
    {
      id: 's4', lesson: RISK, level: 1, still: 0.9, title: { nl: 'Scoren en maatregelen', en: 'Scores and mitigations' },
      beats: [
        { nl: 'Kans en impact van {n:1} tot {n:5}, vermenigvuldigd: een score van {n:1} tot {n:25}.', en: 'Likelihood and impact from {n:1} to {n:5}, multiplied: a score from {n:1} to {n:25}.', focus: 'grid' },
        { nl: 'Een sorteerhulp, geen waarheid: een {n:12} is niet echt erger dan een {n:10}.', en: 'A way to sort, not the truth: a {n:12} is not really worse than a {n:10}.', focus: 'grid' },
        { nl: 'De {t:Beheersmaatregel|beheersmaatregel}: wat je nu doet. “Monitoren” telt niet, “testexport in week {n:1}” wel.', en: 'The {t:Mitigation|mitigation}: what you do now. “Monitor” doesn’t count, “test export in week {n:1}” does.', cue: { Beheersmaatregel: 'measure' }, focus: 'measure' },
        { nl: 'Zomerpiek: hoog en hoog. Onderhoudsmanager: analyse voor juni, {n:4} uur per week per monteur.', en: 'Summer peak: high and high. Maintenance manager: analysis before June, {n:4} hours a week per technician.', focus: ['rows', 'doc'] },
        { nl: 'Registreren: de ploegleider zorgt voor één tik op de lijnterminal, voor week {n:3}.', en: 'Logging: the shift lead sets up one-tap logging on the line terminal by week {n:3}.', focus: ['rows', 'doc'] },
      ],
    },
    {
      id: 's5', lesson: RISK, level: 1, still: 0.9, title: { nl: 'Een levende lijst', en: 'A living register' },
      beats: [
        { nl: 'De meeste risicolijsten sterven na de kick-off. Elke stuurgroep begint met de top vijf.', en: 'Most registers die after the kick-off. Each steering group starts with the top five.', focus: ['top5', 'sponsor'] },
        { nl: 'Elke eigenaar vertelt wat er sindsdien gebeurd is.', en: 'Each owner says what has happened since.', focus: ['top5', 'teamlead'] },
        { nl: 'Nieuwe risico’s erbij zodra je ze hoort, vaak bij het koffieapparaat.', en: 'Add new risks as you hear them, often at the coffee machine.', focus: ['coffee', 'planner', 'board'] },
        { nl: 'Komt een risico uit, dan wordt het een {t:Issue|issue}: aanpakken, niet alleen volgen.', en: 'A risk that comes true becomes an {t:Issue|issue}: handle it, don’t just watch it.', cue: { Issue: 'issue' }, focus: 'issue' },
      ],
    },
    {
      id: 's6', lesson: RISK, level: 1, still: 0.9, title: { nl: 'De mensenkant', en: 'The people side' },
      beats: [
        { nl: 'Gevoelig: “de plantmanager gelooft er niet in”. Zet dat niet in een lijst die hij leest.', en: 'Sensitive: “the plant manager doesn’t believe in it”. Keep that out of a register he reads.', focus: ['theme', 'doc'] },
        { nl: 'Schrijf een thema op, sponsorschap en zichtbare steun, en bespreek het echte punt één op één.', en: 'Write a theme, sponsorship and visible support, and discuss the real point one-on-one.', focus: ['theme', 'jij', 'sponsor'] },
        { nl: 'Weet je de kans niet? Zeg dat, en plan een goedkope test.', en: 'Don’t know the likelihood? Say so, and plan a cheap test.', focus: 'test' },
        { nl: 'Per toprisico: “Wat zien we als eerste als dit begint te gebeuren?”', en: 'For each top risk: “What would we see first if this starts to happen?”', focus: ['first', 'jij'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's
// teach text and worked example, so every point of the checklist above is
// said here (the researchers' names and HBR on the cards). No symbol the
// voice would read aloud, no spoken parenthesis or quote; years as plain
// words (a {n:} year would be grouped as 1.989). Words checked with espeak-ng
// phonemes through Piper's own bridge (nl_NL-alex, 2026-11-12) and reworded
// where it misreads: "beheersmaatregel" is stressed on "-GEL" (said
// "beheers-maatregel", which it reads BE-heers-MAAT-re-gel), "manager" gets a
// Dutch g (onderhoudsmanager said "het hoofd onderhoud", plantmanager "de
// directeur van de fabriek", the new manager "de nieuwe baas"), and Mitchell
// is read "mitchel" with the ch of "lachen" (the names stay on the card). One
// Dutch SAY rule in films/_kit/timeline.mjs, which only this film says: issue
// as "isjoe" (espeak-ng reads "is-uu-e"). Left as read: Pennington stressed
// on the last part (not spoken anyway), "operators" with a Dutch e, "teams"
// without its s (said "vaak scoor je").
const SAY = [
  [ // s1 it failed
    { nl: 'Een bakkerij start een project tegen stilstand. Bij de kick-off zit jij, de adviseur, met zes mensen in de vergaderruimte. Je neemt er {n:20} minuten voor.',
      en: 'A bakery starts a project against downtime. At the kick-off you, the consultant, sit with six people in the meeting room. You take {n:20} minutes for this.' },
    { nl: 'Je doet een {t:Pre-mortem|pre-mortem}. Je zegt: stel, het is over zes maanden, en dit project is mislukt.',
      en: 'You run a {t:Pre-mortem|pre-mortem}. You say: imagine it is six months from now, and this project has failed.' },
    { nl: 'Schrijf alleen op waarom het mislukt is. Iedereen schrijft eerst voor zichzelf. Daarna haal je per ronde één reden per persoon op, tot alles op het bord hangt.',
      en: 'Write down, alone, why it failed. Everyone writes on their own first. Then you collect one reason per person per round, until everything is on the board.' },
    { nl: 'Door eerst alleen te schrijven krijg je ieders beeld, en bepaalt de luidste niet de richting. Gary Klein beschreef deze methode in 2007.',
      en: 'Writing alone first gets you everyone\'s view, so the loudest voice does not set the direction. Gary Klein described the method in 2007.' },
  ],
  [ // s2 why it works
    { nl: 'Wat komt er boven? Drie mensen schrijven: onderhoud had nooit tijd, door de zomerpiek. Iemand anders: de operators aan de lijn stopten na twee weken met stops registreren. En: de nieuwe baas blies het af.',
      en: 'What comes up? Three people write: maintenance never had time, because of the summer peak. Someone else: the operators stopped logging stops after two weeks. And: the new manager cancelled it.' },
    { nl: 'Omdat het mislukken als feit wordt voorgesteld, noemen mensen dingen die ze anders niet zeggen. De sponsor vertrekt misschien. De nachtploeg accepteert het niet. De aanpassing van de IT-afdeling heeft geen budget.',
      en: 'Because the failure is imagined as a fact, people name things they would not say otherwise. The sponsor might leave. The night shift won\'t accept it. The IT change has no budget.' },
    { nl: 'Klein haalt daarbij onderzoek uit 1989 aan. Volgens hem maakt terugkijken vanuit een bedachte toekomst mensen {n:30} procent beter in het noemen van de juiste redenen.',
      en: 'Klein cites research from 1989 here. By his account, looking back from an imagined future makes people {n:30} percent better at naming the right reasons.' },
  ],
  [ // s3 from reason to line
    { nl: 'Nu maak je van de belangrijkste redenen risico\'s. Een risico is iets wat kan gebeuren en het project pijn zou doen.',
      en: 'Now you turn the top reasons into risks. A risk is something that might happen and would hurt the project.' },
    { nl: 'Een {t:Risicolijst|risicolijst} zet ze op een rij. Elk risico krijgt een kans, een impact, dus hoe erg het is, een eigenaar, en een actie met een datum.',
      en: 'A {t:Risk register|risk register} lists them. Each risk gets a likelihood, an impact, meaning how bad it is, an owner, and an action with a date.' },
    { nl: 'De {t:Risico-eigenaar|risico-eigenaar} is één persoon die het in de gaten houdt en handelt. Geen afdeling.',
      en: 'The {t:Risk owner|risk owner} is one person who watches it and acts. Not a department.' },
    { nl: 'Een regel als: data kan slecht zijn, helpt niemand. Deze wel: de onderhoudsdata van voor 2023 is na de overstap naar het nieuwe systeem misschien onbruikbaar. Eigenaar: Pieter. Actie: een testexport in week {n:1}.',
      en: 'A line like: data may be poor, helps no one. This one does: the maintenance data from before 2023 may be unusable after the move to the new system. Owner: Pieter. Action: a test export in week {n:1}.' },
  ],
  [ // s4 scores and mitigations
    { nl: 'Vaak scoor je kans en impact van {n:1} tot {n:5}, en vermenigvuldig je die. Een risico scoort dan {n:1} tot {n:25}.',
      en: 'Many teams score likelihood and impact from {n:1} to {n:5}, and multiply them. A risk then scores {n:1} to {n:25}.' },
    { nl: 'Zie die score als sorteerhulp, niet als waarheid. Een {n:12} is niet echt erger dan een {n:10}.',
      en: 'Treat the score as a way to sort, not as the truth. A {n:12} is not really worse than a {n:10}.' },
    { nl: 'De actie is de {t:Beheersmaatregel|beheers-maatregel}: wat je nu doet om het risico kleiner of minder schadelijk te maken. Monitoren is dat niet. Een testexport in week {n:1} wel.',
      en: 'The action is the {t:Mitigation|mitigation}: what you do now to make the risk less likely or less harmful. Monitoring is not one. A test export in week {n:1} is.' },
    { nl: 'Terug naar de bakkerij. De zomerpiek: kans hoog, impact hoog. Eigenaar is het hoofd onderhoud. Actie: de analyse voor juni plannen, en per monteur {n:4} uur per week reserveren.',
      en: 'Back to the bakery. The summer peak: likelihood high, impact high. The owner is the maintenance manager. Action: plan the analysis before June, and reserve {n:4} hours a week per technician.' },
    { nl: 'Het registreren: eigenaar is de ploegleider. Actie: registreren met één tik op de lijnterminal, het scherm bij de lijn, voor week {n:3}.',
      en: 'The logging: the owner is the shift lead. Action: one-tap logging on the line terminal, the screen at the line, by week {n:3}.' },
  ],
  [ // s5 a living register
    { nl: 'De meeste risicolijsten sterven na de kick-off. Houd de jouwe levend: alleen de top vijf komt in elke stuurgroep langs. Bij de bakkerij begint elke stuurgroep met deze vijf.',
      en: 'Most risk registers die after the kick-off. Keep yours alive: only the top five are discussed in each steering group. At the bakery, every steering group starts with these five.' },
    { nl: 'En per risico vertelt de eigenaar zelf wat er sindsdien gebeurd is.',
      en: 'And for each risk, the owner says what has happened since.' },
    { nl: 'Voeg nieuwe risico\'s toe zodra je ze hoort. Vaak hoor je ze bij het koffieapparaat.',
      en: 'Add new risks as soon as you hear them. You often hear them at the coffee machine.' },
    { nl: 'Komt een risico uit, dan wordt het een {t:Issue|issue}: een probleem dat nu speelt. Dat pak je aan; je volgt het niet alleen.',
      en: 'When a risk comes true, it becomes an {t:Issue|issue}: a problem happening now. You handle it; you don\'t just watch it.' },
  ],
  [ // s6 the people side
    { nl: 'Dan de mensenkant. Sommige risico\'s zijn gevoelig, zoals: de directeur van de fabriek gelooft er eigenlijk niet in. Zet dat niet in een lijst die hij leest.',
      en: 'Then the people side. Some risks are sensitive, like: the plant manager doesn\'t really believe in this. Don\'t write that in a register the plant manager reads.' },
    { nl: 'Schrijf het op als thema: sponsorschap en zichtbare steun. En bespreek het echte punt één op één, met wie er iets aan kan doen.',
      en: 'Word it as a theme: sponsorship and visible support. And discuss the real point one-on-one, with whoever can act on it.' },
    { nl: 'Weet je niet hoe groot de kans is? Zeg dat, en plan een goedkope test om het uit te zoeken.',
      en: 'Don\'t know how likely something is? Say so, and plan a cheap test to find out.' },
    { nl: 'En stel bij elk toprisico één scherpe vraag: wat zien we als eerste als dit begint te gebeuren?',
      en: 'And ask one sharp question for each top risk: what would we see first if this starts to happen?' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(\w*manager\w*|beheersmaatregel\w*|mitchell|pennington|russo|hindsight|deadline)\b|\bIT\b(?!-)/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(plain)) throw new Error(`narration: "${MISREAD.exec(plain)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// each scene's length from its share of the Dutch narration, never shorter than
// its captions need; the whole about as long as the narration plus a short
// look per scene, within the 300 s cap
{
  const said = SAY.map((sc) => sc.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(296, Math.ceil(all / 2.5) + 2 * SAY.length);
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
.pr-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pr-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pr-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pr-c1{fill:var(--anatomy-shade-1);stroke:none}
.pr-c2{fill:var(--anatomy-shade-2);stroke:none}
.pr-c3{fill:var(--anatomy-mid);stroke:none}
.pr-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pr-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pr-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pr-lab{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pr-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pr-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.pr-note{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:.5;stroke-linejoin:round}
.pr-note1{fill:color-mix(in srgb,var(--fp-accent) 30%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6;stroke-linejoin:round}
.pr-scrib{fill:none;stroke:var(--anatomy-lo);stroke-width:.7;stroke-linecap:round}
.pr-tick{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.pr-rule2{fill:none;stroke:var(--anatomy-mid);stroke-width:.5;stroke-linecap:round}
.pr-bub{fill:var(--anatomy-card);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linejoin:round}
.pr-bubon{fill:var(--anatomy-card);stroke:var(--fp-accent);stroke-width:2;stroke-linejoin:round}
[data-cue][data-on] .pr-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pr-lab,[data-cue][data-on] .pr-txt,[data-cue][data-on] .pr-big,[data-cue][data-on] .pr-mute{fill:var(--fp-focus-text)}
[data-cue][data-on] .pr-note{stroke:var(--fp-accent)}
[data-cue][data-on] .pr-rule2{stroke:var(--fp-accent)}
[data-cue][data-on] .pr-c3,[data-cue][data-on] .pr-c2{fill:color-mix(in srgb,var(--fp-accent) 40%,var(--anatomy-face))}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard, een klok en een koffieapparaat op een kastje. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van een vergadertafel, de sponsor in pak aan het rechtereind, de planner aan de voorkant. Op tafel een stapel papier, drie kopjes en de risicolijst, die zich regel voor regel vult. Op het bord verschijnen twaalf briefjes, die zich in groepjes ordenen. Rechts een paneel met kaarten, gemarkeerd als voorbeeld of schema: de vraag van de pre-mortem; de redenen bij de bakkerij en wat anders niemand zegt; 30 procent beter, zoals Klein het meldt; de vier velden van een risicoregel; een raster van vijf bij vijf voor kans maal impact; de regels voor de zomerpiek en het registreren; de top vijf in de stuurgroep en een risico dat een issue wordt; en een gevoelig risico als thema, een goedkope test en de vraag wat je als eerste ziet.',
  en: 'A meeting room. On the back wall a whiteboard, a clock and a coffee machine on a cabinet. You, the consultant in petrol, stand at the board. The team lead stands at the left end of a meeting table, the sponsor in a suit at the right end, the planner at the front. On the table a stack of paper, three cups and the risk register, which fills line by line. Twelve sticky notes appear on the board and sort themselves into clusters. At the right a panel with cards, marked as example or diagram: the pre-mortem question; the reasons at the bakery and what no one says otherwise; 30 percent better, as Klein reports it; the four fields of a register line; a five by five grid for likelihood times impact; the lines for the summer peak and the logging; the top five at the steering group and a risk that becomes an issue; and a sensitive risk as a theme, a cheap test and the question what you would see first.',
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

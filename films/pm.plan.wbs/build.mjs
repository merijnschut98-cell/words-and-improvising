// Dev tool, not shipped. Builds the explainer film "Het werk opdelen en
// schatten / Breaking down and estimating the work" for three level-1 lessons
// of Projecten: pm.intake.done (Wanneer is het af, topic Scope en
// projectopdracht), pm.plan.wbs (Het werk opdelen, topic Opdeling en scope)
// and pm.plan.estimate (Eerlijk schatten, topic Schatten en buffers).
//
//   node films/pm.plan.wbs/build.mjs            build the page
//   node films/pm.plan.wbs/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.plan.wbs.html: one offline page with the
// anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.plan.wbs: "the goal splitting into deliverables and packages, then a
// range instead of one number"). Storyboard drift: the plan's three scenes and
// ~110 s are nine scenes and about 295 s here (each scene as long as its share of the narration), because lessons with a film no
// longer show their worked example, so the film carries every point of all
// three lessons' teach text and all three worked examples (as eng.switchgear.protection).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// meeting room of pm.plan.schedule, with the whiteboard, the calendar strip,
// the table with the A4 and the laptop, and the cast: "jij" the consultant at
// the board, the sponsor, the team lead (here also the maintenance engineer
// of the estimate example) and the planner. A panel at the right, in stage
// space, draws each point, labelled "voorbeeld" (a worked example) or
// "schema" (a rule on its own): the goal sentence's four slots, the baseline
// bar, the in and out columns with requests creeping in, four weeks under the
// 2,0 % line, the WBS tree, the packages and the 8–80 scale, the post-it wall,
// the range and the three points, effort cells flowing into weeks, the buffer.
// The board mirrors the panel in miniature; the calendar strip lights the
// weeks a beat counts (two weeks of measuring, four weeks in a row, four weeks
// of duration, the buffer week).
//
// Checklist: every point of the served lessons, and where the film says it
// (scene.beat; "card" = on the panel only, shown for the whole beat):
//   intake.done teach 1: a one-sentence goal, from X to Y, by when, measured
//     how (1.2); the line 3 sentence, 14 to 8 hours a week by 1 April, MES stop
//     log (card 1.2); no sentence: a wish, not a project (1.1); write it with
//     the client, in their words, read it back (1.2)
//   teach 2: baseline first, the measured starting value (1.3); without it
//     every result disputed (1.3); no data: two weeks of measuring is the
//     first deliverable; "I don't know the number yet, and neither do you"
//     (1.4); two weeks catch a weekly pattern, a seasonal business needs
//     longer (card 1.4)
//   teach 3: scope is what the project covers (2.1); write in and out of
//     scope, out matters more (2.2); the line 3 / ERP / shifts illustration is
//     replaced by the worked example's in and out lists; list what people are
//     likely to raise, point to the list later (2.2, card)
//   teach 4: scope creep, one reasonable request at a time, "line 2" (2.3);
//     together they eat your weeks (caption 2.3); don't just say no: swap it or
//     the sponsor adds time; "what do we drop?" (2.4)
//   teach 5: acceptance criteria: who signs off, on what evidence, when (3.1);
//     four weeks in a row guard against one lucky week (3.1); agree it at the
//     start, by the end everyone remembers differently (3.2); experts on
//     stretch targets: motivating for some, ignored if nobody believes it (3.3)
//   example: a food plant, "reduce waste" (1.1); 3,2 % scrap, 2.400 of
//     75.000 kg a week, mostly at start-up after changeovers (1.3); goal 3,2 to
//     2,0 % on two filling lines by end of Q2, weekly scrap report (1.5, card);
//     in: start-up, machine settings, work instructions (2.1); out: packaging
//     supplier, recipes (2.2); the production manager signs off after four
//     weeks at 2,0 % or lower (3.1); saves 900 kg a week (3.4)
//   plan.wbs teach 1: start with deliverables, not activities; something that
//     exists at the end and can be checked (4.2); "what is there that isn't
//     there now?", four to seven (4.2); activities later, under each (4.4, the
//     packages under each deliverable); the readiness check: permits, materials
//     and crew ready (4.3)
//   teach 2: a WBS, a tree: project, deliverables, work packages (4.4); the
//     PMI's 100 % rule: the branches cover all the work and nothing outside;
//     not in the tree, nobody does it (4.5)
//   teach 3: a work package, one person or a small team can do and finish it
//     (5.1); the 8–80 rule, a rule of thumb (said, captioned and on the card): under
//     8 hours micromanagement, over 80 hides surprises, can't be tracked (5.2); a verb, an owner, a definition of
//     done: classify cancellations by cause, done when the planning manager
//     agrees the categories (5.3)
//   teach 4: build it with the people doing the work, sticky notes, one column
//     per deliverable, 60 minutes (6.1); people commit to what they helped
//     break down and spot what you forgot (6.2); data access, works council,
//     night-shift training; often forgotten: permissions, training, handover
//     to the line organisation (6.3)
//   teach 5: "let's just start": agreed, this week, give me one hour to see
//     what we sign up for, no surprise in month two (6.4, month two on the
//     card); experts on detail: all on day one, or six weeks and the rest
//     rough (6.5, card); ask the expert what must be finished first (6.5)
//   example: grid operator, last-week cancellations of planned MV jobs, 18 to
//     under 8 % in six months (4.1); two planners and a team lead, four
//     deliverables: baseline by cause, readiness check with planning and the
//     control room, six-week pilot in one region, handover to all planners
//     (4.3); under (1): extract 16 h, the data analyst; classify with two
//     planners 12 h; review with the planning manager 4 h, under 8 but fine, the rule
//     being a rule of thumb (5.4; the lesson now says so too); someone adds
//     "brief the switching technicians" under (3), which you had missed (6.2)
//   plan.estimate teach 1: a range, not a point, six to ten weeks more honest
//     than eight, shows the uncertainty (7.1); three-point: optimistic, most
//     likely, pessimistic (7.2); PERT, Polaris 1958 (7.2, card), (O + 4M + P)
//     / 6; 4, 6 and 14 days give 7, more than 6, more can go wrong than right (7.3)
//   teach 2: the planning fallacy, picturing the best case (7.4); Kahneman and
//     Tversky 1979 (card 7.4); Buehler, Griffin and Ross 1994: 34 days
//     expected, 56 taken (7.4, names on the card); forgetting the waiting and
//     the normal job; ask how long similar jobs took (7.5)
//   teach 3: effort is hours, duration calendar time (8.1); a shift lead with
//     maybe 20 % free (8.1); ask the hours a week; 16 hours at 4 a week is
//     four weeks; holidays and peak season go on the duration (8.2)
//   teach 4: a buffer for what goes wrong; no hidden padding per task, it gets
//     used (8.3); Parkinson 1955, Goldratt 1997 student syndrome (8.3, the
//     rule spoken, the names and "starting late" on the card); one visible buffer at the end or
//     before a hard milestone, watch it; half gone at a quarter is an early
//     warning (8.4)
//   teach 5: an engineer says "two weeks": don't argue, ask best case and what
//     makes it longer (9.1, in the example's "three days"); when you don't know:
//     say so, a range and what would narrow it, "four to eight weeks, after the
//     data check in week 2" (9.5, the words on the card); most experts give a
//     board the range plus the date they commit to (9.5)
//   example: a packaging plant, a breakdown analysis, "three days" (9.1); best
//     2 days if the export works, worst 10, the system was migrated, old data
//     may be messy (9.2); (2 + 4 × 3 + 10) / 6 = 4 days of work; one day a
//     week: about 4 weeks, not 3 days (9.3); in the plan "2 to 10 weeks, most
//     likely about 4"; the sponsor hears that after the first export you know
//     which end it is (9.4)
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The three worked examples, asserted against the lessons' current text (the
// build fails if they drift), and the sums the film shows, computed. The
// {n:...} numbers are checked against the Dutch lesson text by defineFilm.
const DONE = 'pm.intake.done';
const WBS = 'pm.plan.wbs';
const EST = 'pm.plan.estimate';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const nl = (id) => lessons.nl.get(id);
const en = (id) => lessons.en.get(id);
const has = (text, list, what) => { for (const s of list) assert(text.includes(s), `${what} no longer says "${s}"`); };
has(nl(DONE).example.text, ['“de verspilling terug te dringen”', '3,2% van de output gaat naar afkeur', 'zo’n 2.400 kg per week van de 75.000 kg', 'vooral bij het opstarten na omstellingen',
  'twee afvullijnen terugbrengen van 3,2% naar 2,0% voor eind Q2', 'wekelijkse afkeurrapportage', 'opstarten na omstellen, machine-instellingen, werkinstructies',
  'de verpakkingsleverancier en de recepturen', 'de productiemanager tekent af na vier weken achter elkaar op 2,0% of lager', 'Dat scheelt 900 kg per week'], 'the intake.done example');
has(en(DONE).example.text, ['3.2% of output is scrapped', '2,400 kg a week out of 75,000 kg', 'from 3.2% to 2.0% by the end of Q2', 'packaging supplier and recipes', 'That saves 900 kg a week'], 'the English intake.done example');
has(nl(DONE).teach.join('\n'), ['van X naar Y voor wanneer, gemeten hoe', 'van 14 naar 8 uur per week voor 1 april', 'stoplog van het MES', 'maar een wens', 'lees hem hardop terug',
  'twee weken meten je eerste deliverable', 'en eerlijk gezegd jij ook niet', 'Twee weken vangt een normaal weekpatroon', 'Buiten is belangrijker', 'naar lijn 2 kijken',
  'Wat laten we vallen om ruimte te maken?', 'Vier weken beschermt tegen één toevallig goede week', 'stretch targets'], 'the intake.done teach text');
has(nl(WBS).example.text, ['van 18% naar onder de 8%', 'twee planners en een teamleider', 'vier resultaten op de muur', '(1) nulmeting van afzeggingen per oorzaak', '(2) een gereedheidscheck',
  '(3) een pilot van zes weken in één regio', '(4) overdracht aan alle regionale planners', '(16 uur, de data-analist)', '(12 uur)', '(4 uur: onder de 8', 'een vuistregel, geen wet', '“schakelmonteurs briefen”'], 'the plan.wbs example');
has(nl(WBS).teach.join('\n'), ['Schrijf er vier tot zeven op', '100%-regel', 'De 8–80-regel', 'kleiner dan ongeveer 8 uur is micromanagement', 'groter dan ongeveer 80 uur', 'één resultaat per kolom, 60 minuten',
  'toegang tot data, de OR', 'het trainen van de nachtploeg', 'de overdracht aan de lijnorganisatie', 'Geef me één uur', 'in maand twee niet verrast', 'Wat moet er af zijn voordat jij hieraan kunt beginnen?'], 'the plan.wbs teach text');
has(nl(EST).example.text, ['“Drie dagen.”', 'Best: 2 dagen, als de export werkt', 'Slechtst: 10 dagen', '(2 + 4 × 3 + 10) / 6 = 4 dagen werk', 'één dag per week', 'ongeveer 4 weken, geen 3 dagen',
  '“data-analyse: 2 tot 10 weken, waarschijnlijk zo’n 4”', 'na de eerste export weet aan welke kant het uitkomt'], 'the plan.estimate example');
has(nl(EST).teach.join('\n'), ['“Zes tot tien weken” is eerlijker dan “acht weken”', 'in 1958', '(O + 4M + P) / 6', 'O = 4, M = 6, P = 14 dagen geeft dat 7 dagen', 'Kahneman en Tversky gaven het in 1979',
  'Buehler, Griffin en Ross uit 1994', 'zo’n 34 dagen af te hebben; gemiddeld duurde het 56', 'misschien 20% van zijn week vrij', '16 uur inspanning bij 4 uur per week is een doorlooptijd van vier weken',
  'De wet van Parkinson (1955)', 'Goldratt (1997)', 'studentensyndroom', 'na een kwart van het project half op', '“Vier tot acht weken. Na de datacheck in week 2'], 'the plan.estimate teach text');
// the sums the panel shows
assert(Math.round(75000 * 0.032) === 2400, 'scrap: 3,2 % of 75.000 kg is 2.400 kg');
assert(Math.round(75000 * (0.032 - 0.020)) === 900, 'from 3,2 to 2,0 % saves 900 kg a week');
assert((4 + 4 * 6 + 14) / 6 === 7 && 7 > 6, 'PERT of 4, 6, 14 days is 7, more than the most likely 6');
assert((2 + 4 * 3 + 10) / 6 === 4, 'PERT of 2, 3, 10 days is 4 days of work');
assert(4 / 1 === 4 && 16 / 4 === 4, 'four days at one day a week, and 16 hours at 4 a week, are four weeks each');
assert([16, 12].every((h) => h >= 8 && h <= 80), 'the two larger example packages sit within the 8–80 rule');

// ---------------------------------------------------------------- the world (the room of pm.plan.schedule)
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
const CAL = w.calendar({ y0: 30, z0: 104, weeks: 15, cw: 12.6, ch: 46 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const PLAN = w.sheet({ x: 140, y: 154, z: TZ, w: 29.7, d: 21 });
const DOC_AT = w.at([155, 165, TZ]);
// the panel's drawing area that the board and the A4 copy, in stage units
const PANEL_AREA = { x: 324, y: 46, w: 300, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const docMini = `<g transform="${PLAN.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, 1.2, 1.2, 28.5, 19.8)}">${g('dMini', '')}</g></g>`;
const calHi = `<g transform="${CAL.face}">${g('calHi', '')}</g>`;
const CELLS = [...Array(15).keys()].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));

const world = [
  w.room(ROOM),
  w.clock(258, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calHi),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  w.stack({ x: 104, y: 126, z: TZ, n: 4 }),
  cueG('doc', PLAN.svg + docMini),
  cueG('laptop', w.laptop({ x: 214, y: 140, z: TZ, toward: 1 })),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 262, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 232, y: 208, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
const hud = g('panel', `<rect class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '') + g('pBody', ''));

// Static paths with relative line-tos (the helper of pm.plan.schedule): the
// same points, fewer bytes; each rewrite is read back to prove it exact.
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
  { from: [150, 210, 1], to: [150, 200, 1.06] },
  { from: [150, 200, 1.06], to: [150, 190, 1.04] },
  { from: [150, 190, 1.04], to: [DOC_AT[0], DOC_AT[1], 1.1] },
  { from: [140, 170, 1.1], to: [140, 175, 1.04] },
  { from: [140, 175, 1.04], to: [130, 160, 1.1] },
  { from: [130, 160, 1.1], to: [150, 190, 1.03] },
  { from: [150, 190, 1.03], to: [150, 200, 1.07] },
  { from: [150, 200, 1.07], to: [100, 180, 1.1] },
  { from: [150, 190, 1.04], to: [DOC_AT[0], DOC_AT[1], 1.12] },
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(9).fill(30);
const C = { CELLS };
const spec = {
  id: 'pm.plan.wbs',
  title: { nl: 'Het werk opdelen en schatten', en: 'Breaking down and estimating the work' },
  lessons: [DONE, WBS, EST],
  scenes: [
    {
      id: 's1', lesson: DONE, level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Van wens naar doel', en: 'From wish to goal' },
      beats: [
        { nl: 'De klant wil minder verspilling. Dat is nog een wens, geen doel.', en: 'The client wants less waste. That is still a wish, not a goal.', focus: ['sponsor', 'wish'] },
        { nl: 'Eén zin: van X naar Y, voor wanneer, gemeten hoe.', en: 'One sentence: from X to Y, by when, measured how.', focus: 'goal' },
        { nl: 'Schrijf hem samen met de klant, in hun woorden. Lees hem hardop terug.', en: 'Write it together with the client, in their words. Read it back aloud.', focus: ['goal', 'jij', 'sponsor'] },
        { nl: 'Eerst een {t:Nulmeting|nulmeting}: {n:3.2}% afkeur, {n:2400} van {n:75000} kg per week.', en: 'First a {t:Baseline|baseline}: {n:3.2}% scrap, {n:2400} of {n:75000} kg a week.', cue: { Nulmeting: 'base' }, focus: 'base' },
        { nl: 'Geen data? Dan is twee weken meten je eerste resultaat.', en: 'No data? Then two weeks of measuring is your first deliverable.', focus: ['base', 'calendar'] },
        { nl: 'Doel: afkeur van {n:3.2} naar {n:2.0}% voor eind Q2, gemeten in de afkeurrapportage.', en: 'Goal: scrap {n:3.2} to {n:2.0}% by end of Q2, measured in the scrap report.', focus: 'goal' },
      ],
    },
    {
      id: 's2', lesson: DONE, level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Binnen en buiten', en: 'In and out' },
      beats: [
        { nl: '{t:Scope|Scope}: wat het werk omvat. Opstarten, instellingen, werkinstructies.', en: '{t:Scope|Scope}: what the work covers. Start-up, settings, work instructions.', cue: { Scope: 'scope' }, focus: 'scope' },
        { nl: '{t:Buiten scope|Buiten scope} is belangrijker: leverancier en recepturen. Wijs straks naar de lijst.', en: '{t:Out of scope|Out of scope} matters more: supplier and recipes. Point to the list later.', cue: { 'Buiten scope': 'out' }, focus: 'out' },
        { nl: '{t:Scope creep|Scope creep}: één redelijk verzoek tegelijk. Samen vreten ze je weken op.', en: '{t:Scope creep|Scope creep}: one reasonable request at a time. Together they eat your weeks.', cue: { 'Scope creep': 'creep' }, focus: 'creep' },
        { nl: 'Ruilen, of de sponsor geeft tijd erbij. “Wat laten we vallen?”', en: 'Swap it, or the sponsor adds time. “What do we drop?”', focus: ['trade', 'sponsor'] },
      ],
    },
    {
      id: 's3', lesson: DONE, level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Wanneer is het af?', en: 'When is it done?' },
      beats: [
        { nl: '{t:Acceptatiecriteria|Acceptatiecriteria}: wie tekent af, op welk bewijs, wanneer. Vier weken op rij.', en: '{t:Acceptance criteria|Acceptance criteria}: who signs off, on what evidence, when. Four weeks in a row.', cue: { Acceptatiecriteria: 'accept' }, focus: ['accept', 'calendar'] },
        { nl: 'Spreek het aan het begin af. Aan het eind herinnert iedereen het anders.', en: 'Agree it at the start. By the end everyone remembers it differently.', focus: ['accept', 'doc', 'sponsor'] },
        { nl: 'Een te ambitieus doel waar niemand in gelooft, wordt stilletjes genegeerd.', en: 'A stretch target nobody believes in gets quietly ignored.', focus: 'stretch' },
        { nl: 'Van {n:3.2} naar {n:2.0}%: {n:900} kg per week minder afkeur.', en: 'From {n:3.2} to {n:2.0}%: {n:900} kg a week less scrap.', focus: 'saved' },
      ],
    },
    {
      id: 's4', lesson: WBS, level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Resultaten, geen activiteiten', en: 'Deliverables, not activities' },
      beats: [
        { nl: 'Een netbeheerder: late afzeggingen binnen zes maanden van {n:18} naar onder {n:8}%.', en: 'A grid operator: last-week cancellations from {n:18} to under {n:8}% in six months.', focus: ['root', 'board'] },
        { nl: 'Begin bij een {t:Deliverable|deliverable}: een resultaat dat er straks is en dat je kunt controleren.', en: 'Start with a {t:Deliverable|deliverable}: something that exists at the end and can be checked.', cue: { Deliverable: 'deliv' }, focus: 'deliv' },
        { nl: 'Vier op de muur: nulmeting, gereedheidscheck, pilot van zes weken, overdracht.', en: 'Four on the wall: baseline, readiness check, six-week pilot, handover.', focus: ['deliv', 'note', 'teamlead', 'planner'] },
        { nl: 'Een {t:WBS|WBS}: het project bovenaan, de resultaten daaronder, de pakketten onderaan.', en: 'A {t:WBS|WBS}: the project on top, deliverables below, packages at the bottom.', cue: { WBS: 'wbs' }, focus: ['wbs', 'pkg'] },
        { nl: 'De 100%-regel van het PMI: al het werk in de boom, niets erbuiten.', en: 'The PMI’s 100% rule: all the work in the tree, nothing outside it.', focus: 'rule100' },
      ],
    },
    {
      id: 's5', lesson: WBS, level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Werkpakketten', en: 'Work packages' },
      beats: [
        { nl: 'Een {t:Werkpakket|werkpakket}: één persoon of een klein team kan het doen en afmaken.', en: 'A {t:Work package|work package}: one person or a small team can do and finish it.', cue: { Werkpakket: 'pkg' }, focus: 'pkg' },
        { nl: 'De {t:8–80-regel|8–80-regel}, een vuistregel: onder 8 uur micromanagement, boven 80 uur verrassingen.', en: 'The {t:8–80 rule|8–80 rule}, a rule of thumb: under 8 hours micromanagement, over 80 hides surprises.', cue: { '8–80-regel': 'hours' }, focus: 'hours' },
        { nl: 'Werkwoord, eigenaar en een {t:Definition of done|definition of done}: klaar als de planningsmanager akkoord is.', en: 'A verb, an owner, a {t:Definition of done|definition of done}: done when the planning manager agrees.', cue: { 'Definition of done': 'dod' }, focus: ['dod', 'pkg'] },
        { nl: 'Onder de nulmeting: {n:16}, {n:12} en {n:4} uur werk, elk met een eigenaar. {n:4} uur mag ook.', en: 'Under the baseline: {n:16}, {n:12} and {n:4} hours of work, each with an owner. {n:4} hours is fine too.', focus: ['pkg', 'note'] },
      ],
    },
    {
      id: 's6', lesson: WBS, level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Samen op de muur', en: 'Together on the wall' },
      beats: [
        { nl: 'Samen met wie het werk doet: post-its, één kolom per resultaat, {n:60} minuten.', en: 'With the people doing the work: sticky notes, one column per deliverable, {n:60} minutes.', focus: ['notes', 'teamlead', 'planner'] },
        { nl: 'Ze committeren zich, en zien wat jij vergat: schakelmonteurs briefen.', en: 'They commit, and spot what you forgot: brief the switching technicians.', focus: 'added' },
        { nl: 'Vaak vergeten: data-toegang, OR, toestemmingen, training, overdracht aan de lijn.', en: 'Often forgotten: data access, works council, permissions, training, handover.', focus: 'forgot' },
        { nl: '“Laten we gewoon beginnen.” Eens, deze week. Geef me één uur.', en: '“Let’s just start.” Agreed, this week. Give me one hour.', focus: ['talk', 'jij', 'sponsor'] },
        { nl: 'Snap je het werk niet: “Wat moet af zijn voordat jij kunt beginnen?”', en: 'Don’t understand the work? “What needs to be finished before you can start?”', focus: ['talk', 'teamlead'] },
      ],
    },
    {
      id: 's7', lesson: EST, level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Een bandbreedte, geen punt', en: 'A range, not a point' },
      beats: [
        { nl: 'Een {t:Bandbreedte|bandbreedte}: zes tot tien weken is eerlijker dan acht.', en: 'A {t:Range|range}: six to ten weeks is more honest than eight.', cue: { Bandbreedte: 'range' }, focus: 'range' },
        { nl: 'Een {t:Driepuntsschatting|driepuntsschatting}: optimistisch, meest waarschijnlijk, pessimistisch.', en: 'A {t:Three-point estimate|three-point estimate}: optimistic, most likely, pessimistic.', cue: { Driepuntsschatting: 'three' }, focus: 'three' },
        { nl: 'PERT: ({n:4} + 4 × {n:6} + {n:14}) / 6 = {n:7} dagen, meer dan {n:6}.', en: 'PERT: ({n:4} + 4 × {n:6} + {n:14}) / 6 = {n:7} days, more than {n:6}.', focus: ['three', 'note'] },
        { nl: 'De {t:Planning fallacy|planning fallacy}: studenten schatten {n:34} dagen, het werden er {n:56}.', en: 'The {t:Planning fallacy|planning fallacy}: students expected {n:34} days, it took {n:56}.', cue: { 'Planning fallacy': 'fallacy' }, focus: 'fallacy' },
        { nl: 'Vraag hoe lang vergelijkbare klussen echt duurden.', en: 'Ask how long similar jobs actually took.', focus: ['fallacy', 'note'] },
      ],
    },
    {
      id: 's8', lesson: EST, level: 1, dur: DURS[7], still: 0.9, title: { nl: 'Uren, weken en één buffer', en: 'Hours, weeks and one buffer' },
      beats: [
        { nl: '{t:Inspanning|Inspanning} is uren werk, {t:Doorlooptijd|doorlooptijd} is kalendertijd.', en: '{t:Effort|Effort} is hours of work, {t:Duration|duration} is calendar time.', cue: { Inspanning: 'effort', Doorlooptijd: 'dur' }, focus: ['effort', 'dur'] },
        { nl: '{n:16} uur bij {n:4} uur per week: vier weken. Vakanties tellen bij de doorlooptijd.', en: '{n:16} hours at {n:4} a week: four weeks. Holidays go on the duration.', focus: ['dur', 'calendar'] },
        { nl: 'Geen stiekeme marge in elke taak, maar één {t:Buffer|buffer}.', en: 'No hidden padding in every task, but one {t:Buffer|buffer}.', cue: { Buffer: 'buffer' }, focus: 'buffer' },
        { nl: 'Zichtbaar, aan het eind. Half op na een kwart? Een vroeg signaal.', en: 'Visible, at the end. Half gone at a quarter? An early warning.', focus: ['buffer', 'note', 'calendar'] },
      ],
    },
    {
      id: 's9', lesson: EST, level: 1, dur: DURS[8], still: 0.9, title: { nl: 'Drie dagen?', en: 'Three days?' },
      beats: [
        { nl: 'Een storingsanalyse. De engineer zegt: “Drie dagen.” Vraag naar het beste en slechtste geval.', en: 'A breakdown analysis. The engineer says: “Three days.” Ask for the best and worst case.', focus: ['talk', 'teamlead'] },
        { nl: 'Best {n:2} dagen, slechtst {n:10}: het systeem is gemigreerd.', en: 'Best {n:2} days, worst {n:10}: the system was migrated.', focus: 'range' },
        { nl: '({n:2} + 4 × {n:3} + {n:10}) / 6 = {n:4} dagen werk. Eén dag per week: zo’n {n:4} weken.', en: '({n:2} + 4 × {n:3} + {n:10}) / 6 = {n:4} days of work. One day a week: about {n:4} weeks.', focus: ['three', 'dur'] },
        { nl: 'In de planning: {n:2} tot {n:10} weken, waarschijnlijk {n:4}.', en: 'In the plan: {n:2} to {n:10} weeks, most likely {n:4}.', focus: ['note', 'doc', 'sponsor'] },
        { nl: 'Zelf onzeker? Een bandbreedte, wat hem kleiner maakt, en de datum waar je voor tekent.', en: 'Unsure yourself? A range, what would narrow it, and the date you commit to.', focus: ['note', 'jij'] },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: every point of the three lessons'
// teach text and worked examples (the checklist in the header), in about 760
// words a language, so the details that are no sentence of their own (names
// and years, the line 3 sentence, "month two") stand on the panel for the
// whole beat. No symbols the voice would read aloud: "plus" and "gedeeld door"
// for + and /, no quotes or parentheses. Words checked with espeak-ng phonemes
// through Piper's own bridge (nl_NL-alex), and reworded where it misreads:
// "deliverable" (dee-li-vee-ra-ble) and "definition of done" are said as
// "resultaat" and "een check wanneer het af is" (the captions carry the
// terms); "project" is stressed PRO-ject, so the voice says het werk, het doel
// or de looptijd (films/_kit/lexicon.nl.json now carries pro-JECT for the next
// render, 2026-11-12); PMI ("pmie"), Q2 ("ku twee"), ERP, Kahneman, Buehler and
// Parkinson (parkin-SON) stand on the panel only; "productiemanager" (PRO-duk-tie)
// is "de manager van de productie"; "datacheck" (data-gek) is "de check van de
// data"; "vuistregel" (vuistre-GEL) is "een grove regel", "stretch target" is reworded. SAY rules
// in films/_kit/timeline.mjs (2026-11-12, this film only says these words):
// scope and scope creep as skoop and kriep, werkpakket and nachtploeg split at
// the head (not in pm.plan.risk's "nachtploeg accepteert"); pilot, nulmeting, gereedheidscheck, mijlpaal and piekseizoen use
// the rules of pm.plan.schedule.
const SAY = [
  [ // s1 from wish to goal
    { nl: 'Een voedingsfabriek wil minder verspilling: een wens, nog geen doel.',
      en: 'A food plant wants less waste: a wish, not yet a goal.' },
    { nl: 'Schrijf het doel in één zin, met de klant: van waar, naar waar, voor wanneer, gemeten hoe.',
      en: 'Write the goal in one sentence, with the client: from where, to where, by when, measured how.' },
    { nl: 'Lees hem hardop terug, in hun woorden.',
      en: 'Read it back, in their words.' },
    { nl: 'Begin met een {t:Nulmeting|nulmeting}, de gemeten beginwaarde, anders wordt elk resultaat betwist. Hier: {n:3.2}% afkeur, {n:2400} kilo per week.',
      en: 'Start with a {t:Baseline|baseline}, the measured starting value, or every result gets disputed. Here: {n:3.2}% scrap, {n:2400} kilos a week.' },
    { nl: 'Geen data? Dan is twee weken meten je eerste resultaat. Ik weet het getal nog niet, en jij ook niet.',
      en: 'No data? Then two weeks of measuring is your first deliverable. I don\'t know the number yet, and neither do you.' },
    { nl: 'Doel: afkeur van {n:3.2} naar {n:2.0}%, voor eind juni, gemeten in de wekelijkse afkeurrapportage.',
      en: 'Goal: scrap from {n:3.2} to {n:2.0}% by end of June, measured in the weekly scrap report.' },
  ],
  [ // s2 in and out
    { nl: '{t:Scope|Scope} is wat het werk omvat: het opstarten, de machine-instellingen, de werkinstructies.',
      en: '{t:Scope|Scope} is what the work covers: start-up, machine settings, work instructions.' },
    { nl: 'Belangrijker is wat {t:Buiten scope|buiten scope} valt: de verpakkingsleverancier, de recepturen, en wat mensen gaan vragen. Daar wijs je straks naar.',
      en: 'What is {t:Out of scope|out of scope} matters more: the packaging supplier, the recipes, and what people will raise, to point to later.' },
    { nl: '{t:Scope creep|Scope creep}: het werk dijt uit, één redelijk verzoek tegelijk. Kun je ook even naar lijn 2 kijken?',
      en: '{t:Scope creep|Scope creep}: the work widens, one reasonable request at a time. Could you also look at line 2?' },
    { nl: 'Zeg niet alleen nee: goed idee, maar buiten de scope; we ruilen, of de sponsor geeft tijd. Wat laten we vallen?',
      en: 'Don\'t just say no: good idea, but out of scope; we swap, or the sponsor adds time. What do we drop?' },
  ],
  [ // s3 when is it done
    { nl: '{t:Acceptatiecriteria|Acceptatiecriteria}: wie tekent af, op welk bewijs, wanneer. Hier de manager van de productie, na vier weken op rij op {n:2.0}% of lager. Eén goede week kan toeval zijn.',
      en: '{t:Acceptance criteria|Acceptance criteria}: who signs off, on what evidence, when. Here the production manager, after four weeks in a row at {n:2.0}% or less. One good week can be luck.' },
    { nl: 'Spreek het aan het begin af; aan het eind herinnert iedereen het anders.',
      en: 'Agree it at the start; by the end, everyone remembers it differently.' },
    { nl: 'Experts verschillen: een extra ambitieus doel motiveert sommige teams, maar waar niemand in gelooft, wordt stilletjes genegeerd.',
      en: 'Experts differ: a stretch target motivates some teams, but one nobody believes in gets quietly ignored.' },
    { nl: 'Dit doel scheelt {n:900} kilo per week.',
      en: 'This goal saves {n:900} kilos a week.' },
  ],
  [ // s4 deliverables, not activities
    { nl: 'Nu opdelen. Een netbeheerder wil de late afzeggingen in zes maanden van {n:18} naar onder de {n:8}%.',
      en: 'Now the breakdown. A grid operator wants last-week cancellations from {n:18} to under {n:8}% in six months.' },
    { nl: 'Begin bij resultaten, niet bij activiteiten: wat is er straks, controleerbaar, dat er nu niet is? Vier tot zeven.',
      en: 'Start with deliverables, not activities: what will exist, checkable, that isn\'t there now? Four to seven.' },
    { nl: 'Met twee planners en de teamleider komen er vier op de muur: nulmeting, gereedheidscheck op vergunning, materiaal en ploeg, pilot van zes weken, overdracht.',
      en: 'With two planners and the team lead, four go on the wall: baseline, readiness check on permits, materials and crew, six-week pilot, handover.' },
    { nl: 'Zo ontstaat een {t:WBS|WBS}: het doel bovenaan, de resultaten daaronder, de werkpakketten met de activiteiten onderaan.',
      en: 'This makes a {t:WBS|WBS}: goal at the top, deliverables below, work packages with activities at the bottom.' },
    { nl: 'De 100%-regel: de takken dekken al het werk, en niets erbuiten. Wat er niet in staat, doet niemand.',
      en: 'The 100% rule: the branches cover all the work, nothing outside it. What isn\'t in it, nobody does.' },
  ],
  [ // s5 work packages
    { nl: 'Een {t:Werkpakket|werkpakket} kan één persoon of een klein team doen en afmaken.',
      en: 'One person or a small team can do and finish a {t:Work package|work package}.' },
    { nl: 'De {t:8–80-regel|8–80-regel}, een grove regel: onder zo\'n 8 uur is micromanagement, boven zo\'n 80 uur verbergt verrassingen, en kun je niet volgen.',
      en: 'The {t:8–80 rule|8–80 rule}, a rule of thumb: under about 8 hours is micromanagement, over about 80 hides surprises, and can\'t be tracked.' },
    { nl: 'Elk pakket krijgt een werkwoord, een eigenaar, en een check wanneer het af is, zoals akkoord van de planningsmanager.',
      en: 'Each package gets a verb, an owner, and a definition of done, like the planning manager agreeing.' },
    { nl: 'Onder de nulmeting: drie maanden data halen, {n:16} uur, de data-analist. Indelen met twee planners, {n:12} uur. Bespreken, {n:4} uur: kleiner, maar dat mag.',
      en: 'Under the baseline: extract three months of data, {n:16} hours, the data analyst. Classify with two planners, {n:12} hours. Review, {n:4} hours: smaller, but fine.' },
  ],
  [ // s6 together on the wall
    { nl: 'Deel samen op met wie het werk doet: post-its, een kolom per resultaat, zestig minuten.',
      en: 'Break it down with the people doing the work: sticky notes, a column per deliverable, sixty minutes.' },
    { nl: 'Mensen committeren zich aan wat ze zelf opdeelden, en zien wat jij vergat: hier schakelmonteurs briefen.',
      en: 'People commit to what they helped break down, and spot what you forgot: brief the switching technicians.' },
    { nl: 'Vaak vergeten: toegang tot data, de ondernemingsraad, toestemmingen, training van de nachtploeg, de overdracht aan de lijn.',
      en: 'Often forgotten: data access, the works council, permissions, training the night shift, the handover to the line.' },
    { nl: 'Laten we gewoon beginnen? Eens, deze week. Geef me één uur om te zien waar we ja tegen zeggen.',
      en: 'Let\'s just start? Agreed, this week. Give me one hour to see what we\'re signing up for.' },
    { nl: 'Snap je het werk niet, vraag de expert: wat moet er af zijn voordat jij kunt beginnen?',
      en: 'Don\'t understand the work? Ask the expert: what must be finished before you can start?' },
  ],
  [ // s7 a range, not a point
    { nl: 'Dan schatten. Geef een {t:Bandbreedte|bandbreedte}: zes tot tien weken is eerlijker dan acht, en toont de onzekerheid.',
      en: 'Then estimating. Give a {t:Range|range}: six to ten weeks is more honest than eight, and shows the uncertainty.' },
    { nl: 'Een {t:Driepuntsschatting|driepuntsschatting}: optimistisch, meest waarschijnlijk en pessimistisch.',
      en: 'A {t:Three-point estimate|three-point estimate}: optimistic, most likely and pessimistic.' },
    { nl: 'PERT, uit 1958, telt het middelste vier keer en deelt door zes. {n:4}, {n:6} en {n:14} dagen geeft {n:7}, meer dan {n:6}: er kan meer misgaan dan meezitten.',
      en: 'PERT, from 1958, counts the middle one four times and divides by six. {n:4}, {n:6} and {n:14} days gives {n:7}, more than {n:6}: more can go wrong than right.' },
    { nl: 'De {t:Planning fallacy|planning fallacy}: we schatten vanuit het beste geval. Studenten dachten {n:34} dagen voor hun scriptie; het werden er {n:56}.',
      en: 'The {t:Planning fallacy|planning fallacy}: we estimate from the best case. Students expected {n:34} days for their thesis; it took {n:56}.' },
    { nl: 'We vergeten het wachten en ons eigen werk. Vraag hoe lang vergelijkbare klussen echt duurden.',
      en: 'We forget the waiting and our normal job. Ask how long similar jobs actually took.' },
  ],
  [ // s8 hours, weeks and one buffer
    { nl: '{t:Inspanning|Inspanning} is uren werk; {t:Doorlooptijd|doorlooptijd} is kalendertijd. Een ploegleider heeft misschien {n:20}% van zijn week vrij.',
      en: '{t:Effort|Effort} is hours of work; {t:Duration|duration} is calendar time. A shift lead may have {n:20}% of his week free.' },
    { nl: 'Vraag de echte uren per week: {n:16} uur bij {n:4} per week is vier weken. Vakanties en piekseizoen tellen bij de doorlooptijd.',
      en: 'Ask the real hours a week: {n:16} hours at {n:4} a week is four weeks. Holidays and peak season go on the duration.' },
    { nl: 'Een {t:Buffer|buffer} vangt op wat misgaat. Stop geen stiekeme marge in elke taak: werk dijt uit tot de tijd op is.',
      en: 'A {t:Buffer|buffer} absorbs what goes wrong. Don\'t pad every task secretly: work expands to fill the time.' },
    { nl: 'Zet één zichtbare buffer aan het eind, of voor een harde mijlpaal. Half op na een kwart van de looptijd? Een vroeg signaal.',
      en: 'Put one visible buffer at the end, or before a hard milestone. Half gone a quarter of the way in? An early warning.' },
  ],
  [ // s9 three days?
    { nl: 'De onderhoudsman van een verpakkingsbedrijf zegt: drie dagen. Niet discussiëren; vraag het beste geval, en wat het langer maakt.',
      en: 'The maintenance engineer at a packaging plant says: three days. Don\'t argue; ask the best case, and what makes it longer.' },
    { nl: 'Best {n:2} dagen, als de export werkt. Slechtst {n:10}: het systeem is gemigreerd, de oude data is misschien rommelig.',
      en: 'Best {n:2} days, if the export works. Worst {n:10}: the system was migrated, the old data may be messy.' },
    { nl: '{n:2} plus vier keer {n:3} plus {n:10}, gedeeld door zes, is {n:4} dagen werk. Bij één dag per week: zo\'n {n:4} weken, geen {n:3} dagen.',
      en: '{n:2} plus four times {n:3} plus {n:10}, divided by six, is {n:4} days of work. One day a week: about {n:4} weeks, not {n:3} days.' },
    { nl: 'In de planning: {n:2} tot {n:10} weken, waarschijnlijk {n:4}. Na de eerste export hoort de sponsor welke kant het op gaat.',
      en: 'In the plan: {n:2} to {n:10} weeks, most likely {n:4}. After the first export, the sponsor hears which end it is.' },
    { nl: 'Weet je het zelf niet, geef een bandbreedte en wat hem kleiner maakt, en een directie de datum waar je voor tekent.',
      en: 'Don\'t know yourself? Give a range and what would narrow it, and a board the date you commit to.' },
  ],
];
// Each scene's length from its share of the Dutch narration, never shorter than
// its captions need; the whole about as long as the narration plus a short look
// per scene, within the 300 s cap (as pm.plan.risk).
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = SAY.map((sc) => sc.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * SAY.length);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
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
// no symbol the voice would read aloud, no spoken parenthesis or quote, and none
// of the words the Dutch voice misreads (see above)
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '');
  if (/[/&×=+()“”"‘<>≈→~]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /\b(IT|deadline|project|deliverable|definition of done|PMI|Q2|productiemanager|datacheck|vuistregel|stretch)\b/i.test(plain)) throw new Error(`narration: a word the Dutch voice misreads in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-col{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1}
.pm-pkg{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-note{fill:color-mix(in srgb,#E8C547 40%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-late{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:4 3}
.pm-slack{fill:color-mix(in srgb,var(--fp-accent) 14%,transparent);stroke:var(--fp-accent);stroke-width:1.6;stroke-dasharray:5 3}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-end{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:6 4}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-dot{fill:var(--anatomy-mid)}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-pkg,.pm-col,.pm-note,.pm-bar){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] .pm-slack{stroke-width:2.4}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-end{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-late{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini text{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini :is(.pm-card,.pm-crit,.pm-arrow,.pm-link,.pm-slack,.pm-late,.pm-pkg,.pm-col,.pm-note,.pm-bar){stroke-width:.7px}
.pm-mini :is(.pm-axis,.pm-end,.pm-dia){stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard, een klok en een stopcontact; aan de zijwand een kalenderstrook met weken. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van een vergadertafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel een stapel papier, een laptop, twee kopjes en een A4. Rechts een paneel, gemarkeerd als voorbeeld of schema: de doelzin met vier vakken, de nulmeting van 3,2% afkeur, scope binnen en buiten met verzoeken die binnensluipen, vier weken onder de lijn van 2,0%, de WBS als boom met vier resultaten en werkpakketten, de 8–80-regel, post-its op de muur, een bandbreedte van zes tot tien weken, een driepuntsschatting, uren die over weken verdeeld worden, één buffer aan het eind, en de schatting van 2 tot 10 dagen.',
  en: 'A meeting room. On the back wall a whiteboard, a clock and a socket; on the side wall a calendar strip of weeks. You, the consultant in petrol, stand at the board. The team lead stands at the left end of a meeting table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table a stack of paper, a laptop, two cups and a page. At the right a panel, marked as an example or a diagram: the goal sentence in four slots, the 3.2% scrap baseline, scope in and out with requests creeping in, four weeks under the 2.0% line, the WBS as a tree of four deliverables and work packages, the 8–80 rule, sticky notes on the wall, a range of six to ten weeks, a three-point estimate, hours spread over weeks, one buffer at the end, and the estimate of 2 to 10 days.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  for (const s of data.scenes) console.log(`  ${s.id}: nl ${s.beats.reduce((n, b) => n + b.voice.nl.split(/\s+/).length, 0)} en ${s.beats.reduce((n, b) => n + b.voice.en.split(/\s+/).length, 0)}`);
}

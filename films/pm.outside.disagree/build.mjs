// Dev tool, not shipped. Builds the explainer film "Oneens en overbezet /
// Disagreement and busy experts" for the Projects course module "Projecten
// leiden buiten je vakgebied" (pm.outside), topic Werken met experts:
// pm.outside.disagree (level 2, "Als experts het oneens zijn") and
// pm.outside.time (level 3, "Hun tijd en motivatie"), the two lessons of the
// topic that pm.outside.experts does not serve.
//
//   node films/pm.outside.disagree/build.mjs            build the page
//   node films/pm.outside.disagree/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.outside.disagree.html: one offline page
// with the anatomy kit, the stage script and the player inlined. The film will
// be rendered to video, so all stage and card text is 22 font-size units (the
// kit default for video films, films/_kit/build-film.mjs; as in
// pm.outside.experts and pm.outside.steering, the same module).
// Storyboard: not a row of docs/superpowers/plans/2026-11-07-v14-explainer-films.md,
// 3.9; the topic's row (pm.outside.experts) served two of its four lessons, and
// this film serves the other two, because a lesson with a film no longer shows
// its worked example (v16 notes). Nine scenes (the kit's maximum) and about
// five minutes: structure the decision, criteria, fact and judgement (s1, two
// cards), the weighted score (s2), the second opinion and the failures (s3,
// two cards), the transformer (s4); scarce experts and context switching (s5),
// blocks, preparation and the timebox (s6), motivation and what you do with it
// (s7, two cards), earning their attention (s8) and the safety specialist on
// four projects (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here),
// the room of pm.outside.experts: a meeting room with a whiteboard (it repeats
// the panel in miniature), a wall clock and a calendar strip of twelve week
// cells on the side wall (the weeks a stuck decision drags on, two fixed days a
// week, the Thursday timebox, the fixed day every two weeks and the two half
// days for the safety test), a table with a sheet (the decision criteria, the
// prepared questions, the prepared day), and the recurring cast: "jij" the
// consultant in petrol at the front of the table, the team lead at the left end
// and the planner with a tablet behind the table (the two experts who disagree:
// the factory's engineer and the installer; in the time lesson the team lead is
// the busy expert), and the sponsor at the right end. A panel at the right, in
// stage space, carries one card per scene (two in s1, s3 and s7), labelled
// "schema" (a general picture) or "voorbeeld" (the worked examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// calendar strip and the sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries
// it, on screen at least 4 s):
//   disagree teach 1: you can't judge the content, but you can structure the
//     decision (s1 b1); most disagreements are not about facts but different
//     assumptions or different priorities (s1 b2); step one, the decision
//     criteria on the table before the options: cost, risk, time, quality, how
//     easy to maintain (s1 b3, the sheet)
//   disagree teach 2: separate fact from judgement; a fact can be checked, the
//     transformer is 42 years old; a judgement is an expert's assessment, it will
//     probably last another ten years (s1 b4); disagreements usually sit in the
//     judgements (s1 b5); ask each expert "what would change your mind?", it shows
//     what the disagreement rests on (s1 b6)
//   disagree teach 3: a weighted score with several criteria: a weight per
//     criterion, score each option (s2 b1); multiply and add up, not magic (s2
//     b2); the weights a business choice, not a technical one, set with the
//     sponsor (s2 b3); its real value: where the options differ (s2 b4), whether
//     the outcome changes if a weight moves a little (s2 b5)
//   disagree teach 4: a second opinion, an independent view from an expert
//     outside the argument, for big choices hard to undo (s3 b1); brief the
//     question and the criteria, not who said what (s3 b2); ask each expert to
//     state the other's position so well that the other agrees; it cools down and
//     often shows they are closer than it sounded (s3 b3)
//   disagree teach 5: failures: seniority, who talks loudest, splitting the
//     difference into a solution neither believes in (s3 b4); letting it drag
//     while the project waits (s3 b5, the calendar); "if we chose your colleague's
//     option, what exactly would go wrong, and how likely is that?", opinions
//     become risks you can compare (s3 b6)
//   disagree example: a grid project at a factory; the factory's electrical
//     engineer wants to keep and service the old transformer, the installer to
//     replace it (s4 b1); step 1 criteria with the sponsor: cost over 10 years,
//     risk of unplanned outage, downtime during the work (s4 b2); step 2 fact,
//     the oil test shows rising moisture; judgement, 10 years against within 5
//     (s4 b3); step 3 what would change your mind: a worse oil test next year, a
//     clean test (s4 b4); step 4 a second opinion from an independent test
//     company on the oil results (s4 b5); it supports replacing within 3 years,
//     the sponsor plans it in next summer's shutdown (s4 b6)
//   time teach 1: experts the scarcest resource, few can do the work, many
//     projects want them (s5 b1); the plan only as real as their availability
//     (s5 b2); context switching, moving between tasks or projects and losing
//     time getting back in (s5 b3); Gerald Weinberg, 1992, a rule of thumb: on
//     two projects about a fifth lost to switching (s5 b4), on five up to three
//     quarters (s5 b5); a rough guide, not a measurement (s5 b6)
//   time teach 2: blocks, not percentages, Tuesday and Thursday beats 40% (s6
//     b1, the calendar); prepare so their hours count: questions written down,
//     data ready, decisions lined up (s6 b2, the sheet); not into meetings where
//     they're not needed, a two-line summary instead (s6 b3); a timebox, a fixed
//     slot for a task that ends when the time is up (s6 b4); two hours on
//     Thursday to decide the interface design (s6 b5, the calendar)
//   time teach 3: Daniel Pink, Drive, 2009, building on the self-determination
//     theory of the psychologists Edward Deci and Richard Ryan: three drivers for
//     knowledge work (s7 b1); autonomy, control over how you do the work (s7
//     b2); mastery, getting better at something that matters to you (s7 b3);
//     purpose, seeing what the work is for (s7 b4)
//   time teach 4: autonomy over the how, firm on the what and when (s7 b5); the
//     problem, not just the task: the operators lose 20 minutes a shift, your
//     interface fixes it (s7 b6); credit their work by name in front of the
//     sponsor (s7 b7); what kills motivation: changing priorities without
//     explanation, meetings without purpose, advised decisions overruled
//     without being told why (s7 b8)
//   time teach 5: the failure, the expert's manager as the only lever (s8 b1);
//     the manager allocates hours, you earn their attention (s8 b2); "what would
//     make this project worth your time?" at the start (s8 b3); an interesting
//     problem, a clean handover, not being called at night (s8 b4); remember the
//     answer (s8 b5)
//   time example (faded): a robot cell; the supplier's only safety specialist
//     is on four projects and keeps missing your sessions (s9 b1); about 40 hours
//     needed over 8 weeks; his manager says 25% (s9 b2); the ask, how to secure
//     his time and attention; on paper 25% of 8 weeks of 40 hours is 80 hours
//     (s9 b3); Weinberg's rough table, about 10% for each of four projects, the
//     rest switching: about 32 hours, short of the 40 (s9 b4); blocks: one fixed
//     8-hour day every two weeks, 4 days, 32 hours (s9 b5, the calendar); plus two
//     half days for the safety test, 8 hours, booked now: 40 hours of
//     concentrated time (s9 b6, the calendar); prepare each day: questions,
//     drawings, decisions ready, no hour wasted (s9 b7, the sheet); ask what
//     would make it worth his while, perhaps fewer late calls from the site; then
//     credit his work by name in the steering meeting (s9 b8)
//
// Facts as in the lessons, checked against the sources: Gerald M. Weinberg,
// Quality Software Management, Vol. 1: Systems Thinking (Dorset House, 1992),
// gives a table of time per project against the number of projects: one
// project 100%, two 40% each (20% lost to switching), three 20%, four 10% each
// (60% lost), five 5% each (75% lost). The film states only the lesson's
// points (a fifth on two, up to three quarters on five, about 10% each on
// four) and calls it a rough rule, as the lesson does. Daniel H. Pink, Drive:
// The Surprising Truth About What Motivates Us (Riverhead, 2009), names
// autonomy, mastery and purpose and builds on the self-determination theory of
// Edward L. Deci and Richard M. Ryan (whose own three needs are autonomy,
// competence and relatedness; the film credits the three drivers to Pink). The
// decision criteria, fact and judgement, the weighted score, the second
// opinion, stating the other's position, the timebox and the sharp questions
// are the lessons' and credited to no one, as in the lessons. Terms worded as
// in the sibling films: second opinion (pm.outside.steering's card), sponsor,
// steering meeting (stuurgroep), and Weinberg's rule as in pm.portfolio.prioritise.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The lesson text the film shows, asserted against the lessons' current text
// (the build fails if one drifts); {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const DG = 'pm.outside.disagree';
const TI = 'pm.outside.time';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const says = (id, list, lang = 'nl') => {
  const l = lessons[lang].get(id);
  const t = [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n');
  for (const s of list) assert(t.includes(s), `${id} ${lang} no longer says "${s}"`);
};
says(DG, ['Als twee experts het oneens zijn, kun je de inhoud niet beoordelen, maar wel het besluit structureren',
  'De meeste meningsverschillen tussen experts gaan niet over feiten; ze gaan over andere aannames of andere prioriteiten',
  'zet de besliscriteria op tafel vóór de opties', 'kosten, risico, tijd, kwaliteit, hoe makkelijk het te onderhouden is',
  'Scheid dan feit en oordeel', '“de transformator is 42 jaar oud”', '“hij gaat waarschijnlijk nog tien jaar mee”', 'Meningsverschillen zitten meestal in de oordelen',
  '“Wat zou jou van mening doen veranderen?” Dat laat zien waar het meningsverschil echt op rust',
  'geef elk criterium een gewicht, scoor elke optie, vermenigvuldig en tel op', 'Het is geen toverij', 'de gewichten zijn een zakelijke keuze, geen technische, dus stel ze vast met de sponsor',
  'het laat zien waar de opties verschillen, en of de uitkomst verandert als een gewicht een beetje verschuift',
  'Een second opinion is een onafhankelijke kijk van een expert buiten de discussie', 'grote keuzes die moeilijk terug te draaien zijn', 'de vraag en de criteria mee, niet wie wat zei',
  'vraag elke expert het standpunt van de ander zo goed te verwoorden dat die ander het ermee eens is', 'Dat koelt af en laat vaak zien dat ze dichter bij elkaar zitten dan het klonk',
  'beslissen op senioriteit, op wie het hardst praat, of het verschil delen in een oplossing waar geen van beide experts in gelooft', 'het laten slepen, terwijl het project wacht',
  '“Als we de optie van je collega kozen, wat zou er dan precies misgaan, en hoe waarschijnlijk is dat?” Zo worden meningen risico’s die je kunt vergelijken',
  'Netproject bij een fabriek', 'wil de oude transformator houden en reviseren; de installateur wil hem vervangen',
  'kosten over 10 jaar, risico op ongeplande uitval, stilstand tijdens het werk', 'de olietest laat stijgend vocht zien', '“hij gaat nog 10 jaar mee” tegenover “hij kan binnen 5 jaar uitvallen”',
  '“Een slechtere olietest volgend jaar.” De installateur: “Een schone test.”', 'een second opinion van een onafhankelijk testbureau op de olieresultaten',
  'De second opinion steunt vervangen binnen 3 jaar; de sponsor plant het in de zomerstop van volgend jaar']);
says(TI, ['Experts zijn meestal het schaarste middel in een project: weinig mensen kunnen het werk en veel projecten willen ze', 'Je planning is maar zo echt als hun beschikbaarheid',
  'Contextwisseling (context switching) is wisselen tussen taken of projecten, en tijd verliezen om er weer in te komen',
  'Gerald Weinberg (1992) gaf een vuistregel: op twee projecten verliest iemand ongeveer een vijfde van zijn tijd aan wisselen; op vijf kan het verlies naar driekwart gaan. Een grove richtlijn, geen meting',
  'vraag om blokken, niet om percentages. “Dinsdag en donderdag” is beter dan “40%”', 'vragen opgeschreven, data klaar, besluiten op een rij',
  'Haal ze niet naar overleggen waar ze niet nodig zijn; stuur in plaats daarvan een samenvatting van twee regels',
  'Een timebox, een vast tijdslot voor een taak dat stopt als de tijd om is', '“Twee uur op donderdag om het koppelingsontwerp te besluiten.”',
  'Daniel Pink (Drive, 2009), voortbouwend op de zelfdeterminatietheorie van de psychologen Edward Deci en Richard Ryan, noemt drie drijfveren voor kenniswerk: autonomie, meesterschap en zingeving',
  'Autonomie is zeggenschap over hoe je het werk doet. Meesterschap is beter worden in iets wat je belangrijk vindt. Zingeving is zien waar het werk voor is',
  'geef autonomie over het hoe, en wees stevig over het wat en wanneer', '“De operators verliezen hier 20 minuten per dienst aan; jouw koppeling lost dat op.”',
  'Noem hun werk bij naam waar de sponsor bij is', 'prioriteiten veranderen zonder uitleg, overleggen zonder doel, en besluiten waarover ze adviseerden die zonder uitleg anders uitvallen',
  'de manager van de expert als enige hefboom zien. Zijn manager verdeelt de uren; zijn aandacht moet je verdienen', '“Wat zou dit project jouw tijd waard maken?”',
  'De een wil een interessant probleem, de ander een nette overdracht, weer een ander gewoon niet ’s nachts gebeld worden. Onthoud dan het antwoord',
  'Robotcelproject. De enige veiligheidsspecialist van de leverancier zit op vier projecten en mist steeds jouw sessies', 'ongeveer 40 uur van hem nodig', '“Hij zit voor 25% op jouw project.”',
  'iemand op vier projecten maar ongeveer 10% van zijn tijd per project', 'Hoe regel je zijn tijd en zijn aandacht?',
  'Op papier is 25% van 8 weken × 40 uur 80 uur', 'ongeveer 32 uur, minder dan de 40 die je nodig hebt',
  'één vaste dag van 8 uur per twee weken (4 dagen, 32 uur), plus twee halve dagen voor de veiligheidstest (8 uur), nu ingepland', 'Samen 40 uur aan geconcentreerde tijd',
  'vragen, tekeningen en besluiten klaar, zodat er geen uur verloren gaat', 'misschien minder late telefoontjes van de bouwplaats', 'Noem zijn werk daarna bij naam in de stuurgroep']);
says(DG, ['the transformer is 42 years old', 'cost over 10 years', '“it may fail within 5”', 'replacing within 3 years'], 'en');
says(TI, ['Gerald Weinberg (1992)', 'about a fifth', 'three quarters', 'Daniel Pink (Drive, 2009)', 'one fixed 8-hour day every two weeks (4 days, 32 hours)', 'two half days for the safety test (8 hours)'], 'en');
// the transformer: 42 years old; 10 years against 5; replace within 3
const TR = { age: 42, keep: 10, fail: 5, replace: 3 };
// the safety specialist: 40 h needed in 8 weeks of 40 h; 25 % on paper, 10 % after switching (Weinberg, four projects)
const SP = { need: 40, weeks: 8, week: 40, paper: 25, real: 10, day: 8, every: 2, half: 4 };
SP.onPaper = (SP.paper / 100) * SP.weeks * SP.week;
SP.afterSwitch = (SP.real / 100) * SP.weeks * SP.week;
SP.days = SP.weeks / SP.every;
SP.blocks = SP.days * SP.day;
SP.test = 2 * SP.half;
assert(SP.onPaper === 80, '25 % of 8 weeks of 40 hours is 80 hours');
assert(SP.afterSwitch === 32, '10 % of 8 weeks of 40 hours is 32 hours');
assert(SP.days === 4 && SP.blocks === 32, 'a fixed 8-hour day every two weeks in 8 weeks: 4 days, 32 hours');
assert(SP.test === 8 && SP.blocks + SP.test === SP.need, 'two half days are 8 hours; 32 + 8 = the 40 hours needed');
// Weinberg's table (1992): share of the time lost to switching on 2 and 5 projects, as the lesson states it
const WB = { two: 20, five: 75 };

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

const WEEKS = 12;
const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
// tall cells: the side wall is seen edge-on, so the height carries the strip at 390 px
const CAL = w.calendar({ y0: 30, z0: 104, weeks: WEEKS, cw: 15.6, ch: 46 });
const TABLE = { x: 96, y: 112, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 150, y: 146, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([160, 161, TZ]).map((v) => Math.round(v * 10) / 10);
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
const CELLS = Array.from({ length: WEEKS }, (_, i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;
// the cast: who stands where (world cm), as in pm.outside.experts
const SPOT = {
  planner: { x: 176, y: 80, along: 'x' },
  teamlead: { x: 72, y: 150, along: 'y' },
  sponsor: { x: 272, y: 150, along: 'y' },
  jij: { x: 172, y: 222, along: 'x' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map((v) => Math.round(v * 10) / 10)]));

const person = (role) => w.person({ ...SPOT[role], role });
const world = [
  w.room(ROOM),
  w.clock(266, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calMarks),
  person('planner'),
  w.chair({ x: 128, y: 98, back: -1 }),
  w.chair({ x: 224, y: 98, back: -1 }),
  person('teamlead'),
  w.table(TABLE),
  w.stack({ x: 104, y: 120, z: TZ, n: 3 }),
  cueG('sheet', SHEET.svg + sheetLines),
  w.laptop({ x: 214, y: 134, z: TZ, toward: -1 }),
  w.cup(196, 172, TZ),
  w.cup(232, 166, TZ),
  person('sponsor'),
  person('jij'),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; every block of a
// card sits in its own cue group, so each beat's focus lights the block it
// explains.
const PX = 322;
const PW = 308;
const CUES = ['structure', 'causes', 'criteria', 'judge', 'where', 'mind',
  'score', 'sum', 'weights', 'differ', 'shift',
  'second', 'brief', 'restate', 'fails', 'drag', 'ask',
  'case', 'step1', 'step2', 'step3', 'step4', 'outcome',
  'scarce', 'real', 'switch', 'weinberg', 'five', 'rough',
  'blocks', 'prep', 'meet', 'box', 'boxex',
  'pink', 'auto', 'mast', 'purp', 'how', 'problem', 'credit', 'kills',
  'lever', 'earn', 'worth', 'answers', 'remember',
  'case2', 'need', 'paper', 'cut', 'blocks2', 'test', 'prep2', 'ask2'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.land.handover and pm.outside.experts): the same points, fewer bytes;
// each rewrite is read back.
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
const CAL_AT = w.at([0, 120, 150]).map((v) => Math.round(v * 10) / 10);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const toward = (p, s) => [p[0], p[1] + 40, s];
const SH = SHEET_AT;
const CAM = [
  { from: [160, 205, 1], to: toward(mid(HEAD.teamlead, HEAD.planner), 1.1) },
  { from: [160, 205, 1.02], to: toward(HEAD.sponsor, 1.08) },
  { from: toward(mid(HEAD.teamlead, HEAD.planner), 1.04), to: toward(HEAD.jij, 1.1) },
  { from: [160, 205, 1], to: toward(mid(HEAD.planner, HEAD.sponsor), 1.08) },
  { from: [160, 205, 1], to: toward(HEAD.teamlead, 1.1) },
  { from: [160, 205, 1.02], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: toward(HEAD.teamlead, 1.04), to: toward(mid(HEAD.teamlead, HEAD.jij), 1.1) },
  { from: toward(HEAD.jij, 1.02), to: toward(mid(HEAD.teamlead, HEAD.jij), 1.1) },
  { from: [160, 205, 1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.08] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, WEEKS, TR, SP, WB };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.outside.disagree',
  title: { nl: 'Oneens en overbezet', en: 'Disagreement and busy experts' },
  lessons: [DG, TI],
  strictFocus: true,
  scenes: [
    sc('s1', DG, 2, { nl: 'Structuur, geen inhoud', en: 'Structure, not content' }, [
      { nl: 'Experts oneens: de inhoud beoordeel je niet, het besluit structureren wel.', en: 'Experts disagree: you can’t judge the content, but you can structure the decision.', focus: ['structure', 'teamlead', 'planner'] },
      { nl: 'Meestal niet over feiten, maar over andere aannames of andere prioriteiten.', en: 'Mostly not about facts, but about different assumptions or priorities.', focus: 'causes' },
      { nl: 'Stap één: de {t:Besliscriteria|besliscriteria} vóór de opties: kosten, risico, tijd, kwaliteit, onderhoud.', en: 'Step one: the {t:Decision criteria|decision criteria} before the options: cost, risk, time, quality, upkeep.', cue: { Besliscriteria: 'criteria' }, focus: ['criteria', 'sheet'] },
      { nl: 'Feit of {t:Oordeel|oordeel}: “{n:42} jaar oud” is te controleren; “nog tien jaar mee” niet.', en: 'Fact or {t:Judgement|judgement}: “{n:42} years old” can be checked; “ten more years” can’t.', cue: { Oordeel: 'judge' }, focus: 'judge' },
      { nl: 'Meningsverschillen zitten meestal in de oordelen.', en: 'Disagreements usually sit in the judgements.', focus: 'where' },
      { nl: 'Vraag elke expert: “Wat zou jou van mening doen veranderen?”', en: 'Ask each expert: “What would change your mind?”', focus: ['mind', 'jij'] },
    ]),
    sc('s2', DG, 2, { nl: 'Een gewogen score', en: 'A weighted score' }, [
      { nl: 'Een {t:Gewogen score|gewogen score}: elk criterium een gewicht, elke optie een score.', en: 'A {t:Weighted score|weighted score}: a weight for each criterion, a score for each option.', cue: { 'Gewogen score': 'score' }, focus: 'score' },
      { nl: 'Vermenigvuldig en tel op. Geen toverij.', en: 'Multiply and add up. It’s not magic.', focus: 'sum' },
      { nl: 'De gewichten zijn een zakelijke keuze: stel ze vast met de sponsor.', en: 'The weights are a business choice: set them with the sponsor.', focus: ['weights', 'sponsor'] },
      { nl: 'De echte waarde: je ziet waar de opties verschillen,', en: 'The real value: you see where the options differ,', focus: 'differ' },
      { nl: 'en of de uitkomst verandert als een gewicht een beetje verschuift.', en: 'and whether the outcome changes if a weight moves a little.', focus: 'shift' },
    ]),
    sc('s3', DG, 2, { nl: 'Een second opinion', en: 'A second opinion' }, [
      { nl: 'Een {t:Second opinion|second opinion}: een onafhankelijke expert buiten de discussie.', en: 'A {t:Second opinion|second opinion}: an independent expert outside the argument.', cue: { 'Second opinion': 'second' }, focus: 'second' },
      { nl: 'Geef de vraag en de criteria mee, niet wie wat zei.', en: 'Brief the question and the criteria, not who said what.', focus: 'brief' },
      { nl: 'Laat elk het standpunt van de ander verwoorden, tot die ander het ermee eens is.', en: 'Have each state the other’s position until the other agrees.', focus: ['restate', 'teamlead', 'planner'] },
      { nl: 'Fouten: beslissen op senioriteit, op wie het hardst praat, of het verschil delen.', en: 'Failures: deciding by seniority, by who talks loudest, or splitting the difference.', focus: 'fails' },
      { nl: 'Of het laten slepen, terwijl het project wacht.', en: 'Or letting it drag on while the project waits.', focus: ['drag', 'calendar'] },
      { nl: '“De optie van je collega: wat gaat er mis, en hoe waarschijnlijk?”', en: '“Your colleague’s option: what goes wrong, and how likely?”', focus: ['ask', 'jij'] },
    ]),
    sc('s4', DG, 2, { nl: 'Reviseren of vervangen', en: 'Service or replace' }, [
      { nl: 'Fabriek: de eigen engineer wil reviseren, de installateur vervangen.', en: 'Factory: its own engineer wants to service, the installer to replace.', focus: ['case', 'teamlead', 'planner'] },
      { nl: 'Stap 1, met de sponsor: kosten over {n:10} jaar, risico op uitval, stilstand.', en: 'Step 1, with the sponsor: cost over {n:10} years, outage risk, downtime.', focus: ['step1', 'sponsor'] },
      { nl: 'Stap 2: feit, stijgend vocht in de olie. Oordeel: {n:10} jaar tegenover {n:5}.', en: 'Step 2: fact, rising moisture in the oil. Judgement: {n:10} years versus {n:5}.', focus: 'step2' },
      { nl: 'Stap 3: wat verandert je mening? Een slechtere of een schone olietest.', en: 'Step 3: what would change your mind? A worse or a clean oil test.', focus: ['step3', 'teamlead', 'planner'] },
      { nl: 'Stap 4: een second opinion van een onafhankelijk testbureau.', en: 'Step 4: a second opinion from an independent test company.', focus: 'step4' },
      { nl: 'Vervangen binnen {n:3} jaar; de sponsor plant het in de zomerstop van volgend jaar.', en: 'Replace within {n:3} years; the sponsor plans it for next summer’s shutdown.', focus: ['outcome', 'sponsor'] },
    ]),
    sc('s5', TI, 3, { nl: 'Schaars, en wisselen kost tijd', en: 'Scarce, and switching costs time' }, [
      { nl: 'Experts zijn schaars: weinig mensen kunnen het, veel projecten willen ze.', en: 'Experts are scarce: few can do the work, many projects want them.', focus: ['scarce', 'teamlead'] },
      { nl: 'Je planning is maar zo echt als hun beschikbaarheid.', en: 'Your plan is only as real as their availability.', focus: ['real', 'calendar'] },
      { nl: '{t:Contextwisseling}: wisselen tussen taken, en tijd verliezen om er weer in te komen.', en: '{t:Context switching}: moving between tasks, and losing time getting back in.', cue: { Contextwisseling: 'switch' }, focus: 'switch' },
      { nl: 'Gerald Weinberg, 1992: op twee projecten gaat ongeveer een vijfde op aan wisselen.', en: 'Gerald Weinberg, 1992: on two projects about a fifth goes on switching.', focus: 'weinberg' },
      { nl: 'Op vijf kan het verlies naar driekwart gaan.', en: 'On five, the loss can approach three quarters.', focus: 'five' },
      { nl: 'Een grove richtlijn, geen meting.', en: 'A rough guide, not a measurement.', focus: 'rough' },
    ]),
    sc('s6', TI, 3, { nl: 'Blokken en een timebox', en: 'Blocks and a timebox' }, [
      { nl: 'Blokken, geen percentages: “dinsdag en donderdag” is beter dan “{n:40}%”.', en: 'Blocks, not percentages: “Tuesdays and Thursdays” beats “{n:40}%”.', focus: ['blocks', 'calendar'] },
      { nl: 'Bereid voor: vragen opgeschreven, data klaar, besluiten op een rij.', en: 'Prepare: questions written down, data ready, decisions lined up.', focus: ['prep', 'sheet'] },
      { nl: 'Niet nodig in een overleg? Stuur een samenvatting van twee regels.', en: 'Not needed in a meeting? Send a two-line summary.', focus: 'meet' },
      { nl: 'Een {t:Timebox|timebox}: een vast tijdslot voor een taak, dat stopt als de tijd om is.', en: 'A {t:Timebox|timebox}: a fixed slot for a task that ends when the time is up.', cue: { Timebox: 'box' }, focus: 'box' },
      { nl: '“Twee uur op donderdag om het koppelingsontwerp te besluiten.”', en: '“Two hours on Thursday to decide the interface design.”', focus: ['boxex', 'calendar'] },
    ]),
    sc('s7', TI, 3, { nl: 'Motivatie', en: 'Motivation' }, [
      { nl: 'Daniel Pink, Drive, 2009, op basis van Deci en Ryan: drie drijfveren.', en: 'Daniel Pink, Drive, 2009, building on Deci and Ryan: three drivers.', focus: 'pink' },
      { nl: '{t:Autonomie}: zeggenschap over hoe je het werk doet.', en: '{t:Autonomy}: control over how you do the work.', cue: { Autonomie: 'auto' }, focus: 'auto' },
      { nl: '{t:Meesterschap}: beter worden in iets wat je belangrijk vindt.', en: '{t:Mastery}: getting better at something that matters to you.', cue: { Meesterschap: 'mast' }, focus: 'mast' },
      { nl: '{t:Zingeving}: zien waar het werk voor is.', en: '{t:Purpose}: seeing what the work is for.', cue: { Zingeving: 'purp' }, focus: 'purp' },
      { nl: 'Autonomie over het hoe; stevig over het wat en wanneer.', en: 'Autonomy over the how; firm on the what and when.', focus: ['how', 'teamlead'] },
      { nl: 'Het probleem, niet alleen de taak: {n:20} minuten per dienst kwijt.', en: 'The problem, not just the task: {n:20} minutes lost a shift.', focus: 'problem' },
      { nl: 'Noem hun werk bij naam waar de sponsor bij is.', en: 'Credit their work by name in front of the sponsor.', focus: ['credit', 'sponsor'] },
      { nl: 'Wat motivatie sloopt: veranderen zonder uitleg, overleg zonder doel.', en: 'What kills it: changes without explanation, meetings without purpose.', focus: 'kills' },
    ]),
    sc('s8', TI, 3, { nl: 'Hun aandacht verdienen', en: 'Earning their attention' }, [
      { nl: 'Fout: de manager van de expert als enige hefboom zien.', en: 'A failure: treating the expert’s manager as the only lever.', focus: ['lever', 'teamlead'] },
      { nl: 'Zijn manager verdeelt de uren; zijn aandacht moet je verdienen.', en: 'Their manager allocates hours; you earn their attention.', focus: 'earn' },
      { nl: 'Vraag bij de start: “Wat zou dit project jouw tijd waard maken?”', en: 'Ask at the start: “What would make this project worth your time?”', focus: ['worth', 'jij'] },
      { nl: 'Een interessant probleem, een nette overdracht, of niet ’s nachts gebeld worden.', en: 'An interesting problem, a clean handover, or not being called at night.', focus: ['answers', 'teamlead'] },
      { nl: 'Onthoud dan het antwoord.', en: 'Then remember the answer.', focus: 'remember' },
    ]),
    sc('s9', TI, 3, { nl: 'Een specialist op vier projecten', en: 'A specialist on four projects' }, [
      { nl: 'Robotcel: de enige veiligheidsspecialist zit op vier projecten.', en: 'A robot cell: the only safety specialist is on four projects.', focus: ['case2', 'teamlead'] },
      { nl: 'Nodig: {n:40} uur in {n:8} weken. Zijn manager: “{n:25}%.”', en: 'Needed: {n:40} hours in {n:8} weeks. His manager: “{n:25}%.”', focus: 'need' },
      { nl: 'Op papier: {n:25}% van {n:8} weken van {n:40} uur is {n:80} uur.', en: 'On paper: {n:25}% of {n:8} weeks of {n:40} hours is {n:80} hours.', focus: 'paper' },
      { nl: 'Weinberg: op vier projecten {n:10}% per project, dus {n:32} uur. Te weinig.', en: 'Weinberg: {n:10}% each on four projects, so {n:32} hours. Too few.', focus: 'cut' },
      { nl: 'Blokken: één vaste dag van {n:8} uur per twee weken: {n:32} uur.', en: 'Blocks: one fixed {n:8}-hour day every two weeks: {n:32} hours.', focus: ['blocks2', 'calendar'] },
      { nl: 'Plus twee halve dagen voor de test, nu ingepland: {n:40} uur.', en: 'Plus two half days for the test, booked now: {n:40} hours.', focus: ['test', 'calendar'] },
      { nl: 'Bereid elke dag voor.', en: 'Prepare each day.', focus: ['prep2', 'sheet'] },
      { nl: 'Vraag wat het de moeite waard maakt; noem zijn werk in de stuurgroep.', en: 'Ask what makes it worth it; credit him in the steering meeting.', focus: ['ask2', 'teamlead', 'sponsor'] },
    ]),
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the cards it carries every
// point of the checklist above. No symbols the voice would read aloud: numbers
// stay plain, percent is said as a word, no quotes or parentheses.
// Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex,
// 2026-11-12). New SAY rules in films/_kit/timeline.mjs for this film (the last
// Dutch group; no other film's spoken text changes): second opinion as Dutch
// project people say it, sekkend opinjun (espeak-ng reads "se-KONT OP-i-ni-on";
// only in this film's phrases), timebox as taimboks ("TIE-me-box"), Weinberg
// after "van" as Wainburk (the Gerald Weinberg rule already says Djerreld
// Wainburk), Daniel Pink noemt in Drive as Deniel Pink, Draiv ("dri-ve"), Edward
// Deci en Richard Ryan as Edwerd Diessie en Ritsjerd Rajen (a Dutch ch,
// "rie-an"), manager as menetsjer in this film's phrases (MAA-naa-gher), the
// operators before "verliezen" as ope-raators (OO-pi-raa-tors), and installateur,
// zelfdeterminatietheorie ("ti" for "tsie"), psychologen, bouwplaats and
// drijfveren split at the head (their stress falls on the wrong part). The
// shared stuurgroep rule already covers stuurgroep. Kept out of the Dutch
// narration (on the cards and in the captions): engineer (said
// "elektrotechnicus" and "de fabriek", as pm.outside.experts keeps it on the
// card). The guard below runs on the text after the SAY rules, so a word a rule
// rewrites passes and a misread one fails the build.
const SAY = [
  [ // s1 structure, not content; fact and judgement
    { nl: 'Als experts het oneens zijn, kun je de inhoud niet beoordelen, maar wel het besluit structureren.',
      en: 'When experts disagree, you can\'t judge the content, but you can structure the decision.' },
    { nl: 'Meestal gaat het niet over feiten, maar over andere aannames of prioriteiten.',
      en: 'Mostly it is not about facts, but about different assumptions or priorities.' },
    { nl: 'Stap één: de {t:Besliscriteria|besliscriteria} op tafel, vóór de opties. Kosten, risico, tijd, kwaliteit, onderhoud.',
      en: 'Step one: the {t:Decision criteria|decision criteria} on the table, before the options. Cost, risk, time, quality, upkeep.' },
    { nl: 'Scheid feit en {t:Oordeel|oordeel}. De transformator is {n:42} jaar oud: een feit. Nog tien jaar mee: een inschatting.',
      en: 'Separate fact from {t:Judgement|judgement}. The transformer is {n:42} years old: a fact. Ten more years: an assessment.' },
    { nl: 'Meningsverschillen zitten meestal in de oordelen.',
      en: 'Disagreements usually sit in the judgements.' },
    { nl: 'Vraag elke expert: wat zou jou van mening doen veranderen? Dan zie je waar het echt op rust.',
      en: 'Ask each expert: what would change your mind? Then you see what it really rests on.' },
  ],
  [ // s2 the weighted score
    { nl: 'Een {t:Gewogen score|gewogen score}: elk criterium een gewicht, elke optie een score.',
      en: 'A {t:Weighted score|weighted score}: a weight for each criterion, a score for each option.' },
    { nl: 'Vermenigvuldig en tel op. Geen toverij.',
      en: 'Multiply and add up. It\'s not magic.' },
    { nl: 'De gewichten zijn een zakelijke keuze, geen technische: stel ze vast met de sponsor.',
      en: 'The weights are a business choice, not a technical one: set them with the sponsor.' },
    { nl: 'De echte waarde: je ziet waar de opties verschillen,',
      en: 'The real value: you see where the options differ,' },
    { nl: 'en of de uitkomst verandert als een gewicht een beetje verschuift.',
      en: 'and whether the outcome changes if a weight moves a little.' },
  ],
  [ // s3 the second opinion; the failures
    { nl: 'Een {t:Second opinion|second opinion}: een onafhankelijke expert van buiten, voor grote keuzes die moeilijk terug kunnen.',
      en: 'A {t:Second opinion|second opinion}: an independent outside expert, for big choices that are hard to undo.' },
    { nl: 'Geef hem de vraag en de criteria mee, niet wie wat zei.',
      en: 'Brief them on the question and the criteria, not on who said what.' },
    { nl: 'Of laat elk het standpunt van de ander verwoorden, tot die het eens is. Dat koelt af; vaak liggen ze dichterbij dan het klonk.',
      en: 'Or have each state the other\'s position until the other agrees. It cools things down; often they are closer than they sounded.' },
    { nl: 'Klassieke fouten: beslissen op senioriteit, op wie het hardst praat, of het verschil delen in een oplossing waar niemand in gelooft.',
      en: 'Typical failures: deciding by seniority, by who talks loudest, or splitting the difference into a solution nobody believes in.' },
    { nl: 'Of het laten slepen, terwijl het project wacht.',
      en: 'Or letting it drag on, while the project waits.' },
    { nl: 'Scherpe vraag: kozen we de optie van je collega, wat ging er dan mis, en hoe waarschijnlijk? Zo worden meningen risico\'s.',
      en: 'A sharp question: if we chose your colleague\'s option, what would go wrong, and how likely? Opinions become risks.' },
  ],
  [ // s4 the transformer
    { nl: 'Een netproject bij een fabriek: de eigen elektrotechnicus wil de oude transformator reviseren, de installateur vervangen.',
      en: 'A grid project at a factory. Its own electrical engineer wants to service the old transformer, the installer to replace it.' },
    { nl: 'Stap één, met de sponsor: kosten over {n:10} jaar, risico op uitval, stilstand tijdens het werk.',
      en: 'Step one, with the sponsor: cost over {n:10} years, outage risk, downtime during the work.' },
    { nl: 'Stap twee. Feit: de olietest toont stijgend vocht. Oordeel: nog {n:10} jaar, tegenover uitval binnen {n:5}.',
      en: 'Step two. Fact: the oil test shows rising moisture. Judgement: {n:10} more years, versus failure within {n:5}.' },
    { nl: 'Stap drie: wat verandert je mening? De fabriek: een slechtere olietest volgend jaar. De installateur: een schone test.',
      en: 'Step three: what would change your mind? The factory: a worse oil test next year. The installer: a clean test.' },
    { nl: 'Stap vier: een second opinion van een onafhankelijk testbureau op de olieresultaten.',
      en: 'Step four: a second opinion from an independent test company on the oil results.' },
    { nl: 'Die steunt vervangen binnen {n:3} jaar; de sponsor plant het in de zomerstop van volgend jaar.',
      en: 'It supports replacing within {n:3} years; the sponsor plans it for next summer\'s shutdown.' },
  ],
  [ // s5 scarce, and switching costs time
    { nl: 'Experts zijn meestal het schaarste middel: weinig mensen kunnen het werk, veel projecten willen ze.',
      en: 'Experts are usually the scarcest resource: few people can do the work, many projects want them.' },
    { nl: 'Je planning is maar zo echt als hun beschikbaarheid.',
      en: 'Your plan is only as real as their availability.' },
    { nl: '{t:Contextwisseling}: wisselen tussen taken, en tijd verliezen om er weer in te komen.',
      en: '{t:Context switching}: moving between tasks, and losing time getting back in.' },
    { nl: 'Gerald Weinberg, 1992, als vuistregel: op twee projecten gaat zo\'n vijfde op aan wisselen.',
      en: 'Gerald Weinberg\'s rule of thumb, 1992: on two projects, about a fifth goes on switching.' },
    { nl: 'Op vijf kan het verlies naar driekwart gaan.',
      en: 'On five, the loss can approach three quarters.' },
    { nl: 'Een grove richtlijn, geen meting.',
      en: 'A rough guide, not a measurement.' },
  ],
  [ // s6 blocks, preparation, the timebox
    { nl: 'Vraag om blokken, niet om percentages: dinsdag en donderdag is beter dan {n:40} procent.',
      en: 'Ask for blocks, not percentages: Tuesdays and Thursdays beats {n:40} percent.' },
    { nl: 'Bereid voor, zodat hun uren tellen: vragen opgeschreven, data klaar, besluiten op een rij.',
      en: 'Prepare, so their hours count: questions written down, data ready, decisions lined up.' },
    { nl: 'Niet nodig in een overleg? Stuur een samenvatting van twee regels.',
      en: 'Not needed in a meeting? Send a two-line summary instead.' },
    { nl: 'Een {t:Timebox|timebox} is een vast tijdslot voor een taak, dat stopt als de tijd om is.',
      en: 'A {t:Timebox|timebox} is a fixed slot for a task that ends when the time is up.' },
    { nl: 'Bijvoorbeeld: twee uur op donderdag om het koppelingsontwerp te besluiten.',
      en: 'For example: two hours on Thursday to decide the interface design.' },
  ],
  [ // s7 motivation; what you do with it
    { nl: 'Daniel Pink noemt in Drive, uit 2009, drie drijfveren voor kenniswerk, voortbouwend op Edward Deci en Richard Ryan.',
      en: 'Daniel Pink, in Drive, from 2009, names three drivers for knowledge work, building on Edward Deci and Richard Ryan.' },
    { nl: '{t:Autonomie}: zeggenschap over hoe je het werk doet.',
      en: '{t:Autonomy}: control over how you do the work.' },
    { nl: '{t:Meesterschap}: beter worden in iets wat je belangrijk vindt.',
      en: '{t:Mastery}: getting better at something that matters to you.' },
    { nl: '{t:Zingeving}: zien waar het werk voor is.',
      en: '{t:Purpose}: seeing what the work is for.' },
    { nl: 'Dus: autonomie over het hoe, en stevig over het wat en wanneer.',
      en: 'So: autonomy over the how, and firm on the what and when.' },
    { nl: 'Vertel het probleem, niet alleen de taak: de operators verliezen hier {n:20} minuten per dienst aan.',
      en: 'Tell them the problem, not just the task: the operators lose {n:20} minutes a shift on this.' },
    { nl: 'Noem hun werk bij naam, waar de sponsor bij is.',
      en: 'Credit their work by name, in front of the sponsor.' },
    { nl: 'Motivatie sloop je met prioriteiten en besluiten die zonder uitleg veranderen, en met overleg zonder doel.',
      en: 'Motivation dies with priorities and decisions changed without explanation, and meetings without purpose.' },
  ],
  [ // s8 earning their attention
    { nl: 'Een klassieke fout: de manager van de expert als enige hefboom zien.',
      en: 'A typical failure: treating the expert\'s manager as the only lever.' },
    { nl: 'Zijn manager verdeelt de uren; zijn aandacht moet je verdienen.',
      en: 'Their manager allocates hours; you earn their attention.' },
    { nl: 'Vraag bij de start: wat zou dit project jouw tijd waard maken?',
      en: 'Ask at the start: what would make this project worth your time?' },
    { nl: 'Een interessant probleem, een nette overdracht, of gewoon niet \'s nachts gebeld worden.',
      en: 'An interesting problem, a clean handover, or simply not being called at night.' },
    { nl: 'Onthoud dan het antwoord.',
      en: 'Then remember the answer.' },
  ],
  [ // s9 the safety specialist on four projects
    { nl: 'Een robotcel. De enige veiligheidsspecialist van de leverancier zit op vier projecten, en mist steeds jouw sessies.',
      en: 'A robot cell. The supplier\'s only safety specialist is on four projects, and keeps missing your sessions.' },
    { nl: 'Je hebt in {n:8} weken zo\'n {n:40} uur van hem nodig; zijn manager zegt {n:25} procent.',
      en: 'In {n:8} weeks you need some {n:40} hours of him; his manager says {n:25} percent.' },
    { nl: 'Op papier is dat {n:80} uur.',
      en: 'On paper, that is {n:80} hours.' },
    { nl: 'Maar de tabel van Weinberg geeft op vier projecten zo\'n {n:10} procent per project: {n:32} uur, te weinig.',
      en: 'But Weinberg\'s table gives about {n:10} percent each on four projects: {n:32} hours, too few.' },
    { nl: 'Dus vraag zijn manager om blokken: één vaste dag van {n:8} uur per twee weken: {n:32} uur.',
      en: 'So ask his manager for blocks: one fixed {n:8}-hour day every two weeks: {n:32} hours.' },
    { nl: 'Plus twee halve dagen voor de veiligheidstest, nu ingepland: samen {n:40} uur.',
      en: 'Plus two half days for the safety test, booked now: {n:40} hours in all.' },
    { nl: 'Bereid elke dag voor, zodat er geen uur verloren gaat.',
      en: 'Prepare each day, so no hour is wasted.' },
    { nl: 'Vraag wat het de moeite waard maakt, misschien minder late telefoontjes van de bouwplaats. Noem zijn werk in de stuurgroep.',
      en: 'Ask what would make it worth his while, perhaps fewer late calls from the site. And credit his work in the steering meeting.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above); checked on the text
// after the SAY rules, so a rewritten word passes
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{t:([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(engineer|second opinion|timebox|Weinberg|Drive|Deci|Ryan|operators|manager|installateur|zelfdeterminatietheorie|psychologen|bouwplaats|drijfveren)\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(said)) throw new Error(`narration: "${MISREAD.exec(said)[0]}" is misread by the Dutch voice in "${said.slice(0, 50)}"`);
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
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-dot{fill:var(--anatomy-mid)}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-sq{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.pm-lost{fill:#C9503C;stroke:none;opacity:.85}
.pm-green{fill:#4E9A5B;stroke:none}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-big,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-sq{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-strike{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken, waarop de weken verschijnen waarin een besluit blijft slepen, twee vaste dagen per week, de timebox op donderdag, een vaste dag per twee weken en twee halve dagen voor de veiligheidstest. Jij, de adviseur in petrol, staat aan de voorkant van de tafel. De teamleider aan het linkereind en de planner met een tablet achter de tafel zijn de twee experts die het oneens zijn; later is de teamleider de drukke expert. De sponsor in pak staat aan het rechtereind. Op tafel een vel: de besliscriteria, later de voorbereide vragen. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: structuur in plaats van inhoud, besliscriteria, feit en oordeel; de gewogen score; de second opinion en klassieke fouten; een transformator, reviseren of vervangen; schaarse experts en contextwisseling; blokken en de timebox; motivatie, autonomie, meesterschap en zingeving; hun aandacht verdienen; en een veiligheidsspecialist op vier projecten: 80 uur op papier, 32 na het wisselen, 40 in blokken.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks, where the weeks a decision drags on, two fixed days a week, the Thursday timebox, a fixed day every two weeks and two half days for the safety test appear. You, the consultant in petrol, stand at the front of the table. The team lead at the left end and the planner with a tablet behind the table are the two experts who disagree; later the team lead is the busy expert. The sponsor in a suit stands at the right end. On the table a sheet: the decision criteria, later the prepared questions. At the right a panel with one card per scene, marked as example or diagram: structure instead of content, decision criteria, fact and judgement; the weighted score; the second opinion and typical failures; a transformer, service or replace; scarce experts and context switching; blocks and the timebox; motivation, autonomy, mastery and purpose; earning their attention; and a safety specialist on four projects: 80 hours on paper, 32 after switching, 40 in blocks.',
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

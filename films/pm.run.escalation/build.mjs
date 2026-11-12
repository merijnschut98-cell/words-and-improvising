// Dev tool, not shipped. Builds the explainer film "Van oranje naar rood: een
// escalatie die werkt / From amber to red: an escalation that works" for the
// Projects course: pm.run.status (level 1 of Sturen en rapporteren),
// pm.run.decisions (level 2 of Issues en escalatie) and pm.portfolio.governance
// (level 1 of Governance en sturen).
//
//   node films/pm.run.escalation/build.mjs            build the page
//   node films/pm.run.escalation/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.run.escalation.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.run.escalation, P1): the chain from a slipped date to a sponsor's call
// the same afternoon, with who is told first. Storyboard drift: the plan's six
// scenes are nine, because the film now carries the whole text of three
// lessons: the tolerance table gets its own scene (s3, governance teach 1 and
// 3), the decisions lesson's worked example (one A4 at a plastics processor)
// gets s7 and its people side and one-way doors s8, and the governance
// lesson's worked example (a steering group of eleven that never decides) s9.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard, a wall clock and a calendar strip of twelve
// weeks, a table with the decision log on it, and the recurring cast: "jij" the
// consultant in petrol at the board, the sponsor, the team lead and the
// planner. The calendar strip carries the example's dates (access promised in
// week 5, now week 11; the pilot milestone moving from week 8 to week 12). A
// panel at the right, in stage space, carries one card per scene, labelled
// "schema" (a general picture) or "voorbeeld" (the worked examples); the board
// in the room repeats it in miniature.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of the three lessons' teach text and worked examples.
// Checklist (lesson point: scene):
//   status teach 1: RAG status red, amber, green, works only if the colours are
//     agreed at the start; green on track for the next milestone, a dated
//     checkpoint like pilot start, without extra help; amber at risk, the team
//     recovers with its own actions; red will miss unless the steering group
//     acts; red is not failure but a request for a decision (s1)
//   status teach 2: watermelon project, green outside, red inside; reports
//     green until two weeks before the deadline, then red; people hope to
//     catch up and fear for the messenger; the MUM effect, from keep mum, stay
//     silent, Rosen and Tesser 1970; the price: the options are gone; bad news
//     early cheap, late expensive (s2)
//   status teach 3: bad news in four parts, what happened, what it means for
//     the milestone, what I propose, what I need; the example sentence (access
//     six weeks late, pilot week 8 to 12, start on paper in week 8, your OK and
//     a call to the IT manager); that call is an escalation, a problem taken to
//     someone who can decide or help, with a proposal (s5)
//   status teach 4: client people ask to keep it green; no argument in the
//     corridor; "I get it, nobody likes red; now the sponsor can still help, in
//     six weeks not"; as an outsider you can say what insiders can't, with
//     care; always tell the owner before the sponsor hears (s4)
//   status teach 5: report a forecast, not only progress, where we land with
//     what we know now; 70% of tasks done says little, savings at 180.000 not
//     300.000 says a lot; colours on gut feeling; the sharp question; if nobody
//     can answer, green means nothing (s2)
//   status example: week 6 at a grid operator; access promised by IT for week
//     5, now week 11 (s1); the team lead wants amber (s1); the definitions: the
//     team can't fix IT, the pilot slips four weeks unless someone acts: red
//     (s3); team lead and IT contact told first (s4); the steering group
//     sentence with two planners (s5); the sponsor agrees and calls the same
//     afternoon (s6)
//   decisions teach 1: options and a recommendation, not a problem; the
//     recommendation is the option you advise, with the reason; two or three
//     real options, decision criteria (cost, time, risk, impact on people),
//     pros and cons, what happens without a decision; one A4: ten minutes, a
//     vague question three meetings (s7)
//   decisions teach 2: decision log with date, decision, who, why, dropped
//     alternatives; two minutes each; month four "who decided that?": open the
//     log, not the discussion; where everyone sees it, a tab in the project
//     file (s6)
//   decisions teach 3: escalation path agreed at the start, team, project
//     owner, sponsor, a term per level, "not agreed by Friday: to the sponsor";
//     escalate the decision, not the person; tell those involved before; a
//     default option, "no decision by the 15th: we go on with A" (s6, s7)
//   decisions teach 4: managers postpone for fear of being wrong or someone
//     above disagreeing; "what would you need to see to decide?", if vague
//     "who else needs to feel good about this?"; if you don't know the best
//     option, say so and advise a small test (s8)
//   decisions teach 5: one-way and two-way doors (Amazon's founder, letter to
//     shareholders 2015), take two-way doors fast and low; the decision taken
//     twice, agreed in the steering group, reopened in the corridor; experts
//     differ on consensus; disagree and commit, an Intel phrase made known at
//     Amazon: argue openly, then everyone carries the decision (s8)
//   decisions example: plastics processor, line 2 (most downtime, 14% of
//     planned hours) or line 5 (smaller losses, a keen team lead); one A4; A
//     about 90.000 a year, sceptical shift leader; B about 40.000, quick start,
//     motivated team; C four weeks line 5, then line 2; advice C, a visible
//     success convinces line 2; no decision by Friday: C; the operations
//     manager picks C and you log it with the reason (s7)
//   governance teach 1: governance, who decides what, set in advance; decision
//     rights for scope, budget, schedule and people; project lead within 10%
//     budget and two weeks, beyond that the steering group, above 20% or on
//     strategy the board; one A4 signed by the sponsor; the margins are
//     tolerances; PRINCE2, management by exception (s3)
//   governance teach 2: a deciding steering group of five to seven who can
//     commit their department; decisions on the agenda, not updates; papers
//     three days ahead; minutes are a decision log: what, who, when done; no
//     decision on the agenda: cancel and send a mail; the trap: fifteen slides,
//     a good discussion, "take it offline", nobody decides (s9)
//   governance teach 3: escalation, passing a problem to the level allowed to
//     decide; escalation lines fix what goes up, how fast, to whom; escalate
//     when a tolerance is crossed or will be within two weeks, with options and
//     advice (s3); escalating is the system working, too late is the failure
//     (s6)
//   governance teach 4: a member who never decides often lacks mandate from
//     his own boss; ask privately "can you decide for your department or must
//     you go back first?"; help him get it, or invite who has it (s9)
//   governance teach 5: experts argue about size and form; big groups feel
//     inclusive, rarely decide; a RACI chart helps, but one nobody reads
//     changes nothing; signs it works: short meetings, decisions in the first
//     half hour, project leads who know what they may decide; the sharp opening
//     question (s9)
//   governance example: eleven members, three decisions pushed for two months
//     (18% over on contractor costs, a second region in scope, who supplies two
//     planners), fifteen slides, "offline"; the sponsor asks you; told
//     honestly why; decision rights and tolerances on one A4; six voting
//     members, the rest advisers; an agenda of the three decisions with
//     options, costs and advice, three days ahead; the two blockers seen first
//     about mandate; "today we need three decisions"; recorded with owners and
//     dates (s9)
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';
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
// lesson text by defineFilm. Sources as in the lessons: Rosen and Tesser 1970
// (the MUM effect), PRINCE2 (tolerances, management by exception), Bezos's
// 2015 letter to shareholders (one-way and two-way doors), Intel's "disagree
// and commit".
const ST = 'pm.run.status';
const DE = 'pm.run.decisions';
const GO = 'pm.portfolio.governance';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(ST, ['rood, oranje of groen', 'aan het begin afspreekt', 'zonder extra hulp', 'met eigen acties herstellen', 'tenzij de stuurgroep ingrijpt', 'geen falen, maar een vraag om een besluit',
  'groen van buiten, rood van binnen', 'twee weken voor de deadline', 'MUM-effect', '“keep mum”, je mond houden (Rosen en Tesser, 1970)', 'Slecht nieuws vroeg is goedkoop; slecht nieuws laat is duur',
  'wat er gebeurd is, wat het betekent voor de mijlpaal, wat ik voorstel, wat ik van je nodig heb', 'van week 8 naar week 12', 'op papier te starten', 'belletje van jou naar de IT-manager',
  'Ga daar niet op de gang over in discussie', 'Over zes weken niet meer', 'wat insiders niet kunnen', 'altijd eerst de eigenaar',
  '“70% van de taken af” zegt weinig', '180.000 euro, niet 300.000', 'Wat zou er moeten gebeuren voordat dit rood wordt?',
  'die IT voor week 5 beloofde', 'IT zegt nu week 11', 'wil oranje rapporteren', 'schuift vier weken op tenzij iemand ingrijpt', 'eerst de teamleider en je contact bij IT', 'met twee planners', 'belt dezelfde middag']);
says(DE, ['opties en een advies, niet met een probleem', 'kosten, tijd, risico, impact op mensen', 'wat er gebeurt als er niet besloten wordt', 'in tien minuten', 'drie overleggen',
  'datum, besluit, wie besliste, waarom, en welke alternatieven afvielen', 'twee minuten per besluit', 'in maand vier', 'tabblad in het projectbestand',
  'team, projecteigenaar, sponsor, met een termijn per niveau', 'Escaleer het besluit, niet de persoon', 'voordat je het doet', 'Als er op de 15e geen besluit is, gaan we door met optie A',
  'Wat zou je moeten zien om te beslissen?', 'Wie moet zich hier nog meer goed bij voelen?', 'adviseer een kleine test',
  'eenrichtingsdeuren', 'tweerichtingsdeuren', 'zo laag mogelijk', 'op de gang weer opengebroken', 'disagree and commit', 'Intel',
  'lijn 2 (meeste stilstand, 14% van de geplande productie-uren)', 'ongeveer 90.000 euro per jaar', 'ploegleider daar is sceptisch', 'ongeveer 40.000', 'vier weken op lijn 5', 'Advies: C', 'Geen besluit voor vrijdag, dan start het team met C', 'De operations manager kiest C']);
says(GO, ['wie wat beslist, vooraf vastgelegd', 'scope, budget, planning en mensen', 'binnen 10% op budget en twee weken op planning', 'boven 20%', 'afgetekend door de sponsor', 'management by exception',
  'vijf tot zeven mensen', 'besluiten, geen updates', 'drie dagen vooraf', 'De notulen zijn een besluitenlijst', 'zeg het overleg dan af en stuur een mail', '15 slides',
  'binnen twee weken overschreden wordt', 'Te laat escaleren, dát is het falen', 'kun jij dan voor je afdeling beslissen, of moet je eerst terug?', 'nodig degene uit die het wel heeft',
  'Grote groepen voelen inclusief maar beslissen zelden', 'een schema dat niemand leest verandert niks', 'besluiten in het eerste halfuur', 'Welke besluiten hebben we vandaag van deze groep nodig?',
  'elf leden', 'twee maanden', '18% overschrijding op de aannemerskosten', 'tweede regio', 'twee planners', 'zes stemhebbende leden', 'Vandaag hebben we drie besluiten nodig', 'met eigenaren en datums']);
says(ST, ['IT promised for week 5', 'IT now says week 11', 'from week 8 to week 12', 'calls the same afternoon'], 'en');
// the example's dates
const WK = { now: 6, promised: 5, access: 11, pilot: 8, newPilot: 12 };
const LATE = WK.access - WK.promised;
const SLIP = WK.newPilot - WK.pilot;
const TOL = { budget: 10, weeks: 2, board: 20 };
assert(LATE === 6 && SLIP === 4, 'access six weeks late, the pilot four weeks');
assert(SLIP > TOL.weeks, 'a four-week slip is beyond the project lead\'s two weeks: the steering group decides');
// the decisions example (euro a year) and the governance example
const LINES = { A: 90000, B: 40000, downtime: 14 };
assert(LINES.A > LINES.B, 'line 2 saves more, line 5 starts sooner');
const BOARD_N = { before: 11, voting: 6 };
assert(BOARD_N.voting >= 5 && BOARD_N.voting <= 7 && BOARD_N.voting < BOARD_N.before, 'six voting members: within five to seven');

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

const WEEKS = 12;
const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const CAL = w.calendar({ y0: 40, z0: 118, weeks: WEEKS, cw: 13, ch: 28 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const LOG = w.sheet({ x: 150, y: 150, z: TZ, w: 21, d: 29.7 });
const LOG_AT = w.at([160, 165, TZ]);
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 330 };
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
// the decision log on the table: its lines fill in (s6, s7, s9)
const logLines = `<g transform="${LOG.face}">${g('dLines', '')}</g>`;

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
  w.stack({ x: 104, y: 126, z: TZ, n: 3 }),
  cueG('log', LOG.svg + logLines),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each term's part of
// a card sits in its own cue group, so the narration can light it.
const PX = 322;
const PW = 308;
const CUES = ['rag', 'mile', 'wk', 'melon', 'reports', 'cheap', 'fore', 'ques', 'gov', 'rights', 'tol', 'slip', 'owner', 'quote', 'slide', 'esc', 'call', 'route', 'log', 'case', 'opts', 'advice', 'crit', 'dflt', 'ask', 'test', 'doors', 'commit', 'group', 'agenda', 'open', 'mandate'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + g('pBody', '')
  + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));

// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.plan.schedule): the same points, fewer bytes; each rewrite is read back.
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
const CAL_AT = w.at([0, 120, 140]);
const CAM = [
  { from: [150, 210, 1], to: [120, 190, 1.08] },
  { from: [150, 190, 1.04], to: [140, 170, 1.1] },
  { from: [150, 180, 1.06], to: [160, 190, 1.02] },
  { from: [120, 230, 1.05], to: [100, 240, 1.12] },
  { from: [150, 190, 1.02], to: [170, 200, 1.08] },
  { from: [210, 210, 1.06], to: [LOG_AT[0], LOG_AT[1], 1.18] },
  { from: [LOG_AT[0], LOG_AT[1], 1.12], to: [150, 190, 1.04] },
  { from: [150, 200, 1.04], to: [140, 180, 1.1] },
  { from: [150, 200, 1.1], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const DURS = [30, 34, 30, 22, 30, 30, 40, 30, 50];
const C = { PX, PW, WK, LATE, SLIP, TOL, LINES, BOARD_N, CELLS, WEEKS, dur: DURS };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, dur: DURS[Number(id.slice(1)) - 1], still: 0.9, title, beats });
const spec = {
  id: 'pm.run.escalation',
  title: { nl: 'Van oranje naar rood: een escalatie die werkt', en: 'From amber to red: an escalation that works' },
  lessons: [ST, DE, GO],
  strictFocus: true,
  scenes: [
    sc('s1', ST, 1, { nl: 'Week 6: geen toegang', en: 'Week 6: no access' }, [
      { nl: 'Week {n:6}: de pilot wacht op systeemtoegang, beloofd voor week {n:5}. Nu: week {n:11}.', en: 'Week {n:6}: the pilot waits for system access, promised for week {n:5}. Now: week {n:11}.', focus: ['calendar', 'wk'] },
      { nl: 'De {t:RAG-status|RAG-status}: rood, oranje of groen, met vooraf afgesproken betekenis.', en: 'The {t:RAG status|RAG status}: red, amber or green, with meanings agreed at the start.', cue: { 'RAG-status': 'rag' }, focus: 'rag' },
      { nl: 'Groen: op koers voor de {t:Mijlpaal|mijlpaal}. Oranje: team herstelt zelf. Rood: lukt niet zonder stuurgroep.', en: 'Green: on track for the {t:Milestone|milestone}. Amber: the team recovers. Red: misses unless the steering group acts.', cue: { Mijlpaal: 'mile' }, focus: ['mile', 'rag'] },
      { nl: 'De teamleider wil oranje. Maar rood is geen falen: het is een vraag om een besluit.', en: 'The team lead wants amber. But red is not failure: it is a request for a decision.', focus: ['teamlead', 'rag'] },
    ]),
    sc('s2', ST, 1, { nl: 'Groen van buiten', en: 'Green outside' }, [
      { nl: 'Het {t:Watermeloenproject|watermeloenproject}: groen van buiten, rood van binnen.', en: 'The {t:Watermelon project|watermelon project}: green outside, red inside.', cue: { Watermeloenproject: 'melon' }, focus: 'melon' },
      { nl: 'Mensen hopen het in te halen en zwijgen: het MUM-effect.', en: 'People hope to catch up and keep quiet: the MUM effect.', focus: 'reports' },
      { nl: 'Slecht nieuws vroeg is goedkoop; slecht nieuws laat is duur.', en: 'Bad news early is cheap; bad news late is expensive.', focus: 'cheap' },
      { nl: 'Een {t:Prognose|prognose}: de besparing komt uit op {n:180000} euro, niet {n:300000}.', en: 'A {t:Forecast|forecast}: the savings will land at {n:180000} euro, not {n:300000}.', cue: { Prognose: 'fore' }, focus: 'fore' },
      { nl: 'Vraag: wat moet er gebeuren voordat dit rood wordt?', en: 'Ask: what would have to happen for this to turn red?', focus: 'ques' },
    ]),
    sc('s3', GO, 1, { nl: 'Wie beslist wat?', en: 'Who decides what?' }, [
      { nl: '{t:Governance|Governance}: vooraf vastgelegd wie wat beslist, op één A4 van de sponsor.', en: '{t:Governance|Governance}: agreed in advance who decides what, on one page signed by the sponsor.', cue: { Governance: 'gov' }, focus: ['gov', 'sponsor'] },
      { nl: '{t:Beslisbevoegdheden|Beslisbevoegdheden}: binnen {n:10}% en twee weken beslist de projectleider.', en: '{t:Decision rights|Decision rights}: within {n:10}% and two weeks, the project lead decides.', cue: { Beslisbevoegdheden: 'rights' }, focus: 'rights' },
      { nl: 'Daarboven de stuurgroep; boven {n:20}% of bij strategie de directie.', en: 'Beyond that the steering group; above {n:20}% or on strategy, the board.', focus: 'rights' },
      { nl: 'Die marges zijn {t:Tolerantie|toleranties}: sturen op uitzonderingen.', en: 'Those margins are {t:Tolerance|tolerances}: management by exception.', cue: { Tolerantie: 'tol' }, focus: 'tol' },
      { nl: 'Escaleer bij een tolerantie die over is of binnen twee weken: vier weken uitstel is rood.', en: 'Escalate when a tolerance is crossed or will be within two weeks: four weeks late is red.', focus: ['slip', 'rights', 'calendar'] },
    ]),
    sc('s4', ST, 1, { nl: 'Eerst de eigenaar', en: 'The owner first' }, [
      { nl: 'Eerst de eigenaar, dan de sponsor: jij belt de teamleider en je contact bij IT.', en: 'The owner first, then the sponsor: you call the team lead and your IT contact.', focus: ['owner', 'teamlead'] },
      { nl: 'Nog even groen? Snap ik. Maar nu kan de sponsor nog helpen, over zes weken niet.', en: 'Keep it green for now? I get it. But now the sponsor can still help; in six weeks, not.', focus: 'quote' },
      { nl: 'Als buitenstaander kun je zeggen wat insiders niet kunnen. Doe dat zorgvuldig.', en: 'As an outsider you can say what insiders can’t. Use that with care.', focus: 'jij' },
    ]),
    sc('s5', ST, 1, { nl: 'In vier delen', en: 'In four parts' }, [
      { nl: 'Wat er gebeurd is, wat het betekent, wat ik voorstel, wat ik nodig heb.', en: 'What happened, what it means, what I propose, what I need.', focus: 'slide' },
      { nl: 'Toegang zes weken te laat: de pilot schuift van week {n:8} naar week {n:12}.', en: 'Access six weeks late: the pilot moves from week {n:8} to week {n:12}.', focus: ['slide', 'calendar'] },
      { nl: 'Voorstel: in week {n:8} op papier starten. Nodig: akkoord en een belletje naar de IT-manager.', en: 'Proposal: start on paper in week {n:8}. Needed: your OK and a call to the IT manager.', focus: ['slide', 'sponsor'] },
      { nl: 'Dat belletje is een {t:Escalatie|escalatie}: een probleem naar wie kan beslissen of helpen.', en: 'That call is an {t:Escalation|escalation}: a problem taken to someone who can decide or help.', cue: { Escalatie: 'esc' }, focus: 'esc' },
    ]),
    sc('s6', DE, 2, { nl: 'Dezelfde middag', en: 'The same afternoon' }, [
      { nl: 'De sponsor stemt in en belt dezelfde middag. Te laat escaleren, dát is het falen.', en: 'The sponsor agrees and calls the same afternoon. Escalating too late is the failure.', focus: ['sponsor', 'call'] },
      { nl: 'Een {t:Escalatieroute|escalatieroute}: team, projecteigenaar, sponsor, met een termijn per niveau.', en: 'An {t:Escalation path|escalation path}: team, project owner, sponsor, with a deadline per level.', cue: { Escalatieroute: 'route' }, focus: 'route' },
      { nl: 'Escaleer het besluit, niet de persoon, en zeg het de betrokkenen vooraf.', en: 'Escalate the decision, not the person, and tell those involved first.', focus: 'route' },
      { nl: 'De {t:Besluitenlijst|besluitenlijst}: datum, besluit, wie, waarom en wat afviel.', en: 'The {t:Decision log|decision log}: date, decision, who, why and what was dropped.', cue: { Besluitenlijst: 'log' }, focus: 'log' },
    ]),
    sc('s7', DE, 2, { nl: 'Eén A4', en: 'One page' }, [
      { nl: 'Eerst lijn 2, met {n:14}% stilstand, of lijn 5, met een teamleider die graag wil?', en: 'Line 2 first, with {n:14}% downtime, or line 5, with a keen team lead?', focus: 'case' },
      { nl: 'Opties met een {t:Advies|advies}, op {t:Besluitcriteria|besluitcriteria}: kosten, tijd, risico, mensen.', en: 'Options with a {t:Recommendation|recommendation}, on {t:Decision criteria|decision criteria}: cost, time, risk, people.', cue: { Advies: 'advice', Besluitcriteria: 'crit' }, focus: ['advice', 'crit'] },
      { nl: 'A: lijn 2, zo’n {n:90000} euro per jaar. B: lijn 5, zo’n {n:40000}. C: eerst vier weken lijn 5.', en: 'A: line 2, about {n:90000} euro a year. B: line 5, about {n:40000}. C: four weeks on line 5 first.', focus: ['opts', 'advice'] },
      { nl: 'Advies C. {t:Standaardoptie|Standaardoptie}: geen besluit voor vrijdag, dan start het team met C.', en: 'Advice: C. {t:Default|Default}: no decision by Friday, and the team starts with C.', cue: { Standaardoptie: 'dflt' }, focus: ['dflt', 'advice'] },
      { nl: 'Op één A4 beslist een manager in tien minuten. Hij kiest C; de reden gaat in de lijst.', en: 'On one page a manager decides in ten minutes. He picks C; the reason goes in the log.', focus: 'log' },
    ]),
    sc('s8', DE, 2, { nl: 'Besluiten loskrijgen', en: 'Getting a decision' }, [
      { nl: 'Wat zou je moeten zien om te beslissen? Wie moet zich er nog goed bij voelen?', en: 'What would you need to see to decide? Who else needs to feel good about it?', focus: 'ask' },
      { nl: 'Weet je het zelf niet, zeg dat dan, en adviseer een kleine test.', en: 'Not sure yourself? Say so, and advise a small test.', focus: 'test' },
      { nl: 'Tweerichtingsdeur: snel en laag beslissen. Eenrichtingsdeur: met zorg.', en: 'A two-way door: decide fast and low. A one-way door: with care.', focus: 'doors' },
      { nl: 'Oneens zijn en toch meegaan: open discussiëren, daarna draagt iedereen het besluit.', en: 'Disagree and commit: argue openly, then everyone carries the decision.', focus: 'commit' },
    ]),
    sc('s9', GO, 1, { nl: 'Een stuurgroep die beslist', en: 'A steering group that decides' }, [
      { nl: 'Elf leden, drie besluiten al twee maanden open, en steeds: laten we dit offline oppakken.', en: 'Eleven members, three decisions open for two months, and always: let’s take this offline.', focus: ['group', 'sponsor'] },
      { nl: 'Zes stemhebbende leden, de rest adviseert. Alleen besluiten op de agenda, drie dagen vooraf.', en: 'Six voting members, the rest advise. Only decisions on the agenda, sent three days ahead.', focus: ['group', 'agenda'] },
      { nl: 'Wie nooit beslist, mist vaak {t:Mandaat|mandaat}: de bevoegdheid om zijn afdeling te binden.', en: 'Someone who never decides often lacks a {t:Mandate|mandate}: the authority to commit their department.', cue: { Mandaat: 'mandate' }, focus: 'mandate' },
      { nl: 'Open met: welke besluiten hebben we vandaag van deze groep nodig?', en: 'Open with: which decisions do we need from this group today?', focus: 'open' },
      { nl: 'Notulen als besluitenlijst. Het werkt: korte overleggen, projectleiders die weten wat ze mogen.', en: 'Minutes as a decision log. It works: short meetings, project leads who know what they may decide.', focus: 'log' },
    ]),
  ],
  skip: [
    { lesson: GO, term: 'Besluitenlijst', reason: 'Same term as Besluitenlijst of pm.run.decisions, which scene 6 names with its cue (the decision log card and the sheet on the table); scene 9 shows the steering group\'s minutes as that same list, with owners and dates. The build resolves a shared term name to the first served lesson.' },
    { lesson: GO, term: 'Escalatie', reason: 'Same term as Escalatie of pm.run.status, which scene 5 names with its cue (the call to the IT manager); scene 3 shows the governance side, the level allowed to decide and the two-week rule, and scene 6 that escalating is the system working. The build resolves a shared term name to the first served lesson.' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; it carries every point of the
// checklist above. No symbols the voice would read aloud: words for % and +,
// no quotes or parentheses. Words checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex, 2026-11-12); see the commit for the list.
// Kept out of the Dutch narration because espeak-ng misreads them (they stay
// in captions and cards): Vantage (read in French; the film says "de
// sponsor"), Bezos (be-ZOS: the doors card names Amazon, 2015), operations
// manager ("oo-pee-raa-sjons": said "een manager"), management by exception
// and disagree and commit (said in Dutch, as the lesson glosses them), "de
// 15e" ("vijftiende ee": the film uses the lesson's other default, Friday),
// bare IT (the English word "it": said "de IT-afdeling", spelled I T). Dutch-only SAY rules in films/_kit/timeline.mjs for words only
// this film says: governance, MUM-effect, keep mum and escalatieroute.
const SAY = [
  [ // s1 week 6
    { nl: 'Week {n:6} bij een netbeheerder. De pilot wacht op systeemtoegang, beloofd voor week {n:5}. Nu zegt de IT-afdeling: week {n:11}.',
      en: 'Week {n:6} at a grid operator. The pilot waits for system access, promised for week {n:5}. Now IT says week {n:11}.' },
    { nl: 'De {t:RAG-status|RAG-status}: rood, oranje of groen, met vooraf afgesproken betekenis.',
      en: 'The {t:RAG status|RAG status}: red, amber or green, with meanings agreed up front.' },
    { nl: 'Groen: op koers voor de {t:Mijlpaal|mijlpaal}, een controlepunt met datum, zonder hulp. Oranje: risico, het team herstelt het. Rood: niet te halen, tenzij de stuurgroep ingrijpt.',
      en: 'Green: on track for the {t:Milestone|milestone}, a dated checkpoint, without help. Amber: at risk, the team recovers it. Red: will miss, unless the steering group acts.' },
    { nl: 'De teamleider wil oranje. Maar rood is geen falen: het is een vraag om een besluit.',
      en: 'The team lead wants amber. But red is not failure: it is a request for a decision.' },
  ],
  [ // s2 the watermelon
    { nl: 'Het {t:Watermeloenproject|watermeloenproject}: groen van buiten, rood van binnen. Groen tot twee weken voor de einddatum, dan rood.',
      en: 'The {t:Watermelon project|watermelon project}: green outside, red inside. Green until two weeks before the deadline, then red.' },
    { nl: 'Men hoopt het in te halen, en vreest voor de boodschapper: het MUM-effect, van keep mum, zwijgen.',
      en: 'People hope to catch up, and fear for the messenger: the MUM effect, from keep mum, stay silent.' },
    { nl: 'Dan zijn de opties weg: slecht nieuws vroeg is goedkoop, laat is duur.',
      en: 'By then the options are gone: bad news early is cheap, late is expensive.' },
    { nl: 'Meld een {t:Prognose|prognose}, waar je uitkomt: niet {n:70} procent af, maar een besparing van {n:180000} euro, niet {n:300000}.',
      en: 'Report a {t:Forecast|forecast}, where you will land: not {n:70} percent done, but savings of {n:180000} euro, not {n:300000}.' },
    { nl: 'Kleuren op gevoel? Vraag: wat moet er gebeuren voordat dit rood wordt? Weet niemand het, dan zegt groen niks.',
      en: 'Colours on gut feeling? Ask: what would make this red? If nobody knows, green means nothing.' },
  ],
  [ // s3 who decides what
    { nl: 'Vooraf vastleggen wie wat beslist, heet {t:Governance|governance}: één A4, afgetekend door de sponsor.',
      en: 'Setting in advance who decides what is {t:Governance|governance}: one page, signed by the sponsor.' },
    { nl: '{t:Beslisbevoegdheden|Beslisbevoegdheden} voor inhoud, budget, planning en mensen. De projectleider beslist binnen {n:10} procent op budget en twee weken op planning.',
      en: '{t:Decision rights|Decision rights} for scope, budget, schedule and people. The project lead decides within {n:10} percent on budget and two weeks on schedule.' },
    { nl: 'Daarbuiten de stuurgroep; boven {n:20} procent of bij strategie de directie.',
      en: 'Beyond that, the steering group; above {n:20} percent or on strategy, the board.' },
    { nl: 'Die marges zijn {t:Tolerantie|toleranties}: sturen op uitzonderingen.',
      en: 'Those margins are {t:Tolerance|tolerances}: management by exception.' },
    { nl: 'Escaleer als een tolerantie over is, of binnen twee weken over gaat. Vier weken uitstel, en het team kan het niet zelf oplossen: rood.',
      en: 'Escalate when a tolerance is crossed, or will be within two weeks. Four weeks late, and the team cannot fix it alone: red.' },
  ],
  [ // s4 the owner first
    { nl: 'Eerst de eigenaar, dan de sponsor: je belt de teamleider en je contact bij de IT-afdeling.',
      en: 'Owner first, then the sponsor: you call the team lead and your IT contact.' },
    { nl: 'Nog even groen houden? Geen discussie op de gang. Snap ik, niemand houdt van rood. Maar nu kan de sponsor nog helpen, over zes weken niet.',
      en: 'Keep it green for now? No argument in the corridor. I get it, nobody likes red. But now the sponsor can still help; in six weeks, not.' },
    { nl: 'Als buitenstaander kun je zeggen wat mensen van binnen niet kunnen. Doe dat zorgvuldig.',
      en: 'As an outsider you can say what insiders can’t. Do it with care.' },
  ],
  [ // s5 four parts
    { nl: 'In de stuurgroep, in vier delen: wat er gebeurd is, wat het betekent voor de mijlpaal, wat ik voorstel, wat ik nodig heb.',
      en: 'In the steering group, in four parts: what happened, what it means for the milestone, what I propose, what I need.' },
    { nl: 'Rood op de pilot. De toegang is zes weken te laat, dus de pilot schuift van week {n:8} naar week {n:12}.',
      en: 'Red on the pilot. Access is six weeks late, so the pilot moves from week {n:8} to week {n:12}.' },
    { nl: 'Voorstel: in week {n:8} op papier starten, met twee planners. Nodig: jouw akkoord, en jouw belletje naar de IT-manager.',
      en: 'Proposal: start on paper in week {n:8}, with two planners. Needed: your OK, and your call to the IT manager.' },
    { nl: 'Dat belletje is een {t:Escalatie|escalatie}: een probleem bij iemand die kan beslissen of helpen, met een voorstel.',
      en: 'That call is an {t:Escalation|escalation}: a problem taken to someone who can decide or help, with a proposal.' },
  ],
  [ // s6 the same afternoon
    { nl: 'De sponsor stemt in en belt dezelfde middag. Escaleren is het systeem dat werkt; te laat escaleren is het falen.',
      en: 'The sponsor agrees and calls the same afternoon. Escalating is the system working; escalating too late is the failure.' },
    { nl: 'Spreek vooraf een {t:Escalatieroute|escalatieroute} af: team, projecteigenaar, sponsor, met een termijn per niveau. Vrijdag niet eruit? Dan naar de sponsor.',
      en: 'Agree an {t:Escalation path|escalation path} up front: team, project owner, sponsor, a deadline per level. No agreement by Friday? Then the sponsor.' },
    { nl: 'Escaleer het besluit, niet de persoon, en zeg het de betrokkenen vooraf.',
      en: 'Escalate the decision, not the person, and tell those involved first.' },
    { nl: 'De {t:Besluitenlijst|besluitenlijst}: datum, besluit, wie, waarom, wat afviel. Twee minuten. Vraagt iemand in maand vier wie dit besliste? Open de lijst, niet de discussie.',
      en: 'The {t:Decision log|decision log}: date, decision, who, why, what was dropped. Two minutes. Month four, who decided this? Open the log, not the discussion.' },
  ],
  [ // s7 one page
    { nl: 'Een kunststofverwerker: eerst lijn 2, met {n:14} procent stilstand, of lijn 5, met een teamleider die graag wil?',
      en: 'A plastics processor: line 2 first, with {n:14} percent downtime, or line 5, with a keen team lead?' },
    { nl: 'Kom met twee of drie echte opties en een {t:Advies|advies}, niet met een probleem. Gewogen op {t:Besluitcriteria|besluitcriteria}: kosten, tijd, risico, impact op mensen.',
      en: 'Bring two or three real options and a {t:Recommendation|recommendation}, not a problem. Weighed on {t:Decision criteria|decision criteria}: cost, time, risk, impact on people.' },
    { nl: 'A, lijn 2: zo’n {n:90000} euro per jaar, maar een sceptische ploegleider. B, lijn 5: zo’n {n:40000}, snel en gemotiveerd. C: vier weken lijn 5, dan lijn 2.',
      en: 'A, line 2: about {n:90000} euro a year, but a sceptical shift leader. B, line 5: about {n:40000}, quick and motivated. C: four weeks on line 5, then line 2.' },
    { nl: 'Advies C: succes op lijn 5 overtuigt lijn 2. {t:Standaardoptie|Standaardoptie}: geen besluit voor vrijdag, dan start het team met C.',
      en: 'Advice: C, as success on line 5 convinces line 2. {t:Default|Default}: no decision by Friday, and the team starts with C.' },
    { nl: 'Zo beslist een manager in tien minuten; een onduidelijke vraag kost drie overleggen. Hij kiest C, met de reden in de lijst.',
      en: 'So a manager decides in ten minutes; a vague question costs three meetings. He picks C, logged with the reason.' },
  ],
  [ // s8 getting a decision
    { nl: 'Blijft een besluit liggen, uit angst of door een baas? Vraag: wat zou je moeten zien om te beslissen? En: wie moet zich er nog goed bij voelen?',
      en: 'A decision stuck, from fear or a boss? Ask: what would you need to see to decide? And: who else needs to feel good about it?' },
    { nl: 'Weet je zelf het beste niet, zeg dat, en adviseer een kleine test.',
      en: 'Unsure yourself? Say so, and advise a small test.' },
    { nl: 'Een tweerichtingsdeur draai je makkelijk terug, een eenrichtingsdeur niet. Neem de eerste snel, zo laag mogelijk.',
      en: 'A two-way door is easy to undo, a one-way door is not. Take the first fast, as low as possible.' },
    { nl: 'Valkuil: besloten in de stuurgroep, opengebroken op de gang. Over consensus verschillen experts; velen kiezen, naar Intel, oneens zijn en toch meegaan.',
      en: 'The trap: decided in the steering group, reopened in the corridor. Experts differ on consensus; many choose Intel’s disagree and commit.' },
  ],
  [ // s9 a steering group that decides
    { nl: 'Een stuurgroep van elf schuift twee maanden drie besluiten door: {n:18} procent meer aannemerskosten, een tweede regio, twee planners. Vijftien dia’s, en: laten we dit offline oppakken.',
      en: 'Eleven members have pushed three decisions for two months: {n:18} percent over on contractors, a second region, two planners. Fifteen slides, then: let’s take this offline.' },
    { nl: 'Eerlijk tegen de sponsor: niemand weet wie wat mag beslissen. Dus beslisbevoegdheden op één A4, en zes stemhebbende leden; een stuurgroep die beslist heeft er vijf tot zeven. Experts twisten over de omvang; grote groepen voelen inclusief, maar beslissen zelden.',
      en: 'Tell the sponsor honestly: nobody knows who may decide what. So decision rights on one page, and six voting members; a steering group that decides has five to seven. Experts argue about size; big groups feel inclusive, but rarely decide.' },
    { nl: 'Wie nooit beslist, mist vaak {t:Mandaat|mandaat} van zijn baas. Vraag de twee blokkeerders vooraf: kun je beslissen, of moet je eerst terug? Help ze, of nodig wie het heeft.',
      en: 'Members who never decide often lack a {t:Mandate|mandate} from their boss. Ask the two blockers first: can you decide, or must you go back? Help them, or invite who can.' },
    { nl: 'Alleen de drie besluiten op de agenda, met opties en advies, drie dagen vooraf. Geen besluit? Zeg af en mail. Open met: vandaag hebben we drie besluiten nodig.',
      en: 'Only the three decisions on the agenda, with options and advice, three days ahead. No decision? Cancel and mail. Open with: today we need three decisions.' },
    { nl: 'De notulen: een besluitenlijst met eigenaren en datums. Een RACI-schema helpt alleen als het gelezen wordt. Zo werkt het: korte overleggen, besluiten in het eerste halfuur.',
      en: 'The minutes: a decision log with owners and dates. A RACI chart helps only if read. Signs it works: short meetings, decisions in the first half hour.' },
  ],
];
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
  if (/[/&×=+()“”"‘%€]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && (/\bIT\b(?!-)/.test(plain) || /deadline|Vantage|Bezos|operations|exception|disagree|15e/i.test(plain))) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// the status colours, muted, per theme; the cue glow stays petrol
const css = PM_CSS + `
.iso{--esc-g:#5FA877;--esc-a:#D9A441;--esc-r:#D9705F}
.iso[data-theme="light"]{--esc-g:#3B7F52;--esc-a:#B07A12;--esc-r:#B04A3A}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-dot{fill:var(--anatomy-mid)}
.esc-g{fill:var(--esc-g)}
.esc-a{fill:var(--esc-a)}
.esc-r{fill:var(--esc-r)}
.esc-gs{fill:none;stroke:var(--esc-g);stroke-width:9}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt{fill:var(--fp-accent-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash,.pm-mini .pm-dia{stroke-width:.4px}
.pm-mini .esc-gs{stroke-width:3px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken met de beloofde toegang in week 5, de nieuwe datum in week 11 en de pilot als ruitje dat van week 8 naar week 12 schuift. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel de besluitenlijst, die regels krijgt. Rechts een paneel met per scène een kaart: de drie statuskleuren, een watermeloen en een prognose, de tabel met beslisbevoegdheden en toleranties, wie je eerst belt, het slechte nieuws in vier delen, de escalatieroute en de besluitenlijst, één A4 met drie opties, advies en standaardoptie, twee deuren, en een stuurgroep van elf die er zes worden.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks with the promised access in week 5, the new date in week 11 and the pilot as a diamond moving from week 8 to week 12. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table the decision log, which gains lines. At the right a panel with one card per scene: the three status colours, a watermelon and a forecast, the table of decision rights and tolerances, who you call first, the bad news in four parts, the escalation path and the decision log, one page with three options, a recommendation and a default, two doors, and a steering group of eleven that becomes six.',
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

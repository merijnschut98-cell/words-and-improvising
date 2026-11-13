// Dev tool, not shipped. Builds the explainer film "Het kritieke pad schuift /
// The critical path moves" for the topic Planning en kritiek pad of Projecten:
// level 1, pm.plan.schedule (Kritiek pad en de planning op één A4). The first
// film of the Projects course.
//
//   node films/pm.plan.schedule/build.mjs            build the page
//   node films/pm.plan.schedule/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/pm.plan.schedule.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7.
//
// A people film, built from the shared pm world (films/_pm/world.mjs): a
// meeting room with a whiteboard on the back wall, a wall calendar strip on
// the side wall, a clock, a meeting table with two chairs, the plan sheet (A4),
// a stack of papers, a laptop and cups, and the recurring cast: "jij" the
// consultant in petrol at the board, the sponsor, the team lead and the
// planner. The lesson's worked example (a planning project at a grid
// operator: A 3, B 4, D 2, C 6, E 6 weeks) is drawn in a panel at the right,
// in stage space, labelled "voorbeeld": first as a network of cards and
// arrows, then on a week axis (where a delay on a critical chain pushes the
// end, and C moved to week 1 leaves 3 weeks of slack), then as the one-page
// Gantt chart with milestones, a go/no-go and the steering-group dates. The
// whiteboard and, at the end, the A4 on the table fill in with the same
// drawing, in miniature.
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
// The worked example of pm.plan.schedule, asserted against the lesson's
// current text (the build fails if it drifts), then computed with a forward
// pass (the critical path method: earliest start = the latest finish of what a
// task waits for). The {n:...} numbers are checked against the Dutch lesson
// text by defineFilm. Facts as in the lesson and standard texts (PMI, PMBOK
// Guide, schedule management; Kelley and Walker 1959 on the 1957 DuPont and
// Remington Rand method; Clark 1922 on Henry Gantt's charts of the 1910s).
const SCH = 'pm.plan.schedule';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const EX = lessons.nl.get(SCH).example.text;
const EXEN = lessons.en.get(SCH).example.text;
const TEACH = lessons.nl.get(SCH).teach.join('\n');
for (const s of ['De nulmeting (A) duurt 3 weken', '(B, 4 weken)', '(D, 2 weken)', '(C, 6 weken)', '(E, 6 weken) heeft D en C nodig',
  'A-B-D-E = 3 + 4 + 2 + 6 = 15 weken', 'A-C-E = 3 + 6 + 6 = 15 weken', 'Allebei kritiek', 'in week 1 kan starten', 'De einddatum blijft 15 weken', '3 weken speling']) {
  assert(EX.includes(s), `the Dutch example no longer says "${s}"`);
}
for (const s of ['(A) takes 3 weeks', 'B, 4 weeks', 'D, 2 weeks', 'C, 6 weeks', 'E, 6 weeks', 'can start in week 1', '3 weeks of slack']) assert(EXEN.includes(s), `the English example no longer says "${s}"`);
for (const s of ['1957', 'DuPont en Remington Rand', 'jaren 1910', 'drie tot zes weken', 'MS Project', 'Wat heb je van een ander nodig voordat je kunt beginnen?']) assert(TEACH.includes(s), `the Dutch teach text no longer says "${s}"`);
const DUR = { A: 3, B: 4, C: 6, D: 2, E: 6 };
const NEEDS = { A: [], B: ['A'], C: ['A'], D: ['B'], E: ['D', 'C'] };
// forward pass; cFree: C no longer waits for A (it starts in week 1, alongside A)
function pass({ cFree = false, late = {} } = {}) {
  const es = {};
  const ef = {};
  for (const t of ['A', 'B', 'C', 'D', 'E']) {
    const needs = t === 'C' && cFree ? [] : NEEDS[t];
    es[t] = Math.max(0, ...needs.map((n) => ef[n]));
    ef[t] = es[t] + DUR[t] + (late[t] || 0);
  }
  return { es, ef, end: ef.E };
}
const base = pass();
assert(DUR.A + DUR.B + DUR.D + DUR.E === 15 && DUR.A + DUR.C + DUR.E === 15 && base.end === 15, 'both chains 15 weeks, end week 15');
assert(pass({ late: { C: 1 } }).end === 16 && pass({ late: { D: 1 } }).end === 16, 'a week late on either chain moves the end a week');
const moved = pass({ cFree: true });
const SLACK = moved.es.E - moved.ef.C;
assert(moved.end === 15 && moved.ef.C === 6 && moved.es.E === 9 && SLACK === 3, 'C from week 1: end stays 15, C done after week 6, E starts after week 9: 3 weeks of slack');
assert(pass({ cFree: true, late: { C: 2 } }).end === 15 && pass({ cFree: true, late: { C: 4 } }).end === 16, 'a slip within the slack is absorbed, beyond it the end moves');
const MILES = [3, 9, 15]; // nulmeting klaar, pilot start, go/no-go: every 6 weeks
assert(MILES.every((m, i) => !i || (m - MILES[i - 1] >= 3 && m - MILES[i - 1] <= 6)), 'milestones every three to six weeks');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
// the room as small as the cast allows, fitted with a thin pad, so the people read larger at 390 px
const ROOM = { w: 290, d: 228, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
// tall week cells: the side wall is seen edge-on, so the height carries the strip at 390 px
const CAL = w.calendar({ y0: 30, z0: 104, weeks: 15, cw: 12.6, ch: 46 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const PLAN = w.sheet({ x: 140, y: 154, z: TZ, w: 29.7, d: 21 });
const DOC_AT = w.at([155, 165, TZ]);
// the panel's drawing area that the board and the A4 copy, in stage units
const PANEL_AREA = { x: 324, y: 66, w: 300, h: 254 };
const GANTT_AREA = PANEL_AREA;
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const docMini = `<g transform="${PLAN.face}"><g class="pm-mini" transform="${fitInto(GANTT_AREA, 1.2, 1.2, 28.5, 19.8)}">${g('dMini', '')}</g></g>`;
// the calendar strip's steering-group days (weeks 3, 9 and 15, in their own cells)
const calMarks = `<g transform="${CAL.face}">${[3, 9, 15].map((wk) => { const [a, b, c, d] = CAL.cell(wk - 1); return `<circle class="pm-pin" cx="${((a + c) / 2).toFixed(1)}" cy="${((b + d) / 2).toFixed(1)}" r="3.4"/>`; }).join('')}</g>`;

const world = [
  w.room(ROOM),
  w.clock(258, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calMarks),
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
const PX = 322;
const PW = 308;
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '')
  + cueG('gantt', g('pAxis', '') + cueG('deps', g('pDeps', '')) + cueG('tasks', g('pCards', '') + cueG('crit', g('pCrit', ''))) + cueG('slack', g('pSlack', ''))
    + cueG('miles', g('pMiles', '')) + cueG('gonogo', g('pGo', '')) + cueG('steer', g('pCal', '')))
  + g('pText', ''));

// Static paths with relative line-tos (the helper of eng.mechanics.load): the
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
  { from: [150, 210, 1], to: [150, 200, 1.07] },
  { from: [150, 180, 1.07], to: [140, 170, 1.1] },
  { from: [140, 170, 1.1], to: [150, 190, 1.04] },
  { from: [150, 190, 1.04], to: [140, 170, 1.1] },
  { from: [140, 170, 1.1], to: [150, 200, 1.03] },
  { from: [DOC_AT[0], DOC_AT[1], 1.03], to: [DOC_AT[0], DOC_AT[1], 1.3] },
];

// ---------------------------------------------------------------- the film
const DURS = [46, 50, 50, 50, 46, 56];
const C = {
  DUR, SLACK, MILES, PX, PW, PANEL_AREA, GANTT_AREA,
  // the network layout (scene 1–2): A, then B and D above, C below, E
  L0: { A: [330, 138, 58, 46], B: [404, 82, 58, 46], D: [478, 82, 58, 46], C: [404, 194, 132, 46], E: [556, 138, 58, 46] },
  ROWY: { A: 138, B: 82, D: 82, C: 194, E: 138 },
  X0: 338, WK: 17.6,
  GX0: 466, GWK: 10, GY0: 90, GDY: 40, GH: 26,
  dur: DURS,
};
const spec = {
  id: 'pm.plan.schedule',
  title: { nl: 'Het kritieke pad schuift', en: 'The critical path moves' },
  lessons: [SCH],
  scenes: [
    {
      id: 's1', lesson: SCH, level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Wie wacht op wie?', en: 'Who waits for whom?' },
      beats: [
        { nl: 'Een planningsproject bij een netbeheerder: vijf taken op het bord.', en: 'A planning project at a grid operator: five tasks on the board.', focus: ['tasks', 'board'] },
        { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: dit werk kan pas beginnen als ander werk af is.', en: 'A {t:Dependency|dependency}: this work can only start when other work is finished.', cue: { Afhankelijkheid: 'deps' }, focus: 'deps' },
        { nl: 'Vraag elke eigenaar: “Wat heb je van een ander nodig voordat je kunt beginnen?”', en: 'Ask each owner: “What do you need from someone else before you can start?”', focus: ['teamlead', 'planner', 'deps'] },
        { nl: 'Bij klanten gaat het vaak om mensen en besluiten: een handtekening, de OR, een productiestop.', en: 'At clients it is often people and decisions: a sign-off, the works council, a production stop.', focus: ['sponsor', 'note'] },
      ],
    },
    {
      id: 's2', lesson: SCH, level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Het kritieke pad', en: 'The critical path' },
      beats: [
        { nl: 'A {n:3} weken, dan B {n:4} en D {n:2}; C {n:6} weken. De pilot E, {n:6} weken, wacht op D én C.', en: 'A {n:3} weeks, then B {n:4} and D {n:2}; C {n:6} weeks. The pilot E, {n:6} weeks, waits for D and C.', focus: ['tasks', 'deps'] },
        { nl: 'Het {t:Kritiek pad|kritieke pad}: de langste keten van afhankelijk werk. Die bepaalt de einddatum.', en: 'The {t:Critical path|critical path}: the longest chain of dependent work. It sets the end date.', cue: { 'Kritiek pad': 'crit' }, focus: 'crit' },
        { nl: 'Keten A-B-D-E: {n:3} + {n:4} + {n:2} + {n:6} = {n:15} weken.', en: 'Chain A-B-D-E: {n:3} + {n:4} + {n:2} + {n:6} = {n:15} weeks.', focus: ['crit', 'note'] },
        { nl: 'Keten A-C-E: {n:3} + {n:6} + {n:6} = {n:15} weken. Even lang: allebei kritiek.', en: 'Chain A-C-E: {n:3} + {n:6} + {n:6} = {n:15} weeks. Just as long: both critical.', focus: ['crit', 'note'] },
      ],
    },
    {
      id: 's3', lesson: SCH, level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Een week te laat', en: 'A week late' },
      beats: [
        { nl: 'Loopt C een week uit, dan schuift de pilot mee, en de einddatum ook.', en: 'If C slips a week, the pilot moves with it, and so does the end date.', focus: ['late', 'end'] },
        { nl: 'Hetzelfde voor B of D. Houd het kritieke pad scherp in de gaten.', en: 'The same for B or D. Watch the critical path closely.', focus: ['late', 'end'] },
        { nl: 'Valkuil: de trage stappen buiten het team ontbreken, zoals IT-toegang of een vergunning.', en: 'Typical failure: the slow steps outside the team are missing, like IT access or a permit.', focus: ['taskC', 'note'] },
        { nl: 'Sneller? Alleen een korter kritiek pad helpt. Te kort, en een andere keten wordt kritiek.', en: 'Faster? Only a shorter critical path helps. Too short, and another chain becomes critical.', focus: 'crit' },
      ],
    },
    {
      id: 's4', lesson: SCH, level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Speling', en: 'Slack' },
      beats: [
        { nl: 'Jij vraagt IT: kan de toegangsaanvraag in week {n:1} starten, naast de nulmeting?', en: 'You ask IT: can the access request start in week {n:1}, alongside the baseline?', focus: ['jij', 'taskC'] },
        { nl: 'De einddatum blijft {n:15} weken: A-B-D-E is nog steeds de langste keten.', en: 'The end date stays at {n:15} weeks: A-B-D-E is still the longest chain.', focus: ['crit', 'end'] },
        { nl: 'Maar C heeft nu {n:3} weken {t:Speling|speling}: uitlopen zonder dat het eind schuift.', en: 'But C now has {n:3} weeks of {t:Slack|slack}: it can slip without moving the end.', cue: { Speling: 'slack' }, focus: 'slack' },
        { nl: 'Loopt IT twee weken uit, dan schuift de einddatum niet meer op.', en: 'If IT is two weeks late, the end date no longer moves.', focus: ['late', 'slack', 'end'] },
      ],
    },
    {
      id: 's5', lesson: SCH, level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Mijlpalen en go/no-go', en: 'Milestones and go/no-go' },
      beats: [
        { nl: 'Een {t:Mijlpaal|mijlpaal} is een moment, geen activiteit: een ruitje, geen balk.', en: 'A {t:Milestone|milestone} is a moment, not an activity: a diamond, not a bar.', cue: { Mijlpaal: 'miles' }, focus: 'miles' },
        { nl: 'De belangrijkste: een {t:Go/no-go|go/no-go}. Doorgaan of uitrollen, of stoppen.', en: 'The most important kind: a {t:Go/no-go|go/no-go}. Continue or roll out, or stop.', cue: { 'Go/no-go': 'gonogo' }, focus: 'gonogo' },
        { nl: 'Goede mijlpalen zijn besluiten of zichtbare resultaten, ongeveer elke drie tot zes weken.', en: 'Good milestones are decisions or visible results, about every three to six weeks.', focus: ['miles', 'gonogo'] },
        { nl: 'Ze geven de stuurgroep iets om te checken, en het team iets om op te mikken.', en: 'They give the steering group something to check, and the team something to aim at.', focus: ['sponsor', 'teamlead', 'miles'] },
      ],
    },
    {
      id: 's6', lesson: SCH, level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De planning op één A4', en: 'The plan on one page' },
      beats: [
        { nl: 'Op één A4 als {t:Gantt-chart|Gantt-chart}: resultaten als rijen, weken als kolommen, een eigenaar per rij.', en: 'On one page as a {t:Gantt chart|Gantt chart}: deliverables as rows, weeks as columns, an owner per row.', cue: { 'Gantt-chart': 'gantt' }, focus: ['gantt', 'doc'] },
        { nl: 'Leg hem naast de kalender van de klant: stops, vakanties, piekseizoen, stuurgroepdatums.', en: 'Check it against the client’s calendar: shutdowns, holidays, peak season, steering group dates.', focus: ['calendar', 'steer'] },
        { nl: 'Hang hem op waar het team werkt. Wat mensen elke dag zien, wordt gecorrigeerd.', en: 'Hang it where the team works. What people see every day gets corrected.', focus: 'board' },
        { nl: 'MS Project rekent de paden uit; een planning aan de muur krijgt meer correcties van de vloer.', en: 'MS Project calculates the paths; a wall plan gets more corrections from the floor.', focus: ['laptop', 'board', 'teamlead'] },
        { nl: 'Vraag bij elke review: “Wat moet er deze maand gebeuren om de einddatum te halen?”', en: 'Ask at every review: “What has to happen this month for the end date to hold?”', focus: ['jij', 'note'] },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat. A lesson with a film no longer shows
// its worked example, so every point of the five teach blocks and of the
// worked example is said here (checked item by item; see the commit). No
// symbols the voice would read aloud: "plus" and "is" for + and =, no quotes or
// parentheses. Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex): bare "IT" is read as the English word "it" (said "de
// IT-afdeling", which espeak-ng spells, I T); "deadline" is read "dee-ad-lie-ne"
// (not used: "einddatum", as the lesson); "Gantt-chart" is read well with its
// hyphen. Dutch-only SAY rules in films/_kit/timeline.mjs (2026-11-12, this
// film only says these words): go/no-go without "slash", pilot as "pailot",
// stuurgroep, mijlpaal, nulmeting, gereedheidscheck and piekseizoen split at
// the head.
const SAY = [
  [ // s1 who waits for whom
    { nl: 'Een planningsproject bij een netbeheerder. Jij, de adviseur, staat bij het bord met de sponsor, de teamleider en de planner. Vijf taken: de nulmeting, de gereedheidscheck ontwerpen, de planners trainen, systeemtoegang regelen voor de pilotregio, en de pilot zelf.',
      en: 'A planning project at a grid operator. You, the consultant, stand at the board with the sponsor, the team lead and the planner. Five tasks: the baseline analysis, designing the readiness check, training the planners, arranging system access for the pilot region, and the pilot itself.' },
    { nl: 'Sommig werk kan pas beginnen als ander werk af is. Dat heet een {t:Afhankelijkheid|afhankelijkheid}. Je kunt de nieuwe gereedheidscheck niet testen voordat de planners ermee akkoord zijn. Op het bord wordt elke afhankelijkheid een pijl.',
      en: 'Some work can only start when other work is finished. That is a {t:Dependency|dependency}. You can\'t pilot the new readiness check before the planners agree on it. On the board, each dependency becomes an arrow.' },
    { nl: 'Hoe vind je ze? Vraag elke eigenaar: wat heb je van een ander nodig voordat je kunt beginnen? De teamleider kan pas trainen als de check ontworpen is. En de pilot heeft getrainde planners nodig, en toegang tot het systeem.',
      en: 'How do you find them? Ask each owner: what do you need from someone else before you can start? The team lead can only train once the check is designed. And the pilot needs trained planners, and access to the system.' },
    { nl: 'Bij klanten gaan de meeste afhankelijkheden niet over taken, maar over mensen en besluiten: een handtekening, de ondernemingsraad, een productiestop. Die zet je net zo goed op het bord.',
      en: 'At clients, most dependencies are not about tasks but about people and decisions: a sign-off, the works council, a production stop. Those go on the board too.' },
  ],
  [ // s2 the critical path
    { nl: 'Nu de duur. De nulmeting, A, duurt {n:3} weken. Daarna twee ketens. De check ontwerpen, B, {n:4} weken, met daarna de planners trainen, D, {n:2} weken. En systeemtoegang regelen, C, {n:6} weken. De pilot, E, duurt {n:6} weken en heeft D en C allebei nodig.',
      en: 'Now the durations. The baseline, A, takes {n:3} weeks. Then two chains. Designing the check, B, {n:4} weeks, followed by training the planners, D, {n:2} weeks. And arranging system access, C, {n:6} weeks. The pilot, E, takes {n:6} weeks and needs both D and C.' },
    { nl: 'Tel elke keten op, van start tot eind. De langste keten van afhankelijk werk heet het {t:Kritiek pad|kritieke pad}, en die bepaalt de einddatum. De methode stamt uit 1957, van DuPont en Remington Rand.',
      en: 'Add up each chain, from start to finish. The longest chain of dependent work is the {t:Critical path|critical path}, and it sets the end date. The method dates from 1957, from DuPont and Remington Rand.' },
    { nl: 'Keten A, B, D, E: {n:3} plus {n:4} plus {n:2} plus {n:6} is {n:15} weken.',
      en: 'Chain A, B, D, E: {n:3} plus {n:4} plus {n:2} plus {n:6} is {n:15} weeks.' },
    { nl: 'En keten A, C, E: {n:3} plus {n:6} plus {n:6} is ook {n:15} weken. Twee ketens van {n:15} weken: allebei kritiek.',
      en: 'And chain A, C, E: {n:3} plus {n:6} plus {n:6} is also {n:15} weeks. Two chains of {n:15} weeks: both are critical.' },
  ],
  [ // s3 a week late
    { nl: 'Loopt de systeemtoegang een week uit, dan kan de pilot pas een week later beginnen, en schuift de einddatum een week op.',
      en: 'If the system access slips a week, the pilot can only start a week later, and the end date moves a week.' },
    { nl: 'Hetzelfde geldt voor de check en de training: ook die keten is kritiek. Dus houd je het kritieke pad scherp in de gaten. Taken buiten dat pad mogen een beetje uitlopen; daar raak je niet van in paniek.',
      en: 'The same goes for the check and the training: that chain is critical too. So you watch the critical path closely. Tasks off that path may slip a bit; you don\'t panic about those.' },
    { nl: 'Bekende valkuil: de planning toont alleen taken die het team zelf in de hand heeft. De langzame stappen erbuiten ontbreken, zoals de IT-toegang, een leverancier of een vergunning. Juist die blijken vaak het kritieke pad. Hier is dat C.',
      en: 'A typical failure: the plan shows only tasks the team controls. The slow outside steps are missing, like IT access, a supplier or a permit. These often turn out to be the critical path. Here that is C.' },
    { nl: 'Moet het sneller, dan helpt alleen het kritieke pad korter maken. Maak je het te kort, dan wordt een andere keten kritiek. Met twee kritieke ketens moet je hier dus allebei inkorten.',
      en: 'If you need to go faster, only shortening the critical path helps. Shorten it too much and another chain becomes critical. With two critical chains, here you would have to shorten both.' },
  ],
  [ // s4 slack
    { nl: 'Dus vraag jij de IT-afdeling of de toegangsaanvraag in week {n:1} kan starten, in plaats van na de nulmeting. Dat kan: C loopt nu naast A.',
      en: 'So you ask IT whether the access request can start in week {n:1}, instead of after the baseline. It can: C now runs alongside A.' },
    { nl: 'De einddatum blijft {n:15} weken, want A, B, D en E is nog steeds {n:15} weken lang.',
      en: 'The end date stays at {n:15} weeks, because A, B, D, E is still {n:15} weeks long.' },
    { nl: 'Maar de toegang is nu klaar na week {n:6}, en de pilot begint pas na week 9. Daartussen zit {n:3} weken {t:Speling|speling}: hoeveel een taak kan uitlopen zonder dat de einddatum verschuift.',
      en: 'But access is now ready after week {n:6}, and the pilot only starts after week 9. In between lie {n:3} weeks of {t:Slack|slack}: how much a task can slip without moving the end date.' },
    { nl: 'Loopt de IT-afdeling nu twee weken uit, dan vangt de speling dat op, en schuift de einddatum niet meer.',
      en: 'If IT is now two weeks late, the slack absorbs it, and the end date no longer moves.' },
  ],
  [ // s5 milestones and go/no-go
    { nl: 'Dan de {t:Mijlpaal|mijlpalen}. Een mijlpaal is een moment, geen activiteit. Niet de analysefase, maar het moment dat de gereedheidscheck is vastgesteld, of dat de pilot start. Op de planning een ruitje, geen balk.',
      en: 'Then the {t:Milestone|milestones}. A milestone is a moment, not an activity. Not the analysis phase, but the moment the readiness check is agreed, or the pilot starts. On the plan, a diamond, not a bar.' },
    { nl: 'De belangrijkste soort is een {t:Go/no-go|go/no-go}: het besluit om door te gaan of uit te rollen, dus overal in te voeren, of te stoppen. Hier na de pilot, in week {n:15}.',
      en: 'The most important kind is a {t:Go/no-go|go/no-go}: the decision to continue or roll out, that is, introduce it everywhere, or to stop. Here after the pilot, in week {n:15}.' },
    { nl: 'Goede mijlpalen zijn besluiten of zichtbare resultaten, ongeveer elke drie tot zes weken. Hier om de zes weken: in week {n:3}, 9 en {n:15}.',
      en: 'Good milestones are decisions or visible results, about every three to six weeks. Here every six weeks: in week {n:3}, 9 and {n:15}.' },
    { nl: 'Ze geven de stuurgroep, het vaste besluitoverleg met de sponsor, iets om te checken, en het team iets om op te mikken.',
      en: 'They give the steering group, the sponsor\'s regular decision meeting, something to check, and the team something to aim at.' },
  ],
  [ // s6 the plan on one page
    { nl: 'Zet de planning op één A4 als {t:Gantt-chart|Gantt-chart}, genoemd naar Henry Gantt, die zulke schema\'s in de jaren 1910 tekende. Resultaten als rijen, weken als kolommen, balken voor het werk, mijlpalen als ruitjes, en een eigenaar per rij.',
      en: 'Put the plan on one page as a {t:Gantt chart|Gantt chart}, named after Henry Gantt, who drew such charts in the 1910s. Deliverables as rows, weeks as columns, bars for the work, milestones as diamonds, and an owner per row.' },
    { nl: 'Leg hem naast de kalender van de klant: stops, vakanties, piekseizoen, en de datums van de stuurgroep. Valt de pilot in een stop, dan zie je dat nu.',
      en: 'Check it against the client\'s calendar: shutdowns, holidays, peak season, and the steering group dates. If the pilot falls in a shutdown, you see it now.' },
    { nl: 'Hang hem op waar het team werkt. Een planning die mensen elke dag zien, wordt gecorrigeerd. Een planning in een map wordt vergeten.',
      en: 'Hang it on the wall where the team works. A plan people see every day gets corrected. A plan in a file gets forgotten.' },
    { nl: 'Over software verschillen experts. Een groot pakket als MS Project rekent de paden voor je uit. Maar een planning aan de muur krijgt meer correcties van de vloer.',
      en: 'Experts argue about software. A big tool like MS Project calculates the paths for you. But a wall plan gets more corrections from the floor.' },
    { nl: 'Stel bij elke bespreking één scherpe vraag: wat moet er deze maand gebeuren om de einddatum te halen?',
      en: 'Ask one sharp question at every review: what has to happen this month for the end date to hold?' },
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
// no symbol the voice would read aloud, no spoken parenthesis or quote, and no bare IT or deadline
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '').replace(/\bgo\/no-go\b/g, 'go no-go'); // the SAY rules say go/no-go without the slash
  if (/[/&×=+()“”"‘]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && (/\bIT\b(?!-)/.test(plain) || /deadline/i.test(plain))) throw new Error(`narration: bare IT or deadline in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-late{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:4 3}
.pm-slack{fill:color-mix(in srgb,var(--fp-accent) 12%,transparent);stroke:var(--fp-accent);stroke-width:1.6;stroke-dasharray:5 3}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-end{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:6 4}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-dot{fill:var(--anatomy-mid)}
.pm-strip{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
[data-cue][data-on] .pm-arrow{stroke:var(--fp-accent);stroke-width:2.4}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] .pm-slack{stroke-width:2.4}
[data-cue][data-on] .pm-strip{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-end{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-late{stroke:var(--fp-accent);stroke-width:1.8}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-crit,.pm-mini .pm-arrow,.pm-mini .pm-slack,.pm-mini .pm-late{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-end,.pm-mini .pm-strip,.pm-mini .pm-dia{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard, een klok en een stopcontact; aan de zijwand een kalenderstrook met vijftien weken. Jij, de adviseur in petrol, staat bij het bord en schrijft. De teamleider staat aan het linkereind van een vergadertafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel liggen een stapel papier, een laptop, twee kopjes en de planning op één A4. Rechts een paneel, gemarkeerd als voorbeeld: vijf taken A tot en met E van 3, 4, 6, 2 en 6 weken als kaarten met pijlen, daarna op een weekas met het kritieke pad in petrol, een week vertraging, speling van 3 weken, mijlpalen als ruitjes en tot slot de Gantt-chart met een eigenaar per rij en de stuurgroepdatums.',
  en: 'A meeting room. On the back wall a whiteboard, a clock and a socket; on the side wall a calendar strip of fifteen weeks. You, the consultant in petrol, stand at the board, writing. The team lead stands at the left end of a meeting table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table lie a stack of paper, a laptop, two cups and the plan on one page. At the right a panel, marked as an example: five tasks A to E of 3, 4, 6, 2 and 6 weeks as cards with arrows, then on a week axis with the critical path in petrol, a week of delay, 3 weeks of slack, milestones as diamonds and finally the Gantt chart with an owner per row and the steering group dates.',
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

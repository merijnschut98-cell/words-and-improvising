// Dev tool, not shipped. Builds the explainer film "De stakeholderkaart komt tot
// leven / The stakeholder map comes alive" for three lessons of Projecten:
// pm.intake.stakeholders (Wie beslist, wie kan het stoppen; level 1),
// pm.plan.raci (RACI en de rol van de sponsor; level 2) and pm.lead.influence
// (Invloed zonder macht; level 3).
//
//   node films/pm.intake.stakeholders/build.mjs            build the page
//   node films/pm.intake.stakeholders/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.intake.stakeholders.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.intake.stakeholders: faces placed on a power-interest map; a blocker moves
// after a one-to-one, currencies exchanged; the RACI grid fills per result).
// Storyboard drift: the plan's three scenes are nine, because lessons with a
// film no longer show their worked example, so the film carries every point
// of the three lessons' teach text and worked examples (checklist below).
//
// A people film, built from the shared pm world (films/_pm/world.mjs): the
// meeting room with the whiteboard, the wall calendar (steering-group days every
// four weeks), the table with the A4, and the recurring cast: "jij" the
// consultant in petrol, the sponsor, the team lead and the planner. They stand
// in for the people of each worked example (the sponsor is the director of
// customer connections, the regional manager, the plant manager; the team lead
// the regional team leads, the head of execution, the shift leads; the planner
// the work planners, Ans, the planner). At the right a panel in stage space,
// labelled "voorbeeld" (an example) or "schema" (a diagram): the roles, the
// stakeholder map with people as pills that move, the escalation ladder, the
// org chart, the currencies, the stance map, the RACI per deliverable and the
// sponsor's agreements. The whiteboard and the A4 fill in with the same drawing
// in miniature.
//
// Checklist, every lesson point and where it is (scene, beat; said unless
// marked: "card" = a panel line or drawing, on screen for at least the rest of
// its beat; "caption" = in the beat's caption):
//   intake.stakeholders teach 1: stakeholder, anyone who affects or is affected
//     (s1 b1); four roles: sponsor owns budget and result and decides (s1 b2);
//     process owner runs the process, lives with the change; users, whose work
//     changes (s1 b3); blockers, interest, power or time affected, often IT,
//     the works council, a shift lead with twenty years of service (s1 b4);
//     one person, two roles (s1 b4 caption and card)
//   teach 2: the map's two axes, influence (stop or speed up) and interest (does
//     their work change) (s2 b1); Mendelow, 1981, often cited as 1991 (s2 b1
//     card); high on both involve weekly; high influence low interest keep
//     satisfied, short updates in their terms; low influence high interest keep
//     informed and let them join, they know the details (s2 b2); draw it on
//     paper in a quarter of an hour after the intake, update monthly, people
//     move on the map (s2 b4, the users' pill moves)
//   teach 3: the three questions (s3 b1); a laugh and a name, one-on-one this
//     week (s3 b2; write it down: caption, the name pill); the works council
//     early, consent on working times such as shift rosters, or a project
//     stalls for months (s3 b4; WOR art. 27: card)
//   teach 4: resistance rarely says no: missed meetings, people not freed up,
//     "let's discuss it in the MT" (s4 b1); don't escalate first; escalation
//     defined; go and ask "what would this need to look like to work for your
//     team?" (s4 b2); escalate to the sponsor only when truly blocked, and tell
//     the person beforehand (s4 b3)
//   teach 5: the failure, only names from the org chart; the real power with a
//     planner everyone asks, or the union rep (s5 b1); experts argue whether to
//     show the map; a neutral version for the team, own notes private (s5 b2);
//     "low support" on a slide does damage (s5 b2 card); the sharp question
//     (s5 b3)
//   example: grid operator, faster connections for small business customers
//     (s1 b1; lead time, weeks from request to working connection: card);
//     sponsor director of customer connections (s1 b2); process owner head of
//     work preparation (s1 b3; the team that readies permits, materials and
//     crews: card); users 12 work planners and 40 technicians (s1 b3 caption
//     and card); influential and quiet: the IT owner of the planning system
//     and the team leads who assign crews; nobody invited them; three
//     one-on-ones in week one (s2 b3; leads high on both: caption, the pill);
//     crews pulled to faults 30% of the time, key data (s3 b3)
//   lead.influence teach 1: you can't order, you trade; currencies: help,
//     information, visibility, time saved, a problem off their plate (s6 b1);
//     Cohen and Bradford, 1990; interests: judged on, kept awake by, want to
//     avoid (s6 b1 card); a stakeholder can help or block (s1 b1)
//   teach 2: people repay what they receive, so give first: the data, a finding
//     before the steering committee, defined, often monthly (s6 b2);
//     reciprocity, Cialdini 1984, fix a report, not manipulation if genuine
//     (s6 b2 card); small real help builds credit (s6 b2 caption)
//   teach 3: credibility, even as the youngest, from precision, doing what you
//     said when you said it, being on the floor (s6 b3); one observation beats
//     ten slides (s6 b3 card); "interesting, let's see", then nothing (s6 b4);
//     one wrong number in week 2, every number checked (s6 b4 caption, card)
//   teach 4: map before you move: influence, stance from against to for
//     (s7 b1); ten to fifteen names (s7 b1 caption); win first the influential
//     neutral one others listen to (s7 b2), often a respected shift lead, not
//     the most senior (s7 b2 card); keep the sponsor in reserve, each use
//     spends goodwill (s7 b4)
//   teach 5: one-on-one before any group meeting, nobody likes a surprise in
//     front of peers; "what would make this worth it for you?" (s7 b5); "who
//     should I talk to first?", the weekly report for two free mornings,
//     most start with the movable middle rather than the critics, what does a
//     yes bring them (s7 b5 card; the last also caption)
//   example (faded, with its reveal): week 4, the readiness check on Tuesday
//     (s7 b1); fewer jobs cancelled in the week, the check confirms permits,
//     material and access before a crew drives out (s7 b1 card); the head of
//     planning for it, with little sway (the planning pill: for, low influence,
//     all of s7); Ans, work preparer, neutral, others listen: start with her,
//     the data, holes in the check, adopt her fix visibly (s7 b2); 25 years,
//     everyone asks her (s7 b2 caption, card); the head of execution, still
//     doubting, one-on-one, his currency fewer wasted crew trips, "what would
//     have to be in this for you to back it?" (s7 b3; the crews respect him:
//     card); the sponsor kept in reserve, Ans explains on Tuesday (s7 b4; the
//     regional manager: card)
//   plan.raci teach 1: RACI, a table of roles per deliverable, the English
//     words (s8 b1); Responsible does the work; Accountable owns and says it
//     is done, exactly one (s8 b2); Consulted before, two-way; Informed after;
//     two names under A, nobody owns it (s8 b3); ten Cs, slow decisions (s8 b3
//     card)
//   teach 2: one owner per deliverable from the client side, who runs it after
//     you leave; a client who owns nothing only watches: a red flag (s8 b5);
//     you responsible for the analysis (s8 b5 card); in week one (caption)
//   teach 3: the sponsor's role in writing: steering group every four weeks,
//     scope within a week, obstacles, explaining why (s9 b1, the calendar's
//     pins); "what can I count on you for, and how do I reach you?" (s9 b1
//     card)
//   teach 4: two managers both deciding the shift roster; "who decides if you
//     disagree?"; else the sponsor; week 2, not week 12 (s9 b2; don't solve it
//     yourself: card)
//   teach 5: failures: made alone, too many Cs, filed and forgotten; RASCI,
//     DACI; the conversation counts more than the letters (s9 b3; S for
//     Support, Driver, Approver: card); the sharp question (s9 b4)
//   example: cable manufacturer, weekly planning, the new planning meeting
//     (s8 b1); its row R planner, A operations manager, C shift leads and
//     sales, I plant manager (s8 card, from b1 to the end); capacity model:
//     R you, A planner (s8 b4; hours per machine per week: card); four
//     agreements with the sponsor: chairs the steering group every four weeks,
//     scope within a week, opens the talk with sales, tells the shift leads why
//     (s9 b1); 30 minutes with the plant manager (s9 b1 card)
//
// Terms: all 16, with a cue, except Sponsor of pm.plan.raci (skipped: the same
// name as the intake lesson's Sponsor, which the build resolves first). The
// English "Stakeholder map" names two terms (Stakeholdermap of the intake
// lesson, Stakeholderkaart of lead.influence); the kit resolves it to the
// lesson of its Dutch twin (films/_kit/build-film.mjs, findTerm).
//
// Spoken Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex) and Whisper on Piper audio: new Dutch SAY rules in
// films/_kit/timeline.mjs for stakeholder(map), proceseigenaar and the RACI
// words Responsible, Accountable and Informed (only this film says them).
// Reworded instead of new rules: "manager" (read "maa-naa-ger") is never
// said in Dutch: plant manager is "de fabrieksdirecteur", operations manager
// "het hoofd productie", the two managers "twee leidinggevenden"; organogram
// (stressed on "OR") is "het schema van wie onder wie valt"; slides are dia's;
// goodwill is "krediet"; the works council is said in full, never "OR";
// planningssysteem (stressed on "-teem") is "de IT-eigenaar van de planning";
// updates ("up-DAA-tes") is "kort bijpraten"; intake ("IN-taa-ke") is "het
// eerste gesprek"; sceptisch ("sep-") is "die nog twijfelt"; claimen is "willen
// beslissen"; scope ("skoo-pe") is "de omvang". The guard below the narration
// fails the build if one comes back.
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

// ---------------------------------------------------------------- the lessons
// The worked examples, asserted against the lessons' current text (the build
// fails if they drift). The {n:...} numbers are checked by defineFilm.
const STK = 'pm.intake.stakeholders';
const INF = 'pm.lead.influence';
const RACI = 'pm.plan.raci';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return [...l.teach, l.example.text, l.example.reveal || ''].join('\n'); };
const want = {
  [STK]: { nl: ['Sponsor: directeur klantaansluitingen', 'Proceseigenaar: hoofd werkvoorbereiding', '12 werkvoorbereiders en 40 monteurs', 'de IT-eigenaar van het planningssysteem', 'niemand heeft ze uitgenodigd', 'drie één-op-ééntjes', '30% van de tijd naar storingen', 'Mendelow toegeschreven (1981, vaak aangehaald als 1991)', 'WOR, art. 27', 'in een kwartier op papier', 'twintig dienstjaren'],
    en: ['director of customer connections', 'head of work preparation', '12 work planners and 40 field technicians', '30% of the time', 'three one-on-ones in week one'] },
  [INF]: { nl: ['Cohen en Bradford (Influence Without Authority, 1990)', 'Cialdini maakte het bekend met Influence (1984)', 'Ans, werkvoorbereider', 'met 25 dienstjaren', 'Het hoofd uitvoering is sceptisch', 'Tien tot vijftien namen', 'één fout getal in week 2', 'De regiomanager is je sponsor'],
    en: ['Ans, a work preparer', '25 years in', 'fewer wasted crew trips', 'one wrong number in week 2'] },
  [RACI]: { nl: ['R de planner, A de operations manager, C de ploegleiders en verkoop, I de plantmanager', 'R jij, A de planner', '30 minuten met de sponsor, de plantmanager', 'elke vier weken de stuurgroep', 'Liever in week 2 ontdekken dan in week 12', 'RASCI', 'DACI'],
    en: ['R the planner, A the operations manager, C the shift leads and sales, I the plant manager', 'R you, A the planner', 'for 30 minutes', 'every four weeks'] },
};
for (const [id, langs] of Object.entries(want)) for (const [lang, list] of Object.entries(langs)) for (const s of list) assert(textOf(id, lang).includes(s), `${id} (${lang}) no longer says "${s}"`);

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
const CAL = w.calendar({ y0: 30, z0: 104, weeks: 13, cw: 14.4, ch: 46 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const PAPER = w.sheet({ x: 140, y: 154, z: TZ, w: 29.7, d: 21 });
const DOC_AT = w.at([155, 165, TZ]);
const PANEL_AREA = { x: 330, y: 50, w: 292, h: 250 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const docMini = `<g transform="${PAPER.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, 1.2, 1.2, 28.5, 19.8)}">${g('dMini', '')}</g></g>`;
// steering-group days every four weeks on the wall calendar (weeks 4, 8 and 12)
const STEER = [4, 8, 12];
const calMarks = `<g transform="${CAL.face}">${STEER.map((wk) => { const [a, b, c, d] = CAL.cell(wk - 1); return `<circle class="pm-pin" cx="${((a + c) / 2).toFixed(1)}" cy="${((b + d) / 2).toFixed(1)}" r="3.8"/>`; }).join('')}</g>`;

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
  w.stack({ x: 104, y: 126, z: TZ, n: 3 }),
  cueG('doc', PAPER.svg + docMini),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 262, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 232, y: 208, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Each part the narration names is its own cue group; stage.js fills them per frame.
const PX = 322;
const PW = 308;
const PARTS = ['roles', 'rSponsor', 'rOwner', 'rUsers', 'rBlock',
  'map', 'qWeekly', 'qSatisfy', 'qInform', 'tSponsor', 'tOwner', 'tUsers', 'tIT', 'tLeads',
  'asks', 'note', 'or', 'signs', 'escal', 'chart', 'tPower', 'private',
  'cur', 'give', 'cred', 'smap', 'tAns', 'tExec', 'tPlanning', 'tReserve', 'oneone',
  'raci', 'rR', 'rA', 'rC', 'rI', 'blk2', 'owner', 'deals', 'clash', 'vars', 'phone'];
const NEST = { roles: ['rSponsor', 'rOwner', 'rUsers', 'rBlock'], raci: ['rR', 'rA', 'rC', 'rI'] };
const nested = new Set(Object.values(NEST).flat());
const part = (key) => cueG(key, g(key, '') + (NEST[key] || []).map(part).join(''));
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + PARTS.filter((key) => !nested.has(key)).map(part).join('') + g('pText', ''));

// Static paths with relative line-tos (as in pm.plan.schedule): the same
// points, fewer bytes; each rewrite is read back to prove it exact.
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
  { from: [150, 200, 1.06], to: [140, 190, 1.1] },
  { from: [120, 170, 1.1], to: [130, 180, 1.05] },
  { from: [150, 190, 1.05], to: [180, 200, 1.1] },
  { from: [180, 200, 1.1], to: [150, 200, 1.03] },
  { from: [150, 200, 1.03], to: [140, 190, 1.09] },
  { from: [140, 200, 1.09], to: [160, 210, 1.04] },
  { from: [DOC_AT[0], DOC_AT[1], 1.02], to: [DOC_AT[0], DOC_AT[1], 1.12] },
  { from: [180, 200, 1.06], to: [150, 200, 1] },
];

// ---------------------------------------------------------------- the film
const DURS = [34, 36, 32, 28, 28, 36, 40, 36, 30];
const B = (nl, en, focus, extra = {}) => ({ nl, en, focus, ...extra });
const spec = {
  id: 'pm.intake.stakeholders',
  title: { nl: 'De stakeholderkaart komt tot leven', en: 'The stakeholder map comes alive' },
  lessons: [STK, INF, RACI],
  strictFocus: true,
  scenes: [
    {
      id: 's1', lesson: STK, level: 1, dur: DURS[0], title: { nl: 'Wie is wie?', en: 'Who is who?' },
      beats: [
        B('Een {t:Stakeholder|stakeholder}: iedereen met invloed op het project, of die er last of baat van heeft.', 'A {t:Stakeholder|stakeholder}: anyone who affects the project, or is affected by it.', ['sponsor', 'teamlead', 'planner'], { cue: { Stakeholder: 'roles' } }),
        B('De {t:Sponsor|sponsor}: eigenaar van budget en resultaat, en kan beslissen.', 'The {t:Sponsor|sponsor}: owns the budget and the result, and can decide.', 'rSponsor', { cue: { Sponsor: 'sponsor' } }),
        B('De {t:Proceseigenaar|proceseigenaar} runt het proces. Gebruikers: {n:12} werkvoorbereiders, {n:40} monteurs.', 'The {t:Process owner|process owner} runs the process. Users: {n:12} work planners, {n:40} technicians.', ['rUsers', 'planner'], { cue: { Proceseigenaar: 'rOwner' } }),
        B('{t:Blokkeerder|Blokkeerders}: hun belang, macht of tijd wordt geraakt. Eén persoon kan twee rollen hebben.', '{t:Blocker|Blockers}: their interest, power or time is affected. One person can hold two roles.', 'teamlead', { cue: { Blokkeerder: 'rBlock' } }),
      ],
    },
    {
      id: 's2', lesson: STK, level: 1, dur: DURS[1], title: { nl: 'Op de kaart', en: 'On the map' },
      beats: [
        B('De {t:Stakeholdermap|stakeholdermap}: invloed tegen belang. Kunnen ze het stoppen? Verandert hun werk?', 'The {t:Stakeholder map|stakeholder map}: influence against interest. Can they stop it? Does their work change?', ['tSponsor', 'tOwner', 'tUsers', 'tIT'], { cue: { Stakeholdermap: 'map' } }),
        B('Allebei hoog: wekelijks betrekken. Veel invloed: tevreden houden. Veel belang: informeren.', 'Both high: involve weekly. High influence: keep satisfied. High interest: keep informed.', ['qWeekly', 'qSatisfy', 'qInform']),
        B('De teamleiders staan hoog op allebei, maar niemand nodigde ze uit. Week één: drie één-op-ééntjes.', 'The team leads are high on both, yet nobody invited them. Week one: three one-on-ones.', ['tLeads', 'teamlead']),
        B('Een kwartier op papier, elke maand bijwerken: mensen schuiven mee met het project.', 'Fifteen minutes on paper, updated monthly: people move as the project moves.', ['doc', 'tUsers']),
      ],
    },
    {
      id: 's3', lesson: STK, level: 1, dur: DURS[2], title: { nl: 'Vraag het gewoon', en: 'Just ask' },
      beats: [
        B('Wie beslist of dit doorgaat? Wie kan het tegenhouden? Wie deed zo’n project al eens?', 'Who decides whether this goes ahead? Who could stop it? And who has done this before?', ['asks', 'jij']),
        B('Op de tweede vraag: een lachje en een naam. Schrijf hem op; deze week één op één.', 'The second question gets a laugh and a name. Write it down; one-on-one this week.', 'board'),
        B('Een teamleider: ploegen gaan {n:30}% van de tijd naar storingen. Cruciale data.', 'A team lead: crews get pulled to faults {n:30}% of the time. Key data.', ['note', 'teamlead']),
        B('Check vroeg de ondernemingsraad: instemming bij nieuwe roosters, anders maanden vertraging.', 'Check the works council early: its consent on shift patterns, or months of delay.', 'or'),
      ],
    },
    {
      id: 's4', lesson: STK, level: 1, dur: DURS[3], title: { nl: 'Weerstand zegt geen nee', en: 'Resistance never says no' },
      beats: [
        B('Weerstand: gemiste afspraken, niemand vrijgemaakt, of “laten we het in het MT bespreken”.', 'Resistance: missed meetings, nobody freed up, or “let’s discuss it in the MT”.', 'signs'),
        B('{t:Escalatie|Escalatie} is de laatste stap. Vraag eerst: hoe werkt dit voor jouw team?', '{t:Escalation|Escalation} is the last step. Ask first: how would this work for your team?', 'jij', { cue: { Escalatie: 'escal' } }),
        B('Zit een besluit echt vast, dan naar de sponsor, en zeg het de persoon vooraf.', 'Truly blocked? Then to the sponsor, and tell the person beforehand.', ['escal', 'sponsor']),
      ],
    },
    {
      id: 's5', lesson: STK, level: 1, dur: DURS[4], title: { nl: 'Waar zit de macht?', en: 'Where is the power?' },
      beats: [
        B('Valkuil: alleen namen uit het organogram. De echte macht: een planner, of de vakbondsman.', 'Pitfall: only names from the org chart. The real power: a planner, or the union rep.', ['chart', 'tPower', 'planner']),
        B('De map voor de klant? Een neutrale versie voor het team, je eigen notities privé.', 'The map for the client? A neutral version for the team, your own notes private.', 'private'),
        B('Vraag de sponsor: wiens steun hebben we nodig die we nog niet hebben?', 'Ask the sponsor: whose support do we need that we don’t have yet?', 'sponsor'),
      ],
    },
    {
      id: 's6', lesson: INF, level: 3, dur: DURS[5], title: { nl: 'Je ruilt', en: 'You trade' },
      beats: [
        B('Opdragen kan niet: je ruilt. {t:Valuta|Valuta}: hulp, informatie, zichtbaarheid, tijd, een probleem minder.', 'You can’t give orders: you trade. {t:Currency|Currency}: help, information, visibility, time, a problem less.', 'jij', { cue: { Valuta: 'cur' } }),
        B('Geef eerst: data, een bevinding vóór de {t:Stuurgroep|stuurgroep}. Kleine, echte hulp bouwt krediet.', 'Give first: data, a finding before the {t:Steering committee|steering committee}. Small, real help builds credit.', 'give', { cue: { Stuurgroep: 'calendar' } }),
        B('{t:Geloofwaardigheid|Geloofwaardigheid}: cijfers die kloppen, doen wat je zei, op de vloer staan.', '{t:Credibility|Credibility}: numbers that are right, doing what you said, being on the floor.', 'jij', { cue: { Geloofwaardigheid: 'cred' } }),
        B('“Interessant, we zien wel.” En dan niks. Eén fout getal in week {n:2}, en alles wordt gecheckt.', '“Interesting, let’s see.” Then nothing. One wrong number in week {n:2}, and everything gets checked.', 'cred'),
      ],
    },
    {
      id: 's7', lesson: INF, level: 3, dur: DURS[6], title: { nl: 'Wie win je eerst?', en: 'Whom do you win first?' },
      beats: [
        B('De {t:Stakeholderkaart|stakeholderkaart}: invloed tegen houding, van tegen tot voor. Tien tot vijftien namen.', 'The {t:Stakeholder map|stakeholder map}: influence against stance, from against to for. Ten to fifteen names.', ['tAns', 'tExec', 'tPlanning'], { cue: { Stakeholderkaart: 'smap' } }),
        B('Win eerst Ans: veel invloed, nog neutraal, {n:25} dienstjaren. Neem haar verbetering zichtbaar over.', 'Win Ans first: high influence, still neutral, {n:25} years in. Adopt her improvement, visibly.', ['tAns', 'planner']),
        B('Dan het hoofd uitvoering, één op één. Zijn valuta: minder ritten voor niks.', 'Then the head of execution, one-on-one. His currency: fewer wasted crew trips.', ['tExec', 'teamlead']),
        B('Houd de sponsor achter de hand. Dinsdag legt Ans zelf uit wat zij verbeterde.', 'Keep the sponsor in reserve. On Tuesday, Ans explains what she improved.', ['tReserve', 'sponsor']),
        B('Eén op één vóór elk groepsoverleg. Wat levert ja zeggen deze persoon op?', 'One-on-one before any group meeting. What does this person get out of a yes?', ['oneone', 'jij']),
      ],
    },
    {
      id: 's8', lesson: RACI, level: 2, dur: DURS[7], title: { nl: 'Eén A per resultaat', en: 'One A per deliverable' },
      beats: [
        B('Een {t:RACI|RACI}: rollen per resultaat, met vier Engelse letters.', 'A {t:RACI|RACI}: roles per deliverable, with four letters.', 'doc', { cue: { RACI: 'raci' } }),
        B('{t:Responsible|Responsible} doet het werk. {t:Accountable|Accountable} zegt “dit is af”: precies één persoon.', '{t:Responsible|Responsible} does the work. {t:Accountable|Accountable} says “this is done”: exactly one person.', 'raci', { cue: { Responsible: 'rR', Accountable: 'rA' } }),
        B('{t:Consulted|Consulted} vooraf, in gesprek. {t:Informed|Informed} achteraf. Twee namen onder A: geen eigenaar.', '{t:Consulted|Consulted} before, two-way. {t:Informed|Informed} after, one way. Two names under A: no owner.', 'raci', { cue: { Consulted: 'rC', Informed: 'rI' } }),
        B('Het capaciteitsmodel: R jij, A de planner.', 'The capacity model: R you, A the planner.', ['blk2', 'jij']),
        B('Eén eigenaar, liefst bij de klant. Wil de klant niets bezitten? Een rode vlag in week één.', 'One owner, from the client side if possible. Client owns nothing? A red flag in week one.', 'owner'),
      ],
    },
    {
      id: 's9', lesson: RACI, level: 2, dur: DURS[8], title: { nl: 'Het RACI-gesprek', en: 'The RACI conversation' },
      beats: [
        B('Spreek de rol van de sponsor af, op papier: stuurgroep, scope, obstakels, uitleggen waarom.', 'Agree the sponsor’s role in writing: steering group, scope, obstacles, explaining why.', ['deals', 'sponsor']),
        B('Twee namen bij het ploegenrooster? Wie beslist als jullie het oneens zijn? Liever week {n:2} dan {n:12}.', 'Two names on the shift pattern? Who decides if you disagree? Better week {n:2} than {n:12}.', 'clash'),
        B('Valkuilen: alleen gemaakt, te veel C’s, opgeborgen. RASCI of DACI: het gesprek telt.', 'Pitfalls: made alone, too many Cs, filed away. RASCI or DACI: the conversation counts.', 'vars'),
        B('Scherpe vraag: als dit misgaat, wiens telefoon gaat dan?', 'A sharp question: if this goes wrong, whose phone rings?', ['phone', 'jij']),
      ],
    },
  ],
  skip: [
    { lesson: RACI, term: 'Sponsor', reason: 'Same name as the term Sponsor of pm.intake.stakeholders, which scene 1 names with its cue (the sponsor in the room); the build resolves a shared term name to the first served lesson. Scene 9 shows what the RACI lesson adds: the sponsor\'s role agreed in writing (steering group every four weeks, scope within a week, obstacles, explaining why).' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: every point of the fifteen teach
// blocks and three worked examples (checklist above), unless the checklist puts
// it on a card. No symbols the voice would read aloud, no quotes or brackets.
const SAY = [
  [ // s1 who is who
    { nl: 'Een netbeheerder wil aansluitingen voor kleinzakelijke klanten sneller leveren. Een {t:Stakeholder|stakeholder} is iedereen die invloed heeft op dat project, of er last of baat van heeft.',
      en: 'A grid operator wants faster connections for small business customers. A {t:Stakeholder|stakeholder} is anyone who affects that project, or is affected by it.' },
    { nl: 'Vier rollen tellen. De {t:Sponsor|sponsor} is eigenaar van budget en resultaat, en beslist: de directeur klantaansluitingen.',
      en: 'Four roles matter. The {t:Sponsor|sponsor} owns the budget and the result, and decides: the director of customer connections.' },
    { nl: 'De {t:Proceseigenaar|proceseigenaar} runt het proces en leeft met de verandering: het hoofd werkvoorbereiding. Gebruikers, van wie het werk verandert: de werkvoorbereiders en monteurs.',
      en: 'The {t:Process owner|process owner} runs the process and lives with the change: the head of work preparation. Users, whose work changes: the work planners and technicians.' },
    { nl: '{t:Blokkeerder|Blokkeerders} zijn wie in belang, macht of tijd geraakt wordt: vaak de IT-afdeling, de ondernemingsraad, of een ploegleider met twintig dienstjaren.',
      en: '{t:Blocker|Blockers} are those whose interest, power or time is hit: often IT, the works council, or a shift lead with twenty years in.' },
  ],
  [ // s2 on the map
    { nl: 'Zet ze op een {t:Stakeholdermap|stakeholdermap}. Invloed: kunnen ze het stoppen of versnellen? Belang: verandert hun werk?',
      en: 'Put them on a {t:Stakeholder map|stakeholder map}. Influence: can they stop it or speed it up? Interest: does it change their work?' },
    { nl: 'Hoog op allebei: wekelijks betrekken. Veel invloed, weinig belang: tevreden houden en kort bijpraten, in hun taal. Andersom: informeren en laten meedoen, zij kennen de details.',
      en: 'High on both: involve weekly. High influence, low interest: keep satisfied, with short updates in their terms. The reverse: keep informed and let them join, they know the details.' },
    { nl: 'Invloedrijk en stil: de IT-eigenaar van de planning en de teamleiders die de ploegen indelen. Niemand nodigde ze uit, dus plan je drie één-op-ééntjes in week één.',
      en: 'Influential and quiet: the IT owner of the planning system and the team leads who assign the crews. Nobody invited them, so you book three one-on-ones in week one.' },
    { nl: 'Teken de map na het eerste gesprek in een kwartier op papier, werk hem elke maand bij: mensen schuiven mee.',
      en: 'Draw it on paper in fifteen minutes after the intake, update it monthly: people move.' },
  ],
  [ // s3 just ask
    { nl: 'Vraag gewoon: wie beslist of dit doorgaat? Wie kan het tegenhouden, ook zonder het te zeggen? En wie deed zo\'n project al eens?',
      en: 'Just ask: who decides whether this goes ahead? Who could stop it, even without saying so? And who has done this before?' },
    { nl: 'Op de tweede vraag volgt vaak een lachje en een naam: spreek die persoon deze week één op één.',
      en: 'The second often gets a laugh and a name: see that person one-on-one this week.' },
    { nl: 'Zo hoor je dat ploegen {n:30} procent van de tijd naar storingen worden gehaald. Cruciale data.',
      en: 'That is how you learn that crews get pulled to fault repairs {n:30} percent of the time. Key data.' },
    { nl: 'Check ook vroeg de ondernemingsraad: die moet instemmen met nieuwe werktijden, zoals ploegenroosters, anders ligt het project maanden stil.',
      en: 'And check the works council early: it must consent to new working times, like shift patterns, or the project stalls for months.' },
  ],
  [ // s4 resistance never says no
    { nl: 'Weerstand klinkt zelden als nee: gemiste afspraken, mensen die niet vrijgemaakt worden, of: laten we het in het managementteam bespreken.',
      en: 'Resistance rarely sounds like no: missed meetings, people who aren\'t freed up, or: let\'s discuss it in the management team.' },
    { nl: '{t:Escalatie|Escalatie}, een vastgelopen punt voorleggen aan iemand hoger die kan beslissen, is niet je eerste stap. Vraag eerst: hoe moet dit eruitzien om voor jouw team te werken?',
      en: '{t:Escalation|Escalation}, taking a blocked issue to someone higher up who can decide, comes last. First ask: what would this need to look like to work for your team?' },
    { nl: 'Zit een besluit echt vast, ga dan naar de sponsor, en zeg het de persoon vooraf.',
      en: 'Only when a decision is truly blocked, go to the sponsor, and tell the person beforehand.' },
  ],
  [ // s5 where is the power
    { nl: 'Valkuil: alleen namen uit het schema van wie onder wie valt. De echte macht zit vaak bij een planner die iedereen om raad vraagt, of bij de vakbondsman.',
      en: 'A typical failure: the map holds only names from the org chart. The real power often sits with a planner everyone asks for advice, or the union rep.' },
    { nl: 'De map aan de klant laten zien? Experts verschillen. Velen houden een neutrale versie voor het team, en hun eigen notities privé.',
      en: 'Show the map to the client? Experts argue about that. Many keep a neutral version for the team, and their own notes private.' },
    { nl: 'Vraag de sponsor: wiens steun hebben we nodig die we nog niet hebben?',
      en: 'Ask the sponsor: whose support do we need that we don\'t have yet?' },
  ],
  [ // s6 you trade
    { nl: 'Je kunt niemand iets opdragen: je ruilt. Wat jij biedt, heet {t:Valuta|valuta}: hulp, informatie, zichtbaarheid, tijdwinst, een probleem minder.',
      en: 'You can\'t order anyone around: you trade. What you offer is {t:Currency|currency}: help, information, visibility, time saved, a problem off their plate.' },
    { nl: 'Mensen geven terug wat ze krijgen. Geef dus eerst: de data die hij al maanden wil, of een bevinding voordat die naar de {t:Stuurgroep|stuurgroep} gaat, de leiding die je project, vaak maandelijks, bewaakt.',
      en: 'People repay what they receive. So give first: the data they have wanted for months, or a finding before it goes to the {t:Steering committee|steering committee}, the senior people who oversee your project, often monthly.' },
    { nl: '{t:Geloofwaardigheid|Geloofwaardigheid}, ook als jongste, komt niet uit een titel: je cijfers kloppen, je doet wat je zei wanneer je het zei, en je staat op de vloer.',
      en: '{t:Credibility|Credibility}, even as the youngest, doesn\'t come from a title: your numbers are right, you do what you said, when you said, and you are on the floor.' },
    { nl: 'Ontbreekt het, dan hoor je: interessant, we zien wel. En dan gebeurt er niks.',
      en: 'When it\'s missing, you hear: interesting, let\'s see. Then nothing happens.' },
  ],
  [ // s7 whom do you win first
    { nl: 'Eerst in kaart brengen, dan bewegen. De {t:Stakeholderkaart|stakeholderkaart} zet iedereen op invloed en op houding, van tegen tot voor. Week vier: dinsdag presenteer jij een gereedheidscheck.',
      en: 'Map before you move. This {t:Stakeholder map|stakeholder map} puts everyone on influence and on stance, from against to for. Week four: on Tuesday you present a readiness check.' },
    { nl: 'Win eerst Ans, werkvoorbereider: veel invloed, nog neutraal, en anderen luisteren naar haar. Toon haar de data, laat haar gaten schieten, en neem haar beste verbetering zichtbaar over.',
      en: 'First win Ans, a work preparer: influential, still neutral, and others listen to her. Show her the data, let her poke holes in it, and visibly adopt her best fix.' },
    { nl: 'Dan het hoofd uitvoering, die nog twijfelt, één op één. Zijn valuta: ploegen die niet voor niks uitrukken. Vraag: wat moet erin zitten om erachter te staan?',
      en: 'Then the sceptical head of execution, one-on-one. His currency: fewer wasted crew trips. Ask: what would have to be in this for you to back it?' },
    { nl: 'Houd de sponsor achter de hand: elke inzet kost krediet. Dinsdag legt Ans zelf uit wat zij verbeterde.',
      en: 'Keep the sponsor in reserve: each call spends goodwill. On Tuesday, Ans explains what she improved.' },
    { nl: 'Praat één op één vóór elk groepsoverleg; niemand wil overvallen worden waar collega\'s bij zijn. Vraag: wat maakt dit de moeite waard voor jou?',
      en: 'Talk one-on-one before any group meeting; nobody likes a surprise in front of peers. Ask: what would make this worth it for you?' },
  ],
  [ // s8 one A per deliverable
    { nl: 'Een kabelfabrikant wil een betere weekplanning. Je maakt een {t:RACI|RACI}: rollen per resultaat, in vier Engelse letters. Eerst voor het nieuwe planningsoverleg.',
      en: 'A cable manufacturer wants better weekly planning. You draft a {t:RACI|RACI}: roles per deliverable, in four letters. First for the new planning meeting.' },
    { nl: '{t:Responsible|Responsible} doet het werk. {t:Accountable|Accountable} is eigenaar van het resultaat en zegt: dit is af. Dat is precies één persoon.',
      en: '{t:Responsible|Responsible} does the work. {t:Accountable|Accountable} owns the result and says: this is done. That is exactly one person.' },
    { nl: '{t:Consulted|Consulted} geeft vooraf input, in gesprek. {t:Informed|Informed} hoort het achteraf. Twee namen onder A: niemand is eigenaar.',
      en: '{t:Consulted|Consulted} gives input before, in a two-way talk. {t:Informed|Informed} hears after, one way. Two names under A: nobody owns it.' },
    { nl: 'En voor het capaciteitsmodel: R jij, A de planner.',
      en: 'And for the capacity model: R you, A the planner.' },
    { nl: 'Eén eigenaar per resultaat, liefst bij de klant, die het draait als jij weg bent. Bezit de klant niets, dan kijkt die alleen toe: een rode vlag.',
      en: 'One owner per deliverable, from the client side, who runs it after you leave. If the client owns nothing, they only watch: a red flag.' },
  ],
  [ // s9 the RACI conversation
    { nl: 'Leg ook de rol van de sponsor vast: elke vier weken de stuurgroep voorzitten, binnen een week over de omvang beslissen, het gesprek met verkoop openen, de ploegleiders uitleggen waarom.',
      en: 'Put the sponsor\'s role in writing too: chairs the steering group every four weeks, decides scope within a week, opens the talk with sales, tells the shift leads why.' },
    { nl: 'Willen twee leidinggevenden allebei over het ploegenrooster beslissen? Vraag: wie beslist er als jullie het oneens zijn? Anders beslist de sponsor. Liever in week {n:2} dan in week {n:12}.',
      en: 'Two managers both claim the shift pattern? Ask: who decides if you disagree? Otherwise the sponsor decides. Better in week {n:2} than in week {n:12}.' },
    { nl: 'Valkuilen: alleen gemaakt, te veel C\'s, of in de la. Varianten als RASCI en DACI bestaan, maar het gesprek telt meer dan de letters.',
      en: 'Failures: made alone, too many Cs, or filed and forgotten. Variants like RASCI and DACI exist, but the conversation counts more than the letters.' },
    { nl: 'Scherpe vraag: als dit misgaat, wiens telefoon gaat dan?',
      en: 'A sharp question: if this goes wrong, whose phone rings?' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// in the part where the Dutch and the English beat overlap (the stage places
// its beats by the page's language).
{
  const resolved = resolveFilm(spec, lessons);
  resolved.scenes.forEach((rs, si) => {
    const span2 = (lang, bi) => { const st = beatStarts(rs, lang); return [st[bi] / rs.dur, bi + 1 < st.length ? st[bi + 1] / rs.dur : 1]; };
    spec.scenes[si].still = 0.9;
    spec.scenes[si].beats.forEach((b, bi) => {
      const [n0, n1] = span2('nl', bi);
      const [e0, e1] = span2('en', bi);
      const [a0, a1] = Math.min(n1, e1) - Math.max(n0, e0) > 0.02 ? [Math.max(n0, e0), Math.min(n1, e1)] : [n0, n1];
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
  });
}
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote; in Dutch
// no word espeak-ng mangles that the header says is reworded
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '');
  if (/[/&×=+()“”"‘%]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /managers?\b|organogram|\bOR\b|\bslides?\b|goodwill|planningssysteem|\bIT\b(?!-)|updates|intake|sceptisch|claimen|\bscope\b/i.test(plain)) throw new Error(`narration: a word espeak-ng mangles in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const C = { PX, PW, STEER, dur: DURS };
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.pm-grid{fill:none;stroke:var(--anatomy-lo);stroke-width:1;stroke-dasharray:4 4}
.pm-quad{fill:color-mix(in srgb,var(--fp-accent) 8%,transparent);stroke:none}
.pm-pill{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4}
.pm-pill.pm-new{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent)}
.pm-pill.pm-res{fill:none;stroke-dasharray:4 3}
.pm-box{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:3 3}
.pm-sheet{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-letter{fill:color-mix(in srgb,var(--fp-accent) 20%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .pm-quad{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent)}
[data-cue][data-on] .pm-pill,[data-cue][data-on] .pm-box,[data-cue][data-on] .pm-sheet,[data-cue][data-on] .pm-letter{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-axis,[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-big{fill:var(--fp-accent-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-pill,.pm-mini .pm-box,.pm-mini .pm-sheet,.pm-mini .pm-letter,.pm-mini .pm-arrow{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-grid,.pm-mini .pm-link{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok; aan de zijwand een kalender met de stuurgroepdagen om de vier weken. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van een vergadertafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel een stapel papier, een laptop, twee kopjes en een A4. Rechts een paneel, gemarkeerd als voorbeeld of schema: de vier rollen, de stakeholdermap met invloed en belang waarop mensen als labels staan en verschuiven, een escalatieladder, een organogram met de echte macht ernaast, de valuta, de stakeholderkaart met invloed en houding waarop Ans en het hoofd uitvoering naar voor schuiven, de RACI per resultaat en de afspraken met de sponsor.',
  en: 'A meeting room. On the back wall a whiteboard and a clock; on the side wall a calendar with the steering-group days every four weeks. You, the consultant in petrol, stand at the board. The team lead stands at the left end of a meeting table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table a stack of paper, a laptop, two cups and a sheet of A4. At the right a panel, marked as an example or a diagram: the four roles, the stakeholder map of influence and interest where people stand as labels and move, an escalation ladder, an org chart with the real power beside it, the currencies, the stakeholder map of influence and stance where Ans and the head of execution move toward for, the RACI per deliverable and the agreements with the sponsor.',
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

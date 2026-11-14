// Dev tool, not shipped. Builds the explainer film "Waterval of rondes /
// Waterfall or rounds" for the Projects course: pm.plan.method (Een werkwijze
// kiezen) of the topic Planning en kritiek pad.
//
//   node films/pm.plan.method/build.mjs            build the page
//   node films/pm.plan.method/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.plan.method.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.plan.method, P2: the same project played both ways; hybrid milestones
// with two-week rounds). Storyboard drift: the plan's four scenes and 90 s are
// seven scenes and about 236 s, because a lesson with a film no longer shows its
// worked example, so the film carries all five teach blocks and the example:
// Scrum gets its own scene (s3), the example two (s5 the plan, s6 the rounds)
// and the people side the last (s7). "Both ways" is s5 beat 2: the readiness
// check as a waterfall (the planners see it only at the end) against rounds.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard, a wall clock and a calendar strip of
// sixteen weeks (the example's milestones in weeks 4, 8 and 16 and its
// two-week rounds), a table with the paper checklist of the example on it (five
// checks, check 4 struck, the switching-plan check added), and the recurring
// cast: "jij" the consultant in petrol at the board, the sponsor, the team lead
// and the planner. A panel at the right, in stage space, carries one card per
// scene, labelled "schema" (a general picture) or "voorbeeld" (the worked
// example); the board in the room repeats it in miniature. Each block of a
// card is its own cue group, so every sentence lights what it explains.
//
// Checklist (lesson point: scene and beat; "card" = on the card, not spoken):
//   teach 1: waterfall, phases in order, analyse, design, build, implement
//     (s1 b1); fixed scope, what the project covers (s1 b2); fits predictable
//     work, hard to change later: a new MS station, medium-voltage substation in
//     a neighbourhood, or moving a production line (s1 b3); plan once in detail,
//     manage deviations (s1 b3); each phase signed off before the next (s1 b2)
//   teach 2: agile, short rounds, each ending with something working users
//     react to (s2 b1); scope moves with what you learn (s2 b2); the Agile
//     Manifesto, 2001, seventeen software developers (s2 b3); fits an unclear
//     solution where users' reaction counts: a new planning meeting, a new
//     dashboard, a screen of key figures, for shift leads (s2 b4)
//   teach 3: Scrum the best-known agile method; rounds called sprints, a fixed
//     period of at most a month, often two weeks (s3 b1); a short planning at
//     the start, a review where users see the result (s3 b2), a look back at how
//     the team worked, the retrospective (s3 b3); in a factory the full method
//     is rarely needed; the core: short rounds, something real at the end,
//     feedback from the floor (s3 b4)
//   teach 4: most improvement projects hybrid: fixed milestones, budget and end
//     date for the steering group, short rounds inside (s4 b1); "pilot live in
//     week 10", the team works there in two-week rounds (s4 b2); a pilot is a
//     small, bounded trial in one place, with an end date and a way back (s4
//     b3); experts doubt pilots prove much, a pilot with extra attention often
//     scores better than the rollout (s4 b4)
//   teach 5: don't sell jargon; a plant manager hearing "scrum" may think of
//     software and chaos (s7 b1); "we work in two-week rounds, and every round
//     you see something working on the floor" (s7 b2); resistance, "the board
//     wants a full plan": give the milestone plan, the rounds are how the team
//     gets there (s7 b3); unsure which approach: "how sure are we about what
//     the solution looks like?" (s7 b4)
//   example: a grid operator, a readiness check (permits, materials and crew in
//     place) before jobs enter the week plan (s5 b1); nobody knows which checks
//     matter (s5 b2); plan for the steering group: baseline done week 4, pilot
//     live week 8, go/no-go for rollout week 16 (s5 b3); inside, two-week
//     rounds (s5 b4); round 1 a paper checklist with five checks, two planners
//     (s6 b1); review: check 4 takes too long and never fails, so it goes (s6
//     b2); round 2 adds the switching plan check the control room asked for (s6
//     b3); by week 8 tested on 60 real jobs, the planners helped shape it, so
//     they defend it (s6 b4)
//   cut in review: a beat on Royce's 1970 paper (correct, but no lesson text,
//     and "the sequence is risky" sat badly next to "fits predictable work")
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
// The lesson's facts, asserted against its current text (the build fails if
// one drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Facts as in the lesson: the Agile Manifesto (2001,
// seventeen signatories), the Scrum Guide (sprints of one month or less, a
// sprint planning, review and retrospective).
const ME = 'pm.plan.method';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (lang) => { const l = lessons[lang].get(ME); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (list, lang = 'nl') => { const t = textOf(lang); for (const s of list) assert(t.includes(s), `${ME} (${lang}) no longer says "${s}"`); };
says(['fases op volgorde, analyseren, ontwerpen, bouwen, invoeren', 'vaste scope', 'MS-station', 'productielijn verhuizen', 'één keer in detail', 'stuurt op afwijkingen', 'wordt afgetekend',
  'korte rondes', 'iets werkends waar gebruikers op reageren', 'beweegt mee met wat je leert', 'in 2001 geschreven door zeventien softwareontwikkelaars', 'nieuw planningsoverleg', 'dashboard',
  'bekendste agile methode', 'hooguit een maand, vaak twee weken', 'korte planning', 'review', 'retrospective', 'De kern is genoeg: korte rondes, aan het eind iets echts, en feedback van de vloer',
  'hybride', 'budget en einddatum', 'pilot live in week 10', 'rondes van twee weken', 'kleine, afgebakende proef op één plek, met een einddatum en een weg terug', 'extra aandacht scoort vaak beter dan de uitrol',
  'verkoop geen jargon', 'software en chaos', 'elke ronde zie je iets werken op de vloer', 'De directie wil een volledig plan', 'mijlpalenplanning', 'Hoe zeker zijn we van hoe de oplossing eruitziet?',
  'gereedheidscheck', 'vergunningen, materiaal en ploeg', 'Niemand weet precies welke checks ertoe doen', 'nulmeting klaar week 4, pilot live week 8, go/no-go voor uitrol week 16',
  'papieren checklist met vijf checks, gebruikt door twee planners', 'check 4 kost te veel tijd en valt nooit af', 'schakelplancheck', 'bedrijfsvoeringscentrum', '60 echte klussen', 'mee vormgegeven, dus ze verdedigen hem']);
says(['baseline done week 4, pilot live week 8, go/no-go for rollout week 16', 'five checks used by two planners', 'check 4 takes too long and never fails', 'switching plan check', '60 real jobs', 'seventeen software developers in 2001'], 'en');
// the example's plan: milestones in weeks 4, 8 and 16, two-week rounds in between
const WEEKS = 16;
const MILES = [4, 8, 16];
const ROUND = 2;
assert(MILES.every((m) => m % ROUND === 0) && WEEKS / ROUND === 8, 'each milestone ends a round: eight two-week rounds to the go/no-go');
const CHECKS = 5;
const DROPPED = 4;
assert(DROPPED <= CHECKS && CHECKS - 1 + 1 === 5, 'five checks, check 4 out, the switching plan check in: still five');

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
// tall week cells: the side wall is seen edge-on, so the height carries the strip at 390 px
const CAL = w.calendar({ y0: 30, z0: 112, weeks: WEEKS, cw: 11.6, ch: 34 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const LIST = w.sheet({ x: 150, y: 150, z: TZ, w: 21, d: 29.7 });
const LIST_AT = w.at([160, 165, TZ]);
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
// the checklist on the table: its lines fill in (s6)
const listLines = `<g transform="${LIST.face}">${g('lLines', '')}</g>`;

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
  cueG('sheet', LIST.svg + listLines),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so the narration can light it.
const PX = 322;
const PW = 308;
const CUES = ['phases', 'signoff', 'scope', 'fits', 'loop', 'react', 'manifesto', 'fitsA', 'scrum', 'sprint', 'review', 'retro', 'core',
  'hybrid', 'miles', 'rounds', 'pilot', 'doubt', 'case', 'both', 'plan', 'round1', 'out', 'round2', 'jobs', 'jargon', 'quote', 'milesplan', 'ask'];
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
  { from: [150, 210, 1], to: [140, 190, 1.08] },
  { from: [150, 190, 1.04], to: [160, 200, 1.1] },
  { from: [150, 200, 1.08], to: [140, 180, 1.02] },
  { from: [150, 200, 1.02], to: [190, 210, 1.08] },
  { from: [CAL_AT[0], CAL_AT[1], 1.04], to: [CAL_AT[0], CAL_AT[1], 1.14] },
  { from: [LIST_AT[0], LIST_AT[1], 1.06], to: [LIST_AT[0], LIST_AT[1], 1.2] },
  { from: [150, 200, 1.1], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
// about the narration's length per scene (words / 2.5), so no second is padding;
// the shortest beat (s3, the retrospective) still holds about 4 s
const DURS = [30, 32, 34, 34, 38, 32, 36];
const C = { PX, PW, CELLS, WEEKS, MILES, ROUND, dur: DURS };
const sc = (id, title, beats) => ({ id, lesson: ME, level: 1, dur: DURS[Number(id.slice(1)) - 1], still: 0.9, title, beats });
const spec = {
  id: 'pm.plan.method',
  title: { nl: 'Waterval of rondes', en: 'Waterfall or rounds' },
  lessons: [ME],
  strictFocus: true,
  scenes: [
    sc('s1', { nl: 'Waterval', en: 'Waterfall' }, [
      { nl: '{t:Waterval|Waterval}: fases op volgorde. Analyseren, ontwerpen, bouwen, invoeren.', en: '{t:Waterfall|Waterfall}: phases in order. Analyse, design, build, implement.', cue: { Waterval: 'phases' }, focus: 'phases' },
      { nl: 'Elke fase wordt afgetekend voor de volgende begint. De scope ligt vast.', en: 'Each phase is signed off before the next starts. The scope is fixed.', focus: ['signoff', 'scope'] },
      { nl: 'Eén keer in detail plannen. Past bij voorspelbaar werk: een MS-station, een lijn verhuizen.', en: 'Plan once in detail. It fits predictable work: an MS station, moving a line.', focus: 'fits' },
    ]),
    sc('s2', { nl: 'Agile', en: 'Agile' }, [
      { nl: '{t:Agile|Agile}: korte rondes, elk met iets werkends waar gebruikers op reageren.', en: '{t:Agile|Agile}: short rounds, each ending in something working that users react to.', cue: { Agile: 'loop' }, focus: 'loop' },
      { nl: 'De scope beweegt mee met wat je leert.', en: 'Scope adjusts as you learn.', focus: ['react', 'planner'] },
      { nl: 'Het woord komt uit het Agile Manifesto, in 2001 geschreven door zeventien softwareontwikkelaars.', en: 'The term comes from the Agile Manifesto, written by seventeen software developers in 2001.', focus: 'manifesto' },
      { nl: 'Past als de oplossing onduidelijk is: een nieuw planningsoverleg, een dashboard voor ploegleiders.', en: 'It fits an unclear solution: a new planning meeting, a dashboard for shift leads.', focus: ['fitsA', 'teamlead'] },
    ]),
    sc('s3', { nl: 'Scrum', en: 'Scrum' }, [
      { nl: '{t:Scrum|Scrum}, de bekendste agile methode. Rondes heten {t:Sprint|sprints}: hooguit een maand, vaak twee weken.', en: '{t:Scrum|Scrum}, the best-known agile method. Rounds are {t:Sprint|sprints}: at most a month, often two weeks.', cue: { Scrum: 'scrum', Sprint: 'sprint' }, focus: ['scrum', 'sprint'] },
      { nl: 'Elke sprint: een korte planning vooraf, en aan het eind een review met de gebruikers.', en: 'Each sprint: a short planning first, and at the end a review with the users.', focus: 'review' },
      { nl: 'Dan de retrospective: hoe werkte het team?', en: 'Then the retrospective: how did the team work?', focus: 'retro' },
      { nl: 'In een fabriek is de kern genoeg: korte rondes, iets echts, feedback van de vloer.', en: 'In a factory the core is enough: short rounds, something real, feedback from the floor.', focus: ['core', 'teamlead'] },
    ]),
    sc('s4', { nl: 'Hybride', en: 'Hybrid' }, [
      { nl: '{t:Hybride|Hybride}: mijlpalen, budget en einddatum voor de stuurgroep, korte rondes daarbinnen.', en: '{t:Hybrid|Hybrid}: milestones, budget and end date for the steering group, short rounds inside.', cue: { Hybride: 'hybrid' }, focus: ['hybrid', 'sponsor'] },
      { nl: 'De stuurgroep ziet: pilot live in week {n:10}. Het team werkt erheen in rondes van twee weken.', en: 'The steering group sees: pilot live in week {n:10}. The team gets there in two-week rounds.', focus: ['miles', 'rounds'] },
      { nl: 'Een {t:Pilot|pilot}: een kleine, afgebakende proef op één plek, met een einddatum en een weg terug.', en: 'A {t:Pilot|pilot}: a small, bounded trial in one area, with an end date and a way back.', cue: { Pilot: 'pilot' }, focus: 'pilot' },
      { nl: 'Experts twijfelen: een pilot met extra aandacht scoort vaak beter dan de uitrol straks.', en: 'Experts doubt pilots prove much: with extra attention, a pilot often beats the rollout.', focus: 'doubt' },
    ]),
    sc('s5', { nl: 'Eén project, twee manieren', en: 'One project, two ways' }, [
      { nl: 'Bij een netbeheerder: een gereedheidscheck voordat klussen in de weekplanning komen.', en: 'At a grid operator: a readiness check before jobs enter the week plan.', focus: ['case', 'jij'] },
      { nl: 'Niemand weet welke checks ertoe doen. Als waterval zien de planners hem pas aan het eind.', en: 'Nobody knows which checks matter. As a waterfall, the planners see it only at the end.', focus: ['both', 'planner'] },
      { nl: 'Voor de stuurgroep: nulmeting week {n:4}, pilot live week {n:8}, go/no-go voor uitrol week {n:16}.', en: 'For the steering group: baseline week {n:4}, pilot live week {n:8}, go/no-go for rollout week {n:16}.', focus: ['plan', 'calendar', 'sponsor'] },
      { nl: 'Daarbinnen: rondes van twee weken, met de planners.', en: 'Inside: two-week rounds, with the planners.', focus: ['rounds', 'calendar'] },
    ]),
    sc('s6', { nl: 'Ronde na ronde', en: 'Round by round' }, [
      { nl: 'Ronde 1: een papieren checklist met vijf checks, gebruikt door twee planners.', en: 'Round 1: a paper checklist with five checks, used by two planners.', focus: ['round1', 'sheet', 'planner'] },
      { nl: 'Review: check 4 kost te veel tijd en valt nooit af. Die gaat eruit.', en: 'Review: check 4 takes too long and never fails. So it goes.', focus: ['out', 'sheet'] },
      { nl: 'Ronde 2: de schakelplancheck erbij, waar het bedrijfsvoeringscentrum om vroeg.', en: 'Round 2: add the switching plan check the control room asked for.', focus: ['round2', 'sheet'] },
      { nl: 'Week {n:8}: getest op {n:60} echte klussen. De planners vormden hem mee, dus ze verdedigen hem.', en: 'Week {n:8}: tested on {n:60} real jobs. The planners helped shape it, so they defend it.', focus: ['jobs', 'planner'] },
    ]),
    sc('s7', { nl: 'Zeg het zonder jargon', en: 'Say it without jargon' }, [
      { nl: 'Verkoop geen jargon. Een plantmanager die scrum hoort, denkt misschien aan software en chaos.', en: 'Don’t sell jargon. A plant manager who hears Scrum may think of software and chaos.', focus: ['jargon', 'sponsor'] },
      { nl: 'Zeg: we werken in rondes van twee weken, en elke ronde zie je iets werken op de vloer.', en: 'Say: we work in two-week rounds, and every round you’ll see something working on the floor.', focus: ['quote', 'jij'] },
      { nl: 'De directie wil een volledig plan? Geef de mijlpalenplanning; de rondes zijn hoe het team er komt.', en: 'The board wants a full plan? Give the milestone plan; the rounds are how the team gets there.', focus: 'milesplan' },
      { nl: 'Twijfel je? Vraag: hoe zeker zijn we van hoe de oplossing eruitziet?', en: 'Unsure? Ask: how sure are we about what the solution looks like?', focus: ['ask', 'jij'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; it carries every point of the
// checklist above. No symbols the voice would read aloud, no quotes or
// parentheses. Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). Kept out of the Dutch narration because espeak-ng
// misreads them (they stay in captions and cards): scope ("skoo-pe": said
// "inhoud"), review ("ree-viw": said "aan het eind ... laten zien"),
// retrospective, checklist (stressed on -list: said "lijst"), schakelplancheck
// (with the ch of "lachen": said "een check op het schakelplan"), live
// ("lie-ve": said "draait"), plantmanager (Dutch "manager": said
// "fabrieksdirecteur"), softwareontwikkelaars ("softwaare-": said
// "ontwikkelaars van software"), mijlpalenplanning (said "een planning met
// mijlpalen"), dashboard ("dasj-boo-ard": said "scherm met kerncijfers", the
// lesson's own gloss), middenspanningsstation and productielijn (stressed at
// the end: said "station voor middenspanning", "een lijn in de fabriek"). Dutch-only SAY rules in
// films/_kit/timeline.mjs for the two words only this film says: agile as
// "etsjail" and hybride as "hiebriede" (reviewed: edzjail reads "edz-yail",
// ed-jail "ed yail"; ed-djail gives the voiced dzj but two stresses and was
// heard as "het jail", while etsjail was heard as agile in a Dutch sentence). Scrum ("skrum"), sprint, budget and
// go/no-go, pilot, stuurgroep, mijlpaal, nulmeting and gereedheidscheck (their
// rules from pm.plan.schedule) read well.
const SAY = [
  [ // s1 waterfall
    { nl: 'Er zijn twee manieren om een project te plannen. De eerste heet {t:Waterval|waterval}: fases op volgorde. Analyseren, ontwerpen, bouwen, invoeren.',
      en: 'There are two ways to plan a project. The first is called {t:Waterfall|waterfall}: phases in order. Analyse, design, build, implement.' },
    { nl: 'Elke fase wordt afgetekend voordat de volgende begint. En de inhoud ligt vast: wat het project omvat, staat vooraf op papier.',
      en: 'Each phase is signed off before the next one starts. And the scope is fixed: what the project covers is on paper up front.' },
    { nl: 'Je plant één keer in detail, en stuurt op afwijkingen. Dat past bij werk dat voorspelbaar is en later moeilijk te veranderen. Denk aan een nieuw station voor middenspanning in de wijk plaatsen, of een lijn in de fabriek verhuizen.',
      en: 'You plan once in detail, and manage deviations. That fits work that is predictable and hard to change later: installing a new medium-voltage substation in a neighbourhood, or moving a production line.' },
  ],
  [ // s2 agile
    { nl: 'De tweede manier heet {t:Agile|agile}: werken in korte rondes. Elke ronde eindigt met iets werkends, waar gebruikers op reageren.',
      en: 'The second way is {t:Agile|agile}: working in short rounds. Each round ends with something working, which users see and react to.' },
    { nl: 'De inhoud beweegt mee met wat je leert. Wat de planners zeggen, stuurt de volgende ronde.',
      en: 'The scope adjusts as you learn. What the planners say steers the next round.' },
    { nl: 'Het woord komt uit het Agile Manifesto, in 2001 geschreven door zeventien ontwikkelaars van software.',
      en: 'The term comes from the Agile Manifesto, written by seventeen software developers in 2001.' },
    { nl: 'Het past bij werk waar de oplossing onduidelijk is en de reactie van gebruikers telt: een nieuw planningsoverleg, of een nieuw scherm met kerncijfers voor ploegleiders.',
      en: 'It fits work where the solution is unclear and the users\' reaction matters: a new planning meeting, or a new dashboard of key figures for shift leads.' },
  ],
  [ // s3 scrum
    { nl: 'De bekendste agile methode is {t:Scrum|scrum}. Daar heten de rondes {t:Sprint|sprints}: een vaste periode van hooguit een maand, vaak twee weken.',
      en: 'The best-known agile method is {t:Scrum|Scrum}. Its rounds are called {t:Sprint|sprints}: a fixed period of at most a month, often two weeks.' },
    { nl: 'Elke sprint begint met een korte planning. Aan het eind laat het team de gebruikers het resultaat zien.',
      en: 'Each sprint starts with a short planning, and ends with a review, where users see the result.' },
    { nl: 'Daarna kijkt het team terug op hoe het werkte.',
      en: 'Then the team looks back at how it worked: the retrospective.' },
    { nl: 'In een fabriek heb je de volledige methode zelden nodig. De kern is genoeg: korte rondes, aan het eind iets echts, en feedback van de vloer.',
      en: 'In a factory you rarely need the full method. The core is enough: short rounds, something real at the end of each, and feedback from the floor.' },
  ],
  [ // s4 hybrid
    { nl: 'De meeste verbeterprojecten zijn {t:Hybride|hybride}: vaste mijlpalen, budget en einddatum voor de stuurgroep, en korte rondes daarbinnen.',
      en: 'Most improvement projects are {t:Hybrid|hybrid}: fixed milestones, budget and end date for the steering group, and short rounds inside.' },
    { nl: 'De stuurgroep ziet één datum: de pilot draait in week {n:10}. Het team werkt daar in rondes van twee weken naartoe.',
      en: 'The steering group sees one date: pilot live in week {n:10}. The team works towards it in two-week rounds.' },
    { nl: 'Een {t:Pilot|pilot} is een kleine, afgebakende proef op één plek, met een einddatum en een weg terug.',
      en: 'A {t:Pilot|pilot} is a small, bounded trial in one area, with an end date and a way back.' },
    { nl: 'Experts twijfelen of pilots veel bewijzen: een pilot met extra aandacht scoort vaak beter dan straks de uitrol.',
      en: 'Experts argue whether pilots prove much: a pilot with extra attention often does better than the rollout will.' },
  ],
  [ // s5 one project, two ways
    { nl: 'Een voorbeeld. Bij een netbeheerder leid jij een project om een gereedheidscheck in te voeren: een controle dat vergunningen, materiaal en ploeg geregeld zijn, voordat een klus in de weekplanning komt.',
      en: 'An example. At a grid operator you lead a project to introduce a readiness check: a check that permits, materials and crew are in place before a job enters the week plan.' },
    { nl: 'Niemand weet precies welke checks ertoe doen. Als waterval zouden de planners de check pas bij de invoering zien. Dus werk je in rondes.',
      en: 'Nobody knows exactly which checks will matter. As a waterfall, the planners would first see the check at the go-live. So you work in rounds.' },
    { nl: 'Voor de stuurgroep een planning met mijlpalen: de nulmeting klaar in week {n:4}, de pilot van start in week {n:8}, en de go/no-go voor de uitrol in week {n:16}.',
      en: 'For the steering group, a milestone plan: baseline done in week {n:4}, pilot live in week {n:8}, and the go/no-go for rollout in week {n:16}.' },
    { nl: 'Daarbinnen werkt het team in rondes van twee weken, met de planners erbij.',
      en: 'Inside it, the team works in two-week rounds, with the planners involved.' },
  ],
  [ // s6 round by round
    { nl: 'Ronde één: een lijst op papier met vijf checks, gebruikt door twee planners.',
      en: 'Round one: a paper checklist with five checks, used by two planners.' },
    { nl: 'Aan het eind van de ronde zeggen ze: check vier kost te veel tijd, en valt nooit af. Dus die gaat eruit.',
      en: 'At the review they say: check four takes too long, and never fails. So it goes.' },
    { nl: 'Ronde twee: er komt een check op het schakelplan bij, waar het bedrijfsvoeringscentrum om vroeg.',
      en: 'Round two: add the switching plan check the control room asked for.' },
    { nl: 'In week {n:8} is de lijst op {n:60} echte klussen getest. En de planners hebben hem mee vormgegeven, dus ze verdedigen hem.',
      en: 'By week {n:8} the checklist has been tested on {n:60} real jobs. And the planners helped shape it, so they defend it.' },
  ],
  [ // s7 without jargon
    { nl: 'Dan de mensenkant: verkoop geen jargon. Een fabrieksdirecteur die scrum hoort, denkt misschien aan software en chaos.',
      en: 'Then the people side: don\'t sell jargon. A plant manager who hears Scrum may think of software and chaos.' },
    { nl: 'Zeg liever dit. We werken in rondes van twee weken, en elke ronde zie je iets werken op de vloer.',
      en: 'Say instead: we work in two-week rounds, and every round you\'ll see something working on the floor.' },
    { nl: 'Weerstand? De directie wil een volledig plan. Geef ze dan de planning met mijlpalen; de rondes zijn hoe het team er komt.',
      en: 'Resistance? The board wants a full plan. Then give them the milestone plan; the rounds are how the team gets there.' },
    { nl: 'En twijfel je welke aanpak past, vraag dan: hoe zeker zijn we van hoe de oplossing eruitziet?',
      en: 'And if you\'re unsure which approach fits, ask: how sure are we about what the solution looks like?' },
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
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '').replace(/\bgo\/no-go\b/g, 'go no-go'); // the SAY rules say go/no-go without the slash
  if (/[/&×=+()“”"‘%€]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /\b(scope|review|retrospective|checklist|live|manager|plantmanager|dashboard)\b|schakelplancheck|softwareontw|mijlpalenplanning|middenspanningsstation|productielijn/i.test(plain)) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}

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
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-dot{fill:var(--anatomy-mid)}
.pm-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent)}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash,.pm-mini .pm-dia{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van zestien weken, met mijlpalen als ruitjes in week 4, 8 en 16 en rondes van twee weken. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel een checklist op papier met vijf checks, waarvan er één wordt doorgestreept en één bijkomt. Rechts een paneel met per scène een kaart: de vier fases van een waterval met aftekenen, de korte rondes van agile en het Agile Manifesto van 2001, een sprint met planning, review en retrospective, een hybride planning met mijlpalen boven en rondes onder en een pilot, de gereedheidscheck van een netbeheerder met zijn planning, de checklist ronde na ronde, en tot slot hoe je het zegt zonder jargon.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of sixteen weeks, with milestones as diamonds in weeks 4, 8 and 16 and two-week rounds. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table a paper checklist with five checks, one of which is struck out and one added. At the right a panel with one card per scene: the four phases of a waterfall with sign-offs, the short rounds of agile and the Agile Manifesto of 2001, a sprint with planning, review and retrospective, a hybrid plan with milestones above and rounds below and a pilot, a grid operator\'s readiness check with its plan, the checklist round by round, and finally how to say it without jargon.',
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

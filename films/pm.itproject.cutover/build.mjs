// Dev tool, not shipped. Builds the explainer film "Het cutover-weekend / The
// cutover weekend" for the Projects course: pm.itproject.cutover (level 3 of
// the topic ERP/MES invoeren: van migratie tot hypercare, in IT-projecten
// leiden).
//
//   node films/pm.itproject.cutover/build.mjs            build the page
//   node films/pm.itproject.cutover/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.itproject.cutover.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.itproject.cutover, P1: "an hour-by-hour weekend with a go/no-go and a
// rollback point, then hypercare"). Storyboard drift: the plan's 140 s are
// about 280 s in eight scenes, because a lesson with a film no longer shows its
// worked example (v16 notes), so the film carries the whole teach text and the
// worked example: the cutover and its plan (s1), the freeze (s2), the go/no-go
// (s3), the point of no return and the dress rehearsal (s4), working back from
// Monday and what goes wrong (s5), then the snack maker's weekend hour by hour
// (s6), its first go/no-go on Saturday (s7) and Sunday 08:00 (s8). The plan's
// "data migration with reconciliation counts" is pm.itproject.migration's own
// teach text and worked example (five teach blocks, the 12,480 articles): not
// served, because with every block said both lessons would need about 1,100
// words, well over the 760 a film may say. Hypercare is pm.itproject.hypercare's
// (not served; pm.land.handover's film covers it): s8 names it once, in
// passing, in that film's words (the extra support after go-live), as what
// follows Monday.
//
// Consistent with the reviewed films: the go/no-go of pm.plan.schedule and
// pm.outside.steering (said through the kit's go/no-go rule, "go, no-go"), the
// generale repetitie of pm.outside.steering's six milestones, hypercare as
// pm.land.handover says it (the kit's haiperkeer rule), ERP as the word and MES
// as letters, as eng.ot.isa95 says them (the kit's rules).
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   cutover teach 1: the cutover, the planned switch from the old system to the
//     new: stop the old, move the last data, start the new (s1 b1); usually over
//     a weekend or a planned shutdown (s1 b2); the cutover plan, the hour-by-hour
//     script: every task with an owner, a start time, a duration and a check
//     (s1 b3); often 200 to 400 lines, nothing improvised (s1 b4)
//   cutover teach 2: the freeze: from a fixed moment, e.g. Friday 18:00, nobody
//     enters anything new in the old system (s2 b1); last orders, last goods
//     movements, then a final stock count (s2 b2); weekend production on paper,
//     entered into the new system afterwards (s2 b3); weeks before, a freeze on
//     settings, so nobody changes the configuration at the last moment (s2 b4)
//   cutover teach 3: a go/no-go at fixed points: go ahead or stop, against
//     criteria agreed in advance (s3 b1); for example: the reconciliation of
//     stock and open orders within tolerance, the key interfaces work (s3 b2),
//     no open blocking defects, the key users ready (s3 b3); a named person
//     decides, usually the sponsor or plant manager; not the partner, who has an
//     interest in going ahead (s3 b4)
//   cutover teach 4: the point of no return (nl) / rollback point (en): the
//     last moment to go back to the old system without losing work (s4 b1;
//     the English card adds "also: point of no return", the lesson's other name,
//     on the card only: the kit's language check keeps the Dutch term name out of
//     the English captions and narration);
//     before it a rollback plan is ready; after it, problems are fixed in the new
//     system, because going back would cost more (s4 b2); place it so a restore
//     would finish well before the first shift (s4 b3); rehearse the whole
//     weekend once in a dress rehearsal, a full trial with a stopwatch (s4 b4)
//   cutover teach 5: in a factory Monday morning sets the clock: the first shift
//     needs orders, labels and the scales at 06:00; work back from that time (s5
//     b1); what often goes wrong: no dress rehearsal, so the data load takes 14
//     hours instead of 9 (s5 b2), and the go/no-go turns into "we're too far in
//     to stop now" (s5 b3); the sharp question: if the go/no-go on Saturday says
//     no, what do the lines do on Monday? (s5 b4)
//   cutover example: a snack maker, a new ERP and MES over one weekend, the plan
//     timed in the dress rehearsal (s6 b1); Friday 18:00 freeze, 18:00 to 21:00
//     final stock count, 21:00 to 06:00 migration of open orders and stock (s6
//     b2); 7.5 hours in the rehearsal plus a 20% margin: 9 hours (s6 b3);
//     Saturday 06:00 to 12:00 reconciliation, 12:00 go/no-go 1, 12:00 to 20:00
//     interfaces on, test orders, test labels (s6 b4); Saturday 20:00 to Sunday
//     08:00 the key users run the main scenarios and the team fixes defects;
//     Sunday 08:00 go/no-go 2, also the point of no return / rollback point: a
//     restore takes 10 hours (s6 b5); Monday 06:00 the first shift on the new
//     system (s6 b6); Saturday 11:30: stock difference 0.2%, within the agreed
//     0.5% tolerance (s7 b1); but the checkweigher interface fails (s7 b2)
//   cutover example, ask and reveal: what to advise at go/no-go 1: go, with a
//     condition (s7 b3); the checkweigher interface only needed from Monday
//     06:00, a window until Sunday 08:00 to fix it (s7 b4); what must be true by
//     Sunday 08:00: it works, or a manual workaround is tested (s8 b1): operators
//     enter weights by hand, checked by a second person (s8 b2); if neither, no-go:
//     the old system restored by about 18:00 on Sunday, well before Monday's
//     first shift (s8 b3); the decision, with the reason, in the cutover log
//     (s8 b4)
//   Not in the film: the lesson's pre and recall questions, its "said" line,
//   situation and sayIt (practice, not teach text).
//
// Facts checked (2026-11-13): every time, duration and percentage is the
// lesson's own and asserted below (7.5 x 1.2 = 9; 08:00 + 10 h = 18:00; 0.2%
// under 0.5%; the load running 14 h instead of 9). Nothing is credited to a
// source: the lesson names none. The terms (cutover, cutover plan, freeze,
// go/no-go, point of no return or rollback point, dress rehearsal) are used as
// in common ERP practice (e.g. SAP's cutover planning; "go/no-go" and "rollback"
// in any IT go-live), as the lesson defines them; the film adds no claim beyond
// the lesson.
//
// The drawing: the shared pm world (films/_pm/world.mjs, read-only here) as a
// war room at the top left: a big wall clock and a whiteboard on the back wall
// with the go/no-go criteria as four tick rows (shapes only, the ticks drawn
// per beat), a table with two laptops (the old and the new system), the cutover
// plan as a thick stack of paper, a sheet for what is written by hand, and a
// checkweigher (a small conveyor scale with a display). People: you (the
// consultant, at the board), the sponsor (who decides), the partner (the Scrum
// film's cast: a Developer with a laptop, pm.agile.scrum/cast.mjs, imported, not
// edited) and the team lead from the floor (the Monday shift). Review
// (2026-11-13): a fifth figure, a key user with a tablet, stood almost wholly
// behind the team lead at 390 px and was dropped; the board's criteria carry
// "key users ready". At the top
// right a panel with one card per scene, labelled "schema" or "voorbeeld". Along
// the bottom the weekend strip, hour by hour from Friday 18:00 to Monday 06:00,
// 9.8 units an hour: the freeze, the blocks of the plan, the two go/no-go
// diamonds, the point of no return flag, the dashed 10-hour restore and the
// Monday shift, with the clock times each beat names (22 units).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the props,
// the board's criteria and each part of the weekend strip.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS, MAX_TOTAL } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lesson's current text (the build
// fails if it drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const CO = 'pm.itproject.cutover';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(CO, ['De cutover is de geplande omschakeling van het oude naar het nieuwe systeem: het oude stoppen, de laatste data verhuizen, het nieuwe starten',
  'Meestal gebeurt dat in een weekend of een geplande stop', 'uur voor uur: elke taak met een eigenaar, een starttijd, een duur en een controle',
  'Vaak 200 tot 400 regels. Niets daarin wordt geïmproviseerd', 'bijvoorbeeld vrijdag 18:00, voert niemand nog iets nieuws in het oude systeem in',
  'Laatste orders, laatste goederenbewegingen, dan een laatste voorraadtelling', 'dan wordt die op papier vastgelegd en daarna in het nieuwe systeem ingevoerd',
  'Weken eerder is er ook een freeze op instellingen, zodat niemand op het laatste moment de configuratie verandert',
  'het besluit om door te gaan of te stoppen, tegen criteria die vooraf zijn afgesproken', 'de afstemming van voorraad en open orders valt binnen de tolerantie',
  'de belangrijkste koppelingen werken, er zijn geen open blokkerende bevindingen, de key users zijn klaar', 'Een benoemd persoon beslist, meestal de sponsor of de plantmanager',
  'Niet de partner, die er belang bij heeft om door te gaan', 'het laatste moment waarop je terug kunt naar het oude systeem zonder werk te verliezen',
  'Daarvoor ligt er een terugdraaiplan klaar. Daarna los je problemen op in het nieuwe systeem, omdat teruggaan meer zou kosten',
  'Leg het zo dat terugzetten ruim voor de eerste ploeg klaar zou zijn', 'Oefen het hele weekend één keer in een generale repetitie: een volledige proef van de cutover, met een stopwatch',
  'In een fabriek bepaalt maandagochtend de klok: de eerste ploeg heeft om 06:00 orders, etiketten en de weegschalen nodig. Reken vanaf die tijd terug',
  'geen generale repetitie, dus het laden van de data duurt 14 uur in plaats van 9', '“we zijn te ver om nog te stoppen”',
  '“Als de go/no-go op zaterdag nee zegt, wat doen de lijnen dan op maandag?”',
  'Een snackfabrikant schakelt in één weekend over op een nieuw ERP en MES', 'getimed in de generale repetitie',
  'Vrijdag 18:00 freeze in het oude systeem. 18:00–21:00 laatste voorraadtelling. 21:00–06:00 migratie van open orders en voorraad (7,5 uur in de generale repetitie, plus 20% marge: 9 uur)',
  'Zaterdag 06:00–12:00 afstemming. Zaterdag 12:00 go/no-go 1. Zaterdag 12:00–20:00 koppelingen aan, testorders, testetiketten',
  'Zaterdag 20:00 tot zondag 08:00 spelen key users de belangrijkste scenario’s na en lost het team bevindingen op',
  'Zondag 08:00 go/no-go 2, tevens het point of no return: het oude systeem terugzetten kost 10 uur. Maandag 06:00 eerste ploeg op het nieuwe systeem',
  'Zaterdag 11:30: het voorraadverschil is 0,2%, binnen de afgesproken tolerantie van 0,5%. Maar de koppeling met de controleweegschalen werkt niet',
  'Wat adviseer je bij go/no-go 1, en wat moet er zondag om 08:00 kloppen?', 'Go, met een voorwaarde',
  'De koppeling met de controleweegschalen is pas vanaf maandag 06:00 nodig, dus er is tot zondag 08:00 tijd om hem te repareren',
  'Dan moet hij werken, of moet een handmatige omweg getest zijn: operators voeren gewichten met de hand in, gecontroleerd door een tweede persoon',
  'Klopt geen van beide om 08:00, dan is het no-go: het oude systeem staat zondag rond 18:00 weer, ruim voor de eerste ploeg op maandag',
  'Het besluit gaat met de reden in het cutoverlogboek']);
says(CO, ['The rollback point, also called the point of no return, is the last moment you can go back to the old system without losing work',
  'the data load takes 14 hours instead of 9', 'the interface with the checkweighers fails', 'which is also the rollback point: restoring the old system takes 10 hours',
  'the old system is restored by about 18:00 on Sunday, well before Monday’s first shift', 'The decision, with the reason, goes in the cutover log'], 'en');
assert(lessons.nl.get(CO).terms.map((t) => t.term).join() === 'Cutover,Cutoverdraaiboek,Freeze,Go/no-go,Point of no return,Generale repetitie', 'the six terms of cutover (nl)');
assert(lessons.en.get(CO).terms.map((t) => t.term).join() === 'Cutover,Cutover plan,Freeze,Go/no-go,Rollback point,Dress rehearsal', 'the six terms of cutover (en)');
for (const lang of ['nl', 'en']) for (const id of [CO, 'pm.itproject.migration', 'pm.itproject.hypercare']) {
  const f = lessons[lang].get(id).film;
  assert(!f || (id === CO && f === 'pm.itproject.cutover'), `${id} (${lang}) has film ${f}: never overwrite another film`);
}
// the weekend in hours from Friday 18:00 (h = 0) to Monday 06:00 (h = 60)
const clock = (h) => `${String(Math.floor((18 + h) % 24)).padStart(2, '0')}:${String(Math.round(((18 + h) % 1) * 60)).padStart(2, '0')}`;
const REHEARSED = 7.5;
const MARGIN = 0.2;
const LOAD_H = REHEARSED * (1 + MARGIN);
assert(Math.abs(LOAD_H - 9) < 1e-9, '7.5 hours plus 20%: 9 hours');
const T = { count: [0, 3], load: [3, 12], recon: [12, 18], gng1: 18, ifc: [18, 26], ku: [26, 38], gng2: 38, shift: 60 };
assert(T.load[1] - T.load[0] === LOAD_H, 'the load block is 9 hours');
const RESTORE_H = 10;
T.restore = [T.gng2, T.gng2 + RESTORE_H];
const want = [[0, '18:00'], [3, '21:00'], [12, '06:00'], [18, '12:00'], [26, '20:00'], [38, '08:00'], [48, '18:00'], [60, '06:00'], [17.5, '11:30']];
for (const [h, s] of want) assert(clock(h) === s, `h ${h} is ${s} (got ${clock(h)})`);
assert(T.restore[1] === 48 && clock(T.restore[1]) === '18:00', 'Sunday 08:00 plus a 10-hour restore: Sunday 18:00');
assert(T.shift - T.restore[1] === 12, 'the restore ends 12 hours before the Monday shift');
const OVERRUN = 14;
assert(clock(T.load[0] + OVERRUN) === '11:00' && T.load[0] + OVERRUN - T.load[1] === 5, 'a 14-hour load ends at 11:00 on Saturday, 5 hours late, an hour before go/no-go 1');
assert(0.2 < 0.5, 'a 0.2% stock difference is within the 0.5% tolerance');
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 280, d: 220, h: 220 };
const RW = 326; // the room's window on the stage: x 0..326, y 0..290
const RH = 290;
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, RW, RH, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the whiteboard: the go/no-go criteria as four rows (a box and a line), the
// ticks drawn by stage.js into "ticks" in the board's face plane (u = x, v = -z)
const BOARD = w.board({ x0: 34, x1: 168, z0: 100, z1: 196 });
const ROWS = [182, 162, 142, 122].map((z) => ({ u: 50, v: -z }));
const rowsSvg = ROWS.map(({ u, v }, i) => `<path class="pm-rule" d="M${u} ${v - 4}h8v8h-8Z"/><path class="pm-rule" style="stroke-width:1.4" d="M${u + 14} ${v}H${[146, 132, 140, 120][i]}"/>`).join('');
const crit = cueG('crit', `<g transform="${BOARD.face}">${rowsSvg}${g('ticks', '')}</g>`);
const TABLE = { x: 72, y: 112, w: 160, d: 66, h: 74 };
const TZ = TABLE.h;
// the checkweigher: a base, a short belt, a post with a display
const SC = { x: 194, y: 128 };
const scale = w.box({ x: SC.x, y: SC.y, w: 32, d: 24, r: 1 }, TZ, TZ + 7, { tone: 'lo' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: SC.x + 2, y: SC.y + 3, w: 28, d: 18, r: 1 }, TZ + 7, TZ + 9, { tone: 'hi' }, { steps: 2 })
  + w.post(SC.x + 28, SC.y + 3, 1.4, TZ + 9, TZ + 22, { tone: 'mid' }, 10)
  + w.box({ x: SC.x + 21, y: SC.y + 1, w: 14, d: 3, r: 0.6 }, TZ + 21, TZ + 31, { tone: 'hi' }, { steps: 2 });
const paper = w.sheet({ x: 160, y: 146, z: TZ, lines: 7 }).svg;
const binder = w.stack({ x: 84, y: 150, z: TZ, n: 7 });
const systems = w.laptop({ x: 112, y: 132, z: TZ, toward: 1 }) + w.laptop({ x: 152, y: 132, z: TZ, toward: 1 });
const world = [
  w.room(ROOM),
  cueG('clock', w.clock(218, 170, 26)),
  cueG('board', BOARD.svg),
  crit,
  w.person({ x: 22, y: 52, role: 'jij', along: 'x', reach: [52, 6, 150] }),
  scrumPerson(w, k, G, P, { x: 146, y: 78, key: 'partner', look: 'dev2', along: 'x' }),
  w.table(TABLE),
  cueG('systems', systems),
  cueG('binder', binder),
  cueG('paper', paper),
  cueG('scale', scale),
  w.cup(222, 166, TZ),
  w.person({ x: 258, y: 146, role: 'sponsor', along: 'y' }),
  w.person({ x: 96, y: 212, role: 'teamlead', along: 'x' }),
].join('');
for (const r of ['jij', 'sponsor', 'teamlead', 'partner', 'clock', 'board', 'crit', 'systems', 'binder', 'paper', 'scale']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel and the strip (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 328;
const PW = 304;
const CUES = ['cut', 'when', 'cplan', 'lines',
  'freeze', 'last', 'paperc', 'settings',
  'gng', 'crit1', 'crit2', 'who',
  'ponr', 'back', 'place', 'dress',
  'monday', 'wrong', 'toofar', 'askc',
  'snack', 't1', 't2', 't3', 't4', 't5',
  'diff', 'fail', 'go', 'window',
  'cond', 'manual', 'nogo', 'log'];
// the weekend strip: x of hour h, its parts each a cue group
const STRIP = { x0: 26, ph: 9.8, y0: 294, y1: 396 };
// sLoad after sRecon: the 14-hour load's overrun (s5) lies over the reconciliation block
const SPARTS = ['sAxis', 'sCount', 'sRecon', 'sIf', 'sKu', 'sLoad', 'sRestore', 'sFreeze', 'sGng1', 'sGng2', 'sPonr', 'sShift', 'sWindow'];
assert(r1(STRIP.x0 + 60 * STRIP.ph) <= 616, 'the strip ends inside the stage');
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="10" width="${PW}" height="278" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''))
  + g('strip', `<rect class="pm-panel" x="8" y="${STRIP.y0}" width="624" height="${STRIP.y1 - STRIP.y0}" rx="10"/>`
  + SPARTS.map((c) => cueG(c, g(c, ''))).join('') + g('sTimes', ''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.scaled.hybrid): the same points, fewer bytes; each rewrite is read back.
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">`
  + `<clipPath id="co-room"><rect x="0" y="0" width="${RW}" height="${RH}"/></clipPath>`
  + `<g clip-path="url(#co-room)">${g('world', world)}</g>${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const AT = (p) => w.at(p).map(r1);
const BOARD_AT = AT([100, 0, 150]);
const TABLE_AT = AT([150, 145, TZ]);
const CLOCK_AT = AT([218, 0, 170]);
const MID = [RW / 2, RH / 2, 1];
const CAM = [
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1], 1.1] },
  { from: [TABLE_AT[0], TABLE_AT[1], 1.04], to: [TABLE_AT[0], TABLE_AT[1] + 20, 1.14] },
  { from: [BOARD_AT[0], BOARD_AT[1], 1.04], to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.12] },
  { from: MID, to: [CLOCK_AT[0], CLOCK_AT[1] + 30, 1.1] },
  { from: [CLOCK_AT[0], CLOCK_AT[1] + 30, 1.06], to: MID },
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1], 1.08] },
  { from: [TABLE_AT[0], TABLE_AT[1], 1.06], to: [TABLE_AT[0] + 20, TABLE_AT[1], 1.16] },
  { from: [TABLE_AT[0] + 10, TABLE_AT[1], 1.1], to: MID },
];

// ---------------------------------------------------------------- the film
const C = { CUES, SPARTS, STRIP, ROWS, T, CAM_N: CAM.length };
const sc = (id, level, title, beats) => ({ id, lesson: CO, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.itproject.cutover',
  title: { nl: 'Het cutover-weekend', en: 'The cutover weekend' },
  lessons: [CO],
  strictFocus: true,
  scenes: [
    sc('s1', 3, { nl: 'De cutover', en: 'The cutover' }, [
      { nl: '{t:Cutover|Cutover}: het oude stoppen, de laatste data verhuizen, het nieuwe starten.', en: '{t:Cutover|Cutover}: stop the old, move the last data, start the new.', cue: { Cutover: 'cut' }, focus: ['cut', 'systems'] },
      { nl: 'Meestal in een weekend of een geplande stop.', en: 'Usually over a weekend or a planned shutdown.', focus: ['when', 'sAxis'] },
      { nl: 'Het {t:Cutoverdraaiboek|cutoverdraaiboek}: uur voor uur, per taak eigenaar, starttijd, duur, controle.', en: 'The {t:Cutover plan|cutover plan}: hour by hour, each task with owner, start, duration, check.', cue: { Cutoverdraaiboek: 'cplan' }, focus: ['cplan', 'sCount', 'sLoad', 'sRecon', 'sIf', 'sKu'] },
      { nl: 'Vaak {n:200} tot {n:400} regels. Niets daarin wordt geïmproviseerd.', en: 'Often {n:200} to {n:400} lines. Nothing in it is improvised.', focus: ['lines', 'binder'] },
    ]),
    sc('s2', 3, { nl: 'De freeze', en: 'The freeze' }, [
      { nl: '{t:Freeze|Freeze}: vanaf vrijdag 18:00 gaat er niets nieuws meer in het oude systeem.', en: '{t:Freeze|Freeze}: from Friday 18:00, nothing new goes into the old system.', cue: { Freeze: 'freeze' }, focus: ['freeze', 'sFreeze'] },
      { nl: 'Laatste orders, laatste goederenbewegingen, dan de laatste voorraadtelling.', en: 'Last orders, last goods movements, then a final stock count.', focus: ['last', 'sCount'] },
      { nl: 'Productie in het weekend gaat op papier, en daarna in het nieuwe systeem.', en: 'Weekend production goes on paper, and afterwards into the new system.', focus: ['paperc', 'paper', 'teamlead'] },
      { nl: 'Weken eerder al een freeze op instellingen: geen configuratie op het laatste moment.', en: 'Weeks before, a freeze on settings: no configuration changes at the last moment.', focus: ['settings', 'systems'] },
    ]),
    sc('s3', 3, { nl: 'Go/no-go', en: 'Go/no-go' }, [
      { nl: '{t:Go/no-go|Go/no-go}: doorgaan of stoppen, tegen criteria die vooraf zijn afgesproken.', en: '{t:Go/no-go|Go/no-go}: go ahead or stop, against criteria agreed in advance.', cue: { 'Go/no-go': 'gng' }, focus: ['gng', 'sGng1', 'sGng2'] },
      { nl: 'Bijvoorbeeld: de afstemming binnen de tolerantie, de belangrijkste koppelingen werken.', en: 'For example: reconciliation within tolerance, the key interfaces work.', focus: ['crit1', 'crit'] },
      { nl: 'Geen open blokkerende bevindingen, en de key users zijn klaar.', en: 'No open blocking defects, and the key users are ready.', focus: ['crit2', 'crit'] },
      { nl: 'Een benoemd persoon beslist: de sponsor of de plantmanager. Niet de partner.', en: 'A named person decides: the sponsor or plant manager. Not the partner.', focus: ['who', 'sponsor', 'partner'] },
    ]),
    sc('s4', 3, { nl: 'Het point of no return', en: 'The rollback point' }, [
      { nl: '{t:Point of no return|Point of no return}: de laatste kans om zonder werkverlies terug te gaan.', en: '{t:Rollback point|Rollback point}: the last chance to go back without losing work.', cue: { 'Point of no return': 'ponr' }, focus: ['ponr', 'sPonr'] },
      { nl: 'Daarvoor ligt een terugdraaiplan klaar. Daarna los je het op in het nieuwe systeem.', en: 'Before it, a rollback plan is ready. After it, you fix problems in the new system.', focus: ['back', 'sRestore'] },
      { nl: 'Leg het zo dat terugzetten ruim voor de eerste ploeg klaar zou zijn.', en: 'Place it so a restore would finish well before the first shift.', focus: ['place', 'sRestore', 'sShift'] },
      { nl: '{t:Generale repetitie|Generale repetitie}: het hele weekend één keer, met een stopwatch.', en: '{t:Dress rehearsal|Dress rehearsal}: the whole weekend once, with a stopwatch.', cue: { 'Generale repetitie': 'dress' }, focus: ['dress', 'clock'] },
    ]),
    sc('s5', 3, { nl: 'Terugrekenen vanaf maandag', en: 'Working back from Monday' }, [
      { nl: 'Maandag 06:00 heeft de eerste ploeg orders, etiketten en weegschalen nodig. Reken terug.', en: 'At 06:00 on Monday the first shift needs orders, labels and the scales. Work back.', focus: ['monday', 'sShift', 'teamlead'] },
      { nl: 'Vaak mis: geen generale repetitie, dus het laden duurt {n:14} uur in plaats van {n:9}.', en: 'Often wrong: no dress rehearsal, so the data load takes {n:14} hours instead of {n:9}.', focus: ['wrong', 'sLoad'] },
      { nl: 'En de go/no-go wordt: “we zijn te ver om nog te stoppen”.', en: 'And the go/no-go turns into “we’re too far in to stop now”.', focus: ['toofar', 'sGng1'] },
      { nl: 'Vraag: als de go/no-go op zaterdag nee zegt, wat doen de lijnen dan op maandag?', en: 'Ask: if the go/no-go on Saturday says no, what do the lines do on Monday?', focus: ['askc', 'jij'] },
    ]),
    sc('s6', 3, { nl: 'Voorbeeld: het draaiboek', en: 'Example: the plan' }, [
      { nl: 'Een snackfabrikant gaat in één weekend over op een nieuw ERP en MES.', en: 'A snack maker switches to a new ERP and MES over one weekend.', focus: ['snack', 'systems'] },
      { nl: 'Vrijdag 18:00 freeze, tot 21:00 de telling, dan van 21:00 tot 06:00 laden.', en: 'Friday 18:00 the freeze, the count until 21:00, then the load from 21:00 to 06:00.', focus: ['t1', 'sFreeze', 'sCount', 'sLoad'] },
      { nl: 'Laden: {n:7.5} uur in de generale repetitie, plus {n:20}% marge: {n:9} uur.', en: 'The load: {n:7.5} hours in the dress rehearsal, plus a {n:20}% margin: {n:9} hours.', focus: ['t2', 'sLoad'] },
      { nl: 'Zaterdag tot 12:00 afstemming, dan go/no-go 1, tot 20:00 koppelingen en testorders.', en: 'Saturday until 12:00 reconciliation, then go/no-go 1, until 20:00 interfaces and test orders.', focus: ['t3', 'sRecon', 'sGng1', 'sIf'] },
      { nl: 'Key users testen tot zondag 08:00. Dan go/no-go 2 en point of no return: terugzetten kost {n:10} uur.', en: 'Key users test until Sunday 08:00. Then go/no-go 2, the rollback point: a restore takes {n:10} hours.', focus: ['t4', 'sKu', 'sGng2', 'sPonr'] },
      { nl: 'Maandag 06:00: de eerste ploeg werkt op het nieuwe systeem.', en: 'Monday 06:00: the first shift works on the new system.', focus: ['t5', 'sShift'] },
    ]),
    sc('s7', 3, { nl: 'Voorbeeld: zaterdag 11:30', en: 'Example: Saturday 11:30' }, [
      { nl: 'Zaterdag 11:30: het voorraadverschil is {n:0.2}%, binnen de tolerantie van {n:0.5}%.', en: 'Saturday 11:30: the stock difference is {n:0.2}%, within the {n:0.5}% tolerance.', focus: ['diff', 'sRecon', 'crit'] },
      { nl: 'Maar de koppeling met de controleweegschalen werkt niet.', en: 'But the interface with the checkweighers does not work.', focus: ['fail', 'scale', 'sIf'] },
      { nl: 'Advies bij go/no-go 1: go, met een voorwaarde.', en: 'The advice at go/no-go 1: go, with a condition.', focus: ['go', 'sGng1', 'sponsor'] },
      { nl: 'De koppeling is pas maandag 06:00 nodig: tot zondag 08:00 is er tijd om te repareren.', en: 'The interface is only needed from Monday 06:00: there is until Sunday 08:00 to fix it.', focus: ['window', 'sWindow', 'scale'] },
    ]),
    sc('s8', 3, { nl: 'Voorbeeld: zondag 08:00', en: 'Example: Sunday 08:00' }, [
      { nl: 'Zondag 08:00: de koppeling werkt, of een handmatige omweg is getest.', en: 'Sunday 08:00: the interface works, or a manual workaround has been tested.', focus: ['cond', 'sGng2', 'scale'] },
      { nl: 'De omweg: operators voeren gewichten met de hand in, een tweede persoon controleert.', en: 'The workaround: operators enter weights by hand, checked by a second person.', focus: ['manual', 'paper', 'teamlead'] },
      { nl: 'Geen van beide: no-go. Het oude systeem staat zondag rond 18:00 weer, ruim voor maandag.', en: 'If neither: no-go. The old system is back by about 18:00 on Sunday, well before Monday.', focus: ['nogo', 'sRestore', 'sShift'] },
      { nl: 'Het besluit gaat met de reden in het cutoverlogboek.', en: 'The decision, with the reason, goes in the cutover log.', focus: ['log', 'binder', 'sponsor'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's teach
// text and worked example, so every point of the checklist above is said here
// or shown on the card. No symbol the voice would read aloud, no spoken
// parenthesis or quote; the quoted sentences are introduced in words. Clock
// times in words (achttien uur, six in the evening). Dutch checked with
// espeak-ng phonemes through Piper's own bridge (nl_NL-alex, 2026-11-13). New SAY
// rules in films/_kit/timeline.mjs (tested; recomputed for every film: no other
// film's spoken text changes): cutover as kattoover (kattoover-draaiboek and
// kattoover-logboek in the compounds), freeze as friez, key users as kie joezers, point of no
// return as pojnt of noo rie-turn, and in this film's phrases only "of de
// plantmanager" (plant-menetsjer) and "met een stopwatch" (stop-wotsj); in
// English cutover as cuttover (en_GB reads "cute-over"). go/no-go, MES and
// hypercare through the kit's existing rules; ERP stays the word, as the films
// with a video say it. Said around because espeak-ng misreads them (they stay in
// the captions and on the cards): go-live (said "na maandag"), scenario's
// (stressed SEE-naa-rio: said "hun belangrijkste processen"),
// controleweegschalen (said "de weegschalen voor de controle") and
// implementatiepartner (said "de partner", as the lesson does), getimed (read
// "ge-TIE-med": said "vol tijden uit") and testetiketten (read "tes-te-tiketten":
// said "etiketten om te testen").
const SAY = [
  [ // s1 the cutover and its plan
    { nl: 'De {t:Cutover|cutover} is de geplande omschakeling van het oude naar het nieuwe systeem: het oude stoppen, de laatste data verhuizen, en het nieuwe starten.',
      en: 'The {t:Cutover|cutover} is the planned switch from the old system to the new one: stop the old, move the last data, and start the new.' },
    { nl: 'Meestal gebeurt dat in een weekend, of tijdens een geplande stop.',
      en: 'It usually happens over a weekend, or during a planned shutdown.' },
    { nl: 'Het script daarvoor is het {t:Cutoverdraaiboek|cutoverdraaiboek}, uur voor uur: elke taak met een eigenaar, een starttijd, een duur en een controle.',
      en: 'Its script is the {t:Cutover plan|cutover plan}, hour by hour: every task with an owner, a start time, a duration and a check.' },
    { nl: 'Vaak zijn dat tweehonderd tot vierhonderd regels, en niets daarin wordt geïmproviseerd.',
      en: 'Often that is two hundred to four hundred lines, and nothing in it is improvised.' },
  ],
  [ // s2 the freeze
    { nl: 'Het begint met een {t:Freeze|freeze}: vanaf een vast moment, hier vrijdag om achttien uur, voert niemand nog iets nieuws in het oude systeem in.',
      en: 'It starts with a {t:Freeze|freeze}: from a fixed moment, here Friday at six in the evening, nobody enters anything new in the old system.' },
    { nl: 'Eerst nog de laatste orders en goederenbewegingen, dan een laatste voorraadtelling.',
      en: 'First the last orders and goods movements, then a final stock count.' },
    { nl: 'Gaat de productie in het weekend door, dan wordt die op papier vastgelegd en daarna in het nieuwe systeem ingevoerd.',
      en: 'If production carries on over the weekend, it is recorded on paper and entered into the new system afterwards.' },
    { nl: 'En weken eerder is er al een freeze op instellingen, zodat niemand op het laatste moment de configuratie verandert.',
      en: 'And weeks before, there is already a freeze on settings, so nobody changes the configuration at the last moment.' },
  ],
  [ // s3 the go/no-go
    { nl: 'Op vaste punten is er een {t:Go/no-go|go/no-go}: het besluit om door te gaan of te stoppen, tegen criteria die vooraf zijn afgesproken.',
      en: 'At fixed points there is a {t:Go/no-go|go/no-go}: the decision to go ahead or stop, against criteria agreed in advance.' },
    { nl: 'Bijvoorbeeld: de afstemming van voorraad en open orders valt binnen de tolerantie, en de belangrijkste koppelingen werken.',
      en: 'For example: the reconciliation of stock and open orders is within tolerance, and the key interfaces work.' },
    { nl: 'Er zijn geen open blokkerende bevindingen, en de key users zijn klaar.',
      en: 'There are no open blocking defects, and the key users are ready.' },
    { nl: 'Een benoemd persoon beslist, meestal de sponsor of de plantmanager. Niet de partner, want die heeft er belang bij om door te gaan.',
      en: 'A named person decides, usually the sponsor or plant manager. Not the partner, who has an interest in going ahead.' },
  ],
  [ // s4 the point of no return and the dress rehearsal
    { nl: 'Het {t:Point of no return|point of no return} is het laatste moment waarop je terug kunt naar het oude systeem zonder werk te verliezen.',
      en: 'The {t:Rollback point|rollback point} is the last moment you can go back to the old system without losing work.' },
    { nl: 'Daarvoor ligt er een terugdraaiplan klaar. Daarna los je problemen op in het nieuwe systeem, omdat teruggaan meer zou kosten.',
      en: 'Before it, a rollback plan is ready. After it, problems are fixed in the new system, because going back would cost more.' },
    { nl: 'Leg het zo dat terugzetten ruim voor de eerste ploeg klaar zou zijn.',
      en: 'Place it so that a restore would still be finished well before the first shift.' },
    { nl: 'En oefen het hele weekend één keer in een {t:Generale repetitie|generale repetitie}: een volledige proef van de cutover, met een stopwatch.',
      en: 'And rehearse the whole weekend once in a {t:Dress rehearsal|dress rehearsal}: a full trial of the cutover, with a stopwatch.' },
  ],
  [ // s5 working back from Monday; what goes wrong
    { nl: 'In een fabriek bepaalt maandagochtend de klok: de eerste ploeg heeft om zes uur orders, etiketten en de weegschalen nodig. Reken vanaf die tijd terug.',
      en: 'In a factory, Monday morning sets the clock: the first shift needs orders, labels and the scales at six. Work back from that time.' },
    { nl: 'Wat vaak misgaat: er is geen generale repetitie, dus het laden van de data duurt veertien uur in plaats van negen.',
      en: 'What often goes wrong: there is no dress rehearsal, so the data load takes fourteen hours instead of nine.' },
    { nl: 'En de go/no-go wordt dan: we zijn te ver om nog te stoppen.',
      en: 'And the go/no-go turns into: we are too far in to stop now.' },
    { nl: 'Een scherpe vraag: als de go/no-go op zaterdag nee zegt, wat doen de lijnen dan op maandag?',
      en: 'A sharp question: if the go/no-go on Saturday says no, what do the lines do on Monday?' },
  ],
  [ // s6 the snack maker's plan
    { nl: 'Een voorbeeld. Een snackfabrikant schakelt in één weekend over op een nieuw ERP en MES, met een draaiboek vol tijden uit de generale repetitie.',
      en: 'An example. A snack maker switches to a new ERP and MES over one weekend, with a plan timed in the dress rehearsal.' },
    { nl: 'Vrijdag om achttien uur de freeze, tot eenentwintig uur de laatste voorraadtelling, en van eenentwintig tot zes uur de migratie van open orders en voorraad.',
      en: 'Friday at six in the evening the freeze, the final stock count until nine, and from nine at night to six in the morning the migration of open orders and stock.' },
    { nl: 'Het laden duurde in de generale repetitie zeven en een half uur. Met twintig procent marge plan je negen uur.',
      en: 'The load took seven and a half hours in the dress rehearsal. With a twenty percent margin, you plan nine hours.' },
    { nl: 'Zaterdag van zes tot twaalf uur de afstemming, om twaalf uur de eerste go/no-go, en tot twintig uur koppelingen aan, testorders, en etiketten om te testen.',
      en: 'Saturday from six to noon the reconciliation, at noon the first go/no-go, and until eight in the evening interfaces on, test orders and test labels.' },
    { nl: 'Dan spelen de key users tot zondag acht uur hun belangrijkste processen na, en lost het team bevindingen op. Om acht uur de tweede go/no-go, ook het point of no return: het oude systeem terugzetten kost tien uur.',
      en: 'Then until eight on Sunday morning the key users run the main scenarios, and the team fixes defects. At eight, the second go/no-go, also the rollback point: restoring the old system takes ten hours.' },
    { nl: 'Maandag om zes uur begint de eerste ploeg op het nieuwe systeem.',
      en: 'On Monday at six, the first shift starts on the new system.' },
  ],
  [ // s7 Saturday 11:30, go/no-go 1
    { nl: 'Zaterdag half twaalf: het voorraadverschil is nul komma twee procent, binnen de afgesproken tolerantie van nul komma vijf procent.',
      en: 'Saturday, half past eleven: the stock difference is zero point two percent, within the agreed tolerance of zero point five percent.' },
    { nl: 'Maar de koppeling met de weegschalen voor de controle werkt niet.',
      en: 'But the interface with the checkweighers fails.' },
    { nl: 'Wat adviseer je bij de eerste go/no-go? Go, met een voorwaarde.',
      en: 'What do you advise at the first go/no-go? Go, with a condition.' },
    { nl: 'Die koppeling is pas vanaf maandag zes uur nodig, dus er is tot zondag acht uur tijd om hem te repareren.',
      en: 'The checkweigher interface is only needed from Monday at six, so there is a window until Sunday at eight to fix it.' },
  ],
  [ // s8 Sunday 08:00, go/no-go 2
    { nl: 'Wat moet er zondag om acht uur kloppen? De koppeling werkt, of er is een handmatige omweg getest.',
      en: 'What has to be true by Sunday at eight? The interface works, or a manual workaround has been tested.' },
    { nl: 'De omweg: operators voeren de gewichten met de hand in, gecontroleerd door een tweede persoon.',
      en: 'The workaround: operators enter the weights by hand, checked by a second person.' },
    { nl: 'Klopt geen van beide om acht uur, dan is het no-go: het oude systeem staat zondag rond achttien uur weer, ruim voor de eerste ploeg op maandag.',
      en: 'If neither is true at eight, it is no-go: the old system is restored by about six on Sunday evening, well before Monday\'s first shift.' },
    { nl: 'Het besluit gaat met de reden in het cutoverlogboek. En na maandag volgt de hypercare: de extra steun na de livegang.',
      en: 'The decision, with the reason, goes in the cutover log. And after Monday comes hypercare: the extra support after go-live.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice, and none of the words espeak-ng misreads (see
// above); checked on the text after the SAY rules, so a word a rule rewrites
// passes and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(cutover\w*|freeze|key users?|point of no return|plantmanager|stopwatch|go-live\w*|scenario's|controleweegschalen|implementatiepartner)\b/i,
  en: /\bcutover\b|\bgo\/no-go\b/i,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S|\d/.test(said)) throw new Error(`narration: a symbol or digit the voice reads aloud in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(MAX_TOTAL, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > MAX_TOTAL) throw new Error(`film is ${total} s, over ${MAX_TOTAL} (words per scene ${said.join(' ')}, all ${all})`);
}
// each beat's still (reduced motion) sits late in its own share of the scene;
// and every beat holds at least 4 s in both languages, so a card-only point is
// on screen long enough to read
{
  const resolved = resolveFilm(spec, lessons);
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
    for (const lang of ['nl', 'en']) {
      const s2 = beatStarts(rs, lang);
      s2.forEach((t, bi) => { const len = (bi + 1 < s2.length ? s2[bi + 1] : rs.dur) - t; if (len < 4) FAILS.push(`${rs.id} beat ${bi + 1} (${lang}) holds ${len.toFixed(1)} s, under 4 s`); });
    }
  });
  if (FAILS.length) throw new Error(`pacing:\n  ${FAILS.join('\n  ')}`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="partner"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-blk{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-over{fill:color-mix(in srgb,var(--fp-accent) 35%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:4 3}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pm-thin{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:3 3}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-dasharray:6 4;stroke-linecap:round}
.pm-dia{fill:var(--anatomy-face);stroke:var(--anatomy-strong);stroke-width:2}
.pm-flag{fill:var(--anatomy-hi);stroke:none}
.pm-tick{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.pm-cross{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
.pm-btick{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.pm-bcross{fill:none;stroke:var(--anatomy-strong);stroke-width:1.6;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-blk{fill:var(--fp-focus);stroke:var(--fp-accent)}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-dia{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-flag{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een war room voor een go-liveweekend. Aan de achterwand een grote klok en een whiteboard met vier vinkregels, de go/no-gocriteria. Op tafel twee laptops, het oude en het nieuwe systeem, het cutoverdraaiboek als dikke stapel papier, een vel voor wat met de hand wordt genoteerd en een controleweegschaal. Jij, de adviseur in petrol, staat bij het bord; de sponsor, die beslist, aan het eind van de tafel; de partner met een laptop erachter, en vooraan de teamleider van de vloer, van de eerste ploeg op maandag. Rechts een paneel met per scène een kaart, gemarkeerd als schema of voorbeeld. Onderaan het weekend uur voor uur, van vrijdag 18:00 tot maandag 06:00: de freeze, de telling, het laden, de afstemming, de koppelingen, de tests van de key users, twee go/no-goruiten, de vlag van het point of no return, de gestippelde tien uur om terug te zetten, en de eerste ploeg op maandag.',
  en: 'A war room for a go-live weekend. On the back wall a big clock and a whiteboard with four tick rows, the go/no-go criteria. On the table two laptops, the old and the new system, the cutover plan as a thick stack of paper, a sheet for what is written by hand, and a checkweigher. You, the consultant in petrol, stand at the board; the sponsor, who decides, at the end of the table; the partner with a laptop behind it, and in front the team lead from the floor, of Monday\'s first shift. At the right a panel with one card per scene, marked as diagram or example. Along the bottom the weekend hour by hour, from Friday 18:00 to Monday 06:00: the freeze, the count, the load, the reconciliation, the interfaces, the key users\' tests, two go/no-go diamonds, the rollback point flag, the dashed ten hours of a restore, and the first shift on Monday.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  // every font size on the stage: drawing and script
  const sizes = new Set([...`${svg}\n${readFileSync(join(HERE, 'stage.js'), 'utf8')}`.matchAll(/font-size="(\d+)"/g)].map((m) => Number(m[1])));
  if ([...sizes].some((s) => s < 22)) throw new Error(`stage text under 22 units: ${[...sizes].join(', ')}`);
  console.log(`stage font sizes: ${[...sizes].join(', ')}`);
}

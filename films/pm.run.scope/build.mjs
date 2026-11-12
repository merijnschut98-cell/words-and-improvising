// Dev tool, not shipped. Builds the explainer film "Vijf kleine verzoeken /
// Five small requests" for the Projects course: pm.run.scope (level 1 of Scope
// en wijzigingen, Scope creep) and pm.negotiate.scope (level 1 of Scope, tarief
// en klanten, Scope en tijd onderhandelen met een klant).
//
//   node films/pm.run.scope/build.mjs            build the page
//   node films/pm.run.scope/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.run.scope.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.run.scope, P2): requests piling up unseen while the status stays green,
// then the trade-off on one sheet. Storyboard drift: the plan's four scenes are
// seven, because the film carries the whole text of both lessons: the
// trade-off and the change request get their own scene (s3), the sheet for the
// sponsor and the people side s4, gold plating and the reserve s5, and the
// negotiation lesson's worked example (a fourth region on a fixed price) s7.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard, a wall clock and a calendar strip of eight
// weeks with a status dot that stays green, a table where the request notes
// pile up and the sheet for the sponsor fills in, and the recurring cast: "jij"
// the consultant in petrol at the board, the sponsor, the team lead and the
// planner (the two who bring the small requests). A panel at the right, in
// stage space, carries one card per scene, labelled "schema" (a general
// picture) or "voorbeeld" (the worked examples); the board in the room repeats
// it in miniature.
//
// Lessons with a film no longer show their worked example, so the film carries
// every point of both lessons' teach text and worked examples.
// Checklist (lesson point: scene):
//   run.scope teach 1: scope is what the project will and won't deliver (s1);
//     scope creep, scope growing unnoticed without a formal agreement; "while
//     you're at it, line 4?", "join the meeting on the new ERP", the
//     company-wide system for orders, stock and planning; each request small
//     and reasonable; signs: new people at your meetings, the goal sentence
//     shifting, you working evenings while the plan says on track (s2)
//   run.scope teach 2: the goal sentence, one line with what the project must
//     achieve, "cancelled jobs in the week before 18% to under 8% by June";
//     test every request against it (s1); make each request visible: what, by
//     whom, why, impact on time, cost, risk and the goal; small things on a
//     weekly list, bigger ones a change request, written with the impact, the
//     sponsor decides (s3)
//   run.scope teach 3: "yes, and here is the cost", line 4 about three weeks
//     extra or the shift handover drops, which do you prefer; not a no but the
//     trade-off, what you give up to get something else; most requests shrink
//     or vanish once priced; never decide alone on scope, it is their project
//     (s3)
//   run.scope teach 4: as a junior, pushing back on a senior client feels
//     risky; you don't, you ask the sponsor to choose; sometimes the change is
//     right because the goal was wrong: change the scope officially with a new
//     goal sentence and plan, not drift; formal projects have a change control
//     board, in most improvement projects the steering group (s4)
//   run.scope teach 5: gold plating, the team adding extras nobody asked for, a
//     nicer dashboard, one more analysis; feels like service, eats the same
//     hours; experts differ: count every hour, or a small reserve for favours
//     that build goodwill, often about 10% of the budget, a rule of thumb not a
//     standard; ask weekly "does everything we worked on this week serve the
//     goal sentence?" (s5)
//   run.scope example: a cable manufacturer, weekly planning, 40 consultant
//     days, the consultant time the client pays (s2); by week 5 yes to five
//     small requests, a sales report, a stock check, a session with the new ERP
//     team, two extra analyses, each about 2 days; 10 days, 25% extra, the plan
//     still green (s2); the list with the impact to the sponsor, option A keep
//     them and the end date moves two weeks, option B drop the stock check and
//     the ERP session; he chooses B and tells sales himself (s4)
//   negotiate.scope teach 1: scope, time and cost hang together, the iron
//     triangle, if one moves something else must; more in the same time for the
//     same budget is asking to cut quality without saying so; your job is not
//     to refuse but to make the trade visible (s6)
//   negotiate.scope teach 2: small yeses add up, five quick extras of a day
//     are a full week on a 20-day project; a simple change log, what was asked,
//     when, how much effort, what was decided; facts instead of who is being
//     difficult (s6). Not said: the pointer to the Run module's change control
//     lessons (navigation, not content).
//   negotiate.scope teach 3: options, not a wall (add it and move the date, or
//     drop a part, or do it as a follow-up); let the client choose, it is their
//     priority; ask what decision the request serves, a lighter version is
//     often enough (s7)
//   negotiate.scope teach 4: confirm in writing, an email after the talk, or
//     for bigger items a change request with the extra work, days and price
//     that the client signs; check with your own manager before committing
//     extra days, you may not be allowed to give them away and your firm
//     carries the cost (s7)
//   negotiate.scope teach 5: on a fixed price the risk of extra effort sits
//     with you, on a day rate the client pays per day and carries it; scope
//     creep hurts most on a fixed price (s6); experts differ on free extras,
//     one given on purpose, named and logged ("this one's on us"), or every
//     free extra teaches the client to ask again; "what would you drop to make
//     room for this?" (s7)
//   negotiate.scope example: fixed price at a grid operator, 20 days, three
//     regions; week 3, the sponsor (the client manager who owns the project)
//     asks for a fourth, "you're in the data anyway"; estimated at 4 extra days
//     (s7); first ask what it is for, a board question behind it; options: add
//     it for 4 days at the agreed day rate, swap it for region 3, or a light
//     version, one key number for region 4 in 1 day; check with your
//     engagement manager before naming a price; confirm by email and add it to
//     the change log (s7)
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
// Both lessons' facts, asserted against their current text (the build fails if
// one drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. No outside source is credited: the film says only what
// the lessons say (the 10% reserve is the lesson's rule of thumb, "geen norm").
const RS = 'pm.run.scope';
const NS = 'pm.negotiate.scope';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(RS, ['Scope is wat het project wel en niet oplevert', 'ongemerkt groeit zonder dat iemand het formeel afspreekt', 'ook even naar lijn 4 kijken', 'het bedrijfsbrede systeem voor orders, voorraad en planning', 'Elk verzoek is klein en redelijk',
  'nieuwe mensen bij je overleggen, een doelzin die verschuift', 'terwijl de planning zegt dat je op koers ligt',
  'één regel die zegt wat het project moet bereiken', 'van 18% naar onder de 8% voor juni', 'Toets elk verzoek daaraan', 'wat er gevraagd wordt, door wie, waarom, en wat het doet met tijd, kosten, risico en het doel',
  'een lijst die je wekelijks doorloopt', 'een schriftelijk verzoek met de impact, waar de sponsor over beslist',
  'ja, en dit kost het', 'ongeveer drie weken extra, of de ploegoverdracht valt af', 'Wat heeft je voorkeur?', 'wat je opgeeft om iets anders te krijgen', 'krimpen of verdwijnen zodra ze een prijs hebben', 'het is niet jouw project, het is het hunne',
  'een senior klant tegen te spreken', 'je vraagt de sponsor om te kiezen', 'omdat het oorspronkelijke doel niet klopte', 'met een nieuwe doelzin en planning', 'wijzigingscommissie', 'doet de stuurgroep dat',
  'extra’s toevoegt waar niemand om vroeg', 'een mooier dashboard, nog één analyse', 'Het voelt als service', 'Sommigen tellen elk uur', 'zo’n 10% van het budget: een vuistregel, geen norm', 'Dient alles waar we deze week aan werkten de doelzin?',
  'kabelfabrikant', 'weekplanning', '40 consultantdagen', 'In week 5', 'een rapportage voor verkoop, een check op voorraadniveaus, een sessie met het nieuwe ERP-team en twee extra analyses', 'Elk ongeveer 2 dagen',
  'Samen: 10 dagen, 25% extra, en de planning staat nog op groen', 'Optie A: we houden ze en de einddatum schuift twee weken', 'Optie B: de voorraadcheck en de ERP-sessie vallen af', 'Hij kiest B en vertelt het verkoop zelf']);
says(NS, ['tijd en kosten hangen aan elkaar', 'duivelsdriehoek', 'Beweegt er één, dan moet er iets anders mee', 'op kwaliteit in te leveren zonder het te zeggen', 'de ruil zichtbaar maken',
  'Kleine ja’s tellen op', 'Vijf “snelle” extraatjes van een dag zijn samen een hele week op een project van 20 dagen', 'wat werd gevraagd, wanneer, hoeveel werk, wat werd besloten', 'over feiten in plaats van over wie er moeilijk doet',
  'Bied opties, geen muur', 'als vervolg', 'Laat de klant kiezen: het is zijn prioriteit', 'vraag altijd voor welk besluit het verzoek is; vaak volstaat een lichtere versie',
  'een mail na het gesprek', 'met het extra werk, de dagen en de prijs, dat de klant tekent', 'check bij je eigen manager', 'je bureau draait op voor de kosten',
  'Bij een vaste prijs ligt het risico van extra werk bij jou', 'betaalt de klant per gewerkte dag en draagt hij dat risico', 'doet het meeste pijn bij een vaste prijs',
  'benoemd en gelogd (“deze is van ons”)', 'elk gratis extraatje de klant leert om weer te vragen', 'Wat zou je laten vallen om hier ruimte voor te maken?',
  'vaste prijs bij een netbeheerder: 20 dagen, drie regio’s', 'In week 3', 'je zit toch al in de data', '4 extra dagen', 'zit er een vraag van de directie achter?', 'tegen het afgesproken dagtarief', 'hem ruilen tegen regio 3',
  'één kerncijfer voor regio 4, in 1 dag', 'engagement manager', 'per mail en zet hem in het wijzigingslog']);
says(RS, ['40 consultant days', 'Each was about 2 days', 'Together: 10 days, 25% extra', 'move the end date by two weeks', 'drop the stock check and ERP session', 'He chooses B and tells sales himself'], 'en');
says(NS, ['20 days, three regions', '4 extra days', 'swap it for region 3', 'in 1 day'], 'en');
// the run example: five requests of about 2 days on 40 days
const BUDGET = 40;
const EACH = 2;
const N = 5;
const EXTRA = N * EACH;
assert(EXTRA === 10 && (EXTRA / BUDGET) * 100 === 25, 'five requests of 2 days: 10 days, 25% of 40');
const DROPPED = 2; // option B drops the stock check and the ERP session
assert(N - DROPPED === 3, 'option B keeps three of the five');
// the negotiation lesson: five extras of a day on 20 days are a full (five-day) week
const SMALL = 20;
assert(N * 1 === 5 && SMALL === 20, 'five quick extras of a day: a full working week on a 20-day project');
const REGION = { days: 20, regions: 3, extra: 4, light: 1 };
assert(REGION.light < REGION.extra, 'the light version is cheaper than the full fourth region');

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

const WEEKS = 8;
const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const CAL = w.calendar({ y0: 60, z0: 118, weeks: WEEKS, cw: 16, ch: 28 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 196, y: 150, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([206, 165, TZ]);
const PILE_AT = w.at([118, 140, TZ]);
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
// the calendar's week cells (local u, v of the side wall) and a point on its header for the status dot
const CELLS = Array.from({ length: WEEKS }, (_, i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const HEAD = [Math.round((CELLS[WEEKS - 1][2] - 6) * 10) / 10, Math.round((CELLS[0][1] - 6) * 10) / 10];
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
// the request notes on the table, in the table top's plane (local x, y from its corner; a slight turn each)
const NOTES = [[0, 0, -6], [12, 3, 5], [3, 13, 9], [16, 15, -4], [7, 26, 3]];
const PILE = `<g transform="${w.planeTop(104, 124, TZ + 0.2)}">${g('nPile', '')}</g>`;
// the sheet for the sponsor: its lines fill in (s4)
const sheetLines = `<g transform="${SHEET.face}">${g('dLines', '')}</g>`;

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
  cueG('pile', PILE),
  cueG('paper', SHEET.svg + sheetLines),
  cueG('laptop', w.laptop({ x: 160, y: 140, z: TZ, toward: 1 })),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each part of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['scope', 'goal', 'test', 'budget', 'quotes', 'reqs', 'status', 'creep', 'signals', 'list', 'cr', 'quote', 'trade', 'sheet', 'opts', 'optB', 'official', 'ccb',
  'gold', 'reserve', 'weekly', 'tri', 'quality', 'week', 'log', 'fixed', 'rate', 'regions', 'ask', 'mgr', 'free'];
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
const CAM = [
  { from: [150, 210, 1], to: [120, 190, 1.08] },
  { from: [PILE_AT[0], PILE_AT[1], 1.04], to: [PILE_AT[0], PILE_AT[1], 1.14] },
  { from: [150, 190, 1.04], to: [140, 170, 1.1] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.06], to: [SHEET_AT[0], SHEET_AT[1], 1.18] },
  { from: [120, 200, 1.05], to: [130, 210, 1.1] },
  { from: [150, 200, 1.02], to: [150, 190, 1.08] },
  { from: [180, 200, 1.06], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const DURS = [24, 44, 42, 44, 30, 42, 62];
const C = { PX, PW, CUES, CELLS, HEAD, NOTES, BUDGET, EACH, SMALL, dur: DURS };
const sc = (id, lesson, title, beats) => ({ id, lesson, level: 1, dur: DURS[Number(id.slice(1)) - 1], still: 0.9, title, beats });
const spec = {
  id: 'pm.run.scope',
  title: { nl: 'Vijf kleine verzoeken', en: 'Five small requests' },
  lessons: [RS, NS],
  strictFocus: true,
  scenes: [
    sc('s1', RS, { nl: 'Wat het project oplevert', en: 'What the project delivers' }, [
      { nl: '{t:Scope|Scope}: wat het project wel en niet oplevert.', en: '{t:Scope|Scope}: what the project will and won’t deliver.', cue: { Scope: 'scope' }, focus: 'scope' },
      { nl: 'De {t:Doelzin|doelzin}: één regel. Voorbeeld: afgezegde klussen van {n:18} naar onder {n:8}%, voor juni.', en: 'The {t:Goal sentence|goal sentence}: one line. Example: cancelled jobs from {n:18} to under {n:8}%, by June.', cue: { Doelzin: 'goal' }, focus: 'goal' },
      { nl: 'Toets elk verzoek aan de doelzin: dient het wat we moeten bereiken?', en: 'Test every request against the goal sentence: does it serve what we must achieve?', focus: ['test', 'goal'] },
    ]),
    sc('s2', RS, { nl: 'Vijf kleine verzoeken', en: 'Five small requests' }, [
      { nl: 'Een kabelfabrikant: de weekplanning verbeteren, begroot op {n:40} consultantdagen.', en: 'A cable manufacturer: improving the weekly planning, planned at {n:40} consultant days.', focus: 'budget' },
      { nl: '“Kun je ook even naar lijn 4 kijken?” “Schuif je aan bij het ERP-overleg?” Klein en redelijk.', en: '“Can you also look at line 4?” “Could you join the ERP meeting?” Small and reasonable.', focus: ['quotes', 'teamlead', 'planner'] },
      { nl: 'In week 5 heb je ja gezegd tegen vijf verzoeken, elk zo’n {n:2} dagen.', en: 'By week 5 you have said yes to five requests, each about {n:2} days.', focus: ['reqs', 'pile'] },
      { nl: 'Samen {n:10} dagen, {n:25}% extra, en de planning staat nog op groen: {t:Scope creep|scope creep}.', en: 'Together {n:10} days, {n:25}% extra, and the plan still shows green: {t:Scope creep|scope creep}.', cue: { 'Scope creep': 'creep' }, focus: ['creep', 'status', 'calendar'] },
      { nl: 'Signalen: nieuwe mensen bij je overleg, een doelzin die schuift, en jij die ’s avonds doorwerkt.', en: 'Signs: new people at your meetings, the goal sentence shifting, and you working evenings.', focus: ['signals', 'jij'] },
    ]),
    sc('s3', RS, { nl: 'Ja, en dit kost het', en: 'Yes, and here is the cost' }, [
      { nl: 'Maak elk verzoek zichtbaar: wat, door wie, waarom, en de impact op tijd, kosten, risico en doel.', en: 'Make each request visible: what, by whom, why, and the impact on time, cost, risk and the goal.', focus: 'list' },
      { nl: 'Klein: op de weeklijst. Groter: een {t:Wijzigingsverzoek|wijzigingsverzoek}, de sponsor beslist.', en: 'Small: on the weekly list. Bigger: a {t:Change request|change request}, decided by the sponsor.', cue: { Wijzigingsverzoek: 'cr' }, focus: ['cr', 'sponsor'] },
      { nl: '“Ja, en dit kost het: lijn 4 is zo’n drie weken extra, of de ploegoverdracht valt af.”', en: '“Yes, and here is the cost: line 4 is about three weeks extra, or the shift handover drops.”', focus: ['quote', 'jij'] },
      { nl: 'Geen nee, maar de {t:Afweging|afweging}: wat je opgeeft om iets anders te krijgen.', en: 'Not a no, but the {t:Trade-off|trade-off}: what you give up to get something else.', cue: { Afweging: 'trade' }, focus: 'trade' },
      { nl: 'Beslis nooit alleen over de scope: het is niet jouw project, het is het hunne.', en: 'Never decide alone on scope: it is not your project, it is theirs.', focus: ['sponsor', 'trade'] },
    ]),
    sc('s4', RS, { nl: 'Op één vel', en: 'On one sheet' }, [
      { nl: 'Jij zet de vijf verzoeken met hun impact op papier: samen {n:10} dagen.', en: 'You write the five requests down with their impact: {n:10} days together.', focus: ['sheet', 'paper'] },
      { nl: 'A: alles houden, de einddatum schuift twee weken. B: voorraadcheck en ERP-sessie vallen af.', en: 'A: keep them all, the end date moves two weeks. B: drop the stock check and the ERP session.', focus: ['opts', 'optB'] },
      { nl: 'De sponsor kiest B, en vertelt het verkoop zelf.', en: 'The sponsor chooses B, and tells sales himself.', focus: ['sponsor', 'optB'] },
      { nl: 'Als junior een senior klant tegenspreken? Hoeft niet: je vraagt de sponsor om te kiezen.', en: 'Push back on a senior client as a junior? No need: you ask the sponsor to choose.', focus: ['jij', 'sponsor'] },
      { nl: 'Klopte het doel niet? Pas de scope officieel aan, met een nieuwe doelzin en planning.', en: 'Was the goal wrong? Change the scope officially, with a new goal sentence and plan.', focus: 'official' },
      { nl: 'Formele projecten hebben een wijzigingscommissie; in verbeterprojecten doet de stuurgroep dat.', en: 'Formal projects have a change control board; in improvement projects the steering group does it.', focus: 'ccb' },
    ]),
    sc('s5', RS, { nl: 'Je eigen kant', en: 'Your own side' }, [
      { nl: '{t:Gold plating|Gold plating}: het team voegt extra’s toe waar niemand om vroeg.', en: '{t:Gold plating|Gold plating}: the team adds extras nobody asked for.', cue: { 'Gold plating': 'gold' }, focus: 'gold' },
      { nl: 'Een mooier dashboard, nog één analyse: het voelt als service, maar het eet dezelfde uren.', en: 'A nicer dashboard, one more analysis: it feels like service, but it eats the same hours.', focus: 'gold' },
      { nl: 'Experts verschillen: elk uur tellen, of zo’n {n:10}% reserve voor gunsten. Een vuistregel, geen norm.', en: 'Experts differ: count every hour, or keep about {n:10}% for favours. A rule of thumb, not a standard.', focus: 'reserve' },
      { nl: 'Vraag wekelijks: “Dient alles waar we deze week aan werkten de doelzin?”', en: 'Ask weekly: “Does everything we worked on this week serve the goal sentence?”', focus: ['weekly', 'jij'] },
    ]),
    sc('s6', NS, { nl: 'Tijd, geld en scope', en: 'Time, money and scope' }, [
      { nl: 'De {t:Duivelsdriehoek|duivelsdriehoek}: scope, tijd en kosten. Beweegt er één, dan moet er iets mee.', en: 'The {t:Iron triangle|iron triangle}: scope, time and cost. If one moves, something else has to.', cue: { Duivelsdriehoek: 'tri' }, focus: 'tri' },
      { nl: 'Meer, in dezelfde tijd, voor hetzelfde geld? Dan lever je stil in op kwaliteit. Maak de ruil zichtbaar.', en: 'More, in the same time, for the same money? Then quality quietly pays. Make the trade visible.', focus: ['quality', 'tri'] },
      { nl: 'Vijf snelle extraatjes van een dag: een hele week, op een project van {n:20} dagen.', en: 'Five quick extras of a day each: a full week, on a {n:20}-day project.', focus: 'week' },
      { nl: 'Een {t:Wijzigingslog|wijzigingslog}: wat, wanneer, hoeveel werk, wat besloten is. Feiten, geen gedoe.', en: 'A {t:Change log|change log}: what, when, how much effort, what was decided. Facts, not blame.', cue: { Wijzigingslog: 'log' }, focus: 'log' },
      { nl: '{t:Vaste prijs|Vaste prijs}: het risico van extra werk ligt bij jou. {t:Dagtarief|Dagtarief}: bij de klant.', en: '{t:Fixed price|Fixed price}: the risk of extra effort is yours. {t:Day rate|Day rate}: the client’s.', cue: { 'Vaste prijs': 'fixed', Dagtarief: 'rate' }, focus: ['fixed', 'rate'] },
    ]),
    sc('s7', NS, { nl: 'Een vierde regio', en: 'A fourth region' }, [
      { nl: 'Vaste prijs bij een netbeheerder: {n:20} dagen, drie regio’s. In week {n:3} wil de sponsor er een vierde bij.', en: 'Fixed price at a grid operator: {n:20} days, three regions. In week {n:3} the sponsor wants a fourth.', focus: ['regions', 'sponsor'] },
      { nl: 'Jij schat {n:4} extra dagen. Vraag eerst: waar is die regio voor? Zit er een vraag van de directie achter?', en: 'You estimate {n:4} extra days. First ask: what is it for? Is there a board question behind it?', focus: 'ask' },
      { nl: 'Opties, geen muur: erbij voor {n:4} dagen, ruilen tegen regio {n:3}, of één kerncijfer in {n:1} dag.', en: 'Options, not a wall: add it for {n:4} days, swap it for region {n:3}, or one key number in {n:1} day.', focus: 'opts' },
      { nl: 'Check bij je eigen manager voor je een prijs noemt: jouw bureau draait op voor de kosten.', en: 'Check with your own manager before you name a price: your firm carries the cost.', focus: ['mgr', 'jij'] },
      { nl: 'Bevestig per mail, met een regel in het wijzigingslog. Groter? Een {t:Wijzigingsverzoek|wijzigingsverzoek} dat de klant tekent.', en: 'Confirm by email, with a line in the change log. Bigger? A {t:Change request|change request} the client signs.', cue: { Wijzigingsverzoek: 'cr' }, focus: ['cr', 'log', 'laptop'] },
      { nl: 'Gratis extraatje? Sommigen geven er één, benoemd en gelogd; anderen nooit. Wat laat je vallen?', en: 'A free extra? Some give one, named and logged; others never. What would you drop for it?', focus: 'free' },
    ]),
  ],
  skip: [
    { lesson: NS, term: 'Scope creep', reason: 'Same term and meaning as Scope creep of pm.run.scope, which scene 2 names with its cue (ten extra days on the budget bar while the plan stays green); scene 6 says it hurts most on a fixed price. The build resolves a shared term name to the first served lesson.' },
    { lesson: NS, term: 'Wijzigingsverzoek', reason: 'Same term as Wijzigingsverzoek of pm.run.scope, which scenes 3 and 7 name with its cue; scene 7 shows this lesson\'s version, a short document with the extra work, days and price that the client signs. The build resolves a shared term name to the first served lesson.' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; it carries every point of the
// checklist above. No symbols the voice would read aloud: words for % and +,
// no quotes or parentheses. Words checked with espeak-ng phonemes through
// Piper's own bridge (nl_NL-alex, 2026-11-12). Kept out of the Dutch narration
// because espeak-ng misreads them (they stay in the captions and cards), so no
// new SAY rule is needed: scope and scope creep (read "skoo-pe kreep": said as
// the edge of the project, and "zo groeit een project ongemerkt"), gold plating
// (a Dutch g and "plaa-ting": the voice says what it is), dashboard ("dasj-boo-
// art": "een mooiere grafiek"), voorraadcheck (a g for the ch: "een controle
// van de voorraad"), consultantdagen (the d dropped: "dagen van de consultant"),
// engagement manager and goodwill (said as the lesson glosses them), service
// ("een gunst"), and compounds it stresses on their last part:
// duivelsdriehoek and driehoek (the narration says the three hang together),
// dagtarief ("een tarief per dag"), kabelfabrikant ("een fabrikant van
// kabels"), wijzigingsverzoek and wijzigingscommissie ("een verzoek tot
// wijziging", "een commissie voor wijzigingen") and vuistregel ("een regel uit
// de praktijk"). Left as espeak-ng reads them: analyse(s), stressed on the
// first syllable, as in the films that already say it (eng.maintenance.failure).
const SAY = [
  [ // s1 what the project delivers
    { nl: 'Jij bent de adviseur bij een klant. Eerst de grens van je project: wat het wel oplevert, en wat niet.',
      en: 'You are the consultant at a client. First the edge of your project: what it will deliver, and what it won\'t. That is the scope.' },
    { nl: 'Dan de {t:Doelzin|doelzin}: één regel met wat het project moet bereiken. Bijvoorbeeld: afgezegde klussen in de week voor uitvoering van {n:18} naar onder de {n:8} procent, voor juni.',
      en: 'Then the {t:Goal sentence|goal sentence}: one line with what the project must achieve. For example: jobs cancelled in the week before they are due, from {n:18} to under {n:8} percent, by June.' },
    { nl: 'Toets elk verzoek aan die zin.',
      en: 'Test every request against it.' },
  ],
  [ // s2 five small requests
    { nl: 'Bij een fabrikant van kabels verbeter je de weekplanning, begroot op {n:40} dagen van de consultant: de tijd die de klant betaalt.',
      en: 'At a cable manufacturer you improve the weekly planning, planned at {n:40} consultant days: the time the client pays for.' },
    { nl: 'Kun je ook even naar lijn vier kijken? Schuif je aan bij het overleg over het nieuwe ERP, het systeem voor orders, voorraad en planning? Elk verzoek is klein en redelijk.',
      en: 'Can you also look at line four? Could you join the meeting about the new ERP, the system for orders, stock and planning? Each request is small and reasonable.' },
    { nl: 'In week vijf heb je ja gezegd tegen vijf: een rapportage voor verkoop, een voorraadcontrole, een sessie met het ERP-team en twee extra analyses. Elk zo\'n {n:2} dagen.',
      en: 'By week five you\'ve said yes to five: a report for sales, a stock check, a session with the ERP team, and two extra analyses. Each about {n:2} days.' },
    { nl: 'Samen {n:10} dagen, {n:25} procent extra, en de planning staat nog op groen. Zo groeit een project ongemerkt, zonder formele afspraak.',
      en: 'Together {n:10} days, {n:25} percent extra, and the plan still shows green. That is scope creep: growth nobody formally agreed.' },
    { nl: 'Signalen: nieuwe mensen bij je overleggen, een doelzin die verschuift, en jij die \'s avonds doorwerkt terwijl de planning zegt dat je op koers ligt.',
      en: 'Signs: new people at your meetings, the goal sentence shifting, and you working evenings while the plan says you\'re on track.' },
  ],
  [ // s3 yes, and here is the cost
    { nl: 'Maak dus elk verzoek zichtbaar: wat, door wie, waarom, en wat het doet met tijd, kosten, risico en het doel.',
      en: 'So make each request visible: what, by whom, why, and what it does to time, cost, risk and the goal.' },
    { nl: 'Kleine dingen gaan op een weeklijst. Grotere worden een verzoek tot wijziging: schriftelijk, met de impact, en de sponsor beslist.',
      en: 'Small things go on a weekly list. Bigger ones become a change request: written, with its impact, and the sponsor decides.' },
    { nl: 'Zeg: ja, en dit kost het. Lijn vier kan erbij, voor zo\'n drie weken extra, of de ploegoverdracht valt af. Wat heeft je voorkeur?',
      en: 'Say: yes, and here is the cost. We can add line four, for about three weeks extra, or we drop the shift handover. Which do you prefer?' },
    { nl: 'Geen nee, maar de {t:Afweging|afweging}: wat je opgeeft om iets anders te krijgen. De meeste verzoeken krimpen of verdwijnen zodra ze een prijs hebben.',
      en: 'Not a no, but the {t:Trade-off|trade-off}: what you give up to get something else. Most requests shrink or disappear once priced.' },
    { nl: 'En beslis nooit alleen: het is niet jouw project, maar het hunne.',
      en: 'And never decide alone on scope: it is not your project, it is theirs.' },
  ],
  [ // s4 on one sheet
    { nl: 'Terug naar het voorbeeld. Jij zet de vijf met hun impact op papier, voor de sponsor: samen {n:10} dagen.',
      en: 'Back to the cable manufacturer. You write the five down with their impact, for the sponsor: {n:10} days together.' },
    { nl: 'Optie A: we houden ze, en de einddatum schuift twee weken. Optie B: de voorraadcontrole en de ERP-sessie vallen af.',
      en: 'Option A: we keep them, and the end date moves two weeks. Option B: we drop the stock check and the ERP session.' },
    { nl: 'Hij kiest B, en vertelt het verkoop zelf.',
      en: 'He chooses B, and tells sales himself.' },
    { nl: 'Als junior voelt het riskant om een senior klant tegen te spreken. Hoeft niet: je vraagt de sponsor om te kiezen.',
      en: 'As a junior it feels risky to push back on a senior client. You don\'t: you ask the sponsor to choose.' },
    { nl: 'Soms is de wijziging terecht, omdat het doel niet klopte. Pas het project dan officieel aan, met een nieuwe doelzin en planning; laat het niet wegdrijven.',
      en: 'Sometimes the change is right, because the goal was wrong. Then change the scope officially, with a new goal sentence and plan, rather than letting it drift.' },
    { nl: 'Formele projecten hebben een commissie voor wijzigingen; in de meeste verbeterprojecten doet de stuurgroep dat.',
      en: 'Formal projects have a change control board; in most improvement projects the steering group does it.' },
  ],
  [ // s5 your own side
    { nl: 'Let ook op je eigen kant: het team dat extra\'s toevoegt waar niemand om vroeg.',
      en: 'Watch your own side too. Gold plating is the team adding extras nobody asked for.' },
    { nl: 'Een mooiere grafiek, nog één analyse. Het voelt als een gunst, maar het eet dezelfde uren op.',
      en: 'A nicer dashboard, one more analysis. It feels like service, but it eats the same hours.' },
    { nl: 'Experts verschillen. Sommigen tellen elk uur; anderen houden een reserve voor gunsten, vaak zo\'n {n:10} procent van het budget. Een regel uit de praktijk, geen norm.',
      en: 'Experts differ. Some count every hour; others keep a reserve for favours, often about {n:10} percent of the budget. A rule of thumb, not a standard.' },
    { nl: 'Vraag in elk geval wekelijks: dient alles waar we deze week aan werkten de doelzin?',
      en: 'Either way, ask weekly: does everything we worked on this week serve the goal sentence?' },
  ],
  [ // s6 time, money and scope
    { nl: 'Nu de klant. Wat je levert, de tijd en de kosten hangen aan elkaar: beweegt er één, dan moet er iets anders mee.',
      en: 'Now the client. Scope, time and cost hang together in the iron triangle: if one moves, something else has to.' },
    { nl: 'Meer vragen in dezelfde tijd, voor hetzelfde budget, is vragen om stil op kwaliteit in te leveren. Weiger niet, maar maak de ruil zichtbaar.',
      en: 'Asking for more in the same time, for the same budget, is asking you to cut quality without saying so. Don\'t refuse: make the trade visible.' },
    { nl: 'Kleine ja\'s tellen op. Vijf snelle extraatjes van een dag zijn een hele week, op een project van {n:20} dagen.',
      en: 'Small yeses add up. Five quick extras of a day are a full week, on a {n:20}-day project.' },
    { nl: 'Houd een {t:Wijzigingslog|wijzigingslog} bij: wat er gevraagd werd, wanneer, hoeveel werk, en wat er besloten is. Dan gaat het over feiten, niet over wie er moeilijk doet.',
      en: 'Keep a {t:Change log|change log}: what was asked, when, how much effort, and what was decided. Then it\'s about facts, not about who is being difficult.' },
    { nl: 'Bij een {t:Vaste prijs|vaste prijs} ligt het risico van extra werk bij jou. Bij een tarief per dag betaalt de klant elke gewerkte dag, en draagt hij het risico. Ongemerkte groei doet dus het meeste pijn bij een vaste prijs.',
      en: 'On a {t:Fixed price|fixed price} the risk of extra effort sits with you. On a day rate the client pays per day worked and carries it. So scope creep hurts most on a fixed price.' },
  ],
  [ // s7 a fourth region
    { nl: 'Vaste prijs bij een netbeheerder: {n:20} dagen, drie regio\'s. In week {n:3} vraagt de sponsor, de eigenaar bij de klant, om een vierde. Je zit toch al in de data.',
      en: 'Fixed price at a grid operator: {n:20} days, three regions. In week {n:3} the sponsor, the project\'s owner at the client, asks for a fourth. You\'re in the data anyway.' },
    { nl: 'Jij schat {n:4} extra dagen. Vraag eerst waar die regio voor is: zit er een vraag van de directie achter? Vaak volstaat een lichtere versie.',
      en: 'You estimate {n:4} extra days. First ask what the region is for: is there a board question behind it? A lighter version is often enough.' },
    { nl: 'Bied opties, geen muur: de regio erbij voor {n:4} dagen tegen het afgesproken tarief, ruilen tegen regio {n:3}, of één kerncijfer in {n:1} dag. Of later, als vervolg. De klant kiest.',
      en: 'Offer options, not a wall: add it for {n:4} days at the agreed day rate, swap it for region {n:3}, or one key number in {n:1} day. Or later, as a follow-up. The client chooses.' },
    { nl: 'Check bij je eigen manager voordat je een prijs noemt. Misschien mag jij geen dagen weggeven; je bureau draait op voor de kosten.',
      en: 'Check with your engagement manager before you name a price. You may not be allowed to give days away; your firm carries the cost.' },
    { nl: 'Bevestig de keuze per mail en in het wijzigingslog. Bij grotere dingen een verzoek tot wijziging: werk, dagen en prijs, en de klant tekent.',
      en: 'Confirm the choice by email and in the change log. For bigger items, a change request: work, days and price, and the client signs.' },
    { nl: 'Gratis extraatjes? Sommigen geven er bewust één, benoemd en gelogd: deze is van ons. Anderen: zo leert de klant weer te vragen. Vraag: wat zou je laten vallen om hier ruimte voor te maken?',
      en: 'Free extras? Some give one on purpose, named and logged: this one\'s on us. Others: it teaches the client to ask again. Ask: what would you drop to make room for this?' },
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
  if (/[/&×=+()“”"‘%€~]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /\bscope|gold plating|dashboard|voorraadcheck|consultantdagen|engagement|goodwill|service|driehoek|dagtarief|kabelfabrikant|wijzigingsverzoek|wijzigingscommissie|vuistregel/i.test(line.nl)) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// the status green, muted, per theme; the request notes a warm paper; the focus glow stays the player's
const css = PM_CSS + `
.iso{--sc-g:#5FA877;--sc-note:#D9C27A}
.iso[data-theme="light"]{--sc-g:#3B7F52;--sc-note:#E8CF7E}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-inv{fill:var(--anatomy-card);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-strike{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round}
.pm-tri{fill:color-mix(in srgb,var(--fp-accent) 10%,transparent);stroke:var(--anatomy-hi);stroke-width:2;stroke-linejoin:round}
.pm-bar{fill:var(--anatomy-hi)}
.pm-xtra{fill:var(--sc-note);stroke:var(--anatomy-lo);stroke-width:.8}
.pm-note{fill:var(--sc-note);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-dot{fill:var(--anatomy-mid)}
.sc-g{fill:var(--sc-g)}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-tri{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-xtra,[data-cue][data-on] .pm-note{stroke:var(--fp-accent);stroke-width:1.2}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on,.pm-mini .pm-inv{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-tri,.pm-mini .pm-strike{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash,.pm-mini .pm-xtra{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van acht weken met een groene statusstip die groen blijft. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel stapelen vijf briefjes met verzoeken zich op, en een vel voor de sponsor vult zich met de lijst en twee opties. Rechts een paneel met per scène een kaart: de scope en de doelzin, een budgetbalk van 40 dagen met vijf blokjes van 2 dagen erbij terwijl de planning groen blijft, een verzoek zichtbaar gemaakt en een weegschaal voor de afweging, het vel met optie A en B, gold plating en een reserve van 10 procent, de duivelsdriehoek met kwaliteit in het midden, het wijzigingslog, vaste prijs en dagtarief, en vier regio\'s waarvan de vierde gestippeld, met drie opties.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of eight weeks with a status dot that stays green. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table five request notes pile up, and a sheet for the sponsor fills in with the list and two options. At the right a panel with one card per scene: the scope and the goal sentence, a budget bar of 40 days with five blocks of 2 days added while the plan stays green, a request made visible and a balance for the trade-off, the sheet with options A and B, gold plating and a 10 percent reserve, the iron triangle with quality in the middle, the change log, fixed price and day rate, and four regions with the fourth dotted, with three options.',
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

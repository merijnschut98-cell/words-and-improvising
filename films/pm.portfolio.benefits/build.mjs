// Dev tool, not shipped. Builds the explainer film "Van resultaat tot baten /
// From output to benefits" for Projecten, module Programma's en governance:
// pm.portfolio.benefits (level 1 of the topic Baten, "Van output naar baten").
//
//   node films/pm.portfolio.benefits/build.mjs            build the page
//   node films/pm.portfolio.benefits/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.portfolio.benefits.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7,
// the pm.perform.tree row (its fifth idea: output, outcome, benefits). That
// film left the lesson out for length (films/pm.perform.tree/build.mjs), so
// this film carries it alone: a lesson with a film no longer shows its worked
// example, so the film carries all five teach blocks and the worked example,
// in nine scenes and about four minutes: the chain (s1, s2), the benefit owner
// (s3), the baseline (s4), tracking after go-live (s5), attribution (s6), why
// benefits leak (s7) and the changeover project's missing 300k (s8, s9).
//
// Checklist (lesson point: scene and beat; "card" = on the card, not spoken,
// on screen from its beat to the scene's end, at least 4 s):
//   teach 1: output, what the project delivers (s1 b1), the readiness check
//     going live (s2 b1); outcome, the change in performance (s1 b2),
//     cancellations from 14% to 8% (s2 b2); benefits, the measurable gain for
//     the organisation (s1 b3), about 1,200 fewer wasted crew-days a year (s2
//     b3), worth 900k at 750 euro a crew-day (s2 b4, the sum on the card);
//     projects deliver outputs, the line, the managers who run daily
//     operations, owns outcomes and benefits (s1 b4, again on the example in
//     s2 b5)
//   teach 2: name the benefit owner before the project starts (s3 b1), a
//     manager whose budget or KPI carries it (s3 b2), not the project lead,
//     who leaves (s3 b3); agree the baseline, the starting value and exactly
//     how it is measured, before you start (s4 b1); how do you count a
//     cancellation, over which period, storm weeks in or out (s4 b2); write it
//     down, the controller, the finance colleague who owns the numbers, signs
//     it off (s4 b3); without it every result becomes an argument about
//     definitions (s4 b4)
//   teach 3: plan tracking for 6 to 12 months after go-live, the day the change
//     goes into use (s5 b1); the owner reviews monthly, check-ins at 3 and 6
//     months (s5 b2); a trigger: two months in a row past an agreed level, the
//     owner acts (s5 b3; the lesson's word "trigger" in caption, card and voice,
//     the Dutch voice adds "actiegrens", the word pm.perform.tree uses); in the
//     close-out plan with names and dates, or it will not happen (s5 b4)
//   teach 4: attribution, how much of a change you may credit to your project
//     (s6 b1); cancellations dropped while a new contractor also started: you
//     cannot claim it all (s6 b2); "we estimate 60 to 70% comes from the
//     readiness check", and show why (s6 b3); the strongest evidence a
//     comparison, a region without the check in the same months (s6 b4); a
//     board trusts a modest number it can defend more than a big one it can't
//     (s6 b5)
//   teach 5: boards are sceptical for good reason, large studies find benefits
//     often fall short; the topic's expert lesson looks at why (s7 b1, the
//     word "sceptisch" on the card); pm.land covers one project, this topic the
//     programme and portfolio view (s7 b2); how benefits leak: the project
//     closes, the team moves on, the old way creeps back within months (s7
//     b3); the sharp question, word for word (s7 b4)
//   example: a changeover project at a manufacturer closed in March, average
//     changeover 90 to 45 minutes (s8 b1); the business case promised 300k a
//     year; in September the CFO asks where it is (s8 b2); changeovers crept
//     back to 70 minutes (s8 b3); the freed capacity never used: sales added no
//     volume, the weekend shift kept running (s8 b4); separate the two: the
//     outcome slipped, for the operations manager, a short audit and a monthly
//     review (s9 b1); even at 45 minutes no benefit, freed capacity is only
//     money when someone turns it into money (s9 b2); the choice to the MT: cut
//     the weekend shift or sell more volume, each with a number (s9 b3); one
//     benefit owner, the measure agreed with the controller, book the 300k
//     only once that decision is made (s9 b4); tell the CFO directly, without
//     defending the old business case (s9 b5)
//
// Facts: the lesson names no source (no benefits realisation method, no
// benefits map, no author for "large studies"), so neither does the film; the
// next lessons of the topic (pm.portfolio.benefitsmap, .tracking, .realism)
// are not drawn on. Sums asserted below: 1,200 x 750 = 900,000 euro; the
// changeover 90 to 45 to 70 minutes; the 60 to 70% band. The cancellations
// stay unnamed beyond the lesson's words (no grid operator is said; the
// lesson's situation names one, the teach text does not). The monthly values
// on the s5 chart and the curve of s7 are a sketch without numbers: no axis
// values are shown, so nothing is claimed. Terms as pm.perform.tree and
// pm.close.results use them: nulmeting (baseline), actiegrens (trigger),
// controller "die over de cijfers gaat"; freed capacity is only money once
// something changes (pm.close.results s5 says the same of freed hours).
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// meeting room with a whiteboard that repeats the panel in miniature, a wall
// clock, a meeting table with a sheet (the written baseline, signed in s4) and
// a laptop, and the cast: "jij" the consultant in petrol at the board, the
// sponsor in a suit (the board, the MT, the CFO), the team lead in a work vest
// (the line: the benefit owner, the operations manager) and the controller, a
// figure of this film's own built as in pm.close.results (plum blazer, white
// shirt front, dark binder), so the two films show the same person. A panel at
// the right, in stage space, carries one card per scene, labelled "schema" or
// "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (SLOTS below), and so are the people, the
// board and the sheet.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
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
const BEN = 'pm.portfolio.benefits';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (lang) => { const l = lessons[lang].get(BEN); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (list, lang = 'nl') => { const t = textOf(lang); for (const s of list) assert(t.includes(s), `${BEN} (${lang}) no longer says "${s}"`); };
says(['Output, uitkomst, baten.', 'Output: wat het project oplevert, zoals de gereedheidscheck die live gaat', 'Uitkomst: de verandering in prestatie, zoals afzeggingen die dalen van 14% naar 8%',
  'Baten: de meetbare winst voor de organisatie, zoals zo’n 1.200 verspilde ploegdagen per jaar minder, € 900k waard bij € 750 per ploegdag',
  'Projecten leveren output; de lijn, de managers die de dagelijkse operatie draaien, is eigenaar van uitkomsten en baten',
  'Benoem de batenhouder voordat het project start: een manager op wiens budget of KPI (kernprestatie-indicator) het landt, niet de projectleider, want die vertrekt',
  'Spreek de nulmeting af, de startwaarde en precies hoe je die meet, voordat je begint', 'Hoe tel je een afzegging? Over welke periode? Tellen stormweken mee of niet?',
  'Schrijf het op en laat de controller, de financiële collega die over de cijfers gaat, het aftekenen', 'Zonder nulmeting wordt elk resultaat een discussie over definities',
  'Plan het volgen van de baten voor 6 tot 12 maanden na de livegang (go-live), de dag dat de verandering in gebruik gaat', 'De eigenaar bekijkt het getal maandelijks; er is een check-in na 3 en na 6 maanden',
  'zakt het getal twee maanden achter elkaar voorbij een afgesproken niveau, dan grijpt de eigenaar in', 'Zet dit in het afsluitplan, met namen en data, anders gebeurt het niet',
  'Wees eerlijk over toerekening: hoeveel van een verandering je aan je project mag toeschrijven', 'Daalden de afzeggingen terwijl er ook een nieuwe aannemer begon, dan kun je niet alles claimen',
  'Zeg “we schatten dat 60 tot 70% van de gereedheidscheck komt”, en laat zien waarom', 'Het sterkste bewijs is een vergelijking: een regio zonder de check in dezelfde maanden',
  'Een directie vertrouwt een bescheiden getal dat je kunt verdedigen meer dan een groot getal dat je niet kunt verdedigen',
  'Directies zijn niet voor niks sceptisch: groot onderzoek naar projecten laat zien dat baten vaak tegenvallen; de expertles van dit onderwerp kijkt naar waarom',
  'pm.land behandelt baten voor één project; dit onderwerp neemt het perspectief van programma en portfolio',
  'het project sluit, het team gaat verder, en binnen een paar maanden sluipt de oude manier terug', '“Wie kijkt volgende maand naar dit getal, en wat doet die als het wegzakt?”',
  'Een omstelproject bij een fabrikant is in maart afgesloten', 'De gemiddelde omsteltijd ging van 90 naar 45 minuten; de business case beloofde € 300k per jaar',
  'In september vraagt de CFO (financieel directeur) waar die € 300k is', 'de omstellingen zijn teruggekropen naar 70 minuten', 'de vrijgekomen capaciteit is nooit benut, want sales heeft geen volume toegevoegd en de weekenddienst draaide gewoon door',
  'je haalt de twee problemen uit elkaar', 'De uitkomst is weggezakt: dat is voor de operationeel manager, die de standaard herstelt met een korte audit en een maandelijkse review',
  'zelfs bij 45 minuten waren er geen baten, want vrijgekomen capaciteit wordt pas geld als iemand er geld van maakt', 'Je legt het MT de keuze voor: de weekenddienst schrappen, of meer volume verkopen, elk met een getal',
  'Dan benoem je één batenhouder, spreek je de meetwijze af met de controller, en boek je de € 300k pas als dat besluit genomen is', 'Je zegt dit de CFO direct, zonder de oude business case te verdedigen']);
says(['Output, outcome, benefit.', 'from 14% to 8%', 'about 1,200 fewer wasted crew-days a year, worth €900k at €750 per crew-day', 'not the project lead, who leaves', 'Are storm weeks in or out?',
  'for 6–12 months after go-live', 'a check-in at 3 and 6 months', 'we estimate 60–70% comes from the readiness check', 'a region without the check over the same months',
  'from 90 to 45 minutes', 'promised €300k a year', 'crept back to 70 minutes', 'the weekend shift kept running', 'cut the weekend shift, or sell more volume, each with a number',
  'book the €300k only once that decision is made', 'without defending the old business case'], 'en');
// the chain's example: 1,200 crew-days at 750 euro is 900k a year
const CREW = 1200;
const RATE = 750;
assert(CREW * RATE === 900000, '1,200 crew-days x 750 euro = 900,000 euro');
const CANCEL = [14, 8];
assert(CANCEL[0] > CANCEL[1], 'cancellations fall');
// attribution: 60 to 70% of the drop from the readiness check
const SHARE = [60, 70];
assert(SHARE[0] < SHARE[1] && SHARE[1] < 100, 'a band below 100%, not the whole drop');
// the changeover project: 90 before, 45 at closing in March, crept back to 70 by September
const CHANGE = [90, 45, 70];
assert(CHANGE[1] < CHANGE[2] && CHANGE[2] < CHANGE[0], '45 at closing, back to 70, still below 90');
// tracking: 6 to 12 months, check-ins at 3 and 6, the trigger after two months in a row
const TRACK = { months: 12, checks: [3, 6] };
// the monthly sketch of s5 (no values shown): two months in a row past the line, then the owner acts
const MONTHLY = [8.0, 8.3, 7.8, 8.1, 8.4, 8.0, 8.5, 8.9, 9.6, 9.9];
const LINE = 9.2;
assert(MONTHLY.slice(-2).every((v) => v > LINE) && MONTHLY.slice(0, -2).every((v) => v < LINE), 'only the last two months are past the line');

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
const SHEET = w.sheet({ x: 148, y: 150, z: TZ, w: 21, d: 29.7 });
const r1 = (v) => Math.round(v * 10) / 10;
const SHEET_AT = w.at([158, 165, TZ]).map(r1);
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pb-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;
// the client's controller, built as in pm.close.results (a plum blazer over a
// white shirt front, dark hair, a dark ring binder at the chest), so both
// films show the same person; from the world's parts with the person's
// proportions (world.mjs person()).
function controllerFigure({ x, y }) {
  const S = (paths, style) => k.solidSvg(paths, style);
  const skin = { tone: 'hi', crease: 'none', className: 'pb-skin' };
  const jacket = { tone: 'mid', className: 'pb-ctl' };
  const out = [w.halo({ x: x - 16, y: y - 12, w: 32, d: 24, r: 10 })];
  for (const s of [-7, 7]) {
    out.push(w.box({ x: x + s - 5, y: y - 5, w: 10, d: 14, r: 2.4 }, 0, 4.5, { tone: 'lo' }, { steps: 2 }));
    out.push(w.post(x + s, y, 6.4, 4, 84, { tone: 'lo' }, 14));
  }
  const torso = { x: x - 16, y: y - 10, w: 32, d: 20, r: 5.5 };
  const arm = (s) => w.box({ x: x + s - 4, y: y - 4, w: 8, d: 8, r: 3 }, 90, 140, jacket, { steps: 2 });
  out.push(arm(-20.5));
  out.push(w.box(torso, 82, 144, jacket, { steps: 4, bevel: 0.6, inner: k.lineSvg(k.sideSeam(torso, 136, P, 4), { tone: 'lo' }) }));
  out.push(w.box({ x: x - 4, y: y + 10, w: 8, d: 0.8, r: 0.4 }, 116, 143, { tone: 'hi', className: 'pb-shirt' }, { steps: 1 }));
  out.push(arm(20.5));
  out.push(w.box({ x: x - 11, y: y + 11, w: 22, d: 4.2, r: 0.8 }, 98, 128, { tone: 'lo', className: 'pb-binder' }, { steps: 2 }));
  out.push(w.box({ x: x - 11, y: y + 15.2, w: 3, d: 0.6, r: 0.2 }, 100, 126, { tone: 'mid' }, { steps: 1 }));
  out.push(w.post(x, y, 4.4, 144, 150, skin, 12));
  out.push(S(G.sphereOf([x - 1.4, y - 1.4, 163], 12, P, { steps: 28 }), { tone: 'lo', crease: 'none' }));
  out.push(S(G.sphereOf([x + 0.5, y + 0.5, 160.5], 11.4, P, { steps: 28 }), skin));
  return `<g data-cue="controller">${out.join('')}</g>`;
}
const controller = controllerFigure({ x: 232, y: 208 });
assert(controller.includes('data-cue="controller"') && !controller.includes('data-cue="planner"'), 'the controller is a cue group of its own');

const world = [
  w.room(ROOM),
  w.clock(262, 214, 10),
  cueG('board', BOARD.svg + boardMini),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  w.stack({ x: 104, y: 126, z: TZ, n: 3 }),
  cueG('sheet', SHEET.svg + sheetLines),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 262, y: 152, role: 'sponsor', along: 'y' }),
  controller,
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); stage.js fills them per scene: o[key] goes into data-k "p_<key>".
const PX = 322;
const PW = 308;
const SLOTS = ['output', 'outcome', 'benefit', 'owners',
  'exOut', 'exOc', 'exBen', 'exSum', 'exOwn',
  'axis', 'ownerBar', 'kpi', 'plBar',
  'base', 'qs', 'sign', 'nobase',
  'span', 'monthly', 'checks', 'trig', 'plan',
  'attr', 'drop', 'contractor', 'est', 'region', 'modest',
  'sceptic', 'scope', 'leak', 'ask',
  'case', 'promise', 'crept', 'unused',
  'fixOc', 'money', 'choice', 'book', 'direct'];
const hud = g('panel', `<rect class="pb-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + SLOTS.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));

// Static paths with relative line-tos (the helper of pm.land.handover): the
// same points, fewer bytes; each rewrite is read back.
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
    if (/[MLZlz]/.test(tok[i])) { cmd = tok[i++]; if (/[Zz]/.test(cmd)) { cur = start; out.push('Z'); } continue; }
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
const BOARD_AT = w.at([145, 0, 150]).map(r1);
const CTRL_AT = w.at([232, 208, 150]).map(r1);
const LEAD_AT = w.at([76, 182, 120]).map(r1);
const SPON_AT = w.at([262, 152, 120]).map(r1);
const CAM = [
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1], to: [150, 205, 1] },
  { from: [150, 205, 1], to: [LEAD_AT[0], LEAD_AT[1], 1.08] },
  { from: [LEAD_AT[0], LEAD_AT[1], 1.06], to: [150, 200, 1.02] },
  { from: [150, 205, 1.02], to: [CTRL_AT[0], CTRL_AT[1] + 30, 1.1] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.08], to: [LEAD_AT[0], LEAD_AT[1], 1.04] },
  { from: [150, 200, 1.02], to: [SPON_AT[0], SPON_AT[1], 1.08] },
  { from: [SPON_AT[0], SPON_AT[1], 1.06], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.08] },
  { from: [150, 205, 1], to: [SPON_AT[0], SPON_AT[1], 1.08] },
  { from: [LEAD_AT[0], LEAD_AT[1], 1.06], to: [150, 205, 1] },
];

// ---------------------------------------------------------------- the film
const C = { SLOTS, CANCEL, SHARE, CHANGE, TRACK, MONTHLY, LINE };
const sc = (id, title, beats) => ({ id, lesson: BEN, level: 1, still: 0.9, title, beats });
const spec = {
  id: BEN,
  title: { nl: 'Van resultaat tot baten', en: 'From output to benefits' },
  lessons: [BEN],
  strictFocus: true,
  scenes: [
    sc('s1', { nl: 'Output, uitkomst, baten', en: 'Output, outcome, benefit' }, [
      { nl: '{t:Output|Output}: wat het project oplevert.', en: '{t:Output|Output}: what the project delivers.', cue: { Output: 'output' }, focus: 'output' },
      { nl: '{t:Uitkomst|Uitkomst}: de verandering in prestatie.', en: '{t:Outcome|Outcome}: the change in performance.', cue: { Uitkomst: 'outcome' }, focus: 'outcome' },
      { nl: '{t:Baten|Baten}: de meetbare winst voor de organisatie.', en: '{t:Benefit|Benefit}: the measurable gain for the organisation.', cue: { Baten: 'benefit' }, focus: 'benefit' },
      { nl: 'Projecten leveren output. De lijn is eigenaar van uitkomst en baten.', en: 'Projects deliver outputs. The line owns outcome and benefit.', focus: ['owners', 'teamlead'] },
    ]),
    sc('s2', { nl: 'De gereedheidscheck', en: 'The readiness check' }, [
      { nl: 'Output: de gereedheidscheck gaat live.', en: 'Output: the readiness check goes live.', focus: 'exOut' },
      { nl: 'Uitkomst: de afzeggingen dalen van {n:14} naar {n:8}%.', en: 'Outcome: cancellations drop from {n:14} to {n:8}%.', focus: 'exOc' },
      { nl: 'Baten: zo’n {n:1200} verspilde ploegdagen per jaar minder.', en: 'Benefit: about {n:1200} fewer wasted crew-days a year.', focus: 'exBen' },
      { nl: 'Bij € {n:750} per ploegdag is dat € {n:900}k per jaar.', en: 'At €{n:750} per crew-day, that is €{n:900}k a year.', focus: 'exSum' },
      { nl: 'De check levert het project. De daling en het geld haalt de lijn binnen.', en: 'The project delivers the check. The line brings in the drop and the money.', focus: ['exOwn', 'teamlead'] },
    ]),
    sc('s3', { nl: 'De batenhouder', en: 'The benefit owner' }, [
      { nl: 'Benoem de {t:Batenhouder|batenhouder} voordat het project start.', en: 'Name the {t:Benefit owner|benefit owner} before the project starts.', cue: { Batenhouder: 'ownerBar' }, focus: ['ownerBar', 'axis'] },
      { nl: 'Een manager op wiens budget of KPI het landt.', en: 'A manager whose budget or KPI carries it.', focus: ['kpi', 'teamlead'] },
      { nl: 'Niet de projectleider: die vertrekt.', en: 'Not the project lead, who leaves.', focus: 'plBar' },
    ]),
    sc('s4', { nl: 'De nulmeting', en: 'The baseline' }, [
      { nl: 'Spreek de {t:Nulmeting|nulmeting} af voordat je begint: de startwaarde, en hoe je die meet.', en: 'Agree the {t:Baseline|baseline} before you start: the starting value, and how you measure it.', cue: { Nulmeting: 'base' }, focus: 'base' },
      { nl: 'Hoe tel je een afzegging? Over welke periode? Tellen stormweken mee?', en: 'How do you count a cancellation? Over which period? Are storm weeks in?', focus: 'qs' },
      { nl: 'Schrijf het op en laat de controller het aftekenen.', en: 'Write it down and get the controller to agree.', focus: ['sign', 'controller', 'sheet'] },
      { nl: 'Zonder nulmeting wordt elk resultaat een discussie over definities.', en: 'Without it, every result becomes an argument about definitions.', focus: 'nobase' },
    ]),
    sc('s5', { nl: 'Volgen na de livegang', en: 'Tracking after go-live' }, [
      { nl: 'Volg de baten {n:6} tot {n:12} maanden na de livegang.', en: 'Track the benefits for {n:6} to {n:12} months after go-live.', focus: 'span' },
      { nl: 'De eigenaar kijkt elke maand. Een check-in na {n:3} en na {n:6} maanden.', en: 'The owner looks every month. A check-in at {n:3} and {n:6} months.', focus: ['monthly', 'checks', 'teamlead'] },
      { nl: 'Een trigger: twee maanden achter elkaar over de grens? Dan grijpt de eigenaar in.', en: 'A trigger: two months in a row past the agreed level? Then the owner acts.', focus: ['trig', 'teamlead'] },
      { nl: 'Zet het in het afsluitplan, met namen en data.', en: 'Put it in the close-out plan, with names and dates.', focus: ['plan', 'sheet'] },
    ]),
    sc('s6', { nl: 'Eerlijk over toerekening', en: 'Honest about attribution' }, [
      { nl: '{t:Toerekening|Toerekening}: hoeveel van de verandering mag je aan je project toeschrijven?', en: '{t:Attribution|Attribution}: how much of the change may you credit to your project?', cue: { Toerekening: 'attr' }, focus: ['attr', 'drop'] },
      { nl: 'Begon er tegelijk een nieuwe aannemer? Dan claim je niet alles.', en: 'Did a new contractor start at the same time? Then you don’t claim it all.', focus: 'contractor' },
      { nl: '“We schatten dat {n:60} tot {n:70}% van de gereedheidscheck komt.” En laat zien waarom.', en: '“We estimate {n:60} to {n:70}% comes from the readiness check.” And show why.', focus: 'est' },
      { nl: 'Het sterkste bewijs: een regio zonder de check, in dezelfde maanden.', en: 'The strongest evidence: a region without the check, over the same months.', focus: 'region' },
      { nl: 'Een bescheiden getal dat je kunt verdedigen, wint het van een groot getal.', en: 'A modest number you can defend beats a big one you can’t.', focus: ['modest', 'sponsor'] },
    ]),
    sc('s7', { nl: 'Waar baten weglekken', en: 'Where benefits leak' }, [
      { nl: 'Directies zijn niet voor niks sceptisch: baten vallen vaak tegen.', en: 'Boards are sceptical for good reason: benefits often fall short.', focus: ['sceptic', 'sponsor'] },
      { nl: 'Baten van één project: module Landen. Hier: programma en portfolio.', en: 'Benefits for one project: module Land. Here: programme and portfolio.', focus: 'scope' },
      { nl: 'Het project sluit, het team gaat verder, de oude manier sluipt terug.', en: 'The project closes, the team moves on, the old way creeps back.', focus: 'leak' },
      { nl: '“Wie kijkt volgende maand naar dit getal, en wat doet die als het wegzakt?”', en: '“Who looks at this number next month, and what do they do if it slips?”', focus: ['ask', 'jij'] },
    ]),
    sc('s8', { nl: 'Waar is de € 300k?', en: 'Where is the €300k?' }, [
      { nl: 'Een omstelproject, in maart afgesloten: omsteltijd van {n:90} naar {n:45} minuten.', en: 'A changeover project, closed in March: changeover from {n:90} to {n:45} minutes.', focus: 'case' },
      { nl: 'De business case beloofde € {n:300}k per jaar. In september vraagt de CFO waar het is.', en: 'The business case promised €{n:300}k a year. In September the CFO asks where it is.', focus: ['promise', 'sponsor'] },
      { nl: 'Eén: de omstellingen zijn teruggekropen naar {n:70} minuten.', en: 'One: changeovers have crept back to {n:70} minutes.', focus: 'crept' },
      { nl: 'Twee: de vrijgekomen capaciteit is nooit benut.', en: 'Two: the freed capacity was never used.', focus: 'unused' },
    ]),
    sc('s9', { nl: 'Twee problemen', en: 'Two problems' }, [
      { nl: 'De uitkomst zakte weg: de operationeel manager herstelt de standaard.', en: 'The outcome slipped: the operations manager restores the standard.', focus: ['fixOc', 'teamlead'] },
      { nl: 'Bij {n:45} minuten ook geen baten: capaciteit wordt pas geld als iemand er geld van maakt.', en: 'No benefit even at {n:45} minutes: capacity is only money when someone makes it money.', focus: 'money' },
      { nl: 'Leg het MT de keuze voor: weekenddienst schrappen of meer volume verkopen.', en: 'Put the choice to the MT: cut the weekend shift or sell more volume.', focus: ['choice', 'sponsor'] },
      { nl: 'Eén batenhouder, de meetwijze met de controller. Boek de € {n:300}k pas na dat besluit.', en: 'One benefit owner, the measure with the controller. Book the €{n:300}k only after that decision.', focus: ['book', 'controller'] },
      { nl: 'Zeg het de CFO direct, zonder de oude business case te verdedigen.', en: 'Tell the CFO directly, without defending the old business case.', focus: ['direct', 'jij', 'sponsor'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's
// teach text and worked example, so every spoken point of the checklist above
// is said here. No symbol the voice would read aloud, no spoken parenthesis or
// quote. Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12), after the kit's SAY rules. Rules added for this
// film in films/_kit/timeline.mjs (no other film's spoken text changes):
// batenhouder split at the head (espeak-ng reads a full e in -ten-), ploegdagen
// split (it stresses ploeg-DA-gen), business case as Dutch project people say
// it (it reads "bu-zie-nus kaa-se"), weekenddienst with the Dutch "wie-ken"
// stress on the first part, and lijnmanager and operationeel manager with a
// Dutch "manager" (it reads MAA-naa-cher; said lijn-menetsjer, as the kit's
// middenmanager rule does) and operationeel stressed on -NEEL. The kit's
// existing rules give nulmeting, gereedheidscheck, livegang, controller, the
// KPI and 1.200 (twaalfhonderd). Reworded where espeak-ng misreads a word
// that is no lesson term: "gaat live" (said "gaat in gebruik"; lie-ve),
// managers (said leidinggevenden), sceptisch (it drops the k: said "twijfelen
// niet voor niks"; the card keeps sceptisch), sales (said de verkoop), direct
// (stressed DI-; said rechtstreeks), stormweken (stressed -WEE-; said
// "weken met storm"; the caption keeps stormweken), voorbij (stressed VOOR-;
// said "over die grens"). The lesson's trigger is said "trikker" (espeak-ng
// reads a soft Dutch g, "tri-gher"; a kit rule scoped to this film's "trigger,
// een actiegrens", so pm.land.handover's trigger keeps its voice), followed by
// actiegrens, as pm.perform.tree says it.
const SAY = [
  [ // s1 output, outcome, benefits
    { nl: 'Drie woorden om uit elkaar te houden: output, uitkomst en baten. {t:Output|Output} is wat het project oplevert.',
      en: 'Three words to keep apart: output, outcome and benefit. {t:Output|Output} is what the project delivers.' },
    { nl: 'De {t:Uitkomst|uitkomst} is de verandering in prestatie die die output moet veroorzaken.',
      en: 'The {t:Outcome|outcome} is the change in performance that the output is meant to cause.' },
    { nl: 'En de {t:Baten|baten} zijn de meetbare winst voor de organisatie, meestal in geld.',
      en: 'And the {t:Benefit|benefit} is the measurable gain for the organisation, usually in money.' },
    { nl: 'Projecten leveren output. De lijn, de leidinggevenden die de dagelijkse operatie draaien, is eigenaar van uitkomsten en baten.',
      en: 'Projects deliver outputs. The line, the managers who run daily operations, owns outcomes and benefits.' },
  ],
  [ // s2 the readiness check
    { nl: 'Een voorbeeld. De output: de gereedheidscheck gaat in gebruik.',
      en: 'An example. The output: the readiness check goes live.' },
    { nl: 'De uitkomst: de afzeggingen dalen van {n:14} naar {n:8} procent.',
      en: 'The outcome: cancellations drop from {n:14} to {n:8} percent.' },
    { nl: 'De baten: zo\'n {n:1200} verspilde ploegdagen per jaar minder.',
      en: 'The benefit: about {n:1200} fewer wasted crew-days a year.' },
    { nl: 'Tegen {n:750} euro per ploegdag is dat {n:900} duizend euro per jaar.',
      en: 'At {n:750} euros per crew-day, that is {n:900} thousand euros a year.' },
    { nl: 'De check levert het project. Maar de daling en het geld moet de lijn binnenhalen.',
      en: 'The project delivers the check. But the line has to bring in the drop and the money.' },
  ],
  [ // s3 the benefit owner
    { nl: 'Benoem daarom de {t:Batenhouder|batenhouder} voordat het project start.',
      en: 'So name the {t:Benefit owner|benefit owner} before the project starts.' },
    { nl: 'Dat is een lijnmanager op wiens budget of KPI het landt.',
      en: 'That is a line manager whose budget or KPI carries it.' },
    { nl: 'Dus niet de projectleider, want die vertrekt.',
      en: 'So not the project lead, who leaves.' },
  ],
  [ // s4 the baseline
    { nl: 'Spreek ook de {t:Nulmeting|nulmeting} af voordat je begint: de startwaarde, en precies hoe je die meet.',
      en: 'Also agree the {t:Baseline|baseline} before you start: the starting value, and exactly how it is measured.' },
    { nl: 'Hoe tel je een afzegging? Over welke periode? Tellen weken met storm mee of niet?',
      en: 'How do you count a cancellation? Over which period? Are storm weeks in or out?' },
    { nl: 'Schrijf het op, en laat de controller het aftekenen: de financiële collega die over de cijfers gaat.',
      en: 'Write it down, and get the controller to agree: the finance person who owns the numbers.' },
    { nl: 'Zonder nulmeting wordt elk resultaat een discussie over definities.',
      en: 'Without a baseline, every result becomes an argument about definitions.' },
  ],
  [ // s5 tracking after go-live
    { nl: 'Plan het volgen van de baten voor {n:6} tot {n:12} maanden na de livegang: de dag dat de verandering in gebruik gaat.',
      en: 'Plan benefits tracking for {n:6} to {n:12} months after go-live: the day the change goes into use.' },
    { nl: 'De eigenaar bekijkt het getal elke maand, en er is een check-in na {n:3} en na {n:6} maanden.',
      en: 'The owner reviews the number every month, and there is a check-in at {n:3} and at {n:6} months.' },
    { nl: 'En er is een trigger, een actiegrens. Gaat het getal twee maanden achter elkaar over die grens, dan grijpt de eigenaar in.',
      en: 'And there is a trigger. If the number slips past an agreed level two months in a row, the owner acts.' },
    { nl: 'Zet dit in het afsluitplan, met namen en data. Anders gebeurt het niet.',
      en: 'Put this in the close-out plan, with names and dates. Or it will not happen.' },
  ],
  [ // s6 attribution
    { nl: 'Wees eerlijk over {t:Toerekening|toerekening}: hoeveel van een verandering je aan je project mag toeschrijven.',
      en: 'Be honest about {t:Attribution|attribution}: how much of a change you can credit to your project.' },
    { nl: 'Daalden de afzeggingen terwijl er ook een nieuwe aannemer begon, dan kun je niet alles claimen.',
      en: 'If cancellations dropped while a new contractor also started, you can\'t claim it all.' },
    { nl: 'Zeg dan: we schatten dat {n:60} tot {n:70} procent van de gereedheidscheck komt. En laat zien waarom.',
      en: 'Say instead: we estimate that {n:60} to {n:70} percent comes from the readiness check. And show why.' },
    { nl: 'Het sterkste bewijs is een vergelijking: een regio zonder de check, in dezelfde maanden.',
      en: 'The cleanest evidence is a comparison: a region without the check, over the same months.' },
    { nl: 'Een directie vertrouwt een bescheiden getal dat je kunt verdedigen meer dan een groot getal dat je niet kunt verdedigen.',
      en: 'A board trusts a modest number it can defend more than a big one it can\'t.' },
  ],
  [ // s7 where benefits leak
    { nl: 'Directies twijfelen niet voor niks: groot onderzoek naar projecten laat zien dat baten vaak tegenvallen. De expertles van dit onderwerp kijkt naar waarom.',
      en: 'Boards are sceptical for good reason: large studies of projects find that benefits often fall short. The expert lesson of this topic looks at why.' },
    { nl: 'Baten van één project kwamen aan bod in de module Landen. Dit onderwerp kijkt vanuit programma en portfolio.',
      en: 'The module Land covered benefits for one project. This topic takes the programme and portfolio view.' },
    { nl: 'Zo zie je baten weglekken: het project sluit, het team gaat verder, en binnen een paar maanden sluipt de oude manier terug.',
      en: 'This is how benefits leak: the project closes, the team moves on, and the old way creeps back within months.' },
    { nl: 'Stel daarom bij elke afsluiting de scherpe vraag: wie kijkt volgende maand naar dit getal, en wat doet die als het wegzakt?',
      en: 'So ask the sharp question at every close-out: who looks at this number next month, and what do they do if it slips?' },
  ],
  [ // s8 where is the 300k
    { nl: 'Een voorbeeld. Een omstelproject bij een fabrikant is in maart afgesloten. De gemiddelde omsteltijd ging van {n:90} naar {n:45} minuten.',
      en: 'An example. A changeover project at a manufacturer closed in March. Average changeover went from {n:90} to {n:45} minutes.' },
    { nl: 'De business case beloofde {n:300} duizend euro per jaar. In september vraagt de CFO, de financieel directeur, waar dat geld is.',
      en: 'The business case promised {n:300} thousand euros a year. In September the CFO, the chief financial officer, asks where that money is.' },
    { nl: 'Jij vindt twee dingen. De omstellingen zijn teruggekropen naar {n:70} minuten.',
      en: 'You find two things. Changeovers have crept back to {n:70} minutes.' },
    { nl: 'En de vrijgekomen capaciteit is nooit benut: de verkoop voegde geen volume toe, en de weekenddienst draaide gewoon door.',
      en: 'And the freed capacity was never used: sales did not add volume, and the weekend shift kept running.' },
  ],
  [ // s9 two problems
    { nl: 'Haal de twee problemen uit elkaar. De uitkomst is weggezakt. Dat is voor de operationeel manager, die de standaard herstelt met een korte audit en een maandelijkse review.',
      en: 'Separate the two problems. The outcome slipped. That is for the operations manager, who restores the standard with a short audit and a monthly review.' },
    { nl: 'En zelfs bij {n:45} minuten waren er geen baten, want vrijgekomen capaciteit wordt pas geld als iemand er geld van maakt.',
      en: 'And even at {n:45} minutes there was no benefit, because freed capacity is only money when someone turns it into money.' },
    { nl: 'Leg het MT de keuze voor: de weekenddienst schrappen, of meer volume verkopen, elk met een getal.',
      en: 'Put the choice to the MT: cut the weekend shift, or sell more volume, each with a number.' },
    { nl: 'Dan benoem je één batenhouder, spreek je de meetwijze af met de controller, en boek je de {n:300} duizend euro pas als dat besluit genomen is.',
      en: 'Then name one benefit owner, agree the measure with the controller, and book the {n:300} thousand euros only once that decision is made.' },
    { nl: 'En dat zeg je de CFO rechtstreeks, zonder de oude business case te verdedigen.',
      en: 'And you tell the CFO this directly, without defending the old business case.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch, once the kit's SAY rules ran, none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(live|managers?|sceptisch|sales|direct|voorbij|trigger|batenhouder|ploegdagen|business|weekenddienst|lijnmanager)\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%€$]|:\S/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(sayable(plain, 'nl'))) throw new Error(`narration: "${MISREAD.exec(sayable(plain, 'nl'))[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(300, Math.round(all / NARRATION_WPS));
  const shown = resolveFilm(spec, lessons);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(shown.scenes[si].beats.map((b) => b.text[lang]).join(' ')))));
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"])';
const css = PM_CSS + `
.pb-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pb-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pb-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pb-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pb-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pb-big,.pb-lab{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pb-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pb-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1.2}
.pb-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pb-trig{fill:none;stroke:var(--fp-accent);stroke-width:1.8;stroke-dasharray:7 4}
.pb-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pb-arrow{fill:none;stroke:var(--anatomy-mid);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pb-dot{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1}
.pb-hotdot{fill:var(--fp-accent);stroke:var(--anatomy-card);stroke-width:1}
.pb-bar{fill:var(--anatomy-mid)}
.pb-bar2{fill:var(--fp-accent)}
.pb-band{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:var(--fp-accent);stroke-width:1;stroke-dasharray:3 2}
.pb-rest{fill:color-mix(in srgb,var(--anatomy-mid) 30%,transparent);stroke:var(--anatomy-mid);stroke-width:1}
.pb-row{fill:none;stroke:var(--anatomy-lo);stroke-width:.7;stroke-linecap:round}
.pb-tick{fill:none;stroke:var(--fp-accent);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
[data-cue][data-on] .pb-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pb-line,[data-cue][data-on] .pb-arrow{stroke:var(--fp-accent)}
[data-cue][data-on] .pb-dot{fill:var(--fp-accent)}
[data-cue][data-on] .pb-bar{fill:color-mix(in srgb,var(--fp-accent) 60%,var(--anatomy-mid))}
[data-cue][data-on] .pb-txt,[data-cue][data-on] .pb-big,[data-cue][data-on] .pb-lab,[data-cue][data-on] .pb-mute{fill:var(--fp-focus-text)}
[data-cue][data-on] .pb-row{stroke:var(--fp-accent)}
.pb-mini .pb-txt,.pb-mini .pb-mute,.pb-mini .pb-big,.pb-mini .pb-lab,.pb-mini .pb-on{display:none}
.pb-mini *{vector-effect:non-scaling-stroke}
.pb-mini .pb-card,.pb-mini .pb-hot,.pb-mini .pb-line,.pb-mini .pb-band,.pb-mini .pb-rest{stroke-width:.7px}
.pb-mini .pb-axis,.pb-mini .pb-dash,.pb-mini .pb-trig,.pb-mini .pb-arrow,.pb-mini circle{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.iso:not([data-theme="light"]) [data-cue="controller"]:not([data-on]) .pb-skin>:is(.iso-fill,.iso-top){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="controller"]:not([data-on]) .pb-skin>.iso-shade{fill:#A8957F}
/* the controller: a plum blazer, a white shirt front, a dark binder (as in pm.close.results) */
.iso{--pb-plum:#A9798A}
.iso[data-theme="light"]{--pb-plum:#7E4A5C}
[data-cue="controller"]:not([data-on]) .pb-ctl>:is(.iso-fill,.iso-top){fill:color-mix(in srgb,var(--pb-plum) 78%,var(--anatomy-top))}
[data-cue="controller"]:not([data-on]) .pb-ctl>.iso-shade{fill:color-mix(in srgb,var(--pb-plum) 88%,var(--anatomy-shade-0))}
[data-cue="controller"]:not([data-on]) .pb-shirt>:is(.iso-fill,.iso-top,.iso-shade){fill:#F4F1EA}
[data-cue="controller"]:not([data-on]) .pb-binder>:is(.iso-fill,.iso-top){fill:#33403F}
[data-cue="controller"]:not([data-on]) .pb-binder>.iso-shade{fill:#26302F}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard dat het paneel in het klein herhaalt, en een klok. Jij, de adviseur in petrol, staat bij het bord. De teamleider in werkvest staat aan het linkereind van de tafel, voor de lijn; de sponsor in pak aan het rechtereind, voor de directie; de controller met een map aan de voorkant. Op tafel een vel papier, een laptop en twee kopjes. Rechts een paneel met kaarten, gemarkeerd als schema of voorbeeld: output, uitkomst en baten als drie blokken onder elkaar; de gereedheidscheck met afzeggingen van 14 naar 8 procent en 1.200 ploegdagen maal 750 euro; een tijdlijn met de batenhouder vóór de start en de projectleider die vertrekt; de nulmeting met drie vragen; maandelijkse punten na de livegang met check-ins na 3 en 6 maanden en een trigger; een daling waarvan 60 tot 70 procent aan de gereedheidscheck wordt toegerekend; een cijfer dat na de afsluiting terugzakt; en een omstelproject van 90 naar 45 en terug naar 70 minuten, met de twee problemen uit elkaar.',
  en: 'A meeting room. On the back wall a whiteboard that repeats the panel in miniature, and a clock. You, the consultant in petrol, stand at the board. The team lead in a work vest stands at the left end of the table, for the line; the sponsor in a suit at the right end, for the board; the controller with a binder at the front. On the table a sheet of paper, a laptop and two cups. At the right a panel with cards, marked as diagram or example: output, outcome and benefit as three stacked blocks; the readiness check with cancellations from 14 to 8 percent and 1,200 crew-days times 750 euros; a timeline with the benefit owner before the start and the project lead who leaves; the baseline with three questions; monthly points after go-live with check-ins at 3 and 6 months and a trigger; a drop of which 60 to 70 percent is attributed to the readiness check; a number that slides back after closing; and a changeover project from 90 to 45 and back to 70 minutes, with the two problems pulled apart.',
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

// Dev tool, not shipped. Builds the explainer film "Vragen stellen buiten je
// vak / Asking questions outside your field" for the Projects course module
// "Projecten leiden buiten je vakgebied" (pm.outside), topic Vragen stellen:
// pm.outside.phasequestions (level 1, "Vragen per fase") and
// pm.outside.estimates (level 3, "Schattingen toetsen zonder vakkennis").
//
//   node films/pm.outside.questions/build.mjs            build the page
//   node films/pm.outside.questions/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.outside.questions.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.outside.questions, P3: "the question sets per phase; checking an estimate
// with a range and a reference class", about 90 s). Storyboard drift: nine
// scenes and about four and a half minutes, because a lesson with a film no
// longer shows its worked example, so the film carries the whole teach text and
// the worked example of both lessons: the question set and its five areas (s1),
// scope and assumptions (s2), risks and estimates (s3), dependencies and when to
// ask (s4), the MES kick-off (s5); how an estimate was made, the planning
// fallacy, the range and the three-point estimate (s6), the reference class
// (s7), the second estimate, its language and the debate (s8) and the robot cell
// (s9). The other two lessons of the topic (pm.outside.fail, "Waardoor zou dit
// mislukken?", and pm.outside.jargon, "Jargon terugvertalen") are not in the
// row's description and are not served here: the narration would pass the
// 760-word cap.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (it repeats the panel in miniature), a wall
// clock and a calendar strip of twelve week cells on the side wall (the moments
// to ask, the clean-up of four to eight weeks and 1 March, a range of 3 to 6
// weeks, the robot cells' 9 to 11 weeks), a table with a sheet that fills as
// the question set, a line per area, and the recurring cast: "jij" the
// consultant in petrol at the front of the table, the team lead at the left end
// (the supplier's expert: the MES supplier, the automation supplier's
// programmer, the first estimate), the planner with a tablet behind the table
// (the client's IT lead, the second expert), and the sponsor at the right end
// (the client). A panel at the right, in stage space, carries one card per
// scene, labelled "schema" (a general picture) or "voorbeeld" (the worked
// examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below; the five areas n1 to n5 are rows
// in scene 1 and a numbered strip in scenes 2 to 5), and so are the people, the
// calendar strip and the sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries
// it, on screen at least 4 s):
//   phasequestions teach 1: when you can't judge the answers, the quality of
//     your questions is your expertise (s1 b1); a question set, a short fixed
//     list for a phase, whatever the field: a database, a cable or a robot (s1
//     b2); five areas: scope, assumptions, risks, estimates, dependencies (s1
//     b3); in that order, each builds on the one before (s1 b4)
//   phasequestions teach 2: scope: what exactly at the end, what explicitly not
//     (s2 b1, b2); the second half matters most, misunderstandings (s2 b2); an
//     assumption, treated as true without proof; "what are we assuming that, if
//     wrong, changes the plan?" (s2 b3); "the factory's network can carry the
//     new data"; write them down, a risk until checked (s2 b4, the sheet)
//   phasequestions teach 3: a risk may happen and would hurt the goal; "what
//     worries you most, what went wrong on similar jobs?" (s3 b1); each expert
//     separately, in a group the most senior voice sets the tone (s3 b2); an
//     estimate, a forecast of time or cost, not a promise; "how sure, based on
//     what?" (s3 b3); a range rather than one number (s3 b4)
//   phasequestions teach 4: a dependency, what your work needs from someone
//     else first; "what do you need from others, and by when?" (s4 b1); the grid
//     operator needs the load data before sizing the cable, the MES supplier an
//     interface from the ERP team (s4 b2); most delays are not technical but
//     dependencies nobody owned (s4 b3)
//   phasequestions teach 5: at the start, at every change, before each go/no-go
//     (s4 b4, the calendar); the same questions every time, experts prepare (s4
//     b4); the failure, once at the kick-off and filed; the closing question,
//     "what did we assume today that nobody has checked?" (s4 b5)
//   phasequestions example: an MES kick-off at a metal parts maker with the
//     supplier and the IT lead (s5 b1); scope: lines 1 and 2, not line 3 (s5
//     b2); assumption: machine data through the existing network, unchecked (s5
//     b3, the cross on the sheet); risk: master data, products and routings,
//     dirty elsewhere; estimate: clean-up four to eight weeks, depending on the
//     state (s5 b4, the calendar); dependency: an ERP interface from the
//     client's IT by 1 March; five questions, three new risks, one owner each
//     (s5 b5)
//   estimates teach 1: you can't check the work, but how the estimate was made;
//     three tools: ranges, reference classes, a second estimate (s6 b1); the
//     planning fallacy, Kahneman and Tversky 1979: underestimating your own task
//     even when similar tasks ran late; experts too (s6 b2)
//   estimates teach 2: a range, low and high, "between 3 and 6 weeks", shows the
//     uncertainty (s6 b3, the calendar); a three-point estimate adds the most
//     likely value (s6 b4); PERT, 1958, the US Navy's Polaris programme; (O + 4M
//     + P) / 6; a convention, not a law, it pulls towards the long tail (s6 b5)
//   estimates teach 3: a reference class, similar past projects as a yardstick;
//     Kahneman and Flyvbjerg recommend it (s7 b1); instead of reasoning from the
//     plan, "how long did the last five interfaces like this take?" (s7 b2);
//     Flyvbjerg and Gardner, How Big Things Get Done, 2023 (title not shown):
//     about 16,000 projects, mostly large; 8.5% on budget and schedule, 0.5% also
//     the benefits (s7 b3); a base rate beats a confident plan (s7 b4)
//   estimates teach 4: a second estimate from another expert, without the first
//     number, compared (s8 b1); close, good; far apart, the gap is the
//     conversation, "what do you see that makes it longer?" (s8 b2); "three
//     weeks if nothing goes wrong" is the best case; an estimate unchanged for
//     months is often not updated (s8 b3)
//   estimates teach 5: experts argue: some agile teams only forecast from their
//     track record, others want a firm number for the contract; a forecast with
//     its uncertainty, or a hope? (s8 b4); "what would make it take twice as
//     long?", an instant answer goes into the range (s8 b5)
//   estimates example (faded): the automation supplier's PLC programming for a
//     robot cell, 6, 8 and 16 weeks (s9 b1); (6 + 4 x 8 + 16) / 6 = 54 / 6 = 9
//     weeks (s9 b2); their last three cells 9, 11 and 10 weeks; 9 is the
//     optimistic end (s9 b3, the calendar); plan around 10 to 11 and ask what
//     makes this one faster (s9 b4); a real reason such as reusing code, fine;
//     if not, the longer figure in the plan (s9 b5)
//
// Facts as in the lesson, checked against the sources: the planning fallacy
// was named by Kahneman and Tversky in "Intuitive prediction: biases and
// corrective procedures" (TIMS Studies in Management Science 12, 1979); the
// reference class (the "outside view") goes back to the same paper, and
// Flyvbjerg turned it into reference class forecasting (Kahneman credits him in
// Thinking, Fast and Slow, 2011, "The Outside View"); Flyvbjerg and Gardner, How
// Big Things Get Done (2023): a database of over 16,000 projects, 8.5% on budget
// and on time, 0.5% on budget, on time and on benefits; PERT was developed in
// 1957-58 by the US Navy's Special Projects Office for the Polaris programme,
// with the weighted mean (O + 4M + P) / 6. The question set and its five areas
// are credited to no one, as in the lesson.
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
const PQ = 'pm.outside.phasequestions';
const ES = 'pm.outside.estimates';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const says = (id, list, lang = 'nl') => {
  const l = lessons[lang].get(id);
  const t = [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n');
  for (const s of list) assert(t.includes(s), `${id} ${lang} no longer says "${s}"`);
};
says(PQ, ['Als je de antwoorden niet kunt beoordelen, is de kwaliteit van je vragen je vakkennis', 'Een vragenset is een korte, vaste lijst vragen die je in een bepaalde fase stelt, welk vak het ook is',
  'een database, een kabel of een robot', 'scope, aannames, risico’s, schattingen en afhankelijkheden', 'Stel ze in die volgorde; elk bouwt voort op de vorige',
  '“Wat hebben we precies aan het eind? Wat zit er uitdrukkelijk niet in?”', 'De tweede helft is het belangrijkst: daar zitten de misverstanden',
  'Een aanname is iets wat je voorlopig als waar behandelt, zonder bewijs', '“Wat nemen we aan dat, als het niet klopt, de planning verandert?”', 'het netwerk van de fabriek de nieuwe data aankan', 'elke aanname is een risico tot hij gecheckt is',
  'Een risico is iets wat kan gebeuren en het doel zou schaden', '“Waar maak je je het meest zorgen over? Wat ging er mis bij vergelijkbare klussen?”', 'Vraag elke expert apart; in een groep zet de meest senior stem de toon',
  'Een schatting is een voorspelling van tijd of kosten, geen belofte', '“Hoe zeker ben je, en waar is het op gebaseerd?”', 'Vraag om een bandbreedte (range) in plaats van één getal',
  'Een afhankelijkheid is iets wat jouw werk van iemand anders nodig heeft voordat het verder kan', '“Wat heb je van anderen nodig, en wanneer?”', 'de netbeheerder heeft de belastinggegevens van de fabriek nodig voordat hij de kabel kan dimensioneren',
  'de MES-leverancier heeft een koppeling (interface) van het ERP-team nodig', 'De meeste vertragingen in projecten buiten je vak zijn niet technisch', 'afhankelijkheden waar niemand eigenaar van was',
  'bij de start, bij elke wijziging en voor elk go/no-go-moment', 'Stel elke keer dezelfde vragen; experts raken eraan gewend en gaan de antwoorden voorbereiden',
  'ze één keer stellen, bij de kick-off, en de antwoorden archiveren', '“Wat hebben we vandaag aangenomen dat niemand gecheckt heeft?”',
  'Kick-off voor een MES bij een maker van metalen onderdelen', 'met de leverancier en de IT-lead de vijf gebieden door', '“Welke lijnen draaien bij livegang op het MES?” “Lijn 1 en 2. Lijn 3 zit er niet in.”',
  '“Dat de machinedata binnenkomt via het bestaande netwerk.” Jij schrijft: niet gecheckt.', 'De stamgegevens (master data), de basisgegevens over producten en routings (de volgorde van bewerkingen per product), waren vervuild',
  '“Vier tot acht weken, afhankelijk van de staat.”', '“Een ERP-koppeling van de IT van de klant voor 1 maart.”', 'Vijf vragen, drie nieuwe risico’s, elk een eigenaar']);
says(ES, ['Je kunt een schatting niet toetsen door het werk te beoordelen, maar wel door te kijken hoe hij gemaakt is', 'Drie gereedschappen: bandbreedtes, referentieklassen en een tweede schatting',
  'Daniel Kahneman en Amos Tversky (1979) benoemden de planningsdrogreden', 'de neiging om te onderschatten hoe lang je eigen taak duurt, zelfs als je weet dat vergelijkbare taken uitliepen', 'Experts hebben er ook last van',
  'Een bandbreedte is een lage en een hoge schatting in plaats van één getal: “tussen 3 en 6 weken”', 'Hij laat zien hoe onzeker iemand is', 'Een driepuntsschatting voegt een meest waarschijnlijke waarde toe',
  'uit PERT, in 1958 ontwikkeld voor het Polaris-raketprogramma van de Amerikaanse marine', '(optimistisch + 4 × meest waarschijnlijk + pessimistisch) ÷ 6', 'Het is een afspraak, geen wet, maar het trekt de schatting naar de lange staart',
  'Een referentieklasse is een groep vergelijkbare eerdere projecten die je als maatstaf gebruikt', 'Kahneman en Bent Flyvbjerg raden het aan', '“hoe lang duurden de laatste vijf koppelingen zoals deze?”',
  'Flyvbjerg en Gardner (How Big Things Get Done, 2023)', 'ongeveer 16.000 projecten, vooral grote', 'maar 8,5% zowel budget als planning haalde, en maar 0,5% ook de beloofde baten opleverde', 'Zo’n basiscijfer (base rate) wint van een zelfverzekerd plan',
  'vraag een andere expert, zonder het eerste getal te laten zien, en vergelijk', 'Liggen ze dicht bij elkaar, mooi. Liggen ze ver uit elkaar, dan is het verschil het gesprek: “Wat zie jij waardoor het langer duurt?”',
  '“Drie weken als er niks misgaat” is het beste geval, niet de schatting', 'een schatting die maandenlang niet verandert, wordt vaak niet bijgewerkt',
  'Sommige agile teams vermijden tijdschattingen en voorspellen alleen vanuit hun eigen trackrecord', 'Anderen willen een vast getal voor het contract', 'is de schatting een voorspelling met haar onzekerheid, of een hoop?',
  '“Waardoor zou het twee keer zo lang duren?” Komt het antwoord meteen, zet dat dan in de bandbreedte',
  'het PLC-programmeerwerk voor een robotcel', 'optimistisch 6 weken, meest waarschijnlijk 8 weken, pessimistisch 16 weken', 'het programmeren 9, 11 en 10 weken duurde',
  '(6 + 4 × 8 + 16) ÷ 6 = 54 ÷ 6 = 9 weken', '9 aan de optimistische kant ligt', 'Plan dus rond 10 tot 11 weken', 'Waardoor gaat deze sneller?', 'zoals code hergebruiken, prima', 'zet het langere getal in de planning']);
says(ES, ['between 3 and 6 weeks', 'about 16,000 projects', 'only 8.5% hit both budget and schedule', 'only 0.5% also delivered', '(6 + 4 × 8 + 16) ÷ 6 = 54 ÷ 6 = 9 weeks', '9, 11 and 10 weeks', 'plan around 10 to 11 weeks'], 'en');
says(PQ, ['Lines 1 and 2. Line 3 isn’t included.', 'Four to eight weeks', 'by 1 March'], 'en');
// the numbers the cards draw
const CELL = { o: 6, m: 8, p: 16, sum: 54, pert: 9, past: [9, 11, 10], plan: [10, 11] };
assert(CELL.o + 4 * CELL.m + CELL.p === CELL.sum && CELL.sum / 6 === CELL.pert, '(6 + 4 x 8 + 16) / 6 = 54 / 6 = 9');
assert(CELL.pert === Math.min(...CELL.past) && CELL.plan[1] === Math.max(...CELL.past), '9 is the low end of the cells\' 9 to 11 weeks');
const RANGE = [3, 6];
const CLEAN = [4, 8];
const BOTH = 8.5;
const ALL = 0.5;
assert(ALL < BOTH, '0.5% is a part of the 8.5%');
// the second estimate: two numbers from the estimates recall (4 and 10 weeks)
const TWO = [4, 10];
assert(lessons.nl.get(ES).recall.some((q) => q.q.includes('4 weken en 10 weken')), 'the recall\'s two independent estimates, 4 and 10 weeks');

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
// the cast: who stands where (world cm)
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
// explains. n1 to n5 are the five areas of the question set.
const PX = 322;
const PW = 308;
const CUES = ['skill', 'set', 'n1', 'n2', 'n3', 'n4', 'n5', 'order',
  'scope', 'notin', 'assume', 'unchecked', 'risk', 'apart', 'est', 'ask',
  'dep', 'depex', 'owner', 'when', 'archive', 'close',
  'case', 'q1', 'q2', 'q3', 'q4', 'q5', 'tally',
  'tools', 'fallacy', 'range', 'three', 'pert', 'ref', 'last5', 'flyv', 'base',
  'second', 'gap', 'words', 'debate', 'twice', 'case2', 'calc', 'ref3', 'plan', 'verdict'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + g('pExtra', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.land.handover): the same points, fewer bytes; each rewrite is read back.
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
  { from: [160, 205, 1], to: toward(HEAD.jij, 1.06) },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.12] },
  { from: toward(mid(HEAD.teamlead, HEAD.planner), 1.04), to: toward(mid(HEAD.teamlead, HEAD.planner), 1.1) },
  { from: toward(HEAD.teamlead, 1.04), to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.14] },
  { from: [160, 205, 1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.08] },
  { from: [160, 205, 1.04], to: toward(HEAD.jij, 1.08) },
  { from: toward(mid(HEAD.teamlead, HEAD.planner), 1.04), to: toward(mid(HEAD.teamlead, HEAD.planner), 1.1) },
  { from: toward(HEAD.teamlead, 1.06), to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.06] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, WEEKS, CELL, RANGE, CLEAN, BOTH, ALL, TWO };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.outside.questions',
  title: { nl: 'Vragen stellen buiten je vak', en: 'Asking questions outside your field' },
  lessons: [PQ, ES],
  strictFocus: true,
  scenes: [
    sc('s1', PQ, 1, { nl: 'Vijf gebieden', en: 'Five areas' }, [
      { nl: 'Kun je de antwoorden niet beoordelen, dan is de kwaliteit van je vragen je vakkennis.', en: 'If you can’t judge the answers, the quality of your questions is your expertise.', focus: ['skill', 'jij'] },
      { nl: 'Een {t:Vragenset|vragenset}: een korte, vaste lijst per fase, welk vak het ook is.', en: 'A {t:Question set|question set}: a short, fixed list per phase, whatever the field.', cue: { Vragenset: 'set' }, focus: ['set', 'sheet'] },
      { nl: 'Vijf gebieden: scope, aannames, risico’s, schattingen en afhankelijkheden.', en: 'Five areas: scope, assumptions, risks, estimates and dependencies.', focus: ['n1', 'n2', 'n3', 'n4', 'n5'] },
      { nl: 'Stel ze in die volgorde: elk bouwt voort op de vorige.', en: 'Ask them in that order: each builds on the one before.', focus: 'order' },
    ]),
    sc('s2', PQ, 1, { nl: 'Scope en aannames', en: 'Scope and assumptions' }, [
      { nl: 'Scope: wat hebben we precies aan het eind?', en: 'Scope: what exactly will we have at the end?', focus: ['n1', 'scope'] },
      { nl: 'En wat zit er uitdrukkelijk niet in? Daar zitten de misverstanden.', en: 'And what is explicitly not included? That is where misunderstandings live.', focus: 'notin' },
      { nl: 'Een {t:Aanname|aanname}: voorlopig waar, zonder bewijs. Welke verandert de planning als hij niet klopt?', en: 'An {t:Assumption|assumption}: true for now, without proof. Which one changes the plan if it’s wrong?', cue: { Aanname: 'assume' }, focus: ['n2', 'assume'] },
      { nl: '“Het netwerk kan de nieuwe data aan.” Schrijf het op: een risico tot het gecheckt is.', en: '“The network can carry the new data.” Write it down: a risk until it is checked.', focus: ['unchecked', 'sheet'] },
    ]),
    sc('s3', PQ, 1, { nl: 'Risico’s en schattingen', en: 'Risks and estimates' }, [
      { nl: 'Een {t:Risico|risico} kan gebeuren en schaadt het doel. Wat ging er mis bij vergelijkbare klussen?', en: 'A {t:Risk|risk} may happen and would hurt the goal. What went wrong on similar jobs?', cue: { Risico: 'risk' }, focus: ['n3', 'risk'] },
      { nl: 'Vraag elke expert apart: in een groep zet de meest senior stem de toon.', en: 'Ask each expert separately: in a group the most senior voice sets the tone.', focus: ['apart', 'teamlead', 'planner'] },
      { nl: 'Een {t:Schatting|schatting} is een voorspelling, geen belofte. Hoe zeker, en waarop gebaseerd?', en: 'An {t:Estimate|estimate} is a forecast, not a promise. How sure, and based on what?', cue: { Schatting: 'est' }, focus: ['n4', 'est'] },
      { nl: 'Vraag om een bandbreedte in plaats van één getal.', en: 'Ask for a range rather than one number.', focus: 'ask' },
    ]),
    sc('s4', PQ, 1, { nl: 'Afhankelijkheden, steeds weer', en: 'Dependencies, again and again' }, [
      { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: wat heb je van anderen nodig, en wanneer?', en: 'A {t:Dependency|dependency}: what do you need from others, and by when?', cue: { Afhankelijkheid: 'dep' }, focus: ['n5', 'dep'] },
      { nl: 'De netbeheerder wacht op belastinggegevens; de MES-leverancier op een koppeling van het ERP-team.', en: 'The grid operator waits for load data; the MES supplier for an interface from the ERP team.', focus: 'depex' },
      { nl: 'De meeste vertragingen zijn niet technisch: afhankelijkheden zonder eigenaar.', en: 'Most delays are not technical: dependencies nobody owned.', focus: 'owner' },
      { nl: 'Bij de start, bij elke wijziging en voor elk go/no-go-moment: elke keer dezelfde vragen.', en: 'At the start, at every change and before each go/no-go: the same questions every time.', focus: ['when', 'calendar'] },
      { nl: 'Niet één keer bij de kick-off en dan archiveren. Wat namen we aan dat niemand checkte?', en: 'Not once at the kick-off and then filed. What did we assume that nobody checked?', focus: ['archive', 'close'] },
    ]),
    sc('s5', PQ, 1, { nl: 'Kick-off voor een MES', en: 'An MES kick-off' }, [
      { nl: 'Kick-off voor een MES bij een maker van metalen onderdelen, met de leverancier en de IT-lead.', en: 'An MES kick-off at a metal parts maker, with the supplier and the IT lead.', focus: ['case', 'teamlead', 'planner'] },
      { nl: 'Scope: welke lijnen draaien bij livegang op het MES? Lijn {n:1} en {n:2}; lijn {n:3} niet.', en: 'Scope: which lines are on the MES at go-live? Lines {n:1} and {n:2}; not line {n:3}.', focus: ['q1', 'n1', 'teamlead'] },
      { nl: 'Aanname: de machinedata komt via het bestaande netwerk. Jij schrijft: niet gecheckt.', en: 'Assumption: machine data comes through the existing network. You write: unchecked.', focus: ['q2', 'n2', 'sheet'] },
      { nl: 'Risico: elders waren de stamgegevens vervuild. Schatting: opschonen vier tot acht weken.', en: 'Risk: elsewhere the master data was dirty. Estimate: four to eight weeks of clean-up.', focus: ['q3', 'q4', 'calendar'] },
      { nl: 'Afhankelijkheid: een ERP-koppeling vóór {n:1} maart. Vijf vragen, drie nieuwe risico’s.', en: 'Dependency: an ERP interface by {n:1} March. Five questions, three new risks.', focus: ['q5', 'tally', 'planner'] },
    ]),
    sc('s6', ES, 3, { nl: 'Hoe is hij gemaakt?', en: 'How was it made?' }, [
      { nl: 'Toets niet het werk, maar hoe de schatting gemaakt is. Drie gereedschappen.', en: 'Don’t judge the work; check how the estimate was made. Three tools.', focus: 'tools' },
      { nl: 'De {t:Planningsdrogreden|planningsdrogreden}: je eigen taak onderschatten. Experts ook.', en: 'The {t:Planning fallacy|planning fallacy}: underestimating your own task. Experts too.', cue: { Planningsdrogreden: 'fallacy' }, focus: 'fallacy' },
      { nl: 'Een {t:Bandbreedte|bandbreedte}: tussen {n:3} en {n:6} weken laat de onzekerheid zien.', en: 'A {t:Range|range}: between {n:3} and {n:6} weeks shows the uncertainty.', cue: { Bandbreedte: 'range' }, focus: ['range', 'calendar'] },
      { nl: 'Een {t:Driepuntsschatting|driepuntsschatting} voegt de meest waarschijnlijke waarde toe.', en: 'A {t:Three-point estimate|three-point estimate} adds the most likely value.', cue: { Driepuntsschatting: 'three' }, focus: 'three' },
      { nl: 'PERT, uit 1958: (O + 4M + P) ÷ 6. Een afspraak, geen wet: het trekt naar de lange staart.', en: 'PERT, from 1958: (O + 4M + P) ÷ 6. A convention, not a law: it pulls towards the long tail.', focus: 'pert' },
    ]),
    sc('s7', ES, 3, { nl: 'Vergelijk met eerdere klussen', en: 'Compare with past jobs' }, [
      { nl: 'Een {t:Referentieklasse|referentieklasse}: vergelijkbare eerdere projecten als maatstaf.', en: 'A {t:Reference class|reference class}: similar past projects as a yardstick.', cue: { Referentieklasse: 'ref' }, focus: 'ref' },
      { nl: 'Niet vanuit het plan redeneren: hoe lang duurden de laatste vijf zoals deze?', en: 'Don’t reason from the plan: how long did the last five like this take?', focus: 'last5' },
      { nl: 'Zo’n {n:16000} projecten: maar {n:8.5}% haalde budget en planning, {n:0.5}% ook de baten.', en: 'About {n:16000} projects: only {n:8.5}% hit budget and schedule, {n:0.5}% the benefits too.', focus: 'flyv' },
      { nl: 'Zo’n basiscijfer wint van een zelfverzekerd plan.', en: 'A base rate like that beats a confident plan.', focus: 'base' },
    ]),
    sc('s8', ES, 3, { nl: 'Een tweede schatting', en: 'A second estimate' }, [
      { nl: 'Een {t:Tweede schatting|tweede schatting}: een andere expert, zonder het eerste getal te zien.', en: 'A {t:Second estimate|second estimate}: another expert, without seeing the first number.', cue: { 'Tweede schatting': 'second' }, focus: ['second', 'teamlead', 'planner'] },
      { nl: 'Ver uit elkaar? Dan is het verschil het gesprek: wat zie jij waardoor het langer duurt?', en: 'Far apart? Then the gap is the conversation: what do you see that makes it longer?', focus: 'gap' },
      { nl: '“Drie weken als er niks misgaat” is het beste geval. Maanden hetzelfde getal: niet bijgewerkt.', en: '“Three weeks if nothing goes wrong” is the best case. The same number for months: not updated.', focus: 'words' },
      { nl: 'Sommige teams voorspellen uit hun trackrecord, anderen willen een vast getal. Voorspelling of hoop?', en: 'Some teams forecast from their track record, others want a firm number. Forecast, or hope?', focus: 'debate' },
      { nl: 'Waardoor zou het twee keer zo lang duren? Komt het antwoord meteen, zet het in de bandbreedte.', en: 'What would make it take twice as long? If the answer comes instantly, put it in the range.', focus: 'twice' },
    ]),
    sc('s9', ES, 3, { nl: 'Een robotcel', en: 'A robot cell' }, [
      { nl: 'PLC-werk voor een robotcel: optimistisch {n:6} weken, meest waarschijnlijk {n:8}, pessimistisch {n:16}.', en: 'PLC work for a robot cell: optimistic {n:6} weeks, most likely {n:8}, pessimistic {n:16}.', focus: ['case2', 'teamlead'] },
      { nl: '({n:6} + 4 × {n:8} + {n:16}) ÷ 6 = {n:54} ÷ 6 = {n:9} weken.', en: '({n:6} + 4 × {n:8} + {n:16}) ÷ 6 = {n:54} ÷ 6 = {n:9} weeks.', focus: 'calc' },
      { nl: 'Hun laatste drie cellen: {n:9}, {n:11} en {n:10} weken. {n:9} is de optimistische kant.', en: 'Their last three cells: {n:9}, {n:11} and {n:10} weeks. {n:9} is the optimistic end.', focus: ['ref3', 'calendar'] },
      { nl: 'Plan rond {n:10} tot {n:11} weken, en vraag: waardoor gaat deze sneller?', en: 'Plan around {n:10} to {n:11} weeks, and ask: what makes this one faster?', focus: ['plan', 'jij'] },
      { nl: 'Een echte reden, zoals code hergebruiken? Prima. Zo niet: het langere getal in de planning.', en: 'A real reason, such as reusing code? Fine. If not: the longer figure in the plan.', focus: 'verdict' },
    ]),
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the cards it carries every
// point of the checklist above. No symbols the voice would read aloud: numbers
// stay plain, percent is said as a word, no quotes or parentheses; the formula
// is said in words.
// Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). New SAY rules in films/_kit/timeline.mjs for this
// film (no other film's spoken text changes): Kahneman, Flyvbjerg and Gardner
// as their speakers say them (Kaaneman, Fluubjerg, Kardner), referentieklasse
// and basiscijfer split at the head, IT-lead as IT-lied. Shared rules already
// cover scope (skoop), MES (letters), livegang (laif-gang), agile (etsjail) and
// go/no-go. Kept out of the Dutch narration because espeak-ng misreads them
// (they stay in the captions and on the cards): the plural bandbreedtes
// (stressed band-bree-TES: said in the singular), basisgegevens ("basis-che-
// gevens": said "de gegevens"), routings (said "de volgorde van bewerkingen"),
// trackrecord (said "wat ze eerder haalden"), planningssessie (said
// "planningsoverleg") and Amerikaanse (stressed A-: said "van de Verenigde
// Staten"). The guard below runs on the text after the SAY rules, so a word a
// rule rewrites passes and a misread one fails the build.
const SAY = [
  [ // s1 five areas
    { nl: 'Als je de antwoorden niet kunt beoordelen, is de kwaliteit van je vragen je vakkennis.',
      en: 'When you can\'t judge the answers, the quality of your questions is your expertise.' },
    { nl: 'Een {t:Vragenset|vragenset} is een korte, vaste lijst vragen voor een fase, welk vak het ook is: een database, een kabel of een robot.',
      en: 'A {t:Question set|question set} is a short, fixed list of questions per phase, whatever the field: a database, a cable or a robot.' },
    { nl: 'Vijf gebieden dekken het meeste: scope, aannames, risico\'s, schattingen en afhankelijkheden.',
      en: 'Five areas cover most of it: scope, assumptions, risks, estimates and dependencies.' },
    { nl: 'Stel ze in die volgorde. Elk bouwt voort op de vorige.',
      en: 'Ask them in that order. Each builds on the one before.' },
  ],
  [ // s2 scope and assumptions
    { nl: 'Scope: wat hebben we precies aan het eind?',
      en: 'Scope: what exactly will we have at the end?' },
    { nl: 'En wat zit er uitdrukkelijk niet in? Die helft is het belangrijkst: daar zitten de misverstanden.',
      en: 'And what is explicitly not included? That half matters most: misunderstandings live there.' },
    { nl: 'Een {t:Aanname|aanname}: voorlopig waar, zonder bewijs. Vraag: wat nemen we aan dat, als het niet klopt, de planning verandert?',
      en: 'An {t:Assumption|assumption}: true for now, without proof. Ask: what are we assuming that, if wrong, changes the plan?' },
    { nl: 'Bijvoorbeeld: het netwerk van de fabriek kan de nieuwe data aan. Schrijf aannames op: elke aanname is een risico tot hij gecheckt is.',
      en: 'For example: the factory\'s network can carry the new data. Write assumptions down: each one is a risk until it is checked.' },
  ],
  [ // s3 risks and estimates
    { nl: 'Een {t:Risico|risico} kan gebeuren en het doel schaden. Vraag: waar maak je je het meest zorgen over? Wat ging er mis bij vergelijkbare klussen?',
      en: 'A {t:Risk|risk} may happen and hurt the goal. Ask: what worries you most? What went wrong on similar jobs?' },
    { nl: 'Vraag elke expert apart. In een groep zet de meest senior stem de toon.',
      en: 'Ask each expert separately. In a group, the most senior voice sets the tone.' },
    { nl: 'Een {t:Schatting|schatting} is een voorspelling van tijd of kosten, geen belofte. Vraag: hoe zeker ben je, en waarop is het gebaseerd?',
      en: 'An {t:Estimate|estimate} is a forecast of time or cost, not a promise. Ask: how sure are you, and what is it based on?' },
    { nl: 'En vraag om een bandbreedte in plaats van één getal.',
      en: 'And ask for a range rather than one number.' },
  ],
  [ // s4 dependencies, again and again
    { nl: 'Een {t:Afhankelijkheid|afhankelijkheid}: jouw werk wacht op iets van een ander. Vraag: wat heb je van anderen nodig, en wanneer?',
      en: 'A {t:Dependency|dependency}: your work waits on something from someone else. Ask: what do you need from others, and by when?' },
    { nl: 'De netbeheerder heeft de belastinggegevens nodig voordat hij de kabel dimensioneert. De MES-leverancier wacht op een koppeling van het ERP-team.',
      en: 'The grid operator needs the load data before it can size the cable. The MES supplier waits for an interface from the ERP team.' },
    { nl: 'De meeste vertragingen buiten je vak zijn niet technisch. Het zijn afhankelijkheden waar niemand eigenaar van was.',
      en: 'Most delays outside your field are not technical. They are dependencies that nobody owned.' },
    { nl: 'Gebruik de sets bij de start, bij elke wijziging en voor elk go/no-go-moment. Elke keer dezelfde vragen: dan bereiden experts de antwoorden voor.',
      en: 'Use the sets at the start, at every change and before each go/no-go. The same questions every time: then experts prepare the answers.' },
    { nl: 'De klassieke fout: één keer vragen, bij de kick-off, en archiveren. Sluit elk overleg af met: wat namen we vandaag aan dat niemand checkte?',
      en: 'The typical failure: asking once, in a kick-off, and filing the answers. End every planning session with: what did we assume today that nobody checked?' },
  ],
  [ // s5 the MES kick-off
    { nl: 'Een kick-off voor een MES bij een maker van metalen onderdelen, met de leverancier en de IT-lead.',
      en: 'A kick-off for an MES at a metal parts maker, with the supplier and the IT lead.' },
    { nl: 'Scope: welke lijnen draaien bij livegang op het MES? Lijn {n:1} en {n:2}, niet lijn {n:3}.',
      en: 'Scope: at go-live, which lines are on the MES? Lines {n:1} and {n:2}, not line {n:3}.' },
    { nl: 'Aanname: de machinedata komt binnen via het bestaande netwerk. Jij schrijft: niet gecheckt.',
      en: 'Assumption: machine data comes in through the existing network. You write: unchecked.' },
    { nl: 'Risico: elders waren de stamgegevens vervuild: producten en de volgorde van bewerkingen. Schatting: opschonen kost vier tot acht weken, afhankelijk van de staat.',
      en: 'Risk: elsewhere the master data was dirty: products and the sequence of steps. Estimate: clean-up takes four to eight weeks, depending on the state.' },
    { nl: 'Afhankelijkheid: een ERP-koppeling van de IT van de klant, voor {n:1} maart. Vijf vragen, drie nieuwe risico\'s, elk een eigenaar.',
      en: 'Dependency: an ERP interface from the client\'s IT, by {n:1} March. Five questions, three new risks, one owner each.' },
  ],
  [ // s6 how was it made
    { nl: 'Een schatting toets je niet aan het werk, maar aan hoe hij gemaakt is. Drie gereedschappen: een bandbreedte, een referentieklasse en een tweede schatting.',
      en: 'You can\'t check an estimate by judging the work, only by how it was made. Three tools: a range, a reference class and a second estimate.' },
    { nl: 'Kahneman en Tversky benoemden in 1979 de {t:Planningsdrogreden|planningsdrogreden}: je onderschat je eigen taak, ook als je weet dat vergelijkbare taken uitliepen. Experts ook.',
      en: 'Kahneman and Tversky named the {t:Planning fallacy|planning fallacy} in 1979: you underestimate your own task, even when you know similar tasks ran late. Experts too.' },
    { nl: 'Een {t:Bandbreedte|bandbreedte} is een lage en een hoge schatting, tussen {n:3} en {n:6} weken. Hij laat zien hoe onzeker iemand is.',
      en: 'A {t:Range|range} is a low and a high estimate, between {n:3} and {n:6} weeks. It shows how uncertain someone is.' },
    { nl: 'Een {t:Driepuntsschatting|driepuntsschatting} voegt een meest waarschijnlijke waarde toe aan optimistisch en pessimistisch.',
      en: 'A {t:Three-point estimate|three-point estimate} adds a most likely value to optimistic and pessimistic.' },
    { nl: 'PERT, uit 1958, voor het Polaris-programma van de marine van de Verenigde Staten, weegt ze: optimistisch, plus vier keer meest waarschijnlijk, plus pessimistisch, gedeeld door zes. Een afspraak, geen wet: het trekt naar de lange staart.',
      en: 'PERT, from 1958, for the US Navy\'s Polaris programme, weights them: optimistic, plus four times most likely, plus pessimistic, divided by six. A convention, not a law: it pulls towards the long tail.' },
  ],
  [ // s7 compare with past jobs
    { nl: 'Een {t:Referentieklasse|referentieklasse}: vergelijkbare eerdere projecten als maatstaf. Kahneman en Flyvbjerg raden het aan.',
      en: 'A {t:Reference class|reference class}: similar past projects as a yardstick. Kahneman and Flyvbjerg recommend it.' },
    { nl: 'Redeneer niet vanuit het plan, maar vraag: hoe lang duurden de laatste vijf koppelingen zoals deze?',
      en: 'Instead of reasoning from the plan, ask: how long did the last five interfaces like this take?' },
    { nl: 'Flyvbjerg en Gardner melden in 2023: van zo\'n {n:16000} vooral grote projecten haalde maar {n:8.5} procent budget en planning, en maar {n:0.5} procent ook de baten.',
      en: 'Flyvbjerg and Gardner report in 2023: of about {n:16000} mostly large projects, only {n:8.5} percent hit budget and schedule, and only {n:0.5} percent the benefits too.' },
    { nl: 'Zo\'n basiscijfer wint van een zelfverzekerd plan.',
      en: 'A base rate like that beats a confident plan.' },
  ],
  [ // s8 a second estimate
    { nl: 'Een {t:Tweede schatting|tweede schatting}: vraag een andere expert, zonder het eerste getal te laten zien, en vergelijk.',
      en: 'A {t:Second estimate|second estimate}: ask another expert, without showing the first number, and compare.' },
    { nl: 'Dicht bij elkaar? Mooi. Ver uit elkaar? Dan is het verschil het gesprek: wat zie jij waardoor het langer duurt?',
      en: 'Close? Good. Far apart? Then the gap is the conversation: what do you see that makes it longer?' },
    { nl: 'Let op de taal: drie weken als er niks misgaat is het beste geval. Een schatting die maandenlang gelijk blijft, wordt vaak niet bijgewerkt.',
      en: 'Watch the language: three weeks if nothing goes wrong is the best case. An estimate unchanged for months is often not being updated.' },
    { nl: 'Experts twisten. Sommige agile teams voorspellen alleen uit wat ze eerder haalden; anderen willen een vast getal voor het contract. Jouw vraag: voorspelling met onzekerheid, of hoop?',
      en: 'Experts argue. Some agile teams only forecast from their track record; others want a firm number for the contract. Your question: a forecast with its uncertainty, or a hope?' },
    { nl: 'Scherpe vraag: waardoor zou het twee keer zo lang duren? Komt het antwoord meteen, zet dat in de bandbreedte.',
      en: 'A sharp question: what would make it take twice as long? If the answer comes instantly, put that in the range.' },
  ],
  [ // s9 a robot cell
    { nl: 'De automatiseringsleverancier schat het PLC-werk voor een robotcel: optimistisch {n:6} weken, meest waarschijnlijk {n:8}, pessimistisch {n:16}.',
      en: 'The automation supplier estimates the PLC work for a robot cell: optimistic {n:6} weeks, most likely {n:8}, pessimistic {n:16}.' },
    { nl: 'De driepuntsschatting: {n:6}, plus vier keer {n:8}, plus {n:16} is {n:54}. Gedeeld door zes: {n:9} weken.',
      en: 'The three-point estimate: {n:6}, plus four times {n:8}, plus {n:16} is {n:54}. Divided by six: {n:9} weeks.' },
    { nl: 'Hun laatste drie cellen kostten {n:9}, {n:11} en {n:10} weken. Die referentieklasse zegt: {n:9} ligt aan de optimistische kant.',
      en: 'Their last three cells took {n:9}, {n:11} and {n:10} weeks. That reference class says {n:9} is at the optimistic end.' },
    { nl: 'Plan dus rond {n:10} tot {n:11} weken, en vraag: waardoor gaat deze sneller?',
      en: 'So plan around {n:10} to {n:11} weeks, and ask: what makes this one faster?' },
    { nl: 'Een echte reden, zoals code hergebruiken? Prima. Zo niet, zet het langere getal in de planning.',
      en: 'A real reason, such as reusing code? Fine. If not, put the longer figure in the plan.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above); checked on the text
// after the SAY rules, so a rewritten word (go/no-go) passes
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(bandbreedtes|basisgegevens|routings?|trackrecord|planningssessie|Amerikaanse|Kahneman|Flyvbjerg|Gardner|referentieklasse\w*|basiscijfer|IT-lead)\b/i;
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
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-dot{fill:var(--anatomy-mid)}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia,[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-big,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dia,.pm-mini .pm-strike{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken, waarop de momenten om te vragen, het opschonen van vier tot acht weken, een bandbreedte van 3 tot 6 weken en de 9 tot 11 weken van eerdere robotcellen verschijnen. Jij, de adviseur in petrol, staat aan de voorkant van de tafel. De teamleider aan het linkereind is de expert van de leverancier, de planner met een tablet achter de tafel de IT-lead van de klant, de sponsor in pak aan het rechtereind de klant. Op tafel een vel dat zich vult als vragenset, een regel per gebied. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: de vijf gebieden van de vragenset; scope en aannames; risico’s en schattingen; afhankelijkheden en wanneer je vraagt; een kick-off voor een MES; hoe een schatting gemaakt is, de planningsdrogreden, de bandbreedte en de driepuntsschatting; de referentieklasse met de basiscijfers van Flyvbjerg en Gardner; de tweede schatting; en het programmeerwerk voor een robotcel, van 6, 8 en 16 weken naar een planning van 10 tot 11 weken.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks, where the moments to ask, a clean-up of four to eight weeks, a range of 3 to 6 weeks and the 9 to 11 weeks of past robot cells appear. You, the consultant in petrol, stand at the front of the table. The team lead at the left end is the supplier’s expert, the planner with a tablet behind the table the client’s IT lead, the sponsor in a suit at the right end the client. On the table a sheet that fills as the question set, a line per area. At the right a panel with one card per scene, marked as example or diagram: the five areas of the question set; scope and assumptions; risks and estimates; dependencies and when to ask; an MES kick-off; how an estimate was made, the planning fallacy, the range and the three-point estimate; the reference class with Flyvbjerg and Gardner’s base rates; the second estimate; and the programming for a robot cell, from 6, 8 and 16 weeks to a plan of 10 to 11 weeks.',
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

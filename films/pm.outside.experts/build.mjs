// Dev tool, not shipped. Builds the explainer film "Werken met experts /
// Working with experts" for the Projects course module "Projecten leiden
// buiten je vakgebied" (pm.outside), topic Werken met experts:
// pm.outside.trust (level 1, "Vertrouwen en controleren") and
// pm.outside.redflags (level 4, "Rode vlaggen").
//
//   node films/pm.outside.experts/build.mjs            build the page
//   node films/pm.outside.experts/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.outside.experts.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.outside.experts, P2: "trust and verify; red flags such as 'almost done'
// with no demo", about 90 s). Storyboard drift: nine scenes (the kit's
// maximum) and five minutes, because a lesson with a film no longer shows its
// worked example, so the film carries the whole teach text and the worked
// example of both lessons: trust but verify, then results not methods and the
// four-eyes principle (s1, two cards), risk-based checking and the spot check
// (s2), asking without offending (s3), the robot cell's forty items (s4); red
// flags, then always almost done (s5, two cards), vague answers and the
// watermelon (s6), no demo (s7), questions not accusations (s8) and the label
// printing module (s9). The other two lessons of the topic
// (pm.outside.disagree, "Als experts het oneens zijn", and pm.outside.time,
// "Hun tijd en motivatie") are not in the row's description and are not
// served here: the narration would pass the 760-word cap. Built to be
// rendered to video: all stage text is 22 units (films/_kit/build-film.mjs;
// pm.portfolio.benefits is the reference).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here),
// the same room as pm.outside.questions: a meeting room with a whiteboard (it
// repeats the panel in miniature), a wall clock and a calendar strip of twelve
// week cells on the side wall (the weeks the percentage hangs, the three weeks
// of "almost done", the moved demo and the fixed demo day), a table with a
// sheet (the drawings with three picked, the supplier's checklist, then the
// list of open issues), and the recurring cast: "jij" the consultant in petrol
// at the front of the table, the team lead at the left end (the supplier's
// expert), the planner with a tablet behind the table (the client's safety
// engineer, the second pair of eyes), and the sponsor at the right end (the
// client, told it is amber). A panel at the right, in stage space, carries
// one card per scene (two in s1 and s5), labelled "schema" (a general
// picture) or "voorbeeld" (the worked examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below; the forty items of the robot
// cell are one group, grid), and so are the people, the calendar strip and the
// sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries
// it, on screen at least 4 s):
//   trust teach 1: trust but verify, an old Russian proverb that Ronald Reagan
//     made famous in arms talks in the 1980s (s1 b1; Reagan in the English
//     voice and on the card and caption, the Dutch voice says "in de jaren
//     tachtig beroemd geworden bij wapenonderhandelingen" without the name:
//     see the narration note); the working rule with experts: trust their
//     skill and intent, check the results that matter (s1 b2); verifying is
//     not distrust, experts check each other all the time: code reviews, test
//     reports (s1 b3), a second engineer signing a drawing (s1 b3, card); you
//     ask for the same (s1 b3)
//   trust teach 2: check results, not methods; you can't judge how a cable was
//     sized, but you can ask who checked the calculation and where it is
//     signed (s1 b4); you can't read code, but you can watch the test (s1 b5);
//     the four-eyes principle, every important piece of work checked by a
//     second qualified person (s1 b6); your job is to make sure the second pair
//     of eyes exists, not to be it (s1 b7)
//   trust teach 3: risk-based checking, check harder where a mistake would
//     hurt most (s2 b1); safety, money and anything you can't undo get a full
//     check (s2 b2); routine items get a spot check, a small random sample
//     instead of everything, three of the forty drawings (s2 b3, the sheet);
//     two failures: checking nothing, and checking everything so experts feel
//     watched and slow down (s2 b4)
//   trust teach 4: about the process, not the person, said upfront (s3 b1);
//     "on every project I ask to see the test results for the safety items;
//     it's not about you" (s3 b2); agreed at the start it is routine,
//     introduced after a problem it feels like suspicion; the typical failure,
//     verifying only once you distrust someone, too late (s3 b3)
//   trust teach 5: experts push back, no time for paperwork; often right that
//     some checks are ritual; ask which checks catch problems and keep those
//     (s3 b4); "if this were wrong, how would we find out, and how soon?", "at
//     go-live" means you need a check before then (s3 b5)
//   trust example: a robot cell, forty items on the supplier's checklist, none
//     you can judge (s4 b1, the grid and the sheet); step 1, sort by risk with
//     the client's safety engineer: five safety, three contract performance
//     (speed, uptime), thirty-two routine (s4 b2, the grid sorted); the safety
//     items: emergency stops, the light curtain, a beam that stops the robot
//     when someone reaches in, fence interlocks that stop it when a gate opens
//     (s4 b3); step 2, safety and performance a full check, you watch the
//     test, the safety engineer signs; step 3, three routine items at random,
//     ask to see them (s4 b4, ticks and rings on the grid); step 4, agreed with
//     the supplier at the start, "this is how I check, on every project"; full
//     grip on the eight that matter, a light touch on the rest (s4 b5)
//   redflags teach 1: a red flag, a warning sign that something is wrong
//     before it shows in the plan (s5 b1); outside your field you can't see the
//     technical problem, but its signals in how people talk and report (s5
//     b2); three cover a lot: always almost done, vague answers, no demo (s5 b3)
//   redflags teach 2: the ninety-ninety rule, credited to Tom Cargill of Bell
//     Labs, popularised by Jon Bentley in 1985 (s5 b4; the names in the English
//     voice, on the card and in the caption, the Dutch voice says "toegeschreven aan een
//     programmeur van Bell Labs, in 1985 bekend gemaakt"); the first 90 percent
//     of the code takes the first 90 percent of the time, the remaining 10
//     percent the other 90 (s5 b5, the bars); the percentage barely moving for
//     weeks: ask what is left, item by item, and which is hardest (s5 b6, the
//     calendar)
//   redflags teach 3: vague answers, "we're working on it", "it should be
//     fine" (card), "some minor issues"; one is normal, a pattern a signal (s6
//     b1); ask for specifics, which issues and the next step on each; in
//     control answers in a sentence, not in control gets vaguer (s6 b2);
//     watermelon status, green outside, red inside: reported fine while the
//     team knows it isn't (s6 b3)
//   redflags teach 4: a demo, the thing working live, not slides about it (s7
//     b1); months of building and nothing working to show: the strongest of the
//     three (s7 b2); other signals: one person who knows everything and won't
//     share, a supplier who keeps changing contact persons, tests that keep
//     being postponed, bad news always the day before a deadline (s7 b3)
//   redflags teach 5: one flag is a reason to ask, not proof; experts are often
//     honestly optimistic (s8 b1), some problems genuinely almost solved (s8
//     b1, card); questions and evidence, not accusations (s8 b2); look at
//     yourself: bad news late, maybe people don't feel safe bringing it (s8
//     b3); "what are you worried about that you haven't told me yet?" (s8 b4)
//   redflags example (faded): an MES project, month 4; three weeks in a row
//     the label printing module "almost done, a few small issues"; status green
//     (s9 b1, the calendar); last Friday's demo moved, the test environment
//     was down; the developer who built it moved to another client of the
//     supplier (s9 b2; "of the supplier" on the card); at least four flags: almost done for
//     weeks, vague small issues, a postponed demo, the key person leaving; the
//     green status may be a watermelon (s9 b3); this week: the open issues as a
//     list, an owner and a date each; the demo on a fixed day, on any
//     environment that works, even a laptop (s9 b4, the sheet and the
//     calendar); who owns the module now and how the handover went; tell the
//     sponsor amber until the demo, with the reasons (s9 b5)
//
// Facts as in the lessons, checked against the sources: "doveryai, no
// proveryai" is a Russian proverb; Reagan, taught it by Suzanne Massie, used
// it in the nuclear arms talks with Gorbachev, most famously at the signing of
// the INF Treaty in December 1987. The ninety-ninety rule is credited to Tom
// Cargill of Bell Labs and was made widely known by Jon Bentley's "Programming
// Pearls" column ("Bumper-Sticker Computer Science", Communications of the
// ACM, September 1985). The four-eyes principle, risk-based checking, the
// watermelon status and the other red flags are credited to no one, as in the
// lessons.
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
const TR = 'pm.outside.trust';
const RF = 'pm.outside.redflags';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const says = (id, list, lang = 'nl') => {
  const l = lessons[lang].get(id);
  const t = [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n');
  for (const s of list) assert(t.includes(s), `${id} ${lang} no longer says "${s}"`);
};
says(TR, ['Vertrouwen maar controleren (trust but verify), een oud Russisch spreekwoord dat Ronald Reagan in de jaren tachtig beroemd maakte bij wapenonderhandelingen, is de werkregel met experts',
  'Je vertrouwt hun vakmanschap en bedoelingen; je controleert de resultaten die echt tellen', 'Controleren is geen wantrouwen',
  'Experts controleren elkaar voortdurend: codereviews, testrapporten, een tweede engineer die een tekening tekent. Jij vraagt hetzelfde',
  'Controleer resultaten, geen methodes', 'Je kunt niet beoordelen hoe een kabel is berekend', '“Wie heeft de berekening gecontroleerd, en waar is die getekend?”',
  'Je kunt geen code lezen, maar je kunt bij de test kijken', 'Het vier-ogenprincipe betekent dat elk belangrijk stuk werk door een tweede bevoegde persoon wordt gecontroleerd',
  'Jouw taak is zorgen dat dat tweede paar ogen er is, niet het zelf zijn', 'Risicogestuurd controleren: controleer harder waar een fout het meest pijn doet',
  'Veiligheid, geld en alles wat je niet terug kunt draaien krijgen een volledige controle', 'Routinezaken krijgen een steekproef (spot check): een controle van een klein willekeurig deel in plaats van alles, zoals drie van de veertig tekeningen',
  'niks controleren, en alles controleren zodat experts zich bekeken voelen en trager gaan werken',
  'maak het over het proces, niet over de persoon, en zeg het vooraf', '“In elk project vraag ik om de testresultaten van de veiligheidspunten. Het gaat niet om jou.”',
  'Vooraf afgesproken is het routine. Na een probleem ingevoerd voelt het als verdenking', 'pas controleren als je iemand al wantrouwt. Dan komt de controle te laat',
  '“Daar hebben we geen tijd voor, al dat papierwerk.”', 'Vaak hebben ze gelijk dat sommige controles alleen ritueel zijn', 'Vraag welke controles volgens hen echt problemen vangen, en houd die',
  '“Als dit fout was, hoe zouden we daarachter komen, en hoe snel?” Is het antwoord “bij livegang”, dan heb je daarvoor een controle nodig',
  'Robotcelproject. Veertig punten op de checklist van de leverancier. Geen ervan kun je zelf beoordelen', 'sorteer op risico met de veiligheidskundige van de klant',
  'Vijf punten zijn veiligheid (noodstoppen; het lichtscherm, een lichtstraal die de robot stopt als iemand erin grijpt; hekvergrendelingen die hem stoppen als een deur opengaat), drie zijn contractprestaties (snelheid, beschikbaarheid), tweeëndertig zijn routine',
  'veiligheid en prestaties krijgen een volledige controle: jij kijkt bij de test, en de veiligheidskundige tekent', 'routine krijgt een steekproef: je kiest er willekeurig drie en vraagt ze te zien',
  'je spreekt dit bij de start af met de leverancier: “Zo controleer ik, in elk project.”', 'volledige grip op de acht punten die echt tellen, een lichte hand op de rest']);
says(RF, ['Een rode vlag (red flag) is een waarschuwingsteken dat er iets mis is voordat het in de planning zichtbaar wordt',
  'Buiten je vak zie je het technische probleem niet, maar je ziet de signalen ervan wel in hoe mensen praten en rapporteren',
  'Drie rode vlaggen dekken veel: altijd “bijna klaar”, vage antwoorden, en geen demo',
  'De negentig-negentigregel, toegeschreven aan Tom Cargill van Bell Labs en in 1985 bekend gemaakt door Jon Bentley',
  'de eerste 90 procent van de code kost de eerste 90 procent van de ontwikkeltijd; de resterende 10 procent kost de andere 90 procent',
  'Als het percentage wekenlang nauwelijks beweegt, vraag dan wat er nog over is, punt voor punt, en welk punt het moeilijkst is',
  '“We zijn ermee bezig.” “Het zou goed moeten komen.” “Wat kleine issues.” Eén vaag antwoord is normaal; een patroon is een signaal',
  '“Welke issues, en wat is de volgende stap bij elk?” Wie het in de hand heeft, antwoordt in één zin; wie dat niet heeft, wordt vager',
  'Watermeloenstatus is een status die van buiten groen is en van binnen rood: gemeld als prima, terwijl het team weet dat het niet zo is',
  'Een demo is het ding live laten werken, geen slides erover', 'Als een team dat al maanden bouwt niets werkends kan laten zien, is dat de sterkste rode vlag van de drie',
  'één persoon die alles weet en niks deelt, een leverancier die steeds van contactpersoon wisselt, testen die steeds worden uitgesteld, en slecht nieuws dat altijd de dag voor een deadline komt',
  'één vlag is een reden om te vragen, geen bewijs van problemen', 'Experts zijn vaak eerlijk optimistisch, en sommige problemen zijn echt bijna opgelost',
  'Reageer met vragen en bewijs, niet met beschuldigingen', 'als slecht nieuws je laat bereikt, voelen mensen zich misschien niet veilig om het te brengen',
  '“Waar maak je je zorgen over dat je me nog niet verteld hebt?”',
  'MES-project, maand 4', 'Drie weken achter elkaar meldt de leverancier de module voor labelprinten als “bijna klaar, wat kleine issues”', 'De status is groen',
  'De demo van afgelopen vrijdag is verschoven “omdat de testomgeving plat lag”', 'De developer die het bouwde, is net naar een andere klant van de leverancier gegaan',
  'Minstens vier: wekenlang bijna klaar, vage “kleine issues”, een uitgestelde demo, en de sleutelpersoon die vertrekt. De groene status is misschien een watermeloen',
  'vraag de open issues als lijst met bij elk een eigenaar en datum', 'Vraag de demo op een vaste dag, op elke omgeving die werkt, desnoods een laptop',
  'Vraag wie nu eigenaar is van de module en hoe de overdracht ging', 'Vertel de sponsor dat het oranje is tot de demo, met de redenen']);
says(TR, ['an old Russian proverb that Ronald Reagan made famous in arms talks in the 1980s', 'such as three of the forty drawings', 'Five items are safety', 'three are contract performance (speed, uptime), thirty-two are routine', 'full grip on the eight items that matter'], 'en');
says(RF, ['credited to Tom Cargill of Bell Labs and popularised by Jon Bentley in 1985', 'MES project, month 4', 'Three weeks in a row', 'amber until the demo'], 'en');
// the numbers the cards draw: forty items, sorted 5 + 3 + 32; eight get a full check, three of the routine a spot check
const CELL = { all: 40, safety: 5, perf: 3, routine: 32, spot: 3 };
assert(CELL.safety + CELL.perf + CELL.routine === CELL.all, '5 + 3 + 32 = 40');
assert(CELL.safety + CELL.perf === 8, 'the eight items that matter are the 5 safety and 3 performance items');
// the ninety-ninety rule: 90 % of the code in 90 % of the time, the last 10 % another 90 %: 180 % in all
const NN = { first: 90, rest: 10 };
assert(NN.first + NN.rest === 100, '90 + 10 percent of the code');
// the label module: three weeks "almost done", then the moved demo; at least four flags
const MES = { month: 4, weeks: 3, flags: 4 };

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
// the cast: who stands where (world cm), as in pm.outside.questions
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
const CUES = ['trust', 'rule', 'peers', 'same',
  'results', 'test', 'four', 'yourjob',
  'risk', 'full', 'spot', 'twoerr',
  'process', 'quote', 'timing', 'push', 'sharp',
  'case', 'grid', 'sort', 'safety', 'check', 'agree',
  'flag', 'signals', 'three',
  'rule90', 'bars', 'hang',
  'vague', 'detail', 'melon',
  'demo', 'strong', 'others',
  'one', 'evidence', 'mirror', 'worry',
  'case2', 'slip', 'count', 'week', 'owner'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.land.handover and pm.outside.questions): the same points, fewer bytes;
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
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.1] },
  { from: toward(HEAD.jij, 1.02), to: toward(mid(HEAD.teamlead, HEAD.jij), 1.1) },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.14] },
  { from: [160, 205, 1], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: toward(HEAD.teamlead, 1.04), to: toward(mid(HEAD.teamlead, HEAD.jij), 1.1) },
  { from: [160, 205, 1.02], to: toward(HEAD.teamlead, 1.08) },
  { from: toward(HEAD.jij, 1.04), to: toward(HEAD.jij, 1.1) },
  { from: [160, 205, 1], to: toward(HEAD.sponsor, 1.08) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, WEEKS, CELL, NN, MES };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.outside.experts',
  title: { nl: 'Werken met experts', en: 'Working with experts' },
  lessons: [TR, RF],
  strictFocus: true,
  scenes: [
    sc('s1', TR, 1, { nl: 'Vertrouwen maar controleren', en: 'Trust but verify' }, [
      { nl: '{t:Vertrouwen maar controleren}: een oud Russisch spreekwoord, door Reagan beroemd gemaakt.', en: '{t:Trust but verify}: an old Russian proverb, made famous by Reagan.', cue: { 'Vertrouwen maar controleren': 'trust' }, focus: 'trust' },
      { nl: 'De werkregel met experts: vertrouw hun vakmanschap, controleer de resultaten die tellen.', en: 'The working rule with experts: trust their skill, check the results that matter.', focus: ['rule', 'teamlead'] },
      { nl: 'Controleren is geen wantrouwen: experts controleren elkaar ook. Jij vraagt hetzelfde.', en: 'Verifying is not distrust: experts check each other too. You ask for the same.', focus: ['peers', 'same'] },
      { nl: 'Controleer resultaten, geen methodes: wie controleerde de berekening, en waar is die getekend?', en: 'Check results, not methods: who checked the calculation, and where is it signed?', focus: 'results' },
      { nl: 'Code lezen kun je niet; bij de test kijken wel.', en: 'You can’t read code; you can watch the test.', focus: ['test', 'jij'] },
      { nl: 'Het {t:Vier-ogenprincipe|vier-ogenprincipe}: belangrijk werk controleert een tweede bevoegde persoon.', en: 'The {t:Four-eyes principle|four-eyes principle}: a second qualified person checks important work.', cue: { 'Vier-ogenprincipe': 'four' }, focus: ['four', 'planner'] },
      { nl: 'Jouw taak: zorgen dat dat tweede paar ogen er is, niet het zelf zijn.', en: 'Your job: make sure that second pair of eyes exists, not be it.', focus: ['yourjob', 'jij'] },
    ]),
    sc('s2', TR, 1, { nl: 'Controleer waar het pijn doet', en: 'Check where it hurts' }, [
      { nl: '{t:Risicogestuurd controleren}: harder waar een fout het meest pijn doet.', en: '{t:Risk-based checking}: harder where a mistake would hurt most.', cue: { 'Risicogestuurd controleren': 'risk' }, focus: 'risk' },
      { nl: 'Veiligheid, geld en wat je niet terug kunt draaien: een volledige controle.', en: 'Safety, money and what you can’t undo: a full check.', focus: 'full' },
      { nl: 'Routine krijgt een {t:Steekproef|steekproef}: drie van de veertig tekeningen.', en: 'Routine gets a {t:Spot check|spot check}: three of the forty drawings.', cue: { Steekproef: 'spot' }, focus: ['spot', 'sheet'] },
      { nl: 'Twee fouten: niks controleren, of alles, zodat experts trager gaan werken.', en: 'Two failures: checking nothing, or everything, so experts slow down.', focus: 'twoerr' },
    ]),
    sc('s3', TR, 1, { nl: 'Vragen zonder te beledigen', en: 'Asking without offending' }, [
      { nl: 'Maak het over het proces, niet over de persoon, en zeg het vooraf.', en: 'Make it about the process, not the person, and say it upfront.', focus: ['process', 'jij'] },
      { nl: '“In elk project vraag ik om de testresultaten van de veiligheidspunten. Het gaat niet om jou.”', en: '“On every project I ask to see the test results for the safety items. It’s not about you.”', focus: ['quote', 'teamlead'] },
      { nl: 'Vooraf is het routine; na een probleem voelt het als verdenking. Dan komt de controle te laat.', en: 'Upfront it is routine; after a problem it feels like suspicion. Then the check comes too late.', focus: 'timing' },
      { nl: '“Al dat papierwerk.” Soms terecht: vraag welke controles echt problemen vangen, en houd die.', en: '“All that paperwork.” Sometimes fair: ask which checks catch problems, and keep those.', focus: ['push', 'teamlead'] },
      { nl: 'Als dit fout was, hoe en hoe snel komen we erachter? Bij livegang? Dan een controle vooraf.', en: 'If this were wrong, how and how soon would we find out? At go-live? Then a check before.', focus: 'sharp' },
    ]),
    sc('s4', TR, 1, { nl: 'Een robotcel, veertig punten', en: 'A robot cell, forty items' }, [
      { nl: 'Robotcel: veertig punten op de checklist van de leverancier. Geen ervan kun je zelf beoordelen.', en: 'A robot cell: forty items on the supplier’s checklist. You can’t judge any of them.', focus: ['case', 'grid', 'sheet'] },
      { nl: 'Stap 1, met de veiligheidskundige: vijf veiligheid, drie prestaties, tweeëndertig routine.', en: 'Step 1, with the safety engineer: five safety, three performance, thirty-two routine.', focus: ['sort', 'grid', 'planner'] },
      { nl: 'Veiligheid: noodstoppen, het lichtscherm en de hekvergrendelingen.', en: 'Safety: emergency stops, the light curtain and the fence interlocks.', focus: 'safety' },
      { nl: 'Stap 2: de acht volledig, bij de test, de veiligheidskundige tekent. Stap 3: drie routinepunten.', en: 'Step 2: the eight in full, at the test, signed by the safety engineer. Step 3: three routine items.', focus: ['check', 'grid'] },
      { nl: 'Stap 4: bij de start afgesproken. Grip op wat telt, een lichte hand op de rest.', en: 'Step 4: agreed at the start. Grip on what matters, a light touch on the rest.', focus: ['agree', 'teamlead'] },
    ]),
    sc('s5', RF, 4, { nl: 'Rode vlaggen, altijd bijna klaar', en: 'Red flags, always almost done' }, [
      { nl: 'Een {t:Rode vlag|rode vlag}: iets is mis, voordat de planning het toont.', en: 'A {t:Red flag|red flag}: something is wrong before the plan shows it.', cue: { 'Rode vlag': 'flag' }, focus: 'flag' },
      { nl: 'Het probleem zie je niet; de signalen wel: hoe mensen praten en rapporteren.', en: 'You can’t see the problem; you can see its signals: how people talk and report.', focus: ['signals', 'teamlead'] },
      { nl: 'Drie dekken veel: altijd bijna klaar, vage antwoorden, geen demo.', en: 'Three cover a lot: always almost done, vague answers, no demo.', focus: 'three' },
      { nl: 'De {t:Negentig-negentigregel|negentig-negentigregel}: Tom Cargill, Bell Labs; bekend via Jon Bentley, 1985.', en: 'The {t:Ninety-ninety rule|ninety-ninety rule}: Tom Cargill, Bell Labs; popularised by Jon Bentley, 1985.', cue: { 'Negentig-negentigregel': 'rule90' }, focus: 'rule90' },
      { nl: 'Eerste {n:90}% van de code: {n:90}% van de tijd. Laatste {n:10}%: nog eens {n:90}%.', en: 'First {n:90}% of the code: {n:90}% of the time. Last {n:10}%: another {n:90}%.', focus: 'bars' },
      { nl: 'Percentage wekenlang gelijk? Vraag wat er over is, punt voor punt, en wat het moeilijkst is.', en: 'Percentage stuck for weeks? Ask what is left, item by item, and which is hardest.', focus: ['hang', 'calendar'] },
    ]),
    sc('s6', RF, 4, { nl: 'Vage antwoorden', en: 'Vague answers' }, [
      { nl: '“We zijn ermee bezig.” “Wat kleine issues.” Eén keer is normaal; een patroon is een signaal.', en: '“We’re working on it.” “Some minor issues.” Once is normal; a pattern is a signal.', focus: ['vague', 'teamlead'] },
      { nl: 'Vraag: welke issues, en wat is bij elk de volgende stap? Wie het in de hand heeft: één zin.', en: 'Ask: which issues, and what is the next step on each? In control: one sentence.', focus: ['detail', 'jij'] },
      { nl: '{t:Watermeloenstatus}: van buiten groen, van binnen rood.', en: '{t:Watermelon status}: green outside, red inside.', cue: { Watermeloenstatus: 'melon' }, focus: 'melon' },
    ]),
    sc('s7', RF, 4, { nl: 'Geen demo', en: 'No demo' }, [
      { nl: 'Een {t:Demo|demo}: het ding live laten werken, geen slides erover.', en: 'A {t:Demo|demo}: the thing working, live, not slides about it.', cue: { Demo: 'demo' }, focus: 'demo' },
      { nl: 'Maanden gebouwd en niets werkends te zien: de sterkste vlag van de drie.', en: 'Months of building and nothing working to show: the strongest flag of the three.', focus: ['strong', 'teamlead'] },
      { nl: 'Ook: één persoon weet alles, wisselend contact, uitgestelde testen, slecht nieuws vlak voor een deadline.', en: 'Also: one person knows it all, changing contacts, postponed tests, bad news just before a deadline.', focus: 'others' },
    ]),
    sc('s8', RF, 4, { nl: 'Vragen, geen verwijten', en: 'Questions, not accusations' }, [
      { nl: 'Eén vlag is een reden om te vragen, geen bewijs. Experts zijn vaak eerlijk optimistisch.', en: 'One flag is a reason to ask, not proof. Experts are often honestly optimistic.', focus: 'one' },
      { nl: 'Reageer met vragen en bewijs, niet met beschuldigingen.', en: 'Respond with questions and evidence, not accusations.', focus: ['evidence', 'jij'] },
      { nl: 'Slecht nieuws laat? Misschien voelt brengen niet veilig.', en: 'Bad news late? Maybe bringing it feels unsafe.', focus: 'mirror' },
      { nl: '“Waar maak je je zorgen over dat je me nog niet verteld hebt?”', en: '“What are you worried about that you haven’t told me yet?”', focus: ['worry', 'teamlead'] },
    ]),
    sc('s9', RF, 4, { nl: 'Een module voor labelprinten', en: 'A label printing module' }, [
      { nl: 'MES-project, maand {n:4}. Drie weken achter elkaar: bijna klaar, wat kleine issues. Status groen.', en: 'MES project, month {n:4}. Three weeks in a row: almost done, a few small issues. Status green.', focus: ['case2', 'calendar'] },
      { nl: 'De demo van vrijdag verschoven: de testomgeving lag plat. De developer zit nu bij een andere klant.', en: 'Friday’s demo moved: the test environment was down. The developer is now with another client.', focus: ['slip', 'teamlead'] },
      { nl: 'Minstens {n:4} rode vlaggen. De groene status is misschien een watermeloen.', en: 'At least {n:4} red flags. The green status may be a watermelon.', focus: 'count' },
      { nl: 'Deze week: open issues als lijst, met eigenaar en datum. De demo op een vaste dag, desnoods op een laptop.', en: 'This week: the open issues as a list, with owner and date. The demo on a fixed day, even on a laptop.', focus: ['week', 'sheet', 'calendar'] },
      { nl: 'Wie is nu eigenaar, hoe ging de overdracht? En de sponsor hoort: oranje tot de demo.', en: 'Who owns it now, how was the handover? And the sponsor hears: amber until the demo.', focus: ['owner', 'sponsor'] },
    ]),
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the cards it carries every
// point of the checklist above. No symbols the voice would read aloud: numbers
// stay plain, percent is said as a word, no quotes or parentheses.
// Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). New SAY rules in films/_kit/timeline.mjs for this
// film (no other film's spoken text changes): codereviews as Dutch makers say
// it (kood-rievjoes: espeak-ng reads "koo-di-re-views"), risicogestuurd and
// sleutelpersoon split at the head (it reads "risico-GE-stuurd" and
// "sleu-TEL-persoon" with the e of "bed"), negentig-negentigregel with the
// rule apart (it stresses regEL), routinepunten likewise (it stresses -NEE-),
// issues as "isjoes" (it reads "i-su-es"; the pre-mortem's issue rule, already shared), vage as "vaage" (it reads a French
// g, "vaazje"), and "eerlijk optimistisch" with the stress on -MIS- (it
// stresses OP-). Kept out
// of the Dutch narration (they stay in the captions and on the cards): Reagan,
// Cargill and Bentley (espeak-ng has no hard g, the g of every spelling is the
// g of "lachen", and it reads Bentley as "ben-TLEE-i"; the voice says "in de
// jaren tachtig bij wapenonderhandelingen" and "een programmeur van Bell
// Labs", the card names them; the English voice says the names), engineer
// ("eng-i-neer": on the card only), slides (said "dia's"), developer ("DEE-
// ve-loo-per": said "ontwikkelaar"), deadline ("dee-ad-LIE-ne": said "vlak voor
// de opleverdatum") and checklist (stressed on -LIST: said "de lijst van de
// leverancier"; other films say checklist and keep their voice), and
// kabelberekening ("kaabel-bierekening": said "hoe een kabel is berekend", the
// lesson's words). hetzelfde (HET-zelfde) and oranje (OO-ranje) keep the voice
// the other films give them. Shared rules already cover MES (letters) and
// livegang. The guard below runs on the text
// after the SAY rules, so a word a rule rewrites passes and a misread one
// fails the build.
const SAY = [
  [ // s1 trust but verify
    { nl: '{t:Vertrouwen maar controleren} is een oud Russisch spreekwoord, in de jaren tachtig beroemd geworden bij wapenonderhandelingen.',
      en: '{t:Trust but verify} is an old Russian proverb, made famous by Reagan in arms talks in the eighties.' },
    { nl: 'Het is de werkregel met experts: vertrouw hun vakmanschap en bedoelingen, controleer de resultaten die echt tellen.',
      en: 'It is the working rule with experts: trust their skill and intent, check the results that matter.' },
    { nl: 'Controleren is geen wantrouwen: experts controleren elkaar voortdurend, met codereviews en testrapporten. Jij vraagt hetzelfde.',
      en: 'Verifying is not distrust: experts check each other constantly, with code reviews and test reports. You ask the same.' },
    // results, not methods
    { nl: 'Controleer resultaten, geen methodes. Hoe een kabel is berekend, kun je niet beoordelen, wel vragen: wie controleerde het, en waar is dat getekend?',
      en: 'Check results, not methods. You can\'t judge a cable sizing, but you can ask who checked it, and where it is signed.' },
    { nl: 'Code lezen kun je niet, maar bij de test kijken wel.',
      en: 'You can\'t read code, but you can watch the test.' },
    { nl: 'Het {t:Vier-ogenprincipe|vier-ogenprincipe}: elk belangrijk stuk werk wordt gecontroleerd door een tweede bevoegde persoon.',
      en: 'The {t:Four-eyes principle|four-eyes principle}: every important piece of work is checked by a second qualified person.' },
    { nl: 'Jouw taak: zorgen dat dat tweede paar ogen er is, niet het zelf zijn.',
      en: 'Your job: make sure the second pair of eyes exists, not be it.' },
  ],
  [ // s3 risk-based checking
    { nl: '{t:Risicogestuurd controleren}: controleer harder waar een fout het meest pijn doet.',
      en: '{t:Risk-based checking}: check harder where a mistake would hurt most.' },
    { nl: 'Veiligheid, geld en alles wat je niet terug kunt draaien: een volledige controle.',
      en: 'Safety, money and anything you can\'t undo: a full check.' },
    { nl: 'Routine krijgt een {t:Steekproef|steekproef}: een klein willekeurig deel, zoals drie van de veertig tekeningen.',
      en: 'Routine gets a {t:Spot check|spot check}: a small random sample, such as three of the forty drawings.' },
    { nl: 'Twee fouten: niks controleren, en alles, zodat experts zich bekeken voelen en trager werken.',
      en: 'Avoid two failures: checking nothing, and everything, so experts feel watched and slow down.' },
  ],
  [ // s4 asking without offending
    { nl: 'Vraag zonder te beledigen: over het proces, niet over de persoon, en vooraf gezegd.',
      en: 'Ask without offending: about the process, not the person, and said upfront.' },
    { nl: 'In elk project vraag ik om de testresultaten van de veiligheidspunten. Het gaat niet om jou.',
      en: 'On every project I ask to see the test results for the safety items. It\'s not about you.' },
    { nl: 'Vooraf is het routine; na een probleem voelt het als verdenking. Pas controleren bij wantrouwen is te laat.',
      en: 'Upfront, it is routine; after a problem, it feels like suspicion. Checking only once you distrust is too late.' },
    { nl: 'Experts duwen terug: geen tijd voor al dat papierwerk. Vaak terecht, sommige controles zijn ritueel. Vraag welke echt problemen vangen, en houd die.',
      en: 'Experts push back: no time for paperwork. Often fair, some checks are ritual. Ask which ones catch problems, and keep those.' },
    { nl: 'Scherpe vraag: als dit fout was, hoe en hoe snel komen we erachter? Bij livegang? Dan heb je daarvoor een controle nodig.',
      en: 'Sharp question: if this were wrong, how and how soon would we find out? At go-live? Then check before that.' },
  ],
  [ // s5 the robot cell
    { nl: 'Een robotcel: veertig punten op de lijst van de leverancier, geen ervan kun je zelf beoordelen.',
      en: 'A robot cell: forty items on the supplier\'s checklist, none you can judge yourself.' },
    { nl: 'Stap één, met de veiligheidskundige van de klant: sorteer op risico. Vijf punten veiligheid, drie contractprestaties, zoals snelheid en beschikbaarheid, tweeëndertig routine.',
      en: 'Step one, with the client\'s safety engineer: sort by risk. Five safety, three contract performance, such as speed and uptime, thirty-two routine.' },
    { nl: 'Veiligheid: de noodstoppen, het lichtscherm, dat de robot stopt als iemand erin grijpt, en hekvergrendelingen, die hem stoppen als een deur opengaat.',
      en: 'Safety: emergency stops, the light curtain, a beam that stops the robot if someone reaches in, and fence interlocks that stop it if a gate opens.' },
    { nl: 'Stap twee: veiligheid en prestaties volledig. Jij kijkt bij de test, de veiligheidskundige tekent. Stap drie: drie willekeurige routinepunten bekijken.',
      en: 'Step two: safety and performance in full. You watch the test, the safety engineer signs. Step three: you see three random routine items.' },
    { nl: 'Stap vier: spreek dit vooraf af met de leverancier. Zo controleer ik, in elk project. Grip op de acht die tellen, een lichte hand op de rest.',
      en: 'Step four: agree it with the supplier upfront. This is how I check, on every project. Grip on the eight that matter, a light touch on the rest.' },
  ],
  [ // s6 red flags
    { nl: 'Een {t:Rode vlag|rode vlag} is een waarschuwingsteken: er is iets mis, voordat het in de planning zichtbaar wordt.',
      en: 'A {t:Red flag|red flag} is a warning sign that something is wrong, before it shows in the plan.' },
    { nl: 'Het technische probleem zie je niet, de signalen wel: hoe mensen praten en rapporteren.',
      en: 'You can\'t see the technical problem, only its signals: how people talk and report.' },
    { nl: 'Drie dekken veel: altijd bijna klaar, vage antwoorden, en geen demo.',
      en: 'Three cover a lot: always almost done, vague answers, and no demo.' },
    // always almost done
    { nl: 'De {t:Negentig-negentigregel|negentig-negentigregel}, toegeschreven aan een programmeur van Bell Labs, in 1985 bekend gemaakt:',
      en: 'The {t:Ninety-ninety rule|ninety-ninety rule}, credited to Tom Cargill of Bell Labs, popularised by Jon Bentley in 1985, jokes:' },
    { nl: 'de eerste {n:90} procent van de code kost {n:90} procent van de tijd. De laatste {n:10} procent kost de andere {n:90}.',
      en: 'the first {n:90} percent of the code takes {n:90} percent of the time. The last {n:10} percent takes the other {n:90}.' },
    { nl: 'Beweegt het percentage wekenlang nauwelijks? Vraag wat er over is, punt voor punt, en wat het moeilijkst is.',
      en: 'If the percentage barely moves for weeks, ask what is left, item by item, and which is hardest.' },
  ],
  [ // s8 vague answers
    { nl: 'Vage antwoorden: we zijn ermee bezig, wat kleine issues; één keer is normaal, een patroon is een signaal.',
      en: 'Vague answers: we\'re working on it, some minor issues. One is normal; a pattern is a signal.' },
    { nl: 'Vraag door: welke issues, en wat is bij elk de volgende stap? Wie grip heeft, antwoordt in één zin; anderen worden vager.',
      en: 'Ask which issues, and the next step on each. Someone in control answers in a sentence; others get vaguer.' },
    { nl: 'Een {t:Watermeloenstatus|watermeloenstatus}: van buiten groen, van binnen rood. Gemeld als prima, terwijl het team weet van niet.',
      en: 'A {t:Watermelon status|watermelon status}: green outside, red inside. Reported fine, while the team knows it isn\'t.' },
  ],
  [ // s9 no demo
    { nl: 'Een {t:Demo|demo} is het ding live laten werken, geen dia\'s erover.',
      en: 'A {t:Demo|demo} is showing the thing working, live, not slides about it.' },
    { nl: 'Kan een team na maanden bouwen niets werkends laten zien, dan is dat de sterkste vlag van de drie.',
      en: 'If a team building for months can\'t show anything working, that is the strongest flag of the three.' },
    { nl: 'Andere signalen: één persoon die alles weet en niks deelt, wisselende aanspreekpunten, steeds uitgestelde testen, slecht nieuws vlak voor de opleverdatum.',
      en: 'Other signals: one person who knows it all and won\'t share, changing contacts, tests that keep slipping, bad news the day before a deadline.' },
  ],
  [ // s10 questions, not accusations
    { nl: 'Let op: één vlag is een reden om te vragen, geen bewijs. Experts zijn vaak eerlijk optimistisch.',
      en: 'Careful: one flag is a reason to ask, not proof. Experts are often honestly optimistic.' },
    { nl: 'Reageer met vragen en bewijs, niet met beschuldigingen.',
      en: 'Respond with questions and evidence, not accusations.' },
    { nl: 'En kijk naar jezelf: komt slecht nieuws laat, dan voelt het brengen misschien niet veilig.',
      en: 'And look at yourself: if bad news comes late, maybe people don\'t feel safe bringing it.' },
    { nl: 'Scherpe vraag: waar maak je je zorgen over, dat je me nog niet verteld hebt?',
      en: 'A sharp question: what are you worried about that you haven\'t told me yet?' },
  ],
  [ // s11 the label printing module
    { nl: 'Een MES-project, maand {n:4}. Al drie weken meldt de leverancier de labelmodule bijna klaar, wat kleine issues. Status groen.',
      en: 'An MES project, month {n:4}. For three weeks the supplier reports the label module almost done, a few small issues. Status green.' },
    { nl: 'De demo van vrijdag is verschoven: de testomgeving lag plat. En de ontwikkelaar die het bouwde, zit nu bij een andere klant.',
      en: 'Last Friday\'s demo moved: the test environment was down. And the developer who built it just left for another client.' },
    { nl: 'Minstens {n:4} rode vlaggen: wekenlang bijna klaar, vage kleine issues, een uitgestelde demo, en de sleutelpersoon die vertrekt. Die groene status is misschien een watermeloen.',
      en: 'At least {n:4} red flags: almost done for weeks, vague small issues, a postponed demo, the key person leaving. That green status may be a watermelon.' },
    { nl: 'Deze week: de open issues als lijst, elk met eigenaar en datum. De demo op een vaste dag, op elke omgeving die werkt, desnoods een laptop.',
      en: 'This week: the open issues as a list, with owner and date. The demo on a fixed day, on any environment that works, even a laptop.' },
    { nl: 'Vraag wie nu eigenaar is en hoe de overdracht ging. En vertel de sponsor: oranje tot de demo, met de redenen.',
      en: 'Ask who owns the module now and how the handover went. Tell the sponsor: amber until the demo, with the reasons.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above); checked on the text
// after the SAY rules, so a rewritten word (codereviews, issues) passes
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{t:([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(Reagan|Cargill|Bentley|engineer|slides|developer|deadline|checklist|codereviews|issues|risicogestuurd\w*|sleutelpersoon|negentig-negentigregel)\b/i;
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
.pm-flag{fill:#C9503C;stroke:none}
.pm-green{fill:#4E9A5B;stroke:none}
.pm-amber{fill:#D9922E;stroke:none}
.pm-pole{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-big,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-sq{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-strike,.pm-mini .pm-pole{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken, waarop de weken verschijnen waarin het percentage blijft hangen, drie weken bijna klaar, de verschoven demo en een vaste demodag. Jij, de adviseur in petrol, staat aan de voorkant van de tafel. De teamleider aan het linkereind is de expert van de leverancier, de planner met een tablet achter de tafel de veiligheidskundige van de klant, de sponsor in pak aan het rechtereind de klant. Op tafel een vel: de checklist van de leverancier, later de lijst open issues. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: vertrouwen maar controleren; resultaten in plaats van methodes en het vier-ogenprincipe; risicogestuurd controleren en de steekproef; vragen zonder te beledigen; een robotcel met veertig punten, gesorteerd in 5 veiligheid, 3 prestaties en 32 routine; rode vlaggen; altijd bijna klaar en de negentig-negentigregel; vage antwoorden en de watermeloenstatus; geen demo en andere signalen; vragen in plaats van verwijten; en een module voor labelprinten met minstens vier rode vlaggen.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks, where the weeks the percentage hangs, three weeks of almost done, the moved demo and a fixed demo day appear. You, the consultant in petrol, stand at the front of the table. The team lead at the left end is the supplier’s expert, the planner with a tablet behind the table the client’s safety engineer, the sponsor in a suit at the right end the client. On the table a sheet: the supplier’s checklist, later the list of open issues. At the right a panel with one card per scene, marked as example or diagram: trust but verify; results instead of methods and the four-eyes principle; risk-based checking and the spot check; asking without offending; a robot cell with forty items, sorted into 5 safety, 3 performance and 32 routine; red flags; always almost done and the ninety-ninety rule; vague answers and the watermelon status; no demo and other signals; questions instead of accusations; and a label printing module with at least four red flags.',
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

// Dev tool, not shipped. Builds the explainer film "Voortgang zien zonder
// vakkennis / Seeing progress without the expertise" for the Projects course
// module "Projecten leiden buiten je vakgebied" (pm.outside), topic Sturen en
// besluiten: pm.outside.progress (level 1, "Voortgang meten zonder
// vakkennis") and pm.outside.decide (level 2, "Besluiten onder onzekerheid, en
// escaleren").
//
//   node films/pm.outside.steering/build.mjs            build the page
//   node films/pm.outside.steering/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.outside.steering.html: one offline page
// with the anatomy kit, the stage script and the player inlined. The film will
// be rendered to video, so all stage and card text is 22 font-size units (the
// kit default for video films, films/_kit/build-film.mjs; pm.portfolio.benefits
// is the reference).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.outside.steering, P2: "milestones with evidence, a demo, the definition
// of done; an escalation", about 100 s). Storyboard drift: nine scenes and
// about five minutes, because a lesson with a film no longer shows its worked
// example, so the film carries the whole teach text and the worked example of
// both lessons: milestones (s1), percent complete against evidence (s2),
// acceptance criteria and the definition of done (s3), FAT, SAT and demos
// (s4), the MES supplier's 70% (s5); one-way and two-way doors (s6),
// escalation (s7), the decision memo, the announcement and the failures (s8)
// and the switchgear order (s9). The topic's other two lessons
// (pm.outside.stakeholders, "Communiceren met stakeholders", and
// pm.outside.learnfast, "Snel een nieuw vak leren") are not in the row's
// description and are not served here: the narration would pass the 760-word
// cap and the 300 s limit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here),
// set up as in pm.outside.questions: a meeting room with a whiteboard (it
// repeats the panel in miniature), a wall clock and a calendar strip of twelve
// week cells on the side wall (milestones as diamonds, a demo every two weeks,
// milestones three weeks apart, the third milestone due in two weeks, the four
// weeks until the load figures), a table with a sheet (the signed test report,
// the six milestones ticked by their evidence, the decision memo), and the
// recurring cast: "jij" the consultant in petrol at the front of the table, the
// team lead at the left end (the expert: the supplier, the grid engineer), the
// planner with a tablet behind the table (the user; the factory in s9), and the
// sponsor at the right end. A panel at the right, in stage space, carries one
// card per scene, labelled "schema" (a general picture) or "voorbeeld" (the
// worked examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// calendar strip and the sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries
// it, on screen at least 4 s):
//   progress teach 1: outside your field you can't look at the work and judge
//     how far it is (s1 b1); measure by what is done or not done, with evidence
//     you can see (s1 b2); a milestone, a point where a clear result has to
//     exist (s1 b3); "interface tested with real orders", "switchgear
//     energised" (s1 b4); yes or no, not a percentage (s1 b5)
//   progress teach 2: percent complete, the share said to be finished, the
//     weakest measure outside your field (s2 b1); an opinion, stalls near 90%
//     (s2 b2); budget spent is about money, not progress (s2 b3); count
//     finished milestones, only once the evidence exists (s2 b4); a signed test
//     report, a demo, an approved drawing (s2 b5, the sheet)
//   progress teach 3: acceptance criteria, conditions to be accepted, written
//     before the work starts (s3 b1); the label in under 3 seconds, all 12
//     fields match the order (s3 b2); agreed with the expert and the user, so
//     done is not argued later (s3 b3); the definition of done, the shared
//     quality standard to count as finished: tested, documented, reviewed (s3
//     b4); from the Scrum Guide, mostly a short checklist, works on any project
//     (s3 b5; the voice says "de gids van Scrum", the card "Scrum Guide")
//   progress teach 4: two formal milestones in automation and electrical
//     projects (s4 b1); FAT at the supplier before shipping (s4 b1); SAT after
//     installation at the client (s4 b2); a FAT passed with open points is
//     common, owners and dates before shipping (s4 b3)
//   progress teach 5: demos the best progress meter, regular, short, real data;
//     one every two weeks shows more than ten status reports (s4 b4, the
//     calendar); the failure, milestones months apart; a rough rule, a
//     checkable result at least every two to four weeks (s4 b5, the calendar);
//     "what can you show me in two weeks?" (s4 b6)
//   progress example: MES project, the supplier reports 70% (s5 b1); step 1 the
//     six milestones: design approved, test environment running, master data
//     loaded, interface tested, operator screens accepted, go-live rehearsal
//     (s5 b2; the middle four on the card); step 2 the evidence for each:
//     signed design, a demo, a data check, a test report, user sign-off, a
//     rehearsal report (s5 b3; the middle four on the card); step 3 only 1 and
//     2 have evidence, 3 "almost done" unchecked (s5 b4, the sheet); step 4
//     report 2 of 6, the third in two weeks; the 70% was effort spent (s5 b5,
//     the calendar)
//   decide teach 1: rarely certainty; decide well with what you have, and know
//     when it isn't your decision (s6 b1); a reversible decision, undone at low
//     cost (s6 b2); Jeff Bezos, shareholder letter for 2015 (published 2016):
//     irreversible ones are one-way doors, you can't come back; reversible ones
//     two-way doors (s6 b3; the card: "brief over 2015, april 2016", as in
//     pm.stuck.diagnose)
//   decide teach 2: two-way doors, decide fairly fast and learn; letter for
//     2016: about 70% of the information you'd like, wait for 90% and you're
//     usually too slow; a rule of thumb, not a law (s6 b4; on the card); one-way doors:
//     ordering switchgear with a long lead time, the time from order to
//     delivery, or shutting down the old system (s6 b5); slow down: more
//     evidence, a second opinion, the sponsor deciding (s6 b6; the voice says
//     "een tweede mening", the card "second opinion")
//   decide teach 3: escalation, taking a decision or problem to someone with
//     more authority because it is beyond yours (s7 b1); not failure, the
//     system working (s7 b2); when: outside your mandate, experts stuck, goal,
//     budget or date at risk (s7 b3); early, with options, not just a problem:
//     two options, what each costs, my recommendation (s7 b4)
//   decide teach 4: a decision memo, one page: question, options, criteria,
//     expert advice, your recommendation, deadline (s8 b1, the sheet); it
//     forces translating the technical part into consequences (s8 b2); state
//     the decision clearly, without apology; Pfeffer's 7 Rules of Power: show
//     up in powerful fashion (s8 b3; the book's title and the English rule on
//     the card); calmly and firmly, not undercut with "sorry, maybe" (s8 b4)
//   decide teach 5: failures: escalating too late, when no options are left;
//     without a recommendation, so the sponsor does your thinking; reopening
//     decisions every week (s8 b5); the sharp question: can't undo it, who
//     decides and by when; can, what does another week of waiting cost (s8 b6)
//   decide example: grid project, switchgear lead time 26 weeks, the final load
//     figures in 4 weeks, waiting slips energising about a month (s9 b1, the
//     calendar); step 1 ordering is a one-way door, cancelling costs a lot (s9
//     b2); step 2 the grid engineer: only if the load rises more than 30% (s9
//     b3); step 3 the factory: very unlikely (s9 b4); step 4 the memo: order now
//     on the current sizing, risk named, or wait 4 weeks and slip a month;
//     recommendation, order now (s9 b5, the sheet); step 5 the sponsor
//     decides, you record and announce it plainly (s9 b6)
//
// Facts as in the lessons, checked against the sources: Jeff Bezos, Amazon's
// letter to shareholders for 2015 (dated April 2016): "Type 1" decisions are
// "one-way doors", "Type 2" decisions "two-way doors"; the letter for 2016
// (April 2017): "most decisions should probably be made with somewhere around
// 70% of the information you wish you had. If you wait for 90%, in most cases,
// you're probably being slow." The Scrum Guide (Schwaber and Sutherland, 2020)
// defines the Definition of Done as the formal description of the state of the
// Increment when it meets the quality measures required for the product; the
// short checklist is the lesson's word, not the Guide's, and is not credited to
// it. Jeffrey Pfeffer, 7 Rules of Power (2022), rule 3: "Show up in powerful
// fashion". FAT and SAT as defined in the lesson (IEC 62381 names both; the
// film credits no standard). The two-to-four-week rule, the 90% stall and the
// decision memo are the lesson's and credited to no one, as in the lesson.
// Escalation is worded as in pm.run.escalation (a problem to someone who can
// decide, early, with options and a recommendation; escalating is the system
// working).
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
const PR = 'pm.outside.progress';
const DE = 'pm.outside.decide';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const says = (id, list, lang = 'nl') => {
  const l = lessons[lang].get(id);
  const t = [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n');
  for (const s of list) assert(t.includes(s), `${id} ${lang} no longer says "${s}"`);
};
says(PR, ['Buiten je vak kun je niet naar het werk kijken en beoordelen hoe ver het is', 'Meet voortgang dus aan dingen die af zijn of niet af, met bewijs dat je kunt zien',
  'Een mijlpaal (milestone) is een punt in het project waarop een duidelijk resultaat er moet zijn', '“koppeling getest met echte orders”, “schakelinstallatie onder spanning”', 'Het is ja of nee, geen percentage',
  'Percentage gereed, het deel van het werk dat af zou zijn, is buiten je vak de zwakste maat', 'het is een mening, en het blijft vaak rond de 90% hangen', 'Uitgegeven budget zegt iets over geld, niet over voortgang',
  'Tel in plaats daarvan afgeronde mijlpalen, en tel een mijlpaal pas als het bewijs er is', 'een getekend testrapport, een demo, een goedgekeurde tekening',
  'Acceptatiecriteria zijn de voorwaarden waaraan een resultaat moet voldoen om geaccepteerd te worden, opgeschreven voordat het werk begint', '“Het label print in minder dan 3 seconden en alle 12 velden kloppen met de order.”',
  'Spreek ze af met expert en gebruiker, dan is “klaar” later geen discussiepunt', 'De definition of done is de gedeelde kwaliteitsnorm waaraan werk moet voldoen om als af te tellen, zoals getest, gedocumenteerd, gereviewd',
  'Hij komt uit de Scrum Guide; de meeste teams houden hem bij als korte checklist, en hij werkt in elk project',
  'In automatiserings- en elektrotechnische projecten zijn twee formele mijlpalen gangbaar', 'De fabrieksacceptatietest (FAT, factory acceptance test) is de test van een machine bij de leverancier, voor verzending',
  'De locatieacceptatietest (SAT, site acceptance test) is de test na installatie bij de klant', 'Een FAT die geslaagd is met een lijst open punten is gewoon; zorg dat die lijst eigenaren en data heeft voordat je verzendt',
  'Demo’s zijn je beste voortgangsmeter: regelmatig, kort, met echte data', 'Een demo om de twee weken laat meer zien dan tien statusrapporten',
  'mijlpalen zo ver uit elkaar dat er maandenlang niks te controleren valt', 'minstens elke twee tot vier weken een controleerbaar resultaat', '“Wat kun je me over twee weken laten zien?”',
  'De leverancier meldt “70% gereed”', 'Jij bouwt het voortgangsbeeld opnieuw op',
  '1 ontwerp goedgekeurd, 2 testomgeving draait, 3 stamgegevens geladen, 4 koppeling getest met echte orders, 5 operatorschermen geaccepteerd, 6 generale repetitie van de livegang geslaagd',
  'getekend ontwerp, een demo, een datacontrole, een testrapport, akkoord van de gebruikers, een verslag van de repetitie', 'tel wat bewijs heeft: alleen 1 en 2. Mijlpaal 3 is “bijna klaar” zonder controle',
  'meld 2 van de 6 met bewijs, de derde over twee weken', 'Die “70%” was bestede inspanning']);
says(DE, ['Buiten je vak heb je zelden zekerheid', 'De kunst is goed beslissen met wat je hebt, en weten wanneer het niet jouw besluit is',
  'is het een omkeerbaar besluit, een besluit dat je goedkoop terug kunt draaien, of niet?', 'Jeff Bezos (aandeelhoudersbrief over 2015, verschenen in 2016) noemde onomkeerbare besluiten eenrichtingsdeuren (one-way doors): eenmaal erdoor kun je niet terug',
  'Omkeerbare zijn tweerichtingsdeuren', 'Bij tweerichtingsdeuren: beslis vrij snel en leer', 'In zijn brief over 2016 stelde hij dat de meeste besluiten genomen kunnen worden met ongeveer 70% van de informatie die je zou willen; wacht je op 90%, dan ben je meestal te laat',
  'Een vuistregel, geen wet', 'zoals een schakelinstallatie met een lange levertijd (de tijd van bestelling tot levering) bestellen of het oude systeem uitzetten, vertraag je: meer bewijs, een second opinion, de sponsor die beslist',
  'Escalatie is een besluit of probleem voorleggen aan iemand met meer bevoegdheid omdat het buiten de jouwe valt', 'Het is geen falen; het is het systeem dat werkt',
  'Escaleer als het buiten je mandaat valt, als experts vastzitten, of als het doel, het budget of de datum in gevaar is', 'Escaleer vroeg, met opties, niet alleen met een probleem: “Hier zijn twee opties, wat elk kost, en mijn advies.”',
  'Een beslisnotitie maakt dit concreet: één A4 met de vraag, de opties, de criteria, het advies van de experts, jouw aanbeveling en de deadline', 'Hij dwingt je het technische deel te vertalen naar gevolgen',
  'Breng het besluit daarna helder en zonder excuus', 'De 7 Rules of Power van Jeffrey Pfeffer gelden hier: kom krachtig over (show up in powerful fashion), zeg het rustig en stevig, en ondergraaf het niet met “sorry, misschien”',
  'te laat escaleren, als er geen opties meer zijn; escaleren zonder advies, zodat de sponsor jouw denkwerk moet doen; en besluiten elke week weer openbreken',
  '“Als we dit niet terug kunnen draaien, wie moet het dan beslissen, en wanneer? Als het wel kan, wat kost het om nog een week te wachten?”',
  'De schakelinstallatie heeft een levertijd van 26 weken', 'De definitieve belastingcijfers van de fabriek zijn pas over 4 weken bekend', 'Wacht je, dan schuift het inschakelen ongeveer een maand op',
  'Stap 1, soort deur: bestellen is een eenrichtingsdeur; annuleren kost veel', 'Netengineer: “Alleen als de belasting meer dan 30% stijgt.”', '“Hoe waarschijnlijk is dat?” “Heel onwaarschijnlijk.”',
  'nu bestellen op de huidige dimensionering, risico benoemd; of 4 weken wachten en een maand schuiven. Advies: nu bestellen', 'de sponsor beslist; jij legt het vast en kondigt het helder aan']);
says(PR, ['under 3 seconds and all 12 fields', 'stall near 90%', 'reports “70% complete”', 'report 2 of 6 with evidence', 'It comes from the Scrum Guide'], 'en');
says(DE, ['a 26-week lead time', 'for 4 more weeks', 'more than 30%', 'around 70% of the information', 'wait for 90%', 'show up in powerful fashion'], 'en');
// the numbers the cards draw
const MES = { claim: 70, n: 6, proven: [1, 2], open: 3, inWeeks: 2 };
assert(MES.proven.length === 2 && MES.proven.length < MES.n && MES.open === MES.proven.length + 1, '2 of 6 proven; milestone 3 is next');
const GRID = { lead: 26, wait: 4, rise: 30 };
assert(GRID.wait < GRID.lead, 'the load figures come long before delivery');
const INFO = { enough: 70, late: 90 };
assert(INFO.enough < INFO.late, '70% is enough, 90% is too late');

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
// explains.
const PX = 322;
const PW = 308;
const CUES = ['judge', 'done', 'mile', 'mileex', 'yesno',
  'pct', 'stuck', 'budget', 'count', 'proof',
  'accept', 'label', 'agree', 'dod', 'scrum',
  'fat', 'sat', 'punch', 'demo', 'gap', 'ask',
  'claim', 'm6', 'ev', 'tally', 'report',
  'skill', 'rev', 'doors', 'seventy', 'lead', 'slow',
  'esc', 'system', 'when', 'opts',
  'memo', 'conseq', 'power', 'sorry', 'fails', 'ask2',
  'case', 'st1', 'st2', 'st3', 'st4', 'st5'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + g('pExtra', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
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
const CALV = [CAL_AT[0] + 40, CAL_AT[1] + 30];
const CAM = [
  { from: toward(HEAD.teamlead, 1.04), to: [CALV[0], CALV[1], 1.1] },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.12] },
  { from: toward(mid(HEAD.teamlead, HEAD.planner), 1.04), to: toward(mid(HEAD.teamlead, HEAD.planner), 1.1) },
  { from: [160, 205, 1], to: [CALV[0], CALV[1], 1.08] },
  { from: toward(HEAD.teamlead, 1.04), to: [SH[0], SH[1], 1.14] },
  { from: [160, 205, 1], to: toward(HEAD.sponsor, 1.08) },
  { from: toward(HEAD.jij, 1.04), to: toward(mid(HEAD.jij, HEAD.sponsor), 1.1) },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.12] },
  { from: [CALV[0], CALV[1], 1.04], to: toward(HEAD.sponsor, 1.08) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, WEEKS, MES, GRID, INFO };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.outside.steering',
  title: { nl: 'Voortgang zien zonder vakkennis', en: 'Seeing progress without the expertise' },
  lessons: [PR, DE],
  strictFocus: true,
  scenes: [
    sc('s1', PR, 1, { nl: 'Wat af is', en: 'What is done' }, [
      { nl: 'Buiten je vak zie je niet aan het werk hoe ver het is.', en: 'Outside your field you can’t judge from the work how far along it is.', focus: ['judge', 'teamlead'] },
      { nl: 'Meet wat af is of niet, met bewijs dat je kunt zien.', en: 'Measure what is done or not, with evidence you can see.', focus: 'done' },
      { nl: 'Een {t:Mijlpaal|mijlpaal}: een punt waarop een duidelijk resultaat er moet zijn.', en: 'A {t:Milestone|milestone}: a point where a clear result has to exist.', cue: { Mijlpaal: 'mile' }, focus: ['mile', 'calendar'] },
      { nl: '“Koppeling getest met echte orders”, “schakelinstallatie onder spanning”.', en: '“Interface tested with real orders”, “switchgear energised”.', focus: 'mileex' },
      { nl: 'Ja of nee, geen percentage.', en: 'Yes or no, not a percentage.', focus: 'yesno' },
    ]),
    sc('s2', PR, 1, { nl: 'Tel wat bewezen is', en: 'Count what is proven' }, [
      { nl: '{t:Percentage gereed|Percentage gereed}: het deel dat af zou zijn. Buiten je vak de zwakste maat.', en: '{t:Percent complete|Percent complete}: the share said to be finished. Weakest measure outside your field.', cue: { 'Percentage gereed': 'pct' }, focus: 'pct' },
      { nl: 'Een mening, en het blijft vaak rond de {n:90}% hangen.', en: 'An opinion, and it tends to stall near {n:90}%.', focus: 'stuck' },
      { nl: 'Uitgegeven budget zegt iets over geld, niet over voortgang.', en: 'Budget spent tells you about money, not progress.', focus: 'budget' },
      { nl: 'Tel afgeronde mijlpalen, pas als het bewijs er is.', en: 'Count finished milestones, only once their evidence exists.', focus: 'count' },
      { nl: 'Een getekend testrapport, een demo, een goedgekeurde tekening.', en: 'A signed test report, a demo, an approved drawing.', focus: ['proof', 'sheet'] },
    ]),
    sc('s3', PR, 1, { nl: 'Wanneer is het af?', en: 'When is it done?' }, [
      { nl: '{t:Acceptatiecriteria|Acceptatiecriteria}: voorwaarden om geaccepteerd te worden, vooraf opgeschreven.', en: '{t:Acceptance criteria|Acceptance criteria}: conditions to be accepted, written before the work starts.', cue: { Acceptatiecriteria: 'accept' }, focus: 'accept' },
      { nl: 'Het label print in minder dan {n:3} seconden en alle {n:12} velden kloppen met de order.', en: 'The label prints in under {n:3} seconds and all {n:12} fields match the order.', focus: 'label' },
      { nl: 'Spreek ze af met expert en gebruiker, dan is “klaar” later geen discussiepunt.', en: 'Agree them with the expert and the user, so “done” isn’t argued about later.', focus: ['agree', 'teamlead', 'planner'] },
      { nl: 'De {t:Definition of done|definition of done}: de gedeelde norm om als af te tellen. Getest, gedocumenteerd, gereviewd.', en: 'The {t:Definition of done|definition of done}: the shared standard to count as finished. Tested, documented, reviewed.', cue: { 'Definition of done': 'dod' }, focus: 'dod' },
      { nl: 'Uit de Scrum Guide; meestal een korte checklist, en hij werkt in elk project.', en: 'From the Scrum Guide; mostly a short checklist, and it works on any project.', focus: 'scrum' },
    ]),
    sc('s4', PR, 1, { nl: 'FAT, SAT en demo’s', en: 'FAT, SAT and demos' }, [
      { nl: '{t:Fabrieksacceptatietest|Fabrieksacceptatietest}, FAT: testen bij de leverancier, voor verzending.', en: 'The {t:Factory acceptance test|factory acceptance test}, FAT: testing a machine at the supplier, before shipping.', cue: { Fabrieksacceptatietest: 'fat' }, focus: 'fat' },
      { nl: 'De locatieacceptatietest, SAT: na installatie bij de klant.', en: 'The site acceptance test, SAT: after installation at the client.', focus: 'sat' },
      { nl: 'Een FAT met open punten is gewoon; geef ze eigenaren en data voor je verzendt.', en: 'A FAT passed with open points is common; give them owners and dates before you ship.', focus: 'punch' },
      { nl: 'Demo’s zijn je beste meter. Eén om de twee weken laat meer zien dan tien statusrapporten.', en: 'Demos are your best meter. One every two weeks shows more than ten status reports.', focus: ['demo', 'calendar'] },
      { nl: 'Fout: maanden niets te controleren. Grove regel: elke twee tot vier weken een controleerbaar resultaat.', en: 'Failure: months with nothing to check. Rough rule: a checkable result every two to four weeks.', focus: ['gap', 'calendar'] },
      { nl: '“Wat kun je me over twee weken laten zien?”', en: '“What will you be able to show me in two weeks?”', focus: ['ask', 'jij'] },
    ]),
    sc('s5', PR, 1, { nl: 'Zeventig procent', en: 'Seventy percent' }, [
      { nl: 'Een MES-project. De leverancier meldt “{n:70}% gereed”. Jij bouwt het voortgangsbeeld opnieuw op.', en: 'An MES project. The supplier reports “{n:70}% complete”. You rebuild the progress view.', focus: ['claim', 'teamlead'] },
      { nl: 'Stap 1: met de leverancier zes mijlpalen, van ontwerp goedgekeurd tot generale repetitie.', en: 'Step 1: six milestones with the supplier, from design approved to go-live rehearsal.', focus: ['m6', 'sheet'] },
      { nl: 'Stap 2: bij elk het bewijs, van getekend ontwerp tot een verslag van de repetitie.', en: 'Step 2: the evidence for each, from a signed design to a rehearsal report.', focus: 'ev' },
      { nl: 'Stap 3: alleen {n:1} en {n:2} hebben bewijs. Mijlpaal {n:3} is “bijna klaar”, zonder controle.', en: 'Step 3: only {n:1} and {n:2} have evidence. Milestone {n:3} is “almost done”, unchecked.', focus: ['tally', 'sheet'] },
      { nl: 'Stap 4: meld {n:2} van de {n:6}, de derde over twee weken. Die {n:70}% was bestede inspanning.', en: 'Step 4: report {n:2} of {n:6}, the third in two weeks. The {n:70}% was effort spent.', focus: ['report', 'sponsor', 'calendar'] },
    ]),
    sc('s6', DE, 2, { nl: 'Welke deur?', en: 'Which door?' }, [
      { nl: 'Zelden zekerheid: beslis goed met wat je hebt, en weet wanneer het niet jouw besluit is.', en: 'Rarely certainty: decide well with what you have, and know when it isn’t your decision.', focus: 'skill' },
      { nl: 'Een {t:Omkeerbaar besluit|omkeerbaar besluit} draai je goedkoop terug.', en: 'A {t:Reversible decision|reversible decision} can be undone at low cost.', cue: { 'Omkeerbaar besluit': 'rev' }, focus: 'rev' },
      { nl: 'Bezos, brief 2015: onomkeerbaar is een {t:Eenrichtingsdeur|eenrichtingsdeur}, omkeerbaar een tweerichtingsdeur.', en: 'Bezos, letter for 2015: irreversible is a {t:One-way door|one-way door}, reversible a two-way door.', cue: { Eenrichtingsdeur: 'doors' }, focus: 'doors' },
      { nl: 'Tweerichtingsdeur: beslis vrij snel. Zo’n {n:70}% van de informatie; wacht je op {n:90}%, dan ben je te laat.', en: 'Two-way door: decide fairly fast. About {n:70}% of the information; wait for {n:90}% and you’re too slow.', focus: 'seventy' },
      { nl: 'Eenrichtingsdeur: schakelinstallatie met lange {t:Levertijd|levertijd} bestellen, of het oude systeem uitzetten.', en: 'One-way door: ordering switchgear with a long {t:Lead time|lead time}, or shutting down the old system.', cue: { Levertijd: 'lead' }, focus: 'lead' },
      { nl: 'Dan vertraag je: meer bewijs, een second opinion, de sponsor beslist.', en: 'Then slow down: more evidence, a second opinion, the sponsor decides.', focus: ['slow', 'sponsor'] },
    ]),
    sc('s7', DE, 2, { nl: 'Escaleren', en: 'Escalating' }, [
      { nl: '{t:Escalatie|Escalatie}: besluit of probleem naar wie meer bevoegdheid heeft, omdat het buiten de jouwe valt.', en: '{t:Escalation|Escalation}: a decision or problem taken to someone with more authority, as it is beyond yours.', cue: { Escalatie: 'esc' }, focus: 'esc' },
      { nl: 'Geen falen: het systeem dat werkt.', en: 'Not failure: the system working.', focus: 'system' },
      { nl: 'Buiten je mandaat, experts die vastzitten, doel, budget of datum in gevaar: escaleer.', en: 'Outside your mandate, experts stuck, goal, budget or date at risk: escalate.', focus: 'when' },
      { nl: 'Vroeg, met opties: “Twee opties, wat elk kost, en mijn advies.”', en: 'Early, with options: “Two options, what each costs, and my recommendation.”', focus: ['opts', 'jij', 'sponsor'] },
    ]),
    sc('s8', DE, 2, { nl: 'Eén A4', en: 'One page' }, [
      { nl: 'Een {t:Beslisnotitie|beslisnotitie}: één A4 met vraag, opties, criteria, expertadvies, aanbeveling en deadline.', en: 'A {t:Decision memo|decision memo}: one page with question, options, criteria, expert advice, recommendation, deadline.', cue: { Beslisnotitie: 'memo' }, focus: ['memo', 'sheet'] },
      { nl: 'Hij dwingt je het technische deel te vertalen naar gevolgen.', en: 'It forces you to translate the technical part into consequences.', focus: 'conseq' },
      { nl: 'Breng het besluit helder, zonder excuus. Pfeffer: “show up in powerful fashion”.', en: 'State the decision clearly, without apology. Pfeffer: “show up in powerful fashion”.', focus: 'power' },
      { nl: 'Rustig en stevig, niet ondergraven met “sorry, misschien”.', en: 'Calmly and firmly, not undercut with “sorry, maybe”.', focus: ['sorry', 'jij'] },
      { nl: 'Fouten: te laat escaleren, zonder advies, besluiten elke week weer openbreken.', en: 'Failures: escalating too late, without a recommendation, reopening decisions every week.', focus: 'fails' },
      { nl: 'Niet terug te draaien? Wie beslist, en wanneer? Wel? Wat kost een week wachten?', en: 'Can’t undo it? Who decides, and by when? Can? What does waiting a week cost?', focus: 'ask2' },
    ]),
    sc('s9', DE, 2, { nl: 'Een schakelinstallatie', en: 'Ordering switchgear' }, [
      { nl: 'Levertijd {n:26} weken; de belastingcijfers komen over {n:4} weken. Wachten kost ongeveer een maand.', en: 'A lead time of {n:26} weeks; the load figures come in {n:4} weeks. Waiting costs about a month.', focus: ['case', 'calendar'] },
      { nl: 'Stap 1: bestellen is een eenrichtingsdeur; annuleren kost veel.', en: 'Step 1: ordering is a one-way door; cancelling costs a lot.', focus: 'st1' },
      { nl: 'Stap 2, de netengineer: alleen als de belasting meer dan {n:30}% stijgt.', en: 'Step 2, the grid engineer: only if the load rises by more than {n:30}%.', focus: ['st2', 'teamlead'] },
      { nl: 'Stap 3, de fabriek: hoe waarschijnlijk is dat? “Heel onwaarschijnlijk.”', en: 'Step 3, the factory: how likely is that? “Very unlikely.”', focus: ['st3', 'planner'] },
      { nl: 'Stap 4, beslisnotitie: nu bestellen, risico benoemd; of {n:4} weken wachten. Advies: nu.', en: 'Step 4, decision memo: order now, risk named; or wait {n:4} weeks. Recommendation: now.', focus: ['st4', 'sheet'] },
      { nl: 'Stap 5: de sponsor beslist; jij legt het vast en kondigt het helder aan.', en: 'Step 5: the sponsor decides; you record it and announce it plainly.', focus: ['st5', 'sponsor'] },
    ]),
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the cards it carries every
// point of the checklist above. No symbols the voice would read aloud: numbers
// stay plain, percent is said as a word, no quotes or parentheses.
// Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). New SAY rules in films/_kit/timeline.mjs for this
// film (no other film's spoken text changes): definition of done as "deffi-
// nisjun of dun", FAT and SAT as letters, fabrieksacceptatietest and
// locatieacceptatietest split at the heads, Jeffrey Pfeffer as "Djeffri
// Feffer". Shared rules already cover mijlpaal (MIJL-paal), acceptatiecriteria
// (lower case), Jeff Bezos (Djef Beezos), deadline (dedlain), livegang (laif-
// gang) and MES (letters, English); project is in films/_kit/lexicon.nl.json.
// Kept out of the Dutch narration because espeak-ng misreads them (they stay
// in the captions and on the cards): Scrum Guide (a Dutch g in Guide: said "de
// gids van Scrum"), second opinion ("se-KONT oo-pie-nie-on": said "een tweede
// mening"), show up in powerful fashion (said "kom krachtig over", the
// lesson's own Dutch; the card carries the 7 Rules of Power), netengineer
// ("nee-tən-gi-NEER": said "de expert van het net"), gereviewd ("ge-ree-
// VIEWD": said "nagekeken"), akkoord (stressed AK-: the evidence list stays on
// the card), vuistregel (vuistre-GEL: said "een grove regel"), ondergraven
// (stressed ON-: said "zwak het niet af"), voortgangsmeter (a schwa in meter:
// said "meter"), MES-project and netproject (the second stress on PRO: said
// "een project voor een MES", "een project aan het stroomnet"), projectleiders
// (the rule of thumb is said without them), installatie on its own (stressed
// IN-: said "na plaatsing", "de schakelinstallatie"; no SAY rule, since films
// with a video say it), and "Is het een" and "Meestal is het een" (read with
// a stressed één: said "Is dit een", "houden hem bij als"). The guard below runs on the text
// after the SAY rules, so a word a rule rewrites passes and a misread one
// fails the build.
const SAY = [
  [ // s1 what is done
    { nl: 'Buiten je vak kun je niet naar het werk kijken en zien hoe ver het is.',
      en: 'Outside your field you can\'t look at the work and judge how far along it is.' },
    { nl: 'Meet dus wat af is of niet af, met bewijs dat je kunt zien.',
      en: 'So measure what is done or not done, with evidence you can see.' },
    { nl: 'Een {t:Mijlpaal|mijlpaal} is een punt waarop een duidelijk resultaat er moet zijn.',
      en: 'A {t:Milestone|milestone} is a point where a clear result has to exist.' },
    { nl: 'Bijvoorbeeld: koppeling getest met echte orders. Of: schakelinstallatie onder spanning.',
      en: 'For example: interface tested with real orders. Or: switchgear energised.' },
    { nl: 'Het is ja of nee, geen percentage.',
      en: 'It\'s a yes or a no, not a percentage.' },
  ],
  [ // s2 count what is proven
    { nl: '{t:Percentage gereed|Percentage gereed}, het deel dat af zou zijn, is buiten je vak de zwakste maat.',
      en: '{t:Percent complete|Percent complete}, the share said to be finished, is the weakest measure outside your field.' },
    { nl: 'Het is een mening, en het blijft vaak rond de {n:90} procent hangen.',
      en: 'It\'s an opinion, and it tends to stall near {n:90} percent.' },
    { nl: 'Uitgegeven budget zegt iets over geld, niet over voortgang.',
      en: 'Budget spent tells you about money, not about progress.' },
    { nl: 'Tel afgeronde mijlpalen, en tel er een pas als het bewijs er is.',
      en: 'So count finished milestones, and only count one when its evidence exists.' },
    { nl: 'Een getekend testrapport, een demo, een goedgekeurde tekening.',
      en: 'A signed test report, a demo, an approved drawing.' },
  ],
  [ // s3 when is it done
    { nl: 'De {t:Acceptatiecriteria|acceptatiecriteria}: de voorwaarden om geaccepteerd te worden, opgeschreven voordat het werk begint.',
      en: '{t:Acceptance criteria|Acceptance criteria} are the conditions to be accepted, written before the work starts.' },
    { nl: 'Bijvoorbeeld: het label print in minder dan {n:3} seconden, en alle {n:12} velden kloppen met de order.',
      en: 'For example: the label prints in under {n:3} seconds, and all {n:12} fields match the order.' },
    { nl: 'Spreek ze af met de expert en de gebruiker. Dan is klaar later geen discussiepunt.',
      en: 'Agree them with the expert and the user. Then done isn\'t argued about later.' },
    { nl: 'De {t:Definition of done|definition of done} is de gedeelde kwaliteitsnorm om als af te tellen: getest, gedocumenteerd, nagekeken.',
      en: 'The {t:Definition of done|definition of done} is the shared quality standard to count as finished: tested, documented, reviewed.' },
    { nl: 'Hij komt uit de gids van Scrum. De meeste teams houden hem bij als korte checklist, en hij werkt in elk project.',
      en: 'It comes from the Scrum Guide. Most teams keep it as a short checklist; it works on any project.' },
  ],
  [ // s4 FAT, SAT and demos
    { nl: 'Automatisering en elektrotechniek kennen twee formele mijlpalen. De {t:Fabrieksacceptatietest|fabrieksacceptatietest}, de FAT, test een machine bij de leverancier, voor verzending.',
      en: 'Automation and electrical work have two formal milestones. The {t:Factory acceptance test|factory acceptance test}, the FAT, tests a machine at the supplier, before shipping.' },
    { nl: 'De locatieacceptatietest, de SAT, volgt na plaatsing bij de klant.',
      en: 'The site acceptance test, the SAT, follows after installation at the client.' },
    { nl: 'Een FAT met open punten is gewoon. Geef die punten eigenaren en data voordat je verzendt.',
      en: 'A FAT passed with open points is common. Give that list owners and dates before you ship.' },
    { nl: 'Demo\'s zijn je beste meter: regelmatig, kort, met echte data. Een demo om de twee weken zegt meer dan tien statusrapporten.',
      en: 'Demos are your best meter: regular, short, real data. One every two weeks shows more than ten status reports.' },
    { nl: 'Klassieke fout: maanden zonder mijlpaal. Een grove regel: minstens elke twee tot vier weken iets om te controleren.',
      en: 'A typical failure: months without a milestone. A rough rule: something to check at least every two to four weeks.' },
    { nl: 'Vraag: wat kun je me over twee weken laten zien?',
      en: 'So ask: what can you show me in two weeks?' },
  ],
  [ // s5 seventy percent
    { nl: 'Een project voor een MES. De leverancier meldt {n:70} procent gereed. Jij bouwt het beeld opnieuw op.',
      en: 'An MES project. The supplier reports {n:70} percent complete. You rebuild the progress view.' },
    { nl: 'Stap één: de zes mijlpalen op een rij, van ontwerp goedgekeurd tot de generale repetitie.',
      en: 'Step one: list the six milestones, from design approved to the go-live rehearsal.' },
    { nl: 'Stap twee: bij elk het bewijs, van getekend ontwerp tot verslag van de repetitie.',
      en: 'Step two: the evidence for each, from a signed design to a rehearsal report.' },
    { nl: 'Stap drie: tel wat bewijs heeft. Alleen {n:1} en {n:2}. Mijlpaal {n:3} is bijna klaar, zonder controle.',
      en: 'Step three: count what has evidence. Only {n:1} and {n:2}. Milestone {n:3} is almost done, without a check.' },
    { nl: 'Stap vier: meld {n:2} van de {n:6} met bewijs, de derde over twee weken. Die {n:70} procent was bestede inspanning.',
      en: 'Step four: report {n:2} of {n:6} with evidence, the third in two weeks. The {n:70} percent was effort spent.' },
  ],
  [ // s6 which door
    { nl: 'Zekerheid heb je zelden. Beslis goed met wat je hebt, en weet wanneer het niet jouw besluit is.',
      en: 'You rarely have certainty. Decide well with what you have, and know when it isn\'t your decision.' },
    { nl: 'Is dit een {t:Omkeerbaar besluit|omkeerbaar besluit}, dat je goedkoop terug kunt draaien?',
      en: 'Is it a {t:Reversible decision|reversible decision}, one you can undo at low cost?' },
    { nl: 'Jeff Bezos noemde onomkeerbare besluiten in zijn brief over 2015 {t:Eenrichtingsdeur|eenrichtingsdeuren}: geen weg terug. Omkeerbare zijn tweerichtingsdeuren.',
      en: 'In his letter for 2015, Jeff Bezos called irreversible decisions {t:One-way door|one-way doors}: no way back. Reversible ones are two-way doors.' },
    { nl: 'Tweerichtingsdeuren neem je vrij snel, en je leert. Volgens zijn brief over 2016 volstaat meestal zo\'n {n:70} procent van de informatie die je wilt; wachten op {n:90} is te laat.',
      en: 'Take two-way doors fairly fast, and learn. His letter for 2016: about {n:70} percent of the information you want usually suffices; waiting for {n:90} is too slow.' },
    { nl: 'Een eenrichtingsdeur: een schakelinstallatie bestellen met een lange {t:Levertijd|levertijd}, de tijd tot levering, of het oude systeem uitzetten.',
      en: 'A one-way door: ordering switchgear with a long {t:Lead time|lead time}, the time until delivery, or shutting down the old system.' },
    { nl: 'Daar vertraag je: meer bewijs, een tweede mening, de sponsor die beslist.',
      en: 'There you slow down: more evidence, a second opinion, and the sponsor decides.' },
  ],
  [ // s7 escalating
    { nl: '{t:Escalatie|Escalatie} is een besluit of probleem voorleggen aan iemand met meer bevoegdheid, omdat het buiten de jouwe valt.',
      en: '{t:Escalation|Escalation} is taking a decision or problem to someone with more authority, because it is beyond yours.' },
    { nl: 'Het is geen falen. Het is het systeem dat werkt.',
      en: 'It is not failure. It is the system working.' },
    { nl: 'Escaleer als het buiten je mandaat valt, als experts vastzitten, of als doel, budget of datum in gevaar is.',
      en: 'Escalate when it\'s outside your mandate, when experts are stuck, or when goal, budget or date is at risk.' },
    { nl: 'Escaleer vroeg, met opties, niet alleen met een probleem: twee opties, wat elk kost, en mijn advies.',
      en: 'Escalate early, with options, not just a problem: two options, what each costs, and my recommendation.' },
  ],
  [ // s8 one page
    { nl: 'Een {t:Beslisnotitie|beslisnotitie} maakt het concreet: één A4 met vraag, opties, criteria, advies van experts, jouw aanbeveling en deadline.',
      en: 'A {t:Decision memo|decision memo} makes it concrete: one page with question, options, criteria, expert advice, your recommendation and deadline.' },
    { nl: 'Hij dwingt je het technische deel te vertalen naar gevolgen.',
      en: 'It forces you to translate the technical part into consequences.' },
    { nl: 'Breng het besluit dan helder, zonder excuus. Of, met Jeffrey Pfeffer: kom krachtig over.',
      en: 'Then state the decision clearly, without apology. In Jeffrey Pfeffer\'s words: show up in powerful fashion.' },
    { nl: 'Zeg het rustig en stevig, en zwak het niet af met sorry, misschien.',
      en: 'Say it calmly and firmly, and don\'t undercut it with sorry, maybe.' },
    { nl: 'Klassieke fouten: te laat escaleren, als er geen opties meer zijn; zonder advies, zodat de sponsor voor je denkt; besluiten elke week weer openbreken.',
      en: 'Typical failures: escalating too late, with no options left; without a recommendation, so the sponsor does your thinking; reopening decisions every week.' },
    { nl: 'Vraag: kunnen we dit niet terugdraaien, wie beslist dan, en wanneer? Kan het wel, wat kost een week wachten?',
      en: 'Ask: if we can\'t undo this, who decides, and by when? If we can, what does a week\'s wait cost?' },
  ],
  [ // s9 ordering switchgear
    { nl: 'Een project aan het stroomnet. De schakelinstallatie heeft {n:26} weken levertijd; de definitieve belastingcijfers komen over {n:4} weken. Wachten schuift het inschakelen zo\'n maand op.',
      en: 'A grid project. The switchgear has a {n:26}-week lead time; the final load figures come in {n:4} weeks. Waiting slips energising by about a month.' },
    { nl: 'Stap één: bestellen is een eenrichtingsdeur. Annuleren kost veel.',
      en: 'Step one: ordering is a one-way door. Cancelling costs a lot.' },
    { nl: 'Stap twee, de expert van het net: de cijfers veranderen de schakelinstallatie alleen als de belasting meer dan {n:30} procent stijgt.',
      en: 'Step two, the grid engineer: the figures only change the switchgear if the load rises by more than {n:30} percent.' },
    { nl: 'Stap drie, vraag de fabriek hoe waarschijnlijk dat is. Heel onwaarschijnlijk.',
      en: 'Step three, ask the factory: how likely is that? Very unlikely.' },
    { nl: 'Stap vier, een beslisnotitie aan de sponsor: nu bestellen op de huidige dimensionering, risico benoemd, of {n:4} weken wachten en een maand schuiven. Advies: nu bestellen.',
      en: 'Step four, a decision memo to the sponsor: order now on the current sizing, risk named, or wait {n:4} weeks and slip a month. Recommendation: order now.' },
    { nl: 'Stap vijf: de sponsor beslist. Jij legt het vast en kondigt het helder aan.',
      en: 'Step five: the sponsor decides. You record it and announce it plainly.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above); checked on the text
// after the SAY rules, so a rewritten word passes
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(Scrum Guide|second opinion|show up|Rules of Power|netengineer|gereviewd|akkoord|installatie|vuistregel|ondergraaf\w*|ondergraven|voortgangsmeter|MES-project|netproject|projectleiders|definition of done|FAT|SAT|fabrieksacceptatietest|locatieacceptatietest|Pfeffer|Acceptatiecriteria)\b/;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
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
  if (total > 300) throw new Error(`film is ${total} s, over 300 (words per scene ${said.join(" ")}, all ${all})`);
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
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken, waarop mijlpalen als ruitjes verschijnen, een demo om de twee weken, de derde mijlpaal over twee weken en de vier weken tot de belastingcijfers. Jij, de adviseur in petrol, staat aan de voorkant van de tafel. De teamleider aan het linkereind is de expert, eerst de leverancier, later de netengineer; de planner met een tablet achter de tafel is de gebruiker, later de fabriek; de sponsor in pak staat aan het rechtereind. Op tafel een vel: een getekend testrapport, de zes mijlpalen met hun bewijs, en de beslisnotitie. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: wat af is en de mijlpaal; percentage gereed tegenover bewijs; acceptatiecriteria en de definition of done; FAT, SAT en demo’s; een MES-leverancier die zeventig procent meldt, waarvan twee van de zes mijlpalen bewezen; eenrichtings- en tweerichtingsdeuren; escalatie; de beslisnotitie en het brengen van een besluit; en het bestellen van een schakelinstallatie met 26 weken levertijd.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks, where milestones appear as diamonds, a demo every two weeks, the third milestone due in two weeks and the four weeks until the load figures. You, the consultant in petrol, stand at the front of the table. The team lead at the left end is the expert, first the supplier, later the grid engineer; the planner with a tablet behind the table is the user, later the factory; the sponsor in a suit stands at the right end. On the table a sheet: a signed test report, the six milestones with their evidence, and the decision memo. At the right a panel with one card per scene, marked as example or diagram: what is done and the milestone; percent complete against evidence; acceptance criteria and the definition of done; FAT, SAT and demos; an MES supplier reporting seventy percent, of which two of six milestones are proven; one-way and two-way doors; escalation; the decision memo and stating a decision; and ordering switchgear with a 26-week lead time.',
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

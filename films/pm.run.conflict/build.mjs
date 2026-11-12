// Dev tool, not shipped. Builds the explainer film "Conflict: belangen en het
// lastige gesprek / Conflict: interests and the difficult conversation" for the
// Projects course: pm.run.conflict (level 3 of Team en overleg, "Conflict en
// het lastige gesprek").
//
//   node films/pm.run.conflict/build.mjs            build the page
//   node films/pm.run.conflict/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.run.conflict.html: one offline page with
// the anatomy kit, the stage script and the player inlined. A film that will
// be rendered to video (Merijn, 2026-11-12: render every reviewed pm film), so
// all stage and card text is 22 units (films/_kit/build-film.mjs).
//
// Why a film of its own: pm.negotiate.batna and pm.lead.difficult both weighed
// this lesson and left it out for length (see their headers). Its core, team
// mediation with positions, interests and objective criteria (Getting to Yes),
// the BATNA of each side, splitting the difference, the four-step difficult
// conversation and the dairy example, fills about four minutes on its own.
// Terms and claims follow those two films: the BATNA is "the best alternative
// to a negotiated agreement, what you do if there is no deal" (as in
// pm.negotiate.batna); positions, interests, objective criteria and the BATNA
// are Fisher and Ury's; the four steps here are the lesson's own and are not
// credited to Stone, Patton and Heen (pm.lead.difficult credits them only the
// three conversations, the third story, contribution and intent versus impact).
//
// Seven scenes: position and interest (s1, teach 1), mediating in the team
// (s2, teach 2), the BATNA and what goes wrong (s3, teach 5), the dairy example
// (s4, the example text) and its reveal (s5), the difficult conversation (s6,
// teach 3) and with the client (s7, teach 4). The example follows the three
// mediation blocks it applies; the two conversation blocks close the film.
//
// Checklist (lesson point: scene and beat; every point is said in the voice
// and shown on the card, which stays for the rest of its page, at least 4 s):
//   teach 1: positions versus interests, from Getting to Yes by Fisher and Ury
//     (1981) (s1 b1, the book on the card); a position is what someone says
//     they want, "no stops during the week" (s1 b2); an interest is why, "we
//     can't miss the weekly delivery to our biggest customer" (s1 b3);
//     positions clash, interests often don't; a four-hour stop on Monday
//     morning, when the order has shipped, may work for both (s1 b4); ask
//     "what do you need it for?" and "what are you worried about?" (s1 b5)
//   teach 2: in the team, first listen to both sides separately (s2 b1); take
//     no side, even when one is right (s2 b2); bring them together with the
//     interests on the table, "you both want the line to run reliably; you
//     disagree on when to stop it" (s2 b3); look for options that serve both
//     (s2 b4); decide on objective criteria, facts both sides accept
//     beforehand, downtime hours, missed deliveries, not who shouts loudest
//     (s2 b5)
//   teach 5: know each side's BATNA, also from Getting to Yes, the best
//     alternative if there is no agreement (s3 b1, the English words on the
//     card); without a shared stop maintenance's alternative is a breakdown,
//     production's a missed delivery (s3 b2); seeing that makes an agreement
//     more attractive (s3 b3); what goes wrong: splitting the difference, two
//     hours instead of four satisfies nobody and fixes nothing (s3 b4); some
//     conflicts are about values or status, not interests: escalate to
//     someone who can decide (s3 b5)
//   example: a junior Lean consultant at a dairy plant (s4 b1); the production
//     manager and the maintenance manager clash in your weekly meeting (s4
//     b2); production: "no more stops on line 1, we're behind" (s4 b3);
//     maintenance: "then it breaks down, and that's worse" (s4 b4); you stop
//     the discussion and talk to each alone (s4 b5); production's interest, a
//     big order to a retailer (a supermarket chain) every Thursday (s4 b6);
//     maintenance's, three hours a week to replace worn seals before they
//     fail (s4 b7)
//   reveal (the ask is answered in the voice: the shared interest you name,
//     the option you put on the table): "you both want line 1 to run reliably
//     on Thursday" (s5 b1); production fears a missed delivery, maintenance a
//     breakdown that makes that delivery fail too (s5 b2); the option: a
//     three-hour stop on Friday morning, the day after the Thursday delivery
//     (s5 b3); decide on objective criteria: try it four weeks, then look at
//     downtime hours and missed deliveries (s5 b4), not at who shouted loudest
//     (s5 b5)
//   teach 3: a difficult conversation is the one you'd rather avoid; four
//     steps (s6 b1); what I saw, factually, "twice this month the data wasn't
//     ready on Monday" (s6 b2); the impact, "the planning meeting then decides
//     on guesses" (s6 b3); ask their view and listen, "how do you see it?" (s6
//     b4); agree the next step together; prepare the first sentence, the rest
//     follows (s6 b5)
//   teach 4: when a client manager blames your project, don't defend yourself
//     in the room (s7 b1); "I hear you're unhappy with how this is going. Can
//     we take twenty minutes tomorrow to go through it?" (s7 b2); then the same
//     four steps (s7 b3); when you don't know what to do, separate the people
//     and talk to each alone (s7 b4), and ask a senior colleague before you act
//     (s7 b5)
//   Not in the film: the lesson's pre and recall questions, its "said" line,
//   its situation and sayIt (practice, not teach text).
//
// Facts checked (2026-11-12): Roger Fisher and William Ury, Getting to Yes:
// Negotiating Agreement Without Giving In (Houghton Mifflin, 1981; Bruce
// Patton joined from the 1991 second edition): "focus on interests, not
// positions", "insist on using objective criteria" and the BATNA, the best
// alternative to a negotiated agreement, are all in that book. The film says
// only that the distinction and the BATNA come from it, as the lesson does.
// Splitting the difference, mediating apart first, the four steps, the client
// advice and the dairy example are the lesson's own and are credited to no
// one; no conflict model (Thomas-Kilmann or another) is named.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// meeting room with a whiteboard that repeats the panel in miniature, a clock
// and a calendar strip of eight weeks on the side wall (the four trial weeks
// light in s5); a table with a sheet that fills with the option and the
// prepared first sentence; and the four people of the cast: the planner behind
// the table is production (the production manager in the example), the team
// lead in his work vest at the left end is maintenance, the sponsor in a suit
// at the right end is the client manager of s7, and "jij", the consultant in
// petrol, stands at the front between them. A panel at the right, in stage
// space, carries one card per scene, labelled "voorbeeld" or "schema" (it
// reads "voorbeeld" while a sample sentence is the beat's point). Positions
// and interests are drawn as an iceberg: the position above a dashed waterline,
// the interest below it; the four steps as a numbered stair.
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the four people, the
// board, the sheet and the calendar.
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
// fails if it drifts); the one {n:...} number, line 1, is then checked against
// the Dutch lesson text by defineFilm.
const RC = 'pm.run.conflict';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (lang) => { const l = lessons[lang].get(RC); return `${l.pre.map((q) => q.q).join('\n')}\n${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask}\n${l.example.reveal}`; };
const says = (list, lang = 'nl') => { const t = textOf(lang); for (const s of list) assert(t.includes(s), `${RC} (${lang}) no longer says "${s}"`); };
says(['Standpunten tegenover belangen, uit het boek Getting to Yes van Fisher en Ury (1981)', 'Een standpunt is wat iemand zegt te willen: “geen stops door de week”',
  'Een belang is waarom: “we mogen de wekelijkse levering aan onze grootste klant niet missen”', 'Standpunten botsen; belangen vaak niet',
  'Misschien werkt een stop van vier uur op maandagochtend, als de order al de deur uit is, voor allebei', 'Vraag “waar heb je het voor nodig?” en “waar maak je je zorgen over?”',
  'luister eerst apart naar beide kanten. Kies geen kant, ook niet als een van de twee gelijk heeft',
  '“Jullie willen allebei dat de lijn betrouwbaar draait. Jullie verschillen over wanneer je hem stilzet.”', 'Zoek opties die beide dienen',
  'beslis op objectieve criteria, feiten die beide kanten vooraf accepteren, zoals stilstanduren of gemiste leveringen, niet op wie het hardst roept',
  'Een lastig gesprek is het gesprek dat je liever uit de weg gaat. Voer het in vier stappen', 'Wat ik zag, feitelijk: “Deze maand was de data twee keer niet klaar op maandag.”',
  'Het effect: “Het planningsoverleg beslist dan op gevoel.”', 'Vraag naar hun kijk, en luister: “Hoe zie jij het?”', 'Spreek samen de volgende stap af. Bereid de eerste zin voor; de rest volgt',
  'als een manager je project de schuld geeft, verdedig je dan niet in de zaal', '“Ik hoor dat je niet tevreden bent over hoe dit loopt. Kunnen we morgen twintig minuten nemen om het door te lopen?”',
  'Gebruik dan dezelfde vier stappen', 'haal de mensen dan uit elkaar, praat met ieder apart, en vraag een senior collega voordat je iets doet',
  'Ken de BATNA (best alternative to a negotiated agreement) van elke kant, ook een begrip uit Getting to Yes: het beste alternatief als er geen afspraak komt',
  'Zonder gezamenlijke stop is het alternatief voor onderhoud een storing, en voor productie een gemiste levering', 'Wie dat ziet, vindt een afspraak aantrekkelijker',
  'Wat misgaat: het verschil delen. Twee uur in plaats van vier maakt niemand blij en lost niks op', 'sommige conflicten gaan over waarden of status, niet over belangen; escaleer dan naar iemand die kan beslissen',
  'Je bent junior Lean-consultant bij een zuivelfabriek', 'De productiemanager en de onderhoudsmanager botsen in je weekoverleg',
  'Productie: “Geen stops meer op lijn 1, we lopen achter.” Onderhoud: “Dan gaat hij stuk, en dat is erger.”', 'Je stopt de discussie en praat met ieder apart',
  'elke donderdag gaat er een grote order naar een retailer (supermarktketen)', 'drie uur per week om versleten afdichtingen te vervangen voordat ze falen',
  'Welk gedeeld belang benoem je als je ze weer bij elkaar brengt, en welke optie leg je op tafel?',
  'Gedeeld belang: “Jullie willen allebei dat lijn 1 donderdag betrouwbaar draait.” Productie vreest een gemiste levering; onderhoud vreest een storing waardoor die levering ook mislukt',
  'Optie: een stop van drie uur op vrijdagochtend, de dag na de donderdaglevering', 'spreek af het vier weken te proberen en dan naar stilstanduren en gemiste leveringen te kijken, niet naar wie het hardst riep',
  'We hebben vier uur per lijn per week nodig']);
says(['from Fisher and Ury’s book Getting to Yes (1981)', 'Know each side’s BATNA, another term from Getting to Yes', 'satisfies nobody and fixes nothing',
  'You are a junior Lean consultant at a dairy plant', 'a big retail order ships every Thursday', 'replace worn seals before they fail', 'Then it will break down, and that’s worse',
  '“You both want line 1 reliable for Thursday.” Production fears missing the shipment; maintenance fears a breakdown that would also miss it',
  'a three-hour stop on Friday morning, the day after the Thursday shipment', 'not at who argued loudest', 'ask a senior colleague before you act'], 'en');
assert(lessons.nl.get(RC).terms.map((t) => t.term).join() === 'Standpunt,Belang,Objectieve criteria,Lastig gesprek,BATNA', 'the five terms of the lesson');
assert(!lessons.nl.get(RC).film && !lessons.en.get(RC).film || lessons.nl.get(RC).film === RC, 'no other film is wired to the lesson');
// the numbers the cards draw: four hours asked, two split, three in the example, a four-week trial
const HRS = { asked: 4, split: 2, seals: 3, trial: 4, weeks: 8 };
assert(HRS.split * 2 === HRS.asked && HRS.trial < HRS.weeks, 'two is half of four; the trial fits the strip');

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

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
// tall cells: the side wall is seen edge-on, so the height carries the strip at 390 px
const CAL = w.calendar({ y0: 40, z0: 104, weeks: HRS.weeks, cw: 20, ch: 46 });
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
const CELLS = Array.from({ length: HRS.weeks }, (_, i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calMarks = `<g transform="${CAL.face}">${g('cMarks', '')}</g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;
// the cast: who stands where (world cm); production behind the table,
// maintenance and the client at the ends, you at the front between them
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
for (const r of Object.keys(SPOT)) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['book', 'pos', 'int', 'clash', 'opt', 'ask',
  'apart', 'side', 'both', 'opts', 'crit',
  'batna', 'alt', 'deal', 'split', 'values',
  'dairy', 'meet', 'ppos', 'mpos', 'stop', 'pint', 'mint',
  'shared', 'fears', 'option', 'trial', 'loud',
  'four', 'saw', 'effect', 'view', 'next', 'first',
  'blame', 'reply', 'same', 'sep', 'senior'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.lead.difficult): the same points, fewer bytes; each rewrite is read back.
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
const PT = mid(HEAD.planner, HEAD.teamlead);
const CAM = [
  { from: [160, 205, 1], to: toward(HEAD.planner, 1.1) },
  { from: toward(PT, 1.02), to: toward(HEAD.jij, 1.1) },
  { from: toward(HEAD.teamlead, 1.04), to: toward(PT, 1.1) },
  { from: [160, 205, 1], to: toward(PT, 1.1) },
  { from: toward(HEAD.jij, 1.04), to: [CALV[0], CALV[1], 1.1] },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.12] },
  { from: toward(HEAD.sponsor, 1.04), to: toward(mid(HEAD.jij, HEAD.sponsor), 1.1) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, HRS };
const sc = (id, title, beats) => ({ id, lesson: RC, level: 3, still: 0.9, title, beats });
const spec = {
  id: RC,
  title: { nl: 'Conflict: belangen en het lastige gesprek', en: 'Conflict: interests and the difficult conversation' },
  lessons: [RC],
  strictFocus: true,
  scenes: [
    sc('s1', { nl: 'Standpunt en belang', en: 'Position and interest' }, [
      { nl: 'Standpunten tegenover belangen: uit Getting to Yes van Fisher en Ury, 1981.', en: 'Positions versus interests: from Getting to Yes by Fisher and Ury, 1981.', focus: 'book' },
      { nl: 'Een {t:Standpunt|standpunt} is wat iemand zegt te willen: “geen stops door de week”.', en: 'A {t:Position|position} is what someone says they want: “no stops during the week”.', cue: { Standpunt: 'pos' }, focus: ['pos', 'planner'] },
      { nl: 'Een {t:Belang|belang} is waarom: “we mogen de levering aan onze grootste klant niet missen”.', en: 'An {t:Interest|interest} is why: “we can’t miss the delivery to our biggest customer”.', cue: { Belang: 'int' }, focus: ['int', 'planner'] },
      { nl: 'Standpunten botsen; belangen vaak niet. Vier uur stop op maandagochtend, als de order weg is?', en: 'Positions clash; interests often don’t. A four-hour stop on Monday morning, once the order has shipped?', focus: ['clash', 'opt'] },
      { nl: 'Vraag: “Waar heb je het voor nodig?” en “Waar maak je je zorgen over?”', en: 'Ask: “What do you need it for?” and “What are you worried about?”', focus: ['ask', 'jij'] },
    ]),
    sc('s2', { nl: 'Bemiddelen in het team', en: 'Mediating in the team' }, [
      { nl: 'Luister eerst apart naar beide kanten.', en: 'First listen to both sides separately.', focus: ['apart', 'planner', 'teamlead'] },
      { nl: 'Kies geen kant, ook niet als een van de twee gelijk heeft.', en: 'Don’t take sides, even when one of them is right.', focus: ['side', 'jij'] },
      { nl: 'Samen: “Jullie willen allebei dat de lijn betrouwbaar draait. Jullie verschillen over wanneer.”', en: 'Together: “You both want the line to run reliably. You disagree on when to stop it.”', focus: ['both', 'jij'] },
      { nl: 'Zoek opties die beide kanten dienen.', en: 'Look for options that serve both sides.', focus: 'opts' },
      { nl: 'Beslis op {t:Objectieve criteria|objectieve criteria}: stilstanduren, gemiste leveringen.', en: 'Decide on {t:Objective criteria|objective criteria}: downtime hours, missed deliveries.', cue: { 'Objectieve criteria': 'crit' }, focus: 'crit' },
    ]),
    sc('s3', { nl: 'BATNA, en wat misgaat', en: 'BATNA, and what goes wrong' }, [
      { nl: 'Ken de {t:BATNA|BATNA} van elke kant: het beste alternatief als er geen afspraak komt.', en: 'Know each side’s {t:BATNA|BATNA}: the best alternative if there is no deal.', cue: { BATNA: 'batna' }, focus: 'batna' },
      { nl: 'Zonder gezamenlijke stop: voor onderhoud een storing, voor productie een gemiste levering.', en: 'Without a shared stop: for maintenance a breakdown, for production a missed delivery.', focus: ['alt', 'teamlead', 'planner'] },
      { nl: 'Wie dat ziet, vindt een afspraak aantrekkelijker.', en: 'Seeing that makes a deal more attractive.', focus: 'deal' },
      { nl: 'Wat misgaat: het verschil delen. Twee uur in plaats van vier maakt niemand blij.', en: 'What goes wrong: splitting the difference. Two hours instead of four satisfies nobody.', focus: 'split' },
      { nl: 'Gaat het over waarden of status, niet over belangen? Escaleer naar wie kan beslissen.', en: 'About values or status, not interests? Escalate to someone who can decide.', focus: 'values' },
    ]),
    sc('s4', { nl: 'Voorbeeld: de zuivelfabriek', en: 'Example: the dairy plant' }, [
      { nl: 'Je bent junior Lean-consultant bij een zuivelfabriek.', en: 'You’re a junior Lean consultant at a dairy plant.', focus: ['dairy', 'jij'] },
      { nl: 'De productiemanager en de onderhoudsmanager botsen in je weekoverleg.', en: 'The production manager and the maintenance manager clash in your weekly meeting.', focus: ['meet', 'planner', 'teamlead'] },
      { nl: 'Productie: “Geen stops meer op lijn {n:1}, we lopen achter.”', en: 'Production: “No more stops on line {n:1}, we’re behind.”', focus: ['ppos', 'planner'] },
      { nl: 'Onderhoud: “Dan gaat hij stuk, en dat is erger.”', en: 'Maintenance: “Then it will break down, and that’s worse.”', focus: ['mpos', 'teamlead'] },
      { nl: 'Je stopt de discussie en praat met ieder apart.', en: 'You stop the discussion and talk to each alone.', focus: ['stop', 'jij'] },
      { nl: 'Productie: elke donderdag een grote order naar een retailer, een supermarktketen.', en: 'Production: a big retail order ships every Thursday.', focus: ['pint', 'planner'] },
      { nl: 'Onderhoud: drie uur per week om versleten afdichtingen te vervangen voordat ze falen.', en: 'Maintenance: three hours a week to replace worn seals before they fail.', focus: ['mint', 'teamlead'] },
    ]),
    sc('s5', { nl: 'Voorbeeld: de optie', en: 'Example: the option' }, [
      { nl: 'Gedeeld belang: “Jullie willen allebei dat lijn {n:1} donderdag betrouwbaar draait.”', en: 'Shared interest: “You both want line {n:1} reliable for Thursday.”', focus: ['shared', 'jij'] },
      { nl: 'Productie vreest een gemiste levering; onderhoud een storing waardoor die ook mislukt.', en: 'Production fears missing the shipment; maintenance a breakdown that would also miss it.', focus: ['fears', 'planner', 'teamlead'] },
      { nl: 'Optie: een stop van drie uur op vrijdagochtend, de dag na de donderdaglevering.', en: 'Option: a three-hour stop on Friday morning, the day after the Thursday shipment.', focus: ['option', 'sheet'] },
      { nl: 'Probeer het vier weken; kijk dan naar stilstanduren en gemiste leveringen.', en: 'Try it for four weeks; then look at downtime hours and missed deliveries.', focus: ['trial', 'calendar'] },
      { nl: 'Niet naar wie het hardst riep.', en: 'Not at who argued loudest.', focus: 'loud' },
    ]),
    sc('s6', { nl: 'Het lastige gesprek', en: 'The difficult conversation' }, [
      { nl: 'Een {t:Lastig gesprek|lastig gesprek} is het gesprek dat je liever uit de weg gaat. Vier stappen.', en: 'A {t:Difficult conversation|difficult conversation} is the talk you’d rather avoid. Four steps.', cue: { 'Lastig gesprek': 'four' }, focus: 'four' },
      { nl: 'Wat ik zag, feitelijk: “Deze maand was de data twee keer niet klaar op maandag.”', en: 'What I saw, factually: “Twice this month the data wasn’t there on Monday.”', focus: ['saw', 'jij'] },
      { nl: 'Het effect: “Het planningsoverleg beslist dan op gevoel.”', en: 'The impact: “The planning meeting then decides on guesses.”', focus: 'effect' },
      { nl: 'Vraag naar hun kijk, en luister: “Hoe zie jij het?”', en: 'Ask their view, and listen: “How do you see it?”', focus: ['view', 'planner'] },
      { nl: 'Spreek samen de volgende stap af. Bereid de eerste zin voor; de rest volgt.', en: 'Agree the next step together. Prepare the first sentence; the rest follows.', focus: ['next', 'first', 'sheet'] },
    ]),
    sc('s7', { nl: 'Met de klant', en: 'With the client' }, [
      { nl: 'Geeft een manager bij de klant je project de schuld? Verdedig je niet in de zaal.', en: 'A client manager blames your project? Don’t defend yourself in the room.', focus: ['blame', 'sponsor'] },
      { nl: '“Ik hoor dat je niet tevreden bent. Kunnen we morgen twintig minuten nemen?”', en: '“I hear you’re unhappy with how this is going. Can we take twenty minutes tomorrow?”', focus: ['reply', 'jij'] },
      { nl: 'Gebruik dan dezelfde vier stappen.', en: 'Then use the same four steps.', focus: 'same' },
      { nl: 'Weet je niet wat je moet doen? Haal de mensen uit elkaar en praat met ieder apart.', en: 'Don’t know what to do? Separate the people and talk to each alone.', focus: 'sep' },
      { nl: 'En vraag een senior collega, voordat je iets doet.', en: 'And ask a senior colleague before you act.', focus: 'senior' },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's
// teach text and worked example, so every point of the checklist above is
// said here. No symbol the voice would read aloud, no spoken parenthesis or
// quote; quoted sentences are introduced in words ("bijvoorbeeld", "zegt").
// Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). Read as written: standpunt, belang, objectieve
// criteria (ˌɔbjɛktˈivə kritˈɪːriˌaː), lastig gesprek, BATNA (bˈɑtnaː, as
// pm.negotiate.batna), zuivelfabriek, supermarktketen, afdichtingen,
// planningsoverleg, escaleer, vrijdagochtend, maandagochtend, senior collega.
// New SAY rules in films/_kit/timeline.mjs (tested; recomputed for every film:
// no other film's spoken text changes): the authors as their names sound,
// "van Fisher en Ury" as "van Fisjer en Joeri" (espeak-ng sounds the h of
// Fisher and reads Ury as "uu-rie") and in English "by Fisher and Ury" as "by
// Fisher and Yuri" (espeak-ng reads "urry"); both only after van / by, so
// pm.negotiate.batna's captions "Fisher en Ury:" keep their voice; and
// Lean-consultant as "Lien consultant", two words (espeak-ng reads "lee-an";
// "Lien-consultant" runs on into "link-consultant", as Whisper heard it on
// review). Review 2026-11-12 (Piper phonemes and Whisper small): plain, Fisher
// is fˈɪshər and Ury ˈyri (heard "Visser & Urie"), with the rule fˈɪʃər and
// jˈuri (heard "Fisher en Jury"); in English Ury is ˈʌɹɪ, "urry", and Yuri
// jˈuːɹɪ, near his own YOOR-ee; so the name rules stay. Said around
// because espeak-ng misreads them (they stay in the captions and on the
// cards): Getting to Yes (a Dutch g; said "het boek van Fisher en Ury"),
// productiemanager and onderhoudsmanager (PRO- and "maa-naa-gher": said "het
// hoofd productie", "het hoofd onderhoud"), manager alone ("iemand bij de
// klant"), retailer ("ree-tai-ler": said by its gloss, een supermarktketen),
// stilstanduren (stressed -UREN: said "uren stilstand") and donderdaglevering
// (stressed -LE-: said "de levering van donderdag"), and apart (stressed AA-part,
// as in other films; no spelling moves the stress: said "met ieder alleen",
// "onder vier ogen"). The year is said in
// words (negentien eenentachtig), and no sentence starts with "Eén".
const SAY = [
  [ // s1 position and interest
    { nl: 'Standpunten tegenover belangen. Dat onderscheid komt uit het boek van Fisher en Ury, uit negentien eenentachtig.',
      en: 'Positions versus interests. The distinction comes from Getting to Yes, the book by Fisher and Ury, from 1981.' },
    { nl: 'Een {t:Standpunt|standpunt} is wat iemand zegt te willen. Bijvoorbeeld: geen stops door de week.',
      en: 'A {t:Position|position} is what someone says they want. For example: no stops during the week.' },
    { nl: 'Een {t:Belang|belang} is waarom. We mogen de wekelijkse levering aan onze grootste klant niet missen.',
      en: 'An {t:Interest|interest} is why. We can\'t miss the weekly delivery to our biggest customer.' },
    { nl: 'Standpunten botsen, belangen vaak niet. Misschien werkt een stop van vier uur op maandagochtend, als de order al de deur uit is, voor allebei.',
      en: 'Positions clash; interests often don\'t. Maybe a four-hour stop on Monday morning, when the order has already shipped, works for both.' },
    { nl: 'Dus vraag: waar heb je het voor nodig? En: waar maak je je zorgen over?',
      en: 'So ask: what do you need it for? And: what are you worried about?' },
  ],
  [ // s2 mediating in the team
    { nl: 'Botsen er twee in je team? Luister dan eerst naar beide kanten, met ieder alleen.',
      en: 'Two people clash in your team? Then first listen to both sides separately.' },
    { nl: 'Kies geen kant. Ook niet als een van de twee gelijk heeft.',
      en: 'Don\'t take sides. Not even when one of them is right.' },
    { nl: 'Breng ze daarna samen, met de belangen op tafel. Jullie willen allebei dat de lijn betrouwbaar draait. Jullie verschillen over wanneer je hem stilzet.',
      en: 'Then bring them together, with the interests on the table. You both want the line to run reliably. You disagree on when to stop it.' },
    { nl: 'Zoek opties die beide kanten dienen.',
      en: 'Look for options that serve both.' },
    { nl: 'En beslis op {t:Objectieve criteria|objectieve criteria}: feiten die beide kanten vooraf accepteren, zoals uren stilstand of gemiste leveringen. Niet op wie het hardst roept.',
      en: 'And decide on {t:Objective criteria|objective criteria}: facts both sides accept beforehand, such as downtime hours or missed deliveries. Not on who shouts loudest.' },
  ],
  [ // s3 the BATNA, and what goes wrong
    { nl: 'Ken ook de {t:BATNA|BATNA} van elke kant, een begrip uit hetzelfde boek: het beste alternatief als er geen afspraak komt.',
      en: 'Know each side\'s {t:BATNA|BATNA} too, another term from the same book: the best alternative to a negotiated agreement, what they do if there is no deal.' },
    { nl: 'Zonder gezamenlijke stop is het alternatief voor onderhoud een storing. En voor productie een gemiste levering.',
      en: 'Without a shared stop, maintenance\'s alternative is a breakdown. And production\'s is a missed delivery.' },
    { nl: 'Wie dat ziet, vindt een afspraak ineens een stuk aantrekkelijker.',
      en: 'Seeing that makes a deal a lot more attractive.' },
    { nl: 'Wat misgaat: het verschil delen. Twee uur in plaats van vier maakt niemand blij, en lost niks op.',
      en: 'A failure mode: splitting the difference. Two hours instead of four satisfies nobody, and fixes nothing.' },
    { nl: 'En sommige conflicten gaan over waarden of status, niet over belangen. Escaleer dan naar iemand die kan beslissen.',
      en: 'And some conflicts are about values or status, not interests. Then escalate to someone who can decide.' },
  ],
  [ // s4 the dairy plant
    { nl: 'Een voorbeeld. Je bent junior Lean-consultant bij een zuivelfabriek.',
      en: 'An example. You are a junior Lean consultant at a dairy plant.' },
    { nl: 'In je weekoverleg botsen het hoofd productie en het hoofd onderhoud.',
      en: 'In your weekly meeting, the production manager and the maintenance manager clash.' },
    { nl: 'Productie zegt: geen stops meer op lijn {n:1}, we lopen achter.',
      en: 'Production says: no more stops on line {n:1}, we\'re behind.' },
    { nl: 'Onderhoud zegt: dan gaat hij stuk, en dat is erger.',
      en: 'Maintenance says: then it will break down, and that\'s worse.' },
    { nl: 'Je stopt de discussie, en praat met ieder onder vier ogen.',
      en: 'You stop the discussion, and talk to each of them alone.' },
    { nl: 'Het belang van productie: elke donderdag gaat er een grote order naar een supermarktketen.',
      en: 'Production\'s interest: a big retail order ships every Thursday.' },
    { nl: 'Het belang van onderhoud: drie uur per week om versleten afdichtingen te vervangen, voordat ze falen.',
      en: 'Maintenance\'s interest: three hours a week to replace worn seals, before they fail.' },
  ],
  [ // s5 the option
    { nl: 'Als je ze weer bij elkaar brengt, benoem je het gedeelde belang: jullie willen allebei dat lijn {n:1} donderdag betrouwbaar draait.',
      en: 'When you bring them back together, you name the shared interest: you both want line {n:1} reliable for Thursday.' },
    { nl: 'Productie vreest een gemiste levering. Onderhoud vreest een storing, waardoor die levering ook mislukt.',
      en: 'Production fears missing the shipment. Maintenance fears a breakdown that would also miss it.' },
    { nl: 'Dan leg je een optie op tafel: een stop van drie uur op vrijdagochtend, de dag na de levering van donderdag.',
      en: 'Then you put an option on the table: a three-hour stop on Friday morning, the day after the Thursday shipment.' },
    { nl: 'En je beslist op objectieve criteria. Spreek af het vier weken te proberen, en kijk dan naar uren stilstand en gemiste leveringen.',
      en: 'And you decide on objective criteria. Agree to try it for four weeks, then look at downtime hours and missed deliveries.' },
    { nl: 'Niet naar wie het hardst riep.',
      en: 'Not at who argued loudest.' },
  ],
  [ // s6 the difficult conversation
    { nl: 'Dan het {t:Lastig gesprek|lastige gesprek}: het gesprek dat je liever uit de weg gaat. Voer het in vier stappen.',
      en: 'Then the {t:Difficult conversation|difficult conversation}: the talk you would rather avoid. Do it in four steps.' },
    { nl: 'Eerst wat je zag, feitelijk. Bijvoorbeeld: deze maand was de data twee keer niet klaar op maandag.',
      en: 'First, what you saw, factually. For example: twice this month the data wasn\'t there on Monday.' },
    { nl: 'Dan het effect: het planningsoverleg beslist dan op gevoel.',
      en: 'Then the impact: the planning meeting then decides on guesses.' },
    { nl: 'Vraag naar hun kijk, en luister. Hoe zie jij het?',
      en: 'Ask for their view, and listen. How do you see it?' },
    { nl: 'Spreek samen de volgende stap af. En bereid je eerste zin voor. De rest volgt.',
      en: 'Agree the next step together. And prepare your first sentence. The rest follows.' },
  ],
  [ // s7 with the client
    { nl: 'En bij de klant? Als iemand daar je project de schuld geeft, verdedig je dan niet in de zaal.',
      en: 'And with the client? When a manager blames your project, don\'t defend yourself in the room.' },
    { nl: 'Zeg liever: ik hoor dat je niet tevreden bent over hoe dit loopt. Kunnen we morgen twintig minuten nemen om het door te lopen?',
      en: 'Say instead: I hear you\'re unhappy with how this is going. Can we take twenty minutes tomorrow to go through it?' },
    { nl: 'In dat gesprek gebruik je dezelfde vier stappen.',
      en: 'In that talk, use the same four steps.' },
    { nl: 'Weet je niet wat je moet doen? Haal de mensen dan uit elkaar, en praat met ieder alleen.',
      en: 'When you don\'t know what to do, separate the people, and talk to each alone.' },
    { nl: 'En vraag een senior collega, voordat je iets doet.',
      en: 'And ask a senior colleague before you act.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice but line 1, and none of the words espeak-ng
// misreads (see above); checked on the text after the SAY rules, so a word a
// rule rewrites passes and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(\w*manager\w*|Fisher|Ury|Getting|retailer|Lean\w*|stilstanduren|donderdaglevering|apart|deal|e-?mail)\b|(^|[.?!;]\s)Eén\b/i,
  en: /\bUry\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (lang === 'nl' && /\d{2,}/.test(said)) throw new Error(`narration: a year or number in digits in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 50)}"`);
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
  if (total > 300) throw new Error(`film is ${total} s, over 300 (words per scene ${said.join(' ')}, all ${all})`);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-water{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:7 5}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-water{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-dash,.pm-mini .pm-water,.pm-mini .pm-strike{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.outside.steering) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard dat het paneel in het klein herhaalt, en een klok; aan de zijwand een kalenderstrook van acht weken, waarop de vier proefweken oplichten. Achter de tafel staat de planner, hier productie; aan het linkereind de teamleider in zijn werkvest, hier onderhoud; aan het rechtereind de sponsor in pak, de manager bij de klant; vooraan, tussen hen in, jij, de adviseur in petrol. Op tafel een vel waarop de optie en je eerste zin verschijnen. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: standpunt en belang als een ijsberg, het standpunt boven een gestippelde waterlijn en het belang eronder; bemiddelen in het team en objectieve criteria; de BATNA van elke kant, het verschil delen en escaleren; het voorbeeld van de zuivelfabriek met de twee standpunten, de twee belangen, het gedeelde belang en de optie op vrijdagochtend; de vier stappen van het lastige gesprek als een genummerde trap; en het gesprek met de klant.',
  en: 'A meeting room. On the back wall a whiteboard that repeats the panel in miniature, and a clock; on the side wall a calendar strip of eight weeks, where the four trial weeks light up. Behind the table stands the planner, here production; at the left end the team lead in his work vest, here maintenance; at the right end the sponsor in a suit, the client manager; at the front, between them, you, the consultant in petrol. On the table a sheet where the option and your first sentence appear. At the right a panel with one card per scene, marked as example or diagram: position and interest as an iceberg, the position above a dashed waterline and the interest below it; mediating in the team and objective criteria; each side\'s BATNA, splitting the difference and escalating; the dairy plant example with the two positions, the two interests, the shared interest and the Friday-morning option; the four steps of the difficult conversation as a numbered stair; and the talk with the client.',
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

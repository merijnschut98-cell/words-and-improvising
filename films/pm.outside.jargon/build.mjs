// Dev tool, not shipped. Builds the explainer film "Plannen toetsen, jargon
// vertalen / Testing plans, translating jargon" for the Projects course module
// "Projecten leiden buiten je vakgebied" (pm.outside), topic Vragen stellen:
// pm.outside.fail (level 2, "Waardoor zou dit mislukken?") and
// pm.outside.jargon (level 4, "Jargon terugvertalen"), the two lessons of the
// topic that pm.outside.questions does not serve.
//
//   node films/pm.outside.jargon/build.mjs            build the page
//   node films/pm.outside.jargon/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.outside.jargon.html: one offline page
// with the anatomy kit, the stage script and the player inlined. The film will
// be rendered to video, so all stage and card text is 22 font-size units (the
// kit default for video films, films/_kit/build-film.mjs; as in
// pm.outside.steering).
// Storyboard: none of its own (docs/superpowers/plans/2026-11-07-v14-explainer-
// films.md, 3.9 lists pm.outside.questions for the topic, which left these two
// lessons out to stay under the 760-word cap). Nine scenes and about five
// minutes, because a lesson with a film no longer shows its worked example, so
// the film carries the whole teach text and the worked example of both
// lessons: the two questions (s1), the premortem (s2), the single point of
// failure and the mitigation (s3), evidence, the first answer and the rough
// rule (s4), the MES premortem (s5); jargon and translating back (s6),
// active listening, paraphrasing and inquiry (s7), teach-back and the failures
// (s8) and the ERP interface (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here),
// set up as in pm.outside.questions and pm.outside.steering: a meeting room
// with a whiteboard (it repeats the panel in miniature), a wall clock and a
// calendar strip of twelve week cells on the side wall (the go-live about two
// months away, the scanner test next week), a table with a sheet (the
// premortem's written reasons, the one plain sentence for the steering group),
// and the recurring cast: "jij" the consultant in petrol at the front of the
// table, the team lead at the left end (the expert; the integration specialist
// in s9), the planner with a tablet behind the table (a team
// member; the IT lead in s5), and the sponsor at the right end. A panel at the
// right, in stage space, carries one card per scene, labelled "schema" (a
// general picture) or "voorbeeld" (the worked examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// calendar strip and the sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries
// it, on screen at least 4 s):
//   fail teach 1: two questions do more work than any others when you can't
//     judge the content: "what would make this fail?" and "how do you know?"
//     (s1 b1); the first finds risks, the second checks the claims (s1 b2);
//     together they test a plan without understanding every detail (s1 b3)
//   fail teach 2: a premortem, a structured version of the first question
//     (card, s2 b1-b2); the team imagines the project has already failed and
//     each writes down why, before anyone speaks (s2 b1, the sheet); Gary Klein,
//     Harvard Business Review, 2007 (s2 b2; Gary on the card and in the English
//     voice, the Dutch voice says "Klein"); Klein cites Mitchell, Russo and Pennington, 1989
//     (the names on the card): imagining an event had already happened gave
//     about 30% more reasons, counted, not their quality, but more candidates
//     is what you want (s2 b4; the card's two bars, +30%, s2 b3-b5); by
//     Klein's account 30% better at the right reasons (s2 b3, worded as in
//     pm.plan.risk; Klein's framing is in the lesson's recall); writing first stops the
//     senior voice setting the tone (s2 b5)
//   fail teach 3: a single point of failure, one part, person or supplier that
//     stops everything if it fails (s3 b1); one server with no backup, one
//     programmer who knows the code, one cable feeding the whole factory (s3
//     b2); for each serious risk the mitigation: what we do now to make it less
//     likely or less bad, and who owns it (s3 b3); a risk without a mitigation
//     and an owner is just a worry (s3 b4)
//   fail teach 4: "how do you know?" asks for evidence, something you or
//     someone else can see, test or check, not an opinion (s4 b1); the ladder
//     from weak to strong: I think so, it worked before, we tested it here,
//     here is the test report (s4 b2); ask calmly, about the claim, not the
//     person: "how do we know the network can carry the data?", not "are you
//     sure?" (s4 b3)
//   fail teach 5: the typical failure, accepting the first answer; the first is
//     the comfortable one, the useful one comes after a pause or a second
//     question (s4 b4); Silence and Inquiry from MORE PIES, a listening
//     checklist met in full later (card; s4 b5); stay quiet, then one level
//     deeper: "and if that happened, what would we see first?" (s4 b5); a rough
//     rule many project leaders use: no risk that surprises you, people haven't
//     been honest yet (s4 b6; the project leaders on the card and in the English
//     voice only)
//   fail example (worked): two months before an MES go-live, a 30-minute
//     premortem with eight people (s5 b1, the calendar); step 1 "it's
//     September, the go-live failed, write down why, alone, 5 minutes" (s5 b2,
//     the sheet); step 2 read out one by one: the barcode scanners on line 2
//     didn't connect, night-shift operators weren't trained, only Ahmed knows
//     the interface (s5 b3); step 3 group them, pick the three most serious
//     (s5 b4); step 4 "how do we know it won't happen?", the scanners tested in
//     the office, not on the line: weak evidence (s5 b5); step 5 a mitigation
//     and an owner: a scanner test on line 2 next week, owner the IT lead; the
//     single point of failure, Ahmed, gets a second person trained (s5 b6, the
//     calendar)
//   jargon teach 1: jargon, the specialist language of a field, precise for
//     insiders and opaque for everyone else (s6 b1); not a problem in itself;
//     the problem is decisions made in it that nobody outside the field
//     understands (s6 b2); your job, translate back into goal, cost, time and
//     risk, so the sponsor and the people on the floor can follow (s6 b3)
//   jargon teach 2: MORE PIES, a checklist for active listening, listening to
//     understand rather than to reply (s7 b1); Mood, Open questions,
//     Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence (card,
//     s7 b1-b2); two letters matter most here (s7 b2); paraphrasing, restating
//     the content in your own words to check you understood (s7 b3; "to check"
//     on the card); inquiry, one level deeper until the consequence (s7 b5)
//   jargon teach 3: "so what you're saying is..." in plain words, then "have I
//     got that right?" (s7 b3); experts usually correct you, and the correction
//     is where you learn (s7 b4); three questions: the date, the cost, the risk
//     (s7 b5); silence: after the paraphrase, wait for the correction (s7 b6)
//   jargon teach 4: teach-back comes from health care, the doctor asks the
//     patient to explain the instructions back (s8 b1); the other way round:
//     tell the expert's point back as you would to the sponsor, let him fix it
//     (s8 b2); the result, a sentence for the steering meeting without
//     misquoting anyone (s8 b3, the sheet)
//   jargon teach 5: failures: translating so loosely the meaning changes, "so
//     it's basically fine?" (s8 b4); the expert presenting to the board in
//     jargon; pretending to follow, then passing the jargon on untranslated (s8
//     b5); a sharp move: before an expert presents to managers, the one
//     sentence the sponsor must remember, in plain words, agreed with him first
//     (s8 b6)
//   jargon example (faded): MES design meeting; "the ERP interface is batch, not
//     real-time, so order changes with up to 15 minutes latency" (s9 b1); "and
//     we can't guarantee idempotency on retries"; you paraphrase the first
//     part, order changes from the office reach the floor up to 15 minutes
//     late; he nods (s9 b2); ask honestly: what does it mean in plain words,
//     and what is the consequence? (s9 b3); "if a message is sent twice, an
//     order might appear twice"; inquiry: what would it cost on the floor, and
//     how often? (s9 b4); teach-back: orders up to 15 minutes late, a hiccup
//     can double an order, so a check for doubles; "is that fair?" (s9 b5, the
//     sheet); he adjusts one word, the sentence goes to the steering meeting
//     (s9 b6)
//
// Facts as in the lessons, checked against the sources: Gary Klein,
// "Performing a Project Premortem", Harvard Business Review, September 2007:
// the team imagines the project "has failed" and "everyone ... independently
// write[s] down every reason"; Klein cites research from 1989 by Deborah J.
// Mitchell, J. Edward Russo and Nancy Pennington that prospective hindsight,
// imagining an event has already occurred, "increases the ability to correctly
// identify reasons for future outcomes by 30%" (the study itself, "Back to
// the future: temporal perspective in the explanation of events", Journal of
// Behavioral Decision Making 2, 1989, counted the reasons people gave; the
// lesson says so in its teach text, and its recall gives Klein's own framing;
// the film gives Klein's 30% as Klein reports it, "volgens hem", as
// pm.plan.risk does, then says the study counted reasons). Teach-back comes from health care (patients repeat
// instructions in their own words). MORE PIES, the evidence ladder, the single
// point of failure, the rough rule and the translation questions are credited
// to no one, as in the lessons (pm.intake.firsttalk names MORE PIES too; this
// film says only that it is a listening checklist).
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
const FA = 'pm.outside.fail';
const JA = 'pm.outside.jargon';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const says = (id, list, lang = 'nl') => {
  const l = lessons[lang].get(id);
  const t = [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n');
  for (const s of list) assert(t.includes(s), `${id} ${lang} no longer says "${s}"`);
};
// never overwrite a film field: this film is the first for both lessons
for (const id of [FA, JA]) for (const lang of ['nl', 'en']) {
  const f = lessons[lang].get(id).film;
  assert(f === undefined || f === 'pm.outside.jargon', `${id} ${lang} already has film ${f}`);
}
says(FA, ['Twee vragen doen meer werk dan alle andere als je de inhoud niet kunt beoordelen: “Waardoor zou dit mislukken?” en “Hoe weet je dat?”',
  'De eerste vindt risico’s. De tweede toetst de beweringen', 'Samen laten ze je een plan testen zonder elk detail ervan te snappen',
  'Een premortem is een gestructureerde versie van de eerste vraag', 'Gary Klein beschreef hem in Harvard Business Review (2007)',
  'het team stelt zich voor dat het project al mislukt is en iedereen schrijft op waarom, voordat iemand iets zegt',
  'Klein haalt een onderzoek aan (Mitchell, Russo en Pennington, 1989)', 'ongeveer 30% meer redenen ervoor bedachten',
  'Het telde redenen, niet hun kwaliteit, maar meer kandidaten is wat je hier wilt', 'Eerst schrijven voorkomt dat de senior stem de toon zet',
  'single point of failure: één onderdeel, persoon of leverancier die, als hij uitvalt, alles stillegt', 'Eén server zonder back-up, één programmeur die de code kent, één kabel die de hele fabriek voedt',
  'Vraag bij elk serieus risico naar de beheersmaatregel (mitigation): wat we nu doen om het minder waarschijnlijk of minder erg te maken, en wie eigenaar is',
  'Een risico zonder beheersmaatregel en eigenaar is alleen een zorg',
  '“Hoe weet je dat?” vraagt om bewijs: iets wat jij of een ander kan zien, testen of controleren, geen mening',
  'De ladder loopt van zwak naar sterk: “ik denk het”, “het werkte eerder”, “we hebben het hier getest”, “hier is het testrapport”',
  'Vraag het rustig en over de bewering, niet over de persoon: “Hoe weten we dat het netwerk de data aankan?” in plaats van “Weet je het zeker?”',
  'De klassieke fout is de vragen stellen en het eerste antwoord accepteren', 'Het eerste antwoord is meestal het comfortabele; het bruikbare komt na een pauze of een tweede vraag',
  'Dat zijn Silence (stilte) en Inquiry (doorvragen) uit MORE PIES, een luisterchecklist die je later helemaal tegenkomt', 'zwijg even, en vraag dan één laag dieper: “En als dat gebeurde, wat zouden we het eerst zien?”',
  'Een grove vuistregel die veel projectleiders gebruiken: levert een premortem geen enkel risico op dat je verrast, dan zijn mensen nog niet eerlijk geweest',
  'Twee maanden voor een MES-livegang houd je een premortem van 30 minuten met acht mensen', '“Het is september. De livegang is mislukt. Schrijf alleen, 5 minuten, op waarom.”',
  'lees ze een voor een voor', '“De barcodescanners op lijn 2 maakten geen verbinding”, “Operators op de nachtdienst waren niet getraind”, “Alleen Ahmed kent de koppeling”',
  'groepeer ze en kies de drie ernstigste', 'vraag bij elk “Hoe weten we dat het niet gebeurt?”', '“We hebben ze op kantoor getest, niet aan de lijn.” Dat is zwak bewijs',
  'een beheersmaatregel en eigenaar: volgende week een scannertest op lijn 2, eigenaar de IT-lead', 'De single point of failure, Ahmed, krijgt een tweede persoon die wordt ingewerkt']);
says(JA, ['Jargon is de vaktaal van een vakgebied: woorden die voor insiders precies zijn en voor iedereen anders ondoorzichtig', 'Op zich is dat geen probleem',
  'Het probleem is als er in die taal besluiten vallen en niemand buiten het vak snapt wat er besloten is',
  'Jouw taak is terugvertalen: van jargon naar doel, kosten, tijd en risico, zodat de sponsor en de mensen op de vloer het kunnen volgen',
  'Het luisterkader hierachter is MORE PIES, een checklist voor actief luisteren, luisteren om te begrijpen in plaats van om te antwoorden',
  'Mood (sfeer), Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry, Experience (ervaring), Silence (stilte)', 'Twee letters doen hier het meest',
  'Parafraseren: de inhoud in je eigen woorden herhalen om te checken of je het begreep', 'Inquiry, doorvragen: één laag dieper vragen, tot je bij het gevolg bent',
  'De parafrase: “Dus wat je zegt is…” gevolgd door gewone woorden, en dan een check: “Klopt dat?”', 'Experts verbeteren je meestal, en in die verbetering zit wat je leert',
  '“Wat betekent dat voor de datum?”, “Wat betekent het voor de kosten?”, “Wat betekent het voor het risico?”', 'Stilte helpt ook: wacht na de parafrase op de verbetering',
  'Terugvertellen (teach-back) komt uit de zorg: de arts vraagt de patiënt de instructies in eigen woorden terug te vertellen',
  'vertel het punt van de expert aan hem terug zoals je het aan de sponsor zou vertellen, en laat hem het verbeteren',
  'Het resultaat is een zin die je mee kunt nemen naar de stuurgroep zonder iemand verkeerd te citeren',
  'zo los vertalen dat de betekenis verandert (“dus eigenlijk is het prima?”), of de expert in jargon direct aan het bestuur laten presenteren',
  'doen alsof je het volgt, en dan het jargon onvertaald doorgeven',
  'vraag hem naar de ene zin die de sponsor moet onthouden, in gewone woorden, en spreek die eerst met hem af',
  'MES-project, ontwerpoverleg. De integratiespecialist zegt: “De ERP-koppeling is batch, niet real-time, dus we krijgen orderwijzigingen met tot 15 minuten latency, en we kunnen geen idempotentie garanderen bij retries.”',
  'Je parafraseert het eerste deel: “Dus orderwijzigingen van kantoor komen tot 15 minuten te laat op de vloer aan.” Hij knikt',
  '“Idempotentie bij retries, wat betekent dat in gewone woorden, en wat is het gevolg?”', '“Als een bericht twee keer wordt verstuurd, kan een order dubbel verschijnen.”',
  '“Wat zou dat ons op de vloer kosten, en hoe vaak?”', 'orders kunnen tot 15 minuten te laat binnenkomen, en als de verbinding hapert kan een order dubbel komen, dus we hebben een check op dubbele orders nodig. Klopt dat?',
  'Hij past één woord aan. Die zin gaat naar de stuurgroep']);
// Klein's own framing of the 30% (the film's s2 b3, as in pm.plan.risk) is in the lesson's recall
for (const [lang, s] of [['nl', 'Klein noemt het een 30% beter vermogen om redenen te vinden'], ['en', 'Klein calls it a 30% better ability to identify reasons']]) {
  assert(lessons[lang].get(FA).recall.some((q) => (q.why || '').includes(s)), `${FA} ${lang} recall no longer gives Klein's framing`);
}
says(FA, ['about 30% more reasons', 'a 30-minute premortem with eight people', 'for 5 minutes', 'on line 2'], 'en');
says(JA, ['up to 15 minutes latency', 'up to 15 minutes late'], 'en');
// the numbers the cards draw
const PRE = { min: 30, people: 8, write: 5, line: 2, top: 3, more: 30 };
assert(PRE.write < PRE.min, 'five minutes of writing fit in a 30-minute session');
const ERP = { late: 15 };

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
const CUES = ['q1', 'finds', 'q2', 'checks', 'together',
  'pm', 'klein', 'study', 'count', 'write',
  'spof', 'three', 'mit', 'worry',
  'proof', 'ladder', 'calm', 'first', 'pies', 'rule',
  'case', 'st1', 'st2', 'st3', 'st4', 'st5',
  'jargon', 'problem', 'four',
  'active', 'letters', 'para', 'correct', 'inq', 'silence',
  'tb', 'round', 'line', 'loose', 'fails', 'one',
  'case2', 'idem', 'para2', 'ask', 'answer', 'tbline', 'final'];
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
const CALV = [CAL_AT[0] + 40, CAL_AT[1] + 30];
const CAM = [
  { from: [160, 205, 1], to: toward(HEAD.jij, 1.06) },
  { from: [160, 205, 1.02], to: [SH[0], SH[1], 1.12] },
  { from: toward(mid(HEAD.teamlead, HEAD.planner), 1.04), to: toward(mid(HEAD.teamlead, HEAD.planner), 1.1) },
  { from: toward(HEAD.jij, 1.04), to: toward(mid(HEAD.jij, HEAD.teamlead), 1.1) },
  { from: [CALV[0], CALV[1], 1.04], to: [SH[0], SH[1], 1.12] },
  { from: [160, 205, 1], to: toward(mid(HEAD.teamlead, HEAD.sponsor), 1.06) },
  { from: toward(HEAD.jij, 1.04), to: toward(mid(HEAD.jij, HEAD.teamlead), 1.1) },
  { from: toward(mid(HEAD.teamlead, HEAD.jij), 1.04), to: [SH[0], SH[1], 1.12] },
  { from: toward(HEAD.teamlead, 1.04), to: toward(HEAD.sponsor, 1.08) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, WEEKS, PRE, ERP };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.outside.jargon',
  title: { nl: 'Plannen toetsen, jargon vertalen', en: 'Testing plans, translating jargon' },
  lessons: [FA, JA],
  strictFocus: true,
  scenes: [
    sc('s1', FA, 2, { nl: 'Twee vragen', en: 'Two questions' }, [
      { nl: 'Twee vragen: waardoor zou dit mislukken? En: hoe weet je dat?', en: 'Two questions: what would make this fail? And: how do you know?', focus: ['q1', 'q2'] },
      { nl: 'De eerste vindt risico’s, de tweede toetst de beweringen.', en: 'The first finds risks, the second checks the claims.', focus: ['finds', 'checks'] },
      { nl: 'Samen test je een plan zonder elk detail te snappen.', en: 'Together they test a plan without understanding every detail.', focus: ['together', 'jij'] },
    ]),
    sc('s2', FA, 2, { nl: 'De premortem', en: 'The premortem' }, [
      { nl: 'Een {t:Premortem|premortem}: het project is al mislukt. Ieder schrijft eerst op waarom.', en: 'A {t:Premortem|premortem}: the project has already failed. Each person first writes down why.', cue: { Premortem: 'pm' }, focus: ['pm', 'sheet'] },
      { nl: 'Gary Klein beschreef hem in 2007, in Harvard Business Review.', en: 'Gary Klein described it in 2007, in Harvard Business Review.', focus: 'klein' },
      { nl: 'Klein haalt onderzoek uit 1989 aan: volgens hem {n:30}% beter in de juiste redenen.', en: 'Klein cites a 1989 study: by his account, {n:30}% better at the right reasons.', focus: 'study' },
      { nl: 'Het onderzoek telde zo’n {n:30}% meer redenen, niet kwaliteit. Meer kandidaten wil je juist.', en: 'The study counted about {n:30}% more reasons, not quality. More candidates is what you want.', focus: ['count', 'study'] },
      { nl: 'Eerst schrijven: dan zet de senior stem niet de toon.', en: 'Writing first stops the senior voice from setting the tone.', focus: ['write', 'sponsor'] },
    ]),
    sc('s3', FA, 2, { nl: 'Eén zwakke plek', en: 'One weak spot' }, [
      { nl: 'Een {t:Single point of failure|single point of failure}: één onderdeel, persoon of leverancier, en alles ligt stil.', en: 'A {t:Single point of failure|single point of failure}: one part, person or supplier, and everything stops.', cue: { 'Single point of failure': 'spof' }, focus: 'spof' },
      { nl: 'Eén server zonder back-up, één programmeur met de code, één kabel voor de fabriek.', en: 'One server without backup, one programmer with the code, one cable for the factory.', focus: 'three' },
      { nl: 'Per serieus risico een {t:Beheersmaatregel|beheersmaatregel}: minder kans of minder erg. En wie is eigenaar?', en: 'Per serious risk, a {t:Mitigation|mitigation}: less likely or less bad. And who owns it?', cue: { Beheersmaatregel: 'mit' }, focus: 'mit' },
      { nl: 'Een risico zonder een beheersmaatregel en eigenaar is alleen een zorg.', en: 'A risk without a mitigation and an owner is just a worry.', focus: 'worry' },
    ]),
    sc('s4', FA, 2, { nl: 'Hoe weet je dat?', en: 'How do you know?' }, [
      { nl: '“Hoe weet je dat?” vraagt om {t:Bewijs|bewijs}: iets wat je kunt zien, testen of controleren.', en: '“How do you know?” asks for {t:Evidence|evidence}: something you can see, test or check.', cue: { Bewijs: 'proof' }, focus: 'proof' },
      { nl: 'Van zwak naar sterk: ik denk het, het werkte eerder, hier getest, hier is het testrapport.', en: 'Weak to strong: I think so, it worked before, tested here, here is the test report.', focus: 'ladder' },
      { nl: 'Vraag rustig, over de bewering: “Hoe weten we dat het netwerk de data aankan?”', en: 'Ask calmly, about the claim: “How do we know the network can carry the data?”', focus: ['calm', 'teamlead'] },
      { nl: 'De klassieke fout: het eerste antwoord accepteren. Het bruikbare komt na een pauze.', en: 'The typical failure: accepting the first answer. The useful one comes after a pause.', focus: 'first' },
      { nl: 'Stilte en doorvragen uit {t:MORE PIES}: zwijg even, en vraag dan één laag dieper.', en: 'Silence and Inquiry from {t:MORE PIES}: stay quiet, then ask one level deeper.', cue: { 'MORE PIES': 'pies' }, focus: 'pies' },
      { nl: 'Grove regel: geen enkel risico dat je verrast? Dan was nog niemand eerlijk.', en: 'A rough rule: no risk that surprises you? Then people haven’t been honest yet.', focus: 'rule' },
    ]),
    sc('s5', FA, 2, { nl: 'Premortem voor een MES', en: 'An MES premortem' }, [
      { nl: 'Twee maanden voor een MES-livegang: een premortem van {n:30} minuten met acht mensen.', en: 'Two months before an MES go-live: a {n:30}-minute premortem with eight people.', focus: ['case', 'calendar'] },
      { nl: 'Stap 1: “Het is september. De livegang is mislukt. Schrijf alleen, {n:5} minuten, op waarom.”', en: 'Step 1: “It’s September. The go-live failed. Write down why, alone, for {n:5} minutes.”', focus: ['st1', 'sheet'] },
      { nl: 'Stap 2, voorlezen: de scanners op lijn {n:2}, de nachtdienst niet getraind, alleen Ahmed kent de koppeling.', en: 'Step 2, read out: the scanners on line {n:2}, night shift untrained, only Ahmed knows the interface.', focus: ['st2', 'planner'] },
      { nl: 'Stap 3: groepeer ze en kies de drie ernstigste.', en: 'Step 3: group them and pick the three most serious.', focus: 'st3' },
      { nl: 'Stap 4: “Hoe weten we dat het niet gebeurt?” “Op kantoor getest, niet aan de lijn.” Zwak bewijs.', en: 'Step 4: “How do we know it won’t happen?” “Tested in the office, not on the line.” Weak evidence.', focus: 'st4' },
      { nl: 'Stap 5: volgende week een scannertest op lijn {n:2}, eigenaar de IT-lead. Ahmed krijgt een tweede persoon.', en: 'Step 5: a scanner test on line {n:2} next week, owner the IT lead. Ahmed gets a second person trained.', focus: ['st5', 'calendar'] },
    ]),
    sc('s6', JA, 4, { nl: 'Terugvertalen', en: 'Translating back' }, [
      { nl: '{t:Jargon}: de vaktaal van een vakgebied, precies voor insiders, ondoorzichtig voor de rest.', en: '{t:Jargon}: a field’s specialist language, precise for insiders, opaque for everyone else.', cue: { Jargon: 'jargon' }, focus: ['jargon', 'teamlead'] },
      { nl: 'Op zich geen probleem. Wel als er besluiten in vallen die niemand buiten het vak snapt.', en: 'Not a problem in itself, unless decisions get made in it that outsiders don’t understand.', focus: 'problem' },
      { nl: 'Jouw taak: terugvertalen naar doel, kosten, tijd en risico, voor de sponsor en de vloer.', en: 'Your job: translate back into goal, cost, time and risk, for the sponsor and the floor.', focus: ['four', 'sponsor'] },
    ]),
    sc('s7', JA, 4, { nl: 'Parafraseren, doorvragen', en: 'Paraphrase, inquire' }, [
      { nl: 'MORE PIES: een checklist voor {t:Actief luisteren|actief luisteren}, om te begrijpen, niet om te antwoorden.', en: 'MORE PIES: a checklist for {t:Active listening|active listening}, to understand, not to reply.', cue: { 'Actief luisteren': 'active' }, focus: 'active' },
      { nl: 'Acht letters. Hier doen de P en de I het meeste werk.', en: 'Eight letters. Here the P and the I do the most work.', focus: 'letters' },
      { nl: 'De P: {t:Parafraseren|parafraseren}, in eigen woorden. “Dus wat je zegt is… Klopt dat?”', en: 'The P: {t:Paraphrasing|paraphrasing}, in your own words. “So what you’re saying is… Right?”', cue: { Parafraseren: 'para' }, focus: 'para' },
      { nl: 'Experts verbeteren je meestal, en in die verbetering zit wat je leert.', en: 'Experts usually correct you, and the correction is where you learn.', focus: ['correct', 'teamlead'] },
      { nl: 'De I: {t:Doorvragen|doorvragen}. Wat betekent dat voor de datum, de kosten, het risico?', en: 'The I: {t:Inquiry|inquiry}. What does that mean for the date, the cost, the risk?', cue: { Doorvragen: 'inq' }, focus: 'inq' },
      { nl: 'Stilte helpt ook: wacht na de parafrase op de verbetering.', en: 'Silence helps too: after the paraphrase, wait for the correction.', focus: 'silence' },
    ]),
    sc('s8', JA, 4, { nl: 'Terugvertellen', en: 'Teach-back' }, [
      { nl: '{t:Terugvertellen} komt uit de zorg: de patiënt vertelt de instructies in eigen woorden terug.', en: '{t:Teach-back} comes from health care: the patient explains the instructions back in their own words.', cue: { Terugvertellen: 'tb' }, focus: 'tb' },
      { nl: 'Andersom: vertel zijn punt terug zoals aan de sponsor, en laat de expert het verbeteren.', en: 'The other way round: tell his point back as to the sponsor, and let the expert fix it.', focus: ['round', 'teamlead'] },
      { nl: 'Het resultaat: een zin voor de stuurgroep, zonder iemand verkeerd te citeren.', en: 'The result: a sentence for the steering meeting, without misquoting anyone.', focus: ['line', 'sheet'] },
      { nl: 'Klassieke fout: zo los vertalen dat de betekenis verandert. “Dus eigenlijk is het prima?”', en: 'A typical failure: translating so loosely the meaning changes. “So it’s basically fine?”', focus: 'loose' },
      { nl: 'Of de expert in jargon aan het bestuur laten presenteren. Of doen alsof je het volgt.', en: 'Or letting the expert present to the board in jargon. Or pretending to follow.', focus: 'fails' },
      { nl: 'Gaat een expert presenteren? Spreek eerst de ene zin af die de sponsor moet onthouden.', en: 'An expert about to present? First agree the one sentence the sponsor must remember.', focus: ['one', 'teamlead'] },
    ]),
    sc('s9', JA, 4, { nl: 'Een ERP-koppeling', en: 'An ERP interface' }, [
      { nl: 'Ontwerpoverleg MES: “De ERP-koppeling is batch, niet real-time: tot {n:15} minuten latency.”', en: 'MES design meeting: “The ERP interface is batch, not real-time: up to {n:15} minutes latency.”', focus: ['case2', 'teamlead'] },
      { nl: '“En geen idempotentie bij retries.” Jij parafraseert: orders komen tot {n:15} minuten te laat aan.', en: '“And no idempotency on retries.” You paraphrase: orders arrive up to {n:15} minutes late.', focus: ['idem', 'para2', 'jij'] },
      { nl: 'Het tweede deel vraag je eerlijk: wat betekent dat in gewone woorden, en wat is het gevolg?', en: 'The second part, you ask honestly: what does it mean in plain words, and what’s the consequence?', focus: ['ask', 'jij'] },
      { nl: '“Een bericht dat twee keer komt, kan een order verdubbelen.” Doorvragen: wat kost dat, hoe vaak?', en: '“A message sent twice can double an order.” Inquire: what would it cost, and how often?', focus: ['answer', 'teamlead'] },
      { nl: 'Terugvertellen: “Tot {n:15} minuten te laat, soms dubbel: we hebben een check nodig. Klopt dat?”', en: 'Teach-back: “Up to {n:15} minutes late, sometimes doubled: we need a check. Is that fair?”', focus: ['tbline', 'sheet'] },
      { nl: 'Hij past één woord aan. Die zin gaat naar de stuurgroep.', en: 'He adjusts one word. That sentence goes to the steering meeting.', focus: ['final', 'sponsor'] },
    ]),
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the cards it carries every
// point of the checklist above. No symbols the voice would read aloud: numbers
// stay plain, percent is said as a word, no quotes or parentheses.
// Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). New SAY rules in films/_kit/timeline.mjs for this
// film (no other film's spoken text changes): premortem as "pree-mortem",
// single point of failure as "singel pojnt of feeljer", beheersmaatregel
// (after "een"), barcodescanners as "barkoodskenners" (BAR-kood, not bar-KOO-de), nachtdienst split at the head, and the
// integration specialist's jargon, real-time, latency and retries, as Dutch
// IT people say them (riel-taim, lee-tensie, rie-traiz), and Harvard Business
// Review as "Harvard Biznis Rievjoe"; in English, idempotency as idem-potency
// (espeak-ng's English reads "AID-mpoatency"). Shared rules already
// cover MORE PIES (Mor pais), MES (letters), livegang (laif-gang), IT-lead
// (IT-lied), batch (betsj) and stuurgroep (stuur-groep). Jargon is said
// "sjargon", near the Dutch zj that espeak-ng cannot give (it reads "jar-gon"),
// only in this film's phrases, so pm.plan.method keeps its voice. Kept out of the Dutch
// narration because espeak-ng misreads them (they stay in the captions and on
// the cards): Gary (a Dutch g: the voice says "Klein"), the names Mitchell, Russo and Pennington (card only),
// vuistregel (vuistre-GEL: said "grove regel"), projectleiders (the second
// stress on PRO: the rule is said without them), managers (MAA-naa-ghers:
// said "aan de leiding"), integratiespecialist (said "de specialist"),
// ernstigste (stressed ern-STIG-ste: said "zwaarste"), checklist (tsje-KLIST:
// said "lijst"), teach-back
// (the Dutch voice says terugvertellen) and a sentence-initial "Eén" (read
// ee-een: said "Denk aan één"). The guard below runs on the text after the SAY
// rules, so a word a rule rewrites passes and a misread one fails the build.
const SAY = [
  [ // s1 two questions
    { nl: 'Kun je de inhoud niet beoordelen, dan doen twee vragen het meeste werk: waardoor zou dit mislukken? En: hoe weet je dat?',
      en: 'If you can\'t judge the content, two questions do the most work: what would make this fail? And: how do you know?' },
    { nl: 'De eerste vindt risico\'s. De tweede toetst de beweringen.',
      en: 'The first finds risks. The second checks the claims.' },
    { nl: 'Samen testen ze een plan zonder elk detail te snappen.',
      en: 'Together they test a plan without understanding every detail.' },
  ],
  [ // s2 the premortem
    { nl: 'Een {t:Premortem|premortem}: het team stelt zich voor dat het project al mislukt is. Iedereen schrijft op waarom, voordat iemand praat.',
      en: 'A {t:Premortem|premortem}: the team imagines the project has already failed. Each person writes down why, before anyone speaks.' },
    { nl: 'Klein beschreef hem in 2007, in Harvard Business Review.',
      en: 'Gary Klein described it in Harvard Business Review, in 2007.' },
    { nl: 'Hij haalt onderzoek uit 1989 aan. Volgens hem maakt een ingebeelde terugblik mensen {n:30} procent beter in de juiste redenen.',
      en: 'He cites 1989 research: by his account, imagined hindsight makes people {n:30} percent better at the right reasons.' },
    { nl: 'Het onderzoek telde zo\'n {n:30} procent meer redenen, niet hun kwaliteit, maar meer kandidaten wil je juist.',
      en: 'The study counted about {n:30} percent more reasons, not their quality, but more candidates is what you want.' },
    { nl: 'Eerst schrijven voorkomt dat de senior stem de toon zet.',
      en: 'Writing first stops the senior voice from setting the tone.' },
  ],
  [ // s3 one weak spot
    { nl: 'Let op een {t:Single point of failure|single point of failure}: één onderdeel, persoon of leverancier die alles stillegt als hij uitvalt.',
      en: 'Watch for a {t:Single point of failure|single point of failure}: one part, person or supplier that stops everything if it fails.' },
    { nl: 'Denk aan één server zonder back-up, één programmeur die de code kent, één kabel voor de hele fabriek.',
      en: 'One server with no backup, one programmer who knows the code, one cable feeding the whole factory.' },
    { nl: 'Vraag bij elk serieus risico naar een {t:Beheersmaatregel|beheersmaatregel}: wat maakt het minder waarschijnlijk of minder erg, en wie is eigenaar?',
      en: 'For each serious risk, ask for the {t:Mitigation|mitigation}: what makes it less likely or less bad, and who owns it?' },
    { nl: 'Een risico zonder een beheersmaatregel en een eigenaar is alleen een zorg.',
      en: 'A risk without a mitigation and an owner is just a worry.' },
  ],
  [ // s4 how do you know
    { nl: 'De tweede vraag vraagt om {t:Bewijs|bewijs}: iets wat je kunt zien, testen of controleren. Geen mening.',
      en: 'The second question asks for {t:Evidence|evidence}: something you can see, test or check. Not an opinion.' },
    { nl: 'Van zwak naar sterk: ik denk het. Het werkte eerder. We hebben het hier getest. Hier is het testrapport.',
      en: 'From weak to strong: I think so. It worked before. We tested it here. Here is the test report.' },
    { nl: 'Vraag rustig, over de bewering, niet de persoon: hoe weten we dat het netwerk de data aankan? Niet: weet je het zeker?',
      en: 'Ask calmly, about the claim, not the person: how do we know the network can carry the data? Not: are you sure?' },
    { nl: 'De klassieke fout: het eerste antwoord accepteren. Dat is het comfortabele; het bruikbare komt na een pauze.',
      en: 'The typical failure: accepting the first answer. That\'s the comfortable one; the useful one comes after a pause.' },
    { nl: 'Dat zijn stilte en doorvragen uit {t:MORE PIES}: zwijg even, vraag dan dieper. Als dat gebeurde, wat zien we eerst?',
      en: 'That is Silence and Inquiry from {t:MORE PIES}: stay quiet, then go deeper. If that happened, what would we see first?' },
    { nl: 'Een grove regel: geen enkel risico dat je verrast? Dan zijn mensen nog niet eerlijk geweest.',
      en: 'A rough rule many project leaders use: no risk that surprises you? Then people haven\'t been honest yet.' },
  ],
  [ // s5 an MES premortem
    { nl: 'Twee maanden voor de livegang van een MES: een premortem van {n:30} minuten, met acht mensen.',
      en: 'Two months before an MES go-live: a {n:30} minute premortem with eight people.' },
    { nl: 'Stap één: het is september, de livegang is mislukt. Schrijf alleen, {n:5} minuten, op waarom.',
      en: 'Step one: it\'s September, the go-live failed. Write down why, alone, for {n:5} minutes.' },
    { nl: 'Stap twee: voorlezen. De barcodescanners op lijn {n:2} maakten geen verbinding. De nachtdienst was niet getraind. Alleen Ahmed kent de koppeling.',
      en: 'Step two: read them out. The barcode scanners on line {n:2} didn\'t connect. The night shift wasn\'t trained. Only Ahmed knows the interface.' },
    { nl: 'Stap drie: groepeer ze en kies de drie zwaarste.',
      en: 'Step three: group them and pick the three most serious.' },
    { nl: 'Stap vier. Hoe weten we dat het niet gebeurt? De scanners zijn op kantoor getest, niet aan de lijn. Zwak bewijs.',
      en: 'Step four: how do we know it won\'t happen? The scanners were tested in the office, not on the line. Weak evidence.' },
    { nl: 'Stap vijf: volgende week een scannertest op lijn {n:2}, met de IT-lead als eigenaar. En Ahmed, de single point of failure, krijgt een tweede persoon.',
      en: 'Step five: a scanner test on line {n:2} next week, with the IT lead as owner. And Ahmed, the single point of failure, gets a second person trained.' },
  ],
  [ // s6 translating back
    { nl: '{t:Jargon} is de vaktaal van een vakgebied: precies voor insiders, en voor iedereen anders ondoorzichtig.',
      en: '{t:Jargon} is the specialist language of a field: precise for insiders, opaque for everyone else.' },
    { nl: 'Op zich geen probleem. Wel als er besluiten in vallen die niemand buiten het vak snapt.',
      en: 'Not a problem in itself. It is when decisions get made in it that nobody outside the field understands.' },
    { nl: 'Jouw taak: terugvertalen naar doel, kosten, tijd en risico, zodat de sponsor en de vloer het volgen.',
      en: 'Your job: translate back into goal, cost, time and risk, so the sponsor and the floor can follow.' },
  ],
  [ // s7 paraphrase, inquire
    { nl: 'MORE PIES is een lijst voor {t:Actief luisteren|actief luisteren}: luisteren om te begrijpen, niet om te antwoorden.',
      en: 'MORE PIES is a checklist for {t:Active listening|active listening}: to understand, not to reply.' },
    { nl: 'Acht letters. Twee doen hier het meest: de P en de I.',
      en: 'Eight letters. Two matter most here: the P and the I.' },
    { nl: 'De P: {t:Parafraseren|parafraseren}, in eigen woorden. Dus wat je zegt is, en dan gewone woorden. Klopt dat?',
      en: 'The P: {t:Paraphrasing|paraphrasing}, in your own words. So what you\'re saying is, then plain words. Have I got that right?' },
    { nl: 'Experts verbeteren je meestal, en in die verbetering zit wat je leert.',
      en: 'Experts usually correct you, and the correction is where you learn.' },
    { nl: 'De I: {t:Doorvragen|doorvragen}, één laag dieper, tot het gevolg. Wat betekent dat voor de datum? Voor de kosten? Voor het risico?',
      en: 'The I: {t:Inquiry|inquiry}, one level deeper, to the consequence. What does that mean for the date? For the cost? For the risk?' },
    { nl: 'Stilte helpt ook: wacht na de parafrase op de verbetering.',
      en: 'Silence helps too: after the paraphrase, wait for the correction.' },
  ],
  [ // s8 teach-back
    { nl: '{t:Terugvertellen|Terugvertellen} komt uit de zorg: de arts vraagt de patiënt de instructies in eigen woorden terug te vertellen.',
      en: '{t:Teach-back|Teach-back} comes from health care: the doctor asks the patient to explain the instructions back in their own words.' },
    { nl: 'Jij doet het andersom: vertel zijn punt terug als aan de sponsor, en laat hem het verbeteren.',
      en: 'Do it the other way round: tell his point back as to the sponsor, and let him fix it.' },
    { nl: 'Dan heb je een zin voor de stuurgroep, zonder iemand verkeerd te citeren.',
      en: 'Then you have a sentence for the steering meeting, without misquoting anyone.' },
    { nl: 'Klassieke fouten: zo los vertalen dat de betekenis verandert. Dus eigenlijk is het prima?',
      en: 'Typical failures: translating so loosely the meaning changes. So it\'s basically fine?' },
    { nl: 'Of de expert in jargon aan het bestuur laten presenteren. Of doen alsof je het volgt.',
      en: 'Or letting the expert present to the board in jargon. Or pretending to follow.' },
    { nl: 'Gaat een expert presenteren? Spreek eerst met hem de ene zin af die de sponsor moet onthouden, in gewone woorden.',
      en: 'An expert about to present? First agree with him the one sentence the sponsor must remember, in plain words.' },
  ],
  [ // s9 an ERP interface
    { nl: 'Ontwerpoverleg voor een MES. De specialist: de ERP-koppeling is batch, niet real-time, dus tot {n:15} minuten latency.',
      en: 'An MES design meeting. The specialist: the ERP interface is batch, not real-time, so up to {n:15} minutes latency.' },
    { nl: 'En geen idempotentie bij retries. Jij parafraseert het eerste deel: orders komen tot {n:15} minuten te laat op de vloer. Hij knikt.',
      en: 'And no idempotency on retries. You paraphrase the first part: orders reach the floor up to {n:15} minutes late. He nods.' },
    { nl: 'Het tweede deel vraag je eerlijk: wat betekent dat in gewone woorden, en wat is het gevolg?',
      en: 'The second part, you ask honestly: what does that mean in plain words, and what\'s the consequence?' },
    { nl: 'Antwoord: een bericht dat twee keer komt, kan een order verdubbelen. Jij vraagt door: wat kost dat, en hoe vaak?',
      en: 'Answer: a message sent twice can double an order. You inquire: what would that cost, and how often?' },
    { nl: 'Dan terugvertellen, als aan de sponsor: orders komen tot {n:15} minuten te laat, en als de verbinding hapert soms dubbel. Dus een check op dubbele orders. Klopt dat?',
      en: 'Then teach-back, as to the sponsor: orders arrive up to {n:15} minutes late, and doubled if the link hiccups. So, a check for doubles. Is that fair?' },
    { nl: 'Hij past één woord aan. Die zin gaat naar de stuurgroep.',
      en: 'He adjusts one word. That sentence goes to the steering meeting.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above); checked on the text
// after the SAY rules, so a rewritten word passes
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{t:([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(ernstigste|checklist|Gary|Business|Mitchell|Russo|Pennington|vuistregel|projectleiders?|managers?|integratiespecialist|teach-back|Eén)\b/i;
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
  if (total > 300) throw new Error(`film is ${total} s, over 300 (words per scene ${said.join(' ')}, all ${all}; durations ${spec.scenes.map((x) => x.dur).join(' ')})`);
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
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia,[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-big,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line{stroke-width:.7px}
.pm-mini .pm-dia,.pm-mini .pm-strike{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf weken, waarop de livegang over ongeveer twee maanden en de scannertest van volgende week verschijnen. Jij, de adviseur in petrol, staat aan de voorkant van de tafel. De teamleider aan het linkereind is de expert, in het laatste voorbeeld de integratiespecialist; de planner met een tablet achter de tafel is een teamlid, in het voorbeeld de IT-lead; de sponsor in pak staat aan het rechtereind. Op tafel een vel: de opgeschreven redenen van de premortem, later de ene gewone zin voor de stuurgroep. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: twee vragen; de premortem van Gary Klein met het onderzoek uit 1989; de single point of failure en de beheersmaatregel; de ladder van bewijs, het eerste antwoord en de grove regel; een premortem voor een MES in vijf stappen; jargon en terugvertalen naar doel, kosten, tijd en risico; de acht letters van MORE PIES, parafraseren en doorvragen; terugvertellen en de klassieke fouten; en een ERP-koppeling met tot 15 minuten vertraging en dubbele orders.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve weeks, where the go-live about two months away and next week\'s scanner test appear. You, the consultant in petrol, stand at the front of the table. The team lead at the left end is the expert, in the last example the integration specialist; the planner with a tablet behind the table is a team member, in the example the IT lead; the sponsor in a suit stands at the right end. On the table a sheet: the premortem\'s written reasons, later the one plain sentence for the steering meeting. At the right a panel with one card per scene, marked as example or diagram: two questions; Gary Klein\'s premortem with the 1989 study; the single point of failure and the mitigation; the ladder of evidence, the first answer and the rough rule; an MES premortem in five steps; jargon and translating back into goal, cost, time and risk; the eight letters of MORE PIES, paraphrasing and inquiry; teach-back and the typical failures; and an ERP interface with up to 15 minutes of delay and doubled orders.',
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

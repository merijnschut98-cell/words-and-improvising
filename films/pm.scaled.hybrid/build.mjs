// Dev tool, not shipped. Builds the explainer film "Stage-gate met sprints /
// Stage-gate with sprints" for the Projects course: pm.scaled.stagegate and
// pm.scaled.longlead (levels 1 and 2 of the topic Hybride: stage-gate plus
// agile, in Opschalen: SAFe en verder).
//
//   node films/pm.scaled.hybrid/build.mjs            build the page
//   node films/pm.scaled.hybrid/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.scaled.hybrid.html: one offline page with
// the anatomy kit, the stage script and the player inlined. A film that will
// be rendered to video (Merijn, 2026-11-12: render every reviewed pm film), so
// all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.scaled.hybrid, P2: hybrid in manufacturing; "gates above, sprints below,
// hardware lead times"). Storyboard drift: the plan's 90 s are about 290 s in
// nine scenes, because a lesson with a film no longer shows its worked example
// (v16 notes), so the film carries the teach text and the example of both
// lessons: stage-gate, the cost of change and Agile-Stage-Gate (s1 to s5), long
// lead times, backward planning and set-based design (s6 to s9). The
// storyboard's picture is the board on the back wall: gates as diamonds above,
// the stages below them and the sprints below the stages (s1 to s5); then a
// timeline to the SOP with the mould's lead time planned backwards to the design
// freeze, the sprints running on for the rest of the product (s6 to s9).
// pm.scaled.integration (level 3: integration points, A/B/C samples,
// hardware-in-the-loop) and pm.scaled.hybridgov (level 4: evidence-based gate
// criteria, Water-Scrum-Fall, rolling wave planning) have their own terms and
// are not served: two more lessons would not fit the 300 s cap with every teach
// block said.
//
// Consistent with the reviewed films: the hybrid of pm.plan.method (fixed
// milestones for the steering group, short rounds inside), the sprint of
// pm.agile.scrum (its cast.mjs, imported, not edited: two Developers as "the
// team"), the milestones of pm.plan.schedule (diamonds on a timeline).
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   stagegate teach 1: stage-gate, the classic way to develop new products,
//     worked out by Robert G. Cooper from the 1980s (s1 b1); stages: scoping,
//     business case, development, testing, launch (s1 b2); a gate between the
//     stages, a decision moment where management chooses on agreed deliverables
//     (s1 b3); the go/kill decision: continue, stop, hold or redo a stage (s1 b4)
//   stagegate teach 2: for hardware not old-fashioned but sensible; the cost of
//     change rises the further along you are (s2 b1); a drawing in CAD (the
//     drawing software) a few hours, a hardened steel mould tens of thousands of
//     euros (s2 b2); a change after delivery can mean a recall (s2 b3); long
//     lead times for tooling, CE marking, the European declaration that a
//     product meets the safety requirements (s2 b4)
//   stagegate teach 3: uncertainty within the stages, does the customer want
//     it, does the design work; agile helps (s3 b1); Cooper 2016 and, with
//     Sommer, 2018: agile sprints inside the stages, Agile-Stage-Gate (s3 b2);
//     sprints, daily short meetings, demos and retrospectives inside the stages,
//     the gates for the big investment decisions (s3 b3); positive first
//     results in a handful of companies, faster time to market, also struggles;
//     the evidence is limited (s3 b4)
//   stagegate teach 4: done after a hardware sprint: usually no shippable
//     product but something to test or show (s4 b1); a CAD model walked through
//     with a customer, a 3D-printed model, a prototype test result, control
//     software on a test rig (s4 b2); what did we learn these two weeks that we
//     did not know (s4 b3)
//   stagegate teach 5: for a Lean consultant a gate resembles a quality gate;
//     the pitfall, a paperwork check: are all documents there, not does the
//     product work (s4 b4); ask: what must be proven at the next gate, and which
//     sprint delivers the evidence; "the design file" means a formality (s4 b5)
//   stagegate example: pump maker, new pump housing, illustrative amounts, the
//     same change, a different flange size (s5 b1); in CAD 4 hours at 90 euros
//     = 360 euros (s5 b2); after the first prototype a new printed or milled
//     prototype, about 3,000 euros (s5 b3); after the hardened mould 35,000
//     euros and 6 weeks of delay (s5 b4); development 26 weeks, 2-week sprints,
//     26 / 2 = 13 sprints, 13 chances while a change costs hundreds instead of
//     tens of thousands (s5 b5)
//   longlead teach 1: a long-lead item drives the whole schedule (s6 b1): an
//     injection mould, casting, special motor, chip; 8 to 20 weeks for a mould
//     not unusual, always ask the supplier (s6 b2); SOP, start of production,
//     often fixed by a trade fair, a customer contract or a season (s6 b3)
//   longlead teach 2: backward planning from the SOP: minus validation, trial
//     runs and corrections, building the tool, ordering (s6 b4); what is left
//     is the last moment to fix the design: the design freeze; then changes go
//     through a formal procedure, engineering change (s6 b5)
//   longlead teach 3: agile clashes with hardware: sprints learn and adjust,
//     long-lead items need early decisions (s7 b1); not everything early but a
//     distinction: long-lead parts early, the rest flexible; interfaces early,
//     mounting points and connections, so the inside of a module can change
//     (s7 b2)
//   longlead teach 4: set-based design, a few options open, eliminate with
//     enough knowledge, instead of one early design repaired again and again
//     (s7 b3); research on Toyota in the 1990s, also named in SAFe (s7 b4);
//     cheap aluminium trial moulds (soft tooling) for two variants, then the
//     hardened steel mould for the winner (s7 b5)
//   longlead teach 5: purchasing not at the sprint planning or PI Planning (s8
//     b1); hears about a mould when the design is "almost done", the lead time
//     already too long (s8 b2); long-lead items as fixed milestones on the
//     planning board, invite purchasing (s8 b3); ask: which part has the
//     longest lead time, in which week must its design be fixed (s8 b4)
//   longlead example: e-bikes, SOP in week 40, the battery housing injection
//     moulded (s9 b1); validation 4 weeks, start by week 36 (s9 b2); trial runs
//     and mould corrections 3 weeks, mould ready week 33 (s9 b3); mould build 14
//     weeks by the quote, start week 19; ordering and approval 1 week, design
//     freeze by week 18 (s9 b4); check 40 - 4 - 3 - 14 - 1 = 18; until week 18
//     to improve the battery housing, the rest of the bike flexible longer (s9
//     b5)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts checked (2026-11-13), credited only as the lessons do: Robert G.
// Cooper developed Stage-Gate from his research in the 1980s (the lesson: "vanaf
// de jaren tachtig"; his best-known article, "Stage-Gate Systems: A New Tool for
// Managing New Products", Business Horizons, 1990, is not named by the lesson,
// nor by the film). Agile-Stage-Gate: R. G. Cooper, "Agile-Stage-Gate Hybrids:
// The Next Stage for Product Development", Research-Technology Management 59(1),
// 2016, and R. G. Cooper and A. F. Sommer, "Agile-Stage-Gate for
// Manufacturers", Research-Technology Management 61(2), 2018: sprints, daily
// stand-ups, demos and retrospectives inside the stages, gates kept for the
// investment decisions, early results from a handful of firms (faster to
// market among them) with difficulties, as the lesson says. Cooper and Sommer
// also wrote on the hybrid in 2016 (Journal of Product Innovation Management);
// the lesson credits the 2016 article to Cooper and 2018 to both, and so does
// the film. Set-based concurrent engineering: Ward, Liker, Cristiano and Sobek,
// "The Second Toyota Paradox" (Sloan Management Review, 1995) and Sobek, Ward
// and Liker (1999); Set-Based Design is a SAFe principle. The amounts, lead
// times and weeks are the lessons' own illustrations.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// project room with a whiteboard on the back wall that carries the plan as
// shapes only (no text there, so nothing on the stage is under 22 units). On
// the table a two-part steel mould and the pump housing prototype. People: you
// (the consultant, at the board), the sponsor as the gatekeeper, two Developers
// as the team (the Scrum film's cast) and, in front, purchasing (the pm
// world's planner figure with a tablet). A panel at the right, in stage space,
// carries one card per scene, labelled "schema" or "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the props
// and each layer of the board.
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
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const SG = 'pm.scaled.stagegate';
const LL = 'pm.scaled.longlead';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(SG, ['de klassieke manier om nieuwe producten te ontwikkelen, uitgewerkt door Robert G. Cooper vanaf de jaren tachtig', 'verkennen, businesscase, ontwikkelen, testen en lanceren',
  'een beslismoment waar het management op basis van afgesproken resultaten kiest', 'go/kill-beslissing: doorgaan, stoppen, aanhouden of een fase overdoen',
  'Voor hardware is dat niet ouderwets maar verstandig', 'De kosten van verandering (cost of change) stijgen naarmate je verder bent', 'kost een paar uur',
  'een geharde stalen matrijs aanpassen kan tienduizenden euro’s kosten', 'een wijziging na levering kan een terugroepactie betekenen', 'lange levertijden voor gereedschap',
  'CE-markering (de Europese verklaring dat een product aan de veiligheidseisen voldoet)', 'wil de klant dit echt, werkt het ontwerp? Daar helpt agile',
  'Cooper beschreef in 2016 en, met Sommer, in 2018 hoe bedrijven agile sprints binnen de fases van stage-gate plaatsen: Agile-Stage-Gate',
  'De sprints, dagelijkse korte overleggen, demo’s en retrospectives zitten in de fases; de gates blijven voor de grote investeringsbeslissingen',
  'Cooper meldt positieve eerste resultaten in een handvol bedrijven, zoals een snellere marktintroductie (time to market), maar ook worstelingen. Het bewijs is nog beperkt',
  'Meestal geen leverbaar product, maar iets wat je kunt testen of laten zien', 'een CAD-model dat je met een klant doorloopt, een 3D-geprint model, een testresultaat van een prototype, een stuk besturingssoftware op een testopstelling',
  'wat hebben we deze twee weken geleerd dat we eerst niet wisten?', 'een gate lijkt op een kwaliteitspoort, met als valkuil dat hij een papierencontrole wordt',
  'niet of het product werkt', '“Wat moet er bij de volgende gate bewezen zijn, en welke sprint levert dat bewijs?”', 'is de gate een formaliteit geworden',
  'industriële pompen ontwikkelt een nieuw pomphuis', 'illustratieve bedragen', 'een andere flensmaat', '4 uur engineering à 90 euro = 360 euro', 'gefreesd prototype, zo’n 3.000 euro',
  'matrijsaanpassing van 35.000 euro en 6 weken vertraging', 'De fase ontwikkelen duurt 26 weken', '26 / 2 = 13 sprints, 13 kansen om fouten te vinden', 'honderden euro’s kost in plaats van tienduizenden']);
says(LL, ['zo’n lange levertijd dat het de hele planning bepaalt: een spuitgietmatrijs, een gietstuk, een speciale motor, een chip', 'Levertijden van 8 tot 20 weken voor een matrijs zijn niet ongewoon, maar vraag het altijd aan de leverancier',
  'SOP, start of production', 'een beurs, een klantcontract of een seizoen', 'je rekent vanaf de SOP terug. SOP min validatie, min proefspuiten en correcties, min de bouw van het gereedschap, min bestellen',
  'het laatste moment om het ontwerp van dat onderdeel vast te leggen', 'design freeze', 'formele wijzigingsprocedure (engineering change)',
  'Sprints willen leren en bijsturen; long-lead items vragen vroege beslissingen', 'De oplossing is niet alles vroeg vastleggen, maar onderscheid maken',
  'Beslis vroeg over de onderdelen met lange levertijd, en houd de rest flexibel', 'Leg de interfaces vroeg vast, zoals bevestigingspunten en aansluitingen, zodat de binnenkant van een module later nog kan veranderen',
  'set-based design, bekend uit onderzoek naar Toyota in de jaren negentig en ook genoemd in SAFe', 'valt pas af als er genoeg kennis is, in plaats van vroeg één ontwerp te kiezen en dat steeds te repareren',
  'goedkope proefmatrijzen in aluminium (soft tooling) voor twee varianten, pas daarna de geharde stalen matrijs voor de winnaar',
  'inkoop zit niet bij de sprintplanning of PI Planning', 'als het ontwerp “bijna klaar” is. Dan is de levertijd al te lang', 'Zet long-lead items als vaste mijlpalen op het planningsbord en nodig inkoop uit',
  '“Welk onderdeel heeft de langste levertijd, en in welke week moet het ontwerp daarvan uiterlijk vast?”',
  'elektrische fietsen wil in week 40 serieproductie starten (SOP). Het accuhuis wordt spuitgegoten', 'Validatie van de eerste serie: 4 weken, dus start uiterlijk week 36',
  'Proefspuiten en matrijscorrecties: 3 weken, dus matrijs klaar in week 33', 'Matrijsbouw volgens offerte: 14 weken, dus start in week 19',
  'Bestellen en goedkeuren: 1 week, dus design freeze accuhuis uiterlijk week 18', '40 − 4 − 3 − 14 − 1 = 18', 'terwijl de rest van de fiets langer flexibel blijft']);
says(SG, ['worked out by Robert G. Cooper from the 1980s onwards', 'Cooper described in 2016 and, with Sommer, in 2018', 'faster time to market, but also struggles. The evidence is still limited', '4 hours of engineering at 90 euros = 360 euros'], 'en');
says(LL, ['also named in SAFe', 'aluminium trial moulds (soft tooling)', 'design freeze of the battery housing by week 18', 'purchasing is not at the sprint planning or PI Planning'], 'en');
assert(lessons.nl.get(SG).terms.map((t) => t.term).join() === 'Stage-gate,Gate,Go/kill-beslissing,Kosten van verandering,Agile-Stage-Gate', 'the five terms of stagegate');
assert(lessons.nl.get(LL).terms.map((t) => t.term).join() === 'Long-lead item,SOP,Terugplannen,Design freeze,Set-based design', 'the five terms of longlead');
for (const id of [SG, LL]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.scaled.hybrid', `no other film is wired to ${id}`);
// the pump housing: the same change at three moments, and the sprints in development
const COST = [4 * 90, 3000, 35000];
assert(COST[0] === 360, 'in CAD: 4 hours at 90 euros = 360 euros');
const DEV = 26;
const SPRINT = 2;
assert(DEV / SPRINT === 13, '26 weeks of development in 2-week sprints: 13 sprints');
// the e-bike: backward from the SOP in week 40
const SOP = 40;
const STEPS = [['validation', 4], ['trial', 3], ['build', 14], ['order', 1]];
const STARTS = [];
STEPS.reduce((wk, [, d]) => { STARTS.push(wk - d); return wk - d; }, SOP);
assert(STARTS.join() === '36,33,19,18', 'backward from week 40: 36, 33, 19, 18');
const FREEZE = STARTS[3];
assert(FREEZE === 18 && SOP - 4 - 3 - 14 - 1 === 18, '40 - 4 - 3 - 14 - 1 = 18');
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

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
const r1 = (v) => Math.round(v * 10) / 10;

// the plan on the back wall, as shapes: each layer its own cue group, drawn by
// stage.js in the board's face plane (u = x, v = -z)
const BOARD = w.board({ x0: 52, x1: 198, z0: 100, z1: 206 });
const BA = BOARD.area;
const LAYERS = ['bGates', 'bStages', 'bSprints', 'bCost', 'bPlan', 'bSop', 'bFreeze', 'bMiles', 'bVariants'];
const boardLayers = `<g transform="${BOARD.face}">${LAYERS.map((c) => cueG(c, g(c, ''))).join('')}</g>`;
// the board's drawing area in face units
const AREA = { u0: r1(BA.x0 + 6), u1: r1(BA.x1 - 6), v0: r1(-BA.z1 + 6), v1: r1(-BA.z0 - 6) };
const TABLE = { x: 96, y: 116, w: 150, d: 70, h: 74 };
const TZ = TABLE.h;
// who stands where (world cm): you at the board, the sponsor at the far end of
// the table, two Developers (the team), purchasing in front
const SPOT = {
  d1: { x: 216, y: 84, along: 'x', look: 'dev' },
  d2: { x: 44, y: 206, along: 'y', look: 'dev2' },
};
const fig = (r) => scrumPerson(w, k, G, P, { ...SPOT[r], key: 'team' });
// the steel mould (two halves with a parting line) and the pump housing prototype on the table
const MOULD = { x: 184, y: 120, w: 38, d: 30 };
const mould = w.box({ ...MOULD, r: 1 }, TZ, TZ + 13, { tone: 'lo' }, { steps: 2, bevel: 0.4 })
  + w.box({ ...MOULD, r: 1 }, TZ + 14, TZ + 27, { tone: 'lo' }, { steps: 2, bevel: 0.4 })
  + w.post(MOULD.x + 8, MOULD.y + 8, 2, TZ + 27, TZ + 31, { tone: 'mid' }, 10)
  + w.post(MOULD.x + 32, MOULD.y + 24, 2, TZ + 27, TZ + 31, { tone: 'mid' }, 10);
const proto = w.post(132, 150, 16, TZ, TZ + 4, { tone: 'mid' }, 28)
  + w.post(132, 150, 11, TZ + 4, TZ + 22, { tone: 'hi' }, 28)
  + w.post(132, 150, 15, TZ + 22, TZ + 26, { tone: 'mid' }, 28);
const world = [
  w.room(ROOM),
  w.clock(246, 180, 11),
  cueG('board', BOARD.svg + boardLayers),
  w.person({ x: 26, y: 50, role: 'jij', along: 'x', reach: [56, 6, 150] }),
  fig('d1'),
  w.chair({ x: 140, y: 102, back: -1 }),
  w.table(TABLE),
  cueG('mould', mould),
  cueG('proto', proto),
  w.laptop({ x: 214, y: 168, z: TZ, toward: 1 }),
  w.stack({ x: 104, y: 166, z: TZ, n: 3 }),
  w.cup(232, 124, TZ),
  w.person({ x: 272, y: 152, role: 'sponsor', along: 'y' }),
  fig('d2'),
  w.person({ x: 150, y: 236, role: 'planner', along: 'x' }),
].join('');
for (const r of ['jij', 'sponsor', 'team', 'planner', 'board', 'mould', 'proto', ...LAYERS]) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['sg', 'phases', 'gate', 'gokill',
  'coc', 'cad', 'recall', 'lead',
  'doubt', 'asg', 'events', 'evidence',
  'done', 'done4', 'learned', 'paper', 'ask',
  'pump', 'c1', 'c2', 'c3', 'c13',
  'lli', 'lliex', 'sop', 'back', 'freeze',
  'clash', 'split', 'sbd', 'toyota', 'soft',
  'buyer', 'late', 'miles', 'ask2',
  'bike', 'w1', 'w2', 'w3', 'check'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.agile.scrum): the same points, fewer bytes; each rewrite is read back.
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
const BOARD_AT = w.at([(BA.x0 + BA.x1) / 2, 0, (BA.z0 + BA.z1) / 2]).map(r1);
const BCAM = (s) => [BOARD_AT[0], BOARD_AT[1] + 30, s];
const TABLE_AT = w.at([170, 150, TZ]).map(r1);
const TCAM = (s) => [TABLE_AT[0], TABLE_AT[1], s];
const BUYER_AT = w.at([150, 236, 150]).map(r1);
const CAM = [
  { from: [160, 205, 1], to: BCAM(1.1) },
  { from: TCAM(1.02), to: TCAM(1.12) },
  { from: BCAM(1.04), to: BCAM(1.14) },
  { from: [160, 205, 1], to: TCAM(1.08) },
  { from: TCAM(1.04), to: BCAM(1.08) },
  { from: [160, 205, 1], to: BCAM(1.12) },
  { from: BCAM(1.06), to: TCAM(1.08) },
  { from: [BUYER_AT[0], BUYER_AT[1] + 30, 1.02], to: BCAM(1.08) },
  { from: BCAM(1.06), to: [160, 205, 1] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, AREA, SOP, STEPS: STEPS.map(([, d]) => d), STARTS, FREEZE, DEV, SPRINT };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.scaled.hybrid',
  title: { nl: 'Stage-gate met sprints', en: 'Stage-gate with sprints' },
  lessons: [SG, LL],
  strictFocus: true,
  scenes: [
    sc('s1', SG, 1, { nl: 'Fases en gates', en: 'Stages and gates' }, [
      { nl: '{t:Stage-gate|Stage-gate}: nieuwe producten in fases, uitgewerkt door Robert G. Cooper.', en: '{t:Stage-gate|Stage-gate}: new products in stages, worked out by Robert G. Cooper.', cue: { 'Stage-gate': 'sg' }, focus: ['sg', 'bStages'] },
      { nl: 'Het werk loopt in fases: verkennen, businesscase, ontwikkelen, testen en lanceren.', en: 'The work runs in stages: scoping, business case, development, testing and launch.', focus: ['phases', 'bStages'] },
      { nl: 'Tussen de fases een {t:Gate|gate}: een beslismoment op afgesproken resultaten.', en: 'Between the stages a {t:Gate|gate}: a decision on agreed deliverables.', cue: { Gate: 'gate' }, focus: ['gate', 'bGates', 'sponsor'] },
      { nl: 'De {t:Go/kill-beslissing|go/kill-beslissing}: doorgaan, stoppen, aanhouden of overdoen.', en: 'The {t:Go/kill decision|go/kill decision}: continue, stop, hold or redo a stage.', cue: { 'Go/kill-beslissing': 'gokill' }, focus: ['gokill', 'sponsor'] },
    ]),
    sc('s2', SG, 1, { nl: 'Wijzigen wordt duurder', en: 'Change gets dearer' }, [
      { nl: '{t:Kosten van verandering|Kosten van verandering}: hoe verder je bent, hoe duurder.', en: '{t:Cost of change|Cost of change}: the further along you are, the dearer a change.', cue: { 'Kosten van verandering': 'coc' }, focus: ['coc', 'bCost'] },
      { nl: 'Een tekening in CAD: een paar uur. Een geharde stalen matrijs: tienduizenden euro’s.', en: 'A drawing in CAD: a few hours. A hardened steel mould: tens of thousands of euros.', focus: ['cad', 'mould'] },
      { nl: 'En een wijziging na levering kan een terugroepactie betekenen.', en: 'And a change after delivery can mean a recall of the product.', focus: ['recall', 'bCost'] },
      { nl: 'Plus lange levertijden voor gereedschap, en eisen als de CE-markering.', en: 'Plus long lead times for tooling, and requirements like CE marking.', focus: ['lead', 'mould'] },
    ]),
    sc('s3', SG, 1, { nl: 'Sprints binnen de fases', en: 'Sprints inside the stages' }, [
      { nl: 'Binnen de fases veel onzekerheid: wil de klant dit, werkt het ontwerp?', en: 'Within the stages, much uncertainty: does the customer want it, does the design work?', focus: ['doubt', 'bStages'] },
      { nl: '{t:Agile-Stage-Gate|Agile-Stage-Gate}: Cooper 2016, met Sommer 2018. Sprints binnen de fases.', en: '{t:Agile-Stage-Gate|Agile-Stage-Gate}: Cooper 2016, with Sommer 2018. Sprints inside the stages.', cue: { 'Agile-Stage-Gate': 'asg' }, focus: ['asg', 'bSprints'] },
      { nl: 'Dagelijks kort overleg, demo’s, retrospectives in de fases; gates voor grote investeringen.', en: 'Daily short meetings, demos, retrospectives in the stages; gates for big investments.', focus: ['events', 'bSprints', 'bGates', 'team'] },
      { nl: 'Een handvol bedrijven: sneller op de markt, maar ook worstelingen. Het bewijs is beperkt.', en: 'A handful of firms: faster to market, but also struggles. The evidence is limited.', focus: 'evidence' },
    ]),
    sc('s4', SG, 1, { nl: 'Af na een hardwaresprint', en: 'Done after a hardware sprint' }, [
      { nl: 'Af na een hardwaresprint: iets om te testen of te laten zien.', en: 'Done after a hardware sprint: something you can test or show.', focus: ['done', 'proto'] },
      { nl: 'Een CAD-model met de klant, een 3D-print, een prototypetest, software op een testopstelling.', en: 'A CAD model with a customer, 3D print, prototype test, software on a test rig.', focus: ['done4', 'proto', 'team'] },
      { nl: 'De vraag: wat hebben we deze twee weken geleerd?', en: 'The question: what did we learn these two weeks?', focus: ['learned', 'bSprints'] },
      { nl: 'Lean-blik: een gate lijkt op een kwaliteitspoort. Valkuil: een papierencontrole.', en: 'Lean view: a gate is like a quality gate. Pitfall: a paperwork check.', focus: ['paper', 'bGates'] },
      { nl: 'Vraag: wat moet er bij de volgende gate bewezen zijn, en welke sprint levert dat?', en: 'Ask: what must be proven at the next gate, and which sprint delivers it?', focus: ['ask', 'jij'] },
    ]),
    sc('s5', SG, 1, { nl: 'Voorbeeld: het pomphuis', en: 'Example: the pump housing' }, [
      { nl: 'Een pompenmaker, een nieuw pomphuis. Steeds dezelfde wijziging: een andere flensmaat.', en: 'A pump maker, a new pump housing. The same change each time: a different flange size.', focus: ['pump', 'proto'] },
      { nl: 'In CAD: {n:4} uur à {n:90} euro = {n:360} euro.', en: 'In CAD: {n:4} hours at {n:90} euros = {n:360} euros.', focus: ['c1', 'bCost'] },
      { nl: 'Na het eerste prototype: een nieuw prototype, zo’n {n:3000} euro.', en: 'After the first prototype: a new prototype, about {n:3000} euros.', focus: ['c2', 'proto'] },
      { nl: 'Na de geharde matrijs: {n:35000} euro en {n:6} weken vertraging.', en: 'After the hardened mould: {n:35000} euros and {n:6} weeks of delay.', focus: ['c3', 'mould'] },
      { nl: 'Ontwikkelen duurt {n:26} weken: in sprints van {n:2} weken {n:13} kansen om fouten vroeg te vinden.', en: 'Development takes {n:26} weeks: in {n:2}-week sprints, {n:13} chances to find mistakes early.', focus: ['c13', 'bSprints'] },
    ]),
    sc('s6', LL, 2, { nl: 'Terugplannen vanaf de SOP', en: 'Planning back from the SOP' }, [
      { nl: '{t:Long-lead item|Long-lead item}: zo’n lange levertijd dat het de planning bepaalt.', en: '{t:Long-lead item|Long-lead item}: a lead time so long it drives the schedule.', cue: { 'Long-lead item': 'lli' }, focus: ['lli', 'mould'] },
      { nl: 'Matrijs, gietstuk, speciale motor, chip. Een matrijs: {n:8} tot {n:20} weken. Vraag de leverancier.', en: 'Mould, casting, special motor, chip. A mould: {n:8} to {n:20} weeks. Ask the supplier.', focus: ['lliex', 'bPlan'] },
      { nl: '{t:SOP|SOP}: start of production. Vaak vast door een beurs, een contract of een seizoen.', en: '{t:SOP|SOP}: start of production. Often fixed by a fair, a contract or a season.', cue: { SOP: 'sop' }, focus: ['sop', 'bSop'] },
      { nl: '{t:Terugplannen|Terugplannen}: SOP min validatie, proefspuiten, matrijsbouw, bestellen.', en: '{t:Backward planning|Backward planning}: SOP minus validation, trial runs, tool build, ordering.', cue: { Terugplannen: 'back' }, focus: ['back', 'bPlan'] },
      { nl: 'Wat overblijft: de {t:Design freeze|design freeze}. Daarna lopen wijzigingen via een engineering change.', en: 'What is left: the {t:Design freeze|design freeze}. After it, changes go through an engineering change.', cue: { 'Design freeze': 'freeze' }, focus: ['freeze', 'bFreeze'] },
    ]),
    sc('s7', LL, 2, { nl: 'Vroeg vast, de rest later', en: 'Fixed early, the rest later' }, [
      { nl: 'Sprints willen leren; long-lead items vragen vroege beslissingen.', en: 'Sprints want to learn; long-lead items need early decisions.', focus: ['clash', 'bPlan', 'bSprints'] },
      { nl: 'Long-lead vroeg, de rest flexibel. Interfaces vroeg vast, de binnenkant kan later.', en: 'Long-lead early, the rest flexible. Interfaces fixed early, the inside can change later.', focus: ['split', 'bSprints'] },
      { nl: '{t:Set-based design|Set-based design}: een paar opties open, pas afvallen bij genoeg kennis.', en: '{t:Set-based design|Set-based design}: a few options open, dropped only with enough knowledge.', cue: { 'Set-based design': 'sbd' }, focus: ['sbd', 'bVariants'] },
      { nl: 'Bekend uit onderzoek naar Toyota, jaren negentig; ook genoemd in SAFe.', en: 'Known from research on Toyota in the 1990s; also named in SAFe.', focus: 'toyota' },
      { nl: 'Eerst aluminium proefmatrijzen voor twee varianten, dan de stalen matrijs voor de winnaar.', en: 'First aluminium trial moulds for two variants, then the steel mould for the winner.', focus: ['soft', 'bVariants', 'mould'] },
    ]),
    sc('s8', LL, 2, { nl: 'Inkoop aan tafel', en: 'Purchasing at the table' }, [
      { nl: 'Vaak zit inkoop niet bij de sprintplanning of de PI Planning.', en: 'Often purchasing is not at the sprint planning or the PI Planning.', focus: ['buyer', 'planner'] },
      { nl: 'Inkoop hoort pas van de matrijs bij “bijna klaar”. Dan is de levertijd al te lang.', en: 'Purchasing hears of the mould at “almost done”. By then the lead time is too long.', focus: ['late', 'mould', 'planner'] },
      { nl: 'Zet long-lead items als vaste mijlpalen op het planningsbord, en nodig inkoop uit.', en: 'Put long-lead items on the planning board as fixed milestones, and invite purchasing.', focus: ['miles', 'bMiles', 'planner'] },
      { nl: 'Vraag: welk onderdeel heeft de langste levertijd, en wanneer moet het ontwerp vast?', en: 'Ask: which part has the longest lead time, and when must its design be fixed?', focus: ['ask2', 'jij'] },
    ]),
    sc('s9', LL, 2, { nl: 'Voorbeeld: de e-bike', en: 'Example: the e-bike' }, [
      { nl: 'Elektrische fietsen: SOP in week {n:40}. Het accuhuis wordt spuitgegoten.', en: 'Electric bikes: SOP in week {n:40}. The battery housing is injection moulded.', focus: ['bike', 'bSop'] },
      { nl: 'Validatie {n:4} weken: start uiterlijk week {n:36}.', en: 'Validation {n:4} weeks: start by week {n:36}.', focus: ['w1', 'bPlan'] },
      { nl: 'Proefspuiten en correcties {n:3} weken: matrijs klaar in week {n:33}.', en: 'Trial runs and corrections {n:3} weeks: mould ready in week {n:33}.', focus: ['w2', 'bPlan'] },
      { nl: 'Matrijsbouw {n:14} weken: start week {n:19}. Bestellen {n:1} week: freeze in week {n:18}.', en: 'Mould build {n:14} weeks: start week {n:19}. Ordering {n:1} week: freeze by week {n:18}.', focus: ['w3', 'bPlan', 'bFreeze'] },
      { nl: 'Controle: {n:40} − {n:4} − {n:3} − {n:14} − {n:1} = {n:18}. De rest van de fiets blijft langer flexibel.', en: 'Check: {n:40} − {n:4} − {n:3} − {n:14} − {n:1} = {n:18}. The rest of the bike stays flexible longer.', focus: ['check', 'bSprints'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons'
// teach text and worked examples, so every point of the checklist above is
// said here or shown on the card. No symbol the voice would read aloud, no
// spoken parenthesis or quote; quoted sentences are introduced in words.
// Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-13). Read as written: matrijs, CAD (letters, as the
// floor often says it), CE-markering, terugroepactie, pomphuis, accuhuis,
// spuitgegoten, proefspuiten, matrijscorrecties, proefmatrijzen, serieproductie,
// sprintplanning, PI Planning (letters), planningsbord, Sommer, demo's,
// marktintroductie, start of production. New SAY rules in films/_kit/timeline.mjs
// (tested; recomputed for every film: no other film's spoken text changes):
// stage-gate and gate as "steetsj-geet" and "geet" (espeak-ng reads the Dutch
// "staa-zje-GAA-te"), go/kill without "slash", Cooper as "Koeper", long-lead
// item as "long-lied aitem", SOP as letters, design freeze as "di-zain friez",
// set-based design as "set-beesd di-zain", SAFe as "Seef" and matrijsbouw split
// at the head; Toyota through pm.land.training's rule, agile through
// pm.plan.method's, business case through pm.portfolio.benefits', soft tooling
// through the robot film's tooling rule and Lean-consultant through
// pm.run.conflict's. In English, go/kill without "slash" and SOP as letters.
// Said around because espeak-ng misreads them (they stay in the captions and
// on the cards): retrospectives (said "terugblikken", as pm.plan.method
// avoids it), management (said "de leiding"), time to market (the lesson's own
// "snellere marktintroductie"), flensmaat (stressed on -maat: "maat van de
// flens"), engineering change (said "een formele procedure"), "à" (said "tegen
// ... per uur"), businesscase as one word (said "business case", the existing
// rule) and a sentence that starts with "Eén". Years and numbers in words.
const SAY = [
  [ // s1 stages and gates
    { nl: 'Veel fabrikanten ontwikkelen nieuwe producten met {t:Stage-gate|stage-gate}, uitgewerkt door Robert Cooper vanaf de jaren tachtig.',
      en: 'Many manufacturers develop products with {t:Stage-gate|stage-gate}, worked out by Robert Cooper from the nineteen eighties.' },
    { nl: 'Het werk loopt in fases: verkennen, de business case, ontwikkelen, testen en lanceren.',
      en: 'The work runs in stages: scoping, the business case, development, testing and launch.' },
    { nl: 'Tussen twee fases zit een {t:Gate|gate}: een beslismoment, waar de leiding kiest op basis van afgesproken resultaten.',
      en: 'Between two stages sits a {t:Gate|gate}: a decision moment, where management chooses on agreed deliverables.' },
    { nl: 'Dat heet een {t:Go/kill-beslissing|go/kill-beslissing}: doorgaan, stoppen, aanhouden, of een fase overdoen.',
      en: 'That is a {t:Go/kill decision|go/kill decision}: continue, stop, hold, or redo a stage.' },
  ],
  [ // s2 the cost of change
    { nl: 'Voor hardware is dat niet ouderwets, maar verstandig. De {t:Kosten van verandering|kosten van verandering} stijgen naarmate je verder bent.',
      en: 'For hardware that is sensible, not old-fashioned. The {t:Cost of change|cost of change} rises the further along you are.' },
    { nl: 'Een tekening in CAD aanpassen kost een paar uur. Een geharde stalen matrijs aanpassen kan tienduizenden euro\'s kosten.',
      en: 'Changing a CAD drawing takes a few hours; changing a hardened steel mould can cost tens of thousands of euros.' },
    { nl: 'En een wijziging na levering kan een terugroepactie betekenen.',
      en: 'And a change after delivery can mean a recall.' },
    { nl: 'Daarbij komen lange levertijden voor gereedschap, en eisen als de CE-markering: de Europese verklaring dat een product aan de veiligheidseisen voldoet.',
      en: 'On top come long lead times for tooling, and requirements like CE marking: the European declaration that a product meets safety requirements.' },
  ],
  [ // s3 Agile-Stage-Gate
    { nl: 'Toch is er binnen de fases veel onzekerheid: wil de klant dit echt, werkt het ontwerp? Daar helpt agile.',
      en: 'Still, the stages hold much uncertainty: does the customer want this, does the design work? That is where agile helps.' },
    { nl: 'Cooper beschreef in tweeduizend zestien, en met Sommer in tweeduizend achttien, sprints binnen de fases: {t:Agile-Stage-Gate|Agile-Stage-Gate}.',
      en: 'Cooper described in 2016, and with Sommer in 2018, sprints inside the stages: {t:Agile-Stage-Gate|Agile-Stage-Gate}.' },
    { nl: 'Sprints, korte dagelijkse overleggen, demo\'s en terugblikken zitten in de fases. De gates blijven voor de grote investeringen.',
      en: 'Sprints, short daily meetings, demos and retrospectives sit inside the stages; the gates stay for big investment decisions.' },
    { nl: 'Cooper meldt goede eerste resultaten in een handvol bedrijven, zoals een snellere marktintroductie, maar ook worstelingen. Het bewijs is nog beperkt.',
      en: 'Cooper reports good first results in a handful of companies, like faster time to market, but also struggles; the evidence is still limited.' },
  ],
  [ // s4 done after a hardware sprint; the paper gate
    { nl: 'Wat is af na een hardwaresprint? Meestal geen leverbaar product, maar iets om te testen of te laten zien.',
      en: 'What is done after a hardware sprint? Rarely a shippable product; usually something to test or show.' },
    { nl: 'Een CAD-model dat je met een klant doorloopt, een 3D-geprint model, een test van een prototype, of besturingssoftware op een testopstelling.',
      en: 'A CAD model you walk through with a customer, a 3D-printed model, a prototype test, or control software on a test rig.' },
    { nl: 'De vraag blijft: wat hebben we deze twee weken geleerd?',
      en: 'The question stays: what did we learn these two weeks?' },
    { nl: 'Voor een Lean-consultant: een gate lijkt op een kwaliteitspoort; de valkuil is een papierencontrole: zijn de documenten er, niet: werkt het product?',
      en: 'For a Lean consultant: a gate resembles a quality gate; the pitfall is a paperwork check: are the documents there, not: does the product work?' },
    { nl: 'Vraag: wat moet er bij de volgende gate bewezen zijn, en welke sprint levert dat bewijs? Is het antwoord het ontwerpdossier, dan is de gate een formaliteit.',
      en: 'Ask: what must be proven at the next gate, and which sprint delivers that evidence? If the answer is the design file, the gate is a formality.' },
  ],
  [ // s5 the pump housing
    { nl: 'Een voorbeeld met bedragen ter illustratie: een nieuw pomphuis, en steeds dezelfde wijziging, een andere maat van de flens.',
      en: 'An example with illustrative amounts: a new pump housing, each time the same change, another flange size.' },
    { nl: 'In CAD: vier uur werk tegen negentig euro, samen driehonderdzestig euro.',
      en: 'In CAD: four hours of engineering at ninety euros, three hundred and sixty euros.' },
    { nl: 'Na het eerste prototype: een nieuw geprint of gefreesd prototype, zo\'n drieduizend euro.',
      en: 'After the first prototype: a new printed or milled prototype, about three thousand euros.' },
    { nl: 'Na de geharde matrijs: vijfendertigduizend euro, en zes weken vertraging.',
      en: 'After the hardened mould: thirty-five thousand euros, and six weeks of delay.' },
    { nl: 'Ontwikkelen duurt zesentwintig weken: dertien sprints van twee weken, dertien kansen om fouten te vinden zolang een wijziging honderden euro\'s kost, geen tienduizenden.',
      en: 'Development takes twenty-six weeks: thirteen two-week sprints, thirteen chances to find mistakes while changes cost hundreds, not tens of thousands.' },
  ],
  [ // s6 long-lead items, the SOP, backward planning, the design freeze
    { nl: 'Dan de levertijden. Een {t:Long-lead item|long-lead item} heeft zo\'n lange levertijd dat het de hele planning bepaalt.',
      en: 'Then lead times. A {t:Long-lead item|long-lead item} has a lead time so long it drives the whole schedule.' },
    { nl: 'Een spuitgietmatrijs, een gietstuk, een speciale motor, een chip. Acht tot twintig weken voor een matrijs is niet ongewoon, maar vraag het altijd aan de leverancier.',
      en: 'An injection mould, a casting, a special motor, a chip. Eight to twenty weeks for a mould is not unusual; always ask the supplier.' },
    { nl: 'De start van de serieproductie heet de {t:SOP|SOP}, start of production, vaak vastgelegd door een beurs, een klantcontract of een seizoen.',
      en: 'The start of series production is the {t:SOP|SOP}, often fixed by a trade fair, a customer contract or a season.' },
    { nl: 'Dan werkt {t:Terugplannen|terugplannen}: vanaf de SOP terugrekenen. Min de validatie, min proefspuiten en correcties, min de bouw van het gereedschap, min bestellen.',
      en: 'Then {t:Backward planning|backward planning}: count back from the SOP. Minus validation, minus trial runs and corrections, minus building the tool, minus ordering.' },
    { nl: 'Wat overblijft is het laatste moment om het ontwerp vast te leggen: de {t:Design freeze|design freeze}. Daarna lopen wijzigingen via een formele procedure.',
      en: 'What is left is the last moment to fix the design: the {t:Design freeze|design freeze}. Then changes go through a formal engineering change.' },
  ],
  [ // s7 decide early where it matters; set-based design
    { nl: 'Hier botst agile met hardware. Sprints willen leren en bijsturen; long-lead items vragen vroege beslissingen.',
      en: 'Here agile clashes with hardware. Sprints want to learn and adjust; long-lead items demand early decisions.' },
    { nl: 'Beslis dus vroeg over de long-lead items, houd de rest flexibel, en leg de interfaces vroeg vast, zoals bevestigingspunten en aansluitingen, zodat de binnenkant van een module nog kan veranderen.',
      en: 'So decide early on the long-lead items, keep the rest flexible, and fix the interfaces early, like mounting points and connections, so the inside of a module can still change.' },
    { nl: 'Een tweede hulpmiddel is {t:Set-based design|set-based design}: een paar ontwerpopties openhouden en pas afvallen bij genoeg kennis, in plaats van één vroeg ontwerp steeds te repareren.',
      en: 'A second tool is {t:Set-based design|set-based design}: keep a few design options open and drop them only with enough knowledge, rather than repairing one early design.' },
    { nl: 'Het komt uit onderzoek naar Toyota in de jaren negentig, en SAFe noemt het ook.',
      en: 'It comes from research on Toyota in the nineteen nineties, and SAFe names it too.' },
    { nl: 'In de praktijk: eerst goedkope proefmatrijzen van aluminium voor twee varianten, soft tooling; daarna de geharde stalen matrijs voor de winnaar.',
      en: 'In practice: cheap aluminium trial moulds for two variants first, soft tooling; then the hardened steel mould for the winner.' },
  ],
  [ // s8 purchasing at the table
    { nl: 'Wat je vaak ziet: inkoop zit niet bij de sprintplanning of de PI Planning.',
      en: 'Often purchasing is not at the sprint planning or the PI Planning.' },
    { nl: 'Inkoop hoort pas van een matrijs als het ontwerp bijna klaar is. Dan is de levertijd al te lang.',
      en: 'Purchasing hears about a mould when the design is almost done. By then the lead time is too long.' },
    { nl: 'Zet long-lead items als vaste mijlpalen op het planningsbord, en nodig inkoop uit.',
      en: 'Put long-lead items on the planning board as fixed milestones, and invite purchasing.' },
    { nl: 'Vraag in elk hardwareproject: welk onderdeel heeft de langste levertijd, en in welke week moet dat ontwerp uiterlijk vast?',
      en: 'Ask in every hardware project: which part has the longest lead time, and by which week must its design be fixed?' },
  ],
  [ // s9 the e-bike
    { nl: 'Een voorbeeld: een maker van elektrische fietsen wil in week veertig de serieproductie starten; het accuhuis wordt spuitgegoten.',
      en: 'An example: an e-bike maker wants series production to start in week forty; the battery housing is injection moulded.' },
    { nl: 'Terug vanaf week veertig: validatie van de eerste serie duurt vier weken, dus start uiterlijk in week zesendertig.',
      en: 'Back from week forty: validating the first series takes four weeks, so start by week thirty-six.' },
    { nl: 'Proefspuiten en matrijscorrecties: drie weken, dus de matrijs is klaar in week drieëndertig.',
      en: 'Trial runs and mould corrections: three weeks, so the mould is ready in week thirty-three.' },
    { nl: 'De matrijsbouw duurt volgens de offerte veertien weken: start in week negentien. Bestellen en goedkeuren kost een week: design freeze uiterlijk in week achttien.',
      en: 'Building the mould takes fourteen weeks by the quote: start in week nineteen. Ordering and approval take a week: design freeze by week eighteen.' },
    { nl: 'Controle: veertig min vier, min drie, min veertien, min een, is achttien. Tot dan kan het accuhuis nog beter; de rest van de fiets blijft langer flexibel.',
      en: 'Check: forty minus four, minus three, minus fourteen, minus one, is eighteen. Until then the housing can improve; the rest of the bike stays flexible longer.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice (3D apart), and none of the words espeak-ng
// misreads (see above); checked on the text after the SAY rules, so a word a
// rule rewrites passes and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(retrospectives?|management|time to market|flensmaat|engineering change|businesscase|Toyota|Cooper|SOP|SAFe|design|gates?|stage-gate)\b|à|(^|[.?!;]\s)Eén\b/i,
  en: /\bgo\/kill\b|\bSOP\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (lang === 'nl' && /\d/.test(said.replace(/\b3D-/g, ''))) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="team"],[data-cue="planner"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-face);stroke-width:.5}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-loop{fill:none;stroke:var(--anatomy-hi);stroke-width:1.3;stroke-linecap:round}
.pm-bdash{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:2.4 1.8}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
.pm-bstrike{fill:none;stroke:var(--anatomy-strong);stroke-width:1;stroke-linecap:round}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-loop,[data-cue][data-on] .pm-bdash{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk,[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een projectruimte. Aan de achterwand een whiteboard met het plan als vormen: eerst vijf fases als blokken met daarboven vier gates als ruitjes en daaronder sprints als lusjes; later een tijdlijn naar de start van de serieproductie, met de levertijd van de matrijs teruggepland tot de design freeze en de sprints die doorlopen voor de rest van het product. Jij, de adviseur in petrol, staat bij het bord; de sponsor als poortwachter aan het eind van de tafel, twee ontwikkelaars als het team, en vooraan de inkoper met een tablet. Op tafel een stalen matrijs in twee delen en het prototype van een pomphuis. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: fases, gates en de go/kill-beslissing; de kosten van verandering; Agile-Stage-Gate; wat af is na een hardwaresprint en de valkuil van een papieren gate; het pomphuis; long-lead items, de SOP, terugplannen en de design freeze; vroeg vastleggen waar het moet en set-based design; inkoop aan tafel; en de e-bike.',
  en: 'A project room. On the back wall a whiteboard with the plan as shapes: first five stages as blocks with four gates as diamonds above them and sprints as small loops below; later a timeline to the start of series production, with the mould\'s lead time planned back to the design freeze and the sprints running on for the rest of the product. You, the consultant in petrol, stand at the board; the sponsor as gatekeeper at the end of the table, two developers as the team, and in front the buyer with a tablet. On the table a two-part steel mould and the prototype of a pump housing. At the right a panel with one card per scene, marked as example or diagram: stages, gates and the go/kill decision; the cost of change; Agile-Stage-Gate; what is done after a hardware sprint and the pitfall of a paper gate; the pump housing; long-lead items, the SOP, backward planning and the design freeze; fixing early where it matters and set-based design; purchasing at the table; and the e-bike.',
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

// Dev tool, not shipped. Builds the explainer film "Overdragen en vasthouden /
// Handing over and holding on" for the Projects course: pm.land.handover
// (level 4 of Adoptie en overdracht, "Overdragen aan de lijn"), pm.land.sustain
// (level 1 of Borgen, "Resultaten vasthouden") and pm.close.acceptance (level 1
// of Overdracht en afsluiting, "Formele acceptatie").
//
//   node films/pm.land.handover/build.mjs            build the page
//   node films/pm.land.handover/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.land.handover.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.land.handover, P2): watch, do with support, alone; the three-month dip
// and the audit that catches it; about 110 s, five beats (the checklist, three
// steps on a calendar, formal acceptance, the dip to 81%, a layered audit and a
// trigger). Storyboard drift: nine scenes and five minutes,
// because a lesson with a film no longer shows its worked example, so the film
// carries the whole teach text and the worked example of three lessons: the
// owner and the checklist (s1), the steps, the people side and hypercare (s2),
// Sanne's nine weeks at the cable manufacturer (s3), acceptance criteria and
// the sign-off (s4), open points, outputs or outcomes and new wishes (s5), the
// cable manufacturer's closing meeting (s6), the dip, the audit and the KPI
// review (s7), follow-ups, the trigger and the slip (s8) and the food plant (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (it repeats the panel in miniature), a wall
// clock and a calendar strip of twelve cells on the side wall (the three
// handover steps of three weeks, the hypercare weeks after go-live, the nine
// weeks of the closing evidence, then months: the dip around month three, the
// follow-ups at one, three and six months), a table with a sheet that fills as
// the handover checklist, the one-page evidence and the open points list, and
// the recurring cast: "jij" the consultant in petrol at the board, the sponsor
// (who signs), the team lead (the floor checks of the layered audit) and the
// planner (the owner who takes over, Sanne in the example). A panel at the
// right, in stage space, carries one card per scene, labelled "schema" (a
// general picture) or "voorbeeld" (the worked examples).
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// board, the calendar strip and the sheet on the table.
//
// Checklist (lesson point: scene and beat; "card" where only the card carries
// it, on screen at least 4 s):
//   handover teach 1: the line organisation, the departments and managers who
//     run the daily work, owns the result after you leave (s1 b1); one process
//     owner per new process, responsible for how it runs (card) and for its
//     KPI, the key performance indicator, the number that shows whether it
//     works (s1 b2, b3); daily contact with the work, like a planning manager,
//     not a staff role that only reports (s1 b2)
//   handover teach 2: alone: read the KPI and know what is normal, run the
//     review meeting, train new people, solve the common problems, know whom to
//     call for the rare ones ("rare", card) (s1 b4); the handover checklist,
//     ticked off together point by point (card) in real work, not in a
//     presentation (s1 b5)
//   handover teach 3: watch, run with you beside, alone and you only hear about
//     it; each step a few cycles, e.g. three weekly meetings (s2 b1); the KPIs
//     in the reports and meetings the line already uses, not a separate project
//     dashboard that dies when you leave (s2 b2)
//   handover teach 4: owners accept reluctantly, one more thing on their plate
//     (card); "What would you need to run this without me?"; time, an analyst,
//     data; if not, not realistic yet (card) and the sponsor must know (s2 b3)
//   handover teach 5: hypercare, IT's name for the weeks right after go-live,
//     extra support, often two to six weeks, with an end date, before normal
//     support (card); improvement projects too (card) (s2 b4); the failure: a
//     final presentation and a folder nobody opens three months later; "Has
//     the owner solved a problem with it without me?" (s2 b5)
//   handover example: cable manufacturer, the weekly planning meeting to Sanne,
//     the planning manager; KPI on-time delivery; 92% normal (s3 b1); nine
//     weeks left (card); the capacity model of machine and staff hours (card);
//     the checklist: read the KPI and know 92% is normal, chair, explain the
//     model to a new planner, handle a rush order (s3 b2); weeks 1 to 3 you
//     chair, she watches (card); 4 to 6 she chairs, you beside, a 10-minute
//     debrief; 7 to 9 alone (s3 b3); week 8 a key machine breaks down and she
//     re-plans without calling; the KPI into the monthly operations report;
//     handover done (card) (s3 b4)
//   acceptance teach 1: acceptance criteria say when the project is done;
//     measurable, agreed at the start (s4 b1), in the project charter: the
//     agreement on goal, scope, roles, timing (s4 b2); scope, what is in and
//     out (card); "cancellations below 8% for six weeks in a row" (s4 b3), "in
//     the pilot region; readiness check in all regions; owner trained" (card);
//     write down who signs; without criteria the project ends when someone gets
//     tired (s4 b3)
//   acceptance teach 2: the sign-off, the sponsor's formal yes; each criterion
//     with evidence on one page: met, partly met, not met (s4 b4); a signature
//     or a confirmation by email (card); protects both sides: you close and
//     invoice, the client knows what he got (card); without it the last 10% can
//     drag on for months (s4 b5)
//   acceptance teach 3: an open points list: item, owner, date; not everything
//     perfect; accept with open points rather than wait (s5 b1); the owner in
//     the line organisation, the normal hierarchy, not the temporary project
//     team; points with the line survive (caption), with "the project" die (s5
//     b2)
//   acceptance teach 4: experts argue: accept on outputs or outcomes? outputs
//     what you delivered, a trained team; outcomes the effect, fewer
//     cancellations (card), often months to show (s5 b3); PRINCE2, a widely used
//     project method (card), closes on outputs and plans a benefits review
//     later; many sponsors want outcomes (card); the middle: outputs, a few
//     weeks of outcomes, a review three to six months out (s5 b4)
//   acceptance teach 5: new wishes delaying sign-off: check against the
//     criteria agreed in March (card: March); the wishes go on the list for the
//     line or a follow-up project (s5 b5); never agreed: own it, agree them
//     now, before the last week (card, caption "agree them now"); the kick-off:
//     "What would you need to see to sign this off?" (s5 b5)
//   acceptance example: the cable manufacturer's charter: on-time delivery at
//     least 90% for eight weeks; a weekly planning meeting run by the planning
//     manager; the capacity model documented (card) and explained to both
//     planners (s6 b1); the closing meeting, one page: 91 to 94% for nine weeks,
//     met; the manager chairs since week 7, met (s6 b2); not explained to the
//     second planner: partly met (s6 b3); the sales forecast link, never in
//     scope: "good idea; on the open points list for IT" (s6 b4); open points:
//     train the second planner (planning manager: card, 15 May), the forecast
//     link (IT lead: card, assess by June); he signs (s6 b5)
//   sustain teach 1: the three-month dip, results slide a few months after the
//     project; a practitioner rule of thumb, not a law (s7 b1); attention goes
//     elsewhere, people change jobs, a busy season, exceptions become habits;
//     plan for it (s7 b2)
//   sustain teach 2: short regular checks: the line manager checks weekly on the
//     floor: board up to date, checklist used, actions done (s7 b3); car makers'
//     layered process audit: team leaders daily, managers weekly, the plant
//     manager monthly (card: who; said: daily, weekly, monthly, layer by layer);
//     small checks often beat one big audit a year (s7 b4)
//   sustain teach 3: the owner's monthly KPI review with the team: the trend,
//     the reasons behind the misses, the actions; the trend, not one week; one
//     bad week is noise (s7 b5); a follow-up, a planned return visit at one,
//     three and six months (s8 b1); a trigger: on-time delivery below 85% for
//     three weeks in a row, the owner calls us (s8 b2)
//   sustain teach 4: the trigger makes your return a plan, not a sign of
//     failure (s8 b2); when results slip, don't fix it yourself, that
//     undermines the owner (card); ask what changed: new people, more volume, a
//     skipped step (card); help him find the cause and act; some slipping is
//     normal, don't take it personally (card); the owner notices and acts
//     (card) (s8 b3)
//   sustain teach 5: the new way hung on one enthusiastic person who moves
//     jobs (card); check early that a second person can run it (s8 b4); experts
//     disagree: a year of follow-ups, or the client becomes dependent (card);
//     "What have you changed in the process since I left, without me?" (s8 b5)
//   sustain example: a food plant, on-time delivery 72% to 90%; 81% at the
//     three-month follow-up; half the gain gone (s9 b1), 18 points gained and 9
//     lost (card, from the lesson's recall); with the owner, the operations
//     manager (card): two new planners in month two (card) never trained, the
//     weekly review cancelled four times in the summer (s9 b2); he decides: the
//     senior planner trains the two this month, the weekly review fixed with a
//     stand-in (s9 b3); look again in six weeks: back at 88% (s9 b4)
//
// Facts: nothing here is credited to a source; every claim is the lessons'
// own (the layered process audit from car makers, PRINCE2 closing on outputs
// with a later benefits review, IT's hypercare of often two to six weeks). The
// numbers the film works out are asserted below: 90 − 72 = 18 points gained,
// 90 − 81 = 9 lost, half; three steps of three weeks fill the nine weeks.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The three lessons' facts, asserted against their current text (the build
// fails if one drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const HO = 'pm.land.handover';
const SU = 'pm.land.sustain';
const AC = 'pm.close.acceptance';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n'); };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(HO, ['de gewone afdelingen en managers die het werk elke dag draaien, is eigenaar van het resultaat als jij weg bent', 'Benoem één proceseigenaar per nieuw proces', 'de kritieke prestatie-indicator, het getal dat laat zien of het werkt',
  'dagelijks contact met het werk, zoals een planningsmanager, en is geen staffunctie die er alleen over rapporteert',
  'de KPI lezen en weten wat normaal is, het reviewoverleg leiden, nieuwe mensen inwerken, de gewone problemen oplossen, en weten wie hij moet bellen voor de zeldzame',
  'overdrachtschecklist en vink het samen af, punt voor punt', 'in het echte werk laat zien, niet in een presentatie',
  'Eerst kijkt de eigenaar hoe jij het doet. Dan doet de eigenaar het terwijl jij ernaast zit. Dan doet hij het alleen en hoor jij er alleen nog over', 'bijvoorbeeld drie weekoverleggen',
  'in de rapportages en overleggen die de lijn al gebruikt, niet in een apart projectdashboard dat sterft als jij vertrekt',
  'met tegenzin aan, als nog een ding op hun bord', '“Wat heb je nodig om dit zonder mij te draaien?”', 'tijd, een analist, toegang tot data', 'nog niet realistisch, en moet de sponsor dat weten',
  'direct na de livegang hypercare', 'vaak twee tot zes weken', 'met een duidelijke einddatum', 'een eindpresentatie en een map met documenten, en drie maanden later opent niemand die map', '“Heeft de eigenaar er zonder mij al een probleem mee opgelost?”',
  'kabelfabrikant', 'planningsmanager, Sanne', 'leverbetrouwbaarheid (on-time delivery: het aandeel orders dat op de beloofde datum geleverd wordt); 92% is normaal', 'nog negen weken',
  'capaciteitsmodel, het overzicht van beschikbare machine- en mensuren, aan nieuwe planners', 'spoedorders',
  'ze kan de KPI lezen en weet dat 92% normaal is; ze zit het overleg voor; ze kan het capaciteitsmodel uitleggen aan een nieuwe planner; ze weet wat te doen bij een spoedorder',
  'Week 1 tot 3: jij zit voor, zij kijkt. Week 4 tot 6: zij zit voor, jij zit ernaast en jullie bespreken het daarna 10 minuten na. Week 7 tot 9: ze doet het alleen',
  'in week 8 valt een belangrijke machine uit en plant ze de week om zonder jou te bellen', 'maandelijkse operationele rapport. Overdracht klaar']);
says(AC, ['Acceptatiecriteria zeggen wanneer het project klaar is. Maak ze meetbaar en spreek ze aan het begin af, in de projectopdracht', 'doel, scope (wat erbinnen valt en wat niet), rollen en planning',
  'Afzeggingen onder de 8% gedurende zes weken op rij in de pilotregio; gereedheidscheck in gebruik in alle regio’s; eigenaar getraind', 'Schrijf op wie tekent', 'eindigt het project als iemand er moe van wordt',
  'het formele ja van de sponsor, de manager die eigenaar is van het project en het betaalt', 'met het bewijs op één A4: gehaald, deels gehaald of niet gehaald', 'een handtekening, of een bevestiging per mail',
  'beschermt beide kanten', 'jij kunt afsluiten en factureren', 'de laatste 10% van een project maanden blijven hangen',
  'Niet alles zal perfect zijn', 'punt, eigenaar, datum', 'de gewone hiërarchie die het dagelijkse werk draait, in tegenstelling tot het tijdelijke projectteam', 'met open punten in plaats van te wachten tot alles af is', 'Punten bij de lijn overleven de overdracht; punten bij “het project” sterven als het stopt',
  'op output of op uitkomst (outcome)', 'zoals een getraind team of een nieuwe check', 'zoals minder afzeggingen, en dat zie je vaak pas na maanden',
  'PRINCE2, een veelgebruikte projectmethode, sluiten af op output en plannen later een batenreview', 'Veel sponsors willen juist de uitkomst in de criteria', 'output, plus een paar weken data over de uitkomst, plus een reviewdatum over drie tot zes maanden',
  'rekken de ondertekening soms met nieuwe wensen', 'die we in maart afspraken', 'ze gaan op de lijst voor de lijn of een vervolgproject', 'neem dat dan eerlijk op je en spreek ze nu af, vóór de laatste week', 'het eerste projectoverleg: “Wat moet je zien om hiervoor te tekenen?”',
  'leverbetrouwbaarheid (het deel van de orders dat op de beloofde datum de deur uit gaat) minstens 90% gedurende acht weken', 'een wekelijks planningsoverleg geleid door de planningsmanager', 'een rekenblad met benodigde tegenover beschikbare uren, gedocumenteerd en uitgelegd aan beide planners',
  'leverbetrouwbaarheid 91 tot 94% gedurende negen weken (gehaald), planningsmanager zit voor sinds week 7 (gehaald), model gedocumenteerd maar nog niet uitgelegd aan de tweede planner (deels gehaald)',
  'koppeling met de verkoopprognose, die nooit in scope was', '“Goed idee; ik zou het op de openpuntenlijst voor IT zetten.”', 'tweede planner trainen (planningsmanager, 15 mei), koppeling verkoopprognose (IT-lead, beoordelen vóór juni). Hij tekent']);
says(SU, ['Reken op de dip na drie maanden: resultaten zakken vaak een paar maanden na het einde van het project weg', 'Dat is een vuistregel uit de praktijk, geen wet',
  'gaat de aandacht naar iets anders, wisselen mensen van baan, komt er een druk seizoen, worden uitzonderingen gewoontes', 'in plaats van verrast te zijn als de KPI wegzakt',
  'De leidinggevende checkt elke week een paar dingen op de vloer: is het bord bijgewerkt, wordt de checklist gebruikt, zijn de acties gedaan',
  'Autofabrikanten maakten er een vaste methode van, de gelaagde procesaudit', 'teamleiders dagelijks, managers wekelijks, de plantmanager maandelijks', 'Vaak een kleine check werkt beter dan één grote audit per jaar',
  'elke maand een KPI-review met het team: het verloop, de redenen achter de missers, de acties', 'één slechte week is ruis',
  'een follow-up, een gepland vervolgbezoek, na één, drie en zes maanden', 'drie weken achter elkaar onder de 85% zit, belt de eigenaar ons', 'maakt van terugkomen een plan, geen teken van falen',
  'los het dan niet zelf op; dat ondermijnt de eigenaar', 'nieuwe mensen, meer volume, een stap die wordt overgeslagen', 'Help hem de oorzaak te vinden en te handelen', 'wat wegzakken is normaal', 'dat de eigenaar het ziet en iets doet',
  'hing aan één enthousiaste persoon', 'Check vroeg of een tweede persoon het kan draaien', 'Sommige consultants plannen een jaar lang follow-ups; anderen zeggen dat de klant daar afhankelijk van wordt', '“Wat heb je sinds mijn vertrek zelf aan het proces veranderd?”',
  'levensmiddelenfabriek', 'van 72% naar 90%', 'na drie maanden is het 81%', 'De helft van de verbetering is weg', 'de operations manager', 'In maand twee begonnen twee nieuwe planners die nooit getraind zijn; het weekoverleg is in de zomer vier keer afgezegd',
  'de senior planner traint de twee nieuwe deze maand, en het weekoverleg komt vast in de agenda met een vervanger als hij weg is', 'over zes weken weer te kijken. Dan zit het weer op 88%']);
says(HO, ['92% is normal', 'Weeks 1 to 3', 'week 8'], 'en');
says(SU, ['from 72% to 90%', 'it is 81%', 'back at 88%', 'below 85%'], 'en');
says(AC, ['at least 90% for eight weeks', '91 to 94% for nine weeks', 'since week 7', '15 May'], 'en');
assert(lessons.nl.get(SU).recall.some((q) => q.why.includes('De verbetering was 18 punten; 9 punten verloren')), 'the sustain recall works out 18 and 9 points');
const DIP = { before: 72, after: 90, dip: 81, back: 88 };
assert(DIP.after - DIP.before === 18 && DIP.after - DIP.dip === 9 && (DIP.after - DIP.dip) * 2 === DIP.after - DIP.before, 'from 72 to 90 is 18 points; 9 lost is half');
const STEPS = [3, 3, 3];
assert(STEPS.reduce((a, b) => a + b, 0) === 9, 'three steps of three weeks fill the nine weeks');

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

const WEEKS = 12;
const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
// tall cells: the side wall is seen edge-on, so the height carries the strip at 390 px
const CAL = w.calendar({ y0: 30, z0: 104, weeks: WEEKS, cw: 15.6, ch: 46 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 148, y: 150, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([158, 165, TZ]);
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

const world = [
  w.room(ROOM),
  w.clock(262, 214, 10),
  cueG('board', BOARD.svg + boardMini),
  cueG('calendar', CAL.svg + calMarks),
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
  w.person({ x: 232, y: 208, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; every block of a
// card sits in its own cue group, so each beat's focus lights the block it
// explains.
const PX = 322;
const PW = 308;
const CUES = ['line', 'owner', 'kpi', 'can', 'check', 'steps', 'reports', 'ask', 'need', 'hyper', 'folder',
  'case', 'list', 'weeks', 'proof', 'crit', 'charter', 'ex1', 'who', 'sign', 'protect',
  'open', 'line2', 'oo', 'benefit', 'middle', 'wish', 'kick', 'charter2', 'evidence', 'partly', 'forecast', 'points',
  'dip', 'why', 'weekly', 'lpa', 'review', 'follow', 'trig', 'slip', 'second', 'test', 'chart', 'half', 'cause', 'act', 'back'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.plan.method and pm.land.adoption): the same points, fewer bytes; each rewrite is read back.
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
const BOARD_AT = w.at([145, 0, 150]).map((v) => Math.round(v * 10) / 10);
const SH = SHEET_AT.map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [150, 210, 1], to: [SH[0], SH[1], 1.1] },
  { from: [150, 200, 1.04], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.06], to: [SH[0], SH[1], 1.08] },
  { from: [150, 210, 1.02], to: [SH[0], SH[1], 1.12] },
  { from: [SH[0], SH[1], 1.08], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.06] },
  { from: [150, 200, 1.04], to: [SH[0], SH[1], 1.14] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.06], to: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.1] },
  { from: [CAL_AT[0] + 40, CAL_AT[1] + 30, 1.08], to: [150, 210, 1.02] },
  { from: [150, 200, 1.06], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const C = { CUES, CELLS, WEEKS, DIP, NORMAL: 92, CANCEL: 8, LAST: 10, OTD: 90, SHOWN: [91, 94], CHAIR: 7, MAY: 15, TRIGGER: 85, FOLLOW: [1, 3, 6] };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.land.handover',
  title: { nl: 'Overdragen en vasthouden', en: 'Handing over and holding on' },
  // land.handover first: the shared term Lijnorganisatie resolves to the first
  // served lesson, which scene 1 names
  lessons: [HO, AC, SU],
  strictFocus: true,
  scenes: [
    sc('s1', HO, 4, { nl: 'De eigenaar in de lijn', en: 'The owner in the line' }, [
      { nl: 'De {t:Lijnorganisatie|lijnorganisatie} draait het werk elke dag, en is eigenaar als jij weg bent.', en: 'The {t:Line organisation|line organisation} runs the work every day, and owns it after you leave.', cue: { Lijnorganisatie: 'line' }, focus: 'line' },
      { nl: 'Eén {t:Proceseigenaar|proceseigenaar} per proces: dicht bij het werk, geen staffunctie.', en: 'One {t:Process owner|process owner} per process: close to the work, not a staff role.', cue: { Proceseigenaar: 'owner' }, focus: ['owner', 'planner'] },
      { nl: 'Die draagt de {t:KPI|KPI}: het getal dat laat zien of het werkt.', en: 'They own the {t:KPI|KPI}: the number that shows whether it works.', cue: { KPI: 'kpi' }, focus: 'kpi' },
      { nl: 'Alleen kunnen: KPI lezen, overleg leiden, inwerken, problemen oplossen, weten wie te bellen.', en: 'Alone: read the KPI, run the review, train people, solve problems, know whom to call.', focus: 'can' },
      { nl: 'Een {t:Overdrachtschecklist|overdrachtschecklist}, samen afgevinkt in het echte werk.', en: 'A {t:Handover checklist|handover checklist}, ticked off together in real work.', cue: { Overdrachtschecklist: 'check' }, focus: ['check', 'sheet'] },
    ]),
    sc('s2', HO, 4, { nl: 'In stappen', en: 'In steps' }, [
      { nl: 'Kijken, doen met jou ernaast, dan alleen. Elke stap een paar cycli.', en: 'Watch, run it with you beside, then alone. Each step a few cycles.', focus: ['steps', 'calendar'] },
      { nl: 'De KPI’s in de rapportages van de lijn, niet in een apart dashboard.', en: 'The KPIs in the line’s own reports, not in a separate dashboard.', focus: 'reports' },
      { nl: 'Tegenzin? Vraag wat de eigenaar nodig heeft om het zonder jou te draaien.', en: 'Reluctant? Ask what the owner needs to run it without you.', focus: ['ask', 'need', 'planner'] },
      { nl: '{t:Hypercare|Hypercare}: extra steun na de livegang, vaak twee tot zes weken.', en: '{t:Hypercare|Hypercare}: extra support after go-live, often two to six weeks.', cue: { Hypercare: 'hyper' }, focus: ['hyper', 'calendar'] },
      { nl: 'Mis: een eindpresentatie en een map die niemand meer opent.', en: 'Wrong: a final presentation and a folder nobody opens again.', focus: 'folder' },
    ]),
    sc('s3', HO, 4, { nl: 'Negen weken met Sanne', en: 'Nine weeks with Sanne' }, [
      { nl: 'Kabelfabrikant: Sanne neemt het planningsoverleg over. {n:92}% op tijd is normaal.', en: 'Cable manufacturer: Sanne takes over the planning meeting. {n:92}% on time is normal.', focus: ['case', 'planner'] },
      { nl: 'Checklist: KPI lezen, voorzitten, het capaciteitsmodel uitleggen, een spoedorder opvangen.', en: 'Checklist: read the KPI, chair, explain the capacity model, handle a rush order.', focus: ['list', 'sheet'] },
      { nl: 'Week {n:1} tot {n:3} jij, {n:4} tot {n:6} zij met jou ernaast, {n:7} tot {n:9} alleen.', en: 'Weeks {n:1} to {n:3} you, {n:4} to {n:6} she with you beside, {n:7} to {n:9} alone.', focus: ['weeks', 'calendar'] },
      { nl: 'Week {n:8}: een machine valt uit en ze plant om zonder te bellen.', en: 'Week {n:8}: a machine breaks down and she re-plans without calling.', focus: ['proof', 'calendar'] },
    ]),
    sc('s4', AC, 1, { nl: 'Wanneer is het klaar?', en: 'When is it done?' }, [
      { nl: '{t:Acceptatiecriteria|Acceptatiecriteria}: meetbaar, aan het begin afgesproken.', en: '{t:Acceptance criteria|Acceptance criteria}: measurable, agreed at the start.', cue: { Acceptatiecriteria: 'crit' }, focus: 'crit' },
      { nl: 'In de {t:Projectopdracht|projectopdracht}: doel, scope, rollen, planning.', en: 'In the {t:Project charter|project charter}: goal, scope, roles, timing.', cue: { Projectopdracht: 'charter' }, focus: 'charter' },
      { nl: 'Zoals: afzeggingen onder de {n:8}%, zes weken op rij. En: wie tekent?', en: 'Like: cancellations below {n:8}%, six weeks running. And: who signs?', focus: ['ex1', 'who'] },
      { nl: 'De {t:Ondertekening|ondertekening}: elk criterium met bewijs op één A4.', en: 'The {t:Sign-off|sign-off}: each criterion with evidence on one page.', cue: { Ondertekening: 'sign' }, focus: ['sign', 'sponsor', 'sheet'] },
      { nl: 'Dat beschermt beide kanten; anders blijft de laatste {n:10}% hangen.', en: 'It protects both sides; otherwise the last {n:10}% drags on.', focus: 'protect' },
    ]),
    sc('s5', AC, 1, { nl: 'Open punten', en: 'Open points' }, [
      { nl: 'Een {t:Openpuntenlijst|openpuntenlijst}: punt, eigenaar, datum. Accepteer met open punten.', en: 'An {t:Open points list|open points list}: item, owner, date. Accept with open points.', cue: { Openpuntenlijst: 'open' }, focus: ['open', 'sheet'] },
      { nl: 'Eigenaar in de lijn: dan overleeft het punt de overdracht.', en: 'Owner in the line: then the point survives the handover.', focus: 'line2' },
      { nl: 'Output of uitkomst? De uitkomst zie je vaak pas na maanden.', en: 'Outputs or outcomes? Outcomes often take months to show.', focus: 'oo' },
      { nl: 'PRINCE2 plant later een {t:Batenreview|batenreview}. Midden: output, eerste uitkomst, een review.', en: 'PRINCE2 plans a {t:Benefits review|benefits review} later. Middle: outputs, some outcomes, a review.', cue: { Batenreview: 'benefit' }, focus: ['benefit', 'middle'] },
      { nl: 'Nieuwe wensen? Toets aan de criteria. Geen criteria? Spreek ze nu af.', en: 'New wishes? Check against the criteria. No criteria? Agree them now.', focus: ['wish', 'kick'] },
    ]),
    sc('s6', AC, 1, { nl: 'Tekenen bij de kabels', en: 'Signing at the cable plant' }, [
      { nl: 'De opdracht: minstens {n:90}% op tijd, acht weken; de manager zit voor; het model uitgelegd.', en: 'The charter: at least {n:90}% on time for eight weeks; the manager chairs; the model explained.', focus: 'charter2' },
      { nl: 'Op één A4: {n:91} tot {n:94}%, negen weken: gehaald. Voorzitter sinds week {n:7}: gehaald.', en: 'On one page: {n:91} to {n:94}% for nine weeks: met. Chairing since week {n:7}: met.', focus: ['evidence', 'sheet', 'calendar'] },
      { nl: 'Nog niet uitgelegd aan de tweede planner: deels gehaald.', en: 'Not yet explained to the second planner: partly met.', focus: ['partly', 'planner'] },
      { nl: 'De sponsor wil een koppeling met de verkoopprognose. Nooit in scope.', en: 'The sponsor wants a sales forecast link. Never in scope.', focus: ['forecast', 'sponsor'] },
      { nl: 'Open: tweede planner trainen voor {n:15} mei; de koppeling beoordelen voor juni. Hij tekent.', en: 'Open: train the second planner by {n:15} May; assess the link by June. He signs.', focus: ['points', 'sponsor'] },
    ]),
    sc('s7', SU, 1, { nl: 'De dip na drie maanden', en: 'The three-month dip' }, [
      { nl: 'Reken op de {t:Dip na drie maanden|dip na drie maanden}: een vuistregel, geen wet.', en: 'Expect the {t:Three-month dip|three-month dip}: a rule of thumb, not a law.', cue: { 'Dip na drie maanden': 'dip' }, focus: 'dip' },
      { nl: 'Aandacht weg, nieuwe mensen, een druk seizoen, uitzonderingen worden gewoonte.', en: 'Attention gone, new people, a busy season, exceptions become habits.', focus: 'why' },
      { nl: 'Elke week korte checks: bord bijgewerkt, checklist gebruikt, acties gedaan?', en: 'Short weekly checks: board up to date, checklist used, actions done?', focus: ['weekly', 'teamlead', 'board'] },
      { nl: 'De {t:Gelaagde procesaudit|gelaagde procesaudit}: per dag, per week, per maand.', en: 'The {t:Layered process audit|layered process audit}: daily, weekly, monthly.', cue: { 'Gelaagde procesaudit': 'lpa' }, focus: ['lpa', 'teamlead'] },
      { nl: 'Elke maand een {t:KPI-review|KPI-review}: verloop, redenen, acties.', en: 'A monthly {t:KPI review|KPI review}: trend, reasons, actions.', cue: { 'KPI-review': 'review' }, focus: 'review' },
    ]),
    sc('s8', SU, 1, { nl: 'Terugkomen zonder over te nemen', en: 'Coming back without taking over' }, [
      { nl: 'Spreek een {t:Follow-up|follow-up} af: na één, drie en zes maanden.', en: 'Agree a {t:Follow-up|follow-up}: at one, three and six months.', cue: { 'Follow-up': 'follow' }, focus: ['follow', 'calendar'] },
      { nl: 'En een {t:Trigger|trigger}: drie weken onder de {n:85}%, dan belt de eigenaar.', en: 'And a {t:Trigger|trigger}: three weeks below {n:85}%, and the owner calls.', cue: { Trigger: 'trig' }, focus: 'trig' },
      { nl: 'Zakt het weg? Niet zelf oplossen. Vraag wat er veranderde.', en: 'Slipping? Don’t fix it yourself. Ask what changed.', focus: ['slip', 'planner'] },
      { nl: 'Hangt het aan één enthousiasteling? Check of een tweede het kan.', en: 'Hangs on one enthusiast? Check a second person can run it.', focus: 'second' },
      { nl: 'Hoe lang blijf je? Experts verschillen.', en: 'How long do you stay? Experts differ.', focus: 'test' },
    ]),
    sc('s9', SU, 1, { nl: 'Terug naar 88', en: 'Back to 88' }, [
      { nl: 'Levensmiddelen: van {n:72}% naar {n:90}% op tijd; na drie maanden {n:81}%, de helft weg.', en: 'Food plant: from {n:72}% to {n:90}% on time; after three months {n:81}%, half gone.', focus: ['chart', 'half', 'calendar'] },
      { nl: 'Twee nieuwe planners nooit getraind; het weekoverleg vier keer afgezegd.', en: 'Two new planners never trained; the weekly review cancelled four times.', focus: ['cause', 'planner'] },
      { nl: 'Hij besluit: de senior planner traint ze; het overleg vast, met een vervanger.', en: 'He decides: the senior planner trains them; the review fixed, with a stand-in.', focus: 'act' },
      { nl: 'Zes weken later: {n:88}%.', en: 'Six weeks later: {n:88}%.', focus: ['back', 'chart'] },
    ]),
  ],
  skip: [
    { lesson: AC, term: 'Lijnorganisatie', reason: 'Same term as Lijnorganisatie of pm.land.handover, which scene 1 names with its cue (the line organisation card); scene 5 beat 2 says this lesson\'s own definition (the line, the normal hierarchy, not the temporary team) and shows the owner in the line on the card. The build resolves a shared term name to the first served lesson.' },
  ],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the cards it carries every
// point of the checklist above. No symbols the voice would read aloud: numbers
// stay plain, percent is said as a word, no quotes or parentheses.
// Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). New SAY rules in films/_kit/timeline.mjs for this
// film (no other film's spoken text changes): hypercare said haiperkeer, "de
// KPI" and KPI's as letters (KPI-review is read as letters already),
// acceptatiecriteria (lower case), projectopdracht, procesaudit, batenreview and
// overdrachtschecklist split at the head. Scope is said skoop and
// proceseigenaar split by the shared rules. Kept out of the Dutch narration
// because espeak-ng misreads them (they stay on the cards): manager and its
// compounds (said leidinggevende, het hoofd planning), operations and
// operationele, livegang (said ingebruikname), outcome (said resultaat),
// projectdashboard and projectteam (reworded), vuistregel (stressed vuistreGEL: said
// een regel uit de praktijk), and a capital
// Acceptatiecriteria or Eén at the start of a sentence.
const SAY = [
  [ // s1 the owner in the line
    { nl: 'De {t:Lijnorganisatie|lijnorganisatie}, de afdelingen die het werk dagelijks draaien, is eigenaar als jij weg bent.',
      en: 'The {t:Line organisation|line organisation}, the departments that run the daily work, owns it after you leave.' },
    { nl: 'Benoem per nieuw proces één {t:Proceseigenaar|proceseigenaar}, dagelijks bij het werk, zoals het hoofd planning; geen staffunctie.',
      en: 'Name one {t:Process owner|process owner} per new process, close to the daily work, like a planning manager; not a staff role.' },
    { nl: 'Die draagt de {t:KPI|KPI}, de kritieke prestatie-indicator. Het getal dat laat zien of het werkt.',
      en: 'They own the {t:KPI|KPI}, the key performance indicator: the number that shows whether it works.' },
    { nl: 'Zonder jou moet de eigenaar weten wat normaal is, voorzitten, inwerken, problemen oplossen en weten wie hij belt.',
      en: 'Alone, the owner must know what is normal, chair, train new people, solve problems and know whom to call.' },
    { nl: 'Zet het op een {t:Overdrachtschecklist|overdrachtschecklist} en vink samen af, in het echte werk, niet in een presentatie.',
      en: 'Put it on a {t:Handover checklist|handover checklist} and tick it off together, in real work, not in a presentation.' },
  ],
  [ // s2 in steps
    { nl: 'Draag in stappen over: de eigenaar kijkt, doet het met jou ernaast, dan alleen. Elke stap een paar weekoverleggen.',
      en: 'Hand over in steps: the owner watches, runs it with you beside, then alone. Each step a few weekly meetings.' },
    { nl: 'Zet de KPI\'s in de rapportages van de lijn; een apart dashboard sterft als jij vertrekt.',
      en: 'Put the KPIs in the line\'s own reports; a separate dashboard dies when you leave.' },
    { nl: 'Tegenzin? Vraag wat hij nodig heeft om het zonder jou te draaien. Lukt dat niet, dan moet de sponsor het weten.',
      en: 'Reluctant? Ask what they need to run it without you. If not, the sponsor must know.' },
    { nl: 'In de IT heet de extra steun na de ingebruikname {t:Hypercare|hypercare}: vaak twee tot zes weken, met een einddatum.',
      en: 'In IT, extra support after go-live is called {t:Hypercare|hypercare}: often two to six weeks, with an end date.' },
    { nl: 'Mis: een eindpresentatie en een map die niemand opent. Vraag: heeft de eigenaar zonder mij al iets opgelost?',
      en: 'Wrong: a final presentation and a folder nobody opens. Ask: has the owner solved anything without me yet?' },
  ],
  [ // s3 nine weeks with Sanne
    { nl: 'Een kabelfabrikant: Sanne, het hoofd planning, neemt het weekoverleg over. {n:92} procent op tijd is normaal.',
      en: 'A cable manufacturer: Sanne, the planning manager, takes over the weekly meeting. {n:92} percent on time is normal.' },
    { nl: 'Haar checklist: de KPI lezen, voorzitten, het capaciteitsmodel uitleggen aan een nieuwe planner, spoedorders opvangen.',
      en: 'Her checklist: read the KPI, chair, explain the capacity model to a new planner, handle rush orders.' },
    { nl: 'Week {n:1} tot {n:3} zit jij voor; {n:4} tot {n:6} zij, met jou ernaast en {n:10} minuten nabespreken; {n:7} tot {n:9} alleen.',
      en: 'Weeks {n:1} to {n:3} you chair; {n:4} to {n:6} she does, with you beside and a {n:10} minute debrief; {n:7} to {n:9} alone.' },
    { nl: 'Het bewijs: in week {n:8} valt een machine uit en plant ze om zonder te bellen. De KPI gaat in het maandrapport.',
      en: 'The proof: in week {n:8} a machine breaks down and she re-plans without calling. The KPI joins the monthly report.' },
  ],
  [ // s4 when is it done
    { nl: 'Wanneer is het klaar? Dat zeggen de {t:Acceptatiecriteria|acceptatiecriteria}: meetbaar, en aan het begin afgesproken.',
      en: 'When is it done? The {t:Acceptance criteria|acceptance criteria} say so: measurable, and agreed at the start.' },
    { nl: 'Ze staan in de {t:Projectopdracht|projectopdracht}: de afspraak over doel, scope, rollen en planning.',
      en: 'They go in the {t:Project charter|project charter}: the agreement on goal, scope, roles and timing.' },
    { nl: 'Bijvoorbeeld: afzeggingen onder de {n:8} procent, zes weken op rij. Schrijf op wie tekent; anders stopt het als iemand moe wordt.',
      en: 'For example: cancellations below {n:8} percent, six weeks running. Write down who signs; otherwise it ends when someone tires.' },
    { nl: 'De {t:Ondertekening|ondertekening} is het ja van de sponsor: elk criterium met bewijs op één A4, gehaald, deels of niet.',
      en: 'The {t:Sign-off|sign-off} is the sponsor\'s yes: each criterion with evidence on one page, met, partly or not.' },
    { nl: 'Dat beschermt beide kanten: jij kunt afsluiten en factureren. Anders blijft de laatste {n:10} procent maanden hangen.',
      en: 'That protects both sides: you can close and invoice. Otherwise the last {n:10} percent drags on for months.' },
  ],
  [ // s5 open points
    { nl: 'Niet alles is perfect: zet wat er ligt op een {t:Openpuntenlijst|openpuntenlijst}: punt, eigenaar, datum, en accepteer.',
      en: 'Not everything is perfect: put what remains on an {t:Open points list|open points list}, with item, owner and date, and accept.' },
    { nl: 'Die eigenaar zit in de lijn, de gewone hiërarchie; punten bij het tijdelijke team sterven als het project stopt.',
      en: 'That owner sits in the line, the normal hierarchy; points left with the temporary team die when the project ends.' },
    { nl: 'Experts discussiëren: accepteer je op output, zoals een getraind team, of op uitkomst, die vaak pas na maanden komt?',
      en: 'Experts argue: accept on outputs, like a trained team, or on outcomes, which often take months?' },
    { nl: 'PRINCE2 sluit af op output en plant later een {t:Batenreview|batenreview}. Midden: output, weken meten van de uitkomst, en een review na drie tot zes maanden.',
      en: 'PRINCE2 closes on outputs and plans a {t:Benefits review|benefits review} later. A middle: outputs, weeks of outcomes, and a review after three to six months.' },
    { nl: 'Nieuwe wensen? Toets aan de criteria; de wensen gaan naar de lijn. Vraag bij de kick-off: wat moet je zien om te tekenen?',
      en: 'New wishes? Check against the criteria; the wishes go to the line. Ask at the kick-off: what would you need to see to sign?' },
  ],
  [ // s6 signing at the cable plant
    { nl: 'De opdracht: minstens {n:90} procent op tijd, acht weken; het hoofd planning zit voor; het model uitgelegd.',
      en: 'The charter: at least {n:90} percent on time for eight weeks; the planning manager chairs; the model explained.' },
    { nl: 'Op één A4: {n:91} tot {n:94} procent, negen weken: gehaald. Voorzitter sinds week {n:7}: gehaald.',
      en: 'On one page: {n:91} to {n:94} percent for nine weeks: met. Chairing since week {n:7}: met.' },
    { nl: 'Het model is nog niet uitgelegd aan de tweede planner: deels gehaald.',
      en: 'The model is not yet explained to the second planner: partly met.' },
    { nl: 'De sponsor wil een koppeling met de verkoopprognose, nooit in scope. Jij: goed idee, een open punt voor IT.',
      en: 'The sponsor wants a sales forecast link, never in scope. You: good idea, an open point for IT.' },
    { nl: 'Open: de tweede planner trainen voor {n:15} mei; de koppeling beoordelen voor juni. De sponsor tekent.',
      en: 'Open: train the second planner by {n:15} May; assess the link by June. The sponsor signs.' },
  ],
  [ // s7 the three-month dip
    { nl: 'Reken op de {t:Dip na drie maanden|dip na drie maanden}: resultaten zakken vaak weg. Een regel uit de praktijk, geen wet.',
      en: 'Expect the {t:Three-month dip|three-month dip}: results often slide. A rule of thumb, not a law.' },
    { nl: 'De aandacht gaat weg, mensen wisselen, een druk seizoen, uitzonderingen worden gewoonte. Plan erop.',
      en: 'Attention moves on, people change jobs, a busy season comes, exceptions become habits. Plan for it.' },
    { nl: 'Korte checks houden het levend: elke week kijkt de leidinggevende of bord, checklist en acties bijgehouden zijn.',
      en: 'Short checks keep it alive: every week the line manager checks the board, the checklist and the actions.' },
    { nl: 'Autofabrikanten maakten er de {t:Gelaagde procesaudit|gelaagde procesaudit} van: dagelijks, wekelijks, maandelijks, laag voor laag. Vaak en klein werkt beter dan één grote audit.',
      en: 'Car makers made it the {t:Layered process audit|layered process audit}: daily, weekly, monthly, layer by layer. Small and often beats one big audit.' },
    { nl: 'Elke maand een {t:KPI-review|KPI-review} met het team: verloop, redenen, acties. Kijk naar de trend; één slechte week is ruis.',
      en: 'A monthly {t:KPI review|KPI review} with the team: trend, reasons, actions. Watch the trend; one bad week is noise.' },
  ],
  [ // s8 coming back without taking over
    { nl: 'Spreek vooraf een {t:Follow-up|follow-up} af, een gepland bezoek na één, drie en zes maanden.',
      en: 'Agree a {t:Follow-up|follow-up} in advance, a planned visit at one, three and six months.' },
    { nl: 'En een {t:Trigger|trigger}: drie weken onder de {n:85} procent op tijd, dan belt de eigenaar. Zo is terugkomen een plan, geen falen.',
      en: 'And a {t:Trigger|trigger}: three weeks below {n:85} percent on time, and the owner calls. So coming back is a plan, not a failure.' },
    { nl: 'Zakt het weg? Los het niet zelf op; help de eigenaar zoeken wat er veranderde. Wat wegzakken is normaal.',
      en: 'Slipping? Do not fix it yourself; help the owner find what changed. Some slipping is normal.' },
    { nl: 'Hangt het aan één enthousiaste collega? Check vroeg of een tweede het kan draaien.',
      en: 'Does it hang on one enthusiast? Check early that a second person can run it.' },
    { nl: 'Hoe lang blijf je? Experts verschillen. Test: wat heb je sinds mijn vertrek zelf aan het proces veranderd?',
      en: 'How long do you stay? Experts differ. Test: what have you changed in the process since I left, without me?' },
  ],
  [ // s9 back to 88
    { nl: 'Een levensmiddelenfabriek: van {n:72} naar {n:90} procent op tijd. Na drie maanden {n:81}: de helft van de winst is weg.',
      en: 'A food plant: from {n:72} to {n:90} percent on time. After three months {n:81}: half the gain is gone.' },
    { nl: 'Met de eigenaar zoek je wat er veranderde: twee nieuwe planners nooit getraind, het weekoverleg vier keer afgezegd.',
      en: 'With the owner you look at what changed: two new planners never trained, the weekly review cancelled four times.' },
    { nl: 'Hij besluit: de senior planner traint ze, en het weekoverleg komt vast in de agenda, met een vervanger.',
      en: 'He decides: the senior planner trains them, and the weekly review is fixed in the calendar, with a stand-in.' },
    { nl: 'Zes weken later kijken jullie weer. {n:88} procent.',
      en: 'Six weeks later you look again: {n:88} percent.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(\w*manager\w*|management|operations|operationele|livegang|outcome|resultaatdata|reviewdatum|projectdashboard|projectoverleg|projectteam|vuistregel|mensuren|manuren)\b|(^|[.?!;]\s)(Eén|Acceptatiecriteria)\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%€]|:\S/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(plain)) throw new Error(`narration: "${MISREAD.exec(plain)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
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
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
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
.pm-mini .pm-axis,.pm-mini .pm-dash,.pm-mini .pm-dia,.pm-mini .pm-strike{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, aan de zijwand een kalenderstrook van twaalf vakken, waarop de drie stappen van de overdracht, de weken hypercare na de livegang, de negen weken van het bewijs en daarna de maanden van de follow-ups verschijnen. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant: de eigenaar die het overneemt. Op tafel een vel dat zich vult als overdrachtschecklist, als bewijs op één A4 en als openpuntenlijst. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: de lijnorganisatie, de proceseigenaar en de KPI; de stappen, de mensenkant en hypercare; negen weken met Sanne bij een kabelfabrikant; acceptatiecriteria en de ondertekening; open punten, output of resultaat en nieuwe wensen; het afsluitende overleg bij de kabelfabrikant; de dip na drie maanden, de gelaagde procesaudit en de KPI-review; follow-ups, de trigger en wat je doet als het wegzakt; en een levensmiddelenfabriek die van 81 terug naar 88 procent gaat.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, on the side wall a calendar strip of twelve cells, where the three handover steps, the hypercare weeks after go-live, the nine weeks of evidence and then the months of the follow-ups appear. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front: the owner who takes over. On the table a sheet that fills as the handover checklist, as the evidence on one page and as the open points list. At the right a panel with one card per scene, marked as example or diagram: the line organisation, the process owner and the KPI; the steps, the people side and hypercare; nine weeks with Sanne at a cable manufacturer; acceptance criteria and the sign-off; open points, outputs or outcomes and new wishes; the closing meeting at the cable manufacturer; the three-month dip, the layered process audit and the KPI review; follow-ups, the trigger and what to do when it slips; and a food plant that goes from 81 back to 88 percent.',
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

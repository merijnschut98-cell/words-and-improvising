// Dev tool, not shipped. Builds the explainer film "Bouwstenen, batch en
// continu / Building blocks, batch and continuous" for Procestechniek: de
// basis: the level 1 lesson eng.process.types (unit operations, batch and
// continuous, steady state, residence time). Its sister film
// eng.process.measure serves eng.process.variables on the same juice line;
// the two lessons are different topics, each with its own quiz, so each has
// its own film (Merijn, 2026-11-11: "two films if they don't fit well
// together"). The drawing and the shared stage live in this folder:
// world.mjs and stage-common.js; this film's own scenes are in stage.js.
//
//   node films/eng.process.plant/build.mjs            build the page
//   node films/eng.process.plant/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.process.plant.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.process). The lesson is Basis, so the film is a broad "how it works":
// one juice line from left to right and its unit operations, the batch vat
// against the continuous line, residence time on a tank (the lesson's 6 m³ at
// 3 m³/h) and why it is only an average (dead corners in a stirred tank), the
// holding tube of the worked example, and the batch-or-continuous debate in
// pharma with the sharp question asked of this line. Since lessons with a film
// no longer show their worked example, the film carries every point of the
// teach text and of the example. Cards with invented content say "voorbeeld".
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';
import { svgOf, cam, stageScriptOf, css, kitCss } from './world.mjs';

// ---------------------------------------------------------------- the model
// The lesson's facts and worked example, asserted against its current text
// (the build fails if the lesson drifts); {n:...} numbers are then checked
// against the Dutch lesson text by defineFilm. Facts checked against:
// - Unit operations: the classic chemical-engineering idea (pumping, heat
//   transfer, mixing, separation, drying, reaction); filling is packaging, so
//   the film calls it the step after the line, not a unit operation.
// - Residence time = volume / flow (mean residence time, Levenspiel, Chemical
//   Reaction Engineering): 6 m³ / 3 m³/h = 2 h; 50 % more flow gives 2/3 of
//   the time, 6 / 4,5 = 1 h 20 min. A stirred tank has a wide spread of
//   residence times around that mean: some fluid leaves within minutes, and
//   badly mixed (dead) zones hold some for far longer.
// - HTST pasteurisation of juice: heat in a plate heat exchanger, hold in a
//   holding tube for a set time, then cool and fill; holding tubes are sized
//   on the fastest particle (in laminar flow the centre runs at about twice
//   the mean speed), as the lesson says. 0,1 m³ / 12 m³/h = 30 s; at 18 m³/h
//   20 s.
// - The US FDA encourages continuous manufacturing of medicines (its
//   Emerging Technology Program, and the ICH Q13 guideline it adopted in
//   2023); batch records are what GMP auditors know.
const TYPES = 'eng.process.types';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const inOrder = (text, words) => { let from = 0; return words.every((w) => { const at = text.indexOf(w, from); if (at < 0) return false; from = at + w.length; return true; }); };
{
  const t = lessons.nl.get(TYPES);
  const tt = t.teach.join('\n');
  assert(inOrder(tt, ['unit operations', 'Pompen, verwarmen en koelen, mengen, scheiden, drogen en reageren']), 'types: the unit operations');
  assert(inOrder(tt, ['filtreren', 'centrifugeren', 'destilleren', 'indampen', 'water wegkoken']), 'types: the ways to separate');
  assert(inOrder(tt, ['batchproces', 'als één partij, met één batchnummer', 'farma, specialistische chemie, veel voeding', 'vullen, legen en reinigen leveren niks op', 'net iets anders']), 'types: batch');
  assert(inOrder(tt, ['continu proces', 'stationaire toestand', 'raffinaderijen, papier, bulkchemie, melkpoeder', 'Opstarten en stoppen duurt uren', 'off-spec', 'over of goedkoop weg', 'batchgewijs mengen dat een continue vullijn voedt']), 'types: continuous');
  assert(inOrder(tt, ['Verblijftijd', 'volume van die stap gedeeld door het debiet', 'Een tank van 6 m³ met 3 m³ per uur erdoorheen geeft 2 uur', 'verhitten, warmhouden, reageren, bezinken', 'Duw 50% meer door dezelfde tank', 'een derde korter']), 'types: residence time on a tank');
  assert(inOrder(tt, ['Verblijftijd is een gemiddelde', 'geroerde tank', 'paar minuten', 'urenlang in dode hoeken', 'pasteuriseren', 'ontwerp je op het snelste deel']), 'types: an average, dead corners');
  assert(inOrder(tt, ['farma van batch naar continu', 'FDA moedigen het aan', 'auditors kennen juist de batchregistratie', 'Welke stappen zijn hier batch, welke continu, en waar raken ze elkaar?']), 'types: pharma and the sharp question');
  const ex = t.example.text;
  assert(inOrder(ex, ['heethoudbuis', '0,1 m³ inhoud, met 12 m³ per uur', '30 seconden', 'minstens 20 seconden', '18 m³ per uur', '20 seconden: precies op het minimum', 'het snelste deeltje', 'doorzet', 'langere heethoudbuis']), 'types: the holding-tube example');
}
// residence time on a tank: 6 m³ at 3 m³/h, then 50 % more flow
const TANK = { V: 6, Q: 3 };
assert(TANK.V / TANK.Q === 2, '6 / 3 = 2 h');
assert(near(TANK.V / (TANK.Q * 1.5), (2 / 3) * 2, 1e-9) && near(TANK.V / (TANK.Q * 1.5) * 60, 80, 1e-9), '50 % more flow: a third shorter, 1 h 20 min');
// the holding tube: residence time = volume / flow
const VOL = 0.1;
const Q1 = 12;
const Q2 = 18;
const T1 = (VOL / Q1) * 3600;
const T2 = (VOL / Q2) * 3600;
assert(near(T1, 30, 1e-9) && near(T2, 20, 1e-9), '0,1 / 12 h = 30 s; 0,1 / 18 h = 20 s');
assert(T2 === 20, 'at 18 m³/h exactly the minimum');
assert(near(Q2 / Q1, 1.5, 1e-9) && near(T2 / T1, 2 / 3, 1e-9), '18 is 50 % more than 12, and 20 s is a third less than 30 s');

// ---------------------------------------------------------------- cameras (one move per scene)
const SCENES = ['units', 'batch', 'cont', 'tank', 'mix', 'hold', 'pharma'];
const HUDS = ['steps', 'badges', 'sep', 'batch', 'where', 'trend', 'tank', 'dead', 'calc', 'prof', 'pharma', 'pills'];
const CAM = [
  { from: cam([72, 0, 84], 680), to: cam([72, 0, 80], 656) },
  { from: cam([-160, 0, 100], 330, 420), to: cam([-150, 0, 96], 300, 430) },
  { from: cam([72, 0, 80], 656), to: cam([72, 0, 76], 640) },
  { from: cam([-160, 0, 110], 320, 480), to: cam([-160, 0, 104], 296, 480) },
  { from: cam([-160, 0, 104], 296, 480), to: cam([-160, 0, 98], 280, 480) },
  { from: cam([150, 8, 50], 330, 470, 200), to: cam([150, 8, 50], 300, 470, 200) },
  { from: cam([20, 0, 90], 560, 400), to: cam([10, 0, 86], 520, 410) },
];

// ---------------------------------------------------------------- the film
const DUR = [38, 40, 44, 38, 34, 50, 36];
const spec = {
  id: 'eng.process.plant',
  title: { nl: 'Bouwstenen, batch en continu', en: 'Building blocks, batch and continuous' },
  lessons: [TYPES],
  scenes: [
    {
      id: 's1', lesson: TYPES, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Een rij bouwstenen', en: 'A row of building blocks' },
      beats: [
        { nl: 'Een kleine sapfabriek: van het mengvat links tot de vulmachine rechts.', en: 'A small juice plant: from the mixing vat on the left to the filler on the right.', cues: ['mixer', 'filler'] },
        { nl: 'Elke stap is een {t:Unit operation|unit operation}: mengen, pompen, verhitten, heethouden, koelen.', en: 'Each step is a {t:Unit operation|unit operation}: mixing, pumping, heating, holding, cooling.', cue: { 'Unit operation': 'steps' }, cues: ['badges'] },
        { nl: 'Scheiden is er ook een: filtreren, centrifugeren, destilleren, indampen.', en: 'Separating is one too: filtering, centrifuging, distilling, evaporating.', cues: ['sep'] },
        { nl: 'Een zuivelfabriek of waterbedrijf gebruikt dezelfde bouwstenen, in een andere volgorde.', en: 'A dairy or a water works uses the same building blocks, in a different order.', cues: ['steps'] },
      ],
    },
    {
      id: 's2', lesson: TYPES, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Batch: één partij', en: 'Batch: one lot' },
      beats: [
        { nl: 'Het mengvat werkt als {t:Batchproces|batchproces}: een vaste hoeveelheid, stap voor stap bewerkt.', en: 'The mixing vat works as a {t:Batch process|batch process}: a fixed amount, processed step by step.', cue: { Batchproces: 'mixer' }, cues: ['batch'] },
        { nl: 'Vullen, mengen, legen: de hele partij krijgt één batchnummer.', en: 'Fill, mix, empty: the whole lot gets one batch number.', cues: ['batch', 'mixer'] },
        { nl: 'Flexibel en traceerbaar: goed voor farma, specialistische chemie en veel voeding.', en: 'Flexible and traceable: good for pharma, specialty chemicals and much food.', cues: ['batch', 'where'] },
        { nl: 'Maar vullen, legen en reinigen leveren niks op, en elke batch is net iets anders.', en: 'But filling, emptying and cleaning produce nothing, and every batch is a little different.', cues: ['batch'] },
      ],
    },
    {
      id: 's3', lesson: TYPES, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Continu: non-stop', en: 'Continuous: non-stop' },
      beats: [
        { nl: 'Vanaf de pomp is het een {t:Continu proces|continu proces}: het sap stroomt non-stop in en uit.', en: 'From the pump on it is a {t:Continuous process|continuous process}: the juice flows in and out non-stop.', cue: { 'Continu proces': 'line' }, cues: ['hold'] },
        { nl: 'Draait de lijn, dan is er een {t:Stationaire toestand|stationaire toestand}: elke waarde blijft uur na uur gelijk.', en: 'Once the line runs, it is at {t:Steady state|steady state}: every value stays the same, hour after hour.', cue: { 'Stationaire toestand': 'trend' } },
        { nl: 'Efficiënt bij grote volumes: raffinaderijen, papier, bulkchemie, melkpoeder.', en: 'Efficient at large volumes: refineries, paper, bulk chemicals, milk powder.', cues: ['where', 'trend'] },
        { nl: 'Opstarten en stoppen duurt uren en geeft product buiten spec. Zo’n lijn stopt liever niet.', en: 'Starting up and shutting down take hours and make off-spec product. Such a line hates stopping.', cues: ['trend'] },
        { nl: 'Veel fabrieken combineren: een batchgewijs mengvat voedt een continue lijn.', en: 'Many plants combine them: a batch mixing vat feeds a continuous line.', cues: ['mixer', 'line'] },
      ],
    },
    {
      id: 's4', lesson: TYPES, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Hoe lang in de tank', en: 'How long in the tank' },
      beats: [
        { nl: 'Stel: het vat draait continu. Er stroomt evenveel in als uit.', en: 'Suppose the vat runs continuously. As much flows in as out.', cues: ['mixer', 'tank'] },
        { nl: '{t:Verblijftijd|Verblijftijd} = volume / debiet: {n:6} m³ / {n:3} m³ per uur = {n:2} uur.', en: '{t:Residence time|Residence time} = volume / flow: {n:6} m³ / {n:3} m³ per hour = {n:2} hours.', cue: { Verblijftijd: 'tank' } },
        { nl: '{n:50}% meer debiet door dezelfde tank: elke liter zit er een derde korter in.', en: '{n:50}% more flow through the same tank: every litre stays a third less time.', cues: ['tank'] },
        { nl: 'Vraag ernaar zodra kwaliteit van tijd afhangt: verhitten, warmhouden, reageren, bezinken.', en: 'Ask about it whenever quality depends on time: heating, keeping hot, reacting, settling.', cues: ['tank'] },
      ],
    },
    {
      id: 's5', lesson: TYPES, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Een gemiddelde', en: 'An average' },
      beats: [
        { nl: 'Verblijftijd is een gemiddelde. In een geroerde tank schiet een deel in minuten naar de uitlaat.', en: 'Residence time is an average. In a stirred tank some product shoots to the outlet in minutes.', cues: ['dead', 'mixer'] },
        { nl: 'Een ander deel hangt urenlang in dode hoeken.', en: 'Another part hangs in dead corners for hours.', cues: ['dead'] },
        { nl: 'Moet product een minimale tijd blijven, zoals bij pasteuriseren? Ontwerp dan op het snelste deel.', en: 'Must product stay a minimum time, as in pasteurising? Then design on the fastest part.', cues: ['dead'] },
      ],
    },
    {
      id: 's6', lesson: TYPES, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'Hoe lang in de buis', en: 'How long in the tube' },
      beats: [
        { nl: 'De heethoudbuis: {n:0.1} m³ inhoud, {n:12} m³ per uur erdoorheen.', en: 'The holding tube: {n:0.1} m³ inside, {n:12} m³ per hour flowing through.', cues: ['hold'] },
        { nl: 'Verblijftijd: {n:0.1} / {n:12} uur = {n:30} seconden. Het plan eist er minstens {n:20}.', en: 'Residence time: {n:0.1} / {n:12} hours = {n:30} seconds. The plan demands at least {n:20}.', cues: ['calc', 'hold'] },
        { nl: 'Bij {n:18} m³ per uur: {n:20} seconden. Precies het minimum, zonder marge.', en: 'At {n:18} m³ per hour: {n:20} seconds. Exactly the minimum, no margin.', cues: ['calc'] },
        { nl: 'In het midden stroomt het sap sneller: ontwerp op het snelste deeltje.', en: 'In the centre the juice flows faster: design on the fastest particle.', cues: ['prof'] },
        { nl: 'Doorzet en verblijftijd hangen aan elkaar: meer output vraagt een langere buis.', en: 'Throughput and residence time are tied: more output needs a longer tube.', cues: ['hold'] },
      ],
    },
    {
      id: 's7', lesson: TYPES, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'Batch of continu?', en: 'Batch or continuous?' },
      beats: [
        { nl: 'In de farma is het een discussie: van batch naar continu?', en: 'In pharma it is a debate: from batch to continuous?', cues: ['pharma'] },
        { nl: 'De Amerikaanse FDA moedigt continu aan. Auditors kennen juist de batchregistratie.', en: 'The US FDA encourages continuous. Auditors know the batch record best.', cues: ['pharma'] },
        { nl: 'Scherpe vraag: welke stappen zijn batch, welke continu, en waar raken ze elkaar?', en: 'Sharp question: which steps are batch, which continuous, and where do they meet?', cues: ['pharma'] },
        { nl: 'Hier: het mengvat is batch, de rest continu. Ze raken elkaar bij de pomp.', en: 'Here: the mixing vat is batch, the rest continuous. They meet at the pump.', cues: ['pills', 'mixer', 'line', 'pump'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this explains fully. No "/", "&", "×", "=" or
// units as symbols in the spoken text: units are written out.
// Words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/voice-ab/phon.py with nl_NL-alex-medium): batch (read "batx"),
// unit operation (read "uunit oopiraasjon"), continu and continue (stress on
// con-), FDA (read "vdaa") and toezichthouders (h dropped) get Dutch spoken
// forms in films/_kit/timeline.mjs (SAY); the lone "batch" there is shared
// with eng.moulding.materials. off-spec, stationaire, verblijftijd,
// pasteuriseren, auditors and batchregistratie (with the batch rule) are read
// right.
const SAY = [
  [ // s1 a row of building blocks
    { nl: 'Dit is een kleine sapfabriek. Links staat een mengvat, rechts een vulmachine, en daartussen stroomt het sap door een rij apparaten.',
      en: 'This is a small juice plant. On the left stands a mixing vat, on the right a filler, and in between the juice flows through a row of equipment.' },
    { nl: 'Elke stap in die rij is een {t:Unit operation|unit operation}: een fysische basisstap die in elke procesfabriek terugkomt. Hier zijn dat mengen, pompen, verhitten, heethouden en koelen.',
      en: 'Each step in that row is a {t:Unit operation|unit operation}: a basic physical step that comes back in every process plant. Here they are mixing, pumping, heating, holding and cooling.' },
    { nl: 'Ook scheiden is een unit operation. Dat kan op veel manieren: filtreren, centrifugeren, destilleren, of indampen, waarbij je water wegkookt om een vloeistof in te dikken.',
      en: 'Separating is a unit operation too. It has many forms: filtering, centrifuging, distilling, or evaporating, where you boil off water to concentrate a liquid.' },
    { nl: 'Een zuivelfabriek, een chemische fabriek en een waterbedrijf gebruiken dezelfde bouwstenen, alleen in een andere volgorde.',
      en: 'A dairy, a chemical plant and a water works use the same building blocks, just in a different order.' },
  ],
  [ // s2 batch
    { nl: 'Kijk eerst naar het mengvat. Het werkt als {t:Batchproces|batchproces}: een vaste hoeveelheid gaat erin, wordt stap voor stap bewerkt, en komt er als één partij weer uit.',
      en: 'Look at the mixing vat first. It works as a {t:Batch process|batch process}: a fixed amount goes in, is processed step by step, and comes out again as one lot.' },
    { nl: 'Vullen, mengen, en dan het vat leeg. Die hele partij krijgt één batchnummer, met één registratie van wat erin ging en wat er gebeurde.',
      en: 'Fill it, mix it, then empty the vat. That whole lot gets one batch number, with one record of what went in and what happened.' },
    { nl: 'Dat is flexibel en makkelijk te traceren. Het past bij veel recepten en kleine volumes: in de farma, de specialistische chemie, en veel voeding.',
      en: 'That is flexible and easy to trace. It suits many recipes and small volumes: in pharma, specialty chemicals, and much of the food industry.' },
    { nl: 'Het nadeel: vullen, legen en reinigen leveren niks op, en elke batch is net iets anders.',
      en: 'The downside: filling, emptying and cleaning produce nothing, and every batch comes out a little different.' },
  ],
  [ // s3 continuous
    { nl: 'Vanaf de pomp is het een {t:Continu proces|continu proces}. Het sap stroomt de hele tijd in en uit: door de warmtewisselaar, de heethoudbuis en de koeler, naar de vulmachine.',
      en: 'From the pump on it is a {t:Continuous process|continuous process}. The juice flows in and out all the time: through the heat exchanger, the holding tube and the cooler, to the filler.' },
    { nl: 'Draait de lijn eenmaal, dan zit ze in een {t:Stationaire toestand|stationaire toestand}. De temperaturen, drukken en debieten blijven op elke plek gelijk, uur na uur, en er hoopt nergens iets op.',
      en: 'Once the line runs, it sits at {t:Steady state|steady state}. The temperatures, pressures and flows hold steady at every point, hour after hour, and nothing builds up.' },
    { nl: 'Dat is efficiënt bij grote volumes: in raffinaderijen, papierfabrieken, de bulkchemie, en bij melkpoeder.',
      en: 'That is efficient at large volumes: in refineries, paper mills, bulk chemicals, and milk powder.' },
    { nl: 'Maar opstarten en stoppen duurt uren, en wat je in die tijd maakt, voldoet niet aan de specificatie. Dat heet off-spec: het moet over, of gaat goedkoop weg. Zulke lijnen stoppen dus liever niet.',
      en: 'But starting up and shutting down take hours, and what you make in that time does not meet the specification. That is called off-spec: it must be reworked, or sold off cheaply. So such lines hate stopping.' },
    { nl: 'Veel fabrieken combineren de twee, zoals hier: een mengvat dat batchgewijs werkt, voedt een continue lijn.',
      en: 'Many plants combine the two, as here: a mixing vat that works in batches feeds a continuous line.' },
  ],
  [ // s4 residence time on a tank
    { nl: 'Hoe lang zit het product in een stap? Stel dat dit vat continu draait: er stroomt de hele tijd evenveel in als uit.',
      en: 'How long does the product spend in a step? Suppose this vat runs continuously: as much flows in as flows out, all the time.' },
    { nl: 'Die tijd heet de {t:Verblijftijd|verblijftijd}: gemiddeld het volume van de stap, gedeeld door het debiet, het volume dat er per uur doorheen gaat. Een tank van {n:6} kubieke meter, met {n:3} kubieke meter per uur erdoorheen, geeft {n:2} uur.',
      en: 'That time is the {t:Residence time|residence time}: on average the volume of the step, divided by the flow, the volume that passes through per hour. A tank of {n:6} cubic metres, with {n:3} cubic metres per hour flowing through, gives {n:2} hours.' },
    { nl: 'Meer debiet betekent minder verblijftijd. Duw je {n:50} procent meer door dezelfde tank, dan zit elke liter er een derde korter in: hier één uur en twintig minuten.',
      en: 'More flow means less residence time. Push {n:50} percent more through the same tank, and every litre spends a third less time inside: here one hour and twenty minutes.' },
    { nl: 'Vraag dus naar de verblijftijd zodra de kwaliteit van tijd afhangt: bij verhitten, warmhouden, reageren of bezinken.',
      en: 'So ask about the residence time whenever quality depends on time: in heating, keeping hot, reacting or settling.' },
  ],
  [ // s5 an average: dead corners
    { nl: 'Maar let op: verblijftijd is een gemiddelde. In een geroerde tank schiet een deel van het product in een paar minuten van de inlaat naar de uitlaat.',
      en: 'But watch out: residence time is an average. In a stirred tank some of the product shoots from the inlet to the outlet in a few minutes.' },
    { nl: 'Een ander deel hangt urenlang in de dode hoeken, waar het roerwerk nauwelijks komt.',
      en: 'Another part hangs for hours in the dead corners, where the agitator hardly reaches.' },
    { nl: 'Moet product een minimale tijd ergens blijven, zoals bij pasteuriseren, kiemdodend verhitten, dan ontwerp je op het snelste deel, niet op het gemiddelde.',
      en: 'If product must stay somewhere for a minimum time, as in pasteurising, heating to kill germs, you design on the fastest part, not on the average.' },
  ],
  [ // s6 the holding tube (the worked example)
    { nl: 'Terug naar de sapfabriek. Na het verhitten moet het sap een vaste tijd heet blijven, om ziektekiemen te doden. Daarvoor stroomt het door de heethoudbuis: {n:0.1} kubieke meter inhoud, met {n:12} kubieke meter per uur erdoorheen.',
      en: 'Back to the juice plant. After heating, the juice must stay hot for a set time, to kill germs. So it flows through the holding tube: {n:0.1} cubic metres inside, with {n:12} cubic metres per hour flowing through.' },
    { nl: 'De verblijftijd is het volume gedeeld door het debiet. Dat geeft {n:30} seconden, en het voedselveiligheidsplan eist er minstens {n:20}.',
      en: 'The residence time is the volume divided by the flow. That gives {n:30} seconds, and the food safety plan demands at least {n:20}.' },
    { nl: 'Wil productie naar {n:18} kubieke meter per uur, dan wordt de verblijftijd {n:20} seconden: precies op het minimum, zonder marge.',
      en: 'If production wants {n:18} cubic metres per hour, the residence time becomes {n:20} seconds: exactly on the minimum, with no margin.' },
    { nl: 'En dat is nog een gemiddelde. In het midden van de buis stroomt het sap sneller, dus het snelste sap zit er korter dan {n:20} seconden in. Daarom ontwerp je een heethoudbuis op het snelste deeltje.',
      en: 'And that is still an average. In the centre of the tube the juice flows faster, so the fastest juice spends less than {n:20} seconds inside. That is why you design a holding tube on the fastest particle.' },
    { nl: 'In een continu proces hangen doorzet, de output per uur, en verblijftijd aan elkaar. Meer output vraagt een langere heethoudbuis, niet alleen een snellere pomp.',
      en: 'In a continuous process, throughput, the output per hour, and residence time are tied together. More output needs a longer holding tube, not just a faster pump.' },
  ],
  [ // s7 batch or continuous: pharma, and the sharp question
    { nl: 'Ook experts zijn het niet altijd eens. In de farma loopt de discussie of fabrieken van batch naar continu moeten.',
      en: 'Experts do not always agree either. In pharma the debate is whether plants should move from batch to continuous.' },
    { nl: 'Toezichthouders zoals de Amerikaanse FDA moedigen continu produceren aan. Maar auditors kennen juist de batchregistratie: één partij, één dossier.',
      en: 'Regulators such as the US FDA encourage continuous manufacturing. But auditors know the batch record best: one lot, one file.' },
    { nl: 'Een scherpe vraag in elke fabriek is daarom: welke stappen zijn hier batch, welke continu, en waar raken ze elkaar?',
      en: 'So a sharp question in any plant is: which steps here are batch, which are continuous, and where do they meet?' },
    { nl: 'In deze sapfabriek is het mengvat batch, en de rest van de lijn continu. Ze raken elkaar bij de pomp onder het vat.',
      en: 'In this juice plant the mixing vat is batch, and the rest of the line is continuous. They meet at the pump under the vat.' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
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
// no symbol the voice would read aloud in the spoken text
for (const [si, sc] of SAY.entries()) for (const b of sc) for (const lang of ['nl', 'en']) if (/[/&×=]/.test(b[lang])) throw new Error(`narration: a symbol in scene ${si + 1} (${lang})`);

// ---------------------------------------------------------------- page
const svg = svgOf(HUDS);
const script = stageScriptOf({ SCENES, HUDS, dur: DUR, T1, T2 }, CAM, new URL('./stage.js', import.meta.url));

const label = {
  nl: 'Een kleine sapfabriek van links naar rechts: een mengvat op poten met roerwerkaandrijving, mangat, inlaat, kijkglas en onderin een niveaumeter; een pomp in de leiding; een Coriolismeter; een manometer; een platenwarmtewisselaar met de leidingen voor heet water en een regelklep; een Pt100 in een beschermhuls; een heethoudbuis in zigzag op twee steunen; een platenkoeler met ijswaterleidingen; en een vulmachine met carrousel, transportband en flessen. Kaarten tonen de stappen, de fasen van een batch, waar batch en continu passen, een trend in stationaire toestand, de verblijftijd in een tank van 6 m³, een geroerde tank met een kortsluitstroom en dode hoeken, de som van de heethoudbuis met het snelheidsprofiel, en de vraag welke stappen batch en welke continu zijn.',
  en: 'A small juice plant from left to right: a mixing vat on legs with an agitator drive, manhole, inlet, sight glass and a level meter at the bottom; an in-line pump; a Coriolis meter; a pressure gauge; a plate heat exchanger with its hot-water pipes and a control valve; a Pt100 in a thermowell; a zigzag holding tube on two stands; a plate cooler with ice-water pipes; and a filler with a carousel, a conveyor and bottles. Cards show the steps, the phases of a batch, where batch and continuous fit, a steady-state trend, the residence time in a 6 m³ tank, a stirred tank with a short-cut stream and dead corners, the holding-tube sum with the velocity profile, and the question which steps are batch and which continuous.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

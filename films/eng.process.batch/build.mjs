// Dev tool, not shipped. Builds the explainer film "Een batch van 300 minuten
// / A 300-minute batch" for Procestechniek: de basis: the level 1 lesson
// eng.process.batch of the topic Batchcapaciteit en opschalen (batch cycle
// time, capacity per vessel, QC release, CIP, the bottleneck, ISA-88 phases
// and batch reports). It plays on the juice line of its sister films
// eng.process.plant and eng.process.measure, so the process films read as one
// series: the drawing and the shared stage are theirs
// (films/eng.process.plant/world.mjs and stage-common.js), this film's own
// cards are in stage.js here. The mixing vat of that line follows the cycle on
// the cards (it fills, mixes, waits, drains, is rinsed).
//
//   node films/eng.process.batch/build.mjs            build the page
//   node films/eng.process.batch/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.process.batch.html. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5 (eng.process).
// The lesson is Basis, so the film is a broad "how it works": a batch cycle
// and what counts in it, capacity per vessel, the paint vat of the worked
// example in a clock ring, QC release, CIP and the levers, the campaign
// debate, the inline viscosity meter (265 min, 679 kg/h, +13 %), the
// bottleneck of a reactor and a filter, the recipe and its phases under
// ISA-88, batch reports and the trap of vessels sitting full, and the sharp
// question. Since lessons with a film no longer show their worked example,
// the film carries every point of the teach text and of the example. Cards
// with invented content say "voorbeeld"; diagrams say "schema".
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';
import { svgOf, cam, stageScriptOf, css as worldCss, kitCss, C as WORLD } from '../eng.process.plant/world.mjs';

// ---------------------------------------------------------------- the model
// The lesson's facts and worked example, asserted against its current text
// (the build fails if the lesson drifts); {n:...} numbers are then checked
// against the Dutch lesson text by defineFilm. Facts checked against:
// - ISA-88 (ANSI/ISA-88.00.01, IEC 61512-1): the procedural control model
//   runs procedure → unit procedure → operation → phase; the phase is the
//   smallest element that carries out a process-oriented task (charge, heat,
//   hold, transfer), with parameters (set values) from the recipe. The film
//   says the standard "often" applies and calls the phase the smallest step.
// - Batch records / batch reports: batch control systems log each phase with
//   its start and end time and parameters (the electronic batch record in
//   pharma, 21 CFR Part 11); the film says only that each phase is logged.
// - CIP: rinsing, detergent (often hot caustic, sometimes acid) and final
//   rinse circulated through tanks (by spray balls or rotating heads) and
//   pipes, without dismantling; the lesson's "hot water and detergent" is the
//   simple version, and the film keeps it.
// - Bottleneck: the stage with the longest time per batch per parallel
//   vessel (two reactors of 6 h in turn = one batch per 3 h); with the 3 h
//   filter both stages are at 3 h, so the plant runs with no margin, which
//   the film says (the lesson: "zolang het filter het bijhoudt").
// - "Often a third of the cycle" is the lesson's rule of thumb (hedged:
//   "vaak"); in the paint example fill, drain, clean and the QC wait are 190
//   of 300 minutes, which the film says as "here even more than half".
const BATCH = 'eng.process.batch';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const inOrder = (text, words) => { let from = 0; return words.every((w) => { const at = text.indexOf(w, from); if (at < 0) return false; from = at + w.length; return true; }); };
{
  const l = lessons.nl.get(BATCH);
  const t = l.teach;
  assert(inOrder(t[0], ['in cycli', 'alles tussen twee starts', 'vullen, opwarmen, reageren of mengen, afkoelen, legen, reinigen', 'wachten op een operator, een labuitslag of een vrije tank verderop', 'batchgrootte / cyclustijd', '5 uur met 4 ton', '0,8 ton per uur', '19 ton per dag', 'dag en nacht']), 'teach 1: cycle time and capacity');
  assert(inOrder(t[1], ['Elke minuut', 'even zwaar', 'reactie korter', 'vullen, legen, reinigen en wachten', 'een derde', 'makkelijker in te korten', 'QC-vrijgave', 'goedkeuring van het lab', 'CIP, cleaning in place', 'heet water en reinigingsmiddel', 'zonder ze uit elkaar te halen', 'Snellere labtests', 'inline meting in de leiding', 'korter CIP-programma', 'capaciteit']), 'teach 2: every minute, QC release, CIP, the levers');
  assert(inOrder(t[2], ['meerdere vaten achter elkaar', 'bottleneck', 'langste tijd per batch', 'aantal parallelle vaten', 'reactor van 6 uur', 'filter van 3 uur', 'één batch per 6 uur', 'tweede reactor', 'elke 3 uur', 'zolang het filter het bijhoudt']), 'teach 3: the bottleneck');
  assert(inOrder(t[3], ['ISA-88', 'recept', 'kleine stappen', 'fase', 'doseren, opwarmen, aanhouden, overpompen', 'instelwaarden', 'besturingssysteem', 'batchrapport', 'echte tijd per fase', 'laatste 50 batches', 'snelste en de traagste', 'grootste capaciteitswinst']), 'teach 4: ISA-88, phases, batch reports');
  assert(inOrder(t[4], ['na elke batch', 'campagne', 'hetzelfde product', 'sparen CIP-tijd', 'hygiënisch', 'langere opslag', 'vol staan bij de ploegwissel of in pauzes', 'niemand de volgende fase start', 'Hoeveel minuten per batch staat dit vat te wachten op een mens, het lab of een vrije tank?']), 'teach 5: campaigns, the trap, the question');
  assert(inOrder(l.example.text, ['mengvat voor verf', '3.000 kg per batch', 'vullen 40', 'dispergeren 90', 'pigmentpoeder fijn verdelen in de vloeistof', 'QC-monster 50', 'bijstellen 20', 'aftappen 60', 'reinigen 40', '300 minuten', '3.000 kg / 5 uur = 600 kg per uur', 'lab de hele locatie bedient', 'inline viscositeitsmeter', 'hoe dik de verf is', 'vast spoedmoment', '15 minuten', '265 minuten', '3.000 / 4,417 uur = 679 kg per uur', '13% meer uit hetzelfde vat', 'zonder aan het dispergeren te komen']), 'the paint example');
}
// capacity per vessel: 4 t in 5 h
assert(4 / 5 === 0.8 && Math.round(0.8 * 24) === 19, '4 t / 5 h = 0,8 t/h, about 19 t a day');
// the paint vat
const PAINT = { fill: 40, disperse: 90, qc: 50, adjust: 20, drain: 60, clean: 40 };
const CYCLE = Object.values(PAINT).reduce((a, b) => a + b, 0);
assert(CYCLE === 300, '40 + 90 + 50 + 20 + 60 + 40 = 300 min');
assert(3000 / (CYCLE / 60) === 600, '3.000 kg / 5 h = 600 kg/h');
assert(PAINT.fill + PAINT.qc + PAINT.drain + PAINT.clean === 190 && 190 / 300 > 0.5, 'fill, wait, drain, clean: 190 of 300 min, more than half');
const CYCLE2 = CYCLE - PAINT.qc + 15;
assert(CYCLE2 === 265 && near(CYCLE2 / 60, 4.417, 0.0005), 'QC wait 50 → 15: 265 min = 4,417 h');
assert(Math.round(CYCLE2 / 60 * 60 - 240) === 25, '265 min is 4 h 25 min');
const CAP2 = 3000 / (CYCLE2 / 60);
assert(Math.round(CAP2) === 679 && Math.round((CAP2 / 600 - 1) * 100) === 13, '3.000 / 4,417 h = 679 kg/h, +13 %');
// the bottleneck: reactor 6 h, filter 3 h; then two reactors in turn
assert(Math.max(6 / 1, 3 / 1) === 6 && Math.max(6 / 2, 3 / 1) === 3, 'one batch per 6 h, then per 3 h');

// ---------------------------------------------------------------- cameras (one move per scene)
const SCENES = ['cycle', 'paint', 'qc', 'cip', 'inline', 'neck', 'recipe', 'report'];
const HUDS = ['ring', 'lab', 'cip', 'neck', 'recipe', 'report'];
const VX = WORLD.VAT.c[0];
const CAM = [
  { from: cam([VX, 0, 104], 390, 126), to: cam([VX, 0, 100], 370, 126) },
  { from: cam([VX, 0, 104], 390, 126), to: cam([VX, 0, 100], 370, 126) },
  { from: cam([VX, 0, 100], 380, 126), to: cam([VX, 0, 96], 360, 126) },
  { from: cam([VX, 0, 110], 390, 166), to: cam([VX, 0, 106], 370, 166) },
  { from: cam([VX + 20, 0, 96], 410, 126), to: cam([VX + 20, 0, 92], 390, 126) },
  { from: cam([VX + 40, 0, 96], 420), to: cam([VX + 40, 0, 92], 400) },
  { from: cam([VX, 0, 104], 390, 158), to: cam([VX, 0, 100], 370, 158) },
  { from: cam([VX, 0, 100], 380, 158), to: cam([VX, 0, 96], 360, 158) },
];

// ---------------------------------------------------------------- the film
const DUR = [36, 46, 26, 46, 34, 40, 36, 36];
const spec = {
  id: 'eng.process.batch',
  title: { nl: 'Een batch van 300 minuten', en: 'A 300-minute batch' },
  lessons: [BATCH],
  scenes: [
    {
      id: 's1', lesson: BATCH, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'De cyclus', en: 'The cycle' },
      beats: [
        { nl: 'Een batchvat werkt in cycli: vullen, opwarmen, reageren of mengen, afkoelen, legen, reinigen.', en: 'A batch vessel works in cycles: fill, heat, react or mix, cool, empty, clean.', cues: ['mixer', 'ring'] },
        { nl: '{t:Batchcyclustijd|Batchcyclustijd}: alles tussen twee starts, ook het wachten.', en: '{t:Batch cycle time|Batch cycle time}: everything between two starts, waiting included.', cue: { Batchcyclustijd: 'ring' } },
        { nl: 'Capaciteit = batchgrootte / cyclustijd: {n:4} ton in {n:5} uur is {n:0.8} ton per uur.', en: 'Capacity = batch size / cycle time: {n:4} tonnes in {n:5} hours is {n:0.8} tonnes per hour.', cues: ['ring'] },
      ],
    },
    {
      id: 's2', lesson: BATCH, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Een verfbatch', en: 'A paint batch' },
      beats: [
        { nl: 'Voorbeeld: verf, {n:3000} kg per batch. Vullen {n:40} min, dispergeren {n:90}: pigment fijn verdelen.', en: 'Example: paint, {n:3000} kg per batch. Fill {n:40} min, disperse {n:90}: break up the pigment.', cues: ['ring', 'mixer'] },
        { nl: 'Wachten op het QC-monster {n:50}, bijstellen {n:20}, aftappen {n:60}, reinigen {n:40}: {n:300} minuten.', en: 'Wait for the QC sample {n:50}, adjust {n:20}, fill off {n:60}, clean {n:40}: {n:300} minutes.', cues: ['ring'] },
        { nl: 'Capaciteit: {n:3000} kg / {n:5} uur = {n:600} kg per uur.', en: 'Capacity: {n:3000} kg / {n:5} hours = {n:600} kg per hour.', cues: ['ring'] },
        { nl: 'Elke minuut telt even zwaar. Vullen, legen, reinigen, wachten: vaak een derde van de cyclus.', en: 'Every minute counts the same. Filling, emptying, cleaning, waiting: often a third of the cycle.', cues: ['ring'] },
      ],
    },
    {
      id: 's3', lesson: BATCH, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Wachten op het lab', en: 'Waiting for the lab' },
      beats: [
        { nl: '{t:QC-vrijgave|QC-vrijgave}: het lab keurt de batch goed voordat hij door mag.', en: '{t:QC release|QC release}: the lab approves the batch before it may move on.', cue: { 'QC-vrijgave': 'lab' } },
        { nl: 'Het lab bedient de hele locatie. Het vat staat {n:50} minuten vol en stil.', en: 'The lab serves the whole site. The vessel sits full and still for {n:50} minutes.', cues: ['lab', 'mixer'] },
      ],
    },
    {
      id: 's4', lesson: BATCH, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Reinigen', en: 'Cleaning' },
      beats: [
        { nl: '{t:CIP|CIP}, cleaning in place: spoelen met heet water en reinigingsmiddel, zonder demonteren.', en: '{t:CIP|CIP}, cleaning in place: rinsing with hot water and detergent, without taking things apart.', cue: { CIP: 'cip' }, cues: ['mixer'] },
        { nl: 'Snellere labtests, een meting in de leiding of een korter CIP-programma: meer capaciteit.', en: 'Faster lab tests, a measurement in the pipe or a shorter CIP programme: more capacity.', cues: ['cip'] },
        { nl: 'Na elke batch reinigen, of eerst een campagne? Spaart CIP-tijd, vraagt hygiënebewijs en opslag.', en: 'Clean after every batch, or run a campaign first? It saves CIP time, but needs hygiene proof and storage.', cues: ['cip'] },
      ],
    },
    {
      id: 's5', lesson: BATCH, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Minder wachten', en: 'Less waiting' },
      beats: [
        { nl: 'Een inline viscositeitsmeter meet in de leiding hoe dik de verf is. Plus een vast spoedmoment.', en: 'An inline viscosity meter measures in the pipe how thick the paint is. Plus a fast-track sample slot.', cues: ['line', 'ring'] },
        { nl: 'Wachten op QC: van {n:50} naar {n:15} minuten. Nieuwe cyclus: {n:265} minuten.', en: 'Waiting for QC: from {n:50} to {n:15} minutes. New cycle: {n:265} minutes.', cues: ['ring'] },
        { nl: '{n:3000} kg / {n:4.417} uur = {n:679} kg per uur: {n:13}% meer, zonder aan het dispergeren te komen.', en: '{n:3000} kg / {n:4.417} hours = {n:679} kg per hour: {n:13}% more, without touching the dispersing.', cues: ['ring'] },
      ],
    },
    {
      id: 's6', lesson: BATCH, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'De bottleneck', en: 'The bottleneck' },
      beats: [
        { nl: 'Een reactor van {n:6} uur voedt een filter van {n:3} uur: één batch per {n:6} uur.', en: 'A {n:6}-hour reactor feeds a {n:3}-hour filter: one batch every {n:6} hours.', cues: ['neck'] },
        { nl: 'Een tweede reactor ernaast: elke {n:3} uur een batch, zolang het filter het bijhoudt.', en: 'A second reactor beside it: a batch every {n:3} hours, as long as the filter keeps pace.', cues: ['neck'] },
        { nl: '{t:Bottleneck|Bottleneck}: de langste tijd per batch, gedeeld door het aantal parallelle vaten.', en: '{t:Bottleneck|Bottleneck}: the longest time per batch, divided by the number of parallel vessels.', cue: { Bottleneck: 'neck' } },
      ],
    },
    {
      id: 's7', lesson: BATCH, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'Het recept', en: 'The recipe' },
      beats: [
        { nl: 'Batchbesturing volgt vaak ISA-88: een recept bestaat uit steeds kleinere stappen.', en: 'Batch control often follows ISA-88: a recipe is built from ever smaller steps.', cues: ['recipe'] },
        { nl: 'De kleinste stap is een {t:Fase|fase}: doseren, opwarmen, aanhouden, overpompen, met instelwaarden.', en: 'The smallest step is a {t:Phase|phase}: charge, heat, hold, transfer, with set values.', cue: { Fase: 'recipe' }, cues: ['mixer'] },
        { nl: 'Het besturingssysteem voert elke fase uit en legt hem vast in een batchrapport.', en: 'The control system runs each phase and logs it in a batch report.', cues: ['recipe'] },
      ],
    },
    {
      id: 's8', lesson: BATCH, level: 1, dur: DUR[7], still: 0.9, title: { nl: 'Waar de tijd heen gaat', en: 'Where the time goes' },
      beats: [
        { nl: 'Vraag de echte tijd per fase over de laatste {n:50} batches. Het verschil is vaak de grootste winst.', en: 'Ask for the actual time per phase over the last {n:50} batches. The gap is often the biggest gain.', cues: ['report'] },
        { nl: 'Valkuil: vaten die vol staan bij de ploegwissel of in de pauze.', en: 'A trap: vessels sitting full at shift change or in breaks.', cues: ['report', 'mixer'] },
        { nl: 'Scherpe vraag: hoeveel minuten per batch wacht dit vat op een mens, het lab of een vrije tank?', en: 'Sharp question: per batch, how many minutes does this vessel wait for a person, the lab or a free tank?', cues: ['report'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this explains fully. No "/", "&", "×", "=" or
// units as symbols in the spoken text: units are written out, and 4,417 hours
// is said as "vier uur en vijfentwintig minuten" (the card shows 4,417).
// Words checked with espeak-ng phonemes (Piper's own bridge, nl_NL-alex-medium,
// films/_kit/voice-ab/phon.py): see the SAY rules for CIP, QC and ISA-88 in
// films/_kit/timeline.mjs; batch (betsj) comes from the plant film's rule.
const SAY = [
  [ // s1 the cycle, cycle time, capacity
    { nl: 'Dit mengvat werkt in batches: het maakt steeds één partij, en dan begint het opnieuw. Eén cyclus is vullen, opwarmen, reageren of mengen, afkoelen, legen en reinigen.',
      en: 'This mixing vessel works in batches: it makes one lot at a time, and then starts again. One cycle is fill, heat, react or mix, cool, empty and clean.' },
    { nl: 'De {t:Batchcyclustijd|batchcyclustijd} is alles tussen twee starts van hetzelfde vat. Dus ook het wachten: op een operator, op een labuitslag, of op een vrije tank verderop.',
      en: 'The {t:Batch cycle time|batch cycle time} is everything between two starts of the same vessel. So the waiting counts too: for an operator, for a lab result, or for a free tank downstream.' },
    { nl: 'De capaciteit van een vat is de batchgrootte gedeeld door de cyclustijd. Een cyclus van {n:5} uur met {n:4} ton geeft {n:0.8} ton per uur. Draait het vat dag en nacht, dan is dat zo’n {n:19} ton per dag.',
      en: 'The capacity of a vessel is the batch size divided by the cycle time. A {n:5}-hour cycle of {n:4} tonnes gives {n:0.8} tonnes per hour. If the vessel runs day and night, that is about {n:19} tonnes per day.' },
  ],
  [ // s2 the paint batch (the worked example)
    { nl: 'Een voorbeeld: een mengvat voor verf, dat {n:3000} kilo per batch maakt. Vullen duurt {n:40} minuten. Dan volgt {n:90} minuten dispergeren: het pigmentpoeder fijn verdelen in de vloeistof.',
      en: 'An example: a paint mixing vessel that makes {n:3000} kilograms per batch. Filling takes {n:40} minutes. Then come {n:90} minutes of dispersing: breaking up the pigment powder into the liquid.' },
    { nl: 'Daarna {n:50} minuten wachten op de uitslag van het QC-monster, {n:20} minuten bijstellen, {n:60} minuten aftappen en {n:40} minuten reinigen. Samen {n:300} minuten: vijf uur.',
      en: 'After that, {n:50} minutes of waiting for the result of the QC sample, {n:20} minutes to adjust, {n:60} minutes to fill off and {n:40} minutes to clean. Together {n:300} minutes: five hours.' },
    { nl: 'De capaciteit is dus {n:3000} kilo gedeeld door {n:5} uur: {n:600} kilo per uur.',
      en: 'So the capacity is {n:3000} kilograms divided by {n:5} hours: {n:600} kilograms per hour.' },
    { nl: 'Elke minuut in de cyclus telt even zwaar. Engineers willen graag de reactie of het mengen korter maken. Maar vullen, legen, reinigen en wachten nemen vaak een derde van de cyclus in, en die zijn meestal makkelijker in te korten. Hier is het zelfs meer dan de helft.',
      en: 'Every minute in the cycle counts the same. Engineers like to shorten the reaction or the mixing. But filling, emptying, cleaning and waiting often take a third of the cycle, and they are usually easier to cut. Here it is even more than half.' },
  ],
  [ // s3 QC release
    { nl: 'Na het dispergeren gaat er een monster naar het lab, voor de kwaliteitscontrole. Pas na de {t:QC-vrijgave|QC-vrijgave}, de goedkeuring van het lab, mag de batch door.',
      en: 'After dispersing, a sample goes to the lab, for quality control. Only after {t:QC release|QC release}, the lab’s approval, may the batch move on.' },
    { nl: 'Maar het lab bedient de hele locatie, dus het monster sluit achter in de rij aan. Al die tijd staat het vat vol en stil: {n:50} minuten per batch.',
      en: 'But the lab serves the whole site, so the sample joins the back of the queue. All that time the vessel sits full and still: {n:50} minutes per batch.' },
  ],
  [ // s4 CIP, the levers, campaigns
    { nl: 'Dan het reinigen, met {t:CIP|CIP}: reinigen ter plaatse. Een sproeikop in het vat spoelt de wanden met heet water en reinigingsmiddel, en de vloeistof gaat ook door de leidingen. Niemand hoeft iets uit elkaar te halen.',
      en: 'Then cleaning, with {t:CIP|CIP}: cleaning in place. A spray head in the vessel rinses the walls with hot water and detergent, and the liquid also runs through the pipes. Nobody has to take anything apart.' },
    { nl: 'Wachten en reinigen zijn vaak de twee grote. Snellere labtests, een meting in de leiding zelf, of een korter reinigingsprogramma leveren dus capaciteit op, zonder nieuw vat.',
      en: 'Waiting and cleaning are often the two big ones. So faster lab tests, a measurement in the pipe itself, or a shorter cleaning programme add capacity, without a new vessel.' },
    { nl: 'Over reinigen discussiëren experts. Reinig je na elke batch, of maak je eerst een campagne: meerdere batches van hetzelfde product achter elkaar? Een campagne spaart reinigingstijd, maar je moet bewijzen dat het hygiënisch blijft, en je hebt langer opslag nodig.',
      en: 'Experts argue about cleaning. Do you clean after every batch, or run a campaign first: several batches of the same product in a row? A campaign saves cleaning time, but you must prove it stays hygienic, and you need longer storage.' },
  ],
  [ // s5 the inline viscosity meter
    { nl: 'Terug naar het verfvat. Er komt een inline viscositeitsmeter bij: die meet in de leiding hoe dik de verf is. En het lab krijgt een vast spoedmoment voor de monsters.',
      en: 'Back to the paint vessel. An inline viscosity meter is added: it measures in the pipe how thick the paint is. And the lab gets a fixed fast-track slot for the samples.' },
    { nl: 'Het wachten op de kwaliteitscontrole zakt van {n:50} naar {n:15} minuten. De nieuwe cyclus duurt {n:265} minuten.',
      en: 'The wait for quality control drops from {n:50} to {n:15} minutes. The new cycle takes {n:265} minutes.' },
    { nl: 'Dat is vier uur en vijfentwintig minuten. {n:3000} kilo in die tijd is {n:679} kilo per uur: {n:13} procent meer uit hetzelfde vat, zonder dat iemand aan het dispergeren komt.',
      en: 'That is four hours and twenty-five minutes. {n:3000} kilograms in that time is {n:679} kilograms per hour: {n:13} percent more from the same vessel, without anyone touching the dispersing.' },
  ],
  [ // s6 the bottleneck
    { nl: 'Staan er meer vaten achter elkaar, dan telt de hele fabriek. Een reactor van {n:6} uur per batch voedt een filter van {n:3} uur. Het filter wacht de helft van de tijd: de fabriek maakt één batch per {n:6} uur.',
      en: 'With several vessels in a row, the whole plant counts. A reactor of {n:6} hours per batch feeds a filter of {n:3} hours. The filter waits half the time: the plant makes one batch every {n:6} hours.' },
    { nl: 'Zet er een tweede reactor naast, die om beurten met de eerste draait. Dan komt er elke {n:3} uur een batch uit, zolang het filter het bijhoudt.',
      en: 'Add a second reactor beside it, taking turns with the first. Then a batch comes out every {n:3} hours, as long as the filter keeps pace.' },
    { nl: 'De {t:Bottleneck|bottleneck} is de stap die de hele fabriek beperkt. Deel de tijd van elke stap door het aantal parallelle vaten in die stap: de langste uitkomst is de bottleneck. Hier zijn beide stappen nu {n:3} uur, dus er is geen marge.',
      en: 'The {t:Bottleneck|bottleneck} is the stage that limits the whole plant. Divide the time of each stage by its number of parallel vessels: the longest result is the bottleneck. Here both stages are now at {n:3} hours, so there is no margin.' },
  ],
  [ // s7 the recipe, phases (ISA-88)
    { nl: 'Hoe zie je waar de tijd heen gaat? Batchbesturing volgt vaak de standaard ISA-88. Daarin is een recept opgedeeld in steeds kleinere stappen.',
      en: 'How do you see where the time goes? Batch control often follows the standard ISA-88. In it, a recipe is split into ever smaller steps.' },
    { nl: 'De kleinste stap heet een {t:Fase|fase}: bijvoorbeeld doseren, opwarmen, aanhouden of overpompen. Elke fase heeft instelwaarden, zoals een hoeveelheid, een temperatuur of een tijd.',
      en: 'The smallest step is called a {t:Phase|phase}: for example charge, heat, hold or transfer. Each phase has set values, such as an amount, a temperature or a time.' },
    { nl: 'Het besturingssysteem voert de fasen uit, en legt elke fase vast in een batchrapport.',
      en: 'The control system runs the phases, and logs each phase in a batch report.' },
  ],
  [ // s8 batch reports, the trap, the sharp question
    { nl: 'Vraag dus om de batchrapporten, met de echte tijd per fase over de laatste {n:50} batches. Het verschil tussen de snelste en de traagste batches is vaak de grootste capaciteitswinst op de hele locatie.',
      en: 'So ask for the batch reports, with the actual time per phase over the last {n:50} batches. The gap between the fastest and the slowest batches is often the biggest capacity gain on the whole site.' },
    { nl: 'Een typische valkuil: vaten die vol staan bij de ploegwissel of in de pauze, omdat niemand de volgende fase start.',
      en: 'A typical trap: vessels sitting full at shift change or in breaks, because nobody starts the next phase.' },
    { nl: 'Een scherpe vraag in elke batchfabriek is daarom: hoeveel minuten per batch staat dit vat te wachten op een mens, het lab of een vrije tank?',
      en: 'So a sharp question in any batch plant is: per batch, how many minutes does this vessel sit waiting for a person, the lab or a free tank?' },
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
const script = stageScriptOf({ SCENES, HUDS, dur: DUR }, CAM, new URL('./stage.js', import.meta.url));
// this film's cycle colours: process time, filling and cleaning, waiting, lit
const css = `${worldCss}
.pb-seg{fill:var(--anatomy-mid)}
.pb-segA{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1.4}
.pb-segW{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent);stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:4 3}
.pb-segH{fill:var(--fp-accent)}
.pb-segT{fill:var(--anatomy-card);font-family:var(--anatomy-mono);font-weight:700}
`;

const label = {
  nl: 'De mengvat van de kleine sapfabriek, op poten met roerwerk, inlaat bovenop, kijkglas en een pomp eronder; het vult, mengt, wacht, loopt leeg en wordt gereinigd. Kaarten tonen een batchcyclus als klok, de capaciteitssom, de verfbatch van 300 minuten, een lab met een rij monsters, een doorsnede met een sproeikop voor CIP, reinigen na elke batch of in een campagne, de kortere cyclus van 265 minuten, een tijdlijn van een reactor en een filter met een tweede reactor, een recept met de lagen van ISA-88 en zijn fasen, de cyclustijden van 50 batches, en de scherpe vraag.',
  en: 'The mixing vessel of the small juice plant, on legs with an agitator, an inlet on top, a sight glass and a pump below; it fills, mixes, waits, empties and is cleaned. Cards show a batch cycle as a clock, the capacity sum, the 300-minute paint batch, a lab with a queue of samples, a cut through a vessel with a spray head for CIP, cleaning after every batch or in a campaign, the shorter 265-minute cycle, a time line of a reactor and a filter with a second reactor, a recipe with the levels of ISA-88 and its phases, the cycle times of 50 batches, and the sharp question.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

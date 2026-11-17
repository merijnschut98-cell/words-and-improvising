// Dev tool, not shipped. Builds the lesson film "Wat een spuitgietproduct kost / What a moulded part costs" for the
// lesson eng.moulding.partcost (level 4 of the cycle topic of Spuitgieten). Task 17, pilot B: one of the four films the
// old film "Eén cyclus van 30 seconden" was split into; the coins, their drawing and the stage library are those of
// films/eng.moulding.cycle (room.mjs, stage-lib.js, sets.js), imported, not copied.
//
//   node films/eng.moulding.partcost/build.mjs            build the page
//   node films/eng.moulding.partcost/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.partcost.html. The film carries every point of the lesson (points: on the
// beats) except the pointer to the Cost engineering module (reading): the four items of the cost price, good parts per
// hour, what dominates a small and a heavy part, the mould and the scrap, what to weigh and ask, and the worked example
// of the PP part (material 0,082, machine 0,147, mould 0,080, together about 0,31).
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { svgOf, C, fitCam, COINS_BASE, css, stageScriptOf, beatTimes, k } from '../eng.moulding.cycle/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.moulding.partcost';
const L4 = 'eng.moulding.partcost';

const spec = {
  id: ID,
  title: { nl: 'Wat een spuitgietproduct kost', en: 'What a moulded part costs' },
  lessons: [L4],
  // t1.2 only points to the module Cost engineering (Kostprijs en investeringen): D4, a pointer to another module
  reading: [{ point: 't1.2', reason: 'pointer', note: 'the module Kostprijs en investeringen explains how a machine hour rate is built up' }],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'], stageFns: ['coinLabels', 'render', 'cardSvg', 'coinStacks'] },
  scenes: [
    {
      id: 's1', lesson: L4, level: 4, still: 0.9, title: { nl: 'Wat kost één dop?', en: 'What does one cap cost?' },
      beats: [
        { nl: 'Wat kost één dop? Het antwoord is een stapel munten.', en: 'What does one cap cost? The answer is a stack of coins.', focus: null,
          say: { nl: 'Wat kost één dop? Het antwoord is een stapel munten.', en: 'What does one cap cost? The answer is a stack of coins.' } },
        { nl: 'We bouwen de kostprijs op uit zijn posten.', en: 'We build the cost price from its items.', focus: null,
          say: { nl: 'We bouwen de kostprijs op uit zijn posten.', en: 'We build the cost price from its items.' } },
      ],
    },
    {
      id: 's2', lesson: L4, level: 4, still: 0.9, title: { nl: 'Vier posten', en: 'Four items' },
      beats: [
        { nl: 'Materiaal: gewicht per stuk keer prijs per kg, plus afkeur.', en: 'Material: weight per part times price per kg, plus scrap.', focus: ['material'], points: ['t1.1'],
          say: { nl: 'De kostprijs van een spuitgietproduct heeft vier hoofdposten. Materiaal is het gewicht per stuk keer de prijs per kilo, plus afkeur.', en: 'The cost price of a moulded part has four main items. Material is the weight per part times the price per kilo, plus scrap.' } },
        { nl: 'Machine: het {t:Machine-uurtarief|machine-uurtarief} gedeeld door de goede stuks per uur.', en: 'Machine: the {t:Machine hour rate|machine hour rate} divided by the good parts per hour.', cue: { 'Machine-uurtarief': 'rate' }, focus: ['rate'], points: ['t1.1'],
          say: { nl: 'Machine is het {t:Machine-uurtarief|machine-uurtarief}, wat een uur perstijd kost, gedeeld door goede stuks per uur. Daarin zitten operator, energie, afschrijving en vloerruimte.', en: 'Machine is the {t:Machine hour rate|machine hour rate}, what an hour of press time costs, divided by good parts per hour. It includes operator, energy, depreciation and floor space.' } },
        { nl: 'Matrijs: de {t:Matrijsafschrijving|matrijsafschrijving}, zijn prijs verdeeld over de stuks die hij maakt.', en: 'Mould: the {t:Mould amortisation|mould amortisation}, its price spread over the parts it makes.', cue: { Matrijsafschrijving: 'amort' }, focus: ['amort'], points: ['t1.1'],
          say: { nl: 'Matrijs is de prijs van de matrijs, verdeeld over de stuks die hij maakt.', en: 'Mould is the price of the mould, spread over the parts it makes.' } },
        { nl: 'En de rest: verpakking, nabewerkingen, transport.', en: 'And the rest: packing, finishing, transport.', focus: ['card'], points: ['t1.1'],
          say: { nl: 'En de rest. Verpakking, nabewerkingen en transport.', en: 'And the rest. Packing, finishing and transport.' } },
      ],
    },
    {
      id: 's3', lesson: L4, level: 4, still: 0.9, title: { nl: 'Goede stuks per uur', en: 'Good parts per hour' },
      beats: [
        { nl: 'In goede stuks per uur zit de cyclustijd: {n:3600} / cyclus × holtes × rendement.', en: 'Good parts per hour hide the cycle time: {n:3600} / cycle × cavities × efficiency.', focus: ['card'], points: ['t2.1'],
          say: { nl: 'In goede stuks per uur zit de cyclustijd verstopt. Het is {n:3600} gedeeld door de cyclus, maal het aantal holtes, maal het rendement.', en: 'Good parts per hour hide the cycle time. It is {n:3600} divided by the cycle, times the number of cavities, times the efficiency.' } },
        { nl: 'Rendement dekt omstellen, opstartafkeur en storingen; een planner rekent bijvoorbeeld met {n:85}%.', en: 'Efficiency covers changeovers, start-up scrap and breakdowns; a planner might use {n:85}%.', focus: ['card'], points: ['t2.1'],
          say: { nl: 'Het rendement dekt omstellen, opstartafkeur en storingen. Een planner rekent bijvoorbeeld met {n:85} procent.', en: 'Efficiency covers changeovers, start-up scrap and breakdowns. A planner might use {n:85} percent, for example.' } },
        { nl: 'Bij kleine producten domineert de machinepost: elke seconde cyclus zie je terug in de prijs.', en: 'In small parts the machine item dominates: every second of cycle shows in the price.', focus: ['rate'], points: ['t2.2'],
          say: { nl: 'Bij kleine producten domineert dus meestal de machinepost. Elke seconde cyclus zie je terug in de prijs.', en: 'So in small parts the machine item usually dominates. Every second of cycle shows in the price.' } },
        { nl: 'Bij grote, zware producten zoals een krat neemt het materiaal het over.', en: 'In large, heavy parts such as a crate the material takes over.', focus: ['material'], points: ['t2.2'],
          say: { nl: 'Bij grote, zware producten zoals een krat neemt het materiaal het over. Dan wegen een paar gram wand zwaarder dan een seconde cyclus.', en: 'In large, heavy parts such as a crate the material takes over. Then a few grams of wall weigh more than a second of cycle.' } },
      ],
    },
    {
      id: 's4', lesson: L4, level: 4, still: 0.9, title: { nl: 'Matrijs en afkeur', en: 'Mould and scrap' },
      beats: [
        { nl: 'De matrijs wordt over een afgesproken aantal stuks verdeeld, of de klant betaalt hem apart.', en: 'The mould is spread over an agreed number of parts, or the customer pays for it apart.', focus: ['amort'], points: ['t3.1'],
          say: { nl: 'De spuitgieter verdeelt de matrijskosten over een afgesproken aantal stuks, of de klant betaalt de matrijs apart en is eigenaar. Beide komen veel voor, dus vraag welke.', en: 'The moulder spreads the mould cost over an agreed number of parts, or the customer pays for the mould separately and owns it. Both are common, so ask which.' } },
        { nl: 'Zit hij in de stuksprijs en vallen de volumes tegen, dan verdient de spuitgieter hem nooit terug.', en: 'If it is in the part price and volumes disappoint, the moulder never earns it back.', focus: ['amort'], points: ['t3.1'],
          say: { nl: 'Zit hij in de stuksprijs en vallen de volumes tegen, dan verdient de spuitgieter de matrijs nooit terug.', en: 'If it is in the part price and the volumes disappoint, the moulder never earns the mould back.' } },
        { nl: 'Afkeur telt dubbel: {n:3}% {t:Afkeurpercentage|afkeurpercentage} maakt de hele kostprijs zo’n {n:3}% duurder.', en: 'Scrap counts twice: a {n:3}% {t:Scrap rate|scrap rate} makes the whole cost price about {n:3}% dearer.', cue: { Afkeurpercentage: 'scrap' }, focus: ['scrap'], points: ['t3.2'],
          say: { nl: 'Afkeur telt dubbel. Verloren materiaal én verloren perstijd. Een afkeurpercentage van {n:3} procent maakt de hele kostprijs zo’n {n:3} procent duurder, niet alleen het materiaal.', en: 'Scrap counts twice. Lost material and lost press time. A scrap rate of {n:3} percent makes the whole cost price about {n:3} percent dearer, not just the material.' } },
      ],
    },
    {
      id: 's5', lesson: L4, level: 4, still: 0.9, title: { nl: 'Wat weeg je?', en: 'What do you weigh?' },
      beats: [
        { nl: 'Weeg welke post het meest beweegt voor de minste moeite.', en: 'Weigh which item moves the most for the least effort.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Een manufacturing engineer of manager weegt welke post het meest beweegt voor de minste moeite. Een seconde cyclus. Een gram materiaal. Een goedkoper type. Of minder holtes in een goedkopere matrijs.', en: 'A manufacturing engineer or manager weighs which item moves the most for the least effort. A second of cycle. A gram of material. A cheaper grade. Or fewer cavities in a cheaper mould.' } },
        { nl: 'Vraag: welke cyclus en rendement? Zit de matrijs in de prijs? Bij welk volume verliesgevend?', en: 'Ask: which cycle and efficiency? Is the mould in the price? At what volume does it lose money?', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Vragen die geloofwaardig klinken. Op welke cyclus en welk rendement is deze prijs berekend? Zit de matrijs in de stuksprijs of wordt hij apart betaald? En bij welk volume wordt deze offerte verliesgevend?', en: 'Questions that sound credible. On which cycle and which efficiency is this price calculated? Is the mould in the part price or paid for separately? And at what volume does this quote become loss-making?' } },
      ],
    },
    {
      id: 's6', lesson: L4, level: 4, still: 0.9, title: { nl: 'Het voorbeeld', en: 'The example' },
      beats: [
        { nl: 'Een PP-product van {n:40} g, 4-voudige heetkanaalmatrijs, cyclus {n:30} s.', en: 'A PP part of {n:40} g, a 4-cavity hot-runner mould, cycle {n:30} s.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een PP-product van {n:40} gram draait in een 4-voudige heetkanaalmatrijs op een cyclus van {n:30} seconden.', en: 'A PP part of {n:40} grams runs in a 4-cavity hot-runner mould on a cycle of {n:30} seconds.' } },
        { nl: 'Aannames: PP € {n:2.00} per kg, {n:3}% afkeur, € {n:60} per uur, {n:85}% rendement, matrijs € {n:80000}.', en: 'Assumptions: PP €{n:2.00} per kg, {n:3}% scrap, €{n:60} an hour, {n:85}% efficiency, mould €{n:80000}.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Neem aan dat PP twee euro per kilo kost, met {n:3} procent afkeur. Het machine-uurtarief is {n:60} euro, het rendement {n:85} procent. De matrijs kost {n:80000} euro, verdeeld over {n:1} miljoen stuks.', en: 'Assume PP costs two euros a kilo, with {n:3} percent scrap. The machine hour rate is {n:60} euros and the efficiency {n:85} percent. The mould costs {n:80000} euros, spread over {n:1} million parts.' } },
      ],
    },
    {
      id: 's7', lesson: L4, level: 4, still: 0.9, title: { nl: 'Materiaal en matrijs', en: 'Material and mould' },
      beats: [
        { nl: 'Materiaal: {n:0.040} kg × € {n:2.00} = € {n:0.080}, plus {n:3}% afkeur ≈ € {n:0.082}.', en: 'Material: {n:0.040} kg × €{n:2.00} = €{n:0.080}, plus {n:3}% scrap ≈ €{n:0.082}.', focus: ['material', 'scrap'], points: ['ex.text.2'],
          say: { nl: 'Materiaal is {n:40} gram, dat is {n:0.040} kilo, keer twee euro. Plus {n:3} procent afkeur is dat ongeveer acht cent.', en: 'Material is {n:40} grams, that is {n:0.040} kilos, times two euros. Plus {n:3} percent scrap that is about eight cents.' } },
        { nl: 'Matrijs: € {n:80000} / {n:1000000} = € {n:0.080} per stuk.', en: 'Mould: €{n:80000} / {n:1000000} = €{n:0.080} per part.', focus: ['amort'], points: ['ex.text.2'],
          say: { nl: 'De matrijs kost {n:80000} euro, verdeeld over een miljoen stuks. Dat is acht cent per stuk.', en: 'The mould costs {n:80000} euros, spread over a million parts. That is eight cents per part.' } },
      ],
    },
    {
      id: 's8', lesson: L4, level: 4, still: 0.95, title: { nl: 'Het antwoord', en: 'The answer' },
      beats: [
        { nl: 'Wat zijn de machinekosten per stuk, het totaal, en welke post is het grootst?', en: 'What is the machine cost per part, the total, and which item is the biggest?', focus: ['rate'], points: ['ex.ask'],
          say: { nl: 'Wat zijn de machinekosten per stuk? Wat is het totaal? En welke post is het grootst?', en: 'What is the machine cost per part? What is the total? And which item is the biggest?' } },
        { nl: 'Goed per uur: {n:3600} / {n:30} × {n:4} × {n:0.85} = {n:408}. Machine: € {n:60} / {n:408} ≈ € {n:0.147}.', en: 'Good per hour: {n:3600} / {n:30} × {n:4} × {n:0.85} = {n:408}. Machine: €{n:60} / {n:408} ≈ €{n:0.147}.', focus: ['rate'], points: ['ex.reveal.1'],
          say: { nl: 'Goede stuks per uur is {n:3600} gedeeld door {n:30}, maal {n:4}, maal {n:85} procent. Dat is {n:408}. De machine kost {n:60} euro gedeeld door {n:408}, bijna vijftien cent per stuk.', en: 'Good parts per hour is {n:3600} divided by {n:30}, times {n:4}, times {n:85} percent. That is {n:408}. The machine costs {n:60} euros divided by {n:408}, almost fifteen cents a part.' } },
        { nl: 'Totaal: € {n:0.082} + € {n:0.147} + € {n:0.080} ≈ € {n:0.31}.', en: 'Total: €{n:0.082} + €{n:0.147} + €{n:0.080} ≈ €{n:0.31}.', focus: ['labels'], points: ['ex.reveal.1'],
          say: { nl: 'Het totaal is zo’n eenendertig cent. Materiaal, machine en matrijs samen.', en: 'The total is about thirty-one cents. Material, machine and mould together.' } },
        { nl: 'Machinetijd is de helft van de kosten: een seconde cyclus is hier meer waard dan een gram kunststof.', en: 'Machine time is half of the cost: a second of cycle is worth more here than a gram of plastic.', focus: ['rate'], points: ['ex.reveal.1'],
          say: { nl: 'De machinetijd is ongeveer de helft van de kosten. Dus is hier een seconde cyclus meer waard dan een gram kunststof.', en: 'Machine time is about half of the cost. So here a second of cycle is worth more than a gram of plastic.' } },
      ],
    },
  ],
  skip: [],
};

// the scene lengths follow the words: the captions are readable, the narration fits (about 2.7 words a second)
const plainWords = (src) => wordsOf(src.replace(/\{[tn]:([^{}|]*)(\|([^{}]*))?\}/g, (m, a, b, c) => c || a));
for (const s of spec.scenes) {
  const cap = Math.max(...['nl', 'en'].map((l) => s.beats.reduce((a, b) => a + plainWords(b[l]), 0)));
  const nar = s.beats.reduce((a, b) => a + plainWords(b.say.nl), 0);
  s.dur = Math.ceil(Math.max(minSceneDur(cap + 6), nar / 2.7));
}
beatTimes(spec.scenes, plainWords, beatStarts);

// ---------------------------------------------------------------- cameras (one move per scene)
const base = k.boxCorners(COINS_BASE, -8, 56);
const full = [24, 50, 616, 392];
const right = [350, 70, 630, 392];
const CAM = [
  { from: fitCam(base, full, 0.95), to: fitCam(base, full) },
  { from: fitCam(base, right, 1.0), to: fitCam(base, right, 1.0) },
  { from: fitCam(base, right, 1.0), to: fitCam(base, right, 1.0) },
  { from: fitCam(base, right, 1.0), to: fitCam(base, right, 1.0) },
  { from: fitCam(base, right, 1.0), to: fitCam(base, right, 1.0) },
  { from: fitCam(base, right, 1.0), to: fitCam(base, right, 1.0) },
  { from: fitCam(base, full, 0.95), to: fitCam(base, full) },
  { from: fitCam(base, full, 0.95), to: fitCam(base, full) },
];

// ---------------------------------------------------------------- page
const svg = svgOf(['coinset']);
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM, sets: ['coins'], parts: ['coins'] });
const label = {
  nl: 'Een weegschaal met een dop op de schaal naast een plaat met drie stapels munten: materiaal, machine en matrijs; kaarten met de posten van de kostprijs en de uitkomst van het voorbeeld.',
  en: 'A scale with a cap on its pan beside a plate with three stacks of coins: material, machine and mould; cards with the items of the cost price and the result of the example.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB`);
}

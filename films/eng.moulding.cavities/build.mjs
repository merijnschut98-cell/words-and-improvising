// Dev tool, not shipped. Builds the lesson film "Meer holtes of een snellere cyclus / More cavities or a faster cycle"
// for the lesson eng.moulding.cavities (level 3 of the cycle topic of Spuitgieten). Task 17, pilot B: one of the four
// films the old film "Eén cyclus van 30 seconden" was split into; the mould plates, their drawing and the stage
// library are those of films/eng.moulding.cycle (room.mjs, stage-lib.js, sets.js), imported, not copied.
//
//   node films/eng.moulding.cavities/build.mjs            build the page
//   node films/eng.moulding.cavities/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.cavities.html. The film carries every point of the lesson (points: on the
// beats): what more cavities cost in time, press and mould, the fill balance and its weighing, the hot runner and the
// valve gate, the family mould and the risk of one lost cavity, and the worked example of option A and option B with
// its payback.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { svgOf, C, fitCam, PLATE4, PLATE8, css, stageScriptOf, beatTimes, k } from '../eng.moulding.cycle/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.moulding.cavities';
const L3 = 'eng.moulding.cavities';

const spec = {
  id: ID,
  title: { nl: 'Meer holtes of een snellere cyclus', en: 'More cavities or a faster cycle' },
  lessons: [L3],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], stageFns: ['plateShow', 'familyFill', 'render', 'cardSvg', 'cross', 'ring2'] },
  scenes: [
    {
      id: 's1', lesson: L3, level: 3, still: 0.5, title: { nl: 'Een 4-voudige matrijs', en: 'A 4-cavity mould' },
      beats: [
        { nl: 'Een 4-voudige matrijs maakt vier producten per cyclus.', en: 'A 4-cavity mould makes four parts per cycle.', focus: null,
          say: { nl: 'Een 4-voudige matrijs maakt vier producten per cyclus.', en: 'A 4-cavity mould makes four parts per cycle.' } },
        { nl: 'Zijn acht holtes dan beter? Dat zoeken we uit.', en: 'Are eight cavities better then? Let us find out.', focus: null,
          say: { nl: 'Zijn acht holtes dan beter? Dat zoeken we uit.', en: 'Are eight cavities better then? Let us find out.' } },
      ],
    },
    {
      id: 's2', lesson: L3, level: 3, still: 0.9, title: { nl: 'Meer holtes', en: 'More cavities' },
      beats: [
        { nl: 'Meer holtes kosten vaak tijd: een groter shot doseert en vult langer en vraagt een grotere pers.', en: 'More cavities often cost time: a bigger shot doses and fills longer and needs a bigger press.', focus: ['card'], points: ['t1.1'],
          say: { nl: 'Output kan op twee manieren groeien. Meer holtes per shot, of een kortere cyclus. Meer holtes zijn zelden gratis in tijd. Een groter shot doseert en vult langer, en de grotere matrijs vraagt een grotere pers met een hoger uurtarief.', en: 'Output can grow in two ways. More cavities per shot, or a shorter cycle. More cavities are rarely free in time. A bigger shot takes longer to dose and fill, and the bigger mould needs a bigger press with a higher hourly rate.' } },
        { nl: 'De matrijsprijs stijgt minder dan evenredig. Vergelijk de kosten per stuk over het volume.', en: 'The mould price rises less than in step. Compare the cost per part over the volume.', focus: ['card'], points: ['t1.2'],
          say: { nl: 'De matrijsprijs stijgt met elke holte, wel minder dan evenredig, want het matrijsframe en het ontwerp worden gedeeld. Dus vergelijkt de engineer de opties op kosten per stuk over het verwachte volume. Niet op output alleen.', en: 'The mould price rises with every cavity, but less than in step, because the mould base and the design are shared. So the engineer compares the options on cost per part over the expected volume. Not on output alone.' } },
      ],
    },
    {
      id: 's3', lesson: L3, level: 3, still: 0.9, title: { nl: 'Vulbalans', en: 'Fill balance' },
      beats: [
        { nl: 'Elke holte vult tegelijk met dezelfde druk: {t:Vulbalans|vulbalans}, met gelijke vloeiwegen in een H-patroon.', en: 'Every cavity fills at once at the same pressure: {t:Fill balance|fill balance}, with equal flow paths in an H-pattern.', cue: { Vulbalans: 'balance' }, focus: ['balance'], points: ['t2.1'],
          say: { nl: 'In een meervoudige matrijs hoort elke holte op hetzelfde moment met dezelfde druk vol te lopen. Dat is {t:Vulbalans|vulbalans}. Een natuurlijk gebalanceerde aanspuiting geeft elke holte dezelfde vloeiweg, bijvoorbeeld in een H-patroon. Het verdeelkanaal splitst zich in tweeën en daarna weer in tweeën.', en: 'In a multi-cavity mould every cavity should fill at the same moment with the same pressure. That is {t:Fill balance|fill balance}. A naturally balanced feed gives every cavity the same flow path, for example in an H-pattern. The runner splits in two and then in two again.' } },
        { nl: 'Slechte balans geeft verschillende gewichten: de eerste holte braam, de laatste onvolledig. Weeg per holte.', en: 'Poor balance gives different weights: the first cavity flash, the last one short. Weigh per cavity.', focus: ['balance', 'card'], points: ['t2.2'],
          say: { nl: 'Slechte balans zie je aan verschillende productgewichten. De holte die het eerst vol is, wordt hard nagedrukt en kan braam geven. De laatste kan onvolledig zijn of inzakken. Weeg dus de producten per holte, want de spreiding laat zien hoe gebalanceerd de matrijs is.', en: 'Poor balance shows in different part weights. The cavity that is full first is packed hard and can give flash. The last one can be short or sink. So weigh the parts per cavity, because the spread shows how well balanced the mould is.' } },
      ],
    },
    {
      id: 's4', lesson: L3, level: 3, still: 0.9, title: { nl: 'Heetkanaal en naaldsluiting', en: 'Hot runner and valve gate' },
      beats: [
        { nl: 'Een heetkanaal houdt de smelt vloeibaar tot de holtes; elke spuitmond heeft zijn eigen verwarmingszone.', en: 'A hot runner keeps the melt molten up to the cavities; each nozzle has its own heating zone.', focus: ['valve'], points: ['t3.1'],
          say: { nl: 'Een heetkanaal is het verwarmde verdeelblok dat de kunststof vloeibaar houdt tot aan de holtes. Het scheelt aanspuitmateriaal en vaak cyclustijd. Elke spuitmond heeft zijn eigen verwarmingszone, dus de insteller kan de balans bijsturen met temperatuur.', en: 'A hot runner is the heated manifold that keeps the plastic molten right up to the cavities. It saves runner material and often cycle time. Each nozzle has its own heating zone, so the setter can trim the balance with temperature.' } },
        { nl: 'Een {t:Naaldsluiting|naaldsluiting}: een naald in elke spuitmond opent en sluit het aanspuitpunt op commando.', en: 'A {t:Valve gate|valve gate}: a needle in each nozzle opens and closes the gate on command.', cue: { Naaldsluiting: 'valve' }, focus: ['valve'], points: ['t3.2'],
          say: { nl: 'Een {t:Naaldsluiting|naaldsluiting} gaat verder. Een naald in elke spuitmond opent en sluit het aanspuitpunt op commando. Dat geeft een strak aanspuitpunt op het product en controle over wanneer elke holte vult.', en: 'A {t:Valve gate|valve gate} goes further. A needle in each nozzle opens and closes the gate on command. That gives a clean gate on the part and control over when each cavity fills.' } },
      ],
    },
    {
      id: 's5', lesson: L3, level: 3, still: 0.9, title: { nl: 'Familiematrijs en risico', en: 'Family mould and risk' },
      beats: [
        { nl: 'Een {t:Familiematrijs|familiematrijs} maakt verschillende producten in één shot, maar ze vullen zelden gelijk.', en: 'A {t:Family mould|family mould} makes different parts in one shot, but they rarely fill alike.', cue: { Familiematrijs: 'family' }, focus: ['family'], points: ['t4.1'],
          say: { nl: 'Een {t:Familiematrijs|familiematrijs} maakt verschillende producten in één shot, zoals een deksel en een bak. Handig voor een set die altijd samen besteld wordt. Maar de producten vullen zelden gelijk. En heeft één product een probleem of is het in andere aantallen nodig, dan lijdt de hele matrijs eronder.', en: 'A {t:Family mould|family mould} makes different parts in one shot, such as a lid and a base. Handy for a set that is always ordered together. But the parts rarely fill alike. And if one part has a problem, or is needed in other quantities, the whole mould suffers.' } },
        { nl: 'Meer holtes is meer risico: een 8-voudige die er één verliest, draait op {n:7}/{n:8} van zijn output.', en: 'More cavities is more risk: an 8-cavity mould that loses one runs at {n:7}/{n:8} of its output.', focus: ['balance', 'card'], points: ['t4.2'],
          say: { nl: 'Meer holtes is ook meer risico in één matrijs. Raakt één holte beschadigd, dan zet je hem dicht en draai je op de rest. Een 8-voudige die er één verliest, draait op {n:7} achtste van zijn output.', en: 'More cavities is also more risk in one mould. If one cavity is damaged, you shut it off and run on the rest. An 8-cavity mould that loses one runs at {n:7} eighths of its output.' } },
      ],
    },
    {
      id: 's6', lesson: L3, level: 3, still: 0.9, title: { nl: 'Twee opties', en: 'Two options' },
      beats: [
        { nl: 'Een klant wil {n:2} miljoen doppen per jaar. A: 4 holtes op {n:20} s, pers € {n:60} per uur, matrijs € {n:80000}.', en: 'A customer wants {n:2} million caps a year. A: 4 cavities at {n:20} s, press €{n:60} an hour, mould €{n:80000}.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een klant wil {n:2} miljoen doppen per jaar. Optie A is een 4-voudige matrijs op {n:20} seconden, op een pers van {n:60} euro per uur. De matrijs kost {n:80000} euro.', en: 'A customer wants {n:2} million caps a year. Option A is a 4-cavity mould at {n:20} seconds, on a press of {n:60} euros an hour. The mould costs {n:80000} euros.' } },
        { nl: 'B: 8 holtes op {n:24} s, grotere pers € {n:75} per uur, matrijs € {n:140000}. Tarieven en prijzen zijn aannames.', en: 'B: 8 cavities at {n:24} s, bigger press €{n:75} an hour, mould €{n:140000}. Rates and prices are assumptions.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Optie B is een 8-voudige op {n:24} seconden, op een grotere pers van {n:75} euro per uur. De matrijs kost {n:140000} euro. Uurtarieven en prijzen zijn aannames.', en: 'Option B is an 8-cavity mould at {n:24} seconds, on a bigger press of {n:75} euros an hour. The mould costs {n:140000} euros. Hourly rates and prices are assumptions.' } },
        { nl: 'A: {n:3600} / {n:20} × {n:4} = {n:720} per uur; {n:2000000} / {n:720} ≈ {n:2778} uur: € {n:166700} per jaar.', en: 'A: {n:3600} / {n:20} × {n:4} = {n:720} per hour; {n:2000000} / {n:720} ≈ {n:2778} hours: €{n:166700} a year.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'A maakt {n:3600} gedeeld door {n:20}, maal {n:4}, is {n:720} doppen per uur. Dat is {n:2000000} gedeeld door {n:720}, ongeveer tweeduizend zevenhonderdachtenzeventig persuren. Zo’n {n:166700} euro per jaar.', en: 'A makes {n:3600} divided by {n:20}, times {n:4}, which is {n:720} caps an hour. That is {n:2000000} divided by {n:720}, about two thousand seven hundred and seventy-eight press hours. Some {n:166700} euros a year.' } },
        { nl: 'B maakt {n:3600} / {n:24} × {n:8} = {n:1200} doppen per uur.', en: 'B makes {n:3600} / {n:24} × {n:8} = {n:1200} caps per hour.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'B maakt {n:3600} gedeeld door {n:24}, maal {n:8}, is {n:1200} doppen per uur.', en: 'B makes {n:3600} divided by {n:24}, times {n:8}, which is {n:1200} caps an hour.' } },
      ],
    },
    {
      id: 's7', lesson: L3, level: 3, still: 0.9, title: { nl: 'Het antwoord', en: 'The answer' },
      beats: [
        { nl: 'Wat kost B per jaar aan persuren, en hoe snel verdient B de € {n:60000} extra matrijskosten terug?', en: 'What does B cost a year in press hours, and how fast does B earn back the extra €{n:60000} of mould cost?', focus: ['card'], points: ['ex.ask'],
          say: { nl: 'Wat kost B per jaar aan persuren? En hoe snel verdient B de {n:60000} euro extra matrijskosten terug?', en: 'What does B cost a year in press hours? And how fast does B earn back the {n:60000} euros of extra mould cost?' } },
        { nl: 'B: {n:2000000} / {n:1200} ≈ {n:1667} uur × € {n:75} = € {n:125000}: zo’n € {n:41700} minder dan A.', en: 'B: {n:2000000} / {n:1200} ≈ {n:1667} hours × €{n:75} = €{n:125000}: about €{n:41700} less than A.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'B heeft {n:2000000} gedeeld door {n:1200}, ongeveer {n:1667} uur nodig. Maal {n:75} euro is {n:125000} euro per jaar. Dat is zo’n {n:41700} euro minder dan A.', en: 'B needs {n:2000000} divided by {n:1200}, about {n:1667} hours. Times {n:75} euros is {n:125000} euros a year. That is some {n:41700} euros less than A.' } },
        { nl: 'Terugverdientijd: {n:60000} / {n:41700} ≈ {n:1.4} jaar, zo’n {n:17} maanden.', en: 'Payback: {n:60000} / {n:41700} ≈ {n:1.4} years, about {n:17} months.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'De terugverdientijd is {n:60000} gedeeld door {n:41700}, ongeveer {n:1.4} jaar. Dat is zo’n {n:17} maanden.', en: 'The payback time is {n:60000} divided by {n:41700}, about {n:1.4} years. That is some {n:17} months.' } },
        { nl: 'Bij dit volume wint B; bij een kwart van het volume duurt het bijna zes jaar.', en: 'At this volume B wins; at a quarter of the volume it would take almost six years.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'Bij dit volume wint B. Bij een kwart van het volume zou het bijna zes jaar duren.', en: 'At this volume B wins. At a quarter of the volume it would take almost six years.' } },
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
const p4 = k.boxCorners(PLATE4, -40, 18);
const p8 = k.boxCorners(PLATE8, -40, 18);
const p8h = k.boxCorners(PLATE8, -40, 50);
const right = [350, 70, 630, 392];
const CAM = [
  { from: fitCam(p4, [40, 60, 600, 380], 1.0), to: fitCam(p4, [40, 60, 600, 380], 1.06) },
  { from: fitCam(p4, right), to: fitCam(p8, right), a: 0.12, b: 0.3 },
  { from: fitCam(p8, right, 1.0), to: fitCam(p8, right, 1.0) },
  { from: fitCam(p8h, [24, 60, 616, 392], 1.0), to: fitCam(p8h, [24, 60, 616, 392], 1.06) },
  { from: fitCam(p8, right, 1.0), to: fitCam(p8, right, 1.0) },
  { from: fitCam(p8, right, 1.0), to: fitCam(p8, right, 1.0) },
  { from: fitCam(p8, right, 1.0), to: fitCam(p8, right, 1.0) },
];

// ---------------------------------------------------------------- page
const svg = svgOf(['plates']);
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM, sets: ['plates'], parts: ['plates'] });
const label = {
  nl: 'Bewegende matrijsplaten: een plaat met vier holtes, een met acht holtes en een H-vormig verdeelkanaal, een heetkanaalblok met naaldsluitingen en een familiematrijs; kaarten met de uitkomst van het voorbeeld.',
  en: 'Moving mould plates: a plate with four cavities, one with eight cavities and an H-shaped runner, a hot-runner manifold with valve gates and a family mould; cards with the result of the example.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB`);
}

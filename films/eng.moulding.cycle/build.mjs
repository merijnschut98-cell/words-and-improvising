// Dev tool, not shipped. Builds the lesson film "Cyclustijd en output / Cycle time and output" for the lesson
// eng.moulding.cycle (level 1 of the cycle topic of Spuitgieten). Task 17, pilot B: the old film "Eén cyclus van
// 30 seconden" served four lessons and dropped 46 lesson points on the way (its 1,780 words of lesson text cannot
// fit the 360 s cap); it is split into one complete film per lesson (D2, D3), and this one keeps the id. Its
// sisters are films/eng.moulding.cooling, .cavities and .partcost (their builds live in the folders of the same
// name); the press, the section, the plates, the coins and the stage library are in this folder (room.mjs,
// stage-lib.js, sets.js).
//
//   node films/eng.moulding.cycle/build.mjs            build the page
//   node films/eng.moulding.cycle/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.cycle.html: one offline page. The film carries every point of the
// lesson (points: on the beats): the cycle of 30 seconds, cooling as half of it, the square of the wall thickness,
// the output per hour and the price of cavities, the cycle time as a commercial number and the seconds nobody
// takes off again.
import { join } from 'node:path';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { svgOf, C, cam, fitCam, camAt, FIT, blockPts, css, stageScriptOf, beatTimes, k, HERE, auditPress } from './room.mjs';

const ID = 'eng.moulding.cycle';
const L1 = 'eng.moulding.cycle';

const spec = {
  id: ID,
  title: { nl: 'Cyclustijd en output', en: 'Cycle time and output' },
  lessons: [L1],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], stageFns: ['tour', 'capMould', 'render', 'phaseBar', 'cardSvg', 'dimLabels', 'section', 'bossDims'] },
  scenes: [
    {
      // the Basis tour of the machine, before the terms
      id: 's1', lesson: L1, level: 1, still: 0.5, title: { nl: 'Hoe spuitgieten werkt', en: 'How injection moulding works' },
      beats: [
        { nl: 'Een spuitgietmachine maakt doppen in een vast rondje, steeds opnieuw.', en: 'An injection moulding machine makes caps in a fixed round, again and again.', focus: null, still: 0.08,
          say: { nl: 'Hoe werkt spuitgieten? Deze machine maakt flessendoppen van kunststof. Ze doet steeds hetzelfde rondje.', en: 'How does injection moulding work? This machine makes plastic bottle caps. It runs the same round again and again.' } },
        { nl: 'De sluiteenheid drukt de twee helften van de matrijs stevig dicht.', en: 'The clamp unit presses the two halves of the mould firmly shut.', focus: ['clampunit'], still: 0.3,
          say: { nl: 'Links zit de sluiteenheid. Die schuift de beweegbare helft van de matrijs tegen de vaste helft, en houdt ze met grote kracht dicht.', en: 'On the left is the clamp unit. It slides the moving half of the mould against the fixed half, and holds them shut with great force.' } },
        { nl: 'De spuiteenheid smelt de korrels en spuit de smelt in de matrijs.', en: 'The injection unit melts the pellets and injects the melt into the mould.', focus: ['injunit'], still: 0.5,
          say: { nl: 'Rechts zit de spuiteenheid. Korrels uit de trechter smelten in een verwarmde cilinder, en een schroef spuit de hete smelt in de gesloten matrijs.', en: 'On the right is the injection unit. Pellets from the hopper melt in a heated barrel, and a screw injects the hot melt into the closed mould.' } },
        { nl: 'In de matrijs koelt de kunststof af tot een stijve dop.', en: 'In the mould the plastic cools into a stiff cap.', focus: ['mould'], still: 0.7,
          say: { nl: 'In de matrijs zitten holle vormen van de dop. De smelt vult ze en koelt af, tot de dop stijf is.', en: 'Inside the mould are hollow shapes of the cap. The melt fills them and cools, until the cap is stiff.' } },
        { nl: 'Dan gaat de matrijs open en vallen de doppen eruit.', en: 'Then the mould opens and the caps drop out.', focus: ['mould'], still: 0.9,
          say: { nl: 'Dan gaat de matrijs open, duwen pennen de doppen eruit, en vallen ze in de bak. De matrijs sluit, en het rondje begint opnieuw.', en: 'Then the mould opens, pins push the caps out, and they drop into the bin. The mould closes, and the round starts again.' } },
      ],
    },
    {
      id: 's2', lesson: L1, level: 1, still: 0.55, title: { nl: 'De cyclus', en: 'The cycle' },
      beats: [
        { nl: 'Sluiten, inspuiten, nadruk, koelen, openen, uitwerpen: samen de {t:Cyclustijd|cyclustijd}, hier {n:30} seconden.', en: 'Close, inject, hold, cool, open, eject: together the {t:Cycle time|cycle time}, here {n:30} seconds.', cue: { Cyclustijd: 'cycle' }, focus: ['cycle'], points: ['t1.1'],
          read: { nl: '{n:2} + {n:1.5} + {n:6} + {n:15} + {n:2} + {n:3.5} = {n:30} s', en: '{n:2} + {n:1.5} + {n:6} + {n:15} + {n:2} + {n:3.5} = {n:30} s' },
          say: { nl: 'De {t:Cyclustijd|cyclustijd} is de tijd van het ene sluiten van de matrijs tot het volgende. In een typische cyclus van {n:30} seconden duurt sluiten {n:2} seconden. Inspuiten {n:1.5}. Nadruk {n:6}. Koelen {n:15}. Openen {n:2}. En uitwerpen en uitnemen {n:3.5}.', en: 'The {t:Cycle time|cycle time} is the time from one closing of the mould to the next. In a typical cycle of {n:30} seconds, closing takes {n:2} seconds. Injection {n:1.5}. Hold {n:6}. Cooling {n:15}. Opening {n:2}. And eject and remove {n:3.5}.' } },
        { nl: 'De {t:Koeltijd|koeltijd} is {n:15} s: vaak {n:50} tot {n:80}% van de cyclus. Dan is het product stijf.', en: 'The {t:Cooling time|cooling time} is {n:15} s: often {n:50} to {n:80}% of the cycle. Then the part is stiff.', cue: { Koeltijd: 'cool' }, focus: ['cool'], points: ['t1.2'],
          say: { nl: 'De {t:Koeltijd|koeltijd} is hier {n:15} seconden, vaak {n:50} tot {n:80} procent van de cyclus. Het product moet stijf genoeg zijn om zijn vorm te houden als de uitwerppennen het eruit duwen. Je hoort het op de vloer. Een korte sis van het inspuiten, dan een lange stilte.', en: 'The {t:Cooling time|cooling time} is {n:15} seconds here, often {n:50} to {n:80} percent of the cycle. The part must be stiff enough to keep its shape when the ejector pins push it out. You can hear it on the floor. A short hiss of the injection, then a long silence.' } },
      ],
    },
    {
      id: 's3', lesson: L1, level: 1, still: 0.5, title: { nl: 'Holtes en output', en: 'Cavities and output' },
      beats: [
        { nl: 'Elke {t:Holte|holte} maakt één dop per cyclus; deze matrijs heeft er {n:2} en loopt op {n:20} s.', en: 'Each {t:Cavity|cavity} makes one cap per shot; this mould has {n:2} and runs at {n:20} s.', cue: { Holte: 'cavity' }, focus: ['cavity'], points: ['ex.text.1'],
          say: { nl: 'Een {t:Holte|holte} is een productvormige ruimte in de matrijs en maakt één product per cyclus. Een 2-voudige matrijs voor een flessendop loopt op {n:20} seconden.', en: 'A {t:Cavity|cavity} is a product-shaped space in the mould and makes one part per cycle. A 2-cavity mould for a bottle cap runs at {n:20} seconds.' } },
        { nl: 'Output per uur: {n:3600} / cyclustijd × holtes, hier {n:3600} / {n:20} × {n:2} = {n:360} doppen.', en: 'Output per hour: {n:3600} / cycle time × cavities, here {n:3600} / {n:20} × {n:2} = {n:360} caps.', focus: ['card'], points: ['t3.1', 'ex.text.1'],
          say: { nl: 'Output per uur is {n:3600} seconden gedeeld door de cyclustijd, maal het aantal holtes. Hier is dat {n:3600} gedeeld door {n:20}, maal {n:2}. Dat geeft {n:360} doppen per uur.', en: 'Output per hour is {n:3600} seconds divided by the cycle time, times the number of cavities. Here that is {n:3600} divided by {n:20}, times {n:2}. That gives {n:360} caps per hour.' } },
        { nl: 'Een 4-voudige matrijs op {n:24} seconden geeft {n:600} stuks per uur.', en: 'A 4-cavity mould at {n:24} seconds gives {n:600} parts per hour.', focus: ['card'], points: ['t3.1'],
          say: { nl: 'Een 4-voudige matrijs op {n:24} seconden geeft {n:3600} gedeeld door {n:24}, maal {n:4}. Dat is {n:600} stuks per uur.', en: 'A 4-cavity mould at {n:24} seconds gives {n:3600} divided by {n:24}, times {n:4}. That is {n:600} parts per hour.' } },
        { nl: 'Meer holtes: meer stuks per cyclus, maar ook een grotere, duurdere matrijs en een grotere pers.', en: 'More cavities: more parts per cycle, but also a bigger, dearer mould and a bigger press.', focus: ['card'], points: ['t3.2'],
          say: { nl: 'Meer holtes betekent meer stuks per cyclus. Maar het betekent ook een grotere, duurdere matrijs en een grotere pers.', en: 'More cavities means more parts per cycle. But it also means a bigger, dearer mould and a bigger press.' } },
        { nl: 'Een beschadigde holte gaat dicht: de matrijs draait op de rest, {n:25}% minder output.', en: 'A damaged cavity is shut off: the mould runs on the rest, {n:25}% less output.', focus: ['card'], points: ['t3.2'],
          say: { nl: 'Is één holte beschadigd, dan wordt die vaak dichtgezet en draait de matrijs op de andere drie. Dat is {n:25} procent minder output.', en: 'If one cavity is damaged, it is often shut off and the mould runs on the other three. That is {n:25} percent less output.' } },
      ],
    },
    {
      id: 's4', lesson: L1, level: 1, still: 0.9, title: { nl: 'Koelen door de wand', en: 'Cooling through the wall' },
      beats: [
        { nl: 'Water in de {t:Koelkanalen|koelkanalen} voert de warmte af, door de hele wand naar buiten.', en: 'Water in the {t:Cooling channels|cooling channels} carries the heat away, out through the whole wall.', cue: { Koelkanalen: 'channels' }, focus: ['channels'], points: ['t2.1'],
          say: { nl: 'Water in de {t:Koelkanalen|koelkanalen}, gaten in het staal, voert de warmte af. De kunststof stolt van buiten naar binnen, en de warmte moet door de hele wand naar buiten.', en: 'Water in the {t:Cooling channels|cooling channels}, holes in the steel, carries the heat away. The plastic sets from the outside in, and the heat has to get out through the whole wall.' } },
        { nl: 'Koeltijd groeit met het kwadraat van de wanddikte: twee keer zo dik, ruwweg vier keer zo lang.', en: 'Cooling time grows with the square of the wall thickness: twice as thick, roughly four times as long.', focus: ['cavity'], points: ['t2.1'],
          say: { nl: 'Kunststof geleidt warmte slecht. Daarom groeit de koeltijd met het kwadraat van de wanddikte. Een twee keer zo dikke wand vraagt ruwweg vier keer zoveel koeltijd.', en: 'Plastic conducts heat poorly. So cooling time grows with the square of the wall thickness. A wall twice as thick needs roughly four times the cooling time.' } },
        { nl: 'Ontwerpers vechten voor dunne, gelijkmatige wanden: één dikke {t:Bus|bus} bepaalt de cyclus.', en: 'Designers fight for thin, even walls: one thick {t:Boss|boss} sets the cycle.', cue: { Bus: 'boss' }, focus: ['boss'], points: ['t2.2'],
          say: { nl: 'Daarom vechten ontwerpers voor dunne, gelijkmatige wanden. Eén dikke {t:Bus|bus}, een massief nokje voor een schroef, kan de cyclus van het hele product bepalen.', en: 'That is why designers fight for thin, even walls. One thick {t:Boss|boss}, a solid stud for a screw, can set the cycle of the whole part.' } },
        { nl: 'Ook de matrijstemperatuur en de koelkanalen tellen mee.', en: 'The mould temperature and the cooling channels count too.', focus: ['mouldtemp', 'channels'], points: ['t2.2'],
          say: { nl: 'Ook de matrijstemperatuur telt mee, hoe warm het staal gehouden wordt. En de koelkanalen, gaten door het staal waar water doorheen stroomt.', en: 'The mould temperature counts too, how warm the steel is kept. And so do the cooling channels, holes through the steel that water flows through.' } },
      ],
    },
    {
      id: 's5', lesson: L1, level: 1, still: 0.9, title: { nl: 'Een dunnere wand', en: 'A thinner wall' },
      beats: [
        { nl: 'Een dop koelt {n:12} van zijn {n:20} seconden. De dikste wand gaat van {n:3} naar {n:2.4} mm.', en: 'A cap cools for {n:12} of its {n:20} seconds. The thickest wall goes from {n:3} to {n:2.4} mm.', focus: ['cavity'], points: ['ex.text.1'],
          read: { nl: 'wand {n:3} → {n:2.4} mm', en: 'wall {n:3} → {n:2.4} mm' },
          say: { nl: 'Een voorbeeld. Deze dop koelt {n:12} van zijn {n:20} seconden. De dikste wand is {n:3} millimeter, en de ontwerper brengt die naar {n:2.4}.', en: 'An example. This cap cools for {n:12} of its {n:20} seconds. The thickest wall is {n:3} millimetres, and the designer brings it down to {n:2.4}.' } },
        { nl: '({n:2.4} / {n:3})² = {n:0.64}: koelen zakt naar zo’n {n:7.7} s, de cyclus naar zo’n {n:15.7} s.', en: '({n:2.4} / {n:3})² = {n:0.64}: cooling drops to about {n:7.7} s, the cycle to about {n:15.7} s.', focus: ['labels'], points: ['ex.text.2'],
          say: { nl: 'De koeltijd schaalt met het kwadraat van de dikte. Dat is {n:2.4} gedeeld door {n:3}, in het kwadraat, dus {n:0.64}. De koeltijd zakt van {n:12} naar zo’n {n:7.7} seconden. De cyclus zakt naar zo’n {n:15.7}.', en: 'Cooling time scales with the square of the thickness. That is {n:2.4} divided by {n:3}, squared, so {n:0.64}. Cooling drops from {n:12} to about {n:7.7} seconds. The cycle drops to about {n:15.7}.' } },
        { nl: 'Output: {n:3600} / {n:15.7} × {n:2} ≈ {n:459} doppen per uur, ruim een kwart meer.', en: 'Output: {n:3600} / {n:15.7} × {n:2} ≈ {n:459} caps per hour, over a quarter more.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'De output stijgt naar {n:3600} gedeeld door {n:15.7}, maal {n:2}. Dat is ongeveer {n:459} doppen per uur, ruim een kwart meer, op dezelfde machine.', en: 'Output rises to {n:3600} divided by {n:15.7}, times {n:2}. That is about {n:459} caps per hour, over a quarter more, on the same machine.' } },
      ],
    },
    {
      id: 's6', lesson: L1, level: 1, still: 0.9, title: { nl: 'Een commercieel getal', en: 'A commercial number' },
      beats: [
        { nl: 'Cyclustijd is een commercieel getal: de verkoopprijs is berekend met een cyclustijd.', en: 'Cycle time is a commercial number: the selling price is calculated with a cycle time.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Cyclustijd is een commercieel getal. De verkoopprijs van een product is berekend met een cyclustijd.', en: 'Cycle time is a commercial number. The selling price of a part is calculated with a cycle time.' } },
        { nl: 'Loopt de echte cyclus {n:10}% langzamer, dan heeft de pers {n:10}% meer uren nodig en kan de marge verdwijnen.', en: 'If the real cycle runs {n:10}% slower, the press needs {n:10}% more hours and the margin can vanish.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Loopt de echte cyclus {n:10} procent langzamer, dan heeft de pers {n:10} procent meer uren nodig voor dezelfde producten. Dan kan de marge verdwijnen.', en: 'If the real cycle runs {n:10} percent slower, the press needs {n:10} percent more hours for the same parts. Then the margin can vanish.' } },
        { nl: 'Loopt een matrijs op {n:28} seconden? Vraag welke: gecalculeerd, ingesteld of echt gehaald.', en: 'A mould that runs at {n:28} seconds? Ask which: calculated, set, or really achieved.', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Zegt iemand dat een matrijs op {n:28} seconden loopt, vraag dan welke. De gecalculeerde cyclus uit de prijs. De ingestelde op de machine. Of het gemiddelde dat een week lang echt gehaald is.', en: 'If someone says a mould runs at {n:28} seconds, ask which one. The calculated cycle from the price. The one set on the machine. Or the average really achieved over a week.' } },
      ],
    },
    {
      id: 's7', lesson: L1, level: 1, still: 0.9, title: { nl: 'Verstopte tijd', en: 'Hidden time' },
      beats: [
        { nl: 'De machine weet niet wanneer het product koel is: de insteller tikt de koeltijd in, in seconden.', en: 'The machine does not know when the part is cool: the setter types the cooling time in, in seconds.', focus: ['cool'], points: ['t5.1'],
          say: { nl: 'De machine weet niet wanneer het product koel genoeg is. De koeltijd is een vast aantal seconden dat de insteller intikt, de technicus die de pers instelt.', en: 'The machine does not know when the part is cool enough. The cooling time is a fixed number of seconds that the setter types in, the technician who sets up the press.' } },
        { nl: 'Instellers zetten er vaak seconden bij voor de zekerheid, en halen die er nooit meer af.', en: 'Setters often add seconds to be safe, and never take them off again.', focus: ['cool'], points: ['t5.1'],
          say: { nl: 'Instellers zetten er dus vaak een paar seconden bij voor de zekerheid. En die halen ze er nooit meer af.', en: 'So setters often add a few seconds to be safe. And they never take them off again.' } },
        { nl: 'Andere verstopte tijd: een mal die te ver opengaat, een robotarm die wacht, een hete plek.', en: 'Other hidden time: a mould that opens too far, a robot arm that waits, a hot spot.', focus: ['card'], points: ['t5.2'],
          say: { nl: 'Andere verstopte tijd. Een matrijs die verder opengaat dan nodig. Een robotarm die wacht. Of een hete plek, een stuk staal waar het water niet komt.', en: 'Other hidden time. A mould that opens further than needed. A robot arm that waits. Or a hot spot, a piece of steel the water does not reach.' } },
        { nl: 'Scherpe vraag: wat begrenst deze cyclus, en heeft iemand al geprobeerd er een seconde af te halen?', en: 'A sharp question: what limits this cycle, and has anyone tried to take a second off?', focus: ['card'], points: ['t5.2'],
          say: { nl: 'Een scherpe vraag is. Wat begrenst deze cyclus, en heeft iemand al geprobeerd er een seconde af te halen?', en: 'A sharp question is this. What limits this cycle, and has anyone tried to take a second off?' } },
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
const unitsFrame = [350, 70, 630, 250];
const CAM = [
  { from: cam([0, 0, 40], 640), to: cam([0, 0, 40], 640) }, // the tour moves its own camera
  { from: fitCam(FIT, [24, 54, 616, 318]), to: fitCam(FIT, [24, 54, 616, 318], 1.05) },
  { from: camAt([-24, 2, 52], 560, 160, 0), to: camAt([-36, 4, 54], 240, 150, 10), a: 0.02, b: 0.3 },
  { from: fitCam(blockPts, [40, 30, 600, 330], 1.2), to: fitCam(blockPts, [40, 30, 600, 330], 1.27) },
  { from: fitCam(blockPts, [40, 140, 600, 330], 1.04), to: fitCam(blockPts, [40, 140, 600, 330]) },
  { from: fitCam(FIT, unitsFrame, 1.02), to: fitCam(FIT, unitsFrame, 1.1) },
  { from: fitCam(FIT, unitsFrame, 1.02), to: fitCam(FIT, unitsFrame, 1.1) },
];

// ---------------------------------------------------------------- page
const svg = svgOf(['press', 'section']);
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM, sets: ['section'], parts: ['press', 'section'] });
const label = {
  nl: 'Een spuitgietmachine die één cyclus draait, met een tijdbalk van de zes stappen; een doorsnede door een matrijs met koelkanalen en een wand met een dikke bus; kaarten met de uitkomst van het voorbeeld.',
  en: 'An injection moulding machine running one cycle, with a time bar of the six steps; a section through a mould with cooling channels and a wall with a thick boss; cards with the result of the example.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  auditPress(svg);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

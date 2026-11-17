// Dev tool, not shipped. Builds the lesson film "Koelen: wat de insteller kan veranderen / Cooling: what the setter can
// change" for the lesson eng.moulding.cooling (level 2 of the cycle topic of Spuitgieten). Task 17, pilot B: one of the
// four films the old film "Eén cyclus van 30 seconden" was split into; the mould section, its drawing and the stage
// library are those of films/eng.moulding.cycle (room.mjs, stage-lib.js, sets.js), imported, not copied.
//
//   node films/eng.moulding.cooling/build.mjs            build the page
//   node films/eng.moulding.cooling/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.cooling.html. The film carries every point of the lesson (points: on the
// beats): the ejection temperature and the three things that decide the cooling, the temperature control unit and the
// price of a colder mould, turbulent flow and limescale, the check on the water and the hot spots, the step-down of the
// cooling time and the worked example of the 4-cavity mould with its 11,5 seconds.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { svgOf, C, fitCam, blockPts, unitPts, css, stageScriptOf, beatTimes, k } from '../eng.moulding.cycle/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.moulding.cooling';
const L2 = 'eng.moulding.cooling';

const spec = {
  id: ID,
  title: { nl: 'Koelen: wat de insteller kan veranderen', en: 'Cooling: what the setter can change' },
  lessons: [L2],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], stageFns: ['waterBars', 'render', 'cardSvg', 'section', 'bossDims', 'dimLabels', 'magnifier', 'thermometer'] },
  scenes: [
    {
      id: 's1', lesson: L2, level: 2, still: 0.7, title: { nl: 'Een dop koelt af', en: 'A cap cools' },
      beats: [
        { nl: 'Een dop koelt in de matrijs; water voert de warmte af.', en: 'A cap cools in the mould; water carries the heat away.', focus: ['channels'],
          say: { nl: 'Een dop koelt af in de matrijs, en water voert de warmte af.', en: 'A cap cools in the mould, and water carries the heat away.' } },
        { nl: 'Wat bepaalt hoe snel? En wat kan de insteller veranderen?', en: 'What sets how fast? And what can the setter change?', focus: ['cavity'],
          say: { nl: 'Wat bepaalt hoe snel dat gaat? En wat kan de insteller daaraan veranderen?', en: 'What decides how fast that goes? And what can the setter change about it?' } },
      ],
    },
    {
      id: 's2', lesson: L2, level: 2, still: 0.7, title: { nl: 'De uitwerptemperatuur', en: 'The ejection temperature' },
      beats: [
        { nl: 'Op de {t:Uitwerptemperatuur|uitwerptemperatuur} is het dikste deel stijf genoeg om eruit te duwen.', en: 'At the {t:Ejection temperature|ejection temperature} the thickest part is stiff enough to push out.', cue: { Uitwerptemperatuur: 'eject' }, focus: ['eject'], points: ['t1.1'],
          say: { nl: 'Een product mag de matrijs uit zodra het dikste deel stijf genoeg is om eruit geduwd te worden zonder te vervormen. De temperatuur waarbij dat zo is, heet de {t:Uitwerptemperatuur|uitwerptemperatuur}, ook wel ontvormtemperatuur. De materiaalleverancier geeft die waarde in het datablad.', en: 'A part may leave the mould as soon as its thickest section is stiff enough to be pushed out without bending. The temperature at which that is true is the {t:Ejection temperature|ejection temperature}, also called the demoulding temperature. The material supplier gives that value in the datasheet.' } },
        { nl: 'Drie dingen bepalen de snelheid: wanddikte, {t:Matrijstemperatuur|matrijstemperatuur} en afvoer door het water.', en: 'Three things set the speed: wall thickness, {t:Mould temperature|mould temperature} and how the water carries heat.', cue: { Matrijstemperatuur: 'mouldtemp' }, focus: ['card', 'mouldtemp'], points: ['t1.2'],
          say: { nl: 'Drie dingen bepalen hoe snel het product daar komt. De wanddikte, die in het kwadraat telt. De {t:Matrijstemperatuur|matrijstemperatuur}, hoe warm het staal gehouden wordt. En hoe goed het water de warmte afvoert. De insteller regelt de laatste twee.', en: 'Three things decide how fast the part gets there. The wall thickness, which counts squared. The {t:Mould temperature|mould temperature}, how warm the steel is kept. And how well the water carries the heat away. The setter controls the last two.' } },
      ],
    },
    {
      id: 's3', lesson: L2, level: 2, still: 0.9, title: { nl: 'De matrijstemperatuur', en: 'The mould temperature' },
      beats: [
        { nl: 'Een {t:Temperatuurregelaar|temperatuurregelaar} verwarmt of koelt water of olie en pompt het rond.', en: 'A {t:Temperature control unit|temperature control unit} heats or cools water or oil and pumps it through the channels.', cue: { Temperatuurregelaar: 'tcu' }, focus: ['tcu'], points: ['t2.1'],
          say: { nl: 'De matrijstemperatuur stel je in op een {t:Temperatuurregelaar|temperatuurregelaar}. Dat is een kast naast de pers die water, of olie, verwarmt of koelt en door de koelkanalen pompt.', en: 'You set the mould temperature on a {t:Temperature control unit|temperature control unit}. That is a cabinet beside the press that heats or cools water, or oil, and pumps it through the cooling channels.' } },
        { nl: 'Kouder staal koelt sneller, maar te koud geeft een dof oppervlak, vloeilijnen en ingevroren spanning.', en: 'Colder steel cools faster, but not for free: too cold gives a dull surface, flow lines and frozen-in stress.', focus: ['mouldtemp', 'card'], points: ['t2.1', 't2.2'],
          say: { nl: 'Kouder staal koelt sneller, maar niet gratis. Te koud geeft een dof oppervlak, zichtbare vloeilijnen en ingevroren spanning.', en: 'Colder steel cools faster, but not for free. Too cold gives a dull surface, visible flow lines and frozen-in stress.' } },
        { nl: 'PA krimpt dagen later na; het datablad geeft de temperatuur, voor PA6 {n:80} °C.', en: 'PA shrinks days later; the datasheet gives the mould temperature, {n:80} °C for PA6.', focus: ['card', 'mouldtemp'], points: ['t2.2'],
          say: { nl: 'Semi-kristallijne kunststoffen zoals PA kunnen dan in de matrijs niet al hun kristallen vormen, en krimpen dagen later nog. Daarom geeft het datablad een matrijstemperatuur, voor PA6 bijvoorbeeld {n:80} graden.', en: 'Semi-crystalline plastics such as PA then cannot form all their crystals in the mould, and shrink days later. That is why the datasheet gives a mould temperature, {n:80} degrees for PA6, for example.' } },
      ],
    },
    {
      id: 's4', lesson: L2, level: 2, still: 0.9, title: { nl: 'De doorstroming', en: 'The flow of the water' },
      beats: [
        { nl: 'Het water stroomt hard genoeg voor {t:Turbulente stroming|turbulente stroming}: wervelend, niet in laagjes.', en: 'The water flows hard enough for {t:Turbulent flow|turbulent flow}: swirling, not in layers.', cue: { 'Turbulente stroming': 'turb' }, focus: ['turb'], points: ['t3.1'],
          say: { nl: 'Het water moet hard genoeg stromen voor {t:Turbulente stroming|turbulente stroming}. Wervelend in plaats van in laagjes glijdend, want wervelend water voert veel beter warmte af.', en: 'The water must flow hard enough for {t:Turbulent flow|turbulent flow}. Swirling instead of sliding in layers, because swirling water carries heat away far better.' } },
        { nl: 'Kalkaanslag in de kanalen werkt als isolatie.', en: 'Limescale in the channels acts as insulation.', focus: ['turb'], points: ['t3.1'],
          say: { nl: 'Kalkaanslag in de kanalen werkt als isolatie.', en: 'Limescale in the channels acts as insulation.' } },
      ],
    },
    {
      id: 's5', lesson: L2, level: 2, still: 0.9, title: { nl: 'De controle', en: 'The check' },
      beats: [
        { nl: 'Goede check: het water komt er maar een paar graden warmer uit. Een groot verschil: te weinig doorstroming.', en: 'A good check: the water comes out only a few degrees warmer. A large difference means too little flow.', focus: ['labels'], points: ['t3.2'],
          say: { nl: 'Een goede check. Het water komt er maar een paar graden warmer uit dan het erin ging. Een groot verschil betekent te weinig doorstroming.', en: 'A good check. The water comes out only a few degrees warmer than it went in. A large difference means too little flow.' } },
        { nl: 'Hete plekken, waar het water niet komt, bepalen de cyclus van het hele product.', en: 'Hot spots, where the water does not reach, set the cycle of the whole part.', focus: ['hot'], points: ['t3.2'],
          say: { nl: 'Hete plekken zijn plekken waar het water niet komt, zoals een lange kern zonder kanaal erin. Ze bepalen de cyclus van het hele product.', en: 'Hot spots are places the water does not reach, such as a long core with no channel in it. They set the cycle of the whole part.' } },
      ],
    },
    {
      id: 's6', lesson: L2, level: 2, still: 0.9, title: { nl: 'Stap voor stap', en: 'Step by step' },
      beats: [
        { nl: 'Verlaag de koeltijd in stapjes van een seconde en meet bij elke stap de kritische maat.', en: 'Lower the cooling time in steps of a second and measure the critical size at each step.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Instellers zetten er vaak seconden koeltijd bij voor de zekerheid. De nette manier om het echte minimum te vinden is anders. Verlaag de koeltijd in kleine stapjes, bijvoorbeeld een seconde. Meet bij elke stap de kritische maat of het kromtrekken, nadat de producten op kamertemperatuur zijn.', en: 'Setters often add seconds of cooling time to be safe. The proper way to find the real minimum is different. Lower the cooling time in small steps, for example a second. At each step measure the critical dimension or the warpage, after the parts are at room temperature.' } },
        { nl: 'Een 4-voudige matrijs: cyclus {n:24} s, koelen {n:14} s, {n:3600} / {n:24} × {n:4} = {n:600} per uur.', en: 'A 4-cavity mould: cycle {n:24} s, cooling {n:14} s, {n:3600} / {n:24} × {n:4} = {n:600} per hour.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een voorbeeld. Een 4-voudige matrijs draait een cyclus van {n:24} seconden met {n:14} seconden koelen. Dat is {n:3600} gedeeld door {n:24}, maal {n:4}, dus {n:600} stuks per uur.', en: 'An example. A 4-cavity mould runs a cycle of {n:24} seconds with {n:14} seconds of cooling. That is {n:3600} divided by {n:24}, times {n:4}, so {n:600} parts per hour.' } },
        { nl: 'Stappen van een seconde, gemeten na {n:24} uur: {n:11} s is goed, {n:10} s valt buiten de tolerantie.', en: 'Steps of a second, measured after {n:24} hours: {n:11} s is good, {n:10} s is out of tolerance.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'De insteller verlaagt het koelen in stappen van een seconde en meet de kritische lengte van elke stap na {n:24} uur. Op {n:11} seconden zijn alle producten goed. Op {n:10} seconden valt de lengte buiten de tolerantie.', en: 'The setter lowers the cooling in steps of a second and measures the critical length of each step after {n:24} hours. At {n:11} seconds all parts are good. At {n:10} seconds the length falls outside the tolerance.' } },
      ],
    },
    {
      id: 's7', lesson: L2, level: 2, still: 0.9, title: { nl: 'De instelling', en: 'The setting' },
      beats: [
        { nl: 'De laatste goede stap plus een kleine marge wordt de instelling; leg die vast met de reden.', en: 'The last good step plus a small margin becomes the setting; record it with the reason.', focus: ['card'], points: ['t4.2'],
          say: { nl: 'De laatste stap waarbij alles binnen de tolerantie valt, plus een kleine marge, wordt de instelling. Leg die vast met de reden, zodat niemand de seconden er zonder data weer bij zet.', en: 'The last step at which everything is within tolerance, plus a small margin, becomes the setting. Record it with the reason, so nobody adds the seconds back without data.' } },
        { nl: 'Ze zet {n:11.5} s: de cyclus wordt {n:24} − {n:2.5} = {n:21.5} s.', en: 'She sets {n:11.5} s: the cycle becomes {n:24} − {n:2.5} = {n:21.5} s.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'Ze zet {n:11.5} seconden. Dat haalt {n:2.5} seconden van de {n:24} af, dus de cyclus wordt {n:21.5} seconden.', en: 'She sets {n:11.5} seconds. That takes {n:2.5} seconds off the {n:24}, so the cycle becomes {n:21.5} seconds.' } },
        { nl: 'Output: {n:3600} / {n:21.5} × {n:4} ≈ {n:670} per uur, zo’n {n:12}% meer op dezelfde pers.', en: 'Output: {n:3600} / {n:21.5} × {n:4} ≈ {n:670} per hour, about {n:12}% more on the same press.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'De output wordt {n:3600} gedeeld door {n:21.5}, maal {n:4}. Dat is ongeveer {n:670} stuks per uur, zo’n {n:12} procent meer op dezelfde pers en matrijs.', en: 'Output becomes {n:3600} divided by {n:21.5}, times {n:4}. That is about {n:670} parts per hour, about {n:12} percent more on the same press and mould.' } },
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
const CAM = [
  { from: fitCam(blockPts, [40, 36, 600, 330], 1.0), to: fitCam(blockPts, [40, 36, 600, 330], 1.1) },
  { from: fitCam(blockPts, [200, 235, 540, 392], 1.0), to: fitCam(blockPts, [200, 235, 540, 392], 1.05) },
  { from: fitCam(unitPts, [310, 70, 626, 392], 0.98), to: fitCam(unitPts, [310, 70, 626, 392], 1.04) },
  { from: fitCam(blockPts, [190, 150, 600, 392], 1.0), to: fitCam(blockPts, [190, 150, 600, 392], 1.06) },
  { from: fitCam(blockPts, [190, 185, 616, 392], 1.0), to: fitCam(blockPts, [190, 185, 616, 392], 1.06) },
  { from: fitCam(blockPts, [350, 150, 626, 392], 1.0), to: fitCam(blockPts, [350, 150, 626, 392], 1.05) },
  { from: fitCam(blockPts, [350, 150, 626, 392], 1.0), to: fitCam(blockPts, [350, 150, 626, 392], 1.05) },
];

// ---------------------------------------------------------------- page
const svg = svgOf(['section']);
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM, sets: ['section', 'tcu'], parts: ['section', 'gauges'] });
const label = {
  nl: 'Een doorsnede door een matrijsblok met koelkanalen en een dopwand, met een temperatuurregelaar naast het blok; een thermometer, een vergrootglas op een kanaal, een hete plek en kaarten met de uitkomst van het voorbeeld.',
  en: 'A section through a mould block with cooling channels and a cap wall, with a temperature control unit beside the block; a thermometer, a magnifier on a channel, a hot spot and cards with the result of the example.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB`);
}

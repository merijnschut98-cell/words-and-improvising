// Dev tool, not shipped. Builds the lesson film "Lasparameters: draad, spanning en snelheid / Welding parameters" for the
// lesson eng.joining.weldparams (level 2 of the topic Booglassen of Lassen en verbinden). Task 17, batch B1: one of the
// four films the old film "Van boog tot scheur" was split into; the bench, its drawing and the stage library are those
// of films/eng.joining.arc (room.mjs, stage-lib.js), imported, not copied.
//
//   node films/eng.joining.weldparams/build.mjs            build the page
//   node films/eng.joining.weldparams/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.weldparams.html. The film carries every point of the lesson (points:
// on the beats): the four knobs, the current that follows the wire, short and spray arc, heat input, the deposition
// rate, and the a5 fillet weld of the worked example from wire to 1,0 kJ/mm.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { worldOf, hudParts, svgOf, C, cam, css, stageScriptOf, beatTimes, beatTimesOf, k } from '../eng.joining.arc/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.joining.weldparams';
const L2 = 'eng.joining.weldparams';

const spec = {
  id: ID,
  title: { nl: 'Lasparameters: draad, spanning en snelheid', en: 'Welding parameters: wire, voltage and speed' },
  lessons: [L2],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5'], stageFns: ['cards', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L2, level: 2, still: 0.9, title: { nl: 'Vier knoppen', en: 'Four knobs' },
      beats: [
        { nl: 'Vier knoppen: {t:Draadsnelheid|draadsnelheid}, spanning, lassnelheid en vrije draadlengte.', en: 'Four knobs: {t:Wire feed speed|wire feed speed}, voltage, travel speed and stick-out.', cue: { Draadsnelheid: 'wfs' }, focus: ['source'], points: ['t1.1'],
          say: { nl: 'Een MAG-lasser heeft vier knoppen. De {t:Draadsnelheid|draadsnelheid}, dat zijn de meters draad per minuut de toorts in. De spanning. De lassnelheid, hoe snel de toorts langs de naad gaat. En de vrije draadlengte.', en: 'A MAG welder has four knobs. The {t:Wire feed speed|wire feed speed}, the metres of wire per minute into the torch. The voltage. The travel speed, how fast the torch moves along the joint. And the stick-out.' } },
        { nl: 'De vrije draadlengte, stick-out, is de draad tussen contactbuis en boog: {n:10} tot {n:20} mm.', en: 'Stick-out is the wire between contact tip and arc: {n:10} to {n:20} mm.', focus: ['torch'], points: ['t1.1'],
          say: { nl: 'De vrije draadlengte heet in het Engels stick-out. Dat is het stukje draad tussen de contactbuis en de boog, zo’n {n:10} tot {n:20} millimeter. De contactbuis is het koperen buisje dat de stroom op de draad zet.', en: 'The stick-out is the stretch of wire between the contact tip and the arc, about {n:10} to {n:20} millimetres. The contact tip is the copper tube that feeds the wire its current.' } },
        { nl: 'De stroombron houdt de spanning vast: meer draad per minuut trekt meer ampère.', en: 'The power source holds the voltage constant: more wire per minute draws more amps.', focus: ['wfs'], points: ['t1.2'],
          say: { nl: 'De stroombron houdt de spanning vast en de stroom volgt de draad. Meer draad per minuut trekt meer ampère. Lassers zeggen draad omhoog voor meer stroom.', en: 'The power source holds the voltage constant, and the current follows the wire feed. More wire per minute draws more amps. Welders say turn the wire up for more current.' } },
        { nl: 'De spanning bepaalt de booglengte: hoger is langer, breder en platter.', en: 'Voltage sets the arc length: higher is longer, wider and flatter.', focus: ['source'], points: ['t1.2'],
          say: { nl: 'De spanning bepaalt de booglengte. Hoger is langer, breder en platter.', en: 'Voltage sets the arc length. Higher is longer, wider and flatter.' } },
      ],
    },
    {
      id: 's2', lesson: L2, level: 2, still: 0.9, title: { nl: 'Druppelovergang', en: 'Metal transfer' },
      beats: [
        { nl: 'Hoe het metaal van draad naar smeltbad gaat, heet druppelovergang.', en: 'How metal moves from wire to pool is called metal transfer.', focus: ['torch'], points: ['t2.1'],
          say: { nl: 'Hoe het metaal van de draad naar het smeltbad gaat, heet de druppelovergang.', en: 'How the metal moves from the wire to the weld pool is the metal transfer.' } },
        { nl: 'Laag: {t:Kortsluitboog|kortsluitboog}, de draad tikt tientallen keren per seconde in het bad.', en: 'Low: {t:Short arc|short arc}, the wire dips into the pool tens of times a second.', cue: { Kortsluitboog: 'short' }, focus: ['short'], points: ['t2.1'],
          say: { nl: 'Bij lage instellingen krijg je een {t:Kortsluitboog|kortsluitboog}. De draad tikt tientallen keren per seconde in het smeltbad.', en: 'At low settings you get a {t:Short arc|short arc}. The wire dips into the pool tens of times a second.' } },
        { nl: 'Weinig warmte: goed voor dunne plaat en lassen in positie, tegen de wand of boven het hoofd.', en: 'Little heat: suits thin sheet and welding in position, up a wall or overhead.', focus: ['short'], points: ['t2.1'],
          say: { nl: 'Dat geeft weinig warmte. Het past bij dunne plaat en bij lassen in positie, dus tegen de wand of boven het hoofd.', en: 'That gives little heat. It suits thin sheet and welding in position, so up a wall or overhead.' } },
        { nl: 'Hoge stroom en argonrijk gas: {t:Sproeiboog|sproeiboog}, een fijne straal druppels met diepe inbranding.', en: 'High current and argon-rich gas: {t:Spray arc|spray arc}, a fine stream of droplets, deep penetration.', cue: { Sproeiboog: 'spray' }, focus: ['spray'], points: ['t2.2'],
          say: { nl: 'Bij hoge stroom en argonrijk gas krijg je een {t:Sproeiboog|sproeiboog}. Dat is een fijne straal druppeltjes, met diepe inbranding en veel lasmetaal.', en: 'At high current with an argon-rich gas you get a {t:Spray arc|spray arc}. That is a fine stream of droplets, with deep penetration and a lot of weld metal.' } },
        { nl: 'Alleen vlak of horizontaal. Moderne machines hebben ook een pulsboog, die tussen hoog en laag wisselt.', en: 'Only flat or horizontal. Modern machines also offer a pulsed arc, switching between high and low.', focus: ['spray'], points: ['t2.2'],
          say: { nl: 'De sproeiboog kan alleen vlak of horizontaal. Moderne machines hebben ook een pulsboog. Die wisselt tussen hoog en laag.', en: 'The spray arc works only flat or horizontal. Modern machines also offer a pulsed arc. It switches between high and low.' } },
      ],
    },
    {
      id: 's3', lesson: L2, level: 2, still: 0.9, title: { nl: 'Warmte-inbreng', en: 'Heat input' },
      beats: [
        { nl: '{t:Warmte-inbreng|Warmte-inbreng} is booglasenergie maal rendement: {n:0.8} voor MAG, {n:0.6} voor TIG.', en: '{t:Heat input|Heat input} is arc energy times efficiency: {n:0.8} for MAG, {n:0.6} for TIG.', cue: { 'Warmte-inbreng': 'heat' }, focus: ['heat'], points: ['t3.1'], read: { nl: 'EN 1011-1', en: 'EN 1011-1' },
          say: { nl: 'De {t:Warmte-inbreng|warmte-inbreng} is de booglasenergie, de warmte per millimeter las, maal het rendement van het proces. Dat is {n:0.8} voor MAG en {n:0.6} voor TIG, volgens EN 1011-1.', en: 'The {t:Heat input|heat input} is the arc energy, the heat per millimetre of weld, times the efficiency of the process. That is {n:0.8} for MAG and {n:0.6} for TIG, per EN 1011-1.' } },
        { nl: 'De lassnelheid is de sterkste knop: halveer haar en de warmte-inbreng verdubbelt.', en: 'Travel speed is the strongest lever: halve it and the heat input doubles.', focus: ['travel'], points: ['t3.1'],
          say: { nl: 'De lassnelheid is de sterkste knop. Halveer je de snelheid bij dezelfde volt en ampère, dan verdubbelt de warmte-inbreng.', en: 'Travel speed is the strongest lever. Halve the speed at the same volts and amps and the heat input doubles.' } },
        { nl: 'De lasmethode geeft een bereik; de lascoördinator controleert het met een meter of in het robotlog.', en: 'The procedure gives a range; the welding coordinator checks it with a meter or in the robot log.', focus: ['panel'], points: ['t3.2'],
          say: { nl: 'De lasmethode geeft een bereik. De lascoördinator, die verantwoordelijk is voor de laskwaliteit, controleert dat met een meter of in het robotlog.', en: 'The welding procedure gives a range. The welding coordinator, who answers for welding quality, checks it with a meter or in the robot log.' } },
        { nl: 'Meet de spanning dicht bij de boog: lange kabels geven verlies.', en: 'Measure the voltage close to the arc: long cables lose some.', focus: ['source'], points: ['t3.2'],
          say: { nl: 'Meet de spanning dicht bij de boog. Lange kabels geven verlies.', en: 'Measure the voltage close to the arc. Long cables lose some.' } },
      ],
    },
    {
      id: 's4', lesson: L2, level: 2, still: 0.9, title: { nl: 'Neersmeltsnelheid', en: 'Deposition rate' },
      beats: [
        { nl: 'De {t:Neersmeltsnelheid|neersmeltsnelheid} is hoeveel kilo lasmetaal er per uur bij komt.', en: 'The {t:Deposition rate|deposition rate} is how many kilos of weld metal go in per hour.', cue: { Neersmeltsnelheid: 'bead' }, focus: ['bead'], points: ['t4.1'],
          say: { nl: 'De {t:Neersmeltsnelheid|neersmeltsnelheid} is hoeveel kilo lasmetaal er per uur bij komt.', en: 'The {t:Deposition rate|deposition rate} is how many kilos of weld metal go in per hour.' } },
        { nl: 'Massieve draad: doorsnede × draadsnelheid × dichtheid, voor staal {n:7.85} g/cm³, min wat spatten.', en: 'Solid wire: cross-section × wire feed speed × density, steel {n:7.85} g/cm³, minus some spatter.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Bij massieve draad reken je die uit. Je neemt de draaddoorsnede. Dat is pi gedeeld door 4 maal de diameter in het kwadraat. Die maal de draadsnelheid en maal de dichtheid. Voor staal is dat {n:7.85} gram per kubieke centimeter. Trek er een paar procent af voor spatten.', en: 'For solid wire you can work it out. Take the wire cross-section. That is pi over 4 times the diameter squared. Multiply it by the wire feed speed and by the density. For steel that is {n:7.85} grams per cubic centimetre. Take off a few percent for spatter.' } },
        { nl: 'Dit getal betaalt de productiemanager: het bepaalt hoe lang een meter las duurt.', en: 'This is the number the production manager pays for: it sets how long a metre of weld takes.', focus: ['bead'], points: ['t4.2'],
          say: { nl: 'Dit getal betaalt de productiemanager. Het bepaalt hoe lang een meter las duurt.', en: 'This is the number the production manager pays for. It sets how long a metre of weld takes.' } },
        { nl: 'Een grotere las vraagt meer kilo’s, dus meer tijd en meer warmte.', en: 'A bigger weld needs more kilos, so more time and more heat.', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Een grotere las vraagt meer kilo’s, dus meer tijd en meer warmte.', en: 'A bigger weld needs more kilos, so more time and more heat.' } },
      ],
    },
    {
      id: 's5', lesson: L2, level: 2, still: 0.9, title: { nl: 'Voorbeeld: de hoeklas', en: 'Example: the fillet weld' },
      beats: [
        { nl: 'Een robot last een hoeklas, keel {n:5} mm (a5), met draad van {n:1.2} mm op {n:10} m per minuut.', en: 'A robot welds an a5 fillet, {n:5} mm throat, with {n:1.2} mm wire at {n:10} m per minute.', focus: ['wfs'], points: ['ex.text.1'],
          say: { nl: 'Een robot last een hoeklas met een keeldoorsnede van {n:5} millimeter, dat heet a5. De draad is {n:1.2} millimeter en de draadsnelheid is {n:10} meter per minuut.', en: 'A robot welds a fillet weld with a {n:5} millimetre throat, called a5. The wire is {n:1.2} millimetres and the wire feed speed is {n:10} metres per minute.' } },
        { nl: 'Draaddoorsnede π/4 × {n:1.2}² = {n:1.13} mm². Per minuut {n:11.3} cm³, maal {n:7.85} is {n:89} gram.', en: 'Wire cross-section π/4 × {n:1.2}² = {n:1.13} mm². Per minute {n:11.3} cm³, times {n:7.85} is {n:89} grams.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'De draaddoorsnede is pi gedeeld door 4 maal {n:1.2} in het kwadraat, dat is {n:1.13} vierkante millimeter. Per minuut is dat {n:11300} kubieke millimeter, dus {n:11.3} kubieke centimeter. Maal {n:7.85} geeft {n:89} gram.', en: 'The wire cross-section is pi over 4 times {n:1.2} squared, that is {n:1.13} square millimetres. Per minute that is {n:11300} cubic millimetres, so {n:11.3} cubic centimetres. Times {n:7.85} gives {n:89} grams.' } },
        { nl: 'Dat is {n:5.3} kg per uur; na spatverlies zo’n {n:5} kg per uur, {n:83} gram per minuut.', en: 'That is {n:5.3} kg an hour; after spatter loss about {n:5} kg an hour, {n:83} grams a minute.', focus: ['bead'], points: ['ex.text.1'],
          say: { nl: 'Dat is {n:5.3} kilo per uur. Na spatverlies is het zo’n {n:5} kilo per uur, dus {n:83} gram per minuut.', en: 'That is {n:5.3} kilos an hour. After spatter loss it is about {n:5} kilos an hour, so {n:83} grams a minute.' } },
        { nl: 'Een a5-hoeklas heeft een doorsnede van ongeveer {n:25} mm²: {n:25} cm³ en {n:196} gram per meter.', en: 'An a5 fillet has a cross-section of about {n:25} mm²: {n:25} cm³ and {n:196} grams a metre.', focus: ['bead'], points: ['ex.text.2'],
          say: { nl: 'Een a5-hoeklas heeft een doorsnede van ongeveer a in het kwadraat, dat is {n:25} vierkante millimeter. Dus {n:25} kubieke centimeter en {n:196} gram per meter.', en: 'An a5 fillet has a cross-section of about a squared, that is {n:25} square millimetres. So {n:25} cubic centimetres and {n:196} grams a metre.' } },
        { nl: '{n:196} / {n:83} = {n:2.4} minuten per meter: een lassnelheid van zo’n {n:420} mm per minuut.', en: '{n:196} / {n:83} = {n:2.4} minutes a metre: a travel speed of about {n:420} mm per minute.', focus: ['travel'], points: ['ex.text.2'],
          say: { nl: '{n:196} gedeeld door {n:83} is {n:2.4} minuten per meter. Dat is een lassnelheid van zo’n {n:420} millimeter per minuut.', en: '{n:196} divided by {n:83} is {n:2.4} minutes a metre. That is a travel speed of about {n:420} millimetres per minute.' } },
        { nl: 'Het robotlog toont {n:29} V en {n:300} A: {n:1.24} kJ/mm; maal {n:0.8} is de warmte-inbreng {n:1.0} kJ/mm.', en: 'The robot log shows {n:29} V and {n:300} A: {n:1.24} kJ/mm; times {n:0.8} the heat input is {n:1.0} kJ/mm.', focus: ['panel'], points: ['ex.text.3'], read: { nl: '{n:29} × {n:300} × {n:60} / ({n:420} × {n:1000}) = {n:1.24} kJ/mm', en: '{n:29} × {n:300} × {n:60} / ({n:420} × {n:1000}) = {n:1.24} kJ/mm' },
          say: { nl: 'Het robotlog toont {n:29} volt en {n:300} ampère. De booglasenergie is dan {n:1.24} kilojoule per millimeter. Maal {n:0.8} is de warmte-inbreng {n:1.0} kilojoule per millimeter.', en: 'The robot log shows {n:29} volts and {n:300} amps. The arc energy is then {n:1.24} kilojoules per millimetre. Times {n:0.8} the heat input is {n:1.0} kilojoules per millimetre.' } },
      ],
    },
  ],
  skip: [],
};

// the scene lengths follow the words: the captions are readable, the narration fits (about 2.8 words a second)
const plainWords = (src) => wordsOf(src.replace(/\{[tn]:([^{}|]*)(\|([^{}]*))?\}/g, (m, a, b, c) => c || a));
for (const s of spec.scenes) {
  const cap = Math.max(...['nl', 'en'].map((l) => s.beats.reduce((a, b) => a + plainWords(b[l]), 0)));
  const nar = s.beats.reduce((a, b) => a + plainWords(b.say.nl), 0);
  s.dur = Math.ceil(Math.max(minSceneDur(cap + 6), nar / 2.7));
}
beatTimes(spec.scenes, plainWords, beatStarts);

// ---------------------------------------------------------------- cameras (one move per scene)
const CAM = [
  { from: cam([-62, -70, 46], 470, [250, 200]), to: cam([-78, -66, 42], 420, [250, 200]) },
  { from: cam([20, -6, 22], 260, [200, 230]), to: cam([10, -6, 22], 240, [200, 230]) },
  { from: cam([20, -6, 22], 280, [200, 250]), to: cam([0, -6, 22], 240, [200, 250]) },
  { from: cam([-20, -6, 22], 300, [200, 250]), to: cam([-40, -6, 22], 260, [200, 250]) },
  { from: cam([-60, -20, 26], 360, [200, 250]), to: cam([-80, -6, 22], 300, [200, 250]) },
];

// ---------------------------------------------------------------- page
const world = worldOf({});
const hud = [hudParts.dial, hudParts.mag, hudParts.card].join('');
const svg = svgOf(world, hud);
let script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een lastafel met twee stalen platen en een V-naad, een MAG-toorts, een lasapparaat met draadhaspel en een gasfles; daarbij een draadsnelheidsmeter, een uitvergrote boog en kaarten met de berekening.',
  en: 'A welding table with two steel plates and a V groove, a MAG torch, a power source with a wire spool and a gas bottle; with a wire feed dial, a close-up of the arc and cards with the calculation.',
};

let { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });
beatTimesOf(data, beatStarts);
script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
({ data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label }));

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

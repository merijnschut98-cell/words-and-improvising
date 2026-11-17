// Dev tool, not shipped. Builds the lesson film "Booglassen: de basis / Arc welding basics" for the lesson
// eng.joining.arc (level 1 of the topic Booglassen of Lassen en verbinden). Task 17, batch B1: the old film "Van boog
// tot scheur" served four lessons and dropped many of their points; it is split into one complete film per lesson
// (D2, D3), and this one keeps the id. Its sisters are films/eng.joining.weldparams, .wps and .metallurgy; the bench,
// its drawing and the stage library are in this folder (room.mjs, stage-lib.js).
//
//   node films/eng.joining.arc/build.mjs            build the page
//   node films/eng.joining.arc/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.arc.html: one offline page. The film carries every point of the
// lesson (points: on the beats): the arc, the weld pool, the shielding gas, MIG/MAG, TIG, the heat per millimetre,
// and the worked example of the bracket and the kinked gas hose.
import { join } from 'node:path';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { worldOf, hudParts, svgOf, P, W, H, C, at, cam, css, stageScriptOf, beatTimes, beatTimesOf, k, HERE } from './room.mjs';

const ID = 'eng.joining.arc';
const L1 = 'eng.joining.arc';

const spec = {
  id: ID,
  title: { nl: 'Booglassen: de basis', en: 'Arc welding basics' },
  lessons: [L1],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], stageFns: ['cards', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L1, level: 1, still: 0.85, title: { nl: 'Hoe booglassen werkt', en: 'How arc welding works' },
      beats: [
        { nl: 'Booglassen verbindt twee metalen delen door hun randen samen te smelten.', en: 'Arc welding joins two metal parts by melting their edges together.', focus: ['plates'], points: ['t1.1'],
          say: { nl: 'Hoe werkt booglassen? Op de lastafel liggen twee stalen platen. Booglassen smelt hun randen samen, en als het metaal stolt, zijn ze één stuk.', en: 'How does arc welding work? On the welding table lie two steel plates. Arc welding melts their edges together. When the metal sets, they are one piece.' } },
        { nl: 'De boog is een vonk tussen elektrode en werkstuk: {n:20} tot {n:35} volt en {n:100} tot {n:400} ampère.', en: 'The arc is a spark between electrode and part: {n:20} to {n:35} volts and {n:100} to {n:400} amps.', focus: ['source'], points: ['t1.1'],
          say: { nl: 'De warmte komt van een elektrische boog. Dat is een doorlopende vonk tussen de elektrode en het werkstuk. De elektrode is de draad of staaf waar de stroom door gaat. Het lasapparaat levert {n:20} tot {n:35} volt en {n:100} tot {n:400} ampère. Een waterkoker trekt zo’n {n:10} ampère.', en: 'The heat comes from an electric arc. That is a continuous spark between the electrode and the part. The electrode is the live wire or rod that the current runs through. The power source delivers {n:20} to {n:35} volts and {n:100} to {n:400} amps. A kettle draws about {n:10} amps.' } },
        { nl: 'Het gesmolten metaal is het {t:Smeltbad|smeltbad}. Toevoegmateriaal vult de naad.', en: 'The molten metal is the {t:Weld pool|weld pool}. Filler metal fills the joint.', cue: { Smeltbad: 'pool' }, focus: ['pool'], points: ['t1.2'],
          say: { nl: 'Het gesmolten metaal vormt een gloeiend plasje, het {t:Smeltbad|smeltbad}. Achter de boog stolt het tot de las. Extra metaal, het toevoegmateriaal, vult de naad. De delen zelf heten het basismateriaal.', en: 'The molten metal forms a small glowing puddle, the {t:Weld pool|weld pool}. Behind the arc it freezes into the weld. Extra metal, the filler, fills the joint. The parts themselves are the base metal.' } },
      ],
    },
    {
      id: 's2', lesson: L1, level: 1, still: 0.9, title: { nl: 'Beschermgas', en: 'Shielding gas' },
      beats: [
        { nl: 'Zuurstof en stikstof uit de lucht laten gasbelletjes achter en maken de las bros.', en: 'Oxygen and nitrogen from the air leave gas bubbles and make the weld brittle.', focus: ['pool'], points: ['t2.1'],
          say: { nl: 'Lucht moet wegblijven van het smeltbad. Zuurstof en stikstof laten gasbelletjes achter, dat heet porositeit. Ze maken de las ook bros.', en: 'Air must stay away from the weld pool. Oxygen and nitrogen leave gas bubbles, called porosity. They also make the weld brittle.' } },
        { nl: '{t:Beschermgas|Beschermgas} uit de toorts rondom het smeltbad: {n:12} tot {n:18} liter per minuut.', en: '{t:Shielding gas|Shielding gas} from the torch around the pool: {n:12} to {n:18} litres a minute.', cue: { Beschermgas: 'gas' }, focus: ['gas'], points: ['t2.1'],
          say: { nl: 'Daarom stroomt er {t:Beschermgas|beschermgas} uit de toorts, het laspistool, rond het smeltbad. Meestal is dat {n:12} tot {n:18} liter per minuut.', en: 'So {t:Shielding gas|shielding gas} flows out of the torch, the welding gun, around the pool. Usually that is {n:12} to {n:18} litres a minute.' } },
        { nl: 'Op de vloer hoor je het: een goede MAG-boog knettert gelijkmatig, als spek in de pan.', en: 'On the floor you can hear it: a good MAG arc crackles steadily, like bacon frying.', focus: ['torch'], points: ['t2.2'],
          say: { nl: 'Op de vloer hoor je het. Een goede MAG-boog knettert gelijkmatig, als spek in de pan.', en: 'On the floor you can hear it. A good MAG arc crackles steadily, like bacon frying.' } },
        { nl: 'Een ploppende boog met veel spatten wijst op verkeerde instellingen of te weinig gas.', en: 'A popping arc with a lot of spatter points to wrong settings or missing gas.', focus: ['torch'], points: ['t2.2'],
          say: { nl: 'Een ploppende boog met veel spatten wijst op verkeerde instellingen of te weinig gas. Spatten zijn rondvliegende metaaldruppels.', en: 'A popping arc with a lot of spatter points to wrong settings or missing gas. Spatter is drops of metal flying off.' } },
      ],
    },
    {
      id: 's3', lesson: L1, level: 1, still: 0.9, title: { nl: 'MIG/MAG', en: 'MIG/MAG' },
      beats: [
        { nl: 'Bij {t:MIG/MAG|MIG/MAG} gaat een draad van {n:0.8} tot {n:1.2} mm continu door de toorts: elektrode én toevoegmateriaal.', en: 'In {t:MIG/MAG|MIG/MAG} a wire of {n:0.8} to {n:1.2} mm runs continuously through the torch: electrode and filler.', cue: { 'MIG/MAG': 'torch' }, focus: ['wfs'], points: ['t3.1'],
          say: { nl: 'Dit is {t:MIG/MAG|MIG/MAG-lassen}. Een haspel levert een draad van {n:0.8} tot {n:1.2} millimeter dik, die continu door de toorts wordt geduwd. De draad is de elektrode én het toevoegmateriaal.', en: 'This is {t:MIG/MAG|MIG/MAG welding}. A reel supplies a wire of {n:0.8} to {n:1.2} millimetres thick, pushed continuously through the torch. The wire is both the electrode and the filler.' } },
        { nl: 'MAG (metal active gas) is voor staal: argon met {n:8} tot {n:20}% CO₂, vaak {n:82}% argon en {n:18}% CO₂.', en: 'MAG (metal active gas) is for steel: argon with {n:8} to {n:20}% CO₂, often {n:82}% argon and {n:18}% CO₂.', focus: ['gas'], points: ['t3.1'],
          say: { nl: 'MAG is voor staal. Het gas is argon met {n:8} tot {n:20} procent kooldioxide, vaak {n:82} procent argon en {n:18} procent kooldioxide.', en: 'MAG, metal active gas, is for steel. The gas is argon with {n:8} to {n:20} percent carbon dioxide, often {n:82} percent argon and {n:18} percent carbon dioxide.' } },
        { nl: 'Het CO₂ is actief: het reageert in de boog, zodat de las dieper en rustiger in het staal smelt.', en: 'The CO₂ is active: it reacts in the arc, so the weld melts in deeper and more steadily.', focus: ['torch'], points: ['t3.1'],
          say: { nl: 'Het kooldioxide is actief. Het reageert in de boog, zodat de las dieper en rustiger in het staal smelt.', en: 'The carbon dioxide is active. It reacts in the arc, so the weld melts in deeper and more steadily.' } },
        { nl: 'MIG (metal inert gas) gebruikt zuiver argon, dat nergens mee reageert, voor aluminium.', en: 'MIG (metal inert gas) uses pure argon, which reacts with nothing, for aluminium.', focus: ['gas'], points: ['t3.2'],
          say: { nl: 'MIG gebruikt zuiver argon, dat nergens mee reageert. Dat is voor aluminium.', en: 'MIG stands for metal inert gas. It uses pure argon, which reacts with nothing, for aluminium.' } },
        { nl: 'MIG/MAG is snel en goed te automatiseren: lasrobotcellen voor auto-onderdelen, frames en aanhangwagens.', en: 'MIG/MAG is fast and easy to automate: robot cells for car parts, frames and trailers.', focus: ['source'], points: ['t3.2'],
          say: { nl: 'MIG/MAG is snel en goed te automatiseren. Denk aan lasrobotcellen voor auto-onderdelen, frames en aanhangwagens.', en: 'MIG/MAG is fast and easy to automate. Think of robot cells for car parts, frames and trailers.' } },
      ],
    },
    {
      id: 's4', lesson: L1, level: 1, still: 0.9, title: { nl: 'TIG', en: 'TIG' },
      beats: [
        { nl: '{t:TIG|TIG}: een puntige wolfraamelektrode die niet smelt, want wolfraam smelt pas rond {n:3400} °C.', en: '{t:TIG|TIG}: a pointed tungsten electrode that stays solid, as tungsten only melts at about {n:3400} °C.', cue: { TIG: 'tig' }, focus: ['tig'], points: ['t4.1'],
          say: { nl: '{t:TIG|TIG-lassen} werkt anders. De elektrode is een punt van wolfraam, een metaal dat pas rond {n:3400} graden smelt en dus vast blijft.', en: '{t:TIG|TIG welding} works differently. The electrode is a point of tungsten, a metal that only melts at about {n:3400} degrees and so stays solid.' } },
        { nl: 'De lasser dipt een losse staaf in het smeltbad, onder zuiver argon, en regelt de warmte met een voetpedaal.', en: 'The welder dips a separate rod into the weld pool, under pure argon, and sets the heat with a foot pedal.', focus: ['tig'], points: ['t4.1'],
          say: { nl: 'De lasser dipt met de hand een losse lasstaaf in het smeltbad. Het gas is zuiver argon. De warmte regelt hij met een voetpedaal.', en: 'The welder dips a separate filler rod into the pool by hand. The gas is pure argon. He sets the heat with a foot pedal.' } },
        { nl: 'Het is vaak drie tot vijf keer langzamer, maar schoon en precies.', en: 'It is often three to five times slower, but clean and precise.', focus: ['tig'], points: ['t4.1'],
          say: { nl: 'Het is vaak drie tot vijf keer langzamer, maar schoon en precies.', en: 'It is often three to five times slower, but clean and precise.' } },
        { nl: 'Voor rvs-leidingen in voeding en farma, dunne plaat, aluminium en de grondlaag van een pijplas.', en: 'For stainless pipe in food and pharma, thin sheet, aluminium and the root pass of a pipe weld.', focus: ['tig'], points: ['t4.2'],
          say: { nl: 'TIG gebruik je voor rvs-leidingen, dat is roestvast staal, in voeding en farma. Ook voor dunne plaat, aluminium en de grondlaag. Dat is de eerste laag onderin een pijplas.', en: 'TIG is used for stainless steel pipe in food and pharma. Also for thin sheet, aluminium and the root pass. That is the first layer at the bottom of a pipe weld.' } },
        { nl: 'Een goede TIG-lasser is schaars en goed betaald.', en: 'A good TIG welder is scarce and well paid.', focus: null, points: ['t4.2'],
          say: { nl: 'Een goede TIG-lasser is schaars en goed betaald.', en: 'A good TIG welder is scarce and well paid.' } },
      ],
    },
    {
      id: 's5', lesson: L1, level: 1, still: 0.9, title: { nl: 'Warmte per millimeter', en: 'Heat per millimetre' },
      beats: [
        { nl: '{t:Booglasenergie|Booglasenergie} in kJ/mm: volt × ampère × 60 / (lassnelheid × 1.000).', en: '{t:Arc energy|Arc energy} in kJ/mm: volts × amps × 60 / (travel speed × 1,000).', cue: { Booglasenergie: 'card' }, focus: ['card'], points: ['t5.1'],
          say: { nl: 'De {t:Booglasenergie|booglasenergie} is de warmte per millimeter las, in kilojoule per millimeter. Je rekent haar uit als volt maal ampère maal {n:60}, gedeeld door de lassnelheid maal {n:1000}.', en: 'The {t:Arc energy|arc energy} is the heat put in per millimetre of weld, in kilojoules per millimetre. You work it out as volts times amps times {n:60}, divided by the travel speed times {n:1000}.' } },
        { nl: 'De lassnelheid is hoe snel de toorts langs de naad gaat, in mm per minuut.', en: 'Travel speed is how fast the torch moves along the joint, in mm per minute.', focus: ['travel'], points: ['t5.1'],
          say: { nl: 'De lassnelheid is hoe snel de toorts langs de naad gaat, in millimeter per minuut.', en: 'The travel speed is how fast the torch moves along the joint, in millimetres per minute.' } },
        { nl: 'De warmte-inbreng is booglasenergie maal het deel dat in het werkstuk komt: {n:0.8} voor MAG, {n:0.6} voor TIG.', en: 'Heat input is arc energy times the share that reaches the part: {n:0.8} for MAG, {n:0.6} for TIG.', focus: ['heat'], points: ['t5.1'],
          say: { nl: 'De warmte-inbreng is de booglasenergie maal het deel van de warmte dat echt in het werkstuk komt. Dat is {n:0.8} voor MAG en {n:0.6} voor TIG.', en: 'Heat input is the arc energy times the share of the heat that really reaches the part. That is {n:0.8} for MAG and {n:0.6} for TIG.' } },
        { nl: 'Te veel warmte laat het werkstuk kromtrekken en verbreedt de {t:WBZ|WBZ}, de warmtebeïnvloede zone.', en: 'Too much heat warps the part and widens the {t:HAZ|HAZ}, the heat-affected zone.', cue: { WBZ: 'haz' }, focus: ['haz'], points: ['t5.2'],
          say: { nl: 'Te veel warmte laat het werkstuk kromtrekken. Ook wordt de {t:WBZ|WBZ} breder, de warmtebeïnvloede zone. Dat is staal naast de las dat heet werd en verzwakte.', en: 'Too much heat warps the part. It also widens the {t:HAZ|HAZ}, the heat-affected zone. That is steel beside the weld that got hot and weakened.' } },
        { nl: 'Te weinig warmte, en de las smelt niet in.', en: 'Too little heat, and the weld does not melt in.', focus: ['pool'], points: ['t5.2'],
          say: { nl: 'Is er te weinig warmte, dan smelt de las niet in.', en: 'With too little heat, the weld does not melt in.' } },
      ],
    },
    {
      id: 's6', lesson: L1, level: 1, still: 0.9, title: { nl: 'Voorbeeld: een beugel', en: 'Example: a bracket' },
      beats: [
        { nl: 'Een robot last met MAG een beugel op {n:24} V, {n:220} A en {n:400} mm per minuut.', en: 'A robot MAG-welds a bracket at {n:24} V, {n:220} A and {n:400} mm per minute.', focus: ['panel'], points: ['ex.text.1'],
          say: { nl: 'Een robot last met MAG een beugel. Hij staat op {n:24} volt, {n:220} ampère en een lassnelheid van {n:400} millimeter per minuut.', en: 'A robot MAG-welds a bracket. It runs at {n:24} volts, {n:220} amps and a travel speed of {n:400} millimetres per minute.' } },
        { nl: 'De booglasenergie is {n:0.79} kJ per mm las.', en: 'The arc energy is {n:0.79} kJ per mm of weld.', focus: ['source'], points: ['ex.text.1'], read: { nl: '{n:24} × {n:220} × {n:60} / ({n:400} × {n:1000}) = {n:0.79} kJ/mm', en: '{n:24} × {n:220} × {n:60} / ({n:400} × {n:1000}) = {n:0.79} kJ/mm' },
          say: { nl: 'Dat geeft een booglasenergie van {n:0.79} kilojoule per millimeter.', en: 'That gives an arc energy of {n:0.79} kilojoules per millimetre.' } },
        { nl: 'Maal het MAG-rendement {n:0.8}: warmte-inbreng {n:0.63} kJ/mm, binnen de {n:0.5} tot {n:0.9} van de lasmethode.', en: 'Times the MAG efficiency {n:0.8}: heat input {n:0.63} kJ/mm, inside the {n:0.5} to {n:0.9} of the procedure.', focus: ['panel'], points: ['ex.text.1'], read: { nl: '{n:0.8} × {n:0.79} = {n:0.63} kJ/mm', en: '{n:0.8} × {n:0.79} = {n:0.63} kJ/mm' },
          say: { nl: 'Maal het MAG-rendement van {n:0.8} geeft dat een warmte-inbreng van {n:0.63} kilojoule per millimeter. Dat valt binnen de {n:0.5} tot {n:0.9} die de lasmethode toestaat. De lasmethode is het vastgelegde recept voor deze las.', en: 'Times the MAG efficiency of {n:0.8}, that gives a heat input of {n:0.63} kilojoules per millimetre. That is inside the {n:0.5} to {n:0.9} that the welding procedure allows. The procedure is the written recipe for this weld.' } },
      ],
    },
    {
      id: 's7', lesson: L1, level: 1, still: 0.9, title: { nl: 'Voorbeeld: te weinig gas', en: 'Example: too little gas' },
      beats: [
        { nl: 'Op dinsdag knikt de gasslang achter de robot: het debiet zakt van {n:15} naar {n:5} liter per minuut.', en: 'On Tuesday the gas hose kinks behind the robot: the flow drops from {n:15} to {n:5} litres a minute.', focus: ['flow'], points: ['ex.text.2'],
          say: { nl: 'Op dinsdag raakt de gasslang achter de robot geknikt. Het gasdebiet zakt van {n:15} naar {n:5} liter per minuut.', en: 'On Tuesday the gas hose gets kinked behind the robot. The gas flow drops from {n:15} to {n:5} litres a minute.' } },
        { nl: 'Binnen een uur zitten de lassen vol poriën, gasbelletjes.', en: 'Within an hour the welds are full of pores, gas bubbles.', focus: ['bead'], points: ['ex.text.2'],
          say: { nl: 'Binnen een uur zitten de lassen vol poriën. Dat zijn gasbelletjes.', en: 'Within an hour the welds are full of pores. Those are gas bubbles.' } },
        { nl: 'De oplossing: een gasdebietsensor stopt de robot onder de {n:10} liter per minuut.', en: 'The fix: a gas flow sensor stops the robot below {n:10} litres a minute.', focus: ['flow'], points: ['ex.text.3'],
          say: { nl: 'De oplossing is een gasdebietsensor. Die stopt de robot zodra het debiet onder de {n:10} liter per minuut zakt.', en: 'The fix is a gas flow sensor. It stops the robot as soon as the flow falls below {n:10} litres a minute.' } },
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

// ---------------------------------------------------------------- cameras (one move per scene; scene 1 is a tour, one framing per beat)
const CAM = [
  { keys: [cam([-14, -40, 44], 560), cam([-117, -123, 40], 270), cam([C.XE - 6, 0, 34], 250)], from: cam([-14, -40, 44], 560), to: cam([C.XE - 6, 0, 34], 250) },
  { from: cam([-30, -70, 60], 470), to: cam([70, -6, 24], 250, [190, 250]), a: 0.1, b: 0.5 },
  { from: cam([-62, -70, 46], 470), to: cam([40, -20, 36], 330, [190, 250]), a: 0, b: 0.6 },
  { from: cam([20, -6, 22], 230, [190, 250]), to: cam([8, -6, 22], 220, [190, 250]) },
  { from: cam([0, -40, 30], 600, [190, 250]), to: cam([-10, -6, 22], 300, [190, 250]), a: 0, b: 0.6 },
  { from: cam([-62, -70, 46], 470), to: cam([-70, -60, 40], 420) },
  { from: cam([-70, -40, 30], 420, [440, 200]), to: cam([-92, -6, 24], 300, [440, 200]) },
];

// ---------------------------------------------------------------- page
const world = worldOf({ tig: true });
const hud = [hudParts.flow, hudParts.card].join('');
const svg = svgOf(world, hud);
let script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een lastafel met twee stalen platen en een V-naad, een MAG-toorts, een TIG-toorts, een lasapparaat met draadhaspel en een gasfles; later een gasdebietmeter, en kaarten met de getallen.',
  en: 'A welding table with two steel plates and a V groove, a MAG torch, a TIG torch, a power source with a wire spool and a gas bottle; later a gas flow meter, and cards with the numbers.',
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

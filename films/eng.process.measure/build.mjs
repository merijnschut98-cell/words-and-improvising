// Dev tool, not shipped. Builds the explainer film "De lijn meten / Measuring
// the line" for Procestechniek: de basis: the level 1 lesson
// eng.process.variables (pressure, flow, level and temperature, and how each
// is measured). Its sister film eng.process.plant serves eng.process.types on
// the same juice line; the drawing and the shared stage live there
// (films/eng.process.plant/world.mjs and stage-common.js), this film's own
// scenes are in stage.js here.
//
//   node films/eng.process.measure/build.mjs            build the page
//   node films/eng.process.measure/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.process.measure.html. The lesson is
// Basis, so the film is a broad "how it works": the four variables on their
// instruments, pressure units and scales (gauge, absolute, vacuum), volume and
// mass flow, four kinds of flow meter and calibration, three ways to measure
// level and where each is fooled, the syrup level of the worked example, and
// temperature (1 °C = 1 K, Pt100 and thermocouple, the thermowell's lag).
// Since lessons with a film no longer show their worked example, the film
// carries every point of the teach text and of the example. Cards with
// invented content say "voorbeeld".
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';
import { svgOf, cam, stageScriptOf, css, kitCss, C as WORLD } from '../eng.process.plant/world.mjs';

// ---------------------------------------------------------------- the model
// The lesson's facts and worked example, asserted against its current text
// (the build fails if the lesson drifts); {n:...} numbers are then checked
// against the Dutch lesson text by defineFilm. Facts checked against:
// - Pressure: 1 bar = 100 kPa exactly (SI brochure, the bar is 10^5 Pa);
//   1 psi = 6,894757 kPa, so 1 bar ≈ 14,5 psi. Gauge pressure is measured
//   against the surrounding air, absolute against vacuum; at sea level the
//   atmosphere is about 1,013 bar, "about 1 bar". Vacuum reads below zero on
//   a gauge scale: -0,5 bar(g) is about 0,5 bar(a) (the film's example).
// - Flow meters (Endress+Hauser and Emerson application notes; Baker, Flow
//   Measurement Handbook): a magnetic meter needs a conductive liquid (about
//   5 µS/cm or more), so demineralised water and oils fail; a Coriolis meter
//   reads mass directly from the twist (phase shift) of a vibrating tube,
//   around 0,1 % of reading for liquids, and costs thousands of euros; a
//   vortex meter counts the vortices shed behind a bluff body, whose frequency
//   is proportional to speed; a differential-pressure meter reads the drop
//   over a restriction such as an orifice plate.
// - Level: a pressure sensor at the bottom reads p = ρ g h, the weight of the
//   column; a radar's pulse can reflect off foam; a float can stick in sticky
//   product.
// - Temperature: a kelvin is as large as a degree Celsius (0 °C = 273,15 K),
//   so 20 to 80 °C is 60 K, and 80 °C is about 353 K. A Pt100 is a platinum
//   resistor of 100 ohm at 0 °C (IEC 60751), class A about ±0,15 °C at
//   0 °C; a thermocouple is two different metals joined at the tip (IEC
//   60584), with a wider range and a larger tolerance (class 1 about
//   ±1,5 °C). A thermowell slows the response.
// - Hydrostatic level: p = ρ g h; a meter set for water reads p / (1.000 × g).
const VARS = 'eng.process.variables';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const inOrder = (text, words) => { let from = 0; return words.every((w) => { const at = text.indexOf(w, from); if (at < 0) return false; from = at + w.length; return true; }); };
{
  const v = lessons.nl.get(VARS);
  const vt = v.teach.join('\n');
  assert(inOrder(vt, ['druk, temperatuur, debiet en niveau', 'kracht per oppervlak, in bar (of kPa; psi op Amerikaanse apparatuur)', 'Overdruk', 'buitenlucht', 'absolute druk', 'vacuüm', 'zo’n 1 bar', 'Vacuüm zie je als negatieve overdruk of lage absolute druk', 'vraag dan welke']), 'variables: pressure');
  assert(inOrder(vt, ['volume per tijd (m³/h, liter per minuut) of massa per tijd (kg/h, ton per uur)', 'Massadebiet = volumedebiet × dichtheid', '1.000 kg/m³', '1 m³/h water is ongeveer 1.000 kg/h', 'siroop van 1.300 kg/m³ geeft 1.300 kg/h', 'Recepten en balansen rekenen in kilo’s', 'volume of massa']), 'variables: mass flow');
  assert(inOrder(vt, ['magnetisch-inductieve meter', 'stroom geleidt', 'zuiver water of olie', 'Coriolismeter laat een buis trillen', 'verdraaiing', 'direct massa', '0,1%', 'duizenden euro’s', 'Vortex- en drukverschilmeters', 'snelheid of drukverlies bij een vernauwing', 'laatste kalibratie', 'bekende referentie']), 'variables: flow meters');
  assert(inOrder(vt, ['druksensor onderin, een radar van bovenaf of een vlotter', 'gewicht van de vloeistofkolom', 'klopt de hoogte niet', 'massa die eruit volgt nog wel', 'Schuim kan een radar foppen', 'kleverig product laat een vlotter vastlopen', 'vraag dan op welk principe']), 'variables: level');
  assert(inOrder(vt, ['1 °C is gelijk aan 1 K', 'absolute nulpunt', 'mogen in °C', 'Pt100', 'platina weerstand', 'een paar tiende graad', 'thermokoppel', 'twee verschillende metalen', 'groter bereik, minder nauwkeurig', 'beschermhuls', 'minuten achter', 'reageert te laat']), 'variables: temperature');
  assert(v.terms.find((x) => x.term === 'Pt100').def.includes('100 ohm bij 0 °C'), 'variables: 100 ohm at 0 °C');
  assert(inOrder(v.pre[0].q + v.pre[0].why, ['2 bar', 'zo’n 1 bar', 'ongeveer 3 bar']), 'variables: 2 bar(g) is about 3 bar(a)');
  assert(inOrder(v.recall[3].q + v.recall[3].why, ['20 °C naar 80 °C', '60 K', '353 K']), 'variables: 20 to 80 °C is 60 K');
  assert(inOrder(v.example.text, ['ingesteld op water (1.000 kg/m³)', 'siroop van 1.250 kg/m³ in, echt 2,0 m hoog', '9,81', '24.525 Pa', '2,5 m', 'hoog-niveaualarm kan te vroeg afgaan', 'voller dan hij is', 'De massa die de meter aangeeft klopt wel', 'rechte, verticale wanden', 'de juiste dichtheid invoeren, of de tank in kg aflezen']), 'variables: the syrup example');
  assert(v.said.includes('halve meter te hoog'), 'variables: half a metre too high');
}
// pressure: gauge 2 bar at sea level is about 3 bar absolute; 1 bar in kPa and psi
assert(2 + 1 === 3, 'absolute = gauge + about 1 bar');
assert(near(100 / 6.894757, 14.5, 0.01), '1 bar = 100 kPa ≈ 14,5 psi');
assert(-0.5 + 1 === 0.5, 'vacuum: -0,5 bar(g) is about 0,5 bar(a)');
// mass flow: 1 m³/h of water of 1.000 kg/m³ is 1.000 kg/h; of syrup of 1.300 kg/m³ 1.300 kg/h
assert(1 * 1000 === 1000 && 1 * 1300 === 1300, 'mass flow = volume flow × density');
// temperature: a difference in °C is the same in K
assert(80 - 20 === 60 && Math.round(80 + 273.15) === 353, '20 to 80 °C is 60 K; 80 °C is about 353 K');
// the syrup level
const PB = 1250 * 9.81 * 2.0;
assert(near(PB, 24525, 1e-6), '1.250 × 9,81 × 2,0 = 24.525 Pa');
const HSHOW = PB / (1000 * 9.81);
assert(near(HSHOW, 2.5, 1e-9) && near(HSHOW - 2.0, 0.5, 1e-9), 'the meter shows 2,5 m, half a metre too high');

// ---------------------------------------------------------------- cameras (one move per scene)
const SCENES = ['four', 'gauge', 'flow', 'meters', 'level', 'syrup', 'temp'];
const HUDS = ['tags', 'units', 'pres', 'flow', 'meters', 'cal', 'lvlm', 'lvl', 'temp', 'sens', 'lag'];
const VAT = WORLD.VAT;
const CAM = [
  { from: cam([-50, 0, 84], 440, 290, 190), to: cam([-50, 0, 80], 410, 290, 190) },
  { from: cam([-30, 0, 66], 210, 470), to: cam([-30, 0, 66], 180, 470) },
  { from: cam([-56, 0, 52], 230, 470), to: cam([-56, 0, 52], 200, 470) },
  { from: cam([-56, 0, 52], 220, 490), to: cam([-56, 0, 50], 190, 490) },
  { from: cam([VAT.c[0], 0, 90], 300, 480), to: cam([VAT.c[0], 0, 86], 270, 480) },
  { from: cam([VAT.c[0], 0, 90], 300, 470), to: cam([VAT.c[0], 0, 86], 270, 470) },
  { from: cam([70, 12, 46], 210, 470), to: cam([70, 12, 44], 180, 470) },
];

// ---------------------------------------------------------------- the film
const DUR = [26, 42, 36, 46, 38, 42, 46];
const spec = {
  id: 'eng.process.measure',
  title: { nl: 'De lijn meten', en: 'Measuring the line' },
  lessons: [VARS],
  scenes: [
    {
      id: 's1', lesson: VARS, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Vier grootheden', en: 'Four variables' },
      beats: [
        { nl: 'Vier grootheden sturen de lijn: druk, temperatuur, debiet en niveau.', en: 'Four variables run the line: pressure, temperature, flow and level.', cues: ['tags', 'gauge', 'tt', 'ft', 'lt'] },
        { nl: 'Druk is kracht per oppervlak: in bar of kPa, op Amerikaanse apparatuur in psi.', en: 'Pressure is force per area: in bar or kPa, on American equipment in psi.', cues: ['units', 'gauge'] },
      ],
    },
    {
      id: 's2', lesson: VARS, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Welke druk?', en: 'Which pressure?' },
      beats: [
        { nl: 'De manometer toont {t:Overdruk|overdruk}: ten opzichte van de buitenlucht, in bar(g).', en: 'The gauge shows {t:Gauge pressure|gauge pressure}: relative to the air around, in bar(g).', cue: { Overdruk: 'gauge' }, cues: ['pres'] },
        { nl: '{t:Absolute druk|Absolute druk} telt vanaf vacuüm: {n:2} bar(g) is ongeveer {n:3} bar(a).', en: '{t:Absolute pressure|Absolute pressure} counts from vacuum: {n:2} bar(g) is about {n:3} bar(a).', cue: { 'Absolute druk': 'pres' } },
        { nl: 'Vacuüm zie je als negatieve overdruk, of als lage absolute druk. Vraag altijd welke.', en: 'Vacuum shows as negative gauge pressure, or as low absolute pressure. Always ask which.', cues: ['pres'] },
      ],
    },
    {
      id: 's3', lesson: VARS, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Volume of massa', en: 'Volume or mass' },
      beats: [
        { nl: 'Debiet is volume per tijd, zoals m³/h, of massa per tijd, zoals kg/h.', en: 'Flow is volume per time, such as m³/h, or mass per time, such as kg/h.', cues: ['flow', 'ft'] },
        { nl: '{t:Massadebiet|Massadebiet} = volumedebiet × dichtheid, de massa van één kubieke meter.', en: '{t:Mass flow|Mass flow} = volume flow × density, the mass of one cubic metre.', cue: { Massadebiet: 'flow' } },
        { nl: 'Water: 1 m³/h is ongeveer {n:1000} kg/h. Siroop van {n:1300} kg/m³: {n:1300} kg/h.', en: 'Water: 1 m³/h is about {n:1000} kg/h. Syrup of {n:1300} kg/m³: {n:1300} kg/h.', cues: ['flow'] },
        { nl: 'Recepten rekenen in kilo’s: vraag wat een meter echt toont, volume of massa.', en: 'Recipes work in kilograms: ask what a meter really shows, volume or mass.', cues: ['flow'] },
      ],
    },
    {
      id: 's4', lesson: VARS, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Debietmeters', en: 'Flow meters' },
      beats: [
        { nl: 'Magnetisch-inductief: meet de snelheid van een geleidende vloeistof. Faalt op zuiver water of olie.', en: 'Magnetic: measures the speed of a conductive liquid. Fails on very pure water or oil.', cues: ['meters'] },
        { nl: 'Een {t:Coriolismeter|Coriolismeter} laat een buis trillen en meet direct massa, op zo’n {n:0.1}%.', en: 'A {t:Coriolis meter|Coriolis meter} vibrates a tube and measures mass directly, to about {n:0.1}%.', cue: { Coriolismeter: 'ft' }, cues: ['meters'] },
        { nl: 'Vortex- en drukverschilmeters lezen de snelheid, of het drukverlies bij een vernauwing.', en: 'Vortex and differential-pressure meters read the speed, or the pressure drop at a restriction.', cues: ['meters'] },
        { nl: 'Een meter is zo goed als zijn laatste kalibratie: de controle tegen een bekende referentie.', en: 'A meter is only as good as its last calibration: the check against a known reference.', cues: ['cal', 'meters'] },
      ],
    },
    {
      id: 's5', lesson: VARS, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Niveau meten', en: 'Measuring level' },
      beats: [
        { nl: 'Niveau meet je met een druksensor onderin, een radar van bovenaf of een vlotter.', en: 'You measure level with a pressure sensor at the bottom, a radar from above or a float.', cues: ['lvlm', 'lt'] },
        { nl: 'De druksensor weegt eigenlijk de vloeistofkolom erboven.', en: 'The pressure sensor really weighs the column of liquid above it.', cues: ['lvlm', 'lt'] },
        { nl: 'Schuim kan een radar foppen, en kleverig product laat een vlotter vastlopen.', en: 'Foam can fool a radar, and sticky product can jam a float.', cues: ['lvlm'] },
      ],
    },
    {
      id: 's6', lesson: VARS, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'Een meter die op water staat', en: 'A meter set for water' },
      beats: [
        { nl: 'De niveaumeter van het vat meet de druk onderin, ingesteld op water: {n:1000} kg/m³.', en: 'The vat’s level meter measures the pressure at the bottom, set up for water: {n:1000} kg/m³.', cues: ['lt'] },
        { nl: 'Siroop van {n:1250} kg/m³, echt {n:2.0} m hoog: onderin {n:24525} Pa.', en: 'Syrup of {n:1250} kg/m³, really {n:2.0} m deep: {n:24525} Pa at the bottom.', cues: ['lvl', 'lt'] },
        { nl: 'De meter deelt door de dichtheid van water en toont {n:2.5} m: een halve meter te hoog.', en: 'The meter divides by the density of water and shows {n:2.5} m: half a metre too high.', cues: ['lvl'] },
        { nl: 'De massa klopt wel. Voer de juiste dichtheid in, of lees de tank af in kilo’s.', en: 'The mass is still right. Enter the right density, or read the tank in kilograms.', cues: ['lvl'] },
      ],
    },
    {
      id: 's7', lesson: VARS, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'Temperatuur', en: 'Temperature' },
      beats: [
        { nl: 'Een verschil van 1 °C is 1 K: van {n:20} naar {n:80} °C is {n:60} K erbij.', en: 'A difference of 1 °C is 1 K: from {n:20} to {n:80} °C adds {n:60} K.', cues: ['temp'] },
        { nl: 'Meestal meet een {t:Pt100|Pt100}: een platina weerstand, op een paar tiende graad nauwkeurig.', en: 'Usually a {t:Pt100|Pt100} measures: a platinum resistor, accurate to a few tenths of a degree.', cue: { Pt100: 'tt' }, cues: ['sens'] },
        { nl: 'Of een thermokoppel: twee metalen aan elkaar. Groter bereik, minder nauwkeurig.', en: 'Or a thermocouple: two metals joined. Wider range, less accurate.', cues: ['sens'] },
        { nl: 'De sensor zit in een beschermhuls. Bij weinig stroming loopt hij minuten achter.', en: 'The sensor sits in a thermowell. In a slow flow it lags by minutes.', cues: ['lag', 'tt'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text
// and its worked example, so this explains fully. No "/", "&", "×", "=" or
// units as symbols in the spoken text: units are written out (bar(g) and
// bar(a) are read "bar g" and "bar a" in Dutch; the English voice reads
// bar(a) as "bar uh" and psi as "sigh", so the English script says bar gauge,
// bar absolute and pounds per square inch). Words checked with espeak-ng phonemes
// (Piper's own bridge, films/_kit/voice-ab/phon.py with nl_NL-alex-medium):
// psi (read as one hiss), thermokoppel (stressed kopPEL) and
// magnetisch-inductieve (stressed IN-) get Dutch spoken forms in
// films/_kit/timeline.mjs (SAY), with Coriolis and ohm from the plant film.
// kilopascal, vortexmeter, drukverschilmeter, kalibratie, kelvin, Celsius,
// radar, vlotter, Pt100 ("pee tee honderd"), massadebiet, overdruk and
// absolute are read right. 9,81 is left to the card (read "negen komma acht
// een").
const SAY = [
  [ // s1 four variables, pressure units
    { nl: 'Om een proceslijn te sturen, meet je vooral vier grootheden: druk, temperatuur, debiet en niveau. Op deze lijn zit voor elk een meter.',
      en: 'To run a process line, you mainly measure four variables: pressure, temperature, flow and level. On this line there is a meter for each.' },
    { nl: 'Druk is kracht per oppervlak. Je meet hem in bar, of in kilopascal: 1 bar is 100 kilopascal. Op Amerikaanse apparatuur staat vaak psi, en 1 bar is ongeveer 14,5 psi.',
      en: 'Pressure is force per area. You measure it in bar, or in kilopascals: 1 bar is 100 kilopascals. American equipment often shows pounds per square inch, and 1 bar is about 14.5 of those.' },
  ],
  [ // s2 gauge, absolute, vacuum
    { nl: 'Na de pomp zit een manometer. Zoals bijna alle manometers toont hij {t:Overdruk|overdruk}: de druk ten opzichte van de buitenlucht. Je schrijft dat als bar(g).',
      en: 'After the pump sits a pressure gauge. Like almost every gauge, it shows {t:Gauge pressure|gauge pressure}: the pressure relative to the air around it. You write that as bar gauge.' },
    { nl: 'De {t:Absolute druk|absolute druk} telt vanaf volledig vacuüm, in bar(a). Op zeeniveau drukt de lucht zelf al zo’n {n:1} bar. Wijst de manometer {n:2} bar aan, dan is de absolute druk dus ongeveer {n:3} bar.',
      en: 'The {t:Absolute pressure|absolute pressure} counts from a perfect vacuum, in bar absolute. At sea level the air itself presses about {n:1} bar. So if the gauge reads {n:2} bar, the absolute pressure is about {n:3} bar.' },
    { nl: 'Vacuüm zie je dus op twee manieren: als negatieve overdruk, of als lage absolute druk. Een halve bar onder de buitenlucht is min een halve bar(g), of een halve bar(a). Noemt iemand een druk, vraag dan welke.',
      en: 'So vacuum shows up in two ways: as negative gauge pressure, or as low absolute pressure. Half a bar below the outside air is minus half a bar gauge, or half a bar absolute. When someone quotes a pressure, ask which one.' },
  ],
  [ // s3 volume or mass
    { nl: 'Dan het debiet. Dat is volume per tijd, zoals kubieke meter per uur of liter per minuut. Of massa per tijd, zoals kilo of ton per uur.',
      en: 'Then flow. That is volume per time, such as cubic metres per hour or litres per minute. Or mass per time, such as kilograms or tonnes per hour.' },
    { nl: 'Het {t:Massadebiet|massadebiet} is het volumedebiet maal de dichtheid: de massa van één kubieke meter.',
      en: 'The {t:Mass flow|mass flow} is the volume flow times the density: the mass of one cubic metre.' },
    { nl: 'Water weegt zo’n {n:1000} kilo per kubieke meter, dus één kubieke meter water per uur is ongeveer {n:1000} kilo per uur. Een siroop van {n:1300} kilo per kubieke meter geeft {n:1300} kilo per uur.',
      en: 'Water weighs about {n:1000} kilograms per cubic metre, so one cubic metre of water per hour is about {n:1000} kilograms per hour. A syrup of {n:1300} kilograms per cubic metre gives {n:1300} kilograms per hour.' },
    { nl: 'Recepten en balansen rekenen in kilo’s. Vraag dus altijd wat een meter echt toont: volume of massa.',
      en: 'Recipes and balances work in kilograms. So always ask what a meter really shows: volume or mass.' },
  ],
  [ // s4 flow meters
    { nl: 'Er zijn veel soorten debietmeters. Een magnetisch-inductieve meter meet de snelheid van een vloeistof die stroom geleidt. Op heel zuiver water of op olie faalt hij dus.',
      en: 'There are many kinds of flow meter. A magnetic flow meter measures the speed of a liquid that conducts electricity. So on very pure water or on oil it fails.' },
    { nl: 'Deze meter in de leiding is een {t:Coriolismeter|Coriolismeter}. Hij laat een buis trillen en leest de verdraaiing die de stromende massa geeft. Zo meet hij direct massa, op zo’n {n:0.1} procent. Maar hij kost duizenden euro’s.',
      en: 'This meter in the pipe is a {t:Coriolis meter|Coriolis meter}. It vibrates a tube and reads the twist the flowing mass causes. So it measures mass directly, to about {n:0.1} percent. But it costs thousands of euros.' },
    { nl: 'Een vortexmeter telt de wervels achter een obstakel in de buis, en leest zo de snelheid. Een drukverschilmeter leest het drukverlies over een vernauwing.',
      en: 'A vortex meter counts the vortices behind an obstacle in the pipe, and so reads the speed. A differential-pressure meter reads the pressure drop across a restriction.' },
    { nl: 'En elke meter is zo goed als zijn laatste kalibratie: de controle tegen een bekende referentie.',
      en: 'And every meter is only as good as its last calibration: the check against a known reference.' },
  ],
  [ // s5 measuring level
    { nl: 'Dan het niveau. Dat meet je met een druksensor onderin het vat, zoals hier, met een radar die van bovenaf meet, of met een vlotter die op de vloeistof drijft.',
      en: 'Then level. You measure it with a pressure sensor at the bottom of the vat, as here, with a radar that measures from above, or with a float on the liquid.' },
    { nl: 'Een druksensor meet eigenlijk het gewicht van de vloeistofkolom erboven. Wijkt de dichtheid af van waar hij op is ingesteld, dan klopt de hoogte niet. De massa die eruit volgt, klopt nog wel.',
      en: 'A pressure sensor really measures the weight of the column of liquid above it. If the density differs from what it is set for, the height is wrong. The mass that follows from it is still right.' },
    { nl: 'Elk principe heeft een zwakke plek. Schuim kan een radar foppen, en kleverig product laat een vlotter vastlopen. Leest een niveau raar, vraag dan op welk principe de meter werkt.',
      en: 'Every principle has a weak spot. Foam can fool a radar, and sticky product can jam a float. If a level reads oddly, ask what principle the meter uses.' },
  ],
  [ // s6 the syrup level (the worked example)
    { nl: 'Een voorbeeld met de druksensor van dit vat. Hij is ingesteld op water, {n:1000} kilo per kubieke meter.',
      en: 'An example with this vat’s pressure sensor. It is set up for water, {n:1000} kilograms per cubic metre.' },
    { nl: 'Nu staat er siroop in, van {n:1250} kilo per kubieke meter, echt {n:2.0} meter hoog. De druk onderin is de dichtheid maal de zwaartekracht maal de hoogte: {n:24525} pascal.',
      en: 'Now it holds syrup of {n:1250} kilograms per cubic metre, really {n:2.0} metres deep. The pressure at the bottom is the density times gravity times the height: {n:24525} pascals.' },
    { nl: 'De meter deelt die druk door de dichtheid van water, en toont {n:2.5} meter. Een halve meter te hoog: het hoog-niveaualarm kan te vroeg afgaan, en de tank lijkt voller dan hij is.',
      en: 'The meter divides that pressure by the density of water, and shows {n:2.5} metres. Half a metre too high: the high-level alarm may trip early, and the tank looks fuller than it is.' },
    { nl: 'De massa die de meter aangeeft, klopt wel, bij een tank met rechte wanden. Voer dus de juiste dichtheid in, of lees de tank af in kilo’s.',
      en: 'The mass the meter implies is still right, in a tank with straight walls. So enter the right density, or read the tank in kilograms.' },
  ],
  [ // s7 temperature
    { nl: 'Tot slot de temperatuur. Een verschil van één graad Celsius is gelijk aan één kelvin, de schaal die bij het absolute nulpunt begint. Van {n:20} naar {n:80} graden is dus {n:60} kelvin erbij, en warmtesommen met verschillen mogen gewoon in graden Celsius.',
      en: 'Finally, temperature. A difference of one degree Celsius equals one kelvin, the scale that starts at absolute zero. So from {n:20} to {n:80} degrees adds {n:60} kelvin, and heat sums with differences may simply use degrees Celsius.' },
    { nl: 'Na de warmtewisselaar meet een {t:Pt100|Pt100} de temperatuur van het sap. Dat is een platina weerstand van 100 ohm bij 0 graden, bij gewone procestemperaturen nauwkeurig op een paar tiende graad.',
      en: 'After the heat exchanger a {t:Pt100|Pt100} measures the temperature of the juice. It is a platinum resistor of 100 ohms at 0 degrees, accurate to a few tenths of a degree at ordinary process temperatures.' },
    { nl: 'De andere veelgebruikte sensor is een thermokoppel: twee verschillende metalen die aan het uiteinde aan elkaar zitten. Dat heeft een groter bereik, maar is minder nauwkeurig.',
      en: 'The other common sensor is a thermocouple: two different metals joined at the tip. It has a wider range, but is less accurate.' },
    { nl: 'De sensor zit in een beschermhuls in de leiding. Bij weinig stroming loopt hij daardoor minuten achter, en reageert de regeling te laat.',
      en: 'The sensor sits in a thermowell in the pipe. In a slow flow it can lag by minutes, and the control reacts too late.' },
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

const label = {
  nl: 'Dezelfde kleine sapfabriek: een mengvat met onderin een niveaumeter op druk, een pomp, een Coriolismeter, een manometer, een platenwarmtewisselaar met regelklep, een Pt100 in een beschermhuls, een heethoudbuis, een koeler en een vulmachine. Kaarten tonen de vier grootheden bij hun meters, de drukeenheden, overdruk, absolute druk en vacuüm op twee schalen, volume- en massadebiet, vier soorten debietmeters, kalibratie, drie manieren om niveau te meten en waar ze falen, de som van het siroopniveau, graden Celsius naast kelvin, een Pt100 en een thermokoppel, en een sensor die achterloopt.',
  en: 'The same small juice plant: a mixing vat with a pressure-type level meter at the bottom, a pump, a Coriolis meter, a pressure gauge, a plate heat exchanger with a control valve, a Pt100 in a thermowell, a holding tube, a cooler and a filler. Cards show the four variables at their meters, the pressure units, gauge pressure, absolute pressure and vacuum on two scales, volume and mass flow, four kinds of flow meter, calibration, three ways to measure level and where they fail, the syrup level sum, degrees Celsius beside kelvin, a Pt100 and a thermocouple, and a sensor that lags.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

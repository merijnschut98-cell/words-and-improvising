// Dev tool, not shipped. Builds the lesson film "Een G-code-programma lezen / Reading a G-code program" for the
// lesson eng.machining.gcode (level 2 of the CNC topic of Verspanen). Task 17, pilot P1: one of the four films the
// old film "Een CNC-programma loopt" was split into; the machine, its drawing and the stage library are those of
// films/eng.machining.cnc (room.mjs, stage-lib.js), imported, not copied.
//
//   node films/eng.machining.gcode/build.mjs            build the page
//   node films/eng.machining.gcode/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.gcode.html. The film carries every point of the lesson (points:
// on the beats): the blocks and words, modal and absolute codes, the motion and M codes, how a setter reads a new
// program, and the slot program of the worked example with its one improvement.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { world, hudParts, P, W, H, C, g, cam, css, stageScriptOf, beatTimes, k } from '../eng.machining.cnc/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.machining.gcode';
const L2 = 'eng.machining.gcode';

const spec = {
  id: ID,
  title: { nl: 'Een G-code-programma lezen', en: 'Reading a G-code program' },
  lessons: [L2],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6'], stageFns: ['dimX', 'rapidSection', 'dtgSvg', 'fixCard', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L2, level: 2, still: 0.9, title: { nl: 'Regel voor regel', en: 'Line by line' },
      beats: [
        { nl: 'Een nieuw programma ligt klaar: de insteller leest het eerst.', en: 'A new program is ready: the setter reads it first.', focus: ['prog'],
          say: { nl: 'Een nieuw programma ligt klaar voor het bewerkingscentrum. De insteller leest het eerst, voordat de machine het ziet.', en: 'A new program is ready for the machining centre. The setter reads it first, before the machine sees it.' } },
        { nl: 'Elke regel heet een {t:Programmaregel|programmaregel}: de besturing leest ze van boven naar beneden.', en: 'Each line is a {t:Block|block}: the control reads them from top to bottom.', cue: { Programmaregel: 'line' }, focus: ['line'], points: ['t1.1'],
          say: { nl: 'Een programma is een lijst regels. Elke regel heet een {t:Programmaregel|programmaregel}. De besturing leest ze van boven naar beneden, één regel tegelijk.', en: 'A program is a list of lines. Each line is called a {t:Block|block}. The control reads them from top to bottom, one block at a time.' } },
        { nl: 'Een regel begint met een regelnummer als N10 en bevat een paar woorden: een letter plus een getal.', en: 'A block starts with a line number like N10 and holds a few words: a letter plus a number.', focus: ['line'], points: ['t1.1'],
          say: { nl: 'Een regel begint met een regelnummer, zoals N10 of N20. Dan volgen een paar woorden. Een woord is een letter plus een getal.', en: 'A block starts with a line number, such as N10 or N20. Then follow a few words. A word is a letter plus a number.' } },
        { nl: 'G-woorden zeggen hoe er bewogen wordt, X, Y en Z waarheen.', en: 'G words say how to move, X, Y and Z say where to.', focus: ['prog'], points: ['t1.2'],
          say: { nl: 'G-woorden zeggen hoe er bewogen wordt. X, Y en Z zeggen waarheen.', en: 'G words say how to move. X, Y and Z say where to.' } },
        { nl: 'F is de voeding in mm/min, S het toerental in omw/min, T het gereedschapsnummer.', en: 'F is the feed in mm/min, S the spindle speed in rpm, T the tool number.', focus: ['prog'], points: ['t1.2'],
          say: { nl: 'F is de voeding, op een freesmachine in millimeter per minuut. S is het toerental in omwentelingen per minuut. T is het gereedschapsnummer.', en: 'F is the feed, on a mill in millimetres per minute. S is the spindle speed in revolutions per minute. T is the tool number.' } },
      ],
    },
    {
      id: 's2', lesson: L2, level: 2, still: 0.9, title: { nl: 'Modaal en absoluut', en: 'Modal and absolute' },
      beats: [
        { nl: 'De meeste codes zijn {t:Modaal|modaal}: actief tot een andere code uit dezelfde groep ze vervangt.', en: 'Most codes are {t:Modal|modal}: active until another code of the same group replaces them.', cue: { Modaal: 'modal' }, focus: ['modal'], points: ['t2.1'],
          say: { nl: 'De meeste codes zijn {t:Modaal|modaal}. Ze blijven actief tot een andere code uit dezelfde groep ze vervangt.', en: 'Most codes are {t:Modal|modal}. They stay active until another code of the same group replaces them.' } },
        { nl: 'Schrijf één keer G01: elke regel met alleen coördinaten is dan ook een rechte snede, met dezelfde F.', en: 'Write G01 once and every line with only coordinates is also a straight cut at the same F.', focus: ['modal'], points: ['t2.1'],
          say: { nl: 'Schrijf je één keer G01, dan is elke volgende regel met alleen coördinaten ook een rechte snede. Met dezelfde F.', en: 'Write G01 once, and every following line with only coordinates is also a straight cut. At the same F.' } },
        { nl: 'Dat houdt programma’s kort, maar je moet terug omhoog lezen om te weten wat een regel doet.', en: 'That keeps programs short, but you must read upwards to know what a line does.', focus: ['prog'], points: ['t2.1'],
          say: { nl: 'Dat houdt programma’s kort. Maar je moet terug omhoog lezen om te weten wat een regel doet.', en: 'That keeps programs short. But you must read upwards to know what a line does.' } },
        { nl: 'G90 zet {t:Absoluut programmeren|absoluut programmeren} aan: X{n:20} is {n:20} mm vanaf het nulpunt G54.', en: 'G90 switches on {t:Absolute programming|absolute programming}: X{n:20} is {n:20} mm from the zero point G54.', cue: { 'Absoluut programmeren': 'abs' }, focus: ['abs'], points: ['t2.2'],
          say: { nl: 'G90 zet {t:Absoluut programmeren|absoluut programmeren} aan. X20 betekent dan {n:20} millimeter vanaf het nulpunt, G54.', en: 'G90 switches on {t:Absolute programming|absolute programming}. X20 then means {n:20} mm from the zero point, G54.' } },
        { nl: 'G91 zet {t:Incrementeel programmeren|incrementeel programmeren} aan: X{n:20} is {n:20} mm verder dan nu.', en: 'G91 switches on {t:Incremental programming|incremental programming}: X{n:20} is {n:20} mm further than now.', cue: { 'Incrementeel programmeren': 'inc' }, focus: ['inc'], points: ['t2.2'],
          say: { nl: 'G91 zet {t:Incrementeel programmeren|incrementeel programmeren} aan. X20 betekent dan {n:20} millimeter verder dan waar het gereedschap nu is. Die twee verwarren is een klassieke crash.', en: 'G91 switches on {t:Incremental programming|incremental programming}. X20 then means {n:20} mm further than where the tool is now. Mixing them up is a classic crash.' } },
      ],
    },
    {
      id: 's3', lesson: L2, level: 2, still: 0.9, title: { nl: 'Bewegen en schakelen', en: 'Moving and switching' },
      beats: [
        { nl: 'G00 is een ijlgang: zo snel als de machine kan en nooit in het materiaal.', en: 'G00 is a rapid move: as fast as the machine can go and never in the material.', focus: ['prog'], points: ['t3.1'],
          say: { nl: 'Dan de bewegingscodes. G00 is een ijlgang, zo snel als de machine kan en nooit in het materiaal.', en: 'Now the motion codes. G00 is a rapid move, as fast as the machine can go and never in the material.' } },
        { nl: 'G01 is een rechte snede op voeding F. G02 is een boog met de klok mee, G03 tegen de klok in, met R de straal.', en: 'G01 is a straight cut at feed F. G02 is an arc clockwise, G03 anticlockwise, with R the radius.', focus: ['prog'], points: ['t3.1'],
          say: { nl: 'G01 is een rechte snede op voeding F. G02 is een cirkelboog met de klok mee en G03 tegen de klok in. R is de straal.', en: 'G01 is a straight cut at feed F. G02 is an arc clockwise and G03 anticlockwise. R is the radius.' } },
        { nl: 'Een {t:M-functie|M-functie} is een schakelaar: M03 spil aan, M05 spil stop, M06 gereedschapswissel.', en: 'An {t:M-code|M-code} is a machine switch: M03 spindle on, M05 spindle stop, M06 tool change.', cue: { 'M-functie': 'mcode' }, focus: ['mcode'], points: ['t3.2'],
          say: { nl: 'Een {t:M-functie|M-functie} is een schakelaar van de machine. M03 zet de spil aan, met de klok mee. M05 is spil stop en M06 is gereedschapswissel.', en: 'An {t:M-code|M-code} is a machine switch. M03 turns the spindle on, clockwise. M05 is spindle stop and M06 is tool change.' } },
        { nl: 'M08 koeling aan, M09 koeling uit, M30 einde programma.', en: 'M08 coolant on, M09 coolant off, M30 end of program.', focus: ['mcode'], points: ['t3.2'],
          say: { nl: 'M08 zet de koeling aan en M09 zet de koeling uit. M30 is het einde van het programma.', en: 'M08 switches the coolant on and M09 switches it off. M30 is the end of the program.' } },
        { nl: 'Elke besturing heeft extra’s, maar deze basis volgt ISO 6983 en is bijna overal gelijk.', en: 'Every control has extras, but these basics follow ISO 6983 and are almost the same everywhere.', focus: ['prog'], points: ['t3.2'],
          say: { nl: 'Elke besturing heeft extra’s. Maar deze basis volgt ISO 6983 en is bijna overal gelijk.', en: 'Every control has extras. But these basics follow ISO 6983 and are almost the same everywhere.' } },
      ],
    },
    {
      id: 's4', lesson: L2, level: 2, still: 0.9, title: { nl: 'Zo leest een insteller', en: 'How a setter reads' },
      beats: [
        { nl: 'Eerst de kop: welk nulpunt, welke gereedschappen, welke toerentallen.', en: 'First the top: which work offset, which tools, which speeds.', focus: ['prog'], points: ['t4.1'],
          say: { nl: 'Zo leest een insteller een nieuw programma. Eerst de kop, met het nulpunt, de gereedschappen en de toerentallen.', en: 'This is how a setter reads a new program. First the top, with the work offset, the tools and the speeds.' } },
        { nl: 'Dan de eerste bewegingen van elk gereedschap: waar staat het gereedschap nu, en waar gaat het heen?', en: 'Then the first moves of each tool: where is the tool now, and where will it go?', focus: ['prog'], points: ['t4.1'],
          say: { nl: 'Dan de eerste bewegingen van elk gereedschap. Steeds met dezelfde vraag. Waar staat het gereedschap nu, en waar gaat het heen?', en: 'Then the first moves of each tool. Always with the same question. Where is the tool now, and where will it go?' } },
        { nl: 'De gevaarlijke regels zijn ijlgangen vlak bij het werkstuk: G00 naar Z2 is prima, naar Z-3 het materiaal in.', en: 'The dangerous lines are rapids near the part: a G00 to Z2 is fine, to Z-3 it goes into the material.', focus: ['section', 'crash'], points: ['t4.2'],
          say: { nl: 'De gevaarlijke regels zijn ijlgangen vlak bij het werkstuk. Een G00 naar Z2, {n:2} millimeter boven het werkstuk, is prima. Een G00 naar Z min 3 gaat op volle snelheid het materiaal in.', en: 'The dangerous lines are rapid moves near the part. A G00 to Z2, {n:2} mm above the part, is fine. A G00 to Z minus 3 goes into the material at full speed.' } },
        { nl: 'Daarom let de insteller bij de eerste run op de restweg (distance-to-go).', en: 'That is why the setter watches the distance-to-go on the first run.', focus: ['counter'], points: ['t4.2'],
          say: { nl: 'Daarom kijkt de insteller bij de eerste run naar de restweg. Dat is hoe ver de huidige beweging nog moet.', en: 'That is why the setter watches the distance-to-go on the screen during the first run. That is the distance left in the current move.' } },
      ],
    },
    {
      id: 's5', lesson: L2, level: 2, still: 0.9, title: { nl: 'De sleuf', en: 'The slot' },
      beats: [
        { nl: 'Een sleuf in een stalen plaat, {n:3} mm diep, met een vingerfrees van {n:10} mm: gereedschap 3.', en: 'A slot in a steel plate, {n:3} mm deep, with a {n:10} mm end mill: tool 3.', focus: ['prog'], points: ['ex.text.1'],
          say: { nl: 'Het voorbeeld is een sleuf in een stalen plaat, {n:3} millimeter diep. Hij wordt gefreesd met een vingerfrees van {n:10} millimeter, gereedschap 3. Dit is het programma.', en: 'The example is a slot in a steel plate, {n:3} mm deep. It is cut with a {n:10} mm end mill, tool 3. This is the program.' } },
        { nl: 'N10 en N20: absoluut vanaf het nulpunt G54, gereedschap 3 erin.', en: 'N10 and N20: absolute from the zero point G54, tool 3 in.', focus: ['prog'], points: ['ex.text.2', 'ex.text.3'],
          say: { nl: 'N10 zet absoluut aan, vanaf nulpunt G54. N20 haalt gereedschap 3 erin.', en: 'N10 is absolute, from zero point G54. N20 puts tool 3 in.' } },
        { nl: 'N30: {n:3200} omw/min, met de klok mee. N40: ijlgang naar {n:25} mm boven het werkstuk.', en: 'N30: {n:3200} rpm, clockwise. N40: rapid to {n:25} mm above the part.', focus: ['prog'], points: ['ex.text.2', 'ex.text.3'],
          say: { nl: 'N30 geeft {n:3200} omwentelingen per minuut, met de klok mee. N40 gaat in ijlgang naar {n:25} millimeter boven het werkstuk. De gereedschapslengte staat aan, maar die code legt het volgende niveau uit. De koeling gaat aan.', en: 'N30 gives {n:3200} revolutions per minute, clockwise. N40 goes in rapid to {n:25} mm above the part. The tool length is switched on, but the next level explains that code. The coolant goes on.' } },
        { nl: 'N50: ijlgang boven het startpunt. N60: op voeding naar {n:3} mm diep, {n:150} mm/min.', en: 'N50: rapid above the start. N60: feed down to {n:3} mm deep at {n:150} mm/min.', focus: ['prog'], points: ['ex.text.2', 'ex.text.3'],
          say: { nl: 'N50 is een ijlgang boven het startpunt. N60 gaat op voeding naar {n:3} millimeter diep, met {n:150} millimeter per minuut.', en: 'N50 is a rapid above the start. N60 feeds down to {n:3} mm deep, at {n:150} mm/min.' } },
        { nl: 'N70: nog steeds G01, een rechte snede van {n:50} mm op {n:640} mm/min.', en: 'N70: still G01, a straight cut of {n:50} mm at {n:640} mm/min.', focus: ['modal'], points: ['ex.text.2', 'ex.text.3'],
          read: { nl: '{n:0.05} × 4 × {n:3200} = {n:640}', en: '{n:0.05} × 4 × {n:3200} = {n:640}' },
          say: { nl: 'N70 is nog steeds G01, een rechte snede van {n:50} millimeter, van Y min 10 naar Y40. Op {n:640} millimeter per minuut. Dat komt uit {n:0.05} millimeter per tand, maal 4 tanden, maal {n:3200} omwentelingen per minuut. Dat is een aanname.', en: 'N70 is still G01, a straight cut of {n:50} mm, from Y minus 10 to Y40. At {n:640} mm per minute. That comes from {n:0.05} mm per tooth, times 4 teeth, times {n:3200} revolutions per minute. That is an assumption.' } },
        { nl: 'N80: een kwart cirkel, straal {n:20} mm. N90: omhoog, koeling uit. N100: einde.', en: 'N80: a quarter circle, radius {n:20} mm. N90: up, coolant off. N100: end.', focus: ['prog'], points: ['ex.text.2', 'ex.text.3'],
          say: { nl: 'N80 is een kwart cirkel met straal {n:20} millimeter, met de klok mee. N90 gaat omhoog en zet de koeling uit. N100 is het einde.', en: 'N80 is a quarter circle of radius {n:20} mm, clockwise. N90 goes up and switches the coolant off. N100 is the end.' } },
      ],
    },
    {
      id: 's6', lesson: L2, level: 2, still: 0.9, title: { nl: 'Een verbeterpunt', en: 'One thing to fix' },
      beats: [
        { nl: 'Eén verbeterpunt: N60 gaat {n:28} mm op voeding, van Z25 naar Z-3, op {n:150} mm/min: {n:11} seconden.', en: 'One thing to fix: N60 feeds {n:28} mm, from Z25 to Z-3, at {n:150} mm/min: {n:11} seconds.', focus: ['prog'], points: ['ex.text.4'],
          say: { nl: 'Eén verbeterpunt. N60 gaat {n:28} millimeter op voeding, van Z25 naar Z min 3, met {n:150} millimeter per minuut. Dat duurt {n:11} seconden, grotendeels door de lucht.', en: 'One thing to fix. N60 feeds {n:28} mm, from Z25 to Z minus 3, at {n:150} mm per minute. That takes {n:11} seconds, mostly through air.' } },
        { nl: 'Eerst een G00 naar Z2 laat {n:5} mm op voeding over: {n:2} seconden.', en: 'A G00 to Z2 first leaves {n:5} mm at feed: {n:2} seconds.', focus: ['prog'], points: ['ex.text.4'],
          say: { nl: 'Eerst een G00 naar Z2 laat nog {n:5} millimeter op voeding over. Dat is {n:2} seconden.', en: 'A G00 to Z2 first leaves only {n:5} mm at feed. That is {n:2} seconds.' } },
        { nl: 'Op {n:2000} stuks scheelt dat 9 × {n:2000} = {n:18000} seconden: {n:5} uur.', en: 'On {n:2000} parts that saves 9 × {n:2000} = {n:18000} seconds: {n:5} hours.', focus: ['card'], points: ['ex.text.4'],
          say: { nl: 'Op {n:2000} stuks scheelt dat 9 keer {n:2000} is {n:18000} seconden. Dat is {n:5} uur.', en: 'On {n:2000} parts that saves 9 times {n:2000} which is {n:18000} seconds. That is {n:5} hours.' } },
      ],
    },
  ],
  skip: [],
};

const plainWords = (src) => wordsOf(src.replace(/\{[tn]:([^{}|]*)(\|([^{}]*))?\}/g, (m, a, b, c) => c || a));
for (const s of spec.scenes) {
  const cap = Math.max(...['nl', 'en'].map((l) => s.beats.reduce((a, b) => a + plainWords(b[l]), 0)));
  const nar = s.beats.reduce((a, b) => a + plainWords(b.say.nl), 0);
  s.dur = Math.ceil(Math.max(minSceneDur(cap + 6), nar / 2.7));
}
beatTimes(spec.scenes, plainWords, beatStarts);

const CAM = [
  { from: cam([0, 0, 150], 330, -110), to: cam([0, 0, 140], 310, -110) },
  { from: cam([0, 0, 135], 320, -115), to: cam([0, 0, 95], 170, -115), a: C.B[1][3] - 0.05, b: C.B[1][3] + 0.03 },
  { from: cam([0, 0, 150], 330, -110), to: cam([0, 0, 140], 310, -110) },
  { from: cam([0, 10, 200], 520, 0), to: cam([0, 10, 190], 500, 0) },
  { from: cam([0, 0, 150], 330, -110), to: cam([0, 0, 140], 310, -110) },
  { from: cam([0, 0, 150], 330, -110, 95), to: cam([0, 0, 140], 310, -110, 95) },
];

const hud = [hudParts.list, hudParts.counter, hudParts.inset, hudParts.card].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een verticaal bewerkingscentrum met een bankschroef en een stalen plaat. Naast de machine het programma van de sleuf, regel voor regel, met uitvergrotingen en kaarten.',
  en: 'A vertical machining centre with a vice and a steel plate. Beside the machine the program of the slot, block by block, with close-ups and cards.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

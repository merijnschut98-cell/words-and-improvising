// Dev tool, not shipped. Builds the lesson film "CNC: de basis / CNC basics" for the lesson eng.machining.cnc
// (level 1 of the CNC topic of Verspanen). Task 17, pilot P1: the old film "Een CNC-programma loopt" served four
// lessons and dropped half of their points; it is split into one complete film per lesson (D2, D3), and this one
// keeps the id. Its sisters are films/eng.machining.gcode, .offsets and .cam; the machine, its drawing and the
// stage library are in this folder (room.mjs, stage-lib.js).
//
//   node films/eng.machining.cnc/build.mjs            build the page
//   node films/eng.machining.cnc/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.cnc.html: one offline page. The film carries every point of the
// lesson (points: on the beats), the worked example of 200 flanges runs through it: the probe sets G54, tool 5 is
// measured, 112,43 is typed for 121,43, and the first-off check finds a hole 9 mm too deep.
import { join } from 'node:path';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { world, hudParts, P, W, H, C, at, g, cam, css, stageScriptOf, beatTimes, k, HERE } from './room.mjs';

const ID = 'eng.machining.cnc';
const L1 = 'eng.machining.cnc';

// ---------------------------------------------------------------- the film
const spec = {
  id: ID,
  title: { nl: 'CNC: de basis', en: 'CNC basics' },
  lessons: [L1],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'], stageFns: ['latheCard', 'modelFlow', 'fixFlow', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L1, level: 1, still: 0.9, title: { nl: 'Wat CNC is', en: 'What CNC is' },
      beats: [
        { nl: 'CNC (computer numerical control): een computer stuurt de motoren aan, volgens een programma.', en: 'CNC (computer numerical control): a computer drives the motors, following a program.', focus: null, points: ['t1.1'],
          say: { nl: 'CNC betekent dat een computer de motoren van de machine aanstuurt, volgens een programma. Dit is zo’n machine, een bewerkingscentrum.', en: 'CNC means that a computer drives the machine’s motors, following a program. This is such a machine, a machining centre.' } },
        { nl: 'De {t:Spil|spil} draait het werkstuk of het gereedschap, met een motor van {n:10} tot {n:40} kW.', en: 'The {t:Spindle|spindle} turns the part or the tool, driven by a motor of {n:10} to {n:40} kW.', cue: { Spil: 'spindle' }, focus: ['spindle'], points: ['t1.1'],
          say: { nl: 'De {t:Spil|spil} is de draaiende as. Op een draaibank houdt hij het werkstuk vast, op een freesmachine het gereedschap. Een motor van meestal {n:10} tot {n:40} kilowatt drijft hem aan.', en: 'The {t:Spindle|spindle} is the spinning shaft. On a lathe it holds the part, on a mill the tool. A motor of typically {n:10} to {n:40} kilowatts drives it.' } },
      ],
    },
    {
      id: 's2', lesson: L1, level: 1, still: 0.9, title: { nl: 'De assen', en: 'The axes' },
      beats: [
        { nl: 'Draaibank: X is de diameter, Z loopt langs de spil.', en: 'Lathe: X is the diameter, Z runs along the spindle.', focus: ['card'], points: ['t1.2'],
          say: { nl: 'Op een draaibank bepaalt X de diameter en loopt Z langs de spil.', en: 'On a lathe, X sets the diameter and Z runs along the spindle.' } },
        { nl: 'Freesmachine: X en Y bewegen de tafel, Z beweegt de spil op en neer.', en: 'Mill: X and Y move the table, Z moves the spindle up and down.', focus: ['axes'], points: ['t1.2'],
          say: { nl: 'Op een freesmachine bewegen X en Y de tafel, en Z beweegt de spil op en neer.', en: 'On a mill, X and Y move the table, and Z moves the spindle up and down.' } },
        { nl: 'Een vierde en vijfde as draaien het werkstuk of de spilkop.', en: 'A fourth and fifth axis rotate the part or the spindle head.', focus: ['axes'], points: ['t1.2'],
          say: { nl: 'Een vierde en vijfde as draaien het werkstuk of de spilkop.', en: 'A fourth and fifth axis rotate the part or the spindle head.' } },
      ],
    },
    {
      id: 's3', lesson: L1, level: 1, still: 0.9, title: { nl: 'G-code', en: 'G-code' },
      beats: [
        { nl: 'Het programma is {t:G-code|G-code}: een lijst korte commando’s.', en: 'The program is {t:G-code|G-code}: a list of short commands.', cue: { 'G-code': 'prog' }, focus: ['prog'], points: ['t2.1'],
          say: { nl: 'Het programma zelf is {t:G-code|G-code}. Dat is een lijst korte commando’s.', en: 'The program itself is {t:G-code|G-code}. That is a list of short commands.' } },
        { nl: 'G00 is een ijlgang, G01 een rechte snede, G02 en G03 cirkelbogen.', en: 'G00 is a rapid move, G01 a straight cut, G02 and G03 arcs.', focus: ['prog'], points: ['t2.1'],
          say: { nl: 'G00 is een ijlgang, dus snel verplaatsen zonder te snijden. G01 is een rechte snede. G02 en G03 zijn cirkelbogen.', en: 'G00 is a rapid move, fast and not cutting. G01 is a straight cut. G02 and G03 are arcs.' } },
        { nl: 'M03 start de spil, M08 de koeling, M06 wisselt het gereedschap.', en: 'M03 starts the spindle, M08 the coolant, M06 changes the tool.', focus: ['prog'], points: ['t2.1'],
          say: { nl: 'M03 start de spil. M08 zet de koeling aan, de koelvloeistof. M06 wisselt het gereedschap.', en: 'M03 starts the spindle. M08 switches on the coolant, the cooling liquid. M06 changes the tool.' } },
        { nl: 'F is de voeding, S het toerental, T het gereedschap.', en: 'F is the feed, S the spindle speed, T the tool.', focus: ['prog'], points: ['t2.1'],
          say: { nl: 'F is de voeding, hoe snel het gereedschap opschuift. S is het toerental van de spil. T is het gereedschap.', en: 'F sets the feed, how fast the tool advances. S is the spindle speed. T is the tool.' } },
      ],
    },
    {
      id: 's4', lesson: L1, level: 1, still: 0.9, title: { nl: 'Van model tot besturing', en: 'From model to control' },
      beats: [
        { nl: 'CAM (computer-aided manufacturing) maakt van het 3D-model de G-code.', en: 'CAM (computer-aided manufacturing) turns the 3D model into G-code.', focus: ['card'], points: ['t2.2'],
          say: { nl: 'De meeste programma’s maak je in CAM-software. Die zet het 3D-model van het onderdeel om in de G-code.', en: 'Most programs are written in CAM software. It turns the 3D model of the part into G-code.' } },
        { nl: 'De G-code gaat naar de besturing: Fanuc, Siemens of Heidenhain.', en: 'The G-code goes to the control: Fanuc, Siemens or Heidenhain.', focus: ['pend', 'card'], points: ['t2.2'],
          say: { nl: 'Die G-code gaat naar de besturing, de computer op de machine. Bekende merken zijn Fanuc, Siemens en Heidenhain.', en: 'That G-code goes to the control, the computer on the machine. Well-known makes are Fanuc, Siemens and Heidenhain.' } },
      ],
    },
    {
      id: 's5', lesson: L1, level: 1, still: 0.9, title: { nl: 'Het nulpunt', en: 'The zero point' },
      beats: [
        { nl: 'Het machinenulpunt is een vaste thuispositie.', en: 'Machine zero is a fixed home position.', focus: ['home'], points: ['t3.1'],
          say: { nl: 'Dan de nulpunten. Het machinenulpunt is een vaste thuispositie van de machine.', en: 'Now the zero points. Machine zero is a fixed home position of the machine.' } },
        { nl: 'Order van {n:200} flenzen: de taster tikt de bek van de bankschroef aan.', en: 'A job of {n:200} flanges: the probe touches the jaw of the vice.', focus: ['probe'], points: ['ex.text.1'],
          say: { nl: 'Een insteller begint aan een order van {n:200} flenzen. Hij zet G54 door de bek van de bankschroef af te tasten. Een bankschroef is een klem met twee bekken. De taster is een meetpen in de spil.', en: 'A setter starts a job of {n:200} flanges. He sets G54 by touching the jaw of the vice. A vice is a clamp with two jaws. The probe is a measuring pin held in the spindle.' } },
        { nl: 'Het {t:Werkstuknulpunt|werkstuknulpunt} G54 vertelt de machine waar het werkstuk ligt.', en: 'The {t:Work offset|work offset} G54 tells the machine where the part sits.', cue: { Werkstuknulpunt: 'g54' }, focus: ['g54'], points: ['t3.1'],
          say: { nl: 'Het {t:Werkstuknulpunt|werkstuknulpunt} G54 vertelt de machine waar het werkstuk op de tafel ligt.', en: 'The {t:Work offset|work offset} G54 tells the machine where the part sits on the table.' } },
      ],
    },
    {
      id: 's6', lesson: L1, level: 1, still: 0.9, title: { nl: 'Gereedschap meten', en: 'Measuring the tools' },
      beats: [
        { nl: 'Elk gereedschap steekt anders uit: de {t:Gereedschapscorrectie|gereedschapscorrectie} bewaart lengte en radius.', en: 'Every tool sticks out differently: the {t:Tool offset|tool offset} stores length and radius.', cue: { Gereedschapscorrectie: 'toolL' }, focus: ['toolL'], points: ['t3.1'],
          say: { nl: 'Elk gereedschap steekt anders uit. Daarom bewaart een {t:Gereedschapscorrectie|gereedschapscorrectie} de lengte en de radius van een gereedschap.', en: 'Every tool sticks out a different amount. So a {t:Tool offset|tool offset} stores the length and the radius of a tool.' } },
        { nl: 'Gereedschap {n:5}, een boor, raakt de gereedschapsmeter: {n:121.43} mm gaat de tabel in.', en: 'Tool {n:5}, a drill, touches the tool setter: {n:121.43} mm goes into the table.', focus: ['setter', 'table'], read: { nl: 'T{n:5} · L {n:121.43} mm', en: 'T{n:5} · L {n:121.43} mm' },
          say: { nl: 'Gereedschap {n:5} is een boor. Hij raakt de gereedschapsmeter, en zijn lengte van {n:121.43} millimeter gaat de tabel in.', en: 'Tool {n:5} is a drill. It touches the tool setter, and its length of {n:121.43} millimetres goes into the table.' } },
        { nl: 'De insteller meet die getallen en typt ze in: samen heten ze de offsets.', en: 'The setter measures and types in these numbers: together they are called the offsets.', focus: ['table'], points: ['t3.2'],
          say: { nl: 'De insteller meet die getallen en typt ze in. Samen heten ze de offsets.', en: 'The setter measures these numbers and types them in. Together they are called the offsets.' } },
        { nl: 'De meeste crashes en afgekeurde eerste stukken komen door verkeerde offsets, niet door verkeerde programma’s.', en: 'Most crashes and scrapped first parts come from wrong offsets, not from wrong programs.', focus: ['card'], points: ['t3.2'],
          say: { nl: 'De meeste crashes komen door verkeerde offsets, niet door verkeerde programma’s. Bij een crash raakt het gereedschap het werkstuk of de klemmen. Ook de meeste afgekeurde eerste stukken komen door verkeerde offsets.', en: 'Most crashes come from wrong offsets, not from wrong programs. In a crash the tool hits the part or the clamps. Most scrapped first parts also come from wrong offsets.' } },
      ],
    },
    {
      id: 's7', lesson: L1, level: 1, still: 0.9, title: { nl: 'Een tikfout', en: 'A typing error' },
      beats: [
        { nl: 'Voor gereedschap {n:5} typt hij {n:112.43} in plaats van {n:121.43}.', en: 'For tool {n:5} he types {n:112.43} instead of {n:121.43}.', focus: ['table'], read: { nl: 'T{n:5} · L {n:112.43} ≠ {n:121.43}', en: 'T{n:5} · L {n:112.43} ≠ {n:121.43}' }, points: ['ex.text.2'],
          say: { nl: 'Gereedschap {n:5} is een boor. De insteller typt een lengte van {n:112.43} millimeter in, in plaats van {n:121.43}.', en: 'Tool {n:5} is a drill. The setter types a length of {n:112.43} millimetres, instead of {n:121.43}.' } },
        { nl: 'De machine denkt dat de boor {n:9} mm korter is: hij boort {n:9} mm dieper.', en: 'The machine thinks the drill is {n:9} mm shorter: it drills {n:9} mm deeper.', focus: ['section'], points: ['ex.text.2'],
          say: { nl: 'De machine denkt dat de boor {n:9} millimeter korter is dan hij is. Dus boort hij {n:9} millimeter dieper.', en: 'The machine thinks the drill is {n:9} millimetres shorter than it is. So it drills {n:9} millimetres deeper.' } },
      ],
    },
    {
      id: 's8', lesson: L1, level: 1, still: 0.9, title: { nl: 'Voorzichtig starten', en: 'Starting carefully' },
      beats: [
        { nl: 'Vóór de eerste snede laat een zorgvuldige insteller het programma in enkelregel lopen.', en: 'Before the first cut, a careful setter runs the program in single block.', focus: ['prove'], points: ['t4.1'],
          say: { nl: 'Voor de eerste snede laat een zorgvuldige insteller een nieuw programma in enkelregel lopen. Dat is één regel per druk op de knop.', en: 'Before the first cut, a careful setter runs a new program in single block. That is one line per button press.' } },
        { nl: 'De ijlgang staat langzamer en een hand ligt op de stopknop.', en: 'Rapid moves are slowed down and a hand is on the stop button.', focus: ['pend'], points: ['t4.1'],
          say: { nl: 'De ijlgang is langzamer gezet. En er ligt een hand op de stopknop.', en: 'Rapid moves are slowed down. And a hand rests on the stop button.' } },
      ],
    },
    {
      id: 's9', lesson: L1, level: 1, still: 0.9, title: { nl: 'Het eerste stuk', en: 'The first part' },
      beats: [
        { nl: 'Dan de {t:Eerste-stukcontrole|eerste-stukcontrole}: na elke omstelling meet je het eerste stuk helemaal.', en: 'Then the {t:First-off|first-off} check: after every setup you measure the first part fully.', cue: { 'Eerste-stukcontrole': 'gauge' }, focus: ['gauge'], points: ['t4.2'],
          say: { nl: 'Dan volgt de {t:Eerste-stukcontrole|eerste-stukcontrole}. Na elke omstelling, programmawijziging of gereedschapswissel meet je het eerste stuk volledig, voordat de serie draait.', en: 'Then comes the {t:First-off|first-off} check. After every setup, program change or tool change you measure the first part fully, before the batch runs.' } },
        { nl: 'Veel bedrijven meten ook het laatste stuk. Het kost {n:10} tot {n:20} minuten.', en: 'Many shops also check the last part. It costs {n:10} to {n:20} minutes.', focus: ['counter'], points: ['t4.2'],
          say: { nl: 'Veel bedrijven controleren ook het laatste stuk. Het kost {n:10} tot {n:20} minuten en kan een serie van {n:200} foute stukken voorkomen.', en: 'Many shops also check the last part. It costs {n:10} to {n:20} minutes and can save a batch of {n:200} wrong parts.' } },
        { nl: 'De controle vindt een gat dat {n:9} mm te diep is: één stuk afgekeurd, €{n:35}.', en: 'The check finds a hole {n:9} mm too deep: one part scrapped, €{n:35}.', focus: ['section'], points: ['ex.text.3'],
          say: { nl: 'In het voorbeeld vindt de eerste-stukcontrole een gat dat {n:9} millimeter te diep is. Eén stuk is afgekeurd, {n:35} euro.', en: 'In the example the first-off check finds a hole that is {n:9} millimetres too deep. One part is scrapped, {n:35} euros.' } },
        { nl: 'Zonder die controle: {n:200} × €{n:35} = €{n:7000} afkeur.', en: 'Without that check: {n:200} × €{n:35} = €{n:7000} of scrap.', focus: ['counter'], points: ['ex.text.3'],
          say: { nl: 'Zonder die controle is het {n:200} keer {n:35} euro, dus {n:7000} euro afkeur.', en: 'Without that check it is {n:200} times {n:35} euros, so {n:7000} euros of scrap.' } },
        { nl: 'Stopt het gat net boven een dunne bodem, dan kan de boor breken en de mal beschadigen.', en: 'If the hole must stop just above a thin floor, the drill may break and the fixture be damaged.', focus: ['crash'], points: ['ex.text.3'],
          say: { nl: 'Moet het gat net boven een dunne bodem stoppen, dan gaat er misschien een boor kapot en raakt de mal beschadigd. Dat is de houder die voor dit werkstuk gemaakt is.', en: 'If the hole should stop just above a thin floor, a drill may break and the fixture be damaged. That is the holder made for this part.' } },
      ],
    },
    {
      id: 's10', lesson: L1, level: 1, still: 0.9, title: { nl: 'Vragen voor de engineer', en: 'Questions for the engineer' },
      beats: [
        { nl: 'Waar engineers over steggelen: wijzigingen aan de machine.', en: 'What engineers argue about: edits at the machine.', focus: ['card'], points: ['t5.1'],
          say: { nl: 'Waar engineers over steggelen zijn wijzigingen aan de machine. Een insteller repareert een programma op de besturing.', en: 'What engineers argue about are edits at the machine. A setter fixes a program on the control.' } },
        { nl: 'Komt die fix niet terug in het CAM-bestand, dan keert de oude fout terug bij de volgende herhaalorder.', en: 'If the fix never goes back into the CAM file, the old error returns at the next repeat order.', focus: ['card'], points: ['t5.1'],
          say: { nl: 'Komt die fix nooit terug in het CAM-bestand, dan keert de oude fout terug bij de volgende herhaalorder.', en: 'If the fix never goes back into the CAM file, the old error returns at the next repeat order.' } },
        { nl: 'Goede vragen: is dit programma {t:Beproefd|beproefd}, dus al eerder zonder problemen gedraaid?', en: 'Good questions: is this program {t:Proven|proven}, meaning it ran before without problems?', cue: { Beproefd: 'proven' }, focus: ['proven', 'card'], points: ['t5.2'],
          say: { nl: 'Goede vragen. Is dit programma {t:Beproefd|beproefd}, dus al eerder zonder problemen gedraaid? Waar staat de masterversie?', en: 'Good questions. Is this program {t:Proven|proven}, meaning it has run before without problems? Where is the master version?' } },
        { nl: 'Hoeveel crashes waren er vorig jaar, en wat kostten ze?', en: 'How many crashes last year, and what did they cost?', focus: ['card'], points: ['t5.2'],
          say: { nl: 'Hoeveel crashes waren er vorig jaar, en wat kostten ze?', en: 'How many crashes were there last year, and what did they cost?' } },
        { nl: 'Een spilcrash kost €{n:5000} tot €{n:30000} aan reparatie, plus dagen tot weken stilstand.', en: 'A spindle crash costs €{n:5000} to €{n:30000} in repairs, plus days to weeks of downtime.', focus: ['card'], points: ['t5.2'],
          say: { nl: 'Een spilcrash kan {n:5000} tot {n:30000} euro aan reparatie kosten. Daar komen dagen tot weken stilstand bij.', en: 'A spindle crash can cost {n:5000} to {n:30000} euros in repairs. On top come days to weeks of downtime.' } },
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
  { from: cam([20, 0, 200], 640), to: cam([-20, 10, 130], 300), a: 0, b: 0.5 },
  { from: cam([-30, 0, 150], 440, 100, -30), to: cam([-30, 0, 135], 380, 100, -30) },
  { from: cam([0, 0, 150], 330, -110), to: cam([0, 0, 140], 310, -110) },
  { from: cam([-40, 0, 130], 420, 0, -55), to: cam([-180, -50, 200], 300, 0, -55), a: 0.5, b: 0.75 },
  { from: cam([20, 0, 200], 640), to: cam([0, 0, 120], 360, -60), a: 0, b: 0.5 },
  { from: cam([20, 0, 130], 340, -60), to: cam([0, 0, 120], 360, -60) },
  { from: cam([0, 0, 140], 330, 110), to: cam([0, 0, 125], 290, 110) },
  { from: cam([-80, -30, 200], 400), to: cam([-209, -60, 200], 230, 0, 0) },
  { from: cam([0, 0, 140], 330, 110), to: cam([0, 0, 125], 290, 110) },
  { from: cam([0, 0, 200], 520, 0), to: cam([0, 0, 190], 500, 0) },
];

// ---------------------------------------------------------------- page
const hud = [hudParts.list, hudParts.tab, hudParts.counter, hudParts.sbk, hudParts.inset, hudParts.card].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een verticaal bewerkingscentrum: een kolom met een spilkop, een tafel met een bankschroef en een stalen plaat, een gereedschapsmeter, een gereedschapsmagazijn en een bedieningspaneel. Naast de machine een programmalijst, een correctietabel, kaarten en uitvergrotingen.',
  en: 'A vertical machining centre: a column with a spindle head, a table with a vice and a steel plate, a tool setter, a tool magazine and a control panel. Beside the machine a program listing, an offset table, cards and close-ups.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

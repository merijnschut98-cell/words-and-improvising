// Dev tool, not shipped. Builds the lesson film "Correcties en offsets / Offsets and compensation" for the lesson
// eng.machining.offsets (level 3 of the CNC topic of Verspanen). Task 17, pilot P1: one of the four films the old
// film "Een CNC-programma loopt" was split into; the machine, its drawing and the stage library are those of
// films/eng.machining.cnc (room.mjs, stage-lib.js), imported, not copied.
//
//   node films/eng.machining.offsets/build.mjs            build the page
//   node films/eng.machining.offsets/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.offsets.html. The film carries every point of the lesson (points:
// on the beats): the three offsets and how they are switched off, why they are split, what a crash is and where it
// comes from, what the process engineer decides, and the worked example of six crashes and a presetter.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { world, hudParts, P, W, H, C, g, cam, css, stageScriptOf, beatTimes, k } from '../eng.machining.cnc/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.machining.offsets';
const L3 = 'eng.machining.offsets';

const spec = {
  id: ID,
  title: { nl: 'Correcties en offsets', en: 'Offsets and compensation' },
  lessons: [L3],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6'], stageFns: ['causesCard', 'decideCard', 'caseCard', 'answerCard', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L3, level: 3, still: 0.9, title: { nl: 'Drie correcties', en: 'Three offsets' },
      beats: [
        { nl: 'Het programma beschrijft het werkstuk, niet het gereedschap. De besturing voegt het toe uit de offsets.', en: 'The program describes the part, not the tool: the control adds the tool from tables, the offsets.', focus: ['table'], points: ['t1.1'],
          say: { nl: 'Het programma beschrijft het werkstuk, niet het gereedschap. De besturing voegt het gereedschap toe uit tabellen. Dat zijn de offsets. Drie tellen.', en: 'The program describes the part, not the tool. The control adds the tool from tables, the offsets. Three matter.' } },
        { nl: 'Het werkstuknulpunt, G54 tot G59, zegt waar het nulpunt van het werkstuk ligt.', en: 'The work offset, G54 to G59, says where the part zero sits.', focus: ['g54'], points: ['t1.1'],
          say: { nl: 'Het werkstuknulpunt, G54 tot G59, zegt waar het nulpunt van het werkstuk ligt.', en: 'The work offset, G54 to G59, says where the part zero sits.' } },
        { nl: 'G43 met een H-nummer: de {t:Lengtecorrectie|lengtecorrectie} telt de uitsteeklengte op.', en: 'G43 with an H number: {t:Tool length compensation|tool length compensation} adds the stick-out.', cue: { Lengtecorrectie: 'toolL' }, focus: ['toolL'], points: ['t1.1'],
          say: { nl: 'De {t:Lengtecorrectie|lengtecorrectie} gebruikt G43 met een H-nummer. Ze telt op hoe ver elk gereedschap uit de spil steekt.', en: '{t:Tool length compensation|Tool length compensation} uses G43 with an H number. It adds how far each tool sticks out of the spindle.' } },
        { nl: 'G41 links, G42 rechts van de contour, met een D-nummer: {t:Radiuscorrectie|radiuscorrectie}.', en: 'G41 left, G42 right of the contour, with a D number: {t:Cutter radius compensation|cutter radius compensation}.', cue: { Radiuscorrectie: 'rcomp' }, focus: ['rcomp'], points: ['t1.1'],
          say: { nl: 'De {t:Radiuscorrectie|radiuscorrectie} gebruikt G41 links van de contour en G42 rechts, met een D-nummer. Ze verschuift de baan zijwaarts met de straal van het gereedschap.', en: '{t:Cutter radius compensation|Cutter radius compensation} uses G41 left of the contour and G42 right, with a D number. It shifts the path sideways by the tool radius.' } },
        { nl: 'G49 en G40 zetten de lengtecorrectie en de radiuscorrectie weer uit.', en: 'G49 and G40 switch the length and the radius compensation off again.', focus: ['toolL', 'rcomp'], points: ['t1.2'],
          say: { nl: 'G49 en G40 zetten de lengtecorrectie en de radiuscorrectie weer uit.', en: 'G49 and G40 switch the length compensation and the radius compensation off again.' } },
      ],
    },
    {
      id: 's2', lesson: L3, level: 3, still: 0.9, title: { nl: 'Waarom die splitsing', en: 'Why the split' },
      beats: [
        { nl: 'De programmeur schrijft de contour van het werkstuk één keer.', en: 'The programmer writes the contour of the part once.', focus: ['table'], points: ['t2.1'],
          say: { nl: 'Waarom die splitsing. De programmeur schrijft de contour van het werkstuk één keer.', en: 'Why this split. The programmer writes the contour of the part once.' } },
        { nl: 'Meet een nieuwe vingerfrees van {n:10} mm {n:9.98} mm? Dan voert de insteller straal {n:4.99} in.', en: 'A new {n:10} mm end mill measures {n:9.98} mm? The setter enters radius {n:4.99}.', focus: ['rcomp', 'table'], points: ['t2.1'],
          say: { nl: 'Meet een nieuwe vingerfrees van {n:10} millimeter {n:9.98} millimeter, dan voert de insteller straal {n:4.99} in. Hetzelfde programma maakt dan nog steeds de goede maat.', en: 'If a new {n:10} mm end mill measures {n:9.98} mm, the setter enters radius {n:4.99}. The same program still makes the right size.' } },
        { nl: 'Bovenop elke gemeten waarde zit een {t:Slijtagecorrectie|slijtagecorrectie}, ingevoerd als maten verlopen.', en: 'On top of each measured value sits a {t:Wear offset|wear offset}, entered when sizes drift.', cue: { Slijtagecorrectie: 'wear' }, focus: ['wear'], points: ['t2.2'],
          say: { nl: 'Bovenop elke gemeten waarde zit een {t:Slijtagecorrectie|slijtagecorrectie}. Dat is een kleine correctie die de operator invoert als maten verlopen.', en: 'On top of each measured value sits a {t:Wear offset|wear offset}. That is a small correction the operator enters when sizes drift.' } },
        { nl: 'Een boring {n:0.01} mm te klein op de diameter? De radius gaat {n:0.005} mm aan: de helft.', en: 'A bore {n:0.01} mm small on diameter? The radius changes by {n:0.005} mm: half.', focus: ['wear'], points: ['t2.2'],
          say: { nl: 'Meet een boring {n:0.01} millimeter te klein op de diameter? Dan past de operator de radius aan met {n:0.005} millimeter. Dat is de helft van de fout, want een straal telt twee keer in een diameter.', en: 'A bore measures {n:0.01} mm small on diameter? Then the operator changes the radius by {n:0.005} mm. That is half the error, because a radius counts twice in a diameter.' } },
      ],
    },
    {
      id: 's3', lesson: L3, level: 3, still: 0.9, title: { nl: 'Een crash', en: 'A crash' },
      beats: [
        { nl: 'Een {t:Crash|crash} is gereedschap of spil die het werkstuk, de mal of de machine raakt.', en: 'A {t:Crash|crash} is the tool or spindle hitting the part, the fixture or the machine.', cue: { Crash: 'crash' }, focus: ['crash'], points: ['t3.1'],
          say: { nl: 'Een {t:Crash|crash} is gereedschap of spil die het werkstuk, de mal of de machine raakt.', en: 'A {t:Crash|crash} is the tool or spindle hitting the part, the fixture or the machine.' } },
        { nl: 'Typische oorzaak: een fout ingetypt getal, {n:121.43} wordt {n:112.43}.', en: 'A typical cause: a wrong number typed in, {n:121.43} becomes {n:112.43}.', focus: ['table', 'card'], read: { nl: 'L {n:121.43} → {n:112.43}', en: 'L {n:121.43} → {n:112.43}' }, points: ['t3.1'],
          say: { nl: 'Typische oorzaken. Een fout ingetypt getal, zoals {n:121.43} dat {n:112.43} wordt.', en: 'Typical causes. A wrong number typed in, such as {n:121.43} becoming {n:112.43}.' } },
        { nl: 'Het verkeerde H-nummer: gereedschap {n:5} met de lengte van gereedschap 3.', en: 'The wrong H number: tool {n:5} with the length of tool 3.', focus: ['card'], points: ['t3.1'],
          say: { nl: 'Het verkeerde H-nummer, dus gereedschap {n:5} met de lengte van gereedschap 3.', en: 'The wrong H number, so tool {n:5} with the length of tool 3.' } },
        { nl: 'Het verkeerde nulpunt actief: G55 terwijl het werkstuk op G54 ligt.', en: 'The wrong work offset active: G55 while the part sits on G54.', focus: ['card'], points: ['t3.1'],
          say: { nl: 'Het verkeerde nulpunt is actief. Dat is G55 terwijl het werkstuk op G54 ligt.', en: 'The wrong work offset is active. That is G55 while the part sits on G54.' } },
        { nl: 'Een gereedschap op de verkeerde plek in het magazijn, of incrementeel waar absoluut bedoeld was.', en: 'A tool in the wrong pocket of the magazine, or incremental where absolute was meant.', focus: ['card', 'mag'], points: ['t3.1'],
          say: { nl: 'Een gereedschap staat in de verkeerde plek van het magazijn. Of er is een incrementele beweging waar absoluut bedoeld was.', en: 'A tool sits in the wrong pocket of the magazine. Or there is an incremental move where absolute was meant.' } },
        { nl: 'De rode draad: een tabel die niet klopt met de werkelijkheid. Het programma zelf is meestal goed.', en: 'The common thread: a table that does not match reality. The program itself is usually fine.', focus: ['table'], points: ['t3.2'],
          say: { nl: 'De rode draad is een tabel die niet klopt met de werkelijkheid. Het programma zelf is meestal goed.', en: 'The common thread is a table that does not match reality. The program itself is usually fine.' } },
      ],
    },
    {
      id: 's4', lesson: L3, level: 3, still: 0.9, title: { nl: 'Wat de engineer beslist', en: 'What the engineer decides' },
      beats: [
        { nl: 'De procesengineer beslist welke getallen met de hand worden ingetypt en welke gemeten.', en: 'The process engineer decides which numbers are typed by hand and which are measured.', focus: ['table'], points: ['t4.1'],
          say: { nl: 'De procesengineer beslist welke getallen met de hand worden ingetypt, en welke worden gemeten.', en: 'The process engineer decides which numbers are typed by hand, and which are measured.' } },
        { nl: 'Een voorinstelapparaat (presetter) stuurt gereedschapslengtes elektronisch naar de besturing.', en: 'A presetter sends tool lengths to the control electronically.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Een voorinstelapparaat is een meetopstelling naast de machine. Het stuurt gereedschapslengtes elektronisch naar de besturing.', en: 'A presetter is a measuring stand next to the machine. It sends tool lengths to the control electronically.' } },
        { nl: 'Een taster in de spil zet G54 zelf.', en: 'A touch probe in the spindle sets G54 itself.', focus: ['probe', 'card'], points: ['t4.1'],
          say: { nl: 'Een taster in de spil zet G54 zelf.', en: 'A touch probe in the spindle sets G54 itself.' } },
        { nl: 'Een gereedschapsmeter (tool setter) in de machine controleert de lengte na elke wissel.', en: 'A tool setter in the machine checks the length after every tool change.', focus: ['setter', 'card'], points: ['t4.1'],
          say: { nl: 'Een gereedschapsmeter in de machine controleert de lengte na elke wissel.', en: 'A tool setter in the machine checks the length after every tool change.' } },
        { nl: 'Elke automatische stap haalt een kans op een tikfout weg.', en: 'Each automatic step removes a chance to mistype.', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Elke automatische stap haalt een kans op een tikfout weg.', en: 'Each automatic step removes a chance to mistype.' } },
        { nl: 'De vraag voor de engineer: welke crashes hadden we, en welke stap had elk ervan tegengehouden?', en: 'The question for the engineer: which crashes did we have, and which step would have stopped each one?', focus: ['card'], points: ['t4.2'],
          say: { nl: 'De vraag voor de engineer is welke crashes we hadden. En welke stap had elk ervan tegengehouden?', en: 'The question for the engineer is which crashes we had. And which step would have stopped each one?' } },
      ],
    },
    {
      id: 's5', lesson: L3, level: 3, still: 0.9, title: { nl: 'De case', en: 'The case' },
      beats: [
        { nl: 'Een cel had vorig jaar {n:6} crashes.', en: 'A cell had {n:6} crashes last year.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een cel had vorig jaar {n:6} crashes. De oorzaken staan in de rapporten.', en: 'A cell had {n:6} crashes last year. The causes are in the reports.' } },
        { nl: 'Oorzaken: {n:3} fout ingetypte lengtes, {n:2} verkeerde H-nummers, {n:1} verkeerd werkstuknulpunt.', en: 'Causes: {n:3} wrong tool lengths typed in, {n:2} wrong H numbers, {n:1} wrong work offset.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Drie keer was een gereedschapslengte fout ingetypt. Twee keer was er een verkeerd H-nummer. Een keer was er een verkeerd werkstuknulpunt.', en: 'Three times a tool length was typed in wrong. Twice there was a wrong H number. Once there was a wrong work offset.' } },
        { nl: 'Elke crash kostte gemiddeld €{n:12000} aan reparatie en verloren machine-uren.', en: 'Each crash cost on average €{n:12000} in repairs and lost machine hours.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Elke crash kostte gemiddeld {n:12000} euro aan reparatie en verloren machine-uren. Dat is het eigen cijfer van het bedrijf, als aanname.', en: 'Each crash cost on average {n:12000} euros in repairs and lost machine hours. That is the shop’s own figure, stated as an assumption.' } },
        { nl: 'Voorstel: een voorinstelapparaat dat gereedschapsdata naar de besturing stuurt, aangenomen €{n:25000}.', en: 'Proposal: a presetter that sends tool data to the control, an assumed €{n:25000}.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'Het voorstel is een voorinstelapparaat dat gereedschapsdata elektronisch naar de besturing stuurt. Aangenomen is {n:25000} euro, inclusief de koppeling.', en: 'The proposal is a presetter that sends tool data to the control electronically. An assumed {n:25000} euros, including the link.' } },
        { nl: 'Het haalt ingetypte lengtes en verwisselde H-nummers weg, maar doet niets voor het nulpunt.', en: 'It removes typed lengths and H-number mix-ups, but does nothing for the work offset.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'Het haalt ingetypte lengtes en verwisselde H-nummers weg. Voor het werkstuknulpunt doet het niets.', en: 'It removes typed lengths and H-number mix-ups. It does nothing for the work offset.' } },
        { nl: 'Welke crashes had het voorkomen, wat bespaart dat per jaar en wat is de terugverdientijd?', en: 'Which crashes would it have prevented, what does that save a year, and how long is the payback?', focus: ['card'], points: ['ex.ask'],
          say: { nl: 'Welke crashes had het voorkomen, wat bespaart dat per jaar, en wat is de terugverdientijd?', en: 'Which crashes would it have prevented, what does that save a year, and how long is the payback?' } },
      ],
    },
    {
      id: 's6', lesson: L3, level: 3, still: 0.9, title: { nl: 'Het antwoord', en: 'The answer' },
      beats: [
        { nl: '{n:3} + {n:2} = {n:5} van de {n:6} crashes: {n:5} × €{n:12000} = €{n:60000} per jaar.', en: '{n:3} + {n:2} = {n:5} of the {n:6} crashes: {n:5} × €{n:12000} = €{n:60000} a year.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: '3 plus 2 is 5 van de 6 crashes. 5 keer {n:12000} euro is {n:60000} euro per jaar.', en: '3 plus 2 is 5 of the 6 crashes. 5 times {n:12000} euros is {n:60000} euros a year.' } },
        { nl: 'Terugverdientijd: €{n:25000} / €{n:60000} = {n:0.42} jaar, zo’n 5 maanden.', en: 'Payback: €{n:25000} / €{n:60000} = {n:0.42} years, about 5 months.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'De terugverdientijd is {n:25000} gedeeld door {n:60000}. Dat is {n:0.42} jaar, zo’n 5 maanden.', en: 'The payback is {n:25000} divided by {n:60000}. That is {n:0.42} years, about 5 months.' } },
        { nl: 'De zesde crash vraagt een andere oplossing: het nulpunt zetten met een taster, of een controle bij de start.', en: 'The sixth crash needs another fix: set the part zero with a touch probe, or a check at the start.', focus: ['card'], points: ['ex.reveal.2'],
          say: { nl: 'De zesde crash, het verkeerde nulpunt, vraagt een andere oplossing. Zet het nulpunt met een taster. Of bouw aan het begin van het programma een controle in die stopt als het verkeerde nulpunt actief is.', en: 'The sixth crash, the wrong work offset, needs another fix. Set the part zero with a touch probe. Or build in a check at the start of the program that stops when the wrong offset is active.' } },
        { nl: 'Vraag ook of vorig jaar normaal was: zes crashes in één cel is veel.', en: 'Also ask whether last year was typical: six crashes in one cell is a lot.', focus: ['card'], points: ['ex.reveal.2'],
          say: { nl: 'Vraag ook of vorig jaar normaal was. Zes crashes in één cel is veel.', en: 'Also ask whether last year was typical. Six crashes in one cell is a lot.' } },
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
  { from: cam([0, 0, 150], 330, 110), to: cam([0, 0, 140], 310, 110) },
  { from: cam([0, 0, 140], 330, 110), to: cam([0, 0, 125], 290, 110) },
  { from: cam([0, 0, 140], 330, 110), to: cam([0, 0, 125], 290, 110) },
  { from: cam([0, 0, 150], 340, -150), to: cam([0, 0, 135], 320, -150) },
  { from: cam([0, 0, 170], 400, -170), to: cam([0, 0, 160], 380, -170) },
  { from: cam([0, 0, 170], 400, -170), to: cam([0, 0, 160], 380, -170) },
];

const hud = [hudParts.tab, hudParts.inset, hudParts.card].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een verticaal bewerkingscentrum met een bankschroef en een stalen plaat, een gereedschapsmeter en een bedieningspaneel. Naast de machine een correctietabel, kaarten met oorzaken en berekeningen en uitvergrotingen.',
  en: 'A vertical machining centre with a vice and a steel plate, a tool setter and a control panel. Beside the machine an offset table, cards with causes and calculations, and close-ups.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

// Dev tool, not shipped. Builds the lesson film "Lassen op papier / Welding on paper" for the lesson eng.joining.wps
// (level 3 of the topic Booglassen of Lassen en verbinden). Task 17, batch B1: one of the four films the old film "Van
// boog tot scheur" was split into; the bench, its drawing and the stage library are those of films/eng.joining.arc
// (room.mjs, stage-lib.js), imported, not copied. The finished weld lies behind the scrim; the papers are cards.
//
//   node films/eng.joining.wps/build.mjs            build the page
//   node films/eng.joining.wps/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.wps.html. The film carries every point of the lesson (points: on the
// beats): the chain pLMB, test, LMK, LMB, the ranges of qualification, the welder, the welding coordinator, and the
// worked example (22 mm at 1,6 kJ/mm) with its question and its two options.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { worldOf, hudParts, svgOf, C, cam, css, stageScriptOf, beatTimes, beatTimesOf, k } from '../eng.joining.arc/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.joining.wps';
const L3 = 'eng.joining.wps';

const spec = {
  id: ID,
  title: { nl: 'Lassen op papier', en: 'Welding on paper' },
  lessons: [L3],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5'], stageFns: ['chain', 'ranges', 'welder', 'coordinator', 'example', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L3, level: 3, still: 0.9, title: { nl: 'Van recept tot bewijs', en: 'From recipe to proof' },
      beats: [
        { nl: 'Sterk en taai genoeg? Dat meet je achteraf niet volledig, dus normen leggen het vooraf vast.', en: 'Strong and tough enough? You cannot fully measure that afterwards, so standards fix it up front.', focus: ['card'], points: ['t1.1'],
          say: { nl: 'Of een las sterk en taai genoeg is, kun je achteraf niet volledig meten. Daarom leggen normen het vooraf vast.', en: 'You cannot fully measure afterwards whether a weld is strong and tough. So standards fix it up front.' } },
        { nl: 'Een voorlopige lasmethode, de {t:pLMB|pLMB}, beschrijft hoe je wilt lassen.', en: 'A preliminary procedure, the {t:pWPS|pWPS}, describes how you want to weld.', cue: { pLMB: 'pwps' }, focus: ['pwps'], points: ['t1.1'],
          say: { nl: 'Een voorlopige lasmethodebeschrijving, de {t:pLMB|pLMB}, beschrijft hoe je wilt lassen.', en: 'A preliminary procedure, the {t:pWPS|pWPS}, describes how you want to weld.' } },
        { nl: 'Proefstuk testen volgens ISO 15614-1: visueel, NDO, trek-, buig-, macroproeven, soms kerfslag en hardheid.', en: 'Test piece tested to ISO 15614-1: visual, NDT, tensile, bend and macro tests, sometimes impact and hardness.', focus: ['pwps'], points: ['t1.1'],
          say: { nl: 'Met die beschrijving wordt een proefstuk gelast en getest volgens ISO 15614-1. De proeven zijn visueel en NDO. Daarna volgen trek-, buig- en macroproeven. Soms komen daar kerfslag en hardheid bij. NDO is niet-destructief onderzoek.', en: 'A test piece is welded with it and tested to ISO 15614-1. The tests are visual and NDT. Then come tensile, bend and macro tests. Sometimes impact and hardness are added. NDT is non-destructive testing.' } },
        { nl: 'Keurt het lab het goed, dan heb je een LMK, het testbewijs. Daaruit volgt de LMB (ISO 15609-1).', en: 'If the lab approves, you have a WPQR, the test proof. From it follows the WPS (ISO 15609-1).', focus: ['proof'], points: ['t1.2'],
          say: { nl: 'Keurt het lab het proefstuk goed, dan heb je een LMK. Dat is het testbewijs. Daaruit volgt de LMB, volgens ISO 15609-1. Dat is het recept bij de werkplek.', en: 'If the lab approves it, you have a WPQR, the test proof. From it follows the WPS, to ISO 15609-1. That is the recipe at the workstation.' } },
        { nl: 'Voor licht werk bestaan kortere routes, zoals een standaardlasmethode (ISO 15612).', en: 'Light work has shorter routes, such as ISO 15612.', focus: ['proof'], points: ['t1.2'],
          say: { nl: 'Voor licht werk bestaan kortere routes. Een voorbeeld is een standaardlasmethode, volgens ISO 15612.', en: 'Light work has shorter routes. One example is a standard welding procedure, ISO 15612.' } },
      ],
    },
    {
      id: 's2', lesson: L3, level: 3, still: 0.9, title: { nl: 'Geldigheidsgebied', en: 'Range of qualification' },
      beats: [
        { nl: 'Elke {t:Essentiële variabele|essentiële variabele} heeft een bereik rond de geteste waarde.', en: 'Every {t:Essential variable|essential variable} has a range around the tested value.', cue: { 'Essentiële variabele': 'ess' }, focus: ['ess'], points: ['t2.1'],
          say: { nl: 'Een LMK geldt niet voor alles. Elke {t:Essentiële variabele|essentiële variabele} heeft een bereik rond de geteste waarde. Zoals het proces en de materiaalgroep. Het toevoegmateriaal en het gas. De positie, de dikte en het voorwarmen.', en: 'A WPQR does not cover everything. Every {t:Essential variable|essential variable} has a range around the tested value. Such as the process and the material group. The filler and the gas. The position, the thickness and the preheat.' } },
        { nl: 'Buiten het {t:Geldigheidsgebied|geldigheidsgebied} van de LMK is een nieuwe test nodig.', en: 'Outside the {t:Range of qualification|range of qualification} of the WPQR you need a new test.', cue: { Geldigheidsgebied: 'range' }, focus: ['range'], points: ['t2.1'],
          say: { nl: 'Dat bereik heet het {t:Geldigheidsgebied|geldigheidsgebied}. Ga je erbuiten, dan moet er een nieuwe test komen.', en: 'That range is the {t:Range of qualification|range of qualification}. Step outside it and you need a new test.' } },
        { nl: 'ISO 15614-1 (2017): meerlagig tot twee keer de proefdikte, dus {n:12} mm dekt {n:3} tot {n:24} mm.', en: 'ISO 15614-1 (2017): multi-pass covers up to twice the test thickness, so {n:12} mm covers {n:3} to {n:24} mm.', focus: ['range'], points: ['t2.2'],
          say: { nl: 'Voorbeelden uit ISO 15614-1 uit 2017. Een stompe proeflas in meerdere lagen dekt tot twee keer de proefdikte. Een plaat van {n:12} millimeter dekt {n:3} tot {n:24} millimeter.', en: 'Examples from ISO 15614-1 from 2017. A butt test weld in several passes covers up to twice the test thickness. A plate of {n:12} millimetres covers {n:3} to {n:24} millimetres.' } },
        { nl: 'Met kerfslageisen mag de warmte-inbreng tot {n:25}% boven de test, met hardheidseisen tot {n:25}% eronder.', en: 'With impact requirements heat input may go {n:25}% above the test; with hardness requirements {n:25}% below.', focus: ['range'], points: ['t2.2'],
          say: { nl: 'Zijn er kerfslageisen, dan mag de warmte-inbreng tot {n:25} procent boven de test. Met hardheidseisen mag hij tot {n:25} procent eronder.', en: 'With impact requirements, heat input may go up to {n:25} percent above the test. With hardness requirements, down to {n:25} percent below.' } },
      ],
    },
    {
      id: 's3', lesson: L3, level: 3, still: 0.9, title: { nl: 'De lasser', en: 'The welder' },
      beats: [
        { nl: 'Een lasser wordt apart gekwalificeerd volgens {t:ISO 9606-1|ISO 9606-1}: per proces, materiaal, positie en dikte.', en: 'A welder is qualified separately to {t:ISO 9606-1|ISO 9606-1}: per process, material, position and thickness.', cue: { 'ISO 9606-1': 'iso' }, focus: ['iso'], points: ['t3.1'],
          say: { nl: 'De lasser wordt apart gekwalificeerd volgens {t:ISO 9606-1|ISO 9606-1}. Dat geldt per proces, per materiaalgroep en per plaat of pijp. Verder per positie en per diktebereik.', en: 'The welder is qualified separately, to {t:ISO 9606-1|ISO 9606-1}. That is per process, per material group and per plate or pipe. Further per position and per thickness range.' } },
        { nl: 'Het certificaat blijft geldig binnen dat bereik: elke zes maanden bevestigt de werkgever of examinator dat.', en: 'The certificate stays valid within that range: every six months the employer or examiner confirms it.', focus: ['iso'], points: ['t3.1'],
          say: { nl: 'Het certificaat blijft alleen geldig als hij binnen dat bereik blijft lassen. Elke zes maanden bevestigt de werkgever of de examinator dat.', en: 'The certificate stays valid only if he keeps welding within that range. Every six months the employer or the examiner confirms it.' } },
        { nl: 'Ligt hij langer dan zes maanden stil, dan vervalt het; om de twee of drie jaar volgt een verlenging.', en: 'If he stops for more than six months it lapses; every two or three years it is revalidated.', focus: ['iso'], points: ['t3.1'],
          say: { nl: 'Ligt hij langer dan zes maanden stil, dan vervalt het. Om de twee of drie jaar volgt een verlenging, afhankelijk van de gekozen route.', en: 'If he stops for more than six months, it lapses. Every two or three years it is revalidated, depending on the route chosen.' } },
        { nl: 'Wie een lasrobot bedient is lasoperator en wordt gekwalificeerd volgens ISO 14732.', en: 'Whoever runs a welding robot is a welding operator, qualified to ISO 14732.', focus: ['card'], points: ['t3.2'],
          say: { nl: 'Wie een lasrobot bedient, is een lasoperator. Die wordt gekwalificeerd volgens ISO 14732.', en: 'Whoever runs a welding robot is a welding operator. That person is qualified to ISO 14732.' } },
      ],
    },
    {
      id: 's4', lesson: L3, level: 3, still: 0.9, title: { nl: 'De lascoördinator', en: 'The welding coordinator' },
      beats: [
        { nl: 'De {t:Lascoördinator|lascoördinator} regelt het papierwerk (ISO 14731): welke LMB, lasser en materialen.', en: 'The {t:Welding coordinator|welding coordinator} handles the paperwork (ISO 14731): which WPS, welder and materials.', cue: { Lascoördinator: 'coord' }, focus: ['coord'], points: ['t4.1'],
          say: { nl: 'De {t:Lascoördinator|lascoördinator}, volgens ISO 14731, is verantwoordelijk voor dit papierwerk. Welke LMB bij welke las hoort. Welke lasser welke las mag maken. En welk materiaal en toevoegmateriaal er op de vloer ligt.', en: 'The {t:Welding coordinator|welding coordinator}, to ISO 14731, is responsible for this paperwork. Which WPS belongs to which weld. Which welder may make which weld. And which material and filler are on the floor.' } },
        { nl: 'Onder EN 1090-2 verplicht vanaf EXC2, de tweede van vier strengheidsklassen voor staalconstructies.', en: 'Under EN 1090-2 required from EXC2, the second of four strictness classes for steel structures.', focus: ['coord'], points: ['t4.1'],
          say: { nl: 'Onder EN 1090-2 is een lascoördinator verplicht vanaf uitvoeringsklasse EXC2. Dat is de tweede van vier strengheidsklassen voor staalconstructies.', en: 'Under EN 1090-2 a welding coordinator is required from execution class EXC2. That is the second of four strictness classes for steel structures.' } },
        { nl: 'Een goed ogende las zonder LMB of geldig certificaat kan bij een audit worden afgekeurd.', en: 'A good-looking weld without a WPS or valid certificate can be rejected in an audit.', focus: ['coord'], points: ['t4.2'],
          say: { nl: 'Een las die er goed uitziet maar niet gedekt is door een LMB of een geldig certificaat, kan bij een audit worden afgekeurd.', en: 'A weld that looks good but is not covered by a WPS or a valid certificate can be rejected in an audit.' } },
        { nl: 'Vraag dus: welke LMB hoort bij deze las, welke LMK zit erachter, en wie mag hem maken?', en: 'So ask: which WPS goes with this weld, which WPQR is behind it, and who may make it?', focus: ['coord'], points: ['t4.2'],
          say: { nl: 'Vraag dus welke LMB bij deze las hoort. Welke LMK erachter zit. En wie hem mag maken.', en: 'So ask which WPS goes with this weld. Which WPQR is behind it. And who may make it.' } },
      ],
    },
    {
      id: 's5', lesson: L3, level: 3, still: 0.9, title: { nl: 'Voorbeeld: 22 mm op 1,6', en: 'Example: 22 mm at 1.6' },
      beats: [
        { nl: 'Een LMK op een proefplaat van {n:12} mm S355, het gangbare constructiestaal, MAG, op {n:1.2} kJ/mm.', en: 'A WPQR on a {n:12} mm S355 test plate, the common structural steel, MAG, at {n:1.2} kJ/mm.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een LMK is gemaakt op een proefplaat van {n:12} millimeter S355, het gangbare constructiestaal. Het was MAG, met een gemeten warmte-inbreng van {n:1.2} kilojoule per millimeter.', en: 'A WPQR was made on a {n:12} millimetre test plate of S355, the common structural steel. It was MAG, with a measured heat input of {n:1.2} kilojoules per millimetre.' } },
        { nl: 'De klant eist kerfslagwaarden bij −{n:20} °C. Nieuwe order: {n:22} mm; de lassers willen {n:1.6} kJ/mm.', en: 'The customer needs impact values at −{n:20} °C. New order: {n:22} mm; the welders want {n:1.6} kJ/mm.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'De klant eist kerfslagwaarden bij min {n:20} graden. Dat is de taaiheid, gemeten door gekerfde proefstaafjes stuk te slaan. Een nieuwe order vraagt platen van {n:22} millimeter. De lassers willen op {n:1.6} kilojoule per millimeter lassen, om minder lagen te hoeven leggen.', en: 'The customer demands impact values at minus {n:20} degrees. That is toughness, measured by breaking notched test bars. A new order asks for plate of {n:22} millimetres. The welders want to run at {n:1.6} kilojoules per millimetre, to lay fewer passes.' } },
        { nl: 'Dikte: het bereik is {n:3} tot 2 × {n:12} = {n:24} mm. De {n:22} mm is gedekt.', en: 'Thickness: the range is {n:3} to 2 × {n:12} = {n:24} mm. The {n:22} mm is covered.', focus: ['range'], points: ['ex.text.2'],
          say: { nl: 'Eerst de dikte. Het bereik is {n:3} tot twee maal {n:12}, dus {n:24} millimeter. De {n:22} millimeter is gedekt.', en: 'First the thickness. The range is {n:3} to two times {n:12}, so {n:24} millimetres. The {n:22} millimetres is covered.' } },
        { nl: 'Warmte-inbreng: met kerfslageisen mag je tot {n:25}% boven de test.', en: 'Heat input: with impact requirements you may go up to {n:25}% above the test.', focus: ['range'], points: ['ex.text.3'],
          say: { nl: 'Dan de warmte-inbreng. Met kerfslageisen mag je tot {n:25} procent boven de test.', en: 'Then the heat input. With impact requirements you may go up to {n:25} percent above the test.' } },
        { nl: 'Is {n:1.6} kJ/mm gedekt, en wat zijn de opties?', en: 'Is {n:1.6} kJ/mm covered, and what are the options?', focus: ['range'], points: ['ex.ask'],
          say: { nl: 'Is {n:1.6} kilojoule per millimeter gedekt? En wat zijn de opties?', en: 'Is {n:1.6} kilojoules per millimetre covered? And what are the options?' } },
        { nl: 'Nee. De bovengrens is {n:1.2} × {n:1.25} = {n:1.5} kJ/mm, en {n:1.6} valt erbuiten.', en: 'No. The upper limit is {n:1.2} × {n:1.25} = {n:1.5} kJ/mm, and {n:1.6} is outside it.', focus: ['range'], points: ['ex.reveal.1'],
          say: { nl: 'Nee. De bovengrens is {n:1.2} maal {n:1.25}, dus {n:1.5} kilojoule per millimeter. En {n:1.6} valt erbuiten.', en: 'No. The upper limit is {n:1.2} times {n:1.25}, so {n:1.5} kilojoules per millimetre. And {n:1.6} is outside it.' } },
        { nl: 'Optie één: binnen {n:1.5} kJ/mm lassen. Optie twee: een nieuwe LMK op hogere warmte-inbreng.', en: 'Option one: weld within {n:1.5} kJ/mm. Option two: a new WPQR at higher heat input.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'Optie één is lassen binnen {n:1.5} kilojoule per millimeter, met een lagenplan dat daar past. Optie twee is een nieuwe LMK op hogere warmte-inbreng, met een proefplaat en labtests die weken kosten.', en: 'Option one is to weld within {n:1.5} kilojoules per millimetre, with a pass plan that fits. Option two is a new WPQR at higher heat input, with a test plate and lab tests that take weeks.' } },
        { nl: 'De keuze hangt af van hoeveel lagen het scheelt en hoe snel de order moet starten.', en: 'The choice depends on how many passes it saves and how soon the order must start.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'De keuze hangt af van hoeveel lagen het scheelt en hoe snel de order moet starten.', en: 'The choice depends on how many passes it saves and how soon the order must start.' } },
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

// ---------------------------------------------------------------- cameras (the weld lies behind the scrim; one slow move per scene)
const CAM = [0, 1, 2, 3, 4].map(() => ({ from: cam([0, -6, 22], 420), to: cam([-10, -6, 22], 380) }));

// ---------------------------------------------------------------- page
const world = worldOf({ source: false, bottle: false, mag: false });
const hud = [hudParts.scrim, hudParts.docs, hudParts.card].join('');
const svg = svgOf(world, hud);
let script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een gelaste naad op een lastafel, achter een licht scherm; ervoor de papieren van een las: de lasmethode, het testbewijs, het certificaat van de lasser en de lascoördinator, en balken met het geldigheidsgebied.',
  en: 'A finished weld on a welding table, behind a light screen; in front the papers of a weld: the procedure, the test proof, the welder’s certificate and the welding coordinator, and bars with the range of qualification.',
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

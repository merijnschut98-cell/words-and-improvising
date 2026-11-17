// Dev tool, not shipped. Builds the lesson film "Wat warmte met het staal doet / What heat does to steel" for the lesson
// eng.joining.metallurgy (level 4 of the topic Booglassen of Lassen en verbinden). Task 17, batch B1: one of the four
// films the old film "Van boog tot scheur" was split into; the bench, its drawing and the stage library are those of
// films/eng.joining.arc (room.mjs, stage-lib.js), imported, not copied.
//
//   node films/eng.joining.metallurgy/build.mjs            build the page
//   node films/eng.joining.metallurgy/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.metallurgy.html. The film carries every point of the lesson (points:
// on the beats): t8/5 and martensite, the carbon equivalent, the hydrogen crack and its hold time, austenitic stainless
// steel, aluminium, and the worked example of the crane flanges (CEV 0,46).
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { worldOf, hudParts, svgOf, C, cam, css, stageScriptOf, beatTimes, beatTimesOf, k } from '../eng.joining.arc/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.joining.metallurgy';
const L4 = 'eng.joining.metallurgy';

const spec = {
  id: ID,
  title: { nl: 'Wat warmte met het staal doet', en: 'What heat does to steel' },
  lessons: [L4],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5'], stageFns: ['cooling', 'hydrogen', 'stainless', 'aluminium', 'flange', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L4, level: 4, still: 0.8, title: { nl: 'Afkoelen', en: 'Cooling' },
      beats: [
        { nl: 'De WBZ naast de las wordt in seconden heet en koelt dan af. Hoe snel, bepaalt wat je krijgt.', en: 'The HAZ beside the weld gets hot in seconds, then cools. How fast decides what you get.', focus: ['haz'], points: ['t1.1'],
          say: { nl: 'Het staal naast de las is de WBZ, de warmtebeïnvloede zone. Dat wordt in seconden heet en koelt dan af. Hoe snel, bepaalt wat je krijgt.', en: 'The steel next to the weld is the HAZ, the heat-affected zone. It gets hot in seconds and then cools. How fast decides what you get.' } },
        { nl: 'Engineers meten dat met {t:t8/5|t8/5}: de tijd in seconden van {n:800} naar {n:500} °C.', en: 'Engineers measure it with {t:t8/5|t8/5}: the time in seconds from {n:800} to {n:500} °C.', cue: { 't8/5': 't85' }, focus: ['t85'], points: ['t1.1'],
          say: { nl: 'Engineers meten dat met {t:t8/5|t8/5}. Dat is de tijd in seconden waarin de las afkoelt van {n:800} naar {n:500} graden.', en: 'Engineers measure it with {t:t8/5|t8/5}. That is the time in seconds the weld takes to cool from {n:800} to {n:500} degrees.' } },
        { nl: 'Is t8/5 kort, dan vormt zich {t:Martensiet|martensiet}: hard, bros staal dat makkelijk scheurt.', en: 'If t8/5 is short, {t:Martensite|martensite} forms: hard, brittle steel that cracks easily.', cue: { Martensiet: 'mart' }, focus: ['mart'], points: ['t1.2'],
          say: { nl: 'Is t8/5 kort, dan vormt zich {t:Martensiet|martensiet}. Dat is een hard, bros soort staal dat makkelijk scheurt.', en: 'If t8/5 is short, {t:Martensite|martensite} forms. That is a hard, brittle kind of steel that cracks easily.' } },
        { nl: 'Is t8/5 heel lang, dan wordt de WBZ zacht en verliest hij taaiheid.', en: 'If t8/5 is very long, the HAZ goes soft and loses toughness.', focus: ['card'], points: ['t1.2'],
          say: { nl: 'Is t8/5 heel lang, dan wordt de WBZ zacht en verliest hij taaiheid.', en: 'If t8/5 is very long, the HAZ goes soft and loses toughness.' } },
        { nl: 'Meer warmte-inbreng en voorwarmen verlengen t8/5. Dikke plaat verkort hem: de massa trekt warmte weg.', en: 'More heat input and preheating lengthen t8/5. Thick plate shortens it: the mass draws the heat away.', focus: ['card'], points: ['t1.2'],
          say: { nl: 'Meer warmte-inbreng en voorwarmen verlengen t8/5. Dikke plaat verkort hem, omdat de massa de warmte wegtrekt.', en: 'More heat input and preheating lengthen t8/5. Thick plate shortens it, because the mass draws the heat away.' } },
      ],
    },
    {
      id: 's2', lesson: L4, level: 4, still: 0.9, title: { nl: 'Koolstofequivalent en waterstof', en: 'Carbon equivalent and hydrogen' },
      beats: [
        { nl: 'Het {t:Koolstofequivalent|koolstofequivalent}: CEV = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15.', en: 'The {t:Carbon equivalent|carbon equivalent}: CEV = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15.', cue: { Koolstofequivalent: 'card' }, focus: ['card'], points: ['t2.1'],
          say: { nl: 'Hoe snel een staal hard wordt, vat je samen in het {t:Koolstofequivalent|koolstofequivalent}, kortweg CEV. Je telt op. Eerst de koolstof. Dan het mangaan gedeeld door {n:6}. Dan chroom, molybdeen en vanadium samen gedeeld door {n:5}. En tot slot nikkel en koper samen gedeeld door {n:15}.', en: 'How quickly a steel hardens is summed up in the {t:Carbon equivalent|carbon equivalent}, CEV for short. You add up. First the carbon. Then the manganese divided by {n:6}. Then chromium, molybdenum and vanadium together divided by {n:5}. And finally nickel and copper together divided by {n:15}.' } },
        { nl: 'In procent, uit het materiaalcertificaat (EN 1011-2, methode A).', en: 'In percent, from the mill certificate (EN 1011-2, method A).', focus: ['card'], points: ['t2.1'],
          say: { nl: 'De gehalten lees je in procent van het materiaalcertificaat. De methode staat in EN 1011-2, methode A.', en: 'You read the contents in percent from the mill certificate. The method is in EN 1011-2, method A.' } },
        { nl: 'Een waterstofscheur heeft waterstof, een harde structuur en spanning tegelijk nodig.', en: 'A hydrogen crack needs hydrogen, a hard structure and stress at once.', focus: ['mart'], points: ['t2.2'],
          say: { nl: 'Een waterstofscheur heeft drie dingen tegelijk nodig. Waterstof, een harde structuur en spanning.', en: 'A hydrogen crack needs three things at once. Hydrogen, a hard structure and stress.' } },
        { nl: 'Haal er één weg, met droog toevoegmateriaal, voorwarmen of minder inklemming, en hij komt niet.', en: 'Remove one (dry low-hydrogen filler, preheat, less clamping) and it does not come.', focus: ['card'], points: ['t2.2'],
          say: { nl: 'Haal er één van weg en de scheur komt niet. Dat kan met droog waterstofarm toevoegmateriaal, met voorwarmen of met minder inklemming.', en: 'Remove one and the crack does not come. You can do that with dry low-hydrogen filler, with preheat or with less clamping.' } },
        { nl: 'Hij kan dagen later komen: de controle wacht vaak {n:16} tot {n:48} uur. EN 1011-2 bepaalt het voorwarmen.', en: 'It can come days later: testing waits {n:16} to {n:48} hours. EN 1011-2 sets the preheat.', focus: ['card'], points: ['t2.2'],
          say: { nl: 'De scheur kan dagen later komen. Daarom wacht de controle een wachttijd af, vaak {n:16} tot {n:48} uur. EN 1011-2 bepaalt het voorwarmen. Dat doet het uit CEV en dikte, waterstof en warmte-inbreng.', en: 'The crack can come days later. So testing waits out a hold time, often {n:16} to {n:48} hours. EN 1011-2 sets the preheat. It does that from CEV and thickness, hydrogen and heat input.' } },
      ],
    },
    {
      id: 's3', lesson: L4, level: 4, still: 0.9, title: { nl: 'Roestvast staal', en: 'Stainless steel' },
      beats: [
        { nl: 'Austenitisch rvs, zoals 304 en 316, wordt niet hard en kent geen waterstofscheuren.', en: 'Austenitic stainless steel, such as 304 and 316, does not harden and has no hydrogen cracking.', focus: ['card'], points: ['t3.1'],
          say: { nl: 'Austenitisch rvs, zoals 304 en 316, wordt niet hard. Het kent geen waterstofscheuren.', en: 'Austenitic stainless steel, such as 304 and 316, does not harden. It has no hydrogen cracking.' } },
        { nl: 'Het zet zo’n {n:40}% meer uit dan gewoon staal en geleidt warmte slecht: het trekt flink krom.', en: 'It expands about {n:40}% more than plain steel and conducts heat poorly: it distorts a lot.', focus: ['card'], points: ['t3.1'],
          say: { nl: 'Het zet wel zo’n {n:40} procent meer uit dan gewoon staal. En het geleidt warmte slecht, dus het trekt flink krom.', en: 'But it expands about {n:40} percent more than plain steel. And it conducts heat poorly, so it distorts a lot.' } },
        { nl: 'Houd de {t:Tussenlaagtemperatuur|tussenlaagtemperatuur} laag: vaak maximaal rond {n:150} °C.', en: 'Keep the {t:Interpass temperature|interpass temperature} low: a maximum around {n:150} °C is common.', cue: { Tussenlaagtemperatuur: 'interp' }, focus: ['interp'], points: ['t3.1'],
          say: { nl: 'Houd de {t:Tussenlaagtemperatuur|tussenlaagtemperatuur} laag. Dat is de temperatuur van de las vlak voordat de volgende laag erop gaat. Vaak geldt een maximum rond {n:150} graden.', en: 'Keep the {t:Interpass temperature|interpass temperature} low. That is the temperature of the weld just before the next pass goes on. A maximum around {n:150} degrees is common.' } },
        { nl: '{t:Aanloopkleuren|Aanloopkleuren} naast de las moeten eraf door beitsen of borstelen, anders roest het.', en: '{t:Heat tint|Heat tint} beside the weld must come off by pickling or brushing, or it rusts there.', cue: { Aanloopkleuren: 'tint' }, focus: ['tint'], points: ['t3.2'],
          say: { nl: 'De {t:Aanloopkleuren|aanloopkleuren}, de blauwe en bruine verkleuring naast de las, moeten eraf door beitsen of borstelen. Anders roest het daar. Pijp wordt aan de binnenkant met argon gespoeld.', en: 'The {t:Heat tint|heat tint}, the blue and brown colouring beside the weld, must come off by pickling or brushing. Otherwise it rusts there. Pipe is purged inside with argon.' } },
      ],
    },
    {
      id: 's4', lesson: L4, level: 4, still: 0.9, title: { nl: 'Aluminium', en: 'Aluminium' },
      beats: [
        { nl: 'Aluminium geleidt warmte goed; de oxidehuid smelt pas rond {n:2050} °C, het metaal rond {n:660} °C.', en: 'Aluminium conducts heat well; its oxide skin melts at about {n:2050} °C, the metal at {n:660} °C.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Aluminium geleidt warmte goed. Het heeft een oxidehuid die pas rond {n:2050} graden smelt, ver boven het metaal van {n:660} graden. Borstel en ontvet vlak voor het lassen. Vocht geeft poriën.', en: 'Aluminium conducts heat well. It has an oxide skin that only melts at about {n:2050} degrees, far above the metal at {n:660} degrees. Brush and degrease just before welding. Moisture gives pores.' } },
        { nl: 'Veredelde legeringen als 6082-T6 verliezen in de WBZ sterkte: ongeveer de helft van de vloeigrens.', en: 'Heat-treated alloys like 6082-T6 lose strength in the HAZ: about half the yield strength.', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Veredelde legeringen zoals 6082-T6 verliezen in de WBZ flink sterkte. Ontwerpers rekenen daar volgens Eurocode 9 met ongeveer de helft van de vloeigrens.', en: 'Heat-treated alloys such as 6082-T6 lose a lot of strength in the HAZ. Designers count on about half the yield strength there, per Eurocode 9.' } },
        { nl: 'Een extra las maakt het frame zwakker. Vraag: welke norm bepaalt het voorwarmen, en wie rekende het uit?', en: 'An extra weld makes the frame weaker. Ask: which standard sets the preheat, and who calculated it?', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Een extra las voor de zekerheid maakt een aluminium frame dus zwakker. Vraag bij elk lastig materiaal welke norm het voorwarmen bepaalt. En wie dat heeft uitgerekend.', en: 'An extra weld to be safe makes an aluminium frame weaker. For every difficult material ask which standard sets the preheat. And who calculated it.' } },
      ],
    },
    {
      id: 's5', lesson: L4, level: 4, still: 0.9, title: { nl: 'Voorbeeld: kraanflenzen', en: 'Example: crane flanges' },
      beats: [
        { nl: 'Kraanflenzen van {n:40} mm S355: C {n:0.17}%, Mn {n:1.50}%, Cr+Mo+V {n:0.10}%, Ni+Cu {n:0.30}%.', en: 'Crane flanges of {n:40} mm S355: C {n:0.17}%, Mn {n:1.50}%, Cr+Mo+V {n:0.10}%, Ni+Cu {n:0.30}%.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een kraanbouwer last ligger-flenzen van {n:40} millimeter S355. Het materiaalcertificaat geeft koolstof {n:0.17} procent en mangaan {n:1.50} procent. Chroom, molybdeen en vanadium samen {n:0.10} procent. Nikkel en koper samen {n:0.30} procent.', en: 'A crane builder welds beam flanges of {n:40} millimetres S355. The mill certificate gives carbon {n:0.17} percent and manganese {n:1.50} percent. Chromium, molybdenum and vanadium together {n:0.10} percent. Nickel and copper together {n:0.30} percent.' } },
        { nl: 'CEV = {n:0.17} + {n:1.50}/6 + {n:0.10}/5 + {n:0.30}/15.', en: 'CEV = {n:0.17} + {n:1.50}/6 + {n:0.10}/5 + {n:0.30}/15.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'De CEV is {n:0.17} plus {n:1.50} gedeeld door {n:6}, plus {n:0.10} gedeeld door {n:5}, plus {n:0.30} gedeeld door {n:15}.', en: 'The CEV is {n:0.17} plus {n:1.50} divided by {n:6}, plus {n:0.10} divided by {n:5}, plus {n:0.30} divided by {n:15}.' } },
        { nl: 'Wat is de CEV, en wat betekent dat voor deze dikke plaat?', en: 'What is the CEV, and what does it mean for this thick plate?', focus: ['card'], points: ['ex.ask'],
          say: { nl: 'Wat is de CEV, en wat betekent dat voor deze dikke plaat?', en: 'What is the CEV, and what does it mean for this thick plate?' } },
        { nl: 'CEV = {n:0.17} + {n:0.25} + {n:0.02} + {n:0.02} = {n:0.46}. Hoog voor S355: voorwarmen volgens EN 1011-2.', en: 'CEV = {n:0.17} + {n:0.25} + {n:0.02} + {n:0.02} = {n:0.46}. High for S355: preheat to EN 1011-2.', focus: ['cev'], points: ['ex.reveal.1'],
          say: { nl: 'De CEV is {n:0.17} plus {n:0.25} plus {n:0.02} plus {n:0.02}, dus {n:0.46}. Dat is hoog voor S355. Met {n:40} millimeter plaat vraagt EN 1011-2 vrijwel zeker voorwarmen.', en: 'The CEV is {n:0.17} plus {n:0.25} plus {n:0.02} plus {n:0.02}, so {n:0.46}. That is high for S355. With {n:40} millimetre plate EN 1011-2 will almost certainly call for preheat.' } },
        { nl: 'Voorwarmen kost branders, gas en tijd. Ruilen kan met waterstofarmere draad of meer warmte-inbreng.', en: 'Preheating costs burners, gas and time. You can trade: lower-hydrogen wire or more heat input.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'Voorwarmen kost branders, gas en tijd per ligger. EN 1011-2 laat je ruilen. Een waterstofarmere draad of een hogere warmte-inbreng binnen de LMB kan de voorwarmtemperatuur verlagen.', en: 'Preheating costs burners, gas and time per beam. EN 1011-2 lets you trade. A lower-hydrogen wire or a higher heat input within the WPS can lower the preheat temperature.' } },
        { nl: 'Vraag de lasingenieur de berekening te laten zien.', en: 'Ask the welding engineer to show the calculation.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'Vraag de lasingenieur de berekening te laten zien.', en: 'Ask the welding engineer to show the calculation.' } },
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
  { from: cam([C.XE, 0, 10], 300, [170, 120]), to: cam([C.XE, 0, 10], 240, [160, 110]) },
  { from: cam([C.XE, 0, 10], 300, [170, 120]), to: cam([C.XE, 0, 10], 240, [160, 110]) },
  { from: cam([60, 40, 60], 560, [150, 190]), to: cam([C.PIPE.weld, C.PIPE.y, 17], 200, [200, 190]), a: 0, b: 0.3 },
  { from: cam([0, -6, 22], 420), to: cam([-10, -6, 22], 380) },
  { from: cam([0, -6, 22], 420), to: cam([-10, -6, 22], 380) },
];

// ---------------------------------------------------------------- page
const world = worldOf({ source: false, bottle: false, mag: false, pipe: true });
const hud = [hudParts.scrim, hudParts.chart, hudParts.macro, hudParts.cev, hudParts.therm, hudParts.clock, hudParts.card].join('');
const svg = svgOf(world, hud);
let script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een lastafel met twee stalen platen en een gelaste naad en een rvs-pijp met aanloopkleuren; daarbij de doorsnede van de las met de warmtebeïnvloede zone, een afkoelkromme, een thermometer, een klok en kaarten met de getallen.',
  en: 'A welding table with two steel plates and a finished weld and a stainless pipe with heat tint; with the section of the weld and its heat-affected zone, a cooling curve, a thermometer, a clock and cards with the numbers.',
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

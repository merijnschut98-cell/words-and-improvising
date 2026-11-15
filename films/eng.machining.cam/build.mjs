// Dev tool, not shipped. Builds the lesson film "CAM, simulatie en proefdraaien / CAM, simulation and prove-out"
// for the lesson eng.machining.cam (level 4 of the CNC topic of Verspanen). Task 17, pilot P1: one of the four films
// the old film "Een CNC-programma loopt" was split into; the machine, its drawing and the stage library are those
// of films/eng.machining.cnc (room.mjs, stage-lib.js), imported, not copied.
//
//   node films/eng.machining.cam/build.mjs            build the page
//   node films/eng.machining.cam/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.machining.cam.html. The film carries every point of the lesson (points: on
// the beats): CAM and the toolpath, the post-processor, the simulation and its models, prove-out and its release,
// what a manager weighs, and the worked example of a 20.000 euro simulation licence.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { world, hudParts, P, W, H, C, g, cam, css, stageScriptOf, beatTimes, k } from '../eng.machining.cnc/room.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ID = 'eng.machining.cam';
const L4 = 'eng.machining.cam';

const spec = {
  id: ID,
  title: { nl: 'CAM, simulatie en proefdraaien', en: 'CAM, simulation and prove-out' },
  lessons: [L4],
  checkScope: { scenes: ['s1', 's2', 's3', 's4', 's5', 's6'], stageFns: ['backFlow', 'barsCard', 'simBig', 'render'] },
  scenes: [
    {
      id: 's1', lesson: L4, level: 4, still: 0.9, title: { nl: 'Van model tot programma', en: 'From model to program' },
      beats: [
        { nl: '{t:CAM|CAM} maakt van het 3D-model een {t:Gereedschapsbaan|gereedschapsbaan}: de route van het gereedschap.', en: '{t:CAM|CAM} turns the 3D model into a {t:Toolpath|toolpath}: the route of the tool.', cue: { CAM: 'cam', Gereedschapsbaan: 'path' }, focus: ['cam', 'path'], points: ['t1.1'],
          say: { nl: '{t:CAM|CAM}-software maakt van het 3D-model een {t:Gereedschapsbaan|gereedschapsbaan}. Dat is de route van het gereedschap, met voedingen en toerentallen.', en: '{t:CAM|CAM} software turns the 3D model into a {t:Toolpath|toolpath}. That is the route of the tool, with feeds and speeds.' } },
        { nl: 'De programmeur kiest de baan per vormelement: kamer, gat en vlak.', en: 'The programmer chooses the path feature by feature: pocket, hole and face.', focus: ['card'], points: ['t1.1'],
          say: { nl: 'De programmeur kiest de baan per vormelement. Een kamer krijgt een adaptieve voorbewerkingsbaan. Een gat krijgt een boorcyclus. Een vlak krijgt een nabewerkingssnede.', en: 'The programmer chooses the path feature by feature. A pocket gets an adaptive roughing path. A hole gets a drilling cycle. A face gets a finishing pass.' } },
        { nl: 'De {t:Postprocessor|postprocessor} vertaalt de baan naar de G-code van één machine en besturing.', en: 'The {t:Post-processor|post-processor} translates the path into the G-code of one machine and control.', cue: { Postprocessor: 'post' }, focus: ['post'], points: ['t1.2'],
          say: { nl: 'Daarna vertaalt een {t:Postprocessor|postprocessor} die baan naar het dialect van de G-code van één specifieke machine en besturing.', en: 'Then a {t:Post-processor|post-processor} translates that toolpath into the G-code dialect of one specific machine and control.' } },
        { nl: 'Zelfde onderdeel, twee machines: twee posts, twee programma’s.', en: 'Same part, two machines: two posts, two programs.', focus: ['card'], points: ['t1.2'],
          say: { nl: 'Zelfde onderdeel, twee machines. Dat betekent twee posts en twee programma’s.', en: 'Same part, two machines. That means two posts and two programs.' } },
        { nl: 'Een slechte post is een verborgen crashrisico in elk programma dat hij maakt.', en: 'A bad post is a hidden crash risk in every program it writes.', focus: ['card'], points: ['t1.2'],
          say: { nl: 'Een slechte post is een verborgen crashrisico in elk programma dat hij maakt.', en: 'A bad post is a hidden crash risk in every program it writes.' } },
      ],
    },
    {
      id: 's2', lesson: L4, level: 4, still: 0.9, title: { nl: 'Simulatie', en: 'Simulation' },
      beats: [
        { nl: 'Een {t:Simulatie|simulatie} draait de geposte G-code op een digitale kopie van de machine.', en: 'A {t:Simulation|simulation} runs the posted G-code on a digital copy of the machine.', cue: { Simulatie: 'sim' }, focus: ['sim'], points: ['t2.1'],
          say: { nl: 'Een {t:Simulatie|simulatie} draait de geposte G-code op een digitale kopie van de machine, met de mal, de houders en het ruwe werkstuk.', en: 'A {t:Simulation|simulation} runs the posted G-code on a digital copy of the machine, with the fixture, the holders and the raw part.' } },
        { nl: 'Je ziet botsingen, sneden in de klemmen en achtergebleven materiaal, voordat de echte machine het ziet.', en: 'You see collisions, cuts into clamps and material left behind, before the real machine sees it.', focus: ['sim'], points: ['t2.1'],
          say: { nl: 'Je ziet botsingen, sneden in de klemmen en achtergebleven materiaal. Dat gebeurt voordat de echte machine het programma ziet.', en: 'You see collisions, cuts into clamps and material left behind. That happens before the real machine sees the program.' } },
        { nl: 'Zo goed als zijn modellen: een mal {n:10} mm te laag getekend geeft een schone simulatie en een echte crash.', en: 'Only as good as its models: a fixture drawn {n:10} mm too low gives a clean simulation and a real crash.', focus: ['sim'], points: ['t2.2'],
          say: { nl: 'Hij is zo goed als zijn modellen. Een mal die {n:10} millimeter te laag getekend is, geeft een schone simulatie en een echte crash.', en: 'It is only as good as its models. A fixture drawn {n:10} mm too low gives a clean simulation and a real crash.' } },
        { nl: 'Vraag of de simulatie de echte G-code na de post draait, of alleen de CAM-baan.', en: 'Ask whether the simulation runs the real G-code after the post, or only the CAM path.', focus: ['card'], points: ['t2.2'],
          say: { nl: 'Vraag of de simulatie de echte G-code na de post draait, of alleen de CAM-baan.', en: 'Ask whether the simulation runs the real G-code after the post, or only the CAM path.' } },
      ],
    },
    {
      id: 's3', lesson: L4, level: 4, still: 0.9, title: { nl: 'Proefdraaien', en: 'Prove-out' },
      beats: [
        { nl: '{t:Proefdraaien|Proefdraaien} is de eerste echte run van een nieuw programma: regel voor regel.', en: '{t:Prove-out|Prove-out} is the first real run of a new program: single block.', cue: { Proefdraaien: 'prove' }, focus: ['prove'], points: ['t3.1'],
          say: { nl: '{t:Proefdraaien|Proefdraaien} is de eerste echte run van een nieuw programma. De machine loopt regel voor regel, in enkelregel. Ze stopt na elke regel.', en: '{t:Prove-out|Prove-out} is the first real run of a new program. The machine runs in single block, so it stops after every line.' } },
        { nl: 'De ijlgangen gaan langzamer, soms draait de machine eerst in de lucht.', en: 'Rapid moves are slowed down, sometimes cutting air first.', focus: ['prove'], points: ['t3.1'],
          say: { nl: 'De ijlgangen gaan langzamer. Soms draait de machine eerst in de lucht.', en: 'Rapid moves are slowed down. Sometimes the machine cuts air first.' } },
        { nl: 'Vrijgave na de eerste-stukcontrole: eerste stuk helemaal gemeten, programma vrijgegeven als beproefd.', en: 'Release after the first-off check: first part fully measured, program released as proven.', focus: ['gauge', 'card'], points: ['t3.1'],
          say: { nl: 'Dan volgt de vrijgave na de eerste-stukcontrole. Het eerste stuk is volledig gemeten, en het programma is vrijgegeven als beproefd.', en: 'Then comes the release after the first-off check. The first part is fully measured, and the program is released as proven.' } },
        { nl: 'Wijzigingen aan de machine moeten terug in CAM, anders begint de volgende herhaalorder met de oude fout.', en: 'Edits made at the machine must go back into CAM, or the next repeat order starts with the old error.', focus: ['card'], points: ['t3.1'],
          say: { nl: 'Wijzigingen aan de machine moeten terug in CAM. Anders begint de volgende herhaalorder met de oude fout.', en: 'Edits made at the machine must go back into CAM. Otherwise the next repeat order starts with the old error.' } },
        { nl: 'Goede bedrijven houden bij hoeveel uur proefdraaien een nieuw programma kost, en waarom.', en: 'Good shops track how many hours prove-out takes per new program, and why.', focus: ['card'], points: ['t3.2'],
          say: { nl: 'Goede bedrijven houden bij hoeveel uur proefdraaien een nieuw programma kost, en waarom.', en: 'Good shops track how many hours prove-out takes per new program, and why.' } },
        { nl: 'Dat laat zien of het programmeren de bottleneck is, of het vertrouwen erin.', en: 'That shows whether the bottleneck is the programming or the trust in it.', focus: ['card'], points: ['t3.2'],
          say: { nl: 'Dat laat zien of het programmeren de bottleneck is, of het vertrouwen erin.', en: 'That shows whether the bottleneck is the programming or the trust in it.' } },
      ],
    },
    {
      id: 's4', lesson: L4, level: 4, still: 0.9, title: { nl: 'Wat een manager afweegt', en: 'What a manager weighs' },
      beats: [
        { nl: 'Programmeertijd groeit met de complexiteit en het aantal nieuwe onderdelen.', en: 'Programming time grows with complexity and with the number of new parts.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Wat een manager afweegt. Programmeertijd groeit met de complexiteit en met het aantal nieuwe onderdelen.', en: 'What a manager weighs. Programming time grows with complexity and with the number of new parts.' } },
        { nl: 'Bij kleine series kan de programmeertijd groter zijn dan de machinetijd.', en: 'For small batches it can exceed the machine time.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Bij kleine series kan de programmeertijd groter zijn dan de machinetijd.', en: 'For small batches the programming time can exceed the machine time.' } },
        { nl: 'Hefbomen: sjablonen voor terugkerende vormen en een gevalideerde post per machine.', en: 'Levers: templates for recurring features and a validated post per machine.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Er zijn hefbomen. Sjablonen voor terugkerende vormen. En een gevalideerde post per machine.', en: 'There are levers. Templates for recurring features. And a validated post per machine.' } },
        { nl: 'Simulatie van de complete machine en een CAM-gereedschapsbibliotheek die klopt met het echte rek.', en: 'Full-machine simulation and a CAM tool library that matches the real tool rack.', focus: ['card'], points: ['t4.1'],
          say: { nl: 'Simulatie van de complete machine. En een gereedschapsbibliotheek in CAM die klopt met het echte gereedschapsrek.', en: 'Full-machine simulation. And a tool library in CAM that matches the real tool rack.' } },
        { nl: 'Geloofwaardige vraag: hoeveel uur proefdraaien per nieuw programma op de machine?', en: 'A credible question: how many hours of prove-out per new program?', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Geloofwaardige vragen. Hoeveel uur proefdraaien kost elk nieuw programma op de machine?', en: 'Credible questions. How many hours of prove-out does each new program take on the machine?' } },
        { nl: 'Hoeveel programma’s worden aan de machine gewijzigd en nooit teruggezet?', en: 'How many programs are edited at the machine and never fed back?', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Hoeveel programma’s worden aan de machine gewijzigd en nooit teruggezet?', en: 'How many programs are edited at the machine and never fed back?' } },
        { nl: 'Welke machine heeft een post die niemand vertrouwt?', en: 'Which machine has a post nobody trusts?', focus: ['card'], points: ['t4.2'],
          say: { nl: 'Welke machine heeft een post die niemand vertrouwt?', en: 'Which machine has a post nobody trusts?' } },
      ],
    },
    {
      id: 's5', lesson: L4, level: 4, still: 0.9, title: { nl: 'De case', en: 'The case' },
      beats: [
        { nl: 'Een loonbedrijf schrijft zo’n {n:150} nieuwe programma’s per jaar.', en: 'A job shop writes about {n:150} new programs a year.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Een loonbedrijf schrijft zo’n {n:150} nieuwe programma’s per jaar.', en: 'A job shop writes about {n:150} new programs a year.' } },
        { nl: 'CAM kost 4 uur per programma, de programmeur €{n:70} per uur.', en: 'CAM takes 4 hours per program, the programmer is €{n:70} an hour.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Nu kost CAM 4 uur per programma. De programmeur kost {n:70} euro per uur.', en: 'Today CAM takes 4 hours per program. The programmer costs {n:70} euros an hour.' } },
        { nl: 'Proefdraaien kost {n:2.5} uur, machine en insteller samen €{n:110} per uur.', en: 'Prove-out takes {n:2.5} hours, machine and setter together €{n:110} an hour.', focus: ['card'], points: ['ex.text.1'],
          say: { nl: 'Proefdraaien kost {n:2.5} uur op de machine. Machine en insteller samen kosten {n:110} euro per uur. Dit zijn de eigen cijfers van het bedrijf, als aanname.', en: 'Prove-out takes {n:2.5} hours on the machine. Machine and setter together cost {n:110} euros an hour. These are the shop’s own figures, stated as assumptions.' } },
        { nl: 'Voorstel: simulatiesoftware voor de complete machine, aangenomen €{n:20000} per jaar.', en: 'Proposal: full-machine simulation software at an assumed €{n:20000} a year.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'Het voorstel is simulatiesoftware voor de complete machine. Aangenomen is {n:20000} euro per jaar, inclusief ondersteuning.', en: 'The proposal is full-machine simulation software. An assumed {n:20000} euros a year, including support.' } },
        { nl: 'Proefdraaien gaat naar 1 uur, de CAM-tijd stijgt {n:0.25} uur om de simulatie te draaien.', en: 'Prove-out drops to 1 hour, CAM time rises by {n:0.25} hours to run the simulation.', focus: ['card'], points: ['ex.text.2'],
          say: { nl: 'Het bedrijf verwacht dat proefdraaien naar 1 uur gaat. De CAM-tijd stijgt dan {n:0.25} uur om de simulatie te draaien.', en: 'The shop expects prove-out to drop to 1 hour. CAM time then rises by {n:0.25} hours to run the simulation.' } },
        { nl: 'Wat bespaart het per jaar, na aftrek van de extra programmeertijd, en is het de €{n:20000} waard?', en: 'What does it save a year, net of the extra programming time, and is it worth the €{n:20000}?', focus: ['card'], points: ['ex.ask'],
          say: { nl: 'Wat bespaart het per jaar, na aftrek van de extra programmeertijd? En is het de {n:20000} euro waard?', en: 'What does it save a year, net of the extra programming time? And is it worth the {n:20000} euros?' } },
      ],
    },
    {
      id: 's6', lesson: L4, level: 4, still: 0.9, title: { nl: 'Het antwoord', en: 'The answer' },
      beats: [
        { nl: 'Machine: {n:1.5} uur × {n:150} × €{n:110} = €{n:24750} bespaard.', en: 'Machine: {n:1.5} hours × {n:150} × €{n:110} = €{n:24750} saved.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'De machine bespaart {n:1.5} uur maal {n:150} maal {n:110} euro. Dat is {n:24750} euro.', en: 'The machine saves {n:1.5} hours times {n:150} times {n:110} euros. That is {n:24750} euros.' } },
        { nl: 'Programmeur: {n:0.25} × {n:150} × €{n:70} = €{n:2625} extra.', en: 'Programmer: {n:0.25} × {n:150} × €{n:70} = €{n:2625} extra.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'De programmeur kost {n:0.25} uur maal {n:150} maal {n:70} euro extra. Dat is {n:2625} euro.', en: 'The programmer costs {n:0.25} hours times {n:150} times {n:70} euros extra. That is {n:2625} euros.' } },
        { nl: 'Netto €{n:22125} per jaar tegen €{n:20000}: op uren alleen maar €{n:2125} in de plus.', en: 'Net €{n:22125} a year against €{n:20000}: only €{n:2125} ahead on hours alone.', focus: ['card'], points: ['ex.reveal.1'],
          say: { nl: 'Netto is dat {n:22125} euro per jaar, tegen {n:20000} euro. Op uren alleen is dat maar {n:2125} euro in de plus.', en: 'Net that is {n:22125} euros a year, against {n:20000} euros. On hours alone that is only {n:2125} euros ahead.' } },
        { nl: 'De case rust op twee dingen: de crashes die het voorkomt en de {n:225} machine-uren die vrijkomen.', en: 'The case rests on two things: the crashes it prevents and the {n:225} machine hours it frees.', focus: ['card'], points: ['ex.reveal.2'],
          say: { nl: 'De case rust dus op twee andere dingen. De crashes die het voorkomt. En de {n:225} machine-uren die vrijkomen, {n:1.5} maal {n:150}.', en: 'So the case rests on two other things. The crashes it prevents. And the {n:225} machine hours it frees, {n:1.5} times {n:150}.' } },
        { nl: 'Die uren tellen alleen als er werk voor is. Vraag naar de crashkosten van vorig jaar voordat je beslist.', en: 'Those hours only count if there is work for them. Ask for last year’s crash cost before deciding.', focus: ['card'], points: ['ex.reveal.2'],
          say: { nl: 'Die uren tellen alleen als er werk voor is. Vraag naar de crashkosten van vorig jaar voordat je beslist.', en: 'Those hours only count if there is work for them. Ask for last year’s crash cost before deciding.' } },
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
  { from: cam([20, 0, 160], 520, -190), to: cam([-30, 0, 150], 520, -150) },
  { from: cam([20, 0, 160], 520, -190), to: cam([-30, 0, 150], 520, -150) },
  { from: cam([0, 0, 140], 330, 0, 60), to: cam([0, 0, 125], 290, 0, 60) },
  { from: cam([0, 0, 200], 640, 0), to: cam([0, 0, 190], 620, 0) },
  { from: cam([0, 0, 200], 640, 0), to: cam([0, 0, 190], 620, 0) },
  { from: cam([0, 0, 200], 640, 0), to: cam([0, 0, 190], 620, 0) },
];

const hud = [hudParts.sbk, hudParts.cam, hudParts.card].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;
const script = stageScriptOf(join(HERE, 'stage.js'), { cams: CAM });
const label = {
  nl: 'Een verticaal bewerkingscentrum met een bankschroef en een stalen plaat en een bedieningspaneel. Naast de machine een CAM-scherm met gereedschapsbaan, post en simulatie, en kaarten met berekeningen.',
  en: 'A vertical machining centre with a vice and a steel plate and a control panel. Beside the machine a CAM screen with toolpath, post and simulation, and cards with calculations.',
};

const { data } = await defineFilm(spec, { svg, script, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  console.log('beat starts (nl):', C.B.map((b) => b.map((x) => x.toFixed(2)).join(' ')).join(' | '));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}

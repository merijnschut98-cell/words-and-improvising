// The pure parts of the explainer films: the player kit's timeline (films/_kit)
// and the app side of the film frame (src/ui/film.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  wordsOf, minSceneDur, parseMarked, formatNumber, speakOf, plainOf, timelineOf, sceneIndexAt,
  clampScene, beatStarts, beatIndexAt, holdLimit, parseParams, fmtClock, ease, span, searchOf, stageU,
} from '../films/_kit/timeline.mjs';
import { parseFilmRef, filmSrc, filmMessage, filmBridge, mutedPref, loadFilm } from '../src/ui/film.js';

test('reading pace: a scene lasts at least words / 2.5 + 2 seconds', () => {
  assert.equal(wordsOf('  De snijsnelheid is  hoe snel '), 5);
  assert.equal(wordsOf(''), 0);
  assert.equal(minSceneDur(10), 6);
  assert.equal(minSceneDur(25), 12);
});

test('marked captions: terms, terms with shown text, numbers', () => {
  assert.deepEqual(parseMarked('De {t:Snijsnelheid} is {n:220} m/min.'), [
    { text: 'De ' }, { term: 'Snijsnelheid', shown: 'Snijsnelheid' }, { text: ' is ' }, { num: '220' }, { text: ' m/min.' },
  ]);
  assert.deepEqual(parseMarked('{t:Toerental|toeren}'), [{ term: 'Toerental', shown: 'toeren' }]);
  assert.throws(() => parseMarked('a {x:b} c'), /marker/);
  assert.throws(() => parseMarked('a {t:b c'), /marker/);
});

test('numbers per language: Dutch 1.167 and 0,3; English 1,167 and 0.3; decimals kept', () => {
  assert.equal(formatNumber('1167', 'nl'), '1.167');
  assert.equal(formatNumber('1167', 'en'), '1,167');
  assert.equal(formatNumber('0.3', 'nl'), '0,3');
  assert.equal(formatNumber('0.3', 'en'), '0.3');
  assert.equal(formatNumber('8.67', 'nl'), '8,67');
  assert.equal(formatNumber('6.0', 'nl'), '6,0');
  assert.equal(formatNumber('200000', 'nl'), '200.000');
  assert.equal(formatNumber('350', 'en'), '350');
  assert.throws(() => formatNumber('1,2', 'nl'), /number/);
});

test('speak variant: the English words in parentheses are not spoken', () => {
  const seg = ['De ', { t: 'snijsnelheid', en: 'cutting speed', c: 'vc' }, ' is hoog.'];
  assert.equal(plainOf(seg), 'De snijsnelheid (cutting speed) is hoog.');
  assert.equal(speakOf(seg), 'De snijsnelheid is hoog.');
  assert.equal(speakOf(['Ø60 at ', { t: 'cutting speed', c: 'vc' }]), 'Ø60 at cutting speed');
});

// A voice reads "omw/min" as letters and a slash, and skips Ø and µ: with a
// language, the speak variant says units and signs as words.
test('speak variant: units and signs are said as words, per language', () => {
  const nl = (s) => speakOf([s], 'nl');
  const en = (s) => speakOf([s], 'en');
  assert.equal(nl('bij Ø60 en 220 m/min draait de spil 1.167 omw/min.'), 'bij diameter 60 en 220 meter per minuut draait de spil 11honderd 67 omwentelingen per minuut.');
  assert.equal(en('at Ø60 and 220 m/min the spindle turns at 1,167 rpm.'), 'at diameter 60 and 220 metres per minute the spindle turns at 1,167 revolutions per minute.');
  assert.equal(nl('0,3 × 1.167 = 350 mm/min'), '0,3 maal 11honderd 67 is 350 millimeter per minuut');
  assert.equal(en('0.3 × 1,167 = 350 mm/min'), '0.3 times 1,167 is 350 millimetres per minute');
  assert.equal(nl('160 / 20 = 8 × D.'), '160 gedeeld door 20 is 8 maal D.');
  assert.equal(en('Above 6 × D'), 'Above 6 times D');
  assert.equal(nl('Ra 0,77 µm, zes gaten op 60°.'), 'R a 0,77 micrometer, zes gaten op 60 graden.');
  assert.equal(en('Ra 0.77 µm, six holes at 60°.'), 'R a 0.77 micrometres, six holes at 60 degrees.');
  // words that merely contain the letters stay as they are
  assert.equal(nl('Rand en rpmx en Radius'), 'Rand en rpmx en Radius');
});

// espeak-ng reads governance the Dutch way ("goo-ver-nan-se"), MUM-effect as
// letters, keep with a long e and stresses ESkalatieroute: Dutch only, the
// English voice keeps them (pm.run.escalation)
test('speak variant: governance, MUM-effect, keep mum and escalatieroute in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Dat is governance: één A4.'), 'Dat is gavvernens: één A4.');
  assert.equal(nl('Governance is'), 'Gavvernens is');
  assert.equal(nl('het MUM-effect, van keep mum, zwijgen'), 'het mum-effect, van kiep mum, zwijgen');
  assert.equal(nl('een escalatieroute af. Escalatieroutes'), 'een escalatie-route af. Escalatie-routes');
  const en = 'governance, the MUM effect, keep mum, an escalation path';
  assert.equal(speakOf([en], 'en'), en);
});

// espeak-ng reads agile the Dutch way ("AA-gie-le") and stresses HYbride: said
// as the floor says them, "etsjail" and "hiebriede"; Dutch only, and the
// moulding film's "hybride machine" (rendered video) keeps its voice
// (pm.plan.method)
test('speak variant: agile and hybride in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Agile: korte rondes. Het Agile Manifesto, een agile methode.'), 'Etsjail: korte rondes. Het Etsjail Manifesto, een etsjail methode.');
  assert.equal(nl('De meeste projecten zijn hybride: mijlpalen. Hybride'), 'De meeste projecten zijn hiebriede: mijl-palen. Hiebriede');
  assert.equal(nl('Een hybride machine combineert beide'), 'Een hybride machine combineert beide');
  assert.equal(nl('agileren, hybrides'), 'agileren, hybrides');
  const en = 'Agile, the Agile Manifesto, hybrid';
  assert.equal(speakOf([en], 'en'), en);
});

// espeak-ng reads Kahneman with a sounded h, Flyvbjerg as "flif-bjerg",
// stresses REferentieklasse (with "ti" for
// "tsie"), drops the s of cijfer in basiscijfer ("basis-eifer") and reads the
// IT-lead as "lee-ad", and stresses OPtimistisch and VOORspelling: said
// Kaaneman, Fluubjerg, referentie-klasse, basis-cijfer, IT-lied,
// op-timistisch (not in pm.plan.wbs's "optimistisch, meest waarschijnlijk")
// and voor-spelling; Dutch only (pm.outside.questions). Gardner gets no rule
// (espeak-ng has no hard g; the film keeps the name on the card)
test('speak variant: Kahneman, Flyvbjerg, referentieklasse, basiscijfer, IT-lead, optimistisch and voorspelling in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Kahneman en Flyvbjerg; Flyvbjerg en Gardner.'), 'Kaaneman en Fluubjerg; Fluubjerg en Gardner.');
  assert.equal(nl('Een referentieklasse, twee referentieklassen. Referentieklasse:'), 'Een referentie-klasse, twee referentie-klassen. Referentie-klasse:');
  assert.equal(nl("Zo'n basiscijfer, basiscijfers"), "Zo'n basis-cijfer, basis-cijfers");
  assert.equal(nl('met de IT-lead en de leverancier'), 'met de IT-lied en de leverancier');
  assert.equal(nl('toe aan optimistisch en pessimistisch: optimistisch, plus vier; optimistisch 6 weken, de optimistische kant'),
    'toe aan op-timistisch en pessimistisch: op-timistisch, plus vier; op-timistisch 6 weken, de op-timistische kant');
  assert.equal(nl('Een driepuntsschatting: optimistisch, meest waarschijnlijk'), 'Een driepuntsschatting: optimistisch, meest waarschijnlijk');
  assert.equal(nl('een voorspelling, Voorspelling'), 'een voor-spelling, Voor-spelling');
  assert.equal(nl('de referentie, een basis, de IT-afdeling'), 'de referentie, een basis, de IT-afdeling');
  const en = 'Kahneman and Flyvbjerg, Flyvbjerg and Gardner, a reference class, a base rate, the IT lead, optimistic, a forecast';
  assert.equal(speakOf([en], 'en'), en);
});

// Seeing progress without the expertise (pm.outside.steering): espeak-ng reads
// definition of done as "dee-fie-nie-SJON of doo-ne" (said deffi-nisjun of dun;
// not in pm.plan.wbs's caption "definition of done: klaar als", which keeps its
// voice), FAT and SAT as the words "fat" and "sat" (said as letters), stresses
// FABrieksacceptatietest and LOcatieacceptatietest with "ti" for "tsie" (split
// at the heads), and reads Jeffrey Pfeffer with a stressed -REY and a sounded p
// (said Djeffri Feffer); Dutch only
test('speak variant: definition of done, FAT, SAT, the acceptance tests and Jeffrey Pfeffer in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De definition of done is een checklist. Definition of done:'), 'De deffi-nisjun of dun is een checklist. Deffi-nisjun of dun:');
  assert.equal(nl('Werkwoord, eigenaar en een definition of done: klaar als de planningsmanager akkoord is.'),
    'Werkwoord, eigenaar en een definition of done: klaar als de planningsmanager akkoord is.');
  assert.equal(nl('De FAT bij de leverancier, de SAT op locatie; een FAT.'), 'De F A T bij de leverancier, de S A T op locatie; een F A T.');
  assert.equal(nl('de fabrieksacceptatietest en de locatieacceptatietest, Fabrieksacceptatietest'),
    'de fabrieks-acceptatie-test en de locatie-acceptatie-test, Fabrieks-acceptatie-test');
  assert.equal(nl('De 7 Rules of Power van Jeffrey Pfeffer'), 'De 7 Rules of Power van Djeffri Feffer');
  assert.equal(nl('een fat budget, de SATELLIET, de fabriek, de locatie'), 'een fat budget, de SATELLIET, de fabriek, de locatie');
  const en = 'The definition of done, the FAT and the SAT, a factory acceptance test, Jeffrey Pfeffer';
  assert.equal(speakOf([en], 'en'), en);
});

// Testing plans, translating jargon (pm.outside.jargon): espeak-ng stresses
// PREmortem (said pree-mortem), reads single point of failure as "poo-int of
// fa-LU-re" (said singel pojnt of feeljer), stresses beheersmaatreGEL and
// nachtDIENST and reads barcodescanners as "barcoo-des-kanners" (said barkoodskenners; split at the
// head; beheersmaatregel only after "een", so pm.plan.risk's caption "De
// beheersmaatregel" keeps its voice), and reads the integration specialist's
// jargon in Dutch: "ree-al-TAIM", "laa-ten-sie", "re-TRIES" (said riel-taim,
// lee-tensie, rie-traiz; batch is betsj by an older rule), and jargon as
// "sjargon" in this film's phrases only (espeak-ng reads "jar-gon"), and Harvard
// Business Review as "Harvard Biznis Rievjoe" (it reads "bu-ZIE-nus ree-VIEW"); Dutch only
test('speak variant: premortem, single point of failure, beheersmaatregel, the ERP jargon and jargon in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Een premortem. Premortem:'), 'Een pree-mortem. Pree-mortem:');
  assert.equal(nl('Een single point of failure. Single point of failure:'), 'Een singel pojnt of feeljer. Singel pojnt of feeljer:');
  assert.equal(nl('Vraag naar een beheersmaatregel. Zonder een beheersmaatregel. De beheersmaatregel: wat je nu doet.'),
    'Vraag naar een beheers-maatregel. Zonder een beheers-maatregel. De beheersmaatregel: wat je nu doet.');
  assert.equal(nl('De barcodescanners op de nachtdienst; Nachtdienst'), 'De barkoodskenners op de nacht-dienst; Nacht-dienst');
  assert.equal(nl('De koppeling is batch, niet real-time, met 15 minuten latency, en geen idempotentie bij retries.'),
    'De koppeling is betsj, niet riel-taim, met 15 minuten lee-tensie, en geen idempotentie bij rie-traiz.');
  assert.equal(nl('een masterbatch, een scanner, de dienst, de tijd'), 'een masterbatch, een scanner, de dienst, de tijd');
  assert.equal(nl('Jargon is de vaktaal. Jargon: de vaktaal. De expert in jargon aan het bestuur.'), 'Sjargon is de vaktaal. Sjargon: de vaktaal. De expert in sjargon aan het bestuur.');
  assert.equal(nl('Verkoop geen jargon. Het jargon onvertaald doorgeven.'), 'Verkoop geen jargon. Het jargon onvertaald doorgeven.');
  assert.equal(nl('in 2007, in Harvard Business Review. De Harvard-methode'), 'in 2007, in Harvard Biznis Rievjoe. De Harvard-methode');
  const en = 'A premortem, a single point of failure, the barcode scanners, batch, not real-time, latency, retries, jargon is the language';
  assert.equal(speakOf([en], 'en'), en);
  // English: espeak-ng reads idempotency as "AID-mpoatency"; said idem-potency
  assert.equal(speakOf(['And no idempotency on retries.'], 'en'), 'And no idem-potency on retries.');
  assert.equal(speakOf(['En geen idempotentie.'], 'nl'), 'En geen idempotentie.');
});

// espeak-ng reads codereviews as "koo-di-re-views", issues as "i-su-es", vage
// with a French g ("vaazje"), stresses risico-GE-stuurd and sleu-TEL-persoon
// (with the e of "bed"), negentig-negentigregEL, routineNEEpunten and, after
// "eerlijk", OPtimistisch: said kood-rievjoes, isjoes, vaage, risico-gestuurd,
// sleutel-persoon, negentig-negentig-regel, routine-punten and op-timistisch;
// Dutch only (pm.outside.experts). Not the steekproef of eng.quality.spc or
// other films' optimistisch
test('speak variant: codereviews, issues, vage, risicogestuurd, sleutelpersoon, negentig-negentigregel, routinepunten and eerlijk optimistisch in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('met codereviews en testrapporten; Codereviews'), 'met kood-rievjoes en testrapporten; Kood-rievjoes');
  assert.equal(nl('wat kleine issues. Welke issues'), 'wat kleine isjoes. Welke isjoes');
  assert.equal(nl('Risicogestuurd controleren: risicogestuurd'), 'Risico-gestuurd controleren: risico-gestuurd');
  assert.equal(nl('de sleutelpersoon die vertrekt'), 'de sleutel-persoon die vertrekt');
  assert.equal(nl('De negentig-negentigregel, van Bell Labs'), 'De negentig-negentig-regel, van Bell Labs');
  assert.equal(nl('Experts zijn vaak eerlijk optimistisch.'), 'Experts zijn vaak eerlijk op-timistisch.');
  assert.equal(nl('Vage antwoorden: vage kleine issues'), 'Vaage antwoorden: vaage kleine isjoes');
  assert.equal(nl('drie willekeurige routinepunten'), 'drie willekeurige routine-punten');
  assert.equal(nl('een steekproef, optimistisch, meest waarschijnlijk, het risico, een persoon, vaag, routine'), 'een steekproef, optimistisch, meest waarschijnlijk, het risico, een persoon, vaag, routine');
  const en = 'code reviews, some minor issues, risk-based checking, the key person, the ninety-ninety rule, honestly optimistic';
  assert.equal(speakOf([en], 'en'), en);
});

// Conflict: interests and the difficult conversation (pm.run.conflict): the
// authors of Getting to Yes as their names sound, only after "van" / "by" (so
// pm.negotiate.batna's captions "Fisher en Ury:" keep their voice): espeak-ng
// sounds the h of Fisher and reads Ury as "uu-rie" in Dutch and "urry" in
// English (said Fisjer en Joeri, Fisher and Yuri); and Lean-consultant as
// "Lien consultant", two words (espeak-ng reads "lee-an"; with the hyphen it
// runs on into "link-consultant"); no other film says them
test('speak variant: Fisher and Ury and the Lean consultant', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het komt uit het boek van Fisher en Ury, uit negentien eenentachtig.'), 'Het komt uit het boek van Fisjer en Joeri, uit negentien eenentachtig.');
  assert.equal(nl('Fisher en Ury: principieel onderhandelen.'), 'Fisher en Ury: principieel onderhandelen.');
  assert.equal(nl('Je bent junior Lean-consultant bij een zuivelfabriek.'), 'Je bent junior Lien consultant bij een zuivelfabriek.');
  assert.equal(nl('lean werken, een Lean-team'), 'lean werken, een Lean-team');
  assert.equal(speakOf(['Getting to Yes, the book by Fisher and Ury, from 1981.'], 'en'), 'Getting to Yes, the book by Fisher and Yuri, from 1981.');
  assert.equal(speakOf(['Fisher and Ury: principled negotiation. A junior Lean consultant.'], 'en'), 'Fisher and Ury: principled negotiation. A junior Lean consultant.');
});

// Disagreement and busy experts (pm.outside.disagree): espeak-ng reads second
// opinion as "se-KONT OP-i-ni-on" (said sekkend opinjun, only in this film's
// phrases, so pm.outside.steering's caption "een second opinion, de sponsor"
// keeps its voice), timebox as "TIE-me-box" (taimboks), Weinberg after "van"
// with a Dutch ei and g (Wainburk, as the Gerald Weinberg rule says it), Daniel
// Pink's book Drive as "dri-ve" (Deniel Pink, Draiv), Edward Deci and Richard
// Ryan with a Dutch ch and "rie-an" (Edwerd Diessie, Ritsjerd Rajen), manager
// as MAA-naa-gher (menetsjer, as the middenmanager rule; only in this film's
// phrases), and stresses OO-pi-raa-tors (ope-raators, only before "verliezen",
// so the TPM and LOTO films keep theirs), IN-stal-la-teur, zelfdeterminaatie
// with "ti" for "tsie", bouwPLAATS, drijfVEren and, after "als"
// and before a colon only, vuistreGEL: split at the head; Dutch only, no other film says them
test('speak variant: second opinion, timebox, Weinberg, Pink, Deci and Ryan, manager and the split compounds in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Een second opinion is een kijk. Een second opinion: een expert. Een second opinion van een onafhankelijk bureau. De second opinion steunt het.'),
    'Een sekkend opinjun is een kijk. Een sekkend opinjun: een expert. Een sekkend opinjun van een onafhankelijk bureau. De sekkend opinjun steunt het.');
  assert.equal(nl('Dan vertraag je: meer bewijs, een second opinion, de sponsor beslist.'), 'Dan vertraag je: meer bewijs, een second opinion, de sponsor beslist.');
  assert.equal(nl('Een timebox helpt. Timebox:'), 'Een taimboks helpt. Taimboks:');
  assert.equal(nl('de grove tabel van Weinberg; Gerald Weinberg'), 'de grove tabel van Wainburk; Djerreld Wainburk');
  assert.equal(nl('Daniel Pink noemt in Drive drie drijfveren, op basis van Edward Deci en Richard Ryan.'), 'Deniel Pink noemt in Draiv drie drijf-veren, op basis van Edwerd Diessie en Ritsjerd Rajen.');
  assert.equal(nl('de manager van de expert. Zijn manager verdeelt de uren. Zijn manager zegt het. Vraag zijn manager om één dag.'),
    'de menetsjer van de expert. Zijn menetsjer verdeelt de uren. Zijn menetsjer zegt het. Vraag zijn menetsjer om één dag.');
  assert.equal(nl('de operators verliezen tijd; de operators zijn eigenaar'), 'de ope-raators verliezen tijd; de operators zijn eigenaar');
  assert.equal(nl('De installateur wil vervangen; de zelfdeterminatietheorie; van de bouwplaats'),
    'De instal-lateur wil vervangen; de zelf-determinatie-theorie; van de bouw-plaats');
  assert.equal(nl('Gerald Weinberg, 1992, als vuistregel: twee projecten'), 'Djerreld Wainburk, 1992, als vuist-regel: twee projecten');
  assert.equal(nl('Meet daarom als vuistregel op tijd.'), 'Meet daarom als vuistregel op tijd.');
  assert.equal(nl('de manager van de productie, een vuistregel, een opinie, een box'), 'de manager van de productie, een vuistregel, een opinie, een box');
  const en = 'A second opinion, a timebox, Weinberg\'s table, Daniel Pink in Drive, Edward Deci and Richard Ryan, his manager, the operators lose, the installer';
  assert.equal(speakOf([en], 'en'), en);
});

// A two-week sprint (pm.agile.scrum): the Scrum Guide's English names as Dutch
// Scrum teams say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: Product Owner, Product Backlog and Product Goal (espeak-ng
// reads "PROO-dukt OU-ner", "BAK-loch", "GOO-al": said Prodduct Ooner, Bek-lok,
// Gool, the goal of Dutch football), Developers ("DEE-ve-loo-pers": Di-vellopers),
// Daily Scrum ("DAI-lie": Deeli), Sprint Review ("ree-VIEW": Rievjoe, as the
// Harvard Business Review rule), Sprint Retrospective ("RE-tros-pek-tie-ve":
// Retro-spektif), Scrum Guide (a Dutch "guide": Gaid), Definition of Done with a
// capital D (through pm.outside.steering's rule: Deffi-nisjun of dun),
// Schwaber and Jeff ("schwaber" with sch, "yef": Sjwaaber, Djef), events
// ("ee-VENTS": ievents), refinement ("ree-fie-ne-MENT": ri-fainmunt), and the
// compounds espeak-ng stresses at the end or reads with "ti" for "tsie": split
// at the head (sprintdoel, and vuistregel only after "gangbare"); "uit het
// Lean-team" as "Lien team". Dutch only; the capitalised names only, the Guide
// only as "Scrum Guide van", ERP untouched (the videos say "erp"),
// and no other film's spoken text changes
test('speak variant: the Scrum names and split compounds in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De Product Owner ordent de Product Backlog naar het Product Goal.'), 'De Prodduct Ooner ordent de Prodduct Bek-lok naar het Prodduct Gool.');
  assert.equal(nl('De Developers maken de Sprint Backlog en het Sprint Goal. Een Developer.'), 'De Di-vellopers maken de Sprint Bek-lok en het Sprint Gool. Een Di-velloper.');
  assert.equal(nl('De Daily Scrum, de Sprint Review en de Sprint Retrospective.'), 'De Deeli Scrum, de Sprint Rievjoe en de Sprint Retro-spektif.');
  assert.equal(nl('De Scrum Guide van Ken Schwaber en Jeff Sutherland.'), 'De Scrum Gaid van Ken Sjwaaber en Djef Sutherland.');
  assert.equal(nl('De Definition of Done. Vijf events. Events zijn vast. Refinement is geen event.'), 'De Deffi-nisjun of dun. Vijf ievents. Ievents zijn vast. Ri-fainmunt is geen ievent.');
  assert.equal(nl('De productieleider. De acceptatieomgeving.'), 'De productie-leider. De acceptatie-omgeving.');
  assert.equal(nl('De definition of done: klaar als'), 'De definition of done: klaar als');
  assert.equal(nl('Het sprintdoel. Uit het Lean-team, een gangbare vuistregel.'), 'Het sprint-doel. Uit het Lien team, een gangbare vuist-regel.');
  assert.equal(nl('Een Lean-team, een vuistregel.'), 'Een Lean-team, een vuistregel.');
  assert.equal(nl('een product, een goal, de review, een retrospective, de developer, Uit de Scrum Guide; het ERP'), 'een product, een goal, de review, een retrospective, de developer, Uit de Scrum Guide; het ERP');
  const en = 'The Product Owner, the Product Backlog, the Developers, the Daily Scrum, the Sprint Review, the Sprint Retrospective, the Scrum Guide by Ken Schwaber and Jeff Sutherland, events, refinement, the ERP';
  assert.equal(speakOf([en], 'en'), en);
});

// From idea to sprint-ready (pm.agile.backlog): the backlog and estimating
// words as Dutch agile teams say them, checked with espeak-ng phonemes through
// Piper's nl_NL-alex bridge: user story (it reads "uuzer": joezer story),
// stories (it stresses "sto-RIES": story's), story points ("po-ints": pojnts),
// epic (eppik), velocity ("VEE-loo-si-ti": ve-lossetti), the Fibonacci-reeks
// (Fiebo-natsjie reeks), Definition of Ready (as the Done rule: Deffi-nisjun of
// Reddi), Ron Jeffries, Bill Wake and James Grenning as their names sound,
// Card, Conversation en Confirmation and Extreme Programming in English
// sounds, the Scrum Guide before "schrijft" and "noemt" (Gaid, as the Scrum
// film's rule), and acceptatiecriteria, zaagmachines and trekhaken split at the
// head (a capital Acceptatiecriteria only before "zijn concrete", so
// pm.plan.wbs's "Acceptatiecriteria:" stays). In English, "three Cs" as "three
// C's" (en_GB reads "C S"). Story alone, planning poker and INVEST keep their
// voice; no other film's spoken text changes
test('speak variant: the backlog and estimating words in Dutch, the three Cs in English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Een user story. User stories. Stories en epics. Een epic.'), 'Een joezer story. Joezer story\'s. Story\'s en eppiks. Een eppik.');
  assert.equal(nl('Story points, de velocity en de Fibonacci-reeks. Velocity is.'), 'Story pojnts, de ve-lossetti en de Fiebo-natsjie reeks. Ve-lossetti is.');
  assert.equal(nl('Een Definition of Ready, van Bill Wake. Ron Jeffries en James Grenning.'), 'Een Deffi-nisjun of Reddi, van Bill Weejk. Ron Djeffriz en Djeems Grenning.');
  assert.equal(nl('Card, Conversation en Confirmation, uit Extreme Programming.'), 'Kaard, Konver-seesjun en Konfur-meesjun, uit Ekstriem Proogremming.');
  assert.equal(nl('De Scrum Guide schrijft niets. De Scrum Guide noemt hem niet. Acceptatiecriteria zijn concrete. De zaagmachines, trekhaken. Trekhaken.'), 'De Scrum Gaid schrijft niets. De Scrum Gaid noemt hem niet. Acceptatie-criteria zijn concrete. De zaag-machines, trek-haken. Trek-haken.');
  assert.equal(nl('Een story, planning poker, INVEST. Uit de Scrum Guide. Acceptatiecriteria: wie'), 'Een story, planning poker, INVEST. Uit de Scrum Guide. Acceptatiecriteria: wie');
  assert.equal(speakOf(['Ron Jeffries described the three Cs. Three Cs.'], 'en'), 'Ron Jeffries described the three C\'s. Three C\'s.');
  const en = 'A user story, story points, the velocity, an epic, the Fibonacci sequence, the Definition of Ready, Bill Wake, James Grenning';
  assert.equal(speakOf([en], 'en'), en);
});

// Flow on a kanban board (pm.agile.kanban): the names and the Kanban Guide's
// English measures as Dutch practitioners say them, checked with espeak-ng
// phonemes through Piper's nl_NL-alex bridge: Taiichi Ohno ("TA-jich-ie OH-
// noo": Taitsjie Oono), David Anderson and John Little as English names
// (Deevid Enderson, Djon), Vacanti (Va-kenti), Kanban Guide (a Dutch "guide":
// Gaid), Definition of Workflow (Deffi-nisjun of Wurkflo), throughput ("TRAUCH-
// put": Troepoet), cycle time ("SIK-le": Saikl taim), lead time ("lee-at":
// Lied taim), work item age ("ie-tem aa-zje": Wurk aitem eetsj), pull and
// pullsysteem ("pul": poel), flowmaten ("flow-MAA-ten": floo-maten), "afdeling
// engineering" (entsjinieering), engineer in this film's two phrases (as
// pm.consult.proposal's entsjinier), and onderhanden in this film's phrases
// (onder-handen, as pm.portfolio.prioritise). Dutch only; no other film's
// spoken text changes
test('speak variant: the kanban names and flow measures in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het systeem van Taiichi Ohno. David Anderson. John Little. Vacanti benadrukt.'), 'Het systeem van Taitsjie Oono. Deevid Enderson. Djon Little. Va-kenti benadrukt.');
  assert.equal(nl('De Kanban Guide van 2020. De Definition of Workflow.'), 'De Kanban Gaid van 2020. De Deffi-nisjun of Wurkflo.');
  assert.equal(nl('De Throughput, de throughput, de cycle time, Cycle time, de lead time, De work item age.'),
    'De Troepoet, de troepoet, de saikl taim, Saikl taim, de lied taim, De wurk aitem eetsj.');
  assert.equal(nl('met pull, een pullsysteem, vier flowmaten, de afdeling engineering'), 'met poel, een poelsysteem, vier floo-maten, de afdeling entsjinieering');
  assert.equal(nl('een engineer pakt de kaart; een engineer doet de controle'), 'een entsjinier pakt de kaart; een entsjinier doet de controle');
  assert.equal(nl('Heet dat onderhanden werk. Twaalf items onderhanden; vijftien werkitems onderhanden; gemiddeld twaalf onderhanden'),
    'Heet dat onder-handen werk. Twaalf items onder-handen; vijftien werkitems onder-handen; gemiddeld twaalf onder-handen');
  assert.equal(nl('een engineer, de pullover, onderhanden werk, de Guide, een lead, IT en engineering'), 'een engineer, de pullover, onderhanden werk, de Guide, een lead, IT en engineering');
  const en = 'Taiichi Ohno, David Anderson, John Little, Vacanti, the Kanban Guide, the Definition of Workflow, throughput, cycle time, lead time, work item age, pull, an engineer takes the card';
  assert.equal(speakOf([en], 'en'), en);
});

// Stage-gate with sprints (pm.scaled.hybrid): the stage-gate and lead-time
// words as Dutch product developers say them, checked with espeak-ng phonemes
// through Piper's nl_NL-alex bridge: stage-gate and gate ("staa-zje-GAA-te":
// steetsj-geet, geet; also after the agile rule in Agile-Stage-Gate), go/kill
// without "slash" (go-kill), Cooper ("koo-per": Koeper), long-lead item
// ("lee-at ie-tem": long-lied aitem), SOP as letters (it reads the word "sop"
// before a comma: es oo pee), design freeze ("DEE-zich FREE-ze": di-zain friez),
// set-based design (set-beesd di-zain), SAFe (it reads "saa-fe": Seef) and
// matrijsbouw (stressed MA-: matrijs-bouw); Toyota keeps pm.land.training's
// rule (Tojota). Not in
// eng.moulding.setting's gate-freeze-studie. In English, go/kill without
// "slash" and SOP as letters (en_GB reads "sop" before a comma); no other
// film's spoken text changes
test('speak variant: the stage-gate and lead-time words in Dutch, go/kill and SOP in English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Stage-gate en de gates. Een gate, Agile-Stage-Gate van Cooper.'), 'Steetsj-geet en de geets. Een geet, Etsjail-Steetsj-Geet van Koeper.');
  assert.equal(nl('Een go/kill-beslissing. Een long-lead item, twee long-lead items. De SOP, vanaf de SOP.'), 'Een go-kill-beslissing. Een long-lied aitem, twee long-lied aitems. De es oo pee, vanaf de es oo pee.');
  assert.equal(nl('De design freeze. Design freeze. Set-based design, naar Toyota, SAFe noemt het. De matrijsbouw.'), 'De di-zain friez. Di-zain friez. Set-beesd di-zain, naar Tojota, Seef noemt het. De matrijs-bouw.');
  assert.equal(nl('De gate-freeze-studie. Een kwaliteitspoort. Het ontwerp.'), 'De gate-freeze-studie. Een kwaliteitspoort. Het ontwerp.');
  assert.equal(speakOf(['A go/kill decision. The SOP, from the SOP.'], 'en'), 'A go-kill decision. The S O P, from the S O P.');
  const en = 'Stage-gate, a gate, Agile-Stage-Gate, Cooper, a long-lead item, the design freeze, set-based design, Toyota, SAFe';
  assert.equal(speakOf([en], 'en'), en);
});

// A stage drawn on the Dutch caption beats (beatwarp films set STAGE.nlBeats)
// follows the caption beat on screen in English too: while English beat k
// shows, the stage runs through Dutch beat k, so the drawing is never a beat off.
test('stageU: in English a Dutch-beat stage runs on the caption beat; Dutch and other stages stay plain', async () => {
  // Dutch: beat 2 starts at 2 s of 10; English: at 8 s
  const sc = { dur: 10, beats: [{ text: { nl: 'a', en: 'a b c d' } }, { text: { nl: 'b c d e', en: 'e' } }] };
  assert.deepEqual(beatStarts(sc, 'nl'), [0, 2]);
  assert.deepEqual(beatStarts(sc, 'en'), [0, 8]);
  for (const t of [0, 1, 3, 7.5, 10]) {
    assert.equal(stageU(sc, 'nl', t, true), t / 10);
    assert.equal(stageU(sc, 'en', t, false), t / 10);
  }
  // English beat 1 (0..8 s) maps onto Dutch beat 1 (0..2 s), beat 2 onto 2..10 s
  assert.equal(stageU(sc, 'en', 0, true), 0);
  assert.equal(stageU(sc, 'en', 4, true), 0.1);
  assert.ok(stageU(sc, 'en', 7.99, true) < 0.2);
  assert.equal(stageU(sc, 'en', 8, true), 0.2);
  assert.equal(stageU(sc, 'en', 9, true), 0.6);
  assert.equal(stageU(sc, 'en', 10, true), 1);
  assert.equal(stageU(sc, 'en', 12, true), 1);
  // the stage's beat (by Dutch fractions) equals the caption beat (by English starts)
  for (let t = 0; t < 10; t += 0.25) assert.equal(beatIndexAt(sc, 'nl', stageU(sc, 'en', t, true) * 10), beatIndexAt(sc, 'en', t), `t ${t}`);
  // the player hands it the flag that beatwarp sets, and keeps the designed still under reduced motion
  const { readFileSync } = await import('node:fs');
  const rt = readFileSync(new URL('../films/_kit/player-runtime.js', import.meta.url), 'utf8');
  assert.match(rt, /reduce \? \(s\.beats\[bi\]\.still \?\? s\.still\) : stageU\(s, LANG, lt, STAGE\.nlBeats === true\)/);
  assert.match(readFileSync(new URL('../films/_kit/beatwarp.js', import.meta.url), 'utf8'), /STAGE\.nlBeats = true;/);
});

test('timeline: scene starts, total, the scene at a time', () => {
  const tl = timelineOf([{ dur: 10 }, { dur: 5 }, { dur: 20 }]);
  assert.deepEqual(tl.starts, [0, 10, 15]);
  assert.equal(tl.total, 35);
  assert.equal(sceneIndexAt(0, tl), 0);
  assert.equal(sceneIndexAt(9.99, tl), 0);
  assert.equal(sceneIndexAt(10, tl), 1);
  assert.equal(sceneIndexAt(34, tl), 2);
  assert.equal(sceneIndexAt(99, tl), 2);
  assert.equal(sceneIndexAt(-3, tl), 0);
});

test('?scene clamps to the film: 1-based in, 0-based out, junk opens scene 1', () => {
  assert.equal(clampScene('3', 8), 2);
  assert.equal(clampScene(1, 8), 0);
  assert.equal(clampScene('12', 8), 7);
  assert.equal(clampScene('0', 8), 0);
  assert.equal(clampScene('-2', 8), 0);
  assert.equal(clampScene('abc', 8), 0);
  assert.equal(clampScene(null, 8), 0);
});

test('beats split a scene by their share of the words; the clock never passes a boundary while speech runs', () => {
  const scene = { dur: 20, beats: [{ text: { nl: 'een twee drie vier' } }, { text: { nl: 'vijf zes drie vier' } }] };
  assert.deepEqual(beatStarts(scene, 'nl'), [0, 10]);
  assert.equal(beatIndexAt(scene, 'nl', 9.9), 0);
  assert.equal(beatIndexAt(scene, 'nl', 10), 1);
  assert.deepEqual(beatStarts({ dur: 12, beats: [{ text: { nl: 'a' } }] }, 'nl'), [0]);
  // speaking beat 0 of scene 1 (starts 30): hold at 40, the start of beat 1
  const tl = timelineOf([{ dur: 30, beats: [{ text: { nl: 'x' } }] }, scene]);
  assert.equal(holdLimit(tl, [{ dur: 30, beats: [{ text: { nl: 'x' } }] }, scene], 'nl', 1, 0), 40);
  // the last beat holds at the end of its scene
  assert.equal(holdLimit(tl, [{ dur: 30, beats: [{ text: { nl: 'x' } }] }, scene], 'nl', 1, 1), 50);
});

test('page parameters: theme, lang, scene, motion, muted', () => {
  assert.deepEqual(parseParams('?theme=dark&lang=en&scene=3&motion=reduce&muted=1&level=2'), { theme: 'dark', lang: 'en', scene: '3', reduce: true, muted: true, level: 2, render: false });
  assert.deepEqual(parseParams(''), { theme: null, lang: 'nl', scene: null, reduce: false, muted: false, level: null, render: false });
  assert.equal(parseParams('?theme=pink').theme, null);
  assert.equal(parseParams('?lang=de').lang, 'nl');
  assert.equal(parseParams('?level=9').level, null);
});

// In the app the page arrives as srcdoc (so it plays offline: a sandboxed
// frame's own navigation never goes through the service worker); its
// parameters then come in the frame's name.
test('page parameters come from the URL, or from the frame name when the page is srcdoc', () => {
  assert.equal(searchOf('?theme=dark&lang=en', '?theme=light'), '?theme=dark&lang=en');
  assert.equal(searchOf('', '?theme=dark&lang=en&level=3'), '?theme=dark&lang=en&level=3');
  assert.equal(searchOf('', 'some-other-name'), '');
  assert.equal(searchOf('', ''), '');
  assert.equal(searchOf(undefined, undefined), '');
  assert.equal(parseParams(searchOf('', '?lang=en&muted=1')).lang, 'en');
});

test('clock text and easing', () => {
  assert.equal(fmtClock(0), '0:00');
  assert.equal(fmtClock(65.4), '1:05');
  assert.equal(fmtClock(140), '2:20');
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  assert.equal(ease(0.5), 0.5);
  assert.equal(span(0.25, 0.5, 1), 0);
  assert.equal(span(1, 0.5, 1), 1);
  assert.equal(span(0.75, 0.5, 1), 0.5);
});

// ------------------------------------------------------------ app side
test('film ref: an id with an optional start scene', () => {
  assert.deepEqual(parseFilmRef('eng.machining.turning'), { id: 'eng.machining.turning', scene: null });
  assert.deepEqual(parseFilmRef('eng.machining.turning#3'), { id: 'eng.machining.turning', scene: 3 });
  assert.equal(parseFilmRef('../evil'), null);
  assert.equal(parseFilmRef('eng.x#0'), null);
  assert.equal(parseFilmRef(42), null);
});

test('filmSrc: theme, language, level, scene and the remembered mute', () => {
  assert.equal(filmSrc('eng.machining.turning', 'dark', 'en'), 'src/content/courses/films/eng.machining.turning.html?theme=dark&lang=en');
  assert.equal(filmSrc('x.y', 'light', 'nl', { level: 3, scene: 5, muted: true }), 'src/content/courses/films/x.y.html?theme=light&lang=nl&level=3&scene=5&muted=1');
  assert.equal(filmSrc('x.y', 'light', 'fr', { level: 9, scene: null }), 'src/content/courses/films/x.y.html?theme=light&lang=nl');
});

test('loadFilm: the page is fetched (the service worker answers offline) and handed to the frame as srcdoc', async () => {
  const frame = {};
  const asked = [];
  const ok = await loadFilm(frame, 'src/content/courses/films/x.y.html', async (u) => { asked.push(u); return { ok: true, text: async () => '<p>film</p>' }; });
  assert.equal(ok, true);
  assert.deepEqual(asked, ['src/content/courses/films/x.y.html']);
  assert.equal(frame.srcdoc, '<p>film</p>');
  const missing = {};
  assert.equal(await loadFilm(missing, 'a', async () => ({ ok: false, text: async () => 'Not found' })), false);
  assert.equal('srcdoc' in missing, false);
  const offline = {};
  assert.equal(await loadFilm(offline, 'a', async () => { throw new TypeError('Failed to fetch'); }), false);
  assert.equal('srcdoc' in offline, false);
});

test('the bridge accepts only well-formed messages from its own frame', () => {
  const own = {};
  const other = {};
  const ok = (data, source = own) => filmMessage({ source, data }, own);
  assert.deepEqual(ok({ type: 'vp-film', op: 'say', id: 4, text: 'Hallo', lang: 'nl' }), { op: 'say', id: 4, text: 'Hallo', lang: 'nl', rate: 1 });
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 4, text: 'Hallo', lang: 'nl' }, other), null);
  assert.equal(ok({ type: 'other', op: 'say', id: 1, text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'format-disk' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x'.repeat(901) }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: '' }), null);
  assert.equal(ok('a string'), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x', lang: 'de' }).lang, 'nl');
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x', lang: 'en', rate: 1.25 }).rate, 1.25);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x', rate: 9 }).rate, 1);
  assert.deepEqual(ok({ type: 'vp-film', op: 'cancel' }), { op: 'cancel' });
  assert.deepEqual(ok({ type: 'vp-film', op: 'mute', muted: true }), { op: 'mute', muted: true });
  assert.deepEqual(ok({ type: 'vp-film', op: 'size', h: 412.4 }), { op: 'size', h: 412 });
  assert.equal(ok({ type: 'vp-film', op: 'size', h: 'tall' }), null);
  assert.deepEqual(ok({ type: 'vp-film', op: 'hello' }), { op: 'hello' });
  // the line id is echoed back to the film: a small finite number or a short string only
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 'x'.repeat(41), text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: Infinity, text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: NaN, text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 'line-3', text: 'x' }).id, 'line-3');
});

test('the bridge speaks through the app voice and answers said; it ignores other frames', async () => {
  const listeners = [];
  const win = { addEventListener: (_, fn) => listeners.push(fn), removeEventListener: (_, fn) => listeners.splice(listeners.indexOf(fn), 1) };
  const posted = [];
  const frame = { isConnected: true, style: {}, contentWindow: { postMessage: (m) => posted.push(m) } };
  const spoken = [];
  let hushed = 0;
  const stored = [];
  const stop = filmBridge(frame, {
    win,
    say: async (text, lang, rate) => { spoken.push([text, lang, rate]); return 'spoken'; },
    hush: () => { hushed += 1; },
    remember: (m) => stored.push(m),
  });
  const send = async (data, source = frame.contentWindow) => { listeners.forEach((fn) => fn({ source, data })); await new Promise((r) => setTimeout(r, 0)); };
  await send({ type: 'vp-film', op: 'hello' });
  assert.deepEqual(posted.shift(), { type: 'vp-film', op: 'ready', voice: true });
  await send({ type: 'vp-film', op: 'say', id: 7, text: 'De voeding', lang: 'nl' });
  assert.deepEqual(spoken, [['De voeding', 'nl', 1]]);
  assert.deepEqual(posted.shift(), { type: 'vp-film', op: 'said', id: 7, result: 'spoken' });
  await send({ type: 'vp-film', op: 'say', id: 8, text: 'Evil', lang: 'nl' }, {});
  assert.equal(spoken.length, 1);
  await send({ type: 'vp-film', op: 'cancel' });
  assert.equal(hushed, 1);
  await send({ type: 'vp-film', op: 'mute', muted: true });
  assert.deepEqual(stored, [true]);
  assert.equal(hushed, 2); // muting stops the line being spoken
  await send({ type: 'vp-film', op: 'size', h: 400 });
  assert.equal(frame.style.height, '400px');
  await send({ type: 'vp-film', op: 'size', h: 5000 });
  assert.equal(frame.style.height, '900px');
  stop();
  assert.equal(listeners.length, 0);
  assert.equal(hushed, 3); // stopping the bridge silences the film
});

test('a frame that left the page stops its bridge and silences speech', async () => {
  const listeners = [];
  const win = { addEventListener: (_, fn) => listeners.push(fn), removeEventListener: (_, fn) => listeners.splice(listeners.indexOf(fn), 1) };
  const frame = { isConnected: false, style: {}, contentWindow: { postMessage() {} } };
  let hushed = 0;
  let spoke = 0;
  filmBridge(frame, { win, say: async () => { spoke += 1; return 'spoken'; }, hush: () => { hushed += 1; }, remember() {} });
  listeners.forEach((fn) => fn({ source: frame.contentWindow, data: { type: 'vp-film', op: 'say', id: 1, text: 'x', lang: 'nl' } }));
  assert.equal(spoke, 0);
  assert.equal(hushed, 1);
  assert.equal(listeners.length, 0);
});

test('the remembered mute: off unless saved, and storage errors are harmless', () => {
  const store = new Map();
  const ls = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(mutedPref.read(ls), false);
  mutedPref.write(true, ls);
  assert.equal(mutedPref.read(ls), true);
  mutedPref.write(false, ls);
  assert.equal(mutedPref.read(ls), false);
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.equal(mutedPref.read(broken), false);
  assert.doesNotThrow(() => mutedPref.write(true, broken));
});

// ------------------------------------------------------------ the build's resolver
test('resolveFilm: terms come from the served lessons, the English word by position, glossed once in Dutch', async () => {
  const { resolveFilm } = await import('../films/_kit/build-film.mjs');
  const l = (lang) => ({ id: 'eng.fx.a', terms: lang === 'nl' ? [{ term: 'Voeding' }, { term: 'Bril' }] : [{ term: 'Feed' }, { term: 'Steady rest' }], teach: ['Voeding 0,3 mm en 1.167 omw/min.'] });
  const lessons = { nl: new Map([['eng.fx.a', l('nl')]]), en: new Map([['eng.fx.a', l('en')]]) };
  const scene = (beats) => ({ id: 's1', level: 1, dur: 10, still: 0.5, title: { nl: 'a', en: 'a' }, beats });
  const spec = (beats) => ({ id: 'x.y', title: { nl: 'a', en: 'a' }, lessons: ['eng.fx.a'], scenes: [scene(beats)] });
  const data = resolveFilm(spec([
    { nl: 'De {t:Voeding|voeding} is {n:0.3} mm.', en: 'The {t:Feed|feed} is {n:0.3} mm.', cue: { Voeding: 'feed' } },
    { nl: 'Weer {t:Voeding|voeding}.', en: 'Again {t:Feed|feed}.', cue: { Voeding: 'feed' } },
    { nl: 'Dan {n:1167} omw/min.', en: 'Then {n:1167} rpm.' },
  ]), lessons);
  const [b1, b2, b3] = data.scenes[0].beats;
  assert.deepEqual(b3.speak, { nl: 'Dan 11honderd 67 omwentelingen per minuut.', en: 'Then 1,167 revolutions per minute.' });
  assert.equal(b1.text.nl, 'De voeding (feed) is 0,3 mm.');
  assert.equal(b1.speak.nl, 'De voeding is 0,3 millimeter.');
  assert.equal(b1.text.en, 'The feed is 0.3 mm.');
  assert.equal(b2.text.nl, 'Weer voeding.');
  assert.deepEqual(data.scenes[0].terms, [{ lesson: 'eng.fx.a', index: 0, nl: 'Voeding', en: 'Feed', cue: 'feed' }]);
  assert.deepEqual(data.numbers, [{ lesson: 'eng.fx.a', value: '0,3', scene: 's1' }, { lesson: 'eng.fx.a', value: '1.167', scene: 's1' }]);
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Snijsnelheid}', en: '{t:Cutting speed}', cue: { Snijsnelheid: 'x' } }]), lessons), /none of the served/);
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Voeding}', en: '{t:Steady rest}', cue: { Voeding: 'x' } }]), lessons), /different terms/);
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Voeding}', en: '{t:Feed}' }]), lessons), /no cue/);
  assert.throws(() => resolveFilm(spec([{ nl: '{n:7}', en: '{n:7}' }]), lessons), /number 7/);
  assert.throws(() => resolveFilm(spec([{ nl: '{n:0.3}', en: '{n:0.4}' }]), lessons), /different numbers/);
});

// Two served lessons can name different Dutch terms with one English word
// (Stakeholdermap and Stakeholderkaart are both "Stakeholder map"): the English
// term then resolves to the lesson its Dutch twin names, in caption and narration.
test('resolveFilm: an English term shared by two served lessons follows its Dutch term', async () => {
  const { resolveFilm } = await import('../films/_kit/build-film.mjs');
  const mk = (id, nl, en) => ({ nl: { id, terms: nl.map((term) => ({ term })), teach: [''] }, en: { id, terms: en.map((term) => ({ term })), teach: [''] } });
  const a = mk('pm.fx.a', ['Stakeholdermap'], ['Stakeholder map']);
  const b = mk('pm.fx.b', ['Valuta', 'Stakeholderkaart'], ['Currency', 'Stakeholder map']);
  const lessons = { nl: new Map([['pm.fx.a', a.nl], ['pm.fx.b', b.nl]]), en: new Map([['pm.fx.a', a.en], ['pm.fx.b', b.en]]) };
  const spec = (beats) => ({ id: 'x.y', title: { nl: 'a', en: 'a' }, lessons: ['pm.fx.a', 'pm.fx.b'], scenes: [{ id: 's1', level: 1, dur: 10, still: 0.5, title: { nl: 'a', en: 'a' }, beats }] });
  const data = resolveFilm(spec([
    { nl: 'De {t:Stakeholdermap|map}.', en: 'The {t:Stakeholder map|map}.', cue: { Stakeholdermap: 'm1' }, say: { nl: 'De {t:Stakeholdermap|stakeholdermap}.', en: 'The {t:Stakeholder map|stakeholder map}.' } },
    { nl: 'De {t:Stakeholderkaart|kaart}.', en: 'The {t:Stakeholder map|map}.', cue: { Stakeholderkaart: 'm2' }, say: { nl: 'De {t:Stakeholderkaart|stakeholderkaart}.', en: 'The {t:Stakeholder map|stakeholder map}.' } },
  ]), lessons);
  assert.deepEqual(data.scenes[0].terms.map((t) => [t.lesson, t.index, t.cue]), [['pm.fx.a', 0, 'm1'], ['pm.fx.b', 1, 'm2']]);
  assert.equal(data.scenes[0].beats[1].say.en[1].k, 'pm.fx.b#1');
  // a Dutch term with an English word from yet another lesson still fails
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Valuta}', en: '{t:Stakeholder map}', cue: { Valuta: 'c' } }]), lessons), /different terms/);
});

// v14b: the narration script (say) beside the caption, checked the same way
test('resolveFilm: the narration names lesson terms and numbers, glosses in Dutch once, and nl and en must agree', async () => {
  const { resolveFilm } = await import('../films/_kit/build-film.mjs');
  const l = (lang) => ({ id: 'eng.fx.a', terms: lang === 'nl' ? [{ term: 'Voeding' }, { term: 'Bril' }] : [{ term: 'Feed' }, { term: 'Steady rest' }], teach: ['Voeding 0,3 mm en 1.167 omw/min, 6,0 min.'] });
  const lessons = { nl: new Map([['eng.fx.a', l('nl')]]), en: new Map([['eng.fx.a', l('en')]]) };
  const spec = (beats) => ({ id: 'x.y', title: { nl: 'a', en: 'a' }, lessons: ['eng.fx.a'], scenes: [{ id: 's1', level: 1, dur: 10, still: 0.5, title: { nl: 'a', en: 'a' }, beats }] });
  const cap = { nl: 'De {t:Voeding|voeding}.', en: 'The {t:Feed|feed}.', cue: { Voeding: 'feed' } };
  const data = resolveFilm(spec([
    { ...cap, say: { nl: 'De {t:Voeding|voeding} is hoe ver hij opschuift: {n:0.3} mm per omwenteling.', en: 'The {t:Feed|feed} is how far it moves on: {n:0.3} mm per revolution.' } },
    { ...cap, say: { nl: 'Weer de {t:Voeding|voeding}, en een {t:Bril|bril}, in {n:6.0} min.', en: 'The {t:Feed|feed} again, and a {t:Steady rest|steady rest}, in {n:6.0} min.' } },
  ]), lessons);
  const [b1, b2] = data.scenes[0].beats;
  assert.deepEqual(b1.say.nl, ['De ', { t: 'voeding', k: 'eng.fx.a#0', en: 'feed' }, ' is hoe ver hij opschuift: ', '0,3', ' mm per omwenteling.']);
  assert.deepEqual(b1.say.en[1], { t: 'feed', k: 'eng.fx.a#0' });
  assert.equal(b1.voice.nl, 'De voeding is hoe ver hij opschuift: 0,3 millimeter per omwenteling.');
  assert.equal(b2.voice.en, 'The feed again, and a steady rest, in 6 minutes.');
  // the gloss once per term in the narration, separately from the captions
  assert.ok(!b2.say.nl.some((p) => p.k === 'eng.fx.a#0' && p.en));
  assert.ok(b2.say.nl.some((p) => p.k === 'eng.fx.a#1' && p.en === 'steady rest'));
  // narration numbers are checked against the lesson too
  assert.ok(data.numbers.some((n) => n.value === '6,0'));
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{t:Voeding}', en: '{t:Steady rest}' } }]), lessons), /narration name different terms/);
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{n:0.3}', en: '{n:0.4}' } }]), lessons), /narration carry different numbers/);
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{n:42}', en: '{n:42}' } }]), lessons), /number 42/);
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{t:Snijsnelheid}', en: '{t:Cutting speed}' } }]), lessons), /none of the served/);
});

// The spoken-text transforms (SAY, sayable, speakOf) run at build time: the
// page's film data already carries each beat's voice and speak strings. So the
// page script inlines only the runtime part of the timeline, and does not grow
// as each film adds SAY rules.
test('a film page inlines the runtime timeline, not the build-time SAY table', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  const vm = await import('node:vm');
  const { pageHtml, runtimeTimeline } = await import('../films/_kit/player.mjs');
  const { audioTimeline } = await import('../films/_kit/timeline.mjs');
  const SAY_RULE = 'omwentelingen per minuut'; // a Dutch SAY rule (rpm, omw/min)
  assert.ok(readFileSync(new URL('../films/_kit/timeline.mjs', import.meta.url), 'utf8').includes(SAY_RULE));
  const rt = runtimeTimeline();
  for (const gone of [SAY_RULE, 'const SAY', 'sayable', 'speakOf', 'parseMarked', 'export ']) assert.ok(!rt.includes(gone), gone);
  // what the player needs still runs, and agrees with the module
  const ctx = vm.createContext({});
  vm.runInContext(`${rt};this.out=JSON.stringify({tl:timelineOf([{dur:3},{dur:5}]),at:sceneIndexAt(4,timelineOf([{dur:3},{dur:5}])),clock:fmtClock(65),atl:audioTimeline([[1,2],[3]]),w:wordsOf('a b c'),b:beatStarts({dur:6,beats:[{text:{nl:'a b'}},{text:{nl:'c'}}]},'nl'),q:searchOf('?scene=2','')})`, ctx);
  assert.deepEqual(JSON.parse(ctx.out), {
    tl: timelineOf([{ dur: 3 }, { dur: 5 }]), at: 1, clock: fmtClock(65), atl: audioTimeline([[1, 2], [3]]), w: 3,
    b: beatStarts({ dur: 6, beats: [{ text: { nl: 'a b' } }, { text: { nl: 'c' } }] }, 'nl'), q: searchOf('?scene=2', ''),
  });
  // a page built now, and every built film page: no SAY table, and a script that parses
  const page = pageHtml({ title: { nl: 'T', en: 'T' }, scenes: [] }, { svg: '<svg></svg>', script: 'const STAGE={};', label: { nl: 'l', en: 'l' } });
  const dir = new URL('../src/content/courses/films/', import.meta.url);
  const pages = [['built now', page], ...readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => [f, readFileSync(new URL(f, dir), 'utf8')])];
  for (const [name, html] of pages) {
    const script = html.match(/<script type="module">([\s\S]*)<\/script><\/body>/)[1];
    assert.ok(!script.includes(SAY_RULE) && !/\bsayable\b/.test(script), `${name} inlines the SAY table`);
    assert.doesNotThrow(() => new vm.Script(script), `${name} script does not parse`);
  }
});

// ------------------------------------------------------------ focus highlight (v16)
// Each beat names the part(s) of the drawing it explains (focus: a cue key, a
// list of them, or null for an overview sentence). The player lights those
// parts light blue / white while the beat is spoken and its caption shows.
test('resolveFilm: a beat names its focus; a term cue joins it; strictFocus demands one on every beat', async () => {
  const { resolveFilm } = await import('../films/_kit/build-film.mjs');
  const l = (lang) => ({ id: 'eng.fx.a', terms: lang === 'nl' ? [{ term: 'Voeding' }] : [{ term: 'Feed' }], teach: ['Voeding.'] });
  const lessons = { nl: new Map([['eng.fx.a', l('nl')]]), en: new Map([['eng.fx.a', l('en')]]) };
  const spec = (beats, more = {}) => ({ id: 'x.y', title: { nl: 'a', en: 'a' }, lessons: ['eng.fx.a'], scenes: [{ id: 's1', level: 1, dur: 10, still: 0.5, title: { nl: 'a', en: 'a' }, beats }], ...more });
  const data = resolveFilm(spec([
    { nl: 'Een.', en: 'One.', focus: 'tool' },
    { nl: 'Twee.', en: 'Two.', focus: ['tool', 'chuck'] },
    { nl: 'Overzicht.', en: 'Overview.', focus: null },
    { nl: 'De {t:Voeding|voeding}.', en: 'The {t:Feed|feed}.', cue: { Voeding: 'feed' }, focus: 'tool' },
    { nl: 'Oud.', en: 'Old.', cues: ['chuck'] },
    { nl: 'Niets.', en: 'Nothing.' },
  ]), lessons);
  const b = data.scenes[0].beats;
  assert.deepEqual(b.map((x) => x.cues), [['tool'], ['tool', 'chuck'], [], ['tool', 'feed'], ['chuck'], []]);
  assert.deepEqual(b.map((x) => x.focus), [['tool'], ['tool', 'chuck'], null, ['tool', 'feed'], undefined, undefined]);
  assert.ok(!('strictFocus' in data));
  // a film without focus fields resolves exactly as before: no focus key at all
  assert.ok(!('focus' in b[4]) && !('focus' in b[5]));
  // strict: every beat declares it, no legacy cues list, an overview names no term
  const ok = resolveFilm(spec([{ nl: 'Een.', en: 'One.', focus: 'tool' }, { nl: 'Twee.', en: 'Two.', focus: null }], { strictFocus: true }), lessons);
  assert.equal(ok.strictFocus, true);
  assert.throws(() => resolveFilm(spec([{ nl: 'Een.', en: 'One.' }], { strictFocus: true }), lessons), /scene 1 beat 1: no focus/);
  assert.throws(() => resolveFilm(spec([{ nl: 'Een.', en: 'One.', cues: ['x'] }], { strictFocus: true }), lessons), /use focus, not cues/);
  assert.throws(() => resolveFilm(spec([{ nl: 'De {t:Voeding|voeding}.', en: 'The {t:Feed|feed}.', cue: { Voeding: 'feed' }, focus: null }], { strictFocus: true }), lessons), /overview .*names a term/);
  for (const bad of [[], '', ['ok', 3], {}]) assert.throws(() => resolveFilm(spec([{ nl: 'Een.', en: 'One.', focus: bad }]), lessons), /focus must be/, JSON.stringify(bad));
});

test('checkFocus: beats without a focus are counted (warnings), unknown parts too; strict films turn them into errors', async () => {
  const { checkFocus, cueKeysOf } = await import('../films/_kit/assert.mjs');
  assert.deepEqual([...cueKeysOf('<svg><g data-cue="a"><g data-cue="b"></g></g><g data-cue="a"></g></svg>')].sort(), ['a', 'b']);
  // a stage script that draws a cue group per frame names it too
  assert.deepEqual([...cueKeysOf('out += cue(\'nop\', x); s = `<g data-cue="lab">`; c = `<g data-cue="${name}">`')].sort(), ['lab', 'nop']);
  const keys = new Set(['a', 'b']);
  const film = (beats, more = {}) => ({ scenes: [{ id: 's1', beats }], ...more });
  const loose = checkFocus(film([{ cues: ['a'] }, { cues: [] }, { cues: [], focus: null }, { cues: ['zz'] }]), keys);
  assert.deepEqual(loose.errors, []);
  assert.deepEqual(loose.missing, ['s1 beat 2']);
  assert.deepEqual(loose.unknown, ['s1 beat 4: zz']);
  const strict = checkFocus(film([{ cues: ['a'], focus: ['a'] }, { cues: [] }, { cues: ['zz'], focus: ['zz'] }], { strictFocus: true }), keys);
  assert.match(strict.errors.join('\n'), /s1 beat 2: no focus/);
  assert.match(strict.errors.join('\n'), /s1 beat 3: focus "zz" is no part of the drawing/);
  assert.deepEqual(checkFocus(film([{ cues: ['a'], focus: ['a'] }, { cues: [], focus: null }], { strictFocus: true }), keys).errors, []);
});

test('player: the focus highlight is light blue / white in both themes, eases in, holds still for video and reduced motion', async () => {
  const { pageHtml } = await import('../films/_kit/player.mjs');
  const page = pageHtml({ title: { nl: 'T', en: 'T' }, scenes: [] }, { svg: '<svg></svg>', script: 'const STAGE={};', label: { nl: 'l', en: 'l' } });
  const css = page.match(/<style>([\s\S]*?)<\/style>/)[1];
  const block = (sel) => css.slice(css.indexOf(sel), css.indexOf('}', css.indexOf(sel)));
  for (const theme of ['.iso{', '.iso[data-theme="light"]{']) for (const v of ['--fp-focus:', '--fp-focus-glow:', '--fp-focus-top:', '--fp-focus-shade:', '--fp-focus-text:']) assert.ok(block(theme).includes(v), `${theme} ${v}`);
  // the focused part: a halo and its edges in the focus colour, not petrol
  assert.match(css, /\[data-cue\]\[data-on\]\{[^}]*filter:drop-shadow\(.*var\(--fp-focus-glow\)/);
  assert.match(css, /\[data-cue\]\[data-on\] \.iso-edge[^{]*\{stroke:var\(--fp-focus\)/);
  // a film's own cue rules (written against --fp-accent) follow the focus colour
  assert.match(css, /\[data-cue\]\[data-on\]\{[^}]*--fp-accent:var\(--fp-focus\)/);
  // calm: a short ease-in of the halo (restarted on the player when the beat
  // changes, so parts the stage redraws every frame ease in too), no breathing
  assert.match(css, /@property --fp-fi\{syntax:'<number>';inherits:true;initial-value:1\}/);
  assert.match(css, /\.fp\[data-focus="a"\]\{animation:fp-focus-a \.\d+s ease-in/);
  assert.match(css, /\.fp\[data-focus="b"\]\{animation:fp-focus-b \.\d+s ease-in/);
  assert.match(css, /drop-shadow\(0 0 calc\(var\(--fp-fi,1\) \* [\d.]+px\) var\(--fp-focus-glow\)\)/);
  assert.ok(!/fp-breathe|infinite/.test(css), 'no breathing loop');
  // reduced motion and the video frame: the halo is simply there, no ease
  assert.match(css, /\.fp\[data-motion="reduce"\]\[data-focus\],\.fp\[data-render="1"\]\[data-focus\]\{animation:none\}/);
  assert.match(css, /prefers-reduced-motion:reduce\)\{\.fp\[data-focus\]\{animation:none\}/);
  // the video frame is deterministic: no wall-clock or film-clock glow
  assert.ok(!page.includes('--fp-b'));
  // a stage may redraw a cue group every frame: the runtime lights the beat's
  // parts again after each render, not only when the beat changes
  const { readFileSync } = await import('node:fs');
  const rt = readFileSync(new URL('../films/_kit/player-runtime.js', import.meta.url), 'utf8');
  const renders = rt.split('\n').filter((l) => l.includes('STAGE.render('));
  assert.ok(renders.length >= 2);
  for (const l of renders) assert.match(l, /STAGE\.render\([^)]*\);\s*lightFocus\(\);/, l.trim());
  // the runtime goes in without its comment lines (bytes; each page stays near its 300 KB target)
  assert.ok(rt.includes("// the beat's focus") && !page.includes("// the beat's focus"));
  assert.ok(page.includes('lightFocus();'));
});

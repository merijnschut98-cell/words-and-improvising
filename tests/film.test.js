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
// as the floor says them, "edjail" and "hiebriede"; Dutch only, and the
// moulding film's "hybride machine" (rendered video) keeps its voice
// (pm.plan.method)
test('speak variant: agile and hybride in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Agile: korte rondes. Het Agile Manifesto, een agile methode.'), 'Edjail: korte rondes. Het Edjail Manifesto, een edjail methode.');
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
// Daily Scrum ("DAI-lie": Deili), Sprint Review ("ree-VIEW": Rievjoe, as the
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
  assert.equal(nl('De Daily Scrum, de Sprint Review en de Sprint Retrospective.'), 'De Deili Scrum, de Sprint Rievjoe en de Sprint Retro-spektif.');
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

// A two-day PI planning (pm.scaled.pi): SAFe's English names as Dutch
// practitioners say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: SAFe ("SAA-fe": Seef), Release Train ("ree-le-AA-ze
// treen": Rieliez Treen) and its Engineer (Entsjinier, as pm.consult.proposal),
// ART and RTE as letters (espeak-ng reads the word "art" and "r-tee"), the
// Planning Board ("boo-art": Bord), confidence vote ("vo-te": konfidens voot),
// Business Owners ("bu-ZIE-nus OW-ners": Biznis Ooners, as Owner and business
// case), ROAM ("roo-am": Room), objectives ("ob-jek-tie-ves": ob-tsjektivs),
// (un)committed (kommittid), Product Management ("MAA-nidzj-ment": Prodduct
// Mennitsjmunt), System Architect with a Dutch ch (Sistum Arkitekt), feature
// ("fee-aa-TUU-re": fietsjer; user stories go through pm.agile.backlog's rule),
// obeya ("OO-be-ie-aa": oobeeja), and program-, project- and productmanager
// with a Dutch "manager" (said -menetsjer, as the middenmanager rule). Dutch
// only; capitals as the lessons write them, and no other film's spoken text changes
test('speak variant: the SAFe names in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('SAFe, een SAFe-rol. De Agile Release Train en de Release Train Engineer.'), 'Seef, een Seef-rol. De Edjail Rieliez Treen en de Rieliez Treen Entsjinier.');
  assert.equal(nl('Een ART, de RTE, het ART Planning Board, de confidence vote. De Confidence vote.'), 'Een A R T, de R T E, het A R T Planning Bord, de konfidens voot. De Konfidens voot.');
  assert.equal(nl('De Business Owners, een Business Owner. ROAM. De PI-objectives, uncommitted en committed.'),
    'De Biznis Ooners, een Biznis Ooner. Room. De PI-ob-tsjektivs, un-kommittid en kommittid.');
  assert.equal(nl('Product Management, de System Architect, een feature, de features, user stories, een obeya.'),
    'Prodduct Mennitsjmunt, de Sistum Arkitekt, een fietsjer, de fietsjers, joezer story\'s, een oobeeja.');
  assert.equal(nl('Een oud-projectmanager, een programmamanager, een productmanager.'), 'Een oud-project-menetsjer, een programma-menetsjer, een product-menetsjer.');
  assert.equal(nl('de kunst, een safe, het Product, een manager'), 'de kunst, een safe, het Product, een manager');
  const en = 'SAFe, the Agile Release Train, the RTE, an ART, the ART Planning Board, the Business Owners, ROAM, PI objectives, uncommitted, Product Management, a feature, an obeya';
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
  assert.equal(nl('Stage-gate en de gates. Een gate, Agile-Stage-Gate van Cooper.'), 'Steetsj-geet en de geets. Een geet, Edjail-Steetsj-Geet van Koeper.');
  assert.equal(nl('Een go/kill-beslissing. Een long-lead item, twee long-lead items. De SOP, vanaf de SOP.'), 'Een go-kill-beslissing. Een long-lied aitem, twee long-lied aitems. De es oo pee, vanaf de es oo pee.');
  assert.equal(nl('De design freeze. Design freeze. Set-based design, naar Toyota, SAFe noemt het. De matrijsbouw.'), 'De di-zain friez. Di-zain friez. Set-beesd di-zain, naar Tojota, Seef noemt het. De matrijs-bouw.');
  assert.equal(nl('De gate-freeze-studie. Een kwaliteitspoort. Het ontwerp.'), 'De gate-freeze-studie. Een kwaliteitspoort. Het ontwerp.');
  assert.equal(speakOf(['A go/kill decision. The SOP, from the SOP.'], 'en'), 'A go-kill decision. The S O P, from the S O P.');
  const en = 'Stage-gate, a gate, Agile-Stage-Gate, Cooper, a long-lead item, the design freeze, set-based design, Toyota, SAFe';
  assert.equal(speakOf([en], 'en'), en);
});

// The cutover weekend (pm.itproject.cutover): the go-live words as Dutch ERP
// and MES projects say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: cutover ("KUU-too-ver": kattoover; in cutoverdraaiboek
// and cutoverlogboek split at the head, kattoover-draaiboek), freeze ("FREE-ze": friez; not in
// eng.moulding.setting's gate-freeze-studie nor pm.scaled.hybrid's caption
// "freeze in week 18", and design freeze keeps pm.scaled.hybrid's rule), key users ("kee-i uu-zers": kie joezers, as the
// user story rule), point of no return ("po-int ... ree-turn": pojnt of noo
// rie-turn), and, in this film's phrases only, plantmanager ("maa-naa-ger":
// plant-menetsjer, as the manager rules), stopwatch ("stop-watch" with a Dutch
// w-a-ch: stop-wotsj) and controleweegschalen (run together: controle-
// weegschalen). In English, cutover as "cute-over" (en_GB): cuttover. go/no-go,
// MES and hypercare keep the rules above; no other film's spoken text changes
test('speak variant: the cutover words in Dutch, cutover in English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het cutover-weekend.'), 'Het kattoover-weekend.');
  assert.equal(nl('De cutover, het cutoverdraaiboek, het cutoverlogboek. Cutover.'), 'De kattoover, het kattoover-draaiboek, het kattoover-logboek. Kattoover.');
  assert.equal(nl('Een freeze, de Freeze. De design freeze. De gate-freeze-studie. Bestellen 1 week: freeze in week 18.'), 'Een friez, de Friez. De di-zain friez. De gate-freeze-studie. Bestellen 1 week: freeze in week 18.');
  assert.equal(nl('De key users, een key user. Key users. Het point of no return.'), 'De kie joezers, een kie joezer. Kie joezers. Het pojnt of noo rie-turn.');
  assert.equal(nl('De sponsor of de plantmanager. Met een stopwatch. De controleweegschalen.'), 'De sponsor of de plant-menetsjer. Met een stop-wotsj. De controle-weegschalen.');
  assert.equal(nl('De plantmanager gelooft er niet in. Met de stopwatch.'), 'De plantmanager gelooft er niet in. Met de stopwatch.');
  assert.equal(nl('De go/no-go, de hypercare, het nieuwe MES.'), 'De go, no-go, de haiperkeer, het nieuwe M E S.');
  assert.equal(speakOf(['The cutover, a cutover plan. Cutover.'], 'en'), 'The cuttover, a cuttover plan. Cuttover.');
  const en = 'The freeze, the key users, the rollback point, a stopwatch, the checkweighers';
  assert.equal(speakOf([en], 'en'), en);
});

// A commit through the pipeline (pm.devops.pipeline): the DevOps words as
// Dutch IT teams say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: pipeline ("pi-pe-LIE-ne": paiplain), build ("buld" with
// the ui of "huis": bild), deploy, deploys, deployen and deployfrequentie
// ("DE-ploo-ie": die-ploj), Debois ("DEE-boo-is": De-bwa), Jez Humble and
// Gene Kim with Dutch j, u and g (Djez Hambul, Djien), Accelerate
// ("ak-se-lee-RAA-te": Ek-sellereet), State of DevOps ("STAA-te": Steet), mean
// time to restore ("mee-aan": mien taim toe ristoor), four keys ("fau-r
// kee-is": for kies), CI/CD ("si see-dee": sie ie sie die), continuous
// integration and continuous delivery in Dutch sounds, softwarebedrijf ("sofT-
// waa-re", split at the head), artefact (stressed AR-: arte-fact) and "in een
// waardestroom" (stressed -STROOM: waarde-stroom), jidoka (the j of "ja":
// djidoka). In English, CI/CD as letters
// (it reads CI as the word "sigh"); no other film's spoken text changes
test('speak variant: the DevOps words in Dutch, CI/CD in English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De pipeline, Pipelines. De build, een Build. Een deploy, de deploys, deployen. De deployfrequentie, Deployfrequentie.'),
    'De paiplain, Paiplains. De bild, een Bild. Een die-ploj, de die-plojs, die-plojen. De die-ploj-frequentie, Die-ploj-frequentie.');
  assert.equal(nl('Patrick Debois. Nicole Forsgren, Jez Humble en Gene Kim. Het boek Accelerate. Het State of DevOps-rapport.'),
    'Patrick De-bwa. Nicole Forsgren, Djez Hambul en Djien Kim. Het boek Ek-sellereet. Het Steet of Dev-ops-rapport.');
  assert.equal(nl('MTTR, mean time to restore. De vier sleutels, four keys. Vaak CI/CD: continuous integration en continuous delivery.'),
    'MTTR, mien taim toe ristoor. De vier sleutels, for kies. Vaak sie ie sie die: kon-tinjoe-wus inte-gree-sjun en kon-tinjoe-wus de-livvrie.');
  assert.equal(nl('Geen softwarebedrijf. Een Softwarebedrijf. Het artefact, Artefact. Doorlooptijd in een waardestroom.'),
    'Geen software-bedrijf. Een Software-bedrijf. Het arte-fact, Arte-fact. Doorlooptijd in een waarde-stroom.');
  assert.equal(nl('een builder, de waardestroom, een artefacten-lijst, continuous process'), 'een builder, de waardestroom, een artefacten-lijst, continuous process');
  assert.equal(nl('Dat is jidoka. Jidoka, de Toyota-gedachte.'), 'Dat is djidoka. Djidoka, de Tojota-gedachte.');
  assert.equal(speakOf(['Often called CI/CD, continuous integration.'], 'en'), 'Often called C I C D, continuous integration.');
  const en = 'The pipeline, the build, a deployment, Patrick Debois, Jez Humble and Gene Kim, Accelerate, the State of DevOps report, mean time to restore, the four keys, an artefact';
  assert.equal(speakOf([en], 'en'), en);
});

// MoSCoW and an MVP (pm.itproject.mvp): the requirements and MoSCoW words as
// Dutch IT projects say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: requirement ("ree-kvi-re-MENT": ri-kwaijurmunt), MoSCoW
// (it spells "mo S ko W": Moskou), the four bins in English sounds (it reads
// "haa-ve", "sjout", "kout", "won": Must hev, Sjoed hev, Koed hev, Woont hev
// dis taim; Shoulds and Coulds as Sjoeds, Koeds), Oracle ("OO-rak-le":
// Orrekul), the Agile Business Consortium (Biznis, as the business case rule),
// MVP ("em-fee-pee": em vee pee), minimum viable product ("vie-ab-le PROO-dukt":
// vaaiebul prodduct), Frank Robinson ("rob-in-SON": Robbinsun), Eric Ries
// ("e-RIK": Erik), The Lean Startup ("lee-an": de Lien Startap), the Minimum
// Usable SubseT ("uu-za-ble sub-se tee": Joezebul Sabset), to-be-proces
// ("too-bee-ee": toe-bie-proces), go-live ("go-lie-ve": goo-laiv),
// businessanalist ("buu-zie-nes": biznis-analist), voedselbatches (the batch
// rule's betsj). A lone Must keeps its voice. In English, MoSCoW as Moscow
// (en_GB spells it), Eric Ries as Reese ("rise") and SubseT as Subset; no other
// film's spoken text changes
test('speak variant: the requirements and MoSCoW words in Dutch, MoSCoW, Ries and SubseT in English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Een requirement, de requirements. Requirements schrijf je samen.'), 'Een ri-kwaijurmunt, de ri-kwaijurmunts. Ri-kwaijurmunts schrijf je samen.');
  assert.equal(nl('MoSCoW sorteert: Must have, Should have, Could have en Won\'t have this time. Een Won’t have.'),
    'Moskou sorteert: Must hev, Sjoed hev, Koed hev en Woont hev dis taim. Een Woont hev.');
  assert.equal(nl('De Musts, de Shoulds, de Coulds. Ze worden Should. Een Must.'), 'De Musts, de Sjoeds, de Koeds. Ze worden Sjoed. Een Must.');
  assert.equal(nl('Dai Clegg bij Oracle. Het Agile Business Consortium. DSDM noemt de Musts de Minimum Usable SubseT.'),
    'Dai Clegg bij Orrekul. Het Edjail Biznis Consortium. DSDM noemt de Musts de Minimum Joezebul Sabset.');
  assert.equal(nl('MVP staat voor minimum viable product, van Frank Robinson. Eric Ries, The Lean Startup. De MVP-lijn.'),
    'em vee pee staat voor minimum vaaiebul prodduct, van Frank Robbinsun. Erik Ries, de Lien Startap. De em vee pee-lijn.');
  assert.equal(nl('Het to-be-proces, na de go-live, een businessanalist, voedselbatches traceren.'), 'Het toe-bie-proces, na de goo-laiv, een biznis-analist, voedselbetsjes traceren.');
  assert.equal(nl('Die vertaalt tussen business en IT. Om op een echte lijn live te gaan.'), 'Die vertaalt tussen biznis en IT. Om op een echte lijn laiv te gaan.');
  assert.equal(nl('De business, live muziek.'), 'De business, live muziek.');
  assert.equal(speakOf(['MoSCoW, by Dai Clegg. Eric Ries. The Minimum Usable SubseT.'], 'en'), 'Moscow, by Dai Clegg. Eric Reese. The Minimum Usable Subset.');
  const en = 'Must have, Should have, Could have and Won\'t have this time, Oracle, DSDM, an MVP, minimum viable product, Frank Robinson, The Lean Startup, go-live, the to-be process, a business analyst';
  assert.equal(speakOf([en], 'en'), en);
});

// The user acceptance test (pm.itproject.uat): the test words as Dutch ERP and
// MES projects say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: UAT (it reads the word "uu-at": U A T, letters),
// acceptatietest(en) and gebruikersacceptatietest (it reads "-taa-ti-test"
// with a t for ts: split at their parts), testdata ("tes-TAA-taa":
// test-data), softwaretesten ("soft-waa-ree-": software-testen), ISTQB ("ist-k-p": ie es tee kuu bee, letters; not "S", a lone S
// is a hiss), sign-off ("sig-n-of" with a Dutch g: sain-of), happy path
// ("hap-pie pat": heppi paath), regressietest and regressieset (stressed
// RE-gres-si: split at the head, re-GRES-sie-test); hertest keeps its voice
// (already her-TEST), and so does a gloss "(sign-off)" on a Dutch caption
// (pm.land.handover). In English ISTQB as letters (en_GB reads
// "ist-k-b"). key users, go-live and MES keep the rules above; no other film's
// spoken text changes
test('speak variant: the acceptance test words in Dutch, ISTQB in English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Dan de UAT, de gebruikersacceptatietest. ISTQB omschreef het.'), 'Dan de U A T, de gebruikers-acceptatie-test. ie es tee kuu bee omschreef het.');
  assert.equal(nl('Hij omschreef acceptatietesten. Een Acceptatietest. Met verzonnen testdata, Testdata. Voor softwaretesten.'), 'Hij omschreef acceptatie-testen. Een Acceptatie-test. Met verzonnen test-data, Test-data. Voor software-testen.');
  assert.equal(nl('De UAT eindigt met een sign-off. Een Sign-off. Alleen het happy path.'), 'De U A T eindigt met een sain-of. Een Sain-of. Alleen het heppi paath.');
  assert.equal(nl('Een regressietest, een regressieset. Een hertest, hertesten wat gezakt is. Hertest.'), 'Een regressie-test, een regressie-set. Een hertest, hertesten wat gezakt is. Hertest.');
  assert.equal(nl('De ondertekening (sign-off): elk criterium met bewijs.'), 'De ondertekening (sign-off): elk criterium met bewijs.');
  assert.equal(nl('De key users, na de go-live, het nieuwe MES.'), 'De kie joezers, na de goo-laiv, het nieuwe M E S.');
  assert.equal(nl('De acceptatie, een regressie, de herten, een signaal, de data, een testdatabank.'), 'De acceptatie, een regressie, de herten, een signaal, de data, een testdatabank.');
  assert.equal(speakOf(['ISTQB, the international board for software testing.'], 'en'), 'I S T Q B, the international board for software testing.');
  const en = 'The UAT, the user acceptance test, sign-off, the happy path, a regression test, a retest';
  assert.equal(speakOf([en], 'en'), en);
});

// Incident, problem, change (pm.devops.incident): the ITIL words as Dutch IT
// teams say them, checked with espeak-ng phonemes through Piper's nl_NL-alex
// bridge: PeopleCert ("pee-o-ple sert": Piepul-surt), change enablement and
// change control with a French "change" ("sjanzje": tsjeensj e-neebul-munt,
// tsjeensj kontrool) and printerdriver ("printer-drie-ver": printer-draaiver,
// as the driver rule, which only reads a word that starts with driver). ITIL,
// servicedesk, MES (letters) and firewall (the existing fajerwol rule) keep
// their voice. English needs nothing; no other film's spoken text changes
test('speak variant: the ITIL words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('ITIL 4 is nu van het bedrijf PeopleCert.'), 'ITIL 4 is nu van het bedrijf Piepul-surt.');
  assert.equal(nl('ITIL noemt dat nu change enablement, eerst heette het change control.'),
    'ITIL noemt dat nu tsjeensj e-neebul-munt, eerst heette het tsjeensj kontrool.');
  assert.equal(nl('Een andere printerdriver, een Printerdriver. Een aangepaste firewall-regel.'),
    'Een andere printer-draiver, een Printer-draiver. Een aangepaste fajerwol-regel.');
  assert.equal(nl('De servicedesk, de change, een printer, de driver.'), 'De servicedesk, de change, een printer, de draiver.');
  const en = 'ITIL 4 is owned by PeopleCert: change enablement, at first change control, a printer driver, a firewall rule';
  assert.equal(speakOf([en], 'en'), en);
});

// The post-mortem (pm.devops.postmortem): the words of a post-mortem as Dutch
// IT teams say them, checked with espeak-ng phonemes through Piper's
// nl_NL-alex bridge: incidentreview ("re-VIEW": incident-rievjoe, as Sprint
// Review), Site Reliability Engineering ("ree-li-aa-bi-li-ti eng-i-neer-ing":
// Sait Rielaaje-bilitti Entsjinieering), postmortemcultuur stressed on -tem
// (post-mortem-cultuur), blameless ("blaa-me-less": bleemlus), workaround
// ("wor-kaa-raunt": wurk-erraund) and update ("up-DAA-te": updeet). Post-mortem,
// schuldvrij, servicedesk, scanners, OT and IT-manager keep their voice;
// Taiichi Ohno and Toyota go through the existing rules. English needs
// nothing; no other film's spoken text changes
test('speak variant: the post-mortem words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Een post-mortem, ook wel incidentreview. Incidentreviews.'), 'Een post-mortem, ook wel incident-rievjoe. Incident-rievjoes.');
  assert.equal(nl('Het boek Site Reliability Engineering, met een hoofdstuk over een postmortemcultuur.'),
    'Het boek Sait Rielaaje-bilitti Entsjinieering, met een hoofdstuk over een post-mortem-cultuur.');
  assert.equal(nl('De bespreking is schuldvrij, blameless. Een workaround, twee workarounds.'),
    'De bespreking is schuldvrij, bleemlus. Een wurk-erraund, twee wurk-erraunds.');
  assert.equal(nl('Een geplande update, nooit in de IT-updates. Update de lijst.'), 'Een geplande updeet, nooit in de IT-updeets. Updeet de lijst.');
  assert.equal(nl('Taiichi Ohno maakte die methode bekend bij Toyota. De IT-manager, de servicedesk, de scanners onder OT.'),
    'Taitsjie Oono maakte die methode bekend bij Tojota. De IT-manager, de servicedesk, de scanners onder OT.');
  const en = 'A post-mortem, an incident review, the book Site Reliability Engineering, postmortem culture, blameless, a workaround, the IT updates, Taiichi Ohno at Toyota';
  assert.equal(speakOf([en], 'en'), en);
});

// Forecasting and steering on flow (pm.agile.forecast): the forecasting and
// flow words as Dutch agile teams say them, checked with espeak-ng phonemes
// through Piper's nl_NL-alex bridge: onzekerheidskegel (stressed kə-GEL:
// onzekerheids-kegel), Barry Boehm ("boehm": Beem), Steve McConnell ("stee-ve
// em-see konnel": Stiev Me-konnul), Troy Magennis ("troo-ie MAA-ge-nis": Troj
// Me-gennis), NoEstimates ("es-ti-MAA-tes": Noo-estimets), verpakkingsfolie
// (stressed fo-LIE: verpakkings-fooli), labelsysteem ("laa-bel": leebul-systeem),
// service level expectation ("su-ves lee-VEL": Surrvis levvul ekspek-teesjun),
// cycle times ("sik-le tie-mes": saikl taims; cycle time has its rule already),
// behoud van flow ("flouw": floo, as the flowmaten rule), bezettingsgraad and
// wachtrijmodel (stressed at the end: split at the head), Donald Reinertsen
// ("doo-nalt rei-": Donnuld Rainurtsen), productontwikkeling ("-ont-wi-kee-ling":
// split), wachtrijen in "vastloopt in wachtrijen" (stressed -RIJ-en:
// wacht-rijen), machinesoftware in "voor machinesoftware bij" ("soft-waa-re":
// machine-software, read in English as in the software-test rule), a single
// item ("ie-tem": aitem, as the work item age rule; only after per,
// zeventiende and Één, and in "een item duurt" and "een item de grens") and the backlog in "meer backlog" ("bak-loch":
// bek-lok, as the Backlog rule). In English Boehm as Beem, Vacanti and Magennis
// with their stress ("VAY-kanti", "MAY-jenis": Vuh-kanti, Muh-ghennis),
// Reinertsen as Rine-ertsen and heijunka after "buffers and" with the Japanese
// vowels ("HIGH-junka": heyjoonka). No other film's spoken text changes
test('speak variant: the forecasting and flow words in Dutch and English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De onzekerheidskegel is een model van Barry Boehm, later uitgewerkt door Steve McConnell.'),
    'De onzekerheids-kegel is een model van Barry Beem, later uitgewerkt door Stiev Me-konnul.');
  assert.equal(nl('Daniel Vacanti en Troy Magennis. NoEstimates kwam op gang. Een Monte Carlo-simulatie trekt weken.'),
    'Daniel Va-kenti en Troj Me-gennis. Noo-estimets kwam op gang. Een Monte Carlo-simulatie trekt weken.');
  assert.equal(nl('Een maker van verpakkingsfolie vervangt het labelsysteem. Twintig procent meer backlog doet.'),
    'Een maker van verpakkings-fooli vervangt het leebul-systeem. Twintig procent meer bek-lok doet.');
  assert.equal(nl('Een service level expectation, de cycle times, behoud van flow.'), 'Een surrvis levvul ekspek-teesjun, de saikl taims, behoud van floo.');
  assert.equal(nl('De bezettingsgraad, het eenvoudigste wachtrijmodel. Donald Reinertsen: productontwikkeling vastloopt in wachtrijen.'),
    'De bezettings-graad, het eenvoudigste wacht-rij-model. Donnuld Rainurtsen: product-ontwikkeling vastloopt in wacht-rijen.');
  assert.equal(nl('Een team voor machinesoftware bij een maker. Per item, hoe lang een item duurt, nadert een item de grens, het zeventiende item. Één item staat.'),
    'Een team voor machine-software bij een maker. Per item, hoe lang een aitem duurt, nadert een aitem de grens, het zeventiende aitem. Één aitem staat.');
  assert.equal(nl('Schatten per item. Data en machinesoftware, kleine wachtrijen ertussen, wat een item is.'), 'Schatten per aitem. Data en machinesoftware, kleine wachtrijen ertussen, wat een item is.');
  assert.equal(nl('De cycle time, de flow, het item, de items, een backlog, de Backlog, de folie.'), 'De saikl taim, de flow, het item, de items, een backlog, de Bek-lok, de folie.');
  assert.equal(speakOf(['A model from Barry Boehm. Daniel Vacanti and Troy Magennis. Donald Reinertsen showed it. The reason for buffers and heijunka.'], 'en'),
    'A model from Barry Beem. Daniel Vuh-kanti and Troy Muh-ghennis. Donald Rine-ertsen showed it. The reason for buffers and heyjoonka.');
  const en = 'The cone of uncertainty, Steve McConnell, NoEstimates, a Monte Carlo simulation, Vacanti, heijunka, level scheduling, the service level expectation, cycle times';
  assert.equal(speakOf([en], 'en'), en);
});

// Rollout and data migration (pm.itproject.migration): the words of an ERP or
// MES rollout as Dutch projects say them, checked with espeak-ng phonemes
// through Piper's nl bridge: SAP Activate's phase names ("pree-paa-re,
// eks-ploo-re, ree-aa-lie-ze": pri-peer, ek-sploor, rie-je-laaiz; run with the
// Dutch u: ran; deploy through the pipeline film's rule), Activate
// ("ak-tie-VAA-te": Ektiveet), legacysysteem ("lee-gaa-sie": legge-sie-systeem),
// big bang ("big bang" with a Dutch a: big beng), Hershey ("her-SJEE-ie":
// Hur-sjie), Halloween ("ha-lo-ween": Hellowien), business ("bu-ZIE-nes": biznis,
// in this film's two phrases), Engineering ("ENG-ie-nie-ring": Entsjinieering, as
// the post-mortem film), proefrun ("proef-run": proef-ran), records
// ("re-KORTS": rekkords), getimed ("ge-TIE-med": getaimd), timing ("TIE-ming": taiming) and live in "nooit
// live" and "data live" ("lie-ve": laiv). Stamdata, pilot, piekseizoen, go-live
// and MES keep the rules above; English needs nothing; no other film's spoken
// text changes
test('speak variant: the rollout and migration words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De methode van SAP, SAP Activate, noemt de kernfases prepare, explore, realize, deploy en run.'),
    'De methode van SAP, SAP Ektiveet, noemt de kernfases pri-peer, ek-sploor, rie-je-laaiz, die-ploj en ran.');
  assert.equal(nl('Het oude, het legacysysteem. Bij een big bang, een Big bang.'), 'Het oude, het legge-sie-systeem. Bij een big beng, een Big beng.');
  assert.equal(nl('Hershey ging over, toen de bestellingen voor Halloween binnenkwamen.'), 'Hur-sjie ging over, toen de bestellingen voor Hellowien binnenkwamen.');
  assert.equal(nl('Dat is werk voor de business. Voor het resultaat tekent de business, niet IT.'), 'Dat is werk voor de biznis. Voor het resultaat tekent de biznis, niet IT.');
  assert.equal(nl('Engineering lost de dubbelingen op. Een proefrun, een Proefrun. Hoeveel records er mislukt zijn.'),
    'Entsjinieering lost de dubbelingen op. Een proef-ran, een Proef-ran. Hoeveel rekkords er mislukt zijn.');
  assert.equal(nl('De laatste wordt getimed. De timing telt. Ga dus nooit live, en gaat vuile data live om later op te lossen.'),
    'De laatste wordt getaimd. De taiming telt. Ga dus nooit laiv, en gaat vuile data laiv om later op te lossen.');
  assert.equal(nl('De pilot, de stamdata, het piekseizoen, de go-live, een nieuw MES in.'), 'De pailot, de stam-data, het piek-seizoen, de goo-laiv, een nieuw em ee es in.');
  assert.equal(nl('De business case, de records, live gaan, de run, het blad CIO, de timing.'), 'De biznis kees, de records, live gaan, de run, het blad CIO, de timing.');
  const en = 'SAP Activate calls the core phases prepare, explore, realize, deploy and run; the legacy system, a big bang, Hershey at Halloween, the business, engineering, a mock migration, records';
  assert.equal(speakOf([en], 'en'), en);
});

// The field film "a project from start to finish" (pm.field.lifecycle), checked
// with espeak-ng phonemes through Piper's nl bridge: it reads intake as
// "IN-taa-ke" (said in-teek, as Dutch project people say it; only after "de",
// the way the film says it), operators as "OO-pi-raa-tors" (ope-raators, as the
// rules above, only in "De operators krijgen") and oranje with the stress on
// the o (o-ranje, only in "nu op oranje"). Werkinstructie, nulmeting, terugblik,
// stuurgroep, wijzigingsverzoek and watermeloenproject need nothing; English
// needs nothing; no other film's spoken text changes
test('speak variant: the field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het eerste station is de intake. Sla je de intake over, begin bij de intake.'), 'Het eerste station is de in-teek. Sla je de in-teek over, begin bij de in-teek.');
  assert.equal(nl('De operators krijgen een werkinstructie.'), 'De ope-raators krijgen een werkinstructie.');
  assert.equal(nl('Dus zet je de status nu op oranje.'), 'Dus zet je de status nu op o-ranje.');
  // elsewhere the words keep their voice
  assert.equal(nl('De Intake, een intake, de operators wachten, van oranje naar rood.'), 'De Intake, een intake, de operators wachten, van oranje naar rood.');
  const en = 'The first station is the intake. The operators get a work instruction, so you set the status to amber now.';
  assert.equal(speakOf([en], 'en'), en);
});

// The tools named in the module intro and the field film (the Checkpoint of 14 Nov), checked with espeak-ng
// phonemes through Piper's nl bridge: scopeomschrijving is read "skoope-omschrijving" (said skoop-omschrijving,
// as the scope rule above) and resourcehistogram "REE-zoors" (said ri-sors-histogram). Run chart and
// projectopdracht have their rules above. WBS, Gantt-chart, netwerkplanning, driepuntsschatting, analoog
// schatten, RACI, SIPOC, A3-statusrapport, besluitenlijst, vaardigheidsmatrix, overdrachtschecklist and
// eindrapport need nothing;
// English needs nothing; no other film's spoken text changes
test('speak variant: the tools named in the intro and field films, in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Bij het opdelen gebruiken we vaak een WBS en een scopeomschrijving.'), 'Bij het opdelen gebruiken we vaak een WBS en een skoop-omschrijving.');
  assert.equal(nl('Bij risico’s en mensen gebruiken we vaak een RACI en een resourcehistogram.'), "Bij risico's en mensen gebruiken we vaak een RACI en een ri-sors-histogram.");
  assert.equal(nl('Bij de intake gebruiken we vaak een projectopdracht en een SIPOC.'), 'Bij de in-teek gebruiken we vaak een project-opdracht en een SIPOC.');
  assert.equal(nl('Bij het afsluiten gebruiken we vaak een run chart en een eindrapport.'), 'Bij het afsluiten gebruiken we vaak een run tsjart en een eindrapport.');
  // elsewhere the words keep their voice
  assert.equal(nl('Een Scopeomschrijving hier. Het scopedocument.'), 'Een Skoop-omschrijving hier. Het scopedocument.');
  const en = 'We often use a scope statement, a resource histogram and a run chart.';
  assert.equal(speakOf([en], 'en'), en);
});

// The field film "people and influence" (pm.field.people), checked with espeak-ng
// phonemes through Piper's nl bridge: it reads the English "second opinion" as
// "sekont opinion" (said sekkend opinjen, only after "vragenset en een"). SBI has
// its rule above; BATNA, KPI-boom, triangulatie, vragenset and prestatiebord
// need nothing; English needs nothing; no other film's spoken text changes
test('speak variant: the people field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Je gebruikt een vragenset en een second opinion.'), 'Je gebruikt een vragenset en een sekkend opinjen.');
  assert.equal(nl('Daarbij gebruik je vaak SBI en actief luisteren.'), 'Daarbij gebruik je vaak es bee ie en actief luisteren.');
  // elsewhere the words keep their voice
  assert.equal(nl('Vraag een second opinion bij een BATNA.'), 'Vraag een second opinion bij een BATNA.');
  const en = 'You often use SBI and active listening. You use a question set and a second opinion.';
  assert.equal(speakOf([en], 'en'), en);
});

// The field film "portfolio and consulting" (pm.field.portfolio), checked with
// espeak-ng phonemes through Piper's nl bridge: it stresses adVIES... as ADvies-vak
// (said advies-vak with the stress on vies), vertrouwensforMUle with the main stress on mu
// (said vertrouwens-formule, stress on trou) and plantmanager with a hard g (said
// plant-menetsjer, in the film's two phrases only). diagnosefase keeps its voice (it
// reads right, as in the proposal film); governance, capaciteitsstreep, offerte,
// besluitenlijst and programma's have rules or need nothing; English needs nothing;
// no other film's spoken text changes
test('speak variant: the portfolio field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het tweede station is Het adviesvak. Een adviesvak.'), 'Het tweede station is Het advies-vak. Een advies-vak.');
  assert.equal(nl('Je gebruikt een diagnosefase en de vertrouwensformule.'), 'Je gebruikt een diagnosefase en de vertrouwens-formule.');
  assert.equal(nl('Nu adviseer je de plantmanager welke er komen. De plantmanager betaalt.'), 'Nu adviseer je de plant-menetsjer welke er komen. De plant-menetsjer betaalt.');
  // elsewhere the words keep their voice
  assert.equal(nl('Eerst een diagnosefase: kort en goedkoop.'), 'Eerst een diagnosefase: kort en goedkoop.');
  assert.equal(nl('Vraag het de plantmanager.'), 'Vraag het de plantmanager.');
  const en = 'The second station is The consulting craft. You use a diagnostic phase and the trust equation.';
  assert.equal(speakOf([en], 'en'), en);
});

// The field film "IT and agile" (pm.field.it), checked with espeak-ng phonemes through
// Piper's nl bridge: it reads the letter W as "vee" (WSJF said wee es jee ef) and
// plantmanager with a hard g (said plant-menetsjer, only in "voor de plantmanager").
// The IT and agile words (sprint, kanbanbord, planning poker, pipeline, feature flag,
// go-live, cutover, MoSCoW, MES, SAFe, agile) have rules above or need nothing; English
// needs nothing; no other film's spoken text changes
test('speak variant: the IT and agile field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Je gebruikt PI Planning en WSJF.'), 'Je gebruikt PI Planning en wee es jee ef.');
  assert.equal(nl('Jij leidt dat IT-project voor de plantmanager.'), 'Jij leidt dat IT-project voor de plant-menetsjer.');
  // elsewhere plantmanager keeps its voice
  assert.equal(nl('Vraag het de plantmanager.'), 'Vraag het de plantmanager.');
  const en = 'You use PI Planning and WSJF. You lead that IT project for the plant manager.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Run module intro (pm.run.intro), checked with espeak-ng phonemes through Piper's nl bridge: it reads
// "impactanalyse" as "-aa-na-lie-se" with an s (ˌiɪsə), "impact-analiese" as ˈɪmpɑktˌaːnaːlˈizə; and
// "issuelog" as "is-uu-eh-log" (ˈɪsyˌeːlɔx), "isjoelog" as ˈɪʃulˌɔx, as the pre-mortem's rule says issue.
// No other word changes; English reads both words right and needs nothing.
test('speak variant: impactanalyse and issuelog in Dutch (the Run intro)', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('We gebruiken een wijzigingslog en een impactanalyse.'), 'We gebruiken een wijzigingslog en een impact-analiese.');
  assert.equal(nl('Een Impactanalyse per verzoek.'), 'Een Impact-analiese per verzoek.');
  assert.equal(nl('Het komt in de issuelog, met één eigenaar.'), 'Het komt in de isjoelog, met één eigenaar.');
  assert.equal(nl('Een analyse van de issues.'), 'Een analyse van de isjoes.');
  const en = 'We use an impact analysis and an issue log.';
  assert.equal(speakOf([en], 'en'), en);
});

// DevOps in Dutch (Task 20), checked with espeak-ng phonemes through Piper's nl bridge:
// "DevOps" is read dˈɛf ˈɔps ("def ops"); "Dev-ops" is read dˈɛvˈɔps, a v as in "developer".
// The rule takes the word as the films write it (DevOps, DevOps-rapport, DevOpsDays,
// "State of DevOps" after its own rule). English reads dˈɛv ˈɒps and needs nothing.
test('speak variant: DevOps in Dutch is said with a v, English is left alone', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Bij DevOps hoort een pijplijn.'), 'Bij Dev-ops hoort een pijplijn.');
  assert.equal(nl('Het DevOps-rapport en de DevOpsDays.'), 'Het Dev-ops-rapport en de Dev-opsDays.');
  assert.equal(nl('Het State of DevOps rapport.'), 'Het Steet of Dev-ops rapport.');
  assert.equal(nl('Een Devops-team.'), 'Een Dev-ops-team.');
  // other words keep their voice
  assert.equal(nl('De ontwikkelaars en operations.'), 'De ontwikkelaars en operations.');
  const en = 'DevOps joins development and operations.';
  assert.equal(speakOf([en], 'en'), en);
});

// English IT words in the Dutch voice (Task 22), checked with espeak-ng phonemes through Piper's nl bridge and
// the free large-v3-turbo transcript of the real voice. WIP: espeak-ng spells the capitals "vee ie pee" (heard
// "VIP-limiet"); said "wip", as Dutch teams do (ʋˈɪp). Rollbackplan: "rol-bak-plan" (heard "rolbakplan"); said
// "rolbek plan" (rˈɔlbɛk plˈɑn). Versiebeheer: espeak-ng reads the compound with an s ("vərsˈibəhˌɪːr"); split,
// "versie" keeps its z (vˈɛrzibəhˈɪːr). Agile ("edjail": ɛtjɑjl) and Daily Scrum ("Deili": dˈɛɪli) are in the
// rules of their own films above. Planning poker, DORA, post-mortem and feature flag are read right as they are.
// English is left alone.
test('speak variant: WIP, rollback and versiebeheer in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('WIP is begonnen werk. Een WIP-limiet en WIP-limieten.'), 'wip is begonnen werk. Een wip-limiet en wip-limieten.');
  assert.equal(nl('Een rollbackplan en een rollback.'), 'Een rolbek plan en een rolbek.');
  assert.equal(nl('Versiebeheer en goed versiebeheer.'), 'Versie-beheer en goed versie-beheer.');
  // the other words keep their voice
  assert.equal(nl('Planning poker, DORA en een post-mortem.'), 'Planning poker, DORA en een post-mortem.');
  assert.equal(nl('Een work in progress.'), 'Een work in progress.');
  const en = 'The WIP limit, a rollback plan and version control.';
  assert.equal(speakOf([en], 'en'), en);
});

// The module intro film of Intake (pm.intake.intro), checked with espeak-ng phonemes through Piper's nl bridge:
// "blokkeerder" is read blˈɔk ɪːr dər, the long ee shortened and the stress on blok ("BLOK-i-der");
// "blok-keerder" is read blˈɔk kˈɪːrdər, with the second stress on keer, as it is said. Only in this
// film's phrase: pm.run.escalation and pm.intake.stakeholders keep their voice. The film's other words
// (business case in two words, stakeholdermap, kick-off, SCQ, 5 keer waarom, vragenboom, de intake) go
// through the rules above or are read right as they are.
test('speak variant: blokkeerder in the Intake intro phrase only', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('En een blokkeerder kan het stoppen, ook zonder nee te zeggen.'), 'En een blok-keerder kan het stoppen, ook zonder nee te zeggen.');
  // elsewhere the word keeps its voice
  assert.equal(nl('Vraag de twee blokkeerders vooraf.'), 'Vraag de twee blokkeerders vooraf.');
  assert.equal(nl('Een blokkeerder is iemand wiens belang geraakt wordt.'), 'Een blokkeerder is iemand wiens belang geraakt wordt.');
  // the words the film leans on that already have rules
  assert.equal(nl('Eerst komt de intake en dan een business case en een nulmeting.'), 'Eerst komt de in-teek en dan een biznis kees en een nul-meting.');
  const en = 'And a blocker can stop it, even without saying no.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Land module intro (pm.land.intro), checked with espeak-ng phonemes through Piper's nl bridge:
// "follow-up" with a Dutch-English switch (fˈɔlɔw(en)ˈʌp(nl)), said follo-ap (fˈɔloːˈɑp); "trigger" with a soft g
// ("tri-gher", trˈɪɣər), said trikker (trˈɪkər, as the handover rule above); and "after-action review" as
// "afterakshon" and "ree-viw" (ˈɑftˌɛrɑkʃˈɔn, reːvˈiw), said after-eksjun (ˈɑftˌɛrˈɛkʃɵn, the stress on eks as in
// English) and rievjoe (rˈivju, as Sprint Review). Only in this film's phrases; the handover lesson's trigger and
// other films' reviews keep their voice. The film's one "De operators krijgen" is the field film's rule; its other
// sentences say iemand, ze and mensen, so operators need no rule of their own.
test('speak variant: the Land intro phrases', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Spreek vooraf een follow-up af en een trigger.'), 'Spreek vooraf een follo-ap af en een trikker.');
  assert.equal(nl('We gebruiken vaak een A3-rapport en een after-action review.'), 'We gebruiken vaak een A3-rapport en een after-eksjun rievjoe.');
  assert.equal(nl('De operators krijgen een werkinstructie.'), 'De ope-raators krijgen een werkinstructie.');
  // elsewhere the words keep their voice
  assert.equal(nl('Een operator volgt de instructie.'), 'Een operator volgt de instructie.');
  assert.equal(nl('Plan een follow-up en een trigger.'), 'Plan een follow-up en een trigger.');
  assert.equal(nl('Een after-action review na afloop.'), 'Een after-action review na afloop.');
  const en = 'An operator follows it. Agree a follow-up and a trigger, then an after-action review.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Scaling module intro (pm.scaled.intro), checked with espeak-ng phonemes through Piper's nl bridge: it reads
// LeSS as the letters "le es es" (said Less, lˈɛss), "Sprint Planning One" with the Dutch number "oone" (said Wan,
// ʋˈɑn), Spotify with the Dutch i (said Spotifai, spˈoːtifˌɑj) and Lean as "lee-an" (said Lien, as the Lean-consultant
// rule), in "Lean budgets" and "Lean business case" only. English reads LeSS as letters too (said Less);
// Cross-Team Refinement has its rule above, and the film's plant manager phrases are the ones the rules above cover.
// Everything else of the film (SAFe, PI Planning, ART Planning Board, WSJF, stage-gate, gate, design freeze, Product
// Owner, feature teams, epics, portfolio, Portfolio Kanban, terugplannen) has a rule above or reads right; no other
// film's spoken text changes
test('speak variant: the Scaling intro words', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Er zijn ook LeSS en Nexus.'), 'Er zijn ook Less en Nexus.');
  assert.equal(nl('Sprint Planning One van LeSS.'), 'Sprint Planning Wan van Less.');
  assert.equal(nl('Het Spotify-model.'), 'Het Spotifai-model.');
  assert.equal(nl('Het tweede onderwerp is Portfolio en Lean budgets.'), 'Het tweede onderwerp is Portfolio en Lien budgets.');
  assert.equal(nl('We gebruiken vaak een Lean business case en een Portfolio Kanban.'), 'We gebruiken vaak een Lien biznis kees en een Portfolio Kanban.');
  assert.equal(nl('Op Expert komen Lean budgets, de kritiek op SAFe erbij.'), 'Op Expert komen Lien budgets, de kritiek op Seef erbij.');
  assert.equal(nl('Dat is een beslismoment voor de plantmanager.'), 'Dat is een beslismoment voor de plant-menetsjer.');
  // elsewhere the words keep their voice
  assert.equal(nl('Een Lean-team met een Lean aanpak.'), 'Een Lean-team met een Lean aanpak.');
  assert.equal(speakOf(['There are also LeSS and Nexus.'], 'en'), 'There are also Less and Nexus.');
  const en = 'Sprint Planning One of the Spotify model. The plant manager picks Lean budgets.';
  assert.equal(speakOf([en], 'en'), en);
});

// The When you're stuck module intro (pm.stuck.intro), checked with espeak-ng phonemes through Piper's nl bridge:
// it reads "tussenbericht" as "tussen-BEER-icht" (tˈɵsənbˌɪːrɪxt, the be of bericht lengthened and stressed); said
// "tussen-bericht" it reads tˈɵsənbərˈɪxt, the stress of bericht. Only in this film's phrase "een tussenbericht en
// een bandbreedte": no other film says the word. The film's other words (triangulatie, besluitenlijst, bandbreedte,
// weerstand, terugbelmoment, sponsorgesprek, rugdekking, kleine successen, escaleer, blokkeren) are read right as
// they are, and it says "de ploeg" and "de mensen van de lijn" instead of operators; no other film's spoken text changes
test('speak variant: the tussenbericht of the stuck intro', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Bij niet weten gebruiken we een tussenbericht en een bandbreedte.'), 'Bij niet weten gebruiken we een tussen-bericht en een bandbreedte.');
  // elsewhere the word keeps its voice
  assert.equal(nl('Stuur een tussenbericht naar de klant.'), 'Stuur een tussenbericht naar de klant.');
  assert.equal(nl('Een bericht en een bandbreedte.'), 'Een bericht en een bandbreedte.');
  const en = 'When you do not know we use a holding statement and a range.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Leading people module intro (pm.lead.intro), checked with espeak-ng phonemes through Piper's nl bridge: it reads
// "Radical Candor" in the Dutch way, "RAA-dikal KAN-dor" (rˈaːdikˌɑl kˈɑndɔr); said "Redikal Kander" it reads
// rˈeːdikˌɑl kˈɑndər, as the English name sounds. Only in this film's phrase "en Radical Candor" (SBI has its rule above
// and goes first, Toyota its rule from pm.land.training): no other film says the name. The film's other words
// (stakeholderkaart, feedforward, actief luisteren, MORE PIES, Kata, herkaderen, valuta, coachingscycli, psychologische) are
// read right as they are, and it says "de ploeg" instead of operators; no other film's spoken text changes
test('speak variant: Radical Candor of the lead intro', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Op Werkkennis komen de fasen van een team, de grens met manipulatie, Toyota Kata en Radical Candor erbij.'), 'Op Werkkennis komen de fasen van een team, de grens met manipulatie, Tojota Kata en Redikal Kander erbij.');
  assert.equal(nl('Bij feedback gebruiken we SBI en feedforward.'), 'Bij fiedbek gebruiken we es bee ie en fiedforwerd.');
  // elsewhere the name keeps its voice
  assert.equal(nl('Radical Candor is een model van Kim Scott.'), 'Radical Candor is een model van Kim Scott.');
  assert.equal(nl('We gebruiken actief luisteren en MORE PIES.'), 'We gebruiken actief luisteren en Mor pais.');
  const en = 'At Working knowledge you add Toyota Kata and Radical Candor.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Leading projects outside your field module intro (pm.outside.intro), checked with espeak-ng phonemes through
// Piper's nl bridge: it reads the English "second opinion" as "sekont opinion" (said sekkend opinjen), as the people
// field film's rule says it, here only after "steekproef en een" (that rule serves "vragenset en een" only, and the
// disagreement and steering films keep their voice). The film's other words (naïeve vraag, vragenset, premortem,
// besliscriteria, eenrichtingsdeuren, vertrouwensformule, contextwisseling, referentieklassen, piramideprincipe,
// terugvertellen, watermeloenstatus, meelopen, fabrieksacceptatietest, PLC-programmeur) go through
// the rules above or are read right as they are; English needs nothing; no other film's spoken text changes
test('speak variant: second opinion of the outside intro', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Met experts gebruiken we een steekproef en een second opinion.'), 'Met experts gebruiken we een steekproef en een sekkend opinjen.');
  // elsewhere the words keep their voice
  assert.equal(nl('Vraag een second opinion bij een BATNA.'), 'Vraag een second opinion bij een BATNA.');
  assert.equal(nl('Vraag een steekproef bij een second opinion.'), 'Vraag een steekproef bij een second opinion.');
  const en = 'With experts we use a spot check and a second opinion.';
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

// The IT projects module intro (pm.itproject.intro), checked with espeak-ng phonemes through Piper's bridge: Dutch reads SaaS
// as the letters "saa es" (said Sas, sˈɑs) and English reads it as "sah S" (said sass); English reads UAT as the word
// "you-at", so in this film's one phrase it is said as letters (the Dutch rule above already does that). RFP, MVP, ERP,
// triage, testscript, proefmigratie, shortlist, pilot, key users, sign-off, go-live, MoSCoW, to-be-proces, requirements and
// the rest read right or have a rule above; no other film's spoken text changes
test('speak variant: the IT projects intro words', () => {
  assert.equal(speakOf(['Huren heet SaaS, de leverancier draait het voor je.'], 'nl'), 'Huren heet Sas, de leverancier draait het voor je.');
  assert.equal(speakOf(['Renting is called SaaS, the vendor runs it for you.'], 'en'), 'Renting is called sass, the vendor runs it for you.');
  assert.equal(speakOf(['In the UAT, the user acceptance test, future users check that the MES fits.'], 'en'), 'In the U A T, the user acceptance test, future users check that the M E S fits.');
  // elsewhere the UAT keeps its voice
  assert.equal(speakOf(['The UAT ends with a sign-off.'], 'en'), 'The UAT ends with a sign-off.');
});

// The DevOps module intro (pm.devops.intro), checked with espeak-ng phonemes through Piper's nl bridge: it reads
// "testpiramide" with the stress on "raa" (tˈɛstpirˌaːmidə, test-pi-RAA-mi-de); "test-piramiede" gives
// tˈɛstpˌiraːmˈidə, the stress of piramide. The film's other words (mediaan, feature flag, post-mortem, DORA; versiebeheer and rollbackplan since Task 22,
// prioriteitsmatrix, A3, impactstraal, servicedesk) are read right or have rules above; English needs nothing
test('speak variant: the DevOps module intro word in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Bij tests gebruiken we vaak versiebeheer en een testpiramide.'), 'Bij tests gebruiken we vaak versie-beheer en een test-piramiede.');
  assert.equal(nl('De Testpiramide.'), 'De Test-piramiede.');
  const en = 'We often use version control and a test pyramid.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Programmes and governance module intro (pm.portfolio.intro), checked with espeak-ng phonemes through Piper's nl
// bridge: it reads "procesingenieurs" with a voiced z, "pro-ze-ingenieurs" (prˈoːsəzˌɪŋ...); said "proces ingenieurs", two words
// (proːsˈɛsˌɪnzjənjˈøːrs, pro-SES in-zje-NJEURS), and plain "managers" with a hard g (mˈaːnaːɣərs), said "menetsjers" as the
// manager rules above say it, only in this film's phrase "De managers die de fabriek draaien", so no other film's
// managers change. The film's other words (programmaraad, MSP, capaciteitsstreep, capaciteitsmatrix, besluitenlijst,
// batenkaart, batenprofiel, gereedheidscheck, planningstool, governance, stage-gates, afhankelijkhedenregister,
// veranderverzadiging, zombieprojecten, ijzeren wet) go through the rules above or are read right; English needs
// nothing
test('speak variant: the Programmes and governance intro words', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het knelpunt is niet geld maar de twee procesingenieurs, want die zijn schaars.'), 'Het knelpunt is niet geld maar de twee proces ingenieurs, want die zijn schaars.');
  assert.equal(nl('De managers die de fabriek draaien zijn eigenaar van de baten.'), 'De menetsjers die de fabriek draaien zijn eigenaar van de baten.');
  // elsewhere the words keep their voice
  assert.equal(nl('De managers van de afdeling beslissen.'), 'De managers van de afdeling beslissen.');
  const en = 'The bottleneck is the two process engineers. The managers who run the plant own the benefits.';
  assert.equal(speakOf([en], 'en'), en);
});

// The Consulting craft module intro (pm.consult.intro), checked with espeak-ng phonemes through Piper's nl bridge: it reads
// plantmanager with a soft g ("plant-maa-naa-ger", said plant-menetsjer, only in "De plantmanager vraagt") and
// doorverwijzingen with a devoiced d ("toorverwijzingen", said door-verwijzingen). Offerte, adviesvak, vertrouwensformule, diagnosefase, dagtarief, opties,
// dataminimalisatie, pseudonimiseren, positionering, nulmeting, declarabele dagen, bezettingsgraad, succesfee, weerstand,
// krantentest, nederig vragen, risicoreservering, opzegclausule and hefboom are read right or have rules above; English needs nothing; no other
// film's spoken text changes
test('speak variant: the consulting module intro words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De plantmanager vraagt jou om advies.'), 'De plant-menetsjer vraagt jou om advies.');
  assert.equal(nl('Dat levert doorverwijzingen op.'), 'Dat levert door-verwijzingen op.');
  // elsewhere the words keep their voice
  assert.equal(nl('Vraag het de plantmanager. Je ziet de stoptijden per medewerker.'), 'Vraag het de plantmanager. Je ziet de stoptijden per medewerker.');
  const en = 'The plant manager asks you for advice. Referrals and the stop times per employee.';
  assert.equal(speakOf([en], 'en'), en);
});

// The field film "Making things" (eng.field.making), checked with espeak-ng phonemes through Piper's nl bridge: it reads
// frame as "fra-me" (a Dutch engineer says "freem"; said freem, only in this film's phrases, since eng.mechanics.load,
// eng.machining.measuring and eng.joining.production say frame in other sentences), engineer as "eng-i-neer" (said
// entsjinier, only in "Jij bent de engineer", as the rules above for the other films' sentences). The closing says
// "de hele kaart", so Engineering needs no rule. Verspanen, spuitgieten, vingerfrees, spiraalboor, heetkanaal,
// tolerantiekader, processchema, massabalans, lasmal, instelkaart, bramen, inzakplekken, trekproef, batches, CNC and
// MIG and MAG are read right or have rules above; English needs nothing; no other film's spoken text changes
test('speak variant: the making field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('De eenheid heeft een frame, een plaat, een tank en een kap.'), 'De eenheid heeft een freem, een plaat, een tank en een kap.');
  assert.equal(nl('Het frame moet de hele eenheid dragen.'), 'Het freem moet de hele eenheid dragen.');
  assert.equal(nl('Zonder dit kan het frame na maanden breken.'), 'Zonder dit kan het freem na maanden breken.');
  assert.equal(nl('Frame, plaat en tank komen samen op één tekening.'), 'Freem, plaat en tank komen samen op één tekening.');
  assert.equal(nl('Het frame bestaat uit delen die aan elkaar moeten.'), 'Het freem bestaat uit delen die aan elkaar moeten.');
  assert.equal(nl('Zonder dit trekt het frame krom.'), 'Zonder dit trekt het freem krom.');
  assert.equal(nl('Jij bent de engineer. Je volgt de eenheid van materiaal tot lijn.'), 'Jij bent de entsjinier. Je volgt de eenheid van materiaal tot lijn.');
  // elsewhere the words keep their voice
  assert.equal(nl('Een frame dat schudt. Buigt een frame te ver door, dan helpt dat niet.'), 'Een frame dat schudt. Buigt een frame te ver door, dan helpt dat niet.');
  assert.equal(nl('De robot last een frame in 6 minuten. Spil en frame zetten uit.'), 'De robot last een frame in 6 minuten. Spil en frame zetten uit.');
  assert.equal(nl('Vraag het de engineer. Dat is Engineering.'), 'Vraag het de engineer. Dat is Engineering.');
  const en = 'You are the engineer. The frame has to carry the whole unit. This is the whole map.';
  assert.equal(speakOf([en], 'en'), en);
});

// The field film "Automation and IT" (eng.field.digital), checked with espeak-ng phonemes through Piper's nl_NL-alex
// bridge: it reads Cybersecurity as "sie-ber-see-ku-ri-ti" (said Saibersikjoeriti), switch with the x of "lachen" (said
// switsj), VLAN as one word "vlan" (said vee-lan, also in English), tags with that x, heard "tax" (said tekz, the k-s of "teks"), and edge gateway as
// "edge-gaa-te-waaj" (said etsj geitwee) and a lone dashboard as "dasj-boo-art" (said desjbord). The phrase rules keep
// to this film's sentences, since pm.devops.intro and others say dashboard in the singular. PLC, SCADA, IT, OT, IP-adres,
// OPC-server, zones and conduits (rule above), poka-yoke, foto-elektrische sensor, ISA-95, ERP and the MES (rule above)
// are read right; no other film's spoken text changes
test('speak variant: the digital field film words in Dutch and English', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Het derde station is Cybersecurity.'), 'Het derde station is Saibersikjoeriti.');
  assert.equal(nl('Je gebruikt een switch en een VLAN.'), 'Je gebruikt een switsj en een vee-lan.');
  assert.equal(nl('Je gebruikt een OPC-server en tags.'), 'Je gebruikt een OPC-server en tekz.');
  assert.equal(nl('Je gebruikt een edge gateway en een dashboard.'), 'Je gebruikt een etsj geitwee en een desjbord.');
  // elsewhere the words keep their voice
  assert.equal(nl('Bij DORA gebruiken we vaak een dashboard en een waardestroomanalyse.'), 'Bij DORA gebruiken we vaak een dashboard en een waardestroomanalyse.');
  assert.equal(nl('Een switch in de kast. Hang een tag aan het slot, met tags erbij.'), 'Een switch in de kast. Hang een tag aan het slot, met tags erbij.');
  assert.equal(speakOf(['You use a switch and a VLAN.'], 'en'), 'You use a switch and a vee-lan.');
  assert.equal(speakOf(['A switch on the wall, and a VLAN on it.'], 'en'), 'A switch on the wall, and a VLAN on it.');
});

// The field film "Energy and the grid" (eng.field.energy), checked with espeak-ng phonemes through Piper's nl bridge: it
// reads reflectiemeter with "reflek-tie" (a Dutch engineer says "reflexie"; said reflexiemeter, only in this film's phrase
// "met een reflectiemeter"). Installateur, wachtrij, capaciteitskaart, gereedheidscheck, beveiligingsrelais, loadflow, engineer
// ("Jij bent de engineer"), congestiemanagement, schakelinstallaties, aardgarnituur, stroomtang, lektest, scenario,
// pompkarakteristiek and platenwarmtewisselaar have rules above or are read right; "met een DGA" is read as the letters
// d, g, a (only after "een": after "met" alone the d goes voiceless); English needs nothing; no other film's spoken text changes
test('speak variant: the energy field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Je test de olie met een DGA en zoekt kabelfouten met een reflectiemeter.'), 'Je test de olie met een DGA en zoekt kabelfouten met een reflexiemeter.');
  assert.equal(nl('Kabelfouten zoek je met een reflectiemeter.'), 'Kabelfouten zoek je met een reflexiemeter.');
  // elsewhere the word keeps its voice
  assert.equal(nl('De reflectiemeter stuurt een puls de kabel in.'), 'De reflectiemeter stuurt een puls de kabel in.');
  const en = 'You find cable faults with a reflectometer. You are the engineer.';
  assert.equal(speakOf([en], 'en'), en);
});

// The module intro film "One frame, six ways of joining" (eng.joining.intro), checked with espeak-ng phonemes through Piper's
// nl bridge: it stresses schroefspindel on the last syllable ("schroefspinDEL"; said schroef-spindul) and puts the stress of
// kappenfrees on frees ("kappenFREES"; said kappen-frees, both words stressed), both only in the intro's tool sentences. The rest of
// its words are read right (MIG, MAG and TIG have a rule above; penetrantonderzoek, ultrasoon onderzoek, statische menger, lasmal
// and positioner are fine); no other film's spoken text changes (the bolting film keeps "een schroefspindel draait", the spot film
// its kappenfrees)
test('speak variant: the joining intro film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Bij bouten gebruiken we vaak een schroefspindel.'), 'Bij bouten gebruiken we vaak een schroef-spindul.');
  assert.equal(nl('Bij puntlassen gebruiken we vaak een kappenfrees.'), 'Bij puntlassen gebruiken we vaak een kappen-frees.');
  // elsewhere the words keep their voice
  assert.equal(nl('In de fabriek draait een schroefspindel de bout aan.'), 'In de fabriek draait een schroefspindel de bout aan.');
  assert.equal(nl('De kappenfrees snijdt de kap weer rond.'), 'De kappenfrees snijdt de kap weer rond.');
  const en = 'For bolts we often use a nutrunner. For spot welding we often use a tip dresser.';
  assert.equal(speakOf([en], 'en'), en);
});

// Render batch PM-26: the Dutch transcripts of PM-25 heard, through the real Piper nl voice and large-v3-turbo, "G-code" as
// "geen code" (the opposite), "werkstuknulpunt" as "werkstukknoppunt", "centreerboor" as "centraalboor" (machining intro) and
// "doet een lektest" as "doet het lekkerst" (energy field film). Each word was tried in several spellings in the film's own
// sentence: "vaak de G-code" (with the article it is heard right every time; bare "G-code" and "gee-code" after "vaak" stay
// "geen code"), "werkstuk nul-punt" (the whole word is heard with a k-n), "centreer-boor" and "lek-test". Only these films'
// sentences: eng.machining.cnc, eng.machining.drilling and eng.power.air say the words elsewhere and keep their voice
test('speak variant: the machining intro and energy field film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Bij CNC gebruiken we vaak G-code en een werkstuknulpunt.'), 'Bij CNC gebruiken we vaak de G-code en een werkstuk nul-punt.');
  assert.equal(nl('Bij boren gebruiken we vaak een centreerboor en een spiraalboor.'), 'Bij boren gebruiken we vaak een centreer-boor en een spiraalboor.');
  assert.equal(nl('Je meet de motorstroom met een stroomtang en doet een lektest.'), 'Je meet de motorstroom met een stroomtang en doet een lek-test.');
  // a subtitle cue holds only part of the sentence and is checked against the words spoken in its span: the rule must
  // read the same on the cue's own text
  assert.equal(nl('en doet een lektest.'), 'en doet een lek-test.');
  // elsewhere the words keep their voice
  assert.equal(nl("Het programma zelf is G-code: korte commando's."), "Het programma zelf is G-code: korte commando's.");
  assert.equal(nl('Daaruit volgt het werkstuknulpunt, G54: waar het werkstuk op de tafel ligt.'), 'Daaruit volgt het werkstuknulpunt, G54: waar het werkstuk op de tafel ligt.');
  assert.equal(nl('Daarom maak je eerst een kuiltje met een centreerboor: kort en stijf, met een brede punt.'), 'Daarom maak je eerst een kuiltje met een centreerboor: kort en stijf, met een brede punt.');
  assert.equal(nl('De lektest laat het zien: kijk in het weekend.'), 'De lektest laat het zien: kijk in het weekend.');
  const en = 'For CNC we often use G-code and a work offset. A center drill and a leak test.';
  assert.equal(speakOf([en], 'en'), en);
});

// The module intro film "From kettle to tank" (eng.process.intro), checked with espeak-ng phonemes through Piper's nl bridge:
// espeak-ng reads cascaderegeling as "kaskaadiereegeling" (cascadeer-: dˌɪːrəɣ; said cascade-regeling) and pinch-analyse with
// the ch of "lachen" (pinx; said pintsj-analyse), both only in the closing level sentences ("buffertanks, cascaderegeling,
// standaardiseren", "pinch-analyse en knelpunten"). The rest of its words are read right (batch and unit operations and
// Coriolismeter have rules above; Pt100, blokschema, apparaatcode, massabalans, proeffabriek, vuleenheid, kolf, ketel and the
// level words are fine); no other film's spoken text changes
test('speak variant: the process intro film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Op niveau Gevorderd komen buffertanks, cascaderegeling, standaardiseren en het plannen van meer producten.'), 'Op niveau Gevorderd komen buffertanks, cascade-regeling, standaardiseren en het plannen van meer producten.');
  assert.equal(nl('Op niveau Expert gaat het om opstartverlies, minder spreiding, pinch-analyse en knelpunten wegnemen.'), 'Op niveau Expert gaat het om opstartverlies, minder spreiding, pintsj-analyse en knelpunten wegnemen.');
  // elsewhere the words keep their voice
  assert.equal(nl('Een cascaderegeling stuurt de klep.'), 'Een cascaderegeling stuurt de klep.');
  assert.equal(nl('De pinch-analyse laat zien waar warmte weglekt.'), 'De pinch-analyse laat zien waar warmte weglekt.');
  const en = 'At Expert level it is about start-up losses, less variation, pinch analysis and removing bottlenecks.';
  assert.equal(speakOf([en], 'en'), en);
});

// The module intro film "From drawing to control" (eng.drawings.intro), checked with espeak-ng phonemes through Piper's nl
// bridge: it reads tagnummer with the Dutch g of "tag" (tach-nummer; said tek-nummer, as the English "tag" is said on the
// floor) and stresses operator on the first syllable (OO-pe-raa-tor; said ope-raator), both only in the intro's own sentences
// ("lezen we het tagnummer", "De operator loopt"). P&ID is written "P en I D" in the narration (the voice reads "P en ID" as
// "pee en its"); GD&T ("GD en T"), PID, PLC, stempel, tolerantiekader, niveaumeter, regelklep, streefwaarde and the
// level words are read right; English needs nothing; no other film's spoken text changes (the tag of a drawing keeps its voice
// elsewhere, the operators of the other films keep theirs)
test('speak variant: the drawings intro film words in Dutch', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Daarbij lezen we het tagnummer van elk instrument.'), 'Daarbij lezen we het tek-nummer van elk instrument.');
  assert.equal(nl('De operator loopt langs de tank met de tekening.'), 'De ope-raator loopt langs de tank met de tekening.');
  // elsewhere the words keep their voice
  assert.equal(nl('Het tagnummer staat op het instrument.'), 'Het tagnummer staat op het instrument.');
  assert.equal(nl('De operator zet de klep dicht.'), 'De operator zet de klep dicht.');
  const en = 'There we read the tag number of every instrument. The operator walks along the tank.';
  assert.equal(speakOf([en], 'en'), en);
});

// The module intro film "From the grid to hall B" (eng.gridbasics.intro): espeak-ng stresses hoofdzekering on the wrong syllable
// (hoofdze-KIE-ring), but its tool sentence says "Je leest aan de hoofdzekering af ...", which the rule for "aan de hoofdzekering"
// above already splits (hoofd-zekering). This test holds the film to that rule; kVA, onderstation, systeemcode and wachtrij are
// read right, so the film needs no rule of its own
test('speak variant: the gridbasics intro film says hoofd-zekering in its tool sentence', () => {
  const nl = (s) => speakOf([s], 'nl');
  assert.equal(nl('Je leest aan de hoofdzekering af hoeveel stroom de aansluiting aankan.'), 'Je leest aan de hoofd-zekering af hoeveel stroom de aansluiting aankan.');
  // elsewhere the word keeps its voice (the load film's sentence)
  assert.equal(nl('De hoofdzekering beveiligt de hele aansluiting.'), 'De hoofdzekering beveiligt de hele aansluiting.');
  const en = 'At the main fuse you read how much current the connection can take.';
  assert.equal(speakOf([en], 'en'), en);
});

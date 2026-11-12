// Dev tool, not shipped. Builds the explainer film "BATNA, ZOPA en het eerste
// bod / BATNA, ZOPA and the first offer" for the Projects course: four lessons
// of Onderhandelen, pm.negotiate.interests (level 1 of Voorbereiden,
// Standpunten en belangen), pm.negotiate.batna (level 2, Jouw alternatief en
// dat van hen), pm.negotiate.anchor (level 1 of Aan tafel, Het eerste bod en
// framing) and pm.negotiate.no (level 1 of Voet bij stuk houden, Nee zeggen en
// een ruil aanbieden).
//
//   node films/pm.negotiate.batna/build.mjs            build the page
//   node films/pm.negotiate.batna/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.negotiate.batna.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.negotiate.batna, P2, about 120 s): the bars of both sides sliding until
// a zone appears; the anchor. Storyboard drift: the plan's row also lists
// pm.run.conflict; the four negotiation lessons already fill the narration
// budget (about 760 words), so run.conflict (the team mediation, the four-step
// difficult conversation and its dairy example) is left for a later film and
// keeps no film field. The plan's five scenes are nine and the film about
// five minutes, because a lesson with a film no longer shows its worked
// example, so the film carries all four lessons' teach text and examples:
// interests (s1-s3), BATNA and ZOPA (s4-s6), the anchor (s7-s8) and the
// positive no (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (a miniature of the panel) and a clock, a
// table where a preparation sheet fills in, and the recurring cast: "jij" the
// consultant in petrol at the board, the sponsor (the other side: the client,
// the supplier), the team lead (the head of execution in s3) and the planner
// (the planners of s3, the planning lead of s9). A panel at the right, in
// stage space, carries one card per scene, labelled "schema" (a general
// picture) or "voorbeeld" (a worked example); s4 and s7 mark their example
// block inside the card.
//
// Facts checked (2026-11-12): Fisher and Ury, Getting to Yes (1981):
// positions versus interests, principled negotiation, objective criteria and
// the BATNA are theirs. The ZOPA is credited to nobody (the lessons do not;
// the term comes from the later negotiation-analysis literature). Anchoring:
// Tversky and Kahneman, Science 1974. First offers predicting the settlement:
// Galinsky and Mussweiler, JPSP 2001. Loss aversion: Kahneman and Tversky,
// prospect theory, 1979. Range offers: Ames and Mason, JPSP 2015 ("Tandem
// anchoring"): a bolstering range (the target at the bottom) got better
// settlements than a point offer without seeming rude; a backdown range (the
// target at the top) lost value. The lesson said "at least as well"; lesson
// and film now state the finding (review 2026-11-12). The positive no, yes-no-yes: Ury, The
// Power of a Positive No, 2007. Chris Voss, Never Split the Difference, 2016.
// The voice names none of them in Dutch (espeak-ng misreads the names; see the
// narration notes); the cards and captions carry each name and year for at
// least four seconds.
//
// Checklist (lesson point: scene and beat; said unless marked "card"):
//   interests teach 1: a position is what someone says they want, the report
//     by Friday (s1 b1), the price 10% down (card); an interest is why, a
//     board meeting on Monday, a budget cut to show (s1 b2); Fisher and Ury
//     (card and caption), principled negotiation, the Harvard method;
//     positions dig in, interests open options (s1 b3)
//   interests teach 2: ask why and why not, what would that give you, what if
//     it isn't Friday (s1 b4), what worries you (caption, card); needs:
//     security, recognition, control, money, time; most interests can be met
//     in more than one way; write theirs next to yours (s1 b5, the sheet on
//     the table fills in)
//   interests teach 3: shared and different interests both help; shared, the
//     project succeeds; different, timing versus cost (s2 b1); trade what is
//     cheap for you and valuable for them; a package deal, several issues at
//     once; one issue at a time makes every step win or lose (s2 b2)
//   interests teach 4: a fair standard instead of willpower: market rate, past
//     data, an agreed norm; "what would be fair, and how could we check?";
//     from who is stronger to what is reasonable (card); yes without losing
//     face (s2 b3)
//   interests teach 5: positions dressed up as facts, "my crews won't do it"
//     (caption, card); splitting the difference early feels fair, rewards the
//     most extreme opener (s2 b4); experts differ on how rational it is: Chris
//     Voss, former FBI hostage negotiator, 2016 (card), emotions drive
//     decisions, listen first and name the feeling; "if you got exactly this,
//     what would it solve for you?" (s2 b5)
//   interests example: a grid operator, every job checked two days before the
//     start: permits, materials, switching plan (s3 b1); the head of
//     execution: "a day extra on every job, my crews won't do it"; his
//     position, no extra day (s3 b2); ask "what would that day cost you?";
//     he fears idle crews and blame from the planners (s3 b3); your interest,
//     fewer wasted trips; option: the planners check, crews only get jobs that
//     pass (s3 b4); a pilot, four weeks in one region, with a fair standard:
//     wasted trips before and after (s3 b5)
//   batna teach 1: BATNA, Best Alternative To a Negotiated Agreement (caption),
//     Fisher and Ury 1981 (card); what you actually do if you walk away; it,
//     not your wishes, sets your strength (s4 b1); with a good one you say no
//     calmly; a bad one you improve first (s4 b2)
//   batna teach 2: the walk-away point, the worst deal you still accept,
//     follows from your BATNA (s4 b3); €950 a day offered, a firm €1.000
//     elsewhere (s4 b4); nothing else differing, less than €1.000 leaves you
//     worse off; decide before the meeting, not during (s4 b5)
//   batna teach 3: estimate theirs: another supplier, doing it themselves,
//     waiting (s5 b1); the ZOPA, the range between both walk-away points
//     (s5 b2, the two bars slide until the zone appears); none: no clever
//     wording helps, change what is on the table (s5 b3)
//   batna teach 4: don't bluff; mention a real one calmly, as information:
//     "we'll do it next year instead" (s5 b4); keep improving your BATNA, a
//     second real option is your strongest tool (s5 b5)
//   batna teach 5: switching cost: time, learning (s5 b6), for parts often
//     qualification, testing and approving a new supplier's parts; high
//     switching cost weakens an alternative (s5 b7); common failure:
//     overrating your BATNA or forgetting what reaching it costs; show a
//     strong one calmly, keep a weak one to yourself; "what do we actually do
//     on Monday if they say no?" (s5 b8, the question on the card)
//   batna example: coated brackets from one supplier, a 12% rise (s6 b1); a
//     second supplier 4% above today, 10 weeks to qualify; no coating in-house
//     (s6 b2); your BATNA, switching after 10 weeks; theirs, losing your volume
//     (s6 b3); start the qualification now, it improves your alternative
//     whatever happens (s6 b4); ask what drives the 12%, energy, raw material;
//     propose 4% now with an index clause, part of the price moving with a
//     published energy price index (s6 b5); walk-away point near the 4% plus
//     the cost of qualifying (s6 b6)
//   anchor teach 1: anchoring, Tversky and Kahneman 1974 (card): the first
//     number pulls estimates, even when arbitrary (s7 b1); first offers
//     strongly predict the deal, Galinsky and Mussweiler 2001 (card); know the
//     market, put the first number down (s7 b2)
//   anchor teach 2: ambitious and defensible; an extreme number you can't
//     justify costs credibility, can end the talk (card) (s7 b3); the reason
//     with the number, "18 to 22 days, so we propose 20" (s7 b5)
//   anchor teach 3: when they anchor first, don't argue about their number,
//     ask how they got there, explain your basis, put your number down (s8 b1);
//     a counteroffer close to an unreasonable number accepts their anchor (s8 b2)
//   anchor teach 4: framing: 95% on time or 1 in 20 late (s8 b3), €31.200 or
//     €600 a week for a year (card); loss aversion, Kahneman and Tversky 1979
//     (card): losses weigh more, "keep losing 300 crew hours a month" against
//     "saves 300 hours"; frame honestly, in their terms (s8 b4)
//   anchor teach 5: plan concessions, each smaller, 20, 19, 18.5, get
//     something for each (s8 b5); big or quick ones signal room (card); if
//     they know the market better, let them open; Ames and Mason 2015 (card):
//     a range with your target at the bottom, 20 to 22, beats one number, and
//     the target at the top loses (card); "what is that number based
//     on?" (card) (s8 b6)
//   anchor example: a planning diagnostic, a short study of how work is
//     planned (card), at three regional offices; the last three took 18, 22
//     and 20 days (s7 b4); purchasing said about 10 on the phone; open with
//     the basis, 18 to 22, so 20 (s7 b5); not from their 10, not the middle
//     at 15 without a reason (s7 b6); push back: trade scope, 12 days for one
//     region thoroughly instead of three; the client chooses (s7 b7)
//   no teach 1: yes to everything makes your yes worth less and your work
//     late; Ury's positive no, 2007 (card): yes, no, yes (s9 b1); yes to what
//     you protect, a promise to a client, the quality; a clear no; a yes to an
//     option, a trade, a later time (s9 b2)
//   no teach 2: clear, short, calm; "I'll try" is heard as yes; one real
//     reason, not five excuses; then stop talking (s9 b3). Not said: the
//     pointer to the Intake module (navigation, not content).
//   no teach 3: offer a trade, "if I do this, what can drop?", "if Jan takes
//     the data pull" (card); it shows you take it seriously (card) and puts the
//     choice with whoever sets the priorities (s9 b4)
//   no teach 4: red lines: safety, integrity (honest numbers and advice, no
//     changed data, no hidden finding), binding rules; "that I can't do, this
//     I can" (s9 b5); prepare your no before a tense meeting (s9 b6)
//   no teach 5: juniors say "I'll try" and work nights (card); apologising
//     three times, over-explaining, no by email (s9 b6); experts differ, "never
//     say no; yes, and here's what it takes" against Ury's clear no (card);
//     "what am I protecting by saying no?" (s9 b6)
//   no example: Thursday 16:00, your boss (the engagement manager) wants the
//     steering committee deck reworked for 08:00 (s9 b7); the planning lead was
//     promised an analysis by Friday noon for a capacity decision; both well
//     tonight won't work (s9 b8); yes to the shared goal, a clear no (s9 b9);
//     yes with options: the three key slides and the analysis on time, or the
//     analysis moves to Monday; which do you prefer; the one who sets the
//     priorities chooses, with the cost visible (s9 b10)
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const INT = 'pm.negotiate.interests';
const BAT = 'pm.negotiate.batna';
const ANC = 'pm.negotiate.anchor';
const NO = 'pm.negotiate.no';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(INT, ['Een standpunt is wat iemand zegt te willen', '“We moeten het rapport vrijdag hebben”, “De prijs moet 10% omlaag”', 'een directieoverleg op maandag, een bezuiniging die hij moet laten zien',
  'Roger Fisher en William Ury', 'principieel onderhandelen, ook wel de Harvard-methode (Getting to Yes, 1981)', 'graaft zich in', 'ziet ruimte voor opties',
  'Vraag waarom, en waarom niet', '“Wat levert dat je op?” “Wat gebeurt er als het geen vrijdag wordt?” “Waar maak je je zorgen over?”',
  'zekerheid, erkenning, grip, geld en tijd', 'op meer dan één manier dienen', 'Schrijf die van de ander op naast die van jezelf',
  'Gedeelde en verschillende belangen helpen allebei', 'jullie willen allebei dat het project slaagt', 'de een vindt timing het belangrijkst, de ander de kosten',
  'geef wat voor jou goedkoop is en voor de ander veel waard', 'een pakketdeal', 'Eén punt tegelijk maakt van elke stap winnen of verliezen',
  'eerlijke maatstaf in plaats van wilskracht: een marktprijs, data uit het verleden, een afgesproken norm', '“Wat zou hier redelijk zijn, en hoe kunnen we dat checken?”',
  'niet meer over wie de sterkste is maar over wat redelijk is', 'zonder gezichtsverlies',
  'standpunten die als feit worden gebracht (“Mijn ploegen gaan dat niet doen”)', 'het verschil delen omdat dat eerlijk voelt', 'beloont wie het extreemst opende',
  'Chris Voss, oud-gijzelingsonderhandelaar van de FBI (Never Split the Difference, 2016)', 'emoties beslissen: luister eerst en benoem het gevoel', '“Als je precies dit krijgt, wat lost dat dan voor je op?”',
  'netbeheerder', 'twee dagen voor de start op gereedheid wordt gecheckt: zijn vergunningen, materiaal en het schakelplan rond?', 'Het hoofd uitvoering, de baas van de monteursploegen',
  'kost bij elke klus een dag extra. Mijn ploegen gaan dat niet doen', 'Zijn standpunt is “geen dag extra”', '“Wat zou die dag je kosten?”', 'bang is dat ploegen stilzitten en dat planners hen dan de schuld geven',
  'Jouw belang is minder ritten voor niks', 'de planners doen de check, en ploegen krijgen alleen klussen die erdoor komen', 'een proef van vier weken in één regio', 'het aantal ritten voor niks, ervoor en erna']);
says(BAT, ['Best Alternative To a Negotiated Agreement', 'Fisher en Ury, Getting to Yes, 1981', 'wat je echt gaat doen als je wegloopt', 'Je BATNA, niet je wensen, bepaalt hoe sterk je staat',
  'Met een goed alternatief kun je rustig nee zeggen', 'maak je dat eerst beter',
  'de slechtste deal die je nog accepteert, en die volgt uit je BATNA', 'een klant €950 per dag biedt', 'een vast aanbod elders van €1.000 per dag', 'sta je er met minder dan €1.000 slechter voor', 'Bepaal dit vóór het gesprek, niet tijdens',
  'een andere leverancier, het zelf doen, wachten', 'De ruimte tussen jouw ondergrens en die van hen is de ZOPA', 'geen enkele slimme formulering', 'verander dan wat er op tafel ligt',
  'Bluf niet met een alternatief dat je niet hebt', 'rustig, als informatie, niet als dreigement: “Als we hier niet uitkomen, doen we het volgend jaar.”', 'een tweede echte optie is het sterkste middel dat je hebt',
  'Overstapkosten zijn wat het een partij kost om van partner te wisselen: tijd, inwerken', 'het testen en goedkeuren van onderdelen van een nieuwe leverancier', 'Hoge overstapkosten maken een alternatief zwakker',
  'je eigen BATNA overschatten, of vergeten wat het kost om er te komen', 'een sterke rustig laten zien, een zwakke voor je houden', '“Wat doen we maandag echt als ze nee zeggen?”',
  'gecoate beugels bij één leverancier', 'prijsverhoging van 12%', '4% boven de huidige', '10 weken nodig om de onderdelen te kwalificeren', 'Zelf coaten kan niet',
  'Je BATNA is overstappen naar de tweede leverancier na 10 weken kwalificatie. Die van hen is jouw volume kwijtraken', 'Start de kwalificatie nu al: dat verbetert je alternatief, hoe het ook loopt',
  'vraag wat achter de 12% zit (energie, grondstof?)', 'stel bijvoorbeeld 4% nu voor, met een indexclausule', 'laat meebewegen met een gepubliceerde energieprijsindex', 'Je ondergrens ligt rond de 4% van de tweede leverancier plus de kosten van het kwalificeren']);
says(ANC, ['Verankering (Tversky en Kahneman, 1974)', 'het eerste getal in de kamer trekt ieders schatting naar zich toe, zelfs als iedereen weet dat het willekeurig is', 'voorspelt het eerste bod sterk waar de deal uitkomt (Galinsky en Mussweiler, 2001)',
  'Ken je de markt goed, dan loont het meestal om zelf het eerste getal op tafel te leggen', 'ambitieus en verdedigbaar', 'kost je geloofwaardigheid en kan het gesprek beëindigen', 'Vergelijkbare diagnoses kostten 18 tot 22 dagen, dus we stellen er 20 voor',
  'ga dan niet over zijn getal in discussie', 'Vraag hoe hij erop kwam, leg jouw basis uit en leg je eigen getal op tafel', 'vlak bij een getal dat je onredelijk vindt; daarmee accepteer je zijn anker',
  '“95% van de klussen op tijd” of “1 op de 20 klussen te laat”', '“€31.200” of “€600 per week, een jaar lang”', 'verliesaversie (Kahneman en Tversky, 1979)', '“zonder dit blijf je 300 ploeguren per maand verliezen”', '“dit bespaart 300 uur”', 'Frame eerlijk, in termen waar de ander om geeft',
  'maak elke stap kleiner (20 dagen, dan 19, dan 18,5) en vraag er telkens iets voor terug', 'Grote of snelle concessies verraden dat er nog veel ruimte is',
  'Kent de ander de markt beter, dan beschermt het je om hem te laten openen', 'Ames en Mason (2015)', 'een bandbreedte met je doel onderaan, “20 tot 22 dagen”, een betere uitkomst dan één getal', 'met je doel bovenaan verloor je', '“Waar is dat getal op gebaseerd?”',
  'planningsdiagnose, een kort onderzoek naar hoe het werk gepland wordt en waar het misgaat, bij drie regiokantoren', 'kostten 18, 22 en 20 dagen', 'liet iemand van inkoop “een dag of 10” vallen',
  'Begin niet bij hun 10, en ga niet zonder reden in het midden zitten op 15', 'ruil dan scope in plaats van dagen: “Met 12 dagen doen we één regio grondig in plaats van drie.”', 'Dan kiest de klant wat hij voor zijn geld krijgt']);
says(NO, ['Als je overal ja op zegt, is je ja minder waard en is je werk te laat', 'William Ury’s “positieve nee” (2007) heeft drie delen: ja, nee, ja', 'een belofte aan een klant of de kwaliteit van het werk', 'Dan een duidelijk nee', 'een optie, een ruil, een later moment',
  'Wees duidelijk, kort en rustig', 'verstopt in “ik ga het proberen” wordt als ja gehoord', 'Geef één echte reden, geen vijf smoesjes', 'En houd dan je mond',
  '“Als ik dit doe, wat kan er dan vervallen?” “Ik kan het doen als Jan de data-uitdraai overneemt.”', 'dat je het verzoek serieus neemt, en legt de keuze bij degene die de prioriteiten bepaalt',
  'veiligheid, integriteit, regels waar je aan gebonden bent', 'je rode lijnen', 'eerlijke cijfers en eerlijk advies: je past geen data aan en verstopt geen bevinding', '“Dat kan ik niet doen. Dit kan ik wel doen.”', 'bereid je nee voor als je een gespannen overleg ingaat',
  'junioren zeggen “ik ga het proberen” en werken ’s nachts door', 'drie keer sorry zeggen, te veel uitleggen, of per mail nee zeggen', '“zeg nooit nee, zeg ja, en dit is wat ervoor nodig is”', 'een duidelijk nee de relatie beter beschermt dan een vaag ja', '“Wat bescherm ik met dit nee?”',
  'Donderdag, 16.00 uur', 'de presentatie voor de stuurgroep om te bouwen, voor morgen 8.00 uur', 'een analyse beloofd voor vrijdag 12.00 uur', 'capaciteitsbesluit', 'Allebei goed doen lukt vanavond niet',
  '“Ik wil ook dat de stuurgroeppresentatie sterk is.”', 'de drie belangrijkste slides verbeteren en de planningsanalyse op tijd leveren', 'dat zijn analyse naar maandag schuift', 'Wat heeft jouw voorkeur?', 'Degene die de prioriteiten bepaalt, maakt de keuze, met de kosten in beeld']);
says(BAT, ['a firm offer for the same days elsewhere at €1,000 a day', 'a price rise of 12%', 'quoted 4% above today’s price', 'needs 10 weeks to qualify the parts'], 'en');
says(ANC, ['took 18, 22 and 20 days', 'about 10 days', 'meet in the middle at 15', 'With 12 days we can do one region thoroughly instead of three', '(20 days, then 19, then 18.5)'], 'en');
// the rate: €950 offered, €1.000 elsewhere: the offer is below the walk-away point
const RATE = { offer: 950, alt: 1000 };
assert(RATE.offer < RATE.alt, '€950 lies below the €1.000 alternative');
// the brackets: the second supplier's 4% is far below the announced 12%
const BRK = { rise: 12, second: 4, weeks: 10 };
assert(BRK.second < BRK.rise, 'the second quote is below the rise');
// the anchor: past diagnostics 18, 22, 20 give the range 18–22 and the proposal 20 (their middle and mean)
const PAST = [18, 22, 20];
assert(Math.min(...PAST) === 18 && Math.max(...PAST) === 22, 'the range 18 to 22');
assert(PAST.reduce((a, b) => a + b, 0) / PAST.length === 20, '20 is the mean of 18, 22 and 20');
assert((10 + 20) / 2 === 15, 'the middle between their 10 and your 20 is 15');
// concessions shrink: 20 → 19 → 18,5 (steps of 1 and 0,5)
const CONC = [20, 19, 18.5];
assert(CONC[0] - CONC[1] > CONC[1] - CONC[2], 'each concession smaller than the last');
// framing: 95% on time is 1 in 20 late; €600 a week for 52 weeks is €31.200
assert(100 - 95 === 100 / 20, '95% on time = 1 in 20 late');
assert(600 * 52 === 31200, '€600 a week for a year = €31.200');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 12, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
// the preparation sheet on the table: two columns that fill in (theirs, yours)
const SHEET = w.sheet({ x: 150, y: 146, z: TZ, w: 29.7, d: 21 });
const SHEET_AT = w.at([165, 156, TZ]);
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('dLines', '')}</g>`;

const world = [
  w.room(ROOM),
  w.clock(266, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  cueG('paper', SHEET.svg + sheetLines),
  cueG('laptop', w.laptop({ x: 118, y: 136, z: TZ, toward: 1 })),
  w.cup(132, 178, TZ),
  w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); the stage fills their contents per scene: o[key] goes into data-k
// "t_<key>".
const SLOTS = ['pos', 'int', 'fu', 'why', 'needs',
  'diff', 'pack', 'fair', 'split', 'voss',
  'check', 'posx', 'intx', 'opt', 'pilot',
  'batna', 'good', 'floor', 'rate',
  'theirs', 'zopa', 'bluff', 'second', 'switch', 'qual', 'pitfall',
  'rise', 'quote', 'alts', 'now', 'index', 'floor2',
  'anchor', 'first', 'defend', 'diag', 'basis', 'mid', 'trade',
  'basisq', 'counter', 'frame', 'loss', 'conc', 'range',
  'pno', 'yny', 'short', 'swap', 'red', 'prep', 'ask', 'promise', 'yesno', 'opts'];
const slot = (key) => cueG(key, g(`t_${key}`, ''));
const PX = 322;
const PW = 308;
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>` + g('pHead', '') + SLOTS.map(slot).join(''));
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const CAM = [
  { from: [150, 210, 1], to: [120, 190, 1.08] },
  { from: [150, 190, 1.04], to: [140, 170, 1.1] },
  { from: [120, 200, 1.04], to: [140, 210, 1.12] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.04], to: [SHEET_AT[0], SHEET_AT[1], 1.14] },
  { from: [180, 200, 1.02], to: [190, 190, 1.1] },
  { from: [190, 200, 1.06], to: [160, 200, 1.02] },
  { from: [150, 210, 1], to: [130, 190, 1.08] },
  { from: [140, 190, 1.06], to: [170, 200, 1.12] },
  { from: [170, 210, 1.04], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const sc = (id, lesson, title, beats) => ({ id, lesson, level: 1, dur: 30, still: 0.9, title, beats });
const spec = {
  id: 'pm.negotiate.batna',
  title: { nl: 'BATNA, ZOPA en het eerste bod', en: 'BATNA, ZOPA and the first offer' },
  lessons: [INT, BAT, ANC, NO],
  strictFocus: true,
  scenes: [
    sc('s1', INT, { nl: 'Standpunt en belang', en: 'Position and interest' }, [
      { nl: 'Een {t:Standpunt|standpunt}: wat iemand zegt te willen. “Het rapport moet vrijdag af.”', en: 'A {t:Position|position}: what someone says they want. “We need the report by Friday.”', cue: { Standpunt: 'pos' }, focus: ['pos', 'sponsor'] },
      { nl: 'Een {t:Belang|belang}: waarom hij het wil. Een directieoverleg op maandag.', en: 'An {t:Interest|interest}: why they want it. A board meeting on Monday.', cue: { Belang: 'int' }, focus: 'int' },
      { nl: 'Fisher en Ury: {t:Principieel onderhandelen|principieel onderhandelen}. Kijk naar belangen, niet standpunten.', en: 'Fisher and Ury: {t:Principled negotiation|principled negotiation}. Positions dig in, interests open options.', cue: { 'Principieel onderhandelen': 'fu' }, focus: 'fu' },
      { nl: 'Vraag waarom, en waarom niet: “Wat levert dat je op?”', en: 'Ask why, and why not: “What would that give you?”', focus: ['why', 'jij'] },
      { nl: 'Hoor behoeften: zekerheid, grip, geld, tijd. Schrijf hun belangen naast de jouwe.', en: 'Hear the needs: security, control, money, time. Write theirs next to yours.', focus: ['needs', 'paper'] },
    ]),
    sc('s2', INT, { nl: 'Ruilen en een maatstaf', en: 'Trades and a standard' }, [
      { nl: 'Gedeelde en verschillende belangen helpen: de een let op de datum, de ander op kosten.', en: 'Shared and different interests both help: one side cares about the date, the other about cost.', focus: 'diff' },
      { nl: 'Ruil wat jou weinig kost. Een {t:Pakketdeal|pakketdeal}: meerdere punten tegelijk op tafel.', en: 'Trade what is cheap for you. A {t:Package deal|package deal}: several issues on the table at once.', cue: { Pakketdeal: 'pack' }, focus: 'pack' },
      { nl: 'Een {t:Eerlijke maatstaf|eerlijke maatstaf}: marktprijs of data. Zo zegt iedereen ja zonder gezichtsverlies.', en: 'A {t:Fair standard|fair standard}: market rate or past data. Then both can say yes without losing face.', cue: { 'Eerlijke maatstaf': 'fair' }, focus: 'fair' },
      { nl: 'Snel het verschil delen voelt eerlijk, maar beloont wie het extreemst opende.', en: 'Splitting the difference early feels fair, but rewards whoever opened most extreme.', focus: 'split' },
      { nl: 'Chris Voss: emoties beslissen. Luister, benoem het gevoel: wat lost dit voor je op?', en: 'Chris Voss: emotions decide. Listen, name the feeling: what would this solve for you?', focus: ['voss', 'jij'] },
    ]),
    sc('s3', INT, { nl: 'Een dag extra?', en: 'A day extra?' }, [
      { nl: 'Een netbeheerder: elke klus twee dagen vooraf checken op vergunningen, materiaal, schakelplan.', en: 'A grid operator: check every job two days ahead for permits, materials, switching plan.', focus: 'check' },
      { nl: 'Het hoofd uitvoering: “Mijn ploegen doen dat niet.” Standpunt: geen dag extra.', en: 'The head of execution: “My crews won’t do it.” Position: no extra day.', focus: ['posx', 'teamlead'] },
      { nl: '“Wat kost die dag je?” Hij vreest stilstand, en dat planners hen de schuld geven.', en: '“What would that day cost you?” He fears idle crews, and planners blaming them.', focus: ['intx', 'teamlead'] },
      { nl: 'Jouw belang: minder ritten voor niks. Optie: planners checken, ploegen krijgen klare klussen.', en: 'Your interest: fewer wasted trips. Option: planners check, crews only get jobs that pass.', focus: ['opt', 'planner', 'jij'] },
      { nl: 'Een pilot van vier weken in één regio. Maatstaf: ritten voor niks, ervoor en erna.', en: 'A pilot of four weeks in one region. Standard: wasted trips, before and after.', focus: 'pilot' },
    ]),
    sc('s4', BAT, { nl: 'Jouw alternatief', en: 'Your alternative' }, [
      { nl: '{t:BATNA|BATNA}: wat je echt doet als je wegloopt. Dat bepaalt je kracht.', en: '{t:BATNA|BATNA}: what you actually do if you walk away. It sets your strength.', cue: { BATNA: 'batna' }, focus: 'batna' },
      { nl: 'Goed alternatief: rustig nee zeggen. Slecht: eerst verbeteren.', en: 'A good alternative: say no calmly. A bad one: improve it first.', focus: 'good' },
      { nl: 'Je {t:Ondergrens|ondergrens}: de slechtste deal die je nog accepteert.', en: 'Your {t:Walk-away point|walk-away point}: the worst deal you will still accept.', cue: { Ondergrens: 'floor' }, focus: 'floor' },
      { nl: 'Een klant biedt €{n:950} per dag; elders heb je vast €{n:1000}.', en: 'A client offers €{n:950} a day; elsewhere you have a firm €{n:1000}.', focus: ['rate', 'sponsor'] },
      { nl: 'Verder alles gelijk? Dan is minder dan €{n:1000} slechter. Bepaal dat vooraf.', en: 'Nothing else differs? Then less than €{n:1000} is worse. Decide it beforehand.', focus: ['rate', 'paper'] },
    ]),
    sc('s5', BAT, { nl: 'De ZOPA', en: 'The ZOPA' }, [
      { nl: 'Schat ook hun alternatief: andere leverancier, zelf doen, of wachten?', en: 'Estimate theirs too: another supplier, do it themselves, or wait?', focus: ['theirs', 'sponsor'] },
      { nl: 'De {t:ZOPA|ZOPA}: de ruimte tussen beide ondergrenzen. Daar kan een akkoord.', en: 'The {t:ZOPA|ZOPA}: the range between both walk-away points. A deal fits there.', cue: { ZOPA: 'zopa' }, focus: 'zopa' },
      { nl: 'Geen ZOPA? Dan helpt geen slimme zin; verander wat er op tafel ligt.', en: 'No ZOPA? Then no clever wording helps; change what is on the table.', focus: 'zopa' },
      { nl: 'Bluf niet: noem een echt alternatief rustig, als informatie. Zoek een tweede optie.', en: 'Don’t bluff: mention a real alternative calmly, as information. Find a second option.', focus: ['bluff', 'second'] },
      { nl: '{t:Overstapkosten|Overstapkosten}: tijd, inwerken, en bij onderdelen {t:Kwalificatie|kwalificatie}.', en: '{t:Switching cost|Switching cost}: time, learning, and for parts {t:Qualification|qualification}.', cue: { Overstapkosten: 'switch', Kwalificatie: 'qual' }, focus: ['switch', 'qual'] },
      { nl: 'Fout: je BATNA overschatten. Een sterke laat je zien, een zwakke houd je voor je.', en: 'Failure: overrating your BATNA. Show a strong one, keep a weak one to yourself.', focus: 'pitfall' },
    ]),
    sc('s6', BAT, { nl: 'Gecoate beugels', en: 'Coated brackets' }, [
      { nl: 'Een fabrikant koopt gecoate beugels bij één leverancier. Die wil {n:12}% meer.', en: 'A manufacturer buys coated brackets from one supplier. It wants {n:12}% more.', focus: ['rise', 'sponsor'] },
      { nl: 'Een tweede: {n:4}% boven nu, maar {n:10} weken kwalificatie. Zelf coaten kan niet.', en: 'A second: {n:4}% above today, but {n:10} weeks to qualify. No coating in-house.', focus: 'quote' },
      { nl: 'Jouw BATNA: overstappen. Die van hen: jouw volume kwijt.', en: 'Your BATNA: switching. Theirs: losing your volume.', focus: 'alts' },
      { nl: 'Start de kwalificatie nu al: dat verbetert je alternatief.', en: 'Start the qualification now: it improves your alternative.', focus: 'now' },
      { nl: 'Vraag wat achter de {n:12}% zit. Bied {n:4}% nu, met een indexclausule op de energieprijs.', en: 'Ask what drives the {n:12}%. Offer {n:4}% now, with an index clause on the energy price.', focus: ['index', 'sponsor'] },
      { nl: 'Je ondergrens: rond de {n:4}%, plus wat het kwalificeren kost.', en: 'Your walk-away point: near the {n:4}%, plus what qualifying costs.', focus: 'floor2' },
    ]),
    sc('s7', ANC, { nl: 'Het eerste getal', en: 'The first number' }, [
      { nl: 'Het eerste getal is een {t:Anker|anker}: het trekt ieders schatting mee, zelfs willekeurig.', en: 'The first number is an {t:Anchor|anchor}: it pulls every estimate along, even when arbitrary.', cue: { Anker: 'anchor' }, focus: 'anchor' },
      { nl: 'Het eerste bod voorspelt de deal sterk. Ken je de markt, noem dan zelf het eerste getal.', en: 'The first offer strongly predicts the deal. If you know the market, name the first number yourself.', focus: 'first' },
      { nl: 'Ambitieus en verdedigbaar; zonder onderbouwing kost het geloofwaardigheid.', en: 'Ambitious and defensible; without a basis it costs credibility.', focus: 'defend' },
      { nl: 'Planningsdiagnose, drie kantoren. De laatste drie kostten {n:18}, {n:22} en {n:20} dagen.', en: 'Planning diagnostic, three offices. The last three took {n:18}, {n:22} and {n:20} days.', focus: 'diag' },
      { nl: 'Inkoop zei “een dag of {n:10}”. Jij: “Het waren er {n:18} tot {n:22}, dus {n:20}.”', en: 'Purchasing said “about {n:10}”. You: “It took {n:18} to {n:22}, so {n:20}.”', focus: ['basis', 'jij'] },
      { nl: 'Niet hun {n:10}, en niet zonder reden het midden, {n:15}.', en: 'Not their {n:10}, and not the middle, {n:15}, without a reason.', focus: 'mid' },
      { nl: 'Duwen ze terug? Ruil scope: “{n:12} dagen, één regio grondig.”', en: 'They push back? Trade scope: “{n:12} days, one region thoroughly.”', focus: ['trade', 'sponsor'] },
    ]),
    sc('s8', ANC, { nl: 'Framing en concessies', en: 'Framing and concessions' }, [
      { nl: 'Ankert de ander eerst? Vraag waar zijn getal vandaan komt; noem het jouwe.', en: 'They anchor first? Ask where their number comes from; name yours.', focus: ['basisq', 'sponsor'] },
      { nl: 'Een {t:Tegenbod|tegenbod} vlak bij een onredelijk getal accepteert zijn anker.', en: 'A {t:Counteroffer|counteroffer} close to an unreasonable number accepts their anchor.', cue: { Tegenbod: 'counter' }, focus: 'counter' },
      { nl: '{t:Framing|Framing}: “{n:95}% op tijd” of “1 op de {n:20} te laat”.', en: '{t:Framing|Framing}: “{n:95}% on time” or “1 in {n:20} late”.', cue: { Framing: 'frame' }, focus: 'frame' },
      { nl: '{t:Verliesaversie|Verliesaversie}: “zonder dit verlies je {n:300} ploeguren per maand” komt harder aan.', en: '{t:Loss aversion|Loss aversion}: “without this you lose {n:300} crew hours a month” lands harder.', cue: { Verliesaversie: 'loss' }, focus: 'loss' },
      { nl: 'Plan je {t:Concessie|concessies} steeds kleiner: {n:20}, {n:19}, {n:18.5}, en vraag iets terug.', en: 'Plan your {t:Concession|concessions} ever smaller: {n:20}, {n:19}, {n:18.5}, and get something back.', cue: { Concessie: 'conc' }, focus: 'conc' },
      { nl: 'Kent hij de markt beter? Laat hem openen. Of: {n:20} tot {n:22}, doel onderaan.', en: 'They know the market better? Let them open. Or: {n:20} to {n:22}, target at the bottom.', focus: 'range' },
    ]),
    sc('s9', NO, { nl: 'Nee, en wat wel kan', en: 'No, and what can' }, [
      { nl: 'Altijd ja maakt je ja minder waard. De {t:Positieve nee|positieve nee}: ja, nee, ja.', en: 'Always yes makes your yes worth less. The {t:Positive no|positive no}: yes, no, yes.', cue: { 'Positieve nee': 'pno' }, focus: 'pno' },
      { nl: 'Ja tegen wat je beschermt, duidelijk nee, dan ja tegen een optie.', en: 'Yes to what you protect, a clear no, then yes to an option.', focus: 'yny' },
      { nl: '“Ik ga het proberen” klinkt als ja. Eén reden, dan stil.', en: '“I’ll try” sounds like yes. One reason, then stop.', focus: ['short', 'jij'] },
      { nl: '{t:Ruil aanbieden|Bied een ruil aan}: “Wat vervalt er dan?” Wie prioriteiten stelt, kiest.', en: '{t:Offer a trade|Offer a trade}: “What can drop?” Whoever sets priorities chooses.', cue: { 'Ruil aanbieden': 'swap' }, focus: 'swap' },
      { nl: 'Een {t:Rode lijn|rode lijn}: veiligheid, integriteit, regels. “Dat niet; dit wel.”', en: 'A {t:Red line|red line}: safety, integrity, rules. “Not that; this.”', cue: { 'Rode lijn': 'red' }, focus: 'red' },
      { nl: 'Bereid je nee voor: geen drie keer sorry, geen lange uitleg.', en: 'Prepare your no: no apologising three times, no long reasons.', focus: ['prep', 'jij'] },
      { nl: 'Donderdag 16.00: je baas wil de stuurgroeppresentatie om, voor morgen 8.00.', en: 'Thursday 16:00: your boss wants the steering deck reworked by 08:00.', focus: ['ask', 'laptop'] },
      { nl: 'Je beloofde de planningsleider een analyse voor vrijdag 12.00.', en: 'You promised the planning lead an analysis by Friday noon.', focus: ['promise', 'planner'] },
      { nl: 'Ja: “Ik wil ook een sterke presentatie.” Nee: “Allebei lukt vanavond niet.”', en: 'Yes: “I want a strong deck too.” No: “I can’t do both tonight.”', focus: ['yesno', 'jij'] },
      { nl: 'Ja met opties: drie dia’s plus analyse op tijd, of analyse naar maandag?', en: 'Yes with options: three slides plus analysis on time, or analysis on Monday?', focus: 'opts' },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the captions and the cards it
// carries every point of the checklist above. No symbol the voice would read
// aloud, no spoken parenthesis or quote; percentages and times as words.
// Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12): BATNA (bˈɑtnaː) and ZOPA (zˈoːpaː) are read as
// the cards show them, so the voice says both terms without a SAY rule. New
// Dutch SAY rules in films/_kit/timeline.mjs (tested; recomputed for every
// film: no other film's spoken text changes): pakketdeal as "pakket-diel"
// (espeak-ng drops the d: "pakket-eeal") and deal alone as "diel" ("dee-al"),
// framing as "freeming" (espeak-ng reads "fraa-ming"), integriteit by
// pm.lead.feedback's in-tegriteit (stress on -TEIT; espeak-ng stresses IN-), and the example's gecoate beugels and
// coaten as "gekoote", "kooten" (espeak-ng reads "ge-koo-aa-te"). A sentence
// never starts with "Eén" (read "ee-een"), and prioriteiten (stressed PRI-) is
// "wie bepaalt wat voorgaat". Kept out of the Dutch narration because espeak-ng misreads
// them (they stay in the captions and on the cards): the authors' names
// (Fisher with a sounded h, Ury as "uu-rie", Kahneman with an h, Mussweiler,
// Chris with the ch of "lachen") and Getting to Yes; engagement manager
// ("maa-naa-ger": said "je baas"), slides (said "dia's"), mail, timing
// ("tie-ming": said "de datum"), capaciteitsbesluit (KA-, "bes-luit": said "een
// besluit over capaciteit") and energieprijsindex (E-nergie: said "de
// energieprijs"). Left as espeak-ng reads them: analyse (as pm.run.scope),
// Harvard-methode, indexclausule. The guard below runs on the text after the
// SAY rules, so a word a rule rewrites passes and a misread one fails the build.
const SAY = [
  [ // s1 position and interest
    { nl: 'Een {t:Standpunt|standpunt} is wat iemand zegt te willen: het rapport moet vrijdag af.',
      en: 'A {t:Position|position} is what someone says they want: the report by Friday.' },
    { nl: 'Een {t:Belang|belang} is waarom hij het wil: een directieoverleg op maandag.',
      en: 'An {t:Interest|interest} is why they want it: a board meeting on Monday.' },
    { nl: 'Dit heet {t:Principieel onderhandelen|principieel onderhandelen}, of de Harvard-methode: standpunten graven zich in, belangen openen opties.',
      en: 'This is {t:Principled negotiation|principled negotiation}, the Harvard method: positions dig in, interests open options.' },
    { nl: 'Vraag dus waarom, en waarom niet: wat levert dat je op?',
      en: 'So ask why, and why not: what would that give you?' },
    { nl: 'Luister naar behoeften als zekerheid, grip, geld en tijd, en schrijf ze naast de jouwe.',
      en: 'Listen for needs such as security, control, money and time, and write them next to yours.' },
  ],
  [ // s2 trades and a standard
    { nl: 'Gedeelde en verschillende belangen helpen allebei: de een let op de datum, de ander op de kosten.',
      en: 'Shared and different interests both help: one cares about the date, the other about cost.' },
    { nl: 'Dan kun je ruilen: geef wat jou weinig kost. Leg meerdere punten tegelijk op tafel, in een {t:Pakketdeal|pakketdeal}.',
      en: 'Then trade: give what is cheap for you. Put several issues on the table at once, in a {t:Package deal|package deal}.' },
    { nl: 'Gebruik een {t:Eerlijke maatstaf|eerlijke maatstaf}, zoals een marktprijs of data. Dan zegt iedereen ja zonder gezichtsverlies.',
      en: 'Use a {t:Fair standard|fair standard}, like a market rate or past data, so both can say yes without losing face.' },
    { nl: 'Snel het verschil delen voelt eerlijk, maar het beloont wie het extreemst opende.',
      en: 'Splitting the difference early feels fair, but rewards whoever opened most extreme.' },
    { nl: 'Anderen zeggen: emoties beslissen. Luister, benoem het gevoel, en vraag: wat lost dit voor je op?',
      en: 'Chris Voss: emotions decide. Listen, name the feeling, and ask: what would this solve for you?' },
  ],
  [ // s3 a day extra?
    { nl: 'Bij een netbeheerder wil je elke klus twee dagen vooraf checken: vergunningen, materiaal, schakelplan.',
      en: 'At a grid operator you want every job checked two days ahead: permits, materials, switching plan.' },
    { nl: 'Het hoofd uitvoering zegt: mijn ploegen doen dat niet. Zijn standpunt: geen dag extra.',
      en: 'The head of execution says: my crews won\'t do it. His position: no extra day.' },
    { nl: 'Vraag: wat kost die dag je? Hij vreest stilstand, en dat planners hen de schuld geven.',
      en: 'Ask: what would that day cost you? He fears idle crews, and planners blaming them.' },
    { nl: 'Jouw belang: minder ritten voor niks. Dus planners checken, en ploegen krijgen alleen klare klussen.',
      en: 'Your interest: fewer wasted trips. So the planners check, and crews only get jobs that pass.' },
    { nl: 'Stel een pilot voor: vier weken, één regio. Maatstaf: ritten voor niks, ervoor en erna.',
      en: 'Propose a pilot: four weeks, one region. Standard: wasted trips, before and after.' },
  ],
  [ // s4 your alternative
    { nl: 'Je {t:BATNA|BATNA} is je beste alternatief zonder akkoord: wat je echt doet als je wegloopt.',
      en: 'Your {t:BATNA|BATNA} is your best alternative to a negotiated agreement: what you actually do if you walk away.' },
    { nl: 'Met een goed alternatief zeg je rustig nee. Een slecht maak je eerst beter.',
      en: 'With a good alternative you say no calmly. A bad one, you improve first.' },
    { nl: 'Daaruit volgt je {t:Ondergrens|ondergrens}: de slechtste deal die je nog accepteert.',
      en: 'From it follows your {t:Walk-away point|walk-away point}: the worst deal you still accept.' },
    { nl: 'Een klant biedt {n:950} euro per dag. Elders heb je een vast aanbod van duizend.',
      en: 'A client offers {n:950} euros a day; elsewhere you have a firm thousand.' },
    { nl: 'Is verder alles gelijk, dan is minder dan duizend slechter. Bepaal dat vóór het gesprek.',
      en: 'If nothing else differs, less than a thousand is worse. Decide before the meeting.' },
  ],
  [ // s5 the ZOPA
    { nl: 'Schat ook hun alternatief: een andere leverancier, het zelf doen, of wachten?',
      en: 'Estimate theirs too: another supplier, doing it themselves, or waiting?' },
    { nl: 'Tussen beide ondergrenzen ligt de {t:ZOPA|ZOPA}: de zone waarin een akkoord kan.',
      en: 'Between both walk-away points lies the {t:ZOPA|ZOPA}: the zone of possible agreement.' },
    { nl: 'Geen ZOPA? Dan helpt geen slimme zin. Verander wat er op tafel ligt.',
      en: 'No ZOPA? Then no clever wording helps. Change what is on the table.' },
    { nl: 'Bluf niet. Noem een echt alternatief rustig, als informatie, en werk aan een tweede optie.',
      en: 'Don\'t bluff. Mention a real alternative calmly, as information, and work on a second option.' },
    { nl: '{t:Overstapkosten|Overstapkosten}, zoals tijd, inwerken en {t:Kwalificatie|kwalificatie}, maken een alternatief zwakker.',
      en: '{t:Switching cost|Switching cost}, such as time, learning and {t:Qualification|qualification}, weakens an alternative.' },
    { nl: 'Fout: je BATNA overschatten. Een sterke laat je rustig zien, een zwakke houd je voor je.',
      en: 'A common failure: overrating your BATNA. Show a strong one calmly, keep a weak one to yourself.' },
  ],
  [ // s6 coated brackets
    { nl: 'Een fabrikant koopt gecoate beugels bij één leverancier. Die wil {n:12} procent meer.',
      en: 'A manufacturer buys coated brackets from one supplier. It wants {n:12} percent more.' },
    { nl: 'Een tweede zit {n:4} procent boven nu, maar moet {n:10} weken kwalificeren. Zelf coaten kan niet.',
      en: 'A second quotes {n:4} percent above today, but needs {n:10} weeks to qualify. No coating in-house.' },
    { nl: 'Jouw BATNA: overstappen. Die van hen: jouw volume kwijt.',
      en: 'Your BATNA: switching. Theirs: losing your volume.' },
    { nl: 'Start de kwalificatie nu al: dat verbetert je alternatief.',
      en: 'Start the qualification now: it improves your alternative.' },
    { nl: 'Vraag wat achter de {n:12} procent zit. Bied {n:4} procent nu, met een indexclausule op de energieprijs.',
      en: 'Ask what drives the {n:12} percent, and offer {n:4} percent now, with an index clause on the energy price.' },
    { nl: 'Je ondergrens ligt rond de {n:4} procent, plus wat het kwalificeren kost.',
      en: 'Your walk-away point is near the {n:4} percent, plus what qualifying costs.' },
  ],
  [ // s7 the first number
    { nl: 'Het eerste getal is een {t:Anker|anker}: het trekt ieders schatting mee, zelfs willekeurig.',
      en: 'The first number is an {t:Anchor|anchor}: it pulls every estimate along, even when arbitrary.' },
    { nl: 'Het eerste bod voorspelt de deal sterk. Ken je de markt, noem dan zelf het eerste getal.',
      en: 'The first offer strongly predicts the deal. If you know the market, name the first number yourself.' },
    { nl: 'Maak het ambitieus en verdedigbaar. Zonder onderbouwing kost het geloofwaardigheid, soms het hele gesprek.',
      en: 'Make it ambitious and defensible. Without a basis it costs credibility, sometimes the whole talk.' },
    { nl: 'Een planningsdiagnose bij drie kantoren. De laatste drie kostten {n:18}, {n:22} en {n:20} dagen.',
      en: 'A planning diagnostic at three offices. The last three took {n:18}, {n:22} and {n:20} days.' },
    { nl: 'Inkoop zei een dag of {n:10}. Jij: het waren er {n:18} tot {n:22}, dus {n:20}.',
      en: 'Purchasing said about {n:10}. You: it took {n:18} to {n:22}, so {n:20}.' },
    { nl: 'Niet hun {n:10}, en niet zonder reden het midden, {n:15}.',
      en: 'Not their {n:10}, and not the middle, {n:15}, without a reason.' },
    { nl: 'Duwen ze terug, ruil dan scope: met {n:12} dagen één regio grondig.',
      en: 'If they push back, trade scope: with {n:12} days, one region thoroughly.' },
  ],
  [ // s8 framing and concessions
    { nl: 'Ankert de ander eerst? Vraag waar zijn getal vandaan komt, en noem het jouwe.',
      en: 'They anchor first? Ask where their number comes from, and name yours.' },
    { nl: 'Een {t:Tegenbod|tegenbod} vlak bij een onredelijk getal accepteert zijn anker.',
      en: 'A {t:Counteroffer|counteroffer} close to an unreasonable number accepts their anchor.' },
    { nl: '{t:Framing|Framing}: {n:95} procent op tijd, of één op de {n:20} te laat.',
      en: '{t:Framing|Framing}: {n:95} percent on time, or one in {n:20} late.' },
    { nl: 'Door {t:Verliesaversie|verliesaversie} weegt verlies zwaarder: zonder dit verlies je {n:300} ploeguren per maand.',
      en: 'Through {t:Loss aversion|loss aversion}, losses weigh more: without this you lose {n:300} crew hours a month.' },
    { nl: 'Plan je {t:Concessie|concessies} steeds kleiner: {n:20}, {n:19}, {n:18.5} dagen, en vraag telkens iets terug.',
      en: 'Plan your {t:Concession|concessions} ever smaller: {n:20}, {n:19}, {n:18.5} days, and get something back each time.' },
    { nl: 'Kent de ander de markt beter? Laat hem openen, of noem een bandbreedte met je doel onderaan: {n:20} tot {n:22}.',
      en: 'They know the market better? Let them open, or name a range with your target at the bottom: {n:20} to {n:22}.' },
  ],
  [ // s9 no, and what can
    { nl: 'Altijd ja maakt je ja minder waard. De {t:Positieve nee|positieve nee}: ja, nee, ja.',
      en: 'Always yes makes your yes worth less. The {t:Positive no|positive no}: yes, no, yes.' },
    { nl: 'Ja tegen wat je beschermt, een duidelijk nee, dan ja tegen een optie.',
      en: 'Yes to what you protect, a clear no, and then yes to an option.' },
    { nl: 'Ik ga het proberen klinkt als ja. Geef één echte reden, dan stil.',
      en: 'I\'ll try sounds like yes. Give one real reason, then stop talking.' },
    { nl: 'Of {t:Ruil aanbieden|bied een ruil aan}: wat vervalt er dan? Laat kiezen wie bepaalt wat voorgaat.',
      en: 'Or {t:Offer a trade|offer a trade}: what can drop? Whoever sets the priorities chooses.' },
    { nl: 'Een {t:Rode lijn|rode lijn} ruil je niet: veiligheid, integriteit, regels.',
      en: 'A {t:Red line|red line} is not for trading: safety, integrity, rules.' },
    { nl: 'Bereid je nee voor: geen drie keer sorry, geen lange uitleg.',
      en: 'Prepare your no: no apologising three times, no long reasons.' },
    { nl: 'Donderdag vier uur. Je baas wil de stuurgroeppresentatie om, voor morgen acht uur.',
      en: 'Thursday, four o\'clock: your boss wants the steering deck reworked by eight tomorrow.' },
    { nl: 'Maar je beloofde de planningsleider een analyse voor vrijdag twaalf uur.',
      en: 'But you promised the planning lead an analysis by Friday noon.' },
    { nl: 'Ja: ik wil ook een sterke presentatie. Nee: allebei goed lukt vanavond niet.',
      en: 'Yes: I want a strong deck too. No: I can\'t do both properly tonight.' },
    { nl: 'Ja, met opties: drie dia\'s en de analyse op tijd, of de analyse naar maandag.',
      en: 'Yes, with options: three slides and the analysis on time, or the analysis on Monday.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above), checked after the
// SAY rules, so a rule that would bring one back fails the build too
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(\w*manager\w*|engagement|slides?|e-?mail|mail\w*|FBI|Fisher|Ury|Kahneman|Tversky|Galinsky|Mussweiler|Ames|Mason|Voss|Getting|pakketdeal|deal|framing|integriteit|timing|prioriteit\w*|capaciteitsbesluit|energieprijsindex|gecoate|coaten)\b|(^|[.?!;]\s)Eén\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%€]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(sayable(plain, 'nl'))) throw new Error(`narration: "${MISREAD.exec(sayable(plain, 'nl'))[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// Scene lengths follow the narration (its words / 2.5, the longer language),
// never shorter than the captions (as shown, with their glosses) need to be
// read; the whole within the 300 s cap.
{
  const shown = resolveFilm(spec, lessons);
  spec.scenes.forEach((s, si) => {
    const said = Math.max(...['nl', 'en'].map((lang) => wordsOf(SAY[si].map((l) => plainSay(l[lang])).join(' '))));
    const read = Math.max(...['nl', 'en'].map((lang) => wordsOf(shown.scenes[si].beats.map((b) => b.text[lang]).join(' '))));
    s.dur = Math.max(Math.ceil(minSceneDur(read)), Math.round(said / 2.5));
  });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > 300) throw new Error(`film is ${total} s, over 300`);
}
// each beat's still (reduced motion) sits late in its own share of the scene
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

// ---------------------------------------------------------------- page script and styles
const C = { SLOTS, RATE, BRK, PAST, CONC, dur: spec.scenes.map((s) => s.dur) };
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"])';
const css = PM_CSS + `
.iso{--sc-you:#5FA877;--sc-them:#C99A5B}
.iso[data-theme="light"]{--sc-you:#3B7F52;--sc-them:#A5712E}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1.4}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.pm-dot{fill:var(--anatomy-mid)}
.sc-you{fill:color-mix(in srgb,var(--sc-you) 55%,transparent);stroke:var(--sc-you);stroke-width:1.4}
.sc-them{fill:color-mix(in srgb,var(--sc-them) 55%,transparent);stroke:var(--sc-them);stroke-width:1.4}
.sc-zone{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:4 3}
.sc-mark{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
.pm-chip{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-tick{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-chip{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-axis{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.scope) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-chip{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash,.pm-mini .sc-you,.pm-mini .sc-them,.pm-mini .sc-zone{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte met een whiteboard (een kleine kopie van het paneel) en een klok. Jij, de adviseur in petrol, staat bij het bord; aan tafel de teamleider, de sponsor in pak (de andere partij) en de planner. Op tafel een laptop en een voorbereidingsblad met hun belangen en de jouwe. Rechts een paneel met per scène een kaart, gemarkeerd als schema of voorbeeld: standpunt en belang; ruil, pakketdeal en eerlijke maatstaf; de gereedheidscheck bij een netbeheerder; BATNA, ondergrens en 950 tegen 1.000 euro per dag; twee balken die naar elkaar schuiven tot de ZOPA verschijnt; overstapkosten; gecoate beugels met 12 en 4 procent; het anker op een lijn van dagen; framing en kleiner wordende concessies; de positieve nee als ja, nee, ja, en de donderdagmiddag met twee opties.',
  en: 'A meeting room with a whiteboard (a small copy of the panel) and a clock. You, the consultant in petrol, stand at the board; at the table the team lead, the sponsor in a suit (the other side) and the planner. On the table a laptop and a preparation sheet with their interests and yours. At the right a panel with one card per scene, marked as diagram or example: position and interest; trades, package deal and fair standard; the readiness check at a grid operator; BATNA, walk-away point and 950 against 1,000 euros a day; two bars that slide together until the ZOPA appears; switching cost; coated brackets with 12 and 4 percent; the anchor on a line of days; framing and shrinking concessions; the positive no as yes, no, yes, and the Thursday afternoon with two options.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  console.log(`scenes: ${data.scenes.map((s) => s.dur).join(' + ')} = ${data.scenes.reduce((a, s) => a + s.dur, 0)} s`);
}

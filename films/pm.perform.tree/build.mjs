// Dev tool, not shipped. Builds the explainer film "Van strategie tot
// teamcijfer / From strategy to team number" for Projecten, module Sturen op
// prestaties: pm.perform.kpis (level 1 of Indicatoren die sturen, "Een paar
// indicatoren die sturen"), pm.perform.tree (level 2 of the same topic, "Van
// strategie naar de cijfers van een team"), pm.perform.targets (level 2 of
// Doelen en targets, "Doelen waar mensen in geloven") and pm.perform.gaming
// (level 2 of Het prestatiegesprek en gedrag, "Gaming en verkeerde prikkels").
//
//   node films/pm.perform.tree/build.mjs            build the page
//   node films/pm.perform.tree/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.perform.tree.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.perform.tree, P2: a KPI tree growing, a target, gaming bending a number,
// output, outcome, benefits; 120 s; five scenes). Storyboard drift: eight
// scenes and about five minutes, because a lesson with a film no longer shows
// its worked example, so the film carries the whole teach text and the worked
// example of four lessons: numbers that steer (s1) and late deliveries (s2,
// the kpis example), the KPI tree (s3) and 26 weeks to a connection (s4, the
// tree example, with cascading), targets people believe (s5) and scrap on one
// cell (s6, the targets example), when a measure becomes a target (s7) and
// stopping the clock (s8, the gaming example). The row also names
// portfolio.benefits (output, outcome, benefits: the plan's fifth scene); its
// five teach blocks and worked example do not fit next to these four lessons
// in one narration of about 760 words, so that lesson is left for a second
// film and gets no film field here.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (the board repeats the panel's card in
// miniature) and a wall clock, a table with the scorecard on one A4 and a
// laptop, and the recurring cast: "jij" the consultant in petrol at the board,
// the sponsor (the plant manager, management), the team lead (the team, the
// crews) and the planner (the planning lead). A panel at the right, in stage
// space, carries one card per scene, labelled "schema" (a general picture) or
// "voorbeeld" (the worked examples; a scene that moves between example and
// rule switches its label at that beat). Each block of a card is its own cue
// group, so every sentence lights what it explains (strictFocus).
//
// Checklist (lesson point: scene and beat; "card" = on the card, not spoken,
// each on screen for at least 4 s):
//   kpis teach 1: a KPI, key performance indicator, a number someone acts on;
//     nobody acts: a report figure (s1 b1; the Dutch long form on the card);
//     three to seven numbers per team, a wall of forty read by nobody (s1 b2);
//     per level: the board a few results, a team what it can move this week
//     (card, s1 b2)
//   kpis teach 2: lagging, the result after the fact: on-time delivery last
//     month (s1 b3), customer minutes lost, cost per connection (card); leading,
//     moves before and points to what to do: materials ready two days before
//     the start (s1 b4), preventive maintenance on time, backlog age (card);
//     lagging: did you win, leading: will you (s1 b5)
//   kpis teach 3: a written definition, "late" is a day or more after the
//     confirmed date (s2 b2, the example's definition: confirmed date, per
//     order line, zero days late); one owner (s2 b2); an undisputed source, a
//     fitting frequency, a known direction, higher or lower better; arguments
//     are two people measuring different things under one name (s2 b3)
//   kpis teach 4: one number alone gets pushed at the cost of the rest;
//     paired indicators (s2 b5); output with quality, speed with safety, cost
//     with service (card, s2 b5); Kaplan and Norton 1992, the balanced
//     scorecard, four views: financial, customer, internal processes, learning
//     and growth (s1 b6, the four on the card); financial alone says how it
//     went, not where you are heading (s1 b6)
//   kpis teach 5: dashboards grow every year, adding easy, removing scary;
//     leading indicators harder to find, so only lagging ones remain (s2 b6);
//     standardising argued: one set compares easily but a team steers on what
//     it cannot move (card, s2 b6 and b7); the sharp question "when this went
//     red last time, what did someone do differently?" (s2 b7)
//   kpis example: a parts manufacturer, complaints about late deliveries; the
//     plant manager (card) wants one KPI, on-time delivery (s2 b1), in % of
//     order lines, monthly (card); step 1 keep it as the lagging result, define
//     it: the confirmed date, per order line, zero days late; owner the
//     planning lead (s2 b2); step 2 leading numbers the teams move weekly:
//     schedule adherence at the bottleneck, orders released with all materials
//     (s2 b4); step 3 first-pass yield, right first time, so delivery isn't
//     bought by rushing parts (s2 b5; "first time right" on the card)
//   tree teach 1: a KPI tree, also a driver tree (card), breaks a goal into the
//     numbers that cause it; a result at the top, such as lead time (s3 b1;
//     cost per unit on the card); each level down asks "what drives this?",
//     until numbers a team controls; such a cause is a driver (s3 b2); on one
//     page (card, s3 b1 and b2)
//   tree teach 2: a math tree adds or multiplies exactly; the press line: good
//     output = hours x share running x parts per running hour x good share (s3
//     b3); a logic tree names the main drivers, satisfaction from speed,
//     quality and contact (card), no formula; use math where you can: you know
//     what each branch is worth (s3 b4)
//   tree teach 3: each branch an owner: planning, maintenance, engineering,
//     quality; the last three the OEE factors (s3 b5); check the tree with data:
//     a branch that hardly varies won't explain the gap; the biggest gap to a
//     realistic level; stop where a team can act weekly (s3 b6)
//   tree teach 4: cascading, a goal into goals for the levels below; not
//     copying, a team's own driver, not a slice (s4 b4, "slice" on the card);
//     "lead time 20% down" a slogan, "jobs started on the planned day from 70%
//     to 85%" a team number (s4 b4)
//   tree teach 5: drawn once for a slide and never checked, overlapping
//     branches (two teams claim one gain: card), drivers nobody owns (s4 b5);
//     four multiplied branches +10% each, the top about +46%, 1.1 x 1.1 x 1.1
//     x 1.1 = 1.46 (s4 b5, the product on the card); how deep: practitioners
//     argue, until someone can act weekly (s3 b6 and card s4 b5); the sharp
//     question "if this branch improves 10%, what happens at the top?" (card,
//     s4 b5)
//   tree example: a grid operator, request to working connection for small
//     users (card: homes, small shops), 26 weeks, steps in series: intake 3,
//     design and permits 9, waiting for a crew 10, execution 1, meter 3 (s4 b1,
//     the five on the card); step 1 their sum 3 + 9 + 10 + 1 + 3 = 26, a math
//     tree (s4 b2); step 2 the big branches waiting (10) and design and permits
//     (9) (s4 b2), execution little to win (card); step 3 crew capacity or jobs
//     bounced back because not ready; each step one owner and one weekly team
//     number, the share of jobs passing the readiness check (s4 b3), design,
//     permit and materials in place before a crew is booked (card)
//   targets teach 1: goal-setting theory, Edwin Locke and Gary Latham, some
//     400 studies, their 2002 review (card), specific difficult goals beat "do
//     your best" (s5 b1); as long as goal acceptance (worth it and possible:
//     card), the skills, feedback on progress; a target nobody believes is a
//     wish (s5 b2)
//   targets teach 2: too hard: people give up; unmet goals push people to cut
//     corners: Schweitzer, Ordóñez and Douma 2004 (names on the card), those who
//     missed a specific goal, especially narrowly, overstated their results
//     more often than do-your-best (s5 b3); a hard goal needs a believable
//     path, not only pressure (card, s5 b3)
//   targets teach 3: base a target on data, not last year plus ten percent;
//     start from the baseline, the current level over recent weeks (s5 b4);
//     the spread, the best weeks and why (card); a target near the best weeks
//     actually achieved is believable (s5 b4); beyond anything seen needs a
//     changed method: say what changes (card, s5 b4)
//   targets teach 4: a target range, not a point, because results vary (s6
//     b1); "between 83 and 87%, aiming for 85" (card); a single point turns
//     every dip into a failure (card); the target apart from the trigger, where
//     we stop and look for a cause (s6 b1), any week below 80% (card)
//   targets teach 5: involve the people who must hit it; people defend targets
//     they helped set; the ambition stays yours (s6 b5); what is realistic in
//     three months, what must change for more; a proposal below their own best
//     weeks: ask why (card, s6 b5); stretch goals argued: new methods or
//     cynicism (card, s6 b5); the sharp question "what would we have to change
//     to make our best week a normal week?" (s6 b5)
//   targets example: a parts manufacturer, scrap on one machining cell over
//     eight weeks, 4.1 3.6 5.2 3.9 4.4 3.3 4.8 3.7 (drawn on the chart), about
//     4.1% on average, nothing changed yet, management wants 1% (s6 b2); step 1
//     1% far below any week, nothing changed, nobody believes it; step 2 close
//     to the best weeks 3.3 and 3.6 (card): a range of 3.0 to 4.0%, aiming for
//     3.5, reviewed after eight weeks (card); above 5% the trigger (s6 b3);
//     step 3 keep the ambition visible: root-cause work on the biggest defect
//     can make 1% realistic later; say it out loud (s6 b4)
//   gaming teach 1: Goodhart's law, economist Charles Goodhart 1975 (card), a
//     statistic used for control starts to behave differently (card); the
//     phrasing everyone quotes, anthropologist Marilyn Strathern 1997 (card):
//     "when a measure becomes a target, it ceases to be a good measure" (s7
//     b1); pressure on one number, the cheapest way to move it; gaming, moving
//     the number without improving what it was meant to show (s7 b2)
//   gaming teach 2: shifting work, cost or defects just outside the measured
//     period or scope; cherry-picking, the easy jobs to hit a count, the hard
//     ones left; redefining what counts; fudging the data (s7 b3); a perverse
//     incentive, a reward that encourages the opposite; Steve Kerr 1975, "On
//     the Folly of Rewarding A, While Hoping for B" (s7 b4)
//   gaming teach 3: Wells Fargo, aggressive sales targets, accounts customers
//     never asked for (s7 b5): about 1.5 million deposit accounts and 565,000
//     credit cards in the 2016 regulator findings, later up to 3.5 million;
//     $185 million in fines in 2016 and $3 billion in 2020 (card, s7 b5);
//     nobody designed fraud, the pressure made it the easiest way (s7 b5)
//   gaming teach 4: the number improves but nothing around it; jumps right
//     before the deadline; results just above the threshold, the line between
//     red and green; paired numbers moving the wrong way (s8 b1); on-time
//     delivery up while complaints rise (card); ask the floor "what do people
//     do to make this number green?" (card, s8 b1)
//   gaming teach 5: prevention: pair indicators, some numbers for learning
//     only, change the definition when you see gaming, look at the work itself
//     (s8 b5, the list on the card); not bad people but a badly designed
//     system, fix the system first (s8 b5); bonuses on single KPIs argued
//     (card); the sharp question "if you wanted to hit this number without
//     improving anything, how would you do it?" (s8 b5)
//   gaming example: a grid operator, a team bonus on the share of outages
//     restored within 4 hours, 88% to 97% in one quarter (s8 b2); repeat
//     outages at the same address within 30 days from 6 to 14 per 100 (s8 b3);
//     the suspicion: temporary fixes stop the clock (s8 b3); check, don't
//     accuse: follow-up work orders, ask the crews; then fix the system: pair
//     with repeat outages, the bonus off the single number (s8 b4)
//
// Facts checked (2026-11-12): Charles Goodhart, "Problems of Monetary
// Management: The U.K. Experience" (1975): "any observed statistical
// regularity will tend to collapse once pressure is placed upon it for control
// purposes". Marilyn Strathern, "'Improving ratings': audit in the British
// University system", European Review 5 (1997): "When a measure becomes a
// target, it ceases to be a good measure" (her generalisation of Goodhart).
// Steven Kerr, "On the Folly of Rewarding A, While Hoping for B", Academy of
// Management Journal 18 (1975). Robert Kaplan and David Norton, "The Balanced
// Scorecard: Measures That Drive Performance", Harvard Business Review 1992,
// four perspectives (financial, customer, internal business process, learning
// and growth; the film says "processes" and "learning and growth" as the
// lesson does). Edwin Locke and Gary Latham, "Building a practically useful
// theory of goal setting and task motivation: a 35-year odyssey", American
// Psychologist 57 (2002), some 400 laboratory and field studies; commitment,
// ability and feedback as conditions. Maurice Schweitzer, Lisa Ordóñez and
// Bambi Douma, "Goal setting as a motivator of unethical behavior", Academy of
// Management Journal 47 (2004): people with unmet specific goals overstated
// their performance more than do-your-best participants, especially when they
// fell just short. Wells Fargo: CFPB, OCC and Los Angeles City Attorney,
// September 2016 (about 1.5 million deposit and 565,000 credit card accounts
// possibly unauthorised; $185 million); 2017 estimate up to 3.5 million
// accounts; February 2020, $3 billion to resolve criminal and civil
// investigations (US Department of Justice and SEC). Leading and lagging
// indicators and KPI or driver trees as the lessons define them (no source
// named in film or lesson). 1.1^4 = 1.4641, about 1.46. Campbell's law is the
// next lesson's (pm.perform.campbell); this film does not name it.
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
const KP = 'pm.perform.kpis';
const TR = 'pm.perform.tree';
const TA = 'pm.perform.targets';
const GA = 'pm.perform.gaming';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n'); };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(KP, ['een cijfer waar iemand op handelt', 'rapportagecijfer, geen KPI', 'zo’n drie tot zeven cijfers', 'een muur van veertig leest niemand', 'de directie heeft een paar resultaten nodig',
  'meet het resultaat achteraf', 'verloren klantminuten', 'kosten per aansluiting', 'beweegt vóór het resultaat en laat zien wat je moet doen', 'twee dagen voor de start klaarligt', 'preventief onderhoud', 'de leeftijd van de werkvoorraad',
  'Achterlopend zegt of je gewonnen hebt. Voorlopend zegt of je gaat winnen.', 'opgeschreven definitie', 'één dag of meer na de datum die aan de klant is bevestigd', 'één eigenaar, een bron waar niemand over twist, een frequentie', 'is hoger beter of lager',
  'twee mensen die onder dezelfde naam iets anders meten', 'opgedreven ten koste van de rest', 'output met kwaliteit, snelheid met veiligheid, kosten met service', 'Kaplan en Norton maakten dat punt in 1992', 'financieel, klant, interne processen, en leren en groeien',
  'niet waar je heen gaat', 'dashboards die elk jaar groeien', 'er een weghalen eng voelt', 'Voorlopende indicatoren zijn lastiger te vinden', 'één KPI-set voor elk team', 'cijfers die het niet kan bewegen', 'Toen dit de vorige keer rood werd, wat deed iemand toen anders?',
  'onderdelenfabrikant krijgt klachten', 'leverbetrouwbaarheid, in % van de orderregels', 'maandelijks gerapporteerd', 'per orderregel, nul dagen te laat toegestaan', 'de planningsleider', 'planningsnaleving (schedule adherence) op de bottleneck',
  'vrijgegeven met al het materiaal op voorraad', 'first-pass yield', 'first time right', 'zonder herstelwerk', 'er snel doorheen te jagen']);
says(TR, ['ook wel driverboom', 'deelt een doel op in de cijfers die het veroorzaken', 'de doorlooptijd', 'de kosten per stuk', 'waar hangt dit van af?', 'die een team in de hand heeft', 'heet een driver', 'past op één pagina',
  'rekenboom telt op of vermenigvuldigt exact', 'beschikbare uren × aandeel van die uren dat hij draait × stuks per draaiuur × aandeel goede stuks', 'klanttevredenheid hangt af van snelheid, kwaliteit en contact', 'zonder formule', 'hoeveel elke tak waard is',
  'planning voor de uren, onderhoud voor het draaiaandeel, engineering voor de snelheid, kwaliteit voor het aandeel goed', 'De laatste drie zijn de OEE-factoren', 'een tak die nauwelijks varieert, verklaart het gat niet', 'grootste gat ten opzichte van een realistisch niveau', 'waar een team wekelijks kan handelen',
  'Doorvertalen (cascading)', 'niet kopiëren', 'geen plakje van het directiecijfer', '“Doorlooptijd 20% omlaag” voor elk team is een slogan', 'van 70% naar 85%', 'is een teamcijfer',
  'één keer voor een slide getekend', 'takken die overlappen, zodat twee teams dezelfde winst claimen', 'drivers zonder eigenaar', 'stijgt de top zo’n 46%', 'verschillen adviseurs van mening', '“Als deze tak 10% verbetert, wat gebeurt er dan bovenaan?”',
  'kleinverbruikers, zoals woningen en kleine winkels', 'Gemiddeld is dat 26 weken', 'De stappen lopen na elkaar', 'intake 3 weken, ontwerp en vergunningen 9 weken, wachten op een ploeg 10 weken, uitvoering 1 week, meter plaatsen 3 weken',
  '3 + 9 + 10 + 1 + 3 = 26 weken. Dat is een rekenboom', 'In de uitvoering (1) valt weinig te halen', 'is het ploegcapaciteit, of klussen die terugkomen omdat ze niet klaar waren?', 'één eigenaar en één wekelijks teamcijfer', 'door de gereedheidscheck', 'ontwerp, vergunning en materiaal er allemaal zijn voordat er een ploeg wordt ingepland']);
says(TA, ['Edwin Locke en Gary Latham', 'zo’n 400 studies', 'hun overzicht uit 2002', 'specifieke, moeilijke doelen tot betere prestaties leiden dan “doe je best”', 'doelacceptatie (mensen vinden het doel de moeite waard en haalbaar), de vaardigheden om het te doen, en feedback op de voortgang', 'geen doel maar een wens',
  'Mensen haken af', 'Schweitzer, Ordóñez en Douma (2004)', 'vooral als ze er dichtbij zaten, vaker over hun resultaat', 'een geloofwaardige weg nodig, niet alleen druk',
  'niet op vorig jaar plus tien procent', 'nulmeting (baseline): het huidige niveau, gemeten over de laatste weken', 'welke weken waren het best', 'dicht bij de beste weken die je echt gehaald hebt, is geloofwaardig', 'Zeg dan wat er verandert',
  'bandbreedte, niet met één punt', '“Tussen 83 en 87%, mikpunt 85”', 'Eén punt maakt van elke normale dip een mislukking', 'actiegrens (trigger): het niveau waarop we stoppen en een oorzaak zoeken', 'elke week onder de 80%',
  'wat is haalbaar over drie maanden', 'Mensen verdedigen doelen die ze zelf mee hebben bepaald', 'De ambitie blijft wel van jou', 'onder hun eigen beste weken, vraag dan waarom', 'stretchdoelen', 'cynisme', '“Wat moeten we veranderen om onze beste week een gewone week te maken?”',
  'verspaningscel', '4,1, 3,6, 5,2, 3,9, 4,4, 3,3, 4,8, 3,7', 'ongeveer 4,1%', 'Er is nog niks aan het proces veranderd', 'doel van 1%', '1% ligt ver onder elke week', '(3,3 en 3,6)', 'bandbreedte van 3,0 tot 4,0%, mikpunt 3,5, na acht weken evalueren', 'Een week boven 5% is de actiegrens',
  'naar het grootste defect', 'later realistisch kan maken. Zeg dat hardop']);
says(GA, ['econoom Charles Goodhart (1975)', 'zich anders gaat gedragen', 'antropoloog Marilyn Strathern (1997)', '“Zodra een maatstaf een doel wordt, is het geen goede maatstaf meer.”', 'de goedkoopste manier om het te bewegen', 'zonder te verbeteren wat het moest laten zien',
  'net buiten de gemeten periode of scope schuiven', 'de krenten uit de pap halen (cherry-picking), de makkelijke klussen doen om een aantal te halen en de lastige laten liggen', 'de definitie veranderen van wat meetelt', 'sjoemelen met de data',
  'een beloning die het tegenovergestelde uitlokt', 'Steve Kerr beschreef het in 1975', 'A belonen en op B hopen',
  'Wells Fargo', 'agressieve verkoopdoelen', 'zo’n 1,5 miljoen betaal- en spaarrekeningen en 565.000 creditcards', 'later geschat op tot 3,5 miljoen rekeningen', '185 miljoen dollar aan boetes', 'in 2020 nog eens 3 miljard dollar', 'Niemand ontwierp fraude',
  'het cijfer wordt beter, maar niks eromheen', 'Plotselinge sprongen vlak voor de deadline', 'net boven de grenswaarde ophopen, de lijn tussen rood en groen', 'Gekoppelde cijfers die de verkeerde kant op gaan', 'leverbetrouwbaarheid omhoog terwijl de klachten ook stijgen', '“Wat doen mensen om dit cijfer groen te krijgen?”',
  'zet indicatoren in paren, houd sommige cijfers alleen om van te leren, zonder bonus eraan, pas de definitie aan als je gaming ziet, en kijk naar het werk zelf', 'een redelijk antwoord op een slecht ontworpen systeem', 'pak eerst het systeem aan', 'of bonussen überhaupt aan losse KPI’s moeten hangen',
  '“Als je dit cijfer wilde halen zonder iets te verbeteren, hoe zou je dat doen?”',
  'teambonus aan “aandeel storingen binnen 4 uur verholpen”', 'van 88% naar 97%', 'binnen 30 dagen op hetzelfde adres terugkomt van 6 naar 14 per 100', 'de klok wordt stilgezet met tijdelijke oplossingen', 'Check het, beschuldig niet', 'vervolgwerkorders',
  'vraagt ploegen wat ze doen om de 4 uur te halen', 'koppel het 4-uurscijfer aan terugkerende storingen binnen 30 dagen', 'de bonus los te maken van dat ene cijfer']);
says(KP, ['the date confirmed to the customer', 'zero days late allowed', 'schedule adherence at the bottleneck'], 'en');
says(TR, ['26 weeks', 'waiting for a crew 10 weeks', 'from 70% to 85%', 'about 46%'], 'en');
says(TA, ['4.1, 3.6, 5.2, 3.9, 4.4, 3.3, 4.8, 3.7', 'a range of 3.0 to 4.0%, aiming for 3.5', 'A week above 5% is the trigger'], 'en');
says(GA, ['“When a measure becomes a target, it ceases to be a good measure.”', 'from 88% to 97%', 'from 6 to 14 per 100'], 'en');
// the tree example: steps in series, so lead time is their sum
const STEPS = [3, 9, 10, 1, 3];
assert(STEPS.reduce((a, b) => a + b, 0) === 26, 'the five steps add up to 26 weeks');
assert(STEPS[2] === Math.max(...STEPS) && [...STEPS].sort((a, b) => b - a)[1] === STEPS[1], 'waiting (10) and design (9) are the two big branches');
// four multiplied branches 10% better: about 46% at the top
assert(Math.round((1.1 ** 4 - 1) * 100) === 46, 'four branches +10% give about +46%');
// the targets example: eight weeks of scrap, about 4.1% on average; the best weeks 3.3 and 3.6
const SCRAP = [4.1, 3.6, 5.2, 3.9, 4.4, 3.3, 4.8, 3.7];
assert(Math.abs(SCRAP.reduce((a, b) => a + b, 0) / SCRAP.length - 4.1) < 0.05, 'scrap averages about 4.1%');
assert([...SCRAP].sort((a, b) => a - b).slice(0, 2).join() === '3.3,3.6', 'the best weeks are 3.3 and 3.6');
assert(Math.min(...SCRAP) > 1 && Math.max(...SCRAP) > 5, '1% is below every week; one week went above 5%');
// the gaming example: restored within 4 hours 88 to 97%, repeats 6 to 14 per 100
const RESTORED = [88, 97];
const REPEAT = [6, 14];
assert(RESTORED[1] > RESTORED[0] && REPEAT[1] > REPEAT[0], 'the bonus number and the repeats both rose');

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
const CARD = w.sheet({ x: 120, y: 134, z: TZ, w: 21, d: 29.7, lines: 9 });
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

const world = [
  w.room(ROOM),
  w.clock(266, 196, 10),
  cueG('board', BOARD.svg + boardMini),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  cueG('sheet', CARD.svg),
  w.laptop({ x: 206, y: 140, z: TZ, toward: 1 }),
  w.cup(176, 176, TZ),
  w.person({ x: 274, y: 156, role: 'sponsor', along: 'y' }),
  w.person({ x: 214, y: 222, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so the narration can light it.
const PX = 322;
const PW = 308;
const CUES = ['kpi', 'few', 'lag', 'lead', 'won', 'bsc',
  'case', 'step1', 'def', 'step2', 'pair', 'grow', 'std', 'ask',
  'tree', 'drv', 'math', 'logic', 'owners', 'check',
  'grid', 'sum', 'crew', 'cascade', 'mult',
  'gst', 'accept', 'hard', 'base',
  'range', 'trig', 'cell', 'prop', 'amb', 'best',
  'goodhart', 'gaming', 'forms', 'cherry', 'perverse', 'wells',
  'spot', 'thr', 'bonus', 'back', 'fix', 'system'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));

// Static paths with relative line-tos (the helper of pm.land.adoption): the
// same points, fewer bytes; each rewrite is read back.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put2 = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    nums.forEach((v, i) => { const t = n(v); s += (i === 0 && s === '' && !t.startsWith('-') && out && /[\d.]$/.test(out)) || (i > 0 && !t.startsWith('-')) ? ` ${t}` : t; });
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put2('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put2('M', p); cur = p; start = p; cmd = 'L'; } else { put2('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
  }
  return out;
}
function pointsOf(d) {
  const tok = d.match(/[MLZlz]|-?\d*\.?\d+/g);
  const out = [];
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  for (let i = 0; i < tok.length;) {
    if (/[MLZlz]/.test(tok[i])) { cmd = tok[i++]; if (/[Zz]/.test(cmd)) { out.push('Z'); cur = start; } continue; }
    const v = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    cur = cmd === 'l' ? [cur[0] + v[0], cur[1] + v[1]] : v;
    if (cmd === 'M') { start = cur; cmd = 'L'; out.push('M'); }
    out.push(cur.join());
  }
  return out.join(' ');
}
const compact = (html) => html.replace(/ d="([MLZ\d.\s-]+)"/g, (m, d) => {
  if (/\.\d\d/.test(d)) return m;
  const c = compactPath(d);
  if (pointsOf(c) !== pointsOf(d)) throw new Error(`compactPath changed a path: ${d.slice(0, 60)}`);
  return ` d="${c}"`;
});
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const r1 = (v) => Math.round(v * 10) / 10;
const BOARD_AT = w.at([145, 0, 150]).map(r1);
const SHEET_AT = w.at([130, 148, TZ]).map(r1);
const LEAD_AT = w.at([76, 182, 120]).map(r1);
const SPON_AT = w.at([274, 156, 120]).map(r1);
const PLAN_AT = w.at([214, 222, 120]).map(r1);
const CAM = [
  { from: [BOARD_AT[0], BOARD_AT[1], 1.1], to: [150, 200, 1] },
  { from: [SPON_AT[0], SPON_AT[1], 1.04], to: [PLAN_AT[0], PLAN_AT[1], 1.1] },
  { from: [150, 200, 1], to: [BOARD_AT[0], BOARD_AT[1], 1.1] },
  { from: [PLAN_AT[0], PLAN_AT[1], 1.08], to: [LEAD_AT[0], LEAD_AT[1], 1.04] },
  { from: [150, 210, 1], to: [SHEET_AT[0], SHEET_AT[1], 1.08] },
  { from: [SPON_AT[0], SPON_AT[1], 1.06], to: [LEAD_AT[0], LEAD_AT[1], 1.06] },
  { from: [BOARD_AT[0], BOARD_AT[1], 1.04], to: [150, 205, 1] },
  { from: [LEAD_AT[0], LEAD_AT[1], 1.06], to: [150, 200, 1] },
];

// ---------------------------------------------------------------- the film
const LV = { [KP]: 1, [TR]: 2, [TA]: 2, [GA]: 2 };
const sc = (id, lesson, title, beats) => ({ id, lesson, level: LV[lesson], dur: 0, still: 0.9, title, beats });
const spec = {
  id: 'pm.perform.tree',
  title: { nl: 'Van strategie tot teamcijfer', en: 'From strategy to team number' },
  lessons: [KP, TR, TA, GA],
  strictFocus: true,
  scenes: [
    sc('s1', KP, { nl: 'Cijfers die sturen', en: 'Numbers that steer' }, [
      { nl: '{t:KPI|KPI}, kritieke prestatie-indicator: een cijfer waar iemand op handelt.', en: '{t:KPI|KPI}, key performance indicator: a number someone acts on.', cue: { KPI: 'kpi' }, focus: 'kpi' },
      { nl: 'Drie tot zeven cijfers per team. Een muur van veertig leest niemand.', en: 'Three to seven numbers per team. A wall of forty gets read by nobody.', focus: ['few', 'teamlead'] },
      { nl: 'Een {t:Achterlopende indicator|achterlopende indicator} meet het resultaat achteraf.', en: 'A {t:Lagging indicator|lagging indicator} measures the result after the fact.', cue: { 'Achterlopende indicator': 'lag' }, focus: 'lag' },
      { nl: 'Een {t:Voorlopende indicator|voorlopende indicator} beweegt eerder en zegt wat je moet doen.', en: 'A {t:Leading indicator|leading indicator} moves first and shows what to do.', cue: { 'Voorlopende indicator': 'lead' }, focus: 'lead' },
      { nl: 'Achterlopend: heb je gewonnen? Voorlopend: ga je winnen?', en: 'Lagging: did you win? Leading: will you win?', focus: 'won' },
      { nl: 'De {t:Balanced scorecard|balanced scorecard}: Kaplan en Norton, 1992, vier invalshoeken.', en: 'The {t:Balanced scorecard|balanced scorecard}: Kaplan and Norton, 1992, four views.', cue: { 'Balanced scorecard': 'bsc' }, focus: ['bsc', 'sheet'] },
    ]),
    sc('s2', KP, { nl: 'Te late leveringen', en: 'Late deliveries' }, [
      { nl: 'Een onderdelenfabrikant: klachten over late leveringen. Op het bord: leverbetrouwbaarheid.', en: 'A parts manufacturer: complaints about late deliveries. On the board: on-time delivery.', focus: ['case', 'sponsor'] },
      { nl: 'Stap 1: de definitie. Tegen de bevestigde datum, per orderregel, nul dagen te laat.', en: 'Step 1: the definition. Against the confirmed date, per order line, zero days late.', focus: ['step1', 'planner'] },
      { nl: 'Ook: een bron zonder discussie, een passende frequentie, een bekende richting.', en: 'Also: an undisputed source, a fitting frequency, a known direction.', focus: 'def' },
      { nl: 'Stap 2: voorlopende cijfers die de teams elke week bewegen.', en: 'Step 2: leading numbers the teams can move every week.', focus: ['step2', 'teamlead'] },
      { nl: 'Stap 3: {t:Gekoppelde indicatoren|gekoppelde indicatoren}, zoals levering naast first-pass yield.', en: 'Step 3: {t:Paired indicators|paired indicators}, like delivery next to first-pass yield.', cue: { 'Gekoppelde indicatoren': 'pair' }, focus: 'pair' },
      { nl: 'Dashboards groeien elk jaar; voorlopende cijfers zijn lastig te vinden.', en: 'Dashboards grow every year; leading numbers are hard to find.', focus: 'grow' },
      { nl: 'Vraag bij elk cijfer: toen dit rood werd, wat deed iemand toen anders?', en: 'Ask of every number: when this went red, what did someone do differently?', focus: ['ask', 'jij'] },
    ]),
    sc('s3', TR, { nl: 'De KPI-boom', en: 'The KPI tree' }, [
      { nl: 'Een {t:KPI-boom|KPI-boom} deelt een doel op in de cijfers die het veroorzaken.', en: 'A {t:KPI tree|KPI tree} breaks a goal into the numbers that cause it.', cue: { 'KPI-boom': 'tree' }, focus: ['tree', 'board'] },
      { nl: 'Waar hangt dit van af? Elk antwoord is een {t:Driver|driver}, tot een team het in de hand heeft.', en: 'What drives this? Each answer is a {t:Driver|driver}, down to what a team controls.', cue: { Driver: 'drv' }, focus: 'drv' },
      { nl: 'Een {t:Rekenboom|rekenboom} rekent exact: uren × draaiaandeel × stuks per uur × aandeel goed.', en: 'A {t:Math tree|math tree} computes exactly: hours × running share × parts per hour × good share.', cue: { Rekenboom: 'math' }, focus: 'math' },
      { nl: 'Een {t:Logische boom|logische boom} noemt de belangrijkste drivers, zonder formule.', en: 'A {t:Logic tree|logic tree} names the main drivers, without a formula.', cue: { 'Logische boom': 'logic' }, focus: 'logic' },
      { nl: 'Elke tak een eigenaar. Draaiaandeel, snelheid en aandeel goed: de OEE-factoren.', en: 'Each branch an owner. Running share, rate and good share: the OEE factors.', focus: ['owners', 'planner', 'teamlead'] },
      { nl: 'Toets met data: een tak die nauwelijks varieert, verklaart het gat niet.', en: 'Check with data: a branch that hardly varies won’t explain the gap.', focus: 'check' },
    ]),
    sc('s4', TR, { nl: '26 weken tot een aansluiting', en: '26 weeks to a connection' }, [
      { nl: 'Een netbeheerder: van aanvraag tot aansluiting gemiddeld {n:26} weken, vijf stappen na elkaar.', en: 'A grid operator: request to connection takes {n:26} weeks on average, five steps in a row.', focus: 'grid' },
      { nl: 'De som is de doorlooptijd: een rekenboom. Wachten op een ploeg en ontwerp zijn de grote takken.', en: 'The sum is the lead time: a math tree. Waiting for a crew and design are the big branches.', focus: 'sum' },
      { nl: 'Te weinig ploegen, of klussen die terugkomen? Elke stap een eigenaar en een weekcijfer.', en: 'Too few crews, or jobs bounced back? Each step gets an owner and a weekly number.', focus: ['crew', 'planner'] },
      { nl: '{t:Doorvertalen|Doorvertalen} is geen kopiëren: elk team krijgt zijn eigen driver.', en: '{t:Cascading|Cascading} is not copying: each team gets its own driver.', cue: { Doorvertalen: 'cascade' }, focus: ['cascade', 'teamlead'] },
      { nl: 'Kleine winsten vermenigvuldigen: vier takken {n:10}% beter, de top zo’n {n:46}%.', en: 'Small gains multiply: four branches {n:10}% better, the top about {n:46}%.', focus: 'mult' },
    ]),
    sc('s5', TA, { nl: 'Doelen waar mensen in geloven', en: 'Targets people believe' }, [
      { nl: 'De {t:Doelzettingstheorie|doelzettingstheorie}: specifieke, moeilijke doelen werken beter dan doe je best.', en: '{t:Goal-setting theory|Goal-setting theory}: specific, hard goals work better than do your best.', cue: { Doelzettingstheorie: 'gst' }, focus: 'gst' },
      { nl: 'Mits er {t:Doelacceptatie|doelacceptatie}, vaardigheid en feedback is. Anders is het een wens.', en: 'As long as there is {t:Goal acceptance|goal acceptance}, skill and feedback. Otherwise it’s a wish.', cue: { Doelacceptatie: 'accept' }, focus: 'accept' },
      { nl: 'Te moeilijk? Mensen haken af, of overdrijven hun resultaat.', en: 'Too hard? People give up, or overstate their results.', focus: 'hard' },
      { nl: 'Begin bij de {t:Nulmeting|nulmeting}. Een doel dicht bij je beste weken is geloofwaardig.', en: 'Start from the {t:Baseline|baseline}. A target close to your best weeks is believable.', cue: { Nulmeting: 'base' }, focus: 'base' },
    ]),
    sc('s6', TA, { nl: 'Uitval op één cel', en: 'Scrap on one cell' }, [
      { nl: 'Een {t:Bandbreedte|bandbreedte}, geen punt. En los daarvan een {t:Actiegrens|actiegrens}.', en: 'A {t:Target range|target range}, not a point. And apart from it a {t:Trigger|trigger}.', cue: { Bandbreedte: 'range', Actiegrens: 'trig' }, focus: ['range', 'trig'] },
      { nl: 'Een verspaningscel: acht weken uitval, gemiddeld zo’n {n:4.1}%. Het management wil {n:1}%.', en: 'A machining cell: eight weeks of scrap, about {n:4.1}% on average. Management wants {n:1}%.', focus: ['cell', 'sponsor'] },
      { nl: 'Voorstel: {n:3.0} tot {n:4.0}%, mikpunt {n:3.5}. Boven {n:5}% ligt de actiegrens.', en: 'Proposal: {n:3.0} to {n:4.0}%, aiming for {n:3.5}. Above {n:5}% is the trigger.', focus: 'prop' },
      { nl: 'Houd de ambitie zichtbaar: oorzakenonderzoek kan {n:1}% later haalbaar maken.', en: 'Keep the ambition visible: root-cause work could make {n:1}% realistic later.', focus: 'amb' },
      { nl: 'Betrek het team. Wat moet er veranderen om onze beste week gewoon te maken?', en: 'Involve the team. What must change to make our best week a normal week?', focus: ['best', 'teamlead'] },
    ]),
    sc('s7', GA, { nl: 'Als een maatstaf een doel wordt', en: 'When a measure becomes a target' }, [
      { nl: 'De {t:Wet van Goodhart|wet van Goodhart}, in de woorden van Strathern, 1997.', en: '{t:Goodhart’s law|Goodhart’s law}, in Strathern’s words, 1997.', cue: { 'Wet van Goodhart': 'goodhart' }, focus: 'goodhart' },
      { nl: 'Druk op één cijfer geeft {t:Gaming|gaming}: het cijfer bewegen, niet wat het moest laten zien.', en: 'Pressure on one number brings {t:Gaming|gaming}: moving the number, not what it should show.', cue: { Gaming: 'gaming' }, focus: 'gaming' },
      { nl: 'Werk buiten de periode schuiven, de definitie veranderen, of de {t:Krenten uit de pap halen|krenten uit de pap halen}.', en: 'Shifting work outside the period, redefining what counts, or {t:Cherry-picking|cherry-picking}.', cue: { 'Krenten uit de pap halen': 'cherry' }, focus: ['forms', 'cherry'] },
      { nl: 'Een {t:Verkeerde prikkel|verkeerde prikkel} lokt het omgekeerde uit. Kerr, 1975: A belonen, op B hopen.', en: 'A {t:Perverse incentive|perverse incentive} encourages the opposite. Kerr, 1975: rewarding A, hoping for B.', cue: { 'Verkeerde prikkel': 'perverse' }, focus: 'perverse' },
      { nl: 'Wells Fargo: miljoenen rekeningen waar klanten nooit om vroegen.', en: 'Wells Fargo: millions of accounts customers never asked for.', focus: 'wells' },
    ]),
    sc('s8', GA, { nl: 'De klok stilzetten', en: 'Stopping the clock' }, [
      { nl: 'Herken het: het cijfer wordt beter, de rest niet. Resultaten net boven de {t:Grenswaarde|grenswaarde}.', en: 'Spot it: the number improves, nothing else does. Results just above the {t:Threshold|threshold}.', cue: { Grenswaarde: 'thr' }, focus: ['spot', 'thr'] },
      { nl: 'Een netbeheerder: bonus op storingen binnen {n:4} uur verholpen. Van {n:88} naar {n:97}%.', en: 'A grid operator: a bonus on outages restored within {n:4} hours. From {n:88} to {n:97}%.', focus: ['bonus', 'teamlead'] },
      { nl: 'Terug binnen {n:30} dagen: van {n:6} naar {n:14} per honderd. Wordt de klok stilgezet?', en: 'Back within {n:30} days: from {n:6} to {n:14} per hundred. Is the clock being stopped?', focus: 'back' },
      { nl: 'Check, beschuldig niet. Dan het systeem: koppel aan terugkomers, bonus los van één cijfer.', en: 'Check, don’t accuse. Then the system: pair with repeats, bonus off the single number.', focus: ['fix', 'jij'] },
      { nl: 'Gaming is meestal een slecht systeem, geen slechte mensen. Pak eerst het systeem aan.', en: 'Gaming is mostly a bad system, not bad people. Fix the system first.', focus: ['system', 'sponsor'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; it carries the spoken points of the
// checklist above. No symbols the voice would read aloud, no quotes or
// parentheses. Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). KPI is read kˌaːpˌeːˈiː, KPI-boom kˌaːpˌeːˈiːbˈoːm,
// as Dutch people say them: left as read. The terms the cards show are said,
// with rules added for this film in films/_kit/timeline.mjs (2026-11-12; no
// other film's spoken text changes, tests/filmvideo.test.js): driver
// (draiver), balanced scorecard (bellenst skoorkart), gaming (geeming), the
// names Goodhart (Goedhart), Strathern (Strèthurn), Locke en Latham (Lok en
// Leetum) and Kaplan en Norton (Norten), voorlopende, achterlopende and
// gekoppelde indicator (indie-kator), een actiegrens (actie-grens), deadline
// (dedlain), dashboards (desjbords), rapportagecijfer and orderregel (split at
// the head). The kit's existing rules give nulmeting (nul-meting),
// gereedheidscheck and OEE (O E E). Kept out of the Dutch narration because
// espeak-ng misreads them (they stay on the cards): plantmanager (said "de
// baas van de fabriek"), oorzakenonderzoek (said "onderzoek naar het grootste
// defect"), first-pass yield (said "het aandeel stuks dat in één keer goed
// is"), Schweitzer, Ordóñez en Douma (said "experimenten uit 2004"), Marilyn
// and Charles; feedback (espeak-ng: fˈeːdbɑk) is said terugkoppeling, achteraf (ˈɑxtɪːrˌɑf) na afloop,
// and "is het een" (read as één) is avoided. The guard below runs the kit's SAY rules first.
const SAY = [
  [ // s1 numbers that steer
    { nl: 'Een {t:KPI|KPI} is een cijfer waar iemand op handelt. Anders heb je een rapportagecijfer.',
      en: 'A {t:KPI|KPI} is a number someone acts on. Otherwise it is a report figure.' },
    { nl: 'Teams sturen op drie tot zeven cijfers; een muur van veertig leest niemand.',
      en: 'A team steers on three to seven numbers; a wall of forty gets read by nobody.' },
    { nl: 'Een {t:Achterlopende indicator|achterlopende indicator} meet het resultaat na afloop, zoals leverbetrouwbaarheid van vorige maand.',
      en: 'A {t:Lagging indicator|lagging indicator} measures the result afterwards, like last month\'s on-time delivery.' },
    { nl: 'Een {t:Voorlopende indicator|voorlopende indicator} beweegt eerder en zegt wat je moet doen, zoals materiaal op tijd klaar.',
      en: 'A {t:Leading indicator|leading indicator} moves first and shows what to do, like materials ready in time.' },
    { nl: 'Achterlopend: heb je gewonnen? Voorlopend: ga je winnen?',
      en: 'Lagging: did you win? Leading: will you win?' },
    { nl: 'De {t:Balanced scorecard|balanced scorecard} van Kaplan en Norton kijkt vanuit vier hoeken: financieel alleen zegt niet waar je heen gaat.',
      en: 'Kaplan and Norton\'s {t:Balanced scorecard|balanced scorecard} takes four views: financial results alone don\'t say where you are heading.' },
  ],
  [ // s2 late deliveries
    { nl: 'Een onderdelenfabrikant krijgt klachten over late leveringen. Op het bord: leverbetrouwbaarheid.',
      en: 'A parts manufacturer gets complaints about late deliveries. On the board: on-time delivery.' },
    { nl: 'Stap één: schrijf de definitie op. Tegen de bevestigde datum, per orderregel, nul dagen te laat; één eigenaar.',
      en: 'Step one: write the definition down. Against the confirmed date, per order line, zero days late; one owner.' },
    { nl: 'Ook een vaste bron, frequentie en richting. Veel ruzies: twee mensen die onder één naam iets anders meten.',
      en: 'Also a fixed source, frequency and direction. Many arguments: two people measuring different things under one name.' },
    { nl: 'Stap twee: voorlopende cijfers voor elke week, zoals de planningsnaleving op de bottleneck.',
      en: 'Step two: leading numbers for every week, like schedule adherence at the bottleneck.' },
    { nl: 'Stap drie: één cijfer alleen wordt opgedreven ten koste van de rest, dus {t:Gekoppelde indicatoren|gekoppelde indicatoren}: het aandeel in één keer goed ernaast.',
      en: 'Step three: one number alone gets pushed at the cost of others, so {t:Paired indicators|paired indicators}: first-pass yield alongside.' },
    { nl: 'Dashboards groeien elk jaar, en voorlopende cijfers zijn lastig te vinden.',
      en: 'Dashboards grow every year, and leading numbers are hard to find.' },
    { nl: 'Vraag bij elk cijfer: toen dit rood werd, wat deed iemand toen anders?',
      en: 'Ask of every number: when this went red, what did someone do differently?' },
  ],
  [ // s3 the KPI tree
    { nl: 'Een {t:KPI-boom|KPI-boom} deelt een doel op in de cijfers die het veroorzaken, met bovenaan bijvoorbeeld de doorlooptijd.',
      en: 'A {t:KPI tree|KPI tree} breaks a goal into the numbers that cause it, topped by a result like lead time.' },
    { nl: 'Elk niveau vraagt: waar hangt dit van af? Zo vind je de {t:Driver|drivers}, tot een team ze in de hand heeft.',
      en: 'Each level asks: what drives this? So you find the {t:Driver|drivers}, down to what a team controls.' },
    { nl: 'Een {t:Rekenboom|rekenboom} rekent exact: goede output is uren maal draaiaandeel maal stuks per uur maal aandeel goed.',
      en: 'A {t:Math tree|math tree} computes exactly: good output is hours times running share times parts per hour times good share.' },
    { nl: 'Een {t:Logische boom|logische boom} noemt de belangrijkste drivers, zonder formule. Reken waar het kan: dat zegt wat een tak waard is.',
      en: 'A {t:Logic tree|logic tree} names the main drivers, no formula. Use math where you can: it shows each branch\'s worth.' },
    { nl: 'Elke tak een eigenaar: planning, onderhoud, engineering, kwaliteit. De laatste drie zijn de OEE-factoren.',
      en: 'Each branch an owner: planning, maintenance, engineering, quality. The last three are the OEE factors.' },
    { nl: 'Toets met data: een tak die nauwelijks varieert, verklaart het gat niet. Stop waar een team wekelijks kan handelen.',
      en: 'Check with data: a branch that hardly varies won\'t explain the gap. Stop where a team can act weekly.' },
  ],
  [ // s4 26 weeks to a connection
    { nl: 'Een netbeheerder: van aanvraag tot aansluiting gemiddeld {n:26} weken, in vijf stappen na elkaar.',
      en: 'A grid operator: request to connection takes {n:26} weeks on average, in five steps in a row.' },
    { nl: 'De doorlooptijd is hun som: een rekenboom. Grote takken: wachten op een ploeg, en ontwerp en vergunningen.',
      en: 'Lead time is their sum: a math tree. Big branches: waiting for a crew, and design and permits.' },
    { nl: 'Te weinig ploegen, of klussen die terugkomen, niet klaar? Elke stap een eigenaar en een weekcijfer, zoals de gereedheidscheck.',
      en: 'Too few crews, or jobs bounced back, not ready? Each step an owner and a weekly number, like the readiness check.' },
    { nl: '{t:Doorvertalen|Doorvertalen} is geen kopiëren. Doorlooptijd twintig procent omlaag: een slogan. Klussen op de geplande dag, van {n:70} naar {n:85} procent: een teamcijfer.',
      en: '{t:Cascading|Cascading} is not copying. Lead time down twenty percent: a slogan. Jobs on the planned day, {n:70} to {n:85} percent: a team number.' },
    { nl: 'Kleine winsten vermenigvuldigen: vier takken tien procent beter, de top zo\'n {n:46} procent. Mis gaat: één keer getekend, takken die overlappen, drivers zonder eigenaar.',
      en: 'Small gains multiply: four branches ten percent better, the top about {n:46} percent. What goes wrong: drawn once, overlapping branches, drivers nobody owns.' },
  ],
  [ // s5 targets people believe
    { nl: 'De {t:Doelzettingstheorie|doelzettingstheorie} van Locke en Latham, uit zo\'n {n:400} studies: specifieke, moeilijke doelen werken beter dan doe je best.',
      en: '{t:Goal-setting theory|Goal-setting theory}, from Locke and Latham and some {n:400} studies: specific, hard goals beat do your best.' },
    { nl: 'Mits er {t:Doelacceptatie|doelacceptatie}, vaardigheid en terugkoppeling is. Anders blijft het een wens.',
      en: 'Given {t:Goal acceptance|goal acceptance}, skills and feedback. Otherwise it is a wish.' },
    { nl: 'Te moeilijk? Dan haken mensen af, of overdrijven ze hun resultaat, vooral als ze net tekortkwamen.',
      en: 'Too hard? Then people give up, or overstate their results, especially when they just fell short.' },
    { nl: 'Begin bij de {t:Nulmeting|nulmeting}, niet bij vorig jaar plus tien procent: een doel dicht bij je beste weken is geloofwaardig.',
      en: 'Start from the {t:Baseline|baseline}, not last year plus ten percent: a target close to your best weeks is believable.' },
  ],
  [ // s6 scrap on one cell
    { nl: 'Werk met een {t:Bandbreedte|bandbreedte}, want resultaten schommelen. En los daarvan een {t:Actiegrens|actiegrens}: daar zoek je een oorzaak.',
      en: 'Use a {t:Target range|target range}, because results vary. And apart from it a {t:Trigger|trigger}: where you look for a cause.' },
    { nl: 'Een verspaningscel: acht weken uitval, gemiddeld zo\'n {n:4.1} procent. Het management wil {n:1} procent.',
      en: 'A machining cell: eight weeks of scrap, about {n:4.1} percent on average. Management wants {n:1} percent.' },
    { nl: 'Dat ligt onder elke week ooit. Voorstel: {n:3.0} tot {n:4.0} procent, mikpunt {n:3.5}; boven de {n:5} zoek je de oorzaak.',
      en: 'That is below any week ever. Proposal: {n:3.0} to {n:4.0} percent, aiming for {n:3.5}; above {n:5}, look for the cause.' },
    { nl: 'Houd de ambitie zichtbaar: het grootste defect aanpakken kan {n:1} procent later haalbaar maken.',
      en: 'Keep the ambition visible: root-cause work on the biggest defect could make {n:1} percent realistic later.' },
    { nl: 'Betrek het team; mensen verdedigen doelen die ze mee bepaalden. Vraag: wat moet er veranderen om onze beste week gewoon te maken?',
      en: 'Involve the team; people defend targets they helped set. Ask: what must change to make our best week a normal week?' },
  ],
  [ // s7 when a measure becomes a target
    { nl: 'De {t:Wet van Goodhart|wet van Goodhart}, in de woorden van Strathern: zodra een maatstaf een doel wordt, is het geen goede maatstaf meer.',
      en: '{t:Goodhart’s law|Goodhart\'s law}, in Strathern\'s words: when a measure becomes a target, it ceases to be a good measure.' },
    { nl: 'Druk op één cijfer, en mensen vinden de goedkoopste weg. {t:Gaming|Gaming}: het cijfer bewegen, niet wat het moest laten zien.',
      en: 'Pressure on one number, and people find the cheapest way. {t:Gaming|Gaming}: moving the number, not what it should show.' },
    { nl: 'Werk net buiten de periode schuiven, de definitie veranderen, sjoemelen, of {t:Krenten uit de pap halen|krenten uit de pap halen}: makkelijke klussen eerst.',
      en: 'Shifting work just outside the period, redefining what counts, fudging, or {t:Cherry-picking|cherry-picking}: the easy jobs first.' },
    { nl: 'Een {t:Verkeerde prikkel|verkeerde prikkel} lokt het omgekeerde uit. Steve Kerr, 1975: A belonen en op B hopen.',
      en: 'A {t:Perverse incentive|perverse incentive} encourages the opposite. Steve Kerr, 1975: rewarding A while hoping for B.' },
    { nl: 'Wells Fargo: onder harde verkoopdoelen openden medewerkers miljoenen rekeningen waar niemand om vroeg. Niemand ontwierp fraude; de druk maakte het makkelijk.',
      en: 'Wells Fargo: under aggressive sales targets, staff opened millions of accounts nobody asked for. Nobody designed fraud; the pressure made it easy.' },
  ],
  [ // s8 stopping the clock
    { nl: 'Herken het: het cijfer wordt beter, de rest niet. Sprongen vlak voor de deadline, resultaten net boven de {t:Grenswaarde|grenswaarde}.',
      en: 'Spot it: the number improves, nothing else does. Jumps right before the deadline, results just above the {t:Threshold|threshold}.' },
    { nl: 'Een netbeheerder koppelt een teambonus aan storingen binnen {n:4} uur verholpen: van {n:88} naar {n:97} procent.',
      en: 'A grid operator ties a team bonus to outages restored within {n:4} hours: from {n:88} to {n:97} percent.' },
    { nl: 'Maar terugkerende storingen binnen {n:30} dagen gaan van {n:6} naar {n:14} per honderd. Zetten tijdelijke oplossingen de klok stil?',
      en: 'But outages returning within {n:30} days go from {n:6} to {n:14} per hundred. Are temporary fixes stopping the clock?' },
    { nl: 'Check, beschuldig niet: vervolgwerkorders, en vraag de ploegen. Dan het systeem: koppel aan terugkerende storingen, bonus los van dat ene cijfer.',
      en: 'Check, don\'t accuse: follow-up work orders, and ask the crews. Then the system: pair with repeat outages, bonus off that one number.' },
    { nl: 'Gaming komt meestal van een slecht systeem, niet van slechte mensen. Vraag: hoe zou je dit halen zonder iets te verbeteren?',
      en: 'Gaming mostly comes from a bad system, not bad people. Ask: how would you hit this without improving anything?' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and no
// word espeak-ng misreads in the Dutch narration once the kit's SAY rules ran (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘%€$]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /\b(driver|balanced|scorecard|gaming|Goodhart|Strathern|Locke|Latham|Norton|indicator\w*|actiegrens|deadline|dashboards?|rapportagecijfer|orderregel|plantmanager|oorzakenonderzoek|first-pass|yield|Schweitzer|Ordóñez|Douma|Marilyn|Charles|manager|feedback|achteraf)\b/i.test(sayable(plain, 'nl'))) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}
// Scene lengths follow the narration (its words / 2.5, the longer language), never
// shorter than the captions (as shown, with their glosses) need to be read.
{
  const shown = resolveFilm(spec, lessons);
  spec.scenes.forEach((s, si) => {
    const said = Math.max(...['nl', 'en'].map((lang) => wordsOf(SAY[si].map((l) => plainSay(l[lang])).join(' '))));
    const read = Math.max(...['nl', 'en'].map((lang) => wordsOf(shown.scenes[si].beats.map((b) => b.text[lang]).join(' '))));
    s.dur = Math.max(Math.ceil(minSceneDur(read)), Math.round(said / 2.5));
  });
}
// Each beat's still (reduced motion) sits late in its own share of the scene.
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
const C = { STEPS, SCRAP, RESTORED, REPEAT, dur: spec.scenes.map((s) => s.dur) };
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// the cast's keys, for the dark-theme skin rule
const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-dot{fill:var(--anatomy-hi)}
.pm-fill{fill:var(--fp-accent)}
.pm-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent);stroke:none}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dot{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring,.pm-mini .pm-dash{stroke-width:.7px}
.pm-mini .pm-axis{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok. Jij, de adviseur in petrol, staat bij het bord. Aan het linkereind van de tafel de teamleider in werkvest, rechts de sponsor in pak, vooraan de planner met een tablet. Op tafel de scorekaart op één A4, een laptop en een kop koffie. Rechts een paneel met per scène een kaart: wat een KPI is, voorlopende en achterlopende indicatoren en de balanced scorecard; de leverbetrouwbaarheid van een onderdelenfabrikant in drie stappen; een KPI-boom met drivers, de rekenboom van een perslijn met eigenaars, en een toets met data; 26 weken tot een aansluiting als som van vijf stappen, doorvertalen en kleine winsten die vermenigvuldigen; de doelzettingstheorie en de nulmeting; een bandbreedte en een actiegrens op de uitval van een verspaningscel; de wet van Goodhart, vormen van gaming en Wells Fargo; en een bonus op storingen binnen 4 uur die terugkerende storingen laat stijgen.',
  en: 'A meeting room. On the back wall a whiteboard and a clock. You, the consultant in petrol, stand at the board. At the left end of the table the team lead in a work vest, at the right the sponsor in a suit, at the front the planner with a tablet. On the table the scorecard on one page, a laptop and a cup of coffee. At the right a panel with one card per scene: what a KPI is, leading and lagging indicators and the balanced scorecard; a parts manufacturer\'s on-time delivery in three steps; a KPI tree with drivers, a press line\'s math tree with owners, and a check with data; 26 weeks to a connection as the sum of five steps, cascading and small gains that multiply; goal-setting theory and the baseline; a target range and a trigger on one machining cell\'s scrap; Goodhart\'s law, forms of gaming and Wells Fargo; and a bonus on outages restored within 4 hours that makes repeat outages rise.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
}

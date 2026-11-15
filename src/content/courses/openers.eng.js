// Level openers for the eng subject (v17 Task 19): a short card shown the first
// time a learner opens a lesson at Werkkennis (2), Gevorderd (3) or Expert (4)
// in a topic. Basis has the module intro film, so there is no level 1.
//
// Topic key: '<moduleId>/<topicId>' exactly as in MODULES (index.js), for
// example 'eng.flow/takt'. The slash keeps it apart from lesson ids, which are
// '<moduleId>.<slug>' and can look the same ('eng.flow.takt' is a lesson).
// Shape: { [topicKey]: { 2: { nl, en }, 3: { nl, en }, 4: { nl, en } } }.
// Two to four sentences, no colons, no numbers from the lesson, at most 320
// characters per language (tests/openers.test.js, validate.js checkOpeners).
export default {
  'eng.flow/takt': {
    2: {
      nl: 'Op Werkkennis ga je een lijn echt indelen. Je verdeelt het werk over stations en kijkt of elk station binnen de takt blijft. Straks kun je zeggen hoeveel stations je minimaal nodig hebt en waarom een lijn met een gemiddelde onder de takt toch kan haperen.',
      en: 'At Working knowledge you start dividing the work of a line for real. You spread the tasks over stations and check that each one stays within takt. By the end you can say how many stations you need at least, and why a line averaging under takt can still stall.',
    },
    3: {
      nl: 'Met Gevorderd gaat het om keuzes. De volgorde van taken ligt vast en de tijden schommelen, dus je weegt een nette balans af tegen ruimte voor variatie. Aan het eind kun je uitleggen waarom je de zwaarste taken eerst plaatst en hoeveel marge een lijn echt nodig heeft.',
      en: 'From Advanced on, the work is about choices. The order of tasks is fixed and the times fluctuate, so you weigh a tidy balance against room for variation. Once you finish, you can explain why the heaviest tasks go first and how much margin a line really needs.',
    },
    4: {
      nl: 'Nu je Expert opent, kijkt een senior naar de vraag die verandert. Het gaat om bezetting, mixen van varianten en wat een herbalancering kost aan mensen en rust. Dan kun je beoordelen wanneer je de lijn aanpast en wanneer je de pieken liever opvangt.',
      en: 'As you step into Expert, a senior looks at demand that moves. It is about staffing, mixing variants and what rebalancing costs in people and calm. Then you can judge when to change the line and when to absorb the peaks instead.',
    },
  },
  'eng.flow/bottleneck': {
    2: {
      nl: 'Bij Werkkennis ga je met capaciteit rekenen. Je zet een machine om in wat hij per week echt kan leveren, en je let op de bezettingsgraad. Daarna kun je beantwoorden hoeveel stuks een machine haalt en wat een hoge bezetting met de wachttijd doet.',
      en: 'With Working knowledge you start working with capacity. You turn a machine into what it can really deliver per week, and you watch utilisation. Afterwards you can answer how many parts a machine makes and what high utilisation does to waiting time.',
    },
    3: {
      nl: 'Vanaf Gevorderd beslis je waar je ingrijpt. Je volgt een vaste aanpak om de bottleneck eerst te benutten voordat je geld uitgeeft. Als je klaar bent, kun je uitleggen wat de trommel, de buffer en het touw doen en welke stap voor de investering komt.',
      en: 'Once you open Advanced, you decide where to step in. You follow a fixed approach that squeezes the bottleneck before you spend money. When you are done, you can explain what the drum, the buffer and the rope do, and which step comes before an investment.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior wat een uur op de bottleneck waard is. Het gaat om geld per uur, om welke order voorrang krijgt en om wat een storing werkelijk kost. Na afloop kun je een prioriteit verdedigen met cijfers in plaats van met onderbuikgevoel.',
      en: 'When you reach Expert, a senior weighs what an hour on the bottleneck is worth. It is about money per hour, which order gets priority and what a breakdown really costs. After this you can defend a priority with figures instead of gut feeling.',
    },
  },
  'eng.flow/oee': {
    2: {
      nl: 'Met Werkkennis ga je verliezen echt vastleggen. Je houdt stilstand bij, sorteert die en laat zien waar de meeste minuten blijven. Aan het eind kun je beantwoorden waar je mee begint en hoe je een Pareto van stilstand opbouwt.',
      en: 'From Working knowledge on, you start recording losses for real. You log downtime, sort it and show where most of the minutes go. Once you finish, you can answer where to start and how to build a Pareto chart of downtime.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, bepaal je wat er precies meetelt. Je kiest eerlijke definities, want wat je buiten de geplande tijd laat, verandert het cijfer zonder dat de machine beter wordt. Dan kun je uitleggen wat OEE zegt, wat TEEP erbij zegt en waar een mooi getal je misleidt.',
      en: 'As you step into Advanced, you decide what exactly counts. You pick honest definitions, because what you leave outside planned time changes the figure without the machine getting better. Then you can explain what OEE tells you, what TEEP adds and where a nice number misleads you.',
    },
    4: {
      nl: 'Op Expert vertaalt een senior procenten naar capaciteit en geld. Het gaat om de vraag of extra output wel iets oplevert als de markt het niet afneemt. Straks kun je beoordelen of OEE verbeteren de goedkoopste route is of dat een machine erbij beter past.',
      en: 'At Expert a senior turns percentage points into capacity and money. It is about whether extra output is worth anything when the market will not buy it. By the end you can judge whether improving OEE is the cheapest route or whether another machine fits better.',
    },
  },
  'eng.flow/changeover': {
    2: {
      nl: 'Vanaf Werkkennis loop je een omstelverbetering echt door. Je splitst werk in wat de machine stilzet en wat ernaast kan, en je rekent de winst uit. Als je klaar bent, kun je beantwoorden hoeveel uren een kortere omstelling per week oplevert en wat zo’n verbetering laat beklijven.',
      en: 'Once you open Working knowledge, you walk through a changeover improvement for real. You split the work into what stops the machine and what can happen alongside, and you work out the gain. When you are done, you can answer how many hours a shorter changeover returns per week and what makes an improvement stick.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, kies je de seriegrootte. Je weegt omstelkosten tegen voorraadkosten en tegen de tijd die de machine echt over heeft. Na afloop kun je uitleggen wat er met de beste serie gebeurt als omstellen goedkoper wordt.',
      en: 'When you reach Advanced, you choose the batch size. You weigh changeover cost against holding cost and against the time the machine really has left. After this you can explain what happens to the best batch size when changeovers get cheaper.',
    },
    4: {
      nl: 'Bij Expert weegt een senior de hele productmix. Het gaat om een vaste omstelvolgorde, om welke producten elkaars buren zijn en om wat de klant van levertijd verwacht. Daarna kun je een productwiel opzetten en uitleggen waarom licht voor donker gaat.',
      en: 'With Expert a senior weighs the whole product mix. It is about a fixed changeover sequence, which products sit next to each other and what the customer expects in lead time. Afterwards you can set up a product wheel and explain why light goes before dark.',
    },
  },
  'eng.quality/tolerances': {
    2: {
      nl: 'Nu je Werkkennis opent, ga je meten met gereedschap. Je kiest een meetmiddel, let op temperatuur en weet waarom kalibreren nodig is. Dan kun je beantwoorden wat het verschil is tussen resolutie en nauwkeurigheid en wat je doet als een meter afwijkt.',
      en: 'As you step into Working knowledge, you start measuring with real tools. You pick a gauge, watch the temperature and know why calibration is needed. Then you can answer the difference between resolution and accuracy, and what to do when a gauge reads off.',
    },
    3: {
      nl: 'Op Gevorderd lees je een tekening zoals een kwaliteitsengineer dat doet. Je beslist hoe een functie moet passen en welke referentie telt, in plaats van alleen een maat met plus en min. Straks kun je een positietolerantie lezen en uitleggen waarom de volgorde van de referenties ertoe doet.',
      en: 'At Advanced you read a drawing as a quality engineer does. You decide how a feature must fit and which datum counts, rather than just a size with plus and minus. By the end you can read a position tolerance and explain why the order of the datums matters.',
    },
    4: {
      nl: 'Met Expert weegt een senior de hele keten van maten. Het gaat om kiezen tussen zekerheid en een ruimere tolerantie, en om wat dat kost in de fabriek. Aan het eind kun je een maatketen beoordelen en zeggen wanneer een statistische aanpak te verdedigen is.',
      en: 'From Expert on, a senior weighs the whole chain of dimensions. It is about choosing between certainty and a wider tolerance, and what that costs on the shop floor. Once you finish, you can assess a stack-up and say when a statistical approach is defensible.',
    },
  },
  'eng.quality/capability': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, ga je een proces een cijfer geven. Je vergelijkt de spreiding met de tolerantie en kijkt of het midden goed zit. Na afloop kun je beantwoorden wat je als eerste doet bij een proces dat precies is maar naast het midden zit.',
      en: 'When you reach Working knowledge, you give a process a score. You compare its spread with the tolerance and check whether the centre sits right. After this you can answer what to do first with a process that is precise but off-centre.',
    },
    3: {
      nl: 'Bij Gevorderd zet je een capabilitystudie op en lees je hem kritisch. Je beslist wat je meet, hoeveel stuks en onder welke omstandigheden, voordat je een conclusie trekt. Daarna kun je uitleggen welke studie bij welke vraag past en wat je eerst controleert.',
      en: 'With Advanced you set up a capability study and read it critically. You decide what to measure, how many parts and under which conditions, before you draw a conclusion. Afterwards you can explain which study fits which question and what you check first.',
    },
    4: {
      nl: 'Vanaf Expert weegt een senior wat het getal zegt over fouten per miljoen. Het gaat om meerdere stappen achter elkaar en om wat de klant voelt van het totaal. Als je klaar bent, kun je sigmaniveau, defecten per miljoen en de opbrengst over de hele keten uit elkaar houden.',
      en: 'Once you open Expert, a senior weighs what the figure says about defects per million. It is about several steps in a row and what the customer feels of the total. When you are done, you can keep sigma level, defects per million and yield across the whole chain apart.',
    },
  },
  'eng.quality/spc': {
    2: {
      nl: 'Op Werkkennis ga je een regelkaart echt gebruiken. Je rekent grenzen uit, kijkt naar punten en patronen en beslist of je ingrijpt. Straks kun je beantwoorden wat een punt buiten de grens betekent als het onderdeel nog binnen de specificatie valt.',
      en: 'At Working knowledge you start using a control chart for real. You work out limits, look at points and patterns and decide whether to step in. By the end you can answer what a point outside the limit means when the part is still within spec.',
    },
    3: {
      nl: 'Met Gevorderd kies je de juiste kaart voor de data. Metingen, fractie fout en aantal fouten vragen elk een andere kaart, en jij beslist welke past. Aan het eind kun je uitleggen wat een bewegend bereik laat zien en wanneer je welke kaart pakt.',
      en: 'From Advanced on, you choose the right chart for the data. Measurements, fraction defective and defect counts each need a different chart, and you decide which fits. Once you finish, you can explain what a moving range shows and when to pick which chart.',
    },
    4: {
      nl: 'Nu je Expert opent, weegt een senior hoe je een kaart werkbaar houdt. Het gaat om subgroepen, om wanneer je grenzen herberekent en om valse alarmen die mensen moe maken. Dan kun je beoordelen of een kaart nog helpt of vooral ruis maakt.',
      en: 'As you step into Expert, a senior weighs how to keep a chart workable. It is about subgroups, when to recalculate limits and false alarms that tire people out. Then you can judge whether a chart still helps or mostly makes noise.',
    },
  },
  'eng.quality/risk': {
    2: {
      nl: 'Bij Werkkennis ga je risico’s vooraf beoordelen. Je geeft elke mogelijke fout een score voor ernst, kans en ontdekking en kijkt wat je kunt doen. Daarna kun je beantwoorden wat een lage ontdekkingsscore betekent en welke actie de ernst echt verlaagt.',
      en: 'With Working knowledge you start assessing risks up front. You score each possible failure for severity, occurrence and detection and see what you can do. Afterwards you can answer what a low detection score means and which action really lowers severity.',
    },
    3: {
      nl: 'Vanaf Gevorderd leg je vast hoe je het proces bewaakt. Je beslist welke meting en welke reactie bij elke stap horen, en of de meter goed genoeg is. Als je klaar bent, kun je uitleggen wat in een controleplan thuishoort en hoe fijn een meetmiddel minimaal moet zijn.',
      en: 'Once you open Advanced, you set down how the process is watched. You decide which measurement and which reaction belong to each step, and whether the gauge is good enough. When you are done, you can explain what belongs in a control plan and how fine a gauge must be at least.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior of een oorzaak echt bewezen is. Het gaat om de plek waar de fout had moeten opvallen en niet opviel, en om wat de klant te zien kreeg. Na afloop kun je een 8D beoordelen en zeggen of de oplossing de kern raakt.',
      en: 'When you reach Expert, a senior weighs whether a cause is really proven. It is about the spot where the defect should have been caught and was not, and what the customer got to see. After this you can review an 8D and say whether the fix hits the core.',
    },
  },
  'eng.process/types': {
    2: {
      nl: 'Met Werkkennis ga je procestekeningen lezen. Je volgt een stroom van blokschema naar PFD en P&ID en ziet wat elke tekening je vertelt. Aan het eind kun je beantwoorden wat de stroomtabel naast een PFD geeft en waarom hygiëne een hekel heeft aan dode hoeken.',
      en: 'From Working knowledge on, you start reading process drawings. You follow a stream from block diagram to PFD and P&ID and see what each drawing tells you. Once you finish, you can answer what the stream table next to a PFD gives you, and why hygiene engineers dislike dead legs.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, koppel je een batchproces aan een continu proces. Je beslist hoe groot de buffertank moet zijn en hoe hij geregeld wordt. Dan kun je uitleggen waarom een tank tussen mixer en vuller een rustige regeling krijgt.',
      en: 'As you step into Advanced, you connect a batch process to a continuous one. You decide how big the buffer tank must be and how it is controlled. Then you can explain why a tank between a mixer and a filler gets a gentle control scheme.',
    },
    4: {
      nl: 'Op Expert weegt een senior batch tegen continu. Het gaat om inhoud in de leidingen, om opstarten en om wat een productwissel verliest. Straks kun je een keuze tussen beide verdedigen en zeggen wanneer een continu proces toch een batch kan heten.',
      en: 'At Expert a senior weighs batch against continuous. It is about hold-up in the lines, start-ups and what a product change loses. By the end you can defend a choice between the two and say when a continuous process can still count as a batch.',
    },
  },
  'eng.process/control': {
    2: {
      nl: 'Vanaf Werkkennis ga je een regelkring beoordelen. Je let op hoe snel de meting reageert en hoe laat die komt, want dat bepaalt wat de regelaar kan. Als je klaar bent, kun je beantwoorden waarom een sensor ver achter een klep problemen geeft en welke lus meestal de traagste is.',
      en: 'Once you open Working knowledge, you start judging a control loop. You look at how fast the measurement responds and how late it arrives, because that decides what the controller can do. When you are done, you can answer why a sensor far downstream of a valve causes trouble, and which loop is usually the slowest.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, kies je een slimmere opzet dan een enkele lus. Je beslist wanneer cascade, verhouding of voorwaartse sturing past bij het proces. Na afloop kun je uitleggen welke lus binnen zit en wat voorwaartse sturing extra geeft.',
      en: 'When you reach Advanced, you choose a smarter set-up than a single loop. You decide when cascade, ratio or feedforward fits the process. After this you can explain which loop is the inner one and what feedforward adds.',
    },
    4: {
      nl: 'Bij Expert weegt een senior wat betere regeling oplevert in geld en risico. Het gaat om minder spreiding, een lager gemiddelde dichter bij de grens en alarmen die een operator aankan. Daarna kun je een verbeterplan onderbouwen en de alarmbelasting beoordelen.',
      en: 'With Expert a senior weighs what better control returns in money and risk. It is about less variation, a target closer to the limit and alarms an operator can handle. Afterwards you can back up an improvement plan and judge the alarm load.',
    },
  },
  'eng.process/balances': {
    2: {
      nl: 'Nu je Werkkennis opent, ga je met energie rekenen. Je bepaalt wat het kost om iets op te warmen, af te koelen of te laten verdampen. Dan kun je beantwoorden hoeveel energie een verwarming nodig heeft en waarom drogen door verdampen zoveel vraagt.',
      en: 'As you step into Working knowledge, you start calculating with energy. You work out what it takes to heat, cool or evaporate something. Then you can answer how much energy a heater needs and why drying by evaporation takes so much.',
    },
    3: {
      nl: 'Op Gevorderd stuur je een recept en een kringloop. Je beslist hoe je mengt om een gewenste samenstelling te halen en wat er gebeurt als iets terugloopt. Straks kun je uitleggen waarom een hergebruikte kring een afvoer nodig heeft.',
      en: 'At Advanced you steer a recipe and a recycle loop. You decide how to blend to reach a target composition and what happens when something is fed back. By the end you can explain why a reuse loop needs a purge.',
    },
    4: {
      nl: 'Met Expert kijkt een senior naar de hele fabriek. Het gaat om waar energie heen gaat, om wat je mag terugwinnen en om welk doel redelijk is. Aan het eind kun je een energiestroom beoordelen en zeggen waar de winst echt zit.',
      en: 'From Expert on, a senior looks at the whole plant. It is about where energy goes, what you may recover and which target is reasonable. Once you finish, you can assess an energy flow and say where the real gain lies.',
    },
  },
  'eng.process/capacity': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, ga je een proces opschalen. Je kijkt wat er verandert als een vat groter wordt en waarom een proef uit het lab zich in de fabriek anders gedraagt. Na afloop kun je beantwoorden wat er met het wandoppervlak per kubieke meter gebeurt en waarom warmte een probleem wordt.',
      en: 'When you reach Working knowledge, you start scaling up a process. You look at what changes when a vessel grows and why a lab trial behaves differently in the plant. After this you can answer what happens to wall area per cubic metre and why heat becomes a problem.',
    },
    3: {
      nl: 'Bij Gevorderd plan je meerdere producten op dezelfde installatie. Je beslist over de volgorde en de seriegroottes, met schoonmaak en allergenen in het hoofd. Daarna kun je uitleggen welke volgorderegel batchfabrieken gebruiken en waarom.',
      en: 'With Advanced you plan several products on the same plant. You decide the sequence and batch sizes, with cleaning and allergens in mind. Afterwards you can explain which sequence rule batch plants usually follow and why.',
    },
    4: {
      nl: 'Vanaf Expert weegt een senior waar extra capaciteit het goedkoopst vandaan komt. Het gaat om de echte bottleneck, om kosten per extra ton en om wat de fabriek bewezen kan halen. Als je klaar bent, kun je opties naast elkaar zetten en een investering verdedigen.',
      en: 'Once you open Expert, a senior weighs where extra capacity comes cheapest. It is about the real bottleneck, cost per extra tonne and what the plant can demonstrably deliver. When you are done, you can put options side by side and defend an investment.',
    },
  },
  'eng.mechanics/load': {
    2: {
      nl: 'Op Werkkennis ga je met belasting rekenen. Je zet een kracht om in spanning en rek en kijkt hoe stijf iets is. Straks kun je beantwoorden hoe zwaar een staaf belast wordt en wat helpt als een frame te veel doorbuigt.',
      en: 'At Working knowledge you start calculating with load. You turn a force into stress and strain and look at how stiff something is. By the end you can answer how heavily a rod is loaded and what helps when a frame deflects too much.',
    },
    3: {
      nl: 'Met Gevorderd kies je welke belasting telt. Buiging en wringing in balken en assen vragen elk een eigen aanpak, en jij beslist waar het kritiek wordt. Aan het eind kun je een moment en een buigspanning bepalen en zeggen wat een dikkere as echt oplevert.',
      en: 'From Advanced on, you choose which load counts. Bending and torsion in beams and shafts each need their own approach, and you decide where it gets critical. Once you finish, you can work out a moment and a bending stress and say what a thicker shaft really gains.',
    },
    4: {
      nl: 'Nu je Expert opent, controleert een senior een berekening in plaats van hem te maken. Je legt een rekenrapport of een FEA-plaatje naast een eigen schatting. Dan kun je beoordelen of een uitkomst klopt en wat een scherpe hoek met de piekspanning doet.',
      en: 'As you step into Expert, a senior checks a calculation rather than making one. You lay a calculation report or an FEA plot next to your own estimate. Then you can judge whether a result holds and what a sharp corner does to peak stress.',
    },
  },
  'eng.mechanics/strength': {
    2: {
      nl: 'Bij Werkkennis ga je testresultaten lezen. Je ziet wat een trekproef en een hardheidsmeting je vertellen over een materiaal. Daarna kun je beantwoorden hoe je uit een trekproef de sterkte en de rek haalt en hoe je een dunne harde laag controleert.',
      en: 'With Working knowledge you start reading test results. You see what a tensile test and a hardness test tell you about a material. Afterwards you can answer how to get strength and elongation from a tensile test, and how to check a thin hardened layer.',
    },
    3: {
      nl: 'Vanaf Gevorderd gaat het om taaiheid. Je beslist of een materiaal bij lage temperatuur nog veilig is en hoe je een slagproef leest. Als je klaar bent, kun je uitleggen wat er mag afwijken in een proefreeks en welk materiaal geen koude-overgang kent.',
      en: 'Once you open Advanced, it is about toughness. You decide whether a material is still safe in the cold and how to read an impact test. When you are done, you can explain what may deviate in a test series and which material has no cold transition.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, let een senior op papier en herkomst. Het gaat om welk certificaat bewijst wat, en om verwisselingen die je met een meting wel of niet vangt. Na afloop kun je een inkomende partij beoordelen en zeggen welke controle voldoende is.',
      en: 'When you reach Expert, a senior watches paperwork and origin. It is about which certificate proves what, and about mix-ups that a measurement can or cannot catch. After this you can assess an incoming batch and say which check is enough.',
    },
  },
  'eng.mechanics/failure': {
    2: {
      nl: 'Werkkennis betekent dat je een gebroken onderdeel leest. Je kijkt naar het breukvlak en naar wat de ratchetlijnen zeggen over de belasting. Straks kun je uitrekenen hoeveel omwentelingen een as in een jaar maakt en weet je wat je als eerste doet met de twee helften.',
      en: 'Working knowledge means reading a broken part. You look at the fracture surface and at what the ratchet marks say about the load. Soon you can work out how many turns a shaft makes in a year and know what to do first with the two halves.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, reken je aan levensduur. Je beslist hoe wisselende belastingen samen een onderdeel vermoeien en wat een lager spanningsbereik oplevert. Dan kun je een levensduur schatten en spanningsamplitude en gemiddelde uit elkaar houden.',
      en: 'As you step into Advanced, you calculate fatigue life. You decide how varying loads together wear a part out and what a lower stress range gains. Then you can estimate a life and keep stress amplitude and mean apart.',
    },
    4: {
      nl: 'Op Expert weegt een senior lasconstructies. Het gaat om de zwakste plek in een las, om wat een sterker staal wel en niet oplost en om hoe je een bestaande las verbetert. Straks kun je een voorstel van een leverancier kritisch beoordelen.',
      en: 'At Expert a senior weighs welded structures. It is about the weakest spot in a weld, what a stronger steel does and does not solve and how to improve an existing weld. By the end you can review a supplier proposal critically.',
    },
  },
  'eng.mechanics/choice': {
    2: {
      nl: 'Vanaf Werkkennis ga je met warmtebehandeling werken. Je weet welke hardheidsschaal bij welk materiaal hoort en waarom je na het harden nog moet ontlaten. Als je klaar bent, kun je beantwoorden welke stap een gelast frame voor het frezen stabiel maakt.',
      en: 'Once you open Working knowledge, you start working with heat treatment. You know which hardness scale fits which material and why you still temper after quenching. When you are done, you can answer which step makes a welded frame stable before machining.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, lees je een staalnaam als een code. Je haalt er samenstelling, sterkte en levertoestand uit. Na afloop kun je uitleggen wat een toevoeging als QT betekent en welke vloeigrens bij welke dikte hoort.',
      en: 'When you reach Advanced, you read a steel name as a code. You pull composition, strength and delivery condition out of it. After this you can explain what an addition such as QT means and which yield strength goes with which thickness.',
    },
    4: {
      nl: 'Bij Expert weegt een senior een materiaalwissel. Het gaat om prijs, bewerkbaarheid, stijfheid en gebruiksomgeving samen, niet om één eigenschap. Daarna kun je een voorstel om te vervangen beoordelen en zeggen wat de verborgen kosten zijn.',
      en: 'With Expert a senior weighs a material swap. It is about price, machinability, stiffness and environment together, not one property. Afterwards you can review a proposal to substitute and say what the hidden costs are.',
    },
  },
  'eng.maintenance/strategy': {
    2: {
      nl: 'Nu je Werkkennis opent, kijk je hoe apparatuur echt faalt. Je leest storingspatronen en ziet dat onderhoud zelf ook storingen kan veroorzaken. Dan kun je beantwoorden wat een bepaalde vorm in de storingsdata suggereert en wat vroege uitval na onderhoud meestal veroorzaakt.',
      en: 'As you step into Working knowledge, you look at how equipment really fails. You read failure patterns and see that maintenance itself can cause failures. Then you can answer what a certain shape in failure data suggests and what usually causes early failures after maintenance.',
    },
    3: {
      nl: 'Op Gevorderd kies je welke toestand je bewaakt. Je beslist welke methode bij welke fout past en hoe vaak je kijkt. Straks kun je uitleggen hoe je een losse verbinding of een luchtlek vindt en hoe je het inspectie-interval kiest.',
      en: 'At Advanced you choose which condition to monitor. You decide which method fits which fault and how often to look. By the end you can explain how to find a loose connection or an air leak and how to choose the inspection interval.',
    },
    4: {
      nl: 'Met Expert beoordeelt een senior een heel onderhoudsplan. Het gaat om taken die niets voorkomen, dubbel werk en taken die je juist moet houden. Aan het eind kun je een plan schonen en zeggen wat de besparing in uren is.',
      en: 'From Expert on, a senior reviews a whole maintenance plan. It is about tasks that prevent nothing, duplicate work and tasks you must keep anyway. Once you finish, you can clean up a plan and say what the saving in hours is.',
    },
  },
  'eng.maintenance/tpm': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, schrijf je een standaard voor de operator. Je bepaalt wat die dagelijks schoonmaakt, smeert en controleert en hoe lang dat mag duren. Na afloop kun je beantwoorden hoeveel tijd een ronde kost en waarvoor een merkstreep op een moer dient.',
      en: 'When you reach Working knowledge, you write a standard for the operator. You decide what they clean, lubricate and check daily and how long it may take. After this you can answer how much time a round costs and what a match mark on a nut is for.',
    },
    3: {
      nl: 'Bij Gevorderd stuur je een team door de stappen. Je beslist wanneer een stap af is en meet het met een audit. Daarna kun je uitleggen wat de tweede stap behelst en hoe je de voortgang van een team afleest.',
      en: 'With Advanced you guide a team through the steps. You decide when a step is done and measure it with an audit. Afterwards you can explain what the second step involves and how to read a team’s progress.',
    },
    4: {
      nl: 'Vanaf Expert zet een senior TPM op als programma. Het gaat om de pijlers, om verliezen die je wegneemt en om wie waar eigenaar van is. Als je klaar bent, kun je een doel per pijler onderbouwen en zeggen welke pijler nieuwe machines makkelijk onderhoudbaar maakt.',
      en: 'Once you open Expert, a senior sets up TPM as a programme. It is about the pillars, the losses you remove and who owns what. When you are done, you can back a target per pillar and say which pillar makes new machines easy to maintain.',
    },
  },
  'eng.maintenance/planning': {
    2: {
      nl: 'Op Werkkennis ga je werk echt plannen. Je legt beschikbare uren naast opdrachten en let op hoeveel er werkelijk volgens plan gebeurt. Straks kun je beantwoorden hoeveel uren een week echt beschikbaar zijn en hoe je de naleving van een planning meet.',
      en: 'At Working knowledge you start planning work for real. You lay available hours next to jobs and watch how much actually happens as planned. By the end you can answer how many hours a week is really available and how to measure schedule compliance.',
    },
    3: {
      nl: 'Gevorderd gaat over de onderdelen. Je beslist wat op voorraad komt, wat kitting de planner oplevert en hoe je weet dat het magazijn klopt. Daarna kun je een servicegraad en een cyclische telling lezen en zeggen wat een onderdelenlijst per asset de werkvoorbereiding geeft.',
      en: 'Advanced is about the spare parts. You decide what goes into stock, what kitting gives the planner and how you know the stores are right. Afterwards you can read a service level and a cycle count and say what a parts list per asset gives work preparation.',
    },
    4: {
      nl: 'Nu je Expert opent, weegt een senior een stilstand. Het gaat om scope die je bevriest, om werk dat pas tijdens het openen opduikt en om wat op het kritieke pad ligt. Dan kun je een stilstandsplan beoordelen en zeggen waar de risico’s zitten.',
      en: 'As you step into Expert, a senior weighs a shutdown. It is about scope you freeze, work that only shows up once you open things and what sits on the critical path. Then you can review a shutdown plan and say where the risks are.',
    },
  },
  'eng.maintenance/measure': {
    2: {
      nl: 'Bij Werkkennis ontleed je de uren van onderhoud. Je ziet hoeveel er naar spoedwerk gaat en hoe een multimomentopname laat zien waar technici hun tijd aan besteden. Daarna kun je het aandeel spoedwerk uitrekenen en uitleggen waarom je zo’n opname vooraf aankondigt.',
      en: 'At Working knowledge you take the hours of maintenance apart. You see how many go to urgent work and how work sampling shows where technicians spend their time. Afterwards you can work out the share of urgent work and explain why you announce a study beforehand.',
    },
    3: {
      nl: 'Vanaf Gevorderd stel je een set kengetallen samen die standhoudt. Je beslist wat op tijd heet, wat je vooraf kunt zien en wat alleen achteraf telt. Als je klaar bent, kun je uitleggen welke indicator vooruitkijkt en hoe je een regel voor op tijd formuleert.',
      en: 'Once you open Advanced, you assemble a set of KPIs that holds up. You decide what counts as on time, what you can see in advance and what only counts afterwards. When you are done, you can explain which indicator looks ahead and how to word a rule for on time.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, vertaalt een senior onderhoud naar de bedrijfscase. Het gaat om kosten ten opzichte van de waarde van de installaties en om wat een storing werkelijk kost. Na afloop kun je een investering in onderhoud onderbouwen en zeggen wanneer gemiste marge meetelt.',
      en: 'When you reach Expert, a senior turns maintenance into a business case. It is about cost relative to asset value and what a breakdown really costs. After this you can back an investment in maintenance and say when lost margin counts.',
    },
  },
  'eng.drawings/draw': {
    2: {
      nl: 'Met Werkkennis lees je ook samenstellingstekeningen. Je ziet wat lijnen en streepjes betekenen en vindt in de stuklijst wat je moet bestellen. Aan het eind kun je beantwoorden hoeveel van een onderdeel er in een samenstelling gaan en wat een dunne onderbroken lijn toont.',
      en: 'From Working knowledge on, you also read assembly drawings. You see what lines and dashes mean and find in the parts list what to order. Once you finish, you can answer how many of a part go into an assembly and what a thin dashed line shows.',
    },
    3: {
      nl: 'Op Gevorderd haal je uit een tekening wat een schroefdraad, een gat, een oppervlak en een las moeten worden. Je beslist wat elk symbool van de maker vraagt. Straks kun je uitleggen welke kernboor bij een schroefdraad hoort en wat de streep over een ruwheidssymbool toevoegt.',
      en: 'At Advanced you read from a drawing what a thread, a hole, a surface and a weld have to become. You decide what each symbol asks of the maker. Soon you can explain which tap drill suits a thread and what the bar over a roughness symbol adds.',
    },
    4: {
      nl: 'Op Expert let een senior op beheer van tekeningen. Het gaat om wijzigingen, om wat er met oude voorraad gebeurt en om het 3D-model als bron. Straks kun je een wijziging beoordelen en zeggen wat het goedkoopste vervolg voor oude onderdelen is.',
      en: 'At Expert a senior watches drawing control. It is about changes, what happens to old stock and the 3D model as the source. By the end you can assess a change and say what the cheapest follow-up for old parts is.',
    },
  },
  'eng.drawings/tol': {
    2: {
      nl: 'Op Werkkennis lees je tolerantiekaders. Je let op de referenties en op een maat in een kader zonder plus en min. Daarna kun je een positieafwijking bepalen en zeggen wat referentie A in een kader aanwijst.',
      en: 'At Working knowledge you read tolerance frames. You watch the datums and a dimension in a box without plus and minus. Afterwards you can determine a position deviation and say what datum A in a frame points to.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, leer je vorm, slingering en profiel te onderscheiden. Je kiest welke controle bij welke functie past en hoe je die meet. Na afloop kun je uitleggen welke tolerantie een cilindrische zone heeft en hoe je een slingering afleest.',
      en: 'When you reach Advanced, you learn to tell form, runout and profile apart. You choose which control fits which function and how to measure it. After this you can explain which tolerance has a cylindrical zone and how to read a runout.',
    },
    4: {
      nl: 'Bij Expert weegt een senior verschillen tussen normen en ruzies over een afkeur. Het gaat om ISO tegen ASME en om meetonzekerheid bij een grensgeval. Daarna kun je een geschil over een tekening beoordelen en zeggen waar de val in een algemene tolerantienorm zit.',
      en: 'With Expert a senior weighs differences between standards and disputes over a rejection. It is about ISO versus ASME and measurement uncertainty on a borderline part. Afterwards you can assess a drawing dispute and say where the catch in a general tolerance standard lies.',
    },
  },
  'eng.drawings/schematics': {
    2: {
      nl: 'Werkkennis betekent dat je de besturing leest. Je ziet hoe PLC, HMI en SCADA samenwerken en waar een veiligheidsfunctie anders is dan een procesvergrendeling. Daarna kun je beantwoorden wat HMI en SCADA van elkaar scheidt en wat je als eerste vraagt als iemand de machinesequentie wil veranderen.',
      en: 'Working knowledge means reading the control system. You see how PLC, HMI and SCADA work together and where a safety function differs from a process interlock. Afterwards you can answer what separates an HMI from SCADA and what you ask first when someone wants to change a machine sequence.',
    },
    3: {
      nl: 'Op Gevorderd lees je een elektrisch schema. Je volgt stroom door contacten en spoelen en ziet hoe een start-stopschakeling zichzelf vasthoudt. Straks kun je een contactnummer duiden en beoordelen of een gemeten spanning nog goed is.',
      en: 'At Advanced you read an electrical schematic. You follow current through contacts and coils and see how a start-stop circuit holds itself in. By the end you can interpret a contact number and judge whether a measured voltage is still good.',
    },
    4: {
      nl: 'Met Expert weegt een senior beveiligingen op de tekening. Het gaat om hoe betrouwbaar een veiligheidsfunctie moet zijn en wat een onnodige stop kost. Aan het eind kun je een oorzaak-gevolgmatrix lezen en een afweging maken tussen veiligheid en productie.',
      en: 'From Expert on, a senior weighs protections on the drawing. It is about how reliable a safety function must be and what an unnecessary stop costs. Once you finish, you can read a cause and effect matrix and balance safety against production.',
    },
  },
  'eng.drawings/control': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, krijg je gevoel voor PID. Je weet wat elk deel doet en wat er gebeurt als een lus gaat slingeren. Na afloop kun je beantwoorden welk deel een blijvende afwijking weghaalt en wat een steeds grotere slingering meestal betekent.',
      en: 'When you reach Working knowledge, you get a feel for PID. You know what each part does and what happens when a loop starts to swing. After this you can answer which part removes a steady offset and what an ever larger swing usually means.',
    },
    3: {
      nl: 'Bij Gevorderd stel je een lus af. Je doet een staptest en kiest daar een afstelling bij. Daarna kun je beantwoorden hoe je uit een proef de procesversterking haalt en hoe een proportionele band zich tot de versterking verhoudt.',
      en: 'With Advanced you tune a loop. You run a bump test and choose a setting from it. Afterwards you can answer how to get the process gain from a test and how a proportional band relates to gain.',
    },
    4: {
      nl: 'Vanaf Expert zoekt een senior de lussen die geld kosten. Het gaat om lussen op hand, om lussen die samen slingeren en om wat betere regeling oplevert. Als je klaar bent, kun je een lusaudit opzetten en zeggen waar je als eerste naar kijkt.',
      en: 'Once you open Expert, a senior looks for the loops that cost money. It is about loops in manual, loops that swing together and what better control returns. When you are done, you can set up a loop audit and say what to look at first.',
    },
  },
  'eng.safety/risk': {
    2: {
      nl: 'Op Werkkennis doe je de laatste check voor je begint. Je stelt vast wie de LMRA doet en wat je doet als iets onduidelijk is. Straks kun je beantwoorden wanneer je werk stopt en wat je wettelijk recht daarbij is.',
      en: 'At Working knowledge you do the last check before you start. You establish who does the LMRA and what to do when something is unclear. By the end you can answer when you stop work and what your legal right is.',
    },
    3: {
      nl: 'Met Gevorderd leg je barrières in lagen. Je beslist welke maatregelen echt onafhankelijk zijn en waar een bowtie de bedreiging en het gevolg uit elkaar houdt. Aan het eind kun je uitleggen wat er in het midden van een bowtie staat en waarom twee barrières op dezelfde sensor niet tellen als twee.',
      en: 'From Advanced on, you stack barriers in layers. You decide which measures are truly independent and where a bowtie keeps the threat and the consequence apart. Once you finish, you can explain what sits in the middle of a bowtie and why two barriers on the same sensor do not count as two.',
    },
    4: {
      nl: 'Nu je Expert opent, let een senior op wat verandert. Het gaat om wijzigingen in werkwijze, om tijdelijke oplossingen die blijven hangen en om een controle voor de start. Dan kun je een wijziging beoordelen op veiligheid voordat die doorgaat.',
      en: 'As you step into Expert, a senior watches what changes. It is about changes in method, temporary fixes that linger and a check before start-up. Then you can review a change for safety before it goes ahead.',
    },
  },
  'eng.safety/energy': {
    2: {
      nl: 'Bij Werkkennis leer je de rollen bij elektrisch werk. Je weet wie leiding geeft en waarom een vakman zonder aanwijzing niet zomaar mag werken. Daarna kun je beantwoorden welke norm bij hoogspanning hoort en wie een klus ter plekke leidt.',
      en: 'With Working knowledge you learn the roles in electrical work. You know who leads and why a skilled person without an appointment may not simply start. Afterwards you can answer which standard goes with high voltage and who leads a job on site.',
    },
    3: {
      nl: 'Vanaf Gevorderd draait het om de vergunning. Je let op wie bevestigt dat een plek klaar is en op de momenten waarop het systeem vaak faalt. Als je klaar bent, kun je uitleggen waarom een brandwacht na heet werk blijft.',
      en: 'Once you open Advanced, it is about the permit. You look at who confirms a place is ready and at the moments when the system often fails. When you are done, you can explain why a fire watch stays after hot work.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior het werk dicht bij spanning in het station. Het gaat om afstanden, beschermingsniveaus en wie wat mag doen zonder opleiding. Na afloop kun je een vlamboogrisico beoordelen en zeggen wat een ploeg zonder training nooit doet.',
      en: 'When you reach Expert, a senior weighs work close to live parts in the substation. It is about distances, protection levels and who may do what without training. After this you can assess an arc flash risk and say what a crew without training never does.',
    },
  },
  'eng.safety/machine': {
    2: {
      nl: 'Met Werkkennis beoordeel je het risico van een machine. Je volgt de vaste driestapsmethode en let op wat er na je maatregelen overblijft. Aan het eind kun je beantwoorden in welke volgorde die stappen gaan en wat een veranderde stoptijd voor een lichtscherm betekent.',
      en: 'From Working knowledge on, you assess the risk of a machine. You follow the fixed three-step method and watch what is left after your measures. Once you finish, you can answer in which order those steps go and what a changed stopping time means for a light curtain.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, bepaal je hoe betrouwbaar een veiligheidsfunctie moet zijn. Je kiest een categorie en een niveau en je laat zien dat het ook echt werkt. Dan kun je uitleggen wat diagnostische dekking is en wat er moet gebeuren na een wijziging in de software.',
      en: 'As you step into Advanced, you decide how reliable a safety function must be. You choose a category and a level and you show it really works. Then you can explain what diagnostic coverage is and what must happen after a change in the software.',
    },
    4: {
      nl: 'Op Expert weegt een senior oude machines en nieuwe regels. Het gaat om een machine zonder CE-markering, om wie fabrikant wordt na een grote ombouw en om de nieuwe verordening. Straks kun je een oude machine in een nieuwe lijn beoordelen.',
      en: 'At Expert a senior weighs old machines and new rules. It is about a machine with no CE marking, who becomes the manufacturer after a major rebuild and the new regulation. By the end you can assess an old machine in a new line.',
    },
  },
  'eng.safety/culture': {
    2: {
      nl: 'Op Werkkennis onderzoek je een incident. Je kijkt voorbij menselijke fouten naar wat er destijds logisch leek. Daarna kun je beantwoorden wat wijsheid achteraf met een onderzoek doet en welke maatregel uit een onderzoek het sterkst is.',
      en: 'At Working knowledge you investigate an incident. You look beyond human error to what made sense at the time. Afterwards you can answer what hindsight bias does to an investigation and which action from an investigation is strongest.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, kies je kengetallen. Je rekent uitval- en meldingscijfers uit en beslist welke indicatoren vooruitkijken. Na afloop kun je een frequentiecijfer uitrekenen en uitleggen waarom een cijfer dat een doel wordt minder betrouwbaar wordt.',
      en: 'When you reach Advanced, you choose indicators. You work out injury and recordable rates and decide which indicators look ahead. After this you can calculate a frequency rate and explain why a figure that becomes a target gets less reliable.',
    },
    4: {
      nl: 'Bij Expert kijkt een senior naar cultuur. Het gaat om werk zoals het gebeurt, om de trap van veiligheidscultuur en om een eerlijke aanpak na een fout. Daarna kun je een organisatie op die trap plaatsen en de vragen stellen die erbij horen.',
      en: 'With Expert a senior looks at culture. It is about work as it is done, the ladder of safety culture and a fair approach after a mistake. Afterwards you can place an organisation on that ladder and ask the questions that fit.',
    },
  },
  'eng.fluids/pipes': {
    2: {
      nl: 'Nu je Werkkennis opent, ga je de weerstand van een leiding uitrekenen. Je bepaalt hoeveel druk een stroming kost en kijkt hoe de stroomsoort meespeelt. Dan kun je beantwoorden wat een bepaalde snelheid in een leiding aan drukverlies geeft en hoe stroop zich anders gedraagt dan water.',
      en: 'As you step into Working knowledge, you start working out the resistance of a pipe. You determine how much pressure a flow costs and see how the type of flow plays a part. Then you can answer how much pressure loss a certain speed gives in a pipe, and how syrup behaves differently from water.',
    },
    3: {
      nl: 'Op Gevorderd kies je een regelklep en let je op stoten in de leiding. Je beslist welke klep past bij het debiet dat je wilt en wat een snelle afsluiting aanricht. Straks kun je een debiet uit de klepwaarde halen en de drukstoot van een dichtgaande klep inschatten.',
      en: 'At Advanced you choose a control valve and watch for surges in the line. You decide which valve suits the flow you want and what a fast closure does. By the end you can get a flow from the valve coefficient and estimate the pressure surge of a closing valve.',
    },
    4: {
      nl: 'Met Expert weegt een senior de diameter over de levensduur. Het gaat om aanschaf tegen energie, en om wat een stijgende stroomprijs aan de afweging verandert. Aan het eind kun je verdedigen waarom een iets wijdere leiding goedkoper uitkomt.',
      en: 'From Expert on, a senior weighs the diameter over its life. It is about purchase against energy, and what a rising electricity price does to the trade-off. Once you finish, you can defend why a slightly wider pipe works out cheaper.',
    },
  },
  'eng.fluids/pumps': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, ga je een pomp afregelen met toerental. Je ziet wat langzamer draaien doet met debiet, opbrengst en vermogen. Na afloop kun je beantwoorden hoeveel een pomp bespaart bij een lager toerental en waar je een frequentieregelaar het beste plaatst.',
      en: 'When you reach Working knowledge, you start trimming a pump with speed. You see what slower running does to flow, head and power. After this you can answer how much a pump saves at a lower speed and where a variable speed drive fits best.',
    },
    3: {
      nl: 'Bij Gevorderd bewaak je de zuigzijde. Je beslist wat er mag veranderen aan een leiding of tank zonder dat de pomp gaat knetteren. Daarna kun je uitleggen wat cavitatie veroorzaakt en welke voorwaarde je moet halen om het te vermijden.',
      en: 'With Advanced you guard the suction side. You decide what may change in a line or tank without the pump crackling. Afterwards you can explain what causes cavitation and which condition you must meet to avoid it.',
    },
    4: {
      nl: 'Vanaf Expert kijkt een senior naar het hele pompsysteem. Het gaat om het rendement van draad tot water, om kWh per kuub en om een waaier die je bijtrimt. Als je klaar bent, kun je een systeem doorlichten en zeggen waar de verspilling zit.',
      en: 'Once you open Expert, a senior looks at the whole pump system. It is about efficiency from wire to water, kWh per cubic metre and an impeller you trim. When you are done, you can audit a system and say where the waste is.',
    },
  },
  'eng.fluids/heat': {
    2: {
      nl: 'Op Werkkennis ga je een warmtewisselaar doorrekenen. Je bepaalt hoeveel warmte een stroom afgeeft en hoeveel koelwater je daarvoor nodig hebt. Straks kun je beantwoorden hoeveel vermogen een koeling moet afvoeren en welke stroomrichting het meeste overdraagt.',
      en: 'At Working knowledge you start calculating a heat exchanger. You work out how much heat a stream gives off and how much cooling water you need for it. By the end you can answer how much power a cooler must remove and which flow arrangement transfers the most.',
    },
    3: {
      nl: 'Met Gevorderd bepaal je hoe groot een wisselaar moet zijn. Je rekent met het temperatuurverschil en de overdrachtscoëfficiënt en zoekt waarom een wisselaar achterblijft. Aan het eind kun je uitleggen wat het gemiddelde temperatuurverschil is en waar een tegenvallend resultaat vandaan komt.',
      en: 'From Advanced on, you decide how big an exchanger must be. You work with the temperature difference and the heat transfer coefficient and look for why an exchanger falls short. Once you finish, you can explain what the mean temperature difference is and where a disappointing result comes from.',
    },
    4: {
      nl: 'Nu je Expert opent, weegt een senior warmteterugwinning tegen schoonmaken. Het gaat om wat je terugwint, om wat vervuiling kost en om wanneer reinigen zich terugverdient. Dan kun je een terugwinning beoordelen en een schoonmaakinterval onderbouwen.',
      en: 'As you step into Expert, a senior weighs heat recovery against cleaning. It is about what you win back, what fouling costs and when cleaning pays for itself. Then you can assess a recovery scheme and back a cleaning interval.',
    },
  },
  'eng.fluids/utilities': {
    2: {
      nl: 'Bij Werkkennis ga je koeling doorrekenen. Je kijkt hoeveel warmte een toren afvoert en hoeveel water er verdampt en moet worden afgelaten. Daarna kun je beantwoorden hoeveel koelwater een installatie nodig heeft en wat een indikkingsfactor bepaalt.',
      en: 'With Working knowledge you start calculating cooling. You look at how much heat a tower removes and how much water evaporates and must be bled off. Afterwards you can answer how much make-up water an installation needs and what a cycles of concentration figure decides.',
    },
    3: {
      nl: 'Vanaf Gevorderd volg je de stoom van ketel tot vanger. Je beslist waar verlies zit, van de ketel tot de condensaatretour en de stoomvangers. Als je klaar bent, kun je uitleggen wat een ongetest vangerpark kost en hoeveel condensaat je echt terugwint.',
      en: 'Once you open Advanced, you follow the steam from boiler to trap. You decide where the losses are, from the boiler to the condensate return and the steam traps. When you are done, you can explain what an untested trap population costs and how much condensate you really win back.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, loopt een senior de hele nutsvoorziening af en maakt er een zaak van. Het gaat om terugverdientijd, om een baseline waaraan je besparingen toetst en om welke locatie eerst telt. Na afloop kun je een energievoorstel onderbouwen.',
      en: 'When you reach Expert, a senior walks through the whole utility system and builds a case. It is about payback, a baseline against which you test savings and which site comes first. After this you can back up an energy proposal.',
    },
  },
  'eng.power/electric': {
    2: {
      nl: 'Met Werkkennis ga je met energie van de fabriek rekenen. Je kijkt naar basislast, pieken en kWh per product. Aan het eind kun je beantwoorden hoeveel een machine in stilstand verbruikt en wat de energie per ton van een lijn is.',
      en: 'From Working knowledge on, you start calculating with the plant’s energy. You look at base load, peaks and kWh per product. Once you finish, you can answer how much a machine uses while idle and what the energy per tonne of a line is.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, gaat het om blind- en schijnbaar vermogen. Je beslist wat een slechte arbeidsfactor je kost, ook als de rekening het niet laat zien. Dan kun je uitleggen wat de kabels moeten dragen en waarom compensatie soms toch loont.',
      en: 'As you step into Advanced, it is about reactive and apparent power. You decide what a poor power factor costs you, even when the bill does not show it. Then you can explain what the cables must carry and why compensation sometimes pays after all.',
    },
    4: {
      nl: 'Op Expert bewijst een senior een besparing. Het gaat om een baseline die rekening houdt met de productie, en om verschillen die niet door de lijn komen. Straks kun je beoordelen of een gemeten besparing echt is.',
      en: 'At Expert a senior proves a saving. It is about a baseline that accounts for production, and differences that do not come from the line. By the end you can judge whether a measured saving is real.',
    },
  },
  'eng.power/motors': {
    2: {
      nl: 'Vanaf Werkkennis kijk je naar belasting en grootte van een motor. Je beslist welke motor je bij vervanging kleiner maakt en wat een beter rendement oplevert. Als je klaar bent, kun je beantwoorden hoeveel vermogen je bespaart door een zuiniger motor.',
      en: 'Once you open Working knowledge, you look at the load and size of a motor. You decide which motor to make smaller at replacement and what a better efficiency returns. When you are done, you can answer how much power a more efficient motor saves.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, bescherm je een motor en begrijp je waarom hij uitvalt. Je let op onbalans, vocht en overbelasting en kiest de juiste beveiliging. Na afloop kun je uitleggen wat een uitschakelklasse zegt en wat je doet met een motor die lang in een vochtige opslag stond.',
      en: 'When you reach Advanced, you protect a motor and understand why it fails. You watch for unbalance, damp and overload and choose the right protection. After this you can explain what a trip class says and what to do with a motor that stood in damp storage for a long time.',
    },
    4: {
      nl: 'Bij Expert stelt een senior een beleid op. Het gaat om repareren of vervangen, om welke motor eerst een zuiniger type krijgt en om wat een goedkope herwikkeling doet met het rendement. Daarna kun je een voorstel verdedigen met kosten over de jaren.',
      en: 'With Expert a senior sets a policy. It is about repair or replace, which motor gets an efficient type first and what a cheap rewind does to efficiency. Afterwards you can defend a proposal with costs over the years.',
    },
  },
  'eng.power/drives': {
    2: {
      nl: 'Nu je Werkkennis opent, ga je met frequentieregelaars aan de slag. Je ziet waar ze energie besparen en waar niet. Dan kun je beantwoorden bij welke machine een regelaar het meest oplevert en waarom een besparing soms uitblijft.',
      en: 'As you step into Working knowledge, you start working with variable speed drives. You see where they save energy and where they do not. Then you can answer which machine gains most from a drive and why a saving sometimes fails to appear.',
    },
    3: {
      nl: 'Op Gevorderd let je op de bijwerkingen van een aandrijving. Je beslist wat harmonischen doen met het net en waar je ze beoordeelt. Straks kun je uitleggen wat een vervormingspercentage zegt en bij welke frequentie een bepaalde harmonische zit.',
      en: 'At Advanced you watch the side effects of a drive. You decide what harmonics do to the grid and where you judge them. By the end you can explain what a distortion percentage says and at which frequency a given harmonic sits.',
    },
    4: {
      nl: 'Met Expert specificeert een senior een aandrijfsysteem. Het gaat om veilig uitschakelen, om terugvoeding bij dalen en om niet alles zwaar te dimensioneren. Aan het eind kun je een specificatie beoordelen en zeggen wat onnodig duur is.',
      en: 'From Expert on, a senior specifies a drive system. It is about safe shutdown, regeneration when lowering and not sizing everything heavy. Once you finish, you can review a specification and say what is needlessly expensive.',
    },
  },
  'eng.power/fluid': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, leer je hydrauliek rekenen. Je zet druk en oppervlak om in kracht en debiet in snelheid. Na afloop kun je beantwoorden welke kracht een cilinder levert en wat in een hydraulisch systeem de druk bepaalt.',
      en: 'When you reach Working knowledge, you learn to calculate hydraulics. You turn pressure and area into force and flow into speed. After this you can answer what force a cylinder delivers and what sets the pressure in a hydraulic system.',
    },
    3: {
      nl: 'Bij Gevorderd kijk je naar persluchtinstallaties. Je beslist hoe compressoren worden geregeld en hoe droog de lucht moet zijn. Daarna kun je uitleggen wat een compressor opneemt als hij leeg draait en wat een droge lucht voor één machine betekent voor het hele net.',
      en: 'With Advanced you look at compressed air installations. You decide how compressors are controlled and how dry the air must be. Afterwards you can explain what a compressor draws when running unloaded and what dry air for one machine means for the whole network.',
    },
    4: {
      nl: 'Vanaf Expert weegt een senior veiligheid en keuze van de aandrijving. Het gaat om opgesloten energie in een perscilinder en om wanneer een cilinder, een motor of lucht past. Als je klaar bent, kun je een ontwerp op veiligheid toetsen.',
      en: 'Once you open Expert, a senior weighs safety and the choice of actuator. It is about trapped energy in a press cylinder and when a cylinder, a motor or air fits. When you are done, you can test a design for safety.',
    },
  },
  'eng.improve/cause': {
    2: {
      nl: 'Op Werkkennis ga je breder zoeken dan een rij waaroms. Je zet oorzaken op een visgraat en kijkt waar die aanpak tekortschiet. Straks kun je beantwoorden wat de kritiek op de vijf keer waarom is en hoe je kandidaat-oorzaken ordent.',
      en: 'At Working knowledge you start searching wider than a row of whys. You put causes on a fishbone and see where that approach falls short. By the end you can answer what the criticism of the 5 whys is and how to organise candidate causes.',
    },
    3: {
      nl: 'Met Gevorderd laat je de data de oorzaak aanwijzen. Je vergelijkt waar het wel en niet gebeurt en splitst de cijfers in groepen. Aan het eind kun je uitleggen wat een echte oorzaak moet verklaren en waar je begint als de fouten gelijk verdeeld zijn.',
      en: 'From Advanced on, you let the data point to the cause. You compare where it does and does not happen and split the figures into groups. Once you finish, you can explain what a true cause must explain and where to start when defects are spread evenly.',
    },
    4: {
      nl: 'Nu je Expert opent, toetst een senior of de oplossing echt werkt. Het gaat om bewijs dat sterker is dan een goed gevoel en om wat je elders in de fabriek ook moet nalopen. Dan kun je beoordelen of een oorzaak is aangetoond.',
      en: 'As you step into Expert, a senior tests whether the fix really works. It is about evidence stronger than a good feeling and what else in the plant you must check. Then you can judge whether a cause has been demonstrated.',
    },
  },
  'eng.improve/facts': {
    2: {
      nl: 'Bij Werkkennis maak je een groot probleem klein. Je zoekt de plek waar het ontstaat en volgt de stappen die voor de analyse komen. Daarna kun je beantwoorden wat het punt van oorzaak is en welk werk de oorzaakanalyse vooraf gaat.',
      en: 'With Working knowledge you make a big problem small. You look for the spot where it arises and follow the steps that come before analysis. Afterwards you can answer what the point of cause is and what work comes before root-cause analysis.',
    },
    3: {
      nl: 'Vanaf Gevorderd meet je eerst en concludeer je dan. Je beslist hoeveel metingen een bewering dragen en wat gewone schommeling is. Als je klaar bent, kun je uitleggen wanneer een daling in een grafiek echt een signaal is.',
      en: 'Once you open Advanced, you measure first and conclude later. You decide how many measurements support a claim and what ordinary fluctuation is. When you are done, you can explain when a drop on a chart is really a signal.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, zet een senior een experiment op. Het gaat om meerdere factoren tegelijk, om hoeveel runs dat kost en om wat samenspel tussen factoren betekent. Na afloop kun je een eenvoudig proefplan lezen en uitleggen wat een interactie is.',
      en: 'When you reach Expert, a senior sets up an experiment. It is about several factors at once, how many runs that takes and what interplay between factors means. After this you can read a simple test plan and explain what an interaction is.',
    },
  },
  'eng.improve/a3': {
    2: {
      nl: 'Met Werkkennis schrijf je een A3. Je zet een probleem, een doel en een aanpak op één blad. Aan het eind kun je beantwoorden wat de linkerkant van een A3 doet en wie het schrijft.',
      en: 'From Working knowledge on, you write an A3. You put a problem, a target and an approach on one sheet. Once you finish, you can answer what the left side of an A3 does and who writes it.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, pak je een klantklacht aan met een 8D. Je beslist wat je eerst afschermt, wanneer de oorzaak echt gevonden is en waarom menselijke fout geen oorzaak is. Dan kun je uitleggen wanneer de oorzaakstap af is en wat een sortering aan fouten laat liggen.',
      en: 'As you step into Advanced, you tackle a customer complaint with an 8D. You decide what to contain first, when the cause is really found and why human error is not a cause. Then you can explain when the root-cause step is done and how many defects a sort leaves behind.',
    },
    4: {
      nl: 'Op Expert begeleidt een senior met vragen in plaats van met antwoorden. Je leest andermans A3 en toetst probleem, doel en maatregelen. Straks kun je beoordelen wat er mis is met een verkeerd gestelde probleemomschrijving en wat een lange lijst maatregelen verbergt.',
      en: 'At Expert a senior coaches with questions instead of answers. You read someone else’s A3 and test the problem, target and countermeasures. By the end you can judge what is wrong with a badly stated problem and what a long list of countermeasures hides.',
    },
  },
  'eng.improve/kaizen': {
    2: {
      nl: 'Vanaf Werkkennis loop je de waardestroom. Je tekent hoe een product door de fabriek gaat en vergelijkt werktijd met wachttijd. Als je klaar bent, kun je beantwoorden waar je begint met lopen en wat de tijdlijn onderaan de kaart vergelijkt.',
      en: 'Once you open Working knowledge, you walk the value stream. You draw how a product moves through the plant and compare working time with waiting time. When you are done, you can answer where you start walking and what the timeline at the bottom of the map compares.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, leid je een oorzaaksessie. Je houdt het gesprek feitelijk en gaat om met iemand die het antwoord al denkt te weten. Na afloop kun je uitleggen welke kolommen een bord eerlijk houden en welke vraag een aanname toetsbaar maakt.',
      en: 'When you reach Advanced, you lead a root-cause session. You keep the conversation factual and deal with someone who thinks they already know the answer. After this you can explain which columns keep a board honest and which question makes an assumption testable.',
    },
    4: {
      nl: 'Bij Expert maakt een senior van losse acties een dagelijks systeem. Het gaat om wat stilstaan door een andoncall kost, om de regels van het systeem en om de valkuil van een aparte afdeling. Daarna kun je beoordelen of een organisatie echt blijft verbeteren.',
      en: 'With Expert a senior turns separate events into a daily system. It is about what standing still on an andon call costs, the rules of the system and the trap of a separate department. Afterwards you can judge whether an organisation really keeps improving.',
    },
  },
  'eng.spc/msa': {
    2: {
      nl: 'Nu je Werkkennis opent, lees je een meetstudie dieper dan het kopcijfer. Je ziet of de spreiding van de meter of van de mens komt. Dan kun je beantwoorden waarom een meter slecht kan scoren ten opzichte van de studie en goed ten opzichte van de tolerantie.',
      en: 'As you step into Working knowledge, you read a gauge study deeper than the headline figure. You see whether the spread comes from the gauge or the person. Then you can answer why a gauge can score poorly against the study and well against the tolerance.',
    },
    3: {
      nl: 'Op Gevorderd beoordeel je een keuring met het oog. Je beslist wie het risico draagt bij een fout en hoe je overeenstemming tussen inspecteurs toetst. Straks kun je uitleggen wat een lage overeenstemming zegt over een honderd procent controle.',
      en: 'At Advanced you assess visual inspection. You decide who carries the risk of an error and how to test agreement between inspectors. By the end you can explain what low agreement says about a full inspection.',
    },
    4: {
      nl: 'Met Expert kiest een senior een studie die past bij de meting. Het gaat om destructief testen, om een meter die je nooit herhaalt en om de discussie over de grens voor goed genoeg. Aan het eind kun je een meetsysteem verdedigen of afkeuren.',
      en: 'From Expert on, a senior picks a study that fits the measurement. It is about destructive testing, a gauge you can never repeat and the debate over the limit for good enough. Once you finish, you can defend or reject a measurement system.',
    },
  },
  'eng.spc/charts': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kies je de juiste kaart voor je gegevens. Je ziet of je meet, telt of een fractie bijhoudt. Na afloop kun je beantwoorden welke kaart past bij een vaste steekproef met foute stuks en welke bij krassen per paneel.',
      en: 'When you reach Working knowledge, you choose the right chart for your data. You see whether you measure, count or track a fraction. After this you can answer which chart fits a fixed sample with defective parts and which fits scratches per panel.',
    },
    3: {
      nl: 'Bij Gevorderd ga je kleine verschuivingen opsporen. Je beslist wanneer een gewone kaart te traag is en wat een opgetelde of gewogen kaart beter doet. Daarna kun je uitleggen wanneer je een CUSUM of EWMA inzet.',
      en: 'With Advanced you start tracing small shifts. You decide when an ordinary chart is too slow and what a cumulative or weighted chart does better. Afterwards you can explain when to use a CUSUM or EWMA.',
    },
    4: {
      nl: 'Vanaf Expert kijkt een senior naar korte series en veel artikelnummers. Het gaat om een kaart die meerdere producten deelt en om gegevens die vanzelf binnenkomen. Als je klaar bent, kun je een opzet voor een mixfabriek beoordelen.',
      en: 'Once you open Expert, a senior looks at short runs and many part numbers. It is about a chart that several products share and data that arrives automatically. When you are done, you can review a set-up for a high-mix plant.',
    },
  },
  'eng.spc/capability': {
    2: {
      nl: 'Op Werkkennis houd je langetermijn en korte termijn uit elkaar. Je weet welke spreiding bij welke index hoort en waarom je eerst stabiel moet zijn. Straks kun je beantwoorden wat Ppk anders doet dan Cpk en wat een kaart met speciale oorzaken voor je cijfer betekent.',
      en: 'At Working knowledge you keep long term and short term apart. You know which spread goes with which index and why you must be stable first. By the end you can answer what Ppk does differently from Cpk and what a chart with special causes means for your figure.',
    },
    3: {
      nl: 'Met Gevorderd pas je het cijfer aan op de data. Je beslist wat je doet met een eenzijdige grens en met data die niet normaal verdeeld is. Aan het eind kun je uitleggen welke kenmerken scheef zijn en wat een histogram met twee toppen je vertelt.',
      en: 'From Advanced on, you adapt the figure to the data. You decide what to do with a one-sided limit and with data that is not normally distributed. Once you finish, you can explain which characteristics are skewed and what a histogram with two humps tells you.',
    },
    4: {
      nl: 'Nu je Expert opent, weeg je wat een leverancier belooft. Het gaat om wat je mag eisen, om hoe een getal als vijf sigma is opgebouwd en om wat je gelooft. Dan kun je eisen stellen aan capability en een opgegeven cijfer doorprikken.',
      en: 'As you step into Expert, you weigh what a supplier promises. It is about what you may demand, how a figure like five sigma is built up and what you believe. Then you can set capability requirements and see through a quoted figure.',
    },
  },
  'eng.spc/practice': {
    2: {
      nl: 'Bij Werkkennis voorkom je dat de operator te veel bijstelt. Je beslist wanneer een stabiel proces met rust moet worden gelaten en wat een reactieplan zegt. Daarna kun je beantwoorden wanneer een operator wel bijstelt en wat er met de stukken sinds de laatste controle gebeurt.',
      en: 'With Working knowledge you stop the operator from over-adjusting. You decide when a stable process should be left alone and what a reaction plan says. Afterwards you can answer when an operator should adjust and what happens to the parts made since the last check.',
    },
    3: {
      nl: 'Vanaf Gevorderd lees je patronen op een kaart. Je herkent trends, sprongen en punten die de middellijn mijden, en zoekt wat erachter zit. Als je klaar bent, kun je beantwoorden wat een patroon met punten bij de grenzen suggereert en wat een zaagtand na elke wissel verklaart.',
      en: 'Once you open Advanced, you read patterns on a chart. You recognise trends, jumps and points that avoid the centre line, and look for what lies behind them. When you are done, you can answer what a pattern of points near the limits suggests and what a sawtooth after each change explains.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, beheert een senior een heel SPC-programma. Het gaat om of signalen een reactie krijgen, om kaarten die je mag schrappen en om wat een auditor ziet. Na afloop kun je een programma beoordelen op nut en niet op aantal kaarten.',
      en: 'When you reach Expert, a senior manages a whole SPC programme. It is about whether signals get a reaction, charts you may retire and what an auditor looks for. After this you can judge a programme on usefulness, not on the number of charts.',
    },
  },
  'eng.reliability/failure': {
    2: {
      nl: 'Met Werkkennis lees je storingsgegevens met Weibull. Je ziet wat de vorm je vertelt over slijtage of toeval. Aan het eind kun je beantwoorden wat een bepaalde vormfactor suggereert en waarom één gemiddelde over alle storingen kan misleiden.',
      en: 'From Working knowledge on, you read failure data with Weibull. You see what the shape tells you about wear or chance. Once you finish, you can answer what a certain shape factor suggests and why one average over all failures can mislead.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, zoek je de wortel van een storing. Je beslist welke storingen een onderzoek verdienen en onderscheidt fysieke, menselijke en organisatorische oorzaken. Dan kun je uitleggen wat voor soort oorzaak een slecht uitgevoerde montage is.',
      en: 'As you step into Advanced, you look for the root of a failure. You decide which failures deserve an investigation and tell physical, human and organisational causes apart. Then you can explain what kind of cause a poorly done installation is.',
    },
    4: {
      nl: 'Op Expert pas je Weibull zelf toe. Je zet falende leeftijden uit en leest een levensduur af, ook als de data ruw is. Straks kun je een levensduur voor een gegeven percentage uitrekenen en een trend in een herstelbaar systeem lezen.',
      en: 'At Expert you apply Weibull yourself. You plot failure ages and read off a life, even when the data is rough. By the end you can work out a life for a given percentage and read a trend in a repairable system.',
    },
  },
  'eng.reliability/risk': {
    2: {
      nl: 'Vanaf Werkkennis maak je een FMEA voor een installatie. Je scoort ernst, kans en ontdekking en kijkt wat een extra sensor doet met de score. Als je klaar bent, kun je beantwoorden wat een FMECA toevoegt en hoe diep je een installatie opdeelt.',
      en: 'Once you open Working knowledge, you build an FMEA for equipment. You score severity, occurrence and detection and see what an extra sensor does to the score. When you are done, you can answer what an FMECA adds and how deep to break an asset down.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, beslis je over reserve en gemeenschappelijke oorzaken. Je weegt of een stand-by eenheid echt een tweede kans is en wat een lijn in serie doet met de beschikbaarheid. Na afloop kun je uitleggen wanneer redundantie aanspraak mist.',
      en: 'When you reach Advanced, you decide about spares and common causes. You weigh whether a standby unit is a real second chance and what a series line does to availability. After this you can explain when redundancy falls short.',
    },
    4: {
      nl: 'Bij Expert zet een senior risico om in euro’s. Het gaat om kans keer gevolg en om wat een ingreep per jaar kost. Daarna kun je een beslissing over een installatie onderbouwen met een bedrag.',
      en: 'With Expert a senior turns risk into euros. It is about chance times consequence and what an intervention costs per year. Afterwards you can back a decision about an asset with an amount.',
    },
  },
  'eng.reliability/strategy': {
    2: {
      nl: 'Nu je Werkkennis opent, pas je onderhoud op maat toe per storing. Je formuleert een storingsvorm goed en kiest een taak die bij het gedrag past. Dan kun je beantwoorden wat een goed gestelde storingsvorm is en welke taak past bij een afsluiter die nooit hoeft te openen.',
      en: 'As you step into Working knowledge, you apply tailored maintenance per failure. You word a failure mode properly and choose a task that fits its behaviour. Then you can answer what a well-stated failure mode is and which task suits a valve that never has to open.',
    },
    3: {
      nl: 'Op Gevorderd bouw je een betrouwbaarheidsprogramma. Je beslist waar je begint met data, met codes en met de tijd van technici. Straks kun je uitleggen wat je eerst doet als de meeste storingscodes overig zeggen.',
      en: 'At Advanced you build a reliability programme. You decide where to start with data, codes and technicians’ time. By the end you can explain what to do first when most failure codes say other.',
    },
    4: {
      nl: 'Met Expert verbindt een senior onderhoud met het bedrijfsplan. Het gaat om een strategisch plan voor installaties, om normen en om wat een audit wil terugzien. Aan het eind kun je beantwoorden waar die plannen voor dienen.',
      en: 'From Expert on, a senior ties maintenance to the business plan. It is about a strategic plan for assets, standards and what an audit wants to see. Once you finish, you can answer what those plans are for.',
    },
  },
  'eng.reliability/decide': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, ga je beschikbaarheid uitrekenen. Je verdeelt stilstand over storingen en herstel en rekent wat een uur kost. Na afloop kun je beantwoorden hoe beschikbaar een machine is en wat storingen op een bottleneck per jaar kosten.',
      en: 'When you reach Working knowledge, you start calculating availability. You divide downtime over failures and repair and work out what an hour costs. After this you can answer how available a machine is and what failures on a bottleneck cost per year.',
    },
    3: {
      nl: 'Bij Gevorderd weeg je reserveonderdelen tegen risico. Je beslist of een duur onderdeel op voorraad hoort en wat aanhouden kost. Daarna kun je uitleggen wat een reserve per jaar kost en welke ingreep de behoefte kan wegnemen.',
      en: 'With Advanced you weigh spares against risk. You decide whether an expensive part belongs in stock and what holding it costs. Afterwards you can explain what a spare costs per year and which change can remove the need.',
    },
    4: {
      nl: 'Vanaf Expert beslist een senior over repareren of vervangen. Het gaat om de levenscycluskosten, om de tijdwaarde van geld en om oude uitgaven die niet meetellen. Als je klaar bent, kun je een vervanging verdedigen zonder in de valkuil van verloren kosten te lopen.',
      en: 'Once you open Expert, a senior decides between repair and replace. It is about life-cycle cost, the time value of money and old spending that does not count. When you are done, you can defend a replacement without falling into the sunk-cost trap.',
    },
  },
  'eng.machining/turning': {
    2: {
      nl: 'Op Werkkennis ga je snijgegevens echt instellen. Je zet snijsnelheid, voeding en snedediepte om in toerental en bewerkingstijd. Straks kun je beantwoorden welk toerental bij een diameter hoort en hoe lang een snede duurt.',
      en: 'At Working knowledge you start setting cutting data for real. You turn cutting speed, feed and depth of cut into spindle speed and machining time. By the end you can answer which speed goes with a diameter and how long a cut takes.',
    },
    3: {
      nl: 'Met Gevorderd stuur je het resultaat van een afwerksnede. Je kiest voeding en neusradius voor de ruwheid en let op spanen en slanke delen. Aan het eind kun je uitleggen wat een halve voeding met de ruwheid doet.',
      en: 'From Advanced on, you steer the result of a finishing cut. You choose feed and nose radius for roughness and watch chips and slender parts. Once you finish, you can explain what halving the feed does to roughness.',
    },
    4: {
      nl: 'Nu je Expert opent, weegt een senior een draaifreescentrum. Het gaat om alles in één opspanning, om wat een restant van de staaf kost en om wat je aan gereedschap nodig hebt. Dan kun je beoordelen of zo’n machine zich voor een onderdeel terugverdient.',
      en: 'As you step into Expert, a senior weighs a turn-mill centre. It is about everything in one setup, what a bar remnant costs and what tooling you need. Then you can judge whether such a machine pays off for a part.',
    },
  },
  'eng.machining/milling': {
    2: {
      nl: 'Bij Werkkennis stel je freesgegevens in. Je rekent van tanden en toerental naar tafelvoeding en bepaalt hoeveel metaal je per minuut afneemt. Daarna kun je beantwoorden welke voeding een frees nodig heeft en hoe groot het verspaand volume is.',
      en: 'With Working knowledge you set milling data. You work from teeth and speed to table feed and determine how much metal you remove per minute. Afterwards you can answer what feed a cutter needs and how large the removal rate is.',
    },
    3: {
      nl: 'Vanaf Gevorderd kies je een freesstrategie. Je beslist tussen meelopend en tegenlopend frezen en houdt rekening met dunne spanen en trochoïdaal werk. Als je klaar bent, kun je uitleggen waarom je de voeding bij een smalle snede corrigeert.',
      en: 'Once you open Advanced, you choose a milling strategy. You decide between climb and conventional milling and allow for chip thinning and trochoidal work. When you are done, you can explain why you correct the feed for a narrow cut.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior vijfassig frezen. Het gaat om wanneer positioneren volstaat, wanneer je echt gelijktijdig moet bewegen en wat minder opspanningen opleveren. Na afloop kun je een investering in vijf assen onderbouwen.',
      en: 'When you reach Expert, a senior weighs five-axis milling. It is about when positioning is enough, when you truly need simultaneous motion and what fewer setups return. After this you can back up an investment in five axes.',
    },
  },
  'eng.machining/drilling': {
    2: {
      nl: 'Met Werkkennis maak je gaten op maat. Je kiest ruimen, tappen of boren en bepaalt de boormaat voor een draad. Aan het eind kun je beantwoorden welke maat je voor een draad voorboort en wat de grootste toegestane maat van een gat is.',
      en: 'From Working knowledge on, you make holes to size. You choose reaming, tapping or boring and determine the tap drill for a thread. Once you finish, you can answer which size to pre-drill for a thread and what the largest allowed size of a hole is.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, boor je diepe gaten. Je beslist hoe je de spanen eruit krijgt en hoeveel tijd stappen kosten. Dan kun je uitleggen welke verhouding de aanpak voor een diep gat bepaalt.',
      en: 'As you step into Advanced, you drill deep holes. You decide how to get the chips out and how much time pecking costs. Then you can explain which ratio decides the approach for a deep hole.',
    },
    4: {
      nl: 'Op Expert let een senior op de kwaliteit van de ligging. Het gaat om positie en haaksheid en om wat een meetmachine werkelijk meet. Straks kun je beoordelen of gaten op een machine binnen tolerantie liggen en waarom niet.',
      en: 'At Expert a senior watches the quality of position. It is about position and perpendicularity and what a measuring machine really reports. By the end you can judge whether holes from a machine are within tolerance and why not.',
    },
  },
  'eng.machining/cnc': {
    2: {
      nl: 'Vanaf Werkkennis lees je een programma. Je volgt regels in G-code en ziet wat blijft staan tot het wordt veranderd. Als je klaar bent, kun je beantwoorden hoe lang een rechte snede duurt en wat het betekent dat een code modaal is.',
      en: 'Once you open Working knowledge, you read a program. You follow lines of G-code and see what stays active until it is changed. When you are done, you can answer how long a straight cut takes and what it means that a code is modal.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, begrijp je waarom crashes ontstaan. Je beslist hoe je correcties en gereedschapslengtes instelt zodat de machine doet wat je bedoelt. Na afloop kun je uitleggen wat een lengtecorrectie doet en hoeveel je de slijtagecorrectie aanpast bij een te kleine boring.',
      en: 'When you reach Advanced, you understand why crashes happen. You decide how to set offsets and tool lengths so the machine does what you mean. After this you can explain what a length offset does and how much to change the wear offset for an undersized bore.',
    },
    4: {
      nl: 'Bij Expert weegt een senior CAM, simulatie en proefdraaien. Het gaat om wat een postprocessor doet en om waarom een schone simulatie niet alles vangt. Daarna kun je een werkwijze beoordelen op tijd voor de eerste goede onderdelen.',
      en: 'With Expert a senior weighs CAM, simulation and prove-out. It is about what a post-processor does and why a clean simulation does not catch everything. Afterwards you can judge a way of working on the time to the first good parts.',
    },
  },
  'eng.machining/tooling': {
    2: {
      nl: 'Nu je Werkkennis opent, houd je gereedschap in de gaten. Je herkent slijtage, kiest koeling en rekent wat een plaatje per onderdeel kost. Dan kun je beantwoorden welke signalen op versleten gereedschap wijzen en waarom je gereedschap voorinstelt.',
      en: 'As you step into Working knowledge, you keep an eye on tooling. You recognise wear, choose coolant and work out what an insert costs per part. Then you can answer which signs point to a worn tool and why tools are preset.',
    },
    3: {
      nl: 'Op Gevorderd reken je met een Taylor-lijn. Je beslist hoe levensduur reageert op snelheid en welke slijtagegrens je hanteert. Straks kun je uitleggen wat een kleine exponent betekent en hoe lang een plaatje op een lagere snelheid meegaat.',
      en: 'At Advanced a Taylor line works with you. You decide how tool life responds to speed and which wear limit to use. By the end you can explain what a small exponent means and how long an insert lasts at a lower speed.',
    },
    4: {
      nl: 'Met Expert weegt een senior de economische snijsnelheid. Het gaat om wisseltijd, plaatkosten en machinekosten samen, en om wat sneller snijden werkelijk kost. Aan het eind kun je uitleggen waarom een kortere wisseltijd een hogere snelheid rechtvaardigt.',
      en: 'From Expert on, a senior weighs the economic cutting speed. It is about change time, insert cost and machine cost together, and what cutting faster really costs. Once you finish, you can explain why a shorter change time justifies a higher speed.',
    },
  },
  'eng.machining/workholding': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kijk je naar oppervlak en meetfouten. Je ziet waarom een warm onderdeel anders meet en wat trillingsmerken je vertellen. Na afloop kun je beantwoorden hoeveel een onderdeel bij een andere temperatuur groeit en wat een regelmatig golfpatroon veroorzaakt.',
      en: 'When you reach Working knowledge, you look at surface and measuring errors. You see why a warm part measures differently and what chatter marks tell you. After this you can answer how much a part grows at another temperature and what causes a regular wavy pattern.',
    },
    3: {
      nl: 'Bij Gevorderd bepaal je hoeveel je een meting kunt vertrouwen. Je let op onzekerheid en op een meetsysteemstudie ten opzichte van de tolerantie. Daarna kun je uitleggen wat een bepaald percentage van de tolerantie betekent voor je besluit.',
      en: 'With Advanced you decide how far you can trust a measurement. You look at uncertainty and at a gauge study against the tolerance. Afterwards you can explain what a given percentage of the tolerance means for your decision.',
    },
    4: {
      nl: 'Vanaf Expert bewijs je dat het proces capabel is. Het gaat om spreiding, ligging en wat er in de loop van een dag verandert. Als je klaar bent, kun je beoordelen of een daling in capability door verschuiving of door spreiding komt.',
      en: 'Once you open Expert, you prove that the process is capable. It is about spread, centring and what changes over the course of a day. When you are done, you can judge whether a drop in capability comes from shift or from spread.',
    },
  },
  'eng.joining/arc': {
    2: {
      nl: 'Op Werkkennis ga je lasparameters instellen. Je zet draadsnelheid, spanning en lassnelheid om in wat er in de naad komt. Straks kun je beantwoorden hoeveel warmte er per lengte wordt ingebracht en hoeveel draad een snelheid betekent.',
      en: 'At Working knowledge you start setting weld parameters. You turn wire speed, voltage and travel speed into what goes into the seam. By the end you can answer how much heat per length is put in and how much wire a speed means.',
    },
    3: {
      nl: 'Met Gevorderd werk je op papier. Je beslist wat een lasprocedure en een kwalificatie dekken en wat je moet herhalen bij een wijziging. Aan het eind kun je uitleggen tot welke plaatdikte een proef bevoegdheid geeft en wat een hogere warmte-inbreng met de taaiheid doet.',
      en: 'From Advanced on, you work on paper. You decide what a weld procedure and a qualification cover and what to repeat after a change. Once you finish, you can explain up to which plate thickness a test qualifies and what higher heat input does to toughness.',
    },
    4: {
      nl: 'Nu je Expert opent, weegt een senior wat warmte met het staal doet. Het gaat om de warmte-beïnvloede zone, voorverwarmen en lastig lasbare metalen. Dan kun je beoordelen of een staal voorverwarmen nodig heeft en wat een waterstofscheur nodig heeft.',
      en: 'As you step into Expert, a senior weighs what heat does to the steel. It is about the heat-affected zone, preheating and difficult-to-weld metals. Then you can judge whether a steel needs preheating and what a hydrogen crack requires.',
    },
  },
  'eng.joining/spot': {
    2: {
      nl: 'Bij Werkkennis houd je puntlassen op niveau. Je ziet hoe elektroden slijten en wat je met stroom, frezen en teller doet. Daarna kun je beantwoorden welke stroom je aanhoudt bij een grotere punt en na hoeveel lassen je frezen moet.',
      en: 'With Working knowledge you keep spot welds at standard. You see how tips wear and what to do with current, dressing and the stepper. Afterwards you can answer which current to use for a larger tip face and after how many welds to dress.',
    },
    3: {
      nl: 'Vanaf Gevorderd controleer je lassen. Je kiest tussen de peeltest, ultrasoon en adaptieve regeling en weet welke puntdiameter minimaal is. Als je klaar bent, kun je uitleggen hoe groot een punt voor dun plaat moet zijn.',
      en: 'Once you open Advanced, you check welds. You choose between peel testing, ultrasonic and adaptive control and know the minimum button size. When you are done, you can explain how large a button must be for thin sheet.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, beoordeelt een senior het lasvenster en moeilijke materialen. Het gaat om hoe breed het venster is, om wat een nieuwe coating ermee doet en om hoeveel marge je hebt. Na afloop kun je een nieuw materiaal beoordelen op lasbaarheid.',
      en: 'When you reach Expert, a senior judges the weld lobe and difficult materials. It is about how wide the lobe is, what a new coating does to it and how much margin you have. After this you can assess a new material for weldability.',
    },
  },
  'eng.joining/defects': {
    2: {
      nl: 'Met Werkkennis controleer je lassen systematisch. Je weegt wat een destructieve proef kost en welke controle bij welk materiaal past. Aan het eind kun je beantwoorden welke methode een fijne scheur op roestvast staal vindt en wat een proef per robot kost.',
      en: 'From Working knowledge on, you check welds systematically. You weigh what a destructive test costs and which check suits which material. Once you finish, you can answer which method finds a fine crack in stainless steel and what a test per robot costs.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, beslis je over de omvang van onderzoek. Je kiest hoeveel lassen je beproeft en wie het kwaliteitsniveau bepaalt. Dan kun je uitleggen welk uitvoeringsniveau bij een constructie hoort en hoeveel lassen een percentage betekent.',
      en: 'As you step into Advanced, you decide how much to inspect. You choose how many welds to test and who sets the quality level. Then you can explain which execution level goes with a structure and how many welds a percentage means.',
    },
    4: {
      nl: 'Op Expert pak je terugkerende fouten aan. Het gaat om herstelpercentages, vervorming en restspanning en om wat een tekening echt eist. Straks kun je beoordelen of een las aan de eis voldoet en waar het herstel vandaan komt.',
      en: 'At Expert you tackle recurring defects. It is about repair rates, distortion and residual stress and what a drawing really demands. By the end you can judge whether a weld meets the requirement and where the repairs come from.',
    },
  },
  'eng.joining/bolting': {
    2: {
      nl: 'Vanaf Werkkennis ga je een boutverbinding aanhalen en begrijpen. Je ziet waar het koppel heen gaat en waarom verbindingen losraken. Als je klaar bent, kun je beantwoorden hoeveel van het koppel in voorspanning terechtkomt en wat een spreiding betekent.',
      en: 'Once you open Working knowledge, you tighten and understand a bolted joint. You see where the torque goes and why joints work loose. When you are done, you can answer how much of the torque ends up as preload and what scatter means.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, kies je een aanhaalmethode. Je weegt koppel tegen hoek en kijkt hoe de spreiding je ontwerp bepaalt. Na afloop kun je uitleggen hoeveel voorspanning je nominaal nodig hebt en hoe ver de moer draait bij een hoek.',
      en: 'When you reach Advanced, you choose a tightening method. You weigh torque against angle and see how scatter shapes your design. After this you can explain how much nominal preload you need and how far the nut moves for an angle.',
    },
    4: {
      nl: 'Bij Expert ontwerpt een senior een verbinding. Het gaat om het verbindingsdiagram, om hoeveel van een uitwendige kracht de bout werkelijk voelt en om vermoeiing. Daarna kun je een verbinding beoordelen op de krachten in de bout.',
      en: 'With Expert a senior designs a joint. It is about the joint diagram, how much of an external force the bolt really feels and fatigue. Afterwards you can assess a joint on the forces in the bolt.',
    },
  },
  'eng.joining/bonding': {
    2: {
      nl: 'Op Werkkennis lijm je in productie. Je let op voorbehandeling, doseren en uitharden en rekent met een rups lijm. Daarna kun je beantwoorden hoeveel lijm een rups vraagt, welke sterkte een proefstuk haalt en wat het breukvlak je vertelt.',
      en: 'At Working knowledge you glue in production. You look at surface preparation, dosing and curing and work with a bead of adhesive. Afterwards you can answer how much adhesive a bead needs, what strength a test piece reaches and what the fracture face tells you.',
    },
    3: {
      nl: 'Op Gevorderd bewaak je klinken en clinchen in serie. Je beslist welke maat in de doorsnede telt en hoe je een proceskracht volgt. Straks kun je uitleggen wanneer een stijgende kracht ingrijpen vraagt.',
      en: 'At Advanced you watch riveting and clinching in series. You decide which dimension in the cross-section counts and how to follow the process force. By the end you can explain when a rising force calls for action.',
    },
    4: {
      nl: 'Met Expert kiest een senior de verbindingsmethode. Het gaat om materiaal, corrosie, demonteren en kosten samen. Aan het eind kun je een keuze tussen lassen, lijmen en klinken verdedigen met meer dan de prijs per stuk.',
      en: 'From Expert on, a senior picks the joining method. It is about material, corrosion, disassembly and cost together. Once you finish, you can defend a choice between welding, bonding and riveting with more than the price per piece.',
    },
  },
  'eng.joining/production': {
    2: {
      nl: 'Bij Werkkennis kijk je naar mallen en volgorde. Je ziet hoe hechten en een slimme lasvolgorde krimp beperken. Daarna kun je beantwoorden hoeveel een ligger door krimp te kort komt en hoe nauwkeurig de naad ten opzichte van de draad moet liggen.',
      en: 'At Working knowledge you look at jigs and sequence. You see how tacking and a clever weld sequence limit shrinkage. Afterwards you can answer how much a beam falls short through shrinkage and how precisely the seam must sit relative to the wire.',
    },
    3: {
      nl: 'Bij Gevorderd reken je de prijs van een meter las. Je kijkt naar boogtijd, bedrijfsfactor en neersmeltrendement. Daarna kun je uitleggen hoeveel tijd een meter las echt kost en hoeveel toevoegmateriaal erbij hoort.',
      en: 'With Advanced you work out the price of a metre of weld. You look at arc time, operating factor and deposition efficiency. Afterwards you can explain how much time a metre of weld really costs and how much filler goes with it.',
    },
    4: {
      nl: 'Vanaf Expert ziet een senior laskwaliteit als systeem. Het gaat om normen, om bevoegdheden die je moet bewaken en om wat de norm voor je organisatie eist. Als je klaar bent, kun je beoordelen waar een bedrijf aan voldoet en wat nog ontbreekt.',
      en: 'Once you open Expert, a senior sees weld quality as a system. It is about standards, qualifications you must keep up and what the standard demands of your organisation. When you are done, you can judge what a company complies with and what is still missing.',
    },
  },
  'eng.moulding/machine': {
    2: {
      nl: 'Op Werkkennis volg je de plastic door de schroef. Je ziet waar het smelt en doseert en hoe lang het in de cilinder blijft. Straks kun je beantwoorden hoe lang materiaal in de cilinder zit en in welke zone de gang ondieper wordt.',
      en: 'At Working knowledge you follow the plastic through the screw. You see where it melts and doses and how long it stays in the barrel. By the end you can answer how long material sits in the barrel and in which zone the channel gets shallower.',
    },
    3: {
      nl: 'Met Gevorderd kies je de juiste pers. Je rekent sluitkracht en schotgewicht uit en let op hoeveel van de capaciteit je gebruikt. Aan het eind kun je uitleggen hoe je sluitkracht uit oppervlak en druk haalt en wat een te grote pers aan materiaal doet.',
      en: 'From Advanced on, you choose the right press. You work out clamp force and shot weight and watch how much of the capacity you use. Once you finish, you can explain how to get clamp force from area and pressure and what an oversized press does to the material.',
    },
    4: {
      nl: 'Nu je Expert opent, weegt een senior hydraulisch tegen elektrisch. Het gaat om energie, terugverdientijd en wat een bijzondere pers kan. Dan kun je een persinvestering onderbouwen.',
      en: 'As you step into Expert, a senior weighs hydraulic against electric. It is about energy, payback and what a special press can do. Then you can back up a press investment.',
    },
  },
  'eng.moulding/cycle': {
    2: {
      nl: 'Bij Werkkennis stel je de koeling bij. Je ziet wat wanddikte met de koeltijd doet en wat een kortere cyclus oplevert. Daarna kun je beantwoorden hoeveel extra onderdelen een snellere cyclus geeft en wat een dunnere wand scheelt.',
      en: 'With Working knowledge you adjust the cooling. You see what wall thickness does to cooling time and what a shorter cycle returns. Afterwards you can answer how many extra parts a faster cycle gives and what a thinner wall saves.',
    },
    3: {
      nl: 'Vanaf Gevorderd kies je tussen meer holtes en een snellere cyclus. Je rekent beide door met een geblokkeerde holte en met kosten. Als je klaar bent, kun je uitleggen welke optie goedkoper is en onder welke voorwaarde.',
      en: 'Once you open Advanced, you choose between more cavities and a faster cycle. You calculate both, with a blocked cavity and with costs. When you are done, you can explain which option is cheaper and under what condition.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior wat een gegoten onderdeel kost. Het gaat om machineuurtarief, matrijskosten per stuk en afval. Na afloop kun je een stukprijs opbouwen en laten zien waar hij gevoelig voor is.',
      en: 'When you reach Expert, a senior weighs what a moulded part costs. It is about machine hour rate, mould cost per part and scrap. After this you can build up a part price and show what it is sensitive to.',
    },
  },
  'eng.moulding/materials': {
    2: {
      nl: 'Met Werkkennis kijk je naar het gedrag van kunststoffen. Je ziet hoe krimp en kristalliniteit de maat bepalen. Aan het eind kun je beantwoorden hoe groot de holte moet zijn en welke kunststoffen amorf zijn.',
      en: 'From Working knowledge on, you look at how plastics behave. You see how shrinkage and crystallinity decide the size. Once you finish, you can answer how large the cavity must be and which plastics are amorphous.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, droog je kunststof op de maat. Je beslist hoeveel vocht er nog mag zitten en hoe je dat meet. Dan kun je uitleggen hoeveel water een bepaald percentage in een partij betekent.',
      en: 'As you step into Advanced, you dry plastic to a target. You decide how much moisture may remain and how to measure it. Then you can explain how much water a given percentage means in a batch.',
    },
    4: {
      nl: 'Op Expert weegt een senior vezel, vulstof en recyclaat. Het gaat om krimp die per richting verschilt en om wat een goedkoper materiaal werkelijk kost. Straks kun je beoordelen of een materiaalwissel het onderdeel in maat houdt.',
      en: 'At Expert a senior weighs fibre, fillers and recyclate. It is about shrinkage that differs by direction and what a cheaper material really costs. By the end you can judge whether a material change keeps the part to size.',
    },
  },
  'eng.moulding/defects': {
    2: {
      nl: 'Vanaf Werkkennis zoek je de oorzaak van een fout. Je vergelijkt holtes, series en wat er net voor de fout veranderde. Als je klaar bent, kun je beantwoorden hoe vaak een holte moet falen voor het opvalt en wat een nieuwe materiaalpartij doet.',
      en: 'Once you open Working knowledge, you look for the cause of a defect. You compare cavities, runs and what changed just before the defect. When you are done, you can answer how often a cavity must fail before it stands out and what a new material batch does.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, pak je kromtrekken en maatdrift aan. Je beslist hoe richting en krimp samenwerken en waar een wand naar binnen leunt. Na afloop kun je uitleggen hoeveel een onderdeel in de ene richting meer krimpt dan in de andere.',
      en: 'When you reach Advanced, you tackle warpage and dimensional drift. You decide how direction and shrinkage work together and why a wall leans inwards. After this you can explain how much more a part shrinks in one direction than another.',
    },
    4: {
      nl: 'Bij Expert lost een senior fouten voorgoed op. Het gaat om proeven met meerdere instellingen en om wat bewaking van de holtedruk oplevert. Daarna kun je een investering in bewaking tegen de kosten van uitval afwegen.',
      en: 'With Expert a senior solves defects for good. It is about trials with several settings and what cavity pressure monitoring returns. Afterwards you can weigh an investment in monitoring against the cost of rejects.',
    },
  },
  'eng.moulding/setting': {
    2: {
      nl: 'Nu je Werkkennis opent, zoek je het procesvenster. Je ziet hoeveel ruimte een instelling heeft en waarom aan de knoppen draaien riskant is. Dan kun je beantwoorden wat een breed venster betekent en hoeveel er bij omschakelen is gevuld.',
      en: 'As you step into Working knowledge, you look for the process window. You see how much room a setting has and why tweaking the knobs is risky. Then you can answer what a wide window means and how much is filled at switch-over.',
    },
    3: {
      nl: 'Op Gevorderd gebruik je gestructureerde studies. Je beslist met drie vaste proeven wat je instelling doet. Straks kun je uitleggen wat een relatieve viscositeit zegt en wanneer een pers te weinig druk reserve heeft.',
      en: 'At Advanced you use structured studies. You decide with three fixed tests what your setting does. By the end you can explain what a relative viscosity says and when a press has too little pressure reserve.',
    },
    4: {
      nl: 'Met Expert valideer en bewaak je een proces. Het gaat om grenzen voor het gewicht en om de vraag of het proces goed genoeg is. Aan het eind kun je een controlegrens bepalen en een capability beoordelen.',
      en: 'From Expert on, you validate and monitor a process. It is about limits for the weight and whether the process is good enough. Once you finish, you can set a control limit and assess a capability.',
    },
  },
  'eng.moulding/moulds': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kijk je in de matrijs. Je ziet hoe een aanspuiting werkt en waarom een onderdeel een lossingshoek nodig heeft. Na afloop kun je beantwoorden hoeveel van een schot aan de koude loper gaat en wat een tunnelaanspuiting voordeel geeft.',
      en: 'When you reach Working knowledge, you look inside the mould. You see how a gate works and why a part needs a draft angle. After this you can answer how much of a shot goes into the cold runner and what a tunnel gate gains.',
    },
    3: {
      nl: 'Bij Gevorderd plan je onderhoud en wissels. Je beslist wanneer je ingrijpt en wanneer een terugkerende reparatie een ontwerpfout verraadt. Daarna kun je uitleggen hoe vaak onderhoud nodig is en wat een logboek je vertelt.',
      en: 'With Advanced you plan maintenance and changes. You decide when to step in and when a recurring repair gives away a design fault. Afterwards you can explain how often maintenance is due and what a logbook tells you.',
    },
    4: {
      nl: 'Vanaf Expert loop je een nieuwe matrijs van ontwerp tot vrijgave. Het gaat om wat een matrijs per stuk kost en wat een klant aan een eerste serie eist. Als je klaar bent, kun je een matrijsproject beoordelen.',
      en: 'Once you open Expert, you follow a new mould from design to release. It is about what a mould costs per part and what a customer demands of a first run. When you are done, you can assess a mould project.',
    },
  },
  'eng.lines/design': {
    2: {
      nl: 'Op Werkkennis kies je een lijnopzet. Je let op soorten lijnen, buffers en waar je inspecteert. Straks kun je beantwoorden wat het nadeel is van grote buffers en waar een keuring het goedkoopst staat.',
      en: 'At Working knowledge you choose a line layout. You look at line types, buffers and where to inspect. By the end you can answer what the downside of large buffers is and where an inspection costs least.',
    },
    3: {
      nl: 'Met Gevorderd dimensioneer je buffers. Je beslist hoeveel ruimte een lijn nodig heeft om niet te blokkeren of leeg te lopen. Aan het eind kun je uitleggen hoe groot een buffer voor een bepaalde storing moet zijn.',
      en: 'From Advanced on, you size buffers. You decide how much room a line needs so it does not block or starve. Once you finish, you can explain how large a buffer must be for a given stoppage.',
    },
    4: {
      nl: 'Nu je Expert opent, gebruikt een senior simulatie en de wet van Little. Het gaat om doorlooptijd, om voorraad op de lijn en om wat een aanloop kost. Dan kun je een lijnontwerp toetsen aan de doorlooptijd.',
      en: 'As you step into Expert, a senior uses simulation and Little’s law. It is about lead time, stock on the line and what a ramp-up costs. Then you can test a line design against its lead time.',
    },
  },
  'eng.lines/robots': {
    2: {
      nl: 'Bij Werkkennis kies je een robot. Je let op type, bereik en draagvermogen met het gereedschap erbij. Daarna kun je beantwoorden welk type bij snel pakken en plaatsen past en hoeveel last je mag voeren.',
      en: 'With Working knowledge you choose a robot. You look at type, reach and payload with the gripper included. Afterwards you can answer which type fits fast pick and place and how much load you may carry.',
    },
    3: {
      nl: 'Vanaf Gevorderd ontwerp je een robotcel. Je plant de cyclus, het aanvoeren en de veiligheidsafstand. Als je klaar bent, kun je uitleggen hoe ver een lichtscherm van het gevaar moet staan en hoe lang het wachten op een machine duurt.',
      en: 'Once you open Advanced, you design a robot cell. You plan the cycle, the feeding and the safety distance. When you are done, you can explain how far a light curtain must stand from the hazard and how long waiting for a machine takes.',
    },
    4: {
      nl: 'Op Expert weegt een senior een cobot tegen een gewone robot. Het gaat om vision, offline programmeren en wat het risico van de toepassing toelaat. Daarna kun je beoordelen of een cobot past en welke samenwerkmodus een robot laat afremmen als een mens dichterbij komt.',
      en: 'At Expert a senior weighs a cobot against a standard robot. It is about vision, offline programming and what the risk of the application allows. Afterwards you can judge whether a cobot fits and which collaborative mode makes a robot slow down when a person comes closer.',
    },
  },
  'eng.lines/errorproof': {
    2: {
      nl: 'Met Werkkennis bouw je fouten uit het proces. Je kiest sensoren en mallen die een fout voorkomen of vangen. Aan het eind kun je beantwoorden wat voorkomen is en wat alleen opsporen, en wat een controle oplevert.',
      en: 'From Working knowledge on, you build mistakes out of the process. You choose sensors and fixtures that prevent or catch an error. Once you finish, you can answer what is prevention and what is only detection, and what a check returns.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, kies en test je sensoren. Je beslist welke sensor voor welk materiaal werkt en hoe je bewijst dat hij blijft werken. Dan kun je uitleggen wat een bereik werkelijk is en welke sensor een vloeistof door de wand ziet.',
      en: 'As you step into Advanced, you choose and test sensors. You decide which sensor works for which material and how to prove it keeps working. Then you can explain what a real sensing range is and which sensor sees a liquid through the wall.',
    },
    4: {
      nl: 'Op Expert maakt een senior er een strategie van. Het gaat om de procesfoutenanalyse, om wat doorglipt en om dagelijkse controles van de controle. Straks kun je beoordelen of een foutbeveiliging zijn werk blijft doen.',
      en: 'At Expert a senior makes it a strategy. It is about the process failure analysis, what slips through and daily checks of the check. By the end you can judge whether an error-proofing device keeps doing its job.',
    },
  },
  'eng.lines/variants': {
    2: {
      nl: 'Vanaf Werkkennis stel je een geautomatiseerde lijn om. Je splitst interne en externe omstelwerkzaamheden en kent recepten en wisseldelen. Als je klaar bent, kun je beantwoorden wat een recept is en hoeveel een omstelling scheelt als je extern werk vooraf doet.',
      en: 'Once you open Working knowledge, you change over an automated line. You split internal and external changeover work and know recipes and change parts. When you are done, you can answer what a recipe is and how much a changeover saves when external work is done beforehand.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, balanceer je een lijn met gemengde modellen. Je beslist hoe je met verschillende werkinhoud per station omgaat. Na afloop kun je uitleggen waarom een gewogen gemiddelde alleen niet volstaat.',
      en: 'When you reach Advanced, you balance a mixed-model line. You decide how to handle different work content per station. After this you can explain why a weighted average alone is not enough.',
    },
    4: {
      nl: 'Bij Expert nivelleert een senior de productie. Het gaat om een vaste volgorde, om kleine herhaalcycli en om wat de volgorde beschermt. Daarna kun je een volgorde opstellen en zeggen wat heijunka tegen schommelingen doet.',
      en: 'With Expert a senior levels production. It is about a fixed sequence, small repeating cycles and what the sequence protects. Afterwards you can draw up a sequence and say what heijunka does against swings.',
    },
  },
  'eng.lines/control': {
    2: {
      nl: 'Nu je Werkkennis opent, leer je de regels van machineveiligheid. Je weet wat noodstop en afscherming vragen en welke norm bij prestaties hoort. Dan kun je beantwoorden welk bereik prestatieniveaus beschrijft en sinds wanneer de nieuwe verordening geldt.',
      en: 'As you step into Working knowledge, you learn the rules of machine safety. You know what emergency stop and guarding demand and which standard goes with performance. Then you can answer which range describes performance levels and from when the new regulation applies.',
    },
    3: {
      nl: 'Op Gevorderd reken je OEE op een geautomatiseerde lijn. Je ziet hoe gekoppelde machines elkaars beschikbaarheid meenemen. Straks kun je uitleggen wat geblokkeerd betekent en waarom de lijn minder haalt dan de beste machine.',
      en: 'At Advanced you calculate OEE on an automated line. You see how linked machines drag each other’s availability along. By the end you can explain what blocked means and why the line delivers less than its best machine.',
    },
    4: {
      nl: 'Met Expert haal je uit alarmlijsten wat telt. Het gaat om microstops, om het eerste alarm en om een Pareto van stops. Aan het eind kun je een alarmlog omzetten in een actie met een voorspelde winst.',
      en: 'From Expert on, you pull from alarm lists what counts. It is about micro-stops, the first-out alarm and a Pareto of stops. Once you finish, you can turn an alarm log into an action with an expected gain.',
    },
  },
  'eng.lines/business': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, reken je een terugverdientijd uit. Je zet investering, jaarlijkse besparing en ploegen naast elkaar. Na afloop kun je beantwoorden hoe lang een cel erover doet om zichzelf terug te verdienen en hoe ploegen dat veranderen.',
      en: 'When you reach Working knowledge, you work out a payback time. You set investment, yearly saving and shifts side by side. After this you can answer how long a cell takes to pay for itself and how shifts change that.',
    },
    3: {
      nl: 'Bij Gevorderd bouw je een zaak voor automatisering. Je beslist welke situatie tegen automatiseren pleit en waarom nieuwe lijnen vaak tegenvallen. Daarna kun je een voorstel op onderdelen toetsen.',
      en: 'With Advanced you build a case for automation. You decide which situation argues against automating and why new lines often disappoint. Afterwards you can test a proposal piece by piece.',
    },
    4: {
      nl: 'Vanaf Expert weegt een senior risico en waarde. Het gaat om de nettowaarde van een besparing die later komt, om verlies tijdens de opstart en om waarom projecten falen. Als je klaar bent, kun je een zaak verdedigen die verder kijkt dan terugverdientijd.',
      en: 'Once you open Expert, a senior weighs risk and value. It is about the net present value of a saving that comes later, loss during ramp-up and why projects fail. When you are done, you can defend a case that looks beyond payback.',
    },
  },
  'eng.cost/costprice': {
    2: {
      nl: 'Op Werkkennis reken je een machine-uurtarief uit. Je telt afschrijving, rente, ruimte, energie en onderhoud bij elkaar en deelt door de gebruikte uren. Straks kun je beantwoorden wat een machine per uur kost en wat lineair afschrijven betekent.',
      en: 'At Working knowledge you work out a machine hour rate. You add depreciation, interest, space, energy and maintenance and divide by the hours used. By the end you can answer what a machine costs per hour and what straight-line depreciation means.',
    },
    3: {
      nl: 'Met Gevorderd verdeel je overhead naar activiteit. Je koppelt kosten aan wat ze veroorzaken in plaats van aan een vast percentage. Aan het eind kun je uitleggen wat een inspectie of een klantcontact per keer kost.',
      en: 'From Advanced on, you spread overhead by activity. You tie costs to what causes them rather than to a fixed percentage. Once you finish, you can explain what an inspection or a customer contact costs each time.',
    },
    4: {
      nl: 'Nu je Expert opent, lees je een offerte als een bouwwerk. Het gaat om kosten die een leverancier redelijkerwijs heeft en om leercurves. Dan kun je beoordelen of een prijs redelijk is en wat je kunt onderhandelen.',
      en: 'As you step into Expert, you read a quote like a building. It is about costs a supplier reasonably has and learning curves. Then you can judge whether a price is fair and what you can negotiate.',
    },
  },
  'eng.cost/decisions': {
    2: {
      nl: 'Bij Werkkennis beslis je over maken of kopen. Je kijkt alleen naar kosten die echt veranderen en niet naar wat je toch al betaalt. Daarna kun je beantwoorden welke kosten meetellen en wat een volle capaciteit verandert.',
      en: 'With Working knowledge you decide between make and buy. You look only at costs that really change and not at what you pay anyway. Afterwards you can answer which costs count and what full capacity changes.',
    },
    3: {
      nl: 'Vanaf Gevorderd ga je van kostprijs naar offerte. Je rekent een marge uit en keert het daarna om, want de markt bepaalt soms de prijs. Als je klaar bent, kun je uitleggen welke prijs een marge geeft en welke kostprijs een marktprijs toelaat.',
      en: 'Once you open Advanced, you go from cost price to quote. You work out a margin and then turn it around, because the market sometimes sets the price. When you are done, you can explain which price gives a margin and which cost price a market price allows.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, ziet een senior wie echt verdient. Het gaat om bijdrage, om kosten voor het bedienen van een klant en om een productlijn die schijnbaar verlies maakt. Na afloop kun je beoordelen welke klant of welk product je loslaat.',
      en: 'When you reach Expert, a senior sees who really earns. It is about contribution, the cost to serve a customer and a product line that seems to lose money. After this you can judge which customer or product to let go.',
    },
  },
  'eng.cost/invest': {
    2: {
      nl: 'Met Werkkennis beoordeel je een investering. Je rekent terugverdientijd en contante waarde en let op wat geld later waard is. Aan het eind kun je beantwoorden hoe lang een project erover doet en wat een bedrag over twee jaar nu waard is.',
      en: 'From Working knowledge on, you assess an investment. You work out payback and present value and watch what money later is worth. Once you finish, you can answer how long a project takes to pay back and what an amount in two years is worth now.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, reken je diep met NPV en IRR. Je beslist hoe een jaarlijkse reeks wordt verdisconteerd en wanneer de uitkomst misleidt. Dan kun je uitleggen wat de netto contante waarde van een reeks is en wat een rendement zegt.',
      en: 'As you step into Advanced, you go deep with NPV and IRR. You decide how a yearly series is discounted and when the result misleads. Then you can explain what the net present value of a series is and what a rate of return says.',
    },
    4: {
      nl: 'Op Expert verdedig je een zaak voor het investeringscomité. Het gaat om de aannames onder de cijfers en om wat je eerlijk kunt beloven. Straks kun je een voorstel tegen kritische vragen verdedigen.',
      en: 'At Expert you defend a case before the investment board. It is about the assumptions under the figures and what you can honestly promise. By the end you can defend a proposal against critical questions.',
    },
  },
  'eng.cost/lean': {
    2: {
      nl: 'Vanaf Werkkennis zet je een prijs op verspilling. Je rekent wat uitval en herwerk werkelijk kosten, ook als er ruimte in de capaciteit zit. Als je klaar bent, kun je beantwoorden wat een afgekeurd onderdeel kost en wanneer overwerk meetelt.',
      en: 'Once you open Working knowledge, you put a price on waste. You work out what scrap and rework really cost, even when there is spare capacity. When you are done, you can answer what a rejected part costs and when overtime counts.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, kijk je naar waardestroomkosten. Je beslist hoe vaste kosten over eenheden worden verdeeld en wanneer een boekhoudeffect een verbetering verbergt. Na afloop kun je uitleggen wat er met winst gebeurt als je voorraad opbouwt.',
      en: 'When you reach Advanced, you look at value stream costing. You decide how fixed costs are spread over units and when an accounting effect hides an improvement. After this you can explain what happens to profit when you build stock.',
    },
    4: {
      nl: 'Bij Expert controleer je een besparing zoals een controller. Het gaat om wat echt is en wat alleen een andere verdeling. Daarna kun je een besparing beoordelen en uitleggen welk deel niet telt.',
      en: 'With Expert you check a saving the way a controller does. It is about what is real and what is only a different allocation. Afterwards you can assess a saving and explain which part does not count.',
    },
  },
  'eng.itbasics/network': {
    2: {
      nl: 'Bij Werkkennis scheid je verkeer. Je leest hoe VLAN’s en firewalls het netwerk opdelen en waarom poorten ertoe doen. Daarna kun je beoordelen of een VLAN zonder goede firewall genoeg scheidt en hoe je reageert op een leverancier die alle poorten open wil.',
      en: 'At Working knowledge you separate traffic. You read how VLANs and firewalls divide the network and why ports matter. Afterwards you can judge whether a VLAN without a proper firewall separates enough and how to answer a supplier who wants all ports open.',
    },
    3: {
      nl: 'Op Gevorderd begrijp je waarom het productienetwerk apart staat. Je weegt patchen tegen continuïteit en kent de rol van een tussenzone. Straks kun je uitleggen waarom productieapparatuur trager wordt bijgewerkt en wat een koppeling in de norm is.',
      en: 'At Advanced you understand why the production network stands apart. You weigh patching against continuity and know the role of a buffer zone. By the end you can explain why plant equipment is updated more slowly and what a conduit is in the standard.',
    },
    4: {
      nl: 'Met Expert beoordeelt een senior een fabrieksnetwerk. Het gaat om het risico van een plat netwerk, om de belasting van veel metingen en om zwakke plekken die alles stilleggen. Aan het eind kun je een ontwerp op robuustheid toetsen.',
      en: 'From Expert on, a senior assesses a plant network. It is about the risk of a flat network, the load of many tags and weak spots that stop everything. Once you finish, you can test a design for robustness.',
    },
  },
  'eng.itbasics/cloud': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kies je tussen IaaS, PaaS en SaaS. Je ziet wat jij beheert en wat de aanbieder doet. Na afloop kun je beantwoorden wat altijd jouw verantwoordelijkheid blijft en welke vorm bij een gehuurde machine hoort.',
      en: 'When you reach Working knowledge, you choose between IaaS, PaaS and SaaS. You see what you manage and what the provider does. After this you can answer what always stays your responsibility and which form goes with a rented machine.',
    },
    3: {
      nl: 'Bij Gevorderd plan je herstel. Je beslist hoeveel gegevens je mag kwijtraken en hoe lang herstel mag duren. Daarna kun je uitleggen wat die twee maten meten en wat een regel voor back-ups zegt.',
      en: 'With Advanced you plan recovery. You decide how much data you may lose and how long recovery may take. Afterwards you can explain what those two measures capture and what a rule for backups says.',
    },
    4: {
      nl: 'Vanaf Expert weegt een senior beschikbaarheid en wat een storing kost. Het gaat om ketens van afhankelijkheden, om doorwerken zonder verbinding en om wat een leverancier toezegt. Als je klaar bent, kun je een afspraak over beschikbaarheid beoordelen.',
      en: 'Once you open Expert, a senior weighs availability and what an outage costs. It is about chains of dependencies, working on without a connection and what a supplier promises. When you are done, you can judge an availability agreement.',
    },
  },
  'eng.itbasics/data': {
    2: {
      nl: 'Op Werkkennis lees je een SQL-opdracht. Je ziet welk deel filtert, groepeert en telt. Straks kun je beantwoorden welk deel rijen kiest en waarom een gemiddelde je kan misleiden.',
      en: 'At Working knowledge you read a SQL query. You see which part filters, groups and counts. By the end you can answer which part picks rows and why an average can mislead you.',
    },
    3: {
      nl: 'Met Gevorderd zoek je waarom twee rapporten verschillen. Je kijkt naar het laden van gegevens, tijdzones en wat elk systeem telt. Aan het eind kun je uitleggen wat een ETL doet en welke tijd een stop in UTC lokaal is.',
      en: 'From Advanced on, you look for why two reports differ. You look at loading data, time zones and what each system counts. Once you finish, you can explain what an ETL does and what local time a stop in UTC is.',
    },
    4: {
      nl: 'Nu je Expert opent, herken je dubbel tellen en lege velden. Het gaat om een datamodel dat een join kan laten exploderen en om wat NULL werkelijk betekent. Dan kun je een cijfer dat niet klopt terugvoeren tot de oorzaak in de data.',
      en: 'As you step into Expert, you spot double counting and empty fields. It is about a data model where a join can multiply rows and what NULL really means. Then you can trace a figure that does not add up back to the cause in the data.',
    },
  },
  'eng.itbasics/software': {
    2: {
      nl: 'Werkkennis laat je zien hoe systemen met elkaar praten. Je leest een API-koppeling en let op wat een statuscode over de oorzaak zegt. Daarna kun je beantwoorden welke gegevens meestal van MES naar ERP gaan en waarom je zes systemen niet direct aan elkaar knoopt.',
      en: 'Working knowledge shows how systems talk to each other. You read an API link and watch what a status code says about the cause. Afterwards you can answer which data usually flows from MES to ERP and why you do not wire six systems directly together.',
    },
    3: {
      nl: 'Vanaf Gevorderd begrijp je waarom koppelingen breken. Je weegt synchroon tegen asynchroon en let op wat er bij een dubbel bericht gebeurt. Als je klaar bent, kun je uitleggen wat een rij met wachtende berichten oplevert en wat idempotent verwerken is.',
      en: 'Once you open Advanced, you understand why interfaces break. You weigh synchronous against asynchronous and watch what happens with a duplicate message. When you are done, you can explain what a queue of waiting messages gives you and what idempotent processing is.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, beoordeelt een senior versies en updates. Het gaat om wat een versienummer belooft en om wat een naamswijziging in een veld doet met de koppeling. Na afloop kun je een update op risico beoordelen voordat je hem uitrolt.',
      en: 'When you reach Expert, a senior assesses versions and updates. It is about what a version number promises and what a field rename does to an interface. After this you can judge an update for risk before you roll it out.',
    },
  },
  'eng.ot/levels': {
    2: {
      nl: 'Met Werkkennis leg je twee kaarten van dezelfde fabriek naast elkaar. Je ziet hoe ISA-95 en het Purdue-model hetzelfde terrein anders indelen. Aan het eind kun je beantwoorden waar de twee modellen van elkaar verschillen en waar een cloudsysteem erin past.',
      en: 'From Working knowledge on, you lay two maps of the same plant side by side. You see how ISA-95 and the Purdue model divide the same ground differently. Once you finish, you can answer where the two models differ and where a cloud system fits in.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, ga je de structuur van een locatie gebruiken. Je werkt met de hiërarchie van apparatuur en de vier terreinen van operaties. Dan kun je uitleggen hoeveel eenheden een site telt en welke vier gebieden een MES afdekt.',
      en: 'As you step into Advanced, you start using the structure of a site. You work with the equipment hierarchy and the four operations areas. Then you can explain how many units a site holds and which four areas an MES covers.',
    },
    4: {
      nl: 'Op Expert kijkt een senior waar de piramide kraakt. Het gaat om cloud, edge en industrieel internet en om wat je lokaal moet houden als de verbinding wegvalt. Straks kun je beoordelen waar een taak hoort en wat een storing aan het internet kost.',
      en: 'At Expert a senior looks at where the pyramid creaks. It is about cloud, edge and industrial IoT and what you must keep local when the connection drops. By the end you can judge where a task belongs and what an internet outage costs.',
    },
  },
  'eng.ot/stack': {
    2: {
      nl: 'Vanaf Werkkennis volg je een order omlaag en terug omhoog. Je ziet wat naar de vloer gaat en wat als bevestiging terugkomt. Als je klaar bent, kun je beantwoorden wat van MES naar ERP gaat en hoe een afgeronde order verbruik en afval laat zien.',
      en: 'Once you open Working knowledge, you follow an order down and back up. You see what goes to the floor and what comes back as confirmation. When you are done, you can answer what goes from MES to ERP and how a finished order shows consumption and scrap.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, kijk je naar de koppeling tussen machine en MES. Je beslist hoe je tellers uitleest zodat een herstart geen gaten slaat. Na afloop kun je uitleggen waarom een oplopende teller robuuster is dan een los getal.',
      en: 'When you reach Advanced, you look at the link between machine and MES. You decide how to read counters so a restart does not leave gaps. After this you can explain why a cumulative counter is more robust than a loose number.',
    },
    4: {
      nl: 'Bij Expert beoordeelt een senior een koppeling tussen MES en ERP. Het gaat om cijfers die niet overeenkomen en om welk systeem het laatste woord heeft. Daarna kun je een verschil verklaren en bepalen welke bron geldt.',
      en: 'With Expert a senior assesses a link between MES and ERP. It is about figures that do not match and which system has the last word. Afterwards you can explain a difference and decide which source counts.',
    },
  },
  'eng.ot/protocols': {
    2: {
      nl: 'Nu je Werkkennis opent, geef je machinedata betekenis. Je ziet wat een informatiemodel toevoegt aan een lijst met waarden. Dan kun je beantwoorden wat OPC UA toevoegt en wat een aanvullende specificatie is.',
      en: 'As you step into Working knowledge, you give machine data meaning. You see what an information model adds to a list of values. Then you can answer what OPC UA adds and what a companion specification is.',
    },
    3: {
      nl: 'Op Gevorderd werk je met berichten via een broker. Je ziet hoe MQTT en Sparkplug verkeer van veel machines ordenen. Straks kun je uitleggen hoeveel berichten een site aanmaakt en wat een jokerteken doet in een abonnement.',
      en: 'At Advanced you work with messages sent through a broker. You see how MQTT and Sparkplug organise traffic from many machines. By the end you can explain how many messages a site creates and what a wildcard does in a subscription.',
    },
    4: {
      nl: 'Op Expert weegt een senior het idee van één namespace voor de hele fabriek. Het gaat om minder koppelingen tegenover wat je daarvoor moet regelen. Daarna kun je beoordelen of een unified namespace zijn belofte waarmaakt.',
      en: 'At Expert a senior weighs the idea of one namespace for the whole plant. It is about fewer interfaces against what you must arrange to get there. Afterwards you can judge whether a unified namespace keeps its promise.',
    },
  },
  'eng.ot/convergence': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kijk je naar patchen en levensduur op de vloer. Je ziet waarom je niet zomaar een update inplant. Na afloop kun je beantwoorden hoeveel jaar je nog hebt voor onderdelen en wat een gekwalificeerde patch is.',
      en: 'When you reach Working knowledge, you look at patching and lifecycles on the floor. You see why you cannot just schedule an update. After this you can answer how many years you have left for spare parts and what a qualified patch is.',
    },
    3: {
      nl: 'Bij Gevorderd regel je wijzigingen op de werkvloer. Je beslist wat je vastlegt als uitgangspunt van een programma en wat er na een aanpassing moet gebeuren. Daarna kun je uitleggen wat een baseline is en hoe je verouderde back-ups aanpakt.',
      en: 'With Advanced you manage changes on the shop floor. You decide what to record as the baseline of a program and what must happen after a change. Afterwards you can explain what a baseline is and how to deal with outdated backups.',
    },
    4: {
      nl: 'Vanaf Expert organiseert een senior de samenwerking tussen IT en OT. Het gaat om wie eigenaar van een installatie is, om vervangingen over de jaren en om wat de norm vraagt. Als je klaar bent, kun je een samenwerking inrichten die niet op één persoon leunt.',
      en: 'Once you open Expert, a senior organises cooperation between IT and OT. It is about who owns an installation, replacements over the years and what the standard asks. When you are done, you can set up a collaboration that does not rest on one person.',
    },
  },
  'eng.cyber/basics': {
    2: {
      nl: 'Op Werkkennis herken je een aanval op mensen. Je weet wat gerichte phishing anders maakt en wat een test onder medewerkers laat zien. Straks kun je beantwoorden waarin spearphishing verschilt en hoeveel mensen een melding doen.',
      en: 'At Working knowledge you recognise an attack on people. You know what makes targeted phishing different and what a test among staff shows. By the end you can answer how spear phishing differs and how many people report it.',
    },
    3: {
      nl: 'Met Gevorderd beslis je over wachtwoorden en tweestapsverificatie. Je weegt hoe snel er geraden kan worden en waar hergebruik van wachtwoorden gevaarlijk wordt. Aan het eind kun je uitleggen wat credential stuffing is en waarom MFA helpt.',
      en: 'From Advanced on, you decide about passwords and multi-factor authentication. You weigh how fast guessing can go and where reusing passwords becomes dangerous. Once you finish, you can explain what credential stuffing is and why MFA helps.',
    },
    4: {
      nl: 'Nu je Expert opent, beheert een senior accounts en rechten. Het gaat om minimale rechten, om rechten die ongemerkt groeien en om wanneer een vertrekker moet verdwijnen. Dan kun je een account- en rechtenbeleid beoordelen.',
      en: 'As you step into Expert, a senior manages accounts and rights. It is about least privilege, rights that grow unnoticed and when a leaver must disappear. Then you can assess an account and access policy.',
    },
  },
  'eng.cyber/ot': {
    2: {
      nl: 'Bij Werkkennis deel je een fabriek in zones. Je volgt de eerste stap van de norm en ziet hoe zones en verbindingen samen een kaart vormen. Daarna kun je beantwoorden wat de eerste stap bij het indelen is en hoeveel zones een plant telt.',
      en: 'With Working knowledge you divide a plant into zones. You follow the first step of the standard and see how zones and conduits form a map together. Afterwards you can answer what the first step in dividing is and how many zones a plant has.',
    },
    3: {
      nl: 'Vanaf Gevorderd bepaal je hoe streng een zone moet zijn. Je vergelijkt het niveau dat je wilt met wat de onderdelen kunnen. Als je klaar bent, kun je uitleggen wat het vermogen van een component is en waar de kloof in een zone zit.',
      en: 'Once you open Advanced, you decide how strict a zone must be. You compare the level you want with what the components can do. When you are done, you can explain what a component capability is and where the gap in a zone lies.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, kijkt een senior naar toegang op afstand en patchen. Het gaat om risico’s ordenen, om een stop plannen en om een veilige verbinding voor een leverancier. Na afloop kun je een opzet voor toegang op afstand beoordelen.',
      en: 'When you reach Expert, a senior looks at remote access and patching. It is about ranking risks, planning a stop and a safe connection for a supplier. After this you can judge a set-up for remote access.',
    },
  },
  'eng.cyber/rules': {
    2: {
      nl: 'Met Werkkennis ga je na of een bedrijf onder de wet valt. Je kijkt naar sector en omvang en past dat toe op een aantal voorbeelden. Aan het eind kun je beantwoorden vanaf welke grootte een bedrijf in een genoemde sector meetelt.',
      en: 'From Working knowledge on, you check whether a company falls under the law. You look at sector and size and apply that to a few examples. Once you finish, you can answer from what size a company in a listed sector is covered.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, vul je de zorgplicht in. Je beslist wat passende maatregelen zijn en wat een overtreding kan kosten. Dan kun je uitleggen wat passend betekent en hoe hoog een boete kan uitvallen.',
      en: 'As you step into Advanced, you fill in the duty of care. You decide what appropriate measures are and what a breach can cost. Then you can explain what appropriate means and how high a fine can be.',
    },
    4: {
      nl: 'Op Expert beheer je het melden van incidenten. Het gaat om de termijnen, om wat in elke melding hoort en om wanneer de klok begint te lopen. Straks kun je een meldplicht door een echt incident heen volgen.',
      en: 'At Expert you manage reporting incidents. It is about the deadlines, what goes in each report and when the clock starts running. By the end you can follow a reporting duty through a real incident.',
    },
  },
  'eng.cyber/response': {
    2: {
      nl: 'Vanaf Werkkennis bereid je een incident voor. Je maakt een plan, oefent en weet hoe de fabriek met de hand draait. Als je klaar bent, kun je beantwoorden waarom de contactlijst ook op papier staat en hoeveel een noodprocedure levert.',
      en: 'Once you open Working knowledge, you prepare for an incident. You make a plan, practise and know how the plant runs by hand. When you are done, you can answer why the contact list is also on paper and what a fallback procedure delivers.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, detecteer en begrens je. Je beslist wat je afkoppelt en hoe lang logboeken terugkijken. Na afloop kun je uitleggen wat EDR doet en waarom je een back-up pas na een schone controle terugzet.',
      en: 'When you reach Advanced, you detect and contain. You decide what to disconnect and how far back logs reach. After this you can explain what EDR does and why you only restore a backup after a clean check.',
    },
    4: {
      nl: 'Bij Expert herstelt en leert een senior. Het gaat om wat een stilstand kost, om onderzoek achteraf en om een evaluatie zonder schuldigen. Daarna kun je het verlies van een aanval berekenen en een leerpunt verdedigen.',
      en: 'With Expert a senior recovers and learns. It is about what a stoppage costs, investigation afterwards and a review without blame. Afterwards you can work out the loss from an attack and defend a lesson.',
    },
  },
  'eng.industry40/quality': {
    2: {
      nl: 'Nu je Werkkennis opent, kies je hoe je machinedata vastlegt. Je vergelijkt met de hand noteren met automatisch loggen en ziet wat dat voor je cijfers betekent. Dan kun je beantwoorden hoeveel stops er ongezien blijven en wat OPC UA toevoegt.',
      en: 'As you step into Working knowledge, you choose how to capture machine data. You compare writing things down by hand with automatic logging and see what that means for your figures. Then you can answer how many stops go unseen and what OPC UA adds.',
    },
    3: {
      nl: 'Op Gevorderd kijk je naar stamdata en de val van de OEE. Je beslist wat je als gegeven vertrouwt en waar traceerbaarheid telt. Straks kun je uitleggen waarom strakke traceerbaarheid bij een terugroepactie telt.',
      en: 'At Advanced you look at master data and the OEE trap. You decide what you trust as given and where traceability counts. By the end you can explain why tight traceability matters in a recall.',
    },
    4: {
      nl: 'Met Expert beheert een senior datakwaliteit met regels. Het gaat om oorzaken en om een scorekaart die laat zien hoe goed gegevens zijn. Aan het eind kun je beoordelen hoe betrouwbaar een rapport is dat op meerdere velden leunt.',
      en: 'From Expert on, a senior manages data quality with rules. It is about root causes and a scorecard that shows how good the data is. Once you finish, you can judge how reliable a report is when it leans on several fields.',
    },
  },
  'eng.industry40/dashboards': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, bouw je een prestatierapport. Je leert de basis van Power BI en het verschil tussen een measure en een kolom. Na afloop kun je beantwoorden hoe je OEE van twee lijnen goed combineert.',
      en: 'When you reach Working knowledge, you build a performance report. You learn the basics of Power BI and the difference between a measure and a column. After this you can answer how to combine the OEE of two lines properly.',
    },
    3: {
      nl: 'Bij Gevorderd kies je tussen een scherm op de vloer en een managementrapport. Je beslist wat bij wie hoort en wat er per uur op een scherm staat. Daarna kun je uitleggen wat op een scherm bij de lijn thuishoort.',
      en: 'With Advanced you choose between a shop-floor screen and a management report. You decide what belongs to whom and what shows per hour on a screen. Afterwards you can explain what belongs on a screen at the line.',
    },
    4: {
      nl: 'Vanaf Expert voorkomt een senior meldingsmoeheid. Het gaat om meldingen waar je iets mee kunt en om de plek waar een melding moet aankomen. Als je klaar bent, kun je een meldingsregeling beoordelen op nut.',
      en: 'Once you open Expert, a senior prevents alert fatigue. It is about alerts you can act on and the place where an alert must arrive. When you are done, you can judge an alert scheme on usefulness.',
    },
  },
  'eng.industry40/integration': {
    2: {
      nl: 'Op Werkkennis volg je de weg van bron tot rapport. Je ziet hoe export, laden en verversen op elkaar aansluiten. Straks kun je beantwoorden hoe oud een getal in een rapport kan zijn en wat ELT voor ETL heeft.',
      en: 'At Working knowledge you follow the road from source to report. You see how export, loading and refresh fit together. By the end you can answer how old a figure in a report can be and what ELT has over ETL.',
    },
    3: {
      nl: 'Met Gevorderd regel je wie eigenaar is van data. Je beslist welke afspraak een leverancier van een feed aan de afnemer geeft. Aan het eind kun je uitleggen wat een datacontract belooft en welke rol dagelijks aan definities werkt.',
      en: 'From Advanced on, you settle who owns data. You decide which agreement a supplier of a feed gives to the consumer. Once you finish, you can explain what a data contract promises and which role works daily on definitions.',
    },
    4: {
      nl: 'Nu je Expert opent, verdedigt een senior de zaak en de uitrol. Het gaat om wat een platform per jaar kost en om winst die je pas meetelt als hij echt valt. Dan kun je een uitrolplan beoordelen op wat het werkelijk oplevert.',
      en: 'As you step into Expert, a senior defends the case and the rollout. It is about what a platform costs per year and savings you only count when they really land. Then you can judge a rollout plan on what it truly returns.',
    },
  },
  'eng.industry40/ai': {
    2: {
      nl: 'Bij Werkkennis kijk je naar onderhoud met modellen. Je leest hoeveel meldingen echt een fout waren en waarom afwijkingen opsporen past bij fabrieken met weinig storingen. Daarna kun je beantwoorden hoe goed een model meldt.',
      en: 'With Working knowledge you look at maintenance with models. You read how many alerts were real faults and why anomaly detection suits plants with few failures. Afterwards you can answer how good a model’s alerts are.',
    },
    3: {
      nl: 'Vanaf Gevorderd beoordeel je machine vision. Je weegt wat een camera vangt tegen wat hij onterecht afkeurt en wanneer regels volstaan. Als je klaar bent, kun je uitleggen welke keuring bij regels past en hoeveel goede stuks een camera weggooit.',
      en: 'Once you open Advanced, you assess machine vision. You weigh what a camera catches against what it wrongly rejects and when rules are enough. When you are done, you can explain which inspection suits rules and how many good parts a camera discards.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior digital twins en simulatie. Het gaat om wanneer een simulatie meer geeft dan een spreadsheet. Na afloop kun je beoordelen of een model zijn kosten waard is.',
      en: 'When you reach Expert, a senior weighs digital twins and simulation. It is about when a simulation gives more than a spreadsheet. After this you can judge whether a model is worth its cost.',
    },
  },
  'eng.gridbasics/power': {
    2: {
      nl: 'Met Werkkennis reken je met capaciteit en gelijktijdigheid. Je ziet waarom veel kleine verbruikers niet tegelijk piekt. Aan het eind kun je beantwoorden wat een wijk op een zonnige dag teruglevert en wat gelijktijdigheid beschrijft.',
      en: 'From Working knowledge on, you calculate with capacity and simultaneity. You see why many small users do not peak at the same time. Once you finish, you can answer what a neighbourhood feeds back on a sunny day and what simultaneity describes.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, volg je de spanning langs de kabel. Je berekent verlies en stijging en let op de toegestane band. Dan kun je uitleggen hoeveel spanning een kabel kost en welke marge klanten mogen hebben.',
      en: 'As you step into Advanced, you follow the voltage along the cable. You work out drop and rise and watch the allowed band. Then you can explain how much voltage a cable costs and which margin customers may have.',
    },
    4: {
      nl: 'Op Expert leest een senior meetdata. Het gaat om de belastingduurkromme en om hoe vaak een station zijn grens overschrijdt. Straks kun je uit meetgegevens afleiden hoe groot een probleem werkelijk is.',
      en: 'At Expert a senior reads metering data. It is about the load duration curve and how often a station exceeds its limit. By the end you can derive from metering data how big a problem really is.',
    },
  },
  'eng.gridbasics/grid': {
    2: {
      nl: 'Vanaf Werkkennis volg je het net van onderstation tot stopcontact. Je ziet wat er in een verdeelstation staat en hoe je een transformator dimensioneert. Als je klaar bent, kun je beantwoorden hoeveel woningen een transformator aankan.',
      en: 'Once you open Working knowledge, you follow the grid from substation to socket. You see what is in a distribution substation and how to size a transformer. When you are done, you can answer how many homes a transformer can serve.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, begrijp je evenwicht en frequentie. Je ziet wat een afwijking van de frequentie zegt en wie voor balans zorgt. Na afloop kun je uitleggen wat een frequentie onder de norm betekent en wat een balansverantwoordelijke doet.',
      en: 'When you reach Advanced, you understand balance and frequency. You see what a deviation in frequency says and who looks after balance. After this you can explain what a frequency below the norm means and what a balance responsible party does.',
    },
    4: {
      nl: 'Bij Expert kijkt een senior naar de ruggengraat. Het gaat om hoogspanning, het net op zee en verbindingen met het buitenland. Daarna kun je een keuze voor een verbinding over zee onderbouwen.',
      en: 'With Expert a senior looks at the backbone. It is about extra-high voltage, the offshore grid and links abroad. Afterwards you can back up a choice for a link across the sea.',
    },
  },
  'eng.gridbasics/rules': {
    2: {
      nl: 'Bij Werkkennis ken je de wetten en codes. Je weet welke wet het kader vormt en hoe de oude netcode nu heet. Daarna kun je beantwoorden sinds wanneer die wet geldt en wat de nieuwe naam van de code is.',
      en: 'At Working knowledge you know the laws and codes. You know which law sets the framework and what the old grid code is now called. Afterwards you can answer since when that law applies and what the new name of the code is.',
    },
    3: {
      nl: 'Op Gevorderd regel je aansluiting, transport en tarief. Je weegt wat een klant betaalt voor capaciteit tegen wat hij gebruikt. Straks kun je uitleggen wat het verschil is tussen aansluit- en transportcapaciteit en hoe een aanpassing uitpakt.',
      en: 'At Advanced you handle connection, transport and tariff. You weigh what a customer pays for capacity against what they use. By the end you can explain the difference between connection and transport capacity and how an adjustment works out.',
    },
    4: {
      nl: 'Met Expert begrijpt een senior hoe een netbeheerder zijn geld verdient. Het gaat om investeringen, afschrijving en wat de toezichthouder toestaat. Aan het eind kun je een tariefbesluit plaatsen en uitleggen wat erin zit.',
      en: 'From Expert on, a senior understands how a grid operator earns its money. It is about investments, depreciation and what the regulator allows. Once you finish, you can place a tariff decision and explain what is in it.',
    },
  },
  'eng.gridbasics/congestion': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kijk je naar schaarste en de wachtrij. Je leest een capaciteitskaart en telt wat al beloofd is. Na afloop kun je beantwoorden hoeveel ruimte een station nog heeft en wat het verschil is tussen twee soorten capaciteit.',
      en: 'When you reach Working knowledge, you look at scarcity and the queue. You read a capacity map and count what is already promised. After this you can answer how much room a station still has and what the difference is between two kinds of capacity.',
    },
    3: {
      nl: 'Bij Gevorderd bedenk je wat een grootverbruiker zelf kan doen. Je beslist of een piek te dempen valt en welke afspraak met andere gebruikers helpt. Daarna kun je uitleggen wat een groepsafspraak regelt en hoe een korte piek te beheersen is.',
      en: 'With Advanced you work out what a large consumer can do itself. You decide whether a peak can be reduced and which agreement with other users helps. Afterwards you can explain what a group agreement arranges and how a short peak can be managed.',
    },
    4: {
      nl: 'Vanaf Expert plaatst een senior de energietransitie in het net. Het gaat om wat elektrisch koken, laden en warmte samen vragen van een station. Als je klaar bent, kun je een schatting van de groei verdedigen.',
      en: 'Once you open Expert, a senior places the energy transition in the grid. It is about what electric cooking, charging and heating together ask of a substation. When you are done, you can defend an estimate of growth.',
    },
  },
  'eng.transformers/transformer': {
    2: {
      nl: 'Op Werkkennis kijk je in een transformatorstation. Je rekent met stroom aan de laagspanningskant en met belasting als percentage. Straks kun je beantwoorden welke stroom bij het vermogen hoort en wanneer een transformator vol zit.',
      en: 'At Working knowledge you look inside a transformer station. You calculate with current on the low-voltage side and with load as a percentage. By the end you can answer which current goes with the power and when a transformer is full.',
    },
    3: {
      nl: 'Met Gevorderd reken je met verliezen. Je weegt wat nullast en belast verlies per jaar kosten en wat een zuinige keuze oplevert. Aan het eind kun je uitleggen wat een kilowatt verlies waard is over de levensduur.',
      en: 'From Advanced on, you calculate with losses. You weigh what no-load and load losses cost per year and what a thrifty choice returns. Once you finish, you can explain what a kilowatt of loss is worth over the lifetime.',
    },
    4: {
      nl: 'Nu je Expert opent, houdt een senior de spanning binnen de band. Het gaat om zonnepanelen die spanning laten stijgen en om een regelaar onder belasting. Dan kun je beoordelen of een transformator de spanning nog aankan.',
      en: 'As you step into Expert, a senior keeps the voltage in the band. It is about solar panels pushing voltage up and an on-load tap changer. Then you can judge whether a transformer can still handle the voltage.',
    },
  },
  'eng.transformers/condition': {
    2: {
      nl: 'Bij Werkkennis bepaal je hoe ver je een transformator belast. Je ziet hoe temperatuur veroudering versnelt en wat de grens is. Daarna kun je beantwoorden wat een uur op hoge temperatuur aan levensduur kost.',
      en: 'With Working knowledge you decide how far to load a transformer. You see how temperature speeds up ageing and what the limit is. Afterwards you can answer what an hour at high temperature costs in lifetime.',
    },
    3: {
      nl: 'Vanaf Gevorderd lees je de olie. Je interpreteert gassen in de olie en let op stijgende trends. Als je klaar bent, kun je uitleggen wat een stijging in één gas betekent en welke samenstelling op welke fout wijst.',
      en: 'Once you open Advanced, you read the oil. You interpret gases in the oil and watch rising trends. When you are done, you can explain what a rise in one gas means and which mix points to which fault.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, kijkt een senior naar de hele vloot. Het gaat om een gezondheidsindex en om wat je eerst vervangt. Na afloop kun je een vervangingsvolgorde onderbouwen met een weging van leeftijd, belasting en toestand.',
      en: 'When you reach Expert, a senior looks at the whole fleet. It is about a health index and what you replace first. After this you can back up a replacement order with a weighting of age, load and condition.',
    },
  },
  'eng.transformers/cables': {
    2: {
      nl: 'Met Werkkennis zoek je een kabelfout. Je rekent de plek uit met een echo en weet wat een stootgenerator doet. Aan het eind kun je beantwoorden hoe ver een fout zit en hoe je een fout vindt die niet zichtbaar is.',
      en: 'From Working knowledge on, you look for a cable fault. You work out the spot with an echo and know what a surge generator does. Once you finish, you can answer how far away a fault is and how to find a fault that is not visible.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, test je kabels voordat ze uitvallen. Je gebruikt metingen van ontladingen en vergelijkt tijden aan beide einden. Dan kun je uitleggen hoe je een ontlading lokaliseert en hoe je met een vloot aan storingscijfers rekent.',
      en: 'As you step into Advanced, you test cables before they fail. You use partial discharge measurements and compare times at both ends. Then you can explain how to locate a discharge and how to work with failure figures for a fleet.',
    },
    4: {
      nl: 'Op Expert weegt een senior hoeveel stroom een kabel aankan. Het gaat om bodem, warmte en wat de temperatuur van de geleider zegt. Straks kun je een belastbaarheid beoordelen voor een bepaalde ligging.',
      en: 'At Expert a senior weighs how much current a cable can carry. It is about soil, heat and what the conductor temperature says. By the end you can assess the rating for a given route.',
    },
  },
  'eng.transformers/supply': {
    2: {
      nl: 'Vanaf Werkkennis kijk je naar standaardisatie. Je rekent uit wat een standaard aan ontwerpuren bespaart en wat het nadeel is. Als je klaar bent, kun je beantwoorden hoeveel uur je per jaar wint en waarom netbeheerders standaardiseren.',
      en: 'Once you open Working knowledge, you look at standardisation. You work out what a standard saves in design hours and what the downside is. When you are done, you can answer how many hours you gain per year and why grid operators standardise.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, koop je transformatoren. Je beslist wat je specificeert, hoe je aanbesteedt en wat een proef bij de fabriek bewijst. Na afloop kun je uitleggen wat een acceptatietest is en hoeveel een levertijd in de planning betekent.',
      en: 'When you reach Advanced, you buy transformers. You decide what to specify, how to tender and what a test at the factory proves. After this you can explain what an acceptance test is and what a delivery time means for planning.',
    },
    4: {
      nl: 'Bij Expert plant een senior de vervangingsgolf. Het gaat om een bestand dat op leeftijd komt en om wat een ploeg per jaar kan bouwen. Daarna kun je beoordelen of een plan haalbaar is met de mensen en tijd die er zijn.',
      en: 'With Expert a senior plans the replacement wave. It is about a stock reaching its age and what a crew can build per year. Afterwards you can judge whether a plan is feasible with the people and time available.',
    },
  },
  'eng.switchgear/devices': {
    2: {
      nl: 'Nu je Werkkennis opent, lees je een typeplaatje. Je ziet wat een veld aan stroom en kortsluiting aankan. Dan kun je beantwoorden welke piekstroom bij een kortsluitvastheid hoort en wat de nominale stroom zegt.',
      en: 'As you step into Working knowledge, you read a nameplate. You see what a panel can take in current and short-circuit. Then you can answer which peak current goes with a short-time rating and what the rated current says.',
    },
    3: {
      nl: 'Op Gevorderd begrijp je hoe een schakelaar een stroom afbreekt. Je kijkt naar de herstelspanning na de boog en naar hoe vaak een schakelaar schakelt. Straks kun je uitleggen wat vacuüm helpt en hoeveel schakelingen een schakelaar in zijn leven maakt.',
      en: 'At Advanced you understand how a breaker interrupts a current. You look at the recovery voltage after the arc and at how often a breaker operates. By the end you can explain what vacuum helps with and how many operations a breaker makes in its life.',
    },
    4: {
      nl: 'Met Expert weegt een senior het moment dat het kortsluitvermogen te groot wordt. Het gaat om een nieuw station in het net en om wat een gesplitste rail doet. Aan het eind kun je beoordelen of bestaande velden nog veilig zijn.',
      en: 'From Expert on, a senior weighs the moment the fault level outgrows the equipment. It is about a new station in the grid and what a split busbar does. Once you finish, you can judge whether existing panels are still safe.',
    },
  },
  'eng.switchgear/stations': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, kijk je naar automatisering van de distributie. Je ziet hoe een storing in een ring sneller wordt opgelost. Na afloop kun je beantwoorden hoeveel klanten snel terug zijn en hoe storingsindicatoren een fout helpen vinden.',
      en: 'When you reach Working knowledge, you look at distribution automation. You see how a fault in a ring gets solved faster. After this you can answer how many customers are back quickly and how fault indicators help find a fault.',
    },
    3: {
      nl: 'Bij Gevorderd kijk je in het station. Je let op rails, koppelingen en de batterij die alles aanhoudt. Daarna kun je uitleggen hoe lang een gelijkstroomsysteem moet blijven draaien en wat een gesloten koppeling doet.',
      en: 'With Advanced you look inside the station. You watch busbars, couplers and the battery that holds everything up. Afterwards you can explain how long a DC system must keep running and what a closed coupler does.',
    },
    4: {
      nl: 'Vanaf Expert beheert een senior het afbouwen van SF6. Het gaat om een groot bestand met een klein lek per jaar en om wat de regels vragen. Als je klaar bent, kun je een uitfaseringsplan beoordelen op tempo en kosten.',
      en: 'Once you open Expert, a senior manages the phase-out of SF6. It is about a large stock with a small leak per year and what the rules require. When you are done, you can judge a phase-out plan on pace and cost.',
    },
  },
  'eng.switchgear/protection': {
    2: {
      nl: 'Op Werkkennis stel je beveiligingen op elkaar af. Je laat de relais dichtbij de fout het eerst reageren en houdt een marge aan. Straks kun je beantwoorden hoe laat een relais hoger in het net mag afgaan en waarom een grotere zekering geen oplossing is.',
      en: 'At Working knowledge you coordinate protections with each other. You let the relay closest to the fault act first and keep a margin. By the end you can answer how late a relay higher up the grid may trip and why a larger fuse is no solution.',
    },
    3: {
      nl: 'Met Gevorderd bereken je kortsluitstroom. Je gebruikt de impedantie van een transformator en bepaalt waar de maximale en minimale stroom voor dienen. Aan het eind kun je uitleggen hoe groot een kortsluitstroom ongeveer is.',
      en: 'From Advanced on, you calculate short-circuit current. You use the impedance of a transformer and determine what the maximum and minimum current are used for. Once you finish, you can explain roughly how large a fault current is.',
    },
    4: {
      nl: 'Nu je Expert opent, beschermt een senior een net vol zonneparken. Het gaat om wat omvormers aan stroom leveren en om beveiliging die een fout niet meer ziet. Dan kun je beoordelen of een beveiligingsplan nog werkt met veel opwek.',
      en: 'As you step into Expert, a senior protects a grid full of solar parks. It is about what inverters supply in current and protection that no longer sees a fault. Then you can judge whether a protection plan still works with a lot of generation.',
    },
  },
  'eng.switchgear/switching': {
    2: {
      nl: 'Bij Werkkennis bewijs je dat het spanningsloos is. Je aardt op middenspanning en let op wat een aardset aankan. Daarna kun je beantwoorden of een aardset voldoet bij een kortsluitstroom en waarom een donker lampje niet genoeg is.',
      en: 'With Working knowledge you prove that it is dead. You earth on medium voltage and watch what an earthing set can take. Afterwards you can answer whether an earthing set suffices for a fault current and why a dark lamp is not enough.',
    },
    3: {
      nl: 'Vanaf Gevorderd regel je wie mag schakelen. Je kijkt naar aanwijzingen, overdracht en de bedrijfsvoeringsregels. Als je klaar bent, kun je uitleggen welke handeling een opgeleide aangewezen persoon vraagt en wat er bij een overdracht moet staan.',
      en: 'Once you open Advanced, you settle who may switch. You look at appointments, handover and the operating rules. When you are done, you can explain which action needs a trained, appointed person and what a handover must contain.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, beoordeelt een senior de eigen installatie van een klant. Het gaat om de afspraak met de netbeheerder en om de plek waar het ene eigendom ophoudt. Na afloop kun je een klantinstallatie toetsen op afstemming met het net.',
      en: 'When you reach Expert, a senior reviews the customer’s own installation. It is about the agreement with the grid operator and the point where one ownership ends. After this you can test a customer installation for coordination with the grid.',
    },
  },
  'eng.gridops/connect': {
    2: {
      nl: 'Met Werkkennis volg je een aanvraag tot de aansluiting werkt. Je legt stappen en doorlooptijden achter elkaar en let op wat parallel kan. Aan het eind kun je beantwoorden hoe lang een aansluiting minimaal duurt en wat een gereedheidscontrole voor de uitvoering oplevert.',
      en: 'From Working knowledge on, you follow a request until the connection works. You line up steps and lead times and watch what can run in parallel. Once you finish, you can answer how long a connection takes at least and what a readiness check before execution returns.',
    },
    3: {
      nl: 'Gevorderd draait om gegevens over de assets. Je beslist hoe je de revisie vastlegt en wat fouten in de data aan voorbereidingsuren kosten. Daarna kun je uitleggen wat de revisiestap is en waarom een digital twin alleen met goede gegevens helpt.',
      en: 'Advanced is about data on the assets. You decide how to record the as-built data and what errors in the data cost in preparation hours. Afterwards you can explain what the as-built step is and why a digital twin only helps with good data.',
    },
    4: {
      nl: 'Op Expert weegt een senior de werkvoorraad en eerlijke data. Het gaat om wat een klant wil horen en wat je kunt waarmaken. Straks kun je uit een voorraad en een doorvoer een datum afleiden en die verdedigen.',
      en: 'At Expert a senior weighs the work stock and honest dates. It is about what a customer wants to hear and what you can deliver. By the end you can derive a date from a stock and a throughput and defend it.',
    },
  },
  'eng.gridops/field': {
    2: {
      nl: 'Vanaf Werkkennis maak je een schakelplan. Je volgt de veiligheidsregels in volgorde en rekent uit wat een team per week aankan. Als je klaar bent, kun je beantwoorden welke de eerste drie regels zijn en hoeveel schakelingen een team haalt.',
      en: 'Once you open Working knowledge, you draw up a switching plan. You follow the safety rules in order and work out what a team can do per week. When you are done, you can answer which are the first three rules and how many switching jobs a team can manage.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, plan je ploegen en geplande onderbrekingen. Je beslist wat je bevriest en meet hoeveel van het geplande werk ook echt gebeurt. Na afloop kun je uitleggen wat een bevroren week betekent en hoe je de naleving berekent.',
      en: 'When you reach Advanced, you plan crews and planned interruptions. You decide what to freeze and measure how much of the planned work really happens. After this you can explain what a frozen week means and how to work out compliance.',
    },
    4: {
      nl: 'Bij Expert past een senior lean toe in het veld. Het gaat om de tijd die technici echt met hun handen werken en om wat verspilling verbergt. Daarna kun je een verbetering in productiviteit onderbouwen met metingen.',
      en: 'With Expert a senior applies lean in the field. It is about the time technicians really work with their hands and what waste hides. Afterwards you can back up a productivity improvement with measurements.',
    },
  },
  'eng.gridops/outage': {
    2: {
      nl: 'Nu je Werkkennis opent, kijk je naar de meldkamer en de storingsdienst. Je weegt hoeveel klanten hoe lang zonder stroom zitten en wie je als eerste stuurt. Dan kun je beantwoorden hoe je klantminuten telt en hoe je meldingen bundelt.',
      en: 'As you step into Working knowledge, you look at the control room and the fault service. You weigh how many customers are without power for how long and who to send first. Then you can answer how to count customer minutes and how to bundle reports.',
    },
    3: {
      nl: 'Op Gevorderd bekijk je assets met risico. Je combineert kans en gevolg en ziet waarom twee gelijke transformatoren heel verschillend scoren. Straks kun je uitleggen wat een storingskans per jaar in klantminuten betekent.',
      en: 'At Advanced you look at assets with risk. You combine chance and consequence and see why two identical transformers score very differently. By the end you can explain what a failure chance per year means in customer minutes.',
    },
    4: {
      nl: 'Met Expert leert een senior van storingen. Het gaat om een verdeling per oorzaak en om klantminuten in plaats van aantallen. Aan het eind kun je beoordelen waar maatregelen het meeste opleveren.',
      en: 'From Expert on, a senior learns from outages. It is about a split by cause and about customer minutes instead of counts. Once you finish, you can judge where measures return the most.',
    },
  },
  'eng.gridops/congestion': {
    2: {
      nl: 'Zodra je Werkkennis bereikt, voer je de congestiestudie uit. Je zet het tekort naast de flexibiliteit die zeker beschikbaar is. Na afloop kun je beantwoorden hoeveel flex je mag meetellen en welke partij altijd meedoet.',
      en: 'When you reach Working knowledge, you carry out the congestion study. You set the shortfall next to the flexibility that is certain. After this you can answer how much flex you may count and which party always takes part.',
    },
    3: {
      nl: 'Bij Gevorderd draai je de congestiedesk. Je beslist hoe je een uitgevoerde vraag controleert tegen een baseline. Daarna kun je uitleggen waarom de baseline tot discussie leidt en hoe groot het gemiste deel was.',
      en: 'With Advanced you run the congestion desk. You decide how to check an executed request against a baseline. Afterwards you can explain why the baseline leads to argument and how large the missed part was.',
    },
    4: {
      nl: 'Vanaf Expert weegt een senior flexibiliteit tegen wachten. Het gaat om wat een oplossing per megawatt kost en om hoe zeker de uitkomst is. Als je klaar bent, kun je beoordelen of flex of bouwen in een gebied verstandiger is.',
      en: 'Once you open Expert, a senior weighs flexibility against waiting. It is about what a solution costs per megawatt and how certain the outcome is. When you are done, you can judge whether flex or building is wiser in an area.',
    },
  },
  'eng.gridplanning/load': {
    2: {
      nl: 'Op Werkkennis lees je een belastingberekening. Je rekent hoe zwaar een kabel belast is en welke stroom bij een aansluiting hoort. Straks kun je beantwoorden hoeveel procent een kabel op de piek draagt.',
      en: 'At Working knowledge you read a load calculation. You work out how heavily a cable is loaded and which current goes with a connection. By the end you can answer what percentage a cable carries at peak.',
    },
    3: {
      nl: 'Met Gevorderd maak je een prognose per station. Je gaat van scenario naar knelpunt en weegt toezeggingen met een realisatiefactor. Aan het eind kun je uitleggen hoe je uit een piek en beloofde aansluitingen een verwachting bouwt.',
      en: 'From Advanced on, you make a forecast per station. You go from scenario to bottleneck and weigh promises with a realisation factor. Once you finish, you can explain how to build an expectation from a peak and promised connections.',
    },
    4: {
      nl: 'Nu je Expert opent, werkt een senior met tijdreeksen en ruimte voor opwek. Het gaat om kansberekening over veel trekkingen en om hoeveel invoeding een voeder aankan. Dan kun je de ruimte op een voeder onderbouwen met kansen.',
      en: 'As you step into Expert, a senior works with time series and room for generation. It is about probability over many draws and how much feed-in a feeder can take. Then you can back up the room on a feeder with probabilities.',
    },
  },
  'eng.gridplanning/design': {
    2: {
      nl: 'Bij Werkkennis ontwerp je een ring met reserve. Je rekent uit hoeveel twee voeders samen mogen dragen als er één uitvalt. Daarna kun je beantwoorden wat de gezamenlijke piek hoogstens mag zijn.',
      en: 'With Working knowledge you design a ring with reserve. You work out how much two feeders may carry together if one drops out. Afterwards you can answer what the combined peak may be at most.',
    },
    3: {
      nl: 'Vanaf Gevorderd toets je een ontwerp aan N-1. Je bepaalt welke capaciteit overblijft als één onderdeel uitvalt en wat N-1 niet garandeert. Als je klaar bent, kun je uitleggen wat de vaste capaciteit van een station is.',
      en: 'Once you open Advanced, you test a design against N-1. You determine what capacity is left when one component fails and what N-1 does not guarantee. When you are done, you can explain what the firm capacity of a station is.',
    },
    4: {
      nl: 'Zodra je Expert bereikt, weegt een senior wanneer N-1 mag worden losgelaten. Het gaat om kans en gevolg in euro’s en om een maatregel die zich wel of niet terugverdient. Na afloop kun je een afwijking van de norm onderbouwen.',
      en: 'When you reach Expert, a senior weighs when N-1 may be relaxed. It is about chance and consequence in euros and a measure that does or does not pay back. After this you can back up a deviation from the standard.',
    },
  },
  'eng.gridplanning/invest': {
    2: {
      nl: 'Met Werkkennis plan je investeringen over de tijd. Je telt terug van de datum waarop iets klaar moet zijn en ziet waarom je bouwt voordat de vraag er is. Aan het eind kun je beantwoorden wanneer een project moet starten.',
      en: 'From Working knowledge on, you plan investments over time. You count back from the date something must be ready and see why you build before demand arrives. Once you finish, you can answer when a project must start.',
    },
    3: {
      nl: 'Nu je Gevorderd opent, kies je wat je eerst doet. Je weegt risico, netto contante waarde en schaarse mensen. Dan kun je uitleggen hoe je met beperkte capaciteit toch een volgorde kiest.',
      en: 'As you step into Advanced, you choose what to do first. You weigh risk, net present value and scarce people. Then you can explain how to pick an order even with limited capacity.',
    },
    4: {
      nl: 'Op Expert brengt een senior het plan tot een gebouwd net. Het gaat om wat een team per jaar kan voorbereiden en om standaardontwerpen die de bouw versnellen. Straks kun je beoordelen of een investeringsplan uitvoerbaar is.',
      en: 'At Expert a senior takes the plan to a built grid. It is about what a team can prepare per year and standard designs that speed up the build. By the end you can judge whether an investment plan is executable.',
    },
  },
  'eng.gridplanning/flex': {
    2: {
      nl: 'Vanaf Werkkennis ga je flexibiliteit gebruiken. Je rekent wat een aansluiting op een deel van het piekvermogen oplevert. Als je klaar bent, kun je beantwoorden hoeveel een zonnepark werkelijk mag leveren en waarvoor GOPACS dient.',
      en: 'Once you open Working knowledge, you start using flexibility. You work out what a connection at part of the peak power gives. When you are done, you can answer how much a solar farm may really deliver and what GOPACS is for.',
    },
    3: {
      nl: 'Zodra je Gevorderd bereikt, zet je batterijen in. Je rekent hoe lang een batterij vol vermogen levert en wanneer hij een knelpunt oplost. Na afloop kun je uitleggen hoeveel uur een batterij volhoudt.',
      en: 'When you reach Advanced, you put batteries to work. You work out how long a battery delivers full power and when it resolves a bottleneck. After this you can explain how many hours a battery lasts.',
    },
    4: {
      nl: 'Bij Expert weegt een senior de waarde van uitstel. Het gaat om wat een jaar later bouwen scheelt en om een contract voor flex dat iets minder zeker is. Daarna kun je beoordelen of flex of bouwen goedkoper uitpakt.',
      en: 'With Expert a senior weighs the value of deferral. It is about what building a year later saves and a flex contract that is a little less certain. Afterwards you can judge whether flex or building works out cheaper.',
    },
  },
};

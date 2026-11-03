// eng.machining (NL): Verspanen: draaien, frezen, boren, slijpen, CNC, snijwaarden, gereedschap, opspanning, kwaliteit.
export default {
  lessons: [
    {
      id: 'eng.machining.processes',
      title: 'Draaien, frezen, boren, slijpen',
      pre: [
        {
          q: 'Je hebt een ronde stalen as nodig met twee kragen en een groef. Welke machine maakt die?',
          options: ['Een freesmachine', 'Een kolomboormachine', 'Een draaibank', 'Een vlakslijpmachine'],
          answer: 'Een draaibank',
          why: 'Ronde delen komen van draaien: het werkstuk draait en de beitel vormt het.',
        },
      ],
      teach: [
        'Draaien, op een draaibank: het werkstuk draait en een stilstaande beitel beweegt erlangs. Zo maak je ronde vormen: assen, bussen (korte buisjes), flenzen, schroefdraad, groeven, boringen (nauwkeurige gaten).\n\nVeel moderne draaibanken hebben ook aangedreven gereedschap: kleine gemotoriseerde frezen en boren. Daarmee frees je een vlak of boor je een dwarsgat zonder het werkstuk naar een andere machine te brengen.',
        'Frezen: het gereedschap draait en het werkstuk, vastgezet op de tafel, beweegt eronder. Zo maak je vlakken, kamers, sleuven en contouren: behuizingen, beugels, matrijsdelen.\n\nEen standaard freesmachine beweegt in drie richtingen, de assen: links-rechts (X), voor-achter (Y) en op-neer (Z). Vijfassige machines kunnen ook het werkstuk of de kop kantelen, voor complexe vormen zoals pompwaaiers en vliegtuigdelen.',
        'Boren: een draaiende boor maakt ronde gaten, meestal op een freesmachine. Een geboord gat is niet erg nauwkeurig.\n\nVoor een nauwkeurig gat boor je iets te klein en ga je er daarna met een ruimer doorheen: een gereedschap dat de laatste tienden van een millimeter weghaalt. Voor schroefdraad tap je het gat. Gaten dieper dan zo’n vijf keer de diameter worden traag en riskant: spanen lopen vast en boren breken.',
        'Slijpen: een snel draaiende slijpschijf haalt piepkleine beetjes materiaal weg. Zo haal je nauwe toleranties (hoeveel de maat van de tekening mag afwijken) en een fijne afwerking, vaak nadat het deel gehard is: lagerzittingen, geharde assen, kalibers.\n\nDraaien haalt zo’n ±0,02 mm; slijpen ±0,005 mm of beter. Het is trager en duurder, dus engineers slijpen alleen waar de tekening het echt vraagt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een uitgaande as van een tandwielkast. Routing: een staaf Ø55 mm op lengte zagen (1 minuut); op een CNC-draaibank naar Ø50 draaien met kragen (sprongen in de diameter), met 0,2 mm overmaat op de lagerzitting van Ø35 om later te slijpen (6 minuten); een spiebaan van 10 mm frezen, de sleuf voor de spie die een tandwiel op de as vastzet (3 minuten); harden bij een externe harderij (3 dagen); de lagerzitting slijpen naar Ø35 k6, een standaard maatklasse met 16 µm tolerantie, oftewel 0,016 mm (4 minuten).\n\nTotale bewerkingstijd: 14 minuten. Doorlooptijd: zo’n 6 dagen, bijna helemaal het uitbestede harden en het wachten ervoor en erna.',
      },
      said: 'Wat engineers zeggen: “We draaien hem, frezen de spiebaan, sturen hem weg om te harden, en dan slijpen we de lagerzittingen. Het slijpen is vier minuten, de harderij drie dagen.”',
      recall: [
        {
          q: 'Een gat van Ø8 mm moet 60 mm diep. Hoeveel keer de diameter is dat?',
          number: 7.5,
          tolerance: 0.05,
          unit: '× D',
          why: '60 / 8 = 7,5: voorbij de 5 × D waar boren traag en riskant wordt.',
        },
        {
          q: 'Met welk proces maak je een spiebaan in een as?',
          options: ['Frezen', 'Draaien', 'Ruimen', 'Slijpen'],
          answer: 'Frezen',
          why: 'Een spiebaan is een sleuf, gemaakt met een draaiende vingerfrees (een freesgereedschap).',
        },
        {
          q: 'Een geharde lagerzitting moet ±0,005 mm halen. Met welk proces werk je hem af?',
          options: ['Boren', 'Voordraaien', 'Zagen', 'Slijpen'],
          answer: 'Slijpen',
          why: 'Slijpen haalt microns en werkt op gehard staal.',
        },
        {
          q: 'Wat draait er bij draaien?',
          options: ['Het gereedschap', 'Het werkstuk', 'Allebei', 'Geen van beide, de tafel beweegt'],
          answer: 'Het werkstuk',
          why: 'Op een draaibank draait het werkstuk en beweegt de beitel erlangs.',
        },
      ],
      situation: {
        scene: 'Je bent bij een verspaningsbedrijf. Verkoop klaagt dat een standaardas drie weken levertijd heeft, terwijl de bewerkingstijd maar 14 minuten is. De productiemanager zegt dat de machines vol zitten.',
        ask: 'Wat vraag je?',
        model: 'Kunnen we de routing doorlopen: welke stappen, welke machines, en wat gebeurt er tussendoor? Hoeveel van die drie weken is het externe harden, plus het transport en wachten eromheen? En met welke seriegrootte draaien we per stap, want een serie van 200 die bij elke machine wacht, voegt dagen toe zonder dat iemand het merkt.',
        rubric: [
          'Vraagt naar de volledige routing, stap voor stap',
          'Vraagt naar uitbestede stappen en het wachten eromheen',
          'Vraagt naar seriegroottes tussen de stappen',
        ],
      },
      sayIt: 'Leg een inkoper in 60 seconden uit welk verspaningsproces welke vorm maakt, en waarom slijpen extra kost.',
      terms: [
        { term: 'Draaien', def: 'Het werkstuk draait tegen een stilstaande beitel; maakt ronde delen.' },
        { term: 'Frezen', def: 'Een draaiend gereedschap snijdt in een bewegend werkstuk; maakt vlakken, kamers en sleuven.' },
        { term: 'Slijpen', def: 'Een slijpschijf haalt piepkleine beetjes weg voor nauwe toleranties en een fijne afwerking.' },
        { term: 'Ruimen', def: 'Een geboord gat op een nauwkeurige maat afwerken.' },
      ],
    },
    {
      id: 'eng.machining.cnc',
      title: 'CNC: de basis',
      pre: [
        {
          q: 'Waarom meet de insteller na een nieuwe omstelling het eerste stuk voordat de serie draait?',
          options: ['Het is alleen een eis van de klant', 'Om de machine op te warmen', 'Om de operator te trainen', 'Omdat nieuwe offsets, gereedschappen of een nieuw programma de hele serie kunnen verpesten'],
          answer: 'Omdat nieuwe offsets, gereedschappen of een nieuw programma de hele serie kunnen verpesten',
          why: 'Eén fout getal in een omstelling herhaalt zich op elk stuk tot iemand het controleert.',
        },
      ],
      teach: [
        'CNC (computer numerical control) betekent dat een computer de motoren van de machine aanstuurt, volgens een programma. De spil is de draaiende as die het werkstuk (draaibank) of het gereedschap (freesmachine) vasthoudt.\n\nOp een draaibank bepaalt X de diameter en loopt Z langs de spil. Op een freesmachine bewegen X en Y de tafel en beweegt Z de spil op en neer; een vierde en vijfde as draaien het werkstuk of de kop.',
        'Het programma is G-code, een lijst korte commando’s. G00 is een ijlgang (snel verplaatsen), G01 een rechte snede, G02 en G03 zijn cirkelbogen. M03 start de spil, M08 de koeling, M06 wisselt het gereedschap. F is de voeding (hoe snel het gereedschap opschuift), S het toerental, T het gereedschap.\n\nDe meeste programma’s maak je in CAM-software, die het 3D-model omzet in G-code, en stuur je naar de besturing (Fanuc, Siemens, Heidenhain). Kleine aanpassingen doe je aan de machine.',
        'Nulpunten. Het machinenulpunt is een vaste thuispositie. Het werkstuknulpunt (G54) vertelt de machine waar het werkstuk op de tafel zit. Gereedschapscorrecties vertellen hoe lang en hoe dik elk gereedschap is, want elk gereedschap steekt anders uit.\n\nDe insteller, die de machine klaarmaakt voor een nieuwe order, typt deze getallen in. Samen heten ze de offsets. De meeste crashes (gereedschap raakt werkstuk of klemmen) en afgekeurde eerste stukken komen door verkeerde offsets, niet door verkeerde programma’s.',
        'Eerste-stukcontrole (first-off): na elke omstelling (de machine ombouwen voor een nieuwe order), programmawijziging of gereedschapswissel meet je het eerste stuk volledig voordat de serie draait.\n\nVeel bedrijven controleren ook het laatste stuk. Het kost 10 tot 20 minuten en voorkomt een serie van 200 foute stukken.',
      ],
      example: {
        kind: 'worked',
        text: 'Een insteller begint aan een order van 200 flenzen. Hij zet G54 door de bek van de bankschroef af te tasten met een taster, een meetpen in de spil.\n\nVoor gereedschap 5, een boor, typt hij een lengte van 112,43 in plaats van 121,43. De machine denkt dat de boor 9 mm korter is dan hij is, dus hij boort 9 mm dieper.\n\nDe eerste-stukcontrole vindt een gatdiepte die 9 mm te diep is: één stuk afgekeurd, €35. Zonder die controle: 200 × €35 = €7.000 afkeur, en als het gat net boven een dunne bodem moet stoppen, misschien een gebroken boor en een beschadigde mal (de houder van het werkstuk).',
      },
      said: 'Wat engineers zeggen: “Eerste stuk is goed, serie mag draaien. Maar check de lengte van T5 de volgende keer even dubbel, dat is de tweede tikfout deze maand.”',
      recall: [
        {
          q: 'Een serie is 150 stuks; elk afgekeurd stuk kost €28. Zonder controle zou een verkeerde offset de hele serie afkeuren. De eerste-stukcontrole vangt hem op stuk 1. Hoeveel afkeurkosten worden voorkomen, in €?',
          number: 4172,
          tolerance: 1,
          unit: '€',
          why: 'Alleen het eerste stuk gaat verloren: 149 × €28 = €4.172 bespaard.',
        },
        {
          q: 'Wat vertelt G54 aan de machine?',
          options: ['Het toerental van de spil', 'Waar het werkstuk zit: het werkstuknulpunt', 'Welk gereedschap hij moet gebruiken', 'Dat de koeling aan moet'],
          answer: 'Waar het werkstuk zit: het werkstuknulpunt',
          why: 'G54 is het eerste werkstuknulpunt, het nulpunt van het onderdeel.',
        },
        {
          q: 'Wat stuurt de X-as op een CNC-draaibank?',
          options: ['De lengte langs de spil', 'Het toerental', 'De diameter', 'De gereedschapswissel'],
          answer: 'De diameter',
          why: 'X beweegt de beitel naar het hart toe of ervan af; Z loopt langs de spil.',
        },
        {
          q: 'Wat is de meest voorkomende oorzaak van een afgekeurd eerste stuk na een omstelling?',
          options: ['Een verkeerd werkstuknulpunt of gereedschapscorrectie', 'Een bug in de CAM-software', 'Verkeerd materiaal', 'Een versleten spillager'],
          answer: 'Een verkeerd werkstuknulpunt of gereedschapscorrectie',
          why: 'Offsets worden bij elke omstelling met de hand ingetypt; programma’s zijn meestal beproefd.',
        },
      ],
      situation: {
        scene: 'Je bent bij een loonbedrijf in de verspaning. Eén op de vier omstellingen levert een afgekeurd eerste stuk op. De productiemanager wil de CAM-programmeurs op cursus sturen.',
        ask: 'Wat vraag je voordat die cursus geboekt wordt?',
        model: 'Wat waren de oorzaken van de laatste 20 afgekeurde eerste stukken: programmafouten, offsets, verkeerd gereedschap, problemen met de opspanning? Als het meeste handmatig ingetypte offsets zijn, helpt een cursus voor de programmeurs niet; het werkstuk aftasten en gereedschappen voorinstellen misschien wel. Kunnen we deze week met de instellers de afkeurbonnen doorlopen?',
        rubric: [
          'Vraagt naar de echte oorzaken van afgekeurde eerste stukken',
          'Vraagt zich af of de programmeurs de juiste doelgroep zijn',
          'Stelt voor de instellers erbij te betrekken en naar offsetfouten te kijken',
        ],
      },
      sayIt: 'Leg een nieuwe planner in 60 seconden uit wat een omstelling op een CNC inhoudt en waarom het eerste stuk gecontroleerd wordt.',
      terms: [
        { term: 'G-code', def: 'De programmeertaal van CNC-machines: bewegingen, toerentallen, gereedschapswissels.' },
        { term: 'Werkstuknulpunt (G54)', def: 'Vertelt de machine waar het nulpunt van het werkstuk ligt.' },
        { term: 'Gereedschapscorrectie', def: 'De opgeslagen lengte en radius van elk gereedschap.' },
        { term: 'Eerste-stukcontrole', def: 'Volledige controle van het eerste stuk na een omstelling, voordat de serie draait.' },
      ],
    },
    {
      id: 'eng.machining.cutting',
      figure: 'eng.machining.lathe',
      title: 'Snijsnelheid, voeding en snedediepte',
      pre: [
        {
          q: 'Wat is een gangbare snijsnelheid bij het draaien van staal met een hardmetalen wisselplaat?',
          options: ['Zo’n 2 m/min', 'Zo’n 20 m/min', 'Zo’n 200 m/min', 'Zo’n 2.000 m/min'],
          answer: 'Zo’n 200 m/min',
          why: 'Hardmetaal in staal draait ruwweg 150 tot 300 m/min.',
        },
      ],
      teach: [
        'Snijsnelheid (Vc, in meter per minuut) is hoe snel de snijkant door het materiaal gaat. Gereedschap en materiaal bepalen hem.\n\nMeestal snij je met hardmetalen wisselplaten: kleine, vervangbare puntjes van heel hard wolfraamcarbide. Hardmetaal draait 150 tot 300 m/min in staal, 100 tot 200 in rvs, 300 tot 1.000 of meer in aluminium, 40 tot 80 in titanium. Ouder HSS-gereedschap (snelstaal) gaat veel langzamer, zo’n 30 in staal.',
        'Het toerental n, in omwentelingen per minuut, volgt uit de diameter D in mm: n = Vc × 1.000 / (π × D). Voorbeeld: een werkstuk van Ø50 op 200 m/min vraagt 200.000 / 157 = 1.273 omw/min. Een kleinere diameter vraagt meer toeren voor dezelfde snijsnelheid.',
        'Voeding is hoe ver het gereedschap opschuift terwijl het snijdt. Bij draaien in mm per omwenteling (f, zeg 0,25). Bij frezen in mm per tand van de frees (fz, zeg 0,1), dus tafelvoeding = fz × aantal tanden × toerental.\n\nSnedediepte (ap) is hoe diep het gereedschap erin gaat, in mm. Voeding en snedediepte bepalen hoeveel metaal je per minuut weghaalt; snijsnelheid bepaalt het meeste van de warmte en de slijtage.',
        'Draaitijd voor één snede = lengte / (f × n). De afwegingen: een hogere snijsnelheid maakt de cyclus korter maar sloopt de standtijd (hoe lang een snijkant meegaat); bij hardmetaal kan 20% sneller die ruwweg halveren. Een hogere voeding kost minder gereedschap maar geeft een ruwer oppervlak.\n\nDus engineers verhogen eerst voeding en snedediepte, dan pas de snijsnelheid. Voorbewerken haalt het meeste metaal weg; een aparte, rustigere nabewerkingssnede geeft de eindmaat en het oppervlak.',
      ],
      example: {
        kind: 'worked',
        text: 'Voordraaien van een as Ø60 over 200 mm in C45 (een gangbaar middelhard koolstofstaal) met een hardmetalen wisselplaat, Vc 220 m/min, f 0,3 mm/omw. n = 220.000 / (π × 60) = 220.000 / 188,5 = 1.167 omw/min. Voedingssnelheid = 0,3 × 1.167 = 350 mm/min. Tijd per snede = 200 / 350 = 0,57 min, 34 seconden.\n\nVerhoog de voorbewerkingsvoeding naar 0,4: 467 mm/min, 26 seconden, zo’n 8,6 seconden winst per snede. Met 3 voorbewerkingssneden en 5.000 stuks per jaar is dat zo’n 36 uur machinetijd. De nabewerkingssnede blijft op 0,15 voor het oppervlak.',
      },
      said: 'Wat engineers zeggen: “Draai de snijsnelheid niet op, dan vreet je alleen maar wisselplaten. Geef meer voeding op het voordraaien en laat de nabewerking met rust.”',
      recall: [
        {
          q: 'Snijsnelheid 150 m/min, diameter 40 mm. Wat is het toerental, in omw/min?',
          number: 1194,
          tolerance: 10,
          unit: 'omw/min',
          why: 'n = 150 × 1.000 / (π × 40) = 150.000 / 125,7 = 1.194 omw/min.',
        },
        {
          q: 'Spil op 1.000 omw/min, voeding 0,2 mm/omw, snedelengte 100 mm. Hoe lang duurt de snede, in seconden?',
          number: 30,
          tolerance: 1,
          unit: 's',
          why: 'Voedingssnelheid 0,2 × 1.000 = 200 mm/min; 100 / 200 = 0,5 min = 30 s.',
        },
        {
          q: 'Welke snijwaarde heeft de meeste invloed op gereedschapsslijtage?',
          options: ['Snedediepte', 'Snijsnelheid', 'Voeding', 'De kleur van de koelvloeistof'],
          answer: 'Snijsnelheid',
          why: 'Snijsnelheid bepaalt de warmte op de snijkant, en warmte bepaalt de slijtage.',
        },
        {
          q: 'Wat gebeurt er met de oppervlakteruwheid als je de voeding verhoogt?',
          options: ['Hij wordt gladder', 'Er verandert niets', 'Hij wordt ruwer', 'Dat hangt alleen af van de snijsnelheid'],
          answer: 'Hij wordt ruwer',
          why: 'Een grotere voeding laat bredere, diepere gereedschapssporen achter.',
        },
      ],
      situation: {
        scene: 'Je bent bij een verspaningsklant. De productiemanager wil alle snijsnelheden in de werkplaats met 30% verhogen, “om meer uit de machines te halen”.',
        ask: 'Wat vraag je?',
        model: 'Welke machines zijn echt de bottleneck? De rest versnellen levert geen enkel stuk extra op. En 30% sneller kan de standtijd meer dan halveren, dus meer gereedschapswissels en meer kans op afkeur. Kunnen we de bottleneckmachine pakken, eerst naar voeding en snedediepte kijken, en met de gereedschapsleverancier één artikel testen voordat we iets uitrollen?',
        rubric: [
          'Vraagt waar de bottleneck zit',
          'Benoemt de kosten in standtijd en afkeur van een hogere snijsnelheid',
          'Stelt een gecontroleerde test voor, te beginnen bij voeding en snedediepte',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit wat snijsnelheid, voeding en snedediepte zijn, en waarom sneller niet altijd goedkoper is.',
      terms: [
        { term: 'Snijsnelheid (Vc)', def: 'Snelheid van de snijkant door het materiaal, in m/min.' },
        { term: 'Voeding', def: 'Hoe ver het gereedschap opschuift per omwenteling (draaien) of per tand (frezen).' },
        { term: 'Snedediepte (ap)', def: 'Hoe diep het gereedschap in het materiaal snijdt, in mm.' },
        { term: 'Toerental', def: 'Omwentelingen per minuut, uit snijsnelheid en diameter.' },
      ],
    },
    {
      id: 'eng.machining.tools',
      title: 'Slijtage, standtijd en koeling',
      pre: [
        {
          q: 'Wat is bij een CNC-onderdeel meestal het grootste deel van de kosten?',
          options: ['Het snijgereedschap, veruit', 'De machinetijd, veruit', 'Altijd ongeveer gelijk', 'De koelvloeistof'],
          answer: 'De machinetijd, veruit',
          why: 'Gereedschap is vaak maar zo’n 3% van de kostprijs; machinetijd is typisch tien keer zoveel.',
        },
      ],
      teach: [
        'Gereedschap slijt. Vrijloopslijtage: de snijkant zelf slijt weg. Kolkslijtage: er ontstaat een kuiltje bovenop, waar de spaan overheen schuurt.\n\nUitbrokkelen: er springen stukjes af. Opbouwsnede: materiaal van het werkstuk plakt aan de snijkant.\n\nSlijtage groeit eerst langzaam, dan snel. Je ziet het aan maatverloop, een slechter oppervlak, braampjes (scherpe randjes) en een stijgende spilbelasting (de motor moet harder werken). Daarna breekt hij, en dat kan het stuk en de machine beschadigen.',
        'De standtijd zet je in snijminuten of in stuks per snijkant, bijvoorbeeld 15 minuten of 120 stuks. De besturing telt mee; op de grens roept hij een zustergereedschap op (een identiek reservegereedschap in het gereedschapsmagazijn van de machine) of stopt hij voor een wissel.\n\nTe laat betekent afkeur; te vroeg verspilt snijkanten, maar snijkanten zijn goedkoop.',
        'Koelsmeermiddel koelt, smeert en spoelt spanen weg. De meeste bedrijven gebruiken emulsie: olie gemengd met water, meestal 5 tot 8% olie.\n\nDat meet je met een refractometer, een klein handmeetapparaatje. Te mager: roest, korte standtijd, bacteriën. Te vet: schuim en huidproblemen.\n\nHogedrukkoeling, zo’n 70 bar, die door het gereedschap gepompt wordt, breekt de spanen bij diep boren.',
        'Gereedschapsbeheer bepaalt hoeveel de machine draait. Voorinstellen betekent dat je lengte en radius van elk gereedschap op een apart apparaat meet voordat het de machine in gaat, zodat de machine niet stilstaat terwijl de insteller meet.\n\nZustergereedschap, een vaste gereedschapslijst en gereedschap klaarzetten vóór een omstelling schelen allemaal stops. Ontbrekend of niet voorbereid gereedschap is een van de grootste oorzaken van lange omstellingen.',
      ],
      example: {
        kind: 'worked',
        text: 'Een wisselplaat kost €12 en heeft 4 snijkanten: €3 per snijkant. Elke kant doet 80 stuks: €0,0375 aan wisselplaat per stuk. Oprekken naar 100 stuks bespaart €0,0075 per stuk, €7,50 per 1.000 stuks.\n\nMaar een opgerekte snijkant breekt zo’n keer per 1.000 stuks, en dan gaat er een stuk van €45 naar de afkeur en staat de machine 30 minuten stil à €90 per uur: nog eens €45. Je bespaart €7,50 en riskeert €90. Wisselen op 80 is goedkoper.',
      },
      said: 'Wat engineers zeggen: “Stop met die wisselplaten oprekken. We besparen drie euro aan hardmetaal en verliezen elke keer dat er eentje knapt een spiluur.”',
      recall: [
        {
          q: 'Een wisselplaat kost €16, heeft 4 snijkanten, en elke kant gaat 50 stuks mee. Wat zijn de wisselplaatkosten per stuk, in €?',
          number: 0.08,
          tolerance: 0.005,
          unit: '€',
          why: '€16 / 4 = €4 per snijkant; €4 / 50 = €0,08 per stuk.',
        },
        {
          q: 'Welke signalen wijzen op versleten gereedschap?',
          options: ['Stijgende spilbelasting en verlopende maten', 'Koelvloeistof die kouder wordt', 'Snellere cyclustijden', 'Glanzender spanen'],
          answer: 'Stijgende spilbelasting en verlopende maten',
          why: 'Een botte snijkant heeft meer kracht nodig en snijdt iets anders naarmate hij slijt.',
        },
        {
          q: 'Waarom stellen bedrijven gereedschap voor buiten de machine?',
          options: ['Het gereedschap gaat dan langer mee', 'De machine blijft verspanen terwijl het gereedschap elders gemeten wordt', 'Klanten eisen het', 'Het vervangt de eerste-stukcontrole'],
          answer: 'De machine blijft verspanen terwijl het gereedschap elders gemeten wordt',
          why: 'Meten in de machine is verloren spiltijd; een voorinstelapparaat haalt dat naar buiten.',
        },
        {
          q: 'De concentratie van de emulsie is gezakt naar 2%. Wat verwacht je?',
          options: ['Een beter oppervlak', 'Meer schuim', 'Niets, de concentratie maakt niet uit', 'Roest en een kortere standtijd'],
          answer: 'Roest en een kortere standtijd',
          why: 'Een te magere emulsie smeert en beschermt te weinig.',
        },
      ],
      situation: {
        scene: 'Je bent bij een verspaningsklant. De nachtploeg heeft drie boorbreuken per week op één bewerking. De ploegleider wil overstappen op een goedkopere boorleverancier, “want ze breken toch steeds”.',
        ask: 'Wat vraag je?',
        model: 'Staat er een standtijdteller op die boor, en waar staat die op? Wat is de emulsieconcentratie op die machine, en komt de koeling echt bij de punt? En is het alleen ’s nachts, en zo ja, wat is er ’s nachts anders: materiaalbatch, gereedschapswissels, wie stelt in? Een goedkopere boor onder dezelfde omstandigheden breekt waarschijnlijk vaker.',
        rubric: [
          'Vraagt naar de instelling van de standtijd',
          'Vraagt naar emulsieconcentratie en toevoer van de koeling',
          'Vraagt wat er anders is in de nachtploeg',
        ],
      },
      sayIt: 'Leg een inkoper in 60 seconden uit waarom het goedkoopste snijgereedschap zelden het goedkoopste onderdeel oplevert.',
      terms: [
        { term: 'Standtijd', def: 'Snijminuten of stuks per snijkant tot een geplande wissel.' },
        { term: 'Vrijloopslijtage', def: 'Slijtage langs de snijkant; de belangrijkste maat voor een versleten gereedschap.' },
        { term: 'Voorinstellen', def: 'Lengte en radius van gereedschap buiten de machine meten.' },
        { term: 'Zustergereedschap', def: 'Een identiek reservegereedschap in het magazijn dat het overneemt aan het eind van de standtijd.' },
      ],
    },
    {
      id: 'eng.machining.fixtures',
      title: 'Opspanning en omstellen',
      pre: [
        {
          q: 'Welk deel van de tijd verspaant een CNC-machine in een gemiddeld loonbedrijf echt metaal?',
          options: ['Zo’n 30–50%', 'Zo’n 80–90%', 'Zo’n 65%', 'Bijna 100%'],
          answer: 'Zo’n 30–50%',
          why: 'Omstellen, wachten op gereedschap of programma’s, meten en laden nemen de rest.',
        },
      ],
      teach: [
        'Opspanning is hoe het werkstuk vastgehouden wordt: een bankschroef, een driebekklauw op een draaibank (drie bekken die om het werkstuk sluiten), een spantang (een ingezaagde huls die een staaf vastknijpt), of een mal, een houder gemaakt voor één specifiek werkstuk. De taak: het werkstuk elke keer op precies dezelfde plek leggen en het stevig vasthouden tegen de snijkrachten, zonder het te vervormen.',
        'Een los werkstuk kan op zes manieren bewegen: schuiven in drie richtingen en draaien om drie assen. Dat zijn de zes vrijheidsgraden.\n\nHet 3-2-1-principe zet ze alle zes vast: drie steunpunten onder het hoofdvlak, twee langs een zijkant, één aan het eind. Goede mallen positioneren op de referentievlakken die de tekening A, B en C noemt, en spannen het werkstuk naar die aanslagen toe, nooit de lucht in.',
        'Omsteltijd is alles van het laatste goede stuk van de ene order tot het eerste goede stuk van de volgende: oude mal eraf, nieuwe erop, gereedschap laden, offsets zetten, eerste-stukcontrole. Meestal 30 minuten tot 3 uur.\n\nNulpuntspansystemen herhalen binnen 0,005 mm, dus een pallet (een basisplaat met het werkstuk er al op gespannen, buiten de machine geladen) zet je erin en hij draait.',
        'Opspanfouten zijn een grote bron van afkeur: een spaan onder het werkstuk (het kantelt), te veel spankracht (een dunne wand vervormt en veert terug na het lossen), een werkstuk dat niet tegen de aanslag ligt, versleten bekken. Herkenbaar aan: een maat die verschilt tussen opspanningen maar niet binnen één, of één malpositie die altijd slechter is dan de andere.',
      ],
      example: {
        kind: 'worked',
        text: 'Een aluminium behuizing met wanden van 2 mm en een boring van Ø40 H7 (tolerantie 0,025 mm). Hard vastgezet in een bankschroef meet de boring rond in de machine. Na het lossen is hij 0,04 mm onrond: afkeur.\n\nOplossing: spannen op de dikke flens, aangedraaid met een vast aanhaalmoment (draaikracht), en de boring blijft binnen 0,008 mm. Tweede probleem: spanen onder het werkstuk laten het 0,05 mm kantelen, dus een keer afblazen vóór het laden komt in de standaard. Het omstellen gaat ook van 90 naar 25 minuten met een nulpuntpallet die buiten de machine geladen wordt.',
      },
      said: 'Wat engineers zeggen: “In de machine meet hij perfect en op de 3D-meetmachine is hij ovaal. Je spant hem te hard, hij veert terug.”',
      recall: [
        {
          q: 'Hoeveel vrijheidsgraden legt het 3-2-1-principe vast?',
          number: 6,
          tolerance: 0.5,
          unit: '',
          why: 'Drie verschuivingen en drie rotaties: 3 + 2 + 1 = 6 punten.',
        },
        {
          q: 'Het omstellen gaat van 90 naar 25 minuten, bij 8 omstellingen per week. Hoeveel uur machinetijd komt er per week vrij?',
          number: 8.67,
          tolerance: 0.1,
          unit: 'uur',
          why: '65 minuten × 8 = 520 minuten = 8,67 uur.',
        },
        {
          q: 'Een dunwandig werkstuk meet rond in de machine, maar ovaal na het lossen. Wat is de waarschijnlijke oorzaak?',
          options: ['Gereedschapsslijtage', 'Vervorming door het opspannen', 'Een fout programma', 'De temperatuur van de koeling'],
          answer: 'Vervorming door het opspannen',
          why: 'De klem buigt het werkstuk tijdens het verspanen; na het lossen veert het terug.',
        },
        {
          q: 'Delen van één van de vier malposities op een pallet zijn altijd slechter. Waar kijk je eerst?',
          options: ['Het CAM-programma', 'Het materiaalcertificaat', 'De opleiding van de operator', 'Die malpositie: aanslagen, bekken, spanen'],
          answer: 'Die malpositie: aanslagen, bekken, spanen',
          why: 'Een probleem dat aan één positie vastzit, wijst naar de opspanning daar.',
        },
      ],
      situation: {
        scene: 'Je staat bij een CNC-cel met 6% afkeur op een beugel. De programmeur geeft de operators de schuld. Je ziet overal spanen liggen op de mallen en de machinetafel.',
        ask: 'Wat vraag je?',
        model: 'Wanneer ontstaat de afkeur: na het herladen, op bepaalde malposities, of willekeurig door de serie heen? Welke maat is af, en hoeveel? Als het vlakheid of positie is die verschilt tussen opspanningen, zijn spanen onder het werkstuk een goede verdachte, en een keer afblazen en schoonmaken in de standaard kost bijna niets om te proberen.',
        rubric: [
          'Vraagt wanneer en waar de afkeur ontstaat',
          'Vraagt welke maat afwijkt en hoeveel',
          'Koppelt de zichtbare spanen aan een mogelijke opspanoorzaak',
        ],
      },
      sayIt: 'Leg een teamleider in 60 seconden uit waarom opspanning en mallen zoveel afkeur en omsteltijd veroorzaken.',
      terms: [
        { term: 'Mal (opspanmiddel)', def: 'Hulpmiddel dat een werkstuk positioneert en vasthoudt tijdens het verspanen.' },
        { term: '3-2-1-principe', def: 'Drie, twee en één positioneerpunten leggen alle zes vrijheidsgraden vast.' },
        { term: 'Nulpuntspansysteem', def: 'Snelwisselsysteem voor pallets dat binnen microns op dezelfde plek terugkomt.' },
        { term: 'Omsteltijd', def: 'Van het laatste goede stuk van de ene order tot het eerste goede stuk van de volgende.' },
      ],
    },
    {
      id: 'eng.machining.quality',
      title: 'Ruwheid, meten en fouten',
      pre: [
        {
          q: 'Een boring heeft een tolerantie van ±0,005 mm. Waarmee meet je die?',
          options: ['Een stalen liniaal', 'Een schuifmaat', 'Een rolmaat', 'Een boringmeter of luchtmeter'],
          answer: 'Een boringmeter of luchtmeter',
          why: 'Een schuifmaat is in de praktijk goed tot zo’n ±0,02 à 0,03 mm; dit vraagt een speciaal meetmiddel.',
        },
      ],
      teach: [
        'Oppervlakteruwheid geef je aan met Ra: de gemiddelde hoogte van de piepkleine pieken en dalen in het oppervlak, in µm (duizendsten van een millimeter). Voordraaien geeft Ra 3,2 tot 6,3, nadraaien 0,8 tot 1,6, slijpen 0,2 tot 0,8.\n\nAfdichtvlakken en lagerzittingen hebben een lage Ra nodig. Een notitie als “Ra 0,8” op tekening betekent een nabewerkingssnede of slijpen, dus extra kosten.',
        'Meetmiddelen. Schuifmaat: leest 0,01 mm af, echte nauwkeurigheid zo’n ±0,02 à 0,03, prima voor toleranties van ±0,1. Micrometer (schroefmaat): leest 0,001 mm af, voor ±0,01.\n\nGaten: boringmeter, luchtmeter, of tolerantiedoorns (vaste pennen: de ene kant moet erin passen, de andere niet). Een 3D-meetmachine (CMM, coordinate measuring machine) tast punten af in 3D en rapporteert ze ten opzichte van de referentievlakken, in een ruimte op 20 °C.',
        'Temperatuur telt. Staal groeit zo’n 0,0115 mm per meter per °C; aluminium twee keer zoveel. Een stalen deel van 200 mm dat je op 30 °C meet, warm uit de machine, is 0,023 mm groter dan op 20 °C: meer dan veel toleranties.\n\nDus meet op 20 °C, laat delen afkoelen, of reken het om.',
        'Typische fouten en hun gebruikelijke oorzaken. Maatverloop: gereedschapsslijtage of de machine die opwarmt. Trillingssporen (chatter): een golfpatroon door trilling, omdat het gereedschap te ver uitsteekt, de wanden dun zijn of het toerental niet klopt. Bramen: versleten gereedschap, of randen waar het gereedschap eruit loopt.\n\nSlecht oppervlak: versleten wisselplaat of te hoge voeding. Positiefouten: mal of offset. Onrondheid: opspanning.',
      ],
      example: {
        kind: 'worked',
        text: 'Een as Ø30 h6, een standaard maatklasse: hij moet tussen 29,987 en 30,000 mm meten. De operator meet hem met een micrometer direct uit de machine, op 35 °C: 29,990, binnen spec.\n\nOp 20 °C, 15 °C kouder, krimpt hij 30 × 0,0115 × 15 / 1.000 = 0,005 mm, naar 29,985: buiten spec. De klant meet op 20 °C en keurt de partij af.\n\nOplossing: meten nadat het stuk 15 minuten op een vaste plek is afgekoeld, of het meetmiddel instellen met een meesterstuk (een referentiestuk met bekende maat) op dezelfde temperatuur.',
      },
      said: 'Wat engineers zeggen: “Je hebt hem warm gemeten. Geef hem een kwartier op de plaat en hij is vijf micron kleiner, en dan is hij af.”',
      recall: [
        {
          q: 'Een aluminium deel van 500 mm wordt op 30 °C gemeten in plaats van 20 °C. Aluminium groeit 0,023 mm per meter per °C. Hoeveel groter meet het, in mm?',
          number: 0.115,
          tolerance: 0.005,
          unit: 'mm',
          why: '0,5 m × 0,023 × 10 °C = 0,115 mm.',
        },
        {
          q: 'Een gedraaid deel heeft een regelmatig golvend patroon van trillingssporen. Wat is de waarschijnlijkste oorzaak?',
          options: ['Trilling doordat het gereedschap te ver uitsteekt, of een dunne wand', 'Een verkeerde materiaalsoort', 'Te veel koeling', 'Een verkeerde tekeningrevisie'],
          answer: 'Trilling doordat het gereedschap te ver uitsteekt, of een dunne wand',
          why: 'Chatter is een trillingsprobleem: stijfheid en toerental.',
        },
        {
          q: 'Een as heeft een tolerantie van ±0,01 mm. Welk meetmiddel gebruik je bij de machine?',
          options: ['Een schuifmaat', 'Een stalen liniaal', 'Een micrometer', 'Een rolmaat'],
          answer: 'Een micrometer',
          why: 'Een micrometer leest 0,001 mm af; een schuifmaat is te grof voor ±0,01.',
        },
        {
          q: 'Wat betekent een lagere Ra-waarde?',
          options: ['Een ruwer oppervlak', 'Een gladder oppervlak', 'Een harder oppervlak', 'Een grotere diameter'],
          answer: 'Een gladder oppervlak',
          why: 'Ra is de gemiddelde ruwheid: lager is gladder.',
        },
      ],
      situation: {
        scene: 'Je bent bij een toeleverancier. De meetmachine van de klant zegt dat een boring 0,012 mm te groot is. De eigen controle van de leverancier bij de machine zegt dat hij goed is. Er gaan boze mails heen en weer.',
        ask: 'Wat vraag je om het op te lossen?',
        model: 'Bij welke temperatuur is elke meting gedaan: warm bij de machine, of in een ruimte van 20 °C? Met welk meetmiddel, en wanneer is dat voor het laatst gekalibreerd? En hebben beide partijen op dezelfde diepte en vanaf dezelfde referenties gemeten? Als we drie delen aan beide kanten onder dezelfde omstandigheden meten, kunnen de mails stoppen.',
        rubric: [
          'Vraagt naar de temperatuur bij het meten',
          'Vraagt naar de meetmiddelen en de kalibratie',
          'Stelt een gezamenlijke vergelijking onder gelijke omstandigheden voor',
        ],
      },
      sayIt: 'Leg een nieuwe kwaliteitscontroleur in 60 seconden uit waarom een onderdeel goed kan meten bij de machine en fout bij de klant.',
      terms: [
        { term: 'Ra', def: 'Gemiddelde oppervlakteruwheid in µm; lager is gladder.' },
        { term: '3D-meetmachine (CMM)', def: 'Meet punten in 3D ten opzichte van referenties.' },
        { term: 'Tolerantiekaliber', def: 'Vast meetmiddel (gaat/gaat niet) dat goed van fout scheidt zonder een getal af te lezen.' },
        { term: 'Chatter', def: 'Trilling tijdens het verspanen die een golvend patroon achterlaat.' },
      ],
    },
  ],
};

// eng.mechanics (NL): Materialen en sterkte: kracht en moment, spanning en stijfheid, vloeigrens en veiligheidsfactor, vermoeiing, materialen, warmtebehandeling.
export default {
  lessons: [
    {
      id: 'eng.mechanics.forces',
      title: 'Kracht, gewicht en moment',
      pre: [
        {
          q: 'Een kist met een massa van 100 kg hangt stil aan een haak. Hoe groot is de kracht op de haak ongeveer?',
          options: ['100 N', 'Ongeveer 1.000 N (1 kN)', '10 N', '10.000 N'],
          answer: 'Ongeveer 1.000 N (1 kN)',
          why: 'Gewicht = massa × 9,81 m/s²: 100 × 9,81 = 981 N, ongeveer 1 kN.',
        },
      ],
      teach: [
        'Kracht meet je in newton (N), massa in kilogram. Gewicht is de kracht die de zwaartekracht op een massa uitoefent: massa × 9,81 m/s². Een kist van 100 kg trekt dus met zo’n 981 N aan zijn haak; engineers ronden af naar “1 kN per 100 kg”. Tekeningen en datasheets geven belastingen in N of kN; hijsmiddelen hebben een werklast (WLL) in kg of ton.',
        'Moment (koppel) is een draaiende kracht: kracht × arm. Met 200 N duwen aan een sleutel van 0,25 m geeft 50 Nm. Verdubbel de arm en je hebt de helft van de kracht nodig voor hetzelfde moment. Bouten worden aangehaald op een moment, motoren leveren koppel, tandwielkasten ruilen toerental in voor koppel.',
        'Een onderdeel dat niet beweegt, heeft al zijn krachten en momenten in evenwicht. Met die simpele regel rekenen engineers uit wat elke steun, bout of lager draagt. Een last precies in het midden van een balk op twee steunpunten zet de helft van zijn gewicht op elke steun; schuif hem dicht naar één steun en die draagt bijna alles.',
        'Belastingen zijn er in soorten: statisch (constant, zoals een tank op zijn poten), dynamisch (wisselend, zoals een persslag of een trillende motor) en stootbelasting (een vallende last, een noodstop). Dynamische en stootbelastingen kunnen een veelvoud van het statische gewicht zijn. Zegt iemand “het weegt maar 200 kg”, vraag dan hoe het belast wordt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een motor van 50 kg hangt aan een wandconsole, met zijn zwaartepunt 0,4 m van de muur. Gewicht: 50 × 9,81 = 490 N. Het moment bij de muur: 490 N × 0,4 m = 196 Nm, en de bovenste bouten vangen dat op als trek. In een nieuw ontwerp schuift de motor naar 0,8 m: het moment verdubbelt naar 392 Nm, met dezelfde motor. Omdat de motor trilt, rekent de engineer er ook nog een factor voor de dynamische belasting bovenop. Het gewicht veranderde niet; de arm en de manier van belasten wel.',
      },
      said: 'Wat engineers zeggen: “Het is maar vijftig kilo, maar hij hangt achthonderd millimeter uit en hij trilt. Reken die bouten na.”',
      recall: [
        {
          q: 'Een last heeft een massa van 250 kg. Met g = 9,81 m/s²: wat is het gewicht, in newton?',
          number: 2452.5,
          tolerance: 10,
          unit: 'N',
          why: '250 × 9,81 = 2.452,5 N.',
        },
        {
          q: 'Een monteur duwt met 150 N aan het eind van een sleutel van 0,4 m, haaks op de sleutel. Welk moment geeft dat, in Nm?',
          number: 60,
          tolerance: 0.5,
          unit: 'Nm',
          why: 'Moment = kracht × arm = 150 × 0,4 = 60 Nm.',
        },
        {
          q: 'Een balk ligt op twee steunpunten die 2 m uit elkaar staan. Een last van 6 kN ligt precies in het midden; verwaarloos het eigen gewicht van de balk. Welke kracht draagt elk steunpunt, in kN?',
          number: 3,
          tolerance: 0.05,
          unit: 'kN',
          why: 'Een last in het midden verdeelt zich gelijk: 6 / 2 = 3 kN per steunpunt.',
        },
        {
          q: 'Een pers slaat de hele dag één keer per seconde op een onderdeel. Wat voor belasting is dat voor het persframe?',
          options: ['Statisch', 'Dynamisch', 'Geen belasting', 'Alleen een gewichtsbelasting'],
          answer: 'Dynamisch',
          why: 'De belasting verandert bij elke slag; steeds wisselende belastingen zijn dynamisch.',
        },
      ],
      situation: {
        scene: 'Je zit bij een fabriek waar onderhoud een nieuwe elektrische takel van 400 kg aan een bestaande dakligger wil hangen, “want de oude was 300 kg en dat ging ook goed”.',
        ask: 'Wat vraag je voordat hij wordt opgehangen?',
        model: 'Voor welke belasting is de ligger ontworpen, en wie heeft dat nagerekend? De takel weegt 400 kg, maar wat gaat hij daarbovenop tillen, en hoe hard kan een last afremmen of slingeren: de dynamische belasting kan flink boven het statische gewicht liggen. Waar op de ligger hangt hij: bij een steunpunt of midden in de overspanning? En wat is de werklast (WLL) van ligger en takel? Iemand die daarvoor bevoegd is moet de berekening aftekenen.',
        rubric: [
          'Vraagt naar de toelaatbare belasting van de ligger en een berekening, niet naar een vergelijking met de oude takel',
          'Telt de gehesen last en dynamische effecten mee, niet alleen het gewicht van de takel',
          'Vraagt waar in de overspanning de last hangt',
        ],
      },
      sayIt: 'Leg een productieleider in 60 seconden het verschil uit tussen massa, gewicht en moment.',
      terms: [
        { term: 'Newton (N)', def: 'Eenheid van kracht; 100 kg weegt ongeveer 1.000 N (1 kN).' },
        { term: 'Moment (koppel)', def: 'Draaiende kracht: kracht × arm, in Nm.' },
        { term: 'Werklast (WLL)', def: 'De maximale last die een hijsmiddel bij normaal gebruik mag dragen.' },
        { term: 'Dynamische belasting', def: 'Een belasting die in de tijd verandert; kan een veelvoud van het statische gewicht zijn.' },
      ],
    },
    {
      id: 'eng.mechanics.stress',
      title: 'Spanning, rek en stijfheid',
      pre: [
        {
          q: 'Twee staven met dezelfde diameter, één van staal en één van aluminium, dragen dezelfde trekkracht. Allebei blijven ze elastisch. Welke rekt het meest uit?',
          options: ['De stalen staaf', 'De aluminium staaf, ongeveer drie keer zoveel', 'Allebei evenveel', 'Geen van beide rekt uit'],
          answer: 'De aluminium staaf, ongeveer drie keer zoveel',
          why: 'Aluminium is ongeveer een derde zo stijf als staal (E zo’n 70.000 tegen 210.000 MPa).',
        },
      ],
      teach: [
        'Spanning is kracht per oppervlak: σ = F / A, in N/mm², en dat is hetzelfde als MPa. 10 kN trek op een staaf met een doorsnede van 100 mm² geeft 100 MPa. Spanning, niet kracht, bepaalt of een onderdeel bezwijkt: dezelfde kracht is onschuldig voor een dikke staaf en fataal voor een dunne.',
        'Rek is hoeveel een onderdeel uitrekt ten opzichte van zijn lengte: ε = ΔL / L. Een staaf van 1.000 mm die 0,5 mm langer wordt, heeft een rek van 0,0005. Tot een grens gedragen metalen zich als een veer: spanning = E × rek. E, de elasticiteitsmodulus, is de stijfheid van het materiaal: zo’n 210.000 MPa voor staal, 70.000 voor aluminium, 2.000 tot 3.000 voor veel kunststoffen.',
        'Stijfheid en sterkte zijn twee verschillende dingen. Stijfheid is hoeveel een onderdeel doorbuigt onder belasting; sterkte is hoeveel belasting het aankan voordat het blijvend vervormt of breekt. Hogesterktestaal is veel sterker dan constructiestaal, maar precies even stijf: dezelfde E. Buigt een frame te veel door, dan helpt een sterkere kwaliteit niet; meer materiaal of een betere vorm wel.',
        'Vorm doet er net zoveel toe als materiaal. De buigstijfheid van een balk groeit met de hoogte tot de derde macht: een balk die twee keer zo hoog is, is acht keer zo stijf. Daarom zijn liggers I-vormig, en wint een buis het van een massieve staaf met hetzelfde gewicht.',
      ],
      example: {
        kind: 'worked',
        text: 'Een stalen trekstang van Ø20 mm heeft een doorsnede van 314 mm². Hij draagt 31,4 kN: spanning = 31.400 / 314 = 100 MPa. Rek = 100 / 210.000 = 0,000476. Over zijn lengte van 2.000 mm is dat 0,95 mm uitrekking. Dezelfde stang in aluminium: 100 / 70.000 × 2.000 = 2,86 mm. Allebei zitten ze ver onder hun vloeigrens, dus allebei zijn ze sterk genoeg. Maar als de stang een machine uitgelijnd moet houden, beweegt de aluminium versie drie keer zoveel. De vraag was nooit alleen “breekt hij?”, maar ook “hoeveel beweegt hij?”',
      },
      said: 'Wat engineers zeggen: “Sterkte is het probleem niet, stijfheid wel. Hogesterktestaal helpt niks; we hebben een hoger profiel nodig.”',
      recall: [
        {
          q: 'Een staaf met een doorsnede van 400 mm² draagt een trekkracht van 20 kN. Wat is de spanning, in MPa (N/mm²)?',
          number: 50,
          tolerance: 0.5,
          unit: 'MPa',
          why: '20.000 N / 400 mm² = 50 N/mm² = 50 MPa.',
        },
        {
          q: 'Een stalen staaf (E = 210.000 MPa) van 3.000 mm lang draagt een spanning van 210 MPa en blijft elastisch. Hoeveel rekt hij uit, in mm?',
          number: 3,
          tolerance: 0.1,
          unit: 'mm',
          why: 'Rek = 210 / 210.000 = 0,001; 0,001 × 3.000 mm = 3 mm.',
        },
        {
          q: 'Een stalen machineframe buigt onder belasting te veel door, maar er breekt niks. Wat helpt?',
          options: ['Overstappen op hogesterktestaal met dezelfde afmetingen', 'Het profiel hoger maken of verstijvingen toevoegen', 'Het verven', 'De bouten harder aandraaien'],
          answer: 'Het profiel hoger maken of verstijvingen toevoegen',
          why: 'Alle staalsoorten hebben ongeveer dezelfde E; alleen meer materiaal op de goede plek maakt het stijver.',
        },
        {
          q: 'Een balk wordt twee keer zo hoog gemaakt, met dezelfde breedte en hetzelfde materiaal. Wat gebeurt er met de buigstijfheid?',
          options: ['Die verdubbelt', 'Die wordt vier keer zo groot', 'Die wordt acht keer zo groot', 'Die blijft gelijk'],
          answer: 'Die wordt acht keer zo groot',
          why: 'Buigstijfheid groeit met de hoogte tot de derde macht: 2 × 2 × 2 = 8.',
        },
      ],
      situation: {
        scene: 'Je zit bij een machinebouwer. Om gewicht te besparen stelt een engineer voor een stalen console waar een camera aan hangt te vervangen door een aluminium console met precies dezelfde afmetingen. De lijn heeft al last van trillingen.',
        ask: 'Wat vraag je?',
        model: 'Aluminium is ongeveer een derde zo stijf als staal: met dezelfde afmetingen buigt en trilt de console ongeveer drie keer zoveel. Zit die console er voor de sterkte of voor de stijfheid? Voor een camera tellen stijfheid en trillingen het zwaarst. Kan de aluminium versie een hoger of kokervormig profiel krijgen om dezelfde stijfheid te halen, en scheelt het dan nog gewicht?',
        rubric: [
          'Weet dat aluminium ongeveer een derde zo stijf is als staal',
          'Scheidt de sterktevraag van de stijfheids- en trillingsvraag',
          'Stelt een andere vorm voor om de stijfheid terug te winnen en checkt de gewichtswinst opnieuw',
        ],
      },
      sayIt: 'Leg een projectmanager in 60 seconden het verschil uit tussen stijfheid en sterkte.',
      terms: [
        { term: 'Spanning', def: 'Kracht per oppervlak, in N/mm² of MPa.' },
        { term: 'Rek', def: 'Uitrekking ten opzichte van de oorspronkelijke lengte.' },
        { term: 'Elasticiteitsmodulus (E)', def: 'De stijfheid van een materiaal: spanning gedeeld door rek in het elastische gebied.' },
        { term: 'Stijfheid en sterkte', def: 'Hoeveel een onderdeel doorbuigt, tegenover hoeveel belasting het aankan voordat het vloeit of breekt.' },
      ],
    },
    {
      id: 'eng.mechanics.strength',
      title: 'Vloeigrens, treksterkte en veiligheidsfactor',
      pre: [
        {
          q: 'Een constructiestaal heet S355. Waar staat die 355 voor?',
          options: ['Het koolstofgehalte in procent', 'Een minimale vloeigrens van 355 MPa', 'De maximale temperatuur in °C', 'Het jaartal van de norm'],
          answer: 'Een minimale vloeigrens van 355 MPa',
          why: 'Europese constructiestaalsoorten dragen hun minimale vloeigrens in de naam.',
        },
      ],
      teach: [
        'Bij een trekproef trek je een proefstaaf tot hij breekt en zet je spanning uit tegen rek. Eerst loopt de lijn recht: elastisch, de staaf veert terug. Bij de vloeigrens begint het materiaal blijvend te vervormen. De hoogste spanning die wordt gehaald is de treksterkte (UTS). Daarna snoert hij in en breekt.',
        'Ontwerpers houden de spanning onder de vloeigrens, want een onderdeel dat blijvend verbuigt, is meestal al kapot. Staalsoorten dragen hun minimale vloeigrens in de naam: S235 vloeit bij 235 MPa, S355 bij 355 MPa (bij dunne doorsneden). Boutklassen werken anders: bij 8.8 is het eerste getal × 100 de treksterkte in MPa (800), en het tweede getal × 10 de vloeigrens als percentage daarvan (80%), dus 640 MPa.',
        'Taaie materialen (de meeste staalsoorten, aluminium, koper) rekken flink uit voordat ze breken, en dat geeft een waarschuwing. Brosse materialen (gietijzer, glas, keramiek, heel hard staal) breken bijna zonder waarschuwing. Kou maakt sommige staalsoorten bros; daarom staat op materiaalcertificaten een kerfslagproef bij een temperatuur, bijvoorbeeld 27 J bij −20 °C.',
        'De veiligheidsfactor is de marge tussen sterkte en de verwachte spanning: vloeigrens gedeeld door de werkspanning. Gangbare waarden lopen van zo’n 1,5 bij goed bekende statische belastingen tot 3 of meer bij onzekere of dynamische belastingen; hijsmiddelen gebruiken vaak 4 tot 5 tegen breuk. Een veiligheidsfactor dekt het onbekende af. Het is geen reservecapaciteit voor extra belasting.',
      ],
      example: {
        kind: 'worked',
        text: 'Een console van S235 heeft een werkspanning van 120 MPa. Veiligheidsfactor: 235 / 120 = 1,96, prima bij een rustige belasting. Na een proceswijziging verdubbelt de belasting: 240 MPa, boven de vloeigrens. De console gaat blijvend verbuigen. Overstappen op S355 geeft 355 / 240 = 1,48: hij houdt het, maar de marge is krap als de belasting trilt, en dan wordt vermoeiing misschien het volgende probleem. Een dikkere console in S235, die de spanning terugbrengt naar 120 MPa, herstelt de oorspronkelijke marge. De vraag is altijd: wat is de spanning nu, en welke marge hebben we nodig voor dit soort belasting?',
      },
      said: 'Wat engineers zeggen: “Het gaat er niet om of hij breekt. Bij die belasting gaat hij vloeien, en dan is hij hoe dan ook afgekeurd.”',
      recall: [
        {
          q: 'Een onderdeel van S355 (vloeigrens 355 MPa) heeft een werkspanning van 142 MPa. Wat is de veiligheidsfactor tegen vloeien?',
          number: 2.5,
          tolerance: 0.02,
          unit: '',
          why: '355 / 142 = 2,5.',
        },
        {
          q: 'Een bout heeft klasse 10.9. Met de regel (eerste getal × 100 = treksterkte in MPa; tweede getal × 10 = vloeigrens als percentage van de treksterkte): wat is de vloeigrens, in MPa?',
          number: 900,
          tolerance: 1,
          unit: 'MPa',
          why: 'Treksterkte 10 × 100 = 1.000 MPa; vloeigrens 90% daarvan = 900 MPa.',
        },
        {
          q: 'Welk van deze materialen breekt met de minste waarschuwing?',
          options: ['Constructiestaal', 'Aluminium', 'Gietijzer', 'Koper'],
          answer: 'Gietijzer',
          why: 'Grijs gietijzer is bros: het rekt nauwelijks uit voordat het breekt.',
        },
        {
          q: 'Wat markeert de vloeigrens?',
          options: ['De spanning waarbij het onderdeel breekt', 'De spanning waarbij blijvende vervorming begint', 'De maximaal toegestane werkspanning', 'De stijfheid van het materiaal'],
          answer: 'De spanning waarbij blijvende vervorming begint',
          why: 'Onder de vloeigrens veert het materiaal terug; erboven blijft het verbogen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een voedingsfabriek. Een bout in de aandrijving van een menger is gebroken. Onderhoud heeft hem vervangen door “wat er in de la lag” en de lijn weer opgestart.',
        ask: 'Wat vraag je?',
        model: 'Welke klasse had de oorspronkelijke bout, bijvoorbeeld 8.8 of 10.9, en welke klasse zit er nu in? Een lagere klasse heeft een lagere vloeigrens en kan bij hetzelfde aanhaalmoment uitrekken of breken. Is hij aangehaald op het voorgeschreven moment? En waarom brak de eerste: overbelasting, vermoeiing door trillingen, of corrosie? Hem één op één vervangen zonder dat te weten, herhaalt misschien gewoon de breuk.',
        rubric: [
          'Vraagt naar de boutklasse van de oude en de nieuwe bout',
          'Brengt het aanhaalmoment in',
          'Vraagt waarom de eerste bout bezweek voordat het issue wordt gesloten',
        ],
      },
      sayIt: 'Leg een onderhoudsmonteur in 60 seconden uit wat de vloeigrens en een veiligheidsfactor zijn.',
      terms: [
        { term: 'Vloeigrens', def: 'De spanning waarbij blijvende vervorming begint.' },
        { term: 'Treksterkte (UTS)', def: 'De hoogste spanning die een materiaal haalt voordat het insnoert en breekt.' },
        { term: 'Taai en bros', def: 'Rekt flink uit voordat het breekt, tegenover breekt bijna zonder waarschuwing.' },
        { term: 'Veiligheidsfactor', def: 'Sterkte gedeeld door de werkspanning: de marge voor het onbekende.' },
      ],
    },
    {
      id: 'eng.mechanics.fatigue',
      title: 'Vermoeiing en kerfwerking',
      pre: [
        {
          q: 'Een as breekt na twee jaar in bedrijf. De berekende spanning lag altijd ruim onder de vloeigrens. Wat is het meest waarschijnlijke mechanisme?',
          options: ['Eén keer overbelasting', 'Vermoeiing: miljoenen lastwisselingen hebben een scheur laten groeien', 'Het staal is gesmolten', 'Alleen corrosie op de verflaag'],
          answer: 'Vermoeiing: miljoenen lastwisselingen hebben een scheur laten groeien',
          why: 'Herhaalde spanning ver onder de vloeigrens kan op den duur toch een scheur laten groeien.',
        },
      ],
      teach: [
        'De meeste mechanische storingen in machines zijn vermoeiing: een belasting die miljoenen keren terugkomt, laat een kleine scheur groeien tot het onderdeel knapt, ook al blijft de spanning ruim onder de vloeigrens. Een as op 1.500 toeren krijgt meer dan 2 miljoen lastwisselingen per dag. Een vermoeiingsbreuk laat rustlijnen zien, ringen die uitwaaieren vanaf het startpunt van de scheur, en een kleine, ruwe restbreuk.',
        'De Wöhlerkromme zet spanning uit tegen het aantal wisselingen tot breuk. Staal heeft een vermoeiingsgrens: onder ruwweg de helft van de treksterkte (bij gepolijste proefstaven) kan het eindeloos meegaan. Aluminium heeft geen echte grens: het bezwijkt uiteindelijk bij elke herhaalde spanning, dus ontwerpen geven een levensduur in wisselingen.',
        'Scheuren beginnen waar spanning zich ophoopt: scherpe hoeken, gaten, spiebanen, schroefdraad, de overgang van een las, krassen en putcorrosie. Een klein rond gat in een brede plaat verdrievoudigt plaatselijk de spanning. Een ruime afronding bij een schouder, een glad oppervlak en kogelstralen kunnen de levensduur flink verlengen.',
        'De echte vermoeiingssterkte ligt veel lager dan de waarde van een gepolijste proefstaaf: ruwe oppervlakken, grotere afmetingen, corrosie en lassen halen er allemaal wat af. Een statische berekening die zegt “sterk genoeg” bewijst dus niks voor een trillend onderdeel. Breekt een onderdeel opnieuw nadat het door een sterker exemplaar is vervangen, denk dan aan vermoeiing en vraag naar de wisselingen, de trillingen en de afrondingsstraal.',
      ],
      example: {
        kind: 'worked',
        text: 'Een roerwerkas brak in 18 maanden twee keer aan het eind van de spiebaan. Na de eerste breuk kwam er een sterkere staalsoort in; hij brak opnieuw op dezelfde plek. Het breukvlak laat rustlijnen zien die beginnen bij de scherpe hoek van de spiebaan. Twee dingen komen samen: de roerder is uit balans, dus de as buigt bij elke omwenteling heen en weer, en de scherpe hoek van de spiebaan concentreert die spanning. De oplossing: een afgeronde spiebaan, een gebalanceerde roerder en een uitlijncontrole. Alleen sterker staal hielp weinig, want hogesterktestaal is vaak juist gevoeliger voor kerven.',
      },
      said: 'Wat engineers zeggen: “Kijk die rustlijnen. Hij is begonnen in de hoek van de spiebaan. Sterker staal lost geen scherpe hoek op.”',
      recall: [
        {
          q: 'Een as draait 1.000 toeren per minuut, 16 uur per dag. Elke omwenteling is één lastwisseling. Hoeveel lastwisselingen krijgt hij per dag?',
          number: 960000,
          tolerance: 1000,
          unit: 'wisselingen/dag',
          why: '1.000 per minuut × 60 × 16 = 960.000 wisselingen per dag.',
        },
        {
          q: 'Wat laat een vermoeiingsbreukvlak meestal zien?',
          options: ['Een gladde, glanzende kegelvorm', 'Rustlijnen die uitwaaieren vanaf een startpunt, met een kleine ruwe restbreuk', 'Gesmolten metaal', 'Helemaal geen kenmerken'],
          answer: 'Rustlijnen die uitwaaieren vanaf een startpunt, met een kleine ruwe restbreuk',
          why: 'De scheur groeit stap voor stap en laat ringen achter, tot de rest in één keer breekt.',
        },
        {
          q: 'Waar op een as begint een vermoeiingsscheur het waarschijnlijkst?',
          options: ['Midden in een glad, gepolijst stuk', 'In de scherpe hoek van een spiebaan', 'In het hart van de as', 'Op het geverfde oppervlak ver van elke vormverandering'],
          answer: 'In de scherpe hoek van een spiebaan',
          why: 'Scherpe vormovergangen concentreren spanning, en daar beginnen scheuren.',
        },
        {
          q: 'Een onderdeel bezwijkt opnieuw door vermoeiing nadat het is vervangen door een sterkere kwaliteit. Wat is de beste volgende stap?',
          options: ['Een nog sterkere kwaliteit nemen', 'De kerfwerking en de trillingen verminderen: afronding, oppervlakteafwerking, balanceren', 'Het verven', 'Het vaker vervangen zonder iets te veranderen'],
          answer: 'De kerfwerking en de trillingen verminderen: afronding, oppervlakteafwerking, balanceren',
          why: 'Vermoeiing komt door herhaalde spanning bij een kerf; een van beide wegnemen werkt beter dan een sterker materiaal.',
        },
      ],
      situation: {
        scene: 'Je zit bij een verpakkingsklant. De lassen in het frame van een transportband scheuren om de paar maanden. Elke keer slijpt een lasser de scheur uit en last hem opnieuw.',
        ask: 'Wat vraag je?',
        model: 'Waar beginnen de scheuren precies: bij de overgang van de las, en steeds op dezelfde plek? Wat laat dat frame steeds weer trillen of belast het herhaaldelijk: een aandrijving, een rol uit balans, een start-stopcyclus? Hoeveel wisselingen per dag zijn dat? Opnieuw lassen zet de scheur terug op nul, maar niet de oorzaak; kunnen we de trilling verminderen, de las weghalen uit de spanningspiek, of een schot met vloeiende overgangen toevoegen?',
        rubric: [
          'Herkent steeds terugkerende scheuren bij lassen als waarschijnlijke vermoeiing',
          'Vraagt naar de bron en de frequentie van de herhaalde belasting',
          'Stelt een ontwerp- of trillingsoplossing voor in plaats van alleen opnieuw lassen',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit wat vermoeiing is, en waarom een sterker onderdeel niet altijd helpt.',
      terms: [
        { term: 'Vermoeiing', def: 'Bezwijken door een scheur die groeit onder herhaalde belasting, onder de vloeigrens.' },
        { term: 'Wöhlerkromme', def: 'Spanning uitgezet tegen het aantal wisselingen tot breuk (S-N-curve).' },
        { term: 'Vermoeiingsgrens', def: 'De spanning waaronder staal eindeloos veel wisselingen overleeft; aluminium heeft er geen.' },
        { term: 'Kerfwerking', def: 'Een plaatselijke spanningspiek bij een gat, hoek, kerf of lasovergang.' },
      ],
    },
    {
      id: 'eng.mechanics.materials',
      title: 'Veelgebruikte constructiematerialen',
      pre: [
        {
          q: 'Een stalen onderdeel weegt 3 kg. Hoeveel weegt een aluminium onderdeel met precies dezelfde vorm ongeveer?',
          options: ['3 kg', 'Ongeveer 1 kg', 'Ongeveer 2 kg', 'Ongeveer 0,3 kg'],
          answer: 'Ongeveer 1 kg',
          why: 'Aluminium (2.700 kg/m³) heeft ongeveer een derde van de dichtheid van staal (7.850 kg/m³).',
        },
      ],
      teach: [
        'Koolstofstaal is het werkpaard: sterk, stijf, goedkoop en lasbaar, met een dichtheid van zo’n 7.850 kg/m³. Meer koolstof betekent harder en sterker, maar lastiger te lassen. Het roest, dus het wordt geverfd, verzinkt of geolied. Constructiestaal zoals S235 en S355 gaat in frames; staalsoorten als C45 of 42CrMo4 in assen en tandwielen.',
        'Roestvast staal (rvs) bevat minstens zo’n 10,5% chroom, dat een dun beschermend oxidelaagje vormt. 304 (1.4301) is de gangbare soort; 316 (1.4401) bevat ook molybdeen en kan beter tegen chloriden, zoals zout en veel reinigingsmiddelen. Daarom schrijven voedings- en farmafabrieken vaak 316 voor. Rvs is duurder, lastiger te verspanen en kan in spleten toch corroderen.',
        'Aluminium weegt ongeveer een derde van staal (2.700 kg/m³) en is ongeveer een derde zo stijf. Legeringen als 6082 of 7075 kunnen in sterkte tippen aan constructiestaal. Het verspaant snel en roest niet, maar heeft geen vermoeiingsgrens, verliest sterkte bij lassen en wordt aangetast door sterk alkalische reinigers. Gietijzer is goedkoop en dempt trillingen goed, dus het zit in machinebedden, maar het is bros.',
        'Kunststoffen als PA (nylon), POM en PE-UHMW worden gebruikt voor slijtstrips en geleidingen: licht en stil, maar veel minder stijf dan metaal. Ze kruipen (vervormen langzaam) onder een constante belasting en veranderen door warmte of water. Galvanische corrosie: zet rvs tegen aluminium of zink in een natte omgeving en het minder edele metaal corrodeert snel.',
      ],
      example: {
        kind: 'worked',
        text: 'Een voedingsklant kiest het framemateriaal voor een nieuwe machine die dagelijks nat wordt gereinigd met gechloreerd schuim en soms met natronloog. Geverfd koolstofstaal: verfschilfers kunnen in het product komen, niet acceptabel in de productzone. Aluminium: licht, maar loog tast het aan. Rvs 304: gangbaar, maar chloriden in het schuim kunnen op den duur putcorrosie geven. Rvs 316: beter tegen chloriden, maar merkbaar duurder dan 304 (het verschil beweegt mee met de nikkel- en molybdeenprijs). De engineer kiest 316 in de spatzone en 304 voor de delen die ver van het product zitten.',
      },
      said: 'Wat engineers zeggen: “Met elke dag gechloreerd schuim krijg je putjes in 304 in de spatzone. Daar 316 voorschrijven, eronder is 304 prima.”',
      recall: [
        {
          q: 'Een stalen onderdeel weegt 7,85 kg. Staal heeft een dichtheid van 7.850 kg/m³, aluminium 2.700 kg/m³. Hoeveel weegt hetzelfde onderdeel in aluminium, in kg?',
          number: 2.7,
          tolerance: 0.05,
          unit: 'kg',
          why: 'Het volume is 7,85 / 7.850 = 0,001 m³; × 2.700 = 2,7 kg.',
        },
        {
          q: 'Waarom schrijven voedingsfabrieken vaak rvs 316 voor in plaats van 304?',
          options: ['316 is goedkoper', 'Het molybdeen in 316 geeft een betere bestendigheid tegen chloriden in zout en reinigingsmiddelen', '316 is magnetisch', '316 is makkelijker te lassen dan elke andere staalsoort'],
          answer: 'Het molybdeen in 316 geeft een betere bestendigheid tegen chloriden in zout en reinigingsmiddelen',
          why: 'Chloriden veroorzaken putcorrosie; molybdeen verbetert de weerstand daartegen.',
        },
        {
          q: 'Een kunststof console met een constante belasting zakt in een paar maanden langzaam door. Hoe heet dat?',
          options: ['Vermoeiing', 'Kruip', 'Corrosie', 'Vloeien'],
          answer: 'Kruip',
          why: 'Kruip is langzame vervorming onder een constante belasting, veel voorkomend bij kunststoffen.',
        },
        {
          q: 'Rvs-bouten houden buiten een aluminium frame bij elkaar. Na een jaar is het aluminium rond de bouten flink gecorrodeerd. Waarom?',
          options: ['De bouten zaten te strak', 'Galvanische corrosie: in een natte omgeving corrodeert het minder edele aluminium tegen het rvs', 'Aluminium corrodeert buiten altijd even snel', 'De rvs-bouten zijn gaan roesten'],
          answer: 'Galvanische corrosie: in een natte omgeving corrodeert het minder edele aluminium tegen het rvs',
          why: 'Twee verschillende metalen plus vocht vormen een cel; het minst edele metaal corrodeert.',
        },
      ],
      situation: {
        scene: 'Je zit bij een machinebouwer. Om gewicht en kosten te besparen wil het team het stalen frame van een nat te reinigen vulmachine in aluminium uitvoeren.',
        ask: 'Wat vraag je?',
        model: 'Welke reinigingsmiddelen gebruikt de klant? Loog tast aluminium aan, en gechloreerde middelen zijn er ook niet goed voor. Het frame wordt met hetzelfde profiel ongeveer een derde zo stijf: maakt dat uit voor trillingen en de uitlijning van de vuller? Hoe verbinden we het met rvs-delen zonder galvanische corrosie? En verzwakt het lassen de legering op de plekken waar het frame belast wordt?',
        rubric: [
          'Vraagt naar de reinigingsmiddelen en corrosie',
          'Noemt de daling in stijfheid',
          'Noemt galvanische corrosie en de sterkte bij lassen',
        ],
      },
      sayIt: 'Leg een inkoper in 60 seconden uit waarom “neem gewoon aluminium, dat is lichter” geen simpele wissel is.',
      terms: [
        { term: 'Roestvast staal (rvs)', def: 'Staal met minstens zo’n 10,5% chroom; 316 bevat molybdeen voor bestendigheid tegen chloriden.' },
        { term: 'Kruip', def: 'Langzame vervorming onder een constante belasting, vooral bij kunststoffen en hoge temperaturen.' },
        { term: 'Galvanische corrosie', def: 'Snelle corrosie van het minst edele metaal als twee verschillende metalen elkaar in een natte omgeving raken.' },
      ],
    },
    {
      id: 'eng.mechanics.heattreat',
      title: 'Hardheid en warmtebehandeling',
      pre: [
        {
          q: 'Een as van middelhard koolstofstaal wordt roodgloeiend verhit en dan in water afgeschrikt. Wat gebeurt er?',
          options: ['Hij wordt zacht en makkelijk te verspanen', 'Hij wordt heel hard en bros', 'Er verandert niks', 'Hij wordt roestvast'],
          answer: 'Hij wordt heel hard en bros',
          why: 'Snel afkoelen vanaf de hardingstemperatuur legt een harde, brosse structuur vast; daarna moet hij worden ontlaten.',
        },
      ],
      teach: [
        'Hardheid is de weerstand tegen indrukken. Drie gangbare schalen: Brinell (HB) voor zachter staal en gietwerk, Vickers (HV) voor elk materiaal en dunne lagen, Rockwell C (HRC) voor gehard staal. Constructiestaal zit rond 120 HB; gehard gereedschapsstaal op 60 HRC of meer. Hardheid loopt op met sterkte en slijtvastheid, en de meting is snel en goedkoop, dus een veelgebruikte ingangscontrole.',
        'Staal met genoeg koolstof kun je harden: verhit het tot grofweg 800 à 900 °C en schrik het snel af in water, olie of een polymeeroplossing. Het wordt heel hard en bros. Daarna wordt het ontlaten: opnieuw verwarmd tot meestal 150 à 650 °C, waarmee je wat hardheid inlevert voor taaiheid. Harden en ontlaten (veredelen) is hoe assen, tandwielen en gereedschappen hun eigenschappen krijgen.',
        'Gloeien doet het omgekeerde: langzaam afkoelen maakt staal zacht en makkelijk te verspanen of te vervormen. Spanningsarmgloeien, bij een lagere temperatuur, haalt inwendige spanningen weg na lassen of voorbewerken, zodat onderdelen later niet trekken.',
        'Oppervlakteharden geeft een harde huid op een taaie kern: inzetharden (koolstof in het oppervlak brengen, dan afschrikken), nitreren (lage temperatuur, weinig vervorming) en inductieharden (alleen het oppervlak verhitten). Tandwielen en lagerzittingen worden zo behandeld. Warmtebehandeling kan onderdelen laten vervormen, dus vaak volgt slijpen. Een tekeningnotitie als “58–62 HRC, hardingsdiepte 0,8–1,2 mm” is een eis om te controleren, geen versiering.',
      ],
      example: {
        kind: 'worked',
        text: 'Tandwielen van een nieuwe leverancier slijten binnen een paar weken. Op de tekening staat “ingezet en gehard, 58–62 HRC, hardingsdiepte 0,8–1,2 mm”. De ingangscontrole meet 48 HRC aan het oppervlak. Mogelijke oorzaken: het inzetten is overgeslagen of te kort geweest, het oppervlak heeft in de oven koolstof verloren, of het afschrikken ging te langzaam. Acties: de voorraad blokkeren, één tandwiel doorzagen en het hardheidsverloop in HV van het oppervlak naar binnen meten om de echte hardingsdiepte te zien, en de leverancier om de ovenregistratie en het warmtebehandelingscertificaat van die partij vragen.',
      },
      said: 'Wat engineers zeggen: “Op tekening 58 tot 62 HRC, wij meten 48. Dat is geen tandwiel, dat is een zacht tandwiel. Zaag er eentje door en check de hardingsdiepte.”',
      recall: [
        {
          q: 'Welke hardheidsschaal gebruik je meestal voor gehard staal?',
          options: ['Brinell (HB)', 'Rockwell C (HRC)', 'Shore A', 'Mohs'],
          answer: 'Rockwell C (HRC)',
          why: 'HRC is de standaardschaal voor gehard staal; HB voor zachter staal en gietwerk.',
        },
        {
          q: 'Waarom wordt staal na het afschrikken ontlaten?',
          options: ['Om het nog harder te maken', 'Om taaiheid terug te winnen, want afgeschrikt staal is te bros', 'Om het oppervlak schoon te maken', 'Om het roestvast te maken'],
          answer: 'Om taaiheid terug te winnen, want afgeschrikt staal is te bros',
          why: 'Ontlaten ruilt wat hardheid in voor taaiheid.',
        },
        {
          q: 'Een gelast stalen frame trekt krom nadat het is verspaand. Welke stap vóór het verspanen had dat het waarschijnlijkst voorkomen?',
          options: ['Verven', 'Spanningsarmgloeien na het lassen', 'Afschrikken in water', 'Een hardheidsmeting'],
          answer: 'Spanningsarmgloeien na het lassen',
          why: 'Lassen laat inwendige spanningen achter; verspanen laat ze los en het onderdeel trekt. Spanningsarmgloeien haalt ze eerst weg.',
        },
        {
          q: 'Welke behandeling geeft een hard oppervlak op een taaie kern?',
          options: ['Gloeien', 'Oppervlakteharden, zoals inzetharden of inductieharden', 'Spanningsarmgloeien', 'Verzinken'],
          answer: 'Oppervlakteharden, zoals inzetharden of inductieharden',
          why: 'Oppervlakteharden hardt alleen de buitenlaag, de kern blijft taai.',
        },
      ],
      situation: {
        scene: 'Je zit bij een machinebouwer. Een leverancier stelt voor de nitreerstap op een set geleidingsassen te schrappen, “om kosten en twee weken levertijd te besparen”.',
        ask: 'Wat vraag je?',
        model: 'Waarom is nitreren voorgeschreven: voor slijtvastheid, voor vermoeiingssterkte, of allebei? Welke oppervlaktehardheid en diepte vraagt de tekening, en wat hebben de assen zonder? Heeft iemand de levensduur van onbehandelde assen in deze toepassing getest? Als ze sneller slijten, wat kost een vervanging bij de klant vergeleken met de besparing? Een wijziging in de warmtebehandeling moet engineering schriftelijk goedkeuren.',
        rubric: [
          'Vraagt welke functie het nitreren heeft',
          'Vraagt naar de eis en het effect op hardheid, slijtage en levensduur',
          'Zet de besparing af tegen de kosten van eerder falen en vraagt om formele goedkeuring',
        ],
      },
      sayIt: 'Leg een inkoper in 60 seconden uit wat harden en ontlaten doen, en waarom een warmtebehandeling op een tekening ertoe doet.',
      terms: [
        { term: 'Hardheid (HB, HV, HRC)', def: 'Weerstand tegen indrukken, gemeten op de schaal van Brinell, Vickers of Rockwell C.' },
        { term: 'Harden en ontlaten', def: 'Verhitten, snel afschrikken om te harden, dan matig opnieuw verwarmen om taaiheid terug te winnen.' },
        { term: 'Gloeien en spanningsarmgloeien', def: 'Warmtebehandelingen die staal zacht maken of inwendige spanningen weghalen.' },
        { term: 'Oppervlakteharden', def: 'Alleen de buitenlaag harden: inzetharden, nitreren of inductieharden.' },
      ],
    },
  ],
};

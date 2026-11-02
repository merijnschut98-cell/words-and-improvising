// eng.maintenance (NL): Onderhoud: strategieën, MTBF/MTTR, faalpatronen, conditiemonitoring, TPM, onderhoudssysteem.
export default {
  lessons: [
    {
      id: 'eng.maintenance.strategies',
      title: 'Vier onderhoudsstrategieën',
      pre: [
        {
          q: 'Een transportbandmotor van €400 op een lijn die geen bottleneck is, valt zo’n keer per jaar uit, kost dan 15 minuten stilstand, en er ligt een reserve op de plank. Wat is de beste strategie?',
          options: ['Elk halfjaar vervangen', 'Er een draadloze trillingssensor op zetten', 'Laten draaien tot hij stuk gaat', 'Elk jaar reviseren'],
          answer: 'Laten draaien tot hij stuk gaat',
          why: 'Uitval is goedkoop, veilig en snel verholpen. Elke andere strategie kost meer dan hij oplevert.',
        },
      ],
      teach: [
        'Correctief (run-to-failure, storingsonderhoud): repareren als het stuk is. Prima als uitval goedkoop en veilig is en niet op de bottleneck zit: een armatuur, een kleine motor met een reserve op de plank. Als standaard is het duur: een ongeplande reparatie kost al snel drie tot vijf keer een geplande, door spoedonderdelen, overwerk en gemiste productie.',
        'Preventief (op tijd of gebruik): onderhouden of vervangen met een vast interval: tandwielkastolie elke 4.000 draaiuren, filters elke maand, riemen elk jaar. Werkt voor onderdelen die duidelijk slijten. Zonde als je goede onderdelen weggooit, en riskant, want elke keer dat je een machine openmaakt, kun je er een fout in brengen.',
        'Toestandsafhankelijk (condition-based): meet de conditie en grijp in als die over een grens gaat: trillingsniveau, temperatuur, slijtagedeeltjes in de olie. Predictief gaat een stap verder: je gebruikt de trend om te voorspellen wanneer die grens bereikt wordt, en plant de reparatie in een geplande stop. Dat kost sensoren en analysetijd, dus het loont op kritische, dure assets: de hoofdaandrijving van een pers, een tandwielkast op de bottleneck, een vermogenstransformator.',
        'Je kiest per asset en per faalwijze, op basis van kritikaliteit en hoe iets faalt. Die denkwijze heet RCM (reliability-centred maintenance). Goede fabrieken doen 85% of meer van hun onderhoudsuren als gepland werk. Vraag: welk deel van jullie uren was vorige maand gepland?',
      ],
      example: {
        kind: 'worked',
        text: 'Een stansbedrijf heeft twee kandidaten. De hoofdtandwielkast van de bottleneckpers: €60.000 nieuw, 10 weken levertijd. Laten draaien tot hij stuk gaat legt de fabriek wekenlang stil: geen optie. Preventief reviseren elke 2 jaar kost €25.000 en maakt een gezonde kast open. Een maandelijkse trillingsronde (€3.000 per jaar) plus elk kwartaal olieanalyse (€400 per jaar) ziet lagerschade maanden van tevoren; een lager wisselen in een gepland weekend kost €4.000. Keuze: toestandsafhankelijk. Transportbandmotoren op de inpaklijn: €400, reserves op voorraad, 15 minuten wisselen. Keuze: laten draaien tot hij stuk gaat.',
      },
      said: 'Wat engineers zeggen: “Die kast zit op de bottleneck met tien weken levertijd. Die laten we niet stukdraaien, die gaat op de trillingsronde.”',
      recall: [
        {
          q: 'Vorige maand werkte een onderhoudsteam 1.200 uur, waarvan 300 uur ongeplande storingen. Welk percentage was gepland?',
          number: 75,
          tolerance: 0.5,
          unit: '%',
          why: '(1.200 − 300) / 1.200 = 75%, onder de 85% die goede fabrieken halen.',
        },
        {
          q: 'Welk onderdeel leent zich het best voor preventief vervangen op tijd?',
          options: ['Een ingangskaart van de PLC', 'Een V-snaar die gelijkmatig slijt en rekt', 'Een frequentieregelaar', 'Een lichtscherm'],
          answer: 'Een V-snaar die gelijkmatig slijt en rekt',
          why: 'Preventief vervangen werkt als een onderdeel duidelijk slijt door gebruik.',
        },
        {
          q: 'Wanneer is laten draaien tot het stuk gaat een verstandige keuze?',
          options: ['Als de asset op de bottleneck zit', 'Als de storing iemand kan verwonden', 'Als uitval goedkoop, veilig en snel te verhelpen is', 'Als reserveonderdelen maanden levertijd hebben'],
          answer: 'Als uitval goedkoop, veilig en snel te verhelpen is',
          why: 'Dan kost het voorkomen van de storing meer dan de storing zelf.',
        },
        {
          q: 'Wat is het verschil tussen toestandsafhankelijk en predictief onderhoud?',
          options: ['Predictief gebruikt de trend om te voorspellen wanneer de grens bereikt wordt', 'Er is geen verschil', 'Toestandsafhankelijk wordt altijd door operators gedaan', 'Predictief vervangt onderdelen met een vast interval'],
          answer: 'Predictief gebruikt de trend om te voorspellen wanneer de grens bereikt wordt',
          why: 'Toestandsafhankelijk grijpt in bij een grens; predictief voorspelt die, zodat je de reparatie kunt plannen.',
        },
      ],
      situation: {
        scene: 'Je bent bij een voedingsmiddelenfabriek. De onderhoudsmanager wil draadloze trillingssensoren op alle 140 motoren, à €900 per sensor plus een softwareabonnement. “Predictief is de toekomst,” zegt hij.',
        ask: 'Wat vraag je voordat het budget naar de plantmanager gaat?',
        model: 'Welke van die 140 motoren doen ons echt pijn als ze uitvallen: welke zitten op de bottleneck of hebben geen reserve? Wat veroorzaakte vorig jaar onze stilstand, en hoeveel daarvan waren überhaupt motoren? Ik zou beginnen met de 15 meest kritische assets, daar de waarde aantonen, en de goedkope motoren met een reserve gewoon laten draaien tot ze stuk gaan.',
        rubric: [
          'Vraagt naar kritikaliteit: welke assets doen er echt toe',
          'Vraagt wat vorig jaar de stilstand werkelijk veroorzaakte',
          'Stelt voor klein te beginnen op kritische assets en de waarde te bewijzen',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden de vier onderhoudsstrategieën uit en waarom je er niet één kiest voor de hele fabriek.',
      terms: [
        { term: 'Run-to-failure', def: 'Bewust pas repareren na een storing.' },
        { term: 'Preventief onderhoud', def: 'Onderhouden of vervangen met een vast interval in tijd of gebruik.' },
        { term: 'Toestandsafhankelijk onderhoud', def: 'Ingrijpen als een gemeten conditie over een grens gaat.' },
        { term: 'RCM', def: 'Reliability-centred maintenance: per faalwijze een taak kiezen op basis van de gevolgen.' },
      ],
    },
    {
      id: 'eng.maintenance.metrics',
      title: 'MTBF, MTTR en beschikbaarheid',
      pre: [
        {
          q: 'Een machine draait 500 uur en heeft 5 storingen met in totaal 10 uur reparatie. Wat is de MTBF?',
          options: ['2 uur', '50 uur', '98 uur', '100 uur'],
          answer: '100 uur',
          why: 'MTBF = draaitijd / aantal storingen = 500 / 5 = 100 uur. Die 2 uur is de MTTR.',
        },
      ],
      teach: [
        'MTBF (mean time between failures) = totale draaitijd / aantal storingen. Het meet betrouwbaarheid: hoe vaak gaat hij stuk. MTTR (mean time to repair) = totale reparatietijd / aantal storingen. Het meet onderhoudbaarheid: hoe snel heb je hem weer draaiend.',
        'MTTR omvat alles van stilstand tot herstart: merken dat hij stilstaat, de monteur bellen, ernaartoe lopen, diagnose, het onderdeel zoeken, de reparatie zelf, testen en opstarten. Het echte sleutelwerk is vaak het kleinste stuk; wachten op mensen en onderdelen het grootste. Daar zitten de snelle winsten.',
        'Beschikbaarheid uit de twee: MTBF / (MTBF + MTTR). Met een MTBF van 40 uur en een MTTR van 2 uur is de beschikbaarheid 40 / 42 = 95,2%. Je verhoogt hem door storingen zeldzamer (MTBF omhoog) of korter (MTTR omlaag) te maken.',
        'Vraag altijd naar de definities. Telt een vastloper van 3 minuten als storing, of alleen stops boven de 10 minuten? Is draaitijd gemeten in productie-uren of kalenderuren? Micro-stops meetellen kan een MTBF van 40 uur veranderen in een van 2. En MTBF is geen levensduur: een MTBF van 10.000 uur betekent niet dat elk onderdeel 10.000 uur meegaat.',
      ],
      example: {
        kind: 'worked',
        text: 'Een vulmachine, vier weken, twee ploegen, vijf dagen: 4 × 5 × 16 = 320 geplande uren. De storingslijst toont 8 storingen boven de 10 minuten: 0,5, 1,5, 3, 0,75, 2, 0,25, 4 en 0,5 uur, samen 12,5 uur. Draaitijd 320 − 12,5 = 307,5 uur. MTBF = 307,5 / 8 = 38,4 uur. MTTR = 12,5 / 8 = 1,56 uur. Beschikbaarheid = 38,4 / (38,4 + 1,56) = 96,1%. De twee langste stops, 3 en 4 uur, waren allebei wachten op een onderdeel: 7 van de 12,5 uur, 56% van de stilstand.',
      },
      said: 'Wat engineers zeggen: “De MTTR ziet er slecht uit, maar de reparatie zelf is twintig minuten. De rest is wachten op het onderdeel uit het magazijn op de andere locatie.”',
      recall: [
        {
          q: 'Een pers draait 600 uur en heeft 12 storingen. Wat is de MTBF, in uren?',
          number: 50,
          tolerance: 0.5,
          unit: 'uur',
          why: '600 / 12 = 50 uur.',
        },
        {
          q: 'De MTBF is 50 uur en de MTTR is 2,5 uur. Wat is de beschikbaarheid, in %?',
          number: 95.2,
          tolerance: 0.2,
          unit: '%',
          why: '50 / (50 + 2,5) = 0,952.',
        },
        {
          q: 'Welke actie verlaagt de MTTR het meest direct?',
          options: ['Een langere garantie van de machinebouwer', 'De machine langzamer laten draaien', 'Een set kritische reserveonderdelen bij de machine', 'Onderdelen vaker vervangen'],
          answer: 'Een set kritische reserveonderdelen bij de machine',
          why: 'Wachten op onderdelen is vaak het grootste deel van de reparatietijd.',
        },
        {
          q: 'Een lagerleverancier noemt een MTBF van 10.000 uur. Wat betekent dat NIET?',
          options: ['Gemiddeld zitten er 10.000 draaiuren tussen storingen', 'Het is een maat voor betrouwbaarheid', 'Het hangt af van hoe je een storing definieert', 'Elk lager gaat minstens 10.000 uur mee'],
          answer: 'Elk lager gaat minstens 10.000 uur mee',
          why: 'MTBF is een gemiddelde over storingen, geen gegarandeerde levensduur.',
        },
      ],
      situation: {
        scene: 'Je bent bij een klant in de verpakkingsindustrie. Het onderhouds-KPI-bord toont een MTTR van 45 minuten, mooi groen. De operators vertellen je dat de lijn vaak uren stilstaat.',
        ask: 'Wat vraag je?',
        model: 'Wanneer start de MTTR-klok: als de machine stopt, of als de monteur er is? En wanneer stopt hij: reparatie klaar, of lijn weer goed product aan het maken? Als hij start bij aankomst, is de wachttijd onzichtbaar. Kunnen we de storingslijst van vorige maand pakken en vijf storingen meten van stop tot goed product?',
        rubric: [
          'Vraagt wanneer de MTTR-klok start en stopt',
          'Benoemt dat wachttijd mogelijk verborgen blijft',
          'Stelt voor een paar echte storingen van begin tot eind na te lopen',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit wat MTBF en MTTR zijn en hoe je daar de beschikbaarheid uit haalt.',
      terms: [
        { term: 'MTBF', def: 'Mean time between failures: draaitijd gedeeld door het aantal storingen.' },
        { term: 'MTTR', def: 'Mean time to repair: van stilstand tot weer draaien, gedeeld door het aantal storingen.' },
        { term: 'Beschikbaarheid', def: 'MTBF / (MTBF + MTTR): het deel van de tijd dat de asset kan draaien.' },
        { term: 'Storingslijst', def: 'Het overzicht van elke stop met begin, duur en oorzaak.' },
      ],
    },
    {
      id: 'eng.maintenance.failure',
      title: 'Hoe machines echt falen',
      pre: [
        {
          q: 'In de klassieke luchtvaartstudie van Nowlan en Heap: welk deel van de componenten had een duidelijke slijtageleeftijd?',
          options: ['Zo’n 90%', 'Zo’n 10–20%', 'Zo’n 60%', 'Zo’n 40%'],
          answer: 'Zo’n 10–20%',
          why: 'Maar zo’n 11% faalde door ouderdom; de meeste faalden willekeurig of vroeg in hun leven.',
        },
      ],
      teach: [
        'Het schoolboekplaatje is de badkuipkromme: veel storingen aan het begin (kindersterfte: montagefouten, slechte onderdelen), dan een lange vlakke periode met willekeurige storingen, dan oplopende slijtage. Het schoolboek suggereert dat alle apparatuur zo werkt. Dat klopt niet.',
        'Nowlan en Heap (United Airlines, 1978) vonden zes patronen. Maar zo’n 11% van de componenten sleet met de leeftijd. De andere 89% niet: 68% faalde vroeg, kort na montage of revisie, en het meeste van de rest willekeurig (gelijke kans, hoe oud ook). Latere studies bij marines en in de industrie gaven een vergelijkbaar beeld. Wat met de leeftijd slijt, is wat schuurt, snijdt of last draagt: banden, remblokken, snijgereedschap, riemen, slijtplaten. Elektronica, hydrauliek en complexe samenstellingen falen vooral willekeurig.',
        'Het gevolg: een onderdeel dat willekeurig faalt op schema vervangen, vermindert de storingen niet. Het kan ze zelfs verhogen, want elke ingreep geeft kans op kindersterfte: een verkeerd gemonteerde afdichting, vuil in de hydrauliek, een slecht uitgelijnde koppeling.',
        'Engineers checken het patroon met een Weibull-analyse van de storingshistorie. Vormfactor β onder de 1: vroege uitval; pak montage en kwaliteit aan. β rond de 1: willekeurig; gebruik conditiemonitoring of ontwerp het eruit. β boven de 1, en zeker boven de 3: slijtage; vervangen op tijd heeft zin, met een interval uit de data.',
      ],
      example: {
        kind: 'worked',
        text: 'Een verpakkingsbedrijf vervangt de lagers in alle 24 servo-assen elke 12 maanden: 24 × €750 = €18.000 per jaar. Vóór dat programma waren er 6 lagerstoringen per jaar. Erna 9, en 5 daarvan binnen twee weken na een vervanging. Een Weibull-fit op de oude data geeft β = 1,0: willekeurig falen, geen slijtage. Het bedrijf stopt de jaarlijkse wissel, zet de 6 kritische assen op een maandelijkse trillingsmeting en traint de monteurs in lagermontage. Volgend jaar: 3 storingen.',
      },
      said: 'Wat engineers zeggen: “De helft van onze storingen komt in de week na het preventief onderhoud. We voorkomen geen storingen, we veroorzaken ze.”',
      recall: [
        {
          q: 'Van de 40 pompstoringen vorig jaar gebeurden er 26 binnen drie weken na een onderhoudsingreep. Welk deel is dat, in %?',
          number: 65,
          tolerance: 0.5,
          unit: '%',
          why: '26 / 40 = 65%: een sterke aanwijzing voor storingen door onderhoud.',
        },
        {
          q: 'Een Weibull-analyse van de storingen van een onderdeel geeft β = 3,5. Wat zegt dat?',
          options: ['Kindersterfte', 'Puur willekeurig falen', 'Duidelijke slijtage, dus vervangen op tijd kan werken', 'De data is onbruikbaar'],
          answer: 'Duidelijke slijtage, dus vervangen op tijd kan werken',
          why: 'β ruim boven de 1 betekent dat de faalkans stijgt met de leeftijd.',
        },
        {
          q: 'Wat veroorzaakt meestal kindersterfte na onderhoud?',
          options: ['Montagefouten zoals slechte uitlijning of vervuiling', 'Het onderdeel dat oud wordt', 'Te veel conditiemonitoring', 'Operators die de machine te langzaam laten draaien'],
          answer: 'Montagefouten zoals slechte uitlijning of vervuiling',
          why: 'Een machine openmaken geeft kansen om iets verkeerd te monteren of vuil binnen te laten.',
        },
        {
          q: 'Wat geldt voor een onderdeel dat willekeurig faalt?',
          options: ['Je moet het vaker vervangen', 'De faalkans is ongeveer gelijk, hoe oud het ook is', 'Het geeft altijd een waarschuwing', 'Het faalt precies op zijn nominale levensduur'],
          answer: 'De faalkans is ongeveer gelijk, hoe oud het ook is',
          why: 'Willekeurige storingen hangen niet af van leeftijd, dus eerder vervangen levert niets op.',
        },
      ],
      situation: {
        scene: 'Je bent bij een waterbedrijf. Het onderhoudsplan reviseert elke pomp elke twee jaar. De pompstoringen zijn in vijf jaar niet gedaald, en het revisiebudget is €400.000 per jaar.',
        ask: 'Wat vraag je de assetmanager?',
        model: 'Wanneer gebeuren de storingen ten opzichte van de laatste revisie: vroeg, willekeurig, of tegen het eind van de twee jaar? Als ze vlak na een revisie clusteren, brengen we fouten in. Als ze gelijk verdeeld zijn, levert dat interval van twee jaar ons niets op. Kunnen we de storingsdata van de laatste vijf jaar naast de revisiedata leggen?',
        rubric: [
          'Vraagt wanneer storingen optreden ten opzichte van de laatste revisie',
          'Benoemt de mogelijkheid van storingen door onderhoud',
          'Stelt voor de storingshistorie naast de ingreepdata te analyseren',
        ],
      },
      sayIt: 'Leg een onderhoudsmanager in 60 seconden uit waarom onderdelen op schema vervangen niet altijd minder storingen geeft.',
      terms: [
        { term: 'Badkuipkromme', def: 'Vroege uitval, dan een vlakke willekeurige periode, dan slijtage; geldt maar voor een deel van de apparatuur.' },
        { term: 'Kindersterfte', def: 'Storingen kort na montage of revisie.' },
        { term: 'Willekeurig falen', def: 'Falen met ongeveer dezelfde kans op elke leeftijd.' },
        { term: 'Weibull β', def: 'Vormfactor: onder 1 vroege uitval, rond 1 willekeurig, boven 1 slijtage.' },
      ],
    },
    {
      id: 'eng.maintenance.condition',
      title: 'Conditiemonitoring',
      pre: [
        {
          q: 'Welke methode ziet een beginnend lagerdefect meestal het eerst?',
          options: ['Het lagerhuis voelen of het warm is', 'Een geluid horen', 'Trillingsanalyse', 'Rook zien'],
          answer: 'Trillingsanalyse',
          why: 'Trillingen laten lagerschade maanden eerder zien dan warmte of hoorbaar geluid.',
        },
      ],
      teach: [
        'Het P-F-interval is het kernidee. P is het punt waarop een beginnende storing meetbaar wordt; F is het moment dat hij echt faalt. Bij een lager ziet trillingsmeting schade maanden voor F; warmte en geluid komen pas dagen of uren ervoor. Je meetinterval moet korter zijn dan het P-F-interval, meestal de helft ervan, anders mis je hem.',
        'Trillingen: een sensor op de lagerhuizen. Die vindt onbalans, uitlijnfouten, losheid, lagerschade en tandwielslijtage, elk op een eigen frequentie. Niveaus zijn in mm/s RMS (de gemiddelde trillingssnelheid). Voor een middelgrote motor op een stijve fundatie legt ISO 10816-3 (nu ISO 20816-3) zo’n 2,8 mm/s neer als waarschuwing en 4,5 mm/s als actiegrens. De trend zegt meer dan één meting.',
        'Thermografie: een warmtebeeldcamera laat hotspots zien: losse elektrische verbindingen, overbelaste kabels, ongelijk belaste fasen, verstopte koelers. Schakelkasten moet je onder belasting scannen, minstens 40%. Een verbinding die meer dan 15 °C warmer is dan dezelfde verbinding op de andere fasen, vraagt snel actie.',
        'Olieanalyse: een monster uit een tandwielkast of hydraulisch aggregaat laat slijtagemetalen (ijzer, koper), deeltjes, water en viscositeit zien, vaak voordat trillingen een langzame kast zien slijten. Ultrasoon: luisteren op 20 tot 100 kHz vindt persluchtlekken, droge lagers en partiële ontladingen (kleine vonkjes in de isolatie) in middenspanningsinstallaties. Eén lek van 3 mm op 7 bar kost zo’n 4 kW compressorvermogen: €2.000 tot €5.000 per jaar als het dag en nacht lekt.',
      ],
      example: {
        kind: 'worked',
        text: 'Maandelijkse trillingsronde, koelwaterpomp op de bottleneck: januari 1,8 mm/s, februari 1,9, maart 2,6, april 3,4, en in het spectrum (de trilling uitgesplitst naar frequentie) verschijnt een lagerdefectfrequentie. De trend stijgt zo’n 0,8 mm/s per maand, dus over ongeveer zes weken gaat hij door de 4,5. De planner bestelt een lager (€350, een week levertijd) en reserveert vier uur in de geplande stop half mei. Vergelijk dat met een storing: de pomp loopt op vrijdagnacht vast en de lijn staat het grootste deel van het weekend stil.',
      },
      said: 'Wat engineers zeggen: “Van 1,9 naar 3,4 in twee maanden en je ziet de buitenringfrequentie. Bestel het lager, we wisselen hem in de stop van mei.”',
      recall: [
        {
          q: 'Het P-F-interval voor een storing in een tandwielkast is 8 weken. Om de hoeveel weken moet je volgens de vuistregel hoogstens meten?',
          number: 4,
          tolerance: 0.5,
          unit: 'weken',
          why: 'Meet op de helft van het P-F-interval, zodat je minstens één kans hebt om het te zien en tijd om te handelen.',
        },
        {
          q: 'Welke methode vindt een losse verbinding op één fase van een vermogensschakelaar in een kast?',
          options: ['Olieanalyse', 'Thermografie onder belasting', 'Trillingsanalyse', 'Visuele inspectie met de spanning eraf'],
          answer: 'Thermografie onder belasting',
          why: 'Een losse verbinding wordt warm als er stroom loopt, en dat ziet de warmtebeeldcamera.',
        },
        {
          q: 'Welke methode is de standaard om persluchtlekken te vinden?',
          options: ['Thermografie', 'Olieanalyse', 'Trillingsanalyse', 'Ultrasoon'],
          answer: 'Ultrasoon',
          why: 'Ontsnappende lucht maakt hoogfrequent geluid dat een ultrasoondetector oppikt, ook in een lawaaiige hal.',
        },
        {
          q: 'De trilling van een pomp is in twee maanden van 1,9 naar 3,4 mm/s gestegen, met zichtbare lagerfrequenties. Wat doe je?',
          options: ['Niets tot hij op 7 mm/s zit', 'Een lagerwissel inplannen in de volgende geplande stop', 'De pomp direct stilzetten', 'De alarmgrens verlagen'],
          answer: 'Een lagerwissel inplannen in de volgende geplande stop',
          why: 'Het defect is echt en loopt op, maar er is tijd om het te plannen, en daar gaat het nou juist om.',
        },
      ],
      situation: {
        scene: 'Je bent bij een fabriek na een brand in een laagspanningsverdeelkast. De plantmanager zegt: “We hebben vorig jaar nog een thermografiescan gedaan, er is niks gevonden.”',
        ask: 'Wat vraag je over die scan?',
        model: 'Is de scan gedaan onder normale belasting, of in een rustige periode of tijdens een stop? Een losse verbinding wordt pas warm als er stroom loopt. Waren de kastdeuren open, zodat de camera de verbindingen echt kon zien? En wie heeft de beelden beoordeeld, en met welke actiegrenzen?',
        rubric: [
          'Vraagt of de scan onder belasting is gedaan',
          'Vraagt of de verbindingen echt zichtbaar waren voor de camera',
          'Vraagt wie de resultaten beoordeelde en met welke criteria',
        ],
      },
      sayIt: 'Leg een monteur in 60 seconden uit wat het P-F-interval is en waarom dat bepaalt hoe vaak je meet.',
      terms: [
        { term: 'P-F-interval', def: 'Tijd tussen het moment dat een storing meetbaar wordt (P) en het echte falen (F).' },
        { term: 'Trillingsanalyse', def: 'Trillingen meten om onbalans, uitlijnfouten, losheid en lager- of tandwielschade te vinden.' },
        { term: 'Thermografie', def: 'Warmtebeelden om hotspots te vinden, vooral elektrisch.' },
        { term: 'Olieanalyse', def: 'Labonderzoek van een oliemonster op slijtagemetalen, deeltjes, water en viscositeit.' },
      ],
    },
    {
      id: 'eng.maintenance.tpm',
      title: 'TPM en autonoom onderhoud',
      pre: [
        {
          q: 'Wie doet bij TPM het dagelijkse schoonmaken, inspecteren, smeren en aandraaien van een machine?',
          options: ['De operator', 'De onderhoudsmonteur', 'Een externe partij', 'De teamleider'],
          answer: 'De operator',
          why: 'Autonoom onderhoud legt de basiszorg bij de mensen die de machine elke dag bedienen.',
        },
      ],
      teach: [
        'TPM (Total Productive Maintenance) komt uit Japan, uit de jaren zeventig (Seiichi Nakajima, Japan Institute of Plant Maintenance). Het doel: nul storingen, nul defecten, nul ongevallen, door zorg voor de machines van iedereen te maken en niet alleen van onderhoud. Je meet de voortgang met OEE. De meeste fabrieken werken met acht pijlers, waaronder autonoom onderhoud, gepland onderhoud, gericht verbeteren, kwaliteitsonderhoud en training.',
        'Autonoom onderhoud (AM): operators zijn eigenaar van de basiszorg: schoonmaken, inspecteren, smeren, aandraaien (CILT), en afwijkingen zien en labelen. Schoonmaken is inspecteren: op een schone machine zie je het olielek, de losse bout, de scheur. Het begint met een eerste grote schoonmaak waarbij elke afwijking een label krijgt.',
        'Gepland onderhoud: nu het routinewerk bij operators ligt, besteden monteurs hun tijd aan vakwerk: conditiemonitoring, de oorzaak van terugkerende storingen, de MTBF omhoog krijgen. Een gangbare verdeling: operators doen 5 tot 10 minuten controles per ploeg; monteurs lossen op wat ze vinden.',
        'De mensenkant beslist. Operators horen “extra werk, niet mijn taak”. Monteurs zijn bang hun rol te verliezen of vertrouwen operators niet met “hun” machine. Het werkt als monteurs de operators trainen, controles visueel zijn (merkstrepen op bouten, min/max op oliepeilglazen, groene zones op meters) en labels snel worden opgelost. Als labels maanden blijven hangen, sterft AM.',
      ],
      example: {
        kind: 'worked',
        text: 'Pilot op één spuitgietmachine. De eerste schoonmaak kost één ploeg en het team hangt 37 labels: 12 olielekken, 9 losse bouten, 6 ontbrekende afschermingen, 10 overig. Operators lossen er in de eerste week 21 zelf op; 16 gaan naar onderhoud, met de afspraak ze binnen 4 weken te sluiten. Een dagelijkse CILT-checklist van 8 punten kost 7 minuten bij de start van de ploeg. Na drie maanden zakken de storingen van 9 naar 4 per maand, en het bijvullen van hydraulische olie van 60 naar 15 liter per maand.',
      },
      said: 'Wat engineers zeggen: “Als de operators hem elke dag schoonmaken, zien ze het lek in week één. Wij vinden het pas als de pomp drooggelopen is.”',
      recall: [
        {
          q: 'De storingen zakken van 9 naar 4 per maand, en elke storing kostte gemiddeld 2,5 uur. Hoeveel uur stilstand bespaar je per maand?',
          number: 12.5,
          tolerance: 0.1,
          unit: 'uur',
          why: '5 storingen minder × 2,5 uur = 12,5 uur.',
        },
        {
          q: 'Waar staat CILT voor?',
          options: ['Check, Inform, Log, Track', 'Clean, Inspect, Lubricate, Tighten', 'Control, Improve, Lead, Teach', 'Clean, Isolate, Lock, Test'],
          answer: 'Clean, Inspect, Lubricate, Tighten',
          why: 'Schoonmaken, inspecteren, smeren en aandraaien: de vier basistaken die operators bij autonoom onderhoud overnemen.',
        },
        {
          q: 'Waarom zegt TPM “schoonmaken is inspecteren”?',
          options: ['Schone machines zien er beter uit bij audits', 'Vuil is de hoofdoorzaak van alle storingen', 'Schoonmaken bespaart onderhoudsuren', 'Op een schone machine zie je lekken, scheuren en losse delen'],
          answer: 'Op een schone machine zie je lekken, scheuren en losse delen',
          why: 'Met aandacht schoonmaken brengt afwijkingen vroeg aan het licht.',
        },
        {
          q: 'Wat maakt autonoom onderhoud na een goede start het vaakst kapot?',
          options: ['Labels die maanden open blijven staan', 'Te veel betrokken operators', 'Te korte checklists', 'Visueel management gebruiken'],
          answer: 'Labels die maanden open blijven staan',
          why: 'Operators stoppen met melden als er niets gebeurt met wat ze melden.',
        },
      ],
      situation: {
        scene: 'Je bent bij een klant die met TPM begint. In de kick-off zegt de teamleider onderhoud: “Operators moeten van de machines afblijven. Die maken ze kapot, en dan is het weer ons probleem.”',
        ask: 'Hoe reageer je?',
        model: 'Terechte zorg, dus laten we het zo inrichten dat jij aan het stuur zit: jij bepaalt welke controles operators doen, jij traint ze, en alles buiten de checklist blijft bij jouw team. Wat zou je willen dat ze elke ploeg voor je zien? En kunnen we afspreken hoe snel jullie de labels oppakken die ze hangen, want daar staat of valt het mee.',
        rubric: [
          'Neemt de zorg serieus in plaats van eroverheen te walsen',
          'Geeft onderhoud eigenaarschap over wat operators doen en over de training',
          'Brengt de noodzaak van snelle opvolging van labels in',
        ],
      },
      sayIt: 'Leg een operator in 60 seconden uit wat autonoom onderhoud betekent voor zijn dagelijkse werk en wat hij eraan heeft.',
      terms: [
        { term: 'TPM', def: 'Total Productive Maintenance: iedereen zorgt voor de machines, met nul storingen als doel.' },
        { term: 'Autonoom onderhoud', def: 'Operators doen de basiszorg en signaleren afwijkingen.' },
        { term: 'CILT', def: 'Clean, Inspect, Lubricate, Tighten: schoonmaken, inspecteren, smeren, aandraaien.' },
        { term: 'Label (tag)', def: 'Een kaartje aan een afwijking, zodat die wordt opgelost en gevolgd.' },
      ],
    },
    {
      id: 'eng.maintenance.cmms',
      title: 'Onderhoudssysteem, werkorders en backlog',
      pre: [
        {
          q: 'Een fabriek heeft 8 monteurs met een werkweek van 40 uur en een onderhoudsbacklog van 3.200 uur. Is dat gezond?',
          options: ['Ja, zo’n 2 weken werk', 'Ja, zo’n 4 weken werk', 'Niet te zeggen zonder de OEE', 'Nee, zo’n 10 weken werk'],
          answer: 'Nee, zo’n 10 weken werk',
          why: '3.200 / (8 × 40) = 10 weken. Twee tot vier weken is de gangbare gezonde bandbreedte.',
        },
      ],
      teach: [
        'Een CMMS (onderhoudsmanagementsysteem) is de onderhoudsdatabase: SAP PM, Maximo, en in Nederland vaak Ultimo. Het bevat het assetregister (elke machine in een boomstructuur), werkorders, preventieve plannen, reserveonderdelen en historie. De data is maar zo goed als wat monteurs erin typen.',
        'Werkorderflow: melding, goedgekeurd, gepland (taken, onderdelen, uren), ingepland (datum), uitgevoerd, afgemeld met terugkoppeling (wat gevonden, wat gedaan, hoeveel tijd), gesloten. Storingsorders worden vaak achteraf aangemaakt. Terugkoppeling als “gemaakt” of “opgelost” maakt oorzaakanalyse onmogelijk.',
        'Een kritikaliteitsanalyse scoort elke asset op veiligheid, kwaliteit, impact op output (is het de bottleneck?), kosten en redundantie, meestal in A, B en C. A krijgt conditiemonitoring en kritische reservedelen; C draait tot hij stuk gaat. Een tandwielkast van €12.000 met 14 weken levertijd leg je op voorraad als hij op de bottleneck zit. Veel magazijnen hebben miljoenen aan onderdelen liggen, waarvan een derde al jaren niet bewogen heeft.',
        'Backlog: goedgekeurd werk dat nog niet gedaan is, in uren. Deel door de uren van de ploeg per week en je hebt weken. Twee tot vier weken is gezond. Onder de twee: misschien vind je het werk niet. Boven de zes: het werk stapelt zich op en preventieve taken schuiven. Zet er de PM-compliance (PM: preventief onderhoud) naast, het deel van de preventieve taken dat op tijd gedaan is; streef naar 90% of meer.',
      ],
      example: {
        kind: 'worked',
        text: 'CMMS-rapport van een bakkerij, afgelopen kwartaal. Zes monteurs × 40 uur = 240 uur per week. Backlog 1.150 uur, dus 1.150 / 240 = 4,8 weken. PM-compliance 68%. Storingswerk is 42% van alle uren. Eén asset, de oventransportband, neemt 31% van de storingsuren. Lezing: het team is brandjes aan het blussen, preventieve taken schuiven omdat storingen de uren opeten, en de backlog groeit. Twee acties: een oorzaakteam op de oventransportband, en vier beschermde PM-uren per monteur per week.',
      },
      said: 'Wat engineers zeggen: “Onze backlog is acht weken en de PM-compliance zestig procent. We onderhouden niet, we repareren alleen nog.”',
      recall: [
        {
          q: 'De backlog is 960 uur. De ploeg is 6 monteurs met 40 uur per week. Hoeveel weken backlog is dat?',
          number: 4,
          tolerance: 0.1,
          unit: 'weken',
          why: '960 / (6 × 40) = 4 weken, aan de bovenkant van gezond.',
        },
        {
          q: 'Deze maand waren 120 preventieve taken gepland, en 84 zijn op tijd gedaan. Wat is de PM-compliance, in %?',
          number: 70,
          tolerance: 0.5,
          unit: '%',
          why: '84 / 120 = 70%, ruim onder een doel van 90%.',
        },
        {
          q: 'Welke asset krijgt waarschijnlijk kritikaliteit A?',
          options: ['De koffieautomaat in de kantine', 'Een transportband met twee reserves op voorraad', 'De bottleneckpers met 14 weken levertijd op reservedelen', 'Een reserveheftruck'],
          answer: 'De bottleneckpers met 14 weken levertijd op reservedelen',
          why: 'Uitval legt de output lang stil; grote impact en geen redundantie.',
        },
        {
          q: 'Wat maakt de storingshistorie in een CMMS bijna onbruikbaar?',
          options: ['Terugkoppeling als “gemaakt” zonder oorzaak of actie', 'Te veel werkorders', 'Een assetboom gebruiken', 'Orders op datum inplannen'],
          answer: 'Terugkoppeling als “gemaakt” zonder oorzaak of actie',
          why: 'Zonder wat er gevonden en gedaan is, vind je terugkerende storingen en hun oorzaken niet.',
        },
      ],
      situation: {
        scene: 'Je hebt stilstanddata nodig voor een project bij een metaalbedrijf. In het CMMS staat bij 70% van de storingsorders van vorig jaar alleen “gerepareerd” of “OK”.',
        ask: 'Wat doe je?',
        model: 'Ik ga niet het hele jaar analyseren. Ik ga met de werkvoorbereider zitten, pak de drie assets met de meeste storingsuren, en loop die orders door met de monteurs die ze gedaan hebben, want die weten het meestal nog. Daarna stel ik een simpele set storingscodes voor: wat faalde, waarom, wat is er gedaan, zodat de data volgend kwartaal wél voor ons werkt.',
        rubric: [
          'Beperkt de scope tot de paar assets die het meest uitmaken',
          'Gebruikt de kennis van monteurs om de gaten te vullen',
          'Stelt een eenvoudige verbetering voor de datakwaliteit voor',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit wat de onderhoudsbacklog zegt en wanneer hij zich zorgen moet maken.',
      terms: [
        { term: 'CMMS', def: 'Onderhoudsdatabase met assets, werkorders, PM-plannen, reservedelen en historie.' },
        { term: 'Werkorder', def: 'Een klus met taken, onderdelen, uren en terugkoppeling, gevolgd van melding tot afsluiting.' },
        { term: 'Backlog', def: 'Goedgekeurd onderhoudswerk dat nog niet gedaan is, vaak in weken ploegtijd.' },
        { term: 'Kritikaliteit', def: 'Rangorde (A, B, C) van hoeveel pijn uitval van een asset doet.' },
      ],
    },
  ],
};

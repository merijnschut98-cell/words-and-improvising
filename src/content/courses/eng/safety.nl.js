// eng.safety (Nederlands): veilig werken op de vloer en in het station: risico’s en maatregelen, vergrendelen en labelen, de LMRA en werk stilleggen, elektrotechnische rollen volgens NEN 3140, werkvergunningen en leren van incidenten.
export default {
  lessons: [
    {
      id: 'eng.safety.risk',
      title: 'Gevaar, risico en de arbeidshygiënische strategie',
      pre: [
        {
          q: 'Wat is het verschil tussen een gevaar en een risico?',
          options: ['Er is geen verschil', 'Een gevaar is iets wat schade kan doen; risico is hoe waarschijnlijk die schade is en hoe erg die zou zijn', 'Een risico is altijd groter dan een gevaar', 'Een gevaar is een regel; een risico is die regel overtreden'],
          answer: 'Een gevaar is iets wat schade kan doen; risico is hoe waarschijnlijk die schade is en hoe erg die zou zijn',
          why: 'Hetzelfde gevaar, zoals 400 volt, is weinig risico achter een gesloten kap en veel risico tijdens onderhoud.',
        },
        {
          q: 'Operators krijgen hoofdpijn van een oplosmiddel waarmee ze een machine schoonmaken. Welke maatregel is het sterkst?',
          options: ['Adembescherming voor de operators', 'Een bord dat waarschuwt voor de dampen', 'Overstappen op een reiniger die geen schadelijke dampen afgeeft', 'Kortere schoonmaakdiensten'],
          answer: 'Overstappen op een reiniger die geen schadelijke dampen afgeeft',
          why: 'Vervangen haalt het gevaar weg bij de bron. Borden, roosters en maskers werken alleen zolang mensen ze goed gebruiken.',
        },
      ],
      teach: [
        'Een gevaar is alles wat schade kan doen: een draaiende as, 400 volt, een heftruck, een oplosmiddel, werken op hoogte. Risico combineert hoe waarschijnlijk schade is met hoe erg die zou zijn. Een gevaar waar niemand bij in de buurt komt, is weinig risico; hetzelfde gevaar tijdens onderhoud kan veel risico zijn.',
        'In Nederland moet elke werkgever met personeel een risico-inventarisatie en -evaluatie hebben, de RI&E (Arbowet, artikel 5), met een plan van aanpak: welke maatregelen, wie en wanneer. De meeste werkgevers moeten hem laten toetsen door een gecertificeerde deskundige; kleine bedrijven die een erkend branche-instrument gebruiken, zijn daarvan vrijgesteld. Vraag er als consultant naar: je ziet erin wat de locatie zelf als grootste risico’s ziet.',
        'De arbeidshygiënische strategie (Arbowet, artikel 3), sterkste maatregel eerst: haal het gevaar weg; vervang het door iets minder gevaarlijks; technische maatregelen zoals afschermingen, beveiligingen en afzuiging; organisatorische maatregelen zoals procedures, training en borden; en als laatste persoonlijke beschermingsmiddelen (PBM). Kortom: eerst de bron, dan collectieve maatregelen, dan individuele, en PBM het laatst.',
        'Veel Nederlandse bedrijven scoren risico’s met de methode van Fine en Kinney: risico = waarschijnlijkheid × blootstelling × effect, elk op een vaste schaal. Met de score zet je risico’s op volgorde en kies je waar je eerst iets doet; hij bewijst niet dat iets veilig is. Kies daarna de sterkste maatregel die redelijkerwijs kan.',
      ],
      example: {
        kind: 'worked',
        text: 'Een maker van onderdelen. Operators maken elke dag met de hand een mengtank schoon met een oplosmiddel, van buiten de tank, en klagen over hoofdpijn. Het team loopt de strategie af. Weghalen: hoeft de tank minder vaak schoon? Deels: een schraper op de menger halveert de aanslag. Vervangen: een reiniger op waterbasis werkt voor het meeste vuil. Technisch: afzuiging bij de tankopening. Organisatorisch: een korte instructie voor de klussen waar nog oplosmiddel nodig is. PBM: adembescherming alleen bij die laatste klussen. Resultaat: het gevaar is grotendeels weg bij de bron, en het masker is de laatste verdedigingslinie, niet de eerste.',
      },
      said: 'Wat engineers zeggen: “Begin niet met handschoenen en een bordje. Kunnen we het weghalen, of er een kap op zetten?”',
      recall: [
        {
          q: 'Wat is de volgorde van de arbeidshygiënische strategie, van sterkst naar zwakst?',
          options: ['PBM, organisatorisch, technisch, vervangen, weghalen', 'Weghalen, vervangen, technische maatregelen, organisatorische maatregelen, PBM', 'Technische maatregelen, weghalen, PBM, vervangen, organisatorisch', 'Organisatorisch, PBM, weghalen, technisch, vervangen'],
          answer: 'Weghalen, vervangen, technische maatregelen, organisatorische maatregelen, PBM',
          why: 'Maatregelen bij de bron werken zonder dat iemand het goede hoeft te doen. PBM hangen af van iedereen, elke keer.',
        },
        {
          q: 'Welke van deze is een technische maatregel?',
          options: ['Een training veilig werken', 'Een waarschuwingsbord op de machine', 'Een beveiligde afscherming die de machine stopt als je hem opent', 'Een veiligheidsbril'],
          answer: 'Een beveiligde afscherming die de machine stopt als je hem opent',
          why: 'Die werkt op de machine zelf, wat de operator ook doet. Training en borden zijn organisatorisch; een bril is een PBM.',
        },
        {
          q: 'Wat is de RI&E?',
          options: ['Een vrijwillig veiligheidscertificaat', 'De wettelijk verplichte risico-inventarisatie en -evaluatie, met een plan van aanpak', 'Een formulier van de verzekeraar', 'Het rapport dat de inspectie na een ongeval schrijft'],
          answer: 'De wettelijk verplichte risico-inventarisatie en -evaluatie, met een plan van aanpak',
          why: 'Volgens artikel 5 van de Arbowet moet elke werkgever met personeel er een hebben, met een plan van wie wat wanneer doet.',
        },
        {
          q: 'Bij de methode van Fine en Kinney is de risicoscore = waarschijnlijkheid × blootstelling × effect. Een taak scoort 3 op waarschijnlijkheid, 6 op blootstelling en 15 op effect. Wat is de risicoscore? (De score heeft geen eenheid.)',
          number: 270,
          tolerance: 0.5,
          unit: '',
          why: '3 × 6 × 15 = 270. De score zet risico’s ten opzichte van elkaar op volgorde; hij zegt op zichzelf niet of de taak veilig is.',
        },
      ],
      situation: {
        scene: 'Je zit op een productiviteitsproject bij een maker van onderdelen. Een chef stelt voor om bij het omstellen de afscherming van een pers af te halen: “Dat kost elke keer vijf minuten, en onze operators zijn voorzichtig.”',
        ask: 'Hoe reageer je?',
        model: 'Ik zou nee zeggen tegen het weghalen van de afscherming: dat is een technische maatregel, en “voorzichtig zijn” is de zwakste soort maatregel. Die vijf minuten zijn wel echt, dus laten we kijken waarom de afscherming traag is. Misschien helpt een beveiligde snelsluiting, of meer van de omstelling buiten de pers voorbereiden. Ik zou de veiligheidskundige en onderhoud vragen er met ons naar te kijken.',
        rubric: [
          'Weigert de afscherming in te ruilen voor tijd',
          'Legt uit waarom voorzichtigheid zwakker is dan een afscherming',
          'Zoekt de tijdwinst ergens anders, met de juiste deskundigen',
        ],
      },
      sayIt: 'Leg een nieuwe collega in 60 seconden de arbeidshygiënische strategie uit, met één voorbeeld uit een fabriek.',
      terms: [
        { term: 'Gevaar', def: 'Alles wat schade kan doen.' },
        { term: 'Risico', def: 'Hoe waarschijnlijk schade is, gecombineerd met hoe erg die zou zijn.' },
        { term: 'RI&E', def: 'Risico-inventarisatie en -evaluatie: de wettelijk verplichte risicobeoordeling met een plan van aanpak.' },
        { term: 'Arbeidshygiënische strategie', def: 'Weghalen, vervangen, technisch, organisatorisch, PBM: de sterkste maatregel eerst.' },
      ],
    },
    {
      id: 'eng.safety.loto',
      title: 'Vergrendelen en labelen: energie scheiden',
      pre: [
        {
          q: 'Een verpakkingsmachine staat stil en de noodstop is ingedrukt. Kan een monteur nu veilig naar binnen grijpen om een opstopping weg te halen?',
          options: ['Ja, de noodstop haalt alle energie eraf', 'Nee: een noodstop is geen scheiding; de energie moet gescheiden, vergrendeld, ontladen en gecontroleerd worden', 'Ja, als een collega bij de knop blijft staan', 'Alleen als de machine is afgekoeld'],
          answer: 'Nee: een noodstop is geen scheiding; de energie moet gescheiden, vergrendeld, ontladen en gecontroleerd worden',
          why: 'Een noodstop kan door iemand anders worden teruggezet of falen, en hij haalt opgeslagen energie zoals luchtdruk of een opgeheven last er niet af.',
        },
      ],
      teach: [
        'Veel ernstige ongevallen bij onderhoud gebeuren doordat een machine onverwacht start of opgeslagen energie vrijkomt. Vergrendelen en labelen, ook wel LOTO (lockout-tagout), voorkomt dat. Een machine stoppen is iets anders dan hem scheiden: een stopknop, een noodstop of een PLC kan worden teruggezet, overbrugd of falen. De Europese norm over het voorkomen van onverwacht starten is NEN-EN-ISO 14118.',
        'Denk aan alle energie, niet alleen elektriciteit: elektrisch, pneumatisch, hydraulisch, mechanisch (veren, vliegwielen, lasten die kunnen vallen), thermisch, chemisch, en druk in leidingen. Eén machine kan er meerdere hebben. Een goed bedrijf heeft per machine een LOTO-procedure met alle scheidingspunten.',
        'De stappen: laat de betrokkenen weten wat je gaat doen; stop de machine normaal; scheid elke energiebron op zijn scheidingspunt; iedereen die eraan werkt hangt er zijn eigen slot en label op (met veel mensen een groepsslotkast); ontlaad of blokkeer opgeslagen energie, zoals druk aflaten en opgeheven delen ondersteunen; controleer dan of alles energieloos is: probeer te starten, meet, kijk op de manometers. Pas dan begin je.',
        'Alleen wie een slot heeft gehangen, haalt het eraf. Voor het opnieuw starten: gereedschap eruit, afschermingen terug, iedereen vrij. Een slot van iemand die naar huis is, gaat er alleen af volgens een strenge, schriftelijke procedure, nooit door het door te knippen. Voor werk aan elektrische installaties zelf gelden daarnaast de vijf veiligheidsregels uit NEN 3140 en NEN-EN 50110.',
      ],
      example: {
        kind: 'worked',
        text: 'Een matrijswissel op een hydraulische pers bij een maker van onderdelen. De monteur laat het de operators weten en stopt de pers met de stoter omlaag op de blokken. Hij zet de hoofdschakelaar uit en draait de persluchtkraan dicht, en hangt op allebei zijn eigen slot en label. Hij laat de hydraulische accumulator leeglopen tot de manometer 0 bar aangeeft en zet een mechanisch veiligheidsblok onder de stoter. Hij drukt op de startknop: er gebeurt niks. Hij zet de bediening terug op uit. Pas dan grijpt hij naar binnen. Na afloop: gereedschap eruit, afschermingen dicht, iedereen vrij, en hij haalt zijn eigen sloten eraf.',
      },
      said: 'Wat engineers zeggen: “Noodstop is geen vergrendeling. Slot erop, druk eraf, proberen te starten, dan pas erin.”',
      recall: [
        {
          q: 'Waarom is de noodstop indrukken niet genoeg voordat je in een machine grijpt?',
          options: ['Hij is te traag', 'Hij kan worden teruggezet of falen, en hij ontlaadt geen opgeslagen energie', 'Hij werkt alleen op nieuwe machines', 'Bij een kleine machine is het wel genoeg'],
          answer: 'Hij kan worden teruggezet of falen, en hij ontlaadt geen opgeslagen energie',
          why: 'Scheiden, een persoonlijk slot en opgeslagen energie ontladen maken de machine veilig om aan te werken.',
        },
        {
          q: 'Welke van deze is opgeslagen energie die je bij vergrendelen moet ontladen of blokkeren?',
          options: ['De kleur van de machine', 'Een persstoter die omhoog wordt gehouden door hydraulische druk', 'De productieplanning van de machine', 'Het licht in de hal'],
          answer: 'Een persstoter die omhoog wordt gehouden door hydraulische druk',
          why: 'Als de druk wegvalt of een klep verschuift, valt de stoter. Die moet je drukloos maken en mechanisch blokkeren.',
        },
        {
          q: 'Wat is de stap nadat je de energie hebt gescheiden en de opgeslagen energie hebt ontladen?',
          options: ['Meteen aan het werk', 'Controleren dat alles energieloos is: proberen te starten en de manometers checken', 'De sloten eraf halen', 'Het logboek tekenen'],
          answer: 'Controleren dat alles energieloos is: proberen te starten en de manometers checken',
          why: 'Je bewijst dat hij dood is in plaats van het aan te nemen. Een verkeerde schakelaar of een tweede bron komt hier boven.',
        },
        {
          q: 'Vier mensen werken aan een lijn die met een groepsslotkast is vergrendeld. Wie hangt er een persoonlijk slot op de slotkast?',
          options: ['Alleen de teamleider', 'Alleen degene die de lijn heeft gescheiden', 'Elk van de vier, met een eigen slot', 'Niemand, de slotkast is genoeg'],
          answer: 'Elk van de vier, met een eigen slot',
          why: 'Dan kan de lijn pas weer aan als de laatste zijn eigen slot eraf heeft gehaald.',
        },
      ],
      situation: {
        scene: 'Tijdens een gemba walk bij een levensmiddelenbedrijf zie je een monteur de noodstop van een transportband indrukken en naar binnen grijpen om een vastgelopen product eruit te trekken. “Is maar een seconde,” zegt hij. Deze opstopping gebeurt een paar keer per dienst.',
        ask: 'Wat doe je als consultant?',
        model: 'Ik zou meteen, rustig, iets zeggen: “Wacht even, kunnen we heel even stoppen?” Zelf zou ik nergens aankomen. Achteraf zou ik het bij zijn leidinggevende neerleggen als observatie, niet als klacht. De echte vraag is waarom de band zo vaak vastloopt en waarom vergrendelen te traag voelt, dus zoeken we een oplossing bij de bron, zoals een geleiderail of een veilige manier om opstoppingen weg te halen.',
        rubric: [
          'Zegt meteen iets zonder zelf iets aan te raken',
          'Legt het bij de leidinggevende neer als observatie, niet als schuld',
          'Zoekt waarom de opstopping en de shortcut ontstaan',
        ],
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit waarom een noodstop geen vergrendeling is.',
      terms: [
        { term: 'Vergrendelen en labelen', def: 'LOTO: energie scheiden en vastzetten met een slot, zodat een machine niet kan starten.' },
        { term: 'Scheidingspunt', def: 'De schakelaar of afsluiter waar een energiebron wordt afgesloten en vergrendeld.' },
        { term: 'Opgeslagen energie', def: 'Energie die na het scheiden achterblijft, zoals druk, veren of een opgeheven last.' },
        { term: 'Groepsslotkast', def: 'Een kast met de sleutels van de scheidingssloten, waar elke werker een persoonlijk slot op hangt.' },
      ],
    },
    {
      id: 'eng.safety.lmra',
      title: 'De LMRA en werk stilleggen',
      pre: [
        {
          q: 'Wat is een LMRA?',
          options: ['Een jaarlijkse veiligheidsaudit', 'Een korte check door de mensen die het werk doen, op de werkplek, vlak voordat ze beginnen', 'Een formulier dat de veiligheidskundige wekelijks invult', 'De risicobeoordeling voor een nieuw gebouw'],
          answer: 'Een korte check door de mensen die het werk doen, op de werkplek, vlak voordat ze beginnen',
          why: 'Laatste minuut risicoanalyse: de laatste check die vangt wat er veranderd is sinds de klus werd gepland.',
        },
      ],
      teach: [
        'De LMRA, de laatste minuut risicoanalyse, is een korte check op de werkplek, vlak voor de start, door de mensen die het werk gaan doen. Hij komt uit de VCA, de Nederlandse veiligheidschecklist voor aannemers. Plannen en vergunningen worden op kantoor gemaakt; de LMRA vangt wat er veranderd is: een lekkende afsluiter, iemand die boven je werkt, een andere machine dan op de werkorder staat.',
        'Vaste vragen: Weet ik wat ik moet doen en hoe? Wat kan hier en nu misgaan? Zijn de maatregelen uit de werkorder en de vergunning genomen? Heb ik het goede gereedschap en de goede PBM? Hebben anderen om mij heen er last van? Is een antwoord nee of onduidelijk, dan begin je niet.',
        'Leg het werk stil als het onveilig is. Volgens artikel 29 van de Arbowet mogen werknemers hun werk onderbreken als er naar hun redelijk oordeel ernstig en direct gevaar is, zonder loon te verliezen; ze moeten het wel meteen melden. Veel bedrijven gaan verder, met een stopregel voor iedereen, ook bezoekers en aannemers. Stoppen is niet falen; doorgaan terwijl je twijfelt wel.',
        'De valkuil is dat de LMRA een afvinklijstje wordt. Een kaartje dat in twee seconden is getekend, checkt niks. Goede teams benoemen de risico’s hardop samen, en een leidinggevende vraagt af en toe: “Wat kwamen jullie tegen?” Een stop waarvoor iemand wordt bedankt in plaats van gestraft, is wat ervoor zorgt dat mensen blijven stoppen.',
      ],
      example: {
        kind: 'worked',
        text: 'Twee onderhoudsmonteurs moeten een motor van een dakventilator vervangen. Op de werkorder staat: via de vaste ladder naar boven. Bij de ladder doen ze hun LMRA. Het heeft geregend, dus het dak is nat en glad. En ze horen een aannemer lassen op hetzelfde dak, wat niet op hun werkorder stond. Ze beginnen niet. Ze bellen de leidinggevende van de aannemer en degene die de lasvergunning heeft afgegeven, spreken af wie waar en wanneer werkt, en checken dat de dakrand bij de ventilator een leuning heeft. Een uur later beginnen ze, met de lasser aan de andere kant van het dak.',
      },
      said: 'Wat engineers zeggen: “Voordat we beginnen: wat is hier anders dan wat op de werkorder staat?”',
      recall: [
        {
          q: 'Wie doet de LMRA?',
          options: ['De veiligheidskundige, één keer per week', 'De mensen die het werk gaan doen, op de werkplek, vlak voor de start', 'De planner, bij het maken van de werkorder', 'De klant, aan het eind van de klus'],
          answer: 'De mensen die het werk gaan doen, op de werkplek, vlak voor de start',
          why: 'Alleen zij zien de echte situatie op dat moment.',
        },
        {
          q: 'Tijdens de LMRA is één antwoord onduidelijk. Wat doe je?',
          options: ['Beginnen en het in de gaten houden', 'Niet beginnen tot het duidelijk is', 'Het op het kaartje schrijven en beginnen', 'Een collega vragen eerst te beginnen'],
          answer: 'Niet beginnen tot het duidelijk is',
          why: 'Een onduidelijk antwoord is een reden om te stoppen en het uit te zoeken, niet om het risico te nemen.',
        },
        {
          q: 'Wat geeft artikel 29 van de Arbowet werknemers?',
          options: ['Het recht om elke taak te weigeren die ze niet leuk vinden', 'Het recht om het werk te onderbreken bij ernstig en direct gevaar, zonder loon te verliezen', 'Een bonus voor het melden van bijna-ongevallen', 'Het recht om de financiën van de werkgever in te zien'],
          answer: 'Het recht om het werk te onderbreken bij ernstig en direct gevaar, zonder loon te verliezen',
          why: 'Het geldt als het gevaar naar hun redelijk oordeel ernstig en direct is; ze moeten de onderbreking meteen melden.',
        },
        {
          q: 'Welk teken laat zien dat de LMRA een ritueel is geworden?',
          options: ['Het team bespreekt de risico’s hardop', 'Kaartjes worden in een paar seconden getekend zonder dat iemand het over risico’s heeft', 'Een leidinggevende vraagt wat ze tegenkwamen', 'Na de LMRA wordt het werk soms stilgelegd'],
          answer: 'Kaartjes worden in een paar seconden getekend zonder dat iemand het over risico’s heeft',
          why: 'Een handtekening zonder nadenken checkt niks. De andere drie zijn tekenen dat het werkt.',
        },
      ],
      situation: {
        scene: 'Bij een netbeheerder meet je hoeveel tijd ploegen per klus kwijt zijn. Je ziet dat een ploeg bij de deur van een station de LMRA overslaat. De ploegleider knipoogt: “Scheelt vijf minuten. Je zit ons toch te meten?”',
        ask: 'Wat doe je?',
        model: 'Ik zou hem meteen zeggen dat ik niet wil dat iemand door mijn metingen de LMRA overslaat: die hoort bij de klus, en zo neem ik hem ook mee. Ik zou vragen hem nu te doen, voordat ze naar binnen gaan. Achteraf zou ik het bij mijn sponsor melden en de manier aanpassen waarop ik de meting presenteer, zodat geen ploeg het gevoel krijgt dat veiligheidsstappen hen traag laten lijken.',
        rubric: [
          'Vraagt de ploeg de LMRA te doen voordat ze verdergaan',
          'Maakt duidelijk dat de LMRA bij de klus hoort',
          'Past de meting aan zodat die mensen niet aanzet tot het overslaan van veiligheidsstappen',
        ],
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit wat een LMRA is en waarom iedereen onveilig werk mag stilleggen.',
      terms: [
        { term: 'LMRA', def: 'Laatste minuut risicoanalyse: een korte check op de werkplek door de mensen die het werk doen, vlak voor de start.' },
        { term: 'VCA', def: 'De Nederlandse veiligheidschecklist en certificering voor aannemers.' },
        { term: 'Werkonderbreking', def: 'Het recht om het werk stil te leggen bij ernstig gevaar (Arbowet artikel 29); veel bedrijven geven dat aan iedereen.' },
      ],
    },
    {
      id: 'eng.safety.nen3140',
      title: 'Elektrisch werk: rollen, en waarom jij nergens aankomt',
      pre: [
        {
          q: 'Tijdens een bezoek nodigt een engineer je uit om een kast in een laagspanningsinstallatie open te doen en naar de bedrading te kijken. Wat doe je?',
          options: ['Hem zelf voorzichtig opendoen', 'Bedanken: je bent een leek; een bevoegd persoon doet hem open en jij kijkt mee vanaf de plek die hij aanwijst', 'Hem opendoen met handschoenen aan', 'Hem opendoen als de hoofdschakelaar uit staat'],
          answer: 'Bedanken: je bent een leek; een bevoegd persoon doet hem open en jij kijkt mee vanaf de plek die hij aanwijst',
          why: 'Handschoenen of een uitgeschakelde hoofdschakelaar maken je niet vakbekwaam of aangewezen. Jouw werk is kijken en vragen, niet aanraken.',
        },
      ],
      teach: [
        'NEN 3140 is de Nederlandse norm voor veilige bedrijfsvoering van en werken aan laagspanningsinstallaties, tot 1.000 V wisselspanning; NEN 3840 doet hetzelfde daarboven, voor hoogspanning. Beide bouwen op de Europese NEN-EN 50110. De wettelijke plicht komt uit het Arbobesluit; deze normen volgen is de geaccepteerde manier om daaraan te voldoen.',
        'De rollen. De installatieverantwoordelijke (IV) is verantwoordelijk voor de veilige bedrijfsvoering van de installatie. De werkverantwoordelijke (WV) leidt een bepaalde klus ter plaatse. Een vakbekwaam persoon (VP) heeft de opleiding en ervaring om de elektrische risico’s van het werk te beoordelen. Een voldoende onderricht persoon (VOP) is geïnstrueerd voor bepaalde, afgebakende taken. Alle anderen zijn leek.',
        'De aanwijzing telt. De werkgever wijst mensen schriftelijk aan voor een rol en een reikwijdte. Kunde alleen geeft je niet het recht om aan een installatie te werken; de schriftelijke aanwijzing wel. Daarom hoor je ook wel “AVP”, aangewezen vakbekwaam persoon. Vraag vóór elk werk in de buurt van een installatie: wie is hier de IV, en wie is de WV voor deze klus?',
        'Als consultant ben je een leek. Je gaat alleen een schakelruimte of station in met een bevoegd persoon, je staat waar hij zegt, en je komt nergens aan: geen deuren, geen schakelaars, geen kappen, geen uitgeschakelde automaat terugzetten. Dat is geen bescheidenheid; zo voorkom je elektrocutie en vlambogen. Je waarde zit in je vragen, niet in je handen.',
      ],
      example: {
        kind: 'worked',
        text: 'Een consultant bij een netbeheerder wil de tijd opnemen van een kabelreparatie bij een netstation. Een dag van tevoren vraagt ze de planner wie de WV van de klus is en belt ze hem: mag ze meekijken, en wat heeft ze nodig? Ter plaatse geeft de WV haar instructie: ze blijft buiten het afgezette gebied, draagt de helm en de vlamboogwerende kleding die hij haar geeft, en komt nergens aan. De ploeg schakelt de kabel vrij, vergrendelt en aardt hem volgens een schakelprogramma dat de IV heeft goedgekeurd. Zij noteert tijden en stelt haar vragen in de pauzes, niet tijdens het schakelen.',
      },
      said: 'Wat engineers zeggen: “Wie is de WV op deze klus? Dan vraag ik hem waar jij kunt staan.”',
      recall: [
        {
          q: 'Welke norm gaat in Nederland over de veilige bedrijfsvoering van hoogspanningsinstallaties, boven 1.000 V wisselspanning?',
          options: ['NEN 3140', 'NEN 3840', 'NEN 1010', 'VCA'],
          answer: 'NEN 3840',
          why: 'NEN 3140 gaat over laagspanning tot 1.000 V wisselspanning; NEN 3840 over hoogspanning daarboven. NEN 1010 gaat over het ontwerpen en aanleggen van laagspanningsinstallaties.',
        },
        {
          q: 'Wie leidt een bepaalde elektrotechnische klus ter plaatse?',
          options: ['De installatieverantwoordelijke (IV)', 'De werkverantwoordelijke (WV)', 'De voldoende onderricht persoon (VOP)', 'De veiligheidskundige'],
          answer: 'De werkverantwoordelijke (WV)',
          why: 'De IV is verantwoordelijk voor de installatie als geheel; de WV leidt het werk op de plek waar het gebeurt.',
        },
        {
          q: 'Een monteur is vakkundig, maar heeft geen schriftelijke aanwijzing van de werkgever voor deze installatie. Mag hij er als VP aan werken?',
          options: ['Ja, kunde is wat telt', 'Nee: de schriftelijke aanwijzing voor die rol en reikwijdte is nodig', 'Ja, als een collega het goedvindt', 'Ja, als hij een VCA-diploma heeft'],
          answer: 'Nee: de schriftelijke aanwijzing voor die rol en reikwijdte is nodig',
          why: 'De aanwijzing maakt hem VP voor dat werk, niet zijn kunde alleen.',
        },
        {
          q: 'Wat is het verschil tussen een VP en een VOP?',
          options: ['Er is geen verschil', 'Een VP kan de elektrische risico’s van het werk beoordelen; een VOP is geïnstrueerd voor bepaalde, afgebakende taken', 'Een VOP staat hoger dan een VP', 'Een VP werkt alleen aan hoogspanning'],
          answer: 'Een VP kan de elektrische risico’s van het werk beoordelen; een VOP is geïnstrueerd voor bepaalde, afgebakende taken',
          why: 'Een VOP doet een vaste taak goed; een VP kan een situatie beoordelen die niet standaard is.',
        },
      ],
      situation: {
        scene: 'Bij een maker van onderdelen valt een lijn stil omdat een automaat in een verdeelkast is uitgeschakeld. De productiemanager heeft haast en zegt tegen jou: “Jij staat ernaast. Zet hem even terug, dat doet iedereen.”',
        ask: 'Wat doe je?',
        model: 'Ik zou er niet aankomen. Ik zou zeggen: “Daar ben ik niet voor aangewezen, en een automaat slaat niet voor niks af. Wie is de elektricien van dienst?” Dan help ik die persoon zo snel mogelijk te vinden. Achteraf zou ik voorstellen te kijken waarom de automaat afslaat en wie er per dienst voor is aangewezen, zodat de productie de volgende keer niet zo lang hoeft te wachten.',
        rubric: [
          'Weigert de kast aan te raken',
          'Benoemt dat een afgeslagen automaat een oorzaak heeft en een bevoegd persoon vraagt',
          'Helpt de juiste persoon te vinden en stelt een structurele oplossing voor',
        ],
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit wie wat doet bij elektrisch werk volgens NEN 3140, en wat een leek mag.',
      terms: [
        { term: 'IV', def: 'Installatieverantwoordelijke: verantwoordelijk voor de veilige bedrijfsvoering van de installatie.' },
        { term: 'WV', def: 'Werkverantwoordelijke: leidt een bepaalde elektrotechnische klus ter plaatse.' },
        { term: 'VP en VOP', def: 'Vakbekwaam persoon (kan de risico’s beoordelen) en voldoende onderricht persoon (geïnstrueerd voor afgebakende taken).' },
        { term: 'Aanwijzing', def: 'De schriftelijke aanwijzing door de werkgever voor een rol en reikwijdte; zonder die geen elektrisch werk.' },
      ],
    },
    {
      id: 'eng.safety.permit',
      title: 'De werkvergunning',
      pre: [
        {
          q: 'Voor welke klus in een fabriek is het meest waarschijnlijk een schriftelijke werkvergunning nodig?',
          options: ['Een printercartridge vervangen', 'Lassen naast een tank waar een brandbare vloeistof in heeft gezeten', 'Met een bezoekershesje over de productievloer lopen', 'Een werkinstructie bijwerken'],
          answer: 'Lassen naast een tank waar een brandbare vloeistof in heeft gezeten',
          why: 'Heet werk bij brandbare resten is niet-routinematig en kan brand of een explosie veroorzaken, en daar zijn vergunningen precies voor.',
        },
      ],
      teach: [
        'Een werkvergunning is een schriftelijk systeem voor niet-routinematig werk met een hoog risico: heet werk zoals lassen, slijpen en snijden; een besloten ruimte zoals een tank in; werken op hoogte; leidingen of vaten met procesmedia openen; en graven bij kabels. Hij zorgt ervoor dat de gevaren bekend zijn, het gebied klaar is, en iedereen weet wie de leiding heeft.',
        'Wat er op een werkvergunning staat: de precieze klus en plek; de gevaren; de scheidingen, met verwijzing naar de vergrendeling; metingen die moeten gebeuren, zoals een gasmeting voordat iemand een tank in gaat; de PBM; hoe lang hij geldig is; en handtekeningen. De afgever, vaak van de operatie, bevestigt dat het gebied klaar is. De houder, de ploegleider, neemt hem aan en geeft zijn ploeg instructie.',
        'Bij overdracht en afsluiten gaat het mis. Bij een dienstwissel wordt de vergunning persoonlijk overgedragen. Is het werk klaar, dan geeft de houder hem terug, controleert de afgever het gebied, en pas dan gaan de scheidingen eraf. Op Piper Alpha kwamen in 1988 167 mensen om nadat een pomp weer was gestart terwijl zijn veiligheidsklep voor onderhoud was verwijderd; de vergunning voor dat werk was bij de dienstwissel niet doorgegeven.',
        'Een werkvergunning vervangt de LMRA niet: de vergunning legt het plan vast, de LMRA checkt het ter plaatse. En klussen in hetzelfde gebied moeten op elkaar worden afgestemd. Twee vergunningen die elk op zich kloppen, kunnen samen een gevaar opleveren dat niemand zag aankomen, zoals lassen naast een tank die iemand anders aan het openen is.',
      ],
      example: {
        kind: 'worked',
        text: 'Heet werk bij een maker van onderdelen: een beugel lassen aan een stalen bordes boven een hydraulisch aggregaat. De afgever van productie en de ploegleider van de lassers lopen samen het gebied door. Op de vergunning staat: brandbaar materiaal weggehaald of afgedekt binnen de afstand uit de bedrijfsregel; het aggregaat afgedekt met een blusdeken; een blusser binnen handbereik; een brandwacht tijdens het werk en de vastgestelde tijd erna, omdat smeulende branden later kunnen ontstaan; geldig vandaag van 8.00 tot 16.00 uur. Allebei tekenen. Om 14.30 uur is de klus klaar: de ploegleider geeft de vergunning terug, de brandwacht blijft, en de afgever sluit hem af nadat hij het gebied heeft gecontroleerd.',
      },
      said: 'Wat engineers zeggen: “Is de vergunning getekend, en wie is de afgever als er iets verandert?”',
      recall: [
        {
          q: 'Wie bevestigt op een werkvergunning dat het gebied klaar is voor de klus?',
          options: ['De houder, de ploegleider', 'De afgever, vaak van de operatie', 'De inkoopafdeling van de klant', 'Iedereen uit de ploeg'],
          answer: 'De afgever, vaak van de operatie',
          why: 'De afgever gaat over het gebied en de scheidingen; de houder neemt de vergunning aan en geeft de ploeg instructie.',
        },
        {
          q: 'Op welke momenten gaan vergunningsystemen het vaakst mis?',
          options: ['Als de vergunning wordt geprint', 'Bij de dienstwissel en bij het teruggeven van de vergunning', 'Bij het uitdelen van de PBM', 'Tijdens de lunchpauze'],
          answer: 'Bij de dienstwissel en bij het teruggeven van de vergunning',
          why: 'Informatie raakt kwijt tussen mensen. Piper Alpha is het klassieke voorbeeld van een vergunning die bij de dienstwissel niet werd doorgegeven.',
        },
        {
          q: 'Waarom blijft een brandwacht na heet werk nog een vastgestelde tijd?',
          options: ['Om het gebied op te ruimen', 'Omdat smeulend materiaal vlam kan vatten nadat het lassen is gestopt', 'Om de vergunning in te vullen', 'Omdat de lasser pauze nodig heeft'],
          answer: 'Omdat smeulend materiaal vlam kan vatten nadat het lassen is gestopt',
          why: 'Vonken kunnen op verborgen plekken terechtkomen en pas later een brand veroorzaken.',
        },
        {
          q: 'Welke meting staat meestal op de vergunning voordat iemand een tank in gaat?',
          options: ['Een geluidsmeting', 'Een gasmeting', 'Een trillingsmeting', 'Een oogtest'],
          answer: 'Een gasmeting',
          why: 'In een besloten ruimte kan te weinig zuurstof zijn, of brandbaar of giftig gas, en dat zie of ruik je niet betrouwbaar.',
        },
      ],
      situation: {
        scene: 'Je kijkt mee met een onderhoudsploeg bij een maker van onderdelen. Om 14.50 uur zegt de ploegleider: “De vergunning loopt om 15.00 uur af, maar we zijn bijna klaar. We maken het gewoon af.”',
        ask: 'Wat zeg je?',
        model: 'Het is niet aan mij om het toe te staan of te verbieden, maar ik zou hem vragen: “Zullen we de afgever bellen om hem te verlengen? Dat is een telefoontje van twee minuten.” Gaat hij toch door, dan meld ik het bij zijn leidinggevende. Een verlopen vergunning betekent dat niemand meer heeft bevestigd dat het gebied veilig is, bijvoorbeeld of er ondertussen in de buurt een andere klus is begonnen.',
        rubric: [
          'Accepteert niet dat er op een verlopen vergunning wordt doorgewerkt',
          'Stelt de snelle, juiste route voor: de afgever verlengt hem',
          'Legt uit wat een verlopen vergunning niet meer garandeert',
        ],
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit wat een werkvergunning is en waar het meestal misgaat.',
      terms: [
        { term: 'Werkvergunning', def: 'Schriftelijke toestemming voor niet-routinematig werk met een hoog risico, met gevaren, scheidingen en handtekeningen.' },
        { term: 'Heet werk', def: 'Lassen, slijpen of snijden: werk dat brand kan veroorzaken.' },
        { term: 'Afgever en houder', def: 'De afgever bevestigt dat het gebied klaar is; de houder neemt de vergunning aan en geeft de ploeg instructie.' },
      ],
    },
    {
      id: 'eng.safety.incidents',
      title: 'Bijna-ongevallen en leren zonder schuld',
      pre: [
        {
          q: 'De piramide van Heinrich uit 1931 suggereert een vaste verhouding tussen kleine en ernstige ongevallen. Wat heeft later onderzoek laten zien?',
          options: ['De verhouding is overal precies hetzelfde', 'Minder kleine letsels betekent niet vanzelf minder ernstige of dodelijke ongevallen; die hebben vaak andere oorzaken', 'Kleine letsels doen er helemaal niet toe', 'Ernstige ongevallen zijn puur toeval'],
          answer: 'Minder kleine letsels betekent niet vanzelf minder ernstige of dodelijke ongevallen; die hebben vaak andere oorzaken',
          why: 'Snijwonden en verstuikingen komen uit andere situaties dan vallen, beknelling of explosies. Naar de ernstige moet je apart kijken.',
        },
      ],
      teach: [
        'Een bijna-ongeval is een gebeurtenis die schade had kunnen doen maar dat niet deed: een pallet die valt waar toevallig niemand stond. Bijna-ongevallen melden levert je gratis lessen op. Heinrich (1931) tekende een piramide: op elk ernstig letsel 29 lichte en 300 voorvallen zonder letsel. Bird publiceerde later 1 : 10 : 30 : 600.',
        'De grenzen: de verhoudingen verschillen enorm, en ernstige en dodelijke ongevallen hebben vaak andere oorzaken dan snijwonden en verstuikingen. De BP-raffinaderij in Texas City, waar in 2005 15 mensen omkwamen, had goede cijfers voor persoonlijk letsel. Kijk dus apart naar wat ernstige schade kan doen: vrijkomende energie, werken op hoogte, voertuigen, falende scheidingen.',
        'Leren zonder schuld. Bij de meeste incidenten zijn gewone mensen betrokken in een systeem dat de fout makkelijk maakte: slecht ontwerp, tijdsdruk, onduidelijke procedures. Een just culture (James Reason, Sidney Dekker) maakt onderscheid tussen eerlijke fouten, waar je van leert, en roekeloos gedrag, dat gevolgen heeft. Straf je mensen voor melden, dan stoppen de meldingen, en blijven de risico’s.',
        'De wet: de werkgever moet een arbeidsongeval met dodelijke afloop, blijvend letsel of een ziekenhuisopname direct melden bij de Nederlandse Arbeidsinspectie (Arbowet, artikel 9), en een register bijhouden van ongevallen die tot meer dan drie werkdagen verzuim leidden. Binnen het bedrijf: zorg voor de mensen, stel de plek veilig, onderzoek het samen met de betrokkenen, pas het systeem aan, en deel wat je hebt geleerd.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een maker van onderdelen raakt een achteruitrijdende heftruck bijna een planner op de hoek van een magazijnpad. Zij meldt het. De veiligheidskundige vraagt niet “wie lette er niet op?”, maar loopt met haar en de chauffeur naar de plek. Ze zien een blinde hoek; de stellingen zijn vorige maand verplaatst; en het gemarkeerde looppad gaat met een grote omweg, dus mensen nemen de kortste route. De oplossingen: een fysieke afscheiding, een gemarkeerde oversteek op de hoek, een spiegel, en het looppad langs de kortste route. De planner hoort wat er veranderd is, en de week erna komen er nog twee meldingen van bijna-ongevallen binnen.',
      },
      said: 'Wat engineers zeggen: “Goed dat je het meldt. Laten we gaan kijken waar het gebeurde.”',
      recall: [
        {
          q: 'Wat is een bijna-ongeval?',
          options: ['Een ongeval met licht letsel', 'Een gebeurtenis die schade had kunnen doen maar dat niet deed', 'Een veiligheidsinspectie zonder bevindingen', 'Een te late levering'],
          answer: 'Een gebeurtenis die schade had kunnen doen maar dat niet deed',
          why: 'Het bevat dezelfde lessen als een ongeval, zonder dat er iemand gewond raakt.',
        },
        {
          q: 'Waarom bewijzen lage cijfers voor licht letsel niet dat er geen ernstige ongevallen gaan gebeuren?',
          options: ['Omdat licht letsel niet wordt geregistreerd', 'Omdat ernstige en dodelijke ongevallen vaak andere oorzaken hebben dan lichte', 'Omdat de cijfers altijd fout zijn', 'Omdat ernstige ongevallen niet te voorkomen zijn'],
          answer: 'Omdat ernstige en dodelijke ongevallen vaak andere oorzaken hebben dan lichte',
          why: 'Texas City had goede cijfers voor persoonlijk letsel. Ernstige risico’s vragen hun eigen aandacht.',
        },
        {
          q: 'Welk arbeidsongeval moet een werkgever in Nederland direct melden bij de Nederlandse Arbeidsinspectie?',
          options: ['Elk ongeval, ook een schram', 'Een ongeval met dodelijke afloop, blijvend letsel of een ziekenhuisopname', 'Alleen ongevallen met aannemers', 'Alleen dodelijke ongevallen'],
          answer: 'Een ongeval met dodelijke afloop, blijvend letsel of een ziekenhuisopname',
          why: 'Dat is de meldplicht uit artikel 9 van de Arbowet.',
        },
        {
          q: 'Wat doet een just culture?',
          options: ['Nooit iemand verantwoordelijk houden', 'Onderscheid maken tussen eerlijke fouten, om van te leren, en roekeloos gedrag, dat gevolgen heeft', 'Elke fout straffen als voorbeeld voor de rest', 'Incidenten aan HR overlaten'],
          answer: 'Onderscheid maken tussen eerlijke fouten, om van te leren, en roekeloos gedrag, dat gevolgen heeft',
          why: 'Mensen blijven melden als eerlijke fouten niet worden gestraft, terwijl roekeloos gedrag wel wordt aangepakt.',
        },
      ],
      situation: {
        scene: 'De plantmanager van een maker van onderdelen wil bij de ingang een groot scherm met “dagen zonder verzuimongeval”, en een teambonus bij 100 dagen. Hij vraagt wat jij ervan vindt.',
        ask: 'Wat adviseer je?',
        model: 'Ik zou zeggen dat ik het goed vind dat hij veiligheid zichtbaar wil maken, maar dat een bonus op dagen zonder ongeval ertoe kan leiden dat mensen niet meer melden, of gewond aan het werk blijven. Ik zou op het scherm zetten wat actief veiligheidswerk laat zien: gemelde bijna-ongevallen, afgeronde acties, en de voortgang op de ernstige risico’s zoals heftrucks en vergrendelen. En ik zou een beloning nooit aan het aantal ongevallen zelf koppelen.',
        rubric: [
          'Waardeert de bedoeling om veiligheid zichtbaar te maken',
          'Legt uit hoe een bonus op dagen zonder ongeval incidenten kan verbergen',
          'Stelt maatstaven voor die leren en ernstige risico’s laten zien',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom bijna-ongevallen ertoe doen en waarom mensen de schuld geven een bedrijf minder veilig maakt.',
      terms: [
        { term: 'Bijna-ongeval', def: 'Een gebeurtenis die schade had kunnen doen maar dat niet deed.' },
        { term: 'Just culture', def: 'Leren van eerlijke fouten, terwijl roekeloos gedrag wel gevolgen heeft.' },
        { term: 'Meldplicht', def: 'Volgens Arbowet artikel 9: dodelijk ongeval, blijvend letsel of ziekenhuisopname direct melden bij de inspectie.' },
      ],
    },
  ],
};

// pm.plan (Nederlands): plannen, van een doel naar een plan waar mensen in geloven: opdeling, schattingen, planning, risico’s, rollen en werkwijze.
export default {
  lessons: [
    {
      id: 'pm.plan.wbs',
      title: 'Het werk opdelen',
      pre: [
        {
          q: 'Wat is de beste eerste regel in de opdeling van een project om afgezegde klussen bij een netbeheerder terug te dringen?',
          options: ['“Data analyseren”', '“Week 1: kick-off”', '“Nulmeting van afzeggingen per oorzaak, afgestemd met de planningsmanager”', '“Workshops houden”'],
          answer: '“Nulmeting van afzeggingen per oorzaak, afgestemd met de planningsmanager”',
          why: 'Begin bij resultaten, dingen die er straks zijn en die je kunt controleren, niet bij activiteiten.',
        },
      ],
      teach: [
        'Begin bij de resultaten, niet bij de activiteiten. Een resultaat (deliverable) is iets wat er aan het eind is en wat iemand kan controleren: “een nulmeting van afzeggingen per oorzaak”, “een gereedheidscheck waar de planners mee akkoord zijn”, “een pilot van zes weken in één regio”.\n\nVraag: “Als dit project klaar is, wat is er dan wat er nu niet is?” Schrijf er vier tot zeven op. Activiteiten komen later, eronder.',
        'Deel elk resultaat daarna op in werkpakketten: stukken die één persoon of een klein team kan doen en afmaken. De 8–80-regel: een pakket kleiner dan ongeveer 8 uur is micromanagement, groter dan ongeveer 80 uur verbergt verrassingen en kun je niet volgen. Elk pakket krijgt een werkwoord, een eigenaar en een “klaar als”: “3 maanden afzeggingen indelen per oorzaak, klaar als de planningsmanager akkoord is met de categorieën.”',
        'Maak de opdeling samen met de mensen die het werk gaan doen, niet alleen achter je laptop. Post-its op de muur, één resultaat per kolom, 60 minuten.\n\nMensen committeren zich aan wat ze zelf hebben helpen opdelen. En ze zien de pakketten die jij vergat, zoals toegang tot data, de OR of het trainen van de nachtploeg.',
        'Weerstand klinkt als: “Al dat plannen hebben we niet nodig, laten we gewoon beginnen.” Antwoord: “Eens, we beginnen deze week. Geef me één uur om te zien waar we ja tegen zeggen, zodat we in maand twee niet verrast worden.” Snap je het technische werk niet, vraag de expert dan: “Wat moet er af zijn voordat jij hieraan kunt beginnen?” en “Wat zou jij als eerste opleveren?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder is het doel om afzeggingen van geplande MS-klussen in de laatste week binnen zes maanden van 18% naar onder de 8% te krijgen. Met twee planners en een teamleider zet je vier resultaten op de muur: (1) nulmeting van afzeggingen per oorzaak, (2) een gereedheidscheck afgestemd met planning en het bedrijfsvoeringscentrum, (3) een pilot van zes weken in één regio, (4) overdracht aan alle regionale planners.\n\nOnder (1): “3 maanden afzeggingen uit het planningssysteem halen” (16 uur, de data-analist), “indelen per oorzaak met twee planners” (12 uur), “bespreken met de planningsmanager” (4 uur). Onder (3) voegt iemand “schakelmonteurs briefen” toe, die was je vergeten.',
      },
      said: 'Wat je hoort in projecten: “Moet er echt een hele opdeling komen? We weten toch wat er moet gebeuren.”',
      recall: [
        {
          q: 'Wat is een resultaat (deliverable)?',
          options: ['Iets wat er aan het eind is en wat je kunt controleren', 'Elke taak in de planning', 'Een overleg met de sponsor', 'Het projectdoel'],
          answer: 'Iets wat er aan het eind is en wat je kunt controleren',
          why: 'Resultaten kun je aanwijzen; activiteiten zijn wat je doet om er te komen.',
        },
        {
          q: 'Een werkpakket is geschat op 200 uur. Wat doe je volgens de 8–80-regel?',
          options: ['Laten staan, grote pakketten zijn efficiënt', 'Samenvoegen met een ander pakket', 'Opknippen in kleinere pakketten die je kunt volgen', 'Twee eigenaren geven'],
          answer: 'Opknippen in kleinere pakketten die je kunt volgen',
          why: 'Boven de 80 uur verbergt een pakket verrassingen en zie je geen voortgang.',
        },
        {
          q: 'Waarom maak je de opdeling samen met het team?',
          options: ['Het gaat sneller dan alleen', 'De sponsor eist het', 'Dan hoef je niet te schatten', 'Mensen committeren zich eraan en zien het werk dat jij vergat'],
          answer: 'Mensen committeren zich eraan en zien het werk dat jij vergat',
          why: 'Eigenaarschap en volledigheid komen allebei van de mensen die het werk doen.',
        },
        {
          q: 'Een engineer zegt: “Laten we gewoon beginnen.” Wat is het beste antwoord?',
          options: ['“Dan ligt het risico bij jou.”', '“Eens, we beginnen deze week. Eerst één uur om te zien waar we ja tegen zeggen.”', '“De methode vraagt een volledige opdeling.”', '“Prima, dan slaan we het plannen over.”'],
          answer: '“Eens, we beginnen deze week. Eerst één uur om te zien waar we ja tegen zeggen.”',
          why: 'Je gaat mee in hun drang om te doen en krijgt toch het overzicht, tegen weinig moeite.',
        },
      ],
      situation: {
        scene: 'Je zit bij een levensmiddelenfabrikant. De plantmanager geeft je een project: “Breng de ongeplande stilstand op de afvullijnen met 30% omlaag.” Je team is een onderhoudsengineer, een ploegleider en een planner. Ze willen meteen dingen gaan repareren.',
        ask: 'Hoe kom je tot een opdeling zonder hun energie te doden?',
        model: '“Mooi dat jullie willen beginnen. Laten we morgen één uur besteden aan wat dit project moet opleveren, zodat we allemaal op hetzelfde mikken.” Dan met post-its: wat is er aan het eind, zoals een nulmeting van stilstand per lijn, de grootste oorzaken, oplossingen die draaien, een manier om het vast te houden. Onder elk resultaat pakketten met een eigenaar en een “klaar als”.',
        rubric: [
          'Houdt de energie vast door het plannen kort te houden',
          'Begint bij resultaten, niet bij activiteiten',
          'Geeft elk pakket een eigenaar en een “klaar als”',
        ],
        pushback: {
          lines: [
            '“We weten wat er stuk is. Waarom een week bezig met hokjes en lijstjes als we vandaag de doppenzetter kunnen fixen?”',
            '“Vorig project hadden we een prachtig plan en er gebeurde niks. De jongens haken af als ze geen actie zien.”',
          ],
          model: '“Snap ik, en de doppenzetter pakken we deze week aan. Geef me daarnaast donderdag één uur om op te schrijven wat er verder stilstand vreet, zodat we niet eerst de verkeerde dingen oplossen. Jouw doppenzetter staat dan als eerste op die lijst, al in uitvoering.”',
          rubric: [
            'Erkent hun energie en de slechte ervaring',
            'Houdt vast aan een korte uitsplitsing voor de grote aanpak',
            'Stelt voor allebei te doen: nu een snelle fix en een korte planningssessie',
          ],
        },
      },
      sayIt: 'Leg een nieuwe collega in 60 seconden uit hoe je een project opdeelt, van resultaten naar werkpakketten.',
      terms: [
        { term: 'Deliverable', def: 'Iets wat er aan het eind van het project is en wat je kunt controleren.' },
        { term: 'Werkpakket', def: 'Een stuk werk dat één persoon of klein team kan doen en afmaken, met een eigenaar en een “klaar als”.' },
        { term: '8–80-regel', def: 'Vuistregel: werkpakketten tussen ongeveer 8 en 80 uur werk.' },
      ],
    },
    {
      id: 'pm.plan.estimate',
      title: 'Eerlijk schatten',
      pre: [
        {
          q: 'Een teamlid zegt dat een taak 5 dagen kost. Wat gebeurt er volgens onderzoek naar de planning fallacy meestal?',
          options: ['Het kost ongeveer 5 dagen', 'Het is vaak eerder klaar', 'Het duurt merkbaar langer dan geschat', 'Het hangt alleen af van de ervaring van die persoon'],
          answer: 'Het duurt merkbaar langer dan geschat',
          why: 'Mensen plannen vanuit het beste scenario en vergeten onderbrekingen, wachten en ander werk.',
        },
      ],
      teach: [
        'Geef bandbreedtes, geen punten. “Zes tot tien weken” is eerlijker dan “acht weken”, en laat zien waar de onzekerheid zit.\n\nEen driepuntsschatting vraagt om optimistisch (O), meest waarschijnlijk (M) en pessimistisch (P). Een veelgebruikt gemiddelde is (O + 4M + P) / 6. Voor O = 4, M = 6, P = 14 dagen geeft dat 7 dagen, meer dan de “meest waarschijnlijke” 6, omdat er veel meer mis kan gaan dan meezitten.',
        'Waarom mensen onderschatten: ze zien het werk soepel lopen, vergeten het wachten op anderen, en vergeten hun gewone baan. Bij klanten is dat de grote: een ploegleider zit “in het project” maar heeft misschien 20% van zijn week vrij.\n\nVraag: “Hoeveel uur per week kun je hier echt aan besteden?” Reken dan werk om naar doorlooptijd: 16 uur werk bij 4 uur per week is vier weken.',
        'Buffers: zet niet stiekem in elke taak wat extra; die ruimte wordt toch opgemaakt. Zet één zichtbare buffer aan het eind van het project of voor een harde mijlpaal, en kijk hoe snel die opraakt. Een buffer die voor de helft op is na een kwart van het project, is een vroeg signaal.',
        'De mensenkant. Als een engineer bij de klant zegt “twee weken”, ga dan niet in discussie. Vraag: “Wat is het beste geval? En wat zou het langer kunnen maken?” Dan geeft hij de bandbreedte zelf.\n\nMoet jij iets schatten wat je niet weet, zeg dat dan en geef een bandbreedte plus wat hem kleiner maakt: “Vier tot acht weken. Na de datacheck in week 2 kan ik het scherper zeggen.”',
      ],
      example: {
        kind: 'worked',
        text: 'Je plant een data-analyse van storingen bij een verpakkingsbedrijf. De onderhoudsengineer zegt: “Drie dagen.” Je vraagt naar het beste en slechtste geval.\n\nBest: 2 dagen, als de export werkt. Slechtst: 10 dagen, want het onderhoudssysteem is gemigreerd en de oude data is misschien rommelig.\n\nDriepunts: (2 + 4 × 3 + 10) / 6 = 4 dagen werk. Hij kan er naast zijn gewone werk één dag per week aan besteden, dus de doorlooptijd is ongeveer 4 weken, geen 3 dagen. Je zet “data-analyse: 3 tot 6 weken” in de planning en vertelt de sponsor dat je na de eerste export weet aan welke kant het uitkomt.',
      },
      said: 'Wat je hoort in projecten: “Dat is hooguit twee dagen werk. Doe ik volgende week wel even.”',
      recall: [
        {
          q: 'Driepuntsschatting: optimistisch 4, meest waarschijnlijk 6, pessimistisch 14 dagen. Wat is de schatting in dagen met (O + 4M + P) / 6?',
          number: 7,
          tolerance: 0.1,
          unit: 'dagen',
          why: '(4 + 24 + 14) / 6 = 42 / 6 = 7.',
        },
        {
          q: 'Een ploegleider heeft 24 uur werk aan een taak en 4 uur per week voor het project. Hoeveel weken duurt het?',
          number: 6,
          tolerance: 0.1,
          unit: 'weken',
          why: '24 / 4 = 6 weken: werk is geen doorlooptijd.',
        },
        {
          q: 'Waarom één zichtbare buffer aan het eind in plaats van extra ruimte in elke taak?',
          options: ['Extra ruimte in elke taak wordt toch opgemaakt', 'Dan kan de sponsor hem schrappen', 'Dan lijkt de planning korter', 'Dan lopen taken nooit uit'],
          answer: 'Extra ruimte in elke taak wordt toch opgemaakt',
          why: 'Werk vult de beschikbare tijd; een gedeelde buffer die je volgt laat de echte uitloop zien.',
        },
        {
          q: 'Je moet iets schatten wat je nog niet weet. Wat is het meest professionele antwoord?',
          options: ['Eén getal, zodat je zeker overkomt', 'Weigeren te schatten tot je meer weet', 'Een bandbreedte, plus wanneer en hoe je die kleiner maakt', 'De schatting van het vorige project overnemen'],
          answer: 'Een bandbreedte, plus wanneer en hoe je die kleiner maakt',
          why: 'Eerlijk over de onzekerheid en duidelijk over hoe die kleiner wordt.',
        },
      ],
      situation: {
        scene: 'Je zit in een stuurgroep bij een maker van metalen onderdelen. De sponsor vraagt: “Dus wanneer is het nieuwe planningsproces live?” Je hebt nog niet met IT gesproken over de systeemaanpassingen.',
        ask: 'Wat zeg je?',
        model: '“Mijn beste schatting nu is tussen juni en september. De grote onbekende is de systeemaanpassing; ik zit volgende week dinsdag met IT, en daarna kan ik het tot een maand terugbrengen. Woensdag stuur ik je de update.” En dat dan ook echt doen.',
        rubric: [
          'Geeft een bandbreedte in plaats van één datum',
          'Benoemt eerlijk de grootste onbekende',
          'Zegt wanneer en hoe de bandbreedte kleiner wordt',
        ],
        pushback: {
          lines: [
            '“Het hoeft niet exact. Geef me gewoon een datum die ik in de update voor de directie kan zetten.”',
            '“Elke consultant zegt ‘het hangt ervan af’. Als je me geen datum kunt geven, waar heb ik je dan voor?”',
          ],
          model: '“Terecht, je hebt iets nodig voor de directie. Zonder IT zit het ergens tussen mei en september; de systeemaanpassing is de grote onbekende. Ik spreek IT deze week en geef je volgende dinsdag een vaste bandbreedte. Dan is de datum die je doorgeeft er een die we halen.”',
          rubric: [
            'Erkent dat hij een datum nodig heeft',
            'Geeft een eerlijke bandbreedte en benoemt de onbekende',
            'Belooft een stap met datum die de bandbreedte versmalt',
          ],
        },
      },
      sayIt: 'Leg een engineer bij de klant in 60 seconden uit waarom je naar een beste en slechtste geval vraagt in plaats van één getal.',
      terms: [
        { term: 'Driepuntsschatting', def: 'Optimistisch, meest waarschijnlijk en pessimistisch, vaak gecombineerd als (O + 4M + P) / 6.' },
        { term: 'Planning fallacy', def: 'De neiging om tijd te onderschatten door uit te gaan van het beste geval.' },
        { term: 'Werk versus doorlooptijd', def: 'Uren werk tegenover kalendertijd, die afhangt van beschikbaarheid.' },
      ],
    },
    {
      id: 'pm.plan.schedule',
      title: 'Kritiek pad en de planning op één A4',
      pre: [
        {
          q: 'Een taak die niet op het kritieke pad ligt, loopt een week uit. Wat gebeurt er met de einddatum?',
          options: ['Die schuift een week op', 'Die schuift twee weken op', 'De hele planning moet opnieuw', 'Niets, zolang de uitloop binnen de speling van die taak valt'],
          answer: 'Niets, zolang de uitloop binnen de speling van die taak valt',
          why: 'Alleen de langste keten van afhankelijke taken bepaalt de einddatum.',
        },
      ],
      teach: [
        'Afhankelijkheden: sommig werk kan pas beginnen als ander werk af is. Je kunt de nieuwe gereedheidscheck niet testen voordat de planners ermee akkoord zijn.\n\nBreng ze in kaart door elke eigenaar te vragen: “Wat heb je van een ander nodig voordat je kunt beginnen?” Bij klanten gaan de meeste afhankelijkheden over mensen en besluiten, niet over taken: een handtekening, de OR, een productiestop.',
        'Het kritieke pad is de langste keten van afhankelijk werk van start tot eind. Die bepaalt de einddatum.\n\nTaken buiten dat pad hebben speling: ze mogen een beetje uitlopen zonder dat het eind verschuift. Dus je houdt het kritieke pad scherp in de gaten en raakt niet in paniek over al het andere. Moet het sneller, dan helpt alleen het kritieke pad korter maken.',
        'Mijlpalen zijn momenten, geen activiteiten: “gereedheidscheck vastgesteld”, “pilot start”, “go/no-go voor uitrol” (het besluit om uit te rollen of te stoppen). Goede mijlpalen zijn besluiten of zichtbare resultaten, ongeveer elke drie tot zes weken. Ze geven de stuurgroep iets om te checken en het team iets om op te mikken.',
        'Zet de planning op één A4: resultaten als rijen, weken als kolommen, mijlpalen als ruitjes, een eigenaar per rij. Leg hem naast de kalender van de klant: stops, vakanties, piekseizoen, stuurgroepdatums.\n\nHang hem op waar het team werkt. Een planning die mensen elke dag zien, wordt gecorrigeerd; een planning in een map wordt vergeten.',
      ],
      example: {
        kind: 'worked',
        text: 'Een planningsproject bij een netbeheerder.\n\nDe nulmeting (A) duurt 3 weken. Dan twee ketens: de gereedheidscheck ontwerpen (B, 4 weken) met daarna de planners trainen (D, 2 weken); en systeemtoegang regelen voor de pilotregio (C, 6 weken), ook voor de pilot. De pilot (E, 6 weken) heeft D en C nodig.\n\nKeten A-B-D-E = 3 + 4 + 2 + 6 = 15 weken. Keten A-C-E = 3 + 6 + 6 = 15 weken. Allebei kritiek.\n\nJe vraagt IT of de toegangsaanvraag in week 1 kan starten in plaats van na de nulmeting: dan loopt C naast A. De einddatum blijft 15 weken, maar de toegangsketen heeft nu 3 weken speling, dus vertraging bij IT schuift het eind niet meer op.',
      },
      said: 'Wat je hoort in projecten: “Die datum is prima, als IT op tijd levert. Heeft iemand IT eigenlijk al gevraagd?”',
      recall: [
        {
          q: 'Twee ketens: A (3 weken) dan B (4) dan D (2); en A (3) dan C (6) dan D (2). Hoeveel weken is het kritieke pad?',
          number: 11,
          tolerance: 0.1,
          unit: 'weken',
          why: 'A-C-D = 3 + 6 + 2 = 11 weken, langer dan A-B-D = 9.',
        },
        {
          q: 'Welke van deze is een goede mijlpaal?',
          options: ['“Analysefase”', '“Wekelijks teamoverleg”', '“Go/no-go voor uitrol besloten door de stuurgroep”', '“Bezig met de pilot”'],
          answer: '“Go/no-go voor uitrol besloten door de stuurgroep”',
          why: 'Een mijlpaal is een moment met een besluit of zichtbaar resultaat, geen doorlopende activiteit.',
        },
        {
          q: 'Je moet twee weken eerder klaar zijn. Waar kijk je eerst?',
          options: ['Naar taken op het kritieke pad', 'Naar de goedkoopste taken', 'Naar taken met de meeste speling', 'Naar alle taken evenveel'],
          answer: 'Naar taken op het kritieke pad',
          why: 'Alleen een korter kritiek pad verschuift de einddatum.',
        },
        {
          q: 'Welke vraag brengt afhankelijkheden bij een klant het best boven?',
          options: ['“Hoe lang duurt jouw deel?”', '“Wat heb je van een ander nodig voordat je kunt beginnen?”', '“Ben je gemotiveerd?”', '“Welke software gebruiken jullie?”'],
          answer: '“Wat heb je van een ander nodig voordat je kunt beginnen?”',
          why: 'Afhankelijkheden gaan meestal over input, akkoorden en besluiten van anderen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een maker van kunststof onderdelen. Volgens je planning gaat de nieuwe ploegoverdracht in week 20 live. Bij de koffie zegt een teamleider dat de fabriek in week 19 en 20 stilligt, en dat de helft van de operators direct daarna op vakantie gaat.',
        ask: 'Wat doe je hiermee?',
        model: 'Hem bedanken, en de planning meteen naast de kalender van de klant leggen: stops, vakanties, piekseizoen. Live gaan in week 20 kan niet: dan ligt de fabriek stil, en direct daarna is de helft van de operators weg. Dus ik zou week 17 of na de vakantie voorstellen, en dat met de reden aan de sponsor voorleggen. En ik hang de planning op één A4 op waar het team hem ziet, zodat zoiets eerder boven komt.',
        rubric: [
          'Legt de planning naast de kalender van de klant',
          'Stelt de sponsor een concrete andere datum voor, met de reden',
          'Maakt de planning zichtbaar zodat anderen hem kunnen corrigeren',
        ],
        pushback: {
          lines: [
            '“Week 20 staat in het plan dat de directie heeft goedgekeurd. Als we dat nu verschuiven, lijkt het alsof we niet hebben nagedacht.”',
            '“Kun je niet gewoon live gaan tijdens de stop? Dan is het rustig, ideaal voor iets nieuws.”',
          ],
          model: '“Snap ik, een verschoven datum voelt slecht. Maar live gaan tijdens de stop betekent dat niemand het wekenlang gebruikt, en de helft van de operators leert het dan pas na de vakantie. Beter om het nu te zeggen: week 23, met iedereen erbij. Ik schrijf vandaag twee regels uitleg voor de directie.”',
          rubric: [
            'Erkent wat het verschuiven kost',
            'Houdt vast aan een datum die op de vloer werkt',
            'Stelt een concrete nieuwe datum voor en hoe de directie het hoort',
          ],
        },
      },
      sayIt: 'Leg een klantteam in 60 seconden uit wat het kritieke pad is en waarom het telt voor de einddatum.',
      terms: [
        { term: 'Kritiek pad', def: 'De langste keten van afhankelijk werk; die bepaalt de einddatum.' },
        { term: 'Speling', def: 'Hoeveel een taak kan uitlopen zonder dat de einddatum verschuift.' },
        { term: 'Mijlpaal', def: 'Een moment met een besluit of zichtbaar resultaat, geen activiteit.' },
      ],
    },
    {
      id: 'pm.plan.risk',
      title: 'Een risicolijst die gebruikt wordt',
      pre: [
        {
          q: 'Wat is het belangrijkste doel van een pre-mortem?',
          options: ['Het projectbudget berekenen', 'Vooraf de schuld verdelen', 'Het veilig maken om te benoemen waarom het project zou kunnen mislukken', 'De risicolijst vervangen'],
          answer: 'Het veilig maken om te benoemen waarom het project zou kunnen mislukken',
          why: 'Als je mislukken als feit voorstelt, zeggen mensen wat ze anders voor zich houden.',
        },
      ],
      teach: [
        'Een risico is iets wat kan gebeuren en het project pijn zou doen. Per risico: kans, impact, een eigenaar en een actie met een datum.\n\n“Data kan slecht zijn” helpt niet. “De onderhoudsdata van voor 2023 is na de migratie misschien onbruikbaar; eigenaar: Pieter; actie: testexport in week 1” wel. Een eigenaar is een persoon, geen afdeling.',
        'De meeste risicolijsten sterven na de kick-off. Houd de jouwe levend: alleen de top vijf komt in elke stuurgroep langs, en de eigenaar vertelt wat er sindsdien gebeurd is.\n\nRisico’s die uitkomen worden issues en pak je ook zo aan. Voeg nieuwe risico’s toe zodra je ze hoort, vaak bij het koffieapparaat.',
        'De pre-mortem: “Stel, het is over zes maanden en dit project is mislukt. Schrijf alleen op waarom.” Haal daarna per ronde één reden per persoon op. Omdat het mislukken als feit wordt voorgesteld, noemen mensen dingen die ze anders niet zeggen: de sponsor vertrekt misschien, de nachtploeg accepteert het niet, de IT-aanpassing heeft geen budget.',
        'De mensenkant: sommige risico’s zijn gevoelig, zoals “de plantmanager gelooft er eigenlijk niet in”. Zet dat niet in een lijst die de plantmanager leest. Formuleer het als thema (“sponsorschap en zichtbare steun”) en bespreek het echte punt één op één met wie er iets aan kan doen.\n\nWeet je niet hoe groot de kans is, zeg dat dan en plan een goedkope test om het uit te zoeken.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij de kick-off van een stilstandproject bij een bakkerij doe je een pre-mortem van 20 minuten met zes mensen. Redenen die boven komen: “onderhoud had nooit tijd door de zomerpiek” (drie mensen), “operators stopten na twee weken met stops registreren”, “de nieuwe manager blies het af”. De belangrijkste maak je tot regels in de risicolijst.\n\nZomerpiek: kans hoog, impact hoog, eigenaar de onderhoudsmanager, actie: analyse voor juni plannen en per monteur 4 uur per week reserveren. Registreren: eigenaar de ploegleider, actie: registreren met één tik op de lijnterminal voor week 3. Elke stuurgroep begint met deze vijf.',
      },
      said: 'Wat je hoort in projecten: “De risicolijst? Staat ergens in de projectmap, denk ik.”',
      recall: [
        {
          q: 'Welke is een bruikbare risicoregel?',
          options: ['“Datakwaliteit”', '“Oude onderhoudsdata misschien onbruikbaar; eigenaar Pieter; testexport in week 1”', '“IT-risico’s: middel”', '“Weerstand van de vloer”'],
          answer: '“Oude onderhoudsdata misschien onbruikbaar; eigenaar Pieter; testexport in week 1”',
          why: 'Hij noemt de concrete gebeurtenis, een persoon als eigenaar en een actie met datum.',
        },
        {
          q: 'Hoe houd je een risicolijst levend?',
          options: ['Eens per kwartaal bijwerken', 'Hem naar iedereen mailen', 'Hem aan het begin zo volledig mogelijk maken', 'De top vijf in elke stuurgroep bespreken, met de eigenaren aan het woord'],
          answer: 'De top vijf in elke stuurgroep bespreken, met de eigenaren aan het woord',
          why: 'Regelmatig en kort gebruik door de eigenaren van de risico’s houdt hem echt.',
        },
        {
          q: 'Een gevoelig risico: de plantmanager gelooft niet in het project. Wat doe je?',
          options: ['Het letterlijk in de lijst zetten', 'Negeren tot het zichtbaar wordt', 'Het als thema in de lijst zetten en het echte punt één op één bespreken', 'Het in het volgende overleg aan het team vertellen'],
          answer: 'Het als thema in de lijst zetten en het echte punt één op één bespreken',
          why: 'Het risico wordt aangepakt zonder de relatie te beschadigen in een openbaar document.',
        },
        {
          q: 'Waarom schrijft bij een pre-mortem iedereen eerst alleen zijn redenen op?',
          options: ['Zodat de luidste niet de richting bepaalt', 'Om tijd te besparen', 'Omdat de sponsor ze leest', 'Zodat niemand hoeft te praten'],
          answer: 'Zodat de luidste niet de richting bepaalt',
          why: 'Eerst alleen schrijven geeft je ieders beeld, niet alleen het eerste dat hardop gezegd wordt.',
        },
      ],
      situation: {
        scene: 'Je zit bij de kick-off van een project bij een netbeheerder om de werkvoorbereiding te versnellen. De sfeer is beleefd. Niemand noemt zorgen, maar vorige week hoorde je van een planner dat “dit al twee keer eerder geprobeerd is”.',
        ask: 'Hoe krijg je de echte risico’s boven tafel?',
        model: 'Ik zou een korte pre-mortem doen: “Stel, het is over een jaar en dit project is mislukt, net als de vorige twee. Schrijf alleen op waarom.” Daarna per ronde één reden per persoon ophalen. Ook zou ik open vragen: “Wat gebeurde er met de eerdere pogingen?” en de belangrijkste redenen omzetten in risico’s met een eigenaar en een actie.',
        rubric: [
          'Gebruikt een pre-mortem of iets vergelijkbaars om risico’s veilig te laten benoemen',
          'Vraagt open naar de eerdere pogingen',
          'Zet redenen om in risico’s met een eigenaar en een actie',
        ],
        pushback: {
          lines: [
            '“Waarom die oude pogingen erbij halen? Dan wordt iedereen al negatief voordat we begonnen zijn.”',
            '“Die projecten zijn mislukt door de mensen van toen. Dit team is anders.”',
          ],
          model: '“Ik wil er ook niet in blijven hangen. Maar als iets het twee keer heeft tegengehouden, kan het ons ook tegenhouden. Geef me een kwartier in de volgende sessie: wat ging er toen mis, en wat is er nu anders? Wat eruit komt, gaat op de risicolijst met een eigenaar.”',
          rubric: [
            'Erkent de zorg over negativiteit',
            'Houdt leren van eerdere pogingen op tafel',
            'Stelt een korte, concrete sessie voor met eigenaren voor de risico’s',
          ],
        },
      },
      sayIt: 'Leg een teamleider bij de klant in 60 seconden uit hoe een pre-mortem werkt en waarom het helpt.',
      terms: [
        { term: 'Risicolijst', def: 'Lijst met risico’s met kans, impact, eigenaar en een actie met datum.' },
        { term: 'Pre-mortem', def: 'Je voorstellen dat het project mislukt is en opschrijven waarom, om risico’s vroeg te vinden.' },
        { term: 'Issue', def: 'Een risico dat is uitgekomen en nu aangepakt moet worden.' },
      ],
    },
    {
      id: 'pm.plan.raci',
      title: 'Rollen en de sponsor',
      pre: [
        {
          q: 'Welke rol blijft bij verbeterprojecten bij klanten het vaakst vaag?',
          options: ['Wat de sponsor echt gaat doen', 'Wie notuleert', 'Wie de vergaderruimtes boekt', 'Wie de consultant is'],
          answer: 'Wat de sponsor echt gaat doen',
          why: 'Sponsors worden wel genoemd, maar hun taken worden zelden uitgeschreven, dus ze verdwijnen stilletjes.',
        },
      ],
      teach: [
        'RACI per resultaat.\n\nResponsible: wie het werk doet. Accountable: wie eigenaar is van het resultaat en zegt “dit is af”, precies één persoon. Consulted: wie vooraf input geeft. Informed: wie het achteraf hoort.\n\nTwee namen onder A betekent dat niemand eigenaar is. Een tabel met tien namen die allemaal C zijn, betekent trage besluiten.',
        'Eén eigenaar per resultaat, waar het kan van de kant van de klant. Jij kunt responsible zijn voor de analyse; de planningsmanager moet accountable zijn voor het nieuwe planningsproces, want hij moet het draaien als jij weg bent. Wil de klant geen enkel resultaat bezitten, dan heb je een project waar ze naar kijken, niet een project dat ze doen.',
        'Maak de rol van de sponsor expliciet. Schrijf hem samen met hem op: zit elke vier weken de stuurgroep voor, beslist binnen een week over scopewijzigingen, ruimt obstakels op die jij escaleert, en legt de organisatie uit waarom dit ertoe doet. Vraag: “Waar kan ik op je rekenen, en hoe bereik ik je als iets vastzit?”',
        'Het RACI-gesprek brengt conflicten boven. Twee managers denken allebei dat zij over het ploegenrooster beslissen.\n\nLos het niet zelf op: “Ik zie hier twee namen staan. Wie beslist er als jullie het oneens zijn?” Komen ze er niet uit, dan gaat het naar de sponsor. Liever in week 2 ontdekken dan in week 12.',
      ],
      example: {
        kind: 'worked',
        text: 'Project om de wekelijkse productieplanning bij een kabelfabrikant te verbeteren. Je maakt een eerste RACI voor vier resultaten.\n\nVoor “nieuw wekelijks planningsoverleg”: R de planner, A de operations manager, C de ploegleiders en verkoop, I de plantmanager. Voor “capaciteitsmodel”: R jij, A de planner.\n\nDaarna zit je 30 minuten met de sponsor, de plantmanager, en spreek je vier dingen op papier af: hij zit elke vier weken de stuurgroep voor, beslist binnen een week over scope, opent het gesprek met verkoop als je daar vastloopt, en vertelt de ploegleiders in het maandoverleg waarom dit project ertoe doet.',
      },
      said: 'Wat je hoort in projecten: “De sponsor? Formeel is dat de plantmanager, maar die heb ik sinds de kick-off niet meer gezien.”',
      recall: [
        {
          q: 'Hoeveel mensen zijn accountable voor één resultaat?',
          options: ['Niemand, het team is dat', 'Precies één', 'Twee, als back-up', 'Iedereen die betrokken is'],
          answer: 'Precies één',
          why: 'Met meer dan één is niemand echt eigenaar van het resultaat.',
        },
        {
          q: 'Waarom moet iemand van de klant accountable zijn voor de meeste resultaten?',
          options: ['Het is goedkoper', 'Consultants mogen niet tekenen', 'Hij moet het draaien als jij weg bent', 'Het maakt het project korter'],
          answer: 'Hij moet het draaien als jij weg bent',
          why: 'Eigenaarschap tijdens het project maakt eigenaarschap na het project mogelijk.',
        },
        {
          q: 'Twee managers denken allebei dat zij over het ploegenrooster beslissen. Wat doe je?',
          options: ['Zelf beslissen, als neutrale partij', 'De hoogste in rang kiezen', 'Laten liggen tot het problemen geeft', 'Vragen wie beslist als ze het oneens zijn, en naar de sponsor gaan als ze er niet uitkomen'],
          answer: 'Vragen wie beslist als ze het oneens zijn, en naar de sponsor gaan als ze er niet uitkomen',
          why: 'Je brengt het conflict vroeg boven en laat de juiste persoon het beslechten.',
        },
        {
          q: 'Wat is de beste manier om de rol van de sponsor expliciet te maken?',
          options: ['Concrete taken met hem op papier afspreken, zoals binnen een week beslissen over scope', 'Zijn naam op de titelslide zetten', 'Hem voor elk overleg uitnodigen', 'Het team vragen wat ze verwachten'],
          answer: 'Concrete taken met hem op papier afspreken, zoals binnen een week beslissen over scope',
          why: 'Concrete, afgesproken taken geven je iets om hem aan te houden.',
        },
      ],
      situation: {
        scene: 'Je start een project bij een netbeheerder. De sponsor, een regiodirecteur, zegt bij de kick-off: “Ik steun dit volledig. Laat het maar weten als je iets nodig hebt.” Daarna vertrekt hij.',
        ask: 'Wat doe je de week erna?',
        model: 'Een half uur bij hem inplannen. “Dank voor je steun. Om het concreet te maken: kan ik erop rekenen dat je elke vier weken de stuurgroep voorzit, binnen een week beslist over scopewijzigingen, en helpt als we vastlopen bij een andere afdeling? En hoe bereik ik je snel als iets blokkeert?” Daarna een korte samenvatting sturen van wat we afspraken.',
        rubric: [
          'Volgt snel op in plaats van algemene steun te accepteren',
          'Stelt concrete taken voor de sponsor voor',
          'Bevestigt de afspraak op papier',
        ],
        pushback: {
          lines: [
            '“Ik zei toch dat ik erachter sta. Ik hoef niet bij elk overleg te zitten. Daar heb ik jou voor ingehuurd.”',
            '“Maandelijks een stuurgroep? Mijn agenda zit tot maart vol. Stuur me gewoon af en toe een update.”',
          ],
          model: '“Fijn dat je me dat vertrouwen geeft, en je hoeft niet bij elk overleg. Ik heb je nodig voor drie besluiten dit kwartaal, en de teams moeten zien dat je erachter staat. Elke vier weken een halfuur is genoeg. Zal ik nu bij je secretariaat het eerste moment vragen?”',
          rubric: [
            'Erkent zijn vertrouwen en zijn volle agenda',
            'Maakt concreet wat de rol van sponsor vraagt',
            'Stelt een klein, vast moment voor en plant het in',
          ],
        },
      },
      sayIt: 'Leg een nieuw projectlid in 60 seconden uit wat RACI betekent en waarom maar één persoon accountable kan zijn.',
      terms: [
        { term: 'RACI', def: 'Responsible, Accountable, Consulted, Informed: rollen per resultaat.' },
        { term: 'Accountable', def: 'De ene persoon die eigenaar is van het resultaat en zegt dat het af is.' },
        { term: 'Sponsor', def: 'De senior persoon bij de klant die het project steunt, besluiten neemt en obstakels opruimt.' },
      ],
    },
    {
      id: 'pm.plan.method',
      title: 'Een werkwijze kiezen',
      pre: [
        {
          q: 'Je verbetert hoe een fabriek zijn onderhoud plant, en niemand weet nog hoe het nieuwe proces eruit moet zien. Welke aanpak past het best?',
          options: ['Waterval: eerst volledig ontwerpen, dan invoeren', 'Korte rondes waarin je delen met het team uitprobeert en bijstuurt', 'Helemaal geen plan, gewoon beginnen', 'Het proces van een andere fabriek kopiëren'],
          answer: 'Korte rondes waarin je delen met het team uitprobeert en bijstuurt',
          why: 'Als de oplossing onbekend is, werkt snelle feedback beter dan een gedetailleerd ontwerp op papier.',
        },
      ],
      teach: [
        'Waterval: fases op volgorde, analyseren, ontwerpen, bouwen, invoeren, met een vaste scope. Dat past bij werk dat voorspelbaar is en later moeilijk te veranderen, zoals een nieuw MS-station plaatsen of een productielijn verhuizen. Je plant één keer in detail en stuurt op afwijkingen.',
        'Agile: korte rondes (sprints) van één tot vier weken, die elk eindigen met iets werkends waar gebruikers op reageren. De scope beweegt mee met wat je leert. Dat past bij werk waar de oplossing onduidelijk is en de reactie van gebruikers telt, zoals een nieuw planningsoverleg of een nieuw dashboard voor ploegleiders.',
        'De meeste verbeterprojecten zijn hybride: vaste mijlpalen, budget en einddatum voor de stuurgroep, en korte rondes daarbinnen. De stuurgroep ziet “pilot live in week 10”; het team werkt daar in rondes van twee weken naartoe, en elke ronde eindigt met een korte review waarin de vloer vertelt wat werkt.',
        'De mensenkant: verkoop geen jargon. Een plantmanager die “scrum” hoort, denkt misschien aan software en chaos. Zeg: “We werken in rondes van twee weken, en elke ronde zie je iets werken op de vloer.”\n\nWeerstand: “De directie wil een volledig plan.” Geef ze de mijlpalenplanning; de rondes zijn hoe het team er komt. Twijfel je welke aanpak past, vraag dan: “Hoe zeker zijn we van hoe de oplossing eruitziet?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder leid je een project om een gereedheidscheck in te voeren voordat klussen in de weekplanning komen. Niemand weet precies welke checks ertoe doen.\n\nPlanning voor de stuurgroep: nulmeting klaar week 4, pilot live week 8, go/no-go voor uitrol week 16. Daarbinnen: rondes van twee weken.\n\nRonde 1: een papieren checklist met vijf checks, gebruikt door twee planners. Review: “check 4 kost te veel tijd en valt nooit af”, dus die gaat eruit. Ronde 2: de schakelplancheck erbij waar het bedrijfsvoeringscentrum om vroeg.\n\nIn week 8 is de checklist op 60 echte klussen getest, en de planners hebben hem mee vormgegeven, dus ze verdedigen hem.',
      },
      said: 'Wat je hoort in projecten: “Agile? We zijn geen softwarebedrijf. We hebben gewoon een planning met datums nodig.”',
      recall: [
        {
          q: 'Welk project past het best bij waterval?',
          options: ['Met operators een nieuwe ploegoverdracht ontwerpen', 'Een dashboard bouwen dat nog niemand heeft gezien', 'Een MS-station vervangen volgens een vast ontwerp', 'Een nieuwe manier van onderhoud plannen testen'],
          answer: 'Een MS-station vervangen volgens een vast ontwerp',
          why: 'Voorspelbaar werk met een bekend ontwerp past bij een plan op volgorde.',
        },
        {
          q: 'Waarmee moet elke korte ronde eindigen?',
          options: ['Een statusrapport', 'Iets werkends waar gebruikers op kunnen reageren', 'Een nieuwe risicolijst', 'Een stuurgroepvergadering'],
          answer: 'Iets werkends waar gebruikers op kunnen reageren',
          why: 'De waarde van korte rondes is de feedback van echte gebruikers.',
        },
        {
          q: 'De directie wil een volledig plan met datums. Jij wilt in rondes werken. Wat doe je?',
          options: ['Weigeren en agile uitleggen', 'De rondes laten vallen', 'Elke taak in detail plannen', 'Ze een mijlpalenplanning geven, met rondes daarbinnen om er te komen'],
          answer: 'Ze een mijlpalenplanning geven, met rondes daarbinnen om er te komen',
          why: 'Hybride geeft de directie zekerheid over mijlpalen en het team ruimte om te leren.',
        },
        {
          q: 'Welke vraag helpt je een aanpak te kiezen?',
          options: ['“Hoe zeker zijn we van hoe de oplossing eruitziet?”', '“Welke methode is het modernst?”', '“Wat gebruikte de vorige consultant?”', '“Hoeveel mensen zitten er in het team?”'],
          answer: '“Hoe zeker zijn we van hoe de oplossing eruitziet?”',
          why: 'Onzekerheid over de oplossing is de belangrijkste reden om in korte rondes te werken.',
        },
      ],
      situation: {
        scene: 'Je zit bij een maker van stalen deuren. De operationeel directeur zegt: “Ik wil een volledig ontwerp van de nieuwe productieplanning voordat we iets veranderen. Geen experimenten op mijn vloer.”',
        ask: 'Hoe reageer je?',
        model: '“Snap ik, je wilt geen chaos op de vloer. Je krijgt een planning met duidelijke mijlpalen en een go/no-go voordat er overal iets live gaat. Om zeker te weten dat het ontwerp werkt, wil ik het eerst twee weken met één team testen, gecontroleerd. Dan beslis jij over de uitrol op basis van wat we gezien hebben.”',
        rubric: [
          'Erkent de zorg van de directeur over de vloer',
          'Biedt mijlpalen en een go/no-go voor controle',
          'Stelt een kleine, gecontroleerde test voor in plaats van jargon',
        ],
        pushback: {
          lines: [
            '“Ik heb vaker ‘pilots’ gezien. Dan wordt mijn vloer een proeftuin en ruimt niemand achteraf op.”',
            '“Als het ontwerp goed is, waarom zou je het dan moeten testen? Doe het werk gewoon vooraf goed.”',
          ],
          model: '“Terecht, een pilot die een puinhoop achterlaat is erger dan geen pilot. Ik ontwerp het gewoon goed. Het punt is om twee aannames te checken voordat we het overal uitrollen: één cel, vier weken, met een einddatum en een weg terug. Aan het eind beslis jij of het breder gaat.”',
          rubric: [
            'Erkent zijn slechte ervaring en zijn behoefte aan controle',
            'Houdt vast aan het testen van de kernaannames voor de uitrol',
            'Stelt een afgebakende test voor met einddatum en zijn besluit',
          ],
        },
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit wanneer je een project in één keer plant en wanneer in korte rondes.',
      terms: [
        { term: 'Waterval', def: 'Fases in een vaste volgorde met een vaste scope, voor voorspelbaar werk.' },
        { term: 'Sprint', def: 'Een korte ronde van één tot vier weken die eindigt met iets waar gebruikers op kunnen reageren.' },
        { term: 'Hybride', def: 'Vaste mijlpalen voor de stuurgroep, korte rondes voor het team.' },
      ],
    },
  ],
};

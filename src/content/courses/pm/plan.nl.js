// pm.plan (Nederlands): plannen, van een doel naar een plan waar mensen in geloven: opdeling, schattingen, planning, risico’s, rollen en werkwijze.
export default {
  lessons: [
    {
      id: 'pm.plan.wbs',
      title: 'Het werk opdelen',
      pre: [
        {
          q: 'Een netbeheerder (het bedrijf dat het regionale stroomnet beheert) wil minder afgezegde klussen. Wat is de beste eerste regel in de opdeling van dat project?',
          options: ['“Data analyseren”', '“Week 1: kick-off (startoverleg)”', '“Nulmeting van afzeggingen per oorzaak, afgestemd met de planningsmanager”', '“Workshops houden”'],
          answer: '“Nulmeting van afzeggingen per oorzaak, afgestemd met de planningsmanager”',
          why: 'Begin bij resultaten, dingen die er straks zijn en die je kunt controleren, niet bij activiteiten. Een nulmeting (baseline) is het gemeten startpunt.',
        },
      ],
      teach: [
        'Begin bij de resultaten, niet bij de activiteiten. Een resultaat (deliverable) is iets wat er aan het eind is en wat iemand kan controleren: “een nulmeting van afzeggingen per oorzaak”, “een gereedheidscheck waar de planners mee akkoord zijn” (een check dat vergunningen, materiaal en ploeg klaar zijn voor een klus), “een pilot (kleine proef) van zes weken in één regio”.\n\nVraag: “Als dit project klaar is, wat is er dan wat er nu niet is?” Schrijf er vier tot zeven op. Activiteiten komen later, eronder.',
        'Zo ontstaat een WBS (work breakdown structure, een werkopdeling): een boom met het project bovenaan, de deliverables daaronder en de werkpakketten onderaan.\n\nEén regel van het PMI (het Project Management Institute, de grote beroepsvereniging) helpt: de 100%-regel. Samen dekken de takken al het werk, en niets buiten het project. Moet iets gebeuren en staat het niet in de boom, dan doet niemand het.',
        'Een werkpakket is een stuk werk dat één persoon of een klein team kan doen en afmaken. De 8–80-regel, een gangbare vuistregel: een pakket kleiner dan ongeveer 8 uur is micromanagement, groter dan ongeveer 80 uur verbergt verrassingen en kun je niet volgen.\n\nElk pakket krijgt een werkwoord, een eigenaar en een definition of done, de check die zegt dat het af is: “3 maanden afzeggingen indelen per oorzaak, klaar als de planningsmanager akkoord is met de categorieën.”',
        'Maak de opdeling samen met de mensen die het werk gaan doen, niet alleen achter je laptop. Post-its op de muur, één resultaat per kolom, 60 minuten.\n\nMensen committeren zich aan wat ze zelf hebben helpen opdelen. En ze zien de pakketten die jij vergat, zoals toegang tot data, de OR (ondernemingsraad, works council) of het trainen van de nachtploeg. Vaak vergeten: toestemmingen regelen, training, en de overdracht aan de lijnorganisatie die het daarna draait.',
        'Weerstand klinkt als: “Al dat plannen hebben we niet nodig, laten we gewoon beginnen.” Antwoord: “Eens, we beginnen deze week. Geef me één uur om te zien waar we ja tegen zeggen, zodat we in maand twee niet verrast worden.”\n\nExperts verschillen over detail: sommigen delen op dag één alles op, anderen alleen de komende zes weken en de rest grof. Snap je het technische werk niet, vraag de expert: “Wat moet er af zijn voordat jij hieraan kunt beginnen?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder is het doel om afzeggingen van geplande MS-klussen (werk aan het middenspanningsnet, afgezegd in de laatste week voor de datum) binnen zes maanden van 18% naar onder de 8% te krijgen. Met twee planners en een teamleider zet je vier resultaten op de muur: (1) nulmeting van afzeggingen per oorzaak, (2) een gereedheidscheck afgestemd met planning en het bedrijfsvoeringscentrum (de meldkamer die het net op afstand bedient), (3) een pilot van zes weken in één regio, (4) overdracht aan alle regionale planners.\n\nOnder (1): “3 maanden afzeggingen uit het planningssysteem halen” (16 uur, de data-analist), “indelen per oorzaak met twee planners” (12 uur), “bespreken met de planningsmanager” (4 uur). Onder (3) voegt iemand “schakelmonteurs briefen” toe (de monteurs die het net veilig uit- en inschakelen), die was je vergeten.',
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
          q: 'Een werkpakket is geschat op 200 uur werk. Wat doe je volgens de 8–80-regel?',
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
        scene: 'Je zit bij een levensmiddelenfabrikant. De plantmanager geeft je een project: “Breng de ongeplande stilstand (uren dat de lijn onverwacht stilstaat, unplanned downtime) op de afvullijnen met 30% omlaag.” Je team is een onderhoudsengineer, een ploegleider en een planner. Ze willen meteen dingen gaan repareren, te beginnen met de doppenzetter (de machine die de doppen erop draait).',
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
        { term: 'Deliverable', def: 'Iets wat er aan het eind van het project is en wat je kunt controleren; in het Nederlands vaak “resultaat”.' },
        { term: 'WBS', def: 'Work breakdown structure: een boom van project naar deliverables naar werkpakketten, die al het werk dekt.' },
        { term: 'Werkpakket', def: 'Een stuk werk dat één persoon of klein team kan doen en afmaken, met een eigenaar en een “klaar als”.' },
        { term: '8–80-regel', def: 'Vuistregel: werkpakketten tussen ongeveer 8 en 80 uur werk.' },
        { term: 'Definition of done', def: 'De afgesproken check die zegt dat een pakket of deliverable af is.' },
      ],
    },
    {
      id: 'pm.plan.estimate',
      title: 'Eerlijk schatten',
      pre: [
        {
          q: 'Een teamlid zegt dat een taak 5 dagen kost. Wat gebeurt er volgens onderzoek naar de planning fallacy (onze neiging om te onderschatten hoe lang iets duurt) meestal?',
          options: ['Het kost ongeveer 5 dagen', 'Het is vaak eerder klaar', 'Het duurt merkbaar langer dan geschat', 'Het hangt alleen af van de ervaring van die persoon'],
          answer: 'Het duurt merkbaar langer dan geschat',
          why: 'Mensen plannen vanuit het beste scenario en vergeten onderbrekingen, wachten en ander werk.',
        },
      ],
      teach: [
        'Geef een bandbreedte (range), geen punt. “Zes tot tien weken” is eerlijker dan “acht weken”, en laat zien waar de onzekerheid zit.\n\nEen driepuntsschatting vraagt om optimistisch (O), meest waarschijnlijk (M) en pessimistisch (P). Het PERT-gemiddelde (Program Evaluation and Review Technique), uit het Polaris-programma van de Amerikaanse marine in 1958, is (O + 4M + P) / 6. Voor O = 4, M = 6, P = 14 dagen geeft dat 7 dagen, meer dan de “meest waarschijnlijke” 6, omdat er veel meer mis kan gaan dan meezitten.',
        'De planning fallacy is de neiging om tijd te onderschatten door uit te gaan van het beste geval. Kahneman en Tversky gaven het in 1979 een naam. In een onderzoek van Buehler, Griffin en Ross uit 1994 dachten studenten hun scriptie in zo’n 34 dagen af te hebben; gemiddeld duurde het 56.\n\nMensen zien het werk soepel lopen, vergeten het wachten op anderen en hun gewone baan. Een remedie: vraag hoe lang vergelijkbare klussen echt duurden, niet hoe lang deze zou moeten duren.',
        'Inspanning (effort) is het aantal uren werk; doorlooptijd (duration) is de kalendertijd tot het af is. Bij klanten zit daar het grote gat: een ploegleider zit “in het project” maar heeft misschien 20% van zijn week vrij.\n\nVraag: “Hoeveel uur per week kun je hier echt aan besteden?” Reken dan om: 16 uur inspanning bij 4 uur per week is een doorlooptijd van vier weken. Tel vakanties en piekseizoen op bij de doorlooptijd, niet bij de inspanning.',
        'Een buffer is reservetijd voor wat misgaat. Zet niet stiekem in elke taak wat extra; die ruimte wordt toch opgemaakt. De wet van Parkinson (1955): werk dijt uit tot de beschikbare tijd vol is. Goldratt (1997) noemde pas vlak voor de deadline beginnen het “studentensyndroom”.\n\nZet één zichtbare buffer aan het eind van het project of voor een harde mijlpaal (milestone, een vaste datum die ertoe doet), en kijk hoe snel die opraakt. Een buffer die na een kwart van het project half op is, is een vroeg signaal.',
        'De mensenkant. Als een engineer bij de klant zegt “twee weken”, ga dan niet in discussie. Vraag: “Wat is het beste geval? En wat zou het langer kunnen maken?” Dan geeft hij de bandbreedte zelf.\n\nMoet jij iets schatten wat je niet weet, zeg dat en geef een bandbreedte plus wat hem kleiner maakt: “Vier tot acht weken. Na de datacheck in week 2 kan ik het scherper zeggen.” Experts verschillen over bandbreedtes aan een directie; de meesten geven de bandbreedte plus de datum waar ze voor tekenen.',
      ],
      example: {
        kind: 'worked',
        text: 'Je plant een data-analyse van storingen bij een verpakkingsbedrijf. De onderhoudsengineer zegt: “Drie dagen.” Je vraagt naar het beste en slechtste geval.\n\nBest: 2 dagen, als de export werkt. Slechtst: 10 dagen, want het onderhoudssysteem is gemigreerd (alle data is naar een nieuw systeem overgezet) en de oude data is misschien rommelig.\n\nDriepunts: (2 + 4 × 3 + 10) / 6 = 4 dagen werk. Hij kan er naast zijn gewone werk één dag per week aan besteden, dus de doorlooptijd is ongeveer 4 weken, geen 3 dagen. Je zet “data-analyse: 2 tot 10 weken, waarschijnlijk zo’n 4” in de planning en vertelt de sponsor dat je na de eerste export weet aan welke kant het uitkomt.',
      },
      said: 'Wat je hoort in projecten: “Dat is hooguit twee dagen werk. Doe ik volgende week wel even.”',
      recall: [
        {
          q: 'Driepuntsschatting van de inspanning: optimistisch 4, meest waarschijnlijk 6, pessimistisch 14 dagen. Wat is de schatting in dagen met (O + 4M + P) / 6?',
          number: 7,
          tolerance: 0.1,
          unit: 'dagen',
          why: '(4 + 4 × 6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = 7.',
        },
        {
          q: 'Een ploegleider heeft 24 uur werk (inspanning) aan een taak en 4 uur per week voor het project. Hoeveel kalenderweken duurt het, zonder vakanties?',
          number: 6,
          tolerance: 0.1,
          unit: 'weken',
          why: '24 / 4 = 6 weken: werk is geen doorlooptijd.',
        },
        {
          q: 'Waarom één zichtbare buffer (reservetijd) aan het eind in plaats van extra ruimte in elke taak?',
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
        scene: 'Je zit in een stuurgroep (steering group, het vaste overleg waar de sponsor voortgang checkt en beslist) bij een maker van metalen onderdelen. De sponsor vraagt: “Dus wanneer is het nieuwe planningsproces live?” Je hebt nog niet met IT gesproken over de systeemaanpassingen.',
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
          model: '“Terecht, je hebt iets nodig voor de directie. Zonder IT zit het ergens tussen juni en september; de systeemaanpassing is de grote onbekende. Ik spreek IT deze week en geef je volgende week woensdag een vaste bandbreedte. Dan is de datum die je doorgeeft er een die we halen.”',
          rubric: [
            'Erkent dat hij een datum nodig heeft',
            'Geeft een eerlijke bandbreedte en benoemt de onbekende',
            'Belooft een stap met datum die de bandbreedte versmalt',
          ],
        },
      },
      sayIt: 'Leg een engineer bij de klant in 60 seconden uit waarom je naar een beste en slechtste geval vraagt in plaats van één getal.',
      terms: [
        { term: 'Bandbreedte', def: 'Een schatting als onder- en bovengrens, zoals “zes tot tien weken”, in plaats van één getal.' },
        { term: 'Driepuntsschatting', def: 'Optimistisch, meest waarschijnlijk en pessimistisch, vaak gecombineerd als (O + 4M + P) / 6.' },
        { term: 'Planning fallacy', def: 'De neiging om tijd te onderschatten door uit te gaan van het beste geval.' },
        { term: 'Inspanning', def: 'Het aantal uren werk dat een taak kost, los van wanneer die uren vallen.' },
        { term: 'Doorlooptijd', def: 'Kalendertijd van start tot klaar, afhankelijk van hoeveel uur per week mensen hebben.' },
        { term: 'Buffer', def: 'Eén zichtbaar blok reservetijd voor wat misgaat, dat je volgt in plaats van verstopt in elke taak.' },
      ],
    },
    {
      id: 'pm.plan.schedule',
      title: 'Kritiek pad en de planning op één A4',
      pre: [
        {
          q: 'Een taak die niet op het kritieke pad (de langste keten van taken die op elkaar wachten) ligt, loopt een week uit. Wat gebeurt er met de einddatum?',
          options: ['Die schuift een week op', 'Die schuift twee weken op', 'De hele planning moet opnieuw', 'Niets, zolang de uitloop binnen de speling van die taak valt'],
          answer: 'Niets, zolang de uitloop binnen de speling van die taak valt',
          why: 'Alleen de langste keten van afhankelijke taken bepaalt de einddatum; speling is hoeveel een taak mag uitlopen zonder dat die verschuift.',
        },
      ],
      teach: [
        'Een afhankelijkheid betekent dat sommig werk pas kan beginnen als ander werk af is. Je kunt de nieuwe gereedheidscheck niet testen voordat de planners ermee akkoord zijn.\n\nBreng ze in kaart door elke eigenaar te vragen: “Wat heb je van een ander nodig voordat je kunt beginnen?” Bij klanten gaan de meeste afhankelijkheden over mensen en besluiten, niet over taken: een handtekening, de OR (ondernemingsraad, works council), een productiestop.',
        'Een kritiek pad (critical path) is de langste keten van afhankelijk werk van start tot eind. Die bepaalt de einddatum. De methode stamt uit 1957, van DuPont en Remington Rand.\n\nTaken buiten dat pad hebben speling: ze mogen een beetje uitlopen zonder dat het eind verschuift. Dus je houdt het kritieke pad scherp in de gaten en raakt niet in paniek over de rest. Moet het sneller, dan helpt alleen het kritieke pad korter maken. Maak je het te kort, dan wordt een andere keten kritiek.',
        'Een mijlpaal is een moment, geen activiteit: “gereedheidscheck vastgesteld”, “pilot start”. De belangrijkste soort is een go/no-go: het besluit om door te gaan of uit te rollen (overal in te voeren), of te stoppen.\n\nGoede mijlpalen zijn besluiten of zichtbare resultaten, ongeveer elke drie tot zes weken. Ze geven de stuurgroep (steering group, het vaste besluitoverleg met de sponsor) iets om te checken en het team iets om op te mikken.',
        'Zet de planning op één A4 als Gantt-chart, genoemd naar Henry Gantt, die zulke schema’s in de jaren 1910 tekende: resultaten als rijen, weken als kolommen, balken voor het werk, mijlpalen als ruitjes, een eigenaar per rij. Leg hem naast de kalender van de klant: stops, vakanties, piekseizoen, stuurgroepdatums.\n\nHang hem op waar het team werkt. Een planning die mensen elke dag zien, wordt gecorrigeerd; een planning in een map wordt vergeten.',
        'Bekende valkuil: de planning toont alleen taken die het team zelf in de hand heeft, en de trage stappen buiten het team ontbreken, zoals IT-toegang, een leverancier of een vergunning. Juist die blijken vaak het kritieke pad.\n\nOver software verschillen experts: grote tools als MS Project (planningssoftware van Microsoft) rekenen de paden voor je uit, maar een planning aan de muur krijgt meer correcties van de vloer. Scherpe vraag bij elke review: “Wat moet er deze maand gebeuren om de einddatum te halen?”',
      ],
      example: {
        kind: 'worked',
        text: 'Een planningsproject bij een netbeheerder.\n\nDe nulmeting (A) duurt 3 weken. Dan twee ketens: de gereedheidscheck ontwerpen (B, 4 weken) met daarna de planners trainen (D, 2 weken); en systeemtoegang regelen voor de pilotregio (C, 6 weken), ook voor de pilot. De pilot (E, 6 weken) heeft D en C nodig.\n\nKeten A-B-D-E = 3 + 4 + 2 + 6 = 15 weken. Keten A-C-E = 3 + 6 + 6 = 15 weken. Allebei kritiek.\n\nJe vraagt IT of de toegangsaanvraag in week 1 kan starten in plaats van na de nulmeting: dan loopt C naast A. De einddatum blijft 15 weken, maar de toegangsketen heeft nu 3 weken speling, dus vertraging bij IT schuift het eind niet meer op.',
      },
      said: 'Wat je hoort in projecten: “Die datum is prima, als IT op tijd levert. Heeft iemand IT eigenlijk al gevraagd?”',
      recall: [
        {
          q: 'Twee ketens, waarin elke taak pas begint als de vorige af is: A (3 weken) dan B (4) dan D (2); en A (3) dan C (6) dan D (2). Hoeveel weken is het kritieke pad?',
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
        scene: 'Je zit bij een maker van kunststof onderdelen. Volgens je planning gaat de nieuwe ploegoverdracht (hoe de ene ploeg de stand van de lijn doorgeeft aan de volgende) in week 20 live. Bij de koffie zegt een teamleider dat de fabriek in week 19 en 20 stilligt, en dat de helft van de operators direct daarna op vakantie gaat.',
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
        { term: 'Afhankelijkheid', def: 'Een koppeling waarbij het ene werk pas kan beginnen als ander werk af of besloten is.' },
        { term: 'Kritiek pad', def: 'De langste keten van afhankelijk werk; die bepaalt de einddatum.' },
        { term: 'Speling', def: 'Hoeveel een taak kan uitlopen zonder dat de einddatum verschuift (slack).' },
        { term: 'Mijlpaal', def: 'Een moment met een besluit of zichtbaar resultaat, geen activiteit.' },
        { term: 'Go/no-go', def: 'Een mijlpaal waarop iemand besluit door te gaan of uit te rollen, of te stoppen.' },
        { term: 'Gantt-chart', def: 'Een planning met het werk als balken langs een tijdlijn, mijlpalen als ruitjes, één rij per resultaat.' },
      ],
    },
    {
      id: 'pm.plan.risk',
      title: 'Een risicolijst die gebruikt wordt',
      pre: [
        {
          q: 'Wat is het belangrijkste doel van een pre-mortem (een sessie waarin je je voorstelt dat het project al mislukt is)?',
          options: ['Het projectbudget berekenen', 'Vooraf de schuld verdelen', 'Het veilig maken om te benoemen waarom het project zou kunnen mislukken', 'De risicolijst vervangen'],
          answer: 'Het veilig maken om te benoemen waarom het project zou kunnen mislukken',
          why: 'Als je mislukken als feit voorstelt, zeggen mensen wat ze anders voor zich houden.',
        },
      ],
      teach: [
        'Een risico is iets wat kan gebeuren en het project pijn zou doen. Een risicolijst (risk register) zet ze op een rij, elk met een kans, een impact (hoe erg), een risico-eigenaar en een actie met een datum.\n\nDe risico-eigenaar is één persoon die het in de gaten houdt en handelt, geen afdeling. “Data kan slecht zijn” helpt niet. “De onderhoudsdata van voor 2023 is na de overstap naar het nieuwe systeem misschien onbruikbaar; eigenaar: Pieter; actie: testexport in week 1” wel.',
        'Veel teams scoren kans en impact van 1 tot 5 en vermenigvuldigen, dus een risico scoort 1 tot 25. Zie die score als sorteerhulp, niet als waarheid: een 12 is niet echt erger dan een 10.\n\nDe actie is de beheersmaatregel (mitigation): wat je nu doet om het risico kleiner of minder schadelijk te maken. “Monitoren” is geen beheersmaatregel. “Testexport in week 1” wel.',
        'De meeste risicolijsten sterven na de kick-off. Houd de jouwe levend: alleen de top vijf komt in elke stuurgroep langs, en de eigenaar vertelt wat er sindsdien gebeurd is.\n\nRisico’s die uitkomen worden issues: problemen die nu spelen en aangepakt moeten worden, niet alleen gevolgd. Voeg nieuwe risico’s toe zodra je ze hoort, vaak bij het koffieapparaat.',
        'De pre-mortem, beschreven door Gary Klein in 2007: “Stel, het is over zes maanden en dit project is mislukt. Schrijf alleen op waarom.” Haal daarna per ronde één reden per persoon op.\n\nOmdat het mislukken als feit wordt voorgesteld, noemen mensen dingen die ze anders niet zeggen: de sponsor vertrekt misschien, de nachtploeg accepteert het niet, de IT-aanpassing heeft geen budget. Klein haalt Mitchell, Russo en Pennington (1989) aan: met deze “prospective hindsight” (terugkijken vanuit een bedachte toekomst) noemden mensen zo’n 30% beter de juiste redenen.',
        'De mensenkant: sommige risico’s zijn gevoelig, zoals “de plantmanager gelooft er eigenlijk niet in”. Zet dat niet in een lijst die de plantmanager leest. Formuleer het als thema (“sponsorschap en zichtbare steun”) en bespreek het echte punt één op één met wie er iets aan kan doen.\n\nWeet je niet hoe groot de kans is, zeg dat en plan een goedkope test. Scherpe vraag per toprisico: “Wat zien we als eerste als dit begint te gebeuren?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij de kick-off van een stilstandproject bij een bakkerij doe je een pre-mortem van 20 minuten met zes mensen. Redenen die boven komen: “onderhoud had nooit tijd door de zomerpiek” (drie mensen), “operators stopten na twee weken met stops registreren”, “de nieuwe manager blies het af”. De belangrijkste maak je tot regels in de risicolijst.\n\nZomerpiek: kans hoog, impact hoog, eigenaar de onderhoudsmanager, actie: analyse voor juni plannen en per monteur 4 uur per week reserveren. Registreren: eigenaar de ploegleider, actie: registreren met één tik op de lijnterminal (het scherm bij de lijn) voor week 3. Elke stuurgroep begint met deze vijf.',
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
        scene: 'Je zit bij de kick-off van een project bij een netbeheerder om de werkvoorbereiding (vergunningen, materiaal en ploegen klaarzetten voor een klus) te versnellen. De sfeer is beleefd. Niemand noemt zorgen, maar vorige week hoorde je van een planner dat “dit al twee keer eerder geprobeerd is”.',
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
        { term: 'Risico-eigenaar', def: 'De ene persoon die een risico volgt en zorgt dat de actie gebeurt.' },
        { term: 'Beheersmaatregel', def: 'Een actie die je nu neemt om een risico kleiner of minder schadelijk te maken.' },
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
          options: ['Wat de sponsor (de senior persoon die het project steunt en betaalt) echt gaat doen', 'Wie notuleert', 'Wie de vergaderruimtes boekt', 'Wie de consultant is'],
          answer: 'Wat de sponsor (de senior persoon die het project steunt en betaalt) echt gaat doen',
          why: 'Sponsors worden wel genoemd, maar hun taken worden zelden uitgeschreven, dus ze verdwijnen stilletjes.',
        },
      ],
      teach: [
        'RACI is een tabel met rollen per resultaat (deliverable), met vier letters. In Nederland gebruik je gewoon de Engelse woorden.\n\nResponsible: wie het werk doet. Accountable: wie eigenaar is van het resultaat en zegt “dit is af”, precies één persoon. Consulted: wie vooraf input geeft, in gesprek. Informed: wie het achteraf hoort, eenrichtingsverkeer.\n\nTwee namen onder A betekent dat niemand eigenaar is. Tien namen die allemaal C zijn, betekent trage besluiten.',
        'Eén eigenaar per resultaat, waar het kan van de kant van de klant. Jij kunt responsible zijn voor de analyse; de planningsmanager moet accountable zijn voor het nieuwe planningsproces, want hij moet het draaien als jij weg bent.\n\nWil de klant geen enkel resultaat bezitten, dan heb je een project waar ze naar kijken, niet een project dat ze doen. Dat is een rode vlag (red flag, een waarschuwingssignaal) om in week één te benoemen.',
        'Maak de rol van de sponsor expliciet: de senior persoon bij de klant die het project steunt, beslist en obstakels opruimt. Schrijf het samen met hem op: zit elke vier weken de stuurgroep voor, beslist binnen een week over scopewijzigingen, ruimt obstakels op die jij escaleert, en legt de organisatie uit waarom dit ertoe doet.\n\nVraag: “Waar kan ik op je rekenen, en hoe bereik ik je als iets vastzit?”',
        'Het RACI-gesprek brengt conflicten boven. Twee managers denken allebei dat zij over het ploegenrooster beslissen.\n\nLos het niet zelf op: “Ik zie hier twee namen staan. Wie beslist er als jullie het oneens zijn?” Komen ze er niet uit, dan gaat het naar de sponsor. Liever in week 2 ontdekken dan in week 12.',
        'Bekende valkuilen: een RACI die de consultant alleen maakte en nooit besprak; te veel C’s, zodat elke keuze op een rondje meningen wacht; de tabel opgeborgen en vergeten.\n\nOver varianten verschillen experts. Sommigen voegen een S toe voor Support (RASCI); anderen gebruiken DACI, met een D voor de ene Driver en een A voor de Approver. De letters tellen minder dan het gesprek. Scherpe vraag: “Als dit misgaat, wiens telefoon gaat dan?”',
      ],
      example: {
        kind: 'worked',
        text: 'Project om de wekelijkse productieplanning bij een kabelfabrikant te verbeteren. Je maakt een eerste RACI voor vier resultaten.\n\nVoor “nieuw wekelijks planningsoverleg”: R de planner, A de operations manager, C de ploegleiders en verkoop, I de plantmanager. Voor “capaciteitsmodel” (een sheet met hoeveel uur elke machine per week kan maken): R jij, A de planner.\n\nDaarna zit je 30 minuten met de sponsor, de plantmanager, en spreek je vier dingen op papier af: hij zit elke vier weken de stuurgroep voor, beslist binnen een week over scope, opent het gesprek met verkoop als je daar vastloopt, en vertelt de ploegleiders in het maandoverleg waarom dit project ertoe doet.',
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
        { term: 'Responsible', def: 'Degene of degenen die het werk aan een resultaat doen.' },
        { term: 'Accountable', def: 'De ene persoon die eigenaar is van het resultaat en zegt dat het af is.' },
        { term: 'Consulted', def: 'Mensen die vooraf om input gevraagd worden, in gesprek over en weer.' },
        { term: 'Informed', def: 'Mensen die achteraf over het resultaat horen, eenrichtingsverkeer.' },
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
        'Waterval (waterfall): fases op volgorde, analyseren, ontwerpen, bouwen, invoeren, met een vaste scope (wat het project omvat). Dat past bij werk dat voorspelbaar is en later moeilijk te veranderen, zoals een nieuw MS-station (middenspanningsstation in de wijk) plaatsen of een productielijn verhuizen.\n\nJe plant één keer in detail en stuurt op afwijkingen. Elke fase wordt afgetekend voordat de volgende begint.',
        'Agile: werken in korte rondes die elk eindigen met iets werkends waar gebruikers op reageren. De scope beweegt mee met wat je leert. Het woord komt uit het Agile Manifesto, in 2001 geschreven door zeventien softwareontwikkelaars.\n\nDat past bij werk waar de oplossing onduidelijk is en de reactie van gebruikers telt, zoals een nieuw planningsoverleg of een nieuw dashboard (een scherm met kerncijfers) voor ploegleiders.',
        'Scrum is de bekendste agile methode. De rondes heten sprints: een vaste periode van hooguit een maand, vaak twee weken. Elke sprint begint met een korte planning en eindigt met een review, waarin gebruikers het resultaat zien, en een terugblik op hoe het team werkte (retrospective).\n\nIn een fabriek heb je de volledige methode zelden nodig. De kern is genoeg: korte rondes, aan het eind iets echts, en feedback van de vloer.',
        'De meeste verbeterprojecten zijn hybride: vaste mijlpalen (milestones), budget en einddatum voor de stuurgroep, en korte rondes daarbinnen. De stuurgroep ziet “pilot live in week 10”; het team werkt daar in rondes van twee weken naartoe.\n\nEen pilot is een kleine, afgebakende proef op één plek, met een einddatum en een weg terug. Experts twijfelen of pilots veel bewijzen: een pilot met extra aandacht scoort vaak beter dan de uitrol straks.',
        'De mensenkant: verkoop geen jargon. Een plantmanager die “scrum” hoort, denkt misschien aan software en chaos. Zeg: “We werken in rondes van twee weken, en elke ronde zie je iets werken op de vloer.”\n\nWeerstand: “De directie wil een volledig plan.” Geef ze de mijlpalenplanning; de rondes zijn hoe het team er komt. Twijfel je welke aanpak past, vraag dan: “Hoe zeker zijn we van hoe de oplossing eruitziet?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder leid je een project om een gereedheidscheck (controle dat vergunningen, materiaal en ploeg geregeld zijn) in te voeren voordat klussen in de weekplanning komen. Niemand weet precies welke checks ertoe doen.\n\nPlanning voor de stuurgroep: nulmeting klaar week 4, pilot live week 8, go/no-go voor uitrol week 16. Daarbinnen: rondes van twee weken.\n\nRonde 1: een papieren checklist met vijf checks, gebruikt door twee planners. Review: “check 4 kost te veel tijd en valt nooit af”, dus die gaat eruit. Ronde 2: de schakelplancheck erbij waar het bedrijfsvoeringscentrum om vroeg.\n\nIn week 8 is de checklist op 60 echte klussen getest, en de planners hebben hem mee vormgegeven, dus ze verdedigen hem.',
      },
      said: 'Wat je hoort in projecten: “Agile? We zijn geen softwarebedrijf. We hebben gewoon een planning met datums nodig.”',
      recall: [
        {
          q: 'Welk project past het best bij waterval?',
          options: ['Met operators een nieuwe ploegoverdracht ontwerpen', 'Een dashboard bouwen dat nog niemand heeft gezien', 'Een MS-station (middenspanningsstation) vervangen volgens een vast ontwerp', 'Een nieuwe manier van onderhoud plannen testen'],
          answer: 'Een MS-station (middenspanningsstation) vervangen volgens een vast ontwerp',
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
          model: '“Terecht, een pilot die een puinhoop achterlaat is erger dan geen pilot. Ik ontwerp het gewoon goed. Het punt is om twee aannames te checken voordat we het overal uitrollen: één cel (een kleine groep machines en mensen), vier weken, met een einddatum en een weg terug. Aan het eind beslis jij of het breder gaat.”',
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
        { term: 'Agile', def: 'Werken in korte rondes die elk eindigen met iets waar gebruikers op reageren, met een scope die meebeweegt.' },
        { term: 'Scrum', def: 'De bekendste agile methode, met vaste sprints, een review met gebruikers en een terugblik van het team.' },
        { term: 'Sprint', def: 'Een korte ronde van één tot vier weken die eindigt met iets waar gebruikers op kunnen reageren.' },
        { term: 'Hybride', def: 'Vaste mijlpalen voor de stuurgroep, korte rondes voor het team.' },
        { term: 'Pilot', def: 'Een kleine, afgebakende proef op één plek, met een einddatum en een weg terug.' },
      ],
    },
  ],
};

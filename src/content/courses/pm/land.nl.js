// pm.land (Nederlands): landen, de verandering laten beklijven: adoptie, weerstand, communicatie, training, overdracht en borgen.
export default {
  lessons: [
    {
      id: 'pm.land.change',
      title: 'Wat adoptie echt drijft',
      pre: [
        {
          q: 'Wat voorspelt het best of operators een nieuwe werkwijze na het project blijven gebruiken?',
          options: ['Hoe goed de trainingsslides waren', 'Of hun directe leidinggevende ernaar vraagt en het zelf gebruikt', 'Hoeveel mails het aankondigden', 'Of de directeur de kick-off opende'],
          answer: 'Of hun directe leidinggevende ernaar vraagt en het zelf gebruikt',
          why: 'Mensen doen waar hun directe baas dag in dag uit aandacht aan besteedt.',
        },
      ],
      teach: [
        'Verandermanagement is het werk om mensen echt op de nieuwe manier te laten werken. Twee modellen die je gaat horen.\n\nDe acht stappen van Kotter (John Kotter, Leading Change, 1996) zijn voor de organisatie: urgentie creëren, een groep vormen die het trekt, het beeld helder maken, het communiceren, obstakels weghalen, snelle zichtbare successen boeken (quick wins), doorzetten, en het verankeren in hoe dingen werken.',
        'ADKAR, van het bureau Prosci (Jeff Hiatt), is voor één persoon: Awareness (ik weet dat het verandert), Desire (ik wil het), Knowledge (ik weet hoe), Ability (ik kan het in de praktijk), Reinforcement (het blijft beloond worden).\n\nGebruik het als diagnose, niet als slide. Niet bewust: ze moeten het van hun baas horen. Geen zin: zoek uit wat ze kwijtraken. Geen kennis: uitleggen. Kunnen het niet: oefenen op de werkplek. Geen bekrachtiging: iemand moet er elke week naar vragen.',
        'Adoptie betekent dat mensen de nieuwe manier echt gebruiken, ook als niemand kijkt. Wat het in de praktijk drijft: de nieuwe manier is makkelijker dan de oude voor wie het werk doet; hun directe baas vraagt ernaar; ze hebben het mee vormgegeven; en de oude manier is weg, dus er is geen terugvaloptie (fallback).\n\nKost het nieuwe proces de operator meer tijd dan het oude, dan redt geen enkele campagne het.',
        'De mensenkant: zeg de reden in hun termen. Niet “om de OEE te verbeteren”, het cijfer voor hoeveel van zijn geplande tijd een lijn goed product maakt, maar “zodat je niet op zaterdag wordt opgeroepen omdat de lijn achterloopt”.\n\nWeet je niet waarom mensen niet meegaan, vraag het vijf van hen: “Wat maakt dit lastig om te gebruiken?” Meestal hoor je één praktisch ding dat je deze week kunt oplossen.',
        'Let op de weken na de livegang, de dag dat de nieuwe manier officieel start. Dan lokt de oude manier en komen de problemen boven.\n\nExperts twisten over de bekende claim dat 70% van de veranderprogramma’s mislukt: een overzichtsstudie van Mark Hughes uit 2011 vond er geen stevig bewijs voor. Het model van Kotter krijgt ook kritiek als te veel van bovenaf. Stel de scherpe vraag: “Wat verliest de operator als hij op de nieuwe manier werkt?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een verpakkingsbedrijf moeten operators elke stop langer dan 2 minuten op een nieuwe terminal registreren, een touchscreen-pc naast de lijn. Na zes weken is maar 40% van de stops geregistreerd. Je loopt de vloer op en vraagt het acht operators.\n\nIedereen weet ervan (bewustzijn prima) en weet hoe het moet (kennis prima). Maar drie zeggen: “Er wordt toch nooit iets mee gedaan.” En twee zeggen dat de terminal aan het eind van de lijn staat, 30 meter van waar de stops gebeuren.\n\nTwee oplossingen: de ploegleider opent elke ploegstart met de top drie stops van gisteren en wat ermee gebeurt (zin, bekrachtiging), en onderhoud verplaatst de terminal naar het midden van de lijn (kunnen). Vier weken later: 85% geregistreerd.',
      },
      said: 'Wat je hoort in projecten: “Ze hebben allemaal de training gehad. Ze willen gewoon niet veranderen.”',
      recall: [
        {
          q: 'Operators kennen het nieuwe proces en willen het ook, maar op een drukke dienst lukt het ze nog niet snel genoeg, dus vallen ze terug in de oude manier. Waar in ADKAR zitten ze vast?',
          options: ['Awareness', 'Desire', 'Ability', 'Knowledge'],
          answer: 'Ability',
          why: 'Ze weten het en willen het, maar kunnen het in de praktijk nog niet betrouwbaar: ze hebben oefening en steun op de werkplek nodig.',
        },
        {
          q: 'Welke van deze drijft adoptie het meest?',
          options: ['Een postercampagne', 'Dat de nieuwe manier makkelijker is dan de oude voor wie het werk doet', 'Een sterk projectlogo', 'Een bericht van het hoofdkantoor'],
          answer: 'Dat de nieuwe manier makkelijker is dan de oude voor wie het werk doet',
          why: 'Kost de nieuwe manier ze meer moeite, dan glijden ze terug.',
        },
        {
          q: 'Waarom haal je de oude werkwijze weg als dat kan?',
          options: ['Om mensen die tegenwerken te straffen', 'Omdat Kotter het voorschrijft', 'Om te besparen op tools', 'Zodat er geen terugvaloptie is als het druk wordt'],
          answer: 'Zodat er geen terugvaloptie is als het druk wordt',
          why: 'Onder druk grijpen mensen terug naar wat ze kennen, als het er nog is.',
        },
        {
          q: 'Mensen gaan niet mee en je weet niet waarom. Wat is de beste eerste stap?',
          options: ['Een paar van hen vragen wat het lastig maakt om te gebruiken', 'Een herinneringsmail sturen', 'De training herhalen', 'Het melden bij de sponsor'],
          answer: 'Een paar van hen vragen wat het lastig maakt om te gebruiken',
          why: 'De reden is vaak praktisch en snel op te lossen, maar alleen zij kunnen hem vertellen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder (grid operator), het bedrijf dat het regionale stroomnet beheert. Drie maanden geleden is een nieuwe app voor werkorders (work orders) uitgerold onder de monteurs: de app die zegt welke klus waar moet. De helft belt nog steeds de planner. De IT-lead zegt: “We hebben nog een trainingsronde nodig.”',
        ask: 'Wat vraag of doe je voordat je instemt met meer training?',
        model: 'Ik zou met twee of drie monteurs meerijden en vragen wat de app in het veld lastig maakt. Dan kijken waar ze vastzitten: weten ze hoe het moet maar hebben ze geen bereik of tijd, of zien ze het nut niet? En ik zou vragen of hun teamleiders de data uit de app gebruiken in hun eigen ochtendoverleg. Training helpt alleen als kennis het probleem is.',
        rubric: [
          'Gaat het veld in om de echte reden te vinden voordat hij een oplossing kiest',
          'Stelt vast waar mensen vastzitten in plaats van kennis aan te nemen',
          'Checkt of hun directe leidinggevenden het bekrachtigen',
        ],
        pushback: {
          lines: [
            '“De app werkt prima. De monteurs moeten het gewoon leren. Training is wat we altijd doen.”',
            '“Als je monteurs gaat vragen waarom, krijg je alleen geklaag over IT.”',
          ],
          model: '“De app kan prima werken, en training kan er een deel van zijn. Voordat we nog een ronde doen, wil ik weten waarom de helft nog belt. Ik rij deze week met twee monteurs mee. Is het kunde, dan trainen we. Is het iets anders, dan lost training het niet op.”',
          rubric: [
            'Erkent zijn beeld dat de app werkt',
            'Houdt vast aan eerst de oorzaak vinden',
            'Stelt een snelle, concrete manier voor om dat te achterhalen',
          ],
        },
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom een goede training geen garantie is dat mensen een nieuw proces gaan gebruiken.',
      terms: [
        { term: 'Verandermanagement', def: 'Het werk om mensen een nieuwe werkwijze echt te laten oppakken.' },
        { term: 'Kotter', def: 'Acht stappen voor organisatieverandering, van urgentie tot verankeren in de cultuur.' },
        { term: 'ADKAR', def: 'Awareness, Desire, Knowledge, Ability, Reinforcement: de stappen die één persoon doorloopt in een verandering.' },
        { term: 'Adoptie', def: 'Dat mensen de nieuwe werkwijze echt gebruiken, ook als niemand kijkt.' },
        { term: 'Livegang', def: 'De dag dat de nieuwe werkwijze of het nieuwe systeem officieel start.' },
      ],
    },
    {
      id: 'pm.land.resistance',
      title: 'Werken met weerstand',
      pre: [
        {
          q: 'Waar kun je als consultant het makkelijkst mee werken?',
          options: ['Open weerstand met argumenten', 'Beleefde stille instemming', 'Niemand die komt opdagen', 'Een team dat overal ja op zegt'],
          answer: 'Open weerstand met argumenten',
          why: 'Open weerstand vertelt je wat er mis is; stille instemming verbergt het tot de livegang.',
        },
      ],
      teach: [
        'Weerstand is dat mensen een verandering afremmen of blokkeren. Er zijn drie vormen.\n\nOpen weerstand: argumenten, boosheid, “dit gaat niet werken”. Passieve weerstand: ja in het overleg, daarna niks; “te druk”; mensen die sessies missen. Verborgen weerstand: “dat hebben we in 2019 ook geprobeerd”, de oude spreadsheet stiekem bijhouden, data die nooit komt.\n\nOpen weerstand is een cadeau: het vertelt je waar je aan moet werken. De andere twee zijn lastiger, want die moet je eerst vinden.',
        'Weerstand vertelt je iets echts. Meestal een van deze: een verlies, iets wat ze opgeven (status, vakmanschap, controle, overwerkgeld); extra werk voor ze; een eerder project dat mislukte en waarvoor zij de prijs betaalden; of een fout in jouw ontwerp die zij zien en jij niet.\n\nVraag voordat je oordeelt: “Wat zou er moeten kloppen om dit voor jou te laten werken?”',
        'Werk ermee, niet ertegen. Haal de scherpste criticus bij het ontwerp: zijn bezwaren maken het beter, en een overtuigde criticus overtuigt anderen meer dan jij ooit zult doen.\n\nDat is oud nieuws. In 1948 lieten Coch en French in een pyjamafabriek in Virginia zien dat arbeiders die een nieuwe werkwijze mee ontwierpen sneller hun productie terugkregen, en minder vaak opstapten, dan arbeiders die het gewoon opgelegd kregen.',
        'Wees eerlijk als een verlies echt is: “Ja, je raakt het zaterdagse overwerk kwijt. Dit is waarom we het toch goed vinden.”\n\nPlak in gesprekken met het management geen label “dwarsligger” op mensen; dat blijft plakken en sluit de deur. Weet je niet wat erachter zit, drink dan koffie met die persoon, één op één, weg van het overleg. Vraag naar zijn ervaring met eerdere veranderingen; daar hoor je vaak het echte verhaal.',
        'Je hoort over de verandercurve (change curve): schok, ontkenning, frustratie, dan acceptatie. Managementschrijvers leenden die van de fases die Elisabeth Kübler-Ross in 1969 beschreef bij stervende patiënten; zij schreef niet over organisaties. Een nuttige herinnering dat een dip in de stemming normaal is, maar er is weinig bewijs dat mensen vaste fases doorlopen.\n\nExperts twisten ook over het woord zelf: velen zeggen met Ronald Heifetz dat mensen zich niet tegen verandering verzetten, maar tegen verlies. Wat vaak misgaat: alle weerstand behandelen als onwil.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een metaalbedrijf blijft de meest ervaren insteller, Henk, die de persen voor elke nieuwe order instelt, zeggen dat het nieuwe planbord “voor kantoormensen” is. In overleggen slaat hij zijn armen over elkaar; zijn collega’s volgen hem.\n\nJe vraagt hem mee voor koffie en vraagt waar hij zich zorgen over maakt. Hij vertelt dat hij vroeger op de vloer de volgorde bepaalde, en dat nu een planner dat vanaf kantoor doet. En: de planner weet niet dat de grote pers na een weekend 40 minuten moet opwarmen.\n\nJe nodigt Henk uit om met de planner de regels voor het bord op te stellen. De opwarmregel komt erin. Twee weken later legt Henk het bord zelf uit aan de nachtploeg.',
      },
      said: 'Wat je hoort in projecten: “Precies dit hebben we in 2019 ook geprobeerd. Toen werkte het ook niet.”',
      recall: [
        {
          q: 'Mensen zeggen ja in overleggen, maar daarna gebeurt er niks. Welke vorm van weerstand is dit?',
          options: ['Open', 'Verborgen', 'Passief', 'Helemaal geen weerstand'],
          answer: 'Passief',
          why: 'Instemmen in de zaal en daarna niet handelen is de typische passieve vorm.',
        },
        {
          q: 'Waarom betrek je de scherpste criticus bij het ontwerp?',
          options: ['Om hem bezig te houden', 'Zijn bezwaren maken het ontwerp beter en hij overtuigt anderen', 'Om het management te laten zien wie dwarsligt', 'Omdat het formeel verplicht is'],
          answer: 'Zijn bezwaren maken het ontwerp beter en hij overtuigt anderen',
          why: 'Critici zien vaak echte fouten, en een overtuigde criticus heeft geloofwaardigheid die jij mist.',
        },
        {
          q: 'Een operator raakt echt zijn zaterdagse overwerkgeld kwijt. Wat zeg je?',
          options: ['Niks, misschien komt het niet ter sprake', 'Dat het niet jouw besluit is', 'Dat hij op de lange termijn meer verdient', 'Het verlies eerlijk erkennen en uitleggen waarom je het toch goed vindt'],
          answer: 'Het verlies eerlijk erkennen en uitleggen waarom je het toch goed vindt',
          why: 'Een echt verlies ontkennen sloopt vertrouwen; het benoemen houdt het heel.',
        },
        {
          q: 'Welke vraag brengt het best boven waar de weerstand over gaat?',
          options: ['“Wat zou er moeten kloppen om dit voor jou te laten werken?”', '“Waarom ben je hiertegen?”', '“Snap je het plan?”', '“Wie heeft je dat verteld?”'],
          answer: '“Wat zou er moeten kloppen om dit voor jou te laten werken?”',
          why: 'Het nodigt uit tot voorwaarden en zorgen in plaats van verdediging.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet, en voert een nieuwe gereedheidscheck (readiness check) in: de check of elke klus mensen, materiaal en vergunningen heeft voordat hij wordt ingepland. De planners doen mee, maar een groep ervaren werkvoorbereiders (work preparers), die per klus tekeningen, materiaal en vergunningen klaarzetten, blijft zeggen “dit is alleen maar extra papierwerk” en hun checklists komen half ingevuld binnen.',
        ask: 'Hoe pak je dit aan?',
        model: 'Ik zou met twee van hen apart gaan zitten en vragen wat in de checklist als papierwerk voelt en wat hem voor hen nuttig zou maken. Misschien hebben ze gelijk dat sommige checks zinloos zijn. Daarna zou ik een van hen uitnodigen om de checklist met de planners te herzien, en schrappen wat niks toevoegt. En ik zou ze bij hun leidinggevende niet als dwarsliggers neerzetten.',
        rubric: [
          'Praat apart met hen om het bezwaar te begrijpen',
          'Behandelt hun bezwaar als mogelijk terecht en verbetert het ontwerp',
          'Betrekt hen bij het herzien en vermijdt labels',
        ],
        pushback: {
          lines: [
            '“We bereiden al twintig jaar klussen voor zonder jouw checklist. Het is gewoon extra papierwerk.”',
            '“Als het management het wil, prima, dan vullen we het in. Verwacht niet dat we het leuk vinden.”',
          ],
          model: '“Terecht, jullie kennen klussen beter dan welke checklist ook. Het gaat mij niet om papierwerk; ik wil minder klussen die op de dag zelf vervallen. Welke vragen zijn voor jullie zinloos? Die schrappen we donderdag samen. Wat overblijft, hebben jullie zelf gekozen.”',
          rubric: [
            'Erkent hun ervaring en het extra werk',
            'Maakt het doel achter de check duidelijk',
            'Stelt voor het samen concreet te verbeteren',
          ],
        },
      },
      sayIt: 'Leg een manager bij de klant in 60 seconden uit waarom weerstand nuttige informatie is en hoe je ermee werkt.',
      terms: [
        { term: 'Open weerstand', def: 'Argumenten en bezwaren die hardop gezegd worden; de makkelijkste vorm om mee te werken.' },
        { term: 'Passieve weerstand', def: 'In het openbaar instemmen maar niet handelen, sessies missen, “te druk” zijn.' },
        { term: 'Verborgen weerstand', def: 'De oude manier stilletjes in stand houden, of ondermijnen met “dat hebben we al geprobeerd”.' },
        { term: 'Verlies', def: 'Wat iemand opgeeft in een verandering: status, vakmanschap, controle, geld of gemak.' },
        { term: 'Verandercurve', def: 'Het idee dat de stemming tijdens een verandering eerst daalt en dan herstelt; nuttig, maar geen vaste fases.' },
      ],
    },
    {
      id: 'pm.land.communication',
      title: 'Verandering communiceren',
      pre: [
        {
          q: 'Van wie horen medewerkers het liefst wat een verandering betekent voor hun eigen werk?',
          options: ['De directeur', 'De projectconsultant', 'HR', 'Hun directe leidinggevende'],
          answer: 'Hun directe leidinggevende',
          why: 'Het topmanagement legt het waarom uit; de directe baas wordt vertrouwd op “wat betekent het voor mij”.',
        },
      ],
      teach: [
        'Een stakeholder is iedereen die door de verandering geraakt wordt of er invloed op heeft. Breng in kaart wie wat wanneer hoort. Groepen: direct geraakt (ze gaan anders werken), indirect geraakt (hun input of output verandert), en leidinggevenden.\n\nBeantwoord per groep vijf vragen: wat verandert er voor mij, wanneer, waarom, wat wordt er van mij verwacht, en waar kan ik terecht met vragen. Die tabel op één A4 is je communicatieplan.',
        'Volgorde doet ertoe. Leidinggevenden horen het voor hun teams, zodat ze vragen kunnen beantwoorden in plaats van verrast te worden. Dat doorgeven van laag naar laag heet een cascade. Laat mensen het nooit eerst op de gang of van een andere vestiging horen.\n\nIs er al een gerucht, communiceer dan dezelfde dag, ook als nog niet alles besloten is: “Dit weten we, dit nog niet, en dan wel.”',
        'De middenmanager, de ploegleider of teamleider tussen het topmanagement en de vloer, is het belangrijkste kanaal. De plantmanager kan het waarom uitleggen; de ploegleider is degene aan wie mensen vragen “wat betekent dit voor mijn maandag?”\n\nRust middenmanagers eerst toe: hun eigen vragen beantwoord, drie kernboodschappen, de hoofdpunten die ze in eigen woorden kunnen zeggen, en een korte lijst met te verwachten vragen en antwoorden.',
        'Herhaal. Eén boodschap in één overleg is geen communicatie. Een town hall, één grote bijeenkomst voor al het personeel, is goed voor het waarom, maar mensen moeten het een paar keer horen, op een paar manieren: het bord, de ploegstart, een één-op-ééngesprek. Kotter (1995) schatte uit ervaring dat leiders hun visie tien keer te weinig communiceren.\n\nCheck of het geland is: vraag een paar mensen wat ze begrepen hebben. Weet je een antwoord niet, zeg dat dan en zeg wanneer je het wel weet.',
        'Prosci, het adviesbureau achter ADKAR, meldt in zijn eigen enquêtes onder verandermanagers steeds dezelfde verdeling: medewerkers willen de zakelijke reden van het topmanagement horen, en wat het voor hun eigen werk betekent van hun directe leidinggevende.\n\nWat vaak misgaat: de cascade die halverwege stopt. De leidinggevenden zijn bijgepraat, maar de helft vertelde het nooit aan het team. Stel elke leidinggevende een week later de scherpe vraag: “Wie van je mensen heb je het verteld, en wat vroegen ze?”',
      ],
      example: {
        kind: 'worked',
        text: 'Een netbeheerder, het bedrijf achter het regionale stroomnet, verandert hoe geplande klussen worden vrijgegeven: vanaf volgende maand komt geen klus in de weekplanning zonder geslaagde gereedheidscheck (mensen, materiaal en vergunningen bevestigd).\n\nJe plan: week 1 vertelt het hoofd planning het de vijf teamleiders, met een FAQ van één A4, een lijst veelgestelde vragen met antwoorden, en hun eigen vragen beantwoord. Week 2 vertelt elke teamleider het zijn planners in het eigen teamoverleg, met drie kernboodschappen. Dezelfde week een kort bericht aan de teamleiders van uitvoering, omdat hun ploegen minder maar betrouwbaardere klussen gaan zien.\n\nWeek 3 en 4: de check staat bij elk planningsoverleg op het bord. In week 4 vraag je zes planners wat ze begrepen hebben. Twee denken dat de check optioneel is; dat zet je in het volgende overleg recht.',
      },
      said: 'Wat je hoort in projecten: “Niemand heeft ons iets verteld. We hoorden het van de jongens in Zwolle.”',
      recall: [
        {
          q: 'Wie moet als eerste horen over een verandering?',
          options: ['Iedereen tegelijk', 'De leidinggevenden, voor hun teams', 'De medewerkers die het meest geraakt worden', 'Alleen de OR (ondernemingsraad, works council)'],
          answer: 'De leidinggevenden, voor hun teams',
          why: 'Dan kunnen leidinggevenden de vragen van hun team beantwoorden in plaats van verrast te worden.',
        },
        {
          q: 'Er gaat al een gerucht rond over de verandering. Wat doe je?',
          options: ['Dezelfde dag communiceren wat je weet, wat nog niet, en wanneer wel', 'Wachten tot alles besloten is', 'Het gerucht ontkennen', 'Het negeren'],
          answer: 'Dezelfde dag communiceren wat je weet, wat nog niet, en wanneer wel',
          why: 'Stilte laat het gerucht het verhaal bepalen; gedeeltelijke eerlijkheid wint het daarvan.',
        },
        {
          q: 'Hoe rust je middenmanagers het best toe?',
          options: ['Ze het projectplan sturen', 'Ze uitnodigen voor de stuurgroep', 'Eerst hun eigen vragen beantwoorden en ze kernboodschappen en te verwachten vragen geven', 'Ze het zelf laten uitzoeken'],
          answer: 'Eerst hun eigen vragen beantwoorden en ze kernboodschappen en te verwachten vragen geven',
          why: 'Ze kunnen alleen uitleggen wat ze zelf begrijpen en steunen.',
        },
        {
          q: 'Hoe check je of je boodschap geland is?',
          options: ['Tellen hoeveel mails geopend zijn', 'De leidinggevenden vragen of ze het doorgegeven hebben', 'Aannemen dat het goed is als niemand klaagt', 'Een paar mensen vragen wat ze begrepen hebben'],
          answer: 'Een paar mensen vragen wat ze begrepen hebben',
          why: 'Wat mensen begrepen hebben telt, niet wat jij verstuurd hebt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een levensmiddelenfabriek. Het nieuwe ploegenrooster (shift pattern: welke ploeg welke uren en dagen werkt) gaat over zes weken in. De plantmanager wil het volgende week in een town hall aankondigen en “dan zijn we klaar met communiceren”.',
        ask: 'Wat stel je voor?',
        model: '“De bijeenkomst is goed voor het waarom. Maar mensen gaan hun ploegleider vragen wat het betekent voor hun weekenden. Kunnen we de ploegleiders eerst bijpraten, met een FAQ, een blad met te verwachten vragen en antwoorden, zodat ze antwoord kunnen geven? Dan de bijeenkomst, dan praat elke ploegleider met zijn team in de ploegstart. En in week drie vragen we een paar operators wat ze begrepen hebben.”',
        rubric: [
          'Houdt de bijeenkomst voor het waarom maar voegt momenten toe',
          'Praat de ploegleiders bij en rust ze toe voor hun teams',
          'Plant herhaling en een check op wat er geland is',
        ],
        pushback: {
          lines: [
            '“Een town hall bereikt iedereen tegelijk. Meer sessies maken alleen onrust.”',
            '“De ploegleiders hebben genoeg te doen. Ik wil niet dat ze de hele week vragen moeten beantwoorden.”',
          ],
          model: '“De town hall is een goed begin; iedereen hoort het van jou. Maar mensen vormen hun mening echt in het gesprek met hun eigen ploegleider. Ik wil de ploegleiders een vraag-en-antwoordblad van één pagina geven en een kwartier bij elke ploegstart. Dat geeft minder onrust dan zes weken geruchten.”',
          rubric: [
            'Erkent de waarde van de town hall en zijn zorg',
            'Houdt vast aan meer dan één communicatiemoment',
            'Stelt een lichte, concrete opvolging via de ploegleiders voor',
          ],
        },
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom de middenmanager het belangrijkste kanaal is bij een verandering.',
      terms: [
        { term: 'Stakeholder', def: 'Iedereen die door de verandering geraakt wordt of er invloed op heeft.' },
        { term: 'Communicatieplan', def: 'Per groep: wat verandert er, wanneer, waarom, wat wordt verwacht, waar kun je terecht.' },
        { term: 'Cascade', def: 'Een boodschap laag voor laag doorgeven: eerst de leidinggevenden, dan hun teams.' },
        { term: 'Kernboodschappen', def: 'Drie of vier hoofdpunten die een leidinggevende in eigen woorden kan gebruiken.' },
        { term: 'Middenmanager', def: 'De ploegleider of teamleider tussen het topmanagement en de vloer.' },
        { term: 'Town hall', def: 'Eén grote bijeenkomst voor al het personeel, goed om het waarom uit te leggen.' },
      ],
    },
    {
      id: 'pm.land.training',
      title: 'Training en werkinstructies',
      pre: [
        {
          q: 'Wat is de beste check of een training gewerkt heeft?',
          options: ['Een tevredenheidsscore aan het eind van de training', 'Een schriftelijke toets', 'Een week later kijken hoe mensen de taak op de werkplek doen', 'Opkomstcijfers'],
          answer: 'Een week later kijken hoe mensen de taak op de werkplek doen',
          why: 'Alleen wat mensen op de werkplek doen telt; een training leuk vinden zegt weinig.',
        },
      ],
      teach: [
        'Schrijf de nieuwe manier op als korte werkinstructie: één A4 per taak, stappen op volgorde, foto’s van de echte apparatuur, en per stap het kernpunt, het detail waardoor het goed of fout gaat, plus waarom dat ertoe doet.\n\nSchrijf hem met de mensen die het werk doen en test hem: laat iemand die er niet bij was hem volgen terwijl jij kijkt. Waar hij aarzelt, is de instructie onduidelijk.',
        'Dit komt uit TWI, Training Within Industry, een Amerikaans oorlogsprogramma uit 1940 dat tot 1945 meer dan 1,6 miljoen certificaten uitreikte. De methode Job Instruction heeft vier stappen: de leerling voorbereiden, voordoen en uitleggen, zelf laten proberen terwijl jij corrigeert, en later nagaan hoe het gaat.\n\nHet motto geldt nog steeds: heeft de medewerker het niet geleerd, dan heeft de instructeur het niet goed uitgelegd. Toyota nam het in de jaren 50 over.',
        'Klaslokaal tegenover de werkplek. Een klaslokaal is goed voor het waarom en het grote plaatje, in 30 tot 60 minuten. Vaardigheden leer je met training op de werkplek: voordoen, samen doen, zelf laten doen terwijl jij kijkt, later checken.\n\nPloegleiders of ervaren operators zijn de beste trainers, als je hen eerst traint. Train vlak voordat mensen het nodig hebben; een sessie zes weken voor de livegang is dan grotendeels vergeten.',
        'Plan korte sessies in de week voor de livegang en begeleiding op de vloer in de eerste twee weken erna. Zorg dat elke ploeg aan bod komt, ook nacht en weekend, die projecten vaak vergeten.\n\nCheck of het blijft hangen: kijk een week later hoe mensen het zonder hulp doen, niet om ze te beoordelen, maar om te zien of de instructie of de training beter moet. Maken veel mensen dezelfde fout, dan is de instructie fout, niet de mensen.',
        'Trainers meten vaak het verkeerde. De Kirkpatrick-niveaus (Donald Kirkpatrick, 1959) zetten vier checks op een rij: vonden ze het leuk, hebben ze het geleerd, doen ze het op de werkplek, zijn de resultaten beter. De meeste projecten stoppen bij de eerste: een formulier met smileys.\n\nExperts twisten of een klaslokaal wel nodig is. De populaire 70-20-10-regel (70% leer je in het werk, 20% van anderen, 10% in cursussen) is een praktijkmodel met zwak bewijs. Ken je de taak niet goed, laat de expert trainen en check jij het resultaat.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netbeheerder voert een nieuwe manier in waarop monteurs revisiegegevens (as-built data: waar kabel en moffen, de verbindingen tussen kabelstukken, echt liggen) met een app doorgeven. Je schrijft met de teamleider een instructie van één A4: zes stappen, foto’s van de schermen, en het kernpunt “fotografeer de mof voordat de sleuf weer dichtgaat, want daarna kan het niet meer”. Een monteur die er niet bij was test hem; hij loopt vast bij stap 4, die je herschrijft.\n\nTraining: 30 minuten in het ochtendoverleg over het waarom, daarna gaat de teamleider mee met de eerste klus van elke monteur.\n\nEen week later check je 20 meldingen: 15 compleet, 5 zonder moffoto. Alle 5 komen van ploegen die om 6:00 beginnen, voordat de teamleider er is. Volgende week begint er een teamleider vroeger.',
      },
      said: 'Wat je hoort in projecten: “We hebben in maart iedereen getraind. In juni deden ze het weer op de oude manier.”',
      recall: [
        {
          q: 'Waar leer je vaardigheden het best?',
          options: ['In een klaslokaal met slides', 'Uit een instructie per mail', 'In een e-learning', 'Op de werkplek: voordoen, samen doen, zelf laten doen, checken'],
          answer: 'Op de werkplek: voordoen, samen doen, zelf laten doen, checken',
          why: 'Vaardigheden vragen oefening op de echte apparatuur, met feedback.',
        },
        {
          q: 'Na de training maken veel mensen dezelfde fout. Wat zegt dat?',
          options: ['Ze letten niet op', 'De instructie of de training moet beter', 'Ze verzetten zich tegen de verandering', 'Er moeten meer mensen getraind worden'],
          answer: 'De instructie of de training moet beter',
          why: 'Een gedeelde fout wijst naar het systeem, niet naar de mensen.',
        },
        {
          q: 'Wanneer train je mensen?',
          options: ['Vlak voordat ze het nodig hebben, met begeleiding in de eerste weken erna', 'Zo vroeg mogelijk, maanden vooraf', 'Pas na de livegang, als er problemen komen', 'Eén keer per jaar'],
          answer: 'Vlak voordat ze het nodig hebben, met begeleiding in de eerste weken erna',
          why: 'Training lang voor gebruik is grotendeels vergeten tegen de tijd dat je het nodig hebt.',
        },
        {
          q: 'Hoe test je een nieuwe werkinstructie?',
          options: ['Iemand die er niet bij was hem laten volgen terwijl jij kijkt', 'De schrijver hem nog eens laten lezen', 'Hem ter goedkeuring naar de manager sturen', 'De spelling controleren'],
          answer: 'Iemand die er niet bij was hem laten volgen terwijl jij kijkt',
          why: 'Waar een nieuwkomer aarzelt, is de instructie onduidelijk.',
        },
      ],
      situation: {
        scene: 'Je zit bij een kunststoffabriek. De nieuwe omstelchecklist, voor het omstellen (changeover) van een machine naar het volgende product, is in één klassikale sessie getraind voor de dagploeg. De nachtploeg kreeg de slides per mail. Maandag gaat het live.',
        ask: 'Wat doe je voor en na maandag?',
        model: 'Voor maandag zou ik een korte sessie voor de nachtploeg regelen, het liefst gegeven door hun eigen ploegleider, die ik eerst bijpraat. Na de livegang zorg ik dat er bij de eerste omstellingen in elke ploeg iemand op de vloer staat die het kent. Een week later kijk ik bij een paar omstellingen mee, zonder te oordelen, om te zien waar mensen vastlopen en de checklist of training te verbeteren.',
        rubric: [
          'Haalt de vergeten ploeg voor de livegang alsnog binnen',
          'Plant begeleiding op de werkplek in de eerste dagen',
          'Checkt een week later door mee te kijken, en verbetert de instructie waar nodig',
        ],
        pushback: {
          lines: [
            '“De nachtploeg zijn professionals. Die kunnen heus slides lezen. We schuiven de livegang niet.”',
            '“Een extra sessie ’s nachts kost overuren. Wie betaalt dat?”',
          ],
          model: '“Ik vraag niet om maandag te verschuiven. De nachtploeg zijn professionals, en toch laten slides niet zien waar het misgaat. Hun ploegleider en ik geven zondagavond een sessie van een halfuur bij hun ploegstart, en ik sta naast de eerste twee omstellingen van de nacht. Dat kost minder dan één slechte omstelling.”',
          rubric: [
            'Erkent de livedatum en de kosten',
            'Houdt vast aan praktische training voor de nachtploeg',
            'Stelt een kleine, concrete sessie en ondersteuning op de vloer voor',
          ],
        },
      },
      sayIt: 'Leg een teamleider in 60 seconden uit hoe je een nieuwe werkwijze traint zodat hij echt blijft hangen.',
      terms: [
        { term: 'Werkinstructie', def: 'Eén A4 per taak: stappen, foto’s, kernpunten en waarom ze ertoe doen.' },
        { term: 'Kernpunt', def: 'Het detail in een stap waardoor het goed of fout gaat.' },
        { term: 'TWI', def: 'Training Within Industry: een Amerikaans oorlogsprogramma uit de jaren 40; de methode Job Instruction leert een taak in vier stappen.' },
        { term: 'Training op de werkplek', def: 'Voordoen, samen doen, zelf laten doen, checken: leren in het echte werk.' },
        { term: 'Kirkpatrick-niveaus', def: 'Vier manieren om een training te checken: reactie, leren, gedrag op de werkplek, resultaat.' },
      ],
    },
    {
      id: 'pm.land.handover',
      title: 'Overdragen aan de lijn',
      pre: [
        {
          q: 'Wanneer is een overdracht aan de lijnorganisatie echt klaar?',
          options: ['Als de eindpresentatie gegeven is', 'Als de documentatie verstuurd is', 'Als de eigenaar het een paar cycli alleen gedraaid heeft en zonder jou een probleem heeft opgelost', 'Als de sponsor tekent'],
          answer: 'Als de eigenaar het een paar cycli alleen gedraaid heeft en zonder jou een probleem heeft opgelost',
          why: 'Eigenaarschap bewijs je met doen, niet met documenten of presentaties.',
        },
      ],
      teach: [
        'De lijnorganisatie, de gewone afdelingen en managers die het werk elke dag draaien, is eigenaar van het resultaat als jij weg bent. Benoem één proceseigenaar per nieuw proces: de persoon die verantwoordelijk is voor hoe het loopt en voor de KPI, de kritieke prestatie-indicator, het getal dat laat zien of het werkt.\n\nDe eigenaar heeft dagelijks contact met het werk, zoals een planningsmanager, en is geen staffunctie die er alleen over rapporteert.',
        'Wat de eigenaar alleen moet kunnen: de KPI lezen en weten wat normaal is, het reviewoverleg leiden, nieuwe mensen inwerken, de gewone problemen oplossen, en weten wie hij moet bellen voor de zeldzame.\n\nSchrijf dat op als overdrachtschecklist en vink het samen af, punt voor punt, als de eigenaar het in het echte werk laat zien, niet in een presentatie.',
        'Draag in stappen over. Eerst kijkt de eigenaar hoe jij het doet. Dan doet de eigenaar het terwijl jij ernaast zit. Dan doet hij het alleen en hoor jij er alleen nog over. Elke stap duurt een paar cycli, bijvoorbeeld drie weekoverleggen.\n\nZet de KPI’s in de rapportages en overleggen die de lijn al gebruikt, niet in een apart projectdashboard dat sterft als jij vertrekt.',
        'De mensenkant: eigenaren nemen een overdracht vaak met tegenzin aan, als nog een ding op hun bord. Vraag: “Wat heb je nodig om dit zonder mij te draaien?”\n\nNeem het antwoord serieus: tijd, een analist, toegang tot data. Kan de eigenaar dat niet krijgen, dan is de overdracht nog niet realistisch, en moet de sponsor dat weten.',
        'IT-projecten noemen de weken direct na de livegang hypercare: extra ondersteuning die klaarstaat, vaak twee tot zes weken, voordat de gewone ondersteuning het overneemt. Verbeterprojecten hebben hetzelfde nodig, met een duidelijke einddatum.\n\nWat vaak misgaat: de overdracht is een eindpresentatie en een map met documenten, en drie maanden later opent niemand die map. Stel de scherpe vraag: “Heeft de eigenaar er zonder mij al een probleem mee opgelost?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een kabelfabrikant draag je het nieuwe wekelijkse planningsoverleg over aan de planningsmanager, Sanne. De checklist: ze kan de KPI leverbetrouwbaarheid (on-time delivery: het aandeel orders dat op de beloofde datum geleverd wordt) lezen en weet dat 92% normaal is; ze zit het overleg voor; ze kan het capaciteitsmodel, het overzicht van beschikbare machine- en mensuren, uitleggen aan een nieuwe planner; ze weet wat te doen bij een spoedorder.\n\nWeek 1 tot 3: jij zit voor, zij kijkt. Week 4 tot 6: zij zit voor, jij zit ernaast en jullie bespreken het daarna 10 minuten na. Week 7 tot 9: ze doet het alleen.\n\nIn week 8 valt een belangrijke machine uit en plant ze de week om zonder jou te bellen. De KPI gaat naar het maandelijkse operationele rapport. Overdracht klaar.',
      },
      said: 'Wat je hoort in projecten: “Dus dat is nu ook van mij? Naast al het andere?”',
      recall: [
        {
          q: 'Wie moet na het project eigenaar zijn van een nieuw proces?',
          options: ['De consultant, tot het volgende project', 'Iemand met dagelijks contact met het werk, zoals de planningsmanager', 'Een stafafdeling die erover rapporteert', 'De stuurgroep als geheel'],
          answer: 'Iemand met dagelijks contact met het werk, zoals de planningsmanager',
          why: 'De eigenaar moet dicht genoeg bij het werk zitten om er elke week op te sturen.',
        },
        {
          q: 'Waar horen de KPI’s na de overdracht?',
          options: ['In een apart projectdashboard', 'In het eindrapport', 'In de bestanden van de consultant', 'In de rapportages en overleggen die de lijn al gebruikt'],
          answer: 'In de rapportages en overleggen die de lijn al gebruikt',
          why: 'Een apart dashboard sterft als het project stopt.',
        },
        {
          q: 'Wat is de goede volgorde om een overleg over te dragen?',
          options: ['Eigenaar kijkt, eigenaar doet het met jou ernaast, eigenaar doet het alleen', 'Eigenaar doet het vanaf dag één alleen', 'Jij doet het tot het eind en stuurt dan een handleiding', 'Eigenaar en jij wisselen eindeloos af'],
          answer: 'Eigenaar kijkt, eigenaar doet het met jou ernaast, eigenaar doet het alleen',
          why: 'Stapsgewijs overdragen bouwt vaardigheid en vertrouwen op.',
        },
        {
          q: 'De eigenaar zegt dat hij geen tijd heeft om het nieuwe proces te draaien. Wat doe je?',
          options: ['Het nog even voor hem doen', 'Zelf een andere eigenaar zoeken', 'Vragen wat hij nodig heeft om het te draaien, en naar de sponsor gaan als hij dat niet krijgt', 'Het proces versimpelen tot het geen tijd meer kost'],
          answer: 'Vragen wat hij nodig heeft om het te draaien, en naar de sponsor gaan als hij dat niet krijgt',
          why: 'Een overdracht zonder middelen om het te draaien mislukt; de sponsor moet beslissen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet. Je project stopt over vier weken. De nieuwe gereedheidscheck werkt, maar jij zit de wekelijkse review nog steeds voor. De teamleider die het moet overnemen zegt: “Het gaat toch prima zo, waarom veranderen?”',
        ask: 'Wat doe je?',
        model: '“Omdat ik over vier weken weg ben, en ik wil dat het zonder mij blijft werken.” Dan spreek ik een korte checklist af van wat hij alleen moet kunnen, laat ik hem volgende week voorzitten met mij ernaast, en vraag ik wat hij nodig heeft om er tijd voor te maken. Krijgt hij die tijd niet, dan kaart ik dat nu bij de sponsor aan, niet in week vier.',
        rubric: [
          'Maakt de reden voor overdragen helder',
          'Start een stapsgewijze overdracht met een checklist',
          'Checkt de middelen van de eigenaar en escaleert vroeg als ze ontbreken',
        ],
        pushback: {
          lines: [
            '“Jij zit het goed voor. Als ik het overneem, wordt het gewoon nog een overleg op mijn bord.”',
            '“En als jij weg bent en het valt om, krijg ik de schuld, niet jij.”',
          ],
          model: '“Dank je, en dat is precies het risico: het werkt omdat ik het voorzit. Over vier weken ben ik weg. Laten we nu wisselen: jij zit het vanaf volgende week voor, en ik zit drie weken naast je. Gaat er iets mis, dan gebeurt dat terwijl ik er nog ben om het mee op te lossen.”',
          rubric: [
            'Erkent zijn werkdruk en zijn angst voor de schuld',
            'Houdt vast aan overdragen voordat hij vertrekt',
            'Stelt een concrete, begeleide overgang voor',
          ],
        },
      },
      sayIt: 'Leg een manager bij de klant in 60 seconden uit hoe je een nieuw proces overdraagt zodat het blijft lopen als jij weg bent.',
      terms: [
        { term: 'Lijnorganisatie', def: 'De gewone afdelingen en managers die het werk elke dag draaien.' },
        { term: 'Proceseigenaar', def: 'De ene persoon in de lijn die verantwoordelijk is voor een proces en de KPI ervan.' },
        { term: 'KPI', def: 'Kritieke prestatie-indicator (key performance indicator): het getal dat laat zien of een proces werkt.' },
        { term: 'Overdrachtschecklist', def: 'Wat de eigenaar alleen moet kunnen, samen afgevinkt.' },
        { term: 'Hypercare', def: 'Een korte periode van extra ondersteuning direct na de livegang, met een duidelijke einddatum.' },
      ],
    },
    {
      id: 'pm.land.sustain',
      title: 'Resultaten vasthouden',
      pre: [
        {
          q: 'Wanneer beginnen resultaten na een geslaagd project het vaakst weg te zakken?',
          options: ['Twee tot vier maanden nadat de consultant weg is', 'In de eerste week na de livegang', 'Na een jaar of vijf', 'Ze zakken zelden weg'],
          answer: 'Twee tot vier maanden nadat de consultant weg is',
          why: 'Een vuistregel uit de praktijk: als de projectaandacht wegvalt, sluipen uitzonderingen erin en vallen mensen terug in oude gewoontes.',
        },
      ],
      teach: [
        'Reken op de dip na drie maanden: resultaten zakken vaak een paar maanden na het einde van het project weg. Dat is een vuistregel uit de praktijk, geen wet.\n\nTijdens het project let iedereen op. Als jij weg bent, gaat de aandacht naar iets anders, wisselen mensen van baan, komt er een druk seizoen, worden uitzonderingen gewoontes. Houd er in je planning rekening mee, in plaats van verrast te zijn als de KPI wegzakt.',
        'Korte, regelmatige checks houden het levend. De leidinggevende checkt elke week een paar dingen op de vloer: is het bord bijgewerkt, wordt de checklist gebruikt, zijn de acties gedaan.\n\nAutofabrikanten maakten er een vaste methode van, de gelaagde procesaudit: korte checks door meerdere lagen management, teamleiders dagelijks, managers wekelijks, de plantmanager maandelijks. Vaak een kleine check werkt beter dan één grote audit per jaar.',
        'De eigenaar houdt elke maand een KPI-review met het team: het verloop, de redenen achter de missers, de acties. Kijk naar de trend, niet naar één week; één slechte week is ruis.\n\nSpreek vooraf af wanneer jij terugkomt: een follow-up, een gepland vervolgbezoek, na één, drie en zes maanden; en een trigger, zoals “als de leverbetrouwbaarheid, het aandeel orders dat op tijd komt, drie weken achter elkaar onder de 85% zit, belt de eigenaar ons”.',
        'Die trigger maakt van terugkomen een plan, geen teken van falen.\n\nZakken de resultaten weg, los het dan niet zelf op; dat ondermijnt de eigenaar. Vraag de eigenaar wat er veranderd is: nieuwe mensen, meer volume, een stap die wordt overgeslagen. Help hem de oorzaak te vinden en te handelen. En trek het je niet persoonlijk aan: wat wegzakken is normaal. Het gaat erom dat de eigenaar het ziet en iets doet.',
        'Een veelgemaakte fout: de nieuwe manier hing aan één enthousiaste persoon, en als zij van baan wisselt, valt het om. Check vroeg of een tweede persoon het kan draaien.\n\nExperts verschillen over hoe lang je betrokken blijft. Sommige consultants plannen een jaar lang follow-ups; anderen zeggen dat de klant daar afhankelijk van wordt. Een goede test is de scherpe vraag bij elke follow-up: “Wat heb je sinds mijn vertrek zelf aan het proces veranderd?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een levensmiddelenfabriek bracht je project de leverbetrouwbaarheid, het aandeel orders dat op de beloofde datum geleverd wordt, van 72% naar 90%. Bij de follow-up na drie maanden is het 81%. De helft van de verbetering is weg.\n\nJe gaat zitten met de eigenaar, de operations manager, en kijkt wat er veranderd is. In maand twee begonnen twee nieuwe planners die nooit getraind zijn; het weekoverleg is in de zomer vier keer afgezegd.\n\nHij besluit: de senior planner traint de twee nieuwe deze maand, en het weekoverleg komt vast in de agenda met een vervanger als hij weg is. Jullie spreken af over zes weken weer te kijken. Dan zit het weer op 88%.',
      },
      said: 'Wat je hoort in projecten: “Het ging echt goed toen jij er was. Toen kwam de zomer en ja, je weet hoe het gaat.”',
      recall: [
        {
          q: 'De leverbetrouwbaarheid ging van 72% naar 90% en zakte daarna naar 81%. Welk percentage van de verbetering (de stijging van 72% naar 90%) is verloren?',
          number: 50,
          tolerance: 1,
          unit: '%',
          why: 'De verbetering was 18 punten; 9 punten verloren; 9 / 18 = 50%.',
        },
        {
          q: 'Waarom spreek je een trigger af om terug te komen?',
          options: ['Om meer advieswerk te verkopen', 'Om de eigenaar de schuld te kunnen geven als het misgaat', 'Zodat terugkomen een plan is, geen teken van falen', 'Omdat audits het eisen'],
          answer: 'Zodat terugkomen een plan is, geen teken van falen',
          why: 'Een afgesproken trigger maakt terugkomen normaal en op tijd.',
        },
        {
          q: 'Na de overdracht zakken de resultaten weg. Wat doe je?',
          options: ['Het zelf snel oplossen', 'De eigenaar helpen uitzoeken wat er veranderd is en hem laten handelen', 'De eigenaar bij de sponsor melden', 'Het project opnieuw starten'],
          answer: 'De eigenaar helpen uitzoeken wat er veranderd is en hem laten handelen',
          why: 'Zelf oplossen neemt het eigenaarschap weg bij degene die het moet volhouden.',
        },
        {
          q: 'Wat houdt een nieuwe werkwijze het best levend?',
          options: ['Eén grote audit per jaar', 'Een eindrapport', 'Een poster in de kantine', 'Korte wekelijkse checks door de leidinggevende en een maandelijkse KPI-review'],
          answer: 'Korte wekelijkse checks door de leidinggevende en een maandelijkse KPI-review',
          why: 'Vaak een beetje aandacht vangt afglijden op voordat het een gewoonte wordt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet, bij de follow-up na drie maanden van je gereedheidscheckproject. De afgezegde klussen, als aandeel van alle geplande klussen, gingen tijdens het project van 18% naar 7%, en zitten nu op 12%. De eigenaar kijkt wat ongemakkelijk.',
        ask: 'Hoe voer je dit gesprek?',
        model: '“Twaalf is nog steeds een stuk beter dan achttien, en wat wegzakken is normaal. Laten we kijken wat er sinds de zomer veranderd is.” Dan het met hem doorlopen: nieuwe mensen, overgeslagen checks, afgezegde reviews. Hem de acties laten kiezen, afspreken wanneer we weer kijken, en een trigger afspreken voor wanneer hij me tussendoor belt.',
        rubric: [
          'Haalt het ongemak weg en behandelt wat wegzakken als normaal',
          'Zoekt samen wat er veranderd is, zonder het zelf op te lossen',
          'Laat de eigenaar acties kiezen en spreekt een volgende check en trigger af',
        ],
        pushback: {
          lines: [
            '“Het was druk, oké? De stormen, de vakanties. Het zakt vanzelf weer.”',
            '“Ik hoef geen preek. Ik weet dat het is teruggezakt.”',
          ],
          model: '“Geen preek; 12 is nog steeds veel beter dan 18, en het was een druk kwartaal. Ik ben benieuwd wat er veranderd is: wordt de check nog elke week gedaan? Als we de stap vinden die is weggevallen, lossen we dat vandaag samen op, en spreken we af hoe je het de volgende keer ziet aankomen.”',
          rubric: [
            'Erkent de drukke periode en zijn gêne',
            'Benoemt de terugval feitelijk, zonder schuld',
            'Stelt voor samen te kijken en een signaal voor de volgende keer af te spreken',
          ],
        },
      },
      sayIt: 'Leg een sponsor in 60 seconden uit waarom resultaten na een project vaak wegzakken en hoe je daarvoor plant.',
      terms: [
        { term: 'Dip na drie maanden', def: 'Een vuistregel uit de praktijk: resultaten zakken vaak een paar maanden na het einde van de projectaandacht weg.' },
        { term: 'Gelaagde procesaudit', def: 'Korte, regelmatige checks door meerdere lagen management, van teamleider tot plantmanager.' },
        { term: 'KPI-review', def: 'Een maandelijks overleg waarin de eigenaar met het team naar het verloop van de KPI, de oorzaken en de acties kijkt.' },
        { term: 'Follow-up', def: 'Een geplande check na het project, bijvoorbeeld na één, drie en zes maanden.' },
        { term: 'Trigger', def: 'Een afgesproken KPI-niveau waarbij de eigenaar om hulp vraagt.' },
      ],
    },
  ],
};

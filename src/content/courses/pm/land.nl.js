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
        'Twee modellen die je gaat horen. De acht stappen van Kotter, voor de organisatie: urgentie creëren, een groep vormen die het trekt, het beeld helder maken, het communiceren, obstakels weghalen, snelle successen boeken, doorzetten, het verankeren in hoe dingen werken. ADKAR (van Prosci), voor één persoon: Awareness (ik weet dat het verandert), Desire (ik wil het), Knowledge (ik weet hoe), Ability (ik kan het in de praktijk), Reinforcement (het blijft beloond worden).',
        'Gebruik ADKAR als diagnose, niet als slide. Als mensen niet meegaan, vraag dan waar ze vastzitten. Niet bewust: ze moeten het van hun baas horen. Geen zin: zoek uit wat ze kwijtraken. Geen kennis: uitleggen. Kunnen het niet: oefenen op de werkplek, geen extra mails. Geen bekrachtiging: iemand moet er elke week naar vragen.',
        'Wat adoptie in de praktijk echt drijft: de nieuwe manier is makkelijker dan de oude voor wie het werk doet; hun directe baas vraagt ernaar; ze hebben het mee vormgegeven; en de oude manier is weg, dus er is geen terugvaloptie. Kost het nieuwe proces de operator meer tijd dan het oude, dan redt geen enkele campagne het.',
        'De mensenkant: zeg de reden in hun termen. Niet “om de OEE te verbeteren” maar “zodat je niet op zaterdag wordt opgeroepen omdat de lijn achterloopt”. En als je niet weet waarom mensen niet meegaan, vraag het vijf van hen: “Wat maakt dit lastig om te gebruiken?” Meestal hoor je één praktisch ding dat je deze week kunt oplossen.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een verpakkingsbedrijf moeten operators elke stop langer dan 2 minuten op een nieuwe terminal registreren. Na zes weken is maar 40% van de stops geregistreerd. Je loopt de vloer op en vraagt het acht operators. Iedereen weet ervan (bewustzijn prima) en weet hoe het moet (kennis prima). Maar drie zeggen: “Er wordt toch nooit iets mee gedaan.” En twee zeggen dat de terminal aan het eind van de lijn staat, 30 meter van waar de stops gebeuren. Twee oplossingen: de ploegleider opent elke ploegstart met de top drie stops van gisteren en wat ermee gebeurt (zin, bekrachtiging), en onderhoud verplaatst de terminal naar het midden van de lijn (kunnen). Vier weken later: 85% geregistreerd.',
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
        scene: 'Je zit bij een netbeheerder. Drie maanden geleden is een nieuwe app voor werkorders uitgerold onder de monteurs. De helft belt nog steeds de planner. De IT-lead zegt: “We hebben nog een trainingsronde nodig.”',
        ask: 'Wat vraag of doe je voordat je instemt met meer training?',
        model: 'Ik zou met twee of drie monteurs meerijden en vragen wat de app in het veld lastig maakt. Dan kijken waar ze vastzitten: weten ze hoe het moet maar hebben ze geen bereik of tijd, of zien ze het nut niet? En ik zou vragen of hun teamleiders de data uit de app gebruiken in hun eigen ochtendoverleg. Training helpt alleen als kennis het probleem is.',
        rubric: [
          'Gaat het veld in om de echte reden te vinden voordat hij een oplossing kiest',
          'Stelt vast waar mensen vastzitten in plaats van kennis aan te nemen',
          'Checkt of hun directe leidinggevenden het bekrachtigen',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom een goede training geen garantie is dat mensen een nieuw proces gaan gebruiken.',
      terms: [
        { term: 'ADKAR', def: 'Awareness, Desire, Knowledge, Ability, Reinforcement: de stappen die één persoon doorloopt in een verandering.' },
        { term: 'Kotter', def: 'Acht stappen voor organisatieverandering, van urgentie tot verankeren in de cultuur.' },
        { term: 'Adoptie', def: 'Dat mensen de nieuwe werkwijze echt gebruiken, ook als niemand kijkt.' },
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
        'Weerstand heeft drie vormen. Open: argumenten, boosheid, “dit gaat niet werken”. Passief: ja in het overleg, daarna niks; “te druk”; mensen die sessies missen. Verborgen: “dat hebben we in 2019 ook geprobeerd”, de oude spreadsheet stiekem bijhouden, data die nooit komt. Open weerstand is een cadeau: het vertelt je waar je aan moet werken. Passief en verborgen zijn lastiger, want die moet je eerst vinden.',
        'Weerstand vertelt je iets echts. Meestal een van deze: ze raken iets kwijt (status, vakmanschap, controle, overwerkgeld), het is extra werk voor ze, een eerder project mislukte en zij betaalden de prijs, of jouw ontwerp heeft een fout die zij zien en jij niet. Vraag voordat je oordeelt: “Wat zou er moeten kloppen om dit voor jou te laten werken?”',
        'Werk ermee, niet ertegen. Haal de scherpste criticus bij het ontwerp: zijn bezwaren maken het beter, en een overtuigde criticus overtuigt anderen meer dan jij ooit zult doen. Scheid de persoon van het bezwaar. En wees eerlijk als een verlies echt is: “Ja, je raakt het zaterdagse overwerk kwijt. Dit is waarom we het toch goed vinden.”',
        'Plak in gesprekken met het management geen label “dwarsligger” op mensen; dat blijft plakken en sluit de deur. Weet je niet wat erachter zit, drink dan koffie met die persoon, één op één, weg van het overleg. Vraag naar zijn ervaring met eerdere veranderingen. Daar hoor je vaak het echte verhaal.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een metaalbedrijf blijft de meest ervaren insteller, Henk, zeggen dat het nieuwe planbord “voor kantoormensen” is. In overleggen slaat hij zijn armen over elkaar; zijn collega’s volgen hem. Je vraagt hem mee voor koffie en vraagt waar hij zich zorgen over maakt. Hij vertelt dat hij vroeger op de vloer de volgorde bepaalde, en dat nu een planner dat vanaf kantoor doet. En: de planner weet niet dat de grote pers na een weekend 40 minuten moet opwarmen. Je nodigt Henk uit om met de planner de regels voor het bord op te stellen. De opwarmregel komt erin. Twee weken later legt Henk het bord zelf uit aan de nachtploeg.',
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
        scene: 'Je zit bij een netbeheerder en voert een nieuwe gereedheidscheck in. De planners doen mee, maar een groep ervaren werkvoorbereiders blijft zeggen “dit is alleen maar extra papierwerk” en hun checklists komen half ingevuld binnen.',
        ask: 'Hoe pak je dit aan?',
        model: 'Ik zou met twee van hen apart gaan zitten en vragen wat in de checklist als papierwerk voelt en wat hem voor hen nuttig zou maken. Misschien hebben ze gelijk dat sommige checks zinloos zijn. Daarna zou ik een van hen uitnodigen om de checklist met de planners te herzien, en schrappen wat niks toevoegt. En ik zou ze bij hun leidinggevende niet als dwarsliggers neerzetten.',
        rubric: [
          'Praat apart met hen om het bezwaar te begrijpen',
          'Behandelt hun bezwaar als mogelijk terecht en verbetert het ontwerp',
          'Betrekt hen bij het herzien en vermijdt labels',
        ],
      },
      sayIt: 'Leg een manager bij de klant in 60 seconden uit waarom weerstand nuttige informatie is en hoe je ermee werkt.',
      terms: [
        { term: 'Passieve weerstand', def: 'In het openbaar instemmen maar niet handelen, sessies missen, “te druk” zijn.' },
        { term: 'Verborgen weerstand', def: 'De oude manier stilletjes in stand houden, of ondermijnen met “dat hebben we al geprobeerd”.' },
        { term: 'Verlies', def: 'Wat iemand opgeeft in een verandering: status, vakmanschap, controle, geld of gemak.' },
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
        'Breng in kaart wie wat wanneer hoort. Groepen: direct geraakt (ze gaan anders werken), indirect geraakt (hun input of output verandert), en leidinggevenden. Beantwoord per groep vijf vragen: wat verandert er voor mij, wanneer, waarom, wat wordt er van mij verwacht, en waar kan ik met vragen terecht. Een tabel op één A4 is genoeg.',
        'Volgorde doet ertoe. Leidinggevenden horen het voor hun teams, zodat ze vragen kunnen beantwoorden in plaats van verrast te worden. Laat mensen het nooit eerst op de gang of van een andere vestiging horen. Is er al een gerucht, communiceer dan dezelfde dag, ook als nog niet alles besloten is: “Dit weten we, dit nog niet, en dan wel.”',
        'De middenmanager is het belangrijkste kanaal. De plantmanager kan het waarom uitleggen; de ploegleider is degene aan wie mensen vragen “wat betekent dit voor mijn maandag?” Rust middenmanagers eerst toe: hun eigen vragen beantwoord, drie kernboodschappen, een korte lijst met te verwachten vragen en antwoorden. Vraag ze: “Wat gaan jouw mensen je vragen?”',
        'Herhaal. Eén boodschap in één overleg is geen communicatie. Mensen moeten het een paar keer horen, op een paar manieren, voordat het landt: het overleg, het bord, de ploegstart, een één-op-ééngesprek. Check of het geland is: vraag een paar mensen wat ze begrepen hebben. Weet je een antwoord niet, zeg dat dan en zeg wanneer je het wel weet.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netbeheerder verandert hoe geplande klussen worden vrijgegeven: vanaf volgende maand komt geen klus in de weekplanning zonder geslaagde gereedheidscheck. Je plan: week 1 vertelt het hoofd planning het de vijf teamleiders, met een FAQ van één A4 en hun eigen vragen beantwoord. Week 2 vertelt elke teamleider het zijn planners in het eigen teamoverleg, met drie kernboodschappen. Dezelfde week een kort bericht aan de teamleiders van uitvoering, omdat hun ploegen minder maar betrouwbaardere klussen gaan zien. Week 3 en 4: de check staat bij elk planningsoverleg op het bord. In week 4 vraag je zes planners wat ze begrepen hebben. Twee denken dat de check optioneel is; dat zet je in het volgende overleg recht.',
      },
      said: 'Wat je hoort in projecten: “Niemand heeft ons iets verteld. We hoorden het van de jongens in Zwolle.”',
      recall: [
        {
          q: 'Wie moet als eerste horen over een verandering?',
          options: ['Iedereen tegelijk', 'De leidinggevenden, voor hun teams', 'De medewerkers die het meest geraakt worden', 'Alleen de OR'],
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
        scene: 'Je zit bij een levensmiddelenfabriek. Het nieuwe ploegenrooster gaat over zes weken in. De plantmanager wil het volgende week in een personeelsbijeenkomst aankondigen en “dan zijn we klaar met communiceren”.',
        ask: 'Wat stel je voor?',
        model: '“De bijeenkomst is goed voor het waarom. Maar mensen gaan hun ploegleider vragen wat het betekent voor hun weekenden. Kunnen we de ploegleiders eerst bijpraten, met een FAQ, zodat ze antwoord kunnen geven? Dan de bijeenkomst, dan praat elke ploegleider met zijn team in de ploegstart. En in week drie vragen we een paar operators wat ze begrepen hebben.”',
        rubric: [
          'Houdt de bijeenkomst voor het waarom maar voegt momenten toe',
          'Praat de ploegleiders bij en rust ze toe voor hun teams',
          'Plant herhaling en een check op wat er geland is',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom de middenmanager het belangrijkste kanaal is bij een verandering.',
      terms: [
        { term: 'Communicatieplan', def: 'Per groep: wat verandert er, wanneer, waarom, wat wordt verwacht, waar kun je terecht.' },
        { term: 'Kernboodschappen', def: 'Drie of vier hoofdpunten die een leidinggevende in eigen woorden kan gebruiken.' },
        { term: 'Middenmanager', def: 'De ploegleider of teamleider tussen het topmanagement en de vloer.' },
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
        'Schrijf de nieuwe manier op als korte werkinstructie: één A4 per taak, stappen op volgorde, foto’s van de echte apparatuur, de kernpunten die het goed laten gaan, en waarom die ertoe doen. Schrijf hem met de mensen die het werk doen en test hem: laat iemand die er niet bij was hem volgen terwijl jij kijkt. Waar hij aarzelt, is de instructie onduidelijk.',
        'Klaslokaal tegenover de werkplek. Het klaslokaal is goed voor het waarom en het grote plaatje, in 30 tot 60 minuten. Vaardigheden leer je op de werkplek: voordoen, samen doen, zelf laten doen terwijl jij kijkt, later checken. Ploegleiders of ervaren operators zijn de beste trainers, als je hen eerst traint.',
        'Timing: train vlak voordat mensen het nodig hebben. Een training zes weken voor de livegang is tegen die tijd grotendeels vergeten. Plan korte sessies in de week ervoor en begeleiding op de werkplek in de eerste twee weken erna. Zorg dat elke ploeg aan bod komt, ook nacht en weekend, die projecten vaak vergeten.',
        'Check of het blijft hangen: kijk een week later hoe mensen het zonder hulp doen. Niet om ze te beoordelen, maar om te zien of de instructie of de training beter moet. Maken veel mensen dezelfde fout, dan is de instructie fout, niet de mensen. Ken je de technische taak zelf niet goed, laat dan de expert trainen en check jij het resultaat.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netbeheerder voert een nieuwe manier in waarop monteurs revisiegegevens (waar kabel en moffen echt liggen) met een app doorgeven. Je schrijft met de teamleider een instructie van één A4: zes stappen, foto’s van de schermen, en het kernpunt “fotografeer de mof voor het aanvullen, want daarna kan het niet meer”. Een monteur die er niet bij was test hem; hij loopt vast bij stap 4, die je herschrijft. Training: 30 minuten in het ochtendoverleg over het waarom, daarna gaat de teamleider mee met de eerste klus van elke monteur. Een week later check je 20 meldingen: 15 compleet, 5 zonder moffoto. Alle 5 komen van ploegen die om 6:00 beginnen, voordat de teamleider er is. Volgende week begint er een teamleider vroeger.',
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
        scene: 'Je zit bij een kunststoffabriek. De nieuwe omstelchecklist is in één klassikale sessie getraind voor de dagploeg. De nachtploeg kreeg de slides per mail. Maandag gaat het live.',
        ask: 'Wat doe je voor en na maandag?',
        model: 'Voor maandag zou ik een korte sessie voor de nachtploeg regelen, het liefst gegeven door hun eigen ploegleider, die ik eerst bijpraat. Na de livegang zorg ik dat er bij de eerste omstellingen in elke ploeg iemand op de vloer staat die het kent. Een week later kijk ik bij een paar omstellingen mee, zonder te oordelen, om te zien waar mensen vastlopen en de checklist of training te verbeteren.',
        rubric: [
          'Haalt de vergeten ploeg voor de livegang alsnog binnen',
          'Plant begeleiding op de werkplek in de eerste dagen',
          'Checkt een week later door mee te kijken, en verbetert de instructie waar nodig',
        ],
      },
      sayIt: 'Leg een teamleider in 60 seconden uit hoe je een nieuwe werkwijze traint zodat hij echt blijft hangen.',
      terms: [
        { term: 'Werkinstructie', def: 'Eén A4 per taak: stappen, foto’s, kernpunten en waarom ze ertoe doen.' },
        { term: 'Training op de werkplek', def: 'Voordoen, samen doen, zelf laten doen, checken: leren in het echte werk.' },
        { term: 'Kernpunt', def: 'Het detail in een stap waardoor het goed of fout gaat.' },
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
        'De lijnorganisatie is eigenaar van het resultaat als jij weg bent. Benoem één eigenaar per nieuw proces, en één per KPI. De eigenaar is iemand met dagelijks contact met het werk, zoals een planningsmanager of productiemanager, niet een staffunctie die er alleen over rapporteert.',
        'Wat de eigenaar alleen moet kunnen: de KPI lezen en weten wat normaal is, het reviewoverleg leiden, nieuwe mensen inwerken, de gewone problemen oplossen, en weten wie hij moet bellen voor de zeldzame. Schrijf dat op als korte checklist en vink het samen af.',
        'Draag in stappen over. Eerst kijkt de eigenaar hoe jij het doet. Dan doet de eigenaar het terwijl jij ernaast zit. Dan doet hij het alleen en hoor jij er alleen nog over. Elke stap duurt een paar cycli, bijvoorbeeld drie weekoverleggen. Zet de KPI’s in de rapportages en overleggen die de lijn al gebruikt, niet in een apart projectdashboard dat sterft als jij vertrekt.',
        'De mensenkant: eigenaren nemen een overdracht vaak met tegenzin aan, als nog een ding op hun bord. Vraag: “Wat heb je nodig om dit zonder mij te draaien?” Neem het antwoord serieus: tijd, een analist, toegang tot data. Kan de eigenaar dat niet krijgen, dan is de overdracht nog niet realistisch, en moet de sponsor dat weten.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een kabelfabrikant draag je het nieuwe wekelijkse planningsoverleg over aan de planningsmanager, Sanne. De checklist: ze kan de KPI leverbetrouwbaarheid lezen en weet dat 92% normaal is; ze zit het overleg voor; ze kan het capaciteitsmodel uitleggen aan een nieuwe planner; ze weet wat te doen bij een spoedorder. Week 1 tot 3: jij zit voor, zij kijkt. Week 4 tot 6: zij zit voor, jij zit ernaast en jullie bespreken het daarna 10 minuten na. Week 7 tot 9: ze doet het alleen. In week 8 valt een belangrijke machine uit en plant ze de week om zonder jou te bellen. De KPI gaat naar het maandelijkse operationele rapport. Overdracht klaar.',
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
        scene: 'Je zit bij een netbeheerder. Je project stopt over vier weken. De nieuwe gereedheidscheck werkt, maar jij zit de wekelijkse review nog steeds voor. De teamleider die het moet overnemen zegt: “Het gaat toch prima zo, waarom veranderen?”',
        ask: 'Wat doe je?',
        model: '“Omdat ik over vier weken weg ben, en ik wil dat het zonder mij blijft werken.” Dan spreek ik een korte checklist af van wat hij alleen moet kunnen, laat ik hem volgende week voorzitten met mij ernaast, en vraag ik wat hij nodig heeft om er tijd voor te maken. Krijgt hij die tijd niet, dan kaart ik dat nu bij de sponsor aan, niet in week vier.',
        rubric: [
          'Maakt de reden voor overdragen helder',
          'Start een stapsgewijze overdracht met een checklist',
          'Checkt de middelen van de eigenaar en escaleert vroeg als ze ontbreken',
        ],
      },
      sayIt: 'Leg een manager bij de klant in 60 seconden uit hoe je een nieuw proces overdraagt zodat het blijft lopen als jij weg bent.',
      terms: [
        { term: 'Lijnorganisatie', def: 'De gewone afdelingen en managers die het werk elke dag draaien.' },
        { term: 'Proceseigenaar', def: 'De ene persoon in de lijn die verantwoordelijk is voor een proces en de KPI ervan.' },
        { term: 'Overdrachtschecklist', def: 'Wat de eigenaar alleen moet kunnen, samen afgevinkt.' },
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
          why: 'Als de projectaandacht wegvalt, sluipen uitzonderingen erin en vallen mensen terug in oude gewoontes.',
        },
      ],
      teach: [
        'Reken op een dip na een maand of drie. Tijdens het project let iedereen op. Als jij weg bent, gaat de aandacht naar iets anders, wisselen mensen van baan, komt er een druk seizoen, worden uitzonderingen gewoontes. Houd er in je planning rekening mee, in plaats van verrast te zijn als de KPI wegzakt.',
        'Korte, regelmatige checks houden het levend. De leidinggevende checkt elke week een paar dingen op de vloer: is het bord bijgewerkt, wordt de checklist gebruikt, zijn de acties gedaan. De eigenaar bespreekt de KPI elke maand met het team. Vaak een kleine check werkt beter dan één grote audit per jaar.',
        'Spreek vooraf af wanneer jij terugkomt. Bijvoorbeeld: een follow-up na één, drie en zes maanden; en een trigger, zoals “als de leverbetrouwbaarheid drie weken achter elkaar onder de 85% zit, belt de eigenaar ons”. Dan is terugkomen een plan, geen teken van falen.',
        'Zakken de resultaten weg, los het dan niet zelf op; dat ondermijnt de eigenaar. Vraag de eigenaar wat er veranderd is: nieuwe mensen, meer volume, een stap die wordt overgeslagen. Help hem de oorzaak te vinden en te handelen. En trek het je niet persoonlijk aan: wat wegzakken is normaal. Het gaat erom dat de eigenaar het ziet en iets doet.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een levensmiddelenfabriek bracht je project de leverbetrouwbaarheid van 72% naar 90%. Bij de follow-up na drie maanden is het 81%. De helft van de verbetering is weg. Je gaat zitten met de eigenaar, de operations manager, en kijkt wat er veranderd is. In maand twee begonnen twee nieuwe planners die nooit getraind zijn; het weekoverleg is in de zomer vier keer afgezegd. Hij besluit: de senior planner traint de twee nieuwe deze maand, en het weekoverleg komt vast in de agenda met een vervanger als hij weg is. Jullie spreken af over zes weken weer te kijken. Dan zit het weer op 88%.',
      },
      said: 'Wat je hoort in projecten: “Het ging echt goed toen jij er was. Toen kwam de zomer en ja, je weet hoe het gaat.”',
      recall: [
        {
          q: 'De leverbetrouwbaarheid ging van 72% naar 90% en zakte daarna naar 81%. Welk percentage van de verbetering is verloren?',
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
        scene: 'Je zit bij een netbeheerder, bij de follow-up na drie maanden van je gereedheidscheckproject. De afzeggingen gingen tijdens het project van 18% naar 7%, en zitten nu op 12%. De eigenaar kijkt wat ongemakkelijk.',
        ask: 'Hoe voer je dit gesprek?',
        model: '“Twaalf is nog steeds een stuk beter dan achttien, en wat wegzakken is normaal. Laten we kijken wat er sinds de zomer veranderd is.” Dan het met hem doorlopen: nieuwe mensen, overgeslagen checks, afgezegde reviews. Hem de acties laten kiezen, afspreken wanneer we weer kijken, en een trigger afspreken voor wanneer hij me tussendoor belt.',
        rubric: [
          'Haalt het ongemak weg en behandelt wat wegzakken als normaal',
          'Zoekt samen wat er veranderd is, zonder het zelf op te lossen',
          'Laat de eigenaar acties kiezen en spreekt een volgende check en trigger af',
        ],
      },
      sayIt: 'Leg een sponsor in 60 seconden uit waarom resultaten na een project vaak wegzakken en hoe je daarvoor plant.',
      terms: [
        { term: 'Dip na drie maanden', def: 'Het gebruikelijke wegzakken van resultaten een paar maanden na het einde van de projectaandacht.' },
        { term: 'Follow-up', def: 'Een geplande check na het project, bijvoorbeeld na één, drie en zes maanden.' },
        { term: 'Trigger', def: 'Een afgesproken KPI-niveau waarbij de eigenaar om hulp vraagt.' },
      ],
    },
  ],
};

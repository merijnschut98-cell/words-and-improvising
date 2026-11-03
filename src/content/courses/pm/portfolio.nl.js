// pm.portfolio (Nederlands): programma’s, portfolio’s en governance: meerdere projecten als één sturen, prioriteren, beslisbevoegdheden, baten, schaarse experts en de boardroom.
export default {
  lessons: [
    {
      id: 'pm.portfolio.programme',
      title: 'Programma of project',
      pre: [
        {
          q: 'Wat maakt van een setje projecten een programma, en niet gewoon een lijstje projecten?',
          options: ['Ze delen één budget', 'Ze hebben één sponsor', 'Samen leveren ze een uitkomst die geen van hen alleen haalt', 'Ze lopen in dezelfde periode'],
          answer: 'Samen leveren ze een uitkomst die geen van hen alleen haalt',
          why: 'Een gedeeld budget of een gedeelde sponsor is administratie. Een programma bestaat omdat het doel de projecten samen nodig heeft.',
        },
      ],
      teach: [
        'Een project levert een output: een gereedheidscheck, een omgebouwde lijn, een nieuwe planningstool. Een programma levert een uitkomst waar meerdere projecten samen voor nodig zijn: bijvoorbeeld afgezegde netklussen van 14% naar 8%, en daarvoor heb je een gereedheidscheck, een nieuw materiaalproces én een aanpassing in de planningstool nodig. De test: kun je één project schrappen en blijft het doel overeind, dan hoort het in het portfolio, niet in dit programma.',
        'Afhankelijkheden zijn het echte werk van een programma. Breng ze vroeg in kaart: project B heeft in week 10 de datadefinitie van A nodig; C heeft in Q2 dezelfde twee planners nodig als B. Houd één lijst bij met eigenaar, datum en wat er gebeurt als het uitloopt.\n\nDe rekensom is hard: vier projecten die elk 90% kans hebben om op tijd te leveren, halen het samen maar in 66% van de gevallen.',
        'De programmaraad: de sponsor, de projecteigenaren, de lijnmanager die de uitkomst bezit, en finance als er geld tussen projecten schuift. Hij komt maandelijks bij elkaar en beslist over de naden: volgorde, gedeelde mensen, scope die van het ene naar het andere project gaat.\n\nProjectbesluiten blijven in de stuurgroepen van de projecten. Bespreekt de raad het testplan van één project, dan is het een stuurgroep met te veel mensen.',
        'Als programmaleider bezit je het verhaal van de uitkomst, de lijst met afhankelijkheden en het ritme. Je draait de projecten niet zelf.\n\nEen goede test voor jezelf: kun je in twee minuten, met getallen, uitleggen hoe de projecten samen het doel halen? Lukt dat niet, dan lukt het de raad ook niet, en dan gaan ze elk project apart sturen.',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage wordt binnengehaald door een regiodirecteur bij een netbeheerder. In haar regio zijn los van elkaar drie projecten gestart: een gereedheidscheck voor geplande klussen (team A), een nieuw proces voor materiaalpakketten (team B) en een upgrade van de planningstool (IT).\n\nAlle drie staan op groen. De afzeggingen zitten nog steeds op 14%; haar doel is 8%.\n\nJij ziet dat de gereedheidscheck materiaaldata leest die team B aan het herontwerpen is, en dat de IT-release in Q3 het veld verandert dat de check gebruikt.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Maak er een programma van met één getal: afzeggingen van 14% naar 8%. Zet de afhankelijkheden op één A4: de definitie van de materiaaldata, de wijziging in het toolveld, en de planners die alle drie de teams nodig hebben. Laat de directeur zien dat elk project groen is terwijl de naden rood zijn.\n\nStel voor: team B is eigenaar van de materiaaldefinitie en bevriest die in week 6; IT test de Q3-release tegen de gereedheidscheck voor de livegang; een maandelijkse programmaraad met haar, de drie projecteigenaren en de planningsmanager. Rapporteer maandelijks over de uitkomst, met een schatting van wat elk project bijdraagt.',
      },
      said: 'Wat je hoort in projecten: “Alle projecten staan op groen, dus waarom beweegt dat getal niet?”',
      recall: [
        {
          q: 'De programmaraad besteedt 40 minuten aan het testplan van één project. Wat gaat er mis?',
          options: ['De raad is te klein', 'De raad doet projectwerk dat in de stuurgroep van dat project hoort', 'Het testplan moet eerst langs finance', 'Niks, detail laat betrokkenheid zien'],
          answer: 'De raad doet projectwerk dat in de stuurgroep van dat project hoort',
          why: 'De raad beslist over de naden tussen projecten; projectdetail drukt dat weg.',
        },
        {
          q: 'Waar gaan programma’s meestal mis?',
          options: ['Binnen het grootste project', 'In het oorspronkelijke budget', 'Op de naden tussen projecten', 'Bij de kick-off'],
          answer: 'Op de naden tussen projecten',
          why: 'Elk project stuurt zichzelf; wat er tussen de projecten heen en weer gaat, stuurt niemand, tenzij het programma dat doet.',
        },
        {
          q: 'Een programma heeft vier onafhankelijke projecten die elk 90% kans hebben om op tijd te leveren. Hoeveel procent kans is er dat ze alle vier op tijd zijn?',
          number: 66,
          tolerance: 1,
          unit: '%',
          why: '0,9 × 0,9 × 0,9 × 0,9 = 0,656, dus ongeveer 66%. Afhankelijkheden stapelen risico.',
        },
        {
          q: 'Wat moet er in elke regel van een afhankelijkhedenlijst staan?',
          options: ['Een eigenaar, een datum, en wat er gebeurt als het uitloopt', 'Alleen de punten op het kritieke pad', 'Het budget van beide projecten', 'De namen van beide teams'],
          answer: 'Een eigenaar, een datum, en wat er gebeurt als het uitloopt',
          why: 'Zonder eigenaar en gevolg is een afhankelijkheid alleen een observatie.',
        },
      ],
      situation: {
        scene: 'Je zit bij een maker van metalen onderdelen. De COO heeft drie verbeterprojecten lopen, op OEE, op planning en op onderhoud, en vraagt Vantage: “Kun je dit als programma draaien? Ik wil één verhaal voor de directie.”',
        ask: 'Wat zet je de eerste twee weken neer?',
        model: 'Eerst zou ik met de COO de ene uitkomst afspreken, bijvoorbeeld leverbetrouwbaarheid van 82% naar 92%, en hoe elk project daaraan bijdraagt. Dan een afhankelijkhedenkaart op één A4 met eigenaren en data, en een maandelijkse programmaraad die alleen over de naden beslist. Tegen de projectleiders zeg ik gewoon: “Jullie blijven je projecten draaien; ik let op wat er tussen jullie gebeurt.”',
        rubric: [
          'Begint bij één meetbare uitkomst, niet bij de lijst projecten',
          'Maakt afhankelijkheden zichtbaar met eigenaren en data',
          'Scheidt programmabesluiten van projectbesluiten',
        ],
        pushback: {
          lines: [
            '“Ik wil niet nog een laag overleggen. Geef me gewoon elke maand één slide.”',
            '“De drie projectleiders zitten niet te wachten op iemand boven zich. Kun je het niet doen zonder iets te veranderen?”',
          ],
          model: '“Eén slide per maand is precies het doel, en daarvoor is één gezamenlijk doel voor alle drie nodig. Geen nieuwe laag: de projectleiders houden hun projecten, en we voegen één uur per maand toe waarin ze samen naar afhankelijkheden kijken. Over twee weken laat ik je de conceptslide en het doel zien.”',
          rubric: [
            'Erkent zijn wens om het simpel te houden en de zorg van de projectleiders',
            'Houdt vast aan een gezamenlijk doel en een licht gezamenlijk ritme',
            'Stelt binnen twee weken een concreet resultaat voor',
          ],
        },
      },
      sayIt: 'Leg een operationeel directeur bij een klant in 60 seconden uit waarom drie groene projecten toch het doel kunnen missen.',
      terms: [
        { term: 'Programma', def: 'Meerdere projecten die samen gestuurd worden omdat ze één gedeelde uitkomst leveren.' },
        { term: 'Afhankelijkheid', def: 'Iets wat het ene project op een bepaalde datum van het andere nodig heeft, anders loopt het uit.' },
        { term: 'Programmaraad', def: 'De groep die beslist over volgorde, gedeelde mensen en scope tussen projecten.' },
      ],
    },
    {
      id: 'pm.portfolio.prioritise',
      title: 'Het portfolio prioriteren',
      pre: [
        {
          q: 'Een fabriek heeft 12 verbeterprojecten en capaciteit voor ongeveer 6. Niemand zegt nee. Wat gebeurt er meestal?',
          options: ['De 6 beste projecten worden gedaan', 'Alle 12 gaan langzaam en er komen er weinig af', 'Mensen werken harder en maken er 10 af', 'De sponsor stopt stilletjes de zwakste'],
          answer: 'Alle 12 gaan langzaam en er komen er weinig af',
          why: 'Zonder harde streep start alles, en worden de schaarse mensen over alles uitgesmeerd.',
        },
      ],
      teach: [
        'Scoor elk project op vier dingen: waarde (euro’s of een KPI die per jaar beweegt), inspanning (dagen van de schaarse mensen), risico (de kans dat het niet levert) en fit met de strategie. Houd het grof; een schaal van 1 tot 5 is prima.\n\nHet gaat niet om precisie. Het gaat erom dat het gesprek verschuift van “alles is belangrijk” naar “dit vóór dat”.',
        'Waarde per schaarse dag beslecht de meeste discussies. Project A: € 300k per jaar voor 120 dagen van de twee procesengineers, dus € 2,5k per dag. Project B: € 150k voor 30 dagen, dus € 5k per dag. B gaat eerst, al lijkt A groter.\n\nCorrigeer voor risico: € 300k bij 50% vertrouwen telt als € 150k.',
        'Capaciteit is de harde grens. Tel de schaarse mensen, niet de headcount. Twee procesengineers met elk 120 projectdagen geven 240 dagen.\n\nRangschik de lijst en trek de streep waar het lopende totaal 240 bereikt. Alles onder de streep wacht. Twaalf projecten op halve snelheid leveren minder op dan zes op volle snelheid, omdat schakelen en wachten de tijd opeten.',
        'Nee zeggen op portfolioniveau is nooit een kaal nee. Het is “niet nu, en dit is wat het zou verdringen.”\n\nZo zeg je het: “We kunnen hiermee starten. Met de mensen die we hebben, betekent dat dat project B stopt of drie maanden opschuift. Wat heeft je voorkeur?” De keuze ligt bij degene die over allebei gaat. Houd een zichtbare wachtlijst bij, zodat “niet nu” niet stilletjes “nooit” wordt.',
      ],
      example: {
        kind: 'faded',
        text: 'MT van een levensmiddelenproducent. Twee procesengineers hebben dit jaar samen 240 projectdagen.\n\nOp tafel: A, energiebesparing, € 200k per jaar, 80 dagen. B, kortere omsteltijden, € 180k, 40 dagen. C, een nieuw MES, € 400k, maar slechts 50% vertrouwen, 200 dagen.\n\nD, verpakkingsafval, € 90k, 30 dagen. E, het dashboard van de plantdirecteur, waarde niet genoemd, 40 dagen. Iedereen wil ze alle vijf.',
        ask: 'Wat zou jij adviseren?',
        reveal: 'Waarde per engineersdag: B € 4,5k, D € 3k, A € 2,5k, C € 1k na de correctie voor 50% risico, E onbekend. B, D en A kosten samen 150 dagen: daarmee starten.\n\nC past niet en is het onzekerst, dus stel een eerste fase van 60 dagen voor die de grote aanname test voordat je 200 dagen vastlegt. Dan zit je op 210 dagen, met 30 als buffer.\n\nVraag de plantdirecteur voor E een getal te noemen: “Komt het boven € 2,5k per dag, dan gaat het vóór A.” Dan kiest het MT, niet jij.',
      },
      said: 'Wat je hoort in projecten: “Alles op deze lijst heeft prioriteit één.”',
      recall: [
        {
          q: 'Een project is € 120k per jaar waard en heeft 40 dagen van je schaarse engineers nodig. Wat is de waarde per schaarse dag, in duizenden euro’s?',
          number: 3,
          tolerance: 0.1,
          unit: 'k€ per dag',
          why: '€ 120k gedeeld door 40 dagen is € 3k per schaarse dag.',
        },
        {
          q: 'Waarom rangschik je op waarde per schaarse dag en niet op totale waarde?',
          options: ['Het laat zien wat elke dag van je bottleneckmensen oplevert', 'Het bevoordeelt de grootste projecten', 'Finance eist het', 'Dan doet risico er niet meer toe'],
          answer: 'Het laat zien wat elke dag van je bottleneckmensen oplevert',
          why: 'De schaarse mensen zijn de beperking, dus hun dagen zijn de munteenheid.',
        },
        {
          q: 'De CEO wil dat er nu een nieuw project start. Hoe zeg je nee op portfolioniveau?',
          options: ['“Nee, we hebben de capaciteit niet.”', '“We proberen het ertussen te proppen.”', '“Ja, als het team een paar weekenden werkt.”', '“We kunnen het starten; dan schuift project B drie maanden op. Wat heeft je voorkeur?”'],
          answer: '“We kunnen het starten; dan schuift project B drie maanden op. Wat heeft je voorkeur?”',
          why: 'Het maakt de afweging zichtbaar en legt de keuze bij degene die over allebei gaat.',
        },
        {
          q: 'Waarom leveren twaalf projecten op halve snelheid minder op dan zes op volle snelheid?',
          options: ['De budgetten worden verdeeld', 'Sponsors verliezen hun interesse', 'Schakelen en wachten eten de tijd op', 'Dat is niet zo; de output is hetzelfde'],
          answer: 'Schakelen en wachten eten de tijd op',
          why: 'Elk project wacht op mensen die elders bezig zijn, dus alles duurt langer.',
        },
      ],
      situation: {
        scene: 'Je zit in het MT van een verpakkingsfabriek. Het portfolio is gerangschikt en de streep is getrokken. De plantdirecteur zegt: “Mijn project gaat er dit kwartaal in. Het is strategisch.” Het staat onder de streep.',
        ask: 'Wat zeg je?',
        model: '“Dat kan best. Laten we het dan zichtbaar maken. Gaat het er nu in, dan schuift het omstelproject, zo’n € 4k per engineersdag waard, naar Q3. Kun je een getal op het jouwe zetten, zodat het MT kan vergelijken?” Houdt hij voet bij stuk, dan beslist het MT met beide getallen op tafel. Ik ga niet met hem over strategie in discussie; ik laat zien wat de keuze kost.',
        rubric: [
          'Weigert niet, maar noemt wat er verdrongen wordt',
          'Vraagt om de waarde in vergelijkbare termen',
          'Laat het besluit bij de mensen die over het portfolio gaan',
        ],
        pushback: {
          lines: [
            '“Iedereen weet dat dit project ertoe doet. Het scoremodel vangt strategie niet.”',
            '“Als mijn project een kwartaal moet wachten, stap ik naar de CEO. Is dat wat je wilt?”',
          ],
          model: '“Het kan heel goed strategisch zijn, en dan moet het ook zo scoren. Welk criterium mist het? Als het MT het dit kwartaal wil, prima, maar dan valt er boven de streep een project af. Die keuze zet ik donderdag op de agenda, zodat het MT het open besluit.”',
          rubric: [
            'Erkent dat het project ertoe kan doen',
            'Houdt vast aan de afgesproken rangorde en de afweging die daarbij hoort',
            'Stelt een open besluit voor op een concreet moment',
          ],
        },
      },
      sayIt: 'Leg een MT in 60 seconden uit waarom ze minder projecten moeten starten om er meer af te maken.',
      terms: [
        { term: 'Waarde per schaarse dag', def: 'Jaarwaarde gedeeld door de dagen van de bottleneckmensen die een project nodig heeft.' },
        { term: 'Risicogecorrigeerde waarde', def: 'Verwachte waarde maal je vertrouwen dat die ook echt geleverd wordt.' },
        { term: 'Capaciteitsstreep', def: 'Het punt in de gerangschikte lijst waar de dagen van de schaarse mensen op zijn.' },
      ],
    },
    {
      id: 'pm.portfolio.governance',
      title: 'Governance die beslist',
      pre: [
        {
          q: 'Een stuurgroep van tien mensen komt maandelijks bij elkaar. De discussies zijn goed, maar besluiten eindigen steeds met “laten we dit offline oppakken”. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Ze komen te weinig bij elkaar', 'De statusrapporten zijn te kort', 'Het overleg zit op het verkeerde moment van de dag', 'Niemand weet wie waarover mag beslissen'],
          answer: 'Niemand weet wie waarover mag beslissen',
          why: 'Groepen praten in plaats van beslissen als beslisbevoegdheden nooit expliciet zijn gemaakt.',
        },
      ],
      teach: [
        'Governance is één vraag, vooraf beantwoord: wie beslist wat? Leg beslisbevoegdheden vast voor scope, budget, planning en mensen.\n\nBijvoorbeeld: de projectleider beslist binnen 10% op budget en twee weken op planning; daarbuiten beslist de stuurgroep; boven 20%, of bij alles wat de strategie raakt, beslist de directie. Eén A4, afgetekend door de sponsor.',
        'Een stuurgroep die beslist heeft vijf tot zeven mensen, die elk hun afdeling kunnen committeren.\n\nOp de agenda staan besluiten, geen updates. De stukken gaan drie dagen vooraf rond. De notulen zijn een besluitenlijst: wat is besloten, door wie, wanneer klaar.\n\nStaat er geen besluit op de agenda, zeg het overleg dan af en stuur een mail.',
        'Escalatielijnen leggen vooraf vast wat omhoog gaat, hoe snel en naar wie. Een goede regel: escaleer als een tolerantie overschreden is, of binnen twee weken overschreden wordt, en kom met opties en een advies.\n\nEscaleren is geen falen; het is het systeem dat werkt. Te laat escaleren, dát is het falen.',
        'De mensenkant: een lid dat nooit beslist, mist vaak mandaat van zijn eigen baas. Vraag het hem onder vier ogen: “Als dit straks op tafel komt, kun jij dan voor je afdeling beslissen, of moet je eerst terug?” Help hem dan aan dat mandaat, of nodig degene uit die het wel heeft.',
      ],
      example: {
        kind: 'faded',
        text: 'De stuurgroep van een netbeheerder heeft elf leden. Al twee maanden schuift hij drie besluiten voor zich uit: 18% overschrijding op de aannemerskosten, of de tweede regio dit jaar in scope is, en wie de twee planners levert.\n\nElk overleg heeft een statusupdate van 15 slides en eindigt met “laten we dit offline oppakken”. De sponsor vraagt Vantage wat er aan de hand is.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Zeg het de sponsor eerlijk: “Deze groep beslist niet, omdat niemand weet wie wat mag beslissen.” Stel een tabel met beslisbevoegdheden en toleranties op één A4 voor, en breng de groep terug naar zes stemhebbende leden; de rest wordt adviseur.\n\nBouw de volgende agenda op rond de drie besluiten, elk met opties, kosten en een advies, drie dagen vooraf verstuurd. Spreek de twee leden die eerder blokkeerden vooraf en vraag of ze mandaat hebben.\n\nOpen het overleg met: “Vandaag hebben we drie besluiten nodig.” Leg ze vast, met eigenaren en data.',
      },
      said: 'Wat je hoort in projecten: “Goede discussie. Laten we dit offline oppakken.”',
      recall: [
        {
          q: 'De projectleider mag binnen 10% op budget beslissen; daarbuiten beslist de stuurgroep. Een project van € 400k heeft nu een prognose van € 450k. Wie beslist?',
          options: ['De projectleider', 'De stuurgroep', 'De directie', 'Finance'],
          answer: 'De stuurgroep',
          why: '€ 50k op € 400k is 12,5%, buiten de 10% van de projectleider maar binnen de ruimte van de stuurgroep.',
        },
        {
          q: 'Wat maakt notulen van een stuurgroep bruikbaar?',
          options: ['Een besluitenlijst: wat, wie, wanneer', 'Een volledig verslag van de discussie', 'De presentielijst', 'Alle slides als bijlage'],
          answer: 'Een besluitenlijst: wat, wie, wanneer',
          why: 'Besluiten met eigenaren en data kun je opvolgen; discussies niet.',
        },
        {
          q: 'Wanneer moet een projectleider escaleren?',
          options: ['Pas als de tolerantie overschreden is', 'Telkens als de sponsor om nieuws vraagt', 'Als een tolerantie overschreden is of binnen twee weken wordt, met opties', 'Alleen in het maandelijkse overleg'],
          answer: 'Als een tolerantie overschreden is of binnen twee weken wordt, met opties',
          why: 'Vroeg escaleren met opties laat ruimte om te handelen; laat escaleren meldt alleen schade.',
        },
        {
          q: 'Eén lid van de stuurgroep legt zich nooit ergens op vast. Wat is de meest waarschijnlijke reden?',
          options: ['Hij is niet geïnteresseerd', 'Het overleg duurt te lang', 'Hij is het niet eens met het project', 'Hij mist mandaat van zijn eigen baas'],
          answer: 'Hij mist mandaat van zijn eigen baas',
          why: 'Wie zijn afdeling niet kan committeren, ontloopt besluiten; los het mandaat op, niet de persoon.',
        },
      ],
      situation: {
        scene: 'Je zit bij een fabrikant en bereidt je eerste stuurgroep als Vantage voor. De sponsor stuurt je de agenda van vorig kwartaal: tien updatepunten, geen besluiten, negen deelnemers.',
        ask: 'Wat stel je de sponsor voor?',
        model: '“Ik wil hier een overleg van maken dat beslist. Updates gaan drie dagen vooraf op papier rond. Op de agenda staan alleen de besluiten die we nodig hebben, elk met opties en een advies. En kunnen we op één A4 afspreken wie wat beslist, zodat de kleine dingen hier niet eens meer komen?” Ik zou hem ook vragen wie van de negen er echt bij moeten zijn.',
        rubric: [
          'Vervangt updates op de agenda door besluiten',
          'Stelt expliciete beslisbevoegdheden en toleranties voor',
          'Pakt aan wie er in de kamer moet zitten',
        ],
        pushback: {
          lines: [
            '“Mensen verwachten die updates. Als ik die schrap, denken ze dat de stuurgroep het niet belangrijk vindt.”',
            '“En negen mensen is het minimum. Iedereen wil vertegenwoordigd zijn.”',
          ],
          model: '“Snap ik, die updates voelen als aandacht. Ze kunnen in een korte notitie vooraf, die mensen toch al lezen. In de zaal: drie besluiten, vijf mensen die ze kunnen nemen. Laten we het twee keer proberen en dan de groep vragen wat ze ervan vinden.”',
          rubric: [
            'Erkent zijn zorg over aandacht en vertegenwoordiging',
            'Houdt vast aan een stuurgroep rond besluiten',
            'Stelt een korte proef voor die wordt geëvalueerd',
          ],
        },
      },
      sayIt: 'Leg een nieuwe sponsor in 60 seconden uit waardoor een stuurgroep beslist in plaats van discussieert.',
      terms: [
        { term: 'Beslisbevoegdheden', def: 'Een afgesproken lijst van wie wat beslist, op scope, budget, planning en mensen.' },
        { term: 'Tolerantie', def: 'De marge waarbinnen iemand mag beslissen zonder te escaleren.' },
        { term: 'Besluitenlijst', def: 'Een doorlopend overzicht van besluiten: wat, wie, wanneer.' },
      ],
    },
    {
      id: 'pm.portfolio.benefits',
      title: 'Van output naar baten',
      pre: [
        {
          q: 'Wanneer gaan de meeste baten van een project verloren?',
          options: ['Tijdens het ontwerp', 'In het jaar nadat het project is afgesloten', 'Tijdens de pilot', 'Als de business case geschreven wordt'],
          answer: 'In het jaar nadat het project is afgesloten',
          why: 'Het team vertrekt, de aandacht gaat ergens anders heen, en de oude manier sluipt terug terwijl niemand naar het getal kijkt.',
        },
      ],
      teach: [
        'Output, uitkomst, baten.\n\nOutput: de gereedheidscheck is live. Uitkomst: de afzeggingen dalen van 14% naar 8%. Baten: zo’n 1.200 verspilde ploegdagen per jaar minder, € 900k waard bij € 750 per ploegdag.\n\nProjecten leveren output; de lijn bezit uitkomsten en baten. Benoem de batenhouder voordat het project start: een manager op wiens budget of KPI het landt, niet de projectleider.',
        'Spreek de nulmeting en de meetwijze af voordat je begint.\n\nHoe tel je een afzegging? Over welke periode? Tellen stormweken mee of niet?\n\nSchrijf het op en laat de controller tekenen. Zonder afgesproken nulmeting wordt elk resultaat een discussie over definities in plaats van een gesprek over prestaties.',
        'Plan het volgen van de baten voor 6 tot 12 maanden na de livegang. De eigenaar bekijkt het getal maandelijks; er is een check-in na 3 en na 6 maanden; en er is een trigger: zakt het getal twee maanden achter elkaar voorbij een afgesproken niveau, dan grijpt de eigenaar in. Zet dit in het afsluitplan, met namen en data, anders gebeurt het niet.',
        'Wees eerlijk over toerekening. Daalden de afzeggingen terwijl er ook een nieuwe aannemer begon, dan kun je niet alles claimen.\n\nZeg “we schatten dat 60 tot 70% van de gereedheidscheck komt”, en laat zien waarom. Een directie vertrouwt een bescheiden getal dat je kunt verdedigen meer dan een groot getal dat je niet kunt verdedigen.',
      ],
      example: {
        kind: 'faded',
        text: 'Een omstelproject bij een fabrikant is in maart afgesloten. De gemiddelde omsteltijd ging van 90 naar 45 minuten; de business case beloofde € 300k per jaar.\n\nIn september vraagt de CFO waar die € 300k is. Jij vindt twee dingen: de omstellingen zijn teruggekropen naar 70 minuten, en de vrijgekomen capaciteit is nooit benut, want sales heeft geen volume toegevoegd en de weekenddienst draaide gewoon door.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Haal de twee problemen uit elkaar. Eén: de uitkomst is weggezakt. Dat is voor de operationeel manager, die de standaard herstelt met een korte audit en een maandelijkse review. Twee: zelfs bij 45 minuten waren er geen baten, want vrijgekomen capaciteit wordt pas geld als iemand er geld van maakt.\n\nLeg het MT de keuze voor: de weekenddienst schrappen, of meer volume verkopen. Bij allebei hoort een getal.\n\nBenoem dan één batenhouder, spreek de meetwijze af met de controller, en boek de € 300k pas als dat besluit genomen is. Zeg dit de CFO gewoon direct; ga de oude business case niet verdedigen.',
      },
      said: 'Wat je hoort in projecten: “Het project is afgesloten. Wie houdt dat getal nu eigenlijk in de gaten?”',
      recall: [
        {
          q: 'Wie hoort eigenaar te zijn van de baten van een project?',
          options: ['De projectleider', 'De consultant', 'De lijnmanager op wiens KPI of budget het landt', 'De afdeling finance'],
          answer: 'De lijnmanager op wiens KPI of budget het landt',
          why: 'De baten ontstaan in de lijn nadat het project klaar is, dus de lijn moet ze bezitten.',
        },
        {
          q: 'Een project bespaart 1.200 ploegdagen per jaar tegen € 750 per ploegdag. Wat zijn de jaarlijkse baten, in duizenden euro’s?',
          number: 900,
          tolerance: 1,
          unit: 'k€',
          why: '1.200 × € 750 = € 900.000.',
        },
        {
          q: '“De nieuwe planningstool is live.” Wat is dit?',
          options: ['Een uitkomst', 'Baten', 'Een nulmeting', 'Een output'],
          answer: 'Een output',
          why: 'Het is iets wat het project heeft opgeleverd; het zegt nog niks over prestaties of geld.',
        },
        {
          q: 'De afzeggingen daalden terwijl er tegelijk een andere verandering liep. Hoe rapporteer je dat?',
          options: ['Een geschat aandeel met de onderbouwing, bijvoorbeeld 60 tot 70%', 'De hele daling claimen', 'Voor de zekerheid niks claimen', 'Finance laten bepalen wat je zegt'],
          answer: 'Een geschat aandeel met de onderbouwing, bijvoorbeeld 60 tot 70%',
          why: 'Een onderbouwde bandbreedte is geloofwaardig; een volledige claim wordt uit elkaar getrokken.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, twee weken voor de overdracht van een project dat de afzeggingen van 14% naar 9% bracht. De projectleider zegt: “Mooi, we zijn klaar.” Niemand is aangewezen om het getal te bewaken als jij weg bent.',
        ask: 'Wat regel je voordat je vertrekt?',
        model: 'Ik zou de regiomanager vragen eigenaar te worden van het afzegpercentage, met de controller afspreken hoe het gemeten wordt, en een maandelijkse review op haar MT-agenda zetten. We spreken een trigger af, bijvoorbeeld twee maanden achter elkaar boven de 11% betekent actie, en ik bied een gratis check-in aan na 3 en na 6 maanden. Dan overleeft het resultaat mijn vertrek.',
        rubric: [
          'Wijst een lijneigenaar aan voor de baten, niet de projectleider',
          'Spreekt de meetwijze en een maandelijkse review af',
          'Zet een trigger en een moment om na de afsluiting terug te kijken',
        ],
        pushback: {
          lines: [
            '“We zitten op 9%. Het project is klaar. Een getal in de gaten houden is lijnwerk, geen project.”',
            '“Niemand heeft tijd voor nog een maandrapport. Als het oploopt, merken we dat heus.”',
          ],
          model: '“Eens, het project is klaar, en het is nu lijnwerk. Daarom wil ik er een naam op: iemand die één keer per maand vijf minuten naar het annuleringscijfer kijkt. Komt het boven de 11%, dan trekt die aan de bel. Wie in je team past daarbij?”',
          rubric: [
            'Erkent dat het project zelf klaar is',
            'Houdt vast aan een eigenaar van de baten na de overdracht',
            'Stelt een lichte, concrete check voor met een eigenaar',
          ],
        },
      },
      sayIt: 'Leg een projectleider in 60 seconden het verschil uit tussen output, uitkomst en baten, met één voorbeeld.',
      terms: [
        { term: 'Uitkomst', def: 'De verandering in prestatie die de output moet veroorzaken.' },
        { term: 'Batenhouder', def: 'De lijnmanager die na het project verantwoordelijk is voor het binnenhalen van de baten.' },
        { term: 'Nulmeting', def: 'De afgesproken startwaarde en precies hoe die gemeten wordt.' },
      ],
    },
    {
      id: 'pm.portfolio.capacity',
      title: 'Overal dezelfde experts',
      pre: [
        {
          q: 'Een sleutelengineer is voor een kwart van zijn tijd ingepland op elk van vier projecten. Wat gebeurt er meestal?',
          options: ['Elk project wacht op hem, en hij verliest een groot deel van zijn week aan schakelen', 'Hij levert op alle vier de volle waarde', 'De projecten zijn sneller klaar omdat ze parallel lopen', 'Niks, zolang hij goed plant'],
          answer: 'Elk project wacht op hem, en hij verliest een groot deel van zijn week aan schakelen',
          why: 'Eén expert dun uitsmeren maakt hem de bottleneck van vier projecten tegelijk.',
        },
      ],
      teach: [
        'Bij de meeste klanten is het probleem niet het totaal aan uren, maar dezelfde vijf mensen: de senior procesengineer, de planner die het systeem kent, die ene data-analist. Maak een simpele matrix: namen verticaal, projecten horizontaal, dagen per maand in elk vakje, en onderaan hun echte beschikbare dagen. Overboekte rijen zijn je conflicten.',
        'Echte beschikbaarheid is lager dan mensen denken. Van zo’n 260 werkdagen gaan er grofweg 50 af aan vakantie, feestdagen, ziekte en opleiding, en overleg en administratie nemen er nog meer. Er blijven zo’n 190 echte dagen over.\n\nKost het eigen werk 70%, dan zijn er 57 projectdagen per jaar: ongeveer vijf per maand. Die persoon “twee dagen per week” op je project inplannen is planningsfictie.',
        'Schakelen kost. Wie op drie of meer projecten zit, verliest een flink deel van de week aan schakelen en wachten, en elk project wacht op hem, dus de doorlooptijden groeien. Beter: minder projecten tegelijk, elk met een echt blok tijd, zoals dinsdag en donderdag voor project A.',
        'Maak afwegingen zichtbaar en laat de eigenaar beslissen. Laat de matrix zien met de rode vakjes en twee opties: “Optie 1: Jan werkt aan A en B, C start in mei. Optie 2: een externe doet C, 40 dagen à € 1.000, dus € 40k.”\n\nLos conflicten niet stilletjes op door mensen ’s avonds te laten doorwerken. Dat verstopt de echte kosten en je beste mensen branden op.',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een netbeheerder staat senior planner Fatima op vier projecten, waaronder het jouwe. Elke projectleider ging uit van één dag per week van haar. Haar manager zegt dat ze naast haar gewone planningswerk zo’n vier projectdagen per maand heeft.\n\nDe pilot van jouw project heeft haar in maart 8 dagen nodig. Twee andere projectleiders rekenen in maart ook op haar.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Vier projecten van één dag per week is zo’n 16 dagen per maand; ze heeft er 4. Maak de matrix voor haar en de twee of drie andere schaarse mensen, en neem hem mee naar degene die over alle vier de projecten gaat, niet naar Fatima.\n\nKom met opties: “Maart gaat naar de pilot en de anderen schuiven haar werk naar april en mei; of het regiokantoor leent 10 dagen een tweede planner uit; of de pilot schuift een maand op.” Vraag Fatima vooraf wat zij realistisch vindt; zij weet het. Plan daarna op het besluit, niet op hoop.',
      },
      said: 'Wat je hoort in projecten: “Kunnen we Fatima niet gewoon een paar dagen lenen?”',
      recall: [
        {
          q: 'Een expert heeft 190 beschikbare dagen per jaar en besteedt 70% aan zijn eigen werk. Hoeveel projectdagen heeft hij per jaar?',
          number: 57,
          tolerance: 1,
          unit: 'dagen',
          why: '30% van 190 is 57 dagen, ongeveer vijf per maand.',
        },
        {
          q: 'Wat zet je in een capaciteitsmatrix?',
          options: ['De totale headcount van de afdeling', 'De schaarse mensen, hun dagen per project en hun echte beschikbaarheid', 'Het budget per project', 'De geboekte uren van vorig jaar'],
          answer: 'De schaarse mensen, hun dagen per project en hun echte beschikbaarheid',
          why: 'Conflicten zitten bij een paar mensen met een naam, niet in de totalen.',
        },
        {
          q: 'Welke manier om een capaciteitsconflict op te lossen verstopt de echte kosten?',
          options: ['De eigenaar twee opties laten zien', 'De start van één project uitstellen', 'De expert vragen ’s avonds door te werken', 'Een externe inhuren'],
          answer: 'De expert vragen ’s avonds door te werken',
          why: 'De kosten worden onzichtbaar en komen terecht bij je beste mensen.',
        },
        {
          q: 'Waarom draai je minder projecten tegelijk met dezelfde experts?',
          options: ['Het staat beter in het portfoliorapport', 'Managers vinden het prettiger', 'Het scheelt alleen vergaderingen', 'Minder schakelen en wachten, dus elk project is eerder klaar'],
          answer: 'Minder schakelen en wachten, dus elk project is eerder klaar',
          why: 'Gerichte blokken tijd verkorten de doorlooptijd van elk project.',
        },
      ],
      situation: {
        scene: 'Je zit bij een levensmiddelenproducent. Drie projectleiders vertellen je alle drie dat dezelfde data-analist in juni “eigenlijk wel vastligt” voor hen. De analist zegt in overleggen niks.',
        ask: 'Wat doe je?',
        model: 'Ik zou de analist eerst onder vier ogen vragen hoeveel dagen ze in juni echt heeft en wat ze heeft toegezegd. Dan zet ik het in een simpele matrix en neem het mee naar de operationeel manager die over de projecten gaat: “Ze heeft 8 dagen, we vragen er 25. Hier zijn twee opties.” Het besluit ligt bij hem, en ik vertel de drie projectleiders vooraf dat het eraan komt.',
        rubric: [
          'Checkt de echte beschikbaarheid rechtstreeks bij de expert',
          'Maakt de overboeking zichtbaar in getallen',
          'Komt met opties bij de eigenaar in plaats van op de gang te onderhandelen',
        ],
        pushback: {
          lines: [
            '“Ze zei tegen mij dat juni prima was. Mijn project was eerst, dus ze is van mij.”',
            '“Waarom maak je er zo’n punt van? Ze redt het wel; dat doet ze altijd.”',
          ],
          model: '“Dat geloof ik, en waarschijnlijk zei ze het tegen jullie alle drie. Drie keer ‘zo goed als toegezegd’ is meer dan één persoon. Ik wil deze week met de drie projectleiders en haar om tafel om juni per dag te verdelen. Dan weet iedereen wat hij krijgt.”',
          rubric: [
            'Erkent zijn claim zonder hem weg te wuiven',
            'Benoemt de overbelasting helder',
            'Stelt een concrete gezamenlijke verdeling voor, met de analist erbij',
          ],
        },
      },
      sayIt: 'Leg een projectleider in 60 seconden uit waarom “twee dagen per week Fatima” waarschijnlijk niet bestaat.',
      terms: [
        { term: 'Capaciteitsmatrix', def: 'Namen verticaal, projecten horizontaal, dagen per vakje, met de echte beschikbaarheid onderaan.' },
        { term: 'Echte beschikbaarheid', def: 'De dagen die overblijven voor projecten na vakantie, ziekte, opleiding en het eigen werk.' },
        { term: 'Contextswitch', def: 'Tijd die je verliest als iemand tussen projecten springt en de draad weer moet oppakken.' },
      ],
    },
    {
      id: 'pm.portfolio.boardroom',
      title: 'Voor de directie',
      pre: [
        {
          q: 'Je hebt 20 minuten op de MT-agenda. Wanneer zeg je welk besluit je nodig hebt?',
          options: ['Aan het eind, na het bewijs', 'Alleen als ze erom vragen', 'In de eerste minuut', 'Achteraf in een mail'],
          answer: 'In de eerste minuut',
          why: 'Een directie luistert anders zodra ze weet waarover ze moet beslissen.',
        },
      ],
      teach: [
        'Eén A4, antwoord eerst. Bovenaan staat het besluit dat je nodig hebt.\n\nDan: waarom nu, twee of drie opties met elk kosten, baten en risico, jouw advies, en wat er gebeurt als ze niet beslissen. Detail gaat in een bijlage. Een directie leest de eerste alinea en de getallen; schrijf daarvoor.',
        'Twintig minuten op de agenda betekent ongeveer vijf minuten praten en vijftien minuten discussie. Open met: “Ik heb vandaag één besluit nodig: X. Ik adviseer Y, om drie redenen.” Loop geen twintig slides door; ze onderbreken je toch bij slide drie.',
        'Voorsorteren. De week ervoor loop je het stuk één-op-één door met de twee of drie mensen wiens mening zwaar weegt. Niks in het overleg mag hen verrassen.\n\nDe meeste directiebesluiten worden vóór het overleg genomen; het overleg bevestigt ze. Gaat iemand dwarsliggen, dan wil je dat nu weten, niet in de kamer.',
        'De lastige vraag. Laat hem uitpraten, herhaal de kern, antwoord in één zin, en geef dan het bewijs.\n\nWeet je het niet: “Dat getal heb ik hier niet; je hebt het donderdag.” Zit er een bezwaar achter, zoals “Is dit echt de prioriteit?”, benoem het dan: “Je vraagt of dit belangrijker is dan de ERP-upgrade. Hier is de vergelijking.”\n\nGa in de kamer nooit in discussie met de voorzitter.',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage heeft bij een netbeheerder een pilot gedraaid in één regio: afzeggingen van 14% naar 9%. Je gaat de directie € 1,2 miljoen vragen om het in 18 maanden uit te rollen naar vier regio’s.\n\nJe hebt volgende dinsdag 20 minuten. De CFO staat erom bekend voorstellen uit elkaar te trekken, en vorige maand schoot ze een ander programma af omdat “baten altijd te rooskleurig zijn”.',
        ask: 'Hoe zou jij je voorbereiden en openen?',
        reveal: 'Schrijf één A4: het besluit (€ 1,2 miljoen voor vier regio’s), het pilotresultaat met de nulmeting waar de controller mee akkoord ging, de verwachte baten als bandbreedte met jouw toerekening, en twee opties: volledige uitrol, of eerst twee regio’s voor € 650k met een go/no-go na 9 maanden.\n\nSpreek de CFO vooraf: “Ik weet dat je vaker te rooskleurige baten hebt gezien. Zo hebben we gemeten, en dit is de voorzichtige variant.” Vraag wat haar zou overtuigen.\n\nOpen in de kamer met het besluit en het advies, en gebruik de pilotcijfers als bewijs, niet als verhaal.',
      },
      said: 'Wat je hoort in projecten: “Waar vraag je ons nu precies over te beslissen?”',
      recall: [
        {
          q: 'Wat staat er bovenaan een directiestuk?',
          options: ['De achtergrond van het project', 'Het besluit dat je nodig hebt', 'Je aanpak', 'Het betrokken team'],
          answer: 'Het besluit dat je nodig hebt',
          why: 'Lezers haken af na de eerste alinea; daar moet de vraag in staan.',
        },
        {
          q: 'Je hebt een slot van 20 minuten. Hoeveel minuten praat je ongeveer voordat de discussie begint?',
          number: 5,
          tolerance: 2,
          unit: 'minuten',
          why: 'Ongeveer een kwart praten en de rest discussie, want de directie beslist in de discussie.',
        },
        {
          q: 'Waarom sorteer je een directiestuk vooraf voor met sleutelfiguren?',
          options: ['Zodat je helemaal niet hoeft te presenteren', 'Omdat het wettelijk verplicht is', 'Om het stuk korter te maken', 'De meeste besluiten vallen vóór het overleg, en niemand mag verrast worden'],
          answer: 'De meeste besluiten vallen vóór het overleg, en niemand mag verrast worden',
          why: 'Verraste directieleden gaan in de verdediging; voorbereide leden beslissen.',
        },
        {
          q: 'Een directielid vraagt: “Is dit nu echt de prioriteit?” Wat is de beste reactie?',
          options: ['De verborgen vergelijking benoemen en laten zien: “Je vraagt of dit belangrijker is dan X. Zo verhouden ze zich.”', 'De voordelen van je project herhalen', 'Zeggen dat de sponsor al akkoord is', 'Beloven volgend kwartaal terug te komen'],
          answer: 'De verborgen vergelijking benoemen en laten zien: “Je vraagt of dit belangrijker is dan X. Zo verhouden ze zich.”',
          why: 'Zo beantwoord je het echte bezwaar in plaats van de woorden.',
        },
      ],
      situation: {
        scene: 'Je presenteert aan het MT van een fabrikant. Twee minuten in onderbreekt de CEO je: “Ik heb het stuk gelezen. Waarom zouden we € 300k hieraan uitgeven terwijl de marges onder druk staan?”',
        ask: 'Wat zeg je?',
        model: '“Terechte vraag. Kort antwoord: het is in ongeveer 10 maanden terugverdiend, via de € 360k per jaar minder uitval die de pilot liet zien. Zijn de marges de zorg, dan is de kleinere optie om te starten op lijn 1 voor € 120k en in Q3 over de rest te beslissen.” Dan stop ik en laat hem reageren, in plaats van terug te gaan naar mijn slides.',
        rubric: [
          'Antwoordt in één of twee zinnen voordat er detail komt',
          'Gebruikt getallen en biedt een kleinere optie',
          'Stopt met praten en laat de directie discussiëren',
        ],
        pushback: {
          lines: [
            '“Dat is de slide die ik al gelezen heb. Ik vroeg waarom nu, nu de marges onder druk staan.”',
            '“Elke consultant belooft terugverdientijd. Wat als die niet komt?”',
          ],
          model: '“Juist omdat de marges onder druk staan: de verliezen die we gemeten hebben, gaan rechtstreeks van de marge af. We knippen het op: eerst één lijn, met na drie maanden een go of no-go op gemeten resultaat. Verdient het zich daar niet terug, dan stop je.”',
          rubric: [
            'Erkent de druk op de marges',
            'Beantwoordt de vraag waarom nu direct',
            'Stelt een gefaseerde stap voor met een duidelijk stopmoment',
          ],
        },
      },
      sayIt: 'Leg een projectleider in 60 seconden uit hoe je in een slot van 20 minuten een besluit van een MT krijgt.',
      terms: [
        { term: 'Antwoord eerst', def: 'Het besluit en het advies bovenaan, het bewijs erna.' },
        { term: 'Voorsorteren', def: 'Sleutelfiguren vóór het overleg één-op-één door een voorstel heen nemen.' },
        { term: 'Verborgen bezwaar', def: 'De echte zorg achter een vraag, vaak een vergelijking met iets anders.' },
      ],
    },
  ],
};

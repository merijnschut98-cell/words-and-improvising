// pm.intake (Nederlands): intake, van de vraag van de klant naar een project dat het waard is.
export default {
  lessons: [
    {
      id: 'pm.intake.ask',
      title: 'Wat ze vragen, wat ze nodig hebben',
      pre: [
        {
          q: 'Een plantmanager (de baas van de hele fabriek) begint met: “We hebben een nieuwe planningstool nodig.” Wat is dat waarschijnlijk?',
          options: ['Het probleem dat opgelost moet worden', 'Een oplossing die ze al gekozen hebben', 'Het doel van het project', 'Een scopegrens (een grens aan wat het project omvat)'],
          answer: 'Een oplossing die ze al gekozen hebben',
          why: 'Klanten komen meestal binnen met een oplossing; jij zoekt het probleem dat die moet oplossen.',
        },
      ],
      teach: [
        'Klanten komen zelden met een probleem. Ze komen met een oplossing (“we willen een dashboard”, een scherm vol cijfers) of een symptoom (“orders zijn te laat”).\n\nHaal drie lagen uit elkaar. Het symptoom is wat ze zien. Het probleem is de oorzaak eronder, waar een project echt iets aan kan doen. Het doel is wat er meetbaar anders moet zijn als het opgelost is.\n\nEen project op het symptoom lost niks op; een project op hun gekozen oplossing lost misschien het verkeerde op.',
        'Vragen die eronder komen: “Waaraan merk je het?”, “Sinds wanneer?”, “Wat hebben jullie al geprobeerd?”\n\nMaak het dan groot of klein: “Wat kost het je per week?” en “Wat gebeurt er als er een jaar niks verandert?” Dat zijn de kosten van niksdoen (cost of inaction). Die vertellen je of een project het waard is.\n\nVraag naar één recent geval: “Neem me eens mee in die late order van vorige week dinsdag.” Een concreet geval laat het echte mechanisme zien; het algemene beeld hun mening.',
        'Vaak opent iemand met een target op een KPI (key performance indicator: een getal waar het management op stuurt), bijvoorbeeld de OEE. OEE (overall equipment effectiveness) is het deel van de geplande tijd dat een machine op volle snelheid goede producten maakt.\n\n85% heet vaak wereldklasse; veel fabrieken zitten rond de 60%. “Van 58 naar 75%” is nog een wens op symptoomniveau. Vraag waar de 42 punten heen gaan: storingen, omstellen (de machine ombouwen voor een ander product), langzaam draaien of afkeur (afgekeurde producten).',
        'De mensenkant: wie de vraag stelt, heeft vaak zijn naam verbonden aan die oplossing. Ga er niet tegenin. Zeg: “Zo’n planningstool kan best onderdeel van de oplossing zijn. Om zeker te weten dat hij iets oplevert: mag ik eerst zien waar de vertraging vandaan komt?”\n\nWeerstand klinkt als “dat hebben we al geanalyseerd”. Antwoord: “Mooi, dan gaat het snel. Kun je het me laten zien?” Kunnen ze het niet laten zien, dan weet je ook iets.',
        'Experts verschillen in hoe hard je doordrukt. Sommigen zeggen: neem nooit de oplossing van de klant over voordat je het probleem gezien hebt. Anderen: een klant die al een tool koos, heeft het vaak half gediagnosticeerd. Een eerlijk midden: zie hun oplossing als hypothese, een vermoeden dat je in een week of twee met data checkt.\n\nKen je de techniek nog niet, zeg dat: “Ik ken jullie proces nog niet, dus ik stel wat naïeve vragen.” Schrijf hun woorden letterlijk op; die gebruik je straks in de doelzin.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder (het bedrijf dat het regionale stroomnet beheert) vraagt een teamleider om “een beter dashboard voor de werkorders”, de klussen die voor de monteurs gepland staan. Je vraagt wat hij ermee zou doen.\n\n“Zien welke klussen vastlopen.” Waar lopen ze vast? “Op vergunningen en materiaal.”\n\nHoeveel? Hij kijkt: 140 van de 600 openstaande orders wachten al langer dan 4 weken, 90 daarvan op materiaal.\n\nSymptoom: orders lopen vast. Probleem: materiaalreserveringen zijn niet gekoppeld aan de planning. Doel: geen order wacht langer dan 4 weken op materiaal.\n\nHet dashboard wordt een klein onderdeel, niet het project.',
      },
      said: 'Wat je hoort in projecten: “We hebben geen onderzoek nodig, we hebben iemand nodig die gewoon die tool bouwt.” Met onderzoek bedoelen ze de analyse van waar het probleem vandaan komt.',
      recall: [
        {
          q: '“Onze orders gaan te laat de deur uit” is vooral…',
          options: ['het doel', 'het probleem', 'het symptoom', 'de scope (wat het project omvat)'],
          answer: 'het symptoom',
          why: 'Het is wat ze zien; de oorzaak eronder is het probleem.',
        },
        {
          q: 'Welke vraag komt het best onder de vraag van de klant?',
          options: ['“Neem me eens mee in de laatste keer dat het misging.”', '“Ben je het met me eens dat dit belangrijk is?”', '“Welke tool zou je willen?”', '“Wanneer moet het project klaar zijn?”'],
          answer: '“Neem me eens mee in de laatste keer dat het misging.”',
          why: 'Een concreet recent geval laat het mechanisme zien, niet alleen de mening.',
        },
        {
          q: 'De klant blijft vasthouden aan zijn eigen oplossing. Wat is de beste reactie?',
          options: ['Zeggen dat die oplossing voorbarig is', 'Akkoord gaan en gaan bouwen om vertrouwen te winnen', 'Eerst om een formele aanvraag vragen', 'Het meenemen als mogelijk onderdeel en eerst willen zien waar het probleem vandaan komt'],
          answer: 'Het meenemen als mogelijk onderdeel en eerst willen zien waar het probleem vandaan komt',
          why: 'Je houdt hun idee overeind en checkt of het het echte probleem oplost.',
        },
        {
          q: 'Waarom vraag je wat het probleem per week kost?',
          options: ['Om je tarief te bepalen', 'Om de omvang van het probleem te bepalen, zodat je het tegen de inspanning kunt afwegen', 'Om uit te zoeken wiens schuld het is', 'Omdat elke sponsor (de manager die betaalt) een business case (een som van kosten en baten) wil'],
          answer: 'Om de omvang van het probleem te bepalen, zodat je het tegen de inspanning kunt afwegen',
          why: 'Een probleem zonder omvang kun je niet prioriteren en niet afwegen tegen een project.',
        },
      ],
      situation: {
        scene: 'Je zit bij een metaalstansbedrijf, waar persen plaatstaal tot onderdelen ponsen en buigen. De operations manager begint met: “Onze OEE is 58%, we willen binnen een half jaar naar 75%.” (OEE: het deel van de geplande tijd dat de persen op volle snelheid goede producten maken.) “Kun je daar een verbeterteam op zetten?”',
        ask: 'Wat vraag je voordat je ergens ja op zegt?',
        model: '“75% zou mooi zijn. Voordat we iets afspreken: waar gaan die 42 punten nu ongeveer naartoe, storingen, omstellen, snelheidsverlies of afkeur? En welke perslijn doet jullie leverprestatie het meeste pijn?” En dan: “Wat hebben jullie al geprobeerd, en wat gebeurt er als de OEE op 58 blijft?”',
        rubric: [
          'Gaat niet meteen akkoord met het target en wijst het ook niet af',
          'Vraagt waar het verlies echt zit, per verliessoort of per lijn',
          'Vraagt wat er al geprobeerd is en wat niks doen kost',
        ],
        pushback: {
          lines: [
            '“Daar kijken we al jaren naar. We weten heus waar de verliezen zitten. Ik heb mensen op de vloer nodig, geen vragen.”',
            '“Zes maanden, dat heb ik de directie beloofd. Als jij met analyse begint, zijn we er twee kwijt.”',
          ],
          model: '“Terecht, jij kent die persen veel beter dan ik. Dan gaat het snel: laat me deze week jullie verliesverdeling zien, en maandag zetten we het team op het grootste verlies. Geen maanden analyse; één week, dan gaan we aan de slag.”',
          rubric: [
            'Erkent zijn kennis en zijn deadline',
            'Houdt vast aan eerst weten waar het verlies zit',
            'Stelt een korte stap met een datum voor',
          ],
        },
      },
      sayIt: 'Leg een nieuwe collega in 60 seconden het verschil uit tussen symptoom, probleem en doel, met late orders als voorbeeld.',
      terms: [
        { term: 'Symptoom', def: 'Wat de klant ziet en waar hij over klaagt, zoals late orders.' },
        { term: 'Probleem', def: 'De oorzaak onder het symptoom, waar een project iets aan kan veranderen.' },
        { term: 'Doel', def: 'Wat er meetbaar anders moet zijn als het probleem is opgelost.' },
        { term: 'Kosten van niksdoen', def: 'Wat het de klant kost als er niks verandert, per week of per jaar; zo bepaal je hoe groot het probleem is.' },
        { term: 'OEE', def: 'Overall equipment effectiveness: het deel van de geplande tijd dat een machine op volle snelheid goede producten maakt.' },
      ],
    },
    {
      id: 'pm.intake.firsttalk',
      title: 'Het eerste gesprek',
      pre: [
        {
          q: 'Hoeveel van de tijd zou de klant aan het woord moeten zijn in een intake (het eerste gesprek over een mogelijk project) van een uur?',
          options: ['Ongeveer de helft', 'Ongeveer een kwart', 'Hangt af van zijn senioriteit', 'Ongeveer driekwart'],
          answer: 'Ongeveer driekwart',
          why: 'Je leert door te luisteren; mik op 70 tot 80% spreektijd voor de klant.',
        },
      ],
      teach: [
        'Een simpele opbouw voor een intake van een uur.\n\nOpenen (5 minuten): waarom je er zit en waarmee je weg wilt. Verkennen (35): hun verhaal, het probleem, de mensen. Checken (10): samenvatten, vragen wat er mist. Afsluiten (10): volgende stap met een datum.\n\nBenoem die opbouw aan het begin: “Ik wil vandaag vooral luisteren en eindigen met een concrete volgende stap. Is dat goed?” Dat geeft rust.',
        'Gebruik MORE PIES als luisterchecklist.\n\nMood: lees de sfeer. Open vragen: vragen waar je geen ja of nee op kunt zeggen, zoals “Hoe gaat een gewone maandag?”. Reflecteren: het gevoel benoemen dat je hoort, “Dat klinkt frustrerend.”\n\nEmpathie. Parafraseren: de kern in je eigen woorden teruggeven, “Dus het grootste probleem is…”. Inquiry: doorvragen op één ding. Experience: deel kort je eigen ervaring, alleen voor vertrouwen. Silence: wacht drie tellen na een antwoord.',
        'Waarom dit werkt: mensen corrigeren een verkeerde samenvatting veel makkelijker dan dat ze uit zichzelf het hele verhaal vertellen. In die correctie zit het echte punt.\n\nMik op 70 tot 80% spreektijd voor de klant. Merk je dat je twee minuten achter elkaar praat, stop dan en stel een vraag. Junioren vullen stiltes vaak op uit zenuwen; de belangrijkste zin komt vaak net na de stilte.',
        'Weerstand in een eerste gesprek is meestal stil: korte antwoorden, “het staat allemaal in het rapport”, een telefoon open op tafel. Benoem het luchtig: “Ik krijg de indruk dat hier al eerder naar gekeken is. Hoe ging dat toen?”\n\nVaak heeft een vorige consultant een mooi slidedeck achtergelaten en is er niks veranderd. Laat ze dat verhaal vertellen. Over aantekeningen op een laptop verschillen experts; een papieren notitieboek voelt minder als een verhoor.',
        'Ga weg met vijf dingen: het probleem in hun woorden, drie namen van mensen om te spreken, welke data je mag zien, wat succes is voor de sponsor (de manager die betaalt en beslist), en een datum voor de volgende stap.\n\nStuur binnen 24 uur een intakesamenvatting: één A4 met die vijf dingen. Wat je nog niet weet, zet je erin als open vraag, niet als aanname. Een scherpe slotvraag: “Wanneer zeg jij over een half jaar: dit was het waard?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een zuivelfabriek spreek je de productiemanager een uur. Minuut 0 tot 5: je zegt wat je doel is.\n\n5 tot 40: ze vertelt over een afvullijn met 6 omstellingen per dag (de lijn ombouwen voor een ander product, changeover) van 50 minuten. Je parafraseert: “Dus er gaan vijf uur per dag naar omstellen, en dat houdt het extra volume tegen?”\n\nZe corrigeert je: “Nee, het reinigen is het grotere probleem.” Die correctie is goud waard.\n\n40 tot 50: je vat samen. 50 tot 60: je spreekt af donderdag de lijn op te gaan en twee ploegleiders te spreken. De samenvatting gaat dezelfde avond de deur uit.',
      },
      said: 'Wat je hoort in projecten: “We hebben hier eerder consultants gehad. Mooie slides, er veranderde niks.”',
      recall: [
        {
          q: 'Waarom parafraseer je (in je eigen woorden teruggeven) het verhaal van de klant?',
          options: ['Om te laten zien dat je aantekeningen maakt', 'Zodat hij je kan corrigeren en je hoort wat er echt toe doet', 'Om het gesprek te versnellen', 'Om hem richting jouw oplossing te sturen'],
          answer: 'Zodat hij je kan corrigeren en je hoort wat er echt toe doet',
          why: 'Correcties laten zien waar jouw beeld afwijkt van het zijne.',
        },
        {
          q: 'De klant geeft korte antwoorden en zegt “het staat allemaal in het rapport”. Wat doe je?',
          options: ['Samen het rapport pagina voor pagina doorlopen', 'Overstappen op gesloten vragen (ja/nee-vragen) om de feiten te krijgen', 'Het gesprek eerder afronden en opnieuw plannen', 'Het luchtig benoemen en vragen hoe het de vorige keer ging'],
          answer: 'Het luchtig benoemen en vragen hoe het de vorige keer ging',
          why: 'Stille weerstand komt vaak voort uit een eerder project dat op niks uitliep.',
        },
        {
          q: 'Wat betekent Silence uit MORE PIES in de praktijk?',
          options: ['Een paar tellen wachten na een antwoord voordat je iets zegt', 'Niet over je eigen ervaring praten', 'Slecht nieuws voor je houden tot je data hebt', 'De sponsor in elk overleg als eerste laten praten'],
          answer: 'Een paar tellen wachten na een antwoord voordat je iets zegt',
          why: 'Mensen vullen de stilte op, vaak met het belangrijkste.',
        },
        {
          q: 'Waarmee ga je na het eerste gesprek in elk geval de deur uit?',
          options: ['Een getekend projectplan', 'Een lijst met oplossingen om te testen', 'Namen van mensen om te spreken en een datum voor de volgende stap', 'Overeenstemming over het budget'],
          answer: 'Namen van mensen om te spreken en een datum voor de volgende stap',
          why: 'Een eerste gesprek is voor begrip en toegang, niet voor toezeggingen.',
        },
      ],
      situation: {
        scene: 'Je zit in een eerste gesprek met de assetmanager van een netbeheerder (verantwoordelijk voor kabels en stations over hun hele levensduur). Het gaat over vertraging bij het vervangen van MS-stations: middenspanningsstations, de huisjes in de wijk die 10.000 tot 20.000 volt omzetten naar huishoudspanning. Na een kwartier zegt hij: “Eerlijk gezegd denk ik dat de planners het gewoon niet goed genoeg doen.”',
        ask: 'Hoe reageer je op dat moment?',
        model: 'Niet meegaan en de planners ook niet verdedigen. Reflecteer en vraag door: “Dat klinkt alsof het je veel frustratie heeft gekost. Wat heb je zien gebeuren waardoor je dat zegt?” Vraag naar een recent voorbeeld, en vraag later met welke planners je kunt praten, zodat je hun kant ook hoort.',
        rubric: [
          'Gaat niet mee in de schuldvraag en gaat er ook niet tegenin',
          'Gebruikt reflecteren of doorvragen om een concreet voorbeeld te krijgen',
          'Plant om ook de andere kant te horen, de planners zelf',
        ],
        pushback: {
          lines: [
            '“Kom op, ik werk al jaren met die planners. Je hoeft niet te graven, ik vertel je toch wat het probleem is.”',
            '“Dus jij denkt dat ik het mis heb? Ik heb je ingehuurd om de planning te verbeteren, niet om mijn mensen ter discussie te stellen.”',
          ],
          model: '“Ik denk niet dat je het mis hebt; ik wil het zien zoals jij het ziet. Als het aan de planners ligt, laten de laatste drie vertraagde stations dat snel zien. Zullen we die donderdag samen doorlopen? Dan weet ik waar ik moet beginnen.”',
          rubric: [
            'Erkent zijn beeld zonder mee te gaan of in discussie te gaan',
            'Blijft vragen naar concrete gevallen voor een conclusie',
            'Stelt een concrete volgende stap met echte gevallen voor',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden uit hoe je een eerste klantgesprek aanpakt, van opening tot waarmee je weggaat.',
      terms: [
        { term: 'MORE PIES', def: 'Luisterchecklist: Mood, Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry, Experience, Silence.' },
        { term: 'Open vragen', def: 'Vragen waar je geen ja of nee op kunt zeggen, zodat de ander het verhaal vertelt.' },
        { term: 'Reflecteren', def: 'Het gevoel benoemen dat je hoort (“dat klinkt frustrerend”), zodat iemand zich gehoord voelt en verder vertelt.' },
        { term: 'Parafraseren', def: 'De kern van wat iemand zei in je eigen woorden teruggeven, zodat hij kan bevestigen of corrigeren.' },
        { term: 'Intakesamenvatting', def: 'Eén A4 binnen 24 uur: probleem, mensen, data, succes, volgende stap, open vragen.' },
      ],
    },
    {
      id: 'pm.intake.stakeholders',
      title: 'Wie beslist, wie kan het stoppen',
      pre: [
        {
          q: 'Wie kan een verbeterproject in een fabriek het makkelijkst stoppen, zonder ooit nee te zeggen?',
          options: ['De middenmanagers van wie de mensen anders moeten gaan werken', 'De CEO', 'De externe consultant', 'De afdeling finance'],
          answer: 'De middenmanagers van wie de mensen anders moeten gaan werken',
          why: 'Zij gaan over de tijd van mensen; ze laten een project stilletjes stranden door niemand vrij te maken.',
        },
      ],
      teach: [
        'Een stakeholder is iedereen die invloed heeft op het project of er last of baat van heeft. Vier rollen tellen het meest.\n\nSponsor: eigenaar van budget en resultaat, en kan beslissen. Proceseigenaar: de manager die het proces runt en met de verandering moet leven. Gebruikers: de operators, planners of monteurs van wie het werk verandert.\n\nBlokkeerders: iedereen wiens belang, macht of tijd geraakt wordt, vaak IT, de OR (ondernemingsraad, works council) of een ploegleider met twintig dienstjaren. Eén persoon kan twee rollen hebben.',
        'Een stakeholdermap heeft twee assen: invloed (kunnen ze het stoppen of versnellen?) en belang (verandert hun werk?). Het idee wordt meestal aan Mendelow toegeschreven, uit 1991.\n\nHoog op allebei: wekelijks betrekken. Veel invloed, weinig belang: tevreden houden, met korte updates in hun taal. Weinig invloed, veel belang: goed informeren en laten meedoen, zij kennen de details.\n\nTeken hem na de intake in een kwartier op papier en werk hem elke maand bij. Mensen schuiven op de map mee met het project.',
        'Vraag het gewoon: “Wie beslist of dit doorgaat?”, “Wie kan het tegenhouden, ook zonder het hardop te zeggen?” en “Wie heeft zo’n project al eens meegemaakt?”\n\nOp de tweede vraag krijg je vaak een lachje en een naam. Schrijf die naam op. Met die persoon zit je deze week nog één op één.\n\nCheck vroeg of de OR erbij moet. Voor een wijziging van werktijden of ploegenroosters heeft de OR instemmingsrecht; sla je dat over, dan kan een project maanden stilliggen.',
        'Weerstand klinkt zelden als “nee”. Het ziet eruit als gemiste afspraken, mensen die niet vrijgemaakt worden, of “interessant, laten we het in het MT bespreken” (het managementteam).\n\nEscaleer niet als eerste stap. Escalatie betekent een vastgelopen punt voorleggen aan iemand hoger die kan beslissen. Ga eerst erheen en vraag: “Hoe zou dit eruit moeten zien om voor jouw team te werken?” Escaleer pas naar de sponsor als een besluit echt vastzit, en zeg het de persoon vooraf.',
        'Een bekende valkuil: op de map staan alleen namen uit het organogram (het schema van wie onder wie valt). De echte macht zit vaak bij een planner die iedereen om raad vraagt, of bij de vakbondsman.\n\nExperts verschillen over of je de map aan de klant laat zien. Velen houden een neutrale versie voor het team en hun eigen notities privé: “weinig steun” op een slide die iemand ziet, doet schade. Scherpe vraag aan de sponsor: “Wiens steun hebben we nodig die we nog niet hebben?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder: een project om de doorlooptijd (lead time, de weken van aanvraag tot werkende aansluiting) van aansluitingen voor kleinzakelijke klanten te verkorten. Sponsor: directeur klantaansluitingen. Proceseigenaar: hoofd werkvoorbereiding. Gebruikers: 12 werkvoorbereiders en 40 monteurs.\n\nInvloedrijk en stil: de IT-eigenaar van het planningssysteem en de regionale teamleiders die de ploegen indelen. Op je map staan de teamleiders hoog op invloed en belang, maar niemand heeft ze uitgenodigd. Je plant in week één drie één-op-ééntjes.\n\nEén teamleider vertelt dat ploegen 30% van de tijd naar storingen worden gehaald. Dat wordt cruciale data.',
      },
      said: 'Wat je hoort in projecten: “Interessant, laten we het op de MT-agenda zetten.” Vaak betekent dat: nu niet, en misschien nooit.',
      recall: [
        {
          q: 'Wie is de sponsor?',
          options: ['Degene met het meeste belang bij het resultaat', 'De manager die het proces dagelijks runt', 'Degene die het gesprek begon', 'Degene die eigenaar is van budget en resultaat en kan beslissen'],
          answer: 'Degene die eigenaar is van budget en resultaat en kan beslissen',
          why: 'Zonder iemand die kan beslissen blijft elke vastgelopen keuze vastzitten.',
        },
        {
          q: 'Een stakeholder heeft veel invloed maar weinig belang. Wat doe je?',
          options: ['Wekelijks laten meedraaien in werksessies', 'Tevreden houden met korte updates in zijn eigen taal', 'Tot het einde buiten beeld laten', 'Vragen of hij sponsor wil worden'],
          answer: 'Tevreden houden met korte updates in zijn eigen taal',
          why: 'Hij kan je stoppen maar wil je details niet; korte updates houden hem aan boord.',
        },
        {
          q: 'Een ploegleider maakt steeds geen operators vrij voor de workshops. Wat is je eerste stap?',
          options: ['Het melden bij de sponsor', 'De workshops plannen zonder zijn ploeg', 'Hem vragen hoe het eruit moet zien om voor zijn ploeg te werken', 'De workshops naar het weekend verplaatsen'],
          answer: 'Hem vragen hoe het eruit moet zien om voor zijn ploeg te werken',
          why: 'Er is meestal een echte reden, zoals bezetting of productietargets; zoek die eerst.',
        },
        {
          q: 'Waarom vraag je “Wie kan dit tegenhouden, ook zonder het te zeggen?”',
          options: ['Zo komen verborgen blokkeerders boven die je vroeg moet spreken', 'Zo laat je de sponsor zien dat je kritisch bent', 'Het helpt bij het vaststellen van het budget', 'Het is een standaardvraag uit het risicoregister (de risicolijst van het project)'],
          answer: 'Zo komen verborgen blokkeerders boven die je vroeg moet spreken',
          why: 'Wie je kan laten stranden, staat zelden op de organogramslide.',
        },
      ],
      situation: {
        scene: 'Je zit twee weken in een omstelproject bij een verpakkingsfabriek: de lijnen moeten sneller van product wisselen. De sponsor, de plantmanager, is enthousiast. De manager TD (technische dienst, het onderhoud) is bij beide stuurgroepen (steering group, het maandelijkse overleg waar de sponsor voortgang checkt en beslist) niet komen opdagen en zijn monteurs hebben het “te druk” voor de pilot, de kleine proef op één lijn.',
        ask: 'Wat doe je deze week?',
        model: 'Zoek de manager TD één op één op, niet in de stuurgroep. “Ik zie dat je team onder druk staat en deze pilot kost ze tijd. Hoe zou het eruit moeten zien om voor jou te werken?” Luister naar het echte probleem, bijvoorbeeld een achterstand in storingen of geen inspraak in het ontwerp. Pas als een capaciteitsbesluit vast blijft zitten, vraag je de sponsor om te beslissen, en dat zeg je hem eerst.',
        rubric: [
          'Spreekt de manager TD één op één voordat hij escaleert',
          'Vraagt wat er nodig is om het voor zijn team te laten werken en zoekt de echte reden',
          'Escaleert alleen bij een vastgelopen besluit, en open',
        ],
        pushback: {
          lines: [
            '“Kijk, mijn mensen houden de lijnen draaiende. Jouw pilot is mooi, maar als er een lijn stilvalt, is dat mijn probleem, niet het jouwe.”',
            '“De directeur wil dit, prima. Mij heeft niemand iets gevraagd. Dus reken er niet op dat ik monteurs vrijmaak.”',
          ],
          model: '“Je hebt gelijk, niemand heeft het je gevraagd, en dat was een fout van onze kant. Jij draagt het risico als een lijn stilvalt. Help me dan de pilot zo in te richten dat dat niet gebeurt: welke lijn en welke uren kosten jou het minst? Jouw antwoord neem ik graag mee naar de volgende stuurgroep.”',
          rubric: [
            'Erkent zijn risico en dat hij erbuiten is gelaten',
            'Houdt de pilot en zijn rol erin op tafel',
            'Stelt een concrete manier voor om hem mee te laten ontwerpen',
          ],
        },
      },
      sayIt: 'Leg de projectleider van de klant in 60 seconden uit waarom je de teamleiders wilt spreken vóór de kick-off, het overleg waarmee het project officieel start.',
      terms: [
        { term: 'Stakeholder', def: 'Iedereen die invloed heeft op het project of er last of baat van heeft.' },
        { term: 'Sponsor', def: 'Eigenaar van budget en resultaat, en kan besluiten nemen.' },
        { term: 'Proceseigenaar', def: 'De manager die het proces dagelijks runt en met de verandering moet leven.' },
        { term: 'Stakeholdermap', def: 'Alle betrokkenen op invloed en belang gezet, om per persoon te bepalen hoe je ze betrekt.' },
        { term: 'Blokkeerder', def: 'Iemand die het project kan vertragen of stoppen, vaak zonder nee te zeggen.' },
        { term: 'Escalatie', def: 'Een vastgelopen besluit voorleggen aan iemand hoger die het kan nemen, open en als laatste stap.' },
      ],
    },
    {
      id: 'pm.intake.done',
      title: 'Wanneer is het af',
      pre: [
        {
          q: 'Welke van deze is een bruikbaar projectdoel?',
          options: ['Het planningsproces verbeteren', 'De lijn efficiënter maken', 'De gemiddelde doorlooptijd (weken van aanvraag tot werkende aansluiting) van kleinzakelijke aansluitingen voor juni terugbrengen van 18 naar 12 weken', 'Een nieuwe planningstool implementeren'],
          answer: 'De gemiddelde doorlooptijd (weken van aanvraag tot werkende aansluiting) van kleinzakelijke aansluitingen voor juni terugbrengen van 18 naar 12 weken',
          why: 'Alleen deze heeft een startwaarde, een target en een datum die iemand kan controleren.',
        },
      ],
      teach: [
        'Schrijf een doel in één zin: van X naar Y voor wanneer, gemeten hoe. “Ongeplande stilstand op lijn 3 terugbrengen van 14 naar 8 uur per week voor 1 april, gemeten in het stoplog van het MES.” (MES: manufacturing execution system, de software op de vloer die elke stilstand vastlegt.)\n\nKrijg je die zin niet op papier, dan heb je nog geen project maar een wens. Schrijf hem samen met de klant, in hun woorden, en lees hem hardop terug.',
        'Eerst een nulmeting: de gemeten beginwaarde waar je later tegen vergelijkt. Zonder die meting kan niemand zeggen dat het gelukt is, en wordt elk resultaat betwist.\n\nIs de data er niet, dan is twee weken meten je eerste deliverable (iets wat je oplevert en wat te controleren is). Zeg het gewoon: “Ik weet het huidige getal nog niet, en eerlijk gezegd jij ook niet. Laten we eerst meten.” Twee weken vangt een normaal weekpatroon; een seizoensbedrijf heeft soms langer nodig.',
        'Scope is wat het project omvat. Schrijf op wat erbinnen en wat buiten scope valt. Buiten is belangrijker: “Alleen lijn 3, niet lijn 1 en 2. Proces en planning, geen nieuw ERP-systeem (de bedrijfsbrede software voor orders, voorraad en financiën). Niet aan de ploegendiensten komen.”\n\nZet erbij wat mensen waarschijnlijk gaan inbrengen. Komt het later op tafel, dan wijs je naar de lijst in plaats van de discussie opnieuw te voeren.',
        'Scope creep is het langzaam uitdijen van een project, één redelijk verzoek tegelijk: “als je toch bezig bent, kun je ook even naar lijn 2 kijken?” Elk verzoek klinkt klein; samen vreten ze je weken op.\n\nZeg niet alleen nee. Zeg: “Goed idee. Het valt nu buiten de scope, dus of we ruilen het ergens voor, of de sponsor geeft er tijd bij.” Scherpe vraag als iemand werk toevoegt: “Wat laten we vallen om ruimte te maken?”',
        'Acceptatiecriteria: wie tekent af, op basis van welk bewijs, en wanneer. “De plantmanager accepteert als het gemiddelde over vier weken achter elkaar 8 uur of minder is.” Vier weken beschermt tegen één toevallig goede week.\n\nSpreek dit aan het begin af. Aan het eind is de sfeer anders en herinnert iedereen zich de belofte anders. Over stretch targets verschillen experts: een ambitieus getal motiveert sommige teams, maar een target waar niemand in gelooft, wordt stilletjes genegeerd.',
      ],
      example: {
        kind: 'worked',
        text: 'Een voedingsmiddelenfabriek vraagt je “de verspilling terug te dringen”. Je meet eerst: 3,2% van de output gaat naar afkeur (scrap), zo’n 2.400 kg per week van de 75.000 kg, vooral bij het opstarten na omstellingen. Doelzin: “Afkeur op de twee afvullijnen terugbrengen van 3,2% naar 2,0% voor eind Q2 (april tot en met juni), gemeten in de wekelijkse afkeurrapportage.”\n\nIn scope: opstarten na omstellen, machine-instellingen, werkinstructies. Buiten scope: de verpakkingsleverancier en de recepturen. Acceptatie: de productiemanager tekent af na vier weken achter elkaar op 2,0% of lager.\n\nDat scheelt 900 kg per week.',
      },
      said: 'Wat je hoort in projecten: “Laten we ons nog niet vastpinnen op een getal.” Soms is dat terechte voorzichtigheid; vaak is het een manier om nooit gemeten te worden.',
      recall: [
        {
          q: 'Wat maakt een doelzin het sterkst?',
          options: ['Een nulmeting, een target en een datum, plus hoe het gemeten wordt', 'Een ambitieus target dat het team motiveert', 'Een lijst met de activiteiten die je gaat doen', 'De oplossing waar de klant om vroeg'],
          answer: 'Een nulmeting, een target en een datum, plus hoe het gemeten wordt',
          why: 'Van X naar Y voor wanneer, gemeten hoe: iedereen kan het controleren.',
        },
        {
          q: 'Waarom schrijf je op wat buiten scope valt?',
          options: ['Om je tarief te verlagen', 'Omdat het contract het vereist', 'Zodat je ernaar kunt wijzen als mensen het project willen oprekken', 'Om stakeholders op afstand te houden'],
          answer: 'Zodat je ernaar kunt wijzen als mensen het project willen oprekken',
          why: 'Een afgesproken lijst maakt sneller een eind aan de discussie dan welles-nietes.',
        },
        {
          q: 'De afkeur is 3,2% van een weekoutput van 75.000 kg. Het doel is 2,0% van diezelfde weekoutput. Hoeveel kg afkeur per week scheelt het als je het doel haalt?',
          number: 900,
          tolerance: 10,
          unit: 'kg',
          why: '3,2% van 75.000 is 2.400 kg; 2,0% is 1.500 kg; het verschil is 900 kg.',
        },
        {
          q: 'Er is geen data over de huidige situatie. Wat doe je?',
          options: ['De schatting van de klant als nulmeting gebruiken', 'De nulmeting overslaan en op het target focussen', 'Een benchmark (een cijfer van een ander bedrijf) van een andere fabriek lenen', 'Een korte meetperiode je eerste deliverable maken'],
          answer: 'Een korte meetperiode je eerste deliverable maken',
          why: 'Een gemeten nulmeting is de enige die aan het eind niemand kan betwisten.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. De sponsor wil als projectdoel “betere samenwerking tussen planning en de buitendienst”, de ploegen die het werk op locatie doen.',
        ask: 'Hoe maak je dit meetbaar zonder de sponsor kwijt te raken?',
        model: '“Mooi doel, en ik wil dat we straks kunnen laten zien dat het gewerkt heeft. Als de samenwerking beter is, wat zie je dan gebeuren? Minder klussen die op de dag zelf omgepland worden? Ploegen die met het juiste materiaal aankomen?” Kies er samen één, bijvoorbeeld “Klussen die op de dag zelf worden omgepland terugbrengen van 22% naar 10% voor Q3, uit het planningssysteem”, en houd samenwerking als het waarom.',
        rubric: [
          'Houdt de bedoeling van de sponsor vast en vraagt wat hij zou zien',
          'Maakt er van, naar, voor wanneer van, met een databron',
          'Spreekt af wie aftekent en op basis van welk bewijs',
        ],
        pushback: {
          lines: [
            '“Jullie consultants willen altijd een getal. Samenwerking is geen getal. Iedereen snapt wat ik bedoel.”',
            '“Als we er een hard doel in zetten, voelen de teams zich afgerekend. Dat wil ik niet.”',
          ],
          model: '“Eens, samenwerking zelf is geen getal. Maar je merkt het ergens aan: minder klussen die terugkomen, minder ritten voor niks. Als we daar één van kiezen, kunnen we de directie laten zien dat het werkt. We meten het proces, niet de mensen. Zal ik vrijdag twee opties meenemen?”',
          rubric: [
            'Erkent dat samenwerking op zich geen getal is',
            'Houdt vast aan één waarneembare maat voor klaar',
            'Stelt concrete opties en een keuzemoment voor',
          ],
        },
      },
      sayIt: 'Leg een sponsor in 60 seconden uit waarom je eerst een nulmeting wilt voordat je je aan een target vastlegt.',
      terms: [
        { term: 'Nulmeting', def: 'De gemeten beginwaarde waartegen je de voortgang afzet.' },
        { term: 'Scope', def: 'Wat het project omvat en, net zo belangrijk, wat er expliciet niet onder valt.' },
        { term: 'Buiten scope', def: 'De opgeschreven lijst van wat het project niet doet, om naar te wijzen als het opkomt.' },
        { term: 'Scope creep', def: 'Het langzaam uitdijen van een project door kleine extra verzoeken, zonder extra tijd of geld.' },
        { term: 'Acceptatiecriteria', def: 'Wie aftekent, op basis van welk bewijs, en wanneer het resultaat als af geldt.' },
      ],
    },
    {
      id: 'pm.intake.start',
      title: 'De eerste weken',
      pre: [
        {
          q: 'Wat bouwt in de eerste weken het meeste vertrouwen op bij de mensen op de vloer?',
          options: ['Een heldere presentatie van het projectplan', 'Snel één kleine ergernis oplossen die zij zelf noemden', 'Een kick-off (officiële startbijeenkomst) door de plantmanager', 'Benchmarkdata (cijfers van andere bedrijven) van andere fabrieken delen'],
          answer: 'Snel één kleine ergernis oplossen die zij zelf noemden',
          why: 'Het bewijst dat je luistert en dat praten met jou iets oplevert.',
        },
      ],
      teach: [
        'Quick wins en fundament, tegelijk. Een quick win is een kleine, zichtbare verbetering die van de mensen zelf komt: een ontbrekend gereedschap, een printer die elke dienst vastloopt. Het fundament is het langzamere grondwerk: nulmeting (baseline), duidelijke rollen, een vast overlegritme.\n\nAlleen quick wins wordt een show. Alleen fundament, en mensen zien zes weken niks en haken af. Grove verhouding: één of twee quick wins in elk van de eerste vier weken.',
        'De kick-off is het overleg waarmee het project officieel start: doel, scope, rollen, eerste stappen. Houd hem kort, zo’n uur, en laat de sponsor in zijn eigen woorden zeggen waarom het ertoe doet.\n\nVertrouwen komt daarna, van doen wat je zegt. Schrijf elke toezegging op, hoe klein ook (“ik check dat even bij IT”), en kom er binnen een week op terug, ook als het antwoord “nee, en dit is waarom” is.',
        'Zit de eerste twee weken vooral op de vloer of bij de ploegen, niet in de vergaderzaal. Vraag voordat je iets voorstelt. Sta aan de lijn tijdens een omstelling; rij een dag mee met een ploeg monteurs.\n\nWat je daar ziet, verslaat elk rapport: de operator die 40 meter loopt voor een stuk gereedschap, de planner die drie mensen belt voor één antwoord. Schrijf tijden en aantallen op, niet alleen indrukken.',
        'Zet het overlegritme vroeg neer: vaste overleggen met een vaste agenda. Een wekelijkse check van 30 minuten met de proceseigenaar, een korte stand-up met het team (een kwartier, staand: wat is af, wat zit vast), en een maandelijkse stuurgroep: het overleg waar de sponsor de voortgang checkt en besluiten neemt.\n\nVaste dag, vaste tijd, vaste agenda: voortgang op het doel, wat zit vast, welke besluiten zijn nodig. Zo zie je problemen in week drie, niet in maand vier.',
        'Weerstand in week 1 tot 4 klinkt als “dit hebben we in 2019 ook geprobeerd” of “jij kent ons proces niet”. Allebei vaak waar.\n\nAntwoord: “Klopt, ik ken het niet zoals jij. Wat ging er in 2019 mis?” Die geschiedenis vertelt je wat je moet vermijden.\n\nEen bekende valkuil: de consultant jaagt zoveel quick wins na dat de nulmeting nooit gemeten wordt. Scherpe check in week 4: “Weten we het startgetal al?”',
      ],
      example: {
        kind: 'worked',
        text: 'Week 1 bij een pompenassemblage. Je staat twee dagen aan de lijn en zit één dag bij de planning.\n\nOperators vertellen dat de momentsleutel (een sleutel die bouten met een precieze kracht aandraait) in de middagdienst ontbreekt, wat zo’n 20 minuten per dienst kost. Je kaart het aan bij de teamleider; woensdag ligt er een tweede sleutel van 400 euro. Ondertussen start je een stoplog van twee weken als nulmeting en spreek je dinsdag 9:00 af als wekelijkse check met de productiemanager.\n\nIn week 3 komen operators uit zichzelf met problemen naar je toe. Dan weet je dat het vertrouwen er is.',
      },
      said: 'Wat je hoort in projecten: “Leuk dat je er bent. Eens kijken of je er over drie maanden nog bent.”',
      recall: [
        {
          q: 'Waarom doe je quick wins en fundament tegelijk?',
          options: ['Quick wins zijn goedkoper', 'Het fundament kan wachten tot er resultaat is', 'Quick wins houden mensen betrokken, het fundament zorgt dat het resultaat blijft', 'De sponsor vraagt altijd om allebei'],
          answer: 'Quick wins houden mensen betrokken, het fundament zorgt dat het resultaat blijft',
          why: 'Eén van de twee alleen faalt: een show zonder basis, of een basis die niemand ziet.',
        },
        {
          q: 'Een operator zegt: “Dit hebben we in 2019 ook geprobeerd en het mislukte.” Wat is het beste antwoord?',
          options: ['“Deze keer is het anders.”', '“Dat was voor mijn tijd.”', '“Laten we naar de toekomst kijken.”', '“Wat ging er in 2019 mis?”'],
          answer: '“Wat ging er in 2019 mis?”',
          why: 'Hun geschiedenis laat zien wat je moet vermijden, en vragen toont respect.',
        },
        {
          q: 'Een ontbrekend gereedschap kost 20 minuten per dag, in maar één dienst, 5 dagen per week, 46 werkweken per jaar. Hoeveel uur per jaar is dat?',
          number: 76.7,
          tolerance: 1,
          unit: 'uur',
          why: '20 × 5 × 46 = 4.600 minuten; 4.600 / 60 is ongeveer 76,7 uur.',
        },
        {
          q: 'Wat maakt een wekelijkse check nuttig?',
          options: ['Vaste tijd en agenda: voortgang, wat zit vast, welke besluiten nodig', 'Zoveel mogelijk mensen uitnodigen', 'Elke week een nieuw slidedeck', 'Alleen overleggen als er een probleem is'],
          answer: 'Vaste tijd en agenda: voortgang, wat zit vast, welke besluiten nodig',
          why: 'Voorspelbaar en kort betekent dat mensen komen en problemen vroeg bovenkomen.',
        },
      ],
      situation: {
        scene: 'Je zit in week 2 op een regionale vestiging van een netbeheerder. De monteurs zijn vriendelijk maar zeggen weinig. Een senior monteur zegt, bijna terloops, dat de voorraadlijst van de bus (de vaste set onderdelen die elke bus hoort mee te hebben) al een jaar niet is bijgewerkt, dus ze rijden vaak terug naar het magazijn.',
        ask: 'Wat doe je hiermee?',
        model: 'Zie het als quick win én als datapunt. “Hoe vaak gebeurt dat per week? Wie zou die lijst kunnen bijwerken?” Zorg dan dat het binnen een paar dagen geregeld is, geef hem er openlijk de credits voor, en noteer de extra ritten als mogelijke meting voor het hoofddoel.',
        rubric: [
          'Vraagt door om het concreet te maken: hoe vaak, wie kan het oplossen',
          'Zorgt dat het snel geregeld is en geeft de monteur de credits',
          'Koppelt het terug aan de nulmeting of het hoofddoel',
        ],
        pushback: {
          lines: [
            '“De voorraadlijst van de bus? Daar ben je niet voor hier. Hou je bij het planningsproject.”',
            '“En eerlijk, de mannen klagen over alles. Als we elke opmerking najagen, komt er niks af.”',
          ],
          model: '“Klopt, het staat niet in de scope. Maar ritjes terug naar het magazijn kosten geplande uren, en dat is wel mijn project. Ik check het even: ik vraag drie monteurs om deze week hun ritjes naar het magazijn bij te houden. Is het klein, dan laat ik het los. Is het groot, dan beslis jij.”',
          rubric: [
            'Erkent de scope en zijn zorg',
            'Koppelt de opmerking aan het doel van het project zelf',
            'Stelt een kleine, snelle check voor en laat het besluit bij hem',
          ],
        },
      },
      sayIt: 'Leg de proceseigenaar in 60 seconden uit waarom je je eerste twee weken vooral op de vloer doorbrengt.',
      terms: [
        { term: 'Quick win', def: 'Een kleine, zichtbare verbetering die de mensen zelf aandroegen, binnen een paar dagen geregeld.' },
        { term: 'Fundament', def: 'Het langzamere grondwerk: nulmeting, rollen en ritme, zodat resultaten blijven.' },
        { term: 'Kick-off', def: 'Het overleg waarmee het project officieel start: doel, scope, rollen en eerste stappen.' },
        { term: 'Stuurgroep', def: 'Het vaste overleg, vaak maandelijks, waar de sponsor de voortgang checkt en besluiten neemt.' },
        { term: 'Overlegritme', def: 'Vaste overleggen met een vaste agenda, wekelijks met de eigenaar en maandelijks met de sponsor.' },
      ],
    },
    {
      id: 'pm.intake.no',
      title: 'Nee zeggen of ombouwen',
      pre: [
        {
          q: 'Een klant wil een project, maar niemand aan hun kant heeft tijd om mee te doen. Wat is de meest waarschijnlijke uitkomst?',
          options: ['Een rapport en geen blijvende verandering', 'De consultant levert sneller, zonder afleiding', 'Het project kost minder', 'De sponsor maakt mensen vrij zodra er resultaat is'],
          answer: 'Een rapport en geen blijvende verandering',
          why: 'Verandering die hun eigen mensen niet maakten, vertrekt samen met de consultant.',
        },
      ],
      teach: [
        'Een rode vlag is een signaal bij de intake dat het project zoals het nu staat waarschijnlijk mislukt. De bekende: geen sponsor die kan beslissen; de oplossing staat al vast en jij mag alleen tekenen; geen tijd van hun mensen; een doel dat niemand kan meten; een deadline die vaststond voordat iemand het probleem kende.\n\nEén vlag is normaal. Drie betekent dat het project waarschijnlijk mislukt, met jouw naam erop.',
        'De lastigste vlag is een verborgen agenda: de echte reden voor het project is een andere dan die jij hoort. “We hebben dit nodig om een reorganisatie te onderbouwen” wordt zelden hardop gezegd.\n\nSignalen: de conclusie lijkt al vast te staan voor de analyse, mensen ontwijken de vraag “wat gaan jullie met de uitkomst doen?”, of sommige afdelingen worden niet geïnterviewd. Vraag het direct en vriendelijk: “Welk besluit helpt dit je nemen?”',
        'Bouw om voordat je weigert. In de meeste slechte projecten zit een goed project. Herscopen is een project ombouwen naar een kleiner of ander project dat wel kan slagen.\n\nBied een scherpere versie aan: “In plaats van alle vier de lijnen in drie maanden, doen we lijn 2 in zes weken, met per ploeg twee operators die vier uur per week vrij zijn. Werkt het, dan schalen we op.” Kleinere scope, echte commitment, eerst bewijs.',
        'Zo geef je tegengas: begin bij hun doel, benoem het risico, bied dan een optie. “Jullie willen voor de zomer kortere doorlooptijden. Zonder iemand van planning erbij verwacht ik dat we een rapport opleveren, geen kortere doorlooptijden. Dat is jullie geld niet waard. Wat ik wel voorstel is…”\n\nZeg nooit “dat kan niet” zonder alternatief. Of een junior ooit alleen mag weigeren, daarover verschillen experts; de meeste bureaus willen er een partner of manager bij.',
        'Houdt de klant toch vast aan het plan, leg dan de voorwaarden op papier en spreek een checkpoint af: een vast moment om te beslissen of je doorgaat, stopt of herscoopt. “Zijn de planners er in week 4 niet bij, dan stoppen we of passen we de scope aan.”\n\nTwijfel je, betrek dan je eigen manager voordat je toezegt. Goed nee zeggen vergroot vaak je geloofwaardigheid; klanten onthouden wie eerlijk was. Scherpe vraag aan jezelf: “Zou ik mijn eigen geld erop zetten dat dit werkt?”',
      ],
      example: {
        kind: 'worked',
        text: 'Een machinebouwer vraagt je “de doorlooptijden (lead times, de weken van order tot levering) in de hele fabriek in drie maanden te halveren”. Er is geen tijd begroot voor hun mensen, en de directeur is de helft van die periode weg. Rode vlaggen: geen sponsor aanwezig, geen tijd, onrealistische scope.\n\nJe stelt voor: één productfamilie (een groep vergelijkbare producten die op dezelfde manier gemaakt worden, hier 35% van het volume), acht weken, een vervangend sponsor met naam, en 4 uur per week van de planner en één teamleider. Target: doorlooptijd van die familie van 6 naar 4 weken. De directeur gaat akkoord, en het resultaat wordt de business case voor de rest van de fabriek.',
      },
      said: 'Wat je hoort in projecten: “Kun je het niet gewoon in een rapport zetten? Dan kunnen we verder.”',
      recall: [
        {
          q: 'Wat is de sterkste rode vlag bij een intake?',
          options: ['De klant staat sceptisch tegenover consultants', 'Niemand aan klantzijde kan beslissen of mensen vrijmaken', 'De data staat in Excel', 'De deadline ligt over zes maanden'],
          answer: 'Niemand aan klantzijde kan beslissen of mensen vrijmaken',
          why: 'Zonder beslisser en zonder tijd van mensen wordt niks van wat je vindt ingevoerd.',
        },
        {
          q: 'Wat is je eerste zet bij een project dat volgens jou gedoemd is te mislukken?',
          options: ['Een kleinere, scherpere versie aanbieden met echte commitment', 'Netjes weigeren', 'Akkoord gaan en je eigen verwachtingen bijstellen', 'Escaleren naar hun directie'],
          answer: 'Een kleinere, scherpere versie aanbieden met echte commitment',
          why: 'In de meeste slechte projecten zit een goed project; ombouwen houdt de klant én het resultaat.',
        },
        {
          q: 'Welk tegengas werkt het best?',
          options: ['“Dat kan niet.”', '“Onze methode staat dat niet toe.”', '“We doen ons best, maar we beloven niks.”', '“Jullie willen X. Zonder Y verwacht ik een rapport, geen X. Wat ik wel voorstel is…”'],
          answer: '“Jullie willen X. Zonder Y verwacht ik een rapport, geen X. Wat ik wel voorstel is…”',
          why: 'Begin bij hun doel, benoem het risico, bied een optie.',
        },
        {
          q: 'De klant houdt vast aan het oorspronkelijke plan. Wat beschermt jullie allebei?',
          options: ['Meer consultants inzetten', 'Het tarief verlagen', 'Voorwaarden op papier en een checkpoint om te stoppen of de scope aan te passen', 'Beginnen en hopen dat het beter wordt'],
          answer: 'Voorwaarden op papier en een checkpoint om te stoppen of de scope aan te passen',
          why: 'Zo wordt een vage zorg een moment waarop beide kanten opnieuw beslissen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. Een manager vraagt je te “bewijzen” dat de buitendienst de vertraging veroorzaakt, vlak voor een reorganisatie (een wijziging van afdelingen, rollen of functies) die al besloten lijkt.',
        ask: 'Hoe reageer je?',
        model: '“Ik snap dat je een helder beeld nodig hebt voor de reorganisatie. Ik kan alleen niet bij de conclusie beginnen: de buitendienst ziet dat meteen, en dan wordt niks van wat ik vind nog geloofd. Wat ik wel kan doen is in vier weken in kaart brengen waar de vertraging echt vandaan komt, over planning, materiaal en buitendienst heen. Ligt het aan de buitendienst, dan laat de data dat zien.”',
        rubric: [
          'Benoemt de verborgen agenda zonder iemand te beschuldigen',
          'Legt het risico uit in het belang van de klant zelf: een uitkomst die niemand gelooft',
          'Biedt een omgebouwd, neutraal alternatief met een termijn',
        ],
        pushback: {
          lines: [
            '“Het ligt duidelijk aan de buitendienst. Ik heb alleen de cijfers nodig om het te laten zien. Daar betalen we je voor.”',
            '“Als jij het niet doet, vind ik wel een bureau dat het wel doet. Denk even na wat dat betekent voor jullie.”',
          ],
          model: '“Ik snap dat je een stevige basis nodig hebt voor het besluit. Ik kan je de echte oorzaken van de vertraging geven, met cijfers, en als de buitendienst daar een groot deel van is, zie je dat terug. Wat ik niet kan, is beginnen bij het antwoord. Dat beschermt jou ook, als iemand het later natrekt.”',
          rubric: [
            'Erkent de behoefte achter het verzoek',
            'Blijft erbij niet vanuit een vaste conclusie te beginnen',
            'Biedt een concreet alternatief dat hem toch helpt',
          ],
        },
      },
      sayIt: 'Leg je eigen manager in 60 seconden uit waarom je een project wilt ombouwen dat de klant al wil tekenen.',
      terms: [
        { term: 'Rode vlag', def: 'Een signaal bij de intake dat het project zoals het nu staat waarschijnlijk mislukt.' },
        { term: 'Verborgen agenda', def: 'Een echte reden voor het project die anders is dan de reden die jij hoort.' },
        { term: 'Herscopen', def: 'Het project ombouwen naar een kleinere of andere scope die wel kan slagen.' },
        { term: 'Checkpoint', def: 'Een afgesproken moment om te beslissen: doorgaan, stoppen of de scope aanpassen.' },
      ],
    },
  ],
};

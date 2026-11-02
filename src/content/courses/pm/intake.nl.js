// pm.intake (Nederlands): intake, van de vraag van de klant naar een project dat het waard is.
export default {
  lessons: [
    {
      id: 'pm.intake.ask',
      title: 'Wat ze vragen, wat ze nodig hebben',
      pre: [
        {
          q: 'Een plantmanager begint met: “We hebben een nieuwe planningstool nodig.” Wat is dat waarschijnlijk?',
          options: ['Het probleem dat opgelost moet worden', 'Een oplossing die ze al gekozen hebben', 'Het doel van het project', 'Een scopegrens'],
          answer: 'Een oplossing die ze al gekozen hebben',
          why: 'Klanten komen meestal binnen met een oplossing; jij zoekt het probleem dat die moet oplossen.',
        },
      ],
      teach: [
        'Klanten komen zelden met een probleem. Ze komen met een oplossing (“we willen een dashboard”) of een symptoom (“orders zijn te laat”). Haal drie lagen uit elkaar. Het symptoom is wat ze zien. Het probleem is wat dat veroorzaakt. Het doel is wat er anders moet zijn als het opgelost is. Een project op het symptoom lost niks op; een project op hun gekozen oplossing lost misschien het verkeerde op.',
        'Vragen die eronder komen: “Waaraan merk je het?”, “Sinds wanneer?”, “Wat kost het je per week?”, “Wat hebben jullie al geprobeerd?”, “Wat gebeurt er als er een jaar niks verandert?” Vraag naar één recent, concreet geval in plaats van het algemene beeld: “Neem me eens mee in die late order van vorige week dinsdag.” Een concreet geval laat het echte mechanisme zien; het algemene beeld laat hun mening zien.',
        'De mensenkant: wie de vraag stelt, heeft vaak zijn naam verbonden aan die oplossing. Ga er niet tegenin. Zeg: “Zo’n planningstool kan best onderdeel van de oplossing zijn. Om zeker te weten dat hij iets oplevert: mag ik eerst zien waar de vertraging vandaan komt?” Weerstand klinkt als “dat hebben we al geanalyseerd”. Antwoord: “Mooi, dan gaat het snel. Kun je het me laten zien?”',
        'Weet je de techniek nog niet, zeg dat dan en gebruik het: “Ik ken jullie proces nog niet, dus ik ga wat naïeve vragen stellen.” Klanten hebben meer respect voor een consultant die scherpe vragen stelt dan voor een die doet alsof hij het weet. Schrijf hun woorden letterlijk op. Die gebruik je later in de doelzin, en ze herkennen zich erin.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder vraagt een teamleider om “een beter dashboard voor de werkorders”. Je vraagt wat hij ermee zou doen. “Zien welke klussen vastlopen.” Waar lopen ze vast? “Op vergunningen en materiaal.” Hoeveel? Hij kijkt: 140 van de 600 openstaande orders wachten al langer dan 4 weken, 90 daarvan op materiaal. Symptoom: orders lopen vast. Probleem: materiaalreserveringen zijn niet gekoppeld aan de planning. Doel: geen order wacht langer dan 4 weken op materiaal. Het dashboard wordt een klein onderdeel, niet het project.',
      },
      said: 'Wat je hoort in projecten: “We hebben geen onderzoek nodig, we hebben iemand nodig die gewoon die tool bouwt.”',
      recall: [
        {
          q: '“Onze orders gaan te laat de deur uit” is vooral…',
          options: ['het doel', 'het probleem', 'het symptoom', 'de scope'],
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
          options: ['Om je tarief te bepalen', 'Om de omvang van het probleem te bepalen, zodat je het tegen de inspanning kunt afwegen', 'Om uit te zoeken wiens schuld het is', 'Omdat elke sponsor een business case wil'],
          answer: 'Om de omvang van het probleem te bepalen, zodat je het tegen de inspanning kunt afwegen',
          why: 'Een probleem zonder omvang kun je niet prioriteren en niet afwegen tegen een project.',
        },
      ],
      situation: {
        scene: 'Je zit bij een metaalstansbedrijf. De operations manager begint met: “Onze OEE is 58%, we willen binnen een half jaar naar 75%.” (OEE: het deel van de geplande tijd dat de persen goede producten maken.) “Kun je daar een verbeterteam op zetten?”',
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
      ],
    },
    {
      id: 'pm.intake.firsttalk',
      title: 'Het eerste gesprek',
      pre: [
        {
          q: 'Hoeveel van de tijd zou de klant aan het woord moeten zijn in een intake van een uur?',
          options: ['Ongeveer de helft', 'Ongeveer een kwart', 'Hangt af van zijn senioriteit', 'Ongeveer driekwart'],
          answer: 'Ongeveer driekwart',
          why: 'Je leert door te luisteren; mik op 70 tot 80% spreektijd voor de klant.',
        },
      ],
      teach: [
        'Een simpele opbouw. Openen (5 minuten): waarom je er zit en waarmee je weg wilt. Verkennen (35): hun verhaal, het probleem, de mensen. Checken (10): samenvatten, vragen wat er mist. Afsluiten (10): volgende stap met een datum. Benoem die opbouw aan het begin: “Ik wil vandaag vooral luisteren en eindigen met een concrete volgende stap. Is dat goed?” Dat geeft rust.',
        'Gebruik MORE PIES als luisterchecklist. Mood: lees de sfeer. Open vragen. Reflecteren op gevoel: “Dat klinkt frustrerend.” Empathie. Parafraseren: “Dus het grootste probleem is…”. Inquiry: doorvragen op één ding. Experience: deel kort je eigen ervaring, alleen om vertrouwen te bouwen. Silence: wacht drie tellen na een antwoord. De belangrijkste zin komt vaak net na de stilte.',
        'Weerstand in een eerste gesprek is meestal stil: korte antwoorden, “het staat allemaal in het rapport”, een telefoon open op tafel. Benoem het luchtig: “Ik krijg de indruk dat hier al eerder naar gekeken is. Hoe ging dat toen?” Vaak heeft een vorige consultant een mooi slidedeck achtergelaten en is er niks veranderd. Laat ze dat verhaal vertellen; dan weet je wat je niet moet herhalen.',
        'Ga weg met vijf dingen: het probleem in hun woorden, drie namen van mensen om te spreken, welke data je mag zien, wat succes is voor de sponsor (de manager die betaalt en beslist), en een datum voor de volgende stap. Stuur binnen 24 uur een samenvatting van één A4. Wat je nog niet weet, zet je daarin als open vraag, niet als aanname.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een zuivelfabriek spreek je de productiemanager een uur. Minuut 0 tot 5: je zegt wat je doel is. 5 tot 40: ze vertelt over een afvullijn met 6 omstellingen per dag van 50 minuten. Je parafraseert: “Dus er gaan vijf uur per dag naar omstellen, en dat houdt het extra volume tegen?” Ze corrigeert je: “Nee, het reinigen is het grotere probleem.” Die correctie is goud waard. 40 tot 50: je vat samen. 50 tot 60: je spreekt af donderdag de lijn op te gaan en twee ploegleiders te spreken. De samenvatting gaat dezelfde avond de deur uit.',
      },
      said: 'Wat je hoort in projecten: “We hebben hier eerder consultants gehad. Mooie slides, er veranderde niks.”',
      recall: [
        {
          q: 'Waarom parafraseer je het verhaal van de klant?',
          options: ['Om te laten zien dat je aantekeningen maakt', 'Zodat hij je kan corrigeren en je hoort wat er echt toe doet', 'Om het gesprek te versnellen', 'Om hem richting jouw oplossing te sturen'],
          answer: 'Zodat hij je kan corrigeren en je hoort wat er echt toe doet',
          why: 'Correcties laten zien waar jouw beeld afwijkt van het zijne.',
        },
        {
          q: 'De klant geeft korte antwoorden en zegt “het staat allemaal in het rapport”. Wat doe je?',
          options: ['Samen het rapport pagina voor pagina doorlopen', 'Overstappen op gesloten vragen om de feiten te krijgen', 'Het gesprek eerder afronden en opnieuw plannen', 'Het luchtig benoemen en vragen hoe het de vorige keer ging'],
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
        scene: 'Je zit in een eerste gesprek met de assetmanager van een netbeheerder over vertraging bij het vervangen van MS-stations. Na een kwartier zegt hij: “Eerlijk gezegd denk ik dat de planners het gewoon niet goed genoeg doen.”',
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
        'Vier rollen. Sponsor: eigenaar van budget en resultaat, en kan beslissen. Eigenaar: de manager die het proces runt en met de verandering moet leven. Gebruikers: de operators, planners of monteurs van wie het dagelijkse werk verandert. Blokkeerders: iedereen wiens belang, macht of tijd geraakt wordt, vaak IT, de OR of een ploegleider met twintig dienstjaren. Eén persoon kan twee rollen hebben.',
        'Een snelle map: twee assen, invloed (kunnen ze het stoppen of versnellen?) en belang (verandert hun werk?). Hoog op allebei: wekelijks betrekken. Veel invloed, weinig belang: tevreden houden, met korte updates in hun taal. Weinig invloed, veel belang: goed informeren en laten meedoen, zij kennen de details. Teken hem na de intake in een kwartier op papier en werk hem elke maand bij.',
        'Vraag het gewoon: “Wie beslist of dit doorgaat?”, “Wie kan het tegenhouden, ook zonder het hardop te zeggen?” en “Wie heeft zo’n project al eens meegemaakt?” Op de tweede vraag krijg je vaak een lachje en een naam. Schrijf die naam op. Met die persoon zit je deze week nog één op één.',
        'Weerstand klinkt zelden als “nee”. Het ziet eruit als gemiste afspraken, mensen die niet vrijgemaakt worden, of “interessant, laten we het in het MT bespreken” (het managementteam). Escaleer niet als eerste stap. Ga erheen en vraag: “Hoe zou dit eruit moeten zien om voor jouw team te werken?” Escaleer pas naar de sponsor als een besluit echt vastzit, en zeg het de persoon vooraf.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een netbeheerder: een project om de doorlooptijd van aansluitingen voor kleinzakelijke klanten te verkorten. Sponsor: directeur klantaansluitingen. Eigenaar: hoofd werkvoorbereiding. Gebruikers: 12 werkvoorbereiders en 40 monteurs. Invloedrijk en stil: de IT-eigenaar van het planningssysteem en de regionale teamleiders die de ploegen indelen. Op je map staan de teamleiders hoog op invloed en belang, maar niemand heeft ze uitgenodigd. Je plant in week één drie één-op-ééntjes. Eén teamleider vertelt dat ploegen 30% van de tijd naar storingen worden gehaald. Dat wordt cruciale data.',
      },
      said: 'Wat je hoort in projecten: “Interessant, laten we het op de MT-agenda zetten.”',
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
          options: ['Zo komen verborgen blokkeerders boven die je vroeg moet spreken', 'Zo laat je de sponsor zien dat je kritisch bent', 'Het helpt bij het vaststellen van het budget', 'Het is een standaardvraag uit het risicoregister'],
          answer: 'Zo komen verborgen blokkeerders boven die je vroeg moet spreken',
          why: 'Wie je kan laten stranden, staat zelden op de organogramslide.',
        },
      ],
      situation: {
        scene: 'Je zit twee weken in een omstelproject bij een verpakkingsfabriek. De sponsor, de plantmanager, is enthousiast. De manager TD is bij beide stuurgroepen (het maandelijkse overleg met de sponsor) niet komen opdagen en zijn monteurs hebben het “te druk” voor de pilot.',
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
      sayIt: 'Leg de projectleider van de klant in 60 seconden uit waarom je de teamleiders wilt spreken vóór de kick-off.',
      terms: [
        { term: 'Sponsor', def: 'Eigenaar van budget en resultaat, en kan besluiten nemen.' },
        { term: 'Proceseigenaar', def: 'De manager die het proces dagelijks runt en met de verandering moet leven.' },
        { term: 'Stakeholdermap', def: 'Alle betrokkenen op invloed en belang gezet, om per persoon te bepalen hoe je ze betrekt.' },
        { term: 'Blokkeerder', def: 'Iemand die het project kan vertragen of stoppen, vaak zonder nee te zeggen.' },
      ],
    },
    {
      id: 'pm.intake.done',
      title: 'Wanneer is het af',
      pre: [
        {
          q: 'Welke van deze is een bruikbaar projectdoel?',
          options: ['Het planningsproces verbeteren', 'De lijn efficiënter maken', 'De gemiddelde doorlooptijd van kleinzakelijke aansluitingen voor juni terugbrengen van 18 naar 12 weken', 'Een nieuwe planningstool implementeren'],
          answer: 'De gemiddelde doorlooptijd van kleinzakelijke aansluitingen voor juni terugbrengen van 18 naar 12 weken',
          why: 'Alleen deze heeft een nulmeting, een target en een datum die iemand kan controleren.',
        },
      ],
      teach: [
        'Schrijf een doel in één zin: van X naar Y voor wanneer, gemeten hoe. “Ongeplande stilstand op lijn 3 terugbrengen van 14 naar 8 uur per week voor 1 april, gemeten in het stoplog van het MES.” (MES: het systeem dat elke stilstand vastlegt.) Krijg je die zin niet op papier, dan heb je nog geen project maar een wens. Schrijf hem samen met de klant, in hun woorden, en lees hem hardop terug.',
        'Eerst een nulmeting. Zonder gemeten startpunt kan niemand zeggen dat het gelukt is, en wordt elk resultaat betwist. Is de data er niet, dan is twee weken meten je eerste deliverable. Zeg het gewoon: “Ik weet het huidige getal nog niet, en eerlijk gezegd jij ook niet. Laten we eerst meten voordat we iets beloven.”',
        'Scope in en scope uit. Schrijf ze allebei op. Uit is belangrijker: “Alleen lijn 3, niet lijn 1 en 2. Proces en planning, geen nieuw ERP-systeem. Niet aan de ploegendiensten komen.” Zet erbij wat mensen waarschijnlijk gaan inbrengen. Komt het later op tafel, dan wijs je naar de lijst in plaats van de discussie opnieuw te voeren.',
        'Acceptatiecriteria: wie tekent af, op basis van welk bewijs, en wanneer. “De plantmanager accepteert als het gemiddelde over vier weken achter elkaar 8 uur of minder is.” Spreek dit aan het begin af. Aan het eind is de sfeer anders en herinnert iedereen zich de belofte anders.',
      ],
      example: {
        kind: 'worked',
        text: 'Een voedingsmiddelenfabriek vraagt je “de verspilling terug te dringen”. Je meet eerst: 3,2% van de output gaat naar afkeur, zo’n 2.400 kg per week van de 75.000 kg, vooral bij het opstarten na omstellingen. Doelzin: “Afkeur op de twee afvullijnen terugbrengen van 3,2% naar 2,0% voor eind Q2, gemeten in de wekelijkse afkeurrapportage.” In scope: opstarten na omstellen, machine-instellingen, werkinstructies. Buiten scope: de verpakkingsleverancier en de recepturen. Acceptatie: de productiemanager tekent af na vier weken achter elkaar op 2,0% of lager. Dat scheelt 900 kg per week.',
      },
      said: 'Wat je hoort in projecten: “Laten we ons nog niet vastpinnen op een getal.”',
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
          q: 'De afkeur is 3,2% van een weekoutput van 75.000 kg. Het doel is 2,0%. Hoeveel kg afkeur per week scheelt het als je het doel haalt?',
          number: 900,
          tolerance: 10,
          unit: 'kg',
          why: '3,2% van 75.000 is 2.400 kg; 2,0% is 1.500 kg; het verschil is 900 kg.',
        },
        {
          q: 'Er is geen data over de huidige situatie. Wat doe je?',
          options: ['De schatting van de klant als nulmeting gebruiken', 'De nulmeting overslaan en op het target focussen', 'Een benchmark van een andere fabriek lenen', 'Een korte meetperiode je eerste deliverable maken'],
          answer: 'Een korte meetperiode je eerste deliverable maken',
          why: 'Een gemeten nulmeting is de enige die aan het eind niemand kan betwisten.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. De sponsor wil als projectdoel “betere samenwerking tussen planning en de buitendienst”.',
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
        { term: 'Nulmeting', def: 'De gemeten beginwaarde waartegen je de voortgang afzet (baseline).' },
        { term: 'Scope', def: 'Wat het project omvat en, net zo belangrijk, wat er expliciet niet onder valt.' },
        { term: 'Acceptatiecriteria', def: 'Wie aftekent, op basis van welk bewijs, en wanneer het resultaat als af geldt.' },
      ],
    },
    {
      id: 'pm.intake.start',
      title: 'De eerste weken',
      pre: [
        {
          q: 'Wat bouwt in de eerste weken het meeste vertrouwen op bij de mensen op de vloer?',
          options: ['Een heldere presentatie van het projectplan', 'Snel één kleine ergernis oplossen die zij zelf noemden', 'Een kick-off door de plantmanager', 'Benchmarkdata van andere fabrieken delen'],
          answer: 'Snel één kleine ergernis oplossen die zij zelf noemden',
          why: 'Het bewijst dat je luistert en dat praten met jou iets oplevert.',
        },
      ],
      teach: [
        'Quick wins en fundament, tegelijk. Quick wins zijn kleine, zichtbare verbeteringen die van de mensen zelf komen: een ontbrekend gereedschap, een printer die elke dienst vastloopt. Het fundament gaat langzamer: nulmeting, duidelijke rollen, een vast overlegritme. Alleen quick wins wordt een show. Alleen fundament, en mensen zien zes weken niks en haken af.',
        'Vertrouwen komt van doen wat je zegt. Schrijf elke toezegging op, hoe klein ook (“ik check dat even bij IT”), en kom er binnen een week op terug, ook als het antwoord “nee, en dit is waarom” is. Zit de eerste twee weken vooral op de vloer of bij de ploegen, niet in de vergaderzaal. Vraag voordat je iets voorstelt.',
        'Zet het ritme vroeg neer: een wekelijkse check van 30 minuten met de proceseigenaar, een korte stand-up met het team, en een maandelijkse stuurgroep met de sponsor. Vaste dag, vaste tijd, vaste agenda: voortgang op het doel, wat zit vast, welke besluiten zijn nodig. Met een ritme zie je problemen in week drie, niet in maand vier.',
        'Weerstand in week 1 tot 4 klinkt als “dit hebben we in 2019 ook geprobeerd” of “jij kent ons proces niet”. Allebei vaak waar. Antwoord: “Klopt, ik ken het niet zoals jij. Wat ging er in 2019 mis?” Die geschiedenis vertelt je wat je moet vermijden. Weet je iets niet, zeg dan “ik zoek het uit, donderdag hoor je het”, en doe dat ook.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 1 bij een pompenassemblage. Je staat twee dagen aan de lijn en zit één dag bij de planning. Operators vertellen dat de momentsleutel in de middagdienst ontbreekt, wat zo’n 20 minuten per dienst kost. Je kaart het aan bij de teamleider; woensdag ligt er een tweede sleutel van 400 euro. Ondertussen start je een stoplog van twee weken als nulmeting en spreek je dinsdag 9:00 af als wekelijkse check met de productiemanager. In week 3 komen operators uit zichzelf met problemen naar je toe. Dan weet je dat het vertrouwen er is.',
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
          why: '20 × 5 × 46 = 4.600 minuten, ongeveer 76,7 uur.',
        },
        {
          q: 'Wat maakt een wekelijkse check nuttig?',
          options: ['Vaste tijd en agenda: voortgang, wat zit vast, welke besluiten nodig', 'Zoveel mogelijk mensen uitnodigen', 'Elke week een nieuw slidedeck', 'Alleen overleggen als er een probleem is'],
          answer: 'Vaste tijd en agenda: voortgang, wat zit vast, welke besluiten nodig',
          why: 'Voorspelbaar en kort betekent dat mensen komen en problemen vroeg bovenkomen.',
        },
      ],
      situation: {
        scene: 'Je zit in week 2 op een regionale vestiging van een netbeheerder. De monteurs zijn vriendelijk maar zeggen weinig. Een senior monteur zegt, bijna terloops, dat de voorraadlijst van de bus al een jaar niet is bijgewerkt, dus ze rijden vaak terug naar het magazijn.',
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
        'Rode vlaggen bij de intake: geen sponsor die kan beslissen; de oplossing staat al vast en jij mag alleen tekenen; geen tijd van hun mensen; een doel dat niemand kan meten; een verborgen agenda (“we hebben dit nodig om een reorganisatie te onderbouwen”); een deadline die al vaststond voordat iemand het probleem kende. Eén vlag is normaal. Drie betekent dat het project waarschijnlijk mislukt, met jouw naam erop.',
        'Bouw om voordat je weigert. In de meeste slechte projecten zit een goed project. Bied een kleinere, scherpere versie aan: “In plaats van alle vier de lijnen in drie maanden, doen we lijn 2 in zes weken, met per ploeg twee operators die vier uur per week vrij zijn. Werkt het, dan schalen we op.” Kleinere scope, echte commitment, eerst bewijs.',
        'Zo geef je tegengas: begin bij hun doel, benoem het risico, bied dan een optie. “Jullie willen voor de zomer kortere doorlooptijden. Zonder iemand van planning erbij verwacht ik dat we een rapport opleveren, geen kortere doorlooptijden. Dat is jullie geld niet waard. Wat ik wel voorstel is…” Zeg nooit “dat kan niet” zonder alternatief.',
        'Houdt de klant toch vast aan het plan, leg dan de voorwaarden op papier en spreek een checkpoint af: “Zijn de planners er in week 4 niet bij, dan stoppen we of passen we de scope aan.” Twijfel je of je nee moet zeggen, betrek dan je eigen manager voordat je toezegt. Goed nee zeggen vergroot vaak je geloofwaardigheid; klanten onthouden wie eerlijk was.',
      ],
      example: {
        kind: 'worked',
        text: 'Een machinebouwer vraagt je “de doorlooptijden in de hele fabriek in drie maanden te halveren”. Er is geen tijd begroot voor hun mensen, en de directeur is de helft van die periode weg. Rode vlaggen: geen sponsor aanwezig, geen tijd, onrealistische scope. Je stelt voor: één productfamilie (35% van het volume), acht weken, een vervangend sponsor met naam, en 4 uur per week van de planner en één teamleider. Target: doorlooptijd van die familie van 6 naar 4 weken. De directeur gaat akkoord, en het resultaat wordt de business case voor de rest van de fabriek.',
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
        scene: 'Je zit bij een netbeheerder. Een manager vraagt je te “bewijzen” dat de buitendienst de vertraging veroorzaakt, vlak voor een reorganisatie die al besloten lijkt.',
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
        { term: 'Herscopen', def: 'Het project ombouwen naar een kleinere of andere scope die wel kan slagen.' },
        { term: 'Checkpoint', def: 'Een afgesproken moment om te beslissen: doorgaan, stoppen of de scope aanpassen.' },
      ],
    },
  ],
};

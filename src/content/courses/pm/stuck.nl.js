// pm.stuck (Nederlands): als je vastzit: het probleem benoemen, tijd kopen, hulp vragen, experimenteren, omgaan met druk en een project herstarten.
export default {
  lessons: [
    {
      id: 'pm.stuck.diagnose',
      title: 'Het probleem benoemen',
      pre: [
        {
          q: 'In je project lopen de acties bij iedereen in het team uit, ongeveer evenveel, week na week. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Weerstand tegen de verandering', 'Een onduidelijk doel', 'Mensen hebben de uren niet', 'Een zwakke projectleider'],
          answer: 'Mensen hebben de uren niet',
          why: 'Loopt iedereen gelijkmatig uit, dan is het meestal capaciteit: te weinig uren voor het werk. Weerstand zie je bij sommige mensen, niet bij allemaal.',
        },
      ],
      teach: [
        'Vastgelopen projecten voelen van binnen hetzelfde: er beweegt niks. Maar er zijn vier soorten vastzitten, elk met een eigen oplossing.\n\nOnduidelijk doel: mensen zijn het oneens over wat succes is. Onduidelijke weg: het doel is helder, niemand weet hoe. Mensenprobleem: iemand wiens ja je nodig hebt, geeft hem niet. Capaciteitsprobleem: iedereen is het eens, niemand heeft tijd.',
        'De snelle diagnose, vier vragen.\n\nZouden de sponsor, de manager die eigenaar is van het project, en het team elk hetzelfde doel in één zin opschrijven? Weten we de volgende drie stappen? Is er iemand wiens steun we nodig hebben en niet hebben? Hebben mensen echt de uren in hun week?\n\nHet eerste “nee” is meestal waar je begint.',
        'Symptomen helpen.\n\nOnduidelijk doel: lange discussies over oplossingen, een sponsor die van richting wisselt, elke ontwerpsessie (design workshop) die de vorige weer openbreekt. Onduidelijke weg: analyses die rondjes draaien, wachten op meer data. Mensen: de acties van één persoon lopen uit, stilte in overleggen, “we zien wel”. Capaciteit: iedereen loopt uit, overleggen worden afgezegd, het project leeft in de avonduren.',
        'De oplossingen verschillen. Doel: terug naar de sponsor om te kiezen. Weg: een klein experiment of een expert. Mensen: een één-op-ééngesprek. Capaciteit: een afweging door de sponsor, die besluit wat minder tijd krijgt zodat dit meer krijgt.\n\nDe klassieke fout is een doelprobleem behandelen als een mensenprobleem en harder duwen. Vaak lopen twee soorten door elkaar; begin dan bij de vroegste in de keten: doel, weg, mensen, capaciteit.',
        'Zie het vroeg. Een bruikbaar signaal: je staat al twee weken “op het punt” hetzelfde te doen. Het in week 3 zien in plaats van in week 9 is het vak.\n\nWaar experts over twisten: sommigen zeggen dat bijna elk vastgelopen project eigenlijk een mensenprobleem is; anderen waarschuwen dat je met het woord “weerstand” (resistance) mensen de schuld geeft van een besluit dat niemand nam. Een scherpe vraag: “Welk besluit neemt niemand?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 7 bij een netbeheerder. Je ontwerpt een gereedheidscheck (readiness check) voor geplande klussen: een check dat een klus alles heeft wat hij nodig heeft voordat hij wordt vrijgegeven, aan een monteursploeg overgedragen. Dit is de derde ontwerpsessie.\n\nHet hoofd planning wil een strenge check die elke klus tegenhoudt zonder bevestigd schakelplan (switching plan), het stappenplan om netdelen veilig uit en in te schakelen, en zonder materiaal. Het hoofd uitvoering wil een lichte check, want “streng betekent dat klussen nog later worden vrijgegeven”. De sponsor zei bij de start: “Zorg gewoon dat het werkt.”\n\nHet team raakt moe.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Dit lijkt een ontwerpdiscussie, maar het is een onduidelijk doel. Streng dient “minder afzeggingen”; licht dient “sneller vrijgeven”. Nog een sessie lost het niet op, want ze optimaliseren voor verschillende dingen.\n\nSchrijf één A4 met de twee doelen en wat elk ontwerp doet met afzeggingen en vrijgavetijd, en vraag de sponsor te kiezen, of een doel voor allebei te stellen, bijvoorbeeld: afzeggingen onder de 8% terwijl het vrijgeven hooguit 2 dagen langer duurt. Vertel beide hoofden vooraf dat je dit doet. Ontwerp daarna tegen het gekozen doel.',
      },
      said: 'Wat je hoort in projecten: “We hebben dit nu drie keer besproken. Kunnen we niet gewoon iets kiezen?”',
      recall: [
        {
          q: 'Ontwerpsessies breken steeds het vorige besluit open, en de sponsor wisselt van richting. Welke soort vastzitten is dit waarschijnlijk?',
          options: ['Onduidelijk doel', 'Capaciteit', 'Mensen', 'Onduidelijke weg'],
          answer: 'Onduidelijk doel',
          why: 'Als mensen voor verschillende uitkomsten optimaliseren, gaat elk ontwerp weer open.',
        },
        {
          q: 'Het doel en de volgende stappen zijn helder, maar één belangrijke manager mist steeds zijn acties en zegt niks. Wat is de juiste eerste zet?',
          options: ['Meteen naar de sponsor escaleren', 'Nog een teamsessie houden', 'Een één-op-ééngesprek met hem', 'Het project opnieuw plannen'],
          answer: 'Een één-op-ééngesprek met hem',
          why: 'Een mensenprobleem los je op in een persoonlijk gesprek, niet in een groep of een planning.',
        },
        {
          q: 'Twee soorten vastzitten lopen door elkaar: een onduidelijk doel en te weinig capaciteit. Waar begin je?',
          options: ['Bij capaciteit, dat is het makkelijkst', 'Bij allebei tegelijk', 'Bij wat de sponsor het liefst wil', 'Bij het doel, de vroegste in de keten'],
          answer: 'Bij het doel, de vroegste in de keten',
          why: 'Capaciteit toevoegen aan een project met een onduidelijk doel levert alleen meer discussie op.',
        },
        {
          q: 'Wat is een bruikbaar vroeg signaal dat jij zelf vastzit?',
          options: ['Je staat al twee weken “op het punt” hetzelfde te doen', 'De klant is vriendelijk', 'Je werkt normale uren', 'De stuurgroep is volgende week'],
          answer: 'Je staat al twee weken “op het punt” hetzelfde te doen',
          why: 'Steeds uitstellen betekent meestal dat iets je tegenhoudt wat je nog niet benoemd hebt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een verpakkingsbedrijf, week 6. Je voelt dat het project vastzit, maar je kunt niet zeggen waarom. Je manager vraagt: “Wat speelt er daar nou eigenlijk?”',
        ask: 'Hoe zoek je uit wat er mis is, en hoe leg je het uit?',
        model: 'Ik zou de vier vragen eerlijk doorlopen. Stel: het doel is helder, de volgende stappen zijn bekend, de operations manager steunt het, maar de acties lopen bij het hele team uit. Dan zou ik zeggen: “Ik denk dat het capaciteit is. Iedereen zei vier uur per week toe, maar niemand heeft ze. Ik wil de sponsor laten kiezen: de uren vrijmaken, of de planning vertragen.”',
        rubric: [
          'Gebruikt een gestructureerde check in plaats van een vaag gevoel',
          'Benoemt één soort vastzitten, onderbouwd met symptomen',
          'Koppelt het aan de passende oplossing en wie er moet handelen',
        ],
        pushback: {
          lines: [
            '“‘Het voelt vast’ is niks waar ik iets mee kan. Geef me feiten.”',
            '“Misschien denk je er te veel over na. Ga nog een paar weken door en kijk wat er gebeurt.”',
          ],
          model: '“Terecht, een gevoel is niet genoeg. Feiten: negen van de twaalf acties van de afgelopen drie weken zijn uitgelopen, verspreid over het hele team, en de meesten halen ongeveer één van hun vier beloofde uren. Wachten maakt geen uren vrij. Ik vraag de sponsor deze week ze vrij te maken of de planning te vertragen, en vrijdag hoor je het.”',
          rubric: [
            'Erkent de vraag om feiten',
            'Benoemt het probleem met concreet bewijs, geen vaag gevoel',
            'Stelt een concrete volgende stap voor met wie het kan oplossen',
          ],
        },
      },
      sayIt: 'Leg een junior collega in 60 seconden de vier soorten vastzitten uit en hoe je ze uit elkaar houdt.',
      terms: [
        { term: 'Onduidelijk doel', def: 'Mensen zijn het oneens over wat succes is, dus elke oplossing gaat weer open.' },
        { term: 'Onduidelijke weg', def: 'Het doel is helder, maar niemand weet hoe je er komt.' },
        { term: 'Mensenprobleem', def: 'Iemand wiens steun je nodig hebt, geeft hem niet; je ziet het aan de uitlopende acties of de stilte van één persoon.' },
        { term: 'Capaciteitsprobleem', def: 'Iedereen is het eens, maar niemand heeft de uren om het werk te doen.' },
        { term: 'Afweging', def: 'Een keuze om het ene minder te geven zodat het andere meer krijgt, zoals tijd, scope of kwaliteit; meestal aan de sponsor (trade-off).' },
      ],
    },
    {
      id: 'pm.stuck.buytime',
      title: 'Professioneel tijd kopen',
      pre: [
        {
          q: 'Een plantdirecteur stelt je in een overleg een vraag die je niet kunt beantwoorden. Welke reactie kost het meeste vertrouwen?',
          options: ['“Dat weet ik nog niet; ik kom er donderdag bij je op terug.”', 'Een zelfverzekerde gok die later fout blijkt', '“Goede vraag, ik check het even bij de engineer.”', '“Mijn eerste beeld is X, maar ik wil het bevestigen.”'],
          answer: 'Een zelfverzekerde gok die later fout blijkt',
          why: 'Door de mand vallen kost veel meer vertrouwen dan een eerlijk “ik zoek het uit”.',
        },
      ],
      teach: [
        'Weet je het niet, zeg dat dan, en zeg wanneer je het wel weet. “Goede vraag. Ik wil niet gokken. Ik check het bij de onderhoudsengineer en kom er donderdag bij je op terug.”\n\nTwee regels: noem een concreet moment, en houd je eraan. Een beloofd antwoord op donderdag dat op donderdag komt, bouwt meer vertrouwen dan een snel antwoord ter plekke.',
        'Scheid wat je weet, wat je denkt en wat je niet weet. “We weten dat de afzeggingen naar 9% zijn gedaald. We denken dat het vooral door de materiaalcheck komt. We weten nog niet of het standhoudt in het drukke seizoen.”\n\nZeg op welke aanname je leunt: iets wat je voorlopig als waar behandelt, zonder bewijs. Senior mensen vertrouwen een consultant die dat onderscheid maakt; ze wantrouwen er een die over alles even zeker klinkt.',
        'Een tussenbericht is voor als er iets misgaat en je nog niet het hele beeld hebt: wat we weten, wat we nu doen, wanneer je meer hoort. “De pilotdata van vorige week ontbreekt. We checken met IT of het een rapportagefout is. Om 14:00 krijg je een update.”\n\nDat stopt het speculeren en koopt je een paar uur. Laat oorzaken weg die je nog niet bevestigd hebt.',
        'Word je gepusht om ter plekke te beslissen: “Ik wil je een goed antwoord geven, geen snel antwoord. Mag ik er morgen om 10 uur op terugkomen?” Bijna niemand zegt nee.\n\nGebruik het niet te vaak: als je het weet, geef antwoord. Een voorlopig beeld is vaak prima: “Mijn eerste beeld is X; donderdag bevestig ik het.” Vraagt iemand een getal dat je niet hebt? Geef een bandbreedte, een lage en een hoge waarde, met waar het van afhangt.',
        'Bluf nooit. Bluffen, een gok als feit brengen, valt sneller op dan je denkt: engineers en controllers testen je, en na één verzonnen getal wordt elk volgend getal betwijfeld.\n\nWaar experts over twisten: sommige seniors zeggen dat klanten betalen voor zekerheid, niet voor “ik zoek het uit”. Het midden: zeg erbij hoe zeker je bent (calibrated confidence). Een scherpe vraag aan jezelf: “Wat moet ik weten om het zeker te weten, en wie weet dat?”',
      ],
      example: {
        kind: 'faded',
        text: 'Stuurgroep (steering group), het maandelijkse overleg waar de sponsor en senior managers beslissen, bij een maker van metalen onderdelen. De CFO, de financieel directeur, draait zich naar je toe: “Dus wat is de besparing volgend jaar? Ik heb vrijdag een getal nodig voor de begroting.”\n\nHet is dinsdag. Jij schat tussen de 100.000 en 250.000 euro per jaar. Het verschil hangt af van of lijn 2 volgend jaar in scope zit, dus bij het project hoort, en dat heeft niemand besloten.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Geef de bandbreedte en waar die van afhangt, en beloof een moment voor zijn deadline. “Tussen de 100 en 250 duizend. Het verschil is lijn 2. Ik check morgen bij de productiemanager of lijn 2 volgend jaar meedoet, en donderdag stuur ik je één getal met de aannames, een dag voor je deadline.”\n\nDoe dan precies dat. Is lijn 2 donderdag nog niet besloten, adviseer hem dan de voorzichtige 100.000 te begroten en de 150.000 extra apart te laten zien, met wat ervoor moet gebeuren.',
      },
      said: 'Wat je hoort in projecten: “Ik heb een getal nodig, geen bandbreedte. Geef me gewoon je beste gok.”',
      recall: [
        {
          q: 'Wat zijn de twee regels als je belooft terug te komen met een antwoord?',
          options: ['Vaag blijven over de timing, en dan meer leveren', 'Een concreet moment noemen, en je eraan houden', 'Altijd binnen een uur antwoorden, en je manager in de cc zetten', 'Alleen schriftelijk beloven, nooit telefonisch'],
          answer: 'Een concreet moment noemen, en je eraan houden',
          why: 'Een nagekomen belofte bouwt vertrouwen; een vage klinkt als ontwijken.',
        },
        {
          q: 'Wat staat er in een tussenbericht?',
          options: ['Een volledige analyse van de oorzaak', 'Excuses en een belofte dat het niet meer gebeurt', 'Wat we weten, wat we nu doen, wanneer je meer hoort', 'Alleen geruststelling'],
          answer: 'Wat we weten, wat we nu doen, wanneer je meer hoort',
          why: 'Het geeft feiten en een volgend moment, zonder te gokken naar oorzaken.',
        },
        {
          q: 'Een klant wil nu één getal, maar jij hebt alleen een bandbreedte. Wat is het beste?',
          options: ['Het midden noemen alsof het zeker is', 'Weigeren een getal te geven', 'Het hoogste getal noemen zodat hij tevreden is', 'De bandbreedte geven met waar die van afhangt, en wanneer je hem kleiner maakt'],
          answer: 'De bandbreedte geven met waar die van afhangt, en wanneer je hem kleiner maakt',
          why: 'Eerlijk over de onzekerheid, en toch bruikbaar voor zijn besluit.',
        },
        {
          q: 'Waarom vertrouwen senior mensen een consultant die scheidt wat hij weet, denkt en niet weet?',
          options: ['Het laat oordeelsvermogen zien over hoe hard elke bewering is', 'Het maakt rapporten langer', 'Zo neemt hij nergens een standpunt in', 'Het staat in adviescontracten'],
          answer: 'Het laat oordeelsvermogen zien over hoe hard elke bewering is',
          why: 'Over alles even zeker klinken laat zien dat je het verschil niet ziet.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder en presenteert pilotresultaten. Een senior assetmanager, die de netcomponenten over hun hele levensduur beheert, onderbreekt je: “Heb je gecorrigeerd voor de storm in week 4? Die week waren er drie keer zoveel storingen als normaal.” Storingen (faults) zijn uitvallen in het net. Je wist niks van de storm.',
        ask: 'Wat zeg je?',
        model: '“Van die storm wist ik niet, dank je. Dat kan de cijfers van week 4 beïnvloeden. Ik zoek uit hoeveel afzeggingen die week met de storm te maken hadden en stuur je donderdag de gecorrigeerde cijfers.” Dan doorgaan met de rest, week 4 markeren als “wordt nagekeken”, en donderdag de correctie sturen.',
        rubric: [
          'Geeft toe het niet te weten zonder zich te verdedigen',
          'Noemt een concrete actie en een moment om terug te komen',
          'Gaat door met de presentatie zonder te bluffen over de geraakte data',
        ],
        pushback: {
          lines: [
            '“Wist je niets van de storm? Hoe kunnen we dan al deze cijfers nog vertrouwen?”',
            '“Ik wil geen terugkoppeling achteraf. Of het resultaat klopt of niet. Wat is het?”',
          ],
          model: '“Scherp, dat wist ik niet, dank je. De andere weken komen uit dezelfde bron en zijn niet door de storm geraakt, dus dat deel staat. Of het resultaat overeind blijft zonder week 4, kan ik nu niet zeggen, en ik ga niet gokken. Ik reken het opnieuw door zonder die week en stuur het je donderdag.”',
          rubric: [
            'Erkent het punt zonder defensief te worden',
            'Blijft erbij niet te gokken en houdt vast wat wel klopt',
            'Stelt een concrete opvolging met tijdstip voor',
          ],
        },
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit hoe je omgaat met een vraag die je bij een klant niet kunt beantwoorden.',
      terms: [
        { term: 'Tussenbericht', def: 'Wat we weten, wat we doen, wanneer je meer hoort, voor het hele beeld er is.' },
        { term: 'Aanname', def: 'Iets wat je voorlopig als waar behandelt zonder bewijs; benoem het, zodat anderen het kunnen checken.' },
        { term: 'Voorlopig beeld', def: 'Een eerste mening, duidelijk gemarkeerd als nog niet bevestigd.' },
        { term: 'Bandbreedte', def: 'Een lage en een hoge waarde in plaats van één getal, met wat bepaalt waar het antwoord uitkomt.' },
        { term: 'Bluffen', def: 'Een gok als feit brengen; dat sloopt vertrouwen zodra het uitkomt.' },
      ],
    },
    {
      id: 'pm.stuck.askhelp',
      title: 'Goed om hulp vragen',
      pre: [
        {
          q: 'Wanneer willen senior consultants het liefst dat een junior om hulp vraagt?',
          options: ['Alleen als het project echt in de problemen zit', 'Nooit, junioren moeten het zelf oplossen', 'Vroeg, zodra ze een of twee dingen geprobeerd hebben en vastzitten', 'Bij de maandelijkse review'],
          answer: 'Vroeg, zodra ze een of twee dingen geprobeerd hebben en vastzitten',
          why: 'Hulp in week 2 is goedkoop; hulp in week 8 is een reddingsoperatie.',
        },
      ],
      teach: [
        'Junioren wachten te lang, omdat vragen voelt als zwakte toegeven. Seniors zien het andersom: een junior die goed en vroeg om hulp vraagt, durven ze juist bij klanten neer te zetten. Vuistregel: zit je langer dan een dag of twee op hetzelfde vast en heb je twee aanpakken geprobeerd, vraag dan.\n\nOm hulp vragen is geen escalatie. Escalatie is een probleem neerleggen bij iemand met meer zeggenschap, zodat die beslist; hulp vragen is advies halen en zelf beslissen.',
        'Een hulpvraag formuleren is helpen makkelijk maken: context in twee zinnen, wat je geprobeerd hebt, je concrete vraag, wat je nodig hebt en wanneer.\n\n“Ik krijg de OEE-data bij de zuivelfabriek niet kloppend. Ik heb gematcht op ploeg en op ordernummer; geen van beide past. Weet jij hoe MES-systemen dit meestal berekenen? Een kwartier voor donderdag zou helpen.” Het MES is de software op de werkvloer die stops en output vastlegt.',
        'Kies de juiste persoon.\n\nEen senior collega: methode, ervaring en politiek advies (“hoe pak ik deze directeur aan?”). Een specialist of engineer: technische feiten. De klant: hoe hun organisatie werkt. Collega’s op jouw niveau (peers): “heeft iemand dit eerder gezien?”\n\nAndere vragen, andere mensen. Kan de eerste persoon niet helpen, vraag dan iemand anders; stop niet bij één.',
        'De klant als bron: “Jij kent deze organisatie veel beter dan ik. Met wie zou jij hierover praten?”\n\nKlanten vinden het prettig om om advies gevraagd te worden, en het bouwt hun eigenaarschap (ownership). Dat is geen zwakte; zo vinden goede consultants de kortste weg. Eén grens: geef ze niet je huiswerk. Vraag de weg, niet de analyse.',
        'De lus sluiten: vertel wat je met het advies gedaan hebt en hoe het ging. Het kost één bericht en zorgt dat ze je de volgende keer graag weer helpen.\n\nWaar experts over twisten: zelf worstelen bouwt vaardigheid, maar wachten kost de klant geld. Een gangbaar midden is een timebox: probeer het een vaste tijd alleen, zeg een halve dag, en vraag dan. Een scherpe vraag aan jezelf: “Wat zou ik vragen als ik niet bang was junior over te komen?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 4 bij een levensmiddelenfabriek. Je analyse laat zien dat de OEE, het deel van de geplande tijd waarin de lijnen goed product maken op volle snelheid, in het systeem 71% is, maar de stoplogs van de operators wijzen op ongeveer 60%. Je bent al drie dagen bezig die twee kloppend te krijgen.\n\nJe manager heeft het erg druk. Over acht dagen is de stuurgroep, die de nulmeting (baseline), de meting van het startpunt, verwacht.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Stop met alleen puzzelen. Stuur je manager vier regels: context, wat je geprobeerd hebt, de vraag, en een verzoek om een kwartier deze week.\n\nVraag tegelijk de procesengineer van de klant: “Wie weet precies hoe de OEE in het systeem berekend wordt?” Waarschijnlijk iemand bij IT of het MES-team, en het antwoord is misschien één instelling, zoals korte stops die niet meetellen.\n\nIn de stuurgroep breng je het eerlijk als bevinding: “Het systeem zegt 71%, de vloer registreert ongeveer 60%. We zoeken uit welke definitie klopt, en dat verschil is op zich al belangrijk.”',
      },
      said: 'Wat je hoort in projecten: “Waarom kwam je niet twee weken geleden bij me? Dit was een vraag van tien minuten.”',
      recall: [
        {
          q: 'Wat is de beste manier om een drukke senior om hulp te vragen?',
          options: ['“Heb je een keer tijd om te praten?”', '“Ik zit vast op X. Ik heb A en B geprobeerd. Mijn vraag is C. Heb je een kwartier voor donderdag?”', 'Een lange mail met alle achtergrond', '“Kun jij dit stuk overnemen?”'],
          answer: '“Ik zit vast op X. Ik heb A en B geprobeerd. Mijn vraag is C. Heb je een kwartier voor donderdag?”',
          why: 'Het is kort, laat je eigen inspanning zien, en maakt helpen makkelijk.',
        },
        {
          q: 'Je wilt weten hoe de organisatie van de klant echt over budgetten beslist. Wie vraag je eerst?',
          options: ['Een technisch specialist', 'Iemand bij de klant die de organisatie kent', 'Een collega bij een andere klant', 'Niemand, je gokt'],
          answer: 'Iemand bij de klant die de organisatie kent',
          why: 'Voor hoe hun organisatie werkt, is de klant de beste bron.',
        },
        {
          q: 'Waarom vraag je de klant “Met wie zou jij hierover praten?”',
          options: ['Zo schuif je het werk naar hen', 'Het is beleefde smalltalk', 'Het laat zien dat je je vak niet kent', 'Zij kennen de kortste weg, en gevraagd worden bouwt hun eigenaarschap'],
          answer: 'Zij kennen de kortste weg, en gevraagd worden bouwt hun eigenaarschap',
          why: 'Hun kennis gebruiken is effectief en versterkt de relatie.',
        },
        {
          q: 'Een senior gaf je advies dat hielp. Wat doe je daarna?',
          options: ['Vertellen wat je ermee gedaan hebt en hoe het ging', 'Niks, hij heeft het druk', 'Meteen om meer advies vragen', 'Het noemen in je jaargesprek'],
          answer: 'Vertellen wat je ermee gedaan hebt en hoe het ging',
          why: 'De lus sluiten zorgt dat hij je de volgende keer graag weer helpt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, twee weken in je eerste project dat je alleen leidt. Het hoofd uitvoering negeert je uitnodigingen. Je weet niet of je moet escaleren, het blijven proberen of om hem heen moet gaan. De partner bij je bureau, een senior mede-eigenaar die verantwoordelijk is voor deze klant, kent de klant goed.',
        ask: 'Wat doe je?',
        model: 'De partner vragen, zo dat helpen makkelijk is: “Het hoofd uitvoering heeft op drie uitnodigingen niet gereageerd. Ik heb het via mail, via zijn secretaresse en met een kort woordje op de gang geprobeerd. Zou jij het anders aanpakken, of is er geschiedenis die ik moet kennen? Een kwartier deze week zou helpen.” Ook zou ik mijn sponsor bij de klant vragen: “Met wie zou jij praten om zijn tijd te krijgen?” Dan handelen, en beiden vertellen wat ik gedaan heb.',
        rubric: [
          'Vraagt vroeg om hulp in plaats van alleen te worstelen',
          'Formuleert de vraag met context, wat geprobeerd is en een duidelijk verzoek',
          'Gebruikt ook de klant als bron, en sluit de lus',
        ],
        pushback: {
          lines: [
            '“Jij bent nu de lead. Als je na twee weken al naar mij komt, vraagt de klant zich af waarom we jou gestuurd hebben.”',
            '“Ben je al eens gewoon bij hem binnengelopen? Uitnodigingen negeren is makkelijk.”',
          ],
          model: '“Terecht, ik wil ook niet dat jij het overneemt. Ik heb drie uitnodigingen, zijn secretaresse en één gesprekje op de gang geprobeerd; morgen loop ik bij hem binnen. Wat ik vraag is een kwartier van jouw kijk: waar ligt hij wakker van, en naar wie luistert hij? Dan pak ik het zelf op.”',
          rubric: [
            'Erkent de zorg over zijn rol als lead',
            'Benoemt wat hij al probeerde en wat hij nodig heeft',
            'Stelt een concrete, beperkte hulpvraag voor',
          ],
        },
      },
      sayIt: 'Leg een junior collega in 60 seconden uit wanneer en hoe je een senior om hulp vraagt.',
      terms: [
        { term: 'Hulpvraag formuleren', def: 'Context, wat je geprobeerd hebt, de concrete vraag, wat je nodig hebt en voor wanneer.' },
        { term: 'De lus sluiten', def: 'Iemand vertellen wat je met zijn hulp gedaan hebt.' },
        { term: 'Klant als bron', def: 'De kennis van de klant over zijn eigen organisatie gebruiken om de weg te vinden.' },
        { term: 'Escalatie', def: 'Een probleem neerleggen bij iemand met meer zeggenschap zodat die beslist, anders dan om advies vragen.' },
        { term: 'MES', def: 'Manufacturing execution system: de software op de werkvloer die orders, stops en output per machine vastlegt.' },
      ],
    },
    {
      id: 'pm.stuck.experiment',
      title: 'Handelen onder onzekerheid',
      pre: [
        {
          q: 'Je weet niet zeker of een nieuwe planningsregel helpt. Welke aanpak is meestal het best?',
          options: ['Meer data analyseren tot je het zeker weet', 'Het overal invoeren en kijken wat er gebeurt', 'De meest senior persoon laten beslissen', 'Het twee weken klein uitproberen met een duidelijke meting, dan beslissen'],
          answer: 'Het twee weken klein uitproberen met een duidelijke meting, dan beslissen',
          why: 'Een kleine test beantwoordt de vraag sneller en overtuigender dan nog meer discussie.',
        },
      ],
      teach: [
        'Zekerheid krijg je zelden. De vraag is niet “weten we het zeker?” maar “wat kost het als we het mis hebben, en kunnen we het terugdraaien?”\n\nEen omkeerbaar besluit, zoals een nieuw overlegformat, een planningsregel of een bord aan de muur, kun je snel nemen en testen. Een onomkeerbaar besluit, zoals een machine kopen, een ploegencontract wijzigen of een reorganisatie aankondigen, verdient trage, zorgvuldige analyse.',
        'Ontwerp een klein experiment: een test met een vaste duur en een meting. Begin bij een hypothese, een vermoeden dat een test kan weerleggen: “Als planners ploeg en materiaal twee dagen vooraf bevestigen, dalen de afzeggingen.”\n\nDe kleinste test: twee planners, twee weken, ongeveer 40 klussen. Wat je meet, en waartegen. En, afgesproken voor je begint, het stopcriterium: welke uitkomst doorgaan betekent en welke stoppen.',
        'Experimenten verlagen weerstand. “We proberen het twee weken, dan beslissen we samen” is veel makkelijker om ja tegen te zeggen dan “vanaf maandag is dit de nieuwe manier”. Maar houd je aan de belofte: evalueer open, en stop ook echt als het niet werkt.\n\nTypische fouten: geen vergelijkingsgroep (control group), twee veranderingen tegelijk, of een testteam dat zoveel aandacht krijgt dat het daar werkt en nergens anders.',
        'Waar experts over twisten: snelheid. Jeff Bezos noemde omkeerbare besluiten in zijn aandeelhoudersbrief over 2015, verschenen in april 2016, “two-way doors”, deuren waar je weer door terug kunt, die kleine groepen snel mogen nemen. Critici merken op dat “kleine” veranderingen sociaal moeilijk terug te draaien zijn als mensen eraan gewend zijn.\n\nVraag dus: “Wat kost teruggaan, in geld en in vertrouwen?” En weet je het niet: “We weten het nog niet. Dit is het kleinste wat het ons kan vertellen.”',
        'De grens: experimenteer nooit met veiligheid. Schakelprocedures, vergrendeling (lockout: de energie van een machine afsluiten met een persoonlijk hangslot) en de vijf veiligheidsregels voor elektrisch werk (uit de NEN 3140 en de Europese norm EN 50110) gaan niet even op de proef, hoe groot de druk ook is.\n\nDie regels: vrijschakelen; beveiligen tegen herinschakelen; spanningsloosheid vaststellen; aarden en kortsluiten; naastgelegen delen onder spanning afschermen.',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een netbeheerder discussieert het team al drie weken over de vraag of planners de aannemer (contractor), het externe bedrijf waarvan de ploegen het werk doen, twee dagen voor elke klus moeten bellen om ploeg en materiaal te bevestigen. Sommigen zeggen dat het plannerstijd opvreet; anderen dat het de afzeggingen verlaagt.\n\nEr is geen data. De afzeggingen in de regio zijn 16% van de geplande klussen.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Dit is omkeerbaar en goedkoop, dus test het in plaats van erover te discussiëren. Twee planners bellen twee weken lang vooraf bij ongeveer 40 klussen; de andere planners werken zoals altijd. Meet de afzeggingen in beide groepen en de minuten per belletje.\n\nSpreek vooraf af: dalen de afzeggingen in de testgroep met minstens een derde, naar ongeveer 11% of lager, en duurt een belletje gemiddeld minder dan 10 minuten, dan rollen we het uit; anders stoppen we. Bij 6 minuten per belletje kosten 40 klussen 4 uur, weinig naast één afgezegde ploegdag. Zeg het team duidelijk dat het een test is, en presenteer de uitkomst samen.',
      },
      said: 'Wat je hoort in projecten: “We kunnen niks veranderen voordat we zeker weten dat het werkt.”',
      recall: [
        {
          q: 'Een planner pleegt 40 bevestigingsbelletjes van elk 6 minuten. Hoeveel uur is dat?',
          number: 4,
          tolerance: 0.1,
          unit: 'uur',
          why: '40 × 6 = 240 minuten; 240 / 60 = 4 uur.',
        },
        {
          q: 'Welk besluit verdient de traagste, meest zorgvuldige analyse?',
          options: ['Een nieuwe agenda voor het weekoverleg', 'Een proef met een planningsregel bij twee planners', 'Het ploegencontract van 200 operators wijzigen', 'Een bord naar een andere muur verhangen'],
          answer: 'Het ploegencontract van 200 operators wijzigen',
          why: 'Het is moeilijk terug te draaien en raakt veel mensen; omkeerbare veranderingen kun je testen.',
        },
        {
          q: 'Wanneer spreek je af welke uitkomst doorgaan of stoppen betekent?',
          options: ['Voordat het experiment begint', 'Nadat je de resultaten ziet', 'Alleen als het resultaat tegenvalt', 'Nooit, je beslist per geval'],
          answer: 'Voordat het experiment begint',
          why: 'Achteraf beslissen nodigt iedereen uit om het resultaat op zijn eigen manier te lezen.',
        },
        {
          q: 'Wat mag nooit onderdeel zijn van een snel experiment?',
          options: ['De volgorde van agendapunten', 'Hoe planners materiaal bevestigen', 'Waar het planbord hangt', 'De stappen van een schakelprocedure'],
          answer: 'De stappen van een schakelprocedure',
          why: 'Veiligheidsprocedures, zoals de stappen om netdelen veilig uit en in te schakelen, test je niet met vallen en opstaan.',
        },
      ],
      situation: {
        scene: 'Je zit bij een kunststoffabriek. De productiemanager wil alle omstellingen (changeovers), een machine van het ene product op het volgende omzetten, naar het begin van elke ploeg verplaatsen, maar de ploegleiders zeggen dat dat chaos geeft. Beide kanten zijn er zeker van. De discussie heeft al vier overleggen gekost.',
        ask: 'Wat stel je voor?',
        model: '“We kunnen blijven discussiëren, of we zoeken het uit. Ik stel voor dat we het twee weken op één lijn proberen. We meten omsteltijd en output op die lijn tegen de andere. Daalt de output niet en worden omstellingen korter, dan breiden we het uit; zo niet, dan stoppen we. Zullen we die criteria nu afspreken?”',
        rubric: [
          'Maakt van de discussie een kleine, omkeerbare test',
          'Bepaalt wat er gemeten wordt en een vergelijking',
          'Spreekt vooraf criteria af voor doorgaan en stoppen',
        ],
        pushback: {
          lines: [
            '“Een experiment? Ik heb vier overleggen lang beide kanten gehoord. Ik weet dat het klopt; het moet gewoon gebeuren.”',
            '“En als je het op één lijn test, zorgen de ploegleiders er wel voor dat het mislukt.”',
          ],
          model: '“Ik snap dat je het afgerond wilt hebben. Een proef van twee weken op één lijn rondt het af met feiten in plaats van een vijfde overleg. Om het eerlijk te houden spreken we vooraf met jou en de ploegleiders af wat telt als succes. Werkt het, dan gaat het fabrieksbreed.”',
          rubric: [
            'Erkent zijn ongeduld en zijn zorg',
            'Houdt vast aan testen voor een fabrieksbreed besluit',
            'Stelt een concrete proef voor met vooraf afgesproken criteria',
          ],
        },
      },
      sayIt: 'Leg een manager bij de klant in 60 seconden uit waarom een klein experiment vaak beter is dan meer analyse.',
      terms: [
        { term: 'Omkeerbaar besluit', def: 'Een besluit dat je goedkoop kunt terugdraaien, dus je kunt snel beslissen en testen.' },
        { term: 'Onomkeerbaar besluit', def: 'Een besluit dat moeilijk of duur terug te draaien is, en zorgvuldige analyse verdient.' },
        { term: 'Experiment', def: 'Een kleine test met een vaste duur, een meting en vooraf afgesproken stopcriteria.' },
        { term: 'Hypothese', def: 'Een concreet vermoeden over oorzaak en gevolg dat een test kan weerleggen.' },
        { term: 'Stopcriterium', def: 'De uitkomst, afgesproken voor de test, die betekent dat je stopt in plaats van uitrolt.' },
        { term: 'Vijf veiligheidsregels', def: 'De vaste stappen voor elektrisch werk: vrijschakelen, beveiligen tegen herinschakelen, spanningsloosheid vaststellen, aarden en kortsluiten, naastgelegen delen onder spanning afschermen.' },
      ],
    },
    {
      id: 'pm.stuck.pressure',
      title: 'Als de klant druk zet',
      pre: [
        {
          q: 'Een boze directeur bij de klant eist dat je twee weken eerder levert. Wat is de meest riskante reactie?',
          options: ['Vragen wat de nieuwe datum drijft', 'Ter plekke toezeggen om hem te kalmeren', 'Zeggen dat je aan het eind van de dag met opties terugkomt', 'Even checken bij je eigen manager'],
          answer: 'Ter plekke toezeggen om hem te kalmeren',
          why: 'Een belofte onder druk die je niet kunt waarmaken, maakt van een lastig moment een gebroken afspraak.',
        },
      ],
      teach: [
        'Als een klant flink druk zet, is je eerste taak het tempo eruit halen. Niet verdedigen, niet beloven.\n\nErken de druk: “Ik hoor dat dit voor jou urgent is.” Noem dan een terugbelmoment: “Laat me kijken wat realistisch is, dan bel ik je om 18:00 terug.” Een rustige consultant die terugkomt met opties is meer waard dan een snel ja.',
        'Eerst de feiten. Wat is er precies afgesproken? Wat is de status? Wat is er veranderd, bij hen of bij jou? Schrijf het op voordat je terugbelt.\n\nVaak komt de druk van boven hen: een bestuursvergadering, een klacht van een klant. Vraag: “Wat moet je maandag kunnen laten zien?” De echte behoefte, wat ze werkelijk moeten bereiken, is vaak kleiner dan de eis.',
        'Scheid de eis van de opties. Het is zelden alles of niks.\n\nKan een deel live? Kan het bestuur resultaten zien in plaats van een livegang, de dag dat de nieuwe werkwijze echt start? Wat is het risico van sneller gaan, en wie draagt dat?\n\nKom met twee of drie opties en je advies, zoals bij elk besluit.',
        'De stuurgroep, waar de sponsor en senior managers beslissen, is je bondgenoot. Afwegingen tussen tijd, scope en risico horen daar, niet op de gang met één boze manager.\n\nEn vertel het je eigen manager voordat de klant dat doet. Escaleert de klant naar je partner, de senior mede-eigenaar van je bureau die voor deze klant verantwoordelijk is, dan wil je dat de partner het eerst van jou hoort.',
        'Soms heeft de klant gelijk en ben jij uitgelopen. Neem dat dan snel en ronduit op je, en zeg wat je eraan doet.\n\nTypische fouten: een ja aan de telefoon waar je maandag spijt van hebt, of zo hard verdedigen dat je de discussie wint en de klant verliest. Een scherpe vraag voor het terugbellen: “Wat gebeurt er maandag als we niks veranderen?”',
      ],
      example: {
        kind: 'faded',
        text: 'Vrijdag 16:30. De productiedirecteur van een metaalbedrijf belt: “Maandag vergadert het bestuur. Dan moet de nieuwe planning op lijn 2 live zijn, anders wordt dit project stopgezet.”\n\nVolgens de planning gaat het in week 12 live; het is week 9. De dagploeg is getraind, de nachtploeg niet. Je manager is tot maandag op vakantie.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Zeg aan de telefoon geen ja en geen nee. “Ik hoor dat dit voor maandag urgent is. Laat me kijken wat realistisch kan, dan bel ik je om 18:00 terug.” Zoek dan uit wat het drijft: waarschijnlijk moet hij het bestuur voortgang laten zien, niet letterlijk een volledige livegang.\n\nBereid opties voor. A: vanaf maandag alleen in de dagploeg live, met jou op de vloer; de nachtploeg volgt in week 11 na de training. B: geen livegang, maar je geeft hem één A4 voor het bestuur met de pilotresultaten en een vaste datum. Volledig live met een ongetrainde nachtploeg riskeert een slechte week waar het bestuur over hoort.\n\nAdviseer A. Stuur voor 18:00 een bericht aan de vervanger van je manager of je partner. Bel op tijd terug, en bied aan hem voor te bereiden op het bestuur.',
      },
      said: 'Wat je hoort in projecten: “Het kan me niet schelen hoe, maandag moet dit af zijn. Anders bel ik je baas.”',
      recall: [
        {
          q: 'Wat doe je als eerste als een klant flink druk zet?',
          options: ['Uitleggen waarom de vertraging niet jouw schuld is', 'Beloven dat je je best doet', 'Het tempo eruit halen, de druk erkennen en zeggen wanneer je terugkomt', 'Meteen naar zijn baas escaleren'],
          answer: 'Het tempo eruit halen, de druk erkennen en zeggen wanneer je terugkomt',
          why: 'Rust en een duidelijk terugbelmoment werken beter dan verdedigen of beloven in het heetst van de strijd.',
        },
        {
          q: 'Welke vraag laat vaak zien dat de echte behoefte kleiner is dan de eis?',
          options: ['“Wat moet je maandag kunnen laten zien?”', '“Waarom heb je dit niet eerder gezegd?”', '“Wie weet hier nog meer van?”', '“Is dit echt nodig?”'],
          answer: '“Wat moet je maandag kunnen laten zien?”',
          why: 'Achter een eis met een deadline zit vaak iets concreets dat iemand moet zien.',
        },
        {
          q: 'Waar horen afwegingen tussen tijd, scope en risico?',
          options: ['In een gesprek met de boosste manager', 'Alleen bij het projectteam', 'Bij de consultant alleen', 'In de stuurgroep, met de sponsor'],
          answer: 'In de stuurgroep, met de sponsor',
          why: 'Dat zijn besluiten voor de sponsor, genomen met het hele beeld.',
        },
        {
          q: 'De klant dreigt je partner, de senior mede-eigenaar van je bureau, te bellen. Wat doe je?',
          options: ['Hopen dat hij het niet doet', 'Je partner zelf eerst inlichten, met de feiten', 'Toegeven aan de eis', 'De klant vragen het niet te doen'],
          answer: 'Je partner zelf eerst inlichten, met de feiten',
          why: 'Je partner moet het van jou horen, met context, voordat de klant belt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. In een stuurgroep zegt een regiodirecteur scherp: “Je pilot is drie weken te laat. Mij zijn in september resultaten beloofd.” De vertraging kwam door late toegang tot een IT-systeem, die je op tijd escaleerde in de stuurgroep van juli, maar de directeur miste die stuurgroep.',
        ask: 'Hoe reageer je in het overleg?',
        model: 'Rustig blijven en met de feiten beginnen, zonder iemand de schuld te geven. “Je hebt gelijk, we lopen drie weken achter op september. De oorzaak was de late systeemtoegang, die we in de stuurgroep van juli hebben aangekaart. Dit is waar we nu staan, en hier zijn twee opties om een deel van de vertraging in te halen.” Dan de sponsor en de groep laten kiezen.',
        rubric: [
          'Blijft rustig en erkent de vertraging zonder zich te verdedigen',
          'Geeft de feiten, inclusief de eerdere escalatie, zonder schuld te leggen',
          'Gaat door naar opties waar de stuurgroep over beslist',
        ],
        pushback: {
          lines: [
            '“Het maakt me niet uit wiens schuld het was. Mij was september beloofd en nu heb ik niks.”',
            '“Geëscaleerd? Waarom heb ik daar dan niks van gehoord? Dat is ook jouw werk.”',
          ],
          model: '“Je mag resultaat verwachten, en het spijt me dat dit bij jou terechtkomt. De vertraging kwam door de IT-toegang; die heb ik in de stuurgroep van juli gemeld, die jij miste. Ik had je ook rechtstreeks moeten bellen. Over drie weken liggen de eerste resultaten er, en tot die tijd krijg je elke vrijdag een korte update van mij.”',
          rubric: [
            'Erkent zijn frustratie zonder iemand de schuld te geven',
            'Zet de feiten rustig neer en neemt zijn eigen deel',
            'Stelt een concrete nieuwe datum voor en hoe hij op de hoogte blijft',
          ],
        },
      },
      sayIt: 'Leg een junior collega in 60 seconden uit wat je doet in het eerste uur na een boos telefoontje van een klant.',
      terms: [
        { term: 'Terugbelmoment', def: 'Een concreet moment waarop je belooft terug te komen, wat rust en tijd koopt.' },
        { term: 'Echte behoefte', def: 'Wat de klant achter een eis eigenlijk moet bereiken.' },
        { term: 'Livegang', def: 'Het moment dat een nieuw systeem of een nieuwe werkwijze echt start in de dagelijkse operatie.' },
        { term: 'Stuurgroep', def: 'Het vaste overleg waar de sponsor en senior managers de grote besluiten en afwegingen van het project nemen.' },
        { term: 'Partner', def: 'Een senior mede-eigenaar van een adviesbureau die verantwoordelijk is voor de klantrelatie.' },
      ],
    },
    {
      id: 'pm.stuck.reset',
      title: 'Een vastgelopen project herstarten',
      pre: [
        {
          q: 'Welke uitkomst van een herstartgesprek, een eerlijk gesprek met de sponsor over een vastgelopen project, kan een succes zijn?',
          options: ['Het project stoppen', 'Het oorspronkelijke plan ongewijzigd laten', 'Afspreken harder te werken', 'Het besluit doorschuiven naar volgend kwartaal'],
          answer: 'Het project stoppen',
          why: 'Een project stoppen dat niet kan leveren maakt mensen en geld vrij; doorgaan verspilt allebei.',
        },
      ],
      teach: [
        'Projecten mislukken zelden plotseling; ze drijven af. Halverwege, met het doel duidelijk buiten bereik, is hopen het nog in te halen de meest gemaakte en duurste keuze.\n\nDeels is dat de valkuil van verzonken kosten: wat al is uitgegeven voelt als reden om door te gaan, terwijl alleen toekomstige kosten en baten zouden moeten tellen. Een herstart betekent stoppen om eerlijk te kijken en een nieuwe afspraak maken.',
        'De eerlijke analyse, op één A4. Plan tegenover werkelijkheid op doel, scope, tijd, mensen en resultaten. Dan de oorzaken, met de vier soorten vastzitten: doel, weg, mensen, capaciteit.\n\nCheck de RAG-status, de kleur rood, oranje of groen in het statusrapport. Blijft die wekenlang groen terwijl het doel wegglijdt, dan is het een “watermeloen”: groen van buiten, rood van binnen. Oranje dat nooit rood wordt, is dezelfde valkuil. Benoem je eigen aandeel: “Ik had het capaciteitsprobleem in week 4 moeten escaleren.”',
        'Praat eerst met je eigen manager. Vraag dan de sponsor om 45 minuten.\n\nOpen ronduit: “Ik wil eerlijk tegen je zijn: zoals het nu is opgezet, haalt dit project zijn doel niet. Dit zie ik, dit denk ik dat de oorzaak is, en dit zijn drie opties.” De opties zijn meestal: stoppen en overdragen wat werkt; de scope verkleinen en het goed afmaken; opnieuw plannen onder nieuwe voorwaarden.',
        'Opnieuw contracteren is de nieuwe afspraak op papier zetten: een nieuwe doelzin, scope, einddatum, rollen, en waar de sponsor zich aan verbindt, zoals bij elke stuurgroep zijn of twee planners vrijmaken.\n\nVoeg een ijkmoment toe, een afgesproken moment en criterium: “Als we in week 20 niet op X zitten, stoppen we.” Een herstart die alleen datums verschuift, mislukt een tweede keer.',
        'Het voelt ongemakkelijk, misschien zelfs beschamend. Doe het toch. Sponsors zijn vaak opgelucht: zij voelden het ook, en niemand zei het.\n\nWaar experts over twisten: hoort bij een herstart een nieuwe projectleider? Sommigen zeggen dat een nieuw gezicht de herstart geloofwaardig maakt; anderen dat de leider die het probleem eerlijk benoemt juist vertrouwen heeft verdiend. Een scherpe vraag: “Met wat we nu weten, zouden we dit project vandaag starten?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 14 van 20 bij een netbeheerder. Doel: de tijd van klusaanvraag tot vrijgave (release), het moment dat een klus aan een ploeg wordt overgedragen, halveren in drie regio’s.\n\nWerkelijkheid: de pilot draait in één regio; de vrijgavetijd is 10% korter; de sponsor was bij één van de vier stuurgroepen; twee belangrijke planners vertrokken in maand twee en zijn niet vervangen. Het team rapporteert nog steeds oranje: risico, maar niet mislukt.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Schrijf het eerlijke A4: plan tegenover werkelijkheid, en de oorzaken. Vooral capaciteit (twee planners weg) en mensen (een afwezige sponsor). Benoem je eigen aandeel: je had het vertrek van de planners in maand twee moeten aankaarten.\n\nPraat met je manager. Vraag dan de sponsor om 45 minuten: “Zoals het nu is opgezet, haalt dit project zijn doel niet.”\n\nDrie opties. A: nu stoppen en overdragen wat in de pilotregio werkt. B: terug naar de pilotregio, daar 40% korter als doel, in zes weken goed afronden. C: alle drie de regio’s met twee extra planners en de sponsor bij elke stuurgroep, einddatum tien weken later.\n\nAdviseer B, tenzij zij zich echt aan C kan verbinden. Leg de nieuwe afspraak vast, met een ijkmoment.',
      },
      said: 'Wat je hoort in projecten: “We lopen wat achter, maar als iedereen de laatste weken even doorpakt, halen we het nog.”',
      recall: [
        {
          q: 'Waarom benoem je je eigen aandeel in de eerlijke analyse?',
          options: ['Je bureau eist het', 'Het maakt de rest van de analyse geloofwaardig', 'Het beschermt de klant tegen schuld', 'Het maakt het gesprek korter'],
          answer: 'Het maakt de rest van de analyse geloofwaardig',
          why: 'Als jij je eigen fouten noemt, vertrouwt de sponsor je kijk op de rest.',
        },
        {
          q: 'Met wie praat je voor de sponsor?',
          options: ['Met het hele projectteam', 'Met de baas van de sponsor', 'Met je eigen manager', 'Met niemand, de sponsor moet het als eerste horen'],
          answer: 'Met je eigen manager',
          why: 'Je bureau mag niet verrast worden, en je manager kan je helpen voorbereiden.',
        },
        {
          q: 'Wat staat er in een goede nieuwe afspraak na een herstart?',
          options: ['Een nieuw doel, scope, einddatum, rollen, toezeggingen van de sponsor en een ijkmoment', 'Alleen een nieuwe einddatum', 'Een excuusbrief', 'Een belofte om harder te werken'],
          answer: 'Een nieuw doel, scope, einddatum, rollen, toezeggingen van de sponsor en een ijkmoment',
          why: 'Een herstart werkt alleen als de voorwaarden veranderen, niet alleen de datums.',
        },
        {
          q: 'Halverwege is het doel duidelijk buiten bereik. Wat is de meest gemaakte maar duurste keuze?',
          options: ['Het project stoppen', 'De scope verkleinen', 'Om meer mensen vragen', 'Hopen het in de laatste weken in te halen'],
          answer: 'Hopen het in de laatste weken in te halen',
          why: 'Het schuift het probleem door tot er geen opties meer zijn.',
        },
      ],
      situation: {
        scene: 'Je zit bij een levensmiddelenfabriek, week 10 van 16. Het OEE-doel, voor het deel van de geplande tijd dat de lijnen goed product maken op volle snelheid, was 75%; je zit op 64% en dat staat al vijf weken stil. De sponsor is vriendelijk, maar heeft de beloofde acht onderhoudsuren per week niet vrijgemaakt. Je manager zegt: “Jij bepaalt hoe je het aanpakt.”',
        ask: 'Wat doe je?',
        model: 'Ik zou één A4 schrijven: doel 75, werkelijk 64, al vijf weken vlak, oorzaak vooral capaciteit omdat de beloofde onderhoudsuren nooit kwamen, plus mijn aandeel in het niet eerder escaleren. Dan de sponsor om 45 minuten vragen en ronduit zeggen dat het doel zo niet gehaald wordt. Opties: stoppen en overdragen; mikken op 68% met het huidige team; of de acht onderhoudsuren per week nu vrijmaken en 75% houden met vier weken extra. De nieuwe afspraak op papier zetten.',
        rubric: [
          'Maakt een eerlijke analyse op één A4, inclusief eigen aandeel',
          'Zegt de sponsor ronduit dat het doel zo niet gehaald wordt',
          'Biedt heldere opties, inclusief stoppen, en legt de nieuwe afspraak vast',
        ],
        pushback: {
          lines: [
            '“Laten we niet dramatisch doen. 64 is al beter dan eerst. Ga door, dan zien we het in week 16.”',
            '“Onderhoudsuren zijn overal krap. Ik kan ze niet zomaar ergens anders weghalen.”',
          ],
          model: '“64 is echte vooruitgang, en die wil ik vasthouden. Maar vijf weken vlak betekent dat we 75 zo niet halen. De ontbrekende onderhoudsuren zijn de belangrijkste reden. Of we maken die acht uur per week vrij, of we stellen het doel nu bij naar 68. Ik wil je vragen om deze week te kiezen.”',
          rubric: [
            'Erkent de vooruitgang en zijn beperkingen',
            'Zegt helder dat de huidige weg het doel niet haalt',
            'Stelt een duidelijke keuze met een termijn voor',
          ],
        },
      },
      sayIt: 'Leg een junior collega in 60 seconden uit hoe je een herstartgesprek met een sponsor voert.',
      terms: [
        { term: 'Herstart', def: 'Stoppen om een vastgelopen project eerlijk te bekijken en een nieuwe afspraak te maken.' },
        { term: 'Verzonken kosten', def: 'Geld en moeite die al zijn uitgegeven en niet terugkomen; ze horen niet te bepalen of je doorgaat.' },
        { term: 'RAG-status', def: 'Rood, oranje of groen (red, amber, green) in een statusrapport: in de problemen, risico, of op koers.' },
        { term: 'Opnieuw contracteren', def: 'Een nieuw doel, scope, rollen en toezeggingen op papier afspreken.' },
        { term: 'IJkmoment', def: 'Een afgesproken moment en criterium om te beslissen over doorgaan of stoppen.' },
      ],
    },
  ],
};

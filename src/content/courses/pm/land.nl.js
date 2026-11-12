// pm.land (Nederlands): landen, de verandering laten beklijven: standaardwerk en training, adoptie en overdracht, borgen, baten en reflectie. Vier onderwerpen, elk vier niveaus.
export default {
  lessons: [
    // Onderwerp 1: standaardwerk en training
    {
      id: 'pm.land.training',
      film: 'pm.land.training',
      title: 'Training en werkinstructies',
      pre: [
        {
          q: 'Wat is de beste check of een training gewerkt heeft?',
          options: ['Een tevredenheidsscore aan het eind van de training', 'Een schriftelijke toets direct na afloop van de sessie', 'Een week later kijken hoe mensen de taak op de werkplek doen', 'Opkomstcijfers per ploeg en per afdeling'],
          answer: 'Een week later kijken hoe mensen de taak op de werkplek doen',
          why: 'Alleen wat mensen op de werkplek doen telt; een training leuk vinden zegt weinig.',
        },
      ],
      teach: [
        'Schrijf de nieuwe manier op als korte werkinstructie: één A4 per taak, stappen op volgorde, foto’s van de echte apparatuur, en per stap het kernpunt, het detail waardoor het goed of fout gaat, plus waarom dat ertoe doet.\n\nSchrijf hem met de mensen die het werk doen en test hem: laat iemand die er niet bij was hem volgen terwijl jij kijkt. Waar hij aarzelt, is de instructie onduidelijk.',
        'Dit komt uit TWI, Training Within Industry, een Amerikaans oorlogsprogramma uit 1940 dat tot 1945 meer dan 1,6 miljoen certificaten uitreikte. De methode Job Instruction heeft vier stappen: de leerling voorbereiden, voordoen en uitleggen, zelf laten proberen terwijl jij corrigeert, en later nagaan hoe het gaat.\n\nHet motto geldt nog steeds: heeft de medewerker het niet geleerd, dan heeft de instructeur het niet aangeleerd. Toyota nam het in de jaren 50 over.',
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
          options: ['In een klaslokaal met slides en een korte quiz aan het eind', 'Uit een duidelijke instructie die per mail naar iedereen gaat', 'In een e-learning die ze in hun eigen tempo kunnen volgen', 'Op de werkplek: voordoen, samen doen, zelf laten doen, checken'],
          answer: 'Op de werkplek: voordoen, samen doen, zelf laten doen, checken',
          why: 'Vaardigheden vragen oefening op de echte apparatuur, met feedback.',
        },
        {
          q: 'Na de training maken veel mensen dezelfde fout. Wat zegt dat?',
          options: ['Ze letten tijdens de trainingssessie niet goed op', 'De instructie of de training moet beter', 'Ze verzetten zich stilletjes tegen de verandering', 'Er moeten meer mensen op getraind worden'],
          answer: 'De instructie of de training moet beter',
          why: 'Een gedeelde fout wijst naar het systeem, niet naar de mensen.',
        },
        {
          q: 'Wanneer train je mensen?',
          options: ['Vlak voordat ze het nodig hebben, met begeleiding in de eerste weken erna', 'Zo vroeg mogelijk, maanden vooraf, zodat er tijd is om te oefenen', 'Pas na de livegang, als de echte problemen boven komen', 'Eén keer per jaar, in een opfrissessie voor de hele afdeling'],
          answer: 'Vlak voordat ze het nodig hebben, met begeleiding in de eerste weken erna',
          why: 'Training lang voor gebruik is grotendeels vergeten tegen de tijd dat je het nodig hebt.',
        },
        {
          q: 'Hoe test je een nieuwe werkinstructie?',
          options: ['Iemand die er niet bij was hem laten volgen terwijl jij kijkt', 'De schrijver hem de volgende ochtend nog eens goed laten lezen', 'Hem ter goedkeuring naar de manager sturen voordat hij gedrukt wordt', 'De spelling en de foto’s naast de huisstijl leggen'],
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
      id: 'pm.land.standardwork',
      title: 'Standaardwerk: de basis onder elke verbetering',
      pre: [
        {
          q: 'Wat is in Lean het belangrijkste doel van standaardwerk?',
          options: ['Operators precies voorschrijven hoe snel ze moeten werken', 'Een map met procedures die klaarligt voor de volgende audit', 'Een basis waartegen je afwijkingen ziet en verbetert', 'Bewijzen tegenover de klant dat het proces onder controle is'],
          answer: 'Een basis waartegen je afwijkingen ziet en verbetert',
          why: 'Zonder vastgelegde huidige beste manier zie je niet wat afwijkt, en weet je niet of een verandering echt een verbetering is.',
        },
      ],
      teach: [
        'Standaardwerk (standardized work) is in Lean de vastgelegde huidige beste manier om een taak te doen: wie doet wat, in welke volgorde, in hoeveel tijd. Het is geen dikke procedure, maar een blad bij de werkplek.\n\nHet Lean Enterprise Institute noemt drie elementen: de takttijd, de werkvolgorde en het standaard onderhanden werk. Ontbreekt er één, dan heb je een werkinstructie, maar nog geen standaardwerk.',
        'De takttijd (takt time) is het tempo dat de klant vraagt: beschikbare tijd gedeeld door de vraag, zoals 27.000 seconden / 600 dozen = 45 seconden per doos. Het rekenwerk staat in Capaciteit en flow; hier is de takt de maat waarop de standaard rust.\n\nDe cyclustijd (cycle time) is hoe lang een operator echt over zijn rondje doet. Meet tien rondjes achter elkaar op de vloer en noteer de laagste tijd die steeds terugkomt. Een rondje met een probleem hoort op de probleemlijst, niet in de standaard.',
        'De werkvolgorde (work sequence) is de vaste volgorde van de stappen, inclusief het lopen. Vaste volgorde betekent minder vergeten, minder zoeken en gelijke kwaliteit tussen ploegen.\n\nHet standaard onderhanden werk (standard work-in-process) is het kleinste aantal stuks dat in het proces moet liggen om soepel door te werken: één in elke machine, plus de stuks die eerst moeten afkoelen, drogen of uitharden. Ligt er veel meer, dan verbergt de voorraad problemen; ligt er minder, dan staat iemand te wachten.',
        'Standaardwerk is niet hetzelfde als de werkinstructie uit TWI. De werkinstructie leert een nieuwe medewerker hoe een taak moet, met kernpunten. Standaardwerk laat de leidinggevende in één oogopslag zien of het werk volgens plan loopt.\n\n“Waar geen standaard is, kan geen kaizen zijn” wordt vaak toegeschreven aan Taiichi Ohno, de vader van het Toyota-productiesysteem, al is er geen bron in zijn eigen werk bekend. Kaizen is stap voor stap verbeteren. Zonder standaard weet je niet waar je van uit gaat.',
        'Wat vaak misgaat: een consultant schrijft het standaardwerk achter een bureau, en de operators doen het na een week weer op hun eigen manier. Schrijf het met de mensen die het werk doen en meet het op de vloer.\n\nExperts twisten over hoe strak je moet zijn. Sommigen willen elke handgreep vastleggen; anderen alleen de stappen die kwaliteit en veiligheid bepalen. Een scherpe vraag aan de teamleider: “Waar zie jij hier dat iemand afwijkt van de standaard?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een levensmiddelenfabriek begeleid je de inpaklijn voor soep naar standaardwerk. De takt komt uit de capaciteitsstudie: 27.000 seconden per dienst / 600 bakjes = 45 seconden per bakje.\n\nStap 1: je meet met de teamleider tien rondjes achter elkaar op station 3, het lopen inbegrepen. Negen rondjes duren 42 tot 45 seconden, de meeste 42; één duurt 58, omdat de folierol op was. Je noteert 42 seconden, de laagste tijd die steeds terugkomt, en zet de folierol op de probleemlijst.\nStap 2: de werkvolgorde. Halverwege loopt de operator weg om folie te halen; het folierek komt binnen handbereik en de volgorde ligt vast: bakje pakken, gewicht checken, folie leggen, sealen, op de koelbaan schuiven.\nStap 3: het standaard onderhanden werk. Een geseald bakje hete soep moet 90 seconden afkoelen voordat station 4 het etiketteert: 90 / 45 = 2 bakjes op de koelbaan, plus 1 in de sealer, dus 3. Meer verbergt alleen problemen.\nStap 4: per station één blad met volgorde, tijd en onderhanden werk. De teamleider checkt het elk uur.',
      },
      said: 'Wat je hoort in projecten: “Standaardwerk? Dan worden we robots. Iedereen heeft zijn eigen manier, en die werkt prima.”',
      recall: [
        {
          q: 'Na het spuitgieten moet elk onderdeel 135 seconden afkoelen voordat de volgende stap het kan pakken. De takt is 45 seconden, en er zit altijd één onderdeel in de matrijs. Hoeveel stuks vormen het standaard onderhanden werk voor deze stap, koelrek en matrijs samen?',
          number: 4,
          tolerance: 0.1,
          unit: 'stuks',
          hint: 'Elke takt gaat er één onderdeel het rek in. Hoeveel takten blijft een onderdeel daar liggen? Tel daarna het stuk in de matrijs erbij.',
          why: '135 / 45 = 3 stuks die afkoelen, plus 1 in de matrijs = 4 stuks. Minder en de volgende stap wacht; meer verbergt alleen problemen.',
        },
        {
          q: 'Welke drie elementen horen volgens het Lean Enterprise Institute bij standaardwerk?',
          options: ['Takttijd, werkvolgorde en standaard onderhanden werk', 'Takttijd, werkinstructie en een getekende audit', 'Werkvolgorde, OEE-doel en een vaardigheidstoets', 'Cyclustijd, ploegrooster en een veiligheidsblad'],
          answer: 'Takttijd, werkvolgorde en standaard onderhanden werk',
          why: 'Tempo, volgorde en de minimale voorraad in het proces samen maken de standaard; de rest zijn hulpmiddelen.',
        },
        {
          q: 'Waarin verschilt standaardwerk van een werkinstructie uit TWI?',
          options: ['Standaardwerk is voor nieuwe medewerkers, de instructie voor ervaren', 'Er is geen verschil; het zijn twee woorden voor één blad', 'De werkinstructie bepaalt de takt, standaardwerk de kwaliteit', 'De instructie leert de taak; standaardwerk laat afwijkingen zien'],
          answer: 'De instructie leert de taak; standaardwerk laat afwijkingen zien',
          why: 'De werkinstructie is een leermiddel met kernpunten; standaardwerk is de norm waartegen de leidinggevende het lopende werk vergelijkt.',
        },
        {
          q: 'Waarom zeggen Lean-mensen dat je een standaard nodig hebt voordat je verbetert?',
          options: ['Omdat de klant anders geen certificaat afgeeft', 'Omdat je anders niet ziet of iets echt beter is', 'Omdat operators zonder standaard niet mogen werken', 'Omdat verbeteren pas mag na de eerste audit'],
          answer: 'Omdat je anders niet ziet of iets echt beter is',
          why: 'Een verbetering is beter dan iets; zonder vastgelegd uitgangspunt kun je niet vergelijken.',
        },
      ],
      situation: {
        scene: 'Je werkt bij een kunststoffabriek aan een nieuwe assemblagecel. De ploegleider van de dagploeg, Ronald, zegt: “Schrijf jij maar wat op, wij doen het toch op onze manier. Mijn mensen weten echt wel hoe je een deksel monteert.”',
        ask: 'Hoe krijg je standaardwerk dat de ploegen echt gebruiken?',
        model: '“Jouw mensen weten het beter dan ik, dus ik wil het niet opschrijven, ik wil dat zij het opschrijven. Laten we morgen met je twee snelste operators tien rondjes meten en kijken waarom die sneller zijn. Wat werkt, wordt de standaard voor alle ploegen. En als iemand straks een betere manier vindt, passen we het blad aan.”',
        rubric: [
          'Laat de operators de standaard zelf maken',
          'Meet op de vloer in plaats van te schrijven achter een bureau',
          'Maakt duidelijk dat de standaard mag verbeteren',
        ],
        pushback: {
          lines: [
            '“Tien rondjes meten met een stopwatch? Dan voelen mijn mensen zich gecontroleerd.”',
            '“En straks gebruikt het management die tijden om ons op te jagen.”',
          ],
          model: '“Begrijpelijk. We meten de stappen, niet de mensen, en de operators houden zelf de stopwatch vast als ze willen. De tijden gaan niet naar een beoordeling; ze laten zien waar het werk stokt. Zie je dat het toch tegen jullie gebruikt wordt, zeg het, dan stop ik ermee.”',
          rubric: [
            'Neemt de angst voor controle serieus',
            'Legt uit waarvoor de metingen wel en niet zijn',
            'Geeft de ploegleider een concrete manier om hem erop aan te spreken',
          ],
        },
      },
      sayIt: 'Leg een ploegleider in 60 seconden uit waarom standaardwerk geen keurslijf is, maar het vertrekpunt voor verbeteren.',
      terms: [
        { term: 'Standaardwerk', def: 'De vastgelegde huidige beste manier om een taak te doen: takt, werkvolgorde en standaard onderhanden werk.' },
        { term: 'Takttijd', def: 'Het tempo dat de klant vraagt: beschikbare productietijd gedeeld door de gevraagde aantallen.' },
        { term: 'Cyclustijd', def: 'Hoe lang een operator of machine echt over één rondje doet, gemeten op de vloer.' },
        { term: 'Werkvolgorde', def: 'De vaste volgorde van de stappen van een taak, inclusief het lopen.' },
        { term: 'Standaard onderhanden werk', def: 'Het kleinste aantal stuks in het proces dat nodig is om soepel door te werken.' },
      ],
    },
    {
      id: 'pm.land.skills',
      title: 'De vaardigheidsmatrix en multi-inzetbaarheid',
      pre: [
        {
          q: 'Op de vaardigheidsmatrix aan de muur staat de datum van vorig jaar. Wat zegt dat meestal?',
          options: ['Dat er sindsdien niemand nieuw is begonnen of vertrokken', 'Dat niemand hem gebruikt om de bezetting en training te plannen', 'Dat de vaardigheden van het team stabiel en op orde zijn', 'Dat HR de actuele versie digitaal bijhoudt'],
          answer: 'Dat niemand hem gebruikt om de bezetting en training te plannen',
          why: 'Een matrix die dagelijks gebruikt wordt, verandert vaak. Een oude datum betekent bijna altijd een muurversiering.',
        },
      ],
      teach: [
        'Een vaardigheidsmatrix (skills matrix) is een tabel met de medewerkers in de rijen en de taken of stations in de kolommen. In elk vakje staat hoe goed iemand die taak beheerst.\n\nIn Lean hangt hij op de werkvloer, bij het teambord, en de teamleider gebruikt hem elke dag: wie zet ik vandaag waar, en wie moet wat leren? Een matrix in een HR-systeem die niemand op de vloer ziet, stuurt niks.',
        'Veel fabrieken gebruiken ILUO, een schaal die uit de Japanse industrie komt. De letters vullen zich als het ware: I, in opleiding, alleen onder begeleiding. L, doet het zelfstandig volgens de standaard. U, haalt ook de standaardtijd en lost gewone problemen op. O, kan het anderen leren.\n\nLet op: bedrijven definiëren de letters verschillend. Spreek per fabriek af wat elke letter betekent, en beoordeel op wat je ziet, niet op gevolgde uren.',
        'Multi-inzetbaarheid (cross-training) betekent dat mensen meerdere stations kunnen draaien. Dat vangt ziekte, vakantie en wisselende vraag op, en maakt rouleren mogelijk, wat zwaar werk eerlijker verdeelt.\n\nEen veelgebruikte vuistregel, de regel van drie (rule of three): per station minstens drie mensen die het zelfstandig kunnen, dus op L of hoger. Met twee ben je bij één zieke en één vakantie meteen kwetsbaar. Het is een vuistregel, geen norm; kritieke stations willen soms meer.',
        'Van gaten naar een plan. Tel per station hoeveel mensen op L of hoger zitten, en zet de tekorten in een trainingsrooster (training timetable): wie, welk station, door welke trainer, in welke week. TWI kende dit rooster al in de jaren 40.\n\nTrain met Job Instruction en laat alleen iemand op O trainen. Plan realistisch: een nieuwe taak tot L brengen kost vaak weken oefening, niet een middag.',
        'Wat vaak misgaat: de matrix wordt een beoordelingsinstrument, mensen voelen zich afgerekend en vullen het gunstig in. Of de teamleider zet uit gewoonte steeds de beste operator op het lastigste station, zodat niemand anders het leert.\n\nExperts verschillen over belonen: sommigen koppelen loon aan het aantal stations, anderen vinden dat dat tot schijnkwalificaties leidt. Een scherpe vraag aan de teamleider: “Wie kan dit station draaien als Fatima morgen ziek is?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een kunststoffabriek draait een cel met vijf stations en acht operators. De matrix, net bijgewerkt met de teamleider, laat zien hoeveel mensen per station op L of hoger zitten: station 1: vier, station 2: twee, station 3: twee, station 4: één, station 5: nul. Eén operator, Kees, zit op O voor stations 2, 3 en 4. Station 5 is de nieuwe lekdichtheidstester; die draait nu de procesengineer.',
        ask: 'Hoeveel kwalificaties kom je tekort volgens de regel van drie, waar begin je, en hoe ziet je trainingsrooster eruit?',
        reveal: 'Nodig: 5 × 3 = 15. Aanwezig, met een maximum van drie per station: 3 + 2 + 2 + 1 + 0 = 8. Tekort: 7.\n\nBegin bij het grootste risico: station 5, daar kan geen operator het, en station 4, dat hangt aan één persoon. De procesengineer, de enige op O daar, leert eerst drie operators station 5 met Job Instruction; Kees traint er twee op station 4 en daarna één op station 2 en één op station 3.\n\nRooster: twee kwalificaties per maand, want elke leerling heeft weken oefening nodig. Na vier maanden zit elk station op drie, en de teamleider checkt de matrix elke week bij het teambord.',
      },
      said: 'Wat je hoort in projecten: “Alleen Kees kan station 4 draaien. Als Kees op vakantie is, plannen we die order gewoon niet.”',
      recall: [
        {
          q: 'Wat betekent de O op een ILUO-matrix meestal?',
          options: ['Dat iemand de taak nog onder begeleiding leert', 'Dat iemand de taak zelfstandig volgens de standaard doet', 'Dat iemand de standaardtijd haalt maar nog geen problemen oplost', 'Dat iemand de taak beheerst en anderen kan trainen'],
          answer: 'Dat iemand de taak beheerst en anderen kan trainen',
          why: 'O is het hoogste niveau: beheersen en het overdragen. Alleen die mensen geven Job Instruction.',
        },
        {
          q: 'Een lijn heeft 7 stations. Volgens de regel van drie wil je per station drie mensen op L of hoger. Nu zijn er 13 van zulke kwalificaties, en geen station heeft er meer dan drie. Hoeveel kwalificaties moet je er nog bij trainen?',
          number: 8,
          tolerance: 0.1,
          unit: 'kwalificaties',
          hint: 'Reken eerst uit hoeveel kwalificaties je in totaal nodig hebt: stations maal drie.',
          why: '7 × 3 = 21 nodig; 21 − 13 = 8 erbij.',
        },
        {
          q: 'Waarom hangt een Lean-vaardigheidsmatrix op de werkvloer en niet alleen in het HR-systeem?',
          options: ['Omdat de teamleider hem elke dag gebruikt voor bezetting en training', 'Omdat het HR-systeem de ILUO-letters niet kan weergeven', 'Omdat de auditor van de klant hem op de vloer wil zien hangen', 'Omdat operators dan zien wie de beste beoordeling heeft'],
          answer: 'Omdat de teamleider hem elke dag gebruikt voor bezetting en training',
          why: 'Het is een stuurmiddel voor vandaag en volgende week, geen archief.',
        },
        {
          q: 'De teamleider zet altijd de beste operator op het lastigste station. Wat is het risico op termijn?',
          options: ['Dat de kwaliteit op dat station langzaam achteruitgaat', 'Dat de andere operators zich achtergesteld voelen en vertrekken', 'Dat niemand anders het station leert en je van één persoon afhangt', 'Dat de beste operator te veel verdient vergeleken met de rest'],
          answer: 'Dat niemand anders het station leert en je van één persoon afhangt',
          why: 'Kortetermijnzekerheid bouwt een afhankelijkheid op die bij ziekte of vertrek de lijn stillegt.',
        },
      ],
      situation: {
        scene: 'Bij een metaalbedrijf wil de productiemanager dat je “even een vaardigheidsmatrix maakt” voor de audit van een klant volgende maand. Hij wil een mooi overzicht in Excel. De teamleiders weten er nog niks van.',
        ask: 'Wat stel je voor?',
        model: '“Ik kan een overzicht voor de audit maken, maar dan hebben we een document. Wat ik zou willen: elke teamleider vult met zijn mensen de matrix in bij het teambord, op wat ze zien, niet op cursussen. Dan zie je waar je kwetsbaar bent, bijvoorbeeld stations met maar één persoon. Daar maken we een trainingsrooster voor. De auditor ziet dan een matrix die echt gebruikt wordt.”',
        rubric: [
          'Maakt het verschil tussen een auditdocument en een stuurmiddel duidelijk',
          'Laat de teamleiders de matrix met hun mensen invullen op wat ze zien',
          'Koppelt de matrix aan een trainingsrooster voor de gaten',
        ],
        pushback: {
          lines: [
            '“De audit is over vier weken. Ik heb geen tijd voor een heel traject met teamleiders.”',
            '“En als mensen zien dat ze op I staan, krijg ik gedoe met de OR.”',
          ],
          model: '“Vier weken is genoeg: per teamleider kost het invullen een uur met zijn ploeg. Over de OR, de ondernemingsraad: terecht punt. Laten we het brengen als een plan om mensen breder te trainen, niet als beoordeling, en de OR vooraf informeren. Een I betekent ‘krijgt training’, niet ‘doet het slecht’.”',
          rubric: [
            'Laat zien dat het binnen de tijd past',
            'Neemt de zorg over de OR serieus en stelt voor die vooraf te informeren',
            'Brengt de matrix als ontwikkeling, niet als afrekening',
          ],
        },
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit waarom een vaardigheidsmatrix op de vloer meer oplevert dan een overzicht voor de audit.',
      terms: [
        { term: 'Vaardigheidsmatrix', def: 'Een tabel van medewerkers en taken die per vakje laat zien hoe goed iemand een taak beheerst.' },
        { term: 'ILUO', def: 'Een vierstappenschaal voor vaardigheid: in opleiding, zelfstandig, ook op tijd en met problemen, kan anderen trainen. Bedrijven definiëren de letters verschillend.' },
        { term: 'Multi-inzetbaarheid', def: 'Dat medewerkers meerdere stations of taken zelfstandig kunnen doen.' },
        { term: 'Regel van drie', def: 'Een vuistregel: per station minstens drie mensen die het zelfstandig kunnen.' },
        { term: 'Trainingsrooster', def: 'Een plan wie welk station van welke trainer leert, en in welke week.' },
      ],
    },
    {
      id: 'pm.land.sdca',
      title: 'De standaard levend houden',
      pre: [
        {
          q: 'Een operator heeft een snellere manier gevonden om een mal in te stellen en doet het alleen in zijn eigen ploeg zo. Wat is de beste reactie?',
          options: ['Testen, en als het werkt de standaard aanpassen en alle ploegen trainen', 'Hem vragen terug te gaan naar het standaardblad tot het management beslist', 'Het zo laten; elke ploeg mag zijn eigen beste manier van werken houden', 'Het idee eerst doorsturen naar engineering voor een officiële studie'],
          answer: 'Testen, en als het werkt de standaard aanpassen en alle ploegen trainen',
          why: 'Een standaard is de huidige beste manier. Een betere manier hoort na een test de nieuwe standaard voor iedereen te worden.',
        },
      ],
      teach: [
        'Masaaki Imai, die kaizen in het Westen bekend maakte, verdeelt het werk van managers in twee taken. Onderhoud: zorgen dat de huidige standaard gevolgd wordt. Verbeteren: de standaard omhoog brengen.\n\nVoor verbeteren gebruik je PDCA: Plan, Do, Check, Act, de verbetercyclus van plannen, proberen, checken en vastleggen. Voor onderhoud gebruik je SDCA: Standardize, Do, Check, Act. Eerst de standaard vastleggen, dan doen, checken of het werk de standaard volgt, en bijsturen als dat niet zo is.',
        'De twee horen bij elkaar. Na elke verbetering met PDCA volgt SDCA, anders zakt de winst weg. En wie SDCA serieus doet, ziet steeds waar de standaard knelt: input voor de volgende PDCA.\n\nKaizen is in Lean het stap voor stap verbeteren door de mensen die het werk doen. Een standaard is dus de beste bekende methode (best known method) van vandaag, geen wet. Morgen kan iemand een betere vinden.',
        'Spreek af hoe een standaard verandert. Een gangbare route: de operator stelt iets voor, de teamleider test het een paar dagen in één ploeg en meet, de proceseigenaar keurt goed, het blad wordt aangepast, alle ploegen worden getraind met Job Instruction, en de oude versie gaat van de vloer.\n\nDat laatste vergeten projecten vaak. Versiebeheer (version control), met een versienummer en datum op elk blad, voorkomt dat er drie versies naast elkaar hangen.',
        'Grote veranderingen, zoals een nieuwe machine of een andere volgorde die kwaliteit raakt, gaan langs engineering of kwaliteit. Kleine verbeteringen houd je juist dicht bij de vloer, want een wekenlange goedkeuringsronde doodt elk voorstel.\n\nHoud bij hoeveel voorstellen er komen en hoe snel ze getest worden. Komen er geen, dan is de standaard niet perfect, maar voelt niemand zich eigenaar.',
        'Experts twisten over wie de standaard schrijft. In de Toyota-traditie, zoals Jeffrey Liker die beschrijft, schrijven teamleden en teamleiders hun eigen standaarden; in veel westerse fabrieken doet de engineer dat. Het eerste geeft eigenaarschap, het tweede soms meer technische zorgvuldigheid.\n\nWat vaak misgaat: een standaard die een jaar niet veranderd is in een fabriek die wel veranderd is. Scherpe vraag: “Wanneer is dit blad voor het laatst aangepast, en door wie?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een metaalbedrijf heeft operator Yusuf in de dagploeg een klemvolgorde bedacht die het omstellen (changeover) van de kantbank 4 minuten korter maakt. Zijn ploeg doet het al drie weken zo. De avondploeg niet: die werkt volgens het blad aan de machine. Vorige week ontstond er in de avond afkeur omdat een collega half de oude en half de nieuwe manier deed. De teamleider wil “gewoon weer iedereen volgens het blad”.',
        ask: 'Wat zou jij voorstellen, stap voor stap?',
        reveal: 'Niet terug naar het oude blad, maar de verbetering netjes vastleggen. PDCA: de teamleider test Yusufs volgorde een week in beide ploegen en meet de omsteltijd en de afkeur. Werkt het, dan SDCA: het blad wordt aangepast met een nieuw versienummer, Yusuf traint met de teamleider elke ploeg met Job Instruction, het oude blad gaat weg.\n\nDaarna checkt de teamleider een paar weken of iedereen de nieuwe volgorde volgt. En je spreekt met de proceseigenaar af hoe een volgend voorstel loopt, zodat het niet weer drie weken in één ploeg blijft hangen.',
      },
      said: 'Wat je hoort in projecten: “De standaard is de standaard. Daar ga je niet zomaar aan zitten.”',
      recall: [
        {
          q: 'Waar gebruik je SDCA voor, volgens Imai?',
          options: ['Om een nieuwe verbetering te bedenken en uit te proberen', 'Om de jaarlijkse doelen voor de afdeling vast te stellen', 'Om de huidige standaard vast te houden en afwijkingen bij te sturen', 'Om een probleem met de vijf waaroms tot de oorzaak te volgen'],
          answer: 'Om de huidige standaard vast te houden en afwijkingen bij te sturen',
          why: 'SDCA is de onderhoudscyclus; PDCA de verbetercyclus.',
        },
        {
          q: 'Wat is in Lean de juiste houding tegenover een standaard?',
          options: ['De standaard is een wet die alleen engineering mag wijzigen', 'Het is de beste bekende methode van vandaag, die mag verbeteren', 'Hij geldt alleen voor nieuwe medewerkers in hun eerste maand', 'Elke ploeg mag hem naar eigen inzicht aanpassen'],
          answer: 'Het is de beste bekende methode van vandaag, die mag verbeteren',
          why: 'Een standaard legt de huidige beste manier vast, juist zodat je kunt zien wanneer iets beter is.',
        },
        {
          q: 'Een verbetering is getest en goedgekeurd. Welke stap vergeten projecten het vaakst?',
          options: ['De operator die het idee had bedanken waar het team bij is', 'Het resultaat melden in het maandrapport aan het management', 'De besparing laten narekenen door de controller voor de rapportage', 'Alle ploegen trainen en de oude versie van de vloer halen'],
          answer: 'Alle ploegen trainen en de oude versie van de vloer halen',
          why: 'Zonder training en zonder het oude blad weg te halen, hangen er straks twee manieren naast elkaar.',
        },
        {
          q: 'Er komen al een halfjaar geen verbetervoorstellen meer op een lijn. Wat is de meest waarschijnlijke verklaring?',
          options: ['Niemand voelt zich eigenaar, of voorstellen blijven te lang liggen', 'De standaard is inmiddels zo goed dat er niks meer te verbeteren valt', 'De operators zijn tevreden met hun werk en hebben geen klachten', 'De lijn draait te weinig volume om verbeteringen te vinden'],
          answer: 'Niemand voelt zich eigenaar, of voorstellen blijven te lang liggen',
          why: 'Elk proces kan beter. Stilte wijst meestal op een systeem dat voorstellen ontmoedigt.',
        },
      ],
      situation: {
        scene: 'Bij een kabelfabrikant heb je drie maanden geleden standaardwerk ingevoerd op de extrusielijn. Bij je follow-up zie je dat de bladen aan de machines nog versie 1 zijn, terwijl de operators je trots twee verbeteringen laten zien die ze “gewoon zijn gaan doen”. De kwaliteitsmanager is daar niet blij mee.',
        ask: 'Wat zeg je tegen de kwaliteitsmanager en de teamleider?',
        model: '“Het goede nieuws: de operators verbeteren zelf. Het risico: niemand legt het vast, dus de volgende ploeg of een nieuwe collega doet het anders. Ik stel voor dat we een korte route afspreken: voorstel, een week testen door de teamleider, jouw akkoord als het kwaliteit raakt, blad aanpassen met een versienummer, alle ploegen trainen. Dan houden we de energie en jij de grip.”',
        rubric: [
          'Waardeert dat de operators zelf verbeteren',
          'Benoemt het risico van niet vastgelegde veranderingen',
          'Stelt een korte, concrete wijzigingsroute voor met een rol voor kwaliteit',
        ],
        pushback: {
          lines: [
            '“Dit is precies waarom ik tegen dat hele standaardwerk was. Iedereen gaat maar wat doen.”',
            '“Elke wijziging moet langs mij. Zo werkt ons kwaliteitssysteem.”',
          ],
          model: '“Ik snap je zorg; ongecontroleerde wijzigingen zijn een echt risico. Wat raakt de productkwaliteit, moet langs jou. Maar als elke kleine verbetering weken wacht, stoppen de operators met voorstellen, of ze doen het stiekem, zoals nu. Kunnen we samen bepalen welke wijzigingen jouw akkoord nodig hebben en welke de teamleider mag goedkeuren?”',
          rubric: [
            'Erkent het kwaliteitsrisico',
            'Laat zien dat een te zware route het probleem verergert',
            'Stelt voor samen de grens tussen groot en klein af te spreken',
          ],
        },
      },
      sayIt: 'Leg een kwaliteitsmanager in 60 seconden uit waarom een standaard moet kunnen veranderen, en hoe je dat beheerst doet.',
      terms: [
        { term: 'PDCA', def: 'Plan, Do, Check, Act: de verbetercyclus van plannen, proberen, checken en vastleggen.' },
        { term: 'SDCA', def: 'Standardize, Do, Check, Act: de onderhoudscyclus die zorgt dat de huidige standaard gevolgd wordt.' },
        { term: 'Kaizen', def: 'Stap voor stap verbeteren, vooral door de mensen die het werk doen.' },
        { term: 'Beste bekende methode', def: 'De standaard als de beste manier die we nu kennen, niet als wet.' },
        { term: 'Versiebeheer', def: 'Elk standaardblad een versienummer en datum geven, zodat er maar één geldige versie op de vloer hangt.' },
      ],
    },
    // Onderwerp 2: adoptie en overdracht
    {
      id: 'pm.land.change',
      film: 'pm.land.adoption',
      title: 'Wat adoptie echt drijft',
      pre: [
        {
          q: 'Wat voorspelt het best of operators een nieuwe werkwijze na het project blijven gebruiken?',
          options: ['Hoe helder en verzorgd de trainingsslides in de sessie waren', 'Of hun directe leidinggevende ernaar vraagt en het zelf gebruikt', 'Hoeveel mails en posters de verandering vooraf aankondigden', 'Of de directeur de kick-off persoonlijk en met verve opende'],
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
          options: ['Een postercampagne op elk prikbord in de fabriek', 'Dat de nieuwe manier makkelijker is dan de oude voor wie het werk doet', 'Een sterke projectnaam en een logo dat iedereen op de vloer herkent', 'Een duidelijk bericht van het hoofdkantoor over de redenen erachter'],
          answer: 'Dat de nieuwe manier makkelijker is dan de oude voor wie het werk doet',
          why: 'Kost de nieuwe manier ze meer moeite, dan glijden ze terug.',
        },
        {
          q: 'Waarom haal je de oude werkwijze weg als dat kan?',
          options: ['Om duidelijk te maken dat wie tegenwerkt wordt gecorrigeerd', 'Omdat de acht stappen van Kotter het op dit punt voorschrijven', 'Om meteen licentiegeld voor de oude tools te besparen', 'Zodat er geen terugvaloptie is als het druk wordt'],
          answer: 'Zodat er geen terugvaloptie is als het druk wordt',
          why: 'Onder druk grijpen mensen terug naar wat ze kennen, als het er nog is.',
        },
        {
          q: 'Mensen gaan niet mee en je weet niet waarom. Wat is de beste eerste stap?',
          options: ['Een paar van hen vragen wat het lastig maakt om te gebruiken', 'Een vriendelijke herinneringsmail naar het hele team sturen', 'De training herhalen voor iedereen die hem gemist heeft', 'Het lage gebruik deze week bij de sponsor melden'],
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
      film: 'pm.land.adoption',
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
          options: ['Om hem bezig te houden, zodat hij minder tijd heeft om te klagen', 'Zijn bezwaren maken het ontwerp beter en hij overtuigt anderen', 'Om het management duidelijk te laten zien wie dwarsligt', 'Omdat de OR formeel eist dat critici meedoen'],
          answer: 'Zijn bezwaren maken het ontwerp beter en hij overtuigt anderen',
          why: 'Critici zien vaak echte fouten, en een overtuigde criticus heeft geloofwaardigheid die jij mist.',
        },
        {
          q: 'Een operator raakt echt zijn zaterdagse overwerkgeld kwijt. Wat zeg je?',
          options: ['Nu nog niks zeggen; met een beetje geluk komt het in het overleg niet ter sprake', 'Zeggen dat het niet jouw besluit is en hem naar zijn eigen leidinggevende verwijzen', 'Hem vertellen dat hij op de lange termijn toch meer verdient, dus dat het uitmiddelt', 'Het verlies eerlijk erkennen en uitleggen waarom je het toch goed vindt'],
          answer: 'Het verlies eerlijk erkennen en uitleggen waarom je het toch goed vindt',
          why: 'Een echt verlies ontkennen sloopt vertrouwen; het benoemen houdt het heel.',
        },
        {
          q: 'Welke vraag brengt het best boven waar de weerstand over gaat?',
          options: ['“Wat zou er moeten kloppen om dit voor jou te laten werken?”', '“Waarom ben je hier eigenlijk tegen, terwijl de rest akkoord is?”', '“Snap je het plan, of zal ik het nog een keer uitleggen?”', '“Wie heeft je dat verteld, en wat zei hij er nog meer over?”'],
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
      film: 'pm.land.adoption',
      title: 'Verandering communiceren',
      pre: [
        {
          q: 'Van wie horen medewerkers het liefst wat een verandering betekent voor hun eigen werk?',
          options: ['De directeur of de plantmanager', 'De projectconsultant die het ontwerp maakte', 'HR, via het personeelsblad', 'Hun directe leidinggevende'],
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
        kind: 'faded',
        text: 'Een netbeheerder, het bedrijf achter het regionale stroomnet, verandert hoe geplande klussen worden vrijgegeven: vanaf volgende maand komt geen klus in de weekplanning zonder geslaagde gereedheidscheck (mensen, materiaal en vergunningen bevestigd).\n\nDrie groepen worden geraakt: vijf teamleiders planning, hun planners, en de teamleiders van de uitvoeringsploegen, die minder maar betrouwbaardere klussen gaan zien. Het hoofd planning wil vrijdag één mail naar iedereen sturen en klaar.',
        ask: 'Plan de cascade week voor week, en zeg hoe je checkt of de boodschap geland is.',
        reveal: 'Week 1: het hoofd planning vertelt het eerst de vijf teamleiders, met een FAQ van één A4, een lijst veelgestelde vragen met antwoorden, en hun eigen vragen beantwoord. Week 2: elke teamleider vertelt het zijn planners in het eigen teamoverleg, met drie kernboodschappen. Dezelfde week een kort bericht aan de teamleiders van uitvoering, omdat hun ploegen het gaan merken.\n\nWeek 3 en 4: de check staat bij elk planningsoverleg op het bord. In week 4 vraag je zes planners wat ze begrepen hebben. Twee denken dat de check optioneel is; dat zet je in het volgende overleg recht.',
      },
      said: 'Wat je hoort in projecten: “Niemand heeft ons iets verteld. We hoorden het van de jongens in Zwolle.”',
      recall: [
        {
          q: 'Wie moet als eerste horen over een verandering?',
          options: ['Iedereen tegelijk, zodat niemand het uit de tweede hand hoort', 'De leidinggevenden, voor hun teams', 'De medewerkers die het meest geraakt worden, want het gaat om hun werk', 'Alleen de OR (ondernemingsraad, works council)'],
          answer: 'De leidinggevenden, voor hun teams',
          why: 'Dan kunnen leidinggevenden de vragen van hun team beantwoorden in plaats van verrast te worden.',
        },
        {
          q: 'Er gaat al een gerucht rond over de verandering. Wat doe je?',
          options: ['Dezelfde dag communiceren wat je weet, wat nog niet, en wanneer wel', 'Wachten tot alles besloten is, zodat je jezelf nooit hoeft te verbeteren', 'Het gerucht stellig ontkennen tot de stuurgroep een besluit heeft genomen', 'Het negeren; geruchten gaan vanzelf liggen als je er geen aandacht aan geeft'],
          answer: 'Dezelfde dag communiceren wat je weet, wat nog niet, en wanneer wel',
          why: 'Stilte laat het gerucht het verhaal bepalen; gedeeltelijke eerlijkheid wint het daarvan.',
        },
        {
          q: 'Hoe rust je middenmanagers het best toe?',
          options: ['Ze het volledige projectplan sturen met het verzoek het voor de start te lezen', 'Ze uitnodigen voor de stuurgroep, zodat ze alle achtergrond horen', 'Eerst hun eigen vragen beantwoorden en ze kernboodschappen en te verwachten vragen geven', 'Ze het zelf laten uitzoeken; zij kennen hun teams beter dan jij'],
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
      id: 'pm.land.handover',
      title: 'Overdragen aan de lijn',
      pre: [
        {
          q: 'Wanneer is een overdracht aan de lijnorganisatie echt klaar?',
          options: ['Als de eindpresentatie gegeven is aan de stuurgroep en de plantmanager', 'Als alle documentatie, instructies en het KPI-blad naar de eigenaar zijn verstuurd', 'Als de eigenaar het een paar cycli alleen draaide en zonder jou een probleem oploste', 'Als de sponsor het eindrapport heeft getekend en de laatste factuur betaald is'],
          answer: 'Als de eigenaar het een paar cycli alleen draaide en zonder jou een probleem oploste',
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
        kind: 'faded',
        text: 'Bij een kabelfabrikant draag je het nieuwe wekelijkse planningsoverleg over aan de planningsmanager, Sanne. De KPI is leverbetrouwbaarheid (on-time delivery: het aandeel orders dat op de beloofde datum geleverd wordt); 92% is normaal. Je hebt nog negen weken. Ze moet ook het capaciteitsmodel, het overzicht van beschikbare machine- en mensuren, aan nieuwe planners kunnen uitleggen, en spoedorders kunnen opvangen.',
        ask: 'Wat zet je op de overdrachtschecklist, hoe verdeel je de negen weken, en waaraan zie je dat de overdracht klaar is?',
        reveal: 'Checklist: ze kan de KPI lezen en weet dat 92% normaal is; ze zit het overleg voor; ze kan het capaciteitsmodel uitleggen aan een nieuwe planner; ze weet wat te doen bij een spoedorder.\n\nWeek 1 tot 3: jij zit voor, zij kijkt. Week 4 tot 6: zij zit voor, jij zit ernaast en jullie bespreken het daarna 10 minuten na. Week 7 tot 9: ze doet het alleen.\n\nHet bewijs: in week 8 valt een belangrijke machine uit en plant ze de week om zonder jou te bellen. De KPI gaat naar het maandelijkse operationele rapport. Overdracht klaar.',
      },
      said: 'Wat je hoort in projecten: “Dus dat is nu ook van mij? Naast al het andere?”',
      recall: [
        {
          q: 'Wie moet na het project eigenaar zijn van een nieuw proces?',
          options: ['De consultant, tot het volgende project begint en er iemand vrij is', 'Iemand met dagelijks contact met het werk, zoals de planningsmanager', 'Een stafafdeling die er elke maand over rapporteert', 'De stuurgroep als geheel, zodat niemand het alleen draagt'],
          answer: 'Iemand met dagelijks contact met het werk, zoals de planningsmanager',
          why: 'De eigenaar moet dicht genoeg bij het werk zitten om er elke week op te sturen.',
        },
        {
          q: 'Waar horen de KPI’s na de overdracht?',
          options: ['In een apart projectdashboard dat jij hebt opgezet', 'In het eindrapport en de bijlagen daarvan', 'In de bestanden van de consultant, om bij de follow-up te vergelijken', 'In de rapportages en overleggen die de lijn al gebruikt'],
          answer: 'In de rapportages en overleggen die de lijn al gebruikt',
          why: 'Een apart dashboard sterft als het project stopt.',
        },
        {
          q: 'Wat is de goede volgorde om een overleg over te dragen?',
          options: ['Eigenaar kijkt, eigenaar doet het met jou ernaast, eigenaar doet het alleen', 'Eigenaar doet het vanaf dag één alleen, met jouw nummer bij de hand', 'Jij doet het tot de laatste week en stuurt dan een duidelijke handleiding', 'Eigenaar en jij wisselen elke week af, zo lang als nodig is'],
          answer: 'Eigenaar kijkt, eigenaar doet het met jou ernaast, eigenaar doet het alleen',
          why: 'Stapsgewijs overdragen bouwt vaardigheid en vertrouwen op.',
        },
        {
          q: 'De eigenaar zegt dat hij geen tijd heeft om het nieuwe proces te draaien. Wat doe je?',
          options: ['Het nog even voor hem doen tot het drukke seizoen voorbij is en hij lucht heeft', 'Zelf een andere eigenaar zoeken, iemand op de afdeling die meer tijd heeft', 'Vragen wat hij nodig heeft om het te draaien, en naar de sponsor gaan als hij dat niet krijgt', 'Het proces versimpelen tot het hem bijna geen tijd meer kost, en het dan overdragen'],
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
    // Onderwerp 3: borgen
    {
      id: 'pm.land.sustain',
      title: 'Resultaten vasthouden',
      pre: [
        {
          q: 'Wanneer beginnen resultaten na een geslaagd project het vaakst weg te zakken?',
          options: ['Twee tot vier maanden nadat de consultant weg is', 'In de eerste week na de livegang, als alles nog nieuw is', 'Na een jaar of vijf, als de mensen gewisseld zijn', 'Ze zakken zelden weg als de resultaten bewezen zijn'],
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
          hint: 'Reken eerst de stijging in punten uit, en dan hoeveel van die punten weer weg zijn.',
          why: 'De verbetering was 18 punten; 9 punten verloren; 9 / 18 = 50%.',
        },
        {
          q: 'Waarom spreek je een trigger af om terug te komen?',
          options: ['Om de klant later meer adviesdagen te verkopen', 'Om een reden te hebben de eigenaar de schuld te geven als het misgaat', 'Zodat terugkomen een plan is, geen teken van falen', 'Omdat kwaliteitsaudits het formeel eisen'],
          answer: 'Zodat terugkomen een plan is, geen teken van falen',
          why: 'Een afgesproken trigger maakt terugkomen normaal en op tijd.',
        },
        {
          q: 'Na de overdracht zakken de resultaten weg. Wat doe je?',
          options: ['Het zelf snel oplossen, voordat de sponsor merkt dat het terugzakt', 'De eigenaar helpen uitzoeken wat er veranderd is en hem laten handelen', 'De eigenaar bij de sponsor melden, zodat het zwart op wit vastligt', 'Het project opnieuw starten, met een nieuw team en een nieuw plan'],
          answer: 'De eigenaar helpen uitzoeken wat er veranderd is en hem laten handelen',
          why: 'Zelf oplossen neemt het eigenaarschap weg bij degene die het moet volhouden.',
        },
        {
          q: 'Wat houdt een nieuwe werkwijze het best levend?',
          options: ['Eén grote, grondige audit per jaar door een externe partij, met een rapport', 'Een helder eindrapport dat iedereen gelezen en getekend heeft', 'Een poster in de kantine met de nieuwe werkwijze en de behaalde resultaten', 'Korte wekelijkse checks door de leidinggevende en een maandelijkse KPI-review'],
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
    {
      id: 'pm.land.lsw',
      title: 'Leiderstandaardwerk en de gembawalk',
      pre: [
        {
          q: 'Waarvoor loopt een leidinggevende in Lean een vaste ronde over de vloer?',
          options: ['Om te controleren welke operators hun werk niet goed doen, en dat te noteren', 'Om zichtbaar te zijn, zodat mensen weten dat de baas oplet wat ze doen', 'Om de productiecijfers van gisteren op te halen voor zijn eigen ochtendrapport', 'Om te zien of het proces volgens de standaard loopt en te helpen waar het knelt'],
          answer: 'Om te zien of het proces volgens de standaard loopt en te helpen waar het knelt',
          why: 'De ronde gaat over het proces, niet over het betrappen van mensen. Wat afwijkt, is een signaal om te helpen.',
        },
      ],
      teach: [
        'Na de overdracht moet iemand elke dag aandacht geven aan de nieuwe manier. Dat regel je met leiderstandaardwerk (leader standard work): een vaste lijst van wat een leidinggevende dagelijks en wekelijks doet om het proces te checken. Bijvoorbeeld: om 6:10 de dagstart, om 9:00 het bord bekijken, op dinsdag de vaardigheidsmatrix.\n\nDavid Mann beschrijft het in Creating a Lean Culture (2005) als het eerste van vier elementen van een Lean-managementsysteem.',
        'De andere drie elementen van Mann: visuele sturing (visual controls), vaak visueel management genoemd, borden en markeringen die in één oogopslag laten zien of het werk op schema ligt; dagelijkse verantwoording (daily accountability), korte overleggen waarin acties worden afgesproken en nagelopen; en leiderschapsdiscipline, dat leidinggevenden dit volhouden, ook in drukke weken.\n\nZonder dat laatste valt de rest om. Daarom is borgen vooral gedrag van leidinggevenden, niet van operators.',
        'Hoeveel tijd? Een grove verdeling die vaak uit het boek van Mann wordt geciteerd: een teamleider besteedt ongeveer 80% van zijn dienst aan standaardwerk, een afdelingsleider ongeveer 50%, een value stream manager rond 25%. Hoe hoger, hoe meer tijd voor verbeteren en plannen.\n\nDat zijn richtgetallen, die bronnen net iets verschillend citeren, geen norm. In de praktijk haal je ze lang niet altijd, maar ze laten zien dat standaardwerk niet alleen voor de vloer is.',
        'Een vast onderdeel is de gembawalk (gemba walk). Gemba is Japans voor “de plek waar het gebeurt”: de werkvloer. De leidinggevende loopt een vaste route, kijkt naar het proces en stelt vragen: “Wat is de standaard hier? Hoe zie je dat het goed gaat? Wat houdt je tegen?”\n\nHij lost niet alles zelf op en deelt geen preken uit. Wat hij ziet, gaat naar het actiebord, met een eigenaar en een datum.',
        'Wat vaak misgaat: leiderstandaardwerk wordt een afvinklijst die op vrijdag in één keer wordt ingevuld. Of de leidinggevende schrapt de gembawalk zodra er een crisis is, precies wanneer hij het meest nodig is.\n\nExperts discussiëren of je het streng moet afdwingen of moet laten groeien. Begin klein: drie vaste punten die echt gebeuren zijn beter dan vijftien die op papier staan. Scherpe vraag: “Wat heb je vandaag op je ronde gezien dat je niet verwachtte?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een verpakkingsbedrijf draag je de nieuwe stopregistratie over aan afdelingsleider Petra. Samen maak je haar leiderstandaardwerk op één kaart.\n\nDagelijks: 7:30 dagstart bij het bord van lijn 1 en 2 (15 minuten); 8:00 gembawalk langs beide lijnen, met drie vaste vragen (30 minuten); 13:00 check of de acties van de ochtend zijn opgepakt.\nWekelijks: maandag de top drie stops met onderhoud, donderdag één operator volgen bij een omstelling.\n\nDe eerste twee weken loop je mee, daarna loopt zij alleen en kijk jij op vrijdag haar kaart met haar door: wat ging, wat schoot erbij in, en waarom. In week 3 schrapt ze de donderdag niet maar verschuift hem; dat is precies de discipline die je wilt zien.',
      },
      said: 'Wat je hoort in projecten: “Ik heb geen tijd om rondjes te lopen. Ik zit de hele dag in overleggen.”',
      recall: [
        {
          q: 'Een afdelingsleider werkt een dienst van 480 minuten. Neem de grove verdeling die van Mann geciteerd wordt voor deze laag. Daarvan gaan 30 minuten naar de dagstart en 60 minuten naar de gembawalk. Hoeveel minuten standaardwerk blijven over voor zijn andere vaste checks?',
          number: 150,
          tolerance: 1,
          unit: 'min',
          hint: 'Neem eerst het aandeel van een afdelingsleider van de dienst (ongeveer de helft), en trek dan de vaste blokken eraf.',
          why: '50% van 480 = 240 minuten; 240 − 30 − 60 = 150 minuten.',
        },
        {
          q: 'Welk element van Mann houdt de andere drie overeind?',
          options: ['Visueel management op elke lijn en op elke kantoormuur', 'Leiderschapsdiscipline: het volhouden, ook in drukke weken', 'Een digitaal dashboard met realtime cijfers voor alle lagen', 'Een jaarlijkse audit van het hele systeem door het hoofdkantoor'],
          answer: 'Leiderschapsdiscipline: het volhouden, ook in drukke weken',
          why: 'Borden en overleggen werken alleen zolang leidinggevenden ze blijven gebruiken.',
        },
        {
          q: 'Wat doet een leidinggevende op een goede gembawalk?',
          options: ['Hij noteert welke operators niet volgens de standaard werken', 'Hij lost de problemen die hij ziet meteen zelf op', 'Hij kijkt naar het proces, stelt vragen en zet acties op het bord', 'Hij haalt de cijfers op en bespreekt ze later op kantoor'],
          answer: 'Hij kijkt naar het proces, stelt vragen en zet acties op het bord',
          why: 'Kijken en vragen helpt het team zelf problemen te zien; acties met een eigenaar zorgen dat er iets gebeurt.',
        },
        {
          q: 'Een leidinggevende vult zijn leiderstandaardwerk elke vrijdag in één keer in. Wat doe je?',
          options: ['Samen terugbrengen naar een paar punten die hij echt elke dag doet', 'Het melden bij zijn manager, want afspraak is afspraak', 'Een digitale app invoeren die elke check met tijdstempel vastlegt', 'Het accepteren, zolang de kaart elke week compleet is'],
          answer: 'Samen terugbrengen naar een paar punten die hij echt elke dag doet',
          why: 'Een lijst die niet past bij zijn werkdag wordt papierwerk; klein en echt is beter dan groot en gefaket.',
        },
      ],
      situation: {
        scene: 'Bij een levensmiddelenfabriek zit de productiemanager, Erik, de hele dag in overleggen. Je project heeft dagelijkse borden op de lijnen gezet, maar Erik is er in drie weken niet één keer geweest. De teamleiders merken het: “Als Erik het niet belangrijk vindt, waarom wij dan?”',
        ask: 'Hoe breng je dit bij Erik ter sprake, en wat stel je voor?',
        model: '“Erik, de borden werken, maar de teamleiders kijken naar jou. Ze zien je er niet, dus ze denken dat het niet telt. Ik stel voor: drie keer per week twintig minuten langs twee borden, met één vraag per bord: ‘Wat houdt jullie tegen?’ De eerste twee keer loop ik mee. Welke overleggen kunnen daarvoor korter?”',
        rubric: [
          'Benoemt eerlijk het effect van zijn afwezigheid op de teamleiders',
          'Stelt een klein, haalbaar ritme voor met één concrete vraag',
          'Helpt hem tijd vrij te maken in plaats van alleen meer te vragen',
        ],
        pushback: {
          lines: [
            '“Ik stuur op de cijfers. Die krijg ik elke ochtend in mijn mail. Waarom zou ik daarvoor de vloer op moeten?”',
            '“Als ik daar ga staan, voelen de teamleiders zich gecontroleerd.”',
          ],
          model: '“De cijfers vertellen je wat er gisteren misging, niet waarom. Op de vloer zie je het waarom, en de teamleiders zien dat jij het belangrijk vindt. Gecontroleerd voelen ze zich als je komt om fouten te zoeken. Kom je vragen wat ze tegenhoudt en los je daarvan iets op, dan gaan ze juist op je wachten.”',
          rubric: [
            'Erkent de waarde van de cijfers',
            'Legt uit wat de vloer toevoegt aan de cijfers',
            'Maakt het verschil tussen controleren en helpen concreet',
          ],
        },
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit waarom resultaten alleen blijven als leidinggevenden zelf vast standaardwerk hebben.',
      terms: [
        { term: 'Leiderstandaardwerk', def: 'Een vaste lijst van wat een leidinggevende dagelijks en wekelijks doet om het proces te checken en te helpen.' },
        { term: 'Visueel management', def: 'Borden en markeringen die in één oogopslag laten zien of het werk op schema en volgens de standaard loopt.' },
        { term: 'Dagelijkse verantwoording', def: 'Korte, vaste overleggen waarin acties worden afgesproken en nagelopen.' },
        { term: 'Gemba', def: 'Japans voor de plek waar het werk gebeurt: de werkvloer.' },
        { term: 'Gembawalk', def: 'Een vaste ronde van een leidinggevende over de vloer om het proces te zien en vragen te stellen.' },
      ],
    },
    {
      id: 'pm.land.tiered',
      title: 'Getrapt overleg en escaleren',
      pre: [
        {
          q: 'Op het bord van de dagstart staat al drie weken hetzelfde probleem met materiaal. Wat zegt dat over het overlegsysteem?',
          options: ['Dat het team het probleem niet serieus genoeg neemt om het op te lossen', 'Dat het bord te weinig ruimte heeft voor nieuwe problemen van de ploeg', 'Dat problemen die het team niet zelf kan oplossen niet naar boven gaan', 'Dat de dagstart te kort is om zo’n probleem goed te bespreken'],
          answer: 'Dat problemen die het team niet zelf kan oplossen niet naar boven gaan',
          why: 'Een dagstart is er voor wat het team zelf kan doen; de rest moet snel een laag hoger komen, met een antwoord terug.',
        },
      ],
      teach: [
        'Getrapt overleg (tiered meetings) is een reeks korte, staande overleggen die elke ochtend op elkaar volgen. Tier 1: het team bij zijn bord aan het begin van de dienst, de dagstart (start-of-shift meeting), 10 tot 15 minuten. Tier 2: de teamleiders met hun afdelingsleider. Tier 3: de afdelingsleiders met de plantmanager.\n\nIn veel fabrieken is de hele trap voor 10 uur ’s ochtends klaar. De precieze tijden verschillen; de volgorde, van onder naar boven, niet.',
        'Elk niveau kijkt naar een KPI-bord: een whiteboard of scherm met een paar kerncijfers van gisteren en vandaag, vaak rood of groen gekleurd. Veel bedrijven gebruiken de vier letters SQDC: Safety, Quality, Delivery, Cost (veiligheid, kwaliteit, levering, kosten).\n\nHet bord laat zien wat afwijkt; het overleg gaat alleen over de rode vakjes. Groen hoeft niet besproken te worden. Zo blijft een dagstart kort.',
        'Het hart van het systeem is de escalatieregel (escalation rule): een afspraak wanneer een probleem een laag omhoog gaat. Bijvoorbeeld: alles wat het team niet binnen 24 uur zelf kan oplossen, of wat een andere afdeling nodig heeft, gaat naar tier 2 dezelfde ochtend.\n\nEven belangrijk is de weg terug: het antwoord moet de volgende dag op het teambord staan. Anders leert het team dat melden geen zin heeft.',
        'Getrapt overleg verbindt ook de lagen. De plantmanager hoort om 9:30 welke problemen er om 6:15 op de vloer speelden, en kan meteen middelen inzetten. In een fabriek zonder trap hoort hij dat soms pas in het maandrapport.\n\nHet is de praktische vorm van de dagelijkse verantwoording uit het vorige niveau: korte overleggen met acties, eigenaren en datums die je de volgende dag naloopt.',
        'Wat vaak misgaat: het overleg wordt een rapportageronde waarin iedereen zijn cijfers voorleest, en het duurt 45 minuten. Of de escalatie werkt alleen naar boven, en er komt nooit iets terug.\n\nExperts verschillen over hoeveel tiers zinvol zijn. In een kleine fabriek zijn twee lagen vaak genoeg; vier lagen maken het traag. Scherpe vraag aan de afdelingsleider: “Welk probleem uit de dagstart van gisteren heb jij vandaag opgelost?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een kabelfabrikant draait sinds een maand getrapt overleg. Tier 1 om 6:15 bij elke lijn, tier 2 om 8:30 bij de afdelingsleider, tier 3 om 9:30 bij de plantmanager. De escalatieregel: wat het team niet binnen 24 uur zelf oplost, of wat een andere afdeling nodig heeft, gaat dezelfde ochtend naar tier 2.\n\nMaandag meldt lijn 2 in tier 1: de koperdraad van een nieuwe leverancier breekt vaker, al drie keer dit weekend. Het team kan de leverancier niet zelf aanspreken. Woensdag staat het nog op het bord van lijn 2, en niemand weet of iemand er iets mee doet.',
        ask: 'Hoe had dit door de trap moeten lopen, en wat moet je nu aanpassen?',
        reveal: 'Maandag om 6:15 had de teamleider het rood op het bord gezet en het om 8:30 in tier 2 ingebracht, want het team kan het niet zelf oplossen en inkoop is nodig. De afdelingsleider had het om 9:30 in tier 3 gebracht, waar de plantmanager inkoop een actie geeft, met een datum. Dinsdag om 6:15 had op het bord van lijn 2 gestaan: inkoop belt de leverancier vandaag, monsters naar kwaliteit.\n\nNu: check waar het stokte, waarschijnlijk tussen tier 1 en tier 2, en voeg een vaste vraag toe aan tier 2: “Welke rode punten van de teams moeten hier vandaag naartoe?” En het antwoord gaat altijd terug naar het teambord.',
      },
      said: 'Wat je hoort in projecten: “Ik heb het al drie keer gemeld op de dagstart. Er gebeurt toch niks mee.”',
      recall: [
        {
          q: 'Wat is de goede volgorde van een getrapt overleg in de ochtend?',
          options: ['Eerst het team op de vloer, dan de teamleiders, dan het management', 'Eerst het management, dan de teamleiders, dan het team op de vloer', 'Alle lagen tegelijk in één overleg, zodat iedereen alles hoort', 'Het team en het management op hetzelfde moment, apart van elkaar'],
          answer: 'Eerst het team op de vloer, dan de teamleiders, dan het management',
          why: 'Problemen ontstaan op de vloer; zo komen ze dezelfde ochtend bij wie er middelen voor heeft.',
        },
        {
          q: 'Waarom bespreekt een dagstart alleen de rode vakjes op het KPI-bord?',
          options: ['Omdat groene cijfers niet betrouwbaar gemeten worden', 'Omdat het team zich anders te veel op successen richt', 'Omdat het management de groene cijfers al in het rapport ziet', 'Omdat het overleg kort moet blijven en over afwijkingen moet gaan'],
          answer: 'Omdat het overleg kort moet blijven en over afwijkingen moet gaan',
          why: 'Groen loopt volgens plan; aandacht hoort bij wat afwijkt.',
        },
        {
          q: 'Wat maakt een escalatieregel compleet?',
          options: ['Een lijst met telefoonnummers van alle managers', 'Wanneer het omhoog gaat, en dat het antwoord terugkomt op het teambord', 'Een maximum aan het aantal problemen dat het team per week mag melden', 'Dat elke escalatie schriftelijk door de afdelingsleider wordt goedgekeurd'],
          answer: 'Wanneer het omhoog gaat, en dat het antwoord terugkomt op het teambord',
          why: 'Zonder weg terug leert het team dat melden geen zin heeft.',
        },
        {
          q: 'De dagstart duurt inmiddels 45 minuten en iedereen leest zijn cijfers voor. Wat stel je voor?',
          options: ['Het overleg naar één keer per week verplaatsen, maar dan wat langer', 'Een digitaal dashboard, zodat het voorlezen van cijfers niet meer hoeft', 'Terug naar 15 minuten, alleen rode punten, met actie, eigenaar en datum', 'De teamleider vragen het overleg voortaan alleen en sneller te leiden'],
          answer: 'Terug naar 15 minuten, alleen rode punten, met actie, eigenaar en datum',
          why: 'Een dagstart is een stuurmoment, geen rapportage. Kort, op afwijkingen en met acties.',
        },
      ],
      situation: {
        scene: 'Bij een netbeheerder, het bedrijf achter het regionale stroomnet, wil de manager uitvoering een getrapt overleg invoeren voor de monteursploegen, met vier lagen. De ploegen beginnen om 7:00 op verschillende locaties. Hij vraagt jou het ontwerp te maken.',
        ask: 'Wat vraag je eerst, en wat stel je voor?',
        model: 'Ik vraag eerst welke problemen nu blijven liggen en wie ze kan oplossen. Dan stel ik voor met twee of drie lagen te beginnen, niet vier: de ploeg om 7:00 kort bij de bus of het bord, de teamleiders om 8:30 met de planning erbij, en de manager om 9:15. Met een escalatieregel en de afspraak dat elk antwoord de volgende ochtend terug bij de ploeg is.',
        rubric: [
          'Begint bij de problemen die nu blijven liggen',
          'Houdt het aantal lagen klein en past het aan de werkdag van de ploegen aan',
          'Legt een escalatieregel en de weg terug vast',
        ],
        pushback: {
          lines: [
            '“Vier lagen hebben ze bij de vorige netbeheerder waar ik werkte ook. Dat is best practice.”',
            '“De ploegen zitten verspreid. Een bord op elke locatie is te veel gedoe; laten we het via Teams doen.”',
          ],
          model: '“Kan goed werken daar. Bij jullie is de vraag of een probleem van 7:00 om 10:00 al bij jou is. Met vier lagen wordt dat lastig. Laten we met drie beginnen en na zes weken kijken. Teams kan voor de verste ploegen, maar een vast bord op de hoofdlocatie houdt het zichtbaar voor iedereen.”',
          rubric: [
            'Erkent zijn ervaring zonder het over te nemen',
            'Toetst het ontwerp aan de snelheid van escaleren',
            'Stelt een proef met evaluatie voor en een praktische mix voor verspreide ploegen',
          ],
        },
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit hoe getrapt overleg ervoor zorgt dat een probleem van 6 uur ’s ochtends voor 10 uur bij hem is.',
      terms: [
        { term: 'Getrapt overleg', def: 'Een reeks korte overleggen die elke ochtend op elkaar volgen, van het team op de vloer tot het management.' },
        { term: 'Dagstart', def: 'Het korte staande overleg van een team bij zijn bord aan het begin van de dienst.' },
        { term: 'KPI-bord', def: 'Een bord of scherm met een paar kerncijfers, vaak rood of groen, waar het overleg bij staat.' },
        { term: 'Escalatieregel', def: 'De afspraak wanneer een probleem een laag omhoog gaat, en hoe het antwoord terugkomt.' },
      ],
    },
    {
      id: 'pm.land.audits',
      title: 'Audits die echt iets vangen',
      pre: [
        {
          q: 'De gelaagde procesaudits op een lijn scoren al vier maanden 100% groen, maar de afkeur stijgt. Wat is de meest waarschijnlijke verklaring?',
          options: ['De lijn heeft pech gehad met een slechte batch grondstof', 'De auditvragen zijn te makkelijk of de auditors kijken niet echt', 'De afkeur wordt anders gemeten dan voorheen', 'De operators werken correct, maar de standaard is te streng'],
          answer: 'De auditvragen zijn te makkelijk of de auditors kijken niet echt',
          why: 'Een audit die nooit iets vindt terwijl het resultaat slechter wordt, meet niet wat ertoe doet.',
        },
      ],
      teach: [
        'De gelaagde procesaudit kwam je al tegen bij het vasthouden van resultaten. Nu het ontwerp. De auto-industrie legde het vast in CQI-8, een richtlijn van de AIAG, de Amerikaanse brancheorganisatie van autofabrikanten en toeleveranciers.\n\nVolgens samenvattingen van die richtlijn laat CQI-8 de frequentie en de vragen aan het bedrijf zelf over, op basis van risico. Lagere lagen auditen vaak en in detail, hogere lagen minder vaak en breder.',
        'De auditvraag (audit question) is het hart. Een goede vraag gaat over een kernpunt dat ertoe doet: een stap waar het eerder misging, een punt uit de risicoanalyse of het controleplan (control plan). Ze is met ja of nee te beantwoorden door te kijken: “Staat de momentsleutel op 25 Nm en is hij deze week gekalibreerd?”\n\nHoud een audit kort, vaak vijf tot tien vragen en zo’n tien minuten. Roteer vragen, zodat mensen niet alleen op de bekende vragen letten.',
        'Vindt de auditor een afwijking, dan is de eerste stap direct herstellen (fix on the spot): het onderdeel apart zetten, de operator de goede manier laten zien, en het noteren. Wat niet ter plekke kan, gaat naar het actiebord met een eigenaar.\n\nMeet twee dingen: de uitvoeringsgraad (completion rate), het aandeel geplande audits dat echt gedaan is, en wat de audits vinden. Komt dezelfde afwijking steeds terug, dan zit het probleem in het proces, niet bij de operator.',
        'Pas op voor auditmoeheid (audit fatigue): na een paar maanden worden audits een ritueel. Auditors vinken af vanaf hun bureau, vragen zijn zo bekend dat ze altijd groen zijn, en niemand doet iets met de uitkomst.\n\nSignalen: een uitvoeringsgraad van 100% met nul bevindingen, audits die altijd op hetzelfde tijdstip gebeuren, of een stijgende afkeur bij groene audits. Ververs dan de vragen en laat een hogere laag eens meelopen.',
        'Experts twisten over scoren. Sommigen geven elke lijn een percentage en hangen ranglijsten op; anderen zeggen dat dat precies leidt tot gunstig invullen, en kijken liever naar welke bevindingen zijn opgelost.\n\nEen audit gaat over het proces, niet over het beoordelen van mensen. Zeg dat er bij de start bij, en gedraag je ernaar. Scherpe vraag aan de kwaliteitsmanager: “Welke audit heeft de afgelopen maand iets gevonden waar we iets aan veranderd hebben?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een metaalbedrijf lopen sinds een halfjaar gelaagde procesaudits op de laslijn. Teamleiders doen ze dagelijks, afdelingsleiders wekelijks, de plantmanager maandelijks. Het overzicht: uitvoeringsgraad 98%, en 97% van de antwoorden groen. Tegelijk stijgt het aantal klachten over lasnaden van 2 naar 6 per maand. De tien vragen zijn sinds de start niet veranderd; drie gaan over orde en netheid, geen enkele over de lasparameters.',
        ask: 'Wat zie je hier, en hoe zou jij de audit opnieuw inrichten?',
        reveal: 'Auditmoeheid en verkeerde vragen: de audit meet wat makkelijk te zien is, niet wat de klachten veroorzaakt. Haal met de kwaliteitsengineer de kernpunten uit de klachten en het controleplan, zoals de stroomsterkte, de draadsnelheid en het voorverwarmen, en maak daar vragen van die je door te kijken kunt beantwoorden.\n\nRoteer: een vaste kern van vijf vragen plus wisselende. Laat de plantmanager de eerste maand twee keer meelopen. En rapporteer voortaan niet alleen het groenpercentage, maar ook de bevindingen en wat ermee gedaan is.',
      },
      said: 'Wat je hoort in projecten: “De audits zijn allemaal groen. Het probleem moet dus ergens anders zitten.”',
      recall: [
        {
          q: 'Wat maakt een auditvraag goed?',
          options: ['Hij is zo algemeen geformuleerd dat hij op elke lijn in de fabriek past', 'Hij vraagt de operator of hij de standaard uit zijn hoofd kent', 'Hij wordt eens per jaar door de kwaliteitsafdeling alleen opgesteld', 'Hij gaat over een kernpunt dat ertoe doet en is met kijken te beantwoorden'],
          answer: 'Hij gaat over een kernpunt dat ertoe doet en is met kijken te beantwoorden',
          why: 'Zien is betrouwbaarder dan vragen, en een kernpunt raakt wat echt misgaat.',
        },
        {
          q: 'Een afdeling heeft 4 teamleiders die elke werkdag één audit doen, 3 afdelingsleiders die elke week één audit doen, en een plantmanager die twee keer per maand audit. Reken met 21 werkdagen en 4 weken per maand. Hoeveel audits zijn dat per maand?',
          number: 98,
          tolerance: 0.5,
          unit: 'audits',
          hint: 'Reken per laag: aantal mensen maal hoe vaak per maand. Tel de drie lagen op.',
          why: '4 × 21 = 84; 3 × 4 = 12; 1 × 2 = 2; 84 + 12 + 2 = 98 audits.',
        },
        {
          q: 'Een auditor ziet dat een operator een stap overslaat. Wat is de eerste stap?',
          options: ['Het noteren en aan het eind van de dag doorgeven aan de afdelingsleider', 'Een herhaaltraining voor de hele ploeg in de volgende week inplannen', 'Direct herstellen: het onderdeel apart en de goede manier laten zien', 'De operator om een schriftelijke verklaring over het voorval vragen'],
          answer: 'Direct herstellen: het onderdeel apart en de goede manier laten zien',
          why: 'Eerst het risico wegnemen en het goed laten doen, dan noteren en kijken of het vaker gebeurt.',
        },
        {
          q: 'Welk signaal wijst het sterkst op auditmoeheid?',
          options: ['Een uitvoeringsgraad van bijna 100% met maandenlang geen bevindingen', 'Een paar gemiste audits tijdens de zomervakantie en de kerstperiode', 'Een audit die een nieuwe afwijking vindt op een belangrijk kernpunt', 'Een hogere laag die voor het eerst een audit meeloopt op de vloer'],
          answer: 'Een uitvoeringsgraad van bijna 100% met maandenlang geen bevindingen',
          why: 'Elk proces wijkt soms af. Nooit iets vinden betekent meestal dat er niet echt gekeken wordt.',
        },
      ],
      situation: {
        scene: 'Bij een kunststoffabriek heeft de klant, een autotoeleverancier, gelaagde procesaudits geëist. De kwaliteitsmanager heeft een lijst van 30 vragen gemaakt die elke teamleider dagelijks moet doorlopen. Na twee weken zijn de teamleiders er klaar mee: “Dit kost me drie kwartier per dag.”',
        ask: 'Wat stel je voor?',
        model: 'Ik zou met de kwaliteitsmanager en twee teamleiders de 30 vragen doorlopen en per vraag kijken: gaat dit over een kernpunt waar het eerder misging of dat in het controleplan staat? Dat levert er misschien acht op. Teamleiders doen die dagelijks in tien minuten; de rest roteert of gaat naar de wekelijkse laag. En we rapporteren niet alleen groen, maar ook wat er gevonden en opgelost is.',
        rubric: [
          'Neemt de werkdruk van de teamleiders serieus',
          'Brengt de vragen terug naar kernpunten met risico',
          'Verdeelt vragen over lagen en kijkt naar bevindingen, niet alleen naar groen',
        ],
        pushback: {
          lines: [
            '“De klant wil zien dat we alles afdekken. Minder vragen is een risico bij hun audit.”',
            '“Als ik vragen schrap en er gaat daar iets mis, ben ik de klos.”',
          ],
          model: '“Begrijpelijk. Maar dertig vragen die in drie kwartier worden afgevinkt, dekken minder af dan acht die echt bekeken worden. CQI-8 laat de vragen volgens samenvattingen aan ons over, op basis van risico. We leggen per geschrapte vraag vast waarom, en de rest komt in de wekelijkse audit. Dan kun je de klant laten zien hoe we kozen.”',
          rubric: [
            'Erkent de eis van de klant en zijn persoonlijke risico',
            'Laat zien dat minder maar betere vragen meer afdekken',
            'Stelt voor de keuzes te onderbouwen en vast te leggen',
          ],
        },
      },
      sayIt: 'Leg een kwaliteitsmanager in 60 seconden uit waarom een audit die altijd groen is een slecht teken kan zijn.',
      terms: [
        { term: 'CQI-8', def: 'De richtlijn van de AIAG, de Amerikaanse auto-branchevereniging, voor gelaagde procesaudits.' },
        { term: 'Auditvraag', def: 'Een korte vraag over een kernpunt die de auditor door te kijken met ja of nee kan beantwoorden.' },
        { term: 'Direct herstellen', def: 'Een afwijking die de auditor ziet meteen corrigeren en noteren, voordat hij verder gaat.' },
        { term: 'Uitvoeringsgraad', def: 'Het aandeel geplande audits dat echt gedaan is.' },
        { term: 'Auditmoeheid', def: 'Dat audits na een tijd een ritueel worden: afvinken zonder te kijken, altijd groen, geen actie.' },
      ],
    },
    // Onderwerp 4: baten en reflectie
    {
      id: 'pm.land.benefits',
      title: 'Baten: van opleveren naar opbrengen',
      pre: [
        {
          q: 'Je project heeft een nieuw omstelproces opgeleverd: standaardwerk, een omstelkar en getrainde operators. Is daarmee de baat gerealiseerd?',
          options: ['Nee, de baat is de meetbare winst, zoals kortere omsteltijden', 'Ja, want alles wat in de scope stond is opgeleverd en getekend', 'Ja, zodra de operators het nieuwe proces één keer goed hebben gedaan', 'Nee, de baat telt pas als de klant er een hogere prijs voor betaalt'],
          answer: 'Nee, de baat is de meetbare winst, zoals kortere omsteltijden',
          why: 'Wat je oplevert, is een middel. De baat is de meetbare verbetering die de organisatie er daarna mee haalt.',
        },
      ],
      teach: [
        'Batenrealisatie (benefits realisation) is het werk om ervoor te zorgen dat de verbetering die een project belooft er na de oplevering ook echt komt. Het begrip komt uit het programmamanagement, onder meer van Gerald Bradley, die er in 2006 een boek over schreef.\n\nEen simpele keten helpt: output, uitkomst, baat. Output is wat het project oplevert: een standaard, een bord, een training. Op zichzelf levert dat nog niks op.',
        'De uitkomst (outcome) is dat mensen anders werken: de omstellingen volgen de standaard, het team houdt elke ochtend een dagstart. De baat (benefit) is de meetbare verbetering die de organisatie daarvan heeft: 30% kortere omsteltijd, 2 procentpunt minder afkeur, € 40.000 per jaar.\n\nElke baat heeft een nulmeting (baseline) nodig, de stand van voor het project, en een afgesproken manier en moment van meten. Hoe je een echt effect van ruis onderscheidt, staat in Afsluiten: resultaat aantonen; hier gaat het om wie blijft meten als jij weg bent.',
        'Baten komen meestal na de livegang en groeien langzaam. Een nieuwe omstelmethode is in week één nog onwennig; pas na een paar maanden zie je de volle winst. Daarom is batenrealisatie vaak werk voor na het project.\n\nDe baateigenaar (benefit owner) is degene in de lijn die verantwoordelijk is dat de baat binnenkomt. Meestal de sponsor of de manager van het proces, nooit de consultant. Jij bent straks weg; de baat moet blijven.',
        'Leg per baat vast: wat het is, hoe je het meet, de nulmeting, het doel, wanneer je het verwacht, en wie de eigenaar is. Eén regel per baat in een tabel is genoeg.\n\nDit sluit aan bij Lean: in een A3, het probleemoplosblad op één A3-vel, staan het doel en de check ook vooraf. Je weet dan vooraf wat succes is, en niet pas als je achteraf het mooiste cijfer zoekt.',
        'Wat vaak misgaat: alle aandacht gaat naar de oplevering, en niemand meet een halfjaar later of de baat er is. Of het project claimt een besparing die eigenlijk door hogere volumes komt.\n\nExperts twisten of je baten in euro’s moet uitdrukken. Financiële mensen willen dat; anderen zeggen dat veiligheid of kwaliteit ook baten zijn, ook als het bedrag lastig is. Scherpe vraag aan de sponsor: “Aan welk getal zie jij over zes maanden dat dit project het waard was?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een verpakkingsbedrijf heeft je project een nieuwe instelprocedure voor de sealmachines opgeleverd.\n\nOutput: de procedure, een instelkaart per product en tien getrainde operators.\nUitkomst: elke omstelling volgt de kaart; de teamleider checkt het bij zijn ronde.\nBaat: minder afkeur. Nulmeting over drie maanden: 4,0% van 6.000.000 verpakkingen per jaar. Doel: 2,5%.\n\nReken de verwachte baat uit als het doel gehaald wordt: 4,0% − 2,5% = 1,5 procentpunt. 1,5% van 6.000.000 = 90.000 verpakkingen minder afkeur per jaar. Materiaal kost € 0,30 per stuk: 90.000 × € 0,30 = € 27.000 per jaar.\n\nBaateigenaar: de productiemanager. Meetmoment: na drie en na zes maanden, in het maandrapport.',
      },
      said: 'Wat je hoort in projecten: “Het project is af, alles is opgeleverd. Wat er daarna gebeurt, is niet meer ons probleem.”',
      recall: [
        {
          q: 'Een lijn maakt 3.000.000 stuks per jaar. De afkeur daalt van 5% naar 3%, en elk afgekeurd stuk kost € 0,40 aan materiaal. Wat is de jaarlijkse baat in euro’s?',
          number: 24000,
          tolerance: 10,
          unit: '€',
          hint: 'Reken eerst uit hoeveel stuks afkeur er per jaar minder zijn.',
          why: '5% − 3% = 2 procentpunt; 2% van 3.000.000 = 60.000 stuks; 60.000 × € 0,40 = € 24.000 per jaar.',
        },
        {
          q: 'Welke is een uitkomst, en geen output of baat?',
          options: ['De nieuwe omstelkar die het project voor lijn 2 heeft gebouwd', 'Een besparing van € 30.000 per jaar op afgekeurd materiaal', 'De training die alle operators vorige maand hebben gevolgd', 'Dat de operators elke omstelling volgens de nieuwe standaard doen'],
          answer: 'Dat de operators elke omstelling volgens de nieuwe standaard doen',
          why: 'Een uitkomst is ander gedrag. De kar en de training zijn output; de besparing is de baat.',
        },
        {
          q: 'Wie hoort baateigenaar te zijn?',
          options: ['De consultant die het project heeft geleid', 'De sponsor of manager in de lijn die het proces stuurt', 'De controller, omdat die de cijfers bijhoudt', 'De stuurgroep als geheel, zodat het breed gedragen is'],
          answer: 'De sponsor of manager in de lijn die het proces stuurt',
          why: 'Baten komen vaak pas na het project; iemand die blijft, moet erop sturen.',
        },
        {
          q: 'Waarom leg je de nulmeting vast voordat het project begint?',
          options: ['Omdat de controller dat verplicht stelt voor elk project', 'Omdat het project anders niet goedgekeurd wordt door de stuurgroep', 'Omdat je anders achteraf niet kunt laten zien wat het project opleverde', 'Omdat de operators dan weten hoe slecht het proces was'],
          answer: 'Omdat je anders achteraf niet kunt laten zien wat het project opleverde',
          why: 'Zonder vertrekpunt is elke claim een mening.',
        },
      ],
      situation: {
        scene: 'Bij een levensmiddelenfabriek is je project bijna klaar: een nieuwe planning met vaste productiewielen. De sponsor, de operations director, wil in de stuurgroep zeggen dat het project “€ 200.000 per jaar” oplevert. Dat getal komt uit het oorspronkelijke voorstel; gemeten is er nog niks, en de nieuwe planning draait pas twee weken.',
        ask: 'Wat zeg je tegen de sponsor?',
        model: '“Ik snap dat je het getal wilt noemen. Maar het komt uit het voorstel en we hebben het nog niet gemeten; als iemand doorvraagt, staat het project zwak. Mijn voorstel: noem wat er opgeleverd is, de uitkomst die we al zien, en dat we de baat na drie en zes maanden meten tegen de nulmeting. Wie wordt daar eigenaar van, jij of de planningsmanager?”',
        rubric: [
          'Is eerlijk dat het getal nog niet gemeten is',
          'Stelt voor output, uitkomst en baat apart te benoemen',
          'Spreekt meetmomenten en een baateigenaar af',
        ],
        pushback: {
          lines: [
            '“De stuurgroep wil een getal horen. Zonder getal lijkt het alsof het project niks oplevert.”',
            '“Het staat in het voorstel dat ze zelf hebben goedgekeurd. Iedereen weet waar het vandaan komt.”',
          ],
          model: '“Een getal kun je noemen, als verwachting: ‘we verwachten rond de € 200.000, de eerste meting is in maart’. Dan klopt het, en in maart kun je het bewijzen. Als we nu zeggen dat het al oplevert en de meting valt lager uit, kost dat jou geloofwaardigheid.”',
          rubric: [
            'Erkent de behoefte aan een getal',
            'Maakt van de claim een verwachting met een meetdatum',
            'Wijst op het risico voor de sponsor zelf',
          ],
        },
      },
      sayIt: 'Leg een sponsor in 60 seconden uit wat het verschil is tussen output, uitkomst en baat, en waarom dat ertoe doet.',
      terms: [
        { term: 'Batenrealisatie', def: 'Het werk om te zorgen dat de beloofde verbetering na de oplevering echt binnenkomt.' },
        { term: 'Output', def: 'Wat een project oplevert: een standaard, een bord, een training.' },
        { term: 'Uitkomst', def: 'Het andere gedrag dat de output mogelijk maakt: mensen werken echt op de nieuwe manier.' },
        { term: 'Baat', def: 'De meetbare verbetering die de organisatie haalt uit de uitkomst, bijvoorbeeld minder afkeur of euro’s per jaar.' },
        { term: 'Baateigenaar', def: 'De persoon in de lijn die verantwoordelijk is dat een baat binnenkomt; meestal de sponsor of procesmanager.' },
      ],
    },
    {
      id: 'pm.land.savings',
      title: 'Harde en zachte besparingen',
      pre: [
        {
          q: 'Na een SMED-project (snel omstellen) kan een pers 6 uur per week meer draaien, maar er is nu geen extra vraag. Wat is die winst financieel?',
          options: ['Een harde besparing, want de omsteltijd is echt korter geworden', 'Een kostenpost, want het project heeft geld en uren gekost', 'Een harde besparing, zodra de controller het getal heeft gezien', 'Vrijgespeelde capaciteit, die pas geld wordt als je hem gebruikt'],
          answer: 'Vrijgespeelde capaciteit, die pas geld wordt als je hem gebruikt',
          why: 'Uren die niemand nodig heeft, verlagen de kosten niet. Ze worden geld als je er meer mee verkoopt of kosten mee schrapt.',
        },
      ],
      teach: [
        'In Afsluiten zag je dat vrijgespeelde uren pas geld worden als er in de boeken iets verandert. Controllers maken hier een scherp onderscheid. Een harde besparing (hard savings) is geld dat echt niet meer uitgegeven wordt en zichtbaar is in de winst-en-verliesrekening (profit and loss account): minder materiaal weggegooid, minder overwerk betaald, een ingehuurde opslag opgezegd.\n\nEen zachte besparing (soft savings) is waardevol, maar niet direct te zien in de kosten. Vermeden kosten en vrijgespeelde capaciteit zijn de bekendste vormen.',
        'Vermeden kosten (cost avoidance): geld dat je niet hoeft uit te geven, zoals een tweede machine die je niet hoeft te kopen omdat de eerste nu genoeg kan. Echt geld, maar het staat nergens als daling in de kosten.\n\nVrijgespeelde capaciteit (freed capacity): uren van mensen of machines die vrijkomen. Die worden pas geld als je ze gebruikt: meer verkopen, overwerk stoppen, een uitzendkracht niet verlengen. Anders is het alleen ruimte.',
        'Laat elke besparing narekenen door de controller, de financiële man of vrouw die de cijfers van het bedrijf bewaakt. Die vraagt twee dingen. Terugkerend of eenmalig? Minder voorraad maakt één keer geld vrij; alleen de lagere voorraadkosten komen elk jaar terug. En vanaf wanneer? Stopt de zaterdagdienst in april, dan bespaar je dit jaar negen maanden; op jaarbasis (run rate), het volle jaarbedrag vanaf dan, is het twaalf.\n\nEen besparing die de controller heeft goedgekeurd, overleeft de stuurgroep; een uit je eigen spreadsheet wordt een discussie over aannames.',
        'Een Lean-principe hoort hier: verbeteren mag niet leiden tot ontslag van de mensen die verbeteren. Veel Lean-auteurs, onder wie James Womack en Daniel Jones in Lean Thinking (1996), raden aan dat vooraf te beloven. Wie zijn baan kwijtraakt door kaizen, doet nooit meer mee.\n\nVrijgespeelde mensen zet je dus in op groei, op vacatures die toch ontstaan, of in een verbeterteam. Het geld komt dan via groei of natuurlijk verloop, niet via ontslag.',
        'Wat vaak misgaat: een project telt vrijgespeelde uren maal een uurtarief op en noemt dat besparing. De controller ziet de kosten niet dalen, en het project verliest zijn geloofwaardigheid.\n\nExperts verschillen over zachte besparingen: sommigen tellen ze niet mee in het rendement van een project, anderen wel, apart vermeld. Wees open over welke soort je bedoelt. Scherpe vraag aan jezelf: “Welke kostenregel in het budget gaat hierdoor omlaag, en per wanneer?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een metaalbedrijf heeft een SMED-project, snel omstellen, de omsteltijd van de grote pers gehalveerd. Het project wil “€ 150.000 besparing” rapporteren. Je zet het met de controller uit elkaar.\n\nHard: de zaterdagdienst om achterstand in te halen is niet meer nodig. Vier operators × 8 uur × € 45 per uur = € 1.440 per zaterdag. Dat waren 40 zaterdagen per jaar: 40 × € 1.440 = € 57.600.\nVermeden kosten: de geplande tweede pers van € 400.000 is niet meer nodig. Echt geld, maar apart vermeld.\nVrijgespeelde capaciteit: nog 5 uur per week over op de pers. Geen geld tot verkoop er orders voor binnenhaalt.\n\nIn de stuurgroep: € 57.600 hard per jaar, een vermeden investering, en capaciteit voor groei.',
      },
      said: 'Wat je hoort in projecten: “Die vrijgekomen uren tellen we toch gewoon als besparing? Dat doet iedereen.”',
      recall: [
        {
          q: 'Een verbetering voorkomt dat je een tweede vorkheftruck moet aanschaffen. Wat voor besparing is dat?',
          options: ['Een harde besparing in de winst-en-verliesrekening van dit jaar', 'Vrijgespeelde capaciteit van het magazijnpersoneel', 'Vermeden kosten: echt geld, maar geen daling van de bestaande kosten', 'Geen besparing, omdat de heftruck nog niet gekocht was'],
          answer: 'Vermeden kosten: echt geld, maar geen daling van de bestaande kosten',
          why: 'Je geeft geld niet uit dat je anders wel had uitgegeven; de huidige kosten dalen niet.',
        },
        {
          q: 'Door een verbetering is de zaterdagdienst niet meer nodig. Die dienst had 3 operators die elk 6 uur werkten, tegen € 40 per uur, op 25 zaterdagen per jaar. Wat is de harde besparing per jaar?',
          number: 18000,
          tolerance: 10,
          unit: '€',
          hint: 'Reken eerst de kosten van één zaterdag uit.',
          why: '3 × 6 × € 40 = € 720 per zaterdag; 25 × € 720 = € 18.000 per jaar.',
        },
        {
          q: 'Waarom laat je elke besparing narekenen door de controller?',
          options: ['Zodat de besparing geloofwaardig is als iemand in de stuurgroep doorvraagt', 'Omdat de controller anders de factuur van de consultant niet betaalt', 'Omdat de wet dat eist voor elke kostenbesparing', 'Zodat de controller de besparing in zijn eigen budget kan opnemen'],
          answer: 'Zodat de besparing geloofwaardig is als iemand in de stuurgroep doorvraagt',
          why: 'Een getal dat de financiële kant heeft goedgekeurd, overleeft kritische vragen; een eigen spreadsheet niet.',
        },
        {
          q: 'Een kaizen maakt twee operators vrij. Wat past bij Lean?',
          options: ['Ze ontslaan, want dan is de besparing meteen hard', 'Ze inzetten op groei, open vacatures of een verbeterteam', 'Ze op hun plek laten, zodat de lijn reserve heeft', 'Ze naar een uitzendbureau laten gaan tot er weer werk is'],
          answer: 'Ze inzetten op groei, open vacatures of een verbeterteam',
          why: 'Wie door verbeteren zijn baan verliest, stopt met verbeteren. Het geld komt via groei of verloop.',
        },
      ],
      situation: {
        scene: 'Bij een kabelfabrikant heeft je team de doorlooptijd (lead time) van orders gehalveerd. De projectleider van de klant wil in het eindrapport zetten: “12 FTE vrijgespeeld, waarde € 720.000 per jaar.” FTE staat voor voltijdbanen (full-time equivalents). Er is niemand vertrokken, en de controller weet nog van niks.',
        ask: 'Wat zeg je tegen de projectleider?',
        model: '“Het is een mooie prestatie, en die capaciteit is echt. Maar als we het € 720.000 besparing noemen, vraagt de controller welke kosten dan gedaald zijn, en dat is nul. Laten we het splitsen: wat is hard, zoals minder overwerk of uitzendkrachten; wat is vrijgespeelde capaciteit voor groei. En laten we het samen met de controller narekenen voordat het in het rapport staat.”',
        rubric: [
          'Erkent de prestatie en de echte capaciteit',
          'Legt uit waarom vrijgespeelde uren geen harde besparing zijn',
          'Stelt voor te splitsen en met de controller na te rekenen',
        ],
        pushback: {
          lines: [
            '“Als we alleen het harde deel noemen, lijkt het project klein. De directie moet zien wat het waard is.”',
            '“Andere projecten rekenen ook zo. Waarom wij dan niet?”',
          ],
          model: '“De directie moet zien wat het waard is, daar ben ik het mee eens. Daarom wil ik het niet laten sneuvelen op de eerste vraag van de controller. We noemen het harde bedrag, en apart de capaciteit voor groei met wat die zou opleveren als verkoop hem vult. Dat is groot én het klopt.”',
          rubric: [
            'Deelt het doel om de waarde te laten zien',
            'Wijst op het risico van een getal dat niet klopt',
            'Stelt een eerlijke presentatie voor die de waarde toch laat zien',
          ],
        },
      },
      sayIt: 'Leg een projectleider in 60 seconden uit waarom vrijgespeelde uren nog geen besparing zijn, en wanneer ze dat wel worden.',
      terms: [
        { term: 'Harde besparing', def: 'Geld dat echt niet meer uitgegeven wordt en zichtbaar is in de winst-en-verliesrekening.' },
        { term: 'Zachte besparing', def: 'Een waardevolle verbetering die niet direct zichtbaar is in de kosten, zoals vermeden kosten of vrije capaciteit.' },
        { term: 'Vermeden kosten', def: 'Geld dat je niet hoeft uit te geven, zoals een investering die niet meer nodig is.' },
        { term: 'Vrijgespeelde capaciteit', def: 'Uren van mensen of machines die vrijkomen; pas geld als je ze gebruikt.' },
        { term: 'Controller', def: 'De financiële functie die de cijfers van het bedrijf bewaakt en besparingen narekent.' },
        { term: 'Jaarbasis', def: 'Het volle jaarbedrag van een besparing vanaf het moment dat ze ingaat, in plaats van wat ze dit jaar oplevert.' },
      ],
    },
    {
      id: 'pm.land.hansei',
      title: 'Reflecteren: hansei en de after-action review',
      pre: [
        {
          q: 'Je project heeft zijn doel gehaald en de klant is tevreden. Wat hoort er volgens hansei nog bij?',
          options: ['Niks; reflecteren is voor projecten die mislukt zijn', 'Eerlijk kijken wat beter had gekund, ook al ging het goed', 'Een feestje met het team om het succes te vieren', 'Een klanttevredenheidsonderzoek om het succes te bewijzen'],
          answer: 'Eerlijk kijken wat beter had gekund, ook al ging het goed',
          why: 'Hansei is reflectie op je eigen tekortkomingen, juist ook na een succes. Daar leer je het meest van.',
        },
      ],
      teach: [
        'Hansei is Japans voor reflectie: eerlijk kijken naar wat je zelf beter had kunnen doen, ook als het goed ging. In The Toyota Way (2004) beschrijft Jeffrey Liker het als een kern van een lerende organisatie, naast kaizen.\n\nBij Toyota wordt vaak gezegd dat “geen problemen” zelf een probleem is: wie niets ziet om te verbeteren, kijkt niet goed. Na een project is hansei het moment om dat ook op je eigen werk toe te passen.',
        'Een praktische vorm is de after-action review, ontwikkeld door het Amerikaanse leger. Vier vragen, per handleiding net iets anders verwoord: Wat moest er gebeuren? Wat gebeurde er echt? Waarom was er verschil? Wat houden we vast en wat doen we anders?\n\nVeel handleidingen op basis van de legerpraktijk raden aan het grootste deel van de tijd aan de laatste vraag te besteden, vaak 25% voor de eerste twee, 25% voor de derde en 50% voor de vierde. Het gaat om leren, niet om het verleden navertellen.',
        'In Lean leg je het verhaal vaak vast in een A3-rapport: het probleem, de oorzaak, de maatregelen en het resultaat op één A3-vel. De laatste vakken, de check en de follow-up, zijn de plek voor reflectie: wat werkte, wat niet, en wat betekent dat voor de volgende keer.\n\nZo wordt reflectie geen los praatje, maar het laatste deel van PDCA: de A van Act.',
        'Hansei blijft alleen hangen als de lijn het zelf doet. Het leger houdt korte reviews direct na elke oefening, met de mensen die erbij waren. Doe dat ook op de vloer: een kwartier bij het bord na een omstelproef, een lijnstop of de eerste week van een nieuwe standaard, geleid door de teamleider.\n\nEen leerpunt (learning point) telt pas als het iets verandert dat blijft: de standaard, de checklist, het trainingsrooster. Hoe je een veilige terugblik op het project houdt en lessen tot acties maakt, staat in Afsluiten.',
        'Wat vaak misgaat: de evaluatie wordt een rondje complimenten, of een lijst van twintig leerpunten die niemand meer leest. Of alleen het projectteam reflecteert, zonder de lijn, die het verschil het best kent.\n\nExperts twisten of je een succes net zo grondig moet bespreken als een mislukking. Wie hansei serieus neemt, zegt ja. Scherpe vraag aan het team: “Als we dit project morgen opnieuw deden, wat zouden we als eerste anders doen?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een netbeheerder sluit je het project met de gereedheidscheck (readiness check) in regio Noord af. Doel: het aandeel afgezegde klussen van 20% naar 8%. Resultaat: 10%. De klant is tevreden. Twee dingen liepen anders dan gepland: de werkvoorbereiders gingen pas mee nadat ze de checklist zelf mochten herzien, wat zes weken kostte; en in de zomer zakte het tijdelijk terug omdat de vervangende planners niet getraind waren.\n\nJe organiseert een after-action review van een uur met de teamleider planning, twee werkvoorbereiders en de sponsor.',
        ask: 'Loop de vier vragen door: wat zou je per vraag verwachten te horen, en welke leerpunten neem je mee?',
        reveal: 'Wat moest er gebeuren: 8% afgezegde klussen, met de check in week 6 in gebruik. Wat gebeurde er echt: 10%, en de check zat pas in week 12 goed in het werk. Waarom: de werkvoorbereiders werden te laat betrokken, en vervangers zaten niet in het trainingsplan.\n\nWat anders, de helft van het uur: bij een volgend project ontwerpen de mensen die het werk doen de checklist vanaf week 1 mee; en vervangers en vakantiekrachten staan standaard in het trainingsrooster. Elk leerpunt krijgt een eigenaar: de eerste jij, de tweede de teamleider planning. En je begint zelf: “Ik had de werkvoorbereiders eerder moeten opzoeken.”',
      },
      said: 'Wat je hoort in projecten: “We hebben het doel bijna gehaald, iedereen is blij. Waarom zouden we nog evalueren?”',
      recall: [
        {
          q: 'Wat is de derde vraag van een after-action review?',
          options: ['Wat moest er gebeuren?', 'Wat gebeurde er echt?', 'Wat houden we vast en wat doen we anders?', 'Waarom was er verschil?'],
          answer: 'Waarom was er verschil?',
          why: 'Eerst het plan, dan de werkelijkheid, dan het waarom van het verschil, en tot slot wat je anders doet.',
        },
        {
          q: 'Welk leerpunt is het bruikbaarst?',
          options: ['“Vervangers komen in het trainingsrooster; eigenaar: de teamleider”', '“De communicatie met de werkvloer moet volgende keer beter”', '“We moeten de mensen eerder bij de verandering betrekken”', '“Iedereen moet zich meer eigenaar voelen van het resultaat”'],
          answer: '“Vervangers komen in het trainingsrooster; eigenaar: de teamleider”',
          why: 'Concreet, uitvoerbaar en met een eigenaar. De andere zijn waar, maar te vaag om iets te veranderen.',
        },
        {
          q: 'Waar staat de reflectie in een A3-rapport?',
          options: ['Bovenaan, bij de beschrijving van het probleem en het doel', 'In het midden, bij de analyse van de oorzaak en de waaroms', 'In de vakken voor de check en de follow-up, aan het eind', 'Op een apart blad dat niet bij het A3 zelf hoort'],
          answer: 'In de vakken voor de check en de follow-up, aan het eind',
          why: 'Reflectie hoort bij de Check en Act van PDCA: wat werkte, wat niet, en wat het betekent.',
        },
        {
          q: 'Wanneer haalt een team het meeste uit een after-action review?',
          options: ['Eens per jaar, in een grote sessie met alle afdelingen samen', 'Direct na de gebeurtenis, met de mensen die erbij waren', 'Alleen aan het eind van een project, geleid door de consultant', 'Als het maandrapport een rood KPI-cijfer laat zien'],
          answer: 'Direct na de gebeurtenis, met de mensen die erbij waren',
          why: 'Het geheugen is nog vers en wie erbij was, weet wat er echt gebeurde. Korte reviews na een gebeurtenis maken reflectie een gewoonte van de lijn.',
        },
      ],
      situation: {
        scene: 'Bij een levensmiddelenfabriek heb je twee maanden geleden de nieuwe omstelstandaard overgedragen. Gisteren probeerde teamleider Sandra op lijn 3 een nieuwe schoonmaakvolgorde die 10 minuten moest schelen; de omstelling duurde 40 minuten langer. De productiemanager zegt: “Werkt niet. Terug naar de oude manier en door.”',
        ask: 'Hoe gebruik je hansei hier?',
        model: '“Voordat we het schrappen: laten we een kwartier bij de lijn gaan staan met Sandra en de twee operators die het deden. Wat moest er gebeuren, wat gebeurde er, waarom het verschil, wat proberen we hierna. Een mislukte proef is goedkoop als we ervan leren. Sandra leidt het, niet ik. Ik heb de proef mee voorbereid, dus ik begin met wat ik over het hoofd zag.”',
        rubric: [
          'Ziet de mislukte proef als iets om van te leren, niet om weg te stoppen',
          'Stelt een korte after-action review bij de lijn voor met de mensen die erbij waren',
          'Laat de teamleider het leiden en neemt zijn eigen deel',
        ],
        pushback: {
          lines: [
            '“We hebben geen tijd om elke mislukking te bespreken. De lijn moet draaien.”',
            '“Sandra had gewoon niet zonder te vragen moeten experimenteren.”',
          ],
          model: '“Een kwartier bij het bord, terwijl de lijn draait. Ik wil niet weten wie de schuld heeft, maar waarom het langer duurde; misschien stond één stap in de verkeerde volgorde. Slaan we dit over, dan stopt Sandra met dingen proberen, en sneuvelt het volgende idee ook. Wat eruit komt, gaat in de volgende proef of in de standaard.”',
          rubric: [
            'Erkent de tijdsdruk',
            'Stuurt weg van schuld, naar de oorzaak',
            'Koppelt de review aan levend verbeteren en aan de standaard',
          ],
        },
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit waarom een mislukte proef een korte after-action review verdient, en hoe je die in een kwartier doet.',
      terms: [
        { term: 'Hansei', def: 'Japans voor reflectie: eerlijk kijken naar wat je zelf beter had kunnen doen, ook na een succes.' },
        { term: 'After-action review', def: 'Een korte evaluatie met vier vragen: wat moest er gebeuren, wat gebeurde er, waarom het verschil, wat doen we anders.' },
        { term: 'A3-rapport', def: 'Een probleemoplosverhaal op één A3-vel: probleem, oorzaak, maatregelen, resultaat en follow-up.' },
        { term: 'Leerpunt', def: 'Een concrete afspraak over wat je de volgende keer anders doet, met een eigenaar.' },
      ],
    },
    {
      id: 'pm.land.yokoten',
      title: 'Yokoten: uitrollen naar andere lijnen',
      pre: [
        {
          q: 'De nieuwe omstelaanpak werkt op lijn 1. De directeur wil dat de andere vier lijnen het volgende maand precies zo doen. Wat is het grootste risico?',
          options: ['Dat de andere lijnen te snel verbeteren en lijn 1 op eigen resultaten inhalen', 'Dat de uitrol veel meer tijd en geld kost dan er gepland was', 'Dat de oplossing gekopieerd wordt zonder het denken en de lokale verschillen', 'Dat lijn 1 zijn voorsprong kwijtraakt en de mensen hun motivatie verliezen'],
          answer: 'Dat de oplossing gekopieerd wordt zonder het denken en de lokale verschillen',
          why: 'Wat op de ene lijn werkt, past zelden een-op-een op een andere. Kopiëren zonder begrip valt om bij het eerste verschil.',
        },
      ],
      teach: [
        'Yokoten is een Japans woord dat het Lean Enterprise Institute omschrijft als het horizontaal verspreiden van ideeën en verbeteringen binnen een bedrijf. Horizontaal betekent: van lijn naar lijn en van vestiging naar vestiging, tussen collega’s, niet alleen van boven naar beneden.\n\nBij Toyota betekent het vooral dat teams bij elkaar gaan kijken en leren hoe een ander een probleem oploste.',
        'Lean-schrijvers benadrukken: kopiëren en verbeteren (copy and improve), niet knippen en plakken. De andere lijn neemt het denken over, zoals waarom de omstelling in stappen is gesplitst, en past de oplossing aan op zijn eigen machines, producten en mensen.\n\nDaarom werkt een uitrol per e-mail met een PowerPoint en een sjabloon zelden. Mensen moeten het zien, begrijpen waarom het werkt, en het zelf aanpassen.',
        'Een sterke aanpak is de modellijn (model line): één lijn waar de nieuwe manier volledig en stabiel draait, als voorbeeld en leerplek. Teamleiders van andere lijnen lopen daar een paar dagen mee, en de teamleider van de modellijn helpt bij de eerste stappen op hun lijn.\n\nPas uitrollen als de modellijn stabiel is: een paar maanden goede resultaten, zonder dat de consultant nog bijspringt. Anders verspreid je een half werkend proces.',
        'Check per lijn de uitrolgereedheid (roll-out readiness): is er een lokale eigenaar, is er een nulmeting, zijn de verschillen met de modellijn bekend, en is er tijd vrijgemaakt voor training? Mist een van die vier, dan wacht je liever een maand.\n\nPlan de uitrol in golven, één of twee lijnen tegelijk. Wat de eerste golf leert, maakt de volgende sneller.',
        'Wat vaak misgaat: de directie wil snelheid en rolt alles tegelijk uit, met een projectteam dat het overal voordoet. Na een halfjaar draait het alleen nog op de modellijn.\n\nExperts twisten over het tempo. Sommigen zeggen dat snel uitrollen momentum geeft; anderen, zoals Jim Womack bij Toyota beschrijft, dat yokoten langzaam lijkt maar beter blijft hangen omdat elke lijn het zelf leert. Scherpe vraag aan elke nieuwe lijn: “Wat doen jullie anders dan de modellijn, en waarom?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een netbeheerder werkt de gereedheidscheck sinds vijf maanden goed in regio Noord: het aandeel afgezegde klussen ging van 20% naar 10% en blijft stabiel, zonder jou. De directeur wil hem “volgende maand in alle vier de andere regio’s”. In regio Zuid zit al een teamleider die de check wil; in Oost en West weet nog niemand ervan; regio Midden heeft net een nieuw planningssysteem en loopt achter met zijn werk.',
        ask: 'Hoe zou jij de uitrol opzetten, en wat zeg je tegen de directeur?',
        reveal: 'Noord is de modellijn: stabiel en zonder consultant. Check de gereedheid per regio. Zuid is klaar: lokale eigenaar, en de nulmeting kan deze maand. Oost en West: eerst een eigenaar en een nulmeting. Midden: wachten tot het nieuwe systeem stabiel is.\n\nGolf 1: Zuid. Hun teamleider en twee werkvoorbereiders lopen drie dagen mee in Noord en passen de checklist aan op hun eigen klussen. Golf 2: Oost en West, met Noord én Zuid als voorbeeld. Golf 3: Midden. Tegen de directeur: “Over twee maanden draait Zuid en starten er twee. Zo blijft het hangen, in plaats van overal half.”',
      },
      said: 'Wat je hoort in projecten: “Het werkt in Noord. Stuur die checklist gewoon naar de andere regio’s, dan zijn we klaar.”',
      recall: [
        {
          q: 'Wat bedoelen Lean-mensen met “kopiëren en verbeteren”?',
          options: ['De oplossing exact overnemen, zodat elke lijn hetzelfde werkt', 'Het denken overnemen en de oplossing aanpassen aan de eigen lijn', 'De oplossing eerst verbeteren op de modellijn en dan pas verspreiden', 'De beste lijn als norm nemen en de andere erop afrekenen'],
          answer: 'Het denken overnemen en de oplossing aanpassen aan de eigen lijn',
          why: 'Elke lijn is anders; wie het waarom begrijpt, kan de oplossing goed aanpassen.',
        },
        {
          q: 'Wanneer is een modellijn klaar om als voorbeeld voor andere lijnen te dienen?',
          options: ['Zodra de eerste goede week achter de rug is en de cijfers groen zijn', 'Als de directie de resultaten in een presentatie heeft gezien', 'Als het standaardwerk is opgeschreven en door iedereen getekend', 'Als het maanden stabiel draait zonder dat de consultant bijspringt'],
          answer: 'Als het maanden stabiel draait zonder dat de consultant bijspringt',
          why: 'Een half werkend proces verspreiden levert overal een half werkend proces op.',
        },
        {
          q: 'Een regio wil meedoen maar heeft geen lokale eigenaar. Wat doe je?',
          options: ['Eerst een eigenaar regelen; tot die er is, wacht de uitrol daar', 'Toch starten; de eigenaar komt vanzelf als het werkt', 'De teamleider van de modellijn tijdelijk eigenaar maken', 'Het projectteam het daar laten draaien tot er iemand is'],
          answer: 'Eerst een eigenaar regelen; tot die er is, wacht de uitrol daar',
          why: 'Zonder lokale eigenaar valt het om zodra het projectteam weggaat.',
        },
        {
          q: 'Wat is volgens het Lean Enterprise Institute de kern van yokoten?',
          options: ['Een centrale afdeling die verbeteringen goedkeurt en voorschrijft', 'Een jaarlijkse wedstrijd voor de beste verbetering van het bedrijf', 'Een database waarin alle verbeterprojecten worden opgeslagen', 'Verbeteringen horizontaal verspreiden, tussen lijnen en vestigingen'],
          answer: 'Verbeteringen horizontaal verspreiden, tussen lijnen en vestigingen',
          why: 'Yokoten gaat zijwaarts, tussen collega’s, niet via een centrale voorschrijver.',
        },
      ],
      situation: {
        scene: 'Bij een verpakkingsbedrijf met drie vestigingen heeft je project de stopregistratie en de dagstart op één vestiging goed laten landen. De operations director vraagt je de andere twee vestigingen “in zes weken” te doen, met hetzelfde projectteam.',
        ask: 'Wat stel je voor?',
        model: '“Ik wil het graag verspreiden, en het werkt hier stabiel. Maar als ons team het in zes weken overal voordoet, draait het straks alleen hier. Mijn voorstel: per vestiging eerst een eigenaar en een nulmeting, dan lopen hun teamleiders drie dagen mee bij ons, en de teamleiders van hier helpen bij de start. Eén vestiging tegelijk; de tweede gaat sneller dan de eerste.”',
        rubric: [
          'Steunt het doel van verspreiden',
          'Legt uit waarom het projectteam het niet overal moet voordoen',
          'Stelt een uitrol in golven voor met eigenaar, nulmeting en meelopen',
        ],
        pushback: {
          lines: [
            '“Zes weken is wat de directie heeft toegezegd aan het hoofdkantoor.”',
            '“Jullie hebben het hier al uitgezocht. Waarom moeten zij het wiel opnieuw uitvinden?”',
          ],
          model: '“Ze hoeven het wiel niet opnieuw uit te vinden; ze nemen het denken over en passen het aan op hun lijnen. Over de zes weken: in zes weken kan de eerste vestiging live zijn, met een plan voor de tweede. Dat kun je het hoofdkantoor laten zien, en het blijft staan.”',
          rubric: [
            'Erkent de toezegging aan het hoofdkantoor',
            'Legt het verschil uit tussen kopiëren en zelf leren',
            'Geeft een realistisch alternatief binnen de zes weken',
          ],
        },
      },
      sayIt: 'Leg een operations director in 60 seconden uit waarom je een verbetering niet per e-mail uitrolt, en wat yokoten anders doet.',
      terms: [
        { term: 'Yokoten', def: 'Japans voor het horizontaal verspreiden van ideeën en verbeteringen, tussen lijnen en vestigingen.' },
        { term: 'Kopiëren en verbeteren', def: 'Het denken achter een oplossing overnemen en de oplossing aanpassen aan je eigen situatie.' },
        { term: 'Modellijn', def: 'Eén lijn waar de nieuwe manier volledig en stabiel draait, als voorbeeld en leerplek voor andere lijnen.' },
        { term: 'Uitrolgereedheid', def: 'Of een lijn klaar is om mee te doen: een lokale eigenaar, een nulmeting, bekende verschillen en tijd voor training.' },
      ],
    },
  ],
};

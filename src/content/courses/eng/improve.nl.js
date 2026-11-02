// eng.improve (NL): Technisch probleemoplossen: 8D, is/is-niet en stratificatie, meten voor je concludeert, proefopzetten (DOE), de fix verifiëren, een grondoorzaaksessie begeleiden.
export default {
  lessons: [
    {
      id: 'eng.improve.8d',
      title: '8D: indammen, oorzaak vinden, blijvend oplossen',
      pre: [
        {
          q: 'Een klant vindt gescheurde beugels. De leverancier sorteert alle voorraad 100% en levert alleen nog goede delen. Is het probleem opgelost?',
          options: ['Ja, de klant krijgt nu goede delen', 'Ja, als het sorteren gedocumenteerd is', 'Nee, de klant is beschermd maar de oorzaak maakt nog steeds gescheurde delen', 'Nee, want 100% sorteren mag niet in automotive'],
          answer: 'Nee, de klant is beschermd maar de oorzaak maakt nog steeds gescheurde delen',
          why: 'Sorteren is indammen: het houdt foute delen weg bij de klant, maar het proces blijft ze maken.',
        },
      ],
      teach: [
        'De 8D is hét probleemoplossingsrapport in automotive en een groot deel van de industrie. D1 team samenstellen. D2 het probleem in cijfers beschrijven. D3 indammen. D4 de grondoorzaak vinden. D5 de blijvende maatregel kiezen en bewijzen. D6 invoeren en valideren. D7 herhaling voorkomen. D8 afsluiten en het team bedanken. Veel versies hebben ook een D0: is een 8D nodig, en welke noodmaatregel nemen we. Klanten verwachten D3 vaak binnen 24 uur (een gangbare eis, geen wet).',
        'Indammen (D3, containment) beschermt de klant terwijl je zoekt. Zet voorraad in quarantaine bij jou, onderweg en bij de klant, sorteer, en markeer de eerste schone levering. Het is duur en lek: mensen die op het oog sorteren missen een deel van de fouten, als vuistregel vaak 10–20%. Containment koopt tijd. Het is nooit de oplossing, en een team dat na D3 stopt, ziet het probleem terug.',
        'Een echte grondoorzaak (D4) heeft twee poten. De ontstaansoorzaak (occurrence): waarom maakte het proces een fout deel? De ontsnappingsoorzaak (escape): waarom liet jouw controle het door? Allebei met bewijs, niet met een mening. “Operatorfout” is geen grondoorzaak; het verschuift de vraag alleen naar waarom het proces die fout toeliet, en waarom niemand hem ving.',
        'De blijvende maatregel (D5–D6) haalt de oorzaak weg of blokkeert hem, en in D7 pas je de FMEA, het control plan en de werkinstructies aan en kijk je naar vergelijkbare processen. De vraag die een zwakke 8D blootlegt: “Als we verder niks doen, wat houdt dit morgen tegen?” Is het antwoord “mensen letten beter op”, dan is de 8D niet af.',
      ],
      example: {
        kind: 'faded',
        text: 'Een tier-2-leverancier levert kunststof behuizingen met short shots (niet volgespoten delen) aan een klant in de autotoeleveringsindustrie. D3: 100% visueel sorteren van 9.000 stuks, 140 afgekeurd. In het concept-8D staat bij D4 “operator heeft de delen niet gecontroleerd”. Bij D5: “operator opnieuw getraind, extra visuele controle toegevoegd”. De kwaliteitsmanager wil hem vandaag naar de klant sturen.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Eerst terugduwen voordat hij de deur uitgaat. “Operator heeft niet gecontroleerd” is de escape-kant, en maar de helft daarvan: waarom was een visuele check de enige barrière? De ontstaansoorzaak ontbreekt helemaal: waarom maakte de matrijs short shots? Vraag data op over doseerslag, inspuitdruk, smelttemperatuur, drogen van het granulaat en dichte ontluchtingen, uitgesplitst per caviteit en in de tijd. De blijvende maatregel moet voorkomen dat short shots ontstaan (bijvoorbeeld een procesvenster met alarmen) en ze automatisch detecteren (cavity-drukmeting in de matrijs of een gewichtscontrole), niet leunen op beter kijken. Pas daarna de PFMEA en het control plan aan, en check de andere matrijzen die hetzelfde materiaal draaien.',
      },
      said: 'Wat engineers zeggen: “D3 staat, de klant is schoon. Maar we hebben nog geen D4, we hebben alleen een theorie.”',
      recall: [
        {
          q: 'Je hebt 12.000 delen met 2% fouten. Een visuele sortering vangt 85% van de foute delen. Hoeveel foute delen bereiken de klant toch?',
          number: 36,
          tolerance: 1,
          unit: 'delen',
          why: '12.000 × 2% = 240 foute delen; 15% glipt erdoor, dus 240 × 0,15 = 36.',
        },
        {
          q: 'Wanneer is D4 af?',
          options: ['Als het team het eens is over de waarschijnlijkste oorzaak', 'Als de operator het trainingsformulier heeft getekend', 'Als zowel de ontstaans- als de ontsnappingsoorzaak met bewijs bevestigd zijn', 'Als de klant niet meer klaagt'],
          answer: 'Als zowel de ontstaans- als de ontsnappingsoorzaak met bewijs bevestigd zijn',
          why: 'Een grondoorzaak verklaart waarom het deel fout gemaakt werd én waarom het erdoor kwam, en is bewezen, niet gestemd.',
        },
        {
          q: 'In een concept-8D staat “operatorfout” als grondoorzaak. Wat is de sterkste vervolgvraag?',
          options: ['Welke operator was het?', 'Is de operator opnieuw getraind?', 'Was het nachtdienst?', 'Waarom liet het proces deze fout toe, en waarom ving niets hem op?'],
          answer: 'Waarom liet het proces deze fout toe, en waarom ving niets hem op?',
          why: 'Een menselijke fout is een symptoom; de oorzaak is een procesontwerp dat de fout mogelijk en onzichtbaar maakte.',
        },
        {
          q: 'Waarom is 100% sorteren geen blijvende corrigerende maatregel?',
          options: ['Klanten accepteren sorteren helemaal niet', 'Het vangt maar een deel van de fouten, kost mensen, en laat de oorzaak bestaan', 'Het is te traag bij grote aantallen', 'Er is een aparte 8D voor nodig'],
          answer: 'Het vangt maar een deel van de fouten, kost mensen, en laat de oorzaak bestaan',
          why: 'Sorteren is indammen; het proces maakt de fout nog steeds.',
        },
      ],
      situation: {
        scene: 'Je zit bij een metaalstansbedrijf in de wekelijkse 8D-review. Bij een klacht over bramen op een beugel staat bij D4 “slijtage van het stempel” en bij D5 “extra visuele controle bij het inpakken”. De kwaliteitsengineer wil hem sluiten.',
        ask: 'Wat vraag je?',
        model: 'Welk bewijs hebben we dat slijtage deze bramen geeft: lopen braamhoogte en het aantal slagen sinds het laatste slijpen gelijk op? En waarom viel de slijtage niet op: is er een slijpinterval of een braamcontrole bij de pers? Een check bij het inpakken is indammen; de blijvende maatregel is een slijpinterval op basis van slagen en een braamcheck aan de pers. Hebben de andere stempels op die pers hetzelfde risico?',
        rubric: [
          'Vraagt om bewijs dat de genoemde oorzaak het defect geeft',
          'Maakt onderscheid tussen ontstaans- en ontsnappingsoorzaak',
          'Noemt de inpakcontrole indammen en vraagt om een maatregel die de oorzaak weghaalt',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom indammen niet de oplossing is, en hoe een afgeronde D4 eruitziet.',
      terms: [
        { term: '8D', def: 'Probleemoplossingsrapport in acht stappen: team, beschrijving, indammen, grondoorzaak, maatregel, validatie, voorkomen, afsluiten.' },
        { term: 'Containment (indammen)', def: 'Tijdelijke maatregel die de klant beschermt, zoals quarantaine en sorteren, terwijl je de oorzaak zoekt.' },
        { term: 'Occurrence- en escape-oorzaak', def: 'Waarom het defect ontstond, en waarom de controles het niet vingen.' },
      ],
    },
    {
      id: 'eng.improve.isisnot',
      title: 'Is/is-niet en stratificatie',
      pre: [
        {
          q: 'Lekkages zitten op delen van bewerkingscentrum 2, niet op die van bewerkingscentrum 1. Beide draaien dezelfde gietcharges. Welke theorie verzwakt deze data het meest?',
          options: ['Een versleten gereedschap op centrum 2', 'Poreus gietwerk van de leverancier', 'Een programmawijziging op centrum 2', 'Andere koelvloeistof op centrum 2'],
          answer: 'Poreus gietwerk van de leverancier',
          why: 'Hetzelfde gietwerk is goed op centrum 1, dus een leveranciersoorzaak moet ook verklaren waarom centrum 1 niet lekt.',
        },
      ],
      teach: [
        'Een is/is-niet-analyse beschrijft een probleem langs vier lijnen: wat (welk deel, welk defect), waar (welke machine, welke plek op het deel), wanneer (sinds wanneer, welke dienst, welk moment in de cyclus) en hoeveel (aantallen, trend). Per lijn schrijf je op wat het is, en wat het zou kunnen zijn maar níet is. In de “is niet”-kolom zit het inzicht.',
        'Stel daarna bij elk paar twee vragen. Wat is uniek aan de “is”-kant? En wat veranderde er rond het moment dat het begon? Een probleem dat op een datum begint, heeft bijna altijd een trigger: nieuw gereedschap, een programmawijziging, een andere leverancier, een nieuwe operator, een onderhoudsklus.',
        'Stratificatie is is/is-niet met data. Splits de fouten uit per machine, caviteit, dienst, materiaalcharge, operator en week. Een vlakke 5% uitval blijkt dan soms 28% op één caviteit en onder de 2% op de rest. Geconcentreerde fouten wijzen naar een specifieke oorzaak. Fouten die gelijk over alles verdeeld zijn, wijzen naar iets gemeenschappelijks: het materiaal, het ontwerp of de methode.',
        'Een echte oorzaak verklaart elke “is” en elke “is niet”. Toets elke theorie tegen de tabel: “Als het het materiaal is, waarom is lijn 1 dan goed?” Die ene vraag legt de meeste zwakke analyses bloot, want een stokpaardje verklaart meestal wel het defect, maar niet waar het afwezig is.',
      ],
      example: {
        kind: 'faded',
        text: 'Klephuizen vallen voor 3% af op de lektest. De engineer weet zeker dat het porositeit is van de gieterij. De data: de lekkages begonnen in week 14; alle lekkende delen komen van bewerkingscentrum 2, geen van centrum 1; beide centra draaien dezelfde gietcharges; elk lek zit op dezelfde poort.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Toets de leverancierstheorie tegen de is-niet: dezelfde charges zijn goed op centrum 1, dus porositeit alleen verklaart het niet. Kijk wat uniek is aan centrum 2 en wat daar rond week 14 veranderde: een nieuwe boor of tap, een programmawijziging, een gerepareerde opspanning, andere koelvloeistof. Eén poort wijst op één bewerking. Check die bewerking op centrum 2: gereedschapsslijtage, diepte, en of de boor nu in een poreuze zone komt die het oude programma miste. Bevestig het daarna door dezelfde charge op beide centra te draaien.',
      },
      said: 'Wat engineers zeggen: “Splits het eerst uit per caviteit. Zit het allemaal op caviteit 5, dan hoeven we het niet meer over het materiaal te hebben.”',
      recall: [
        {
          q: 'Een 8-voudige matrijs maakte 8.000 delen, 1.000 per caviteit, met 400 afkeur. Caviteit 5 heeft er 280 van. Wat is het afkeurpercentage van de andere zeven caviteiten samen?',
          number: 1.7,
          tolerance: 0.1,
          unit: '%',
          why: '400 − 280 = 120 afkeur op 7.000 delen = 1,7%, tegen 28% op caviteit 5.',
        },
        {
          q: 'Wat moet een echte oorzaak verklaren?',
          options: ['Het grootste deel van de fouten', 'Wat de meest ervaren engineer eerder heeft gezien', 'De kosten van het probleem', 'Elke “is” en elke “is niet” in de tabel'],
          answer: 'Elke “is” en elke “is niet” in de tabel',
          why: 'Een oorzaak die past bij de fouten maar niet bij waar ze ontbreken, is niet de oorzaak.',
        },
        {
          q: 'De fouten zijn gelijk verdeeld over alle machines, diensten en caviteiten. Waar kijk je eerst?',
          options: ['Iets wat ze allemaal delen: materiaal, ontwerp of methode', 'De nieuwste operator', 'De machine met de meeste draaiuren', 'De nachtdienst'],
          answer: 'Iets wat ze allemaal delen: materiaal, ontwerp of methode',
          why: 'Een gelijke spreiding betekent geen lokale oorzaak; kijk naar wat elk deel gemeen heeft.',
        },
        {
          q: 'Waarom vraag je wat er veranderde rond de datum dat een probleem begon?',
          options: ['Omdat auditors een tijdlijn willen zien', 'Omdat veranderingen meestal goedkoop terug te draaien zijn', 'Omdat een probleem dat op een datum begint meestal een trigger heeft', 'Omdat operators veranderingen het best onthouden'],
          answer: 'Omdat een probleem dat op een datum begint meestal een trigger heeft',
          why: 'Gereedschap, programma’s, leveranciers, mensen en onderhoudsklussen zijn de gebruikelijke triggers.',
        },
      ],
      situation: {
        scene: 'Je bent bij een klant in voedingsverpakkingen. Het aantal lekke seals op één verpakkingslijn is verdubbeld. De TD-chef zegt dat de nieuwe folieleverancier de oorzaak is en wil terug naar de oude.',
        ask: 'Wat vraag je voordat ze wisselen?',
        model: 'Draait de nieuwe folie ook op de andere lijnen, en zien die ook meer lekke seals? Zo niet, dan verklaart de folie het niet alleen. Kunnen we de fouten uitsplitsen per sealbek, dienst en folierol, en op een rij zetten wat er rond dezelfde datum op deze lijn veranderde? Zitten de fouten op één bek, dan kijken we eerst naar die bek voordat we van leverancier wisselen.',
        rubric: [
          'Toetst de theorie tegen de is-niet (andere lijnen met dezelfde folie)',
          'Vraagt de fouten uit te splitsen per bek, dienst of rol',
          'Vraagt wat er rond de startdatum op deze lijn veranderde',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit hoe een is/is-niet-tabel een stokpaardje onderuit kan halen.',
      terms: [
        { term: 'Is/is-niet', def: 'Een tabel die zet waar, wanneer en hoeveel een probleem optreedt tegenover waar het zou kunnen optreden maar niet doet.' },
        { term: 'Stratificatie', def: 'Foutdata uitsplitsen per machine, caviteit, dienst, charge of tijd om te zien waar het zich concentreert.' },
        { term: 'Onderscheid', def: 'Iets wat waar is voor de “is”-kant en niet voor de “is niet”-kant; een wegwijzer naar de oorzaak.' },
      ],
    },
    {
      id: 'eng.improve.data',
      title: 'Meten voordat je concludeert',
      pre: [
        {
          q: 'De uitval ligt normaal tussen 3% en 7% per dag. Na een proceswijziging laat de eerste dag 3,5% zien. Wat kun je concluderen?',
          options: ['De wijziging werkt', 'De wijziging heeft de uitval verergerd', 'Nog niks; 3,5% valt binnen de normale spreiding', 'De uitvalmeting moet fout zijn'],
          answer: 'Nog niks; 3,5% valt binnen de normale spreiding',
          why: 'Een dag binnen de gewone bandbreedte is wat je ook zonder wijziging zou zien.',
        },
      ],
      teach: [
        'Elk proces varieert. Uitval, cyclustijd en maten bewegen van dag tot dag zonder dat iemand iets aanraakt. Ken eerst de normale spreiding voordat je een wijziging beoordeelt: zet de laatste 20 tot 30 dagen in een run chart of regelkaart. Een resultaat binnen de gewone band zegt niks, hoe mooi het ook oogt.',
        'Eén goede dag bewijst niks. Je zoekt een blijvende verschuiving. Een gangbare vuistregel bij run charts: zo’n 8 punten op rij aan één kant van de middellijn wijzen op een echte verandering (boeken noemen 6 tot 9). Check ook of er tegelijk iets anders veranderde, zoals de productmix, de materiaalcharge of het rooster.',
        'Zeldzame fouten vragen grote steekproeven. De regel van drie: zie je nul fouten in n delen, dan kun je met 95% zekerheid zeggen dat het foutpercentage onder ongeveer 3 / n ligt. Met 50 goede delen weet je dus alleen dat het onder de 6% zit. Wil je onder de 1% claimen, dan heb je zo’n 300 goede delen op rij nodig.',
        'Vertrouw eerst de meting. Een meetsysteemanalyse (gauge R&R) laat zien hoeveel van de spreiding uit de meting zelf komt. Gangbare richtlijn (AIAG): onder 10% is goed, 10–30% kan acceptabel zijn, boven 30% niet. De vraag die een zwakke analyse blootlegt: “Hoe groot was de normale variatie vooraf, en hoe goed is de meting?”',
      ],
      example: {
        kind: 'faded',
        text: 'Een spuitgietteam heeft dinsdag de spuitmondtemperatuur verhoogd. Woensdag was de uitval 1,8%, tegen “normaal 4%”. De afgelopen vier weken lag de dagelijkse uitval tussen 2,1% en 6,3%. De plantmanager wil de instelling morgen op alle zes machines uitrollen.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Woensdag ligt net onder de laagste dag van de afgelopen maand: interessant, geen bewijs. Laat de nieuwe instelling zo’n twee weken op deze machine staan en zet de dagelijkse uitval in dezelfde grafiek als de vier weken ervoor. Zoek een blijvende reeks onder het oude gemiddelde, niet één punt. Check wat er verder veranderde: productmix, materiaalcharge, wie er in de dienst stond. Wil je het sneller weten, zet de instelling dan een paar dagen terug en kijk of de uitval terugkomt. Dán uitrollen.',
      },
      said: 'Wat engineers zeggen: “Eén goede dienst is ruis. Laat me twee weken in de grafiek zien, dan praten we verder.”',
      recall: [
        {
          q: 'Met de regel van drie: hoeveel goede delen op rij heb je nodig om met 95% zekerheid te claimen dat het foutpercentage onder 0,5% ligt?',
          number: 600,
          tolerance: 10,
          unit: 'delen',
          why: '3 / 0,005 = 600.',
        },
        {
          q: 'Een team ziet de uitval de week na een wijziging dalen van 5% naar 4%. Normaal ligt de weekuitval tussen 3,5% en 6%. Wat is de eerlijke samenvatting?',
          options: ['De uitval daalde met 20%, de wijziging werkt', 'Het resultaat valt binnen de normale variatie; blijf meten', 'De wijziging maakte geen verschil', 'Het meetsysteem is kapot'],
          answer: 'Het resultaat valt binnen de normale variatie; blijf meten',
          why: 'Een week binnen de gewone bandbreedte is geen bewijs voor of tegen de wijziging.',
        },
        {
          q: 'Wat wijst in een run chart op een echte verschuiving?',
          options: ['Een lange reeks punten aan één kant van de middellijn', 'Eén punt ver van de rest', 'Het laatste punt is het laagste', 'Twee punten die dezelfde kant op gaan'],
          answer: 'Een lange reeks punten aan één kant van de middellijn',
          why: 'Een aanhoudende reeks, als vuistregel zo’n 8 punten, ontstaat zelden door toeval.',
        },
        {
          q: 'Een gauge R&R komt uit op 35% van de tolerantie. Wat betekent dat?',
          options: ['Het proces zit 35% buiten tolerantie', 'De delen zijn voor 35% afkeur', 'De meting is heel goed', 'Het meetsysteem is niet geschikt om de delen te beoordelen'],
          answer: 'Het meetsysteem is niet geschikt om de delen te beoordelen',
          why: 'Meer dan 30% van de tolerantie gaat op aan meetfout, dus de meting scheidt goed en fout niet betrouwbaar.',
        },
      ],
      situation: {
        scene: 'Je zit in het maandelijkse resultatenoverleg bij een klant. Een engineer laat zien dat een nieuwe opspanning de maatafkeur verlaagde van 2,4% naar 0,9%, op basis van één week ervoor en één week erna.',
        ask: 'Wat vraag je?',
        model: 'Hoeveel varieert de afkeur normaal van week tot week, en valt 0,9% daarbuiten? Kunnen we meer weken ervoor en erna in één grafiek zien? En is de meting gecheckt: hoe ziet de gauge R&R op deze maat eruit? Houdt de daling een aantal weken stand en is de meting in orde, dan durf ik het te zeggen.',
        rubric: [
          'Vraagt naar de normale variatie van week tot week',
          'Vraagt om meer data ervoor en erna in een grafiek',
          'Vraagt of het meetsysteem geschikt is',
        ],
      },
      sayIt: 'Leg een sponsor in 60 seconden uit waarom één goede dag na een wijziging niks bewijst.',
      terms: [
        { term: 'Run chart', def: 'Een grafiek van een meetwaarde in de tijd met een middellijn, om echte verschuivingen te zien.' },
        { term: 'Regel van drie', def: 'Nul fouten in n delen betekent met 95% zekerheid een foutpercentage onder ongeveer 3 / n.' },
        { term: 'Gauge R&R', def: 'Een studie naar hoeveel meetvariatie komt van het meetmiddel en de mensen die meten.' },
      ],
    },
    {
      id: 'eng.improve.doe',
      title: 'Proefopzetten (DOE) in gewone woorden',
      pre: [
        {
          q: 'Een engineer test de temperatuur met de druk vast, en daarna de druk met de temperatuur vast. Wat kan deze aanpak missen?',
          options: ['Niks, als elke test zorgvuldig is', 'Het effect van de temperatuur', 'De kosten van de proef', 'De beste combinatie, als de twee factoren interactie hebben'],
          answer: 'De beste combinatie, als de twee factoren interactie hebben',
          why: 'Eén factor tegelijk test nooit de hoeken waar je beide verandert, dus mist interacties.',
        },
      ],
      teach: [
        'Design of experiments (DOE) verandert meerdere instellingen tegelijk volgens een vast schema. De woorden: een factor is een instelling die je varieert (temperatuur, druk); een niveau is een waarde die je test (laag en hoog); de respons is wat je meet (uitval, sterkte); een run is één combinatie. Een volledig factorieel ontwerp op twee niveaus vraagt 2 tot de macht k runs: 4 runs voor 2 factoren, 8 voor 3, 16 voor 4.',
        'Het hoofdeffect van een factor is de gemiddelde respons op het hoge niveau min het gemiddelde op het lage niveau. Omdat elke run voor elke factor meetelt, haal je uit hetzelfde aantal runs meer informatie dan wanneer je één factor tegelijk test.',
        'Een interactie betekent dat het effect van de ene factor afhangt van het niveau van de andere. Bij lijmen helpt een hogere uithardtemperatuur misschien alleen als de klemdruk ook hoog is. Eén factor tegelijk test die hoek nooit, concludeert dus dat temperatuur “niet helpt”, en mist de beste instelling.',
        'Goede praktijk: randomiseer de volgorde van de runs, zodat drift zoals het opwarmen van de machine of een nieuwe materiaalcharge niet op een factoreffect lijkt. Herhaal runs om de ruis te zien. Kies niveaus die ver genoeg uit elkaar liggen om een effect te tonen, maar veilig zijn. Met veel factoren screen je met een fractioneel factorieel ontwerp in minder runs. De vraag: “Hoe groot is het effect vergeleken met de spreiding tussen herhalingen?”',
      ],
      example: {
        kind: 'faded',
        text: 'Een 2×2-proef op een spuitgietmachine, uitval per run van 500 delen. Lage temperatuur, lage druk: 8%. Hoge temperatuur, lage druk: 9%. Lage temperatuur, hoge druk: 7%. Hoge temperatuur, hoge druk: 2%. Vorige maand testte de engineer één factor tegelijk, vanuit laag/laag, en concludeerde: “hogere temperatuur maakt het erger, hogere druk helpt een beetje, dus het beste is 7%.”',
        ask: 'Wat concludeer je uit de 2×2?',
        reveal: 'Hoofdeffect temperatuur: hoog (9 en 2) gemiddeld 5,5%, laag (8 en 7) gemiddeld 7,5%, dus −2 procentpunt. Hoofdeffect druk: hoog (7 en 2) is 4,5%, laag (8 en 9) is 8,5%, dus −4 punten. Maar de temperatuur werkt per drukniveau anders: bij lage druk komt er 1 punt bij, bij hoge druk gaan er 5 af. Dat is een sterke interactie. Eén factor tegelijk heeft hoog/hoog nooit getest en de hoek van 2% gemist. Volgende stap: hoog/hoog en de runs ernaast herhalen, in willekeurige volgorde, om te bevestigen dat 2% echt is en geen gelukstreffer.',
      },
      said: 'Wat engineers zeggen: “Niet aan één knop tegelijk draaien, doe een kleine factoriële proef. En randomiseer, die machine drift het eerste uur.”',
      recall: [
        {
          q: 'Hoeveel runs vraagt een volledig factorieel ontwerp met 4 factoren op 2 niveaus, zonder herhalingen?',
          number: 16,
          tolerance: 0.5,
          unit: 'runs',
          why: '2 tot de macht 4 = 16.',
        },
        {
          q: 'Trekkracht in een 2×2-proef: A laag, B laag = 200 N; A hoog, B laag = 240 N; A laag, B hoog = 220 N; A hoog, B hoog = 260 N. Wat is het hoofdeffect van A?',
          number: 40,
          tolerance: 1,
          unit: 'N',
          why: 'A hoog gemiddeld (240 + 260) / 2 = 250; A laag gemiddeld (200 + 220) / 2 = 210; 250 − 210 = 40 N.',
        },
        {
          q: 'Wat betekent een interactie tussen twee factoren?',
          options: ['Beide factoren hebben een groot effect', 'De twee factoren zijn per ongeluk tegelijk veranderd', 'Het effect van de ene factor hangt af van het niveau van de andere', 'De factoren heffen elkaar op'],
          answer: 'Het effect van de ene factor hangt af van het niveau van de andere',
          why: 'In de 2×2 lopen de lijnen voor de twee niveaus niet parallel.',
        },
        {
          q: 'Waarom randomiseer je de volgorde van de runs?',
          options: ['Om tijd te besparen op omstellen', 'Zodat drift in de tijd niet op een factoreffect lijkt', 'Omdat de software het vraagt', 'Om de resultaten significanter te maken'],
          answer: 'Zodat drift in de tijd niet op een factoreffect lijkt',
          why: 'Opwarmen, gereedschapsslijtage en materiaalcharges veranderen in de tijd; een willekeurige volgorde verdeelt ze over alle factoren.',
        },
      ],
      situation: {
        scene: 'Je bent bij een lijmlijn. De procesengineer heeft drie weken lang lijmhoeveelheid, uithardtijd en uithardtemperatuur één voor één getest, en de hechtsterkte is nog steeds instabiel.',
        ask: 'Wat stel je voor?',
        model: 'Kunnen we in plaats daarvan een factoriële proef op twee niveaus doen met de drie factoren: 8 runs, één keer herhaald, in willekeurige volgorde? Dan zie je elk hoofdeffect en elke interactie, bijvoorbeeld dat de temperatuur alleen helpt bij een langere uithardtijd. Voordat we beginnen: hoeveel varieert de hechtsterkte tussen herhalingen op dezelfde instelling? Anders kunnen we een effect niet van ruis onderscheiden.',
        rubric: [
          'Stelt een kleine factoriële proef voor met het juiste aantal runs',
          'Noemt randomiseren en herhalen van runs',
          'Vraagt naar de ruis tussen herhalingen voordat effecten beoordeeld worden',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden met een 2×2-voorbeeld uit wat een interactie is.',
      terms: [
        { term: 'Factor en niveau', def: 'Een instelling die je varieert, en de waarden waarop je hem test.' },
        { term: 'Hoofdeffect', def: 'Gemiddelde respons op het hoge niveau van een factor min het gemiddelde op het lage niveau.' },
        { term: 'Interactie', def: 'Als het effect van de ene factor afhangt van het niveau van de andere.' },
        { term: 'OFAT', def: 'One factor at a time: instellingen één voor één veranderen, waardoor je interacties mist.' },
      ],
    },
    {
      id: 'eng.improve.verify',
      title: 'De fix verifiëren',
      pre: [
        {
          q: 'Een defect kwam ongeveer één keer per maand voor. Na een fix is het 3 weken niet meer gezien. Wat bewijst dat?',
          options: ['De fix werkt', 'Bijna niks; 3 weken is korter dan de normale tussenpoos', 'De fix werkt in de dagdienst', 'Het defect is naar een ander product verhuisd'],
          answer: 'Bijna niks; 3 weken is korter dan de normale tussenpoos',
          why: 'Bij een defect dat eens per maand optreedt, zie je ook zonder fix vaak 3 rustige weken.',
        },
      ],
      teach: [
        'Het sterkste bewijs voor een grondoorzaak is het probleem aan- en uitzetten. Breng de oude situatie terug, als dat veilig en goedkoop kan, en het defect komt terug. Haal haar weg, en het defect verdwijnt. Kan dat niet, laat dan zien dat het foutpercentage de oorzaak volgt, bijvoorbeeld scheuren die toenemen met gereedschapsslijtage. “Het stopte na de fix” is zwakker, want er verandert vaak meer tegelijk.',
        'Valideer in productie over genoeg volume. Vergelijk wat je ziet met wat je zonder fix zou verwachten. Oud foutpercentage 1%, sindsdien 1.500 delen: dan verwacht je zo’n 15 fouten, dus nul is sterk bewijs. Na 100 delen verwacht je er maar 1, dus dan zegt nul weinig. Zeldzame problemen vragen geduld.',
        'Het escape point is de plek in het proces, zo dicht mogelijk bij de grondoorzaak, waar het defect gevangen had moeten worden en dat niet gebeurde. Los dat ook op: waarom miste de controle het? Was het meetmiddel niet capabel, de controle te weinig frequent, de steekproef te klein? Een goede 8D sluit zowel de oorzaak als de ontsnapping.',
        'Voorkom herhaling elders. Pas de PFMEA, het control plan, de werkinstructies en het onderhoudsplan aan. Doe daarna de read-across: hetzelfde machinetype, hetzelfde ontwerpdetail, dezelfde leverancier, andere vestigingen. De vraag die een te smalle fix blootlegt: “Waar hebben we dit nog meer, en hebben we dat gecheckt?”',
      ],
      example: {
        kind: 'faded',
        text: 'Puntgelaste beugels scheurden bij een klant. Grondoorzaak: een versleten elektrodetip op lastang 4 nadat het tipfrezen was overgeslagen. De fix: automatisch tipfrezen elke 200 lassen. Vooraf werd zo’n 0,5% scheuren gevonden. Twee weken en 1.200 beugels na de fix: geen scheuren. Het team wil de 8D sluiten. De fabriek heeft 12 lastangen met dezelfde besturing, een zusterfabriek heeft er 8.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Het volume is veelbelovend: bij 0,5% zou je op 1.200 delen zo’n 6 scheuren zien, dus nul is echt bewijs. Maak het sterker met aan/uit-bewijs: las een kleine testserie met een bewust versleten tip en bevestig dat de scheuren terugkomen, en dat ze verdwijnen met een gefreesde tip. Sluit de ontsnapping: waarom miste de beitelproef aan het eind van de lijn de scheuren? Check frequentie en steekproefgrootte. Doe dan de read-across: staan de andere 11 lastangen en de 8 in de zusterfabriek ook op automatisch frezen? Pas PFMEA, control plan en onderhoudsplan aan voordat je sluit.',
      },
      said: 'Wat engineers zeggen: “Kun je het aan- en uitzetten? Zo niet, dan heb je een correlatie, geen grondoorzaak.”',
      recall: [
        {
          q: 'Het foutpercentage was vóór de fix 0,5%. Sinds de fix zijn er 2.000 delen gemaakt. Hoeveel fouten verwacht je als de fix niks deed?',
          number: 10,
          tolerance: 0.5,
          unit: 'fouten',
          why: '2.000 × 0,005 = 10; nul zien is sterk bewijs dat de fix werkt.',
        },
        {
          q: 'Wat is het sterkste bewijs dat je de grondoorzaak hebt?',
          options: ['Je kunt het defect aan- en uitzetten door de oorzaak toe te voegen en weg te halen', 'Het defect stopte na de fix', 'De senior engineer is het ermee eens', 'De klant heeft de 8D geaccepteerd'],
          answer: 'Je kunt het defect aan- en uitzetten door de oorzaak toe te voegen en weg te halen',
          why: 'Aan/uit-controle sluit toeval en andere gelijktijdige wijzigingen uit.',
        },
        {
          q: 'Wat is read-across?',
          options: ['De 8D hardop voorlezen aan het team', 'De klachtendata van de klant controleren', 'De fix en de controles toepassen op vergelijkbare machines, producten en vestigingen', 'De resultaten van twee operators vergelijken'],
          answer: 'De fix en de controles toepassen op vergelijkbare machines, producten en vestigingen',
          why: 'Dezelfde oorzaak zit vaak ook in zustermachines en vergelijkbare ontwerpen.',
        },
        {
          q: 'Wat is het escape point?',
          options: ['De stap waar het defect ontstaat', 'De laatste inspectie voor verzending', 'De ingangscontrole van de klant', 'De plek zo dicht mogelijk bij de grondoorzaak waar het defect gevangen had moeten worden'],
          answer: 'De plek zo dicht mogelijk bij de grondoorzaak waar het defect gevangen had moeten worden',
          why: 'Als je de detectie daar verbetert, komt het volgende onbekende probleem minder ver.',
        },
      ],
      situation: {
        scene: 'Je zit in een 8D-afsluitoverleg bij een klant. De fix voor een lekkende slangkoppeling, een nieuwe krimphoogte, staat er één week in. De kwaliteitsmanager wil de 8D sluiten en door.',
        ask: 'Wat vraag je voordat je sluit?',
        model: 'Hoeveel koppelingen hebben we sinds de fix gemaakt, en hoeveel lekkages hadden we bij het oude percentage verwacht? Hebben we laten zien dat de verkeerde krimphoogte het lek terugbrengt? Waarom miste de lektest deze delen? En gebruiken de andere krimpmachines en slangvarianten dezelfde instelling, zodat we een read-across kunnen doen?',
        rubric: [
          'Zet het volume sinds de fix af tegen het verwachte aantal fouten',
          'Vraagt om aan/uit-bewijs en naar het escape point',
          'Vraagt om read-across naar andere machines of varianten',
        ],
      },
      sayIt: 'Leg een kwaliteitsmanager in 60 seconden uit waarom “het is niet meer teruggekomen” nog geen bewijs is.',
      terms: [
        { term: 'Aan/uit-verificatie', def: 'Een oorzaak bewijzen door het defect bewust te laten terugkomen en verdwijnen.' },
        { term: 'Escape point', def: 'De plek zo dicht mogelijk bij de grondoorzaak waar het defect gedetecteerd had moeten worden.' },
        { term: 'Read-across', def: 'Een fix en de bijbehorende controles doorvoeren op vergelijkbare machines, producten en locaties.' },
      ],
    },
    {
      id: 'eng.improve.facilitate',
      title: 'Een grondoorzaaksessie begeleiden',
      pre: [
        {
          q: 'In een grondoorzaaksessie noemt de meest senior engineer in de eerste vijf minuten de oorzaak. Wat gebeurt er meestal daarna?',
          options: ['Het team test het snel en gaat door', 'De anderen spreken het openlijk tegen', 'De anderen komen niet meer met alternatieven', 'De sessie eindigt vroeg met het juiste antwoord'],
          answer: 'De anderen komen niet meer met alternatieven',
          why: 'Een vroeg antwoord van iemand met gezag verankert de groep; stillere mensen met nuttige feiten zeggen niks meer.',
        },
      ],
      teach: [
        'Als niet-engineer ben jij eigenaar van het proces, niet van het antwoord. Bereid voor: een probleemstelling met cijfers, de data uitgesplitst per machine en in de tijd, en de echte foute delen op tafel. Nodig de mensen uit die het probleem aanraken: operator, insteller, onderhoud, kwaliteit en de procesengineer. Houd de sessie op zo’n 60 tot 90 minuten (een vuistregel).',
        'Houd het feitelijk. Verdeel het bord in drie kolommen: feiten, theorieën en open vragen. Noemt iemand een oorzaak, vraag dan “hoe weten we dat?” en “wat zouden we zien als dat klopt?” Een feit heeft data of een deel dat je kunt vasthouden. Al het andere is een theorie tot het getest is.',
        'De expert die het “al weet” heeft vaak gelijk, en je hebt hem nodig. Zet zijn idee als eerste theorie op het bord, bedank hem, en vraag dan: “Wat zou dit uitsluiten?” en “Verklaart het waarom lijn 1 goed is?” Je gaat niet op inhoud de strijd aan; je houdt iedereen aan dezelfde lat van bewijs.',
        'Snap je iets niet, zeg dat en gebruik het: “Leg het uit zoals je het aan een nieuwe operator zou uitleggen,” of “Teken het eens voor me.” Herhaal het daarna in je eigen woorden. Sluit elke sessie af met bij elke theorie een test, een eigenaar en een datum. Een sessie die eindigt met alleen meningen heeft zijn werk niet gedaan.',
      ],
      example: {
        kind: 'faded',
        text: 'Je begeleidt een sessie over steeds terugkerende lagerschade aan een koelwaterpomp: zes storingen in vier maanden. Aanwezig: de TD-chef, twee monteurs, de procesengineer, inkoop en een operator. Na tien minuten zegt de TD-chef: “Het zijn die goedkope lagers waar inkoop naar is overgestapt. Dit heb ik honderd keer gezien.” Inkoop loopt rood aan, de monteurs vallen stil.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Schrijf “ander lagermerk” in de kolom theorieën en bedank hem: het is een serieuze kandidaat. Maak er dan een test van: wanneer is het merk gewisseld, en volgen de storingsdata die wissel? Draaien dezelfde lagers zonder problemen in andere pompen? Vraag de monteurs wat ze zagen aan de kapotte lagers: slijtagebeeld, verkleuring, smering. Vraag de operator wat er veranderde in hoe de pomp draait. Verzamel andere theorieën, zoals uitlijning, smeerinterval en draaien buiten het ontwerppunt, en geef elke theorie een test, een eigenaar en een datum, inclusief een schadeanalyse van het volgende lager.',
      },
      said: 'Wat engineers zeggen: “Ik weet al wat het is, daar hebben we geen hele sessie voor nodig.” Jouw antwoord: “Mooi, laten we dan opschrijven wat het zou bewijzen.”',
      recall: [
        {
          q: 'Welke drie kolommen houden een grondoorzaakbord feitelijk?',
          options: ['Oorzaken, oplossingen, eigenaren', 'Machines, mensen, materialen', 'Feiten, theorieën, open vragen', 'Goed, fout, onbekend'],
          answer: 'Feiten, theorieën, open vragen',
          why: 'Feiten scheiden van theorieën voorkomt dat meningen als bewijs gaan tellen.',
        },
        {
          q: 'Een senior engineer zegt dat hij de oorzaak al weet. Wat is de beste reactie?',
          options: ['Hem vragen weg te gaan zodat anderen kunnen praten', 'Het als theorie noteren en vragen welk bewijs het zou bevestigen of uitsluiten', 'Het accepteren en naar acties gaan', 'Zijn technische redenering direct aanvallen'],
          answer: 'Het als theorie noteren en vragen welk bewijs het zou bevestigen of uitsluiten',
          why: 'Zo houd je de expert erbij en leg je zijn idee langs dezelfde lat als de rest.',
        },
        {
          q: 'Waarom vraag je “wat zouden we zien als dat klopt?”',
          options: ['Om het overleg te vertragen', 'Om te laten zien dat je de techniek kent', 'Om uit te zoeken wie verantwoordelijk is', 'Om een mening om te zetten in iets wat je kunt checken'],
          answer: 'Om een mening om te zetten in iets wat je kunt checken',
          why: 'Een theorie met een voorspelde waarneming kun je testen met data of een deel.',
        },
        {
          q: 'Waarmee hoort een grondoorzaaksessie te eindigen?',
          options: ['Bij elke theorie een test, een eigenaar en een datum', 'Overeenstemming over de grondoorzaak', 'Een lijst met ieders mening', 'Een nieuwe datum voor de volgende sessie'],
          answer: 'Bij elke theorie een test, een eigenaar en een datum',
          why: 'De sessie versmalt de theorieën; de tests bewijzen de oorzaak.',
        },
      ],
      situation: {
        scene: 'Je bent in de fabriek van een klant en leidt een grondoorzaaksessie over krassen op gelakte panelen. De lakstraatengineer gebruikt steeds termen die je niet kent en zegt dat het “overduidelijk de haken van de transporteur” zijn. De operators zeggen niks.',
        ask: 'Wat doe je?',
        model: 'Ik vraag de engineer de hakentheorie uit te leggen zoals hij dat aan een nieuwe operator zou doen, en ik herhaal het in mijn eigen woorden. Dan zet ik het als eerste theorie op het bord en vraag wat we zouden zien als het klopt: krassen op dezelfde plek op elk paneel, in alle kleuren? Ik vraag de operators direct waar ze de krassen het eerst zien. Voordat we afsluiten krijgt elke theorie een check, een eigenaar en een datum.',
        rubric: [
          'Vraagt de expert het in gewone woorden uit te leggen en herhaalt het',
          'Maakt van de claim van de expert een toetsbare theorie',
          'Betrekt de stille operators en sluit af met tests, eigenaren en data',
        ],
      },
      sayIt: 'Leg een nieuwe collega in 60 seconden uit hoe je een grondoorzaaksessie leidt als je minder van de techniek weet dan iedereen in de ruimte.',
      terms: [
        { term: 'Anchoring (verankering)', def: 'Als een vroeg antwoord, vaak van een senior persoon, beperkt wat de groep nog overweegt.' },
        { term: 'Theorie tegenover feit', def: 'Achter een feit zit data of een deel; een theorie heeft nog een test nodig.' },
      ],
    },
  ],
};

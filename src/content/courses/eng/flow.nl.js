// eng.flow (NL): Capaciteit en flow: takt, bottlenecks, OEE, omstellen, lijnbalancering, capaciteit.
export default {
  lessons: [
    {
      id: 'eng.flow.takt',
      title: 'Takt, cyclustijd en doorlooptijd',
      pre: [
        {
          q: 'Een beugel krijgt 4 minuten echte bewerking. Hoe lang zit hij meestal in de fabriek, van plaatstaal tot verzending?',
          options: ['Ongeveer 4 minuten', 'Ongeveer een uur', 'Een paar dagen', 'Precies één dienst'],
          answer: 'Een paar dagen',
          why: 'Het grootste deel van de doorlooptijd is wachten in buffers en voorraad; bewerken is vaak minder dan 1%.',
        },
      ],
      teach: [
        'Takttijd is beschikbare tijd gedeeld door de klantvraag: het tempo waarin de klant afneemt. Beschikbare tijd is diensttijd min geplande pauzes en overleg, niet min storingen, want die verliezen moet de lijn zelf opvangen. Een dienst van 7,5 netto uur is 27.000 seconden; bij een vraag van 450 stuks is de takt 60 seconden.\n\nTakt hangt af van de vraag, niet van de machine. Verandert de vraag, dan verandert de takt.',
        'Cyclustijd is hoe vaak er echt een product van een station of lijn afkomt: de tijd tussen twee goede producten.\n\nLigt de cyclustijd boven de takt, dan haal je de vraag niet en heb je overwerk, een extra dienst of meer capaciteit nodig. Engineers plannen de cyclustijd meestal op 85 tot 90% van de takt, zodat er ruimte is voor stops en uitval.',
        'Doorlooptijd is hoe lang één product erover doet van grondstof tot verzending, wachten meegerekend. Een onderdeel met 4 minuten bewerking heeft vaak 3 tot 10 dagen doorlooptijd, omdat het in buffers (kleine voorraden tussen de stappen), voorraad en wachtrijen staat.\n\nEen lange doorlooptijd is bijna altijd een wachtprobleem, geen snelheidsprobleem van de machine.',
        '“Cyclustijd” betekent voor iedereen iets anders: de machinecyclus (spil draait), de cyclus van de operator, of de tijd tussen producten die de lijn verlaten. Vraag altijd welke.\n\nEen robotcyclus van 38 seconden kan nog steeds een product per 45 seconden opleveren als je laden en afkeur meetelt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een verpakkingslijn moet 2.400 dozen per week leveren, 5 dagen, één dienst van 8 uur. Pauzes: 2 × 15 minuten plus een startoverleg van 10 minuten.\n\nBeschikbare tijd per dag: 480 − 40 = 440 minuten = 26.400 seconden. Vraag per dag: 2.400 / 5 = 480 dozen. Takt = 26.400 / 480 = 55 seconden.\n\nDe lijn maakt elke 52 seconden een doos: hij haalt het, maar met maar 3 seconden (5%) marge, dus een paar storinkjes per dienst en je loopt achter. De doorlooptijd is 3 dagen, omdat de dozen in het magazijn wachten.',
      },
      said: 'Wat engineers zeggen: “We draaien 52 seconden op een takt van 55, dus één slecht uur en we lopen de hele dag achter.”',
      recall: [
        {
          q: 'De vraag is 600 stuks per dienst. De netto beschikbare tijd is 450 minuten. Wat is de takt, in seconden?',
          number: 45,
          tolerance: 1,
          unit: 's',
          why: '450 × 60 = 27.000 seconden; 27.000 / 600 = 45 seconden.',
        },
        {
          q: 'De klantvraag daalt met 20%. Wat gebeurt er met de takt?',
          options: ['De takt wordt korter', 'De takt blijft gelijk, die bepaalt de machine', 'De takt wordt langer', 'De cyclustijd wordt vanzelf langer'],
          answer: 'De takt wordt langer',
          why: 'Dezelfde beschikbare tijd gedeeld door minder stuks: de klant trekt langzamer.',
        },
        {
          q: 'Welke is voor één product meestal veruit het grootst?',
          options: ['Cyclustijd', 'Doorlooptijd', 'Takttijd', 'Machinetijd'],
          answer: 'Doorlooptijd',
          why: 'Doorlooptijd telt al het wachten tussen de stappen mee, en dat is veel meer dan de bewerking.',
        },
        {
          q: 'Een station heeft een cyclustijd van 70 seconden bij een takt van 60. Wat betekent dat?',
          options: ['Het haalt de vraag niet zonder extra tijd of capaciteit', 'Het is snel genoeg, met 10 seconden marge', 'De takt moet naar 70 seconden', 'Het station is kapot'],
          answer: 'Het haalt de vraag niet zonder extra tijd of capaciteit',
          why: 'Cyclustijd boven takt betekent dat het station bij elk product verder achterloopt.',
        },
      ],
      situation: {
        scene: 'Je loopt door de fabriek bij een automotive toeleverancier. De productiemanager zegt: “Onze takt is 40 seconden.” Op het scherm bij de robotcel staat een cyclustijd van 38 seconden.',
        ask: 'Wat vraag je om te weten of deze cel het echt bijhoudt?',
        model: 'Is die 40 seconden gebaseerd op de huidige vraag en de netto tijd na pauzes? En is die 38 seconden de robotcyclus, of de echte tijd tussen twee goede producten uit de cel, inclusief laden en afkeur? Als het alleen de robot is, zit het echte interval misschien al boven de takt, en met 5% marge is er sowieso weinig ruimte.',
        rubric: [
          'Vraagt hoe de takt is berekend (vraag en netto beschikbare tijd)',
          'Maakt onderscheid tussen machinecyclus en het echte interval tussen goede producten',
          'Ziet dat 2 seconden (5%) marge krap is',
        ],
      },
      sayIt: 'Leg een nieuwe planner in 60 seconden het verschil uit tussen takt, cyclustijd en doorlooptijd.',
      terms: [
        { term: 'Takttijd', def: 'Netto beschikbare tijd gedeeld door de klantvraag: het tempo dat je nodig hebt.' },
        { term: 'Cyclustijd', def: 'De echte tijd tussen twee goede producten van een station of lijn.' },
        { term: 'Doorlooptijd', def: 'De totale tijd die één product in het proces zit, wachten meegerekend.' },
      ],
    },
    {
      id: 'eng.flow.bottleneck',
      figure: 'eng.flow.line',
      title: 'De bottleneck bepaalt de output',
      pre: [
        {
          q: 'Een product gaat langs vier stations op een rij. Elk station doet per product: 40, 55, 45 en 50 seconden. Je versnelt het eerste station van 40 naar 30 seconden. Wat gebeurt er met de output?',
          options: ['Die stijgt met zo’n 25%', 'Niets', 'Die stijgt met 10 seconden per product', 'Die daalt'],
          answer: 'Niets',
          why: 'Het station van 55 seconden beperkt de lijn nog steeds tot één product per 55 seconden.',
        },
      ],
      teach: [
        'Een lijn produceert nooit sneller dan zijn langzaamste stap: de bottleneck, of constraint.\n\nStations van 40, 55 en 45 seconden geven één product per 55 seconden, zo’n 65 per uur. Het station van 40 seconden sneller maken levert niks op, dat staat alleen nog meer te wachten.',
        'Hoe herken je hem: onderhanden werk (WIP) stapelt zich op vóór hem, het station erna staat te wachten op product (starved), en de bottleneck zelf staat bijna nooit stil.\n\nLet op: een grote stapel kan ook nog van een storing komen. Het echte teken is welke machine continu draait.',
        'Een uur verloren op de bottleneck is een uur verloren voor de hele fabriek. Een uur gewonnen ergens anders is een luchtspiegeling.\n\nDus bescherm de bottleneck: een kleine voorraad ervoor, pauzes laten aflossen zodat hij doordraait, een kwaliteitscheck ervoor zodat hij nooit afkeur bewerkt, en onderhoud eromheen plannen.',
        'De wet van Little koppelt voorraad aan tijd: doorlooptijd = WIP / throughput, waarbij throughput de goede output per uur is.\n\nMet 300 stuks in het systeem en een output van 60 per uur is de doorlooptijd 5 uur. Breng de WIP terug naar 120 en de doorlooptijd zakt naar 2 uur, zonder dat er één machine sneller gaat.',
        'Bottlenecks verschuiven. Los je er één op, dan neemt de op-één-na-langzaamste het over. Ook een andere productmix kan hem verplaatsen, omdat sommige producten op de ene machine veel langer duren dan op de andere.',
      ],
      example: {
        kind: 'worked',
        text: 'Een bewerkingscel: zagen 30 seconden, CNC 90 seconden, ontbramen 45 seconden, wassen 40 seconden. Output = 3.600 / 90 = 40 stuks per uur, bepaald door de CNC.\n\nEr zitten 480 stuks in de cel, waarvan 360 wachten vóór de CNC. Wet van Little: 480 / 40 = 12 uur doorlooptijd.\n\nEen snellere ontbraammachine kopen: nul winst. Een tweede CNC erbij: de CNC-stap levert nu elke 45 seconden een product, ontbramen wordt de bottleneck op 45 seconden, en de output gaat naar 80 per uur, precies het dubbele.',
      },
      said: 'Wat engineers zeggen: “Laat die wasser maar, de CNC is de bottleneck. Elke minuut dat die stilstaat ben je kwijt.”',
      recall: [
        {
          q: 'Een product gaat langs vier stations op een rij. Elk station doet per product: 35, 48, 60 en 42 seconden. Hoeveel stuks per uur maakt de lijn?',
          number: 60,
          tolerance: 1,
          unit: 'stuks/uur',
          why: 'Het station van 60 seconden is de bottleneck: 3.600 / 60 = 60 stuks per uur.',
        },
        {
          q: 'Er zit 600 stuks WIP in een proces met een throughput van 50 stuks per uur. Wat is de doorlooptijd, in uren?',
          number: 12,
          tolerance: 0.5,
          unit: 'uur',
          why: 'Wet van Little: doorlooptijd = WIP / throughput = 600 / 50 = 12 uur.',
        },
        {
          q: 'Welk teken wijst het betrouwbaarst naar de bottleneck?',
          options: ['De duurste machine', 'Het station met de meeste operators', 'Het station met de meeste storingsmeldingen', 'Het station dat nooit op product wacht en een wachtrij vóór zich heeft'],
          answer: 'Het station dat nooit op product wacht en een wachtrij vóór zich heeft',
          why: 'De bottleneck draait continu; de stations eromheen wachten of lopen vast.',
        },
        {
          q: 'Je zet een tweede CNC naast de CNC die de bottleneck is. Verdubbelt de output?',
          options: ['Ja, altijd', 'Alleen als alle andere stations het bijhouden; anders wordt de op-één-na-langzaamste de bottleneck', 'Nee, de output blijft gelijk', 'Alleen als de WIP stijgt'],
          answer: 'Alleen als alle andere stations het bijhouden; anders wordt de op-één-na-langzaamste de bottleneck',
          why: 'De bottleneck verschuift; de output stijgt tot het tempo van de nieuwe langzaamste stap.',
        },
      ],
      situation: {
        scene: 'Je zit bij een klant in de voedingsmiddelenindustrie. Het team wil een snellere etiketteermachine kopen van €80.000, “want daar gaat het altijd mis”.',
        ask: 'Wat vraag je voordat ze de order tekenen?',
        model: 'Welk station draait continu en heeft een wachtrij vóór zich? Als de etiketteerder de helft van de tijd op product staat te wachten, levert een snellere geen enkel stuk extra op. Kunnen we een week output- en stilstanddata per station trekken, en uitrekenen hoeveel stuks per uur extra die €80.000 echt oplevert?',
        rubric: [
          'Vraagt waar de WIP zich ophoopt en welk station nooit stilvalt door gebrek aan product',
          'Koppelt de investering aan extra throughput, niet aan lokale snelheid',
          'Vraagt om data: stilstandregistratie en cyclustijden per station',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom een niet-bottleneck versnellen de output niet verhoogt.',
      terms: [
        { term: 'Bottleneck', def: 'De langzaamste stap, die de output van de hele lijn bepaalt.' },
        { term: 'WIP', def: 'Onderhanden werk: producten die gestart maar nog niet af zijn.' },
        { term: 'Wet van Little', def: 'Doorlooptijd = WIP / throughput.' },
        { term: 'Starved / blocked', def: 'Een station dat op aanvoer wacht / zijn product niet kwijt kan.' },
      ],
    },
    {
      id: 'eng.flow.oee',
      title: 'OEE en de zes grote verliezen',
      pre: [
        {
          q: 'Een machine scoort 90% op beschikbaarheid, 90% op performance en 90% op kwaliteit. Wat is de OEE?',
          options: ['90%', '81%', '270%', '73%'],
          answer: '73%',
          why: 'Je vermenigvuldigt: 0,9 × 0,9 × 0,9 = 0,73.',
        },
      ],
      teach: [
        'OEE = beschikbaarheid × performance × kwaliteit.\n\nBeschikbaarheid = looptijd / geplande productietijd (verlies door storingen en omstellen). Performance = ideale cyclustijd (de snelste bewezen tijd per stuk) × gemaakte stuks / looptijd (verlies door langzaam draaien en microstops). Kwaliteit = goede stuks / gemaakte stuks (verlies door afkeur en herbewerking).\n\nVermenigvuldigen, nooit middelen. Snelle check: OEE = goede stuks × ideale cyclustijd / geplande tijd.',
        'De zes grote verliezen. Beschikbaarheid: storingen, en omstellen en afstellen. Performance: microstops (vastlopers korter dan zo’n 5 minuten) en verlaagde snelheid. Kwaliteit: opstartafkeur en productieafkeur.\n\nMicrostops zijn de verborgen post: niemand vult een formulier in voor een vastloper van 40 seconden, maar 30 daarvan per dienst is 20 minuten.',
        'Wat is goed? 85% is het bekende “world class” getal (90% × 95% × 99,9%). Eerlijk gemeten zit je in de discrete maakindustrie meestal op 40 tot 60%.\n\nEen fabriek die 90% rapporteert, rekent zich meestal rijk: omstellen niet meetellen in de geplande tijd, of een trage “ideale” cyclustijd gebruiken.',
        '100% bestaat niet: geen enkele stop, elk product op ideale snelheid, nul afkeur. Dat gebeurt nooit.\n\nEn OEE meet je per machine of lijn: hem verhogen op een niet-bottleneck levert alleen meer WIP op. De vragen die ertoe doen: OEE van welke machine, tegen welke ideale cyclustijd, en wat laat je buiten de geplande tijd?',
      ],
      example: {
        kind: 'worked',
        text: 'Dienst van 480 minuten met 30 minuten pauze: geplande tijd 450 minuten. Storingen 30 minuten, één omstelling 45 minuten: looptijd 375 minuten. Beschikbaarheid = 375 / 450 = 83,3%.\n\nIdeale cyclus 30 seconden, 600 stuks gemaakt: 300 ideale minuten. Performance = 300 / 375 = 80%. Van de 600 stuks zijn er 570 goed: kwaliteit = 95%.\n\nOEE = 0,833 × 0,80 × 0,95 = 63,3%. Check: 570 × 0,5 minuut / 450 = 63,3%.\n\nWaar bleef de tijd? Beschikbaarheid kost 75 minuten (storingen en de omstelling), performance ook 75 minuten (microstops en langzaam draaien), kwaliteit maar 15 minuten (30 slechte stuks × 0,5 minuut). Er zijn dus twee grote hefbomen, niet één.',
      },
      said: 'Wat engineers zeggen: “Beschikbaarheid is prima, het zijn de microstops die onze performance slopen. Niemand registreert een vastloper van 30 seconden.”',
      recall: [
        {
          q: 'Beschikbaarheid 80%, performance 90%, kwaliteit 95%. Wat is de OEE, in procent?',
          number: 68.4,
          tolerance: 0.5,
          unit: '%',
          why: '0,80 × 0,90 × 0,95 = 0,684.',
        },
        {
          q: 'Geplande tijd 400 minuten, ideale cyclustijd 30 seconden, 600 goede stuks. Wat is de OEE, in procent?',
          number: 75,
          tolerance: 1,
          unit: '%',
          why: '600 × 0,5 minuut = 300 minuten goede output; 300 / 400 = 75%.',
        },
        {
          q: 'Een klant meldt een OEE van 92% op een verpakkingslijn. Wat is de beste eerste vraag?',
          options: ['Welke lijn is jullie beste?', 'Kunnen we naar 100%?', 'Wat laten jullie buiten de geplande tijd, en welke ideale cyclustijd gebruiken jullie?', 'Waarom is het niet hoger?'],
          answer: 'Wat laten jullie buiten de geplande tijd, en welke ideale cyclustijd gebruiken jullie?',
          why: 'Een heel hoge OEE komt meestal doordat verliezen buiten de geplande tijd blijven, of door een trage ideale cyclus.',
        },
        {
          q: 'Welke verliezen vallen onder performance?',
          options: ['Microstops en verlaagde snelheid', 'Omstellen', 'Opstartafkeur', 'Een storing van 2 uur'],
          answer: 'Microstops en verlaagde snelheid',
          why: 'Omstellen en storingen zijn beschikbaarheid; afkeur is kwaliteit.',
        },
      ],
      situation: {
        scene: 'Je zit in de dagstart bij een voedingsmiddelenfabriek. De OEE van lijn 3 is deze week gezakt van 68% naar 61%. De ploegleider zegt: “De machine is gewoon oud.”',
        ask: 'Hoe breng je het gesprek van mening naar oorzaak?',
        model: 'Welke van de drie is gezakt: beschikbaarheid, performance of kwaliteit? Als het performance is, kijken we naar microstops en snelheid; als het beschikbaarheid is, welke storingen of omstellingen. Kunnen we de stilstandregistratie van deze week naast die van vorige week leggen, per oorzaak?',
        rubric: [
          'Splitst OEE in beschikbaarheid, performance en kwaliteit',
          'Vraagt om verliesdata per oorzaak, deze week tegenover vorige week',
          'Neemt geen vage oorzaak aan zonder data',
        ],
      },
      sayIt: 'Leg een nieuwe teamleider in 60 seconden uit wat OEE is en waarom 100% niet het doel is.',
      terms: [
        { term: 'OEE', def: 'Overall equipment effectiveness: beschikbaarheid × performance × kwaliteit.' },
        { term: 'Ideale cyclustijd', def: 'De snelste bewezen tijd per stuk; de meetlat voor performance.' },
        { term: 'Microstops', def: 'Korte vastlopers en stops, meestal onder 5 minuten en zelden geregistreerd.' },
        { term: 'Zes grote verliezen', def: 'Storingen, omstellen, microstops, verlaagde snelheid, opstartafkeur, productieafkeur.' },
      ],
    },
    {
      id: 'eng.flow.changeover',
      title: 'Omstellen en SMED',
      pre: [
        {
          q: 'Een omstelling duurt 60 minuten. Hoeveel kun je daar meestal vanaf halen door alleen voor te bereiden terwijl de machine nog draait, zonder investering?',
          options: ['Vaak 30 tot 50%', 'Bijna niks', 'Zo’n 5%', 'Alles'],
          answer: 'Vaak 30 tot 50%',
          why: 'Gereedschap, matrijzen en papieren halen tijdens de stop is heel gewoon en makkelijk naar voren te halen.',
        },
      ],
      teach: [
        'Omsteltijd loopt van het laatste goede product A tot het eerste goede product B op volle snelheid. Dus de proefruns en het afstellen aan het eind tellen mee, en daar zit veel verborgen tijd.',
        'Intern werk kan alleen als de machine stilstaat: de matrijs (het gereedschap dat het product vormt) wisselen. Extern werk kan terwijl hij draait: de volgende matrijs halen, voorverwarmen, gereedschap en papieren klaarleggen.\n\nSMED (single-minute exchange of die: omstellen in minder dan 10 minuten) gaat in stappen: film een omstelling en schrijf elke stap op; markeer intern of extern; haal extern werk uit de stop; maak intern werk extern (matrijzen voorverwarmen, gereedschap offline voorinstellen); stroomlijn daarna met snelspanners in plaats van bouten.',
        'Afstellen is de killer: proberen en bijstellen is vaak de helft van een omstelling.\n\nDe technische oplossing: vaste aanslagen, paspennen, standaard matrijshoogtes en instelkaarten, zodat de instelling in één keer goed is. Moeten afstellen betekent dat de instelling niet vastligt.',
        'De afweging met seriegrootte: de gemiddelde voorraad is ongeveer een halve serie. Bij lange omsteltijden draaien planners grote series om minder tijd te verliezen, en dan groeien voorraad en doorlooptijd.\n\nHalveer de omsteltijd en je kunt de serie halveren bij hetzelfde tijdverlies: de helft minder voorraad. Of houd de serie gelijk en win capaciteit, maar dat loont alleen op de bottleneck.',
      ],
      example: {
        kind: 'worked',
        text: 'Spuitgieten, matrijswissel 90 minuten. De video laat zien: 25 minuten matrijs, kraan en gereedschap halen; 15 minuten koelwater aansluiten; 20 minuten matrijs opwarmen; 30 minuten proefschoten.\n\nAlles vooraf klaarzetten scheelt 25 minuten. Voorverwarmen op een opwarmstation scheelt 20. Snelkoppelingen brengen het water van 15 naar 5 minuten.\n\nNieuwe omsteltijd: 5 + 30 = 35 minuten. Bij 4 omstellingen per dag levert dat 220 minuten op, of je draait 8 kleinere series per dag voor 280 minuten in plaats van de oude 360.',
      },
      said: 'Wat engineers zeggen: “De helft van onze omsteltijd staan we te wachten op de heftruck met de volgende matrijs. Dat is extern werk dat we intern doen.”',
      recall: [
        {
          q: 'Welke van deze is extern werk?',
          options: ['De oude matrijs losschroeven', 'De volgende matrijs voorverwarmen op een apart station', 'Proefschieten tot de producten binnen spec zijn', 'De opspanplaten wisselen'],
          answer: 'De volgende matrijs voorverwarmen op een apart station',
          why: 'Dat kan terwijl de machine nog het vorige product maakt.',
        },
        {
          q: 'Een machine heeft 4 omstellingen per dag van 50 minuten. Met SMED gaan ze naar 20 minuten. Hoeveel minuten per dag komen er vrij?',
          number: 120,
          tolerance: 1,
          unit: 'minuten',
          why: '4 × (50 − 20) = 120 minuten.',
        },
        {
          q: 'Omstellen duurt 30 minuten. De netto tijd is 15 uur per dag, en maximaal 10% mag naar omstellen. Hoeveel omstellingen passen er per dag?',
          number: 3,
          tolerance: 0.1,
          unit: 'omstellingen',
          why: '10% van 900 minuten = 90 minuten; 90 / 30 = 3 omstellingen.',
        },
        {
          q: 'Waarom verlaagt een kortere omsteltijd de voorraad?',
          options: ['Je hebt minder operators nodig', 'De machine draait sneller', 'De afkeur verdwijnt', 'Je kunt kleinere series draaien bij hetzelfde tijdverlies, dus er wacht minder voorraad'],
          answer: 'Je kunt kleinere series draaien bij hetzelfde tijdverlies, dus er wacht minder voorraad',
          why: 'De gemiddelde voorraad is ongeveer een halve serie; kleinere series betekenen minder voorraad en kortere doorlooptijd.',
        },
      ],
      situation: {
        scene: 'Je zit bij een verpakkingsbedrijf. De planning wil grotere series omdat omstellen 2 uur duurt. Verkoop klaagt over lange levertijden, en het magazijn staat vol.',
        ask: 'Wat stel je voor voordat de seriegrootte omhoog gaat?',
        model: 'Voordat we grotere series vastleggen: kunnen we één omstelling filmen en die opsplitsen in intern en extern werk? Als we van 2 uur naar 1 uur gaan, kunnen we twee keer zoveel kleinere series draaien voor hetzelfde tijdverlies: minder voorraad en kortere levertijden. En is deze lijn de bottleneck? Zo niet, dan kosten extra omstellingen daar bijna niks.',
        rubric: [
          'Stelt voor een echte omstelling te meten en intern van extern te scheiden',
          'Koppelt omsteltijd aan seriegrootte, voorraad en doorlooptijd',
          'Checkt of de lijn de bottleneck is',
        ],
      },
      sayIt: 'Leg een planner in 60 seconden SMED uit en de afweging met seriegrootte.',
      terms: [
        { term: 'Omsteltijd (changeover)', def: 'Laatste goede product A tot eerste goede product B op volle snelheid.' },
        { term: 'Intern / extern', def: 'Werk waarvoor de machine stil moet / werk dat kan terwijl hij draait.' },
        { term: 'SMED', def: 'Single-minute exchange of die: een methode om omsteltijd te verkorten, liefst tot onder de 10 minuten.' },
      ],
    },
    {
      id: 'eng.flow.balance',
      title: 'Lijnbalancering',
      pre: [
        {
          q: 'Een assemblagelijn heeft 160 seconden werk per product en een takt van 60 seconden. Wat is het minimale aantal stations?',
          options: ['2', '3', '4', '5'],
          answer: '3',
          why: '160 / 60 = 2,7, naar boven afgerond 3. De meeste mensen gokken uit gewoonte 4.',
        },
      ],
      teach: [
        'Lijnbalancering verdeelt de totale werkinhoud over stations, zodat elk station net onder de takt zit.\n\nMinimaal aantal stations = totale werkinhoud / takt, naar boven afgerond. 300 seconden werk bij een takt van 60 seconden vraagt minstens 5 stations.',
        'Een lijn loopt op het tempo van zijn langzaamste station. Stations van 50, 30, 45 en 40 seconden geven een lijncyclus van 50 seconden.\n\nDe rest wacht elke cyclus: wachttijd = 4 × 50 − 165 = 35 seconden. Balansverlies = wachttijd / (stations × langzaamste cyclus) = 35 / 200 = 17,5%.',
        'Eén traag station raakt iedereen. Zit het boven de takt, dan haalt de hele lijn de vraag niet, bouwt er WIP op vóór het station en valt alles erna stil.\n\nSpreiding telt ook: een station dat gemiddeld 55 seconden doet bij een takt van 60, maar tussen 45 en 75 seconden schommelt, houdt de lijn regelmatig op. Het gemiddelde zegt niet genoeg.',
        'Oplossingen: werkelementen van het trage station naar stations met ruimte schuiven, een taak opsplitsen, een tweede operator, of automatiseren. De montagevolgorde beperkt wat kan schuiven: je zet de schroef niet vóór de beugel.\n\nHet standaardplaatje is een Yamazumi: een gestapelde balk per station met de taktlijn erdoor.',
      ],
      example: {
        kind: 'worked',
        text: 'Een assemblagelijn voor e-bike motoren met een takt van 72 seconden. Stations: 65, 80, 50 en 70 seconden, samen 265. Station 2 zit boven de takt, dus de lijncyclus is 80 seconden: 45 motoren per uur in plaats van de benodigde 50.\n\nMinimaal aantal stations: 265 / 72 = 3,7, dus 4 is genoeg. Schuif 12 seconden kabels leggen van station 2 naar station 3: 65, 68, 62, 70. Het langzaamste is nu 70 seconden, onder de takt. Balansverlies = (4 × 70 − 265) / 280 = 5,4%.',
      },
      said: 'Wat engineers zeggen: “Station twee zit boven de takt, kijk maar naar de Yamazumi. Kunnen we het kabels leggen naar drie schuiven?”',
      recall: [
        {
          q: 'De totale werkinhoud is 420 seconden en de takt is 50 seconden. Wat is het minimale aantal stations?',
          number: 9,
          tolerance: 0.1,
          unit: 'stations',
          why: '420 / 50 = 8,4, naar boven afgerond 9.',
        },
        {
          q: 'Een lijn heeft vier stations. Elk station doet per product: 40, 55, 50 en 35 seconden. Wat is het balansverlies, in procent?',
          number: 18.2,
          tolerance: 1,
          unit: '%',
          why: 'Wachttijd = 4 × 55 − 180 = 40; 40 / 220 = 18,2%.',
        },
        {
          q: 'Een station doet gemiddeld 55 seconden bij een takt van 60, maar schommelt tussen 45 en 75 seconden. Wat volgt daaruit?',
          options: ['Prima, het gemiddelde zit onder de takt', 'Zet de takt op 75 seconden', 'De lijn haalt de takt regelmatig niet; verklein de spreiding of zet er een buffer neer', 'Het maakt alleen uit als het het eerste station is'],
          answer: 'De lijn haalt de takt regelmatig niet; verklein de spreiding of zet er een buffer neer',
          why: 'Elke trage cyclus houdt de stations erna op; een gemiddelde verbergt dat.',
        },
        {
          q: 'Waarom kun je niet zomaar elke taak naar elk station schuiven?',
          options: ['Volgorde: sommige taken moeten vóór andere gebeuren', 'De cao verbiedt het', 'De takt houdt het tegen', 'Het balansverlies zou stijgen'],
          answer: 'Volgorde: sommige taken moeten vóór andere gebeuren',
          why: 'De montagevolgorde bepaalt welke werkelementen kunnen schuiven.',
        },
      ],
      situation: {
        scene: 'Je staat bij een assemblagelijn voor warmtepompen die zijn dagtarget niet haalt. De supervisor wil een zevende operator.',
        ask: 'Wat vraag je voordat je instemt met een extra persoon?',
        model: 'Kunnen we de cyclustijd per station tegen de takt zien, in een Yamazumi? Als één station boven de takt zit en andere ruimte hebben, lossen we het misschien op door werk te verschuiven, zonder extra persoon. Als de totale werkinhoud gedeeld door de takt al 7 stations vraagt, dan ja, dan hebben we die operator nodig.',
        rubric: [
          'Vraagt om de cyclustijd per station tegen de takt',
          'Checkt het minimale aantal stations: werkinhoud gedeeld door takt',
          'Overweegt herbalanceren voordat er mensen bij komen',
        ],
      },
      sayIt: 'Leg een supervisor in 60 seconden uit waarom één traag station de hele lijn beperkt.',
      terms: [
        { term: 'Lijnbalancering', def: 'Werkinhoud zo over stations verdelen dat elk net onder de takt zit.' },
        { term: 'Werkinhoud', def: 'De totale tijd van alle taken voor één product.' },
        { term: 'Balansverlies', def: 'Wachttijd als aandeel van stations × langzaamste cyclus.' },
        { term: 'Yamazumi', def: 'Gestapeld staafdiagram van het werk per station, met de taktlijn.' },
      ],
    },
    {
      id: 'eng.flow.capacity',
      title: 'Capaciteit en bezettingsgraad',
      pre: [
        {
          q: 'De bezettingsgraad van een machine gaat van 80% naar 95%. Wat gebeurt er ongeveer met de wachttijd in de rij ervoor?',
          options: ['Die stijgt met zo’n 15%', 'Die verdubbelt ongeveer', 'Die wordt zo’n 5 keer langer', 'Niets'],
          answer: 'Die wordt zo’n 5 keer langer',
          why: 'Wachttijd groeit met u / (1 − u): 4 bij 80%, 19 bij 95%.',
        },
      ],
      teach: [
        'Capaciteit = beschikbare tijd / cyclustijd, gecorrigeerd voor verliezen. Eén dienst van 7,5 netto uur bij een cyclus van 60 seconden is op papier 450 stuks; bij 75% OEE zo’n 340.\n\nPlan op het realistische getal, niet op de papieren capaciteit volgens het typeplaatje. Van twee- naar drieploegendienst geeft 50% meer uren, maar kost nachttoeslag en laat minder tijd over voor onderhoud.',
        'Bezettingsgraad = bezette tijd / beschikbare tijd. Managers willen 100%.\n\nMaar aanvoer en bewerkingstijden variëren, en de wachttijd groeit ongeveer met u / (1 − u). Bij 50% bezetting is die factor 1, bij 80% is het 4, bij 90% is het 9, bij 95% is het 19. In de laatste 10 tot 15% exploderen de wachtrijen.',
        'Plan de bottleneck dus op zo’n 80 tot 85% belasting na OEE, met ruimte voor storingen en spoedorders. Niet-bottlenecks hebben nog meer reserve nodig, zodat ze na een verstoring kunnen inhalen en de bottleneck blijven voeden.\n\nEen fabriek die op 100% is ingepland, heeft lange doorlooptijden en is permanent aan het brandjes blussen.',
        'De vraag waarmee je serieus genomen wordt: wat is de geplande belasting van de bottleneck, in uren, na OEE? Niet tegen papieren uren.\n\nVariatie verminderen (minder storingen, gelijkmatiger aanvoer) is wat je in staat stelt veilig op een hogere belasting te draaien.',
      ],
      example: {
        kind: 'worked',
        text: 'Een CNC-bottleneck moet 1.200 stuks per week maken van 4 minuten per stuk: 80 uur vraag. Twee ploegen × 5 dagen × 7,5 netto uur = 75 uur.\n\nBij 70% OEE is dat 52,5 effectieve uren: belasting = 80 / 52,5 = 152%. Gaat niet.\n\nDrie ploegen geven 112,5 uur; bij 70% OEE is dat 78,75 uur, nog steeds 102%. Drie ploegen plus OEE naar 80% geeft 90 uur: belasting 89%. Haalbaar, maar krap, dus de doorlooptijden blijven lang.',
      },
      said: 'Wat engineers zeggen: “De planner laat 98% belasting zien op de vijfassige. Dat is geen efficiëntie, dat is een wachtrij in wording.”',
      recall: [
        {
          q: 'Een machine draait twee ploegen per dag, 5 dagen per week, 7,5 netto uur per ploeg, bij een OEE van 80%. De orders van deze week vragen 54 uur zuivere machinetijd (stuks × cyclustijd). Wat is de belasting, in procent?',
          number: 90,
          tolerance: 1,
          unit: '%',
          why: '75 uur × 0,8 = 60 effectieve uren; 54 / 60 = 90%.',
        },
        {
          q: 'De bezettingsgraad gaat van 80% naar 90%. Wat gebeurt er met de wachttijd?',
          options: ['Die stijgt met zo’n 10%', 'Die blijft ongeveer gelijk', 'Die wordt korter, want de machine is drukker', 'Die verdubbelt ongeveer, of meer'],
          answer: 'Die verdubbelt ongeveer, of meer',
          why: 'u / (1 − u) gaat van 4 naar 9: meer dan het dubbele.',
        },
        {
          q: 'Een dienst heeft 7,5 netto uur, de cyclustijd is 90 seconden en de OEE is 80%. Op hoeveel stuks per dienst kun je plannen?',
          number: 240,
          tolerance: 2,
          unit: 'stuks',
          why: '27.000 / 90 = 300 stuks op papier; × 0,8 = 240.',
        },
        {
          q: 'Waarom moeten niet-bottlenecks reservecapaciteit hebben?',
          options: ['Zodat ze na een verstoring kunnen inhalen en de bottleneck blijven voeden', 'Langzaam draaien is goedkoper', 'Om de operators bezig te houden', 'Omdat OEE dat vereist'],
          answer: 'Zodat ze na een verstoring kunnen inhalen en de bottleneck blijven voeden',
          why: 'Zonder reserve haalt een niet-bottleneck verloren tijd nooit in, en valt de bottleneck droog.',
        },
      ],
      situation: {
        scene: 'Je zit in het overleg tussen verkoop en productie (S&OP) bij een plaatbewerker. Verkoop wil een grote order aannemen. De planner zegt: “We hebben capaciteit, de laser zit op 85%, dus er is 15% vrij.”',
        ask: 'Wat vraag je voordat de order wordt aangenomen?',
        model: 'Is die 85% tegen papieren uren of na OEE? Als het papieren uren zijn, zit de echte belasting misschien al boven de 100%. En hoe lang is de wachtrij voor de laser nu? Richting 100% exploderen de doorlooptijden, dus laten we uitrekenen welke levertijd we eerlijk kunnen beloven, of wat een extra ploeg oplevert.',
        rubric: [
          'Checkt de basis: papieren uren tegenover effectieve uren na OEE',
          'Wijst erop dat wachtrijen en doorlooptijden richting 100% exploderen',
          'Maakt er opties van: levertijdbelofte, extra ploeg of OEE-verbetering',
        ],
      },
      sayIt: 'Leg een salesmanager in 60 seconden uit waarom 100% bezettingsgraad niet het doel is.',
      terms: [
        { term: 'Capaciteit', def: 'Wat een resource in een periode kan maken, na verliezen.' },
        { term: 'Bezettingsgraad', def: 'Bezette tijd gedeeld door beschikbare tijd.' },
        { term: 'Belasting', def: 'Vraag in uren gedeeld door effectieve capaciteit in uren.' },
        { term: 'Ploegenrooster', def: 'Hoe de uren zijn ingedeeld: 1, 2 of 3 ploegen, 5 of 7 dagen.' },
      ],
    },
  ],
};

// eng.switchgear (NL): Schakelinstallaties en beveiliging: schakelaars, MS-installaties, beveiligingsrelais, selectiviteit, veilig werken, distributieautomatisering.
export default {
  lessons: [
    {
      id: 'eng.switchgear.devices',
      title: 'Vermogensschakelaars, lastscheiders, scheiders en zekeringen',
      pre: [
        {
          q: 'Welk apparaat kan een kortsluitstroom van duizenden ampères veilig onderbreken en daarna weer inschakelen?',
          options: ['Een scheider', 'Een lastscheider', 'Een vermogensschakelaar', 'Een zekering'],
          answer: 'Een vermogensschakelaar',
          why: 'Alleen een vermogensschakelaar kan kortsluitstromen herhaaldelijk onderbreken; een zekering doet het één keer en moet dan vervangen worden.',
        },
      ],
      teach: [
        'Een vermogensschakelaar kan normale belasting schakelen en kortsluitstromen onderbreken, in MS vaak 10 tot 20 kA of meer. Een beveiligingsrelais geeft hem de opdracht om te openen als het een fout ziet. Vermogensschakelaars zitten in onderstations, aan het begin van elk MS-veld. Moderne MS-schakelaars doven de boog in een vacuümbuis.',
        'Een lastscheider kan normale belastingstroom in- en uitschakelen en inschakelen op een fout, maar kan geen kortsluiting onderbreken. Die vind je in netstations voor de ringkabels: daarmee schakelen monteurs delen van de ring in en uit.',
        'Een scheider mag alleen stroomloos bediend worden. Zijn taak is een veilige, betrouwbare scheiding maken zodat er achter gewerkt kan worden. Een aardingsschakelaar verbindt een spanningsloos deel met aarde. Een zekering onderbreekt een fout door door te smelten, één keer; daarna moet hij vervangen worden. In een netstation wordt de transformator vaak beveiligd met MS-zekeringen in combinatie met een lastscheider.',
        'De kernvraag bij elk apparaat: wat kan hij inschakelen en wat kan hij onderbreken? Een scheider onder belasting bedienen, of een lastscheider op een fout die hij niet aankan, kan een vlamboog geven die de bediener verwondt. Weten wat elk apparaat kan is basisveiligheid, geen weetje.',
      ],
      example: {
        kind: 'worked',
        text: 'Een 10 kV-veld in een onderstation is beveiligd met een vermogensschakelaar van 20 kA. De ring loopt langs netstation 12, met twee lastscheiders voor de ringkabels en een lastscheider met zekeringen voor de transformator van 400 kVA. Een graafmachine raakt de ringkabel: het relais in het onderstation ziet 8 kA en opent de vermogensschakelaar in zo’n 0,3 s. De lastscheiders in netstation 12 hadden dat niet gekund. Als het veld spanningsloos is, opent een monteur de lastscheiders rond het beschadigde stuk om het vrij te schakelen, en daarna gaat de vermogensschakelaar weer in.',
      },
      said: 'Wat engineers zeggen: “Die kun je niet onder belasting trekken, dat is een scheider. Eerst de lastscheider open.”',
      recall: [
        {
          q: 'Een 10 kV-net heeft een kortsluitvermogen van 300 MVA. Wat is de kortsluitstroom, in kA? (I = S / (1,73 × U))',
          number: 17.3,
          tolerance: 0.5,
          unit: 'kA',
          why: '300.000.000 / (1,73 × 10.000) ≈ 17.300 A = 17,3 kA.',
        },
        {
          q: 'Wat mag een scheider?',
          options: ['Alleen stroomloos schakelen, om een veilige scheiding te maken', 'Kortsluitingen onderbreken', 'Volle belastingstroom schakelen', 'Een zekering vervangen'],
          answer: 'Alleen stroomloos schakelen, om een veilige scheiding te maken',
          why: 'Een scheider is er om te scheiden, niet om stroom te schakelen.',
        },
        {
          q: 'Wat gebeurt er met een zekering nadat hij een fout heeft onderbroken?',
          options: ['Hij reset zichzelf', 'Een relais sluit hem weer', 'Hij schakelt over naar de andere ring', 'Hij moet vervangen worden'],
          answer: 'Hij moet vervangen worden',
          why: 'Het smeltelement smelt om de fout te onderbreken, dus hij werkt maar één keer.',
        },
        {
          q: 'Welk apparaat wordt in een netstation meestal voor de ringkabels gebruikt?',
          options: ['Een vermogensschakelaar met relais', 'Een lastscheider', 'Een zekering', 'Alleen een scheider'],
          answer: 'Een lastscheider',
          why: 'Met lastscheiders kunnen monteurs delen van de ring onder normale belasting schakelen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een regionale netbeheerder in een project om storingen sneller op te lossen. Iemand stelt voor dat monteurs “het netstation gewoon al schakelen terwijl de fout er nog op staat, dat scheelt tijd”.',
        ask: 'Wat vraag je?',
        model: 'Wat kunnen de schakelaars in die netstations onderbreken? Lastscheiders kunnen geen kortsluitstroom onderbreken, dus als je ze bedient terwijl de fout nog gevoed wordt, krijg je een gevaarlijke vlamboog. De vermogensschakelaar in het onderstation moet de fout eerst afschakelen. Misschien kunnen we de tijd ergens anders winnen, bijvoorbeeld door het defecte stuk sneller te vinden.',
        rubric: [
          'Vraagt wat de apparaten kunnen inschakelen en onderbreken',
          'Benoemt het veiligheidsrisico van een fout schakelen met een lastscheider',
          'Zoekt de tijdwinst in een veilig deel van het proces',
        ],
      },
      sayIt: 'Leg een projectmanager in 60 seconden het verschil uit tussen een vermogensschakelaar, een lastscheider, een scheider en een zekering.',
      terms: [
        { term: 'Vermogensschakelaar', def: 'Schakelt belasting en onderbreekt kortsluitstromen.' },
        { term: 'Lastscheider', def: 'Schakelt normale belasting, geen kortsluiting.' },
        { term: 'Scheider', def: 'Wordt stroomloos bediend om een veilige scheiding te maken.' },
        { term: 'Kortsluitvermogen', def: 'Het kortsluitvermogen of de kortsluitstroom op een punt in het net.' },
      ],
    },
    {
      id: 'eng.switchgear.installations',
      title: 'MS-installaties en RMU’s',
      pre: [
        {
          q: 'SF6, het gas in veel MS-installaties, is een broeikasgas. Hoeveel sterker dan CO2 is het ongeveer, per kilo?',
          options: ['Zo’n 2 keer', 'Zo’n 23.000 keer', 'Zo’n 100 keer', 'Het is geen broeikasgas'],
          answer: 'Zo’n 23.000 keer',
          why: 'SF6 heeft een opwarmingsvermogen van zo’n 23.500, het hoogste van alle gangbare industriële gassen.',
        },
      ],
      teach: [
        'In een onderstation is de MS-installatie een rij kasten, de velden, één per uitgaande kabel, elk met een vermogensschakelaar, meettransformatoren en een relais. Oudere luchtgeïsoleerde installaties (AIS) zijn groot: de lucht tussen de delen isoleert. Gasgeïsoleerde installaties (GIS) zetten de spanningvoerende delen in een gesloten tank met SF6, en zijn daardoor veel compacter.',
        'In een netstation is het MS-deel meestal een RMU (ring main unit): een compacte installatie met twee kabelvelden voor de ring en één transformatorveld. Veel RMU’s van de afgelopen decennia zijn met SF6 geïsoleerd. Oudere types, zoals de Magnefix, staan nog in heel veel Nederlandse netstations. Voor sommige oudere types hebben netbeheerders extra regels om ze veilig te bedienen.',
        'SF6 isoleert en dooft vlambogen extreem goed, maar is een heel sterk broeikasgas: zo’n 23.500 keer CO2. Door de Europese F-gassenregels mogen nieuwe MS-installaties tot 24 kV vanaf 2026 geen F-gassen zoals SF6 meer gebruiken, en tot 52 kV vanaf 2030. Alternatieven gebruiken vacuüm om de boog te onderbreken en droge lucht of vaste isolatie.',
        'Keuzes voor installaties zijn langjarig: een installatie staat er 30 tot 50 jaar. Daarom zijn ze een groot onderwerp in standaardisatie, inkoop en veiligheid. Als netmensen het over “de installatie” hebben, vraag dan welk type het is; het antwoord vertelt je hoe hij bediend, onderhouden en vervangen wordt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netbeheerder heeft 20.000 RMU’s met SF6, elk met zo’n 1,5 kg gas: 30 ton SF6. Lekt er 0,1% per jaar, dan is dat 30 kg, gelijk aan zo’n 30 × 23.500 = 705.000 kg, ruwweg 700 ton CO2-equivalent per jaar. Vanaf 2026 moeten nieuwe RMU’s SF6-vrij zijn. De netbeheerder past zijn standaard netstationontwerp aan naar een RMU met vacuüm en droge lucht, schoolt de monteurs om op de nieuwe bedieningsstappen, en heeft een plan om SF6 uit vervangen installaties veilig in te zamelen.',
      },
      said: 'Wat engineers zeggen: “Nieuwe stations worden vanaf nu SF6-vrij. Zelfde maat, andere bediening, dus iedereen gaat op cursus.”',
      recall: [
        {
          q: 'Een RMU bevat 1,5 kg SF6, met een opwarmend effect van zo’n 23.500 keer CO2. Als alles weglekt, hoeveel ton CO2-equivalent is dat?',
          number: 35.3,
          tolerance: 1,
          unit: 't',
          why: '1,5 × 23.500 = 35.250 kg ≈ 35,3 ton.',
        },
        {
          q: 'Wat zit er in een typische RMU?',
          options: ['Eén vermogensschakelaar per huis', 'Een 150/10 kV-transformator', 'Twee kabelvelden voor de ring en één transformatorveld', 'Alleen LS-zekeringen'],
          answer: 'Twee kabelvelden voor de ring en één transformatorveld',
          why: 'De RMU koppelt het netstation in de ring en voedt de transformator.',
        },
        {
          q: 'Wat is het grootste voordeel van een gasgeïsoleerde installatie ten opzichte van een luchtgeïsoleerde?',
          options: ['Hij is veel compacter', 'Hij heeft geen beveiliging nodig', 'Hij is goedkoper af te voeren', 'Hij werkt zonder stroom'],
          answer: 'Hij is veel compacter',
          why: 'SF6 isoleert veel beter dan lucht, dus de delen kunnen dichter op elkaar.',
        },
        {
          q: 'Wat gebruiken SF6-vrije MS-alternatieven meestal?',
          options: ['Olie voor alles', 'Een hogere spanning', 'Waterstof', 'Vacuüm om de boog te onderbreken en droge lucht of vaste isolatie'],
          answer: 'Vacuüm om de boog te onderbreken en droge lucht of vaste isolatie',
          why: 'Vacuümschakelaars doven de boog; lucht of vaste materialen zorgen voor de isolatie.',
        },
      ],
      situation: {
        scene: 'Je zit bij een regionale netbeheerder in een project voor de uitrol van een nieuwe SF6-vrije RMU. De planning gaat ervan uit dat monteurs hem vanaf dag één kunnen bedienen, “want een schakelaar is een schakelaar”.',
        ask: 'Wat vraag je?',
        model: 'Zijn de bedieningsstappen hetzelfde als bij de huidige RMU’s, inclusief aarden en vergrendelingen? Als ze verschillen, hebben monteurs een training en aangepaste werkinstructies nodig voordat de eerste in bedrijf gaat, en twee types door elkaar in één ring geeft extra risico. Wanneer staat de training gepland, en wie tekent af dat de instructies klaar zijn?',
        rubric: [
          'Vraagt of de bedieningsstappen verschillen van het huidige type',
          'Koppelt een nieuw type aan training en werkinstructies',
          'Vraagt wie verantwoordelijk is voor de gereedheid vóór ingebruikname',
        ],
      },
      sayIt: 'Leg een duurzaamheidsmanager in 60 seconden uit waarom SF6 ertoe doet voor netbeheerders en wat ervoor in de plaats komt.',
      terms: [
        { term: 'RMU', def: 'Ring main unit: compacte MS-installatie in een netstation met ring- en transformatorvelden.' },
        { term: 'GIS / AIS', def: 'Gasgeïsoleerde / luchtgeïsoleerde installatie.' },
        { term: 'SF6', def: 'Isolatiegas met een heel sterk broeikaseffect, dat wordt uitgefaseerd in nieuwe MS-installaties.' },
        { term: 'Veld', def: 'Eén kast in een installatie, voor één kabel of transformator.' },
      ],
    },
    {
      id: 'eng.switchgear.protection',
      title: 'Beveiligingsrelais, stroom- en spanningstransformatoren',
      pre: [
        {
          q: 'Een beveiligingsrelais bij een 10 kV-veld moet de stroom weten, en die kan honderden ampères zijn. Hoe meet het die?',
          options: ['Het zit rechtstreeks in de 10 kV-kabel', 'Via de slimme meters', 'Iemand leest het af en voert het in', 'Via een stroomtransformator die het terugbrengt naar zo’n 1 of 5 A'],
          answer: 'Via een stroomtransformator die het terugbrengt naar zo’n 1 of 5 A',
          why: 'Stroom- en spanningstransformatoren schalen stroom en spanning terug naar veilige, standaard waarden voor relais en meters.',
        },
      ],
      teach: [
        'Een beveiliging heeft drie delen. Meettransformatoren schalen de echte waarden terug: een stroomtransformator van 400/1 A maakt van 400 A 1 A; een spanningstransformator maakt van 10 kV 100 V. Een relais vergelijkt die waarden met zijn instellingen. Een vermogensschakelaar gaat open als het relais een uitschakelsignaal geeft.',
        'Overstroombeveiliging schakelt af als de stroom een ingestelde tijd boven een ingestelde waarde blijft. Meestal zijn er twee trappen: een lagere instelling met vertraging voor overbelasting en fouten ver weg, en een hoge instelling die vrijwel direct afschakelt bij zware kortsluiting dichtbij. De instelling moet boven de hoogste normale belasting liggen en onder de laagste foutstroom.',
        'Aardfoutbeveiliging kijkt naar de stroom die naar aarde weglekt, gemeten als de som van de drie fasen, die nul hoort te zijn als alles goed is. Hoe groot een aardfoutstroom is, hangt af van hoe het sterpunt van het net geaard is, en dat verschilt per net. Sommige netten hebben heel gevoelige of richtingsgevoelige aardfoutrelais nodig.',
        'Moderne relais zijn digitaal: ze registreren ook gebeurtenissen en foutstromen, wat helpt na een uitschakeling. Instellingen zijn een beheerd engineeringproduct. Een verkeerde instelling geeft ongewenste uitschakelingen of, erger, helemaal geen uitschakeling. Als het net verandert, bijvoorbeeld door een nieuw zonnepark, moeten de instellingen gecontroleerd worden.',
      ],
      example: {
        kind: 'worked',
        text: 'Een 10 kV-veld heeft een maximale belasting van 300 A en de kleinste foutstroom aan het eind is 2.000 A. De stroomtransformator is 400/1 A. De engineer zet de eerste trap op 450 A, 1,5 keer de maximale belasting, met 0,5 s vertraging: aan de relaiskant is dat 450 / 400 = 1,125 A. De tweede trap komt op 4.000 A, zonder vertraging. Een fout aan het eind (2.000 A) schakelt af op trap één na 0,5 s; een fout vlak bij het onderstation (12.000 A) schakelt direct af op trap twee.',
      },
      said: 'Wat engineers zeggen: “Check de relaisinstellingen als dat zonnepark erop zit. De foutstromen op dat veld zijn veranderd.”',
      recall: [
        {
          q: 'Een stroomtransformator heeft een verhouding van 400/1 A. De primaire stroom is 600 A. Welke stroom ziet het relais, in ampère?',
          number: 1.5,
          tolerance: 0.05,
          unit: 'A',
          why: '600 / 400 = 1,5 A aan de secundaire kant.',
        },
        {
          q: 'Waar moet een overstroominstelling liggen?',
          options: ['Onder de normale belastingstroom', 'Boven de hoogste normale belasting en onder de laagste foutstroom', 'Precies op de kabelbelastbaarheid', 'Boven de hoogste foutstroom'],
          answer: 'Boven de hoogste normale belasting en onder de laagste foutstroom',
          why: 'Anders schakelt hij af bij normale belasting of mist hij echte fouten.',
        },
        {
          q: 'Wat meet aardfoutbeveiliging meestal?',
          options: ['De spanning tussen de fasen', 'De temperatuur van de kabel', 'De som van de drie fasestromen', 'De arbeidsfactor'],
          answer: 'De som van de drie fasestromen',
          why: 'In een gezond net is de som nul; stroom die naar aarde weglekt maakt hem ongelijk aan nul.',
        },
        {
          q: 'Er komt een nieuw zonnepark op een veld. Wat moet er met de beveiliging gebeuren?',
          options: ['De instellingen moeten gecontroleerd worden tegen de nieuwe foutstromen', 'Niks, beveiliging staat los van het net', 'Het relais moet eruit', 'De vermogensschakelaar moet vervangen worden'],
          answer: 'De instellingen moeten gecontroleerd worden tegen de nieuwe foutstromen',
          why: 'Nieuwe bronnen veranderen de foutstromen en kunnen bestaande instellingen fout maken.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder. Een veld is in een maand twee keer onverwacht uitgeschakeld, zonder zichtbare fout. De planner wil weten “of we het relais niet gewoon wat hoger kunnen zetten”.',
        ask: 'Wat vraag je?',
        model: 'Wat heeft het relais bij die uitschakelingen geregistreerd: welke trap, welke stroom, en wat was de belasting op dat moment? Als de belasting gegroeid is, zit de instelling misschien te dicht op de normale belasting; maar hem blind verhogen kan betekenen dat een echte fout ver op het veld niet meer gezien wordt. Wie is eigenaar van de instellingen, en kan die het controleren tegen de huidige minimale foutstroom?',
        rubric: [
          'Vraagt naar de geregistreerde gebeurtenissen van het relais',
          'Ziet het risico van een instelling die echte fouten niet meer ziet',
          'Betrekt de eigenaar van de instellingen voor een goede controle',
        ],
      },
      sayIt: 'Leg een niet-technische manager in 60 seconden uit hoe een beveiligingsrelais weet wanneer het een vermogensschakelaar moet laten afschakelen.',
      terms: [
        { term: 'Stroomtransformator', def: 'Schaalt hoge stromen terug naar 1 of 5 A voor relais en meters.' },
        { term: 'Spanningstransformator', def: 'Schaalt hoge spanningen terug naar zo’n 100 V.' },
        { term: 'Overstroombeveiliging', def: 'Schakelt af als de stroom een ingestelde tijd boven een ingestelde waarde blijft.' },
        { term: 'Aardfoutbeveiliging', def: 'Schakelt af bij stroom die naar aarde weglekt.' },
      ],
    },
    {
      id: 'eng.switchgear.selectivity',
      title: 'Selectiviteit',
      pre: [
        {
          q: 'Er ontstaat kortsluiting in één LS-straatkabel. Wat schakelt er in een goed ontworpen net uit?',
          options: ['Alleen de zekering van die straatkabel', 'Het hele netstation', 'De hele MS-ring', 'Het onderstation'],
          answer: 'Alleen de zekering van die straatkabel',
          why: 'Selectiviteit betekent dat de beveiliging die het dichtst bij de fout zit hem afschakelt, en alles daarboven aan blijft.',
        },
      ],
      teach: [
        'Selectiviteit betekent dat alleen de beveiliging die het dichtst bij de fout zit afschakelt, zodat zo min mogelijk klanten zonder stroom komen. Een fout in een straatkabel moet de zekering van die kabel in het netstation laten doorslaan, niet de transformatorzekering, en zeker niet de vermogensschakelaar van het veld in het onderstation.',
        'Tijdselectiviteit is de meest gebruikte methode. Het relais het dichtst bij de fout staat het snelst ingesteld; elk relais erboven wacht net wat langer, meestal zo’n 0,3 s extra. Die tijdtrap dekt de openingstijd van de schakelaar en meetonnauwkeurigheden. Als het dichtstbijzijnde apparaat de fout niet afschakelt, doet de volgende erboven dat alsnog, alleen later: dat is de reserve.',
        'Zekeringen stem je af op grootte. Voor LS-zekeringen van hetzelfde type is de vuistregel dat de zekering erboven minstens zo’n 1,6 keer de waarde van die eronder moet hebben. Tussen de MS-zekering van een netstation en de LS-zekeringen checken engineers de karakteristieken, zodat de LS-zekering het eerst gaat.',
        'Zonder selectiviteit wordt een kleine fout een grote storing: één kapotte straatkabel legt een hele ring met 2.000 klanten plat. Selectiviteit kan ook kapotgaan als het net verandert: een nieuw voedingspunt, een kabelstuk dat naar een andere ring gaat, of grotere zekeringen die erin gezet zijn “omdat ze steeds doorsloegen”.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netstation voedt zes LS-kabels, elk met een zekering van 250 A. Een monteur vervangt op één kabel een zekering die steeds doorslaat door een van 400 A. Maanden later slaat bij een fout op die kabel de 400 A-zekering niet snel genoeg door; de MS-zekering van de transformator gaat eerst. Gevolg: alle zes kabels, 180 woningen, zonder stroom in plaats van 30. De oplossing: terug naar 250 A op die kabel, en uitzoeken waarom hij steeds doorsloeg, waarschijnlijk een overbelaste kabel die gesplitst of verzwaard moet worden.',
      },
      said: 'Wat engineers zeggen: “Iemand heeft er een grotere zekering in gezet en nu is het niet meer selectief. De trafozekering gaat eerst.”',
      recall: [
        {
          q: 'Het relais het dichtst bij de fout schakelt af na 0,3 s. De tijdtrap is 0,3 s. Er zitten twee relais boven. Na hoeveel seconden moet het bovenste afschakelen?',
          number: 0.9,
          tolerance: 0.05,
          unit: 's',
          why: '0,3 + 0,3 + 0,3 = 0,9 s.',
        },
        {
          q: 'Wat doet tijdselectiviteit?',
          options: ['Alle relais tegelijk laten afschakelen', 'De ring automatisch omschakelen', 'De kabellengte meten', 'Het dichtstbijzijnde relais eerst laten afschakelen en de relais erboven net wat langer laten wachten'],
          answer: 'Het dichtstbijzijnde relais eerst laten afschakelen en de relais erboven net wat langer laten wachten',
          why: 'Elke stap omhoog krijgt extra vertraging, zodat het dichtstbijzijnde apparaat de fout eerst afschakelt.',
        },
        {
          q: 'Waarom is een grotere zekering erin zetten “omdat hij steeds doorsloeg” riskant?',
          options: ['Grotere zekeringen zijn duurder', 'De selectiviteit kan verdwijnen, zodat een zekering erboven eerst doorslaat', 'Grotere zekeringen passen niet', 'De spanning daalt erdoor'],
          answer: 'De selectiviteit kan verdwijnen, zodat een zekering erboven eerst doorslaat',
          why: 'Dan legt een fout veel meer klanten plat, en blijft de oorzaak verborgen.',
        },
        {
          q: 'Wat is de reservefunctie van tijdselectiviteit?',
          options: ['Het slaat energie op', 'Het herstelt de voeding automatisch', 'Als het dichtstbijzijnde apparaat faalt, schakelt de volgende erboven de fout alsnog af', 'Het verdubbelt de foutstroom'],
          answer: 'Als het dichtstbijzijnde apparaat faalt, schakelt de volgende erboven de fout alsnog af',
          why: 'Het relais erboven staat net wat trager ingesteld en werkt dus als reserve.',
        },
      ],
      situation: {
        scene: 'Je bekijkt storingsdata bij een regionale netbeheerder. Bij een aantal LS-storingen viel het hele netstation uit in plaats van één straatkabel. Het veldteam zegt: “Dat gebeurt nou eenmaal soms.”',
        ask: 'Wat vraag je?',
        model: 'Welke zekering sloeg er in die gevallen door, en zaten er op die kabels zekeringen van de standaardwaarde? Als er grotere zekeringen in gezet zijn om steeds doorslaan te voorkomen, kan de selectiviteit met de transformatorzekering weg zijn. Kunnen we in die netstations de geplaatste zekeringen naast de standaard leggen, en kijken waarom de oorspronkelijke zekeringen doorsloegen?',
        rubric: [
          'Vraagt welk apparaat aansprak en welke zekeringwaarden er zitten',
          'Koppelt afwijkende zekeringen aan verlies van selectiviteit',
          'Vraagt naar de oorzaak van het oorspronkelijke doorslaan',
        ],
      },
      sayIt: 'Leg een teamleider klantenservice in 60 seconden uit waarom een fout in één straat soms een hele wijk platlegt.',
      terms: [
        { term: 'Selectiviteit', def: 'Alleen de beveiliging die het dichtst bij de fout zit schakelt af.' },
        { term: 'Tijdselectiviteit', def: 'Relais hogerop staan steeds trager ingesteld dan die eronder.' },
        { term: 'Tijdtrap', def: 'De extra vertraging per stap, meestal zo’n 0,3 s.' },
      ],
    },
    {
      id: 'eng.switchgear.safety',
      title: 'Veilig werken: de vijf veiligheidsregels en NEN 3140',
      pre: [
        {
          q: 'Een monteur heeft een MS-kabel vrijgeschakeld en de schakelaar vergrendeld. Wat moet hij doen voordat hij hem aanraakt?',
          options: ['Niks, hij is uit', 'Vijf minuten wachten', 'Meten dat hij spanningsloos is, en dan aarden en kortsluiten', 'Het bedrijfsvoeringscentrum vragen of hij uit is'],
          answer: 'Meten dat hij spanningsloos is, en dan aarden en kortsluiten',
          why: 'Uitgeschakeld is niet bewezen spanningsloos. Meten en aarden beschermen tegen vergissingen en terugvoeding.',
        },
      ],
      teach: [
        'De vijf veiligheidsregels voor spanningsloos werken, in deze volgorde: 1. Vrijschakelen, aan alle kanten. 2. Vergrendelen, beveiligen tegen herinschakelen, met een slot en een label. 3. Spanningsloos meten, met een spanningzoeker vaststellen dat het dood is. 4. Aarden en kortsluiten. 5. Afschermen van delen in de buurt die nog onder spanning staan.',
        'Elke regel dekt een echte fout. Het verkeerde veld schakelen. Iemand die weer inschakelt. Terugvoeding van een aggregaat, zonnepanelen of een andere ring. Geïnduceerde of achtergebleven spanning. Een spanningvoerend deel vlakbij binnen handbereik. Een stap overslaan omdat “hij is echt uit” is precies hoe ernstige ongevallen gebeuren.',
        'NEN 3140 geeft de regels voor de bedrijfsvoering van LS-installaties, tot 1.000 V wisselspanning; voor HS-installaties past de sector NEN-EN 50110 toe via eigen regels (BEI). Belangrijke rollen: de installatieverantwoordelijke (IV), die de installatie beheert, en de werkverantwoordelijke (WV), die het werk ter plaatse leidt. Een VP is een vakbekwaam persoon, een VOP een voldoende onderricht persoon.',
        'Een AVP is een aangewezen vakbekwaam persoon: iemand die vakbekwaam is én door de werkgever schriftelijk is aangewezen voor bepaalde werkzaamheden. Kunde alleen is niet genoeg; de aanwijzing telt. Als consultant ben je in een installatie een leek: je gaat alleen naar binnen met een bevoegd persoon, en je raakt niks aan.',
      ],
      example: {
        kind: 'worked',
        text: 'Werk aan een MS-kabel tussen netstation 8 en 9. Het bedrijfsvoeringscentrum en de IV maken een schakelprogramma. Een monteur opent de schakelaars in beide stations (regel 1), vergrendelt ze en hangt labels op (regel 2). Op de werkplek meet hij dat alle drie de aders spanningsloos zijn, nadat hij de spanningzoeker eerst op een bron onder spanning heeft gecontroleerd (regel 3). Hij sluit de aardingsschakelaars aan beide kanten (regel 4) en schermt delen in het netstation af die nog onder spanning staan (regel 5). Pas dan geeft de WV de kabel vrij voor de moffenploeg.',
      },
      said: 'Wat engineers zeggen: “Hij is vrijgeschakeld, vergrendeld en aan beide kanten geaard. Je kunt beginnen, maar meet eerst zelf.”',
      recall: [
        {
          q: 'Tot welke wisselspanning telt NEN 3140 een installatie als laagspanning, in volt?',
          number: 1000,
          tolerance: 1,
          unit: 'V',
          why: 'Laagspanning is tot 1.000 V wisselspanning; daarboven gelden de HS-regels.',
        },
        {
          q: 'Wat is de goede volgorde van de eerste drie veiligheidsregels?',
          options: ['Vrijschakelen, vergrendelen, spanningsloos meten', 'Aarden, vrijschakelen, spanningsloos meten', 'Spanningsloos meten, vrijschakelen, afschermen', 'Afschermen, aarden, vrijschakelen'],
          answer: 'Vrijschakelen, vergrendelen, spanningsloos meten',
          why: 'Eerst scheiden, dan zorgen dat het gescheiden blijft, dan aantonen dat het spanningsloos is.',
        },
        {
          q: 'Wat maakt iemand een AVP?',
          options: ['Een technisch diploma', 'Vijf jaar ervaring', 'Een veiligheidsquiz halen', 'Een schriftelijke aanwijzing van de werkgever voor bepaalde werkzaamheden'],
          answer: 'Een schriftelijke aanwijzing van de werkgever voor bepaalde werkzaamheden',
          why: 'Een AVP is een vakbekwaam persoon die formeel door de werkgever is aangewezen.',
        },
        {
          q: 'Waarom aarden en kortsluiten nadat je spanningsloos hebt gemeten?',
          options: ['Dat is sneller', 'Om te beschermen tegen terugvoeding of iemand die per ongeluk inschakelt', 'Om de stroom te meten', 'Het is alleen verplicht bij LS'],
          answer: 'Om te beschermen tegen terugvoeding of iemand die per ongeluk inschakelt',
          why: 'Komt er toch spanning op, dan voert de aarding die af en schakelt de beveiliging af.',
        },
      ],
      situation: {
        scene: 'Je leidt een productiviteitsproject bij een regionale netbeheerder. Een manager oppert dat ploegen “twintig minuten per klus kunnen besparen door de extra meting over te slaan als het bedrijfsvoeringscentrum al heeft bevestigd dat hij uit is”.',
        ask: 'Hoe reageer je?',
        model: 'Aan de veiligheidsstappen zou ik niet komen: ter plaatse spanningsloos meten is precies wat beschermt tegen een verkeerd veld of terugvoeding die het bedrijfsvoeringscentrum niet ziet. Laten we de twintig minuten ergens anders zoeken, bijvoorbeeld in wachten op het schakelen, reistijd tussen stations of het voorbereiden van het schakelprogramma. Kunnen we de ploegen vragen waar zij tijd verliezen?',
        rubric: [
          'Weigert een veiligheidsregel in te ruilen voor productiviteit',
          'Legt uit waarom meten ter plaatse ertoe doet',
          'Zoekt de tijdwinst samen met de ploegen in andere stappen',
        ],
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden de vijf veiligheidsregels uit en waarom elke regel ertoe doet.',
      terms: [
        { term: 'Vrijschakelen', def: 'Een deel van de installatie aan alle kanten afschakelen.' },
        { term: 'NEN 3140', def: 'Nederlandse norm voor de veilige bedrijfsvoering van LS-installaties.' },
        { term: 'IV', def: 'Installatieverantwoordelijke: degene die verantwoordelijk is voor de installatie.' },
        { term: 'AVP', def: 'Aangewezen vakbekwaam persoon: vakbekwaam en formeel door de werkgever aangewezen.' },
      ],
    },
    {
      id: 'eng.switchgear.automation',
      title: 'Distributieautomatisering',
      pre: [
        {
          q: 'Een MS-ring heeft in een paar netstations schakelaars die op afstand bediend worden. Hoe lang duurt het na een kabelstoring meestal om de meeste klanten terug te schakelen?',
          options: ['Zo’n dag', 'Minuten in plaats van één à twee uur', 'Precies even lang als zonder automatisering', 'Pas als de kabel gerepareerd is'],
          answer: 'Minuten in plaats van één à twee uur',
          why: 'Het bedrijfsvoeringscentrum kan de fout vrijschakelen en op afstand schakelen, zonder te wachten tot een monteur ter plaatse is.',
        },
      ],
      teach: [
        'Zonder automatisering rijdt een monteur langs netstations, leest kortsluitverklikkers af en schakelt met de hand: één à twee uur zonder stroom voor de meeste klanten. Met distributieautomatisering krijgen een aantal netstations op afstand bedienbare schakelaars en verklikkers die naar het bedrijfsvoeringscentrum melden. De bedrijfsvoerder ziet waar de fout zit en schakelt op afstand, in minuten.',
        'Kortsluitverklikkers gaan branden of geven een signaal als er foutstroom langs is gekomen. De fout zit tussen de laatste verklikker die stroom zag en de eerste die niks zag. Zo vind je het defecte stuk snel, met of zonder afstandsbediening.',
        'Een zelfherstellende ring gaat een stap verder: het systeem vindt de fout, opent de schakelaars eromheen en sluit het openpunt, automatisch, vaak binnen een minuut. Dat vraagt betrouwbare communicatie, goede netdata en goed geteste logica, dus het wordt stap voor stap ingevoerd.',
        'Elk netstation automatiseren is te duur. Netbeheerders kiezen per ring een paar sleutelstations, vaak twee of drie, waar een afstandsbediende schakelaar de ring in stukken verdeelt. Dat is een businesscase: kosten per station tegenover minder storingsminuten en minder rijden. Vaak komt er tegelijk netstationmonitoring van belasting en spanning bij.',
      ],
      example: {
        kind: 'worked',
        text: 'Een ring voedt 1.200 klanten. Zonder automatisering zitten ze allemaal 90 minuten zonder stroom: 1.200 × 90 = 108.000 klantminuten. Met afstandsbediende schakelaars in twee sleutelstations schakelt het bedrijfsvoeringscentrum het defecte stuk in 3 minuten vrij: 1.000 klanten zijn na 3 minuten terug en 200 blijven 90 minuten zonder. Dat is 1.000 × 3 + 200 × 90 = 3.000 + 18.000 = 21.000 klantminuten, zo’n 80% minder, met twee aangepaste netstations.',
      },
      said: 'Wat engineers zeggen: “De verklikkers zeggen tussen 6 en 7. Ik heb het op afstand vrijgeschakeld, de meesten zijn terug.”',
      recall: [
        {
          q: 'Een ring van 900 klanten. Met automatisering zijn er 750 na 2 minuten terug en blijven er 150 60 minuten zonder. Hoeveel klantminuten is dat?',
          number: 10500,
          tolerance: 10,
          unit: 'min',
          why: '750 × 2 + 150 × 60 = 1.500 + 9.000 = 10.500 klantminuten.',
        },
        {
          q: 'Hoe helpen kortsluitverklikkers een fout te vinden?',
          options: ['Ze meten de kabeltemperatuur', 'Ze schakelen de fout automatisch af', 'De fout zit tussen de laatste verklikker die foutstroom zag en de eerste die niks zag', 'Ze laten de spanning bij elke woning zien'],
          answer: 'De fout zit tussen de laatste verklikker die foutstroom zag en de eerste die niks zag',
          why: 'Foutstroom loopt van de bron tot aan de fout, niet verder.',
        },
        {
          q: 'Waarom automatiseren netbeheerders niet elk netstation?',
          options: ['Het is verboden', 'Afstandsbediening werkt niet in ringen', 'Automatisering geeft meer storingen', 'Het is te duur; een paar sleutelstations per ring geven het meeste voordeel'],
          answer: 'Het is te duur; een paar sleutelstations per ring geven het meeste voordeel',
          why: 'Twee of drie schakelpunten verdelen de ring in stukken die je los kunt terugschakelen.',
        },
        {
          q: 'Wat doet een zelfherstellende ring?',
          options: ['Hij vindt, scheidt en herstelt automatisch, vaak binnen een minuut', 'Hij repareert de kabel zelf', 'Hij voorkomt alle storingen', 'Hij vervangt de beveiligingsrelais'],
          answer: 'Hij vindt, scheidt en herstelt automatisch, vaak binnen een minuut',
          why: 'Het systeem voert de schakelstappen zelf uit in plaats van een bedrijfsvoerder.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder. Het team wil volgend jaar in 500 netstations afstandsbediende schakelaars plaatsen, gekozen “waar het inbouwen het makkelijkst is”.',
        ask: 'Wat vraag je over de selectie?',
        model: 'Welke ringen veroorzaken nu de meeste klantminuten, en waar in die ringen zou een schakelpunt ze het best opdelen? Makkelijk inbouwen is fijn, maar het voordeel zit in ringen met veel klanten, veel storingen en lange reistijden. Kunnen we de kandidaten rangschikken op verwachte bespaarde klantminuten per euro, en daarna checken of inbouwen kan?',
        rubric: [
          'Vraagt om storingsdata per ring',
          'Koppelt de keuze aan klanten, storingsfrequentie en reistijd',
          'Stelt voor te rangschikken op voordeel per euro vóór inbouwgemak',
        ],
      },
      sayIt: 'Leg een financieel manager in 60 seconden uit waarom een paar afstandsbediende schakelaars in het MS-net de storingsduur zo sterk kunnen verkorten.',
      terms: [
        { term: 'Kortsluitverklikker', def: 'Indicator die laat zien of er foutstroom langs is gekomen.' },
        { term: 'Distributieautomatisering', def: 'Bediening op afstand en monitoring van het MS-net.' },
        { term: 'Zelfherstellende ring', def: 'Een ring die fouten automatisch vindt, scheidt en herstelt.' },
        { term: 'Klantminuten', def: 'Aantal getroffen klanten × minuten zonder stroom.' },
      ],
    },
  ],
};

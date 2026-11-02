// eng.joining (NL): Lassen en verbinden: MIG/MAG en TIG, puntlassen, lasfouten, inspectie, boutverbindingen, lijmen en klinken.
export default {
  lessons: [
    {
      id: 'eng.joining.arc',
      title: 'MIG/MAG- en TIG-lassen',
      pre: [
        {
          q: 'MIG- en MAG-lassen gebruiken dezelfde machine. Wat is het verschil?',
          options: ['De draaddiameter', 'MAG is handmatig, MIG is robot', 'Het beschermgas: inert of actief', 'Het soort stroom'],
          answer: 'Het beschermgas: inert of actief',
          why: 'MIG gebruikt een inert gas zoals argon; MAG voegt een actief gas zoals CO₂ toe, voor staal.',
        },
      ],
      teach: [
        'Booglassen smelt de randen van de delen (het basismateriaal) en extra metaal (het toevoegmateriaal) met een elektrische boog: een doorlopende vonk tussen elektrode en werkstuk, bij zo’n 20 tot 35 volt en 100 tot 400 ampère. Een beschermgas houdt de lucht weg van het smeltbad, want zuurstof en stikstof geven porositeit (gasbelletjes in de las) en brosse lassen.',
        'MIG/MAG (ook wel GMAW, gas metal arc welding): een draad wordt continu door de toorts, het laspistool, gevoerd en is zowel elektrode als toevoegmateriaal. MAG, metal active gas, gebruik je op staal met argon plus 8 tot 20% CO₂; een 82/18-menggas is gangbaar. MIG, metal inert gas, gebruikt zuiver argon, voor aluminium. Snel en makkelijk te automatiseren: lasrobotcellen voor auto-onderdelen, frames, aanhangwagens en staalconstructies.',
        'TIG (GTAW, gas tungsten arc welding): een wolfraamelektrode die niet afsmelt, een losse lasstaaf die met de hand wordt toegevoegd, en zuiver argon. Langzamer, maar schoon en precies: rvs-leidingwerk in voeding en farma, dunne plaat, aluminium, en de eerste laag (grondlaag) van lassen in drukleidingen. Een goede TIG-lasser is schaars.',
        'Booglasenergie per mm las = volt × ampère × 60 / (lassnelheid in mm/min × 1.000), in kJ/mm. Te veel warmte geeft vervorming en een brede warmtebeïnvloede zone (WBZ, of HAZ) waar staal sterkte verliest; te weinig geeft bindingsfouten: de las smelt niet goed in het werkstuk in. Lassers praten in parameters: draadsnelheid, spanning, lassnelheid en gasdebiet, meestal 12 tot 18 liter per minuut.',
      ],
      example: {
        kind: 'worked',
        text: 'Een MAG-robotlas op een beugel: 24 V, 220 A, lassnelheid 400 mm/min. Booglasenergie = 24 × 220 × 60 / (400 × 1.000) = 0,79 kJ/mm; maal het MAG-rendement van 0,8 geeft een warmte-inbreng van 0,63 kJ/mm, binnen de 0,5 tot 0,9 die de lasmethode toestaat. Op dinsdag raakt de gasslang achter de robot geknikt en zakt het debiet van 15 naar 5 liter per minuut. Binnen een uur zitten de lassen vol poriën. De oplossing is een gasdebietsensor die de robot stopt onder de 10 liter per minuut.',
      },
      said: 'Wat engineers zeggen: “Dat is porositeit over de hele naad. Check eerst het gas: debiet, gasmondstuk, tocht van de deur. Negen van de tien keer is het het gas.”',
      recall: [
        {
          q: 'Een las loopt op 25 V, 200 A en een lassnelheid van 300 mm/min. Wat is de booglasenergie, in kJ/mm?',
          number: 1,
          tolerance: 0.02,
          unit: 'kJ/mm',
          why: '25 × 200 × 60 / (300 × 1.000) = 300.000 / 300.000 = 1,0 kJ/mm.',
        },
        {
          q: 'Welk proces is de gebruikelijke keuze voor rvs-leidingwerk in een zuivelfabriek?',
          options: ['MAG', 'TIG', 'Puntlassen', 'Gevulde-draadlassen'],
          answer: 'TIG',
          why: 'TIG geeft schone, precieze lassen met een gladde binnenkant, en dat vraagt hygiënisch leidingwerk.',
        },
        {
          q: 'Wat is de belangrijkste taak van het beschermgas?',
          options: ['De toorts koelen', 'De boog feller maken', 'Het werkstuk schoonmaken voor het lassen', 'De lucht weghouden van het smeltbad'],
          answer: 'De lucht weghouden van het smeltbad',
          why: 'Zuurstof en stikstof in het smeltbad geven porositeit en brosse lassen.',
        },
        {
          q: 'Welk gas gebruik je bij MIG-lassen van aluminium?',
          options: ['Argon', 'Zuiver CO₂', 'Argon met 18% CO₂', 'Zuurstof'],
          answer: 'Argon',
          why: 'Aluminium vraagt een inert gas; actieve gassen zouden het oxideren.',
        },
      ],
      situation: {
        scene: 'Je bent bij een aanhangwagenbouwer. Sinds november is de porositeit in de handmatige MAG-lassen verdubbeld. De lascoördinator wijt het aan een nieuwe partij lasdraad.',
        ask: 'Wat vraag je voordat de draadleverancier de schuld krijgt?',
        model: 'Waar komen de poreuze lassen vandaan: welke lascabines, bij welke deuren? In de winter gaan de deuren open voor heftrucks en blaast de tocht het gas weg. Op welk gasdebiet staat het, en wanneer zijn de gasmondstukken voor het laatst schoongemaakt? En komt het staal koud en nat binnen van de buitenopslag? Als de porositeit de plek volgt en niet de draadpartij, ligt het niet aan de draad.',
        rubric: [
          'Vraagt waar de fouten ontstaan, op zoek naar tocht',
          'Vraagt naar gasdebiet en de staat van de gasmondstukken',
          'Denkt aan vocht op koud materiaal voordat de draad de schuld krijgt',
        ],
      },
      sayIt: 'Leg een projectmanager in 60 seconden het verschil uit tussen MIG/MAG en TIG en waar je welke gebruikt.',
      terms: [
        { term: 'MIG/MAG', def: 'Booglassen met een continu aangevoerde draad; inert gas (MIG) of actief gas (MAG).' },
        { term: 'TIG', def: 'Booglassen met een niet-afsmeltende wolfraamelektrode en een losse lasstaaf.' },
        { term: 'Beschermgas', def: 'Gas dat de lucht weghoudt van het smeltbad.' },
        { term: 'WBZ (HAZ)', def: 'Warmtebeïnvloede zone: basismateriaal naast de las dat door de warmte veranderd is.' },
      ],
    },
    {
      id: 'eng.joining.spot',
      title: 'Weerstandspuntlassen',
      pre: [
        {
          q: 'Met hoeveel laspunten wordt een gemiddelde autocarrosserie ongeveer bij elkaar gehouden?',
          options: ['Zo’n 500', 'Zo’n 1.500', 'Zo’n 4.000–5.000', 'Zo’n 20.000'],
          answer: 'Zo’n 4.000–5.000',
          why: 'Een body-in-white heeft meestal duizenden laspunten, bijna allemaal door robots gezet.',
        },
      ],
      teach: [
        'Weerstandspuntlassen verbindt overlappende platen op losse punten. Twee koperen elektroden knijpen de platen samen en sturen er een hoge stroom doorheen, zo’n 8 tot 12 kA (8.000 tot 12.000 ampère), gedurende 200 tot 400 milliseconden. De weerstand op het contactvlak verhit het metaal tot er een laslens ontstaat, een klein lensje gesmolten metaal dat stolt. Geen toevoegmateriaal, geen gas. Robottangen doen dit aan elke body-in-white-lijn (de kale, ongelakte carrosserie).',
        'Drie hoofdparameters: stroom, lastijd en elektrodekracht (zo’n 2 tot 4 kN). Warmte = I² × R × t, dus de stroom telt in het kwadraat: 10% meer stroom geeft zo’n 21% meer warmte. Te weinig geeft een kleine lens of geen, een “plakpunt” dat er goed uitziet maar niets houdt. Te veel geeft uitspatten: vonken en weggeslingerd metaal, diepe indrukken en een zwakkere verbinding.',
        'De lensdiameter is de kwaliteitsmaat. Een gangbare regel: de lens moet minstens 4√t zijn, met t de dunste plaat in mm. Voor 1 mm plaat is dat 4 mm; voor 2 mm plaat zo’n 5,7 mm.',
        'Elektrodekappen slijten: ze paddenstoelen uit en worden breder, dus dezelfde stroom verdeelt zich over een groter vlak en de lens krimpt. Twee tegenmaatregelen: een stepper die de stroom verhoogt naarmate het aantal punten oploopt, en kappenfrezen, waarbij een frees de kappen weer in vorm brengt, op verzinkt staal vaak zo’n om de 200 punten. Een zinklaag laat de kappen sneller slijten.',
      ],
      example: {
        kind: 'worked',
        text: 'Een tang last twee verzinkte platen van 1,2 mm op 9,5 kA, 300 ms en 3 kN, met een kapvlak van Ø6 mm: 28,3 mm², dus 9.500 / 28,3 = 336 A/mm². De kappenfrees loopt vast en niemand merkt het. Na 500 punten is het kapvlak Ø7,5 mm: 44,2 mm², en de stroom per mm² kapvlak (de stroomdichtheid) zakt naar 215 A/mm², 36% minder. De lens krimpt van 5,5 naar zo’n 3,8 mm, onder het minimum van 4√1,2 = 4,4 mm. De dagelijkse beiteltest (de platen uit elkaar wrikken en het punt meten) vangt het, maar twee ploegen aan carrosserieën moeten nagekeken worden.',
      },
      said: 'Wat engineers zeggen: “Niet zomaar de stroom omhoog draaien. Check eerst de kappenfrees. Als de kappen uitgepaddenstoeld zijn, krijg je met meer ampère alleen maar spatten.”',
      recall: [
        {
          q: 'De dunste plaat in een verbinding is 2,25 mm. Wat is de minimale lensdiameter volgens 4√t, in mm?',
          number: 6,
          tolerance: 0.05,
          unit: 'mm',
          why: '√2,25 = 1,5; 4 × 1,5 = 6 mm.',
        },
        {
          q: 'De lasstroom gaat 10% omhoog. Met ongeveer hoeveel % neemt de warmte toe?',
          number: 21,
          tolerance: 1,
          unit: '%',
          why: 'Warmte schaalt met I²: 1,1² = 1,21, dus zo’n 21% meer.',
        },
        {
          q: 'De elektrodekappen zijn uitgepaddenstoeld. Wat gebeurt er met de laspunten?',
          options: ['De lenzen worden groter', 'Niets, de stroom is gelijk', 'De stroomdichtheid daalt en de lenzen krimpen', 'De punten worden sterker'],
          answer: 'De stroomdichtheid daalt en de lenzen krimpen',
          why: 'Dezelfde stroom verdeelt zich over een groter contactvlak, dus minder warmte per mm².',
        },
        {
          q: 'Een robottang spat flink bij elk punt. Wat is de waarschijnlijke oorzaak?',
          options: ['Te weinig stroom', 'Te veel stroom of te weinig kracht', 'Net gefreesde kappen', 'Te dikke platen'],
          answer: 'Te veel stroom of te weinig kracht',
          why: 'Uitspatten gebeurt als het gesmolten metaal oververhit raakt of niet genoeg wordt vastgehouden door de kracht.',
        },
      ],
      situation: {
        scene: 'Je bent in een carrosseriebouw. De beiteltest vond te kleine laspunten op robot 14. Het voorstel van de ploeg is de stroom op die robot met 15% te verhogen.',
        ask: 'Wat vraag je voordat ze de parameters veranderen?',
        model: 'Wanneer zijn de kappen op robot 14 voor het laatst gefreesd, en snijdt de kappenfrees echt? Staan de kappen goed uitgelijnd en klopt de tangkracht? Als de kappen uitgepaddenstoeld zijn, maskeert meer stroom het een dag en geeft het daarna spatten. Ik zou eerst kappen, frees en kracht checken, en pas daarna naar het lasprogramma kijken.',
        rubric: [
          'Vraagt naar het kappenfrezen en de staat van de kappen',
          'Vraagt naar elektrodekracht en uitlijning',
          'Waarschuwt dat meer stroom de oorzaak verbergt en spatten geeft',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit hoe een laspunt ontstaat en waarom kappenfrezen ertoe doet.',
      terms: [
        { term: 'Laslens', def: 'De lens van samengesmolten metaal die het laspunt vormt.' },
        { term: 'Uitspatten', def: 'Gesmolten metaal dat als vonken uit de las spat: te veel warmte of te weinig kracht.' },
        { term: 'Kappenfrezen', def: 'De elektrodekappen met een frees weer in vorm brengen, zodat het contactvlak klopt.' },
        { term: 'Stepper', def: 'Besturingsfunctie die de stroom verhoogt naarmate de kappen slijten.' },
      ],
    },
    {
      id: 'eng.joining.defects',
      title: 'Lasfouten en hun oorzaken',
      pre: [
        {
          q: 'Welke lasfout is het gevaarlijkst, omdat je hem vaak van buiten niet ziet?',
          options: ['Spatten', 'Verkleuring', 'Randinkarteling', 'Bindingsfout'],
          answer: 'Bindingsfout',
          why: 'De las kan er perfect uitzien terwijl hij van binnen nooit aan het basismateriaal gehecht is.',
        },
      ],
      teach: [
        'Porositeit: gasbelletjes die in de las zijn opgesloten. Oorzaken: beschermgas kwijt (tocht, te laag debiet, spatten in het gasmondstuk), vuil, vettig of nat materiaal, of damp van een zinklaag. Poriën aan het oppervlak zie je; poriën binnenin vragen röntgen- of ultrasoon onderzoek.',
        'Bindingsfouten en onvolledige doorlassing: het lasmetaal is niet in het basismateriaal opgesmolten of heeft de grondnaad, de onderkant van de naad, niet bereikt. Oorzaken: te weinig warmte, te snel lassen, de verkeerde toortshoek, een slecht voorbereide naad. Het is de gevaarlijkste fout, omdat een las er van buiten perfect uit kan zien terwijl hij een scheurachtige fout verbergt.',
        'Scheuren worden nooit geaccepteerd. Warmscheuren ontstaan tijdens het stollen, langs het midden van de rups (de lijn lasmetaal). Koud- of waterstofscheuren ontstaan uren na het lassen, in de warmtebeïnvloede zone van hogesterktestaal, door vocht of waterstof; de remedie is droog toevoegmateriaal en de delen voorwarmen. Daarom wacht de inspectie bij sommige staalsoorten 16 tot 48 uur.',
        'Vervorming: warmte zet het metaal uit en afkoelen laat het krimpen, dus delen trekken krom en hoeken trekken dicht. Het is meer een fout van het onderdeel dan van de las. Remedies: lasmallen en klemmen, de delen vooraf in de tegengestelde hoek zetten, een uitgebalanceerde lasvolgorde, en minder warmte. Spatten (weggeslingerde metaaldruppels) en een kleine randinkarteling (een groefje langs de rand van de las) zijn meestal cosmetisch of klein.',
      ],
      example: {
        kind: 'worked',
        text: 'Een graafmachinegiek: ultrasoon onderzoek vindt bindingsfouten in 3 van de 40 lassen, allemaal verticaal opgaand gelast door de tweede ploeg. De lasmethode zegt 300 mm/min lassnelheid; gemeten is 405 mm/min, 35% te snel, en dat verlaagt de booglasenergie met 26%. De lassers lieten ook de pendelbeweging weg, het heen-en-weer bewegen van de toorts. Waarom? Na een robotstoring kreeg de ploeg een strakker doel en ging hij sneller lassen. Elke reparatie betekent de foute las uitgutsen, opnieuw lassen en opnieuw onderzoeken: zo’n 3,5 uur. De oplossing is een realistische planning en controle op lassnelheid, geen preek over vakmanschap.',
      },
      said: 'Wat engineers zeggen: “Van buiten ziet hij er prachtig uit, maar het ultrasoon onderzoek laat geen binding op de flank zien. Ze liepen veel te hard.”',
      recall: [
        {
          q: 'De lasmethode schrijft 300 mm/min lassnelheid voor; de lasser last op 405 mm/min. Met hoeveel % daalt de booglasenergie?',
          number: 26,
          tolerance: 1,
          unit: '%',
          why: 'Booglasenergie schaalt met 1 / snelheid: 300 / 405 = 0,74, dus zo’n 26% minder warmte per mm.',
        },
        {
          q: 'Wat veroorzaakt meestal porositeit bij MAG-lassen?',
          options: ['Verlies van beschermgas, bijvoorbeeld door tocht', 'Een te lage lassnelheid', 'Het staal voorwarmen', 'Een dikkere draad gebruiken'],
          answer: 'Verlies van beschermgas, bijvoorbeeld door tocht',
          why: 'Lucht die bij het smeltbad komt, laat gasbelletjes in de las achter.',
        },
        {
          q: 'Een dag na het lassen verschijnt een scheur in de warmtebeïnvloede zone van een las in hogesterktestaal. Wat is het waarschijnlijk?',
          options: ['Een warmscheur', 'Porositeit', 'Een waterstof- (koud)scheur', 'Vervorming'],
          answer: 'Een waterstof- (koud)scheur',
          why: 'Waterstofscheuren komen vertraagd en ontstaan in de WBZ van hardbare staalsoorten.',
        },
        {
          q: 'Welke maatregel vermindert vervorming?',
          options: ['Hogere stroom', 'Eerst alles vanaf één kant lassen', 'Langzamer lassen', 'Een uitgebalanceerde lasvolgorde en de delen vooraf zetten'],
          answer: 'Een uitgebalanceerde lasvolgorde en de delen vooraf zetten',
          why: 'De warmte verdelen en vooraf tegen de verwachte krimp in zetten houdt het onderdeel recht.',
        },
      ],
      situation: {
        scene: 'Je bent bij een fabrikant van stalen frames voor kranen. De lascoördinator zegt: “Onze lassen zien er prima uit, we controleren ze allemaal visueel.” Er is geen ander onderzoek.',
        ask: 'Wat vraag je?',
        model: 'Visuele controle vangt oppervlaktefouten, maar bindingsfouten en inwendige scheuren kunnen er van buiten perfect uitzien. Wat eist de klantspecificatie of de norm voor deze dragende lassen, en welk percentage krijgt ultrasoon onderzoek? Als het antwoord “niets” is, wil ik eerst een steekproef van kritische lassen laten onderzoeken voordat we het over iets anders hebben.',
        rubric: [
          'Benoemt dat visuele controle inwendige fouten mist',
          'Vraagt wat de specificatie of norm eist',
          'Stelt een steekproef met volumetrisch onderzoek op kritische lassen voor',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden de vier belangrijkste lasfouten uit en van welke een lasingenieur wakker ligt.',
      terms: [
        { term: 'Porositeit', def: 'Gasbelletjes die in de las zijn opgesloten.' },
        { term: 'Bindingsfout', def: 'Lasmetaal dat niet is versmolten met het basismateriaal of de vorige laag.' },
        { term: 'Waterstofscheur', def: 'Vertraagde scheur in de WBZ, door waterstof en spanning.' },
        { term: 'Vervorming', def: 'Krom trekken of krimpen van het onderdeel door de laswarmte.' },
      ],
    },
    {
      id: 'eng.joining.inspection',
      title: 'Lasinspectie, LMB en LMK',
      pre: [
        {
          q: 'Wat is een LMB (lasmethodebeschrijving, in het Engels WPS)?',
          options: ['Een lijst met de beste lassers', 'Het inspectierapport van een las', 'De instructie voor hoe een bepaalde las gemaakt moet worden: proces, parameters, positie', 'De prijslijst voor laswerk'],
          answer: 'De instructie voor hoe een bepaalde las gemaakt moet worden: proces, parameters, positie',
          why: 'Een lasmethodebeschrijving vertelt de lasser precies hoe hij die las maakt.',
        },
      ],
      teach: [
        'Visueel onderzoek (VT) komt eerst en is het goedkoopst: lasafmeting (bij een hoeklas, de las in de hoek tussen twee platen: de keeldoorsnede, gecontroleerd met een lasmaat), randinkarteling, oppervlakteporiën, scheuren, spatten. Het ziet alleen het oppervlak. Bij de meeste staalconstructies krijgt elke las het.',
        'Penetrantonderzoek (PT): een rode vloeistof trekt in oppervlaktescheuren, en een witte ontwikkelaar haalt hem eruit, zodat scheuren zichtbaar worden die te fijn zijn voor het oog. Magnetisch onderzoek (MT) doet hetzelfde op staal, ook net onder het oppervlak. Ultrasoon onderzoek (UT) stuurt geluidspulsen naar binnen en luistert naar echo’s van inwendige fouten zoals bindingsfouten. Radiografie (RT) is röntgen, goed voor porositeit.',
        'Destructieve testen: bij puntlassen wrikken de beiteltest en de peeltest de platen uit elkaar; een goed punt scheurt een knoopje uit de plaat, en je meet de diameter. Macro-etsen van doorsneden laten de inbranding zien. Buig- en trekproeven gebruik je om lasmethodes te kwalificeren. Allemaal op steekproeven, per ploeg of per robot.',
        'Een LMK (lasmethodekwalificatie, WPQR) bewijst dat een lasmethode werkt: er wordt een proefstuk gelast en destructief en niet-destructief onderzocht, volgens ISO 15614. De LMB (lasmethodebeschrijving, WPS) is de instructie die eruit volgt, bij de werkplek: proces, toevoegmateriaal, gas, bereik voor stroom en spanning, positie, voorwarmen. Lassers worden apart gekwalificeerd volgens ISO 9606. Voor staalconstructies onder EN 1090 is dit verplicht.',
      ],
      example: {
        kind: 'worked',
        text: 'Een carrosseriebouw met 12 lasrobots doet per robot per ploeg een peeltest op één onderdeel: 32 punten, elke knoop gemeten met een schuifmaat, minimaal 4,4 mm bij 1,2 mm plaat. De vernielde delen kosten 12 × 3 × €140 = €5.040 per dag. Dus de fabriek voegt handmatige ultrasone controles toe: 200 punten per ploeg zonder iets kapot te maken, met de resultaten in een SPC-kaart per robot. De peeltests gaan terug naar één keer per dag per robot, en worden nog gebruikt om te ijken wat de ultrasone metingen betekenen.',
      },
      said: 'Wat engineers zeggen: “Is er een LMB voor die las, en is die lasser gekwalificeerd voor verticaal opgaand? Want de auditor vraagt naar allebei.”',
      recall: [
        {
          q: 'Een fabriek vernielt per robot per ploeg één onderdeel van €140 voor een peeltest. Er zijn 12 robots en 3 ploegen. Wat kost dat per dag, in €?',
          number: 5040,
          tolerance: 1,
          unit: '€',
          why: '12 × 3 × €140 = €5.040, en daarom voegen fabrieken niet-destructieve controles toe.',
        },
        {
          q: 'Je wilt een fijne oppervlaktescheur vinden in een las in rvs 304. Welke methode?',
          options: ['Magnetisch onderzoek', 'Penetrantonderzoek', 'Een trekproef', 'Het onderdeel wegen'],
          answer: 'Penetrantonderzoek',
          why: 'Penetrant laat oppervlaktescheuren zien op elk niet-poreus metaal; magnetisch onderzoek vraagt magnetisch staal, en rvs 304 is niet magnetisch.',
        },
        {
          q: 'Je vermoedt een bindingsfout binnenin een dikke stompe las (twee platen kant op kant gelast). Welke methode vindt die zonder het onderdeel te vernielen?',
          options: ['Visueel onderzoek', 'Penetrantonderzoek', 'Een beiteltest', 'Ultrasoon onderzoek'],
          answer: 'Ultrasoon onderzoek',
          why: 'UT vindt inwendige vlakke fouten zoals bindingsfouten.',
        },
        {
          q: 'Wat is het verschil tussen een LMK (WPQR) en een LMB (WPS)?',
          options: ['Het is hetzelfde document', 'De LMK bewijst dat de methode werkt; de LMB is de instructie voor de lasser', 'De LMB kwalificeert de lasser; de LMK is de factuur', 'De LMK is alleen nodig voor robots'],
          answer: 'De LMK bewijst dat de methode werkt; de LMB is de instructie voor de lasser',
          why: 'De kwalificatie onderbouwt de beschrijving die op de vloer gebruikt wordt.',
        },
      ],
      situation: {
        scene: 'Je bent bij een staalbouwer die onder EN 1090 werkt. Er begint vandaag een nieuwe lasser aan een dragende constructie. De lascoördinator zegt: “Hij heeft twintig jaar ervaring, dat komt wel goed.”',
        ask: 'Wat vraag je?',
        model: 'Is hij gekwalificeerd volgens ISO 9606 voor dit proces, dit materiaal en deze positie, en is zijn certificaat nog geldig? Ligt er een LMB voor deze lassen bij de werkplek, onderbouwd met een LMK? Ervaring is prima, maar onder EN 1090 vragen de auditor en de klant naar de papieren, en zonder die papieren moeten de lassen er misschien weer uit.',
        rubric: [
          'Vraagt naar de kwalificatie van de lasser voor dit proces en deze positie',
          'Vraagt naar de LMB bij de werkplek en de bijbehorende LMK',
          'Legt het gevolg onder EN 1090 uit zonder de ervaring weg te zetten',
        ],
      },
      sayIt: 'Leg een projectsponsor in 60 seconden uit wat een LMB en een lasserskwalificatie zijn, en waarom een audit erom vraagt.',
      terms: [
        { term: 'NDO (NDT)', def: 'Niet-destructief onderzoek: VT, PT, MT, UT, RT.' },
        { term: 'Penetrantonderzoek', def: 'Rode vloeistof en ontwikkelaar die fijne oppervlaktescheuren zichtbaar maken.' },
        { term: 'LMB (WPS)', def: 'Lasmethodebeschrijving: hoe een bepaalde las gemaakt moet worden.' },
        { term: 'LMK (WPQR)', def: 'Lasmethodekwalificatie: het testbewijs achter een LMB.' },
      ],
    },
    {
      id: 'eng.joining.bolting',
      figure: 'eng.joining.bolt',
      title: 'Boutverbindingen: aanhaalmoment en voorspanning',
      pre: [
        {
          q: 'Als je een bout aandraait met een momentsleutel, hoeveel van dat moment gaat er naar het uitrekken van de bout, dus naar klemkracht?',
          options: ['Zo’n 90%', 'Zo’n 50%', 'Alles', 'Zo’n 10–15%'],
          answer: 'Zo’n 10–15%',
          why: 'Grofweg de helft gaat verloren aan wrijving onder de kop en zo’n 40% in de schroefdraad.',
        },
      ],
      teach: [
        'Een bout werkt als een veer: aandraaien rekt hem uit, en die spanning, de voorspanning, klemt de verbinding. Voorspanning is wat telt, niet het aanhaalmoment. Een M10-bout (metrische draad, 10 mm) in sterkteklasse 8.8 krijgt bij normale wrijving zo’n 25 kN voorspanning bij een aanhaalmoment van ongeveer 49 Nm (newtonmeter).',
        'Het aanhaalmoment is maar een indirecte maat. Zo’n 50% gaat op aan wrijving onder de kop, 40% aan wrijving in de schroefdraad, en maar 10% aan het uitrekken van de bout. Verander de wrijving met olie, een andere coating, vuil of roest, en hetzelfde moment geeft 25 tot 30% meer of minder voorspanning. Een geoliede bout die op een droog moment wordt aangedraaid, kan overbelast raken.',
        'Gereedschap: klikmomentsleutels voor handwerk, pulsgereedschap (luchtgereedschap dat in korte stoten aandraait), en elektrische schroefspindels (nutrunners) die moment en hoek regelen en vastleggen. Die zijn standaard in de autoassemblage, waar veiligheidsverbindingen zoals wielen en remmen per auto traceerbaar zijn. Aandraaien op moment-hoek, eerst een laag aanlegmoment en dan een vaste hoek verder, geeft een nauwkeuriger voorspanning. Audits meten het losbreekmoment, het moment waarbij een vastgedraaide bout verder gaat draaien, met een gekalibreerde sleutel, of gebruiken verfstrepen.',
        'Waarom bouten losraken: trillingen die de verbinding zijdelings laten schuiven, waardoor de moer terugdraait; zetting van ruwe vlakken of verf onder de kop, waardoor voorspanning verdwijnt; en te weinig voorspanning vanaf het begin. Remedies: de juiste voorspanning, langere bouten, bouten met een flenskop, geen verf in de verbinding. Veerringen helpen niet in trillingsproeven; schroefdraadborgmiddel wel.',
      ],
      example: {
        kind: 'worked',
        text: 'Een stoelframe zit vast met vier M10-bouten, specificatie op de schroefspindel 50 Nm ±10%. De ploegaudit meet het losbreekmoment op vijf auto’s: 53, 52, 31, 54 en 52 Nm. Het losbreekmoment ligt normaal iets boven het aandraaimoment, dus 31 is een probleem. Het log van de spindel toont vier keer OK voor die auto, maar twee daarvan op dezelfde bout: de operator draaide een al vastzittende bout nog eens aan, wat direct OK geeft, en de vierde bout was alleen met de hand ingedraaid. Oplossing: positiebewaking op het gereedschap, zodat elke boutpositie maar één keer telt.',
      },
      said: 'Wat engineers zeggen: “Het gereedschap zegt vijftig newtonmeter, prima, maar wat is de klemkracht? Iemand heeft die bouten geolied, dus we zitten er ver boven.”',
      recall: [
        {
          q: 'De nominale voorspanning van een verbinding is 25 kN. Bij aandraaien op moment spreidt de voorspanning zo’n ±25%. Wat is de laagste voorspanning die je kunt krijgen, in kN?',
          number: 18.75,
          tolerance: 0.3,
          unit: 'kN',
          why: '25 × 0,75 = 18,75 kN.',
        },
        {
          q: 'Waar gaat het grootste deel van het aanhaalmoment naartoe?',
          options: ['Naar wrijving onder de kop en in de schroefdraad', 'Naar het uitrekken van de bout', 'Naar het opwarmen van het gereedschap', 'Naar het buigen van het onderdeel'],
          answer: 'Naar wrijving onder de kop en in de schroefdraad',
          why: 'Zo’n 90% is wrijving; maar zo’n 10% wordt voorspanning.',
        },
        {
          q: 'Waarom raken boutverbindingen los door trillingen?',
          options: ['Het boutmateriaal raakt vermoeid', 'Zijdelings schuiven in de verbinding draait de moer terug', 'Veerringen slijten', 'Momentsleutels raken uit kalibratie'],
          answer: 'Zijdelings schuiven in de verbinding draait de moer terug',
          why: 'Dwarsverschuiving laat de schroefdraad losdraaien als de voorspanning te laag is om dat tegen te houden.',
        },
        {
          q: 'Monteurs oliën bouten die droog aangedraaid moeten worden, en draaien ze aan op het droge moment. Wat gebeurt er?',
          options: ['De voorspanning daalt', 'De voorspanning stijgt, mogelijk tot overbelasting van de bout', 'Er verandert niets', 'De bouten raken eerder los'],
          answer: 'De voorspanning stijgt, mogelijk tot overbelasting van de bout',
          why: 'Minder wrijving betekent dat meer van het moment omgezet wordt in rek.',
        },
      ],
      situation: {
        scene: 'Je bent bij een fabrikant van landbouwmachines. Bij drie klanten zijn wielbouten losgeraakt. Het engineeringteam stelt voor het aanhaalmoment met 20% te verhogen.',
        ask: 'Wat vraag je voordat het moment omhoog gaat?',
        model: 'Welke voorspanning halen we nu echt, en op welke wrijvingstoestand is de momentspecificatie gebaseerd: droog, geolied, gecoat? Zit er verf onder de wielmoeren die in gebruik inzakt? En wat zeggen de audit- en spindeldata: zaten deze verbindingen echt op spec, of zijn er bouten gemist? Het moment verhogen op een verbinding die om een andere reden voorspanning mist, lost het niet op.',
        rubric: [
          'Verlegt de vraag van aanhaalmoment naar voorspanning',
          'Vraagt naar de wrijvingstoestand en verf in de verbinding',
          'Vraagt om audit- of gereedschapsdata om te checken of verbindingen op spec zaten',
        ],
      },
      sayIt: 'Leg een teamleider assemblage in 60 seconden uit waarom aanhaalmoment niet hetzelfde is als klemkracht.',
      terms: [
        { term: 'Voorspanning', def: 'De spanning in een aangedraaide bout die de verbinding klemt.' },
        { term: 'Moment-hoek', def: 'Aandraaien tot een aanlegmoment, daarna een vaste hoek verder draaien.' },
        { term: 'Losbreekmoment', def: 'Moment dat nodig is om een al aangedraaide bout te laten draaien; gebruikt bij audits.' },
        { term: 'Zetting', def: 'Verlies van voorspanning doordat vlakken of verf onder de kop inzakken.' },
      ],
    },
    {
      id: 'eng.joining.bonding',
      title: 'Lijmen, klinken en clinchen',
      pre: [
        {
          q: 'Waarom kun je aluminium niet zomaar aan staal puntlassen?',
          options: ['Het is te duur', 'Aluminium geleidt geen stroom', 'Ze vormen brosse verbindingen, en aluminium smelt ver onder staal', 'Het mag wel, maar het is te traag'],
          answer: 'Ze vormen brosse verbindingen, en aluminium smelt ver onder staal',
          why: 'Aluminium smelt rond 660 °C, staal rond 1.500 °C, en waar ze mengen ontstaan brosse intermetallische fasen.',
        },
      ],
      teach: [
        'Constructielijmen (epoxy’s, polyurethanen, acrylaten) verbinden verschillende materialen, zoals aluminium aan staal of composiet, zonder vervorming door warmte. Ze dichten ook af, dempen trillingen en verdelen de belasting over een vlak, wat helpt tegen vermoeiing (scheuren door steeds herhaalde belasting). Ze zijn sterk op afschuiving (delen die langs elkaar schuiven) en zwak op afpellen (één rand die opengetrokken wordt). Ze vragen schone oppervlakken en uithardtijd; in de carrosseriebouw hardt epoxy uit in de lakoven op zo’n 180 °C. En ze zijn lastig te inspecteren.',
        'Klinknagels. Blindklinknagels (popnagels) zet je vanaf één kant. Zelfponsende klinknagels (SPR) ponsen door de bovenste plaat en spreiden uit in de onderste, zonder voorgeboord gat: de standaard voor aluminium carrosserieën. Massieve klinknagels zie je nog in de luchtvaart. De kwaliteit controleer je via de kophoogte en doorgezaagde verbindingen.',
        'Clinchen: een stempel drukt de platen in een gevormde matrijs eronder, tot een knoop die vastzit, zonder extra onderdeel en zonder warmte. Gebruikt in ventilatiekanalen, huishoudelijke apparaten en autodeuren. Zwakker dan een laspunt, maar goedkoop, zonder lasrook en prima met gecoate plaat.',
        'Hoe engineers kiezen. Zelfde materiaal, staal, hoge sterkte, goedkoop: lassen. Gemengde materialen, crashstijfheid, afdichting: lijm plus klinknagels, een hybride verbinding. Moet uit elkaar voor service: bouten. Vragen die je stelt: moet het uit elkaar, welke materialen, wat voor belasting (afpellen of afschuiving), en hoe controleren we het in productie?',
      ],
      example: {
        kind: 'worked',
        text: 'Een batterijbak voor een elektrische bestelbus verbindt aluminium profielen met stalen dwarsliggers. Lassen kan niet. Het ontwerp: 96 zelfponsende klinknagels om de 30 mm, plus een rups (een streng) constructie-epoxy van 14 meter. De klinknagels houden de delen op hun plek terwijl de lijm in de oven uithardt en vangen de pelkrachten aan de uiteinden van de rups op; de lijm draagt de afschuiving en houdt water buiten. In productie checkt een camera elke rups op onderbrekingen, bewaakt het klinkgereedschap kracht en slag op elke nagel, en wordt per ploeg één bak doorgezaagd om kophoogte en lijmdekking te controleren.',
      },
      said: 'Wat engineers zeggen: “Lijm is top op afschuiving, maar deze verbinding pelt open bij een crash. Zet een klinknagel aan elk eind van de rups om het pellen te stoppen.”',
      recall: [
        {
          q: 'Een overlappende lijmverbinding heeft een overlap van 25 mm × 20 mm. De afschuifsterkte van de lijm is 20 MPa (N/mm²). Welke belasting kan hij ongeveer op afschuiving dragen, in kN?',
          number: 10,
          tolerance: 0.2,
          unit: 'kN',
          why: '25 × 20 = 500 mm²; 500 × 20 N/mm² = 10.000 N = 10 kN.',
        },
        {
          q: 'Bij welk soort belasting is een lijmverbinding het zwakst?',
          options: ['Afschuiving', 'Druk', 'Afpellen', 'Gelijkmatige trek over het hele vlak'],
          answer: 'Afpellen',
          why: 'Bij afpellen komt de hele belasting op een dun lijntje aan de rand van de lijmnaad.',
        },
        {
          q: 'Wat is het grootste voordeel van zelfponsende klinknagels in aluminium carrosserieën?',
          options: ['Geen voorgeboord gat en geen warmte', 'Ze zijn onzichtbaar', 'Ze zijn makkelijk te verwijderen', 'Er is geen speciaal gereedschap voor nodig'],
          answer: 'Geen voorgeboord gat en geen warmte',
          why: 'SPR verbindt aluminium en gemengde materialen snel, zonder warmte of boren.',
        },
        {
          q: 'Wanneer kiezen engineers voor bouten in plaats van lassen of lijmen?',
          options: ['Als de verbinding zo licht mogelijk moet zijn', 'Als de delen van hetzelfde staal zijn', 'Als hij moet afdichten', 'Als de verbinding uit elkaar moet voor service'],
          answer: 'Als de verbinding uit elkaar moet voor service',
          why: 'Bouten zijn de enige van deze die je kunt losmaken en opnieuw kunt aandraaien.',
        },
      ],
      situation: {
        scene: 'Je bent bij een klant die machineframes maakt. Om gewicht te besparen wil het ontwerpteam een stalen beugel in aluminium uitvoeren en die “gewoon aan het stalen frame lassen, zoals altijd”.',
        ask: 'Wat vraag je?',
        model: 'Aluminium aan staal kun je niet op de normale manier lassen, dus welke verbindingsmethode plannen we: bouten, klinknagels, lijm of een combinatie? Moet de verbinding uit elkaar voor service, en krijgt hij pel- of afschuifbelasting? En hoe controleren we de verbinding in productie? Die antwoorden kunnen de gewichtsbesparing en de kosten veranderen, dus beter dat we het nu weten.',
        rubric: [
          'Benoemt dat aluminium aan staal niet conventioneel te lassen is',
          'Vraagt naar service, soort belasting en inspectie',
          'Koppelt de keuze terug aan de businesscase',
        ],
      },
      sayIt: 'Leg een productmanager in 60 seconden uit wanneer engineers kiezen voor lijm, klinknagels of bouten in plaats van lassen.',
      terms: [
        { term: 'Constructielijm', def: 'Dragende lijm, sterk op afschuiving, zwak op afpellen.' },
        { term: 'Zelfponsende klinknagel (SPR)', def: 'Klinknagel die door de bovenste plaat ponst en zich in de onderste vastzet, zonder gat.' },
        { term: 'Clinchen', def: 'Platen verbinden door ze in elkaar te drukken tot een knoop die vastzit.' },
        { term: 'Afpellen vs afschuiving', def: 'Afpellen trekt een verbinding vanaf één rand open; afschuiving laat de delen langs elkaar schuiven.' },
      ],
    },
  ],
};

// eng.moulding (NL): Spuitgieten: de machine, cyclustijd, materialen, fouten, procesvenster, matrijzen.
export default {
  lessons: [
    {
      id: 'eng.moulding.machine',
      title: 'De spuitgietmachine',
      pre: [
        {
          q: 'Iemand noemt een spuitgietmachine “een 250-tonner”. Waar slaan die 250 ton op?',
          options: ['Het gewicht van de machine', 'Het maximale shotgewicht in kilo', 'De kracht die de matrijs dichthoudt', 'De inspuitdruk'],
          answer: 'De kracht die de matrijs dichthoudt',
          why: 'Machines worden ingedeeld op sluitkracht: de kracht die de matrijshelften dichthoudt tegen de druk van de kunststof.',
        },
      ],
      teach: [
        'Een spuitgietmachine bestaat uit twee delen. De spuitunit smelt de kunststof en spuit hem in: kunststofkorrels vallen uit de trechter bovenop in een verwarmde cilinder (een lange stalen buis), waar een draaiende schroef ze smelt, mengt en vóór de punt verzamelt. De sluitunit houdt de matrijs vast: één helft staat vast, de andere beweegt. Eigenlijk is het een grote, nauwkeurige pers met aan één kant een verwarmde injectiespuit.',
        'De cyclus heeft zes stappen. De matrijs sluit. De schroef schuift als een plunjer naar voren en duwt de smelt via het aanspuitpunt, een kleine opening, de holte in: de productvormige ruimte in de matrijs (inspuiten). Daarna blijft hij drukken om extra kunststof na te persen terwijl het product krimpt (nadruk). Het product koelt in de matrijs, terwijl de schroef draait en het volgende shot doseert. De matrijs gaat open. Uitwerppennen duwen het product eruit. En weer opnieuw.',
        'Machines worden ingedeeld op sluitkracht, in ton. De gesmolten kunststof drukt de matrijshelften met honderden bar uit elkaar. Vuistregel: je hebt zo’n 0,3 tot 0,6 ton per cm² geprojecteerd oppervlak nodig, de schaduw van het product gezien vanuit de persrichting. Te weinig kracht en de matrijs gaat een fractie open op de deellijn, waar de helften op elkaar sluiten: de kunststof lekt eruit als braam, een dun vliesje aan het product.',
        'De matrijs is het dure, productspecifieke deel; de machine is generiek. Eén machine draait veel matrijzen, dus een spuitgieterij denkt in twee lijsten: welke machine heeft welke tonnage, en welke matrijs past op welke machines. Een matrijs die maar op één pers past, maakt die pers een bottleneck in de planning.',
      ],
      example: {
        kind: 'worked',
        text: 'Een behuizing heeft een geprojecteerd oppervlak van 15 × 20 cm = 300 cm². Het is ABS met normale wanddiktes, dus de engineer rekent met 0,4 ton per cm²: 300 × 0,4 = 120 ton. Een matrijs met 2 holtes verdubbelt het oppervlak naar 600 cm², dus 240 ton. Met 10 tot 20% marge gaat de matrijs op een machine van 280 of 300 ton, niet op de 200-tonner die toevallig vrij is.',
      },
      said: 'Wat engineers zeggen: “Die matrijs geeft braam op de 200-tonner. Zet hem op de 300, hij heeft die tonnage nodig.”',
      recall: [
        {
          q: 'Een product heeft een geprojecteerd oppervlak van 250 cm². De engineer rekent met 0,4 ton per cm². Hoeveel sluitkracht heeft de matrijs nodig, in ton?',
          number: 100,
          tolerance: 2,
          unit: 't',
          why: '250 × 0,4 = 100 ton, nog zonder veiligheidsmarge.',
        },
        {
          q: 'Wat gebeurt er tijdens de nadruk?',
          options: ['De schroef blijft drukken om kunststof na te persen terwijl het product krimpt', 'De matrijs gaat een stukje open om lucht eruit te laten', 'De schroef draait terug om het volgende shot te doseren', 'De uitwerppennen duwen het product eruit'],
          answer: 'De schroef blijft drukken om kunststof na te persen terwijl het product krimpt',
          why: 'Kunststof krimpt bij het afkoelen; de nadruk vult dat aan tot het aanspuitpunt bevroren is.',
        },
        {
          q: 'Wanneer doseert de schroef het volgende shot?',
          options: ['Nadat de matrijs opengaat', 'Voordat de matrijs sluit', 'Tijdens het inspuiten', 'Terwijl het product in de matrijs afkoelt'],
          answer: 'Terwijl het product in de matrijs afkoelt',
          why: 'Doseren loopt parallel aan het koelen, dus meestal kost het geen extra cyclustijd.',
        },
        {
          q: 'Wat geeft te weinig sluitkracht meestal?',
          options: ['Brandplekken', 'Braam op de deellijn', 'Inzakplekken', 'Natte korrels'],
          answer: 'Braam op de deellijn',
          why: 'De matrijs wordt een fractie opengedrukt en de kunststof perst zich tussen de helften door.',
        },
      ],
      situation: {
        scene: 'Je bent bij een spuitgieter die toelevert aan een autofabrikant. De planner zegt: “Machine 7 is vrij, daar zetten we de nieuwe matrijs op.” Machine 7 is 150 ton; het nieuwe product is groot en plat.',
        ask: 'Wat vraag je voordat de matrijs erop gaat?',
        model: 'Wat is het geprojecteerd oppervlak van het product en hoeveel sluitkracht heeft de matrijs nodig? Als een groot plat product 200 ton vraagt, krijg je braam op machine 7, en dan verliezen we meer tijd met sorteren dan we winnen met een vrije pers. En past de matrijs fysiek tussen de geleidekolommen (de vier kolommen van de sluitunit), en valt de matrijshoogte binnen het bereik van de machine?',
        rubric: [
          'Vraagt naar geprojecteerd oppervlak en benodigde sluitkracht',
          'Koppelt te weinig tonnage aan braam en afkeur',
          'Checkt of de matrijs fysiek op de machine past',
        ],
      },
      sayIt: 'Leg een nieuwe accountmanager in 60 seconden uit wat een spuitgietmachine doet en waarom tonnage ertoe doet.',
      terms: [
        { term: 'Sluitkracht', def: 'De kracht, in ton, die de matrijs tijdens het inspuiten dichthoudt.' },
        { term: 'Geprojecteerd oppervlak', def: 'Het oppervlak van het product gezien vanuit de persrichting, de schaduw.' },
        { term: 'Nadruk', def: 'Druk na het vullen die kunststof naperst terwijl het product krimpt.' },
      ],
    },
    {
      id: 'eng.moulding.cycle',
      figure: 'eng.moulding.cycle',
      title: 'Cyclustijd en output',
      pre: [
        {
          q: 'Een product heeft een spuitgietcyclus van 30 seconden. Hoeveel daarvan stroomt de kunststof ongeveer de matrijs in?',
          options: ['Zo’n 20 seconden', 'Eén à twee seconden', 'Zo’n 10 seconden', 'Ongeveer de helft'],
          answer: 'Eén à twee seconden',
          why: 'Vullen gaat snel; het grootste deel van de cyclus wacht je tot het product genoeg is afgekoeld om uit te werpen.',
        },
      ],
      teach: [
        'Een typische cyclus van 30 seconden is bijvoorbeeld: matrijs sluiten 2 s, inspuiten 1,5 s, nadruk 6 s, koelen 15 s, matrijs openen 2 s, uitwerpen en uitnemen 3,5 s. Koelen is vaak 50 tot 80% van de cyclus. De kunststof moet stijf genoeg zijn dat het product zijn vorm houdt als het eruit wordt geduwd.',
        'De koeltijd groeit met het kwadraat van de wanddikte. Een twee keer zo dikke wand vraagt ruwweg vier keer zoveel koeltijd. Daarom vechten ontwerpers voor dunne, gelijkmatige wanden, en daarom kan één dikke bus (een massief nokje, bijvoorbeeld voor een schroef) de cyclus van het hele product bepalen. Ook de matrijstemperatuur en goed geplaatste koelkanalen tellen mee.',
        'Output per uur = 3.600 / cyclustijd × aantal holtes. Een 4-voudige matrijs op 24 seconden geeft 3.600 / 24 × 4 = 600 stuks per uur. Meer holtes betekent meer stuks per cyclus, maar ook een grotere, duurdere matrijs en een grotere machine. Is één holte beschadigd, dan wordt die vaak dichtgezet en draait de matrijs op drie.',
        'Cyclustijd is een commercieel getal. De verkoopprijs van een product is berekend met een cyclustijd. Loopt de echte cyclus 10% langzamer, dan kan de marge op dat product verdwijnen. Zegt iemand dat een matrijs “op 28 seconden loopt”, vraag dan of dat de gecalculeerde cyclus is, de ingestelde, of het gemiddelde dat een week lang echt gehaald is.',
      ],
      example: {
        kind: 'worked',
        text: 'Een 2-voudige matrijs voor een dop loopt op 20 seconden: 3.600 / 20 × 2 = 360 doppen per uur. Koelen is 12 van de 20 seconden. De dikste wand is 3 mm. De ontwerper kan die naar 2,4 mm brengen. Koeltijd schaalt met het kwadraat van de dikte: (2,4 / 3)² = 0,64, dus de koeltijd zakt van 12 naar zo’n 7,7 seconden en de cyclus naar zo’n 15,7 seconden. De output stijgt naar 3.600 / 15,7 × 2 ≈ 459 per uur, zo’n 27% meer, op dezelfde machine.',
      },
      said: 'Wat engineers zeggen: “We zijn koeltijd-gelimiteerd. Haal een millimeter uit die wand en we winnen vijf seconden.”',
      recall: [
        {
          q: 'Een 8-voudige matrijs (8 stuks per shot) loopt een cyclus van 30 seconden. Hoeveel stuks per uur?',
          number: 960,
          tolerance: 5,
          unit: 'stuks/uur',
          why: '3.600 / 30 = 120 cycli per uur; 120 × 8 = 960 stuks.',
        },
        {
          q: 'De wanddikte van een product gaat van 2 mm naar 4 mm. Met welke factor groeit de koeltijd ongeveer?',
          number: 4,
          tolerance: 0.3,
          unit: '×',
          why: 'Koeltijd schaalt met het kwadraat van de dikte: (4 / 2)² = 4.',
        },
        {
          q: 'Welke fase is meestal het grootste deel van de cyclus?',
          options: ['Inspuiten', 'Matrijs openen', 'Koelen', 'Uitwerpen'],
          answer: 'Koelen',
          why: 'Koelen kost vaak 50 tot 80% van de cyclus.',
        },
        {
          q: 'Waarom doet een langzamere echte cyclus pijn?',
          options: ['De prijs is berekend op de gecalculeerde cyclus, dus de marge krimpt', 'De kunststof wordt duurder', 'De machine verbruikt minder stroom', 'De matrijs slijt sneller'],
          answer: 'De prijs is berekend op de gecalculeerde cyclus, dus de marge krimpt',
          why: 'Er gaan meer machine-uren in elk product, terwijl de prijs vastligt.',
        },
      ],
      situation: {
        scene: 'Je bent bij een spuitgieter met een capaciteitsprobleem. Volgens het ERP loopt matrijs 4411 op 22 seconden. De operators zeggen dat hij al maanden op 26 seconden draait “vanwege kromtrekken”.',
        ask: 'Wat vraag je, en waarom doet het ertoe?',
        model: 'Op welke cyclus hebben we dit product gecalculeerd, en wat is de gemiddelde echte cyclus van de afgelopen weken? Vier seconden op 22 is 18% meer machinetijd per product, oftewel zo’n 15% minder output dan gepland, dus zowel de capaciteitsplanning als de marge kloppen niet. En wie heeft die extra koeltijd bepaald: lost die het kromtrekken op, of verstopt die een koelprobleem in de matrijs?',
        rubric: [
          'Maakt onderscheid tussen gecalculeerde, ingestelde en echte cyclustijd',
          'Maakt de impact concreet: zo’n 15% minder output, 18% meer machine-uren, minder marge',
          'Vraagt naar de oorzaak in plaats van extra koeltijd als blijvend te accepteren',
        ],
      },
      sayIt: 'Leg een collega van sales in 60 seconden uit waarom koeltijd en wanddikte de prijs van een kunststof product bepalen.',
      terms: [
        { term: 'Cyclustijd', def: 'De tijd van één volledige spuitgietcyclus, van sluiten tot sluiten.' },
        { term: 'Holte (cavity)', def: 'Eén productvormige ruimte in de matrijs; een 4-voudige matrijs maakt 4 stuks per shot.' },
        { term: 'Koeltijd', def: 'De tijd dat het product in de gesloten matrijs stolt; schaalt met het kwadraat van de wanddikte.' },
      ],
    },
    {
      id: 'eng.moulding.materials',
      title: 'Kunststoffen, drogen en maalgoed',
      pre: [
        {
          q: 'Nylon (PA) komt rechtstreeks uit een geopende zak. Wat is het grootste risico als je het zonder drogen verwerkt?',
          options: ['De kleur klopt niet', 'De matrijs wordt te heet', 'Niks, het komt droog van de leverancier', 'Brosse producten en zilverstrepen door vocht'],
          answer: 'Brosse producten en zilverstrepen door vocht',
          why: 'PA neemt vocht op uit de lucht; in de hete cilinder tast dat water het polymeer aan en geeft het stoomstrepen.',
        },
      ],
      teach: [
        'Met vier kunststoffen kom je al een heel eind. PP: goedkoop, taai, chemisch bestendig, voor doppen, kratten en auto-interieurs. ABS: stijf, mooi oppervlak, voor behuizingen. PA (nylon): sterk en hittebestendig, vaak glasgevuld, voor technische delen onder de motorkap. PC: transparant en slagvast, voor lenzen en kappen. Elk heeft zijn eigen smelt- en matrijstemperatuur.',
        'Sommige kunststoffen nemen water op uit de lucht: PA, PC, PET en PBT. Die moeten vóór het spuitgieten gedroogd worden, meestal 2 tot 4 uur op 80 tot 120 °C (PET nog heter) in een droger die heel droge lucht door de korrels blaast; je controleert het dauwpunt van die lucht. Nat materiaal geeft zilverstrepen (splay) en, erger, zwakke producten die er goed uitzien maar later breken. PP en PE nemen nauwelijks water op en hoeven meestal niet gedroogd te worden.',
        'Maalgoed is vermalen aanspuitingen (de kanaaltjes kunststof die de holtes voeden) en afkeur die terug de trechter in gaan. Dat bespaart materiaal, maar elke keer door de cilinder degradeert de kunststof een beetje. Klanten staan vaak een maximum toe, bijvoorbeeld 10 tot 25%, en sommige veiligheids- of medische producten helemaal niks. Een maalmolen naast de machine is normaal; een onduidelijke verhouding is een kwaliteitsrisico.',
        'Kleur komt meestal uit masterbatch: gekleurde korrels die er voor een paar procent bij gaan. Een kleurwissel betekent spoelen: nieuw materiaal door de cilinder duwen tot de oude kleur weg is. Donker naar licht is het traagst; van zwart naar wit kan een uur en veel afval kosten. Goede planners plannen van licht naar donker.',
      ],
      example: {
        kind: 'worked',
        text: 'Een spuitgieter maakt een beugel van PA6 met 30% glasvezel. De droger houdt 50 kg en de machine verbruikt 12 kg per uur. De droogtijd is 4 uur, dus de droger moet minstens 4 × 12 = 48 kg bevatten om continu droog materiaal te leveren: net genoeg. Als de nachtdienst hem leeg laat lopen en er dan in één keer 20 kg vers, nat materiaal bij gooit, heeft dat nieuwe materiaal maar zo’n 1,5 uur in de droger gezeten als het bij de machine aankomt. De volgende ochtend vindt kwaliteit brosse beugels uit de nacht.',
      },
      said: 'Wat engineers zeggen: “Dat is splay. Check eerst het dauwpunt van de droger voordat je aan het proces zit.”',
      recall: [
        {
          q: 'Een machine verbruikt 20 kg PC per uur. De droogtijd is 3 uur. Hoeveel kg moet de droger minimaal bevatten om continu goed gedroogd materiaal te leveren?',
          number: 60,
          tolerance: 1,
          unit: 'kg',
          why: 'Elke korrel moet 3 uur in de droger zitten: 3 × 20 = 60 kg.',
        },
        {
          q: 'Welke kunststof hoeft meestal niet gedroogd te worden?',
          options: ['PA', 'PP', 'PC', 'PET'],
          answer: 'PP',
          why: 'PP neemt nauwelijks vocht op; PA, PC en PET wel.',
        },
        {
          q: 'Waarom beperken klanten het percentage maalgoed?',
          options: ['Maalgoed is duurder', 'Maalgoed verandert de kleur', 'Elke keer door de cilinder degradeert de kunststof', 'Maalgoed verstopt de trechter'],
          answer: 'Elke keer door de cilinder degradeert de kunststof',
          why: 'Warmte en afschuiving maken de polymeerketens korter, en dan daalt de sterkte.',
        },
        {
          q: 'Welke kleurvolgorde houdt spoeltijd en afval het laagst?',
          options: ['Van licht naar donker', 'Van donker naar licht', 'Licht en donker afwisselen', 'De volgorde maakt niet uit'],
          answer: 'Van licht naar donker',
          why: 'Een beetje lichte rest verdwijnt in een donkere kleur; andersom moet je lang spoelen.',
        },
      ],
      situation: {
        scene: 'Je bent bij een spuitgieter met een afkeurprobleem op een nylon product. De afkeur is hoog op maandagochtend en na weekenden. Het team denkt dat het aan het opwarmen van de matrijs ligt.',
        ask: 'Wat vraag je over het materiaal?',
        model: 'Wat gebeurt er in het weekend met het materiaal: blijft het in de droger, in de trechter, of in een open zak? Nylon trekt snel vocht aan, dus materiaal dat twee dagen op de machine staat kan maandag nat zijn. Kunnen we de drogerinstellingen en het dauwpunt checken, en de afkeur van het eerste uur naast het materiaallog leggen?',
        rubric: [
          'Denkt aan vocht in hygroscopisch materiaal, niet alleen aan de matrijs',
          'Vraagt hoe het materiaal in het weekend wordt opgeslagen en gedroogd',
          'Stelt voor de drogerdata naast het afkeurpatroon te leggen',
        ],
      },
      sayIt: 'Leg een planner in 60 seconden uit waarom drogen, maalgoed en kleurvolgorde invloed hebben op kwaliteit en verloren tijd.',
      terms: [
        { term: 'Hygroscopisch', def: 'Neemt vocht op uit de lucht; moet vóór verwerking gedroogd worden (PA, PC, PET).' },
        { term: 'Maalgoed', def: 'Vermalen aanspuitingen en afkeur die met vers materiaal worden gemengd.' },
        { term: 'Masterbatch', def: 'Geconcentreerde kleurkorrels die er voor een paar procent bij gaan.' },
        { term: 'Splay', def: 'Zilverstrepen op het oppervlak, vaak door vocht.' },
      ],
    },
    {
      id: 'eng.moulding.defects',
      title: 'Fouten en hun oorzaken',
      pre: [
        {
          q: 'Een product heeft aan de buitenkant een klein deukje, precies boven een dikke rib aan de binnenkant. Hoe heet dat?',
          options: ['Een inzakplek', 'Braam', 'Een onvolledig gevuld product', 'Een vloeilijn'],
          answer: 'Een inzakplek',
          why: 'Dikke delen blijven krimpen nadat de buitenkant al vast is, en trekken het oppervlak naar binnen.',
        },
      ],
      teach: [
        'Short shot, onvolledige vulling: het product is niet helemaal vol. Oorzaken: te weinig gedoseerd, te lage inspuitdruk of -snelheid, te koude kunststof, of lucht die niet weg kan via de ontluchting, piepkleine sleufjes in de matrijs waar lucht uit kan. Braam (flash): een dun velletje kunststof op de deellijn of rond pennen. Oorzaken: te hoge druk, te weinig sluitkracht, of een versleten matrijs waarvan de helften niet meer goed afsluiten.',
        'Inzakplekken (sink marks): deukjes boven dikke delen. De binnenkant blijft krimpen nadat de huid al vast is. Oorzaken: te weinig nadruk of te korte nadruktijd, een aanspuitpunt dat te vroeg bevriest (stolt), of een ontwerp met dikke ribben en bussen. Holtes (voids) zijn hetzelfde probleem binnenin: luchtbellen waar de kern is weggekrompen.',
        'Kromtrekken (warpage): het product buigt na het uitwerpen omdat het ongelijk krimpt. Oorzaken: ongelijke wanddikte, één matrijshelft warmer dan de andere, glasvezels die allemaal één kant op liggen, of te warm uitwerpen. Kromtrekken komt vaak pas uren later, dus het kan bij de machine door de controle komen en bij de klant afgekeurd worden.',
        'Brandplekken: zwarte of bruine plekjes, meestal aan het eind van de vloeiweg. Lucht zit opgesloten en wordt zo snel samengeperst dat hij heet wordt en de kunststof verbrandt. Oorzaken: verstopte of ontbrekende ontluchting, te snel inspuiten. Elke fout wijst naar een paar oorzaken. Goede engineers vragen eerst wat er veranderd is, voordat ze aan de instellingen zitten.',
      ],
      example: {
        kind: 'worked',
        text: 'Een PP-krat begint na 80.000 shots op één hoek braam te geven. De insteller zet de sluitkracht van 180 naar 220 ton en de braam is weg. Twee weken later is hij terug, erger. De echte oorzaak: de deellijn op die hoek is versleten, dus de helften sluiten daar niet meer af. Meer sluitkracht schoof het probleem alleen vooruit en geeft extra slijtage. De oplossing: matrijs eruit, deellijn repareren in de gereedschapmakerij (de eigen matrijzenwerkplaats), en weer draaien op 180 ton.',
      },
      said: 'Wat engineers zeggen: “Hij loopt niet vol aan het eind van de vloeiweg. Voordat je de druk opschroeft: check de ontluchting.”',
      recall: [
        {
          q: 'Een product met een geprojecteerd oppervlak van 400 cm² vraagt 0,5 ton per cm². Het draait op een machine van 160 ton. Hoeveel ton komt het tekort?',
          number: 40,
          tolerance: 1,
          unit: 't',
          why: '400 × 0,5 = 200 ton nodig; 200 − 160 = 40 ton tekort, dus reken op braam.',
        },
        {
          q: 'Brandplekken aan het eind van de vloeiweg. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Nat materiaal', 'Te lange nadruktijd', 'Te hoge sluitkracht', 'Lucht die niet weg kan via de ontluchting'],
          answer: 'Lucht die niet weg kan via de ontluchting',
          why: 'Opgesloten lucht wordt samengeperst en zo heet dat de kunststof verbrandt.',
        },
        {
          q: 'Waarom kan kromtrekken bij de machine door de controle komen en toch bij de klant fout zijn?',
          options: ['Controleurs zijn niet getraind', 'Producten blijven uren na het spuitgieten krimpen en buigen', 'De klant gebruikt een andere mal', 'Kromtrekken komt alleen bij koud weer'],
          answer: 'Producten blijven uren na het spuitgieten krimpen en buigen',
          why: 'Krimp gaat door na het uitwerpen, dus een warm product kan nog bewegen.',
        },
        {
          q: 'Welke aanpassing vermindert inzakplekken het meest waarschijnlijk?',
          options: ['Minder sluitkracht', 'De matrijs sneller openen', 'Meer nadruk of een langere nadruktijd', 'Meer maalgoed'],
          answer: 'Meer nadruk of een langere nadruktijd',
          why: 'Nadruk perst kunststof na om de krimp in dikke delen op te vangen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een spuitgieter in een probleemoplossingsoverleg. Een matrijs die een jaar goed liep, geeft ineens braam. De ploegleider zegt: “We hebben de sluitkracht verhoogd, opgelost.”',
        ask: 'Wat vraag je?',
        model: 'Mooi dat de afkeur gestopt is, maar wat is er veranderd aan een matrijs die een jaar goed liep? Als materiaal en instellingen hetzelfde zijn, is de deellijn misschien versleten, en meer sluitkracht maakt dat op termijn erger. Wanneer moet de matrijs in onderhoud, en kan de gereedschapmakerij naar die hoek kijken?',
        rubric: [
          'Maakt onderscheid tussen de snelle fix en de oorzaak',
          'Vraagt wat er veranderd is na een lange stabiele periode',
          'Noemt matrijsslijtage en onderhoud als waarschijnlijke oorzaak',
        ],
      },
      sayIt: 'Leg een kwaliteitsengineer uit een andere branche in 60 seconden de vier meest voorkomende spuitgietfouten uit, met van elk één oorzaak.',
      terms: [
        { term: 'Short shot', def: 'Een product dat niet helemaal gevuld is.' },
        { term: 'Braam', def: 'Dun overtollig kunststof op de deellijn of rond pennen.' },
        { term: 'Inzakplek', def: 'Een deukje in het oppervlak boven een dik deel.' },
        { term: 'Kromtrekken', def: 'Vervorming van het product door ongelijke krimp.' },
      ],
    },
    {
      id: 'eng.moulding.process',
      title: 'Het procesvenster',
      pre: [
        {
          q: 'Een goede procestechnicus vult het grootste deel van de holte op snelheid. Wanneer schakelt iemand die volgens scientific moulding werkt om naar nadruk?',
          options: ['Bij 50% vol', 'Pas als het product 100% vol is', 'Bij zo’n 95 tot 98% vol', 'Na vast 5 seconden'],
          answer: 'Bij zo’n 95 tot 98% vol',
          why: 'Op snelheid bijna vol vullen en dan op druk nadrukken maakt het proces stabiel van shot tot shot.',
        },
      ],
      teach: [
        'De belangrijkste instellingen: smelttemperatuur, matrijstemperatuur, inspuitsnelheid, omschakelpunt (van vullen naar nadruk), nadruk en nadruktijd, koeltijd en tegendruk (de weerstand waartegen de schroef doseert, wat de smelt goed mengt). Het procesvenster is het bereik van die instellingen waarbinnen elk product goed is. Een breed venster is robuust; een smal venster betekent dat kleine schommelingen in materiaal of temperatuur al afkeur geven.',
        'Scientific moulding (ook wel decoupled moulding) knipt de cyclus op: vul zo’n 95 tot 98% van het product op snelheid, en schakel dan om naar druk om het laatste stukje na te persen. De engineer vindt de instellingen met korte studies: een viscositeitscurve (hoe makkelijk de smelt bij elke snelheid vloeit) om de inspuitsnelheid te kiezen, een gate-freeze-studie (wanneer het aanspuitpunt stolt) om de nadruktijd te bepalen, en een test van het venster. Het resultaat is een vastgelegde, onderbouwde instelling.',
        '“Even bijdraaien” is riskant. Instellingen beïnvloeden elkaar: hogere temperatuur verandert de viscositeit, dat verandert het vullen, dat verandert de druk. Elke dienst die een paar waarden aanpast, duwt het proces ergens anders heen, en niemand weet meer welke instelling wat oplost. Na een maand heeft een matrijs drie versies van “de goede instellingen”.',
        'Goede bedrijven zetten de goedgekeurde instellingen vast, loggen elke wijziging met een reden, en vragen eerst “wat is er veranderd?” voordat ze bijstellen. Moet een operator blijven bijdraaien om goede producten te maken, dan zit de echte oorzaak eerder in het proces: nat materiaal, een verstopt koelkanaal, een versleten terugslagring, het ventielringetje op de schroefpunt dat voorkomt dat smelt terugstroomt. Bijdraaien verstopt dat.',
      ],
      example: {
        kind: 'worked',
        text: 'Een matrijs voor een PC-lens geeft 3% afkeur. De engineer vindt in het log 14 wijzigingen in 6 weken, van vier mensen. Ze zet alles terug naar de goedgekeurde instelkaart, draait een studie van 30 shots en ziet dat het omschakelpunt verloopt omdat de terugslagring op de schroef lekt: het restkussen, de smelt die na het inspuiten vóór de schroef overblijft, schommelt van 2 tot 8 mm. Na vervanging van de terugslagring draaien de oorspronkelijke instellingen op 0,4% afkeur. De oplossing was een onderdeel van €300, niet die 14 aanpassingen.',
      },
      said: 'Wat engineers zeggen: “Ga het niet met instellingen najagen. Als het kussen zo heen en weer springt, is de terugslagring op.”',
      recall: [
        {
          q: 'Een shot is 100 cm³. De engineer schakelt om naar nadruk bij 96% vol. Hoeveel cm³ wordt er op snelheid gevuld?',
          number: 96,
          tolerance: 0.5,
          unit: 'cm³',
          why: '96% van 100 cm³ is 96 cm³; de nadruk perst de laatste 4 cm³ en de krimp na.',
        },
        {
          q: 'Wat betekent een breed procesvenster?',
          options: ['De machine heeft een groot scherm', 'De matrijs heeft veel holtes', 'Producten zijn alleen goed bij één exacte instelling', 'Producten blijven goed ondanks kleine schommelingen in instellingen of materiaal'],
          answer: 'Producten blijven goed ondanks kleine schommelingen in instellingen of materiaal',
          why: 'Een breed venster betekent een robuust proces.',
        },
        {
          q: 'Waarom is “even bijdraaien” riskant?',
          options: ['Instellingen beïnvloeden elkaar, en steeds bijdraaien verstopt de echte oorzaak', 'Operators mogen niet aan de machine komen', 'De garantie op de machine vervalt', 'Bijstellingen zijn altijd te klein om uit te maken'],
          answer: 'Instellingen beïnvloeden elkaar, en steeds bijdraaien verstopt de echte oorzaak',
          why: 'Elke wijziging verschuift andere variabelen, en de oorzaak blijft zitten.',
        },
        {
          q: 'Een operator moet steeds bijstellen om goede producten te maken. Waar kijkt een goede engineer eerst?',
          options: ['Naar de opleiding van de operator', 'Naar wat er eerder in het proces veranderd is: materiaal, koeling, slijtage van de schroef', 'Naar een grotere machine', 'Naar de tolerantie op de tekening'],
          answer: 'Naar wat er eerder in het proces veranderd is: materiaal, koeling, slijtage van de schroef',
          why: 'Constant bijstellen is een symptoom van een instabiele input.',
        },
      ],
      situation: {
        scene: 'Je begeleidt een afkeurreductieproject bij een spuitgieter. Elke dienst heeft zijn eigen “beste” instellingen voor dezelfde matrijs. De nachtdienst zegt dat die van hen beter zijn.',
        ask: 'Wat stel je voor?',
        model: 'Laten we per matrijs één goedgekeurde instelkaart afspreken, gemaakt door de procesengineer met een korte studie, en die vastzetten. Elke wijziging daarna wordt gelogd met een reden. Dan hoeven we niet te discussiëren wiens instellingen het best zijn, maar kijken we naar het log: moet een dienst bijstellen, dan is er eerder in het proces iets instabiel, en dat lossen we op.',
        rubric: [
          'Stelt één vastgelegde, goedgekeurde instelling per matrijs voor',
          'Introduceert een wijzigingslog met redenen',
          'Maakt van het conflict tussen diensten een zoektocht naar de instabiele input',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom operators niet vrij aan spuitgietinstellingen moeten draaien.',
      terms: [
        { term: 'Procesvenster', def: 'Het bereik van instellingen waarbinnen alle producten goed zijn.' },
        { term: 'Omschakelpunt', def: 'Het moment dat de machine van vullen op snelheid overschakelt naar nadruk.' },
        { term: 'Scientific moulding', def: 'Het proces instellen met studies en data in plaats van proberen.' },
        { term: 'Restkussen', def: 'De kleine hoeveelheid kunststof die aan het eind van het inspuiten vóór de schroef overblijft.' },
      ],
    },
    {
      id: 'eng.moulding.tooling',
      title: 'Matrijzen, wissels en onderhoud',
      pre: [
        {
          q: 'Een klant bestelt een nieuwe matrijs voor een middelgroot technisch product. Wat is een realistische levertijd tot de eerste producten?',
          options: ['Een week', '10 tot 16 weken', 'Twee jaar', 'Twee dagen'],
          answer: '10 tot 16 weken',
          why: 'Ontwerp, staal, bewerken, assembleren en proefspuiten kosten meestal zo’n drie maanden of meer.',
        },
      ],
      teach: [
        'Een matrijs is precisiegereedschap van gehard staal, met holtes, koelkanalen, uitwerppennen en ontluchting. Een eenvoudige matrijs kost al €20.000; een meervoudige of grote automotive matrijs al snel €100.000 tot €300.000 of meer. De levertijd is meestal 10 tot 16 weken, plus proefspuitingen (T1, T2) voordat de klant de producten vrijgeeft.',
        'Het aanspuitsysteem is het kanalenstelsel dat de kunststof van de spuitmond van de machine naar de holtes brengt. Een koudkanaal stolt en wordt met de producten uitgeworpen, als afval of maalgoed. Een heetkanaal houdt de kunststof vloeibaar in een verwarmd verdeelblok (een blok met kanalen in de matrijs): geen aanspuitafval en vaak een kortere cyclus, maar een duurdere matrijs en extra storingsbronnen zoals verwarmingszones en lekkage.',
        'Matrijzen hebben preventief onderhoud nodig, vaak elke 50.000 tot 100.000 shots of op een vaste kalender: ontluchting schoonmaken, uitwerppennen checken, koelkanalen ontkalken en de deellijn controleren. Onderhoud overslaan zie je later terug als braam, onvolledig gevulde producten en langere cycli. De shotteller op de matrijs is het getal dat telt.',
        'Een matrijswissel duurt meestal 1 tot 2 uur: water en heetkanaal loskoppelen, kraan, losnemen, opspannen, opwarmen en eerste-stukgoedkeuring. Met SMED breng je dat naar 15 tot 30 minuten: de volgende matrijs voorverwarmen, standaard opspanplaten, snelkoppelingen voor water en stroom, en alles wat kan al doen terwijl de machine nog draait.',
      ],
      example: {
        kind: 'worked',
        text: 'Een spuitgieterij doet 40 matrijswissels per week van 90 minuten: 60 uur perstijd. Een SMED-project brengt ze naar 30 minuten: 40 × 1 = 40 uur per week bespaard. Bij een machinetarief van €60 per uur is dat zo’n €2.400 per week, of €110.000 per jaar bij 46 weken. De investering: snelkoppelingen en opspanplaten voor €40.000 en een voorwarmstation voor €15.000. Terugverdientijd: ongeveer een half jaar, en kleinere series worden mogelijk.',
      },
      said: 'Wat engineers zeggen: “Die matrijs staat op 120.000 shots en is nog niet in de gereedschapmakerij geweest. Geen wonder dat hij braam geeft.”',
      recall: [
        {
          q: 'Een pers doet 15 matrijswissels per week. SMED brengt elke wissel van 2 uur naar 30 minuten. Hoeveel uur per week komt er vrij?',
          number: 22.5,
          tolerance: 0.5,
          unit: 'uur',
          why: '15 × (2 − 0,5) = 15 × 1,5 = 22,5 uur.',
        },
        {
          q: 'Wat is het grootste voordeel van een heetkanaal?',
          options: ['Een goedkopere matrijs', 'Minder verwarmingszones', 'Geen aanspuitafval en vaak een kortere cyclus', 'Geen koelkanalen nodig'],
          answer: 'Geen aanspuitafval en vaak een kortere cyclus',
          why: 'De kunststof in het verdeelblok blijft vloeibaar, dus er hoeft geen aanspuiting af te koelen of uitgeworpen te worden.',
        },
        {
          q: 'Welk getal vertelt je wanneer een matrijs onderhoud nodig heeft?',
          options: ['De tonnage van de machine', 'De cyclustijd', 'Het aantal holtes', 'De shotteller'],
          answer: 'De shotteller',
          why: 'Onderhoud wordt gepland op het aantal shots sinds de laatste beurt.',
        },
        {
          q: 'Welke SMED-stap bespaart de meeste opwarmtijd bij een matrijswissel?',
          options: ['De volgende matrijs voorverwarmen vóór de wissel', 'De oude matrijs sneller laten draaien', 'Een grotere kraan gebruiken', 'Alleen ’s nachts wisselen'],
          answer: 'De volgende matrijs voorverwarmen vóór de wissel',
          why: 'Het opwarmen gebeurt buiten de stilstand, terwijl de machine nog draait.',
        },
      ],
      situation: {
        scene: 'Je bent bij een spuitgieter waar een klant om kleinere series vraagt. De productiemanager zegt: “Onmogelijk, elke matrijswissel kost ons twee uur.”',
        ask: 'Hoe reageer je?',
        model: 'Kunnen we één matrijswissel filmen en de stappen splitsen in wat echt moet als de machine stilstaat en wat ervoor of erna kan? In de meeste bedrijven kunnen voorverwarmen, de volgende matrijs klaarzetten, gereedschap en waterslangen buiten de stilstand. Als we twee uur naar 30 minuten brengen, worden kleinere series betaalbaar, en kunnen we precies uitrekenen wat het oplevert.',
        rubric: [
          'Stelt voor een echte wissel te analyseren in plaats van te discussiëren',
          'Splitst interne en externe stappen (SMED)',
          'Koppelt kortere wissels aan kleinere series en een berekende winst',
        ],
      },
      sayIt: 'Leg een inkoper in 60 seconden uit waarom een nieuwe matrijs zo duur is, drie maanden duurt, en daarna nog onderhoud nodig heeft.',
      terms: [
        { term: 'Heetkanaal', def: 'Verwarmd verdeelblok dat de kunststof vloeibaar houdt tot aan de holtes.' },
        { term: 'Shotteller', def: 'Teller op de matrijs die aangeeft hoeveel cycli hij heeft gemaakt.' },
        { term: 'SMED', def: 'Methode om omsteltijd te verkorten door werk buiten de stilstand te leggen.' },
        { term: 'T1', def: 'De eerste proefspuiting van een nieuwe matrijs.' },
      ],
    },
  ],
};

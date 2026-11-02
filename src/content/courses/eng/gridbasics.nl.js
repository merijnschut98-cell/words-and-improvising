// eng.gridbasics (NL): Het elektriciteitsnet: basis, spanningsniveaus, de weg naar het stopcontact, belasting, netcongestie, wat een netbeheerder doet.
export default {
  lessons: [
    {
      id: 'eng.gridbasics.basics',
      title: 'Volt, ampère, watt en kWh',
      pre: [
        {
          q: 'Een gemiddeld Nederlands huishouden verbruikt zo’n 2.700 kWh stroom per jaar. Wat is het gemiddelde vermogen over het jaar?',
          options: ['Zo’n 3 kW', 'Zo’n 0,3 kW', 'Zo’n 30 kW', 'Zo’n 2,7 kW'],
          answer: 'Zo’n 0,3 kW',
          why: '2.700 kWh / 8.760 uur ≈ 0,31 kW. De pieken zijn veel hoger, en daar moet het net op berekend zijn.',
        },
      ],
      teach: [
        'Spanning (V, volt) is de druk, stroom (A, ampère) is de doorstroming, en vermogen (W, watt) is hoe snel energie wordt gebruikt: vermogen = spanning × stroom. Een waterkoker van 2.000 W op 230 V trekt zo’n 8,7 A. Energie is vermogen × tijd, in kilowattuur: die waterkoker gebruikt in 3 minuten 2 kW × 0,05 uur = 0,1 kWh. Je betaalt voor kWh; het net wordt gebouwd voor kW.',
        'Het net werkt met wisselspanning (AC): de spanning gaat in Europa 50 keer per seconde heen en weer (50 Hz). Dat doen we omdat transformatoren wisselspanning makkelijk omhoog en omlaag kunnen zetten, en dat is de sleutel om vermogen met weinig verlies over grote afstanden te transporteren.',
        'Het grootste deel van het net is driefasig: drie draden met elk wisselspanning, een derde periode ten opzichte van elkaar verschoven, plus een nul. In een Nederlands huis is de spanning tussen een fase en de nul 230 V; tussen twee fasen 400 V. Drie fasen leveren een gelijkmatig vermogen en gebruiken het koper efficiënt. Daarom gebruiken zware verbruikers zoals warmtepompen en laadpalen vaak alle drie.',
        'Een gangbare huisaansluiting in Nederland is 3 × 25 A: drie fasen van elk 25 A, maximaal zo’n 3 × 230 × 25 ≈ 17 kVA (kVA, kilovoltampère, is de eenheid voor wat een kabel of zekering moet dragen; voor een woning ligt het dicht bij kW). Oudere woningen hebben soms 1 × 35 A. Dat maximum is wat de hoofdzekering toelaat, niet wat het huis normaal gebruikt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een gezin in Den Bosch verbruikt 2.700 kWh per jaar: gemiddeld 2.700 / 8.760 ≈ 0,31 kW. Maar om 18:00 uur staan de oven (3 kW), de waterkoker (2 kW) en de vaatwasser die opwarmt (2 kW) tegelijk aan: 7 kW. Komt er een elektrische auto bij die laadt op 11 kW, dan trekt het huis 18 kW: meer dan de 17 kVA die de aansluiting van 3 × 25 A toelaat, en de hoofdzekering kan eruit vliegen. Het jaarverbruik is bescheiden; de piek is wat de kabels en zekeringen moeten dragen.',
      },
      said: 'Wat engineers zeggen: “Kijk niet naar de kWh, kijk naar de piek. Het jaartotaal interesseert de kabel niks.”',
      recall: [
        {
          q: 'Een warmtepomp trekt 3 kW en draait op een koude dag 8 uur. Hoeveel energie gebruikt hij, in kWh?',
          number: 24,
          tolerance: 0.5,
          unit: 'kWh',
          why: 'Energie = vermogen × tijd = 3 kW × 8 uur = 24 kWh.',
        },
        {
          q: 'Een huis heeft een aansluiting van 3 × 25 A op 230 V per fase. Wat is de maximale capaciteit, in kVA?',
          number: 17.3,
          tolerance: 0.5,
          unit: 'kVA',
          why: '3 × 230 V × 25 A = 17.250 VA ≈ 17,3 kVA.',
        },
        {
          q: 'Wat is de spanning tussen twee fasen in een Nederlands huis?',
          options: ['230 V', '110 V', '50 V', '400 V'],
          answer: '400 V',
          why: 'Fase-nul is 230 V; fase-fase is zo’n 400 V.',
        },
        {
          q: 'Waarom werkt het net met wisselspanning?',
          options: ['Transformatoren kunnen wisselspanning makkelijk omzetten, dus vermogen gaat met weinig verlies over het net', 'Wisselspanning is veiliger om aan te raken', 'Wisselspanning kun je opslaan in batterijen', 'Apparaten werken alleen op wisselspanning'],
          answer: 'Transformatoren kunnen wisselspanning makkelijk omzetten, dus vermogen gaat met weinig verlies over het net',
          why: 'Spanning omzetten met transformatoren is de basis van de hele netstructuur.',
        },
      ],
      situation: {
        scene: 'Je zit bij een kick-off bij een regionale netbeheerder. Een planner zegt: “Deze wijk verbruikt maar 3 GWh per jaar, er is dus ruimte zat.” Een netontwerper fronst.',
        ask: 'Wat vraag je om de zorg van de netontwerper te begrijpen?',
        model: 'Zit de grens in de energie over het jaar, of in de piek op bepaalde momenten? Als kabels en transformatoren op kW gedimensioneerd zijn, zegt 3 GWh weinig: het gaat om de hoogste belasting, bijvoorbeeld op een koude winteravond. Hebben we piekmetingen voor deze wijk?',
        rubric: [
          'Maakt onderscheid tussen energie (kWh) en vermogen (kW)',
          'Vraagt naar het piekmoment in plaats van het jaartotaal',
          'Vraagt om piekmetingen',
        ],
      },
      sayIt: 'Leg een vriend in 60 seconden het verschil uit tussen kW en kWh, en waarom het net om kW draait.',
      terms: [
        { term: 'kW', def: 'Vermogen: hoe snel energie op één moment wordt gebruikt of geleverd.' },
        { term: 'kWh', def: 'Energie: vermogen × tijd; waar je voor betaalt.' },
        { term: 'Driefasig', def: 'Drie wisselspanningsdraden die in de tijd verschoven zijn, plus nul; 230 V fase-nul, 400 V fase-fase.' },
      ],
    },
    {
      id: 'eng.gridbasics.levels',
      title: 'Spanningsniveaus en wie wat beheert',
      pre: [
        {
          q: 'Wie beheert het 150 kV-net in Nederland?',
          options: ['Enexis, Liander en Stedin', 'De energieleveranciers', 'TenneT', 'De gemeenten'],
          answer: 'TenneT',
          why: 'TenneT beheert alle netten van 110 kV en hoger; de regionale netbeheerders de lagere spanningen.',
        },
      ],
      teach: [
        'Waarom hoogspanning: vermogen = spanning × stroom, en de verliezen in een kabel groeien met het kwadraat van de stroom. Maak de spanning 10 keer zo hoog en de stroom voor hetzelfde vermogen wordt 10 keer zo klein, dus de verliezen 100 keer zo klein. Daarom gaat vermogen over grote afstanden op heel hoge spanning en wordt het pas dicht bij de gebruiker omlaag gezet.',
        'De Nederlandse niveaus: extra hoogspanning (EHS) van 380 en 220 kV en hoogspanning (HS) van 150 en 110 kV, allemaal beheerd door TenneT, de landelijke netbeheerder. Daaronder nemen de regionale netbeheerders het over. In sommige regio’s zit er nog een tussenspanning van zo’n 50 of 25 kV tussen.',
        'Middenspanning (MS) is meestal 10 tot 20 kV. Die loopt van de onderstations door steden en dorpen naar de netstations, en rechtstreeks naar grote klanten zoals fabrieken. Laagspanning (LS) is 400/230 V: de kabels in je straat en de aansluiting van je huis.',
        'De regionale netbeheerders zijn Enexis, Liander en Stedin, plus een paar kleinere zoals Westland Infra, Coteq en Rendo. Elk heeft een monopolie in zijn eigen gebied. Enexis zit in grote delen van het noorden, oosten en zuiden. Zij bezitten en beheren het MS- en LS-net waar bijna elke woning en elk bedrijf op aangesloten is.',
      ],
      example: {
        kind: 'worked',
        text: 'Een windpark levert 100 MW aan het net. Op 10 kV zou dat een stroom vragen van ruwweg 100.000.000 / (1,73 × 10.000) ≈ 5.800 A, veel te veel voor een normale kabel. Op 150 kV is het zo’n 385 A: 15 keer minder stroom, en zo’n 225 keer minder verlies in dezelfde kabel. Daarom sluit het windpark aan op een 150 kV-station van TenneT, terwijl een losse windturbine of een klein zonnepark op het MS-net van de regionale netbeheerder komt.',
      },
      said: 'Wat engineers zeggen: “Dat is de kant van TenneT in het station. Wij beginnen bij de 10 kV-rail.”',
      recall: [
        {
          q: 'Een netbeheerder zet een MS-net om van 10 kV naar 20 kV en transporteert hetzelfde vermogen. Met welke factor veranderen de kabelverliezen? Geef de breuk als decimaal getal.',
          number: 0.25,
          tolerance: 0.02,
          unit: '',
          why: 'Dubbele spanning halveert de stroom; verliezen schalen met het kwadraat van de stroom: 0,5² = 0,25.',
        },
        {
          q: 'Welke spanning is typisch voor het MS-net?',
          options: ['10 tot 20 kV', '380 kV', '230 V', '150 kV'],
          answer: '10 tot 20 kV',
          why: 'Middenspanning is in Nederland meestal 10 tot 20 kV.',
        },
        {
          q: 'Welke van deze is een regionale netbeheerder?',
          options: ['TenneT', 'Vattenfall', 'ACM', 'Enexis'],
          answer: 'Enexis',
          why: 'Enexis, Liander en Stedin zijn de grote regionale netbeheerders; Vattenfall is een leverancier, de ACM de toezichthouder.',
        },
        {
          q: 'Waarom wordt stroom op heel hoge spanning getransporteerd?',
          options: ['Dat is veiliger', 'Minder stroom betekent veel minder verlies', 'Kabels zijn goedkoper bij hoge spanning', 'Huishoudens hebben hoge spanning nodig'],
          answer: 'Minder stroom betekent veel minder verlies',
          why: 'Verliezen schalen met het kwadraat van de stroom; hogere spanning betekent minder stroom voor hetzelfde vermogen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een regionale netbeheerder in een overleg over een nieuw bedrijventerrein. Iemand zegt: “We hebben gewoon een dikkere kabel vanaf het TenneT-station nodig.” Een collega begint over de 150/20 kV-transformator.',
        ask: 'Wat vraag je om er grip op te krijgen?',
        model: 'Welk deel is van ons en welk deel van TenneT: is er in het station ruimte aan de 20 kV-kant, of is de 150/20 kV-transformator zelf de grens? Als die transformator vol zit, helpt een dikkere kabel vanaf het station niks en moet TenneT erbij. Wie praat er hierover met TenneT?',
        rubric: [
          'Maakt onderscheid tussen de hoogspanningskant van TenneT en de regionale MS-kant',
          'Vraagt waar de echte grens zit: kabel of transformator',
          'Vraagt wie de afstemming met TenneT doet',
        ],
      },
      sayIt: 'Leg een nieuwe collega in 60 seconden de Nederlandse spanningsniveaus uit en wie welk niveau beheert.',
      terms: [
        { term: 'TenneT', def: 'De landelijke netbeheerder; beheert 110 kV en hoger.' },
        { term: 'MS (middenspanning)', def: 'Meestal 10 tot 20 kV, beheerd door de regionale netbeheerders.' },
        { term: 'LS (laagspanning)', def: '400/230 V: straatkabels en huisaansluitingen.' },
        { term: 'Regionale netbeheerder', def: 'Beheerder van het regionale MS- en LS-net, zoals Enexis.' },
      ],
    },
    {
      id: 'eng.gridbasics.path',
      title: 'Van onderstation tot stopcontact',
      pre: [
        {
          q: 'Een MS-ring verbindt zo’n 15 netstations in een lus. Hoe wordt die meestal bedreven?',
          options: ['Open op één punt, zodat elke helft van één kant gevoed wordt', 'Gesloten, van twee kanten tegelijk gevoed', 'Elk netstation met een eigen kabel', 'Alleen tijdens de piekuren'],
          answer: 'Open op één punt, zodat elke helft van één kant gevoed wordt',
          why: 'Een ring wordt als lus gebouwd maar open bedreven, zodat je na een storing het openpunt kunt sluiten om weer te voeden.',
        },
      ],
      teach: [
        'De stroom komt van TenneT binnen in een onderstation, waar grote transformatoren de spanning van 150 of 110 kV omlaag zetten naar 10 of 20 kV. Vanaf daar vertrekken MS-kabels alle kanten op. In het onderstation komen het landelijke en het regionale net samen, en daar ligt vaak de capaciteit voor een hele stad of regio vast.',
        'MS-kabels liggen in ringen: ze vertrekken uit het onderstation, gaan langs een reeks netstations en komen terug. De ring wordt op één punt open bedreven, het normaal openpunt. Valt een kabelstuk uit, dan schakelen de bedrijfsvoerders dat stuk vrij en sluiten ze het openpunt, zodat de meeste klanten weer stroom hebben terwijl de kabel gerepareerd wordt.',
        'Het netstation, ook wel wijktrafo of trafohuisje, is het kleine gebouwtje of de kast in je straat. Daarin: een MS-installatie (de schakelaars) voor de ring, een transformator van 10 kV naar 400 V van meestal 250 tot 630 kVA, en een LS-rek met zekeringen voor elke uitgaande straatkabel. In gebouwen en bij grote klanten staat de MS-apparatuur vaak in een MS-ruimte.',
        'Vanaf het netstation lopen LS-kabels door de straten, elk voor tientallen woningen. Naar elk huis loopt een aansluitkabel die eindigt bij de hoofdzekering en de meter in de meterkast. Tot en met de meter is dat van de netbeheerder; daarna van de eigenaar.',
      ],
      example: {
        kind: 'worked',
        text: 'Een huis in Tilburg: TenneT levert 150 kV aan het onderstation, waar twee 150/10 kV-transformatoren een 10 kV-rail voeden. Een 10 kV-kabel vertrekt in een ring langs 12 netstations. Netstation 7 heeft een transformator van 400 kVA en zes LS-kabels; één daarvan loopt door de straat en voedt 35 woningen. De aansluitkabel van het huis eindigt bij een hoofdzekering van 3 × 25 A. Valt de ringkabel tussen netstation 6 en 7 uit, dan openen de bedrijfsvoerders de schakelaars aan beide kanten en sluiten ze het normaal openpunt: netstation 7 krijgt weer stroom van de andere kant.',
      },
      said: 'Wat engineers zeggen: “We hebben station 7 teruggevoed vanuit de andere helft van de ring. Het defecte stuk is vrijgeschakeld.”',
      recall: [
        {
          q: 'Een netstation heeft een transformator van 400 kVA. De planners rekenen met 2 kVA piek per woning. Hoeveel woningen kan hij maximaal voeden?',
          number: 200,
          tolerance: 5,
          unit: 'woningen',
          why: '400 / 2 = 200 woningen, nog zonder marge voor groei.',
        },
        {
          q: 'Wat zit er in een typisch netstation?',
          options: ['Een 150/10 kV-transformator', 'Een centrale', 'Een MS-installatie, een 10 kV/400 V-transformator en LS-zekeringen', 'Alleen meters'],
          answer: 'Een MS-installatie, een 10 kV/400 V-transformator en LS-zekeringen',
          why: 'Het netstation zet MS om naar LS en verdeelt dat over de straatkabels.',
        },
        {
          q: 'Waar draagt het landelijke net over aan het regionale net?',
          options: ['Bij de meter in huis', 'In het onderstation', 'In het netstation', 'Bij de centrale'],
          answer: 'In het onderstation',
          why: 'Het onderstation zet 150 of 110 kV om naar MS, waar de regionale netbeheerder het overneemt.',
        },
        {
          q: 'Tot welk punt is een huisaansluiting van de netbeheerder?',
          options: ['De straatkabel', 'Het netstation', 'Het eerste stopcontact in huis', 'Tot en met de meter'],
          answer: 'Tot en met de meter',
          why: 'De aansluiting en de meter zijn van de netbeheerder; de installatie daarachter van de eigenaar.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder. Een team wil sneller de stroom terug hebben bij klanten na een MS-storing. Ze laten hersteltijden zien van 2 à 3 uur in sommige gebieden en 30 minuten in andere.',
        ask: 'Wat vraag je over de netstructuur?',
        model: 'Is het MS-net in de trage gebieden opgebouwd als ringen met een openpunt dat je kunt omschakelen, of liggen er radiale kabels zonder tweede voeding? En waar kan op afstand geschakeld worden, en waar moet een monteur eerst naar het netstation rijden? Het verschil zit misschien in de netstructuur en de reistijd, niet in de mensen.',
        rubric: [
          'Vraagt of er een ring is met een schakelbaar openpunt',
          'Vraagt naar schakelen op afstand versus ter plaatse',
          'Kijkt naar structuur en reistijd voordat de teams de schuld krijgen',
        ],
      },
      sayIt: 'Leg een familielid in 60 seconden uit hoe stroom van een onderstation in zijn stopcontact komt.',
      terms: [
        { term: 'Onderstation', def: 'Station waar HS wordt omgezet naar MS.' },
        { term: 'Netstation (wijktrafo)', def: 'Station in de straat dat MS omzet naar 400/230 V.' },
        { term: 'Normaal openpunt', def: 'Het punt waar een MS-ring open staat; wordt gesloten om na een storing weer te voeden.' },
        { term: 'MS-ruimte', def: 'Een ruimte met MS-apparatuur, vaak in een gebouw of bij een grote klant.' },
      ],
    },
    {
      id: 'eng.gridbasics.load',
      title: 'Capaciteit, piekbelasting en gelijktijdigheid',
      pre: [
        {
          q: 'Een straat heeft 100 woningen, elk met een aansluiting van 17 kVA. Welke piek verwachtten netplanners traditioneel ongeveer voor de hele straat?',
          options: ['1.700 kVA', 'Zo’n 850 kVA', 'Nul', 'Zo’n 150 kVA'],
          answer: 'Zo’n 150 kVA',
          why: 'Woningen pieken niet tegelijk; traditioneel rekende men met zo’n 1,5 kVA per woning in de avondpiek.',
        },
      ],
      teach: [
        'Netcomponenten hebben een rating in kVA, schijnbaar vermogen: wat de kabel of transformator echt moet dragen, inclusief het deel dat geen nuttig werk doet. kW is het nuttige deel. De verhouding heet de arbeidsfactor (cos φ), voor woningen meestal 0,9 tot 1. Een transformator van 400 kVA kan zo’n 360 tot 400 kW leveren.',
        'Gelijktijdigheid is het kernbegrip in de netplanning. Niet elke woning gebruikt op hetzelfde moment zijn maximum. Traditioneel werd een straat gepland op zo’n 1 tot 1,5 kVA per woning in de avondpiek, ver onder de 17 kVA van elke aansluiting. Door die aanname zijn veel oude LS-netten relatief licht uitgevoerd.',
        'Warmtepompen en elektrische auto’s veranderen dat. Op een koude avond draaien alle warmtepompen tegelijk: een gelijktijdigheid van bijna 1. Auto’s laden na het werk op 11 kW per stuk. Zonnepanelen geven ’s middags een nieuwe piek de andere kant op: op een zonnige dag levert elk dak tegelijk terug. Het net moet nu ruimte hebben voor pieken waar het nooit voor ontworpen is.',
        'Te veel teruglevering laat de spanning aan het eind van een lange LS-kabel stijgen. Boven zo’n 253 V (230 V plus 10%) schakelen omvormers (de kastjes die zonnestroom omzetten naar netspanning) af om het net te beschermen. “Mijn panelen vallen steeds uit” is dus vaak een spanningsprobleem, geen kapotte omvormer.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netstation van 400 kVA voedt 150 woningen. Oude piek: 1,5 kVA × 150 = 225 kVA, 56% belast. Nu krijgen 50 woningen een warmtepomp van 3 kW, die op een koude avond allemaal op zo’n 80% van hun vermogen draaien: + 50 × 3 × 0,8 = 120 kVA. En 40 woningen laden een auto op 11 kW, waarvan zo’n 30% tegelijk: + 40 × 11 × 0,3 = 132 kVA. Nieuwe piek: 225 + 120 + 132 = 477 kVA, 119% van de transformator. Het jaarverbruik steeg met ongeveer de helft; de piek werd meer dan twee keer zo hoog.',
      },
      said: 'Wat engineers zeggen: “De gelijktijdigheid van die warmtepompen is bijna één. Als het vriest, draaien ze allemaal.”',
      recall: [
        {
          q: '100 woningen hebben elk 5 kW aan zonnepanelen. Op een zonnige middag produceren ze 70% daarvan en gebruiken ze elk 0,5 kW. Hoeveel wordt er teruggeleverd aan het net, in kW?',
          number: 300,
          tolerance: 5,
          unit: 'kW',
          why: 'Per woning 5 × 0,7 − 0,5 = 3 kW; 100 × 3 = 300 kW.',
        },
        {
          q: 'Wat beschrijft gelijktijdigheid?',
          options: ['Hoeveel woningen zonnepanelen hebben', 'Welk deel van de maximale belasting op hetzelfde moment optreedt', 'De spanning aan het eind van een kabel', 'De leeftijd van het net'],
          answer: 'Welk deel van de maximale belasting op hetzelfde moment optreedt',
          why: 'Planners gebruiken het om kabels en transformatoren kleiner te dimensioneren dan de som van alle aansluitingen.',
        },
        {
          q: 'Waarom belasten warmtepompen het net harder dan je op basis van hun kWh zou verwachten?',
          options: ['Ze gebruiken meer kWh dan elk ander apparaat', 'Ze draaien alleen in de zomer', 'Op koude avonden draaien ze bijna allemaal tegelijk', 'Ze leveren terug aan het net'],
          answer: 'Op koude avonden draaien ze bijna allemaal tegelijk',
          why: 'Door de hoge gelijktijdigheid is de piek groot, ook al is het jaarverbruik gematigd.',
        },
        {
          q: 'Een bewoner klaagt dat zijn omvormer op zonnige dagen steeds afschakelt. Wat is een waarschijnlijke oorzaak?',
          options: ['De spanning aan het eind van de LS-kabel komt boven de grens', 'De meter is kapot', 'De panelen zijn vies', 'De warmtepomp is te groot'],
          answer: 'De spanning aan het eind van de LS-kabel komt boven de grens',
          why: 'Omvormers schakelen af als de spanning boven zo’n 253 V komt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een regionale netbeheerder in een planningssessie. Een gemeente wil binnen drie jaar een hele wijk van het gas halen met warmtepompen. De planner zegt dat de netstations maar voor 50% belast zijn.',
        ask: 'Wat vraag je?',
        model: 'Vijftig procent bij welke piek, en met welke aannames? De piek van nu is met gasverwarming; met warmtepompen gaat de gelijktijdigheid op een koude avond naar 1, en komen er auto’s bij, dan kan de piek verdubbelen. Kunnen we per netstation de piek doorrekenen met de geplande warmtepompen en de verwachte auto’s, en kijken welke boven de 100% komen?',
        rubric: [
          'Zet vraagtekens bij de huidige belasting als basis voor de toekomst',
          'Noemt de hoge gelijktijdigheid van warmtepompen op koude dagen',
          'Vraagt om doorrekening per netstation met de nieuwe belasting',
        ],
      },
      sayIt: 'Leg een beleidsmedewerker van een gemeente in 60 seconden uit waarom van het gas af gaan de belasting van het stroomnet zo sterk verandert.',
      terms: [
        { term: 'kVA', def: 'Schijnbaar vermogen: wat kabels en transformatoren moeten dragen.' },
        { term: 'Gelijktijdigheid', def: 'Het deel van de maximale belastingen dat op hetzelfde moment optreedt.' },
        { term: 'Piekbelasting', def: 'De hoogste belasting in een periode; bepaalt hoe groot de componenten moeten zijn.' },
      ],
    },
    {
      id: 'eng.gridbasics.congestion',
      title: 'Netcongestie',
      pre: [
        {
          q: 'Een onderstation is “congestiegebied”. Hoeveel uur per jaar is het meestal echt overbelast?',
          options: ['Alle 8.760 uur', 'Vaak maar tientallen tot een paar honderd uur', 'Precies een half jaar', 'Nooit, het is een juridische status'],
          answer: 'Vaak maar tientallen tot een paar honderd uur',
          why: 'Congestie gaat over de piekuren; het grootste deel van het jaar is er nog ruimte.',
        },
      ],
      teach: [
        'Netcongestie betekent dat op piekmomenten de vraag naar transportcapaciteit groter is dan wat een deel van het net veilig kan dragen. Dat kan aan de afnamekant zijn, bijvoorbeeld een bedrijventerrein dat meer vermogen wil, of aan de invoedingskant, bijvoorbeeld zonneparken in een landelijk gebied. Grote delen van Nederland zitten inmiddels vol.',
        'In congestiegebieden komen nieuwe grootverbruikers (aansluitingen boven 3 × 80 A) en klanten die meer capaciteit willen op een wachtrij. Huishoudens en kleine bedrijven worden nog wel aangesloten. De landelijke capaciteitskaart laat zien waar nog ruimte is en waar niet.',
        'Het net verzwaren kost jaren: een nieuw onderstation duurt vaak 5 tot 10 jaar, met vergunningen, grond en ruimte voor kabels in de straat. MS-verzwaring gaat sneller, maar ook dat is maanden tot jaren. Mensen, materiaal en ruimte in de grond zijn allemaal schaars.',
        'In de tussentijd gebruiken netbeheerders het bestaande net slimmer. Congestiemanagement: klanten worden betaald of gecontracteerd om op piekmomenten minder af te nemen of minder in te voeden, vaak via GOPACS, het landelijke platform waar netbeheerders die flexibiliteit inkopen. Flexibele of tijdsgebonden contracten geven capaciteit behalve op de piekuren, zodat een klant nu kan aansluiten in ruil voor beperkingen. Omdat congestie meestal maar een paar honderd uur per jaar speelt, levert een beetje flexibiliteit veel ruimte op.',
      ],
      example: {
        kind: 'worked',
        text: 'Een bedrijventerrein hangt aan een onderstation van 30 MVA. De piekbelasting is 29 MVA, en drie bedrijven willen samen 6 MVA extra. Het antwoord: een wachtrij tot het nieuwe onderstation klaar is, over zo’n 7 jaar. De netbeheerder kijkt beter: de belasting zit maar 180 uur per jaar boven de 24 MVA, zo’n 2% van de tijd. Een koelhuis verschuift tegen een vergoeding 4 MVA koeling weg uit die uren, en één bedrijf accepteert een contract zonder capaciteit op de piekuren. Twee van de drie kunnen binnen een jaar aansluiten.',
      },
      said: 'Wat engineers zeggen: “Het station zit maar 200 uur per jaar vol. Vind flex voor die uren en we kunnen mensen erop laten.”',
      recall: [
        {
          q: 'Een onderstation is 150 uur per jaar overbelast. Welk percentage van het jaar is dat, afgerond op één decimaal?',
          number: 1.7,
          tolerance: 0.1,
          unit: '%',
          why: '150 / 8.760 = 0,017, zo’n 1,7%.',
        },
        {
          q: 'Wie komt er in een congestiegebied meestal op een wachtrij?',
          options: ['Elk huishouden', 'Niemand, de wet verbiedt wachtrijen', 'Alleen eigenaren van zonnepanelen', 'Nieuwe grootverbruikers en klanten die meer capaciteit willen'],
          answer: 'Nieuwe grootverbruikers en klanten die meer capaciteit willen',
          why: 'Kleine aansluitingen worden nog gemaakt; grote wachten op capaciteit.',
        },
        {
          q: 'Wat is congestiemanagement?',
          options: ['Klanten betalen of contracteren om afname of invoeding weg te schuiven van piekmomenten', 'Een nieuw onderstation bouwen', 'De stroomprijs verhogen', 'Huishoudens afsluiten'],
          answer: 'Klanten betalen of contracteren om afname of invoeding weg te schuiven van piekmomenten',
          why: 'Zo komt er capaciteit vrij op het bestaande net, precies op de momenten dat het vol zit.',
        },
        {
          q: 'Waarom levert een beetje flexibiliteit veel capaciteit op?',
          options: ['Flexibiliteit maakt kabels dikker', 'Klanten stoppen met stroom gebruiken', 'De overbelasting zit maar in een klein aantal uren', 'TenneT voegt capaciteit toe'],
          answer: 'De overbelasting zit maar in een klein aantal uren',
          why: 'Als je belasting uit die uren schuift, blijft het net binnen zijn grens.',
        },
      ],
      situation: {
        scene: 'Je zit bij een regionale netbeheerder in een project om de wachtrij voor zakelijke aansluitingen korter te maken. Een manager zegt: “Er kan niks tot het nieuwe onderstation er staat.”',
        ask: 'Wat vraag je?',
        model: 'Hoeveel uur per jaar zit het onderstation echt boven zijn grens, en hoeveel erboven? Als het om een paar honderd uur gaat: staan er klanten op de wachtrij die een tijdsgebonden of flexibel contract zouden accepteren, of zijn er bestaande klanten die tegen een vergoeding kunnen schuiven? Kunnen we het belastingprofiel en de wachtrij naast elkaar leggen?',
        rubric: [
          'Vraagt hoeveel uur en hoeveel het station overbelast is',
          'Stelt flexibele contracten of congestiemanagement voor',
          'Koppelt het belastingprofiel aan de wachtrij',
        ],
      },
      sayIt: 'Leg een ondernemer in 60 seconden uit waarom hij nu geen grotere aansluiting kan krijgen, en welke opties er wel zijn.',
      terms: [
        { term: 'Netcongestie', def: 'De piekvraag naar transport is groter dan het net veilig kan dragen.' },
        { term: 'Congestiemanagement', def: 'Klanten contracteren om afname of invoeding weg te schuiven van piekmomenten.' },
        { term: 'Grootverbruik', def: 'Grote aansluitingen, boven 3 × 80 A.' },
        { term: 'Capaciteitskaart', def: 'Openbare kaart die laat zien waar het net nog ruimte heeft voor afname en invoeding.' },
      ],
    },
    {
      id: 'eng.gridbasics.roles',
      title: 'Wat een netbeheerder doet',
      pre: [
        {
          q: 'Wie verkoopt je de stroom die je thuis gebruikt?',
          options: ['Je energieleverancier', 'De regionale netbeheerder', 'TenneT', 'De gemeente'],
          answer: 'Je energieleverancier',
          why: 'Leveranciers verkopen energie; de netbeheerder transporteert het en onderhoudt het net.',
        },
      ],
      teach: [
        'Een regionale netbeheerder heeft vijf kerntaken. Klanten aansluiten. Elektriciteit (en vaak gas) naar ze transporteren. Het net onderhouden zodat het veilig en betrouwbaar blijft. Storingen verhelpen, dag en nacht. En het net van de toekomst plannen en bouwen: elke twee jaar publiceert hij een investeringsplan. Hij verkoopt geen energie; dat doen leveranciers.',
        'De meeste storingen ontstaan in het MS- en LS-net: een graafmachine raakt een kabel, een oude mof begeeft het, een zekering slaat door. Het Nederlandse net is een van de betrouwbaarste van Europa: een gemiddelde klant zit zo’n 20 tot 30 minuten per jaar zonder stroom. Netbeheerders sturen hierop met de jaarlijkse uitvalduur per klant.',
        'Netbeheerders zijn gereguleerde monopolies. Elk heeft zijn eigen gebied; klanten kunnen niet kiezen. De ACM, de toezichthouder, bepaalt hoeveel inkomsten ze via de tarieven mogen halen, legt de technische en aansluitregels vast in de codes, en controleert de kwaliteit. Aandeelhouders zijn provincies en gemeenten, en volgens de wet mogen ze niet aan private partijen verkocht worden.',
        'Het werk verandert snel. Door de energietransitie bouwen en aansluiten netbeheerders meer dan ooit, terwijl mensen en materiaal schaars zijn. Daarom zijn ze zo bezig met standaardiseren, werk in grotere pakketten plannen en elk uur efficiëntie in het veld.',
      ],
      example: {
        kind: 'worked',
        text: 'Een regionale netbeheerder heeft 2,8 miljoen klanten. In een jaar tellen de storingen op tot 70 miljoen klantminuten, vooral door storingen in MS-kabels. Gemiddeld per klant: 70.000.000 / 2.800.000 = 25 minuten. Eén grote MS-storing waarbij 3.000 klanten 90 minuten zonder stroom zitten, is al 270.000 klantminuten. Daarom telt het zo om de meeste klanten snel weer terug te schakelen, nog voordat de kabel gerepareerd is.',
      },
      said: 'Wat engineers zeggen: “We verkopen geen enkele kWh. We transporteren het, we sluiten aan, en we repareren het als het stukgaat.”',
      recall: [
        {
          q: 'Een netbeheerder heeft 2 miljoen klanten en 50 miljoen klantminuten storing in een jaar. Wat is de gemiddelde uitvalduur per klant, in minuten?',
          number: 25,
          tolerance: 0.5,
          unit: 'min',
          why: '50.000.000 / 2.000.000 = 25 minuten.',
        },
        {
          q: 'Wat doet de ACM voor netbeheerders?',
          options: ['Ze bouwt onderstations', 'Ze verkoopt stroom', 'Ze bepaalt de toegestane inkomsten en de regels, en controleert de kwaliteit', 'Ze beheert het 380 kV-net'],
          answer: 'Ze bepaalt de toegestane inkomsten en de regels, en controleert de kwaliteit',
          why: 'De ACM houdt toezicht op de netbeheerders, die een monopolie hebben.',
        },
        {
          q: 'Waar ontstaan de meeste storingen voor klanten?',
          options: ['Bij centrales', 'In het 380 kV-net', 'In huishoudelijke apparaten', 'In het MS- en LS-net'],
          answer: 'In het MS- en LS-net',
          why: 'Kabelschade, kapotte moffen en doorgeslagen zekeringen in het regionale net veroorzaken de meeste storingen.',
        },
        {
          q: 'Wie zijn de eigenaren van de Nederlandse regionale netbeheerders?',
          options: ['Energieleveranciers', 'Provincies en gemeenten', 'Buitenlandse investeerders', 'TenneT'],
          answer: 'Provincies en gemeenten',
          why: 'Ze zijn publiek eigendom en mogen volgens de wet niet geprivatiseerd worden.',
        },
      ],
      situation: {
        scene: 'Je start een project bij een regionale netbeheerder. Je contactpersoon zegt: “We moeten volgend jaar 30% meer klanten aansluiten met hetzelfde aantal monteurs.”',
        ask: 'Wat vraag je om het werk te begrijpen?',
        model: 'Waar gaat de dag van een monteur nu naartoe: reizen, wachten op materiaal, vergunningen, herstelwerk, echt werk aan de kabel? En hoeveel van het werk zijn standaardaansluitingen en hoeveel maatwerk? Als we weten waar de uren weglekken, kunnen we zien of standaardiseren of betere werkvoorbereiding die 30% oplevert.',
        rubric: [
          'Vraagt hoe de tijd van een monteur echt besteed wordt',
          'Maakt onderscheid tussen standaardwerk en maatwerk',
          'Koppelt het antwoord aan standaardisatie en werkvoorbereiding',
        ],
      },
      sayIt: 'Leg een vriend in 60 seconden uit wat een regionale netbeheerder wel en niet doet.',
      terms: [
        { term: 'ACM', def: 'De Nederlandse toezichthouder die inkomsten en regels van netbeheerders vastlegt.' },
        { term: 'Jaarlijkse uitvalduur', def: 'Gemiddeld aantal minuten zonder stroom per klant per jaar.' },
        { term: 'Investeringsplan', def: 'Plan voor netuitbreiding dat een netbeheerder elke twee jaar publiceert.' },
      ],
    },
  ],
};

// eng.fluids (NL): Pompen, stroming en warmte: drukval, pompkarakteristiek, cavitatie, toerenregeling, warmtewisselaars, stoom.
export default {
  lessons: [
    {
      id: 'eng.fluids.flow',
      title: 'Druk, debiet en drukval',
      pre: [
        {
          q: 'Het debiet door een bestaande leiding verdubbelt. De stroming is turbulent, zoals in de meeste procesleidingen. Wat gebeurt er ongeveer met de drukval door wrijving?',
          options: ['Die verdubbelt', 'Die wordt ongeveer vier keer zo groot', 'Die blijft gelijk', 'Die halveert'],
          answer: 'Die wordt ongeveer vier keer zo groot',
          why: 'Bij turbulente stroming groeit de wrijvingsdrukval ongeveer met de snelheid in het kwadraat: 2 × 2 = 4.',
        },
      ],
      teach: [
        'Vloeistof stroomt van hoge naar lage druk. Pompen maken de druk; leidingen, bochten, kranen, filters en warmtewisselaars verbruiken die door wrijving. Pompmensen praten in opvoerhoogte: de hoogte in meters vloeistof die de pomp kan opstuwen. 10 m water is ongeveer 1 bar. Een centrifugaalpomp geeft met elke dunne vloeistof dezelfde opvoerhoogte; de druk die dat oplevert schaalt met de dichtheid.',
        'De wrijvingsdrukval groeit met de snelheid in het kwadraat bij de turbulente stroming in de meeste procesleidingen. Verdubbel het debiet in dezelfde leiding en de drukval wordt ongeveer vier keer zo groot. Daarom lukt meer door een bestaande leiding duwen vaak niet: de pomp kan die extra druk niet leveren. Eén maat grotere leiding verlaagt de snelheid, en de drukval zakt flink.',
        'Snelheid = debiet / doorsnede van de leiding. Gangbare ontwerpsnelheden voor waterachtige vloeistoffen zijn 1 tot 3 m/s. Daarboven nemen slijtage, geluid en drukval toe; daaronder kunnen vaste deeltjes bezinken. Leidingmaat wordt gegeven als DN, de nominale diameter in mm: DN50 is ongeveer 50 mm inwendig.',
        'Langzame, dikke stroming is laminair: lagen schuiven netjes langs elkaar. De meeste stroming van dunne vloeistoffen is turbulent: wervelend. Het getal van Reynolds zegt welke: onder ongeveer 2.300 laminair, boven ongeveer 4.000 turbulent. Turbulentie mengt en draagt warmte goed over; dikke producten zoals siropen, crèmes en pasta’s stromen vaak laminair en warmen in een buis traag op.',
      ],
      example: {
        kind: 'worked',
        text: 'Een koelcircuit pompt 10 m³ per uur door een DN50-leiding. Doorsnede: 3,14 / 4 × 0,05² = 0,00196 m²; debiet 10 / 3.600 = 0,00278 m³/s; snelheid 1,4 m/s. De wrijvingsdrukval is 0,8 bar. Een nieuwe machine vraagt het dubbele debiet, 20 m³ per uur: snelheid 2,8 m/s en een drukval van ongeveer 4 × 0,8 = 3,2 bar. De pomp kan bij dat debiet maar 2 bar leveren, dus dat gaat niet. Met een DN80-leiding zakt de snelheid naar 1,1 m/s en de drukval naar zo’n 0,3 bar: de leiding was het probleem, niet de pomp.',
      },
      said: 'Wat engineers zeggen: “Verdubbel het debiet in die leiding en je hebt vier keer de druk nodig. Dat trekt de pomp niet, dus we gaan een maat groter.”',
      recall: [
        {
          q: 'Een leiding heeft een wrijvingsdrukval van 0,5 bar bij 12 m³ per uur, turbulente stroming. Het debiet gaat naar 18 m³ per uur in dezelfde leiding. Neem aan dat de drukval met het debiet in het kwadraat groeit. Wat is de nieuwe drukval, in bar?',
          number: 1.125,
          tolerance: 0.05,
          unit: 'bar',
          why: '18 / 12 = 1,5; 1,5² = 2,25; 0,5 × 2,25 = 1,125 bar.',
        },
        {
          q: 'Een pomp levert 30 m opvoerhoogte met water. Reken met 10 m water ≈ 1 bar. Hoeveel druk voegt hij toe, in bar?',
          number: 3,
          tolerance: 0.1,
          unit: 'bar',
          why: '30 m / 10 m per bar = 3 bar.',
        },
        {
          q: 'Dezelfde pomp, bij hetzelfde debiet en toerental, pompt nu een vloeistof met een dichtheid van 1.200 kg/m³ in plaats van water. Wat verandert er?',
          options: ['De opvoerhoogte in meters zakt 20%', 'Zelfde opvoerhoogte in meters, ongeveer 20% meer druk in bar', 'Opvoerhoogte en druk blijven allebei gelijk', 'Het debiet verdubbelt'],
          answer: 'Zelfde opvoerhoogte in meters, ongeveer 20% meer druk in bar',
          why: 'Een centrifugaalpomp geeft voor elke dunne vloeistof dezelfde opvoerhoogte; druk = dichtheid × g × opvoerhoogte, dus die schaalt met de dichtheid.',
        },
        {
          q: 'Waarom warmt een dikke saus traag op in een buizenwarmtewisselaar?',
          options: ['Hij stroomt laminair, met weinig menging bij de wand', 'Dikke vloeistoffen hebben geen soortelijke warmte', 'De buis is per definitie te kort', 'Dikke vloeistoffen zijn altijd koud'],
          answer: 'Hij stroomt laminair, met weinig menging bij de wand',
          why: 'Laminaire stroming heeft een trage laag langs de wand en weinig menging, dus de warmte komt er langzaam in.',
        },
      ],
      situation: {
        scene: 'Je zit bij een kunststofklant. Ze willen het debiet in een koelwatercircuit met 40% verhogen om een nieuwe machine te koelen, met de bestaande leidingen en pomp.',
        ask: 'Wat vraag je?',
        model: 'Wat is de drukval in het circuit nu, en wat doet 40% meer debiet daarmee: ongeveer 1,4² = 2 keer de wrijvingsdrukval? Waar op zijn karakteristiek draait de pomp, en haalt hij die opvoerhoogte bij het hogere debiet? Welk leidingdeel heeft de hoogste snelheid? Misschien is één te krap stuk of een verstopt filter de echte beperking.',
        rubric: [
          'Verwacht dat de wrijvingsdrukval met het debiet in het kwadraat stijgt',
          'Checkt de pompkarakteristiek bij het nieuwe debiet',
          'Zoekt het nauwste stuk of een vernauwing zoals een filter',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit waarom je niet zomaar twee keer zoveel door dezelfde leiding kunt duwen.',
      terms: [
        { term: 'Opvoerhoogte', def: 'Pompdruk uitgedrukt in meters vloeistofkolom; 10 m water is ongeveer 1 bar.' },
        { term: 'Drukval', def: 'Druk die verloren gaat aan wrijving in leidingen, kranen en apparatuur; groeit bij turbulente stroming met de snelheid in het kwadraat.' },
        { term: 'DN', def: 'Nominale leidingdiameter in mm.' },
        { term: 'Getal van Reynolds', def: 'Getal dat laminair (onder ongeveer 2.300) van turbulent (boven ongeveer 4.000) onderscheidt.' },
      ],
    },
    {
      id: 'eng.fluids.pumps',
      title: 'Pompkarakteristiek, leidingkarakteristiek en werkpunt',
      pre: [
        {
          q: 'Een centrifugaalpomp draait met de persafsluiter helemaal dicht. Wat gebeurt er?',
          options: ['De druk loopt op tot de leiding knapt', 'De druk stijgt een beetje, het debiet is nul en de vloeistof in de pomp warmt op', 'De pomp slaat vanzelf af', 'Niks, dat is een normaal werkpunt'],
          answer: 'De druk stijgt een beetje, het debiet is nul en de vloeistof in de pomp warmt op',
          why: 'Een centrifugaalpomp heeft zijn hoogste opvoerhoogte bij nul debiet; al zijn vermogen wordt dan warmte in de ingesloten vloeistof.',
        },
      ],
      teach: [
        'Twee pompfamilies. Een centrifugaalpomp draait een waaier rond en slingert de vloeistof naar buiten: eenvoudig, goedkoop, ideaal voor dunne vloeistoffen en grote debieten. Zijn debiet zakt als de tegendruk stijgt. Een verdringerpomp (tandwiel, lob, schroef, zuiger, membraan) duwt per omwenteling een vast volume, dus zijn debiet verandert nauwelijks met de druk. Geschikt voor dikke vloeistoffen, doseren en hoge druk, maar tegen een dichte afsluiter loopt de druk op tot er iets breekt: hij heeft een overdrukventiel nodig.',
        'Een centrifugaalpomp heeft een pompkarakteristiek: opvoerhoogte tegen debiet, hoog bij weinig debiet en dalend naarmate het debiet stijgt. Het leidingwerk heeft een leidingkarakteristiek: statische opvoerhoogte (hoogteverschil en vatdruk die overwonnen moeten worden) plus wrijving, die met het debiet in het kwadraat groeit. Waar de twee lijnen elkaar snijden ligt het werkpunt: het debiet en de opvoerhoogte die je echt krijgt.',
        'Elke pomp heeft een best efficiency point (BEP), het debiet waarbij hij het zuinigst draait. Ver ervan af, grofweg onder 70% of boven 120% van het BEP-debiet, krijg je trillingen, opwarming en slijtage van afdichtingen en lagers. Veel “slechte pompen” zijn goede pompen op de verkeerde plek op hun karakteristiek.',
        'Een afsluiter dichtknijpen om het debiet te verlagen verschuift het werkpunt door extra wrijving: het werkt, maar je verstookt energie over de afsluiter. Hydraulisch vermogen = dichtheid × g × debiet × opvoerhoogte; de motor moet dat leveren gedeeld door het pomprendement. Overgedimensioneerde, dichtgeknepen pompen zie je veel in oudere fabrieken: een snelle winst in energie en betrouwbaarheid.',
      ],
      example: {
        kind: 'worked',
        text: 'Een koelwaterpomp is gekozen met zijn best efficiency point (BEP) bij 100 m³ per uur, maar de fabriek heeft er maar 60 nodig, dus een afsluiter staat half dicht. Bij 60 m³ per uur maakt de pomp 45 m opvoerhoogte, terwijl het leidingwerk maar 25 m nodig heeft: de andere 20 m gaan op in de afsluiter. Hydraulisch vermogen van de pomp: 1.000 × 9,81 × (60 / 3.600) × 45 = 7,4 kW. Nodig: 1.000 × 9,81 × (60 / 3.600) × 25 = 4,1 kW. Er gaat dus zo’n 3,3 kW verloren in de afsluiter, 26.000 kWh per jaar bij 8.000 uur, nog vóór motor- en pompverliezen. En op 60% van het BEP-debiet trilt de pomp: afdichtingen houden vier maanden. Een afgedraaide waaier of een toerenregeling lost allebei op.',
      },
      said: 'Wat engineers zeggen: “Die pomp is niet slecht, hij is dichtgeknepen tot 60% van zijn BEP. Draai de waaier af en ik durf te wedden dat het afdichtingsprobleem weg is.”',
      recall: [
        {
          q: 'Een tandwielpomp draait en iemand draait de persafsluiter dicht. Wat beschermt pomp en leiding?',
          options: ['De pompkarakteristiek', 'Een overdrukventiel', 'Een terugslagklep', 'Niks, dat is niet nodig'],
          answer: 'Een overdrukventiel',
          why: 'Een verdringerpomp blijft volume duwen, dus de druk loopt op tot een overdrukventiel opent of er iets breekt.',
        },
        {
          q: 'Wat is het werkpunt van een centrifugaalpomp?',
          options: ['Het debiet op het typeplaatje', 'Waar de pompkarakteristiek en de leidingkarakteristiek elkaar snijden', 'Het punt met de hoogste opvoerhoogte', 'Het debiet waarbij hij caviteert'],
          answer: 'Waar de pompkarakteristiek en de leidingkarakteristiek elkaar snijden',
          why: 'Alleen daar is wat de pomp levert gelijk aan wat het systeem vraagt.',
        },
        {
          q: 'Een pomp verpompt water (dichtheid 1.000 kg/m³) met 0,02 m³ per seconde tegen een opvoerhoogte van 25 m. Reken met g = 9,81 m/s². Hydraulisch vermogen = dichtheid × g × debiet × opvoerhoogte. Wat is het hydraulisch vermogen, in kW?',
          number: 4.9,
          tolerance: 0.1,
          unit: 'kW',
          why: '1.000 × 9,81 × 0,02 × 25 = 4.905 W, ongeveer 4,9 kW.',
        },
        {
          q: 'Een centrifugaalpomp draait het hele jaar op 40% van zijn BEP-debiet. Wat is het waarschijnlijke gevolg?',
          options: ['Hij draait op zijn zuinigste punt', 'Meer trillingen, opwarming en slijtage van afdichtingen en lagers', 'Hij levert meer opvoerhoogte dan op elk ander punt en gaat langer mee', 'Geen enkel gevolg'],
          answer: 'Meer trillingen, opwarming en slijtage van afdichtingen en lagers',
          why: 'Ver links van het BEP wordt de stroming in de pomp onrustig en belast die as, afdichtingen en lagers.',
        },
      ],
      situation: {
        scene: 'Je zit bij een chemieklant. De onderhoudsleider zegt dat pomp P-204 “mechanical seals vreet” en wil overstappen op een duurder merk.',
        ask: 'Wat vraag je voordat ze dat kopen?',
        model: 'Waar op zijn karakteristiek draait P-204 echt: wat zijn het werkelijke debiet en de opvoerhoogte ten opzichte van zijn BEP? Wordt hij met een afsluiter dichtgeknepen? Zijn er tekenen van cavitatie, zoals geluid of een lage zuigtank? En past het type afdichting bij deze vloeistof en temperatuur? Een pomp die ver van zijn BEP draait, vreet elk merk afdichting.',
        rubric: [
          'Vraagt naar het werkelijke werkpunt ten opzichte van het BEP',
          'Checkt op dichtknijpen of een te grote pomp',
          'Denkt aan cavitatie en de keuze van de afdichting voordat het merk de schuld krijgt',
        ],
      },
      sayIt: 'Leg een onderhoudsplanner in 60 seconden uit wat een pompkarakteristiek, een leidingkarakteristiek en het werkpunt zijn.',
      terms: [
        { term: 'Centrifugaalpomp', def: 'Pomp met een draaiende waaier; het debiet zakt als de tegendruk stijgt.' },
        { term: 'Verdringerpomp', def: 'Pomp die per omwenteling een vast volume verplaatst; heeft een overdrukventiel nodig.' },
        { term: 'Werkpunt', def: 'Snijpunt van pomp- en leidingkarakteristiek: het echte debiet en de echte opvoerhoogte.' },
        { term: 'BEP', def: 'Best efficiency point: het debiet waarbij een pomp het zuinigst en rustigst draait.' },
      ],
    },
    {
      id: 'eng.fluids.cavitation',
      title: 'Cavitatie en NPSH',
      pre: [
        {
          q: 'Een pomp klinkt alsof hij grind verpompt. Zijn zuigtank is bijna leeg en de vloeistof is heet. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Een losse motor', 'Cavitatie', 'Te veel weerstand aan de perskant', 'Een verstopte ventilatieopening van de motor'],
          answer: 'Cavitatie',
          why: 'Een laag tankniveau en hete vloeistof verkleinen allebei de marge tegen koken bij de pompinlaat.',
        },
      ],
      teach: [
        'Een vloeistof kookt als de druk onder zijn dampspanning zakt, en die stijgt met de temperatuur: water van 20 °C kookt bij ongeveer 0,023 bar absoluut, bij 80 °C al bij zo’n 0,47 bar absoluut. Bij de pompinlaat is de druk het laagst. Zakt die onder de dampspanning, dan ontstaan dampbellen die verderop in de waaier met geweld imploderen. Dat is cavitatie.',
        'Kenmerken: een knetterend geluid alsof er grind doorheen gaat, trillingen, dalend debiet en opvoerhoogte, en een aangevreten, sponsachtige waaier. Ook afdichtingen en lagers lijden eronder. Flinke cavitatie kan een waaier in een paar weken slopen.',
        'Engineers checken dit met NPSH, net positive suction head, in meters. NPSHr (required) komt van de karakteristiek van de pompfabrikant en stijgt met het debiet. NPSHa (available) volgt uit de installatie: de druk op het vloeistofoppervlak als opvoerhoogte, plus de vloeistofhoogte boven de pompinlaat, min de wrijving in de zuigleiding, min de dampspanning als opvoerhoogte. De regel: NPSHa moet boven NPSHr blijven, met marge.',
        'Wat NPSHa verlaagt: een laag tankniveau, hete vloeistof, een lange of nauwe zuigleiding, een verstopt zuigfilter, een half dichte zuigafsluiter, een vat onder vacuüm. Oplossingen: de tank hoger of de pomp lager, een wijdere en kortere zuigleiding, koelere vloeistof, een schoon filter, en nooit aan de zuigkant knijpen. Boven het ontwerpdebiet draaien verhoogt NPSHr.',
      ],
      example: {
        kind: 'worked',
        text: 'Een condensaatpomp haalt water van 95 °C uit een tank die open staat naar de buitenlucht. Druk op het oppervlak: 1,01 bar; dampspanning bij 95 °C: 0,85 bar. Het verschil, 0,16 bar, is zo’n 1,7 m water. Het vloeistofniveau staat 1,5 m boven de pompinlaat; de wrijving in de zuigleiding is 0,5 m. NPSHa = 1,7 + 1,5 − 0,5 = 2,7 m. Volgens de karakteristiek is NPSHr bij dit debiet 3,0 m: hij caviteert, en de waaier laat het zien. De tank 1 m hoger zetten geeft NPSHa 3,7 m, een marge van 0,7 m. Dát lost het op, niet een ander pompmerk.',
      },
      said: 'Wat engineers zeggen: “Heet condensaat met anderhalve meter toeloophoogte. Natuurlijk caviteert die. Zet die tank hoger.”',
      recall: [
        {
          q: 'Welke verandering verlaagt de NPSH die beschikbaar is voor een pomp?',
          options: ['Een hoger vloeistofniveau in de zuigtank', 'Hetere vloeistof in de zuigtank', 'Een wijdere zuigleiding', 'De persafsluiter dichtknijpen'],
          answer: 'Hetere vloeistof in de zuigtank',
          why: 'Hetere vloeistof heeft een hogere dampspanning, en die gaat er bij NPSHa af.',
        },
        {
          q: 'Waar moet je aan voldoen om cavitatie te voorkomen?',
          options: ['NPSHr boven NPSHa', 'NPSHa boven NPSHr, met marge', 'De pomp draait onder 1.500 toeren', 'De persdruk is boven 3 bar'],
          answer: 'NPSHa boven NPSHr, met marge',
          why: 'De installatie moet meer zuigmarge bieden dan de pomp bij dat debiet nodig heeft.',
        },
        {
          q: 'Een pomp zuigt water uit een open tank. Uitgedrukt als opvoerhoogte: de druk op het vloeistofoppervlak is 10,3 m, de dampspanning 0,4 m, het vloeistofniveau staat 2 m boven de pompinlaat en de wrijving in de zuigleiding is 1,5 m. Wat is de beschikbare NPSH, in m?',
          number: 10.4,
          tolerance: 0.1,
          unit: 'm',
          why: 'NPSHa = 10,3 + 2 − 1,5 − 0,4 = 10,4 m.',
        },
        {
          q: 'Een operator draait de zuigafsluiter van een centrifugaalpomp half dicht om het debiet te verlagen. Wat doet dat?',
          options: ['Dat is de aanbevolen manier om het debiet te verlagen', 'Het vergroot de kans op cavitatie; knijp liever aan de perskant', 'Het verlaagt NPSHr', 'Het heeft geen effect op de pomp'],
          answer: 'Het vergroot de kans op cavitatie; knijp liever aan de perskant',
          why: 'Knijpen aan de zuigkant geeft extra wrijving vóór de pomp, en dat verlaagt NPSHa.',
        },
      ],
      situation: {
        scene: 'Je zit bij een brouwerij. De CIP-retourpomp heeft dit jaar al drie keer een nieuwe waaier nodig gehad; de oude zijn aangevreten als een spons. Onderhoud geeft de leverancier de schuld.',
        ask: 'Wat vraag je?',
        model: 'Dat aanvreten lijkt op cavitatie. Hoe heet is de reinigingsvloeistof bij de pomp, en hoe hoog staat het niveau boven de pompinlaat? Hoe lang en nauw is de zuigleiding, en zit er een filter of een half dichte afsluiter vóór de pomp? Wat is NPSHr bij het echte debiet, en draait hij boven het ontwerpdebiet? Laten we NPSHa en NPSHr naast elkaar leggen voordat we van leverancier wisselen.',
        rubric: [
          'Herkent het aanvreten als waarschijnlijk teken van cavitatie',
          'Vraagt naar temperatuur, vloeistofniveau en vernauwingen in de zuigleiding',
          'Stelt voor NPSHa met NPSHr te vergelijken bij het echte debiet',
        ],
      },
      sayIt: 'Leg een productieleider in 60 seconden uit wat cavitatie is, en wat het erger maakt.',
      terms: [
        { term: 'Cavitatie', def: 'Dampbellen die in een pomp ontstaan en imploderen omdat de inlaatdruk te laag is.' },
        { term: 'Dampspanning', def: 'De druk waarbij een vloeistof bij een bepaalde temperatuur kookt; stijgt met de temperatuur.' },
        { term: 'NPSHa', def: 'Beschikbare NPSH: de zuigmarge die de installatie biedt.' },
        { term: 'NPSHr', def: 'Benodigde NPSH: wat de pomp bij een bepaald debiet nodig heeft, volgens de fabrikant.' },
      ],
    },
    {
      id: 'eng.fluids.speed',
      title: 'Toerenregeling en de affiniteitswetten',
      pre: [
        {
          q: 'Een pomp laat water rondgaan in een gesloten circuit zonder hoogteverschil, dus al zijn opvoerhoogte gaat op aan wrijving. Hij gaat terug naar 80% toerental. Wat gebeurt er ongeveer met zijn vermogen?',
          options: ['Dat zakt naar 80%', 'Dat zakt naar 64%', 'Dat zakt naar ongeveer de helft', 'Dat blijft gelijk'],
          answer: 'Dat zakt naar ongeveer de helft',
          why: 'Vermogen schaalt met het toerental tot de derde: 0,8 × 0,8 × 0,8 = 0,51.',
        },
      ],
      teach: [
        'Een frequentieregelaar verandert het toerental van een motor. Voor een centrifugaalpomp of ventilator zeggen de affiniteitswetten: het debiet schaalt met het toerental, de opvoerhoogte met het toerental in het kwadraat, en het vermogen met het toerental tot de derde. Op 80% toerental krijg je 80% debiet, 64% opvoerhoogte en zo’n 51% vermogen.',
        'Vergelijk dat met dichtknijpen. Wil je 80% debiet door een afsluiter dicht te draaien, dan blijft de pomp op vol toerental draaien en zakt zijn vermogen maar een beetje. Bij systemen die vooral wrijving zijn, zoals circulatiecircuits, ventilatie en koelcircuits, bespaart toerenregeling meestal veel meer.',
        'Het addertje is de statische opvoerhoogte. Moet de pomp vloeistof 30 m omhoog brengen of in een vat van 5 bar duwen, dan moet hij die hoogte eerst halen voordat er überhaupt iets stroomt. Zet je het toerental te ver terug, dan zakt het debiet in tot nul. In zulke systemen is de besparing kleiner dan de derdemachtswet suggereert: vraag hoeveel van de opvoerhoogte statisch is.',
        'Andere voordelen: rustig opstarten, geen waterslag, en druk of debiet direct regelen vanaf een sensor in plaats van met een afsluiter. Kosten: de regelaar zelf, zo’n 3% verlies in de regelaar, harmonischen op het elektriciteitsnet, en lagerstromen bij sommige motoren. Engineers rekenen de case door met een belastingprofiel: hoeveel uur per jaar bij welk debiet.',
      ],
      example: {
        kind: 'worked',
        text: 'Een circulatiepomp trekt op vol toerental 30 kW in een circuit met alleen wrijving. Hij draait 8.000 uur per jaar: 2.000 uur op vol debiet en 6.000 uur op 70%. Nu knijpt een afsluiter hem terug naar 70% debiet; volgens de pompkarakteristiek trekt hij dan nog steeds zo’n 25,5 kW. Per jaar: 30 × 2.000 + 25,5 × 6.000 = 213.000 kWh. Met een frequentieregelaar op 70% toerental: 0,7³ × 30 = 10,3 kW. Met 3% verlies in de regelaar: 30,9 × 2.000 + 10,6 × 6.000 = zo’n 125.400 kWh. Dat scheelt zo’n 88.000 kWh per jaar, ruwweg €13.000 bij €0,15 per kWh, voor een regelaar die een fractie daarvan kost.',
      },
      said: 'Wat engineers zeggen: “Het is een gesloten circuit, alleen wrijving. Zet er een regelaar op, regel op drukverschil, en die afsluiter kan gewoon open.”',
      recall: [
        {
          q: 'Een pomp in een circuit met alleen wrijving trekt op vol toerental 40 kW. Hij gaat terug naar 50% toerental. Welk vermogen trekt hij volgens de affiniteitswetten, zonder verliezen in de regelaar, in kW?',
          number: 5,
          tolerance: 0.2,
          unit: 'kW',
          why: 'Vermogen schaalt met het toerental tot de derde: 0,5³ = 0,125; 0,125 × 40 = 5 kW.',
        },
        {
          q: 'Een centrifugaalpomp levert op vol toerental 200 m³ per uur in een circuit met alleen wrijving. Hij gaat naar 75% toerental. Welk debiet levert hij volgens de affiniteitswetten, in m³ per uur?',
          number: 150,
          tolerance: 1,
          unit: 'm³/h',
          why: 'Debiet schaalt met het toerental: 0,75 × 200 = 150 m³ per uur.',
        },
        {
          q: 'Waar bespaart een frequentieregelaar op een pomp meestal het minst?',
          options: ['Op een gesloten circulatiecircuit', 'Op een pomp die vooral water tegen een groot vast hoogteverschil omhoog brengt', 'Op een ventilator', 'Op een koelwatercircuit met smoorkleppen'],
          answer: 'Op een pomp die vooral water tegen een groot vast hoogteverschil omhoog brengt',
          why: 'Bij veel statische opvoerhoogte kan het toerental maar een beetje omlaag voordat het debiet stopt, dus de winst volgens de derdemachtswet blijft klein.',
        },
        {
          q: 'Wat heb je nodig om de jaarlijkse besparing van een frequentieregelaar op een pomp te schatten?',
          options: ['Alleen het vermogen op het typeplaatje van de motor', 'Een belastingprofiel: hoeveel uur per jaar hij op welk debiet draait', 'De aanschafprijs van de pomp', 'De folder van de leverancier'],
          answer: 'Een belastingprofiel: hoeveel uur per jaar hij op welk debiet draait',
          why: 'De besparing hangt af van hoe lang de pomp op lager debiet draait; op vol debiet bespaart een regelaar niks.',
        },
      ],
      situation: {
        scene: 'Je zit bij een klant in de voedingsmiddelenindustrie. Een leverancier wil frequentieregelaars op alle 40 pompen zetten, met “50% energiebesparing gegarandeerd”.',
        ask: 'Wat vraag je voordat iemand tekent?',
        model: 'Welke van deze pompen draaien echt lang op lager debiet, en welke staan vol open? Hoeveel van de opvoerhoogte is per pomp statisch? Een pomp die naar een hoge tank pompt, bespaart weinig. Kunnen we op de tien grootste twee weken debiet of klepstand loggen voor een belastingprofiel? En wat betekent “gegarandeerd” precies: hoe gemeten, tegen welke nulmeting?',
        rubric: [
          'Vraagt welke pompen op deellast draaien en hoe lang',
          'Noemt statische opvoerhoogte als grens aan de besparing',
          'Vraagt om metingen: belastingprofiel en een nulmeting voor de garantie',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden de affiniteitswetten uit, en waarom een frequentieregelaar niet op elke pomp bespaart.',
      terms: [
        { term: 'Frequentieregelaar', def: 'Regelt het toerental van een motor door de frequentie van de voeding te veranderen; ook wel VFD of omvormer.' },
        { term: 'Affiniteitswetten', def: 'Debiet schaalt met het toerental, opvoerhoogte met het kwadraat, vermogen met de derde macht.' },
        { term: 'Statische opvoerhoogte', def: 'Hoogte- en drukverschil dat de pomp ook bij nul debiet moet overwinnen.' },
        { term: 'Belastingprofiel', def: 'Uren per jaar bij elk debiet of elke belasting; de basis van elke besparingsschatting.' },
      ],
    },
    {
      id: 'eng.fluids.heat',
      title: 'Warmtewisselaars',
      pre: [
        {
          q: 'In een tegenstroomwarmtewisselaar stromen de warme en de koude stroom in tegengestelde richting. Kan de koude stroom er warmer uitkomen dan de warme stroom eruit komt?',
          options: ['Nee, nooit', 'Ja, bij tegenstroom kan dat', 'Alleen met stoom', 'Alleen als de debieten gelijk zijn'],
          answer: 'Ja, bij tegenstroom kan dat',
          why: 'De koude stroom gaat eruit aan de kant waar de warme stroom binnenkomt, dus hij kan de inlaattemperatuur van de warme kant benaderen.',
        },
      ],
      teach: [
        'Een warmtewisselaar brengt warmte van een warme stroom naar een koude via een wand, zonder dat ze mengen. Platenwarmtewisselaars (gestapelde, geprofileerde platen) zijn compact, efficiënt en makkelijk open te maken om te reinigen; veel gebruikt in voeding en installatietechniek, maar beperkt in druk en gevoelig voor deeltjes. Pijpenbundelwarmtewisselaars (een bundel buizen in een mantel) kunnen hoge druk, hoge temperatuur en vuile stromen aan; veel gebruikt in chemie en raffinaderijen.',
        'De warmtelast volgt uit de stromen: Q = m × cp × ΔT aan elke kant, en in een stationaire toestand geeft de warme kant af wat de koude kant opneemt, min kleine verliezen. Wat een wisselaar kán overdragen is Q = U × A × ΔT gemiddeld: U is hoe goed warmte door de wand en de vloeistoflaagjes gaat, A het oppervlak, en ΔT gemiddeld het gemiddelde temperatuurverschil tussen de stromen.',
        'Bij tegenstroom, met de stromen in tegengestelde richting, houd je over de hele lengte een temperatuurverschil. Dat geeft de meeste warmteoverdracht per oppervlak, en de koude stroom kan er warmer uitkomen dan de warme stroom eruit komt. Bij meestroom kan de koude uitlaat nooit boven de warme uitlaat komen.',
        'De naderingstemperatuur (approach) is het kleinste temperatuurverschil tussen de stromen. Een krappe nadering van 2 tot 5 °C wint veel warmte terug maar vraagt veel oppervlak. Haalt een wisselaar zijn temperatuur niet meer, vraag dan wat er veranderd is: hoger debiet, vervuiling op de wand (lagere U), een warmer koelmedium, of lucht of condensaat dat een deel van het oppervlak blokkeert.',
      ],
      example: {
        kind: 'worked',
        text: 'Een productkoeler: 5.000 kg per uur, cp 3,8 kJ per kg per °C, gekoeld van 70 naar 30 °C. Warmtelast: 5.000 × 3,8 × 40 = 760.000 kJ per uur = 211 kW. Het koelwater komt binnen op 15 °C en mag eruit op 25 °C, 10 °C opwarming met cp 4,2: waterdebiet = 760.000 / (4,2 × 10) = 18.100 kg per uur, zo’n 18 m³ per uur. In de zomer komt het water binnen op 20 °C. Om op 25 °C eruit te blijven mag het maar 5 °C opwarmen, dus is er twee keer zoveel water nodig, 36 m³ per uur, en door het kleinere temperatuurverschil is het oppervlak misschien helemaal niet genoeg. Daarom hebben koelers het in juli moeilijk.',
      },
      said: 'Wat engineers zeggen: “Zelfde debieten, zelfde ingangstemperaturen, vier graden warmer eruit dan vorige maand. Dat is hoogstwaarschijnlijk vervuiling. Plan een reiniging in.”',
      recall: [
        {
          q: 'Een productstroom van 2 kg per seconde met cp 4,0 kJ per kg per °C wordt gekoeld van 60 naar 20 °C. Verwaarloos verliezen. Hoeveel warmte wordt er afgevoerd, in kW?',
          number: 320,
          tolerance: 2,
          unit: 'kW',
          why: '2 × 4,0 × 40 = 320 kJ per seconde = 320 kW.',
        },
        {
          q: 'Een koeler moet 320 kW afvoeren. Het koelwater (cp 4,2 kJ per kg per °C) mag 10 °C opwarmen. Verwaarloos verliezen. Hoeveel kg koelwater per seconde is er nodig?',
          number: 7.6,
          tolerance: 0.1,
          unit: 'kg/s',
          why: '320 / (4,2 × 10) = 7,6 kg per seconde.',
        },
        {
          q: 'Bij welke stromingsrichting draagt een wisselaar de meeste warmte over per m² oppervlak?',
          options: ['Meestroom', 'Tegenstroom', 'Allebei evenveel', 'Dat hangt alleen van de pomp af'],
          answer: 'Tegenstroom',
          why: 'Tegenstroom houdt over de hele lengte een groter gemiddeld temperatuurverschil.',
        },
        {
          q: 'Een platenkoeler draait met dezelfde debieten en dezelfde ingangstemperaturen als vorige maand, maar het product komt er nu 4 °C warmer uit. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Vervuiling op de platen, waardoor U daalt', 'Een hoger productdebiet', 'Kouder koelwater', 'Er is een grotere wisselaar geplaatst'],
          answer: 'Vervuiling op de platen, waardoor U daalt',
          why: 'Bij gelijke debieten en ingangstemperaturen kan alleen U of het werkzame oppervlak gedaald zijn; vervuiling verlaagt U.',
        },
      ],
      situation: {
        scene: 'Je zit bij een brouwerij. In de zomer krijgt de wortkoeler het wort niet naar 12 °C, en de brouwmeester wil een grotere koelmachine.',
        ask: 'Wat vraag je?',
        model: 'Wat zijn de temperaturen in en uit aan beide kanten in de zomer, vergeleken met de winter? Komt het koelmedium warmer binnen, dan krimpt het temperatuurverschil en draagt dezelfde wisselaar minder over. Wanneer is hij voor het laatst gereinigd, en zakt U in de loop van de tijd? Zit het probleem in de capaciteit van de koelmachine, het oppervlak van de wisselaar of het debiet van het koelmedium? Elk vraagt een andere oplossing.',
        rubric: [
          'Vraagt naar in- en uitgaande temperaturen aan beide kanten, zomer tegen winter',
          'Checkt vervuiling en het verloop van de prestatie',
          'Maakt onderscheid tussen koelcapaciteit, wisselaaroppervlak en debiet',
        ],
      },
      sayIt: 'Leg een nieuwe procesoperator in 60 seconden uit waardoor een warmtewisselaar beter of slechter werkt.',
      terms: [
        { term: 'Platenwarmtewisselaar', def: 'Compacte wisselaar van gestapelde, geprofileerde platen; makkelijk te reinigen, beperkt in druk.' },
        { term: 'Pijpenbundelwarmtewisselaar', def: 'Wisselaar met een buizenbundel in een mantel; robuust bij hoge druk en vuile stromen.' },
        { term: 'Tegenstroom', def: 'Stromen in tegengestelde richting; de effectiefste opstelling.' },
        { term: 'Vervuiling (fouling)', def: 'Afzetting op het warmteoverdragend oppervlak, waardoor U en dus de overgedragen warmte daalt.' },
      ],
    },
    {
      id: 'eng.fluids.steam',
      title: 'Stoom en condensaat',
      pre: [
        {
          q: 'Waarom verwarmen veel fabrieken met stoom in plaats van met heet water?',
          options: ['Stoom is gratis', 'Condenserende stoom geeft veel warmte af bij een vaste temperatuur', 'Stoom heeft geen leidingen nodig', 'Heet water kun je niet pompen'],
          answer: 'Condenserende stoom geeft veel warmte af bij een vaste temperatuur',
          why: 'De meeste warmte in stoom is latente warmte, die vrijkomt bij de condensatietemperatuur die bij de druk hoort.',
        },
      ],
      teach: [
        'Stoom draagt zijn warmte vooral als latente warmte. Condenseert 1 kg verzadigde stoom van ongeveer 7 bar(g), dan komt er zo’n 2.050 kJ vrij, bij een vaste temperatuur van ongeveer 170 °C. Daardoor is stoom compact te verdelen en makkelijk te regelen: de stoomdruk bepaalt de verwarmingstemperatuur. Druk omhoog, temperatuur omhoog.',
        'Na het condenseren moet het water (condensaat) de warmtewisselaar uit, anders loopt het oppervlak onder en zakt de verwarming. Daar zijn condenspotten voor: ze laten condensaat door en houden stoom tegen. Een condenspot die openstaat blaast verse stoom de condensaatleiding in; een die dicht zit laat de wisselaar vollopen en kan waterslag geven: harde klappen die leidingen en pakkingen kapotmaken.',
        'Condenspotten gaan stilletjes stuk. In systemen zonder testprogramma kan 15 tot 30% van de potten defect zijn (een veelgenoemde schatting). Fabrieken testen ze elk jaar met ultrasoon of temperatuurmeting. Condensaat is heet, schoon water: terug naar de ketel scheelt brandstof, water en chemicaliën voor de waterbehandeling.',
        'Stoomlekken en ongeïsoleerde leidingen en appendages zijn zichtbaar geld. De getallen om naar te vragen: ketelrendement, het aandeel condensaat dat terugkomt, en stoomverbruik per ton product. Vervuiling in stoomverwarmde wisselaars, zoals ketelsteen of aangebrand product, verlaagt de warmteoverdracht net als in elke wisselaar; reinigen of ontkalken herstelt dat.',
      ],
      example: {
        kind: 'worked',
        text: 'Een inspectie van condenspotten bij een voedingsfabriek vindt 30 van de 200 potten die openstaan. Eén openstaande pot verliest naar schatting 15 kg stoom per uur. Over 8.000 uur is dat 120 ton stoom per jaar per pot. Bij een aangenomen €40 per ton stoom (afhankelijk van de gasprijs) is dat €4.800 per jaar per pot, en €144.000 voor alle 30, als ze elk zoveel lekken. Een nieuwe pot kost een paar honderd euro. Zelfs als het echte gemiddelde verlies de helft is, verdient de reparatie zich binnen een paar maanden terug. Vervang potten alleen met de leiding afgesloten, drukloos en afgekoeld. Zet daarna een jaarlijkse test op, zodat het niet terugsluipt.',
      },
      said: 'Wat engineers zeggen: “Voordat we het over een nieuwe ketel hebben: eerst de condenspotten doorlopen. Elke pot die openstaat is een lekje dat je het hele jaar betaalt.”',
      recall: [
        {
          q: 'Stoom geeft bij condenseren 2.050 kJ per kg af. Een verwarmer heeft 410 kW nodig uit condenserende stoom. Verwaarloos verliezen. Hoeveel kg stoom per uur heeft hij nodig?',
          number: 720,
          tolerance: 5,
          unit: 'kg/h',
          why: '410 kJ/s × 3.600 = 1.476.000 kJ per uur; / 2.050 = 720 kg per uur.',
        },
        {
          q: 'De condenspot van een warmtewisselaar zit dicht. Wat gebeurt er?',
          options: ['Verse stoom blaast naar de afvoer', 'Condensaat hoopt zich op, de verwarming zakt en er kan waterslag ontstaan', 'De wisselaar verwarmt beter', 'Niks, condenspotten zijn optioneel'],
          answer: 'Condensaat hoopt zich op, de verwarming zakt en er kan waterslag ontstaan',
          why: 'Het condensaat kan er niet uit, loopt het verwarmend oppervlak onder en kan door de stoom door de leidingen worden geslagen.',
        },
        {
          q: 'Waarom sturen fabrieken het condensaat terug naar de ketel?',
          options: ['Dat is wettelijk verplicht', 'Het is heet, schoon water: het scheelt brandstof, water en chemicaliën', 'Condensaat mag niet in het riool', 'Het verhoogt de stoomdruk'],
          answer: 'Het is heet, schoon water: het scheelt brandstof, water en chemicaliën',
          why: 'Teruggestuurd condensaat bevat al warmte en hoeft nauwelijks behandeld te worden.',
        },
        {
          q: 'De stoomdruk in een verwarmer gaat van 3 naar 6 bar(g). Wat gebeurt er met de verwarmingstemperatuur?',
          options: ['Die stijgt, want de condensatietemperatuur van verzadigde stoom stijgt met de druk', 'Die daalt', 'Die blijft gelijk, stoom is altijd 100 °C', 'Dat hangt alleen van de condenspot af'],
          answer: 'Die stijgt, want de condensatietemperatuur van verzadigde stoom stijgt met de druk',
          why: 'Verzadigde stoom condenseert bij hogere druk op een hogere temperatuur (ongeveer 144 °C bij 3 bar(g), 165 °C bij 6 bar(g)).',
        },
      ],
      situation: {
        scene: 'Je zit bij een voedingsfabriek. De gasrekening is flink gestegen en de plantmanager wil de 20 jaar oude ketel vervangen door een hoogrendementsketel.',
        ask: 'Wat vraag je voor het besluit over de ketel?',
        model: 'Hoeveel stoom gebruiken we per ton product, en hoe is dat verlopen? Welk deel van het condensaat komt terug naar de ketel? Wanneer zijn de condenspotten voor het laatst gecontroleerd, en hoeveel waren er stuk? Zijn er lekken en ongeïsoleerde afsluiters? En wat is het gemeten rendement van de huidige ketel? Een nieuwe ketel lost alleen dat laatste op.',
        rubric: [
          'Vraagt naar stoomverbruik per ton product en het verloop',
          'Brengt condenspotten, lekken, isolatie en condensaatretour in',
          'Vraagt naar het gemeten ketelrendement voordat de ketel vervangen wordt',
        ],
      },
      sayIt: 'Leg een financieel manager in 60 seconden uit wat een condenspot doet en waarom kapotte potten geld kosten.',
      terms: [
        { term: 'Verzadigde stoom', def: 'Stoom op zijn kookpunt; de druk legt de temperatuur vast.' },
        { term: 'Condenspot', def: 'Een afsluiter die condensaat uit stoomapparatuur laat en stoom tegenhoudt.' },
        { term: 'Condensaat', def: 'Het hete water dat overblijft als stoom zijn latente warmte heeft afgegeven.' },
        { term: 'Waterslag', def: 'Harde drukstoten als condensaat door stoomleidingen wordt geslagen.' },
      ],
    },
  ],
};

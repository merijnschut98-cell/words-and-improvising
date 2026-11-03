// eng.process (NL): Procestechniek: de basis: unit operations, procesgrootheden, massa- en energiebalans, batchcycli, opschalen.
export default {
  lessons: [
    {
      id: 'eng.process.types',
      title: 'Unit operations, batch en continu',
      pre: [
        {
          q: 'Een brouwerij brouwt in een ketel, één brouwsel tegelijk. Een raffinaderij laat haar destillatiekolom jarenlang doordraaien. Wat is het belangrijkste verschil in hoe ze draaien?',
          options: ['De brouwerij gebruikt meer energie per liter', 'De brouwerij werkt in batches; de raffinaderij draait continu', 'De raffinaderij heeft geen recept', 'Er is geen echt verschil'],
          answer: 'De brouwerij werkt in batches; de raffinaderij draait continu',
          why: 'Een batch is een vaste hoeveelheid die stap voor stap wordt bewerkt; in een continue installatie stroomt het product de hele tijd in en uit.',
        },
      ],
      teach: [
        'Procesinstallaties zijn opgebouwd uit unit operations: een klein setje fysische stappen dat overal terugkomt. Pompen, verwarmen en koelen, mengen, scheiden (filtreren, centrifugeren, destilleren, indampen), drogen en reageren.\n\nEen zuivelfabriek, een chemische fabriek en een waterbedrijf gebruiken dezelfde bouwstenen, alleen in een andere volgorde. Weet je naar welke stap je kijkt, dan weet je welke vragen je moet stellen, wat het product ook is.',
        'Batch: een vaste hoeveelheid gaat een vat in, wordt stap voor stap bewerkt en komt eruit als één partij. Dat is flexibel, makkelijk te traceren (één batch, één registratie) en past bij veel recepten en kleine volumes: farma, specialistische chemie, veel voeding.\n\nDe nadelen: vullen, legen en reinigen leveren niks op, en elke batch is net iets anders.',
        'Continu: het product stroomt non-stop in en uit, en de installatie draait in een stationaire toestand (steady state): overal dezelfde condities, uur na uur. Dat is efficiënt bij grote volumes: raffinaderijen, papier, bulkchemie, melkpoeder.\n\nOpstarten en stoppen kost veel en levert product buiten spec op, dus zulke fabrieken stoppen liever niet. Veel locaties combineren: batchgewijs mengen dat een continue vullijn voedt.',
        'Verblijftijd is hoe lang het product gemiddeld in een continue stap zit: het volume van die stap gedeeld door het debiet erdoorheen. Een tank van 6 m³ met 3 m³ per uur erdoorheen geeft 2 uur.\n\nVraag ernaar zodra de kwaliteit van tijd afhangt: verhitten, warmhouden, reageren, bezinken. In een continu proces betekent meer debiet minder verblijftijd.',
      ],
      example: {
        kind: 'worked',
        text: 'Een sapfabriek pasteuriseert continu. Na het verhitten stroomt het sap door een heethoudbuis van 0,1 m³, met 12 m³ per uur. Verblijftijd = 0,1 / 12 uur = 0,00833 uur = 30 seconden. Het voedselveiligheidsplan eist minstens 20 seconden op temperatuur.\n\nProductie wil naar 18 m³ per uur om meer te maken. Dan wordt de verblijftijd 0,1 / 18 uur = 20 seconden: precies op het minimum, zonder marge.\n\nEn dat is nog het gemiddelde: in het midden van een buis stroomt het sap sneller dan gemiddeld, dus het snelste sap zit er korter dan 20 seconden in. Daarom ontwerp je een heethoudbuis op het snelste deeltje, niet op het gemiddelde. In een continu proces hangen doorzet en verblijftijd aan elkaar: meer output vraagt een langere heethoudbuis, niet alleen een snellere pomp.',
      },
      said: 'Wat engineers zeggen: “We kunnen naar 18 kuub per uur, maar dan zitten we precies op de minimale heethoudtijd. Niet zonder langere buis.”',
      recall: [
        {
          q: 'Een continue buffertank bevat gemiddeld 8 m³ product. Er stroomt constant 2 m³ per uur doorheen. Wat is de gemiddelde verblijftijd in de tank, in uren?',
          number: 4,
          tolerance: 0.1,
          unit: 'uur',
          why: 'Verblijftijd = volume / debiet = 8 / 2 = 4 uur.',
        },
        {
          q: 'Welke hiervan is een unit operation?',
          options: ['Productieplanning', 'Indampen', 'Een kwaliteitsaudit', 'Een ploegoverdracht'],
          answer: 'Indampen',
          why: 'Unit operations zijn fysische processtappen; planning, audits en overdrachten zijn organisatie.',
        },
        {
          q: 'Waarom doen continue installaties er alles aan om niet te stoppen?',
          options: ['Opstarten en stoppen duurt lang en levert product buiten spec op', 'Hun machines kunnen niet uit', 'Continue installaties hebben geen onderhoud', 'Stoppen verandert het recept'],
          answer: 'Opstarten en stoppen duurt lang en levert product buiten spec op',
          why: 'Een continue installatie maakt alleen goed product als ze in stationaire toestand draait; elke stop kost de weg terug daarnaartoe.',
        },
        {
          q: 'Een farmaceutisch bedrijf maakt 40 verschillende producten in kleine volumes en moet elke partij kunnen traceren. Welke manier van produceren past het best?',
          options: ['Continu', 'Batch', 'Maakt niet uit', 'Geen van beide: alleen handwerk'],
          answer: 'Batch',
          why: 'Batch kan veel recepten en kleine volumes aan, en één batch geeft één traceerbare registratie.',
        },
      ],
      situation: {
        scene: 'Je zit bij een zuivelklant. De plantmanager wil 30% meer uit de continue pasteur halen: “We zetten de pomp gewoon hoger.”',
        ask: 'Wat vraag je voordat ze het debiet opvoeren?',
        model: 'Wat doet 30% meer debiet met de verblijftijd in de heethoudsectie: halen we dan nog de minimale tijd op temperatuur uit het voedselveiligheidsplan? Krijgt de warmtewisselaar 30% meer melk nog op temperatuur? En is de pasteur echt de bottleneck, of beperkt de vuller erna de output toch al?',
        rubric: [
          'Koppelt meer debiet aan een kortere verblijftijd (heethoudtijd)',
          'Vraagt of de verwarmingscapaciteit het hogere debiet aankan',
          'Checkt of deze stap echt de bottleneck is',
        ],
      },
      sayIt: 'Leg een nieuwe collega in 60 seconden het verschil uit tussen batch en continu produceren.',
      terms: [
        { term: 'Unit operation', def: 'Een fysische basisstap in een proces, zoals pompen, verwarmen, mengen, scheiden, drogen of reageren.' },
        { term: 'Batchproces', def: 'Een vaste hoeveelheid die stap voor stap in een vat wordt bewerkt en als één partij wordt vrijgegeven.' },
        { term: 'Continu proces', def: 'Het product stroomt non-stop in en uit en de installatie draait in stationaire toestand.' },
        { term: 'Verblijftijd', def: 'Gemiddelde tijd dat het product in een stap zit: volume gedeeld door debiet.' },
      ],
    },
    {
      id: 'eng.process.variables',
      title: 'Druk, debiet, niveau en temperatuur',
      pre: [
        {
          q: 'Een manometer op een vat wijst 2 bar aan. Zoals bijna alle manometers meet hij ten opzichte van de buitenlucht. De fabriek ligt op zeeniveau. Wat is ongeveer de absolute druk in het vat?',
          options: ['2 bar', 'Ongeveer 3 bar', '1 bar', '0 bar'],
          answer: 'Ongeveer 3 bar',
          why: 'Absolute druk = overdruk + ongeveer 1 bar atmosferische druk.',
        },
      ],
      teach: [
        'Vier grootheden sturen de meeste procesinstallaties: druk, temperatuur, debiet en niveau. Druk is in bar (of kPa; psi op Amerikaanse apparatuur). Overdruk, bar(g), is ten opzichte van de buitenlucht; absolute druk, bar(a), ten opzichte van vacuüm.\n\nAbsoluut = overdruk + ongeveer 1 bar op zeeniveau. Vacuüm zie je als negatieve overdruk of als lage absolute druk. Hoor je een getal, vraag dan welke het is.',
        'Debiet is volume per tijd (m³/h, l/min) of massa per tijd (kg/h, t/h). Massadebiet = volumedebiet × dichtheid. Water is ongeveer 1.000 kg/m³, dus 1 m³/h is zo’n 1.000 kg/h; een siroop van 1.300 kg/m³ geeft 1.300 kg/h.\n\nRecepten en balansen rekenen in massa, dus vraag wat een meter toont. Gangbare meters: magnetisch-inductief (geleidende vloeistoffen), Coriolis (meet direct massa, nauwkeurig, duur), vortex en drukverschil.',
        'Niveau meet je met een druksensor onderin, een radar van bovenaf of een vlotter.\n\nEen druksensor meet eigenlijk het gewicht van de vloeistofkolom: wijkt de dichtheid af van waar hij op is ingesteld, dan klopt de hoogte niet, al klopt de massa die eruit volgt nog wel. Schuim kan een radar foppen. Leest een niveau raar, vraag dan op welk principe de meter werkt.',
        'Temperatuur: een verschil van 1 °C is gelijk aan 1 K, dus warmteberekeningen met verschillen mogen in °C. Sensoren zijn meestal Pt100-weerstandsthermometers (nauwkeurig, tot zo’n 600 °C) of thermokoppels (groter bereik, minder nauwkeurig). Een sensor in een beschermhuls in een leiding met weinig stroming kan minuten achterlopen op de echte temperatuur.',
      ],
      example: {
        kind: 'worked',
        text: 'Een tank heeft een niveaumeter op basis van druk, ingesteld op water (1.000 kg/m³). Er staat nu siroop van 1.250 kg/m³ in, echt 2,0 m hoog. De druk onderin is 1.250 × 9,81 × 2,0 = 24.525 Pa.\n\nDe meter deelt door de dichtheid van water: 24.525 / (1.000 × 9,81) = 2,5 m. Het scherm zegt 2,5 m terwijl het echt 2,0 m is, dus het hoog-niveaualarm kan te vroeg afgaan en de tank lijkt voller dan hij is.\n\nDe massa die de meter aangeeft klopt wel, want druk × tankoppervlak / g is de massa van de inhoud (bij een tank met rechte, verticale wanden). Oplossing: de juiste dichtheid invoeren, of de tank in kg aflezen.',
      },
      said: 'Wat engineers zeggen: “Die niveautransmitter staat op water. Met siroop leest hij een halve meter te hoog, dus vertrouw dat alarm niet.”',
      recall: [
        {
          q: 'Een manometer op een stoomleiding wijst 6 bar(g) aan. De fabriek ligt op zeeniveau, waar de atmosferische druk ongeveer 1 bar is. Wat is de absolute druk, in bar(a)?',
          number: 7,
          tolerance: 0.1,
          unit: 'bar(a)',
          why: 'Absoluut = overdruk + atmosferisch = 6 + 1 = ongeveer 7 bar(a).',
        },
        {
          q: 'Een debietmeter toont 12 m³ per uur van een vloeistof met een dichtheid van 1.100 kg/m³. Wat is het massadebiet, in kg per uur?',
          number: 13200,
          tolerance: 50,
          unit: 'kg/h',
          why: 'Massadebiet = volumedebiet × dichtheid = 12 × 1.100 = 13.200 kg per uur.',
        },
        {
          q: 'Welk type debietmeter meet het massadebiet direct?',
          options: ['Een magnetisch-inductieve meter', 'Een Coriolismeter', 'Een vortexmeter', 'Een vlotter in een glazen buis'],
          answer: 'Een Coriolismeter',
          why: 'Een Coriolismeter meet direct massa; de andere meten snelheid of volume en hebben de dichtheid nodig voor massa.',
        },
        {
          q: 'Een product wordt verwarmd van 20 °C naar 80 °C. Hoe groot is het temperatuurverschil, in kelvin?',
          options: ['60 K', '333 K', '353 K', '80 K'],
          answer: '60 K',
          why: 'Een verschil van 1 °C is 1 K, dus 60 °C erbij is 60 K erbij.',
        },
      ],
      situation: {
        scene: 'Je zit bij een frisdrankklant. Siroopbatches komen keer op keer zo’n 3% te laag uit op suikergehalte. Het recept doseert suiker op gewicht via een weegschaal en water via een debietmeter die kubieke meters optelt.',
        ask: 'Wat vraag je?',
        model: 'Wat voor debietmeter zit er op het water, en wanneer is die voor het laatst gekalibreerd? Hij telt volume op: staat het recept in volume of in kg, en hoe warm is het water? Komt er nog ander water in de batch, zoals spoelwater of een leiding die wordt nagespoeld? En hoe wordt het suikergehalte gemeten: steeds dezelfde labmethode en temperatuur?',
        rubric: [
          'Vraagt naar het type meter en de kalibratie',
          'Maakt onderscheid tussen volume en massa en checkt dichtheid of temperatuur',
          'Zoekt verborgen extra stromen en checkt de meting van het resultaat',
        ],
      },
      sayIt: 'Leg een nieuwe planner in 60 seconden uit waarom “bar” en “kuub per uur” altijd een tweede vraag nodig hebben.',
      terms: [
        { term: 'bar(g) en bar(a)', def: 'Overdruk (ten opzichte van de buitenlucht) en absolute druk (ten opzichte van vacuüm); absoluut is ongeveer 1 bar hoger.' },
        { term: 'Massadebiet', def: 'Kilogram per tijdseenheid: volumedebiet × dichtheid.' },
        { term: 'Coriolismeter', def: 'Een debietmeter die direct massa meet; nauwkeurig en veel gebruikt voor dosering.' },
        { term: 'Pt100', def: 'Een veelgebruikte, nauwkeurige weerstandsthermometer.' },
      ],
    },
    {
      id: 'eng.process.mass',
      title: 'Massabalans en opbrengst',
      pre: [
        {
          q: 'Een indamper krijgt 1.000 kg sap met 12% droge stof binnen en haalt er water uit tot het concentraat 60% droge stof heeft. Er gaat geen droge stof verloren. Hoeveel concentraat komt eruit?',
          options: ['200 kg', '600 kg', '120 kg', '480 kg'],
          answer: '200 kg',
          why: 'De 120 kg droge stof gaat er onveranderd doorheen; 120 kg is 60% van 200 kg.',
        },
      ],
      teach: [
        'Massa blijft behouden: wat erin gaat, komt eruit of blijft erin zitten. Als formule: in = uit + ophoping. In een continue installatie in stationaire toestand hoopt niks op, dus in = uit.\n\nEen massabalans is het eerste gereedschap van een procesengineer: teken een kader om een stap, zet elke stroom erin en eruit op een rij, en kijk of het sluit.',
        'Maak de balans ook per component. Water, suiker, droge stof of zout kloppen elk apart, zolang er niks reageert.\n\nDe truc bij de meeste vraagstukken is de component die er onveranderd doorheen gaat: de droge stof in een indamper, de vaste stof in een droger. Die legt de grootte van de andere stromen vast.',
        'Opbrengst (yield) is nuttige output gedeeld door input: kg goed product per kg grondstof. Een balans die niet sluit is een bevinding.\n\nMist er 2% van de massa, zoek dan een lek, een meetfout, product dat naar het riool gaat, of materiaal dat in tanks en leidingen staat. Verliezen verstoppen zich in spoelwater, filterkoek, opstartproduct en labmonsters.',
        'Vraag om balansen in massa, niet in volume. Volumes veranderen met temperatuur en menging: 1 liter water plus 1 liter ethanol geeft ongeveer 1,92 liter, geen 2. Massa telt altijd op.\n\nEn check of de voorraad in de tanks aan het begin en eind van de periode is meegenomen, anders lijkt een volle tank een verlies.',
      ],
      example: {
        kind: 'worked',
        text: 'Een siroopstap lost per batch 1.000 kg suiker op in 500 kg water: 1.500 kg erin. Eruit: 1.440 kg siroop op de weegcellen en 30 kg filterkoek: 1.470 kg.\n\nEr mist 30 kg, 2% van de input. Opbrengst aan siroop: 1.440 / 1.500 = 96%.\n\nWaar blijft die 30 kg? De batch wordt in een open vat naar 85 °C verwarmd, dus er verdampt water.\n\nEen suikerbalans geeft uitsluitsel: zit alle 1.000 kg suiker in de siroop en de koek, dan is wat mist water, en is de siroop iets sterker dan het recept. Mist er ook suiker, zoek dan naar morsen of product dat in de leidingen blijft staan.',
      },
      said: 'Wat engineers zeggen: “De balans sluit op 2% na. Voordat we het een verlies noemen, maken we hem eerst op droge stof.”',
      recall: [
        {
          q: 'Een droger krijgt 500 kg per uur nat poeder binnen met 20% water. Het gedroogde poeder gaat eruit met 4% water, en alle vaste stof gaat mee met het poeder. Hoeveel kg gedroogd poeder komt er per uur uit?',
          number: 416.7,
          tolerance: 1,
          unit: 'kg/h',
          why: 'Vaste stof = 80% van 500 = 400 kg/h. Dat is 96% van het droge poeder: 400 / 0,96 = 416,7 kg/h.',
        },
        {
          q: 'Eén batch gebruikt 2.000 kg grondstof en levert 1.700 kg goed product. Wat is de opbrengst, in procent?',
          number: 85,
          tolerance: 0.5,
          unit: '%',
          why: 'Opbrengst = goede output / input = 1.700 / 2.000 = 85%.',
        },
        {
          q: 'Over een week sluit de massabalans van een mengtank niet: 1,5% van de input mist. Wat is de juiste eerste stap?',
          options: ['Boeken als procesverlies en door', 'De meters checken, de voorraadverandering in de tanks en elke kleine stroom zoals spoelwater en monsters', 'De tank vervangen', 'De nachtdienst de schuld geven'],
          answer: 'De meters checken, de voorraadverandering in de tanks en elke kleine stroom zoals spoelwater en monsters',
          why: 'De meeste gaten komen uit meten, voorraadverschillen of vergeten stromen; pas daarna is het echt verlies.',
        },
        {
          q: 'Waarom rekenen procesengineers balansen in massa en niet in volume?',
          options: ['Massa blijft behouden; volume verandert met temperatuur en menging', 'Massameters zijn goedkoper', 'Volume kun je in een fabriek niet meten', 'Klanten kopen alleen op gewicht'],
          answer: 'Massa blijft behouden; volume verandert met temperatuur en menging',
          why: 'Alleen massa telt gegarandeerd op; volumes kunnen krimpen of uitzetten.',
        },
      ],
      situation: {
        scene: 'Je zit bij een sausfabrikant. Finance zegt dat de lijn het afgelopen kwartaal 5% meer tomatenpuree verbruikt dan het recept. De productiemanager zegt dat het recept “maar theorie” is.',
        ask: 'Wat vraag je om die 5% te vinden?',
        model: 'Kunnen we een week lang een massabalans over de lijn maken: puree erin op gewicht, product eruit op gewicht, plus afkeur, opstart- en restproduct, spoelwater en monsters? Wordt de puree op gewicht of op volume gedoseerd, en wanneer is dat gecontroleerd? Worden de tankvoorraden aan begin en eind van elke periode geteld? En verschilt die 5% per ploeg of product? Dan wijst het naar een werkwijze, niet naar het recept.',
        rubric: [
          'Stelt een massabalans over de lijn voor met alle stromen',
          'Checkt hoe de puree wordt gedoseerd en gemeten',
          'Vraagt naar voorraadverschillen en een uitsplitsing per ploeg of product',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit wat een massabalans is en waarom je er verliezen mee vindt.',
      terms: [
        { term: 'Massabalans', def: 'In = uit + ophoping, voor het totaal en per component.' },
        { term: 'Stationaire toestand', def: 'Een continu proces waarin niks verandert in de tijd, dus niks ophoopt.' },
        { term: 'Opbrengst (yield)', def: 'Nuttige output gedeeld door input, meestal in kg per kg.' },
        { term: 'Sleutelcomponent', def: 'Een component die er onveranderd doorheen gaat, zoals droge stof, en de andere stromen vastlegt.' },
      ],
    },
    {
      id: 'eng.process.energy',
      title: 'Energiebalans: verwarmen, koelen, indampen',
      pre: [
        {
          q: 'Wat kost meer energie: 1 kg water verwarmen van 20 naar 100 °C, of 1 kg water van 100 °C laten verdampen?',
          options: ['Verwarmen van 20 naar 100 °C', 'Verdampen, ongeveer zeven keer zoveel', 'Allebei evenveel', 'Geen van beide kost energie'],
          answer: 'Verdampen, ongeveer zeven keer zoveel',
          why: 'Verwarmen kost ongeveer 4,2 × 80 = 336 kJ; verdampen ongeveer 2.260 kJ.',
        },
      ],
      teach: [
        'Ook energie blijft behouden. Wat erin gaat als stoom, gas, elektriciteit of warm product, komt ergens weer uit: als warmte in het product, verlies naar de omgeving, of warm koelwater. Een energiebalans vertelt hoeveel verwarming of koeling een stap nodig heeft, en waar de energie weglekt.',
        'Voelbare warmte verandert de temperatuur: Q = m × cp × ΔT. Voor water is cp ongeveer 4,2 kJ per kg per °C; veel waterige levensmiddelen zitten rond 3,5 tot 4; oliën rond 2. 1.000 kg water 50 °C opwarmen kost 1.000 × 4,2 × 50 = 210.000 kJ. Eén kWh is 3.600 kJ, dus dat is ongeveer 58 kWh.',
        'Latente warmte verandert de fase bij gelijke temperatuur. 1 kg water van 100 °C verdampen kost ongeveer 2.260 kJ, bijna zeven keer zoveel als het opwarmen van 20 naar 100 °C. Daarom vreten indampers en drogers energie, en daarom is water eerst mechanisch eruit halen (persen, membranen, centrifuges) veel goedkoper dan het wegkoken.',
        'Vermogen is energie per tijd: 1 kW is 1 kJ per seconde. Om 2 kg per seconde 10 °C op te warmen heb je 2 × 4,2 × 10 = 84 kW nodig.\n\nDoor energie om te rekenen naar vermogen zie je of een verwarmer, ketel of koelmachine groot genoeg is. De klassieke besparing is warmteterugwinning: een warme uitgaande stroom gebruiken om de koude ingaande voor te warmen.',
      ],
      example: {
        kind: 'worked',
        text: 'Een pasteur verwarmt 10.000 kg melk per uur (cp 3,9 kJ per kg per °C) van 4 naar 72 °C. Zonder terugwinning: 10.000 × 3,9 × 68 = 2.652.000 kJ per uur; gedeeld door 3.600 is dat ongeveer 737 kW, helemaal uit heet water of stoom.\n\nIn de praktijk gebruikt een regeneratiesectie de hete gepasteuriseerde melk om de koude melk voor te warmen, zeg van 4 naar 65 °C, en koelt tegelijk de uitgaande melk af. De verwarmer hoeft dan alleen nog van 65 naar 72 °C: 10.000 × 3,9 × 7 / 3.600 = ongeveer 76 kW. Warmteterugwinning scheelt zo’n 90% van de verwarming.',
      },
      said: 'Wat engineers zeggen: “Kijk niet eerst naar de verwarmer. Kijk naar de regeneratie. Vervuilt die, dan moet de verwarmer het werk doen.”',
      recall: [
        {
          q: 'Je verwarmt 500 kg water van 15 °C naar 75 °C. Reken met cp = 4,2 kJ per kg per °C en verwaarloos verliezen. Hoeveel energie kost dat, in kWh? (1 kWh = 3.600 kJ.)',
          number: 35,
          tolerance: 0.5,
          unit: 'kWh',
          why: '500 × 4,2 × 60 = 126.000 kJ; 126.000 / 3.600 = 35 kWh.',
        },
        {
          q: 'Een continue verwarmer warmt 3 kg product per seconde 20 °C op. Het product heeft een cp van 4,0 kJ per kg per °C. Verwaarloos verliezen. Welk vermogen heeft de verwarmer nodig, in kW?',
          number: 240,
          tolerance: 2,
          unit: 'kW',
          why: '3 × 4,0 × 20 = 240 kJ per seconde = 240 kW.',
        },
        {
          q: 'Waarom kost drogen door verdampen zoveel energie?',
          options: ['Drogers zijn slecht geïsoleerd', 'Water verdampen vraagt veel latente warmte per kg', 'Poeder heeft een hoge soortelijke warmte', 'De ventilatoren gebruiken het meeste'],
          answer: 'Water verdampen vraagt veel latente warmte per kg',
          why: 'Ongeveer 2.260 kJ per kg verdampt water, veel meer dan het opwarmen.',
        },
        {
          q: 'Een fabriek wil de verwarmingsenergie van een continue pasteur omlaag brengen. Welke maatregel bespaart meestal het meest?',
          options: ['Het temperatuursetpoint verhogen', 'Het hete uitgaande product gebruiken om het koude ingaande product voor te warmen', 'Een grotere pomp plaatsen', 'Een snellere temperatuursensor gebruiken'],
          answer: 'Het hete uitgaande product gebruiken om het koude ingaande product voor te warmen',
          why: 'Warmteterugwinning kan het grootste deel van de verwarming dekken, zoals in de regeneratiesectie van een pasteur.',
        },
      ],
      situation: {
        scene: 'Je zit bij een fabriek van zuivelingrediënten. De indamper kan het niet bijbenen en de engineeringmanager vraagt om een grotere ketel van €2 miljoen.',
        ask: 'Wat vraag je eerst?',
        model: 'Hoeveel stoom gebruikt de indamper per kg verdampt water, en hoe verhoudt dat zich tot het ontwerp en tot vorig jaar? Is hij vervuild, en hoe vaak wordt hij gereinigd? Gaat het condensaat terug naar de ketel? En kan er vóór de indamper meer water uit, met membranen, wat per kg veel minder energie kost dan wegkoken?',
        rubric: [
          'Vraagt naar stoomverbruik per kg verdampt water ten opzichte van het ontwerp',
          'Checkt vervuiling, reiniging en condensaatretour',
          'Brengt water mechanisch verwijderen vóór het indampen in',
        ],
      },
      sayIt: 'Leg een operationeel manager in 60 seconden uit waarom water verdampen zoveel meer energie kost dan het opwarmen.',
      terms: [
        { term: 'Voelbare warmte', def: 'Warmte die de temperatuur verandert: massa × soortelijke warmte × temperatuurverschil.' },
        { term: 'Latente warmte', def: 'Warmte die de fase verandert bij gelijke temperatuur; zo’n 2.260 kJ per kg om water te verdampen.' },
        { term: 'Soortelijke warmte (cp)', def: 'Energie om 1 kg 1 °C op te warmen; ongeveer 4,2 kJ voor water.' },
        { term: 'Warmteterugwinning', def: 'Een warme uitgaande stroom gebruiken om een koude ingaande op te warmen.' },
      ],
    },
    {
      id: 'eng.process.batch',
      title: 'Batchcycli en capaciteit',
      pre: [
        {
          q: 'De batchcyclus van een reactor: vullen 30 minuten, opwarmen 60, reageren 120, afkoelen 45, legen 15, reinigen 30. Welke besparing verhoogt de output per dag het meest?',
          options: ['20 minuten van het reageren af, want dat is de kernstap', '20 minuten van het reinigen af, want reinigen is verspilling', 'Elke 20 minuten die je ergens in de cyclus wint, levert hetzelfde op', 'Alleen winst op opwarmen telt'],
          answer: 'Elke 20 minuten die je ergens in de cyclus wint, levert hetzelfde op',
          why: 'De output hangt af van de totale cyclustijd; elke minuut telt even zwaar.',
        },
      ],
      teach: [
        'Een batchvat produceert in cycli. De cyclustijd is alles tussen twee starts: vullen, opwarmen, reageren of mengen, afkoelen, legen, reinigen, en het wachten op een operator, een labuitslag of een vrije tank verderop.\n\nCapaciteit per vat = batchgrootte / cyclustijd. Een cyclus van 5 uur met 4 ton geeft 0,8 ton per uur, zo’n 19 ton per dag als hij dag en nacht draait.',
        'Elke minuut in de cyclus telt even zwaar. Engineers willen graag de reactiestap korter maken, maar vullen, legen, reinigen en wachten op QC-vrijgave nemen vaak een derde van de cyclus in en zijn makkelijker in te korten: grotere pompen, voorverwarmde grondstoffen, stappen parallel, snellere labtests of een inline meting.',
        'Met meerdere vaten achter elkaar is de bottleneck de stap met de langste tijd per batch, als je de tijd van elke stap eerst deelt door het aantal parallelle vaten in die stap. Een reactor van 6 uur die een filter van 3 uur voedt, geeft één batch per 6 uur. Zet er een tweede reactor naast en de fabriek maakt elke 3 uur een batch, zolang het filter het bijhoudt.',
        'Recepten draaien vaak volgens een standaard die ISA-88 heet: een recept is een reeks fasen (doseren, opwarmen, aanhouden, overpompen) met instelwaarden, uitgevoerd door het besturingssysteem. Vraag om de batchrapporten: de echte tijd per fase over de laatste 50 batches. Het verschil tussen de snelste en de traagste batches is vaak de grootste capaciteitswinst op de hele locatie.',
      ],
      example: {
        kind: 'worked',
        text: 'Een mengvat voor verf maakt 3.000 kg per batch. Cyclus: vullen 40 minuten, dispergeren 90, wachten op het QC-monster 50, bijstellen 20, aftappen 60, reinigen 40: 300 minuten. Capaciteit: 3.000 kg / 5 uur = 600 kg per uur. Het wachten op QC duurt lang omdat het lab de hele locatie bedient.\n\nEen inline viscositeitsmeter plus een vast spoedmoment voor monsters brengt het wachten terug naar 15 minuten. Nieuwe cyclus: 265 minuten, dus 3.000 / 4,417 uur = 679 kg per uur: 13% meer uit hetzelfde vat, zonder aan het dispergeren te komen.',
      },
      said: 'Wat engineers zeggen: “De reactor is niet traag. Hij staat elke batch 50 minuten op het lab te wachten.”',
      recall: [
        {
          q: 'Een vat maakt batches van 6.000 kg. Eén volledige cyclus, van begin vullen tot het volgende begin vullen, duurt 4 uur. Het draait 24 uur per dag zonder onderbrekingen. Hoeveel kg maakt het per dag?',
          number: 36000,
          tolerance: 100,
          unit: 'kg/dag',
          why: '24 / 4 = 6 batches per dag × 6.000 kg = 36.000 kg.',
        },
        {
          q: 'Een vat maakt batches van 6.000 kg met een cyclus van 240 minuten. Het reinigen gaat van 60 naar 30 minuten en verder verandert er niks. Met hoeveel procent stijgt de output per dag?',
          number: 14.3,
          tolerance: 0.5,
          unit: '%',
          why: 'De cyclus gaat van 240 naar 210 minuten; 240 / 210 = 1,143, dus zo’n 14,3% meer batches per dag.',
        },
        {
          q: 'Twee stappen achter elkaar, zelfde batchgrootte: één reactor van 6 uur per batch, daarna één filter van 2,5 uur per batch. Er komt een tweede, identieke reactor bij; beide delen het filter. Hoe vaak verlaat er nu op z’n best een batch de fabriek?',
          options: ['Elke 2,5 uur', 'Elke 3 uur', 'Elke 6 uur', 'Elke 8,5 uur'],
          answer: 'Elke 3 uur',
          why: 'Twee reactoren geven één batch per 6 / 2 = 3 uur; het filter met 2,5 uur houdt dat bij, dus de reactorstap bepaalt nog steeds het tempo.',
        },
        {
          q: 'Wat is de beste eerste databron om verborgen capaciteit in een batchfabriek te vinden?',
          options: ['De typeplaatjes van de vaten', 'Batchrapporten met de echte fasetijden over veel batches', 'De oorspronkelijke ontwerpstudie', 'Het onderhoudsbudget'],
          answer: 'Batchrapporten met de echte fasetijden over veel batches',
          why: 'Die laten zien waar de tijd echt heen gaat en hoe ver de trage batches van de snelle af zitten.',
        },
      ],
      situation: {
        scene: 'Je zit bij een klant in de specialistische chemie. De locatie wil een derde reactor van €1,2 miljoen, omdat de twee bestaande reactoren “altijd vol zitten”.',
        ask: 'Wat vraag je voordat de investering naar de directie gaat?',
        model: 'Mogen we de batchrapporten van de afgelopen maanden zien, met de tijd per fase? Hoeveel van de cyclus is vullen, legen, reinigen en wachten op QC-vrijgave, en hoe groot is het verschil tussen de snelste en de traagste batches? Is de reactor echt de bottleneck, of houden filter, droger of afvullen de batches op? Minder wachten levert de extra capaciteit misschien voor een fractie van €1,2 miljoen.',
        rubric: [
          'Vraagt om echte fasetijden uit de batchrapporten',
          'Kijkt naar de tijd buiten de reactie: vullen, reinigen, wachten op vrijgave',
          'Checkt of een stap verderop de echte bottleneck is',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom een batchfabriek vaak capaciteit verstopt heeft in wacht- en reinigingstijd.',
      terms: [
        { term: 'Batchcyclustijd', def: 'Tijd van de ene batchstart tot de volgende op hetzelfde vat, wachten meegerekend.' },
        { term: 'Fase', def: 'Eén stap van een batchrecept, zoals doseren, opwarmen of overpompen (ISA-88-term).' },
        { term: 'CIP', def: 'Cleaning in place: tanks en leidingen reinigen zonder ze uit elkaar te halen.' },
        { term: 'QC-vrijgave', def: 'De goedkeuring van het lab die een batch nodig heeft voordat hij door mag.' },
      ],
    },
    {
      id: 'eng.process.scaleup',
      title: 'Van lab naar fabriek: opschalen',
      pre: [
        {
          q: 'Een geroerd vat wordt in elke maat twee keer zo groot gemaakt, met dezelfde vorm. Het volume wordt 8 keer zo groot. Hoeveel keer zo groot wordt het wandoppervlak, dat voor koeling wordt gebruikt?',
          options: ['2 keer', '4 keer', '8 keer', '16 keer'],
          answer: '4 keer',
          why: 'Oppervlak groeit met de maat in het kwadraat (2 × 2 = 4), volume met de maat tot de derde (2 × 2 × 2 = 8).',
        },
      ],
      teach: [
        'Een recept dat werkt in een glazen kolf van 2 liter gaat vaak mis in een reactor van 10 m³. Opschalen is de weg van lab via proeffabriek naar productie, en het gaat mis op wat niet evenredig meegroeit: warmteoverdracht, menging en tijd.',
        'Volume groeit met de maat tot de derde, oppervlak met de maat in het kwadraat. Maak een vat in elke maat tien keer groter en het volume wordt 1.000 keer zo groot, het wandoppervlak maar 100 keer: per kg product is er tien keer minder koeloppervlak.\n\nEen reactie die warmte afgeeft (exotherm) is in het lab makkelijk te beheersen en kan in de fabriek oververhitten. Fabrieken voegen koelspiralen of externe koelers toe, of doseren langzamer.',
        'Mengtijd groeit met de schaal. In een kolf is alles in een paar seconden gemengd; in een grote tank kan dat een minuut of langer duren.\n\nLoopt een reactie sneller dan de menging, dan krijg je plaatselijk hete plekken of een overmaat van een grondstof, en daarmee bijproducten. Waar je doseert, het type roerder en het toerental doen er in de fabriek meer toe dan in het lab.',
        'Opschalen gaat dus in stappen: lab, een proeffabriek (vaak 50 tot 500 liter), dan productie, met proefbatches en extra monsters bij elke stap. Handige vragen: “Wat is hier de traagste stap: de reactie, de warmteafvoer of de menging?” en “Wat is er veranderd tussen de proeffabriek en de fabriek?”',
      ],
      example: {
        kind: 'worked',
        text: 'Een reactie gaat van een labreactor van 10 liter naar een fabrieksreactor van 10 m³ met dezelfde vorm: volume × 1.000, dus elke maat × 10 en het wandoppervlak × 100. In het lab gaf een uur doseren 0,5 kW warmte, makkelijk af te voeren.\n\nStel dat de grondstof meteen reageert zodra hij erin gaat, zodat de warmteproductie het doseertempo volgt. In de fabriek geeft dezelfde doseertijd 1.000 × 0,5 = 500 kW. De mantel heeft 25 m² en voert bij vol koelwater hooguit 10 kW per m² af: 250 kW.\n\nTwee keer zo langzaam doseren, in 2 uur, halveert de warmteproductie naar 250 kW: precies de grens van de mantel, zonder marge. Dus doseert de fabriek in 2,5 uur of langer, met zo’n 200 kW. De batch duurt minstens anderhalf uur langer: een opschaalkost die in de capaciteitsplanning hoort.',
      },
      said: 'Wat engineers zeggen: “In het lab is menging hooguit de beperking. In de fabriek is het de warmte, dus de mantel bepaalt hoe snel we doseren.”',
      recall: [
        {
          q: 'Een vat wordt in elke maat 3 keer zo groot gemaakt, met dezelfde vorm. Met welke factor groeit het volume?',
          number: 27,
          tolerance: 0.1,
          unit: 'keer',
          why: 'Volume groeit met de maat tot de derde: 3 × 3 × 3 = 27.',
        },
        {
          q: 'Hetzelfde vat, in elke maat 3 keer zo groot: wat gebeurt er met het wandoppervlak per m³ volume?',
          options: ['Dat blijft gelijk', 'Dat wordt een derde', 'Dat verdrievoudigt', 'Dat wordt een negende'],
          answer: 'Dat wordt een derde',
          why: 'Oppervlak × 9, volume × 27: oppervlak per volume = 9 / 27 = een derde.',
        },
        {
          q: 'Waarom kan een reactie die warmte afgeeft in het lab prima lopen en in de fabriek oververhitten?',
          options: ['Grondstoffen in de fabriek zijn altijd slechter', 'Het koeloppervlak per kg product daalt als het vat groter wordt', 'Thermometers in de fabriek zijn minder nauwkeurig', 'Operators in de fabriek doseren sneller'],
          answer: 'Het koeloppervlak per kg product daalt als het vat groter wordt',
          why: 'De warmteproductie groeit met het volume, de koeling met het oppervlak; het gat wordt groter met de schaal.',
        },
        {
          q: 'In een grote tank loopt een reactie sneller dan de menging. Wat is het typische gevolg?',
          options: ['Een snellere, schonere reactie', 'Plaatselijk een overmaat van een grondstof en hete plekken, en dus meer bijproducten', 'Geen enkel effect', 'Minder energieverbruik'],
          answer: 'Plaatselijk een overmaat van een grondstof en hete plekken, en dus meer bijproducten',
          why: 'Waar de grondstof binnenkomt, reageert die al voordat hij is verdeeld.',
        },
      ],
      situation: {
        scene: 'Je zit bij een chemieklant die een nieuw product van de proeffabriek naar productie brengt. De eerste twee fabrieksbatches liepen warmer dan gepland en hebben twee keer zoveel bijproduct als de proefbatches.',
        ask: 'Wat vraag je de procesengineer?',
        model: 'Wat is er veranderd tussen proeffabriek en fabriek: de doseertijd, het doseerpunt, het type roerder en het toerental, de koelcapaciteit per kg? Is de doseersnelheid afgestemd op wat de mantel aan warmte kan afvoeren, of is die gelijk gehouden aan de proeffabriek? Waar is de temperatuur gemeten, en kunnen er hete plekken bij het doseerpunt zitten? Kunnen we de volgende batch langzamer doseren met extra monsters, om te zien of het bijproduct de temperatuur volgt?',
        rubric: [
          'Vraagt wat er tussen proeffabriek en fabriek is veranderd (doseren, mengen, koelen)',
          'Koppelt het oververhitten aan warmteafvoer die de warmteproductie niet bijhoudt',
          'Stelt een gecontroleerde proefbatch voor met langzamer doseren en extra monsters',
        ],
      },
      sayIt: 'Leg een commercieel manager in 60 seconden uit waarom je een labrecept niet gewoon met duizend kunt vermenigvuldigen.',
      terms: [
        { term: 'Opschalen', def: 'Een proces van lab via proeffabriek naar productieschaal brengen.' },
        { term: 'Proeffabriek (pilot plant)', def: 'Een kleine productieachtige installatie om een proces te testen vóór de volle schaal.' },
        { term: 'Exotherm', def: 'Een reactie die warmte afgeeft en gekoeld moet worden.' },
        { term: 'Oppervlak-volumeverhouding', def: 'Oppervlak per eenheid volume; die daalt naarmate apparatuur groter wordt.' },
      ],
    },
  ],
};

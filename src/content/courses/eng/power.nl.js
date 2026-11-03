// eng.power (NL): Motoren, aandrijvingen en perslucht: vermogen en energie, asynchrone motoren, aanlopen en regelen, perslucht, hydrauliek, energie in de fabriek.
export default {
  lessons: [
    {
      id: 'eng.power.basics',
      title: 'Vermogen, energie en draaistroom',
      pre: [
        {
          q: 'Een motor trekt 8 uur lang constant 15 kW elektrisch vermogen. Hoeveel energie heeft hij verbruikt?',
          options: ['15 kWh', '120 kWh', '1,9 kWh', '120 kW'],
          answer: '120 kWh',
          why: 'Energie = vermogen × tijd = 15 kW × 8 uur = 120 kWh.',
        },
      ],
      teach: [
        'Vermogen is hoe snel je energie verbruikt, in watt of kilowatt. Energie is vermogen × tijd, in kWh. Een motor die 8 uur 15 kW trekt, verbruikt 120 kWh.\n\nDe energierekening rekent in kWh; de netaansluiting en piekkosten gaan over kW. Die twee door elkaar halen is de meest gemaakte fout in energiegesprekken.',
        'Rendement is nuttige output gedeeld door input. Een motor met 93% rendement zet 93% van zijn elektrische input om in asvermogen; de rest wordt warmte. Verliezen vermenigvuldigen zich in een keten: motor 93%, tandwielkast 95%, pomp 70% geeft 0,93 × 0,95 × 0,70 = 62% van stopcontact tot water.',
        'De industrie draait op draaistroom: in Europa 400 V tussen de fasen bij 50 Hz (230 V tussen een fase en de nul). Het elektrisch vermogen van een driefasige belasting is √3 × spanning × stroom × arbeidsfactor. Een motor die 30 A trekt bij 400 V met een arbeidsfactor van 0,85 neemt zo’n 17,7 kW op.',
        'De arbeidsfactor (cos φ) zegt welk deel van de stroom nuttig werk doet. Licht belaste motoren hebben een lage arbeidsfactor en een lager rendement.\n\nOp het typeplaatje staat het nominaal vermogen, en dat is het mechanisch vermogen aan de as, niet de elektrische input, plus spanning, stroom, toerental, arbeidsfactor en rendementsklasse. Noemt iemand “kW”, vraag dan: asvermogen of opgenomen vermogen?',
      ],
      example: {
        kind: 'worked',
        text: 'Een koelwaterpomp moet 11 kW hydraulisch vermogen leveren zolang hij draait, 6.000 uur per jaar. De pomp haalt 70% rendement, de motor 92%.\n\nOpgenomen vermogen: 11 / (0,70 × 0,92) = 17,1 kW. Energie per jaar: 17,1 × 6.000 = 102.600 kWh. Bij €0,15 per kWh is dat zo’n €15.400 per jaar, waarschijnlijk meer dan de pomp heeft gekost.\n\nEen pomp met 80% in plaats van 70% zou 11 / (0,80 × 0,92) = 14,9 kW nodig hebben: zo’n 13.000 kWh en €2.000 per jaar minder. Rendement is een lopende kostenpost, geen detail op een datasheet.',
      },
      said: 'Wat engineers zeggen: “Het is een motor van vijftien kW, maar hij trekt er maar negen. Dat is negen kW, geen vijftien, en met een belabberde cos phi.”',
      recall: [
        {
          q: 'Een machine trekt 22 kW elektrisch vermogen zolang hij draait. Hij draait 4.000 uur per jaar op die belasting. Hoeveel energie verbruikt hij per jaar, in kWh?',
          number: 88000,
          tolerance: 100,
          unit: 'kWh/jaar',
          why: '22 kW × 4.000 uur = 88.000 kWh per jaar.',
        },
        {
          q: 'Een driefasemotor trekt 50 A bij 400 V met een arbeidsfactor van 0,8. Met P = √3 × U × I × cos φ (√3 ≈ 1,732): welk elektrisch vermogen neemt hij op, in kW?',
          number: 27.7,
          tolerance: 0.3,
          unit: 'kW',
          why: '1,732 × 400 × 50 × 0,8 = 27.713 W, ongeveer 27,7 kW.',
        },
        {
          q: 'Een aandrijfketen heeft een motor met 95% rendement en een tandwielkast met 90%. Wat is het totale rendement van de keten, in procent?',
          number: 85.5,
          tolerance: 0.5,
          unit: '%',
          why: '0,95 × 0,90 = 0,855, dus 85,5%.',
        },
        {
          q: 'Op het typeplaatje van een motor staat 30 kW. Wat betekent dat getal?',
          options: ['Het elektrisch vermogen dat hij altijd trekt', 'Het nominale mechanische vermogen aan de as', 'Het piekvermogen bij het aanlopen', 'Zijn jaarlijkse energieverbruik in kWh'],
          answer: 'Het nominale mechanische vermogen aan de as',
          why: 'Motoren worden opgegeven in asvermogen; het opgenomen elektrisch vermogen is hoger door de verliezen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een fabriek. In een energieoverleg zegt iemand: “Onze drie compressoren zijn elk 75 kW, dus 225 kW keer 8.760 uur: bijna 2 miljoen kWh per jaar.”',
        ask: 'Wat vraag je?',
        model: 'Is die 75 kW het asvermogen op het typeplaatje, of het gemeten opgenomen vermogen? Draaien alle drie het hele jaar, en op vollast? Compressoren gaan in last en uit last; het echte verbruik hangt af van de uren per belasting. Kunnen we twee weken een meter op de compressorruimte zetten? Dan weten we de echte kWh, en zien we ook de basislast in het weekend.',
        rubric: [
          'Scheidt het kW op het typeplaatje van het gemeten opgenomen vermogen',
          'Zet vraagtekens bij de uren en de aangenomen belasting',
          'Stelt voor de kWh over een periode te meten',
        ],
      },
      sayIt: 'Leg een controller in 60 seconden het verschil uit tussen kW en kWh, en waarom ze allebei op de rekening staan.',
      terms: [
        { term: 'kW en kWh', def: 'Vermogen (hoe snel je energie gebruikt) en energie (vermogen × tijd).' },
        { term: 'Rendement', def: 'Nuttige output gedeeld door input; verliezen in een keten vermenigvuldigen zich.' },
        { term: 'Arbeidsfactor (cos φ)', def: 'Het deel van de stroom dat nuttig werk doet.' },
        { term: 'Draaistroom', def: 'De industriële voeding: drie wisselspanningen, in Europa 400 V tussen de fasen bij 50 Hz.' },
      ],
    },
    {
      id: 'eng.power.motors',
      title: 'Asynchrone motoren',
      pre: [
        {
          q: 'Een 4-polige motor draait op het 50 Hz-net. Op het typeplaatje staat 1.460 toeren, niet 1.500. Waarom?',
          options: ['De motor is defect', 'Slip: de rotor draait altijd iets langzamer dan het magnetisch veld', 'De netfrequentie is te laag', 'Het typeplaatje is verkeerd afgerond'],
          answer: 'Slip: de rotor draait altijd iets langzamer dan het magnetisch veld',
          why: 'Een asynchrone motor heeft slip nodig om stroom in zijn rotor op te wekken en koppel te maken.',
        },
      ],
      teach: [
        'De driefasige asynchrone motor (ook kooiankermotor of inductiemotor) drijft de meeste pompen, ventilatoren, transportbanden en compressoren aan: robuust, goedkoop, weinig onderhoud. De statorwikkelingen maken een draaiend magnetisch veld; de rotor wordt daardoor meegesleept. Het toerental hangt af van de netfrequentie en het aantal polen.',
        'Synchroon toerental = 120 × frequentie / aantal polen. Bij 50 Hz: 2 polen geven 3.000 toeren, 4 polen 1.500, 6 polen 1.000.\n\nDe rotor draait altijd iets langzamer: de slip, meestal 1 tot 5%. Een 4-polige motor draait zo’n 1.450 tot 1.480 toeren, en meer belasting geeft iets meer slip.',
        'Koppel en vermogen hangen samen via het toerental: vermogen (kW) = koppel (Nm) × toerental (tpm) / 9.550. Een motor van 15 kW op 1.460 toeren levert zo’n 98 Nm. Een tandwielkast verlaagt het toerental en verhoogt het koppel met dezelfde verhouding, min zijn verliezen.',
        'Rendementsklassen lopen van IE1 tot IE5 (IEC 60034-30-1). EU-verordening 2019/1781 eist voor de meeste nieuwe motoren van 0,75 tot 1.000 kW minstens IE3 (sinds juli 2021), en IE4 voor de meeste motoren van 75 tot 200 kW (sinds juli 2023).\n\nDe meeste motorstoringen zitten in lagers en wikkelisolatie. Warmte sloopt isolatie: als vuistregel halveert elke 10 °C boven de toegestane temperatuur ruwweg de levensduur van de wikkeling. Vraag naar motortemperatuur, trillingen en hoe vaak hij aanloopt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een ventilatormotor: 4 polen, 50 Hz, 30 kW, typeplaatje 1.470 toeren. Slip = (1.500 − 1.470) / 1.500 = 2%. Nominaal koppel = 30 × 9.550 / 1.470 = 195 Nm.\n\nHet is een oude IE1-motor met zo’n 90% rendement, die 6.000 uur per jaar 25 kW asvermogen levert. Opgenomen vermogen: 25 / 0,90 = 27,8 kW. Een nieuwe IE3-motor met zo’n 93,6%: 25 / 0,936 = 26,7 kW.\n\nBesparing 1,1 kW × 6.000 uur = zo’n 6.400 kWh, €960 per jaar bij €0,15. De moeite waard als de oude motor kapotgaat; zelden een reden om een gezonde motor alleen daarvoor te vervangen.',
      },
      said: 'Wat engineers zeggen: “Dat is een vierpolige, dus 1.500 synchroon, 1.470 op het plaatje. Draait hij 1.420, dan is hij waarschijnlijk overbelast.”',
      recall: [
        {
          q: 'Een asynchrone motor heeft 6 polen en draait op een net van 50 Hz. Wat is zijn synchrone toerental, in toeren per minuut?',
          number: 1000,
          tolerance: 1,
          unit: 'tpm',
          why: '120 × 50 / 6 = 1.000 toeren per minuut.',
        },
        {
          q: 'Een 4-polige motor op 50 Hz (synchroon toerental 1.500) draait 1.440 toeren. Wat is zijn slip, in procent?',
          number: 4,
          tolerance: 0.1,
          unit: '%',
          why: '(1.500 − 1.440) / 1.500 = 0,04 = 4%.',
        },
        {
          q: 'Een motor levert 11 kW aan de as bij 1.450 toeren. Met vermogen (kW) = koppel (Nm) × toerental (tpm) / 9.550: welk koppel levert hij, in Nm?',
          number: 72.4,
          tolerance: 1,
          unit: 'Nm',
          why: 'Koppel = 11 × 9.550 / 1.450 = 72,4 Nm.',
        },
        {
          q: 'Een motor draait continu 10 °C warmer dan zijn isolatieklasse toestaat. Wat gebeurt er volgens de gangbare vuistregel met de levensduur van de wikkelisolatie?',
          options: ['Geen effect', 'Die halveert ruwweg', 'Die verdubbelt ruwweg', 'Die daalt met zo’n 10%'],
          answer: 'Die halveert ruwweg',
          why: 'De veroudering van isolatie verdubbelt ruwweg bij elke 10 °C hogere temperatuur.',
        },
      ],
      situation: {
        scene: 'Je zit bij een distributiecentrum. Na het versnellen van de lijn branden de transportbandmotoren om de paar maanden door. Onderhoud koopt steeds dezelfde motoren opnieuw.',
        ask: 'Wat vraag je?',
        model: 'Hoe zwaar zijn de motoren nu belast ten opzichte van hun nominale waarde: gemeten stroom tegen het typeplaatje? Is door het versnellen de overbrenging of de belasting per motor veranderd? Hoe warm worden ze, en starten en stoppen ze nu veel vaker? Elke start verwarmt een motor flink. Dezelfde motor, meer belasting en meer starts geeft dezelfde storing, alleen sneller.',
        rubric: [
          'Vraagt om gemeten stroom of belasting tegen het typeplaatje',
          'Koppelt de versnelling aan belasting, overbrenging en starts per uur',
          'Noemt de motortemperatuur als oorzaak van het falen',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit hoe het toerental van een asynchrone motor tot stand komt en waarom hij slipt.',
      terms: [
        { term: 'Asynchrone motor', def: 'De standaard driefasemotor; de rotor wordt meegesleept door een draaiend magnetisch veld.' },
        { term: 'Synchroon toerental', def: '120 × frequentie / aantal polen; 1.500 toeren bij 4 polen op 50 Hz.' },
        { term: 'Slip', def: 'Hoeveel langzamer de rotor draait dan het veld, meestal 1 tot 5%.' },
        { term: 'IE-klasse', def: 'Rendementsklasse van een motor van IE1 tot IE5; IE3 is in de EU het minimum voor de meeste nieuwe motoren.' },
      ],
    },
    {
      id: 'eng.power.drives',
      title: 'Motoren aanlopen en regelen',
      pre: [
        {
          q: 'Een motor wordt direct op het net geschakeld. Welke stroom trekt hij in de eerste momenten van het aanlopen?',
          options: ['Minder dan zijn nominale stroom', 'Ongeveer zijn nominale stroom', 'Ongeveer 6 tot 8 keer zijn nominale stroom', 'Ongeveer 100 keer zijn nominale stroom'],
          answer: 'Ongeveer 6 tot 8 keer zijn nominale stroom',
          why: 'Een stilstaande rotor gedraagt zich bijna als een kortgesloten transformator, tot hij op toeren komt.',
        },
      ],
      teach: [
        'Direct inschakelen (DOL, direct on line): de motor met een magneetschakelaar meteen op het net zetten. Simpel en goedkoop, maar de aanloopstroom is 6 tot 8 keer de nominale stroom, en het volle koppel klapt als een ruk op de mechaniek. Prima voor kleine motoren; bij grote kan het de spanning in de fabriek laten dippen en snaren, koppelingen en tandwielkasten slijten.',
        'Een softstarter laat de spanning in een paar seconden oplopen, en dat beperkt de aanloopstroom en de ruk. Het toerental tijdens bedrijf verandert er niet door.\n\nEen ster-driehoekschakeling is de oudere, goedkopere manier om de aanloopstroom te beperken, voor motoren die zonder veel belasting starten. Een softstarter geeft ook minder aanloopkoppel, dus een machine die zwaar belast moet starten kan blijven hangen.',
        'Een frequentieregelaar (VFD, omvormer) verandert de frequentie en daarmee het toerental, traploos. Hij laat de motor ook rustig aanlopen, met vol koppel vanaf een laag toerental.\n\nToepassingen: pomp- en ventilatortoerental afstemmen op de vraag, bandsnelheid, procesregeling. Bijwerkingen: harmonischen op het net, elektrische storing, en soms lagerschade; goede bekabeling en filters vangen dat op.',
        'Servomotoren en servoregelaars sturen positie en snelheid precies aan, met een encoder die de werkelijke positie terugmeldt: robots, pick-and-place, op lengte knippen, verpakkingsmachines. Het gaat ze om nauwkeurige beweging, niet om energiebesparing. Vraag wat de aandrijving moet doen: alleen aanlopen, op wisselende snelheid draaien, of tot op een tiende millimeter positioneren.',
      ],
      example: {
        kind: 'worked',
        text: 'Een brekermotor van 90 kW wordt direct ingeschakeld. Zijn nominale stroom is zo’n 160 A bij 400 V, dus bij de start trekt hij een paar seconden ruwweg 1.000 tot 1.300 A. Elke start laat de spanning in de fabriek dippen: lampen knipperen en twee frequentieregelaars elders vallen uit op onderspanning.\n\nEen softstarter zou de aanloopstroom terugbrengen naar zo’n 3 à 4 keer nominaal, maar de breker moet vaak vol materiaal starten, en met het lagere koppel van een softstarter kan hij blijven hangen. Een frequentieregelaar houdt de stroom rond nominaal en geeft vol koppel vanuit stilstand. Hier past het duurdere apparaat.',
      },
      said: 'Wat engineers zeggen: “Elke keer dat die breker direct inschakelt, dipt de hele hal. Een softstarter trekt hem vol niet, daar moet een regelaar op.”',
      recall: [
        {
          q: 'Een motor heeft een nominale stroom van 50 A. Bij direct inschakelen trekt hij bij de start 7 keer zijn nominale stroom. Wat is de aanloopstroom, in A?',
          number: 350,
          tolerance: 1,
          unit: 'A',
          why: '7 × 50 A = 350 A.',
        },
        {
          q: 'Met welk apparaat kun je een motor continu op een ander toerental laten draaien?',
          options: ['Een magneetschakelaar', 'Een softstarter', 'Een frequentieregelaar', 'Een ster-driehoekschakeling'],
          answer: 'Een frequentieregelaar',
          why: 'Alleen een frequentieregelaar verandert de voedingsfrequentie, en die bepaalt het toerental.',
        },
        {
          q: 'Een verpakkingsmachine moet een product vele keren per minuut op een exacte positie stoppen, tot op een tiende millimeter. Welke aandrijving past?',
          options: ['Een direct ingeschakelde motor', 'Een softstarter', 'Een servomotor met regelaar en positieterugmelding', 'Een ster-driehoekschakeling'],
          answer: 'Een servomotor met regelaar en positieterugmelding',
          why: 'Een servo regelt met een encoder de positie precies; de andere regelen de positie helemaal niet.',
        },
        {
          q: 'Een grote ventilator draait altijd op vol toerental. Als hij direct ingeschakeld wordt, dipt de spanning in de fabriek. Welk apparaat lost die dip het eenvoudigst en goedkoopst op?',
          options: ['Een softstarter', 'Een servoregelaar', 'Een grotere magneetschakelaar', 'Een grotere motor'],
          answer: 'Een softstarter',
          why: 'Een ventilator start met weinig belasting en heeft geen toerenregeling nodig, dus een softstarter beperkt de aanloopstroom tegen lage kosten.',
        },
      ],
      situation: {
        scene: 'Je zit bij een voedingsklant. Een machinebouwer stelt voor frequentieregelaars te zetten op alle 25 transportbandmotoren van een nieuwe lijn, “voor de flexibiliteit”, voor €40.000 extra op de offerte.',
        ask: 'Wat vraag je?',
        model: 'Welke banden moeten tijdens bedrijf echt van snelheid veranderen, bijvoorbeeld om de lijn te balanceren of voor verschillende producten, en welke draaien op één vaste snelheid? Voor de vaste kan direct inschakelen of een softstarter volstaan. Wat doen de harmonischen van 25 regelaars met onze voeding, en wie onderhoudt ze? Kan de offerte de regelaars per band als optie laten zien?',
        rubric: [
          'Vraagt welke banden echt een variabele snelheid nodig hebben',
          'Stelt eenvoudiger aanlopen voor bij banden met vaste snelheid',
          'Noemt bijwerkingen en onderhoud, en vraagt om een uitgesplitste optie',
        ],
      },
      sayIt: 'Leg een projectmanager in 60 seconden het verschil uit tussen een softstarter, een frequentieregelaar en een servoregelaar.',
      terms: [
        { term: 'Direct inschakelen (DOL)', def: 'Een motor meteen op het net zetten; 6 tot 8 keer de nominale stroom bij de start.' },
        { term: 'Softstarter', def: 'Laat de spanning oplopen om aanloopstroom en ruk te beperken; verandert het toerental niet.' },
        { term: 'Frequentieregelaar', def: 'Regelt het toerental door de frequentie te veranderen; ook VFD of omvormer.' },
        { term: 'Servoregelaar', def: 'Een aandrijving met positieterugmelding die positie en snelheid precies regelt.' },
      ],
    },
    {
      id: 'eng.power.air',
      title: 'Perslucht: de dure utility',
      pre: [
        {
          q: 'Welk deel van de elektrische energie die een compressor opneemt, komt ruwweg als nuttig werk terecht bij het persluchtgereedschap en de cilinders?',
          options: ['Zo’n 90%', 'Zo’n 50%', 'Zo’n 10%', 'Bijna alles'],
          answer: 'Zo’n 10%',
          why: 'Het meeste wordt warmte in de compressor; lekken en drukverliezen nemen nog meer weg.',
        },
      ],
      teach: [
        'Perslucht is schoon en handig, en daarom zit het overal: cilinders, blaaspistolen, gereedschap, ventielen. Het is ook de duurste manier om energie in een fabriek rond te brengen.\n\nHet grootste deel van de stroom van een compressor wordt warmte; maar zo’n 10% doet nuttig werk bij de gebruiker. De warmte van de compressor terugwinnen haalt daar een deel van terug. Onschuldig is het niet: blaas nooit perslucht op je huid of kleding.',
        'Lekken zijn het grote verlies. In fabrieken zonder lekprogramma ontsnapt vaak 20 tot 30% van wat de compressor levert via koppelingen, slangen en ventielen.\n\nLuister eens in het weekend: draaien de compressoren nog terwijl de productie stilligt, dan is dat vooral lekkage. Met ultrasone detectoren vind je ze; labelen en repareren is een klassieke snelle winst.',
        'Druk kost energie: elke bar extra opgewekte druk kost ruwweg 7% meer compressorenergie, en elk lek wordt er groter door. Veel fabrieken draaien op 7 of 8 bar omdat één machine dat nodig heeft. Los die machine lokaal op (een booster, een dikkere aanvoerleiding, een lokaal buffervat) en verlaag het hele net.',
        'Lucht moet schoon en droog zijn: water en olie beschadigen ventielen en cilinders. Na de compressor zitten een droger en filters; vóór elke machine een verzorgingseenheid (filter, regelaar, olienevelaar).\n\nOneigenlijk gebruik is het derde verlies: open blaaspijpjes, koelen met lucht, vacuüm maken met perslucht, terwijl een elektrische ventilator of pomp een fractie van de energie zou gebruiken.',
      ],
      example: {
        kind: 'worked',
        text: 'Een weekendtest: de productie ligt stil, niks zou lucht moeten gebruiken. De compressor van 75 kW, die in last 10 m³ lucht per minuut levert, draait 40% van de tijd in last. De lekkage is dus zo’n 40% × 10 = 4 m³ per minuut.\n\nLekken lopen het hele jaar door. Als we 75 kW nemen als wat hij in last opneemt: 75 kW × 40% × 8.760 uur = zo’n 263.000 kWh, ruwweg €39.000 per jaar bij €0,15 per kWh, en dan tellen we het vermogen in nullast nog niet eens mee.\n\nEen ronde lekken zoeken en repareren kost meestal een paar duizend euro. Zet daarna de druk 1 bar lager en bespaar nog eens ruwweg 7%.',
      },
      said: 'Wat engineers zeggen: “Zaterdag, alles stil, en de compressor zit nog veertig procent van de tijd in last. Dat is onze lekrekening.”',
      recall: [
        {
          q: 'Weekendtest: de productie ligt stil en niks zou lucht moeten gebruiken. De compressor levert in last 12 m³ per minuut en draait 25% van de tijd in last. Hoe groot is de gemiddelde lekkage, in m³ per minuut?',
          number: 3,
          tolerance: 0.1,
          unit: 'm³/min',
          why: '25% × 12 = 3 m³ per minuut, en dat lekt allemaal weg.',
        },
        {
          q: 'De netdruk gaat van 8 naar 6 bar. Reken met ruwweg 7% compressorenergie per bar. Hoeveel compressorenergie bespaar je ongeveer, in procent?',
          number: 14,
          tolerance: 1,
          unit: '%',
          why: '2 bar × 7% per bar = zo’n 14%.',
        },
        {
          q: 'Wat is het duidelijkste teken van een groot lekprobleem?',
          options: ['De compressor maakt veel lawaai', 'De compressoren blijven draaien als de productie stilligt', 'De lucht is nat', 'De druk is maandagochtend hoog'],
          answer: 'De compressoren blijven draaien als de productie stilligt',
          why: 'Zonder vraag gaat alle lucht die de compressoren nog leveren via lekken naar buiten.',
        },
        {
          q: 'Eén machine heeft 7,5 bar nodig; al het andere werkt op 6 bar. Het net draait op 8 bar. Wat is de beste aanpak?',
          options: ['8 bar houden voor de zekerheid', 'Die machine lokaal oplossen (booster of dikkere aanvoerleiding) en de netdruk verlagen', 'Het net naar 9 bar zetten', 'Een tweede compressor bijplaatsen'],
          answer: 'Die machine lokaal oplossen (booster of dikkere aanvoerleiding) en de netdruk verlagen',
          why: 'Eén veeleisende gebruiker hoort niet de druk, en de energiekosten, van de hele fabriek te bepalen.',
        },
      ],
      situation: {
        scene: 'Je zit bij een kunststoffabriek. Elke middag zakt de luchtdruk en vallen machines stil. De onderhoudsmanager wil een derde compressor kopen van €60.000.',
        ask: 'Wat vraag je?',
        model: 'Wat levert de compressorruimte in het weekend als de productie stilligt: hoeveel is lekkage? Wat gebruikt die extra lucht ’s middags: een ploeg met meer machines, blaaspistolen, schoonblazen met lucht? Zakt de druk al bij de compressoren of alleen aan het eind van het net? Dat laatste wijst op te dunne leidingen of verstopte filters. Een lekronde en een leidingcheck lossen het misschien op voor een fractie van €60.000.',
        rubric: [
          'Vraagt naar het lekniveau, bijvoorbeeld uit een weekendtest',
          'Vraagt wat de vraag ’s middags opdrijft en checkt oneigenlijk gebruik',
          'Scheidt een tekort aan aanbod van drukverlies in het net',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom perslucht zo duur is en waar je eerst kijkt.',
      terms: [
        { term: 'Lektest', def: 'De compressorbelasting meten terwijl de productie stilligt, om te schatten hoeveel lucht weglekt.' },
        { term: 'Verzorgingseenheid', def: 'Filter, regelaar en olienevelaar vóór een machine, voor schone lucht op de juiste druk.' },
        { term: 'Oneigenlijk gebruik', def: 'Perslucht gebruiken waar een goedkopere bron volstaat, zoals open blaaspijpjes of koelen met lucht.' },
      ],
    },
    {
      id: 'eng.power.hydraulics',
      title: 'Hydrauliek',
      pre: [
        {
          q: 'Een hydraulische cilinder heeft een zuigeroppervlak van 7.854 mm² (boring 100 mm) en werkt op 200 bar. 1 bar = 0,1 N/mm². Met welke kracht duwt hij ongeveer?',
          options: ['1,6 kN', '15,7 kN', '157 kN', '1.570 kN'],
          answer: '157 kN',
          why: '200 bar = 20 N/mm²; 20 × 7.854 = 157.080 N, ongeveer 157 kN.',
        },
      ],
      teach: [
        'Hydrauliek gebruikt olie onder hoge druk, meestal 100 tot 350 bar, om grote krachten te maken in een kleine ruimte: persen, spuitgietmachines, graafmachines, heftafels.\n\nKracht = druk × zuigeroppervlak. 1 bar is 0,1 N/mm², dus 200 bar op een zuiger van 100 mm (7.854 mm²) geeft zo’n 157 kN, het gewicht van 16 ton.',
        'Een hydraulische pomp (tandwiel, schoep of plunjer) maakt het debiet; de belasting maakt de druk. Ventielen sturen de olie: stuurventielen kiezen waar hij heen gaat, drukbegrenzingsventielen begrenzen de druk, smoorventielen bepalen de snelheid.\n\nCilindersnelheid = debiet / zuigeroppervlak. Accumulatoren slaan olie onder druk op voor snelle bewegingen.',
        'Vervuiling is de grootste vijand: de meeste hydraulische storingen zijn terug te voeren op vuil, water of lucht in de olie. Reinheid wordt uitgedrukt volgens ISO 4406 met drie getallen, zoals 18/16/13; lager is schoner. Goede praktijk: filters gekozen op een streefcode, afgesloten ontluchters, olieanalyse, en nooit bijvullen uit een open vat.',
        'Warmte is de tweede vijand. Elk drukverlies over een ventiel wordt warmte; olie die steeds boven zo’n 60 °C draait, veroudert snel en afdichtingen verharden.\n\nLekken zijn een veiligheidsrisico: een speldenprikstraal onder hoge druk kan olie onder de huid spuiten, dus voel nooit met je hand naar lekken, en behandel zo’n injectie altijd als medisch spoedgeval. Accumulatoren houden druk vast als de pomp stilstaat, dus een machine veilig stellen betekent ook die druk afblazen.',
      ],
      example: {
        kind: 'worked',
        text: 'Een perscilinder met een boring van 125 mm moet snel uitschuiven, gevoed door een pomp van 60 liter per minuut. Zuigeroppervlak: 3,14 / 4 × 125² = 12.272 mm² = 0,01227 m². Debiet: 60 liter per minuut = 0,001 m³ per seconde.\n\nVerwachte snelheid: 0,001 / 0,01227 = 0,081 m/s, zo’n 81 mm/s. Gemeten: 60 mm/s, en de olie is 70 °C. Een kwart van het debiet komt dus niet bij de cilinder aan.\n\nWaarschijnlijke oorzaken: een versleten pomp die inwendig lekt, of een drukbegrenzingsventiel dat te vroeg opent. Allebei maken ze van het verloren debiet warmte, en dat verklaart de hete olie.',
      },
      said: 'Wat engineers zeggen: “De cilinder is traag en de olie is heet. Dat debiet gaat ergens heen: versleten pomp of een overdrukventiel dat doorlaat.”',
      recall: [
        {
          q: 'Een cilinder heeft een zuigeroppervlak van 2.000 mm² en werkt op 150 bar. 1 bar = 0,1 N/mm². Welke kracht geeft hij, in kN?',
          number: 30,
          tolerance: 0.5,
          unit: 'kN',
          why: '150 bar = 15 N/mm²; 15 × 2.000 = 30.000 N = 30 kN.',
        },
        {
          q: 'Een cilinder heeft een zuigeroppervlak van 0,01 m². De pomp stuurt er 0,0005 m³ per seconde in, het hele debiet. Hoe snel beweegt de zuiger, in mm per seconde?',
          number: 50,
          tolerance: 1,
          unit: 'mm/s',
          why: 'Snelheid = debiet / oppervlak = 0,0005 / 0,01 = 0,05 m/s = 50 mm/s.',
        },
        {
          q: 'Wat bepaalt in een hydraulisch systeem de druk?',
          options: ['Alleen de grootte van de pomp', 'De belasting waar de cilinder tegen duwt, tot aan de instelling van het drukbegrenzingsventiel', 'Het volume van de olietank', 'De kleur van de olie'],
          answer: 'De belasting waar de cilinder tegen duwt, tot aan de instelling van het drukbegrenzingsventiel',
          why: 'De pomp maakt debiet; de druk loopt maar zo ver op als de belasting tegenhoudt, begrensd door het drukbegrenzingsventiel.',
        },
        {
          q: 'Een hydraulische machine heeft een accumulator. Voor onderhoud is de pomp uitgezet en vergrendeld. Wat moet er nog meer gebeuren?',
          options: ['Niks, het systeem is nu veilig', 'De druk in de accumulator afblazen', 'De hele olietank aftappen', 'De filters vervangen'],
          answer: 'De druk in de accumulator afblazen',
          why: 'Een accumulator houdt olie onder druk als de pomp stilstaat en kan delen laten bewegen of olie laten spuiten. Opgeheven lasten moet je ook ondersteunen of laten zakken.',
        },
      ],
      situation: {
        scene: 'Je zit bij een klant in de metaalvervorming. De hydraulische persen hebben om de paar maanden nieuwe ventielen nodig, en onderhoud is een duurder ventielmerk gaan kopen.',
        ask: 'Wat vraag je?',
        model: 'Hoe schoon is de olie: is er een streefcode volgens ISO 4406 en een olieanalyse? Hoe wordt er bijgevuld, en zijn de ontluchters afgesloten? Op welke temperatuur draait de olie? De meeste ventielstoringen komen door vuile of hete olie, dus een beter ventiel in vuile olie gaat op dezelfde manier stuk. Kunnen we een oliemonster laten analyseren en de filters checken voordat we meer ventielen kopen?',
        rubric: [
          'Vraagt om gegevens over oliereinheid en een streefcode',
          'Vraagt naar routes voor vervuiling: bijvullen, ontluchters, filters',
          'Noemt olietemperatuur en stelt een olieanalyse voor voordat er van merk wordt gewisseld',
        ],
      },
      sayIt: 'Leg een operationeel manager in 60 seconden uit hoe hydrauliek kracht maakt, en waar een hydraulisch systeem meestal aan doodgaat.',
      terms: [
        { term: 'Drukbegrenzingsventiel', def: 'Een ventiel dat de systeemdruk begrenst door boven een ingestelde waarde te openen.' },
        { term: 'Accumulator', def: 'Een vat dat olie onder druk opslaat; het blijft onder druk als de pomp stilstaat.' },
        { term: 'ISO 4406', def: 'De code voor oliereinheid, drie getallen zoals 18/16/13; lager is schoner.' },
        { term: 'Cilindersnelheid', def: 'Oliedebiet gedeeld door het zuigeroppervlak.' },
      ],
    },
    {
      id: 'eng.power.energy',
      title: 'Energie in de fabriek: basislast, pieken en kWh per product',
      pre: [
        {
          q: 'Een fabriek meet 900 kW tijdens productie en 350 kW op een zondag zonder enige productie. Wat laat die 350 kW vooral zien?',
          options: ['Een meetfout', 'Een basislast: deels nodig, deels installaties die draaien zonder iets te maken', 'Alleen het vermogen van de kantoorverlichting', 'De verliezen van de netbeheerder'],
          answer: 'Een basislast: deels nodig, deels installaties die draaien zonder iets te maken',
          why: 'Een deel van de basislast is nodig (koeling, IT, veiligheid); de rest zijn vaak compressoren, ventilatoren en machines die aan blijven staan.',
        },
      ],
      teach: [
        'Begin met het belastingprofiel: het elektriciteitsverbruik per kwartier over een paar weken, uit de slimme meter van de netbeheerder of de eigen meters. Drie dingen springen eruit: de basislast als er niks gemaakt wordt, de pieken, en hoe het verbruik met de output meebeweegt.\n\nDe basislast is vaak verrassend hoog, en een deel ervan is te vermijden: compressoren die lekken voeden, afzuiging, verwarming en machines die stationair draaien.',
        'Energie (kWh) en piekvermogen (kW) worden apart betaald. In Nederland betalen grotere aansluitingen de netbeheerder voor het gecontracteerd transportvermogen in kW en voor de maandpiek.\n\nMet netcongestie is extra kW soms jarenlang gewoon niet beschikbaar. Gespreid opstarten, een batterij of grote verbruikers om beurten schakelen kan een fabriek binnen haar gecontracteerd vermogen houden.',
        'Meet energie per product: kWh per ton, per stuk of per m³. Dan wordt energie van overhead een procesgetal waar teams op kunnen sturen. Vergelijk ploegen, producten en lijnen; het verschil tussen de beste en de slechtste runs laat meestal de eerste besparingen zien.',
        'De gebruikelijke volgorde: uitzetten wat niet nodig is (stationair draaien, weekenden), lekken en verliezen oplossen (perslucht, stoom), terugschroeven wat te hoog staat (druk, temperatuur, toerental), warmte terugwinnen, en pas dan nieuwe installaties kopen. Warmte elektrificeren met warmtepompen of elektrische ketels is hét transitieonderwerp, maar het vraagt kW die het net misschien niet heeft.',
      ],
      example: {
        kind: 'worked',
        text: 'Een fabriek trekt 1.200 kW tijdens productie, twee ploegen, vijf dagen per week: 80 uur. De andere 88 uur van de week trekt ze 400 kW zonder iets te maken. Per week: 1.200 × 80 = 96.000 kWh in productie-uren en 400 × 88 = 35.200 kWh zonder productie, dus 27% van alle energie gaat op terwijl er niks gemaakt wordt.\n\nEen nachtelijke ronde vindt compressoren, afzuiging en twee ovens op stand-by. Als de helft van die 400 kW uit kan: 200 × 88 × 50 weken = 880.000 kWh, zo’n €132.000 per jaar bij €0,15, zonder enige investering.',
      },
      said: 'Wat engineers zeggen: “Voordat we het over een warmtepomp hebben: kijk eens naar zondag. Vierhonderd kW en niemand in het gebouw.”',
      recall: [
        {
          q: 'Een fabriek trekt 100 uur per week zonder productie een constante basislast van 300 kW. Hoeveel energie kost dat per week, in kWh?',
          number: 30000,
          tolerance: 10,
          unit: 'kWh/week',
          why: '300 kW × 100 uur = 30.000 kWh per week.',
        },
        {
          q: 'Een lijn verbruikt in één week 45.000 kWh en maakt die week 300 ton product. Wat is het energieverbruik per ton, in kWh per ton?',
          number: 150,
          tolerance: 1,
          unit: 'kWh/t',
          why: '45.000 / 300 = 150 kWh per ton.',
        },
        {
          q: 'Een Nederlandse fabriek in een gebied met netcongestie wil een grote elektrische ketel plaatsen. Wat is de eerste vraag?',
          options: ['Welk merk het zuinigst is', 'Past het binnen het gecontracteerd transportvermogen in kW, of kan hij draaien als het net ruimte heeft', 'Hoeveel kWh hij per jaar verbruikt', 'Welke leverancier het snelst kan leveren'],
          answer: 'Past het binnen het gecontracteerd transportvermogen in kW, of kan hij draaien als het net ruimte heeft',
          why: 'Bij congestie is de grens het vermogen in kW op de aansluiting, niet de energieprijs.',
        },
        {
          q: 'Wat is de gebruikelijke volgorde om energie in een fabriek aan te pakken?',
          options: ['Eerst nieuwe zuinige installaties kopen', 'Eerst uitzetten en verliezen oplossen, dan terugschroeven, warmte terugwinnen, en pas dan investeren', 'Beginnen met zonnepanelen', 'Eén keer per jaar meten'],
          answer: 'Eerst uitzetten en verliezen oplossen, dan terugschroeven, warmte terugwinnen, en pas dan investeren',
          why: 'De goedkope maatregelen verkleinen de vraag, zodat een latere investering kleiner kan.',
        },
      ],
      situation: {
        scene: 'Je zit bij een voedingsklant. Ze willen hun gasketel vervangen door een warmtepomp van 2 MW om CO₂ te besparen. De netbeheerder zegt dat er tot 2030 geen extra transportvermogen beschikbaar is.',
        ask: 'Wat vraag je?',
        model: 'Wat is ons huidige gecontracteerd vermogen en hoe dicht zit onze echte piek daaronder: is er ruimte als we pieken afvlakken of verbruik verschuiven? Hoeveel warmte hebben we echt nodig na het oplossen van verliezen en het terugwinnen van warmte uit koelmachines en compressoren? Kan een kleinere warmtepomp met warmteopslag draaien als het net ruimte heeft, met de gasketel als back-up? En heeft de netbeheerder een flexibel of tijdgebonden contract aangeboden?',
        rubric: [
          'Vraagt naar het gecontracteerd vermogen tegenover het echte piekprofiel',
          'Verkleint eerst de warmtevraag: verliezen en warmteterugwinning',
          'Verkent flexibele opties: kleinere installatie, opslag, flexibel netcontract',
        ],
      },
      sayIt: 'Leg een plantmanager in 60 seconden uit waarom een belastingprofiel de eerste stap is in elk energieproject.',
      terms: [
        { term: 'Belastingprofiel', def: 'Het vermogen door de tijd, meestal per kwartier, met basislast en pieken.' },
        { term: 'Basislast', def: 'Het vermogen dat wordt opgenomen als er niks wordt gemaakt.' },
        { term: 'Gecontracteerd transportvermogen', def: 'Het maximale vermogen in kW dat de netbeheerder voor een aansluiting heeft afgesproken te transporteren.' },
        { term: 'Energie-intensiteit', def: 'Energie per eenheid product, zoals kWh per ton.' },
      ],
    },
  ],
};

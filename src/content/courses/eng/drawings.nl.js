// eng.drawings (NL): Tekeningen en regeling: aanzichten, vorm- en plaatstoleranties, P&ID’s, regelkringen, PID-regeling, PLC en veiligheid.
export default {
  lessons: [
    {
      id: 'eng.drawings.views',
      title: 'Een technische tekening lezen',
      pre: [
        {
          q: 'Je pakt een tekening bij een machine. Waar kijk je eerst om te weten of het de geldige is?',
          options: ['Het grootste aanzicht', 'De maat met de nauwste tolerantie', 'De revisie in de stempel', 'De notities aan de linkerkant'],
          answer: 'De revisie in de stempel',
          why: 'De meeste afkeur door tekeningen komt doordat iemand werkt met een oude revisie.',
        },
      ],
      teach: [
        'Een onderdeel staat getekend in aanzichten: vooraanzicht, bovenaanzicht en zijaanzicht, elk vanuit één richting. Europa gebruikt de Europese projectie (first angle), de VS de Amerikaanse (third angle). Een klein kegelsymbool in de stempel zegt welke. Haal je ze door elkaar, dan spiegel je het onderdeel: in de Europese projectie staat het bovenaanzicht ónder het vooraanzicht, in de Amerikaanse erboven.',
        'Een doorsnede laat de binnenkant zien: een denkbeeldige snede langs een lijn A-A met pijlen; arcering markeert het doorgesneden materiaal. Een detail vergroot een klein stuk, bijvoorbeeld “Detail B, schaal 5:1”. Een isometrisch aanzicht is alleen voor de oriëntatie; daar haal je nooit maten uit.',
        'Schaal 1:2 betekent op halve grootte getekend, 2:1 op dubbele grootte. Meet nooit met een liniaal op een print: papier rekt en prints worden geschaald. Gebruik de maten. Op veel tekeningen staat het er gewoon op: “niet schalen”.',
        'De stempel (titelhoek) rechtsonder is waar je begint: tekeningnummer, benaming, materiaal, schaal, projectiesymbool, algemene toleranties (bijvoorbeeld ISO 2768-mK), getekend, gecontroleerd en vrijgegeven door, en de revisieletter. De revisietabel laat zien wat er per revisie veranderd is, en wanneer.',
      ],
      example: {
        kind: 'worked',
        text: 'Tekening 4711-203, beugel, staal S235, schaal 1:1, ISO 2768-m, revisie C. De revisietabel: rev B (maart 2024) veranderde gat Ø8,5 in Ø9; rev C (januari 2025) veranderde de buigradius van R2 naar R3. Bij de kantbank werkt de insteller met een geprinte rev B in een plastic hoesje. Resultaat: 400 beugels met R2, afgekeurd bij de klant. De oplossing is niet “beter opletten”: het zijn tekeningen op een scherm bij de machine, rechtstreeks uit het PDM-systeem, zodat alleen de actuele revisie op de vloer bestaat.',
      },
      said: 'Wat engineers zeggen: “Met welke revisie werk je? Want die R3 kwam met rev C, en op die print staat B.”',
      recall: [
        {
          q: 'Een tekening heeft schaal 1:5. Een lijn op papier meet 40 mm. Hoe lang is het echte onderdeel, in mm, als de print op schaal is?',
          number: 200,
          tolerance: 0.5,
          unit: 'mm',
          why: '1:5 betekent dat de tekening een vijfde van het echte formaat is: 40 × 5 = 200 mm. In de praktijk lees je gewoon de maat af.',
        },
        {
          q: 'Wat betekent arcering in een aanzicht?',
          options: ['Het oppervlak moet gelakt worden', 'Materiaal dat in een doorsnede is doorgesneden', 'Een gelast gebied', 'Een verborgen rand'],
          answer: 'Materiaal dat in een doorsnede is doorgesneden',
          why: 'Arcering toont het massieve materiaal waar de denkbeeldige snede doorheen gaat.',
        },
        {
          q: 'Hoe weet je of een tekening de Europese of de Amerikaanse projectie gebruikt?',
          options: ['Aan het projectiesymbool in de stempel', 'Aan het land van de klant', 'Aan de schaal', 'Aan het aantal aanzichten'],
          answer: 'Aan het projectiesymbool in de stempel',
          why: 'Het kegelsymbool geeft de methode aan; ga er nooit van uit.',
        },
        {
          q: 'Er staat geen tolerantie bij een maat op de tekening. Waar vind je wat er geldt?',
          options: ['In de revisietabel', 'In het isometrische aanzicht', 'In de materiaalspecificatie', 'Bij de algemene tolerantie in de stempel'],
          answer: 'Bij de algemene tolerantie in de stempel',
          why: 'De stempel noemt de algemene tolerantie, bijvoorbeeld ISO 2768-m.',
        },
      ],
      situation: {
        scene: 'Je bent bij een plaatbewerker na een klacht van de klant. De productiemanager zegt: “We hebben het precies volgens tekening gemaakt. Hun tekening klopt niet.”',
        ask: 'Wat vraag je eerst?',
        model: 'Met welk tekeningnummer en welke revisie hebben we gewerkt, en op welke revisie heeft de klant besteld? Kunnen we samen de revisietabel bekijken? Als die niet overeenkomen, is de volgende vraag hoe er een oude print bij de machine terecht is gekomen, en niet wiens schuld het is.',
        rubric: [
          'Vraagt aan beide kanten naar tekeningnummer en revisie',
          'Kijkt in de revisietabel in plaats van in discussie te gaan',
          'Kijkt naar het systeem voor documentbeheer, niet naar schuld',
        ],
      },
      sayIt: 'Leg een nieuwe operator in 60 seconden uit hoe hij controleert of een tekening de juiste is en waar hij de belangrijkste informatie vindt.',
      terms: [
        { term: 'Doorsnede', def: 'Aanzicht van een denkbeeldige snede door het onderdeel, met arcering op het doorgesneden materiaal.' },
        { term: 'Stempel', def: 'Vak rechtsonder met tekeningnummer, materiaal, schaal, toleranties en revisie.' },
        { term: 'Revisie', def: 'De versie van een tekening; elke wijziging krijgt een nieuwe letter en een regel in de tabel.' },
        { term: 'Europese projectie', def: 'First-angle-indeling; het bovenaanzicht staat onder het vooraanzicht.' },
      ],
    },
    {
      id: 'eng.drawings.gdt',
      title: 'Toleranties op tekening en GD&T',
      pre: [
        {
          q: 'Een gat heeft een positietolerantie van Ø0,2 ten opzichte van referenties A, B en C. Welke vorm heeft de zone waarin het hart moet vallen?',
          options: ['Een vierkant van 0,2 × 0,2', 'Een cirkel van Ø0,2', 'Een lijn van 0,2 lang', 'Een rechthoek van 0,1 × 0,2'],
          answer: 'Een cirkel van Ø0,2',
          why: 'Positiezones zijn rond, en dat past bij hoe een bout echt in een gat valt.',
        },
      ],
      teach: [
        'Een ±-tolerantie bepaalt de maat. Niet de vorm (vlak, rond, recht), en ook niet waar kenmerken ten opzichte van elkaar zitten. GD&T (vorm- en plaatstoleranties; ISO GPS in Europa, ASME Y14.5 in de VS) voegt dat toe, in een tolerantiekader: een vakje met een symbool, een tolerantie en de referenties waar het naar verwijst.',
        'Referenties (datums) A, B en C zijn de vlakken waar het onderdeel op gepositioneerd wordt, aangeduid met een driehoekje. Denk aan de hoek van een kamer. Primair A: het onderdeel ligt erop (drie punten). Secundair B: het wordt ertegenaan geduwd (twee punten). Tertiair C: één punt. De volgorde telt, want zo zit het onderdeel in de opspanning en op de 3D-meetmachine.',
        'De symbolen in gewone taal. Vlakheid: het vlak ligt tussen twee vlakken die 0,05 uit elkaar liggen. Haaksheid: haaks op een referentie. Evenwijdigheid: evenwijdig aan een referentie. Positie: het hart van een gat binnen een ronde zone rond de exacte plek. Slag (runout): hoeveel een vlak slingert als het onderdeel om zijn as draait. Profiel: een vlak binnen een band rond de ideale vorm.',
        'Maten in een kader zijn theoretisch exacte maten: zonder ±; de tolerantie staat in het tolerantiekader. Een ronde zone die precies om een vierkant van ±0,1 past (Ø0,28), heeft 57% meer oppervlak, dus meer delen die passen worden goedgekeurd. Een Ⓜ in het kader betekent maximum-materiaalvoorwaarde (MMC): het gat krijgt bonustolerantie naarmate het groter gemeten wordt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een plaat heeft vier gaten Ø10,2 +0,1/0 voor M10-bouten, positie Ø0,3 Ⓜ ten opzichte van A B C. A is het ondervlak, B de lange zijkant, C de korte zijkant. Eén gat staat theoretisch exact op 25 van B en 40 van C. De 3D-meetmachine meet het hart 0,12 ernaast in X en 0,09 in Y. Afstand = √(0,12² + 0,09²) = 0,15, dus als diameter 0,30: precies op de grens. Maar het gat meet Ø10,25, 0,05 boven de kleinste maat, dus met Ⓜ krijgt het 0,05 bonus: toegestaan 0,35. Het onderdeel is goed.',
      },
      said: 'Wat engineers zeggen: “Positie is nul-komma-drie op MMC naar A-B-C. Heb je vanaf de referenties gemeten, of vanaf de kant waar je toevallig tegenaan spande?”',
      recall: [
        {
          q: 'Het hart van een gat zit 0,06 mm naast de exacte positie in X en 0,08 mm in Y. Wat is de positieafwijking als diameter, in mm?',
          number: 0.2,
          tolerance: 0.005,
          unit: 'mm',
          why: '√(0,06² + 0,08²) = 0,10; als diameter is dat 2 × 0,10 = 0,20 mm.',
        },
        {
          q: 'Wat is referentie A in een kader met A B C?',
          options: ['Het nauwst getolereerde kenmerk', 'De primaire referentie waar het onderdeel eerst op gepositioneerd wordt', 'Het kenmerk dat getolereerd wordt', 'Het laatst bewerkte vlak'],
          answer: 'De primaire referentie waar het onderdeel eerst op gepositioneerd wordt',
          why: 'De volgorde van de referenties is de volgorde waarin het onderdeel gepositioneerd wordt.',
        },
        {
          q: 'Een maat staat in een kader, zonder ± erbij. Wat betekent dat?',
          options: ['Het is alleen een referentiemaat', 'Het is een theoretisch exacte maat, met de tolerantie in een tolerantiekader', 'Er is geen tolerantie nodig', 'Hij moet 100% gecontroleerd worden'],
          answer: 'Het is een theoretisch exacte maat, met de tolerantie in een tolerantiekader',
          why: 'Theoretisch exacte maten leggen de ideale positie of vorm vast; het kader geeft de tolerantie.',
        },
        {
          q: 'Welke van deze toleranties heeft meestal geen referentie nodig?',
          options: ['Positie', 'Haaksheid', 'Evenwijdigheid', 'Vlakheid'],
          answer: 'Vlakheid',
          why: 'Vlakheid vergelijkt een vlak alleen met zichzelf; de andere verwijzen naar een referentie.',
        },
      ],
      situation: {
        scene: 'Je bent bij een verspaner. Hun klant heeft een partij afgekeurd op gatpositie. De kwaliteitsengineer van de leverancier zegt: “Met onze schuifmaat is het goed, hun meetmachine zit ernaast.”',
        ask: 'Wat vraag je?',
        model: 'Hoe hebben jullie de positie gemeten: vanaf referenties A, B en C in die volgorde, zoals het kader zegt, of vanaf de kanten die makkelijk bereikbaar waren met de schuifmaat? Als de referenties verschillen, kunnen beide metingen kloppen en toch niet overeenkomen. Kunnen we twee delen meten zoals de klant dat doet, het liefst op een meetmachine met dezelfde uitlijning?',
        rubric: [
          'Vraagt hoe het onderdeel op de referenties is uitgelijnd',
          'Legt uit dat andere referenties andere uitkomsten geven',
          'Stelt voor een paar delen op de manier van de klant te meten',
        ],
      },
      sayIt: 'Leg een inkoper in 60 seconden uit wat referenties en een positietolerantie zijn, en waarom je die niet met een schuifmaat controleert.',
      terms: [
        { term: 'Referentie (datum)', def: 'Een vlak of kenmerk waarop het onderdeel gepositioneerd wordt, aangeduid met A, B, C.' },
        { term: 'Tolerantiekader', def: 'Vakje met een GD&T-symbool, een tolerantie en de referenties.' },
        { term: 'Positietolerantie', def: 'Ronde zone rond de exacte plek waarbinnen het hart van een kenmerk moet liggen.' },
        { term: 'Theoretisch exacte maat', def: 'Maat in een kader zonder ±; de tolerantie staat in een tolerantiekader.' },
      ],
    },
    {
      id: 'eng.drawings.pid',
      title: 'Een P&ID lezen',
      pre: [
        {
          q: 'Een instrumentbolletje op een P&ID zegt “PT 101”. Wat is het?',
          options: ['Pomp 101', 'T-stuk 101', 'Druktransmitter in kring 101', 'Temperatuurvoeler op leiding 101'],
          answer: 'Druktransmitter in kring 101',
          why: 'De eerste letter is de gemeten grootheid (P, druk); de volgende letters de functie (T, transmitter); het nummer is de kring.',
        },
      ],
      teach: [
        'Een P&ID (piping and instrumentation diagram) is een schema van leidingen, apparatuur, appendages en instrumenten in een procesinstallatie: voeding, chemie, water, energie. Het is niet op schaal en laat de echte routing niet zien. Het laat zien wat met wat verbonden is, en hoe het gemeten en geregeld wordt. Een wijziging in de installatie begint met een bijgewerkte P&ID.',
        'Lijnen: een dikke doorgetrokken lijn is procesleiding, met een leidingnummer zoals DN150-CW-1203 (maat, medium, nummer). Een stippellijn is een elektrisch signaal. Een lijn met dubbele schuine streepjes is pneumatisch. Pijlen geven de stroomrichting. Apparatuur heeft eigen tags: P-101 een pomp, T-101 een tank, E-101 een warmtewisselaar.',
        'Afsluiters worden getekend als een strikje. Zwart ingevuld: normaal dicht. Een strikje met een koepeltje erop is een regelklep met pneumatische aandrijving. Een terugslagklep laat maar één kant op door. Een PSV is een veiligheidsklep, de laatste verdediging tegen overdruk.',
        'Instrumenttags volgen ISA 5.1. Eerste letter: wat je meet: F flow (debiet), P druk, T temperatuur, L niveau. Volgende letters: wat het doet: I aanwijzen, T transmitter, C regelen, A alarm, S schakelaar, V klep. FT 201 is een flowtransmitter; TIC 305 een temperatuurregelaar met aanwijzing; LAH een hoog-niveaualarm. Een los rondje zit in het veld; een rondje in een vierkant staat op het scherm van het DCS, het centrale besturingssysteem van de fabriek.',
      ],
      example: {
        kind: 'worked',
        text: 'Tank T-101 bevat 20 m³. Op de zijkant zit LT 101, een niveautransmitter. Een stippellijn loopt naar LIC 101, een rondje in een vierkant: de niveauregelaar in het DCS. Nog een stippellijn loopt naar LV 101, een regelklep in de uitlaat. Lezing: de regelaar houdt het niveau op setpoint door de uitlaat open of dicht te sturen. LAH 101 waarschuwt de operator bij 80%, dus 16 m³. Los daarvan is LSHH 102, een hoog-hoogschakelaar op 95%, bedraad om inlaatklep XV 103 te sluiten: een onafhankelijke veiligheidsfunctie, geen onderdeel van de normale regeling.',
      },
      said: 'Wat engineers zeggen: “LIC honderdeen knijpt de uitlaat, maar de hoog-hoog op honderdtwee trapt XV honderddrie dicht. Haal de regelkring en de beveiliging niet door elkaar.”',
      recall: [
        {
          q: 'Een tank van 20 m³ heeft zijn hoog-niveaualarm (LAH) op 80%. Bij welk volume gaat het alarm af, in m³?',
          number: 16,
          tolerance: 0.1,
          unit: 'm³',
          why: '0,8 × 20 = 16 m³.',
        },
        {
          q: 'Wat is een TIC?',
          options: ['Een temperatuurregelaar met aanwijzing', 'Een timer in de controlekamer', 'Een temperatuurschakelaar', 'Een testaansluiting voor instrumenten'],
          answer: 'Een temperatuurregelaar met aanwijzing',
          why: 'T voor temperatuur, I voor aanwijzen (indicate), C voor regelen (control).',
        },
        {
          q: 'Wat laat een stippellijn tussen instrumenten op een P&ID meestal zien?',
          options: ['Een koelwaterleiding', 'Een toekomstige leiding', 'Een elektrisch signaal', 'Een afvoerleiding'],
          answer: 'Een elektrisch signaal',
          why: 'Gestippeld is elektrisch; dubbele schuine streepjes is pneumatisch; doorgetrokken is procesleiding.',
        },
        {
          q: 'Waar staat LSHH voor?',
          options: ['Level sensor, high heat', 'Niveauschakelaar hoog-hoog', 'Stoomleiding, hoge opvoerhoogte', 'Laag setpoint, hoog vasthouden'],
          answer: 'Niveauschakelaar hoog-hoog',
          why: 'L niveau, S schakelaar, HH het tweede, hogere alarmpunt, meestal een uitschakeling.',
        },
      ],
      situation: {
        scene: 'Je zit in een projectoverleg bij een zuivelfabriek. Een procesengineer heeft de P&ID op tafel en stelt voor een handbediende bypassklep rond een regelklep weg te halen, “want niemand gebruikt hem”.',
        ask: 'Wat vraag je voordat de wijziging doorgaat?',
        model: 'Is deze P&ID as-built, klopt hij met wat er vandaag echt in de fabriek staat? Wat gebeurt er als de regelklep faalt of onderhoud nodig heeft: is die bypass hoe ze dan blijven draaien? En zit er in deze kring iets wat onderdeel is van een veiligheidsfunctie of interlock, zodat dit via een formele wijzigingsprocedure moet?',
        rubric: [
          'Vraagt of de P&ID actueel is (as-built)',
          'Vraagt waar de bypass voor is bij storing of onderhoud',
          'Vraagt naar veiligheidsfuncties en de wijzigingsprocedure',
        ],
      },
      sayIt: 'Leg een collega in 60 seconden uit hoe je een instrumenttag als FIC 201 op een P&ID leest.',
      terms: [
        { term: 'P&ID', def: 'Piping and instrumentation diagram: wat met wat verbonden is en hoe het geregeld wordt.' },
        { term: 'Tagnummer', def: 'Code zoals PT 101: gemeten grootheid, functie, kringnummer.' },
        { term: 'Transmitter', def: 'Instrument dat meet en een signaal, meestal 4–20 mA, naar het besturingssysteem stuurt.' },
        { term: 'Regelklep', def: 'Klep met een aandrijving die een regelaar open en dicht stuurt om het proces bij te sturen.' },
      ],
    },
    {
      id: 'eng.drawings.loop',
      title: 'De regelkring',
      pre: [
        {
          q: 'Een vaatwasser draait een vast programma van 90 minuten zonder te meten hoe schoon de vaat is. Wat voor regeling is dat?',
          options: ['Gesloten regelkring', 'Open sturing', 'Cascaderegeling', 'PID-regeling'],
          answer: 'Open sturing',
          why: 'Niets meet het resultaat, dus niets corrigeert als de vaat viezer is dan normaal.',
        },
      ],
      teach: [
        'Elke regelkring heeft vier delen. Een sensor meet de proceswaarde (PV), zeg 72,4 °C. De regelaar vergelijkt die met het setpoint (SP), zeg 75 °C, en berekent de regelafwijking: 2,6 °C. Een actuator, bijvoorbeeld een stoomklep, verandert het proces: dat is de uitgang van de regelaar (OP), 0 tot 100%. En het proces reageert, met enige vertraging.',
        'Gesloten regelkring betekent terugkoppeling: meten, vergelijken, corrigeren, en weer opnieuw, vele keren per seconde. Open sturing betekent dat het resultaat niet gemeten wordt: een timer, een vaste klepstand, een recept dat zegt “10 minuten verwarmen”. Open sturing kan niet corrigeren voor verstoringen zoals kouder product of lagere stoomdruk.',
        'Elk regelaarvenster toont drie getallen: SP, PV en OP. Samen vertellen ze het verhaal. PV onder SP met OP op 100%: de actuator zit aan zijn maximum en de kring kan niet meer; de klep is te klein of de stoomtoevoer te laag. OP op 0% en PV nog steeds boven SP: de verstoring is groter dan de actuator aankan.',
        'Standen: AUTO, de regelaar regelt. HAND (MAN), de operator zet de uitgang zelf. CAS, het setpoint komt van een andere regelaar. Studies vinden steeds weer dat zo’n derde van de regelkringen in fabrieken in hand staat of slecht presteert. “Hoeveel kringen staan er in hand, en waarom?” is een vraag waarmee je de aandacht van een engineer hebt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een melkpasteur moet het product 15 seconden op 72 °C houden. TT 401 meet 71,2 °C. TIC 401 heeft een setpoint van 72,5 °C, dus de regelafwijking is 1,3 °C. De uitgang stijgt van 45% naar 58%, heetwaterklep TV 401 gaat verder open, en in zo’n 40 seconden is de temperatuur 72,5. Los daarvan: als de temperatuur onder 72,0 °C zakt, stuurt een omschakelklep (divert valve) de melk terug naar de balanstank. Dat is een voedselveiligheidsfunctie, onafhankelijk van de regelkring.',
      },
      said: 'Wat engineers zeggen: “Die kring staat al maanden in hand op veertig procent. Niemand vertrouwt hem in automaat, dus de operators zitten er maar bovenop.”',
      recall: [
        {
          q: 'Het setpoint is 80 °C en de proceswaarde is 76,5 °C. Wat is de regelafwijking, in °C?',
          number: 3.5,
          tolerance: 0.05,
          unit: '°C',
          why: 'Regelafwijking = SP − PV = 80 − 76,5 = 3,5 °C.',
        },
        {
          q: 'De PV zit ruim onder het SP en de uitgang staat vast op 100%. Wat zegt dat?',
          options: ['De regelaar moet opnieuw ingeregeld worden', 'De sensor is zeker kapot', 'Het setpoint is fout', 'De actuator zit aan zijn maximum: de kring kan niet harder'],
          answer: 'De actuator zit aan zijn maximum: de kring kan niet harder',
          why: 'De regelaar vraagt alles wat hij heeft; de grens is de klep of de toevoer.',
        },
        {
          q: 'Welke hiervan is open sturing?',
          options: ['Een thermostaat die de verwarming schakelt', 'Cruise control in een auto', 'Een niveauregeling op een tank', 'Een timer die een pomp 10 minuten laat draaien'],
          answer: 'Een timer die een pomp 10 minuten laat draaien',
          why: 'De timer meet het resultaat niet, dus kan hij niet corrigeren.',
        },
        {
          q: 'Wat betekent de stand HAND (MAN) op een regelaar?',
          options: ['De operator zet de uitgang zelf', 'De regelaar draait op maximale versterking', 'Het setpoint komt van een andere regelaar', 'De kring is uitgeschakeld'],
          answer: 'De operator zet de uitgang zelf',
          why: 'In hand regelt de regelaar niet meer en houdt de operator de klepstand vast.',
        },
      ],
      situation: {
        scene: 'Je bent bij een klant met een sproeidroger. Operators klagen dat de uitlaattemperatuur schommelt, en dat raakt het vochtgehalte van het product. In het DCS zie je dat TIC 210 in HAND staat, op 40% uitgang.',
        ask: 'Wat vraag je?',
        model: 'Waarom staat deze kring in hand, en sinds wanneer? Als hij in hand is gezet omdat hij in automaat ging slingeren, kan de oorzaak de inregeling zijn of een plakkende klep, en dat is op te lossen. Zolang hij in hand staat, wordt elke verandering in voeding of weer met de hand gecorrigeerd, dus die schommelingen zijn logisch. Wie zou er deze week met de operators naar kunnen kijken?',
        rubric: [
          'Ziet dat de kring in hand staat en vraagt waarom',
          'Koppelt de handstand aan de temperatuurschommelingen',
          'Stelt voor een regeltechnicus naar inregeling of klep te laten kijken',
        ],
      },
      sayIt: 'Leg een operator in 60 seconden uit wat SP, PV en OP betekenen op een regelaarvenster.',
      terms: [
        { term: 'Setpoint (SP)', def: 'De waarde die de regelaar probeert te bereiken.' },
        { term: 'Proceswaarde (PV)', def: 'De gemeten werkelijke waarde.' },
        { term: 'Uitgang (OP)', def: 'Wat de regelaar naar de actuator stuurt, 0 tot 100%.' },
        { term: 'Gesloten regelkring', def: 'Regelen met terugkoppeling: meten, vergelijken, corrigeren, herhalen.' },
      ],
    },
    {
      id: 'eng.drawings.pid_control',
      title: 'PID-regeling: het gevoel erachter',
      pre: [
        {
          q: 'Een regelaar heeft alleen P-actie, geen I. Waar komt de proceswaarde na een verstoring tot rust?',
          options: ['Precies op het setpoint', 'Iets naast het setpoint: een blijvende afwijking', 'Hij blijft eeuwig slingeren', 'Op nul'],
          answer: 'Iets naast het setpoint: een blijvende afwijking',
          why: 'P heeft een afwijking nodig om uitgang te geven, dus er blijft altijd een kleine afwijking over.',
        },
      ],
      teach: [
        'P (proportioneel): de uitgang verandert evenredig met de huidige afwijking. Met een versterking van 2 geeft een afwijking van 5% 10% meer uitgang. Meer versterking betekent een sterkere, snellere reactie. Alleen P laat een blijvende afwijking (offset) achter, omdat hij een afwijking nodig heeft om uitgang te geven. Te veel versterking laat de kring slingeren.',
        'I (integrerend): telt de afwijking op in de tijd en blijft duwen tot de afwijking nul is. Dat haalt de offset weg. Te veel I geeft doorschot en langzaam slingeren. Integrator-windup: als de actuator lang tegen zijn grens zit, blijft de I-term groeien, en daarna schiet de kring flink door.',
        'D (differentiërend): reageert op hoe snel de afwijking verandert, en remt dus af vóór het doorschieten. Hij is gevoelig voor ruis op de meting, dus de meeste industriële kringen draaien PI, met D uit.',
        'Op een trend: een trage kring kruipt in minuten naar het setpoint zonder doorschot. Een agressieve kring schiet door en slingert daarna langzaam uit. Een instabiele kring slingert steeds harder. Maar slingeren ligt niet altijd aan de inregeling: een plakkende klep (stiction) geeft een zaagtand op de uitgang en blokvormige stappen in de proceswaarde. Check de klep voordat je opnieuw inregelt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een PI-niveauregeling op een buffertank, setpoint 60%. De trend laat het niveau elke 4 minuten slingeren tussen 52 en 68%, met de uitgang tussen 20 en 80%. De regeltechnicus zet de kring in hand op 50%: het slingeren stopt, dus de kring veroorzaakt het zelf. Daarna een kleptest: uitgang van 50 naar 51%, niets beweegt; naar 53%, de klep springt. Dat is zo’n 2 tot 3% stiction. De oplossing is de klep (pakking, positioner), niet een nieuwe inregeling.',
      },
      said: 'Wat engineers zeggen: “Voordat je aan de inregeling zit: zet hem in hand en geef de klep een stapje. Negen van de tien keer is het een plakkende klep, niet de PID.”',
      recall: [
        {
          q: 'Een P-regelaar heeft een versterking van 2. De afwijking neemt toe met 5%. Met hoeveel % verandert de uitgang?',
          number: 10,
          tolerance: 0.1,
          unit: '%',
          why: 'Verandering van de uitgang = versterking × afwijking = 2 × 5 = 10%.',
        },
        {
          q: 'Welk deel van PID haalt de blijvende afwijking weg?',
          options: ['P', 'D', 'I', 'De setpointhelling'],
          answer: 'I',
          why: 'De integrator blijft duwen zolang er nog een afwijking is.',
        },
        {
          q: 'De proceswaarde slingert met steeds grotere uitslagen. Wat is het meest waarschijnlijk?',
          options: ['De kring is te traag', 'De kring is instabiel: versterking of I-actie is te hoog', 'Het setpoint is te laag', 'De sensor is te nauwkeurig'],
          answer: 'De kring is instabiel: versterking of I-actie is te hoog',
          why: 'Groeiende uitslagen betekenen dat de kring overreageert op zijn eigen correcties.',
        },
        {
          q: 'De uitgang toont een zaagtand en de proceswaarde beweegt in blokvormige stappen. Wat vermoed je?',
          options: ['Een plakkende klep (stiction)', 'Te weinig I-actie', 'Ruis op de sensor', 'Een te hoog setpoint'],
          answer: 'Een plakkende klep (stiction)',
          why: 'De uitgang bouwt op tot de klep losschiet en springt; daarna begint het opnieuw.',
        },
      ],
      situation: {
        scene: 'Je bent bij een klant in de chemie. Een operator zegt: “De stoomdrukregeling is slecht, hij slingert altijd. Iemand moet hem opnieuw inregelen.” De regeltechnicus is twee weken op vakantie.',
        ask: 'Wat vraag of stel je voor?',
        model: 'Heeft iemand hem een paar minuten in hand gezet: stopt het slingeren dan? Zo ja, dan veroorzaakt de kring het zelf, en is de volgende check of de klep soepel beweegt bij kleine stapjes in de uitgang. Blijft hij in hand ook slingeren, dan zit de oorzaak stroomopwaarts, een verstoring, en helpt opnieuw inregelen niet. Hoe dan ook: laten we dat verzamelen voordat de technicus terug is.',
        rubric: [
          'Stelt de handtest voor om te zien of de kring het slingeren veroorzaakt',
          'Noemt het controleren van de klep op stiction',
          'Scheidt een kringprobleem van een verstoring stroomopwaarts',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden in gewone woorden uit wat P, I en D elk doen.',
      terms: [
        { term: 'P, I, D', def: 'Proportioneel (reageer op afwijking), integrerend (haal offset weg), differentiërend (rem bij snelle verandering).' },
        { term: 'Offset', def: 'Een blijvende afwijking die overblijft bij alleen P-regeling.' },
        { term: 'Doorschot', def: 'De proceswaarde die voorbij het setpoint schiet voordat hij tot rust komt.' },
        { term: 'Stiction', def: 'Een klep die blijft plakken en dan springt, waardoor de kring gaat slingeren.' },
      ],
    },
    {
      id: 'eng.drawings.plc',
      title: 'PLC, HMI, SCADA en veiligheid',
      pre: [
        {
          q: 'Een hekdeur van een robotcel gaat open terwijl de robot draait. Wat hoort de robot te stoppen?',
          options: ['De normale stopstap in het PLC-programma', 'De operator die op stop drukt op de HMI', 'De eigen botsdetectie van de robot', 'Een veiligheidsrelais of veiligheids-PLC die daarvoor bedraad is'],
          answer: 'Een veiligheidsrelais of veiligheids-PLC die daarvoor bedraad is',
          why: 'Mensen beschermen is een aparte, gecertificeerde veiligheidsfunctie, geen gewone programmalogica.',
        },
      ],
      teach: [
        'Een PLC (programmable logic controller) is een industriële computer die ingangen leest (sensoren, knoppen) en uitgangen stuurt (motoren, kleppen) in een snelle cyclus, vaak elke 10 ms. Bekende merken: Siemens, Rockwell (Allen-Bradley), Beckhoff, Omron. Machinesequenties zijn in stappen geschreven: stap 10 klemmen, stap 20 boren, stap 30 lossen, elk wachtend op een voorwaarde.',
        'De HMI (human-machine interface) is het touchscreen bij de machine: start, stop, recepten, alarmen, setpoints. SCADA houdt toezicht op veel PLC’s: overzichtsschermen, trends, alarmen voor een hele fabriek of een heel net; netbeheerders draaien SCADA voor hun stations. In procesfabrieken combineert een DCS regeling en schermen in één systeem.',
        'Een interlock is een voorwaarde die een actie blokkeert: de pomp mag niet starten als de zuigklep dicht is. Procesinterlocks beschermen machine en product. Veiligheidsfuncties beschermen mensen en worden apart ontworpen: veiligheids-PLC of veiligheidsrelais, volgens ISO 13849 (performance level a tot e) of IEC 62061 en 61511 (SIL). Die overbrug je nooit met een draadje.',
        'Voordat je een sequentie verandert, vraag je: wat beschermt deze stap? Is hij onderdeel van een veiligheidsfunctie, waarvoor een risicobeoordeling en validatie nodig zijn? Wie is eigenaar van de code, en is er een back-up? Hoe testen we en hoe draaien we terug? En vraag naar de overbruggingslijst: in veel fabrieken staan sensoren al jaren “tijdelijk” overbrugd.',
      ],
      example: {
        kind: 'worked',
        text: 'Een verpakkingsmachine draait 28 seconden per cyclus. Het team wil de duwer laten starten voordat sensor B12 “doos op positie” bevestigt, wat 3 seconden scheelt. De besturingsengineer checkt: stap 40 wacht op B12 om vastlopers te voorkomen, een procesinterlock, geen veiligheidsfunctie. Het lichtscherm op de invoer hangt aan de veiligheids-PLC (PL d) en blijft onaangeroerd. Plan: back-up van programma v2.3, wijziging in testmodus, één ploeg draaien, meten. Resultaat: cyclus 25 seconden, nog steeds 2 vastlopers per ploeg. Op een ploeg van 8 uur zijn dat zo’n 123 extra cycli.',
      },
      said: 'Wat engineers zeggen: “Die wachtstap kunnen we best overslaan, dat is gewoon een procesinterlock. Maar het lichtscherm hangt aan de veiligheids-PLC, daar komt niemand aan zonder risicobeoordeling.”',
      recall: [
        {
          q: 'Een cyclus gaat van 28 naar 25 seconden. Hoeveel extra cycli krijg je in een ploeg van 8 uur (28.800 seconden)?',
          number: 123,
          tolerance: 2,
          unit: 'cycli',
          why: '28.800 / 25 = 1.152 en 28.800 / 28 = 1.029: zo’n 123 meer.',
        },
        {
          q: 'Welke hiervan is een veiligheidsfunctie en geen procesinterlock?',
          options: ['Een pomp die niet start als de zuigklep dicht is', 'Een transportband die stopt als de volgende machine vol is', 'Een lichtscherm dat een robot stopt als iemand erin grijpt', 'Een stap die wacht tot een doos op positie is'],
          answer: 'Een lichtscherm dat een robot stopt als iemand erin grijpt',
          why: 'Het is er om een mens te beschermen, dus het wordt als veiligheidsfunctie ontworpen en gecertificeerd.',
        },
        {
          q: 'Wat is het belangrijkste verschil tussen een HMI en SCADA?',
          options: ['SCADA houdt toezicht op veel PLC’s in een fabriek of net; een HMI is het scherm van één machine', 'Een HMI is altijd draadloos', 'SCADA draait alleen veiligheidsfuncties', 'Er is geen verschil'],
          answer: 'SCADA houdt toezicht op veel PLC’s in een fabriek of net; een HMI is het scherm van één machine',
          why: 'SCADA is de toezichtlaag over veel besturingen en locaties.',
        },
        {
          q: 'Iemand stelt voor een machinesequentie te veranderen. Wat is de eerste vraag?',
          options: ['Hoe snel kan het?', 'Welk merk PLC is het?', 'Kunnen de operators later getraind worden?', 'Wat beschermt deze stap, en is hij onderdeel van een veiligheidsfunctie?'],
          answer: 'Wat beschermt deze stap, en is hij onderdeel van een veiligheidsfunctie?',
          why: 'Een veiligheidsgerelateerde stap veranderen vraagt eerst een risicobeoordeling en validatie.',
        },
      ],
      situation: {
        scene: 'Je loopt door de fabriek bij een klant in de bouwmaterialen. Bij de palletizer is in de kast een sensor overbrugd met een draadje. De teamleider zegt: “Die gaf valse stops, dus onderhoud heeft hem vorig jaar overbrugd.”',
        ask: 'Wat vraag je?',
        model: 'Wat beschermt die sensor: hoort hij bij de afscherming of is het alleen een procescheck? Wie heeft de overbrugging goedgekeurd, en staat hij op een overbruggingslijst? Als hij veiligheidsgerelateerd is, moet dit vandaag opgelost worden; zo niet, dan moeten de valse stops alsnog echt verholpen worden in plaats van een blijvende brug. Ik wil dat de onderhoudsleider en de veiligheidskundige er nu naar kijken.',
        rubric: [
          'Vraagt of de sensor veiligheidsgerelateerd is',
          'Vraagt naar goedkeuring en een overbruggingslijst',
          'Escaleert passend en vraagt om de echte oorzaak op te lossen',
        ],
      },
      sayIt: 'Leg een projectsponsor in 60 seconden het verschil uit tussen een procesinterlock en een veiligheidsfunctie, en waarom dat voor je project uitmaakt.',
      terms: [
        { term: 'PLC', def: 'Industriële besturing die de machinelogica in een snelle cyclus uitvoert.' },
        { term: 'HMI', def: 'Het bedieningsscherm bij een machine.' },
        { term: 'SCADA', def: 'Toezichtsysteem over veel PLC’s: overzicht, trends, alarmen.' },
        { term: 'Veiligheidsfunctie', def: 'Apart ontworpen en gecertificeerde functie die mensen beschermt, zoals een stop via een lichtscherm.' },
      ],
    },
  ],
};

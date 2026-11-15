// pm.formats (Nederlands): werkvormen en overleggen: welk overleg wanneer, een werksessie ontwerpen en leiden, ideeën en besluiten in de groep en werkvormen op de vloer.
export default {
  lessons: [
    {
      id: 'pm.formats.catalogue',
      title: 'De overleggen van een project',
      pre: [
        {
          q: 'Een sponsor wil elke week een overleg van een uur met alle twaalf teamleden. Welke vraag stel je jezelf eerst?',
          options: [
            'Welke dag van de week het minste botst met de agenda’s van het team',
            'Of de vergaderzaal groot genoeg is voor twaalf mensen tegelijk',
            'Wat het overleg oplevert dat een bericht niet kan',
            'Wie de agenda mag vaststellen en de notulen bijhoudt in het team',
          ],
          answer: 'Wat het overleg oplevert dat een bericht niet kan',
          why: 'Een overleg bestaat bij gratie van wat het oplevert; zonder opbrengst is een bericht goedkoper.',
        },
      ],
      teach: [
        'Een project heeft meerdere overlegvormen (meeting formats). Elke vorm heeft een doel, deelnemers, een duur en een opbrengst (output). Een overleg is bedoeld om te delen of te besluiten; een werksessie (workshop) is bedoeld om samen iets te maken, zoals een lijst, een kaart of een plan.\n\nHet verschil zie je aan het eind: na een overleg liggen er besluiten en afspraken, na een werksessie ligt er iets dat de groep gemaakt heeft.',
        'De overleggen die elk project kent, kort beschreven. Kick-off: het project start, 60 tot 90 minuten, met doel, rollen en eerste stappen als opbrengst. Stand-up: dagelijks 15 minuten bij het bord. Weekoverleg: 30 tot 60 minuten, de voortgang en problemen van het team. Stuurgroep: elke paar weken, de sponsor neemt besluiten.\n\nDe volledige uitwerking staat in Een overlegritme dat werkt en De stuurgroep voorbereiden in Uitvoeren; het getrapte overleg op de vloer in Getrapt overleg en escaleren in Landen.',
        'Drie vormen plan je bewust. Een review of demo laat het werkende resultaat zien aan de mensen die het gaan gebruiken, zodra er iets te laten zien is. Een terugblik (retrospective) kijkt naar de manier van werken: zie Een terugblik waar mensen van leren in Afsluiten. De vijf events van Scrum in Agile en Scrum zijn het agile equivalent.\n\nEen sponsorgesprek (sponsor check-in) is kort, 20 tot 30 minuten, om de twee tot vier weken.',
        'De werksessie is de vorm die het meest wordt onderschat. Ze duurt twee tot drie uur, heeft één doel en levert één zichtbare uitkomst op. Hoe je er een ontwerpt en leidt, staat in het volgende onderwerp van deze module.\n\nElk overleg heeft een opbrengst van een overleg (meeting output) die je kunt aanwijzen: een besluit, een lijst, een kaart, een afspraak. Kun je de opbrengst niet noemen, dan is het overleg een kandidaat om te schrappen of te vervangen door een bericht.',
      ],
      example: {
        kind: 'worked',
        text: 'Een project van zes maanden (24 weken) bij een maakbedrijf: de werkvoorbereiding van een assemblagelijn verbeteren. De overlegkalender per maand.\n\nMaand 1: kick-off in week 1 (60 minuten, opbrengst: doel, rollen, eerste stappen), werksessie over de huidige situatie in week 3 (3 uur, opbrengst: een kaart), vanaf week 1 elke week een weekoverleg van 30 minuten en om de twee weken een sponsorgesprek.\nMaand 2 en 3: eerste stuurgroep in week 8, demo van de pilot in week 10.\nMaand 4 en 5: stuurgroep in week 16, tweede demo in week 18, werksessie over de overdracht aan de beheerder in week 19.\nMaand 6: terugblik in week 23, laatste stuurgroep in week 24.\nElke regel heeft een opbrengst; het weekoverleg en het sponsorgesprek lopen door.',
      },
      said: 'Wat je hoort in projecten: “Zullen we gewoon even een overleg plannen?”',
      recall: [
        {
          q: 'Wat onderscheidt een werksessie van een overleg?',
          options: [
            'Een werksessie duurt altijd langer dan een dag en heeft meer deelnemers',
            'De groep maakt samen iets dat na afloop zichtbaar is',
            'Alleen de sponsor is aanwezig om besluiten te nemen',
            'Er is geen agenda en iedereen praat door elkaar',
          ],
          answer: 'De groep maakt samen iets dat na afloop zichtbaar is',
          why: 'Een werksessie levert een uitkomst op die de groep zelf gemaakt heeft; een overleg deelt of besluit.',
        },
        {
          q: 'Welke overlegvorm gebruik je om het werkende resultaat te laten zien aan de mensen die het gaan gebruiken?',
          options: ['Een kick-off', 'Een sponsorgesprek', 'Een stuurgroep', 'Een demo of review'],
          answer: 'Een demo of review',
          why: 'Een demo of review is het moment waarop gebruikers het werk zien en erop reageren.',
        },
        {
          q: 'Een project van 20 weken heeft elke vier weken een stuurgroep van 90 minuten. Hoeveel uur stuurgroep is dat in totaal?',
          number: 7.5,
          tolerance: 0.2,
          unit: 'uur',
          why: '20 / 4 = 5 stuurgroepen. 5 × 1,5 uur = 7,5 uur.',
          hint: 'Bereken eerst hoeveel stuurgroepen er in het project passen en reken dan de duur om naar uren.',
        },
        {
          q: 'Je kunt de opbrengst van een weekoverleg niet noemen. Wat doe je?',
          options: [
            'Het overleg schrappen of vervangen door een schriftelijke update',
            'Het overleg langer maken zodat er meer tijd is om iets te vinden',
            'Er meer mensen bij uitnodigen zodat het belangrijker aanvoelt voor iedereen',
            'Het overleg laten staan omdat het al in alle agenda’s staat',
          ],
          answer: 'Het overleg schrappen of vervangen door een schriftelijke update',
          why: 'Zonder aanwijsbare opbrengst is het overleg overbodig of kan een bericht het werk doen.',
        },
      ],
      situation: {
        scene: 'Je start een project bij een netbeheerder. De sponsor zegt: “Plan maar een wekelijks overleg met het hele team van twaalf mensen, anders voelen ze zich niet betrokken.”',
        ask: 'Wat stel je voor?',
        model: '“Betrokkenheid vind ik ook belangrijk. Ik stel een weekoverleg van 30 minuten voor met het kernteam, een stuurgroep elke vier weken voor u en een korte maandelijkse sessie met iedereen waarin we de resultaten laten zien. Zo hoort iedereen wat er gebeurt en blijft het overleg kort.”',
        rubric: ['Erkent het belang van betrokkenheid', 'Stelt verschillende vormen voor met een eigen doel', 'Houdt de tijdskosten voor het team beperkt'],
        pushback: {
          lines: ['“Als ik niet elke week iedereen zie, weet ik niet hoe het gaat.”', '“Een maandelijkse sessie is te weinig, dan horen mensen het te laat.”'],
          model: '“Ik begrijp dat u het wilt zien. U krijgt elke week een korte schriftelijke update en elke twee weken een sponsorgesprek van een half uur. Als de sessie na twee maanden te weinig blijkt, maken we haar vaker. We toetsen het na de eerste stuurgroep.”',
          rubric: ['Neemt de zorg om zicht serieus', 'Biedt een alternatief met minder vergadertijd', 'Stelt een moment voor om bij te sturen'],
        },
      },
      sayIt: 'Leg in 60 seconden uit welke overleggen een project nodig heeft en wat elk oplevert.',
      terms: [
        {
          term: 'Overlegvorm',
          def: 'Een soort overleg met een eigen doel, deelnemers, duur en opbrengst.',
        },
        {
          term: 'Kick-off',
          def: 'Het overleg waarmee het project officieel start: doel, scope, rollen en eerste stappen.',
        },
        {
          term: 'Sponsorgesprek',
          def: 'Een kort, vast gesprek met de sponsor, bijvoorbeeld twintig minuten om de twee weken: wat gaat goed, waar zit het vast, wat is nodig.',
        },
        {
          term: 'Werksessie',
          def: 'Een bijeenkomst waarin een groep samen één zichtbare uitkomst maakt, zoals een lijst, een kaart of een plan.',
        },
        {
          term: 'Opbrengst van een overleg',
          def: 'Wat er na afloop ligt dat er daarvoor niet was: een besluit, een lijst, een kaart of een afspraak.',
        },
      ],
    },
    {
      id: 'pm.formats.kickoff',
      title: 'Een kick-off voorbereiden en leiden',
      pre: [
        {
          q: 'Je organiseert een kick-off voor tien mensen. De agenda is 90 minuten omdat dat zo gebruikelijk is. Wat is de betere ontwerpvraag?',
          options: [
            'Hoe krijgen we alle presentaties erin zonder te hoeven schrappen',
            'Wat moet iedereen aan het eind weten en afgesproken hebben',
            'Wie van het management laat zich het minst storen door de duur',
            'Welk gebouw heeft een zaal die lang genoeg beschikbaar is',
          ],
          answer: 'Wat moet iedereen aan het eind weten en afgesproken hebben',
          why: 'De duur volgt uit wat er aan het eind afgesproken moet zijn, niet andersom.',
        },
      ],
      teach: [
        'In De eerste weken in Intake staat dat een kick-off ongeveer een uur duurt en dat de sponsor vertelt waarom. Deze les werkt de kick-off helemaal uit. Er zijn twee soorten: de stakeholderkick-off (stakeholder kick-off) voor de sponsor en de belangrijkste belanghebbenden, en de teamkick-off (team kick-off) voor de mensen die het werk doen.\n\nBij grotere projecten doe je eerst de eerste en daarna de tweede.',
        'Een agenda van 60 minuten in vijf blokken. Waarom, door de sponsor: 10 minuten. Doel en scope, door jou: 15. Rollen: 10. Hoe werken we samen: 10. Eerste stappen: 15.\n\nDe uitnodiging gaat naar wie moet instemmen of meedoen, niet naar iedereen die het leuk vindt. Wie spreekt, staat vooraf vast: de sponsor opent, jij leidt, de anderen reageren kort. Elk blok heeft één vraag die het beantwoordt.',
        'Stuur twee dagen vooraf een voorleesstuk (pre-read) van één pagina: het doel in één zin, de scope, wie er is uitgenodigd en waarom, en de agenda. Wie het leest, hoeft in de zaal niet meer te horen wat er al staat.\n\nDaardoor kun je blokken korter maken of schrappen: het voorleesstuk vervangt de uitleg, de kick-off is voor afspraken.',
        'Aan het eind liggen er vijf dingen vast. Een doelzin waar iedereen het mee eens is. De rollen. Het overlegritme. De werkafspraken (working agreements): een paar afspraken over samenwerken, zoals binnen een dag reageren en besluiten in één lijst zetten. De eerste drie acties, elk met een eigenaar en een datum.\n\nStuur dit binnen 24 uur terug aan iedereen. Het is het eerste bewijs dat de kick-off iets heeft opgeleverd.',
      ],
      example: {
        kind: 'worked',
        text: 'Een kick-off voor een project dat de werkvoorbereiding bij een netbeheerder verbetert. Tien mensen, oorspronkelijk gepland voor 90 minuten: 10 × 1,5 = 15 uur.\n\nJe ontwerpt opnieuw. Het voorleesstuk (doel, scope, wie en waarom) gaat twee dagen vooraf; daardoor vervalt het uitlegblok. Agenda van 60 minuten: waarom (sponsor) 10, doel en scope 10, rollen 10, werkafspraken 10, eerste stappen 15, afronden 5. Tien mensen × 1 uur = 10 uur: 5 uur bespaard.\n\nEinde: een doelzin, vijf rollen, wekelijks overleg op dinsdag, twee werkafspraken, drie acties met naam en datum. Dezelfde dag verstuurd.',
      },
      said: 'Wat je hoort in projecten: “De kick-off was prima, maar daarna wist niemand wat er nou was afgesproken.”',
      recall: [
        {
          q: 'Wat is een voorleesstuk (pre-read) voor een kick-off?',
          options: ['De presentatie die de sponsor in de zaal houdt om het waarom uit te leggen', 'Het verslag met besluiten en acties dat binnen een dag na afloop wordt verstuurd', 'Een korte tekst die deelnemers vooraf lezen, zodat de zaal naar afspraken gaat', 'Het volledige projectplan, dat iedereen vooraf leest en in de zaal goedkeurt'],
          answer: 'Een korte tekst die deelnemers vooraf lezen, zodat de zaal naar afspraken gaat',
          why: 'Het voorleesstuk neemt de uitleg over, zodat de kick-off tijd heeft voor afspraken.',
        },
        {
          q: 'Welke vijf dingen liggen aan het eind van een kick-off vast?',
          options: [
            'Doelzin, rollen, overlegritme, werkafspraken en de eerste drie acties',
            'Budget, risicolijst, planning, begroting en communicatieplan van het hele project',
            'Projectplan, mijlpalen, begroting, stuurgroepleden en de eerste rapportage aan de sponsor',
            'Scope, kosten, kwaliteit, tijd en een eindrapport voor de directie',
          ],
          answer: 'Doelzin, rollen, overlegritme, werkafspraken en de eerste drie acties',
          why: 'Deze vijf maken van een bijeenkomst een start: iedereen weet doel, rol, ritme, regels en wat er morgen gebeurt.',
        },
        {
          q: 'Je kick-off voor 12 mensen gaat van 75 minuten naar 45 minuten. Hoeveel uur bespaar je in totaal?',
          number: 6,
          tolerance: 0.2,
          unit: 'uur',
          why: '75 − 45 = 30 minuten, dus 0,5 uur per persoon. 12 × 0,5 = 6 uur.',
          hint: 'Bereken eerst hoeveel minuten er per persoon wegvallen en vermenigvuldig dan met het aantal mensen.',
        },
        {
          q: 'Wanneer houd je een aparte teamkick-off na een stakeholderkick-off?',
          options: [
            'Nooit: één kick-off voor iedereen is altijd genoeg, ook bij een groot project',
            'Alleen als het project langer dan een jaar duurt en veel mensen heeft',
            'Alleen als de sponsor niet beschikbaar is voor de stakeholderkick-off',
            'Als de mensen die het werk doen nog rollen en werkafspraken moeten maken',
          ],
          answer: 'Als de mensen die het werk doen nog rollen en werkafspraken moeten maken',
          why: 'De stakeholders besluiten over waarom en steun; het team moet nog afspreken hoe het werkt.',
        },
      ],
      situation: {
        scene: 'Je bereidt een kick-off voor bij een maakbedrijf. De sponsor wil dat alle vijf afdelingshoofden elk een kwartier presenteren. Daarmee is de kick-off al 75 minuten voordat jij iets hebt gezegd.',
        ask: 'Wat zeg je tegen de sponsor?',
        model: '“Ik snap dat u alle afdelingen wilt laten horen. Wat als elk hoofd één pagina schrijft die we vooraf rondsturen, en we in de kick-off alleen bespreken waar het elkaar raakt? Dan houden we 60 minuten voor doel, rollen en afspraken en iedereen heeft zijn zegje gedaan.”',
        rubric: ['Erkent de wens dat elke afdeling gehoord wordt', 'Stelt een voorleesstuk voor in plaats van presentaties', 'Houdt tijd voor afspraken vrij'],
        pushback: {
          lines: ['“Een pagina lezen doet niemand. Ze moeten het horen.”', '“Als ik het zelf niet mag zeggen, voelt mijn afdeling zich genegeerd.”'],
          model: '“Dat kan ook: elk hoofd krijgt twee minuten om het belangrijkste punt van de pagina te noemen. Dat is tien minuten in plaats van 75. Wie het wil lezen, heeft het; wie het wil horen, hoort het. U opent en zegt waarom dit voor iedereen telt.”',
          rubric: ['Neemt het gevoel genegeerd te worden serieus', 'Biedt een korte spreektijd als alternatief', 'Geeft de sponsor een zichtbare rol'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een kick-off van een uur indeelt en wat er aan het eind vastligt.',
      terms: [
        {
          term: 'Werkafspraken',
          def: 'Een paar afspraken over hoe het team samenwerkt, zoals reactietijd en waar besluiten staan.',
        },
        {
          term: 'Voorleesstuk',
          def: 'Een korte tekst die deelnemers vóór het overleg lezen, zodat de tijd in de zaal naar afspraken gaat.',
        },
        {
          term: 'Teamkick-off',
          def: 'De kick-off voor de mensen die het werk doen: rollen, werkafspraken en eerste stappen.',
        },
        {
          term: 'Stakeholderkick-off',
          def: 'De kick-off voor de sponsor en belangrijkste belanghebbenden: waarom het project er is en wat ze ervan verwachten.',
        },
      ],
    },
    {
      id: 'pm.formats.system',
      title: 'Het overlegsysteem van één project',
      pre: [
        {
          q: 'Een project heeft negen vaste overleggen en niemand heeft nog tijd om te werken. Wat is de beste eerste stap?',
          options: ['Alle overleggen een kwartier korter maken, zodat er elke week tijd vrijkomt', 'De overleggen bundelen op twee vaste dagen, zodat de rest vrij blijft', 'Het team laten stemmen welk overleg het minst nuttig is en dat schrappen', 'Per overleg nagaan of het een besluit, afstemming of een les oplevert'],
          answer: 'Per overleg nagaan of het een besluit, afstemming of een les oplevert',
          why: 'Pas als je weet wat elk overleg doet, kun je zien wat dubbel is of ontbreekt.',
        },
      ],
      teach: [
        'Een project heeft een overlegsysteem: de verzameling overleggen die samen drie dingen moeten doen. Besluiten (stuurgroep, sponsorgesprek), afstemmen (stand-up, weekoverleg) en leren (demo, terugblik). Elke taak moet door minstens één overleg gedekt zijn en bij voorkeur niet door drie.\n\nLijst per overleg op wat het oplevert. Wat dubbel is, voeg je samen. Wat ontbreekt, voeg je toe.',
        'De cadans (cadence) is het ritme van elk overleg. Als vuistregel volgt hij de snelheid waarmee het werk verandert: dagelijks of wekelijks voor afstemming, maandelijks voor besluiten, bij mijlpalen voor leren.\n\nNiet elk overleg hoeft een overleg te blijven. Een schriftelijke update (written update) van één pagina vervangt een statusrondje. Een asynchroon overleg (asynchronous update) laat mensen binnen een afgesproken termijn, bijvoorbeeld 48 uur, reageren in hun eigen tijd. Het werkt voor informatie en eenvoudige keuzes, niet voor een conflict.',
        'Overleg in de zaal, op afstand of hybride? Eén regel voor een hybride overleg (hybrid meeting): als één persoon op afstand zit, gaat iedereen op een eigen scherm in het gesprek, ook als ze samen in een zaal zitten. Dan is niemand tweederangs, en de kamermicrofoon maakt geen onderscheid.\n\nKies voor een overleg met een gesprek of conflict liever de zaal; voor afstemming volstaat een scherm.',
        'Uitzonderingen. De sponsor die steeds afzegt: maak er een vast kwartier en een schriftelijke update van, en leg besluiten vast in een lijst. Een klantcultuur van lange overleggen: spreek een eindtijd af en een agenda vooraf. Ploegendienst: een korte stand-up bij de overdracht tussen ploegen en een schriftelijke update in plaats van een overleg waar de nachtploeg nooit bij kan.\n\nHet systeem voor meerdere teams staat in Meerdere werkstromen sturen in Uitvoeren.',
      ],
      example: {
        kind: 'faded',
        text: 'Een project bij een maakbedrijf heeft negen vaste overleggen:\n1. dagelijks stand-up, 15 minuten\n2. wekelijks teamoverleg, 60 minuten\n3. wekelijks planningsoverleg, 60 minuten\n4. wekelijks statusoverleg met de manager, 45 minuten\n5. wekelijks klantgesprek, 30 minuten\n6. maandelijks stuurgroep, 90 minuten\n7. maandelijks sponsorgesprek, 45 minuten\n8. om de week demo, 60 minuten\n9. om de week terugblik, 60 minuten\nEen maand telt vier weken en twintig werkdagen. Samen is dat ongeveer 24 uur overleg per maand.',
        ask: 'Welke voeg je samen, welke vervang je door een schriftelijke update en welke houd je? Controleer dat besluiten, afstemmen en leren gedekt blijven.',
        reveal: 'Teamoverleg en planningsoverleg worden één wekelijks overleg van 60 minuten. Het statusoverleg met de manager wordt een schriftelijke update uit hetzelfde bord. Het klantgesprek en de demo wisselen elkaar af in plaats van beide te lopen. De terugblik wordt maandelijks. De stand-up, het sponsorgesprek en de stuurgroep blijven.\n\nBesluiten: stuurgroep en sponsorgesprek. Afstemmen: stand-up en wekelijks overleg plus de update. Leren: demo en terugblik. Alles is nog gedekt. Het totaal gaat van ongeveer 24 naar ongeveer 15 uur per maand.',
      },
      said: 'Wat je hoort in projecten: “Ik zit de hele dag in overleg en kom niet toe aan mijn werk.”',
      recall: [
        {
          q: 'Welke drie taken moet een overlegsysteem samen dekken?',
          options: ['Plannen, begroten en rapporteren', 'Besluiten, afstemmen en leren', 'Presenteren, notuleren en evalueren', 'Starten, bijsturen en afsluiten'],
          answer: 'Besluiten, afstemmen en leren',
          why: 'Besluiten, afstemmen en leren zijn de drie taken waarvoor je overleg nodig hebt.',
        },
        {
          q: 'Wat is de regel voor een hybride overleg?',
          options: [
            'Wie op afstand zit, krijgt als eerste het woord in elke agendapunt',
            'De mensen in de zaal vergaderen en de rest kijkt alleen mee op een scherm',
            'Zit er één op afstand, dan doet iedereen mee op een eigen scherm',
            'Wie op afstand zit, krijgt achteraf de notulen in plaats van mee te praten',
          ],
          answer: 'Zit er één op afstand, dan doet iedereen mee op een eigen scherm',
          why: 'Door iedereen op een eigen scherm te zetten, hebben alle deelnemers dezelfde positie.',
        },
        {
          q: 'Je voegt twee wekelijkse overleggen van 60 en 45 minuten samen tot één van 60 minuten. Hoeveel uur bespaar je in vier weken?',
          number: 3,
          tolerance: 0.1,
          unit: 'uur',
          why: 'Per week 105 − 60 = 45 minuten. In vier weken 4 × 45 = 180 minuten = 3 uur.',
          hint: 'Tel eerst de minuten per week voor en na het samenvoegen op en reken het verschil om naar uren.',
        },
        {
          q: 'Welke vorm past het best voor een overleg waar een conflict besproken moet worden?',
          options: ['Een overleg in de zaal, met een gesprek', 'Een asynchrone ronde via berichten', 'Een schriftelijke update van één pagina', 'Een webinar met alleen luisteraars'],
          answer: 'Een overleg in de zaal, met een gesprek',
          why: 'Een conflict vraagt gesprek en toon; asynchroon of schriftelijk werkt voor informatie en eenvoudige keuzes.',
        },
      ],
      situation: {
        scene: 'De sponsor van je project annuleert voor de derde keer in een maand de stuurgroep. Er liggen twee besluiten klaar die het team niet zelf kan nemen.',
        ask: 'Wat stel je voor?',
        model: '“Ik weet dat uw agenda vol zit. Wat als de stuurgroep voortaan 30 minuten duurt, met het besluitstuk twee dagen vooraf, en we een besluit dat u niet in de zaal wilt nemen schriftelijk kunnen afdoen? Dan staat de lijst van besluiten altijd bij u en blijft het project in beweging.”',
        rubric: ['Erkent de volle agenda van de sponsor', 'Stelt een lichtere vorm voor met een schriftelijk alternatief', 'Koppelt het aan de besluiten die wachten'],
        pushback: {
          lines: ['“Ik heb jullie vertrouwen, besluiten kunnen gewoon zonder mij.”', '“Stuur me maar een mail, ik zie wel.”'],
          model: '“Dank voor het vertrouwen. Bij deze twee besluiten gaat het om budget en om een afspraak met de klant; dat kan ik niet zelf beslissen en ik wil niet dat u het later anders had gewild. Een mail met de twee opties en mijn advies kost u vijf minuten. Wilt u uiterlijk vrijdag antwoorden?”',
          rubric: ['Dankt voor het vertrouwen en blijft rustig', 'Legt uit waarom deze besluiten niet bij het team liggen', 'Vraagt om een concreet antwoord met een datum'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je de overleggen van één project snoeit zonder de besluiten, afstemming en lessen te verliezen.',
      terms: [
        {
          term: 'Cadans',
          def: 'Het ritme waarin een overleg terugkomt, passend bij hoe snel het werk verandert.',
        },
        {
          term: 'Schriftelijke update',
          def: 'Een korte tekst op een vast moment die een overleg vervangt als niemand hoeft te praten.',
        },
        {
          term: 'Asynchroon overleg',
          def: 'Overleg waarin mensen binnen een afgesproken termijn in hun eigen tijd reageren.',
        },
        {
          term: 'Hybride overleg',
          def: 'Een overleg waarin sommigen samen in een zaal zitten en anderen op afstand meedoen.',
        },
      ],
    },
    {
      id: 'pm.formats.governance',
      title: 'Het overleg als governance',
      pre: [
        {
          q: 'De sponsor zegt: “We nemen het besluit in de stuurgroep.” Wanneer moeten de belangrijkste mensen het voorstel voor het eerst zien?',
          options: [
            'Een paar dagen eerder, één-op-één, zodat bezwaren bekend zijn',
            'In de stuurgroep zelf, zodat iedereen gelijk start',
            'Pas in de notulen, zodat het besluit definitief is',
            'Een kwartier voor het overleg, zodat ze niet te veel kunnen tegenwerken',
          ],
          answer: 'Een paar dagen eerder, één-op-één, zodat bezwaren bekend zijn',
          why: 'Een besluit in de zaal is meestal al genomen; bezwaren hoor je liever vooraf en rustig.',
        },
      ],
      teach: [
        'Wie er in de zaal zit, bepaalt het besluit. Een uitnodigingslijst is een machtsbesluit: wie erbij zit telt, wie er niet bij zit kan het later blokkeren. Vraag bij elk overleg: wie moet erbij zitten, wie zit er nu, en wie had er moeten zitten?\n\nZo’n overleg is dan governance: de afspraak wie wat besluit en hoe het afgedaan wordt.',
        'Besluiten worden vooraf voorbereid, niet in de zaal genomen. De techniek van voorsorteren (pre-wiring) staat in Voor de directie in Programma’s en governance. Wat een senior erbij weegt: het kost tijd, en het kan eruitzien als achterkamertjespolitiek. Doe het open: zeg dat je met sleutelfiguren apart spreekt en waarom.\n\nVerrassingen in de zaal kosten vertrouwen. Een besluit dat de zaal verrast, wordt vaak later heropend.',
        'Overleglast (meeting load) is de tijd die overleggen vragen van de mensen die ze het minst missen kunnen. Elk overleg dat jij toevoegt, kost uren schaarse tijd van drukke klantmensen. Vraag daarom bij elk nieuw overleg wat het vervangt.\n\nVragen voor een overlegaudit (meeting audit): hoeveel uur per week zit dit team in overleg, wat levert elk overleg op, wie zit erin zonder rol, en wat gebeurt er als het vier weken stopt?',
        'Wie zit voor? Het voorzitterschap (chairing) houdt het ritme vast, maar het overleg sterft als jij weggaat. Geef na twee of drie keer het voorzitterschap aan een eigenaar bij de klant, met jou als coach. Houd het zelf bij een conflict of als de eigenaar zelf partij is.\n\nHet besluitenlijstje blijft bij de klant. Dat is het teken dat het ritme jouw vertrek overleeft.',
      ],
      example: {
        kind: 'faded',
        text: 'Het managementteam van een maakbedrijf (acht mensen) zit elk 22 uur per week in overleg, van een werkweek van 40 uur. Je ziet: een dagelijks productieoverleg, een wekelijks afdelingsoverleg, een wekelijks statusoverleg over een verbeterprogramma, en twee overleggen waar niemand weet wie ze begonnen is. De directeur zegt: “Het is druk, maar we hebben het nodig.”',
        ask: 'Schrijf de vragen voor een overlegaudit en doe een eerste voorstel. Wie zit voor, en wat meet je?',
        reveal: 'Vragen per overleg: wat is de opbrengst in de laatste vier weken (welke besluiten), wie zit erin zonder rol, wie is de eigenaar, wat gebeurt er als het vier weken stopt, en wat ligt er dubbel? Eerste voorstel voor een proef van vier weken: de twee overleggen zonder eigenaar of opbrengst stoppen, het statusoverleg vervangen door een schriftelijke update, en een middag per week zonder overleg.\n\nDe directeur kiest een voorzitter en een eigenaar van de proef; jij coacht. Je meet vergaderuren per week en het aantal besluiten. Als de besluiten niet dalen, is het overleg blijkbaar niet nodig geweest.',
      },
      said: 'Wat je hoort in projecten: “Dit overleg bestaat al jaren. Niemand weet meer waarom, maar je kunt er niet uit.”',
      recall: [
        {
          q: 'Waarom is een uitnodigingslijst een machtsbesluit?',
          options: [
            'Omdat alleen de directeur uitnodigingen mag versturen en er niemand anders is',
            'Wie erbij zit telt, wie er niet bij zit kan het later blokkeren',
            'Omdat het aantal deelnemers bepaalt hoe lang het overleg duurt in de praktijk',
            'Omdat uitnodigingen een wettelijk document zijn dat bewaard moet worden',
          ],
          answer: 'Wie erbij zit telt, wie er niet bij zit kan het later blokkeren',
          why: 'Wie niet gehoord is, kan het besluit later heropenen of negeren.',
        },
        {
          q: 'Hoe voorkom je dat voorsorteren op achterkamertjespolitiek lijkt?',
          options: [
            'Je laat het achterwege, het besluit moet in de zaal vallen',
            'Je doet het alleen bij de sponsor en niemand anders',
            'Je doet het via een mail aan iedereen met een deadline',
            'Je zegt open dat je met sleutelfiguren apart spreekt en waarom',
          ],
          answer: 'Je zegt open dat je met sleutelfiguren apart spreekt en waarom',
          why: 'Open zijn over het voorbespreken neemt de achterkamerschijn weg.',
        },
        {
          q: 'Een managementteam zit 18 uur per week in overleg bij een werkweek van 40 uur. Hoeveel procent van de werkweek is dat?',
          number: 45,
          tolerance: 1,
          unit: '%',
          why: '18 / 40 = 0,45, dus 45%.',
          hint: 'Deel de uren in overleg door de uren van de werkweek.',
        },
        {
          q: 'Wanneer houd je als externe zelf het voorzitterschap?',
          options: [
            'Altijd, zodat het ritme voor iedereen precies hetzelfde blijft als vroeger',
            'Nooit, want een externe zit nooit voor en moet de klant het overlaten',
            'Bij een conflict of als de eigenaar zelf partij is',
            'Alleen in de eerste week van het project, daarna draagt de klant het',
          ],
          answer: 'Bij een conflict of als de eigenaar zelf partij is',
          why: 'Een partij kan geen neutraal voorzitter zijn; dan houd jij het even.',
        },
      ],
      situation: {
        scene: 'Je leidt een project bij een maakbedrijf. Het managementteam zit zo vol overleg dat besluiten blijven liggen. De directeur zegt: “Voeg jij een extra wekelijks projectoverleg toe? Dan weet ik tenminste wat er speelt.”',
        ask: 'Wat zeg je?',
        model: '“Ik kan dat doen, maar dan vraag ik u eerst welk overleg ervoor in de plaats komt, want de agenda’s zitten vol. Mijn voorstel is om het statusoverleg over het verbeterprogramma te vervangen door een schriftelijke update en daar een kwartier projectoverleg voor in de plaats te zetten.”',
        rubric: ['Vraagt welk overleg vervangen wordt', 'Stelt een concrete vervanging voor', 'Maakt de overleglast van de klant bespreekbaar'],
        pushback: {
          lines: ['“Mijn mensen zijn het gewend. Ik ga geen overleg schrappen.”', '“Ik wil gewoon een extra moment waarop ik jou kan spreken.”'],
          model: '“Prima, dan houden we het bij het bestaande statusoverleg. Mag ik dan de eerste tien minuten voor het project? Dan krijgt u mij wekelijks te spreken zonder dat er een overleg bijkomt. Over twee maanden kijken we of het volstaat.”',
          rubric: ['Respecteert de bestaande gewoonte', 'Biedt een oplossing zonder extra overleg', 'Plant een moment om te toetsen'],
        },
      },
      sayIt: 'Leg in 60 seconden uit waarom een overleg macht is en hoe je de overleglast van een klant onderzoekt.',
      terms: [
        {
          term: 'Voorzitterschap',
          def: 'De rol van wie een overleg leidt, het ritme bewaakt en zorgt dat het besluiten oplevert.',
        },
        {
          term: 'Voorsorteren',
          def: 'Sleutelfiguren vóór het overleg één-op-één door een voorstel heen nemen.',
        },
        {
          term: 'Overleglast',
          def: 'De tijd die overleggen vragen van de mensen die ze het minst kunnen missen.',
        },
        {
          term: 'Overlegaudit',
          def: 'Een korte reeks vragen waarmee je nagaat wat de overleggen van een team kosten en opleveren.',
        },
      ],
    },
    {
      id: 'pm.formats.workshop',
      title: 'Wat een werksessie is',
      pre: [
        {
          q: 'Een manager wil “een sessie” met twaalf mensen om de planning te verbeteren. Welke vraag heb je eerst nodig?',
          options: ['Wat er aan het eind moet liggen en wie dat kan maken', 'Of er koffie en lunch is voor alle twaalf de mensen', 'Of de sessie beter op een maandag of een vrijdag past', 'Of er een presentatie met dia’s moet worden gemaakt'],
          answer: 'Wat er aan het eind moet liggen en wie dat kan maken',
          why: 'Een sessie begint bij de uitkomst en de mensen die haar kunnen maken.',
        },
      ],
      teach: [
        'Een werksessie (workshop) verschilt van een overleg op drie punten. Ze heeft één doel, ze levert een zichtbare uitkomst op die je kunt fotograferen, en ze haalt de mensen erbij die de kennis hebben. Ligt er na afloop niets zichtbaars, dan was het een overleg.\n\nUitkomsten zijn bijvoorbeeld een lijst met problemen, een kaart van een proces (de brown-papersessie in de volgende les), een plan of een gekozen volgorde.',
        'Een sessie ontwerp je met vier vragen. Doel: waarom nu, en wat verandert er door de sessie? Uitkomst: wat ligt er aan het eind? Deelnemers: wie heeft de kennis of moet het straks accepteren? Agenda: blokken met minuten.\n\nBeantwoord ze in die volgorde. Wie met de agenda begint, kiest werkvormen zonder te weten waarvoor.',
        'Elke sessie heeft dezelfde boog. Openen: doel, regels en een korte check-in. Divergeren (diverge): breed verzamelen zonder te oordelen. Convergeren (converge): ordenen, kiezen en uitwerken. Afsluiten: wie doet wat voor wanneer, en een slotronde.\n\nDe terugblik heeft dezelfde boog in vijf fasen; die staat in Een terugblik ontwerpen in Afsluiten en wordt hier niet herhaald.',
        'Drie rollen. De facilitator leidt het proces en stuurt niet op de inhoud. De eigenaar van de uitkomst (outcome owner) is wie de uitkomst straks gebruikt en erover beslist; die is bij de opening en het slot aanwezig. De scribent (scribe) schrijft zichtbaar op en fotografeert het resultaat.\n\nEén persoon kan de rollen van facilitator en scribent combineren bij een kleine groep. Facilitator en eigenaar zijn nooit dezelfde persoon.',
      ],
      example: {
        kind: 'worked',
        text: 'Een werksessie van twee uur bij een netbeheerder over een nieuwe weekroutine voor de werkvoorbereiding.\n\nDoel: een routine afspreken voor de planning van de week. Uitkomst: één pagina met de stappen en per stap een eigenaar. Deelnemers: zes, vier planners, de teamleider en iemand uit het veld. Eigenaar van de uitkomst: de teamleider.\n\nAgenda: 10 minuten openen (doel, regels, check-in); 35 minuten divergeren (wat heeft een goede planningsweek nodig, stil schrijven); 5 minuten pauze; 40 minuten convergeren (clusteren, stappen kiezen en ordenen); 20 minuten afsluiten (een eigenaar per stap, de eerste week afspreken); 10 minuten slotronde. Samen 120 minuten.',
      },
      said: 'Wat je hoort in projecten: “We houden een sessie. Wat precies, dat zien we dan wel.”',
      recall: [
        {
          q: 'Welke vier vragen gebruik je om een sessie te ontwerpen, in volgorde?',
          options: ['Agenda, zaal, deelnemers en catering', 'Datum, tijd, plaats en kosten', 'Doel, uitkomst, deelnemers en agenda', 'Wie, wat, waar en wanneer'],
          answer: 'Doel, uitkomst, deelnemers en agenda',
          why: 'Doel en uitkomst eerst: die bepalen wie er moet zijn en wat er op de agenda hoort.',
        },
        {
          q: 'Wat doet de eigenaar van de uitkomst?',
          options: ['Hij leidt de sessie en bewaakt de tijd', 'Hij schrijft op en maakt foto’s van het resultaat', 'Hij blijft buiten de zaal om vrij te kunnen oordelen', 'Hij gebruikt de uitkomst straks en beslist erover'],
          answer: 'Hij gebruikt de uitkomst straks en beslist erover',
          why: 'De eigenaar is wie met de uitkomst verder moet; daarom is hij bij opening en slot.',
        },
        {
          q: 'Een sessie van 90 minuten heeft 10 minuten openen, 25 minuten divergeren en 35 minuten convergeren. Hoeveel minuten blijven er over voor afsluiten?',
          number: 20,
          tolerance: 1,
          unit: 'minuten',
          why: '10 + 25 + 35 = 70 minuten. 90 − 70 = 20 minuten.',
          hint: 'Tel de drie blokken op en trek het totaal af van de lengte van de sessie.',
        },
        {
          q: 'Wat is divergeren in een sessie?',
          options: ['Een keuze maken uit een lijst met opties', 'Breed verzamelen zonder te oordelen', 'De sessie afsluiten met een ronde', 'Een lange discussie voeren over de uitkomst'],
          answer: 'Breed verzamelen zonder te oordelen',
          why: 'Divergeren vergroot het aanbod van ideeën; pas daarna ga je kiezen.',
        },
      ],
      situation: {
        scene: 'Je werkt bij een maakbedrijf. De afdelingsmanager zegt: “Plan een sessie van twee uur met de hele afdeling, twintig mensen, om het te hebben over de planning.” Je hebt geen doel, geen uitkomst en geen eigenaar.',
        ask: 'Wat zeg je?',
        model: '“Graag. Om er een goede sessie van te maken, wil ik eerst weten wat er na afloop moet liggen, zodat we de goede mensen vragen. Als het een gekozen routine is, passen zes tot acht mensen beter dan twintig. Kunnen we een kwartier bellen om doel en uitkomst op te schrijven?”',
        rubric: ['Zegt ja en houdt de vaart erin', 'Vraagt naar doel en uitkomst voor de deelnemerslijst', 'Stelt een korte, concrete volgende stap voor'],
        pushback: {
          lines: ['“Iedereen moet erbij zijn, anders voelt een deel zich buitengesloten.”', '“Ik wil niet dat jij het straks voor mij bepaalt.”'],
          model: '“Dat begrijp ik. We kunnen de uitkomst vooraf aan de hele afdeling sturen en na afloop terugkoppelen, zodat niemand buitengesloten is. U blijft de eigenaar van de uitkomst en beslist erover; ik leid alleen het proces. Zullen we dat zo noteren?”',
          rubric: ['Erkent de zorg om buitensluiting', 'Legt de rolverdeling tussen eigenaar en facilitator uit', 'Stelt voor dit vast te leggen'],
        },
      },
      sayIt: 'Leg in 60 seconden uit wat een werksessie is, welke vier ontwerpvragen je stelt en welke rollen er zijn.',
      terms: [
        {
          term: 'Facilitator',
          def: 'Degene die een sessie leidt en het proces bewaakt, zonder de inhoud te sturen.',
        },
        {
          term: 'Eigenaar van de uitkomst',
          def: 'Wie de uitkomst van de sessie straks gebruikt en erover beslist.',
        },
        {
          term: 'Scribent',
          def: 'Degene die tijdens de sessie zichtbaar opschrijft en het resultaat fotografeert.',
        },
        {
          term: 'Divergeren',
          def: 'Breed verzamelen van ideeën of punten, zonder ze al te beoordelen.',
        },
        {
          term: 'Convergeren',
          def: 'Ordenen, kiezen en uitwerken van wat bij het divergeren is verzameld.',
        },
      ],
    },
    {
      id: 'pm.formats.brownpaper',
      title: 'Een brown-papersessie houden',
      pre: [
        {
          q: 'Je wilt met een groep een proces in kaart brengen. Wie nodig je uit?',
          options: [
            'Alleen de managers, die weten het meest',
            'Zoveel mogelijk mensen, ook uit andere afdelingen en van buiten het proces',
            'Eén persoon per rol die in het proces werkt',
            'Alleen de vaste planners, want die kennen het proces het best',
          ],
          answer: 'Eén persoon per rol die in het proces werkt',
          why: 'Eén per rol dekt het hele proces, ook de overdrachten, zonder dat de groep te groot wordt.',
        },
      ],
      teach: [
        'Een brown paper is een lang vel papier van drie tot vijf meter op de muur. De groep tekent met geeltjes het proces van links naar rechts. Eerst de huidige situatie (as-is), later pas de gewenste situatie (to-be). Het is een gangbare werkwijze; er bestaat geen enkele norm voor.\n\nBepaal vooraf het begin en het eind van het proces, bijvoorbeeld met de grenzen uit Grenzen trekken met SIPOC in Intake.',
        'Voorbereiding. Nodig één persoon per rol uit, bij elkaar zes tot twaalf mensen, ook degene die het werk krijgt en wie het overdraagt. Zorg voor drie tot vijf meter papier, geeltjes in afgesproken kleuren, stiften en tape, en een lege muur. Reserveer drie uur.\n\nLeg uit: we tekenen hoe het nu echt gaat, niet hoe het volgens de procedure hoort.',
        'Loop het proces van links naar rechts. Eén kleur voor stappen, een andere voor problemen en vragen. Geef elke rol een eigen zwembaan (swim lane): een rij per afdeling of rol, onder elkaar. Markeer elke overdracht (handover) en elke wachttijd (waiting time), want daar zit vaak het verlies.\n\nLaat de groep praten en de stappen zelf plakken; jij bewaakt het proces en de volgorde.',
        'Valideer met de groep door de hele kaart nog een keer van links naar rechts te lopen: klopt het, mist er iets? Fotografeer de kaart. Teken haar de volgende dag schoon en stuur haar rond; de gewenste situatie volgt in een tweede sessie.\n\nHeb je cijfers nodig over doorlooptijd en voorraden, dan is de waardestroomanalyse de volgende stap: zie Waardestroomanalyse (VSM) in de module Technisch probleemoplossen in Engineering.',
      ],
      example: {
        kind: 'worked',
        text: 'Een brown-papersessie bij een netbeheerder over de werkvoorbereiding van storingsherstel. Tien mensen: vier planners, twee monteurs, een werkvoorbereider, een inkoper, de teamleider en iemand van de klantenservice. Vier meter papier, gele geeltjes voor stappen, roze voor problemen.\n\nAgenda van 180 minuten: 15 openen, 15 grenzen en regels, 70 stappen plakken, 10 pauze, 30 problemen en vragen, 25 valideren, 15 afsluiten.\n\nResultaat: 23 stappen, 7 overdrachten en 4 plekken waar het werk wacht op een handtekening. Je tekent het de volgende dag schoon, stuurt het rond, en plant de sessie over de gewenste situatie.',
      },
      said: 'Wat je hoort in projecten: “Zo gaat het nooit in de praktijk. Dit is hoe het in de procedure staat.”',
      recall: [
        {
          q: 'Waar markeer je op de brown paper vooral extra, omdat daar vaak het verlies zit?',
          options: ['Bij de eerste en de laatste stap van het proces', 'Bij overdrachten en wachttijden', 'Bij stappen die de manager het belangrijkst vindt', 'Bij stappen waarover iedereen het eens is'],
          answer: 'Bij overdrachten en wachttijden',
          why: 'Op overdrachten en wachttijden blijft het werk liggen of gaat informatie verloren.',
        },
        {
          q: 'Wat doe je als laatste stap in de sessie zelf?',
          options: [
            'De kaart met de groep valideren en fotograferen',
            'De gewenste situatie meteen volledig tekenen, nog voor de pauze',
            'De kaart meenemen om hem thuis in alle rust schoon te tekenen',
            'De groep naar huis sturen zonder terug te kijken op de sessie',
          ],
          answer: 'De kaart met de groep valideren en fotograferen',
          why: 'Valideren met de groep voorkomt dat de kaart straks door één persoon bestreden wordt.',
        },
        {
          q: 'Op een kaart staan 24 stappen, waarvan 6 een overdracht zijn. Hoeveel procent van de stappen is een overdracht?',
          number: 25,
          tolerance: 1,
          unit: '%',
          why: '6 / 24 = 0,25, dus 25%.',
          hint: 'Deel het aantal overdrachten door het totaal aantal stappen.',
        },
        {
          q: 'Hoeveel mensen nodig je ongeveer uit voor een brown-papersessie?',
          options: ['Twee of drie, zodat het snel gaat', 'Vier of vijf, zodat iedereen veel kan zeggen', 'Zestien of meer, zodat alle afdelingen erbij zijn', 'Zes tot twaalf, één per rol'],
          answer: 'Zes tot twaalf, één per rol',
          why: 'Zes tot twaalf past rond één muur en dekt de rollen in het proces.',
        },
      ],
      situation: {
        scene: 'Je leidt een brown-papersessie bij een maakbedrijf. Na een uur zegt de teamleider: “Zo gaat het niet echt. Dat stuk van de planning wordt anders gedaan.” Een planner antwoordt dat het wel zo gaat.',
        ask: 'Wat doe je op dat moment?',
        model: '“Het lijkt erop dat jullie het verschillend zien. Mag ik beide versies op de kaart zetten, de ene met geel en de andere met een tweede kleur, met erbij wie het zo doet? Dan kijken we straks hoe vaak elk voorkomt, en waar het verschil zit.”',
        rubric: ['Maakt het verschil zichtbaar zonder te kiezen', 'Zet beide versies op de kaart', 'Stelt voor te kijken hoe vaak elk voorkomt'],
        pushback: {
          lines: ['“Dit kost tijd. Wij moeten gewoon één versie hebben.”', '“Als het niet klopt, is dat jullie fout, niet de mijne.”'],
          model: '“Ik neem dat serieus. We werken de twee versies nu niet uit; ze erop zetten kost twee minuten. Het gaat niet om schuld, maar om zien wat er echt gebeurt. Als we één versie kiezen terwijl er twee zijn, mist de verbetering later de helft van het werk.”',
          rubric: ['Neemt de tijdsdruk serieus', 'Haalt de schuldvraag weg', 'Legt het risico uit van één versie kiezen'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een brown-papersessie voorbereidt en leidt.',
      terms: [
        {
          term: 'Brown paper',
          def: 'Een lang vel papier op de muur waarop een groep met geeltjes een proces van links naar rechts tekent.',
        },
        {
          term: 'Huidige situatie',
          def: 'Hoe het proces nu echt loopt, ook waar dat afwijkt van de procedure.',
        },
        {
          term: 'Gewenste situatie',
          def: 'Hoe het proces na de verbetering moet lopen; volgt na de huidige situatie.',
        },
        {
          term: 'Overdracht',
          def: 'Het moment waarop werk van de ene afdeling of persoon naar de andere gaat.',
        },
        {
          term: 'Zwembaan',
          def: 'Een rij op de kaart voor één afdeling of rol, zodat je ziet wie wat doet.',
        },
        {
          term: 'Wachttijd',
          def: 'De tijd dat werk ligt te wachten tot iemand het oppakt, bijvoorbeeld op een handtekening.',
        },
      ],
    },
    {
      id: 'pm.formats.design',
      title: 'Ontwerpkeuzes voor een sessie',
      pre: [
        {
          q: 'Een proces wordt door 18 mensen op drie locaties uitgevoerd. Wat is het grootste probleem als je één brown-papersessie in één zaal houdt?',
          options: ['Drie tot vijf meter papier is te kort voor het hele proces', 'De groep is te groot voor één muur en moet ervoor reizen', 'Er is geen tijd om de kaart dezelfde dag schoon te tekenen', 'De sponsor kan maar op één van de drie locaties aanwezig zijn'],
          answer: 'De groep is te groot voor één muur en moet ervoor reizen',
          why: 'Eén muur trekt zo’n zes tot twaalf mensen; een grotere groep valt in subgroepen of in stilte.',
        },
      ],
      teach: [
        'Een sessie is een reeks afwegingen. Groepsgrootte: zes tot twaalf werkt rond één muur; meer mensen betekent subgroepen of twee sessies. Duur: houd één blok tot ongeveer drie uur; beter twee korte sessies dan één van zes uur. Voorwerk (pre-work): een korte taak vooraf, bijvoorbeeld elk de eigen stappen op geeltjes, scheelt tijd in de zaal maar wordt niet door iedereen gedaan.',
        'Zaal, online of hybride? Een online sessie (remote session) draait op een digitaal whiteboard met timer en stemmen, bijvoorbeeld Miro of Mural (geen aanbeveling), in blokken van hooguit 90 minuten. Je hebt dan iemand nodig die de tool bedient. Hybride gaat volgens de regel uit Het overlegsysteem van één project: iedereen op een eigen scherm.\n\nDe sponsor in de zaal toont belang en versnelt besluiten; erbuiten praten mensen vrijer. Laat de sponsor openen en bij het slot terugkomen.',
        'Het tweerollenprobleem (two-role problem): je bent facilitator én inhoudelijk deskundige, en stuurt dan zonder het te merken. Los het op door iemand anders te laten faciliteren, of door hardop te zeggen wanneer je even uit de rol stapt om inhoud in te brengen. Gebruik het niet om je eigen antwoord door te drukken.\n\nVoor een grondoorzaaksessie staat de aanpak in Een grondoorzaaksessie begeleiden in de module Technisch probleemoplossen in Engineering.',
        'Het sessieformat (session format) kies je voor de situatie. Brown paper past niet bij te veel mensen, een proces van vijf stappen, een groep die alleen online kan, of gevoelige gegevens over personen. Gebruik dan een digitaal bord, een gesprek of anonieme cijfers.\n\nBeschrijven twee mensen een ander proces? Kies niet wie gelijk heeft. Zet beide versies op de kaart in twee kleuren, vraag hoe vaak elke voorkomt en ga zo nodig kijken op de vloer.',
      ],
      example: {
        kind: 'faded',
        text: 'Een proces voor het plannen van onderhoud wordt uitgevoerd door 18 mensen op drie vestigingen, zes per vestiging. De sponsor wil “een sessie waarin we het proces vastleggen en verbeteren”. Reistijd tussen de vestigingen is twee uur. Een van de vestigingen werkt in ploegen. Je bent zelf ook deskundige over het systeem waarin het onderhoud wordt vastgelegd.',
        ask: 'Kies groepsgrootte, vorm, aantal sessies en rollen. Wat doe je met jezelf als deskundige?',
        reveal: 'Niet één grote sessie. Drie lokale brown-papersessies van zes mensen op de eigen vestiging, op een tijdstip dat bij de ploegen past, elk drie uur. Daarna één online sessie van 90 minuten met twee of drie vertegenwoordigers per vestiging om de drie kaarten op een digitaal bord naast elkaar te leggen en de verschillen te bespreken.\n\nRollen: iemand van elke vestiging scribent; jij faciliteert de online sessie en laat de lokale sessies door de teamleiders leiden na een korte instructie, zodat je niet je eigen antwoord stuurt. De sponsor opent de online sessie en komt voor het slot terug.',
      },
      said: 'Wat je hoort in projecten: “Dan houden we gewoon één grote sessie met iedereen.”',
      recall: [
        {
          q: 'Wat is het tweerollenprobleem?',
          options: [
            'Twee deelnemers willen tegelijk het woord en de rest zwijgt',
            'Een sessie heeft twee eigenaars die het oneens zijn over het doel',
            'Je leidt en bent ook deskundige, en stuurt zonder het te merken',
            'De sponsor en jij hebben elk een eigen doel voor de sessie',
          ],
          answer: 'Je leidt en bent ook deskundige, en stuurt zonder het te merken',
          why: 'Wie ook deskundige is, voegt onbedoeld eigen antwoorden toe in plaats van het proces te leiden.',
        },
        {
          q: 'Wanneer past brown paper niet?',
          options: ['Bij een groep die alleen online kan samenkomen', 'Bij een proces met meer dan twintig stappen', 'Bij een groep van acht mensen in één zaal', 'Bij een proces dat door meerdere afdelingen wordt uitgevoerd'],
          answer: 'Bij een groep die alleen online kan samenkomen',
          why: 'Brown paper vraagt een muur en een groep in één ruimte; online gebruik je een digitaal bord.',
        },
        {
          q: 'Een sessie van 3 uur met 14 deelnemers. Hoeveel persoonsuren kost die sessie?',
          number: 42,
          tolerance: 1,
          unit: 'uur',
          why: '14 × 3 = 42 persoonsuren.',
          hint: 'Vermenigvuldig het aantal deelnemers met de duur van de sessie in uren.',
        },
        {
          q: 'Twee mensen beschrijven hetzelfde proces verschillend. Wat doe je?',
          options: [
            'Je laat de hoogste in rang kiezen, dan is het meteen duidelijk',
            'Je stemt erover en de meerderheid wint, ook als het nipt is',
            'Je laat de sessie stoppen tot de twee het onderling eens zijn',
            'Je zet beide versies op de kaart en vraagt hoe vaak elk voorkomt',
          ],
          answer: 'Je zet beide versies op de kaart en vraagt hoe vaak elk voorkomt',
          why: 'Beide versies zichtbaar maken laat zien waar het verschil zit zonder dat iemand gezichtsverlies lijdt.',
        },
      ],
      situation: {
        scene: 'Je wordt gevraagd een proces te laten vastleggen waarbij de sponsor zelf in de zaal wil zitten. Je weet dat de medewerkers dan minder vrij praten, omdat hun afdeling vaak de schuld krijgt van vertragingen.',
        ask: 'Wat stel je de sponsor voor?',
        model: '“Uw aanwezigheid laat zien dat dit belangrijk is. Mag ik voorstellen dat u de sessie opent met wat u wilt bereiken en daarna vertrekt? U komt terug voor het slot, als de groep laat zien wat ze gevonden heeft. Dan praten de mensen vrij en hoort u het resultaat meteen.”',
        rubric: ['Erkent de waarde van de aanwezigheid van de sponsor', 'Stelt een rol voor bij opening en slot', 'Beschermt de openheid van de groep'],
        pushback: {
          lines: ['“Ik wil weten wat ze echt zeggen. Ik ga niet weg.”', '“Als ze iets te verbergen hebben, wil ik dat weten.”'],
          model: '“Dat begrijp ik. Wat ze zeggen laat ik u zien als geordende kaart, zonder namen; dat is meer dan u hoort als u erbij zit, want dan houden ze zich in. Als u toch wilt blijven, zou ik u vragen alleen te luisteren en niet te reageren. Welke van de twee wilt u?”',
          rubric: ['Neemt de behoefte aan inzicht serieus', 'Biedt twee concrete opties', 'Legt het effect op openheid uit'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je voor een situatie de groepsgrootte, de vorm en de rollen van een sessie kiest.',
      terms: [
        {
          term: 'Tweerollenprobleem',
          def: 'Facilitator en inhoudelijk deskundige tegelijk zijn, waardoor je de groep onbedoeld stuurt.',
        },
        {
          term: 'Voorwerk',
          def: 'Een korte taak die deelnemers vóór de sessie doen, zodat er in de zaal tijd overblijft.',
        },
        {
          term: 'Online sessie',
          def: 'Een sessie op afstand, meestal op een digitaal bord met timer en stemfunctie.',
        },
        {
          term: 'Sessieformat',
          def: 'De vorm van een sessie die je kiest voor de situatie, zoals brown paper, digitaal bord of gesprek.',
        },
      ],
    },
    {
      id: 'pm.formats.facilitation',
      title: 'Faciliteren als vak',
      pre: [
        {
          q: 'Een sponsor vraagt: “Kun je een sessie leiden waarin iedereen het eens wordt met mijn plan?” Wat doe je?',
          options: [
            'Je zegt ja en bereidt een sterke presentatie voor die het plan verkoopt',
            'Je zegt nee en gaat er verder niet meer op in',
            'Je zegt ja en laat de deelnemers alvast de plannen uitvoeren',
            'Je vraagt eerst wat er echt open is en wat de sessie oplevert',
          ],
          answer: 'Je vraagt eerst wat er echt open is en wat de sessie oplevert',
          why: 'Zonder te weten wat open is, weet je niet of er iets te faciliteren valt.',
        },
      ],
      teach: [
        'Faciliteren begint voor de sessie met een contract. Spreek met de sponsor af waar de sessie over gaat; dat heet uitkomst contracteren (contracting the outcome): wat staat vast, wat is open, wat gebeurt er met de uitkomst en wie beslist. Leg het op een pagina vast. Staat alles vast, dan is het geen werksessie maar een presentatie, en noem je het zo.',
        'Neutraliteit (neutrality) betekent dat je het proces leidt en het antwoord niet stuurt. Je kunt dat breken met een sturende vraag, een eigen geeltje, of de volgorde waarin je mensen aan het woord laat. Heb je een belang, zeg het of draag de sessie over.',
        'De IAF-competenties van de International Association of Facilitators noemen zes gebieden: samenwerkende klantrelaties opbouwen, passende groepsprocessen plannen, een deelnemende omgeving scheppen en vasthouden, de groep naar passende en bruikbare uitkomsten leiden, vakkennis opbouwen en onderhouden, en een positieve professionele houding voorleven. Gebruik ze als checklist voor je eigen praktijk.',
        'Een eerlijke procesbeschrijving maakt teams kwetsbaar: overdrachten, wachttijden en omwegen wijzen snel naar mensen. Weeg wie voor de eerlijkheid betaalt. Zorg voor psychologische veiligheid (psychological safety) met regels: het gaat over het proces, niet over personen, er staan geen namen in de uitkomst en vooraf is afgesproken wie het papier straks ziet. Hoe je veiligheid opbouwt, staat in Psychologische veiligheid opbouwen in Mensen leiden.',
        'Wie bezit de uitkomst erna? Een uitkomst zonder eigenaar sterft. Noem de eigenaar vooraf en spreek af wanneer die terugkomt met een antwoord.\n\nWanneer haal je een externe facilitator? Als jij zelf deel van het probleem bent, als je de inhoud te goed kent om neutraal te blijven, of als de hiërarchie of de spanning (een reorganisatie, een conflict) te hoog is. Dan is een buitenstaander veiliger voor iedereen.',
      ],
      example: {
        kind: 'faded',
        text: 'Een sponsor bij een maakbedrijf vraagt je een workshop te leiden die “het nieuwe organogram bevestigt”. De directie heeft het organogram al vastgesteld. Er zijn 25 medewerkers uitgenodigd. De sponsor zegt: “Het moet vooral het gevoel geven dat ze er deel van waren.”',
        ask: 'Wat spreek je af voordat je ja zegt?',
        reveal: 'Vraag wat nog open is. Het organogram staat vast; dat noem je dan ook zo. Wat wel open kan zijn is de invoering: de overgang, de taakverdeling in de teams, wat mensen nodig hebben. Voorstel: een sessie over “hoe voeren we de nieuwe indeling in”, met een uitkomst en een eigenaar, in plaats van een workshop die bevestigt.\n\nLeg vast wat er met de uitkomst gebeurt, wie beslist en wanneer de sponsor terugkoppelt. Als de sponsor volhoudt dat alleen bevestiging gewenst is, bied je een informatiebijeenkomst aan en weiger je de naam workshop: je past op voor schijninspraak, zie Legitimiteit en schijninspraak.',
      },
      said: 'Wat je hoort in projecten: “Doe maar een sessie, dan komt er vanzelf draagvlak.”',
      recall: [
        {
          q: 'Wat leg je vast als je een sessie met de sponsor contracteert?',
          options: ['Wat vast en wat open is, wie beslist en wat er met de uitkomst gebeurt', 'De agenda per blok, de werkvormen en wie welk blok van de dag begeleidt', 'Wie er komen, hoe lang het duurt en wie de uitnodiging verstuurt', 'Welke uitkomst de sponsor wil en hoe je de groep daarheen leidt'],
          answer: 'Wat vast en wat open is, wie beslist en wat er met de uitkomst gebeurt',
          why: 'Zo weten alle partijen waar de groep invloed op heeft en waar niet.',
        },
        {
          q: 'Wat betekent neutraliteit van een facilitator?',
          options: [
            'Je hebt geen mening over het onderwerp en houdt je uit het gesprek',
            'Je laat de groep zonder structuur praten en grijpt nergens in',
            'Je leidt het proces en stuurt het antwoord niet',
            'Je spreekt alleen met de sponsor af wat er in de sessie gebeurt',
          ],
          answer: 'Je leidt het proces en stuurt het antwoord niet',
          why: 'Neutraal zijn gaat over je rol in het gesprek, niet over of je iets vindt.',
        },
        {
          q: 'Wanneer haal je een externe facilitator?',
          options: [
            'Als de groep groter is dan tien mensen en de sessie lang duurt',
            'Als je zelf deel van het probleem bent of de spanning te hoog is',
            'Als de sponsor niet bij de sessie aanwezig kan zijn deze keer',
            'Altijd bij de eerste sessie van elk project voor een nieuwe klant',
          ],
          answer: 'Als je zelf deel van het probleem bent of de spanning te hoog is',
          why: 'Een buitenstaander heeft geen belang in de uitkomst en is veiliger voor de groep.',
        },
        {
          q: 'Wat is de IAF?',
          options: ['Een Nederlandse wet voor sessies met werknemers in organisaties', 'Een softwarepakket voor online sessies en whiteboards', 'Een norm voor het ontwerpen van agenda’s en tijdschema’s', 'Een beroepsvereniging van facilitators'],
          answer: 'Een beroepsvereniging van facilitators',
          why: 'De IAF is een internationale beroepsvereniging; haar competenties zijn bruikbaar als checklist.',
        },
      ],
      situation: {
        scene: 'Een directeur bij een netbeheerder vraagt je een sessie te leiden over “ideeën voor de nieuwe werkwijze”. Je vermoedt dat de nieuwe werkwijze al is gekozen en dat de sessie vooral draagvlak moet scheppen.',
        ask: 'Wat zeg je tegen de directeur?',
        model: '“Graag. Om het goed te doen, wil ik weten welk deel nog open is, zodat we de mensen alleen over dat deel om ideeën vragen. Wat is al besloten, en wat gebeurt er met wat zij zeggen? Als de keuze vaststaat, noemen we het een toelichting met ruimte voor vragen, en laten we de sessie over de invoering gaan.”',
        rubric: ['Vraagt wat open is en wat vaststaat', 'Vraagt wat er met de uitkomst gebeurt', 'Biedt een eerlijke naam en inhoud voor de sessie'],
        pushback: {
          lines: ['“Laat de naam maar. Ik wil gewoon dat ze meepraten.”', '“Dit gaat te veel gedoe worden. Ik wil het eenvoudig.”'],
          model: '“Meepraten werkt alleen als ze merken dat het telt. Als we vragen om ideeën over iets dat al vaststaat, merken ze dat en haken ze af, ook voor een volgende keer. Een duidelijke naam en één open vraag kost een kwartier voorbereiding en voorkomt dat u het vertrouwen kwijtraakt.”',
          rubric: ['Erkent het doel van meepraten', 'Legt het effect op vertrouwen uit', 'Houdt de extra inspanning klein'],
        },
      },
      sayIt: 'Leg in 60 seconden uit wat je met een sponsor afspreekt voordat je een sessie accepteert en wanneer je een externe facilitator inschakelt.',
      terms: [
        {
          term: 'Uitkomst contracteren',
          def: 'Met de sponsor vooraf afspreken wat vaststaat, wat open is, wat er met de uitkomst gebeurt en wie beslist.',
        },
        {
          term: 'Neutraliteit',
          def: 'Het proces leiden zonder het antwoord te sturen; een belang meld je of draag je over.',
        },
        {
          term: 'IAF-competenties',
          def: 'De zes competentiegebieden van de International Association of Facilitators, bruikbaar als checklist.',
        },
        {
          term: 'Psychologische veiligheid',
          def: 'Het gedeelde gevoel dat je fouten kunt toegeven en het oneens kunt zijn zonder daarvoor gestraft te worden (Edmondson).',
        },
      ],
    },
    {
      id: 'pm.formats.diverge',
      title: 'Eerst veel ideeën, dan kiezen',
      pre: [
        {
          q: 'Een team zoekt ideeën om de wachttijd aan een balie te verkorten. Wat werkt vaak beter dan iedereen om de beurt een idee laten noemen?',
          options: [
            'Eén ervaren persoon laten opschrijven wat hij denkt dat werkt',
            'Eerst een paar minuten ieder voor zich opschrijven, dan delen',
            'De groep een uur laten discussiëren over de beste oplossing',
            'De ideeën beoordelen zodra ze genoemd zijn',
          ],
          answer: 'Eerst een paar minuten ieder voor zich opschrijven, dan delen',
          why: 'Eerst alleen schrijven houdt ideeën vast die anders tijdens het wachten op je beurt verdwijnen.',
        },
      ],
      teach: [
        'Creatief groepswerk heeft twee slagen, die je gescheiden houdt: eerst divergeren, dan convergeren (kiezen). Wie al tijdens het verzamelen oordeelt, snijdt ideeën af voordat ze zijn uitgewerkt. Osborn (Applied Imagination, 1953) gaf twee principes: oordeel uitstellen (deferring judgment) en streven naar veel ideeën. De vier regels die je soms ziet, worden verschillend verwoord; houd het bij deze twee.',
        'Een open brainstorm heeft een probleem: er praat er maar één tegelijk. De anderen wachten op hun beurt, houden hun idee vast, vergeten het of laten het varen. Dat heet productieblokkade (production blocking). Diehl en Stroebe (1987) vonden in hun experimenten dat dit het grootste deel verklaarde van waarom groepen minder ideeën opleveren dan even veel mensen die apart werken. Angst voor een oordeel en meeliften speelden een kleinere rol. Zeg toch “vaak” en niet “altijd”: het hangt af van de groep en de taak.',
        'Stil schrijven (silent writing, ook brainwriting) lost dat op. Iedereen schrijft vijf minuten alleen ideeën op geeltjes. Daarna deel je ze, groepeer je gelijke ideeën en geef je de groepen een naam: clusteren (affinity grouping). Stille mensen tellen mee en een hoge functie stuurt minder.\n\nKiezen kan met stippen; zie Een terugblik ontwerpen in Afsluiten voor stippenstemmen. Voor een grondoorzaaksessie staat het stille schrijven van ideeën vóór de deskundige spreekt in Een grondoorzaaksessie begeleiden in de module Technisch probleemoplossen in Engineering.',
        'Een groepsmethode helpt als je veel invalshoeken of kennis nodig hebt, of als mensen het resultaat moeten dragen. Laat één persoon gewoon beslissen als het antwoord al bekend is, het besluit van die persoon is, of de vraag eenvoudig of dringend is.\n\nVraag je een groep om ideeën terwijl het besluit al genomen is, dan is dat nep. Daar gaat Legitimiteit en schijninspraak later over.',
      ],
      example: {
        kind: 'worked',
        text: 'Een team van acht bij een netbeheerder zoekt ideeën om de wachttijd aan de klantenbalie te verkorten. De cijfers zijn voorbeeldcijfers.\n\nEerst een open ronde van 20 minuten: iedereen noemt om de beurt een idee, de manager zit erbij. Resultaat: 11 ideeën, vooral van drie mensen. Twee ideeën worden meteen afgeschoten.\n\nDaarna stil schrijven: 5 minuten, ieder alleen. Resultaat: 32 geeltjes, van alle acht mensen. Je clustert ze in zes groepen. Wat anders is: meer ideeën in minder tijd, ook van de stille mensen, en geen oordeel tijdens het verzamelen.',
      },
      said: 'Wat je hoort in projecten: “Laten we even brainstormen, roep maar wat.”',
      recall: [
        {
          q: 'Wat is productieblokkade?',
          options: ['Dat de groep te veel ideeën tegelijk krijgt om te verwerken', 'Dat de manager ideeën blokkeert met een bezwaar', 'Dat de tool geen ideeën meer opslaat', 'Dat mensen hun idee verliezen terwijl ze op hun beurt wachten'],
          answer: 'Dat mensen hun idee verliezen terwijl ze op hun beurt wachten',
          why: 'In een open ronde praat er een tegelijk; wie wacht, vergeet of laat zijn idee vaak vallen.',
        },
        {
          q: 'Welke twee principes van Osborn leer je hier?',
          options: ['Oordeel uitstellen en streven naar veel ideeën', 'Direct beoordelen en één goed idee kiezen', 'Eerst stemmen en dan verzamelen', 'Praten met de hoogste in rang en dan schrijven'],
          answer: 'Oordeel uitstellen en streven naar veel ideeën',
          why: 'Uitstellen van het oordeel en kwantiteit houden de verzamelfase open.',
        },
        {
          q: 'Een open ronde levert in 20 minuten 12 ideeën op, stil schrijven in 5 minuten 30. Hoeveel ideeën per minuut levert stil schrijven op?',
          number: 6,
          tolerance: 0.1,
          unit: 'ideeën per minuut',
          why: '30 ideeën / 5 minuten = 6 ideeën per minuut.',
          hint: 'Deel het aantal geschreven ideeën door de duur van het stille schrijven in minuten.',
        },
        {
          q: 'Wanneer laat je één persoon liever gewoon beslissen?',
          options: [
            'Als er veel invalshoeken nodig zijn om iets goed te begrijpen',
            'Als mensen het besluit later zelf moeten dragen in hun werk',
            'Als het antwoord al bekend is en het besluit van hem is',
            'Als je de groep betrokken wilt houden bij het onderwerp',
          ],
          answer: 'Als het antwoord al bekend is en het besluit van hem is',
          why: 'Een groepsmethode kost tijd; als de keuze al bekend is, is het eerlijker dat de eigenaar besluit.',
        },
      ],
      situation: {
        scene: 'Je leidt een korte ideeënsessie bij een maakbedrijf. De afdelingsmanager begint al na twee minuten commentaar te geven: “Dat hebben we geprobeerd, dat werkt niet.” De anderen worden stil.',
        ask: 'Wat doe je?',
        model: '“Dank voor uw ervaring; die heb ik straks nodig. Voor nu vraag ik iedereen om vijf minuten stil ideeën op te schrijven, zonder ze te beoordelen. Daarna kiezen we samen en kijken we naar wat al geprobeerd is. Zo verliezen we geen ideeën die misschien met een kleine wijziging wel werken.”',
        rubric: ['Erkent de ervaring van de manager', 'Zet de twee slagen van divergeren en convergeren in', 'Biedt een concrete werkwijze met tijd'],
        pushback: {
          lines: ['“We hebben hier geen tijd voor geeltjes. Zeg maar wat je wilt weten.”', '“Jullie verspillen mijn tijd met dit gedoe.”'],
          model: '“Ik begrijp dat u weinig tijd hebt. Vijf minuten stil schrijven kost minder dan een open ronde, en u krijgt meer ideeën. Daarna hoort u alles in een kwartier, geordend op thema. U hoeft alleen straks te kiezen.”',
          rubric: ['Erkent de tijdsdruk', 'Laat zien dat de methode tijd bespaart', 'Geeft de manager een duidelijke taak'],
        },
      },
      sayIt: 'Leg in 60 seconden uit waarom je ideeën eerst stil laat schrijven en pas daarna kiest.',
      terms: [
        {
          term: 'Brainstorm',
          def: 'Een groepsronde om veel ideeën te verzamelen, zonder ze meteen te beoordelen.',
        },
        {
          term: 'Stil schrijven',
          def: 'Ideeën eerst alleen opschrijven en pas daarna delen, ook wel brainwriting genoemd.',
        },
        {
          term: 'Clusteren',
          def: 'Gelijke ideeën bij elkaar leggen en de groepen een naam geven.',
        },
        {
          term: 'Oordeel uitstellen',
          def: 'Ideeën niet beoordelen terwijl je ze nog verzamelt, zodat ze kunnen groeien.',
        },
        {
          term: 'Productieblokkade',
          def: 'Het verlies aan ideeën doordat mensen in een open ronde op hun beurt wachten.',
        },
      ],
    },
    {
      id: 'pm.formats.session',
      title: 'Een ideeënsessie op een digitaal bord',
      pre: [
        {
          q: 'Je leidt een ideeënsessie van een half uur op een digitaal whiteboard met acht mensen. Wat bereid je vooraf voor?',
          options: [
            'Alleen de uitnodiging; de rest ontstaat vanzelf tijdens de sessie',
            'Een lange presentatie over het onderwerp voor de hele groep',
            'Een kader met de vraag, vakken en een timer',
            'Een lijst met alle ideeën die je zelf al hebt bedacht',
          ],
          answer: 'Een kader met de vraag, vakken en een timer',
          why: 'Een voorbereid kader houdt het tempo en laat de groep meteen werken.',
        },
      ],
      teach: [
        'Een digitaal whiteboard (online whiteboard) is een gedeeld bord waarop iedereen tegelijk geeltjes plakt. Veel tools, zoals Miro en Mural (geen aanbeveling), hebben een timer, een verborgen modus en een stemfunctie; de namen verschillen per tool.\n\nVoorbereiding: één vraag in de vorm “hoe kunnen we...?”, een kader met een vak per stap en korte instructies, en de dag van tevoren testen of iedereen kan bewerken en niet alleen kijken.',
        'Een sessie van 30 minuten, stap voor stap. Welkom en regels, 3 minuten. Stil schrijven, 5 minuten, met de verborgen modus (private mode) aan: niemand ziet elkaars geeltjes tot de timer afloopt, zodat een eerste idee de rest niet stuurt. Lezen, 5. Clusteren, 7. Stemronde (voting round) met drie stippen per persoon, 3. De top drie krijgen een eigenaar en een datum, 5. Afsluiten, 2.',
        'Na afloop zet je de uitkomst binnen een dag in het plan: de top drie als acties met eigenaar en datum, de rest als lijst voor later. Bewaar een afbeelding van het bord. Een idee zonder eigenaar of datum is na een week vergeten.\n\nAls je geen tool hebt, werkt 1-2-4-All uit Liberating Structures in een zaal: eerst alleen, dan in tweetallen, in viertallen en met de hele groep, in ongeveer 15 minuten.',
      ],
      example: {
        kind: 'worked',
        text: 'Een ideeënsessie van 30 minuten bij een maakbedrijf: “hoe kunnen we de omsteltijd van lijn 3 verkorten?” Acht mensen, een digitaal bord.\n\nMinuut 0 tot 3: welkom, vraag, regels. 3 tot 8: stil schrijven met verborgen modus, 46 geeltjes. 8 tot 13: ieder leest zijn eigen geeltjes voor. 13 tot 20: clusteren in 9 groepen. 20 tot 23: stemronde, 8 × 3 = 24 stippen. 23 tot 28: de top drie krijgt een eigenaar en een datum. 28 tot 30: slotronde.\n\nNa de sessie gaan de top drie als acties in het plan.',
      },
      said: 'Wat je hoort in projecten: “Na de sessie hadden we een mooi bord, maar niemand deed er iets mee.”',
      recall: [
        {
          q: 'Waarom zet je de verborgen modus aan tijdens het stille schrijven?',
          options: ['Zodat de tool minder geheugen en rekenkracht gebruikt', 'Zodat een eerste idee van anderen niet stuurt', 'Zodat de facilitator niet kan meekijken in het bord', 'Zodat geeltjes niet per ongeluk verdwijnen'],
          answer: 'Zodat een eerste idee van anderen niet stuurt',
          why: 'Zonder verborgen modus kopieert of stuurt een eerste zichtbaar idee de anderen.',
        },
        {
          q: 'Tien mensen krijgen elk 3 stippen voor de stemronde. Hoeveel stippen worden er in totaal uitgedeeld?',
          number: 30,
          tolerance: 1,
          unit: 'stippen',
          why: '10 × 3 = 30 stippen.',
          hint: 'Vermenigvuldig het aantal mensen met het aantal stippen per persoon.',
        },
        {
          q: 'Wat gebeurt er na de sessie met de top drie?',
          options: [
            'Ze blijven op het bord staan tot de volgende sessie, dan kijken we verder',
            'Ze worden voorgelegd aan een nieuwe groep om te herzien en aan te vullen',
            'Ze worden bij de notulen van het weekoverleg gevoegd',
            'Ze komen in het plan met eigenaar en datum',
          ],
          answer: 'Ze komen in het plan met eigenaar en datum',
          why: 'Een uitkomst zonder eigenaar en datum komt niet in het werk terecht.',
        },
        {
          q: 'Welke werkvorm gebruik je in een zaal zonder tool in ongeveer een kwartier?',
          options: ['1-2-4-All: alleen, in paren, in viertallen en samen', 'Een brown-papersessie van drie uur met de hele afdeling', 'Een open brainstorm onder leiding van de manager', 'Een stemming met handopsteken, zonder voorbereiding vooraf'],
          answer: '1-2-4-All: alleen, in paren, in viertallen en samen',
          why: '1-2-4-All laat eerst mensen alleen en in kleine groepjes denken, voordat de hele groep praat.',
        },
      ],
      situation: {
        scene: 'Je leidt een online ideeënsessie. Na de stemronde staan er twee ideeën bovenaan die door een senior manager zijn bedacht. Een van de deelnemers zegt in de chat: “Natuurlijk, die kozen ze al.”',
        ask: 'Wat doe je?',
        model: '“Dank voor die opmerking. Dit zijn de uitkomsten van de stemronde, anoniem. Ik laat nu zien hoeveel stippen elk idee kreeg en welke ideeën uit het stille schrijven kwamen. Als iemand vindt dat iets onderbelicht blijft, zet ik het nu terug op het bord voordat we eigenaren kiezen.”',
        rubric: ['Neemt de opmerking serieus zonder defensief te worden', 'Maakt de stemuitslag transparant', 'Biedt ruimte om te herstellen voor de keuze'],
        pushback: {
          lines: ['“De stemming is toch niet anoniem; je ziet wie waar stemt.”', '“Ik stem niet meer mee als het toch al vaststaat.”'],
          model: '“Goed dat je dit zegt. Ik zet de stemmen om naar een anonieme weergave en doe de ronde opnieuw als je dat wilt. Er staat niets vast; de top drie krijgen vandaag eigenaren, maar de sponsor besluit pas na deze sessie wat ze met de uitkomst doen.”',
          rubric: ['Erkent de zorg over anonimiteit', 'Biedt een oplossing in de tool', 'Is eerlijk over wat vaststaat en wat niet'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een ideeënsessie van 30 minuten op een digitaal bord inricht.',
      terms: [
        {
          term: 'Digitaal whiteboard',
          def: 'Een gedeeld online bord waarop meerdere mensen tegelijk geeltjes plakken en groeperen.',
        },
        {
          term: 'Verborgen modus',
          def: 'Een stand waarin je eigen geeltjes voor anderen verborgen blijven tot de facilitator ze toont.',
        },
        {
          term: 'Timer',
          def: 'Een zichtbare klok op het bord die elk blok begrenst, zodat de sessie op tempo blijft.',
        },
        {
          term: 'Stemronde',
          def: 'Een ronde waarin iedereen een vast aantal stippen krijgt om de beste ideeën te kiezen.',
        },
        {
          term: '1-2-4-All',
          def: 'Een werkvorm uit Liberating Structures: alleen, in tweetallen, in viertallen en met de hele groep, in ongeveer 15 minuten.',
        },
      ],
    },
    {
      id: 'pm.formats.decide',
      title: 'Wie beslist, en hoe',
      pre: [
        {
          q: 'Een groep van negen heeft tien ideeën gerangschikt. Wie beslist welk idee wordt uitgevoerd?',
          options: ['De groep, met een meerderheid van stemmen', 'De facilitator, omdat die de sessie leidde', 'Dat hangt af van wie het besluit mag nemen', 'Degene die de meeste stippen heeft verzameld'],
          answer: 'Dat hangt af van wie het besluit mag nemen',
          why: 'Het besluitrecht ligt bij een eigenaar; de groep kan adviseren of besluiten als de eigenaar dat zegt.',
        },
      ],
      teach: [
        'Kies het besluitformat naar wie het besluit bezit. Vier vormen. Adviesbesluit (advice process): de eigenaar vraagt advies aan wie het raakt en wie er verstand van heeft, en besluit dan zelf; hij moet luisteren, niet volgen. Consent: het besluit gaat door als niemand een beargumenteerd bezwaar heeft; de term komt uit de sociocratie. Meerderheid (majority): meer dan de helft kiest. Consensus: iedereen kan ermee leven.',
        'Kies naar gewicht en tempo. Klein en terug te draaien: de eigenaar beslist na een snelle vraag. Groter, maar nog terug te draaien: consent of een meerderheid. Moeilijk terug te draaien en raakt veel mensen: consent van wie het raakt, of een adviesbesluit met echte inbreng. Consensus is het traagst; reserveer het voor besluiten waar steun echt nodig is.\n\nEen besluitvorm (decision rule) zeg je vóór het gesprek, niet erna.',
        'Een dominante stem en hiërarchie in de zaal vragen om een aanpak. Laat eerst stil schrijven en simultaan stemmen, zodat niemand de anderen volgt. Laat de hoogste in rang als laatste spreken. Nodig stille mensen bij naam uit. Anonieme stemmen helpen als mensen afhankelijk zijn van elkaars oordeel.\n\nNog een regel: neem een besluit buiten de zaal in een besluitnotitie; hoe, staat in Besluiten voor elkaar krijgen in Uitvoeren.',
        'Houd geen sessie als het besluit al genomen is. Om ideeën vragen terwijl de keuze vaststaat, is nep: mensen merken het. Zeg dan wat vaststaat en wat open is, en maak het een toelichting of een vraag over de invoering.\n\nAls je advies vraagt, zeg dan ook dat het advies is en wie beslist. Zo houd je het vertrouwen.',
      ],
      example: {
        kind: 'faded',
        text: 'Vier besluiten in één project bij een maakbedrijf:\n1. Op welke dag houdt het team het weekoverleg?\n2. Welke kleuren krijgt het planbord?\n3. Welke van twee leveranciers levert de nieuwe machine, die tien jaar meegaat?\n4. Gaat een afdeling over op ploegendienst?',
        ask: 'Kies per besluit een besluitformat en zeg wie in de zaal moet zitten.',
        reveal: '1. De teamleider beslist na een snelle peiling in de chat; klein en terug te draaien. 2. Een meerderheid via stippen door het team, twee minuten; het raakt hun dagelijks werk en is makkelijk te herzien. 3. De directeur is eigenaar, met een adviesbesluit: advies van onderhoud, inkoop, financiën en operators, aan tafel of via consent op de eisen. Moeilijk terug te draaien, dus echte inbreng. 4. Dit besluit ligt niet bij de groep: de directie beslist, na inbreng van de medewerkers, en de ondernemingsraad heeft bij werktijden een formele rol; vraag na wat wettelijk geldt.',
      },
      said: 'Wat je hoort in projecten: “We stemmen er gewoon over, dan is het eerlijk.”',
      recall: [
        {
          q: 'Wat is consent als besluitvorm?',
          options: [
            'Iedereen moet het volledig eens zijn, zonder voorbehoud of bezwaar',
            'Het besluit gaat door als niemand een beargumenteerd bezwaar heeft',
            'Een meerderheid van twee derde van de aanwezigen kiest voor het voorstel',
            'De hoogste in rang beslist alleen, na een korte ronde',
          ],
          answer: 'Het besluit gaat door als niemand een beargumenteerd bezwaar heeft',
          why: 'Consent vraagt geen instemming maar geen beargumenteerd bezwaar; dat is sneller dan consensus.',
        },
        {
          q: 'Hoeveel stemmen heb je minimaal nodig voor een meerderheid in een groep van 9?',
          number: 5,
          tolerance: 0.1,
          unit: 'stemmen',
          why: 'Meer dan de helft van 9 is meer dan 4,5. Dus minimaal 5.',
          hint: 'Een meerderheid is meer dan de helft; bepaal de helft en ga naar het eerstvolgende hele getal erboven.',
        },
        {
          q: 'Wat zeg je tegen een groep voordat je om ideeën vraagt over een besluit dat al vaststaat?',
          options: ['Niets, anders haken ze af', 'Dat het hun keuze is', 'Dat hun ideeën later bij de notulen komen', 'Wat vaststaat, wat open is en wie beslist'],
          answer: 'Wat vaststaat, wat open is en wie beslist',
          why: 'Zo weet de groep waar haar inbreng telt; dat bewaart het vertrouwen.',
        },
        {
          q: 'Wat doet een eigenaar in een adviesbesluit?',
          options: ['Vraagt advies aan wie het raakt en besluit dan zelf', 'Laat de groep stemmen en volgt de meerderheid', 'Wacht tot iedereen ermee kan leven en besluit dan', 'Legt het besluit bij wie het meeste advies gaf'],
          answer: 'Vraagt advies aan wie het raakt en besluit dan zelf',
          why: 'De eigenaar blijft verantwoordelijk, maar besluit pas na echte inbreng.',
        },
      ],
      situation: {
        scene: 'Je werkt met een team bij een netbeheerder aan een keuze tussen twee systemen. Na een uur discussie dringt een senior engineer aan op een stemming. Twee teamleden zijn nog niet overtuigd.',
        ask: 'Wat stel je voor?',
        model: '“Voordat we stemmen, wil ik weten wie dit besluit mag nemen en hoe. Als het een besluit van de teamleider is, doen we een adviesronde en besluit hij. Als het de groep is, vraag ik de twee die nog twijfelen wat hun bezwaar is en of dat beargumenteerd is. Dan weten we of consent kan.”',
        rubric: ['Vraagt eerst wie beslist', 'Biedt twee besluitvormen aan', 'Neemt het bezwaar van de twijfelaars serieus'],
        pushback: {
          lines: ['“Dit duurt te lang. Stemmen is eerlijk, een meerderheid beslist.”', '“Als we niet snel kiezen, kost het de planning.”'],
          model: '“Een meerderheid kan prima, maar dan wel met een besluitvorm die we vooraf afspreken. Dat kost twee minuten. Als de twee twijfelaars straks de uitvoering moeten dragen, kost een afgedwongen keuze later meer tijd dan nu twee minuten naar hun bezwaar luisteren.”',
          rubric: ['Erkent de tijdsdruk', 'Houdt de meerderheid als optie open', 'Koppelt het bezwaar aan de uitvoering'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je het besluitformat kiest naar wie het besluit bezit en hoe zwaar het is.',
      terms: [
        {
          term: 'Consent',
          def: 'Een besluit gaat door als niemand een beargumenteerd bezwaar heeft; de term komt uit de sociocratie.',
        },
        {
          term: 'Consensus',
          def: 'Een besluit waar iedereen mee kan leven, ook wie het niet de eerste keus vindt.',
        },
        {
          term: 'Adviesbesluit',
          def: 'De eigenaar vraagt advies aan wie het raakt en wie ervan weet, en besluit dan zelf.',
        },
        {
          term: 'Meerderheid',
          def: 'Meer dan de helft van de stemmen kiest; snel, maar de minderheid kan zich niet gehoord voelen.',
        },
        {
          term: 'Besluitvorm',
          def: 'De regel waarmee een groep besluit, vooraf afgesproken: eigenaar, consent, meerderheid of consensus.',
        },
      ],
    },
    {
      id: 'pm.formats.legitimacy',
      title: 'Legitimiteit en schijninspraak',
      pre: [
        {
          q: 'De directie heeft al gekozen voor een nieuwe organisatie, maar wil “het team laten meedenken”. Wat is het grootste risico?',
          options: [
            'Dat het team te veel ideeën aandraagt om te verwerken',
            'Dat mensen merken dat de uitkomst vaststond en minder gaan bijdragen',
            'Dat de sessie langer duurt dan gepland en de planning in de war raakt',
            'Dat het besluit daardoor sneller wordt genomen dan nodig is',
          ],
          answer: 'Dat mensen merken dat de uitkomst vaststond en minder gaan bijdragen',
          why: 'Mensen zien snel of hun inbreng iets doet; zo niet, dan blijft de volgende uitnodiging onbeantwoord.',
        },
      ],
      teach: [
        'Schijninspraak (consultation theatre) is om meningen vragen terwijl de uitkomst vaststaat. Mensen merken het: de uitkomst komt overeen met het plan van vóór de sessie en hun inbreng is nergens terug te zien. De prijs is groot. Ze gaan minder bijdragen en geloven een volgende uitnodiging niet meer.\n\nVertrouwen is kapitaal; elke nepsessie neemt er een stuk van weg, ook voor de volgende projectleider.',
        'Voorkom het met een mandaat van de sessie (session mandate): wat de groep mag besluiten, adviseren of alleen horen. Zet dat in de uitnodiging: “advies aan X”, “besluit door de groep” of “informatie”. Sorteer de besluiteigenaar voor (voorsorteren, zie Voor de directie in Programma’s en governance): spreek vooraf met die persoon af wat er met de uitkomst gebeurt, en laat hem de opening bijwonen.\n\nWat een senior weegt: de eigenaar moet het in de zaal zelf zeggen, niet jij namens hem.',
        'Zorg voor terugkoppeling (closing the loop): de uitkomst bereikt de eigenaar binnen een afgesproken tijd en die komt binnen bijvoorbeeld twee weken terug met een antwoord. Wat is overgenomen, wat niet en waarom? Niet overnemen mag, mits uitgelegd.\n\nZonder terugkoppeling heeft de sessie wel veel tijd gekost en geen vertrouwen opgeleverd.',
        'De geloofwaardige vraag voor elke sessie: “Wie beslist, en heeft die dat in deze zaal gezegd?” Stel haar zelf, en laat haar stellen door wie je adviseert. Een formele rol voor medezeggenschap, zoals een ondernemingsraad, is iets anders dan een sessie; vraag na wat voor jouw situatie wettelijk geldt en reken sessies niet als vervanging.',
      ],
      example: {
        kind: 'faded',
        text: 'Een ondernemingsraad hoort dat een reorganisatie bij een maakbedrijf “samen met medewerkers is bedacht” in vier sessies. De raad ontdekt dat de directie de nieuwe indeling al had gekozen vóór de eerste sessie. Medewerkers die hebben meegedaan voelen zich gebruikt. Jij leidde de sessies.',
        ask: 'Wat had de projectleider moeten doen? En wat doe je nu?',
        reveal: 'Vooraf had je gevraagd wat nog open was. Stond de indeling vast, dan had je de sessies geen co-creatie genoemd maar informatie en invoering, en alleen open delen, zoals de overgang en de taakverdeling in de teams, aan de groep voorgelegd. Je had het mandaat in de uitnodiging gezet, de directie bij de opening laten zeggen wat er met de uitkomst gebeurt en binnen twee weken terugkoppelen.\n\nNu: erken het, leg feitelijk uit wat vast stond en wat open was, corrigeer het woord co-creatie en vraag wat nu nog open is. Meld het eerst aan de ondernemingsraad en aan de medewerkers die meededen, voordat zij het van anderen horen.',
      },
      said: 'Wat je hoort in projecten: “Ze vragen onze mening, maar het is toch al besloten.”',
      recall: [
        {
          q: 'Wat is schijninspraak?',
          options: [
            'Een sessie waarin acteurs een lastige situatie naspelen met het team',
            'Inspraak die zo lang duurt dat niemand meer iets besluit',
            'Om meningen vragen terwijl de uitkomst vaststaat',
            'Een vorm van stemmen met geheime stembriefjes in de zaal',
          ],
          answer: 'Om meningen vragen terwijl de uitkomst vaststaat',
          why: 'Schijninspraak ziet eruit als inspraak, maar telt niet mee in het besluit.',
        },
        {
          q: 'Wat is het mandaat van een sessie?',
          options: ['Wat de groep mag besluiten, adviseren of alleen horen', 'De toestemming van de sponsor om de zaal te gebruiken', 'Het budget dat de sessie kost', 'De lijst met uitgenodigden en hun rollen'],
          answer: 'Wat de groep mag besluiten, adviseren of alleen horen',
          why: 'Het mandaat vertelt vooraf waar de inbreng van de groep tellen mag.',
        },
        {
          q: 'Wat bedoelt terugkoppeling hier?',
          options: [
            'Je stuurt de deelnemers een foto van het bord met alle geeltjes',
            'Je stuurt de notulen van de sessie binnen een week aan de sponsor',
            'Je vraagt de deelnemers na afloop hoe ze de sessie vonden',
            'De eigenaar laat op tijd weten wat is overgenomen en waarom',
          ],
          answer: 'De eigenaar laat op tijd weten wat is overgenomen en waarom',
          why: 'Terugkoppeling laat zien dat de inbreng telde, ook als niet alles is overgenomen.',
        },
        {
          q: 'Welke vraag stel je voor elke sessie?',
          options: ['Hoeveel mensen komen er donderdag naar de hele sessie?', 'Wie beslist, en heeft die dat in deze zaal gezegd?', 'Welke tool gebruiken we voor de stemronde?', 'Wie maakt de notulen van de sessie?'],
          answer: 'Wie beslist, en heeft die dat in deze zaal gezegd?',
          why: 'Deze vraag toetst of de sessie echt invloed heeft op een besluit.',
        },
      ],
      situation: {
        scene: 'Een directeur bij een netbeheerder vraagt je een sessie te leiden over “de nieuwe werkplekindeling”. Je hoort van de facilitymanager dat de indeling al is besteld. De directeur zegt: “Ik wil vooral dat het draagvlak krijgt.”',
        ask: 'Wat zeg je tegen de directeur?',
        model: '“Ik begrijp dat u draagvlak wilt, en dat maken we het best niet met een sessie waarvan de uitkomst al vaststaat; mensen merken dat. Wat is nog open, zoals de inrichting per afdeling of de overgang? Daarover vragen we hun advies. De rest leggen we uit. Wilt u zelf bij de opening zeggen wat er met hun inbreng gebeurt?”',
        rubric: ['Erkent het doel van draagvlak', 'Scheidt wat vaststaat van wat open is', 'Vraagt de eigenaar om het zelf te zeggen'],
        pushback: {
          lines: ['“Als ik zeg dat het vaststaat, haken ze af.”', '“Doe maar gewoon een sessie, dan voelen ze zich gehoord.”'],
          model: '“Eerlijk zeggen wat vaststaat kost u kortetermijnenthousiasme, maar wie later ontdekt dat het nep was, haakt voorgoed af. Als ik de open delen aan ze voorleg en binnen twee weken laat zien wat u ermee gedaan hebt, voelen ze zich echt gehoord. Mag ik dat zo opzetten?”',
          rubric: ['Neemt de angst voor afhaken serieus', 'Zet kortetermijn tegenover langetermijnvertrouwen', 'Stelt een concrete opzet voor'],
        },
      },
      sayIt: 'Leg in 60 seconden uit wat schijninspraak kost en hoe je een sessie een eerlijk mandaat geeft.',
      terms: [
        {
          term: 'Schijninspraak',
          def: 'Om meningen vragen terwijl de uitkomst al vaststaat, zodat mensen merken dat hun inbreng niet telt.',
        },
        {
          term: 'Terugkoppeling',
          def: 'De eigenaar komt binnen een afgesproken tijd terug met wat is overgenomen en wat niet, en waarom.',
        },
        {
          term: 'Mandaat van de sessie',
          def: 'Wat de groep mag besluiten, adviseren of alleen horen, vooraf in de uitnodiging gezet.',
        },
        {
          term: 'Besluiteigenaar',
          def: 'De persoon die het besluit neemt waar de sessie input voor levert.',
        },
      ],
    },
    {
      id: 'pm.formats.floor',
      title: 'Vier werkvormen buiten de vergaderzaal',
      pre: [
        {
          q: 'Je start een verbeterproject op een productieafdeling. Wat helpt het meest om de echte situatie te leren kennen?',
          options: [
            'Op de vloer kijken en vragen stellen',
            'Alle rapporten van het afgelopen jaar lezen op kantoor in de zaal',
            'Een vragenlijst naar alle medewerkers sturen en de uitkomsten bijhouden',
            'Een presentatie van de afdelingsmanager laten geven in de vergaderzaal',
          ],
          answer: 'Op de vloer kijken en vragen stellen',
          why: 'Op de plek zie je wat rapporten en gesprekken in de zaal missen.',
        },
      ],
      teach: [
        'Rapporten en overleg laten zien wat mensen zeggen; de werkvloer laat zien wat er gebeurt. Een projectleider heeft vier werkvormen buiten de vergaderzaal: de gembawalk, de interviewronde, de demo en het kaizen-event. Elk heeft een doel, deelnemers, een duur en een opbrengst, en elk past bij een ander moment in de route.',
        'De gembawalk (gemba walk) is de vaste ronde van een leidinggevende over de vloer. Als projectleider loop je er een mee: kijken en vragen waar het werk gebeurt, voordat je iets doet. Het Lean Enterprise Institute omschrijft het als direct kijken en vragen om de huidige situatie te begrijpen vóór je handelt. Duur: 30 tot 60 minuten. Opbrengst: notities en een lijst vragen.\n\nHoe je kijkt, staat in Ga kijken: de gemba in de module Technisch probleemoplossen in Engineering; de vaste ronde in Leiderstandaardwerk en de gembawalk in Landen.',
        'De interviewronde (interview round): losse gesprekken met mensen uit verschillende lagen. Acht tot tien gesprekken van 45 minuten; opbrengst: thema’s en citaten. De demo: het werkende resultaat laten zien aan de mensen die ermee gaan werken, op de plek waar ze het gebruiken; 30 tot 60 minuten; opbrengst: een lijst met reacties.\n\nHet kaizen-event: een team verbetert een paar dagen, vaak drie tot vijf, één gebied; opbrengst: een veranderd gebied en een opvolglijst. Zie Kaizen: elke dag en in events in de module Technisch probleemoplossen in Engineering.',
        'Wanneer past welke werkvorm? Gembawalk en interviewronde aan het begin, in Intake en Plannen: leren wat er is. De demo tijdens Uitvoeren: laten zien wat er gebouwd is. Het kaizen-event als een gebied begrepen is en een team het kan veranderen.\n\nZe vullen elkaar aan: eerst kijken, dan vragen, dan bouwen en laten zien, dan met een team verbeteren.',
      ],
      example: {
        kind: 'worked',
        text: 'De eerste tien weken van een verbeterproject bij een maakbedrijf met de vier werkvormen in volgorde.\n\nWeek 1: gembawalk van 45 minuten op twee ploegen met de ploegleider; opbrengst: een lijst met negen vragen. Week 2 en 3: interviewronde, negen gesprekken van 45 minuten. Week 4: terugkoppeling van de thema’s aan het team. Week 6 en 8: demo van het nieuwe planbord bij de lijn, voor de operators en de ploegleider; opbrengst: twaalf reacties, vijf aanpassingen. Week 9 en 10: een kaizen-event van vier dagen op de verpakkingsafdeling; opbrengst: een nieuwe opstelling en een opvolglijst van elf acties.',
      },
      said: 'Wat je hoort in projecten: “Kom het zelf eens kijken, dan snap je het.”',
      recall: [
        {
          q: 'Wat is een gembawalk?',
          options: [
            'Een rondleiding langs de lijn om bezoekers het proces te laten zien',
            'Gaan kijken en vragen waar het werk gebeurt, voordat je iets doet',
            'Een ronde langs de werkplekken om de veiligheidsregels te controleren',
            'Een wandeling van de directie om de medewerkers te bedanken',
          ],
          answer: 'Gaan kijken en vragen waar het werk gebeurt, voordat je iets doet',
          why: 'De gembawalk is bedoeld om de huidige situatie te begrijpen vóór je iets doet.',
        },
        {
          q: 'Wanneer plan je een interviewronde in de route?',
          options: ['Aan het eind, om het resultaat te evalueren', 'Alleen als een kaizen-event mislukt is', 'Tijdens een demo om de reacties te noteren', 'Aan het begin, om te leren wat er speelt'],
          answer: 'Aan het begin, om te leren wat er speelt',
          why: 'Een interviewronde is een manier om vroeg thema’s te vinden.',
        },
        {
          q: 'Wat is de opbrengst van een kaizen-event?',
          options: ['Een rapport voor de directie met aanbevelingen', 'Een lijst met namen van mensen die moeten verbeteren', 'Een veranderd gebied en een opvolglijst met acties', 'Een nieuw werkprocedureboek voor het hele bedrijf'],
          answer: 'Een veranderd gebied en een opvolglijst met acties',
          why: 'Een event verandert een gebied en laat acties achter voor na het event.',
        },
        {
          q: 'Waar laat je een demo plaatsvinden?',
          options: [
            'Op de plek waar de gebruikers het resultaat gebruiken',
            'In een vergaderzaal op kantoor, met dia’s en een goede beamer',
            'Alleen bij de sponsor op de afdeling, zonder de gebruikers erbij',
            'Online met een opgenomen video, zodat iedereen het later kan zien',
          ],
          answer: 'Op de plek waar de gebruikers het resultaat gebruiken',
          why: 'Op de plek zie je meteen of het werkt voor de mensen die het gebruiken.',
        },
      ],
      situation: {
        scene: 'Je start een project bij een maakbedrijf. De manager zegt: “Ik regel een zaal voor een kick-off en een workshop. Op de vloer heb je niets te zoeken, daar werken ze hard.”',
        ask: 'Wat zeg je?',
        model: '“Die twee bijeenkomsten zijn goed. Mag ik daarnaast een uur met de ploegleider meelopen, zonder iets te vragen of te veranderen? Dan weet ik wat er echt gebeurt en maak ik de workshop beter. Ik kom buiten de piektijden en zeg tegen de operators dat ik leer, niet beoordeel.”',
        rubric: ['Erkent de geplande bijeenkomsten', 'Vraagt een kleine, concrete tijd op de vloer', 'Beperkt de verstoring voor de operators'],
        pushback: {
          lines: ['“Als jij rondloopt, denken ze dat ze beoordeeld worden.”', '“We hebben net veiligheidsregels aangescherpt; je mag niet zomaar de lijn op.”'],
          model: '“Dat is een goed punt. Ik kom met de ploegleider mee, die kan uitleggen waarvoor ik er ben. Ik volg de veiligheidsregels, haal de juiste beschermingsmiddelen en blijf op de looppaden. Kunnen we samen een tijd afspreken en de operators vooraf informeren?”',
          rubric: ['Erkent de zorg om beoordeling', 'Neemt de veiligheidsregels serieus', 'Stelt een afspraak en voorinformatie voor'],
        },
      },
      sayIt: 'Leg in 60 seconden uit welke vier werkvormen buiten de vergaderzaal een projectleider kan organiseren en wanneer elk past.',
      terms: [
        {
          term: 'Gembawalk',
          def: 'Een vaste ronde van een leidinggevende over de vloer om het proces te zien en vragen te stellen.',
        },
        {
          term: 'Interviewronde',
          def: 'Losse gesprekken met mensen uit verschillende lagen om vroeg te leren wat er speelt.',
        },
        {
          term: 'Demo',
          def: 'Het werkende resultaat laten zien aan de mensen die ermee gaan werken, op de plek waar ze het gebruiken.',
        },
        {
          term: 'Kaizen-event',
          def: 'Een team dat een paar dagen fulltime, vaak drie tot vijf, aan één gebied werkt; ook kaizen blitz genoemd.',
        },
      ],
    },
    {
      id: 'pm.formats.interviews',
      title: 'Een interviewronde houden',
      pre: [
        {
          q: 'Je gaat negen mensen interviewen over hun werk. Hoe kies je wie?',
          options: [
            'De negen mensen die het langst in dienst zijn bij de afdeling',
            'Alleen de mensen die de manager voor je aanwijst als geschikt',
            'Een spreiding over lagen en rollen, ook kritische mensen',
            'Alleen de mensen die zelf aangeven dat ze graag willen meedoen',
          ],
          answer: 'Een spreiding over lagen en rollen, ook kritische mensen',
          why: 'Een spreiding over lagen en rollen voorkomt dat je één kant van het verhaal hoort.',
        },
      ],
      teach: [
        'Een interviewronde aan het begin van een project levert thema’s op die je nergens in documenten vindt. Kies acht tot tien mensen over lagen en rollen heen, een steekproef over lagen (sample across levels): uitvoerders, planners, een teamleider, een manager, iemand uit het proces ervoor of erna. Vraag de sponsor om een lijst en voeg er twee zelf aan toe. Een gangbare werkwijze in adviesopdrachten; er is geen vaste norm.',
        'Maak een interviewleidraad (interview guide) met vijf open vragen. Bijvoorbeeld: Hoe ziet een gewone week eruit? Waar loop je tegenaan? Wat gaat goed en moet blijven? Wat zou je als eerste veranderen? Met wie moet ik nog praten? Duur: 45 minuten. Luister, stel vervolgvragen en stel zelf geen oplossingen voor.',
        'Schrijf op in de woorden van de ander, niet in je eigen interpretatie. Spreek vooraf af hoe anoniem het is: je rapporteert thema’s en citaten zonder namen, en alleen jij leest de notities. Plan na elk gesprek 30 minuten om de notities af te maken.\n\nZeg het eerlijk als je iets niet kunt beloven, bijvoorbeeld dat je bij strafbare feiten of een veiligheidsrisico iets moet melden.',
        'Daarna thematiseren (theming): zet elk punt op een geeltje, groepeer ze in ongeveer vijf thema’s, tel hoeveel mensen elk thema noemden en kies bij elk thema één citaat. Presenteer dit in één terugkoppelsessie (playback session) van een uur aan de hele groep: thema’s, aantallen, citaten. Vraag: wat herkennen jullie, wat missen jullie? Doe nog geen oplossingen.\n\nVoor een review met interviews in een onafhankelijke doorlichting: zie Een projectreview leiden in Als je vastzit.',
      ],
      example: {
        kind: 'worked',
        text: 'Een interviewronde bij de afdeling planning van een netbeheerder: negen interviews.\n\nSteekproef: twee planners, twee werkvoorbereiders, een monteur, een inkoper, een teamleider, een manager, een collega van klantenservice. Leidraad met vijf vragen, 45 minuten per gesprek. Tijd: 9 × 45 + 9 × 30 minuten notities = 675 minuten, ongeveer 11 uur.\n\nThematiseren geeft vijf thema’s. Het grootste: “we horen te laat over wijzigingen in de opdracht”, genoemd door 7 van de 9. De terugkoppelsessie duurt een uur; de groep herkent vier van de vijf thema’s en voegt er een toe.',
      },
      said: 'Wat je hoort in projecten: “Dit hebben we nooit eerder aan iemand verteld.”',
      recall: [
        {
          q: 'Waarom schrijf je in de woorden van de ander op?',
          options: ['Omdat je interpretatie later het beeld kleurt', 'Omdat het de gesprekken korter en vlotter maakt', 'Omdat de ander het dan later niet kan terugzien', 'Omdat een norm voor interviews het zo voorschrijft'],
          answer: 'Omdat je interpretatie later het beeld kleurt',
          why: 'Citaten en eigen woorden houden de inhoud dichtbij wat gezegd werd.',
        },
        {
          q: 'Wat is thematiseren?',
          options: [
            'Alle gesprekken woordelijk uittypen en in een map bewaren',
            'De vragen voor het volgende gesprek verbeteren op basis van het vorige',
            'Een thema kiezen voor de kick-off van het project',
            'Punten groeperen in thema’s en tellen hoeveel mensen elk thema noemden',
          ],
          answer: 'Punten groeperen in thema’s en tellen hoeveel mensen elk thema noemden',
          why: 'Thematiseren maakt van losse gesprekken een ordening met aantallen.',
        },
        {
          q: 'Je houdt 8 interviews van 45 minuten en besteedt na elk gesprek 30 minuten aan notities. Hoeveel uur is dat in totaal?',
          number: 10,
          tolerance: 0.2,
          unit: 'uur',
          why: '45 + 30 = 75 minuten per interview. 8 × 75 = 600 minuten = 10 uur.',
          hint: 'Tel de duur van gesprek en notities op, vermenigvuldig met het aantal gesprekken en reken om naar uren.',
        },
        {
          q: 'Wat doe je in de terugkoppelsessie nog niet?',
          options: ['De thema’s en aantallen laten zien', 'Oplossingen bespreken en kiezen', 'Citaten voorlezen', 'Vragen wat de groep herkent en mist'],
          answer: 'Oplossingen bespreken en kiezen',
          why: 'Eerst herkennen, dan oplossen; anders wordt het een discussie over de eigen oplossing.',
        },
      ],
      situation: {
        scene: 'Je doet een interviewronde bij een maakbedrijf. Een operator zegt halverwege: “Ik vertel het je, maar zeg het alsjeblieft niet tegen mijn teamleider.” Je weet dat de teamleider de lijst met namen van de geïnterviewden heeft.',
        ask: 'Wat doe je?',
        model: '“Goed dat je het zegt. Ik rapporteer alleen thema’s en citaten zonder namen, en ik laat niets bij je teamleider achter dat naar jou terug te leiden is. Als een citaat te herkenbaar zou zijn, laat ik het weg of vraag ik eerst je toestemming. Is dat goed zo?”',
        rubric: ['Erkent de zorg over vertrouwelijkheid', 'Legt uit hoe je anoniem rapporteert', 'Biedt controle over te herkenbare citaten'],
        pushback: {
          lines: ['“Maar je laat toch wel zien wie wat zei als de manager erom vraagt?”', '“Anonimiteit is nep, want iedereen kent elkaars woorden.”'],
          model: '“Nee, dat heb ik vooraf met de manager afgesproken: alleen thema’s en citaten zonder namen. Is een citaat te herkenbaar, dan laat ik het weg of vraag ik toestemming. Mocht de manager erop aandringen, dan zeg ik dat ik het niet kan geven, en ik vertel jou dat.”',
          rubric: ['Maakt de afspraak met de manager duidelijk', 'Erkent dat citaten herkenbaar kunnen zijn', 'Belooft transparant te zijn over druk'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een interviewronde van negen gesprekken opzet en terugkoppelt.',
      terms: [
        {
          term: 'Interviewleidraad',
          def: 'Een korte lijst open vragen die je in elk gesprek gebruikt, zodat de gesprekken vergelijkbaar zijn.',
        },
        {
          term: 'Steekproef over lagen',
          def: 'Een keuze van mensen uit verschillende niveaus en rollen, zodat je niet één kant van het verhaal hoort.',
        },
        {
          term: 'Thematiseren',
          def: 'Punten uit gesprekken groeperen in thema’s en tellen hoeveel mensen elk thema noemden.',
        },
        {
          term: 'Terugkoppelsessie',
          def: 'Eén sessie waarin je de thema’s, aantallen en citaten teruggeeft aan de groep, zonder oplossingen.',
        },
      ],
    },
    {
      id: 'pm.formats.demo',
      title: 'Een demo op de vloer en de juiste werkvorm kiezen',
      pre: [
        {
          q: 'Een nieuw planbord staat klaar in een pilotcel. Wat is de beste manier om het aan de operators te laten zien?',
          options: ['Een presentatie in de kantine tijdens de lunch', 'Bij het bord zelf, met de operators, en vragen om reacties', 'Een e-mail met foto’s en een handleiding', 'Een demonstratie door de projectleider zonder dat zij iets mogen doen'],
          answer: 'Bij het bord zelf, met de operators, en vragen om reacties',
          why: 'Op de plek en met de handen aan het bord merk je wat werkt en wat niet.',
        },
      ],
      teach: [
        'Een review buiten software laat een werkend resultaat zien waar het gebruikt wordt, bijvoorbeeld een pilotcel, een nieuw bord of een nieuw formulier. Nodig de gebruikers en de beslisser uit, 30 tot 45 minuten, en laat een gebruiker het echt proberen. Opbrengst: een lijst met reacties. De Scrum Guide (2020) zegt dat de Sprint Review een werksessie is en nooit een poort om waarde vrij te geven; dat uitgangspunt geldt ook hier. Zie De vijf events van Scrum en Stage-gate en agile in de maakindustrie.',
        'Het verschil is feedback versus goedkeuring (feedback versus approval). Vraag om feedback, niet om goedkeuring. “Wat zou je tegenhouden dit te gebruiken?” levert meer op dan “Is dit goed?”. Goedkeuring is een beslissing die ergens anders valt, bij de sponsor of een gate. De demo vraagt wat er beter kan. Schrijf binnen een week op wat je aanpast en wat niet, en waarom, en stuur het terug aan de deelnemers.',
        'Kies de werkvorm naar de vraag en de fase. Wat gebeurt hier eigenlijk? Gembawalk. Wat vinden en missen mensen? Interviewronde. Werkt dit voor jou? Demo. Kan dit gebied nu door een team beter worden? Kaizen-event. In de vroege fase leer je (gembawalk, interviews), in het midden laat je zien (demo), als een gebied begrepen is verbeter je met een team.',
        'Uitzonderingen op de vloer. Ploegendienst: doe de demo bij elke ploeg of bij de ploegwissel; één keer is niet genoeg en de nachtploeg telt mee. Veiligheidsregels: spreek met de leidinggevende wat mag en wat niet, zoals beschermingsmiddelen en verboden zones. Een ondernemingsraad die geïnformeerd moet worden: meld het vooraf als iets het werk of de meting van mensen verandert. Locaties op afstand: laat een lokale leider de demo doen of doe haar via beeld met iemand ter plekke.',
      ],
      example: {
        kind: 'faded',
        text: 'Drie momenten in één project bij een maakbedrijf.\n\nA. Week 2: niemand is het eens over waarom de uitval op lijn 3 stijgt.\nB. Week 7: een nieuw bord voor de ploegwissel hangt in een pilotcel van lijn 3. Er werken twee ploegen.\nC. Week 12: de verpakkingsafdeling is vol wachttijd en het team wil dat zelf verbeteren.',
        ask: 'Kies voor elk moment de werkvorm en ontwerp de demo voor B: waar, wie, hoe lang en wat vraag je?',
        reveal: 'A: een gembawalk bij lijn 3 op beide ploegen, eventueel aangevuld met een paar gesprekken; de vraag is wat er gebeurt, niet wat mensen vinden. B: een demo bij het bord tijdens de ploegwissel, op beide ploegen, voor de operators, de ploegleider en de productiemanager, 30 minuten. Je laat een operator het bord echt gebruiken en vraagt: “Wat zou je tegenhouden dit te gebruiken?” Je meldt het vooraf aan de ondernemingsraad als het de meting van mensen raakt. C: een kaizen-event, mits er een eigenaar is voor de verbeteringen; zo niet, dan eerst die afspraak (zie de volgende les).',
      },
      said: 'Wat je hoort in projecten: “Mooi dat jullie het laten zien. Maar nu mogen we het niet meer veranderen?”',
      recall: [
        {
          q: 'Wat is het verschil tussen feedback en goedkeuring in een demo?',
          options: [
            'Feedback is schriftelijk en goedkeuring is altijd mondeling gegeven',
            'Feedback komt van de sponsor en goedkeuring komt van de operators',
            'Feedback vraagt wat beter kan, goedkeuring valt elders',
            'Er is geen verschil; beide woorden betekenen dat iemand akkoord is',
          ],
          answer: 'Feedback vraagt wat beter kan, goedkeuring valt elders',
          why: 'De demo is een werksessie voor verbetering; een poort is een ander moment.',
        },
        {
          q: 'Welke werkvorm past bij de vraag “wat gebeurt hier eigenlijk?”',
          options: ['Een gembawalk', 'Een demo', 'Een kaizen-event', 'Een stuurgroep'],
          answer: 'Een gembawalk',
          why: 'Een gembawalk is bedoeld om te zien wat er echt gebeurt vóór je iets verandert.',
        },
        {
          q: 'Wat doe je bij een demo in ploegendienst?',
          options: ['Je doet één demo bij de dagploeg; de rest hoort het wel', 'Je stuurt de nachtploeg een e-mail', 'Je wacht tot alle ploegen tegelijk aanwezig zijn', 'Je doet de demo bij elke ploeg of bij de ploegwissel'],
          answer: 'Je doet de demo bij elke ploeg of bij de ploegwissel',
          why: 'Elke ploeg gebruikt het resultaat, dus elke ploeg moet erop kunnen reageren.',
        },
        {
          q: 'Waarvoor gebruik je de Scrum Guide hier?',
          options: ['Als voorschrift dat elke demo op de vloer moet volgen', 'Als uitgangspunt: een review is een werksessie, geen poort', 'Als bewijs dat demo’s in de maakindustrie verplicht zijn', 'Als lijst van rollen die bij elke review aanwezig zijn'],
          answer: 'Als uitgangspunt: een review is een werksessie, geen poort',
          why: 'De Scrum Guide beschrijft de review als werksessie; dat nemen we als uitgangspunt over, geen voorschrift.',
        },
      ],
      situation: {
        scene: 'Je organiseert een demo van een nieuw bord in een pilotcel. De productiemanager komt kijken en zegt tegen de operators: “Dit gaat het worden, jullie moeten het gewoon gebruiken.” De operators zeggen niets meer.',
        ask: 'Wat doe je?',
        model: '“Dank u wel dat u erbij bent. Ik zou graag willen horen wat de operators ervan vinden voordat we het uitrollen. Mag ik hen vragen wat hen zou tegenhouden het te gebruiken? Wat zij zeggen gebruiken we om het aan te passen, en over een week laat ik zien wat we hebben veranderd.”',
        rubric: ['Dankt de manager voor zijn aanwezigheid', 'Draait de vraag om naar wat gebruik zou tegenhouden', 'Belooft binnen een week te laten zien wat er veranderd is'],
        pushback: {
          lines: ['“Ik wil niet dat ze denken dat ze mogen kiezen. Het is besloten.”', '“Als ik hier commentaar toelaat, krijg ik straks weerstand.”'],
          model: '“Dat begrijp ik. Ik zeg dan duidelijk dat het bord blijft maar dat de inrichting nog kan veranderen. Dat is eerlijker dan vragen of het goed is. Reacties nu voorkomen weerstand later, want we passen dingen aan voor de uitrol, niet erna.”',
          rubric: ['Erkent dat het besluit genomen is', 'Scheidt wat vaststaat van wat open is', 'Koppelt reacties aan minder weerstand later'],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een demo op de vloer ontwerpt en hoe je kiest tussen de vier werkvormen.',
      terms: [
        {
          term: 'Review',
          def: 'Een sessie waarin je het werkende resultaat laat zien aan de gebruikers en de beslisser, om te horen wat er beter kan.',
        },
        {
          term: 'Werkend resultaat',
          def: 'Iets dat gebruikers echt kunnen proberen, geen plan of presentatie.',
        },
        {
          term: 'Feedback versus goedkeuring',
          def: 'Feedback vraagt wat er beter kan; goedkeuring is een beslissing die elders valt.',
        },
        {
          term: 'Pilotcel',
          def: 'Eén afgebakend deel van de vloer waar een nieuwe werkwijze eerst wordt uitgeprobeerd.',
        },
      ],
    },
    {
      id: 'pm.formats.kaizenevent',
      title: 'Een kaizen-event laten doen',
      pre: [
        {
          q: 'Een productiemanager zegt: “Laten we volgende maand een kaizenweek doen.” Wat vraag je als eerste?',
          options: [
            'Welke ruimte er die week vrij is om het team in te laten werken',
            'Hoe de zaal wordt ingericht en waar de lunch vandaan komt',
            'Wie de beste facilitator van het hele bedrijf is voor deze week',
            'Wie na afloop de verbeteringen overneemt en de mensen vrijmaakt',
          ],
          answer: 'Wie na afloop de verbeteringen overneemt en de mensen vrijmaakt',
          why: 'Een event staat of valt met vrijmaken en overnemen; de rest is uitvoering.',
        },
      ],
      teach: [
        'Hoe een kaizen-event verloopt, staat in Kaizen: elke dag en in events in de module Technisch probleemoplossen in Engineering. Hier gaat het om het kaizen-event laten doen (commissioning an event): de beslissing erover. Kosten: zes tot tien mensen, drie tot vijf dagen, gemiste productie, overwerk en vervanging. Reken in persoonsuren: 8 mensen × 4 dagen × 8 uur = 256 uur, nog zonder productieverlies.',
        'Wie maakt de mensen vrij? Dat is de eigenaar van het gebied, meestal de productiemanager. De sponsor opent het event, beschermt de week (geen telefoontjes naar het team) en is bij de afsluitpresentatie (close-out report-out) om te horen wat het team vond en voorstelde. Hij besluit daar zoveel mogelijk meteen.\n\nZonder zo’n rol wordt de afsluiting een toelichting zonder gevolgen.',
        'De opvolglijst (follow-up list) maakt of breekt het event: elke actie met eigenaar en datum, in de eerste 30 dagen elke week een kwartier bij elkaar (zie 30-dagenactielijst in Kaizen: elke dag en in events). Eén persoon bezit de lijst na afloop.\n\nGeen eigenaar, dan blijven de verbeteringen liggen en leert de afdeling dat events een hoop moeite zonder resultaat zijn.',
        'Wanneer geen event? Als er geen eigenaar na afloop is, als het probleem metingen over maanden nodig heeft (zeldzame storingen, variatie) of als het gebied binnenkort reorganiseert. Kies dan dagelijkse kaizen of een kleiner event.\n\nOok de gembawalk van directeuren is een valkuil: die wordt snel een inspectieronde (inspection tour) waarbij mensen opruimen en zwijgen. Spreek af dat de ronde om te leren is, loop mee met de lijnleider, stel vragen in plaats van oordelen, geef ter plekke geen opdrachten behalve bij veiligheid en vertel achteraf wat je leerde.',
      ],
      example: {
        kind: 'faded',
        text: 'De productiemanager van een maakbedrijf wil “volgende maand een kaizenweek” op een lijn waar zeven mensen werken. Er is niemand die de verbeteringen na afloop overneemt; de lijnleider heeft er geen tijd voor en de manager zegt: “Het team regelt dat zelf wel.” De lijn draait op volle orde en de ploegleider vreest voor de levering.',
        ask: 'Wat spreek je af voordat het event plaatsvindt? Wat kost het en wanneer zeg je nee?',
        reveal: 'Eerst een eigenaar met mandaat en tijd, bijvoorbeeld de lijnleider met twee uur per week voor 30 dagen, en één probleem in één getal (de omsteltijd). Kosten: 7 mensen × 4 dagen × 8 uur = 224 persoonsuren, plus productie die in die dagen wegvalt; spreek af wie dat betaalt en welke levering ze eerst naar voren halen. De sponsor opent en bezoekt de afsluiting, en de opvolglijst gaat naar één persoon.\n\nZegt de manager dat er niemand is voor de opvolging, dan zeg je nee tegen het event en bied je dagelijkse kaizen of een kleiner event aan. Je beslist binnen een week.',
      },
      said: 'Wat je hoort in projecten: “Het event was geweldig, maar daarna is er niets meer gebeurd.”',
      recall: [
        {
          q: 'Een kaizen-event met 8 mensen duurt 3 dagen van 8 uur. Hoeveel persoonsuren is dat, nog zonder productieverlies?',
          number: 192,
          tolerance: 1,
          unit: 'uur',
          why: '8 × 3 × 8 = 192 persoonsuren.',
          hint: 'Vermenigvuldig het aantal mensen met het aantal dagen en de uren per dag.',
        },
        {
          q: 'Welke rol heeft de sponsor bij een kaizen-event?',
          options: [
            'Opent het event, beschermt de week en besluit bij de afsluiting',
            'Leidt het event zelf als facilitator, van begin tot eind',
            'Houdt zich er helemaal buiten om het team vrij te laten werken',
            'Schrijft achteraf het rapport en stuurt het door aan de directie',
          ],
          answer: 'Opent het event, beschermt de week en besluit bij de afsluiting',
          why: 'De sponsor geeft mandaat en maakt besluiten bij de afsluiting; zonder dat blijft het bij een presentatie.',
        },
        {
          q: 'Wanneer laat je geen kaizen-event doen?',
          options: ['Als het team erg enthousiast is om te beginnen', 'Als het gebied al eens eerder is verbeterd door een team', 'Als niemand de verbeteringen na afloop overneemt', 'Als er een ervaren facilitator beschikbaar is voor die week'],
          answer: 'Als niemand de verbeteringen na afloop overneemt',
          why: 'Zonder eigenaar na afloop blijft de opvolglijst liggen en verliest het event zijn waarde.',
        },
        {
          q: 'Waarom wordt een gembawalk van directeuren snel een inspectieronde?',
          options: [
            'Omdat directeuren te weinig tijd hebben om echt rond te lopen',
            'Omdat mensen opruimen en zwijgen als iemand oordeelt',
            'Omdat de vloer altijd te rommelig is voor een bezoek',
            'Omdat er geen veiligheidsregels zijn voor bezoekers van de afdeling',
          ],
          answer: 'Omdat mensen opruimen en zwijgen als iemand oordeelt',
          why: 'Een oordeel van boven laat mensen zich verdedigen; een vraag laat ze vertellen.',
        },
      ],
      situation: {
        scene: 'Een directeur bij een netbeheerder wil “een kaizenweek” bij een planafdeling. Hij laat je de datum van volgende maand zien en zegt dat hij zelf de eerste dag komt kijken. Er is nog niet gesproken met de teamleider.',
        ask: 'Wat zeg je?',
        model: '“Dank u voor het initiatief. Voordat we de datum vastleggen, wil ik met de teamleider praten: wie neemt de verbeteringen over, wie maakt het team vrij en waar valt het werk dan? Als u op de eerste dag komt, kunt u het beste openen en vertellen wat u wilt leren, en de laatste dag terugkomen om te horen wat het team heeft gevonden.”',
        rubric: ['Dankt voor het initiatief', 'Vraagt naar eigenaar en vrijmaken van mensen', 'Geeft de directeur een nuttige rol'],
        pushback: {
          lines: ['“Ik heb geen tijd om dat allemaal te regelen. Regel jij dat maar.”', '“Het gaat om de resultaten. De rest vinden ze zelf wel uit.”'],
          model: '“Ik regel de voorbereiding, maar twee dingen kan alleen u: de teamleider vrijmaken en besluiten wie de opvolging doet. Dat kost u een kwartier. Als dat ontbreekt, krijgt u een week met enthousiasme en daarna niets. Zullen we dat kwartier deze week plannen?”',
          rubric: ['Neemt de voorbereiding op zich', 'Maakt duidelijk wat alleen de directeur kan', 'Stelt een kort moment voor deze week voor'],
        },
      },
      sayIt: 'Leg in 60 seconden uit wat een kaizen-event kost, wat je vooraf afspreekt en wanneer je nee zegt.',
      terms: [
        {
          term: 'Kaizen-event laten doen',
          def: 'De beslissing een kaizen-event te laten plaatsvinden: kosten, wie vrijmaakt en wie opvolgt.',
        },
        {
          term: 'Afsluitpresentatie',
          def: 'De presentatie aan het eind van het event waarin het team laat zien wat het vond en voorstelt, en de sponsor besluit.',
        },
        {
          term: 'Opvolglijst',
          def: 'De acties die na het event openstaan, elk met eigenaar en datum, bij één persoon in beheer.',
        },
        {
          term: 'Inspectieronde',
          def: 'Een ronde over de vloer waarbij mensen zich beoordeeld voelen, opruimen en zwijgen, in plaats van vertellen.',
        },
      ],
    },
  ],
};

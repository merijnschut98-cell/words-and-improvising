// eng.quality (NL): Kwaliteit: de basis: toleranties, spreiding, procesgeschiktheid, SPC, FMEA, control plan en meten.
export default {
  lessons: [
    {
      id: 'eng.quality.tolerance',
      title: 'Nominale maat, tolerantie en specgrenzen',
      pre: [
        {
          q: 'Een as staat op tekening als Ø20 ±0,05 mm. Hij meet 20,06 mm. Wat is het?',
          options: ['Goed: hij zit maar 0,06 van de nominale maat', 'Buiten spec: afkeuren, nabewerken of een deviatie aanvragen', 'Goed, want de totale tolerantie is 0,1 mm', 'Goed, zolang het volgende deel er wel in zit'],
          answer: 'Buiten spec: afkeuren, nabewerken of een deviatie aanvragen',
          why: 'De bovengrens is 20,05. Alles daarboven is afwijkend, hoe klein het verschil ook is.',
        },
      ],
      teach: [
        'De nominale maat is de doelwaarde op de tekening. De tolerantie is hoeveel een onderdeel mag afwijken en nog steeds werkt. Ø20 ±0,05 betekent een ondergrens (LSL) van 19,95 en een bovengrens (USL) van 20,05: een tolerantieveld van 0,10 mm. Het kan ook ongelijk: Ø12 +0,018/0 loopt van 12,000 tot 12,018.',
        'Elke maat die telt voor passing of functie heeft een tolerantie. Maten zonder tolerantie vallen onder de algemene tolerantie in de stempel, vaak ISO 2768-m: ±0,2 mm voor maten van 6 tot 30 mm. “Er stond geen tolerantie op” klopt dus bijna nooit.',
        'Nauwer kost geld. Een tolerantie halveren kan betekenen: een betere machine, langzamer verspanen, een extra slijpstap en meer meten. Een lagerzitting heeft misschien ±0,01 mm nodig; een gat in een afdekplaat kan prima met ±0,2. Een goede engineer vraagt wat de functie nodig heeft, niet wat er precies uitziet.',
        'Buiten spec betekent afwijkend product: afkeuren, nabewerken, of “use as is” met een schriftelijke deviatie (concessie) van de klant. De kosten worden grofweg tien keer zo hoog bij elke stap verder: €1 bij de machine, €10 bij de assemblage, €100 bij de klant, en een terugroepactie kost nog veel meer.',
      ],
      example: {
        kind: 'worked',
        text: 'Een bus heeft een boring van Ø12 +0,018/0, dus tussen 12,000 en 12,018 mm. In een serie van 500 meten 15 boringen 12,021: 3% buiten spec. Gevonden bij de machine: 15 × €4,50 = €67,50 afkeur. Gevonden bij de klant: die blokkeert de hele partij, een sorteerbedrijf controleert alle 500 stuks à €0,80 (€400), de klachtenfee is €250, en jij schrijft een 8D. Dezelfde 15 onderdelen, tien keer de kosten, plus een deuk in je leveranciersrating.',
      },
      said: 'Wat engineers zeggen: “Hij is 20,06 op twintig plus-min vijf honderdste, dus hij is af. Of we keuren hem af, of kwaliteit vraagt een deviatie aan bij de klant.”',
      recall: [
        {
          q: 'Een maat is Ø40 ±0,1 mm. Hoe breed is het tolerantieveld, in mm?',
          number: 0.2,
          tolerance: 0.001,
          unit: 'mm',
          why: 'Van 39,9 tot 40,1 is een veld van 0,2 mm.',
        },
        {
          q: 'Een maat is 25 +0,05/−0,02 mm. Wat is de ondergrens, in mm?',
          number: 24.98,
          tolerance: 0.001,
          unit: 'mm',
          why: '25 − 0,02 = 24,98; de bovengrens is 25,05.',
        },
        {
          q: 'Er staat geen tolerantie bij een maat op de tekening. Wat geldt dan?',
          options: ['Alles mag', 'De algemene tolerantie in de stempel', 'De nauwste tolerantie op de tekening', 'Wat de machine haalt'],
          answer: 'De algemene tolerantie in de stempel',
          why: 'Maten zonder tolerantie vallen onder de algemene tolerantie, bijvoorbeeld ISO 2768-m.',
        },
        {
          q: 'Waarom maken engineers niet gewoon elke tolerantie heel nauw?',
          options: ['Het CAD-pakket staat het niet toe', 'Klanten verbieden het', 'Het maakt voor de kwaliteit niet uit', 'Nauwere toleranties kosten meer bewerking, tijd en meetwerk'],
          answer: 'Nauwere toleranties kosten meer bewerking, tijd en meetwerk',
          why: 'De tolerantie hoort de functie te volgen; elke extra decimaal kost geld.',
        },
      ],
      situation: {
        scene: 'Je bent bij een verspaningsbedrijf na een klacht van de klant: 40 behuizingen met een boring 0,01 mm boven de bovengrens. De kwaliteitsmanager wil de interne tolerantie op alle boringen halveren, “voor de zekerheid”.',
        ask: 'Wat vraag je voordat iedereen akkoord gaat met dat plan?',
        model: 'Hoeveel stuks waren af, hoeveel, en van welke machine en welke ploeg: is dit één oorzaak of een algemeen spreidingsprobleem? Alle boringen halveren maakt alles duurder voor één maat. En is die boring met deze tolerantie echt functioneel, of kunnen we de klant vragen of die ruimer mag?',
        rubric: [
          'Vraagt naar de feiten: hoeveel, hoe ver buiten spec, waar en wanneer',
          'Zet vraagtekens bij overal nauwer maken vanwege de kosten',
          'Vraagt of de tolerantie past bij de functie (en met de klant te bespreken is)',
        ],
      },
      sayIt: 'Leg een nieuwe planner in 60 seconden uit wat nominale maat, tolerantie en specgrenzen zijn, en waarom buiten spec snel duur wordt.',
      terms: [
        { term: 'Nominale maat', def: 'De doelwaarde van een maat op de tekening.' },
        { term: 'Tolerantie', def: 'De toegestane afwijking van de nominale maat; de breedte tussen de specgrenzen.' },
        { term: 'USL / LSL', def: 'Boven- en ondergrens van de specificatie: de randen van wat goed is.' },
        { term: 'Deviatie (concessie)', def: 'Schriftelijk akkoord van de klant om afwijkende delen toch te gebruiken.' },
      ],
    },
    {
      id: 'eng.quality.variation',
      title: 'Spreiding: gewone en speciale oorzaken',
      pre: [
        {
          q: 'Twee machines maken een onderdeel van 10 ±0,05 mm. Allebei zitten ze gemiddeld precies op 10,00 mm. Welke maakt meer afkeur?',
          options: ['Geen van beide, het gemiddelde zit op nominaal', 'De nieuwste', 'Die met de grootste spreiding', 'De snelste'],
          answer: 'Die met de grootste spreiding',
          why: 'Bij hetzelfde gemiddelde duwt een bredere spreiding meer delen over de specgrenzen.',
        },
      ],
      teach: [
        'Geen twee onderdelen zijn gelijk. Engineers beschrijven spreiding met twee getallen. Het gemiddelde zegt waar het proces zit. De standaardafwijking (σ, sigma) zegt hoe breed het spreidt. Bij een normale verdeling valt zo’n 68% binnen ±1σ van het gemiddelde en 99,7% binnen ±3σ. Gemiddeld 10,00 met een σ van 0,01 legt bijna alles tussen 9,97 en 10,03.',
        'Gewone oorzaken (common cause) zijn de vele kleine bronnen die er altijd zijn: materiaal, temperatuur, speling in de spil, hoe de operator het doet. Dat geeft een stabiele, voorspelbare spreiding. Die krijg je alleen omlaag door het systeem te veranderen: een betere machine, opspanning of methode.',
        'Speciale oorzaken (special cause) komen van een concrete gebeurtenis: een gebroken beitel, een nieuwe rol staal, een koude machine op maandagochtend, een nieuwe operator. Je ziet een sprong, een trend of een uitschieter. Die zoek je op, los je op en voorkom je.',
        'Gewone spreiding behandelen als een speciale oorzaak maakt het erger. Een operator die na elk onderdeel de offset bijstelt en zo de ruis achternaloopt, vergroot de spreiding met zo’n 40%: dat heet tampering, of “bijsturen op ruis”. De eerste vraag is dus altijd: is er iets veranderd, of is dit gewoon hoe breed het proces is?',
      ],
      example: {
        kind: 'worked',
        text: 'Een draaibank maakt assen Ø20 ±0,05. Donderdag 25 stuks: gemiddeld 20,003, σ 0,008. Drie sigma is 0,024, dus bijna alles zit tussen 19,979 en 20,027: ruim binnen 19,95 tot 20,05. Gewone spreiding; blijf van de machine af. Maandag 06:00 zitten de eerste 10 stuks gemiddeld op 20,025, en om 07:00 weer op 20,005. Die sprong is een speciale oorzaak: de machine is koud na het weekend en groeit tijdens het opwarmen. De oplossing is een opwarmprogramma van 20 minuten, niet elk uur aan de offsets draaien.',
      },
      said: 'Wat engineers zeggen: “Dat is gewoon de normale spreiding, niet aankomen. Maar die sprong op maandagochtend, daar is iets. Wat is er veranderd?”',
      recall: [
        {
          q: 'Een proces heeft een gemiddelde van 50,00 mm en een σ van 0,02 mm. Waar ligt de bovenkant van de ±3σ-spreiding, in mm?',
          number: 50.06,
          tolerance: 0.001,
          unit: 'mm',
          why: '50,00 + 3 × 0,02 = 50,06.',
        },
        {
          q: 'Welk percentage van de onderdelen valt bij een normale verdeling ongeveer binnen ±3σ van het gemiddelde?',
          number: 99.7,
          tolerance: 0.2,
          unit: '%',
          why: '68% binnen 1σ, 95% binnen 2σ, 99,7% binnen 3σ.',
        },
        {
          q: 'Een operator stelt na elk onderdeel de gereedschapsoffset bij op basis van de laatste meting. Wat gebeurt er?',
          options: ['De spreiding wordt groter', 'De spreiding wordt kleiner', 'Er verandert niets', 'Het gemiddelde verloopt, maar de spreiding blijft gelijk'],
          answer: 'De spreiding wordt groter',
          why: 'Reageren op gewone ruis voegt spreiding toe: tampering.',
        },
        {
          q: 'Welke hiervan is een speciale oorzaak?',
          options: ['Kleine temperatuurschommelingen over de dag', 'Normale speling in de spillagers', 'Een nieuwe rol van een andere staalleverancier die een sprong geeft', 'Het gebruikelijke verschil tussen delen in één serie'],
          answer: 'Een nieuwe rol van een andere staalleverancier die een sprong geeft',
          why: 'Het is een concrete, aanwijsbare gebeurtenis die het proces verschuift.',
        },
      ],
      situation: {
        scene: 'Je bent bij een plaatbewerker. De afkeur op één kantbank is in twee weken van 1% naar 4% gegaan. De operator zegt: “Dat is gewoon normale spreiding, het materiaal is nooit hetzelfde.”',
        ask: 'Wat vraag je om een speciale oorzaak te onderscheiden van gewone spreiding?',
        model: 'Is de afkeur op een bepaald moment gesprongen, of is het langzaam opgelopen? Wat is er rond dat moment veranderd: een nieuwe materiaalbatch, ander gereedschap, een andere operator, een ander programma? Als we de kanthoek per uur over de afgelopen twee weken plotten, zien we of het een verschuiving is of gewoon bredere spreiding, en dat bepaalt of we een gebeurtenis zoeken of het proces aanpakken.',
        rubric: [
          'Vraagt wanneer het veranderde: een sprong of een geleidelijk verloop',
          'Vraagt wat er veranderde aan materiaal, gereedschap, mensen of programma',
          'Stelt voor de data in de tijd te plotten om de twee te scheiden',
        ],
      },
      sayIt: 'Leg een teamleider in 60 seconden het verschil uit tussen gewone en speciale oorzaken, en waarom na elk onderdeel bijstellen een slecht idee is.',
      terms: [
        { term: 'Gemiddelde', def: 'De gemiddelde waarde: waar het proces zit.' },
        { term: 'Standaardafwijking (σ)', def: 'Hoe breed het proces rond het gemiddelde spreidt.' },
        { term: 'Gewone oorzaak', def: 'Spreiding uit vele kleine, altijd aanwezige bronnen; verander het systeem om die te verkleinen.' },
        { term: 'Speciale oorzaak', def: 'Spreiding door een concrete gebeurtenis; opzoeken en wegnemen.' },
      ],
    },
    {
      id: 'eng.quality.capability',
      title: 'Procesgeschiktheid: Cp en Cpk',
      pre: [
        {
          q: 'Een perfect gecentreerd proces heeft een Cpk van 1,0. Hoeveel onderdelen per miljoen vallen er ongeveer buiten spec?',
          options: ['Zo’n 3', 'Zo’n 60', 'Zo’n 27.000', 'Zo’n 2.700'],
          answer: 'Zo’n 2.700',
          why: 'Cpk 1,0 betekent dat de specgrenzen op ±3σ liggen, dus 0,3% valt erbuiten: 2.700 ppm.',
        },
      ],
      teach: [
        'Procesgeschiktheid vergelijkt de spreiding van het proces met de breedte van de tolerantie. Cp = tolerantiebreedte / 6σ. Met een tolerantie van 0,10 mm en een σ van 0,0125 is 6σ 0,075, dus Cp = 1,33. Cp zegt alleen of het proces zou passen als het precies in het midden zat.',
        'Cpk telt het centreren mee: de afstand van het gemiddelde tot de dichtstbijzijnde specgrens, gedeeld door 3σ. Schuif hetzelfde proces 0,025 mm richting de bovengrens, dan is er nog 0,025 over: Cpk = 0,025 / 0,0375 = 0,67. Cp is nog steeds 1,33, maar nu maak je afkeur. Cpk is nooit hoger dan Cp.',
        'Doelen: 1,33 is het gangbare minimum voor lopende productie (zo’n 63 ppm als hij gecentreerd is). 1,67 vragen klanten voor nieuwe processen en veiligheidskenmerken. Onder de 1,0 maak je elke dag afkeur en heb je 100% controle nodig.',
        'Het verschil tussen Cp en Cpk vertelt je de oplossing. Cp hoog en Cpk laag: centreren, vaak één offset. Allebei laag: de spreiding moet omlaag, en dat betekent opspanning, machine of methode, en dat kost echt geld. En een Cpk zegt alleen iets als het proces stabiel was tijdens de meting.',
      ],
      example: {
        kind: 'worked',
        text: 'Een boring is Ø30 +0,04/0: grenzen 30,000 en 30,040, tolerantie 0,040. Vijftig delen geven gemiddeld 30,026 met een σ van 0,004, dus 3σ = 0,012 en 6σ = 0,024. Cp = 0,040 / 0,024 = 1,67: de spreiding is prima. Cpk = (30,040 − 30,026) / 0,012 = 1,17: niet geschikt tegen een doel van 1,33, omdat het gemiddelde te dicht tegen de bovengrens zit. Een offset van −0,006 zet het gemiddelde op 30,020: Cpk = 0,020 / 0,012 = 1,67. Eén offset, geen investering.',
      },
      said: 'Wat engineers zeggen: “Cp is 1,7 maar Cpk is 1,1, dus het is niet de spreiding, hij zit uit het midden. Offset verschuiven en we zijn er.”',
      recall: [
        {
          q: 'De tolerantiebreedte is 0,06 mm en de σ is 0,01 mm. Wat is de Cp?',
          number: 1,
          tolerance: 0.01,
          unit: '',
          why: 'Cp = 0,06 / (6 × 0,01) = 1,0.',
        },
        {
          q: 'LSL 9,95, USL 10,05, gemiddelde 10,02, σ 0,01. Wat is de Cpk?',
          number: 1,
          tolerance: 0.01,
          unit: '',
          why: 'De dichtstbijzijnde grens is de USL: (10,05 − 10,02) / (3 × 0,01) = 1,0.',
        },
        {
          q: 'Een proces heeft een Cp van 1,8 en een Cpk van 0,9. Wat doe je eerst?',
          options: ['Een nauwkeuriger machine kopen', 'Het proces centreren', 'De tolerantie verruimen', '100% controle invoeren en het daarbij laten'],
          answer: 'Het proces centreren',
          why: 'De spreiding past ruim; het gemiddelde zit alleen te dicht tegen één grens.',
        },
        {
          q: 'Wat is het gangbare minimum voor de Cpk van een lopend productieproces?',
          options: ['0,67', '1,00', '1,33', '3,00'],
          answer: '1,33',
          why: '1,33 is het gebruikelijke minimum; 1,67 voor nieuwe processen en veiligheidskenmerken.',
        },
      ],
      situation: {
        scene: 'Je zit in een leveranciersoverleg bij een automotive klant. De leverancier laat een Cpk van 1,52 zien op een veiligheidskritische diameter en zegt: “Dus we zijn capabel, klaar.”',
        ask: 'Wat vraag je voordat je dat getal accepteert?',
        model: 'Over hoeveel stuks en hoeveel dagen is dat gemeten? Was het proces in die periode stabiel, en mogen we de regelkaart zien? Een Cpk van 30 stuks op één goede ochtend zegt weinig. En is het meetmiddel door een gauge R&R gegaan, want meetruis zit ook in die σ.',
        rubric: [
          'Vraagt naar het aantal stuks en de meetperiode',
          'Vraagt of het proces stabiel was (regelkaart) tijdens de studie',
          'Vraagt of het meetsysteem gecontroleerd is',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit wat Cp en Cpk betekenen, en waarom een hoge Cp met een lage Cpk goed nieuws is.',
      terms: [
        { term: 'Cp', def: 'Tolerantiebreedte gedeeld door 6σ: zou de spreiding passen als hij gecentreerd is?' },
        { term: 'Cpk', def: 'Afstand van gemiddelde tot de dichtstbijzijnde grens gedeeld door 3σ: past hij waar hij nu zit?' },
        { term: 'Ppk', def: 'Zoals Cpk, maar met de totale spreiding over langere tijd; vaak gevraagd bij een start.' },
        { term: 'ppm', def: 'Parts per million: afwijkende delen per miljoen.' },
      ],
    },
    {
      id: 'eng.quality.spc',
      title: 'Regelkaarten (SPC)',
      pre: [
        {
          q: 'Waar komen de regelgrenzen op een X-bar-kaart vandaan?',
          options: ['Uit de tolerantie op de tekening', 'Uit de eisen van de klant', 'Uit de handleiding van de machine', 'Uit de eigen meetdata van het proces'],
          answer: 'Uit de eigen meetdata van het proces',
          why: 'Regelgrenzen liggen op ±3σ van het proces zelf: de stem van het proces, niet van de klant.',
        },
      ],
      teach: [
        'Een regelkaart zet een meting uit in de tijd, met een middellijn en regelgrenzen op ±3σ van het proces zelf. De klassieker is de X-bar/R-kaart: elk uur meet je een steekproef van bijvoorbeeld 5 delen en je zet het gemiddelde (X-bar) en de range (R, grootste min kleinste) uit. X-bar laat zien of het midden verschuift; R of de spreiding verandert.',
        'Regelgrenzen zijn geen specgrenzen. Specgrenzen zijn wat de klant nodig heeft. Regelgrenzen zijn wat het proces normaal doet. Een punt kan binnen de regelgrenzen liggen en toch buiten spec (het proces is niet capabel), of buiten de regelgrenzen en nog binnen spec (er is iets veranderd: grijp in voordat het afkeur wordt). Specgrenzen horen niet op een X-bar-kaart, want gemiddelden spreiden minder dan losse delen.',
        'De regels die een speciale oorzaak signaleren: één punt buiten een regelgrens; 7 punten op rij aan één kant van de middellijn (sommige fabrieken gebruiken 8 of 9); 6 of meer punten op rij die steeds stijgen of dalen; 2 van de 3 punten voorbij 2σ. Bij elk daarvan: stoppen en kijken.',
        'Het zwakke punt in de meeste fabrieken: de kaarten worden keurig ingevuld, maar niemand reageert. Elke kaart heeft een reactieplan nodig: wat doet de operator als een regel afgaat, wie belt hij, wat gebeurt er met de delen sinds de laatste goede meting. Een kaart zonder reactie is behang.',
      ],
      example: {
        kind: 'worked',
        text: 'Assen Ø20 ±0,05, elk uur een steekproef van 5. Totaalgemiddelde 20,000, gemiddelde range 0,020. Bij n = 5 is de constante A2 0,577, dus de grenzen zijn 20,000 ± 0,577 × 0,020: 19,9885 tot 20,0115. Van 10:00 tot 16:00 zijn de gemiddelden 20,002, 20,004, 20,005, 20,006, 20,008, 20,009, 20,011. Allemaal binnen de grenzen, ver binnen spec, maar zeven keer op rij omhoog: een trend. Slijtage van de wisselplaat. De operator wisselt hem om 16:10, voordat er één deel af is.',
      },
      said: 'Wat engineers zeggen: “Hij zit nog binnen spec, maar dat is zeven keer op rij omhoog. Dat is de wisselplaat, nu wisselen en we maken geen enkel slecht deel.”',
      recall: [
        {
          q: 'X-bar/R-kaart, steekproefgrootte 5 (A2 = 0,577). Totaalgemiddelde 50,00 mm, gemiddelde range 0,10 mm. Wat is de bovenste regelgrens, in mm?',
          number: 50.058,
          tolerance: 0.002,
          unit: 'mm',
          why: 'UCL = 50,00 + 0,577 × 0,10 = 50,0577.',
        },
        {
          q: 'Een punt valt buiten de regelgrens, maar het deel zit nog binnen spec. Wat doe je?',
          options: ['Niets, het deel is goed', 'Nu de speciale oorzaak opzoeken', 'De regelgrenzen ruimer maken', 'De hele serie afkeuren'],
          answer: 'Nu de speciale oorzaak opzoeken',
          why: 'Er is iets veranderd in het proces; het vinden voordat delen buiten spec gaan is precies de bedoeling.',
        },
        {
          q: 'Acht punten op rij liggen boven de middellijn, allemaal binnen de regelgrenzen. Wat betekent dat?',
          options: ['Niets, ze liggen allemaal binnen de grenzen', 'De kaart is verkeerd getekend', 'Het proces is heel capabel', 'Het procesgemiddelde is verschoven'],
          answer: 'Het procesgemiddelde is verschoven',
          why: 'Een lange reeks aan één kant is heel onwaarschijnlijk bij toeval; het wijst op een verschuiving.',
        },
        {
          q: 'Waarom horen specgrenzen niet op een X-bar-kaart?',
          options: ['Gemiddelden van 5 delen spreiden minder dan losse delen', 'Klanten staan het niet toe', 'Ze zijn altijd gelijk aan de regelgrenzen', 'Specgrenzen zijn vertrouwelijk'],
          answer: 'Gemiddelden van 5 delen spreiden minder dan losse delen',
          why: 'Een gemiddelde kan er prima uitzien terwijl losse delen uit de steekproef buiten spec zitten.',
        },
      ],
      situation: {
        scene: 'Je loopt langs het SPC-bord bij een klant in de kunststof spuitgieterij. De kaarten zijn keurig ingevuld. Op twee ervan liggen deze week drie punten buiten de regelgrenzen. Er staat niets bij geschreven.',
        ask: 'Wat vraag je de teamleider?',
        model: 'Wat doet de operator als een punt buiten de grenzen valt, is er een reactieplan? Wie kijkt er naar deze kaarten, en wanneer heeft iemand voor het laatst ingegrepen op basis van een kaart? Als het antwoord “niemand” is, maken we het reactieplan echt of stoppen we met de tijd die het invullen kost.',
        rubric: [
          'Vraagt naar het reactieplan',
          'Vraagt wie de kaarten bekijkt en wanneer er voor het laatst is ingegrepen',
          'Benoemt de keuze: laten werken of stoppen met het ritueel',
        ],
      },
      sayIt: 'Leg een operator in 60 seconden uit waarom regelgrenzen niet hetzelfde zijn als specgrenzen, en wat hij doet als een punt erbuiten valt.',
      terms: [
        { term: 'Regelgrenzen', def: '±3σ van het proces zelf: wat het proces normaal doet.' },
        { term: 'Specgrenzen', def: 'Wat de klant nodig heeft, van de tekening.' },
        { term: 'X-bar/R-kaart', def: 'Kaart met gemiddelden en ranges van steekproeven in de tijd.' },
        { term: 'Reactieplan', def: 'Wat je doet, en wie je belt, als een kaart een signaal geeft.' },
      ],
    },
    {
      id: 'eng.quality.fmea',
      title: 'FMEA: risico’s vóór de start',
      pre: [
        {
          q: 'Faalwijze 1 scoort Severity 10, Occurrence 4, Detection 3 (RPN 120). Faalwijze 2 scoort 4, 6, 6 (RPN 144). Welke pak je eerst aan?',
          options: ['Faalwijze 1, want severity 10 gaat voor', 'Faalwijze 2, want die heeft de hoogste RPN', 'Allebei even hard', 'Geen van beide, ze zitten allebei onder de 200'],
          answer: 'Faalwijze 1, want severity 10 gaat voor',
          why: 'Een severity van 9 of 10 betekent een veiligheids- of wettelijk risico; daar komt actie op, wat de RPN ook is.',
        },
      ],
      teach: [
        'Een FMEA (Failure Mode and Effects Analysis) is een gestructureerde teamsessie vóór de start van productie. Voor elke processtap (PFMEA) of ontwerpfunctie (DFMEA) vraagt het team: hoe kan het misgaan (faalwijze), wat gebeurt er dan (effect), waarom zou het gebeuren (oorzaak), en wat doen we al om het te voorkomen of te ontdekken (beheersmaatregelen)?',
        'Elke regel krijgt drie scores van 1 tot 10. Severity: hoe erg het effect is; 9 of 10 is veiligheid of wetgeving. Occurrence: hoe waarschijnlijk de oorzaak is. Detection: hoe groot de kans is dat we het vinden voordat het de deur uitgaat; let op, 1 betekent vrijwel zeker gevonden en 10 geen kans. RPN = S × O × D, maximaal 1.000.',
        'De RPN heeft nadelen: heel verschillende risico’s krijgen hetzelfde getal, en teams leren net onder de drempel te scoren. De AIAG-VDA FMEA (2019) heeft hem vervangen door Action Priority (hoog, midden, laag), die eerst naar severity kijkt, dan occurrence, dan detection. Alleen een ontwerpwijziging verlaagt de severity; preventie verlaagt de occurrence; betere controles verlagen de detection.',
        'Timing is alles. Een FMEA vóór de design freeze kan het product en het proces nog veranderen. Eentje die na de start van productie wordt geschreven om het PPAP-dossier te vullen, is papierwerk. Bij een goede FMEA zitten ontwerp, procesengineering, kwaliteit, onderhoud en een operator aan tafel, en hij wordt na elke klacht bijgewerkt.',
      ],
      example: {
        kind: 'worked',
        text: 'Stap: een lager in een wielnaafhuis persen. Faalwijze: lager niet volledig op zijn plek. Effect: lager loopt uit, geluid, mogelijk schade aan het wiel: S = 8. Oorzaak: te lage perskracht door versleten gereedschap: O = 5. Huidige controle: de operator kijkt ernaar: D = 7. RPN = 8 × 5 × 7 = 280. Actie: kracht-wegbewaking op de pers, die elk deel buiten het curvevenster afkeurt: D = 2. Nieuwe RPN = 8 × 5 × 2 = 80. De severity blijft 8, want alleen een ontwerpwijziging maakt het effect minder erg.',
      },
      said: 'Wat engineers zeggen: “Severity negen en we vertrouwen op een visuele check? Dat is op z’n best een detection van zeven. Daar moet vóór SOP een poka-yoke op.”',
      recall: [
        {
          q: 'Een faalwijze scoort S 7, O 4, D 5. Wat is de RPN?',
          number: 140,
          tolerance: 0.5,
          unit: '',
          why: '7 × 4 × 5 = 140.',
        },
        {
          q: 'Wat betekent een detection-score van 1?',
          options: ['De fout wordt vrijwel zeker niet ontdekt', 'De fout wordt vrijwel zeker ontdekt', 'De fout komt één keer voor', 'De fout is onschadelijk'],
          answer: 'De fout wordt vrijwel zeker ontdekt',
          why: 'De detectieschaal is omgekeerd: laag is goed.',
        },
        {
          q: 'Welke actie kan de severity-score verlagen?',
          options: ['Een cameracontrole toevoegen', 'De operators trainen', 'Vaker onderhoud doen', 'Het ontwerp zo veranderen dat het effect minder schadelijk is'],
          answer: 'Het ontwerp zo veranderen dat het effect minder schadelijk is',
          why: 'Severity gaat over het effect; alleen het ontwerp veranderen verandert het effect.',
        },
        {
          q: 'Wanneer levert een FMEA het meeste op?',
          options: ['Voordat ontwerp en proces vastliggen', 'Direct na de eerste klantklacht', 'Als het PPAP-dossier wordt samengesteld', 'Bij de jaarlijkse audit'],
          answer: 'Voordat ontwerp en proces vastliggen',
          why: 'Dan kunnen de bevindingen het product en het proces nog goedkoop veranderen.',
        },
      ],
      situation: {
        scene: 'Je helpt een klant een nieuwe assemblagelijn op te starten, over zes weken. De PFMEA is door één kwaliteitsengineer gekopieerd van een oudere lijn. Elke RPN zit onder de 100.',
        ask: 'Wat vraag je?',
        model: 'Wie zaten er in de sessie, en wat is er anders aan deze lijn dan aan de oude: nieuwe machines, nieuwe productkenmerken, nieuwe leveranciers? Welke regels hebben een severity van 9 of 10, en wat is daar de detectiemaatregel: als dat een visuele check is, wil ik dat vóór de start opgepakt zien. Kunnen we ontwerp, onderhoud en een operator twee halve dagen bij elkaar krijgen?',
        rubric: [
          'Vraagt wie hem gemaakt heeft en wat er nieuw is ten opzichte van de gekopieerde lijn',
          'Gaat direct naar de punten met hoge severity en hun beheersmaatregelen',
          'Stelt een echte multidisciplinaire sessie vóór de start voor',
        ],
      },
      sayIt: 'Leg een projectsponsor in 60 seconden uit wat een FMEA is en waarom hij na de start te laat is.',
      terms: [
        { term: 'Faalwijze', def: 'De manier waarop iets mis kan gaan in een stap of functie.' },
        { term: 'RPN', def: 'Risk priority number: Severity × Occurrence × Detection.' },
        { term: 'Action Priority (AP)', def: 'AIAG-VDA-beoordeling (hoog, midden, laag) die eerst naar severity kijkt.' },
        { term: 'PFMEA / DFMEA', def: 'FMEA van het proces / van het ontwerp.' },
      ],
    },
    {
      id: 'eng.quality.controlplan',
      title: 'Control plan, meten en PPAP',
      pre: [
        {
          q: 'Een gauge R&R-studie laat zien dat het meetsysteem 45% van de tolerantie gebruikt. Wat betekent dat?',
          options: ['Het meetmiddel is prima', '45% van de delen is fout', 'Bijna de helft van de tolerantie wordt opgegeten door meetruis', 'Het proces is voor 45% capabel'],
          answer: 'Bijna de helft van de tolerantie wordt opgegeten door meetruis',
          why: 'Dicht bij de grenzen kun je goed/fout-beslissingen niet vertrouwen; boven de 30% is het meetmiddel niet acceptabel.',
        },
      ],
      teach: [
        'Het control plan (beheersplan) is een tabel die per processtap zegt welke kenmerken je controleert: de spec, het meetmiddel, steekproefgrootte en frequentie, wie meet, hoe het wordt vastgelegd en het reactieplan. Voorbeeldregel: “Boring Ø30 H7, luchtmeter, 1 op 20, operator, SPC-kaart; bij afwijking: stoppen, terug tot de laatste goede meting in quarantaine, teamleider bellen.” Het is de brug van de FMEA naar de werkvloer.',
        'Meten is zelf ook een proces, met eigen spreiding. MSA (meetsysteemanalyse) controleert dat. De bekendste studie is de gauge R&R: bijvoorbeeld 10 delen, 3 operators, elk deel 3 keer gemeten. Herhaalbaarheid (repeatability) is de spreiding bij dezelfde persoon en hetzelfde meetmiddel; reproduceerbaarheid (reproducibility) is het verschil tussen mensen.',
        'De uitkomst geef je als % van de tolerantie. Onder de 10%: goed. 10 tot 30%: acceptabel, afhankelijk van toepassing en kosten. Boven de 30%: niet acceptabel. Vuistregel van tien: de resolutie van het meetmiddel is hoogstens een tiende van de tolerantie. Een schuifmaat die op 0,01 mm afleest, is nutteloos bij een tolerantie van 0,02 mm.',
        'PPAP (Production Part Approval Process) is het automotive-pakket dat een leverancier indient voordat hij seriedelen mag leveren: tekening en maatrapport, FMEA, control plan, MSA, capability-studies, monsterdelen en een getekende Part Submission Warrant (PSW). Level 3 is standaard. Onder al dat papier beantwoordt het één vraag: kan dit proces goede delen maken, op tempo?',
      ],
      example: {
        kind: 'worked',
        text: 'Regel in het control plan voor een as met buitendiameter 20 ±0,02 (tolerantie 0,04 mm). Het voorstel is een digitale schuifmaat met 0,01 mm resolutie. Vuistregel van tien: je hebt 0,004 of beter nodig, dus de schuifmaat valt af. Met een micrometer (0,001 mm) geeft een gauge R&R van 10 delen × 3 operators × 3 herhalingen 90 metingen en een meet-σ van 0,001 mm. Zes keer dat is 0,006 mm: 0,006 / 0,04 = 15% van de tolerantie. Acceptabel, en zo vastgelegd in het control plan met een frequentie van 5 delen per uur.',
      },
      said: 'Wat engineers zeggen: “Voordat we over de Cpk gaan discussiëren: heeft iemand een R&R op dat meetmiddel gedaan? Als die 40% van de tolerantie opeet, meten we ruis.”',
      recall: [
        {
          q: 'De tolerantie is 0,05 mm. Welke resolutie mag je meetmiddel volgens de vuistregel van tien hoogstens hebben, in mm?',
          number: 0.005,
          tolerance: 0.0001,
          unit: 'mm',
          why: 'Een tiende van de tolerantie: 0,05 / 10 = 0,005 mm.',
        },
        {
          q: 'De meetspreiding (6σ van het meetmiddel) is 0,012 mm bij een tolerantie van 0,04 mm. Wat is het %GRR?',
          number: 30,
          tolerance: 0.5,
          unit: '%',
          why: '0,012 / 0,04 = 0,30: precies op de grens van acceptabel.',
        },
        {
          q: 'Wat hoort er in een regel van een control plan?',
          options: ['De kostprijs van het onderdeel', 'Het reactieplan als een controle faalt', 'De ploegvoorkeur van de operator', 'De omzet van de leverancier'],
          answer: 'Het reactieplan als een controle faalt',
          why: 'Een control plan zegt wat je controleert, hoe, hoe vaak, door wie, en wat je doet als het misgaat.',
        },
        {
          q: 'Wat moet een PPAP eigenlijk aantonen?',
          options: ['Dat de leverancier een ISO-certificaat heeft', 'Dat de tekening klopt', 'Dat het proces goede delen kan maken op het gevraagde tempo', 'Dat de prijs is afgesproken'],
          answer: 'Dat het proces goede delen kan maken op het gevraagde tempo',
          why: 'Alle onderdelen samen laten geschiktheid, beheersing en meten zien vóór de serielevering.',
        },
      ],
      situation: {
        scene: 'Je bent bij een fabriek waar de dagdienst delen afkeurt die de nachtdienst goedkeurt. Ze gebruiken allebei dezelfde boringmeter. De productiemanager wijt het aan “de mentaliteit in de nacht”.',
        ask: 'Wat vraag je voordat dit een discussie over mensen wordt?',
        model: 'Is deze meter door een gauge R&R gegaan, met mensen uit beide ploegen? Meten ze op dezelfde plek en diepte, met dezelfde instelring? Als de reproduceerbaarheid het probleem is, ligt het aan de methode of het meetmiddel, niet aan de mentaliteit, en lossen we het op met een duidelijke meetinstructie.',
        rubric: [
          'Vraagt om een gauge R&R met operators uit beide ploegen',
          'Vraagt naar de meetmethode (waar, hoe, instelring)',
          'Haalt de discussie weg van schuld en naar het meetsysteem',
        ],
      },
      sayIt: 'Leg een productiemanager in 60 seconden uit waarom je eerst het meetmiddel controleert voordat je een capability-getal vertrouwt.',
      terms: [
        { term: 'Control plan', def: 'Tabel met per stap wat je controleert, hoe, hoe vaak, door wie, en het reactieplan.' },
        { term: 'Gauge R&R', def: 'Studie naar meetspreiding: herhaalbaarheid (meetmiddel) en reproduceerbaarheid (mensen).' },
        { term: 'PPAP', def: 'Production Part Approval Process: het bewijs van de leverancier vóór serielevering.' },
        { term: 'PSW', def: 'Part Submission Warrant: het getekende samenvattingsblad van een PPAP.' },
      ],
    },
  ],
};

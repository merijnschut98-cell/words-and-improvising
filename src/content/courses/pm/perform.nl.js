// pm.perform (Nederlands): sturen op prestaties: indicatoren die sturen, van strategie naar teamcijfers, doelen waar mensen in geloven, het prestatiegesprek, gaming en een overlegritme dat blijft.
export default {
  lessons: [
    {
      id: 'pm.perform.kpis',
      title: 'Een paar indicatoren die sturen',
      pre: [
        {
          q: 'Een fabrieksdirecteur heeft 46 KPI’s op één dashboard en bekijkt dat elke maand. Wat is het meest waarschijnlijke effect?',
          options: ['Betere controle, want er wordt niks gemist', 'Niemand weet op welke cijfers hij moet handelen, dus maar weinig ervan leiden tot actie', 'Snellere besluiten, want alle data staat op één plek', 'Betere resultaten, want elke afdeling voelt zich bekeken'],
          answer: 'Niemand weet op welke cijfers hij moet handelen, dus maar weinig ervan leiden tot actie',
          why: 'Mensen kunnen op een handvol cijfers sturen. Bij 46 wordt de aandacht zo verdeeld dat de meeste cijfers alleen gelezen worden.',
        },
      ],
      teach: [
        'Een KPI is een cijfer waar iemand op handelt. Als niemand iets anders gaat doen wanneer het beweegt, is het een rapportagecijfer, geen KPI.\n\nEen team kan sturen op drie tot zeven cijfers; een muur van veertig leest niemand. Kies per niveau: de directie heeft een paar resultaten nodig, een team de paar cijfers die het deze week kan beïnvloeden.',
        'Achterlopende indicatoren meten het resultaat achteraf: leverbetrouwbaarheid vorige maand, verloren klantminuten, kosten per aansluiting. Voorlopende indicatoren bewegen vóór het resultaat en laten zien wat je moet doen: het aandeel klussen waarvan het materiaal twee dagen voor de start klaarligt, preventief onderhoud op tijd gedaan, de leeftijd van de werkvoorraad.\n\nAchterlopend zegt of je gewonnen hebt. Voorlopend zegt of je gaat winnen.',
        'Een goede KPI heeft een opgeschreven definitie (wat telt mee en wat niet), één eigenaar, een bron waar niemand over twist, een frequentie die past bij hoe snel hij kan veranderen, en een bekende richting: is hoger beter of lager? De helft van alle KPI-discussies gaat over twee mensen die onder dezelfde naam iets anders meten.',
        'Balans. Eén cijfer in z’n eentje wordt opgedreven ten koste van de rest. Zet ze in paren: output met kwaliteit, snelheid met veiligheid, kosten met service.\n\nKaplan en Norton maakten dat punt in 1992 met de balanced scorecard: financiële resultaten alleen zeggen hoe het ging, niet waar je heen gaat. Daarom zetten ze er cijfers over klanten, processen en leren naast.',
      ],
      example: {
        kind: 'faded',
        text: 'Een onderdelenfabrikant krijgt klachten van klanten over late leveringen. De plantmanager wil één KPI op het bord: leverbetrouwbaarheid, in % van de orderregels, maandelijks gerapporteerd. Planning en de productieteams zien het cijfer in het maandoverleg.',
        ask: 'Wat zou jij toevoegen of veranderen voordat dit op het bord komt?',
        reveal: 'Houd leverbetrouwbaarheid als achterlopend resultaat, maar definieer het: tegen de datum die aan de klant is bevestigd, per orderregel, nul dagen te laat toegestaan. Geef het één eigenaar, de planningsleider.\n\nVoeg dan een of twee voorlopende cijfers toe die de teams elke week kunnen bewegen, zoals planningsnaleving op de bottleneck per dag en het aandeel orders dat wordt vrijgegeven met al het materiaal op voorraad. Zet er first-pass yield naast, zodat de leverbetrouwbaarheid niet gekocht wordt door onderdelen er snel doorheen te jagen.',
      },
      said: 'Wat je hoort in projecten: “Dat is een achterlopend cijfer. Wat kan het team deze week bewegen dat laat zien waar het heen gaat?”',
      recall: [
        {
          q: 'Welke van deze is een voorlopende indicator voor leverbetrouwbaarheid?',
          options: ['Leverbetrouwbaarheid in % vorige maand', 'Aantal klantklachten vorig kwartaal', 'Aandeel orders dat wordt vrijgegeven met al het materiaal op voorraad', 'Omzet per maand'],
          answer: 'Aandeel orders dat wordt vrijgegeven met al het materiaal op voorraad',
          why: 'Ontbrekend materiaal zorgt later voor late orders, dus dit cijfer beweegt vóór het leverresultaat. De andere worden achteraf gemeten.',
        },
        {
          q: 'Wat maakt van een cijfer een KPI?',
          options: ['Het staat op het dashboard', 'Iemand handelt erop als het beweegt', 'Het wordt elke dag gemeten', 'Het komt rechtstreeks uit het ERP-systeem'],
          answer: 'Iemand handelt erop als het beweegt',
          why: 'Een KPI is er om te sturen. Een cijfer dat nergens tot actie leidt is informatie, hoe vaak je het ook meet.',
        },
        {
          q: 'Waarom zet je een outputindicator in een paar met een kwaliteitsindicator?',
          options: ['Om meer KPI’s op het bord te hebben', 'Zodat de output niet omhoog gaat ten koste van de kwaliteit', 'Omdat auditors twee indicatoren per team eisen', 'Zodat het dashboard er evenwichtig uitziet'],
          answer: 'Zodat de output niet omhoog gaat ten koste van de kwaliteit',
          why: 'Eén cijfer wordt opgedreven ten koste van wat je niet meet. Het paar laat de bijwerking zien.',
        },
        {
          q: 'Een ploeg bij een netbeheerder plande 240 klussen voor één week, allemaal vastgelegd op de maandag van die week. Op vrijdag waren 180 van die 240 klussen klaar. Wat was de planningsrealisatie van die week (het aandeel geplande klussen dat in die week klaar was), in %?',
          number: 75,
          tolerance: 0.5,
          unit: '%',
          why: '180 / 240 = 0,75, dus 75% van de klussen die voor die week gepland stonden, is in die week klaargekomen.',
        },
      ],
      situation: {
        scene: 'De regiodirecteur van een netbeheerder vraagt je “één dashboard met al onze KPI’s” te bouwen. Je telt 32 indicatoren in de maandrapportages. Zijn teamleiders zeggen dat het maandoverleg drie uur cijfers voorlezen is.',
        ask: 'Wat stel je hem voor?',
        model: 'Ik zou de 32 in de maandrapportage laten staan, want een deel is verplicht, maar een apart wekelijks teambord voorstellen met vijf cijfers: twee resultaten, zoals verloren klantminuten, en drie voorlopende cijfers die de teams kunnen bewegen, zoals klussen gestart op de geplande dag. Elk met een opgeschreven definitie en één eigenaar. Laten we het zes weken in één team testen en kijken of het overleg korter wordt en de acties duidelijker.',
        rubric: [
          'Maakt onderscheid tussen cijfers om te rapporteren en cijfers om op te sturen',
          'Stelt een kleine set voor met voor- en achterlopende indicatoren, gedefinieerd en met eigenaar',
          'Stelt een korte test in één team voor voordat het breder gaat',
        ],
        pushback: {
          lines: [
            'Alle 32 staan in onze afspraken met de directie en de toezichthouder. Ik kan niet zomaar cijfers schrappen.',
            'En mijn teamleiders willen graag alles zien. Waarom zou minder informatie beter zijn?',
          ],
          model: 'Klopt, er verdwijnt niks: de verplichte cijfers blijven in de maandrapportage. Wat ik voorstel is een apart weekbord met vijf cijfers waar het team op kan handelen, zodat het overleg over acties gaat in plaats van over voorlezen. De volledige rapportage blijft gewoon beschikbaar. Zullen we het zes weken in één team proberen en dan de duur van het overleg en de afgeronde acties vergelijken?',
          rubric: [
            'Erkent dat de verplichte cijfers moeten blijven',
            'Herhaalt het verschil tussen rapporteren en sturen',
            'Stelt een test van zes weken in één team voor, met een manier om die te beoordelen',
          ],
        },
      },
      sayIt: 'Leg een teamleider in 60 seconden het verschil uit tussen een voorlopende en een achterlopende indicator, met één voorbeeld uit zijn werk.',
      terms: [
        { term: 'KPI', def: 'Kritieke prestatie-indicator: een cijfer waar iemand op handelt als het beweegt.' },
        { term: 'Achterlopende indicator', def: 'Meet het resultaat achteraf, zoals de leverbetrouwbaarheid van vorige maand.' },
        { term: 'Voorlopende indicator', def: 'Beweegt vóór het resultaat en laat zien wat je moet doen, zoals materiaal dat voor de start klaarligt.' },
      ],
    },
    {
      id: 'pm.perform.tree',
      title: 'Van strategie naar de cijfers van een team',
      pre: [
        {
          q: 'Het directiedoel van een netbeheerder is “kortere doorlooptijden voor nieuwe aansluitingen”. Een ploeg in het veld vraagt wat dat voor hen betekent. Wat is het nuttigste antwoord?',
          options: ['Elke klus sneller doen', 'Het directiedoel, herhaald in het teamoverleg', 'De een of twee cijfers in hun eigen werk die de doorlooptijd bepalen, zoals klussen gestart op de geplande dag', 'Een link naar het jaarverslag'],
          answer: 'De een of twee cijfers in hun eigen werk die de doorlooptijd bepalen, zoals klussen gestart op de geplande dag',
          why: 'Een team kan alleen bewegen wat in zijn eigen werk zit. Een directiedoel dat harder wordt herhaald, zegt niemand wat hij maandag moet doen.',
        },
      ],
      teach: [
        'Een KPI-boom, ook wel driverboom, deelt een doel op in de cijfers die het veroorzaken. Bovenaan staat een resultaat, zoals doorlooptijd of kosten per stuk. Elk niveau lager beantwoordt de vraag “waar hangt dit van af?”, tot je bij cijfers komt die een team in de hand heeft.\n\nEen rekenboom telt op of vermenigvuldigt exact; een logische boom noemt alleen de belangrijkste drivers. Reken waar het kan.',
        'Voorbeeld. Goede output van een perslijn per week = beschikbare uren × aandeel van die uren dat hij draait × stuks per draaiuur × aandeel goede stuks.\n\nElke tak heeft een logische eigenaar: planning voor de uren, onderhoud voor het draaiaandeel, engineering voor de snelheid, kwaliteit voor het aandeel goed. Nu ziet elk team welke tak het beweegt.',
        'Toets de boom met data voordat je erop vertrouwt. Beweegt die tak de top echt? Een tak die nauwelijks varieert, verklaart het gat niet.\n\nZoek de tak met het grootste gat ten opzichte van een realistisch niveau: daar gaat de inspanning heen. Stop met opdelen zodra je bij een cijfer bent waar een team wekelijks op kan handelen.',
        'Doorvertalen is niet kopiëren. Het doel van een team moet zijn eigen driver zijn, geen plakje van het directiecijfer.\n\n“Doorlooptijd 20% omlaag” voor elk team is een slogan. “Klussen gestart op de geplande dag van 70% naar 85%” is een teamcijfer.',
      ],
      example: {
        kind: 'faded',
        text: 'Een netbeheerder wil de tijd verkorten van de aanvraag van een klant tot een werkende aansluiting voor kleinverbruikers. Gemiddeld is dat 26 weken. De stappen lopen na elkaar, en de data laat zien hoe lang elke stap gemiddeld duurt: intake 3 weken, ontwerp en vergunningen 9 weken, wachten op een ploeg 10 weken, uitvoering 1 week, meter plaatsen 3 weken.',
        ask: 'Hoe zou jij de boom opbouwen, en waar kijk je als eerste?',
        reveal: 'Omdat de stappen na elkaar lopen, is de doorlooptijd hun som: 3 + 9 + 10 + 1 + 3 = 26 weken. De grote takken zijn wachten op een ploeg (10) en ontwerp en vergunningen (9); in de uitvoering (1) valt weinig te halen.\n\nDeel “wachten op een ploeg” verder op: is het ploegcapaciteit, of klussen die terugkomen omdat ze niet klaar waren? Geef elke stap één eigenaar en één wekelijks teamcijfer, zoals het aandeel klussen dat door de gereedheidscheck komt.',
      },
      said: 'Wat je hoort in projecten: “Aan welke tak van de boom zitten we hier eigenlijk te draaien?”',
      recall: [
        {
          q: 'Goede output van een lijn per week = beschikbare uren per week × aandeel van die uren dat hij draait × stuks per draaiuur × aandeel goede stuks. De lijn heeft 80 beschikbare uren per week, draait 75% daarvan, maakt 200 stuks per draaiuur, en 95% van de stuks is goed. Hoeveel goede stuks maakt hij per week?',
          number: 11400,
          tolerance: 1,
          unit: 'goede stuks per week',
          why: '80 × 0,75 = 60 draaiuren; 60 × 200 = 12.000 stuks; 12.000 × 0,95 = 11.400 goede stuks per week.',
        },
        {
          q: 'De doorlooptijd van een aansluiting is de som van vijf stappen die na elkaar lopen: intake 3, ontwerp en vergunningen 9, wachten op een ploeg 10, uitvoering 1 en meter plaatsen 3 weken. Als het wachten op een ploeg wordt gehalveerd en de rest gelijk blijft, wat is dan de nieuwe doorlooptijd, in weken?',
          number: 21,
          tolerance: 0.1,
          unit: 'weken',
          why: 'Het wachten gaat van 10 naar 5 weken, dus 26 − 5 = 21 weken.',
        },
        {
          q: 'Wanneer stop je met het verder opdelen van een KPI-boom?',
          options: ['Na precies drie niveaus', 'Als je bij een cijfer bent waar een team wekelijks op kan handelen', 'Als de boom op één slide past', 'Als elke afdeling een tak heeft'],
          answer: 'Als je bij een cijfer bent waar een team wekelijks op kan handelen',
          why: 'De boom moet het doel verbinden met iets wat een team kan bewegen. Dieper gaan voegt detail toe waar niemand op stuurt.',
        },
        {
          q: 'Waarom is “doorlooptijd 20% omlaag” een zwak doel voor één ploeg in het veld?',
          options: ['20% is te weinig', 'Het is een plakje van het directiecijfer, geen driver die de ploeg in de hand heeft', 'Doorlooptijd is niet te meten', 'Ploegen horen geen doelen te hebben'],
          answer: 'Het is een plakje van het directiecijfer, geen driver die de ploeg in de hand heeft',
          why: 'Een ploeg beïnvloedt maar een deel van de doorlooptijd. Haar doel moet haar eigen driver zijn, zoals klussen gestart op de geplande dag.',
        },
      ],
      situation: {
        scene: 'Bij een onderdelenfabrikant staat op de strategieslide “winstgevend groeien”. In je eerste week zegt een teamleider productie tegen je: “Ik heb geen idee wat wij daaraan bijdragen. Wij maken gewoon onderdelen.”',
        ask: 'Hoe help je hem de cijfers van zijn team te zien?',
        model: 'Ik zou samen met hem een simpele boom op het whiteboard tekenen. De winst hangt onder meer af van de kosten per goed stuk. Die hangen af van de output per uur en de uitval. Op zijn cel zijn uitval en ongeplande stops wat zijn team beweegt. Dus de cijfers van zijn team kunnen zijn: uitval in % per week en minuten ongeplande stilstand per dienst. Dan zou ik met de data van vorige maand kijken welke van de twee het grootste gat heeft.',
        rubric: [
          'Legt stap voor stap de verbinding van de strategie naar zijn team',
          'Eindigt bij een of twee cijfers die zijn team kan bewegen',
          'Kijkt met data welke tak het zwaarst weegt',
        ],
        pushback: {
          lines: [
            'Leuk getekend, maar de kostprijs wordt bepaald door inkoop en overhead. Mijn uitval is peanuts in dat plaatje.',
            'En als ik uitval op het bord zet, gebruikt het management het gewoon om mijn team de schuld te geven.',
          ],
          model: 'Terecht: inkoop en overhead zijn grote takken, en die zijn niet van jou. Uitval is misschien klein, maar het is wel jouw tak. Laten we met de data van vorige maand kijken wat de uitval echt kostte. Is dat te weinig, dan kiezen we de ongeplande stops. En het bord is eerst voor jullie eigen overleg; dat spreken we af met je manager.',
          rubric: [
            'Erkent dat andere takken groter zijn en niet van hem',
            'Herhaalt waarom zijn team moet sturen op wat het in de hand heeft',
            'Stelt voor de kosten met data te checken en af te spreken hoe het bord gebruikt wordt',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe een KPI-boom een bedrijfsdoel verbindt met de cijfers van één team.',
      terms: [
        { term: 'KPI-boom', def: 'Een doel opgedeeld in de cijfers die het bepalen, tot cijfers die een team in de hand heeft.' },
        { term: 'Driver', def: 'Een cijfer dat het cijfer erboven in de boom laat bewegen.' },
        { term: 'Doorvertalen', def: 'Een doel vertalen naar doelen voor de niveaus eronder; goed gedaan krijgt elk niveau zijn eigen driver.' },
      ],
    },
    {
      id: 'pm.perform.targets',
      title: 'Doelen waar mensen in geloven',
      pre: [
        {
          q: 'Welk soort doel leidt volgens onderzoek naar doelen stellen meestal tot de beste prestaties?',
          options: ['“Doe je best”', 'Een specifiek, uitdagend doel dat mensen accepteren', 'Een makkelijk doel, zodat iedereen het haalt', 'Een doel zo hoog mogelijk, om mensen op te rekken'],
          answer: 'Een specifiek, uitdagend doel dat mensen accepteren',
          why: 'Locke en Latham vonden dat specifieke, moeilijke doelen beter werken dan vage, zolang mensen ze accepteren en feedback krijgen.',
        },
      ],
      teach: [
        'Tientallen jaren onderzoek van Locke en Latham laten zien dat specifieke, moeilijke doelen beter werken dan “doe je best”, zolang mensen ze accepteren, de vaardigheden hebben en feedback krijgen op hun voortgang. Maak je het te moeilijk, dan haken mensen af of gaan ze met het cijfer schuiven. Een doel waar niemand in gelooft, is geen doel maar een wens.',
        'Baseer een doel op data, niet op vorig jaar plus tien procent. Kijk naar de spreiding: welke weken waren het best, en waarom ging het toen goed?\n\nEen doel dicht bij de beste weken die je echt gehaald hebt, is geloofwaardig. Een doel voorbij alles wat je ooit hebt gezien, vraagt om een andere werkwijze. Zeg dan wat er verandert.',
        'Werk met bandbreedtes, niet met één punt. Resultaten schommelen van week tot week.\n\n“Tussen 83 en 87%, mikpunt 85” laat een team een normale week onderscheiden van een echte verandering. Eén punt maakt van elke week eronder een mislukking, ook als het gewoon ruis is.\n\nHoud het doel (waar we heen willen) los van de actiegrens (wanneer we ingrijpen).',
        'Betrek de mensen die het moeten halen. Vraag: wat is haalbaar over drie maanden, en wat moet er veranderen voor meer? Mensen verdedigen doelen die ze zelf mee hebben bepaald.\n\nDe ambitie blijft wel van jou: ligt hun voorstel onder hun eigen beste weken, vraag dan waarom.',
      ],
      example: {
        kind: 'faded',
        text: 'Een onderdelenfabrikant. De uitval op één verspaningscel, in % van de gemaakte stuks, over de laatste acht weken: 4,1, 3,6, 5,2, 3,9, 4,4, 3,3, 4,8, 3,7.\n\nHet gemiddelde is ongeveer 4,1%. Er is nog niks aan het proces veranderd. Het management wil vanaf volgende maand een doel van 1%.',
        ask: 'Welk doel zou jij voorstellen, en hoe?',
        reveal: 'Een doel van 1% ligt ver onder elke week die er ooit is geweest, en aan de werkwijze is niks veranderd, dus niemand gaat erin geloven.\n\nStel een eerste doel voor dicht bij de beste weken (3,3 en 3,6): een bandbreedte van 3,0 tot 4,0%, mikpunt 3,5, na acht weken evalueren. Een week boven 5% is de actiegrens om erin te duiken.\n\nOndertussen is het oorzakenonderzoek naar het grootste defect wat 1% later realistisch kan maken. Zeg dat hardop, zodat de ambitie niet verdwijnt.',
      },
      said: 'Wat je hoort in projecten: “Jullie beste weken zaten op 86. Wat moeten we veranderen om dat een gewone week te maken?”',
      recall: [
        {
          q: 'Volgens Locke en Latham werkt een moeilijk doel alleen als drie dingen geregeld zijn. Welke drie?',
          options: ['Een bonus, een deadline en een dashboard', 'Acceptatie, de vaardigheden om het te doen en feedback op de voortgang', 'Goedkeuring van HR, de ondernemingsraad en de directie', 'Een bandbreedte, een actiegrens en een eigenaar'],
          answer: 'Acceptatie, de vaardigheden om het te doen en feedback op de voortgang',
          why: 'Zonder acceptatie proberen mensen het niet, zonder vaardigheden kunnen ze het niet, en zonder feedback weten ze niet waar ze staan.',
        },
        {
          q: 'Waarom werk je met een bandbreedte in plaats van één doelwaarde?',
          options: ['Zodat normale schommelingen van week tot week niet als succes of mislukking worden gelezen', 'Omdat een bandbreedte makkelijker te halen is', 'Zodat het team elke week zelf een getal kan kiezen', 'Omdat één waarde niet te meten is'],
          answer: 'Zodat normale schommelingen van week tot week niet als succes of mislukking worden gelezen',
          why: 'Resultaten schommelen. Een bandbreedte laat zien wanneer een verandering echt is en actie verdient.',
        },
        {
          q: 'De wekelijkse realisatie op tijd van een team was de laatste 10 weken, week voor week: 78, 81, 84, 79, 86, 80, 83, 85, 82 en 82%. Wat is het gemiddelde over die 10 weken, in %?',
          number: 82,
          tolerance: 0.1,
          unit: '%',
          why: 'De tien waarden tellen op tot 820; 820 / 10 = 82%.',
        },
        {
          q: 'De wekelijkse realisatie op tijd van een team lag de laatste 10 weken tussen 78% en 86%, gemiddeld 82%. Volgend kwartaal verandert er niks aan hun manier van werken. Welk doel voor volgend kwartaal is het best te verdedigen?',
          options: ['95%', 'Tussen 83 en 87%, mikpunt 85%', '“Doe je best”', 'Precies 82%, het huidige gemiddelde'],
          answer: 'Tussen 83 en 87%, mikpunt 85%',
          why: 'Het ligt bij de beste weken die ze al gehaald hebben, dus het is een stap waar mensen in kunnen geloven. 95% vraagt een andere werkwijze, 82% vraagt geen verbetering, en “doe je best” is niet specifiek.',
        },
      ],
      situation: {
        scene: 'Bij een netbeheerder zegt de sponsor tegen het planningsteam: “Nul te late klussen in juni.” Nu start ongeveer 18% van de klussen later dan gepland, en de beste week dit jaar zat op 11%. Na het overleg kijkt de planningsleider je aan en zucht.',
        ask: 'Wat stel je de sponsor voor?',
        model: 'Ik zou de sponsor zeggen dat ik de ambitie deel, maar dat nul in juni onder alles ligt wat het team ooit heeft gedaan, dus dat ze er niet in gaan geloven. Ik zou voor juni een bandbreedte van 10 tot 14% te laat voorstellen, dicht bij hun beste week, met elke maand een evaluatie. En ik zou noemen wat er moet veranderen voor een grotere stap, zoals een gereedheidscheck twee dagen voor de start, zodat het volgende doel lager kan.',
        rubric: [
          'Steunt de ambitie en laat zien dat het doel voorbij alles ligt wat gehaald is',
          'Stelt een bandbreedte voor op basis van de beste weken van het team zelf',
          'Noemt de verandering in werkwijze die nodig is voor een grotere stap',
        ],
        pushback: {
          lines: [
            'Als ik 12% zeg, gaan ze achterover leunen. Mensen moeten opgerekt worden, anders gebeurt er niks.',
            'De directie heeft “nul” al gehoord. Ik kan niet terugkomen met iets slappers.',
          ],
          model: 'Ik ben het met je eens dat ze opgerekt moeten worden: 12% betekent dat een week vlak bij hun beste een gewone week wordt, en dat is een echte stap. Een onhaalbaar doel wordt meestal genegeerd of omzeild. Je kunt nul houden als richting en de directie de mijlpaal voor juni laten zien, plus wat we veranderen om daar te komen. Zal ik die slide voor donderdag opzetten?',
          rubric: [
            'Erkent de behoefte aan oprekken en de verwachting van de directie',
            'Herhaalt waarom een geloofwaardig doel meer beweegt dan een onhaalbaar doel',
            'Biedt een concrete manier om het aan de directie te presenteren',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je met de eigen data van een team een doel stelt waar dat team in gelooft.',
      terms: [
        { term: 'Bandbreedte', def: 'Een band met een mikpunt in het midden, zodat normale schommeling niet als succes of mislukking telt.' },
        { term: 'Actiegrens', def: 'Het niveau waarop het team ingrijpt, los van het doel.' },
        { term: 'Doelacceptatie', def: 'Mensen vinden een doel de moeite waard en haalbaar; nodig om een moeilijk doel te laten werken.' },
      ],
    },
    {
      id: 'pm.perform.dialogue',
      title: 'Het prestatiegesprek',
      pre: [
        {
          q: 'Het weekcijfer van een team is rood geworden. Waar hoort de eerste vraag in een goed prestatiegesprek over te gaan?',
          options: ['Wie er verantwoordelijk is', 'Wat de data laat zien, en of het een echte verandering is of een gewone week', 'Hoe snel het opgelost kan worden', 'Waarom niemand het zag aankomen'],
          answer: 'Wat de data laat zien, en of het een echte verandering is of een gewone week',
          why: 'Eerst eens worden over de feiten. Over oorzaken of schuld praten voordat je weet of er echt iets veranderd is, verspilt het overleg.',
        },
      ],
      teach: [
        'Een prestatiegesprek is een kort, vast gesprek over de cijfers tussen een leidinggevende en het team of de persoon die er eigenaar van is. Het heeft drie stappen: feiten, oorzaak, afspraak. De meeste overleggen slaan het midden over en springen van een rood cijfer naar “beter je best doen”.',
        'Feiten. Wat laat het cijfer zien, tegen welk doel, over welke periode? Is het een echte verandering of een gewone week?\n\nKijk naar de trend, niet naar één punt. Word het eerst eens over de feiten voordat je het over het waarom hebt. Wordt de data betwist, los dan eerst de data op, anders wordt het overleg een discussie over de data.',
        'Oorzaak. Stel open vragen: “Wat gebeurde er in de weken die goed gingen?” “Waar bleven de klussen hangen?”\n\nGa kijken als het kan. Houd een eenmalige oorzaak, zoals een storm, apart van een patroon. Ligt de eerste verklaring buiten de invloed van het team, accepteer dat deel en vraag welk deel er wel binnen lag.',
        'Afspraak. Eén of twee acties, elk met een eigenaar, een datum en een manier om te zien of het gewerkt heeft. Begin de volgende keer met die acties.\n\nDe toon: hard op de cijfers, zacht op de mensen. Het doel is leren wat je moet doen, niet uitzoeken wie de schuld heeft.',
      ],
      example: {
        kind: 'faded',
        text: 'Een netbeheerder, weekoverleg met ploegleider Mark. Doel: 85% van de klussen start op de geplande dag. De laatste vier weken: 84, 86, 83 en 70%.\n\nVorige week stonden er 40 klussen gepland en 12 daarvan startten niet op de geplande dag. Mark begint met: “Dat was het weer. Daar konden we niks aan doen.”',
        ask: 'Hoe zou jij de rest van dit gesprek voeren?',
        reveal: 'Eerst de feiten: 70% (28 van de 40) ligt duidelijk onder de normale 83 tot 86%, dus het is de moeite waard om te bespreken. Vraag dan hoe de 12 gemiste klussen verdeeld zijn: zeg dat er 5 door de storm kwamen en 7 doordat het materiaal niet klaar was. Accepteer de storm als eenmalig en richt je op het deel dat wel binnen de invloed van het team ligt, het materiaal.\n\nAfspraak: Mark checkt elke donderdag met het magazijn het materiaal voor de klussen van volgende week. Het volgende overleg begint met hoe die check ging.',
      },
      said: 'Wat je hoort in projecten: “Voordat we het over het waarom hebben: zijn we het eens over wat de cijfers zeggen?”',
      recall: [
        {
          q: 'Wat is de volgorde van de drie stappen in een prestatiegesprek?',
          options: ['Oorzaak, feiten, afspraak', 'Feiten, oorzaak, afspraak', 'Afspraak, feiten, oorzaak', 'Feiten, afspraak, oorzaak'],
          answer: 'Feiten, oorzaak, afspraak',
          why: 'Je wordt het eens over wat er gebeurde, dan waarom, dan wat je gaat doen. Sla je de oorzaak over, dan krijg je acties die niks oplossen.',
        },
        {
          q: 'Welke van deze is een goede afspraak aan het eind van een prestatiegesprek?',
          options: ['“We gaan volgende week beter ons best doen”', '“Mark checkt elke donderdag met het magazijn het materiaal voor volgende week, en we bekijken het resultaat in het volgende overleg”', '“Iedereen let beter op de planning”', '“We hebben het er volgende maand weer over”'],
          answer: '“Mark checkt elke donderdag met het magazijn het materiaal voor volgende week, en we bekijken het resultaat in het volgende overleg”',
          why: 'Er zit een eigenaar, een moment en een manier om te checken of het werkt in. De andere hebben niks daarvan.',
        },
        {
          q: 'Een teamleider schuift een gemist doel helemaal af op iets buiten de invloed van zijn team. Wat is de beste reactie?',
          options: ['Het accepteren en doorgaan', 'Zeggen dat het een smoes is', 'Het deel van buiten accepteren, en vragen welk deel binnen de invloed van het team lag', 'Escaleren naar zijn leidinggevende'],
          answer: 'Het deel van buiten accepteren, en vragen welk deel binnen de invloed van het team lag',
          why: 'Een echte oorzaak van buiten ontkennen kost vertrouwen. Vragen naar het deel van binnen houdt het gesprek bij wat het team kan veranderen.',
        },
        {
          q: 'Vorige week stonden er 40 klussen gepland en startten er 30 op de geplande dag. Van de 10 klussen die dat niet deden, werden er 4 opgehouden door het weer en 6 door ontbrekend materiaal. Welk deel van de gemiste klussen kwam door ontbrekend materiaal, in %?',
          number: 60,
          tolerance: 0.5,
          unit: '%',
          why: '6 van de 10 gemiste klussen: 6 / 10 = 60%.',
        },
      ],
      situation: {
        scene: 'Je begeleidt het maandelijkse prestatieoverleg bij een onderdelenfabrikant. De leverbetrouwbaarheid van één waardestroom is gezakt van 92% naar 81%. De plantmanager draait zich waar iedereen bij is naar de teamleider: “Dit is onacceptabel. Wat ga je eraan doen?” De teamleider valt stil.',
        ask: 'Wat zeg je als begeleider?',
        model: 'Ik zou rustig ingrijpen: “Zullen we eerst kijken wat de data laat zien? Dan komen we daarna bij de acties.” Ik zou de trend laten zien en vragen of de daling over de hele maand verspreid zit of in één week. Dan stel ik de teamleider open vragen over waar orders zijn blijven hangen. En ik zou afsluiten met een of twee acties, elk met een eigenaar en een datum, die we volgende maand als eerste bespreken.',
        rubric: [
          'Brengt het overleg terug naar de feiten zonder de plantmanager aan te vallen',
          'Stelt open vragen over de oorzaak voordat het over acties gaat',
          'Sluit af met concrete acties met eigenaar en datum',
        ],
        pushback: {
          lines: [
            'Ik heb geen proceslesje nodig. Ik wil weten wie dit gaat oplossen.',
            'We kijken al maanden naar data. Het wordt tijd voor consequenties.',
          ],
          model: 'Helder, je wilt een eigenaar, en die heb je voordat we deze kamer uitgaan. Geef ons tien minuten om te vinden waar de orders bleven hangen, zodat die eigenaar het goede oplost. Slaan we dat over, dan zitten we hier volgende maand met hetzelfde cijfer. Ik schrijf de actie, de eigenaar en de datum op, en daar openen we het volgende overleg mee.',
          rubric: [
            'Erkent zijn behoefte aan een eigenaar en aan snelheid',
            'Herhaalt waarom tien minuten voor de oorzaak ertoe doen',
            'Zegt toe dat er in dit overleg een actie met eigenaar en datum komt',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een goed prestatiegesprek voert als een cijfer rood is geworden.',
      terms: [
        { term: 'Prestatiegesprek', def: 'Een kort, vast gesprek over de cijfers: feiten, oorzaak, afspraak.' },
        { term: 'Afspraak', def: 'Een actie met een eigenaar, een datum en een manier om te checken of het gewerkt heeft.' },
        { term: 'Eenmalige oorzaak', def: 'Een oorzaak die niet terugkomt, zoals een storm, in tegenstelling tot een patroon.' },
      ],
    },
    {
      id: 'pm.perform.gaming',
      title: 'Gaming en verkeerde prikkels',
      pre: [
        {
          q: 'Een klantenservice wordt beloond voor een korte gemiddelde gespreksduur. Wat is een waarschijnlijke bijwerking?',
          options: ['Klanten worden beter geholpen', 'Medewerkers hangen op voordat het probleem is opgelost, dus klanten bellen terug', 'Er bellen minder klanten', 'Er verandert niks'],
          answer: 'Medewerkers hangen op voordat het probleem is opgelost, dus klanten bellen terug',
          why: 'De goedkoopste manier om gesprekken korter te maken, is ze eerder beëindigen. Het cijfer wordt beter terwijl de service slechter wordt.',
        },
      ],
      teach: [
        'De wet van Goodhart, zoals Marilyn Strathern hem formuleerde: zodra een maatstaf een doel wordt, is het geen goede maatstaf meer. Zet druk op één cijfer en mensen vinden de goedkoopste manier om het te bewegen, en dat is niet altijd de manier die jij bedoelde.',
        'Bekende vormen: werk, kosten of fouten net buiten de gemeten periode of scope schuiven; de makkelijke klussen eruit pikken om een aantal te halen; de definitie veranderen van wat meetelt; en gewoon sjoemelen. Steve Kerr noemde het in 1975 “A belonen terwijl je op B hoopt”. Het schoolvoorbeeld is Wells Fargo, waar agressieve verkoopdoelen ertoe leidden dat medewerkers miljoenen rekeningen openden waar klanten nooit om hadden gevraagd.',
        'Hoe je het herkent: het cijfer wordt beter, maar niks eromheen.\n\nPlotselinge sprongen vlak voor de deadline. Resultaten die zich net boven de grens ophopen. Gekoppelde cijfers die de verkeerde kant op gaan, zoals leverbetrouwbaarheid omhoog terwijl de klachten ook stijgen. En vraag het op de vloer: “Wat doen mensen om dit cijfer groen te krijgen?”',
        'Voorkomen: zet indicatoren in paren, houd sommige cijfers alleen om van te leren, zonder bonus eraan, pas de definitie aan als je gaming ziet, en kijk naar het werk zelf, niet alleen naar het cijfer. Gaming komt meestal niet van slechte mensen. Het is een redelijk antwoord op een slecht ontworpen systeem, dus pak eerst het systeem aan.',
      ],
      example: {
        kind: 'faded',
        text: 'Een netbeheerder koppelt een teambonus aan “aandeel storingen binnen 4 uur verholpen”. In één kwartaal gaat dat van 88% naar 97%. In hetzelfde kwartaal stijgt het aantal storingen dat binnen 30 dagen op hetzelfde adres terugkomt van 6 naar 14 per 100 verholpen storingen.',
        ask: 'Wat vermoed je, en wat zou je doen?',
        reveal: 'Vermoed dat de klok wordt stilgezet met tijdelijke oplossingen: de stroom is snel terug, maar de echte reparatie blijft liggen of gebeurt niet. Check het, beschuldig niet: leg de verholpen storingen naast de vervolgwerkorders, en vraag ploegen wat ze doen om de 4 uur te halen. Pas dan het systeem aan: koppel het 4-uurscijfer aan terugkerende storingen binnen 30 dagen, en overweeg de bonus los te maken van dat ene cijfer.',
      },
      said: 'Wat je hoort in projecten: “Dat cijfer is heel snel heel veel beter geworden. Wat moesten mensen doen om het groen te krijgen?”',
      recall: [
        {
          q: 'Wat zegt de wet van Goodhart?',
          options: ['Wat gemeten wordt, wordt gedaan', 'Zodra een maatstaf een doel wordt, is het geen goede maatstaf meer', 'De meeste resultaten komen uit een paar oorzaken', 'Werk dijt uit tot de beschikbare tijd vol is'],
          answer: 'Zodra een maatstaf een doel wordt, is het geen goede maatstaf meer',
          why: 'Druk op een cijfer stuurt gedrag naar het cijfer, en dan laat het niet meer zien wat het moest laten zien.',
        },
        {
          q: 'Welk patroon is een waarschuwing voor gaming?',
          options: ['Resultaten schommelen willekeurig rond het gemiddelde', 'Resultaten hopen zich op net boven de grens', 'Het cijfer verbetert langzaam over een paar maanden', 'Twee gekoppelde cijfers verbeteren samen'],
          answer: 'Resultaten hopen zich op net boven de grens',
          why: 'Natuurlijke resultaten zijn gespreid. Een ophoping net boven de lijn wijst erop dat mensen op de lijn zelf sturen.',
        },
        {
          q: 'Je vermoedt dat een team met een KPI schuift. Welke reactie pakt de oorzaak aan?',
          options: ['Het team waarschuwen dat gaming wordt bestraft', 'De maatstaf herontwerpen en koppelen aan een cijfer dat de bijwerking laat zien', 'Een tweede bonus voor eerlijkheid invoeren', 'Helemaal stoppen met meten'],
          answer: 'De maatstaf herontwerpen en koppelen aan een cijfer dat de bijwerking laat zien',
          why: 'Gaming is meestal een redelijke reactie op een slecht ontworpen systeem. Verander je het systeem, dan verdwijnt de reden ervoor.',
        },
        {
          q: 'Voordat er een bonus aan de hersteltijd hing, kwamen 6 van elke 100 verholpen storingen binnen 30 dagen op hetzelfde adres terug. Na de bonus waren dat er 14 van elke 100. Met hoeveel procentpunt steeg dit terugkeerpercentage?',
          number: 8,
          tolerance: 0.1,
          unit: 'procentpunt',
          why: 'Van 6% naar 14% is een stijging van 14 − 6 = 8 procentpunt.',
        },
      ],
      situation: {
        scene: 'Bij een onderdelenfabrikant meldt de inkoopmanager trots dat de gemiddelde inkoopprijzen dit jaar 8% lager zijn, precies haar bonusdoel. Jij hebt ook gezien dat het aantal lijnstops door te late of verkeerde onderdelen van een nieuwe, goedkopere leverancier steeg van 3 naar 11 per maand.',
        ask: 'Hoe breng je dit in het managementoverleg?',
        model: 'Eerst zou ik de besparing erkennen: 8% is echt geld. Dan leg ik de twee cijfers naast elkaar: “In dezelfde periode gingen de lijnstops door te late of verkeerde onderdelen van 3 naar 11 per maand. Ik wil graag weten wat die stops kosten, zodat we het totaal zien.” En ik zou voorstellen om in de doelen van inkoop de inkoopprijs te koppelen aan de leverbetrouwbaarheid van leveranciers.',
        rubric: [
          'Erkent het resultaat zonder iemand te beschuldigen',
          'Zet de bijwerking met data naast het cijfer',
          'Stelt voor de indicator te koppelen, zodat het systeem verandert',
        ],
        pushback: {
          lines: [
            'Lijnstops zijn het probleem van productie. Inkoop heeft precies gedaan wat er gevraagd werd.',
            'Je zet mijn afdeling te kijk waar het hele managementteam bij zit.',
          ],
          model: 'Je hebt gedaan wat het doel vroeg, en dat is nou juist het punt: het doel keek alleen naar de prijs. Ik geef inkoop niet de schuld; het systeem beloont één cijfer. Als we de lijnstops op geld zetten, zien we de totale kosten van de leverancierskeuze. Zullen we voor het volgende overleg samen die kosten uitrekenen, zodat jij het hele plaatje presenteert?',
          rubric: [
            'Erkent dat ze haar doel heeft gehaald en geen schuld heeft',
            'Herhaalt dat het probleem het eenzijdige doel is',
            'Stelt voor eerst samen de totale kosten uit te rekenen',
          ],
        },
      },
      sayIt: 'Leg een plantmanager in 60 seconden de wet van Goodhart uit, met één voorbeeld van hoe met een KPI geschoven kan worden.',
      terms: [
        { term: 'Wet van Goodhart', def: 'Zodra een maatstaf een doel wordt, is het geen goede maatstaf meer.' },
        { term: 'Gaming', def: 'Een cijfer laten bewegen op een manier die niet verbetert wat het moest laten zien.' },
        { term: 'Verkeerde prikkel', def: 'Een beloning die gedrag uitlokt dat het tegenovergestelde is van wat bedoeld was.' },
      ],
    },
    {
      id: 'pm.perform.rhythm',
      title: 'Een overlegritme dat blijft',
      pre: [
        {
          q: 'Wat is zes maanden nadat een consultant is vertrokken de meest voorkomende reden dat een nieuw prestatieoverleg doodbloedt?',
          options: ['De KPI’s bleken verkeerd', 'Niemand in de lijn is eigenaar van het overleg, dus het verwatert zodra de uitnodiging van de consultant wegvalt', 'De softwarelicentie verloopt', 'De doelen waren te laag'],
          answer: 'Niemand in de lijn is eigenaar van het overleg, dus het verwatert zodra de uitnodiging van de consultant wegvalt',
          why: 'Een overleg dat een buitenstaander draait, stopt als de buitenstaander stopt. Eigenaarschap bij een lijnmanager houdt het in leven.',
        },
      ],
      teach: [
        'Bouw een keten van korte overleggen die elkaar voeden: dagelijks of wekelijks op teamniveau, zo’n 15 minuten aan het bord; wekelijks of tweewekelijks op afdelingsniveau; maandelijks voor het management. Dezelfde definities van onder tot boven. Problemen die een team niet kan oplossen gaan een niveau omhoog, besluiten komen weer terug.',
        'Laat de frequentie passen bij het cijfer.\n\nDagelijks voor wat dagelijks verandert, zoals gestarte klussen of storingen. Maandelijks voor trage cijfers, zoals kosten per aansluiting of klanttevredenheid. Een traag cijfer elke dag bekijken levert alleen ruis en frustratie op.',
        'Een vaste, korte agenda: acties van de vorige keer, de cijfers tegen het doel, een of twee problemen in de diepte, nieuwe acties. Zelfde tijd, zelfde plek.\n\nMaak het zichtbaar, zodat iedereen die langsloopt ziet waar het team staat. Een actielijst waar de volgende keer niemand naar kijkt, is hoe een ritme doodgaat.',
        'Ontwerp vanaf dag één voor je vertrek. Een lijnmanager zit vanaf het begin voor; jij coacht vanaf de zijlijn en stapt dan terug.\n\nDe data ververst zonder jou: geen spreadsheet die alleen jij kunt bijwerken. Laat een beschrijving van één pagina achter: wie, wanneer, welke cijfers en hoe problemen omhoog gaan. Check na je vertrek of de overleggen nog plaatsvinden.',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een onderdelenfabrikant heb je een wekelijks KPI-overleg opgezet. Je zit het al acht weken voor en je werkt de spreadsheet elke maandagochtend zelf bij.\n\nDe productiemanager is erbij en vindt het goed. Over vier weken loopt je opdracht af.',
        ask: 'Wat doe je in die vier weken?',
        reveal: 'Draag in stappen over.\n\nVolgende week zit de productiemanager voor en zit jij naast hem. De week erna ben je er alleen bij. De laatste twee weken blijf je weg en vraag je achteraf hoe het ging.\n\nLeg het verversen van de data bij een automatische export, of bij de planner die eigenaar is van de bron, en test dat terwijl je er nog bent. Schrijf de beschrijving van één pagina. Spreek met de sponsor een check af vier en twaalf weken na je vertrek.',
      },
      said: 'Wat je hoort in projecten: “Als dit overleg alleen doorgaat als de consultant er is, hebben we niks opgebouwd.”',
      recall: [
        {
          q: 'Wie hoort een nieuw prestatieoverleg vanaf het begin voor te zitten?',
          options: ['De consultant, tot het soepel loopt', 'Een lijnmanager die er eigenaar van blijft als de consultant weg is', 'De hoogste in rang die beschikbaar is', 'Wie er die week tijd voor heeft'],
          answer: 'Een lijnmanager die er eigenaar van blijft als de consultant weg is',
          why: 'Eigenaarschap moet groeien terwijl jij er nog bent om te coachen. Pas aan het eind overdragen is te laat.',
        },
        {
          q: 'Welk van deze cijfers past bij een maandoverleg in plaats van een dagelijks overleg?',
          options: ['Klussen die vandaag gestart zijn', 'Storingen op de bottleneck in de laatste dienst', 'Kosten per opgeleverde aansluiting', 'Ploegen die morgen beschikbaar zijn'],
          answer: 'Kosten per opgeleverde aansluiting',
          why: 'Kosten per aansluiting bewegen langzaam en hebben een maand data nodig om iets te zeggen. De andere veranderen elke dag.',
        },
        {
          q: 'Wat komt als eerste op de agenda van een goed prestatieoverleg?',
          options: ['De acties die de vorige keer zijn afgesproken', 'De nieuwe cijfers', 'Mededelingen van het management', 'Een rondje hoe het met iedereen gaat'],
          answer: 'De acties die de vorige keer zijn afgesproken',
          why: 'Beginnen met de acties van de vorige keer laat zien dat ze ertoe doen. Sla je ze over, dan stoppen mensen met afronden.',
        },
        {
          q: 'Een team houdt elke werkdag een overleg van 15 minuten, 5 dagen per week. Alle 8 teamleden zijn bij elk overleg aanwezig. Hoeveel manuren per week kost het overleg?',
          number: 10,
          tolerance: 0.1,
          unit: 'manuren per week',
          why: '15 minuten × 5 dagen = 75 minuten = 1,25 uur per persoon; 1,25 × 8 mensen = 10 manuren per week.',
        },
      ],
      situation: {
        scene: 'Bij een netbeheerder zegt de operationeel directeur in je laatste maand: “Dit werkt goed. Als jij weg bent, gaan we gewoon door. Stuur ons de maandanalyse maar vanuit jullie kant, zoals je nu ook doet.”',
        ask: 'Wat antwoord je?',
        model: 'Ik zou hem bedanken en zeggen dat als de analyse van mij komt, het overleg van mij afhangt. Ik zou voorstellen dat een van zijn analisten het nu al overneemt, terwijl ik er nog ben: twee weken samen, dan doet zij het alleen en kijk ik mee. En we spreken af dat de afdelingshoofden hun eigen overleg blijven voorzitten, en dat hij en ik over drie maanden even bijpraten.',
        rubric: [
          'Benoemt de afhankelijkheid van de consultant',
          'Stelt voor het werk naar iemand in de lijn te verplaatsen terwijl de consultant er nog is',
          'Spreekt een check na het vertrek af',
        ],
        pushback: {
          lines: [
            'Mijn analisten zitten helemaal vol. Jij kent de analyse het best, dus het is efficiënter als jij het blijft doen.',
            'Eerlijk gezegd klinkt het alsof je gewoon geen zin hebt in het werk.',
          ],
          model: 'Ik snap het: je analisten hebben het druk, en op korte termijn is het sneller als ik het doe. Maar dan stopt het overleg op de dag dat mijn opdracht stopt, en heb je betaald voor iets wat niet blijft. Het kost ongeveer vier uur per maand. Zullen we nu één analist kiezen, de komende twee maanden samen doen, en dan draait zij het zelf?',
          rubric: [
            'Erkent het capaciteitsprobleem en de efficiëntie op korte termijn',
            'Herhaalt dat het overleg niet van de consultant mag afhangen',
            'Stelt een concrete overdracht voor, met één persoon en een termijn',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je een overlegritme opzet dat blijft draaien als de consultant weg is.',
      terms: [
        { term: 'Overlegstructuur', def: 'Een keten van korte overleggen op team-, afdelings- en managementniveau die elkaar voeden.' },
        { term: 'Escaleren', def: 'Een probleem dat een team niet kan oplossen een niveau hoger leggen, met een besluit dat terugkomt.' },
        { term: 'Overdracht', def: 'Het eigenaarschap van een overleg in stappen naar de lijn brengen, terwijl de consultant nog kan coachen.' },
      ],
    },
  ],
};

// pm.close (Nederlands): afsluiten, goed afronden: resultaat aantonen, acceptatie, terugblik, eindrapport, opvolging en je eigen reflectie.
export default {
  lessons: [
    {
      id: 'pm.close.results',
      title: 'Resultaat aantonen',
      pre: [
        {
          q: 'De stilstand daalde in de vier weken na je project van 12% naar 9%. In de nulmeting schommelden de weekwaarden tussen 8% en 15%. Wat kun je eerlijk zeggen?',
          options: ['Het project heeft de stilstand met 25% verlaagd', 'Het project is mislukt', 'Nog niet veel: de daling valt binnen de normale spreiding', 'De stilstand is nu onder controle'],
          answer: 'Nog niet veel: de daling valt binnen de normale spreiding',
          why: 'Met weekwaarden tussen 8 en 15 kunnen vier weken op 9 gewoon ruis zijn.',
        },
      ],
      teach: [
        'Nulmeting tegenover nameting, op dezelfde manier gemeten. Zelfde definitie, zelfde databron, zelfde periodelengte, vergelijkbare omstandigheden. Telde de nulmeting stops boven de 5 minuten en de nameting stops boven de 2, dan is de vergelijking waardeloos. Spreek de definitie aan het begin af en schrijf hem op.',
        'Scheid je effect van ruis. Kijk hoeveel de nulmeting van week tot week schommelt; een verandering kleiner dan die schommeling bewijst weinig. Neem genoeg weken na de verandering. Check wat er nog meer veranderde: volume, productmix, seizoen, nieuwe mensen. Een vergelijkingslijn of -regio die de verandering niet kreeg, is het sterkste bewijs dat je kunt krijgen.',
        'Geld in de termen van de klant. Vrijgekomen uren zijn alleen geld als er iets verandert in de boeken: minder overwerk, een ploeg minder, meer product verkocht, een investering die niet nodig is. Bij een netbeheerder kan het gaan om klanten die sneller aangesloten zijn of minder verloren klantminuten. Gebruik de tarieven van de klant zelf en laat hun controller de berekening checken.',
        'De mensenkant: claim niet te veel. Zeg wat je weet en wat niet: “De stilstand ging van 12 naar 8%. Ongeveer één punt komt waarschijnlijk door het lagere volume in de zomer; de rest schrijven we toe aan de veranderingen.” Verwelkom een kritische controller; zijn akkoord is meer waard dan jouw slide. En geef de eer aan het team dat het werk deed.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een bottelarij had lijn 3 over 12 weken nulmeting 14% stilstand (weekwaarden 11 tot 17%). In de 10 weken na de veranderingen was het 9% (7 tot 11%), terwijl lijn 4, waar niets veranderde, op 13% bleef. De spreidingen overlappen nauwelijks en de vergelijkingslijn bewoog niet, dus het effect is echt. Lijn 3 draait 6.000 uur per jaar: 5 punten is 300 uur. De fabriek is uitverkocht, dus die uren worden extra product: de controller waardeert een uur op 450 euro dekkingsbijdrage, ongeveer 135.000 euro per jaar. Je presenteert het samen met de controller, die het heeft nagerekend.',
      },
      said: 'Wat je hoort in projecten: “Mooie cijfers, maar de afzet was dit kwartaal toch al lager. Hoeveel hiervan komt echt door jullie?”',
      recall: [
        {
          q: 'Een lijn draait 5.000 uur per jaar. De stilstand daalt met 4 procentpunt. Elk uur is 300 euro marge waard, want de lijn is uitverkocht. Wat is de waarde per jaar in euro?',
          number: 60000,
          tolerance: 500,
          unit: 'euro',
          why: '5.000 × 0,04 = 200 uur; 200 × 300 = 60.000 euro.',
        },
        {
          q: 'Wanneer zijn vrijgekomen uren echt geld?',
          options: ['Altijd, tegen het standaard uurtarief', 'Als er iets verandert in de boeken, zoals minder overwerk of meer product verkocht', 'Alleen als de consultant het zegt', 'Nooit, uren zijn geen geld'],
          answer: 'Als er iets verandert in de boeken, zoals minder overwerk of meer product verkocht',
          why: 'Uren die vrijkomen maar niet gebruikt worden, veranderen financieel niks.',
        },
        {
          q: 'Wat is het sterkste bewijs dat de verandering, en niet iets anders, de verbetering veroorzaakte?',
          options: ['Het team heeft het gevoel dat het beter gaat', 'Eén heel goede week', 'De mening van de sponsor', 'Een vergelijkingslijn of -regio zonder de verandering die niet verbeterde'],
          answer: 'Een vergelijkingslijn of -regio zonder de verandering die niet verbeterde',
          why: 'Bleef de lijn zonder verandering vlak, dan verklaren seizoen of volume jouw verbetering niet.',
        },
        {
          q: 'De controller van de klant trekt je besparing in twijfel. Hoe reageer je?',
          options: ['Het verwelkomen en de berekening samen met hem doorlopen', 'Het getal stevig verdedigen', 'De sponsor vragen hem te overrulen', 'De besparing uit het rapport halen'],
          answer: 'Het verwelkomen en de berekening samen met hem doorlopen',
          why: 'Een getal waar de controller achter staat wordt geloofd; dat van jou alleen niet.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. Je project bracht de afzeggingen in de laatste week van 18% naar 9%. De sponsor wil “40.000 uur bespaard” aan het bestuur melden, op basis van een grove berekening van een teamlid.',
        ask: 'Wat zeg je?',
        model: '“De daling van 18 naar 9% is solide, daar zou ik mee openen. Voordat we 40.000 uur aan het bestuur voorleggen: kunnen we met de controller checken hoe het berekend is en wat het echt heeft opgeleverd, bijvoorbeeld minder ritten voor niks of meer klussen per week? Een kleiner getal waar de controller achter staat is sterker dan een groot getal dat iemand onderuit kan halen.”',
        rubric: [
          'Opent met het gemeten resultaat',
          'Zet vraagtekens bij de besparingsberekening voordat die naar het bestuur gaat',
          'Betrekt de controller en vertaalt uren naar echte effecten',
        ],
        pushback: {
          lines: [
            '“De directie houdt van een groot getal. 40.000 uur, dat onthouden mensen.”',
            '“Niemand gaat die berekening narekenen. Waarom maken we het onszelf moeilijk?”',
          ],
          model: '“Snap ik, een groot getal blijft hangen. Maar als één directielid vraagt hoe we eraan komen, kunnen we het niet verdedigen. Wat we wel kunnen bewijzen: de annuleringen gehalveerd, van 18 naar 9 procent. Ik reken zorgvuldig uit hoeveel uur dat scheelt en maak er één zin van die nog steeds sterk klinkt.”',
          rubric: [
            'Erkent de aantrekkingskracht van een groot getal',
            'Houdt vast aan een resultaat dat te verdedigen is',
            'Stelt een concrete, sterke alternatieve boodschap voor',
          ],
        },
      },
      sayIt: 'Leg een sponsor in 60 seconden uit hoe je een projectresultaat aantoont op een manier die de controller accepteert.',
      terms: [
        { term: 'Nulmeting', def: 'De prestatie voor de verandering, gemeten met dezelfde definitie als erna.' },
        { term: 'Ruis', def: 'Normale schommeling van week tot week die niet door jouw verandering komt.' },
        { term: 'Vergelijkingsgroep', def: 'Een vergelijkbare lijn of regio zonder de verandering, om je effect te scheiden van andere oorzaken.' },
      ],
    },
    {
      id: 'pm.close.acceptance',
      title: 'Formele acceptatie',
      pre: [
        {
          q: 'Wanneer spreek je acceptatiecriteria af?',
          options: ['Aan het eind, als je weet wat bereikt is', 'Aan het begin, in de projectopdracht', 'Halverwege, als het team de details kent', 'Ze zijn niet nodig als de klant tevreden is'],
          answer: 'Aan het begin, in de projectopdracht',
          why: 'Criteria die je aan het eind afspreekt worden een onderhandeling; aan het begin zijn ze een doel.',
        },
      ],
      teach: [
        'Acceptatiecriteria zeggen wanneer het project klaar is. Maak ze meetbaar en spreek ze aan het begin af, in de projectopdracht (de schriftelijke afspraak over doel, scope en rollen): “Afzeggingen onder de 8% gedurende zes weken op rij in de pilotregio; gereedheidscheck in gebruik in alle regio’s; eigenaar getraind.” Schrijf op wie tekent. Zonder criteria eindigt het project als iemand er moe van wordt.',
        'De ondertekening. Loop elk criterium door met de sponsor, met het bewijs op één A4. Gehaald, deels gehaald of niet gehaald. Dan een handtekening of een schriftelijke bevestiging. Formele acceptatie beschermt beide kanten: de klant weet wat hij gekregen heeft, en jij kunt het project afsluiten en factureren.',
        'Gebruik een openpuntenlijst. Niet alles zal perfect zijn. Zet op een rij wat er nog ligt: punt, eigenaar in de lijnorganisatie, datum. Accepteer het project met open punten in plaats van te wachten tot alles af is. Open punten met een eigenaar in de lijn horen bij de overdracht.',
        'De mensenkant: klanten rekken de ondertekening soms met nieuwe wensen. Zeg: “Laten we het toetsen aan de criteria die we in maart afspraken. Die nieuwe wensen zijn goed; ze gaan op de lijst voor de lijn of een vervolg.” Zijn er nooit criteria afgesproken, neem dat dan eerlijk op je en spreek ze nu af, voor de laatste week.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een kabelfabrikant stond in de projectopdracht: leverbetrouwbaarheid minstens 90% gedurende acht weken, wekelijks planningsoverleg geleid door de planningsmanager, capaciteitsmodel gedocumenteerd en uitgelegd aan beide planners. In het afsluitende overleg laat je één A4 zien: leverbetrouwbaarheid 91 tot 94% gedurende negen weken (gehaald), planningsmanager zit voor sinds week 7 (gehaald), model gedocumenteerd maar nog niet uitgelegd aan de tweede planner (deels gehaald). De sponsor vraagt naar een koppeling met de verkoopprognose, die nooit in scope was. Je zegt: “Goed idee; ik zou het op de openpuntenlijst voor IT zetten.” Open punten: tweede planner trainen (planningsmanager, 15 mei), koppeling verkoopprognose (IT-lead, beoordelen voor juni). Hij tekent.',
      },
      said: 'Wat je hoort in projecten: “Voordat we tekenen, kun je nog even naar de prognose kijken?”',
      recall: [
        {
          q: 'Welke is een goed acceptatiecriterium?',
          options: ['“De planning is beter.”', '“Het team is tevreden.”', '“Het project is goed gegaan.”', '“Afzeggingen onder de 8% gedurende zes weken op rij in de pilotregio.”'],
          answer: '“Afzeggingen onder de 8% gedurende zes weken op rij in de pilotregio.”',
          why: 'Het is meetbaar en laat geen ruimte voor discussie.',
        },
        {
          q: 'Eén criterium is maar deels gehaald. Wat doe je?',
          options: ['Acceptatie uitstellen tot alles perfect is', 'Accepteren met een openpuntenlijst: punt, eigenaar in de lijn, datum', 'Het in de bijlage verstoppen', 'Het criterium schrappen'],
          answer: 'Accepteren met een openpuntenlijst: punt, eigenaar in de lijn, datum',
          why: 'Open punten met een eigenaar in de lijn sluiten het project af zonder de losse eindjes kwijt te raken.',
        },
        {
          q: 'De klant komt vlak voor de ondertekening met een nieuwe wens. Wat zeg je?',
          options: ['“Prima, dat doen we nog voor de afsluiting.”', '“Dat is niet mijn probleem.”', '“Laten we het toetsen aan de afgesproken criteria; dit gaat op de lijst voor de lijn of een vervolg.”', '“Dan hebben we een nieuw contract nodig.”'],
          answer: '“Laten we het toetsen aan de afgesproken criteria; dit gaat op de lijst voor de lijn of een vervolg.”',
          why: 'Je houdt je aan de afspraak en neemt de wens toch serieus.',
        },
        {
          q: 'Waarom beschermt formele acceptatie beide kanten?',
          options: ['De klant weet wat hij gekregen heeft, en jij kunt afsluiten en factureren', 'Het is wettelijk verplicht', 'Het voorkomt elk vervolgwerk', 'Het vervangt het eindrapport'],
          answer: 'De klant weet wat hij gekregen heeft, en jij kunt afsluiten en factureren',
          why: 'Duidelijkheid over wat er geleverd is, sluit het project voor beide netjes af.',
        },
      ],
      situation: {
        scene: 'Je zit bij een levensmiddelenfabriek. Je project loopt over twee weken af. Je beseft dat de acceptatiecriteria nooit zijn opgeschreven; bij de kick-off werd alleen “de lijnefficiëntie verbeteren” gezegd.',
        ask: 'Wat doe je?',
        model: 'Het op me nemen en het nu oplossen. Een half uur met de sponsor plannen: “We hebben nooit precies opgeschreven wanneer dit project klaar is; dat had ik moeten doen. Dit stel ik voor, op basis van waar we naartoe gewerkt hebben: OEE boven de 70% gedurende vier weken op lijn 1 en 2, en de ploegleiders draaien de dagelijkse review.” Afspreken, en dan de ondertekening voorbereiden met bewijs en een openpuntenlijst.',
        rubric: [
          'Neemt verantwoordelijkheid voor de ontbrekende criteria',
          'Stelt concrete, meetbare criteria voor op basis van het echte doel',
          'Bereidt de ondertekening voor met bewijs en een openpuntenlijst',
        ],
        pushback: {
          lines: [
            '“Waarom het nu nog formeel maken? Iedereen ziet dat de lijn beter loopt. Laten we het niet bureaucratisch maken.”',
            '“Als je nu criteria opschrijft, lijkt het alsof je de doelpalen verzet om er zelf goed uit te komen.”',
          ],
          model: '“Nu ziet iedereen het, en over een halfjaar weet niemand meer wat we hebben afgesproken. Ik wil niks verzetten: ik zet op één pagina wat we bij de start hebben gemeten en wat nu, en jij checkt of het eerlijk is. Zullen we het donderdag doorlopen?”',
          rubric: [
            'Erkent het zichtbare resultaat en zijn zorg',
            'Houdt vast aan een opgeschreven, afgesproken acceptatie',
            'Stelt een korte, concrete stap voor waar hij zelf over gaat',
          ],
        },
      },
      sayIt: 'Leg een nieuwe projectleider in 60 seconden uit waarom je acceptatiecriteria aan het begin afspreekt en hoe de ondertekening werkt.',
      terms: [
        { term: 'Acceptatiecriteria', def: 'Meetbare voorwaarden, aan het begin afgesproken, die zeggen wanneer het project klaar is.' },
        { term: 'Ondertekening', def: 'De formele bevestiging van de sponsor dat het project geaccepteerd is.' },
        { term: 'Openpuntenlijst', def: 'Wat er nog ligt, met een eigenaar in de lijn en een datum.' },
      ],
    },
    {
      id: 'pm.close.retro',
      title: 'Een terugblik waar mensen van leren',
      pre: [
        {
          q: 'Wat gebeurt er met de meeste “lessons learned”-documenten?',
          options: ['Ze worden in het volgende project gebruikt', 'Ze worden nooit meer gelezen', 'Ze gaan naar het bestuur', 'Ze worden bedrijfsbeleid'],
          answer: 'Ze worden nooit meer gelezen',
          why: 'Lessen veranderen alleen iets als ze acties worden waar iemand eigenaar van is.',
        },
      ],
      teach: [
        'Een simpel format: teken een tijdlijn van het project op de muur en laat iedereen hoogte- en dieptepunten aangeven. Dan drie vragen: wat ging goed en willen we herhalen, wat ging niet goed, en wat zouden we de volgende keer anders doen. 60 tot 90 minuten, met het klantteam, niet alleen de consultants.',
        'Eerst veiligheid. Mensen zeggen alleen wat er echt gebeurde als het veilig voelt. Begin als leider bij jezelf: noem één ding dat jij anders zou doen. Laat mensen eerst schrijven en dan praten, zodat de stille stemmen meetellen. Praat over wat er gebeurde en waarom, niet over wie faalde. Als de sponsor mensen stil maakt, doe dan een aparte sessie zonder hem.',
        'Maak van lessen acties. “De communicatie kan beter” verandert niks. “Volgend project: de ploegleiders horen een week eerder over veranderingen dan de operators; eigenaar: de operations manager” wel. Kies er twee of drie, geen twintig, elk met een eigenaar en een moment waarop hij gebruikt wordt.',
        'De mensenkant: een terugblik kan omslaan in schuldigen zoeken. Gaat het die kant op, stuur dan terug: “Laten we kijken naar wat het moeilijk maakte, niet naar wie.” Weet je niet hoe je een gespannen moment moet aanpakken, pauzeer dan en vraag de groep: “Wat hebben we nodig om hier veilig over te praten?”',
      ],
      example: {
        kind: 'worked',
        text: 'Aan het eind van een project bij een netbeheerder houd je een terugblik van 75 minuten met zes mensen van de klant en je collega. Op de tijdlijn is het dieptepunt duidelijk: week 6 tot 9, toen de systeemtoegang te laat was. Je begint: “Eén ding dat ik anders zou doen: ik had het toegangsprobleem in week 3 moeten escaleren, niet in week 6.” Daarna schrijft iedereen op post-its. Thema’s: de pilot werkte omdat twee planners hem mee ontwierpen; de buitendienst hoorde het te laat. Acties: bij de volgende uitrol zitten de teamleiders van de buitendienst vanaf week 1 in het ontwerp (eigenaar: hoofd uitvoering); IT-toegang wordt in de eerste week van elk project aangevraagd (eigenaar: de PMO-lead, die het projectbureau leidt).',
      },
      said: 'Wat je hoort in projecten: “Lessons learned? Die hebben we vorige keer ook opgeschreven. Er gebeurt nooit iets mee.”',
      recall: [
        {
          q: 'Welke is een les die een actie is geworden?',
          options: ['“De communicatie kan beter.”', '“We moeten meer plannen.”', '“IT-toegang wordt in week 1 van elk project aangevraagd; eigenaar: de PMO-lead.”', '“Iedereen heeft zijn best gedaan.”'],
          answer: '“IT-toegang wordt in week 1 van elk project aangevraagd; eigenaar: de PMO-lead.”',
          why: 'Hij is concreet, heeft een eigenaar en een moment waarop hij gebruikt wordt.',
        },
        {
          q: 'Hoe maak je als leider een terugblik veilig?',
          options: ['Beginnen met één ding dat je zelf anders zou doen', 'De sponsor laten openen', 'Het kort houden zodat niemand hoeft te praten', 'De lessen vooraf vaststellen'],
          answer: 'Beginnen met één ding dat je zelf anders zou doen',
          why: 'Als de leider laat zien dat fouten toegeven veilig is, volgen anderen.',
        },
        {
          q: 'Waarom laat je mensen eerst schrijven en dan praten?',
          options: ['Het gaat sneller', 'Om een verslag te hebben', 'Zodat stille stemmen meetellen, niet alleen de eerste die iets zegt', 'Omdat de sponsor het leest'],
          answer: 'Zodat stille stemmen meetellen, niet alleen de eerste die iets zegt',
          why: 'Eerst schrijven haalt ieders kijk op voordat de groep naar één beeld trekt.',
        },
        {
          q: 'De terugblik slaat om in schuldigen zoeken. Wat zeg je?',
          options: ['“Laten we kijken naar wat het moeilijk maakte, niet naar wie.”', '“Wie was daar verantwoordelijk voor?”', '“Laten we hier stoppen.”', '“Eens, dat was een mislukking.”'],
          answer: '“Laten we kijken naar wat het moeilijk maakte, niet naar wie.”',
          why: 'Het stuurt terug naar oorzaken, en daar zit het leren.',
        },
      ],
      situation: {
        scene: 'Je rondt een project af bij een metaalbedrijf. De plantmanager wil de terugblik zelf voorzitten. Vorige week vertelden twee teamleden je onder vier ogen dat zijn late besluiten het project vertraagden.',
        ask: 'Hoe zet je de terugblik op?',
        model: 'Ik zou de plantmanager voorstellen dat ik begeleid, zodat hij zelf kan meedoen. En ik zou een korte sessie met het team vooraf voorstellen, zonder hem, zodat ze vrijuit kunnen praten, en de thema’s daarna zonder namen in een gezamenlijke sessie brengen. Ook zou ik hem onder vier ogen vertellen dat besluitsnelheid naar voren kwam, zodat hij niet verrast wordt.',
        rubric: [
          'Stelt een neutrale begeleider voor in plaats van de plantmanager',
          'Maakt een veilige ruimte waarin het team kan praten',
          'Bereidt de plantmanager onder vier ogen voor op gevoelige feedback',
        ],
        pushback: {
          lines: [
            '“Het is mijn fabriek en mijn project. Natuurlijk zit ik de retrospective voor.”',
            '“Als mensen iets over mij te zeggen hebben, kunnen ze dat recht in mijn gezicht zeggen.”',
          ],
          model: '“Het is jouw project, en dat jij erbij bent doet ertoe. Als jij voorzit, wachten mensen eerst af wat jij vindt. Laat mij het begeleiden, en open jij met één ding dat je zelf anders zou doen. Dan durven de anderen het ook.”',
          rubric: [
            'Erkent zijn eigenaarschap en zijn openheid',
            'Houdt vast aan een neutrale begeleider voor eerlijke inbreng',
            'Stelt een concrete rol voor hem voor die openheid uitlokt',
          ],
        },
      },
      sayIt: 'Leg een klantteam in 60 seconden uit hoe je een terugblik houdt die tot echte veranderingen leidt.',
      terms: [
        { term: 'Terugblik', def: 'Een gestructureerde blik terug op het project om te leren wat je herhaalt en wat je verandert.' },
        { term: 'Tijdlijn', def: 'Het project uitgezet in de tijd, met hoogte- en dieptepunten, als start voor het gesprek.' },
        { term: 'Actie', def: 'Een les die concreet is gemaakt, met een eigenaar en een moment waarop hij gebruikt wordt.' },
      ],
    },
    {
      id: 'pm.close.report',
      title: 'Eindrapport en eindpresentatie',
      pre: [
        {
          q: 'Wat komt als eerste in een eindpresentatie voor het managementteam?',
          options: ['De achtergrond en aanpak van het project', 'Een bedankje aan iedereen die meedeed', 'De planning van het project', 'Het resultaat tegen het doel, in één zin'],
          answer: 'Het resultaat tegen het doel, in één zin',
          why: 'Senior mensen willen eerst het antwoord; de rest is onderbouwing.',
        },
      ],
      teach: [
        'Eén A4, dan bijlagen. Het A4: het doel zoals afgesproken, het resultaat daartegen in cijfers, wat er veranderd is in hoe mensen werken, wat er nog openstaat en wie de eigenaar is, en wat je adviseert als volgende stap. Wie alleen dit A4 leest, moet weten wat het project heeft opgeleverd.',
        'Vertel het als een verhaal: waar we stonden, wat in de weg zat, wat we deden, waar we nu staan. Begin met het antwoord: “De afzeggingen gingen van 18 naar 7%, en de nieuwe check wordt nu door de planningsteams zelf gedraaid.” Onderbouw het daarna. Gebruik één grafiek die voor en na laat zien, geen twaalf.',
        'Wat is de volgende stap: geef een helder advies, gebaseerd op wat je zag, niet op wat je wilt verkopen. “Het grootste resterende verlies zit in de beschikbaarheid van materiaal; dat zou ik als volgende aanpakken.” Noem wat de klant zonder jou kan doen. Dat maakt het advies geloofwaardig.',
        'De mensenkant: laat de eigenaar bij de klant een deel presenteren, liefst het resultaat en hoe het nu draait. Dat laat eigenaarschap zien en geeft hem de eer tegenover zijn bazen. Vraagt een directeur iets wat je niet weet, zeg dan: “Dat weet ik niet precies; ik zoek het uit en stuur het je morgen.”',
      ],
      example: {
        kind: 'worked',
        text: 'Afsluiting van een stilstandproject bij een zuivelfabriek. Je A4: Doel: ongeplande stilstand op lijn 1 tot 3 van 15% naar onder de 10%. Resultaat: 9% gedurende tien weken, ongeveer 160.000 euro per jaar aan extra output, nagerekend door de controller. Wat er veranderd is: dagelijkse stopreview van 15 minuten geleid door de ploegleiders; de top drie oorzaken opgelost. Open: sensor lijn 3 vervangen (onderhoudsmanager, juni). Volgende stap: omsteltijden zijn nu het grootste verlies; advies is een gericht project, of het team begint zelf met de aanpak die ze nu kennen. In de presentatie vertelt de productiemanager het resultaat en de dagelijkse review; jij vertelt de volgende stap.',
      },
      said: 'Wat je hoort in projecten: “Kun je het allemaal in een deck zetten? Het management wil graag het hele verhaal zien.”',
      recall: [
        {
          q: 'Wat moet er op het A4 van het eindrapport staan?',
          options: ['De volledige projectgeschiedenis', 'Doel, resultaat in cijfers, wat veranderd is, open punten met eigenaren, en volgende stappen', 'Alle analyses', 'Alleen de besparing'],
          answer: 'Doel, resultaat in cijfers, wat veranderd is, open punten met eigenaren, en volgende stappen',
          why: 'Zo ziet iedereen wat het project heeft opgeleverd en wat er nu gebeurt.',
        },
        {
          q: 'Waarom laat je de eigenaar bij de klant een deel van de afsluiting presenteren?',
          options: ['Het scheelt jou voorbereidingstijd', 'Het is een formele regel', 'Het laat eigenaarschap zien en geeft hem de eer tegenover zijn bazen', 'Zodat jij lastige vragen kunt ontwijken'],
          answer: 'Het laat eigenaarschap zien en geeft hem de eer tegenover zijn bazen',
          why: 'Zichtbaar eigenaarschap laat het resultaat blijven en bouwt de relatie.',
        },
        {
          q: 'Wat maakt een advies voor de volgende stap geloofwaardig?',
          options: ['Het noemt wat de klant zonder jou kan doen, op basis van wat je zag', 'Het stelt altijd een vervolgproject voor', 'Het is vaag zodat het overal past', 'Het komt van het salesteam'],
          answer: 'Het noemt wat de klant zonder jou kan doen, op basis van wat je zag',
          why: 'Advies dat niet alleen naar meer werk voor jou wijst, wordt vertrouwd.',
        },
        {
          q: 'Een directeur vraagt een detail dat je niet weet. Wat doe je?',
          options: ['Je beste gok als feit brengen', 'Van onderwerp veranderen', 'Een teamlid laten antwoorden', 'Zeggen dat je het niet precies weet en het morgen stuurt'],
          answer: 'Zeggen dat je het niet precies weet en het morgen stuurt',
          why: 'Eerlijk en betrouwbaar wint van een zeker klinkend fout antwoord.',
        },
      ],
      situation: {
        scene: 'Je bereidt de eindpresentatie voor bij een netbeheerder. Je manager stelt een deck van 30 slides voor met alle analyses, “om te laten zien hoeveel werk we gedaan hebben”.',
        ask: 'Wat stel je in plaats daarvan voor?',
        model: 'Ik zou één A4 voorstellen met doel, resultaat, wat er veranderd is, open punten en volgende stappen, plus één voor-en-na-grafiek, en de analyses in een bijlage voor wie ze wil. De klant geeft om wat er voor hem veranderd is, niet om hoeveel wij gewerkt hebben. En ik zou de planningsmanager vragen het resultaat zelf te presenteren.',
        rubric: [
          'Stelt een korte samenvatting voor die begint met het antwoord, met bijlagen',
          'Richt zich op wat er voor de klant veranderd is',
          'Geeft de eigenaar bij de klant een rol in de presentatie',
        ],
        pushback: {
          lines: [
            '“De klant heeft veel betaald. Die moet het werk zien, anders lijkt het mager.”',
            '“De analyses in een bijlage, prima, maar tien slides is te weinig voor een afsluiting.”',
          ],
          model: '“Ze moeten het werk zien, eens. Wat ze onthouden is het resultaat en wat ze nu moeten doen. Dus: vijf slides in de zaal, resultaat, oorzaak, wat er veranderd is, wat nu, en alle analyses in een bijlage om na te lezen. Woensdag laat ik je een concept zien.”',
          rubric: [
            'Erkent de wens om het werk te laten zien',
            'Houdt vast aan een korte presentatie gericht op besluiten',
            'Stelt een concrete opbouw en een datum voor een concept voor',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden uit hoe je een eindrapport op één A4 opbouwt.',
      terms: [
        { term: 'Eindrapport', def: 'Eén A4 met doel, resultaat, wat veranderd is, open punten en volgende stappen, plus bijlagen.' },
        { term: 'Antwoord eerst', def: 'Beginnen met de conclusie en die daarna onderbouwen.' },
        { term: 'Bijlage', def: 'Detail voor wie het wil, buiten het hoofdverhaal gehouden.' },
      ],
    },
    {
      id: 'pm.close.followup',
      title: 'Opvolging en het volgende project',
      pre: [
        {
          q: 'Waar komen de meeste nieuwe adviesopdrachten vandaan?',
          options: ['Koude acquisitie', 'Alleen openbare aanbestedingen', 'Bestaande klanten en hun doorverwijzingen', 'Advertenties'],
          answer: 'Bestaande klanten en hun doorverwijzingen',
          why: 'Vertrouwen dat je opbouwt door te leveren is de sterkste bron van nieuw werk.',
        },
      ],
      teach: [
        'Het volgende project groeit uit dit project. De openpuntenlijst, de verliezen die je zag maar niet aanpakte, en de mensen met wie je werkte: daar begint het. Je hoeft niet te verkopen; je moet in contact en nuttig blijven.',
        'Blijf in contact zonder op te dringen. De follow-ups na één, drie en zes maanden zijn natuurlijke contactmomenten. Stuur daartussen af en toe iets nuttigs: een kort artikel dat bij hun probleem past, een benchmark, een introductie bij iemand die iets vergelijkbaars heeft opgelost. Vraag naar hun volgende uitdaging, en luister.',
        'Doe alleen een voorstel als er een echt probleem is dat de klant herkent. “Bij de follow-up na drie maanden zei je dat materiaaltekorten nu je grootste hoofdpijn zijn. Zou het helpen als ik schets hoe we daarnaar kunnen kijken?” Een voorstel bij een probleem dat zij noemden is hulp; een voorstel bij een probleem dat jij noemde is verkopen.',
        'De mensenkant: als junior voelt “accountmanagement” misschien ongemakkelijk. Zie het als iemand die je kent helpen met een probleem dat je snapt. Vraag om feedback en, als ze tevreden waren, om een referentie of introductie. Weet je niet of er een volgend project is, vraag dan gewoon: “Wat staat er volgend jaar op je bord?”',
      ],
      example: {
        kind: 'worked',
        text: 'Na een planningsproject bij een netbeheerder spraken jullie follow-ups af na één, drie en zes maanden. Na een maand check je de KPI met de eigenaar. In maand twee stuur je de planningsmanager een kort artikel over materiaalreserveringen, omdat ze dat in de terugblik noemde. Na drie maanden zegt ze: “De planning loopt nu, maar de helft van onze vertraging is materiaal.” Je vraagt wat ze al geprobeerd heeft en of het zou helpen als je een aanpak schetst. Ze zegt ja; een week later stuur je een opzet van één A4. Het wordt een project in het volgende kwartaal, met haar als sponsor.',
      },
      said: 'Wat je hoort in projecten: “Leuk dat je belt. Er speelt eigenlijk nog iets anders waar we mee worstelen.”',
      recall: [
        {
          q: 'Wat is bij opvolging het verschil tussen helpen en verkopen?',
          options: ['Helpen is gratis, verkopen betaald', 'Helpen reageert op een probleem dat de klant noemde; verkopen pusht een probleem dat jij noemde', 'Er is geen verschil', 'Verkopen doen alleen partners'],
          answer: 'Helpen reageert op een probleem dat de klant noemde; verkopen pusht een probleem dat jij noemde',
          why: 'Voorstellen bij een probleem dat de klant herkent zijn welkom.',
        },
        {
          q: 'Wat is een natuurlijke manier om na een project in contact te blijven?',
          options: ['Wekelijkse verkoopmails', 'Elke maand bellen om nieuw werk te vragen', 'Wachten tot ze jou bellen', 'De afgesproken follow-ups plus af en toe iets nuttigs'],
          answer: 'De afgesproken follow-ups plus af en toe iets nuttigs',
          why: 'Geplande contactmomenten en relevante hulp houden de relatie warm.',
        },
        {
          q: 'Waar begint het volgende project meestal?',
          options: ['Open punten, verliezen die je zag, en de mensen met wie je werkte', 'Een nieuwe marketingcampagne', 'Het jaarverslag van de klant', 'Een aanbesteding van een andere regio'],
          answer: 'Open punten, verliezen die je zag, en de mensen met wie je werkte',
          why: 'Je kent de problemen en de mensen al; dat is je voorsprong.',
        },
        {
          q: 'Je weet niet of de klant een volgende uitdaging heeft. Wat doe je?',
          options: ['Aannemen dat die er niet is', 'Een standaardofferte sturen', 'Vragen: “Wat staat er volgend jaar op je bord?”', 'Je manager vragen hem te bellen'],
          answer: 'Vragen: “Wat staat er volgend jaar op je bord?”',
          why: 'Een simpele open vraag geeft de klant ruimte om het je te vertellen.',
        },
      ],
      situation: {
        scene: 'Je zit bij de follow-up na zes maanden van een project bij een verpakkingsbedrijf. De resultaten houden stand. De plantmanager noemt terloops dat er volgend jaar een nieuwe productielijn komt en dat “niemand echt weet hoe we die gaan bemensen”.',
        ask: 'Wat doe je?',
        model: 'Eerst de resultaten erkennen die hij heeft vastgehouden, dat is zijn verdienste. Dan doorvragen over de nieuwe lijn: “Dat klinkt als een grote stap. Waar maak je je het meest zorgen over?” Luisteren, en als hij een probleem herkent waar ik bij kan helpen, aanbieden vrijblijvend een aanpak op één A4 te schetsen. Zo niet, dan in contact blijven en misschien iemand introduceren die een vergelijkbare opstart heeft gedaan.',
        rubric: [
          'Geeft de klant de eer voor het vasthouden van de resultaten',
          'Stelt open vragen over de nieuwe uitdaging en luistert',
          'Biedt alleen hulp aan bij een probleem dat de klant herkent',
        ],
        pushback: {
          lines: [
            '“Ach, dat is voor HR, niet voor jou. Het is toch pas over een jaar.”',
            '“Ik noemde het terloops. Maak er geen verkooppraatje van.”',
          ],
          model: '“Terecht, en ik ga je niks verkopen. Een jaar gaat snel als je een nieuwe lijn moet bemensen, en het raakt de roosters die we net hebben neergezet. Mag ik je drie vragen sturen om over na te denken? Komt er iets uit, dan praten we. Zo niet, ook goed.”',
          rubric: [
            'Erkent dat het terloops was en geen vraag',
            'Maakt kort duidelijk waarom het voor hem ertoe doet',
            'Stelt een lichte, concrete stap voor zonder druk',
          ],
        },
      },
      sayIt: 'Leg een junior collega in 60 seconden uit hoe je na een project in contact blijft met een klant zonder op te dringen.',
      terms: [
        { term: 'Accountmanagement', def: 'Een blijvende relatie met een klant opbouwen, voorbij één project.' },
        { term: 'Doorverwijzing', def: 'Een klant die je introduceert bij iemand anders die hulp kan gebruiken.' },
        { term: 'Follow-up', def: 'Een gepland contact na het project om resultaten te checken en in contact te blijven.' },
      ],
    },
    {
      id: 'pm.close.yourself',
      title: 'Je eigen reflectie',
      pre: [
        {
          q: 'Welke feedbackvraag levert meestal het nuttigste antwoord op?',
          options: ['“Hoe heb ik het gedaan?”', '“Nog feedback?”', '“Was het oké?”', '“Wat is één ding dat ik in mijn volgende project anders moet doen?”'],
          answer: '“Wat is één ding dat ik in mijn volgende project anders moet doen?”',
          why: 'Een concrete vraag krijgt een concreet antwoord; een algemene krijgt “prima”.',
        },
      ],
      teach: [
        'Neem na elk project een uur voor jezelf. Drie vragen: wat ging goed dankzij wat ik deed, wat zou ik anders doen, en wat heb ik geleerd over klanten, methodes of mezelf. Schrijf het op. Over twee jaar vertelt het patroon over projecten heen je meer dan één project ooit kan.',
        'Haal feedback op bij de klant en een collega. Stel concrete vragen, persoonlijk of telefonisch, niet via een formulier: “Wat is één ding dat ik moet blijven doen? Eén ding dat ik anders moet doen?” Luister, bedank, en verdedig je niet. Verrast iets je, vraag dan om een voorbeeld.',
        'Bouw je eigen casusverzameling: één A4 per project. Situatie, wat je deed, het resultaat in cijfers, wat je leerde. Gebruik het voor je ontwikkelgesprekken, ter voorbereiding op de volgende klant, en om geloofwaardige verhalen te vertellen: “Bij een netbeheerder brachten we de afzeggingen in de laatste week van 18 naar 7% door…” Concrete casussen zijn hoe consultants vertrouwen opbouwen.',
        'De mensenkant: om feedback vragen voelt ongemakkelijk, zeker als het project zwaar was. Doe het toch; klanten waarderen het. Feedback die schuurt is vaak de nuttigste. Weet je niet waar je aan moet werken, vraag dan een senior collega die je aan het werk zag: “Wat zou mij effectiever maken bij een klant?”',
      ],
      example: {
        kind: 'worked',
        text: 'Na een project bij een metaalbedrijf neem je een uur. Ging goed: het koffiegesprek met de sceptische insteller kreeg hem mee. Anders: ik wachtte drie weken met het escaleren van de IT-vertraging, omdat ik niet wilde overkomen alsof ik het niet aankon. Geleerd: senior klanten horen slecht nieuws liever vroeg. Je belt de plantmanager: “Eén ding dat ik de volgende keer anders moet doen?” Hij zegt: “Kom eerder naar me toe als iets vastzit. Ik hoor het liever in week 2.” Dezelfde boodschap. Je casus-A4: “Metaalbedrijf, weekplanning, leverbetrouwbaarheid 78 naar 91%; les: escaleren in week 2, niet in week 5.”',
      },
      said: 'Wat je hoort in projecten: “Je deed het prima. Misschien de volgende keer wat zelfverzekerder.”',
      recall: [
        {
          q: 'Iemand geeft je feedback die schuurt. Wat doe je?',
          options: ['Uitleggen waarom het zo ging', 'Luisteren, bedanken, en zo nodig om een voorbeeld vragen', 'Het negeren', 'Meteen iemand anders om een tweede mening vragen'],
          answer: 'Luisteren, bedanken, en zo nodig om een voorbeeld vragen',
          why: 'Verdedigen stopt de feedback; nieuwsgierigheid levert je er meer van op.',
        },
        {
          q: 'Wat staat er op een casus-A4?',
          options: ['Je uren en facturen', 'Vertrouwelijke data van de klant', 'Alle slides van het project', 'Situatie, wat je deed, het resultaat in cijfers, wat je leerde'],
          answer: 'Situatie, wat je deed, het resultaat in cijfers, wat je leerde',
          why: 'Het geeft je een concreet verhaal om van te leren en om te vertellen.',
        },
        {
          q: 'Waarom schrijf je na elk project je reflectie op?',
          options: ['HR eist het', 'Over meerdere projecten laten patronen zien waar je aan moet werken', 'Om je manager te laten zien dat je druk bent', 'Het hoort bij het eindrapport'],
          answer: 'Over meerdere projecten laten patronen zien waar je aan moet werken',
          why: 'Eén project is een anekdote; terugkerende thema’s zijn je ontwikkelpunten.',
        },
        {
          q: 'Hoe vraag je een klant het best om feedback?',
          options: ['Persoonlijk, met een concrete vraag', 'Met een lang online formulier', 'In de eindpresentatie, waar iedereen bij is', 'Niet, dat is ongemakkelijk'],
          answer: 'Persoonlijk, met een concrete vraag',
          why: 'In een direct gesprek geven mensen eerlijkere en concretere feedback.',
        },
      ],
      situation: {
        scene: 'Je eerste project als leider, bij een netbeheerder, is net afgelopen. De resultaten waren goed, maar je weet dat de stuurgroepen rommelig waren en dat je je daar onzeker voelde. Je manager vraagt hoe het ging.',
        ask: 'Wat zeg en doe je?',
        model: '“De resultaten waren goed: afzeggingen van 18 naar 7%. Wat ik wil verbeteren is hoe ik stuurgroepen leid; ik kreeg vaak geen besluiten. Wil je in mijn volgende project een keer meekijken bij een stuurgroep en me feedback geven?” Daarna stel ik de sponsor bij de klant dezelfde concrete vraag, en schrijf ik mijn casus-A4 met dit als les.',
        rubric: [
          'Noemt eerlijk het resultaat en een concreet ontwikkelpunt',
          'Vraagt om concrete feedback of hulp op dat punt',
          'Schrijft de casus met de les erin',
        ],
        pushback: {
          lines: [
            '“De resultaten waren goed. Waarom focus je op de stuurgroepen? Pak die winst.”',
            '“Iedereen voelt zich de eerste keer onzeker. Dat komt met ervaring.”',
          ],
          model: '“Ik ben blij met het resultaat. Juist de stuurgroepen wil ik beter doen, en alleen ervaring gaat dat niet regelen. Mag ik de volgende met jou voorbereiden, en wil je één keer meekijken en me na afloop twee punten geven?”',
          rubric: [
            'Erkent het goede resultaat en de geruststelling',
            'Houdt vast aan het benoemen van zijn eigen ontwikkelpunt',
            'Stelt een concrete vraag om ondersteuning voor',
          ],
        },
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit hoe je na een project reflecteert en je eigen casusverzameling opbouwt.',
      terms: [
        { term: 'Reflectie', def: 'Terugkijken op wat je deed, wat je zou veranderen en wat je leerde.' },
        { term: 'Casus', def: 'Eén A4 per project: situatie, aanpak, resultaat, les.' },
        { term: 'Feedbackvraag', def: 'Een concrete vraag die uitnodigt tot een concreet, bruikbaar antwoord.' },
      ],
    },
  ],
};

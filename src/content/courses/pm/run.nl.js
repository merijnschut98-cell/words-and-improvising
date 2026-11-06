// pm.run (Nederlands): uitvoeren, een project in beweging houden: overlegritme, eerlijke status, scope creep, besluiten, het team en conflict.
export default {
  lessons: [
    {
      id: 'pm.run.rhythm',
      title: 'Een overlegritme dat werkt',
      pre: [
        {
          q: 'Welk agendapunt voor de stuurgroep, het overleg waarin de sponsor de grote besluiten neemt, levert het meest waarschijnlijk een besluit op?',
          options: ['“Status pilot”', '“Update vanuit het projectteam”', '“Rondvraag”', '“Pilot: vanaf week 12 uitbreiden naar regio Noord, ja of nee?”'],
          answer: '“Pilot: vanaf week 12 uitbreiden naar regio Noord, ja of nee?”',
          why: 'Een punt geschreven als besluitvraag levert een besluit op; een onderwerptitel levert een discussie op.',
        },
      ],
      teach: [
        'Een project draait op drie overleggen. Een stand-up: 15 minuten staand bij een whiteboard, twee of drie keer per week, waarin ieder zegt wat hij af heeft, wat de volgende stap is en wat hem tegenhoudt. Het komt uit agile methodes zoals Scrum: werken in korte cycli.\n\nEen wekelijks teamoverleg, 45 tot 60 minuten: voortgang, blokkades, benodigde besluiten. En een stuurgroep elke vier tot zes weken, 60 tot 90 minuten: de sponsor, de senior manager die eigenaar is van doel en budget, plus een paar afdelingshoofden.',
        'Agenda’s die eindigen in besluiten. Label elk punt: besluiten, bespreken of informeren.\n\nSchrijf besluitpunten als vraag: “Breiden we de pilot vanaf week 12 uit naar regio Noord?” Stuur de agenda twee dagen vooraf, met een besluitnotitie: één A4 met de vraag, de opties, jouw advies en de deadline. Informatiepunten gaan in een schriftelijke update, niet in het overleg.',
        'De notulen zijn het schriftelijke verslag van een overleg. Houd ze bij besluiten en acties, verder niks: wat is besloten, wie doet wat voor wanneer. Stuur ze dezelfde dag.\n\nBegin het volgende overleg met de acties. Als acties steeds uitlopen, zegt dat meer over het project dan welke statusslide ook. Stel de scherpe vraag: “Welke acties van vorige week zijn af?”',
        'De mensenkant: mensen bij de klant verzuipen in overleggen. Elk overleg dat jij toevoegt kost ze uren. Houd de jouwe kort, begin op tijd, stop eerder als het kan, en zeg af als er niets te besluiten is.\n\nZegt de sponsor de stuurgroep steeds af, dan is dat een signaal, geen pech. Vraag: “Is dit nog het goede moment, of moeten we een andere manier vinden waarop jij beslist?”',
        'Wat misgaat: het weekoverleg groeit naar twaalf mensen die alleen luisteren, en de stuurgroep wordt een diavoorstelling waarin niks besloten wordt.\n\nExperts verschillen over hoe vaak je overlegt. Agile teams, die fulltime in korte cycli werken, zweren bij een dagelijkse stand-up; klantteams die parttime meedraaien hebben vaak genoeg aan twee per week. Test het: loopt een stand-up steeds over de 15 minuten, of noemt niemand ooit een blokkade, verander dan de vorm.',
      ],
      example: {
        kind: 'worked',
        text: 'Een project om stilstand (downtime: de uren dat een lijn stilstaat terwijl hij zou moeten draaien) terug te dringen bij een frisdrankfabriek. Stand-up maandag en donderdag om 08:30 bij het bord op de vloer, 15 minuten, vijf mensen.\n\nWeekoverleg dinsdag 13:00, 45 minuten: 10 minuten acties, 15 minuten voortgang tegen de planning op één A4, 15 minuten twee besluiten (welke lijn hierna, of we de leverancier erbij halen), 5 minuten volgende week. Stuurgroep elke vijf weken, 60 minuten, drie besluitpunten, besluitnotitie de vrijdag ervoor verstuurd.\n\nNa de eerste stuurgroep past het verslag op een half A4: drie besluiten, vier acties, om 16:00 dezelfde dag verstuurd.',
      },
      said: 'Wat je hoort in projecten: “Wéér een overleg? Ik zit nu al de halve week in overleggen over overleggen.”',
      recall: [
        {
          q: 'Wat hoort in het verslag van een projectoverleg?',
          options: ['Een volledig verslag van wie wat zei', 'De slides die getoond zijn', 'Besluiten en acties met eigenaar en datum', 'Alleen de datum van het volgende overleg'],
          answer: 'Besluiten en acties met eigenaar en datum',
          why: 'Een kort verslag met besluiten en acties wordt gelezen en uitgevoerd.',
        },
        {
          q: 'Waar horen pure informatiepunten?',
          options: ['Aan het begin van de stuurgroep', 'In een schriftelijke update, niet in het overleg', 'In de stand-up', 'Nergens, die zijn niet nodig'],
          answer: 'In een schriftelijke update, niet in het overleg',
          why: 'Overlegtijd is voor bespreken en besluiten; lezen kan iedereen alleen.',
        },
        {
          q: 'De sponsor zegt de stuurgroep voor de tweede keer af. Wat doe je?',
          options: ['Wachten op de volgende geplande', 'De stuurgroep zonder hem houden', 'Klagen bij zijn leidinggevende', 'Hem vragen of dit nog het goede moment is of dat hij een andere manier nodig heeft om te beslissen'],
          answer: 'Hem vragen of dit nog het goede moment is of dat hij een andere manier nodig heeft om te beslissen',
          why: 'Herhaald afzeggen is een signaal; je spreekt het aan en houdt de besluiten in beweging.',
        },
        {
          q: 'Waar is een stand-up bij het bord voor?',
          options: ['Snel checken wat af is, wat de volgende stap is en wat blokkeert', 'Strategie bespreken met het team', 'Rapporteren aan de sponsor', 'Nieuwe teamleden opleiden'],
          answer: 'Snel checken wat af is, wat de volgende stap is en wat blokkeert',
          why: 'Kort en vaak, zodat blokkades binnen dagen boven komen, niet binnen weken.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder (grid operator), het bedrijf dat het regionale stroomnet beheert. Je wekelijkse projectoverleg is uitgegroeid tot 90 minuten met twaalf mensen, van wie de helft alleen luistert. Besluiten worden steeds doorgeschoven naar “volgende week”.',
        ask: 'Wat verander je?',
        model: 'Ik zou het terugbrengen naar de vijf mensen die het werk doen, 45 minuten, met elk punt gelabeld als besluiten, bespreken of informeren. Informatie gaat in een korte schriftelijke update voor de rest. Besluitpunten krijgen twee dagen vooraf een notitie van één A4, en het verslag bevat alleen besluiten en acties, dezelfde dag verstuurd.',
        rubric: [
          'Brengt het overleg terug tot de mensen die iets doen',
          'Labelt punten en verplaatst informatie naar een schriftelijke update',
          'Bereidt besluiten vooraf voor en legt ze dezelfde dag vast',
        ],
        pushback: {
          lines: [
            '“Als je mensen uit het overleg haalt, voelen ze zich buitengesloten. Iedereen hier wil op de hoogte blijven.”',
            '“We stellen besluiten uit omdat we meer informatie nodig hebben. Dat is gewoon zorgvuldig.”',
          ],
          model: '“Op de hoogte blijven is belangrijk, en dat blijven ze: elke vrijdag een korte schriftelijke update. Het overleg wordt drie kwartier, met de mensen die beslissen. Hebben we voor een besluit meer informatie nodig, dan zeggen we welke en wanneer, zodat het volgende week echt besloten wordt.”',
          rubric: [
            'Erkent de wens om op de hoogte te blijven en zorgvuldig te zijn',
            'Houdt vast aan een kleiner overleg voor besluiten',
            'Stelt een concreet alternatief voor en een termijn voor informatie',
          ],
        },
      },
      sayIt: 'Leg een teamleider bij de klant in 60 seconden het overlegritme van je project uit en waarom elk overleg bestaat.',
      terms: [
        { term: 'Stand-up', def: 'Een staande check van 15 minuten bij het bord: af, volgende, geblokkeerd.' },
        { term: 'Stuurgroep', def: 'De sponsor en senior managers die om de paar weken samenkomen om de besluiten te nemen die het team niet kan nemen.' },
        { term: 'Sponsor', def: 'De senior manager die eigenaar is van doel en budget van het project en de grote besluiten neemt.' },
        { term: 'Besluitnotitie', def: 'Eén A4 met de vraag, opties, een advies en de deadline.' },
        { term: 'Notulen', def: 'Het schriftelijke verslag van een overleg: besluiten en acties met eigenaar en datum.' },
      ],
    },
    {
      id: 'pm.run.status',
      title: 'Eerlijke status',
      pre: [
        {
          q: 'Een mijlpaal loopt drie weken achter. Het team denkt het met eigen acties in te halen, zonder hulp. Welke kleur is eerlijk?',
          options: ['Groen', 'Oranje', 'Rood', 'Grijs, het is te vroeg om te zeggen'],
          answer: 'Oranje',
          why: 'Risico, maar door het team zelf te herstellen: oranje. Rood betekent dat de stuurgroep moet ingrijpen.',
        },
      ],
      teach: [
        'De meeste projecten melden een RAG-status: rood, oranje of groen (red, amber, green). Die werkt alleen als je aan het begin afspreekt wat de kleuren betekenen.\n\nEen werkbare set: groen, op koers voor de volgende mijlpaal, een controlepunt met datum zoals “pilot start”, zonder extra hulp. Oranje, risico, maar het team kan het met eigen acties herstellen. Rood, we halen het niet tenzij de stuurgroep ingrijpt.\n\nDan is rood geen falen, maar een vraag om een besluit.',
        'Het watermeloenproject: groen van buiten, rood van binnen. Rapportages blijven groen tot twee weken voor de deadline en springen dan op rood. Mensen hopen het in te halen en zijn bang dat de boodschapper het moet ontgelden. Psychologen noemen die aarzeling om slecht nieuws door te geven het MUM-effect, naar het Engelse “keep mum”, je mond houden (Rosen en Tesser, 1970).\n\nDe prijs: dan zijn de opties weg. Slecht nieuws vroeg is goedkoop; slecht nieuws laat is duur.',
        'Breng slecht nieuws in vier delen: wat er gebeurd is, wat het betekent voor de mijlpaal, wat ik voorstel, wat ik van je nodig heb.\n\n“De systeemtoegang is zes weken te laat. Daardoor schuift de pilot van week 8 naar week 12. Ik stel voor de pilot in week 8 op papier te starten. Ik heb jouw akkoord nodig en een belletje van jou naar de IT-manager.” Dat laatste is een escalatie: een probleem neerleggen bij iemand die kan beslissen of helpen, met een voorstel.',
        'De mensenkant: teamleden bij de klant vragen je misschien om het “nog even groen te houden”. Ga daar niet op de gang over in discussie. Zeg: “Snap ik, niemand houdt van rood. Maar als we het nu zeggen, kan de sponsor nog helpen. Over zes weken niet meer.”\n\nAls buitenstaander kun je vaak zeggen wat insiders niet kunnen. Ga daar zorgvuldig mee om, en vertel het altijd eerst de eigenaar voordat de sponsor het hoort.',
        'Meld een prognose, niet alleen voortgang: waar komen we aan het eind uit, met wat we nu weten? “70% van de taken af” zegt weinig; “de besparing komt uit op 180.000 euro, niet 300.000” zegt veel.\n\nWat vaak misgaat: kleuren op gevoel. Stel in elke review de scherpe vraag: “Wat zou er moeten gebeuren voordat dit rood wordt?” Kan niemand dat zeggen, dan betekent het groen niks.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 6 van een project bij een netbeheerder. De pilot heeft systeemtoegang nodig, die IT voor week 5 beloofde. Die is er niet en IT zegt nu week 11.\n\nJe teamleider wil oranje rapporteren. Je checkt de definities: het team kan IT niet zelf oplossen, en de pilot schuift vier weken op tenzij iemand ingrijpt. Dat is rood.\n\nJe vertelt eerst de teamleider en je contact bij IT wat je gaat rapporteren. In de stuurgroep: “Rood op de pilot. De toegang is zes weken te laat, daardoor schuift de pilot van week 8 naar week 12. Voorstel: in week 8 op papier starten met twee planners. Ik heb jouw akkoord nodig, en een belletje van jou naar de IT-manager over de datum.” De sponsor stemt in en belt dezelfde middag.',
      },
      said: 'Wat je hoort in projecten: “Laten we het nog even op oranje houden. Als we rood zeggen, zit de directeur er meteen bovenop.”',
      recall: [
        {
          q: 'Wat betekent rood bij een goed gedefinieerde status?',
          options: ['Het project is mislukt', 'Iemand heeft een fout gemaakt', 'Het team loopt een beetje achter', 'We halen het niet tenzij de stuurgroep ingrijpt'],
          answer: 'We halen het niet tenzij de stuurgroep ingrijpt',
          why: 'Rood is een vraag om een besluit of hulp, geen oordeel.',
        },
        {
          q: 'Waarom zijn watermeloenprojecten duur?',
          options: ['Als het slechte nieuws eindelijk komt, zijn de meeste opties weg', 'Ze gebruiken te veel kleuren', 'De rapportages zijn te lang', 'Sponsors houden niet van groen'],
          answer: 'Als het slechte nieuws eindelijk komt, zijn de meeste opties weg',
          why: 'Vroeg slecht nieuws laat ruimte om te handelen; laat slecht nieuws laat alleen schadebeperking over.',
        },
        {
          q: 'Wat is de beste volgorde voor slecht nieuws?',
          options: ['Excuses, achtergrond, probleem, verzoek', 'Wat er gebeurd is, wat het betekent, wat ik voorstel, wat ik nodig heb', 'Eerst het verzoek, dan de uitleg', 'Probleem, schuld, oplossing'],
          answer: 'Wat er gebeurd is, wat het betekent, wat ik voorstel, wat ik nodig heb',
          why: 'Kort, feitelijk, en het eindigt met een duidelijke vraag.',
        },
        {
          q: 'Een teamlid bij de klant vraagt je de status op groen te houden. Wat zeg je?',
          options: ['“Prima, het is jullie project.”', '“Ik meld het vandaag bij de sponsor.”', '“Snap ik, maar als we het nu zeggen kan de sponsor nog helpen; later niet meer.”', '“De methode schrijft rood voor.”'],
          answer: '“Snap ik, maar als we het nu zeggen kan de sponsor nog helpen; later niet meer.”',
          why: 'Je erkent de angst en legt uit waarom vroeg ook in hun belang is.',
        },
      ],
      situation: {
        scene: 'Je zit bij een verpakkingsbedrijf. Je project staat al acht weken op groen en loopt nog vijf maanden. Vandaag reken je uit dat de besparingsdoelstelling, de bij de start beloofde kostenverlaging van 300.000 euro per jaar, op ongeveer 180.000 uitkomt. De stuurgroep is volgende week dinsdag.',
        ask: 'Wat doe je voor en in de stuurgroep?',
        model: 'Eerst de projecteigenaar en het team vertellen wat ik gevonden heb en wat ik ga rapporteren, zodat niemand verrast wordt. In de stuurgroep: “Rood op de besparing. We gaan richting 180.000 in plaats van 300.000, omdat lijn 2 voor de zomer niet in scope komt. Twee opties: dit jaar 180 accepteren, of lijn 2 erbij nemen met één extra monteur voor drie maanden. Ik adviseer optie twee. Ik heb vandaag je besluit nodig.”',
        rubric: [
          'Vertelt het de betrokkenen voor de stuurgroep',
          'Meldt wat er gebeurd is en wat het in cijfers betekent',
          'Komt met opties, een advies en een duidelijke vraag',
        ],
        pushback: {
          lines: [
            '“Waarom nu op rood? Vorige week was het groen. De directie vraagt wat er misging, en dat kan ik niet uitleggen.”',
            '“Kunnen we het niet groen houden tot we meer weten? 180 is een prognose, geen resultaat.”',
          ],
          model: '“Ik snap dat dat ongemakkelijk is. Maar als we het groen houden en het komt uit op 180, wordt de vraag waarom we het niet eerder zeiden. Met vijf maanden te gaan kunnen we nog bijsturen. Ik neem twee opties mee om het gat te dichten, zodat de directie een plan hoort en niet alleen een probleem.”',
          rubric: [
            'Erkent zijn ongemak richting de directie',
            'Houdt vast aan nu de eerlijke status melden',
            'Stelt concrete opties voor bij het slechte nieuws',
          ],
        },
      },
      sayIt: 'Leg een nieuw klantteam in 60 seconden uit wat groen, oranje en rood in je project betekenen en waarom rood geen falen is.',
      terms: [
        { term: 'RAG-status', def: 'Rood, oranje, groen: afgesproken definities van hoe een project ervoor staat.' },
        { term: 'Mijlpaal', def: 'Een controlepunt met datum in de planning, zoals “pilot start” of “overdracht klaar”.' },
        { term: 'Watermeloenproject', def: 'Een project dat van buiten groen gerapporteerd wordt terwijl het van binnen rood is.' },
        { term: 'Escalatie', def: 'Een probleem neerleggen bij iemand die kan beslissen of helpen, met een voorstel.' },
        { term: 'Prognose', def: 'Waar het project aan het eind uitkomt, met wat je nu weet.' },
      ],
    },
    {
      id: 'pm.run.scope',
      title: 'Scope creep',
      pre: [
        {
          q: 'Waar komt de meeste scope creep bij klanten vandaan?',
          options: ['Veel kleine verzoeken die redelijk klinken', 'Grote formele wijzigingsverzoeken', 'Het contract', 'Alleen de eigen ideeën van de consultant'],
          answer: 'Veel kleine verzoeken die redelijk klinken',
          why: 'Elk verzoek klinkt los prima; samen eten ze het project op.',
        },
      ],
      teach: [
        'Scope is wat het project wel en niet oplevert. Scope creep is die scope die ongemerkt groeit zonder dat iemand het formeel afspreekt. Het komt als “als je toch bezig bent, kun je ook even naar lijn 4 kijken?” of “kun je aanschuiven bij het overleg over het nieuwe ERP?”, het bedrijfsbrede systeem voor orders, voorraad en planning. Elk verzoek is klein en redelijk.\n\nSignalen: nieuwe mensen bij je overleggen, een doelzin die verschuift, en jij die ’s avonds doorwerkt terwijl de planning zegt dat je op koers ligt.',
        'De doelzin is één regel die zegt wat het project moet bereiken, bijvoorbeeld “afgezegde klussen in de week voor uitvoering van 18% naar onder de 8% voor juni”. Toets elk verzoek daaraan.\n\nMaak daarna elk verzoek zichtbaar: wat er gevraagd wordt, door wie, waarom, en wat het doet met tijd, kosten, risico en het doel. Kleine dingen gaan op een lijst die je wekelijks doorloopt. Grotere worden een wijzigingsverzoek: een schriftelijk verzoek met de impact, waar de sponsor over beslist.',
        'Zeg “ja, en dit kost het”. “We kunnen lijn 4 erbij nemen. Dat is ongeveer drie weken extra, of de ploegoverdracht valt af. Wat heeft je voorkeur?”\n\nJe zegt geen nee; je laat de afweging zien: wat je opgeeft om iets anders te krijgen. De meeste verzoeken krimpen of verdwijnen zodra ze een prijs hebben. Beslis nooit alleen over scope; het is niet jouw project, het is het hunne.',
        'De mensenkant: als junior voelt het riskant om een senior klant tegen te spreken. Je spreekt hem ook niet tegen; je vraagt de sponsor om te kiezen.\n\nSoms is de wijziging terecht, omdat het oorspronkelijke doel niet klopte. Pas de scope dan officieel aan, met een nieuwe doelzin en planning, in plaats van hem te laten wegdrijven. Formele projecten hebben daarvoor een wijzigingscommissie (change control board); in de meeste verbeterprojecten doet de stuurgroep dat.',
        'Let ook op je eigen kant. Gold plating is dat het team extra’s toevoegt waar niemand om vroeg: een mooier dashboard, nog één analyse. Het voelt als service, maar het eet dezelfde uren op als scope creep.\n\nExperts verschillen over hoe streng je moet zijn. Sommigen tellen elk uur; anderen houden een kleine reserve voor gunsten die goodwill opleveren, vaak zo’n 10% van het budget: een vuistregel, geen norm. Vraag in elk geval wekelijks: “Dient alles waar we deze week aan werkten de doelzin?”',
      ],
      example: {
        kind: 'worked',
        text: 'Je project bij een kabelfabrikant om de weekplanning te verbeteren is begroot op 40 consultantdagen, de tijd van de consultant die de klant betaalt.\n\nIn week 5 heb je ja gezegd tegen vijf kleine verzoeken: een rapportage voor verkoop, een check op voorraadniveaus, een sessie met het nieuwe ERP-team en twee extra analyses. Elk ongeveer 2 dagen. Samen: 10 dagen, 25% extra, en de planning staat nog op groen.\n\nJe zet de lijst met de impact op papier en legt hem bij de sponsor: “Deze vijf kwamen binnen. Samen kosten ze 10 dagen. Optie A: we houden ze en de einddatum schuift twee weken. Optie B: de voorraadcheck en de ERP-sessie vallen af.” Hij kiest B en vertelt het verkoop zelf.',
      },
      said: 'Wat je hoort in projecten: “Het is maar één klein dingetje extra. Je bent hier toch al?”',
      recall: [
        {
          q: 'Een project heeft 40 dagen budget. Er komen vijf kleine verzoeken van elk 2 dagen bij. Met hoeveel procent van de oorspronkelijke 40 dagen is de scope gegroeid?',
          number: 25,
          tolerance: 0.5,
          unit: '%',
          why: '5 × 2 = 10 dagen; 10 / 40 = 25%.',
        },
        {
          q: 'Wie beslist over een flinke scopewijziging?',
          options: ['De consultant, die de planning kent', 'Degene die het vraagt', 'De sponsor', 'Het hele team, met stemming'],
          answer: 'De sponsor',
          why: 'Scope moet je afwegen tegen tijd, kosten en doel, en dat is aan de sponsor.',
        },
        {
          q: 'Wat doet “ja, en dit kost het”?',
          options: ['De afweging zichtbaar maken zodat de klant kan kiezen', 'Het verzoek beleefd weigeren', 'Het tarief van de consultant verhogen', 'Het gesprek vermijden'],
          answer: 'De afweging zichtbaar maken zodat de klant kan kiezen',
          why: 'Je blokkeert niet; je laat zien wat het kost en laat de juiste persoon beslissen.',
        },
        {
          q: 'Wat is een vroeg signaal van scope creep?',
          options: ['Het team is eerder klaar', 'De sponsor is bij elke stuurgroep', 'Risico’s worden wekelijks besproken', 'Nieuwe mensen bij je overleggen en een doelzin die verschuift'],
          answer: 'Nieuwe mensen bij je overleggen en een doelzin die verschuift',
          why: 'Nieuwe stakeholders brengen nieuwe wensen; een verschuivend doel laat zien dat het project verandert.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet. Op de gang vraagt een regiomanager: “Nu je toch naar de planning kijkt, kun je ook onze materiaalreserveringen even rechtzetten?” Hij bedoelt het vastleggen van kabels en onderdelen voor geplande klussen. “Kan niet veel werk zijn.”',
        ask: 'Wat zeg je?',
        model: '“Interessant, en het raakt de planning waarschijnlijk ook. Ik kan nog niet inschatten hoeveel werk het is. Laat me opschrijven wat je ervan wilt en inschatten wat het doet met de huidige planning. Dan leg ik het bij de sponsor neer, zodat zij kan beslissen of we het toevoegen en wat er dan schuift.”',
        rubric: [
          'Neemt het verzoek serieus in plaats van nee te zeggen',
          'Maakt de impact zichtbaar voordat hij ja zegt',
          'Legt het besluit bij de sponsor',
        ],
        pushback: {
          lines: [
            '“Kom op, het is iets kleins. Je spreekt toch al dezelfde mensen. Maak het niet bureaucratisch.”',
            '“Als ik voor elk dingetje langs de sponsor moet, heb ik helemaal niks aan dit project.”',
          ],
          model: '“Het kan best klein zijn, en ik help je graag. Ik weet alleen nog niet wat het doet met het planningswerk. Geef me twee dagen om het in te schatten; daarna beslissen jij en de sponsor samen. Als het echt klein is, is dat een gesprek van vijf minuten.”',
          rubric: [
            'Erkent zijn verzoek en de wens om geen bureaucratie',
            'Houdt vast aan eerst inschatten en een besluit van de sponsor',
            'Stelt een snelle, concrete route naar een besluit voor',
          ],
        },
      },
      sayIt: 'Leg een teamlid in 60 seconden uit hoe je omgaat met “kleine” extra verzoeken van de klant.',
      terms: [
        { term: 'Scope', def: 'Wat het project wel en niet oplevert.' },
        { term: 'Scope creep', def: 'Het project dat langzaam groeit door kleine toevoegingen die niemand formeel heeft afgesproken.' },
        { term: 'Doelzin', def: 'Eén zin die zegt wat het project moet bereiken, om verzoeken aan te toetsen.' },
        { term: 'Wijzigingsverzoek', def: 'Een schriftelijk verzoek tot scopewijziging met de impact, waar de sponsor over beslist.' },
        { term: 'Afweging', def: 'Wat je opgeeft om iets anders te krijgen: meer scope kost tijd, geld of een ander deel van de planning.' },
        { term: 'Gold plating', def: 'Het projectteam dat extra’s toevoegt waar niemand om vroeg.' },
      ],
    },
    {
      id: 'pm.run.decisions',
      title: 'Besluiten voor elkaar krijgen',
      pre: [
        {
          q: 'Een manager schuift een besluit steeds door “tot we meer data hebben”. Welke vraag helpt het meest?',
          options: ['“Wanneer ga je beslissen?”', '“Zal ik alle data verzamelen?”', '“Wat zou je moeten zien om de ene of de andere kant op te beslissen?”', '“Kan iemand anders beslissen?”'],
          answer: '“Wat zou je moeten zien om de ene of de andere kant op te beslissen?”',
          why: 'Het maakt van vage twijfel een concrete voorwaarde, of laat zien dat geen enkele data het besluit verandert.',
        },
      ],
      teach: [
        'Kom met opties en een advies, niet met een probleem. Een advies is de optie die jij aanraadt, met de reden. Geef twee of drie echte opties, de besluitcriteria die tellen (kosten, tijd, risico, impact op mensen), en de voor- en nadelen. Zet erbij wat er gebeurt als er niet besloten wordt.\n\nEén A4. Op een goed A4 beslist een manager in tien minuten; een vage vraag kost drie overleggen.',
        'Houd een besluitenlijst bij: datum, besluit, wie besliste, waarom, en welke alternatieven afvielen. Dat kost twee minuten per besluit.\n\nAls in maand vier iemand zegt “wie heeft dat eigenlijk besloten?”, open je de lijst in plaats van de discussie opnieuw te voeren. Zet hem waar iedereen hem ziet, bijvoorbeeld als tabblad in het projectbestand.',
        'Spreek aan het begin een escalatieroute af: de niveaus waarlangs een vastgelopen besluit gaat, team, projecteigenaar, sponsor, met een termijn per niveau. “Als we er vrijdag niet uit zijn, gaat het naar de sponsor.” Escaleer het besluit, niet de persoon.\n\nVertel de betrokkenen dat je gaat escaleren voordat je het doet. En zet een standaardoptie, wat er gebeurt als niemand beslist: “Als er op de 15e geen besluit is, gaan we door met optie A.”',
        'De mensenkant: managers schuiven besluiten door omdat ze bang zijn het fout te doen, of omdat iemand boven hen het er niet mee eens is. Vraag: “Wat zou je moeten zien om te beslissen?” Is het antwoord vaag, vraag dan: “Wie moet zich hier nog meer goed bij voelen?”\n\nWeet jij niet welke optie de beste is, zeg dat dan en adviseer een kleine test.',
        'Niet elk besluit verdient evenveel zorg. Jeff Bezos van Amazon (aandeelhoudersbrief, 2015) deelde besluiten in als eenrichtingsdeuren, moeilijk terug te draaien, en tweerichtingsdeuren, makkelijk ongedaan te maken. Neem die laatste snel, zo laag mogelijk in de organisatie.\n\nWat misgaat: het besluit dat twee keer genomen wordt, in de stuurgroep afgesproken en daarna op de gang weer opengebroken. Experts verschillen over consensus; velen kiezen “disagree and commit” (oneens zijn en toch meegaan), een uitdrukking van Intel die Bezos bij Amazon bekend maakte: open discussiëren, daarna draagt iedereen het besluit.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een kunststofverwerker komt het team er niet uit waar te beginnen: lijn 2 (meeste stilstand, 14% van de geplande productie-uren) of lijn 5 (kleinere verliezen, maar een teamleider die graag wil). Je schrijft één A4.\n\nOptie A, lijn 2: grootste besparing, ongeveer 90.000 euro per jaar, maar de ploegleider daar is sceptisch. Optie B, lijn 5: ongeveer 40.000, snelle start, gemotiveerd team. Optie C: vier weken op lijn 5 laten zien dat de aanpak werkt, dan lijn 2.\n\nAdvies: C, omdat een zichtbaar succes op lijn 5 helpt om lijn 2 te overtuigen. Geen besluit voor vrijdag, dan start het team met C. De operations manager kiest C in het overleg, en jij zet het met de reden in de besluitenlijst.',
      },
      said: 'Wat je hoort in projecten: “Laten we dit even offline oppakken en er volgende week op terugkomen.”',
      recall: [
        {
          q: 'Wat hoort er in een goede besluitnotitie?',
          options: ['Alle data die je verzameld hebt', 'Alleen jouw advies', 'Opties, criteria, een advies en wat er gebeurt zonder besluit', 'Een lijst met open vragen'],
          answer: 'Opties, criteria, een advies en wat er gebeurt zonder besluit',
          why: 'Het maakt beslissen snel en laat zien wat niet beslissen kost.',
        },
        {
          q: 'Waarom houd je een besluitenlijst bij?',
          options: ['De auditor eist het', 'Om te voorkomen dat afgesloten discussies later weer opengaan', 'Om later mensen de schuld te geven', 'Om het verslag te vervangen'],
          answer: 'Om te voorkomen dat afgesloten discussies later weer opengaan',
          why: 'Je kunt laten zien wat er besloten is, door wie en waarom.',
        },
        {
          q: 'Wat betekent “escaleer het besluit, niet de persoon”?',
          options: ['Je klaagt over een collega bij zijn baas', 'Je vermijdt escaleren', 'Je laat de persoon zelf escaleren', 'Je legt het open besluit een niveau hoger neer, nadat je de betrokkenen hebt ingelicht'],
          answer: 'Je legt het open besluit een niveau hoger neer, nadat je de betrokkenen hebt ingelicht',
          why: 'Het gaat om een besluit krijgen, niet om iemand in de problemen brengen.',
        },
        {
          q: 'Waar dient een standaardoptie in een besluitnotitie voor?',
          options: ['Hij laat zien wat er gebeurt als niemand beslist, zodat niet beslissen ook een keuze is', 'Hij vervangt de sponsor', 'Hij verbergt de risico’s', 'Hij maakt de notitie korter'],
          answer: 'Hij laat zien wat er gebeurt als niemand beslist, zodat niet beslissen ook een keuze is',
          why: 'Een standaardoptie houdt het project in beweging en maakt uitstel zichtbaar.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet. Al drie weken zijn de hoofden planning en uitvoering (de ploegen in het veld) het oneens over wie eigenaar wordt van de nieuwe gereedheidscheck (readiness check): de check of een klus mensen, materiaal en vergunningen heeft voordat hij wordt ingepland. Het project wacht. Je sponsor is de operationeel directeur.',
        ask: 'Hoe krijg je dit besloten?',
        model: 'Ik zou één A4 schrijven met de opties: planning wordt eigenaar, uitvoering wordt eigenaar, of planning wordt eigenaar met een akkoord van uitvoering. Met voor- en nadelen en mijn advies. Ik vertel beide hoofden dat ik het bij de sponsor neerleg als ze er vrijdag niet uit zijn, en ik zet er een standaardoptie bij. Daarna zet ik het besluit met de reden in de lijst.',
        rubric: [
          'Zet opties met een advies op één A4',
          'Stelt een termijn en licht beide hoofden in voor hij escaleert',
          'Legt het besluit vast in een besluitenlijst',
        ],
        pushback: {
          lines: [
            '“Dit moet je niet forceren. Geef ons nog een paar weken, dan komen we er samen wel uit.”',
            '“Als je dit bij de directeur neerlegt, lijkt het alsof wij onze eigen afdelingen niet kunnen aansturen.”',
          ],
          model: '“Ik heb het liefst dat jullie het samen besluiten, en dat kan nog steeds. Maar het project wacht al drie weken. Laten we een datum prikken: zijn jullie het vrijdag eens, prima. Zo niet, dan leg ik beide opties met de gevolgen bij de directeur, als keuze en niet als klacht.”',
          rubric: [
            'Erkent hun wens om het zelf op te lossen',
            'Houdt vast aan een termijn voor het besluit',
            'Stelt een duidelijke vervolgroute voor die hun gezicht spaart',
          ],
        },
      },
      sayIt: 'Leg een projecteigenaar bij de klant in 60 seconden uit hoe je een besluit voorbereidt zodat de stuurgroep het in tien minuten kan nemen.',
      terms: [
        { term: 'Advies', def: 'De optie die jij in een besluitnotitie aanraadt, met de reden.' },
        { term: 'Besluitcriteria', def: 'Waarop je de opties beoordeelt: kosten, tijd, risico, impact op mensen.' },
        { term: 'Besluitenlijst', def: 'Een lijst met besluiten met datum, wie, waarom en afgevallen opties.' },
        { term: 'Escalatieroute', def: 'Afgesproken niveaus en termijnen voor besluiten die het team niet kan nemen.' },
        { term: 'Standaardoptie', def: 'Wat er gebeurt als er voor de deadline geen besluit is.' },
      ],
    },
    {
      id: 'pm.run.team',
      title: 'Leidinggeven zonder macht',
      pre: [
        {
          q: 'Een teamlid bij de klant mist zijn tweede deadline in je project. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Hij is niet gemotiveerd', 'Hij snapt de taak niet', 'Zijn gewone werk ging voor', 'Hij heeft een hekel aan consultants'],
          answer: 'Zijn gewone werk ging voor',
          why: 'Mensen bij de klant doen projecten naast hun baan; als het druk wordt, verliest het project.',
        },
      ],
      teach: [
        'Leidinggeven zonder macht betekent werk gedaan krijgen door mensen die niet aan jou rapporteren. Je team rapporteert aan hun lijnmanager, de baas die hun prioriteiten zet en ze beoordeelt. Je stuurt met wat je hebt: duidelijkheid, hulp en erkenning.\n\nMensen werken aan een project als het hun eigen pijn oplost, als voortgang zichtbaar is, en als hun naam aan het succes hangt. Vraag vroeg: “Wat zou dit project voor jou de moeite waard maken?”',
        'Een toezegging die standhoudt is klein, concreet en in eigen woorden. Niet “kun je even naar de data kijken?” maar “wat kun je donderdag af hebben?”\n\nLaat ze het hardop zeggen in het teamoverleg en schrijf het op het bord. Check het in het volgende overleg. Mensen houden zich aan beloftes die ze in het openbaar deden; de psycholoog Robert Cialdini noemt dat commitment en consistentie.',
        'Levert iemand niet, ga dan eerst uit van capaciteit, niet van houding. Capaciteit is het aantal uren dat iemand naast zijn gewone werk echt vrij heeft voor jouw project. Vraag het in een één-op-ééngesprek, met z’n tweeën: “Ik zag dat de analyse er nog niet is. Wat zit er in de weg?”\n\nVaak is het het gewone werk, een leidinggevende die van niks weet, of een onduidelijke taak. Help het weg te halen: kleiner stuk, duidelijkere taak, of een belletje naar de lijnmanager voor tijd.',
        'Blijft het gebeuren, praat dan met de leidinggevende, maar vertel het de persoon eerst: “Ik ga je leidinggevende vragen of je de vier uur per week kunt krijgen die we afspraken. Is dat goed?” Ga nooit om iemand heen.\n\nEn geef hardop erkenning: noem in de stuurgroep wie het werk gedaan heeft. Zichtbare waardering van senior mensen is een van de weinige beloningen die jij kunt geven.',
        'Maak capaciteit aan het begin expliciet: “vier uur per week, dinsdagochtend, afgesproken met je leidinggevende” is beter dan “hij helpt waar hij kan”. Wie voor 20% op je project zit, heeft één dag per week, min overleggen.\n\nEen veelgemaakte fout: de consultant doet stilletjes de taken van de klant om op schema te blijven. De planning ziet er goed uit, maar niemand bij de klant kan het straks zelf. Vraag jezelf wekelijks: “Wiens handen deden het werk van deze week?”',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een levensmiddelenfabriek zou onderhoudsengineer Ahmed donderdag een storingslijst opleveren. Het is maandag, er is niks.\n\nJe vraagt hem mee voor koffie: “De lijst is er nog niet. Wat zit er in de weg?” Hij vertelt dat twee storingen vorige week zijn tijd opslokten en dat zijn leidinggevende vroeg die voorrang te geven. Je maakt de taak kleiner: alleen de top 10 storingen van lijn 3, voor woensdag.\n\nDaarna vraag je zijn leidinggevende om de vier uur per week die aan het begin waren afgesproken, nadat je Ahmed hebt gezegd dat je dat zou doen. Woensdag ligt de lijst er. In de stuurgroep zeg je: “Uit de lijst van Ahmed blijkt dat 60% van de stilstand uit drie oorzaken komt.”',
      },
      said: 'Wat je hoort in projecten: “Sorry, ik ben er gewoon nog niet aan toegekomen. Het gewone werk gaat voor, snap je.”',
      recall: [
        {
          q: 'Wat is de beste vraag als iemand niet geleverd heeft?',
          options: ['“Waarom heb je het niet gedaan?”', '“Wat zit er in de weg?”', '“Zal ik het je leidinggevende vertellen?”', '“Wil je nog wel in dit project zitten?”'],
          answer: '“Wat zit er in de weg?”',
          why: 'Het zoekt naar het obstakel in plaats van een schuldige, en vindt het meestal.',
        },
        {
          q: 'Wat maakt het waarschijnlijker dat een toezegging standhoudt?',
          options: ['Klein, concreet, in eigen woorden, uitgesproken voor het team', 'Een formele mail van jou', 'Een grote taak met een verre deadline', 'Goedkeuring van HR'],
          answer: 'Klein, concreet, in eigen woorden, uitgesproken voor het team',
          why: 'Mensen houden zich aan concrete beloftes die ze zelf in het openbaar deden.',
        },
        {
          q: 'Je moet iemands leidinggevende inschakelen over zijn tijd. Wat doe je eerst?',
          options: ['Meteen naar de leidinggevende gaan', 'De leidinggevende in de cc van een mail zetten', 'Wachten tot het eind van het project', 'De persoon vertellen dat je dat gaat doen'],
          answer: 'De persoon vertellen dat je dat gaat doen',
          why: 'Om iemand heen gaan sloopt vertrouwen; het hem eerst vertellen houdt het heel.',
        },
        {
          q: 'Waar geef je erkenning voor goed werk?',
          options: ['Onder vier ogen, zodat niemand zich buitengesloten voelt', 'Hardop, ook in de stuurgroep', 'Alleen in het eindrapport', 'Nergens, het is hun werk'],
          answer: 'Hardop, ook in de stuurgroep',
          why: 'Zichtbare erkenning van senior mensen is een van de weinige beloningen die jij kunt geven.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet. Een senior planner in je team kan het duidelijk, maar zegt niks in overleggen en levert te laat. Een collega vertelt je dat hem nooit gevraagd is of hij in het project wilde.',
        ask: 'Wat doe je?',
        model: 'Eén op één met hem praten, zonder verwijt. “Ik hoorde dat je in dit project bent gezet zonder dat iemand het je vroeg. Hoe is dat voor jou?” Dan vragen wat het voor hem de moeite waard zou maken, en of zijn werkdruk het toelaat. Iets kleins en concreets afspreken waar hij eigenaar van wil zijn, en als tijd het probleem is, dat bij zijn leidinggevende aankaarten nadat ik het hem verteld heb.',
        rubric: [
          'Begint een één-op-ééngesprek zonder verwijt',
          'Vraagt wat het project voor hem de moeite waard maakt',
          'Spreekt een kleine, concrete toezegging af en pakt capaciteit open aan',
        ],
        pushback: {
          lines: [
            '“Niemand heeft me gevraagd of ik dit wilde. Ik heb al een volle baan. Dit project komt erbovenop.”',
            '“En eerlijk, ik heb er al vijf van dit soort projecten zien komen en gaan.”',
          ],
          model: '“Terecht, dat had iemand je moeten vragen, en het spijt me dat het niet is gebeurd. Juist jouw ervaring heb ik nodig. Wat zou het de moeite waard maken? Als we iets van je bord kunnen halen, vraag ik dat deze week aan je leidinggevende.”',
          rubric: [
            'Erkent dat hij niet gevraagd is en een volle baan heeft',
            'Maakt duidelijk waarom zijn rol ertoe doet',
            'Stelt een concrete verandering voor die het voor hem werkbaar maakt',
          ],
        },
      },
      sayIt: 'Leg een nieuwe consultant in 60 seconden uit hoe je mensen bij de klant laat leveren als ze niet aan jou rapporteren.',
      terms: [
        { term: 'Leidinggeven zonder macht', def: 'Werk gedaan krijgen met duidelijkheid, hulp en erkenning, niet met hiërarchie.' },
        { term: 'Lijnmanager', def: 'De baas aan wie een teamlid echt rapporteert en die zijn prioriteiten zet.' },
        { term: 'Toezegging', def: 'Een kleine, concrete belofte die iemand in eigen woorden doet.' },
        { term: 'Capaciteit', def: 'Het aantal uren dat iemand naast zijn gewone werk echt vrij heeft voor het project.' },
        { term: 'Één-op-ééngesprek', def: 'Een gesprek met z’n tweeën, weg van de groep.' },
      ],
    },
    {
      id: 'pm.run.conflict',
      title: 'Conflict en het lastige gesprek',
      pre: [
        {
          q: 'Productie zegt: “Geen onderhoudsstops door de week.” Onderhoud zegt: “We hebben vier uur per lijn per week nodig.” Wat is de beste eerste stap?',
          options: ['Het verschil delen: twee uur', 'De plantmanager laten beslissen', 'Elke kant vragen waar ze het voor nodig hebben', 'De kant met de beste data kiezen'],
          answer: 'Elke kant vragen waar ze het voor nodig hebben',
          why: 'Achter standpunten zitten belangen, en aan belangen kun je vaak allebei voldoen.',
        },
      ],
      teach: [
        'Standpunten tegenover belangen, uit het boek Getting to Yes van Fisher en Ury (1981). Een standpunt is wat iemand zegt te willen: “geen stops door de week”. Een belang is waarom: “we mogen de wekelijkse levering aan onze grootste klant niet missen”.\n\nStandpunten botsen; belangen vaak niet. Misschien werkt een stop van vier uur op maandagochtend, als de order al de deur uit is, voor allebei. Vraag “waar heb je het voor nodig?” en “waar maak je je zorgen over?”',
        'In het team: luister eerst apart naar beide kanten. Kies geen kant, ook niet als een van de twee gelijk heeft.\n\nBreng ze daarna samen met de belangen op tafel: “Jullie willen allebei dat de lijn betrouwbaar draait. Jullie verschillen over wanneer je hem stilzet.” Zoek opties die beide dienen, en beslis op objectieve criteria, feiten die beide kanten vooraf accepteren, zoals stilstanduren of gemiste leveringen, niet op wie het hardst roept.',
        'Een lastig gesprek is het gesprek dat je liever uit de weg gaat. Voer het in vier stappen.\n\nWat ik zag, feitelijk: “Deze maand was de data twee keer niet klaar op maandag.” Het effect: “Het planningsoverleg beslist dan op gevoel.” Vraag naar hun kijk, en luister: “Hoe zie jij het?”\n\nSpreek samen de volgende stap af. Bereid de eerste zin voor; de rest volgt.',
        'Met de klant: als een manager je project de schuld geeft, verdedig je dan niet in de zaal. “Ik hoor dat je niet tevreden bent over hoe dit loopt. Kunnen we morgen twintig minuten nemen om het door te lopen?”\n\nGebruik dan dezelfde vier stappen. Weet je niet wat je moet doen, haal de mensen dan uit elkaar, praat met ieder apart, en vraag een senior collega voordat je iets doet.',
        'Ken de BATNA (best alternative to a negotiated agreement) van elke kant, ook een begrip uit Getting to Yes: het beste alternatief als er geen afspraak komt. Zonder gezamenlijke stop is het alternatief voor onderhoud een storing, en voor productie een gemiste levering. Wie dat ziet, vindt een afspraak aantrekkelijker.\n\nWat misgaat: het verschil delen. Twee uur in plaats van vier maakt niemand blij en lost niks op. En sommige conflicten gaan over waarden of status, niet over belangen; escaleer dan naar iemand die kan beslissen.',
      ],
      example: {
        kind: 'worked',
        text: 'Bij een zuivelfabriek botsen de productiemanager en de onderhoudsmanager in je weekoverleg. Productie: “Geen stops meer op lijn 1, we lopen achter.” Onderhoud: “Dan gaat hij stuk, en dat is erger.”\n\nJe stopt de discussie en praat met ieder apart. Het belang van productie: elke donderdag gaat er een grote order naar een retailer. Het belang van onderhoud: drie uur per week om versleten afdichtingen te vervangen voordat ze falen.\n\nWeer samen: “Jullie willen allebei dat lijn 1 donderdag betrouwbaar draait.” Optie: een stop van drie uur op vrijdagochtend, de dag na de donderdaglevering. Beiden willen het vier weken proberen en dan naar stilstand en leveringen kijken.',
      },
      said: 'Wat je hoort in projecten: “Als onderhoud gewoon zijn werk had gedaan, hadden we dit hele project niet nodig gehad.”',
      recall: [
        {
          q: 'Welke van deze is een belang en geen standpunt?',
          options: ['“Geen stops door de week.”', '“We hebben een nieuwe machine nodig.”', '“Vier uur per lijn, geen minuut minder.”', '“We mogen de donderdaglevering aan onze grootste klant niet missen.”'],
          answer: '“We mogen de donderdaglevering aan onze grootste klant niet missen.”',
          why: 'Het zegt waarom iemand iets wil, en dat opent andere oplossingen.',
        },
        {
          q: 'Hoe begin je een lastig gesprek?',
          options: ['Met wat je zag, feitelijk', 'Met je conclusie over de persoon', 'Met tien minuten smalltalk', 'Met wat anderen over hem gezegd hebben'],
          answer: 'Met wat je zag, feitelijk',
          why: 'Over feiten valt weinig te twisten; oordelen roepen verdediging op.',
        },
        {
          q: 'Twee teamleden botsen in een overleg. Wat doe je eerst?',
          options: ['Ter plekke beslissen wie gelijk heeft', 'Negeren en doorgaan', 'Met ieder van hen apart praten', 'Escaleren naar de sponsor'],
          answer: 'Met ieder van hen apart praten',
          why: 'Alleen zeggen mensen wat ze echt nodig hebben zonder gezichtsverlies.',
        },
        {
          q: 'Een manager bij de klant bekritiseert je project in een overleg. Wat is de beste reactie?',
          options: ['Het project meteen met data verdedigen', 'Het erkennen en snel een apart gesprek voorstellen', 'Niks zeggen en hopen dat het overwaait', 'De sponsor vragen in te grijpen'],
          answer: 'Het erkennen en snel een apart gesprek voorstellen',
          why: 'Je vecht niet in het openbaar, en je laat zien dat je het serieus neemt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, het bedrijf achter het regionale stroomnet. Een teamleider van uitvoering, de ploegen die de klussen in het veld doen, zegt in je projectoverleg: “Planning stuurt ons klussen die niet kunnen, en nu moeten wij nog een checklist invullen?” De planners in je team worden stil.',
        ask: 'Wat doe je in het overleg en daarna?',
        model: 'In het overleg: “Ik hoor echte frustratie over klussen die niet kunnen. Dat is precies wat deze check moet oplossen, dus ik wil het goed begrijpen.” Daarna apart met hem praten: wat is er gebeurd, wat heeft hij van planning nodig? Dan met de planners praten. Ze samenbrengen op het gedeelde belang, minder ritten voor niks, en de checklist met zijn input aanpassen.',
        rubric: [
          'Erkent de frustratie in het overleg zonder zich te verdedigen',
          'Praat met elke kant apart om de belangen te vinden',
          'Brengt ze samen op een gedeeld belang en betrekt hem bij de oplossing',
        ],
        pushback: {
          lines: [
            '“Ik zeg gewoon wat iedereen op de vloer denkt. Iemand moet het zeggen.”',
            '“Erover praten helpt niks. De planners moeten betere klussen sturen, meer niet.”',
          ],
          model: '“Goed dat je het hardop zegt; liever hier dan op de gang. Onuitvoerbare klussen zijn precies wat de check moet tegenhouden. Neem er drie van vorige week mee, dan lopen we ze donderdag met de planners door. Vangt de check ze niet, dan passen we de check aan.”',
          rubric: [
            'Erkent zijn frustratie en dat hij het open zegt',
            'Maakt het doel duidelijk zonder partij te kiezen',
            'Stelt voor samen naar echte gevallen te kijken',
          ],
        },
      },
      sayIt: 'Leg een teamleider bij de klant in 60 seconden het verschil uit tussen standpunten en belangen, met een voorbeeld van de vloer.',
      terms: [
        { term: 'Standpunt', def: 'Wat iemand zegt te willen.' },
        { term: 'Belang', def: 'Waarom iemand het wil: de behoefte of zorg achter het standpunt.' },
        { term: 'Objectieve criteria', def: 'Feiten waarmee beide kanten vooraf akkoord zijn om opties te beoordelen, zoals stilstanduren.' },
        { term: 'Lastig gesprek', def: 'Een gesprek dat je liever uit de weg gaat, in vier stappen: feiten, effect, hun kijk, volgende stap.' },
        { term: 'BATNA', def: 'Best alternative to a negotiated agreement: wat je doet als er geen afspraak komt.' },
      ],
    },
  ],
};

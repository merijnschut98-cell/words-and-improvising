// pm.lead (Nederlands): mensen leiden: invloed zonder macht, feedback, moeilijke gesprekken, teamdynamiek, luisteren en jezelf leiden.
export default {
  lessons: [
    {
      id: 'pm.lead.influence',
      title: 'Invloed zonder macht',
      pre: [
        {
          q: 'Je hebt een plantmanager die boven je staat nodig om twee operators vrij te maken voor je project. Wat is meestal de beste eerste zet?',
          options: ['Je sponsor vragen hem opdracht te geven', 'Uitzoeken wat hij dit kwartaal nodig heeft en je vraag daaraan koppelen', 'Een goed onderbouwde mail met de businesscase (kosten en baten op papier) sturen', 'Het inbrengen in de stuurgroep, de senior managers die het project bewaken'],
          answer: 'Uitzoeken wat hij dit kwartaal nodig heeft en je vraag daaraan koppelen',
          why: 'Mensen zeggen ja tegen wat hen helpt. Meteen escaleren kost je de relatie die je later nog nodig hebt.',
        },
      ],
      teach: [
        'Als consultant kun je niemand iets opdragen. Je ruilt.\n\nEen stakeholder is iedereen die je project kan helpen of blokkeren, of die er de gevolgen van merkt: de plantmanager, een ploegleider, een planner. Elk heeft belangen: waar hij op wordt afgerekend, waar hij van wakker ligt, wat hij wil voorkomen. Cohen en Bradford (Influence Without Authority, 1990) noemen wat jij te bieden hebt “valuta”: hulp, informatie, zichtbaarheid, tijdwinst, een probleem minder op zijn bord.',
        'Wederkerigheid is de sterke neiging om terug te geven wat je krijgt; Robert Cialdini maakte het bekend met Influence (1984). Geef dus eerst. Trek de data die hij al maanden wil, repareer een rapportage, laat hem een bevinding zien voordat die naar de stuurgroep gaat: de senior managers die, vaak maandelijks, je project bewaken en de grote besluiten nemen.\n\nKleine, echte hulp bouwt krediet op. Het is geen manipulatie zolang de hulp gemeend is en je hem ook zo had aangeboden.',
        'Geloofwaardigheid als jongste komt uit drie dingen, niet uit een titel: precies zijn (je cijfers kloppen en je weet waar ze vandaan komen), doen wat je zei wanneer je het zei, en op de vloer staan. Eén rake observatie van de werkvloer weegt zwaarder dan tien slides.\n\nZo hoor je dat het ontbreekt: “Interessant, we zien wel.” En dan gebeurt er niks. Typische valkuil: één fout getal in week 2, en daarna wordt elk getal van je dubbel gecheckt.',
        'Eerst in kaart brengen, dan bewegen. Een stakeholderkaart zet iedereen op twee assen: invloed op je project, van laag naar hoog, en houding, van tegen tot voor. Tien tot vijftien namen is normaal voor één project.\n\nWin eerst degene met veel invloed die nog neutraal is en naar wie anderen luisteren: vaak een gerespecteerde ploegleider, niet de hoogste in rang. Houd je sponsor, de senior manager die het project liet starten en erachter staat, achter de hand: elke keer dat je hem inzet, kost dat goodwill.',
        'Praat één-op-één vóór elk groepsoverleg; niemand wordt graag overvallen waar collega’s bij zijn. Zinnen die werken: “Wat zou dit voor jou de moeite waard maken?” “Als ik de weekrapportage van je overneem, kun je Jan dan twee ochtenden vrijmaken?” “Met wie moet ik eerst praten?”\n\nMensen uit de praktijk verschillen van mening of je bij de critici begint of bij het beweegbare midden; de meesten kiezen het midden. Vraag jezelf vóór elk verzoek: wat levert ja zeggen deze persoon op?',
      ],
      example: {
        kind: 'faded',
        text: 'Week 4 bij een netbeheerder. Je project moet het aantal klussen dat in de week zelf wordt afgezegd omlaag brengen. Volgende dinsdag presenteer je in het regio-overleg een gereedheidscheck (readiness check): een korte lijst die vergunningen, materiaal en toegang bevestigt voordat een ploeg uitrukt.\n\nHet hoofd planning steunt het, maar heeft weinig te zeggen over de uitvoering. Het hoofd uitvoering is sceptisch en de ploegen hebben respect voor hem.\n\nAns, werkvoorbereider (work preparer: zij zet per klus tekeningen, vergunningen en materiaal klaar) met 25 dienstjaren, is degene die iedereen belt als een klus onduidelijk is; zij heeft nog niet gezegd wat ze ervan vindt. De regiomanager is je sponsor.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Ga dinsdag niet onvoorbereid naar binnen. Begin bij Ans: laat haar de data over afgezegde klussen zien, vraag haar gaten in de check te schieten, en neem haar beste verbetering over, zichtbaar.\n\nGa daarna één-op-één naar het hoofd uitvoering. Zijn valuta is ploegen die niet voor niks uitrukken, dus breng het als “minder ritten voor niks” en vraag: “Wat moet erin zitten om erachter te kunnen staan?”\n\nHoud de sponsor achter de hand. Laat Ans dinsdag zelf de onderdelen uitleggen die zij heeft verbeterd.',
      },
      said: 'Wat je hoort in projecten: “Als Ans zegt dat het werkt, gaat de rest van de afdeling wel mee.”',
      recall: [
        {
          q: 'Wat is bij invloed zonder macht een “valuta”?',
          options: ['Je uurtarief als consultant', 'Iets wat de ander waardeert en wat jij kunt bieden', 'Het projectbudget', 'De steun van je sponsor'],
          answer: 'Iets wat de ander waardeert en wat jij kunt bieden',
          why: 'Hulp, informatie, zichtbaarheid of tijdwinst: je ruilt wat hij waardeert voor wat jij nodig hebt.',
        },
        {
          q: 'Wie probeer je meestal als eerste te winnen?',
          options: ['De hoogste in rang in de kamer', 'De luidste criticus', 'Degene met veel invloed die nog neutraal is en naar wie anderen luisteren', 'Wie het al met je eens is'],
          answer: 'Degene met veel invloed die nog neutraal is en naar wie anderen luisteren',
          why: 'Die is nog te bewegen en neemt anderen mee; voorstanders heb je al en luide critici draaien zelden als eerste.',
        },
        {
          q: 'Waarom praat je vóór een groepsoverleg één-op-één met de belangrijkste mensen?',
          options: ['Om tijd te besparen in het overleg', 'Omdat groepsoverleggen niet belangrijk zijn', 'Om het besluit zonder hen te nemen', 'Mensen veranderen zelden in het openbaar van standpunt, en niemand wordt graag overvallen waar collega’s bij zijn'],
          answer: 'Mensen veranderen zelden in het openbaar van standpunt, en niemand wordt graag overvallen waar collega’s bij zijn',
          why: 'Eén-op-één kunnen ze vragen stellen en meedenken; in een groep gaan ze verdedigen.',
        },
        {
          q: 'Je bent de jongste in de kamer. Wat bouwt het snelst geloofwaardigheid op?',
          options: ['Kloppende cijfers en doen wat je zei, wanneer je het zei', 'De grote klanten van je bureau noemen', 'Veel methodetermen gebruiken', 'Het eens zijn met de hoogste in rang'],
          answer: 'Kloppende cijfers en doen wat je zei, wanneer je het zei',
          why: 'Senioren beoordelen je op betrouwbaarheid en precisie, en dat krijg je niet door leeftijd maar door werk.',
        },
      ],
      situation: {
        scene: 'Je zit bij een maker van metalen onderdelen. De onderhoudsmanager, twintig jaar ouder dan jij, schuift de twee uur per week die zijn monteurs aan je project hebben toegezegd steeds door. Hij is er vriendelijk over: “Volgende week, het is druk.”',
        ask: 'Wat zeg je in je volgende één-op-één met hem?',
        model: 'Ik zou vragen waar de tijd van zijn monteurs nu in gaat zitten, en luisteren. Dan koppel ik het: “Als de omstellingsdata (changeover data), hoe lang de persen stilstaan als ze naar een ander product omschakelen, laat zien waar je storingen vandaan komen, betekent dat minder storingsmeldingen voor je mensen. Zullen we donderdag met één uur beginnen, op de perslijn waar jij je de meeste zorgen over maakt?” En ik zou iets concreets aanbieden, zoals de stilstandrapportage van hem overnemen.',
        rubric: [
          'Vraagt naar zijn druk voordat hij het verzoek herhaalt',
          'Koppelt het project aan iets waar hij op wordt afgerekend',
          'Doet een kleiner, concreet verzoek en biedt er iets voor terug',
        ],
        pushback: {
          lines: [
            '“Luister, ik run deze afdeling al vijftien jaar. Storingen gaan voor. Jouw project kan wel een week wachten.”',
            '“Je bent jong, je leert het nog wel: op een echte vloer overleeft geen plan de maandagochtend.”',
          ],
          model: '“Je hebt gelijk dat storingen voorgaan; dat zou ik ook doen. Juist daarom vraag ik het: de omstellingsdata moet je mensen minder storingen opleveren. Eén uur donderdag, op de perslijn waar jij je de meeste zorgen over maakt. Heb je er niks aan, dan hoor ik het.”',
          rubric: [
            'Erkent zijn ervaring en prioriteiten',
            'Herhaalt het verzoek, gekoppeld aan zijn eigen doelen',
            'Stelt een kleinere, concrete toezegging voor',
          ],
        },
      },
      sayIt: 'Leg een nieuwe junior consultant in 60 seconden uit hoe je dingen gedaan krijgt bij een klant waar niemand naar je hoeft te luisteren.',
      terms: [
        { term: 'Stakeholder', def: 'Iedereen die je project kan helpen of blokkeren, of die er de gevolgen van merkt.' },
        { term: 'Valuta', def: 'Iets wat een stakeholder waardeert en wat jij kunt bieden in ruil voor zijn hulp (Cohen en Bradford).' },
        { term: 'Wederkerigheid', def: 'De neiging om terug te geven wat je krijgt; eerst geven bouwt krediet op.' },
        { term: 'Stuurgroep', def: 'De senior managers die een project bewaken en de grote besluiten nemen, vaak in een maandelijks overleg.' },
        { term: 'Stakeholderkaart', def: 'Stakeholders uitgezet op invloed en houding, om te kiezen wie je eerst wint.' },
        { term: 'Sponsor', def: 'De senior manager die het project liet starten en erachter staat; je laatste redmiddel als je vastloopt.' },
      ],
    },
    {
      id: 'pm.lead.feedback',
      title: 'Feedback die aankomt',
      pre: [
        {
          q: 'Een senior manager van de klant zat tijdens je workshop steeds op zijn telefoon, en het team zag het. Wanneer geef je het best feedback?',
          options: ['Meteen, waar de groep bij is', 'In de volgende stuurgroep', 'Nooit: hij is de klant', 'Kort erna, één-op-één, na de vraag of hij ervoor openstaat'],
          answer: 'Kort erna, één-op-één, na de vraag of hij ervoor openstaat',
          why: 'Onder vier ogen, snel, en met toestemming: zo wordt feedback naar boven hoorbaar.',
        },
      ],
      teach: [
        'SBI is een opbouw voor feedback van het Center for Creative Leadership: Situatie, Gedrag (Behaviour), Impact.\n\nSituatie: wanneer en waar. Gedrag: waarneembaar gedrag, dus wat een camera had opgenomen, zonder interpretatie. Impact: het effect op jou, het team of het resultaat.\n\nDaarna een vraag. “In de workshop van gisteren (S) zat je het grootste deel van het tweede uur op je telefoon (G). Twee operators zeiden daarna niks meer, omdat ze dachten dat het al besloten was (I). Wat speelde er?”',
        'Gedrag, geen karakter. “Je onderbrak Ans twee keer” is feedback; “je bent dominant” is een etiket waar mensen zich tegen verdedigen. Koppel de impact aan iets waar hij om geeft: zijn doel, zijn team, het project dat hij sponsort.\n\nEén punt per gesprek; drie tegelijk en het wordt een beoordelingsgesprek (performance review). Veel trainers raden de feedbacksandwich af, kritiek tussen twee complimenten: mensen zetten zich bij elk compliment schrap en missen de boodschap.',
        'Timing. Zo snel als het kan, onder vier ogen, als jullie allebei rustig zijn: binnen een dag of twee. Niet vlak voordat hij moet presenteren.\n\nPositieve feedback werkt op dezelfde manier en mag vaker. Een concreet compliment, zoals “dat je opende met de storingscijfers maakte dat de ploegen gingen luisteren”, bouwt het krediet op voor de lastiger boodschap. Een vaag compliment (“goed gedaan”) bouwt niks, want niemand weet wat hij moet herhalen.',
        'Feedback naar boven is feedback aan iemand die hoger staat in rang of macht, zoals een senior klant. Vraag toestemming: “Mag ik iets delen wat me vanochtend opviel?” Maak het over het gezamenlijke doel, houd het klein, zeg “mij viel op”.\n\nVraag dan en luister. Gaat hij ertegenin, herhaal de feiten dan niet; vraag wat hij zag. Landt het, dan hoor je “Hm. Terecht.” Landt het niet, dan begint hij over iets anders: laat het dan voor vandaag rusten.',
        'Zelf ontvangen. Zeg dank je, vraag om een voorbeeld, verdedig je niet ter plekke: “Heb je een voorbeeld, zodat ik weet wat ik moet veranderen?” Kom later terug met wat je ermee gedaan hebt.\n\nFeedforward, een term van Marshall Goldsmith, kijkt vooruit in plaats van terug: vraag om één of twee tips voor de volgende keer. Een scherpe vraag na elke workshop: “Wat moet ik de volgende sessie anders doen?” Die is eerlijker te beantwoorden dan “Hoe deed ik het?”',
      ],
      example: {
        kind: 'faded',
        text: 'De werksessie van vanochtend bij een voedingsmiddelenbedrijf. De operationeel directeur, 55 en je sponsor, beantwoordde elke vraag die jij aan zijn teamleiders stelde. Na de vierde keer zeiden de teamleiders niks meer.\n\nJij hebt nodig dat zij eigenaar worden van de acties. Na de lunch heb je even met hem.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Vraag toestemming en koppel het aan zijn doel: “Mag ik iets delen wat me vanochtend opviel? Het gaat erover dat de teamleiders hier eigenaar van worden, en daar vroeg je me om.”\n\nS: “Toen ik in de sessie de teamleiders vroeg naar de omstellingsdata,” G: “beantwoordde jij de eerste vier vragen zelf.” I: “Daarna zeiden Peter en Sandra niks meer, en ik heb hun commitment op de acties nodig.”\n\nVraag dan: “Hoe zag jij het?” En stop met praten. Is hij het ermee eens, bied dan aan: “Zullen we het volgende keer zo doen dat zij eerst antwoorden en jij daarna aanvult?”',
      },
      said: 'Wat je hoort in projecten: “Mag ik iets delen wat me vanochtend opviel? Het is klein, maar het doet ertoe voor de uitrol.”',
      recall: [
        {
          q: 'Welke hiervan is gedrag in SBI-termen?',
          options: ['Je was niet geïnteresseerd', 'Je bent te dominant', 'Je keek tijdens de sessie vier keer op je telefoon', 'Je hebt geen respect voor het team'],
          answer: 'Je keek tijdens de sessie vier keer op je telefoon',
          why: 'Gedrag is waarneembaar; de rest zijn interpretaties waar mensen zich tegen verdedigen.',
        },
        {
          q: 'Wat doe je direct nadat je de SBI hebt gegeven?',
          options: ['Een vraag stellen en luisteren', 'Je oplossing geven', 'Het herhalen zodat het landt', 'Nog twee punten geven nu je toch bezig bent'],
          answer: 'Een vraag stellen en luisteren',
          why: 'Zijn kant kan het beeld veranderen, en zo wordt een oordeel een gesprek.',
        },
        {
          q: 'Wat is de eerste stap als je feedback geeft aan een senior klant?',
          options: ['Je manager in de cc zetten', 'Toestemming vragen om een observatie te delen', 'Beginnen met drie complimenten', 'Het op papier zetten'],
          answer: 'Toestemming vragen om een observatie te delen',
          why: 'Door toestemming kiest de senior zelf om te luisteren, en dat haalt de verdediging eraf.',
        },
        {
          q: 'Een senior manager gaat tegen je feedback in: “Zo ging het niet.” Wat doe je?',
          options: ['De feiten nog stelliger herhalen', 'Het laten vallen en sorry zeggen', 'Escaleren naar de sponsor', 'Vragen wat hij zag'],
          answer: 'Vragen wat hij zag',
          why: 'De feiten opnieuw bevechten maakt er een wedstrijd van; zijn kijk kan je informatie geven die je miste.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. De teamleider planning, je belangrijkste contactpersoon, levert de weekdata elke week twee dagen te laat aan, waardoor je voor je analyse nog maar één dag hebt vóór de review op donderdag. Je hebt er nog niks over gezegd.',
        ask: 'Hoe breng je het bij hem in?',
        model: 'Ik zou om tien minuten vragen en zeggen: “Mag ik iets praktisch aankaarten? De afgelopen drie weken (S) kwam de data op woensdag in plaats van maandag (G). Dan heb ik nog één dag tot de review op donderdag, en wordt de analyse dunner (I). Wat maakt maandag lastig?” Daarna zou ik samen met hem een oplossing zoeken, zoals een automatische export.',
        rubric: [
          'Gebruikt situatie, waarneembaar gedrag en impact',
          'Stelt een vraag over zijn kant in plaats van iets aan te nemen',
          'Gaat door naar een concrete, gezamenlijke oplossing',
        ],
        pushback: {
          lines: [
            '“Twee dagen, echt? Je krijgt de data toch? Ik heb wel grotere brandjes te blussen.”',
            '“Maandag is onmogelijk. Het systeem sluit de week pas dinsdagavond af.”',
          ],
          model: '“Snap ik, en ik krijg het ook, dank je. Die twee dagen maken uit omdat de analyse dan dun wordt. Als het systeem dinsdagavond sluit, verschuiven we de review naar vrijdag, of zetten we een automatische export op die woensdagochtend vroeg klaarstaat. Wat werkt voor jou beter?”',
          rubric: [
            'Erkent zijn werkdruk en de beperking van het systeem',
            'Benoemt de impact helder',
            'Stelt concrete opties voor en laat hem kiezen',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden uit hoe je feedback geeft aan iemand die hoger in rang is dan jij.',
      terms: [
        { term: 'SBI', def: 'Situatie, Gedrag (Behaviour), Impact: een opbouw voor feedback op basis van wat je waarnam.' },
        { term: 'Waarneembaar gedrag', def: 'Wat een camera zou opnemen, zonder interpretatie.' },
        { term: 'Feedbacksandwich', def: 'Kritiek tussen twee complimenten; veel trainers raden het af omdat mensen de complimenten niet meer geloven.' },
        { term: 'Feedback naar boven', def: 'Feedback aan iemand met meer senioriteit of macht dan jij.' },
        { term: 'Feedforward', def: 'Vragen om tips voor de volgende keer in plaats van het verleden te beoordelen (Marshall Goldsmith).' },
      ],
    },
    {
      id: 'pm.lead.difficult',
      title: 'Moeilijke gesprekken',
      pre: [
        {
          q: 'Welk deel van een moeilijk gesprek bereiden de meeste mensen het minst voor, en hebben ze daarna het meest spijt van?',
          options: ['De feiten', 'De openingszin', 'De agenda', 'De vergaderruimte'],
          answer: 'De openingszin',
          why: 'Mensen bereiden argumenten voor en improviseren dan de start, en die zet de toon voor alles erna.',
        },
      ],
      teach: [
        'Elk moeilijk gesprek is drie gesprekken tegelijk (Stone, Patton en Heen, Difficult Conversations, 1999).\n\nHet gesprek over wat er gebeurde: de feiten, wie gelijk heeft. Het gevoelsgesprek: boosheid, schaamte, gekwetstheid. Het identiteitsgesprek: wat zegt dit over mij? Ben ik competent? Word ik serieus genomen?\n\nOnder druk praat het identiteitsgesprek het hardst, zeker als je de jongste in de kamer bent. Je merkt het aan jezelf als de drang om gelijk te krijgen.',
        'Bereid het op papier voor; een kwartier is meestal genoeg.\n\nWat zag je? Wat is waarschijnlijk zijn verhaal? Wat voel je? Wat was jouw bijdrage: wat deed jij, of liet je liggen, waardoor dit mede ontstond? Het boek ruilt schuld in voor bijdrage, want schuld kijkt terug en bijdrage helpt je het op te lossen.\n\nWat wil je aan het eind: één concrete afspraak? Schrijf dan de eerste twee zinnen op en zeg ze hardop; bij de opening gaan de meeste gesprekken mis.',
        'Open direct, met het “derde verhaal”: hoe een neutrale buitenstaander het verschil tussen jullie zou beschrijven. “Ik wil het hebben over de stilstanddata. We kijken er verschillend naar, en ik wil snappen hoe jij het ziet.”\n\nGeen lange aanloop; mensen voelen het aankomen en verkrampen. Over smalltalk verschillen de meningen: op een Nederlandse werkvloer is één zin genoeg, in sommige culturen is het overslaan onbeleefd. Open nooit per mail; de toon gaat verloren en standpunten verharden op papier.',
        'Blijf bij feiten en gevoelens. Scheid wat er gebeurde van wat jij ervan maakte. Benoem emoties als ze zichtbaar zijn: “Je klinkt gefrustreerd.”\n\nDan bedoeling tegenover impact: jouw impact ken jij, zijn bedoeling kent alleen hij. Beschuldig dus niet, maar vraag. “Ik denk niet dat je het zo bedoelde, maar het maakte het voor mij lastiger om mensen aan het praten te krijgen. Wat bedoelde je ermee?”',
        'Sluit af met een afspraak: wie doet wat wanneer, en hoe je het checkt. Zeg het hardop.\n\n“Dus jij stuurt het stilstandlogboek donderdag, en ik haal de vergelijking tussen de ploegen eruit. Kijken we er maandag samen naar?” Bevestig het dezelfde dag in twee zinnen.\n\nTypische valkuil: een goed gesprek, een warm gevoel, geen afspraak, en volgende week hetzelfde probleem. Een scherpe slotvraag: “Wat doen we vanaf morgen allebei anders?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 3 bij een verpakkingsbedrijf. Henk, teamleider van in de vijftig, zei waar jij bij stond tegen zijn ploeg: “Deze consultant denkt na twee weken onze lijn te kennen.”\n\nJe analyse moet vrijdag af en je hebt zijn lijndata nog steeds nodig. Je voelde je hoofd rood worden en zei niks.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Plan vandaag of morgen twintig minuten alleen met hem. Bereid voor: de feiten (wat hij zei, data niet ontvangen), zijn waarschijnlijke verhaal (een buitenstaander die over zijn lijn oordeelt, zijn ploeg die de schuld krijgt), je gevoel (schaamte, irritatie) en je identiteitsval (willen bewijzen dat je het kunt). Doel: data uiterlijk woensdag en Henk die de analyse vóór vrijdag checkt.\n\nOpening: “Henk, ik wil het hebben over je opmerking van maandag en over de data, want ik heb je hulp nodig om dit goed te krijgen.” Dan: “Toen je dat zei waar de ploeg bij was, werd het voor mij lastiger om mensen aan het praten te krijgen. Wat zit erachter?”\n\nLuister. Sluit af met de afspraak.',
      },
      said: 'Wat je hoort in projecten: “Ik wil het even over maandag hebben. Volgens mij zien we het niet hetzelfde, en ik wil horen hoe jij ernaar kijkt.”',
      recall: [
        {
          q: 'Welk van de drie gesprekken maakt je meestal defensief?',
          options: ['De feiten', 'De agenda', 'De planning', 'Het identiteitsgesprek: wat dit over jou zegt'],
          answer: 'Het identiteitsgesprek: wat dit over jou zegt',
          why: 'Als je competentie op het spel lijkt te staan, ga je verdedigen in plaats van luisteren.',
        },
        {
          q: 'Wat is een opening met het “derde verhaal”?',
          options: ['De situatie beschrijven zoals een neutrale buitenstaander dat zou doen', 'Een verhaal vertellen over een vorige klant', 'Beginnen met je eigen kijk', 'Een derde citeren die het met je eens is'],
          answer: 'De situatie beschrijven zoals een neutrale buitenstaander dat zou doen',
          why: 'Het benoemt het verschil zonder schuld, zodat jullie er allebei vanuit kunnen gaan.',
        },
        {
          q: 'Iemands opmerking heeft je project geschaad. Waar praat je over, en waar vraag je naar?',
          options: ['Je benoemt zijn bedoeling, je vraagt naar de feiten', 'Je praat over jouw impact, je vraagt naar zijn bedoeling', 'Je praat over allebei, je vraagt naar geen van beide', 'Je vermijdt allebei'],
          answer: 'Je praat over jouw impact, je vraagt naar zijn bedoeling',
          why: 'De impact op jou ken je; zijn bedoeling ken je niet, dus die vraag je.',
        },
        {
          q: 'Hoe sluit je een moeilijk gesprek goed af?',
          options: ['Met een grap om de spanning te breken', 'Door af te spreken dat jullie er nog eens over praten', 'Met een concrete afspraak die je hardop zegt: wie doet wat wanneer', 'Door hem het laatste woord te geven'],
          answer: 'Met een concrete afspraak die je hardop zegt: wie doet wat wanneer',
          why: 'Zonder uitgesproken afspraak gaan jullie allebei weg met een andere versie van wat er besloten is.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. Een senior planner heeft tegen je projectleider gezegd dat “die jonge consultant” de tijd van de planners verspilt met vragen. Je hoort het via via. Je hebt de planners nog twee weken nodig.',
        ask: 'Hoe pak je het aan?',
        model: 'Ik zou direct naar de planner gaan in plaats van het via anderen te laten lopen. “Ik hoorde dat je vindt dat mijn vragen te veel tijd van de planners kosten. Dat hoor ik liever van jou zelf, want ik heb hun input nog twee weken nodig. Wat zou beter werken?” Daarna zou ik iets concreets afspreken, zoals één vast halfuur per week, en dat per mail bevestigen.',
        rubric: [
          'Gaat direct naar de persoon in plaats van via anderen',
          'Opent neutraal en vraagt naar zijn kijk',
          'Sluit af met een concrete afspraak over hoe jullie samenwerken',
        ],
        pushback: {
          lines: [
            '“Ja, dat heb ik gezegd. Jouw vragen kosten uren en we zien nooit wat ermee gebeurt.”',
            '“We hebben werk te doen. Nog twee weken zo is te veel.”',
          ],
          model: '“Fijn dat je het direct zegt; ik hoor het liever van jou. Je hebt gelijk dat je nog niks terug hebt gezien. Vrijdag laat ik zien wat jullie antwoorden tot nu toe hebben opgeleverd. De komende twee weken: één vast halfuur per week, en ik neem mijn vragen mee in een lijstje.”',
          rubric: [
            'Erkent de kritiek zonder zich te verdedigen',
            'Maakt duidelijk dat de input van de planners nodig blijft',
            'Stelt een concrete, lichtere werkwijze voor en laat resultaat zien',
          ],
        },
      },
      sayIt: 'Leg een vriend in 60 seconden uit hoe je een gesprek voorbereidt dat je liever uit de weg gaat.',
      terms: [
        { term: 'Drie gesprekken', def: 'Wat er gebeurde, gevoelens en identiteit: alle drie spelen in elk moeilijk gesprek (Stone, Patton en Heen).' },
        { term: 'Identiteitsgesprek', def: 'De vraag in je hoofd wat dit over jou zegt: ben ik competent, word ik serieus genomen?' },
        { term: 'Bijdrage', def: 'Wat elke kant deed of liet liggen waardoor het probleem mede ontstond; in plaats van schuld.' },
        { term: 'Derde verhaal', def: 'De situatie beschrijven zoals een neutrale buitenstaander dat zou doen, als opening.' },
        { term: 'Bedoeling tegenover impact', def: 'Over het effect op jou mag jij praten; zijn bedoeling is aan hem, dus daar vraag je naar.' },
      ],
    },
    {
      id: 'pm.lead.teams',
      title: 'Teamdynamiek',
      pre: [
        {
          q: 'Een projectteam is het in overleggen nooit oneens, maar besluiten worden niet uitgevoerd. Wat is de meest waarschijnlijke oorzaak?',
          options: ['Kunstmatige harmonie: de onenigheid gaat ondergronds', 'Te veel conflict', 'Slechte notulen', 'Te veel overleggen'],
          answer: 'Kunstmatige harmonie: de onenigheid gaat ondergronds',
          why: 'Als mensen hun twijfels niet uitspreken, committeren ze zich ook niet, en het besluit sterft na het overleg stilletjes.',
        },
      ],
      teach: [
        'Een veelgebruikt model komt uit The Five Dysfunctions of a Team (2002) van Patrick Lencioni. Vertrouwen maakt gezond conflict mogelijk; conflict maakt echt commitment mogelijk; commitment maakt aanspreken en resultaat mogelijk.\n\nVertrouwen betekent hier: “ik weet het niet” of “dat deed ik fout” kunnen zeggen zonder dat je ervoor betaalt. Commitment betekent achter een besluit gaan staan, ook als je ertegen was. Aanspreken (accountability) betekent dat teamleden elkaar op afspraken aanspreken, in plaats van dat aan de baas over te laten.',
        'Amy Edmondson gebruikt een verwant begrip uit haar onderzoek naar werkteams (1999): psychologische veiligheid, het gedeelde gevoel dat je in dit team dat soort risico kunt nemen. Googles Project Aristotle, een intern onderzoek naar de eigen teams (2015, gepubliceerd als handleiding, niet wetenschappelijk getoetst), noemde het de belangrijkste van vijf teamfactoren die het vond.\n\nExperts wijzen erop dat de piramide van Lencioni een managementfabel is, met weinig hard onderzoek erachter; het werk van Edmondson heeft er veel meer. Gebruik Lencioni als kaart voor het gesprek, niet als wetenschap.',
        'Herken het.\n\nWeinig vertrouwen: mensen checken na het overleg bij hun baas, niemand geeft een fout toe. Geen conflict: wat Lencioni kunstmatige harmonie noemt, waarbij overleggen soepel lopen en de echte discussie bij de koffieautomaat gebeurt. Geen commitment: “we kijken ernaar”, acties zonder eigenaar, besluiten die de week erna weer opengaan. Niemand spreekt elkaar aan: alleen de consultant loopt achter gemiste acties aan.',
        'Als buitenstaander ben je niet de baas, maar je bepaalt wel mee hoe het overleg loopt. Maak onenigheid veilig: “Wat zou hier misgaan?” “Wie ziet het anders?” Doe een rondje en laat de stilste mensen eerst praten.\n\nEen pre-mortem helpt: “Het is drie maanden later en dit is mislukt. Hoe kan dat?” Gary Klein, die de methode bedacht, noemt (2007) een onderzoek van Mitchell, Russo en Pennington (1989) waarin mensen zo’n 30% beter de oorzaken vonden als ze zich voorstelden dat het al mislukt was.',
        'Zet commitment vast. Sluit elk besluit af met wie, wat en wanneer, en vraag: “Kan iedereen hiermee leven?” Stilte is geen ja, dus vraag de stille mensen bij naam. Stuur de besluiten dezelfde dag rond.\n\nKen je grenzen. Zijn twee managers in een stille oorlog het echte probleem, dan los je dat niet op in het teamoverleg. Breng wat je zag, en wat het met het project doet, één-op-één naar de sponsor. Een scherpe vraag voor jezelf: wie praat er na het overleg, en met wie?',
      ],
      example: {
        kind: 'faded',
        text: 'Een projectteam bij een machinebouwer: de teamleider onderhoud, de teamleider productie, twee operators, een planner en een kwaliteitsengineer. De overleggen zijn gezellig en er worden acties afgesproken, maar 60% is bij het volgende overleg niet gedaan.\n\nDe operators zeggen bijna nooit iets. Na afloop klaagt de teamleider productie bij jou over onderhoud.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Dit is kunstmatige harmonie zonder commitment, met daaronder weinig vertrouwen tussen productie en onderhoud.\n\nVolgend overleg: doe een rondje dat begint bij de operators, en houd een pre-mortem op de belangrijkste actie. Sluit elke actie af met een eigenaar en een datum, en vraag iedereen bij naam of hij ermee kan leven.\n\nPraat daarna één-op-één met de teamleider productie: “Je hebt me dit nu drie keer verteld. Ben je bereid het hem zelf te zeggen, met mij erbij?” Blijkt het een dieper conflict tussen de twee leidinggevenden, breng het dan bij de sponsor.',
      },
      said: 'Wat je hoort in projecten: “Dinsdag knikte iedereen. Donderdag wist niemand meer dat we het hadden afgesproken.”',
      recall: [
        {
          q: 'Wat komt in het model van Lencioni eerst: de basis waar de rest op bouwt?',
          options: ['Aanspreken', 'Vertrouwen', 'Commitment', 'Resultaat'],
          answer: 'Vertrouwen',
          why: 'Zonder vertrouwen geen open conflict, en zonder conflict geen echt commitment.',
        },
        {
          q: 'Wat is een teken van ontbrekend commitment?',
          options: ['Felle discussies in het overleg', 'Mensen die kritische vragen stellen', 'Acties zonder eigenaar en besluiten die de week erna weer opengaan', 'Een lange agenda'],
          answer: 'Acties zonder eigenaar en besluiten die de week erna weer opengaan',
          why: 'Mensen stonden er niet echt achter, dus het besluit blijft niet hangen.',
        },
        {
          q: 'Hoe krijg je als buitenstaander de stille teamleden aan het praten?',
          options: ['Wachten tot ze zelf iets zeggen', 'De manager vragen ze ertoe te dwingen', 'Achteraf een enquête sturen', 'Een rondje doen en de stilsten eerst laten praten'],
          answer: 'Een rondje doen en de stilsten eerst laten praten',
          why: 'Als de senioren al gesproken hebben, gaan anderen meestal mee; eerst mogen geeft ze ruimte.',
        },
        {
          q: 'Wat doet een pre-mortem?',
          options: ['Twijfels boven tafel halen door je voor te stellen dat het plan al mislukt is', 'Een afgerond project evalueren', 'Het budget controleren', 'Vooraf de schuld verdelen'],
          answer: 'Twijfels boven tafel halen door je voor te stellen dat het plan al mislukt is',
          why: 'Zorgen uitspreken wordt de opdracht, dus niemand lijkt negatief als hij ze noemt.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, in een team van planners en werkvoorbereiders. In overleggen praat de senior planner als eerste en het langst, en de rest is het met hem eens. Op de gang zeggen twee werkvoorbereiders tegen je dat het plan niet gaat werken.',
        ask: 'Wat verander je in het volgende overleg?',
        model: 'Ik zou de volgorde omgooien: “Voordat we besluiten, wil ik iedereen horen, te beginnen bij de werkvoorbereiders, want zij moeten dit bouwen.” Ik zou vragen: “Wat gaat hier in de praktijk mis?” En ik zou de senior planner vooraf vragen zijn mening tot het eind te bewaren, met als reden dat we de werkvoorbereiders mee willen krijgen.',
        rubric: [
          'Verandert wie als eerste praat in plaats van alleen om input te vragen',
          'Gebruikt een vraag die twijfels veilig maakt',
          'Bereidt de dominante persoon vooraf voor in plaats van hem in het overleg te confronteren',
        ],
        pushback: {
          lines: [
            '“Waarom moet ik ineens op mijn beurt wachten? Ik plan deze regio al twintig jaar.”',
            '“Als ze een probleem hadden met het plan, hadden ze dat kunnen zeggen. Niemand hield ze tegen.”',
          ],
          model: '“Juist om die twintig jaar wil ik jouw kijk, en die krijg je ook. Ik wil eerst iedereen horen, omdat sommige mensen pas praten als er ruimte is. Jij sluit de ronde af; daar weegt jouw ervaring het zwaarst. Zullen we het twee overleggen proberen?”',
          rubric: [
            'Erkent zijn ervaring en positie',
            'Houdt vast aan eerst ruimte voor de anderen',
            'Stelt een korte, concrete proef voor met een rol voor hem',
          ],
        },
      },
      sayIt: 'Leg een projectleider bij de klant in 60 seconden uit waarom een team dat het nooit oneens is een waarschuwingssignaal is.',
      terms: [
        { term: 'Commitment', def: 'Echt achter een besluit staan en ernaar handelen, ook als je ertegen was.' },
        { term: 'Aanspreken', def: 'Teamleden houden elkaar aan wat is afgesproken, in plaats van het aan de baas over te laten.' },
        { term: 'Psychologische veiligheid', def: 'Het gedeelde gevoel dat je fouten kunt toegeven en het oneens kunt zijn zonder daarvoor gestraft te worden (Edmondson).' },
        { term: 'Kunstmatige harmonie', def: 'Een team dat openlijke onenigheid vermijdt, zodat het conflict naar de gang verhuist (Lencioni).' },
        { term: 'Pre-mortem', def: 'Je voorstellen dat het plan mislukt is en vragen waarom, voordat je begint (Klein).' },
      ],
    },
    {
      id: 'pm.lead.listen',
      title: 'Luisteren onder druk',
      pre: [
        {
          q: 'Een plantmanager snauwt: “Dit project kost mijn mensen uren die we niet hebben.” Wat is de sterkste eerste reactie?',
          options: ['De voordelen van het project uitleggen', 'Laten zien dat de uren binnen de planning vallen', '“Uren die jullie niet hebben. Waar gaan ze nu in zitten?”', 'Beloven dat er minder overleggen komen'],
          answer: '“Uren die jullie niet hebben. Waar gaan ze nu in zitten?”',
          why: 'Eerst terugspiegelen, dan vragen: dat haalt de hitte eraf en je hoort het echte probleem voordat je antwoordt.',
        },
      ],
      teach: [
        'Actief luisteren, een term van de psychologen Carl Rogers en Richard Farson (1957), betekent luisteren om te begrijpen, niet om te antwoorden. MORE PIES is er een handige checklist voor.\n\nMood: lees de sfeer in de kamer vóór de inhoud. Open vragen: wat en hoe, geen ja of nee; met een open vraag vertelt de ander het verhaal. Reflecteren: geef het gevoel terug. Empathie: laat zien dat je snapt waarom het ertoe doet.',
        'Parafraseren: zeg de inhoud in je eigen woorden. Inquiry: vraag één laag dieper door. Experience: deel je eigen ervaring alleen als het de ander helpt. Silence: laat stilte werken.\n\nOnder druk schiet je meteen in verdedigen of oplossen. De regel: eerst reflecteren of parafraseren, dan vragen, dan pas antwoorden. Reflecteren: “Dat klinkt frustrerend.” Parafraseren: “Dus die formulieren kostten meer tijd dan de verandering opleverde.” Wie het project aanvalt, heeft er meestal een zorg onder: werkdruk, schuld, controle kwijtraken.',
        'Stilte. Tel na een vraag in je hoofd tot vijf.\n\nIn klasonderzoek uit de jaren zeventig zag Mary Budd Rowe dat leraren zo’n één seconde op een antwoord wachtten; wachtten ze drie seconden of langer, dan werden de antwoorden langer en doordachter. Volwassenen in een overleg zijn niet anders: het echte antwoord komt vaak na het eerste. Je op je gemak voelen bij stilte komt over als zelfvertrouwen, en dat helpt als je de jongste bent.',
        'Vragen die openen: “Waar maak je je het meeste zorgen over?” “Wat moet er waar zijn om dit te laten werken?” “Wat hebben jullie eerder geprobeerd?” “Wat mis ik?”\n\nVermijd “waarom” als de emoties hoog zitten: het klinkt als een verwijt. Zeg liever “wat maakte dat je…”.\n\nDe typische valkuil is de nepvraag: “Vind je ook niet dat we…?” Mensen horen welk antwoord je wilt, geven het je, en je leert niks.',
        'Ervaring, goed gebruikt. De valkuil is “Bij een vorige klant hadden we precies hetzelfde…”, en dan pak je de ander het woord af.\n\nGebruik het als brug: één zin, en geef het terug. “Ik heb dat zien misgaan als de mensen die het werk doen niet werden gevraagd. Is dat hier ook gebeurd?”\n\nCheck jezelf na een lastig overleg: wat heb ik geleerd dat ik nog niet wist? Niks? Dan heb je meer gepraat dan geluisterd.',
      ],
      example: {
        kind: 'faded',
        text: 'Teamoverleg bij een netbeheerder. Je hebt net het plan laten zien.\n\nEen senior werkvoorbereider zegt hardop: “Zo’n project hebben we drie jaar geleden ook gedaan. Er veranderde niks, we kregen alleen meer formulieren.” Het wordt stil en iedereen kijkt naar jou.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Mood: gespannen; ga er niet defensief tegenin. Reflecteer: “Dus je hebt dit eerder meegemaakt, en het leverde je vooral meer werk op.” Dan stilte: wacht.\n\nOpen vraag: “Wat gebeurde er toen? Waardoor eindigde het in formulieren?” Parafraseer zijn antwoord: “Dus het probleem was dat de werkvoorbereiders niet gevraagd werden, en de formulieren kwamen van het hoofdkantoor.”\n\nEmpathie: “Ik snap dat je sceptisch bent.” Spreek dan iets af: “Ik wil graag dat je me zegt als je ziet dat dit dezelfde kant op gaat. Wil je donderdag samen met mij naar de check kijken?”',
      },
      said: 'Wat je hoort in projecten: “Dat hebben we al eens geprobeerd.” En het antwoord dat werkt: “Wat gebeurde er toen?”',
      recall: [
        {
          q: 'Wat is het verschil tussen reflecteren en parafraseren?',
          options: ['Er is geen verschil', 'Reflecteren is een vraag, parafraseren een stelling', 'Reflecteren is voor senioren, parafraseren voor junioren', 'Reflecteren geeft het gevoel terug, parafraseren de inhoud'],
          answer: 'Reflecteren geeft het gevoel terug, parafraseren de inhoud',
          why: '“Dat klinkt frustrerend” is reflecteren; “dus de formulieren kostten meer dan ze opleverden” is parafraseren.',
        },
        {
          q: 'Waarom vermijd je “waarom”-vragen als de emoties hoog zitten?',
          options: ['Ze zijn te lang', 'Ze klinken als een verwijt', 'Het zijn gesloten vragen', 'Ze zijn te persoonlijk'],
          answer: 'Ze klinken als een verwijt',
          why: '“Waarom deed je…” lokt een verdediging uit; “wat maakte dat je…” lokt een uitleg uit.',
        },
        {
          q: 'Hoe lang moet je na een vraag stil kunnen blijven?',
          options: ['Zo’n vijf seconden, of langer', 'Eén seconde', 'Helemaal niet; vul het gat snel', 'Tot de senior iets zegt'],
          answer: 'Zo’n vijf seconden, of langer',
          why: 'Het doordachte antwoord komt meestal na het eerste snelle.',
        },
        {
          q: 'Hoe gebruik je je eigen ervaring zonder het gesprek over te nemen?',
          options: ['Het hele verhaal vertellen zodat ze zien dat je het kent', 'Het nooit noemen', 'Eén zin, en dan een vraag die het teruggeeft', 'Alleen aan het eind van het overleg'],
          answer: 'Eén zin, en dan een vraag die het teruggeeft',
          why: 'Ervaring werkt als brug naar hun verhaal, niet als vervanging ervan.',
        },
      ],
      situation: {
        scene: 'Je zit in een stuurgroep bij een productiebedrijf. De financieel directeur valt in: “Eerlijk gezegd zie ik niet wat we voor dit geld krijgen.” De sponsor kijkt naar jou.',
        ask: 'Wat zeg je als eerste?',
        model: 'Ik zou niet meteen de voordelen gaan opsommen. Eerst: “Je ziet het rendement nog niet.” Even stilte. Dan: “Wat moet je zien om te weten dat het de moeite waard is?” Daarna parafraseer ik zijn antwoord, en pas dan koppel ik wat we hebben, of zeg ik eerlijk wat we nog niet hebben en wanneer wel.',
        rubric: [
          'Reflecteert of parafraseert voordat hij zich verdedigt',
          'Stelt een open vraag om zijn echte criterium te vinden',
          'Antwoordt op zijn criterium, en is eerlijk over wat er nog ontbreekt',
        ],
        pushback: {
          lines: [
            '“Mooi verhaal, maar ik vroeg wat we voor het geld krijgen. Ik wil een getal, geen proces.”',
            '“En als je me vandaag geen getal kunt geven, waarom zou ik er volgende maand dan wel een geloven?”',
          ],
          model: '“Terechte vraag, en je hoort een getal te krijgen. Vandaag kunnen we één hard getal laten zien: het overwerk op de pilotlijnen is met een vijfde gedaald. De rest is nog een prognose, en die ga ik niet mooier maken. Ik stuur je morgen de berekening, dan kun je hem zelf nalopen.”',
          rubric: [
            'Erkent de vraag als terecht',
            'Antwoordt direct en eerlijk, zonder te overdrijven',
            'Stelt een concrete opvolging voor die hij kan controleren',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden MORE PIES uit, met één voorbeeldzin bij elke letter die jij het lastigst vindt.',
      terms: [
        { term: 'Actief luisteren', def: 'Luisteren om te begrijpen in plaats van om te antwoorden, en dat laten merken (Rogers en Farson).' },
        { term: 'MORE PIES', def: 'Een checklist voor actief luisteren: Mood (sfeer), Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry (doorvragen), Experience (ervaring), Silence (stilte).' },
        { term: 'Open vraag', def: 'Een wat- of hoe-vraag die je niet met ja of nee kunt beantwoorden.' },
        { term: 'Reflecteren', def: 'Het gevoel teruggeven dat je hoort: “Dat klinkt frustrerend.”' },
        { term: 'Parafraseren', def: 'De inhoud in je eigen woorden herhalen om te checken of je het goed begreep.' },
      ],
    },
    {
      id: 'pm.lead.self',
      title: 'Jezelf leiden',
      pre: [
        {
          q: 'Vlak voor een grote presentatie bonkt je hart. Welke aanpak werkte in experimenten beter?',
          options: ['Tegen jezelf zeggen dat je rustig moet worden', 'Minder voorbereiden zodat je niet gaat malen', 'Oogcontact met senioren vermijden', 'Tegen jezelf zeggen “ik heb er zin in”'],
          answer: 'Tegen jezelf zeggen “ik heb er zin in”',
          why: 'Zenuwen en opwinding voelen in je lijf hetzelfde; het als opwinding benoemen gaf betere prestaties (Brooks, 2014).',
        },
      ],
      teach: [
        'De jongste zijn. Een eerste indruk ontstaat snel: in een bekend onderzoek (Willis en Todorov, 2006) beoordeelden mensen een gezicht als betrouwbaar of competent na het een tiende seconde te zien. In een overleg schatten mensen je vroeg in op voorbereiding en rust, niet alleen op leeftijd.\n\nWat werkt: ken je cijfers uit je hoofd, ga aan tafel zitten en niet langs de muur, zeg in de eerste tien minuten iets, en laat het voorbehoud weg. Niet “Sorry, misschien een domme vraag”, maar “Eén vraag:”.',
        'Veel capabele mensen voelen zich een bedrieger die door de mand gaat vallen. De psychologen Pauline Clance en Suzanne Imes beschreven dat in 1978 als het impostor phenomenon; nu heet het meestal het impostersyndroom, al is het geen medische diagnose. Het komt veel voor bij mensen die hoog presteren en bij starters.\n\nHet medicijn is niet eerst zelfvertrouwen voelen. Het is handelen op bewijs: wat heb ik voorbereid, en wat weet ik dat zij niet weten?',
        'Zenuwen. De spanning in je lijf vóór een groot moment voelt als opwinding. In experimenten van Alison Wood Brooks (2014) deden mensen die vóór een toespraak of rekentoets “ik heb er zin in” (I’m excited) zeiden het beter dan mensen die probeerden te kalmeren. Dat herkaderen werkt omdat je de energie gebruikt in plaats van bevecht.\n\nAdem een minuut of twee langer uit dan in; dat kan je hartslag omlaag brengen. Bereid je eerste dertig seconden woord voor woord voor, zodat je op de rails staat als de adrenaline piekt.',
        'Zeg het gewoon. Een assertieve uitspraak heeft drie delen: wat je ziet, wat je denkt, wat je voorstelt. “De data beslaat twee weken. Ik vind dit te vroeg. Ik stel voor dat we de hele maand afwachten.”\n\nWeet je het niet: “Dat weet ik nog niet. Ik kom er donderdag bij je op terug.” Geeft een senior tegengas, bind dan niet meteen in en escaleer niet: “Terecht punt. Wat ik in de data zie, is dit. Hoe kijk jij daarnaar?” Eén keer rustig vasthouden is vaak genoeg.',
        'Herstel na een slecht overleg. Schrijf binnen 24 uur de feiten op, jouw aandeel, en wat je anders zou doen. Kom dan in actie: een kort bericht aan de persoon, zoals “Ik heb het gisteren niet goed uitgelegd; hier is het A4’tje.”\n\nHad je het mis, zeg dat dan snel; ook dat bouwt geloofwaardigheid op. Bespreek het met iemand die je vertrouwt. Eén slecht overleg bepaalt zelden wie je bent; hoe je het opvolgt vaak wel. De scherpe vraag: welk ene ding doe ik de volgende keer anders?',
      ],
      example: {
        kind: 'faded',
        text: 'Je presenteerde de eerste resultaten aan het MT (managementteam) van een productiebedrijf. Na twee minuten viel de financieel directeur in: “Deze cijfers kloppen niet met de onze.”\n\nJe raakte de draad kwijt, raffelde de rest af en was te vroeg klaar. Nu zit je weer achter je bureau en speelt het steeds opnieuw af in je hoofd.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Eerst de feiten: zijn getal en het jouwe verschillen, waarschijnlijk door een andere periode of definitie. Zoek uit welke, voor al het andere.\n\nJouw aandeel: je noemde aan het begin je bron en definities niet, en je nam geen pauze toen hij inviel. Kom vandaag in actie: mail hem, “Je had een terecht punt over de cijfers. Wij gebruiken het eigen stilstandlogboek van de lijn over maart; ik wil graag een kwartier om ze voor het volgende MT met de jouwe gelijk te trekken.”\n\nVraag je manager hoe het overkwam. Open de volgende keer met bron en definities, en heb een zin klaar: “Goed punt. Welk cijfer heb jij?”',
      },
      said: 'Wat je hoort in projecten: “Dat weet ik nog niet. Ik kom er donderdag bij je op terug.”',
      recall: [
        {
          q: 'Welke opening klinkt het zelfverzekerdst in een overleg met senioren?',
          options: ['“Sorry, misschien een domme vraag, maar…”', '“Ik ben maar de consultant, maar…”', '“Eén vraag:”', '“Misschien zit ik ernaast, maar wellicht…”'],
          answer: '“Eén vraag:”',
          why: 'Excuses en voorbehouden maken je kleiner voordat je iets gezegd hebt.',
        },
        {
          q: 'Een senior manager vraagt iets wat je niet weet. Wat is het beste antwoord?',
          options: ['Je beste gok als feit brengen', '“Dat weet ik nog niet. Ik kom er donderdag bij je op terug.”', 'Over iets anders beginnen', 'Hem doorverwijzen naar je manager'],
          answer: '“Dat weet ik nog niet. Ik kom er donderdag bij je op terug.”',
          why: 'Het is eerlijk en er zit een toezegging aan; bluffen valt vroeg of laat door de mand.',
        },
        {
          q: 'Welk ademritme helpt het snelst tegen zenuwen?',
          options: ['Korte, snelle ademhalingen', 'Je adem inhouden', 'Langer in- dan uitademen', 'Langer uit- dan inademen'],
          answer: 'Langer uit- dan inademen',
          why: 'Een lange uitademing zet het kalmerende deel van je zenuwstelsel aan, en binnen een minuut of twee kan je hartslag dalen.',
        },
        {
          q: 'Wat doe je als eerste na een overleg dat slecht ging?',
          options: ['De feiten opschrijven, jouw aandeel, en wat je anders zou doen', 'De persoon een tijdje ontlopen', 'Iedereen uitleggen waarom het niet aan jou lag', 'Het vergeten en doorgaan'],
          answer: 'De feiten opschrijven, jouw aandeel, en wat je anders zou doen',
          why: 'Feiten stoppen het malen in je hoofd en geven je een concrete volgende stap.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder en gaat zo een workshop leiden met acht ervaren planners, de meesten boven de 45. In de rij bij de koffie zegt er een half grappend: “Dus jij komt ons vertellen hoe we moeten plannen?”',
        ask: 'Wat zeg je, en hoe open je de workshop?',
        model: 'Ik zou glimlachen en zeggen: “Nee, jullie weten veel meer van plannen dan ik. Ik help zoeken waar de tijd blijft.” In de workshop zou ik openen met één scherp feit uit hun eigen data, en dan vragen: “Wat zien jullie hierin?” Zo staat hun vakkennis voorop en laat ik zien dat ik mijn huiswerk heb gedaan.',
        rubric: [
          'Reageert rustig zonder sorry te zeggen of defensief te worden',
          'Opent met een concreet feit uit hun eigen data',
          'Zet hun vakkennis centraal met een open vraag',
        ],
        pushback: {
          lines: [
            '“Niet persoonlijk bedoeld, maar ik maakte hier al planningen toen jij nog op de basisschool zat.”',
            '“We hebben wel vaker workshops gehad. Veel geeltjes, en daarna verandert er niks.”',
          ],
          model: '“Ik vat het niet persoonlijk op; juist om die ervaring zit je hier. Ik kom jullie niet vertellen hoe je moet plannen. Ik neem de data mee over waar klussen vastlopen, jullie vertellen me wat het betekent. En aan het eind kiezen we één ding, met een naam en een datum erbij.”',
          rubric: [
            'Reageert rustig op zijn ervaring, niet defensief',
            'Maakt zijn eigen rol helder',
            'Stelt een concrete uitkomst voor de workshop voor',
          ],
        },
      },
      sayIt: 'Leg een nieuwe junior consultant in 60 seconden uit hoe jij ermee omgaat dat je de jongste in de kamer bent.',
      terms: [
        { term: 'Voorbehoud', def: 'Een verzachtend zinnetje zoals “misschien een domme vraag”, dat je kleiner maakt voordat je iets gezegd hebt.' },
        { term: 'Impostersyndroom', def: 'Je een bedrieger voelen die door de mand gaat vallen, ondanks bewijs dat je het kunt (Clance en Imes, 1978).' },
        { term: 'Herkaderen', def: 'Zenuwen opwinding noemen, zodat dezelfde energie je helpt in plaats van blokkeert.' },
        { term: 'Assertieve uitspraak', def: 'Wat je ziet, wat je denkt, wat je voorstelt, gewoon gezegd.' },
        { term: 'Herstel', def: 'Feiten, jouw aandeel en één actie binnen 24 uur na een overleg dat slecht ging.' },
      ],
    },
  ],
};
